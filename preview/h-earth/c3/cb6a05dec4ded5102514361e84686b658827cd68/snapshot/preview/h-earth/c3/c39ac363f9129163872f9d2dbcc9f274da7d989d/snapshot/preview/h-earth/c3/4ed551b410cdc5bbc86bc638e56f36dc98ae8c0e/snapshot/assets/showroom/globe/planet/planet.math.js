// /assets/showroom/globe/planet/planet.math.js
// AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1
// Full-file replacement.
// File 2 of 16.
// Universal planet-family math authority.
// Purpose:
// - Provides reusable computation for Showroom Globe planet-family builds.
// - Owns projection helpers, spherical math, deterministic noise, ratio helpers, coordinate wrapping, vector helpers, interpolation, and numerical guards.
// - Supports the Fibonacci / 16-file / 256-nodal construct without owning lattice authority.
// - Supports Audralia as the first specific planet instance without becoming Audralia-specific.
// - Does not render.
// - Does not mount.
// - Does not draw.
// - Does not own manifest law, lattice addresses, palette constants, land, water, weather, surface, motion state, controls, canvas, route, or HTML.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MANIFEST_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-planet-family-math-v1";

  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;
  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;
  const EPSILON = 0.000001;

  const FIBONACCI_BUILD = Object.freeze([
    1,
    1,
    2,
    3,
    5,
    8,
    13,
    21
  ]);

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const number = finite(value, min);
    const lower = finite(min, 0);
    const upper = finite(max, 1);
    return Math.max(lower, Math.min(upper, number));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return finite(a, 0) + (finite(b, 0) - finite(a, 0)) * clamp01(t);
  }

  function inverseLerp(a, b, value) {
    const start = finite(a, 0);
    const end = finite(b, 1);
    return clamp01((finite(value, start) - start) / Math.max(EPSILON, end - start));
  }

  function remap(value, inMin, inMax, outMin, outMax) {
    return lerp(outMin, outMax, inverseLerp(inMin, inMax, value));
  }

  function smoothstep(edge0, edge1, value) {
    const t = inverseLerp(edge0, edge1, value);
    return t * t * (3 - 2 * t);
  }

  function smootherstep(edge0, edge1, value) {
    const t = inverseLerp(edge0, edge1, value);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function sharpen(value, strength = 1.25, pivot = 0.5) {
    const x = clamp01(value);
    return clamp01((x - finite(pivot, 0.5)) * finite(strength, 1.25) + finite(pivot, 0.5));
  }

  function soften(value, strength = 0.72) {
    const x = clamp01(value);
    return clamp01(lerp(x, smoothstep(0, 1, x), clamp01(strength)));
  }

  function wrap01(value) {
    const number = finite(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function wrapRange(value, size) {
    const span = Math.max(EPSILON, finite(size, 1));
    return ((finite(value, 0) % span) + span) % span;
  }

  function wrapRadians(value) {
    let out = finite(value, 0);
    while (out < -Math.PI) out += TAU;
    while (out > Math.PI) out -= TAU;
    return out;
  }

  function wrapDegrees(value) {
    let out = finite(value, 0);
    while (out < -180) out += 360;
    while (out > 180) out -= 360;
    return out;
  }

  function degreesToRadians(value) {
    return finite(value, 0) * Math.PI / 180;
  }

  function radiansToDegrees(value) {
    return finite(value, 0) * 180 / Math.PI;
  }

  function longitudeDeltaDegrees(lon, centerLon) {
    return wrapDegrees(finite(lon, 0) - finite(centerLon, 0));
  }

  function longitudeDeltaRadians(lon, centerLon) {
    return wrapRadians(finite(lon, 0) - finite(centerLon, 0));
  }

  function uvToLonLat(uInput, vInput) {
    const u = wrap01(uInput);
    const v = clamp01(vInput);

    return Object.freeze({
      u,
      v,
      longitudeDegrees: u * 360 - 180,
      latitudeDegrees: 90 - v * 180,
      longitudeRadians: u * TAU - Math.PI,
      latitudeRadians: HALF_PI - v * Math.PI
    });
  }

  function lonLatToUV(longitudeDegrees, latitudeDegrees) {
    const lon = wrapDegrees(longitudeDegrees);
    const lat = clamp(latitudeDegrees, -90, 90);

    return Object.freeze({
      u: wrap01((lon + 180) / 360),
      v: clamp01((90 - lat) / 180),
      longitudeDegrees: lon,
      latitudeDegrees: lat,
      longitudeRadians: degreesToRadians(lon),
      latitudeRadians: degreesToRadians(lat)
    });
  }

  function sphericalToCartesian(longitudeRadians, latitudeRadians, radius = 1) {
    const lon = finite(longitudeRadians, 0);
    const lat = clamp(latitudeRadians, -HALF_PI, HALF_PI);
    const r = finite(radius, 1);
    const cosLat = Math.cos(lat);

    return Object.freeze({
      x: r * cosLat * Math.cos(lon),
      y: r * Math.sin(lat),
      z: r * cosLat * Math.sin(lon)
    });
  }

  function cartesianToSpherical(xInput, yInput, zInput) {
    const x = finite(xInput, 0);
    const y = finite(yInput, 0);
    const z = finite(zInput, 1);
    const radius = Math.max(EPSILON, Math.hypot(x, y, z));
    const longitudeRadians = Math.atan2(z, x);
    const latitudeRadians = Math.asin(clamp(y / radius, -1, 1));

    return Object.freeze({
      radius,
      longitudeRadians,
      latitudeRadians,
      longitudeDegrees: radiansToDegrees(longitudeRadians),
      latitudeDegrees: radiansToDegrees(latitudeRadians),
      u: wrap01((longitudeRadians + Math.PI) / TAU),
      v: clamp01(0.5 - latitudeRadians / Math.PI)
    });
  }

  function projectSpherePoint(nxInput, nyInput, rotationRadians = 0, tiltRadians = 0) {
    const nx = finite(nxInput, 0);
    const ny = finite(nyInput, 0);
    const rr = nx * nx + ny * ny;

    if (rr > 1) {
      return Object.freeze({
        visible: false,
        nx,
        ny,
        rr,
        z: 0,
        u: 0,
        v: 0,
        longitudeRadians: 0,
        latitudeRadians: 0,
        longitudeDegrees: 0,
        latitudeDegrees: 0,
        normal: Object.freeze({ x: 0, y: 0, z: 0 })
      });
    }

    const z = Math.sqrt(Math.max(0, 1 - rr));
    const tilt = finite(tiltRadians, 0);
    const rotation = finite(rotationRadians, 0);
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);

    let sx = nx;
    let sy = -ny * cosTilt - z * sinTilt;
    let sz = -ny * sinTilt + z * cosTilt;

    const longitudeRadians = wrapRadians(Math.atan2(sx, sz) + rotation);
    const latitudeRadians = Math.asin(clamp(sy, -1, 1));

    return Object.freeze({
      visible: true,
      nx,
      ny,
      rr,
      z,
      u: wrap01((longitudeRadians + Math.PI) / TAU),
      v: clamp01(0.5 - latitudeRadians / Math.PI),
      longitudeRadians,
      latitudeRadians,
      longitudeDegrees: radiansToDegrees(longitudeRadians),
      latitudeDegrees: radiansToDegrees(latitudeRadians),
      normal: Object.freeze({
        x: sx,
        y: sy,
        z: sz
      })
    });
  }

  function rotate2D(xInput, yInput, angleRadians) {
    const x = finite(xInput, 0);
    const y = finite(yInput, 0);
    const angle = finite(angleRadians, 0);
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return Object.freeze({
      x: x * c - y * s,
      y: x * s + y * c
    });
  }

  function rotatedEllipseScore(xInput, yInput, centerX, centerY, radiusX, radiusY, angleRadians = 0, weight = 1) {
    const dx = finite(xInput, 0) - finite(centerX, 0);
    const dy = finite(yInput, 0) - finite(centerY, 0);
    const rotated = rotate2D(dx, dy, -finite(angleRadians, 0));
    const rx = Math.max(EPSILON, finite(radiusX, 1));
    const ry = Math.max(EPSILON, finite(radiusY, 1));
    const q = (rotated.x * rotated.x) / (rx * rx) + (rotated.y * rotated.y) / (ry * ry);

    return finite(weight, 1) * (1 - q);
  }

  function rotatedLonLatEllipseScore(longitudeDegrees, latitudeDegrees, item) {
    const dx = longitudeDeltaDegrees(longitudeDegrees, item?.longitudeDegrees ?? item?.lon ?? 0);
    const dy = finite(latitudeDegrees, 0) - finite(item?.latitudeDegrees ?? item?.lat ?? 0);
    const angle = degreesToRadians(item?.tiltDegrees ?? item?.tilt ?? 0);
    return rotatedEllipseScore(
      dx,
      dy,
      0,
      0,
      item?.radiusLongitudeDegrees ?? item?.rx ?? 1,
      item?.radiusLatitudeDegrees ?? item?.ry ?? 1,
      angle,
      item?.weight ?? 1
    );
  }

  function normalize2(xInput, yInput) {
    const x = finite(xInput, 0);
    const y = finite(yInput, 0);
    const length = Math.max(EPSILON, Math.hypot(x, y));

    return Object.freeze({
      x: x / length,
      y: y / length,
      length
    });
  }

  function normalize3(xInput, yInput, zInput) {
    const x = finite(xInput, 0);
    const y = finite(yInput, 0);
    const z = finite(zInput, 0);
    const length = Math.max(EPSILON, Math.hypot(x, y, z));

    return Object.freeze({
      x: x / length,
      y: y / length,
      z: z / length,
      length
    });
  }

  function dot2(ax, ay, bx, by) {
    return finite(ax, 0) * finite(bx, 0) + finite(ay, 0) * finite(by, 0);
  }

  function dot3(ax, ay, az, bx, by, bz) {
    return finite(ax, 0) * finite(bx, 0) + finite(ay, 0) * finite(by, 0) + finite(az, 0) * finite(bz, 0);
  }

  function length2(x, y) {
    return Math.hypot(finite(x, 0), finite(y, 0));
  }

  function length3(x, y, z) {
    return Math.hypot(finite(x, 0), finite(y, 0), finite(z, 0));
  }

  function hash2(xInput, yInput, seedInput = 0) {
    const x = Math.floor(finite(xInput, 0));
    const y = Math.floor(finite(yInput, 0));
    const seed = Math.floor(finite(seedInput, 0));

    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;

    return (h >>> 0) / 4294967295;
  }

  function hash3(xInput, yInput, zInput, seedInput = 0) {
    const x = Math.floor(finite(xInput, 0));
    const y = Math.floor(finite(yInput, 0));
    const z = Math.floor(finite(zInput, 0));
    const seed = Math.floor(finite(seedInput, 0));

    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= Math.imul(z ^ seed ^ 0x165667b1, 0x9e3779b1);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;

    return (h >>> 0) / 4294967295;
  }

  function valueNoise2(uInput, vInput, scaleInput = 8, seedInput = 0) {
    const scale = Math.max(2, Math.floor(finite(scaleInput, 8)));
    const u = wrap01(uInput) * scale;
    const v = clamp01(vInput) * scale;

    const x0 = Math.floor(u);
    const y0 = Math.floor(v);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const xf = u - x0;
    const yf = v - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const seed = Math.floor(finite(seedInput, 0));

    const a = hash2(((x0 % scale) + scale) % scale, y0, seed);
    const b = hash2(((x1 % scale) + scale) % scale, y0, seed);
    const c = hash2(((x0 % scale) + scale) % scale, y1, seed);
    const d = hash2(((x1 % scale) + scale) % scale, y1, seed);

    return lerp(lerp(a, b, sx), lerp(c, d, sx), sy);
  }

  function fbm2(uInput, vInput, options = {}) {
    const seed = Math.floor(finite(options.seed, 0));
    const octaves = clamp(Math.floor(finite(options.octaves, 5)), 1, 9);
    const lacunarity = finite(options.lacunarity, PHI);
    const gain = finite(options.gain, 0.52);
    let amplitude = finite(options.amplitude, 0.58);
    let scale = finite(options.scale, 3.5);
    let total = 0;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise2(
        finite(uInput, 0) * Math.pow(PHI, i * 0.05),
        finite(vInput, 0) * Math.pow(INV_PHI + 1, i * 0.03),
        scale,
        seed + i * 131
      ) * amplitude;
      norm += amplitude;
      amplitude *= gain;
      scale *= lacunarity;
    }

    return total / Math.max(EPSILON, norm);
  }

  function ridgeNoise2(uInput, vInput, options = {}) {
    const seed = Math.floor(finite(options.seed, 0));
    const octaves = clamp(Math.floor(finite(options.octaves, 4)), 1, 9);
    const lacunarity = finite(options.lacunarity, PHI);
    const gain = finite(options.gain, 0.50);
    let amplitude = finite(options.amplitude, 0.58);
    let scale = finite(options.scale, 4.0);
    let total = 0;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      const n = valueNoise2(uInput, vInput, scale, seed + i * 197);
      total += (1 - Math.abs(n * 2 - 1)) * amplitude;
      norm += amplitude;
      amplitude *= gain;
      scale *= lacunarity;
    }

    return total / Math.max(EPSILON, norm);
  }

  function domainWarp2(uInput, vInput, options = {}) {
    const u = finite(uInput, 0);
    const v = finite(vInput, 0);
    const seed = Math.floor(finite(options.seed, 0));
    const strength = finite(options.strength, 0.08);
    const scale = finite(options.scale, 2.5);

    const xWarp = (fbm2(u + 0.173, v - 0.119, { seed: seed + 301, scale, octaves: 4 }) - 0.5) * strength;
    const yWarp = (fbm2(u - 0.227, v + 0.191, { seed: seed + 607, scale, octaves: 4 }) - 0.5) * strength;

    return Object.freeze({
      u: wrap01(u + xWarp),
      v: clamp01(v + yWarp),
      xWarp,
      yWarp
    });
  }

  function mixColor(a, b, t) {
    const aa = Array.isArray(a) ? a : [0, 0, 0];
    const bb = Array.isArray(b) ? b : [255, 255, 255];

    return Object.freeze([
      Math.round(lerp(aa[0], bb[0], t)),
      Math.round(lerp(aa[1], bb[1], t)),
      Math.round(lerp(aa[2], bb[2], t))
    ]);
  }

  function shadeColor(color, amount) {
    const source = Array.isArray(color) ? color : [0, 0, 0];
    const delta = finite(amount, 0);

    return Object.freeze([
      clamp(Math.round(source[0] + delta), 0, 255),
      clamp(Math.round(source[1] + delta), 0, 255),
      clamp(Math.round(source[2] + delta), 0, 255)
    ]);
  }

  function contrastColor(color, factor = 1.12, pivot = 118) {
    const source = Array.isArray(color) ? color : [0, 0, 0];
    const f = finite(factor, 1.12);
    const p = finite(pivot, 118);

    return Object.freeze([
      clamp(Math.round((source[0] - p) * f + p), 0, 255),
      clamp(Math.round((source[1] - p) * f + p), 0, 255),
      clamp(Math.round((source[2] - p) * f + p), 0, 255)
    ]);
  }

  function rgba(color, alpha = 1) {
    const source = Array.isArray(color) ? color : [0, 0, 0];
    return `rgba(${clamp(Math.round(source[0]), 0, 255)},${clamp(Math.round(source[1]), 0, 255)},${clamp(Math.round(source[2]), 0, 255)},${clamp01(alpha)})`;
  }

  function ratio(part, whole, fallback = 0) {
    const denominator = finite(whole, 0);
    if (Math.abs(denominator) < EPSILON) return finite(fallback, 0);
    return finite(part, 0) / denominator;
  }

  function percent(part, whole, decimals = 2) {
    const value = ratio(part, whole, 0) * 100;
    const places = clamp(Math.floor(finite(decimals, 2)), 0, 8);
    return Number(value.toFixed(places));
  }

  function near(a, b, tolerance = EPSILON) {
    return Math.abs(finite(a, 0) - finite(b, 0)) <= Math.max(0, finite(tolerance, EPSILON));
  }

  function signedPow(value, power) {
    const number = finite(value, 0);
    return Math.sign(number) * Math.pow(Math.abs(number), finite(power, 1));
  }

  function goldenPhase(index, offset = 0) {
    return wrap01(finite(index, 0) * INV_PHI + finite(offset, 0));
  }

  function fibonacciAt(index) {
    const n = clamp(Math.floor(finite(index, 0)), 0, 64);
    if (n <= 1) return 1;

    let a = 1;
    let b = 1;

    for (let i = 2; i <= n; i += 1) {
      const next = a + b;
      a = b;
      b = next;
    }

    return b;
  }

  function nodalRangeForPrimaryNode(primaryNode) {
    const node = clamp(Math.floor(finite(primaryNode, 1)), 1, 16);
    const start = (node - 1) * 16 + 1;
    const end = start + 15;

    return Object.freeze({
      primaryNode: node,
      start,
      end,
      count: 16
    });
  }

  function primaryNodeForSubnode(subnode) {
    const node = clamp(Math.floor(finite(subnode, 1)), 1, 256);
    const primaryNode = Math.floor((node - 1) / 16) + 1;
    const localIndex = ((node - 1) % 16) + 1;

    return Object.freeze({
      subnode: node,
      primaryNode,
      localIndex,
      range: nodalRangeForPrimaryNode(primaryNode)
    });
  }

  function canvasDpr(maxDpr = 1.5) {
    const native = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    return clamp(native, 1, finite(maxDpr, 1.5));
  }

  function fitContain(containerWidth, containerHeight, aspectWidth = 1, aspectHeight = 1) {
    const cw = Math.max(1, finite(containerWidth, 1));
    const ch = Math.max(1, finite(containerHeight, 1));
    const aw = Math.max(EPSILON, finite(aspectWidth, 1));
    const ah = Math.max(EPSILON, finite(aspectHeight, 1));
    const targetAspect = aw / ah;
    const containerAspect = cw / ch;

    if (containerAspect > targetAspect) {
      const height = ch;
      const width = height * targetAspect;
      return Object.freeze({
        width,
        height,
        x: (cw - width) * 0.5,
        y: 0,
        scale: height / ah
      });
    }

    const width = cw;
    const height = width / targetAspect;

    return Object.freeze({
      width,
      height,
      x: 0,
      y: (ch - height) * 0.5,
      scale: width / aw
    });
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_math_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/showroom/globe/planet/planet.math.js",
        contract: CONTRACT
      });
    } catch (error) {
      return Object.freeze({
        manifestAvailable: true,
        valid: false,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "universal-planet-family-math",
      fileNumber: 2,
      primaryNode: 2,
      subnodes: Object.freeze([17, 32]),
      universalAnchor: "/showroom/globe/",
      firstPlanetInstance: "Audralia",
      owns: Object.freeze([
        "finite guards",
        "interpolation",
        "coordinate wrapping",
        "sphere projection helpers",
        "vector helpers",
        "deterministic noise",
        "domain warp",
        "ratio helpers",
        "color math helpers",
        "fibonacci helpers",
        "nodal math helpers",
        "canvas fit helpers"
      ]),
      doesNotOwn: Object.freeze([
        "manifest law",
        "lattice authority",
        "palette constants",
        "Audralia identity",
        "landmask",
        "hydrology",
        "elevation",
        "climate",
        "biome",
        "surface truth",
        "atmosphere truth",
        "runtime state",
        "controls",
        "canvas composition",
        "route bridge",
        "HTML expression"
      ]),
      constants: Object.freeze({
        TAU,
        HALF_PI,
        PHI,
        INV_PHI,
        EPSILON
      }),
      manifestRegistration: validateManifestRegistration(),
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      oneFileOneJob: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    TAU,
    HALF_PI,
    PHI,
    INV_PHI,
    EPSILON,
    FIBONACCI_BUILD,

    finite,
    clamp,
    clamp01,
    lerp,
    inverseLerp,
    remap,
    smoothstep,
    smootherstep,
    sharpen,
    soften,

    wrap01,
    wrapRange,
    wrapRadians,
    wrapDegrees,
    degreesToRadians,
    radiansToDegrees,
    longitudeDeltaDegrees,
    longitudeDeltaRadians,

    uvToLonLat,
    lonLatToUV,
    sphericalToCartesian,
    cartesianToSpherical,
    projectSpherePoint,

    rotate2D,
    rotatedEllipseScore,
    rotatedLonLatEllipseScore,

    normalize2,
    normalize3,
    dot2,
    dot3,
    length2,
    length3,

    hash2,
    hash3,
    valueNoise2,
    fbm2,
    ridgeNoise2,
    domainWarp2,

    mixColor,
    shadeColor,
    contrastColor,
    rgba,

    ratio,
    percent,
    near,
    signedPow,
    goldenPhase,
    fibonacciAt,
    nodalRangeForPrimaryNode,
    primaryNodeForSubnode,
    canvasDpr,
    fitContain,

    validateManifestRegistration,
    getStatus
  });

  window.DGB_PLANET_FAMILY_MATH = API;
  window.DGB_PLANET_FAMILY_MATH_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_MATH = API;
  window.AUDRALIA_CLEAN_CANVAS_MATH_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.planetFamilyMathLoaded = "true";
    document.documentElement.dataset.planetFamilyMathContract = CONTRACT;
    document.documentElement.dataset.planetFamilyMathReceipt = RECEIPT;
    document.documentElement.dataset.planetFamilyMathVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasMathLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasMathContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasMathReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasMathNode = "2";
    document.documentElement.dataset.audraliaCleanCanvasMathSubnodes = "17-32";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();
