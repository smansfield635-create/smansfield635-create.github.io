const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT_ID =
  'H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AND_MOBILE_COMPATIBILITY_AMENDMENT_v1';

export const H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT = freeze({
  amendmentId: H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  checkpointId: 'RUN_8E_R1',
  amendmentClass: 'TERMINOLOGY_VALIDATION_AND_PLATFORM_SCOPE_CORRECTION',
  predecessorContractId:
    'H_EARTH_RUN_8E_R1_PHYSICAL_SAMSUNG_PROFILING_AND_LIVE_RENDERER_ARCHITECTURE_DISPOSITION_v1',
  supersessionScope: 'FORWARD_LOOKING_DEVICE_SCOPE_AND_VALIDATION_LANGUAGE_ONLY',
  preservedHistoricalEvidence: true,
  correction: {
    productTarget: 'ALL_SUPPORTED_MOBILE_DEVICES',
    referenceValidationDevice: 'CURRENT_OFFICIAL_SAMSUNG_PHONE',
    samsungOnlyImplementation: 'PROHIBITED',
    samsungOnlyCompatibilityClaim: 'PROHIBITED',
    physicalSamsungEvidenceRole: 'REFERENCE_DEVICE_ACCEPTANCE_ANCHOR',
    universalMobileInteractionContract: 'REQUIRED',
    primaryFailureClassification:
      'SHARED_PUBLIC_RENDERER_AND_INTERACTION_PRESENTATION_ARCHITECTURE',
    samsungFocusCausedPrimaryFailure: false,
    samsungOnlyValidationCreatesCoverageRisk: true
  },
  historicalTermReclassification: {
    physicalSamsungProfiling: 'REFERENCE_DEVICE_PHYSICAL_PROFILING',
    physicalSamsungReceipt: 'REFERENCE_DEVICE_PHYSICAL_INTERACTION_RECEIPT',
    physicalSamsungClosure: 'REFERENCE_DEVICE_ACCEPTANCE_BOUNDARY',
    historicalIdentifiersRetained: true,
    historicalReceiptBodiesRewritten: false
  },
  implementationRequirements: {
    backendSelection: 'CAPABILITY_BASED_NOT_DEVICE_BRAND_BASED',
    primaryLiveBackendCandidate: 'WEBGL_2',
    deviceSpecificRendererForks: 'PROHIBITED_WITHOUT_SEPARATE_DEFECT_EVIDENCE',
    hardcodedSamsungViewport: false,
    hardcodedSamsungDevicePixelRatio: false,
    hardcodedSamsungUserAgent: false,
    hardcodedSamsungGestureThresholds: false,
    hardcodedSamsungShaderPrecisionAssumptions: false,
    responsiveViewportSizing: true,
    devicePixelRatioIndependence: true,
    adaptiveRenderResolution: true,
    pointerEventOrEquivalentTouchInput: true,
    contextLossRecovery: true,
    latestLawfulCameraStateCoalescing: true,
    flatBitmapCameraFeedback: false,
    obsoleteGestureBacklog: false
  },
  preservedAuthorities: {
    worldGeometry: 'PRESERVE',
    environmentalState: 'PRESERVE',
    cameraAuthority: 'PRESERVE',
    navigationAuthority: 'PRESERVE',
    materialAndLightAuthority: 'PRESERVE',
    deterministicCpuReferenceRenderer: 'PRESERVE_REFERENCE_ONLY',
    realtimeGpuLiveRenderer: 'NOT_YET_IMPLEMENTED',
    terrainGeometryChange: 'WITHHELD',
    mountainDimensionChange: 'WITHHELD',
    vegetationExpansion: 'WITHHELD',
    lightingRetuning: 'WITHHELD',
    cameraRetuning: 'WITHHELD',
    navigationReplacement: 'WITHHELD'
  },
  validationMatrix: {
    referenceAndroid: {
      classId: 'REFERENCE_ANDROID_PHYSICAL',
      device: 'CURRENT_OFFICIAL_SAMSUNG_PHONE',
      browserClass: 'ANDROID_CHROMIUM',
      purpose: 'REFERENCE_DEVICE_ACCEPTANCE_AND_FAILURE_REPRODUCTION',
      requiredForR1ReferenceClosure: true
    },
    secondAndroidClass: {
      classId: 'SECOND_ANDROID_DIFFERENT_GPU_AND_SCREEN_CLASS',
      deviceBrandRequired: false,
      differentGpuOrDriverClass: true,
      differentViewportClass: true,
      requiredBeforeBroadAndroidCompatibilityClaim: true
    },
    iosClass: {
      classId: 'IOS_MOBILE_SAFARI',
      browserClass: 'MOBILE_SAFARI',
      requiredBeforeAllSupportedMobileCompatibilityClaim: true
    },
    lowerPerformanceClass: {
      classId: 'LOWER_PERFORMANCE_MOBILE',
      purpose: 'ADAPTIVE_RESOLUTION_AND_STABILITY_VALIDATION',
      requiredBeforeAllSupportedMobileCompatibilityClaim: true
    },
    orientationAndLifecycle: [
      'PORTRAIT',
      'LANDSCAPE',
      'PORTRAIT_TO_LANDSCAPE_TRANSITION',
      'BACKGROUND_RETURN',
      'CONTEXT_LOSS_OR_RESTORATION',
      'TEN_MINUTE_CONTINUOUS_INTERACTION',
      'THERMAL_DEGRADATION_MEASUREMENT',
      'MEMORY_GROWTH_MEASUREMENT'
    ]
  },
  claimBoundaries: {
    referenceDeviceAcceptancePassDoesNotEqualAllMobileCompatibilityPass: true,
    architectureProbeReceiptDoesNotEqualPhysicalInteractionReceipt: true,
    ciWebglFunctionalPassDoesNotEqualPhysicalGpuPerformancePass: true,
    samsungReferencePassMayCloseOnlyReferenceDeviceBoundary: true,
    broadAndroidCompatibilityRequiresSecondAndroidClass: true,
    allSupportedMobileCompatibilityRequiresIosAndLowerPerformanceClasses: true,
    run8ER1PassClosed: false,
    run8EPassClosed: false
  },
  currentEvidence: {
    referenceDeviceArchitectureProbeReceiptCount: 2,
    referenceDeviceWebgl2Available: true,
    referenceDeviceWorkerAvailable: true,
    referenceDeviceOffscreenCanvas2DAvailable: true,
    referenceDeviceCurrentCpuFullFrameRangeMilliseconds: {
      minimum: 4609,
      maximum: 8975.2
    },
    referenceDeviceWorkerProbeRangeMilliseconds: {
      minimum: 7.8,
      maximum: 25.8
    },
    referenceDeviceWebglProbeRangeMilliseconds: {
      minimum: 0.1,
      maximum: 0.3
    },
    referenceDevicePhysicalInteractionReceiptCaptured: false,
    truthfulContinuousRealtimeInteractionEstablished: false
  },
  orderingAndStopping: {
    referenceDevicePhysicalInteractionReceiptBeforeR2: true,
    run8ER2ProductMutationAuthorizedNow: false,
    stopBeforeImmutableLiveRenderPackageConstruction: true,
    stopBeforeProductionWebglRenderer: true,
    stopBeforeAnyAllMobileCompatibilityClaim: true
  },
  governingLaw: [
    'SAMSUNG_IS_A_REFERENCE_DEVICE_NOT_A_PRODUCT_PLATFORM_BOUNDARY',
    'IMPLEMENT_FOR_CAPABILITIES_NOT_FOR_DEVICE_BRANDS',
    'PRESERVE_ONE_UNIVERSAL_MOBILE_INTERACTION_CONTRACT',
    'REFERENCE_DEVICE_PASS_DOES_NOT_EQUAL_ALL_MOBILE_PASS',
    'DO_NOT_REBUILD_THE_WORLD_BECAUSE_THE_CAMERA_MOVED',
    'DO_NOT_MOVE_AN_OLD_BITMAP_TO_IMPLY_THAT_THE_CAMERA_MOVED'
  ]
});

