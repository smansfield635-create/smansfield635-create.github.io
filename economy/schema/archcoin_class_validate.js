// /economy/schema/archcoin_class_validate.js
// MODE: TNT
// STATUS: SCHEMA_LAYER | VALIDATION_SURFACE | NON-DRIFT
// OWNER: SEAN

import ARCHCOIN_CLASS_SCHEMA, {
  validateSchema,
  validateClassEntry,
  getClassByIndex,
  getClassById,
  getSchemaRead
} from "./archcoin_class_schema.js";

import {
  TOTAL_CLASS_COUNT,
  CARDINAL_OWNER,
  BODY_RELATION,
  PARENT_RELATION,
  CLASS_TYPE,
  ACCESS_CLASS,
  RECEIPT_TYPE,
  STATE_RANGE_MODE,
  validateStateRange
} from "./archcoin_class_domains.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[ARCHCOIN_CLASS_VALIDATE] ${message}`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function valuesOf(table) {
  return Object.values(table);
}

const DOMAIN_RULES = Object.freeze({
  cardinalOwner: Object.freeze(valuesOf(CARDINAL_OWNER)),
  bodyRelation: Object.freeze(valuesOf(BODY_RELATION)),
  parentRelation: Object.freeze(valuesOf(PARENT_RELATION)),
  classType: Object.freeze(valuesOf(CLASS_TYPE)),
  accessClass: Object.freeze(valuesOf(ACCESS_CLASS)),
  receiptType: Object.freeze(valuesOf(RECEIPT_TYPE))
});

function validateDomainField(fieldName, value) {
  const allowed = DOMAIN_RULES[fieldName];
  assert(Array.isArray(allowed), `unknown domain field: ${fieldName}`);
  assert(allowed.includes(value), `invalid ${fieldName}: ${String(value)}`);
  return true;
}

function validateMetadataDescriptor(metadataDescriptor, classId = "UNKNOWN_CLASS") {
  assert(isPlainObject(metadataDescriptor), `${classId} metadataDescriptor must be an object`);
  assert(
    Number.isInteger(metadataDescriptor.version) && metadataDescriptor.version > 0,
    `${classId} metadataDescriptor.version must be a positive integer`
  );

  if (metadataDescriptor.uri !== null) {
    assert(
      typeof metadataDescriptor.uri === "string",
      `${classId} metadataDescriptor.uri must be string or null`
    );
  }

  assert(
    Array.isArray(metadataDescriptor.tags),
    `${classId} metadataDescriptor.tags must be an array`
  );

  metadataDescriptor.tags.forEach((tag, index) => {
    assert(
      typeof tag === "string" && tag.trim().length > 0,
      `${classId} metadataDescriptor.tags[${index}] must be a non-empty string`
    );
  });

  return true;
}

function validateMatrixPointer(matrixRowPointer, classIndex, classId = "UNKNOWN_CLASS") {
  assert(isPlainObject(matrixRowPointer), `${classId} matrixRowPointer must be an object`);
  assert(
    Number.isInteger(matrixRowPointer.row),
    `${classId} matrixRowPointer.row must be an integer`
  );
  assert(
    matrixRowPointer.row === classIndex,
    `${classId} matrixRowPointer.row must equal classIndex`
  );
  assert(
    typeof matrixRowPointer.label === "string" && matrixRowPointer.label.length > 0,
    `${classId} matrixRowPointer.label must be a non-empty string`
  );
  return true;
}

function validateClassStructure(entry) {
  validateClassEntry(entry);

  assert(
    typeof entry.admissibilityRule === "string" && entry.admissibilityRule.length > 0,
    `${entry.classId} admissibilityRule required`
  );
  assert(
    typeof entry.settlementRule === "string" && entry.settlementRule.length > 0,
    `${entry.classId} settlementRule required`
  );
  assert(
    typeof entry.escalationRule === "string" && entry.escalationRule.length > 0,
    `${entry.classId} escalationRule required`
  );

  validateDomainField("cardinalOwner", entry.cardinalOwner);
  validateDomainField("bodyRelation", entry.bodyRelation);
  validateDomainField("parentRelation", entry.parentRelation);
  validateDomainField("classType", entry.classType);
  validateDomainField("accessClass", entry.accessClass);
  validateDomainField("receiptType", entry.receiptType);

  validateStateRange(entry.stateRange);
  validateMatrixPointer(entry.matrixRowPointer, entry.classIndex, entry.classId);
  validateMetadataDescriptor(entry.metadataDescriptor, entry.classId);

  return true;
}

