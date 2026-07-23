/* ARCHCOIN cross-compass calibration source registry. Research authority only. */

export const ARCHCOIN_COMPASS_CALIBRATION_SOURCE_REGISTRY = Object.freeze({
  schema: "ARCHCOIN_COMPASS_CALIBRATION_SOURCE_REGISTRY_v4",
  repositoryBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  status: "MAIN_LAW_AND_SHOWROOM_COMPLETE_ARCHCOIN_PENDING",
  liveProductMutationAuthorized: false,
  rcoinIdentityVerified: false,
  rcoinTreatment: "TREAT_AS_ARCHCOIN_UNLESS_DISTINCT_ROUTE_OR_SOURCE_IS_ESTABLISHED",
  sources: Object.freeze([
    Object.freeze({
      sourceId: "MAIN_COMPASS_SOURCE_FAMILY",
      label: "Main Compass",
      roots: Object.freeze(["/assets/compass/", "/index.html"]),
      extractionArtifact: "/research/archcoin-compass-calibration/main-compass-extraction.js",
      extractionStatus: "FILE_LEVEL_EXTRACTION_COMPLETE",
      targetCapabilities: Object.freeze([
        "PHYSICS", "NAVIGATION", "SELECTION", "SETTLEMENT",
        "INTERRUPTION_RECOVERY", "PASSAGE_CUSTODY"
      ]),
      admissionAuthority: "WITHHELD"
    }),
    Object.freeze({
      sourceId: "LAW_COMPASS_SOURCE_FAMILY",
      label: "Law Compass",
      roots: Object.freeze(["/laws/"]),
      sourcePaths: Object.freeze([
        "/laws/index.controller.js",
        "/laws/index.interactions.js",
        "/laws/index.crystals.js",
        "/laws/index.compositor.js",
        "/laws/index.js",
        "/laws/index.html",
        "/laws/index.css"
      ]),
      extractionArtifact: "/research/archcoin-compass-calibration/law-compass-extraction.js",
      extractionStatus: "FILE_LEVEL_EXTRACTION_COMPLETE",
      targetCapabilities: Object.freeze([
        "FLUID_MOTION", "INTERACTION_SENSITIVITY", "INTERPOLATION",
        "HIT_CORRIDORS", "RESPONSIBILITY_SEPARATION",
        "LIGHTWEIGHT_AMBIENT_RUNTIME"
      ]),
      admissionAuthority: "WITHHELD"
    }),
    Object.freeze({
      sourceId: "SHOWROOM_COMPASS_SOURCE_FAMILY",
      label: "Showroom Compass",
      roots: Object.freeze(["/showroom/"]),
      sourcePaths: Object.freeze([
        "/showroom/index.controller.js",
        "/showroom/index.compositor.js",
        "/showroom/index.planet.js",
        "/showroom/index.crystals.js",
        "/showroom/index.interaction.gestures.js",
        "/showroom/index.interactions.js",
        "/showroom/index.cosmos.js",
        "/showroom/index.object-stage.js",
        "/showroom/index.window.definition.js",
        "/showroom/index.window.controller.js",
        "/showroom/index.window.js",
        "/showroom/index.diamond.geometry.js",
        "/showroom/index.diamond.js",
        "/showroom/index.ui.js",
        "/showroom/index.html",
        "/showroom/index.css"
      ]),
      sharedGeometryDependency: "/assets/audralia/audralia.planet.js",
      sharedGeometryGlobal: "DGBAudraliaPlanetGeometry",
      extractionArtifact: "/research/archcoin-compass-calibration/showroom-compass-extraction.js",
      extractionStatus: "FILE_LEVEL_AND_OWNERSHIP_EXTRACTION_COMPLETE",
      targetCapabilities: Object.freeze([
        "PUBLIC_STAGE_SCALE", "CAMERA_BEHAVIOR", "SCENE_INTEGRATION",
        "READABILITY", "PRESENTATION_BEHAVIOR",
        "SEMANTIC_FALLBACK", "INDEPENDENT_CENTER_WORLD",
        "AUXILIARY_STAGE_AUTHORITY_SEPARATION"
      ]),
      admissionAuthority: "WITHHELD"
    }),
    Object.freeze({
      sourceId: "ARCHCOIN_SOURCE_FAMILY",
      label: "ARCHCOIN Compass",
      roots: Object.freeze(["/products/archcoin/"]),
      extractionArtifact: "/research/archcoin-compass-calibration/archcoin-compass-extraction.js",
      extractionStatus: "PENDING_COMPLETE_BASELINE_EXTRACTION",
      targetCapabilities: Object.freeze([
        "LITERAL_CARDINAL_SEMANTICS", "CURRENT_CLUSTER_BEHAVIOR",
        "CENTER_AUTHORITY", "LABELS", "FIXED_AXIS_DEFICIENCIES",
        "SELECTION_PROBLEMS", "PRESERVED_SUCCESSFUL_BEHAVIOR"
      ]),
      admissionAuthority: "WITHHELD"
    })
  ])
});
