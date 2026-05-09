// /assets/hearth/hearth.cliffs.js
// HEARTH_G3_256_LATTICE_CLIFF_CHILD_ENGINE_TNT_v1
// New child engine.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Refine rigid borders, cliff coasts, escarpment faces, fracture edges, and bay/inlet hard breaks.
// - Terrain remains parent admissibility.
// - No GraphicBox. No image generation.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_256_LATTICE_CLIFF_CHILD_ENGINE_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-256-lattice-cliff-child-engine";
  const RECEIPT = "HEARTH_G3_256_LATTICE_CLIFF_CHILD_ENGINE_RECEIPT";

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

    const cliff = clamp(n(parent.cliffStrength), 0, 1.8);
    const rigid = clamp(n(parent.rigidBorderStrength), 0, 1.8);
    const fracture = clamp(n(parent.coastalFractureStrength), 0, 1.8);
    const escarpment = clamp(n(parent.escarpmentStrength), 0, 1.8);
    const bay = clamp(n(parent.bayStrength), 0, 1.4);
    const inlet = clamp(n(parent.inletStrength), 0, 1.4);
    const rock = clamp(n(parent.rockExposure), 0, 1.8);
    const coast = clamp(n(parent.coast), 0, 1.2);

    const cliffFaceStrength = clamp(cliff * 0.48 + rigid * 0.34 + fracture * 0.30 + rock * 0.20, 0, 1.8);
    const escarpmentFaceStrength = clamp(escarpment * 0.54 + cliff * 0.22 + rigid * 0.20, 0, 1.6);
    const coastalFractureDetail = clamp(fracture * 0.52 + coast * 0.22 + rigid * 0.18, 0, 1.6);
    const bayCutStrength = clamp(bay * 0.38 + inlet * 0.36 + cliffFaceStrength * 0.18, 0, 1.5);
    const rigidBorderDetail = clamp(rigid * 0.48 + cliffFaceStrength * 0.24 + coastalFractureDetail * 0.24, 0, 1.8);
    const cliffShadow = clamp(cliffFaceStrength * 0.28 + rigidBorderDetail * 0.20, 0, 0.78);
    const cliffHighlight = clamp(escarpmentFaceStrength * 0.11 + bayCutStrength * 0.08, 0, 0.35);

    const active =
      cliffFaceStrength > 0.08 ||
      escarpmentFaceStrength > 0.10 ||
      coastalFractureDetail > 0.10 ||
      bayCutStrength > 0.08;

    return {
      active,
      parentAdmitted: true,
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      authority: "hearth-cliff-child-engine",
      region: parent.region || null,
      countryId: parent.countryId || null,
      globalLandformSeat: parent.globalLandformSeat || null,
      landformSeat: parent.landformSeat || null,
      landformCategory: parent.landformCategory || null,
      dominantLandform: parent.dominantLandform || null,
      bayId: parent.bayId || null,
      inletStrength: parent.inletStrength || 0,
      escarpmentId: parent.escarpmentId || null,
      cliffFaceStrength,
      escarpmentFaceStrength,
      coastalFractureDetail,
      rigidBorderDetail,
      bayCutStrength,
      cliffShadow,
      cliffHighlight,
      cliffColorBias: [
        Math.round(46 + cliffHighlight * 36),
        Math.round(48 + cliffHighlight * 36),
        Math.round(48 + cliffHighlight * 32)
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
      authority: "hearth-cliff-child-engine",
      region: parent ? parent.region || null : null,
      countryId: parent ? parent.countryId || null : null,
      globalLandformSeat: parent ? parent.globalLandformSeat || null : null,
      cliffFaceStrength: 0,
      escarpmentFaceStrength: 0,
      coastalFractureDetail: 0,
      rigidBorderDetail: 0,
      bayCutStrength: 0,
      cliffShadow: 0,
      cliffHighlight: 0,
      cliffColorBias: null,
      doesNotOwnTerrain: true
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      authority: "hearth-cliff-child-engine",
      consumes: "HEARTH_TERRAIN.sampleVector(v)",
      owns: [
        "rigid borders",
        "cliff coasts",
        "escarpment faces",
        "fracture edges",
        "bay and inlet hard breaks",
        "cliff shadow and highlight detail"
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
    if (window.HEARTH_CLIFFS && window.HEARTH_CLIFFS.contract === CONTRACT) {
      try {
        delete window.HEARTH_CLIFFS;
      } catch (_) {
        window.HEARTH_CLIFFS = null;
      }
    }
  }

  window.HEARTH_CLIFFS = Object.freeze({
    receipt,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    authority: "hearth-cliff-child-engine",
    sampleVector
  });

  window.__HEARTH_CLIFFS_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthCliffsLoaded = "true";
  document.documentElement.dataset.hearthCliffsContract = CONTRACT;
  document.documentElement.dataset.hearthCliffsFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthCliffsVersion = VERSION;
})();
