/*
 * DGB Project Awareness Contract
 *
 * Read-only repository intelligence. This module creates no source,
 * prototype, product, deployment, navigation, or promotion authority.
 */

export const PROJECT_AWARENESS_CONTRACT = Object.freeze({
  id: "DGB_PROJECT_AWARENESS_CONTRACT_v1",
  mode: "READ_ONLY",
  createsAuthority: false,
  permitsMutation: false,
  permitsInferenceOfMissingFacts: false,
  evidencePostures: Object.freeze([
    "VERIFIED",
    "DECLARED",
    "DERIVED",
    "UNRESOLVED",
    "ABSENT",
    "CONFLICTED"
  ]),
  lifecycleStatuses: Object.freeze([
    "ACTIVE",
    "CANDIDATE",
    "SUPERSEDED",
    "RETIRED",
    "ABSENT",
    "UNRESOLVED"
  ]),
  authorityClassifications: Object.freeze([
    "SOURCE_AUTHORITY",
    "CANDIDATE_IMPLEMENTATION",
    "VALIDATION_EVIDENCE",
    "DERIVED_AWARENESS_RECORD",
    "HISTORICAL_SOURCE",
    "SUPERSEDED_SOURCE",
    "NONCONTROLLING_BRANCH",
    "UNRESOLVED_AUTHORITY"
  ]),
  relationTypes: Object.freeze([
    "CONSUMES",
    "PRODUCES",
    "DEPENDS_ON",
    "IMPLEMENTS",
    "COPIED_FROM",
    "SUPERSEDES",
    "SUPERSEDED_BY",
    "VALIDATED_BY",
    "DECLARES_AUTHORITY_OVER",
    "PROHIBITED_FROM_OWNING",
    "REQUIRES_RECOVERY_OF",
    "REQUIRES_COMPATIBILITY_WITH",
    "LOADS",
    "PROVIDES",
    "PRESENTS"
  ]),
  factKeys: Object.freeze([
    "value",
    "evidencePosture",
    "repositoryIdentity",
    "inspectedCommit",
    "branchIdentity",
    "sourcePath",
    "blobSha",
    "declaredBy",
    "derivedFrom",
    "verifiedAt",
    "unresolvedReason"
  ])
});

export const PROJECT_AWARENESS_BASELINE = Object.freeze({
  repositoryIdentity:
    "smansfield635-create/smansfield635-create.github.io",
  branchIdentity:
    "agent/archcoin-compass-calibration-workspace-001",
  inspectedCommit:
    "febf7ac9ca0bd69c791b70d3f914bbfff5403c1d",
  verifiedAt: "2026-07-23",
  awarenessDirectory: "/research/project-awareness/"
});

export const PERMITTED_AWARENESS_OPERATIONS = Object.freeze([
  "READ_REPOSITORY_OBJECTS",
  "VERIFY_BLOB_IDENTITIES",
  "BUILD_DERIVED_SNAPSHOT",
  "COMPARE_VERIFIED_SNAPSHOTS",
  "ANSWER_BOUNDED_PROJECT_QUERIES"
]);

export const PROHIBITED_AWARENESS_OPERATIONS = Object.freeze([
  "MUTATE_PROJECT_FILES",
  "MOVE_PROJECT_FILES",
  "DELETE_PROJECT_FILES",
  "CREATE_SOURCE_AUTHORITY",
  "PROMOTE_CANDIDATES",
  "RESOLVE_UNVERIFIED_FACTS_BY_INFERENCE",
  "EXECUTE_NAVIGATION",
  "AUTHORIZE_PRODUCT_CHANGES"
]);

function assert(condition, code, detail = null) {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    error.detail = detail;
    throw error;
  }
}

export function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function") ||
    seen.has(value)
  ) {
    return value;
  }

  if (typeof value === "function") {
    return Object.freeze(value);
  }

  seen.add(value);
  Reflect.ownKeys(value).forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value")) {
      deepFreeze(descriptor.value, seen);
    }
  });
  return Object.freeze(value);
}

