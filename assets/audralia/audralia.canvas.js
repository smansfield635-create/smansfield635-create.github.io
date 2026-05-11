// /assets/audralia/audralia.canvas.js
// AUDRALIA_G1_BEACH_TO_LAND_RISE_CANVAS_TNT_v4
// Full-file replacement.
// Canvas authority only.
// Purpose:
// - Convert current sea-level strips into beaches.
// - Attach raised land behind beach/coast bands.
// - Preserve Audralia as an ocean-dominant clean ancient home-world.
// - Consume AUDRALIA_BACKSTORY, AUDRALIA_TECTONICS, AUDRALIA_TOPOLOGY, AUDRALIA_ELEVATION, and AUDRALIA_BEACHES.
// Not Hearth. Not Earth clone. Not Audralia-as-Australia.
// No trees. No bushes. No forest canopy. No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_BEACH_TO_LAND_RISE_CANVAS_TNT_v4";
  const RECEIPT = "AUDRALIA_G1_BEACH_TO_LAND_RISE_CANVAS_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_TERRAIN_ELEVATION_CANVAS_TNT_v3";
  const VERSION = "2026-05-10.audralia-g1-beach-to-land-rise-canvas-v4";

  const TAU = Math.PI * 2;

  const COLORS = Object.freeze({
    space: [2, 7, 18],
    deepOcean: [3, 18, 44],
    ocean: [5, 55, 96],
    oceanBlue: [7, 70, 112],
    shelf: [18, 105, 130],
    shallow: [45, 142, 145],
    beach: [188, 172, 118],
    wetBeach: [146, 153, 112],
    tidalFlat: [115, 137, 104],
    coast: [144, 166, 119],
    wetLand: [60, 122, 84],
    land: [106, 142, 84],
    raisedLand: [118, 148, 88],
    dryLand: [158, 140, 86],
    highland: [125, 130, 101],
    oldStone: [118, 118, 111],
    ridge: [143, 141, 128],
    valley: [78, 103, 77],
    basin: [75, 93, 68],
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

    const seaLevelSignal = clamp(
      topology.landEligibility * 0.5 +
        tectonics.exposedLandPressure * 0.27 +
        oldPlateNoise * 0.23 +
        continentArc * 0.13 +
        topology.islandEligibility * 0.1 -
        backstory.oceanBias * 0.205 -
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
        smoothstep(0.43, 0.59, seaLevelSignal) * 0.28 +
        islandSignal * 0.14,
      0,
      1
    );

    const initialSeaLevelLand = seaLevelSignal > 0.515 || (islandSignal > 0.64 && topology.shelf > 0.39);

    return {
      initialSeaLevelLand,
      seaLevelSignal,
      landSignal: seaLevelSignal,
      islandSignal,
      shelf,
      backstory,
      tectonics,
      topology
    };
  }

  function sampleElevation(u, v, longitude, latitude, shape) {
    if (window.AUDRALIA_ELEVATION && typeof window.AUDRALIA_ELEVATION.sampleElevation === "function") {
      return window.AUDRALIA_ELEVATION.sampleElevation(u, v, {
        longitude,
        latitude,
        isLand: shape.initialSeaLevelLand === true,
        landSignal: shape.landSignal,
        shelf: shape.shelf
      });
    }

    const relief = ridged(u * 2.15 + 0.08, v * 1.62 - 0.05, 440000, 5);
    const basin = shape.topology.basin;
    const ridge = shape.tectonics.oldRidgePressure;

    return {
      elevation: clamp(relief * 0.48 + ridge * 0.28 - basin * 0.14, 0, 1),
      ridge,
      highland: relief,
      basin,
      valley: clamp(basin * 0.5, 0, 1),
      coastalCliff: clamp(shape.shelf * 0.24 + shape.tectonics.weatheredEdgePressure * 0.24, 0, 1),
      shelfEscarpment: shape.shelf,
      seaFloorRidge: ridged(u * 2.05, v * 1.72, 515000, 5),
      reliefShadow: clamp(basin * 0.32, 0, 1),
      reliefHighlight: clamp(relief * 0.34 + ridge * 0.2, 0, 1),
      terrainDepth: clamp(relief * 0.5 + ridge * 0.2, 0, 1),
      oceanDepthRelief: clamp(shape.topology.belowSeaDepth * 0.38, 0, 1)
    };
  }

  function sampleBeach(u, v, longitude, latitude, shape, elevation) {
    if (window.AUDRALIA_BEACHES && typeof window.AUDRALIA_BEACHES.sampleBeach === "function") {
      return window.AUDRALIA_BEACHES.sampleBeach(u, v, {
        longitude,
        latitude,
        isLand: shape.initialSeaLevelLand === true,
        landSignal: shape.landSignal,
        islandSignal: shape.islandSignal,
        shelf: shape.shelf,
        elevation: elevation.elevation
      });
    }

    const beachBand = smoothstep(0.46, 0.68, Math.max(shape.landSignal, shape.islandSignal * 0.82));
    const aboveSeaLand = smoothstep(0.56, 0.82, shape.landSignal + elevation.elevation * 0.24);

    return {
      existingSeaLevelExposure: Math.max(shape.landSignal, shape.islandSignal * 0.82),
      beachBand,
      beachSand: beachBand * 0.75,
      tidalFlat: beachBand * 0.32,
      coastalWetland: shape.topology.basin * 0.18,
      attachedLandBias: shape.landSignal,
      aboveSeaLand,
      inlandRise: aboveSeaLand * 0.46 + elevation.elevation * 0.24,
      duneRise: beachBand * 0.24,
      landAttachActive: true,
      seaLevelStripsBecomeBeach: true,
      raisedLandBehindBeach: true
    };
  }

  function surfaceColor(u, v, longitude, latitude) {
    const shape = landShape(u, v, longitude, latitude);
    const elevation = sampleElevation(u, v, longitude, latitude, shape);
    const beach = sampleBeach(u, v, longitude, latitude, shape, elevation);

    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);
    const raisedLand = beach.aboveSeaLand > 0.35 || beach.inlandRise > 0.42;
    const beachOnly = !raisedLand && beach.beachBand > 0.18;
    const tidalOnly = !raisedLand && !beachOnly && beach.tidalFlat > 0.16;

    const climateMoisture = clamp(
      fbm(u * 1.4 - 0.14, v * 1.2 + 0.09, 441000, 5) * 0.52 +
        shape.topology.basin * 0.18 +
        shape.shelf * 0.08 +
        beach.coastalWetland * 0.12 -
        latitudeAbs * 0.12,
      0,
      1
    );

    if (!raisedLand && !beachOnly && !tidalOnly) {
      let water = mix(
        COLORS.deepOcean,
        COLORS.ocean,
        smoothstep(0.22, 0.86, 1 - shape.topology.belowSeaDepth + fbm(u, v, 450000, 4) * 0.26)
      );

      water = mix(water, COLORS.oceanBlue, smoothstep(0.32, 0.74, 1 - shape.topology.belowSeaDepth) * 0.16);
      water = mix(water, COLORS.shelf, smoothstep(0.48, 0.86, shape.shelf) * 0.48);
      water = mix(water, COLORS.shallow, shape.islandSignal * 0.15);
      water = mix(water, COLORS.shallow, beach.tidalFlat * 0.1);
      water = mix(water, COLORS.deepOcean, elevation.oceanDepthRelief * 0.12);
      water = shade(water, elevation.seaFloorRidge * 4 - elevation.oceanDepthRelief * 6);
      return shade(water, (fbm(u * 2.0, v * 1.7, 451000, 4) - 0.5) * 6);
    }

    if (beachOnly || tidalOnly) {
      let sand = COLORS.beach;
      sand = mix(sand, COLORS.wetBeach, beach.tidalFlat * 0.4);
      sand = mix(sand, COLORS.tidalFlat, beach.coastalWetland * 0.24);
      sand = mix(sand, COLORS.coast, beach.duneRise * 0.16);
      sand = mix(sand, COLORS.shallow, tidalOnly ? 0.16 : 0.04);
      sand = shade(sand, (fbm(u * 4.1, v * 3.4, 650000, 4) - 0.5) * 8 + beach.duneRise * 7 - beach.tidalFlat * 5);
      return sand;
    }

    const dry = clamp((1 - climateMoisture) * 0.72 + latitudeAbs * 0.08, 0, 1);
    const coast = smoothstep(0.48, 0.61, shape.landSignal) * (1 - smoothstep(0.64, 0.8, shape.landSignal));

    let land = COLORS.raisedLand;

    land = mix(land, COLORS.land, 0.28);
    land = mix(land, COLORS.wetLand, climateMoisture * 0.36);
    land = mix(land, COLORS.dryLand, dry * 0.28);
    land = mix(land, COLORS.valley, elevation.valley * 0.16);
    land = mix(land, COLORS.basin, elevation.basin * 0.15);
    land = mix(land, COLORS.highland, elevation.highland * 0.24);
    land = mix(land, COLORS.oldStone, elevation.terrainDepth * 0.16);
    land = mix(land, COLORS.ridge, elevation.ridge * 0.2);
    land = mix(land, COLORS.coast, coast * 0.16);
    land = mix(land, COLORS.beach, beach.beachBand * 0.12);
    land = mix(land, COLORS.polar, smoothstep(0.72, 0.96, latitudeAbs + elevation.elevation * 0.14) * 0.28);

    const grain = (fbm(u * 3.4 + 0.15, v * 2.7 - 0.11, 460000, 4) - 0.5) * 9;
    const reliefLight = elevation.reliefHighlight * 16 - elevation.reliefShadow * 17 + elevation.coastalCliff * 5 + beach.inlandRise * 8;

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

    return { canvas, ctx, image, data, width, height };
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
    canvas.dataset.audraliaGeneration = "1";
    canvas.dataset.audraliaG1Baseline = "beach-to-land-rise-stabilizing";
    canvas.dataset.audraliaBeachToLandRiseActive = "true";
    canvas.dataset.audraliaSeaLevelStripsBecomeBeach = "true";
    canvas.dataset.audraliaRaisedLandBehindBeach = "true";
    canvas.dataset.audraliaLandAttachActive = "true";
    canvas.dataset.audraliaOceanDrivenHomeWorld = "true";
    canvas.dataset.audraliaNotAustralia = "true";
    canvas.dataset.audraliaEarthClone = "false";
    canvas.dataset.audraliaHearthIdentity = "false";
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
          color = mix(color, COLORS.cloud, smoothstep(0.76, 0.97, fbm(u * 2.2 + state.spin * 0.02, v * 1.7, 470000, 3)) * 0.05);

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
    document.documentElement.dataset.audraliaGeneration = "1";
    document.documentElement.dataset.audraliaG1Baseline = "beach-to-land-rise-stabilizing";
    document.documentElement.dataset.audraliaBeachToLandRiseActive = "true";
    document.documentElement.dataset.audraliaSeaLevelStripsBecomeBeach = "true";
    document.documentElement.dataset.audraliaRaisedLandBehindBeach = "true";
    document.documentElement.dataset.audraliaLandAttachActive = "true";
    document.documentElement.dataset.audraliaOceanDrivenHomeWorld = "true";
    document.documentElement.dataset.audraliaNotAustralia = "true";
    document.documentElement.dataset.audraliaEarthClone = "false";
    document.documentElement.dataset.audraliaHearthIdentity = "false";
    document.documentElement.dataset.audraliaNoTrees = "true";
    document.documentElement.dataset.audraliaNoBushes = "true";
    document.documentElement.dataset.audraliaNoForestCanopy = "true";
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
      generation: 1,
      baseline: "beach-to-land-rise-stabilizing",
      consumesBackstory: Boolean(window.AUDRALIA_BACKSTORY),
      consumesTectonics: Boolean(window.AUDRALIA_TECTONICS),
      consumesTopology: Boolean(window.AUDRALIA_TOPOLOGY),
      consumesElevation: Boolean(window.AUDRALIA_ELEVATION),
      consumesBeaches: Boolean(window.AUDRALIA_BEACHES),
      seaLevelStripsBecomeBeach: true,
      raisedLandBehindBeach: true,
      landAttachActive: true,
      oceanDrivenHomeWorld: true,
      audraliaNotAustralia: true,
      earthClone: false,
      hearthIdentity: false,
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
  document.documentElement.dataset.audraliaGeneration = "1";
  document.documentElement.dataset.audraliaG1Baseline = "beach-to-land-rise-stabilizing";
  document.documentElement.dataset.audraliaBeachToLandRiseActive = "true";
  document.documentElement.dataset.audraliaNotAustralia = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
