import {
  PRESENTATION,
  POINTER_KIND,
  deepFreeze
} from "../../assets/compass-model/compass.contracts.js";
import { createNodeRegistry } from "../../assets/compass-model/compass.nodes.js";
import { createWorldAuthority } from "../../assets/compass-model/compass.world.js";
import { createCompassController } from "../../assets/compass-model/compass.controller.js";
import { createInteractionAuthority } from "../../assets/compass-model/compass.interactions.js";
import { createCompositor } from "../../assets/compass-model/compass.compositor.js";
import { NEUTRAL_REFERENCE_PROFILE } from "../../assets/compass-model/compass.profiles.js";
import {
  NAVIGATION_EFFECT,
  createAdapters
} from "../../assets/compass-model/compass.adapters.js";

function assert(condition, code) {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    throw error;
  }
}

const definitions = [
  {
    id: "fixture-constellation-1",
    kind: "cardinal",
    presentation: PRESENTATION.CONSTELLATION,
    baseVector: [0, 1, 0],
    domain: "fixture-domain-1",
    routeKey: "fixture-route-1",
    semantic: { label: "Coordinate 1", description: "Fixture coordinate 1." }
  },
  {
    id: "fixture-constellation-2",
    kind: "cardinal",
    presentation: PRESENTATION.CONSTELLATION,
    baseVector: [1, 0, 0],
    domain: "fixture-domain-2",
    routeKey: "fixture-route-2",
    semantic: { label: "Coordinate 2", description: "Fixture coordinate 2." }
  },
  {
    id: "fixture-cluster-1",
    kind: "member",
    presentation: PRESENTATION.CLUSTER,
    baseVector: [0, 0.48, -0.88],
    domain: "fixture-cluster",
    routeKey: "fixture-member-route-1",
    semantic: { label: "Member 1", description: "Fixture member 1." }
  },
  {
    id: "fixture-cluster-2",
    kind: "member",
    presentation: PRESENTATION.CLUSTER,
    baseVector: [0.88, -0.18, 0.44],
    domain: "fixture-cluster",
    routeKey: "fixture-member-route-2",
    semantic: { label: "Member 2", description: "Fixture member 2." }
  }
];

function createHarness() {
  const nodes = createNodeRegistry(definitions);
  let rendered = null;
  let semantic = null;
  const routes = deepFreeze(Object.fromEntries(
    definitions.map(definition => [definition.routeKey, `#${definition.id}`])
  ));

  const adapters = createAdapters({
    routes,
    navigationEffect: NAVIGATION_EFFECT.LOCAL_RECEIPT,
    navigate(route) {
      return deepFreeze({ accepted: true, route });
    },
    projectWorldPoint(input) {
      const viewDepth = 6 + input.worldPosition[2];
      return deepFreeze({
        nodeId: input.nodeId,
        worldRevision: input.worldRevision,
        screenX: 200 + input.worldPosition[0] * 80,
        screenY: 200 - input.worldPosition[1] * 80,
        radiusPx: 32,
        viewDepth,
        normalizedDepth: Math.min(1, Math.max(0, viewDepth / input.camera.far)),
        visible: true
      });
    },
    renderFrame(snapshot) {
      rendered = snapshot;
      return deepFreeze({ rendered: snapshot.records.length });
    },
    semanticPublisher(snapshot) {
      semantic = snapshot;
      return deepFreeze({ published: snapshot.records.length });
    }
  });

  const world = createWorldAuthority({
    profile: NEUTRAL_REFERENCE_PROFILE,
    nodes
  });
  const compositor = createCompositor({
    profile: NEUTRAL_REFERENCE_PROFILE,
    adapters
  });
  const controller = createCompassController({
    profile: NEUTRAL_REFERENCE_PROFILE,
    adapters,
    nodes,
    world
  });
  let now = 0;
  const interactions = createInteractionAuthority({
    profile: NEUTRAL_REFERENCE_PROFILE,
    controller,
    compositor,
    world,
    clock: () => now,
    reducedMotion: false
  });

  function refresh() {
    const state = controller.getState();
    const worldSnapshot = world.evaluate({
      presentation: state.presentation,
      orientation: state.orientation
    });
    const projection = compositor.project(worldSnapshot);
    compositor.render(projection);
    adapters.publishSemantic(projection);
    return { state, worldSnapshot, projection };
  }

  return {
    nodes,
    adapters,
    world,
    compositor,
    controller,
    interactions,
    refresh,
    advance(milliseconds) {
      now += milliseconds;
    },
    getRendered: () => rendered,
    getSemantic: () => semantic
  };
}

