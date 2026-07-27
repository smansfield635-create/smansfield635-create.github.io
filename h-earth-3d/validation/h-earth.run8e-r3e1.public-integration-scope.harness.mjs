import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  H_EARTH_RUN_8E_R3_CONTROL,
  evaluateHEarthRun8ER3Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import {
  H_EARTH_RUN_8E_R3E1_CONTROL,
  evaluateHEarthRun8ER3E1Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r3e1.public-integration-scope-control.js';
import {
  H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION,
  evaluateHEarthRun8ER3E1ScopeDeclaration
} from '../control-plane/run-8/recovery/h-earth.run8e-r3e1.public-integration-scope-declaration.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3E1_OUTPUT ?? '/tmp/h-earth-run8e-r3e1';
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const read = (repositoryPath) => fs.readFileSync(path.resolve(repositoryPath), 'utf8');
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);

const parentEvaluation = evaluateHEarthRun8ER3Control();
const childEvaluation = evaluateHEarthRun8ER3E1Control();
const declarationEvaluation = evaluateHEarthRun8ER3E1ScopeDeclaration();
assert(parentEvaluation.eligible === true, `R3E1_PARENT_CONTROL_REJECTED:${parentEvaluation.issues.join(',')}`);
assert(childEvaluation.eligible === true, `R3E1_CHILD_CONTROL_REJECTED:${childEvaluation.issues.join(',')}`);
assert(declarationEvaluation.eligible === true, `R3E1_SCOPE_DECLARATION_REJECTED:${declarationEvaluation.issues.join(',')}`);

const htmlPath = 'showroom/globe/h-earth/index.html';
const cssPath = 'showroom/globe/h-earth/index.css';
const cpuControllerPath = 'showroom/globe/h-earth/functional-landscape/index.js';
const cpuIntegrationPath = 'showroom/globe/h-earth/functional-landscape/environment-integration.js';
const directManipulationPath = 'showroom/globe/h-earth/functional-landscape/direct-manipulation.js';
const diagnosticHostPath = 'showroom/globe/h-earth/diagnostic/run8e-r3d/diagnostic-host.js';
const liveGpuBindingPath = 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js';

const html = read(htmlPath);
const css = read(cssPath);
const cpuController = read(cpuControllerPath);
const cpuIntegration = read(cpuIntegrationPath);
const directManipulation = read(directManipulationPath);
const diagnosticHost = read(diagnosticHostPath);
const liveGpuBinding = read(liveGpuBindingPath);

const expectedScripts = [
  './functional-landscape/index.js?v=run8e-direct-inspection-restoration-001',
  './functional-landscape/environment-integration.js?v=run8e-direct-inspection-restoration-001',
  './functional-landscape/direct-manipulation.js?v=run8e-direct-inspection-restoration-001'
];
const positions = expectedScripts.map((script) => html.indexOf(script));
assert(positions.every((position) => position >= 0), 'R3E1_CURRENT_SCRIPT_LOAD_GRAPH_INCOMPLETE');
assert(positions[0] < positions[1] && positions[1] < positions[2], 'R3E1_CURRENT_SCRIPT_LOAD_ORDER_INVALID');
assert((html.match(/<script\s+type="module"/g) ?? []).length === 3, 'R3E1_CURRENT_MODULE_SCRIPT_COUNT_INVALID');

