import {
  deepFreeze,
  deterministicDigest
} from "./project-awareness.contract.js";
import {
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP
} from "./universal-compass-four-source-capability-map.js";

export const UNIVERSAL_COMPASS_SOURCE_FAMILIES = deepFreeze([
  "MAIN_COMPASS",
  "LAW_COMPASS",
  "SHOWROOM_COMPASS",
  "ARCHCOIN_COMPASS"
]);

export const UNIVERSAL_COMPASS_CARDINALS = deepFreeze([
  "NORTH",
  "EAST",
  "SOUTH",
  "WEST"
]);

export const UNIVERSAL_COMPASS_CHILD_SEATS = deepFreeze([1, 2, 3, 4]);

const FAMILY_CARDINAL_SEMANTICS = deepFreeze({
  MAIN_COMPASS: {
    NORTH: "MAIN_NORTH_WING",
    EAST: "MAIN_EAST_WING",
    SOUTH: "MAIN_SOUTH_WING",
    WEST: "MAIN_WEST_WING"
  },
  LAW_COMPASS: {
    NORTH: "FLOW",
    EAST: "INTEGRITY",
    SOUTH: "REALITY",
    WEST: "STRUCTURE"
  },
  SHOWROOM_COMPASS: {
    NORTH: "STORY",
    EAST: "CHARACTERS",
    SOUTH: "WONDERS",
    WEST: "MYSTERIES"
  },
  ARCHCOIN_COMPASS: {
    NORTH: "CONTRACT",
    EAST: "RECEIVABLE",
    SOUTH: "PAYABLE",
    WEST: "ALLOCATION"
  }
});

function factValue(candidate) {
  return candidate && typeof candidate === "object" && "value" in candidate
    ? candidate.value
    : candidate;
}

function sourceIdsForFamily(family) {
  return UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.sourceRecords
    .filter(record => factValue(record.facts.family) === family)
    .map(record => factValue(record.facts.sourceId));
}

function cardinalOccurrence(family, cardinal) {
  return deepFreeze({
    occurrenceId: `${family}_${cardinal}_CARDINAL_OCCURRENCE`,
    family,
    cardinal,
    semanticIdentity: FAMILY_CARDINAL_SEMANTICS[family][cardinal],
    structuralClass: "CARDINAL",
    structuralComparability: true,
    semanticEquivalenceAcrossFamilies: false,
    runtimeIdentityTransferred: false,
    sourceAuthorityTransferred: false,
    ownsOneClusterClass: true,
    childSeatCount: 4,
    comparisonDimensions: deepFreeze([
      "CARDINAL_IDENTITY",
      "BASE_WORLD_VECTOR",
      "CLUSTER_OWNERSHIP",
      "CHILD_MEMBERSHIP",
      "PRIMARY_ANCHOR_BEHAVIOR",
      "ORIENTATION_AND_SETTLEMENT",
      "SELECTION_TRANSITIONS",
      "SEMANTIC_CONTROL",
      "ROUTE_OR_ACTION_ASSOCIATION",
      "VISUAL_MATERIAL",
      "PROJECTION_AND_DEPTH",
      "INTERACTION_ELIGIBILITY"
    ]),
    prohibitedMergeDimensions: deepFreeze([
      "DOMAIN_MEANING",
      "PAGE_CONTENT",
      "PRODUCT_ROUTE",
      "PRODUCT_IDENTITY",
      "SOURCE_SPECIFIC_NARRATIVE"
    ]),
    sourceRecordIds: deepFreeze(sourceIdsForFamily(family)),
    evidencePosture: "DERIVED"
  });
}

export const FOUR_FAMILY_CARDINAL_OCCURRENCES = deepFreeze(
  UNIVERSAL_COMPASS_SOURCE_FAMILIES.flatMap(family =>
    UNIVERSAL_COMPASS_CARDINALS.map(cardinal =>
      cardinalOccurrence(family, cardinal)
    )
  )
);

export const FOUR_FAMILY_CHILD_SEAT_OBSERVATIONS = deepFreeze(
  FOUR_FAMILY_CARDINAL_OCCURRENCES.flatMap(occurrence =>
    UNIVERSAL_COMPASS_CHILD_SEATS.map(seat => deepFreeze({
      observationId: `${occurrence.family}_${occurrence.cardinal}_CHILD_SEAT_${seat}`,
      family: occurrence.family,
      cardinal: occurrence.cardinal,
      seat,
      parentOccurrenceId: occurrence.occurrenceId,
      structuralClass: "CHILD_SEAT_OBSERVATION",
      structuralComparability: true,
      semanticIdentity: null,
      semanticIdentityStatus: "UNRESOLVED_FAMILY_LOCAL",
      runtimeIdentityTransferred: false,
      sourceAuthorityTransferred: false,
      evidencePosture: "DERIVED"
    }))
  )
);

