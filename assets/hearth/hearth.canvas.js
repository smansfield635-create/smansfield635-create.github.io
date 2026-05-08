// /assets/hearth/hearth.canvas.js
// HEARTH_G3_LANDMASS_FAMILY_ZONING_STANDARD_TNT_v1
// Full-file replacement.
// First true bounded Hearth Generation 3 landmass-family standard.
// Purpose:
// - Retire round-blob landmass standard.
// - Build four independently sized General Regions.
// - Build sixteen countries: four countries per General Region.
// - Build nine progressive Summit regions inside each General Region.
// - Technology/access progression: Summit 1 = base / broadest access / most limited technology; Summit 9 = highest challenge / narrowest access / most advanced technology.
// - No hydration, rivers, mountains, terrain detail, weather, climate, clouds, humidity, or atmospheric moisture.
// - No external image. No generated image. No GraphicBox.
// - One active canvas authority. One visible draw path.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_LANDMASS_FAMILY_ZONING_STANDARD_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-landmass-family-zoning-standard";
  const RECEIPT = "HEARTH_G3_LANDMASS_FAMILY_ZONING_RECEIPT";

  const MIN_SIZE = 300;
  const MAX_SIZE = 500;
  const TAU = Math.PI * 2;

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "Retire old globe and round-blob contracts.",
    T2: "Lock G3 reach to cartographic landmass-family zoning.",
    T3: "Define four independently sized General Regions.",
    T4: "Assign sixteen countries, four per General Region.",
    T5: "Assign nine progressive Summit regions per General Region.",
    T6: "Prevent hydration, mountains, climate, weather, clouds, humidity.",
    T7: "Keep globe as language layer and planet as construction layer.",
    T8: "Render one active planet body with one draw path.",
    T9: "Expose receipts for downstream family construction."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "Hearth G3 landmass-family zoning canvas authority only.",
    axis: "Bounded cartographic planet construction.",
    artifact: "Four General Regions, sixteen countries, and nine Summit regions per General Region.",
    attack: "Reject round blobs, old globe contracts, hydration-first drift, terrain-detail drift, mountain drift, and endless expression."
  });

  [
    "__HEARTH_CANVAS_G3_FAMILY_DISPOSE__",
    "__HEARTH_CANVAS_G3_ZONING_DISPOSE__",
    "__HEARTH_CANVAS_PLANET_BODY_DISPOSE__",
    "__HEARTH_CANVAS_VISIBLE_DISPOSE__",
    "__HEARTH_CANVAS_G3_DISPOSE__",
    "__HEARTH_CANVAS_G3_10_DISPOSE__",
    "__HEARTH_CANVAS_DISPOSE__",
    "__HEARTH_G2_DISPOSE__"
  ].forEach((name) => {
    if (typeof window[name] === "function") {
      try { window[name](); } catch (_) {}
    }

    try { window[name] = null; } catch (_) {}
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

  function pointInPolygon(x, y, points) {
    let inside = false;

    for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
      const xi = points[i][0];
      const yi = points[i][1];
      const xj = points[j][0];
      const yj = points[j][1];

      const intersect =
        ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  }

  function segmentDistance(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const wx = px - ax;
    const wy = py - ay;
    const c1 = vx * wx + vy * wy;
    const c2 = vx * vx + vy * vy || 1e-9;
    const t = clamp(c1 / c2, 0, 1);
    const dx = px - (ax + vx * t);
    const dy = py - (ay + vy * t);
    return Math.hypot(dx, dy);
  }

  function polygonDistance(x, y, points) {
    let min = Infinity;

    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      min = Math.min(min, segmentDistance(x, y, a[0], a[1], b[0], b[1]));
    }

    return min;
  }

  function hashInt(a, b, c) {
    const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  const GENERAL_REGIONS_RAW = [
    {
      id: "GR01",
      name: "Baseward West",
      center: [-88, 18],
      size: [0.86, 0.58],
      color: [144, 118, 74],
      countryPrefix: 1,
      outline: [
        [-0.90, 0.08], [-0.70, 0.42], [-0.28, 0.58], [0.20, 0.48],
        [0.58, 0.22], [0.72, -0.08], [0.46, -0.40], [0.02, -0.56],
        [-0.44, -0.46], [-0.78, -0.22]
      ]
    },
    {
      id: "GR02",
      name: "Rising South",
      center: [-18, -24],
      size: [0.68, 0.74],
      color: [158, 126, 82],
      countryPrefix: 5,
      outline: [
        [-0.58, 0.48], [-0.18, 0.66], [0.36, 0.54], [0.72, 0.18],
        [0.58, -0.28], [0.18, -0.76], [-0.30, -0.70], [-0.70, -0.32],
        [-0.78, 0.12]
      ]
    },
    {
      id: "GR03",
      name: "Middle Eastward",
      center: [56, 22],
      size: [0.92, 0.54],
      color: [134, 127, 84],
      countryPrefix: 9,
      outline: [
        [-0.86, 0.20], [-0.48, 0.54], [0.08, 0.62], [0.64, 0.44],
        [0.92, 0.04], [0.74, -0.28], [0.30, -0.50], [-0.22, -0.46],
        [-0.72, -0.22]
      ]
    },
    {
      id: "GR04",
      name: "Summitward North",
      center: [134, 42],
      size: [0.58, 0.48],
      color: [126, 126, 94],
      countryPrefix: 13,
      outline: [
        [-0.68, 0.12], [-0.42, 0.48], [0.08, 0.56], [0.54, 0.28],
        [0.68, -0.10], [0.30, -0.44], [-0.18, -0.48], [-0.62, -0.18]
      ]
    }
  ];

  const GENERAL_REGIONS = GENERAL_REGIONS_RAW.map((region, index) => {
    const center = dirFromLonLat(region.center[0], region.center[1]);
    return Object.freeze({
      ...region,
      index,
      center,
      basis: makeBasis(center)
    });
  });

  const SUMMIT_LABELS = Object.freeze([
    "S1 Base",
    "S2 Entry",
    "S3 Tooling",
    "S4 Systems",
    "S5 Coordination",
    "S6 Applied",
    "S7 Specialized",
    "S8 Restricted",
    "S9 Summit"
  ]);

  function localize(v, region) {
    const rawX = dot3(v, region.basis.east) / region.size[0];
    const rawY = dot3(v, region.basis.north) / region.size[1];
    const facing = dot3(v, region.center);

    return { x: rawX, y: rawY, facing };
  }

  function regionSample(v) {
    let best = null;

    for (const region of GENERAL_REGIONS) {
      const local = localize(v, region);
      const inside = pointInPolygon(local.x, local.y, region.outline);
      const distance = polygonDistance(local.x, local.y, region.outline);
      const score = (inside ? 1 : 0) + (1 - Math.min(distance, 1)) * 0.2 + local.facing * 0.08;

      if (!best || score > best.score) {
        best = { region, local, inside, distance, score };
      }
    }

    if (!best || !best.inside) {
      const shelf = best ? 1 - smoothstep(0.025, 0.155, best.distance) : 0;
      return {
        land: false,
        region: best ? best.region : null,
        coast: shelf,
        shelf,
        waterDepth: clamp(best ? best.distance * 1.7 : 0.8, 0, 1),
        countryLine: 0,
        summitLine: 0,
        citySeat: 0
      };
    }

    const u = clamp((best.local.x + 1) * 0.5, 0, 1);
    const q = clamp((best.local.y + 1) * 0.5, 0, 1);

    const countryCol = u < 0.5 ? 0 : 1;
    const countryRow = q < 0.5 ? 1 : 0;
    const countryIndex = countryRow * 2 + countryCol;
    const countryId = best.region.countryPrefix + countryIndex;

    const summitProgress = clamp((u * 0.58 + (1 - q) * 0.42), 0, 0.999);
    const summit = Math.floor(summitProgress * 9) + 1;

    const countryLine = Math.max(
      1 - smoothstep(0.008, 0.024, Math.abs(u - 0.5)),
      1 - smoothstep(0.008, 0.024, Math.abs(q - 0.5))
    );

    const summitFrac = summitProgress * 9;
    const summitEdge = Math.abs(summitFrac - Math.round(summitFrac));
    const summitLine = 1 - smoothstep(0.018, 0.048, summitEdge);

    const microX = Math.floor(u * 7);
    const microY = Math.floor(q * 6);
    const seatHash = hashInt(microX + countryId * 11, microY + summit * 17, best.region.index + 1);
    const seatU = u * 7 - microX;
    const seatQ = q * 6 - microY;
    const seatDistance = Math.hypot(seatU - 0.5, seatQ - 0.5);
    const citySeat = seatHash > 0.72 ? 1 - smoothstep(0.020, 0.055, seatDistance) : 0;

    const coast = 1 - smoothstep(0.012, 0.080, best.distance);

    return {
      land: true,
      region: best.region,
      u,
      q,
      countryId,
      summit,
      coast,
      countryLine,
      summitLine,
      citySeat,
      shelf: 0,
      waterDepth: 0
    };
  }

  function colorSample(sample) {
    if (!sample.land) {
      let r = mix(15, 5, sample.waterDepth);
      let g = mix(82, 42, sample.waterDepth);
      let b = mix(124, 104, sample.waterDepth);

      r = mix(r, 34, sample.shelf * 0.78);
      g = mix(g, 158, sample.shelf * 0.76);
      b = mix(b, 176, sample.shelf * 0.72);

      return [r, g, b];
    }

    let [r, g, b] = sample.region.color;

    const summitTone = (sample.summit - 1) / 8;
    r = mix(r, 196, summitTone * 0.22);
    g = mix(g, 168, summitTone * 0.18);
    b = mix(b, 100, summitTone * 0.10);

    r = mix(r, 60, sample.countryLine * 0.42);
    g = mix(g, 74, sample.countryLine * 0.42);
    b = mix(b, 64, sample.countryLine * 0.42);

    r = mix(r, 236, sample.summitLine * 0.34);
    g = mix(g, 202, sample.summitLine * 0.30);
    b = mix(b, 118, sample.summitLine * 0.18);

    r = mix(r, 245, sample.citySeat * 0.72);
    g = mix(g, 232, sample.citySeat * 0.58);
    b = mix(b, 172, sample.citySeat * 0.42);

    r = mix(r, 210, sample.coast * 0.10);
    g = mix(g, 190, sample.coast * 0.08);
    b = mix(b, 128, sample.coast * 0.07);

    return [r, g, b];
  }

  function installStyle() {
    const old = document.getElementById("hearth-g3-family-standard-style");
    if (old) old.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-family-standard-style";
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

        const sample = regionSample(v);
        let [rr, gg, bb] = colorSample(sample);

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
      standard: "landmass-family-zoning",
      languageLayer: "globe",
      constructionLayer: "planet",
      ticTacToeDynamicProtocol: TIC_TAC_TOE_DYNAMIC_PROTOCOL,
      systemicQuadAAttack: SYSTEMIC_QUAD_A_ATTACK,
      oldGlobeContractRetired: true,
      roundBlobStandardRetired: true,
      drawPath: "single-visible-draw-path",
      generalRegions: GENERAL_REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        countries: [region.countryPrefix, region.countryPrefix + 1, region.countryPrefix + 2, region.countryPrefix + 3],
        summitRegions: SUMMIT_LABELS
      })),
      totals: {
        generalRegions: 4,
        countries: 16,
        summitRegionsPerGeneralRegion: 9,
        totalSummitRegions: 36
      },
      allowedG3: [
        "planet body",
        "definitive landmass family",
        "4 independently sized general regions",
        "16 countries",
        "9 progressive Summit regions per general region"
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
    canvas.dataset.standard = "landmass-family-zoning";
    canvas.dataset.languageLayer = "globe";
    canvas.dataset.constructionLayer = "planet";
    canvas.dataset.drawPath = "single-visible-draw-path";
    canvas.dataset.generalRegions = "4";
    canvas.dataset.countries = "16";
    canvas.dataset.summitRegionsPerGeneralRegion = "9";
    canvas.dataset.hydrationDeferred = "true";
    canvas.dataset.terrainDetailDeferred = "true";
    canvas.dataset.mountainsDeferred = "true";
    canvas.dataset.climateWeatherCloudsDeferred = "true";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth Generation 3 landmass-family zoning planet");

    mountEl.append(canvas);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.buffer = document.createElement("canvas");
    runtime.bufferCtx = runtime.buffer.getContext("2d", { alpha: true, willReadFrequently: false });

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthGeneration = "G3";
    mountEl.dataset.hearthStandard = "landmass-family-zoning";
    mountEl.dataset.hearthLanguageLayer = "globe";
    mountEl.dataset.hearthConstructionLayer = "planet";
    mountEl.dataset.hearthDrawPath = "single-visible-draw-path";
    mountEl.dataset.hearthGeneralRegions = "4";
    mountEl.dataset.hearthCountries = "16";
    mountEl.dataset.hearthSummitRegionsPerGeneralRegion = "9";
    mountEl.dataset.hearthHydrationDeferred = "true";
    mountEl.dataset.hearthTerrainDetailDeferred = "true";
    mountEl.dataset.hearthMountainsDeferred = "true";
    mountEl.dataset.hearthWeatherClimateCloudsDeferred = "true";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthStandard = "landmass-family-zoning";
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

    const style = document.getElementById("hearth-g3-family-standard-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G3_FAMILY_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_G3_FAMILY_DISPOSE__ = dispose;
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
