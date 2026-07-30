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
  route: '/showroom/globe/h-earth/observatory/',
  routeIdentity: 'THE_H_EARTH_OBSERVATORY',
  entryText: 'HOW_THIS_WORLD_IS_PRESERVED',
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
      fetchedBackModuleBlob: '80462e5de9e86ecedba54e365bdf6a37de3f4d42',
      stopBoundary: 'STOP_AFTER_REPLAY_AND_DISCLOSURE_FETCH_BACK'
    },
    B4: {
      status: 'PASS_ENGINEERING_OPEN_FOR_USER_DIFFERENTIAL',
      hEarthHeaderChanged: true,
      observatoryEntryAdded: true,
      fd05DirectHeaderEntryRemoved: true,
      fd05AvailableBehindObservatory: true,
      hEarthHostBlob: 'c94507a1128c27669735c87e635957cd4abce363',
      hEarthPresentationAdditions: 1,
      hEarthPresentationDeletions: 1,
      runtimeSourceMutations: 0,
      userVisibleDifferentialOpenThrough: 'B9'
    },
    B5: { status: 'IN_PROGRESS' },
    B6: { status: 'NOT_STARTED' },
    B7: { status: 'NOT_STARTED' },
    B8: { status: 'NOT_STARTED' }
  },
  boundaries: {
    acceptedPublicDefaultChanged: false,
    candidateMayReplaceAcceptedDefault: false,
    userDifferentialRequiredBeforePromotion: true,
    keyboardTraversalRequirement: false,
    specializedGaugeContractMutationAuthorized: false
  },
  currentCheckpoint: 'B5_DETERMINISTIC_AND_STATIC_CONTRACT_VERIFICATION',
  lastPassClosedCheckpoint: 'B3_READ_ONLY_SESSION_REPLAY_AND_PROGRESSIVE_DISCLOSURE_IMPLEMENTATION',
  lastEngineeringPassCheckpoint: 'B4_H_EARTH_OBSERVATORY_ENTRY_AND_FD_05_RELOCATION',
  nextAuthorizedEvent: 'EXECUTE_STATIC_AND_DETERMINISTIC_VERIFICATION'
});

export default H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001;
