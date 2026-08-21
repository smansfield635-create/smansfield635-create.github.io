/**
 * /h-earth-3d/runtime/h-earth.canonical-state-serialization-law.js
 * COMPLETE NEW FILE
 * H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_FILE_BIRTH_STEP_012I_v1
 *
 * Source family:
 * H-Earth 3D Scratch Domain
 *
 * Step:
 * STEP_012I_CANONICAL_STATE_SERIALIZATION_LAW
 *
 * Current active backed chain before this birth:
 * STEP_012G_TARGET_001_STATE_CLASSIFICATION
 * STEP_012G_TARGET_002_DETERMINISTIC_RUNTIME
 * STEP_012G_TARGET_003_CANONICAL_REPLAY
 * STEP_012H_HEADLESS_REPLAY_TEST_SCAFFOLD
 *
 * Purpose:
 * Define a versioned canonical state serialization law before any executable
 * headless replay driver is authorized.
 *
 * This file defines:
 * - admissible canonical value-domain rules;
 * - recursive UTF-16 code-unit object-key sorting;
 * - enumerable own-property-only object custody;
 * - non-enumerable object-property rejection;
 * - array-order preservation;
 * - sparse-array rejection;
 * - array symbol-key rejection;
 * - array non-index own-property rejection;
 * - undefined rejection;
 * - non-finite number rejection;
 * - BigInt rejection;
 * - Symbol rejection;
 * - Function rejection;
 * - Object.prototype-only v1 plain-object policy;
 * - null-prototype rejection;
 * - custom-prototype rejection;
 * - accessor-property rejection through descriptors;
 * - symbol-keyed object-property rejection;
 * - own-toJSON property rejection;
 * - circular-reference rejection;
 * - lone-surrogate rejection;
 * - no Unicode normalization;
 * - no whitespace emission;
 * - UTF-8 byte generation support;
 * - SHA-256 digest support over Uint8Array only;
 * - canonical evidence record construction;
 * - canonical evidence comparison bound independently to this Step 012I profile;
 * - source-bound snapshot-envelope law;
 * - snapshot-envelope canonical clone and deep-freeze custody;
 * - reference-vector definitions;
 * - domain-ordering boundary without naming upstream domain laws;
 * - claim guards;
 * - descriptor receipt.
 *
 * This file may define callable helpers.
 * Function definition is not function execution.
 *
 * This file does not import neighboring source modules.
 * This file does not mutate Target 003 canonical replay.
 * This file does not mutate Step 012H headless replay scaffold.
 * This file does not execute reference vectors at module load.
 * This file does not verify reference vectors.
 * This file does not prove import resolution.
 * This file does not prove installed module evaluation.
 * This file does not prove module graph execution.
 * This file does not create runtime state.
 * This file does not admit intents.
 * This file does not commit ticks.
 * This file does not create replay snapshots at module load.
 * This file does not generate digests at module load.
 * This file does not execute replay.
 * This file does not compare replay results.
 * This file does not activate persistence.
 * This file does not activate renderer.
 * This file does not activate route.
 * This file does not validate.
 * This file does not claim replay equality.
 * This file does not claim production readiness.
 * This file does not produce a visual pass.
 * This file does not collapse the matrix.
 */

const JSON_STRINGIFY =
  JSON.stringify;

const JSON_PARSE =
  JSON.parse;

const OBJECT_FREEZE =
  Object.freeze;

const OBJECT_IS_FROZEN =
  Object.isFrozen;

const OBJECT_KEYS =
  Object.keys;

const OBJECT_GET_PROTOTYPE_OF =
  Object.getPrototypeOf;

const OBJECT_GET_OWN_PROPERTY_DESCRIPTOR =
  Object.getOwnPropertyDescriptor;

const OBJECT_GET_OWN_PROPERTY_SYMBOLS =
  Object.getOwnPropertySymbols;

const OBJECT_HAS_OWN =
  Object.prototype.hasOwnProperty;

const REFLECT_OWN_KEYS =
  Reflect.ownKeys;

const NUMBER_IS_FINITE =
  Number.isFinite;

const NUMBER_IS_NAN =
  Number.isNaN;

const NUMBER_IS_INTEGER =
  Number.isInteger;

const TEXT_ENCODER_CONSTRUCTOR =
  globalThis.TextEncoder;

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID =
  'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_FILE_BIRTH_STEP_012I_v1';

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_VERIFIED_CONTRACT_ID =
  null;

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_CONTRACT_ID_VERIFIED =
  false;

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID =
  null;

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID =
  'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_STEP_012I_UTF16_UTF8_SHA256_v1';

export const H_EARTH_CANONICAL_STATE_PRIMITIVE_SERIALIZATION_PROFILE =
  'ECMASCRIPT_JSON_PRIMITIVE_SERIALIZATION_RFC8785_COMPATIBLE_v1';

export const H_EARTH_CANONICAL_STATE_OBJECT_KEY_SORT_MODE =
  'UTF16_CODE_UNIT_ASCENDING';

export const H_EARTH_CANONICAL_STATE_OUTPUT_ENCODING =
  'UTF8';

export const H_EARTH_CANONICAL_STATE_DIGEST_ALGORITHM =
  'SHA-256';

export const H_EARTH_CANONICAL_STATE_SHA256_INPUT_TYPE =
  'UINT8ARRAY';

