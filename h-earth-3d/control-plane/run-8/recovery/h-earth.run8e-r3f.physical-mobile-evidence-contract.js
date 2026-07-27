const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT_ID =
  'H_EARTH_RUN_8E_R3F_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_EVIDENCE_CONTRACT_v1';

export const H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT = freeze({
  contractId: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT_ID,
  targetCheckpoint: 'RUN_8E_R3F',
  productTarget: 'ALL_SUPPORTED_MOBILE_DEVICES',
  physicalityLaw: freeze({
    acceptingEvidenceClasses: freeze(['PHYSICAL_LOCAL', 'REMOTE_PHYSICAL']),
    supplementalOnlyEvidenceClasses: freeze(['EMULATED_BROWSER', 'DESKTOP_MOBILE_VIEWPORT']),
    ciOrEmulationDoesNotEqualPhysicalAcceptance: true,
    referenceDevicePassDoesNotEqualBroaderMobilePass: true
  }),
  previewTransportLaw: freeze({
    immutableNonProductionPreviewRequired: true,
    productionDeploymentAllowed: false,
    exactSourceIdentityRequired: true,
    acceptedTransportClasses: freeze(['IMMUTABLE_HOSTED_PREVIEW', 'IMMUTABLE_LAN_PREVIEW', 'SIGNED_OFFLINE_PACKAGE']),
    previewMustBindR3E5BaseHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445'
  }),
  deviceLanes: freeze({
    referenceAndroid: freeze({
      laneId: 'R3F_REFERENCE_ANDROID_PHYSICAL',
      deviceRole: 'CURRENT_OFFICIAL_SAMSUNG_PHONE_PHYSICAL_REFERENCE_DEVICE_ONLY',
      browserClass: 'ANDROID_CHROMIUM',
      physicalEvidenceRequired: true,
      portraitAndLandscapeRequired: true,
      orientationTransitionRequired: true,
      backgroundReturnRequired: true,
      tenMinuteContinuousInteractionRequired: true
    }),
    secondAndroid: freeze({
      laneId: 'R3F_SECOND_ANDROID_DIFFERENT_GPU_OR_SCREEN_CLASS',
      brandSpecificRequirement: false,
      browserClass: 'ANDROID_CHROMIUM',
      physicalEvidenceRequired: true,
      differentGpuOrDriverClassRequired: true,
      differentViewportClassRequired: true,
      portraitAndLandscapeRequired: true
    }),
    iosMobileSafari: freeze({
      laneId: 'R3F_IOS_MOBILE_SAFARI_PHYSICAL',
      browserClass: 'IOS_MOBILE_SAFARI',
      physicalEvidenceRequired: true,
      portraitAndLandscapeRequired: true
    }),
    lowerPerformanceMobile: freeze({
      laneId: 'R3F_LOWER_PERFORMANCE_MOBILE_PHYSICAL',
      mayOverlapSecondAndroidOrIosLane: true,
      qualificationEvidenceRequired: true,
      adaptiveResolutionAndStabilityPurpose: true,
      tenMinuteContinuousInteractionRequired: true
    })
  }),
  requiredInteractionMatrix: freeze({
    oneFingerLook: true,
    twoFingerForwardTravel: true,
    twoFingerBackwardTravel: true,
    pinchZoomIn: true,
    pinchZoomOut: true,
    immediatePerspectiveFeedback: true,
    continuousDirectInspection: true,
    realTimeGpuPresentation: true,
    portrait: true,
    landscape: true,
    noVisibleController: true,
    noFlatBitmapDragging: true,
    noWorldRebuildDuringGesture: true,
    noMultiSecondInputBacklog: true
  }),
  timingLaw: freeze({
    maximumObservedInputToVisibleResponseExclusiveMs: 2000,
    maximumObservedFrozenPresentationExclusiveMs: 2000,
    obsoleteInputBacklogAllowed: false,
    continuousInteractionDurationMinimumMs: 600000,
    timingMethod: 'SCREEN_RECORDING_OR_INSTRUMENTED_TRACE_WITH_MONOTONIC_TIMESTAMPS'
  }),
  requiredSessionRecordFields: freeze([
    'evidenceId',
    'capturedAt',
    'deviceLaneId',
    'physicalityClass',
    'deviceModelOrRedactedClass',
    'operatingSystemFamily',
    'operatingSystemVersion',
    'browserClass',
    'browserVersion',
    'viewportCssPixels',
    'devicePixelRatio',
    'orientation',
    'previewTransportClass',
    'previewPackageSha256',
    'sourceHead',
    'publicHtmlGitBlob',
    'publicOrchestratorGitBlob',
    'interactionResults',
    'timingResults',
    'runtimeExclusivityResults',
    'captureArtifacts',
    'operatorAttestation'
  ]),
  requiredCaptureArtifacts: freeze({
    screenRecording: true,
    initialScreenshot: true,
    postInteractionScreenshot: true,
    pageOrEnvironmentScreenshot: true,
    sha256PerArtifact: true,
    rawInstrumentedTraceWhenAvailable: true
  }),
  claimLaw: freeze({
    r3F2ReferenceDevicePassRequiresReferenceAndroidLane: true,
    r3F3BroaderMobilePassRequiresSecondAndroidAndIosLanes: true,
    lowerPerformanceQualificationRequiredBeforeR3F3Pass: true,
    lowerPerformanceLaneMayOverlapAnotherNonReferenceLane: true,
    allRequiredPhysicalLanesMustUseSameImmutablePreviewPackage: true,
    deviceBrandBackendSelectionProhibited: true,
    samsungOnlyImplementationProhibited: true,
    unresolvedSourceDefectRequiresSeparateCorrectionCheckpoint: true,
    r3FPassDoesNotAuthorizeDeploymentOrMainMerge: true
  }),
  r3FSubcheckpointSequence: freeze([
    freeze({ checkpointId: 'RUN_8E_R3F1', name: 'PHYSICAL_MOBILE_ACCEPTANCE_PROTOCOL_AND_EVIDENCE_INTAKE_AUTHORITY' }),
    freeze({ checkpointId: 'RUN_8E_R3F2', name: 'REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION' }),
    freeze({ checkpointId: 'RUN_8E_R3F3', name: 'BROADER_MOBILE_PHYSICAL_EXECUTION_AND_DEVICE_AGNOSTIC_ACCEPTANCE' }),
    freeze({ checkpointId: 'RUN_8E_R3F4', name: 'R3F_ACCEPTANCE_RECONCILIATION_AND_CLOSURE' })
  ]),
  stoppingBoundary: 'STOP_BEFORE_REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION_R3F2'
});

