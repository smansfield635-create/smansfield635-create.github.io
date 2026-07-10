// /h-earth-3d/runtime/tests/h-earth.headless-replay.contract.js
// COMPLETE CANDIDATE FILE
// H_EARTH_HEADLESS_REPLAY_CONTRACT_TEST_v1
// Requires an ES-module test environment. Not executed by this repository delivery step.

import {
  H_EARTH_VERSION_ENVELOPE,
  createHEarthInitialState,
  createHEarthRuntime,
  admitHEarthIntent,
  commitHEarthNextTick
} from '../h-earth.deterministic-runtime.js';

import {
  canonicalizeHEarthValue,
  sha256HEarthText,
  replayHEarthScenario,
  compareHEarthReplayResults
} from '../h-earth.canonical-replay.js';

function assert(condition, code) {
  if (!condition) {
    throw new Error(code);
  }
}

const INTENTS = Object.freeze([
  Object.freeze({
    mutationId: 'MUTATION_0001_INSPECT_GROUND',
    targetTick: 1,
    sourceClass: 'ACTOR',
    sourceSequence: 1,
    actorId: 'H_EARTH_REFERENCE_ACTOR_001',
    targetId: 'H_EARTH_GROUND_CELL_001',
    actionType: 'INSPECT_GROUND',
    governingRule: 'H_EARTH_INSPECT_GROUND_RULE_v1'
  }),

  Object.freeze({
    mutationId: 'MUTATION_0002_RENDERER_ILLEGAL_WRITE',
    targetTick: 1,
    sourceClass: 'RENDERER',
    sourceSequence: 2,
    actorId: 'H_EARTH_RENDERER',
    targetId: 'H_EARTH_GROUND_CELL_001',
    actionType: 'INSPECT_GROUND',
    governingRule: 'H_EARTH_INSPECT_GROUND_RULE_v1'
  }),

  Object.freeze({
    mutationId: 'MUTATION_0003_INSPECT_GROUND',
    targetTick: 2,
    sourceClass: 'ACTOR',
    sourceSequence: 3,
    actorId: 'H_EARTH_REFERENCE_ACTOR_001',
    targetId: 'H_EARTH_GROUND_CELL_001',
    actionType: 'INSPECT_GROUND',
    governingRule: 'H_EARTH_INSPECT_GROUND_RULE_v1'
  })
]);

export function runHEarthHeadlessReplayContract() {
  const initialState =
    createHEarthInitialState();

  const runtime =
    createHEarthRuntime(initialState);

  const admitted =
    admitHEarthIntent(
      runtime,
      INTENTS[0]
    );

  const rejected =
    admitHEarthIntent(
      runtime,
      INTENTS[1]
    );

  admitHEarthIntent(
    runtime,
    INTENTS[2]
  );

  assert(
    admitted.status ===
      'ADMITTED_TO_ORDERED_QUEUE',
    'ADMISSION_FAILED'
  );

  assert(
    rejected.status ===
      'REJECTED',
    'RENDERER_MUTATION_NOT_REJECTED'
  );

  assert(
    rejected.failureClass ===
      'UNAUTHORIZED_MUTATION_SOURCE',
    'WRONG_REJECTION_CLASS'
  );

  const tick1 =
    commitHEarthNextTick(runtime);

  const tick2 =
    commitHEarthNextTick(runtime);

  assert(
    tick1.simulationTick === 1,
    'TICK_1_NOT_COMMITTED'
  );

  assert(
    tick2.simulationTick === 2,
    'TICK_2_NOT_COMMITTED'
  );

  assert(
    runtime.committedState
      .stateVersion === 2,
    'STATE_VERSION_NOT_TWO'
  );

  assert(
    runtime.committedState
      .cells
      .H_EARTH_GROUND_CELL_001
      .inspectionCount === 2,
    'INSPECTION_COUNT_NOT_TWO'
  );

  assert(
    runtime.committedState
      .readouts
      .length === 2,
    'READOUT_COUNT_NOT_TWO'
  );

  const firstReplay =
    replayHEarthScenario({
      initialState,

      orderedIntents:
        INTENTS,

      finalTick:
        2,

      versionEnvelope:
        H_EARTH_VERSION_ENVELOPE
    });

  const secondReplay =
    replayHEarthScenario({
      initialState,

      orderedIntents:
        [...INTENTS].reverse(),

      finalTick:
        2,

      versionEnvelope:
        H_EARTH_VERSION_ENVELOPE
    });

  const comparison =
    compareHEarthReplayResults(
      firstReplay,
      secondReplay
    );

  assert(
    comparison.ok,
    'REPLAY_EQUALITY_FAILED'
  );

  assert(
    canonicalizeHEarthValue({
      b: 2,
      a: 1
    }) === '{"a":1,"b":2}',
    'CANONICAL_PROPERTY_ORDER_FAILED'
  );

  assert(
    sha256HEarthText('abc') ===
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    'SHA256_KNOWN_VECTOR_FAILED'
  );

  let undefinedRejected =
    false;

  try {
    canonicalizeHEarthValue({
      forbidden: undefined
    });
  } catch (error) {
    undefinedRejected =
      error.message.startsWith(
        'IMPLICIT_UNDEFINED_REJECTED'
      );
  }

  assert(
    undefinedRejected,
    'IMPLICIT_UNDEFINED_NOT_REJECTED'
  );

  let nonFiniteRejected =
    false;

  try {
    canonicalizeHEarthValue({
      forbidden: Number.NaN
    });
  } catch (error) {
    nonFiniteRejected =
      error.message ===
      'NON_FINITE_NUMBER_REJECTED';
  }

  assert(
    nonFiniteRejected,
    'NON_FINITE_NUMBER_NOT_REJECTED'
  );

  return Object.freeze({
    contractId:
      'H_EARTH_HEADLESS_REPLAY_CONTRACT_TEST_v1',

    status:
      'HEADLESS_VERIFICATION_CANDIDATE_PASS',

    checks:
      Object.freeze({
        orderedAdmission:
          true,

        rendererMutationRejected:
          true,

        fixedTickProgression:
          true,

        mutationCommitIsolation:
          true,

        readoutEmission:
          true,

        canonicalPropertyOrder:
          true,

        sha256KnownVector:
          true,

        undefinedRejected:
          true,

        nonFiniteNumberRejected:
          true,

        replayEquality:
          comparison.ok,

        rendererDependency:
          false
      }),

    finalStateHash:
      firstReplay
        .snapshot
        .authoritativeStateHash,

    eventBatchHash:
      firstReplay
        .snapshot
        .eventBatchHash,

    snapshotHash:
      firstReplay
        .snapshot
        .snapshotHash,

    executionClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false
  });
}

export default runHEarthHeadlessReplayContract;
