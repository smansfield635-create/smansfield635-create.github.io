/*
 * Deterministic validation fixtures for the Project Awareness package.
 * A passing receipt validates only the awareness model. It does not validate
 * or authorize the Universal Compass prototype, runtime, or product.
 */

import {
  PERMITTED_AWARENESS_OPERATIONS,
  PROHIBITED_AWARENESS_OPERATIONS,
  PROJECT_AWARENESS_BASELINE,
  PROJECT_AWARENESS_CONTRACT,
  assertAwarenessFact,
  assertReadOnlyAwarenessBoundary,
  createRepositoryFact,
  deepFreeze,
  stableSerialize
} from "./project-awareness.contract.js";
import {
  REPOSITORY_SOURCE_REGISTRY,
  UNIVERSAL_COMPASS_PACKAGE_IDENTITY,
  UNIVERSAL_COMPASS_SHELL_RECORDS
} from "./repository-source-registry.js";
import {
  ARTIFACT_AUTHORITY_RECORDS,
  AUTHORITY_AND_STATUS_LEDGER,
  UNRESOLVED_QUESTIONS
} from "./authority-and-status-ledger.js";
import {
  BOUNDED_PROJECT_QUERY_IDS,
  DEPENDENCY_GRAPH,
  DEPENDENCY_GRAPH_NODES,
  DEPENDENCY_RELATIONS,
  createBoundedProjectQueryInterface,
  createProjectAwarenessSnapshot
} from "./dependency-graph.snapshot.js";

const VALIDATION_PATH =
  "/research/project-awareness/awareness-validation.fixtures.js";
const RECEIPT_ID = "DGB_PROJECT_AWARENESS_BASELINE_VALIDATION_RECEIPT_v1";

function assert(condition, code, detail = null) {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    error.detail = detail;
    throw error;
  }
}

function receiptFact(value, evidencePosture = "DERIVED", derivedFrom = null) {
  return createRepositoryFact(value, {
    evidencePosture,
    sourcePath: VALIDATION_PATH,
    declaredBy: RECEIPT_ID,
    derivedFrom
  });
}

export const VERIFIED_REPOSITORY_EVIDENCE = deepFreeze({
  repositoryIdentity:
    "smansfield635-create/smansfield635-create.github.io",
  branchIdentity: "agent/archcoin-compass-calibration-workspace-001",
  inspectedCommit: "febf7ac9ca0bd69c791b70d3f914bbfff5403c1d",
  records: [
    [
      "/prototypes/universal-compass/index.planet.js",
      "0d462361776288b88584a7272c8e42ea6b14f1fa"
    ],
    [
      "/prototypes/universal-compass/index.crystals.js",
      "0bdf6bd08732d72935192dc211014cf7ec84dc15"
    ],
    [
      "/prototypes/universal-compass/index.compositor.js",
      "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8"
    ],
    [
      "/prototypes/universal-compass/index.controller.js",
      "7eae298304d53c711adc1714fbc44dcd94f6b065"
    ],
    [
      "/prototypes/universal-compass/index.interactions.js",
      "cf06c107a23115a809826b949e306e5c810e60f0"
    ],
    [
      "/prototypes/universal-compass/index.html",
      "cd1abe75ba93e5733514ad378f52223ec53805b2"
    ],
    [
      "/prototypes/universal-compass/index.css",
      "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa"
    ]
  ]
});

function collectFacts(value, facts = [], seen = new WeakSet()) {
  if (!value || typeof value !== "object" || seen.has(value)) {
    return facts;
  }

  seen.add(value);
  const keys = Object.keys(value);
  const isFact =
    keys.length === PROJECT_AWARENESS_CONTRACT.factKeys.length &&
    PROJECT_AWARENESS_CONTRACT.factKeys.every(key => keys.includes(key));

  if (isFact) {
    facts.push(value);
    return facts;
  }

  keys.forEach(key => collectFacts(value[key], facts, seen));
  return facts;
}

function validateDeterministicSnapshot() {
  const first = createProjectAwarenessSnapshot();
  const second = createProjectAwarenessSnapshot();
  assert(
    stableSerialize(first) === stableSerialize(second),
    "PROJECT_AWARENESS_SNAPSHOT_NONDETERMINISTIC"
  );
  assert(
    first.inspectedCommit.value === PROJECT_AWARENESS_BASELINE.inspectedCommit,
    "PROJECT_AWARENESS_SNAPSHOT_COMMIT_DRIFT"
  );
}

