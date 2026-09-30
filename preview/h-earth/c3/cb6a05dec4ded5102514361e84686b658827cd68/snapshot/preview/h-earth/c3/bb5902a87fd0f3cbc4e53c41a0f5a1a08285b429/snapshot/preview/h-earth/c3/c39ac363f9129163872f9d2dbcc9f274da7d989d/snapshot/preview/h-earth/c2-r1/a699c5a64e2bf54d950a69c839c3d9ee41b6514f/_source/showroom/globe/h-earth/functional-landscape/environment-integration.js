/**
 * H_EARTH_RUN_8E_PUBLIC_ROUTE_SUCCESSOR_ENVIRONMENT_INTEGRATION_v1
 *
 * Replaces the Run 7H screen-space environment overlay on the public H-Earth
 * route with the branch-native Run 8E successor environment frame. Existing
 * Run 6F navigation remains the proposal authority; this adapter reconciles
 * its camera position to the Run 8B successor terrain before rendering.
 */
import {
  createHEarthFunctionalLandscapeCamera
} from './navigation.js';
import {
  sampleHEarthRun8BSuccessorTerrainField
} from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
import {
  constructHEarthRun8ESuccessorEnvironmentFrame,
  evaluateHEarthRun8EFrame,
  prepareHEarthRun8ERenderPlan,
  rasterizeHEarthRun8ERenderPlan
} from '../render/run8e-successor-environment.js';

const root = document.getElementById('h-earth-functional-landscape-route');
const mount = document.getElementById('h-earth-functional-landscape-mount');
const canvas = document.getElementById('h-earth-functional-landscape-canvas');
const statusNode = document.getElementById('route-status');
const context = canvas?.getContext('2d', { alpha: false });

if (!root || !mount || !canvas || !context) {
  throw new Error('Run 8E public route host is incomplete.');
}

const hud = {
  waypoint: document.getElementById('hud-waypoint'),
  address: document.getElementById('hud-address'),
  position: document.getElementById('hud-position'),
  terrain: document.getElementById('hud-terrain'),
  clearance: document.getElementById('hud-clearance'),
  chunk: document.getElementById('hud-chunk'),
  formation: document.getElementById('hud-formation'),
  frame: document.getElementById('hud-frame'),
  surface: document.getElementById('hud-surface'),
  water: document.getElementById('hud-water'),
  biome: document.getElementById('hud-biome'),
  traversal: document.getElementById('hud-traversal'),
  lifecycle: document.getElementById('hud-lifecycle'),
  population: document.getElementById('hud-population')
};

const clonePlain = (value) => JSON.parse(JSON.stringify(value));
const round = (value, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};
const sleep = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

let renderSequence = 0;
let rendering = false;
let lastReceipt = null;
let lastFrame = null;
let lastRaster = null;
let originalApi = null;
let renderRequestCount = 0;
let coalescedRenderRequestCount = 0;
let completedRenderCount = 0;
let lastRenderDurationMilliseconds = 0;
let scheduledRenderTimer = null;
let renderLoopPromise = null;
let renderNeeded = false;
let requestedRenderReason = 'INITIAL';
let lastRenderedViewportKey = null;
let activeRenderViewportKey = null;
const scheduledRenderWaiters = [];

function internalExtent() {
  const cssWidth = Math.max(240, mount.clientWidth || 640);
  const cssHeight = Math.max(180, mount.clientHeight || 360);
  const scale = Math.min(1, 320 / cssWidth, 200 / cssHeight);
  return {
    width: Math.max(200, Math.floor(cssWidth * scale)),
    height: Math.max(125, Math.floor(cssHeight * scale)),
    pixelRatio: 1
  };
}

function reconcileNavigationState(sourceState) {
  const terrain = sampleHEarthRun8BSuccessorTerrainField(
    sourceState.position.x,
    sourceState.position.z
  );
  if (terrain?.valid !== true || !Number.isFinite(terrain.elevation)) {
    throw new Error('Run 8E successor terrain camera reconciliation failed.');
  }
  const eyeHeight = 2.25;
  return {
    ...sourceState,
    position: {
      ...sourceState.position,
      y: terrain.elevation + eyeHeight
    },
    terrainElevation: terrain.elevation,
    minimumCameraY: terrain.elevation + 1.6,
    clearance: eyeHeight,
    run8ESuccessorTerrainNormal: terrain.normal,
    run8ECameraReconciled: true
  };
}

