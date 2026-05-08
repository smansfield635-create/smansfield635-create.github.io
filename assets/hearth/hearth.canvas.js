// /assets/hearth/hearth.canvas.js
// HEARTH_G3_DEFINITIVE_LANDMASS_AND_ZONING_STANDARD_TNT_v1
// Full-file replacement.
// First true Hearth Generation 3 standard.
// Purpose:
// - Establish definitive planetary landmasses.
// - Establish bounded cartographic zoning: regions, countries, states/provinces, and city-zone seats.
// - Retire decorative globe renderer, shell renderer, hydration-first path, terrain-detail-first path, and mountain-first path.
// - "Globe" remains website language. Constructed/rendered object is a planet.
// - No hydration, rivers, mountains, weather, climate, clouds, humidity, or atmospheric moisture.
// - No external image. No generated image. No GraphicBox.
// - One active canvas authority. One visible draw path.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_DEFINITIVE_LANDMASS_AND_ZONING_STANDARD_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-definitive-landmass-zoning-standard";
  const RECEIPT = "HEARTH_G3_DEFINITIVE_LANDMASS_AND_ZONING_RECEIPT";

  const MIN_SIZE = 300;
  const MAX_SIZE = 480;
  const TAU = Math.PI * 2;

  [
    "__HEARTH_CANVAS_G3_ZONING_DISPOSE__",
    "__HEARTH_CANVAS_PLANET_BODY_DISPOSE__",
    "__HEARTH_CANVAS_VISIBLE_DISPOSE__",
    "__HEARTH_CANVAS_G3_DISPOSE__",
    "__HEARTH_CANVAS_G3_10_DISPOSE__",
    "__HEARTH_CANVAS_DISPOSE__",
    "__HEARTH_G2_DISPOSE__"
  ].forEach((name) => {
    if (typeof window[name] === "function") {
      try {
        window[name]();
      } catch (_) {}
    }

    try {
      window[name] = null;
    } catch (_) {}
  });

  const runtime = {
    disposed: false,
    mounted: false,
    raf: 0,
    lastFrame: 0,
    mount: null,
    canvas: null,
    ctx: null,
    buffer: null,
    bufferCtx: null,
    image: null,
    size: 0,
    observer: null
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, clamp(t, 0, 1)));

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / ((b - a) || 1e-9), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cross3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function norm3(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  function rotateX(v, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
  }

  function rotateY(v, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  }

  function dirFromLonLat(lonDeg, latDeg) {
    const lon = lonDeg * Math.PI / 180;
    const lat = latDeg * Math.PI / 180;
    const cl = Math.cos(lat);
    return [cl * Math.sin(lon), Math.sin(lat), cl * Math.cos(lon)];
  }

  function makeBasis(center) {
    const up = Math.abs(center[1]) > 0.92 ? [1, 0, 0] : [0, 1, 0];
    const east = norm3(cross3(up, center));
    const north = norm3(cross3(center, east));
    return { east, north };
  }

  function cap(v, center, radius, amplitude) {
    const d = dot3(v, center);
    const edge = Math.cos(radius);
    return smoothstep(edge, 1, d) * amplitude;
  }

  function wave(v, seed) {
    return (
      Math.sin(v[0] * 7.13 + v[1] * 2.31 + v[2] * 4.71 + seed) * 0.50 +
      Math.cos(v[0] * 3.77 - v[1] * 6.11 + v[2] * 2.19 + seed * 1.7) * 0.50
    );
  }

  function hashInt(a, b, c) {
    const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  const LANDMASSES = [
    {
      id: "LM01",
      name: "Northwest Crown",
      center: dirFromLonLat(-112, 38),
      color: [143, 119, 78],
      regionX: 2,
      regionY: 2,
      countryX: 4,
      countryY: 3,
      stateX: 8,
      stateY: 6,
      cores: [
        [-112, 38, 0.54, 1.10],
        [-138, 50, 0.30, 0.50],
        [-91, 20, 0.36, 0.62]
      ],
      cuts: [
        [-122, 0, 0.26, 0.32],
        [-75, 46, 0.22, 0.22]
      ]
    },
    {
      id: "LM02",
      name: "Southwest Root",
      center: dirFromLonLat(-56, -24),
      color: [132, 115, 74],
      regionX: 2,
      regionY: 3,
      countryX: 3,
      countryY: 5,
      stateX: 6,
      stateY: 10,
      cores: [
        [-58, -12, 0.42, 0.92],
        [-68, -36, 0.30, 0.62],
        [-42, -48, 0.18, 0.36]
      ],
      cuts: [
        [-36, 6, 0.18, 0.30]
      ]
    },
    {
      id: "LM03",
      name: "Central Hearthland",
      center: dirFromLonLat(18, 26),
      color: [150, 126, 82],
      regionX: 3,
      regionY: 2,
      countryX: 6,
      countryY: 4,
      stateX: 12,
      stateY: 8,
      cores: [
        [18, 28, 0.62, 1.18],
        [-6, 6, 0.32, 0.54],
        [43, 14, 0.36, 0.64]
      ],
      cuts: [
        [32, -12, 0.22, 0.26],
        [3, 44, 0.18, 0.20]
      ]
    },
    {
      id: "LM04",
      name: "Eastern Span",
      center: dirFromLonLat(82, 33),
      color: [134, 124, 83],
      regionX: 3,
      regionY: 2,
      countryX: 6,
      countryY: 4,
      stateX: 12,
      stateY: 8,
      cores: [
        [64, 18, 0.46, 0.76],
        [101, 39, 0.54, 0.90],
        [121, 6, 0.24, 0.34]
      ],
      cuts: [
        [79, -3, 0.28, 0.38],
        [117, 28, 0.17, 0.20]
      ]
    },
    {
      id: "LM05",
      name: "Austral Table",
      center: dirFromLonLat(122, -28),
      color: [163, 128, 78],
      regionX: 2,
      regionY: 2,
      countryX: 4,
      countryY: 3,
      stateX: 8,
      stateY: 6,
      cores: [
        [122, -28, 0.38, 0.82],
        [148, -42, 0.16, 0.34]
      ],
      cuts: [
        [104, -12, 0.20, 0.24]
      ]
    },
    {
      id: "LM06",
      name: "North Arc",
      center: dirFromLonLat(160, 56),
      color: [128, 124, 92],
      regionX: 2,
      regionY: 2,
      countryX: 4,
      countryY: 3,
      stateX: 8,
      stateY: 6,
      cores: [
        [158, 52, 0.34, 0.56],
        [-166, 58, 0.26, 0.36]
      ],
      cuts: [
        [176, 43, 0.14, 0.16]
      ]
    }
  ].map((landmass, index) => {
    const basis = makeBasis(landmass.center);

    return Object.freeze({
      ...landmass,
      index,
      basis,
      cores: landmass.cores.map(([lon, lat, radius, amplitude]) => ({
        center: dirFromLonLat(lon, lat),
        radius,
        amplitude
      })),
      cuts: landmass.cuts.map(([lon, lat, radius, amplitude]) => ({
        center: dirFromLonLat(lon, lat),
        radius,
        amplitude
      }))
    });
  });

  function scoreLandmass(v, landmass) {
    let score = -0.54;

    for (const core of landmass.cores) {
      score += cap(v, core.center, core.radius, core.amplitude);
    }

    for (const cut of landmass.cuts) {
      score -= cap(v, cut.center, cut.radius, cut.amplitude);
    }

    score += wave(v, landmass.index + 1) * 0.045;

    return score;
  }

  function gridLine(value, count, width) {
    const scaled = value * count;
    const frac = scaled - Math.floor(scaled);
    const d = Math.min(frac, 1 - frac);
    return 1 - smoothstep(width, width * 2.25, d);
  }

  function localCoords(v, landmass) {
    const x = dot3(v, landmass.basis.east);
    const y = dot3(v, landmass.basis.north);
    const z = dot3(v, landmass.center);
    const scale = clamp(1.38 - z * 0.30, 0.86, 1.22);

    return {
      u: clamp(0.5 + x * 0.62 * scale, 0, 1),
      q: clamp(0.5 + y * 0.62 * scale, 0, 1)
    };
  }

  function citySeat(u, q, landmassIndex) {
    const cx = 10;
    const cy = 8;
    const gx = Math.floor(u * cx);
    const gy = Math.floor(q * cy);
    const fu = u * cx - gx;
    const fq = q * cy - gy;
    const h = hashInt(gx + landmassIndex * 17, gy + 11, landmassIndex + 3);

    if (h < 0.68) return 0;

    const dx = Math.abs(fu - 0.5);
    const dy = Math.abs(fq - 0.5);
    const d = Math.hypot(dx, dy);

    return 1 - smoothstep(0.024, 0.052, d);
  }

  function samplePlanet(v) {
    let best = null;

    for (const landmass of LANDMASSES) {
      const score = scoreLandmass(v, landmass);
      if (!best || score > best.score) {
        best = { landmass, score };
      }
    }

    const threshold = 0.045;
    const land = best.score > threshold;
    const coast = 1 - smoothstep(0.012, 0.080, Math.abs(best.score - threshold));
    const waterDepth = land ? 0 : clamp((threshold - best.score) * 2.2, 0, 1);
    const shelf = land ? 0 : clamp(coast * 0.92, 0, 1);

    if (!land) {
      return {
        land: false,
        waterDepth,
        shelf,
        coast,
        landmass: null,
        regionLine: 0,
        countryLine: 0,
        stateLine: 0,
        citySeat: 0
      };
    }

    const { u, q } = localCoords(v, best.landmass);

    const regionCurveU = u + Math.sin(q * TAU * 1.1 + best.landmass.index) * 0.012;
    const regionCurveQ = q + Math.sin(u * TAU * 1.0 + best.landmass.index * 1.7) * 0.012;

    const countryCurveU = u + Math.sin(q * TAU * 2.0 + best.landmass.index) * 0.010;
    const countryCurveQ = q + Math.sin(u * TAU * 2.0 + best.landmass.index * 1.3) * 0.010;

    const stateCurveU = u + Math.sin(q * TAU * 3.1 + best.landmass.index) * 0.006;
    const stateCurveQ = q + Math.sin(u * TAU * 3.0 + best.landmass.index * 1.1) * 0.006;

    const regionLine = Math.max(
      gridLine(regionCurveU, best.landmass.regionX, 0.010),
      gridLine(regionCurveQ, best.landmass.regionY, 0.010)
    );

    const countryLine = Math.max(
      gridLine(countryCurveU, best.landmass.countryX, 0.006),
      gridLine(countryCurveQ, best.landmass.countryY, 0.006)
    );

    const stateLine = Math.max(
      gridLine(stateCurveU, best.landmass.stateX, 0.0032),
      gridLine(stateCurveQ, best.landmass.stateY, 0.0032)
    );

    const zoneSeat = citySeat(u, q, best.landmass.index);

    return {
      land: true,
      waterDepth: 0,
      shelf: 0,
      coast,
      landmass: best.landmass,
      u,
      q,
      regionLine: regionLine * smoothstep(threshold + 0.015, threshold + 0.12, best.score),
      countryLine: countryLine * smoothstep(threshold + 0.025, threshold + 0.14, best.score),
      stateLine: stateLine * smoothstep(threshold + 0.035, threshold + 0.16, best.score),
      citySeat: zoneSeat * smoothstep(threshold + 0.06, threshold + 0.18, best.score)
    };
  }

  function colorPlanet(s) {
    if (!s.land) {
      let r = mix(16, 5, s.waterDepth);
      let g = mix(92, 48, s.waterDepth);
      let b = mix(126, 110, s.waterDepth);

      r = mix(r, 34, s.shelf * 0.82);
      g = mix(g, 164, s.shelf * 0.78);
      b = mix(b, 178, s.shelf * 0.74);

      return [r, g, b];
    }

    let [r, g, b] = s.landmass.color;

    r = mix(r, 78, s.stateLine * 0.22);
    g = mix(g, 98, s.stateLine * 0.22);
    b = mix(b, 82, s.stateLine * 0.22);

    r = mix(r, 56, s.countryLine * 0.40);
    g = mix(g, 72, s.countryLine * 0.40);
    b = mix(b, 64, s.countryLine * 0.40);

    r = mix(r, 236, s.regionLine * 0.46);
    g = mix(g, 198, s.regionLine * 0.38);
    b = mix(b, 112, s.regionLine * 0.26);

    r = mix(r, 245, s.citySeat * 0.72);
    g = mix(g, 230, s.citySeat * 0.58);
    b = mix(b, 168, s.citySeat * 0.42);

    r = mix(r, 210, s.coast * 0.12);
    g = mix(g, 186, s.coast * 0.10);
    b = mix(b, 126, s.coast * 0.08);

    return [r, g, b];
  }

  function installStyle() {
    const old = document.getElementById("hearth-g3-zoning-standard-style");
    if (old) old.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-zoning-standard-style";
    style.textContent = `
      html,
      body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch !important;
      }

      #hearthCanvasMount,
      [data-hearth-mount] {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        touch-action: pan-y !important;
      }

      #hearthCanvasMount canvas[data-hearth-canvas],
      [data-hearth-mount] canvas[data-hearth-canvas] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        touch-action: pan-y !important;
      }
    `;

    document.head.appendChild(style);
  }

  function unlockScroll() {
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.touchAction = "pan-y";

    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";
    document.body.style.touchAction = "pan-y";
    document.body.style.webkitOverflowScrolling = "touch";
  }

  function getMount() {
    const mount =
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-mount]") ||
      document.querySelector("[data-render='hearth']");

    if (mount) return mount;

    const fallback = document.createElement("section");
    fallback.id = "hearthCanvasMount";
    fallback.dataset.hearthMount = "true";
    fallback.style.position = "relative";
    fallback.style.width = "100%";
    fallback.style.aspectRatio = "1 / 1";
    fallback.style.minHeight = "300px";

    const parent = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
    parent.appendChild(fallback);

    return fallback;
  }

  function resize() {
    if (!runtime.mount || !runtime.canvas || !runtime.buffer || !runtime.bufferCtx) return;

    const rect = runtime.mount.getBoundingClientRect();
    const cssSize = Math.max(
      MIN_SIZE,
      Math.floor(Math.min(rect.width || MIN_SIZE, rect.height || rect.width || MIN_SIZE))
    );

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const px = Math.max(MIN_SIZE, Math.floor(cssSize * dpr));
    const workSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, px));

    runtime.canvas.width = px;
    runtime.canvas.height = px;

    if (runtime.size !== workSize) {
      runtime.size = workSize;
      runtime.buffer.width = workSize;
      runtime.buffer.height = workSize;
      runtime.image = runtime.bufferCtx.createImageData(workSize, workSize);
    }
  }

  function paintBackplate(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.5, h * 0.48, w * 0.04, w * 0.5, h * 0.5, w * 0.68);
    bg.addColorStop(0, "rgba(42,85,116,0.16)");
    bg.addColorStop(0.54, "rgba(12,30,52,0.54)");
    bg.addColorStop(1, "rgba(2,7,15,1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  function paintPlanet(time) {
    const size = runtime.size;
    const image = runtime.image;

    if (!size || !image) return;

    const data = image.data;
    data.fill(0);

    const cx = size * 0.5;
    const cy = size * 0.505;
    const radius = size * 0.405;

    const spin = time * 0.000041;
    const tilt = -0.10;

    const yMin = Math.max(0, Math.floor(cy - radius - 2));
    const yMax = Math.min(size - 1, Math.ceil(cy + radius + 2));
    const xMin = Math.max(0, Math.floor(cx - radius - 2));
    const xMax = Math.min(size - 1, Math.ceil(cx + radius + 2));

    for (let y = yMin; y <= yMax; y += 1) {
      const sy = (y - cy) / radius;
      const sy2 = sy * sy;

      for (let x = xMin; x <= xMax; x += 1) {
        const sx = (x - cx) / radius;
        const d2 = sx * sx + sy2;

        if (d2 > 1) continue;

        const z = Math.sqrt(1 - d2);

        let v = [sx, -sy, z];
        v = rotateX(v, tilt);
        v = rotateY(v, spin);
        v = norm3(v);

        const s = samplePlanet(v);
        let [rr, gg, bb] = colorPlanet(s);

        const curve = 0.990 + Math.pow(z, 1.08) * 0.030;
        rr *= curve;
        gg *= curve;
        bb *= curve;

        const edge = Math.pow(1 - z, 1.85);
        rr = mix(rr, 66, edge * 0.030);
        gg = mix(gg, 142, edge * 0.036);
        bb = mix(bb, 188, edge * 0.045);

        const alpha = smoothstep(1.01, 0.985, d2);
        const out = (y * size + x) * 4;

        data[out] = clamp(rr, 0, 255);
        data[out + 1] = clamp(gg, 0, 255);
        data[out + 2] = clamp(bb, 0, 255);
        data[out + 3] = Math.round(alpha * 255);
      }
    }
  }

  function composite(time) {
    const canvas = runtime.canvas;
    const ctx = runtime.ctx;
    const buffer = runtime.buffer;
    const bufferCtx = runtime.bufferCtx;

    if (!canvas || !ctx || !buffer || !bufferCtx || !runtime.image) return;

    const w = canvas.width;
    const h = canvas.height;

    if (!w || !h) return;

    paintBackplate(ctx, w, h);
    paintPlanet(time);

    bufferCtx.clearRect(0, 0, runtime.size, runtime.size);
    bufferCtx.putImageData(runtime.image, 0, 0);

    const target = Math.min(w, h);
    const dx = (w - target) * 0.5;
    const dy = (h - target) * 0.5;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(buffer, dx, dy, target, target);
    ctx.restore();
  }

  function loop(time) {
    if (runtime.disposed) return;

    if (!runtime.lastFrame || time - runtime.lastFrame > 42) {
      runtime.lastFrame = time;
      composite(time);
    }

    runtime.raf = requestAnimationFrame(loop);
  }

  function exposeReceipt(status) {
    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      renderOwner: "/assets/hearth/hearth.canvas.js",
      mount: "#hearthCanvasMount",
      generation: "G3",
      standard: "definitive-landmass-and-zoning",
      languageLayer: "globe",
      constructionLayer: "planet",
      firstTrueG3Standard: true,
      oldGlobeContractRetired: true,
      oldShellContractRetired: true,
      oldHydrationFirstPathRetired: true,
      oldTerrainExpressionPathRetired: true,
      drawPath: "single-visible-draw-path",
      landmassCount: LANDMASSES.length,
      landmasses: LANDMASSES.map((landmass) => ({
        id: landmass.id,
        name: landmass.name,
        regions: landmass.regionX * landmass.regionY,
        countries: landmass.countryX * landmass.countryY,
        statesOrProvinces: landmass.stateX * landmass.stateY
      })),
      allowedG3: [
        "planet body",
        "definitive landmass boundary",
        "water/land boundary",
        "regions",
        "countries",
        "states/provinces",
        "city-zone seats"
      ],
      deferredBeyondG3Standard: [
        "hydration",
        "rivers",
        "mountains",
        "terrain detail",
        "weather",
        "climate",
        "clouds",
        "humidity",
        "atmospheric moisture"
      ],
      noGraphicBox: true,
      noGeneratedImage: true,
      noExternalImage: true,
      noDecorativeGlobeTemplate: true,
      noTwoContractOverlap: true,
      status
    });
  }

  async function mount() {
    installStyle();
    unlockScroll();

    const mountEl = getMount();
    mountEl.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.generation = "G3";
    canvas.dataset.standard = "definitive-landmass-and-zoning";
    canvas.dataset.languageLayer = "globe";
    canvas.dataset.constructionLayer = "planet";
    canvas.dataset.drawPath = "single-visible-draw-path";
    canvas.dataset.hydrationDeferred = "true";
    canvas.dataset.terrainDetailDeferred = "true";
    canvas.dataset.mountainsDeferred = "true";
    canvas.dataset.climateWeatherCloudsDeferred = "true";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth Generation 3 definitive landmass and zoning planet");

    mountEl.append(canvas);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.buffer = document.createElement("canvas");
    runtime.bufferCtx = runtime.buffer.getContext("2d", { alpha: true, willReadFrequently: false });

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthGeneration = "G3";
    mountEl.dataset.hearthStandard = "definitive-landmass-and-zoning";
    mountEl.dataset.hearthLanguageLayer = "globe";
    mountEl.dataset.hearthConstructionLayer = "planet";
    mountEl.dataset.hearthDrawPath = "single-visible-draw-path";
    mountEl.dataset.hearthHydrationDeferred = "true";
    mountEl.dataset.hearthTerrainDetailDeferred = "true";
    mountEl.dataset.hearthMountainsDeferred = "true";
    mountEl.dataset.hearthWeatherClimateCloudsDeferred = "true";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthStandard = "definitive-landmass-and-zoning";
    document.documentElement.dataset.hearthLanguageLayer = "globe";
    document.documentElement.dataset.hearthConstructionLayer = "planet";
    document.documentElement.dataset.hearthDrawPath = "single-visible-draw-path";

    runtime.observer = new ResizeObserver(resize);
    runtime.observer.observe(mountEl);

    window.addEventListener("resize", resize, { passive: true });

    resize();
    exposeReceipt("mounted");

    runtime.mounted = true;
    runtime.raf = requestAnimationFrame(loop);
  }

  function dispose() {
    runtime.disposed = true;
    cancelAnimationFrame(runtime.raf);
    window.removeEventListener("resize", resize);

    if (runtime.observer) runtime.observer.disconnect();

    const style = document.getElementById("hearth-g3-zoning-standard-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G3_ZONING_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_G3_ZONING_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_PLANET_BODY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_VISIBLE_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_10_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_DISPOSE__ = dispose;

  function boot() {
    if (runtime.mounted || runtime.disposed) return;
    mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
