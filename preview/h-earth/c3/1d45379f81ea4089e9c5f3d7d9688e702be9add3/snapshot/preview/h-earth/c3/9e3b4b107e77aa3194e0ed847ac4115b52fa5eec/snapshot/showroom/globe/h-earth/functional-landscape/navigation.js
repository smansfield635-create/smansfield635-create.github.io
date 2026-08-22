/**
 * /showroom/globe/h-earth/functional-landscape/navigation.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_RUN_6F_v1
 *
 * Bounded navigation and terrain-clearance proposal adapter. It consumes the
 * existing camera capacity, canonical terrain field, and realization planner.
 * It does not own canonical camera state, collision, physics, walking actors,
 * terrain identity, renderer state, or public-route authority.
 */

import {
  H_EARTH_3D_CAMERA_CAPACITY
} from '../capacity.js';

import {
  sampleHEarthTerrainField
} from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN
} from '../../../../h-earth-3d/integration/h-earth.landscape-realization-planner.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) =>
  typeof value === 'number' && Number.isFinite(value);

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const normalizeDegrees = (value) => {
  let result = value % 360;
  if (result > 180) {
    result -= 360;
  }
  if (result < -180) {
    result += 360;
  }
  return result;
};

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_RUN_6F_v1';

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE = freeze({
  contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
  eyeHeight: 2.25,
  minimumTerrainClearance: 1.6,
  movementStepWorldUnits: 5,
  maximumMovementIntentWorldUnits: 12,
  lookDistanceWorldUnits: 18,
  turnStepDegrees: 6,
  pitchStepDegrees: 4,
  pitchMinimumDegrees: -42,
  pitchMaximumDegrees: 32,
  verticalFovMinimumDegrees:
    H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity
      .verticalFovDegrees.minimum,
  verticalFovMaximumDegrees:
    H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity
      .verticalFovDegrees.maximum,
  nearPlane:
    H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.nearPlane,
  farPlane:
    H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.farPlane,
  selectionProjectionModel:
    'CHUNK_LOCAL_NEAREST_AVAILABLE_TERRAIN_MEMBER',
  authority: {
    emitsCameraProposal: true,
    validatesTerrainClearance: true,
    retainsLastLawfulStateForRecovery: true,
    ownsCanonicalCameraState: false,
    ownsTerrainField: false,
    ownsSemanticAddressIdentity: false,
    ownsCollisionOrPhysics: false,
    ownsRenderer: false
  }
});

export const H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS = freeze({
  COAST: {
    waypointId: 'COAST',
    label: 'Coastal entry',
    position: { x: 0, z: -96 },
    yawDegrees: 0,
    pitchDegrees: -8
  },
  BERM: {
    waypointId: 'BERM',
    label: 'Coastal berm',
    position: { x: 0, z: -132 },
    yawDegrees: 0,
    pitchDegrees: -7
  },
  LOWLAND: {
    waypointId: 'LOWLAND',
    label: 'Lowland',
    position: { x: -42, z: -158 },
    yawDegrees: -18,
    pitchDegrees: -6
  },
  HILL: {
    waypointId: 'HILL',
    label: 'Navigable hill',
    position: { x: 72, z: -172 },
    yawDegrees: 18,
    pitchDegrees: -8
  },
  RIDGE: {
    waypointId: 'RIDGE',
    label: 'Ridge or bluff',
    position: { x: 145, z: -225 },
    yawDegrees: 12,
    pitchDegrees: -10
  }
});

const terrainChunks = () =>
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks.filter((chunk) =>
    chunk.terrainMemberAddressIds.length > 0 &&
    chunk.physicalRole.includes('TERRAIN')
  );

export function resolveHEarthNavigableTerrainChunk(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) {
    return null;
  }
  const epsilon = 1e-8;
  return terrainChunks()
    .filter((chunk) =>
      worldX >= chunk.worldBounds.xMin - epsilon &&
      worldX <= chunk.worldBounds.xMax + epsilon &&
      worldZ >= chunk.worldBounds.zMin - epsilon &&
      worldZ <= chunk.worldBounds.zMax + epsilon
    )
    .sort((left, right) => left.chunkId.localeCompare(right.chunkId))[0] ?? null;
}

