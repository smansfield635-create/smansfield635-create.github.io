import { WORLD_KERNEL } from "./world_kernel.js";

const NUMERIC_MODE = "A_INT32_BIGINT";
const CHANNEL_SET_VERSION = 2;

const ENUM_REGISTRY_VERSION =
  Number.isInteger(WORLD_KERNEL?.enums?.version)
    ? WORLD_KERNEL.enums.version
    : 1;

const WORLD_CONTRACT_VERSION =
  Number.isInteger(WORLD_KERNEL?.constants?.contractVersion)
    ? WORLD_KERNEL.constants.contractVersion
    : 1;

export const STATE_HASH_CHANNEL_SET_V2 = Object.freeze([
  "stateBuffer.stateCode",
  "stateBuffer.stateAge",
  "tickIndex",
  "enumRegistryVersion",
  "worldContractVersion",
  "numericModeCode",
  "activeRuleFamilies.sortedCodes",
  "transitionCounts.fixedOrder",
  "blockedTransitionCount",
  "admissibleCount"
]);

const NUMERIC_MODE_CODES = Object.freeze({
  A_INT32_BIGINT: 1
});

const RULE_FAMILY_CODES = Object.freeze({
  FREEZE_MELT: 1,
  WATER_RETENTION_SPREAD: 2,
  WETTING_DRYING: 3,
  COASTLINE_EROSION: 4,
  TECTONIC_MEMORY: 5,
  HABITABILITY_ATTENUATION: 6,
  CONTINENT_TIER: 7
});

const REQUIRED_RECEIPT_KEYS = Object.freeze([
  "RUN_ID",
  "SEED",
  "SCALE_FACTOR",
  "PROJECTION",
  "TICK",
  "STATE_HASH",
  "PREV_HASH",
  "ENUM_REGISTRY_VERSION",
  "WORLD_CONTRACT_VERSION",
  "NUMERIC_MODE",
  "CHANNEL_SET_VERSION",
  "CHANNEL_SET",
  "ACTIVE_RULE_FAMILIES",
  "TRANSITION_COUNTS",
  "BLOCKED_TRANSITION_COUNT",
  "ADMISSIBLE_COUNT",
  "MIN_STATE",
  "MAX_STATE",
  "FAIL_FLAGS",
  "PERFORMANCE"
]);

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireInt32(value, fieldName) {
  if (!Number.isInteger(value)) {
    throw new Error(`RECEIPT_INVALID_INT32:${fieldName}`);
  }
  if (value < -2147483648 || value > 2147483647) {
    throw new Error(`RECEIPT_INT32_OUT_OF_RANGE:${fieldName}`);
  }
  return value;
}

function normalizeInt32(value, fallback, fieldName) {
  if (value === undefined || value === null) {
    return requireInt32(fallback, `${fieldName}:fallback`);
  }
  return requireInt32(value, fieldName);
}

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`RECEIPT_INVALID_STRING:${fieldName}`);
  }
  return value;
}

function getNumericModeCode(mode) {
  const code = NUMERIC_MODE_CODES[mode];
  if (!Number.isInteger(code)) {
    throw new Error(`NUMERIC_MODE_INVALID:${String(mode)}`);
  }
  return code;
}

function getRuleFamilyCode(ruleFamily) {
  const code = RULE_FAMILY_CODES[ruleFamily];
  if (!Number.isInteger(code)) {
    throw new Error(`RULE_FAMILY_INVALID:${String(ruleFamily)}`);
  }
  return code;
}

function normalizeActiveRuleFamilies(activeRuleFamilies) {
  if (!Array.isArray(activeRuleFamilies)) {
    throw new Error("RECEIPT_INVALID_ACTIVE_RULE_FAMILIES");
  }

  const codes = activeRuleFamilies.map((family, index) => {
    if (typeof family !== "string") {
      throw new Error(`RECEIPT_INVALID_RULE_FAMILY:${index}`);
    }
    return getRuleFamilyCode(family);
  });

  codes.sort((a, b) => a - b);
  return Object.freeze(codes);
}

