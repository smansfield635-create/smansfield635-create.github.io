import {
  PRESENTATION,
  createCompositeNodeRecord,
  deepFreeze,
  validateWorldNodeRecord,
  validateWorldSnapshot
} from "../../assets/compass-model/compass.contracts.js";

const baseWorldRecord = {
  id: "fixture-node-1",
  index: 0,
  kind: "cardinal",
  presentation: PRESENTATION.CONSTELLATION,
  domain: "fixture",
  routeKey: "",
  semantic: { label: "Fixture" },
  baseVector: [0, 1, 0],
  rotatedUnitVector: [0, 1, 0],
  worldPosition: [0, 1, 0],
  alignmentScore: 1,
  depthScore: 0.5
};

const tests = [];

function test(id, run) {
  try {
    run();
    tests.push(Object.freeze({ id, status: "PASS" }));
  } catch (error) {
    tests.push(Object.freeze({
      id,
      status: "FAIL",
      code: error.code || error.message
    }));
  }
}

function expectThrow(id, run, expectedCode) {
  test(id, () => {
    let thrown = null;
    try {
      run();
    } catch (error) {
      thrown = error;
    }
    if (!thrown || thrown.code !== expectedCode) {
      throw new Error(`EXPECTED_${expectedCode}_RECEIVED_${thrown?.code || "NONE"}`);
    }
  });
}

test("VALID_WORLD_RECORD_ACCEPTED", () => {
  validateWorldNodeRecord(baseWorldRecord);
});

expectThrow(
  "MISSING_REQUIRED_FIELD_REJECTED",
  () => {
    const { depthScore, ...invalid } = baseWorldRecord;
    validateWorldNodeRecord(invalid);
  },
  "COMPASS_WORLD_NODE_RECORD_KEYS_INVALID"
);

expectThrow(
  "UNKNOWN_FIELD_REJECTED",
  () => validateWorldNodeRecord({ ...baseWorldRecord, unknown: true }),
  "COMPASS_WORLD_NODE_RECORD_KEYS_INVALID"
);

expectThrow(
  "NONFINITE_VECTOR_REJECTED",
  () => validateWorldNodeRecord({
    ...baseWorldRecord,
    worldPosition: [0, Number.NaN, 0]
  }),
  "COMPASS_WORLD_NODE_POSITION_INVALID"
);

expectThrow(
  "MISMATCHED_NODE_ID_REJECTED",
  () => createCompositeNodeRecord({
    world: baseWorldRecord,
    visual: {
      id: "other-node",
      visible: true,
      scale: 1,
      opacity: 1,
      prominence: 1,
      materialKey: "",
      labelMode: "VISIBLE"
    },
    projection: {
      id: "fixture-node-1",
      worldRevision: 1,
      screenX: 10,
      screenY: 10,
      radiusPx: 20,
      viewDepth: 5,
      normalizedDepth: 0.5,
      visible: true,
      depthLayer: "FRONT",
      hitEligible: true
    }
  }),
  "COMPASS_COMPOSITE_NODE_ID_MISMATCH"
);

test("NESTED_MUTATION_BLOCKED", () => {
  const snapshot = validateWorldSnapshot({
    schema: "UNIVERSAL_COMPASS_WORLD_SNAPSHOT_v1",
    worldRevision: 1,
    presentation: PRESENTATION.CONSTELLATION,
    orientation: [0, 0, 0, 1],
    primaryId: "fixture-node-1",
    records: [baseWorldRecord]
  });

  const original = snapshot.records[0].worldPosition[0];
  try {
    snapshot.records[0].worldPosition[0] = 999;
  } catch {}

  if (
    snapshot.records[0].worldPosition[0] !== original ||
    !Object.isFrozen(snapshot.records[0].worldPosition)
  ) {
    throw new Error("NESTED_MUTATION_NOT_BLOCKED");
  }
});

test("CYCLIC_DEEP_FREEZE_SAFE", () => {
  const record = {};
  record.self = record;
  deepFreeze(record);
  if (!Object.isFrozen(record)) throw new Error("CYCLIC_FREEZE_FAILED");
});

const failed = tests.filter(testRecord => testRecord.status === "FAIL");

export const UNIVERSAL_COMPASS_CONTRACT_SCHEMA_FIXTURE_RECEIPT = Object.freeze({
  schema: "UNIVERSAL_COMPASS_CONTRACT_SCHEMA_FIXTURE_RECEIPT_v1",
  status: failed.length === 0 ? "PASS" : "FAIL",
  testCount: tests.length,
  passed: tests.length - failed.length,
  failed: failed.length,
  results: Object.freeze(tests),
  productionAuthority: false,
  referenceModelAuthority: false
});

if (failed.length > 0) {
  console.error(JSON.stringify(UNIVERSAL_COMPASS_CONTRACT_SCHEMA_FIXTURE_RECEIPT, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(UNIVERSAL_COMPASS_CONTRACT_SCHEMA_FIXTURE_RECEIPT));
}
