import { WORLD_KERNEL } from "./world_kernel.js";

const NUMERIC_MODE = "A_INT32_BIGINT";
const ENUM_VERSION = WORLD_KERNEL?.state?.registry?.version || 1;

/* ================================
   BIGINT SAFE CORE
================================ */
function toBigInt(n) {
  return BigInt(n | 0);
}

function safeAdd(a, b) {
  return Number(toBigInt(a) + toBigInt(b));
}

function safeMul(a, b) {
  return Number(toBigInt(a) * toBigInt(b));
}

/* ================================
   FNV-1a 64 (BigInt deterministic)
================================ */
function fnv1a64(intArray) {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;

  for (let i = 0; i < intArray.length; i++) {
    hash ^= BigInt(intArray[i] >>> 0);
    hash = (hash * prime) & 0xffffffffffffffffn;
  }

  return hash.toString(16).padStart(16, "0");
}

/* ================================
   CANONICAL SERIALIZATION
================================ */
function serializeStateBuffer(stateBuffer) {
  const out = [];

  for (let y = 0; y < stateBuffer.length; y++) {
    const row = stateBuffer[y];
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];

      out.push(cell.stateCode | 0);
      out.push(cell.stateAge | 0);
    }
  }

  return out;
}

/* ================================
   RECEIPT BUILDER
================================ */
export function createAuthorityReceiptEngine() {

  function computeStateHash(stateBuffer) {
    const serialized = serializeStateBuffer(stateBuffer);
    return fnv1a64(serialized);
  }

  function buildReceipt({
    tickIndex = 0,
    stateBuffer,
    prevHash = "0",
    seed = 0,
    scale = 1,
    projection = "flat",
    metrics = {}
  }) {

    const stateHash = computeStateHash(stateBuffer);

    const minState = metrics.minState ?? 0;
    const maxState = metrics.maxState ?? 0;

    return Object.freeze({
      RUN_ID: `${seed}_${scale}_${projection}`,
      SEED: seed,
      SCALE_FACTOR: scale,
      PROJECTION: projection,

      TICK: tickIndex,

      STATE_HASH: stateHash,
      PREV_HASH: prevHash,

      ENUM_REGISTRY_VERSION: ENUM_VERSION,
      NUMERIC_MODE: NUMERIC_MODE,

      MIN_STATE: minState | 0,
      MAX_STATE: maxState | 0,

      FAIL_FLAGS: Object.freeze([]),

      PERFORMANCE: Object.freeze({
        tickMs: metrics.tickMs ?? 0,
        frameMs: metrics.frameMs ?? 0
      })
    });
  }

  return Object.freeze({
    computeStateHash,
    buildReceipt
  });
}

/* ================================
   REPLAY VERIFIER
================================ */
export function createAuthorityReplayVerifier() {

  function verifyRun(receiptsA, receiptsB) {

    if (!Array.isArray(receiptsA) || !Array.isArray(receiptsB)) {
      return { pass: false, reason: "INVALID_INPUT" };
    }

    if (receiptsA.length !== receiptsB.length) {
      return { pass: false, reason: "LENGTH_MISMATCH" };
    }

    for (let i = 0; i < receiptsA.length; i++) {
      const a = receiptsA[i];
      const b = receiptsB[i];

      if (a.STATE_HASH !== b.STATE_HASH) {
        return {
          pass: false,
          reason: "HASH_MISMATCH",
          tick: i
        };
      }

      if (a.ENUM_REGISTRY_VERSION !== b.ENUM_REGISTRY_VERSION) {
        return {
          pass: false,
          reason: "ENUM_VERSION_MISMATCH",
          tick: i
        };
      }

      if (a.NUMERIC_MODE !== b.NUMERIC_MODE) {
        return {
          pass: false,
          reason: "NUMERIC_MODE_MISMATCH",
          tick: i
        };
      }
    }

    return { pass: true };
  }

  return Object.freeze({
    verifyRun
  });
}
