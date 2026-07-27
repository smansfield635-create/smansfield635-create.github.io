import { buildHEarthRun8ER3AWaypointPacket } from '../../render/live-renderer-contract.run8e-r3a.js';
import { createHEarthRun8ER3CPersistentRenderer } from '../../render/persistent-live-renderer.run8e-r3c.js';

const canvas = document.getElementById('r3c-canvas');
const statusNode = document.getElementById('r3c-status');
const metricsNode = document.getElementById('r3c-metrics');
if (!canvas || !statusNode || !metricsNode) throw new Error('R3C_DIAGNOSTIC_HOST_INCOMPLETE');

const WIDTH = 640;
const HEIGHT = 360;
const FRAME_TARGET = 180;
const CAPTURE_FRAMES = new Map([[1, 'start'], [90, 'middle'], [180, 'final']]);
const WAYPOINTS = Object.freeze(['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE']);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (value) => value * value * (3 - 2 * value);
const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const normalize = (value) => {
  const length = Math.hypot(value.x, value.y, value.z);
  if (!(length > Number.EPSILON)) throw new Error('R3C_VECTOR_NORMALIZATION_FAILED');
  return { x: value.x / length, y: value.y / length, z: value.z / length };
};
const lookAt = (position, target, up) => {
  const forward = normalize(subtract(target, position));
  const right = normalize(cross(forward, up));
  const correctedUp = cross(right, forward);
  return [
    right.x, correctedUp.x, -forward.x, 0,
    right.y, correctedUp.y, -forward.y, 0,
    right.z, correctedUp.z, -forward.z, 0,
    -dot(right, position), -dot(correctedUp, position), dot(forward, position), 1
  ];
};
const perspective = (verticalFovDegrees, aspect, nearPlane, farPlane) => {
  const f = 1 / Math.tan(verticalFovDegrees * Math.PI / 360);
  const range = 1 / (nearPlane - farPlane);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (farPlane + nearPlane) * range, -1,
    0, 0, 2 * farPlane * nearPlane * range, 0
  ];
};
const multiply4 = (left, right) => {
  const output = new Array(16).fill(0);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      for (let index = 0; index < 4; index += 1) output[column * 4 + row] += left[index * 4 + row] * right[column * 4 + index];
    }
  }
  return output;
};
const interpolateVector = (left, right, t) => ({
  x: lerp(left.x, right.x, t),
  y: lerp(left.y, right.y, t),
  z: lerp(left.z, right.z, t)
});

