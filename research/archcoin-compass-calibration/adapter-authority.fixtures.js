import {
  DEPTH_CONVENTION,
  PRESENTATION,
  deepFreeze
} from "../../assets/compass-model/compass.contracts.js";
import {
  NAVIGATION_EFFECT,
  createAdapters
} from "../../assets/compass-model/compass.adapters.js";

function expectError(code, operation) {
  try {
    operation();
  } catch (error) {
    return error?.code === code;
  }
  return false;
}

function projectionInput(overrides = {}) {
  return deepFreeze({
    nodeId: "node-1",
    worldRevision: 3,
    worldPosition: [0, 0, 1],
    camera: {
      eye: [0, 0, 6],
      target: [0, 0, 0],
      near: 0.1,
      far: 60
    },
    ...overrides
  });
}

function projectionOutput(input, overrides = {}) {
  return {
    nodeId: input.nodeId,
    worldRevision: input.worldRevision,
    screenX: 100,
    screenY: 120,
    radiusPx: 24,
    viewDepth: 5,
    normalizedDepth: 0.4,
    visible: true,
    ...overrides
  };
}

function createFixtureAdapters(overrides = {}) {
  return createAdapters({
    routes: {
      north: { key: "north", href: "#north" }
    },
    navigate: route => ({ accepted: true, key: route.key }),
    projectWorldPoint: input => projectionOutput(input),
    renderFrame: snapshot => ({ rendered: snapshot.records.length }),
    semanticPublisher: snapshot => ({ published: snapshot.records.length }),
    ...overrides
  });
}

const cases = [];
const add = (id, run) => cases.push({ id, run });

add("TYPED_PROJECTION_INPUT_AND_OUTPUT_ACCEPTED", () => {
  const adapters = createFixtureAdapters();
  const output = adapters.projectWorldPoint(projectionInput());
  return output.nodeId === "node-1" && output.worldRevision === 3;
});

add("UNKNOWN_PROJECTION_INPUT_FIELD_REJECTED", () => {
  const adapters = createFixtureAdapters();
  return expectError(
    "COMPASS_ADAPTER_PROJECTION_INPUT_KEYS_INVALID",
    () => adapters.projectWorldPoint({ ...projectionInput(), extra: true })
  );
});

add("PROJECTOR_INPUT_IS_DEEPLY_IMMUTABLE", () => {
  let mutationBlocked = false;
  const adapters = createFixtureAdapters({
    projectWorldPoint(input) {
      try {
        input.worldPosition[0] = 99;
      } catch {
        mutationBlocked = true;
      }
      return projectionOutput(input);
    }
  });
  adapters.projectWorldPoint(projectionInput());
  return mutationBlocked;
});

add("PROJECTOR_NODE_ID_MISMATCH_REJECTED", () => {
  const adapters = createFixtureAdapters({
    projectWorldPoint: input => projectionOutput(input, { nodeId: "other" })
  });
  return expectError(
    "COMPASS_ADAPTER_NODE_ID_MISMATCH",
    () => adapters.projectWorldPoint(projectionInput())
  );
});

add("PROJECTOR_WORLD_REVISION_MISMATCH_REJECTED", () => {
  const adapters = createFixtureAdapters({
    projectWorldPoint: input => projectionOutput(input, { worldRevision: 9 })
  });
  return expectError(
    "COMPASS_ADAPTER_WORLD_REVISION_MISMATCH",
    () => adapters.projectWorldPoint(projectionInput())
  );
});

add("ONLY_ADMITTED_ROUTE_OBJECTS_CAN_NAVIGATE", () => {
  const adapters = createFixtureAdapters();
  return expectError(
    "COMPASS_NAVIGATION_ROUTE_NOT_ADMITTED",
    () => adapters.navigate({ key: "north", href: "#north" })
  );
});

