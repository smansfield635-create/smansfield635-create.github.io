// /h-earth-3d/runtime/h-earth.deterministic-runtime.js
// COMPLETE CANDIDATE FILE
// H_EARTH_DETERMINISTIC_RUNTIME_REFERENCE_KERNEL_v1
// Headless reference kernel only. No route, renderer, traversal, or production activation.

export const H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID =
  'H_EARTH_DETERMINISTIC_RUNTIME_REFERENCE_KERNEL_v1';

export const H_EARTH_SIMULATION_STEP_MS = 50;

export const H_EARTH_VERSION_ENVELOPE = Object.freeze({
  worldSchemaVersion: '1.0.0-candidate',
  regionSpaceVersion: 'PATH_3_STEP_001',
  latticeVersion: 'PATH_3_STEP_002_256_CELL',
  summitLawVersion: 'PATH_3_STEP_007D',
  stateClassificationVersion:
    'H_EARTH_STATE_CLASSIFICATION_STANDARD_v1',
  simulationLawVersion:
    H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,
  serializationVersion:
    'H_EARTH_CANONICAL_SERIALIZATION_v1',
  randomAlgorithmVersion:
    'NONE_USED_IN_REFERENCE_KERNEL'
});

const SOURCE_PRIORITY = Object.freeze({
  CONSTITUTIONAL: 0,
  SYSTEM: 10,
  ACTOR: 20,
  ASYNC_CANDIDATE: 30,
  DIAGNOSTIC: 90,
  RENDERER: 100
});

function plainObject(value) {
  return Boolean(value) &&
    typeof value === 'object' &&
    !Array.isArray(value);
}

function clone(value) {
  if (Array.isArray(value)) {
    return value.map(clone);
  }

  if (plainObject(value)) {
    const result = {};

    for (const key of Object.keys(value)) {
      result[key] = clone(value[key]);
    }

    return result;
  }

  return value;
}

function deepFreeze(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.freeze(value);

  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }

  return value;
}

function compareText(a, b) {
  return String(a).localeCompare(
    String(b),
    'en',
    { sensitivity: 'variant' }
  );
}

export function compareHEarthIntents(a, b) {
  return (
    Number(a.targetTick) - Number(b.targetTick) ||

    (
      SOURCE_PRIORITY[a.sourceClass] ?? 999
    ) -
    (
      SOURCE_PRIORITY[b.sourceClass] ?? 999
    ) ||

    compareText(a.actorId, b.actorId) ||

    Number(a.sourceSequence) -
      Number(b.sourceSequence) ||

    compareText(a.mutationId, b.mutationId)
  );
}

export function createHEarthInitialState(
  overrides = {}
) {
  const base = {
    stateVersion: 0,
    simulationTick: 0,

    activeMatrix:
      'H-Earth',

    matrixIdentity:
      'H_EARTH_GROUND_VIEW_MATRIX',

    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    canonicalRegionCellId:
      'H_EARTH_REGION_CELL_X07_Z08',

    activeDomainCellId:
      'H_EARTH_GROUND_CELL_001',

    firstActionId:
      'INSPECT_GROUND',

    firstReadoutId:
      'GROUND_CONDITION_READ',

    firstReceiptId:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    cells: {
      H_EARTH_GROUND_CELL_001: {
        lifecycle: 'ADDRESSABLE',
        admitted: false,
        active: false,
        inspectionCount: 0,
        lastInspectionTick: null
      }
    },

    readouts: [],

    committedMutationIds: [],

    rejectedMutationIds: []
  };

  return deepFreeze(
    Object.assign(
      base,
      clone(overrides)
    )
  );
}

export function createHEarthRuntime(
  initialState = createHEarthInitialState()
) {
  return {
    committedState:
      deepFreeze(clone(initialState)),

    pendingIntents: [],

    events: [],

    receipts: []
  };
}

