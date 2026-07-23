import {
  deepFreeze,
  deterministicDigest
} from "./project-awareness.contract.js";
import {
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3
} from "./universal-compass-awareness-snapshot.v3.js";
import {
  FOUR_SOURCE_CAPABILITY_MAP_V4_VALIDATION_RECEIPT,
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
} from "./universal-compass-four-source-capability-map.v4.js";

export const UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_QUERY_IDS = deepFreeze([
  "SEVEN_FILE_TRANSITION_STATUS",
  "SEVEN_FILE_TRANSITION_RECORDS",
  "SEVEN_FILE_RECORD_BY_OWNER",
  "SUPPORT_MECHANISM_RECOVERY",
  "LOCKED_TARGET_PROFILE",
  "CORE_COMPATIBILITY_HANDOFF",
  "PROHIBITED_TRANSITION_OPERATIONS"
]);

export const SEVEN_FILE_TRANSITION_ARTIFACT_RECORDS = deepFreeze([
  {
    artifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4.artifactId,
    path:
      "/research/project-awareness/universal-compass-four-source-capability-map.v4.js",
    artifactKind: "SUCCESSOR_CAPABILITY_AND_TRANSITION_MAP",
    authorityClassification: "DERIVED_AWARENESS_RECORD",
    lifecycleStatus: "ACTIVE",
    executableValidation: true,
    productAuthority: false,
    runtimeAuthority: false
  },
  {
    artifactId:
      "DGB_UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE_CONTRACT_v1",
    path: "/prototypes/universal-compass/",
    artifactKind: "CANDIDATE_SEVEN_FILE_RUNTIME_PACKAGE",
    authorityClassification: "CANDIDATE_IMPLEMENTATION",
    lifecycleStatus: "CANDIDATE",
    executableValidation: false,
    productAuthority: false,
    runtimeAuthority: false
  }
]);

export const SEVEN_FILE_TRANSITION_RELATIONS = deepFreeze([
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4.artifactId,
    relation: "SUPERSEDES",
    toArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4.supersedesArtifactId,
    scope:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4.supersessionScope,
    evidencePosture: "DECLARED"
  },
  ...UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
    .sevenFileTransitionRecords.map(record => deepFreeze({
      fromArtifactId: record.destinationOwner,
      relation: "COPIED_FROM",
      toArtifactId: record.sourcePath,
      destinationPath: record.destinationPath,
      sourceBlob: record.sourceBlob,
      destinationBlob: record.destinationBlob,
      evidencePosture: "VERIFIED"
    })),
  ...UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
    .supportMechanismRecords.map(record => deepFreeze({
      fromArtifactId:
        UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4.artifactId,
      relation: "DISTRIBUTES_MECHANISMS_FROM",
      toArtifactId: record.supportId,
      sourcePath: record.historicalPath || record.currentPath,
      sourceBlob: record.recoveredBlob || record.currentBlob,
      disposition: record.disposition,
      evidencePosture:
        record.recoveryStatus.includes("VERIFIED") ||
        record.recoveryStatus.includes("RECOVERED")
          ? "VERIFIED"
          : "DECLARED"
    }))
]);

