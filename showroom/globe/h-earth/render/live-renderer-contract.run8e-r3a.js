/** H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_v2 */
import {
  H_EARTH_RUN_8E_R3_CONTRACT_ID,
  evaluateHEarthRun8ER3Control
} from '../../../../h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
  createHEarthFunctionalLandscapeNavigationState,
  createHEarthFunctionalLandscapeCamera
} from '../functional-landscape/navigation.js';
import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import {
  H_EARTH_RUN_8E_GEN957_PACKAGE_SUCCESSOR_CONTRACT_ID,
  H_EARTH_RUN_8E_GEN957_SUCCESSOR_GPU_UPLOAD_VIEW_CONTRACT_ID,
  getHEarthRun8EGen957SuccessorLiveRenderPackage,
  evaluateHEarthRun8EGen957SuccessorLiveRenderPackage,
  createHEarthRun8EGen957SuccessorGPUUploadViews,
  evaluateHEarthRun8EGen957SuccessorGPUUploadViews
} from './live-render-package.run8e-r2.canonical.js';

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const frozenNumbers = (values) => Object.freeze(Array.from(values, (value) => Number(value)));
const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const normalize = (value) => {
  const length = Math.hypot(value.x, value.y, value.z);
  if (!(length > Number.EPSILON)) throw new Error('R3A_VECTOR_NORMALIZATION_FAILED');
  return { x: value.x / length, y: value.y / length, z: value.z / length };
};

export const H_EARTH_RUN_8E_R3A_CONTRACT_ID = 'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_v2';
export const H_EARTH_HC05_EXPECTED_PACKAGE_CONTRACT_ID = H_EARTH_RUN_8E_GEN957_PACKAGE_SUCCESSOR_CONTRACT_ID;

function lookAt(position, target, up) {
  const forward = normalize(subtract(target, position));
  const right = normalize(cross(forward, up));
  const correctedUp = cross(right, forward);
  return frozenNumbers([
    right.x, correctedUp.x, -forward.x, 0,
    right.y, correctedUp.y, -forward.y, 0,
    right.z, correctedUp.z, -forward.z, 0,
    -dot(right, position), -dot(correctedUp, position), dot(forward, position), 1
  ]);
}
function perspective(verticalFovDegrees, aspect, nearPlane, farPlane) {
  const f = 1 / Math.tan(verticalFovDegrees * Math.PI / 360);
  const range = 1 / (nearPlane - farPlane);
  return frozenNumbers([f / aspect,0,0,0, 0,f,0,0, 0,0,(farPlane + nearPlane) * range,-1, 0,0,2 * farPlane * nearPlane * range,0]);
}
function multiply4(left, right) {
  const output = new Array(16).fill(0);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      for (let index = 0; index < 4; index += 1) output[column * 4 + row] += left[index * 4 + row] * right[column * 4 + index];
    }
  }
  return frozenNumbers(output);
}

function acceptedGroundSample(worldX, worldZ) {
  const center = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ);
  if (center?.valid !== true || !finite(center.presentationElevation)) return null;
  const step = 1;
  const elevation = (x, z) => {
    const sample = sampleHEarthMapWideEnvironmentTerrainCandidate(x, z);
    return sample?.valid === true && finite(sample.presentationElevation) ? sample.presentationElevation : center.presentationElevation;
  };
  const dx = (elevation(worldX + step, worldZ) - elevation(worldX - step, worldZ)) / (2 * step);
  const dz = (elevation(worldX, worldZ + step) - elevation(worldX, worldZ - step)) / (2 * step);
  const length = Math.hypot(dx, 1, dz);
  return freeze({
    presentationElevation: center.presentationElevation,
    geometricElevation: center.elevation,
    normal: { x: -dx / length, y: 1 / length, z: -dz / length },
    source: center
  });
}

