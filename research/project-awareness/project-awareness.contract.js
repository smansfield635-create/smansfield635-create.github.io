const FACT_KEYS = Object.freeze([
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
]);

export function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) {
    deepFreeze(value[key], seen);
  }
  return Object.freeze(value);
}

export const PROJECT_AWARENESS_CONTRACT = deepFreeze({
  id: "DGB_PROJECT_AWARENESS_CONTRACT_v1",
  mode: "READ_ONLY",
  createsAuthority: false,
  permitsMutation: false,
  permitsInferenceOfMissingFacts: false,
  evidencePostures: [
    "VERIFIED",
    "DECLARED",
    "DERIVED",
    "UNRESOLVED",
    "ABSENT",
    "CONFLICTED"
  ],
  lifecycleStatuses: [
    "ACTIVE",
    "CANDIDATE",
    "SUPERSEDED",
    "RETIRED",
    "ABSENT",
    "UNRESOLVED"
  ],
  authorityClassifications: [
    "SOURCE_AUTHORITY",
    "CANDIDATE_IMPLEMENTATION",
    "VALIDATION_EVIDENCE",
    "DERIVED_AWARENESS_RECORD",
    "HISTORICAL_SOURCE",
    "SUPERSEDED_SOURCE",
    "NONCONTROLLING_BRANCH",
    "UNRESOLVED_AUTHORITY"
  ],
  relationTypes: [
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
  ],
  factKeys: FACT_KEYS
});

export const PROJECT_AWARENESS_QUERY_IDS = deepFreeze([
  "UNIVERSAL_COMPASS_FILES",
  "COPIED_SOURCES",
  "CURRENT_BLOBS",
  "INSPECTED_COMMIT",
  "PACKAGE_EXECUTABLE",
  "UNRESOLVED_DEPENDENCIES",
  "WORLD_TRUTH_OWNER",
  "PROJECTION_OWNER",
  "PERMITTED_OPERATIONS",
  "PROHIBITED_OPERATIONS",
  "CHANGES_SINCE_PREVIOUS_SNAPSHOT"
]);

const QUERY_ALIASES = deepFreeze({
  "What files constitute the Universal Compass prototype?": "UNIVERSAL_COMPASS_FILES",
  "Which source body was copied into each target?": "COPIED_SOURCES",
  "What blob currently identifies each file?": "CURRENT_BLOBS",
  "Which commit was inspected?": "INSPECTED_COMMIT",
  "Is the package executable?": "PACKAGE_EXECUTABLE",
  "Which dependencies remain unresolved?": "UNRESOLVED_DEPENDENCIES",
  "Which artifact owns world truth?": "WORLD_TRUTH_OWNER",
  "Which artifact owns projection?": "PROJECTION_OWNER",
  "What work is permitted now?": "PERMITTED_OPERATIONS",
  "What operations remain prohibited?": "PROHIBITED_OPERATIONS",
  "What changed since the previous accepted snapshot?": "CHANGES_SINCE_PREVIOUS_SNAPSHOT"
});

export function createFact({
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
  if (!PROJECT_AWARENESS_CONTRACT.evidencePostures.includes(evidencePosture)) {
    throw new TypeError(`PROJECT_AWARENESS_EVIDENCE_POSTURE_INVALID:${evidencePosture}`);
  }

  return deepFreeze({
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
  });
}

export function assertCanonicalFact(candidate, label = "FACT") {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new TypeError(`PROJECT_AWARENESS_${label}_NOT_OBJECT`);
  }
  const keys = Object.keys(candidate);
  if (keys.length !== FACT_KEYS.length || !FACT_KEYS.every(key => keys.includes(key))) {
    throw new TypeError(`PROJECT_AWARENESS_${label}_KEYS_INVALID`);
  }
  if (!PROJECT_AWARENESS_CONTRACT.evidencePostures.includes(candidate.evidencePosture)) {
    throw new TypeError(`PROJECT_AWARENESS_${label}_POSTURE_INVALID`);
  }
  return candidate;
}