const SNAPSHOT_V4_BODY = {
  artifactId: "UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v4",
  schema: "DGB_UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v4",
  mode: "READ_ONLY",
  supersedesArtifactId:
    UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3.artifactId,
  supersessionScope:
    "SEVEN_FILE_SHELL_TRANSITION_SUPPORT_RECOVERY_AND_CORE_COMPATIBILITY_HANDOFF",
  previousSnapshotDigest:
    UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3.deterministicDigest,
  capabilityAndTransitionMap:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4,
  transitionMapValidationReceipt:
    FOUR_SOURCE_CAPABILITY_MAP_V4_VALIDATION_RECEIPT,
  artifactRecords: SEVEN_FILE_TRANSITION_ARTIFACT_RECORDS,
  dependencyAndLineageRelations: SEVEN_FILE_TRANSITION_RELATIONS,
  queryIds: UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_QUERY_IDS,
  currentClassification: deepFreeze({
    exactSevenFileShellCopyComplete: true,
    exactSourceToDestinationBlobIdentityPreserved: true,
    exactContractsSupportBytesRecovered: true,
    exactAdaptersSupportBytesRecovered: true,
    currentMathNodesProfilesValidationAndReferenceRuntimeBytesVerified: true,
    sourceMembershipCensusRetainedAsComparativeEvidence: true,
    sourceMembershipCensusBlocksSyntheticTargetConstruction: false,
    lockedNeutralTargetCardinalStars: 4,
    lockedNeutralTargetClusters: 4,
    lockedNeutralTargetChildStars: 16,
    lockedNeutralTargetChildrenPerCluster: 4,
    compatibilityEditsComplete: false,
    supportMechanismsInternalized: false,
    htmlLoadingOrderRepaired: false,
    runtimeExecutable: false,
    prototypeAccepted: false,
    productCalibrationAuthorized: false,
    nextUnfinishedFunctionalRole:
      "/prototypes/universal-compass/index.compositor.js"
  }),
  permittedOperations: deepFreeze([
    "READ_TRANSITION_RECORDS",
    "QUERY_EXACT_SOURCE_DESTINATION_LINEAGE",
    "QUERY_SUPPORT_MECHANISM_DISPOSITIONS",
    "PREPARE_BOUNDED_CORE_COMPATIBILITY_CHANGE",
    "COMPARE_POST_CHANGE_SNAPSHOT"
  ]),
  prohibitedOperations: deepFreeze([
    "IMPORT_AWARENESS_INTO_RUNTIME",
    "CREATE_EIGHTH_RUNTIME_FILE",
    "RESTORE_SUPPORT_FILES_AS_RUNTIME_FILES",
    "MUTATE_ARCHCOIN_PRODUCT_PATHS",
    "CREATE_PRODUCT_NAVIGATION",
    "PROMOTE_OR_ACCEPT_PROTOTYPE",
    "AUTHORIZE_PRODUCT_CALIBRATION"
  ]),
  awarenessOnlyArtifact: true,
  prototypeModifiedByThisSnapshot: false,
  productAuthority: false,
  runtimeAuthority: false,
  implementationAuthority: false,
  mutationAuthority: false
};

export const UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4 = deepFreeze({
  ...SNAPSHOT_V4_BODY,
  deterministicDigest: deterministicDigest(SNAPSHOT_V4_BODY)
});

export function queryUniversalCompassSevenFileTransition(
  queryId,
  options = {}
) {
  if (!UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_QUERY_IDS.includes(queryId)) {
    throw new RangeError(
      `UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_QUERY_NOT_PERMITTED:${queryId}`
    );
  }

  let answer;
  switch (queryId) {
    case "SEVEN_FILE_TRANSITION_STATUS":
      answer = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4
        .currentClassification;
      break;
    case "SEVEN_FILE_TRANSITION_RECORDS":
      answer = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
        .sevenFileTransitionRecords;
      break;
    case "SEVEN_FILE_RECORD_BY_OWNER": {
      const owner = String(options.owner || "").toUpperCase();
      answer = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
        .sevenFileTransitionRecords.find(
          record => record.destinationOwner === owner
        ) || null;
      break;
    }
    case "SUPPORT_MECHANISM_RECOVERY":
      answer = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
        .supportMechanismRecords;
      break;
    case "LOCKED_TARGET_PROFILE":
      answer = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
        .lockedTargetProfile;
      break;
    case "CORE_COMPATIBILITY_HANDOFF":
      answer = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
        .coreCompatibilityHandoff;
      break;
    case "PROHIBITED_TRANSITION_OPERATIONS":
      answer = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4
        .prohibitedOperations;
      break;
    default:
      throw new RangeError(
        `UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_QUERY_NOT_IMPLEMENTED:${queryId}`
      );
  }

  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_QUERY_RESULT_v1",
    queryId,
    snapshotDigest:
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4.deterministicDigest,
    answer
  });
}

function finding(id, pass, details = null) {
  return deepFreeze({
    id,
    pass: Boolean(pass),
    status: pass ? "PASS" : "FAIL",
    details
  });
}