const sourceAudit = {
  publicRouteHasExistingCanvas: html.includes('id="h-earth-functional-landscape-canvas"'),
  publicRouteHasExistingMount: html.includes('id="h-earth-functional-landscape-mount"'),
  publicRouteHasExistingStatus: html.includes('id="route-status"'),
  publicRouteLoadsCpuController: html.includes(expectedScripts[0]),
  publicRouteLoadsCpuEnvironmentIntegration: html.includes(expectedScripts[1]),
  publicRouteLoadsDirectManipulation: html.includes(expectedScripts[2]),
  cpuControllerCreates2dContext: /getContext\(['"]2d['"]/.test(cpuController),
  cpuControllerUsesPutImageData: cpuController.includes('context.putImageData'),
  cpuControllerInstallsPointerListeners: cpuController.includes("mount.addEventListener('pointerdown'") && cpuController.includes("mount.addEventListener('pointerup'"),
  cpuControllerQueuesRerenderMicrotask: cpuController.includes('queueMicrotask(() => renderCurrentState())'),
  cpuEnvironmentCreates2dContext: /getContext\(['"]2d['"]/.test(cpuIntegration),
  cpuEnvironmentUsesPutImageData: cpuIntegration.includes('context.putImageData'),
  cpuEnvironmentBuildsSuccessorFramePerRender: cpuIntegration.includes('constructHEarthRun8ESuccessorEnvironmentFrame'),
  cpuEnvironmentRasterizesPerRender: cpuIntegration.includes('rasterizeHEarthRun8ERenderPlan'),
  cpuEnvironmentOwnsScheduledRenderLoop: cpuIntegration.includes('scheduledRenderTimer') && cpuIntegration.includes('renderLoopPromise'),
  directManipulationInstallsCapturePointerListeners: directManipulation.includes("mount.addEventListener('pointerdown'") && directManipulation.includes('capture: true'),
  directManipulationAppliesCssBitmapTransform: directManipulation.includes('canvas.style.transform') && directManipulation.includes('translate3d('),
  directManipulationOwnsNavigationPromiseChain: directManipulation.includes('navigationChain = Promise.resolve()'),
  directManipulationOwnsSettledRefreshTimer: directManipulation.includes('scheduleCommit') && directManipulation.includes('api.refresh()'),
  diagnosticHostComposesAcceptedIntakeAndBinding: diagnosticHost.includes('installHEarthRun8ER3D2PointerTouchIntake') && diagnosticHost.includes('createHEarthRun8ER3D3LiveGpuBinding'),
  liveGpuBindingUsesAcceptedR3AAndR3C: liveGpuBinding.includes('createHEarthRun8ER3AFrameUniformPacket') && liveGpuBinding.includes('createHEarthRun8ER3CPersistentRenderer'),
  liveGpuBindingSynchronousProposalToFrame: liveGpuBinding.includes('synchronousProposalToVisibleFrame: true'),
  publicShellCssRetained: css.length > 0
};
for (const [key, value] of Object.entries(sourceAudit)) assert(value === true, `R3E1_SOURCE_AUDIT_FAILED:${key}`);

const declaration = H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION;
assert(declaration.exactFutureMutationScope.length === 2, 'R3E1_FUTURE_MUTATION_SCOPE_NOT_TWO_PATHS');
assert(declaration.protectedFutureWitnesses.length === 11, 'R3E1_PROTECTED_WITNESS_COUNT_INVALID');
assert(declaration.collisionFindings.length === 8, 'R3E1_COLLISION_FINDING_COUNT_INVALID');
assert(declaration.rollbackGroups.length === 2, 'R3E1_ROLLBACK_GROUP_COUNT_INVALID');
assert(declaration.currentPublicLoadOrder.length === 3, 'R3E1_CURRENT_LOAD_ORDER_COUNT_INVALID');
assert(declaration.intendedPublicLoadOrder.length === 7, 'R3E1_INTENDED_LOAD_ORDER_COUNT_INVALID');
assert(declaration.exactFutureMutationScope[0].path === '/showroom/globe/h-earth/index.html', 'R3E1_PUBLIC_ROUTE_SCOPE_PATH_INVALID');
assert(declaration.exactFutureMutationScope[1].path === '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js', 'R3E1_ORCHESTRATOR_SCOPE_PATH_INVALID');
assert(Object.values(declaration.boundaries).every((value) => value === false), 'R3E1_DECLARATION_BOUNDARY_VIOLATION');
assert(Object.values(H_EARTH_RUN_8E_R3E1_CONTROL.boundaries).every((value) => value === false), 'R3E1_CONTROL_BOUNDARY_VIOLATION');
assert(H_EARTH_RUN_8E_R3_CONTROL.currentState.run8ER3E2 === 'NOT_STARTED', 'R3E2_STARTED_EARLY');

const loader = loadHEarthRepositoryRegistryValidatorDependencies();
assert(loader.identityVerified === true, 'R3E1_REGISTRY_LOADER_IDENTITY_FAILED');
const registryNode = loader.registryFacade.getHEarthRepositoryRegistryNode('H_EARTH_RUN_8E_R3E1_PUBLIC_INTEGRATION_SCOPE');
assert(registryNode?.lifecycleStatus === 'EXECUTION_PENDING' || registryNode?.lifecycleStatus === 'PASS_CLOSED_FINAL_EXACT_HEAD_VALIDATION_PENDING', 'R3E1_REGISTRY_NODE_STATUS_INVALID');
for (const registryPath of loader.registryFacade.H_EARTH_RUN_8E_R3E1_PATHS ?? []) {
  assert(loader.registryFacade.resolveHEarthRepositoryRegistryPath(registryPath)?.resolved === true, `R3E1_REGISTRY_PATH_UNRESOLVED:${registryPath}`);
}

const executionReceipt = {
  receiptType: 'H_EARTH_RUN_8E_R3E1_PUBLIC_INTEGRATION_SCOPE_EXECUTION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R3E1_SCOPE_EXECUTION_PASS',
  baseExactHead: declaration.baseExactHead,
  parentEvaluation,
  childEvaluation,
  declarationEvaluation,
  sourceAudit,
  sourceDigests: {
    publicRouteSha256: sha256(html),
    publicShellCssSha256: sha256(css),
    cpuControllerSha256: sha256(cpuController),
    cpuEnvironmentIntegrationSha256: sha256(cpuIntegration),
    directManipulationSha256: sha256(directManipulation),
    diagnosticHostSha256: sha256(diagnosticHost),
    liveGpuBindingSha256: sha256(liveGpuBinding)
  },
  currentRuntimeOwnerCounts: {
    moduleScriptCount: 3,
    canvasContextOwnerCount: 2,
    pointerOwnerCount: 2,
    framePresentationOwnerCount: 3,
    deferredExecutionOwnerCount: 4
  },
  declarationResult: {
    exactFutureMutationPathCount: declaration.exactFutureMutationScope.length,
    protectedFutureWitnessCount: declaration.protectedFutureWitnesses.length,
    collisionFindingCount: declaration.collisionFindings.length,
    rollbackGroupCount: declaration.rollbackGroups.length,
    intendedActivePresentationAuthorityCount: declaration.intendedExclusiveRuntime.activeFramePresentationAuthorityCount,
    intendedLegacyRuntimeOwnerCount: 0
  },
  boundaries: {
    publicSourceMutationPerformed: false,
    publicRouteBound: false,
    browserExecuted: false,
    gpuExecuted: false,
    r3E2WorkStarted: false,
    deploymentPerformed: false,
    physicalDeviceAcceptancePerformed: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3E2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2',
  issues: []
};
writeJson('h-earth.run8e-r3e1.public-integration-scope.execution.receipt.json', executionReceipt);
console.log(JSON.stringify(executionReceipt, null, 2));
