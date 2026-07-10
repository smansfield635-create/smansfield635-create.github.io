// /h-earth-3d/runtime/h-earth.state-classification.js
// COMPLETE CANDIDATE FILE
// H_EARTH_STATE_CLASSIFICATION_RUNTIME_CONTRACT_v1
// Descriptor and validator only. No runtime activation.

export const H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID =
  'H_EARTH_STATE_CLASSIFICATION_RUNTIME_CONTRACT_v1';

export const H_EARTH_STATE_CLASSES = Object.freeze([
  'CONSTITUTIONAL',
  'DERIVED',
  'RUNTIME_MUTABLE',
  'EPHEMERAL_VISUAL',
  'PERSISTED_EVENT',
  'DIAGNOSTIC_ONLY'
]);

export const H_EARTH_HASH_POLICIES = Object.freeze([
  'AUTHORITATIVE_INCLUDED',
  'AUTHORITATIVE_EXCLUDED',
  'DERIVED_HASH_ONLY',
  'EVENT_HASH_INCLUDED',
  'DIAGNOSTIC_HASH_ONLY',
  'NOT_HASHED'
]);

export const H_EARTH_PERSISTENCE_POLICIES = Object.freeze([
  'NEVER_PERSIST',
  'SNAPSHOT',
  'EVENT_LOG',
  'SNAPSHOT_AND_EVENT',
  'REGENERATE',
  'CACHE_ONLY',
  'ARCHIVE_ONLY',
  'MIGRATION_ONLY'
]);

export const H_EARTH_NULL_POLICIES = Object.freeze([
  'NULL_FORBIDDEN',
  'NULL_MEANS_NOT_APPLICABLE',
  'NULL_MEANS_NOT_YET_RESOLVED',
  'NULL_MEANS_EXPLICITLY_CLEARED',
  'NULL_MEANS_UNEVALUABLE'
]);

export const H_EARTH_UNDEFINED_POLICIES = Object.freeze([
  'UNDEFINED_FORBIDDEN',
  'OMITTED_BY_SCHEMA',
  'TRANSIENT_INTERNAL_ONLY'
]);

const REQUIRED_COMMON_FIELDS = Object.freeze([
  'fieldId',
  'stateClass',
  'schemaVersion',
  'authorityOwner',
  'writeAuthority',
  'persistencePolicy',
  'hashPolicy',
  'nullPolicy',
  'undefinedPolicy',
  'orderingPolicy',
  'versionSensitivity',
  'failureDisposition'
]);

const REQUIRED_BY_CLASS = Object.freeze({
  CONSTITUTIONAL: Object.freeze([
    'constitutionalRuleId',
    'jurisdiction',
    'changePolicy'
  ]),

  DERIVED: Object.freeze([
    'derivationRuleId',
    'sourceFieldIds',
    'recomputationPolicy'
  ]),

  RUNTIME_MUTABLE: Object.freeze([
    'mutationRuleId',
    'commitBoundary',
    'lifecycleOwner'
  ]),

  EPHEMERAL_VISUAL: Object.freeze([
    'rendererScope',
    'discardPolicy'
  ]),

  PERSISTED_EVENT: Object.freeze([
    'eventSchemaId',
    'eventOrderPolicy',
    'immutabilityPolicy'
  ]),

  DIAGNOSTIC_ONLY: Object.freeze([
    'diagnosticKind',
    'claimLevel',
    'authoritativeExclusion'
  ])
});

const FORBIDDEN_AUTHORITATIVE_HASH_CLASSES = new Set([
  'EPHEMERAL_VISUAL',
  'DIAGNOSTIC_ONLY'
]);