export function evaluateHEarthRun8ER1ReferenceDeviceAmendment(
  candidate = H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT
) {
  const issues = [];
  if (candidate?.amendmentId !== H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT_ID) {
    issues.push('REFERENCE_DEVICE_AMENDMENT_ID_MISMATCH');
  }
  if (candidate?.correction?.productTarget !== 'ALL_SUPPORTED_MOBILE_DEVICES') {
    issues.push('PRODUCT_TARGET_NOT_DEVICE_NEUTRAL');
  }
  if (candidate?.correction?.referenceValidationDevice !== 'CURRENT_OFFICIAL_SAMSUNG_PHONE') {
    issues.push('REFERENCE_DEVICE_NOT_PRESERVED');
  }
  if (candidate?.correction?.samsungOnlyImplementation !== 'PROHIBITED') {
    issues.push('SAMSUNG_ONLY_IMPLEMENTATION_NOT_PROHIBITED');
  }
  if (candidate?.implementationRequirements?.backendSelection !== 'CAPABILITY_BASED_NOT_DEVICE_BRAND_BASED') {
    issues.push('BACKEND_SELECTION_NOT_CAPABILITY_BASED');
  }
  if (candidate?.implementationRequirements?.flatBitmapCameraFeedback !== false) {
    issues.push('FLAT_BITMAP_FEEDBACK_NOT_PROHIBITED');
  }
  if (candidate?.claimBoundaries?.referenceDeviceAcceptancePassDoesNotEqualAllMobileCompatibilityPass !== true) {
    issues.push('REFERENCE_AND_GLOBAL_CLAIMS_NOT_SEPARATED');
  }
  if (candidate?.orderingAndStopping?.run8ER2ProductMutationAuthorizedNow !== false) {
    issues.push('R2_AUTHORIZED_BEFORE_PHYSICAL_INTERACTION_RECEIPT');
  }
  if (candidate?.claimBoundaries?.run8ER1PassClosed !== false || candidate?.claimBoundaries?.run8EPassClosed !== false) {
    issues.push('RUN_8_CLOSED_BY_SCOPE_AMENDMENT');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8E_R1_REFERENCE_DEVICE_AND_MOBILE_COMPATIBILITY_AMENDMENT_PASS'
      : 'RUN_8E_R1_REFERENCE_DEVICE_AND_MOBILE_COMPATIBILITY_AMENDMENT_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AMENDMENT;
