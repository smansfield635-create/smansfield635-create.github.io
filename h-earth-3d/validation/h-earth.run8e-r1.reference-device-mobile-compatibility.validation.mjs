import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT,
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT_ID,
  evaluateHEarthRun8ER1ReferenceDeviceAmendment
} from '../control-plane/run-8/recovery/h-earth.run8e-r1.reference-device-and-mobile-compatibility-amendment.js';
import referenceDeviceFacade, {
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE,
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r1-reference-device-mobile-compatibility-scope.js';
import loadHEarthRepositoryRegistryValidatorDependencies from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const assert = (condition, code) => {
  if (!condition) throw new Error(code);
};

const evaluation = evaluateHEarthRun8ER1ReferenceDeviceAmendment();
assert(evaluation.eligible === true, `REFERENCE_DEVICE_AMENDMENT_INVALID:${evaluation.issues.join(',')}`);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.amendmentId ===
    H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT_ID,
  'REFERENCE_DEVICE_AMENDMENT_ID_INVALID'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.correction.productTarget ===
    'ALL_SUPPORTED_MOBILE_DEVICES',
  'PRODUCT_TARGET_NOT_ALL_SUPPORTED_MOBILE_DEVICES'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.correction.referenceValidationDevice ===
    'CURRENT_OFFICIAL_SAMSUNG_PHONE',
  'SAMSUNG_REFERENCE_DEVICE_NOT_PRESERVED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.correction.samsungOnlyImplementation === 'PROHIBITED',
  'SAMSUNG_ONLY_IMPLEMENTATION_NOT_PROHIBITED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.implementationRequirements.backendSelection ===
    'CAPABILITY_BASED_NOT_DEVICE_BRAND_BASED',
  'BACKEND_SELECTION_NOT_CAPABILITY_BASED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.implementationRequirements.flatBitmapCameraFeedback === false,
  'FLAT_BITMAP_CAMERA_FEEDBACK_NOT_PROHIBITED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.validationMatrix.referenceAndroid.requiredForR1ReferenceClosure === true,
  'REFERENCE_ANDROID_NOT_REQUIRED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.validationMatrix.secondAndroidClass.requiredBeforeBroadAndroidCompatibilityClaim === true,
  'SECOND_ANDROID_CLASS_NOT_REQUIRED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.validationMatrix.iosClass.requiredBeforeAllSupportedMobileCompatibilityClaim === true,
  'IOS_CLASS_NOT_REQUIRED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.validationMatrix.lowerPerformanceClass.requiredBeforeAllSupportedMobileCompatibilityClaim === true,
  'LOWER_PERFORMANCE_CLASS_NOT_REQUIRED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.claimBoundaries.referenceDeviceAcceptancePassDoesNotEqualAllMobileCompatibilityPass === true,
  'REFERENCE_DEVICE_AND_ALL_MOBILE_CLAIMS_NOT_SEPARATED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.orderingAndStopping.run8ER2ProductMutationAuthorizedNow === false,
  'R2_PRODUCT_MUTATION_PREMATURELY_AUTHORIZED'
);
assert(
  H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.claimBoundaries.run8ER1PassClosed === false &&
    H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT.claimBoundaries.run8EPassClosed === false,
  'RUN_8_CLOSED_BY_SCOPE_CORRECTION'
);

const registryInstance = referenceDeviceFacade.getHEarthRepositoryRegistryInstance();
assert(
  registryInstance.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE.nodeId),
  'REFERENCE_DEVICE_SCOPE_NODE_NOT_REGISTERED'
);
assert(
  registryInstance.evidenceRecords.some(
    (evidence) => evidence.evidenceId === H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE.evidenceId
  ),
  'REFERENCE_DEVICE_SCOPE_EVIDENCE_NOT_REGISTERED'
);

const loader = loadHEarthRepositoryRegistryValidatorDependencies();
assert(loader.identityVerified === true, 'REGISTRY_LOADER_IDENTITY_NOT_VERIFIED');
assert(
  loader.registryInstance.nodes.some(
    (node) => node.nodeId === H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE.nodeId
  ),
  'REFERENCE_DEVICE_SCOPE_NOT_ACTIVE_IN_LOADER'
);

