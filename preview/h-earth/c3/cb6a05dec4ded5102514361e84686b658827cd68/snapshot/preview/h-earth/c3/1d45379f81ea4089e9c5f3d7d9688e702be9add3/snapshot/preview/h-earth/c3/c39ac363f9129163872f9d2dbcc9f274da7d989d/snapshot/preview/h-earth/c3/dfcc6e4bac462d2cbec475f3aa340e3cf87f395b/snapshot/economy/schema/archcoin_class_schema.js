// /economy/schema/archcoin_class_schema.js
// MODE: TNT
// STATUS: SCHEMA_LAYER | 256_CLASS_SOURCE_OF_TRUTH | NON-DRIFT
// OWNER: SEAN

import {
  TOTAL_CLASS_COUNT,
  CARDINAL_OWNER,
  BODY_RELATION,
  PARENT_RELATION,
  CLASS_TYPE,
  ACCESS_CLASS,
  RECEIPT_TYPE,
  createClassTemplate,
  validateStateRange
} from "./archcoin_class_domains.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[ARCHCOIN_CLASS_SCHEMA] ${message}`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function freezeDeep(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  Object.getOwnPropertyNames(value).forEach((key) => {
    freezeDeep(value[key]);
  });

  return Object.freeze(value);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeText(value, fallback) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeMetadataDescriptor(value) {
  const fallback = Object.freeze({
    version: 1,
    uri: null,
    tags: Object.freeze([])
  });

  if (!isPlainObject(value)) {
    return fallback;
  }

  const version = Number.isInteger(value.version) && value.version > 0 ? value.version : 1;
  const uri =
    typeof value.uri === "string" && value.uri.trim().length > 0
      ? value.uri.trim()
      : null;

  const tags = Array.isArray(value.tags)
    ? value.tags
        .filter((entry) => typeof entry === "string" && entry.trim().length > 0)
        .map((entry) => entry.trim())
    : [];

  return Object.freeze({
    version,
    uri,
    tags: Object.freeze(Array.from(new Set(tags)))
  });
}

function ensureDomainValue(domainTable, value, fieldName) {
  const values = Object.values(domainTable);
  assert(values.includes(value), `invalid ${fieldName}: ${String(value)}`);
  return value;
}

function buildBaseClass(index) {
  const template = createClassTemplate(index);
  const cardinalCycle = [
    CARDINAL_OWNER.N,
    CARDINAL_OWNER.E,
    CARDINAL_OWNER.S,
    CARDINAL_OWNER.W
  ];
  const classTypeCycle = [
    CLASS_TYPE.TERMINAL,
    CLASS_TYPE.PATHWAY,
    CLASS_TYPE.PERMISSION,
    CLASS_TYPE.BURDEN,
    CLASS_TYPE.SETTLEMENT,
    CLASS_TYPE.ESCALATION
  ];
  const accessCycle = [
    ACCESS_CLASS.OPEN,
    ACCESS_CLASS.CONDITIONAL,
    ACCESS_CLASS.RESTRICTED,
    ACCESS_CLASS.SEALED
  ];
  const bodyCycle = [
    BODY_RELATION.ROUTE,
    BODY_RELATION.STORE,
    BODY_RELATION.HOLD,
    BODY_RELATION.RELEASE,
    BODY_RELATION.SETTLE,
    BODY_RELATION.ESCALATE
  ];
  const receiptCycle = [
    RECEIPT_TYPE.ROUTE,
    RECEIPT_TYPE.BIND,
    RECEIPT_TYPE.HOLD,
    RECEIPT_TYPE.SETTLE,
    RECEIPT_TYPE.ESCALATE
  ];

  const cardinalOwner = cardinalCycle[index % cardinalCycle.length];
  const classType = classTypeCycle[index % classTypeCycle.length];
  const accessClass = accessCycle[index % accessCycle.length];
  const bodyRelation = bodyCycle[index % bodyCycle.length];
  const receiptType = receiptCycle[index % receiptCycle.length];

  return freezeDeep({
    ...template,
    cardinalOwner,
    bodyRelation,
    parentRelation:
      classType === CLASS_TYPE.SETTLEMENT || classType === CLASS_TYPE.ESCALATION
        ? PARENT_RELATION.SPECIALIZED
        : PARENT_RELATION.DERIVED,
    classType,
    accessClass,
    admissibilityRule: `${accessClass}_BY_DEFAULT`,
    stateRange: validateStateRange(template.stateRange),
    settlementRule:
      classType === CLASS_TYPE.SETTLEMENT ? "SETTLEMENT_ENABLED" : "SETTLEMENT_CONDITIONAL",
    escalationRule:
      classType === CLASS_TYPE.ESCALATION ? "ESCALATION_ENABLED" : "ESCALATION_CONDITIONAL",
    receiptType,
    metadataDescriptor: normalizeMetadataDescriptor({
      version: 1,
      uri: null,
      tags: [
        "archcoin",
        "class-family",
        cardinalOwner.toLowerCase(),
        classType.toLowerCase()
      ]
    })
  });
}

