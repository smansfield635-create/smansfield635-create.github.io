import pointerTouchPlaceholder from './pointer-touch-intake.placeholder.js';
import liveGpuBindingPlaceholder from './live-gpu-binding.placeholder.js';

const host = document.getElementById('r3d-diagnostic-host');
const canvas = document.getElementById('r3d-canvas');
const statusNode = document.getElementById('r3d-status');
const manifestNode = document.getElementById('r3d-manifest');

if (!host || !(canvas instanceof HTMLCanvasElement) || !statusNode || !manifestNode) {
  throw new Error('R3D1_DIAGNOSTIC_HOST_INCOMPLETE');
}

export const H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_DESCRIPTOR = Object.freeze({
  descriptorId: 'H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_DESCRIPTOR_v1',
  checkpoint: 'RUN_8E_R3D1',
  status: 'DIAGNOSTIC_HOST_SCAFFOLD_COMPLETE',
  hostElementId: host.id,
  canvasElementId: canvas.id,
  canvasDimensions: Object.freeze({ width: canvas.width, height: canvas.height }),
  resolvedModules: Object.freeze([
    pointerTouchPlaceholder.placeholderId,
    liveGpuBindingPlaceholder.placeholderId
  ]),
  execution: Object.freeze({
    eventListenersInstalled: false,
    pointerBindingCreated: false,
    touchBindingCreated: false,
    wheelBindingCreated: false,
    navigationProposalExecuted: false,
    webGLContextCreated: false,
    persistentRendererInitialized: false,
    liveGpuCameraBindingCreated: false,
    bitmapPreviewCreated: false,
    publicRouteBound: false
  }),
  nextCheckpoint: 'RUN_8E_R3D2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_POINTER_AND_TOUCH_INTAKE_R3D2'
});

statusNode.textContent = 'R3D1 diagnostic host scaffold and module paths resolved.';
manifestNode.textContent = JSON.stringify(H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_DESCRIPTOR, null, 2);
document.documentElement.dataset.r3d1Ready = 'true';
window.H_EARTH_RUN8E_R3D1_DIAGNOSTIC_HOST_DESCRIPTOR = H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_DESCRIPTOR;

export default H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_DESCRIPTOR;
