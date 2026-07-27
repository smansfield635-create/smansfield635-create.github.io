import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3E1Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3e1.public-integration-scope-control.js';
import { evaluateHEarthRun8ER3E1ScopeDeclaration } from '../control-plane/run-8/recovery/h-earth.run8e-r3e1.public-integration-scope-declaration.js';
import { H_EARTH_RUN_8E_R3E2_CONTROL, evaluateHEarthRun8ER3E2Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3e2.public-live-gpu-composition.js';
import registryFacade, { H_EARTH_RUN_8E_R3E2_NODE } from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3e2-public-live-gpu-composition.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3E2_OUTPUT ?? '/tmp/h-earth-run8e-r3e2';
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
const read = (repositoryPath) => fs.readFileSync(repositoryPath, 'utf8');
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);

const baseExactHead = '4d1692cb3f1555833bef7864a3f6ebc998b86a17';
const publicHtmlPath = 'showroom/globe/h-earth/index.html';
const publicModulePath = 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js';
const parent = evaluateHEarthRun8ER3Control();
const r3E1 = evaluateHEarthRun8ER3E1Control();
const declaration = evaluateHEarthRun8ER3E1ScopeDeclaration();
const child = evaluateHEarthRun8ER3E2Control();
assert(parent.eligible === true, `R3E2_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(r3E1.eligible === true, `R3E1_CONTROL_REJECTED:${r3E1.issues.join(',')}`);
assert(declaration.eligible === true, `R3E1_DECLARATION_REJECTED:${declaration.issues.join(',')}`);
assert(child.eligible === true, `R3E2_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

const baseHtml = execFileSync('git', ['show', `${baseExactHead}:${publicHtmlPath}`], { encoding: 'utf8' });
const currentHtml = read(publicHtmlPath);
const moduleSource = read(publicModulePath);
const oldScriptBlock = `  <script type="module" src="./functional-landscape/index.js?v=run8e-direct-inspection-restoration-001"></script>\n  <script type="module" src="./functional-landscape/environment-integration.js?v=run8e-direct-inspection-restoration-001"></script>\n\n  <script type="module" src="./functional-landscape/direct-manipulation.js?v=run8e-direct-inspection-restoration-001"></script>`;
const newScriptBlock = `  <script type="module" src="./functional-landscape/public-live-gpu-integration.run8e-r3e.js?v=run8e-r3e2-public-live-gpu-composition-001"></script>`;
assert(baseHtml.includes(oldScriptBlock), 'R3E2_BASE_LEGACY_SCRIPT_BLOCK_NOT_FOUND');
assert(currentHtml === baseHtml.replace(oldScriptBlock, newScriptBlock), 'R3E2_PUBLIC_HTML_DELTA_EXCEEDS_DECLARED_LOAD_ORDER_CHANGE');

const moduleScriptSources = [...currentHtml.matchAll(/<script\s+type="module"\s+src="([^"]+)"/g)].map((match) => match[1]);
assert(moduleScriptSources.length === 1, `R3E2_PUBLIC_MODULE_SCRIPT_COUNT_INVALID:${moduleScriptSources.length}`);
assert(moduleScriptSources[0].startsWith('./functional-landscape/public-live-gpu-integration.run8e-r3e.js?'), 'R3E2_PUBLIC_ORCHESTRATOR_NOT_SOLE_MODULE');
for (const legacy of ['functional-landscape/index.js','functional-landscape/environment-integration.js','functional-landscape/direct-manipulation.js']) {
  assert(!currentHtml.includes(`<script type="module" src="./${legacy}`), `R3E2_LEGACY_SCRIPT_STILL_ACTIVE:${legacy}`);
}
for (const identity of ['h-earth-functional-landscape-route','h-earth-functional-landscape-mount','h-earth-functional-landscape-canvas','route-status','hud-waypoint','hud-address','hud-position','hud-frame']) {
  assert(baseHtml.includes(identity) && currentHtml.includes(identity), `R3E2_PUBLIC_HOST_IDENTITY_NOT_PRESERVED:${identity}`);
}
for (const cssReference of ['./functional-landscape/index.css?v=gesture-shell-001','./index.css?v=034r']) {
  assert(currentHtml.includes(cssReference), `R3E2_PUBLIC_CSS_REFERENCE_NOT_PRESERVED:${cssReference}`);
}

const requiredImports = [
  "from '../diagnostic/run8e-r3d/pointer-touch-intake.js'",
  "from '../diagnostic/run8e-r3d/live-gpu-binding.js'"
];
for (const requiredImport of requiredImports) assert(moduleSource.includes(requiredImport), `R3E2_REQUIRED_IMPORT_MISSING:${requiredImport}`);
assert((moduleSource.match(/installHEarthRun8ER3D2PointerTouchIntake\s*\(/g) ?? []).length === 1, 'R3E2_POINTER_INTAKE_INSTALL_COUNT_INVALID');
assert((moduleSource.match(/createHEarthRun8ER3D3LiveGpuBinding\s*\(/g) ?? []).length === 1, 'R3E2_LIVE_GPU_BINDING_CREATE_COUNT_INVALID');
assert(moduleSource.includes('binding.acceptNavigationState(proposalRecord, navigationState)'), 'R3E2_PROPOSAL_TO_GPU_BINDING_MISSING');
assert(moduleSource.includes('window.H_EARTH_RUN8E_PUBLIC_ROUTE'), 'R3E2_PUBLIC_API_NOT_EXPOSED');
assert(moduleSource.includes('runtimeExclusivity'), 'R3E2_RUNTIME_EXCLUSIVITY_RECEIPT_MISSING');
assert(moduleSource.includes("nextCheckpoint: 'RUN_8E_R3E3_NOT_STARTED'"), 'R3E2_R3E3_NEXT_STATE_MISSING');
assert(moduleSource.includes("stoppingBoundary: 'STOP_BEFORE_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_R3E3'"), 'R3E2_STOPPING_BOUNDARY_MISSING');

const prohibitedSourcePatterns = [
  ['CANVAS_2D_CONTEXT', /getContext\s*\(\s*['"]2d['"]/],
  ['CPU_PUT_IMAGE_DATA', /putImageData\s*\(/],
  ['CPU_RASTERIZER', /rasterizeHEarth/],
  ['CSS_TRANSLATE3D', /translate3d\s*\(/],
  ['CSS_SCALE_PREVIEW', /style\.transform\s*=/],
  ['DEFERRED_SETTLE_TIMER', /setTimeout\s*\(/],
  ['PROMISE_NAVIGATION_CHAIN', /navigationChain/],
  ['SECOND_RENDER_LOOP', /requestAnimationFrame\s*\(/]
];
for (const [label, pattern] of prohibitedSourcePatterns) assert(!pattern.test(moduleSource), `R3E2_PROHIBITED_ORCHESTRATOR_PATTERN:${label}`);

const resolvedNode = registryFacade.getHEarthRepositoryRegistryNode(H_EARTH_RUN_8E_R3E2_NODE.nodeId);
assert(resolvedNode?.nodeId === H_EARTH_RUN_8E_R3E2_NODE.nodeId, 'R3E2_REGISTRY_NODE_UNRESOLVED');
for (const repositoryPath of H_EARTH_RUN_8E_R3E2_CONTROL.exactPublicMutationPaths) {
  const resolved = registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolved.resolved === true, `R3E2_REGISTRY_PUBLIC_PATH_UNRESOLVED:${repositoryPath}`);
}

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R3E2_PUBLIC_LIVE_GPU_SOURCE_COMPOSITION_EXECUTION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R3E2_SOURCE_COMPOSITION_PASS',
  baseExactHead,
  controls: { parent, r3E1, declaration, child },
  publicHtml: {
    preMutationGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    baseByteLength: Buffer.byteLength(baseHtml),
    currentByteLength: Buffer.byteLength(currentHtml),
    baseSha256: sha256(baseHtml),
    currentSha256: sha256(currentHtml),
    exactLoadOrderOnlyDelta: true,
    activeModuleScriptCount: moduleScriptSources.length,
    activeModuleScript: moduleScriptSources[0],
    legacyModuleScriptCount: 0,
    existingCanvasMountHudCopyLayoutAndCssPreserved: true
  },
  publicOrchestrator: {
    path: `/${publicModulePath}`,
    byteLength: Buffer.byteLength(moduleSource),
    sha256: sha256(moduleSource),
    pointerTouchIntakeInstallCount: 1,
    liveGpuBindingCreateCount: 1,
    proposalToVisibleGpuBindingPresent: true,
    runtimeExclusivityReceiptPresent: true,
    prohibitedPatternCount: 0
  },
  sourceComposition: {
    exactPublicMutationPathCount: 2,
    protectedWitnessMutationCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0,
    authorityExclusivityAcceptanceCount: 0
  },
  boundaries: {
    branchLocalSourceComposition: true,
    browserExecuted: false,
    gpuExecuted: false,
    authorityExclusivityAccepted: false,
    publicInteractionAccepted: false,
    deploymentPerformed: false,
    physicalDeviceAcceptancePerformed: false,
    r3E3WorkStarted: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3E3_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_R3E3',
  issues: []
};
writeJson('h-earth.run8e-r3e2.public-live-gpu-composition.execution.receipt.json', receipt);
console.log(JSON.stringify({
  status: receipt.status,
  publicHtml: receipt.publicHtml,
  publicOrchestrator: receipt.publicOrchestrator,
  sourceComposition: receipt.sourceComposition,
  stoppingBoundary: receipt.stoppingBoundary
}, null, 2));