export function factValue(candidate, label = "FACT") {
  return assertCanonicalFact(candidate, label).value;
}

function stableNormalize(value) {
  if (Array.isArray(value)) {
    return value.map(stableNormalize);
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((normalized, key) => {
        normalized[key] = stableNormalize(value[key]);
        return normalized;
      }, {});
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(stableNormalize(value));
}

export function deterministicDigest(value) {
  const input = stableStringify(value);
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = (hash * prime) & mask;
  }
  return `fnv1a64:${hash.toString(16).padStart(16, "0")}`;
}

function recordFact(record, key) {
  if (!record || !record.facts || !record.facts[key]) {
    throw new TypeError(`PROJECT_AWARENESS_RECORD_FACT_MISSING:${key}`);
  }
  return factValue(record.facts[key], key);
}

function cloneWithoutDigest(snapshot) {
  const clone = { ...snapshot };
  delete clone.deterministicDigest;
  return clone;
}

export function createProjectAwarenessSnapshot({
  repositoryInspection,
  sourceRecords,
  artifactRecords,
  authorityRecords,
  dependencyRelations,
  supersessionRelations,
  validationReceipts,
  unresolvedQuestions,
  permittedOperations,
  prohibitedOperations
}) {
  const repositoryIdentity = repositoryInspection.facts.repositoryIdentity;
  const inspectedCommit = repositoryInspection.facts.inspectedCommit;
  const branchIdentity = repositoryInspection.facts.branchIdentity;

  const snapshotBody = {
    schema: "DGB_PROJECT_AWARENESS_SNAPSHOT_v1",
    contractIdentity: PROJECT_AWARENESS_CONTRACT.id,
    repositoryIdentity,
    inspectedCommit,
    branchIdentity,
    sourcePaths: deepFreeze(sourceRecords.map(record => record.facts.path)),
    artifactIdentities: deepFreeze(artifactRecords.map(record => record.facts.artifactId)),
    authorityClassifications: deepFreeze(
      authorityRecords.map(record => record.facts.authorityClassification)
    ),
    dependencyRelations: deepFreeze(dependencyRelations.slice()),
    lifecycleStatuses: deepFreeze(
      artifactRecords.map(record => record.facts.lifecycleStatus)
    ),
    supersessionRelations: deepFreeze(supersessionRelations.slice()),
    evidencePostures: deepFreeze(PROJECT_AWARENESS_CONTRACT.evidencePostures.slice()),
    validationReceipts: deepFreeze(validationReceipts.slice()),
    unresolvedQuestions: deepFreeze(unresolvedQuestions.slice()),
    sourceRecords: deepFreeze(sourceRecords.slice()),
    artifactRecords: deepFreeze(artifactRecords.slice()),
    authorityRecords: deepFreeze(authorityRecords.slice()),
    permittedOperations: deepFreeze(permittedOperations.slice()),
    prohibitedOperations: deepFreeze(prohibitedOperations.slice())
  };

  const digest = deterministicDigest(snapshotBody);
  return deepFreeze({
    ...snapshotBody,
    deterministicDigest: createFact({
      value: digest,
      evidencePosture: "DERIVED",
      repositoryIdentity: factValue(repositoryIdentity),
      inspectedCommit: factValue(inspectedCommit),
      branchIdentity: factValue(branchIdentity),
      declaredBy: PROJECT_AWARENESS_CONTRACT.id,
      derivedFrom: "STABLE_NORMALIZATION_OF_SNAPSHOT_BODY"
    })
  });
}

function queryIdOf(query) {
  const candidate = typeof query === "string" ? query : query?.queryId;
  const queryId = QUERY_ALIASES[candidate] || candidate;
  if (!PROJECT_AWARENESS_QUERY_IDS.includes(queryId)) {
    throw new RangeError(`PROJECT_AWARENESS_QUERY_NOT_PERMITTED:${candidate}`);
  }
  return queryId;
}

function edgeValue(edge, key) {
  return recordFact(edge, key);
}

