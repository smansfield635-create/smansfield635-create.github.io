import {
  DEPTH_LAYER,
  PRESENTATION,
  deepFreeze,
  validateWorldSnapshot
} from "../../assets/compass-model/compass.contracts.js";
import { createCompositor } from "../../assets/compass-model/compass.compositor.js";
import { NEUTRAL_REFERENCE_PROFILE } from "../../assets/compass-model/compass.profiles.js";

function worldRecord(id, index, worldPosition) {
  return {
    id,
    index,
    kind: "fixture",
    presentation: PRESENTATION.CONSTELLATION,
    domain: "neutral",
    routeKey: `route-${id}`,
    semantic: { label: id },
    baseVector: [0, 0, 1],
    rotatedUnitVector: [0, 0, 1],
    worldPosition,
    alignmentScore: 1 - index * 0.1,
    depthScore: 1
  };
}

function createWorldSnapshot() {
  return validateWorldSnapshot({
    schema: "UNIVERSAL_COMPASS_WORLD_SNAPSHOT_v1",
    worldRevision: 7,
    presentation: PRESENTATION.CONSTELLATION,
    orientation: [0, 0, 0, 1],
    primaryId: "front",
    records: [
      worldRecord("front", 0, [0, 0, 1]),
      worldRecord("center", 1, [0, 0, 0]),
      worldRecord("rear", 2, [0, 0, -1])
    ]
  });
}

function projectionFor(input, overrides = {}) {
  const depths = {
    front: 5.5,
    center: 6,
    rear: 6.5
  };
  const viewDepth = depths[input.nodeId];
  return {
    nodeId: input.nodeId,
    worldRevision: input.worldRevision,
    screenX: 100,
    screenY: 120,
    radiusPx: 24,
    viewDepth,
    normalizedDepth: viewDepth / 60,
    visible: true,
    ...overrides
  };
}

function createHarness(projectOverride = null) {
  let receivedInputs = [];
  let rendered = null;
  const adapters = {
    projectWorldPoint(input) {
      receivedInputs.push(input);
      return projectOverride
        ? projectOverride(input)
        : projectionFor(input);
    },
    renderFrame(snapshot) {
      rendered = snapshot;
      return { accepted: true, recordCount: snapshot.records.length };
    }
  };
  const compositor = createCompositor({
    profile: NEUTRAL_REFERENCE_PROFILE,
    adapters
  });
  return {
    compositor,
    getInputs: () => receivedInputs,
    getRendered: () => rendered
  };
}

function expectError(code, operation) {
  try {
    operation();
  } catch (error) {
    if (error?.code === code) return;
    throw new Error(`EXPECTED_${code}_RECEIVED_${error?.code || error}`);
  }
  throw new Error(`EXPECTED_${code}_NOT_THROWN`);
}