async function executeContinuousLoop() {
  statusNode.textContent = 'Initializing persistent WebGL2 resources…';
  const waypointPackets = WAYPOINTS.map((waypointId, index) =>
    buildHEarthRun8ER3AWaypointPacket(waypointId, { width: WIDTH, height: HEIGHT, pixelRatio: 1 }, index + 1));
  const initialPacket = waypointPackets[0];
  if (waypointPackets.some((packet) => packet.packageIdentity !== initialPacket.packageIdentity || packet.packageContentDigest !== initialPacket.packageContentDigest)) {
    throw new Error('R3C_WAYPOINT_PACKAGE_IDENTITY_DRIFT');
  }
  const renderer = createHEarthRun8ER3CPersistentRenderer({ canvas, width: WIDTH, height: HEIGHT });
  const initialization = renderer.initialize(initialPacket);
  const captures = {};
  const timestamps = [];
  let activeCallbacks = 0;
  let maximumConcurrentCallbacks = 0;
  let scheduledCallbacks = 0;
  let completedFrames = 0;

  const createFramePacket = (frameNumber) => {
    const normalized = (frameNumber - 1) / Math.max(1, FRAME_TARGET - 1);
    const route = normalized * WAYPOINTS.length;
    const segmentIndex = Math.min(WAYPOINTS.length - 1, Math.floor(route));
    const nextIndex = (segmentIndex + 1) % WAYPOINTS.length;
    const local = smoothstep(route - Math.floor(route));
    const left = waypointPackets[segmentIndex];
    const right = waypointPackets[nextIndex];
    const position = interpolateVector(left.camera.position, right.camera.position, local);
    const target = interpolateVector(left.camera.target, right.camera.target, local);
    const up = normalize(interpolateVector(left.camera.up, right.camera.up, local));
    const verticalFovDegrees = lerp(left.camera.verticalFovDegrees, right.camera.verticalFovDegrees, local);
    const nearPlane = lerp(left.camera.nearPlane, right.camera.nearPlane, local);
    const farPlane = lerp(left.camera.farPlane, right.camera.farPlane, local);
    const viewMatrix = lookAt(position, target, up);
    const projectionMatrix = perspective(verticalFovDegrees, WIDTH / HEIGHT, nearPlane, farPlane);
    const viewProjectionMatrix = multiply4(projectionMatrix, viewMatrix);
    if (viewProjectionMatrix.some((value) => !finite(value))) throw new Error('R3C_INTERPOLATED_VIEW_PROJECTION_INVALID');
    return {
      ...initialPacket,
      frameSequence: frameNumber,
      navigationStateId: `${left.navigationStateId}->${right.navigationStateId}:${frameNumber}`,
      camera: {
        position,
        target,
        up,
        verticalFovDegrees,
        nearPlane,
        farPlane,
        viewMatrix,
        projectionMatrix,
        viewProjectionMatrix
      },
      successorTerrainCameraReconciled: true,
      navigationAuthorityMutated: false,
      worldBuiltBecauseCameraMoved: false
    };
  };

  statusNode.textContent = 'Executing continuous requestAnimationFrame camera loop…';
  await new Promise((resolve, reject) => {
    const step = (timestamp) => {
      activeCallbacks += 1;
      maximumConcurrentCallbacks = Math.max(maximumConcurrentCallbacks, activeCallbacks);
      try {
        completedFrames += 1;
        timestamps.push(timestamp);
        const packet = createFramePacket(completedFrames);
        renderer.renderFrame(packet);
        const captureLabel = CAPTURE_FRAMES.get(completedFrames);
        if (captureLabel) captures[captureLabel] = renderer.captureColorFrame(captureLabel);
        if (completedFrames >= FRAME_TARGET) {
          activeCallbacks -= 1;
          resolve();
          return;
        }
        scheduledCallbacks += 1;
        requestAnimationFrame(step);
      } catch (error) {
        activeCallbacks -= 1;
        reject(error);
        return;
      }
      activeCallbacks -= 1;
    };
    scheduledCallbacks += 1;
    requestAnimationFrame(step);
  });

  const depthOutput = renderer.captureDepthSummary();
  const resources = renderer.getResourceReceipt();
  const intervals = timestamps.slice(1).map((value, index) => value - timestamps[index]);
  const durationMs = timestamps.at(-1) - timestamps[0];
  const averageFrameIntervalMs = intervals.reduce((sum, value) => sum + value, 0) / Math.max(1, intervals.length);
  const captureHashes = Object.fromEntries(Object.entries(captures).map(([key, value]) => [key, value.summary.byteHash]));
  const distinctCaptureHashCount = new Set(Object.values(captureHashes)).size;
  const minimumVisiblePixels = Math.floor(WIDTH * HEIGHT * 0.002);
  const issues = [];
  if (completedFrames !== FRAME_TARGET) issues.push('R3C_FRAME_COUNT_INVALID');
  if (scheduledCallbacks !== FRAME_TARGET) issues.push('R3C_REQUEST_ANIMATION_FRAME_SCHEDULE_COUNT_INVALID');
  if (maximumConcurrentCallbacks !== 1) issues.push('R3C_CALLBACK_CONCURRENCY_INVALID');
  if (!(durationMs > 500)) issues.push('R3C_LOOP_DURATION_INSUFFICIENT');
  if (resources.counters.contextCreationCount !== 1) issues.push('R3C_CONTEXT_NOT_PERSISTENT');
  if (resources.counters.shaderCompileCount !== 4 || resources.counters.programLinkCount !== 2) issues.push('R3C_PROGRAM_RESOURCE_COUNT_INVALID');
  if (resources.counters.bufferCreateCount !== 9 || resources.counters.bufferUploadCount !== 9) issues.push('R3C_GPU_BUFFER_INITIALIZATION_INVALID');
  if (resources.counters.postInitializationResourceCreationCount !== 0) issues.push('R3C_POST_INITIALIZATION_RESOURCE_CREATION');
  if (resources.counters.postInitializationBufferUploadCount !== 0) issues.push('R3C_POST_INITIALIZATION_BUFFER_UPLOAD');
  if (resources.counters.cameraUniformUpdateCount !== FRAME_TARGET * 2) issues.push('R3C_CAMERA_UNIFORM_UPDATE_COUNT_INVALID');
  if (resources.counters.geometryDrawCallCount !== FRAME_TARGET * 4) issues.push('R3C_DRAW_CALL_COUNT_INVALID');
  if (resources.counters.totalDrawnIndexCount !== FRAME_TARGET * initialPacket.gpuBufferElementCounts.indices) issues.push('R3C_DRAWN_INDEX_COVERAGE_INVALID');
  if (distinctCaptureHashCount !== 3) issues.push('R3C_CAMERA_FRAMES_NOT_DISTINCT');
  if (Object.values(captures).some((capture) => capture.summary.nonClearPixelCount < minimumVisiblePixels || capture.summary.uniqueColorBucketCount < 8)) issues.push('R3C_CAPTURE_NOT_INSPECTABLE');
  if (depthOutput.nonClearPixelCount < minimumVisiblePixels || depthOutput.uniqueColorBucketCount < 3) issues.push('R3C_DEPTH_OUTPUT_NOT_INSPECTABLE');
  if (!resources.resourceIdentityStable || !resources.packageUploadedOnce || !resources.noPostInitializationResourceCreation || !resources.noPostInitializationBufferUpload) issues.push('R3C_RESOURCE_PERSISTENCE_AUDIT_FAILED');

  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_R3C_PERSISTENT_GPU_RESOURCE_AND_CONTINUOUS_CAMERA_LOOP_BROWSER_RECEIPT',
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R3C_CONTINUOUS_CAMERA_LOOP_PASS' : 'RUN_8E_R3C_CONTINUOUS_CAMERA_LOOP_FAIL',
    rendererId: renderer.rendererId,
    initialization,
    resources,
    loop: {
      requestAnimationFrameUsed: true,
      targetFrameCount: FRAME_TARGET,
      completedFrameCount: completedFrames,
      scheduledCallbackCount: scheduledCallbacks,
      maximumConcurrentCallbacks,
      durationMs,
      intervalCount: intervals.length,
      averageFrameIntervalMs,
      minimumFrameIntervalMs: Math.min(...intervals),
      maximumFrameIntervalMs: Math.max(...intervals),
      cameraUniformUpdatesPerFrame: 2,
      drawRangesPerFrame: 4,
      worldRebuildCount: 0,
      packageUploadCountDuringLoop: 0,
      resourceCreationCountDuringLoop: 0
    },
    cameraPath: {
      waypointIds: [...WAYPOINTS],
      interpolationModel: 'SMOOTHSTEP_BETWEEN_GOVERNED_R3A_WAYPOINT_CAMERA_PACKETS',
      navigationAuthorityMutated: false,
      cameraAuthorityCreated: false,
      successorTerrainCameraReconciliationPreserved: true
    },
    captures: Object.fromEntries(Object.entries(captures).map(([key, value]) => [key, {
      label: value.label,
      frameNumber: value.frameNumber,
      width: value.width,
      height: value.height,
      summary: value.summary
    }])),
    captureHashes,
    distinctCaptureHashCount,
    depthOutput,
    boundaries: {
      gestureBindingCreated: false,
      pointerBindingCreated: false,
      touchBindingCreated: false,
      wheelBindingCreated: false,
      directManipulationMutated: false,
      navigationAuthorityMutated: false,
      publicRouteBound: false,
      publicRouteMutated: false,
      deploymentPerformed: false,
      r3DWorkStarted: false,
      run8EPassClosed: false
    },
    stoppingBoundary: 'STOP_BEFORE_DIAGNOSTIC_DIRECT_INTERACTION_R3D',
    issues
  };
  if (!receipt.eligible) throw new Error(receipt.issues.join(','));

  metricsNode.textContent = JSON.stringify({
    frames: receipt.loop,
    resources: receipt.resources.counters,
    captures: receipt.captures,
    depthOutput
  }, null, 2);
  statusNode.textContent = 'R3C persistent GPU resources and continuous camera loop complete.';
  document.documentElement.dataset.r3cReady = 'true';
  window.H_EARTH_RUN8E_R3C_FRAME_CAPTURES = Object.fromEntries(Object.entries(captures).map(([key, value]) => [key, value.pngDataUrl]));
  window.H_EARTH_RUN8E_R3C_CONTINUOUS_LOOP_RECEIPT = receipt;
  return receipt;
}

executeContinuousLoop().catch((error) => {
  statusNode.textContent = `R3C failed: ${error.message}`;
  document.documentElement.dataset.r3cReady = 'false';
  window.H_EARTH_RUN8E_R3C_CONTINUOUS_LOOP_ERROR = error.message;
  console.error(error);
});
