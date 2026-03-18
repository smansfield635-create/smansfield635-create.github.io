import { WORLD_KERNEL } from "./world_kernel.js";

const NUMERIC_MODE = "A_INT32_BIGINT";
const ENUM_VERSION = WORLD_KERNEL?.state?.registry?.version || 1;

/* ================================
   CANONICAL CHANNEL SET
================================ */
export const STATE_HASH_CHANNEL_SET_V1 = Object.freeze([
  "stateCode",
  "stateAge",
  "tickIndex",
  "enumRegistryVersion",
  "numericModeCode",
  "activeRuleFamilies",
  "transitionCounts",
  "blockedTransitionCount",
  "admissibleCount"
]);

/* ================================
   NUMERIC MODE REGISTRY
================================ */
const NUMERIC_MODE_CODES = Object.freeze({
  A_INT32_BIGINT: 1
});

function getNumericModeCode(mode) {
  const code = NUMERIC_MODE_CODES[mode];
  if (!Number.isInteger(code)) {
    throw new Error(`NUMERIC_MODE_INVALID:${String(mode)}`);
  }
  return code;
}

/* ================================
   BIGINT SAFE CORE
================================ */
function toBigInt(value) {
  return BigInt(Number.isInteger(value) ? value : 0);
}

function fnv1a64(intArray) {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;

  for (let i = 0; i < intArray.length; i += 1) {
    const value = BigInt((intArray[i] ?? 0) >>> 0);
    hash ^= value;
    hash = (hash * prime) & 0xffffffffffffffffn;
  }

  return hash.toString(16).padStart(16, "0");
}

/* ================================
   CANONICAL NORMALIZATION
================================ */
function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeInt(value, fallback = 0) {
  return Number.isInteger(value) ? value | 0 : fallback | 0;
}

function stableFamilyCode(ruleFamily) {
  const normalized = typeof ruleFamily === "string" ? ruleFamily.trim().toUpperCase() : "";

  if (normalized === "FREEZE_MELT") return 1;
  if (normalized === "WATER_RETENTION_SPREAD") return 2;
  if (normalized === "WETTING_DRYING") return 3;

  return 0;
}

function sortRuleFamilyCodes(activeRuleFamilies) {
  return normalizeArray(activeRuleFamilies)
    .map((family) => stableFamilyCode(family))
    .filter((code) => code > 0)
    .sort((a, b) => a - b);
}

function normalizeTransitionCounts(transitionCounts) {
  const source = normalizeObject(transitionCounts);

  return Object.freeze({
    FREEZE_MELT: normalizeInt(source.FREEZE_MELT, 0),
    WATER_RETENTION_SPREAD: normalizeInt(source.WATER_RETENTION_SPREAD, 0),
    WETTING_DRYING: normalizeInt(source.WETTING_DRYING, 0)
  });
}

/* ================================
   CHANNEL SERIALIZATION
================================ */
function serializeStateCells(stateBuffer) {
  const out = [];

  for (let y = 0; y < stateBuffer.length; y += 1) {
    const row = stateBuffer[y];
    for (let x = 0; x < row.length; x += 1) {
      const cell = row[x];
      out.push(normalizeInt(cell?.stateCode, 0));
      out.push(normalizeInt(cell?.stateAge, 0));
    }
  }

  return out;
}

function serializeCanonicalChannels({
  stateBuffer,
  tickIndex,
  enumRegistryVersion,
  numericMode,
  activeRuleFamilies,
  transitionCounts,
  blockedTransitionCount,
  admissibleCount
}) {
  const numericModeCode = getNumericModeCode(numericMode);
  const ruleFamilyCodes = sortRuleFamilyCodes(activeRuleFamilies);
  const counts = normalizeTransitionCounts(transitionCounts);

  const out = [];

  /* channel 1-2: state cells */
  out.push(...serializeStateCells(stateBuffer));

  /* channel 3-5: tick + enum version + numeric mode */
  out.push(normalizeInt(tickIndex, 0));
  out.push(normalizeInt(enumRegistryVersion, 0));
  out.push(normalizeInt(numericModeCode, 0));

  /* channel 6: active rule families */
  out.push(normalizeInt(ruleFamilyCodes.length, 0));
  out.push(...ruleFamilyCodes);

  /* channel 7: transition counts (fixed order) */
  out.push(counts.FREEZE_MELT);
  out.push(counts.WATER_RETENTION_SPREAD);
  out.push(counts.WETTING_DRYING);

  /* channel 8-9: blocked + admissible */
  out.push(normalizeInt(blockedTransitionCount, 0));
  out.push(normalizeInt(admissibleCount, 0));

  return out;
}

/* ================================
   METRIC EXTRACTION
================================ */
function summarizeStateExtrema(stateBuffer) {
  let minState = 2147483647;
  let maxState = -2147483648;

  for (let y = 0; y < stateBuffer.length; y += 1) {
    const row = stateBuffer[y];
    for (let x = 0; x < row.length; x += 1) {
      const code = normalizeInt(row[x]?.stateCode, 0);
      if (code < minState) minState = code;
      if (code > maxState) maxState = code;
    }
  }

  if (minState === 2147483647) minState = 0;
  if (maxState === -2147483648) maxState = 0;

  return Object.freeze({
    minState: minState | 0,
    maxState: maxState | 0
  });
}