export const UNIVERSAL_CARDINAL_INVARIANTS = deepFreeze([
  "EXACTLY_FOUR_RUNTIME_CARDINALS",
  "EACH_CARDINAL_HAS_UNIQUE_STABLE_WORLD_IDENTITY",
  "EACH_CARDINAL_HAS_CANONICAL_BASE_VECTOR",
  "EACH_CARDINAL_OWNS_ONE_CLUSTER_CLASS",
  "EACH_CARDINAL_EXPOSES_FOUR_CHILD_SEATS",
  "EACH_CARDINAL_HAS_PRIMARY_ANCHOR_RELATION",
  "EACH_CARDINAL_HAS_SEMANTIC_CONTROL_RELATION",
  "EACH_CARDINAL_PARTICIPATES_IN_LEGAL_PRESENTATION_TRANSITIONS",
  "CARDINAL_POSITION_IS_STRUCTURAL",
  "CARDINAL_CONTENT_REMAINS_FAMILY_LOCAL",
  "SOURCE_OBSERVATIONS_DO_NOT_CREATE_RUNTIME_AUTHORITY"
]);

export const CARDINAL_STANDARD_PROHIBITIONS = deepFreeze([
  "DO_NOT_CREATE_SIXTEEN_RUNTIME_CARDINALS",
  "DO_NOT_TREAT_CARDINAL_SEMANTICS_AS_EQUIVALENT",
  "DO_NOT_ASSIGN_ONE_SOURCE_FAMILY_TO_ONE_CARDINAL",
  "DO_NOT_TRANSFER_SOURCE_ROUTES",
  "DO_NOT_TRANSFER_PRODUCT_IDENTITY",
  "DO_NOT_TRANSFER_SOURCE_AUTHORITY",
  "DO_NOT_IMPORT_AWARENESS_ARTIFACTS_INTO_RUNTIME",
  "DO_NOT_RESTORE_RETIRED_SUPPORT_FILES"
]);

const STANDARD_BODY = {
  artifactId: "UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_COMPARATIVE_STANDARD_v1",
  schema: "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_COMPARATIVE_STANDARD_v1",
  mode: "READ_ONLY_COMPARATIVE_STANDARD",
  extendsArtifactId:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.artifactId,
  baseCapabilityMapDigest:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.deterministicDigest,
  comparativeAxes: deepFreeze([
    "FAMILY",
    "CARDINAL",
    "CAPABILITY"
  ]),
  sourceFamilies: UNIVERSAL_COMPASS_SOURCE_FAMILIES,
  cardinals: UNIVERSAL_COMPASS_CARDINALS,
  childSeats: UNIVERSAL_COMPASS_CHILD_SEATS,
  sourceObservationTopology: deepFreeze({
    familyCount: 4,
    cardinalsPerFamily: 4,
    cardinalOccurrenceCount: 16,
    childSeatsPerCardinal: 4,
    childSeatObservationCount: 64
  }),
  universalRuntimeTopology: deepFreeze({
    cardinalCount: 4,
    clusterCount: 4,
    childCount: 16
  }),
  structuralComparability: true,
  semanticEquivalenceAcrossFamilies: false,
  runtimeIdentityTransfer: false,
  sourceAuthorityTransfer: false,
  cardinalOccurrences: FOUR_FAMILY_CARDINAL_OCCURRENCES,
  childSeatObservations: FOUR_FAMILY_CHILD_SEAT_OBSERVATIONS,
  universalCardinalInvariants: UNIVERSAL_CARDINAL_INVARIANTS,
  capabilityAxisBinding: deepFreeze(
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.capabilityMatrix.map(
      record => record.capabilityId
    )
  ),
  prohibitions: CARDINAL_STANDARD_PROHIBITIONS,
  pass2Handoff: deepFreeze({
    primaryTarget: "/prototypes/universal-compass/index.planet.js",
    requiredComparativeAxis: "FAMILY_X_CARDINAL_X_CAPABILITY",
    requiredCardinalInputs: deepFreeze([
      "CARDINAL_IDENTITY",
      "BASE_WORLD_VECTOR",
      "CLUSTER_OWNERSHIP",
      "CHILD_MEMBERSHIP",
      "PRIMARY_ANCHOR_BEHAVIOR",
      "ORIENTATION_AND_SETTLEMENT"
    ]),
    mutationAuthority: "NOT_GRANTED_BY_THIS_ARTIFACT",
    implementationSelectionStatus: "PENDING_SOURCE_EXECUTION"
  }),
  awarenessOnlyArtifact: true,
  prototypeModified: false,
  sourceCompassesModified: false,
  productAuthority: false,
  implementationAuthority: false,
  mutationAuthority: false
};

export const UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD = deepFreeze({
  ...STANDARD_BODY,
  deterministicDigest: deterministicDigest(STANDARD_BODY)
});

function finding(id, pass, details = null) {
  return deepFreeze({ id, pass: Boolean(pass), status: pass ? "PASS" : "FAIL", details });
}

