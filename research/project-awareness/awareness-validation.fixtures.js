import {
  PROJECT_AWARENESS_CONTRACT,
  PROJECT_AWARENESS_QUERY_IDS,
  assertCanonicalFact,
  createProjectAwarenessSnapshot,
  deepFreeze,
  factValue,
  queryProjectAwarenessSnapshot,
  snapshotDigestIsValid,
  stableStringify
} from "./project-awareness.contract.js";
import {
  ARTIFACT_RECORDS,
  PROJECT_AWARENESS_PACKAGE_RECORD,
  REPOSITORY_INSPECTION,
  UNIVERSAL_COMPASS_SHELL_RECORDS
} from "./repository-source-registry.js";
import {
  AUTHORITY_RECORDS,
  BASELINE_VALIDATION_RECEIPTS,
  PERMITTED_OPERATIONS,
  PROHIBITED_OPERATIONS,
  SUPERSESSION_RELATIONS,
  UNRESOLVED_QUESTIONS
} from "./authority-and-status-ledger.js";
import {
  DEPENDENCY_RELATIONS,
  PROJECT_AWARENESS_SNAPSHOT
} from "./dependency-graph.snapshot.js";

function recordFact(record, key) {
  return factValue(record.facts[key], key);
}

function assert(condition, code, details = null) {
  if (!condition) {
    const error = new Error(code);
    error.details = details;
    throw error;
  }
}

function validateFactMap(record) {
  assert(record.recordAuthorityClassification === "DERIVED_AWARENESS_RECORD", "AWARENESS_RECORD_AUTHORITY_INVALID", record);
  for (const [key, candidate] of Object.entries(record.facts)) {
    assertCanonicalFact(candidate, key);
  }
}

function buildFreshSnapshot() {
  return createProjectAwarenessSnapshot({
    repositoryInspection: REPOSITORY_INSPECTION,
    sourceRecords: UNIVERSAL_COMPASS_SHELL_RECORDS,
    artifactRecords: ARTIFACT_RECORDS,
    authorityRecords: AUTHORITY_RECORDS,
    dependencyRelations: DEPENDENCY_RELATIONS,
    supersessionRelations: SUPERSESSION_RELATIONS,
    validationReceipts: BASELINE_VALIDATION_RECEIPTS,
    unresolvedQuestions: UNRESOLVED_QUESTIONS,
    permittedOperations: PERMITTED_OPERATIONS,
    prohibitedOperations: PROHIBITED_OPERATIONS
  });
}