function normalizeTransitionCounts(transitionCounts) {
  if (!isPlainObject(transitionCounts)) {
    throw new Error("RECEIPT_INVALID_TRANSITION_COUNTS");
  }

  return Object.freeze({
    FREEZE_MELT: normalizeInt32(
      transitionCounts.FREEZE_MELT,
      0,
      "transitionCounts.FREEZE_MELT"
    ),
    WATER_RETENTION_SPREAD: normalizeInt32(
      transitionCounts.WATER_RETENTION_SPREAD,
      0,
      "transitionCounts.WATER_RETENTION_SPREAD"
    ),
    WETTING_DRYING: normalizeInt32(
      transitionCounts.WETTING_DRYING,
      0,
      "transitionCounts.WETTING_DRYING"
    ),
    COASTLINE_EROSION: normalizeInt32(
      transitionCounts.COASTLINE_EROSION,
      0,
      "transitionCounts.COASTLINE_EROSION"
    ),
    TECTONIC_MEMORY: normalizeInt32(
      transitionCounts.TECTONIC_MEMORY,
      0,
      "transitionCounts.TECTONIC_MEMORY"
    ),
    HABITABILITY_ATTENUATION: normalizeInt32(
      transitionCounts.HABITABILITY_ATTENUATION,
      0,
      "transitionCounts.HABITABILITY_ATTENUATION"
    ),
    CONTINENT_TIER: normalizeInt32(
      transitionCounts.CONTINENT_TIER,
      0,
      "transitionCounts.CONTINENT_TIER"
    )
  });
}

function validateStateBuffer(stateBuffer) {
  if (!Array.isArray(stateBuffer) || stateBuffer.length === 0) {
    throw new Error("STATE_BUFFER_INVALID:root");
  }

  const width = Array.isArray(stateBuffer[0]) ? stateBuffer[0].length : 0;
  if (width === 0) {
    throw new Error("STATE_BUFFER_INVALID:first_row");
  }

  for (let y = 0; y < stateBuffer.length; y += 1) {
    const row = stateBuffer[y];
    if (!Array.isArray(row) || row.length !== width) {
      throw new Error(`STATE_BUFFER_SHAPE_MISMATCH:row_${y}`);
    }

    for (let x = 0; x < row.length; x += 1) {
      const cell = row[x];
      if (!isPlainObject(cell)) {
        throw new Error(`STATE_BUFFER_CELL_INVALID:${x},${y}`);
      }

      requireInt32(cell.stateCode, `stateBuffer[${y}][${x}].stateCode`);
      requireInt32(cell.stateAge, `stateBuffer[${y}][${x}].stateAge`);
    }
  }

  return stateBuffer;
}

function summarizeStateExtrema(stateBuffer) {
  let minState = 2147483647;
  let maxState = -2147483648;

  for (let y = 0; y < stateBuffer.length; y += 1) {
    for (let x = 0; x < stateBuffer[y].length; x += 1) {
      const code = stateBuffer[y][x].stateCode;
      if (code < minState) minState = code;
      if (code > maxState) maxState = code;
    }
  }

  return Object.freeze({
    minState: minState === 2147483647 ? 0 : minState,
    maxState: maxState === -2147483648 ? 0 : maxState
  });
}

function pushInt32BytesLE(outBytes, value, fieldName) {
  const int32 = requireInt32(value, fieldName);
  const asUint32 = BigInt.asUintN(32, BigInt(int32));

  outBytes.push(Number(asUint32 & 0xffn));
  outBytes.push(Number((asUint32 >> 8n) & 0xffn));
  outBytes.push(Number((asUint32 >> 16n) & 0xffn));
  outBytes.push(Number((asUint32 >> 24n) & 0xffn));
}