function validateRepositoryGrounding(evidence) {
  assert(
    evidence.repositoryIdentity === PROJECT_AWARENESS_BASELINE.repositoryIdentity,
    "PROJECT_AWARENESS_REPOSITORY_IDENTITY_MISMATCH"
  );
  assert(
    evidence.branchIdentity === PROJECT_AWARENESS_BASELINE.branchIdentity,
    "PROJECT_AWARENESS_BRANCH_IDENTITY_MISMATCH"
  );
  assert(
    evidence.inspectedCommit === PROJECT_AWARENESS_BASELINE.inspectedCommit,
    "PROJECT_AWARENESS_INSPECTED_COMMIT_MISMATCH"
  );

  const evidenceByPath = new Map(evidence.records);
  UNIVERSAL_COMPASS_SHELL_RECORDS.forEach(record => {
    const path = record.path.value;
    assert(
      evidenceByPath.has(path),
      "PROJECT_AWARENESS_ARTIFACT_PATH_UNRESOLVED",
      path
    );
    assert(
      evidenceByPath.get(path) === record.blobSha.value,
      "PROJECT_AWARENESS_BLOB_IDENTITY_MISMATCH",
      path
    );
    assert(
      record.sourceBytesVerified.value === true &&
        record.copyIdentityVerified.value === true,
      "PROJECT_AWARENESS_SOURCE_COPY_NOT_VERIFIED",
      path
    );
  });
}

function validateDependencyGraph() {
  const endpointIds = new Set([
    UNIVERSAL_COMPASS_PACKAGE_IDENTITY.artifactId.value,
    ...DEPENDENCY_GRAPH_NODES.map(node => node.artifactId.value)
  ]);

  DEPENDENCY_RELATIONS.forEach(edge => {
    assert(
      endpointIds.has(edge.fromArtifactId.value),
      "PROJECT_AWARENESS_DEPENDENCY_FROM_ENDPOINT_UNRESOLVED",
      edge.fromArtifactId.value
    );
    assert(
      endpointIds.has(edge.toArtifactId.value),
      "PROJECT_AWARENESS_DEPENDENCY_TO_ENDPOINT_UNRESOLVED",
      edge.toArtifactId.value
    );
    assert(
      PROJECT_AWARENESS_CONTRACT.relationTypes.includes(edge.relation.value),
      "PROJECT_AWARENESS_DEPENDENCY_RELATION_INVALID",
      edge.relation.value
    );
    assert(
      ["DECLARED", "UNRESOLVED"].includes(edge.evidencePosture.value),
      "PROJECT_AWARENESS_EXECUTABLE_RELATION_POSTURE_LEAK",
      edge.evidencePosture.value
    );
  });
}

function validateFactProvenance() {
  const facts = collectFacts({
    sourceRegistry: REPOSITORY_SOURCE_REGISTRY,
    authorityLedger: AUTHORITY_AND_STATUS_LEDGER,
    dependencyGraph: DEPENDENCY_GRAPH
  });

  assert(facts.length > 0, "PROJECT_AWARENESS_FACTS_NOT_FOUND");
  facts.forEach(fact => {
    assertAwarenessFact(fact);
    assert(
      fact.repositoryIdentity === PROJECT_AWARENESS_BASELINE.repositoryIdentity,
      "PROJECT_AWARENESS_FACT_REPOSITORY_PROVENANCE_MISSING"
    );
    assert(
      fact.inspectedCommit === PROJECT_AWARENESS_BASELINE.inspectedCommit,
      "PROJECT_AWARENESS_FACT_COMMIT_PROVENANCE_MISSING"
    );
    assert(
      fact.branchIdentity === PROJECT_AWARENESS_BASELINE.branchIdentity,
      "PROJECT_AWARENESS_FACT_BRANCH_PROVENANCE_MISSING"
    );
    assert(
      typeof fact.declaredBy === "string" && fact.declaredBy.length > 0,
      "PROJECT_AWARENESS_FACT_DECLARER_MISSING"
    );
  });
}

