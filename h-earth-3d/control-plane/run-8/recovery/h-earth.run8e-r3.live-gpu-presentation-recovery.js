const freeze = (value) => Object.freeze(value);

export const H_EARTH_RUN_8E_R3_CONTRACT_ID = 'H_EARTH_RUN_8E_R3_LIVE_GPU_PRESENTATION_RECOVERY_v1';

export const H_EARTH_RUN_8E_R3_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3',
  predecessor: freeze({
    run8ER3D: 'PASS_CLOSED',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'PASS_CLOSED',
    r3E2FinalExactHead: '2017755b4c0186ef546774c3cfefe57b0e9c3199',
    r3E2FinalWorkflowRun: 30307543150,
    r3E2FinalWorkflowJob: 90115296328,
    r3E2FinalEvidenceArtifact: 8669013230,
    r3E2FinalEvidenceArtifactDigest: 'sha256:4ccc4f1105b7c4ed93faf6419967db2c26cb437698fba5d1085fe7e5c801736f',
    r3E2PassReceiptGitBlob: 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5',
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
        freeze({
          checkpointId: 'RUN_8E_R3E2',
          currentStatus: 'PASS_CLOSED',
          finalExactHead: '2017755b4c0186ef546774c3cfefe57b0e9c3199',
          passReceiptGitBlob: 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5'
        }),
        freeze({
          checkpointId: 'RUN_8E_R3E3',
          name: 'PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION',
          currentStatus: 'PASS_CLOSED',
          executionEvidence: freeze({
            successfulExecutionHead: '9ce869c03951a5760a1c29e87d261bc20a66d309',
            workflowRun: 30308290969,
            workflowJob: 90117713422,
            evidenceArtifact: 8669318353,
            evidenceArtifactDigest: 'sha256:4b81bf80bdda5d6fc90d3dc8d6a3c3eeca40c6bd5dd5486e7ecf92234b69df2f',
            automaticRegistryPreflightRun: 30308290926,
            documentLoadCount: 2,
            acceptedNavigationProposalCount: 2,
            visibleGpuFrameCount: 4,
            totalWebGL2ContextCount: 2,
            totalCanvas2DContextCount: 0,
            totalCanvasInputListenerCount: 12,
            totalLegacyModuleRequestCount: 0,
            totalAppOwnedDeferredExecutionCount: 0,
            totalPostInitializationResourceCreationCount: 0,
            totalPostInitializationBufferUploadCount: 0,
            totalWorldRebuildCount: 0,
            totalDeferredRenderCommitCount: 0,
            totalQueuedFrameChainCount: 0
          }),
          stoppingBoundary: 'STOP_BEFORE_PUBLIC_DIRECT_MANIPULATION_ACCEPTANCE_R3E4'
        }),
        freeze({ checkpointId: 'RUN_8E_R3E4', currentStatus: 'NOT_STARTED' }),
        freeze({ checkpointId: 'RUN_8E_R3E5', currentStatus: 'NOT_STARTED' })
      ])
    }),
    freeze({ checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' }),
    freeze({ checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' })
  ]),
  currentState: freeze({
    run8ER3: 'OPEN_AT_R3E4_BOUNDARY',
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'IN_PROGRESS',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'PASS_CLOSED',
    run8ER3E3: 'PASS_CLOSED',
    run8ER3E4: 'NOT_STARTED',
    run8ER3E5: 'NOT_STARTED',
    run8ER3F: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  }),
  executionState: freeze({
    browserExecutionPerformed: true,
    gpuExecutionPerformed: true,
    authorityExclusivityAcceptanceEstablished: true,
    initialDocumentPassed: true,
    reloadDocumentPassed: true
  }),
  boundaries: freeze({
    browserExecutionAuthorized: true,
    gpuExecutionAuthorized: true,
    authorityExclusivityAcceptanceAuthorized: true,
    limitedInteractionProbeAuthorized: true,
    publicSourceMutation: false,
    protectedWitnessMutation: false,
    admittedAuthorityMutation: false,
    fullPublicInteractionAcceptance: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3E4Work: false,
    mainMerge: false,
    run8EPassClosed: false
  })
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3E = checkpoints[4];
  const stages = r3E?.boundedSubcheckpoints ?? [];
  const r3E3 = stages[2];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER3D !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E1 !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3E2 !== 'PASS_CLOSED') issues.push('R3E2_PREDECESSOR_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3E2FinalExactHead !== '2017755b4c0186ef546774c3cfefe57b0e9c3199') issues.push('R3E2_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3E2FinalEvidenceArtifactDigest !== 'sha256:4ccc4f1105b7c4ed93faf6419967db2c26cb437698fba5d1085fe7e5c801736f') issues.push('R3E2_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.r3E2PassReceiptGitBlob !== 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5') issues.push('R3E2_PASS_RECEIPT_BLOB_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3E_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3D_NOT_PASS_CLOSED');
  if (r3E?.currentStatus !== 'IN_PROGRESS' || stages[0]?.currentStatus !== 'PASS_CLOSED' || stages[1]?.currentStatus !== 'PASS_CLOSED') issues.push('R3E1_OR_R3E2_NOT_PASS_CLOSED');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(r3E3?.currentStatus)) issues.push('R3E3_STATE_INVALID');
  if (stages.slice(3).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3E_STAGE_STARTED');
  if (checkpoints.slice(5).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('R3F_OR_R3G_STARTED');
  if (r3E3?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E3_EXECUTION' || candidate?.currentState?.run8ER3E3 !== 'EXECUTION_PENDING') issues.push('R3E3_PARENT_EXECUTION_STATE_INVALID');
  } else {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E4_BOUNDARY' || candidate?.currentState?.run8ER3E4 !== 'NOT_STARTED') issues.push('R3E4_PARENT_BOUNDARY_INVALID');
    const evidence = r3E3?.executionEvidence ?? {};
    if (evidence.workflowRun !== 30308290969 || evidence.workflowJob !== 90117713422) issues.push('R3E3_WORKFLOW_IDENTITY_MISMATCH');
    if (evidence.evidenceArtifactDigest !== 'sha256:4b81bf80bdda5d6fc90d3dc8d6a3c3eeca40c6bd5dd5486e7ecf92234b69df2f') issues.push('R3E3_ARTIFACT_DIGEST_MISMATCH');
    if (evidence.documentLoadCount !== 2 || evidence.acceptedNavigationProposalCount !== 2 || evidence.visibleGpuFrameCount !== 4 || evidence.totalWebGL2ContextCount !== 2 || evidence.totalCanvas2DContextCount !== 0 || evidence.totalCanvasInputListenerCount !== 12 || evidence.totalLegacyModuleRequestCount !== 0 || evidence.totalAppOwnedDeferredExecutionCount !== 0) issues.push('R3E3_EXECUTION_COUNTS_INVALID');
    if (Object.values(candidate?.executionState ?? {}).some((value) => value !== true)) issues.push('R3E3_EXECUTION_STATE_INCOMPLETE');
  }
  for (const key of ['browserExecutionAuthorized','gpuExecutionAuthorized','authorityExclusivityAcceptanceAuthorized','limitedInteractionProbeAuthorized']) if (candidate?.boundaries?.[key] !== true) issues.push(`R3E3_AUTHORIZATION_MISSING:${key}`);
  for (const key of ['publicSourceMutation','protectedWitnessMutation','admittedAuthorityMutation','fullPublicInteractionAcceptance','deployment','physicalDeviceAcceptance','r3E4Work','mainMerge','run8EPassClosed']) if (candidate?.boundaries?.[key] !== false) issues.push(`R3E3_BOUNDARY_VIOLATION:${key}`);
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3E3?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E3_PARENT_PASS_CLOSED' : 'RUN_8E_R3E3_PARENT_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
