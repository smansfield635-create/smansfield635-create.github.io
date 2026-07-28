import { H_EARTH_RUN_8E_R3_CONTRACT_ID, evaluateHEarthRun8ER3Control } from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { H_EARTH_RUN_8E_R3F1_CONTROL } from './h-earth.run8e-r3f1.physical-mobile-acceptance-protocol.js';
import { evaluateHEarthRun8ER3FEvidenceContract } from './h-earth.run8e-r3f.physical-mobile-evidence-contract.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3F2_CONTROL_ID =
  'H_EARTH_RUN_8E_R3F2_REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION_v1';

export const H_EARTH_RUN_8E_R3F2_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3F2_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3F2',
  checkpointName: 'REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3f2-reference-device-physical-execution-001',
  baseBranch: 'agent/h-earth-run8e-r3f1-physical-mobile-acceptance-protocol-001',
  baseExactHead: '3642f3a561d787d37d988a8a66f2270d0b13bd45',
  currentStatus: 'PREVIEW_READY_PHYSICAL_EXECUTION_PENDING',
  predecessor: freeze({
    checkpointId: 'RUN_8E_R3F1', status: 'PASS_CLOSED', exactHead: '3642f3a561d787d37d988a8a66f2270d0b13bd45', pullRequest: 250,
    passReceiptPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f1.pass-closed.receipt.json',
    passReceiptGitBlob: 'd8b5f3b4626014af6b62362d1bac26e120f50e60',
    finalWorkflowRun: 30314790631, finalWorkflowJob: 90137966794, finalArtifactId: 8671739669,
    finalArtifactDigest: 'sha256:02bfb0feeccfc9584ac4eada6f3fb288adbe2cdd5dfb41644e86438aeb1b55bc'
  }),
  immutablePreview: freeze({
    transportClass: 'SIGNED_OFFLINE_PACKAGE',
    signatureClass: 'GIT_COMMIT_AND_SHA256_CONTENT_BINDING',
    routeSourceHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    builderPath: '/h-earth-3d/validation/h-earth.run8e-r3f2.signed-offline-package.builder.mjs',
    launcherTemplatePath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.html',
    launcherScriptPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.js',
    packageFilename: 'H_EARTH_RUN8E_R3F2_SIGNED_OFFLINE_REFERENCE_DEVICE_PACKAGE.html',
    previewPackageHead: 'fcdcb4e80a98a86773d5276447b880efde2099c9',
    packageSha256: 'sha256:3020154330597b877b59016399046279c511b32a875f5d4d87f5d651e2648e09',
    packageByteCount: 1213597,
    packageManifestSha256: 'sha256:c74d7438ba10f36deee567166a1a8654ee57ebfb2302a44d69c06238955e3626',
    loopbackValidationRequired: true,
    physicalFileExecutionAllowed: true,
    exactSourceIdentityRequired: true,
    productionDeployment: false
  }),
  failedAttemptCustody: freeze([
    freeze({ attemptId: 'RUN_8E_R3F2_PREVIEW_ATTEMPT_001', head: '3c4f9d4d985365dc74e740bca9bd9db2cbbb7442', workflowRun: 30315690708, workflowJob: 90140603432, artifactId: 8672061710, artifactDigest: 'sha256:0cbb9c6c28bb9ab4103cda3ec04b7563a3bc69e0b0355a4324bd34d9f73aa918', failureClass: 'HOSTED_LAUNCHER_NOT_RENDERED_AS_DOCUMENT', publicSourceDefectEstablished: false }),
    freeze({ attemptId: 'RUN_8E_R3F2_PREVIEW_ATTEMPT_002', head: '461c003ba5323e79f9c10eb901b230ad4f2edcbb', workflowRun: 30316181910, workflowJob: 90142097491, artifactId: 8672242272, artifactDigest: 'sha256:8e026e9d6e9f082f56f01b3a05e0d22a2db4da1e74a12021347e9ea773e8870b', failureClass: 'HOSTED_LAUNCHER_DOM_NOT_OBSERVED_AFTER_TEXT_HTML_RESPONSE', publicSourceDefectEstablished: false }),
    freeze({ attemptId: 'RUN_8E_R3F2_PREVIEW_ATTEMPT_003', head: '37dd0ca6331a74c0bf3e143586f292d98d59885e', workflowRun: 30316573748, workflowJob: 90143276958, artifactId: 8672384865, artifactDigest: 'sha256:fa339f348c7287acbd3d7d65b0195250c57d138019fe41157f71d1c198ca0795', failureClass: 'ALL_BOUNDED_EXTERNAL_HOST_CANDIDATES_FAILED_DOM_QUALIFICATION', publicSourceDefectEstablished: false }),
    freeze({ attemptId: 'RUN_8E_R3F2_PREVIEW_ATTEMPT_004', head: 'ca8c7581b4aa5e858bafcee33be52f9d6f043407', workflowRun: 30317274233, workflowJob: 90145435624, artifactId: 8672621878, artifactDigest: 'sha256:1ed10394547ab440baa319d03a4454f64ad742e93782c2045856a358ba81c6f3', failureClass: 'CROSS_REALM_CANVAS_INSTANCEOF_MISCLASSIFICATION', publicSourceDefectEstablished: false })
  ]),
  previewValidationEvidence: freeze({
    successfulValidationHead: 'fcdcb4e80a98a86773d5276447b880efde2099c9',
    workflowRun: 30317603086,
    workflowJob: 90146467936,
    artifactId: 8672743584,
    artifactDigest: 'sha256:f6ef339a26c79b70a1371a78ce941c410a2a406ee7bfad4e4c79b25b8ab1ac2d',
    automaticRepositoryRegistryPreflightRun: 30317603097,
    packageSha256: 'sha256:3020154330597b877b59016399046279c511b32a875f5d4d87f5d651e2648e09',
    packageByteCount: 1213597,
    packageManifestSha256: 'sha256:c74d7438ba10f36deee567166a1a8654ee57ebfb2302a44d69c06238955e3626',
    loopbackRouteApiReady: true,
    loopbackSameOriginAccess: true,
    fileRouteApiReady: true,
    fileSameOriginAccess: true,
    launcherInstrumentationReady: true,
    webCryptoAvailable: true,
    activeWebGL2ContextCount: 1,
    artifactFetchBackVerified: true,
    showroomMutationCount: 0,
    physicalDeviceExecutionCount: 0,
    productionDeploymentCount: 0
  }),
  physicalReferenceDeviceExecution: freeze({
    status: 'NOT_EXECUTED', deviceLaneId: 'R3F_REFERENCE_ANDROID_PHYSICAL',
    deviceRole: 'CURRENT_OFFICIAL_SAMSUNG_PHONE_PHYSICAL_REFERENCE_DEVICE_ONLY',
    evidenceClassRequired: 'PHYSICAL_LOCAL_OR_REMOTE_PHYSICAL', tenMinuteContinuousInteractionRequired: true,
    portraitAndLandscapeRequired: true, orientationTransitionRequired: true, backgroundReturnRequired: true,
    screenRecordingRequired: true, evidenceJsonRequired: true, acceptanceClaimIssued: false
  }),
  boundaries: freeze({
    showroomSourceMutation: false, publicRouteMutation: false, publicRuntimeMutation: false,
    productionDeployment: false, physicalReferenceDeviceAcceptance: false, broaderMobileAcceptance: false,
    r3F3Work: false, r3F4Work: false, r3GWork: false, promotion: false, mainMerge: false, run8EPassClosed: false
  }),
  nextState: 'RUN_8E_R3F2_PHYSICAL_EXECUTION_PENDING',
  stoppingBoundary: 'STOP_BEFORE_REFERENCE_DEVICE_PHYSICAL_EXECUTION_R3F2'
});

