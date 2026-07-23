import {
  deepFreeze,
  deterministicDigest
} from "./project-awareness.contract.js";
import {
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2
} from "./universal-compass-four-source-capability-map.v2.js";
import {
  UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD,
  VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT
} from "./universal-compass-variable-cardinality-standard.js";

const VARIABLE_MEMBERSHIP_CAPABILITY = deepFreeze({
  capabilityId: "VARIABLE_CLUSTER_MEMBERSHIP_AND_PARTICIPANT_ROLES",
  destinationOwner: "UNIVERSAL_COMPASS_PLANET",
  supportingDestinationOwners: deepFreeze([
    "UNIVERSAL_COMPASS_CRYSTALS",
    "UNIVERSAL_COMPASS_COMPOSITOR",
    "UNIVERSAL_COMPASS_CONTROLLER",
    "UNIVERSAL_COMPASS_INTERACTIONS",
    "UNIVERSAL_COMPASS_HTML",
    "UNIVERSAL_COMPASS_CSS"
  ]),
  requiredOutcomes: deepFreeze([
    "COUNT_AGNOSTIC_MEMBER_COLLECTIONS",
    "STABLE_MEMBER_IDENTITIES",
    "SOURCE_ORDINAL_PRESERVATION",
    "DERIVED_MEMBER_COUNTS",
    "EXPLICIT_NAVIGABLE_MEMBER_FLAG",
    "EXPLICIT_SELECTABLE_MEMBER_FLAG",
    "EXPLICIT_PRIMARY_ELIGIBILITY_FLAG",
    "EXPLICIT_CENTER_PARTICIPANT_FLAG",
    "EXPLICIT_OPTIONAL_PARTICIPANT_FLAG",
    "EXPLICIT_VISUAL_ONLY_FLAG",
    "NO_MEMBER_PADDING",
    "NO_MEMBER_TRUNCATION"
  ]),
  sourceAssessments: deepFreeze(
    UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.sourceFamilies.map(
      family => deepFreeze({
        family,
        status: "INSPECTION_REQUIRED",
        reason:
          "EXACT_PER_CARDINAL_MEMBERSHIP_CENSUS_NOT_YET_COMPLETED"
      })
    )
  ),
  selectionStatus: "BLOCKED_PENDING_SOURCE_CENSUS",
  implementationAuthority: false
});