function serializeCanonicalBytes({
  stateBuffer,
  tickIndex,
  enumRegistryVersion,
  worldContractVersion,
  numericMode,
  activeRuleFamilies,
  transitionCounts,
  blockedTransitionCount,
  admissibleCount
}) {
  validateStateBuffer(stateBuffer);

  const numericModeCode = getNumericModeCode(numericMode);
  const activeRuleFamilyCodes = normalizeActiveRuleFamilies(activeRuleFamilies);
  const normalizedTransitionCounts = normalizeTransitionCounts(transitionCounts);

  const bytes = [];

  for (let y = 0; y < stateBuffer.length; y += 1) {
    for (let x = 0; x < stateBuffer[y].length; x += 1) {
      const cell = stateBuffer[y][x];
      pushInt32BytesLE(bytes, cell.stateCode, `stateBuffer[${y}][${x}].stateCode`);
      pushInt32BytesLE(bytes, cell.stateAge, `stateBuffer[${y}][${x}].stateAge`);
    }
  }

  pushInt32BytesLE(bytes, tickIndex, "tickIndex");
  pushInt32BytesLE(bytes, enumRegistryVersion, "enumRegistryVersion");
  pushInt32BytesLE(bytes, worldContractVersion, "worldContractVersion");
  pushInt32BytesLE(bytes, numericModeCode, "numericModeCode");

  pushInt32BytesLE(bytes, activeRuleFamilyCodes.length, "activeRuleFamilies.length");
  for (let i = 0; i < activeRuleFamilyCodes.length; i += 1) {
    pushInt32BytesLE(bytes, activeRuleFamilyCodes[i], `activeRuleFamilies[${i}]`);
  }

  pushInt32BytesLE(bytes, normalizedTransitionCounts.FREEZE_MELT, "transitionCounts.FREEZE_MELT");
  pushInt32BytesLE(bytes, normalizedTransitionCounts.WATER_RETENTION_SPREAD, "transitionCounts.WATER_RETENTION_SPREAD");
  pushInt32BytesLE(bytes, normalizedTransitionCounts.WETTING_DRYING, "transitionCounts.WETTING_DRYING");
  pushInt32BytesLE(bytes, normalizedTransitionCounts.COASTLINE_EROSION, "transitionCounts.COASTLINE_EROSION");
  pushInt32BytesLE(bytes, normalizedTransitionCounts.TECTONIC_MEMORY, "transitionCounts.TECTONIC_MEMORY");
  pushInt32BytesLE(bytes, normalizedTransitionCounts.HABITABILITY_ATTENUATION, "transitionCounts.HABITABILITY_ATTENUATION");
  pushInt32BytesLE(bytes, normalizedTransitionCounts.CONTINENT_TIER, "transitionCounts.CONTINENT_TIER");

  pushInt32BytesLE(bytes, blockedTransitionCount, "blockedTransitionCount");
  pushInt32BytesLE(bytes, admissibleCount, "admissibleCount");

  return Object.freeze(bytes);
}

function fnv1a64FromBytes(bytes) {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const modMask = 0xffffffffffffffffn;

  for (let i = 0; i < bytes.length; i += 1) {
    const byte = bytes[i];
    if (!Number.isInteger(byte) || byte < 0 || byte > 255) {
      throw new Error(`HASH_BYTE_INVALID:${i}`);
    }

    hash ^= BigInt(byte);
    hash = (hash * prime) & modMask;
  }

  return hash.toString(16).padStart(16, "0");
}

