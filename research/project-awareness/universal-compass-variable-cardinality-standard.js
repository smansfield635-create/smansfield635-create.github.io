import {
  deepFreeze,
  deterministicDigest
} from "./project-awareness.contract.js";
import {
  UNIVERSAL_COMPASS_SOURCE_FAMILIES,
  UNIVERSAL_COMPASS_CARDINALS,
  FOUR_FAMILY_CARDINAL_OCCURRENCES,
  UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD
} from "./universal-compass-four-source-cardinal-standard.js";

export const VARIABLE_MEMBER_ROLE_TYPES = deepFreeze([
  "NAVIGABLE_MEMBER",
  "NON_NAVIGATIONAL_MEMBER",
  "CENTER_PARTICIPANT",
  "OPTIONAL_PARTICIPANT",
  "VISUAL_ONLY_PARTICIPANT"
]);

export const VARIABLE_MEMBER_FLAGS = deepFreeze([
  "navigable",
  "selectable",
  "primaryEligible",
  "centerParticipant",
  "optionalParticipant",
  "visualOnly"
]);

function unresolvedMembershipCensusRecord(occurrence) {
  return deepFreeze({
    censusId: `${occurrence.occurrenceId}_MEMBERSHIP_CENSUS`,
    occurrenceId: occurrence.occurrenceId,
    family: occurrence.family,
    cardinal: occurrence.cardinal,
    semanticIdentity: occurrence.semanticIdentity,
    censusStatus: "UNRESOLVED_SOURCE_CENSUS_REQUIRED",
    exactMemberCount: null,
    navigableMemberCount: null,
    selectableMemberCount: null,
    primaryEligibleMemberCount: null,
    centerParticipantCount: null,
    optionalParticipantCount: null,
    visualOnlyParticipantCount: null,
    visualParticipantCount: null,
    members: deepFreeze([]),
    evidencePosture: "UNRESOLVED",
    unresolvedReason:
      "SOURCE_MEMBERSHIP_HAS_NOT_YET_BEEN_ENUMERATED_AND_EXECUTED_FOR_THIS_FAMILY_CARDINAL_OCCURRENCE"
  });
}

export const FOUR_FAMILY_VARIABLE_MEMBERSHIP_CENSUS = deepFreeze(
  FOUR_FAMILY_CARDINAL_OCCURRENCES.map(unresolvedMembershipCensusRecord)
);

export const VARIABLE_CARDINAL_OCCURRENCES = deepFreeze(
  FOUR_FAMILY_CARDINAL_OCCURRENCES.map(occurrence => deepFreeze({
    occurrenceId: occurrence.occurrenceId,
    family: occurrence.family,
    cardinal: occurrence.cardinal,
    semanticIdentity: occurrence.semanticIdentity,
    structuralClass: "CARDINAL",
    structuralComparability: true,
    semanticEquivalenceAcrossFamilies: false,
    runtimeIdentityTransferred: false,
    sourceAuthorityTransferred: false,
    ownsOneClusterClass: true,
    membershipCollectionKey: "members",
    fixedMemberCardinality: false,
    exactMemberCount: null,
    minimumMemberCount: null,
    maximumMemberCount: null,
    memberCountStatus: "SOURCE_DERIVED_PENDING_CENSUS",
    memberIdentityRequirement: "STABLE_WITHIN_SOURCE_OCCURRENCE",
    memberOrderRequirement: "SOURCE_ORDINAL_PRESERVED_WHEN_PRESENT",
    participantRoleDistinctionsRequired: true,
    centerParticipantCountedSeparately: true,
    optionalParticipantCountedSeparately: true,
    navigableMemberCountDerivedFromMembers: true,
    visualParticipantCountDerivedFromMembers: true,
    comparisonDimensions: deepFreeze([
      "CARDINAL_IDENTITY",
      "BASE_WORLD_VECTOR",
      "CLUSTER_OWNERSHIP",
      "VARIABLE_MEMBER_COLLECTION",
      "MEMBER_IDENTITY",
      "MEMBER_ORDINAL",
      "MEMBER_STRUCTURAL_ROLE",
      "NAVIGABILITY",
      "SELECTABILITY",
      "PRIMARY_ELIGIBILITY",
      "CENTER_PARTICIPATION",
      "OPTIONAL_PARTICIPATION",
      "VISUAL_ONLY_PARTICIPATION",
      "PRIMARY_ANCHOR_BEHAVIOR",
      "ORIENTATION_AND_SETTLEMENT",
      "SELECTION_TRANSITIONS",
      "SEMANTIC_CONTROL",
      "ROUTE_OR_ACTION_ASSOCIATION",
      "VISUAL_MATERIAL",
      "PROJECTION_AND_DEPTH",
      "INTERACTION_ELIGIBILITY"
    ]),
    prohibitedMergeDimensions: occurrence.prohibitedMergeDimensions,
    sourceRecordIds: occurrence.sourceRecordIds,
    evidencePosture: "DERIVED"
  }))
);

