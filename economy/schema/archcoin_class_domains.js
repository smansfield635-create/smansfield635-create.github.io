// /economy/schema/archcoin_class_domains.js
// MODE: TNT
// STATUS: SCHEMA_LAYER | DOMAIN_SOURCE_OF_TRUTH | NON-DRIFT
// OWNER: SEAN

const TOTAL_CLASS_COUNT = 256;

const CARDINAL_OWNER = Object.freeze({
  N: "N",
  E: "E",
  S: "S",
  W: "W"
});

const BODY_RELATION = Object.freeze({
  STORE: "STORE",
  RELEASE: "RELEASE",
  HOLD: "HOLD",
  ROUTE: "ROUTE",
  SETTLE: "SETTLE",
  ESCALATE: "ESCALATE"
});

const PARENT_RELATION = Object.freeze({
  DERIVED: "DERIVED",
  ROOT_BOUND: "ROOT_BOUND",
  SPECIALIZED: "SPECIALIZED"
});

const CLASS_TYPE = Object.freeze({
  TERMINAL: "TERMINAL",
  PATHWAY: "PATHWAY",
  PERMISSION: "PERMISSION",
  BURDEN: "BURDEN",
  SETTLEMENT: "SETTLEMENT",
  ESCALATION: "ESCALATION"
});

const ACCESS_CLASS = Object.freeze({
  OPEN: "OPEN",
  CONDITIONAL: "CONDITIONAL",
  RESTRICTED: "RESTRICTED",
  SEALED: "SEALED"
});

const RECEIPT_TYPE = Object.freeze({
  ROUTE: "ROUTE",
  BIND: "BIND",
  SETTLE: "SETTLE",
  HOLD: "HOLD",
  ESCALATE: "ESCALATE"
});

const MATRIX_OUTPUT = Object.freeze({
  PASS: "PASS",
  HOLD: "HOLD",
  BLOCK: "BLOCK",
  BIND: "BIND",
  SETTLE: "SETTLE",
  ESCALATE: "ESCALATE"
});

const STATE_RANGE_MODE = Object.freeze({
  FULL_256: "FULL_256",
  WINDOW: "WINDOW",
  INDEX_SET: "INDEX_SET"
});

function valuesOf(table) {
  return Object.freeze(Object.values(table));
}

function hasOwn(table, key) {
  return Object.prototype.hasOwnProperty.call(table, key);
}

