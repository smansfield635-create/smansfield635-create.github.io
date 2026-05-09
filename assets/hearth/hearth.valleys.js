// /assets/hearth/hearth.valleys.js
// HEARTH_G3_256_LATTICE_VALLEY_CHILD_ENGINE_TNT_v1
// New child engine.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Refine depressions, basins, valley corridors, lowlands, and between-range cuts.
// - Terrain remains parent admissibility.
// - No GraphicBox. No image generation.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_256_LATTICE_VALLEY_CHILD_ENGINE_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-256-lattice-valley-child-engine";
  const RECEIPT = "HEARTH_G3_256_LATTICE_VALLEY_CHILD_ENGINE_RECEIPT";

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function sampleTerrain(v) {
    const terrain = window.HEARTH_TERRAIN;
    if (!terrain || typeof terrain.sampleVector !== "function") return null;
    try {
      return terrain.sampleVector(v);
    } catch (_) {
      return null;
    }
  }

  function n(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }

  function sampleVector(v) {
    const parent = sampleTerrain(v);

    if (!parent || !parent.land) {
      return inactive(parent);
    }

    const valley = clamp(n(parent.valleyStrength), 0, 1.6);
    const depression = clamp(n(parent.depressionStrength), 0, 1.6);
    const basin = clamp(n(parent.basinInteriorStrength), 0, 1.6);
    const lowland = clamp(n(parent.lowland), 0, 1.6);
    const bay = clamp(n(parent.bayStrength), 0, 1.3);
    const inlet = clamp(n(parent.inletStrength), 0, 1.3);
    const mountain = clamp(n(parent.mountainStrength), 0, 1.6);
    const range = clamp(n(parent.rangeAscent), 0, 1.6);

    const valleyDepth = clamp(valley * 0.42 + depression * 0.32 + lowland * 0.24 + inlet * 0.12, 0, 1.6);
    const basinFloorStrength = clamp(basin * 0.48 + depression * 0.26 + valley * 0.18, 0, 1.5);
    const lowlandCorridor = clamp(lowland * 0.46 + valley * 0.28 + bay * 0.16, 0, 1.4);
    const betweenRangeCut = clamp(Math.min(mountain, range) * 0.25 + valley * 0.36 + depression * 0.18, 0, 1.4);
    const depressionDetail = clamp(depression * 0.44 + basinFloorStrength * 0.28 + lowlandCorridor * 0.20, 0, 1.6);
    const valleyShadow = clamp(valleyDepth * 0.20 + depressionDetail * 0.20, 0, 0.55);
    const valleySoftLight = clamp(lowlandCorridor * 0.10 + basinFloorStrength * 0.08, 0, 0.28);

    const active =
      valleyDepth > 0.08 ||
      basinFloorStrength > 0.08 ||
      lowlandCorridor > 0.10 ||
      betweenRangeCut > 0.08;

    return {
      active,
      parentAdmitted: true,
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      authority: "hearth-valley-child-engine",
      region: parent.region || null,
      countryId: parent.countryId || null,
      globalLandformSeat: parent.globalLandformSeat || null,
      landformSeat: parent.landformSeat || null,
      landformCategory: parent.landformCategory || null,
      dominantLandform: parent.dominantLandform || null,
      basinId: parent.basinId || null,
      bayId: parent.bayId || null,
      valleyDepth,
      basinFloorStrength,
      lowlandCorridor,
      betweenRangeCut,
      depressionDetail,
      valleyShadow,
      valleySoftLight,
      valleyColorBias: [
        Math.round(68 + valleySoftLight * 42),
        Math.round(98 + valleySoftLight * 48),
        Math.round(72 + valleySoftLight * 34)
      ],
      doesNotOwnTerrain: true
    };
  }

  function inactive(parent = null) {
    return {
      active: false,
      parentAdmitted: !!parent,
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      authority: "hearth-valley-child-engine",
      region: parent ? parent.region || null : null,
      countryId: parent ? parent.countryId || null : null,
      globalLandformSeat: parent ? parent.globalLandformSeat || null : null,
      valleyDepth: 0,
      basinFloorStrength: 0,
      lowlandCorridor: 0,
      betweenRangeCut: 0,
      depressionDetail: 0,
      valleyShadow: 0,
      valleySoftLight: 0,
      valleyColorBias: null,
      doesNotOwnTerrain: true
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      authority: "hearth-valley-child-engine",
      consumes: "HEARTH_TERRAIN.sampleVector(v)",
      owns: [
        "depressions",
        "basin floors",
        "valley corridors",
        "lowlands",
        "between-range cuts",
        "valley color and shadow detail"
      ],
      doesNotOwn: [
        "parent terrain field",
        "country assignment",
        "beaches",
        "sand",
        "islands",
        "active weather",
        "clouds",
        "humidity",
        "rivers",
        "lakes"
      ],
      geometry: "inherits parent 256 landform lattice"
    });
  }

  function dispose() {
    if (window.HEARTH_VALLEYS && window.HEARTH_VALLEYS.contract === CONTRACT) {
      try {
        delete window.HEARTH_VALLEYS;
      } catch (_) {
        window.HEARTH_VALLEYS = null;
      }
    }
  }

  window.HEARTH_VALLEYS = Object.freeze({
    receipt,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    authority: "hearth-valley-child-engine",
    sampleVector
  });

  window.__HEARTH_VALLEYS_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthValleysLoaded = "true";
  document.documentElement.dataset.hearthValleysContract = CONTRACT;
  document.documentElement.dataset.hearthValleysFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthValleysVersion = VERSION;
})();
