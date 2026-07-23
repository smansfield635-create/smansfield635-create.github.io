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
  UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD
} from "./universal-compass-four-source-cardinal-standard.js";
import {
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2
} from "./universal-compass-four-source-capability-map.v2.js";

export const CARDINAL_STANDARD_ARTIFACT_RECORDS = deepFreeze([
  {
    artifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId,
    path:
      "/research/project-awareness/universal-compass-four-source-cardinal-standard.js",
    artifactKind: "DERIVED_COMPARATIVE_STANDARD",
    authorityClassification: "DERIVED_AWARENESS_RECORD",
    lifecycleStatus: "ACTIVE",
    executableValidation: true,
    productAuthority: false,
    runtimeAuthority: false
  },
  {
    artifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.artifactId,
    path:
      "/research/project-awareness/universal-compass-four-source-capability-map.v2.js",
    artifactKind: "SUCCESSOR_CAPABILITY_MAP",
    authorityClassification: "DERIVED_AWARENESS_RECORD",
    lifecycleStatus: "ACTIVE",
    executableValidation: true,
    productAuthority: false,
    runtimeAuthority: false
  }
]);

export const CARDINAL_STANDARD_RELATIONS = deepFreeze([
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.artifactId,
    relation: "SUPERSEDES",
    toArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.supersedesArtifactId
  },
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.artifactId,
    relation: "IMPLEMENTS",
    toArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId
  },
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId,
    relation: "PROVIDES",
    toArtifactId: "SIXTEEN_CARDINAL_SOURCE_OCCURRENCES"
  },
  {
    fromArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId,
    relation: "PROVIDES",
    toArtifactId: "SIXTY_FOUR_CHILD_SEAT_SOURCE_OBSERVATIONS"
  },
  ...[
    "UNIVERSAL_COMPASS_PLANET",
    "UNIVERSAL_COMPASS_CRYSTALS",
    "UNIVERSAL_COMPASS_COMPOSITOR",
    "UNIVERSAL_COMPASS_CONTROLLER",
    "UNIVERSAL_COMPASS_INTERACTIONS",
    "UNIVERSAL_COMPASS_HTML",
    "UNIVERSAL_COMPASS_CSS"
  ].map(destinationId => ({
    fromArtifactId: destinationId,
    relation: "REQUIRES_COMPATIBILITY_WITH",
    toArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId
  }))
]);

const SNAPSHOT_V2_BODY = {
  artifactId: "UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v2",
  schema: "DGB_UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v2",
  mode: "READ_ONLY",
  baseSnapshotDigest:
    PROJECT_AWARENESS_SNAPSHOT.deterministicDigest.value,
  baseRegistrySchema:
    REPOSITORY_SOURCE_REGISTRY.schema,
  baseLedgerSchema:
    AUTHORITY_AND_STATUS_LEDGER.schema,
  baseDependencyGraphSchema:
    DEPENDENCY_GRAPH_SNAPSHOT.schema,
  activeCapabilityMapArtifactId:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.artifactId,
  activeCardinalStandardArtifactId:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId,
  comparativeAxes: deepFreeze([
    "FAMILY",
    "CARDINAL",
    "CAPABILITY"
  ]),
  extensionArtifactRecords: CARDINAL_STANDARD_ARTIFACT_RECORDS,
  extensionRelations: CARDINAL_STANDARD_RELATIONS,
  cardinalOccurrences:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.cardinalOccurrences,
  childSeatObservations:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.childSeatObservations,
  universalCardinalInvariants:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.universalCardinalInvariants,
  pass2Handoff:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.pass2Handoff,
  productAuthority: false,
  runtimeAuthority: false,
  mutationAuthority: false
};

export const UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2 = deepFreeze({
  ...SNAPSHOT_V2_BODY,
  deterministicDigest: deterministicDigest(SNAPSHOT_V2_BODY)
});

export const UNIVERSAL_COMPASS_CARDINAL_QUERY_IDS = deepFreeze([
  "FOUR_SOURCE_CARDINAL_MATRIX",
  "CARDINAL_OCCURRENCES_BY_FAMILY",
  "CARDINAL_OCCURRENCES_BY_CARDINAL",
  "CHILD_SEAT_OBSERVATIONS",
  "UNIVERSAL_CARDINAL_INVARIANTS",
  "PASS_2_CARDINAL_REQUIREMENTS"
]);

