// /assets/audralia/clean/audralia.engine.js
// AUDRALIA_G2_4_AXIS_ROTATION_FINGER_DRAG_NON_BLOB_CONTINENT_ENGINE_TNT_v1
// Full-file replacement.
// Purpose: preserve FORM_VISIBLE while giving Audralia Earth-like axial rotation, finger-drag inspection, and non-blob continent masks.
// Owns: Audralia clean-canvas visible planet form handoff.
// Does not own: parent Globe route, Audralia HTML, Audralia route bridge JS, Characters, Gauges, Showroom, or global navigation.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_4_AXIS_ROTATION_FINGER_DRAG_NON_BLOB_CONTINENT_ENGINE_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_4_AXIS_ROTATION_FINGER_DRAG_NON_BLOB_CONTINENT_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_3_VISIBLE_SEA_LEVEL_DELTA_AND_CONTINENT_MASK_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const VERSION = "2026-05-20.audralia-g2-4-axis-rotation-finger-drag-non-blob-continent-v1";

  const PLANET = Object.freeze({
    seed: 25645161,
    nodeCount: 256,
    sectorCount: 16,
    regionCount: 4,
    summitCount: 9,
    continentCount: 5,
    mainContinents: 4,
    northPolarContinent: true,
    southPoleIceOnly: true,
    terrainPressureBelowSeaLevel: true,
    seaLevelExposureClassification: true,
    seaLevel: 0.735,
    axisTiltDegrees: 23.5,
    autoRotationStep: 0.018,
    autoRotationFrameMs: 120,
    dragRotationScale: 0.0085,
    dragPitchScale: 0.0045,
    maxViewPitch: 0.62,
    exposedLandTarget: "reduced-aggressively",
    submergedShelfMustRenderBlue: true,
    rotationLaw: "earth-like-axis-longitude-reprojection",
    fingerDrag: true,
    light: Object.freeze({ x: -0.64, y: -0.46, z: 0.62 }),
    atmosphere: Object.freeze({ rimStrength: 0.86, hazeStrength: 0.16, cloudStrength: 0.18 }),
    continents: Object.freeze([
      Object.freeze({
        id: "MAIN_A",
        kind: "main",
        u: -0.40,
        v: -0.10,
        rx: 0.26,
        ry: 0.22,
        angle: -0.58,
        lift: 0.030,
        spine: Object.freeze([[-0.95, -0.25], [-0.48, 0.10], [0.02, 0.02], [0.58, 0.32], [0.94, 0.02]])
      }),
      Object.freeze({
        id: "MAIN_B",
        kind: "main",
        u: -0.13,
        v: 0.31,
        rx: 0.23,
        ry: 0.19,
        angle: 0.45,
        lift: 0.034,
        spine: Object.freeze([[-0.88, 0.18], [-0.42, -0.05], [0.06, 0.12], [0.48, -0.18], [0.92, 0.14]])
      }),
      Object.freeze({
        id: "MAIN_C",
        kind: "main",
        u: 0.24,
        v: 0.02,
        rx: 0.27,
        ry: 0.23,
        angle: 0.17,
        lift: 0.026,
        spine: Object.freeze([[-0.92, 0.02], [-0.56, -0.24], [-0.05, -0.04], [0.44, 0.22], [0.94, 0.10]])
      }),
      Object.freeze({
        id: "MAIN_D",
        kind: "main",
        u: 0.18,
        v: -0.40,
        rx: 0.22,
        ry: 0.17,
        angle: -0.72,
        lift: 0.038,
        spine: Object.freeze([[-0.88, -0.12], [-0.42, 0.16], [0.00, -0.10], [0.46, 0.10], [0.86, -0.04]])
      }),
      Object.freeze({
        id: "NORTH_POLAR",
        kind: "north-polar",
        u: 0.02,
        v: 0.77,
        rx: 0.40,
        ry: 0.16,
        angle: 0.02,
        lift: 0.112,
        spine: Object.freeze([[-1.00, 0.00], [-0.50, 0.16], [0.00, -0.04], [0.48, 0.14], [1.00, -0.02]])
      })
    ])
  });

  const state = {
    mounted: false,
    mountedAt: null,
    mountCount: 0,
    lastCanvas: null,
    lastRoot: null,
    lastMount: null,
    lastReceipt: null,
    lastSize: 0,
    lastRatios: null,
    rotationLon: 0,
    viewPitch: 0.10,
    dragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    drawPending: false,
    animationFrame: 0,
    lastAutoFrameAt: 0
  };

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function doc(context) {
    return context?.document || (typeof document !== "undefined" ? document : null);
  }

  function now() {
    return new Date().toISOString();
  }

  function isElement(value) {
    const ElementCtor = win().Element;
    return Boolean(ElementCtor && value instanceof ElementCtor);
  }

  function resolveMount(input) {
    if (isElement(input)) return input;
    if (isElement(input?.mount)) return input.mount;
    if (isElement(input?.mountTarget)) return input.mountTarget;
    if (isElement(input?.target)) return input.target;

    const documentRef = doc(input);

    return (
      documentRef?.getElementById?.("audralia-clean-canvas-mount") ||
      documentRef?.querySelector?.("[data-audralia-clean-canvas-mount]") ||
      null
    );
  }

  function makeEl(documentRef, tag, className, attrs = {}) {
    const el = documentRef.createElement(tag);
    if (className) el.className = className;

    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value));
    }

    return el;
  }

  function styleRoot(root) {
    root.style.cssText = `
      width:100%;
      min-height:27rem;
      display:grid;
      place-items:center;
      position:relative;
      isolation:isolate;
      overflow:hidden;
      border-radius:1.25rem;
      background:
        radial-gradient(circle at 50% 34%,rgba(143,240,195,.14),transparent 16rem),
        radial-gradient(circle at 50% 58%,rgba(36,120,255,.15),transparent 24rem),
        radial-gradient(circle at 50% 80%,rgba(243,200,111,.045),transparent 26rem),
        linear-gradient(180deg,rgba(1,7,16,.30),rgba(1,4,12,.78));
    `;
  }

  function styleCanvas(canvas) {
    canvas.style.cssText = `
      width:min(82vw,31rem);
      height:min(82vw,31rem);
      max-width:100%;
      display:block;
      border-radius:50%;
      filter:
        drop-shadow(0 0 2.9rem rgba(143,240,195,.23))
        drop-shadow(0 0 1.5rem rgba(141,216,255,.13))
        drop-shadow(0 2rem 2.6rem rgba(0,0,0,.48));
      touch-action:none;
      cursor:grab;
      user-select:none;
    `;
  }

  function styleLabel(label) {
    label.style.cssText = `
      position:absolute;
      left:50%;
      bottom:7%;
      transform:translateX(-50%);
      width:min(90%,26rem);
      padding:.78rem .9rem;
      border:1px solid rgba(143,240,195,.28);
      border-radius:1rem;
      background:rgba(1,7,16,.78);
      color:rgba(255,244,216,.94);
      font:850 .72rem/1.35 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      letter-spacing:.075em;
      text-align:center;
      text-transform:uppercase;
      backdrop-filter:blur(8px);
      z-index:5;
      pointer-events:none;
    `;
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.00001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function normalize3(v) {
    const m = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / m, y: v.y / m, z: v.z / m };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function rotateX(v, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
  }

  function rotateY(v, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
  }

  function axisTiltRad() {
    return (PLANET.axisTiltDegrees * Math.PI) / 180;
  }

  function worldNormalFromView(nx, ny, nz) {
    let v = { x: nx, y: ny, z: nz };
    v = rotateX(v, state.viewPitch);
    v = rotateX(v, axisTiltRad());
    v = rotateY(v, state.rotationLon);
    return normalize3(v);
  }

  function hash2(x, y, seed = PLANET.seed) {
    let n = Math.imul(x ^ seed, 374761393) ^ Math.imul(y + seed, 668265263);
    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function valueNoise(x, y, scale, seedOffset = 0) {
    const sx = x * scale;
    const sy = y * scale;
    const x0 = Math.floor(sx);
    const y0 = Math.floor(sy);
    const tx = fade(sx - x0);
    const ty = fade(sy - y0);

    const a = hash2(x0, y0, PLANET.seed + seedOffset);
    const b = hash2(x0 + 1, y0, PLANET.seed + seedOffset);
    const c = hash2(x0, y0 + 1, PLANET.seed + seedOffset);
    const d = hash2(x0 + 1, y0 + 1, PLANET.seed + seedOffset);

    return lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
  }

  function fbm(x, y, baseScale, octaves, seedOffset = 0) {
    let total = 0;
    let amp = 0.5;
    let scale = baseScale;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x, y, scale, seedOffset + i * 997) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= 2.03;
    }

    return total / Math.max(0.0001, norm);
  }

  function wrapUnitDistance(a, b) {
    let d = a - b;
    if (d > 1) d -= 2;
    if (d < -1) d += 2;
    return d;
  }

  function mixColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
      lerp(a[3], b[3], t)
    ];
  }

  function distanceToSegment(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const wx = px - ax;
    const wy = py - ay;
    const len2 = vx * vx + vy * vy || 1;
    const t = clamp01((wx * vx + wy * vy) / len2);
    const qx = ax + vx * t;
    const qy = ay + vy * t;
    return { distance: Math.hypot(px - qx, py - qy), t };
  }

  function spineField(localX, localY, spine) {
    let best = 0;

    for (let i = 0; i < spine.length - 1; i += 1) {
      const a = spine[i];
      const b = spine[i + 1];
      const d = distanceToSegment(localX, localY, a[0], a[1], b[0], b[1]);
      const segmentWidth = 0.34 + 0.12 * Math.sin((i + 1) * 1.7);
      const core = 1 - smoothstep(segmentWidth * 0.38, segmentWidth, d.distance);
      const taper = smoothstep(-0.10, 0.18, d.t) * (1 - smoothstep(0.82, 1.12, d.t));
      best = Math.max(best, core * (0.72 + taper * 0.28));
    }

    return clamp01(best);
  }

  function continentInfluence(continent, u, v, roughness) {
    const du = wrapUnitDistance(u, continent.u);
    const dv = v - continent.v;
    const cos = Math.cos(continent.angle);
    const sin = Math.sin(continent.angle);

    const x = (du * cos - dv * sin) / continent.rx;
    const y = (du * sin + dv * cos) / continent.ry;

    const spine = spineField(x, y, continent.spine);
    const lobeA = Math.max(0, 1 - Math.hypot(x + 0.36, y - 0.10) / (0.55 + roughness * 0.18));
    const lobeB = Math.max(0, 1 - Math.hypot(x - 0.30, y + 0.06) / (0.48 + roughness * 0.16));
    const lobeC = Math.max(0, 1 - Math.hypot(x - 0.02, y - 0.28) / (0.42 + roughness * 0.14));
    const bayNoise = fbm(u * 1.7 + continent.rx * 11, v * 1.3 - continent.ry * 9, 19.0, 3, 4300);
    const inletNoise = fbm(u - continent.rx * 7, v + continent.ry * 8, 31.0, 2, 5100);

    const ridged = spine * 0.82 + lobeA * 0.26 + lobeB * 0.24 + lobeC * 0.18;
    const bayCuts = smoothstep(0.58, 0.88, bayNoise) * 0.22 + smoothstep(0.64, 0.92, inletNoise) * 0.16;
    const field = ridged + (roughness - 0.5) * 0.15 - bayCuts;

    return clamp01(smoothstep(0.18, 0.74, field));
  }

  function continentField(u, v) {
    const roughA = fbm(u + 3.0, v - 1.5, 8.0, 4, 400);
    const roughB = fbm(u - 4.2, v + 2.4, 18.0, 3, 900);
    const roughness = clamp01(roughA * 0.70 + roughB * 0.30);

    let best = {
      id: "OCEAN",
      kind: "ocean",
      strength: 0,
      lift: 0,
      main: false,
      northPolar: false
    };

    for (const continent of PLANET.continents) {
      const influence = continentInfluence(continent, u, v, roughness);

      if (influence > best.strength) {
        best = {
          id: continent.id,
          kind: continent.kind,
          strength: influence,
          lift: continent.lift,
          main: continent.kind === "main",
          northPolar: continent.kind === "north-polar"
        };
      }
    }

    return best;
  }

  function summitPressure(nx, ny, nz) {
    const summitSeeds = [
      [-0.52, -0.35, 0.72],
      [-0.25, -0.54, 0.76],
      [0.08, -0.45, 0.84],
      [0.38, -0.24, 0.80],
      [0.55, 0.02, 0.72],
      [0.34, 0.34, 0.74],
      [0.02, 0.50, 0.80],
      [-0.34, 0.30, 0.78],
      [-0.58, 0.02, 0.70]
    ];

    let field = 0;

    for (let i = 0; i < summitSeeds.length; i += 1) {
      const s = normalize3({ x: summitSeeds[i][0], y: summitSeeds[i][1], z: summitSeeds[i][2] });
      const alignment = Math.max(0, nx * s.x + ny * s.y + nz * s.z);
      field += Math.pow(alignment, 42) * (0.92 + (i % 3) * 0.10);
    }

    return clamp01(field);
  }

  function classifySurface(nx, ny, nz) {
    const lon = Math.atan2(nx, nz);
    const lat = Math.asin(ny);
    const u = lon / Math.PI;
    const v = lat / (Math.PI / 2);

    const continent = continentField(u, v);

    const broad = fbm(u + 1.72, v + 2.36, 2.25, 5, 100);
    const coast = fbm(u + 4.1, v - 1.7, 7.0, 5, 600);
    const ridgeNoise = fbm(u - 3.5, v + 5.2, 14.5, 4, 1200);
    const grain = fbm(u + 8.0, v - 7.0, 34.0, 3, 1800);

    const terrainCandidate = clamp01(
      continent.strength * 0.88 +
      broad * 0.055 +
      coast * 0.045 +
      ridgeNoise * 0.025
    );

    const summit = summitPressure(nx, ny, nz);
    const ridge = clamp01((ridgeNoise - 0.49) * 1.85);
    const basin = clamp01((0.57 - broad) * 1.22 + (0.42 - coast) * 0.64);

    const northPolarBoost = continent.northPolar ? 0.115 : 0;
    const mainLift = continent.main ? continent.lift || 0 : 0;

    let elevation = clamp01(
      terrainCandidate * 0.66 +
      summit * 0.24 +
      ridge * 0.105 +
      northPolarBoost +
      mainLift -
      basin * 0.255
    );

    const southPole = v < -0.68;
    const southIce = smoothstep(-0.68, -0.95, v) * (0.76 + grain * 0.24);
    const northIce = smoothstep(0.79, 0.96, v) * (0.30 + grain * 0.30);
    const polarIce = clamp01(Math.max(southIce, northIce));

    if (southPole) {
      elevation = Math.min(elevation, PLANET.seaLevel - 0.065);
    }

    const exposedLand =
      !southPole &&
      continent.strength > 0.36 &&
      terrainCandidate > 0.44 &&
      elevation > PLANET.seaLevel;

    const exposureDistance = elevation - PLANET.seaLevel;

    const nearSeaShelf =
      !exposedLand &&
      terrainCandidate > 0.33 &&
      elevation > PLANET.seaLevel - 0.16;

    const drownedContinent =
      !exposedLand &&
      terrainCandidate > 0.47 &&
      elevation <= PLANET.seaLevel;

    const deepOcean =
      !exposedLand &&
      !nearSeaShelf &&
      !drownedContinent;

    const mountain = exposedLand
      ? clamp01(summit * 1.35 + smoothstep(0.76, 0.96, elevation) * 0.64)
      : 0;

    const coastLine = exposedLand ? smoothstep(0.060, 0.0, Math.abs(exposureDistance)) : 0;

    return {
      lon,
      lat,
      u,
      v,
      continent,
      broad,
      coast,
      ridgeNoise,
      grain,
      terrainCandidate,
      elevation,
      exposureDistance,
      exposedLand,
      nearSeaShelf,
      drownedContinent,
      deepOcean,
      summit,
      mountain,
      basin,
      ridge,
      polarIce,
      southPole,
      southIce,
      northIce,
      coastLine
    };
  }

  function computeCloud(surface, nx, nz) {
    const beltA = 1 - Math.abs(surface.v - 0.16) * 5.5;
    const beltB = 1 - Math.abs(surface.v + 0.30) * 4.8;
    const streak = fbm(surface.u * 1.4 + 2.2, surface.v * 0.82 - 0.5, 10.0, 4, 2600);
    const fine = fbm(surface.u - 8.3, surface.v + 3.8, 24.0, 3, 3200);

    return clamp01(
      Math.max(beltA, beltB) * 0.34 +
      streak * 0.27 +
      fine * 0.09 -
      Math.abs(nx) * 0.06 +
      nz * 0.06
    );
  }

  function drawPlanetPixels(canvas) {
    const rect = canvas.getBoundingClientRect();
    const cssSize = Math.max(300, Math.min(rect.width || 460, 560));
    const dpr = Math.max(1, Math.min(1.35, win().devicePixelRatio || 1));
    const size = Math.round(cssSize * dpr);

    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
      state.lastSize = size;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return false;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.432;
    const light = normalize3(PLANET.light);

    const image = ctx.createImageData(size, size);
    const data = image.data;

    const stats = { total: 0, exposedLand: 0, shelf: 0, drownedContinent: 0, deepOcean: 0, ice: 0 };

    const oceanDeep = [1, 13, 32, 1];
    const oceanMid = [5, 59, 91, 1];
    const oceanShelf = [21, 122, 145, 1];
    const drownedBlue = [18, 104, 128, 1];
    const shallowReef = [62, 174, 166, 1];
    const coastSand = [170, 154, 104, 1];
    const landLow = [78, 125, 80, 1];
    const landMid = [96, 139, 88, 1];
    const highland = [133, 132, 98, 1];
    const summitColor = [218, 213, 176, 1];
    const iceColor = [224, 248, 243, 1];
    const nightBlue = [1, 7, 17, 1];

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = (x + 0.5 - cx) / r;
        const dy = (y + 0.5 - cy) / r;
        const rr = dx * dx + dy * dy;
        const idx = (y * size + x) * 4;

        if (rr > 1) {
          data[idx + 3] = 0;
          continue;
        }

        stats.total += 1;

        const z = Math.sqrt(Math.max(0, 1 - rr));
        const viewNormal = { x: dx, y: -dy, z };
        const worldNormal = worldNormalFromView(viewNormal.x, viewNormal.y, viewNormal.z);
        const nx = worldNormal.x;
        const ny = worldNormal.y;
        const nz = worldNormal.z;

        const surface = classifySurface(nx, ny, nz);
        let color;

        if (surface.exposedLand) {
          stats.exposedLand += 1;

          const relief = clamp01(surface.elevation * 0.68 + surface.mountain * 0.36);
          const coastBlend = smoothstep(0.022, 0.115, surface.exposureDistance);

          color = mixColor(coastSand, landLow, coastBlend);
          color = mixColor(color, landMid, clamp01(relief * 0.56));
          color = mixColor(color, highland, clamp01(surface.mountain * 0.50));
          color = mixColor(color, summitColor, clamp01(surface.mountain * 0.42 + surface.polarIce * 0.22));

          if (surface.continent.northPolar) {
            color = mixColor(color, iceColor, clamp01(surface.polarIce * 0.48 + 0.12));
          }

          color = mixColor(color, coastSand, clamp01(surface.coastLine * 0.38));
        } else if (surface.drownedContinent) {
          stats.drownedContinent += 1;

          const underwaterRelief = clamp01(surface.terrainCandidate * 0.55 + surface.elevation * 0.28);
          color = mixColor(oceanMid, drownedBlue, underwaterRelief);
          color = mixColor(color, oceanShelf, clamp01(underwaterRelief * 0.42));
          color = mixColor(color, shallowReef, clamp01((surface.elevation - (PLANET.seaLevel - 0.10)) * 1.7));
        } else if (surface.nearSeaShelf) {
          stats.shelf += 1;

          const shelfLift = clamp01(surface.terrainCandidate * 0.55 + surface.elevation * 0.22);
          color = mixColor(oceanMid, oceanShelf, shelfLift);
          color = mixColor(color, shallowReef, clamp01(shelfLift * 0.24));
        } else {
          stats.deepOcean += 1;

          const depth = clamp01((0.56 - surface.terrainCandidate) * 2.8 + (PLANET.seaLevel - surface.elevation) * 0.74);
          color = mixColor(oceanShelf, oceanMid, depth);
          color = mixColor(color, oceanDeep, clamp01(depth * 0.88));
        }

        if (surface.southPole) {
          stats.ice += 1;
          color = mixColor(color, iceColor, clamp01(surface.southIce * 0.72));
        } else if (surface.polarIce > 0.40) {
          stats.ice += 1;
          color = mixColor(color, iceColor, clamp01((surface.polarIce - 0.22) * 0.42));
        }

        const perturbedWorldNormal = normalize3({
          x: nx + (surface.ridgeNoise - 0.5) * 0.028,
          y: ny + (surface.grain - 0.5) * 0.022,
          z: nz
        });

        const lightAmount = clamp01(dot3(perturbedWorldNormal, light) * 0.72 + 0.36);
        const terminator = smoothstep(-0.18, 0.78, dot3(perturbedWorldNormal, light));
        const limb = Math.pow(clamp01(1 - rr), 0.32);
        const edgeDark = smoothstep(0.98, 0.35, rr);
        const atmosphericLift = Math.pow(clamp01(rr), 3.4) * PLANET.atmosphere.hazeStrength;

        let lit = lightAmount * (0.58 + terminator * 0.56);
        lit *= 0.76 + limb * 0.32;
        lit *= 0.78 + edgeDark * 0.28;

        color = mixColor(nightBlue, color, clamp01(lit));
        color = mixColor(color, [126, 232, 202, 1], atmosphericLift * 0.16);

        const cloud = computeCloud(surface, viewNormal.x, viewNormal.z);
        if (cloud > 0.64) {
          const cloudAlpha = clamp01((cloud - 0.64) * 0.30) * PLANET.atmosphere.cloudStrength;
          color = mixColor(color, [235, 248, 235, 1], cloudAlpha);
        }

        const haze = Math.pow(clamp01(rr), 5.8) * 0.16;
        color = mixColor(color, [125, 220, 205, 1], haze);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = Math.round(255 * clamp01(0.985 + haze * 0.04));
      }
    }

    state.lastRatios = Object.freeze({
      total: stats.total,
      exposedLandRatio: stats.total ? Number((stats.exposedLand / stats.total).toFixed(4)) : 0,
      shelfRatio: stats.total ? Number((stats.shelf / stats.total).toFixed(4)) : 0,
      drownedContinentRatio: stats.total ? Number((stats.drownedContinent / stats.total).toFixed(4)) : 0,
      deepOceanRatio: stats.total ? Number((stats.deepOcean / stats.total).toFixed(4)) : 0,
      iceRatio: stats.total ? Number((stats.ice / stats.total).toFixed(4)) : 0
    });

    ctx.putImageData(image, 0, 0);

    drawAtmosphericRim(ctx, cx, cy, r, size);
    drawAxisOverlay(ctx, cx, cy, r, size);
    drawSummitSignals(ctx, cx, cy, r, light);
    drawSubmergedShelfGlints(ctx, cx, cy, r, size);
    drawSubtleOrbitReceipt(ctx, cx, cy, r, size);

    return true;
  }

  function drawAtmosphericRim(ctx, cx, cy, r, size) {
    const rim = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.13);
    rim.addColorStop(0, "rgba(143,240,195,0)");
    rim.addColorStop(0.66, "rgba(143,240,195,0.052)");
    rim.addColorStop(0.88, "rgba(141,216,255,0.18)");
    rim.addColorStop(1, "rgba(143,240,195,0)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.13, 0, Math.PI * 2);
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.004, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(208,255,236,0.22)";
    ctx.lineWidth = Math.max(1, size * 0.0032);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.038, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(141,216,255,0.12)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function drawAxisOverlay(ctx, cx, cy, r, size) {
    const tilt = -axisTiltRad() + state.viewPitch * 0.30;
    const length = r * 1.18;
    const dx = Math.sin(tilt) * length;
    const dy = Math.cos(tilt) * length;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - dx, cy + dy);
    ctx.lineTo(cx + dx, cy - dy);
    ctx.strokeStyle = "rgba(208,255,236,0.105)";
    ctx.lineWidth = Math.max(1, size * 0.0017);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + dx, cy - dy, r * 0.017, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(224,248,243,0.16)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx - dx, cy + dy, r * 0.013, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(141,216,255,0.10)";
    ctx.fill();
    ctx.restore();
  }

  function drawSummitSignals(ctx, cx, cy, r, light) {
    const summitPoints = [
      [-0.52, -0.35, 0.72],
      [-0.25, -0.54, 0.76],
      [0.08, -0.45, 0.84],
      [0.38, -0.24, 0.80],
      [0.55, 0.02, 0.72],
      [0.34, 0.34, 0.74],
      [0.02, 0.50, 0.80],
      [-0.34, 0.30, 0.78],
      [-0.58, 0.02, 0.70]
    ];

    ctx.save();

    summitPoints.forEach((raw, index) => {
      let s = normalize3({ x: raw[0], y: raw[1], z: raw[2] });
      s = rotateY(s, -state.rotationLon);
      s = rotateX(s, -axisTiltRad());
      s = rotateX(s, -state.viewPitch);

      if (s.z < 0.10) return;

      const lightAmount = clamp01(dot3(normalize3({ x: raw[0], y: raw[1], z: raw[2] }), light) * 0.60 + 0.46);
      const px = cx + s.x * r;
      const py = cy - s.y * r;
      const radius = r * (0.009 + (index % 3) * 0.002);

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,244,216,${0.10 + lightAmount * 0.14})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, radius * 2.8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(243,200,111,${0.055 + lightAmount * 0.070})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawSubmergedShelfGlints(ctx, cx, cy, r, size) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-state.rotationLon * 0.18);

    const rings = [
      { y: -0.28, rot: 0.18, w: 0.80, a: 0.060 },
      { y: 0.05, rot: -0.22, w: 0.88, a: 0.050 },
      { y: 0.32, rot: 0.31, w: 0.70, a: 0.040 }
    ];

    rings.forEach((ring) => {
      ctx.save();
      ctx.rotate(ring.rot);
      ctx.scale(1, 0.22);

      ctx.beginPath();
      ctx.ellipse(0, ring.y * r, r * ring.w, r * 0.16, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(83,188,166,${ring.a})`;
      ctx.lineWidth = Math.max(1, size * 0.0014);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  function drawSubtleOrbitReceipt(ctx, cx, cy, r, size) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.18);

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.30, r * 0.36, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(143,240,195,0.070)";
    ctx.lineWidth = Math.max(1, size * 0.002);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.18, r * 0.29, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(243,200,111,0.040)";
    ctx.lineWidth = Math.max(1, size * 0.0015);
    ctx.stroke();

    ctx.restore();
  }

  function createRender(context) {
    const documentRef = doc(context);
    if (!documentRef) throw new Error("Document unavailable for Audralia G2.4 engine render.");

    const root = makeEl(documentRef, "section", "audralia-engine-root", {
      "data-audralia-engine-render": "true",
      "data-audralia-clean-canvas-render": "true",
      "data-audralia-g2-4-axis-rotation-finger-drag": "true",
      "data-contract": CONTRACT,
      "data-previous-contract": PREVIOUS_CONTRACT
    });

    styleRoot(root);

    const canvas = makeEl(documentRef, "canvas", "audralia-engine-canvas", {
      "data-audralia-form": "g2-4-axis-rotation-finger-drag-engine-canvas",
      "aria-label": "Audralia G2.4 axis-tilted rotatable planet form. Drag to rotate."
    });

    styleCanvas(canvas);

    const label = makeEl(documentRef, "div", "audralia-engine-label");
    styleLabel(label);
    label.textContent = "Audralia G2.4 · axis rotation · drag to inspect";

    root.appendChild(canvas);
    root.appendChild(label);

    return { root, canvas, label };
  }

  function requestDraw(canvas, immediate = false) {
    if (!canvas) return;

    if (immediate) {
      state.drawPending = false;
      drawPlanetPixels(canvas);
      return;
    }

    if (state.drawPending) return;

    state.drawPending = true;

    const draw = () => {
      state.drawPending = false;
      drawPlanetPixels(canvas);
    };

    if (typeof win().requestAnimationFrame === "function") {
      win().requestAnimationFrame(draw);
    } else {
      setTimeout(draw, 0);
    }
  }

  function startAutoRotation(canvas) {
    if (state.animationFrame && typeof win().cancelAnimationFrame === "function") {
      win().cancelAnimationFrame(state.animationFrame);
    }

    const loop = (timestamp) => {
      const time = Number(timestamp || Date.now());

      if (!state.dragging && time - state.lastAutoFrameAt >= PLANET.autoRotationFrameMs) {
        state.rotationLon = (state.rotationLon + PLANET.autoRotationStep) % (Math.PI * 2);
        state.lastAutoFrameAt = time;
        requestDraw(canvas);
      }

      if (typeof win().requestAnimationFrame === "function") {
        state.animationFrame = win().requestAnimationFrame(loop);
      } else {
        state.animationFrame = setTimeout(() => loop(Date.now()), PLANET.autoRotationFrameMs);
      }
    };

    loop(Date.now());
  }

  function installFingerDrag(canvas) {
    if (!canvas || canvas.dataset.audraliaFingerDragBound === "true") return;
    canvas.dataset.audraliaFingerDragBound = "true";

    const onDown = (event) => {
      state.dragging = true;
      state.lastPointerX = Number(event.clientX || 0);
      state.lastPointerY = Number(event.clientY || 0);
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault?.();
    };

    const onMove = (event) => {
      if (!state.dragging) return;

      const x = Number(event.clientX || 0);
      const y = Number(event.clientY || 0);
      const dx = x - state.lastPointerX;
      const dy = y - state.lastPointerY;

      state.lastPointerX = x;
      state.lastPointerY = y;

      state.rotationLon = (state.rotationLon + dx * PLANET.dragRotationScale) % (Math.PI * 2);
      state.viewPitch = clamp(state.viewPitch + dy * PLANET.dragPitchScale, -PLANET.maxViewPitch, PLANET.maxViewPitch);

      requestDraw(canvas, true);
      event.preventDefault?.();
    };

    const onUp = (event) => {
      state.dragging = false;
      canvas.style.cursor = "grab";
      canvas.releasePointerCapture?.(event.pointerId);
      event.preventDefault?.();
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp, { passive: false });
    canvas.addEventListener("pointercancel", onUp, { passive: false });
    canvas.addEventListener("lostpointercapture", () => {
      state.dragging = false;
      canvas.style.cursor = "grab";
    });
  }

  function installResizeRedraw(root, canvas) {
    if (!root || !canvas) return;

    if (typeof win().ResizeObserver === "function") {
      const observer = new (win().ResizeObserver)(() => requestDraw(canvas));
      observer.observe(root);
      return;
    }

    win().addEventListener?.("resize", () => requestDraw(canvas), { passive: true });
  }

  function mount(input) {
    const mountTarget = resolveMount(input);
    const documentRef = doc(input);

    if (!mountTarget) throw new Error("Audralia G2.4 engine mount target missing.");
    if (!documentRef) throw new Error("Audralia G2.4 engine document missing.");

    const render = createRender(input);

    mountTarget.replaceChildren(render.root);

    requestDraw(render.canvas, true);
    installFingerDrag(render.canvas);
    installResizeRedraw(render.root, render.canvas);
    startAutoRotation(render.canvas);

    state.mounted = true;
    state.mountedAt = now();
    state.mountCount += 1;
    state.lastCanvas = render.canvas;
    state.lastRoot = render.root;
    state.lastMount = mountTarget;

    mountTarget.dataset.audraliaFormVisible = "true";
    mountTarget.dataset.audraliaEngineMounted = "true";
    mountTarget.dataset.audraliaEngineContract = CONTRACT;
    mountTarget.dataset.audraliaG24AxisRotationFingerDrag = "true";

    const statusTarget = input?.statusTarget;
    if (isElement(statusTarget)) {
      statusTarget.textContent = "FORM_VISIBLE · Audralia G2.4 axis-tilted drag-rotatable planet form mounted.";
      statusTarget.dataset.state = "pass";
    }

    state.lastReceipt = buildReceipt(true);

    return { element: render.root, canvas: render.canvas, contract: CONTRACT, receipt: state.lastReceipt };
  }

  function buildReceipt(valid) {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      valid,
      mounted: state.mounted,
      mountedAt: state.mountedAt,
      mountCount: state.mountCount,
      planetStandard: "G2.4 Earth-like axis rotation, finger drag, non-blob continent clean-canvas planet form",
      continentCount: PLANET.continentCount,
      mainContinents: PLANET.mainContinents,
      northPolarContinent: PLANET.northPolarContinent,
      southPoleIceOnly: PLANET.southPoleIceOnly,
      terrainPressureBelowSeaLevel: PLANET.terrainPressureBelowSeaLevel,
      seaLevelExposureClassification: PLANET.seaLevelExposureClassification,
      seaLevel: PLANET.seaLevel,
      axisTiltDegrees: PLANET.axisTiltDegrees,
      rotationLaw: PLANET.rotationLaw,
      fingerDrag: PLANET.fingerDrag,
      ratios: state.lastRatios,
      nodeCount: PLANET.nodeCount,
      sectorCount: PLANET.sectorCount,
      regionCount: PLANET.regionCount,
      summitCount: PLANET.summitCount,
      ownsVisibleFormHandoff: true,
      ownsParentGlobeRoute: false,
      ownsRouteBridgeHtml: false,
      ownsRouteBridgeJs: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      mounted: state.mounted,
      mountedAt: state.mountedAt,
      mountCount: state.mountCount,
      lastReceipt: state.lastReceipt,
      lastSize: state.lastSize,
      ratios: state.lastRatios,
      rotationLon: state.rotationLon,
      viewPitch: state.viewPitch,
      axisTiltDegrees: PLANET.axisTiltDegrees,
      planet: PLANET,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const AUDRALIA_ENGINE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    planet: PLANET,
    mount,
    render: mount,
    start: mount,
    boot: mount,
    init: mount,
    create: mount,
    getStatus
  });

  const global = win();

  global.AUDRALIA_ENGINE = AUDRALIA_ENGINE;
  global.AUDRALIA_CLEAN_CANVAS_ENGINE = AUDRALIA_ENGINE;
  global.AUDRALIA_CLEAN_CANVAS_AUTHORITY = AUDRALIA_ENGINE;
  global.AudraliaCleanCanvasEngine = AUDRALIA_ENGINE;
  global.audraliaCleanCanvasEngine = AUDRALIA_ENGINE;
  global.mountAudraliaCleanCanvas = mount;
  global.renderAudraliaCleanCanvas = mount;
  global.mountAudralia = mount;
  global.renderAudralia = mount;
})();
