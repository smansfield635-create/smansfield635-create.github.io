// /assets/audralia/audralia.backstory.js
// AUDRALIA_PARENT_BACKSTORY_AUTHORITY_TNT_v1
// New file.
// Purpose:
// - Bind Audralia as its own home-world planet identity.
// - Clean, ancient, ocean-driven, climate-bearing, breathable world.
// - Not Hearth. Not Earth clone. Not a real-world geography copy.
// - This file owns identity constraints only.
// - It does not render, mount, draw, control, or mutate route/canvas/runtime.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PARENT_BACKSTORY_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_PARENT_BACKSTORY_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.audralia-parent-backstory-v1";

  const IDENTITY = Object.freeze({
    name: "Audralia",
    role: "first-home-world-planetary-expression",
    planetType: "clean-ancient-ocean-driven-home-world",
    oceanDominant: true,
    climateBearing: true,
    breathable: true,
    healthyAtmosphere: true,
    industrialToxicity: false,
    literalEarthClone: false,
    hearthIdentity: false,
    realWorldGeographyCopy: false,
    vegetationTopologyHeld: true,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });

  const DESIGN_LAW = Object.freeze({
    surfaceLaw: "ocean-first-weathered-land",
    landLaw: "ancient-exposed-terrain-not-symbol-map",
    climateLaw: "clean-water-driven-climate",
    topologyLaw: "above-sea-and-below-sea-structure-both-matter",
    tectonicLaw: "old-weathered-plate-memory-not-young-sharp-chaos",
    hydrologyLaw: "water-depth-shelf-basin-and-drainage-drive-readability",
    visualLaw: "natural-planet-before-ecology-decoration"
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sampleIdentity(u, v, context = {}) {
    const latitude = Number.isFinite(context.latitude) ? context.latitude : (0.5 - v) * Math.PI;
    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);
    const oceanBias = clamp(0.68 + latitudeAbs * 0.08, 0, 1);
    const weatheredAge = 1;
    const cleanClimate = 1;
    const homeWorldSignal = clamp(0.75 + (1 - latitudeAbs) * 0.18, 0, 1);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      name: IDENTITY.name,
      oceanBias,
      weatheredAge,
      cleanClimate,
      homeWorldSignal,
      ancientWorldPressure: true,
      oceanDrivenRead: true,
      climateBearingRead: true,
      literalEarthClone: false,
      hearthIdentity: false,
      realWorldGeographyCopy: false,
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
      authority: "audralia-backstory-parent",
      identity: IDENTITY,
      designLaw: DESIGN_LAW,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsMaterial: false,
      ownsTerrain: false,
      ownsHydrology: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_BACKSTORY = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    identity: IDENTITY,
    designLaw: DESIGN_LAW,
    sampleIdentity,
    getStatus
  });

  window.AUDRALIA_BACKSTORY_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaBackstoryLoaded = "true";
  document.documentElement.dataset.audraliaBackstoryContract = CONTRACT;
  document.documentElement.dataset.audraliaBackstoryReceipt = RECEIPT;
  document.documentElement.dataset.audraliaOceanDrivenHomeWorld = "true";
  document.documentElement.dataset.audraliaGeneratedImage = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
