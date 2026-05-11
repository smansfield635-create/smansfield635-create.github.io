// /assets/audralia/audralia.canvas.js
// AUDRALIA_G1_TERRAIN_MASS_ATTACHMENT_CANVAS_TNT_v7
// Full-file replacement.
// Canvas authority only.
// Beaches remain sea level.
// Raised terrain becomes visibly attached behind beach bands.
// No trees. No bushes. No forest canopy.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_TERRAIN_MASS_ATTACHMENT_CANVAS_TNT_v7";
  const RECEIPT = "AUDRALIA_G1_TERRAIN_MASS_ATTACHMENT_CANVAS_RECEIPT_v7";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_RAISED_TERRAIN_BEHIND_BEACH_CANVAS_TNT_v6";
  const VERSION = "2026-05-10.audralia-g1-terrain-mass-attachment-canvas-v7";
  const TAU = Math.PI * 2;

  const COLORS = Object.freeze({
    deepOcean: [3, 18, 44],
    ocean: [5, 56, 98],
    oceanBlue: [8, 73, 116],
    shelf: [20, 106, 132],
    shallow: [48, 143, 146],
    beach: [198, 181, 124],
    wetBeach: [151, 154, 112],
    tidalFlat: [114, 137, 104],
    raisedLand: [94, 136, 80],
    lowland: [70, 116, 72],
    plateau: [124, 143, 91],
    ridge: [139, 136, 121],
    oldStone: [116, 116, 108],
    basin: [68, 95, 68],
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

  function landShape(u, v, longitude, latitude) {
    const tectonics = window.AUDRALIA_TECTONICS?.sampleTectonics
      ? window.AUDRALIA_TECTONICS.sampleTectonics(u, v, { longitude, latitude })
      : {
          exposedLandPressure: ridged(u * 1.5, v * 1.2, 211000, 5),
          shelfPressure: ridged(u * 2.2, v * 1.7, 212000, 5),
          basinPressure: 1 - fbm(u * 1.8, v * 1.4, 213000, 5),
          oldRidgePressure: ridged(u * 1.5, v * 1.2, 211000, 5),
          islandPressure: ridged(u * 2.6, v * 2.0, 214000, 4),
          weatheredEdgePressure: fbm(u * 2.4, v * 2.0, 215000, 4),
          oceanPressure: 0.72
        };

    const topology = window.AUDRALIA_TOPOLOGY?.sampleTopology
      ? window.AUDRALIA_TOPOLOGY.sampleTopology(u, v, { longitude, latitude })
      : {
          landEligibility: tectonics.exposedLandPressure,
          islandEligibility: tectonics.islandPressure,
          shelf: tectonics.shelfPressure,
          basin: tectonics.basinPressure,
          belowSeaDepth: tectonics.oceanPressure,
          aboveSeaPressure: tectonics.exposedLandPressure
        };

    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);
    const continentArc =
      Math.sin((longitude * 1.35) + Math.cos(latitude * 1.7) * 0.55) * 0.22 +
      Math.cos((longitude * 0.74) - Math.sin(latitude * 1.4) * 0.6) * 0.18;

    const oldPlateNoise = fbm(u * 0.9 + 0.11, v * 0.88 - 0.07, 430000, 6);
    const shelfNoise = ridged(u * 1.8 - 0.13, v * 1.45 + 0.08, 431000, 5);
    const brokenEdge = ridged(u * 3.2 + 0.2, v * 2.6 - 0.14, 432000, 4);

    const landSignal = clamp(
      topology.landEligibility * 0.5 +
        tectonics.exposedLandPressure * 0.27 +
        oldPlateNoise * 0.23 +
        continentArc * 0.13 +
        topology.islandEligibility * 0.1 -
        0.145 -
        latitudeAbs * 0.035,
      0,
      1
    );

    const islandSignal = smoothstep(
      0.58,
      0.87,
      shelfNoise * 0.6 + brokenEdge * 0.26 + topology.islandEligibility * 0.24
    );

    const shelf = clamp(
      topology.shelf * 0.55 +
        smoothstep(0.43, 0.59, landSignal) * 0.28 +
        islandSignal * 0.14,
      0,
      1
    );

    const exposure = clamp(Math.max(landSignal, islandSignal * 0.9), 0, 1);

    return { tectonics, topology, landSignal, islandSignal, shelf, exposure };
  }

  function sampleElevation(u, v, longitude, latitude, shape) {
    if (window.AUDRALIA_ELEVATION?.sampleElevation) {
      return window.AUDRALIA_ELEVATION.sampleElevation(u, v, {
        longitude,
        latitude,
        isLand: shape.exposure > 0.48,
        landSignal: shape.landSignal,
        shelf: shape.shelf
      });
    }

    return {
      elevation: ridged(u * 2.15, v * 1.62, 440000, 5),
      ridge: ridged(u * 1.75, v * 1.32, 510000, 5),
      highland: fbm(u * 1.35, v * 1.15, 512000, 5),
      basin: 1 - fbm(u * 1.95, v * 1.48, 513000, 5),
      valley: ridged(u * 3.25, v * 2.72, 514000, 4),
      reliefShadow: 0.35,
      reliefHighlight: 0.35,
      terrainDepth: 0.4,
      oceanDepthRelief: shape.topology.belowSeaDepth * 0.38,
      seaFloorRidge: ridged(u * 2.05, v * 1.72, 515000, 5)
    };
  }

  function sampleBeach(u, v, longitude, latitude, shape, elevation) {
    if (window.AUDRALIA_BEACHES?.sampleBeach) {
      return window.AUDRALIA_BEACHES.sampleBeach(u, v, {
        longitude,
        latitude,
        isLand: shape.exposure > 0.48,
        landSignal: shape.landSignal,
        islandSignal: shape.islandSignal,
        shelf: shape.shelf,
        elevation: elevation.elevation
      });
    }

    const beachEdge =
      smoothstep(0.455, 0.535, shape.exposure) *
      (1 - smoothstep(0.555, 0.665, shape.exposure));

    return {
      beachBand: beachEdge,
      beachSand: beachEdge * 0.82,
      tidalFlat: beachEdge * 0.24,
      coastalWetland: 0.08,
      duneRise: beachEdge * 0.18
    };
  }

  function sampleLandRise(u, v, longitude, latitude, shape, elevation, beach) {
    if (window.AUDRALIA_LANDRISE?.sampleLandRise) {
      return window.AUDRALIA_LANDRISE.sampleLandRise(u, v, {
        longitude,
        latitude,
        landSignal: shape.landSignal,
        islandSignal: shape.islandSignal,
        shelf: shape.shelf,
        elevation: elevation.elevation,
        beachBand: beach.beachBand
      });
    }

    const exposure = shape.exposure;
    const beachEdge =
      smoothstep(0.455, 0.535, exposure) *
      (1 - smoothstep(0.555, 0.665, exposure));

    const terrainDrive =
      exposure * 0.5 +
      elevation.elevation * 0.22 +
      fbm(u * 1.08, v * 0.96, 910000, 6) * 0.2 +
      ridged(u * 2.12, v * 1.72, 912000, 5) * 0.15 -
      beachEdge * 0.1;

    const raisedTerrain = clamp(
      smoothstep(0.43, 0.62, terrainDrive) +
        smoothstep(0.515, 0.665, exposure) * 0.45,
      0,
      1
    );

    return {
      beachRemainsSeaLevel: true,
      beachEdge,
      raisedTerrain,
      inlandCore: Math.max(0, raisedTerrain - beachEdge * 0.12),
      lowland: raisedTerrain * 0.36 + elevation.basin * 0.16,
      plateau: raisedTerrain * 0.36 + elevation.highland * 0.2,
      ridgeBack: raisedTerrain * 0.24 + elevation.ridge * 0.2,
      terrainShadow: elevation.reliefShadow * 0.22,
      terrainHighlight: elevation.reliefHighlight * 0.22 + raisedTerrain * 0.18,
      terrainAboveSeaLevel: raisedTerrain > 0.18,
      terrainMassAttached: raisedTerrain > 0.16
    };
  }

  function surfaceColor(u, v, longitude, latitude) {
    const shape = landShape(u, v, longitude, latitude);
    const elevation = sampleElevation(u, v, longitude, latitude, shape);
    const beach = sampleBeach(u, v, longitude, latitude, shape, elevation);
    const landrise = sampleLandRise(u, v, longitude, latitude, shape, elevation, beach);

    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);

    const beachEdge =
      smoothstep(0.455, 0.535, shape.exposure) *
      (1 - smoothstep(0.555, 0.665, shape.exposure));

    const forcedTerrain =
      shape.exposure > 0.555 ||
      landrise.terrainAboveSeaLevel ||
      landrise.raisedTerrain > 0.18;

    const beachOnly =
      !forcedTerrain &&
      (beachEdge > 0.12 || beach.beachBand > 0.16);

    const tidalOnly =
      !forcedTerrain &&
      !beachOnly &&
      beach.tidalFlat > 0.14;

    const moisture = clamp(
      fbm(u * 1.4 - 0.14, v * 1.2 + 0.09, 441000, 5) * 0.52 +
        shape.topology.basin * 0.18 +
        shape.shelf * 0.08 +
        beach.coastalWetland * 0.12 -
        latitudeAbs * 0.12,
      0,
      1
    );

    if (!forcedTerrain && !beachOnly && !tidalOnly) {
      let water = mix(
        COLORS.deepOcean,
        COLORS.ocean,
        smoothstep(0.22, 0.86, 1 - shape.topology.belowSeaDepth + fbm(u, v, 450000, 4) * 0.26)
      );

      water = mix(water, COLORS.oceanBlue, smoothstep(0.32, 0.74, 1 - shape.topology.belowSeaDepth) * 0.16);
      water = mix(water, COLORS.shelf, smoothstep(0.48, 0.86, shape.shelf) * 0.44);
      water = mix(water, COLORS.shallow, shape.islandSignal * 0.12);
      water = mix(water, COLORS.deepOcean, elevation.oceanDepthRelief * 0.1);

      return shade(
        water,
        (elevation.seaFloorRidge || 0) * 3 -
          (elevation.oceanDepthRelief || 0) * 5 +
          (fbm(u * 2.0, v * 1.7, 451000, 4) - 0.5) * 6
      );
    }

    if (beachOnly || tidalOnly) {
      let sand = COLORS.beach;

      sand = mix(sand, COLORS.wetBeach, beach.tidalFlat * 0.38);
      sand = mix(sand, COLORS.tidalFlat, beach.coastalWetland * 0.22);
      sand = mix(sand, COLORS.shallow, tidalOnly ? 0.15 : 0.035);

      return shade(
        sand,
        (fbm(u * 4.1, v * 3.4, 650000, 4) - 0.5) * 8 +
          (beach.duneRise || 0) * 5 -
          beach.tidalFlat * 4
      );
    }

    let land = COLORS.raisedLand;

    land = mix(land, COLORS.lowland, landrise.lowland * 0.24 + moisture * 0.14);
    land = mix(land, COLORS.plateau, landrise.plateau * 0.28);
    land = mix(land, COLORS.ridge, landrise.ridgeBack * 0.24);
    land = mix(land, COLORS.oldStone, elevation.terrainDepth * 0.12);
    land = mix(land, COLORS.basin, elevation.basin * 0.1);
    land = mix(land, COLORS.beach, beachEdge * 0.08);
    land = mix(land, COLORS.polar, smoothstep(0.72, 0.96, latitudeAbs + elevation.elevation * 0.14) * 0.22);

    const grain = (fbm(u * 3.4 + 0.15, v * 2.7 - 0.11, 460000, 4) - 0.5) * 9;
    const reliefLight =
      landrise.terrainHighlight * 18 -
      landrise.terrainShadow * 16 +
      elevation.reliefHighlight * 7 -
      elevation.reliefShadow * 7;

    return shade(land, grain + reliefLight - 3);
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
    canvas.dataset.audraliaGeneration = "1";
    canvas.dataset.audraliaG1Baseline = "terrain-mass-attachment-stabilizing";
    canvas.dataset.audraliaBeachRemainsSeaLevel = "true";
    canvas.dataset.audraliaRaisedTerrainBehindBeach = "true";
    canvas.dataset.audraliaTerrainMassAttached = "true";
    canvas.dataset.audraliaTerrainAboveSeaLevel = "true";
    canvas.dataset.audraliaNoTrees = "true";
    canvas.dataset.audraliaNoBushes = "true";
    canvas.dataset.audraliaNoForestCanopy = "true";
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
          const shadeAmount = -34 + lightAmount * 56;

          color = shade(color, shadeAmount);
          color = mix(COLORS.atmosphere, color, limb);
          color = mix(color, COLORS.cloud, smoothstep(0.76, 0.97, fbm(u * 2.2 + state.spin * 0.02, v * 1.7, 470000, 3)) * 0.04);

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
    document.documentElement.dataset.audraliaBeachRemainsSeaLevel = "true";
    document.documentElement.dataset.audraliaRaisedTerrainBehindBeach = "true";
    document.documentElement.dataset.audraliaTerrainMassAttached = "true";
    document.documentElement.dataset.audraliaTerrainAboveSeaLevel = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    return { canvas, controlsBound: true, dispose, getStatus };
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-canvas",
      generation: 1,
      baseline: "terrain-mass-attachment-stabilizing",
      consumesLandrise: Boolean(window.AUDRALIA_LANDRISE),
      beachRemainsSeaLevel: true,
      raisedTerrainBehindBeach: true,
      terrainMassAttached: true,
      terrainAboveSeaLevel: true,
      noTrees: true,
      noBushes: true,
      noForestCanopy: true,
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
