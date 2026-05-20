// /assets/audralia/clean/audralia.engine.js
// AUDRALIA_G2_2_FIVE_CONTINENT_SEA_LEVEL_EXPOSURE_ENGINE_TNT_v1
// Full-file replacement.
// Purpose: preserve the successful Audralia route-bridge mount contract while rendering Audralia as an ocean-dominant Five-Continent Nine-Summits planet.
// Continental law: four main exposed continents, one North Polar continent, South Pole ice only.
// Hydration law: terrain pressure may exist below sea level; exposed land appears only above calibrated sea level.
// Owns: visible clean-canvas Audralia planet form handoff.
// Does not own: parent Globe route, route bridge HTML, route bridge JS, global navigation, character page, gauges logic, or downstream child-module split.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_2_FIVE_CONTINENT_SEA_LEVEL_EXPOSURE_ENGINE_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_2_FIVE_CONTINENT_SEA_LEVEL_EXPOSURE_ENGINE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_NINE_SUMMITS_PLANET_FORM_ENGINE_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const VERSION = "2026-05-20.audralia-g2-2-five-continent-sea-level-exposure-engine-v1";

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
    seaLevel: 0.635,
    light: Object.freeze({ x: -0.62, y: -0.48, z: 0.62 }),
    atmosphere: Object.freeze({
      rimStrength: 0.82,
      hazeStrength: 0.22,
      cloudStrength: 0.24
    }),
    continents: Object.freeze([
      Object.freeze({ id: "MAIN_A", kind: "main", u: -0.36, v: -0.04, rx: 0.25, ry: 0.30, angle: -0.42, lift: 0.03 }),
      Object.freeze({ id: "MAIN_B", kind: "main", u: -0.10, v: 0.30, rx: 0.21, ry: 0.23, angle: 0.58, lift: 0.05 }),
      Object.freeze({ id: "MAIN_C", kind: "main", u: 0.26, v: 0.02, rx: 0.24, ry: 0.28, angle: 0.18, lift: 0.02 }),
      Object.freeze({ id: "MAIN_D", kind: "main", u: 0.17, v: -0.38, rx: 0.20, ry: 0.21, angle: -0.76, lift: 0.04 }),
      Object.freeze({ id: "NORTH_POLAR", kind: "north-polar", u: 0.02, v: 0.74, rx: 0.46, ry: 0.22, angle: 0.0, lift: 0.09 })
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
    lastSize: 0
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
        radial-gradient(circle at 50% 34%,rgba(143,240,195,.16),transparent 16rem),
        radial-gradient(circle at 50% 58%,rgba(36,120,255,.12),transparent 24rem),
        radial-gradient(circle at 50% 80%,rgba(243,200,111,.06),transparent 26rem),
        linear-gradient(180deg,rgba(1,7,16,.28),rgba(1,4,12,.76));
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
        drop-shadow(0 0 2.8rem rgba(143,240,195,.22))
        drop-shadow(0 0 1.4rem rgba(141,216,255,.10))
        drop-shadow(0 2rem 2.6rem rgba(0,0,0,.46));
      touch-action:none;
    `;
  }

  function styleLabel(label) {
    label.style.cssText = `
      position:absolute;
      left:50%;
      bottom:7%;
      transform:translateX(-50%);
      width:min(88%,25rem);
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

  function continentInfluence(continent, u, v, roughness) {
    const du = wrapUnitDistance(u, continent.u);
    const dv = v - continent.v;
    const cos = Math.cos(continent.angle);
    const sin = Math.sin(continent.angle);

    const x = du * cos - dv * sin;
    const y = du * sin + dv * cos;

    const rx = continent.rx * (0.88 + roughness * 0.24);
    const ry = continent.ry * (0.88 + roughness * 0.22);
    const d = Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry));

    const ragged = (roughness - 0.5) * 0.22;
    const edge = 1.02 + ragged;

    return clamp01(1 - smoothstep(edge * 0.64, edge, d));
  }

  function continentField(u, v) {
    const roughA = fbm(u + 3.0, v - 1.5, 8.0, 4, 400);
    const roughB = fbm(u - 4.2, v + 2.4, 17.0, 3, 900);
    const roughness = clamp01(roughA * 0.72 + roughB * 0.28);

    let best = {
      id: "OCEAN",
      kind: "ocean",
      strength: 0,
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
      field += Math.pow(alignment, 38) * (1.0 + (i % 3) * 0.10);
    }

    return clamp01(field);
  }

  function classifySurface(nx, ny, nz) {
    const lon = Math.atan2(nx, nz);
    const lat = Math.asin(ny);
    const u = lon / Math.PI;
    const v = lat / (Math.PI / 2);

    const continent = continentField(u, v);

    const broad = fbm(u + 1.72, v + 2.36, 2.2, 5, 100);
    const coast = fbm(u + 4.1, v - 1.7, 6.3, 5, 600);
    const ridgeNoise = fbm(u - 3.5, v + 5.2, 13.5, 4, 1200);
    const grain = fbm(u + 8.0, v - 7.0, 31.0, 3, 1800);

    const terrainCandidate = clamp01(
      continent.strength * 0.86 +
      broad * 0.08 +
      coast * 0.05 +
      ridgeNoise * 0.03
    );

    const summit = summitPressure(nx, ny, nz);
    const ridge = clamp01((ridgeNoise - 0.48) * 1.9);
    const basin = clamp01((0.56 - broad) * 1.18 + (0.40 - coast) * 0.58);
    const northPolarBoost = continent.northPolar ? 0.095 : 0;
    const mainLift = continent.main ? continent.lift || 0 : 0;

    let elevation = clamp01(
      terrainCandidate * 0.72 +
      summit * 0.27 +
      ridge * 0.12 +
      northPolarBoost +
      mainLift -
      basin * 0.22
    );

    const southPole = v < -0.68;
    const southIce = smoothstep(-0.68, -0.95, v) * (0.72 + grain * 0.28);
    const northIce = smoothstep(0.78, 0.96, v) * (0.34 + grain * 0.32);
    const polarIce = clamp01(Math.max(southIce, northIce));

    if (southPole) {
      elevation = Math.min(elevation, PLANET.seaLevel - 0.035);
    }

    const exposedLand =
      !southPole &&
      continent.strength > 0.22 &&
      elevation > PLANET.seaLevel;

    const exposureDistance = elevation - PLANET.seaLevel;
    const nearSeaLevel = Math.abs(exposureDistance);
    const coastalShelf =
      !exposedLand &&
      terrainCandidate > 0.28 &&
      elevation > PLANET.seaLevel - 0.18;

    const submergedShelf =
      !exposedLand &&
      terrainCandidate > 0.40 &&
      elevation <= PLANET.seaLevel;

    const deepOcean =
      !exposedLand &&
      !coastalShelf &&
      !submergedShelf;

    const mountain = exposedLand ? clamp01(summit * 1.28 + smoothstep(0.68, 0.93, elevation) * 0.62) : 0;
    const coastLine = exposedLand ? smoothstep(0.052, 0.0, nearSeaLevel) : 0;

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
      coastalShelf,
      submergedShelf,
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

  function computeCloud(surface, nx, ny, nz) {
    const beltA = 1 - Math.abs(surface.v - 0.16) * 5.2;
    const beltB = 1 - Math.abs(surface.v + 0.30) * 4.6;
    const streak = fbm(surface.u * 1.4 + 2.2, surface.v * 0.82 - 0.5, 9.5, 4, 2600);
    const fine = fbm(surface.u - 8.3, surface.v + 3.8, 22.0, 3, 3200);

    return clamp01(
      Math.max(beltA, beltB) * 0.46 +
      streak * 0.32 +
      fine * 0.13 -
      Math.abs(nx) * 0.08 +
      nz * 0.06
    );
  }

  function drawPlanetPixels(canvas) {
    const rect = canvas.getBoundingClientRect();
    const cssSize = Math.max(300, Math.min(rect.width || 460, 620));
    const dpr = Math.max(1, Math.min(2.0, win().devicePixelRatio || 1));
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

    const oceanDeep = [2, 15, 34, 1];
    const oceanMid = [6, 68, 89, 1];
    const oceanShelf = [29, 139, 137, 1];
    const shallowReef = [83, 188, 166, 1];

    const coastSand = [176, 164, 111, 1];
    const landLow = [82, 128, 82, 1];
    const landMid = [101, 143, 90, 1];
    const highland = [139, 137, 100, 1];
    const summitColor = [218, 213, 176, 1];
    const iceColor = [221, 247, 241, 1];
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

        const z = Math.sqrt(Math.max(0, 1 - rr));
        const nx = dx;
        const ny = -dy;
        const nz = z;

        const surface = classifySurface(nx, ny, nz);
        let color;

        if (surface.exposedLand) {
          const relief = clamp01(surface.elevation * 0.72 + surface.mountain * 0.34);
          const coastBlend = smoothstep(0.02, 0.10, surface.exposureDistance);

          color = mixColor(coastSand, landLow, coastBlend);
          color = mixColor(color, landMid, clamp01(relief * 0.58));
          color = mixColor(color, highland, clamp01(surface.mountain * 0.52));
          color = mixColor(color, summitColor, clamp01(surface.mountain * 0.46 + surface.polarIce * 0.26));

          if (surface.continent.northPolar) {
            color = mixColor(color, iceColor, clamp01(surface.polarIce * 0.42 + 0.10));
          }

          color = mixColor(color, coastSand, clamp01(surface.coastLine * 0.32));
        } else if (surface.coastalShelf || surface.submergedShelf) {
          const shelfLift = clamp01(surface.terrainCandidate * 0.68 + surface.elevation * 0.28);
          color = mixColor(oceanMid, oceanShelf, shelfLift);
          color = mixColor(color, shallowReef, clamp01(surface.coastalShelf ? 0.36 : 0.18));
          color = mixColor(color, coastSand, clamp01((surface.terrainCandidate - 0.48) * 0.18));
        } else {
          const depth = clamp01((0.55 - surface.terrainCandidate) * 2.6 + (PLANET.seaLevel - surface.elevation) * 0.72);
          color = mixColor(oceanShelf, oceanMid, depth);
          color = mixColor(color, oceanDeep, clamp01(depth * 0.84));
        }

        if (surface.southPole) {
          color = mixColor(color, iceColor, clamp01(surface.southIce * 0.62));
        } else if (surface.polarIce > 0.36) {
          color = mixColor(color, iceColor, clamp01((surface.polarIce - 0.22) * 0.42));
        }

        const normal = normalize3({
          x: nx + (surface.ridgeNoise - 0.5) * 0.030,
          y: ny + (surface.grain - 0.5) * 0.024,
          z: nz
        });

        const lightAmount = clamp01(dot3(normal, light) * 0.72 + 0.36);
        const terminator = smoothstep(-0.18, 0.78, dot3(normal, light));
        const limb = Math.pow(clamp01(1 - rr), 0.32);
        const edgeDark = smoothstep(0.98, 0.35, rr);
        const atmosphericLift = Math.pow(clamp01(rr), 3.2) * PLANET.atmosphere.hazeStrength;

        let lit = lightAmount * (0.58 + terminator * 0.56);
        lit *= 0.76 + limb * 0.32;
        lit *= 0.78 + edgeDark * 0.28;

        color = mixColor(nightBlue, color, clamp01(lit));
        color = mixColor(color, [126, 232, 202, 1], atmosphericLift * 0.18);

        const cloud = computeCloud(surface, nx, ny, nz);
        if (cloud > 0.57) {
          const cloudAlpha = clamp01((cloud - 0.57) * 0.42) * PLANET.atmosphere.cloudStrength;
          color = mixColor(color, [235, 248, 235, 1], cloudAlpha);
        }

        const haze = Math.pow(clamp01(rr), 5.7) * 0.18;
        color = mixColor(color, [125, 220, 205, 1], haze);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = Math.round(255 * clamp01(0.985 + haze * 0.05));
      }
    }

    ctx.putImageData(image, 0, 0);

    drawAtmosphericRim(ctx, cx, cy, r, size);
    drawSummitSignals(ctx, cx, cy, r, light);
    drawSubmergedShelfGlints(ctx, cx, cy, r, size);
    drawSubtleOrbitReceipt(ctx, cx, cy, r, size);

    return true;
  }

  function drawAtmosphericRim(ctx, cx, cy, r, size) {
    const rim = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.13);
    rim.addColorStop(0, "rgba(143,240,195,0)");
    rim.addColorStop(0.66, "rgba(143,240,195,0.055)");
    rim.addColorStop(0.88, "rgba(141,216,255,0.17)");
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
    ctx.arc(cx, cy, r * 1.036, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(141,216,255,0.12)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

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
      const s = normalize3({ x: raw[0], y: raw[1], z: raw[2] });

      if (s.z < 0.10) return;

      const lightAmount = clamp01(dot3(s, light) * 0.60 + 0.46);
      const px = cx + s.x * r;
      const py = cy - s.y * r;
      const radius = r * (0.010 + (index % 3) * 0.002);

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,244,216,${0.10 + lightAmount * 0.15})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, radius * 2.8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(243,200,111,${0.055 + lightAmount * 0.075})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawSubmergedShelfGlints(ctx, cx, cy, r, size) {
    ctx.save();
    ctx.translate(cx, cy);

    const rings = [
      { y: -0.28, rot: 0.18, w: 0.78, a: 0.045 },
      { y: 0.06, rot: -0.22, w: 0.88, a: 0.038 },
      { y: 0.32, rot: 0.31, w: 0.68, a: 0.030 }
    ];

    rings.forEach((ring) => {
      ctx.save();
      ctx.rotate(ring.rot);
      ctx.scale(1, 0.22);

      ctx.beginPath();
      ctx.ellipse(0, ring.y * r, r * ring.w, r * 0.16, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(143,240,195,${ring.a})`;
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
    ctx.strokeStyle = "rgba(243,200,111,0.042)";
    ctx.lineWidth = Math.max(1, size * 0.0015);
    ctx.stroke();

    ctx.restore();
  }

  function createRender(context) {
    const documentRef = doc(context);
    if (!documentRef) throw new Error("Document unavailable for Audralia engine render.");

    const root = makeEl(documentRef, "section", "audralia-engine-root", {
      "data-audralia-engine-render": "true",
      "data-audralia-clean-canvas-render": "true",
      "data-audralia-g2-2-five-continent-sea-level-exposure": "true",
      "data-contract": CONTRACT,
      "data-previous-contract": PREVIOUS_CONTRACT
    });

    styleRoot(root);

    const canvas = makeEl(documentRef, "canvas", "audralia-engine-canvas", {
      "data-audralia-form": "g2-2-five-continent-sea-level-engine-canvas",
      "aria-label": "Audralia G2.2 Five-Continent sea-level exposure planet form"
    });

    styleCanvas(canvas);

    const label = makeEl(documentRef, "div", "audralia-engine-label");
    styleLabel(label);
    label.textContent = "Audralia G2.2 · Five-Continent sea-level planet form mounted";

    root.appendChild(canvas);
    root.appendChild(label);

    return { root, canvas, label };
  }

  function requestDraw(canvas) {
    const draw = () => drawPlanetPixels(canvas);

    if (typeof win().requestAnimationFrame === "function") {
      win().requestAnimationFrame(draw);
    } else {
      setTimeout(draw, 0);
    }
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

    if (!mountTarget) {
      throw new Error("Audralia G2.2 engine mount target missing.");
    }

    if (!documentRef) {
      throw new Error("Audralia G2.2 engine document missing.");
    }

    const render = createRender(input);

    mountTarget.replaceChildren(render.root);

    requestDraw(render.canvas);

    state.mounted = true;
    state.mountedAt = now();
    state.mountCount += 1;
    state.lastCanvas = render.canvas;
    state.lastRoot = render.root;
    state.lastMount = mountTarget;

    mountTarget.dataset.audraliaFormVisible = "true";
    mountTarget.dataset.audraliaEngineMounted = "true";
    mountTarget.dataset.audraliaEngineContract = CONTRACT;
    mountTarget.dataset.audraliaG22FiveContinentSeaLevelExposure = "true";

    const statusTarget = input?.statusTarget;
    if (isElement(statusTarget)) {
      statusTarget.textContent = "FORM_VISIBLE · Audralia G2.2 Five-Continent sea-level planet form mounted.";
      statusTarget.dataset.state = "pass";
    }

    state.lastReceipt = buildReceipt(true);

    installResizeRedraw(render.root, render.canvas);

    return {
      element: render.root,
      canvas: render.canvas,
      contract: CONTRACT,
      receipt: state.lastReceipt
    };
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
      planetStandard: "G2.2 Five-Continent sea-level exposure clean-canvas planet form",
      continentCount: PLANET.continentCount,
      mainContinents: PLANET.mainContinents,
      northPolarContinent: PLANET.northPolarContinent,
      southPoleIceOnly: PLANET.southPoleIceOnly,
      terrainPressureBelowSeaLevel: PLANET.terrainPressureBelowSeaLevel,
      seaLevelExposureClassification: PLANET.seaLevelExposureClassification,
      seaLevel: PLANET.seaLevel,
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