function parseAddress(address) {
  const match = /:R(\d+):C(\d+)$/.exec(address);
  if (!match) {
    return null;
  }
  return {
    address,
    row: Number(match[1]),
    column: Number(match[2])
  };
}

function resolveSemanticSelection(chunk, worldX, worldZ) {
  const candidates = chunk.terrainMemberAddressIds
    .map(parseAddress)
    .filter(Boolean);
  if (candidates.length === 0) {
    return freeze({
      selectedSemanticAddressId: null,
      selectionProjectionModel:
        H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE
          .selectionProjectionModel
    });
  }

  const xProgress = clamp(
    (worldX - chunk.worldBounds.xMin) /
      Math.max(1e-8, chunk.worldBounds.xMax - chunk.worldBounds.xMin),
    0,
    0.999999
  );
  const zProgress = clamp(
    (worldZ - chunk.worldBounds.zMin) /
      Math.max(1e-8, chunk.worldBounds.zMax - chunk.worldBounds.zMin),
    0,
    0.999999
  );
  const targetColumn = chunk.addressRange.columnMin +
    Math.floor(xProgress * 4);
  const targetRow = chunk.addressRange.rowMin +
    Math.floor(zProgress * 4);

  const selected = [...candidates].sort((left, right) => {
    const leftDistance =
      Math.abs(left.row - targetRow) +
      Math.abs(left.column - targetColumn);
    const rightDistance =
      Math.abs(right.row - targetRow) +
      Math.abs(right.column - targetColumn);
    return leftDistance - rightDistance ||
      left.address.localeCompare(right.address);
  })[0];

  return freeze({
    selectedSemanticAddressId: selected.address,
    targetSemanticCoordinate: {
      row: targetRow,
      column: targetColumn
    },
    selectionProjectionModel:
      H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE
        .selectionProjectionModel
  });
}

function resolveLawfulPosition({
  worldX,
  worldZ,
  requestedY = null
}) {
  const chunk = resolveHEarthNavigableTerrainChunk(worldX, worldZ);
  if (!chunk) {
    return freeze({
      eligible: false,
      status: 'POSITION_OUTSIDE_NAVIGABLE_TERRAIN',
      issues: ['NO_NAVIGABLE_TERRAIN_CHUNK']
    });
  }

  const terrainSample = sampleHEarthTerrainField(worldX, worldZ);
  if (terrainSample?.valid !== true ||
      !finite(terrainSample.elevation)) {
    return freeze({
      eligible: false,
      status: 'TERRAIN_SAMPLE_INVALID',
      issues: ['CANONICAL_TERRAIN_SAMPLE_INVALID']
    });
  }

  const profile = H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  const minimumY = terrainSample.elevation +
    profile.minimumTerrainClearance;
  const lawfulY = terrainSample.elevation + profile.eyeHeight;
  const requestedYFinite = requestedY === null || finite(requestedY);
  const belowTerrain = finite(requestedY) && requestedY < minimumY;
  const recovered = !requestedYFinite || belowTerrain;
  const selection = resolveSemanticSelection(chunk, worldX, worldZ);

  return freeze({
    eligible: true,
    status: recovered
      ? 'POSITION_RECOVERED_TO_TERRAIN_CLEARANCE'
      : 'POSITION_TERRAIN_CLEARANCE_PASS',
    position: {
      x: worldX,
      y: recovered || requestedY === null
        ? lawfulY
        : Math.max(requestedY, lawfulY),
      z: worldZ
    },
    terrainElevation: terrainSample.elevation,
    minimumCameraY: minimumY,
    clearance:
      (recovered || requestedY === null
        ? lawfulY
        : Math.max(requestedY, lawfulY)) -
      terrainSample.elevation,
    recovered,
    recoveryReason: !requestedYFinite
      ? 'NONFINITE_CAMERA_ELEVATION'
      : belowTerrain
        ? 'CAMERA_BELOW_MINIMUM_TERRAIN_CLEARANCE'
        : null,
    chunkId: chunk.chunkId,
    physicalRole: chunk.physicalRole,
    formationIds: chunk.formationIds,
    selectedSemanticAddressId:
      selection.selectedSemanticAddressId,
    selectionProjectionModel:
      selection.selectionProjectionModel,
    terrainSample,
    issues: []
  });
}

