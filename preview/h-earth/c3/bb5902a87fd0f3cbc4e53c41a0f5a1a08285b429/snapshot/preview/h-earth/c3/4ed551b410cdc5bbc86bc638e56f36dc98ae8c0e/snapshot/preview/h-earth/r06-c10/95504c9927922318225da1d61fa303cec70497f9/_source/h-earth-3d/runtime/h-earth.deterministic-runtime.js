/**
 * /h-earth-3d/runtime/h-earth.deterministic-runtime.js
 * COMPLETE RENEWED FILE
 * H_EARTH_DETERMINISTIC_RUNTIME_FILE_RENEWAL_STEP_012G_TARGET_002_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1
 *
 * Renews existing file in place:
 * /h-earth-3d/runtime/h-earth.deterministic-runtime.js
 *
 * Prior known or reported contract:
 * H_EARTH_DETERMINISTIC_RUNTIME_REFERENCE_KERNEL_v1
 *
 * Prior contract verification posture:
 * priorVerifiedContractId = null
 * priorContractIdVerified = false
 *
 * Step:
 * STEP_012G_TARGET_002_DETERMINISTIC_RUNTIME_KERNEL_DEPENDENCY_REVIEW
 *
 * Current active backed chain end before this renewal:
 * STEP_012G_TARGET_001_STATE_CLASSIFICATION
 *
 * Purpose:
 * Renew the existing deterministic runtime support file into a Step 012G
 * runtime-kernel dependency review target while preserving:
 * - Step 012D named import compatibility;
 * - Step 012D createHEarthInitialState(seed) call compatibility;
 * - adjacent canonical replay named import compatibility;
 * - deterministic same-tick intent ordering;
 * - stale queue fail-closed removal;
 * - pending mutation ID uniqueness;
 * - duplicate rejection non-poisoning;
 * - tick-local duplicate handling;
 * - normalized mutation-ID ledgers;
 * - committed/rejected ledger disjointness;
 * - one mutation ID / one terminal disposition;
 * - accurate rejection-event ledger metadata;
 * - deterministic rejection-event identity;
 * - static support-function definition posture.
 *
 * This file defines callable headless deterministic runtime support functions.
 * Function definition is not function execution.
 *
 * This file does not import neighboring source modules.
 * This file does not execute neighboring source modules.
 * This file does not prove Step 012D import resolution.
 * This file does not prove installed module evaluation.
 * This file does not prove module graph execution.
 * This file does not construct an executable harness.
 * This file does not run a harness.
 * This file does not execute tests.
 * This file does not activate runtime at module load.
 * This file does not admit intent at module load.
 * This file does not commit ticks at module load.
 * This file does not execute Inspect Ground at module load.
 * This file does not execute Ground Condition Read at module load.
 * This file does not generate or persist a receipt occurrence at module load.
 * This file does not activate renderer.
 * This file does not activate route.
 * This file does not validate production state.
 * This file does not produce a visual pass.
 * This file does not collapse the matrix.
 */

export const H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID =
  'H_EARTH_DETERMINISTIC_RUNTIME_FILE_RENEWAL_STEP_012G_TARGET_002_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1';

export const H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_VERIFIED_CONTRACT_ID =
  null;

export const H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_CONTRACT_ID_VERIFIED =
  false;

export const H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID =
  'H_EARTH_DETERMINISTIC_RUNTIME_REFERENCE_KERNEL_v1';

export const H_EARTH_SIMULATION_STEP_MS = 50;

export const H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS =
  Object.freeze({
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
      'H_EARTH_GROUND_INSPECTION_RECEIPT'
  });

export const H_EARTH_VERSION_ENVELOPE =
  Object.freeze({
    worldSchemaVersion:
      '1.0.0-candidate',

    regionSpaceVersion:
      'PATH_3_STEP_001',

    latticeVersion:
      'PATH_3_STEP_002_256_CELL',

    summitLawVersion:
      'PATH_3_STEP_007D',

    stateClassificationVersion:
      'H_EARTH_STATE_CLASSIFICATION_FILE_RENEWAL_STEP_012G_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

    simulationLawVersion:
      H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,

    serializationVersion:
      'H_EARTH_CANONICAL_SERIALIZATION_v1',

    randomAlgorithmVersion:
      'NONE_USED_IN_REFERENCE_KERNEL'
  });

export const H_EARTH_DETERMINISTIC_RUNTIME_AUTHORITY =
  Object.freeze({
    authorityId:
      'H_EARTH_DETERMINISTIC_RUNTIME_STEP_012G_TARGET_002_AUTHORITY_BOUNDARY',

    file:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.deterministic-runtime.js',

    currentStep:
      'STEP_012G_TARGET_002',

    contractId:
      H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,

    priorVerifiedContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    currentContractRoom:
      'ROOM_6_RUNTIME_KERNEL_DEPENDENCY_REVIEW',

    historicalFileClass:
      'DETERMINISTIC_RUNTIME_REFERENCE_KERNEL_CANDIDATE',

    authorityClass:
      'STATIC_DETERMINISTIC_RUNTIME_KERNEL_DEPENDENCY_REVIEW_ONLY',

    fileClass:
      'HEADLESS_DETERMINISTIC_RUNTIME_SUPPORT_FUNCTIONS_DEFINED_ONLY',

    activeStatusCeiling:
      'STATIC_DETERMINISTIC_RUNTIME_KERNEL_DEPENDENCY_REVIEW_ONLY',

    ownModuleInitializationExecution:
      true,

    deterministicRuntimeSupportFunctionsDefinedHere:
      true,

    deterministicRuntimeSupportFunctionsExecutedHere:
      false,

    neighboringSourceModuleImport:
      false,

    neighboringSourceModuleExecution:
      false,

    importResolutionProof:
      false,

    runtimeDependencyResolutionProof:
      false,

    installedModuleEvaluationProof:
      false,

    moduleGraphExecutionProof:
      false,

    executableHarnessConstructedHere:
      false,

    executableHarnessLogicExecution:
      false,

    harnessExecutedHere:
      false,

    testExecutedHere:
      false,

    preflightExecutedHere:
      false,

    liveRuntimeActivated:
      false,

    runtimeCreatedHere:
      false,

    intentAdmittedHere:
      false,

    tickCommittedHere:
      false,

    actionExecutedHere:
      false,

    readoutExecutedHere:
      false,

    observationAcquiredHere:
      false,

    receiptOccurrenceGeneratedHere:
      false,

    receiptPersistedHere:
      false,

    rendererActivated:
      false,

    routeActivated:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false
  });

