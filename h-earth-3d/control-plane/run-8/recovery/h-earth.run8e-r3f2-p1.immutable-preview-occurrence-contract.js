import { evaluateHEarthRun8ER3F2Control } from './h-earth.run8e-r3f2.reference-device-immutable-preview-and-physical-execution.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3F2_P1_CONTRACT_ID =
  'H_EARTH_RUN_8E_R3F2_P1_IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT_v1';

const PACKAGE_SHA256 = 'sha256:3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234';
const PACKAGE_HEX = PACKAGE_SHA256.slice('sha256:'.length);
const PREVIEW_PATH = `/preview/h-earth/run8e/r3f2/sha256-${PACKAGE_HEX}/`;

export const H_EARTH_RUN_8E_R3F2_P1_CONTRACT = freeze({
  contractId: H_EARTH_RUN_8E_R3F2_P1_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3F2_P1',
  checkpointName: 'IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT',
  currentStatus: 'CONTRACT_COMPLETE_PENDING_DURABLE_RECEIPT',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3f2-p1-immutable-preview-occurrence-contract-001',
  baseBranch: 'agent/h-earth-run8e-r3f2-validated-package-baseline-001',
  baseExactHead: 'fcdcb4e80a98a86773d5276447b880efde2099c9',
  predecessor: freeze({
    checkpointId: 'RUN_8E_R3F2_SIGNED_OFFLINE_PACKAGE_VALIDATION',
    status: 'RUN_8E_R3F2_PREVIEW_VALIDATION_PASS',
    packageHead: 'fcdcb4e80a98a86773d5276447b880efde2099c9',
    workflowRun: 30317603086,
    workflowJob: 90146467936,
    artifactId: 8672743584,
    artifactDigest: 'sha256:f6efea7ea4d1137c9b4eb8affb31f06deb0cc879653523a538d0f5145638faf0',
    packageManifestSha256: 'sha256:c74d71c1115b5b122d3d12e56014002bd15201c05af25b7d027e8d9ad88f7174',
    packageFilename: 'H_EARTH_RUN8E_R3F2_SIGNED_OFFLINE_REFERENCE_DEVICE_PACKAGE.html',
    packageByteCount: 1213597,
    packageSha256: PACKAGE_SHA256,
    loopbackValidationPass: true,
    directFileValidationPass: true,
    activeWebGL2ContextCount: 1,
    physicalReferenceDeviceExecuted: false
  }),
  candidateIdentity: freeze({
    candidateId: `H_EARTH_RUN8E_R3F2_CANDIDATE_SHA256_${PACKAGE_HEX.toUpperCase()}`,
    sourceHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    functionalCssGitBlob: '481148416a8d0466e76c4cb2eca7a67d8932a242',
    publicShellCssGitBlob: 'f208b7f11096a7bf5da282226903ac634c1eab01',
    packageSha256: PACKAGE_SHA256,
    packageByteCount: 1213597
  }),
  immutablePreviewOccurrence: freeze({
    publicationHost: null,
    urlPath: PREVIEW_PATH,
    urlIdentityClass: 'PACKAGE_SHA256_PATH_BINDING',
    httpsRequired: true,
    immutableAfterFreeze: true,
    minimumEvidenceAvailabilityDays: 90,
    allowedServedFiles: freeze([
      freeze({ relativePath: 'index.html', role: 'EXACT_VALIDATED_SELF_CONTAINED_CANDIDATE', requiredDigest: PACKAGE_SHA256, runtimeDependency: true }),
      freeze({ relativePath: 'preview-manifest.json', role: 'SERVED_FILE_AND_CANDIDATE_IDENTITY_MANIFEST', requiredDigest: null, runtimeDependency: false }),
      freeze({ relativePath: 'device-evidence-receipt.schema.json', role: 'PHYSICAL_SESSION_EVIDENCE_SCHEMA', requiredDigest: null, runtimeDependency: false })
    ]),
    allowedRuntimeExternalRequests: freeze([]),
    mutableMainDependencyCountAllowed: 0,
    undeclaredRuntimeDependencyCountAllowed: 0,
    productionNavigationDiscoveryAllowed: false,
    ordinaryTrafficAllowed: false,
    serviceWorkerAllowed: false
  }),
  deliveryLaw: freeze({
    cacheModel: 'IMMUTABLE_HASHED_URL_AND_IMMUTABLE_CACHE',
    cacheControl: 'public, max-age=31536000, immutable',
    noIndexModel: 'HTTP_X_ROBOTS_TAG_REQUIRED',
    xRobotsTag: 'noindex, nofollow, noarchive',
    mixedContentAllowed: false,
    corsFailureCountAllowed: 0,
    contentTypeErrorCountAllowed: 0,
    notFoundRequestCountAllowed: 0,
    staleCacheDependencyCountAllowed: 0
  }),
  visibleIdentityRequirements: freeze([
    'NON_PRODUCTION_LABEL',
    'CANDIDATE_ID',
    'PACKAGE_SHA256',
    'PACKAGE_HEAD',
    'SOURCE_HEAD',
    'TEST_SESSION_IDENTIFIER'
  ]),
  deviceEvidenceReceiptRequiredFields: freeze([
    'candidateId','previewUrl','packageSha256','previewManifestDigest','servedAssetIdentities',
    'sessionIdentifier','userAgent','viewport','devicePixelRatio','orientation','webglVersion',
    'gpuRendererInformationWhenAvailable','contextCreationCount','rendererInitializationCount',
    'bufferUploadCount','visibleFrameCount','navigationProposalCount','maximumResponseTimeMs',
    'worldRebuildCount','contextLossCount','contextRestorationCount','sessionStart','sessionEnd'
  ]),
  authorizedWork: freeze([
    'DEFINE_PREVIEW_ID','DEFINE_IMMUTABLE_URL_SHAPE','DEFINE_ALLOWED_PATH_SET',
    'DEFINE_MANIFEST_SCHEMA','DEFINE_CACHE_LAW','DEFINE_NON_PRODUCTION_BOUNDARIES',
    'DEFINE_DEVICE_RECEIPT_SCHEMA'
  ]),
  prohibitedWork: freeze([
    'PREVIEW_FILE_MATERIALIZATION','PREVIEW_DEPLOYMENT_CONFIGURATION','NETWORK_PUBLICATION',
    'SHOWROOM_MUTATION','PUBLIC_ROUTE_REPLACEMENT','MAIN_MUTATION','RECOVERY_STACK_MERGE',
    'PRODUCTION_DEPLOYMENT','PHYSICAL_REFERENCE_DEVICE_EXECUTION','R3F3_WORK','R3F4_WORK',
    'R3G_WORK','RUN_8E_PASS_CLOSED'
  ]),
  passCriteria: freeze({
    exactPackageIdentityDeclared: true,
    allAllowedFilesEnumerated: true,
    allProhibitedMutationsEnumerated: true,
    nonProductionLawComplete: true,
    deviceEvidenceSchemaComplete: true,
    mutableRuntimeDependencyCountAllowed: 0
  }),
  boundaries: freeze({
    previewFilesMaterialized: false,
    deploymentConfigurationCreated: false,
    networkPublicationPerformed: false,
    previewUrlIssued: false,
    showroomMutated: false,
    publicLiveHEarthChanged: false,
    mainChanged: false,
    recoveryStackMerged: false,
    productionDeployment: false,
    physicalReferenceDeviceExecuted: false,
    broaderMobileExecuted: false,
    run8EPassClosed: false
  }),
  nextCheckpoint: 'RUN_8E_R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZATION',
  stoppingBoundary: 'STOP_BEFORE_PREVIEW_FILES_OR_DEPLOYMENT_CONFIGURATION'
});

