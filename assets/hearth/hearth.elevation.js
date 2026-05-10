// /assets/hearth/hearth.elevation.js
// HEARTH_TANGIBLE_ELEVATION_MOUNTAINS_FOOTHILLS_CLIFFS_TNT_v1
// Full-file replacement / new dedicated elevation authority.
// Purpose:
// - Own tangible elevation expression only.
// - Provide mountains, foothills, cliffs, escarpments, highlands, basins, valleys, shelves, and visual-depth signals.
// - Preserve body mass, coastline, island, runtime, controls, canvas, route, and material authority separation.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_TANGIBLE_ELEVATION_MOUNTAINS_FOOTHILLS_CLIFFS_TNT_v1";
  const RECEIPT = "HEARTH_TANGIBLE_ELEVATION_MOUNTAINS_FOOTHILLS_CLIFFS_RECEIPT_v1";
  const VERSION = "2026-05-10.hearth-dedicated-elevation-authority-v1";

  const PROFILE = Object.freeze({
    "north-crown-mass": {
      id: 1,
      name: "North Crown",
      rangeAngle: -0.72,
      secondaryAngle: 0.24,
      spine: 0.86,
      foothill: 0.42,
      cliff: 0.78,
      basin: 0.14,
      shelf: 0.36,
      ice: 0.88,
      rock: 0.72,
      soil: 0.08,
      mineral: 0.38
    },
    "equatorial-great-mass": {
      id: 2,
      name: "Equatorial Great Mass",
      rangeAngle: -0.58,
      secondaryAngle: 0.84,
      spine: 0.72,
      foothill: 0.68,
      cliff: 0.46,
      basin: 0.76,
      shelf: 0.64,
      ice: 0.02,
      rock: 0.56,
      soil: 0.82,
      mineral: 0.72
    },
    "northwest-temperate-mass": {
      id: 3,
      name: "Northwest Temperate Mass",
      rangeAngle: 0.78,
      secondaryAngle: -0.34,
      spine: 0.80,
      foothill: 0.62,
      cliff: 0.54,
      basin: 0.42,
      shelf: 0.40,
      ice: 0.18,
      rock: 0.62,
      soil: 0.62,
      mineral: 0.50
    },
    "northeast-broken-shelf-mass": {
      id: 4,
      name: "Northeast Broken Shelf Mass",
      rangeAngle: -0.28,
      secondaryAngle: 1.08,
      spine: 0.38,
      foothill: 0.44,
      cliff: 0.42,
      basin: 0.30,
      shelf: 0.92,
      ice: 0.04,
      rock: 0.34,
      soil: 0.54,
      mineral: 0.44
    },
    "southeast-warm-mass": {
      id: 5,
      name: "Southeast Warm Mass",
      rangeAngle: 0.36,
      secondaryAngle: -0.88,
      spine: 0.44,
      foothill: 0.66,
      cliff: 0.34,
      basin: 0.58,
      shelf: 0.84,
      ice: 0.00,
      rock: 0.36,
      soil: 0.78,
      mineral: 0.46
    },
    "southwest-ridge-mass": {
      id: 6,
      name: "Southwest Ridge Mass",
      rangeAngle: -0.86,
      secondaryAngle: 0.18,
      spine: 1.00,
      foothill: 0.34,
      cliff: 0.96,
      basin: 0.12,
      shelf: 0.24,
      ice: 0.12,
      rock: 0.94,
      soil: 0.18,
      mineral: 0.94
    },
    "south-transitional-mass": {
      id: 7,
      name: "South Transitional Mass",
      rangeAngle: 0.18,
      secondaryAngle: -1.02,
      spine: 0.64,
      foothill: 0.46,
      cliff: 0.58,
      basin: 0.22,
      shelf: 0.54,
      ice: 0.58,
      rock: 0.54,
      soil: 0.24,
      mineral: 0.50
    }
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
    const x = u * s;
    const y = v * s;
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

  function fbm(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.56;
    let scale = 4;

    for (let i = 0; i < 7; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.51;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridged(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.64;
    let scale = 7;

    for (let i = 0; i < 7; i += 1) {
      const n = noise(u, v, scale, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function fault(u, v, angle, offset, width) {
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const x = (u - 0.5) * ca - (v - 0.5) * sa;
    return Math.exp(-Math.pow(x - offset, 2) / Math.max(0.000001, width));
  }

  function sampleElevation(u, v, base = {}, terrain = {}) {
    const key = base.primaryMassKey || "";
    const profile = PROFILE[key] || PROFILE["equatorial-great-mass"];
    const id = profile.id;
    const isLand = base.isLand === true;
    const field = Number.isFinite(base.field) ? base.field : 0;
    const coast = clamp(base.coast || 0, 0, 1);
    const lat = Number.isFinite(base.lat) ? base.lat : 0;

    if (!isLand) {
      const shelf = clamp((base.shelf || 0) * profile.shelf, 0, 1);
      const shelfDrop = clamp(coast * (1 - shelf) * 0.72, 0, 1);

      return Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        elevationAuthorityLoaded: true,
        tangibleElevationLoaded: true,
        mountainRangeLoaded: false,
        foothillsLoaded: false,
        cliffSystemLoaded: false,
        visualDepthActive: false,
        oceanShelfDepth: shelf,
        shelfDrop,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });
    }

    const broadRelief = fbm(u + id * 0.033, v - id * 0.029, 30000 + id * 101);
    const stoneGrain = fbm(u * 3.4 + id * 0.021, v * 3.4 - id * 0.019, 31000 + id * 103);
    const ridgeNoise = ridged(u + id * 0.047, v - id * 0.041, 32000 + id * 107);
    const fineRidge = ridged(u * 3.1 + id * 0.061, v * 3.1 - id * 0.073, 33000 + id * 109);
    const brokenRock = ridged(u * 7.2 + id * 0.081, v * 7.2 - id * 0.087, 34000 + id * 113);
    const micro = noise(u + id * 0.091, v - id * 0.067, 288, 35000 + id * 127);

    const primarySpine = fault(u, v, profile.rangeAngle, -0.035 + id * 0.006, 0.0065 + id * 0.0012);
    const secondarySpine = fault(u, v, profile.secondaryAngle, 0.045 - id * 0.004, 0.011 + id * 0.0015);
    const crossFold = fault(u, v, profile.rangeAngle - 1.18, 0.016 - id * 0.002, 0.019 + id * 0.0018);
    const escarpment = fault(u, v, profile.rangeAngle - 0.31, -0.082 + id * 0.004, 0.006 + id * 0.0008);
    const basinCut = fault(u, v, profile.rangeAngle + 1.09, 0.060 - id * 0.009, 0.034 + id * 0.002);
    const valleyCut = fault(u, v, profile.secondaryAngle + 0.82, -0.020 + id * 0.003, 0.026 + id * 0.002);

    const mountainSpine = clamp(
      primarySpine * profile.spine * 0.86 +
        secondarySpine * profile.spine * 0.38 +
        crossFold * profile.spine * 0.24 +
        ridgeNoise * profile.spine * 0.30,
      0,
      1
    );

    const mountainRange = clamp(
      mountainSpine * 0.64 +
        fineRidge * profile.spine * 0.34 +
        brokenRock * profile.rock * 0.16,
      0,
      1
    );

    const foothills = clamp(
      smoothstep(0.18, 0.72, broadRelief) *
        profile.foothill *
        (1 - mountainSpine * 0.42) *
        (1 - basinCut * 0.22),
      0,
      1
    );

    const highlands = clamp(
      mountainRange * 0.50 +
        foothills * 0.38 +
        broadRelief * profile.spine * 0.24 -
        basinCut * profile.basin * 0.18,
      0,
      1
    );

    const plateau = clamp(
      smoothstep(0.38, 0.78, highlands) *
        (1 - mountainRange * 0.32) *
        (1 - valleyCut * 0.24),
      0,
      1
    );

    const basin = clamp(
      basinCut * profile.basin +
        valleyCut * profile.basin * 0.42 +
        (1 - ridgeNoise) * profile.basin * broadRelief * 0.28,
      0,
      1
    );

    const valley = clamp(
      valleyCut * 0.52 +
        (1 - fineRidge) * profile.foothill * 0.30 +
        basin * 0.34,
      0,
      1
    );

    const cliffWall = clamp(
      coast * profile.cliff * 0.50 +
        escarpment * profile.cliff * 0.82 +
        mountainRange * ridgeNoise * profile.cliff * 0.28 +
        (terrain.hardJaggedEdge || 0) * profile.cliff * 0.34,
      0,
      1
    );

    const verticalRelief = clamp(
      field * 0.22 +
        highlands * 0.36 +
        mountainRange * 0.30 +
        cliffWall * 0.22 -
        basin * 0.24 -
        valley * 0.12 -
        coast * 0.07,
      0,
      1
    );

    const peakHighlight = clamp(
      mountainRange * smoothstep(0.54, 0.96, fineRidge) +
        primarySpine * smoothstep(0.46, 0.92, micro) * 0.58,
      0,
      1
    );

    const cliffShadow = clamp(
      cliffWall * 0.52 +
        escarpment * 0.34 +
        (1 - micro) * mountainRange * 0.18,
      0,
      1
    );

    const basinShadow = clamp(basin * 0.46 + valley * 0.28, 0, 1);
    const landDepth = clamp(verticalRelief * 0.42 + mountainRange * 0.26 + cliffWall * 0.24 + basinShadow * 0.18, 0, 1);

    const snowLine = clamp(profile.ice * smoothstep(0.48, 0.94, verticalRelief + Math.abs(lat) / (Math.PI / 2) * 0.30), 0, 1);
    const exposedRock = clamp(profile.rock * (mountainRange * 0.62 + cliffWall * 0.42 + brokenRock * 0.20), 0, 1);
    const fertileLowland = clamp(profile.soil * (1 - mountainRange * 0.62) * (valley * 0.44 + foothills * 0.24 + basin * 0.32), 0, 1);
    const mineralFace = clamp(profile.mineral * smoothstep(0.58, 0.96, ridgeNoise + micro * 0.20) * (mountainRange * 0.66 + cliffWall * 0.30), 0, 1);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      profile: profile.name,
      elevationAuthorityLoaded: true,
      tangibleElevationLoaded: true,
      mountainRangeLoaded: true,
      foothillsLoaded: true,
      cliffSystemLoaded: true,
      visualDepthActive: true,

      verticalRelief,
      elevation: verticalRelief,
      landDepth,
      mountainSpine,
      mountainRange,
      primarySpine,
      secondarySpine,
      crossFold,
      foothills,
      highlands,
      plateau,
      basin,
      valley,
      escarpment,
      cliffWall,
      cliffShadow,
      basinShadow,
      peakHighlight,

      snowLine,
      exposedRock,
      fertileLowland,
      mineralFace,

      broadRelief,
      stoneGrain,
      ridgeNoise,
      fineRidge,
      brokenRock,
      micro,

      ownsBodyMassPlacement: false,
      ownsCoastline: false,
      ownsMaterialPalette: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsCanvas: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "dedicated-tangible-elevation",
      elevationAuthorityLoaded: true,
      tangibleElevationLoaded: true,
      mountainRangeLoaded: true,
      foothillsLoaded: true,
      cliffSystemLoaded: true,
      escarpmentLoaded: true,
      basinValleyLoaded: true,
      visualDepthActive: true,
      bodyMassCount: 7,
      ownsBodyMassPlacement: false,
      ownsCoastline: false,
      ownsMaterialPalette: false,
      runtimeTouched: false,
      controlsTouched: false,
      canvasTouched: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_ELEVATION = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleElevation,
    getStatus
  });

  window.HEARTH_ELEVATION_RECEIPT = getStatus();

  document.documentElement.dataset.hearthElevationAuthorityLoaded = "true";
  document.documentElement.dataset.hearthElevationAuthorityContract = CONTRACT;
  document.documentElement.dataset.hearthElevationAuthorityReceipt = RECEIPT;
  document.documentElement.dataset.hearthTangibleElevationLoaded = "true";
  document.documentElement.dataset.hearthMountainRangeLoaded = "true";
  document.documentElement.dataset.hearthFoothillsLoaded = "true";
  document.documentElement.dataset.hearthCliffSystemLoaded = "true";
  document.documentElement.dataset.hearthVisualDepthActive = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
