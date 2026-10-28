import {
  PROJECT_AWARENESS_CONTRACT,
  createFact,
  deepFreeze
} from "./project-awareness.contract.js";

export const REPOSITORY_IDENTITY = "smansfield635-create/smansfield635-create.github.io";
export const BRANCH_IDENTITY = "agent/archcoin-compass-calibration-workspace-001";
export const INSPECTED_COMMIT = "febf7ac9ca0bd69c791b70d3f914bbfff5403c1d";
export const INSPECTION_VERIFIED_AT = "2026-07-23T19:56:08Z";

function provenance({
  evidencePosture,
  sourcePath = null,
  blobSha = null,
  declaredBy = "PROJECT_AWARENESS_CONVERSION_CHECKPOINT",
  derivedFrom = null,
  unresolvedReason = null,
  verifiedAt = evidencePosture === "VERIFIED" ? INSPECTION_VERIFIED_AT : null
}) {
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

function verified(value, sourcePath, blobSha, derivedFrom = null) {
  return createFact({ value, ...provenance({ evidencePosture: "VERIFIED", sourcePath, blobSha, derivedFrom }) });
}

function declared(value, sourcePath = null, blobSha = null, derivedFrom = null) {
  return createFact({ value, ...provenance({ evidencePosture: "DECLARED", sourcePath, blobSha, derivedFrom }) });
}

function derived(value, derivedFrom, sourcePath = null, blobSha = null) {
  return createFact({ value, ...provenance({ evidencePosture: "DERIVED", sourcePath, blobSha, derivedFrom }) });
}

export const REPOSITORY_INSPECTION = deepFreeze({
  schema: "DGB_REPOSITORY_INSPECTION_RECORD_v1",
  recordKind: "REPOSITORY_INSPECTION",
  recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
  facts: {
    repositoryIdentity: verified(REPOSITORY_IDENTITY, null, null, "GITHUB_REPOSITORY_METADATA"),
    branchIdentity: verified(BRANCH_IDENTITY, null, null, "BRANCH_REF_RESOLUTION"),
    inspectedCommit: verified(INSPECTED_COMMIT, null, null, "BRANCH_AND_COMMIT_COMPARISON"),
    branchEqualsInspectedCommit: verified(true, null, null, "COMPARE_COMMITS_STATUS_IDENTICAL"),
    createsAuthority: declared(false),
    permitsMutation: declared(false)
  }
});

const SHELL_DEFINITIONS = [
  [
    "UNIVERSAL_COMPASS_PLANET",
    "/prototypes/universal-compass/index.planet.js",
    "0d462361776288b88584a7272c8e42ea6b14f1fa",
    "/assets/compass-model/compass.world.js"
  ],
  [
    "UNIVERSAL_COMPASS_CRYSTALS",
    "/prototypes/universal-compass/index.crystals.js",
    "0bdf6bd08732d72935192dc211014cf7ec84dc15",
    "/assets/compass-model/compass.geometry.js"
  ],
  [
    "UNIVERSAL_COMPASS_COMPOSITOR",
    "/prototypes/universal-compass/index.compositor.js",
    "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8",
    "/assets/compass-model/compass.compositor.js"
  ],
  [
    "UNIVERSAL_COMPASS_CONTROLLER",
    "/prototypes/universal-compass/index.controller.js",
    "7eae298304d53c711adc1714fbc44dcd94f6b065",
    "/assets/compass-model/compass.controller.js"
  ],
  [
    "UNIVERSAL_COMPASS_INTERACTIONS",
    "/prototypes/universal-compass/index.interactions.js",
    "cf06c107a23115a809826b949e306e5c810e60f0",
    "/assets/compass-model/compass.interactions.js"
  ],
  [
    "UNIVERSAL_COMPASS_HTML",
    "/prototypes/universal-compass/index.html",
    "cd1abe75ba93e5733514ad378f52223ec53805b2",
    "/research/archcoin-compass-calibration/neutral-reference-compass/index.html"
  ],
  [
    "UNIVERSAL_COMPASS_CSS",
    "/prototypes/universal-compass/index.css",
    "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa",
    "/research/archcoin-compass-calibration/neutral-reference-compass/index.css"
  ]
];

export const UNIVERSAL_COMPASS_SHELL_RECORDS = deepFreeze(
  SHELL_DEFINITIONS.map(([artifactId, path, blobSha, copiedFrom]) => ({
    schema: "DGB_REPOSITORY_SOURCE_RECORD_v1",
    recordKind: "UNIVERSAL_COMPASS_SHELL_FILE",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      artifactId: derived(artifactId, path, path, blobSha),
      path: verified(path, path, blobSha, "GITHUB_CONTENT_PATH_RESOLUTION"),
      blobSha: verified(blobSha, path, blobSha, "GITHUB_CONTENT_BLOB_SHA"),
      observedBlobSha: verified(blobSha, path, blobSha, "GITHUB_FETCH_FILE_RESPONSE"),
      copiedFrom: verified(copiedFrom, copiedFrom, blobSha, "SOURCE_AND_TARGET_BLOB_IDENTITY"),
      sourceBlobSha: verified(blobSha, copiedFrom, blobSha, "GITHUB_SOURCE_FETCH_FILE_RESPONSE"),
      sourceBytesVerified: verified(true, path, blobSha, "TARGET_AND_SOURCE_BLOB_SHA_EQUAL"),
      pathResolvedAtCommit: verified(true, path, blobSha, "GITHUB_FETCH_AT_INSPECTED_COMMIT"),
      blobMatchedRegistry: verified(true, path, blobSha, "EXPECTED_AND_OBSERVED_BLOB_SHA_EQUAL"),
      sourceBlobMatchedTarget: verified(true, copiedFrom, blobSha, "SOURCE_AND_TARGET_BLOB_SHA_EQUAL"),
      lifecycleStatus: declared("CANDIDATE", path, blobSha),
      packageStatus: declared("SHELL_COPY_COMPLETE_NOT_EXECUTABLE", path, blobSha),
      compatibilityComplete: declared(false, path, blobSha),
      executable: declared(false, path, blobSha),
      validated: declared(false, path, blobSha),
      accepted: declared(false, path, blobSha),
      productAuthority: declared(false, path, blobSha)
    }
  }))
);