export const H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT =
  Object.freeze({
    contractId:
      H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,

    priorVerifiedContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    file:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.deterministic-runtime.js',

    currentStep:
      H_EARTH_DETERMINISTIC_RUNTIME_AUTHORITY.currentStep,

    authority:
      H_EARTH_DETERMINISTIC_RUNTIME_AUTHORITY,

    renewsExistingFileInPlace:
      true,

    createsNewFile:
      false,

    activeStatusCeiling:
      H_EARTH_DETERMINISTIC_RUNTIME_AUTHORITY.activeStatusCeiling,

    renewalPurpose:
      'Renew the existing deterministic runtime support file into the Step 012G runtime-kernel dependency review chain while preserving Step 012D named import compatibility, Step 012D seed-call compatibility, canonical replay export compatibility, same-tick deterministic processing, stale queue disposition, pending mutation ID uniqueness, duplicate rejection non-poisoning, tick-local duplicate handling, terminal mutation-ID disposition law, normalized disjoint mutation-ID ledgers, accurate rejection-event ledger metadata, and deterministic rejection-event identity.',

    operationalBoundary:
      'Callable runtime support functions are defined here. They are not executed by module initialization and do not create runtime activation, validation authority, renderer activation, route activation, production, deployment, visual-pass, or matrix-collapse authority.',

    mutationIdTerminalDispositionLaw:
      Object.freeze({
        lawId:
          'H_EARTH_ONE_MUTATION_ID_ONE_TERMINAL_DISPOSITION_LAW',

        statement:
          'A mutationId may appear in committedMutationIds or rejectedMutationIds, never both.',

        duplicateIdentityRejectionsAreEventLevelOnly:
          true,

        duplicateIdentityRejectionsDoNotReclassifyOriginalMutationId:
          true,

        ordinaryTerminalRejectionsMayMutateRejectedLedger:
          true,

        rejectionEventMetadataMustReflectActualLedgerMutation:
          true,

        appliesToEventOnlyFailures:
          Object.freeze([
            'PENDING_DUPLICATE_MUTATION_ID',
            'TICK_LOCAL_DUPLICATE_MUTATION_ID',
            'DUPLICATE_MUTATION_ID'
          ])
      }),

    step012DConsumerRelationship:
      Object.freeze({
        consumerFile:
          '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.state.js',

        consumerContract:
          'H_EARTH_STATE_FILE_RENEWAL_STEP_012D_MANIFEST_INTEGRITY_BOUNDARY_ALIGNED_STATE_BRIDGE_v1',

        relationship:
          'DIRECT_RUNTIME_KERNEL_SUPPORT_IMPORT_TARGET',

        requiredNamedExportsPreserved:
          true,

        requiredNamedExports:
          Object.freeze([
            'H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID',
            'H_EARTH_VERSION_ENVELOPE',
            'createHEarthInitialState'
          ]),

        createInitialStateSeedCallContractPreserved:
          true,

        canonicalSeedInputAllowedWhenValuesMatch:
          true,

        constitutionalSeedValueMutationRejected:
          true,

        importResolutionProvenHere:
          false,

        consumerModuleEvaluationProvenHere:
          false,

        installedImportCompatibilityVerified:
          false,

        moduleGraphExecutionVerified:
          false
      }),

    step012GTarget001Relationship:
      Object.freeze({
        target001File:
          '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.state-classification.js',

        target001Contract:
          'H_EARTH_STATE_CLASSIFICATION_FILE_RENEWAL_STEP_012G_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

        relationship:
          'VERSION_ENVELOPE_STATE_CLASSIFICATION_ALIGNMENT',

        stateClassificationVersionUpdatedToTarget001:
          true,

        importFromTarget001:
          false,

        target001ModuleEvaluationVerifiedHere:
          false
      }),

    canonicalReplayAwareness:
      Object.freeze({
        adjacentFile:
          '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.canonical-replay.js',

        adjacentKnownOrReportedContract:
          'H_EARTH_CANONICAL_SERIALIZATION_AND_REPLAY_v1',

        relationship:
          'ADJACENT_DEFERRED_REPLAY_CONSUMER_AWARENESS',

        requiredNamedExportsPreserved:
          true,

        requiredNamedExports:
          Object.freeze([
            'createHEarthRuntime',
            'admitHEarthIntent',
            'commitHEarthNextTick'
          ]),

        replayFileReviewedByThisFile:
          false,

        replayExecutionAuthorizedHere:
          false
      }),

    nextRuntimeKernelTarget:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.canonical-replay.js',

    nextRuntimeKernelTargetRenewalAuthorizedByThisFile:
      false
  });

export const H_EARTH_DETERMINISTIC_RUNTIME_SOURCE_PRIORITY =
  Object.freeze({
    CONSTITUTIONAL:
      0,

    SYSTEM:
      10,

    ACTOR:
      20,

    ASYNC_CANDIDATE:
      30,

    DIAGNOSTIC:
      90,

    RENDERER:
      100
  });

export const H_EARTH_DETERMINISTIC_RUNTIME_SOURCE_CLASS_POLICY =
  Object.freeze({
    CONSTITUTIONAL:
      Object.freeze({
        mayAppearInOrderingVocabulary:
          true,
        mayMutateThroughIntent:
          false,
        disposition:
          'RESERVED_NON_ORDINARY_MUTATION_SOURCE'
      }),

    SYSTEM:
      Object.freeze({
        mayAppearInOrderingVocabulary:
          true,
        mayMutateThroughIntent:
          true,
        disposition:
          'AUTHORIZED_INTERNAL_SOURCE_CLASS'
      }),

    ACTOR:
      Object.freeze({
        mayAppearInOrderingVocabulary:
          true,
        mayMutateThroughIntent:
          true,
        disposition:
          'AUTHORIZED_ACTOR_SOURCE_CLASS'
      }),

    ASYNC_CANDIDATE:
      Object.freeze({
        mayAppearInOrderingVocabulary:
          true,
        mayMutateThroughIntent:
          true,
        disposition:
          'AUTHORIZED_ORDERED_CANDIDATE_SOURCE_CLASS'
      }),

    DIAGNOSTIC:
      Object.freeze({
        mayAppearInOrderingVocabulary:
          true,
        mayMutateThroughIntent:
          false,
        disposition:
          'REJECTED_NON_AUTHORITATIVE_MUTATION_SOURCE'
      }),

    RENDERER:
      Object.freeze({
        mayAppearInOrderingVocabulary:
          true,
        mayMutateThroughIntent:
          false,
        disposition:
          'REJECTED_NON_AUTHORITATIVE_MUTATION_SOURCE'
      })
  });

