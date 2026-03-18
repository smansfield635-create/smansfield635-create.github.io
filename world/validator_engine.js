import {
  STATE_INDEX_DEPTH_V1,
  BUFFER_CLASS_65536_V1,
  ALLOWED_ENGINE_IDS_V1,
  FAULT_CLASS_LADDER_V1,
  ENGINE_DEPENDENCY_MATRIX_V1,
  COMPLETENESS_THRESHOLDS_V1,
  isValidLobeId,
  RECEIPT_LAW_SPEC_V1,
  LOCAL_SHARD_CONSTANT_V1,
  MAX_SHARD_DEPTH_V1,
  OBSERVE_MODE_SHARD_POLICY_V1,
  BUDGET_SIGNAL_LADDER_V1,
  isValidMicroLobeAddress,
  MICRO_LOBE_RECEIPT_V1
} from "./world_kernel.js";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return isPlainObject(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

function isValidBudgetClass(value) {
  return (
    value === "NOMINAL" ||
    value === "STRESS" ||
    value === "CRITICAL" ||
    value === "EMERGENCY"
  );
}

function isMicroLobePacket(packet) {
  return (
    hasOwn(packet, "parentLobeId") ||
    hasOwn(packet, "microLobeId") ||
    hasOwn(packet, "shardDepth") ||
    hasOwn(packet, "budgetClass")
  );
}

function computeFaultClass(reason) {
  switch (reason) {
    case "invalid_packet_shape":
    case "missing_required_field":
    case "missing_micro_lobe_field":
    case "invalid_engine_id":
    case "invalid_lobe_id":
    case "invalid_micro_lobe_address":
    case "invalid_parent_lobe_id":
    case "invalid_micro_lobe_id":
    case "invalid_shard_depth":
    case "invalid_state_index_depth":
    case "invalid_buffer_class":
    case "invalid_hash":
    case "invalid_stale_flag":
    case "invalid_dependencies_shape":
    case "invalid_completeness":
    case "invalid_budget_class":
    case "invalid_budget_ladder":
      return FAULT_CLASS_LADDER_V1.CLASS_A;

    case "stale_packet":
    case "dependency_missing":
    case "dependency_not_ready":
      return FAULT_CLASS_LADDER_V1.CLASS_B;

    case "completeness_below_threshold":
    case "budget_stress":
    case "budget_critical":
      return FAULT_CLASS_LADDER_V1.CLASS_C;

    case "budget_emergency":
    case "law_surface_invalid":
    default:
      return FAULT_CLASS_LADDER_V1.CLASS_D;
  }
}

function makeReceipt({
  admissible,
  signedAuthority,
  engineId = "",
  lobeId = null,
  parentLobeId = null,
  microLobeId = null,
  shardDepth = null,
  budgetClass = "",
  precisionMode = "",
  localShardConstant = LOCAL_SHARD_CONSTANT_V1,
  faultClass,
  reason,
  packetHash = "",
  details = {}
}) {
  return Object.freeze({
    verdict: admissible ? "ADMISSIBLE" : "INADMISSIBLE",
    admissible,
    signedAuthority,
    engineId,
    lobeId,
    parentLobeId,
    microLobeId,
    shardDepth,
    budgetClass,
    precisionMode,
    localShardConstant,
    faultClass,
    reason,
    packetHash,
    details: Object.freeze({ ...details })
  });
}

function validateLawSurface() {
  if (!Number.isInteger(STATE_INDEX_DEPTH_V1) || STATE_INDEX_DEPTH_V1 <= 0) return false;
  if (!Number.isInteger(BUFFER_CLASS_65536_V1) || BUFFER_CLASS_65536_V1 <= 0) return false;
  if (!Array.isArray(ALLOWED_ENGINE_IDS_V1) || ALLOWED_ENGINE_IDS_V1.length === 0) return false;
  if (!isPlainObject(FAULT_CLASS_LADDER_V1)) return false;
  if (!isPlainObject(ENGINE_DEPENDENCY_MATRIX_V1)) return false;
  if (!isPlainObject(COMPLETENESS_THRESHOLDS_V1)) return false;
  if (typeof isValidLobeId !== "function") return false;
  if (!isPlainObject(RECEIPT_LAW_SPEC_V1)) return false;
  if (!Array.isArray(RECEIPT_LAW_SPEC_V1.REQUIRED_FIELDS)) return false;

  if (!Number.isInteger(LOCAL_SHARD_CONSTANT_V1) || LOCAL_SHARD_CONSTANT_V1 <= 0) return false;
  if (!Number.isInteger(MAX_SHARD_DEPTH_V1) || MAX_SHARD_DEPTH_V1 < 0) return false;
  if (!isPlainObject(OBSERVE_MODE_SHARD_POLICY_V1)) return false;
  if (!isPlainObject(BUDGET_SIGNAL_LADDER_V1)) return false;
  if (typeof isValidMicroLobeAddress !== "function") return false;
  if (!isPlainObject(MICRO_LOBE_RECEIPT_V1)) return false;
  if (!Array.isArray(MICRO_LOBE_RECEIPT_V1.REQUIRED)) return false;

  return true;
}

function validateRootRequiredFields(packet) {
  const required = RECEIPT_LAW_SPEC_V1.REQUIRED_FIELDS;
  for (let i = 0; i < required.length; i += 1) {
    if (!hasOwn(packet, required[i])) {
      return makeReceipt({
        admissible: false,
        signedAuthority: false,
        faultClass: computeFaultClass("missing_required_field"),
        reason: "missing_required_field",
        details: { field: required[i] }
      });
    }
  }
  return null;
}

function validateMicroLobeRequiredFields(packet) {
  if (!isMicroLobePacket(packet)) return null;

  const required = MICRO_LOBE_RECEIPT_V1.REQUIRED;
  for (let i = 0; i < required.length; i += 1) {
    if (!hasOwn(packet, required[i])) {
      return makeReceipt({
        admissible: false,
        signedAuthority: false,
        engineId: normalizeString(packet.engineId),
        lobeId: packet.lobeId ?? null,
        faultClass: computeFaultClass("missing_micro_lobe_field"),
        reason: "missing_micro_lobe_field",
        packetHash: normalizeString(packet.hash),
        details: { field: required[i] }
      });
    }
  }
  return null;
}

function validateEngineIdentity(packet) {
  const engineId = normalizeString(packet.engineId);
  if (!ALLOWED_ENGINE_IDS_V1.includes(engineId)) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId,
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_engine_id"),
      reason: "invalid_engine_id",
      packetHash: normalizeString(packet.hash)
    });
  }
  return null;
}