const SOURCE_ARTIFACT_DEFINITIONS = SHELL_DEFINITIONS.map(
  ([artifactId, , blobSha, copiedFrom]) => [
    `SOURCE_${artifactId}`,
    copiedFrom,
    blobSha
  ]
);

export const COPIED_SOURCE_ARTIFACT_RECORDS = deepFreeze(
  SOURCE_ARTIFACT_DEFINITIONS.map(([artifactId, path, blobSha]) => ({
    schema: "DGB_ARTIFACT_IDENTITY_RECORD_v1",
    recordKind: "COPIED_SOURCE_ARTIFACT",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      artifactId: derived(artifactId, path, path, blobSha),
      path: verified(path, path, blobSha),
      blobSha: verified(blobSha, path, blobSha),
      artifactKind: declared("HISTORICAL_COPY_SOURCE", path, blobSha),
      authorityClassification: declared("HISTORICAL_SOURCE", path, blobSha),
      lifecycleStatus: declared("ACTIVE", path, blobSha),
      executable: declared(null, path, blobSha, "NOT_ASSERTED_BY_AWARENESS_BASELINE"),
      accepted: declared(null, path, blobSha, "NOT_ASSERTED_BY_AWARENESS_BASELINE"),
      productionAuthorized: declared(null, path, blobSha, "NOT_ASSERTED_BY_AWARENESS_BASELINE")
    }
  }))
);

export const UNIVERSAL_COMPASS_PACKAGE_RECORD = deepFreeze({
  schema: "DGB_ARTIFACT_IDENTITY_RECORD_v1",
  recordKind: "PACKAGE_ARTIFACT",
  recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
  facts: {
    artifactId: derived("UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE", "SEVEN_SHELL_RECORDS"),
    directory: verified("/prototypes/universal-compass/", "/prototypes/universal-compass/", null),
    contractIdentity: declared("DGB_UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE_CONTRACT_v1"),
    moduleNamespace: declared("DGB_UNIVERSAL_COMPASS"),
    schemaPrefix: declared("UNIVERSAL_COMPASS_"),
    artifactKind: declared("CANDIDATE_PROTOTYPE"),
    authorityClassification: declared("CANDIDATE_IMPLEMENTATION"),
    lifecycleStatus: declared("CANDIDATE"),
    packageStatus: declared("SHELL_COPY_COMPLETE_NOT_EXECUTABLE"),
    executable: declared(false),
    accepted: declared(false),
    productionAuthorized: declared(false),
    inspectedCommit: verified(INSPECTED_COMMIT, null, null),
    awarenessRecordAuthorityClassification: declared("DERIVED_AWARENESS_RECORD")
  }
});

