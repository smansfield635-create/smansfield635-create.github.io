import {
  STATE_INDEX_DEPTH_V1,
  BUFFER_CLASS_65536_V1,
  ALLOWED_ENGINE_IDS_V1,
  FAULT_CLASS_LADDER_V1,
  ENGINE_DEPENDENCY_MATRIX_V1,
  COMPLETENESS_THRESHOLDS_V1,
  isValidLobeId,
  RECEIPT_LAW_SPEC_V1
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

function computeFaultClass(reason) {
  switch (reason) {
    case "invalid_packet_shape":
    case "missing_required_field":
    case "invalid_engine_id":
    case "invalid_lobe_id":
    case "invalid_state_index_depth":
    case "invalid_buffer_class":
    case "invalid_hash":
    case "invalid_stale_flag":
    case "invalid_dependencies_shape":
    case "invalid_completeness":
      return FAULT_CLASS_LADDER_V1.CLASS_A;

    case "stale_packet":
    case "dependency_missing":
    case "dependency_not_ready":
      return FAULT_CLASS_LADDER_V1.CLASS_B;

    case "completeness_below_threshold":
      return FAULT_CLASS_LADDER_V1.CLASS_C;

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
  return true;
}

function validateRequiredFields(packet) {
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

function validateEngineIdentity(packet) {
  const engineId = normalizeString(packet.engineId);
  if (!ALLOWED_ENGINE_IDS_V1.includes(engineId)) {
    return makeReceipt({
      admissible: false,
      signedAuthority: false,
      engineId,
      lobeId: packet.lobeId ?? null,
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
      faultClass: computeFaultClass("invalid_lobe_id"),
      reason: "invalid_lobe_id",
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
        faultClass: computeFaultClass("dependency_missing"),
        reason: "dependency_missing",
        packetHash: normalizeString(packet.hash),
        details: { dependency: dep, source: "packet.dependencies" }
      });
    }

    const depReceipt = resolvedReceipts[dep];
    if (!isPlainObject(depReceipt) || depReceipt.signedAuthority !== true) {
      return makeReceipt({
        admissible: false,
        signedAuthority: false,
        engineId,
        lobeId: packet.lobeId ?? null,
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

    const packet = normalizeObject(packetInput);
    if (!isPlainObject(packetInput)) {
      return makeReceipt({
        admissible: false,
        signedAuthority: false,
        faultClass: computeFaultClass("invalid_packet_shape"),
        reason: "invalid_packet_shape"
      });
    }

    return (
      validateRequiredFields(packet) ||
      validateEngineIdentity(packet) ||
      validateLobe(packet) ||
      validateStateIndex(packet) ||
      validateBufferClass(packet) ||
      validateIntegrityAndHash(packet) ||
      validateStaleFlag(packet) ||
      validateDependencies(packet, dependencyReceipts) ||
      validateCompleteness(packet) ||
      makeReceipt({
        admissible: true,
        signedAuthority: true,
        engineId: normalizeString(packet.engineId),
        lobeId: packet.lobeId,
        faultClass: "",
        reason: "",
        packetHash: normalizeString(packet.hash),
        details: {
          stateIndexDepth: packet.stateIndexDepth,
          bufferClass: packet.bufferClass,
          completeness: packet.completeness
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