function createState({
  positionResult,
  yawDegrees,
  pitchDegrees,
  verticalFovDegrees,
  sequence,
  action,
  accepted,
  recovered,
  rejectionReason = null
}) {
  const profile = H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  return freeze({
    contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
    stateId: `H_EARTH_NAVIGATION_STATE_${String(sequence).padStart(4, '0')}`,
    sequence,
    action,
    accepted,
    recovered,
    rejectionReason,
    position: positionResult.position,
    yawDegrees: normalizeDegrees(yawDegrees),
    pitchDegrees: clamp(
      pitchDegrees,
      profile.pitchMinimumDegrees,
      profile.pitchMaximumDegrees
    ),
    verticalFovDegrees: clamp(
      verticalFovDegrees,
      profile.verticalFovMinimumDegrees,
      profile.verticalFovMaximumDegrees
    ),
    terrainElevation: positionResult.terrainElevation,
    minimumCameraY: positionResult.minimumCameraY,
    clearance: positionResult.clearance,
    chunkId: positionResult.chunkId,
    physicalRole: positionResult.physicalRole,
    formationIds: positionResult.formationIds,
    selectedSemanticAddressId:
      positionResult.selectedSemanticAddressId,
    selectionProjectionModel:
      positionResult.selectionProjectionModel,
    terrainClearanceReceiptId:
      `H_EARTH_TERRAIN_CLEARANCE_RECEIPT_${String(sequence).padStart(4, '0')}`,
    canonicalCameraStateAuthority: false,
    collisionOrPhysicsClaim: false
  });
}

export function createHEarthFunctionalLandscapeNavigationState({
  waypointId = 'COAST'
} = {}) {
  const waypoint = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[waypointId] ??
    H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST;
  const positionResult = resolveLawfulPosition({
    worldX: waypoint.position.x,
    worldZ: waypoint.position.z
  });
  if (!positionResult.eligible) {
    return freeze({
      ok: false,
      status: 'INITIAL_NAVIGATION_STATE_REJECTED',
      issues: positionResult.issues
    });
  }
  return freeze({
    ok: true,
    status: 'INITIAL_NAVIGATION_STATE_COMPLETE',
    state: createState({
      positionResult,
      yawDegrees: waypoint.yawDegrees,
      pitchDegrees: waypoint.pitchDegrees,
      verticalFovDegrees: 56,
      sequence: 1,
      action: `GOTO_WAYPOINT:${waypoint.waypointId}`,
      accepted: true,
      recovered: false
    }),
    issues: []
  });
}

function translationForAction(state, action, magnitude) {
  const yawRadians = state.yawDegrees * Math.PI / 180;
  const forward = {
    x: Math.sin(yawRadians),
    z: -Math.cos(yawRadians)
  };
  const right = {
    x: Math.cos(yawRadians),
    z: Math.sin(yawRadians)
  };

  switch (action) {
    case 'MOVE_FORWARD':
      return { x: forward.x * magnitude, z: forward.z * magnitude };
    case 'MOVE_BACKWARD':
      return { x: -forward.x * magnitude, z: -forward.z * magnitude };
    case 'STRAFE_LEFT':
      return { x: -right.x * magnitude, z: -right.z * magnitude };
    case 'STRAFE_RIGHT':
      return { x: right.x * magnitude, z: right.z * magnitude };
    default:
      return { x: 0, z: 0 };
  }
}

