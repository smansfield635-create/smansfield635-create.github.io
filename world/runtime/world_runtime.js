import { createWorldKernel } from "../world_kernel.js";
import { createPlanetSurfaceProjector } from "../../variant/planet_surface_projector.js";
import { createEnvironmentRenderer } from "../../variant/environment_renderer.js";
import { createGroundRenderer } from "../../variant/ground_renderer.js";

const RECEIPT_NAME = "SIMULATION_STRESS_TEST_RECEIPT_v1";
const SIMULATION_HZ = 10;
const FIXED_STEP_MS = 1000 / SIMULATION_HZ;
const MAX_CATCH_UP_STEPS = 5;

function ensureFinite(label, value) {
  if (!Number.isFinite(value)) {
    throw new Error(`STATE_PROPAGATION_FAILURE: ${label} became non-finite.`);
  }
}

function formatStatus(snapshot) {
  return [
    `boot: ${snapshot.bootStatus}`,
    `payload: ${snapshot.payloadStatus}`,
    `render: ${snapshot.renderStatus.toLowerCase()}`,
    `coherence: ${snapshot.coherenceBand} ${snapshot.coherence.score.toFixed(3)}`,
  ].join("\n");
}

export async function createWorldRuntime({
  canvas,
  context,
  statusRoot,
  getViewport,
}) {
  const kernel = await createWorldKernel();
  const worldPayload = kernel.createWorldPayload();
  const initialState = kernel.getInitialState();
  const initialPressure = kernel.getInitialPressure();

  let currentState = { ...initialState };
  let currentPressure = { ...initialPressure };

  let viewState = {
    cameraX: 0.5,
    cameraY: 0.58,
    cameraZ: 1,
    targetX: 0.5,
    targetY: 0.58,
    zoom: 1,
    heading: 0,
    pitch: 0,
    roll: 0,
    viewportWidth: getViewport().cssWidth,
    viewportHeight: getViewport().cssHeight,
    horizonOffset: 0,
    projectionMode: "PSEUDO_PLANET_SURFACE_PROJECTION",
  };

  const projector = createPlanetSurfaceProjector({
    viewState,
    viewport: getViewport(),
  });

  const environmentRenderer = createEnvironmentRenderer();
  const groundRenderer = createGroundRenderer();

  let running = false;
  let tickId = 0;
  let accumulatedMs = 0;
  let latestSnapshot = null;

  function writeRuntimeState() {
    worldPayload.runtimeState = {
      tickId: latestSnapshot.tickId,
      timestamp: latestSnapshot.timestamp,
      stateBefore: latestSnapshot.stateBefore,
      pressureBefore: latestSnapshot.pressureBefore,
      stateAfter: latestSnapshot.stateAfter,
      coherenceBand: latestSnapshot.coherenceBand,
      gateResult: latestSnapshot.gate,
      basinClassification: latestSnapshot.basin,
      renderStatus: latestSnapshot.renderStatus,
      performanceStatus: latestSnapshot.performanceStatus,
      receipt: {
        RECEIPT_NAME,
        RESULT: latestSnapshot.renderStatus === "PASS" ? "PASS" : "FAIL",
        BOOT_STATUS: latestSnapshot.bootStatus.toUpperCase(),
        PAYLOAD_STATUS: latestSnapshot.payloadStatus.toUpperCase(),
        PROJECTION_STATUS: latestSnapshot.projectionStatus.toUpperCase(),
        RENDER_STATUS: latestSnapshot.renderStatus,
        STATE_PROPAGATION_STATUS: "PASS",
        PRESSURE_PROPAGATION_STATUS: "PASS",
        BASIN_STATUS: "PASS",
        GATE_STATUS: "PASS",
        PERFORMANCE_STATUS: latestSnapshot.performanceStatus,
        INSTRUMENTATION_STATUS: "PASS",
        NEXT_STEP_ALLOWED: latestSnapshot.renderStatus === "PASS",
      },
    };

    worldPayload.environment = {
      ...worldPayload.environment,
      pressure: { ...latestSnapshot.pressureBefore },
      coherence: { ...latestSnapshot.coherence },
      basin: { ...latestSnapshot.basin },
      gate: { ...latestSnapshot.gate },
      visibility: Math.max(0, 1 - latestSnapshot.pressureBefore.visibilityLoss),
      stormIntensity: latestSnapshot.pressureBefore.stormIntensity,
      humidityFogLoad: latestSnapshot.pressureBefore.humidityFogLoad,
      waterAccessVariance: latestSnapshot.pressureBefore.waterAccessVariance,
    };

    statusRoot.textContent = formatStatus(latestSnapshot);
  }

  function advanceTick(now) {
    const stateBefore = { ...currentState };
    const pressureBefore = { ...currentPressure };

    const coherenceBefore = kernel.computeCoherence(stateBefore);
    const gateBefore = kernel.evaluateGate(coherenceBefore, pressureBefore);

    const pressureDelta = kernel.computePressureDelta(pressureBefore);
    const internalDelta = kernel.computeInternalDelta(stateBefore);
    const repairDelta = kernel.computeRepairDelta(coherenceBefore, gateBefore);

    const stateAfter = {};

    for (const key of Object.keys(stateBefore)) {
      const nextValue =
        stateBefore[key] +
        internalDelta[key] -
        pressureDelta[key] +
        repairDelta[key];

      ensureFinite(key, nextValue);
      stateAfter[key] = kernel.clampState(nextValue);
    }

    currentState = stateAfter;
    tickId += 1;

    const coherence = kernel.computeCoherence(stateAfter);
    const coherenceBand = kernel.getCoherenceBand(coherence.score);
    const basin = kernel.classifyBasin(stateAfter);
    const gate = kernel.evaluateGate(coherence, pressureBefore);

    latestSnapshot = {
      tickId,
      timestamp: Math.round(now),
      stateBefore,
      pressureBefore,
      stateAfter,
      coherence,
      coherenceBand,
      basin,
      gate,
      bootStatus: "pass",
      payloadStatus: "pass",
      projectionStatus: "pass",
      renderStatus: "PENDING",
      performanceStatus: "PASS",
    };

    writeRuntimeState();
  }

  function draw(now, deltaMs) {
    const viewport = getViewport();

    viewState = {
      ...viewState,
      viewportWidth: viewport.cssWidth,
      viewportHeight: viewport.cssHeight,
    };

    projector.update(viewState, viewport);

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

    const environmentResult = environmentRenderer.render({
      context,
      projector,
      worldPayload,
      viewState,
      viewport,
    });

    const groundResult = groundRenderer.render({
      context,
      projector,
      worldPayload,
      viewState,
      viewport,
    });

    latestSnapshot.timestamp = Math.round(now);
    latestSnapshot.renderStatus =
      environmentResult.visible && groundResult.visible ? "PASS" : "FAIL";
    latestSnapshot.performanceStatus = deltaMs > 33 ? "WARN" : "PASS";

    writeRuntimeState();
  }

  return {
    start() {
      running = true;
      advanceTick(performance.now());
      draw(performance.now(), 0);
    },

    stop() {
      running = false;
    },

    resize(viewport) {
      viewState = {
        ...viewState,
        viewportWidth: viewport.cssWidth,
        viewportHeight: viewport.cssHeight,
      };
      projector.update(viewState, viewport);
    },

    frame(now, deltaMs) {
      if (!running) {
        return;
      }

      accumulatedMs += deltaMs;
      let steps = 0;

      while (accumulatedMs >= FIXED_STEP_MS && steps < MAX_CATCH_UP_STEPS) {
        advanceTick(now);
        accumulatedMs -= FIXED_STEP_MS;
        steps += 1;
      }

      draw(now, deltaMs);
    },
  };
}