export const H_EARTH_CANONICAL_STATE_MAX_CANONICAL_UTF8_BYTES =
  16 * 1024 * 1024;

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_AUTHORITY =
  OBJECT_FREEZE({
    authorityId:
      'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_STEP_012I_AUTHORITY_BOUNDARY',

    file:
      '/h-earth-3d/runtime/h-earth.canonical-state-serialization-law.js',

    currentStep:
      'STEP_012I',

    contractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,

    canonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    priorVerifiedContractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    currentContractRoom:
      'ROOM_6_CANONICAL_STATE_SERIALIZATION_LAW_REVIEW',

    authorityClass:
      'STATIC_CANONICAL_SERIALIZATION_LAW_DEFINITION_ONLY',

    fileClass:
      'VERSIONED_CANONICAL_STATE_SERIALIZATION_LAW_AND_SUPPORT_ONLY',

    activeStatusCeiling:
      'STATIC_CANONICAL_SERIALIZATION_LAW_AND_SUPPORT_ONLY',

    ownModuleInitializationExecution:
      true,

    canonicalSerializationLawDefinedHere:
      true,

    canonicalSerializationSupportFunctionsDefinedHere:
      true,

    canonicalSerializationSupportFunctionsExecutedAtModuleLoad:
      false,

    referenceVectorsDefinedHere:
      true,

    referenceVectorsExecutedAtModuleLoad:
      false,

    referenceVectorsExecuted:
      false,

    target003MutationAuthorized:
      false,

    step012HMutationAuthorized:
      false,

    executionDriverAuthorized:
      false,

    importResolutionVerified:
      false,

    installedModuleEvaluationVerified:
      false,

    moduleGraphExecutionVerified:
      false,

    runtimeExecuted:
      false,

    runtimeStateCreated:
      false,

    intentAdmitted:
      false,

    tickCommitted:
      false,

    snapshotGeneratedAtModuleLoad:
      false,

    digestGeneratedAtModuleLoad:
      false,

    replayExecuted:
      false,

    replayComparisonCompleted:
      false,

    replayEqualityProven:
      false,

    persistenceActivated:
      false,

    rendererActivated:
      false,

    routeActivated:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false
  });

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_DESCRIPTOR =
  OBJECT_FREEZE({
    contractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,

    canonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    priorVerifiedContractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    file:
      '/h-earth-3d/runtime/h-earth.canonical-state-serialization-law.js',

    currentStep:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_AUTHORITY.currentStep,

    authority:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_AUTHORITY,

    createsNewFile:
      true,

    mutatesTarget003:
      false,

    mutatesStep012H:
      false,

    activeStatusCeiling:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_AUTHORITY.activeStatusCeiling,

    architecturalRole:
      'Define exact canonical representation, UTF-8 byte, and SHA-256 digest law used by later replay comparison and headless verification work without creating execution authority.',

    sourceStepOrder:
      OBJECT_FREEZE([
        'STEP_012G_TARGET_001_STATE_CLASSIFICATION',
        'STEP_012G_TARGET_002_DETERMINISTIC_RUNTIME',
        'STEP_012G_TARGET_003_CANONICAL_REPLAY',
        'STEP_012H_HEADLESS_REPLAY_TEST_SCAFFOLD',
        'STEP_012I_CANONICAL_STATE_SERIALIZATION_LAW'
      ]),

    logicalConsumptionOrder:
      'The serialization law may be consumed by replay and testing later even though it is being added procedurally after Target 003 and Step 012H.',

    permanentSeparation:
      OBJECT_FREEZE({
        canonicalSerialization:
          'STABLE_REPRESENTATION',

        deterministicRuntime:
          'STABLE_COMPUTATION',

        canonicalReplay:
          'RECONSTRUCTION_OF_GOVERNED_EXECUTION',

        headlessTesting:
          'OBSERVATION_AND_COMPARISON',

        digestEquality:
          'CANONICAL_BYTE_EQUALITY_EVIDENCE',

        digestEqualityIsLawfulExecutionProof:
          false
      }),

    target003Relationship:
      OBJECT_FREEZE({
        targetFile:
          '/h-earth-3d/runtime/h-earth.canonical-replay.js',

        targetContract:
          'H_EARTH_CANONICAL_REPLAY_FILE_RENEWAL_STEP_012G_TARGET_003_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

        relationship:
          'REPRESENTATION_LAW_FOR_FUTURE_REPLAY_COMPARISON',

        targetMutationAuthorizedHere:
          false,

        importRequiredHere:
          false,

        importResolutionProvenHere:
          false
      }),

    step012HRelationship:
      OBJECT_FREEZE({
        targetFile:
          '/h-earth-3d/runtime/tests/h-earth.headless-replay.contract.js',

        targetContract:
          'H_EARTH_HEADLESS_REPLAY_CONTRACT_FILE_RENEWAL_STEP_012H_TEST_SCAFFOLD_REVIEW_v1',

        relationship:
          'REPRESENTATION_LAW_FOR_FUTURE_HEADLESS_REPLAY_TEST_CHECKS',

        targetMutationAuthorizedHere:
          false,

        referenceVectorExecutionAuthorizedHere:
          false,

        headlessDriverAuthorizedHere:
          false
      })
  });

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_INVARIANTS =
  OBJECT_FREEZE({
    semanticEquivalenceRule:
      'SEMANTICALLY_EQUIVALENT_ADMISSIBLE_STATES_PRODUCE_SAME_CANONICAL_UTF8_BYTE_SEQUENCE_REGARDLESS_OF_OBJECT_PROPERTY_INSERTION_ORDER',

    objectInsertionOrderIsNonauthoritative:
      true,

    objectKeysSortedRecursively:
      true,

    objectKeySortMode:
      H_EARTH_CANONICAL_STATE_OBJECT_KEY_SORT_MODE,

    objectKeySortLocaleDependent:
      false,

    localeCompareUsed:
      false,

    objectEnumerableStringPropertiesOnly:
      true,

    nonEnumerableObjectPropertiesRejected:
      true,

    hiddenObjectStateSilentlyIgnored:
      false,

    arrayOrderPreserved:
      true,

    arraySortingProhibited:
      true,

    sparseArraysRejected:
      true,

    symbolKeyedArrayPropertiesRejected:
      true,

    nonIndexArrayPropertiesRejected:
      true,

    hiddenArrayStateSilentlyIgnored:
      false,

    undefinedRejected:
      true,

    nonfiniteNumbersRejected:
      true,

    negativeZeroSerializedAsZero:
      true,

    bigintRejected:
      true,

    symbolValuesRejected:
      true,

    functionValuesRejected:
      true,

    nonPlainObjectsRejected:
      true,

    circularReferencesRejected:
      true,

    loneSurrogatesRejected:
      true,

    accessorPropertiesRejected:
      true,

    gettersExecuted:
      false,

    settersExecuted:
      false,

    symbolKeyedObjectPropertiesRejected:
      true,

    ownToJSONPropertyRejected:
      true,

    toJSONInvocationProhibited:
      true,

    plainObjectPrototypesAllowed:
      'OBJECT_PROTOTYPE_ONLY',

    objectPrototypeAdmitted:
      true,

    nullPrototypeAdmitted:
      false,

    customPrototypeAdmitted:
      false,

    whitespaceEmitted:
      false,

    outputEncoding:
      H_EARTH_CANONICAL_STATE_OUTPUT_ENCODING,

    digestAlgorithm:
      H_EARTH_CANONICAL_STATE_DIGEST_ALGORITHM,

    sha256InputType:
      H_EARTH_CANONICAL_STATE_SHA256_INPUT_TYPE,

    sha256ArbitraryArrayLikeInputRejected:
      true,

    sha256ByteCoercion:
      false,

    inputMutation:
      false,

    snapshotEvidenceImmutable:
      true,

    digestCorrespondsToStoredSnapshot:
      true,

    unicodeNormalization:
      'NONE',

    primitiveSerializationProfile:
      H_EARTH_CANONICAL_STATE_PRIMITIVE_SERIALIZATION_PROFILE,

    boundedInputByteSize:
      true,

    maxCanonicalUtf8Bytes:
      H_EARTH_CANONICAL_STATE_MAX_CANONICAL_UTF8_BYTES
  });

