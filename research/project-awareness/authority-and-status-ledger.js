import { createFact, deepFreeze } from "./project-awareness.contract.js";
import {
  BRANCH_IDENTITY,
  INSPECTED_COMMIT,
  INSPECTION_VERIFIED_AT,
  REPOSITORY_IDENTITY
} from "./repository-source-registry.js";

function provenance({
  evidencePosture = "DECLARED",
  sourcePath = null,
  blobSha = null,
  declaredBy = "PROJECT_AWARENESS_CONVERSION_CHECKPOINT",
  derivedFrom = null,
  verifiedAt = evidencePosture === "VERIFIED" ? INSPECTION_VERIFIED_AT : null,
  unresolvedReason = null
} = {}) {
  return {
    evidencePosture,
    repositoryIdentity: REPOSITORY_IDENTITY,
    inspectedCommit: INSPECTED_COMMIT,
    branchIdentity: BRANCH_IDENTITY,
    sourcePath,
    blobSha,
    declaredBy,
    derivedFrom,
    verifiedAt,
    unresolvedReason
  };
}

function fact(value, options = {}) {
  return createFact({ value, ...provenance(options) });
}

const AUTHORITY_DEFINITIONS = [
  ["UNIVERSAL_COMPASS_PLANET", "CANDIDATE_IMPLEMENTATION", "OWNS_IMMUTABLE_WORLD_TRUTH", "/prototypes/universal-compass/index.planet.js"],
  ["UNIVERSAL_COMPASS_CRYSTALS", "CANDIDATE_IMPLEMENTATION", "VISUAL_INTERPRETATION_OF_WORLD_TRUTH_ONLY", "/prototypes/universal-compass/index.crystals.js"],
  ["UNIVERSAL_COMPASS_COMPOSITOR", "CANDIDATE_IMPLEMENTATION", "OWNS_CAMERA_PROJECTION_OF_WORLD_AND_VISUAL_RECORDS", "/prototypes/universal-compass/index.compositor.js"],
  ["UNIVERSAL_COMPASS_CONTROLLER", "CANDIDATE_IMPLEMENTATION", "OWNS_TRANSACTION_STATE_AND_NAVIGATION_AUTHORITY", "/prototypes/universal-compass/index.controller.js"],
  ["UNIVERSAL_COMPASS_INTERACTIONS", "CANDIDATE_IMPLEMENTATION", "OWNS_POINTER_INPUT_AND_GESTURE_PROPOSALS_ONLY", "/prototypes/universal-compass/index.interactions.js"],
  ["UNIVERSAL_COMPASS_HTML", "CANDIDATE_IMPLEMENTATION", "PROVIDES_RUNTIME_MOUNTS_AND_SEMANTIC_CONTROLS", "/prototypes/universal-compass/index.html"],
  ["UNIVERSAL_COMPASS_CSS", "CANDIDATE_IMPLEMENTATION", "PRESENTS_PUBLISHED_STATE", "/prototypes/universal-compass/index.css"],
  ["PROJECT_AWARENESS_PACKAGE", "DERIVED_AWARENESS_RECORD", "DESCRIBES_VERIFIED_REPOSITORY_FACTS_WITHOUT_CREATING_AUTHORITY", "/research/project-awareness/"]
];

export const AUTHORITY_RECORDS = deepFreeze(
  AUTHORITY_DEFINITIONS.map(([artifactId, classification, scope, sourcePath]) => ({
    schema: "DGB_AUTHORITY_AND_STATUS_RECORD_v1",
    recordKind: "AUTHORITY_RECORD",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      artifactId: fact(artifactId, { sourcePath }),
      authorityClassification: fact(classification, { sourcePath }),
      authorityScope: fact(scope, { sourcePath }),
      awarenessRecordAuthorityClassification: fact("DERIVED_AWARENESS_RECORD", { sourcePath }),
      lifecycleStatus: fact("CANDIDATE", { sourcePath }),
      executable: fact(artifactId === "PROJECT_AWARENESS_PACKAGE", {
        sourcePath,
        derivedFrom: artifactId === "PROJECT_AWARENESS_PACKAGE" ? "VALIDATION_FIXTURE_EXECUTION" : null
      }),
      accepted: fact(false, { sourcePath }),
      productionAuthorized: fact(false, { sourcePath }),
      createsSourceAuthority: fact(false, { sourcePath })
    }
  }))
);

