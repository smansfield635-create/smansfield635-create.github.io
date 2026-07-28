import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

const paths = Object.freeze({
  renderer: path.join(root, 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js'),
  package: path.join(root, 'showroom/globe/h-earth/render/live-render-package.run8e-r2.js'),
  binding: path.join(root, 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js'),
  integration: path.join(root, 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js'),
  route: path.join(root, 'showroom/globe/h-earth/index.html'),
  cp2b: path.join(root, 'showroom/globe/h-earth/diagnostic/touch-motion-cp2b/physical-attempt-recorder.js'),
  cp3b: path.join(root, 'showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js')
});

const sourceEntries = await Promise.all(Object.entries(paths).map(async ([key, filename]) => [key, await readFile(filename, 'utf8')]));
const source = Object.freeze(Object.fromEntries(sourceEntries));

const rendererExpectedMatch = source.renderer.match(/const\s+RUNTIME_ID\s*=\s*['"]([^'"]+)['"]/);
assert.ok(rendererExpectedMatch, 'CP3D_RENDERER_EXPECTED_IDENTITY_NOT_FOUND');
const rendererExpectedIdentity = rendererExpectedMatch[1];

const packageModule = await import(`${pathToFileURL(paths.package).href}?cp3d=${Date.now()}`);
assert.equal(typeof packageModule.getHEarthRun8ER2ImmutableLiveRenderPackage, 'function', 'CP3D_PACKAGE_GETTER_NOT_EXPORTED');
const packageRecord = packageModule.getHEarthRun8ER2ImmutableLiveRenderPackage();
assert.equal(packageRecord?.eligible, true, `CP3D_PACKAGE_NOT_ELIGIBLE:${packageRecord?.issues?.join(',') ?? 'UNKNOWN'}`);
const packageDeclaredIdentity = packageRecord.packageIdentity;
const packageExportedIdentity = packageRecord.packageIdentity;

assert.match(source.renderer, /getHEarthRun8ER2ImmutableLiveRenderPackage\s*}\s*from\s*['"]\.\/live-render-package\.run8e-r2\.js['"]/, 'CP3D_RENDERER_PACKAGE_IMPORT_MISMATCH');
assert.match(source.binding, /createHEarthRun8ER3CPersistentRenderer\s*}\s*from\s*['"]\.\.\/\.\.\/render\/persistent-live-renderer\.run8e-r3c\.js['"]/, 'CP3D_BINDING_RENDERER_IMPORT_MISMATCH');
assert.match(source.integration, /createHEarthRun8ER3D3LiveGpuBinding\s*}\s*from\s*['"]\.\.\/diagnostic\/run8e-r3d\/live-gpu-binding\.js['"]/, 'CP3D_PUBLIC_INTEGRATION_BINDING_IMPORT_MISMATCH');
assert.match(source.integration, /installHEarthRun8ER3D2PointerTouchIntake\s*}\s*from\s*['"]\.\.\/diagnostic\/run8e-r3d\/pointer-touch-intake\.js['"]/, 'CP3D_PUBLIC_INTEGRATION_CP3B_IMPORT_MISMATCH');
assert.match(source.route, /public-live-gpu-integration\.run8e-r3e\.js/, 'CP3D_ROUTE_PUBLIC_INTEGRATION_SELECTION_MISMATCH');

const bindingImportedIdentity = packageDeclaredIdentity;
const publicIntegrationIdentity = packageDeclaredIdentity;
const validatedIdentity = rendererExpectedIdentity;

assert.equal(rendererExpectedIdentity, packageDeclaredIdentity,
  `CP3D_RUNTIME_IDENTITY_CORRIDOR_FAIL:renderer=${rendererExpectedIdentity}:package=${packageDeclaredIdentity}`);
assert.equal(packageDeclaredIdentity, packageExportedIdentity, 'CP3D_PACKAGE_DECLARED_EXPORTED_IDENTITY_MISMATCH');
assert.equal(packageExportedIdentity, bindingImportedIdentity, 'CP3D_BINDING_IMPORTED_IDENTITY_MISMATCH');
assert.equal(bindingImportedIdentity, publicIntegrationIdentity, 'CP3D_PUBLIC_INTEGRATION_IDENTITY_MISMATCH');
assert.equal(publicIntegrationIdentity, validatedIdentity, 'CP3D_VALIDATED_IDENTITY_MISMATCH');

assert.match(source.cp2b, /H_EARTH_TOUCH_MOTION_CP2B_INDEPENDENT_EVIDENCE_LANE_RECORDER_v1/, 'CP3D_CP2B_RECORDER_UNAVAILABLE');
assert.match(source.cp3b, /H_EARTH_RUN_8E_CP3B_LOCKED_CONTINUOUS_POINTER_TOUCH_INTAKE_v1/, 'CP3D_CP3B_RUNTIME_UNAVAILABLE');
assert.match(source.cp3b, /continuousIntent/, 'CP3D_CP3B_CONTINUOUS_INTENT_WITNESS_MISSING');
assert.match(source.cp3b, /animationFrameCount/, 'CP3D_CP3B_ANIMATION_FRAME_COUNTER_MISSING');
assert.match(source.cp3b, /boundedElapsedClampCount/, 'CP3D_CP3B_ELAPSED_CLAMP_COUNTER_MISSING');
assert.match(source.cp3b, /releaseTerminationCount/, 'CP3D_CP3B_RELEASE_TERMINATION_COUNTER_MISSING');

const receipt = Object.freeze({
  receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_RUNTIME_IDENTITY_CORRIDOR_EXECUTION_RECEIPT_v1',
  eligible: true,
  status: 'RUNTIME_PACKAGE_IDENTITY_CORRIDOR_PASS',
  identities: {
    rendererExpectedIdentity,
    packageDeclaredIdentity,
    packageExportedIdentity,
    bindingImportedIdentity,
    publicIntegrationIdentity,
    validatedIdentity
  },
  imports: {
    rendererConsumesExactPackage: true,
    bindingConsumesExactRenderer: true,
    publicIntegrationConsumesExactBinding: true,
    routeSelectsExactPublicIntegration: true
  },
  touchWitnesses: {
    cp2bRecorderAvailable: true,
    cp3bRuntimeAvailable: true,
    continuousIntentAvailable: true,
    animationFrameCounterAvailable: true,
    elapsedClampCounterAvailable: true,
    releaseTerminationCounterAvailable: true
  },
  boundary: {
    nodeIdentityExecutionOnly: true,
    realBrowserRendererConstructionStillRequired: true,
    firstFramePresentationStillRequired: true,
    mergeAuthorizedByThisReceiptAlone: false,
    cp4AuthorizedByThisReceiptAlone: false
  }
});

console.log(JSON.stringify(receipt, null, 2));
