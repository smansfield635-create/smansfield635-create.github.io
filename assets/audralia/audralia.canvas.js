// /assets/audralia/audralia.canvas.js
// AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3
// Full-file replacement.
// Canvas consumer only.
// Exposes window.AUDRALIA_CANVAS.contract = AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3.
// Keeps living-canvas render behavior and adds visible update notice.
// Consumes lattice, landmap, climate, and land surface when available.
// Does not own footprint.
// Does not own climate.
// Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3";
  const RECEIPT = "AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "AUDRALIA_LIVING_CANVAS_PLANET_EXPRESSION_CANVAS_TNT_v2";
  const VERSION = "2026-05-15.audralia-visible-update-notice-canvas-v3";
  const TAU = Math.PI * 2;

  const EXPECTED = Object.freeze({
    lattice: "AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_TNT_v1",
    landmap: "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1",
    climate: "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2"
  });

  const COLORS = Object.freeze({
    deepOcean: [3, 18, 44],
    ocean: [5, 56, 98],
    openOcean: [6, 66, 108],
    shelf: [20, 106, 132],
    shallow: [48, 143, 146],
    beach: [202, 186, 128],
    wetBeach: [156, 157, 116],
    fallbackLand: [92, 132, 76],
    livingGreen: [100, 154, 86],
    livingGold: [174, 143, 74],
    ice: [190, 220, 225],
    snow: [218, 232, 226],
    atmosphere: [86, 157, 194],
    atmosphereBright: [142, 202, 226],
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
    const s = Math.max(2, Math.floor(scale));
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
      const prior = document.querySelector(`script[data-audralia-canvas-loader="${flag}"]`);
      if (prior) {
        prior.addEventListener("load", () => resolve(true), { once: true });
        prior.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(CONTRACT)}.${Date.now()}`;
      script.defer = true;
      script.dataset.audraliaCanvasLoader = flag;
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

    if (!window.AUDRALIA_CLIMATE_RENDER?.sampleClimate) {
      await loadScriptOnce("/assets/audralia/audralia.climate.render.js", "audraliaClimateLoaded");
    }

    if (!window.AUDRALIA_LAND_SURFACE?.sampleSurface) {
      await loadScriptOnce("/assets/audralia/audralia.land.surface.js", "audraliaLandSurfaceLoaded");
    }

    return Object.freeze({
      latticeLoaded: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
      landmapLoaded: Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap),
      climateLoaded: Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate),
      landSurfaceLoaded: Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface),
      latticeContract: String(window.AUDRALIA_LATTICE256?.contract || ""),
      landmapContract: String(window.AUDRALIA_LANDMAP?.contract || ""),
      climateContract: String(window.AUDRALIA_CLIMATE_RENDER?.contract || ""),
      landSurfaceContract: String(window.AUDRALIA_LAND_SURFACE?.contract || "")
    });
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
      summitProvince: "Gratitude",
      terrainClass: "ocean",
      topology: "ocean",
      elevation: "sea",
      shelf: 0.2,
      beachEdge: 0,
      isOcean: true,
      isLand: false,
      isShelf: false,
      isBeach: false,
      isPolarIce: false
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

  function climateColor(map) {
    if (!window.AUDRALIA_CLIMATE_RENDER?.sampleClimate) return null;

    const climate = window.AUDRALIA_CLIMATE_RENDER.sampleClimate(map);
    if (!climate?.allowed || !Array.isArray(climate.color)) return null;

    return climate.color;
  }

  function landSurfaceColor(map) {
    if (!window.AUDRALIA_LAND_SURFACE?.sampleSurface) return null;

    const surface = window.AUDRALIA_LAND_SURFACE.sampleSurface(map);
    if (!surface?.allowed || !Array.isArray(surface.color)) return null;

    return surface.color;
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
      const climate = climateColor(map);
      if (climate) return shade(climate, grain * 0.28 + 1);

      let beach = mix(COLORS.beach, COLORS.wetBeach, smoothstep(0.42, 0.88, map.shelf || 0.4));
      beach = mix(beach, COLORS.shallow, smoothstep(0.54, 0.92, map.beachEdge || 0) * 0.08);
      return shade(beach, grain * 0.45 + 2);
    }

    if (map.terrainClass === "polar-ice") {
      const p = fbm(u * 3.0, v * 2.4, 720000, 4);
      return shade(mix(COLORS.ice, COLORS.snow, smoothstep(0.42, 0.92, p)), grain * 0.22 + 5);
    }

    const surface = landSurfaceColor(map);
    if (surface) return surface;

    const climate = climateColor(map);
    if (climate) return shade(climate, grain * 0.22);

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
    return !isWaterLike(map) && !isBeachLike(map);
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

    return Object.freeze({ data, width, height });
  }

  function textureSample(texture, u, v) {
    const x = Math.floor(wrap01(u) * texture.width) % texture.width;
    const y = clamp(Math.floor(clamp(v, 0, 1) * (texture.height - 1)), 0, texture.height - 1);
    const index = (y * texture.width + x) * 4;
    return [texture.data[index], texture.data[index + 1], texture.data[index + 2]];
  }

  function liveWaterExpression(color, map, u, v, now, lightAmount, z) {
    const t = now * 0.001;
    const phase = t * 0.055;
    const shelf = clamp(map.shelf || 0.28, 0, 1);
    const edge = clamp(map.beachEdge || 0, 0, 1);
    const shimmer = fbm(u + phase * 0.38, v + Math.sin(t * 0.18) * 0.018, 812000, 4);
    const wave = Math.sin((u * TAU * 18) + (v * 9.5) + t * 1.35) * 0.5 + 0.5;
    const specular = smoothstep(0.68, 0.96, shimmer * 0.62 + wave * 0.30) * lightAmount * smoothstep(0.08, 0.7, z);
    const shelfGlow = smoothstep(0.38, 0.9, shelf) * 0.14 + smoothstep(0.18, 0.82, edge) * 0.12;

    let out = shade(color, (shimmer - 0.5) * 7 + specular * 18);
    out = mix(out, COLORS.shallow, shelfGlow * 0.52);
    out = mix(out, COLORS.cloud, specular * 0.13);

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

    const growth = fbm(u * 1.1 + t * 0.009, v * 1.05 - t * 0.006, 823000, 4);
    const pressure = fbm(u * 2.4 - 0.22, v * 2.1 + 0.17, 823500, 4);
    const pulse = (Math.sin(t * 0.34 + growth * TAU) + 1) * 0.5;
    const warmth = smoothstep(0.34, 0.86, growth) * (0.04 + pulse * 0.065);
    const structureShadow = (pressure - 0.5) * 13 + altitudeBias * 14;

    let out = shade(color, structureShadow);
    out = mix(out, COLORS.livingGreen, warmth * smoothstep(0.08, 0.9, z));
    out = mix(out, COLORS.livingGold, warmth * 0.36);
    out = shade(out, lightAmount * 4);

    return out;
  }

  function liveAtmosphereExpression(color, u, v, now, lightAmount, z, rr) {
    const t = now * 0.001;
    const breath = (Math.sin(t * 0.62) + 1) * 0.5;
    const limb = 1 - smoothstep(0.02, 0.42, z);
    const cloudField = fbm(u + t * 0.004, v - t * 0.003, 834000, 4);
    const highCloud = smoothstep(0.66, 0.88, cloudField) * lightAmount;
    const air = clamp(limb * (0.22 + breath * 0.11), 0, 0.42);
    const cloud = clamp(highCloud * (0.08 + limb * 0.10), 0, 0.24);
    const edge = smoothstep(0.74, 0.99, rr) * (0.05 + breath * 0.055);

    let out = mix(color, COLORS.atmosphereBright, air);
    out = mix(out, COLORS.cloud, cloud);
    out = mix(out, COLORS.livingGold, edge * lightAmount * 0.75);

    return out;
  }

  function drawAtmosphereHalo(ctx, width, height, cx, cy, radius, now) {
    const t = now * 0.001;
    const breath = (Math.sin(t * 0.62) + 1) * 0.5;
    const halo = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, radius * 1.12);

    halo.addColorStop(0, "rgba(142,202,226,0)");
    halo.addColorStop(0.40, `rgba(142,202,226,${0.028 + breath * 0.020})`);
    halo.addColorStop(0.74, `rgba(142,202,226,${0.070 + breath * 0.045})`);
    halo.addColorStop(1, "rgba(142,202,226,0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.14, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function makeNotice() {
    const notice = document.createElement("div");
    notice.dataset.audraliaVersionNotice = "true";
    notice.style.position = "absolute";
    notice.style.right = "10px";
    notice.style.top = "10px";
    notice.style.zIndex = "9";
    notice.style.maxWidth = "min(88%, 420px)";
    notice.style.padding = "9px 11px";
    notice.style.border = "1px solid rgba(143,240,195,.36)";
    notice.style.borderRadius = "14px";
    notice.style.background = "linear-gradient(180deg, rgba(4,18,24,.84), rgba(3,10,18,.74))";
    notice.style.color = "rgba(214,255,232,.94)";
    notice.style.font = "800 11px/1.35 system-ui, sans-serif";
    notice.style.letterSpacing = ".02em";
    notice.style.boxShadow = "0 14px 40px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.08)";
    notice.style.backdropFilter = "blur(8px)";
    notice.style.pointerEvents = "none";
    notice.textContent = "Audralia v3 update check loading…";
    return notice;
  }

  function updateNotice(notice, status) {
    const landmap = status.landmapLoaded ? "landmap active" : "landmap missing";
    const climate = status.climateLoaded ? "climate v2 active" : "climate pending";
    const surface = status.landSurfaceLoaded ? "surface active" : "surface fallback";

    notice.textContent = `Audralia v3 update active · ${landmap} · ${climate} · ${surface}`;
    notice.title = [
      CONTRACT,
      `previous=${PREVIOUS_CONTRACT}`,
      `landmap=${status.landmapContract || "unknown"}`,
      `climate=${status.climateContract || "unknown"}`,
      `surface=${status.landSurfaceContract || "unknown"}`
    ].join("\n");

    notice.dataset.audraliaCanvasContract = CONTRACT;
    notice.dataset.landmapLoaded = String(status.landmapLoaded);
    notice.dataset.climateLoaded = String(status.climateLoaded);
    notice.dataset.landSurfaceLoaded = String(status.landSurfaceLoaded);
  }

  function mount(mountNode, options = {}) {
    const mount = mountNode && mountNode.nodeType === 1 ? mountNode : document.body;

    mount.querySelectorAll("canvas[data-audralia-parent-chain-canvas='true']").forEach((node) => node.remove());
    mount.querySelectorAll("[data-audralia-coordinate-readout='true']").forEach((node) => node.remove());
    mount.querySelectorAll("[data-audralia-version-notice='true']").forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    canvas.dataset.audraliaParentChainCanvas = "true";
    canvas.dataset.audraliaCanvasContract = CONTRACT;
    canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    canvas.dataset.audraliaPreviousCanvasContract = PREVIOUS_CONTRACT;
    canvas.dataset.audraliaLatticeContract = EXPECTED.lattice;
    canvas.dataset.audraliaLandmapContract = EXPECTED.landmap;
    canvas.dataset.audraliaClimateContract = EXPECTED.climate;
    canvas.dataset.audraliaCanvasOwnsFootprint = "false";
    canvas.dataset.audraliaCanvasOwnsClimate = "false";
    canvas.dataset.visibleUpdateNotice = "true";
    canvas.dataset.textureRebuildPerFrame = "false";
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

    const notice = makeNotice();
    mount.appendChild(notice);

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
    readout.style.opacity = "0.42";
    readout.style.transition = "opacity 220ms ease, background 220ms ease";
    readout.textContent = "Audralia visible-notice canvas loading…";
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
      ready: false,
      authorityStatus: {
        latticeLoaded: false,
        landmapLoaded: false,
        climateLoaded: false,
        landSurfaceLoaded: false
      }
    };

    function resize() {
      const rect = mount.getBoundingClientRect();
      const size = Math.max(280, Math.min(700, Math.floor(Math.min(rect.width || 420, rect.height || rect.width || 420))));
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
        `${map.primarySummit} → ${map.internalSummit}`
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
          ...state.authorityStatus,
          canvasOwnsFootprint: false,
          canvasOwnsClimate: false,
          visibleUpdateNotice: true,
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

    ensureAuthorities().then((authorityStatus) => {
      state.authorityStatus = authorityStatus;
      updateNotice(notice, authorityStatus);

      texture = buildTexture(1024, 512);
      state.ready = true;
      updateReadout(sampleMap(0.5, 0.5), false);

      document.documentElement.dataset.audraliaCanvasLoaded = "true";
      document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
      document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
      document.documentElement.dataset.audraliaCanvasPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.audraliaVisibleUpdateNotice = "true";
      document.documentElement.dataset.audraliaLattice256Loaded = String(authorityStatus.latticeLoaded);
      document.documentElement.dataset.audraliaLandmapLoaded = String(authorityStatus.landmapLoaded);
      document.documentElement.dataset.audraliaClimateLoaded = String(authorityStatus.climateLoaded);
      document.documentElement.dataset.audraliaLandSurfaceLoaded = String(authorityStatus.landSurfaceLoaded);
      document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
      document.documentElement.dataset.audraliaCanvasOwnsClimate = "false";
      document.documentElement.dataset.textureRebuildPerFrame = "false";
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
      notice.remove();
    }

    window.__AUDRALIA_CANVAS_DISPOSE__ = dispose;

    return { canvas, controlsBound: true, dispose, getStatus };
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-visible-update-notice-canvas-consumer",
      expected: EXPECTED,
      canvasOwnsFootprint: false,
      canvasOwnsClimate: false,
      coordinateInspection: true,
      visibleUpdateNotice: true,
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
    version: VERSION,
    expected: EXPECTED,
    mount,
    getStatus
  });

  window.AUDRALIA_CANVAS_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaCanvasLoaded = "true";
  document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
  document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
  document.documentElement.dataset.audraliaCanvasPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaCanvasExposesMount = "true";
  document.documentElement.dataset.audraliaVisibleUpdateNotice = "true";
  document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
  document.documentElement.dataset.audraliaCanvasOwnsClimate = "false";
  document.documentElement.dataset.textureRebuildPerFrame = "false";
  document.documentElement.dataset.canvasStillConsumerOnly = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
