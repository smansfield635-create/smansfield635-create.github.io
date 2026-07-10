// /h-earth-3d/runtime/h-earth.canonical-replay.js
// COMPLETE CANDIDATE FILE
// H_EARTH_CANONICAL_SERIALIZATION_AND_REPLAY_v1
// Pure deterministic reference utilities. No persistence or runtime activation.

import {
  createHEarthRuntime,
  admitHEarthIntent,
  commitHEarthNextTick
} from './h-earth.deterministic-runtime.js';

export const H_EARTH_CANONICAL_REPLAY_CONTRACT_ID =
  'H_EARTH_CANONICAL_SERIALIZATION_AND_REPLAY_v1';

const AUTHORITATIVE_EXCLUDED_KEYS = new Set([
  'durationMs',
  'wallClockTime',
  'domReference',
  'browserGeneratedId',
  'diagnostics',
  'ephemeralVisualState'
]);

function assertCanonicalNumber(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError('NON_FINITE_NUMBER_REJECTED');
  }

  if (Object.is(value, -0)) {
    return 0;
  }

  return value;
}

function normalize(value) {
  if (value === undefined) {
    throw new TypeError('IMPLICIT_UNDEFINED_REJECTED');
  }

  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (typeof value === 'number') {
    return assertCanonicalNumber(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (typeof value === 'object') {
    const result = {};

    for (const key of Object.keys(value).sort()) {
      if (AUTHORITATIVE_EXCLUDED_KEYS.has(key)) {
        continue;
      }

      const child = value[key];

      if (child === undefined) {
        throw new TypeError(
          `IMPLICIT_UNDEFINED_REJECTED:${key}`
        );
      }

      result[key] = normalize(child);
    }

    return result;
  }

  throw new TypeError(
    `UNSUPPORTED_CANONICAL_TYPE:${typeof value}`
  );
}

export function canonicalizeHEarthValue(value) {
  return JSON.stringify(
    normalize(value)
  );
}

function rightRotate(value, amount) {
  return (
    (value >>> amount) |
    (value << (32 - amount))
  );
}

export function sha256HEarthText(input) {
  const utf8 =
    unescape(
      encodeURIComponent(
        String(input)
      )
    );

  const maxWord =
    2 ** 32;

  const words = [];
  const hash = [];
  const constants = [];
  const isComposite = {};

  let primeCounter = 0;

  for (
    let candidate = 2;
    primeCounter < 64;
    candidate += 1
  ) {
    if (!isComposite[candidate]) {
      for (
        let multiple =
          candidate * candidate;
        multiple < 313;
        multiple += candidate
      ) {
        isComposite[multiple] = true;
      }

      hash[primeCounter] =
        (
          candidate ** 0.5 *
          maxWord
        ) | 0;

      constants[primeCounter] =
        (
          candidate ** (1 / 3) *
          maxWord
        ) | 0;

      primeCounter += 1;
    }
  }

  let message =
    utf8 + '\x80';

  while (
    message.length % 64 !== 56
  ) {
    message += '\x00';
  }

  for (
    let index = 0;
    index < message.length;
    index += 1
  ) {
    words[index >> 2] =
      words[index >> 2] || 0;

    words[index >> 2] |=
      message.charCodeAt(index) <<
      (
        (3 - index) % 4
      ) * 8;
  }

  const bitLength =
    utf8.length * 8;

  words.push(
    Math.floor(
      bitLength / maxWord
    )
  );

  words.push(
    bitLength >>> 0
  );

  for (
    let block = 0;
    block < words.length;
    block += 16
  ) {
    const schedule =
      words.slice(
        block,
        block + 16
      );

    const oldHash =
      hash.slice(0);

    for (
      let round = 0;
      round < 64;
      round += 1
    ) {
      const w15 =
        schedule[round - 15];

      const w2 =
        schedule[round - 2];

      if (round >= 16) {
        const s0 =
          rightRotate(w15, 7) ^
          rightRotate(w15, 18) ^
          (w15 >>> 3);

        const s1 =
          rightRotate(w2, 17) ^
          rightRotate(w2, 19) ^
          (w2 >>> 10);

        schedule[round] =
          (
            schedule[round - 16] +
            s0 +
            schedule[round - 7] +
            s1
          ) | 0;
      }

      const a =
        hash[0];

      const e =
        hash[4];

      const sigma1 =
        rightRotate(e, 6) ^
        rightRotate(e, 11) ^
        rightRotate(e, 25);

      const choose =
        (e & hash[5]) ^
        (~e & hash[6]);

      const temp1 =
        (
          hash[7] +
          sigma1 +
          choose +
          constants[round] +
          schedule[round]
        ) | 0;

      const sigma0 =
        rightRotate(a, 2) ^
        rightRotate(a, 13) ^
        rightRotate(a, 22);

      const majority =
        (a & hash[1]) ^
        (a & hash[2]) ^
        (hash[1] & hash[2]);

      const temp2 =
        (
          sigma0 +
          majority
        ) | 0;

      hash[7] =
        hash[6];

      hash[6] =
        hash[5];

      hash[5] =
        hash[4];

      hash[4] =
        (
          hash[3] +
          temp1
        ) | 0;

      hash[3] =
        hash[2];

      hash[2] =
        hash[1];

      hash[1] =
        hash[0];

      hash[0] =
        (
          temp1 +
          temp2
        ) | 0;
    }

    for (
      let index = 0;
      index < 8;
      index += 1
    ) {
      hash[index] =
        (
          hash[index] +
          oldHash[index]
        ) | 0;
    }
  }

  return hash
    .slice(0, 8)
    .map(
      (value) =>
        (value >>> 0)
          .toString(16)
          .padStart(8, '0')
    )
    .join('');
}

export function hashHEarthAuthoritativeState(
  state
) {
  return sha256HEarthText(
    canonicalizeHEarthValue(state)
  );
}

export function hashHEarthEventBatch(
  events
) {
  return sha256HEarthText(
    canonicalizeHEarthValue(events)
  );
}

export function createHEarthSnapshot(
  runtime,
  versionEnvelope
) {
  const snapshot = {
    snapshotSchemaVersion:
      '1.0.0-candidate',

    versionEnvelope,

    simulationTick:
      runtime.committedState
        .simulationTick,

    stateVersion:
      runtime.committedState
        .stateVersion,

    authoritativeState:
      runtime.committedState,

    authoritativeStateHash:
      hashHEarthAuthoritativeState(
        runtime.committedState
      ),

    eventCount:
      runtime.events.length,

    eventBatchHash:
      hashHEarthEventBatch(
        runtime.events
      )
  };

  return Object.freeze({
    ...snapshot,

    snapshotHash:
      sha256HEarthText(
        canonicalizeHEarthValue(
          snapshot
        )
      )
  });
}

export function replayHEarthScenario({
  initialState,
  orderedIntents,
  finalTick,
  versionEnvelope
}) {
  if (
    !Number.isInteger(finalTick) ||
    finalTick <
      initialState.simulationTick
  ) {
    throw new TypeError(
      'INVALID_FINAL_TICK'
    );
  }

  const runtime =
    createHEarthRuntime(
      initialState
    );

  for (
    const intent of orderedIntents
  ) {
    admitHEarthIntent(
      runtime,
      intent
    );
  }

  while (
    runtime.committedState
      .simulationTick <
    finalTick
  ) {
    commitHEarthNextTick(
      runtime
    );
  }

  const snapshot =
    createHEarthSnapshot(
      runtime,
      versionEnvelope
    );

  return Object.freeze({
    contractId:
      H_EARTH_CANONICAL_REPLAY_CONTRACT_ID,

    finalState:
      runtime.committedState,

    events:
      Object.freeze([
        ...runtime.events
      ]),

    receipts:
      Object.freeze([
        ...runtime.receipts
      ]),

    snapshot,

    rendererDependency:
      false,

    saveActivationClaim:
      false,

    replayProofClaim:
      false
  });
}

export function compareHEarthReplayResults(
  first,
  second
) {
  const checks =
    Object.freeze({
      finalStateHashEqual:
        first.snapshot
          .authoritativeStateHash ===
        second.snapshot
          .authoritativeStateHash,

      eventBatchHashEqual:
        first.snapshot
          .eventBatchHash ===
        second.snapshot
          .eventBatchHash,

      snapshotHashEqual:
        first.snapshot
          .snapshotHash ===
        second.snapshot
          .snapshotHash,

      eventCountEqual:
        first.events.length ===
        second.events.length,

      rejectedSequenceEqual:
        canonicalizeHEarthValue(
          first.events.filter(
            (event) =>
              event.disposition ===
              'REJECTED'
          )
        ) ===
        canonicalizeHEarthValue(
          second.events.filter(
            (event) =>
              event.disposition ===
              'REJECTED'
          )
        ),

      committedSequenceEqual:
        canonicalizeHEarthValue(
          first.events.filter(
            (event) =>
              event.disposition ===
              'COMMITTED'
          )
        ) ===
        canonicalizeHEarthValue(
          second.events.filter(
            (event) =>
              event.disposition ===
              'COMMITTED'
          )
        )
    });

  const ok =
    Object.values(checks)
      .every(Boolean);

  return Object.freeze({
    ok,

    status:
      ok
        ? 'REPLAY_EQUALITY_CANDIDATE_PASS'
        : 'REPLAY_MISMATCH',

    checks,

    liveProofClaim:
      false
  });
}

export const H_EARTH_CANONICAL_REPLAY_BOUNDARY =
  Object.freeze({
    propertyOrder:
      'LEXICOGRAPHIC_CODE_UNIT_ORDER',

    arrayOrder:
      'PRESERVED',

    implicitUndefined:
      'REJECTED',

    nonFiniteNumbers:
      'REJECTED',

    negativeZero:
      'NORMALIZED_TO_ZERO',

    ephemeralVisualState:
      'EXCLUDED',

    nondeterministicDiagnostics:
      'EXCLUDED',

    hashAlgorithm:
      'SHA-256',

    rendererDependency:
      false,

    persistenceActivated:
      false,

    replayProofClaim:
      false,

    productionClaim:
      false
  });

export default Object.freeze({
  contractId:
    H_EARTH_CANONICAL_REPLAY_CONTRACT_ID,

  canonicalize:
    canonicalizeHEarthValue,

  sha256:
    sha256HEarthText,

  hashState:
    hashHEarthAuthoritativeState,

  hashEvents:
    hashHEarthEventBatch,

  createSnapshot:
    createHEarthSnapshot,

  replayScenario:
    replayHEarthScenario,

  compareReplayResults:
    compareHEarthReplayResults,

  boundary:
    H_EARTH_CANONICAL_REPLAY_BOUNDARY
});
