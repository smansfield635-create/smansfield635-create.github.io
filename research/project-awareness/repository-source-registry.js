/*
 * Canonical repository source registry for the first Project Awareness
 * baseline. Records describe exact Git evidence; they do not create or
 * transfer authority.
 */

import {
  PROJECT_AWARENESS_BASELINE,
  createRepositoryFact,
  deepFreeze
} from "./project-awareness.contract.js";

const CHECKPOINT_DECLARATION =
  "DGB_PROJECT_AWARENESS_UNIVERSAL_COMPASS_BASELINE_CHECKPOINT_v1";

function verifiedFileFact(value, sourcePath, blobSha, derivedFrom = null) {
  return createRepositoryFact(value, {
    evidencePosture: "VERIFIED",
    sourcePath,
    blobSha,
    declaredBy: CHECKPOINT_DECLARATION,
    derivedFrom
  });
}

function declaredFileFact(value, sourcePath, blobSha, derivedFrom = null) {
  return createRepositoryFact(value, {
    evidencePosture: "DECLARED",
    sourcePath,
    blobSha,
    declaredBy: CHECKPOINT_DECLARATION,
    derivedFrom
  });
}

function createShellRecord({
  artifactId,
  path,
  blobSha,
  copiedFrom,
  role
}) {
  const identityPair = deepFreeze([copiedFrom, path]);

  return deepFreeze({
    recordSchema: "DGB_PROJECT_AWARENESS_SOURCE_RECORD_v1",
    awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    artifactId: declaredFileFact(artifactId, path, blobSha),
    role: declaredFileFact(role, path, blobSha),
    path: verifiedFileFact(path, path, blobSha),
    blobSha: verifiedFileFact(blobSha, path, blobSha),
    copiedFrom: verifiedFileFact(copiedFrom, copiedFrom, blobSha),
    copyIdentityVerified: verifiedFileFact(
      true,
      path,
      blobSha,
      identityPair
    ),
    sourceBytesVerified: verifiedFileFact(
      true,
      path,
      blobSha,
      identityPair
    ),
    lifecycleStatus: declaredFileFact("CANDIDATE", path, blobSha),
    packageStatus: declaredFileFact(
      "SHELL_COPY_COMPLETE_NOT_EXECUTABLE",
      path,
      blobSha
    ),
    compatibilityComplete: declaredFileFact(false, path, blobSha),
    executable: declaredFileFact(false, path, blobSha),
    validated: declaredFileFact(false, path, blobSha),
    accepted: declaredFileFact(false, path, blobSha),
    productAuthority: declaredFileFact(false, path, blobSha)
  });
}

export const REPOSITORY_INSPECTION_ANCHOR = deepFreeze({
  recordSchema: "DGB_PROJECT_AWARENESS_REPOSITORY_ANCHOR_v1",
  awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
  repositoryIdentity: createRepositoryFact(
    PROJECT_AWARENESS_BASELINE.repositoryIdentity,
    {
      evidencePosture: "VERIFIED",
      declaredBy: CHECKPOINT_DECLARATION,
      derivedFrom: "GITHUB_REPOSITORY_METADATA"
    }
  ),
  branchIdentity: createRepositoryFact(
    PROJECT_AWARENESS_BASELINE.branchIdentity,
    {
      evidencePosture: "VERIFIED",
      declaredBy: CHECKPOINT_DECLARATION,
      derivedFrom: "GITHUB_COMPARE_COMMITS_IDENTICAL"
    }
  ),
  inspectedCommit: createRepositoryFact(
    PROJECT_AWARENESS_BASELINE.inspectedCommit,
    {
      evidencePosture: "VERIFIED",
      declaredBy: CHECKPOINT_DECLARATION,
      derivedFrom: "GITHUB_COMMIT_OBJECT"
    }
  ),
  branchHeadEqualsInspectedCommit: createRepositoryFact(true, {
    evidencePosture: "VERIFIED",
    declaredBy: CHECKPOINT_DECLARATION,
    derivedFrom: "GITHUB_COMPARE_COMMITS_IDENTICAL"
  })
});