export function validateUniversalCompassAwarenessSnapshotV4(
  candidate = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4
) {
  const findings = [];

  findings.push(finding(
    "SCHEMA_EXACT",
    candidate.schema ===
      "DGB_UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v4",
    candidate.schema
  ));
  findings.push(finding(
    "TRANSITION_MAP_VALIDATION_PASS",
    candidate.transitionMapValidationReceipt.status === "PASS",
    candidate.transitionMapValidationReceipt
  ));
  findings.push(finding(
    "SEVEN_VERIFIED_COPY_RELATIONS",
    candidate.dependencyAndLineageRelations.filter(
      relation =>
        relation.relation === "COPIED_FROM" &&
        relation.evidencePosture === "VERIFIED" &&
        relation.sourceBlob === relation.destinationBlob
    ).length === 7,
    candidate.dependencyAndLineageRelations
  ));
  findings.push(finding(
    "SUPPORT_RECOVERY_QUERY_COMPLETE",
    queryUniversalCompassSevenFileTransition(
      "SUPPORT_MECHANISM_RECOVERY"
    ).answer.length === 7,
    queryUniversalCompassSevenFileTransition(
      "SUPPORT_MECHANISM_RECOVERY"
    ).answer
  ));
  findings.push(finding(
    "LOCKED_TARGET_QUERY_EXACT",
    queryUniversalCompassSevenFileTransition("LOCKED_TARGET_PROFILE")
      .answer.childStarsPerCluster === 4 &&
      queryUniversalCompassSevenFileTransition("LOCKED_TARGET_PROFILE")
        .answer.childStarCount === 16,
    queryUniversalCompassSevenFileTransition("LOCKED_TARGET_PROFILE")
      .answer
  ));
  findings.push(finding(
    "COMPOSITOR_HANDOFF_QUERY_EXACT",
    queryUniversalCompassSevenFileTransition("CORE_COMPATIBILITY_HANDOFF")
      .answer.nextUnfinishedFunctionalRole ===
      "/prototypes/universal-compass/index.compositor.js",
    queryUniversalCompassSevenFileTransition("CORE_COMPATIBILITY_HANDOFF")
      .answer
  ));
  findings.push(finding(
    "QUERY_SURFACE_COMPLETE",
    UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_QUERY_IDS.every(queryId =>
      queryUniversalCompassSevenFileTransition(
        queryId,
        queryId === "SEVEN_FILE_RECORD_BY_OWNER"
          ? { owner: "UNIVERSAL_COMPASS_COMPOSITOR" }
          : {}
      ).queryId === queryId
    ),
    UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_QUERY_IDS
  ));
  findings.push(finding(
    "NO_AUTHORITY_CREATED",
    candidate.awarenessOnlyArtifact === true &&
      candidate.prototypeModifiedByThisSnapshot === false &&
      candidate.productAuthority === false &&
      candidate.runtimeAuthority === false &&
      candidate.implementationAuthority === false &&
      candidate.mutationAuthority === false,
    {
      productAuthority: candidate.productAuthority,
      runtimeAuthority: candidate.runtimeAuthority,
      mutationAuthority: candidate.mutationAuthority
    }
  ));

  const digestBody = { ...candidate };
  delete digestBody.deterministicDigest;
  const recomputedDigest = deterministicDigest(digestBody);
  findings.push(finding(
    "DETERMINISTIC_DIGEST_MATCH",
    candidate.deterministicDigest === recomputedDigest,
    {
      recorded: candidate.deterministicDigest,
      recomputed: recomputedDigest
    }
  ));

  const failed = findings.filter(record => !record.pass);
  return deepFreeze({
    schema:
      "DGB_UNIVERSAL_COMPASS_AWARENESS_SNAPSHOT_V4_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      queryCount: candidate.queryIds.length,
      transitionRecordCount:
        candidate.capabilityAndTransitionMap
          .sevenFileTransitionRecords.length,
      supportMechanismRecordCount:
        candidate.capabilityAndTransitionMap
          .supportMechanismRecords.length
    }),
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    runtimeAuthority: false,
    mutationAuthority: false,
    prototypeModified: false
  });
}

export const UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4_VALIDATION_RECEIPT =
  validateUniversalCompassAwarenessSnapshotV4();

if (
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4_VALIDATION_RECEIPT
    .status !== "PASS"
) {
  const error = new Error(
    "UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4_VALIDATION_FAILED"
  );
  error.receipt =
    UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V4_VALIDATION_RECEIPT;
  throw error;
}