export function assertExactKeys(value, expectedKeys, code) {
  assert(value && typeof value === "object", code, value);
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  assert(
    actual.length === expected.length &&
      actual.every((key, index) => key === expected[index]),
    code,
    { actual, expected }
  );
}

export function assertCanonicalValue(value, vocabulary, code) {
  assert(vocabulary.includes(value), code, value);
  return value;
}

export function createAwarenessFact({
  value,
  evidencePosture,
  repositoryIdentity = null,
  inspectedCommit = null,
  branchIdentity = null,
  sourcePath = null,
  blobSha = null,
  declaredBy = null,
  derivedFrom = null,
  verifiedAt = null,
  unresolvedReason = null
}) {
  assert(
    arguments.length === 1 &&
      arguments[0] &&
      Object.prototype.hasOwnProperty.call(arguments[0], "value") &&
      Object.prototype.hasOwnProperty.call(arguments[0], "evidencePosture"),
    "PROJECT_AWARENESS_FACT_REQUIRED_FIELDS_MISSING"
  );

  assertCanonicalValue(
    evidencePosture,
    PROJECT_AWARENESS_CONTRACT.evidencePostures,
    "PROJECT_AWARENESS_EVIDENCE_POSTURE_INVALID"
  );

  const fact = {
    value,
    evidencePosture,
    repositoryIdentity,
    inspectedCommit,
    branchIdentity,
    sourcePath,
    blobSha,
    declaredBy,
    derivedFrom,
    verifiedAt,
    unresolvedReason
  };

  assertAwarenessFact(fact);
  return deepFreeze(fact);
}

export function assertAwarenessFact(fact) {
  assertExactKeys(
    fact,
    PROJECT_AWARENESS_CONTRACT.factKeys,
    "PROJECT_AWARENESS_FACT_SHAPE_INVALID"
  );

  assertCanonicalValue(
    fact.evidencePosture,
    PROJECT_AWARENESS_CONTRACT.evidencePostures,
    "PROJECT_AWARENESS_EVIDENCE_POSTURE_INVALID"
  );

  assert(
    fact.evidencePosture !== "UNRESOLVED" ||
      typeof fact.unresolvedReason === "string",
    "PROJECT_AWARENESS_UNRESOLVED_REASON_REQUIRED",
    fact
  );

  return fact;
}

export function createRepositoryFact(
  value,
  {
    evidencePosture = "VERIFIED",
    sourcePath = null,
    blobSha = null,
    declaredBy = PROJECT_AWARENESS_CONTRACT.id,
    derivedFrom = null,
    unresolvedReason = null
  } = {}
) {
  return createAwarenessFact({
    value,
    evidencePosture,
    repositoryIdentity: PROJECT_AWARENESS_BASELINE.repositoryIdentity,
    inspectedCommit: PROJECT_AWARENESS_BASELINE.inspectedCommit,
    branchIdentity: PROJECT_AWARENESS_BASELINE.branchIdentity,
    sourcePath,
    blobSha,
    declaredBy,
    derivedFrom,
    verifiedAt:
      evidencePosture === "VERIFIED"
        ? PROJECT_AWARENESS_BASELINE.verifiedAt
        : null,
    unresolvedReason
  });
}

function normalizeForStableSerialization(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeForStableSerialization);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((record, key) => {
        record[key] = normalizeForStableSerialization(value[key]);
        return record;
      }, {});
  }

  return value;
}

export function stableSerialize(value) {
  return JSON.stringify(normalizeForStableSerialization(value));
}

export function assertReadOnlyAwarenessBoundary() {
  assert(
    PROJECT_AWARENESS_CONTRACT.mode === "READ_ONLY" &&
      PROJECT_AWARENESS_CONTRACT.createsAuthority === false &&
      PROJECT_AWARENESS_CONTRACT.permitsMutation === false &&
      PROJECT_AWARENESS_CONTRACT.permitsInferenceOfMissingFacts === false,
    "PROJECT_AWARENESS_READ_ONLY_BOUNDARY_INVALID"
  );

  return true;
}
