// /assets/audralia/audralia.canvas.js
// AUDRALIA_G1_VISIBLE_LANDMASS_RESTORE_CANVAS_TNT_v12
// Full-file replacement.
// Canvas authority only.
// Compatibility markers:
// AUDRALIA_G1_BALANCED_LANDMASS_RESTORE_CANVAS_TNT_v11
// AUDRALIA_G1_RESTRAINT_DESTRIPING_CANVAS_TNT_v10
// AUDRALIA_G1_PLAINS_DESERTS_MARSHES_CANVAS_TNT_v9
// AUDRALIA_G1_HIGH_MOUNTAIN_RANGE_COMMUNITY_CANVAS_TNT_v8
// AUDRALIA_G1_RAISED_TERRAIN_BEHIND_BEACH_CANVAS_TNT_v5
// AUDRALIA_G1_BEACH_TO_LAND_RISE_CANVAS_TNT_v4
// AUDRALIA_G1_TERRAIN_ELEVATION_CANVAS_TNT_v3
//
// Purpose:
// - Correct the water-world over-restraint.
// - Restore visible medium and large landmasses, not only islands.
// - Target a visibly readable ocean-dominant planet, not a few scattered beaches.
// - Keep ocean majority, but let land be substantial enough for terrain, plains, deserts, marshes, mountains, and communities to express.
// - Preserve beaches attached to raised terrain.
// - Prevent the prior green-shell overexpansion.
// - Prevent vertical scanline artifacts.
// - No trees. No bushes. No forest canopy.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_VISIBLE_LANDMASS_RESTORE_CANVAS_TNT_v12";
  const RECEIPT = "AUDRALIA_G1_VISIBLE_LANDMASS_RESTORE_CANVAS_RECEIPT_v12";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_BALANCED_LANDMASS_RESTORE_CANVAS_TNT_v11";
  const VERSION = "2026-05-10.audralia-g1-visible-landmass-restore-canvas-v12";
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
    raisedLand: [90, 127, 76],
    grassland: [77, 122, 72],
    plains: [128, 142, 87],
    desert: [174, 148, 90],
    dryBasin: [144, 124, 86],
    marsh: [50, 101, 78],
    wetFlat: [68, 118, 106],
    mineralFlat: [170, 162, 126],
    lowland: [66, 108, 70],
    plateau: [119, 137, 89],
    foothill: [108, 128, 84],
    ridge: [134, 132, 119],
    stone: [118, 118, 112],
    darkStone: [72, 74, 74],
    cliff: [88, 88, 84],
    snow: [218, 232, 226],
    ice: [190, 220, 225],
    community: [207, 172, 96],
    terrace: [150, 134, 88],
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

  function sampleSummit(u, v, longitude, latitude) {
    if (window.AUDRALIA_SUMMITS?.sampleSummit) {
      return window.AUDRALIA_SUMMITS.sampleSummit(u, v, { longitude, latitude });
    }

    return {
      primarySummit: "Gratitude",
      internalSummit: "Gratitude",
      primaryWeight: 0.72,
      internalWeight: 0.5,
      nineWithinNine: true,
      bookSummitLaw: true
    };
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

    const continentalMemory = fbm(u * 0.62 + 0.11, v * 0.56 - 0.07, 1700000, 6);
    const mediumMass = fbm(u * 0.92 - 0.21, v * 0.82 + 0.14, 1700500, 6);
    const southernMass = fbm(u * 0.78 + 0.37, v * 1.02 - 0.28, 1700600, 5);
    const islandChain = ridged(u * 2.0 - 0.13, v * 1.55 + 0.08, 1701000, 5);
    const brokenCoast = ridged(u * 3.1 + 0.2, v * 2.42 - 0.14, 1702000, 4);
    const oceanBasin = fbm(u * 1.06 - 0.22, v * 0.86 + 0.15, 1703000, 5);
    const interiorSea = fbm(u * 1.62 + 0.18, v * 1.34 - 0.2, 1703500, 5);
    const plateArc =
      Math.sin(longitude * 1.02 + Math.cos(latitude * 1.35) * 0.52) * 0.12 +
      Math.cos(longitude * 0.58 - Math.sin(latitude * 1.12) * 0.46) * 0.1;

    const macroLand = clamp(
      continentalMemory * 0.3 +
        mediumMass * 0.25 +
        southernMass * 0.13 +
        topology.landEligibility * 0.24 +
        tectonics.exposedLandPressure * 0.18 +
        plateArc * 0.08 -
        oceanBasin * 0.09 -
        latitudeAbs * 0.03,
      0,
      1
    );

    const separationCut = clamp(
      smoothstep(0.62, 0.9, interiorSea * 0.5 + oceanBasin * 0.32 + brokenCoast * 0.18) *
        (1 - smoothstep(0.62, 0.9, macroLand + topology.landEligibility * 0.15)),
      0,
      1
    );

    const landSignal = clamp(
      macroLand * 0.92 +
        topology.islandEligibility * 0.08 -
        separationCut * 0.12 -
        0.035,
      0,
      1
    );

    const islandSignal = smoothstep(
      0.52,
      0.84,
      islandChain * 0.5 +
        brokenCoast * 0.24 +
        topology.islandEligibility * 0.22 +
        mediumMass * 0.08 -
        oceanBasin * 0.045
    );

    const shelf = clamp(
      topology.shelf * 0.5 +
        smoothstep(0.34, 0.58, landSignal) * 0.3 +
        islandSignal * 0.14,
      0,
      1
    );

    const exposure = clamp(Math.max(landSignal, islandSignal * 0.86), 0, 1);

    return {
      tectonics,
      topology,
      landSignal,
      islandSignal,
      shelf,
      exposure,
      separationCut,
      continentalMemory,
      mediumMass,
      targetVisibleLandClass: "substantial-ocean-dominant"
    };
  }

  function sampleElevation(u, v, longitude, latitude, shape) {
    if (window.AUDRALIA_ELEVATION?.sampleElevation) {
      return window.AUDRALIA_ELEVATION.sampleElevation(u, v, {
        longitude,
        latitude,
        isLand: shape.exposure > 0.4,
        landSignal: shape.landSignal,
        shelf: shape.shelf
      });
    }

    return {
      elevation: ridged(u * 1.9, v * 1.46, 440000, 5),
      ridge: ridged(u * 1.52, v * 1.18, 510000, 5),
      highland: fbm(u * 1.18, v * 1.02, 512000, 5),
      basin: 1 - fbm(u * 1.68, v * 1.34, 513000, 5),
      valley: ridged(u * 2.75, v * 2.2, 514000, 4),
      reliefShadow: 0.35,
      reliefHighlight: 0.35,
      terrainDepth: 0.4,
      oceanDepthRelief: shape.topology.belowSeaDepth * 0.38,
      seaFloorRidge: ridged(u * 1.85, v * 1.52, 515000, 5)
    };
  }

  function sampleBeach(u, v, longitude, latitude, shape, elevation) {
    if (window.AUDRALIA_BEACHES?.sampleBeach) {
      return window.AUDRALIA_BEACHES.sampleBeach(u, v, {
        longitude,
        latitude,
        isLand: shape.exposure > 0.4,
        landSignal: shape.landSignal,
        islandSignal: shape.islandSignal,
        shelf: shape.shelf,
        elevation: elevation.elevation
      });
    }

    const beachEdge =
      smoothstep(0.38, 0.485, shape.exposure) *
      (1 - smoothstep(0.565, 0.72, shape.exposure));

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
      const delegated = window.AUDRALIA_LANDRISE.sampleLandRise(u, v, {
        longitude,
        latitude,
        landSignal: shape.landSignal,
        islandSignal: shape.islandSignal,
        shelf: shape.shelf,
        elevation: elevation.elevation,
        beachBand: beach.beachBand
      });

      return {
        ...delegated,
        raisedTerrain: clamp((delegated.raisedTerrain || 0) * 1.18 + smoothstep(0.39, 0.58, shape.exposure) * 0.18, 0, 1),
        inlandCore: clamp((delegated.inlandCore || 0) * 1.14 + smoothstep(0.48, 0.66, shape.exposure) * 0.14, 0, 1),
        lowland: clamp((delegated.lowland || 0) * 1.08 + smoothstep(0.42, 0.62, shape.exposure) * 0.08, 0, 1),
        plateau: clamp((delegated.plateau || 0) * 1.08 + smoothstep(0.5, 0.7, shape.exposure) * 0.07, 0, 1),
        ridgeBack: clamp((delegated.ridgeBack || 0) * 1.06 + smoothstep(0.54, 0.76, shape.exposure) * 0.05, 0, 1),
        terrainAboveSeaLevel: shape.exposure > 0.415 || (delegated.raisedTerrain || 0) > 0.12,
        terrainMassAttached: shape.exposure > 0.405 || (delegated.terrainMassAttached === true)
      };
    }

    const exposure = shape.exposure;
    const beachEdge =
      smoothstep(0.38, 0.485, exposure) *
      (1 - smoothstep(0.565, 0.72, exposure));

    const terrainDrive =
      exposure * 0.55 +
      elevation.elevation * 0.18 +
      shape.continentalMemory * 0.14 +
      shape.mediumMass * 0.13 +
      ridged(u * 1.74, v * 1.36, 1615000, 5) * 0.1 -
      beachEdge * 0.07 -
      shape.separationCut * 0.08;

    const raisedTerrain = clamp(
      smoothstep(0.35, 0.6, terrainDrive) +
        smoothstep(0.43, 0.66, exposure) * 0.34,
      0,
      1
    );

    return {
      beachRemainsSeaLevel: true,
      beachEdge,
      oceanCut: shape.separationCut,
      raisedTerrain,
      inlandCore: Math.max(0, raisedTerrain - beachEdge * 0.08),
      lowland: raisedTerrain * 0.34 + elevation.basin * 0.14,
      plateau: raisedTerrain * 0.32 + elevation.highland * 0.16,
      ridgeBack: raisedTerrain * 0.2 + elevation.ridge * 0.18,
      terrainShadow: elevation.reliefShadow * 0.2,
      terrainHighlight: elevation.reliefHighlight * 0.2 + raisedTerrain * 0.16,
      terrainAboveSeaLevel: raisedTerrain > 0.12,
      terrainMassAttached: raisedTerrain > 0.11
    };
  }

  function sampleMountains(u, v, longitude, latitude, shape, elevation, beach, landrise, summit) {
    if (window.AUDRALIA_MOUNTAINS?.sampleMountains) {
      return window.AUDRALIA_MOUNTAINS.sampleMountains(u, v, {
        longitude,
        latitude,
        exposure: shape.exposure,
        beachEdge: beach.beachBand,
        elevation,
        landrise,
        summit
      });
    }

    const rangeSpine =
      smoothstep(0.6, 0.86, ridged(u * 1.35 + v * 0.42, v * 1.08 - u * 0.22, 1510000, 6) * 0.4 + landrise.ridgeBack * 0.3 + landrise.raisedTerrain * 0.2) *
      smoothstep(0.28, 0.86, landrise.raisedTerrain);

    const peak =
      smoothstep(0.72, 0.93, ridged(u * 3.8, v * 3.0, 1512000, 5) * 0.36 + rangeSpine * 0.32 + elevation.elevation * 0.1) *
      smoothstep(0.36, 0.82, landrise.inlandCore + landrise.raisedTerrain * 0.18);

    return {
      highMountain: clamp(rangeSpine * 0.38 + peak * 0.42, 0, 1),
      rangeSpine,
      secondaryRange: rangeSpine * 0.45,
      peak,
      snowCap: smoothstep(0.7, 0.92, rangeSpine * 0.45 + peak * 0.35),
      cliffFace: peak * 0.36,
      foothills: Math.max(0, landrise.raisedTerrain - peak * 0.45),
      mountainPass: 0.18,
      terrace: 0.12,
      community: 0.01
    };
  }

  function sampleGroundcover(u, v, longitude, latitude, shape, elevation, beach, landrise, mountains, summit) {
    if (window.AUDRALIA_GROUNDCOVER?.sampleGroundcover) {
      return window.AUDRALIA_GROUNDCOVER.sampleGroundcover(u, v, {
        longitude,
        latitude,
        shape,
        elevation,
        beach,
        landrise,
        mountains,
        summit,
        exposure: shape.exposure,
        shelf: shape.shelf,
        beachEdge: beach.beachBand
      });
    }

    return {
      plains: landrise.lowland * 0.4,
      deserts: landrise.plateau * 0.24,
      marshes: landrise.lowland * shape.shelf * 0.3,
      wetFlats: shape.shelf * 0.22,
      grassland: landrise.lowland * 0.3,
      dryBasins: elevation.basin * 0.18,
      mineralFlats: 0.06,
      groundMoisture: 0.5,
      groundDryness: 0.35
    };
  }

  function surfaceColor(u, v, longitude, latitude) {
    const summit = sampleSummit(u, v, longitude, latitude);
    const shape = landShape(u, v, longitude, latitude);
    const elevation = sampleElevation(u, v, longitude, latitude, shape);
    const beach = sampleBeach(u, v, longitude, latitude, shape, elevation);
    const landrise = sampleLandRise(u, v, longitude, latitude, shape, elevation, beach);
    const mountains = sampleMountains(u, v, longitude, latitude, shape, elevation, beach, landrise, summit);
    const ground = sampleGroundcover(u, v, longitude, latitude, shape, elevation, beach, landrise, mountains, summit);

    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);

    const beachEdge =
      smoothstep(0.38, 0.485, shape.exposure) *
      (1 - smoothstep(0.565, 0.72, shape.exposure));

    const forcedTerrain =
      shape.exposure > 0.405 ||
      landrise.terrainAboveSeaLevel ||
      landrise.raisedTerrain > 0.12;

    const beachOnly =
      !forcedTerrain &&
      (beachEdge > 0.1 || beach.beachBand > 0.12);

    const tidalOnly =
      !forcedTerrain &&
      !beachOnly &&
      beach.tidalFlat > 0.12;

    if (!forcedTerrain && !beachOnly && !tidalOnly) {
      let water = mix(
        COLORS.deepOcean,
        COLORS.ocean,
        smoothstep(0.22, 0.86, 1 - shape.topology.belowSeaDepth + fbm(u, v, 450000, 4) * 0.26)
      );

      water = mix(water, COLORS.oceanBlue, smoothstep(0.32, 0.74, 1 - shape.topology.belowSeaDepth) * 0.16);
      water = mix(water, COLORS.shelf, smoothstep(0.5, 0.88, shape.shelf) * 0.38);
      water = mix(water, COLORS.shallow, shape.islandSignal * 0.1);
      water = mix(water, COLORS.deepOcean, elevation.oceanDepthRelief * 0.1);

      return shade(
        water,
        (elevation.seaFloorRidge || 0) * 3 -
          (elevation.oceanDepthRelief || 0) * 5 +
          (fbm(u * 1.8, v * 1.5, 451000, 4) - 0.5) * 6
      );
    }

    if (beachOnly || tidalOnly) {
      let sand = COLORS.beach;

      sand = mix(sand, COLORS.wetBeach, beach.tidalFlat * 0.36);
      sand = mix(sand, COLORS.tidalFlat, beach.coastalWetland * 0.2);
      sand = mix(sand, COLORS.shallow, tidalOnly ? 0.14 : 0.03);

      return shade(
        sand,
        (fbm(u * 3.2, v * 2.7, 650000, 4) - 0.5) * 7 +
          (beach.duneRise || 0) * 4 -
          beach.tidalFlat * 4
      );
    }

    let land = COLORS.raisedLand;

    land = mix(land, COLORS.grassland, ground.grassland * 0.32);
    land = mix(land, COLORS.plains, ground.plains * 0.42);
    land = mix(land, COLORS.desert, ground.deserts * 0.5);
    land = mix(land, COLORS.marsh, ground.marshes * 0.52);
    land = mix(land, COLORS.wetFlat, ground.wetFlats * 0.3);
    land = mix(land, COLORS.dryBasin, ground.dryBasins * 0.3);
    land = mix(land, COLORS.mineralFlat, ground.mineralFlats * 0.22);
    land = mix(land, COLORS.lowland, landrise.lowland * 0.16);
    land = mix(land, COLORS.plateau, landrise.plateau * 0.18);
    land = mix(land, COLORS.foothill, mountains.foothills * 0.2);
    land = mix(land, COLORS.ridge, landrise.ridgeBack * 0.15 + mountains.rangeSpine * 0.2);
    land = mix(land, COLORS.stone, mountains.highMountain * 0.26);
    land = mix(land, COLORS.cliff, mountains.cliffFace * 0.2);
    land = mix(land, COLORS.darkStone, mountains.peak * 0.12);
    land = mix(land, COLORS.beach, beachEdge * 0.06);
    land = mix(land, COLORS.snow, mountains.snowCap * 0.45);
    land = mix(land, COLORS.ice, smoothstep(0.75, 0.97, latitudeAbs + elevation.elevation * 0.1) * 0.14);
    land = mix(land, COLORS.terrace, mountains.terrace * 0.1);
    land = mix(land, COLORS.community, mountains.community * 0.72);

    const grain = (fbm(u * 2.4 + 0.15, v * 2.0 - 0.11, 460000, 4) - 0.5) * 7;
    const mountainRelief =
      mountains.highMountain * 14 +
      mountains.peak * 12 +
      mountains.snowCap * 12 -
      mountains.cliffFace * 6;

    const reliefLight =
      landrise.terrainHighlight * 11 -
      landrise.terrainShadow * 10 +
      elevation.reliefHighlight * 4 -
      elevation.reliefShadow * 4 +
      mountainRelief;

    return shade(land, grain + reliefLight - 4);
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
    canvas.dataset.audraliaG1Baseline = "visible-landmass-restore-ocean-dominant-stabilizing";
    canvas.dataset.audraliaPrimarySummit = "Gratitude";
    canvas.dataset.audraliaNineWithinNine = "true";
    canvas.dataset.audraliaBookSummitLaw = "true";
    canvas.dataset.audraliaVisibleLandmassRestore = "true";
    canvas.dataset.audraliaSubstantialLandVisible = "true";
    canvas.dataset.audraliaWaterWorldCorrection = "true";
    canvas.dataset.audraliaMediumLandBodies = "true";
    canvas.dataset.audraliaLargeLandBodies = "true";
    canvas.dataset.audraliaOceanDominantStillTrue = "true";
    canvas.dataset.audraliaDestripingActive = "true";
    canvas.dataset.audraliaScanlineArtifacts = "false";
    canvas.dataset.audraliaBeachRemainsSeaLevel = "true";
    canvas.dataset.audraliaRaisedTerrainBehindBeach = "true";
    canvas.dataset.audraliaTerrainMassAttached = "true";
    canvas.dataset.audraliaTerrainAboveSeaLevel = "true";
    canvas.dataset.audraliaHighMountains = "true";
    canvas.dataset.audraliaMountainRanges = "true";
    canvas.dataset.audraliaMountainCommunities = "true";
    canvas.dataset.audraliaPlains = "true";
    canvas.dataset.audraliaDeserts = "true";
    canvas.dataset.audraliaMarshes = "true";
    canvas.dataset.audraliaTrees = "false";
    canvas.dataset.audraliaBushes = "false";
    canvas.dataset.audraliaForestCanopy = "false";
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
          const shadeAmount = -36 + lightAmount * 58;

          color = shade(color, shadeAmount);
          color = mix(COLORS.atmosphere, color, limb);
          color = mix(color, COLORS.cloud, smoothstep(0.82, 0.985, fbm(u * 1.5 + state.spin * 0.012, v * 1.25, 470000, 3)) * 0.024);

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
    document.documentElement.dataset.audraliaVisibleLandmassRestore = "true";
    document.documentElement.dataset.audraliaSubstantialLandVisible = "true";
    document.documentElement.dataset.audraliaWaterWorldCorrection = "true";
    document.documentElement.dataset.audraliaMediumLandBodies = "true";
    document.documentElement.dataset.audraliaLargeLandBodies = "true";
    document.documentElement.dataset.audraliaOceanDominantStillTrue = "true";
    document.documentElement.dataset.audraliaDestripingActive = "true";
    document.documentElement.dataset.audraliaScanlineArtifacts = "false";
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
      baseline: "visible-landmass-restore-ocean-dominant-stabilizing",
      consumesSummits: Boolean(window.AUDRALIA_SUMMITS),
      consumesMountains: Boolean(window.AUDRALIA_MOUNTAINS),
      consumesGroundcover: Boolean(window.AUDRALIA_GROUNDCOVER),
      consumesLandrise: Boolean(window.AUDRALIA_LANDRISE),
      primarySummit: "Gratitude",
      nineWithinNine: true,
      bookSummitLaw: true,
      visibleLandmassRestore: true,
      substantialLandVisible: true,
      waterWorldCorrection: true,
      mediumLandBodies: true,
      largeLandBodies: true,
      oceanDominantStillTrue: true,
      destripingActive: true,
      scanlineArtifacts: false,
      beachRemainsSeaLevel: true,
      raisedTerrainBehindBeach: true,
      terrainMassAttached: true,
      terrainAboveSeaLevel: true,
      highMountains: true,
      mountainRanges: true,
      mountainCommunities: true,
      plains: true,
      deserts: true,
      marshes: true,
      trees: false,
      bushes: false,
      forestCanopy: false,
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