export function queryProjectAwarenessSnapshot(snapshot, query, options = {}) {
  const queryId = queryIdOf(query);
  let answer;

  switch (queryId) {
    case "UNIVERSAL_COMPASS_FILES":
      answer = snapshot.sourceRecords
        .filter(record => record.recordKind === "UNIVERSAL_COMPASS_SHELL_FILE")
        .map(record => recordFact(record, "path"));
      break;
    case "COPIED_SOURCES":
      answer = snapshot.sourceRecords
        .filter(record => record.recordKind === "UNIVERSAL_COMPASS_SHELL_FILE")
        .map(record => deepFreeze({
          targetPath: recordFact(record, "path"),
          copiedFrom: recordFact(record, "copiedFrom"),
          targetBlobSha: recordFact(record, "blobSha"),
          sourceBlobSha: recordFact(record, "sourceBlobSha")
        }));
      break;
    case "CURRENT_BLOBS":
      answer = snapshot.sourceRecords
        .filter(record => record.recordKind === "UNIVERSAL_COMPASS_SHELL_FILE")
        .map(record => deepFreeze({
          path: recordFact(record, "path"),
          blobSha: recordFact(record, "blobSha")
        }));
      break;
    case "INSPECTED_COMMIT":
      answer = factValue(snapshot.inspectedCommit);
      break;
    case "PACKAGE_EXECUTABLE": {
      const packageRecord = snapshot.artifactRecords.find(
        record => recordFact(record, "artifactId") === "UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE"
      );
      answer = deepFreeze({
        executable: recordFact(packageRecord, "executable"),
        lifecycleStatus: recordFact(packageRecord, "lifecycleStatus"),
        packageStatus: recordFact(packageRecord, "packageStatus")
      });
      break;
    }
    case "UNRESOLVED_DEPENDENCIES":
      answer = snapshot.unresolvedQuestions
        .filter(record => recordFact(record, "status") === "UNRESOLVED")
        .map(record => deepFreeze({
          questionId: recordFact(record, "questionId"),
          question: recordFact(record, "question"),
          blocks: recordFact(record, "blocks")
        }));
      break;
    case "WORLD_TRUTH_OWNER":
      answer = snapshot.dependencyRelations
        .filter(edge =>
          edgeValue(edge, "relation") === "DECLARES_AUTHORITY_OVER" &&
          edgeValue(edge, "toArtifactId") === "IMMUTABLE_WORLD_TRUTH"
        )
        .map(edge => edgeValue(edge, "fromArtifactId"));
      break;
    case "PROJECTION_OWNER":
      answer = snapshot.dependencyRelations
        .filter(edge =>
          edgeValue(edge, "relation") === "DECLARES_AUTHORITY_OVER" &&
          edgeValue(edge, "toArtifactId") === "PROJECTION_SNAPSHOT"
        )
        .map(edge => edgeValue(edge, "fromArtifactId"));
      break;
    case "PERMITTED_OPERATIONS":
      answer = snapshot.permittedOperations.map(operation => factValue(operation));
      break;
    case "PROHIBITED_OPERATIONS":
      answer = snapshot.prohibitedOperations.map(operation => factValue(operation));
      break;
    case "CHANGES_SINCE_PREVIOUS_SNAPSHOT":
      if (!options.previousSnapshot) {
        throw new TypeError("PROJECT_AWARENESS_PREVIOUS_SNAPSHOT_REQUIRED");
      }
      answer = compareAwarenessSnapshots(options.previousSnapshot, snapshot);
      break;
    default:
      throw new RangeError(`PROJECT_AWARENESS_QUERY_NOT_IMPLEMENTED:${queryId}`);
  }

  return deepFreeze({
    schema: "DGB_PROJECT_AWARENESS_QUERY_RESULT_v1",
    queryId,
    snapshotDigest: factValue(snapshot.deterministicDigest),
    answer
  });
}

function keyed(records, key) {
  return new Map(records.map(record => [recordFact(record, key), record]));
}