export function reconcileHEarthRun8ER3APresentationState(navigationState) {
  if (navigationState?.contractId !== H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID) {
    throw new TypeError('R3A_NAVIGATION_STATE_CONTRACT_INVALID');
  }
  const terrain = acceptedGroundSample(navigationState.position.x, navigationState.position.z);
  if (!terrain || !finite(terrain.presentationElevation)) throw new Error('R3A_HC05_ACCEPTED_GROUND_CAMERA_RECONCILIATION_FAILED');
  return freeze({
    ...navigationState,
    position: { ...navigationState.position, y: terrain.presentationElevation + 2.25 },
    terrainElevation: terrain.presentationElevation,
    geometricTerrainElevation: terrain.geometricElevation,
    minimumCameraY: terrain.presentationElevation + 1.6,
    clearance: 2.25,
    run8ESuccessorTerrainNormal: terrain.normal,
    acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    run8ECameraReconciled: true,
    hc05GroundProjection: true,
    presentationProjectionOnly: true,
    canonicalCameraAuthorityCreated: false,
    navigationAuthorityMutated: false
  });
}

export function createHEarthRun8ER3AFrameUniformPacket({
  navigationState,
  viewport = { width: 640, height: 360, pixelRatio: 1 },
  frameSequence = 1
} = {}) {
  const control = evaluateHEarthRun8ER3Control();
  if (control.eligible !== true) throw new Error(`R3A_CONTROL_REJECTED:${control.issues.join(',')}`);
  if (!Number.isSafeInteger(frameSequence) || frameSequence < 1) throw new TypeError('R3A_FRAME_SEQUENCE_INVALID');
  const width = Number(viewport?.width), height = Number(viewport?.height), pixelRatio = Number(viewport?.pixelRatio ?? 1);
  if (![width,height,pixelRatio].every(finite) || width <= 0 || height <= 0 || pixelRatio <= 0) throw new TypeError('R3A_VIEWPORT_INVALID');
  const reconciledState = reconcileHEarthRun8ER3APresentationState(navigationState);
  const camera = createHEarthFunctionalLandscapeCamera(reconciledState);
  if (!camera) throw new Error('R3A_CAMERA_PROJECTION_FAILED');
  const viewMatrix = lookAt(camera.position, camera.target, camera.up);
  const projectionMatrix = perspective(camera.verticalFovDegrees, width / height, camera.nearPlane, camera.farPlane);
  const viewProjectionMatrix = multiply4(projectionMatrix, viewMatrix);
  const packageRecord = getHEarthRun8EGen957SuccessorLiveRenderPackage();
  const packageEvaluation = evaluateHEarthRun8EGen957SuccessorLiveRenderPackage(packageRecord);
  if (packageEvaluation.eligible !== true) throw new Error(`R3A_PACKAGE_REJECTED:${packageEvaluation.issues.join(',')}`);
  const gpuViews = createHEarthRun8EGen957SuccessorGPUUploadViews(packageRecord);
  const gpuEvaluation = evaluateHEarthRun8EGen957SuccessorGPUUploadViews(gpuViews);
  if (gpuEvaluation.eligible !== true) throw new Error(`R3A_GPU_VIEWS_REJECTED:${gpuEvaluation.issues.join(',')}`);
  const environment = packageRecord.environmentDefaults;
  const presentationSunIntensity = clamp(environment.sunIntensity * 1.22, 0.78, 1.35);
  const presentationFogStartDistance = Math.max(120, environment.fogStartDistance);
  const presentationFogFalloff = Math.max(0.00001, environment.fogFalloff * 0.58);
  const presentationMaximumFogFactor = clamp(environment.maximumFogFactor * 0.68, 0, 0.74);
  const presentationDistanceDesaturationStrength = clamp(environment.distanceDesaturationStrength * 0.52, 0, 0.58);
  return freeze({
    contractId: H_EARTH_RUN_8E_R3A_CONTRACT_ID,
    parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
    status: 'RUN_8E_R3A_FRAME_UNIFORM_PACKET_COMPLETE',
    frameSequence,
    navigationStateId: navigationState.stateId,
    navigationSequence: navigationState.sequence,
    terrainClearanceReceiptId: navigationState.terrainClearanceReceiptId,
    cameraAuthority: camera.cameraAuthority,
    canonicalCameraAuthorityCreated: false,
    navigationAuthorityMutated: false,
    successorTerrainCameraReconciled: true,
    hc05AcceptedWorldCameraReconciled: true,
    acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    viewport: { width, height, pixelRatio, aspect: width / height },
    camera: {
      position: { ...camera.position }, target: { ...camera.target }, up: { ...camera.up },
      verticalFovDegrees: camera.verticalFovDegrees, nearPlane: camera.nearPlane, farPlane: camera.farPlane,
      viewMatrix, projectionMatrix, viewProjectionMatrix
    },
    environmentUniforms: {
      sunDirection: { ...environment.sunDirection }, sunIntensity: presentationSunIntensity,
      sunColor: [...environment.sunColor], skyZenithColor: [...environment.skyZenithColor],
      skyHorizonColor: [...environment.skyHorizonColor], groundHazeColor: [...environment.groundHazeColor],
      fogStartDistance: presentationFogStartDistance, fogFalloff: presentationFogFalloff,
      maximumFogFactor: presentationMaximumFogFactor, distanceDesaturationStrength: presentationDistanceDesaturationStrength
    },
    presentationAtmosphereRenewal: {
      sourceEnvironmentMutated: false,
      purpose: 'RECOVER_MIDGROUND_CONTRAST_AND_DEPTH_WITHOUT_REMOVING_ATMOSPHERIC_PERSPECTIVE',
      sunIntensityScale: 1.22,
      fogFalloffScale: 0.58,
      maximumFogFactorScale: 0.68,
      desaturationScale: 0.52
    },
    packageContractId: packageRecord.contractId,
    packageIdentity: packageRecord.packageIdentity,
    packageContentDigest: packageRecord.contentDigest,
    packageTopologyReceipt: { ...packageRecord.topologyReceipt },
    gpuTransportContractId: H_EARTH_RUN_8E_GEN957_SUCCESSOR_GPU_UPLOAD_VIEW_CONTRACT_ID,
    gpuBufferElementCounts: {
      positions: gpuViews.positions.length, normals: gpuViews.normals.length, baseColorsLinear: gpuViews.baseColorsLinear.length,
      materialParameters: gpuViews.materialParameters.length, materialModelCodes: gpuViews.materialModelCodes.length,
      surfaceClassCodes: gpuViews.surfaceClassCodes.length, primitiveIndices: gpuViews.primitiveIndices.length,
      roleCodes: gpuViews.roleCodes.length, indices: gpuViews.indices.length
    },
    drawRanges: packageRecord.drawRanges.map((range) => ({ ...range, primitiveIds: [...range.primitiveIds] })),
    worldBuiltBecauseCameraMoved: false,
    webglContextCreated: false,
    shaderOrProgramCreated: false,
    renderLoopCreated: false,
    publicRouteBound: false,
    visiblePresentationCreated: false,
    issues: []
  });
}