export function evaluateHEarthRun8ER3F2P1Contract(candidate = H_EARTH_RUN_8E_R3F2_P1_CONTRACT) {
  const issues = [];
  const predecessor = evaluateHEarthRun8ER3F2Control();
  if (predecessor.eligible !== true) issues.push(...predecessor.issues.map((issue) => `PREDECESSOR:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3F2_P1_CONTRACT_ID) issues.push('P1_CONTRACT_ID_MISMATCH');
  if (!['CONTRACT_COMPLETE_PENDING_DURABLE_RECEIPT','PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('P1_STATUS_INVALID');
  if (candidate?.baseExactHead !== 'fcdcb4e80a98a86773d5276447b880efde2099c9') issues.push('P1_BASE_HEAD_MISMATCH');
  if (candidate?.predecessor?.status !== 'RUN_8E_R3F2_PREVIEW_VALIDATION_PASS') issues.push('P1_PREDECESSOR_STATUS_INVALID');
  if (candidate?.predecessor?.packageSha256 !== PACKAGE_SHA256 || candidate?.predecessor?.packageByteCount !== 1213597) issues.push('P1_PACKAGE_IDENTITY_INVALID');
  if (candidate?.predecessor?.loopbackValidationPass !== true || candidate?.predecessor?.directFileValidationPass !== true || candidate?.predecessor?.activeWebGL2ContextCount !== 1) issues.push('P1_PREDECESSOR_BROWSER_VALIDATION_INVALID');
  if (candidate?.candidateIdentity?.packageSha256 !== PACKAGE_SHA256) issues.push('P1_CANDIDATE_PACKAGE_DIGEST_MISMATCH');
  const preview = candidate?.immutablePreviewOccurrence ?? {};
  if (preview.publicationHost !== null) issues.push('P1_PUBLICATION_HOST_PREMATURELY_BOUND');
  if (preview.urlPath !== PREVIEW_PATH || preview.urlIdentityClass !== 'PACKAGE_SHA256_PATH_BINDING') issues.push('P1_URL_IDENTITY_INVALID');
  if (preview.httpsRequired !== true || preview.immutableAfterFreeze !== true) issues.push('P1_HTTPS_OR_IMMUTABILITY_LAW_INVALID');
  if (!Array.isArray(preview.allowedServedFiles) || preview.allowedServedFiles.length !== 3) issues.push('P1_ALLOWED_FILE_SET_INVALID');
  if (preview.allowedServedFiles?.[0]?.relativePath !== 'index.html' || preview.allowedServedFiles?.[0]?.requiredDigest !== PACKAGE_SHA256) issues.push('P1_ENTRY_FILE_IDENTITY_INVALID');
  if ((preview.allowedRuntimeExternalRequests ?? []).length !== 0 || preview.mutableMainDependencyCountAllowed !== 0 || preview.undeclaredRuntimeDependencyCountAllowed !== 0) issues.push('P1_RUNTIME_DEPENDENCY_LAW_INVALID');
  const delivery = candidate?.deliveryLaw ?? {};
  if (delivery.cacheModel !== 'IMMUTABLE_HASHED_URL_AND_IMMUTABLE_CACHE' || delivery.xRobotsTag !== 'noindex, nofollow, noarchive') issues.push('P1_DELIVERY_LAW_INVALID');
  if ((candidate?.visibleIdentityRequirements ?? []).length !== 6) issues.push('P1_VISIBLE_IDENTITY_REQUIREMENTS_INCOMPLETE');
  if ((candidate?.deviceEvidenceReceiptRequiredFields ?? []).length !== 23) issues.push('P1_DEVICE_RECEIPT_SCHEMA_INCOMPLETE');
  if (Object.values(candidate?.passCriteria ?? {}).some((value) => value !== true && value !== 0)) issues.push('P1_PASS_CRITERIA_INVALID');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`P1_BOUNDARY_VIOLATION:${key}`);
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZATION') issues.push('P1_NEXT_CHECKPOINT_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_PREVIEW_FILES_OR_DEPLOYMENT_CONFIGURATION') issues.push('P1_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3F2_P1_PASS_CLOSED' : 'RUN_8E_R3F2_P1_CONTRACT_COMPLETE_PENDING_DURABLE_RECEIPT')
      : 'RUN_8E_R3F2_P1_CONTRACT_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3F2_P1_CONTRACT;