export const H_EARTH_CANONICAL_DOMAIN_ORDERING_BOUNDARY =
  OBJECT_FREEZE({
    boundaryId:
      'H_EARTH_CANONICAL_DOMAIN_ORDERING_BOUNDARY_STEP_012I_v1',

    domainOrderMayBeSuppliedByUpstreamGovernedSource:
      true,

    serializationLayerRecomputesDomainOrder:
      false,

    serializationLayerReclassifiesDomainIdentities:
      false,

    serializationLayerPreservesAdmittedArrayOrder:
      true,

    serializationLayerInventsSpatialIdentity:
      false,

    serializationLayerReordersOrderedIntentIds:
      false,

    serializationLayerOverridesCanonicalKeySort:
      false,

    byteLaw:
      OBJECT_FREEZE({
        objectKeys:
          'UTF16_CODE_UNIT_SORTED',

        arrayOrder:
          'PRESERVED',

        text:
          'CANONICAL_JSON_NO_WHITESPACE',

        bytes:
          'UTF8',

        digest:
          'SHA256_OF_UTF8_BYTES'
      }),

    domainOrder:
      'UPSTREAM_GOVERNED_SOURCE_MAY_SUPPLY_ADMITTED_RECORD_ORDER_BEFORE_SERIALIZATION'
  });

export const H_EARTH_CANONICAL_STATE_ADMISSION_GATES =
  OBJECT_FREEZE([
    'STATE_SCHEMA_ADMISSIBLE',
    'CANONICAL_VALUE_DOMAIN_ADMISSIBLE',
    'CANONICAL_SERIALIZATION_COMPLETE',
    'UTF8_ENCODING_COMPLETE',
    'DIGEST_GENERATED'
  ]);

export const H_EARTH_CANONICAL_STATE_NON_PROOF_BOUNDARIES =
  OBJECT_FREEZE({
    canonicalizationEstablishes:
      'REPRESENTATIONAL_ADMISSIBILITY_AND_BYTE_STABILITY',

    canonicalizationDoesNotProve:
      OBJECT_FREEZE([
        'DOMAIN_CORRECTNESS',
        'LAWFUL_RUNTIME_PRODUCTION',
        'ACTION_ADMISSIBILITY',
        'RECEIPT_VALIDITY',
        'STATE_TRANSITION_LEGITIMACY',
        'REPLAY_CORRECTNESS',
        'VALIDATION',
        'PRODUCTION_READINESS'
      ])
  });

export function compareHEarthCanonicalUtf16Keys(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function hasOwn(record, key) {
  return OBJECT_HAS_OWN.call(record, key);
}

function assertNoLoneSurrogates(text, path) {
  for (
    let index = 0;
    index < text.length;
    index += 1
  ) {
    const codeUnit =
      text.charCodeAt(index);

    if (
      codeUnit >= 0xd800 &&
      codeUnit <= 0xdbff
    ) {
      const next =
        text.charCodeAt(index + 1);

      if (
        NUMBER_IS_NAN(next) ||
        next < 0xdc00 ||
        next > 0xdfff
      ) {
        throw new TypeError(
          `LONE_HIGH_SURROGATE_REJECTED:${path}:${index}`
        );
      }

      index += 1;
      continue;
    }

    if (
      codeUnit >= 0xdc00 &&
      codeUnit <= 0xdfff
    ) {
      throw new TypeError(
        `LONE_LOW_SURROGATE_REJECTED:${path}:${index}`
      );
    }
  }
}

function assertFiniteNumber(value, path) {
  if (!NUMBER_IS_FINITE(value)) {
    throw new TypeError(
      `NONFINITE_NUMBER_REJECTED:${path}`
    );
  }
}

function assertDenseArray(value, path) {
  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    if (
      !hasOwn(
        value,
        index
      )
    ) {
      throw new TypeError(
        `SPARSE_ARRAY_ENTRY_REJECTED:${path}[${index}]`
      );
    }
  }
}

function assertCanonicalArrayOwnKeys(value, path) {
  if (
    OBJECT_GET_OWN_PROPERTY_SYMBOLS(value).length !== 0
  ) {
    throw new TypeError(
      `SYMBOL_KEYED_ARRAY_PROPERTIES_REJECTED:${path}`
    );
  }

  const allowedKeys =
    new Set(['length']);

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    allowedKeys.add(String(index));
  }

  for (const key of REFLECT_OWN_KEYS(value)) {
    if (
      typeof key === 'string' &&
      !allowedKeys.has(key)
    ) {
      throw new TypeError(
        `NON_INDEX_ARRAY_PROPERTY_REJECTED:${path}.${key}`
      );
    }
  }
}

function assertPlainObjectPrototype(value, path) {
  const prototype =
    OBJECT_GET_PROTOTYPE_OF(value);

  if (prototype === null) {
    throw new TypeError(
      `NULL_PROTOTYPE_OBJECT_REJECTED:${path}`
    );
  }

  if (prototype !== Object.prototype) {
    throw new TypeError(
      `NON_PLAIN_OBJECT_REJECTED:${path}`
    );
  }
}

function assertNoSymbolKeys(value, path) {
  if (
    OBJECT_GET_OWN_PROPERTY_SYMBOLS(value).length !== 0
  ) {
    throw new TypeError(
      `SYMBOL_KEYED_PROPERTIES_REJECTED:${path}`
    );
  }
}

function assertNoOwnToJSON(value, path) {
  if (
    hasOwn(
      value,
      'toJSON'
    )
  ) {
    throw new TypeError(
      `OWN_TOJSON_PROPERTY_REJECTED:${path}`
    );
  }
}

function assertCanonicalPlainObjectOwnKeys(value, path) {
  const enumerableKeys =
    new Set(OBJECT_KEYS(value));

  for (const key of REFLECT_OWN_KEYS(value)) {
    if (typeof key === 'symbol') {
      throw new TypeError(
        `SYMBOL_KEYED_PROPERTIES_REJECTED:${path}`
      );
    }

    if (!enumerableKeys.has(key)) {
      throw new TypeError(
        `NON_ENUMERABLE_OBJECT_PROPERTY_REJECTED:${path}.${key}`
      );
    }
  }
}

function getCanonicalDataProperty(record, key, path) {
  const descriptor =
    OBJECT_GET_OWN_PROPERTY_DESCRIPTOR(
      record,
      key
    );

  if (
    !descriptor ||
    !hasOwn(
      descriptor,
      'value'
    )
  ) {
    throw new TypeError(
      `ACCESSOR_PROPERTY_REJECTED:${path}.${String(key)}`
    );
  }

  return descriptor.value;
}

function getCanonicalArrayElement(record, index, path) {
  const descriptor =
    OBJECT_GET_OWN_PROPERTY_DESCRIPTOR(
      record,
      String(index)
    );

  if (
    !descriptor ||
    !hasOwn(
      descriptor,
      'value'
    )
  ) {
    throw new TypeError(
      `ACCESSOR_ARRAY_ENTRY_REJECTED:${path}[${index}]`
    );
  }

  return descriptor.value;
}

function canonicalSerializeString(value, path) {
  assertNoLoneSurrogates(value, path);
  return JSON_STRINGIFY(value);
}

function canonicalSerializeNumber(value, path) {
  assertFiniteNumber(value, path);

  if (Object.is(value, -0)) {
    return '0';
  }

  return JSON_STRINGIFY(value);
}

