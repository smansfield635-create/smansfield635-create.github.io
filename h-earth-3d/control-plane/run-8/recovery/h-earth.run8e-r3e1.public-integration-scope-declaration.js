const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION_ID =
  'H_EARTH_RUN_8E_R3E1_EXACT_PUBLIC_INTEGRATION_MUTATION_SCOPE_DECLARATION_v1';

export const H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION = freeze({
  declarationId: H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION_ID,
  checkpointId: 'RUN_8E_R3E1',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3e1-public-integration-scope-001',
  baseExactHead: 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7',
  currentStatus: 'EXECUTION_PENDING',
  inspectedPublicSources: {
    publicRoute: {
      path: '/showroom/globe/h-earth/index.html',
      gitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca'
    },
    publicShellCss: {
      path: '/showroom/globe/h-earth/index.css',
      gitBlob: 'f208b7f11096a7bf5da282226903ac634c1eab01'
    },
    cpuRouteController: {
      path: '/showroom/globe/h-earth/functional-landscape/index.js',
      gitBlob: '83e85df2f4440c2825672f46fb16e28c73992db2'
    },
    cpuEnvironmentIntegration: {
      path: '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
      gitBlob: '6c047d61544fcbc4fad8673abfbacb7c827fdb22'
    },
    publicDirectManipulation: {
      path: '/showroom/globe/h-earth/functional-landscape/direct-manipulation.js',
      gitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
    },
    diagnosticHostWitness: {
      path: '/showroom/globe/h-earth/diagnostic/run8e-r3d/diagnostic-host.js',
      gitBlob: 'b8bf34e7dc3a8e91000274cdabab26250888ebf0'
    }
  },
  admittedAuthorityInputs: {
    navigation: {
      path: '/showroom/globe/h-earth/functional-landscape/navigation.js',
      gitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91'
    },
    framePacket: {
      path: '/showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js',
      gitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1'
    },
    persistentRenderer: {
      path: '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js',
      gitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880'
    },
    pointerTouchIntake: {
      path: '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js',
      gitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6'
    },
    liveGpuBinding: {
      path: '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
      gitBlob: '5017bbaf857a644287cb829037b0fde4646f270d'
    }
  },
  currentPublicLoadOrder: [
    '/showroom/globe/h-earth/functional-landscape/index.js',
    '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
    '/showroom/globe/h-earth/functional-landscape/direct-manipulation.js'
  ],
  currentRuntimeOwnership: {
    canvasContextOwners: [
      'CPU_ROUTE_CONTROLLER_2D_CONTEXT',
      'CPU_ENVIRONMENT_INTEGRATION_2D_CONTEXT'
    ],
    pointerOwners: [
      'CPU_ROUTE_CONTROLLER_POINTER_DOWN_UP',
      'PUBLIC_DIRECT_MANIPULATION_CAPTURE_POINTER_LISTENERS'
    ],
    framePresentationOwners: [
      'CPU_ROUTE_CONTROLLER_PUT_IMAGE_DATA',
      'CPU_ENVIRONMENT_INTEGRATION_PUT_IMAGE_DATA',
      'PUBLIC_DIRECT_MANIPULATION_CSS_BITMAP_PREVIEW'
    ],
    deferredExecutionOwners: [
      'CPU_ROUTE_CONTROLLER_RERENDER_MICROTASK',
      'CPU_ENVIRONMENT_INTEGRATION_RENDER_TIMER_AND_LOOP',
      'PUBLIC_DIRECT_MANIPULATION_NAVIGATION_PROMISE_CHAIN',
      'PUBLIC_DIRECT_MANIPULATION_SETTLED_REFRESH_TIMER'
    ]
  },
  collisionFindings: [
    'PUBLIC_CANVAS_IS_CLAIMED_AS_2D_BEFORE_WEBGL2_CAN_BE_CREATED',
    'TWO_CPU_PUT_IMAGE_DATA_PRESENTATION_PATHS_EXIST',
    'POINTER_LISTENERS_EXIST_IN_BOTH_INDEX_JS_AND_DIRECT_MANIPULATION_JS',
    'DIRECT_MANIPULATION_APPLIES_CSS_TRANSLATE3D_AND_SCALE_TO_THE_OLD_CANVAS_BITMAP',
    'DIRECT_MANIPULATION_SERIALIZES_NAVIGATION_THROUGH_A_PROMISE_CHAIN',
    'DIRECT_MANIPULATION_DEFERS_SUCCESSOR_REFRESH_UNTIL_GESTURE_SETTLEMENT',
    'ENVIRONMENT_INTEGRATION_OWNS_A_TIMER_COALESCED_CPU_RENDER_LOOP',
    'R3D3_GPU_BINDING_CANNOT_LAWFULLY_RUN_ALONGSIDE_THE_EXISTING_THREE_SCRIPT_LOAD_GRAPH'
  ],
  exactFutureMutationScope: [
    {
      path: '/showroom/globe/h-earth/index.html',
      mutationClass: 'MODIFY_EXISTING_PUBLIC_LOAD_ORDER_ONLY',
      allowedChanges: [
        'REMOVE_LEGACY_THREE_MODULE_SCRIPT_PARTICIPATION',
        'ADD_ONE_PUBLIC_GPU_ORCHESTRATOR_MODULE_SCRIPT',
        'UPDATE_PUBLIC_RUNTIME_DATA_ATTRIBUTES_IF_REQUIRED_FOR_INSPECTION'
      ],
      prohibitedChanges: [
        'PUBLIC_COPY_REDESIGN',
        'PUBLIC_LAYOUT_REDESIGN',
        'CANVAS_OR_HUD_IDENTITY_REPLACEMENT',
        'STYLE_SYSTEM_REPLACEMENT'
      ]
    },
    {
      path: '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
      mutationClass: 'CREATE_NEW_PUBLIC_ORCHESTRATION_MODULE',
      allowedChanges: [
        'IMPORT_ACCEPTED_R3D2_POINTER_TOUCH_INTAKE',
        'IMPORT_ACCEPTED_R3D3_LIVE_GPU_BINDING',
        'BIND_EXISTING_PUBLIC_CANVAS_AND_STATUS_HUD',
        'EXPOSE_PUBLIC_RUNTIME_RECEIPT_AND_EXCLUSIVITY_COUNTERS',
        'DECLARE_ONE_ACTIVE_INPUT_AND_PRESENTATION_CORRIDOR'
      ],
      prohibitedChanges: [
        'NEW_NAVIGATION_AUTHORITY',
        'NEW_CAMERA_AUTHORITY',
        'NEW_INPUT_SEMANTICS',
        'NEW_RENDER_PACKAGE',
        'NEW_RENDERER_ARCHITECTURE',
        'CPU_WORLD_RASTERIZATION',
        'CSS_BITMAP_PREVIEW',
        'DEFERRED_SETTLED_REFRESH_CHAIN'
      ]
    }
  ],
  protectedFutureWitnesses: [
    '/showroom/globe/h-earth/index.css',
    '/showroom/globe/h-earth/functional-landscape/index.css',
    '/showroom/globe/h-earth/functional-landscape/index.js',
    '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
    '/showroom/globe/h-earth/functional-landscape/direct-manipulation.js',
    '/showroom/globe/h-earth/functional-landscape/navigation.js',
    '/showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js',
    '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js',
    '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js',
    '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
    '/showroom/globe/h-earth/diagnostic/run8e-r3d/diagnostic-host.js'
  ],
  intendedPublicLoadOrder: [
    'PUBLIC_HTML_AND_EXISTING_CSS',
    'PUBLIC_LIVE_GPU_ORCHESTRATOR_MODULE',
    'R3D2_POINTER_TOUCH_INTAKE_IMPORT',
    'EXISTING_NAVIGATION_AUTHORITY_IMPORT',
    'R3D3_LIVE_GPU_BINDING_IMPORT',
    'R3A_FRAME_PACKET_IMPORT',
    'R3C_PERSISTENT_RENDERER_IMPORT'
  ],
  intendedExclusiveRuntime: {
    activeWebGL2ContextCount: 1,
    activePersistentRendererCount: 1,
    activeNavigationStateStreamCount: 1,
    activePointerTouchIntakeCount: 1,
    activeFramePresentationAuthorityCount: 1,
    legacyCpuRouteControllerLoaded: false,
    legacyCpuEnvironmentIntegrationLoaded: false,
    legacyPublicDirectManipulationLoaded: false,
    cpuWorldRebuildPerCameraChange: false,
    cssBitmapPreview: false,
    duplicatePointerListeners: false,
    deferredPublicRefresh: false
  },
  rollbackGroups: [
    {
      groupId: 'R3E_PUBLIC_HTML_LOAD_ORDER',
      operation: 'RESTORE_PUBLIC_ROUTE_FILE_TO_GIT_BLOB_b5f72fb70f59276f868a5894ee0c5e8beccc40ca'
    },
    {
      groupId: 'R3E_PUBLIC_GPU_ORCHESTRATOR',
      operation: 'DELETE_NEW_PUBLIC_ORCHESTRATION_MODULE'
    }
  ],
  boundaries: {
    publicSourceMutationPerformed: false,
    publicRouteBound: false,
    browserExecuted: false,
    gpuExecuted: false,
    r3E2WorkStarted: false,
    deploymentPerformed: false,
    physicalDeviceAcceptancePerformed: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3E2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2'
});

export function evaluateHEarthRun8ER3E1ScopeDeclaration(candidate = H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION) {
  const issues = [];
  if (candidate?.declarationId !== H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION_ID) issues.push('R3E1_DECLARATION_ID_MISMATCH');
  if (candidate?.baseExactHead !== 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7') issues.push('R3E1_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3E1_STATUS_INVALID');
  if ((candidate?.exactFutureMutationScope ?? []).length !== 2) issues.push('R3E1_MUTATION_SCOPE_COUNT_INVALID');
  const scopePaths = (candidate?.exactFutureMutationScope ?? []).map((entry) => entry.path);
  if (scopePaths[0] !== '/showroom/globe/h-earth/index.html') issues.push('R3E1_PUBLIC_ROUTE_PATH_MISSING');
  if (scopePaths[1] !== '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js') issues.push('R3E1_ORCHESTRATOR_PATH_MISSING');
  if ((candidate?.collisionFindings ?? []).length !== 8) issues.push('R3E1_COLLISION_FINDING_COUNT_INVALID');
  if ((candidate?.protectedFutureWitnesses ?? []).length !== 11) issues.push('R3E1_PROTECTED_WITNESS_COUNT_INVALID');
  if ((candidate?.rollbackGroups ?? []).length !== 2) issues.push('R3E1_ROLLBACK_GROUP_COUNT_INVALID');
  for (const [key, value] of Object.entries(candidate?.intendedExclusiveRuntime ?? {})) {
    if (key.startsWith('active')) {
      if (value !== 1) issues.push(`R3E1_EXCLUSIVE_COUNT_INVALID:${key}`);
    } else if (value !== false) {
      issues.push(`R3E1_LEGACY_RUNTIME_NOT_DISABLED:${key}`);
    }
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3E1_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E2_NOT_STARTED') issues.push('R3E2_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2') issues.push('R3E1_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E1_SCOPE_PASS_CLOSED' : 'RUN_8E_R3E1_SCOPE_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3E1_SCOPE_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION;