add("LOCAL_NAVIGATION_RECEIPT_IS_REVERSIBLE", () => {
  const adapters = createFixtureAdapters();
  const route = adapters.resolveRoute("north");
  const receipt = adapters.navigate(route);
  const rollback = adapters.rollbackNavigation();
  return receipt.reversible === true && rollback.rolledBack === true;
});

add("EXTERNAL_NAVIGATION_REQUIRES_ROLLBACK", () =>
  expectError(
    "COMPASS_NAVIGATION_ROLLBACK_REQUIRED",
    () => createFixtureAdapters({
      navigationEffect: NAVIGATION_EFFECT.EXTERNAL
    })
  )
);

add("EXTERNAL_NAVIGATION_USES_DECLARED_ROLLBACK", () => {
  let called = false;
  const adapters = createFixtureAdapters({
    navigationEffect: NAVIGATION_EFFECT.HISTORY_PUSH,
    rollbackNavigation() {
      called = true;
      return { rolledBack: true };
    }
  });
  adapters.navigate(adapters.resolveRoute("north"));
  const result = adapters.rollbackNavigation();
  return called && result.rolledBack === true;
});

add("RENDER_AND_SEMANTIC_SNAPSHOTS_REMAIN_IMMUTABLE", () => {
  const snapshot = deepFreeze({
    schema: "UNIVERSAL_COMPASS_PROJECTION_SNAPSHOT_v2",
    projectionRevision: 1,
    worldRevision: 1,
    depthConvention: DEPTH_CONVENTION.POSITIVE_CAMERA_FORWARD_DISTANCE,
    presentation: PRESENTATION.CONSTELLATION,
    records: []
  });
  const adapters = createFixtureAdapters();
  adapters.renderFrame(snapshot);
  adapters.publishSemantic(snapshot);
  return Object.isFrozen(snapshot) && Object.isFrozen(snapshot.records);
});

add("RESOURCE_OWNERSHIP_REQUIRES_DISPOSAL", () =>
  expectError(
    "COMPASS_RESOURCE_DISPOSAL_REQUIRED",
    () => createFixtureAdapters({ ownsResources: true })
  )
);

add("DISPOSAL_IS_IDEMPOTENT_AND_BLOCKS_OPERATIONS", () => {
  let disposedCount = 0;
  const adapters = createFixtureAdapters({
    ownsResources: true,
    disposeResources() {
      disposedCount += 1;
    }
  });
  const first = adapters.dispose();
  const second = adapters.dispose();
  const blocked = expectError(
    "COMPASS_ADAPTERS_DISPOSED",
    () => adapters.resolveRoute("north")
  );
  return first.repeated === false &&
    second.repeated === true &&
    disposedCount === 1 &&
    blocked;
});

const findings = cases.map(testCase => {
  try {
    return Object.freeze({
      id: testCase.id,
      status: testCase.run() ? "PASS" : "FAIL"
    });
  } catch (error) {
    return Object.freeze({
      id: testCase.id,
      status: "FAIL",
      error: error?.code || error?.message || String(error)
    });
  }
});

export const ADAPTER_AUTHORITY_FIXTURE_RECEIPT = deepFreeze({
  schema: "UNIVERSAL_COMPASS_ADAPTER_AUTHORITY_FIXTURE_RECEIPT_v1",
  status: findings.every(finding => finding.status === "PASS")
    ? "PASS"
    : "FAIL",
  summary: {
    testCount: findings.length,
    passCount: findings.filter(finding => finding.status === "PASS").length,
    failCount: findings.filter(finding => finding.status === "FAIL").length
  },
  findings,
  productionAuthority: false,
  referenceModelAuthority: false
});

if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("adapter-authority.fixtures.js")) {
  console.log(JSON.stringify(ADAPTER_AUTHORITY_FIXTURE_RECEIPT, null, 2));
  if (ADAPTER_AUTHORITY_FIXTURE_RECEIPT.status !== "PASS") {
    process.exitCode = 1;
  }
}
