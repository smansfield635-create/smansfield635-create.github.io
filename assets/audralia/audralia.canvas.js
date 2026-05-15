// /assets/audralia/audralia.canvas.js
// AUDRALIA_LIVING_CANVAS_PLANET_EXPRESSION_CANVAS_TNT_v2
// Full-file replacement.
// Canvas consumer only.
// Adds living-canvas expression at render time.
// Preserves lattice256, Layer One Landmap, and Layer Two Lush Land Surface authority.
// Canvas does not own footprint.
// Canvas does not author hydrology.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_LIVING_CANVAS_PLANET_EXPRESSION_CANVAS_TNT_v2";
  const RECEIPT = "AUDRALIA_LIVING_CANVAS_PLANET_EXPRESSION_CANVAS_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_MASK_AND_SURFACE_CANVAS_CONSUMER_TNT_v1";
  const LANDMAP_CONTRACT = "AUDRALIA_G1_LAYER_ONE_LANDMAP_RENEWAL_TNT_v1";
  const LAND_SURFACE_CONTRACT = "AUDRALIA_G1_LAYER_TWO_LUSH_LAND_SURFACE_TNT_v1";
  const LATTICE_CONTRACT = "AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-15.audralia-living-canvas-planet-expression-v2";
  const TAU = Math.PI * 2;

  const COLORS = Object.freeze({
    deepOcean: [3, 18, 44],
    ocean: [5, 56, 98],
    openOcean: [6, 66, 108],
    shelf: [20, 106, 132],
    shallow: [48, 143, 146],
    beach: [202, 186, 128],
    wetBeach: [156, 157, 116],
    fallbackLand: [90, 127, 76],
    livingGreen: [103, 150, 82],
    livingGold: [174, 143, 74],
    heartWarm: [186, 162, 96],
    ice: [190, 220, 225],
    snow: [218, 232, 226],
    atmosphere: [86, 157, 194],
    atmosphereBright: [142, 202, 226],
    cloud: [230, 238, 238],
    cloudSoft: [206, 225, 226]
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
      script.src = `${src}?v=audralia-living-canvas-${Date.now()}`;
      script.defer = true;
      script.dataset.loaderFlag = flag;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async function ensureAuthorities() {
    if (!window.AUDRALIA_LATTICE256?.coordinatesFromUV) {
      await loadScriptOnce("/assets/audralia/audralia.lattice256.js", "audraliaLattice256Loaded");
    }

    if (!window.AUDRALIA_LANDMAP?.sampleLandmap) {
      await loadScriptOnce("/assets/audralia/audralia.landmap.js", "audraliaLandmapLoaded");
    }

    if (!window.AUDRALIA_LAND_SURFACE?.sampleSurface) {
      await loadScriptOnce("/assets/audralia/audralia.land.surface.js", "audraliaLandSurfaceLoaded");
    }

    return Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap);
  }

  function fallbackMap(u, v) {
    return Object.freeze({
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
      shelf: 0.2,
      beachEdge: 0,
      isOcean: true,
      isLand: false,
      isShelf: false,
      isBeach: false,
      isPolarIce: false,
      hydrologyHeld: false
    });
  }

  function sampleMap(u, v) {
    if (window.AUDRALIA_LANDMAP?.sampleLandmap) return window.AUDRALIA_LANDMAP.sampleLandmap(u, v);
    return fallbackMap(u, v);
  }

  function oceanColor(map) {
    const u = map.u;
    const v = map.v;
    const oceanTexture = fbm(u * 1.2 + 0.19, v * 0.9 - 0.14, 710000, 5);
    const depth = fbm(u * 0.82 - 0.22, v * 0.72 + 0.11, 710700, 5);
    const grain = (fbm(u * 2.8 + 0.05, v * 2.2 - 0.12, 711000, 4) - 0.5) * 5;

    let color = mix(COLORS.deepOcean, COLORS.ocean, smoothstep(0.16, 0.82, oceanTexture * 0.54 + (map.shelf || 0.2) * 0.18));
    color = mix(color, COLORS.openOcean, smoothstep(0.42, 0.86, 1 - depth) * 0.18);

    return shade(color, grain - 4);
  }

  function surfaceColor(map) {
    const u = map.u;
    const v = map.v;
    const grain = (fbm(u * 2.4 + 0.15, v * 2.0 - 0.11, 460000, 4) - 0.5) * 7;

    if (map.isOcean || map.terrainClass === "ocean") {
      return oceanColor(map);
    }

    if (map.isShelf || map.terrainClass === "shelf") {
      let shelf = mix(COLORS.ocean, COLORS.shelf, smoothstep(0.38, 0.9, map.shelf || 0.5));
      shelf = mix(shelf, COLORS.shallow, smoothstep(0.48, 0.9, map.beachEdge || 0) * 0.16);
      return shade(shelf, grain * 0.3 + 1);
    }

    if (map.isBeach || map.terrainClass === "beach") {
      let beach = mix(COLORS.beach, COLORS.wetBeach, smoothstep(0.42, 0.88, map.shelf || 0.4));
      beach = mix(beach, COLORS.shallow, smoothstep(0.54, 0.92, map.beachEdge || 0) * 0.08);
      return shade(beach, grain * 0.45 + 2);
    }

    if (map.terrainClass === "polar-ice") {
      const p = fbm(u * 3.0, v * 2.4, 720000, 4);
      return shade(mix(COLORS.ice, COLORS.snow, smoothstep(0.42, 0.92, p)), grain * 0.22 + 5);
    }

    if (window.AUDRALIA_LAND_SURFACE?.sampleSurface) {
      const surface = window.AUDRALIA_LAND_SURFACE.sampleSurface(map);
      if (surface.allowed && Array.isArray(surface.color)) return surface.color;
    }

    return shade(COLORS.fallbackLand, grain - 3);
  }

  function isWaterLike(map) {
    return Boolean(
      map?.isOcean ||
      map?.isShelf ||
      map?.terrainClass === "ocean" ||
      map?.terrainClass === "shelf"
    );
  }

  function isBeachLike(map) {
    return Boolean(map?.isBeach || map?.terrainClass === "beach");
  }

  function isLandLike(map) {
    return Boolean(
      map?.isLand ||
      (
        !isWaterLike(map) &&
        !isBeachLike(map) &&
        map?.terrainClass !== "ocean" &&
        map?.terrainClass !== "shelf"
      )
    );
  }

  function liveWaterExpression(color, map, u, v, now, lightAmount, z) {
    const t = now * 0.001;
    const phase = t * 0.055;
    const shelf = clamp(map.shelf || 0.28, 0, 1);
    const edge = clamp(map.beachEdge || 0, 0, 1);
    const shimmerField = fbm(u + phase * 0.38, v + Math.sin(t * 0.18) * 0.018, 812000, 4);
    const crossWave = Math.sin((u * TAU * 18) + (v * 9.5) + t * 1.35) * 0.5 + 0.5;
    const fineWave = Math.sin((u * TAU * 47) - (v * 21) + t * 2.1) * 0.5 + 0.5;
    const specular = smoothstep(0.68, 0.96, shimmerField * 0.58 + crossWave * 0.28 + fineWave * 0.14) * lightAmount * smoothstep(0.08, 0.7, z);
    const shelfGlow = smoothstep(0.38, 0.9, shelf) * 0.14 + smoothstep(0.18, 0.82, edge) * 0.12;
    const waterPulse = (Math.sin(t * 0.74 + shimmerField * TAU) + 1) * 0.5;

    let out = color;
    out = shade(out, (shimmerField - 0.5) * 7 + specular * 18);
    out = mix(out, COLORS.shallow, shelfGlow * (0.45 + waterPulse * 0.22));
    out = mix(out, COLORS.cloudSoft, specular * 0.16);

    return out;
  }

  function liveLandExpression(color, map, u, v, now, lightAmount, z) {
    const t = now * 0.001;
    const className = String(map.terrainClass || "");
    const altitudeBias =
      className.includes("mount") || className.includes("high") ? 0.22 :
      className.includes("basin") || className.includes("valley") ? -0.08 :
      className.includes("polar") || className.includes("ice") ? 0.12 :
      0.04;

    const growthNoise = fbm(u * 1.1 + t * 0.009, v * 1.05 - t * 0.006, 823000, 4);
    const terrainPressure = fbm(u * 2.4 - 0.22, v * 2.1 + 0.17, 823500, 4);
    const developmentPulse = (Math.sin(t * 0.34 + growthNoise * TAU) + 1) * 0.5;
    const heartWarmth = smoothstep(0.34, 0.86, growthNoise) * (0.04 + developmentPulse * 0.065);
    const structureShadow = (terrainPressure - 0.5) * 13 + altitudeBias * 14;

    let out = shade(color, structureShadow);

    if (className === "polar-ice") {
      out = mix(out, COLORS.snow, 0.08 + developmentPulse * 0.04);
      out = shade(out, lightAmount * 6);
      return out;
    }

    out = mix(out, COLORS.livingGreen, heartWarmth * smoothstep(0.08, 0.9, z));
    out = mix(out, COLORS.livingGold, heartWarmth * 0.52);
    out = shade(out, lightAmount * 4);

    return out;
  }

  function liveAtmosphereExpression(color, u, v, now, lightAmount, z, rr) {
    const t = now * 0.001;
    const breath = (Math.sin(t * 0.62) + 1) * 0.5;
    const limb = 1 - smoothstep(0.02, 0.42, z);
    const cloudField = fbm(u + t * 0.004, v - t * 0.003, 834000, 4);
    const highCloud = smoothstep(0.66, 0.88, cloudField) * lightAmount;
    const airStrength = clamp(limb * (0.22 + breath * 0.11), 0, 0.42);
    const cloudStrength = clamp(highCloud * (0.08 + limb * 0.10), 0, 0.24);
    const edgeProtection = smoothstep(0.74, 0.99, rr) * (0.05 + breath * 0.055);

    let out = color;
    out = mix(out, COLORS.atmosphereBright, airStrength);
    out = mix(out, COLORS.cloud, cloudStrength);
    out = mix(out, COLORS.heartWarm, edgeProtection * lightAmount);

    return out;
  }

  function drawAtmosphereHalo(ctx, width, height, cx, cy, radius, now) {
    const t = now * 0.001;
    const breath = (Math.sin(t * 0.62) + 1) * 0.5;
    const halo = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, radius * 1.12);

    halo.addColorStop(0, `rgba(142,202,226,${0.00})`);
    halo.addColorStop(0.38, `rgba(142,202,226,${0.028 + breath * 0.020})`);
    halo.addColorStop(0.72, `rgba(142,202,226,${0.070 + breath * 0.045})`);
    halo.addColorStop(1, "rgba(142,202,226,0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.14, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function buildTexture(width, height) {
    const temp = document.createElement("canvas");
    temp.width = width;
    temp.height = height;

    const ctx = temp.getContext("2d", { alpha: false });
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

    return Object.freeze({
      data,
      width,
      height
    });
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
    canvas.dataset.audraliaLandSurfaceContract = LAND_SURFACE_CONTRACT;
    canvas.dataset.audraliaOceanMaskFirst = "true";
    canvas.dataset.audraliaLayerOneLandmap = "true";
    canvas.dataset.audraliaLayerTwoLushLandSurface = "true";
    canvas.dataset.audraliaCanvasOwnsFootprint = "false";
    canvas.dataset.audraliaCoordinateInspection = "true";
    canvas.dataset.livingCanvasExpression = "true";
    canvas.dataset.atmosphereBreath = "true";
    canvas.dataset.waterShimmerExpression = "true";
    canvas.dataset.landDevelopmentExpression = "true";
    canvas.dataset.futureFormingMotion = "true";
    canvas.dataset.eyesMindHeartTriad = "true";
    canvas.dataset.textureRebuildPerFrame = "false";
    canvas.dataset.canvasStillConsumerOnly = "true";
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
    readout.dataset.audraliaReadoutPosture = "quiet_until_pointer";
    readout.style.position = "absolute";
    readout.style.left = "10px";
    readout.style.bottom = "10px";
    readout.style.padding = "7px 9px";
    readout.style.borderRadius = "12px";
    readout.style.background = "rgba(3,9,20,.58)";
    readout.style.color = "rgba(238,246,255,.82)";
    readout.style.font = "600 11px/1.35 system-ui, sans-serif";
    readout.style.whiteSpace = "pre-line";
    readout.style.pointerEvents = "none";
    readout.style.opacity = "0.38";
    readout.style.transition = "opacity 220ms ease, background 220ms ease";
    readout.textContent = "Audralia living canvas loading…";
    mount.appendChild(readout);

    const ctx = canvas.getContext("2d", { alpha: true });

    let texture = null;
    let readoutQuietTimer = null;

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

    function wakeReadout() {
      readout.style.opacity = "0.92";
      readout.style.background = "rgba(3,9,20,.72)";
      window.clearTimeout(readoutQuietTimer);
      readoutQuietTimer = window.setTimeout(() => {
        if (!state.dragging) {
          readout.style.opacity = "0.42";
          readout.style.background = "rgba(3,9,20,.58)";
        }
      }, 2200);
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

    function updateReadout(map, interactive = false) {
      if (interactive) wakeReadout();

      if (!map) {
        readout.textContent = "Pointer outside Audralia";
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
      updateReadout(pointerToMap(event), true);
      canvas.setPointerCapture?.(event.pointerId);
    }

    function pointerMove(event) {
      updateReadout(pointerToMap(event), true);

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

          const map = sampleMap(u, v);
          let color = textureSample(texture, u, v);

          const lightAmount = clamp(wx * light[0] + sy * light[1] + z * light[2], 0, 1);

          if (isWaterLike(map) || isBeachLike(map)) {
            color = liveWaterExpression(color, map, u, v, now, lightAmount, z);
          } else if (isLandLike(map)) {
            color = liveLandExpression(color, map, u, v, now, lightAmount, z);
          }

          const limb = smoothstep(0.0, 0.16, z);
          const shadeAmount = -36 + lightAmount * 58;

          color = shade(color, shadeAmount);
          color = mix(COLORS.atmosphere, color, limb);
          color = liveAtmosphereExpression(color, u, v, now, lightAmount, z, rr);

          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = Math.round(255 * smoothstep(0.0, 0.025, 1 - rr));
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.putImageData(image, 0, 0);
      drawAtmosphereHalo(ctx, width, height, cx, cy, radius, now);

      if (typeof options.onStatus === "function") {
        options.onStatus("rendering", {
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          frames: state.frames,
          lattice256Loaded: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
          landmapLoaded: Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap),
          landSurfaceLoaded: Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface),
          oceanMaskFirst: true,
          canvasOwnsFootprint: false,
          hydrologyAuthored: false,
          livingCanvasExpression: true,
          atmosphereBreath: true,
          waterShimmerExpression: true,
          landDevelopmentExpression: true,
          futureFormingMotion: true,
          eyesMindHeartTriad: true,
          textureRebuildPerFrame: false,
          canvasStillConsumerOnly: true
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

    ensureAuthorities().then(() => {
      texture = buildTexture(1024, 512);
      state.ready = true;
      updateReadout(sampleMap(0.5, 0.5), false);

      document.documentElement.dataset.audraliaCanvasLoaded = "true";
      document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
      document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
      document.documentElement.dataset.audraliaLattice256Loaded = String(Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV));
      document.documentElement.dataset.audraliaLandmapLoaded = String(Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap));
      document.documentElement.dataset.audraliaLandSurfaceLoaded = String(Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface));
      document.documentElement.dataset.audraliaOceanMaskFirst = "true";
      document.documentElement.dataset.audraliaLayerOneLandmap = "true";
      document.documentElement.dataset.audraliaLayerTwoLushLandSurface = "true";
      document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
      document.documentElement.dataset.audraliaCoordinateInspection = "true";
      document.documentElement.dataset.livingCanvasExpression = "true";
      document.documentElement.dataset.atmosphereBreath = "true";
      document.documentElement.dataset.waterShimmerExpression = "true";
      document.documentElement.dataset.landDevelopmentExpression = "true";
      document.documentElement.dataset.futureFormingMotion = "true";
      document.documentElement.dataset.eyesMindHeartTriad = "true";
      document.documentElement.dataset.textureRebuildPerFrame = "false";
      document.documentElement.dataset.canvasStillConsumerOnly = "true";
      document.documentElement.dataset.hydrologyAuthored = "false";
      document.documentElement.dataset.generatedImage = "false";
      document.documentElement.dataset.graphicBox = "false";
      document.documentElement.dataset.visualPassClaimed = "false";

      requestAnimationFrame(render);
    });

    function dispose() {
      state.disposed = true;
      window.clearTimeout(readoutQuietTimer);
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
      landSurfaceContract: LAND_SURFACE_CONTRACT,
      version: VERSION,
      authority: "audralia-living-canvas-planet-expression-consumer",
      oceanMaskFirst: true,
      layerOneLandmap: true,
      layerTwoLushLandSurface: true,
      consumesLattice256: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
      consumesLandmap: Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap),
      consumesLandSurface: Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface),
      canvasOwnsFootprint: false,
      coordinateInspection: true,
      hydrologyAuthored: false,
      livingCanvasExpression: true,
      atmosphereBreath: true,
      waterShimmerExpression: true,
      landDevelopmentExpression: true,
      futureFormingMotion: true,
      eyesMindHeartTriad: true,
      textureRebuildPerFrame: false,
      canvasStillConsumerOnly: true,
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
    landSurfaceContract: LAND_SURFACE_CONTRACT,
    version: VERSION,
    mount,
    getStatus
  });

  window.AUDRALIA_CANVAS_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaCanvasLoaded = "true";
  document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
  document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
  document.documentElement.dataset.audraliaCanvasExposesMount = "true";
  document.documentElement.dataset.audraliaOceanMaskFirst = "true";
  document.documentElement.dataset.audraliaLayerOneLandmap = "true";
  document.documentElement.dataset.audraliaLayerTwoLushLandSurface = "true";
  document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
  document.documentElement.dataset.audraliaCoordinateInspection = "true";
  document.documentElement.dataset.hydrologyAuthored = "false";
  document.documentElement.dataset.livingCanvasExpression = "true";
  document.documentElement.dataset.atmosphereBreath = "true";
  document.documentElement.dataset.waterShimmerExpression = "true";
  document.documentElement.dataset.landDevelopmentExpression = "true";
  document.documentElement.dataset.futureFormingMotion = "true";
  document.documentElement.dataset.eyesMindHeartTriad = "true";
  document.documentElement.dataset.textureRebuildPerFrame = "false";
  document.documentElement.dataset.canvasStillConsumerOnly = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