function validateLobe(packet) {
  if (!isValidLobeId(packet.lobeId)) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_lobe_id"),
      reason: "invalid_lobe_id",
      packetHash: normalizeString(packet.hash)
    });
  }
  return null;
}

function validateMicroLobeAddressLaw(packet) {
  if (!isMicroLobePacket(packet)) return null;

  if (!isFiniteNumber(packet.parentLobeId)) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_parent_lobe_id"),
      reason: "invalid_parent_lobe_id",
      packetHash: normalizeString(packet.hash)
    });
  }

  if (!isFiniteNumber(packet.microLobeId)) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_micro_lobe_id"),
      reason: "invalid_micro_lobe_id",
      packetHash: normalizeString(packet.hash)
    });
  }

  if (!Number.isInteger(packet.shardDepth) || packet.shardDepth < 0 || packet.shardDepth > MAX_SHARD_DEPTH_V1) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_shard_depth"),
      reason: "invalid_shard_depth",
      packetHash: normalizeString(packet.hash),
      details: {
        maxDepth: MAX_SHARD_DEPTH_V1,
        actual: packet.shardDepth
      }
    });
  }

  const admissible = isValidMicroLobeAddress({
    parentId: packet.parentLobeId,
    childId: packet.microLobeId,
    depth: packet.shardDepth
  });

  if (!admissible) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_micro_lobe_address"),
      reason: "invalid_micro_lobe_address",
      packetHash: normalizeString(packet.hash)
    });
  }

  return null;
}

function validateStateIndex(packet) {
  if (packet.stateIndexDepth !== STATE_INDEX_DEPTH_V1) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_state_index_depth"),
      reason: "invalid_state_index_depth",
      packetHash: normalizeString(packet.hash),
      details: {
        expected: STATE_INDEX_DEPTH_V1,
        actual: packet.stateIndexDepth
      }
    });
  }
  return null;
}

function validateBufferClass(packet) {
  if (packet.bufferClass !== BUFFER_CLASS_65536_V1) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_buffer_class"),
      reason: "invalid_buffer_class",
      packetHash: normalizeString(packet.hash),
      details: {
        expected: BUFFER_CLASS_65536_V1,
        actual: packet.bufferClass
      }
    });
  }
  return null;
}

function validateIntegrityAndHash(packet) {
  const hash = normalizeString(packet.hash);
  if (!hash) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_hash"),
      reason: "invalid_hash",
      packetHash: hash
    });
  }
  return null;
}

