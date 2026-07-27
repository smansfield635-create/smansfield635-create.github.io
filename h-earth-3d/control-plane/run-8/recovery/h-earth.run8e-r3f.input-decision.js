const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3F_INPUT_DECISION_ID =
  'H_EARTH_RUN_8E_R3F_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE_INPUT_DECISION_v1';

export const H_EARTH_RUN_8E_R3F_INPUT_DECISION = freeze({
  decisionId: H_EARTH_RUN_8E_R3F_INPUT_DECISION_ID,
  decisionClass: 'NEXT_CHECKPOINT_INPUT_DISPOSITION',
  issuedByCheckpoint: 'RUN_8E_R3E5',
  targetCheckpoint: 'RUN_8E_R3F',
  targetName: 'PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE',
  currentTargetStatus: 'NOT_STARTED',
  disposition: 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT',
  authorizedNextAction: 'CREATE_SEPARATE_R3F_BRANCH_FROM_R3E5_FINAL_EXACT_HEAD',
  baseRequirement: freeze({
    symbolicBase: 'R3E5_FINAL_EXACT_HEAD',
    exactHeadKnownOnlyAfterR3E5FinalValidation: true,
    stackDirectlyOnR3E5: true,
    mergeOrRebaseBeforeR3FExecution: false
  }),
  admittedInputs: freeze({
    r3E1PassReceipt: freeze({ path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e1.pass-closed.receipt.json', gitBlob: '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5', posture: 'PROTECTED_CUSTODY_INPUT' }),
    r3E2PassReceipt: freeze({ path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e2.pass-closed.receipt.json', gitBlob: 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5', posture: 'PROTECTED_CUSTODY_INPUT' }),
    r3E3PassReceipt: freeze({ path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e3.pass-closed.receipt.json', gitBlob: '5c5f1ae06220f88f497dc2b45f4d749679849918', posture: 'PROTECTED_CUSTODY_INPUT' }),
    r3E4PassReceipt: freeze({ path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e4.pass-closed.receipt.json', gitBlob: '7b2db7ed51a345edea88ad8a1288db4db150201d', posture: 'PROTECTED_CUSTODY_INPUT' }),
    publicRouteHtml: freeze({ path: '/showroom/globe/h-earth/index.html', gitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837', posture: 'PROTECTED_EXECUTION_TARGET' }),
    publicGpuOrchestrator: freeze({ path: '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js', gitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445', posture: 'PROTECTED_EXECUTION_TARGET' }),
    navigationAuthority: freeze({ path: '/showroom/globe/h-earth/functional-landscape/navigation.js', gitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91', posture: 'PROTECTED_READ_ONLY_INPUT' }),
    r3AFramePacketAuthority: freeze({ path: '/showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js', gitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1', posture: 'PROTECTED_READ_ONLY_INPUT' }),
    r3CPersistentRenderer: freeze({ path: '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js', gitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880', posture: 'PROTECTED_READ_ONLY_INPUT' }),
    r3D2PointerTouchIntake: freeze({ path: '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js', gitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6', posture: 'PROTECTED_READ_ONLY_INPUT' }),
    r3D3LiveGpuBinding: freeze({ path: '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js', gitBlob: '5017bbaf857a644287cb829037b0fde4646f270d', posture: 'PROTECTED_READ_ONLY_INPUT' })
  }),
  referenceDeviceLaw: freeze({
    officialSamsungPhoneRole: 'PHYSICAL_REFERENCE_DEVICE_ONLY',
    evidenceHardwareNotImplementationTarget: true,
    allSupportedMobileDevicesRemainProductTarget: true,
    samsungOnlyImplementationProhibited: true,
    deviceBrandBackendSelectionProhibited: true,
    soloDeveloperMobilePhoneDevelopmentContextPreserved: true
  }),
  requiredAcceptance: freeze({
    physicalReferenceDevicePublicRouteExecution: true,
    portraitAndLandscape: true,
    oneFingerLook: true,
    twoFingerForwardAndBackwardTravel: true,
    pinchZoomInAndOut: true,
    immediatePerspectiveFeedback: true,
    continuousDirectInspection: true,
    realTimeGpuPresentation: true,
    noVisibleController: true,
    noFlatBitmapDragging: true,
    noWorldRebuildDuringGesture: true,
    noMultiSecondInputBacklog: true,
    broaderMobileDeviceAgnosticEvidence: true,
    noBrandSpecificRuntimePath: true
  }),
  requiredBoundaries: freeze({
    separateR3FBranchRequired: true,
    noPublicSourceMutationWithoutSeparateDefectCheckpoint: true,
    noProductionDeploymentInsideInitialR3FAcceptance: true,
    noPromotion: true,
    noMainMerge: true,
    noR3GWork: true,
    noRun8EPassClaim: true
  }),
  currentExecution: freeze({
    r3FBranchCreated: false,
    physicalReferenceDeviceExecuted: false,
    broaderMobileAcceptanceExecuted: false,
    publicSourceMutated: false,
    deploymentPerformed: false,
    promotionPerformed: false,
    mainMerged: false
  }),
  stoppingBoundary: 'STOP_BEFORE_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE_R3F'
});

export function evaluateHEarthRun8ER3FInputDecision(candidate = H_EARTH_RUN_8E_R3F_INPUT_DECISION) {
  const issues = [];
  if (candidate?.decisionId !== H_EARTH_RUN_8E_R3F_INPUT_DECISION_ID) issues.push('R3F_INPUT_DECISION_ID_MISMATCH');
  if (candidate?.issuedByCheckpoint !== 'RUN_8E_R3E5') issues.push('R3F_INPUT_ISSUER_INVALID');
  if (candidate?.targetCheckpoint !== 'RUN_8E_R3F' || candidate?.currentTargetStatus !== 'NOT_STARTED') issues.push('R3F_TARGET_STATE_INVALID');
  if (candidate?.disposition !== 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT') issues.push('R3F_INPUT_DISPOSITION_INVALID');
  if (candidate?.authorizedNextAction !== 'CREATE_SEPARATE_R3F_BRANCH_FROM_R3E5_FINAL_EXACT_HEAD') issues.push('R3F_NEXT_ACTION_INVALID');
  if (candidate?.baseRequirement?.symbolicBase !== 'R3E5_FINAL_EXACT_HEAD' || candidate?.baseRequirement?.stackDirectlyOnR3E5 !== true || candidate?.baseRequirement?.mergeOrRebaseBeforeR3FExecution !== false) issues.push('R3F_BASE_REQUIREMENT_INVALID');
  if (Object.keys(candidate?.admittedInputs ?? {}).length !== 11) issues.push('R3F_ADMITTED_INPUT_COUNT_INVALID');
  if (candidate?.referenceDeviceLaw?.officialSamsungPhoneRole !== 'PHYSICAL_REFERENCE_DEVICE_ONLY') issues.push('R3F_REFERENCE_DEVICE_ROLE_INVALID');
  for (const key of ['evidenceHardwareNotImplementationTarget','allSupportedMobileDevicesRemainProductTarget','samsungOnlyImplementationProhibited','deviceBrandBackendSelectionProhibited','soloDeveloperMobilePhoneDevelopmentContextPreserved']) if (candidate?.referenceDeviceLaw?.[key] !== true) issues.push(`R3F_REFERENCE_DEVICE_LAW_MISSING:${key}`);
  for (const [key, value] of Object.entries(candidate?.requiredAcceptance ?? {})) if (value !== true) issues.push(`R3F_REQUIRED_ACCEPTANCE_MISSING:${key}`);
  for (const [key, value] of Object.entries(candidate?.requiredBoundaries ?? {})) if (value !== true) issues.push(`R3F_REQUIRED_BOUNDARY_MISSING:${key}`);
  for (const [key, value] of Object.entries(candidate?.currentExecution ?? {})) if (value !== false) issues.push(`R3F_EXECUTION_STARTED_EARLY:${key}`);
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE_R3F') issues.push('R3F_INPUT_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R3F_INPUT_ADMISSIBLE_NOT_STARTED' : 'RUN_8E_R3F_INPUT_DECISION_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3F_INPUT_DECISION;
