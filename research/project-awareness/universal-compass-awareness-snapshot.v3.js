import {
  deepFreeze,
  deterministicDigest
} from "./project-awareness.contract.js";
import {
  REPOSITORY_SOURCE_REGISTRY
} from "./repository-source-registry.js";
import {
  AUTHORITY_AND_STATUS_LEDGER
} from "./authority-and-status-ledger.js";
import {
  DEPENDENCY_GRAPH_SNAPSHOT,
  PROJECT_AWARENESS_SNAPSHOT
} from "./dependency-graph.snapshot.js";
import {
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2
} from "./universal-compass-awareness-snapshot.v2.js";
import {
  UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
} from "./universal-compass-variable-cardinality-standard.js";
import {
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3
} from "./universal-compass-four-source-capability-map.v3.js";

export const VARIABLE_CARDINALITY_ARTIFACT_RECORDS = deepFreeze([
  {
    artifactId:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.artifactId,
    path:
      "/research/project-awareness/universal-compass-variable-cardinality-standard.js",
    artifactKind: "DERIVED_COMPARATIVE_STANDARD",
    authorityClassification: "DERIVED_AWARENESS_RECORD",
    lifecycleStatus: "ACTIVE",
    executableValidation: true,
    productAuthority: false,
    runtimeAuthority: false
  },
  {
    artifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.artifactId,
    path:
      "/research/project-awareness/universal-compass-four-source-capability-map.v3.js",
    artifactKind: "DERIVED_CAPABILITY_MAP",
    authorityClassification: "DERIVED_AWARENESS_RECORD",
    lifecycleStatus: "ACTIVE",
    executableValidation: true,
    productAuthority: false,
    runtimeAuthority: false
  }
]);

export const VARIABLE_CARDINALITY_SUPERSESSION_RELATIONS = deepFreeze([
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.artifactId,
    relation: "SUPERSEDES",
    toArtifactId:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .supersedesArtifactId,
    scope:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .supersessionScope,
    evidencePosture: "DECLARED"
  },
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.artifactId,
    relation: "SUPERSEDES",
    toArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3
        .supersedesArtifactId,
    scope:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3
        .supersessionScope,
    evidencePosture: "DECLARED"
  }
]);

export const VARIABLE_CARDINALITY_DEPENDENCY_RELATIONS = deepFreeze([
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.artifactId,
    relation: "IMPLEMENTS",
    toArtifactId:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.artifactId,
    evidencePosture: "DERIVED"
  },
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.artifactId,
    relation: "PROVIDES",
    toArtifactId: "SIXTEEN_CARDINAL_MEMBERSHIP_CENSUS_RECORDS",
    evidencePosture: "DERIVED"
  },
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.artifactId,
    relation: "PROHIBITED_FROM_OWNING",
    toArtifactId: "UNIVERSAL_COMPASS_RUNTIME_STATE",
    evidencePosture: "DECLARED"
  },
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.artifactId,
    relation: "REQUIRES_RECOVERY_OF",
    toArtifactId: "SOURCE_MEMBERSHIP_CENSUS",
    evidencePosture: "UNRESOLVED"
  },
  {
    fromArtifactId: "UNIVERSAL_COMPASS_PLANET",
    relation: "REQUIRES_COMPATIBILITY_WITH",
    toArtifactId:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.artifactId,
    evidencePosture: "DECLARED"
  }
]);

export const UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_QUERY_IDS = deepFreeze([
  "VARIABLE_CARDINALITY_STANDARD",
  "MEMBERSHIP_CENSUS_STATUS",
  "MEMBERSHIP_CENSUS_BY_FAMILY",
  "MEMBERSHIP_CENSUS_BY_CARDINAL",
  "WITHDRAWN_FIXED_CARDINALITY_ASSERTIONS",
  "PLANET_PREMUTATION_REQUIREMENTS",
  "OPTIONAL_RUNTIME_PROFILE"
]);