function validateReceiptShape(receipt, indexLabel = "receipt") {
  if (!isPlainObject(receipt)) {
    throw new Error(`RECEIPT_SHAPE_INVALID:${indexLabel}`);
  }

  for (let i = 0; i < REQUIRED_RECEIPT_KEYS.length; i += 1) {
    const key = REQUIRED_RECEIPT_KEYS[i];
    if (!(key in receipt)) {
      throw new Error(`RECEIPT_MISSING_KEY:${indexLabel}:${key}`);
    }
  }

  requireString(receipt.RUN_ID, `${indexLabel}.RUN_ID`);
  requireInt32(receipt.SEED, `${indexLabel}.SEED`);
  requireInt32(receipt.SCALE_FACTOR, `${indexLabel}.SCALE_FACTOR`);
  requireString(receipt.PROJECTION, `${indexLabel}.PROJECTION`);
  requireInt32(receipt.TICK, `${indexLabel}.TICK`);
  requireString(receipt.STATE_HASH, `${indexLabel}.STATE_HASH`);
  requireString(receipt.PREV_HASH, `${indexLabel}.PREV_HASH`);
  requireInt32(receipt.ENUM_REGISTRY_VERSION, `${indexLabel}.ENUM_REGISTRY_VERSION`);
  requireInt32(receipt.WORLD_CONTRACT_VERSION, `${indexLabel}.WORLD_CONTRACT_VERSION`);
  requireString(receipt.NUMERIC_MODE, `${indexLabel}.NUMERIC_MODE`);
  requireInt32(receipt.CHANNEL_SET_VERSION, `${indexLabel}.CHANNEL_SET_VERSION`);

  if (!Array.isArray(receipt.CHANNEL_SET)) {
    throw new Error(`RECEIPT_INVALID_CHANNEL_SET:${indexLabel}`);
  }

  if (!Array.isArray(receipt.ACTIVE_RULE_FAMILIES)) {
    throw new Error(`RECEIPT_INVALID_ACTIVE_RULE_FAMILIES:${indexLabel}`);
  }

  normalizeTransitionCounts(receipt.TRANSITION_COUNTS);
  requireInt32(receipt.BLOCKED_TRANSITION_COUNT, `${indexLabel}.BLOCKED_TRANSITION_COUNT`);
  requireInt32(receipt.ADMISSIBLE_COUNT, `${indexLabel}.ADMISSIBLE_COUNT`);
  requireInt32(receipt.MIN_STATE, `${indexLabel}.MIN_STATE`);
  requireInt32(receipt.MAX_STATE, `${indexLabel}.MAX_STATE`);

  if (!Array.isArray(receipt.FAIL_FLAGS)) {
    throw new Error(`RECEIPT_INVALID_FAIL_FLAGS:${indexLabel}`);
  }

  if (!isPlainObject(receipt.PERFORMANCE)) {
    throw new Error(`RECEIPT_INVALID_PERFORMANCE:${indexLabel}`);
  }

  if (!isFiniteNumber(receipt.PERFORMANCE.tickMs) || receipt.PERFORMANCE.tickMs < 0) {
    throw new Error(`RECEIPT_INVALID_PERFORMANCE_TICK_MS:${indexLabel}`);
  }

  if (!isFiniteNumber(receipt.PERFORMANCE.frameMs) || receipt.PERFORMANCE.frameMs < 0) {
    throw new Error(`RECEIPT_INVALID_PERFORMANCE_FRAME_MS:${indexLabel}`);
  }

  return receipt;
}

