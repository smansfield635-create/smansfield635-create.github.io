/*
 * Authority and lifecycle statements are maintained separately from file
 * existence. Every awareness record remains a derived, noncontrolling record.
 */

import {
  PROJECT_AWARENESS_CONTRACT,
  createRepositoryFact,
  deepFreeze
} from "./project-awareness.contract.js";
import {
  UNIVERSAL_COMPASS_PACKAGE_IDENTITY,
  UNIVERSAL_COMPASS_SHELL_RECORDS
} from "./repository-source-registry.js";

const LEDGER_DECLARATION =
  "DGB_PROJECT_AWARENESS_AUTHORITY_AND_STATUS_LEDGER_v1";

function declared(value, sourcePath, derivedFrom = null) {
  return createRepositoryFact(value, {
    evidencePosture: "DECLARED",
    sourcePath,
    declaredBy: LEDGER_DECLARATION,
    derivedFrom
  });
}

function unresolved(value, sourcePath, unresolvedReason, derivedFrom = null) {
  return createRepositoryFact(value, {
    evidencePosture: "UNRESOLVED",
    sourcePath,
    declaredBy: LEDGER_DECLARATION,
    derivedFrom,
    unresolvedReason
  });
}

function createArtifactAuthorityRecord({
  artifactId,
  sourcePath,
  authorityClassification,
  lifecycleStatus,
  executable,
  accepted,
  productionAuthorized,
  describedArtifactAuthority
}) {
  return deepFreeze({
    recordSchema: "DGB_PROJECT_AWARENESS_ARTIFACT_AUTHORITY_RECORD_v1",
    awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    artifactId: declared(artifactId, sourcePath),
    sourcePath: declared(sourcePath, sourcePath),
    authorityClassification: declared(
      authorityClassification,
      sourcePath,
      artifactId
    ),
    lifecycleStatus: declared(lifecycleStatus, sourcePath, artifactId),
    executable: declared(executable, sourcePath, artifactId),
    accepted: declared(accepted, sourcePath, artifactId),
    productionAuthorized: declared(
      productionAuthorized,
      sourcePath,
      artifactId
    ),
    describedArtifactAuthority: declared(
      describedArtifactAuthority,
      sourcePath,
      artifactId
    ),
    awarenessRecordCreatesAuthority: declared(
      false,
      "/research/project-awareness/authority-and-status-ledger.js",
      artifactId
    )
  });
}

export const ARTIFACT_AUTHORITY_RECORDS = deepFreeze([
  createArtifactAuthorityRecord({
    artifactId: UNIVERSAL_COMPASS_PACKAGE_IDENTITY.artifactId.value,
    sourcePath: UNIVERSAL_COMPASS_PACKAGE_IDENTITY.directory.value,
    authorityClassification: "CANDIDATE_IMPLEMENTATION",
    lifecycleStatus: "CANDIDATE",
    executable: false,
    accepted: false,
    productionAuthorized: false,
    describedArtifactAuthority: "CANDIDATE_PROTOTYPE"
  }),
  ...UNIVERSAL_COMPASS_SHELL_RECORDS.map(record =>
    createArtifactAuthorityRecord({
      artifactId: record.artifactId.value,
      sourcePath: record.path.value,
      authorityClassification: "CANDIDATE_IMPLEMENTATION",
      lifecycleStatus: record.lifecycleStatus.value,
      executable: record.executable.value,
      accepted: record.accepted.value,
      productionAuthorized: record.productAuthority.value,
      describedArtifactAuthority: record.role.value
    })
  ),
  createArtifactAuthorityRecord({
    artifactId: "DGB_PROJECT_AWARENESS_PACKAGE",
    sourcePath: "/research/project-awareness/",
    authorityClassification: "DERIVED_AWARENESS_RECORD",
    lifecycleStatus: "ACTIVE",
    executable: false,
    accepted: false,
    productionAuthorized: false,
    describedArtifactAuthority: "READ_ONLY_REPOSITORY_INTELLIGENCE"
  }),
  createArtifactAuthorityRecord({
    artifactId: "DGB_PROJECT_AWARENESS_VALIDATION_FIXTURES",
    sourcePath:
      "/research/project-awareness/awareness-validation.fixtures.js",
    authorityClassification: "VALIDATION_EVIDENCE",
    lifecycleStatus: "ACTIVE",
    executable: true,
    accepted: false,
    productionAuthorized: false,
    describedArtifactAuthority:
      "AWARENESS_INTERNAL_DETERMINISM_AND_GROUNDING_ONLY"
  })
]);

function createUnresolvedQuestion({
  questionId,
  question,
  blocks,
  permittedResolutionMethods,
  prohibitedResolutionMethods
}) {
  const sourcePath = "/prototypes/universal-compass/";
  const unresolvedReason =
    "Exact repository-backed resolution evidence has not yet been admitted.";

  return deepFreeze({
    recordSchema: "DGB_PROJECT_AWARENESS_UNRESOLVED_QUESTION_v1",
    awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    questionId: unresolved(questionId, sourcePath, unresolvedReason),
    question: unresolved(question, sourcePath, unresolvedReason),
    status: unresolved("UNRESOLVED", sourcePath, unresolvedReason),
    evidencePosture: unresolved(
      "UNRESOLVED",
      sourcePath,
      unresolvedReason
    ),
    blocks: unresolved(blocks, sourcePath, unresolvedReason),
    permittedResolutionMethods: unresolved(
      permittedResolutionMethods,
      sourcePath,
      unresolvedReason
    ),
    prohibitedResolutionMethods: unresolved(
      prohibitedResolutionMethods,
      sourcePath,
      unresolvedReason
    )
  });
}

