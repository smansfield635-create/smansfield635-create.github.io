// /assets/hearth/hearth.mountains.js
// HEARTH_G3_256_LATTICE_MOUNTAIN_CHILD_ENGINE_TNT_v1
// New child engine.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Refine parent terrain mountain authority.
// - Terrain remains parent admissibility.
// - Mountains refine only admitted parent terrain samples.
// - No GraphicBox. No image generation. No route ownership.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_256_LATTICE_MOUNTAIN_CHILD_ENGINE_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-256-lattice-mountain-child-engine";
  const RECEIPT = "HEARTH_G3_256_LATTICE_MOUNTAIN_CHILD_ENGINE_RECEIPT";

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

    const mountainStrength = clamp(n(parent.mountainStrength), 0, 1.8);
    const rangeAscent = clamp(n(parent.rangeAscent), 0, 1.8);
    const ridge = clamp(n(parent.ridge), 0, 1.8);
    const summit = clamp(n(parent.summitStrength), 0, 1.8);
    const central = clamp(n(parent.centralMountainStrength), 0, 1.8);
    const rock = clamp(n(parent.rockExposure), 0, 1.8);
    const rigid = clamp(n(parent.rigidLandscapeStrength), 0, 1.8);

    const summitPressure = clamp(summit * 0.62 + central * 0.44 + mountainStrength * 0.28, 0, 1.8);
    const peakStrength = clamp(mountainStrength * 0.42 + rangeAscent * 0.36 + summitPressure * 0.34, 0, 1.8);
    const rangeContinuity = clamp(rangeAscent * 0.52 + ridge * 0.28 + rock * 0.16, 0, 1.6);
    const highElevationRock = clamp(peakStrength * 0.36 + rock * 0.34 + rigid * 0.22, 0, 1.7);
    const mountainShadow = clamp(highElevationRock * 0.22 + peakStrength * 0.12, 0, 0.55);
    const mountainHighlight = clamp(peakStrength * 0.20 + summitPressure * 0.26, 0, 0.72);

    const active = peakStrength > 0.08 || summitPressure > 0.08 || rangeContinuity > 0.10;

    return {
      active,
      parentAdmitted: true,
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      authority: "hearth-mountain-child-engine",
      region: parent.region || null,
      countryId: parent.countryId || null,
      globalLandformSeat: parent.globalLandformSeat || null,
      landformSeat: parent.landformSeat || null,
      landformCategory: parent.landformCategory || null,
      dominantLandform: parent.dominantLandform || null,
      mountainRangeId: parent.mountainRangeId || parent.spiralRangeId || null,
      centralMountainId: parent.centralMountainId || parent.masterMountainId || null,
      summitId: parent.summitId || null,
      peakStrength,
      summitPressure,
      highElevationRock,
      rangeContinuity,
      mountainShadow,
      mountainHighlight,
      mountainColorBias: [
        Math.round(218 + summitPressure * 28),
        Math.round(208 + summitPressure * 22),
        Math.round(174 + summitPressure * 20)
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
      authority: "hearth-mountain-child-engine",
      region: parent ? parent.region || null : null,
      countryId: parent ? parent.countryId || null : null,
      globalLandformSeat: parent ? parent.globalLandformSeat || null : null,
      peakStrength: 0,
      summitPressure: 0,
      highElevationRock: 0,
      rangeContinuity: 0,
      mountainShadow: 0,
      mountainHighlight: 0,
      mountainColorBias: null,
      doesNotOwnTerrain: true
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      authority: "hearth-mountain-child-engine",
      consumes: "HEARTH_TERRAIN.sampleVector(v)",
      owns: [
        "mountain ranges",
        "central/final mountain refinement",
        "summit pressure",
        "peak systems",
        "high rocky elevation",
        "mountain highlights and shadows"
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
    if (window.HEARTH_MOUNTAINS && window.HEARTH_MOUNTAINS.contract === CONTRACT) {
      try {
        delete window.HEARTH_MOUNTAINS;
      } catch (_) {
        window.HEARTH_MOUNTAINS = null;
      }
    }
  }

  window.HEARTH_MOUNTAINS = Object.freeze({
    receipt,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    authority: "hearth-mountain-child-engine",
    sampleVector
  });

  window.__HEARTH_MOUNTAINS_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthMountainsLoaded = "true";
  document.documentElement.dataset.hearthMountainsContract = CONTRACT;
  document.documentElement.dataset.hearthMountainsFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthMountainsVersion = VERSION;
})();
