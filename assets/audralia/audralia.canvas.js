// /assets/audralia/audralia.canvas.js
// AUDRALIA_G1_COORDINATE_LANDMAP_CANVAS_CONSUMER_TNT_v15
// Full-file replacement.
// Canvas authority only.
// Purpose:
// - Dynamically loads /assets/audralia/audralia.landmap.js if route has not loaded it.
// - Consumes landmap as footprint truth.
// - Canvas renders; it does not invent landmass.
// - Pointer/drag inspection exposes longitude, latitude, quadrant, band, cell16, cell64, cell256, and terrain class.
// - Preserves accepted G1 visible-landmass footprint.
// - Keeps thin coastal beaches restrained.
// - No trees. No bushes. No forest canopy.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_COORDINATE_LANDMAP_CANVAS_CONSUMER_TNT_v15";
  const RECEIPT = "AUDRALIA_G1_COORDINATE_LANDMAP_CANVAS_CONSUMER_RECEIPT_v15";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_THIN_COASTAL_BEACH_RESTRAINT_CANVAS_TNT_v14";
  const LANDMAP_CONTRACT = "AUDRALIA_G1_COORDINATE_LANDMAP_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-10.audralia-g1-coordinate-landmap-canvas-consumer-v15";
  const TAU = Math.PI * 2;

  const COLORS = Object.freeze({
    deepOcean: [3, 18, 44],
    ocean: [5, 56, 98],
    shelf: [20, 106, 132],
    shallow: [48, 143, 146],
    beach: [202, 186, 128],
    wetBeach: [156, 157, 116],
    land: [90, 127, 76],
    grassland: [77, 122, 72],
    plains: [128, 142, 87],
    desert: [174, 148, 90],
    marsh: [50, 101, 78],
    basin: [66, 108, 70],
    highland: [134, 132, 119],
    ridge: [118, 118, 112],
    snow: [218, 232, 226],
    atmosphere: [86, 157, 194],
    cloud: [230, 238, 238]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function mix(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function hash(x, y, seed) {
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(1, Math.floor(scale));
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const a = hash(((x0 % s) + s) % s, y0, seed);
    const b = hash(((x1 % s) + s) % s, y0, seed);
    const c = hash(((x0 % s) + s) % s, y1, seed);
    const d = hash(((x1 % s) + s) % s, y1, seed);

    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ensureLandmap() {
    if (window.AUDRALIA_LANDMAP?.sampleLandmap) return Promise.resolve(true);

    return new Promise((resolve) => {
      const existing = document.querySelector("script[data-audralia-landmap-loader='true']");
      if (existing) {
        existing.addEventListener("load", () => resolve(Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap)), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = `/assets/audralia/audralia.landmap.js?v=audralia-landmap-v1-${Date.now()}`;
      script.defer = true;
      script.dataset.audraliaLandmapLoader = "true";
      script.dataset.audraliaCanvasContract = CONTRACT;

      script.onload = () => resolve(Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap));
      script.onerror = () => resolve(false);

      document.head.appendChild(script);
    });
  }

  function fallbackLandmap(u, v) {
    const longitude = u * 360 - 180;
    const latitude = 90 - v * 180;
    const base = fbm(u * 0.62 + 0.11, v * 0.56 - 0.07, 1700000, 6);
    const mass = fbm(u * 0.92 - 0.21, v * 0.82 + 0.14, 1700500, 6);
    const islands = fbm(u * 2.0 - 0.13, v * 1.55 + 0.08, 1701000, 5);
    const exposure = clamp(base * 0.52 + mass * 0.38 + islands * 0.1 - 0.2, 0, 1);
    const isLand = exposure > 0.405;
    const shelf = clamp(exposure + islands * 0.18, 0, 1);
    const beachEdge = smoothstep(0.365, 0.49, exposure) * (1 - smoothstep(0.505, 0.64, exposure));

    return {
      u,
      v,
      longitude,
      latitude,
      longitudeRadians: (longitude / 180) * Math.PI,
      latitudeRadians: (latitude / 180) * Math.PI,
      quadrant: `${latitude >= 0 ? "N" : "S"}${longitude >= 0 ? "E" : "W"}`,
      band: Math.abs(latitude) < 8 ? "equatorial" : Math.abs(latitude) < 23.5 ? "subtropical" : Math.abs(latitude) < 45 ? "temperate" : "polar",
      cell16: 1,
      cell64: 1,
      cell256: 1,
      primarySummit: "Gratitude",
      internalSummit: "Gratitude",
      exposure,
      shelf,
      beachEdge,
      isLand,
      isOcean: !isLand && shelf < 0.48,
      isShelf: !isLand && shelf >= 0.48,
      isBeach: !isLand && beachEdge > 0.14,
      isCoast: exposure > 0.36 && exposure < 0.58,
      isIsland: false,
      isInland: isLand && exposure >= 0.58,
      isBasin: false,
      isHighland: false,
      terrainClass: isLand ? "inland" : shelf >= 0.48 ? "shelf" : "ocean"
    };
  }

  function sampleMap(u, v) {
    if (window.AUDRALIA_LANDMAP?.sampleLandmap) return window.AUDRALIA_LANDMAP.sampleLandmap(u, v);
    return fallbackLandmap(u, v);
  }

  function surfaceColor(map) {
    const u = map.u;
    const v = map.v;

    const grain = (fbm(u * 2.4 + 0.15, v * 2.0 - 0.11, 460000, 4) - 0.5) * 7;
    const moisture = fbm(u * 1.35 - 0.19, v * 1.08 + 0.12, 1411000, 5);
    const dryness = fbm(u * 1.22 + 0.11, v * 0.96 - 0.08, 1412000, 5);
    const ridge = fbm(u * 1.52, v * 1.18, 510000, 5);
    const cloudShadow = fbm(u * 1.5, v * 1.25, 470000, 3);

    if (map.isOcean) {
      let water = mix(COLORS.deepOcean, COLORS.ocean, smoothstep(0.2, 0.9, map.shelf + cloudShadow * 0.08));
      return shade(water, grain * 0.35 - 3);
    }

    if (map.isShelf) {
      let shelf = mix(COLORS.ocean, COLORS.shelf, smoothstep(0.42, 0.9, map.shelf));
      shelf = mix(shelf, COLORS.shallow, map.beachEdge * 0.18);
      return shade(shelf, grain * 0.3 + 2);
    }

    if (map.isBeach) {
      let beach = mix(COLORS.beach, COLORS.wetBeach, smoothstep(0.42, 0.88, map.shelf));
      beach = mix(beach, COLORS.shallow, map.beachEdge * 0.1);
      return shade(beach, grain * 0.45 + 2);
    }

    let land = COLORS.land;

    if (map.isBasin) land = mix(land, COLORS.basin, 0.38);
    if (map.isHighland) land = mix(land, COLORS.highland, 0.42);
    if (map.isCoast) land = mix(land, COLORS.beach, map.beachEdge * 0.09);

    land = mix(land, COLORS.grassland, moisture * 0.2);
    land = mix(land, COLORS.plains, smoothstep(0.36, 0.76, moisture) * 0.16);
    land = mix(land, COLORS.desert, smoothstep(0.62, 0.9, dryness) * 0.16);
    land = mix(land, COLORS.marsh, map.isBasin ? moisture * 0.18 : 0);
    land = mix(land, COLORS.ridge, smoothstep(0.58, 0.86, ridge) * 0.18);
    land = mix(land, COLORS.snow, map.isHighland ? smoothstep(0.78, 0.94, ridge) * 0.22 : 0);

    return shade(land, grain + ridge * 8 - 4);
  }

  function buildTexture(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const map = sampleMap(u, v);
        const color = surfaceColor(map);
        const index = (y * width + x) * 4;

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    return { data, width, height };
  }

  function textureSample(texture, u, v) {
    const x = Math.floor(wrap01(u) * texture.width) % texture.width;
    const y = clamp(Math.floor(clamp(v, 0, 1) * (texture.height - 1)), 0, texture.height - 1);
    const index = (y * texture.width + x) * 4;
    return [texture.data[index], texture.data[index + 1], texture.data[index + 2]];
  }

  function mount(mountNode, options = {}) {
    const mount = mountNode && mountNode.nodeType === 1 ? mountNode : document.body;

    mount.querySelectorAll("canvas[data-audralia-parent-chain-canvas='true']").forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    canvas.dataset.audraliaParentChainCanvas = "true";
    canvas.dataset.audraliaCanvasContract = CONTRACT;
    canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    canvas.dataset.audraliaLandmapContract = LANDMAP_CONTRACT;
    canvas.dataset.audraliaCanvasConsumesLandmap = "true";
    canvas.dataset.audraliaCanvasOwnsFootprint = "false";
    canvas.dataset.audraliaCoordinateInspection = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";
    mount.appendChild(canvas);

    const readout = document.createElement("div");
    readout.dataset.audraliaCoordinateReadout = "true";
    readout.style.position = "absolute";
    readout.style.left = "10px";
    readout.style.bottom = "10px";
    readout.style.padding = "7px 9px";
    readout.style.borderRadius = "12px";
    readout.style.background = "rgba(3,9,20,.68)";
    readout.style.color = "rgba(238,246,255,.88)";
    readout.style.font = "600 11px/1.35 system-ui, sans-serif";
    readout.style.pointerEvents = "none";
    readout.style.maxWidth = "86%";
    readout.textContent = "Audralia coordinate map loading…";
    mount.appendChild(readout);

    const ctx = canvas.getContext("2d", { alpha: true });

    let texture = null;

    const state = {
      disposed: false,
      dragging: false,
      lastX: 0,
      lastY: 0,
      spin: -0.4,
      tilt: -0.08,
      velocity: 0.0024,
      frames: 0,
      lastRender: 0,
      ready: false
    };

    function resize() {
      const rect = mount.getBoundingClientRect();
      const size = Math.max(280, Math.min(620, Math.floor(Math.min(rect.width || 420, rect.height || rect.width || 420))));
      const dpr = Math.min(1.35, window.devicePixelRatio || 1);
      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
    }

    function pointerToMap(event) {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX || 0) - rect.left) / Math.max(1, rect.width);
      const y = ((event.clientY || 0) - rect.top) / Math.max(1, rect.height);

      const px = (x - 0.5) / 0.44;
      const py = (y - 0.5) / 0.44;
      const rr = px * px + py * py;

      if (rr > 1) return null;

      const z = Math.sqrt(1 - rr);
      const cosSpin = Math.cos(state.spin);
      const sinSpin = Math.sin(state.spin);
      const cosTilt = Math.cos(state.tilt);
      const sinTilt = Math.sin(state.tilt);

      let sx = px;
      let sy = py;
      let sz = z;

      const ty = sy * cosTilt - sz * sinTilt;
      const tz = sy * sinTilt + sz * cosTilt;

      sy = ty;
      sz = tz;

      const wx = sx * cosSpin - sz * sinSpin;
      const wz = sx * sinSpin + sz * cosSpin;

      const longitude = Math.atan2(wz, wx);
      const latitude = Math.asin(clamp(sy, -1, 1));
      const u = longitude / TAU + 0.5;
      const v = 0.5 - latitude / Math.PI;

      return sampleMap(u, v);
    }

    function updateReadout(map) {
      if (!map) {
        readout.textContent = "Pointer outside globe";
        return;
      }

      readout.textContent = [
        `lat ${map.latitude.toFixed(2)} · lon ${map.longitude.toFixed(2)}`,
        `cell ${map.cell256}/256 · ${map.quadrant} · ${map.band}`,
        `${map.terrainClass} · Gratitude → ${map.internalSummit}`
      ].join("\n");

      document.documentElement.dataset.audraliaLastLatitude = String(map.latitude.toFixed(4));
      document.documentElement.dataset.audraliaLastLongitude = String(map.longitude.toFixed(4));
      document.documentElement.dataset.audraliaLastCell256 = String(map.cell256);
      document.documentElement.dataset.audraliaLastTerrainClass = map.terrainClass;
      document.documentElement.dataset.audraliaLastInternalSummit = map.internalSummit;
    }

    function pointerDown(event) {
      state.dragging = true;
      state.lastX = event.clientX || event.touches?.[0]?.clientX || 0;
      state.lastY = event.clientY || event.touches?.[0]?.clientY || 0;
      updateReadout(pointerToMap(event));
      canvas.setPointerCapture?.(event.pointerId);
    }

    function pointerMove(event) {
      updateReadout(pointerToMap(event));

      if (!state.dragging) return;

      const x = event.clientX || event.touches?.[0]?.clientX || 0;
      const y = event.clientY || event.touches?.[0]?.clientY || 0;
      const dx = x - state.lastX;
      const dy = y - state.lastY;

      state.spin += dx * 0.008;
      state.tilt = clamp(state.tilt + dy * 0.006, -1.15, 1.15);
      state.lastX = x;
      state.lastY = y;
    }

    function pointerUp(event) {
      state.dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
    }

    function render(now) {
      if (state.disposed) return;

      if (!state.ready || !texture) {
        requestAnimationFrame(render);
        return;
      }

      if (!state.dragging) state.spin += state.velocity;

      if (now - state.lastRender < 30) {
        requestAnimationFrame(render);
        return;
      }

      state.lastRender = now;
      state.frames += 1;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const radius = Math.min(width, height) * 0.44;
      const image = ctx.createImageData(width, height);
      const data = image.data;

      const cosSpin = Math.cos(state.spin);
      const sinSpin = Math.sin(state.spin);
      const cosTilt = Math.cos(state.tilt);
      const sinTilt = Math.sin(state.tilt);
      const light = [-0.45, -0.28, 0.84];

      for (let y = 0; y < height; y += 1) {
        const py = (y - cy) / radius;

        for (let x = 0; x < width; x += 1) {
          const px = (x - cx) / radius;
          const rr = px * px + py * py;
          const index = (y * width + x) * 4;

          if (rr > 1) {
            data[index] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
            data[index + 3] = 0;
            continue;
          }

          const z = Math.sqrt(1 - rr);
          let sx = px;
          let sy = py;
          let sz = z;

          const ty = sy * cosTilt - sz * sinTilt;
          const tz = sy * sinTilt + sz * cosTilt;

          sy = ty;
          sz = tz;

          const wx = sx * cosSpin - sz * sinSpin;
          const wz = sx * sinSpin + sz * cosSpin;

          const longitude = Math.atan2(wz, wx);
          const latitude = Math.asin(clamp(sy, -1, 1));
          const u = longitude / TAU + 0.5;
          const v = 0.5 - latitude / Math.PI;

          let color = textureSample(texture, u, v);

          const lightAmount = clamp(wx * light[0] + sy * light[1] + z * light[2], 0, 1);
          const limb = smoothstep(0.0, 0.16, z);
          const shadeAmount = -36 + lightAmount * 58;

          color = shade(color, shadeAmount);
          color = mix(COLORS.atmosphere, color, limb);

          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = Math.round(255 * smoothstep(0.0, 0.025, 1 - rr));
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.putImageData(image, 0, 0);

      if (typeof options.onStatus === "function") {
        options.onStatus("rendering", {
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          frames: state.frames,
          landmapLoaded: Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap)
        });
      }

      requestAnimationFrame(render);
    }

    resize();

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);

    ensureLandmap().then(() => {
      texture = buildTexture(1024, 512);
      state.ready = true;
      const center = sampleMap(0.5, 0.5);
      updateReadout(center);

      document.documentElement.dataset.audraliaCanvasLoaded = "true";
      document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
      document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
      document.documentElement.dataset.audraliaLandmapLoaded = String(Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap));
      document.documentElement.dataset.audraliaCanvasConsumesLandmap = "true";
      document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
      document.documentElement.dataset.audraliaCoordinateInspection = "true";
      document.documentElement.dataset.generatedImage = "false";
      document.documentElement.dataset.graphicBox = "false";
      document.documentElement.dataset.visualPassClaimed = "false";

      requestAnimationFrame(render);
    });

    function dispose() {
      state.disposed = true;
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.remove();
      readout.remove();
    }

    window.__AUDRALIA_CANVAS_DISPOSE__ = dispose;

    return { canvas, controlsBound: true, dispose, getStatus };
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      landmapContract: LANDMAP_CONTRACT,
      version: VERSION,
      authority: "audralia-canvas",
      consumesLandmap: Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap),
      canvasOwnsFootprint: false,
      coordinateInspection: true,
      longitudeLatitudeSystem: true,
      cell16: true,
      cell64: true,
      cell256: true,
      primarySummit: "Gratitude",
      trees: false,
      bushes: false,
      forestCanopy: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_CANVAS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    landmapContract: LANDMAP_CONTRACT,
    version: VERSION,
    mount,
    getStatus
  });

  window.AUDRALIA_CANVAS_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaCanvasLoaded = "true";
  document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
  document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
  document.documentElement.dataset.audraliaCanvasExposesMount = "true";
  document.documentElement.dataset.audraliaCanvasConsumesLandmap = "true";
  document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
  document.documentElement.dataset.audraliaCoordinateInspection = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
