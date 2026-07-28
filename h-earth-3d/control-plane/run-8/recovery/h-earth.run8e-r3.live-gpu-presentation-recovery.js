const freeze = (value) => Object.freeze(value);

export const H_EARTH_RUN_8E_R3_CONTRACT_ID = 'H_EARTH_RUN_8E_R3_LIVE_GPU_PRESENTATION_RECOVERY_v1';

export const H_EARTH_RUN_8E_R3_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3',
  predecessor: freeze({
    run8ER3D: 'PASS_CLOSED',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'PASS_CLOSED',
    run8ER3E3: 'PASS_CLOSED',
    run8ER3E4: 'PASS_CLOSED',
    r3E4FinalExactHead: '6af68581b5c2d7a2528eedfb34efdfdbbf9aa1b3',
    r3E4FinalWorkflowRun: 30311974503,
    r3E4FinalWorkflowJob: 90129371765,
    r3E4FinalEvidenceArtifact: 8670730850,
    r3E4FinalEvidenceArtifactDigest: 'sha256:30e379f603867ff36162d7332812e0bacd8a7e35b31c4d67b04e4d17e277e157',
    r3E4PassReceiptGitBlob: '7b2db7ed51a345edea88ad8a1288db4db150201d',
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
        freeze({
          checkpointId: 'RUN_8E_R3E4',
          currentStatus: 'PASS_CLOSED',
          finalExactHead: '6af68581b5c2d7a2528eedfb34efdfdbbf9aa1b3',
          passReceiptGitBlob: '7b2db7ed51a345edea88ad8a1288db4db150201d',
          publicRuntimeAuthorityExclusivity: 'PRESERVED',
          publicDirectManipulationAcceptance: 'PASS',
          publicSustainedInteractionAcceptance: 'PASS'
        }),
        freeze({
          checkpointId: 'RUN_8E_R3E5',
          currentStatus: 'PASS_CLOSED',
          coreExecutionHead: 'a15b0bfd5e0e41feb58278ead324af25cb895b79',
          workflowRun: 30313213795,
          workflowJob: 90133161723,
          artifactId: 8671168282,
          artifactDigest: 'sha256:15556602decf44f2af92aabdc91f4677bbe25f863cf7bc8cb1be0372c34f47f3',
          artifactFetchBackVerified: true,
          r3FInputDisposition: 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT',
          stoppingBoundary: 'STOP_BEFORE_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE_R3F'
        })
      ])
    }),
    freeze({ checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' }),
    freeze({ checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' })
  ]),
  currentState: freeze({
    run8ER3: 'OPEN_AT_R3F_BOUNDARY',
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'PASS_CLOSED',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'PASS_CLOSED',
    run8ER3E3: 'PASS_CLOSED',
    run8ER3E4: 'PASS_CLOSED',
    run8ER3E5: 'PASS_CLOSED',
    run8ER3F: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  }),
  authorizations: freeze({
    r3EClosureReconciliation: true,
    r3FInputDecision: true,
    repositoryCustody: true
  }),
  boundaries: freeze({
    showroomMutation: false,
    publicRouteMutation: false,
    publicRuntimeMutation: false,
    browserExecution: false,
    gpuExecution: false,
    referenceDeviceAcceptance: false,
    broaderMobileAcceptance: false,
    r3FExecution: false,
    deployment: false,
    promotion: false,
    mainMerge: false,
    run8EPassClosed: false
  })
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3E = checkpoints[4];
  const stages = r3E?.boundedSubcheckpoints ?? [];
  const r3E5 = stages[4];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  for (const key of ['run8ER3D','run8ER3E1','run8ER3E2','run8ER3E3','run8ER3E4']) if (candidate?.predecessor?.[key] !== 'PASS_CLOSED') issues.push(`R3E5_PREDECESSOR_NOT_PASS_CLOSED:${key}`);
  if (candidate?.predecessor?.r3E4FinalExactHead !== '6af68581b5c2d7a2528eedfb34efdfdbbf9aa1b3') issues.push('R3E4_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3E4FinalEvidenceArtifactDigest !== 'sha256:30e379f603867ff36162d7332812e0bacd8a7e35b31c4d67b04e4d17e277e157') issues.push('R3E4_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.r3E4PassReceiptGitBlob !== '7b2db7ed51a345edea88ad8a1288db4db150201d') issues.push('R3E4_PASS_RECEIPT_BLOB_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3E_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3D_NOT_PASS_CLOSED');
  if (stages.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3E1_R3E4_NOT_PASS_CLOSED');
  if (!['EXECUTION_PENDING','PASS_CLOSED'].includes(r3E5?.currentStatus)) issues.push('R3E5_STATE_INVALID');
  if (checkpoints[5]?.currentStatus !== 'NOT_STARTED' || checkpoints[6]?.currentStatus !== 'NOT_STARTED') issues.push('R3F_OR_R3G_STARTED');
  if (r3E5?.currentStatus === 'EXECUTION_PENDING') {
    if (r3E?.currentStatus !== 'IN_PROGRESS' || candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E5_EXECUTION' || candidate?.currentState?.run8ER3E5 !== 'EXECUTION_PENDING') issues.push('R3E5_PARENT_EXECUTION_STATE_INVALID');
  } else {
    if (r3E?.currentStatus !== 'PASS_CLOSED' || candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3F_BOUNDARY' || candidate?.currentState?.run8ER3E !== 'PASS_CLOSED' || candidate?.currentState?.run8ER3E5 !== 'PASS_CLOSED') issues.push('R3E5_PARENT_PASS_STATE_INVALID');
    if (r3E5?.coreExecutionHead !== 'a15b0bfd5e0e41feb58278ead324af25cb895b79' || r3E5?.workflowRun !== 30313213795 || r3E5?.workflowJob !== 90133161723 || r3E5?.artifactId !== 8671168282 || r3E5?.artifactFetchBackVerified !== true) issues.push('R3E5_PARENT_CORE_EVIDENCE_INVALID');
    if (r3E5?.artifactDigest !== 'sha256:15556602decf44f2af92aabdc91f4677bbe25f863cf7bc8cb1be0372c34f47f3') issues.push('R3E5_PARENT_ARTIFACT_DIGEST_INVALID');
    if (r3E5?.r3FInputDisposition !== 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT') issues.push('R3F_INPUT_NOT_ADMISSIBLE');
  }
  if (Object.values(candidate?.authorizations ?? {}).some((value) => value !== true)) issues.push('R3E5_AUTHORIZATION_INCOMPLETE');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3E5_BOUNDARY_VIOLATION:${key}`);
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3E5?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E5_PARENT_PASS_CLOSED' : 'RUN_8E_R3E5_PARENT_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