export function proposeHEarthFunctionalLandscapeNavigation(
  currentState,
  intent = {}
) {
  if (!currentState ||
      currentState.contractId !==
        H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID) {
    return freeze({
      ok: false,
      status: 'NAVIGATION_PROPOSAL_REJECTED',
      state: currentState ?? null,
      issues: ['CURRENT_NAVIGATION_STATE_INVALID']
    });
  }

  const action = typeof intent.action === 'string'
    ? intent.action
    : 'NO_OP';
  const sequence = currentState.sequence + 1;
  const profile = H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  let proposedX = currentState.position.x;
  let proposedZ = currentState.position.z;
  let requestedY = currentState.position.y;
  let yawDegrees = currentState.yawDegrees;
  let pitchDegrees = currentState.pitchDegrees;
  let verticalFovDegrees = currentState.verticalFovDegrees;

  if (action === 'RESET') {
    const reset = createHEarthFunctionalLandscapeNavigationState();
    return freeze({
      ok: reset.ok,
      status: reset.ok
        ? 'NAVIGATION_RESET_COMPLETE'
        : 'NAVIGATION_RESET_FAILED',
      state: reset.ok
        ? createState({
            positionResult: resolveLawfulPosition({
              worldX: reset.state.position.x,
              worldZ: reset.state.position.z
            }),
            yawDegrees: reset.state.yawDegrees,
            pitchDegrees: reset.state.pitchDegrees,
            verticalFovDegrees: reset.state.verticalFovDegrees,
            sequence,
            action,
            accepted: true,
            recovered: false
          })
        : currentState,
      issues: reset.issues
    });
  }

  if (action === 'GOTO_WAYPOINT') {
    const waypoint = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[
      intent.waypointId
    ];
    if (!waypoint) {
      return freeze({
        ok: false,
        status: 'NAVIGATION_WAYPOINT_REJECTED',
        state: createState({
          positionResult: resolveLawfulPosition({
            worldX: currentState.position.x,
            worldZ: currentState.position.z,
            requestedY: currentState.position.y
          }),
          yawDegrees,
          pitchDegrees,
          verticalFovDegrees,
          sequence,
          action,
          accepted: false,
          recovered: false,
          rejectionReason: 'UNKNOWN_WAYPOINT'
        }),
        issues: ['UNKNOWN_WAYPOINT']
      });
    }
    proposedX = waypoint.position.x;
    proposedZ = waypoint.position.z;
    requestedY = null;
    yawDegrees = waypoint.yawDegrees;
    pitchDegrees = waypoint.pitchDegrees;
  } else if ([
    'MOVE_FORWARD',
    'MOVE_BACKWARD',
    'STRAFE_LEFT',
    'STRAFE_RIGHT'
  ].includes(action)) {
    const magnitude = clamp(
      finite(intent.magnitude)
        ? Math.abs(intent.magnitude)
        : profile.movementStepWorldUnits,
      0,
      profile.maximumMovementIntentWorldUnits
    );
    const translation = translationForAction(
      currentState,
      action,
      magnitude
    );
    proposedX += translation.x;
    proposedZ += translation.z;
    requestedY = null;
  } else if (action === 'TURN_LEFT') {
    yawDegrees -= clamp(
      finite(intent.degrees)
        ? Math.abs(intent.degrees)
        : profile.turnStepDegrees,
      0,
      8
    );
  } else if (action === 'TURN_RIGHT') {
    yawDegrees += clamp(
      finite(intent.degrees)
        ? Math.abs(intent.degrees)
        : profile.turnStepDegrees,
      0,
      8
    );
  } else if (action === 'PITCH_UP') {
    pitchDegrees += clamp(
      finite(intent.degrees)
        ? Math.abs(intent.degrees)
        : profile.pitchStepDegrees,
      0,
      8
    );
  } else if (action === 'PITCH_DOWN') {
    pitchDegrees -= clamp(
      finite(intent.degrees)
        ? Math.abs(intent.degrees)
        : profile.pitchStepDegrees,
      0,
      8
    );
  } else if (action === 'ZOOM_IN') {
    verticalFovDegrees -= clamp(
      finite(intent.degrees) ? Math.abs(intent.degrees) : 3,
      0,
      6
    );
  } else if (action === 'ZOOM_OUT') {
    verticalFovDegrees += clamp(
      finite(intent.degrees) ? Math.abs(intent.degrees) : 3,
      0,
      6
    );
  } else if (action === 'SET_CAMERA_POSITION') {
    proposedX = intent.position?.x;
    proposedZ = intent.position?.z;
    requestedY = intent.position?.y;
  }

  const positionResult = resolveLawfulPosition({
    worldX: proposedX,
    worldZ: proposedZ,
    requestedY
  });

  if (!positionResult.eligible) {
    const preservedPosition = resolveLawfulPosition({
      worldX: currentState.position.x,
      worldZ: currentState.position.z,
      requestedY: currentState.position.y
    });
    return freeze({
      ok: false,
      status: 'NAVIGATION_PROPOSAL_REJECTED_STATE_PRESERVED',
      state: createState({
        positionResult: preservedPosition,
        yawDegrees: currentState.yawDegrees,
        pitchDegrees: currentState.pitchDegrees,
        verticalFovDegrees: currentState.verticalFovDegrees,
        sequence,
        action,
        accepted: false,
        recovered: false,
        rejectionReason: positionResult.status
      }),
      issues: positionResult.issues
    });
  }

  const state = createState({
    positionResult,
    yawDegrees,
    pitchDegrees,
    verticalFovDegrees,
    sequence,
    action,
    accepted: true,
    recovered: positionResult.recovered
  });

  return freeze({
    ok: true,
    status: positionResult.recovered
      ? 'NAVIGATION_PROPOSAL_ACCEPTED_WITH_TERRAIN_RECOVERY'
      : 'NAVIGATION_PROPOSAL_ACCEPTED',
    state,
    issues: []
  });
}

