const freeze = (value) => Object.freeze(value);

export const H_EARTH_RUN_8E_R3_CONTRACT_ID = 'H_EARTH_RUN_8E_R3_LIVE_GPU_PRESENTATION_RECOVERY_v1';

export const H_EARTH_RUN_8E_R3_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3',
  predecessor: freeze({
    run8ER3D: 'PASS_CLOSED',
    run8ER3E1: 'PASS_CLOSED',
    r3E1FinalExactHead: '4d1692cb3f1555833bef7864a3f6ebc998b86a17',
    r3E1FinalWorkflowRun: 30305608308,
    r3E1FinalWorkflowJob: 90109013296,
    r3E1FinalEvidenceArtifact: 8668297147,
    r3E1FinalEvidenceArtifactDigest: 'sha256:38386acc14bc140c5a97e5f3240a9312bfc489a361442b417adb7e5552770773',
    r3E1PassReceiptGitBlob: '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5',
    run8E: 'FAIL_OPEN'
  }),
  boundedSubcheckpoints: freeze([
    freeze({ checkpointId: 'RUN_8E_R3A', currentStatus: 'PASS_CLOSED' }),
    freeze({ checkpointId: 'RUN_8E_R3B', currentStatus: 'PASS_CLOSED' }),
    freeze({ checkpointId: 'RUN_8E_R3C', currentStatus: 'PASS_CLOSED' }),
    freeze({ checkpointId: 'RUN_8E_R3D', currentStatus: 'PASS_CLOSED' }),
    freeze({
      checkpointId: 'RUN_8E_R3E',
      currentStatus: 'IN_PROGRESS',
      boundedSubcheckpoints: freeze([
        freeze({
          checkpointId: 'RUN_8E_R3E1',
          currentStatus: 'PASS_CLOSED',
          finalExactHead: '4d1692cb3f1555833bef7864a3f6ebc998b86a17',
          passReceiptGitBlob: '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5'
        }),
        freeze({
          checkpointId: 'RUN_8E_R3E2',
          name: 'BRANCH_LOCAL_PUBLIC_LIVE_GPU_COMPOSITION',
          currentStatus: 'EXECUTION_PENDING',
          exactPublicMutationPathCount: 2,
          stoppingBoundary: 'STOP_BEFORE_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_R3E3'
        }),
        freeze({ checkpointId: 'RUN_8E_R3E3', currentStatus: 'NOT_STARTED' }),
        freeze({ checkpointId: 'RUN_8E_R3E4', currentStatus: 'NOT_STARTED' }),
        freeze({ checkpointId: 'RUN_8E_R3E5', currentStatus: 'NOT_STARTED' })
      ])
    }),
    freeze({ checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' }),
    freeze({ checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' })
  ]),
  currentState: freeze({
    run8ER3: 'OPEN_AT_R3E2_EXECUTION',
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'IN_PROGRESS',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'EXECUTION_PENDING',
    run8ER3E3: 'NOT_STARTED',
    run8ER3E4: 'NOT_STARTED',
    run8ER3E5: 'NOT_STARTED',
    run8ER3F: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  }),
  boundaries: freeze({
    exactDeclaredPublicMutationAuthorized: true,
    publicHtmlLoadOrderMutationAuthorized: true,
    publicGpuOrchestratorCreationAuthorized: true,
    undeclaredShowroomMutation: false,
    protectedWitnessMutation: false,
    admittedAuthorityMutation: false,
    browserExecution: false,
    gpuExecution: false,
    authorityExclusivityAcceptance: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3E3Work: false,
    mainMerge: false,
    run8EPassClosed: false
  })
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3E = checkpoints[4];
  const stages = r3E?.boundedSubcheckpoints ?? [];
  const r3E1 = stages[0];
  const r3E2 = stages[1];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER3D !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E1 !== 'PASS_CLOSED') issues.push('R3E1_PREDECESSOR_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3E1FinalExactHead !== '4d1692cb3f1555833bef7864a3f6ebc998b86a17') issues.push('R3E1_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3E1FinalEvidenceArtifactDigest !== 'sha256:38386acc14bc140c5a97e5f3240a9312bfc489a361442b417adb7e5552770773') issues.push('R3E1_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.r3E1PassReceiptGitBlob !== '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5') issues.push('R3E1_PASS_RECEIPT_BLOB_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3E_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3D_NOT_PASS_CLOSED');
  if (r3E?.currentStatus !== 'IN_PROGRESS' || r3E1?.currentStatus !== 'PASS_CLOSED') issues.push('R3E1_NOT_PASS_CLOSED');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(r3E2?.currentStatus)) issues.push('R3E2_STATE_INVALID');
  if (stages.slice(2).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3E_STAGE_STARTED');
  if (checkpoints.slice(5).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('R3F_OR_R3G_STARTED');
  if (r3E2?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E2_EXECUTION' || candidate?.currentState?.run8ER3E2 !== 'EXECUTION_PENDING') issues.push('R3E2_PARENT_EXECUTION_STATE_INVALID');
  } else if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E3_BOUNDARY' || candidate?.currentState?.run8ER3E3 !== 'NOT_STARTED') {
    issues.push('R3E3_PARENT_BOUNDARY_INVALID');
  }
  for (const key of ['exactDeclaredPublicMutationAuthorized','publicHtmlLoadOrderMutationAuthorized','publicGpuOrchestratorCreationAuthorized']) if (candidate?.boundaries?.[key] !== true) issues.push(`R3E2_AUTHORIZATION_MISSING:${key}`);
  for (const key of ['undeclaredShowroomMutation','protectedWitnessMutation','admittedAuthorityMutation','browserExecution','gpuExecution','authorityExclusivityAcceptance','deployment','physicalDeviceAcceptance','r3E3Work','mainMerge','run8EPassClosed']) if (candidate?.boundaries?.[key] !== false) issues.push(`R3E2_BOUNDARY_VIOLATION:${key}`);
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3E2?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E2_PARENT_PASS_CLOSED' : 'RUN_8E_R3E2_PARENT_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
