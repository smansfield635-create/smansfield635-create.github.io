import { installHEarthRun8ER3D2PointerTouchIntake } from './pointer-touch-intake.js';
import liveGpuBindingPlaceholder from './live-gpu-binding.placeholder.js';

const host = document.getElementById('r3d-diagnostic-host');
const canvas = document.getElementById('r3d-canvas');
const statusNode = document.getElementById('r3d-status');
const manifestNode = document.getElementById('r3d-manifest');

if (!host || !(canvas instanceof HTMLCanvasElement) || !statusNode || !manifestNode) {
  throw new Error('R3D2_DIAGNOSTIC_HOST_INCOMPLETE');
}

let intake = null;
const renderReceipt = () => {
  const receipt = intake.getReceipt();
  statusNode.textContent = `R3D2 navigation proposals: ${receipt.counters.navigationProposalCount}`;
  manifestNode.textContent = JSON.stringify(receipt, null, 2);
};

intake = installHEarthRun8ER3D2PointerTouchIntake({
  surface: canvas,
  onProposal: () => renderReceipt()
});

export const H_EARTH_RUN_8E_R3D2_DIAGNOSTIC_HOST_DESCRIPTOR = Object.freeze({
  descriptorId: 'H_EARTH_RUN_8E_R3D2_DIAGNOSTIC_HOST_DESCRIPTOR_v1',
  checkpoint: 'RUN_8E_R3D2',
  status: 'POINTER_TOUCH_NAVIGATION_PROPOSAL_INTAKE_ACTIVE',
  hostElementId: host.id,
  canvasElementId: canvas.id,
  eventSurfaceTouchAction: canvas.style.touchAction || getComputedStyle(canvas).touchAction,
  liveGpuBindingPlaceholderId: liveGpuBindingPlaceholder.placeholderId,
  execution: Object.freeze({
    pointerBindingCreated: true,
    touchPointerIntakeCreated: true,
    wheelBindingCreated: true,
    navigationProposalIntakeActive: true,
    webGLContextCreated: false,
    persistentRendererInitialized: false,
    liveGpuCameraBindingCreated: false,
    bitmapPreviewCreated: false,
    publicRouteBound: false
  }),
  nextCheckpoint: 'RUN_8E_R3D3_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_LIVE_GPU_CAMERA_BINDING_R3D3'
});

renderReceipt();
document.documentElement.dataset.r3d2Ready = 'true';
window.H_EARTH_RUN8E_R3D2_POINTER_TOUCH_INTAKE = intake;
window.H_EARTH_RUN8E_R3D2_DIAGNOSTIC_HOST_DESCRIPTOR = H_EARTH_RUN_8E_R3D2_DIAGNOSTIC_HOST_DESCRIPTOR;

export default H_EARTH_RUN_8E_R3D2_DIAGNOSTIC_HOST_DESCRIPTOR;
