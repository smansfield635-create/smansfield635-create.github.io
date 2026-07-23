/*
 * ARCHCOIN Compass Calibration Workspace
 * Cross-source extraction ledger.
 * Detailed evidence remains in each source-family extraction artifact.
 * No admission, production, or live ARCHCOIN mutation authority.
 */

import {
  ARCHCOIN_MAIN_COMPASS_EXTRACTION
} from "./main-compass-extraction.js";

import {
  ARCHCOIN_LAW_COMPASS_EXTRACTION
} from "./law-compass-extraction.js";

import {
  ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION
} from "./showroom-compass-extraction.js";

export const ARCHCOIN_COMPASS_EXTRACTION_STATES = Object.freeze({
  IDENTIFIED: "IDENTIFIED",
  SOURCE_VERIFIED: "SOURCE_VERIFIED",
  EXTRACTED: "EXTRACTED",
  COMPATIBILITY_TESTED: "COMPATIBILITY_TESTED",
  ADMITTED: "ADMITTED",
  REJECTED: "REJECTED"
});

export const ARCHCOIN_COMPASS_EXTRACTION_LEDGER = Object.freeze({
  schema: "ARCHCOIN_COMPASS_EXTRACTION_LEDGER_v3",
  status: "MAIN_LAW_AND_SHOWROOM_FILE_LEVEL_EXTRACTIONS_COMPLETE",
  chamber: "ARCHCOIN",
  referenceModelAuthority: "NOT_YET_ESTABLISHED",
  admittedStandardCount: 0,
  liveProductMutationAuthorized: false,

  sourceFamilyStatus: Object.freeze({
    MAIN_COMPASS_SOURCE_FAMILY: "FILE_LEVEL_EXTRACTION_COMPLETE",
    LAW_COMPASS_SOURCE_FAMILY: "FILE_LEVEL_EXTRACTION_COMPLETE",
    SHOWROOM_COMPASS_SOURCE_FAMILY: "FILE_LEVEL_AND_OWNERSHIP_EXTRACTION_COMPLETE",
    ARCHCOIN_SOURCE_FAMILY: "PENDING_COMPLETE_BASELINE_EXTRACTION"
  }),

  entries: Object.freeze([
    Object.freeze({
      capabilityId: "COMPASS_PHYSICS_NAVIGATION_AND_PASSAGE_CUSTODY",
      sourceFamily: "MAIN_COMPASS_SOURCE_FAMILY",
      state: ARCHCOIN_COMPASS_EXTRACTION_STATES.EXTRACTED,
      extractionArtifact:
        "/research/archcoin-compass-calibration/main-compass-extraction.js",
      extractionSchema: ARCHCOIN_MAIN_COMPASS_EXTRACTION.schema,
      extractionStatus: ARCHCOIN_MAIN_COMPASS_EXTRACTION.status,
      evidenceBase: ARCHCOIN_MAIN_COMPASS_EXTRACTION.evidenceBase,
      extractedCapabilityIds: Object.freeze(
        ARCHCOIN_MAIN_COMPASS_EXTRACTION.extractedCapabilities.map(
          capability => capability.capabilityId
        )
      ),
      admissionState: "EXTRACTED_NOT_ADMITTED",
      admissionBlockedBy: ARCHCOIN_MAIN_COMPASS_EXTRACTION.admissionBlockedBy
    }),

    Object.freeze({
      capabilityId: "COMPASS_FLUID_MOTION_INTERACTION_AND_HIT_CORRIDORS",
      sourceFamily: "LAW_COMPASS_SOURCE_FAMILY",
      state: ARCHCOIN_COMPASS_EXTRACTION_STATES.EXTRACTED,
      extractionArtifact:
        "/research/archcoin-compass-calibration/law-compass-extraction.js",
      extractionSchema: ARCHCOIN_LAW_COMPASS_EXTRACTION.schema,
      extractionStatus: ARCHCOIN_LAW_COMPASS_EXTRACTION.status,
      evidenceBase: ARCHCOIN_LAW_COMPASS_EXTRACTION.evidenceBase,
      evidencePaths: Object.freeze([
        "/laws/index.controller.js",
        "/laws/index.interactions.js",
        "/laws/index.crystals.js",
        "/laws/index.compositor.js",
        "/laws/index.js",
        "/laws/index.html",
        "/laws/index.css"
      ]),
      extractedCapabilityIds: Object.freeze(
        ARCHCOIN_LAW_COMPASS_EXTRACTION.extractedCapabilities.map(
          capability => capability.capabilityId
        )
      ),
      admissionState: ARCHCOIN_LAW_COMPASS_EXTRACTION.admissionState,
      admissionBlockedBy: ARCHCOIN_LAW_COMPASS_EXTRACTION.admissionBlockedBy
    }),

    Object.freeze({
      capabilityId: "COMPASS_PUBLIC_STAGE_SCALE_SCENE_AND_READABILITY",
      sourceFamily: "SHOWROOM_COMPASS_SOURCE_FAMILY",
      state: ARCHCOIN_COMPASS_EXTRACTION_STATES.EXTRACTED,
      extractionArtifact:
        "/research/archcoin-compass-calibration/showroom-compass-extraction.js",
      extractionSchema: ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION.schema,
      extractionStatus: ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION.status,
      evidenceBase: ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION.evidenceBase,
      evidencePaths: Object.freeze(
        Object.values(ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION.sourceFiles)
          .map(source => source.path)
      ),
      extractedCapabilityIds: Object.freeze(
        ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION.extractedCapabilities.map(
          capability => capability.capabilityId
        )
      ),
      admissionState: "EXTRACTED_NOT_ADMITTED",
      admissionBlockedBy:
        ARCHCOIN_SHOWROOM_COMPASS_EXTRACTION.admissionBlockedBy
    }),

    Object.freeze({
      capabilityId: "COMPASS_ARCHCOIN_CALIBRATION_PROFILE",
      sourceFamily: "ARCHCOIN_SOURCE_FAMILY",
      state: ARCHCOIN_COMPASS_EXTRACTION_STATES.IDENTIFIED,
      extractionArtifact:
        "/research/archcoin-compass-calibration/archcoin-compass-extraction.js",
      targetCapabilities: Object.freeze([
        "LITERAL_CARDINAL_SEMANTICS",
        "CURRENT_CLUSTER_BEHAVIOR",
        "CENTER_AUTHORITY",
        "LABELS",
        "FIXED_AXIS_DEFICIENCIES",
        "SELECTION_PROBLEMS",
        "PRESERVED_SUCCESSFUL_BEHAVIOR"
      ]),
      admissionState: "NOT_EVALUATED"
    })
  ]),

  nextRequiredStage: "ARCHCOIN_COMPLETE_BASELINE_EXTRACTION",

  universalAdmissionGate: Object.freeze({
    allFourSourceFamiliesExtracted: false,
    crossCompassMatrixComplete: false,
    conflictLedgerComplete: false,
    universalStandardCandidateComplete: false,
    archcoinCompatibilityProfileComplete: false,
    admissionDecisionsExplicit: false
  })
});