export const VARIABLE_CARDINALITY_INVARIANTS = deepFreeze([
  "EXACTLY_FOUR_RUNTIME_CARDINALS",
  "EACH_CARDINAL_HAS_UNIQUE_STABLE_WORLD_IDENTITY",
  "EACH_CARDINAL_HAS_CANONICAL_BASE_VECTOR",
  "EACH_CARDINAL_OWNS_ONE_CLUSTER_CLASS",
  "EACH_CLUSTER_EXPOSES_A_MEMBER_COLLECTION",
  "CLUSTER_MEMBER_COUNT_IS_NOT_UNIVERSALLY_FIXED",
  "MEMBER_IDENTITIES_ARE_STABLE_WITHIN_THEIR_SOURCE_OCCURRENCE",
  "SOURCE_MEMBER_ORDINAL_IS_PRESERVED_WHEN_PRESENT",
  "NAVIGABLE_MEMBERS_ARE_DISTINCT_FROM_CENTER_PARTICIPANTS",
  "NAVIGABLE_MEMBERS_ARE_DISTINCT_FROM_OPTIONAL_PARTICIPANTS",
  "NAVIGABLE_MEMBERS_ARE_DISTINCT_FROM_VISUAL_ONLY_PARTICIPANTS",
  "PRIMARY_ELIGIBILITY_IS_EXPLICIT",
  "EACH_CARDINAL_HAS_PRIMARY_ANCHOR_RELATION",
  "EACH_CARDINAL_HAS_SEMANTIC_CONTROL_RELATION",
  "EACH_CARDINAL_PARTICIPATES_IN_LEGAL_PRESENTATION_TRANSITIONS",
  "CARDINAL_POSITION_IS_STRUCTURAL",
  "CARDINAL_CONTENT_REMAINS_FAMILY_LOCAL",
  "SOURCE_OBSERVATIONS_DO_NOT_CREATE_RUNTIME_AUTHORITY"
]);

export const WITHDRAWN_FIXED_CARDINALITY_ASSERTIONS = deepFreeze([
  {
    assertion: "EACH_CARDINAL_EXPOSES_FOUR_CHILD_SEATS",
    disposition: "WITHDRAWN_UNSUPPORTED_UNIVERSAL_INVARIANT"
  },
  {
    assertion: "CHILD_SEATS_PER_CARDINAL_EQUALS_FOUR",
    disposition: "WITHDRAWN_UNSUPPORTED_SOURCE_ASSUMPTION"
  },
  {
    assertion: "CHILD_SEAT_OBSERVATION_COUNT_EQUALS_SIXTY_FOUR",
    disposition: "WITHDRAWN_DERIVED_FROM_UNSUPPORTED_FIXED_CARDINALITY"
  },
  {
    assertion: "UNIVERSAL_RUNTIME_CHILD_COUNT_EQUALS_SIXTEEN",
    disposition: "RECLASSIFIED_AS_OPTIONAL_RUNTIME_PROFILE_RESULT"
  }
]);

