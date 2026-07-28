import { evaluateHEarthRun8ER3F2P3Control } from './h-earth.run8e-r3f2-p3.non-production-publication-configuration.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3F2_P3C_CONTROL_ID =
  'H_EARTH_RUN_8E_R3F2_P3C_EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION_v1';

export const H_EARTH_RUN_8E_R3F2_P3C_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3F2_P3C_CONTROL_ID,
  checkpointId: 'RUN_8E_R3F2_P3C',
  checkpointName: 'EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION',
  currentStatus: 'PASS_CLOSED',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3f2-p3c-executable-publication-trigger-correction-001',
  baseBranch: 'agent/h-earth-run8e-r3f2-p3-non-production-publication-configuration-001',
  baseExactHead: 'a5fb1b70071a470e3b7aeb80957014c638f8ae14',
  predecessor: freeze({
    checkpointId: 'RUN_8E_R3F2_P3',
    status: 'PASS_CLOSED',
    exactHead: 'a5fb1b70071a470e3b7aeb80957014c638f8ae14',
    pullRequest: 255,
    passReceiptPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p3.pass-closed.receipt.json',
    passReceiptGitBlob: 'dbc4f8cb32b33b9cb17567abc9e55e59fe394afd'
  }),
  defect: freeze({
    defectId: 'R3F2_P3_WORKFLOW_DISPATCH_DEFAULT_BRANCH_EXECUTABILITY_DEFECT',
    finding: 'WORKFLOW_DISPATCH_ONLY_TRIGGER_CANNOT_RUN_WHILE_WORKFLOW_EXISTS_ONLY_IN_UNMERGED_RECOVERY_STACK',
    candidatePackageDefectEstablished: false,
    cloudflareConfigurationDefectEstablished: false,
    publicationOccurred: false,
    mainMutationRequired: false
  }),
  correctedTrigger: freeze({
    event: 'push',
    branch: 'agent/h-earth-run8e-r3f2-p4-immutable-preview-publication-001',
    authorizationPath: 'h-earth-3d/deployment/run-8e-r3f2/h-earth.run8e-r3f2-p4.publication-authorization.json',
    exactAuthorizationSha256: 'sha256:fcec8433e8ce995065abd617eba4382f6183227c31f425afa6773efdb7ac66bd',
    exactAuthorizationGitBlob: 'be55de54f562278927472d961bfca89e20d3d590',
    requiredChangedPathCount: 1,
    p3CorrectionReceiptRequiredInParent: true,
    publicationWorkflowSingleUseIntent: true,
    defaultBranchWorkflowRequired: false
  }),
  preservedConfiguration: freeze({
    provider: 'CLOUDFLARE_PAGES_DIRECT_UPLOAD',
    projectName: 'h-earth-run8e-r3f2-preview-30201543',
    productionBranchSentinel: 'production-disabled-r3f2',
    previewBranch: 'r3f2-candidate-3020154361523cf1',
    uniqueDeploymentUrlRequired: true,
    branchAliasAcceptedAsEvidenceUrl: false,
    customDomainAttachmentAllowed: false,
    liveDomainRouteBindingAllowed: false,
    gitIntegrationAllowed: false,
    exactPreviewFileCount: 3,
    packageSha256: 'sha256:3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234'
  }),
  authorizedWork: freeze([
    'REPLACE_NON_EXECUTABLE_WORKFLOW_DISPATCH_WITH_EXACT_AUTHORIZATION_PUSH_TRIGGER',
    'BIND_EXACT_P4_AUTHORIZATION_FILE_IDENTITY',
    'REQUIRE_P3C_RECEIPT_IN_AUTHORIZATION_COMMIT_PARENT',
    'PRESERVE_CLOUDFLARE_PAGES_AND_IMMUTABLE_URL_CONFIGURATION'
  ]),
  prohibitedWork: freeze([
    'NETWORK_PUBLICATION','PAGES_PROJECT_CREATION','ASSET_UPLOAD','PREVIEW_URL_ISSUANCE',
    'SHOWROOM_MUTATION','PUBLIC_LIVE_H_EARTH_CHANGE','MAIN_MUTATION','RECOVERY_STACK_MERGE',
    'PRODUCTION_DEPLOYMENT','CUSTOM_DOMAIN_BINDING','HOSTED_BROWSER_VALIDATION',
    'PHYSICAL_REFERENCE_DEVICE_EXECUTION','R3F3_WORK','R3F4_WORK','R3G_WORK','RUN_8E_PASS_CLOSED'
  ]),
  closureEvidence: freeze({
    coreHead: '828aaa730fccc4d449896b8a42288dbf3df9d476',
    coreWorkflowRun: 30322920026,
    coreWorkflowJob: 90162334174,
    coreArtifactId: 8674634271,
    coreArtifactDigest: 'sha256:d3922d67de48c135d51530af23a0bc7a6790690cbae6592ff6dad461a348b959',
    passReceiptPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p3c.pass-closed.receipt.json',
    passReceiptGitBlob: '76fcfe93021084859f664e327ce5de60017c8c6c'
  }),
  boundaries: freeze({
    previewFilesMaterialized: true,
    deploymentConfigurationCreated: true,
    executablePublicationTriggerConfigured: true,
    pagesProjectCreated: false,
    networkPublicationPerformed: false,
    previewUrlIssued: false,
    showroomMutated: false,
    publicLiveHEarthChanged: false,
    mainChanged: false,
    recoveryStackMerged: false,
    productionDeployment: false,
    physicalReferenceDeviceExecuted: false,
    run8EPassClosed: false
  }),
  nextCheckpoint: 'RUN_8E_R3F2_P4_IMMUTABLE_PREVIEW_PUBLICATION_OCCURRENCE',
  stoppingBoundary: 'STOP_BEFORE_FIRST_NETWORK_PUBLICATION'
});