function rejectIntent(
  intent,
  state,
  code,
  detail = null
) {
  return {
    accepted: false,

    failureClass:
      code,

    event: {
      eventId:
        `EVENT_REJECTED_${intent.mutationId}`,

      eventType:
        'MUTATION_REJECTED',

      eventSchemaVersion:
        '1.0.0-candidate',

      simulationTick:
        state.simulationTick,

      mutationId:
        intent.mutationId,

      actorId:
        intent.actorId,

      targetId:
        intent.targetId,

      disposition:
        'REJECTED',

      failureClass:
        code,

      detail
    }
  };
}

export function validateHEarthIntent(
  intent,
  state
) {
  if (!plainObject(intent)) {
    return rejectIntent(
      {
        mutationId: 'UNKNOWN'
      },
      state,
      'INVALID_INTENT'
    );
  }

  const required = [
    'mutationId',
    'targetTick',
    'sourceClass',
    'sourceSequence',
    'actorId',
    'targetId',
    'actionType',
    'governingRule'
  ];

  for (const key of required) {
    if (
      intent[key] === undefined ||
      intent[key] === null ||
      intent[key] === ''
    ) {
      return rejectIntent(
        intent,
        state,
        'INVALID_INTENT',
        `missing:${key}`
      );
    }
  }

  if (
    intent.sourceClass === 'RENDERER' ||
    intent.sourceClass === 'DIAGNOSTIC'
  ) {
    return rejectIntent(
      intent,
      state,
      'UNAUTHORIZED_MUTATION_SOURCE'
    );
  }

  if (
    !Number.isInteger(intent.targetTick) ||
    intent.targetTick <
      state.simulationTick + 1
  ) {
    return rejectIntent(
      intent,
      state,
      'STALE_OR_INVALID_TARGET_TICK'
    );
  }

  if (
    state.committedMutationIds.includes(
      intent.mutationId
    ) ||
    state.rejectedMutationIds.includes(
      intent.mutationId
    )
  ) {
    return rejectIntent(
      intent,
      state,
      'DUPLICATE_MUTATION_ID'
    );
  }

  if (
    intent.targetId !==
    'H_EARTH_GROUND_CELL_001'
  ) {
    return rejectIntent(
      intent,
      state,
      'UNKNOWN_TARGET'
    );
  }

  if (
    intent.actionType !==
    'INSPECT_GROUND'
  ) {
    return rejectIntent(
      intent,
      state,
      'UNKNOWN_ACTION_TYPE'
    );
  }

  if (
    intent.governingRule !==
    'H_EARTH_INSPECT_GROUND_RULE_v1'
  ) {
    return rejectIntent(
      intent,
      state,
      'GOVERNING_RULE_MISMATCH'
    );
  }

  return {
    accepted: true,
    failureClass: null,
    event: null
  };
}

export function admitHEarthIntent(
  runtime,
  intent
) {
  const receipt = validateHEarthIntent(
    intent,
    runtime.committedState
  );

  if (!receipt.accepted) {
    runtime.events.push(
      deepFreeze(receipt.event)
    );

    const next =
      clone(runtime.committedState);

    next.rejectedMutationIds.push(
      intent?.mutationId || 'UNKNOWN'
    );

    runtime.committedState =
      deepFreeze(next);

    return deepFreeze({
      status: 'REJECTED',
      ...receipt
    });
  }

  runtime.pendingIntents.push(
    deepFreeze(clone(intent))
  );

  runtime.pendingIntents.sort(
    compareHEarthIntents
  );

  return deepFreeze({
    status:
      'ADMITTED_TO_ORDERED_QUEUE',

    mutationId:
      intent.mutationId
  });
}

function resolveInspectGround(
  state,
  intent
) {
  const next =
    clone(state);

  const cell =
    next.cells.H_EARTH_GROUND_CELL_001;

  cell.lifecycle =
    'ACTIVE';

  cell.admitted =
    true;

  cell.active =
    true;

  cell.inspectionCount +=
    1;

  cell.lastInspectionTick =
    intent.targetTick;

  next.stateVersion +=
    1;

  next.simulationTick =
    intent.targetTick;

  next.committedMutationIds.push(
    intent.mutationId
  );

  next.readouts.push({
    readoutId:
      'GROUND_CONDITION_READ',

    receiptId:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    simulationTick:
      intent.targetTick,

    mutationId:
      intent.mutationId,

    targetId:
      intent.targetId,

    condition:
      'DESCRIPTOR_ONLY_GROUND_INSPECTION_COMPLETE'
  });

  return next;
}

