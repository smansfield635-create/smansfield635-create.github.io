import {
  deepFreeze,
  deterministicDigest
} from "./project-awareness.contract.js";
import {
  FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT,
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP
} from "./universal-compass-four-source-capability-map.js";
import {
  FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT,
  UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD
} from "./universal-compass-four-source-cardinal-standard.js";

const MAP_V2_BODY = {
  artifactId: "UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_PASS_1_v2",
  schema: "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_v2",
  mode: "READ_ONLY_SOURCE_SELECTION_SUPPORT",
  supersedesArtifactId:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.artifactId,
  supersessionScope:
    "CAPABILITY_MAP_COMPARATIVE_AXIS_EXTENSION_ONLY",
  baseCapabilityMapDigest:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.deterministicDigest,
  cardinalStandardArtifactId:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId,
  cardinalStandardDigest:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.deterministicDigest,
  comparativeAxes: deepFreeze([
    "FAMILY",
    "CARDINAL",
    "CAPABILITY"
  ]),
  sourceFamilies:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.sourceFamilies,
  sourceRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.sourceRecords,
  destinationRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.destinationRecords,
  capabilityMatrix:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.capabilityMatrix,
  cardinalMatrix:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.cardinalOccurrences,
  childSeatObservationMatrix:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.childSeatObservations,
  universalCardinalInvariants:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.universalCardinalInvariants,
  structuralComparability: true,
  semanticEquivalenceAcrossFamilies: false,
  universalRuntimeTopology:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.universalRuntimeTopology,
  sourceObservationTopology:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.sourceObservationTopology,
  sourceSelectionRules:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.sourceSelectionRules,
  knownConflictAndBoundaryRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.knownConflictAndBoundaryRecords,
  absenceRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.absenceRecords,
  pass2Handoff: deepFreeze({
    ...UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.pass2Handoff,
    requiredComparativeAxis: "FAMILY_X_CARDINAL_X_CAPABILITY",
    requiredCardinalStandardArtifactId:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId,
    requiredCardinalInputs:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.pass2Handoff
        .requiredCardinalInputs,
    mutationAuthority: "NOT_GRANTED_BY_THIS_ARTIFACT"
  }),
  permittedUses: deepFreeze([
    ...UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.permittedUses,
    "CARDINAL_OCCURRENCE_COMPARISON",
    "CARDINAL_ASYMMETRY_DETECTION",
    "CHILD_SEAT_OBSERVATION_COMPARISON",
    "UNIVERSAL_CARDINAL_INVARIANT_DERIVATION"
  ]),
  prohibitedUses: deepFreeze([
    ...UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.prohibitedUses,
    "SEMANTIC_CARDINAL_COLLAPSE",
    "SIXTEEN_RUNTIME_CARDINAL_CREATION",
    "ONE_FAMILY_ONE_CARDINAL_ASSIGNMENT"
  ]),
  awarenessOnlyArtifact: true,
  prototypeModifiedByPassOne: false,
  sourceCompassesModifiedByPassOne: false,
  productAuthority: false,
  implementationAuthority: false,
  mutationAuthority: false
};

export const UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2 = deepFreeze({
  ...MAP_V2_BODY,
  deterministicDigest: deterministicDigest(MAP_V2_BODY)
});

function finding(id, pass, details = null) {
  return deepFreeze({ id, pass: Boolean(pass), status: pass ? "PASS" : "FAIL", details });
}

export function validateUniversalCompassFourSourceCapabilityMapV2(
  candidate = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2
) {
  const findings = [];
  findings.push(finding(
    "BASE_CAPABILITY_MAP_PASS",
    FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT.status === "PASS"
  ));
  findings.push(finding(
    "CARDINAL_STANDARD_PASS",
    FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT.status === "PASS"
  ));
  findings.push(finding(
    "V2_SUPERSEDES_V1",
    candidate.supersedesArtifactId ===
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP.artifactId
  ));
  findings.push(finding(
    "THREE_COMPARATIVE_AXES",
    ["FAMILY", "CARDINAL", "CAPABILITY"].every(axis =>
      candidate.comparativeAxes.includes(axis)
    )
  ));
  findings.push(finding(
    "SIXTEEN_CARDINAL_OCCURRENCES",
    candidate.cardinalMatrix.length === 16
  ));
  findings.push(finding(
    "SIXTY_FOUR_CHILD_SEAT_OBSERVATIONS",
    candidate.childSeatObservationMatrix.length === 64
  ));
  findings.push(finding(
    "STRUCTURAL_NOT_SEMANTIC_EQUIVALENCE",
    candidate.structuralComparability === true &&
      candidate.semanticEquivalenceAcrossFamilies === false
  ));
  findings.push(finding(
    "PASS_2_REQUIRES_CARDINAL_AXIS",
    candidate.pass2Handoff.requiredComparativeAxis ===
      "FAMILY_X_CARDINAL_X_CAPABILITY" &&
      candidate.pass2Handoff.primaryTarget ===
      "/prototypes/universal-compass/index.planet.js"
  ));
  findings.push(finding(
    "NO_AUTHORITY_PROMOTION",
    candidate.awarenessOnlyArtifact === true &&
      candidate.prototypeModifiedByPassOne === false &&
      candidate.sourceCompassesModifiedByPassOne === false &&
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
    schema: "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      capabilityCount: candidate.capabilityMatrix.length,
      cardinalOccurrenceCount: candidate.cardinalMatrix.length,
      childSeatObservationCount: candidate.childSeatObservationMatrix.length
    }),
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    implementationAuthority: false,
    mutationAuthority: false
  });
}

export const FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_RECEIPT =
  validateUniversalCompassFourSourceCapabilityMapV2();

if (FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_RECEIPT.status !== "PASS") {
  const error = new Error("UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_FAILED");
  error.receipt = FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_RECEIPT;
  throw error;
}