export function runNeutralReferenceIntegrationFixtures() {
  const results = [];
  const test = (id, fn) => {
    try {
      fn();
      results.push(deepFreeze({ id, status: "PASS" }));
    } catch (error) {
      results.push(deepFreeze({
        id,
        status: "FAIL",
        code: error.code || error.message
      }));
    }
  };

  test("INITIAL_CONSTELLATION_PIPELINE", () => {
    const harness = createHarness();
    const frame = harness.refresh();
    assert(frame.state.presentation === PRESENTATION.CONSTELLATION, "INITIAL_PRESENTATION_INVALID");
    assert(frame.worldSnapshot.records.length === 2, "INITIAL_WORLD_RECORD_COUNT_INVALID");
    assert(frame.projection.records.length === 2, "INITIAL_PROJECTION_RECORD_COUNT_INVALID");
    assert(frame.projection.records.every(record => record.world && record.visual && record.projection), "INITIAL_COMPOSITE_SHAPE_INVALID");
  });

  test("POINTER_DOWN_REMAINS_PENDING", () => {
    const harness = createHarness();
    const receipt = harness.interactions.begin({
      id: 1,
      kind: POINTER_KIND.MOUSE,
      x: 0,
      y: 0,
      timestamp: 0
    });
    assert(receipt.transactionStarted === false, "POINTER_DOWN_STARTED_TRANSACTION");
  });

  test("CONSTELLATION_DRAG_COMMITS_WORLD_PRIMARY", () => {
    const harness = createHarness();
    harness.interactions.begin({ id: 1, kind: POINTER_KIND.MOUSE, x: 0, y: 0, timestamp: 0 });
    const move = harness.interactions.move({ id: 1, x: 20, y: 0, timestamp: 16 });
    assert(move.phase === "DRAGGING", "CONSTELLATION_DRAG_NOT_ACTIVE");
    assert(harness.controller.getState().primaryId === move.primaryId, "CONTROLLER_WORLD_PRIMARY_DISAGREEMENT");
    harness.interactions.end({ id: 1, timestamp: 32 });
    assert(harness.controller.getState().orientationPhase === "COMMITTED", "CONSTELLATION_COMMIT_MISSING");
  });

  test("DRAG_CANCEL_RESTORES_ORIGIN", () => {
    const harness = createHarness();
    const origin = harness.controller.getState().orientation;
    harness.interactions.begin({ id: 1, kind: POINTER_KIND.MOUSE, x: 0, y: 0, timestamp: 0 });
    harness.interactions.move({ id: 1, x: 20, y: 0, timestamp: 16 });
    harness.interactions.end({ id: 1, timestamp: 32 }, { cancel: true });
    assert(JSON.stringify(harness.controller.getState().orientation) === JSON.stringify(origin), "CANCEL_DID_NOT_RESTORE_ORIGIN");
  });

  test("PUBLIC_CLUSTER_ENTRY_AND_PROJECTION", () => {
    const harness = createHarness();
    harness.controller.openCluster();
    const frame = harness.refresh();
    assert(frame.state.presentation === PRESENTATION.CLUSTER, "CLUSTER_ENTRY_FAILED");
    assert(frame.worldSnapshot.records.length === 2, "CLUSTER_WORLD_RECORD_COUNT_INVALID");
    assert(frame.projection.records.every(record => record.world.presentation === PRESENTATION.CLUSTER), "CLUSTER_PROJECTION_PRESENTATION_INVALID");
  });

  test("CLUSTER_DRAG_USES_CLUSTER_PRIMARY", () => {
    const harness = createHarness();
    harness.controller.openCluster();
    harness.interactions.begin({ id: 2, kind: POINTER_KIND.TOUCH, x: 0, y: 0, timestamp: 0 });
    const move = harness.interactions.move({ id: 2, x: 20, y: 4, timestamp: 16 });
    const primary = harness.nodes.get(move.primaryId);
    assert(primary.presentation === PRESENTATION.CLUSTER, "CLUSTER_PRIMARY_PRESENTATION_INVALID");
    harness.interactions.end({ id: 2, timestamp: 32 });
  });

  test("CLUSTER_SELECTION_AND_LOCAL_NAVIGATION", () => {
    const harness = createHarness();
    harness.controller.openCluster();
    harness.controller.select("fixture-cluster-1");
    const receipt = harness.controller.navigate("fixture-member-route-1");
    assert(harness.controller.getState().selectedId === "fixture-cluster-1", "CLUSTER_SELECTION_FAILED");
    assert(receipt.effect === NAVIGATION_EFFECT.LOCAL_RECEIPT, "LOCAL_NAVIGATION_EFFECT_INVALID");
    assert(receipt.reversible === true, "LOCAL_NAVIGATION_NOT_REVERSIBLE");
  });

  test("HELD_OVERLAY_PRESERVES_CLUSTER", () => {
    const harness = createHarness();
    harness.controller.openCluster();
    harness.controller.enterHeld("fixture");
    assert(harness.controller.getState().presentation === PRESENTATION.CLUSTER, "HELD_CHANGED_PRESENTATION");
    harness.controller.leaveHeld();
    assert(harness.controller.getState().presentation === PRESENTATION.CLUSTER, "LEAVE_HELD_CHANGED_PRESENTATION");
  });

  test("RETURN_TO_CONSTELLATION_PUBLICLY", () => {
    const harness = createHarness();
    harness.controller.openCluster();
    harness.controller.returnToConstellation();
    const frame = harness.refresh();
    assert(frame.state.presentation === PRESENTATION.CONSTELLATION, "CONSTELLATION_RETURN_FAILED");
    assert(frame.worldSnapshot.records.every(record => record.presentation === PRESENTATION.CONSTELLATION), "CONSTELLATION_RETURN_RECORDS_INVALID");
  });

  test("REDUCED_MOTION_REMAINS_FUNCTIONAL", () => {
    const harness = createHarness();
    const normal = harness.interactions.getEffectiveRadiansPerPixel();
    harness.interactions.setReducedMotion(true);
    const reduced = harness.interactions.getEffectiveRadiansPerPixel();
    assert(reduced > 0 && reduced < normal, "REDUCED_MOTION_NOT_FUNCTIONAL");
  });

  test("RENDER_AND_SEMANTIC_SHARE_PROJECTION_SNAPSHOT", () => {
    const harness = createHarness();
    const frame = harness.refresh();
    assert(harness.getRendered() === frame.projection, "RENDER_SNAPSHOT_IDENTITY_MISMATCH");
    assert(harness.getSemantic() === frame.projection, "SEMANTIC_SNAPSHOT_IDENTITY_MISMATCH");
  });

  test("DISPOSAL_BOUNDARIES_LOCK_OPERATIONS", () => {
    const harness = createHarness();
    harness.compositor.dispose();
    harness.adapters.dispose();
    let compositorRejected = false;
    let adaptersRejected = false;
    try {
      harness.compositor.project(harness.world.evaluate({
        presentation: PRESENTATION.CONSTELLATION,
        orientation: [0, 0, 0, 1]
      }));
    } catch {
      compositorRejected = true;
    }
    try {
      harness.adapters.resolveRoute("fixture-route-1");
    } catch {
      adaptersRejected = true;
    }
    assert(compositorRejected && adaptersRejected, "DISPOSAL_LOCKOUT_FAILED");
  });

  const failed = results.filter(result => result.status === "FAIL");
  return deepFreeze({
    schema: "NEUTRAL_REFERENCE_INTEGRATION_FIXTURE_RECEIPT_v1",
    status: failed.length ? "FAIL" : "PASS",
    testCount: results.length,
    passCount: results.length - failed.length,
    failCount: failed.length,
    results,
    productionAuthority: false,
    referenceModelAuthority: false
  });
}