const tests = [
  {
    id: "COMPOSITE_RECORDS_ARE_NESTED_AND_DEEPLY_IMMUTABLE",
    run() {
      const { compositor } = createHarness();
      const snapshot = compositor.project(createWorldSnapshot());
      const record = snapshot.records[0];
      if (!record.world || !record.visual || !record.projection) {
        throw new Error("NESTED_COMPOSITE_SECTIONS_MISSING");
      }
      if ("worldPosition" in record || "screenX" in record) {
        throw new Error("FLAT_WORLD_OR_PROJECTION_FIELD_LEAKED");
      }
      if (!Object.isFrozen(record.world.worldPosition)) {
        throw new Error("WORLD_POSITION_NOT_FROZEN");
      }
      if (!Object.isFrozen(record.projection)) {
        throw new Error("PROJECTION_NOT_FROZEN");
      }
    }
  },
  {
    id: "CANONICAL_PRIMARY_API_IS_ABSENT",
    run() {
      const { compositor } = createHarness();
      if (typeof compositor.inferPrimary !== "undefined") {
        throw new Error("COMPOSITOR_PRIMARY_AUTHORITY_REMAINS");
      }
    }
  },
  {
    id: "ADAPTER_INPUT_IDENTITY_REVISION_AND_IMMUTABILITY",
    run() {
      const { compositor, getInputs } = createHarness();
      compositor.project(createWorldSnapshot());
      const inputs = getInputs();
      if (inputs.length !== 3) throw new Error("ADAPTER_INPUT_COUNT_INVALID");
      inputs.forEach(input => {
        if (input.worldRevision !== 7) throw new Error("WORLD_REVISION_NOT_PASSED");
        if (!Object.isFrozen(input) || !Object.isFrozen(input.worldPosition)) {
          throw new Error("ADAPTER_INPUT_NOT_DEEPLY_FROZEN");
        }
      });
    }
  },
  {
    id: "ADAPTER_NODE_ID_MISMATCH_REJECTED",
    run() {
      const { compositor } = createHarness(input =>
        projectionFor(input, { nodeId: "wrong-id" })
      );
      expectError("COMPASS_ADAPTER_NODE_ID_MISMATCH", () =>
        compositor.project(createWorldSnapshot())
      );
    }
  },
  {
    id: "ADAPTER_WORLD_REVISION_MISMATCH_REJECTED",
    run() {
      const { compositor } = createHarness(input =>
        projectionFor(input, { worldRevision: input.worldRevision + 1 })
      );
      expectError("COMPASS_ADAPTER_WORLD_REVISION_MISMATCH", () =>
        compositor.project(createWorldSnapshot())
      );
    }
  },
  {
    id: "INVALID_PROJECTION_GEOMETRY_REJECTED",
    run() {
      const negativeRadius = createHarness(input =>
        projectionFor(input, { radiusPx: -1 })
      );
      expectError("COMPASS_PROJECTION_RADIUS_NEGATIVE", () =>
        negativeRadius.compositor.project(createWorldSnapshot())
      );

      const invalidDepth = createHarness(input =>
        projectionFor(input, { normalizedDepth: 2 })
      );
      expectError("COMPASS_PROJECTION_NORMALIZED_DEPTH_OUT_OF_RANGE", () =>
        invalidDepth.compositor.project(createWorldSnapshot())
      );

      const visibleBehind = createHarness(input =>
        projectionFor(input, { viewDepth: -1, normalizedDepth: 0 })
      );
      expectError("COMPASS_VISIBLE_PROJECTION_NOT_FORWARD", () =>
        visibleBehind.compositor.project(createWorldSnapshot())
      );
    }
  },
  {
    id: "DEPTH_CLASSIFICATION_USES_POSITIVE_FORWARD_DISTANCE",
    run() {
      const { compositor } = createHarness();
      const snapshot = compositor.project(createWorldSnapshot());
      const layers = Object.fromEntries(
        snapshot.records.map(record => [record.id, record.projection.depthLayer])
      );
      if (layers.front !== DEPTH_LAYER.FRONT) throw new Error("FRONT_LAYER_INVALID");
      if (layers.center !== DEPTH_LAYER.CENTER) throw new Error("CENTER_LAYER_INVALID");
      if (layers.rear !== DEPTH_LAYER.REAR) throw new Error("REAR_LAYER_INVALID");
    }
  },
  {
    id: "VISUAL_RECORD_IDENTITY_AND_DUPLICATION_ENFORCED",
    run() {
      const visual = id => ({
        id,
        visible: true,
        scale: 1,
        opacity: 1,
        prominence: 0,
        materialKey: "fixture",
        labelMode: "DEFAULT"
      });
      const unknown = createHarness();
      expectError("COMPASS_VISUAL_NODE_ID_UNKNOWN", () =>
        unknown.compositor.project(createWorldSnapshot(), [visual("unknown")])
      );
      const duplicate = createHarness();
      expectError("COMPASS_VISUAL_NODE_ID_DUPLICATE", () =>
        duplicate.compositor.project(createWorldSnapshot(), [
          visual("front"),
          visual("front")
        ])
      );
    }
  },
  {
    id: "VISUAL_RECORD_CANNOT_OVERWRITE_WORLD_OR_PROJECTION",
    run() {
      const { compositor } = createHarness();
      expectError("COMPASS_VISUAL_NODE_RECORD_KEYS_INVALID", () =>
        compositor.project(createWorldSnapshot(), [{
          id: "front",
          visible: true,
          scale: 1,
          opacity: 1,
          prominence: 0,
          materialKey: "fixture",
          labelMode: "DEFAULT",
          worldPosition: [999, 999, 999]
        }])
      );
    }
  },
  {
    id: "ONLY_CURRENT_PROJECTION_MAY_RENDER",
    run() {
      const { compositor, getRendered } = createHarness();
      const first = compositor.project(createWorldSnapshot());
      const second = compositor.project(createWorldSnapshot());
      expectError("COMPASS_PROJECTION_NOT_CURRENT", () => compositor.render(first));
      const receipt = compositor.render(second);
      if (!receipt.accepted || getRendered() !== second) {
        throw new Error("CURRENT_PROJECTION_NOT_RENDERED");
      }
    }
  },
  {
    id: "DISPOSED_COMPOSITOR_REJECTS_OPERATIONS",
    run() {
      const { compositor } = createHarness();
      compositor.dispose();
      expectError("COMPASS_COMPOSITOR_DISPOSED", () =>
        compositor.project(createWorldSnapshot())
      );
      expectError("COMPASS_COMPOSITOR_DISPOSED", () =>
        compositor.setCamera(NEUTRAL_REFERENCE_PROFILE.compositor.camera)
      );
    }
  }
];

export function runCompositorAuthorityFixtures() {
  const results = tests.map(test => {
    try {
      test.run();
      return deepFreeze({ id: test.id, status: "PASS" });
    } catch (error) {
      return deepFreeze({
        id: test.id,
        status: "FAIL",
        error: error?.stack || String(error)
      });
    }
  });
  const failed = results.filter(result => result.status === "FAIL");
  return deepFreeze({
    schema: "UNIVERSAL_COMPASS_COMPOSITOR_AUTHORITY_FIXTURE_RECEIPT_v1",
    status: failed.length === 0 ? "PASS" : "FAIL",
    testCount: results.length,
    passedCount: results.length - failed.length,
    failedCount: failed.length,
    results,
    productionAuthority: false,
    referenceModelAuthority: false
  });
}

if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("compositor-authority.fixtures.js")) {
  const receipt = runCompositorAuthorityFixtures();
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== "PASS") process.exitCode = 1;
}