const MAP_V3_BODY = {
  artifactId: "UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_PASS_1_v3",
  schema: "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_v3",
  mode: "READ_ONLY_SOURCE_SELECTION_SUPPORT",
  supersedesArtifactId:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.artifactId,
  supersessionScope:
    "REPLACE_FIXED_CHILD_SEAT_AXIS_WITH_VARIABLE_SOURCE_DERIVED_MEMBERSHIP_AXIS",
  baseCapabilityMapV2Digest:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.deterministicDigest,
  variableCardinalityStandardArtifactId:
    UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.artifactId,
  variableCardinalityStandardDigest:
    UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.deterministicDigest,
  variableCardinalityStandardValidationStatus:
    VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT.status,
  comparativeAxes: deepFreeze([
    "FAMILY",
    "CARDINAL",
    "CAPABILITY",
    "VARIABLE_MEMBERSHIP"
  ]),
  sourceFamilies:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.sourceFamilies,
  sourceRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.sourceRecords,
  destinationRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.destinationRecords,
  capabilityMatrix: deepFreeze([
    ...UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.capabilityMatrix,
    VARIABLE_MEMBERSHIP_CAPABILITY
  ]),
  absenceRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.absenceRecords,
  knownConflictAndBoundaryRecords: deepFreeze([
    ...UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2
      .knownConflictAndBoundaryRecords,
    deepFreeze({
      conflictId: "FIXED_FOUR_CHILD_SEAT_STANDARD_WITHDRAWN",
      status: "RESOLVED_BY_SUCCESSOR",
      previousAssertion:
        "EACH_CARDINAL_EXPOSES_FOUR_CHILD_SEATS",
      currentRule:
        "CLUSTER_MEMBER_COUNT_IS_SOURCE_DERIVED_AND_VARIABLE",
      sourceAuthorityTransferred: false,
      runtimeAuthorityCreated: false
    }),
    deepFreeze({
      conflictId: "SIXTY_FOUR_CHILD_OBSERVATION_COUNT_WITHDRAWN",
      status: "RESOLVED_BY_SUCCESSOR",
      previousAssertion:
        "FOUR_FAMILIES_X_FOUR_CARDINALS_X_FOUR_CHILD_SEATS_EQUALS_SIXTY_FOUR",
      currentRule:
        "TOTAL_MEMBER_OBSERVATIONS_EQUAL_THE_SUM_OF_ACTUAL_SOURCE_MEMBERSHIP_COUNTS",
      sourceAuthorityTransferred: false,
      runtimeAuthorityCreated: false
    })
  ]),
  sourceSelectionRules: deepFreeze({
    ...UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.sourceSelectionRules,
    fixedClusterMemberCardinality: false,
    sourceMembershipCensusRequired: true,
    paddingProhibited: true,
    truncationProhibited: true,
    participantRoleClassificationRequired: true
  }),
  membershipCensus:
    UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.membershipCensus,
  withdrawnFixedCardinalityAssertions:
    UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
      .withdrawnFixedCardinalityAssertions,
  pass2Handoff: deepFreeze({
    primaryTarget: "/prototypes/universal-compass/index.planet.js",
    requiredComparativeAxis:
      "FAMILY_X_CARDINAL_X_CAPABILITY_X_VARIABLE_MEMBERSHIP",
    requiredPreMutationStep:
      "COMPLETE_SOURCE_MEMBERSHIP_CENSUS_FOR_ALL_SIXTEEN_CARDINAL_OCCURRENCES",
    sourceMembershipCensusComplete: false,
    unresolvedCensusRecordCount:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.membershipCensus.length,
    proposedMutationScope: deepFreeze([
      "/prototypes/universal-compass/index.planet.js"
    ]),
    requiredPlanetCapabilities: deepFreeze([
      "WORLD_IDENTITY_MEMBERSHIP_AND_SNAPSHOT",
      "QUATERNION_VECTOR_AND_SETTLEMENT_MATHEMATICS",
      "CONSTELLATION_AND_CLUSTER_SPATIAL_RELATIONS",
      "RECEIPTS_VALIDATION_DETERMINISM_AND_IMMUTABILITY",
      "VARIABLE_CLUSTER_MEMBERSHIP_AND_PARTICIPANT_ROLES"
    ]),
    forbiddenInPass2: deepFreeze([
      "ASSUME_FOUR_MEMBERS_PER_CLUSTER",
      "PAD_SOURCE_CLUSTERS",
      "TRUNCATE_SOURCE_CLUSTERS",
      "COLLAPSE_CENTER_PARTICIPANTS_INTO_NAVIGABLE_MEMBERS",
      "COLLAPSE_OPTIONAL_PARTICIPANTS_INTO_REQUIRED_MEMBERS",
      "IMPORT_PROJECT_AWARENESS_INTO_RUNTIME",
      "RESTORE_RETIRED_SUPPORT_FILES",
      "CREATE_EIGHTH_RUNTIME_FILE",
      "MUTATE_SOURCE_COMPASSES",
      "MUTATE_ARCHCOIN_PRODUCT_PATH"
    ]),
    mutationAuthority: "NOT_GRANTED_BY_THIS_ARTIFACT",
    implementationSelectionStatus: "BLOCKED_PENDING_SOURCE_CENSUS"
  }),
  permittedUses: deepFreeze([
    "BOUNDED_SOURCE_LOOKUP",
    "CAPABILITY_COMPARISON",
    "CARDINAL_COMPARISON",
    "VARIABLE_MEMBERSHIP_CENSUS",
    "PARTICIPANT_ROLE_CLASSIFICATION",
    "DESTINATION_OWNER_ROUTING",
    "CONFLICT_VISIBILITY",
    "PASS_2_INPUT_SELECTION_AFTER_CENSUS",
    "AWARENESS_RECEIPT_GENERATION"
  ]),
  prohibitedUses: deepFreeze([
    "AUTOMATIC_CODE_SELECTION",
    "AUTOMATIC_PRODUCT_MUTATION",
    "SOURCE_AUTHORITY_TRANSFER",
    "SOURCE_STATUS_TRANSFER",
    "FIXED_MEMBER_CARDINALITY_INFERENCE",
    "PROTOTYPE_ACCEPTANCE",
    "RUNTIME_ACCEPTANCE",
    "VISUAL_ACCEPTANCE",
    "PRODUCTION_AUTHORIZATION"
  ]),
  awarenessOnlyArtifact: true,
  prototypeModified: false,
  sourceCompassesModified: false,
  productAuthority: false,
  runtimeAuthority: false,
  implementationAuthority: false,
  mutationAuthority: false
};