export function createAuthorityReceiptEngine() {
  function computeStateHash({
    stateBuffer,
    tickIndex = 0,
    enumRegistryVersion = ENUM_REGISTRY_VERSION,
    worldContractVersion = WORLD_CONTRACT_VERSION,
    numericMode = NUMERIC_MODE,
    activeRuleFamilies = [],
    transitionCounts = {},
    blockedTransitionCount = 0,
    admissibleCount = 0
  }) {
    const bytes = serializeCanonicalBytes({
      stateBuffer,
      tickIndex: normalizeInt32(tickIndex, 0, "tickIndex"),
      enumRegistryVersion: normalizeInt32(
        enumRegistryVersion,
        ENUM_REGISTRY_VERSION,
        "enumRegistryVersion"
      ),
      worldContractVersion: normalizeInt32(
        worldContractVersion,
        WORLD_CONTRACT_VERSION,
        "worldContractVersion"
      ),
      numericMode,
      activeRuleFamilies,
      transitionCounts,
      blockedTransitionCount: normalizeInt32(
        blockedTransitionCount,
        0,
        "blockedTransitionCount"
      ),
      admissibleCount: normalizeInt32(admissibleCount, 0, "admissibleCount")
    });

    return fnv1a64FromBytes(bytes);
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
    validateStateBuffer(stateBuffer);

    const normalizedTransitionCounts = normalizeTransitionCounts(
      isPlainObject(transitionSummary.transitionCounts)
        ? transitionSummary.transitionCounts
        : {}
    );

    const activeRuleFamilies = Array.isArray(transitionSummary.activeRuleFamilies)
      ? Object.freeze([...transitionSummary.activeRuleFamilies])
      : Object.freeze([]);

    const blockedTransitionCount = normalizeInt32(
      transitionSummary.blockedTransitionCount,
      0,
      "transitionSummary.blockedTransitionCount"
    );

    const admissibleCount = normalizeInt32(
      transitionSummary.admissibleCount,
      0,
      "transitionSummary.admissibleCount"
    );

    const stateHash = computeStateHash({
      stateBuffer,
      tickIndex,
      enumRegistryVersion: ENUM_REGISTRY_VERSION,
      worldContractVersion: WORLD_CONTRACT_VERSION,
      numericMode: NUMERIC_MODE,
      activeRuleFamilies,
      transitionCounts: normalizedTransitionCounts,
      blockedTransitionCount,
      admissibleCount
    });

    const extrema = summarizeStateExtrema(stateBuffer);

    const receipt = Object.freeze({
      RUN_ID: `${normalizeInt32(seed, 0, "seed")}_${normalizeInt32(scale, 1, "scale")}_${requireString(projection, "projection")}`,
      SEED: normalizeInt32(seed, 0, "seed"),
      SCALE_FACTOR: normalizeInt32(scale, 1, "scale"),
      PROJECTION: requireString(projection, "projection"),

      TICK: normalizeInt32(tickIndex, 0, "tickIndex"),

      STATE_HASH: stateHash,
      PREV_HASH: requireString(String(prevHash), "prevHash"),

      ENUM_REGISTRY_VERSION: ENUM_REGISTRY_VERSION,
      WORLD_CONTRACT_VERSION: WORLD_CONTRACT_VERSION,
      NUMERIC_MODE: NUMERIC_MODE,

      CHANNEL_SET_VERSION: CHANNEL_SET_VERSION,
      CHANNEL_SET: STATE_HASH_CHANNEL_SET_V2,

      ACTIVE_RULE_FAMILIES: activeRuleFamilies,
      TRANSITION_COUNTS: normalizedTransitionCounts,
      BLOCKED_TRANSITION_COUNT: blockedTransitionCount,
      ADMISSIBLE_COUNT: admissibleCount,

      MIN_STATE: normalizeInt32(metrics.minState, extrema.minState, "metrics.minState"),
      MAX_STATE: normalizeInt32(metrics.maxState, extrema.maxState, "metrics.maxState"),

      FAIL_FLAGS: Object.freeze(Array.isArray(metrics.failFlags) ? [...metrics.failFlags] : []),

      PERFORMANCE: Object.freeze({
        tickMs: isFiniteNumber(metrics.tickMs) ? metrics.tickMs : 0,
        frameMs: isFiniteNumber(metrics.frameMs) ? metrics.frameMs : 0
      })
    });

    validateReceiptShape(receipt, "buildReceipt.output");
    return receipt;
  }

  return Object.freeze({
    computeStateHash,
    buildReceipt,
    validateReceiptShape
  });
}

