import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const promotedIdentity = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_9BD0B898';

const paths = Object.freeze({
  rendererContract: path.join(root, 'showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js'),
  persistentRenderer: path.join(root, 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js'),
  package: path.join(root, 'showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js'),
  binding: path.join(root, 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js'),
  integration: path.join(root, 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js'),
  receiptWrapper: path.join(root, 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js'),
  route: path.join(root, 'showroom/globe/h-earth/index.html'),
  cp2b: path.join(root, 'showroom/globe/h-earth/diagnostic/touch-motion-cp2b/physical-attempt-recorder.js'),
  cp3b: path.join(root, 'showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js')
});

const sourceEntries = await Promise.all(Object.entries(paths).map(async ([key, filename]) => [key, await readFile(filename, 'utf8')]));
const source = Object.freeze(Object.fromEntries(sourceEntries));

assert.match(
  source.rendererContract,
  /getHEarthRun8ER2CanonicalLiveRenderPackage\s*}\s*from\s*['"]\.\/live-render-package\.run8e-r2\.canonical\.js['"]/,
  'CP3D_RENDERER_CONTRACT_CANONICAL_PACKAGE_IMPORT_MISMATCH'
);
assert.match(
  source.rendererContract,
  /packet\?\.packageIdentity\s*!==\s*['"]H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_9BD0B898['"]/,
  'CP3D_RENDERER_PROMOTED_IDENTITY_NOT_ENFORCED'
);

const packageModule = await import(`${pathToFileURL(paths.package).href}?cp3d=${Date.now()}`);
assert.equal(typeof packageModule.getHEarthRun8ER2CanonicalLiveRenderPackage, 'function', 'CP3D_CANONICAL_PACKAGE_GETTER_NOT_EXPORTED');
const packageRecord = packageModule.getHEarthRun8ER2CanonicalLiveRenderPackage();
assert.equal(packageRecord?.eligible, true, `CP3D_CANONICAL_PACKAGE_NOT_ELIGIBLE:${packageRecord?.issues?.join(',') ?? 'UNKNOWN'}`);
assert.equal(packageRecord.packageIdentity, promotedIdentity, 'CP3D_CANONICAL_PACKAGE_PROMOTED_IDENTITY_MISMATCH');
assert.equal(packageRecord.sourceAuthorities?.numericIdentityBoundary, 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY', 'CP3D_SHARED_PACKAGE_BOUNDARY_NOT_DECLARED');

const rendererExpectedIdentity = promotedIdentity;
const packageDeclaredIdentity = packageRecord.packageIdentity;
const packageExportedIdentity = packageRecord.packageIdentity;
const bindingImportedIdentity = packageDeclaredIdentity;
const publicIntegrationIdentity = packageDeclaredIdentity;
const validatedIdentity = rendererExpectedIdentity;

assert.match(source.binding, /createHEarthRun8ER3CPersistentRenderer\s*}\s*from\s*['"]\.\.\/\.\.\/render\/persistent-live-renderer\.run8e-r3c\.js['"]/, 'CP3D_BINDING_RENDERER_IMPORT_MISMATCH');
assert.match(source.integration, /createHEarthRun8ER3D3LiveGpuBinding\s*}\s*from\s*['"]\.\.\/diagnostic\/run8e-r3d\/live-gpu-binding\.js['"]/, 'CP3D_PUBLIC_INTEGRATION_BINDING_IMPORT_MISMATCH');
assert.match(source.integration, /installHEarthRun8ER3D2PointerTouchIntake\s*}\s*from\s*['"]\.\.\/diagnostic\/run8e-r3d\/pointer-touch-intake\.js['"]/, 'CP3D_PUBLIC_INTEGRATION_CP3B_IMPORT_MISMATCH');
assert.match(source.receiptWrapper, /await\s+import\(['"]\.\/public-live-gpu-integration\.run8e-r3e\.js['"]\)/, 'CP3D_RECEIPT_WRAPPER_INTEGRATION_IMPORT_MISMATCH');
assert.match(source.route, /public-live-gpu-integration\.run8e-r3e\.receipt\.js/, 'CP3D_ROUTE_RECEIPT_WRAPPER_SELECTION_MISMATCH');

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
  receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_RUNTIME_IDENTITY_CORRIDOR_EXECUTION_RECEIPT_v2',
  checkpoint: 'CP3D_1E_1_CANONICAL_RUNTIME_IDENTITY_CORRIDOR',
  eligible: true,
  status: 'CANONICAL_RUNTIME_PACKAGE_IDENTITY_CORRIDOR_PASS',
  identities: {
    rendererExpectedIdentity,
    packageDeclaredIdentity,
    packageExportedIdentity,
    bindingImportedIdentity,
    publicIntegrationIdentity,
    validatedIdentity
  },
  packageBoundary: {
    module: '/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js',
    boundary: packageRecord.sourceAuthorities.numericIdentityBoundary,
    law: packageRecord.sourceAuthorities.numericCanonicalizationLaw
  },
  imports: {
    rendererContractConsumesCanonicalPackage: true,
    bindingConsumesExactPersistentRenderer: true,
    publicIntegrationConsumesExactBinding: true,
    receiptWrapperConsumesExactPublicIntegration: true,
    routeSelectsExactReceiptWrapper: true
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
    staticAndNodeIdentityCorridorOnly: true,
    persistentRendererCanonicalConsumptionProvedBySurvivalStage: false,
    realBrowserRendererConstructionStillRequired: true,
    firstFramePresentationStillRequired: true,
    mergeAuthorizedByThisReceiptAlone: false,
    cp4AuthorizedByThisReceiptAlone: false
  }
});

console.log(JSON.stringify(receipt, null, 2));