function isFiniteInteger(value) {
  return Number.isInteger(value) && Number.isFinite(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pad3(value) {
  return String(value).padStart(3, "0");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[ARCHCOIN_CLASS_DOMAINS] ${message}`);
  }
}

const DOMAIN_VALUES = Object.freeze({
  CARDINAL_OWNER: valuesOf(CARDINAL_OWNER),
  BODY_RELATION: valuesOf(BODY_RELATION),
  PARENT_RELATION: valuesOf(PARENT_RELATION),
  CLASS_TYPE: valuesOf(CLASS_TYPE),
  ACCESS_CLASS: valuesOf(ACCESS_CLASS),
  RECEIPT_TYPE: valuesOf(RECEIPT_TYPE),
  MATRIX_OUTPUT: valuesOf(MATRIX_OUTPUT),
  STATE_RANGE_MODE: valuesOf(STATE_RANGE_MODE)
});

function isDomainValue(domainName, value) {
  const domain = DOMAIN_VALUES[domainName];
  return Array.isArray(domain) && domain.includes(value);
}

function normalizeClassIndex(value) {
  if (!isFiniteInteger(value)) {
    throw new Error("[ARCHCOIN_CLASS_DOMAINS] class index must be a finite integer");
  }
  return clamp(value, 0, TOTAL_CLASS_COUNT - 1);
}

function createClassId(index) {
  const normalized = normalizeClassIndex(index);
  return `CLASS_${pad3(normalized)}`;
}

function createClassCode(index) {
  const normalized = normalizeClassIndex(index);
  return `C${pad3(normalized)}`;
}

function createMatrixPointer(index) {
  const normalized = normalizeClassIndex(index);
  return Object.freeze({
    row: normalized,
    label: `ROW_${pad3(normalized)}`
  });
}

function createDefaultStateRange() {
  return Object.freeze({
    mode: STATE_RANGE_MODE.FULL_256,
    min: 0,
    max: TOTAL_CLASS_COUNT - 1,
    indices: null
  });
}

function validateStateRange(value) {
  assert(value && typeof value === "object" && !Array.isArray(value), "state range must be an object");

  const mode = value.mode;
  assert(isDomainValue("STATE_RANGE_MODE", mode), `invalid state range mode: ${mode}`);

  if (mode === STATE_RANGE_MODE.FULL_256) {
    return Object.freeze({
      mode,
      min: 0,
      max: TOTAL_CLASS_COUNT - 1,
      indices: null
    });
  }

  if (mode === STATE_RANGE_MODE.WINDOW) {
    assert(isFiniteInteger(value.min), "window state range requires integer min");
    assert(isFiniteInteger(value.max), "window state range requires integer max");

    const min = normalizeClassIndex(value.min);
    const max = normalizeClassIndex(value.max);
    assert(min <= max, "window state range min must be <= max");

    return Object.freeze({
      mode,
      min,
      max,
      indices: null
    });
  }

  assert(Array.isArray(value.indices), "index-set state range requires indices array");

  const deduped = Array.from(
    new Set(
      value.indices.map((entry) => normalizeClassIndex(entry))
    )
  ).sort((a, b) => a - b);

  assert(deduped.length > 0, "index-set state range cannot be empty");

  return Object.freeze({
    mode,
    min: deduped[0],
    max: deduped[deduped.length - 1],
    indices: Object.freeze(deduped)
  });
}

function createClassTemplate(index) {
  const normalized = normalizeClassIndex(index);

  return Object.freeze({
    classId: createClassId(normalized),
    classCode: createClassCode(normalized),
    className: `Archcoin Class ${pad3(normalized)}`,
    classIndex: normalized,
    cardinalOwner: CARDINAL_OWNER.N,
    bodyRelation: BODY_RELATION.ROUTE,
    parentRelation: PARENT_RELATION.DERIVED,
    classType: CLASS_TYPE.TERMINAL,
    accessClass: ACCESS_CLASS.CONDITIONAL,
    admissibilityRule: "UNSPECIFIED",
    stateRange: createDefaultStateRange(),
    settlementRule: "UNSPECIFIED",
    escalationRule: "UNSPECIFIED",
    receiptType: RECEIPT_TYPE.ROUTE,
    matrixRowPointer: createMatrixPointer(normalized),
    metadataDescriptor: Object.freeze({
      version: 1,
      uri: null,
      tags: Object.freeze([])
    })
  });
}

const ARCHCOIN_CLASS_DOMAINS = Object.freeze({
  TOTAL_CLASS_COUNT,
  CARDINAL_OWNER,
  BODY_RELATION,
  PARENT_RELATION,
  CLASS_TYPE,
  ACCESS_CLASS,
  RECEIPT_TYPE,
  MATRIX_OUTPUT,
  STATE_RANGE_MODE,
  DOMAIN_VALUES,
  isDomainValue,
  normalizeClassIndex,
  createClassId,
  createClassCode,
  createMatrixPointer,
  createDefaultStateRange,
  validateStateRange,
  createClassTemplate
});

export {
  TOTAL_CLASS_COUNT,
  CARDINAL_OWNER,
  BODY_RELATION,
  PARENT_RELATION,
  CLASS_TYPE,
  ACCESS_CLASS,
  RECEIPT_TYPE,
  MATRIX_OUTPUT,
  STATE_RANGE_MODE,
  DOMAIN_VALUES,
  isDomainValue,
  normalizeClassIndex,
  createClassId,
  createClassCode,
  createMatrixPointer,
  createDefaultStateRange,
  validateStateRange,
  createClassTemplate
};

export default ARCHCOIN_CLASS_DOMAINS;