const UNRESOLVED_DEFINITIONS = [
  [
    "UNIVERSAL_COMPASS_CONTRACTS_SOURCE_RECOVERY",
    "What exact authoritative form of compass.contracts.js must be redistributed into the seven-file package?",
    ["SUPPORT_CODE_INTERNALIZATION", "FINAL_INTERFACE_LOCK"],
    ["REPOSITORY_HISTORY", "EXACT_BLOB_RECOVERY", "ESTABLISHED_ARTIFACT_RECORD"]
  ],
  [
    "UNIVERSAL_COMPASS_ADAPTERS_SOURCE_RECOVERY",
    "What exact authoritative form of compass.adapters.js must be redistributed into the seven-file package?",
    ["SUPPORT_CODE_INTERNALIZATION", "FINAL_INTERFACE_LOCK"],
    ["REPOSITORY_HISTORY", "EXACT_BLOB_RECOVERY", "ESTABLISHED_ARTIFACT_RECORD"]
  ],
  [
    "UNIVERSAL_COMPASS_REMAINING_IMPORTS_REDISTRIBUTION",
    "Which remaining imports require redistribution into the seven-file package?",
    ["SUPPORT_CODE_INTERNALIZATION", "RUNTIME_EXECUTABILITY"],
    ["STATIC_IMPORT_AUDIT", "REPOSITORY_HISTORY", "EXACT_BLOB_RECOVERY"]
  ],
  [
    "UNIVERSAL_COMPASS_SUPPORT_CODE_INTERNALIZATION",
    "Which support code must be internalized without creating an eighth runtime file?",
    ["FINAL_INTERFACE_LOCK", "RUNTIME_EXECUTABILITY"],
    ["STATIC_IMPORT_AUDIT", "COMPATIBILITY_FIXTURES", "ESTABLISHED_ARTIFACT_RECORD"]
  ],
  [
    "UNIVERSAL_COMPASS_FINAL_SCRIPT_LOADING_ORDER",
    "What is the final script loading order for the seven-file package?",
    ["BROWSER_EXECUTION", "RUNTIME_EXECUTABILITY"],
    ["HTML_SOURCE_AUDIT", "BROWSER_EXECUTION", "COMPATIBILITY_FIXTURES"]
  ],
  [
    "UNIVERSAL_COMPASS_FINAL_MODULE_INTERFACES",
    "What are the final interfaces among the seven package files?",
    ["FINAL_INTERFACE_LOCK", "COMPATIBILITY_COMPLETE"],
    ["SOURCE_AUDIT", "EXECUTED_FIXTURES", "ESTABLISHED_CONTRACT"]
  ],
  [
    "UNIVERSAL_COMPASS_CARDINAL_CLUSTER_CHILD_EXPANSION",
    "How will the 4-cardinal, 4-cluster, and 16-child expansion be implemented and validated?",
    ["COMPATIBILITY_COMPLETE", "VISUAL_ACCEPTANCE"],
    ["IMPLEMENTATION_CANDIDATE", "EXECUTED_FIXTURES", "BROWSER_EXECUTION"]
  ],
  [
    "UNIVERSAL_COMPASS_ZERO_ROUTE_RESIDUE_REMOVAL",
    "What zero-route residue remains and how will it be removed without changing authority boundaries?",
    ["COMPATIBILITY_COMPLETE", "BROWSER_EXECUTION"],
    ["SOURCE_AUDIT", "EXECUTED_FIXTURES", "BROWSER_EXECUTION"]
  ],
  [
    "UNIVERSAL_COMPASS_RUNTIME_EXECUTABILITY",
    "Is the seven-file Universal Compass package runtime executable?",
    ["PROTOTYPE_PASS", "BROWSER_EXECUTION"],
    ["EXECUTED_FIXTURES", "BROWSER_EXECUTION"]
  ],
  [
    "UNIVERSAL_COMPASS_FIXTURE_COMPATIBILITY",
    "Do all compatibility fixtures pass against the final seven-file package?",
    ["PROTOTYPE_PASS", "RUNTIME_EXECUTABILITY"],
    ["EXECUTED_FIXTURES"]
  ],
  [
    "UNIVERSAL_COMPASS_BROWSER_EXECUTION",
    "Does the seven-file package execute correctly in the target browser environment?",
    ["PROTOTYPE_PASS", "VISUAL_ACCEPTANCE"],
    ["BROWSER_EXECUTION", "EXECUTION_RECEIPT"]
  ],
  [
    "UNIVERSAL_COMPASS_VISUAL_ACCEPTANCE",
    "Has the rendered Universal Compass received visual acceptance?",
    ["PROTOTYPE_ACCEPTANCE"],
    ["VISUAL_REVIEW", "USER_ACCEPTANCE"]
  ]
];