const SNAPSHOT_V3_BODY = {
  artifactId: "UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v3",
  schema: "DGB_UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v3",
  mode: "READ_ONLY",
  supersedesArtifactId:
    UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.artifactId,
  supersessionScope:
    "VARIABLE_CARDINALITY_CORRECTION_AND_SOURCE_MEMBERSHIP_CENSUS_GATE",
  repositorySourceRegistry: REPOSITORY_SOURCE_REGISTRY,
  authorityAndStatusLedger: AUTHORITY_AND_STATUS_LEDGER,
  dependencyGraphSnapshot: DEPENDENCY_GRAPH_SNAPSHOT,
  baselineAwarenessSnapshot: PROJECT_AWARENESS_SNAPSHOT,
  previousUniversalCompassAwarenessSnapshot:
    UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2,
  variableCardinalityStandard:
    UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD,
  capabilityMap:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3,
  artifactRecords: VARIABLE_CARDINALITY_ARTIFACT_RECORDS,
  supersessionRelations: VARIABLE_CARDINALITY_SUPERSESSION_RELATIONS,
  dependencyRelations: VARIABLE_CARDINALITY_DEPENDENCY_RELATIONS,
  queryIds: UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_QUERY_IDS,
  currentClassification: deepFreeze({
    fourSourceFamiliesEstablished: true,
    fourCardinalsPerFamilyEstablished: true,
    cardinalOccurrenceCount: 16,
    fixedMembersPerClusterEstablished: false,
    exactSourceMemberCountsEstablished: false,
    sourceMembershipCensusComplete: false,
    planetMutationReady: false,
    runtimeExecutable: false,
    productAuthority: false
  }),
  permittedOperations: deepFreeze([
    "READ_SOURCE_MEMBERSHIP_DECLARATIONS",
    "ENUMERATE_SOURCE_CLUSTER_MEMBERS",
    "CLASSIFY_PARTICIPANT_ROLES",
    "VERIFY_SOURCE_MEMBER_IDENTITIES",
    "VERIFY_SOURCE_MEMBER_ORDINALS",
    "BUILD_MEMBERSHIP_CENSUS_RECEIPTS",
    "COMPARE_MEMBERSHIP_ACROSS_FAMILIES_AND_CARDINALS"
  ]),
  prohibitedOperations: deepFreeze([
    "ASSUME_FOUR_MEMBERS_PER_CLUSTER",
    "PAD_SOURCE_CLUSTERS",
    "TRUNCATE_SOURCE_CLUSTERS",
    "COLLAPSE_PARTICIPANT_ROLES",
    "MUTATE_PLANET_BEFORE_CENSUS_COMPLETION",
    "IMPORT_AWARENESS_ARTIFACTS_INTO_RUNTIME",
    "CREATE_PRODUCT_AUTHORITY",
    "CREATE_RUNTIME_AUTHORITY"
  ]),
  awarenessOnlyArtifact: true,
  prototypeModified: false,
  sourceCompassesModified: false,
  productAuthority: false,
  runtimeAuthority: false,
  mutationAuthority: false
};

export const UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3 = deepFreeze({
  ...SNAPSHOT_V3_BODY,
  deterministicDigest: deterministicDigest(SNAPSHOT_V3_BODY)
});