function applyOverride(baseClass, override) {
  assert(isPlainObject(override), "class override must be an object");
  assert(
    baseClass.classIndex === override.classIndex,
    `override classIndex mismatch for ${baseClass.classId}`
  );

  const next = cloneJson(baseClass);

  next.className = normalizeText(override.className, next.className);
  next.cardinalOwner = ensureDomainValue(
    CARDINAL_OWNER,
    override.cardinalOwner ?? next.cardinalOwner,
    "cardinalOwner"
  );
  next.bodyRelation = ensureDomainValue(
    BODY_RELATION,
    override.bodyRelation ?? next.bodyRelation,
    "bodyRelation"
  );
  next.parentRelation = ensureDomainValue(
    PARENT_RELATION,
    override.parentRelation ?? next.parentRelation,
    "parentRelation"
  );
  next.classType = ensureDomainValue(
    CLASS_TYPE,
    override.classType ?? next.classType,
    "classType"
  );
  next.accessClass = ensureDomainValue(
    ACCESS_CLASS,
    override.accessClass ?? next.accessClass,
    "accessClass"
  );
  next.admissibilityRule = normalizeText(
    override.admissibilityRule,
    next.admissibilityRule
  );
  next.stateRange = validateStateRange(override.stateRange ?? next.stateRange);
  next.settlementRule = normalizeText(
    override.settlementRule,
    next.settlementRule
  );
  next.escalationRule = normalizeText(
    override.escalationRule,
    next.escalationRule
  );
  next.receiptType = ensureDomainValue(
    RECEIPT_TYPE,
    override.receiptType ?? next.receiptType,
    "receiptType"
  );
  next.metadataDescriptor = normalizeMetadataDescriptor(
    override.metadataDescriptor ?? next.metadataDescriptor
  );

  return freezeDeep(next);
}

function createBaseSchema() {
  const classes = [];

  for (let index = 0; index < TOTAL_CLASS_COUNT; index += 1) {
    classes.push(buildBaseClass(index));
  }

  return freezeDeep(classes);
}

function createClassIndexMap(classes) {
  const indexMap = {};

  classes.forEach((entry) => {
    indexMap[entry.classId] = entry.classIndex;
  });

  return Object.freeze(indexMap);
}

function createCardinalBuckets(classes) {
  const buckets = {
    N: [],
    E: [],
    S: [],
    W: []
  };

  classes.forEach((entry) => {
    buckets[entry.cardinalOwner].push(entry.classId);
  });

  return Object.freeze({
    N: Object.freeze(buckets.N),
    E: Object.freeze(buckets.E),
    S: Object.freeze(buckets.S),
    W: Object.freeze(buckets.W)
  });
}

