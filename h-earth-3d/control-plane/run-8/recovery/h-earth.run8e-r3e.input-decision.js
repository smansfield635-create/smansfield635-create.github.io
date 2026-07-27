const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3E_INPUT_DECISION_ID =
  'H_EARTH_RUN_8E_R3E_PUBLIC_ROUTE_INTEGRATION_INPUT_DECISION_v1';

export const H_EARTH_RUN_8E_R3E_INPUT_DECISION = freeze({
  decisionId: H_EARTH_RUN_8E_R3E_INPUT_DECISION_ID,
  decisionClass: 'NEXT_CHECKPOINT_INPUT_DISPOSITION',
  issuedByCheckpoint: 'RUN_8E_R3D5',
  targetCheckpoint: 'RUN_8E_R3E',
  targetName: 'PUBLIC_ROUTE_BRANCH_INTEGRATION',
  currentTargetStatus: 'NOT_STARTED',
  disposition: 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT',
  authorizedNextAction: 'CREATE_SEPARATE_R3E_BRANCH_FROM_R3D5_FINAL_EXACT_HEAD',
  baseRequirement: {
    symbolicBase: 'R3D5_FINAL_EXACT_HEAD',
    exactHeadKnownOnlyAfterR3D5FinalValidation: true,
    stackDirectlyOnR3D5: true,
    mergeOrRebaseBeforeR3EExecution: false
  },
  admittedInputs: {
    navigationAuthority: {
      path: '/showroom/globe/h-earth/functional-landscape/navigation.js',
      gitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
      mutationPosture: 'PROTECTED_READ_ONLY_INPUT'
    },
    r3AFramePacketAuthority: {
      path: '/showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js',
      gitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
      mutationPosture: 'PROTECTED_READ_ONLY_INPUT'
    },
    r3CPersistentRenderer: {
      path: '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js',
      gitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
      mutationPosture: 'PROTECTED_READ_ONLY_INPUT_UNLESS_R3E_SEPARATELY_JUSTIFIES_CHANGE'
    },
    r3D2PointerTouchIntake: {
      path: '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js',
      gitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
      mutationPosture: 'ADMITTED_INTEGRATION_INPUT'
    },
    r3D3LiveGpuBinding: {
      path: '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
      gitBlob: '5017bbaf857a644287cb829037b0fde4646f270d',
      mutationPosture: 'ADMITTED_INTEGRATION_INPUT'
    },
    publicRouteWitness: {
      path: '/showroom/globe/h-earth/index.html',
      gitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
      mutationPosture: 'R3E_CANDIDATE_MUTATION_TARGET_REQUIRES_EXACT_SCOPE'
    },
    publicDirectManipulationWitness: {
      path: '/showroom/globe/h-earth/functional-landscape/direct-manipulation.js',
      gitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b',
      mutationPosture: 'R3E_CANDIDATE_REPLACEMENT_OR_RETIREMENT_TARGET_REQUIRES_EXACT_SCOPE'
    }
  },
  requiredR3EObjective: [
    'BIND_THE_ACCEPTED_LIVE_GPU_CAMERA_RESPONSE_TO_THE_PUBLIC_H_EARTH_ROUTE',
    'REMOVE_OR_BYPASS_FLAT_BITMAP_PREVIEW_BEHAVIOR_FROM_THE_PUBLIC_INTERACTION_PATH',
    'PRESERVE_BUILD_WORLD_ONCE_AND_DO_NOT_REBUILD_BECAUSE_CAMERA_MOVED',
    'PRESERVE_NAVIGATION_PROPOSAL_AUTHORITY',
    'PRESERVE_PERSISTENT_GPU_RESOURCE_IDENTITY',
    'DECLARE_EXACT_PUBLIC_INTEGRATION_PATH_SET_BEFORE_MUTATION',
    'PRODUCE_REAL_BROWSER_EVIDENCE_BEFORE_R3E_PASS_CLOSED'
  ],
  requiredR3EBoundaries: {
    exactMutationScopeMustBeDeclared: true,
    noDeploymentInsideInitialR3EConstruction: true,
    noPhysicalDeviceAcceptanceClaim: true,
    noR3FWork: true,
    noR3GWork: true,
    noRun8EPassClaim: true,
    noImplicitMainMerge: true
  },
  currentExecution: {
    r3EBranchCreated: false,
    publicRouteMutated: false,
    publicDirectManipulationMutated: false,
    liveRouteBound: false,
    browserValidationPerformed: false,
    deploymentPerformed: false,
    physicalDeviceAcceptancePerformed: false
  },
  stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
});

export function evaluateHEarthRun8ER3EInputDecision(candidate = H_EARTH_RUN_8E_R3E_INPUT_DECISION) {
  const issues = [];
  if (candidate?.decisionId !== H_EARTH_RUN_8E_R3E_INPUT_DECISION_ID) issues.push('R3E_INPUT_DECISION_ID_MISMATCH');
  if (candidate?.issuedByCheckpoint !== 'RUN_8E_R3D5') issues.push('R3E_INPUT_ISSUER_INVALID');
  if (candidate?.targetCheckpoint !== 'RUN_8E_R3E' || candidate?.currentTargetStatus !== 'NOT_STARTED') issues.push('R3E_TARGET_STATE_INVALID');
  if (candidate?.disposition !== 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT') issues.push('R3E_INPUT_DISPOSITION_INVALID');
  if (candidate?.authorizedNextAction !== 'CREATE_SEPARATE_R3E_BRANCH_FROM_R3D5_FINAL_EXACT_HEAD') issues.push('R3E_NEXT_ACTION_INVALID');
  if (candidate?.baseRequirement?.symbolicBase !== 'R3D5_FINAL_EXACT_HEAD' || candidate?.baseRequirement?.stackDirectlyOnR3D5 !== true) issues.push('R3E_BASE_REQUIREMENT_INVALID');
  if (Object.keys(candidate?.admittedInputs ?? {}).length !== 7) issues.push('R3E_ADMITTED_INPUT_COUNT_INVALID');
  const exactBlobs = {
    navigationAuthority: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketAuthority: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    r3CPersistentRenderer: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    r3D2PointerTouchIntake: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    r3D3LiveGpuBinding: '5017bbaf857a644287cb829037b0fde4646f270d',
    publicRouteWitness: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicDirectManipulationWitness: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  };
  for (const [key, gitBlob] of Object.entries(exactBlobs)) {
    if (candidate?.admittedInputs?.[key]?.gitBlob !== gitBlob) issues.push(`R3E_ADMITTED_INPUT_BLOB_MISMATCH:${key}`);
  }
  if ((candidate?.requiredR3EObjective ?? []).length !== 7) issues.push('R3E_OBJECTIVE_SET_INVALID');
  for (const [key, value] of Object.entries(candidate?.requiredR3EBoundaries ?? {})) {
    if (value !== true) issues.push(`R3E_REQUIRED_BOUNDARY_MISSING:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.currentExecution ?? {})) {
    if (value !== false) issues.push(`R3E_IMPLEMENTATION_STARTED_EARLY:${key}`);
  }
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E') issues.push('R3E_INPUT_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R3E_INPUT_ADMISSIBLE_NOT_STARTED' : 'RUN_8E_R3E_INPUT_DECISION_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3E_INPUT_DECISION;
