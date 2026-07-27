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
    r3E5FinalExactHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    r3E5FinalWorkflowRun: 30313774927,
    r3E5FinalWorkflowJob: 90134863655,
    r3E5FinalEvidenceArtifact: 8671366254,
    r3E5FinalEvidenceArtifactDigest: 'sha256:86dd2af17cdd0e477f7edd6aeef37263283cbf69f49cf705278c00195d98685e',
    r3E5PassReceiptGitBlob: 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00',
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
        freeze({
          checkpointId: 'RUN_8E_R3E5',
          currentStatus: 'PASS_CLOSED',
          finalExactHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
          workflowRun: 30313774927,
          workflowJob: 90134863655,
          artifactId: 8671366254,
          artifactDigest: 'sha256:86dd2af17cdd0e477f7edd6aeef37263283cbf69f49cf705278c00195d98685e',
          passReceiptGitBlob: 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00',
          r3FInputDisposition: 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT'
        })
      ])
    }),
    freeze({
      checkpointId: 'RUN_8E_R3F',
      currentStatus: 'IN_PROGRESS',
      boundedSubcheckpoints: freeze([
        freeze({
          checkpointId: 'RUN_8E_R3F1',
          currentStatus: 'PASS_CLOSED',
          successfulExecutionHead: '08c4b9558d995acbc9ba1ff59990b8bc65d4a00d',
          workflowRun: 30314464717,
          workflowJob: 90136979082,
          artifactId: 8671621390,
          artifactDigest: 'sha256:3345790f2b92b789c80c59ed49759a7c9af5520b8fbe2be238631e94ffdee151',
          artifactFetchBackVerified: true
        }),
        freeze({ checkpointId: 'RUN_8E_R3F2', currentStatus: 'NOT_STARTED' }),
        freeze({ checkpointId: 'RUN_8E_R3F3', currentStatus: 'NOT_STARTED' }),
        freeze({ checkpointId: 'RUN_8E_R3F4', currentStatus: 'NOT_STARTED' })
      ])
    }),
    freeze({ checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' })
  ]),
  currentState: freeze({
    run8ER3: 'OPEN_AT_R3F2_BOUNDARY',
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'PASS_CLOSED',
    run8ER3E1: 'PASS_CLOSED',
    run8ER3E2: 'PASS_CLOSED',
    run8ER3E3: 'PASS_CLOSED',
    run8ER3E4: 'PASS_CLOSED',
    run8ER3E5: 'PASS_CLOSED',
    run8ER3F: 'IN_PROGRESS',
    run8ER3F1: 'PASS_CLOSED',
    run8ER3F2: 'NOT_STARTED',
    run8ER3F3: 'NOT_STARTED',
    run8ER3F4: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  }),
  authorizations: freeze({
    r3FProtocolAndEvidenceIntakeAuthority: true,
    immutablePreviewRequirementsDefinition: true,
    repositoryCustody: true
  }),
  boundaries: freeze({
    showroomMutation: false,
    publicRouteMutation: false,
    publicRuntimeMutation: false,
    browserExecution: false,
    gpuExecution: false,
    physicalReferenceDeviceExecution: false,
    broaderMobileExecution: false,
    productionDeployment: false,
    promotion: false,
    r3F2Execution: false,
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
  const r3EStages = r3E?.boundedSubcheckpoints ?? [];
  const r3E5 = r3EStages[4];
  const r3F = checkpoints[5];
  const r3FStages = r3F?.boundedSubcheckpoints ?? [];
  const r3F1 = r3FStages[0];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  for (const key of ['run8ER3D','run8ER3E','run8ER3E1','run8ER3E2','run8ER3E3','run8ER3E4','run8ER3E5']) if (candidate?.predecessor?.[key] !== 'PASS_CLOSED') issues.push(`R3F1_PREDECESSOR_NOT_PASS_CLOSED:${key}`);
  if (candidate?.predecessor?.r3E5FinalExactHead !== '548672ae99cd406805f0c8ca576cc650baf7ed18') issues.push('R3E5_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3E5FinalEvidenceArtifactDigest !== 'sha256:86dd2af17cdd0e477f7edd6aeef37263283cbf69f49cf705278c00195d98685e') issues.push('R3E5_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.r3E5PassReceiptGitBlob !== 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00') issues.push('R3E5_PASS_RECEIPT_BLOB_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || r3EStages.length !== 5 || r3FStages.length !== 4) issues.push('R3_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3D_NOT_PASS_CLOSED');
  if (r3E?.currentStatus !== 'PASS_CLOSED' || r3EStages.some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3E_NOT_PASS_CLOSED');
  if (r3E5?.finalExactHead !== '548672ae99cd406805f0c8ca576cc650baf7ed18' || r3E5?.passReceiptGitBlob !== 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00' || r3E5?.r3FInputDisposition !== 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT') issues.push('R3E5_CUSTODY_INVALID');
  if (r3F?.currentStatus !== 'IN_PROGRESS') issues.push('R3F_NOT_IN_PROGRESS');
  if (!['EXECUTION_PENDING','PASS_CLOSED'].includes(r3F1?.currentStatus)) issues.push('R3F1_STATE_INVALID');
  if (r3FStages.slice(1).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('R3F2_R3F4_STARTED_EARLY');
  if (checkpoints[6]?.currentStatus !== 'NOT_STARTED') issues.push('R3G_STARTED_EARLY');
  if (r3F1?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3F1_EXECUTION' || candidate?.currentState?.run8ER3F1 !== 'EXECUTION_PENDING') issues.push('R3F1_PARENT_EXECUTION_STATE_INVALID');
  } else {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3F2_BOUNDARY' || candidate?.currentState?.run8ER3F1 !== 'PASS_CLOSED') issues.push('R3F1_PARENT_PASS_STATE_INVALID');
    if (r3F1?.successfulExecutionHead !== '08c4b9558d995acbc9ba1ff59990b8bc65d4a00d' || r3F1?.workflowRun !== 30314464717 || r3F1?.workflowJob !== 90136979082 || r3F1?.artifactId !== 8671621390 || r3F1?.artifactFetchBackVerified !== true) issues.push('R3F1_PARENT_CORE_EVIDENCE_INVALID');
    if (r3F1?.artifactDigest !== 'sha256:3345790f2b92b789c80c59ed49759a7c9af5520b8fbe2be238631e94ffdee151') issues.push('R3F1_PARENT_ARTIFACT_DIGEST_INVALID');
  }
  if (Object.values(candidate?.authorizations ?? {}).some((value) => value !== true)) issues.push('R3F1_AUTHORIZATION_INCOMPLETE');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3F1_BOUNDARY_VIOLATION:${key}`);
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3F1?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3F1_PARENT_PASS_CLOSED' : 'RUN_8E_R3F1_PARENT_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