const EXACT_RECOVERY_METHODS = deepFreeze([
  "REPOSITORY_HISTORY",
  "EXACT_BLOB_RECOVERY",
  "ESTABLISHED_ARTIFACT_RECORD"
]);

const EXECUTION_METHODS = deepFreeze([
  "EXACT_BLOB_RECOVERY",
  "SOURCE_INSPECTION",
  "DETERMINISTIC_FIXTURE_EXECUTION",
  "BROWSER_EXECUTION_RECEIPT"
]);

const PROHIBITED_RESOLUTION_METHODS = deepFreeze([
  "ASSUMPTION",
  "UNSOURCED_RECONSTRUCTION"
]);

export const UNRESOLVED_QUESTIONS = deepFreeze([
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_CONTRACTS_SOURCE_RECOVERY",
    question:
      "What exact authoritative form of compass.contracts.js must be redistributed into the seven-file package?",
    blocks: ["SUPPORT_CODE_INTERNALIZATION", "FINAL_INTERFACE_LOCK"],
    permittedResolutionMethods: EXACT_RECOVERY_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_ADAPTERS_SOURCE_RECOVERY",
    question:
      "What exact authoritative form of compass.adapters.js must be redistributed into the seven-file package?",
    blocks: ["SUPPORT_CODE_INTERNALIZATION", "RUNTIME_EXECUTABILITY"],
    permittedResolutionMethods: EXACT_RECOVERY_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_IMPORT_REDISTRIBUTION",
    question:
      "Which remaining imports require redistribution across the final seven files?",
    blocks: ["FINAL_SCRIPT_LOADING_ORDER", "RUNTIME_EXECUTABILITY"],
    permittedResolutionMethods: EXECUTION_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_SUPPORT_CODE_INTERNALIZATION",
    question:
      "Which support bodies must be internalized without creating an eighth runtime file?",
    blocks: ["FINAL_INTERFACE_LOCK", "RUNTIME_EXECUTABILITY"],
    permittedResolutionMethods: EXECUTION_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_FINAL_SCRIPT_LOADING_ORDER",
    question:
      "What is the final deterministic script loading order for the seven-file package?",
    blocks: ["BROWSER_EXECUTION", "RUNTIME_EXECUTABILITY"],
    permittedResolutionMethods: EXECUTION_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_FINAL_MODULE_INTERFACES",
    question:
      "What are the final compatible interfaces among the seven package files?",
    blocks: ["FIXTURE_COMPATIBILITY", "RUNTIME_EXECUTABILITY"],
    permittedResolutionMethods: EXECUTION_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_CARDINAL_CLUSTER_CHILD_EXPANSION",
    question:
      "How are 4 cardinals, 4 clusters, and 16 children represented without authority overlap?",
    blocks: ["FINAL_INTERFACE_LOCK", "VISUAL_ACCEPTANCE"],
    permittedResolutionMethods: [
      "ESTABLISHED_ARTIFACT_RECORD",
      "SOURCE_INSPECTION",
      "DETERMINISTIC_FIXTURE_EXECUTION"
    ],
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_ZERO_ROUTE_RESIDUE_REMOVAL",
    question:
      "What exact zero-route residue must be removed before compatibility can be claimed?",
    blocks: ["FIXTURE_COMPATIBILITY", "RUNTIME_EXECUTABILITY"],
    permittedResolutionMethods: EXECUTION_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_RUNTIME_EXECUTABILITY",
    question: "Does the final seven-file prototype execute as one runtime?",
    blocks: ["PROTOTYPE_PASS", "PRODUCT_AUTHORITY"],
    permittedResolutionMethods: EXECUTION_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_FIXTURE_COMPATIBILITY",
    question:
      "Do all retained and redistributed interfaces pass deterministic compatibility fixtures?",
    blocks: ["PROTOTYPE_PASS", "BROWSER_EXECUTION"],
    permittedResolutionMethods: EXECUTION_METHODS,
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_BROWSER_EXECUTION",
    question:
      "Does the prototype pass exact browser execution against the inspected package?",
    blocks: ["VISUAL_ACCEPTANCE", "PROTOTYPE_PASS"],
    permittedResolutionMethods: [
      "BROWSER_EXECUTION_RECEIPT",
      "EXACT_DEPLOYED_ARTIFACT_IDENTITY"
    ],
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  }),
  createUnresolvedQuestion({
    questionId: "UNIVERSAL_COMPASS_VISUAL_ACCEPTANCE",
    question:
      "Has the rendered Universal Compass received explicit visual acceptance?",
    blocks: ["ACCEPTANCE", "PRODUCT_AUTHORITY"],
    permittedResolutionMethods: [
      "BROWSER_EXECUTION_RECEIPT",
      "EXPLICIT_USER_ACCEPTANCE"
    ],
    prohibitedResolutionMethods: PROHIBITED_RESOLUTION_METHODS
  })
]);

export const AUTHORITY_AND_STATUS_LEDGER = deepFreeze({
  schema: "DGB_AUTHORITY_AND_STATUS_LEDGER_v1",
  awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
  canonicalAuthorityClassifications:
    PROJECT_AWARENESS_CONTRACT.authorityClassifications,
  canonicalLifecycleStatuses:
    PROJECT_AWARENESS_CONTRACT.lifecycleStatuses,
  artifactAuthorityRecords: ARTIFACT_AUTHORITY_RECORDS,
  unresolvedQuestions: UNRESOLVED_QUESTIONS
});

export function getArtifactAuthorityRecord(artifactId) {
  return (
    ARTIFACT_AUTHORITY_RECORDS.find(
      record => record.artifactId.value === artifactId
    ) || null
  );
}

export function getUnresolvedQuestion(questionId) {
  return (
    UNRESOLVED_QUESTIONS.find(
      record => record.questionId.value === questionId
    ) || null
  );
}
