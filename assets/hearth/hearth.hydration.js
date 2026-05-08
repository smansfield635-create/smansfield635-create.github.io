// /assets/hearth/hearth.hydration.js
// HEARTH_G3_BOUNDARY_ALIGNMENT_HYDRATION_AUTHORITY_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Hydration is standardized but held passive.
// - It supports water/coast color only.
// - It does not reshape landmasses, countries, regions, or Summit zones.
// - No rivers, weather, climate, clouds, humidity, atmospheric moisture, rainfall, wind, storms, or seasons.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_HYDRATION_AUTHORITY_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-boundary-alignment-hydration-authority";
  const RECEIPT = "HEARTH_G3_BOUNDARY_ALIGNMENT_HYDRATION_RECEIPT";

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "Retire old G3.7 and G3.10 hydration contracts.",
    T2: "Hold hydration passive under G3 boundary standard.",
    T3: "Respect terrain land/water boundary.",
    T4: "Do not reshape regions or countries.",
    T5: "Do not add rivers.",
    T6: "Do not add mountains.",
    T7: "Do not add climate/weather/clouds/humidity.",
    T8: "Return ocean/coast color support only.",
    T9: "Expose deferred hydration receipt."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.hydration.js",
    axis: "Passive G3 water/coast support",
    artifact: "Ocean/coast color support without landmass reshaping",
    attack: "Reject hydration-first drift, global paneling, rivers, weather, climate, clouds, humidity, and map deformation."
  });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, clamp(t, 0, 1)));

  function dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function norm3(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  function wave(v) {
    return clamp(
      0.5 +
      Math.sin(v[0] * 7.3 + v[1] * 2.1 + v[2] * 5.7) * 0.09 +
      Math.cos(v[0] * 3.7 - v[1] * 4.8 + v[2] * 2.4) * 0.07,
      0,
      1
    );
  }

  function sampleVector(vec, terrainSample) {
    const v = norm3(vec);
    const terrain = terrainSample || {};
    const waterDepth = clamp(terrain.waterDepth || 0, 0, 1);
    const shelf = clamp(terrain.shelf || 0, 0, 1);
    const coast = clamp(terrain.coast || 0, 0, 1);
    const oceanWave = wave(v);

    if (terrain.land) {
      return {
        active: false,
        land: true,
        water: false,
        coast,
        shelf: 0,
        waterDepth: 0,
        passiveOnly: true,
        colorShift: {
          r: -4 * coast,
          g: 6 * coast,
          b: 8 * coast
        }
      };
    }

    let r = mix(14, 4, waterDepth);
    let g = mix(86, 44, waterDepth);
    let b = mix(130, 108, waterDepth);

    r = mix(r, 32, shelf * 0.74);
    g = mix(g, 155, shelf * 0.72);
    b = mix(b, 174, shelf * 0.70);

    r = mix(r, 34, coast * 0.16);
    g = mix(g, 168, coast * 0.20);
    b = mix(b, 184, coast * 0.18);

    r += (oceanWave - 0.5) * 4;
    g += (oceanWave - 0.5) * 5;
    b += (oceanWave - 0.5) * 6;

    const polarSoftness = Math.abs(dot3(v, [0, 1, 0]));

    return {
      active: false,
      land: false,
      water: true,
      coast,
      shelf,
      waterDepth,
      passiveOnly: true,
      oceanWave,
      polarSoftness,
      color: [
        clamp(r, 0, 255),
        clamp(g, 0, 255),
        clamp(b, 0, 255)
      ]
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "boundary-aligned-landmass-family",
      authority: "passive-water-coast-support-only",
      owns: [
        "ocean color support",
        "coast color support",
        "shelf color support"
      ],
      doesNotOwn: [
        "landmass shape",
        "regions",
        "countries",
        "Summit regions",
        "rivers",
        "mountains",
        "terrain detail",
        "weather",
        "climate",
        "clouds",
        "humidity",
        "atmospheric moisture"
      ],
      hydrationExpansionDeferred: true,
      ticTacToeDynamicProtocol: TIC_TAC_TOE_DYNAMIC_PROTOCOL,
      systemicQuadAAttack: SYSTEMIC_QUAD_A_ATTACK
    });
  }

  function dispose() {
    if (window.HEARTH_HYDRATION && window.HEARTH_HYDRATION.contract === CONTRACT) {
      try { delete window.HEARTH_HYDRATION; } catch (_) { window.HEARTH_HYDRATION = null; }
    }
  }

  window.HEARTH_HYDRATION = Object.freeze({
    receipt,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    standard: "boundary-aligned-passive-hydration",
    sampleVector
  });

  window.__HEARTH_HYDRATION_BOUNDARY_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthHydrationLoaded = "true";
  document.documentElement.dataset.hearthHydrationContract = CONTRACT;
  document.documentElement.dataset.hearthHydrationFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthHydrationVersion = VERSION;
  document.documentElement.dataset.hearthHydrationPassive = "true";
})();