const DATA_IDENTITIES = [
  "IMMUTABLE_WORLD_TRUTH",
  "PLANET_SNAPSHOT",
  "VISUAL_RECORDS",
  "COMPOSITOR_INPUT",
  "CRYSTAL_INPUT",
  "CONTROLLER_PRESENTATION_CONTEXT",
  "PROJECTION_SNAPSHOT",
  "COMPOSITOR_INTERACTION_PROJECTIONS",
  "LOCAL_INTERACTION_PROPOSALS",
  "ACCEPTED_STATE",
  "RUNTIME_MOUNTS",
  "SEMANTIC_CONTROLS",
  "PUBLISHED_STATE"
];

export const DECLARED_DATA_IDENTITY_RECORDS = deepFreeze(
  DATA_IDENTITIES.map(artifactId => ({
    schema: "DGB_ARTIFACT_IDENTITY_RECORD_v1",
    recordKind: "DECLARED_DATA_IDENTITY",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      artifactId: declared(artifactId),
      path: declared(null, null, null, "NO_SEPARATE_REPOSITORY_PATH_ASSERTED"),
      blobSha: declared(null, null, null, "NO_SEPARATE_BLOB_ASSERTED"),
      artifactKind: declared("DECLARED_DATA_PRODUCT"),
      authorityClassification: declared("UNRESOLVED_AUTHORITY"),
      lifecycleStatus: declared("UNRESOLVED"),
      executable: declared(false),
      accepted: declared(false),
      productionAuthorized: declared(false)
    }
  }))
);

export const UNIVERSAL_COMPASS_COMPONENT_RECORDS = deepFreeze(
  UNIVERSAL_COMPASS_SHELL_RECORDS.map(sourceRecord => ({
    schema: "DGB_ARTIFACT_IDENTITY_RECORD_v1",
    recordKind: "UNIVERSAL_COMPASS_COMPONENT",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      artifactId: sourceRecord.facts.artifactId,
      path: sourceRecord.facts.path,
      blobSha: sourceRecord.facts.blobSha,
      artifactKind: declared("CANDIDATE_PROTOTYPE_COMPONENT", sourceRecord.facts.path.value, sourceRecord.facts.blobSha.value),
      authorityClassification: declared("CANDIDATE_IMPLEMENTATION", sourceRecord.facts.path.value, sourceRecord.facts.blobSha.value),
      lifecycleStatus: sourceRecord.facts.lifecycleStatus,
      packageStatus: sourceRecord.facts.packageStatus,
      executable: sourceRecord.facts.executable,
      accepted: sourceRecord.facts.accepted,
      productionAuthorized: sourceRecord.facts.productAuthority,
      awarenessRecordAuthorityClassification: declared("DERIVED_AWARENESS_RECORD")
    }
  }))
);

export const PROJECT_AWARENESS_PACKAGE_RECORD = deepFreeze({
  schema: "DGB_ARTIFACT_IDENTITY_RECORD_v1",
  recordKind: "AWARENESS_PACKAGE",
  recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
  facts: {
    artifactId: derived("PROJECT_AWARENESS_PACKAGE", PROJECT_AWARENESS_CONTRACT.id),
    directory: declared("/research/project-awareness/"),
    artifactKind: declared("READ_ONLY_REPOSITORY_INTELLIGENCE_LAYER"),
    authorityClassification: declared("DERIVED_AWARENESS_RECORD"),
    lifecycleStatus: declared("CANDIDATE"),
    executable: declared(true, null, null, "VALIDATION_FIXTURE_EXECUTABLE_ONLY"),
    accepted: declared(false),
    productionAuthorized: declared(false),
    productRuntime: declared(false),
    prototypeRuntime: declared(false),
    sourceAuthority: declared(false),
    importsUniversalCompassRuntime: declared(false),
    importedByUniversalCompassRuntime: declared(false)
  }
});

export const ARTIFACT_RECORDS = deepFreeze([
  UNIVERSAL_COMPASS_PACKAGE_RECORD,
  PROJECT_AWARENESS_PACKAGE_RECORD,
  ...UNIVERSAL_COMPASS_COMPONENT_RECORDS,
  ...COPIED_SOURCE_ARTIFACT_RECORDS,
  ...DECLARED_DATA_IDENTITY_RECORDS
]);

export const REPOSITORY_SOURCE_REGISTRY = deepFreeze({
  schema: "DGB_REPOSITORY_SOURCE_REGISTRY_v1",
  contractIdentity: PROJECT_AWARENESS_CONTRACT.id,
  repositoryInspection: REPOSITORY_INSPECTION,
  sourceRecords: UNIVERSAL_COMPASS_SHELL_RECORDS,
  artifactRecords: ARTIFACT_RECORDS
});