/* ================================
   RECEIPT ENGINE
================================ */
export function createAuthorityReceiptEngine() {
  function computeStateHash({
    stateBuffer,
    tickIndex = 0,
    enumRegistryVersion = ENUM_VERSION,
    numericMode = NUMERIC_MODE,
    activeRuleFamilies = [],
    transitionCounts = {},
    blockedTransitionCount = 0,
    admissibleCount = 0
  }) {
    const serialized = serializeCanonicalChannels({
      stateBuffer,
      tickIndex,
      enumRegistryVersion,
      numericMode,
      activeRuleFamilies,
      transitionCounts,
      blockedTransitionCount,
      admissibleCount
    });

    return fnv1a64(serialized);
  }

  function buildReceipt({
    tickIndex = 0,
    stateBuffer,
    prevHash = "0",
    seed = 0,
    scale = 1,
    projection = "flat",
    transitionSummary = {},
    metrics = {}
  }) {
    const activeRuleFamilies = normalizeArray(transitionSummary.activeRuleFamilies);
    const transitionCounts = normalizeTransitionCounts(transitionSummary.transitionCounts);
    const blockedTransitionCount = normalizeInt(transitionSummary.blockedTransitionCount, 0);
    const admissibleCount = normalizeInt(transitionSummary.admissibleCount, 0);

    const stateHash = computeStateHash({
      stateBuffer,
      tickIndex,
      enumRegistryVersion: ENUM_VERSION,
      numericMode: NUMERIC_MODE,
      activeRuleFamilies,
      transitionCounts,
      blockedTransitionCount,
      admissibleCount
    });

    const extrema = summarizeStateExtrema(stateBuffer);

    return Object.freeze({
      RUN_ID: `${seed}_${scale}_${projection}`,
      SEED: normalizeInt(seed, 0),
      SCALE_FACTOR: normalizeInt(scale, 1),
      PROJECTION: typeof projection === "string" ? projection : "flat",

      TICK: normalizeInt(tickIndex, 0),

      STATE_HASH: stateHash,
      PREV_HASH: String(prevHash),

      ENUM_REGISTRY_VERSION: ENUM_VERSION,
      NUMERIC_MODE: NUMERIC_MODE,

      CHANNEL_SET_VERSION: 1,
      CHANNEL_SET: STATE_HASH_CHANNEL_SET_V1,

      ACTIVE_RULE_FAMILIES: Object.freeze([...activeRuleFamilies]),
      TRANSITION_COUNTS: transitionCounts,
      BLOCKED_TRANSITION_COUNT: blockedTransitionCount,
      ADMISSIBLE_COUNT: admissibleCount,

      MIN_STATE: normalizeInt(metrics.minState, extrema.minState),
      MAX_STATE: normalizeInt(metrics.maxState, extrema.maxState),

      FAIL_FLAGS: Object.freeze(normalizeArray(metrics.failFlags)),
      PERFORMANCE: Object.freeze({
        tickMs: Number.isFinite(metrics.tickMs) ? metrics.tickMs : 0,
        frameMs: Number.isFinite(metrics.frameMs) ? metrics.frameMs : 0
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
      return Object.freeze({ pass: false, reason: "INVALID_INPUT" });
    }

    if (receiptsA.length !== receiptsB.length) {
      return Object.freeze({ pass: false, reason: "LENGTH_MISMATCH" });
    }

    for (let i = 0; i < receiptsA.length; i += 1) {
      const a = receiptsA[i];
      const b = receiptsB[i];

      if (a.STATE_HASH !== b.STATE_HASH) {
        return Object.freeze({
          pass: false,
          reason: "HASH_MISMATCH",
          tick: i
        });
      }

      if (a.ENUM_REGISTRY_VERSION !== b.ENUM_REGISTRY_VERSION) {
        return Object.freeze({
          pass: false,
          reason: "ENUM_VERSION_MISMATCH",
          tick: i
        });
      }

      if (a.NUMERIC_MODE !== b.NUMERIC_MODE) {
        return Object.freeze({
          pass: false,
          reason: "NUMERIC_MODE_MISMATCH",
          tick: i
        });
      }

      if (a.CHANNEL_SET_VERSION !== b.CHANNEL_SET_VERSION) {
        return Object.freeze({
          pass: false,
          reason: "CHANNEL_SET_VERSION_MISMATCH",
          tick: i
        });
      }

      const aChannels = Array.isArray(a.CHANNEL_SET) ? a.CHANNEL_SET.join("|") : "";
      const bChannels = Array.isArray(b.CHANNEL_SET) ? b.CHANNEL_SET.join("|") : "";

      if (aChannels !== bChannels) {
        return Object.freeze({
          pass: false,
          reason: "CHANNEL_SET_MISMATCH",
          tick: i
        });
      }
    }

    return Object.freeze({ pass: true });
  }

  return Object.freeze({
    verifyRun
  });
}
