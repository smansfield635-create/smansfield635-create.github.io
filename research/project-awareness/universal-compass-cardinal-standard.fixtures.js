import {
  FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT
} from "./universal-compass-four-source-capability-map.js";
import {
  FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT,
  UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD
} from "./universal-compass-four-source-cardinal-standard.js";
import {
  FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_RECEIPT,
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2
} from "./universal-compass-four-source-capability-map.v2.js";
import {
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2,
  UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT,
  queryUniversalCompassCardinalAwareness
} from "./universal-compass-awareness-snapshot.v2.js";
import { deepFreeze } from "./project-awareness.contract.js";

function assert(condition, code, details = null) {
  if (!condition) {
    const error = new Error(code);
    error.details = details;
    throw error;
  }
}

export function runUniversalCompassCardinalStandardFixtures() {
  const assertions = [];
  const verify = (id, operation) => {
    operation();
    assertions.push(deepFreeze({ id, pass: true }));
  };

  verify("BASE_MAP_V1_REMAINS_VALID", () =>
    assert(FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT.status === "PASS", "BASE_MAP_V1_INVALID"));
  verify("CARDINAL_STANDARD_VALID", () =>
    assert(FOUR_SOURCE_CARDINAL_STANDARD_VALIDATION_RECEIPT.status === "PASS", "CARDINAL_STANDARD_INVALID"));
  verify("CAPABILITY_MAP_V2_VALID", () =>
    assert(FOUR_SOURCE_CAPABILITY_MAP_V2_VALIDATION_RECEIPT.status === "PASS", "CAPABILITY_MAP_V2_INVALID"));
  verify("AWARENESS_SNAPSHOT_V2_VALID", () =>
    assert(UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2_VALIDATION_RECEIPT.status === "PASS", "AWARENESS_SNAPSHOT_V2_INVALID"));

  verify("MATRIX_IS_FOUR_BY_FOUR", () => {
    const records = UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.cardinalOccurrences;
    assert(records.length === 16, "CARDINAL_MATRIX_NOT_SIXTEEN", records.length);
  });
  verify("EACH_FAMILY_EXPOSES_ALL_CARDINALS", () => {
    for (const family of UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.sourceFamilies) {
      const records = queryUniversalCompassCardinalAwareness("CARDINAL_OCCURRENCES_BY_FAMILY", { family }).answer;
      assert(records.length === 4, "FAMILY_CARDINAL_COUNT_INVALID", { family, count: records.length });
      assert(new Set(records.map(record => record.cardinal)).size === 4, "FAMILY_CARDINAL_DUPLICATE", family);
    }
  });
  verify("EACH_CARDINAL_EXPOSES_ALL_FAMILIES", () => {
    for (const cardinal of UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.cardinals) {
      const records = queryUniversalCompassCardinalAwareness("CARDINAL_OCCURRENCES_BY_CARDINAL", { cardinal }).answer;
      assert(records.length === 4, "CARDINAL_FAMILY_COUNT_INVALID", { cardinal, count: records.length });
      assert(new Set(records.map(record => record.family)).size === 4, "CARDINAL_FAMILY_DUPLICATE", cardinal);
    }
  });
  verify("CHILD_OBSERVATION_SPACE_IS_SIXTY_FOUR", () =>
    assert(UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.childSeatObservations.length === 64, "CHILD_OBSERVATION_COUNT_INVALID"));
  verify("UNIVERSAL_RUNTIME_REMAINS_FOUR_FOUR_SIXTEEN", () => {
    const topology = UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.universalRuntimeTopology;
    assert(topology.cardinalCount === 4 && topology.clusterCount === 4 && topology.childCount === 16, "UNIVERSAL_RUNTIME_TOPOLOGY_INVALID", topology);
  });
  verify("CARDINAL_POSITION_IS_STRUCTURAL", () =>
    assert(UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.structuralComparability === true, "STRUCTURAL_COMPARABILITY_DISABLED"));
  verify("CARDINAL_CONTENT_REMAINS_FAMILY_LOCAL", () =>
    assert(UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.semanticEquivalenceAcrossFamilies === false, "SEMANTIC_EQUIVALENCE_INCORRECTLY_ENABLED"));
  verify("NO_ONE_FAMILY_ONE_CARDINAL_ASSIGNMENT", () => {
    for (const family of UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.sourceFamilies) {
      assert(queryUniversalCompassCardinalAwareness("CARDINAL_OCCURRENCES_BY_FAMILY", { family }).answer.length === 4, "ONE_FAMILY_ONE_CARDINAL_MAPPING_DETECTED", family);
    }
  });
  verify("CAPABILITY_AXIS_RETAINED", () =>
    assert(UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.capabilityMatrix.length > 0, "CAPABILITY_AXIS_EMPTY"));
  verify("PASS_2_REQUIRES_CARDINAL_COMPARISON", () => {
    const handoff = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.pass2Handoff;
    assert(handoff.requiredComparativeAxis === "FAMILY_X_CARDINAL_X_CAPABILITY", "PASS_2_CARDINAL_AXIS_MISSING", handoff);
    assert(handoff.primaryTarget === "/prototypes/universal-compass/index.planet.js", "PASS_2_PRIMARY_TARGET_CHANGED", handoff.primaryTarget);
  });
  verify("NO_RUNTIME_IMPORT_OR_AUTHORITY", () => {
    assert(UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.productAuthority === false, "CARDINAL_STANDARD_PRODUCT_AUTHORITY");
    assert(UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.implementationAuthority === false, "CARDINAL_STANDARD_IMPLEMENTATION_AUTHORITY");
    assert(UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.mutationAuthority === false, "CARDINAL_STANDARD_MUTATION_AUTHORITY");
    assert(UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.runtimeAuthority === false, "SNAPSHOT_RUNTIME_AUTHORITY");
  });

  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_CARDINAL_STANDARD_FIXTURE_RECEIPT_v1",
    receiptId: "UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD_FIXTURES_v1",
    status: "PASS",
    assertionCount: assertions.length,
    assertions,
    cardinalStandardDigest:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CARDINAL_STANDARD.deterministicDigest,
    capabilityMapV2Digest:
      UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V2.deterministicDigest,
    awarenessSnapshotV2Digest:
      UNIVERSAL_COMPASS_PROJECT_AWARENESS_SNAPSHOT_V2.deterministicDigest,
    claims: deepFreeze({
      familyCardinalCapabilityStandardPass: true,
      cardinalOccurrenceCount: 16,
      childSeatObservationCount: 64,
      universalRuntimeCardinalCount: 4,
      universalRuntimeClusterCount: 4,
      universalRuntimeChildCount: 16,
      semanticEquivalenceAcrossFamilies: false,
      prototypeModified: false,
      runtimePass: false,
      productAuthority: false,
      mutationAuthority: false
    })
  });
}

export const UNIVERSAL_COMPASS_CARDINAL_STANDARD_FIXTURE_RECEIPT =
  runUniversalCompassCardinalStandardFixtures();

const invokedPath = globalThis.process?.argv?.[1] || "";
if (invokedPath.endsWith("universal-compass-cardinal-standard.fixtures.js")) {
  globalThis.console?.log(JSON.stringify(UNIVERSAL_COMPASS_CARDINAL_STANDARD_FIXTURE_RECEIPT, null, 2));
}