function validateStaleFlag(packet) {
  if (typeof packet.stale !== "boolean") {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_stale_flag"),
      reason: "invalid_stale_flag",
      packetHash: normalizeString(packet.hash)
    });
  }

  if (RECEIPT_LAW_SPEC_V1.STALE_FORBIDDEN === true && packet.stale === true) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("stale_packet"),
      reason: "stale_packet",
      packetHash: normalizeString(packet.hash)
    });
  }

  return null;
}

function validateDependencies(packet, dependencyReceipts) {
  const engineId = normalizeString(packet.engineId);
  const requiredDeps = normalizeArray(ENGINE_DEPENDENCY_MATRIX_V1[engineId]);
  const declaredDeps = normalizeObject(packet.dependencies);
  const resolvedReceipts = normalizeObject(dependencyReceipts);

  for (let i = 0; i < requiredDeps.length; i += 1) {
    const dep = requiredDeps[i];

    if (!hasOwn(declaredDeps, dep)) {
      return makeReceipt({
        admissible: false,
        signedAuthority: false,
        engineId,
        lobeId: packet.lobeId ?? null,
        parentLobeId: packet.parentLobeId ?? null,
        microLobeId: packet.microLobeId ?? null,
        shardDepth: packet.shardDepth ?? null,
        budgetClass: normalizeString(packet.budgetClass),
        faultClass: computeFaultClass("dependency_missing"),
        reason: "dependency_missing",
        packetHash: normalizeString(packet.hash),
        details: {
          dependency: dep,
          source: "packet.dependencies"
        }
      });
    }

    const depReceipt = resolvedReceipts[dep];
    if (!isPlainObject(depReceipt) || depReceipt.signedAuthority !== true) {
      return makeReceipt({
        admissible: false,
        signedAuthority: false,
        engineId,
        lobeId: packet.lobeId ?? null,
        parentLobeId: packet.parentLobeId ?? null,
        microLobeId: packet.microLobeId ?? null,
        shardDepth: packet.shardDepth ?? null,
        budgetClass: normalizeString(packet.budgetClass),
        faultClass: computeFaultClass("dependency_not_ready"),
        reason: "dependency_not_ready",
        packetHash: normalizeString(packet.hash),
        details: { dependency: dep }
      });
    }
  }

  return null;
}

function validateCompleteness(packet) {
  const engineId = normalizeString(packet.engineId);
  const completeness = packet.completeness;
  const threshold = COMPLETENESS_THRESHOLDS_V1[engineId];

  if (!isFiniteNumber(completeness)) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId,
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_completeness"),
      reason: "invalid_completeness",
      packetHash: normalizeString(packet.hash)
    });
  }

  if (!isFiniteNumber(threshold)) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId,
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("law_surface_invalid"),
      reason: "law_surface_invalid",
      packetHash: normalizeString(packet.hash),
      details: { missingThresholdFor: engineId }
    });
  }

  if (completeness < threshold) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId,
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("completeness_below_threshold"),
      reason: "completeness_below_threshold",
      packetHash: normalizeString(packet.hash),
      details: {
        completeness,
        threshold
      }
    });
  }

  return null;
}

function validateBudgetLawSurface() {
  const ladder = normalizeObject(BUDGET_SIGNAL_LADDER_V1);
  const required = ["NOMINAL", "STRESS", "CRITICAL", "EMERGENCY"];

  for (let i = 0; i < required.length; i += 1) {
    const key = required[i];
    const entry = normalizeObject(ladder[key]);

    if (!isFiniteNumber(entry.validator_ms) || !isFiniteNumber(entry.frame_drop)) {
      return false;
    }

    if (!normalizeString(entry.action)) {
      return false;
    }
  }

  return true;
}

