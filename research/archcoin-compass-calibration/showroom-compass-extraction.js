export const ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION = Object.freeze({
  schema: "ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION_v1",
  status: "EXTRACTION_PENDING",
  sourceFamily: "SHOWROOM_COMPASS_SOURCE_FAMILY",
  sourceRoots: Object.freeze([
    "/showroom/",
    "/assets/compass/compass.mirrorland-window.js",
    "/assets/shared/mirrorland-window.geometry.js"
  ]),
  targetCapabilities: Object.freeze([
    "PUBLIC_STAGE_SCALE",
    "CAMERA_BEHAVIOR",
    "SCENE_INTEGRATION",
    "READABILITY",
    "PRESENTATION_BEHAVIOR"
  ]),
  evidence: Object.freeze([]),
  extractedCapabilities: Object.freeze([]),
  optionalCapabilityCandidates: Object.freeze([
    "MIRRORLAND_PASSAGE",
    "NARRATIVE_PRESENTATION"
  ]),
  conflictsAndLimits: Object.freeze([]),
  admissionState: "NOT_EVALUATED",
  productionAuthority: false
});