export const H_EARTH_INITIAL_STATE_SEED_POLICY =
  Object.freeze({
    policyId:
      'H_EARTH_INITIAL_STATE_SEED_POLICY_STEP_012G_TARGET_002',

    noArgumentAllowed:
      true,

    emptyObjectAllowed:
      true,

    step012DCanonicalSeedObjectAllowed:
      true,

    constitutionalSeedKeysAllowedOnlyWhenCanonicalValueMatches:
      true,

    constitutionalSeedValueMutationRejected:
      true,

    cellsOverrideRejected:
      true,

    unknownOverrideKeysRejected:
      true,

    mutableOverrideTypeValidation:
      true,

    ledgerDisjointnessRequired:
      true,

    expectedCellObjectRequired:
      true,

    readoutsArrayRequired:
      true,

    canonicalSeedKeys:
      Object.freeze([
        'activeMatrix',
        'matrixIdentity',
        'sceneIdentity',
        'canonicalRegionCellId',
        'activeDomainCellId',
        'firstActionId',
        'firstReadoutId',
        'firstReceiptId'
      ]),

    candidateMutableOverrideKeys:
      Object.freeze([
        'stateVersion',
        'simulationTick',
        'readouts',
        'committedMutationIds',
        'rejectedMutationIds'
      ]),

    forbiddenOverrideKeys:
      Object.freeze([
        'cells'
      ]),

    overrideAuthorityCreated:
      false,

    validationClaim:
      false
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

function isNonemptyString(value) {
  return typeof value === 'string' && value.length > 0;
}

function isNonnegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function normalizeEventSequence(eventSequence) {
  return Number.isInteger(eventSequence) && eventSequence >= 0
    ? eventSequence
    : null;
}

function formatEventSequence(eventSequence) {
  const normalized =
    normalizeEventSequence(eventSequence);

  return normalized === null
    ? 'NOSEQ'
    : String(normalized).padStart(6, '0');
}

function normalizeUniqueStringLedger(values, ledgerName) {
  if (!Array.isArray(values)) {
    throw new TypeError(
      `H_EARTH_${ledgerName}_LEDGER_ARRAY_REQUIRED`
    );
  }

  const seen = new Set();
  const normalized = [];

  for (const value of values) {
    if (!isNonemptyString(value)) {
      throw new TypeError(
        `H_EARTH_${ledgerName}_LEDGER_ENTRY_NONEMPTY_STRING_REQUIRED`
      );
    }

    if (seen.has(value)) {
      throw new TypeError(
        `H_EARTH_${ledgerName}_LEDGER_DUPLICATE_REJECTED:${value}`
      );
    }

    seen.add(value);
    normalized.push(value);
  }

  return normalized;
}

function assertMutationLedgersDisjoint(state) {
  if (!plainObject(state)) {
    throw new TypeError('H_EARTH_STATE_OBJECT_REQUIRED_FOR_LEDGER_CHECK');
  }

  const committed =
    normalizeUniqueStringLedger(
      state.committedMutationIds,
      'committedMutationIds'
    );

  const rejected =
    normalizeUniqueStringLedger(
      state.rejectedMutationIds,
      'rejectedMutationIds'
    );

  const committedSet =
    new Set(committed);

  for (const mutationId of rejected) {
    if (committedSet.has(mutationId)) {
      throw new TypeError(
        `H_EARTH_MUTATION_ID_TERMINAL_DISPOSITION_CONFLICT:${mutationId}`
      );
    }
  }

  return true;
}

function isTerminalDuplicateFailure(failureClass) {
  return (
    failureClass === 'PENDING_DUPLICATE_MUTATION_ID' ||
    failureClass === 'TICK_LOCAL_DUPLICATE_MUTATION_ID' ||
    failureClass === 'DUPLICATE_MUTATION_ID'
  );
}

function appendTerminalMutationId(
  state,
  ledgerName,
  mutationId,
  failureClass = null
) {
  if (!isNonemptyString(mutationId)) {
    return false;
  }

  if (isTerminalDuplicateFailure(failureClass)) {
    return false;
  }

  if (
    ledgerName !== 'committedMutationIds' &&
    ledgerName !== 'rejectedMutationIds'
  ) {
    throw new TypeError('H_EARTH_UNKNOWN_TERMINAL_MUTATION_LEDGER');
  }

  const oppositeLedgerName =
    ledgerName === 'committedMutationIds'
      ? 'rejectedMutationIds'
      : 'committedMutationIds';

  if (!Array.isArray(state[ledgerName])) {
    throw new TypeError(
      `H_EARTH_${ledgerName}_LEDGER_ARRAY_REQUIRED`
    );
  }

  if (!Array.isArray(state[oppositeLedgerName])) {
    throw new TypeError(
      `H_EARTH_${oppositeLedgerName}_LEDGER_ARRAY_REQUIRED`
    );
  }

  if (state[oppositeLedgerName].includes(mutationId)) {
    throw new TypeError(
      `H_EARTH_MUTATION_ID_TERMINAL_DISPOSITION_CONFLICT:${mutationId}`
    );
  }

  if (state[ledgerName].includes(mutationId)) {
    return false;
  }

  state[ledgerName].push(mutationId);

  assertMutationLedgersDisjoint(state);

  return true;
}

function makeRejectedEvent({
  mutationId = 'UNKNOWN',
  actorId = 'UNKNOWN',
  targetId = 'UNKNOWN',
  simulationTick = null,
  code,
  detail = null,
  eventSequence = null,
  authoritativeMutationLedgerMutation = false
}) {
  const normalizedSequence =
    normalizeEventSequence(eventSequence);

  const eventSequenceToken =
    formatEventSequence(normalizedSequence);

  const eventCode =
    code || 'UNKNOWN_REJECTION';

  const mutationToken =
    isNonemptyString(mutationId)
      ? mutationId
      : 'UNKNOWN';

  const duplicateIdentityRejection =
    isTerminalDuplicateFailure(eventCode);

  return {
    eventId:
      `EVENT_REJECTED_${eventSequenceToken}_${mutationToken}_${eventCode}`,

    eventSequence:
      normalizedSequence,

    eventType:
      'MUTATION_REJECTED',

    eventSchemaVersion:
      '1.0.0-candidate',

    simulationTick,

    mutationId:
      mutationToken,

    actorId:
      actorId || 'UNKNOWN',

    targetId:
      targetId || 'UNKNOWN',

    disposition:
      'REJECTED',

    failureClass:
      eventCode,

    detail,

    authoritativeMutationLedgerMutation:
      Boolean(authoritativeMutationLedgerMutation),

    duplicateRejectionNonPoisoning:
      duplicateIdentityRejection,

    originalMutationIdDispositionPreserved:
      duplicateIdentityRejection,

    runtimeActivationClaim:
      false,

    rendererDependency:
      false,

    validationClaim:
      false
  };
}

function recordDuplicateAttemptEventOnly({
  intent,
  state,
  code,
  detail = null,
  eventSequence = null
}) {
  return makeRejectedEvent({
    mutationId:
      intent?.mutationId || 'UNKNOWN',

    actorId:
      intent?.actorId || 'UNKNOWN',

    targetId:
      intent?.targetId || 'UNKNOWN',

    simulationTick:
      plainObject(state) && Number.isInteger(state.simulationTick)
        ? state.simulationTick
        : null,

    code,

    detail,

    eventSequence,

    authoritativeMutationLedgerMutation:
      false
  });
}

function makeRejectedEventForIntent({
  intent,
  state,
  code,
  detail = null,
  eventSequence = null,
  authoritativeMutationLedgerMutation = false
}) {
  return makeRejectedEvent({
    mutationId:
      intent?.mutationId || 'UNKNOWN',

    actorId:
      intent?.actorId || 'UNKNOWN',

    targetId:
      intent?.targetId || 'UNKNOWN',

    simulationTick:
      plainObject(state) && Number.isInteger(state.simulationTick)
        ? state.simulationTick
        : null,

    code,

    detail,

    eventSequence,

    authoritativeMutationLedgerMutation
  });
}

function rejectIntent(
  intent,
  state,
  code,
  detail = null
) {
  return {
    accepted:
      false,

    failureClass:
      code,

    detail,

    event:
      makeRejectedEventForIntent({
        intent,
        state,
        code,
        detail,
        authoritativeMutationLedgerMutation:
          false
      })
  };
}

function assertExpectedCellExists(state) {
  if (
    !plainObject(state.cells) ||
    !plainObject(state.cells.H_EARTH_GROUND_CELL_001)
  ) {
    throw new TypeError('H_EARTH_GROUND_CELL_001_STATE_REQUIRED');
  }
}

function assertStateShape(state) {
  if (!plainObject(state)) {
    throw new TypeError('H_EARTH_STATE_OBJECT_REQUIRED');
  }

  if (!isNonnegativeInteger(state.stateVersion)) {
    throw new TypeError(
      'H_EARTH_STATE_VERSION_NONNEGATIVE_INTEGER_REQUIRED'
    );
  }

  if (!isNonnegativeInteger(state.simulationTick)) {
    throw new TypeError(
      'H_EARTH_STATE_SIMULATION_TICK_NONNEGATIVE_INTEGER_REQUIRED'
    );
  }

  if (!Array.isArray(state.readouts)) {
    throw new TypeError('H_EARTH_STATE_READOUTS_ARRAY_REQUIRED');
  }

  normalizeUniqueStringLedger(
    state.committedMutationIds,
    'committedMutationIds'
  );

  normalizeUniqueStringLedger(
    state.rejectedMutationIds,
    'rejectedMutationIds'
  );

  assertMutationLedgersDisjoint(state);
  assertExpectedCellExists(state);
}

function assertPlainRuntime(runtime) {
  if (!plainObject(runtime)) {
    throw new TypeError('H_EARTH_RUNTIME_OBJECT_REQUIRED');
  }

  if (!plainObject(runtime.committedState)) {
    throw new TypeError('H_EARTH_RUNTIME_COMMITTED_STATE_REQUIRED');
  }

  if (!Array.isArray(runtime.pendingIntents)) {
    throw new TypeError('H_EARTH_RUNTIME_PENDING_INTENTS_ARRAY_REQUIRED');
  }

  if (!Array.isArray(runtime.events)) {
    throw new TypeError('H_EARTH_RUNTIME_EVENTS_ARRAY_REQUIRED');
  }

  if (!Array.isArray(runtime.receipts)) {
    throw new TypeError('H_EARTH_RUNTIME_RECEIPTS_ARRAY_REQUIRED');
  }

  assertStateShape(runtime.committedState);
}

function buildBaseHEarthInitialState() {
  return {
    stateVersion: 0,
    simulationTick: 0,

    activeMatrix:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS.activeMatrix,

    matrixIdentity:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS.matrixIdentity,

    sceneIdentity:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS.sceneIdentity,

    canonicalRegionCellId:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS.canonicalRegionCellId,

    activeDomainCellId:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS.activeDomainCellId,

    firstActionId:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS.firstActionId,

    firstReadoutId:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS.firstReadoutId,

    firstReceiptId:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS.firstReceiptId,

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
}

function normalizeInitialStateOverrides(overrides) {
  if (overrides === undefined) {
    return {};
  }

  if (!plainObject(overrides)) {
    throw new TypeError('H_EARTH_INITIAL_STATE_OVERRIDES_MUST_BE_OBJECT');
  }

  const canonicalSeedKeys =
    new Set(H_EARTH_INITIAL_STATE_SEED_POLICY.canonicalSeedKeys);

  const candidateMutableKeys =
    new Set(H_EARTH_INITIAL_STATE_SEED_POLICY.candidateMutableOverrideKeys);

  const forbiddenKeys =
    new Set(H_EARTH_INITIAL_STATE_SEED_POLICY.forbiddenOverrideKeys);

  const normalized = {};

  for (const key of Object.keys(overrides)) {
    if (forbiddenKeys.has(key)) {
      throw new TypeError(
        `H_EARTH_INITIAL_STATE_OVERRIDE_REJECTED:${key}`
      );
    }

    if (canonicalSeedKeys.has(key)) {
      const expected =
        H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS[key];

      if (overrides[key] !== expected) {
        throw new TypeError(
          `H_EARTH_CONSTITUTIONAL_INITIAL_STATE_SEED_VALUE_REJECTED:${key}`
        );
      }

      normalized[key] = expected;
      continue;
    }

    if (candidateMutableKeys.has(key)) {
      if (
        key === 'stateVersion' ||
        key === 'simulationTick'
      ) {
        if (!isNonnegativeInteger(overrides[key])) {
          throw new TypeError(
            `H_EARTH_INITIAL_STATE_${key}_NONNEGATIVE_INTEGER_REQUIRED`
          );
        }

        normalized[key] = overrides[key];
        continue;
      }

      if (key === 'readouts') {
        if (!Array.isArray(overrides[key])) {
          throw new TypeError(
            'H_EARTH_INITIAL_STATE_READOUTS_ARRAY_REQUIRED'
          );
        }

        normalized[key] = clone(overrides[key]);
        continue;
      }

      if (
        key === 'committedMutationIds' ||
        key === 'rejectedMutationIds'
      ) {
        normalized[key] =
          normalizeUniqueStringLedger(
            overrides[key],
            key
          );

        continue;
      }
    }

    throw new TypeError(
      `H_EARTH_UNKNOWN_INITIAL_STATE_OVERRIDE_REJECTED:${key}`
    );
  }

  return normalized;
}

export function compareHEarthIntents(a, b) {
  return (
    Number(a.targetTick) - Number(b.targetTick) ||

    (
      H_EARTH_DETERMINISTIC_RUNTIME_SOURCE_PRIORITY[a.sourceClass] ??
      999
    ) -
    (
      H_EARTH_DETERMINISTIC_RUNTIME_SOURCE_PRIORITY[b.sourceClass] ??
      999
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
  const normalizedOverrides =
    normalizeInitialStateOverrides(overrides);

  const base =
    buildBaseHEarthInitialState();

  const state =
    Object.assign(
      base,
      normalizedOverrides
    );

  assertStateShape(state);

  return deepFreeze(state);
}

export function createHEarthRuntime(
  initialState = createHEarthInitialState()
) {
  assertStateShape(initialState);

  return {
    committedState:
      deepFreeze(clone(initialState)),

    pendingIntents: [],

    events: [],

    receipts: [],

    runtimeActivationClaim:
      false,

    rendererDependency:
      false,

    routeDependency:
      false,

    validationClaim:
      false,

    productionClaim:
      false
  };
}

export function validateHEarthIntent(
  intent,
  state,
  options = {}
) {
  try {
    assertStateShape(state);
  } catch (error) {
    return rejectIntent(
      intent || { mutationId: 'UNKNOWN' },
      { simulationTick: null },
      'INVALID_STATE',
      error instanceof Error ? error.message : String(error)
    );
  }

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

  if (!isNonemptyString(intent.mutationId)) {
    return rejectIntent(
      intent,
      state,
      'INVALID_MUTATION_ID'
    );
  }

  const sourcePolicy =
    H_EARTH_DETERMINISTIC_RUNTIME_SOURCE_CLASS_POLICY[
      intent.sourceClass
    ];

  if (!sourcePolicy) {
    return rejectIntent(
      intent,
      state,
      'UNKNOWN_MUTATION_SOURCE_CLASS'
    );
  }

  if (sourcePolicy.mayMutateThroughIntent !== true) {
    return rejectIntent(
      intent,
      state,
      'UNAUTHORIZED_MUTATION_SOURCE'
    );
  }

  const activeCommitTick =
    Number.isInteger(options.activeCommitTick)
      ? options.activeCommitTick
      : null;

  const tickAccepted =
    activeCommitTick === null
      ? intent.targetTick >= state.simulationTick + 1
      : intent.targetTick === activeCommitTick;

  if (
    !Number.isInteger(intent.targetTick) ||
    !tickAccepted
  ) {
    return rejectIntent(
      intent,
      state,
      'STALE_OR_INVALID_TARGET_TICK'
    );
  }

  if (
    state.committedMutationIds.includes(intent.mutationId) ||
    state.rejectedMutationIds.includes(intent.mutationId)
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

  return Object.freeze({
    accepted:
      true,

    failureClass:
      null,

    detail:
      null,

    event:
      null,

    runtimeActivationClaim:
      false,

    validationClaim:
      false
  });
}

export function admitHEarthIntent(
  runtime,
  intent
) {
  assertPlainRuntime(runtime);

  if (plainObject(intent)) {
    const pendingDuplicate =
      runtime.pendingIntents.some(
        (pendingIntent) =>
          pendingIntent?.mutationId === intent.mutationId
      );

    if (pendingDuplicate) {
      const duplicateEvent =
        recordDuplicateAttemptEventOnly({
          intent,
          state:
            runtime.committedState,
          code:
            'PENDING_DUPLICATE_MUTATION_ID',
          detail:
            'later duplicate attempt rejected without mutating terminal mutation-ID ledgers',
          eventSequence:
            runtime.events.length
        });

      runtime.events.push(
        deepFreeze(duplicateEvent)
      );

      return deepFreeze({
        status:
          'REJECTED',

        accepted:
          false,

        failureClass:
          'PENDING_DUPLICATE_MUTATION_ID',

        event:
          duplicateEvent,

        duplicateRejectionNonPoisoning:
          true,

        authoritativeMutationLedgerMutation:
          false,

        originalPendingIntentPreserved:
          true,

        runtimeActivationClaim:
          false,

        validationClaim:
          false
      });
    }
  }

  const receipt =
    validateHEarthIntent(
      intent,
      runtime.committedState
    );

  if (!receipt.accepted) {
    let ledgerMutated = false;

    if (!isTerminalDuplicateFailure(receipt.failureClass)) {
      const next =
        clone(runtime.committedState);

      ledgerMutated =
        appendTerminalMutationId(
          next,
          'rejectedMutationIds',
          intent?.mutationId,
          receipt.failureClass
        );

      runtime.committedState =
        deepFreeze(next);
    }

    const rejectedEvent =
      makeRejectedEventForIntent({
        intent,
        state:
          runtime.committedState,
        code:
          receipt.failureClass,
        detail:
          receipt.detail,
        eventSequence:
          runtime.events.length,
        authoritativeMutationLedgerMutation:
          ledgerMutated
      });

    runtime.events.push(
      deepFreeze(rejectedEvent)
    );

    assertMutationLedgersDisjoint(runtime.committedState);

    return deepFreeze({
      status:
        'REJECTED',

      accepted:
        false,

      failureClass:
        receipt.failureClass,

      detail:
        receipt.detail,

      event:
        rejectedEvent,

      authoritativeMutationLedgerMutation:
        ledgerMutated,

      runtimeActivationClaim:
        false,

      validationClaim:
        false
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
      intent.mutationId,

    runtimeActivationClaim:
      false,

    validationClaim:
      false
  });
}

function resolveInspectGround(
  state,
  intent
) {
  const next =
    clone(state);

  assertStateShape(next);

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

  appendTerminalMutationId(
    next,
    'committedMutationIds',
    intent.mutationId,
    null
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
      'DESCRIPTOR_ONLY_GROUND_INSPECTION_COMPLETE',

    runtimeActivationClaim:
      false,

    rendererDependency:
      false,

    validationClaim:
      false
  });

  assertStateShape(next);

  return next;
}

function partitionPendingIntentsForTick(
  pendingIntents,
  nextTick
) {
  const sortedPending =
    [...pendingIntents].sort(compareHEarthIntents);

  const uniquePending = [];
  const duplicateAttempts = [];
  const seenMutationIds = new Set();

  for (const intent of sortedPending) {
    if (!isNonemptyString(intent?.mutationId)) {
      uniquePending.push(intent);
      continue;
    }

    if (seenMutationIds.has(intent.mutationId)) {
      duplicateAttempts.push(intent);
      continue;
    }

    seenMutationIds.add(intent.mutationId);
    uniquePending.push(intent);
  }

  const due =
    uniquePending.filter(
      (intent) =>
        intent.targetTick === nextTick
    );

  const stale =
    uniquePending.filter(
      (intent) =>
        Number.isInteger(intent.targetTick) &&
        intent.targetTick < nextTick
    );

  const future =
    uniquePending.filter(
      (intent) =>
        Number.isInteger(intent.targetTick) &&
        intent.targetTick > nextTick
    );

  const malformed =
    uniquePending.filter(
      (intent) =>
        !Number.isInteger(intent.targetTick)
    );

  return {
    duplicateAttempts,
    due,
    stale,
    future,
    malformed
  };
}

export function commitHEarthNextTick(
  runtime
) {
  assertPlainRuntime(runtime);

  const openingState =
    runtime.committedState;

  const nextTick =
    openingState.simulationTick + 1;

  const {
    duplicateAttempts,
    due,
    stale,
    future,
    malformed
  } =
    partitionPendingIntentsForTick(
      runtime.pendingIntents,
      nextTick
    );

  const priorVersion =
    openingState.stateVersion;

  const events = [];

  let working =
    openingState;

  function nextEventSequence() {
    return runtime.events.length + events.length;
  }

  for (const intent of duplicateAttempts) {
    const event =
      recordDuplicateAttemptEventOnly({
        intent,
        state:
          openingState,
        code:
          'TICK_LOCAL_DUPLICATE_MUTATION_ID',
        detail:
          'duplicate pending mutationId rejected as event-only attempt without mutating terminal mutation-ID ledgers',
        eventSequence:
          nextEventSequence()
      });

    events.push(event);
  }

  for (const intent of stale) {
    const rejected =
      clone(working);

    const ledgerMutated =
      appendTerminalMutationId(
        rejected,
        'rejectedMutationIds',
        intent?.mutationId,
        'STALE_PENDING_INTENT'
      );

    working =
      deepFreeze(rejected);

    const event =
      makeRejectedEventForIntent({
        intent,
        state:
          openingState,
        code:
          'STALE_PENDING_INTENT',
        detail:
          `targetTick:${intent?.targetTick}`,
        eventSequence:
          nextEventSequence(),
        authoritativeMutationLedgerMutation:
          ledgerMutated
      });

    events.push(event);
  }

  for (const intent of malformed) {
    const rejected =
      clone(working);

    const ledgerMutated =
      appendTerminalMutationId(
        rejected,
        'rejectedMutationIds',
        intent?.mutationId,
        'MALFORMED_PENDING_INTENT_TARGET_TICK'
      );

    working =
      deepFreeze(rejected);

    const event =
      makeRejectedEventForIntent({
        intent,
        state:
          openingState,
        code:
          'MALFORMED_PENDING_INTENT_TARGET_TICK',
        detail:
          `targetTick:${intent?.targetTick}`,
        eventSequence:
          nextEventSequence(),
        authoritativeMutationLedgerMutation:
          ledgerMutated
      });

    events.push(event);
  }

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
        openingState,
        { activeCommitTick: nextTick }
      );

    if (!validation.accepted) {
      let ledgerMutated = false;

      if (!isTerminalDuplicateFailure(validation.failureClass)) {
        const rejected =
          clone(working);

        ledgerMutated =
          appendTerminalMutationId(
            rejected,
            'rejectedMutationIds',
            intent?.mutationId,
            validation.failureClass
          );

        working =
          deepFreeze(rejected);
      }

      const event =
        makeRejectedEventForIntent({
          intent,
          state:
            openingState,
          code:
            validation.failureClass,
          detail:
            validation.detail,
          eventSequence:
            nextEventSequence(),
          authoritativeMutationLedgerMutation:
            ledgerMutated
        });

      events.push(event);

      continue;
    }

    const next =
      resolveInspectGround(
        working,
        intent
      );

    const event = {
      eventId:
        `EVENT_COMMITTED_${formatEventSequence(nextEventSequence())}_${intent.mutationId}`,

      eventSequence:
        nextEventSequence(),

      eventType:
        'MUTATION_COMMITTED',

      eventSchemaVersion:
        '1.0.0-candidate',

      eventOrder:
        nextEventSequence(),

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
        null,

      authoritativeMutationLedgerMutation:
        true,

      runtimeActivationClaim:
        false,

      rendererDependency:
        false,

      validationClaim:
        false
    };

    events.push(event);

    working =
      deepFreeze(next);
  }

  if (
    due.length === 0 &&
    stale.length === 0 &&
    malformed.length === 0
  ) {
    const next =
      clone(working);

    next.simulationTick =
      nextTick;

    working =
      deepFreeze(next);
  } else if (working.simulationTick < nextTick) {
    const advanced =
      clone(working);

    advanced.simulationTick =
      nextTick;

    working =
      deepFreeze(advanced);
  }

  assertStateShape(working);

  runtime.committedState =
    working;

  runtime.pendingIntents =
    future.sort(compareHEarthIntents);

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

      dueIntentCount:
        due.length,

      staleIntentCount:
        stale.length,

      malformedIntentCount:
        malformed.length,

      duplicateAttemptEventOnlyCount:
        duplicateAttempts.length,

      futureIntentCount:
        runtime.pendingIntents.length,

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

      mutationIdTerminalDispositionLaw:
        'ONE_MUTATION_ID_ONE_TERMINAL_DISPOSITION',

      committedRejectedLedgerDisjoint:
        true,

      duplicateIdentityRejectionsEventOnly:
        true,

      rejectionEventLedgerMetadataAccurate:
        true,

      deterministicEventIdentity:
        true,

      rendererDependency:
        false,

      routeDependency:
        false,

      runtimeActivationClaim:
        false,

      liveDeterminismClaim:
        false,

      validationClaim:
        false,

      productionClaim:
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

    sameTickOrderedIntentProcessing:
      true,

    dueIntentValidationAgainstOpeningTickState:
      true,

    staleQueueRemoval:
      true,

    pendingMutationIdUniqueness:
      true,

    pendingDuplicateRejectionNonPoisoning:
      true,

    tickLocalDuplicateMutationIdDisposition:
      'EVENT_ONLY_NON_POISONING',

    duplicateIdentityRejectionsEventOnly:
      true,

    normalizedMutationIdLedgers:
      true,

    committedRejectedLedgerDisjointness:
      true,

    oneMutationIdOneTerminalDisposition:
      true,

    rejectionEventLedgerMetadataAccurate:
      true,

    deterministicEventIdentity:
      true,

    activeSpatialAuthority:
      'PATH_3_ONLY',

    stateClassificationVersion:
      'H_EARTH_STATE_CLASSIFICATION_FILE_RENEWAL_STEP_012G_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

    runtimeSupportFunctionsDefined:
      true,

    runtimeSupportFunctionsExecutedAtModuleLoad:
      false,

    runtimeCreatedAtModuleLoad:
      false,

    intentAdmittedAtModuleLoad:
      false,

    tickCommittedAtModuleLoad:
      false,

    receiptGeneratedAtModuleLoad:
      false,

    runtimeActivated:
      false,

    rendererActivated:
      false,

    routeActivated:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false
  });

export const H_EARTH_DETERMINISTIC_RUNTIME_STEP_012D_COMPATIBILITY =
  Object.freeze({
    compatibilityId:
      'H_EARTH_DETERMINISTIC_RUNTIME_STEP_012D_COMPATIBILITY',

    consumerFile:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.state.js',

    consumerContractId:
      'H_EARTH_STATE_FILE_RENEWAL_STEP_012D_MANIFEST_INTEGRITY_BOUNDARY_ALIGNED_STATE_BRIDGE_v1',

    requiredNamedExportsRecorded:
      true,

    requiredNamedExports:
      Object.freeze([
        'H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID',
        'H_EARTH_VERSION_ENVELOPE',
        'createHEarthInitialState'
      ]),

    createInitialStateSeedCallContractPreserved:
      true,

    canonicalSeedInputAllowedWhenValuesMatch:
      true,

    constitutionalSeedValueMutationRejected:
      true,

    mutableSeedTypeValidation:
      true,

    committedRejectedLedgerDisjointnessEnforced:
      true,

    expectedCellObjectRequired:
      true,

    readoutsArrayRequired:
      true,

    contractExportPreserved:
      true,

    versionEnvelopeExportPreserved:
      true,

    initialStateFactoryExportPreserved:
      true,

    installedImportCompatibilityVerified:
      false,

    moduleGraphExecutionVerified:
      false,

    step012DModuleEvaluationVerifiedHere:
      false,

    liveRuntimeActivationCreatedHere:
      false
  });

export const H_EARTH_DETERMINISTIC_RUNTIME_STEP_012G_TARGET_001_COMPATIBILITY =
  Object.freeze({
    compatibilityId:
      'H_EARTH_DETERMINISTIC_RUNTIME_STEP_012G_TARGET_001_COMPATIBILITY',

    siblingFile:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.state-classification.js',

    siblingContractId:
      'H_EARTH_STATE_CLASSIFICATION_FILE_RENEWAL_STEP_012G_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

    versionEnvelopeAlignedToSiblingContract:
      true,

    importFromSibling:
      false,

    siblingModuleEvaluationVerifiedHere:
      false,

    installedImportCompatibilityVerified:
      false,

    moduleGraphExecutionVerified:
      false
  });

export const H_EARTH_DETERMINISTIC_RUNTIME_CANONICAL_REPLAY_AWARENESS =
  Object.freeze({
    awarenessId:
      'H_EARTH_DETERMINISTIC_RUNTIME_CANONICAL_REPLAY_AWARENESS',

    adjacentFile:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.canonical-replay.js',

    adjacentKnownOrReportedContract:
      'H_EARTH_CANONICAL_SERIALIZATION_AND_REPLAY_v1',

    adjacentStatus:
      'ADJACENT_DEFERRED_REPLAY_CONSUMER_AWARENESS_ONLY',

    requiredNamedExportsRecorded:
      true,

    requiredNamedExports:
      Object.freeze([
        'createHEarthRuntime',
        'admitHEarthIntent',
        'commitHEarthNextTick'
      ]),

    runtimeFactoryExportPreserved:
      true,

    admitIntentExportPreserved:
      true,

    commitNextTickExportPreserved:
      true,

    canonicalReplayReviewedHere:
      false,

    canonicalReplayExecutedHere:
      false,

    replayProofClaim:
      false
  });

export const H_EARTH_DETERMINISTIC_RUNTIME_ALLOWED_DESCRIPTOR_CLAIMS =
  Object.freeze([
    'deterministicRuntimeDescriptorRead',
    'deterministicRuntimeSupportFunctionsDefined',
    'versionEnvelopeDefined',
    'step012DCompatibilityRecorded',
    'step012GTarget001CompatibilityRecorded',
    'canonicalReplayAwarenessRecorded',
    'initialStateSeedPolicyRecorded',
    'runtimeBoundaryRecorded',
    'sameTickIntentProcessingRuleDefined',
    'staleQueueDispositionDefined',
    'pendingMutationIdUniquenessDefined',
    'pendingDuplicateRejectionNonPoisoningDefined',
    'tickLocalDuplicateDispositionDefined',
    'normalizedMutationIdLedgersDefined',
    'committedRejectedLedgerDisjointnessDefined',
    'oneMutationIdOneTerminalDispositionDefined',
    'duplicateIdentityRejectionsEventOnlyDefined',
    'rejectionEventLedgerMetadataDefined',
    'deterministicEventIdentityDefined'
  ]);

export const H_EARTH_DETERMINISTIC_RUNTIME_BLOCKED_CLAIMS =
  Object.freeze([
    'PASS_CANDIDATE',
    'runtimeActivated',
    'runtimeCreatedAtModuleLoad',
    'intentAdmittedAtModuleLoad',
    'tickCommittedAtModuleLoad',
    'actionExecutedAtModuleLoad',
    'readoutExecutedAtModuleLoad',
    'receiptGeneratedAtModuleLoad',
    'receiptPersistedAtModuleLoad',
    'neighboringSourceModuleImported',
    'neighboringSourceModuleExecuted',
    'moduleGraphExecuted',
    'importResolutionVerified',
    'runtimeDependencyResolutionVerified',
    'installedModuleEvaluationVerified',
    'executableHarnessConstructed',
    'executableHarnessLogicExecuted',
    'harnessExecuted',
    'testExecuted',
    'preflightExecuted',
    'rendererActivated',
    'routeActivated',
    'validationClaim',
    'productionClaim',
    'deploymentClaim',
    'visualPassClaim',
    'matrixCollapse'
  ]);

export const H_EARTH_DETERMINISTIC_RUNTIME_CLAIM_GUARD_MODEL =
  Object.freeze({
    modelId:
      'H_EARTH_DETERMINISTIC_RUNTIME_CLAIM_GUARD_MODEL',

    securityProperty:
      'ALLOWLIST_WITH_UNKNOWN_REJECTION',

    allowedClaimListIsAuthoritative:
      true,

    blockedClaimListIsExplanatoryNotExhaustive:
      true,

    unknownClaimsRejectedIndependentlyOfBlockedList:
      true,

    allowedClaims:
      H_EARTH_DETERMINISTIC_RUNTIME_ALLOWED_DESCRIPTOR_CLAIMS,

    blockedClaims:
      H_EARTH_DETERMINISTIC_RUNTIME_BLOCKED_CLAIMS
  });

export function isHEarthDeterministicRuntimeClaimAllowed(claimName) {
  if (!claimName || typeof claimName !== 'string') return false;

  const allowedClaims =
    new Set(H_EARTH_DETERMINISTIC_RUNTIME_ALLOWED_DESCRIPTOR_CLAIMS);

  return allowedClaims.has(claimName);
}

export function classifyHEarthDeterministicRuntimeClaim(claimName) {
  if (!claimName || typeof claimName !== 'string') {
    return Object.freeze({
      claimName,
      recognized:
        false,
      allowed:
        false,
      classification:
        'INVALID_CLAIM_NAME',
      failClosed:
        true
    });
  }

  const allowedClaims =
    new Set(H_EARTH_DETERMINISTIC_RUNTIME_ALLOWED_DESCRIPTOR_CLAIMS);

  const blockedClaims =
    new Set(H_EARTH_DETERMINISTIC_RUNTIME_BLOCKED_CLAIMS);

  if (allowedClaims.has(claimName)) {
    return Object.freeze({
      claimName,
      recognized:
        true,
      allowed:
        true,
      classification:
        'ALLOW_STATIC_DETERMINISTIC_RUNTIME_DESCRIPTOR_READ_ONLY',
      failClosed:
        true
    });
  }

  if (blockedClaims.has(claimName)) {
    return Object.freeze({
      claimName,
      recognized:
        true,
      allowed:
        false,
      classification:
        'REJECTED_EXPLICITLY_BLOCKED_RUNTIME_OR_EXECUTION_CLAIM',
      blockedClaimListIsExplanatoryNotExhaustive:
        true,
      failClosed:
        true
    });
  }

  return Object.freeze({
    claimName,
    recognized:
      false,
    allowed:
      false,
    classification:
      'REJECTED_UNKNOWN_OR_UNAUTHORIZED_DETERMINISTIC_RUNTIME_CLAIM',
    unknownClaimsRejectedIndependentlyOfBlockedList:
      true,
    failClosed:
      true
  });
}

export function getHEarthDeterministicRuntimeAuthority() {
  return H_EARTH_DETERMINISTIC_RUNTIME_AUTHORITY;
}

export function getHEarthDeterministicRuntimeContract() {
  return H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT;
}

export function getHEarthDeterministicRuntimeStep012DCompatibility() {
  return H_EARTH_DETERMINISTIC_RUNTIME_STEP_012D_COMPATIBILITY;
}

export function getHEarthDeterministicRuntimeStep012GTarget001Compatibility() {
  return H_EARTH_DETERMINISTIC_RUNTIME_STEP_012G_TARGET_001_COMPATIBILITY;
}

export function getHEarthDeterministicRuntimeCanonicalReplayAwareness() {
  return H_EARTH_DETERMINISTIC_RUNTIME_CANONICAL_REPLAY_AWARENESS;
}

export function getHEarthDeterministicRuntimeClaimGuardModel() {
  return H_EARTH_DETERMINISTIC_RUNTIME_CLAIM_GUARD_MODEL;
}

export function getHEarthDeterministicRuntimeDescriptorReceipt() {
  return Object.freeze({
    receiptType:
      'H_EARTH_DETERMINISTIC_RUNTIME_STEP_012G_TARGET_002_DESCRIPTOR_RECEIPT',

    receiptId:
      'H_EARTH_DETERMINISTIC_RUNTIME_STEP_012G_TARGET_002_RUNTIME_KERNEL_DEPENDENCY_REVIEW_DESCRIPTOR_RECEIPT_v1',

    contractId:
      H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,

    priorVerifiedContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    file:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.deterministic-runtime.js',

    status:
      'STEP_012G_TARGET_002_STATIC_DETERMINISTIC_RUNTIME_KERNEL_REVIEW_DESCRIPTOR_DEFINED',

    authorityBoundaryRecorded:
      true,

    ownModuleInitializationExecution:
      true,

    deterministicRuntimeSupportFunctionsDefinedHere:
      true,

    deterministicRuntimeSupportFunctionsExecutedHere:
      false,

    step012DCompatibilityRecorded:
      true,

    createInitialStateSeedCallContractPreserved:
      true,

    step012GTarget001CompatibilityRecorded:
      true,

    canonicalReplayAwarenessRecorded:
      true,

    versionEnvelopeAlignedToStateClassificationTarget001:
      true,

    initialStateSeedPolicyRecorded:
      true,

    mutableSeedTypeValidationRecorded:
      true,

    sameTickIntentProcessingRuleDefined:
      true,

    staleQueueDispositionDefined:
      true,

    pendingMutationIdUniquenessDefined:
      true,

    pendingDuplicateRejectionNonPoisoningDefined:
      true,

    tickLocalDuplicateDispositionDefined:
      true,

    normalizedMutationIdLedgersDefined:
      true,

    committedRejectedLedgerDisjointnessDefined:
      true,

    oneMutationIdOneTerminalDispositionDefined:
      true,

    duplicateIdentityRejectionsEventOnlyDefined:
      true,

    rejectionEventLedgerMetadataDefined:
      true,

    deterministicEventIdentityDefined:
      true,

    neighboringSourceModuleImport:
      false,

    neighboringSourceModuleExecution:
      false,

    importResolutionProof:
      false,

    runtimeDependencyResolutionProof:
      false,

    installedModuleEvaluationProof:
      false,

    moduleGraphExecution:
      false,

    executableHarnessConstructedHere:
      false,

    executableHarnessLogicExecution:
      false,

    harnessExecutedHere:
      false,

    testExecutedHere:
      false,

    preflightExecutedHere:
      false,

    liveRuntimeActivated:
      false,

    runtimeCreatedHere:
      false,

    intentAdmittedHere:
      false,

    tickCommittedHere:
      false,

    actionExecutedHere:
      false,

    readoutExecutedHere:
      false,

    observationAcquiredHere:
      false,

    receiptOccurrenceGeneratedHere:
      false,

    receiptPersistedHere:
      false,

    rendererActivated:
      false,

    routeActivated:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false,

    nextRuntimeKernelTarget:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.canonical-replay.js',

    nextRuntimeKernelTargetRenewalAuthorizedByThisFile:
      false,

    finalMarker:
      'export default H_EARTH_DETERMINISTIC_RUNTIME;'
  });
}

export function getHEarthDeterministicRuntimeReceipt() {
  return getHEarthDeterministicRuntimeDescriptorReceipt();
}

export const H_EARTH_DETERMINISTIC_RUNTIME =
  Object.freeze({
    id:
      'H_EARTH_DETERMINISTIC_RUNTIME',

    file:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/runtime/h-earth.deterministic-runtime.js',

    contractId:
      H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,

    priorVerifiedContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    authority:
      H_EARTH_DETERMINISTIC_RUNTIME_AUTHORITY,

    contract:
      H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT,

    versionEnvelope:
      H_EARTH_VERSION_ENVELOPE,

    simulationStepMs:
      H_EARTH_SIMULATION_STEP_MS,

    canonicalInitialStateIdentifiers:
      H_EARTH_CANONICAL_INITIAL_STATE_IDENTIFIERS,

    sourcePriority:
      H_EARTH_DETERMINISTIC_RUNTIME_SOURCE_PRIORITY,

    sourceClassPolicy:
      H_EARTH_DETERMINISTIC_RUNTIME_SOURCE_CLASS_POLICY,

    initialStateSeedPolicy:
      H_EARTH_INITIAL_STATE_SEED_POLICY,

    compareIntents:
      compareHEarthIntents,

    createInitialState:
      createHEarthInitialState,

    createRuntime:
      createHEarthRuntime,

    validateIntent:
      validateHEarthIntent,

    admitIntent:
      admitHEarthIntent,

    commitNextTick:
      commitHEarthNextTick,

    boundary:
      H_EARTH_DETERMINISTIC_RUNTIME_BOUNDARY,

    step012DCompatibility:
      H_EARTH_DETERMINISTIC_RUNTIME_STEP_012D_COMPATIBILITY,

    step012GTarget001Compatibility:
      H_EARTH_DETERMINISTIC_RUNTIME_STEP_012G_TARGET_001_COMPATIBILITY,

    canonicalReplayAwareness:
      H_EARTH_DETERMINISTIC_RUNTIME_CANONICAL_REPLAY_AWARENESS,

    claimGuardModel:
      H_EARTH_DETERMINISTIC_RUNTIME_CLAIM_GUARD_MODEL,

    allowedDescriptorClaims:
      H_EARTH_DETERMINISTIC_RUNTIME_ALLOWED_DESCRIPTOR_CLAIMS,

    blockedClaims:
      H_EARTH_DETERMINISTIC_RUNTIME_BLOCKED_CLAIMS,

    mode:
      'STATIC_DETERMINISTIC_RUNTIME_KERNEL_DEPENDENCY_REVIEW_ONLY',

    fileClass:
      'HEADLESS_DETERMINISTIC_RUNTIME_SUPPORT_FUNCTIONS_DEFINED_ONLY',

    ownModuleInitializationExecution:
      true,

    deterministicRuntimeSupportFunctionsDefinedHere:
      true,

    deterministicRuntimeSupportFunctionsExecutedHere:
      false,

    runtimeCreatedHere:
      false,

    intentAdmittedHere:
      false,

    tickCommittedHere:
      false,

    receiptOccurrenceGeneratedHere:
      false,

    neighboringSourceModuleImport:
      false,

    neighboringSourceModuleExecution:
      false,

    runtimeActivated:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false,

    finalMarker:
      'export default H_EARTH_DETERMINISTIC_RUNTIME;'
  });

export default H_EARTH_DETERMINISTIC_RUNTIME;
