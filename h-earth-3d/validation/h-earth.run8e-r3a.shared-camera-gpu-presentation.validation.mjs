import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  H_EARTH_RUN_8E_R3_CONTROL,
  evaluateHEarthRun8ER3Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import {
  H_EARTH_RUN_8E_R3A_CONTROL,
  evaluateHEarthRun8ER3AControl
} from '../control-plane/run-8/recovery/h-earth.run8e-r3a.shared-camera-gpu-presentation.js';
import {
  H_EARTH_RUN_8E_R3A_CONTRACT_ID,
  getHEarthRun8ER3ALiveRendererInterface,
  buildHEarthRun8ER3AWaypointPacket,
  evaluateHEarthRun8ER3AFrameUniformPacket
} from '../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import {
  H_EARTH_RUN_8E_R3A_PATHS
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3a-shared-camera-gpu-presentation-scope.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const BASE_HEAD = '02aa90591a34968c8b6bacba926a156293ad0f76';
const PACKAGE_PATH = 'showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
const GPU_PATH = 'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
const NAVIGATION_PATH = 'showroom/globe/h-earth/functional-landscape/navigation.js';
const R3A_MODULE_PATH = 'showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
const PASS_RECEIPT_PATH = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3a.pass-closed.receipt.json';
const outputDirectory = process.env.H_EARTH_RUN8E_R3A_OUTPUT || '/tmp/h-earth-run8e-r3a';
fs.mkdirSync(outputDirectory, { recursive: true });

const issues = [];
const assert = (condition, issue) => { if (!condition) issues.push(issue); };
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const read = (repositoryPath) => fs.readFileSync(repositoryPath, 'utf8');

const parentEvaluation = evaluateHEarthRun8ER3Control(H_EARTH_RUN_8E_R3_CONTROL);
const childEvaluation = evaluateHEarthRun8ER3AControl(H_EARTH_RUN_8E_R3A_CONTROL);
assert(parentEvaluation.eligible === true, `R3_PARENT_CONTROL_FAIL:${parentEvaluation.issues.join('|')}`);
assert(childEvaluation.eligible === true, `R3A_CONTROL_FAIL:${childEvaluation.issues.join('|')}`);

assert(git('hash-object', PACKAGE_PATH) === '1699654f39c9e183f4cfc6f75b20ba051641b763', 'R3A_PACKAGE_BLOB_CHANGED');
assert(git('hash-object', GPU_PATH) === '785856d7702a0e855c2672e6b8a7325ad5b3ba50', 'R3A_GPU_ADAPTER_BLOB_CHANGED');
assert(git('hash-object', NAVIGATION_PATH) === '8ab3446c536fc24423d5601acce232b19fa71c91', 'R3A_NAVIGATION_BLOB_CHANGED');