export function validateUniversalCompassFourSourceCardinalStandard(
  candidate = UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD
) {
  const findings = [];
  const familySet = new Set(candidate.sourceFamilies);
  const cardinalSet = new Set(candidate.cardinals);
  const occurrenceIds = candidate.cardinalOccurrences.map(record => record.occurrenceId);
  const observationIds = candidate.childSeatObservations.map(record => record.observationId);

  findings.push(finding(
    "SCHEMA_EXACT",
    candidate.schema === "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_COMPARATIVE_STANDARD_v1",
    candidate.schema
  ));
  findings.push(finding(
    "EXACT_FOUR_FAMILIES",
    familySet.size === 4 && UNIVERSAL_COMPASS_SOURCE_FAMILIES.every(value => familySet.has(value)),
    Array.from(familySet)
  ));
  findings.push(finding(
    "EXACT_FOUR_CARDINALS",
    cardinalSet.size === 4 && UNIVERSAL_COMPASS_CARDINALS.every(value => cardinalSet.has(value)),
    Array.from(cardinalSet)
  ));
  findings.push(finding(
    "EXACT_SIXTEEN_CARDINAL_OCCURRENCES",
    occurrenceIds.length === 16 && new Set(occurrenceIds).size === 16,
    occurrenceIds
  ));
  findings.push(finding(
    "EVERY_FAMILY_HAS_ALL_FOUR_CARDINALS",
    candidate.sourceFamilies.every(family => {
      const found = new Set(candidate.cardinalOccurrences
        .filter(record => record.family === family)
        .map(record => record.cardinal));
      return candidate.cardinals.every(cardinal => found.has(cardinal));
    })
  ));
  findings.push(finding(
    "EVERY_CARDINAL_HAS_ALL_FOUR_FAMILIES",
    candidate.cardinals.every(cardinal => {
      const found = new Set(candidate.cardinalOccurrences
        .filter(record => record.cardinal === cardinal)
        .map(record => record.family));
      return candidate.sourceFamilies.every(family => found.has(family));
    })
  ));
  findings.push(finding(
    "EXACT_SIXTY_FOUR_CHILD_SEAT_OBSERVATIONS",
    observationIds.length === 64 && new Set(observationIds).size === 64,
    observationIds.length
  ));
  findings.push(finding(
    "STRUCTURAL_COMPARABILITY_WITHOUT_SEMANTIC_COLLAPSE",
    candidate.structuralComparability === true &&
      candidate.semanticEquivalenceAcrossFamilies === false &&
      candidate.cardinalOccurrences.every(record =>
        record.structuralComparability === true &&
        record.semanticEquivalenceAcrossFamilies === false
      )
  ));
  findings.push(finding(
    "UNIVERSAL_RUNTIME_REMAINS_FOUR_FOUR_SIXTEEN",
    candidate.universalRuntimeTopology.cardinalCount === 4 &&
      candidate.universalRuntimeTopology.clusterCount === 4 &&
      candidate.universalRuntimeTopology.childCount === 16,
    candidate.universalRuntimeTopology
  ));
  findings.push(finding(
    "NO_ONE_FAMILY_ONE_CARDINAL_MAPPING",
    candidate.sourceFamilies.every(family =>
      candidate.cardinalOccurrences.filter(record => record.family === family).length === 4
    )
  ));
  findings.push(finding(
    "SOURCE_RECORD_REFERENCES_RESOLVE",
    candidate.cardinalOccurrences.every(record =>
      record.sourceRecordIds.length > 0 &&
      record.sourceRecordIds.every(sourceId =>
        UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.sourceRecords.some(
          sourceRecord => factValue(sourceRecord.facts.sourceId) === sourceId
        )
      )
    )
  ));
  findings.push(finding(
    "CAPABILITY_AXIS_COVERS_BASE_MAP",
    candidate.capabilityAxisBinding.length ===
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.capabilityMatrix.length &&
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.capabilityMatrix.every(record =>
        candidate.capabilityAxisBinding.includes(record.capabilityId)
      )
  ));
  findings.push(finding(
    "NO_RUNTIME_OR_PRODUCT_AUTHORITY",
    candidate.awarenessOnlyArtifact === true &&
      candidate.prototypeModified === false &&
      candidate.sourceCompassesModified === false &&
      candidate.productAuthority === false &&
      candidate.implementationAuthority === false &&
      candidate.mutationAuthority === false
  ));
  const digestBody = { ...candidate };
  delete digestBody.deterministicDigest;
  findings.push(finding(
    "DETERMINISTIC_DIGEST_MATCH",
    candidate.deterministicDigest === deterministicDigest(digestBody),
    candidate.deterministicDigest
  ));

  const failed = findings.filter(record => !record.pass);
  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      sourceFamilyCount: candidate.sourceFamilies.length,
      cardinalCount: candidate.cardinals.length,
      cardinalOccurrenceCount: candidate.cardinalOccurrences.length,
      childSeatObservationCount: candidate.childSeatObservations.length
    }),
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    implementationAuthority: false,
    mutationAuthority: false
  });
}

export const FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT =
  validateUniversalCompassFourSourceCardinalStandard();

if (FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT.status !== "PASS") {
  const error = new Error("UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_FAILED");
  error.receipt = FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT;
  throw error;
}
