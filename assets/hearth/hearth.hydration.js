// /assets/hearth/hearth.hydration.js
// HEARTH_G3_10_SOLID_GLOBAL_HYDRATION_FIELD_TNT_v1
// Full-file replacement.
// TicTacToe Dynamic Code + Quad-A Protocol.
// Purpose:
// - Replace divided/half-globe hydration behavior with one continuous global hydration field.
// - Hydration must wrap around the whole planet without hemispheric panels, linear masks, cut planes, or split-world behavior.
// - Own ocean material, shallow shelves, deep water, basins, wetlands, drainage, frozen-water storage, melt candidates, and saturation.
// - Does NOT own canvas projection, lighting, render masks, clouds, weather, rainfall, climate, seasons, wind, or storms.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_10_SOLID_GLOBAL_HYDRATION_FIELD_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-10-solid-global-hydration-field";
  const RECEIPT = "HEARTH_G3_10_SOLID_GLOBAL_HYDRATION_FIELD_RECEIPT";

  const TIC_TAC_TOE = Object.freeze({
    T1: "isolate Hearth hydration authority",
    T2: "preserve terrain authority",
    T3: "reject canvas blame unless hydration proof fails",
    T4: "remove divided-hemisphere hydration logic",
    T5: "replace line/path hydration with continuous global fields",
    T6: "bind water to terrain sample only",
    T7: "keep G3 scope only",
    T8: "defer G4 climate/weather/clouds",
    T9: "return one solid planetary hydration layer"
  });

  const QUAD_A = Object.freeze({
    authority: "/assets/hearth/hearth.hydration.js only",
    axis: "Hearth local G3 hydration proof",
    artifact: "one continuous hydration system over the whole planet",
    attack: "reject hemisphere split, hydration panels, straight global cuts, climate drift, weather drift, canvas mutation"
  });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / ((b - a) || 1e-9), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapLon(lon) {
    let v = lon;
    while (v < -180) v += 360;
    while (v >= 180) v -= 360;
    return v;
  }

  function lonRad(lon) {
    return (wrapLon(lon) * Math.PI) / 180;
  }

  function latRad(lat) {
    return (clamp(lat, -89.999, 89.999) * Math.PI) / 180;
  }

  function periodicWave(lon, lat, seed) {
    const λ = lonRad(lon);
    const φ = latRad(lat);

    const a =
      Math.sin(λ * 1.0 + φ * 1.7 + seed * 0.73) * 0.22 +
      Math.cos(λ * 2.0 - φ * 1.2 + seed * 1.13) * 0.18 +
      Math.sin(λ * 3.0 + φ * 2.3 + seed * 1.71) * 0.14 +
      Math.cos(λ * 5.0 - φ * 3.1 + seed * 2.19) * 0.10 +
      Math.sin(λ * 8.0 + φ * 4.2 + seed * 3.07) * 0.07;

    return clamp(0.5 + a, 0, 1);
  }

  function globalField(lon, lat, seed, octaves = 5) {
    let sum = 0;
    let amp = 0.56;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      const f = i + 1;
      const λ = lonRad(lon) * f;
      const φ = latRad(lat) * f;
      const v =
        Math.sin(λ + φ * 1.31 + seed * (0.71 + i)) * 0.50 +
        Math.cos(λ * 1.73 - φ * 0.83 + seed * (1.17 + i)) * 0.50;

      sum += (0.5 + v * 0.5) * amp;
      norm += amp;
      amp *= 0.52;
    }

    return norm ? clamp(sum / norm, 0, 1) : 0.5;
  }

  function basinPotential(lon, lat, terrainSample) {
    const elevation = clamp(terrainSample.elevation || 0, -1, 1);
    const moisture = clamp(terrainSample.moisture || 0.5, 0, 1);
    const aridity = clamp(terrainSample.aridity || 0, 0, 1);
    const coast = clamp(terrainSample.coast || 0, 0, 1);
    const roughness = clamp(terrainSample.roughness || 0, 0, 1);

    const lowlandPocket = smoothstep(0.04, 0.52, 1 - Math.abs(elevation - 0.18));
    const broadDepression = globalField(lon, lat, 31.73, 5);
    const localDepression = globalField(lon + 17.3, lat - 8.4, 52.91, 4);
    const inlandGate = 1 - coast * 0.55;
    const dryPenalty = aridity * 0.34;
    const roughPenalty = roughness * 0.18;

    return clamp(
      lowlandPocket * 0.42 +
        broadDepression * 0.24 +
        localDepression * 0.18 +
        moisture * 0.22 -
        dryPenalty -
        roughPenalty,
      0,
      1
    ) * inlandGate;
  }

  function drainagePotential(lon, lat, terrainSample) {
    const elevation = clamp(terrainSample.elevation || 0, 0, 1);
    const relief = clamp(terrainSample.relief || 0, 0, 1);
    const moisture = clamp(terrainSample.moisture || 0.5, 0, 1);
    const aridity = clamp(terrainSample.aridity || 0, 0, 1);
    const coast = clamp(terrainSample.coast || 0, 0, 1);
    const mountain = clamp(terrainSample.mountain || 0, 0, 1);
    const ridge = clamp(terrainSample.ridge || 0, 0, 1);

    const flowThreadA = Math.abs(periodicWave(lon, lat, 71.4) - 0.50);
    const flowThreadB = Math.abs(periodicWave(lon + 41.2, lat - 13.5, 96.2) - 0.50);
    const thread = 1 - smoothstep(0.035, 0.22, Math.min(flowThreadA, flowThreadB));

    const descentGate = smoothstep(0.10, 0.88, elevation) * (0.65 + relief * 0.35);
    const sourceGate = clamp(mountain * 0.35 + ridge * 0.30 + moisture * 0.35, 0, 1);
    const coastDraw = coast * 0.22;

    return clamp(
      thread * 0.42 * descentGate * sourceGate +
        coastDraw +
        moisture * 0.12 -
        aridity * 0.28,
      0,
      1
    );
  }

  function frozenStoragePotential(lon, lat, terrainSample) {
    const latAbs = Math.abs(lat);
    const elevation = clamp(terrainSample.elevation || 0, 0, 1);
    const ice = clamp(terrainSample.ice || 0, 0, 1);
    const mountain = clamp(terrainSample.mountain || 0, 0, 1);
    const ridge = clamp(terrainSample.ridge || 0, 0, 1);
    const polarGate = smoothstep(58, 84, latAbs);
    const highGate = smoothstep(0.54, 0.92, elevation + mountain * 0.22 + ridge * 0.12);
    const snowPatch = globalField(lon, lat, 121.7, 4);

    return clamp(
      ice * 0.62 +
        polarGate * 0.38 +
        highGate * 0.34 +
        smoothstep(0.66, 0.92, snowPatch) * highGate * 0.16,
      0,
      1
    );
  }

  function sample(lonInput, latInput, terrainSample = null) {
    const lon = wrapLon(lonInput);
    const lat = clamp(latInput, -89.999, 89.999);
    const t = terrainSample || {};

    const land = !!t.land;
    const elevation = clamp(Number.isFinite(t.elevation) ? t.elevation : 0, -1, 1);
    const coast = clamp(t.coast || 0, 0, 1);
    const shelf = clamp(t.shelf || 0, 0, 1);
    const bathymetry = clamp(t.bathymetry || 0, 0, 1);
    const moisture = clamp(t.moisture || 0.5, 0, 1);
    const aridity = clamp(t.aridity || 0, 0, 1);
    const roughness = clamp(t.roughness || 0, 0, 1);
    const terrainIce = clamp(t.ice || 0, 0, 1);

    const globalWater = globalField(lon, lat, 11.3, 5);
    const currentField = globalField(lon + 23.7, lat - 11.2, 202.4, 5);
    const microWater = globalField(lon - 7.8, lat + 3.1, 303.8, 4);

    const ocean = land ? 0 : 1;
    const shallowWater = land ? 0 : clamp(shelf * 0.96 + coast * 0.20 + globalWater * 0.05, 0, 1);
    const deepWater = land ? 0 : clamp(smoothstep(0.24, 0.88, bathymetry) * 0.88 + currentField * 0.08, 0, 1);
    const abyssWater = land ? 0 : clamp(smoothstep(0.58, 1.0, bathymetry) * 0.86 + globalWater * 0.05, 0, 1);

    const coastalWetness = land
      ? clamp(coast * 0.68 + moisture * 0.24 + microWater * 0.12 - aridity * 0.20, 0, 1)
      : clamp(coast * 0.30 + shelf * 0.64 + microWater * 0.08, 0, 1);

    const basin = land ? basinPotential(lon, lat, t) : 0;
    const drainage = land ? drainagePotential(lon, lat, t) : 0;
    const frozenStorage = land ? frozenStoragePotential(lon, lat, t) : 0;

    const lake = land
      ? clamp(
          smoothstep(0.54, 0.84, basin) * (0.44 + moisture * 0.34) -
            aridity * 0.16,
          0,
          1
        )
      : 0;

    const riverCandidate = land
      ? clamp(
          drainage * (0.42 + moisture * 0.34) +
            lake * 0.16 +
            coast * 0.08 -
            aridity * 0.18,
          0,
          1
        )
      : 0;

    const drainageCandidate = land
      ? clamp(
          drainage * 0.58 +
            riverCandidate * 0.32 +
            smoothstep(0.62, 0.88, globalField(lon + 5, lat - 2, 404.2, 4)) * 0.14,
          0,
          1
        )
      : 0;

    const wetland = land
      ? clamp(
          coastalWetness * 0.34 +
            lake * 0.32 +
            riverCandidate * 0.22 +
            moisture * 0.16 -
            aridity * 0.20 -
            roughness * 0.08,
          0,
          1
        )
      : 0;

    const meltCandidate = land
      ? clamp(
          frozenStorage *
            smoothstep(0.16, 0.72, 1 - Math.abs(lat) / 90) *
            (0.22 + globalField(lon - 19.2, lat + 6.4, 505.5, 3) * 0.22),
          0,
          1
        )
      : 0;

    const saturation = land
      ? clamp(
          coastalWetness * 0.30 +
            lake * 0.34 +
            riverCandidate * 0.28 +
            drainageCandidate * 0.20 +
            wetland * 0.38 +
            meltCandidate * 0.18 +
            moisture * 0.10,
          0,
          1
        )
      : clamp(
          shallowWater * 0.54 +
            deepWater * 0.30 +
            abyssWater * 0.16 +
            coast * 0.12,
          0,
          1
        );

    const surfaceCurrent = clamp(currentField * 0.66 + globalWater * 0.22 + microWater * 0.12, 0, 1);
    const roughWater = land
      ? clamp(riverCandidate * 0.28 + drainageCandidate * 0.22 + roughness * 0.10, 0, 1)
      : clamp(surfaceCurrent * 0.44 + bathymetry * 0.12 + shallowWater * 0.10, 0, 1);

    let material = "dry-land";

    if (!land) {
      if (abyssWater > 0.54) material = "abyss-ocean";
      else if (deepWater > 0.44) material = "deep-ocean";
      else if (shallowWater > 0.38) material = "shallow-shelf";
      else material = "ocean";
    } else if (frozenStorage > 0.56) {
      material = "frozen-storage";
    } else if (lake > 0.46) {
      material = "lake-basin";
    } else if (riverCandidate > 0.42) {
      material = "river-candidate";
    } else if (wetland > 0.40) {
      material = "wetland";
    } else if (coastalWetness > 0.44) {
      material = "coastal-wet-terrain";
    }

    return {
      contract: CONTRACT,
      generation: "G3.10-candidate",
      lon,
      lat,
      land,
      ocean,
      shallowWater,
      deepWater,
      abyssWater,
      coastalWetness,
      lake,
      lakeBasin: basin > 0.54 ? "terrain-bound-basin" : "none",
      riverCandidate,
      riverPath: riverCandidate > 0.42 ? "global-continuous-drainage-field" : "none",
      drainageCandidate,
      wetland,
      frozenStorage: clamp(Math.max(frozenStorage, terrainIce * 0.62), 0, 1),
      meltCandidate,
      saturation,
      surfaceCurrent,
      roughWater,
      material,
      hydrationContinuity: "global-solid-field",
      hemisphereSplit: false,
      panelMask: false,
      linearCut: false,
      g4Deferred: true,
      noClouds: true,
      noWeather: true,
      noClimate: true
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      owner: "/assets/hearth/hearth.hydration.js",
      generation: {
        previousCandidate: "G3.7/G3.8/G3.9",
        currentCandidate: "G3.10",
        focus: "solid global hydration field",
        g3Definition: "terrain hydration, ocean material, shelves, basins, drainage, frozen-water storage, saturation",
        g4Deferred: "clouds, weather, climate"
      },
      ticTacToe: TIC_TAC_TOE,
      quadA: QUAD_A,
      api: "window.HEARTH_HYDRATION.sample(lonDegrees, latDegrees, terrainSample)",
      owns: [
        "solid-global-hydration-field",
        "ocean-material",
        "shallow-water",
        "deep-water",
        "abyss-water",
        "coastal-wetness",
        "lake-basins",
        "river-candidates",
        "drainage-candidates",
        "wetlands",
        "frozen-water-storage",
        "melt-candidates",
        "water-saturation"
      ],
      removed: [
        "hemisphere-split",
        "panel-hydration",
        "straight-line-river-masks",
        "local path masks that can read as globe halves",
        "cut-plane hydration fields"
      ],
      continuityPolicy: "hydration is computed as one continuous longitude-wrapped global field over the whole planet",
      doesNotOwn: [
        "canvas-projection",
        "canvas-lighting",
        "route-shell",
        "clouds",
        "weather",
        "climate",
        "rainfall",
        "storms",
        "wind",
        "seasons",
        "atmosphere"
      ],
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      graphicBox: false
    });
  }

  window.HEARTH_HYDRATION = Object.freeze({
    contract: CONTRACT,
    version: VERSION,
    sample,
    receipt
  });

  document.documentElement.dataset.hearthHydrationLoaded = "true";
  document.documentElement.dataset.hearthHydrationContract = CONTRACT;
  document.documentElement.dataset.hearthHydrationVersion = VERSION;
  document.documentElement.dataset.hearthHydrationContinuity = "global-solid-field";
  document.documentElement.dataset.hearthHydrationHemisphereSplit = "false";
  document.documentElement.dataset.hearthHydrationPanelMask = "false";
})();