export function evaluateHEarthRun8ER3F2Control(candidate = H_EARTH_RUN_8E_R3F2_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const evidenceContract = evaluateHEarthRun8ER3FEvidenceContract();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (evidenceContract.eligible !== true) issues.push(...evidenceContract.issues.map((issue) => `EVIDENCE:${issue}`));
  if (H_EARTH_RUN_8E_R3F1_CONTROL.currentStatus !== 'PASS_CLOSED') issues.push('R3F1_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3F2_CONTROL_ID) issues.push('R3F2_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '3642f3a561d787d37d988a8a66f2270d0b13bd45') issues.push('R3F2_BASE_HEAD_MISMATCH');
  if (candidate?.predecessor?.passReceiptGitBlob !== 'd8b5f3b4626014af6b62362d1bac26e120f50e60') issues.push('R3F1_PASS_RECEIPT_BLOB_MISMATCH');
  if (!['PREVIEW_CONSTRUCTION_PENDING','PREVIEW_READY_PHYSICAL_EXECUTION_PENDING','PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3F2_STATUS_INVALID');
  const preview = candidate?.immutablePreview ?? {};
  if (preview.transportClass !== 'SIGNED_OFFLINE_PACKAGE' || preview.signatureClass !== 'GIT_COMMIT_AND_SHA256_CONTENT_BINDING') issues.push('R3F2_PREVIEW_TRANSPORT_INVALID');
  if (preview.routeSourceHead !== '548672ae99cd406805f0c8ca576cc650baf7ed18') issues.push('R3F2_ROUTE_SOURCE_HEAD_MISMATCH');
  if (preview.publicHtmlGitBlob !== '0daedf61f7e19af095f4db5fc47563a9cd786837' || preview.publicOrchestratorGitBlob !== '2b0a916b3a6d11da84316925f8abd8a3a1447445') issues.push('R3F2_PUBLIC_SOURCE_BLOB_MISMATCH');
  if (preview.loopbackValidationRequired !== true || preview.physicalFileExecutionAllowed !== true || preview.productionDeployment !== false) issues.push('R3F2_PACKAGE_BOUNDARY_INVALID');
  if ((candidate?.failedAttemptCustody ?? []).length !== 4 || candidate.failedAttemptCustody.some((entry) => entry.publicSourceDefectEstablished !== false)) issues.push('R3F2_FAILED_ATTEMPT_CUSTODY_INVALID');
  if (candidate?.currentStatus !== 'PREVIEW_CONSTRUCTION_PENDING') {
    if (!/^[0-9a-f]{40}$/.test(preview.previewPackageHead ?? '')) issues.push('R3F2_PREVIEW_PACKAGE_HEAD_MISSING');
    if (typeof preview.packageSha256 !== 'string' || !preview.packageSha256.startsWith('sha256:') || !Number.isSafeInteger(preview.packageByteCount)) issues.push('R3F2_PACKAGE_IDENTITY_MISSING');
    const execution = candidate?.previewValidationEvidence ?? {};
    if (!Number.isSafeInteger(execution.workflowRun) || !Number.isSafeInteger(execution.workflowJob) || !Number.isSafeInteger(execution.artifactId)) issues.push('R3F2_PREVIEW_WORKFLOW_IDENTITY_MISSING');
    if (execution.packageSha256 !== preview.packageSha256 || execution.packageManifestSha256 !== preview.packageManifestSha256 || execution.loopbackRouteApiReady !== true || execution.loopbackSameOriginAccess !== true || execution.fileRouteApiReady !== true || execution.fileSameOriginAccess !== true || execution.launcherInstrumentationReady !== true || execution.webCryptoAvailable !== true || execution.activeWebGL2ContextCount !== 1 || execution.artifactFetchBackVerified !== true) issues.push('R3F2_PACKAGE_VALIDATION_NOT_PASS');
  }
  if (candidate?.physicalReferenceDeviceExecution?.status !== 'NOT_EXECUTED' && candidate?.currentStatus !== 'PASS_CLOSED') issues.push('R3F2_PHYSICAL_EXECUTION_STATE_INVALID');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3F2_BOUNDARY_VIOLATION:${key}`);
  if (candidate?.nextState !== 'RUN_8E_R3F2_PHYSICAL_EXECUTION_PENDING') issues.push('R3F2_NEXT_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_REFERENCE_DEVICE_PHYSICAL_EXECUTION_R3F2') issues.push('R3F2_STOPPING_BOUNDARY_INVALID');
  return freeze({ eligible: issues.length === 0, status: issues.length === 0
    ? (candidate.currentStatus === 'PREVIEW_CONSTRUCTION_PENDING' ? 'RUN_8E_R3F2_PREVIEW_CONSTRUCTION_ELIGIBLE'
      : candidate.currentStatus === 'PREVIEW_READY_PHYSICAL_EXECUTION_PENDING' ? 'RUN_8E_R3F2_PREVIEW_READY_PHYSICAL_EXECUTION_PENDING' : 'RUN_8E_R3F2_PASS_CLOSED')
    : 'RUN_8E_R3F2_CONTROL_FAIL', issues });
}

export default H_EARTH_RUN_8E_R3F2_CONTROL;