export function queryUniversalCompassCardinalAwareness(
  queryId,
  options = {}
) {
  if (!UNIVERSAL_COMPASS_CARDINAL_QUERY_IDS.includes(queryId)) {
    throw new RangeError(`UNIVERSAL_COMPASS_CARDINAL_QUERY_NOT_PERMITTED:${queryId}`);
  }
  let answer;
  switch (queryId) {
    case "FOUR_SOURCE_CARDINAL_MATRIX":
      answer = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.cardinalOccurrences;
      break;
    case "CARDINAL_OCCURRENCES_BY_FAMILY":
      answer = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.cardinalOccurrences
        .filter(record => record.family === String(options.family || "").toUpperCase());
      break;
    case "CARDINAL_OCCURRENCES_BY_CARDINAL":
      answer = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.cardinalOccurrences
        .filter(record => record.cardinal === String(options.cardinal || "").toUpperCase());
      break;
    case "CHILD_SEAT_OBSERVATIONS":
      answer = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.childSeatObservations
        .filter(record => !options.family || record.family === String(options.family).toUpperCase())
        .filter(record => !options.cardinal || record.cardinal === String(options.cardinal).toUpperCase())
        .filter(record => !options.seat || record.seat === Number(options.seat));
      break;
    case "UNIVERSAL_CARDINAL_INVARIANTS":
      answer = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.universalCardinalInvariants;
      break;
    case "PASS_2_CARDINAL_REQUIREMENTS":
      answer = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.pass2Handoff;
      break;
    default:
      throw new RangeError(`UNIVERSAL_COMPASS_CARDINAL_QUERY_NOT_IMPLEMENTED:${queryId}`);
  }
  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_CARDINAL_QUERY_RESULT_v1",
    queryId,
    snapshotDigest:
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.deterministicDigest,
    answer
  });
}

export function validateUniversalCompassProjectAwarenessSnapshotV2(
  candidate = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2
) {
  const findings = [];
  const verify = (id, pass, details = null) =>
    findings.push(deepFreeze({ id, pass: Boolean(pass), status: pass ? "PASS" : "FAIL", details }));

  verify("SCHEMA_EXACT", candidate.schema === "DGB_UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_v2");
  verify("ACTIVE_V2_CAPABILITY_MAP", candidate.activeCapabilityMapArtifactId === UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.artifactId);
  verify("ACTIVE_CARDINAL_STANDARD", candidate.activeCardinalStandardArtifactId === UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId);
  verify("CARDINAL_OCCURRENCE_COUNT", candidate.cardinalOccurrences.length === 16);
  verify("CHILD_SEAT_OBSERVATION_COUNT", candidate.childSeatObservations.length === 64);
  verify("SEVEN_DESTINATION_COMPATIBILITY_RELATIONS", candidate.extensionRelations.filter(record => record.relation === "REQUIRES_COMPATIBILITY_WITH").length === 7);
  verify("QUERY_MATRIX_COUNT", queryUniversalCompassCardinalAwareness("FOUR_SOURCE_CARDINAL_MATRIX").answer.length === 16);
  verify("QUERY_EACH_FAMILY_COUNT", ["MAIN_COMPASS", "LAW_COMPASS", "SHOWROOM_COMPASS", "ARCHCOIN_COMPASS"].every(family => queryUniversalCompassCardinalAwareness("CARDINAL_OCCURRENCES_BY_FAMILY", { family }).answer.length === 4));
  verify("QUERY_EACH_CARDINAL_COUNT", ["NORTH", "EAST", "SOUTH", "WEST"].every(cardinal => queryUniversalCompassCardinalAwareness("CARDINAL_OCCURRENCES_BY_CARDINAL", { cardinal }).answer.length === 4));
  verify("NO_AUTHORITY_PROMOTION", candidate.productAuthority === false && candidate.runtimeAuthority === false && candidate.mutationAuthority === false);
  const digestBody = { ...candidate };
  delete digestBody.deterministicDigest;
  verify("DETERMINISTIC_DIGEST_MATCH", candidate.deterministicDigest === deterministicDigest(digestBody));

  const failed = findings.filter(record => !record.pass);
  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length
    }),
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    runtimeAuthority: false,
    mutationAuthority: false
  });
}

export const UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT =
  validateUniversalCompassProjectAwarenessSnapshotV2();

if (UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT.status !== "PASS") {
  const error = new Error("UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_FAILED");
  error.receipt = UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT;
  throw error;
}