function canonicalSerializeArray(value, path, seen) {
  if (seen.has(value)) {
    throw new TypeError(
      `CIRCULAR_REFERENCE_REJECTED:${path}`
    );
  }

  assertDenseArray(value, path);
  assertCanonicalArrayOwnKeys(value, path);

  seen.add(value);

  const parts = [];

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    const child =
      getCanonicalArrayElement(
        value,
        index,
        path
      );

    parts.push(
      canonicalSerializeInternal(
        child,
        `${path}[${index}]`,
        seen
      )
    );
  }

  seen.delete(value);

  return `[${parts.join(',')}]`;
}

function canonicalSerializePlainObject(value, path, seen) {
  if (seen.has(value)) {
    throw new TypeError(
      `CIRCULAR_REFERENCE_REJECTED:${path}`
    );
  }

  assertPlainObjectPrototype(value, path);
  assertNoOwnToJSON(value, path);
  assertCanonicalPlainObjectOwnKeys(value, path);

  seen.add(value);

  const keys =
    OBJECT_KEYS(value)
      .sort(compareHEarthCanonicalUtf16Keys);

  const parts = [];

  for (const key of keys) {
    assertNoLoneSurrogates(key, `${path}.{key}`);

    const child =
      getCanonicalDataProperty(
        value,
        key,
        path
      );

    parts.push(
      `${canonicalSerializeString(key, `${path}.{key}`)}:${canonicalSerializeInternal(
        child,
        `${path}.${key}`,
        seen
      )}`
    );
  }

  seen.delete(value);

  return `{${parts.join(',')}}`;
}

function canonicalSerializeInternal(value, path, seen) {
  if (value === null) {
    return 'null';
  }

  const valueType =
    typeof value;

  if (valueType === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (valueType === 'string') {
    return canonicalSerializeString(value, path);
  }

  if (valueType === 'number') {
    return canonicalSerializeNumber(value, path);
  }

  if (valueType === 'undefined') {
    throw new TypeError(
      `UNDEFINED_REJECTED:${path}`
    );
  }

  if (valueType === 'bigint') {
    throw new TypeError(
      `BIGINT_REJECTED:${path}`
    );
  }

  if (valueType === 'symbol') {
    throw new TypeError(
      `SYMBOL_VALUE_REJECTED:${path}`
    );
  }

  if (valueType === 'function') {
    throw new TypeError(
      `FUNCTION_VALUE_REJECTED:${path}`
    );
  }

  if (Array.isArray(value)) {
    return canonicalSerializeArray(
      value,
      path,
      seen
    );
  }

  if (valueType === 'object') {
    return canonicalSerializePlainObject(
      value,
      path,
      seen
    );
  }

  throw new TypeError(
    `UNSUPPORTED_CANONICAL_VALUE_TYPE_REJECTED:${path}:${valueType}`
  );
}

function deepFreezeCanonicalValue(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    OBJECT_IS_FROZEN(value)
  ) {
    return value;
  }

  for (const key of OBJECT_KEYS(value)) {
    deepFreezeCanonicalValue(value[key]);
  }

  return OBJECT_FREEZE(value);
}

function canonicalCloneAndDeepFreeze(value) {
  const canonicalText =
    canonicalizeHEarthStateValue(value);

  const clone =
    JSON_PARSE(canonicalText);

  return deepFreezeCanonicalValue(clone);
}

export function canonicalizeHEarthStateValue(value) {
  return canonicalSerializeInternal(
    value,
    '$',
    new WeakSet()
  );
}

export function encodeHEarthCanonicalUtf8Bytes(canonicalText) {
  if (typeof canonicalText !== 'string') {
    throw new TypeError(
      'CANONICAL_TEXT_STRING_REQUIRED'
    );
  }

  assertNoLoneSurrogates(
    canonicalText,
    '$canonicalText'
  );

  if (TEXT_ENCODER_CONSTRUCTOR === undefined) {
    throw new TypeError(
      'TEXT_ENCODER_UNAVAILABLE'
    );
  }

  const bytes =
    new TEXT_ENCODER_CONSTRUCTOR()
      .encode(canonicalText);

  if (
    bytes.length >
    H_EARTH_CANONICAL_STATE_MAX_CANONICAL_UTF8_BYTES
  ) {
    throw new TypeError(
      'CANONICAL_UTF8_BYTE_LENGTH_LIMIT_EXCEEDED'
    );
  }

  return bytes;
}

function rightRotate(value, amount) {
  return (
    (value >>> amount) |
    (value << (32 - amount))
  );
}

function assertUint8Array(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError(
      'SHA256_UINT8ARRAY_REQUIRED'
    );
  }

  if (
    bytes.length >
    H_EARTH_CANONICAL_STATE_MAX_CANONICAL_UTF8_BYTES
  ) {
    throw new TypeError(
      'SHA256_BYTE_LENGTH_LIMIT_EXCEEDED'
    );
  }
}

export function sha256HEarthCanonicalBytes(bytes) {
  assertUint8Array(bytes);

  const maxWord =
    2 ** 32;

  const words = [];
  const hash = [];
  const constants = [];
  const isComposite = {};

  let primeCounter = 0;

  for (
    let candidate = 2;
    primeCounter < 64;
    candidate += 1
  ) {
    if (!isComposite[candidate]) {
      for (
        let multiple = candidate * candidate;
        multiple < 313;
        multiple += candidate
      ) {
        isComposite[multiple] = true;
      }

      hash[primeCounter] =
        (
          candidate ** 0.5 *
          maxWord
        ) | 0;

      constants[primeCounter] =
        (
          candidate ** (1 / 3) *
          maxWord
        ) | 0;

      primeCounter += 1;
    }
  }

  const messageBytes =
    Array.from(bytes);

  const bitLength =
    messageBytes.length * 8;

  messageBytes.push(0x80);

  while (
    messageBytes.length % 64 !== 56
  ) {
    messageBytes.push(0);
  }

  for (
    let index = 0;
    index < messageBytes.length;
    index += 1
  ) {
    words[index >> 2] =
      words[index >> 2] || 0;

    words[index >> 2] |=
      messageBytes[index] <<
      (
        (3 - index) % 4
      ) * 8;
  }

  words.push(
    Math.floor(
      bitLength / maxWord
    )
  );

  words.push(
    bitLength >>> 0
  );

  for (
    let block = 0;
    block < words.length;
    block += 16
  ) {
    const schedule =
      words.slice(
        block,
        block + 16
      );

    const oldHash =
      hash.slice(0);

    for (
      let round = 0;
      round < 64;
      round += 1
    ) {
      const w15 =
        schedule[round - 15];

      const w2 =
        schedule[round - 2];

      if (round >= 16) {
        const s0 =
          rightRotate(w15, 7) ^
          rightRotate(w15, 18) ^
          (w15 >>> 3);

        const s1 =
          rightRotate(w2, 17) ^
          rightRotate(w2, 19) ^
          (w2 >>> 10);

        schedule[round] =
          (
            schedule[round - 16] +
            s0 +
            schedule[round - 7] +
            s1
          ) | 0;
      }

      const a =
        hash[0];

      const e =
        hash[4];

      const sigma1 =
        rightRotate(e, 6) ^
        rightRotate(e, 11) ^
        rightRotate(e, 25);

      const choose =
        (e & hash[5]) ^
        (~e & hash[6]);

      const temp1 =
        (
          hash[7] +
          sigma1 +
          choose +
          constants[round] +
          schedule[round]
        ) | 0;

      const sigma0 =
        rightRotate(a, 2) ^
        rightRotate(a, 13) ^
        rightRotate(a, 22);

      const majority =
        (a & hash[1]) ^
        (a & hash[2]) ^
        (hash[1] & hash[2]);

      const temp2 =
        (
          sigma0 +
          majority
        ) | 0;

      hash[7] =
        hash[6];

      hash[6] =
        hash[5];

      hash[5] =
        hash[4];

      hash[4] =
        (
          hash[3] +
          temp1
        ) | 0;

      hash[3] =
        hash[2];

      hash[2] =
        hash[1];

      hash[1] =
        hash[0];

      hash[0] =
        (
          temp1 +
          temp2
        ) | 0;
    }

    for (
      let index = 0;
      index < 8;
      index += 1
    ) {
      hash[index] =
        (
          hash[index] +
          oldHash[index]
        ) | 0;
    }
  }

  return hash
    .slice(0, 8)
    .map(
      (value) =>
        (value >>> 0)
          .toString(16)
          .padStart(8, '0')
    )
    .join('');
}