function changedBy(previousRecords, currentRecords, key, fields) {
  const previous = keyed(previousRecords, key);
  const current = keyed(currentRecords, key);
  const changed = [];
  for (const [identity, currentRecord] of current.entries()) {
    const previousRecord = previous.get(identity);
    if (!previousRecord) continue;
    const changedFields = fields.filter(
      field => stableStringify(recordFact(previousRecord, field)) !== stableStringify(recordFact(currentRecord, field))
    );
    if (changedFields.length > 0) {
      changed.push(deepFreeze({ identity, changedFields }));
    }
  }
  return changed;
}

function addedRemoved(previousRecords, currentRecords, key) {
  const previous = keyed(previousRecords, key);
  const current = keyed(currentRecords, key);
  return deepFreeze({
    added: [...current.keys()].filter(identity => !previous.has(identity)),
    removed: [...previous.keys()].filter(identity => !current.has(identity))
  });
}

export function compareAwarenessSnapshots(previousSnapshot, currentSnapshot) {
  const artifacts = addedRemoved(
    previousSnapshot.artifactRecords,
    currentSnapshot.artifactRecords,
    "artifactId"
  );
  const questions = addedRemoved(
    previousSnapshot.unresolvedQuestions,
    currentSnapshot.unresolvedQuestions,
    "questionId"
  );
  const previousEdges = new Set(previousSnapshot.dependencyRelations.map(stableStringify));
  const currentEdges = new Set(currentSnapshot.dependencyRelations.map(stableStringify));
  const previousReceipts = new Set(previousSnapshot.validationReceipts.map(stableStringify));
  const currentReceipts = new Set(currentSnapshot.validationReceipts.map(stableStringify));

  return deepFreeze({
    schema: "DGB_PROJECT_AWARENESS_COMPARISON_v1",
    previousDigest: factValue(previousSnapshot.deterministicDigest),
    currentDigest: factValue(currentSnapshot.deterministicDigest),
    addedArtifacts: artifacts.added,
    removedArtifacts: artifacts.removed,
    changedBlobs: changedBy(
      previousSnapshot.sourceRecords,
      currentSnapshot.sourceRecords,
      "path",
      ["blobSha", "sourceBlobSha"]
    ),
    changedBranches:
      factValue(previousSnapshot.branchIdentity) === factValue(currentSnapshot.branchIdentity)
        ? []
        : [deepFreeze({
            previous: factValue(previousSnapshot.branchIdentity),
            current: factValue(currentSnapshot.branchIdentity)
          })],
    changedAuthorityDeclarations: changedBy(
      previousSnapshot.authorityRecords,
      currentSnapshot.authorityRecords,
      "artifactId",
      ["authorityClassification", "authorityScope"]
    ),
    changedLifecycleStates: changedBy(
      previousSnapshot.artifactRecords,
      currentSnapshot.artifactRecords,
      "artifactId",
      ["lifecycleStatus"]
    ),
    newSupersessionRelations: currentSnapshot.supersessionRelations.filter(
      relation => !new Set(previousSnapshot.supersessionRelations.map(stableStringify)).has(stableStringify(relation))
    ),
    resolvedQuestions: questions.removed,
    newUnresolvedQuestions: questions.added,
    dependencyChanges: deepFreeze({
      added: currentSnapshot.dependencyRelations.filter(edge => !previousEdges.has(stableStringify(edge))),
      removed: previousSnapshot.dependencyRelations.filter(edge => !currentEdges.has(stableStringify(edge)))
    }),
    receiptChanges: deepFreeze({
      added: currentSnapshot.validationReceipts.filter(receipt => !previousReceipts.has(stableStringify(receipt))),
      removed: previousSnapshot.validationReceipts.filter(receipt => !currentReceipts.has(stableStringify(receipt)))
    }),
    automaticClassificationPerformed: false
  });
}

export function snapshotDigestIsValid(snapshot) {
  return factValue(snapshot.deterministicDigest) === deterministicDigest(cloneWithoutDigest(snapshot));
}