function validateClassEntry(entry) {
  assert(isPlainObject(entry), "class entry must be an object");
  assert(typeof entry.classId === "string" && entry.classId.length > 0, "classId required");
  assert(typeof entry.classCode === "string" && entry.classCode.length > 0, "classCode required");
  assert(typeof entry.className === "string" && entry.className.length > 0, "className required");
  assert(
    Number.isInteger(entry.classIndex) &&
      entry.classIndex >= 0 &&
      entry.classIndex < TOTAL_CLASS_COUNT,
    `classIndex out of range for ${entry.classId}`
  );
  ensureDomainValue(CARDINAL_OWNER, entry.cardinalOwner, "cardinalOwner");
  ensureDomainValue(BODY_RELATION, entry.bodyRelation, "bodyRelation");
  ensureDomainValue(PARENT_RELATION, entry.parentRelation, "parentRelation");
  ensureDomainValue(CLASS_TYPE, entry.classType, "classType");
  ensureDomainValue(ACCESS_CLASS, entry.accessClass, "accessClass");
  ensureDomainValue(RECEIPT_TYPE, entry.receiptType, "receiptType");
  validateStateRange(entry.stateRange);

  assert(
    isPlainObject(entry.matrixRowPointer) &&
      entry.matrixRowPointer.row === entry.classIndex,
    `matrixRowPointer mismatch for ${entry.classId}`
  );

  return true;
}

function validateSchema(classes) {
  assert(Array.isArray(classes), "schema must be an array");
  assert(classes.length === TOTAL_CLASS_COUNT, `schema must contain ${TOTAL_CLASS_COUNT} classes`);

  const seenIds = new Set();
  const seenCodes = new Set();
  const seenIndices = new Set();

  classes.forEach((entry) => {
    validateClassEntry(entry);

    assert(!seenIds.has(entry.classId), `duplicate classId: ${entry.classId}`);
    assert(!seenCodes.has(entry.classCode), `duplicate classCode: ${entry.classCode}`);
    assert(!seenIndices.has(entry.classIndex), `duplicate classIndex: ${entry.classIndex}`);

    seenIds.add(entry.classId);
    seenCodes.add(entry.classCode);
    seenIndices.add(entry.classIndex);
  });

  return true;
}

function createSchema(overrides = []) {
  const baseSchema = createBaseSchema();

  if (!Array.isArray(overrides) || overrides.length === 0) {
    validateSchema(baseSchema);
    return baseSchema;
  }

  const next = baseSchema.map((entry) => cloneJson(entry));

  overrides.forEach((override) => {
    assert(isPlainObject(override), "every override must be an object");
    assert(
      Number.isInteger(override.classIndex) &&
        override.classIndex >= 0 &&
        override.classIndex < TOTAL_CLASS_COUNT,
      "override classIndex out of range"
    );

    next[override.classIndex] = applyOverride(baseSchema[override.classIndex], override);
  });

  const frozen = freezeDeep(next);
  validateSchema(frozen);
  return frozen;
}

const ARCHCOIN_CLASS_SCHEMA = createSchema();

const ARCHCOIN_CLASS_SCHEMA_READ = freezeDeep({
  totalClassCount: TOTAL_CLASS_COUNT,
  schemaVersion: 1,
  classFamily: "ARCHCOIN_CLASS_FAMILY",
  matrixSize: `${TOTAL_CLASS_COUNT}x${TOTAL_CLASS_COUNT}`,
  classIndexMap: createClassIndexMap(ARCHCOIN_CLASS_SCHEMA),
  cardinalBuckets: createCardinalBuckets(ARCHCOIN_CLASS_SCHEMA)
});

function getClassByIndex(index) {
  assert(
    Number.isInteger(index) && index >= 0 && index < TOTAL_CLASS_COUNT,
    "class index out of range"
  );
  return ARCHCOIN_CLASS_SCHEMA[index];
}

function getClassById(classId) {
  assert(typeof classId === "string" && classId.length > 0, "classId required");
  const entry = ARCHCOIN_CLASS_SCHEMA.find((candidate) => candidate.classId === classId);
  assert(entry, `unknown classId: ${classId}`);
  return entry;
}

function getSchemaRead() {
  return ARCHCOIN_CLASS_SCHEMA_READ;
}

export {
  createSchema,
  validateSchema,
  validateClassEntry,
  getClassByIndex,
  getClassById,
  getSchemaRead,
  ARCHCOIN_CLASS_SCHEMA_READ
};

export default ARCHCOIN_CLASS_SCHEMA;