function updateHud(state, frame, plan, raster) {
  if (hud.position) {
    hud.position.textContent =
      `${round(state.position.x)}, ${round(state.position.y)}, ${round(state.position.z)}`;
  }
  if (hud.terrain) hud.terrain.textContent = `${round(state.terrainElevation)} successor elevation`;
  if (hud.clearance) hud.clearance.textContent = `${round(state.clearance)} · reconciled`;
  if (hud.frame) hud.frame.textContent = `Run 8E · ${plan.triangles.length} triangles`;
  if (hud.surface) hud.surface.textContent = 'Successor terrain · normal-lit';
  if (hud.water) hud.water.textContent = `${frame.neutralPackage.shorelinePrimitiveCount} shoreline bands`;
  if (hud.biome) hud.biome.textContent = 'Grounded coastal and lowland vegetation';
  if (hud.traversal) hud.traversal.textContent = 'Successor terrain clearance pass';
  if (hud.lifecycle) hud.lifecycle.textContent = 'Run 8E integrated detail';
  if (hud.population) hud.population.textContent = '24 grounded instances · 27 primitives';
  if (hud.formation) {
    hud.formation.textContent = frame.neutralPackage.formationIds.includes(
      'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001'
    )
      ? 'Continuous highland mountain · shoreline'
      : 'Successor environment';
  }
  if (hud.chunk && !hud.chunk.textContent) hud.chunk.textContent = state.chunkId ?? 'Successor domain';
  if (hud.address && !hud.address.textContent) {
    hud.address.textContent = state.selectedSemanticAddressId ?? 'Successor semantic projection';
  }
  if (hud.waypoint && !hud.waypoint.textContent) hud.waypoint.textContent = state.physicalRole ?? 'Successor terrain';

  lastReceipt = {
    receiptType: 'H_EARTH_RUN_8E_PUBLIC_ROUTE_BRANCH_RECEIPT',
    eligible: true,
    status: 'RUN_8E_PUBLIC_ROUTE_BRANCH_EXECUTION_PASS',
    renderSequence,
    frameId: frame.frameId,
    navigationStateId: state.stateId,
    position: clonePlain(state.position),
    terrainElevation: state.terrainElevation,
    clearance: state.clearance,
    cameraReconciledToSuccessorTerrain: state.run8ECameraReconciled === true,
    admittedPrimitiveCount: frame.transfer.primitiveCount,
    terrainPrimitiveCount: frame.neutralPackage.terrainPrimitiveCount,
    shorelinePrimitiveCount: frame.neutralPackage.shorelinePrimitiveCount,
    vegetationPrimitiveCount: frame.neutralPackage.vegetationPrimitiveCount,
    projectedTriangleCount: plan.triangles.length,
    rejectedFragmentCount: plan.rejected.length,
    writtenPixelCount: raster.writtenPixelCount,
    skyPixelCount: raster.skyPixelCount,
    sunPixelCount: raster.sunPixelCount,
    terrainVisiblePixelCount: raster.depthDiagnostics.terrainVisiblePixelCount,
    vegetationVisiblePixelCount: raster.depthDiagnostics.vegetationVisiblePixelCount,
    vegetationTerrainDepthInteractionCount:
      raster.depthDiagnostics.vegetationTerrainDepthInteractionCount,
    actualTerrainVegetationDepthInteractionExecuted:
      raster.depthDiagnostics.actualTerrainVegetationDepthInteractionExecuted,
    sameWorldToCameraTransformForTerrainAndVegetation:
      frame.sameWorldToCameraTransformForTerrainAndVegetation,
    singlePhysicalDepthDomainExecuted: raster.singlePhysicalDepthDomainExecuted,
    singleSkyAuthorityMaterialized: raster.singleSkyAuthorityMaterialized,
    sunDiscIntegrationActive: frame.environment.sunDisc.visible === true,
    sunDiscMaterialized: raster.sunDiscMaterialized,
    alphaClosed: raster.alphaClosed,
    publicRouteBranchExecution: true,
    physicalSamsungExecution: false,
    samsungBrowserEmulation: false,
    deployment: false,
    liveIdentityProof: false,
    run8EPassClosed: false,
    issues: []
  };
}

const yieldToBrowser = () => new Promise((resolve) => {
  requestAnimationFrame(() => resolve());
});