export function evaluateHEarthRun8ER3FEvidenceContract(candidate = H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT_ID) issues.push('R3F_EVIDENCE_CONTRACT_ID_MISMATCH');
  if (candidate?.productTarget !== 'ALL_SUPPORTED_MOBILE_DEVICES') issues.push('R3F_PRODUCT_TARGET_INVALID');
  if (candidate?.previewTransportLaw?.productionDeploymentAllowed !== false) issues.push('R3F_PRODUCTION_DEPLOYMENT_AUTHORIZED');
  if (candidate?.previewTransportLaw?.previewMustBindR3E5BaseHead !== '548672ae99cd406805f0c8ca576cc650baf7ed18') issues.push('R3F_PREVIEW_BASE_HEAD_MISMATCH');
  if (candidate?.deviceLanes?.referenceAndroid?.deviceRole !== 'CURRENT_OFFICIAL_SAMSUNG_PHONE_PHYSICAL_REFERENCE_DEVICE_ONLY') issues.push('R3F_REFERENCE_DEVICE_ROLE_INVALID');
  if (candidate?.deviceLanes?.secondAndroid?.brandSpecificRequirement !== false) issues.push('R3F_SECOND_ANDROID_BRAND_SPECIFIC');
  if (candidate?.deviceLanes?.iosMobileSafari?.physicalEvidenceRequired !== true) issues.push('R3F_IOS_PHYSICAL_EVIDENCE_NOT_REQUIRED');
  if (candidate?.deviceLanes?.lowerPerformanceMobile?.mayOverlapSecondAndroidOrIosLane !== true) issues.push('R3F_LOWER_PERFORMANCE_OVERLAP_RULE_INVALID');
  for (const [key, value] of Object.entries(candidate?.requiredInteractionMatrix ?? {})) if (value !== true) issues.push(`R3F_INTERACTION_REQUIREMENT_MISSING:${key}`);
  if (candidate?.timingLaw?.maximumObservedInputToVisibleResponseExclusiveMs !== 2000 || candidate?.timingLaw?.maximumObservedFrozenPresentationExclusiveMs !== 2000) issues.push('R3F_TIMING_THRESHOLD_INVALID');
  if ((candidate?.requiredSessionRecordFields ?? []).length !== 22) issues.push('R3F_SESSION_RECORD_FIELD_COUNT_INVALID');
  if ((candidate?.r3FSubcheckpointSequence ?? []).map((entry) => entry.checkpointId).join(',') !== 'RUN_8E_R3F1,RUN_8E_R3F2,RUN_8E_R3F3,RUN_8E_R3F4') issues.push('R3F_SUBCHECKPOINT_SEQUENCE_INVALID');
  if (candidate?.claimLaw?.deviceBrandBackendSelectionProhibited !== true || candidate?.claimLaw?.samsungOnlyImplementationProhibited !== true) issues.push('R3F_DEVICE_NEUTRALITY_LAW_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION_R3F2') issues.push('R3F1_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R3F_EVIDENCE_CONTRACT_PASS' : 'RUN_8E_R3F_EVIDENCE_CONTRACT_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT;