export function commitHEarthNextTick(
  runtime
) {
  const nextTick =
    runtime.committedState.simulationTick + 1;

  const due =
    runtime.pendingIntents.filter(
      (intent) =>
        intent.targetTick === nextTick
    );

  const future =
    runtime.pendingIntents.filter(
      (intent) =>
        intent.targetTick !== nextTick
    );

  const priorVersion =
    runtime.committedState.stateVersion;

  const events = [];

  let working =
    runtime.committedState;

  for (
    let index = 0;
    index < due.length;
    index += 1
  ) {
    const intent =
      due[index];

    const validation =
      validateHEarthIntent(
        intent,
        working
      );

    if (!validation.accepted) {
      events.push(
        validation.event
      );

      const rejected =
        clone(working);

      rejected.rejectedMutationIds.push(
        intent.mutationId
      );

      working =
        deepFreeze(rejected);

      continue;
    }

    const next =
      resolveInspectGround(
        working,
        intent
      );

    const event = {
      eventId:
        `EVENT_COMMITTED_${intent.mutationId}`,

      eventType:
        'MUTATION_COMMITTED',

      eventSchemaVersion:
        '1.0.0-candidate',

      eventOrder:
        runtime.events.length +
        events.length,

      simulationTick:
        nextTick,

      mutationId:
        intent.mutationId,

      actorId:
        intent.actorId,

      targetId:
        intent.targetId,

      actionType:
        intent.actionType,

      governingRule:
        intent.governingRule,

      inputOrder:
        index,

      priorStateVersion:
        working.stateVersion,

      resultStateVersion:
        next.stateVersion,

      disposition:
        'COMMITTED',

      failureClass:
        null
    };

    events.push(event);

    working =
      deepFreeze(next);
  }

  if (due.length === 0) {
    const next =
      clone(working);

    next.simulationTick =
      nextTick;

    working =
      deepFreeze(next);
  }

  runtime.committedState =
    working;

  runtime.pendingIntents =
    future;

  for (const event of events) {
    runtime.events.push(
      deepFreeze(event)
    );
  }

  const receipt =
    deepFreeze({
      receiptId:
        `H_EARTH_TICK_RECEIPT_${nextTick}`,

      contractId:
        H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,

      simulationTick:
        nextTick,

      simulationStepMs:
        H_EARTH_SIMULATION_STEP_MS,

      priorStateVersion:
        priorVersion,

      resultStateVersion:
        working.stateVersion,

      admittedIntentCount:
        due.length,

      committedEventCount:
        events.filter(
          (event) =>
            event.disposition === 'COMMITTED'
        ).length,

      rejectedEventCount:
        events.filter(
          (event) =>
            event.disposition === 'REJECTED'
        ).length,

      rendererDependency:
        false,

      runtimeActivationClaim:
        false,

      liveDeterminismClaim:
        false
    });

  runtime.receipts.push(
    receipt
  );

  return receipt;
}

export const H_EARTH_DETERMINISTIC_RUNTIME_BOUNDARY =
  Object.freeze({
    formula:
      'S[n+1] = F(S[n], I[n], V, U)',

    wallClockInSimulationLaw:
      false,

    frameRateDependentMutation:
      false,

    unseededRandomness:
      false,

    rendererMutation:
      false,

    unorderedMutationProcessing:
      false,

    asynchronousDirectMutation:
      false,

    activeSpatialAuthority:
      'PATH_3_ONLY',

    runtimeActivated:
      false,

    productionClaim:
      false
  });

export default Object.freeze({
  contractId:
    H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,

  versionEnvelope:
    H_EARTH_VERSION_ENVELOPE,

  simulationStepMs:
    H_EARTH_SIMULATION_STEP_MS,

  createInitialState:
    createHEarthInitialState,

  createRuntime:
    createHEarthRuntime,

  admitIntent:
    admitHEarthIntent,

  commitNextTick:
    commitHEarthNextTick,

  boundary:
    H_EARTH_DETERMINISTIC_RUNTIME_BOUNDARY
});
