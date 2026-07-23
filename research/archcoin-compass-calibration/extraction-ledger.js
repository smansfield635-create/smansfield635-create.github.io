/*
 * ARCHCOIN Compass Calibration Workspace
 * Capability extraction ledger.
 * Entries remain candidates until source evidence and admission gates pass.
 */

export const ARCHCOIN_COMPASS_EXTRACTION_STATES = Object.freeze({
  IDENTIFIED: "IDENTIFIED",
  SOURCE_VERIFIED: "SOURCE_VERIFIED",
  EXTRACTED: "EXTRACTED",
  COMPATIBILITY_TESTED: "COMPATIBILITY_TESTED",
  ADMITTED: "ADMITTED",
  REJECTED: "REJECTED"
});

export const ARCHCOIN_COMPASS_EXTRACTION_LEDGER = Object.freeze({
  schema: "ARCHCOIN_COMPASS_EXTRACTION_LEDGER_v1",
  status: "INITIAL_CANDIDATE_LEDGER",
  chamber: "ARCHCOIN",
  referenceModelAuthority: "NOT_YET_ESTABLISHED",
  entries: Object.freeze([
    Object.freeze({
      capabilityId: "COMPASS_PHYSICS_AND_NAVIGATION_CORE",
      sourceFamily: "MAIN_COMPASS_SOURCE_FAMILY",
      candidateValue: "Preserve the strongest verified motion, navigation, cluster-capacity, and passage-custody mechanisms.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "FILE_LEVEL_BEHAVIOR_EXTRACTION",
        "DEPENDENCY_MAP",
        "CROSS_COMPASS_COMPATIBILITY_TEST"
      ])
    }),
    Object.freeze({
      capabilityId: "COMPASS_FLUID_AMBIENT_MOTION",
      sourceFamily: "LAW_COMPASS_SOURCE_FAMILY",
      candidateValue: "Recover fast, fluid, ambient constellation movement without importing Law-specific semantic identity.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "MOTION_PARAMETER_EXTRACTION",
        "RESPONSIBILITY_BOUNDARY_REVIEW",
        "REDUCED_MOTION_TEST"
      ])
    }),
    Object.freeze({
      capabilityId: "COMPASS_NARRATIVE_SCALE_AND_READABILITY",
      sourceFamily: "MIRRORLAND_COMPASS_SOURCE_FAMILY",
      candidateValue: "Recover the strongest verified scale, readability, and visual-presence methods as configurable presentation tools.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "GEOMETRY_AND_CSS_EXTRACTION",
        "MOBILE_READABILITY_TEST",
        "ACCESSIBILITY_REVIEW"
      ])
    }),
    Object.freeze({
      capabilityId: "COMPASS_LITERAL_CARDINAL_SEMANTICS",
      sourceFamily: "ARCHCOIN_SOURCE_FAMILY",
      candidateValue: "Preserve literal North, East, South, and West as a reusable semantic mode rather than a mandatory page identity.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([
        "/products/archcoin/index.controller.js",
        "/products/archcoin/index.html"
      ]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "SEMANTIC_MODE_ABSTRACTION",
        "ROUTE_ADAPTER_BOUNDARY"
      ])
    }),
    Object.freeze({
      capabilityId: "COMPASS_WORLD_VISUAL_PROJECTION_SEPARATION",
      sourceFamily: "ARCHCOIN_SOURCE_FAMILY",
      candidateValue: "Use separate world, visual interpretation, projection, controller, and interaction authorities when the compass contains a persistent world participant.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([
        "/products/archcoin/index.planet.js",
        "/products/archcoin/index.crystals.js",
        "/products/archcoin/index.compositor.js",
        "/products/archcoin/index.controller.js",
        "/products/archcoin/index.interactions.js"
      ]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "SEVEN_FILE_INTEGRATED_TEST",
        "GENERIC_INTERFACE_EXTRACTION",
        "NON_PLANET_COMPASS_COMPATIBILITY"
      ])
    })
  ])
});
