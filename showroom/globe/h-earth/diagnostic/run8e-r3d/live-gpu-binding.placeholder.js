const freeze = (value) => Object.freeze(value);

export const H_EARTH_RUN_8E_R3D3_LIVE_GPU_BINDING_PLACEHOLDER = freeze({
  placeholderId: 'H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_BINDING_PLACEHOLDER_v1',
  checkpoint: 'RUN_8E_R3D3_NOT_STARTED',
  intendedRendererId: 'H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1',
  intendedFlow: freeze([
    'ACCEPTED_NAVIGATION_PROPOSAL',
    'R3A_FRAME_UNIFORM_PACKET',
    'R3C_PERSISTENT_RENDERER_CAMERA_UNIFORMS',
    'IMMEDIATE_VISIBLE_GPU_FRAME'
  ]),
  webGLContextCreated: false,
  persistentRendererInitialized: false,
  liveGpuCameraBindingCreated: false,
  bitmapPreviewCreated: false,
  publicRouteBound: false,
  stoppingBoundary: 'STOP_BEFORE_LIVE_GPU_CAMERA_BINDING_R3D3'
});

export default H_EARTH_RUN_8E_R3D3_LIVE_GPU_BINDING_PLACEHOLDER;