export function queryUniversalCompassVariableCardinalityAwareness(
  queryId,
  options = {}
) {
  if (!UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_QUERY_IDS.includes(queryId)) {
    throw new RangeError(
      `UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_QUERY_NOT_PERMITTED:${queryId}`
    );
  }

  let answer;
  switch (queryId) {
    case "VARIABLE_CARDINALITY_STANDARD":
      answer = UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD;
      break;
    case "MEMBERSHIP_CENSUS_STATUS":
      answer = deepFreeze({
        totalRecords:
          UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
            .membershipCensus.length,
        completeRecords:
          UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
            .membershipCensus.filter(
              record => record.censusStatus === "COMPLETE"
            ).length,
        unresolvedRecords:
          UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
            .membershipCensus.filter(
              record => record.censusStatus !== "COMPLETE"
            ).length,
        censusComplete: false
      });
      break;
    case "MEMBERSHIP_CENSUS_BY_FAMILY": {
      const family = String(options.family || "").toUpperCase();
      answer = UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .membershipCensus.filter(record => record.family === family);
      break;
    }
    case "MEMBERSHIP_CENSUS_BY_CARDINAL": {
      const cardinal = String(options.cardinal || "").toUpperCase();
      answer = UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .membershipCensus.filter(record => record.cardinal === cardinal);
      break;
    }
    case "WITHDRAWN_FIXED_CARDINALITY_ASSERTIONS":
      answer = UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .withdrawnFixedCardinalityAssertions;
      break;
    case "PLANET_PREMUTATION_REQUIREMENTS":
      answer = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3
        .pass2Handoff;
      break;
    case "OPTIONAL_RUNTIME_PROFILE":
      answer = UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .universalRuntimeTopology.optionalInitialProfile;
      break;
    default:
      throw new RangeError(
        `UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_QUERY_NOT_IMPLEMENTED:${queryId}`
      );
  }

  return deepFreeze({
    schema:
      "DGB_UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_QUERY_RESULT_v1",
    queryId,
    snapshotDigest:
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3
        .deterministicDigest,
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

export function validateUniversalCompassAwarenessSnapshotV3(
  candidate = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3
) {
  const findings = [];

  findings.push(finding(
    "SCHEMA_EXACT",
    candidate.schema ===
      "DGB_UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v3",
    candidate.schema
  ));
  findings.push(finding(
    "VARIABLE_CARDINALITY_STANDARD_REGISTERED",
    candidate.artifactRecords.some(
      record =>
        record.artifactId ===
        UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.artifactId
    ),
    candidate.artifactRecords
  ));
  findings.push(finding(
    "SUCCESSION_CHAIN_REGISTERED",
    candidate.supersessionRelations.length === 2 &&
      candidate.supersessionRelations.every(
        relation => relation.relation === "SUPERSEDES"
      ),
    candidate.supersessionRelations
  ));
  findings.push(finding(
    "PLANET_NOT_READY_BEFORE_CENSUS",
    candidate.currentClassification.sourceMembershipCensusComplete === false &&
      candidate.currentClassification.planetMutationReady === false,
    candidate.currentClassification
  ));
  findings.push(finding(
    "BOUNDED_QUERY_SURFACE_COMPLETE",
    UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_QUERY_IDS.every(queryId => {
      const result = queryUniversalCompassVariableCardinalityAwareness(
        queryId,
        queryId === "MEMBERSHIP_CENSUS_BY_FAMILY"
          ? { family: "MAIN_COMPASS" }
          : queryId === "MEMBERSHIP_CENSUS_BY_CARDINAL"
            ? { cardinal: "NORTH" }
            : {}
      );
      return result.queryId === queryId;
    }),
    UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_QUERY_IDS
  ));
  findings.push(finding(
    "NO_AUTHORITY_CREATED",
    candidate.awarenessOnlyArtifact === true &&
      candidate.prototypeModified === false &&
      candidate.productAuthority === false &&
      candidate.runtimeAuthority === false &&
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
      "DGB_UNIVERSAL_COMPASS_AWARENESS_SNAPSHOT_V3_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      queryCount: candidate.queryIds.length,
      artifactRecordCount: candidate.artifactRecords.length
    }),
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    runtimeAuthority: false,
    mutationAuthority: false,
    prototypeModified: false
  });
}

export const UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3_VALIDATION_RECEIPT =
  validateUniversalCompassAwarenessSnapshotV3();

if (
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3_VALIDATION_RECEIPT.status !==
  "PASS"
) {
  const error = new Error(
    "UNIVERSAL_COMPASS_AWARENESS_SNAPSHOT_V3_VALIDATION_FAILED"
  );
  error.receipt =
    UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3_VALIDATION_RECEIPT;
  throw error;
}
