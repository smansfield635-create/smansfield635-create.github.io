import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D1Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3d1.diagnostic-host-scaffold.js';
import registryFacade, { H_EARTH_RUN_8E_R3D1_PATHS } from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3d1-diagnostic-host-scaffold-scope.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outputDirectory = process.env.H_EARTH_RUN8E_R3D1_OUTPUT ?? '/tmp/h-earth-run8e-r3d1';
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const read = (repositoryPath) => fs.readFileSync(path.join(repositoryRoot, repositoryPath.replace(/^\//, '')), 'utf8');

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3D1Control();
assert(parent.eligible === true, `R3D1_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3D1_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

const diagnosticPaths = [
  'showroom/globe/h-earth/diagnostic/run8e-r3d/index.html',
  'showroom/globe/h-earth/diagnostic/run8e-r3d/diagnostic-host.js',
  'showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.placeholder.js',
  'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.placeholder.js'
];
const pathReceipts = diagnosticPaths.map((repositoryPath) => {
  const absolutePath = path.join(repositoryRoot, repositoryPath);
  const stat = fs.statSync(absolutePath);
  assert(stat.isFile(), `R3D1_PATH_NOT_FILE:${repositoryPath}`);
  return { repositoryPath: `/${repositoryPath}`, exists: true, byteLength: stat.size };
});

const html = read(diagnosticPaths[0]);
const host = read(diagnosticPaths[1]);
const pointerPlaceholderSource = read(diagnosticPaths[2]);
const gpuPlaceholderSource = read(diagnosticPaths[3]);
assert(html.includes('id="r3d-diagnostic-host"'), 'R3D1_HTML_HOST_MISSING');
assert(html.includes('id="r3d-canvas"'), 'R3D1_CANVAS_RESERVATION_MISSING');
assert(html.includes('src="./diagnostic-host.js"'), 'R3D1_HOST_MODULE_REFERENCE_MISSING');
assert(host.includes("from './pointer-touch-intake.placeholder.js'"), 'R3D1_POINTER_PLACEHOLDER_IMPORT_MISSING');
assert(host.includes("from './live-gpu-binding.placeholder.js'"), 'R3D1_GPU_PLACEHOLDER_IMPORT_MISSING');

const forbiddenExecutionPatterns = [
  /addEventListener\s*\(/,
  /getContext\s*\(/,
  /requestAnimationFrame\s*\(/,
  /dispatchEvent\s*\(/,
  /setPointerCapture\s*\(/,
  /style\.transform\s*=/,
  /createHEarthRun8ER3CPersistentRenderer\s*\(/
];
for (const [label, source] of [['host', host], ['pointer-placeholder', pointerPlaceholderSource], ['gpu-placeholder', gpuPlaceholderSource]]) {
  for (const pattern of forbiddenExecutionPatterns) {
    assert(!pattern.test(source), `R3D1_FORBIDDEN_EXECUTION_TOKEN:${label}:${pattern}`);
  }
}

const pointerPlaceholder = (await import(pathToFileURL(path.join(repositoryRoot, diagnosticPaths[2])).href)).default;
const gpuPlaceholder = (await import(pathToFileURL(path.join(repositoryRoot, diagnosticPaths[3])).href)).default;
assert(pointerPlaceholder.pointerBindingCreated === false, 'R3D1_POINTER_BINDING_PRESENT');
assert(pointerPlaceholder.touchBindingCreated === false, 'R3D1_TOUCH_BINDING_PRESENT');
assert(pointerPlaceholder.wheelBindingCreated === false, 'R3D1_WHEEL_BINDING_PRESENT');
assert(pointerPlaceholder.navigationProposalExecuted === false, 'R3D1_NAVIGATION_EXECUTION_PRESENT');
assert(gpuPlaceholder.webGLContextCreated === false, 'R3D1_WEBGL_CONTEXT_PRESENT');
assert(gpuPlaceholder.persistentRendererInitialized === false, 'R3D1_RENDERER_INITIALIZED');
assert(gpuPlaceholder.liveGpuCameraBindingCreated === false, 'R3D1_GPU_BINDING_PRESENT');
assert(gpuPlaceholder.bitmapPreviewCreated === false, 'R3D1_BITMAP_PREVIEW_PRESENT');

const registryPathReceipts = H_EARTH_RUN_8E_R3D1_PATHS.map((repositoryPath) => {
  const resolution = registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolution.resolved === true && resolution.unresolved === false, `R3D1_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`);
  return { repositoryPath, resolved: true, nodeCount: resolution.nodes.length, occurrenceCount: resolution.occurrences.length };
});
const loader = loadHEarthRepositoryRegistryValidatorDependencies();
assert(loader.identityVerified === true, 'R3D1_REGISTRY_LOADER_IDENTITY_FAILED');
assert(loader.boundary.readOnly === true, 'R3D1_REGISTRY_LOADER_NOT_READ_ONLY');

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_SCAFFOLD_VALIDATION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R3D1_DIAGNOSTIC_HOST_SCAFFOLD_VALIDATION_PASS',
  parentControl: parent,
  childControl: child,
  diagnosticDirectory: '/showroom/globe/h-earth/diagnostic/run8e-r3d/',
  diagnosticPathCount: diagnosticPaths.length,
  pathReceipts,
  registryPathCount: H_EARTH_RUN_8E_R3D1_PATHS.length,
  registryPathReceipts,
  moduleResolution: {
    htmlHostModuleReference: true,
    pointerPlaceholderImport: true,
    liveGpuBindingPlaceholderImport: true,
    pointerPlaceholderImportedInNode: true,
    liveGpuBindingPlaceholderImportedInNode: true
  },
  executionBoundaries: {
    interactionBindingCreated: false,
    pointerBindingCreated: false,
    touchBindingCreated: false,
    wheelBindingCreated: false,
    navigationProposalExecuted: false,
    webGLContextCreated: false,
    persistentRendererInitialized: false,
    liveGpuCameraBindingCreated: false,
    bitmapPreviewCreated: false,
    publicRouteBound: false
  },
  nextCheckpoint: 'RUN_8E_R3D2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_POINTER_AND_TOUCH_INTAKE_R3D2',
  issues: []
};

const outputPath = path.join(outputDirectory, 'h-earth.run8e-r3d1.diagnostic-host-scaffold.validation.receipt.json');
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ status: receipt.status, diagnosticPathCount: receipt.diagnosticPathCount, registryPathCount: receipt.registryPathCount, stoppingBoundary: receipt.stoppingBoundary }, null, 2));
