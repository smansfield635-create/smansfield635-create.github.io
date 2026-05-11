// /assets/audralia/audralia.canvas.js
// AUDRALIA_PARENT_CHAIN_VISIBLE_CANVAS_AUTHORITY_TNT_v1
// Full-file replacement.
// Canvas authority only.
// Purpose:
// - Expose window.AUDRALIA_CANVAS.mount.
// - Render Audralia as a clean, ancient, ocean-driven, climate-bearing home-world planet.
// - Consume AUDRALIA_BACKSTORY, AUDRALIA_TECTONICS, and AUDRALIA_TOPOLOGY when available.
// - Preserve drag, spin, and pole-swivel inspection locally.
// Not Hearth. Not Earth clone. Not a real-world geography copy.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PARENT_CHAIN_VISIBLE_CANVAS_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_PARENT_CHAIN_VISIBLE_CANVAS_AUTHORITY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CANVAS_PARENT_CONTRACT_CHILD_ACTIVATION_TNT_v13";
  const VERSION = "2026-05-10.audralia-parent-chain-visible-canvas-v1";

  const TAU = Math.PI * 2;

  const COLORS = Object.freeze({
    space: [2, 7, 18],
    deepOcean: [4, 20, 46],
    ocean: [6, 55, 93],
    shelf: [18, 103, 128],
    shallow: [45, 138, 142],
    coast: [143, 164, 118],
    wetLand: [58, 118, 82],
    land: [102, 138, 82],
    dryLand: [155, 137, 84],
    highland: [121, 126, 98],
    oldStone: [116, 116, 108],
    ridge: [139, 137, 126],
    polar: [204, 222, 222],
    cloud: [230, 238, 238],
    atmosphere: [86, 157, 194]
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

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
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

  function ridged(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.62;
    let scale = 6.5;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function sampleBackstory(u, v, longitude, latitude) {
    if (window.AUDRALIA_BACKSTORY && typeof window.AUDRALIA_BACKSTORY.sampleIdentity === "function") {
      return window.AUDRALIA_BACKSTORY.sampleIdentity(u, v, { longitude, latitude });
    }

    return {
      oceanBias: 0.7,
      weatheredAge: 1,
      cleanClimate: 1,
      homeWorldSignal: 0.8
    };
  }

  function sampleTectonics(u, v, longitude, latitude) {
    if (window.AUDRALIA_TECTONICS && typeof window.AUDRALIA_TECTONICS.sampleTectonics === "function") {
      return window.AUDRALIA_TECTONICS.sampleTectonics(u, v, { longitude, latitude });
    }

    const ridge = ridged(u * 1.5, v * 1.2, 211000, 5);
    const basin = 1 - fbm(u * 1.8, v * 1.4, 213000, 5);

    return {
      exposedLandPressure: clamp(ridge * 0.42 + fbm(u, v, 210000, 5) * 0.22 - basin * 0.12, 0, 1),
      shelfPressure: clamp(ridged(u * 2.2, v * 1.7, 212000, 5), 0, 1),
      basinPressure: clamp(basin, 0, 1),
      oldRidgePressure: ridge,
      islandPressure: clamp(ridged(u * 2.6, v * 2.0, 214000, 4), 0, 1),
      weatheredEdgePressure: clamp(fbm(u * 2.4, v * 2.0, 215000, 4), 0, 1),
      oceanPressure: 0.72
    };
  }

  function sampleTopology(u, v, longitude, latitude) {
    if (window.AUDRALIA_TOPOLOGY && typeof window.AUDRALIA_TOPOLOGY.sampleTopology === "function") {
      return window.AUDRALIA_TOPOLOGY.sampleTopology(u, v, { longitude, latitude });
    }

    const tectonics = sampleTectonics(u, v, longitude, latitude);

    return {
      landEligibility: tectonics.exposedLandPressure,
      islandEligibility: tectonics.islandPressure,
      shelf: tectonics.shelfPressure,
      basin: tectonics.basinPressure,
      belowSeaDepth: tectonics.oceanPressure,
      aboveSeaPressure: tectonics.exposedLandPressure,
      subterraneanDepth: 0.45
    };
  }

  function landShape(u, v, longitude, latitude) {
    const backstory = sampleBackstory(u, v, longitude, latitude);
    const tectonics = sampleTectonics(u, v, longitude, latitude);
    const topology = sampleTopology(u, v, longitude, latitude);

    const continentArc =
      Math.sin((longitude * 1.35) + Math.cos(latitude * 1.7) * 0.55) * 0.22 +
      Math.cos((longitude * 0.74) - Math.sin(latitude * 1.4) * 0.6) * 0.18;

    const oldPlateNoise = fbm(u * 0.9 + 0.11, v * 0.88 - 0.07, 430000, 6);
    const shelfNoise = ridged(u * 1.8 - 0.13, v * 1.45 + 0.08, 431000, 5);
    const brokenEdge = ridged(u * 3.2 + 0.2, v * 2.6 - 0.14, 432000, 4);
    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);

    const landSignal = clamp(
      topology.landEligibility * 0.46 +
        tectonics.exposedLandPressure * 0.24 +
        oldPlateNoise * 0.2 +
        continentArc * 0.12 +
        topology.islandEligibility * 0.08 -
        backstory.oceanBias * 0.24 -
        latitudeAbs * 0.04,
      0,
      1
    );

    const islandSignal = smoothstep(0.61, 0.89, shelfNoise * 0.6 + brokenEdge * 0.26 + topology.islandEligibility * 0.22);
    const mainLand = landSignal > 0.55;
    const islandLand = !mainLand && islandSignal > 0.68 && topology.shelf > 0.44;
    const isLand = mainLand || islandLand;

    return {
      isLand,
      mainLand,
      islandLand,
      landSignal,
      islandSignal,
      backstory,
      tectonics,
      topology
    };
  }

  function surfaceColor(u, v, longitude, latitude) {
    const shape = landShape(u, v, longitude, latitude);
    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);
    const relief = ridged(u * 2.15 + 0.08, v * 1.62 - 0.05, 440000, 5);
    const climateMoisture = clamp(
      fbm(u * 1.4 - 0.14, v * 1.2 + 0.09, 441000, 5) * 0.52 +
        shape.topology.basin * 0.18 +
        shape.topology.shelf * 0.08 -
        latitudeAbs * 0.12,
      0,
      1
    );

    if (!shape.isLand) {
      let water = mix(COLORS.deepOcean, COLORS.ocean, smoothstep(0.22, 0.86, 1 - shape.topology.belowSeaDepth + fbm(u, v, 450000, 4) * 0.26));
      water = mix(water, COLORS.shelf, smoothstep(0.54, 0.88, shape.topology.shelf) * 0.42);
      water = mix(water, COLORS.shallow, shape.islandSignal * 0.12);
      return shade(water, (fbm(u * 2.0, v * 1.7, 451000, 4) - 0.5) * 6);
    }

    const dry = clamp((1 - climateMoisture) * 0.72 + latitudeAbs * 0.08, 0, 1);
    const high = clamp(relief * 0.56 + shape.tectonics.oldRidgePressure * 0.34, 0, 1);
    const coast = smoothstep(0.5, 0.62, shape.landSignal) * (1 - smoothstep(0.62, 0.78, shape.landSignal));

    let land = COLORS.land;

    land = mix(land, COLORS.wetLand, climateMoisture * 0.42);
    land = mix(land, COLORS.dryLand, dry * 0.38);
    land = mix(land, COLORS.highland, high * 0.26);
    land = mix(land, COLORS.oldStone, high * shape.tectonics.weatheredEdgePressure * 0.22);
    land = mix(land, COLORS.ridge, smoothstep(0.62, 0.9, high) * 0.22);
    land = mix(land, COLORS.coast, coast * 0.16);
    land = mix(land, COLORS.polar, smoothstep(0.72, 0.96, latitudeAbs + high * 0.14) * 0.34);

    const grain = (fbm(u * 3.4 + 0.15, v * 2.7 - 0.11, 460000, 4) - 0.5) * 10;
    const ridgeShade = smoothstep(0.6, 0.9, high) * 10 - shape.topology.basin * 5;

    return shade(land, grain + ridgeShade - 3);
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
      const latitude = (0.5 - v) * Math.PI;

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const longitude = (u - 0.5) * TAU;
        const color = surfaceColor(u, v, longitude, latitude);
        const index = (y * width + x) * 4;

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    return {
      canvas,
      ctx,
      image,
      data,
      width,
      height
    };
  }

  function textureSample(texture, u, v) {
    const x = Math.floor(wrap01(u) * texture.width) % texture.width;
    const y = clamp(Math.floor(clamp(v, 0, 1) * (texture.height - 1)), 0, texture.height - 1);
    const index = (y * texture.width + x) * 4;

    return [
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2]
    ];
  }

  function mount(mountNode, options = {}) {
    const mount =
      mountNode && mountNode.nodeType === 1
        ? mountNode
        : document.body;

    mount.querySelectorAll("canvas[data-audralia-parent-chain-canvas='true']").forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    canvas.dataset.audraliaParentChainCanvas = "true";
    canvas.dataset.audraliaCanvasContract = CONTRACT;
    canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    canvas.dataset.audraliaOceanDrivenHomeWorld = "true";
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

    const ctx = canvas.getContext("2d", { alpha: true });
    const texture = buildTexture(1024, 512);

    const state = {
      disposed: false,
      dragging: false,
      lastX: 0,
      lastY: 0,
      spin: -0.4,
      tilt: -0.08,
      velocity: 0.0024,
      frames: 0,
      lastRender: 0
    };

    function resize() {
      const rect = mount.getBoundingClientRect();
      const size = Math.max(280, Math.min(620, Math.floor(Math.min(rect.width || 420, rect.height || rect.width || 420))));
      const dpr = Math.min(1.35, window.devicePixelRatio || 1);

      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
    }

    function pointerDown(event) {
      state.dragging = true;
      state.lastX = event.clientX || event.touches?.[0]?.clientX || 0;
      state.lastY = event.clientY || event.touches?.[0]?.clientY || 0;
      canvas.setPointerCapture?.(event.pointerId);
    }

    function pointerMove(event) {
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

          let z = Math.sqrt(1 - rr);
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
          const shadeAmount = -36 + lightAmount * 54;

          color = shade(color, shadeAmount);
          color = mix(COLORS.atmosphere, color, limb);
          color = mix(color, COLORS.cloud, smoothstep(0.72, 0.95, fbm(u * 2.2 + state.spin * 0.02, v * 1.7, 470000, 3)) * 0.08);

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
          frames: state.frames
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

    requestAnimationFrame(render);

    function dispose() {
      state.disposed = true;
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.remove();
    }

    window.__AUDRALIA_CANVAS_DISPOSE__ = dispose;

    document.documentElement.dataset.audraliaCanvasLoaded = "true";
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasMounted = "true";
    document.documentElement.dataset.audraliaOceanDrivenHomeWorld = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    return {
      canvas,
      controlsBound: true,
      dispose,
      getStatus
    };
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-canvas",
      exposesMount: true,
      consumesBackstory: Boolean(window.AUDRALIA_BACKSTORY),
      consumesTectonics: Boolean(window.AUDRALIA_TECTONICS),
      consumesTopology: Boolean(window.AUDRALIA_TOPOLOGY),
      oceanDrivenHomeWorld: true,
      earthClone: false,
      hearthIdentity: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_CANVAS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    mount,
    getStatus
  });

  window.AUDRALIA_CANVAS_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaCanvasLoaded = "true";
  document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
  document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
  document.documentElement.dataset.audraliaCanvasExposesMount = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