export const UNIVERSAL_COMPASS_SHELL_RECORDS = deepFreeze([
  createShellRecord({
    artifactId: "UNIVERSAL_COMPASS_PLANET",
    path: "/prototypes/universal-compass/index.planet.js",
    blobSha: "0d462361776288b88584a7272c8e42ea6b14f1fa",
    copiedFrom: "/assets/compass-model/compass.world.js",
    role: "IMMUTABLE_WORLD_TRUTH_AUTHORITY_CANDIDATE"
  }),
  createShellRecord({
    artifactId: "UNIVERSAL_COMPASS_CRYSTALS",
    path: "/prototypes/universal-compass/index.crystals.js",
    blobSha: "0bdf6bd08732d72935192dc211014cf7ec84dc15",
    copiedFrom: "/assets/compass-model/compass.geometry.js",
    role: "VISUAL_INTERPRETATION_AUTHORITY_CANDIDATE"
  }),
  createShellRecord({
    artifactId: "UNIVERSAL_COMPASS_COMPOSITOR",
    path: "/prototypes/universal-compass/index.compositor.js",
    blobSha: "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8",
    copiedFrom: "/assets/compass-model/compass.compositor.js",
    role: "PROJECTION_AUTHORITY_CANDIDATE"
  }),
  createShellRecord({
    artifactId: "UNIVERSAL_COMPASS_CONTROLLER",
    path: "/prototypes/universal-compass/index.controller.js",
    blobSha: "7eae298304d53c711adc1714fbc44dcd94f6b065",
    copiedFrom: "/assets/compass-model/compass.controller.js",
    role: "TRANSACTION_STATE_NAVIGATION_AUTHORITY_CANDIDATE"
  }),
  createShellRecord({
    artifactId: "UNIVERSAL_COMPASS_INTERACTIONS",
    path: "/prototypes/universal-compass/index.interactions.js",
    blobSha: "cf06c107a23115a809826b949e306e5c810e60f0",
    copiedFrom: "/assets/compass-model/compass.interactions.js",
    role: "POINTER_INPUT_AND_GESTURE_PROPOSAL_AUTHORITY_CANDIDATE"
  }),
  createShellRecord({
    artifactId: "UNIVERSAL_COMPASS_HTML",
    path: "/prototypes/universal-compass/index.html",
    blobSha: "cd1abe75ba93e5733514ad378f52223ec53805b2",
    copiedFrom:
      "/research/archcoin-compass-calibration/neutral-reference-compass/index.html",
    role: "RUNTIME_MOUNT_AND_SEMANTIC_CONTROL_SHELL_CANDIDATE"
  }),
  createShellRecord({
    artifactId: "UNIVERSAL_COMPASS_CSS",
    path: "/prototypes/universal-compass/index.css",
    blobSha: "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa",
    copiedFrom:
      "/research/archcoin-compass-calibration/neutral-reference-compass/index.css",
    role: "PUBLISHED_STATE_PRESENTATION_SHELL_CANDIDATE"
  })
]);

export const UNIVERSAL_COMPASS_PACKAGE_IDENTITY = deepFreeze({
  recordSchema: "DGB_PROJECT_AWARENESS_PACKAGE_IDENTITY_v1",
  awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
  artifactId: createRepositoryFact(
    "UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE",
    {
      evidencePosture: "DECLARED",
      sourcePath: "/prototypes/universal-compass/",
      declaredBy: CHECKPOINT_DECLARATION
    }
  ),
  directory: createRepositoryFact("/prototypes/universal-compass/", {
    evidencePosture: "VERIFIED",
    sourcePath: "/prototypes/universal-compass/",
    declaredBy: CHECKPOINT_DECLARATION,
    derivedFrom: UNIVERSAL_COMPASS_SHELL_RECORDS.map(
      record => record.path.value
    )
  }),
  contractIdentity: createRepositoryFact(
    "DGB_UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE_CONTRACT_v1",
    {
      evidencePosture: "DECLARED",
      sourcePath: "/prototypes/universal-compass/",
      declaredBy: CHECKPOINT_DECLARATION
    }
  ),
  moduleNamespace: createRepositoryFact("DGB_UNIVERSAL_COMPASS", {
    evidencePosture: "DECLARED",
    sourcePath: "/prototypes/universal-compass/",
    declaredBy: CHECKPOINT_DECLARATION
  }),
  schemaPrefix: createRepositoryFact("UNIVERSAL_COMPASS_", {
    evidencePosture: "DECLARED",
    sourcePath: "/prototypes/universal-compass/",
    declaredBy: CHECKPOINT_DECLARATION
  }),
  lifecycleStatus: createRepositoryFact("CANDIDATE", {
    evidencePosture: "DECLARED",
    sourcePath: "/prototypes/universal-compass/",
    declaredBy: CHECKPOINT_DECLARATION
  }),
  executable: createRepositoryFact(false, {
    evidencePosture: "DECLARED",
    sourcePath: "/prototypes/universal-compass/",
    declaredBy: CHECKPOINT_DECLARATION
  }),
  accepted: createRepositoryFact(false, {
    evidencePosture: "DECLARED",
    sourcePath: "/prototypes/universal-compass/",
    declaredBy: CHECKPOINT_DECLARATION
  }),
  productionAuthorized: createRepositoryFact(false, {
    evidencePosture: "DECLARED",
    sourcePath: "/prototypes/universal-compass/",
    declaredBy: CHECKPOINT_DECLARATION
  })
});

export const REPOSITORY_SOURCE_REGISTRY = deepFreeze({
  schema: "DGB_REPOSITORY_SOURCE_REGISTRY_v1",
  awarenessAuthorityClassification: "DERIVED_AWARENESS_RECORD",
  inspectionAnchor: REPOSITORY_INSPECTION_ANCHOR,
  packageIdentity: UNIVERSAL_COMPASS_PACKAGE_IDENTITY,
  sourceRecords: UNIVERSAL_COMPASS_SHELL_RECORDS
});

export function getUniversalCompassSourceRecord(artifactId) {
  return (
    UNIVERSAL_COMPASS_SHELL_RECORDS.find(
      record => record.artifactId.value === artifactId
    ) || null
  );
}

export function getUniversalCompassSourceRecordByPath(path) {
  return (
    UNIVERSAL_COMPASS_SHELL_RECORDS.find(
      record => record.path.value === path
    ) || null
  );
}