export const UNRESOLVED_QUESTIONS = deepFreeze(
  UNRESOLVED_DEFINITIONS.map(([questionId, question, blocks, permittedResolutionMethods]) => ({
    schema: "DGB_UNRESOLVED_PROJECT_QUESTION_v1",
    recordKind: "UNRESOLVED_QUESTION",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      questionId: fact(questionId, { evidencePosture: "UNRESOLVED", unresolvedReason: "NO_ADMISSIBLE_RESOLUTION_EVIDENCE_IN_BASELINE" }),
      question: fact(question, { evidencePosture: "UNRESOLVED", unresolvedReason: "NO_ADMISSIBLE_RESOLUTION_EVIDENCE_IN_BASELINE" }),
      status: fact("UNRESOLVED", { evidencePosture: "UNRESOLVED", unresolvedReason: "NO_ADMISSIBLE_RESOLUTION_EVIDENCE_IN_BASELINE" }),
      evidencePosture: fact("UNRESOLVED", { evidencePosture: "UNRESOLVED", unresolvedReason: "NO_ADMISSIBLE_RESOLUTION_EVIDENCE_IN_BASELINE" }),
      blocks: fact(blocks, { evidencePosture: "UNRESOLVED", unresolvedReason: "BLOCKING_RELATIONS_DECLARED_BY_CONVERSION_CHECKPOINT" }),
      permittedResolutionMethods: fact(permittedResolutionMethods, { evidencePosture: "DECLARED" }),
      prohibitedResolutionMethods: fact(["ASSUMPTION", "UNSOURCED_RECONSTRUCTION"], { evidencePosture: "DECLARED" })
    }
  }))
);

export const SUPERSESSION_RELATIONS = deepFreeze([]);

export const PERMITTED_OPERATIONS = deepFreeze([
  "READ_REPOSITORY_OBJECTS",
  "VERIFY_BLOB_IDENTITIES",
  "BUILD_DERIVED_SNAPSHOT",
  "COMPARE_VERIFIED_SNAPSHOTS",
  "ANSWER_BOUNDED_PROJECT_QUERIES"
].map(value => fact(value)));

export const PROHIBITED_OPERATIONS = deepFreeze([
  "MUTATE_PROJECT_FILES",
  "MOVE_PROJECT_FILES",
  "DELETE_PROJECT_FILES",
  "CREATE_SOURCE_AUTHORITY",
  "PROMOTE_CANDIDATES",
  "RESOLVE_UNVERIFIED_FACTS_BY_INFERENCE",
  "EXECUTE_NAVIGATION",
  "AUTHORIZE_PRODUCT_CHANGES"
].map(value => fact(value)));

export const BASELINE_VALIDATION_RECEIPTS = deepFreeze([
  {
    schema: "DGB_PROJECT_AWARENESS_GROUNDING_RECEIPT_v1",
    recordKind: "VALIDATION_RECEIPT",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      receiptId: fact("PROJECT_AWARENESS_BASELINE_GROUNDING_RECEIPT_v1", { evidencePosture: "VERIFIED", verifiedAt: INSPECTION_VERIFIED_AT }),
      status: fact("PASS", { evidencePosture: "VERIFIED", verifiedAt: INSPECTION_VERIFIED_AT }),
      claim: fact("AWARENESS_BASELINE_IS_GROUNDED_IN_EXACT_COMMIT_PATH_AND_BLOB_EVIDENCE", { evidencePosture: "VERIFIED", verifiedAt: INSPECTION_VERIFIED_AT }),
      projectAwarenessContractPass: fact(true, { evidencePosture: "VERIFIED", verifiedAt: INSPECTION_VERIFIED_AT }),
      projectAwarenessRegistryPass: fact(true, { evidencePosture: "VERIFIED", verifiedAt: INSPECTION_VERIFIED_AT }),
      projectAwarenessSnapshotPass: fact(true, { evidencePosture: "VERIFIED", verifiedAt: INSPECTION_VERIFIED_AT }),
      prototypePass: fact(false),
      runtimePass: fact(false),
      productAuthority: fact(false),
      universalCompassExecutable: fact(false)
    }
  }
]);

export const AUTHORITY_AND_STATUS_LEDGER = deepFreeze({
  schema: "DGB_AUTHORITY_AND_STATUS_LEDGER_v1",
  authorityRecords: AUTHORITY_RECORDS,
  unresolvedQuestions: UNRESOLVED_QUESTIONS,
  supersessionRelations: SUPERSESSION_RELATIONS,
  permittedOperations: PERMITTED_OPERATIONS,
  prohibitedOperations: PROHIBITED_OPERATIONS,
  validationReceipts: BASELINE_VALIDATION_RECEIPTS
});