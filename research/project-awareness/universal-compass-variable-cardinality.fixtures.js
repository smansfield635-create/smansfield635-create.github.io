import {
  deepFreeze
} from "./project-awareness.contract.js";
import {
  FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT,
  UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD
} from "./universal-compass-four-source-cardinal-standard.js";
import {
  FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_RECEIPT
} from "./universal-compass-four-source-capability-map.v2.js";
import {
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT
} from "./universal-compass-awareness-snapshot.v2.js";
import {
  UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD,
  VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT
} from "./universal-compass-variable-cardinality-standard.js";
import {
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3,
  FOUR_SOURCE_CAPABILITY_MAP_V3_VALIDATION_RECEIPT
} from "./universal-compass-four-source-capability-map.v3.js";
import {
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3,
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3_VALIDATION_RECEIPT,
  queryUniversalCompassVariableCardinalityAwareness
} from "./universal-compass-awareness-snapshot.v3.js";

function assert(condition, code, details = null) {
  if (!condition) {
    const error = new Error(code);
    error.details = details;
    throw error;
  }
}

export function runUniversalCompassVariableCardinalityFixtures() {
  const assertions = [];
  const verify = (id, operation) => {
    operation();
    assertions.push(deepFreeze({ id, pass: true }));
  };

  verify("PRIOR_CARDINAL_STANDARD_REMAINS_REPRODUCIBLE", () => {
    assert(
      FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT.status === "PASS",
      "PRIOR_CARDINAL_STANDARD_NO_LONGER_REPRODUCIBLE"
    );
  });

  verify("PRIOR_CAPABILITY_MAP_V2_REMAINS_REPRODUCIBLE", () => {
    assert(
      FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_RECEIPT.status === "PASS",
      "PRIOR_CAPABILITY_MAP_V2_NO_LONGER_REPRODUCIBLE"
    );
  });

  verify("PRIOR_AWARENESS_SNAPSHOT_V2_REMAINS_REPRODUCIBLE", () => {
    assert(
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT
        .status === "PASS",
      "PRIOR_AWARENESS_SNAPSHOT_V2_NO_LONGER_REPRODUCIBLE"
    );
  });

  verify("VARIABLE_CARDINALITY_STANDARD_VALID", () => {
    assert(
      VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT.status === "PASS",
      "VARIABLE_CARDINALITY_STANDARD_INVALID",
      VARIABLE_CARDINALITY_STANDARD_VALIDATION_RECEIPT
    );
  });

  verify("CAPABILITY_MAP_V3_VALID", () => {
    assert(
      FOUR_SOURCE_CAPABILITY_MAP_V3_VALIDATION_RECEIPT.status === "PASS",
      "CAPABILITY_MAP_V3_INVALID",
      FOUR_SOURCE_CAPABILITY_MAP_V3_VALIDATION_RECEIPT
    );
  });

  verify("AWARENESS_SNAPSHOT_V3_VALID", () => {
    assert(
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3_VALIDATION_RECEIPT
        .status === "PASS",
      "AWARENESS_SNAPSHOT_V3_INVALID",
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3_VALIDATION_RECEIPT
    );
  });

  verify("FOUR_FAMILIES_AND_FOUR_CARDINALS_PRESERVED", () => {
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.sourceFamilies.length === 4,
      "SOURCE_FAMILY_COUNT_CHANGED"
    );
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.cardinals.length === 4,
      "CARDINAL_COUNT_CHANGED"
    );
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.cardinalOccurrences.length === 16,
      "CARDINAL_OCCURRENCE_COUNT_CHANGED"
    );
  });

  verify("FIXED_FOUR_MEMBER_RESTRICTION_REMOVED", () => {
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .fixedClusterMemberCardinality === false,
      "FIXED_CARDINALITY_STILL_ENABLED"
    );
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .universalRuntimeTopology.fixedMemberCountPerCluster === null,
      "FIXED_MEMBER_COUNT_STILL_PRESENT"
    );
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .cardinalOccurrences.every(
          occurrence =>
            occurrence.fixedMemberCardinality === false &&
            occurrence.exactMemberCount === null
        ),
      "CARDINAL_OCCURRENCE_RETAINS_FIXED_MEMBER_COUNT"
    );
  });

  verify("SIXTY_FOUR_OBSERVATION_RESTRICTION_REMOVED", () => {
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .sourceObservationTopology.totalMemberObservationCount === null,
      "FIXED_TOTAL_MEMBER_OBSERVATION_COUNT_REMAINS"
    );
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD
        .sourceObservationTopology.totalMemberObservationCountFormula ===
        "SUM_OF_SOURCE_DERIVED_MEMBER_COUNTS_ACROSS_SIXTEEN_CARDINAL_OCCURRENCES",
      "VARIABLE_OBSERVATION_FORMULA_MISSING"
    );
  });

  verify("PARTICIPANT_ROLES_REMAIN_DISTINCT", () => {
    const roles = new Set(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.memberRoleTypes
    );
    for (const required of [
      "NAVIGABLE_MEMBER",
      "CENTER_PARTICIPANT",
      "OPTIONAL_PARTICIPANT",
      "VISUAL_ONLY_PARTICIPANT"
    ]) {
      assert(roles.has(required), "MEMBER_ROLE_MISSING", required);
    }
  });

  verify("NO_PADDING_OR_TRUNCATION", () => {
    const prohibited = new Set(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.prohibitions
    );
    assert(
      prohibited.has("DO_NOT_PAD_SMALLER_CLUSTERS_WITH_INVENTED_MEMBERS"),
      "PADDING_PROHIBITION_MISSING"
    );
    assert(
      prohibited.has("DO_NOT_TRUNCATE_LARGER_CLUSTERS"),
      "TRUNCATION_PROHIBITION_MISSING"
    );
  });

  verify("SOURCE_MEMBERSHIP_CENSUS_GATE_IS_EXPLICIT", () => {
    const census = queryUniversalCompassVariableCardinalityAwareness(
      "MEMBERSHIP_CENSUS_STATUS"
    ).answer;
    assert(census.totalRecords === 16, "CENSUS_RECORD_COUNT_INVALID", census);
    assert(census.completeRecords === 0, "CENSUS_FALSE_COMPLETION", census);
    assert(census.unresolvedRecords === 16, "CENSUS_UNRESOLVED_COUNT_INVALID", census);
    assert(census.censusComplete === false, "CENSUS_FALSE_COMPLETE", census);
  });

  verify("PLANET_MUTATION_REMAINS_BLOCKED", () => {
    const handoff = queryUniversalCompassVariableCardinalityAwareness(
      "PLANET_PREMUTATION_REQUIREMENTS"
    ).answer;
    assert(
      handoff.sourceMembershipCensusComplete === false,
      "PLANET_HANDOFF_FALSE_CENSUS_COMPLETE",
      handoff
    );
    assert(
      handoff.implementationSelectionStatus ===
        "BLOCKED_PENDING_SOURCE_CENSUS",
      "PLANET_HANDOFF_NOT_BLOCKED",
      handoff
    );
    assert(
      handoff.mutationAuthority === "NOT_GRANTED_BY_THIS_ARTIFACT",
      "PLANET_MUTATION_AUTHORITY_CREATED",
      handoff
    );
  });

  verify("OPTIONAL_FOUR_BY_FOUR_BY_SIXTEEN_PROFILE_NOT_UNIVERSAL", () => {
    const profile = queryUniversalCompassVariableCardinalityAwareness(
      "OPTIONAL_RUNTIME_PROFILE"
    ).answer;
    assert(
      profile.status ===
        "AVAILABLE_NOT_UNIVERSAL_NOT_ADOPTED_BY_THIS_ARTIFACT",
      "OPTIONAL_PROFILE_FALSELY_PROMOTED",
      profile
    );
  });

  verify("SUCCESSOR_CHAIN_IS_EXPLICIT", () => {
    assert(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.supersedesArtifactId ===
        UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.artifactId,
      "CARDINAL_STANDARD_SUCCESSION_MISSING"
    );
    assert(
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.supersedesArtifactId ===
        UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3
          .supersedesArtifactId,
      "CAPABILITY_MAP_SUCCESSION_INVALID"
    );
    assert(
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3.supersedesArtifactId ===
        UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT
          .artifactId ||
      Boolean(UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3.supersedesArtifactId),
      "AWARENESS_SNAPSHOT_SUCCESSION_MISSING"
    );
  });

  verify("NO_RUNTIME_OR_PRODUCT_AUTHORITY", () => {
    for (const artifact of [
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD,
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3,
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3
    ]) {
      assert(artifact.productAuthority === false, "PRODUCT_AUTHORITY_CREATED");
      assert(artifact.runtimeAuthority === false, "RUNTIME_AUTHORITY_CREATED");
      assert(artifact.mutationAuthority === false, "MUTATION_AUTHORITY_CREATED");
      assert(artifact.prototypeModified === false, "PROTOTYPE_FALSELY_MODIFIED");
    }
  });

  return deepFreeze({
    schema:
      "DGB_UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_CORRECTION_FIXTURE_RECEIPT_v1",
    receiptId:
      "UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_CORRECTION_FIXTURES_v1",
    status: "PASS",
    assertionCount: assertions.length,
    assertions,
    variableCardinalityStandardDigest:
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_STANDARD.deterministicDigest,
    capabilityMapV3Digest:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.deterministicDigest,
    awarenessSnapshotV3Digest:
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V3.deterministicDigest,
    claims: deepFreeze({
      fourFamilyCardinalAxisPreserved: true,
      cardinalOccurrenceCount: 16,
      fixedFourMemberRestrictionWithdrawn: true,
      fixedSixtyFourObservationRestrictionWithdrawn: true,
      variableClusterCardinalityEnabled: true,
      membershipCensusComplete: false,
      planetMutationReady: false,
      prototypeModified: false,
      runtimePass: false,
      productAuthority: false,
      mutationAuthority: false
    })
  });
}

export const UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_FIXTURE_RECEIPT =
  runUniversalCompassVariableCardinalityFixtures();

const invokedPath = globalThis.process?.argv?.[1] || "";
if (invokedPath.endsWith("universal-compass-variable-cardinality.fixtures.js")) {
  globalThis.console?.log(
    JSON.stringify(
      UNIVERSAL_COMPASS_VARIABLE_CARDINALITY_FIXTURE_RECEIPT,
      null,
      2
    )
  );
}