function validateAuthorityAndLifecycleVocabulary() {
  ARTIFACT_AUTHORITY_RECORDS.forEach(record => {
    assert(
      PROJECT_AWARENESS_CONTRACT.authorityClassifications.includes(
        record.authorityClassification.value
      ),
      "PROJECT_AWARENESS_AUTHORITY_CLASSIFICATION_INVALID"
    );
    assert(
      PROJECT_AWARENESS_CONTRACT.lifecycleStatuses.includes(
        record.lifecycleStatus.value
      ),
      "PROJECT_AWARENESS_LIFECYCLE_STATUS_INVALID"
    );
    assert(
      record.awarenessRecordCreatesAuthority.value === false,
      "PROJECT_AWARENESS_RECORD_CREATES_AUTHORITY"
    );
  });
}

function validateSupersessionEdges(snapshot) {
  snapshot.supersessionRelations.forEach(edge => {
    assert(
      edge && edge.fromArtifactId && edge.toArtifactId,
      "PROJECT_AWARENESS_SUPERSESSION_ENDPOINT_MISSING"
    );
  });
}

function validateUnresolvedQuestions() {
  assert(
    UNRESOLVED_QUESTIONS.length === 12,
    "PROJECT_AWARENESS_UNRESOLVED_SET_INCOMPLETE"
  );

  UNRESOLVED_QUESTIONS.forEach(record => {
    assert(
      record.status.value === "UNRESOLVED" &&
        record.evidencePosture.value === "UNRESOLVED",
      "PROJECT_AWARENESS_UNRESOLVED_QUESTION_SILENTLY_RESOLVED"
    );
    assert(
      record.blocks.value.length > 0,
      "PROJECT_AWARENESS_UNRESOLVED_BLOCKS_MISSING"
    );
    assert(
      record.prohibitedResolutionMethods.value.includes("ASSUMPTION") &&
        record.prohibitedResolutionMethods.value.includes(
          "UNSOURCED_RECONSTRUCTION"
        ),
      "PROJECT_AWARENESS_UNRESOLVED_PROHIBITION_MISSING"
    );
  });
}

function validateAuthorityBoundary() {
  const awarenessPackage = ARTIFACT_AUTHORITY_RECORDS.find(
    record => record.artifactId.value === "DGB_PROJECT_AWARENESS_PACKAGE"
  );

  assert(
    awarenessPackage &&
      awarenessPackage.authorityClassification.value ===
        "DERIVED_AWARENESS_RECORD" &&
      awarenessPackage.productionAuthorized.value === false,
    "PROJECT_AWARENESS_PACKAGE_AUTHORITY_LEAK"
  );
  assert(
    UNIVERSAL_COMPASS_PACKAGE_IDENTITY.executable.value === false &&
      UNIVERSAL_COMPASS_PACKAGE_IDENTITY.accepted.value === false &&
      UNIVERSAL_COMPASS_PACKAGE_IDENTITY.productionAuthorized.value === false,
    "PROJECT_AWARENESS_PROTOTYPE_STATUS_UPGRADE"
  );
}

function validateOperationBoundary() {
  assertReadOnlyAwarenessBoundary();
  const mutationTerms = [
    "WRITE",
    "UPDATE",
    "DELETE",
    "MOVE",
    "PROMOTE",
    "NAVIGATE",
    "AUTHORIZE"
  ];

  PERMITTED_AWARENESS_OPERATIONS.forEach(operation => {
    assert(
      mutationTerms.every(term => !operation.includes(term)),
      "PROJECT_AWARENESS_MUTATION_OPERATION_EXPOSED",
      operation
    );
  });

  [
    "MUTATE_PROJECT_FILES",
    "MOVE_PROJECT_FILES",
    "DELETE_PROJECT_FILES",
    "CREATE_SOURCE_AUTHORITY",
    "PROMOTE_CANDIDATES",
    "EXECUTE_NAVIGATION",
    "AUTHORIZE_PRODUCT_CHANGES"
  ].forEach(operation => {
    assert(
      PROHIBITED_AWARENESS_OPERATIONS.includes(operation),
      "PROJECT_AWARENESS_PROHIBITED_OPERATION_MISSING",
      operation
    );
  });
}

