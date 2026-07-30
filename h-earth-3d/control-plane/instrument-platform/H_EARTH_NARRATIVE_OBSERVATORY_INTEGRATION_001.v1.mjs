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
    'ACCEPTED_CP2_RENDERER',
    'RUN_8B_TERRAIN',
    'CURRENT_LIVE_GPU_BINDING',
    'RUN_8E_GPU_INTEGRATION',
    'NAVIGATION_AUTHORITY',
    'GESTURE_INTAKE',
    'CAMERA_INTEGRATION',
    'WORLD_GEOMETRY',
    'VEGETATION',
    'SPECIALIZED_GAUGE_CHECK_MATRIX',
    'SPECIALIZED_GAUGE_READINESS_KERNEL'
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
    B2: { status: 'NOT_STARTED' },
    B3: { status: 'NOT_STARTED' },
    B4: { status: 'NOT_STARTED', userVisibleDifferentialOpenThrough: 'B9' },
    B5: { status: 'NOT_STARTED' },
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
  currentCheckpoint: 'B2_STANDALONE_OBSERVATORY_IMPLEMENTATION',
  lastPassClosedCheckpoint: 'B1_FINAL_SOURCE_SCOPE_AND_BRANCH_FREEZE',
  nextAuthorizedEvent: 'IMPLEMENT_STANDALONE_OBSERVATORY_ROUTE'
});

export default H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001;
