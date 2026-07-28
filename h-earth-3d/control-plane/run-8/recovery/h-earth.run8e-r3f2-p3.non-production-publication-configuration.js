import { evaluateHEarthRun8ER3F2P2Control } from './h-earth.run8e-r3f2-p2.exact-preview-package-materialization.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3F2_P3_CONTROL_ID =
  'H_EARTH_RUN_8E_R3F2_P3_NON_PRODUCTION_PUBLICATION_CONFIGURATION_v1';

const PACKAGE_HEX = '3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234';
const PREVIEW_PATH = `/preview/h-earth/run8e/r3f2/sha256-${PACKAGE_HEX}/`;
const PREVIEW_ROOT = `preview/h-earth/run8e/r3f2/sha256-${PACKAGE_HEX}`;

export const H_EARTH_RUN_8E_R3F2_P3_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3F2_P3_CONTROL_ID,
  checkpointId: 'RUN_8E_R3F2_P3',
  checkpointName: 'NON_PRODUCTION_PUBLICATION_CONFIGURATION',
  currentStatus: 'PASS_CLOSED',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3f2-p3-non-production-publication-configuration-001',
  baseBranch: 'agent/h-earth-run8e-r3f2-p2-exact-preview-package-materialization-001',
  baseExactHead: '75ecf5ad0b618318aea384c9422591425320de8f',
  predecessor: freeze({
    checkpointId: 'RUN_8E_R3F2_P2',
    status: 'PASS_CLOSED',
    exactHead: '75ecf5ad0b618318aea384c9422591425320de8f',
    pullRequest: 254,
    passReceiptPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p2.pass-closed.receipt.json',
    passReceiptGitBlob: '203f960330da70e2947082ac356586caa5e166f0',
    previewRoot: `/${PREVIEW_ROOT}/`,
    exactFileCount: 3
  }),
  candidateIdentity: freeze({
    candidateId: `H_EARTH_RUN8E_R3F2_CANDIDATE_SHA256_${PACKAGE_HEX.toUpperCase()}`,
    packageHead: 'fcdcb4e80a98a86773d5276447b880efde2099c9',
    packageSha256: `sha256:${PACKAGE_HEX}`,
    packageByteCount: 1213597,
    sourceHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445'
  }),
  publicationConfiguration: freeze({
    provider: 'CLOUDFLARE_PAGES_DIRECT_UPLOAD',
    projectName: 'h-earth-run8e-r3f2-preview-30201543',
    productionBranchSentinel: 'production-disabled-r3f2',
    previewBranch: 'r3f2-candidate-3020154361523cf1',
    publicationBranch: 'agent/h-earth-run8e-r3f2-p4-immutable-preview-publication-001',
    publicationWorkflowPath: '/.github/workflows/h-earth-run8e-r3f2-p4-immutable-preview-publication.yml',
    workflowTrigger: 'WORKFLOW_DISPATCH_ONLY',
    githubEnvironment: 'h-earth-run8e-r3f2-preview-publication',
    requiredSecrets: freeze(['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']),
    previewPath: PREVIEW_PATH,
    stagingRoot: '/tmp/h-earth-run8e-r3f2-p4-pages-root',
    uniqueDeploymentUrlRequired: true,
    branchAliasAcceptedAsEvidenceUrl: false,
    customDomainAttachmentAllowed: false,
    liveDomainRouteBindingAllowed: false,
    gitIntegrationAllowed: false,
    directUploadOnly: true,
    firstPublicationCheckpoint: 'RUN_8E_R3F2_P4'
  }),
  deliveryConfiguration: freeze({
    httpsRequired: true,
    expectedContentTypes: freeze({
      'index.html': 'text/html',
      'preview-manifest.json': 'application/json',
      'device-evidence-receipt.schema.json': 'application/json'
    }),
    cacheControl: 'public, max-age=31536000, immutable',
    xRobotsTag: 'noindex, nofollow, noarchive',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'no-referrer',
    serviceWorkerAllowed: false,
    mixedContentAllowed: false,
    externalRuntimeRequestCountAllowed: 0,
    mutableMainDependencyCountAllowed: 0,
    notFoundRequestCountAllowed: 0,
    corsFailureCountAllowed: 0,
    contentTypeErrorCountAllowed: 0
  }),
  exactSourceTree: freeze([
    freeze({ relativePath: 'index.html', byteCount: 1213597, contentSha256: `sha256:${PACKAGE_HEX}`, gitBlobSha1: 'c5127e2d4d9d3558230a8eccd757dade74d6d8c3' }),
    freeze({ relativePath: 'preview-manifest.json', byteCount: 3981, contentSha256: 'sha256:b77b3e88ef4868d0602468da90693c64c46b09442e1fe15013ed4dcf69156dd4', gitBlobSha1: '81dbbb97898023ae0dabea313ac69b865302d533' }),
    freeze({ relativePath: 'device-evidence-receipt.schema.json', byteCount: 4586, contentSha256: 'sha256:04ce5ec86f102fb7646b02ad19a3f862b8e6370dcdc971dc252d6bc607e3d18a', gitBlobSha1: '987268f38fc8b6db6f19b982cc8386439aa0de48' })
  ]),
  authorizedWork: freeze([
    'CREATE_PREVIEW_DEPLOYMENT_CONFIGURATION','BIND_IMMUTABLE_PATH','CONFIGURE_HTTPS',
    'CONFIGURE_CONTENT_TYPES','CONFIGURE_CACHE_POLICY','CONFIGURE_NOINDEX',
    'DISABLE_PRODUCTION_NAVIGATION_DISCOVERY','DISABLE_SERVICE_WORKER_DRIFT'
  ]),
  prohibitedWork: freeze([
    'FIRST_NETWORK_PUBLICATION','PREVIEW_URL_ISSUANCE','SHOWROOM_MUTATION','PUBLIC_LIVE_H_EARTH_CHANGE',
    'MAIN_MUTATION','RECOVERY_STACK_MERGE','PRODUCTION_DEPLOYMENT','CUSTOM_DOMAIN_BINDING',
    'PHYSICAL_REFERENCE_DEVICE_EXECUTION','R3F3_WORK','R3F4_WORK','R3G_WORK','RUN_8E_PASS_CLOSED'
  ]),
  passCriteria: freeze({
    configurationIsNonProduction: true,
    immutablePathBound: true,
    httpsConfigurationPresent: true,
    cacheLawExplicit: true,
    noIndexPresent: true,
    liveRouteIsolationEstablished: true,
    publicationWorkflowManualOnly: true,
    exactSourceTreeUnchanged: true
  }),
  closureEvidence: freeze({
    coreHead: 'a31a059759e12a61959bf13b465f95bec92c9f9f',
    coreWorkflowRun: 30321900139,
    coreWorkflowJob: 90159329413,
    coreArtifactId: 8674301060,
    coreArtifactDigest: 'sha256:11183c135cc498d762d0fbec25a9b69208b69e1034de1c8374481a1fbad75c0d',
    automaticRegistryPreflightRun: 30321900117,
    passReceiptPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p3.pass-closed.receipt.json',
    passReceiptGitBlob: 'dbc4f8cb32b33b9cb17567abc9e55e59fe394afd'
  }),
  boundaries: freeze({
    previewFilesMaterialized: true,
    deploymentConfigurationCreated: true,
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
  nextCheckpoint: 'RUN_8E_R3F2_P4_IMMUTABLE_PREVIEW_PUBLICATION_OCCURRENCE',
  stoppingBoundary: 'STOP_BEFORE_FIRST_NETWORK_PUBLICATION'
});