export const UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3 = deepFreeze({
  ...MAP_V3_BODY,
  deterministicDigest: deterministicDigest(MAP_V3_BODY)
});

function finding(id, pass, details = null) {
  return deepFreeze({
    id,
    pass: Boolean(pass),
    status: pass ? "PASS" : "FAIL",
    details
  });
}

export function validateUniversalCompassFourSourceCapabilityMapV3(
  candidate = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3
) {
  const findings = [];

  findings.push(finding(
    "SCHEMA_EXACT",
    candidate.schema ===
      "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_v3",
    candidate.schema
  ));
  findings.push(finding(
    "VARIABLE_MEMBERSHIP_AXIS_PRESENT",
    candidate.comparativeAxes.includes("VARIABLE_MEMBERSHIP") &&
      candidate.capabilityMatrix.some(
        capability =>
          capability.capabilityId ===
          "VARIABLE_CLUSTER_MEMBERSHIP_AND_PARTICIPANT_ROLES"
      ),
    candidate.comparativeAxes
  ));
  findings.push(finding(
    "FIXED_MEMBER_CARDINALITY_DISABLED",
    candidate.sourceSelectionRules.fixedClusterMemberCardinality === false &&
      candidate.sourceSelectionRules.sourceMembershipCensusRequired === true,
    candidate.sourceSelectionRules
  ));
  findings.push(finding(
    "PADDING_AND_TRUNCATION_PROHIBITED",
    candidate.sourceSelectionRules.paddingProhibited === true &&
      candidate.sourceSelectionRules.truncationProhibited === true &&
      candidate.pass2Handoff.forbiddenInPass2.includes(
        "PAD_SOURCE_CLUSTERS"
      ) &&
      candidate.pass2Handoff.forbiddenInPass2.includes(
        "TRUNCATE_SOURCE_CLUSTERS"
      ),
    candidate.pass2Handoff.forbiddenInPass2
  ));
  findings.push(finding(
    "SIXTEEN_CENSUS_RECORDS_REQUIRED",
    candidate.membershipCensus.length === 16 &&
      candidate.membershipCensus.every(
        record =>
          record.censusStatus === "UNRESOLVED_SOURCE_CENSUS_REQUIRED"
      ),
    candidate.membershipCensus.map(record => record.censusStatus)
  ));
  findings.push(finding(
    "PLANET_PASS_BLOCKED_PENDING_CENSUS",
    candidate.pass2Handoff.sourceMembershipCensusComplete === false &&
      candidate.pass2Handoff.implementationSelectionStatus ===
        "BLOCKED_PENDING_SOURCE_CENSUS",
    candidate.pass2Handoff
  ));
  findings.push(finding(
    "NO_AUTHORITY_CREATED",
    candidate.awarenessOnlyArtifact === true &&
      candidate.prototypeModified === false &&
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
      "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      capabilityCount: candidate.capabilityMatrix.length,
      membershipCensusRecordCount: candidate.membershipCensus.length
    }),
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    runtimeAuthority: false,
    mutationAuthority: false,
    prototypeModified: false
  });
}

export const FOUR_SOURCE_CAPABILITY_MAP_V3_VALIDATION_RECEIPT =
  validateUniversalCompassFourSourceCapabilityMapV3();

if (FOUR_SOURCE_CAPABILITY_MAP_V3_VALIDATION_RECEIPT.status !== "PASS") {
  const error = new Error(
    "UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3_VALIDATION_FAILED"
  );
  error.receipt = FOUR_SOURCE_CAPABILITY_MAP_V3_VALIDATION_RECEIPT;
  throw error;
}
