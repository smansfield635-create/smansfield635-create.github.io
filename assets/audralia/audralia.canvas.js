// /assets/audralia/audralia.canvas.js
// AUDRALIA_G1_256_LATTICE_ATLAS_CANVAS_CONSUMER_TNT_v16
// Full-file replacement.
// Canvas renderer only.
// Dynamically loads lattice256.js and landmap.js.
// Renders only landmap classifications.
// Does not invent footprint.
// Exposes live longitude/latitude/cell terrain readout.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_256_LATTICE_ATLAS_CANVAS_CONSUMER_TNT_v16";
  const RECEIPT = "AUDRALIA_G1_256_LATTICE_ATLAS_CANVAS_CONSUMER_RECEIPT_v16";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_COORDINATE_LANDMAP_CANVAS_CONSUMER_TNT_v15";
  const LATTICE_CONTRACT = "AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_TNT_v1";
  const LANDMAP_CONTRACT = "AUDRALIA_G1_256_LATTICE_LANDMAP_CLASSIFICATION_TNT_v2";
  const VERSION = "2026-05-10.audralia-g1-256-lattice-atlas-canvas-consumer-v16";
  const TAU = Math.PI * 2;

  const COLORS = Object.freeze({
    deepOcean: [3, 18, 44],
    ocean: [5, 56, 98],
    shelf: [20, 106, 132],
    shallow: [48, 143, 146],
    beach: [202, 186, 128],
    wetBeach: [156, 157, 116],
    land: [90, 127, 76],
    plains: [128, 142, 87],
    desert: [174, 148, 90],
    marsh: [50, 101, 78],
    basin: [66, 108, 70],
    highland: [128, 128, 116],
    mountain: [112, 112, 108],
    darkMountain: [76, 78, 76],
    ice: [190, 220, 225],
    snow: [218, 232, 226],
    polarIce: [218, 235, 235],
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

  function loadScriptOnce(src, flag) {
    if (document.documentElement.dataset[flag] === "true") return Promise.resolve(true);

    return new Promise((resolve) => {
      const existing = document.querySelector(`script[data-loader-flag="${flag}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = `${src}?v=audralia-256-atlas-${Date.now()}`;
      script.defer = true;
      script.dataset.loaderFlag = flag;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async function ensureAtlas() {
    if (!window.AUDRALIA_LATTICE256?.coordinatesFromUV) {
      await loadScriptOnce("/assets/audralia/audralia.lattice256.js", "audraliaLattice256Loaded");
    }

    if (!window.AUDRALIA_LANDMAP?.sampleLandmap) {
      await loadScriptOnce("/assets/audralia/audralia.landmap.js", "audraliaLandmapLoaded");
    }

    return Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap);
  }

  function fallbackMap(u, v) {
    return {
      u,
      v,
      longitude: u * 360 - 180,
      latitude: 90 - v * 180,
      cell256: 1,
      cell64: 1,
      cell16: 1,
      quadrant: "NE",
      band: "temperate",
      primarySummit: "Gratitude",
      internalSummit: "Gratitude",
      terrainClass: "ocean",
      topology: "ocean",
      elevation: "sea",
      isOcean: true,
      isLand: false,
      isShelf: false,
      isBeach: false,
      isPolarIce: false,
      hydrologyHeld: false
    };
  }

  function sampleMap(u, v) {
    if (window.AUDRALIA_LANDMAP?.sampleLandmap) return window.AUDRALIA_LANDMAP.sampleLandmap(u, v);
    return fallbackMap(u, v);
  }

  function surfaceColor(map) {
    const u = map.u;
    const v = map.v;
    const grain = (fbm(u * 2.4 + 0.15, v * 2.0 - 0.11, 460000, 4) - 0.5) * 7;
    const moisture = fbm(u * 1.35 - 0.19, v * 1.08 + 0.12, 1411000, 5);
    const dryness = fbm(u * 1.22 + 0.11, v * 0.96 - 0.08, 1412000, 5);
    const relief = fbm(u * 1.52, v * 1.18, 510000, 5);

    if (map.terrainClass === "ocean") {
      return shade(mix(COLORS.deepOcean, COLORS.ocean, smoothstep(0.2, 0.9, map.shelf || 0.25)), grain * 0.3 - 3);
    }

    if (map.terrainClass === "shelf") {
      return shade(mix(COLORS.ocean, COLORS.shelf, smoothstep(0.42, 0.9, map.shelf || 0.5)), grain * 0.25 + 2);
    }

    if (map.terrainClass === "beach") {
      return shade(mix(COLORS.beach, COLORS.wetBeach, smoothstep(0.42, 0.88, map.shelf || 0.4)), grain * 0.45 + 2);
    }

    if (map.terrainClass === "polar-ice") {
      return shade(mix(COLORS.polarIce, COLORS.snow, smoothstep(0.34, 0.9, map.icePressure || relief)), grain * 0.25 + 6);
    }

    if (map.terrainClass === "ice-highland") {
      let ice = mix(COLORS.ice, COLORS.snow, smoothstep(0.42, 0.88, map.icePressure || relief));
      ice = mix(ice, COLORS.mountain, smoothstep(0.5, 0.9, map.mountainPressure || relief) * 0.28);
      return shade(ice, grain * 0.35 + 5);
    }

    if (map.terrainClass === "mountain-highland") {
      let mountain = mix(COLORS.highland, COLORS.mountain, smoothstep(0.46, 0.9, map.mountainPressure || relief));
      mountain = mix(mountain, COLORS.snow, smoothstep(0.72, 0.94, map.icePressure || relief) * 0.24);
      return shade(mountain, grain + relief * 10 - 3);
    }

    let land = COLORS.land;

    if (map.terrainClass === "basin-highland") land = mix(land, COLORS.basin, 0.42);
    if (map.terrainClass === "coast") land = mix(land, COLORS.beach, (map.beachEdge || 0) * 0.12);
    if (map.terrainClass === "island") land = mix(land, COLORS.plains, 0.16);

    land = mix(land, COLORS.plains, smoothstep(0.38, 0.76, moisture) * 0.18);
    land = mix(land, COLORS.desert, smoothstep(0.62, 0.9, dryness) * 0.14);
    land = mix(land, COLORS.marsh, map.terrainClass === "basin-highland" ? moisture * 0.18 : 0);
    land = mix(land, COLORS.highland, smoothstep(0.58, 0.86, relief) * 0.16);

    return shade(land, grain + relief * 6 - 4);
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
    mount.querySelectorAll("[data-audralia-coordinate-readout='true']").forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    canvas.dataset.audraliaParentChainCanvas = "true";
    canvas.dataset.audraliaCanvasContract = CONTRACT;
    canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    canvas.dataset.audraliaLatticeContract = LATTICE_CONTRACT;
    canvas.dataset.audraliaLandmapContract = LANDMAP_CONTRACT;
    canvas.dataset.audraliaCanvasConsumesLattice256 = "true";
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
    readout.style.whiteSpace = "pre-line";
    readout.style.pointerEvents = "none";
    readout.textContent = "Audralia 256 atlas loading…";
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
        `cell ${map.cell256}/256 · cell64 ${map.cell64} · cell16 ${map.cell16}`,
        `${map.quadrant} · ${map.band}`,
        `${map.terrainClass} · ${map.topology} · ${map.elevation}`,
        `Gratitude → ${map.internalSummit}`
      ].join("\n");

      document.documentElement.dataset.audraliaLastLatitude = String(map.latitude.toFixed(4));
      document.documentElement.dataset.audraliaLastLongitude = String(map.longitude.toFixed(4));
      document.documentElement.dataset.audraliaLastCell256 = String(map.cell256);
      document.documentElement.dataset.audraliaLastTerrainClass = map.terrainClass;
      document.documentElement.dataset.audraliaLastTopology = map.topology;
      document.documentElement.dataset.audraliaLastElevation = map.elevation;
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
          lattice256Loaded: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
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

    ensureAtlas().then(() => {
      texture = buildTexture(1024, 512);
      state.ready = true;
      updateReadout(sampleMap(0.5, 0.5));

      document.documentElement.dataset.audraliaCanvasLoaded = "true";
      document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
      document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
      document.documentElement.dataset.audraliaLattice256Loaded = String(Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV));
      document.documentElement.dataset.audraliaLandmapLoaded = String(Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap));
      document.documentElement.dataset.audraliaCanvasConsumesLattice256 = "true";
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
      latticeContract: LATTICE_CONTRACT,
      landmapContract: LANDMAP_CONTRACT,
      version: VERSION,
      authority: "audralia-canvas-renderer",
      consumesLattice256: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
      consumesLandmap: Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap),
      canvasOwnsFootprint: false,
      coordinateInspection: true,
      hydrologyAuthored: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_CANVAS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    latticeContract: LATTICE_CONTRACT,
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
  document.documentElement.dataset.audraliaCanvasConsumesLattice256 = "true";
  document.documentElement.dataset.audraliaCanvasConsumesLandmap = "true";
  document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
  document.documentElement.dataset.audraliaCoordinateInspection = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
