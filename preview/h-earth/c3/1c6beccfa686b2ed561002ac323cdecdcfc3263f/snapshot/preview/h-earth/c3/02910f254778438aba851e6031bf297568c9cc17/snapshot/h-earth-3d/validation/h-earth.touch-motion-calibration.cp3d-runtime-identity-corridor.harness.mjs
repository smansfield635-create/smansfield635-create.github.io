import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const liveOccurrenceId = 'H_EARTH_OW01_GRATITUDE_COASTAL_ENTRY_LIVE_RENDER_PACKAGE_OCCURRENCE_001';
const identityPrefix = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_';

const paths = Object.freeze({
  rendererContract: path.join(root, 'showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js'),
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

assert.match(source.rendererContract, /getHEarthOW01CanonicalLiveRenderPackageOccurrence\s*}\s*from\s*['"]\.\/live-render-package\.run8e-r2\.canonical\.js['"]/, 'CP3D_RENDERER_CONTRACT_OW01_PACKAGE_IMPORT_MISMATCH');
assert.match(source.rendererContract, /packageOccurrenceId\s*!==\s*['"]H_EARTH_OW01_GRATITUDE_COASTAL_ENTRY_LIVE_RENDER_PACKAGE_OCCURRENCE_001['"]/, 'CP3D_RENDERER_LIVE_OCCURRENCE_NOT_ENFORCED');
assert.match(source.rendererContract, /packageIdentity\.startsWith\(['"]H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_['"]\)/, 'CP3D_RENDERER_CONTENT_ADDRESSED_IDENTITY_CLASS_NOT_ENFORCED');

const packageModule = await import(`${pathToFileURL(paths.package).href}?cp3d=${Date.now()}`);
assert.equal(typeof packageModule.getHEarthOW01CanonicalLiveRenderPackageOccurrence, 'function', 'CP3D_OW01_PACKAGE_GETTER_NOT_EXPORTED');
const packageRecord = packageModule.getHEarthOW01CanonicalLiveRenderPackageOccurrence();
assert.equal(packageRecord?.eligible, true, `CP3D_OW01_PACKAGE_NOT_ELIGIBLE:${packageRecord?.issues?.join(',') ?? 'UNKNOWN'}`);
assert.equal(packageRecord?.packageOccurrenceId, liveOccurrenceId, 'CP3D_OW01_PACKAGE_OCCURRENCE_MISMATCH');
assert.equal(typeof packageRecord?.packageIdentity, 'string', 'CP3D_OW01_PACKAGE_IDENTITY_NOT_STRING');
assert.equal(packageRecord.packageIdentity.startsWith(identityPrefix), true, 'CP3D_OW01_PACKAGE_IDENTITY_CLASS_MISMATCH');
assert.equal(packageRecord.sourceAuthorities?.numericIdentityBoundary, 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY', 'CP3D_SHARED_PACKAGE_BOUNDARY_NOT_DECLARED');

assert.match(source.binding, /ACCEPTED_BASELINE_RENDERER_PATH\s*=\s*['"]\.\.\/\.\.\/render\/persistent-live-renderer\.run8e-r3c\.js['"]/, 'CP3D_BINDING_BASELINE_RENDERER_PATH_MISMATCH');
assert.match(source.binding, /selectedRendererPath\s*=\s*additiveVisualRequested[\s\S]*ACCEPTED_BASELINE_RENDERER_PATH/, 'CP3D_BINDING_RENDERER_SELECTION_LAW_MISMATCH');
assert.match(source.binding, /selectedRendererModule\s*=\s*await\s+import\(selectedRendererPath\)/, 'CP3D_BINDING_DYNAMIC_RENDERER_IMPORT_MISSING');
assert.match(source.binding, /createHEarthRun8ER3CPersistentRenderer\s*}\s*=\s*selectedRendererModule/, 'CP3D_BINDING_DYNAMIC_RENDERER_EXPORT_MISSING');
assert.match(source.integration, /createHEarthRun8ER3D3LiveGpuBinding\s*}\s*from\s*['"]\.\.\/diagnostic\/run8e-r3d\/live-gpu-binding\.js['"]/, 'CP3D_PUBLIC_INTEGRATION_BINDING_IMPORT_MISMATCH');
assert.match(source.integration, /installHEarthRun8ER3D2PointerTouchIntake\s*}\s*from\s*['"]\.\.\/diagnostic\/run8e-r3d\/pointer-touch-intake\.js['"]/, 'CP3D_PUBLIC_INTEGRATION_CP3B_IMPORT_MISMATCH');
assert.match(source.receiptWrapper, /await\s+import\(['"]\.\/public-live-gpu-integration\.run8e-r3e\.js['"]\)/, 'CP3D_RECEIPT_WRAPPER_INTEGRATION_IMPORT_MISMATCH');
assert.match(source.route, /public-live-gpu-integration\.run8e-r3e\.receipt\.js/, 'CP3D_ROUTE_RECEIPT_WRAPPER_SELECTION_MISMATCH');

assert.match(source.cp2b, /H_EARTH_TOUCH_MOTION_CP2B_INDEPENDENT_EVIDENCE_LANE_RECORDER_v1/, 'CP3D_CP2B_RECORDER_UNAVAILABLE');
assert.match(source.cp3b, /H_EARTH_RUN_8E_CP3B_LOCKED_CONTINUOUS_POINTER_TOUCH_INTAKE_v1/, 'CP3D_CP3B_RUNTIME_UNAVAILABLE');
assert.match(source.cp3b, /continuousIntent/, 'CP3D_CP3B_CONTINUOUS_INTENT_WITNESS_MISSING');
assert.match(source.cp3b, /animationFrameCount/, 'CP3D_CP3B_ANIMATION_FRAME_COUNTER_MISSING');
assert.match(source.cp3b, /boundedElapsedClampCount/, 'CP3D_CP3B_ELAPSED_CLAMP_COUNTER_MISSING');
assert.match(source.cp3b, /releaseTerminationCount/, 'CP3D_CP3B_RELEASE_TERMINATION_COUNTER_MISSING');

const receipt = Object.freeze({
  receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_RUNTIME_IDENTITY_CORRIDOR_EXECUTION_RECEIPT_v4',
  checkpoint: 'CP3D_1E_2_OW01_DYNAMIC_BASELINE_RENDERER_IDENTITY_CORRIDOR',
  eligible: true,
  status: 'OW01_DYNAMIC_BASELINE_RENDERER_IDENTITY_CORRIDOR_PASS',
  packageOccurrenceId: packageRecord.packageOccurrenceId,
  packageIdentity: packageRecord.packageIdentity,
  rendererExpectedIdentityClass: identityPrefix,
  numericIdentityBoundary: packageRecord.sourceAuthorities.numericIdentityBoundary,
  baselineRendererPathVerified: true,
  dynamicRendererSelectionVerified: true,
  publicIntegrationBindingVerified: true,
  routeReceiptWrapperVerified: true,
  historicalFixedPackageIdentityRequired: false,
  realBrowserRendererConstructionStillRequired: true,
  firstFramePresentationStillRequired: true,
  mergeAuthorizedByThisReceiptAlone: false
});
console.log(JSON.stringify(receipt, null, 2));