export function sha256HEarthCanonicalText(canonicalText) {
  return sha256HEarthCanonicalBytes(
    encodeHEarthCanonicalUtf8Bytes(
      canonicalText
    )
  );
}

export function createHEarthCanonicalStateEvidenceRecord(value) {
  const canonicalText =
    canonicalizeHEarthStateValue(value);

  const canonicalUtf8Bytes =
    encodeHEarthCanonicalUtf8Bytes(
      canonicalText
    );

  const digestHex =
    sha256HEarthCanonicalBytes(
      canonicalUtf8Bytes
    );

  return OBJECT_FREEZE({
    canonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    primitiveSerializationProfile:
      H_EARTH_CANONICAL_STATE_PRIMITIVE_SERIALIZATION_PROFILE,

    canonicalText,

    canonicalTextLength:
      canonicalText.length,

    canonicalUtf8ByteLength:
      canonicalUtf8Bytes.length,

    digestAlgorithm:
      H_EARTH_CANONICAL_STATE_DIGEST_ALGORITHM,

    digestHex,

    generatedByFunctionCall:
      true,

    generatedAtModuleLoad:
      false,

    lawfulRuntimeProductionProof:
      false,

    replayEqualityProof:
      false,

    validationClaim:
      false
  });
}

function evidenceRecordMatchesThisLaw(record) {
  return Boolean(record) &&
    record.canonicalizationId ===
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID &&
    record.primitiveSerializationProfile ===
      H_EARTH_CANONICAL_STATE_PRIMITIVE_SERIALIZATION_PROFILE &&
    record.digestAlgorithm ===
      H_EARTH_CANONICAL_STATE_DIGEST_ALGORITHM;
}

export function compareHEarthCanonicalStateEvidenceRecords(
  first,
  second
) {
  if (!first || typeof first !== 'object') {
    throw new TypeError(
      'FIRST_CANONICAL_EVIDENCE_RECORD_REQUIRED'
    );
  }

  if (!second || typeof second !== 'object') {
    throw new TypeError(
      'SECOND_CANONICAL_EVIDENCE_RECORD_REQUIRED'
    );
  }

  const firstProfileMatchesLaw =
    evidenceRecordMatchesThisLaw(first);

  const secondProfileMatchesLaw =
    evidenceRecordMatchesThisLaw(second);

  const canonicalizationIdEqual =
    first.canonicalizationId ===
    second.canonicalizationId;

  const primitiveSerializationProfileEqual =
    first.primitiveSerializationProfile ===
    second.primitiveSerializationProfile;

  const digestAlgorithmEqual =
    first.digestAlgorithm ===
    second.digestAlgorithm;

  const canonicalTextEqual =
    first.canonicalText === second.canonicalText;

  const canonicalUtf8ByteLengthEqual =
    first.canonicalUtf8ByteLength ===
    second.canonicalUtf8ByteLength;

  const digestEqual =
    first.digestHex === second.digestHex;

  const canonicalEvidenceEqual =
    firstProfileMatchesLaw &&
    secondProfileMatchesLaw &&
    canonicalizationIdEqual &&
    primitiveSerializationProfileEqual &&
    digestAlgorithmEqual &&
    canonicalTextEqual &&
    canonicalUtf8ByteLengthEqual &&
    digestEqual;

  return OBJECT_FREEZE({
    canonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    firstProfileMatchesLaw,

    secondProfileMatchesLaw,

    canonicalizationIdEqual,

    primitiveSerializationProfileEqual,

    digestAlgorithmEqual,

    canonicalTextEqual,

    canonicalUtf8ByteLengthEqual,

    digestEqual,

    canonicalEvidenceEqual,

    matchingSha256Digests:
      digestEqual,

    digestEqualityMeaning:
      'CRYPTOGRAPHIC_CANONICAL_BYTE_EQUALITY_EVIDENCE',

    lawfulStateProductionProof:
      false,

    replayEqualityProof:
      false,

    validationClaim:
      false
  });
}

function assertRequiredStringField(record, key, path) {
  const value =
    getCanonicalDataProperty(
      record,
      key,
      path
    );

  if (
    typeof value !== 'string' ||
    value.length === 0
  ) {
    throw new TypeError(
      `REQUIRED_STRING_FIELD_REJECTED:${path}.${key}`
    );
  }

  assertNoLoneSurrogates(
    value,
    `${path}.${key}`
  );

  return value;
}

function assertRequiredNumberField(record, key, path) {
  const value =
    getCanonicalDataProperty(
      record,
      key,
      path
    );

  if (
    !NUMBER_IS_INTEGER(value) ||
    value < 0
  ) {
    throw new TypeError(
      `REQUIRED_NONNEGATIVE_INTEGER_FIELD_REJECTED:${path}.${key}`
    );
  }

  return value;
}

function assertOrderedIntentIds(value, path) {
  if (!Array.isArray(value)) {
    throw new TypeError(
      `ORDERED_INTENT_IDS_ARRAY_REQUIRED:${path}`
    );
  }

  assertDenseArray(value, path);
  assertCanonicalArrayOwnKeys(value, path);

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    const intentId =
      getCanonicalArrayElement(
        value,
        index,
        path
      );

    if (
      typeof intentId !== 'string' ||
      intentId.length === 0
    ) {
      throw new TypeError(
        `ORDERED_INTENT_ID_NONEMPTY_STRING_REQUIRED:${path}[${index}]`
      );
    }

    assertNoLoneSurrogates(
      intentId,
      `${path}[${index}]`
    );
  }
}