export function evaluateHEarthRun8ER3F2P3Control(candidate = H_EARTH_RUN_8E_R3F2_P3_CONTROL) {
  const issues = [];
  const p2 = evaluateHEarthRun8ER3F2P2Control();
  if (p2.eligible !== true || p2.status !== 'RUN_8E_R3F2_P2_PASS_CLOSED') issues.push(...p2.issues.map((issue) => `P2:${issue}`), 'P2_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3F2_P3_CONTROL_ID) issues.push('P3_CONTROL_ID_MISMATCH');
  if (!['CONFIGURATION_COMPLETE_PENDING_DURABLE_RECEIPT','PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('P3_STATUS_INVALID');
  if (candidate?.baseExactHead !== '75ecf5ad0b618318aea384c9422591425320de8f') issues.push('P3_BASE_HEAD_MISMATCH');
  if (candidate?.predecessor?.passReceiptGitBlob !== '203f960330da70e2947082ac356586caa5e166f0') issues.push('P2_RECEIPT_BLOB_MISMATCH');
  const publication = candidate?.publicationConfiguration ?? {};
  if (publication.provider !== 'CLOUDFLARE_PAGES_DIRECT_UPLOAD' || publication.directUploadOnly !== true || publication.gitIntegrationAllowed !== false) issues.push('P3_PROVIDER_CONFIGURATION_INVALID');
  if (publication.projectName !== 'h-earth-run8e-r3f2-preview-30201543' || publication.productionBranchSentinel === publication.previewBranch) issues.push('P3_PROJECT_OR_BRANCH_ISOLATION_INVALID');
  if (publication.workflowTrigger !== 'WORKFLOW_DISPATCH_ONLY' || publication.publicationBranch !== 'agent/h-earth-run8e-r3f2-p4-immutable-preview-publication-001') issues.push('P3_PUBLICATION_GATE_INVALID');
  if (publication.uniqueDeploymentUrlRequired !== true || publication.branchAliasAcceptedAsEvidenceUrl !== false) issues.push('P3_IMMUTABLE_URL_LAW_INVALID');
  if (publication.customDomainAttachmentAllowed !== false || publication.liveDomainRouteBindingAllowed !== false) issues.push('P3_LIVE_ROUTE_ISOLATION_INVALID');
  const delivery = candidate?.deliveryConfiguration ?? {};
  if (delivery.httpsRequired !== true || delivery.cacheControl !== 'public, max-age=31536000, immutable' || delivery.xRobotsTag !== 'noindex, nofollow, noarchive') issues.push('P3_DELIVERY_HEADERS_INVALID');
  if (delivery.serviceWorkerAllowed !== false || delivery.mixedContentAllowed !== false || delivery.externalRuntimeRequestCountAllowed !== 0 || delivery.mutableMainDependencyCountAllowed !== 0) issues.push('P3_RUNTIME_DRIFT_LAW_INVALID');
  if (!Array.isArray(candidate?.exactSourceTree) || candidate.exactSourceTree.length !== 3 || candidate.exactSourceTree[0]?.contentSha256 !== candidate?.candidateIdentity?.packageSha256) issues.push('P3_EXACT_SOURCE_TREE_INVALID');
  if (Object.values(candidate?.passCriteria ?? {}).some((value) => value !== true)) issues.push('P3_PASS_CRITERIA_INVALID');
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    const closure = candidate?.closureEvidence ?? {};
    if (closure.coreHead !== 'a31a059759e12a61959bf13b465f95bec92c9f9f') issues.push('P3_CORE_HEAD_MISMATCH');
    if (closure.coreWorkflowRun !== 30321900139 || closure.coreWorkflowJob !== 90159329413) issues.push('P3_CORE_WORKFLOW_IDENTITY_MISMATCH');
    if (closure.coreArtifactId !== 8674301060 || closure.coreArtifactDigest !== 'sha256:11183c135cc498d762d0fbec25a9b69208b69e1034de1c8374481a1fbad75c0d') issues.push('P3_CORE_ARTIFACT_IDENTITY_MISMATCH');
    if (closure.automaticRegistryPreflightRun !== 30321900117) issues.push('P3_PREFLIGHT_IDENTITY_MISMATCH');
    if (closure.passReceiptPath !== '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p3.pass-closed.receipt.json' || closure.passReceiptGitBlob !== 'dbc4f8cb32b33b9cb17567abc9e55e59fe394afd') issues.push('P3_PASS_RECEIPT_IDENTITY_MISMATCH');
  }
  if (candidate?.boundaries?.previewFilesMaterialized !== true || candidate?.boundaries?.deploymentConfigurationCreated !== true) issues.push('P3_CONFIGURATION_BOUNDARY_INVALID');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (!['previewFilesMaterialized','deploymentConfigurationCreated'].includes(key) && value !== false) issues.push(`P3_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3F2_P4_IMMUTABLE_PREVIEW_PUBLICATION_OCCURRENCE') issues.push('P3_NEXT_CHECKPOINT_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_FIRST_NETWORK_PUBLICATION') issues.push('P3_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3F2_P3_PASS_CLOSED' : 'RUN_8E_R3F2_P3_CONFIGURATION_COMPLETE_PENDING_DURABLE_RECEIPT')
      : 'RUN_8E_R3F2_P3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3F2_P3_CONTROL;
