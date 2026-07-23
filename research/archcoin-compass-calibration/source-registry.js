/*
 * ARCHCOIN Compass Calibration Workspace
 * Source registry only.
 * No production or automatic inheritance authority.
 */

export const ARCHCOIN_COMPASS_CALIBRATION_SOURCE_REGISTRY = Object.freeze({
  schema: "ARCHCOIN_COMPASS_CALIBRATION_SOURCE_REGISTRY_v1",
  status: "INITIAL_SOURCE_FAMILY_REGISTRY",
  repositoryBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  liveProductMutationAuthorized: false,
  sources: Object.freeze([
    Object.freeze({
      sourceId: "MAIN_COMPASS_SOURCE_FAMILY",
      label: "Main Compass",
      paths: Object.freeze([
        "/assets/compass/compass.controller.js",
        "/assets/compass/compass.crystals.js",
        "/assets/compass/compass.cosmos.js",
        "/assets/compass/compass.css"
      ]),
      inspectionStatus: "PARTIALLY_INSPECTED",
      candidateStrengthsFromPriorInspection: Object.freeze([
        "physics",
        "navigation",
        "cluster-capacity",
        "passage-custody"
      ]),
      extractionAuthority: "WITHHELD_PENDING_FILE_LEVEL_EVIDENCE"
    }),
    Object.freeze({
      sourceId: "LAW_COMPASS_SOURCE_FAMILY",
      label: "Law Compass",
      paths: Object.freeze([
        "/laws/index.controller.js",
        "/laws/index.crystals.js",
        "/laws/index.compositor.js",
        "/laws/index.interactions.js",
        "/laws/index.html",
        "/laws/index.css"
      ]),
      inspectionStatus: "PARTIALLY_INSPECTED",
      candidateStrengthsFromPriorInspection: Object.freeze([
        "speed",
        "fluidity",
        "ambient-constellation-motion"
      ]),
      extractionAuthority: "WITHHELD_PENDING_FILE_LEVEL_EVIDENCE"
    }),
    Object.freeze({
      sourceId: "MIRRORLAND_COMPASS_SOURCE_FAMILY",
      label: "Mirrorland-related Compass surfaces",
      paths: Object.freeze([
        "/assets/compass/compass.mirrorland-window.js",
        "/assets/shared/mirrorland-window.geometry.js"
      ]),
      inspectionStatus: "PARTIALLY_INSPECTED",
      candidateStrengthsFromPriorInspection: Object.freeze([
        "narrative-scale",
        "readability",
        "visual-presence"
      ]),
      extractionAuthority: "WITHHELD_PENDING_FILE_LEVEL_EVIDENCE"
    }),
    Object.freeze({
      sourceId: "ARCHCOIN_SOURCE_FAMILY",
      label: "ARCHCOIN",
      paths: Object.freeze([
        "/products/archcoin/index.planet.js",
        "/products/archcoin/index.crystals.js",
        "/products/archcoin/index.compositor.js",
        "/products/archcoin/index.controller.js",
        "/products/archcoin/index.interactions.js",
        "/products/archcoin/index.html",
        "/products/archcoin/index.css"
      ]),
      inspectionStatus: "ACTIVE_CALIBRATION_CHAMBER",
      candidateStrengthsFromPriorInspection: Object.freeze([
        "literal-cardinal-navigation",
        "seven-file-authority-separation",
        "planet-world-authority-candidate"
      ]),
      extractionAuthority: "CALIBRATION_ONLY"
    })
  ])
});