function assertSnapshotEnvelopeInput(input) {
  if (
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input)
  ) {
    throw new TypeError(
      'SNAPSHOT_ENVELOPE_INPUT_OBJECT_REQUIRED'
    );
  }

  assertPlainObjectPrototype(input, '$snapshotInput');
  assertNoOwnToJSON(input, '$snapshotInput');
  assertCanonicalPlainObjectOwnKeys(input, '$snapshotInput');

  const requiredKeys = OBJECT_FREEZE([
    'canonicalizationId',
    'runtimeContractId',
    'replayContractId',
    'stateSchemaId',
    'worldUnitId',
    'initialStateId',
    'tick',
    'orderedIntentIds',
    'committedState'
  ]);

  for (const key of requiredKeys) {
    if (
      !hasOwn(
        input,
        key
      )
    ) {
      throw new TypeError(
        `SNAPSHOT_ENVELOPE_REQUIRED_FIELD_MISSING:${key}`
      );
    }
  }
}

export function createHEarthCanonicalSnapshotEnvelope(input) {
  assertSnapshotEnvelopeInput(input);

  const canonicalizationId =
    assertRequiredStringField(
      input,
      'canonicalizationId',
      '$snapshotInput'
    );

  if (
    canonicalizationId !==
    H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID
  ) {
    throw new TypeError(
      'SNAPSHOT_ENVELOPE_CANONICALIZATION_ID_MISMATCH'
    );
  }

  const runtimeContractId =
    assertRequiredStringField(
      input,
      'runtimeContractId',
      '$snapshotInput'
    );

  const replayContractId =
    assertRequiredStringField(
      input,
      'replayContractId',
      '$snapshotInput'
    );

  const stateSchemaId =
    assertRequiredStringField(
      input,
      'stateSchemaId',
      '$snapshotInput'
    );

  const worldUnitId =
    assertRequiredStringField(
      input,
      'worldUnitId',
      '$snapshotInput'
    );

  const initialStateId =
    assertRequiredStringField(
      input,
      'initialStateId',
      '$snapshotInput'
    );

  const tick =
    assertRequiredNumberField(
      input,
      'tick',
      '$snapshotInput'
    );

  const orderedIntentIds =
    getCanonicalDataProperty(
      input,
      'orderedIntentIds',
      '$snapshotInput'
    );

  assertOrderedIntentIds(
    orderedIntentIds,
    '$snapshotInput.orderedIntentIds'
  );

  const committedState =
    getCanonicalDataProperty(
      input,
      'committedState',
      '$snapshotInput'
    );

  const frozenOrderedIntentIds =
    canonicalCloneAndDeepFreeze(
      orderedIntentIds
    );

  const frozenCommittedState =
    canonicalCloneAndDeepFreeze(
      committedState
    );

  return deepFreezeCanonicalValue({
    canonicalizationId,
    runtimeContractId,
    replayContractId,
    stateSchemaId,
    worldUnitId,
    initialStateId,
    tick,

    orderedIntentIds:
      frozenOrderedIntentIds,

    committedState:
      frozenCommittedState,

    envelopeLaw:
      'SOURCE_BOUND_IDENTITIES_REQUIRED',

    identifiersInventedBySerializationLayer:
      false,

    orderedIntentIdsOrderPreserved:
      true,

    orderedIntentIdsReorderedBySerializationLayer:
      false,

    committedStateCanonicalDomainAdmissible:
      true,

    snapshotEnvelopeCanonicalCloneAndDeepFreeze:
      true
  });
}

export function createHEarthCanonicalSnapshotRecord(snapshotEnvelope) {
  const frozenSnapshotEnvelope =
    canonicalCloneAndDeepFreeze(
      snapshotEnvelope
    );

  const evidence =
    createHEarthCanonicalStateEvidenceRecord(
      frozenSnapshotEnvelope
    );

  return deepFreezeCanonicalValue({
    snapshot:
      frozenSnapshotEnvelope,

    digest:
      {
        algorithm:
          H_EARTH_CANONICAL_STATE_DIGEST_ALGORITHM,

        value:
          evidence.digestHex
      },

    evidence,

    digestInsideHashedSnapshotObject:
      false,

    snapshotStoredAsCanonicalClone:
      true,

    digestCorrespondsToStoredSnapshot:
      true,

    lawfulRuntimeProductionProof:
      false,

    replayEqualityProof:
      false,

    validationClaim:
      false
  });
}

export const H_EARTH_CANONICAL_REPLAY_EQUALITY_CANDIDATE_PREDICATE =
  OBJECT_FREEZE({
    predicateId:
      'H_EARTH_REPLAY_EQUALITY_CANDIDATE_PREDICATE_STEP_012I_v1',

    candidateOnly:
      true,

    requiredConditions:
      OBJECT_FREEZE([
        'ORIGINAL_STATE_SCHEMA_ADMISSIBLE',
        'REPLAYED_STATE_SCHEMA_ADMISSIBLE',
        'ORIGINAL_CANONICAL_DOMAIN_ADMISSIBLE',
        'REPLAYED_CANONICAL_DOMAIN_ADMISSIBLE',
        'SAME_CANONICALIZATION_ID',
        'SAME_VERSION_ENVELOPE',
        'SAME_INITIAL_STATE_ID',
        'SAME_ORDERED_INTENT_SEQUENCE',
        'SAME_RUNTIME_CONTRACT_ID',
        'ADMISSIBLE_EXECUTION_RECEIPTS',
        'CANONICAL_DIGEST_EQUAL'
      ]),

    evenIfAllConditionsObserved:
      'FINAL_RECEIPT_MUST_STATE_EXACTLY_WHAT_WAS_COMPARED_AND_UNDER_WHICH_CONTRACTS',

    validationClaim:
      false,

    lawfulExecutionProofClaim:
      false,

    productionClaim:
      false
  });