function validateBudgetClass(packet) {
  if (!isMicroLobePacket(packet)) return null;

  if (!isValidBudgetClass(packet.budgetClass)) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_budget_class"),
      reason: "invalid_budget_class",
      packetHash: normalizeString(packet.hash)
    });
  }

  if (!validateBudgetLawSurface()) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: normalizeString(packet.budgetClass),
      faultClass: computeFaultClass("invalid_budget_ladder"),
      reason: "invalid_budget_ladder",
      packetHash: normalizeString(packet.hash)
    });
  }

  if (packet.budgetClass === "STRESS") {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: packet.budgetClass,
      precisionMode: normalizeString(OBSERVE_MODE_SHARD_POLICY_V1.MANDATORY_PRECISION),
      localShardConstant: LOCAL_SHARD_CONSTANT_V1,
      faultClass: computeFaultClass("budget_stress"),
      reason: "budget_stress",
      packetHash: normalizeString(packet.hash),
      details: {
        action: normalizeString(BUDGET_SIGNAL_LADDER_V1.STRESS?.action)
      }
    });
  }

  if (packet.budgetClass === "CRITICAL") {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: packet.budgetClass,
      precisionMode: normalizeString(OBSERVE_MODE_SHARD_POLICY_V1.MANDATORY_PRECISION),
      localShardConstant: LOCAL_SHARD_CONSTANT_V1,
      faultClass: computeFaultClass("budget_critical"),
      reason: "budget_critical",
      packetHash: normalizeString(packet.hash),
      details: {
        action: normalizeString(BUDGET_SIGNAL_LADDER_V1.CRITICAL?.action)
      }
    });
  }

  if (packet.budgetClass === "EMERGENCY") {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId: normalizeString(packet.engineId),
      lobeId: packet.lobeId ?? null,
      parentLobeId: packet.parentLobeId ?? null,
      microLobeId: packet.microLobeId ?? null,
      shardDepth: packet.shardDepth ?? null,
      budgetClass: packet.budgetClass,
      precisionMode: normalizeString(OBSERVE_MODE_SHARD_POLICY_V1.MANDATORY_PRECISION),
      localShardConstant: LOCAL_SHARD_CONSTANT_V1,
      faultClass: computeFaultClass("budget_emergency"),
      reason: "budget_emergency",
      packetHash: normalizeString(packet.hash),
      details: {
        action: normalizeString(BUDGET_SIGNAL_LADDER_V1.EMERGENCY?.action)
      }
    });
  }

  return null;
}

export function createValidatorEngine() {
  function validate(packetInput, dependencyReceipts = {}) {
    if (!validateLawSurface()) {
      return makeReceipt({
        admissible: false,
        signedAuthority: false,
        faultClass: computeFaultClass("law_surface_invalid"),
        reason: "law_surface_invalid"
      });
    }

    if (!isPlainObject(packetInput)) {
      return makeReceipt({
        admissible: false,
        signedAuthority: false,
        faultClass: computeFaultClass("invalid_packet_shape"),
        reason: "invalid_packet_shape"
      });
    }

    const packet = normalizeObject(packetInput);

    return (
      validateRootRequiredFields(packet) ||
      validateMicroLobeRequiredFields(packet) ||
      validateEngineIdentity(packet) ||
      validateLobe(packet) ||
      validateMicroLobeAddressLaw(packet) ||
      validateStateIndex(packet) ||
      validateBufferClass(packet) ||
      validateIntegrityAndHash(packet) ||
      validateStaleFlag(packet) ||
      validateDependencies(packet, dependencyReceipts) ||
      validateCompleteness(packet) ||
      validateBudgetClass(packet) ||
      makeReceipt({
        admissible: true,
        signedAuthority: true,
        engineId: normalizeString(packet.engineId),
        lobeId: packet.lobeId,
        parentLobeId: hasOwn(packet, "parentLobeId") ? packet.parentLobeId : null,
        microLobeId: hasOwn(packet, "microLobeId") ? packet.microLobeId : null,
        shardDepth: hasOwn(packet, "shardDepth") ? packet.shardDepth : null,
        budgetClass: hasOwn(packet, "budgetClass") ? normalizeString(packet.budgetClass) : "NOMINAL",
        precisionMode: isMicroLobePacket(packet)
          ? normalizeString(OBSERVE_MODE_SHARD_POLICY_V1.MANDATORY_PRECISION)
          : "",
        localShardConstant: LOCAL_SHARD_CONSTANT_V1,
        faultClass: "",
        reason: "",
        packetHash: normalizeString(packet.hash),
        details: {
          stateIndexDepth: packet.stateIndexDepth,
          bufferClass: packet.bufferClass,
          completeness: packet.completeness,
          resolutionMultiplier: isMicroLobePacket(packet)
            ? OBSERVE_MODE_SHARD_POLICY_V1.RESOLUTION_MULTIPLIER
            : 1
        }
      })
    );
  }

  return Object.freeze({
    validate
  });
}

const DEFAULT_VALIDATOR_ENGINE = createValidatorEngine();

export function validateReceiptPacket(packetInput, dependencyReceipts = {}) {
  return DEFAULT_VALIDATOR_ENGINE.validate(packetInput, dependencyReceipts);
}
