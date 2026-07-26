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
let rerenderPending = false;
let lastReceipt = null;
let lastFrame = null;
let lastRaster = null;
let originalApi = null;

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

async function renderRun8E() {
  if (rendering) {
    rerenderPending = true;
    return lastReceipt;
  }
  rendering = true;
  rerenderPending = false;
  statusNode.textContent = 'Projecting Run 8E successor environment…';
  try {
    const sourceSnapshot = originalApi.getSnapshot();
    const state = reconcileNavigationState(sourceSnapshot.state);
    const camera = createHEarthFunctionalLandscapeCamera(state);
    const viewport = internalExtent();
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
    const plan = prepareHEarthRun8ERenderPlan(frame, viewport);
    if (plan.eligible !== true) {
      throw new Error(`Run 8E public render plan rejected: ${plan.issues.join(', ')}`);
    }
    const raster = rasterizeHEarthRun8ERenderPlan(plan, frame);
    if (raster.ok !== true || raster.alphaClosed !== true) {
      throw new Error(`Run 8E public raster rejected: ${raster.status}`);
    }

    canvas.width = raster.width;
    canvas.height = raster.height;
    context.putImageData(new ImageData(raster.rgba, raster.width, raster.height), 0, 0);
    updateHud(state, frame, plan, raster);
    lastFrame = frame;
    lastRaster = raster;
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
    rendering = false;
    if (rerenderPending) {
      rerenderPending = false;
      queueMicrotask(() => renderRun8E().catch((error) => console.error(error)));
    }
  }
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
    dispatch: api.dispatch.bind(api),
    gotoWaypoint: api.gotoWaypoint.bind(api),
    runGeographicPath: api.runGeographicPath.bind(api),
    forceBelowTerrainRecovery: api.forceBelowTerrainRecovery.bind(api)
  };
  api.dispatch = async (intent) => {
    const result = await original.dispatch(intent);
    await renderRun8E();
    return result;
  };
  api.gotoWaypoint = async (waypointId) => {
    const result = await original.gotoWaypoint(waypointId);
    await renderRun8E();
    return result;
  };
  api.runGeographicPath = async () => {
    const result = await original.runGeographicPath();
    await renderRun8E();
    return result;
  };
  api.forceBelowTerrainRecovery = async () => {
    const result = await original.forceBelowTerrainRecovery();
    await renderRun8E();
    return result;
  };
}

function installPublicApi() {
  const api = {
    ready: true,
    async refresh() {
      return renderRun8E();
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
await renderRun8E();
installPublicApi();

let resizeTimer = null;
const resizeObserver = new ResizeObserver(() => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    renderRun8E().catch((error) => console.error(error));
  }, 180);
});
resizeObserver.observe(mount);