const directory = path.dirname(fileURLToPath(import.meta.url));
const durableReceipt = JSON.parse(fs.readFileSync(
  path.join(directory, 'h-earth.run8e-r1.reference-device-mobile-compatibility.correction.receipt.json'),
  'utf8'
));
assert(
  durableReceipt.receiptType ===
    'H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_MOBILE_COMPATIBILITY_CORRECTION_RECEIPT',
  'DURABLE_RECEIPT_TYPE_INVALID'
);
assert(
  durableReceipt.status === 'RUN_8E_R1_REFERENCE_DEVICE_AND_MOBILE_COMPATIBILITY_CORRECTION_PASS',
  'DURABLE_RECEIPT_STATUS_INVALID'
);
assert(durableReceipt.validatedHead === '49bb5096731b42d2683838638daaaac6462fc669', 'DURABLE_RECEIPT_HEAD_INVALID');
assert(durableReceipt.workflowEvidence?.runId === 30231121889, 'DURABLE_RECEIPT_RUN_INVALID');
assert(durableReceipt.workflowEvidence?.jobId === 89870091381, 'DURABLE_RECEIPT_JOB_INVALID');
assert(durableReceipt.workflowEvidence?.artifactId === 8640124721, 'DURABLE_RECEIPT_ARTIFACT_INVALID');
assert(durableReceipt.scope?.productRouteMutated === false, 'DURABLE_RECEIPT_PRODUCT_MUTATION_INVALID');
assert(durableReceipt.scope?.rendererImplemented === false, 'DURABLE_RECEIPT_RENDERER_MUTATION_INVALID');
assert(durableReceipt.boundaries?.run8ER2ProductMutationAuthorized === false, 'DURABLE_RECEIPT_R2_BOUNDARY_INVALID');
assert(durableReceipt.boundaries?.run8ER1PassClosed === false, 'DURABLE_RECEIPT_R1_CLOSURE_INVALID');
assert(durableReceipt.boundaries?.run8EPassClosed === false, 'DURABLE_RECEIPT_RUN8E_CLOSURE_INVALID');

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_MOBILE_COMPATIBILITY_VALIDATION_RECEIPT',
  status: 'RUN_8E_R1_REFERENCE_DEVICE_AND_MOBILE_COMPATIBILITY_CORRECTION_PASS',
  generatedAt: new Date().toISOString(),
  amendmentId: H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT_ID,
  evaluation,
  correctedScope: {
    productTarget: 'ALL_SUPPORTED_MOBILE_DEVICES',
    referenceValidationDevice: 'CURRENT_OFFICIAL_SAMSUNG_PHONE',
    samsungOnlyImplementation: 'PROHIBITED',
    backendSelection: 'CAPABILITY_BASED_NOT_DEVICE_BRAND_BASED',
    universalMobileInteractionContract: 'REQUIRED'
  },
  validationClasses: {
    referenceAndroid: 'REQUIRED_REFERENCE_ACCEPTANCE_ANCHOR',
    secondAndroidDifferentGpuAndScreen: 'REQUIRED_BEFORE_BROAD_ANDROID_CLAIM',
    iosMobileSafari: 'REQUIRED_BEFORE_ALL_SUPPORTED_MOBILE_CLAIM',
    lowerPerformanceMobile: 'REQUIRED_BEFORE_ALL_SUPPORTED_MOBILE_CLAIM'
  },
  preservedBoundaries: {
    historicalR1EvidenceRewritten: false,
    productRouteMutated: false,
    rendererImplemented: false,
    cameraOrNavigationMutated: false,
    referenceDevicePhysicalInteractionReceiptCaptured: false,
    run8ER2ProductMutationAuthorized: false,
    run8ER1PassClosed: false,
    run8EPassClosed: false
  },
  registry: {
    nodeId: H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE.nodeId,
    evidenceId: H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE.evidenceId,
    loaderIdentityVerified: loader.identityVerified
  },
  durableReceiptValidated: true,
  issues: []
};

const outputDirectory = process.env.H_EARTH_RUN8E_REFERENCE_DEVICE_OUTPUT ?? '/tmp/h-earth-run8e-reference-device';
fs.mkdirSync(outputDirectory, { recursive: true });
const outputPath = path.join(outputDirectory, 'h-earth.run8e-r1.reference-device-mobile-compatibility.validation.receipt.json');
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
