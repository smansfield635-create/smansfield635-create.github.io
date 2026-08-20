import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const expectedOccurrenceId = 'H_EARTH_OW01_GRATITUDE_COASTAL_ENTRY_LIVE_RENDER_PACKAGE_OCCURRENCE_001';
const acceptedBaselineRendererPath = '../../render/persistent-live-renderer.run8e-r3c.js';

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
  /getHEarthOW01CanonicalLiveRenderPackageOccurrence\s*}\s*from\s*['"]\.\/live-render-package\.run8e-r2\.canonical\.js['"]/,
  'CP3D_GEN329_RENDERER_OW01_PACKAGE_IMPORT_MISMATCH'
);
assert.match(source.rendererContract, /singleSphericalPresentationManifold/, 'CP3D_GEN329_SPHERICAL_PRESENTATION_CONTRACT_MISSING');
assert.match(source.rendererContract, /cameraAndWorldSharePlanetaryFrame/, 'CP3D_GEN329_SHARED_PLANETARY_FRAME_CONTRACT_MISSING');

const packageModule = await import(`${pathToFileURL(paths.package).href}?cp3d=${Date.now()}`);
assert.equal(typeof packageModule.getHEarthOW01CanonicalLiveRenderPackageOccurrence, 'function', 'CP3D_OW01_CANONICAL_PACKAGE_GETTER_NOT_EXPORTED');
const packageRecord = packageModule.getHEarthOW01CanonicalLiveRenderPackageOccurrence();
assert.equal(packageRecord?.eligible, true, `CP3D_OW01_CANONICAL_PACKAGE_NOT_ELIGIBLE:${packageRecord?.issues?.join(',') ?? 'UNKNOWN'}`);
assert.equal(packageRecord?.packageOccurrenceId, expectedOccurrenceId, 'CP3D_OW01_PACKAGE_OCCURRENCE_MISMATCH');
assert.equal(packageRecord?.sourceAuthorities?.numericIdentityBoundary, 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY', 'CP3D_SHARED_PACKAGE_BOUNDARY_NOT_DECLARED');

const rendererModule = await import(`${pathToFileURL(paths.rendererContract).href}?cp3d=${Date.now()}`);
assert.equal(typeof rendererModule.getHEarthRun8ER3ALiveRendererInterface, 'function', 'CP3D_RENDERER_INTERFACE_GETTER_NOT_EXPORTED');
const rendererInterface = rendererModule.getHEarthRun8ER3ALiveRendererInterface();
assert.equal(rendererInterface?.packageIdentity, packageRecord.packageIdentity, 'CP3D_RENDERER_PACKAGE_IDENTITY_MISMATCH');
assert.equal(rendererInterface?.packageContentDigest, packageRecord.contentDigest, 'CP3D_RENDERER_PACKAGE_DIGEST_MISMATCH');
assert.equal(rendererInterface?.packageOccurrenceId, packageRecord.packageOccurrenceId, 'CP3D_RENDERER_PACKAGE_OCCURRENCE_MISMATCH');
assert.equal(rendererInterface?.singleSphericalPresentationManifoldRequired, true, 'CP3D_RENDERER_SPHERICAL_MANIFOLD_REQUIREMENT_MISSING');
assert.equal(rendererInterface?.cameraAndWorldSameFrameRequired, true, 'CP3D_RENDERER_SHARED_FRAME_REQUIREMENT_MISSING');

assert.match(
  source.binding,
  /const\s+ACCEPTED_BASELINE_RENDERER_PATH\s*=\s*['"]\.\.\/\.\.\/render\/persistent-live-renderer\.run8e-r3c\.js['"]/,
  'CP3D_BINDING_ACCEPTED_BASELINE_RENDERER_PATH_MISMATCH'
);
assert.match(source.binding, /const\s+selectedRendererModule\s*=\s*await\s+import\(selectedRendererPath\)/, 'CP3D_BINDING_DYNAMIC_RENDERER_IMPORT_MISSING');
assert.match(source.binding, /const\s*{\s*createHEarthRun8ER3CPersistentRenderer\s*}\s*=\s*selectedRendererModule/, 'CP3D_BINDING_RENDERER_FACTORY_EXTRACTION_MISSING');
assert.match(source.binding, /acceptedBaselineRendererSelected\s*:\s*!additiveVisualRequested\s*&&\s*!cp2LiveDifferentialRequested/, 'CP3D_BINDING_BASELINE_SELECTION_CORRESPONDENCE_MISSING');
assert.ok(source.binding.includes(acceptedBaselineRendererPath), 'CP3D_BINDING_BASELINE_PATH_LITERAL_MISSING');

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
  receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_GEN329_RUNTIME_IDENTITY_CORRIDOR_EXECUTION_RECEIPT_v4',
  checkpoint: 'CP3D_1E_1_GEN329_OW01_RUNTIME_IDENTITY_CORRIDOR',
  eligible: true,
  status: 'GEN329_OW01_RUNTIME_PACKAGE_IDENTITY_CORRIDOR_PASS',
  identities: {
    packageOccurrenceId: packageRecord.packageOccurrenceId,
    packageIdentity: packageRecord.packageIdentity,
    packageContentDigest: packageRecord.contentDigest,
    rendererPackageIdentity: rendererInterface.packageIdentity,
    rendererPackageContentDigest: rendererInterface.packageContentDigest,
    rendererPackageOccurrenceId: rendererInterface.packageOccurrenceId
  },
  packageBoundary: {
    module: '/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js',
    getter: 'getHEarthOW01CanonicalLiveRenderPackageOccurrence',
    boundary: packageRecord.sourceAuthorities.numericIdentityBoundary,
    law: packageRecord.sourceAuthorities.numericCanonicalizationLaw
  },
  imports: {
    rendererContractConsumesOW01CanonicalOccurrence: true,
    bindingSelectsRendererThroughDeclaredDynamicBoundary: true,
    acceptedBaselineRendererPath,
    acceptedBaselineRendererSelectionPublished: true,
    publicIntegrationConsumesExactBinding: true,
    receiptWrapperConsumesExactPublicIntegration: true,
    routeSelectsExactReceiptWrapper: true
  },
  gen329SpatialContract: {
    singleSphericalPresentationManifoldRequired: true,
    cameraAndWorldSameFrameRequired: true
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
    historicalR2CheckpointRewritten: false,
    gen329ProductMutation: false,
    mergeAuthorizedByThisReceiptAlone: false,
    cp4AuthorizedByThisReceiptAlone: false
  }
});

console.log(JSON.stringify(receipt, null, 2));
