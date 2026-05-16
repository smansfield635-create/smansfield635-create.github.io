// /assets/compounds/protocol_physical.address.js
// PROTOCOL_PHYSICAL_ADDRESS_ENGINE_TNT_v1
// Full-file replacement.
// Authority: address/context validation only.
// Owns: Ω=(A,L,S), C=(A,L), address indexing, context indexing, transition address classification.
// Does not own: protocol order, physical measurement, receipts, replay, console assembly, psychology, relation, or final closure.

const PROTOCOL_PHYSICAL_ADDRESS_META = Object.freeze({
  name: "protocol_physical.address",
  version: "G1",
  contract: "PROTOCOL_PHYSICAL_ADDRESS_ENGINE_TNT_v1",
  role: "bilateral_protocol_physical_address_engine",
  deterministic: true,
  mutatesState: false,
  sourceOfTruthFor: Object.freeze([
    "FULL_ADDRESS_SHAPE",
    "CONTEXT_SHAPE",
    "ADDRESS_INDEXING",
    "CONTEXT_INDEXING",
    "ADDRESS_TRANSITION_CLASSIFICATION"
  ]),
  doesNotOwn: Object.freeze([
    "PROTOCOL_ORDER",
    "PHYSICAL_MEASUREMENT",
    "RECEIPTS",
    "REPLAY",
    "CONSOLE_ASSEMBLY",
    "PSYCHOLOGY",
    "RELATION",
    "TERMINAL_CLOSURE"
  ])
});

const PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS = Object.freeze({
  ARCHETYPE_AXIS: "A",
  LIFE_STAGE_AXIS: "L",
  LOCAL_STATE_AXIS: "S",

  ARCHETYPE_DOMAIN: Object.freeze([0, 1, 2, 3]),
  LIFE_STAGE_DOMAIN: Object.freeze([0, 1, 2, 3]),

  MIN_ARCHETYPE: 0,
  MAX_ARCHETYPE: 3,
  MIN_LIFE_STAGE: 0,
  MAX_LIFE_STAGE: 3,
  MIN_LOCAL_STATE: 0,
  MAX_LOCAL_STATE: 255,

  CONTEXT_COUNT: 16,
  LOCAL_STATE_COUNT: 256,
  FULL_ADDRESS_COUNT: 4096,

  CONTEXT_FORMAT: "C=(A,L)",
  FULL_ADDRESS_FORMAT: "Ω=(A,L,S)",

  TRANSITION_CLASSES: Object.freeze([
    "INTRA_CONTEXT",
    "CROSS_STAGE",
    "CROSS_ARCHETYPE",
    "CROSS_CONTEXT"
  ]),

  MAP_REQUIREMENTS: Object.freeze({
    INTRA_CONTEXT: null,
    CROSS_STAGE: "STAGE_MAP_ID",
    CROSS_ARCHETYPE: "ARCHETYPE_MAP_ID",
    CROSS_CONTEXT: "FULL_CONTEXT_MAP_ID"
  }),

  RECEIPT_VERSION: "PROTOCOL_PHYSICAL_ADDRESS_VALIDATION_G1"
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return value;
}

function invariant(condition, message) {
  if (!condition) throw new Error(`[protocol_physical.address] ${message}`);
}

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function toInteger(value, label) {
  if (typeof value === "number" && Number.isInteger(value)) return value;

  if (typeof value === "string" && value.trim() !== "") {
    const trimmed = value.trim();
    invariant(/^-?\d+$/.test(trimmed), `${label} must be an integer`);
    return Number(trimmed);
  }

  invariant(false, `${label} must be an integer`);
}

function inRange(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max;
}

function normalizeAxisValue(value, axisName, min, max) {
  const next = toInteger(value, axisName);
  invariant(inRange(next, min, max), `${axisName} must be in range ${min}..${max}`);
  return next;
}

function normalizeA(value) {
  return normalizeAxisValue(
    value,
    "A",
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.MIN_ARCHETYPE,
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.MAX_ARCHETYPE
  );
}

function normalizeL(value) {
  return normalizeAxisValue(
    value,
    "L",
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.MIN_LIFE_STAGE,
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.MAX_LIFE_STAGE
  );
}

function normalizeS(value) {
  return normalizeAxisValue(
    value,
    "S",
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.MIN_LOCAL_STATE,
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.MAX_LOCAL_STATE
  );
}

function parseNumericTupleString(value, expectedLength, label) {
  invariant(isNonEmptyString(value), `${label} string is required`);

  const normalized = value
    .trim()
    .replace(/^Ω\s*=/i, "")
    .replace(/^C\s*=/i, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, "");

  const separator = normalized.includes(":") ? ":" : ",";
  const parts = normalized.split(separator);

  invariant(parts.length === expectedLength, `${label} must contain ${expectedLength} numeric parts`);

  return parts.map((part, index) => toInteger(part, `${label}[${index}]`));
}

function createContext(input) {
  let A;
  let L;

  if (Array.isArray(input)) {
    invariant(input.length === 2, "context array must be [A,L]");
    A = input[0];
    L = input[1];
  } else if (typeof input === "string") {
    const parts = parseNumericTupleString(input, 2, "context");
    A = parts[0];
    L = parts[1];
  } else if (isPlainObject(input)) {
    A = input.A ?? input.a ?? input.archetype ?? input.archetype_id;
    L = input.L ?? input.l ?? input.life_stage ?? input.stage ?? input.life_stage_id;
  } else {
    invariant(false, "context input must be object, array, or string");
  }

  const context = {
    A: normalizeA(A),
    L: normalizeL(L)
  };

  return deepFreeze({
    ...context,
    context: formatContext(context),
    context_key: contextKey(context),
    context_index: contextIndex(context),
    address_range: deepFreeze({
      start_index: contextIndex(context) * PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.LOCAL_STATE_COUNT,
      end_index:
        contextIndex(context) * PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.LOCAL_STATE_COUNT +
        PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.LOCAL_STATE_COUNT -
        1
    })
  });
}

function createAddress(input) {
  let A;
  let L;
  let S;

  if (Array.isArray(input)) {
    invariant(input.length === 3, "address array must be [A,L,S]");
    A = input[0];
    L = input[1];
    S = input[2];
  } else if (typeof input === "string") {
    const parts = parseNumericTupleString(input, 3, "address");
    A = parts[0];
    L = parts[1];
    S = parts[2];
  } else if (isPlainObject(input)) {
    A = input.A ?? input.a ?? input.archetype ?? input.archetype_id;
    L = input.L ?? input.l ?? input.life_stage ?? input.stage ?? input.life_stage_id;
    S = input.S ?? input.s ?? input.local_state ?? input.state ?? input.state_id;
  } else {
    invariant(false, "address input must be object, array, or string");
  }

  const address = {
    A: normalizeA(A),
    L: normalizeL(L),
    S: normalizeS(S)
  };

  const context = createContext({ A: address.A, L: address.L });

  return deepFreeze({
    ...address,
    context: context.context,
    context_key: context.context_key,
    context_index: context.context_index,
    address: formatAddress(address),
    address_key: addressKey(address),
    address_index: addressIndex(address),
    address_signature: addressSignature(address)
  });
}

function contextIndex(contextInput) {
  const context = {
    A: normalizeA(contextInput.A),
    L: normalizeL(contextInput.L)
  };

  return context.A * 4 + context.L;
}

function addressIndex(addressInput) {
  const address = {
    A: normalizeA(addressInput.A),
    L: normalizeL(addressInput.L),
    S: normalizeS(addressInput.S)
  };

  return (address.A * 4 + address.L) * PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.LOCAL_STATE_COUNT + address.S;
}

function contextFromIndex(indexInput) {
  const index = normalizeAxisValue(
    indexInput,
    "context_index",
    0,
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.CONTEXT_COUNT - 1
  );

  return createContext({
    A: Math.floor(index / 4),
    L: index % 4
  });
}

function addressFromIndex(indexInput) {
  const index = normalizeAxisValue(
    indexInput,
    "address_index",
    0,
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.FULL_ADDRESS_COUNT - 1
  );

  const contextIndexValue = Math.floor(index / PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.LOCAL_STATE_COUNT);
  const S = index % PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.LOCAL_STATE_COUNT;
  const context = contextFromIndex(contextIndexValue);

  return createAddress({
    A: context.A,
    L: context.L,
    S
  });
}

function formatContext(contextInput) {
  const A = normalizeA(contextInput.A);
  const L = normalizeL(contextInput.L);
  return `(${A},${L})`;
}

function formatAddress(addressInput) {
  const A = normalizeA(addressInput.A);
  const L = normalizeL(addressInput.L);
  const S = normalizeS(addressInput.S);
  return `(${A},${L},${S})`;
}

function contextKey(contextInput) {
  const A = normalizeA(contextInput.A);
  const L = normalizeL(contextInput.L);
  return `${A}:${L}`;
}

function addressKey(addressInput) {
  const A = normalizeA(addressInput.A);
  const L = normalizeL(addressInput.L);
  const S = normalizeS(addressInput.S);
  return `${A}:${L}:${S}`;
}

function addressSignature(addressInput) {
  return `ADDR_G1:${addressKey(addressInput)}:${addressIndex(addressInput)}`;
}

function sameContext(leftInput, rightInput) {
  const left = createContext(leftInput);
  const right = createContext(rightInput);
  return left.A === right.A && left.L === right.L;
}

function sameAddress(leftInput, rightInput) {
  const left = createAddress(leftInput);
  const right = createAddress(rightInput);
  return left.A === right.A && left.L === right.L && left.S === right.S;
}

function deriveContextFromAddress(addressInput) {
  const address = createAddress(addressInput);
  return createContext({
    A: address.A,
    L: address.L
  });
}

function classifyAddressTransition(fromInput, toInput) {
  const from = createAddress(fromInput);
  const to = createAddress(toInput);

  const archetypeChanged = from.A !== to.A;
  const stageChanged = from.L !== to.L;

  if (!archetypeChanged && !stageChanged) return "INTRA_CONTEXT";
  if (!archetypeChanged && stageChanged) return "CROSS_STAGE";
  if (archetypeChanged && !stageChanged) return "CROSS_ARCHETYPE";
  return "CROSS_CONTEXT";
}

function mapRequirementForTransitionClass(transitionClass) {
  invariant(
    PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.TRANSITION_CLASSES.includes(transitionClass),
    `invalid transition class: ${transitionClass}`
  );

  return PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.MAP_REQUIREMENTS[transitionClass];
}

function normalizeMapId(mapId) {
  if (mapId === null || mapId === undefined) return null;
  invariant(isNonEmptyString(mapId), "map_id must be a non-empty string when provided");
  return mapId.trim();
}

function createAddressTransition(input) {
  invariant(input && typeof input === "object", "transition input must be an object");

  const fromInput =
    input.address_from ??
    input.from_address ??
    input.from ??
    input.Ω_from ??
    input.omega_from;

  const toInput =
    input.address_to ??
    input.to_address ??
    input.to ??
    input.Ω_to ??
    input.omega_to;

  const from = createAddress(fromInput);
  const to = createAddress(toInput);
  const inferredClass = classifyAddressTransition(from, to);
  const declaredClass = input.transition_class ?? input.transitionClass ?? inferredClass;

  invariant(
    declaredClass === inferredClass,
    `transition_class mismatch: declared ${declaredClass}, inferred ${inferredClass}`
  );

  const requiredMapType = mapRequirementForTransitionClass(inferredClass);
  const mapId = normalizeMapId(input.map_id ?? input.mapId ?? null);

  if (requiredMapType) {
    invariant(
      isNonEmptyString(mapId),
      `${inferredClass} requires ${requiredMapType}`
    );
  }

  return deepFreeze({
    address_from: from.address,
    address_to: to.address,
    context_from: from.context,
    context_to: to.context,

    from,
    to,

    transition_class: inferredClass,
    map_requirement: requiredMapType,
    map_id: mapId,

    same_context: sameContext(from, to),
    same_address: sameAddress(from, to),

    transition_address_signature: transitionAddressSignature(from, to, inferredClass, mapId)
  });
}

function transitionAddressSignature(fromInput, toInput, transitionClassInput, mapIdInput = null) {
  const from = createAddress(fromInput);
  const to = createAddress(toInput);
  const inferredClass = classifyAddressTransition(from, to);
  const transitionClass = transitionClassInput ?? inferredClass;

  invariant(
    transitionClass === inferredClass,
    `transition signature class mismatch: ${transitionClass} != ${inferredClass}`
  );

  const mapId = normalizeMapId(mapIdInput);

  return [
    "ADDR_TRANSITION_G1",
    from.address_key,
    to.address_key,
    transitionClass,
    mapId || "NO_MAP_REQUIRED"
  ].join(":");
}

function validateContext(input) {
  try {
    const context = createContext(input);

    return deepFreeze({
      valid: true,
      context,
      errors: deepFreeze([])
    });
  } catch (error) {
    return deepFreeze({
      valid: false,
      context: null,
      errors: deepFreeze([String(error.message || error)])
    });
  }
}

function validateAddress(input) {
  try {
    const address = createAddress(input);

    return deepFreeze({
      valid: true,
      address,
      errors: deepFreeze([])
    });
  } catch (error) {
    return deepFreeze({
      valid: false,
      address: null,
      errors: deepFreeze([String(error.message || error)])
    });
  }
}

function validateAddressTransition(input) {
  try {
    const transition = createAddressTransition(input);

    return deepFreeze({
      valid: true,
      transition,
      errors: deepFreeze([])
    });
  } catch (error) {
    return deepFreeze({
      valid: false,
      transition: null,
      errors: deepFreeze([String(error.message || error)])
    });
  }
}

function validateTransitionChain(transitionsInput) {
  try {
    invariant(Array.isArray(transitionsInput), "transition chain must be an array");
    invariant(transitionsInput.length > 0, "transition chain must not be empty");

    const transitions = transitionsInput.map((transition) => createAddressTransition(transition));

    const continuityBreaks = [];

    for (let i = 0; i < transitions.length - 1; i += 1) {
      const current = transitions[i];
      const next = transitions[i + 1];

      if (!sameAddress(current.to, next.from)) {
        continuityBreaks.push({
          index: i,
          current_to: current.address_to,
          next_from: next.address_from
        });
      }
    }

    const valid = continuityBreaks.length === 0;

    return deepFreeze({
      valid,
      transition_count: transitions.length,
      start_address: transitions[0].address_from,
      end_address: transitions[transitions.length - 1].address_to,
      start_context: transitions[0].context_from,
      end_context: transitions[transitions.length - 1].context_to,
      continuity_valid: valid,
      continuity_breaks: deepFreeze(continuityBreaks),
      transitions: deepFreeze(transitions),
      errors: deepFreeze(valid ? [] : ["transition chain continuity break detected"])
    });
  } catch (error) {
    return deepFreeze({
      valid: false,
      transition_count: 0,
      start_address: null,
      end_address: null,
      start_context: null,
      end_context: null,
      continuity_valid: false,
      continuity_breaks: deepFreeze([]),
      transitions: deepFreeze([]),
      errors: deepFreeze([String(error.message || error)])
    });
  }
}

function buildAddressValidationReceipt(input) {
  const validation = validateAddress(input);

  return deepFreeze({
    receipt_version: PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.RECEIPT_VERSION,
    receipt_scope: "ADDRESS_VALIDATION",
    valid: validation.valid,
    address: validation.address ? validation.address.address : null,
    context: validation.address ? validation.address.context : null,
    address_index: validation.address ? validation.address.address_index : null,
    context_index: validation.address ? validation.address.context_index : null,
    address_signature: validation.address ? validation.address.address_signature : null,
    errors: validation.errors
  });
}

function buildTransitionValidationReceipt(input) {
  const validation = validateAddressTransition(input);

  return deepFreeze({
    receipt_version: PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.RECEIPT_VERSION,
    receipt_scope: "ADDRESS_TRANSITION_VALIDATION",
    valid: validation.valid,
    address_from: validation.transition ? validation.transition.address_from : null,
    address_to: validation.transition ? validation.transition.address_to : null,
    context_from: validation.transition ? validation.transition.context_from : null,
    context_to: validation.transition ? validation.transition.context_to : null,
    transition_class: validation.transition ? validation.transition.transition_class : null,
    map_requirement: validation.transition ? validation.transition.map_requirement : null,
    map_id: validation.transition ? validation.transition.map_id : null,
    transition_address_signature: validation.transition
      ? validation.transition.transition_address_signature
      : null,
    errors: validation.errors
  });
}

function getDomainSummary() {
  return deepFreeze({
    context_count: PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.CONTEXT_COUNT,
    local_state_count: PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.LOCAL_STATE_COUNT,
    full_address_count: PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS.FULL_ADDRESS_COUNT,
    first_address: createAddress({ A: 0, L: 0, S: 0 }),
    last_address: createAddress({ A: 3, L: 3, S: 255 })
  });
}

const EXAMPLE_ADDRESS = createAddress({ A: 0, L: 0, S: 0 });
const EXAMPLE_CONTEXT = createContext({ A: 0, L: 0 });
const EXAMPLE_TRANSITION = createAddressTransition({
  address_from: { A: 0, L: 0, S: 0 },
  address_to: { A: 0, L: 0, S: 1 },
  transition_class: "INTRA_CONTEXT"
});

const protocolPhysicalAddress = deepFreeze({
  meta: PROTOCOL_PHYSICAL_ADDRESS_META,
  constants: PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS,

  getMeta() {
    return PROTOCOL_PHYSICAL_ADDRESS_META;
  },

  getConstants() {
    return PROTOCOL_PHYSICAL_ADDRESS_CONSTANTS;
  },

  getDomainSummary,

  createContext,
  createAddress,
  createAddressTransition,

  validateContext,
  validateAddress,
  validateAddressTransition,
  validateTransitionChain,

  contextFromIndex,
  addressFromIndex,

  deriveContextFromAddress,
  classifyAddressTransition,
  mapRequirementForTransitionClass,

  formatContext,
  formatAddress,
  contextKey,
  addressKey,
  contextIndex,
  addressIndex,
  addressSignature,
  transitionAddressSignature,

  sameContext,
  sameAddress,

  buildAddressValidationReceipt,
  buildTransitionValidationReceipt,

  getExampleContext() {
    return EXAMPLE_CONTEXT;
  },

  getExampleAddress() {
    return EXAMPLE_ADDRESS;
  },

  getExampleTransition() {
    return EXAMPLE_TRANSITION;
  }
});

export default protocolPhysicalAddress;