function hasOwn(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function freezeArray(values) {
  return Object.freeze(
    values.map((value) => Object.freeze(value))
  );
}

export function validateHEarthFieldDeclaration(candidate) {
  const failures = [];
  const warnings = [];

  if (
    !candidate ||
    typeof candidate !== 'object' ||
    Array.isArray(candidate)
  ) {
    return Object.freeze({
      ok: false,
      status: 'INVALID_DECLARATION',

      failures: freezeArray([
        {
          code: 'STATE_DECLARATION_NOT_OBJECT'
        }
      ]),

      warnings: Object.freeze([])
    });
  }

  for (const field of REQUIRED_COMMON_FIELDS) {
    if (!hasOwn(candidate, field)) {
      failures.push({
        code: 'STATE_DECLARATION_REQUIRED_FIELD_MISSING',
        field
      });
    }
  }

  const declaredClasses = Array.isArray(candidate.stateClass)
    ? candidate.stateClass
    : [candidate.stateClass];

  if (
    declaredClasses.length !== 1 ||
    !declaredClasses[0]
  ) {
    failures.push({
      code: 'STATE_CLASSIFICATION_AMBIGUOUS',
      field: 'stateClass'
    });
  } else if (
    !H_EARTH_STATE_CLASSES.includes(declaredClasses[0])
  ) {
    failures.push({
      code: 'STATE_CLASSIFICATION_INVALID',
      value: declaredClasses[0]
    });
  }

  const stateClass = declaredClasses[0];

  for (const field of REQUIRED_BY_CLASS[stateClass] || []) {
    if (!hasOwn(candidate, field)) {
      failures.push({
        code: 'STATE_CLASS_REQUIRED_FIELD_MISSING',
        stateClass,
        field
      });
    }
  }

  if (
    !H_EARTH_HASH_POLICIES.includes(candidate.hashPolicy)
  ) {
    failures.push({
      code: 'STATE_HASH_POLICY_INVALID',
      value: candidate.hashPolicy
    });
  }

  if (
    !H_EARTH_PERSISTENCE_POLICIES.includes(
      candidate.persistencePolicy
    )
  ) {
    failures.push({
      code: 'STATE_PERSISTENCE_POLICY_INVALID',
      value: candidate.persistencePolicy
    });
  }

  if (
    !H_EARTH_NULL_POLICIES.includes(candidate.nullPolicy)
  ) {
    failures.push({
      code: 'STATE_NULL_POLICY_INVALID',
      value: candidate.nullPolicy
    });
  }

  if (
    !H_EARTH_UNDEFINED_POLICIES.includes(
      candidate.undefinedPolicy
    )
  ) {
    failures.push({
      code: 'STATE_UNDEFINED_POLICY_INVALID',
      value: candidate.undefinedPolicy
    });
  }

  if (
    FORBIDDEN_AUTHORITATIVE_HASH_CLASSES.has(stateClass) &&
    candidate.hashPolicy === 'AUTHORITATIVE_INCLUDED'
  ) {
    failures.push({
      code: 'STATE_CLASSIFICATION_HASH_POLICY_REJECTED',
      stateClass,
      hashPolicy: candidate.hashPolicy
    });
  }

  if (
    stateClass === 'RUNTIME_MUTABLE' &&
    candidate.writeAuthority !== 'H_EARTH_MUTATION_COMMIT'
  ) {
    failures.push({
      code: 'STATE_CLASSIFICATION_WRITE_AUTHORITY_REJECTED',
      expected: 'H_EARTH_MUTATION_COMMIT',
      received: candidate.writeAuthority
    });
  }

  if (
    stateClass === 'CONSTITUTIONAL' &&
    candidate.writeAuthority === 'H_EARTH_MUTATION_COMMIT'
  ) {
    failures.push({
      code: 'CONSTITUTIONAL_ORDINARY_MUTATION_PROHIBITED'
    });
  }

  if (
    stateClass === 'PERSISTED_EVENT' &&
    candidate.immutabilityPolicy !==
      'APPEND_ONLY_FINALIZED_IMMUTABLE'
  ) {
    failures.push({
      code: 'PERSISTED_EVENT_IMMUTABILITY_POLICY_REJECTED'
    });
  }

  if (
    candidate.undefinedPolicy === 'TRANSIENT_INTERNAL_ONLY' &&
    candidate.hashPolicy === 'AUTHORITATIVE_INCLUDED'
  ) {
    failures.push({
      code: 'TRANSIENT_UNDEFINED_AUTHORITATIVE_HASH_REJECTED'
    });
  }

  if (candidate.authorityStatus === 'RETIRED') {
    const legacyChecks = [
      candidate.supersededBy === 'PATH_3',
      candidate.compatibilityOnly === true,
      candidate.createsSpatialAuthority === false
    ];

    if (!legacyChecks.every(Boolean)) {
      failures.push({
        code: 'RETIRED_AUTHORITY_METADATA_INCOMPLETE'
      });
    }
  }

  if (
    candidate.stateClass === 'DERIVED' &&
    (
      !Array.isArray(candidate.sourceFieldIds) ||
      candidate.sourceFieldIds.length === 0
    )
  ) {
    failures.push({
      code: 'DERIVED_SOURCE_FIELDS_REQUIRED'
    });
  }

  if (
    candidate.persistencePolicy === 'CACHE_ONLY' &&
    candidate.stateClass !== 'DERIVED'
  ) {
    warnings.push({
      code: 'CACHE_ONLY_NON_DERIVED_REVIEW_REQUIRED'
    });
  }

  return Object.freeze({
    ok: failures.length === 0,

    status:
      failures.length === 0
        ? 'STATIC_DECLARATION_CONFORMANT'
        : 'REJECTED',

    contractId:
      H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

    fieldId:
      candidate.fieldId || null,

    failures:
      freezeArray(failures),

    warnings:
      freezeArray(warnings)
  });
}

export function validateHEarthStateSchema(schema) {
  const declarations =
    Array.isArray(schema)
      ? schema
      : [];

  const receipts =
    declarations.map(validateHEarthFieldDeclaration);

  const duplicateIds = [];
  const seen = new Set();

  for (const declaration of declarations) {
    if (
      !declaration ||
      typeof declaration.fieldId !== 'string'
    ) {
      continue;
    }

    if (seen.has(declaration.fieldId)) {
      duplicateIds.push(declaration.fieldId);
    }

    seen.add(declaration.fieldId);
  }

  const declarationsConform =
    receipts.every((receipt) => receipt.ok);

  const duplicatesAbsent =
    duplicateIds.length === 0;

  return Object.freeze({
    ok:
      declarationsConform &&
      duplicatesAbsent,

    status:
      declarationsConform &&
      duplicatesAbsent
        ? 'STATIC_AUTHORITY_CONFORMANT'
        : 'REJECTED',

    contractId:
      H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

    declarationCount:
      declarations.length,

    duplicateFieldIds:
      Object.freeze([...duplicateIds]),

    receipts:
      Object.freeze(receipts)
  });
}

export const H_EARTH_STATE_CLASSIFICATION_BOUNDARY =
  Object.freeze({
    activeSpatialAuthority:
      'PATH_3_ONLY',

    canonicalRegionCellId:
      'H_EARTH_REGION_CELL_X07_Z08',

    domainCellId:
      'H_EARTH_GROUND_CELL_001',

    rendererMutationAuthority:
      false,

    geometryMutationAuthority:
      false,

    diagnosticMutationAuthority:
      false,

    asyncDirectMutationAuthority:
      false,

    runtimeActivated:
      false,

    validationClaim:
      false,

    productionClaim:
      false
  });

export default Object.freeze({
  contractId:
    H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

  classes:
    H_EARTH_STATE_CLASSES,

  validateFieldDeclaration:
    validateHEarthFieldDeclaration,

  validateSchema:
    validateHEarthStateSchema,

  boundary:
    H_EARTH_STATE_CLASSIFICATION_BOUNDARY
});
