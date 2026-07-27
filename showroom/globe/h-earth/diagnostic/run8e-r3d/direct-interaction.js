import {
  createHEarthFunctionalLandscapeNavigationState
} from '../../functional-landscape/navigation.js';
import {
  createHEarthRun8ER3AFrameUniformPacket
} from '../../render/live-renderer-contract.run8e-r3a.js';
import {
  createHEarthRun8ER3CPersistentRenderer
} from '../../render/persistent-live-renderer.run8e-r3c.js';
import {
  createHEarthRun8ER3DDirectInteraction
} from '../../render/direct-interaction.run8e-r3d.js';

const canvas = document.getElementById('r3d-canvas');
const statusNode = document.getElementById('r3d-status');
const metricsNode = document.getElementById('r3d-metrics');
if (!canvas || !statusNode || !metricsNode) {
  throw new Error('R3D_DIAGNOSTIC_HOST_INCOMPLETE');
}

const WIDTH = 640;
const HEIGHT = 360;

async function initializeR3D() {
  statusNode.textContent = 'Initializing persistent WebGL2 direct interaction…';
  const navigation = createHEarthFunctionalLandscapeNavigationState({
    waypointId: 'COAST'
  });
  if (navigation?.ok !== true) {
    throw new Error(`R3D_INITIAL_NAVIGATION_REJECTED:${navigation?.issues?.join(',')}`);
  }

  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({
    navigationState: navigation.state,
    viewport: { width: WIDTH, height: HEIGHT, pixelRatio: 1 },
    frameSequence: 1
  });

  const renderer = createHEarthRun8ER3CPersistentRenderer({
    canvas,
    width: WIDTH,
    height: HEIGHT
  });
  const initialization = renderer.initialize(initialPacket);
  renderer.renderFrame(initialPacket);
  const initialCapture = renderer.captureColorFrame('initial');

  const interaction = createHEarthRun8ER3DDirectInteraction({
    canvas,
    renderer,
    initialNavigationState: navigation.state,
    viewport: { width: WIDTH, height: HEIGHT, pixelRatio: 1 }
  });

  const api = Object.freeze({
    ready: true,
    initialization,
    initialCapture,
    getReceipt() {
      const interactionReceipt = interaction.getReceipt();
      return JSON.parse(JSON.stringify({
        receiptType: 'H_EARTH_RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION_BROWSER_STATE',
        status: 'R3D_DIAGNOSTIC_READY',
        initialCapture: {
          label: initialCapture.label,
          frameNumber: initialCapture.frameNumber,
          width: initialCapture.width,
          height: initialCapture.height,
          summary: initialCapture.summary
        },
        interaction: interactionReceipt,
        resources: renderer.getResourceReceipt(),
        stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
      }));
    },
    capture(label) {
      return renderer.captureColorFrame(label);
    },
    captureDepth() {
      return renderer.captureDepthSummary();
    }
  });

  window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION = api;
  document.documentElement.dataset.r3dReady = 'true';
  statusNode.textContent = 'R3D ready. Direct touch and pointer input now updates the persistent GPU frame.';
  metricsNode.textContent = JSON.stringify({
    renderer: initialization,
    interaction: interaction.getReceipt().diagnostics,
    boundary: 'DIAGNOSTIC_ONLY_NO_PUBLIC_ROUTE'
  }, null, 2);

  const updateMetrics = () => {
    const receipt = interaction.getReceipt();
    metricsNode.textContent = JSON.stringify({
      navigationState: receipt.navigationState,
      actionCounts: receipt.actionCounts,
      pointerTypeCounts: receipt.pointerTypeCounts,
      diagnostics: receipt.diagnostics,
      resources: receipt.rendererResources.counters,
      correspondence: receipt.correspondence,
      boundaries: receipt.boundaries
    }, null, 2);
    requestAnimationFrame(updateMetrics);
  };
  requestAnimationFrame(updateMetrics);
}

initializeR3D().catch((error) => {
  statusNode.textContent = `R3D failed: ${error.message}`;
  document.documentElement.dataset.r3dReady = 'false';
  window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION_ERROR = error.message;
  console.error(error);
});