export function getHEarthRun8ER3ALiveRendererInterface() {
  const packageRecord = getHEarthRun8EGen957SuccessorLiveRenderPackage();
  return freeze({
    contractId: H_EARTH_RUN_8E_R3A_CONTRACT_ID,
    packageContractId: packageRecord.contractId,
    packageIdentity: packageRecord.packageIdentity,
    packageContentDigest: packageRecord.contentDigest,
    gpuTransportContractId: H_EARTH_RUN_8E_GEN957_SUCCESSOR_GPU_UPLOAD_VIEW_CONTRACT_ID,
    attributeLayout: [
      { location: 0, name: 'aPosition', components: 3, buffer: 'positions' },
      { location: 1, name: 'aNormal', components: 3, buffer: 'normals' },
      { location: 2, name: 'aBaseColorLinear', components: 4, buffer: 'baseColorsLinear' },
      { location: 3, name: 'aMaterialParameters', components: 4, buffer: 'materialParameters' },
      { location: 4, name: 'aMaterialModelCode', components: 1, buffer: 'materialModelCodes', integer: true },
      { location: 5, name: 'aSurfaceClassCode', components: 1, buffer: 'surfaceClassCodes', integer: true },
      { location: 6, name: 'aPrimitiveIndex', components: 1, buffer: 'primitiveIndices', integer: true },
      { location: 7, name: 'aRoleCode', components: 1, buffer: 'roleCodes', integer: true }
    ],
    indexBuffer: { name: 'indices', type: 'UNSIGNED_INT' },
    frameUniformNames: ['uViewProjection','uCameraPosition','uSunDirection','uSunIntensity','uSunColor','uSkyZenithColor','uSkyHorizonColor','uGroundHazeColor','uFogStartDistance','uFogFalloff','uMaximumFogFactor','uDistanceDesaturationStrength'],
    drawRanges: packageRecord.drawRanges.map((range) => ({ ...range, primitiveIds: [...range.primitiveIds] })),
    packageUploadedOnceRequired: true,
    cameraUniformsUpdatedPerFrameRequired: true,
    worldRebuildPerCameraMoveProhibited: true,
    webglContextCreated: false,
    shaderOrProgramCreated: false,
    renderLoopCreated: false,
    publicRouteBound: false,
    visiblePresentationCreated: false
  });
}

