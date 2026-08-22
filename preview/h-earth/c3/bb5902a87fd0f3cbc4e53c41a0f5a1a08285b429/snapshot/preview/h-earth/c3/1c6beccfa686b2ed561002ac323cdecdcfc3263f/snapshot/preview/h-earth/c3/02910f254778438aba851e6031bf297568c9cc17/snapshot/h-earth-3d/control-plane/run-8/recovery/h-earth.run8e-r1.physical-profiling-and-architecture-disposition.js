const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R1_CONTRACT_ID =
  'H_EARTH_RUN_8E_R1_PHYSICAL_SAMSUNG_PROFILING_AND_LIVE_RENDERER_ARCHITECTURE_DISPOSITION_v1';

export const H_EARTH_RUN_8E_R1_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R1_CONTRACT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  checkpointId: 'RUN_8E_R1',
  checkpointName: 'PHYSICAL_SAMSUNG_PROFILING_AND_LIVE_RENDERER_ARCHITECTURE_DISPOSITION',
  predecessor: {
    run8ER0IncidentFreeze: 'PASS_CLOSED',
    run8E: 'FAIL_OPEN',
    run8EPassClosed: false
  },
  controllingCorrection: {
    fullInteractiveEnvironmentExists: false,
    established: [
      'FULL_WORLD_GEOMETRY',
      'ENVIRONMENTAL_STATE',
      'CAMERA_AUTHORITY',
      'NAVIGATION_AUTHORITY',
      'DETERMINISTIC_REFERENCE_RENDERING'
    ],
    notEstablished: ['TRUTHFUL_CONTINUOUS_REAL_TIME_PUBLIC_INTERACTION']
  },
  preservedAuthorities: {
    run8A: 'PASS_CLOSED_PRESERVE',
    run8B: 'PASS_CLOSED_PRESERVE',
    run8C: 'COMPLETED_WORK_PRESERVE',
    run8D: 'COMPLETED_WORK_PRESERVE',
    terrainGeometryChange: 'WITHHELD',
    mountainDimensionChange: 'WITHHELD',
    vegetationExpansion: 'WITHHELD',
    newEnvironmentalContent: 'WITHHELD',
    lightingRetuning: 'WITHHELD',
    cameraRetuning: 'WITHHELD',
    navigationReplacement: 'WITHHELD'
  },
  rendererLanes: {
    deterministicCpuReference: {
      role: 'VALIDATION_RECEIPTS_REFERENCE_IMAGES_DEPTH_DIAGNOSTICS_REPRODUCIBLE_ENGINEERING_EVIDENCE',
      publicContinuousInteractionDuty: false,
      preserved: true
    },
    realtimeGpuLive: {
      role: 'PUBLIC_EXPLORATION_CONTINUOUS_CAMERA_FEEDBACK_MOBILE_INTERACTION',
      primaryBackendCandidate: 'WEBGL_2',
      implementationEstablished: false
    }
  },
  sharedAuthorityRequirements: [
    'SHARED_WORLD_AUTHORITY',
    'SHARED_CAMERA_AUTHORITY',
    'SHARED_NAVIGATION_AUTHORITY',
    'SHARED_MATERIAL_AND_LIGHT_AUTHORITY',
    'GEOMETRIC_CORRESPONDENCE',
    'AUTHORITY_CORRESPONDENCE'
  ],
  nonRequirements: [
    'RENDERER_IMPLEMENTATION_IDENTITY',
    'PIXEL_FOR_PIXEL_IDENTITY'
  ],
  fixedCameraCorpus: [
    'COASTAL_ENTRY',
    'INLAND_HILL',
    'MOUNTAIN_FACING',
    'OVERHEAD_OBLIQUE',
    'SHORELINE_RETURN'
  ],
  requiredMeasurements: [
    'POINTER_EVENT_RECEIPT',
    'NAVIGATION_STATE_MUTATION',
    'PREVIEW_TRANSFORM',
    'WORLD_PACKAGE_CONSTRUCTION',
    'WEST_ADMISSION',
    'PACKET_002_TRANSFER',
    'MATERIAL_AND_LIGHT_PROJECTION',
    'CAMERA_TRANSFORM_AND_CLIPPING',
    'BASE_RASTERIZATION',
    'SECOND_DEPTH_TRAVERSAL_COMPOSITE',
    'PUT_IMAGE_DATA',
    'TOTAL_RELEASE_TO_FRAME',
    'LONG_TASK_COUNT',
    'LONGEST_MAIN_THREAD_TASK',
    'LONG_ANIMATION_FRAME_COUNT',
    'HEAP_DELTA',
    'GARBAGE_COLLECTION_STALLS',
    'GESTURE_BACKLOG_DEPTH',
    'DROPPED_OR_SUPERSEDED_INPUT_COUNT'
  ],
  boundedCandidates: {
    candidateA: 'INSTRUMENTED_CURRENT_MAIN_THREAD_CPU_RENDERER',
    candidateB: 'CACHED_WORLD_WORKER_CPU_PROBE',
    candidateC: 'CACHED_WORLD_WEBGL_2_GPU_PROBE'
  },
  expectedDisposition: {
    publicLiveRenderer: 'CANDIDATE_C_WEBGL_2',
    workerCpu: 'RESPONSIVE_FALLBACK_REFERENCE_ACCELERATION_OR_DIAGNOSTIC_OPTION',
    currentCpu: 'DETERMINISTIC_REFERENCE_ONLY'
  },
  repositoryPackageEvidence: {
    status: 'PASS',
    validatedHead: 'db38b89bda29bde41a5874d94e2ab5c80d49ff7c',
    durableReceipt:
      '/h-earth-3d/validation/h-earth.run8e-r1.repository-profiling-package.receipt.json',
    durableReceiptGitBlob: '7108503ebd05807f0001cf50636aa3c806d3635d',
    validationRun: 30228676176,
    validationJob: 89863366514,
    evidenceArtifact: 8639446224,
    evidenceArtifactDigest:
      'sha256:318d85a619b75b49a4da939e721d0dbd4fba81465342ccf35222fb706193c287',
    currentCpuFullFrameMaximumMilliseconds: 5899.7,
    emulatedLongestMainThreadTaskMilliseconds: 10972,
    workerCpuMaximumMilliseconds: 24.4,
    webgl2ProbeAvailable: true,
    physicalSamsungPerformanceClaimed: false
  },
  physicalEvidenceBoundary: {
    repositoryProfilerPackage: 'PASS',
    repositoryPackageValidation: 'PASS',
    profilerRouteDeployment: 'NOT_YET_EXECUTED',
    browserEmulation: 'SUPPORTING_ONLY',
    physicalSamsungReceiptRequired: true,
    physicalSamsungExecution: 'NOT_YET_EXECUTED_FOR_R1',
    r1PassClosed: false
  },
  governingLaw: [
    'DO_NOT_REBUILD_THE_WORLD_BECAUSE_THE_CAMERA_MOVED',
    'DO_NOT_MOVE_AN_OLD_BITMAP_TO_IMPLY_THAT_THE_CAMERA_MOVED',
    'BUILD_THE_WORLD_ONCE',
    'MOVE_THE_CAMERA_CONTINUOUSLY',
    'LET_THE_GPU_PRESENT_THE_CURRENT_CAMERA_STATE',
    'RETAIN_THE_CPU_RENDERER_AS_THE_DETERMINISTIC_WITNESS'
  ]
});

export function evaluateHEarthRun8ER1Control(candidate = H_EARTH_RUN_8E_R1_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R1_CONTRACT_ID) issues.push('R1_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (candidate?.rendererLanes?.deterministicCpuReference?.preserved !== true) issues.push('CPU_REFERENCE_NOT_PRESERVED');
  if (candidate?.rendererLanes?.realtimeGpuLive?.primaryBackendCandidate !== 'WEBGL_2') issues.push('WEBGL2_NOT_PRIMARY');
  if (candidate?.fixedCameraCorpus?.length !== 5) issues.push('FIXED_CAMERA_CORPUS_INVALID');
  if (candidate?.repositoryPackageEvidence?.status !== 'PASS') issues.push('R1_REPOSITORY_PACKAGE_NOT_PASS');
  if (candidate?.physicalEvidenceBoundary?.r1PassClosed !== false) issues.push('R1_CLOSED_WITHOUT_PHYSICAL_RECEIPT');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R1_CONTROL_PASS' : 'RUN_8E_R1_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R1_CONTROL;