const source = read(R3A_MODULE_PATH);
for (const [pattern, issue] of [
  [/\bdocument\s*\./, 'R3A_DOCUMENT_ACCESS_CREATED'],
  [/\bwindow\s*\./, 'R3A_WINDOW_BINDING_CREATED'],
  [/\.getContext\s*\(/, 'R3A_WEBGL_OR_CANVAS_CONTEXT_CREATED'],
  [/requestAnimationFrame\s*\(/, 'R3A_RENDER_LOOP_CREATED'],
  [/addEventListener\s*\(/, 'R3A_INTERACTION_BINDING_CREATED'],
  [/createShader\s*\(/, 'R3A_SHADER_CREATED'],
  [/createProgram\s*\(/, 'R3A_PROGRAM_CREATED'],
  [/drawElements\s*\(/, 'R3A_DRAW_CALL_CREATED'],
  [/drawArrays\s*\(/, 'R3A_DRAW_CALL_CREATED']
]) {
  assert(!pattern.test(source), issue);
}

const rendererInterface = getHEarthRun8ER3ALiveRendererInterface();
assert(rendererInterface.contractId === H_EARTH_RUN_8E_R3A_CONTRACT_ID, 'R3A_INTERFACE_CONTRACT_INVALID');
assert(rendererInterface.packageIdentity === 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25', 'R3A_INTERFACE_PACKAGE_INVALID');
assert(rendererInterface.attributeLayout.length === 8, 'R3A_ATTRIBUTE_LAYOUT_INVALID');
assert(rendererInterface.drawRanges.length === 4, 'R3A_DRAW_RANGE_COUNT_INVALID');
assert(rendererInterface.packageUploadedOnceRequired === true, 'R3A_UPLOAD_ONCE_LAW_MISSING');
assert(rendererInterface.cameraUniformsUpdatedPerFrameRequired === true, 'R3A_CAMERA_PER_FRAME_LAW_MISSING');
assert(rendererInterface.worldRebuildPerCameraMoveProhibited === true, 'R3A_WORLD_REBUILD_PROHIBITION_MISSING');
for (const key of ['webglContextCreated', 'shaderOrProgramCreated', 'renderLoopCreated', 'publicRouteBound', 'visiblePresentationCreated']) {
  assert(rendererInterface[key] === false, `R3A_INTERFACE_BOUNDARY_FAILED:${key}`);
}

const waypoints = ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE'];
const viewports = [
  { width: 360, height: 640, pixelRatio: 1 },
  { width: 640, height: 360, pixelRatio: 1 }
];
const packets = [];
let frameSequence = 1;
for (const viewport of viewports) {
  for (const waypointId of waypoints) {
    const packet = buildHEarthRun8ER3AWaypointPacket(waypointId, viewport, frameSequence++);
    const evaluation = evaluateHEarthRun8ER3AFrameUniformPacket(packet);
    assert(evaluation.eligible === true, `R3A_PACKET_FAIL:${waypointId}:${evaluation.issues.join('|')}`);
    assert(Object.isFrozen(packet), `R3A_PACKET_NOT_FROZEN:${waypointId}`);
    assert(packet.drawRanges.length === 4, `R3A_PACKET_DRAW_RANGES_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.positions === 76572, `R3A_POSITION_COUNT_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.normals === 76572, `R3A_NORMAL_COUNT_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.baseColorsLinear === 102096, `R3A_COLOR_COUNT_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.materialParameters === 102096, `R3A_MATERIAL_COUNT_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.materialModelCodes === 25524, `R3A_MATERIAL_CODE_COUNT_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.surfaceClassCodes === 25524, `R3A_SURFACE_CODE_COUNT_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.primitiveIndices === 25524, `R3A_PRIMITIVE_INDEX_COUNT_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.roleCodes === 25524, `R3A_ROLE_CODE_COUNT_INVALID:${waypointId}`);
    assert(packet.gpuBufferElementCounts.indices === 147120, `R3A_INDEX_COUNT_INVALID:${waypointId}`);
    packets.push({ waypointId, viewport, packet });
  }
}

const repeatLeft = buildHEarthRun8ER3AWaypointPacket('COAST', viewports[0], 100);
const repeatRight = buildHEarthRun8ER3AWaypointPacket('COAST', viewports[0], 100);
assert(JSON.stringify(repeatLeft) === JSON.stringify(repeatRight), 'R3A_SAME_CAMERA_PACKET_NONDETERMINISTIC');
const coastMatrix = packets.find((entry) => entry.waypointId === 'COAST' && entry.viewport.width === 640).packet.camera.viewProjectionMatrix;
const hillMatrix = packets.find((entry) => entry.waypointId === 'HILL' && entry.viewport.width === 640).packet.camera.viewProjectionMatrix;
assert(JSON.stringify(coastMatrix) !== JSON.stringify(hillMatrix), 'R3A_DIFFERENT_CAMERA_MATRIX_NOT_CHANGED');

const loader = loadHEarthRepositoryRegistryValidatorDependencies();
assert(loader.identityVerified === true, 'R3A_REGISTRY_LOADER_IDENTITY_FAILED');
assert(loader.boundary.readOnly === true, 'R3A_REGISTRY_LOADER_NOT_READ_ONLY');
assert(loader.boundary.mutationAuthorityCreated === false, 'R3A_REGISTRY_MUTATION_AUTHORITY_CREATED');
for (const repositoryPath of H_EARTH_RUN_8E_R3A_PATHS) {
  const resolution = loader.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolution?.resolved === true, `R3A_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`);
}

const changedPaths = git('diff', '--name-only', `${BASE_HEAD}...HEAD`).split('\n').filter(Boolean).sort();
const expectedCore = H_EARTH_RUN_8E_R3A_PATHS
  .map((entry) => entry.replace(/^\//, ''))
  .filter((entry) => entry !== PASS_RECEIPT_PATH)
  .sort();
const receiptPresent = fs.existsSync(PASS_RECEIPT_PATH);
const expectedFinal = [...expectedCore, PASS_RECEIPT_PATH].sort();
const expected = receiptPresent ? expectedFinal : expectedCore;
assert(JSON.stringify(changedPaths) === JSON.stringify(expected), `R3A_SCOPE_MISMATCH:${JSON.stringify(changedPaths)}`);

if (receiptPresent) {
  const receipt = JSON.parse(read(PASS_RECEIPT_PATH));
  assert(receipt.eligible === true, 'R3A_PASS_RECEIPT_NOT_ELIGIBLE');
  assert(receipt.status === 'RUN_8E_R3A_PASS_CLOSED', 'R3A_PASS_RECEIPT_STATUS_INVALID');
  assert(receipt.stoppingBoundary === 'STOP_BEFORE_ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION_R3B', 'R3A_RECEIPT_STOPPING_BOUNDARY_INVALID');
}

const packetManifest = packets.map(({ waypointId, viewport, packet }) => ({
  waypointId,
  viewport,
  navigationStateId: packet.navigationStateId,
  viewProjectionMatrix: packet.camera.viewProjectionMatrix,
  packageIdentity: packet.packageIdentity,
  packageContentDigest: packet.packageContentDigest
}));
const packetManifestDigest = `sha256:${sha256(JSON.stringify(packetManifest))}`;
const status = receiptPresent ? 'RUN_8E_R3A_FINAL_EXACT_HEAD_PASS' : 'RUN_8E_R3A_CORE_EXECUTION_PASS';
const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_EXECUTION_RECEIPT',
  eligible: issues.length === 0,
  status: issues.length === 0 ? status : 'RUN_8E_R3A_EXECUTION_FAIL',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3a-live-renderer-contract-001',
  baseExactHead: BASE_HEAD,
  parentControlStatus: parentEvaluation.status,
  childControlStatus: childEvaluation.status,
  packetCount: packets.length,
  waypointCount: waypoints.length,
  viewportCount: viewports.length,
  packetManifestDigest,
  packageIdentity: rendererInterface.packageIdentity,
  packageContentDigest: rendererInterface.packageContentDigest,
  protectedSourceBlobs: {
    liveRenderPackage: git('hash-object', PACKAGE_PATH),
    gpuTransportAdapter: git('hash-object', GPU_PATH),
    navigation: git('hash-object', NAVIGATION_PATH)
  },
  rendererInterface: {
    attributeCount: rendererInterface.attributeLayout.length,
    drawRangeCount: rendererInterface.drawRanges.length,
    uniformCount: rendererInterface.frameUniformNames.length,
    packageUploadedOnceRequired: rendererInterface.packageUploadedOnceRequired,
    cameraUniformsUpdatedPerFrameRequired: rendererInterface.cameraUniformsUpdatedPerFrameRequired
  },
  boundaries: {
    webglContextCreated: false,
    shaderOrProgramCreated: false,
    renderLoopCreated: false,
    interactionBindingCreated: false,
    publicRouteBound: false,
    visiblePresentationCreated: false,
    r3BStarted: false,
    run8EPassClosed: false
  },
  registry: {
    loaderIdentityVerified: loader.identityVerified,
    registeredPathCount: H_EARTH_RUN_8E_R3A_PATHS.length,
    allPathsResolve: H_EARTH_RUN_8E_R3A_PATHS.every((repositoryPath) =>
      loader.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath)?.resolved === true)
  },
  changedPaths,
  receiptPresent,
  stoppingBoundary: 'STOP_BEFORE_ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION_R3B',
  issues
};
fs.writeFileSync(
  path.join(outputDirectory, 'h-earth.run8e-r3a.shared-camera-gpu-presentation.execution.receipt.json'),
  `${JSON.stringify(receipt, null, 2)}\n`
);
fs.writeFileSync(
  path.join(outputDirectory, 'h-earth.run8e-r3a.packet-manifest.json'),
  `${JSON.stringify(packetManifest, null, 2)}\n`
);
console.log(JSON.stringify(receipt, null, 2));
if (issues.length > 0) process.exitCode = 1;