function validateBoundedQueries(snapshot) {
  const interfaceRecord = createBoundedProjectQueryInterface(snapshot);
  BOUNDED_PROJECT_QUERY_IDS.forEach(queryId => {
    assert(
      interfaceRecord.query(queryId).status === "ANSWERED",
      "PROJECT_AWARENESS_BOUNDED_QUERY_FAILED",
      queryId
    );
  });
  assert(
    interfaceRecord.query("MUTATE_REPOSITORY").status ===
      "REJECTED_OUT_OF_BOUNDS",
    "PROJECT_AWARENESS_QUERY_BOUNDARY_BYPASSED"
  );
  assert(
    interfaceRecord.query("PACKAGE_EXECUTABLE").value === false,
    "PROJECT_AWARENESS_QUERY_EXECUTABILITY_UPGRADE"
  );
  assert(
    interfaceRecord.query("WORLD_TRUTH_OWNER").value ===
      "UNIVERSAL_COMPASS_PLANET",
    "PROJECT_AWARENESS_WORLD_AUTHORITY_QUERY_INVALID"
  );
  assert(
    interfaceRecord.query("PROJECTION_OWNER").value ===
      "UNIVERSAL_COMPASS_COMPOSITOR",
    "PROJECT_AWARENESS_PROJECTION_AUTHORITY_QUERY_INVALID"
  );
}

export function runAwarenessValidation({
  repositoryEvidence = VERIFIED_REPOSITORY_EVIDENCE
} = {}) {
  const baselineSnapshot = createProjectAwarenessSnapshot();
  const checks = [
    ["DETERMINISTIC_SNAPSHOT", validateDeterministicSnapshot],
    ["REPOSITORY_PATH_AND_BLOB_GROUNDING", () =>
      validateRepositoryGrounding(repositoryEvidence)],
    ["DEPENDENCY_ENDPOINT_RESOLUTION", validateDependencyGraph],
    ["AUTHORITY_PROVENANCE", validateFactProvenance],
    [
      "CANONICAL_AUTHORITY_AND_LIFECYCLE_VOCABULARY",
      validateAuthorityAndLifecycleVocabulary
    ],
    ["SUPERSESSION_ENDPOINT_COMPLETENESS", () =>
      validateSupersessionEdges(baselineSnapshot)],
    ["UNRESOLVED_QUESTIONS_EXPLICIT", validateUnresolvedQuestions],
    ["NO_AWARENESS_AUTHORITY_LEAK", validateAuthorityBoundary],
    ["READ_ONLY_OPERATION_BOUNDARY", validateOperationBoundary],
    ["BOUNDED_QUERY_INTERFACE", () =>
      validateBoundedQueries(baselineSnapshot)]
  ];

  const results = checks.map(([checkId, execute]) => {
    execute();
    return deepFreeze({
      checkId: receiptFact(checkId),
      passed: receiptFact(true, "DERIVED", checkId)
    });
  });

  return deepFreeze({
    schema: "DGB_PROJECT_AWARENESS_VALIDATION_RECEIPT_v1",
    awarenessAuthorityClassification: "VALIDATION_EVIDENCE",
    receiptId: receiptFact(RECEIPT_ID),
    repositoryIdentity: receiptFact(
      PROJECT_AWARENESS_BASELINE.repositoryIdentity,
      "VERIFIED",
      "GITHUB_REPOSITORY_METADATA"
    ),
    inspectedCommit: receiptFact(
      PROJECT_AWARENESS_BASELINE.inspectedCommit,
      "VERIFIED",
      "GITHUB_COMMIT_OBJECT"
    ),
    branchIdentity: receiptFact(
      PROJECT_AWARENESS_BASELINE.branchIdentity,
      "VERIFIED",
      "GITHUB_COMPARE_COMMITS_IDENTICAL"
    ),
    projectAwarenessContractPass: receiptFact(true, "DERIVED", results),
    projectAwarenessRegistryPass: receiptFact(true, "DERIVED", results),
    projectAwarenessSnapshotPass: receiptFact(true, "DERIVED", results),
    prototypePass: receiptFact(false, "DECLARED", "OUT_OF_SCOPE"),
    runtimePass: receiptFact(false, "DECLARED", "OUT_OF_SCOPE"),
    productAuthority: receiptFact(false, "DECLARED", "PROHIBITED"),
    status: receiptFact("PASS", "DERIVED", results),
    checks: results
  });
}

export const PROJECT_AWARENESS_VALIDATION_RECEIPT =
  runAwarenessValidation();

export const VALIDATED_PROJECT_AWARENESS_SNAPSHOT =
  createProjectAwarenessSnapshot({
    validationReceipts: [PROJECT_AWARENESS_VALIDATION_RECEIPT]
  });