export function createHEarthFunctionalLandscapeCamera(state) {
  if (!state ||
      state.contractId !==
        H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID) {
    return null;
  }

  const yawRadians = state.yawDegrees * Math.PI / 180;
  const pitchRadians = state.pitchDegrees * Math.PI / 180;
  const horizontal = Math.cos(pitchRadians);
  const distance =
    H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE
      .lookDistanceWorldUnits;
  const direction = {
    x: Math.sin(yawRadians) * horizontal,
    y: Math.sin(pitchRadians),
    z: -Math.cos(yawRadians) * horizontal
  };

  return freeze({
    position: freeze({ ...state.position }),
    target: freeze({
      x: state.position.x + direction.x * distance,
      y: state.position.y + direction.y * distance,
      z: state.position.z + direction.z * distance
    }),
    up: freeze({ x: 0, y: 1, z: 0 }),
    verticalFovDegrees: state.verticalFovDegrees,
    nearPlane:
      H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.nearPlane,
    farPlane:
      H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.farPlane,
    sourceCapacityContractId:
      'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5',
    cameraAuthority: 'SUCCESSOR_COMPOSITOR_ACCEPTED_NAVIGATION_PROPOSAL',
    terrainClearanceReceiptId: state.terrainClearanceReceiptId
  });
}

export function evaluateHEarthFunctionalLandscapeNavigationState(state) {
  const issues = [];
  if (!state ||
      state.contractId !==
        H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID) {
    issues.push('NAVIGATION_STATE_INVALID');
  } else {
    const terrain = sampleHEarthTerrainField(
      state.position.x,
      state.position.z
    );
    if (terrain?.valid !== true) {
      issues.push('TERRAIN_SAMPLE_INVALID');
    } else if (state.position.y <
      terrain.elevation +
        H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE
          .minimumTerrainClearance) {
      issues.push('CAMERA_BELOW_TERRAIN_CLEARANCE');
    }
    if (!resolveHEarthNavigableTerrainChunk(
      state.position.x,
      state.position.z
    )) {
      issues.push('POSITION_OUTSIDE_NAVIGABLE_TERRAIN');
    }
    if (!state.selectedSemanticAddressId) {
      issues.push('SEMANTIC_SELECTION_MISSING');
    }
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'NAVIGATION_STATE_PASS'
      : 'NAVIGATION_STATE_FAIL',
    issues
  });
}