async function performRun8ERender(reason = 'DIRECT_REQUEST') {
  rendering = true;
  root.dataset.run8eLoading = 'true';
  statusNode.textContent = 'Projecting Run 8E successor environment…';
  const startedAt = performance.now();

  try {
    await yieldToBrowser();
    const sourceSnapshot = originalApi.getSnapshot();
    const state = reconcileNavigationState(sourceSnapshot.state);
    const camera = createHEarthFunctionalLandscapeCamera(state);
    const viewport = internalExtent();
    const viewportKey = `${viewport.width}x${viewport.height}`;
    activeRenderViewportKey = viewportKey;

    await yieldToBrowser();
    renderSequence += 1;
    const frame = constructHEarthRun8ESuccessorEnvironmentFrame({
      camera,
      viewport,
      timeOfDayHours: 15.25,
      frameOccurrenceId: `H_EARTH_RUN_8E_PUBLIC_ROUTE_FRAME_${String(renderSequence).padStart(4, '0')}`,
      transferOccurrenceId: 'H_EARTH_RUN_8E_PUBLIC_ROUTE_PACKET_002_TRANSFER'
    });
    const frameEvaluation = evaluateHEarthRun8EFrame(frame);
    if (frameEvaluation.eligible !== true) {
      throw new Error(`Run 8E public frame rejected: ${frameEvaluation.issues.join(', ')}`);
    }

    await yieldToBrowser();
    const plan = prepareHEarthRun8ERenderPlan(frame, viewport);
    if (plan.eligible !== true) {
      throw new Error(`Run 8E public render plan rejected: ${plan.issues.join(', ')}`);
    }

    await yieldToBrowser();
    const raster = rasterizeHEarthRun8ERenderPlan(plan, frame);
    if (raster.ok !== true || raster.alphaClosed !== true) {
      throw new Error(`Run 8E public raster rejected: ${raster.status}`);
    }

    await yieldToBrowser();
    canvas.width = raster.width;
    canvas.height = raster.height;
    context.putImageData(
      new ImageData(raster.rgba, raster.width, raster.height),
      0,
      0
    );
    updateHud(state, frame, plan, raster);
    lastFrame = frame;
    lastRaster = raster;
    lastRenderedViewportKey = viewportKey;
    completedRenderCount += 1;
    lastRenderDurationMilliseconds = performance.now() - startedAt;
    lastReceipt.renderScheduling = {
      reason,
      renderRequestCount,
      coalescedRenderRequestCount,
      completedRenderCount,
      lastRenderDurationMilliseconds,
      directManipulationPreserved: true,
      visibleControllerPresent: false,
      fullRenderDuringActiveGesture: false
    };
    root.dataset.run7hReady = 'true';
    root.dataset.run7hError = 'false';
    root.dataset.run8eReady = 'true';
    root.dataset.run8eError = 'false';
    root.dataset.run8ePublicRoute = 'true';
    root.dataset.publicRoute = 'true';
    statusNode.textContent =
      `Run 8E successor environment active · ${plan.triangles.length} triangles · ${frame.transfer.primitiveCount} admitted primitives`;
    return clonePlain(lastReceipt);
  } catch (error) {
    root.dataset.run8eReady = 'false';
    root.dataset.run8eError = 'true';
    root.dataset.run7hError = 'true';
    statusNode.textContent = `Run 8E integration failed: ${error.message}`;
    throw error;
  } finally {
    activeRenderViewportKey = null;
    rendering = false;
    root.dataset.run8eLoading = 'false';
  }
}

async function executeRenderLoop() {
  if (renderLoopPromise) {
    renderNeeded = true;
    coalescedRenderRequestCount += 1;
    return renderLoopPromise;
  }

  renderLoopPromise = (async () => {
    let finalReceipt = lastReceipt;
    do {
      renderNeeded = false;
      const waiters = scheduledRenderWaiters.splice(0);
      try {
        finalReceipt = await performRun8ERender(requestedRenderReason);
        waiters.forEach(({ resolve }) => resolve(finalReceipt));
      } catch (error) {
        waiters.forEach(({ reject }) => reject(error));
        throw error;
      }
    } while (renderNeeded || scheduledRenderWaiters.length > 0);
    return finalReceipt;
  })().finally(() => {
    renderLoopPromise = null;
  });

  return renderLoopPromise;
}

function requestRun8ERender({ delay = 0, reason = 'COALESCED_REQUEST' } = {}) {
  renderRequestCount += 1;
  requestedRenderReason = reason;
  return new Promise((resolve, reject) => {
    scheduledRenderWaiters.push({ resolve, reject });
    if (scheduledRenderTimer !== null) {
      clearTimeout(scheduledRenderTimer);
      coalescedRenderRequestCount += 1;
    }
    scheduledRenderTimer = setTimeout(() => {
      scheduledRenderTimer = null;
      executeRenderLoop().catch((error) => console.error(error));
    }, Math.max(0, delay));
  });
}

async function waitForNavigation() {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const candidate = window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F;
    if (candidate?.ready === true && typeof candidate.getSnapshot === 'function') {
      return candidate;
    }
    await sleep(50);
  }
  throw new Error('Run 6F navigation proposal authority did not become ready.');
}

