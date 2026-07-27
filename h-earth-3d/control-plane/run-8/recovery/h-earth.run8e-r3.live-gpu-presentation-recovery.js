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
    r3E3FinalExactHead: '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9',
    r3E3FinalWorkflowRun: 30308777252,
    r3E3FinalWorkflowJob: 90119266560,
    r3E3FinalEvidenceArtifact: 8669502472,
    r3E3FinalEvidenceArtifactDigest: 'sha256:279edc66dbbb5899529b707efff9cefe0958f5d1e911d1918964d1413dc833a2',
    r3E3PassReceiptGitBlob: '5c5f1ae06220f88f497dc2b45f4d749679849918',
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
      currentStatus: 'IN_PROGRESS',
      boundedSubcheckpoints: freeze([
        freeze({ checkpointId: 'RUN_8E_R3E1', currentStatus: 'PASS_CLOSED' }),
        freeze({ checkpointId: 'RUN_8E_R3E2', currentStatus: 'PASS_CLOSED' }),
        freeze({
          checkpointId: 'RUN_8E_R3E3',
          currentStatus: 'PASS_CLOSED',
          finalExactHead: '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9',
          passReceiptGitBlob: '5c5f1ae06220f88f497dc2b45f4d749679849918'
        }),
        freeze({
          checkpointId: 'RUN_8E_R3E4',
          name: 'PUBLIC_ROUTE_DIRECT_MANIPULATION_EXECUTION_AND_ACCEPTANCE',
          currentStatus: 'EXECUTION_PENDING',
          frameCoalescingPolicy: 'NONE_ONE_SYNCHRONOUS_FRAME_PER_ACCEPTED_PROPOSAL',
          publicSourceMutationAuthorized: false,
          stoppingBoundary: 'STOP_BEFORE_R3E_CLOSURE_AND_R3F_INPUT_DECISION_R3E5'
        }),
        freeze({ checkpointId: 'RUN_8E_R3E5', currentStatus: 'NOT_STARTED' })
      ])
    }),
    freeze({ checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' }),
    freeze({ checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' })
  ]),
  currentState: freeze({
    run8ER3: 'OPEN_AT_R3E4_EXECUTION',
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'IN_PROGRESS',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'PASS_CLOSED',
    run8ER3E3: 'PASS_CLOSED',
    run8ER3E4: 'EXECUTION_PENDING',
    run8ER3E5: 'NOT_STARTED',
    run8ER3F: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  }),
  executionState: freeze({
    browserExecutionAuthorized: true,
    gpuExecutionAuthorized: true,
    directManipulationExecutionAuthorized: true,
    sustainedInteractionExecutionAuthorized: true,
    portraitExecutionAuthorized: true,
    landscapeExecutionAuthorized: true,
    runtimeExclusivityReconfirmationAuthorized: true
  }),
  boundaries: freeze({
    publicSourceMutation: false,
    showroomMutation: false,
    sourcePatchInAcceptanceRun: false,
    referenceDeviceAcceptance: false,
    deployment: false,
    promotion: false,
    mainMerge: false,
    r3E5Work: false,
    r3FWork: false,
    run8EPassClosed: false
  })
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3E = checkpoints[4];
  const stages = r3E?.boundedSubcheckpoints ?? [];
  const r3E3 = stages[2];
  const r3E4 = stages[3];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER3D !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E1 !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E2 !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E3 !== 'PASS_CLOSED') issues.push('R3E3_PREDECESSOR_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3E3FinalExactHead !== '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9') issues.push('R3E3_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3E3FinalEvidenceArtifactDigest !== 'sha256:279edc66dbbb5899529b707efff9cefe0958f5d1e911d1918964d1413dc833a2') issues.push('R3E3_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.r3E3PassReceiptGitBlob !== '5c5f1ae06220f88f497dc2b45f4d749679849918') issues.push('R3E3_PASS_RECEIPT_BLOB_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3E_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3D_NOT_PASS_CLOSED');
  if (r3E?.currentStatus !== 'IN_PROGRESS' || stages.slice(0, 3).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3E1_R3E3_NOT_PASS_CLOSED');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED', 'FAIL_OPEN'].includes(r3E4?.currentStatus)) issues.push('R3E4_STATE_INVALID');
  if (stages[4]?.currentStatus !== 'NOT_STARTED') issues.push('R3E5_STARTED');
  if (checkpoints.slice(5).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('R3F_OR_R3G_STARTED');
  if (r3E4?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E4_EXECUTION' || candidate?.currentState?.run8ER3E4 !== 'EXECUTION_PENDING') issues.push('R3E4_PARENT_EXECUTION_STATE_INVALID');
  }
  if (r3E4?.frameCoalescingPolicy !== 'NONE_ONE_SYNCHRONOUS_FRAME_PER_ACCEPTED_PROPOSAL') issues.push('R3E4_FRAME_COALESCING_POLICY_INVALID');
  if (r3E4?.publicSourceMutationAuthorized !== false) issues.push('R3E4_PUBLIC_SOURCE_MUTATION_AUTHORIZED');
  if (Object.values(candidate?.executionState ?? {}).some((value) => value !== true)) issues.push('R3E4_EXECUTION_AUTHORIZATION_INCOMPLETE');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3E4_BOUNDARY_VIOLATION:${key}`);
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3E4?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E4_PARENT_PASS_CLOSED' : r3E4?.currentStatus === 'FAIL_OPEN' ? 'RUN_8E_R3E4_PARENT_FAIL_OPEN' : 'RUN_8E_R3E4_PARENT_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
