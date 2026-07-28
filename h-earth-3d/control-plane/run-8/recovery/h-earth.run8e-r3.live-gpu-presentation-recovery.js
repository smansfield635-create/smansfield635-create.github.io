const freeze = (value) => Object.freeze(value);

export const H_EARTH_RUN_8E_R3_CONTRACT_ID = 'H_EARTH_RUN_8E_R3_LIVE_GPU_PRESENTATION_RECOVERY_v1';

export const H_EARTH_RUN_8E_R3_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3',
  predecessor: freeze({
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'PASS_CLOSED',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'PASS_CLOSED',
    run8ER3E3: 'PASS_CLOSED',
    run8ER3E4: 'PASS_CLOSED',
    run8ER3E5: 'PASS_CLOSED',
    run8ER3F1: 'PASS_CLOSED',
    r3F1FinalExactHead: '3642f3a561d787d37d988a8a66f2270d0b13bd45',
    r3F1FinalWorkflowRun: 30314790631,
    r3F1FinalWorkflowJob: 90137966794,
    r3F1FinalEvidenceArtifact: 8671739669,
    r3F1FinalEvidenceArtifactDigest: 'sha256:02bfb0feeccfc9584ac4eada6f3fb288adbe2cdd5dfb41644e86438aeb1b55bc',
    r3F1PassReceiptGitBlob: 'd8b5f3b4626014af6b62362d1bac26e120f50e60',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    run8E: 'FAIL_OPEN'
  }),
  boundedSubcheckpoints: freeze([
    freeze({ checkpointId: 'RUN_8E_R3A', currentStatus: 'PASS_CLOSED' }),
    freeze({ checkpointId: 'RUN_8E_R3B', currentStatus: 'PASS_CLOSED' }),
    freeze({ checkpointId: 'RUN_8E_R3C', currentStatus: 'PASS_CLOSED' }),
    freeze({ checkpointId: 'RUN_8E_R3D', currentStatus: 'PASS_CLOSED' }),
    freeze({
      checkpointId: 'RUN_8E_R3E',
      currentStatus: 'PASS_CLOSED',
      boundedSubcheckpoints: freeze([
        freeze({ checkpointId: 'RUN_8E_R3E1', currentStatus: 'PASS_CLOSED', passReceiptGitBlob: '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5' }),
        freeze({ checkpointId: 'RUN_8E_R3E2', currentStatus: 'PASS_CLOSED', passReceiptGitBlob: 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5' }),
        freeze({ checkpointId: 'RUN_8E_R3E3', currentStatus: 'PASS_CLOSED', passReceiptGitBlob: '5c5f1ae06220f88f497dc2b45f4d749679849918' }),
        freeze({ checkpointId: 'RUN_8E_R3E4', currentStatus: 'PASS_CLOSED', passReceiptGitBlob: '7b2db7ed51a345edea88ad8a1288db4db150201d' }),
        freeze({ checkpointId: 'RUN_8E_R3E5', currentStatus: 'PASS_CLOSED', passReceiptGitBlob: 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00' })
      ])
    }),
    freeze({
      checkpointId: 'RUN_8E_R3F',
      currentStatus: 'IN_PROGRESS',
      boundedSubcheckpoints: freeze([
        freeze({
          checkpointId: 'RUN_8E_R3F1',
          currentStatus: 'PASS_CLOSED',
          finalExactHead: '3642f3a561d787d37d988a8a66f2270d0b13bd45',
          workflowRun: 30314790631,
          workflowJob: 90137966794,
          artifactId: 8671739669,
          artifactDigest: 'sha256:02bfb0feeccfc9584ac4eada6f3fb288adbe2cdd5dfb41644e86438aeb1b55bc',
          passReceiptGitBlob: 'd8b5f3b4626014af6b62362d1bac26e120f50e60'
        }),
        freeze({ checkpointId: 'RUN_8E_R3F2', currentStatus: 'PREVIEW_CONSTRUCTION_PENDING' }),
        freeze({ checkpointId: 'RUN_8E_R3F3', currentStatus: 'NOT_STARTED' }),
        freeze({ checkpointId: 'RUN_8E_R3F4', currentStatus: 'NOT_STARTED' })
      ])
    }),
    freeze({ checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' })
  ]),
  currentState: freeze({
    run8ER3: 'OPEN_AT_R3F2_PREVIEW_CONSTRUCTION',
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'PASS_CLOSED',
    run8ER3F: 'IN_PROGRESS',
    run8ER3F1: 'PASS_CLOSED',
    run8ER3F2: 'PREVIEW_CONSTRUCTION_PENDING',
    run8ER3F3: 'NOT_STARTED',
    run8ER3F4: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  }),
  authorizations: freeze({
    signedOfflinePackageConstruction: true,
    supplementalLoopbackAndFileBrowserValidation: true,
    physicalEvidenceLauncherConstruction: true,
    repositoryCustody: true
  }),
  boundaries: freeze({
    showroomMutation: false,
    publicRouteMutation: false,
    publicRuntimeMutation: false,
    physicalReferenceDeviceAcceptance: false,
    broaderMobileAcceptance: false,
    productionDeployment: false,
    promotion: false,
    r3F3Execution: false,
    r3F4Execution: false,
    r3GWork: false,
    mainMerge: false,
    run8EPassClosed: false
  })
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3E = checkpoints[4];
  const r3F = checkpoints[5];
  const r3FStages = r3F?.boundedSubcheckpoints ?? [];
  const r3F1 = r3FStages[0];
  const r3F2 = r3FStages[1];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  for (const key of ['run8ER3D','run8ER3E','run8ER3E1','run8ER3E2','run8ER3E3','run8ER3E4','run8ER3E5','run8ER3F1']) if (candidate?.predecessor?.[key] !== 'PASS_CLOSED') issues.push(`R3F2_PREDECESSOR_NOT_PASS_CLOSED:${key}`);
  if (candidate?.predecessor?.r3F1FinalExactHead !== '3642f3a561d787d37d988a8a66f2270d0b13bd45') issues.push('R3F1_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3F1FinalEvidenceArtifactDigest !== 'sha256:02bfb0feeccfc9584ac4eada6f3fb288adbe2cdd5dfb41644e86438aeb1b55bc') issues.push('R3F1_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.r3F1PassReceiptGitBlob !== 'd8b5f3b4626014af6b62362d1bac26e120f50e60') issues.push('R3F1_PASS_RECEIPT_BLOB_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || r3FStages.length !== 4) issues.push('R3_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3D_NOT_PASS_CLOSED');
  if (r3E?.currentStatus !== 'PASS_CLOSED') issues.push('R3E_NOT_PASS_CLOSED');
  if (r3F?.currentStatus !== 'IN_PROGRESS') issues.push('R3F_NOT_IN_PROGRESS');
  if (r3F1?.currentStatus !== 'PASS_CLOSED' || r3F1?.passReceiptGitBlob !== 'd8b5f3b4626014af6b62362d1bac26e120f50e60') issues.push('R3F1_CUSTODY_INVALID');
  if (!['PREVIEW_CONSTRUCTION_PENDING','PREVIEW_READY_PHYSICAL_EXECUTION_PENDING','PASS_CLOSED'].includes(r3F2?.currentStatus)) issues.push('R3F2_STATE_INVALID');
  if (r3FStages.slice(2).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('R3F3_R3F4_STARTED_EARLY');
  if (checkpoints[6]?.currentStatus !== 'NOT_STARTED') issues.push('R3G_STARTED_EARLY');
  if (r3F2?.currentStatus === 'PREVIEW_CONSTRUCTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3F2_PREVIEW_CONSTRUCTION' || candidate?.currentState?.run8ER3F2 !== 'PREVIEW_CONSTRUCTION_PENDING') issues.push('R3F2_PREVIEW_PARENT_STATE_INVALID');
  } else if (r3F2?.currentStatus === 'PREVIEW_READY_PHYSICAL_EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3F2_PHYSICAL_EXECUTION' || candidate?.currentState?.run8ER3F2 !== 'PREVIEW_READY_PHYSICAL_EXECUTION_PENDING') issues.push('R3F2_PHYSICAL_PENDING_PARENT_STATE_INVALID');
  }
  if (Object.values(candidate?.authorizations ?? {}).some((value) => value !== true)) issues.push('R3F2_AUTHORIZATION_INCOMPLETE');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3F2_BOUNDARY_VIOLATION:${key}`);
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3F2?.currentStatus === 'PREVIEW_CONSTRUCTION_PENDING'
          ? 'RUN_8E_R3F2_PARENT_PREVIEW_CONSTRUCTION_ELIGIBLE'
          : r3F2?.currentStatus === 'PREVIEW_READY_PHYSICAL_EXECUTION_PENDING'
            ? 'RUN_8E_R3F2_PARENT_PREVIEW_READY_PHYSICAL_EXECUTION_PENDING'
            : 'RUN_8E_R3F2_PARENT_PASS_CLOSED')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