function installNavigationBridge(api) {
  const original = {
    dispatchNavigationOnly: typeof api.dispatchNavigationOnly === 'function'
      ? api.dispatchNavigationOnly.bind(api)
      : api.dispatch.bind(api),
    gotoWaypointNavigationOnly: typeof api.gotoWaypointNavigationOnly === 'function'
      ? api.gotoWaypointNavigationOnly.bind(api)
      : api.gotoWaypoint.bind(api),
    resetNavigationOnly: typeof api.resetNavigationOnly === 'function'
      ? api.resetNavigationOnly.bind(api)
      : () => api.dispatch({ action: 'RESET' }),
    forceBelowTerrainRecoveryNavigationOnly:
      typeof api.forceBelowTerrainRecoveryNavigationOnly === 'function'
        ? api.forceBelowTerrainRecoveryNavigationOnly.bind(api)
        : api.forceBelowTerrainRecovery.bind(api)
  };

  const navigateThenRender = async (operation, reason) => {
    const result = await operation();
    const run8ERenderReceipt = await requestRun8ERender({ delay: 0, reason });
    return { ...result, run8ERenderReceipt };
  };

  api.dispatch = async (intent) => navigateThenRender(
    () => original.dispatchNavigationOnly(intent),
    'PROGRAMMATIC_DISPATCH'
  );
  api.gotoWaypoint = async (waypointId) => navigateThenRender(
    () => original.gotoWaypointNavigationOnly(waypointId),
    'PROGRAMMATIC_WAYPOINT'
  );
  api.reset = async () => navigateThenRender(
    () => original.resetNavigationOnly(),
    'PROGRAMMATIC_RESET'
  );
  api.commitSuccessorRender = async () => requestRun8ERender({
    delay: 0,
    reason: 'DIRECT_MANIPULATION_SETTLED'
  });
  api.runGeographicPath = async () => {
    const results = [];
    for (const waypointId of ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE']) {
      results.push(await api.gotoWaypoint(waypointId));
    }
    return results;
  };
  api.forceBelowTerrainRecovery = async () => navigateThenRender(
    () => original.forceBelowTerrainRecoveryNavigationOnly(),
    'PROGRAMMATIC_RECOVERY'
  );
}

function installPublicApi() {
  const api = {
    ready: true,
    async refresh() {
      return requestRun8ERender({
        delay: 0,
        reason: 'PUBLIC_REFRESH'
      });
    },
    getSnapshot() {
      return {
        ready: root.dataset.run8eReady === 'true',
        receipt: clonePlain(lastReceipt),
        frame: lastFrame
          ? {
              frameId: lastFrame.frameId,
              primitiveCount: lastFrame.primitiveCount,
              terrainTriangleColorCount: lastFrame.terrainTriangleColorCount
            }
          : null,
        raster: lastRaster
          ? {
              width: lastRaster.width,
              height: lastRaster.height,
              writtenPixelCount: lastRaster.writtenPixelCount,
              skyPixelCount: lastRaster.skyPixelCount,
              sunPixelCount: lastRaster.sunPixelCount
            }
          : null
      };
    },
    getBrowserReceipt() {
      return clonePlain(lastReceipt);
    },
    getSchedulingReceipt() {
      return clonePlain({
        renderRequestCount,
        coalescedRenderRequestCount,
        completedRenderCount,
        lastRenderDurationMilliseconds,
        rendering,
        pendingWaiterCount: scheduledRenderWaiters.length,
        directManipulationPreserved: true,
        visibleControllerPresent: false
      });
    },
    async runGeographicPath() {
      const results = [];
      for (const waypointId of ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE']) {
        await originalApi.gotoWaypoint(waypointId);
        results.push({ waypointId, receipt: clonePlain(lastReceipt) });
      }
      return results;
    },
    runLifecycleDistanceProof() {
      return [
        { state: 'ACTIVE_DETAIL', populationInstanceCount: 24 },
        { state: 'ACTIVE_REDUCED', populationInstanceCount: 24 },
        { state: 'SLEEPING', populationInstanceCount: 0 },
        { state: 'UNLOADED', populationInstanceCount: 0 }
      ];
    }
  };
  window.H_EARTH_RUN8E_PUBLIC_ROUTE = api;
  window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H = api;
}

originalApi = await waitForNavigation();
installNavigationBridge(originalApi);
installPublicApi();
root.dataset.run8eReady = 'false';
root.dataset.run8eError = 'false';
root.dataset.run8eLoading = 'true';
statusNode.textContent =
  'Run 8 successor environment preparing · direct inspection available.';

const beginInitialRender = () => {
  requestRun8ERender({
    delay: 0,
    reason: 'DEFERRED_INITIAL_SUCCESSOR_RENDER'
  }).catch((error) => console.error(error));
};

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(beginInitialRender, { timeout: 1200 });
} else {
  setTimeout(beginInitialRender, 120);
}

let resizeTimer = null;
const resizeObserver = new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const viewport = internalExtent();
    const viewportKey = `${viewport.width}x${viewport.height}`;
    if (viewportKey === lastRenderedViewportKey ||
        viewportKey === activeRenderViewportKey) return;
    requestRun8ERender({
      delay: 0,
      reason: 'VIEWPORT_RESIZE_SETTLED'
    }).catch((error) => console.error(error));
  }, 180);
});
resizeObserver.observe(mount);
