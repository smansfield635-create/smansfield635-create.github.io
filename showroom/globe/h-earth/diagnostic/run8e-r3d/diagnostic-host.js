import { installHEarthRun8ER3D2PointerTouchIntake } from './pointer-touch-intake.js';
import { createHEarthRun8ER3D3LiveGpuBinding } from './live-gpu-binding.js';

const host = document.getElementById('r3d-diagnostic-host');
const canvas = document.getElementById('r3d-canvas');
const statusNode = document.getElementById('r3d-status');
const manifestNode = document.getElementById('r3d-manifest');

if (!host || !(canvas instanceof HTMLCanvasElement) || !statusNode || !manifestNode) {
  throw new Error('R3D3_DIAGNOSTIC_HOST_INCOMPLETE');
}

let intake = null;
let binding = null;

const renderReceipt = () => {
  if (!intake || !binding) return;
  const intakeReceipt = intake.getReceipt();
  const bindingReceipt = binding.getReceipt();
  statusNode.textContent = `R3D3 visible GPU frames: ${bindingReceipt.counters.gpuFramebufferPresentationCount}; navigation proposals: ${intakeReceipt.counters.navigationProposalCount}`;
  manifestNode.textContent = JSON.stringify({ intake: intakeReceipt, liveGpu: bindingReceipt }, null, 2);
};

intake = installHEarthRun8ER3D2PointerTouchIntake({
  surface: canvas,
  onProposal: (proposalRecord, navigationState) => {
    binding.acceptNavigationState(proposalRecord, navigationState);
    renderReceipt();
  }
});

binding = createHEarthRun8ER3D3LiveGpuBinding({
  canvas,
  initialNavigationState: intake.getNavigationState(),
  viewport: { width: 640, height: 360, pixelRatio: 1 },
  onFramePresented: () => renderReceipt()
});

export const H_EARTH_RUN_8E_R3D3_DIAGNOSTIC_HOST_DESCRIPTOR = Object.freeze({
  descriptorId: 'H_EARTH_RUN_8E_R3D3_DIAGNOSTIC_HOST_DESCRIPTOR_v1',
  checkpoint: 'RUN_8E_R3D3',
  status: 'LIVE_GPU_CAMERA_RESPONSE_ACTIVE',
  hostElementId: host.id,
  canvasElementId: canvas.id,
  inputIntakeId: intake.intakeId,
  liveGpuBindingId: binding.bindingId,
  eventSurfaceTouchAction: canvas.style.touchAction || getComputedStyle(canvas).touchAction,
  execution: Object.freeze({
    pointerBindingCreated: true,
    touchPointerIntakeCreated: true,
    wheelBindingCreated: true,
    navigationProposalIntakeActive: true,
    webGL2ContextCreated: true,
    persistentRendererInitialized: true,
    liveGpuCameraBindingCreated: true,
    gpuFramebufferBlitActive: true,
    bitmapPreviewCreated: false,
    cssCanvasTransformPreviewCreated: false,
    publicRouteBound: false
  }),
  nextCheckpoint: 'RUN_8E_R3D4_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_INTERACTION_BROWSER_EXECUTION_R3D4'
});

renderReceipt();
document.documentElement.dataset.r3d3Ready = 'true';
window.H_EARTH_RUN8E_R3D2_POINTER_TOUCH_INTAKE = intake;
window.H_EARTH_RUN8E_R3D3_LIVE_GPU_BINDING = binding;
window.H_EARTH_RUN8E_R3D3_DIAGNOSTIC_HOST_DESCRIPTOR = H_EARTH_RUN_8E_R3D3_DIAGNOSTIC_HOST_DESCRIPTOR;

export default H_EARTH_RUN_8E_R3D3_DIAGNOSTIC_HOST_DESCRIPTOR;