export const VARIABLE_CARDINALITY_PROHIBITIONS = deepFreeze([
  "DO_NOT_FIX_CLUSTER_MEMBER_COUNT_WITHOUT_SOURCE_EVIDENCE",
  "DO_NOT_PAD_SMALLER_CLUSTERS_WITH_INVENTED_MEMBERS",
  "DO_NOT_TRUNCATE_LARGER_CLUSTERS",
  "DO_NOT_COUNT_CENTER_PARTICIPANTS_AS_NAVIGABLE_MEMBERS_BY_DEFAULT",
  "DO_NOT_COUNT_OPTIONAL_PARTICIPANTS_AS_REQUIRED_MEMBERS_BY_DEFAULT",
  "DO_NOT_COUNT_VISUAL_ONLY_PARTICIPANTS_AS_NAVIGABLE_MEMBERS",
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
  artifactId:
    "UNIVERSAL_COMPASS_FOUR_SOURCE_VARIABLE_CARDINALITY_COMPARATIVE_STANDARD_v2",
  schema:
    "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_VARIABLE_CARDINALITY_COMPARATIVE_STANDARD_v2",
  mode: "READ_ONLY_COMPARATIVE_STANDARD",
  supersedesArtifactId:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId,
  supersessionScope:
    "WITHDRAW_FIXED_FOUR_MEMBER_CARDINALITY_AND_REPLACE_WITH_SOURCE_DERIVED_VARIABLE_MEMBERSHIP",
  supersededArtifactDigest:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.deterministicDigest,
  sourceFamilies: UNIVERSAL_COMPASS_SOURCE_FAMILIES,
  cardinals: UNIVERSAL_COMPASS_CARDINALS,
  comparativeAxes: deepFreeze([
    "FAMILY",
    "CARDINAL",
    "CAPABILITY",
    "MEMBERSHIP"
  ]),
  sourceObservationTopology: deepFreeze({
    familyCount: 4,
    cardinalsPerFamily: 4,
    cardinalOccurrenceCount: 16,
    fixedMembersPerCardinal: null,
    totalMemberObservationCount: null,
    totalMemberObservationCountFormula:
      "SUM_OF_SOURCE_DERIVED_MEMBER_COUNTS_ACROSS_SIXTEEN_CARDINAL_OCCURRENCES",
    membershipCensusStatus: "UNRESOLVED_SOURCE_CENSUS_REQUIRED"
  }),
  universalRuntimeTopology: deepFreeze({
    cardinalCount: 4,
    clusterCount: 4,
    fixedMemberCountPerCluster: null,
    fixedTotalMemberCount: null,
    memberCardinalityMode: "SOURCE_DERIVED_VARIABLE",
    optionalInitialProfile: deepFreeze({
      profileId: "FOUR_BY_FOUR_BY_SIXTEEN",
      status: "AVAILABLE_NOT_UNIVERSAL_NOT_ADOPTED_BY_THIS_ARTIFACT",
      cardinalCount: 4,
      clusterCount: 4,
      navigableMemberCount: 16
    })
  }),
  cardinalOccurrences: VARIABLE_CARDINAL_OCCURRENCES,
  membershipCensus: FOUR_FAMILY_VARIABLE_MEMBERSHIP_CENSUS,
  memberRoleTypes: VARIABLE_MEMBER_ROLE_TYPES,
  memberFlags: VARIABLE_MEMBER_FLAGS,
  universalCardinalInvariants: VARIABLE_CARDINALITY_INVARIANTS,
  withdrawnFixedCardinalityAssertions:
    WITHDRAWN_FIXED_CARDINALITY_ASSERTIONS,
  prohibitions: VARIABLE_CARDINALITY_PROHIBITIONS,
  pass2Handoff: deepFreeze({
    primaryTarget: "/prototypes/universal-compass/index.planet.js",
    requiredComparativeAxis:
      "FAMILY_X_CARDINAL_X_CAPABILITY_X_VARIABLE_MEMBERSHIP",
    requiredPreMutationStep:
      "COMPLETE_SOURCE_MEMBERSHIP_CENSUS_FOR_ALL_SIXTEEN_CARDINAL_OCCURRENCES",
    sourceMembershipCensusComplete: false,
    planetMutationBlockedUntilCensusComplete: true,
    requiredPlanetContractOutcomes: deepFreeze([
      "COUNT_AGNOSTIC_CLUSTER_MEMBERSHIP",
      "STABLE_MEMBER_IDENTITIES",
      "SOURCE_ORDINAL_PRESERVATION",
      "EXPLICIT_PARTICIPANT_ROLE_CLASSIFICATION",
      "DERIVED_MEMBER_COUNTS",
      "NO_PADDING",
      "NO_TRUNCATION"
    ]),
    mutationAuthority: "NOT_GRANTED_BY_THIS_ARTIFACT",
    implementationSelectionStatus: "BLOCKED_PENDING_SOURCE_CENSUS"
  }),
  structuralComparability: true,
  semanticEquivalenceAcrossFamilies: false,
  fixedClusterMemberCardinality: false,
  awarenessOnlyArtifact: true,
  prototypeModified: false,
  sourceCompassesModified: false,
  productAuthority: false,
  runtimeAuthority: false,
  implementationAuthority: false,
  mutationAuthority: false
};

export const UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD = deepFreeze({
  ...STANDARD_BODY,
  deterministicDigest: deterministicDigest(STANDARD_BODY)
});

function finding(id, pass, details = null) {
  return deepFreeze({
    id,
    pass: Boolean(pass),
    status: pass ? "PASS" : "FAIL",
    details
  });
}

export function validateUniversalCompassVariableCardinalityStandard(
  candidate = UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
) {
  const findings = [];
  const occurrenceIds = candidate.cardinalOccurrences.map(
    occurrence => occurrence.occurrenceId
  );
  const censusIds = candidate.membershipCensus.map(record => record.censusId);

  findings.push(finding(
    "SCHEMA_EXACT",
    candidate.schema ===
      "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_VARIABLE_CARDINALITY_COMPARATIVE_STANDARD_v2",
    candidate.schema
  ));
  findings.push(finding(
    "SIXTEEN_CARDINAL_OCCURRENCES_PRESERVED",
    candidate.cardinalOccurrences.length === 16 &&
      new Set(occurrenceIds).size === 16,
    occurrenceIds
  ));
  findings.push(finding(
    "FIXED_MEMBER_CARDINALITY_REMOVED",
    candidate.fixedClusterMemberCardinality === false &&
      candidate.universalRuntimeTopology.fixedMemberCountPerCluster === null &&
      candidate.universalRuntimeTopology.fixedTotalMemberCount === null &&
      candidate.cardinalOccurrences.every(
        occurrence =>
          occurrence.fixedMemberCardinality === false &&
          occurrence.exactMemberCount === null
      ),
    candidate.universalRuntimeTopology
  ));
  findings.push(finding(
    "MEMBERSHIP_CENSUS_HAS_SIXTEEN_UNRESOLVED_RECORDS",
    candidate.membershipCensus.length === 16 &&
      new Set(censusIds).size === 16 &&
      candidate.membershipCensus.every(
        record =>
          record.censusStatus === "UNRESOLVED_SOURCE_CENSUS_REQUIRED" &&
          record.exactMemberCount === null &&
          record.members.length === 0
      ),
    candidate.membershipCensus.map(record => ({
      censusId: record.censusId,
      status: record.censusStatus
    }))
  ));
  findings.push(finding(
    "FIXED_FOUR_ASSERTIONS_WITHDRAWN",
    [
      "EACH_CARDINAL_EXPOSES_FOUR_CHILD_SEATS",
      "CHILD_SEATS_PER_CARDINAL_EQUALS_FOUR",
      "CHILD_SEAT_OBSERVATION_COUNT_EQUALS_SIXTY_FOUR"
    ].every(assertion =>
      candidate.withdrawnFixedCardinalityAssertions.some(
        record => record.assertion === assertion
      )
    ),
    candidate.withdrawnFixedCardinalityAssertions
  ));
  findings.push(finding(
    "PARTICIPANT_ROLE_DISTINCTIONS_REQUIRED",
    [
      "NAVIGABLE_MEMBER",
      "CENTER_PARTICIPANT",
      "OPTIONAL_PARTICIPANT",
      "VISUAL_ONLY_PARTICIPANT"
    ].every(role => candidate.memberRoleTypes.includes(role)) &&
      candidate.cardinalOccurrences.every(
        occurrence => occurrence.participantRoleDistinctionsRequired === true
      ),
    candidate.memberRoleTypes
  ));
  findings.push(finding(
    "OPTIONAL_FOUR_BY_FOUR_BY_SIXTEEN_PROFILE_NOT_UNIVERSAL",
    candidate.universalRuntimeTopology.optionalInitialProfile.status ===
      "AVAILABLE_NOT_UNIVERSAL_NOT_ADOPTED_BY_THIS_ARTIFACT",
    candidate.universalRuntimeTopology.optionalInitialProfile
  ));
  findings.push(finding(
    "PLANET_MUTATION_BLOCKED_PENDING_CENSUS",
    candidate.pass2Handoff.sourceMembershipCensusComplete === false &&
      candidate.pass2Handoff.planetMutationBlockedUntilCensusComplete === true &&
      candidate.pass2Handoff.implementationSelectionStatus ===
        "BLOCKED_PENDING_SOURCE_CENSUS",
    candidate.pass2Handoff
  ));
  findings.push(finding(
    "NO_RUNTIME_OR_PRODUCT_AUTHORITY",
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
      "DGB_UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      cardinalOccurrenceCount: candidate.cardinalOccurrences.length,
      membershipCensusRecordCount: candidate.membershipCensus.length,
      resolvedMembershipCensusCount: candidate.membershipCensus.filter(
        record => record.censusStatus === "COMPLETE"
      ).length
    }),
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    runtimeAuthority: false,
    mutationAuthority: false,
    prototypeModified: false
  });
}

export const VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT =
  validateUniversalCompassVariableCardinalityStandard();

if (VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT.status !== "PASS") {
  const error = new Error(
    "UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD_VALIDATION_FAILED"
  );
  error.receipt = VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT;
  throw error;
}
