const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((member) => freeze(member, seen));
  return Object.freeze(value);
};

export const H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001 = freeze({
  schemaVersion: 'H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_CONTROL_v1',
  operationId: 'H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001',
  exactBase: 'eb016b641ce49e1321111529f3eec5c4ae71f771',
  rollbackTarget: 'eb016b641ce49e1321111529f3eec5c4ae71f771',
  branch: 'agent/h-earth-narrative-observatory-integration-001',
  engineeringPr: 404,
  route: '/showroom/globe/h-earth/observatory/',
  routeIdentity: 'THE_H_EARTH_OBSERVATORY',
  entryText: 'HOW_THIS_WORLD_IS_PRESERVED',
  candidateId: 'H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001',
  candidateRoute: '/showroom/globe/h-earth/?candidate=H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001',
  publicDefaultRoute: '/showroom/globe/h-earth/',
  exactAllowedPaths: [
    '.github/workflows/h-earth-narrative-observatory.yml',
    'showroom/globe/h-earth/observatory/index.html',
    'showroom/globe/h-earth/observatory/observatory.mjs',
    'showroom/globe/h-earth/index.html',
    'h-earth-3d/control-plane/instrument-platform/H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001.v1.mjs',
    'h-earth-3d/validation/instrument-platform/h-earth.narrative-observatory.runner.mjs',
    'h-earth-3d/validation/instrument-platform/h-earth.narrative-observatory.browser.mjs'
  ],
  protectedAuthorities: [
    'ACCEPTED_CP2_RENDERER', 'RUN_8B_TERRAIN', 'CURRENT_LIVE_GPU_BINDING',
    'RUN_8E_GPU_INTEGRATION', 'NAVIGATION_AUTHORITY', 'GESTURE_INTAKE',
    'CAMERA_INTEGRATION', 'WORLD_GEOMETRY', 'VEGETATION',
    'SPECIALIZED_GAUGE_CHECK_MATRIX', 'SPECIALIZED_GAUGE_READINESS_KERNEL'
  ],
  checkpoints: {
    B_R0: {
      status: 'PASS_CLOSED',
      exactSourceBase: 'eb016b641ce49e1321111529f3eec5c4ae71f771',
      unresolvedAssumptions: 0,
      unresolvedPathConflicts: 0
    },
    B1: {
      status: 'PASS_CLOSED',
      branchCreated: true,
      branchBase: 'eb016b641ce49e1321111529f3eec5c4ae71f771',
      exactAllowedPathCount: 7,
      sourceImplementationPerformed: false,
      stopBoundary: 'STOP_AFTER_BRANCH_AND_SCOPE_FREEZE_BEFORE_SOURCE_IMPLEMENTATION'
    },
    B2: {
      status: 'PASS_CLOSED',
      routeImplemented: true,
      sevenSectionStructure: true,
      returnToHEarthPersistent: true,
      mobileLayout: true,
      desktopLayout: true,
      hEarthHeaderChanged: false,
      fd05LinkMoved: false,
      fetchedBackRouteBlob: '0d47375b8922cd574c1a9704138989f9fa6a95e3',
      fetchedBackModuleBlob: '81d79735ff4c934ee9e939792e4cdbcbae3c8801',
      stopBoundary: 'STOP_AFTER_STANDALONE_ROUTE_FETCH_BACK'
    },
    B3: {
      status: 'PASS_CLOSED',
      replayChapterCount: 8,
      replayReadOnly: true,
      progressiveDisclosure: true,
      technicalEvidenceOptional: true,
      specializedDestinations: 4,
      repositoryControlsExposed: false,
      diagnosticAutoLaunches: false,
      candidateIdentityPreservedOnReturn: true,
      specializedGaugeState: {
        sourceImplemented: true,
        engineeringVerified: true,
        merged: true,
        publicPostMergeReceipt: 'NOT_RECORDED',
        programClosure: false
      },
      heldFalseClaims: [
        'PRODUCT_FAILURE_CONFIRMED',
        'PRODUCT_ACCEPTANCE_GRANTED',
        'DEFAULT_PROMOTION_COMPLETED',
        'PUBLIC_DEFAULT_REVERIFIED'
      ],
      currentModuleBlob: '85114a9431a774ee8583277f62bbbcdb037f3bdd',
      stopBoundary: 'STOP_AFTER_REPLAY_AND_DISCLOSURE_FETCH_BACK'
    },
    B4: {
      status: 'PASS_ENGINEERING_OPEN_FOR_USER_DIFFERENTIAL',
      presentationArchitecture: 'EXPLICIT_QUERY_GATED_PUBLIC_CANDIDATE',
      candidateModeObservatoryEntryVisible: true,
      candidateModeDirectFd05Hidden: true,
      defaultModeDirectFd05Visible: true,
      defaultModeObservatoryEntryHidden: true,
      baselinePublicDefaultPresentationPreserved: true,
      hEarthHostBlob: '933d8ddfb38addc9c720f8d2258071f298570771',
      runtimeSourceMutations: 0,
      userVisibleDifferentialOpenThrough: 'B9'
    },
    B5: {
      status: 'PASS_CLOSED',
      executedHead: '0c4f7e5ecb80ca0902abeca5fd4e05c01992694f',
      workflowRunId: 30590521201,
      assertionCount: 43,
      failedAssertionCount: 0,
      exactChangedPathCount: 7,
      unauthorizedChangedPaths: 0,
      protectedPathMutations: 0,
      specializedGaugeContractMutation: false,
      baselinePublicDefaultPresentationPreserved: true,
      boundedLiveAdmissionAuthorized: true,
      boundedLiveAdmissionReceiptDigest: 'fnv1a32:78c9d027',
      receiptSha256: 'c55bda219eefbe581af8a0fc4c05cde6967aff550a2abf9a1e15e92a0ef08f27'
    },
    B6: {
      status: 'PASS_CLOSED',
      executedHead: '0c4f7e5ecb80ca0902abeca5fd4e05c01992694f',
      workflowRunId: 30590521201,
      assertionCount: 47,
      failedAssertionCount: 0,
      defaultModeVerified: true,
      candidateModeVerified: true,
      desktopTraversalPass: true,
      mobileTraversalPass: true,
      instrumentReachabilityPass: true,
      pageErrors: 0,
      unexpectedConsoleErrors: 0,
      candidateOwnedHttpFailures: 0,
      receiptSha256: 'd6add75ec8a69013da93a644759d9f428a9563c6b86f75f7a7379b5cbd014978'
    },
    B7: {
      status: 'PASS_AUTHORITY_ESTABLISHED_PENDING_CANDIDATE_SOURCE_MERGE',
      admissionArchitecture: 'EXISTING_EXPLICIT_QUERY_GATED_PUBLIC_ROUTE_PATTERN',
      boundedLiveAdmissionAuthorized: true,
      candidateLiveAvailableAfterSourceMerge: true,
      acceptedPublicDefaultPresentationChanged: false,
      productAccepted: false,
      userDifferentialRecorded: false,
      defaultPromoted: false,
      requiredMergeBoundary: 'CANDIDATE_SOURCE_ADMISSION_ONLY_NOT_DEFAULT_PROMOTION'
    },
    B8: { status: 'NOT_STARTED' }
  },
  boundaries: {
    acceptedPublicDefaultPresentationChanged: false,
    candidateMayReplaceAcceptedDefault: false,
    candidateSourceMergeAuthorizedForBoundedAdmission: true,
    userDifferentialRequiredBeforePromotion: true,
    userDifferentialRecorded: false,
    defaultPromoted: false,
    keyboardTraversalRequirement: false,
    specializedGaugeContractMutationAuthorized: false
  },
  currentCheckpoint: 'B7_BOUNDED_PUBLIC_CANDIDATE_ADMISSION',
  lastPassClosedCheckpoint: 'B6_EXACT_BROWSER_AND_TRAVERSAL_REGRESSION_EXECUTION',
  nextAuthorizedEvent: 'FINAL_EXACT_HEAD_REVALIDATION_THEN_CANDIDATE_SOURCE_MERGE',
  stopBoundary: 'STOP_AFTER_B8_PUBLIC_CANDIDATE_VERIFICATION_WAITING_FOR_USER_DIFFERENTIAL'
});

export default H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001;