function validateStateRangeCoverage(entry) {
  const stateRange = entry.stateRange;
  assert(isPlainObject(stateRange), `${entry.classId} stateRange missing`);
  assert(
    Object.values(STATE_RANGE_MODE).includes(stateRange.mode),
    `${entry.classId} stateRange.mode invalid`
  );

  if (stateRange.mode === STATE_RANGE_MODE.FULL_256) {
    assert(stateRange.min === 0, `${entry.classId} FULL_256 min must be 0`);
    assert(
      stateRange.max === TOTAL_CLASS_COUNT - 1,
      `${entry.classId} FULL_256 max must be ${TOTAL_CLASS_COUNT - 1}`
    );
    return true;
  }

  assert(
    Number.isInteger(stateRange.min) &&
      stateRange.min >= 0 &&
      stateRange.min < TOTAL_CLASS_COUNT,
    `${entry.classId} stateRange.min out of range`
  );
  assert(
    Number.isInteger(stateRange.max) &&
      stateRange.max >= 0 &&
      stateRange.max < TOTAL_CLASS_COUNT,
    `${entry.classId} stateRange.max out of range`
  );
  assert(
    stateRange.min <= stateRange.max,
    `${entry.classId} stateRange.min must be <= stateRange.max`
  );

  if (stateRange.mode === STATE_RANGE_MODE.INDEX_SET) {
    assert(
      Array.isArray(stateRange.indices) && stateRange.indices.length > 0,
      `${entry.classId} INDEX_SET must provide indices`
    );
  }

  return true;
}

function validateClassFamilyBalance(schema = ARCHCOIN_CLASS_SCHEMA) {
  const counts = {
    cardinalOwner: { N: 0, E: 0, S: 0, W: 0 },
    classType: {},
    accessClass: {},
    receiptType: {}
  };

  schema.forEach((entry) => {
    counts.cardinalOwner[entry.cardinalOwner] += 1;
    counts.classType[entry.classType] = (counts.classType[entry.classType] || 0) + 1;
    counts.accessClass[entry.accessClass] = (counts.accessClass[entry.accessClass] || 0) + 1;
    counts.receiptType[entry.receiptType] = (counts.receiptType[entry.receiptType] || 0) + 1;
  });

  return Object.freeze(counts);
}

function validateSchemaSurface(schema = ARCHCOIN_CLASS_SCHEMA) {
  validateSchema(schema);

  schema.forEach((entry) => {
    validateClassStructure(entry);
    validateStateRangeCoverage(entry);
  });

  return true;
}

function createValidationReceipt(schema = ARCHCOIN_CLASS_SCHEMA) {
  validateSchemaSurface(schema);

  const counts = validateClassFamilyBalance(schema);

  return Object.freeze({
    valid: true,
    totalClassCount: schema.length,
    schemaRead: getSchemaRead(),
    familyBalance: counts
  });
}

const ARCHCOIN_CLASS_VALIDATION_RECEIPT = createValidationReceipt();

const ARCHCOIN_CLASS_VALIDATE = Object.freeze({
  validateSchemaSurface,
  validateClassStructure,
  validateStateRangeCoverage,
  validateClassFamilyBalance,
  createValidationReceipt,
  getClassByIndex,
  getClassById,
  getSchemaRead,
  receipt: ARCHCOIN_CLASS_VALIDATION_RECEIPT
});

export {
  validateSchemaSurface,
  validateClassStructure,
  validateStateRangeCoverage,
  validateClassFamilyBalance,
  createValidationReceipt,
  ARCHCOIN_CLASS_VALIDATION_RECEIPT
};

export default ARCHCOIN_CLASS_VALIDATE;