export function evaluateHEarthRun8ER3AFrameUniformPacket(packet) {
  const issues = [];
  if (packet?.contractId !== H_EARTH_RUN_8E_R3A_CONTRACT_ID) issues.push('R3A_PACKET_CONTRACT_MISMATCH');
  const expectedPackage = getHEarthRun8EGen957SuccessorLiveRenderPackage();
  if (packet?.packageContractId !== H_EARTH_HC05_EXPECTED_PACKAGE_CONTRACT_ID) {
    issues.push(`R3A_PACKAGE_CONTRACT_MISMATCH:EXPECTED=${H_EARTH_HC05_EXPECTED_PACKAGE_CONTRACT_ID}:ACTUAL=${packet?.packageContractId ?? 'NULL'}`);
  }
  if (packet?.packageIdentity !== expectedPackage.packageIdentity ||
      packet?.packageContentDigest !== expectedPackage.contentDigest) {
    issues.push(`R3A_PACKAGE_IDENTITY_MISMATCH:EXPECTED=${expectedPackage.packageIdentity}:ACTUAL=${packet?.packageIdentity ?? 'NULL'}`);
  }
  if (packet?.packageTopologyReceipt?.historicalR2TriangleCountRequirementApplied !== false ||
      packet?.packageTopologyReceipt?.historicalR2IndexCountRequirementApplied !== false) {
    issues.push('R3A_SUCCESSOR_TOPOLOGY_RECEIPT_INVALID');
  }
  for (const name of ['viewMatrix','projectionMatrix','viewProjectionMatrix']) {
    const matrix = packet?.camera?.[name];
    if (!Array.isArray(matrix) || matrix.length !== 16 || matrix.some((value) => !finite(value))) issues.push(`R3A_MATRIX_INVALID:${name}`);
  }
  if (packet?.successorTerrainCameraReconciled !== true || packet?.hc05AcceptedWorldCameraReconciled !== true) issues.push('R3A_CAMERA_NOT_RECONCILED');
  if (packet?.worldBuiltBecauseCameraMoved !== false) issues.push('R3A_WORLD_REBUILD_BOUNDARY_FAILED');
  for (const boundary of ['webglContextCreated','shaderOrProgramCreated','renderLoopCreated','publicRouteBound','visiblePresentationCreated']) {
    if (packet?.[boundary] !== false) issues.push(`R3A_BOUNDARY_FAILED:${boundary}`);
  }
  return freeze({ eligible: issues.length === 0, status: issues.length === 0 ? 'RUN_8E_R3A_FRAME_UNIFORM_PACKET_PASS' : 'RUN_8E_R3A_FRAME_UNIFORM_PACKET_FAIL', issues });
}

export function buildHEarthRun8ER3AWaypointPacket(waypointId, viewport, frameSequence = 1) {
  const navigation = createHEarthFunctionalLandscapeNavigationState({ waypointId });
  if (navigation?.ok !== true) throw new Error(`R3A_NAVIGATION_INITIALIZATION_FAILED:${waypointId}`);
  return createHEarthRun8ER3AFrameUniformPacket({ navigationState: navigation.state, viewport, frameSequence });
}

export default getHEarthRun8ER3ALiveRendererInterface;