export function runAwarenessValidationFixtures() {
  const assertions = [];
  const verify = (id, operation) => {
    operation();
    assertions.push(deepFreeze({ id, pass: true }));
  };

  verify("CONTRACT_IS_READ_ONLY", () => {
    assert(PROJECT_AWARENESS_CONTRACT.mode === "READ_ONLY", "CONTRACT_MODE_INVALID");
    assert(PROJECT_AWARENESS_CONTRACT.createsAuthority === false, "CONTRACT_CREATES_AUTHORITY");
    assert(PROJECT_AWARENESS_CONTRACT.permitsMutation === false, "CONTRACT_PERMITS_MUTATION");
    assert(PROJECT_AWARENESS_CONTRACT.permitsInferenceOfMissingFacts === false, "CONTRACT_PERMITS_INFERENCE");
  });

  verify("SAME_COMMIT_AND_REGISTRY_PRODUCE_SAME_SNAPSHOT", () => {
    const first = buildFreshSnapshot();
    const second = buildFreshSnapshot();
    assert(stableStringify(first) === stableStringify(second), "SNAPSHOT_NONDETERMINISTIC");
    assert(factValue(first.deterministicDigest) === factValue(second.deterministicDigest), "SNAPSHOT_DIGEST_NONDETERMINISTIC");
    assert(snapshotDigestIsValid(first), "SNAPSHOT_DIGEST_INVALID");
  });

  verify("EVERY_ARTIFACT_PATH_RESOLVES_AT_INSPECTED_COMMIT", () => {
    for (const record of UNIVERSAL_COMPASS_SHELL_RECORDS) {
      assert(recordFact(record, "pathResolvedAtCommit") === true, "SOURCE_PATH_NOT_RESOLVED", recordFact(record, "path"));
    }
  });

  verify("EVERY_VERIFIED_BLOB_MATCHES_REGISTRY", () => {
    for (const record of UNIVERSAL_COMPASS_SHELL_RECORDS) {
      assert(recordFact(record, "blobSha") === recordFact(record, "observedBlobSha"), "TARGET_BLOB_MISMATCH", recordFact(record, "path"));
      assert(recordFact(record, "sourceBlobSha") === recordFact(record, "blobSha"), "SOURCE_TARGET_BLOB_MISMATCH", recordFact(record, "path"));
      assert(recordFact(record, "blobMatchedRegistry") === true, "REGISTRY_BLOB_NOT_VERIFIED", recordFact(record, "path"));
    }
  });

  verify("EVERY_DEPENDENCY_ENDPOINT_RESOLVES", () => {
    const artifactIds = new Set(ARTIFACT_RECORDS.map(record => recordFact(record, "artifactId")));
    for (const edge of DEPENDENCY_RELATIONS) {
      assert(artifactIds.has(recordFact(edge, "fromArtifactId")), "DEPENDENCY_FROM_ENDPOINT_MISSING", recordFact(edge, "fromArtifactId"));
      assert(artifactIds.has(recordFact(edge, "toArtifactId")), "DEPENDENCY_TO_ENDPOINT_MISSING", recordFact(edge, "toArtifactId"));
    }
  });

  verify("EVERY_AUTHORITY_CLAIM_HAS_PROVENANCE", () => {
    for (const record of AUTHORITY_RECORDS) {
      validateFactMap(record);
      const authorityFact = record.facts.authorityClassification;
      assert(authorityFact.declaredBy !== null, "AUTHORITY_DECLARATION_SOURCE_MISSING", recordFact(record, "artifactId"));
      assert(authorityFact.inspectedCommit !== null, "AUTHORITY_COMMIT_MISSING", recordFact(record, "artifactId"));
    }
  });

  verify("EVERY_LIFECYCLE_STATUS_IS_CANONICAL", () => {
    for (const record of ARTIFACT_RECORDS) {
      const status = recordFact(record, "lifecycleStatus");
      assert(PROJECT_AWARENESS_CONTRACT.lifecycleStatuses.includes(status), "LIFECYCLE_STATUS_INVALID", status);
    }
  });

  verify("EVERY_SUPERSESSION_EDGE_NAMES_BOTH_ARTIFACTS", () => {
    for (const relation of SUPERSESSION_RELATIONS) {
      assert(Boolean(recordFact(relation, "fromArtifactId")), "SUPERSESSION_FROM_MISSING");
      assert(Boolean(recordFact(relation, "toArtifactId")), "SUPERSESSION_TO_MISSING");
    }
  });

  verify("EVERY_UNRESOLVED_QUESTION_REMAINS_EXPLICIT", () => {
    assert(UNRESOLVED_QUESTIONS.length > 0, "UNRESOLVED_SET_EMPTY");
    for (const record of UNRESOLVED_QUESTIONS) {
      assert(recordFact(record, "status") === "UNRESOLVED", "QUESTION_NOT_UNRESOLVED", recordFact(record, "questionId"));
      assert(record.facts.question.unresolvedReason !== null, "QUESTION_UNRESOLVED_REASON_MISSING", recordFact(record, "questionId"));
      assert(recordFact(record, "prohibitedResolutionMethods").includes("ASSUMPTION"), "ASSUMPTION_NOT_PROHIBITED", recordFact(record, "questionId"));
    }
  });

  verify("NO_AWARENESS_ARTIFACT_CLAIMS_PRODUCT_AUTHORITY", () => {
    assert(recordFact(PROJECT_AWARENESS_PACKAGE_RECORD, "sourceAuthority") === false, "AWARENESS_SOURCE_AUTHORITY_CLAIMED");
    assert(recordFact(PROJECT_AWARENESS_PACKAGE_RECORD, "productionAuthorized") === false, "AWARENESS_PRODUCT_AUTHORITY_CLAIMED");
    assert(recordFact(PROJECT_AWARENESS_PACKAGE_RECORD, "productRuntime") === false, "AWARENESS_PRODUCT_RUNTIME_CLAIMED");
    assert(recordFact(PROJECT_AWARENESS_PACKAGE_RECORD, "prototypeRuntime") === false, "AWARENESS_PROTOTYPE_RUNTIME_CLAIMED");
  });

  verify("NO_AWARENESS_OPERATION_EXPOSES_REPOSITORY_MUTATION", () => {
    const permitted = PERMITTED_OPERATIONS.map(factValue);
    const prohibited = PROHIBITED_OPERATIONS.map(factValue);
    assert(!permitted.some(operation => /MUTATE|MOVE|DELETE|PROMOTE|AUTHORIZE/.test(operation)), "MUTATION_OPERATION_PERMITTED", permitted);
    for (const required of ["MUTATE_PROJECT_FILES", "MOVE_PROJECT_FILES", "DELETE_PROJECT_FILES", "CREATE_SOURCE_AUTHORITY", "PROMOTE_CANDIDATES", "AUTHORIZE_PRODUCT_CHANGES"]) {
      assert(prohibited.includes(required), "PROHIBITED_OPERATION_MISSING", required);
    }
  });

  verify("BOUNDED_QUERY_SURFACE_IS_COMPLETE_AND_READ_ONLY", () => {
    for (const queryId of PROJECT_AWARENESS_QUERY_IDS.filter(id => id !== "CHANGES_SINCE_PREVIOUS_SNAPSHOT")) {
      const result = queryProjectAwarenessSnapshot(PROJECT_AWARENESS_SNAPSHOT, queryId);
      assert(result.queryId === queryId, "QUERY_RESULT_ID_MISMATCH", queryId);
    }
    const executable = queryProjectAwarenessSnapshot(PROJECT_AWARENESS_SNAPSHOT, "PACKAGE_EXECUTABLE");
    assert(executable.answer.executable === false, "QUERY_FALSE_EXECUTABILITY_CLAIM");
  });

  verify("AWARENESS_PASS_DOES_NOT_PROMOTE_PROTOTYPE", () => {
    const packageRecord = ARTIFACT_RECORDS.find(record => recordFact(record, "artifactId") === "UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE");
    assert(recordFact(packageRecord, "executable") === false, "PROTOTYPE_EXECUTABLE_PROMOTED");
    assert(recordFact(packageRecord, "accepted") === false, "PROTOTYPE_ACCEPTED_PROMOTED");
    assert(recordFact(packageRecord, "productionAuthorized") === false, "PROTOTYPE_PRODUCT_AUTHORITY_PROMOTED");
  });

  return deepFreeze({
    schema: "DGB_PROJECT_AWARENESS_VALIDATION_RECEIPT_v1",
    receiptId: "PROJECT_AWARENESS_DETERMINISTIC_BASELINE_VALIDATION_v1",
    status: "PASS",
    inspectedCommit: factValue(PROJECT_AWARENESS_SNAPSHOT.inspectedCommit),
    snapshotDigest: factValue(PROJECT_AWARENESS_SNAPSHOT.deterministicDigest),
    assertionCount: assertions.length,
    assertions,
    claims: deepFreeze({
      projectAwarenessContractPass: true,
      projectAwarenessRegistryPass: true,
      projectAwarenessSnapshotPass: true,
      prototypePass: false,
      runtimePass: false,
      productAuthority: false,
      universalCompassExecutable: false
    })
  });
}

export const PROJECT_AWARENESS_VALIDATION_RECEIPT = runAwarenessValidationFixtures();

const invokedPath = globalThis.process?.argv?.[1] || "";
if (invokedPath.endsWith("awareness-validation.fixtures.js")) {
  globalThis.console?.log(JSON.stringify(PROJECT_AWARENESS_VALIDATION_RECEIPT, null, 2));
}