export function evaluateHEarthRun8ER3F2P3CControl(candidate = H_EARTH_RUN_8E_R3F2_P3C_CONTROL) {
  const issues = [];
  const p3 = evaluateHEarthRun8ER3F2P3Control();
  if (p3.eligible !== true || p3.status !== 'RUN_8E_R3F2_P3_PASS_CLOSED') issues.push('P3_NOT_PASS_CLOSED', ...p3.issues.map((issue) => `P3:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3F2_P3C_CONTROL_ID) issues.push('P3C_CONTROL_ID_MISMATCH');
  if (!['CORRECTION_EXECUTION_OPEN','PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('P3C_STATUS_INVALID');
  if (candidate?.baseExactHead !== 'a5fb1b70071a470e3b7aeb80957014c638f8ae14') issues.push('P3C_BASE_HEAD_MISMATCH');
  if (candidate?.predecessor?.passReceiptGitBlob !== 'dbc4f8cb32b33b9cb17567abc9e55e59fe394afd') issues.push('P3_RECEIPT_BLOB_MISMATCH');
  if (candidate?.defect?.candidatePackageDefectEstablished !== false || candidate?.defect?.publicationOccurred !== false) issues.push('P3C_DEFECT_CLASSIFICATION_INVALID');
  const trigger = candidate?.correctedTrigger ?? {};
  if (trigger.event !== 'push' || trigger.branch !== 'agent/h-earth-run8e-r3f2-p4-immutable-preview-publication-001') issues.push('P3C_TRIGGER_INVALID');
  if (trigger.exactAuthorizationSha256 !== 'sha256:fcec8433e8ce995065abd617eba4382f6183227c31f425afa6773efdb7ac66bd' || trigger.exactAuthorizationGitBlob !== 'be55de54f562278927472d961bfca89e20d3d590') issues.push('P3C_AUTHORIZATION_IDENTITY_INVALID');
  if (trigger.requiredChangedPathCount !== 1 || trigger.p3CorrectionReceiptRequiredInParent !== true) issues.push('P3C_ONE_SHOT_GATE_INVALID');
  if (candidate?.preservedConfiguration?.packageSha256 !== 'sha256:3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234') issues.push('P3C_PACKAGE_IDENTITY_DRIFT');
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    if (candidate?.closureEvidence?.passReceiptGitBlob !== '76fcfe93021084859f664e327ce5de60017c8c6c') issues.push('P3C_RECEIPT_BLOB_MISMATCH');
    if (candidate?.closureEvidence?.coreWorkflowRun !== 30322920026 || candidate?.closureEvidence?.coreWorkflowJob !== 90162334174) issues.push('P3C_CORE_WORKFLOW_IDENTITY_MISMATCH');
  }
  if (candidate?.boundaries?.executablePublicationTriggerConfigured !== true || candidate?.boundaries?.networkPublicationPerformed !== false || candidate?.boundaries?.mainChanged !== false) issues.push('P3C_BOUNDARY_INVALID');
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3F2_P4_IMMUTABLE_PREVIEW_PUBLICATION_OCCURRENCE') issues.push('P3C_NEXT_CHECKPOINT_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_FIRST_NETWORK_PUBLICATION') issues.push('P3C_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3F2_P3C_PASS_CLOSED' : 'RUN_8E_R3F2_P3C_CORRECTION_EXECUTION_OPEN')
      : 'RUN_8E_R3F2_P3C_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3F2_P3C_CONTROL;
