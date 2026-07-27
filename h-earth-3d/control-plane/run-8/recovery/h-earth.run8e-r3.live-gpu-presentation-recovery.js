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
          currentStatus: 'PASS_CLOSED',
          frameCoalescingPolicy: 'NONE_ONE_SYNCHRONOUS_FRAME_PER_ACCEPTED_PROPOSAL',
          publicSourceMutationAuthorized: false,
          coreExecutionEvidence: freeze({
            successfulExecutionHead: 'd99f883afb879756c398a3654e4a428f9dcfa3a1',
            workflowRun: 30311202411,
            workflowJob: 90126973627,
            artifactId: 8670441099,
            artifactDigest: 'sha256:ccc4c03763ee191f3675ab8fce7bb512cf4eb157277fde894b81bba76dbc3f41',
            browserSessionCount: 2,
            scheduledInteractionGroupCount: 48,
            acceptedNavigationProposalCount: 80,
            publicFramePacketUpdateCount: 80,
            publicVisibleGpuResponseCount: 80,
            portraitAcceptedProposalCount: 40,
            landscapeAcceptedProposalCount: 40,
            maximumTimerDeliveryLagMs: 0,
            maximumActionCompletionLagMs: 279.6000000000058,
            maximumSynchronousActionProcessingMs: 280,
            maximumGpuResponseMs: 177,
            maximumConcurrentCallbacks: 1,
            publicRuntimeAuthorityExclusivityPreserved: true,
            publicOneFingerLookPassed: true,
            publicTwoFingerTravelPassed: true,
            publicPinchZoomPassed: true,
            publicPortraitExecutionPassed: true,
            publicLandscapeExecutionPassed: true,
            publicSustainedInteractionPassed: true,
            flatBitmapDragging: false,
            worldRebuildDuringGesture: false,
            obsoleteInputBacklog: false
          }),
          stoppingBoundary: 'STOP_BEFORE_R3E_CLOSURE_AND_R3F_INPUT_DECISION_R3E5'
        }),
        freeze({ checkpointId: 'RUN_8E_R3E5', currentStatus: 'NOT_STARTED' })
      ])
    }),
    freeze({ checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' }),
    freeze({ checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' })
  ]),
  currentState: freeze({
    run8ER3: 'OPEN_AT_R3E5_BOUNDARY',
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'IN_PROGRESS',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'PASS_CLOSED',
    run8ER3E3: 'PASS_CLOSED',
    run8ER3E4: 'PASS_CLOSED',
    run8ER3E5: 'NOT_STARTED',
    run8ER3F: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  }),
  executionState: freeze({
    browserExecutionPerformed: true,
    gpuExecutionPerformed: true,
    directManipulationAcceptanceEstablished: true,
    sustainedInteractionAcceptanceEstablished: true,
    portraitExecutionPassed: true,
    landscapeExecutionPassed: true,
    runtimeExclusivityPreserved: true
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
  const r3E4 = stages[3];
  const evidence = r3E4?.coreExecutionEvidence ?? {};
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER3D !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E1 !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E2 !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E3 !== 'PASS_CLOSED') issues.push('R3E3_PREDECESSOR_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3E3FinalExactHead !== '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9') issues.push('R3E3_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3E3FinalEvidenceArtifactDigest !== 'sha256:279edc66dbbb5899529b707efff9cefe0958f5d1e911d1918964d1413dc833a2') issues.push('R3E3_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.r3E3PassReceiptGitBlob !== '5c5f1ae06220f88f497dc2b45f4d749679849918') issues.push('R3E3_PASS_RECEIPT_BLOB_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3E_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3D_NOT_PASS_CLOSED');
  if (r3E?.currentStatus !== 'IN_PROGRESS' || stages.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3E1_R3E4_NOT_PASS_CLOSED');
  if (stages[4]?.currentStatus !== 'NOT_STARTED') issues.push('R3E5_STARTED');
  if (checkpoints.slice(5).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('R3F_OR_R3G_STARTED');
  if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E5_BOUNDARY' || candidate?.currentState?.run8ER3E4 !== 'PASS_CLOSED' || candidate?.currentState?.run8ER3E5 !== 'NOT_STARTED') issues.push('R3E4_PARENT_PASS_STATE_INVALID');
  if (r3E4?.frameCoalescingPolicy !== 'NONE_ONE_SYNCHRONOUS_FRAME_PER_ACCEPTED_PROPOSAL') issues.push('R3E4_FRAME_COALESCING_POLICY_INVALID');
  if (r3E4?.publicSourceMutationAuthorized !== false) issues.push('R3E4_PUBLIC_SOURCE_MUTATION_AUTHORIZED');
  if (evidence.successfulExecutionHead !== 'd99f883afb879756c398a3654e4a428f9dcfa3a1' || evidence.workflowRun !== 30311202411 || evidence.workflowJob !== 90126973627 || evidence.artifactId !== 8670441099) issues.push('R3E4_CORE_EXECUTION_IDENTITY_MISMATCH');
  if (evidence.artifactDigest !== 'sha256:ccc4c03763ee191f3675ab8fce7bb512cf4eb157277fde894b81bba76dbc3f41') issues.push('R3E4_CORE_ARTIFACT_DIGEST_MISMATCH');
  if (evidence.browserSessionCount !== 2 || evidence.scheduledInteractionGroupCount !== 48 || evidence.acceptedNavigationProposalCount !== 80 || evidence.publicFramePacketUpdateCount !== 80 || evidence.publicVisibleGpuResponseCount !== 80) issues.push('R3E4_CORE_CORRESPONDENCE_COUNTS_INVALID');
  if (evidence.maximumTimerDeliveryLagMs >= 2000 || evidence.maximumActionCompletionLagMs >= 2000 || evidence.maximumSynchronousActionProcessingMs >= 1000 || evidence.maximumConcurrentCallbacks !== 1) issues.push('R3E4_CORE_TIMING_INVALID');
  for (const key of ['publicRuntimeAuthorityExclusivityPreserved','publicOneFingerLookPassed','publicTwoFingerTravelPassed','publicPinchZoomPassed','publicPortraitExecutionPassed','publicLandscapeExecutionPassed','publicSustainedInteractionPassed']) if (evidence[key] !== true) issues.push(`R3E4_CORE_ACCEPTANCE_MISSING:${key}`);
  for (const key of ['flatBitmapDragging','worldRebuildDuringGesture','obsoleteInputBacklog']) if (evidence[key] !== false) issues.push(`R3E4_CORE_PROHIBITED_RESULT:${key}`);
  if (Object.values(candidate?.executionState ?? {}).some((value) => value !== true)) issues.push('R3E4_EXECUTION_STATE_INCOMPLETE');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3E4_BOUNDARY_VIOLATION:${key}`);
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R3E4_PARENT_PASS_CLOSED' : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