export function createAuthorityReplayVerifier() {
  function verifySingleRunChain(receipts, runLabel) {
    if (!Array.isArray(receipts)) {
      return Object.freeze({
        pass: false,
        reason: "INVALID_INPUT",
        run: runLabel
      });
    }

    for (let i = 0; i < receipts.length; i += 1) {
      const receipt = validateReceiptShape(receipts[i], `${runLabel}[${i}]`);

      if (receipt.ENUM_REGISTRY_VERSION !== ENUM_REGISTRY_VERSION) {
        return Object.freeze({
          pass: false,
          reason: "ENUM_VERSION_MISMATCH",
          run: runLabel,
          tick: i
        });
      }

      if (receipt.WORLD_CONTRACT_VERSION !== WORLD_CONTRACT_VERSION) {
        return Object.freeze({
          pass: false,
          reason: "WORLD_CONTRACT_VERSION_MISMATCH",
          run: runLabel,
          tick: i
        });
      }

      if (receipt.NUMERIC_MODE !== NUMERIC_MODE) {
        return Object.freeze({
          pass: false,
          reason: "NUMERIC_MODE_MISMATCH",
          run: runLabel,
          tick: i
        });
      }

      if (receipt.CHANNEL_SET_VERSION !== CHANNEL_SET_VERSION) {
        return Object.freeze({
          pass: false,
          reason: "CHANNEL_SET_VERSION_MISMATCH",
          run: runLabel,
          tick: i
        });
      }

      const receiptChannelSet = receipt.CHANNEL_SET.join("|");
      const canonicalChannelSet = STATE_HASH_CHANNEL_SET_V2.join("|");

      if (receiptChannelSet !== canonicalChannelSet) {
        return Object.freeze({
          pass: false,
          reason: "CHANNEL_SET_MISMATCH",
          run: runLabel,
          tick: i
        });
      }

      if (i === 0) {
        if (receipt.PREV_HASH !== "0") {
          return Object.freeze({
            pass: false,
            reason: "CHAIN_ROOT_INVALID",
            run: runLabel,
            tick: i
          });
        }
      } else {
        const prior = receipts[i - 1];
        if (receipt.PREV_HASH !== prior.STATE_HASH) {
          return Object.freeze({
            pass: false,
            reason: "CHAIN_BREAK",
            run: runLabel,
            tick: i,
            expectedPrevHash: prior.STATE_HASH,
            actualPrevHash: receipt.PREV_HASH
          });
        }
      }
    }

    return Object.freeze({ pass: true });
  }

  function verifyRun(receiptsA, receiptsB) {
    const chainA = verifySingleRunChain(receiptsA, "runA");
    if (!chainA.pass) return chainA;

    const chainB = verifySingleRunChain(receiptsB, "runB");
    if (!chainB.pass) return chainB;

    if (!Array.isArray(receiptsA) || !Array.isArray(receiptsB)) {
      return Object.freeze({ pass: false, reason: "INVALID_INPUT" });
    }

    if (receiptsA.length !== receiptsB.length) {
      return Object.freeze({
        pass: false,
        reason: "LENGTH_MISMATCH",
        totalTicksA: receiptsA.length,
        totalTicksB: receiptsB.length
      });
    }

    for (let i = 0; i < receiptsA.length; i += 1) {
      const a = receiptsA[i];
      const b = receiptsB[i];

      if (a.STATE_HASH !== b.STATE_HASH) {
        return Object.freeze({
          pass: false,
          reason: "HASH_MISMATCH",
          tick: i,
          expectedHash: a.STATE_HASH,
          actualHash: b.STATE_HASH,
          totalTicks: receiptsA.length
        });
      }

      if (a.PREV_HASH !== b.PREV_HASH) {
        return Object.freeze({
          pass: false,
          reason: "PREV_HASH_MISMATCH",
          tick: i,
          expectedPrevHash: a.PREV_HASH,
          actualPrevHash: b.PREV_HASH,
          totalTicks: receiptsA.length
        });
      }
    }

    return Object.freeze({
      pass: true,
      failureTick: null,
      failureType: null,
      expectedHash: receiptsA.length ? receiptsA[receiptsA.length - 1].STATE_HASH : "",
      actualHash: receiptsB.length ? receiptsB[receiptsB.length - 1].STATE_HASH : "",
      totalTicks: receiptsA.length
    });
  }

  return Object.freeze({
    verifyRun,
    verifySingleRunChain
  });
}