export const H_EARTH_CANONICAL_STATE_REFERENCE_VECTORS =
  deepFreezeCanonicalValue({
    vectorSetId:
      'H_EARTH_CANONICAL_STATE_SERIALIZATION_REFERENCE_VECTORS_STEP_012I_v1',

    vectorsExecutedHere:
      false,

    vectorsExecutedAtModuleLoad:
      false,

    positiveVectors:
      [
        {
          vectorId:
            'PROPERTY_ORDER_EQUIVALENCE_A',

          input:
            {
              b: 2,
              a: 1
            },

          expectedCanonicalText:
            '{"a":1,"b":2}'
        },

        {
          vectorId:
            'PROPERTY_ORDER_EQUIVALENCE_B',

          input:
            {
              a: 1,
              b: 2
            },

          expectedCanonicalText:
            '{"a":1,"b":2}'
        },

        {
          vectorId:
            'RECURSIVE_OBJECT_SORTING',

          input:
            {
              z: {
                y: 2,
                x: 1
              },
              a: true
            },

          expectedCanonicalText:
            '{"a":true,"z":{"x":1,"y":2}}'
        },

        {
          vectorId:
            'ARRAY_ORDER_PRESERVATION',

          input:
            {
              actions: [
                {
                  tick: 2,
                  id: 'B'
                },
                {
                  id: 'A',
                  tick: 1
                }
              ]
            },

          expectedCanonicalText:
            '{"actions":[{"id":"B","tick":2},{"id":"A","tick":1}]}'
        },

        {
          vectorId:
            'NEGATIVE_ZERO_SERIALIZES_AS_ZERO',

          input:
            {
              value: -0
            },

          expectedCanonicalText:
            '{"value":0}'
        },

        {
          vectorId:
            'UTF8_MULTIBYTE_LENGTH_EVIDENCE',

          input:
            {
              label: 'H-Earth π'
            },

          expectedCanonicalText:
            '{"label":"H-Earth π"}'
        }
      ],

    rejectionVectors:
      [
        'undefined',
        'NaN',
        'Infinity',
        '-Infinity',
        'BigInt',
        'Date',
        'Map',
        'Set',
        'typedArray',
        'customPrototype',
        'nullPrototypeUnderV1',
        'accessorProperty',
        'accessorArrayEntry',
        'symbolKeyedObjectProperty',
        'symbolKeyedArrayProperty',
        'nonIndexArrayProperty',
        'nonEnumerableObjectProperty',
        'ownToJSONProperty',
        'ownNonfunctionToJSONProperty',
        'sparseArray',
        'circularReference',
        'loneHighSurrogate',
        'loneLowSurrogate',
        'loneSurrogateInPropertyKey'
      ],

    behavioralVectors:
      [
        'snapshotCallerMutationDoesNotChangeStoredEvidence',
        'evidenceProfileMismatchRejected'
      ]
  });

export const H_EARTH_CANONICAL_STATE_DETERMINISM_BOUNDARY =
  OBJECT_FREEZE({
    canonicalSerialization:
      'STABLE_REPRESENTATION',

    deterministicRuntime:
      'STABLE_COMPUTATION',

    replayEquality:
      'OBSERVED_AGREEMENT_BETWEEN_GOVERNED_EXECUTIONS',

    serializationDoesNotGovern:
      OBJECT_FREEZE([
        'Date.now',
        'performance.now',
        'Math.random',
        'localeSensitiveFormatting',
        'unrecordedNetworkResponses',
        'deviceDerivedValues',
        'rendererDerivedState',
        'unorderedAsynchronousMutation',
        'unstableIterationOverExternalCollections',
        'floatingPointAccumulationOutsideGovernedProfile'
      ]),

    proxyInputs:
      'OUTSIDE_TRUSTED_CANONICAL_INPUT_BOUNDARY_UNLESS_GOVERNED_BY_CONTROLLED_EXECUTION_COMPARTMENT'
  });

export const H_EARTH_CANONICAL_STATE_ALLOWED_DESCRIPTOR_CLAIMS =
  OBJECT_FREEZE([
    'canonicalSerializationLawDescriptorRead',
    'canonicalValueDomainRulesDefined',
    'recursiveUtf16KeyOrderingDefined',
    'objectHiddenStateRejectionDefined',
    'arrayOrderPreservationDefined',
    'arrayHiddenStateRejectionDefined',
    'accessorPropertyRejectionDefined',
    'symbolKeyRejectionDefined',
    'ownToJSONRejectionDefined',
    'plainObjectPrototypePolicyDefined',
    'sparseArrayRejectionDefined',
    'circularReferenceRejectionDefined',
    'unicodeSurrogateRejectionDefined',
    'utf8GenerationSupportDefined',
    'sha256Uint8ArraySupportDefined',
    'canonicalEvidenceRecordSupportDefined',
    'evidenceProfileBindingDefined',
    'snapshotEnvelopeLawDefined',
    'snapshotCustodyCloneFreezeDefined',
    'domainOrderingBoundaryDefined',
    'referenceVectorsDefined',
    'claimGuardDefined'
  ]);

export const H_EARTH_CANONICAL_STATE_BLOCKED_CLAIMS =
  OBJECT_FREEZE([
    'REFERENCE_VECTORS_EXECUTED',
    'IMPORT_RESOLUTION_VERIFIED',
    'INSTALLED_MODULE_EVALUATION_VERIFIED',
    'MODULE_GRAPH_EXECUTION_VERIFIED',
    'RUNTIME_EXECUTED',
    'SNAPSHOT_GENERATED_AT_MODULE_LOAD',
    'DIGEST_GENERATED_AT_MODULE_LOAD',
    'REPLAY_EXECUTED',
    'REPLAY_COMPARISON_COMPLETED',
    'REPLAY_EQUALITY_PROVEN',
    'VALIDATION_CLAIM',
    'PRODUCTION_CLAIM',
    'DEPLOYMENT_CLAIM',
    'VISUAL_PASS_CLAIM',
    'MATRIX_COLLAPSE',
    'TARGET_003_MUTATION_AUTHORIZED',
    'STEP_012H_MUTATION_AUTHORIZED',
    'HEADLESS_DRIVER_AUTHORIZED'
  ]);

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_CLAIM_GUARD_MODEL =
  OBJECT_FREEZE({
    modelId:
      'H_EARTH_CANONICAL_STATE_SERIALIZATION_CLAIM_GUARD_MODEL_STEP_012I',

    securityProperty:
      'ALLOWLIST_WITH_UNKNOWN_REJECTION',

    allowedClaimListIsAuthoritative:
      true,

    blockedClaimListIsExplanatoryNotExhaustive:
      true,

    unknownClaimsRejectedIndependentlyOfBlockedList:
      true,

    allowedClaims:
      H_EARTH_CANONICAL_STATE_ALLOWED_DESCRIPTOR_CLAIMS,

    blockedClaims:
      H_EARTH_CANONICAL_STATE_BLOCKED_CLAIMS
  });

export function isHEarthCanonicalStateSerializationClaimAllowed(claimName) {
  if (!claimName || typeof claimName !== 'string') return false;

  const allowedClaims =
    new Set(H_EARTH_CANONICAL_STATE_ALLOWED_DESCRIPTOR_CLAIMS);

  return allowedClaims.has(claimName);
}

export function classifyHEarthCanonicalStateSerializationClaim(claimName) {
  if (!claimName || typeof claimName !== 'string') {
    return OBJECT_FREEZE({
      claimName,
      recognized:
        false,

      allowed:
        false,

      classification:
        'INVALID_CLAIM_NAME',

      failClosed:
        true
    });
  }

  const allowedClaims =
    new Set(H_EARTH_CANONICAL_STATE_ALLOWED_DESCRIPTOR_CLAIMS);

  const blockedClaims =
    new Set(H_EARTH_CANONICAL_STATE_BLOCKED_CLAIMS);

  if (allowedClaims.has(claimName)) {
    return OBJECT_FREEZE({
      claimName,

      recognized:
        true,

      allowed:
        true,

      classification:
        'ALLOW_STATIC_CANONICAL_SERIALIZATION_LAW_DESCRIPTOR_READ_ONLY',

      failClosed:
        true
    });
  }

  if (blockedClaims.has(claimName)) {
    return OBJECT_FREEZE({
      claimName,

      recognized:
        true,

      allowed:
        false,

      classification:
        'REJECTED_EXPLICITLY_BLOCKED_SERIALIZATION_EXECUTION_OR_PROOF_CLAIM',

      blockedClaimListIsExplanatoryNotExhaustive:
        true,

      failClosed:
        true
    });
  }

  return OBJECT_FREEZE({
    claimName,

    recognized:
      false,

    allowed:
      false,

    classification:
      'REJECTED_UNKNOWN_OR_UNAUTHORIZED_CANONICAL_SERIALIZATION_CLAIM',

    unknownClaimsRejectedIndependentlyOfBlockedList:
      true,

    failClosed:
      true
  });
}

export function getHEarthCanonicalStateSerializationAuthority() {
  return H_EARTH_CANONICAL_STATE_SERIALIZATION_AUTHORITY;
}

export function getHEarthCanonicalStateSerializationLawDescriptor() {
  return H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_DESCRIPTOR;
}

export function getHEarthCanonicalStateSerializationInvariants() {
  return H_EARTH_CANONICAL_STATE_SERIALIZATION_INVARIANTS;
}

export function getHEarthCanonicalDomainOrderingBoundary() {
  return H_EARTH_CANONICAL_DOMAIN_ORDERING_BOUNDARY;
}

export function getHEarthCanonicalStateReferenceVectors() {
  return H_EARTH_CANONICAL_STATE_REFERENCE_VECTORS;
}

export function getHEarthCanonicalStateSerializationClaimGuardModel() {
  return H_EARTH_CANONICAL_STATE_SERIALIZATION_CLAIM_GUARD_MODEL;
}

export function getHEarthCanonicalStateSerializationDescriptorReceipt() {
  return OBJECT_FREEZE({
    receiptType:
      'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_STEP_012I_DESCRIPTOR_RECEIPT',

    receiptId:
      'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_STEP_012I_STATIC_DESCRIPTOR_RECEIPT_v1',

    contractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,

    canonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    file:
      '/h-earth-3d/runtime/h-earth.canonical-state-serialization-law.js',

    currentStep:
      'STEP_012I',

    status:
      'STATIC_CANONICAL_SERIALIZATION_LAW_AND_SUPPORT_DEFINED',

    authorityBoundaryRecorded:
      true,

    invariantsRecorded:
      true,

    domainOrderingBoundaryRecorded:
      true,

    admissionGatesRecorded:
      true,

    referenceVectorsDefined:
      true,

    referenceVectorsExecuted:
      false,

    supportFunctionsDefinedHere:
      true,

    supportFunctionsExecutedAtModuleLoad:
      false,

    objectHiddenStateRejectionDefined:
      true,

    snapshotCustodyCloneFreezeDefined:
      true,

    arrayHiddenStateRejectionDefined:
      true,

    sha256Uint8ArrayInputDefined:
      true,

    orderedIntentIdsFullValidationDefined:
      true,

    evidenceComparisonProfileBindingDefined:
      true,

    target003MutationAuthorized:
      false,

    step012HMutationAuthorized:
      false,

    executionDriverAuthorized:
      false,

    importResolutionVerified:
      false,

    installedModuleEvaluationVerified:
      false,

    moduleGraphExecutionVerified:
      false,

    runtimeExecuted:
      false,

    snapshotGeneratedAtModuleLoad:
      false,

    digestGeneratedAtModuleLoad:
      false,

    replayExecuted:
      false,

    replayComparisonCompleted:
      false,

    replayEqualityProven:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false,

    finalMarker:
      'export default H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW;'
  });
}

export function getHEarthCanonicalStateSerializationReceipt() {
  return getHEarthCanonicalStateSerializationDescriptorReceipt();
}

export const H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW =
  OBJECT_FREEZE({
    id:
      'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW',

    file:
      '/h-earth-3d/runtime/h-earth.canonical-state-serialization-law.js',

    contractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,

    canonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    authority:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_AUTHORITY,

    descriptor:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_DESCRIPTOR,

    invariants:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_INVARIANTS,

    domainOrderingBoundary:
      H_EARTH_CANONICAL_DOMAIN_ORDERING_BOUNDARY,

    admissionGates:
      H_EARTH_CANONICAL_STATE_ADMISSION_GATES,

    nonProofBoundaries:
      H_EARTH_CANONICAL_STATE_NON_PROOF_BOUNDARIES,

    replayEqualityCandidatePredicate:
      H_EARTH_CANONICAL_REPLAY_EQUALITY_CANDIDATE_PREDICATE,

    referenceVectors:
      H_EARTH_CANONICAL_STATE_REFERENCE_VECTORS,

    determinismBoundary:
      H_EARTH_CANONICAL_STATE_DETERMINISM_BOUNDARY,

    claimGuardModel:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_CLAIM_GUARD_MODEL,

    compareUtf16Keys:
      compareHEarthCanonicalUtf16Keys,

    canonicalize:
      canonicalizeHEarthStateValue,

    encodeUtf8:
      encodeHEarthCanonicalUtf8Bytes,

    sha256Bytes:
      sha256HEarthCanonicalBytes,

    sha256Text:
      sha256HEarthCanonicalText,

    createEvidenceRecord:
      createHEarthCanonicalStateEvidenceRecord,

    compareEvidenceRecords:
      compareHEarthCanonicalStateEvidenceRecords,

    createSnapshotEnvelope:
      createHEarthCanonicalSnapshotEnvelope,

    createSnapshotRecord:
      createHEarthCanonicalSnapshotRecord,

    mode:
      'STATIC_CANONICAL_SERIALIZATION_LAW_AND_SUPPORT_ONLY',

    fileClass:
      'VERSIONED_CANONICAL_STATE_SERIALIZATION_LAW_AND_SUPPORT_ONLY',

    supportFunctionsDefinedHere:
      true,

    supportFunctionsExecutedAtModuleLoad:
      false,

    referenceVectorsDefined:
      true,

    referenceVectorsExecuted:
      false,

    target003MutationAuthorized:
      false,

    step012HMutationAuthorized:
      false,

    executionDriverAuthorized:
      false,

    importResolutionVerified:
      false,

    installedModuleEvaluationVerified:
      false,

    moduleGraphExecutionVerified:
      false,

    runtimeExecuted:
      false,

    snapshotGeneratedAtModuleLoad:
      false,

    digestGeneratedAtModuleLoad:
      false,

    replayExecuted:
      false,

    replayComparisonCompleted:
      false,

    replayEqualityProven:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false,

    finalMarker:
      'export default H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW;'
  });

export default H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW;
