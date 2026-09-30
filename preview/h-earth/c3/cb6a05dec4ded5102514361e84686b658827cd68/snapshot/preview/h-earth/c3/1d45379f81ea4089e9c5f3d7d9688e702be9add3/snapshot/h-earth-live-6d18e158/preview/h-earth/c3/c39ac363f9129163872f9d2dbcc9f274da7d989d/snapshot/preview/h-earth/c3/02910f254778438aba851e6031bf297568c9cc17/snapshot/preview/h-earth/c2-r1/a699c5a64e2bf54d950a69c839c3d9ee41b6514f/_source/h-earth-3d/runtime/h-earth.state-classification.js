/**
 * /h-earth-3d/runtime/h-earth.state-classification.js
 * COMPLETE RENEWED FILE
 * H_EARTH_STATE_CLASSIFICATION_FILE_RENEWAL_STEP_012G_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1
 *
 * Renews existing file in place:
 * /h-earth-3d/runtime/h-earth.state-classification.js
 *
 * Prior known or reported contract:
 * H_EARTH_STATE_CLASSIFICATION_RUNTIME_CONTRACT_v1
 *
 * Prior contract verification posture:
 * priorVerifiedContractId = null
 * priorContractIdVerified = false
 *
 * Step:
 * STEP_012G_TARGET_001_STATE_CLASSIFICATION_RUNTIME_KERNEL_DEPENDENCY_REVIEW
 *
 * Source family:
 * H-Earth 3D Scratch Domain
 *
 * Current active backed chain end before this renewal:
 * STEP_012F_PREFLIGHT_LANES
 *
 * Purpose:
 * Renew the existing state-classification runtime support file into a
 * Step 012G runtime-kernel dependency review target while preserving
 * compatibility with the backed Step 012D state bridge.
 *
 * This file defines:
 * - state-classification vocabulary;
 * - hash policy vocabulary;
 * - persistence policy vocabulary;
 * - null and undefined policy vocabulary;
 * - Step 012D-compatible ordering policy vocabulary;
 * - Step 012D-compatible version-sensitivity vocabulary;
 * - Step 012D-compatible failure-disposition vocabulary;
 * - required field sets by state class;
 * - fail-closed field declaration validation;
 * - fail-closed schema validation;
 * - static Step 012D compatibility receipt;
 * - static boundary and dependency posture;
 * - descriptor receipt for this runtime-kernel dependency target.
 *
 * This file does not import neighboring source modules.
 * This file does not execute neighboring source modules.
 * This file does not prove Step 012D import resolution.
 * This file does not prove installed module evaluation.
 * This file does not prove module graph execution.
 * This file does not construct an executable harness.
 * This file does not run a harness.
 * This file does not execute tests.
 * This file does not activate runtime.
 * This file does not admit intent.
 * This file does not commit ticks.
 * This file does not execute Inspect Ground.
 * This file does not execute Ground Condition Read.
 * This file does not generate or persist a receipt occurrence.
 * This file does not activate renderer.
 * This file does not activate route.
 * This file does not validate.
 * This file does not produce a visual pass.
 * This file does not collapse the matrix.
 *
 * Own JavaScript module initialization:
 * If imported, this module evaluates its own constants, Object.freeze(...)
 * descriptors, validators, claim guards, getter functions, descriptor receipt
 * helper, and aggregate export. Own module initialization is not runtime
 * activation, not module graph proof, not neighboring-source execution, not
 * harness execution, not test execution, and not validation.
 *
 * Step 012D relationship:
 * /h-earth-3d/h-earth.state.js imports this file as a direct runtime-kernel
 * support dependency and passes H_EARTH_STATE_FIELD_DECLARATIONS into
 * validateHEarthStateSchema(...). This renewal preserves the policy vocabulary
 * used by that backed Step 012D state bridge.
 *
 * Step 012F relationship:
 * /h-earth-3d/h-earth.preflight-lanes.js identifies this file as a required
 * runtime-kernel dependency review target before executable preflight may be
 * considered. This file does not authorize executable preflight.
 *
 * Boundary:
 * Static runtime state-classification review only.
 */

export const H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID =
  'H_EARTH_STATE_CLASSIFICATION_FILE_RENEWAL_STEP_012G_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1';

export const H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID =
  null;

export const H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED =
  false;

export const H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID =
  'H_EARTH_STATE_CLASSIFICATION_RUNTIME_CONTRACT_v1';

export const H_EARTH_STATE_CLASSIFICATION_AUTHORITY = Object.freeze({
  authorityId:
    'H_EARTH_STATE_CLASSIFICATION_STEP_012G_AUTHORITY_BOUNDARY',

  file:
    '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/runtime/h-earth.state-classification.js',

  currentStep:
    'STEP_012G_TARGET_001',

  contractId:
    H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

  priorVerifiedContractId:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID,

  priorContractIdVerified:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED,

  priorKnownOrReportedContractId:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

  currentContractRoom:
    'ROOM_6_RUNTIME_KERNEL_DEPENDENCY_REVIEW',

  historicalFileClass:
    'STATE_CLASSIFICATION_RUNTIME_CONTRACT_CANDIDATE',

  authorityClass:
    'STATIC_RUNTIME_STATE_CLASSIFICATION_REVIEW_ONLY',

  fileClass:
    'RUNTIME_KERNEL_STATE_CLASSIFICATION_DESCRIPTOR_AND_VALIDATOR_ONLY',

  activeStatusCeiling:
    'STATIC_RUNTIME_STATE_CLASSIFICATION_REVIEW_ONLY',

  ownModuleInitializationExecution:
    true,

  staticClassificationVocabularyConstructedHere:
    true,

  staticValidatorFunctionsDefinedHere:
    true,

  step012DCompatibilityVocabularyRecorded:
    true,

  neighboringSourceModuleImport:
    false,

  neighboringSourceModuleExecution:
    false,

  importResolutionProof:
    false,

  runtimeDependencyResolutionProof:
    false,

  installedModuleEvaluationProof:
    false,

  moduleGraphExecutionProof:
    false,

  executableHarnessConstructedHere:
    false,

  executableHarnessLogicExecution:
    false,

  harnessExecutedHere:
    false,

  testExecutedHere:
    false,

  preflightExecutedHere:
    false,

  liveRuntimeActivated:
    false,

  runtimeCreated:
    false,

  intentAdmitted:
    false,

  tickCommitted:
    false,

  actionExecuted:
    false,

  readoutExecuted:
    false,

  observationAcquired:
    false,

  receiptOccurrenceGenerated:
    false,

  receiptPersisted:
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

export const H_EARTH_STATE_CLASSIFICATION_CONTRACT = Object.freeze({
  contractId:
    H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

  priorVerifiedContractId:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID,

  priorContractIdVerified:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED,

  priorKnownOrReportedContractId:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

  file:
    '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/runtime/h-earth.state-classification.js',

  currentStep:
    H_EARTH_STATE_CLASSIFICATION_AUTHORITY.currentStep,

  authority:
    H_EARTH_STATE_CLASSIFICATION_AUTHORITY,

  renewsExistingFileInPlace:
    true,

  createsNewFile:
    false,

  activeStatusCeiling:
    H_EARTH_STATE_CLASSIFICATION_AUTHORITY.activeStatusCeiling,

  renewalPurpose:
    'Renew the existing state-classification runtime support file into the Step 012G runtime-kernel dependency review chain while preserving static descriptor/validator-only authority, fail-closed schema behavior, and compatibility with the backed Step 012D state bridge declarations.',

  compatibilityCorrection:
    'This renewal preserves the orderingPolicy, versionSensitivity, and failureDisposition vocabulary used by the backed Step 012D H_EARTH_STATE_FIELD_DECLARATIONS so Step 012D module-load schema validation is not broken by the classifier renewal.',

  step012DConsumerRelationship:
    Object.freeze({
      consumerFile:
        '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.state.js',
      consumerContract:
        'H_EARTH_STATE_FILE_RENEWAL_STEP_012D_MANIFEST_INTEGRITY_BOUNDARY_ALIGNED_STATE_BRIDGE_v1',
      relationship:
        'DIRECT_RUNTIME_KERNEL_SUPPORT_IMPORT_TARGET',
      validatesConsumerFieldDeclarations:
        true,
      importResolutionProvenHere:
        false,
      consumerModuleEvaluationProvenHere:
        false,
      installedImportCompatibilityVerified:
        false,
      moduleGraphExecutionVerified:
        false
    }),

  step012FGateRelationship:
    Object.freeze({
      gateFile:
        '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.preflight-lanes.js',
      gateContract:
        'H_EARTH_PREFLIGHT_LANES_FILE_BIRTH_STEP_012F_TEST_LANE_ENUMERATION_v1',
      relationship:
        'REQUIRED_RUNTIME_KERNEL_DEPENDENCY_REVIEW_TARGET',
      executablePreflightAuthorizedHere:
        false,
      harnessExecutionAuthorizedHere:
        false,
      testExecutionAuthorizedHere:
        false
    }),

  nextRuntimeKernelTarget:
    '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/runtime/h-earth.deterministic-runtime.js',

  nextRuntimeKernelTargetRenewalAuthorizedByThisFile:
    false
});

export const H_EARTH_STATE_CLASSIFICATION_BOUNDARY_FLAGS = Object.freeze({
  staticRuntimeStateClassificationReviewOnly:
    true,

  ownModuleInitializationExecution:
    true,

  staticClassificationVocabularyConstructedHere:
    true,

  staticValidatorFunctionsDefinedHere:
    true,

  step012DCompatibilityVocabularyRecorded:
    true,

  neighboringSourceModuleImport:
    false,

  neighboringSourceModuleExecution:
    false,

  importResolutionProof:
    false,

  exportResolutionProof:
    false,

  runtimeDependencyResolutionProof:
    false,

  installedModuleEvaluationProof:
    false,

  moduleGraphExecutionProof:
    false,

  path3Mutation:
    false,

  publicRouteFamilyMutation:
    false,

  downstreamDomainMutation:
    false,

  createsPath3Authority:
    false,

  createsMatrixAuthority:
    false,

  createsCellAuthority:
    false,

  createsZoneAuthority:
    false,

  createsObjectAuthority:
    false,

  createsActionAuthority:
    false,

  createsReadoutAuthority:
    false,

  createsReceiptAuthority:
    false,

  createsManifestAuthority:
    false,

  createsIntegrityAuthority:
    false,

  createsBoundaryLawAuthority:
    false,

  createsStateBridgeAuthority:
    false,

  createsHarnessAuthority:
    false,

  createsTestAuthority:
    false,

  createsRuntimeAuthority:
    false,

  createsRendererAuthority:
    false,

  createsRouteAuthority:
    false,

  createsValidationAuthority:
    false,

  createsProductionAuthority:
    false,

  createsDeploymentAuthority:
    false,

  liveRuntimeActivated:
    false,

  runtimeCreated:
    false,

  intentAdmitted:
    false,

  tickCommitted:
    false,

  actionExecuted:
    false,

  readoutExecuted:
    false,

  observationAcquired:
    false,

  receiptOccurrenceGenerated:
    false,

  receiptPersisted:
    false,

  rendererActivated:
    false,

  routeActivated:
    false,

  publicRouteIntegration:
    false,

  rendererMutationAuthority:
    false,

  geometryMutationAuthority:
    false,

  diagnosticMutationAuthority:
    false,

  asyncDirectMutationAuthority:
    false,

  gameplayActivation:
    false,

  traversalActivation:
    false,

  survivalActivation:
    false,

  validationClaim:
    false,

  preflightPassClaim:
    false,

  harnessPassClaim:
    false,

  testPassClaim:
    false,

  productionClaim:
    false,

  deploymentClaim:
    false,

  rendererPassClaim:
    false,

  visualPassClaim:
    false,

  matrixCollapse:
    false
});

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

export const H_EARTH_ORDERING_POLICIES = Object.freeze([
  'CANONICAL_PROPERTY_ORDER',
  'MONOTONIC_INTEGER_ORDER',
  'DECLARED_LIFECYCLE_ORDER',
  'BOOLEAN_FALSE_TO_TRUE_ONLY',
  'SIMULATION_TICK_THEN_MUTATION_ID',
  'COMMIT_SEQUENCE_ORDER',
  'REJECTION_SEQUENCE_ORDER',
  'NON_AUTHORITATIVE',

  'ORDERED_BY_SCHEMA',
  'ORDERED_BY_TICK',
  'ORDERED_BY_EVENT_SEQUENCE',
  'LEXICOGRAPHIC_CANONICAL',
  'NOT_ORDER_SENSITIVE'
]);

export const H_EARTH_VERSION_SENSITIVITY_POLICIES = Object.freeze([
  'WORLD_SCHEMA_VERSION_BOUND',
  'REGION_SPACE_VERSION_BOUND',
  'SIMULATION_LAW_VERSION_BOUND',
  'CELL_SCHEMA_VERSION_BOUND',
  'EVENT_SCHEMA_VERSION_BOUND',
  'DIAGNOSTIC_HARNESS_VERSION_BOUND',
  'RENDERER_VERSION_LOCAL',

  'VERSION_LOCKED',
  'VERSION_TOLERANT',
  'MIGRATION_REQUIRED',
  'DIAGNOSTIC_ONLY'
]);

export const H_EARTH_FAILURE_DISPOSITIONS = Object.freeze([
  'FAIL_CLOSED',

  'REJECT_DECLARATION',
  'REJECT_SCHEMA',
  'WARN_ONLY',
  'UNEVALUABLE',
  'DEFER_TO_BOUNDARY_REVIEW'
]);

export const H_EARTH_STATE_CLASSIFICATION_STEP_012D_COMPATIBILITY =
  Object.freeze({
    compatibilityId:
      'H_EARTH_STATE_CLASSIFICATION_STEP_012D_COMPATIBILITY',

    consumerFile:
      '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.state.js',

    consumerContractId:
      'H_EARTH_STATE_FILE_RENEWAL_STEP_012D_MANIFEST_INTEGRITY_BOUNDARY_ALIGNED_STATE_BRIDGE_v1',

    consumerFieldDeclarationSource:
      'H_EARTH_STATE_FIELD_DECLARATIONS',

    consumerValidationCall:
      'validateHEarthStateSchema(H_EARTH_STATE_FIELD_DECLARATIONS)',

    requiredOrderingPoliciesRecorded:
      true,

    requiredOrderingPolicies: Object.freeze([
      'CANONICAL_PROPERTY_ORDER',
      'MONOTONIC_INTEGER_ORDER',
      'DECLARED_LIFECYCLE_ORDER',
      'BOOLEAN_FALSE_TO_TRUE_ONLY',
      'SIMULATION_TICK_THEN_MUTATION_ID',
      'COMMIT_SEQUENCE_ORDER',
      'REJECTION_SEQUENCE_ORDER',
      'NON_AUTHORITATIVE'
    ]),

    requiredVersionSensitivityPoliciesRecorded:
      true,

    requiredVersionSensitivityPolicies: Object.freeze([
      'WORLD_SCHEMA_VERSION_BOUND',
      'REGION_SPACE_VERSION_BOUND',
      'SIMULATION_LAW_VERSION_BOUND',
      'CELL_SCHEMA_VERSION_BOUND',
      'EVENT_SCHEMA_VERSION_BOUND',
      'DIAGNOSTIC_HARNESS_VERSION_BOUND',
      'RENDERER_VERSION_LOCAL'
    ]),

    requiredFailureDispositionsRecorded:
      true,

    requiredFailureDispositions: Object.freeze([
      'FAIL_CLOSED'
    ]),

    compatibilityDefinedBySource:
      true,

    installedImportCompatibilityVerified:
      false,

    moduleGraphExecutionVerified:
      false,

    step012DModuleEvaluationVerifiedHere:
      false,

    liveRuntimeActivationCreatedHere:
      false
  });

export const H_EARTH_STATE_REQUIRED_COMMON_FIELDS = Object.freeze([
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

export const H_EARTH_STATE_REQUIRED_FIELDS_BY_CLASS = Object.freeze({
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

export const H_EARTH_STATE_FORBIDDEN_AUTHORITATIVE_HASH_CLASSES =
  Object.freeze([
    'EPHEMERAL_VISUAL',
    'DIAGNOSTIC_ONLY'
  ]);

const FORBIDDEN_AUTHORITATIVE_HASH_CLASS_SET =
  new Set(H_EARTH_STATE_FORBIDDEN_AUTHORITATIVE_HASH_CLASSES);

function hasOwn(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function isPlainRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function freezeRecord(record) {
  return Object.freeze({ ...record });
}

function freezeRecordArray(values) {
  return Object.freeze(values.map((value) => freezeRecord(value)));
}

function makeFailure(code, extra = {}) {
  return Object.freeze({
    code,
    ...extra
  });
}

function makeWarning(code, extra = {}) {
  return Object.freeze({
    code,
    ...extra
  });
}

function createRejectedDeclarationReceipt({
  status,
  failureCode,
  detail = {}
}) {
  return Object.freeze({
    ok:
      false,

    status,

    contractId:
      H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

    priorVerifiedContractId:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    fieldId:
      null,

    failures:
      Object.freeze([
        makeFailure(failureCode, detail)
      ]),

    warnings:
      Object.freeze([]),

    runtimeActivated:
      false,

    validationClaim:
      false
  });
}

export function validateHEarthFieldDeclaration(candidate) {
  const failures = [];
  const warnings = [];

  if (!isPlainRecord(candidate)) {
    return createRejectedDeclarationReceipt({
      status:
        'INVALID_DECLARATION',
      failureCode:
        'STATE_DECLARATION_NOT_OBJECT'
    });
  }

  for (const field of H_EARTH_STATE_REQUIRED_COMMON_FIELDS) {
    if (!hasOwn(candidate, field)) {
      failures.push(makeFailure(
        'STATE_DECLARATION_REQUIRED_FIELD_MISSING',
        { field }
      ));
    }
  }

  const declaredClasses =
    Array.isArray(candidate.stateClass)
      ? candidate.stateClass
      : [candidate.stateClass];

  if (
    declaredClasses.length !== 1 ||
    !declaredClasses[0]
  ) {
    failures.push(makeFailure(
      'STATE_CLASSIFICATION_AMBIGUOUS',
      { field: 'stateClass' }
    ));
  } else if (
    !H_EARTH_STATE_CLASSES.includes(declaredClasses[0])
  ) {
    failures.push(makeFailure(
      'STATE_CLASSIFICATION_INVALID',
      { value: declaredClasses[0] }
    ));
  }

  const stateClass = declaredClasses[0];

  for (
    const field of
    H_EARTH_STATE_REQUIRED_FIELDS_BY_CLASS[stateClass] || []
  ) {
    if (!hasOwn(candidate, field)) {
      failures.push(makeFailure(
        'STATE_CLASS_REQUIRED_FIELD_MISSING',
        { stateClass, field }
      ));
    }
  }

  if (!H_EARTH_HASH_POLICIES.includes(candidate.hashPolicy)) {
    failures.push(makeFailure(
      'STATE_HASH_POLICY_INVALID',
      { value: candidate.hashPolicy }
    ));
  }

  if (
    !H_EARTH_PERSISTENCE_POLICIES.includes(
      candidate.persistencePolicy
    )
  ) {
    failures.push(makeFailure(
      'STATE_PERSISTENCE_POLICY_INVALID',
      { value: candidate.persistencePolicy }
    ));
  }

  if (!H_EARTH_NULL_POLICIES.includes(candidate.nullPolicy)) {
    failures.push(makeFailure(
      'STATE_NULL_POLICY_INVALID',
      { value: candidate.nullPolicy }
    ));
  }

  if (
    !H_EARTH_UNDEFINED_POLICIES.includes(
      candidate.undefinedPolicy
    )
  ) {
    failures.push(makeFailure(
      'STATE_UNDEFINED_POLICY_INVALID',
      { value: candidate.undefinedPolicy }
    ));
  }

  if (
    !H_EARTH_ORDERING_POLICIES.includes(candidate.orderingPolicy)
  ) {
    failures.push(makeFailure(
      'STATE_ORDERING_POLICY_INVALID',
      { value: candidate.orderingPolicy }
    ));
  }

  if (
    !H_EARTH_VERSION_SENSITIVITY_POLICIES.includes(
      candidate.versionSensitivity
    )
  ) {
    failures.push(makeFailure(
      'STATE_VERSION_SENSITIVITY_INVALID',
      { value: candidate.versionSensitivity }
    ));
  }

  if (
    !H_EARTH_FAILURE_DISPOSITIONS.includes(
      candidate.failureDisposition
    )
  ) {
    failures.push(makeFailure(
      'STATE_FAILURE_DISPOSITION_INVALID',
      { value: candidate.failureDisposition }
    ));
  }

  if (
    FORBIDDEN_AUTHORITATIVE_HASH_CLASS_SET.has(stateClass) &&
    candidate.hashPolicy === 'AUTHORITATIVE_INCLUDED'
  ) {
    failures.push(makeFailure(
      'STATE_CLASSIFICATION_HASH_POLICY_REJECTED',
      {
        stateClass,
        hashPolicy: candidate.hashPolicy
      }
    ));
  }

  if (
    stateClass === 'RUNTIME_MUTABLE' &&
    candidate.writeAuthority !== 'H_EARTH_MUTATION_COMMIT'
  ) {
    failures.push(makeFailure(
      'STATE_CLASSIFICATION_WRITE_AUTHORITY_REJECTED',
      {
        expected: 'H_EARTH_MUTATION_COMMIT',
        received: candidate.writeAuthority
      }
    ));
  }

  if (
    stateClass === 'CONSTITUTIONAL' &&
    candidate.writeAuthority === 'H_EARTH_MUTATION_COMMIT'
  ) {
    failures.push(makeFailure(
      'CONSTITUTIONAL_ORDINARY_MUTATION_PROHIBITED'
    ));
  }

  if (
    stateClass === 'PERSISTED_EVENT' &&
    candidate.immutabilityPolicy !==
      'APPEND_ONLY_FINALIZED_IMMUTABLE'
  ) {
    failures.push(makeFailure(
      'PERSISTED_EVENT_IMMUTABILITY_POLICY_REJECTED',
      {
        expected:
          'APPEND_ONLY_FINALIZED_IMMUTABLE',
        received:
          candidate.immutabilityPolicy
      }
    ));
  }

  if (
    candidate.undefinedPolicy === 'TRANSIENT_INTERNAL_ONLY' &&
    candidate.hashPolicy === 'AUTHORITATIVE_INCLUDED'
  ) {
    failures.push(makeFailure(
      'TRANSIENT_UNDEFINED_AUTHORITATIVE_HASH_REJECTED'
    ));
  }

  if (candidate.authorityStatus === 'RETIRED') {
    const legacyChecks = [
      candidate.supersededBy === 'PATH_3',
      candidate.compatibilityOnly === true,
      candidate.createsSpatialAuthority === false
    ];

    if (!legacyChecks.every(Boolean)) {
      failures.push(makeFailure(
        'RETIRED_AUTHORITY_METADATA_INCOMPLETE'
      ));
    }
  }

  if (
    stateClass === 'DERIVED' &&
    (
      !Array.isArray(candidate.sourceFieldIds) ||
      candidate.sourceFieldIds.length === 0
    )
  ) {
    failures.push(makeFailure(
      'DERIVED_SOURCE_FIELDS_REQUIRED'
    ));
  }

  if (
    candidate.persistencePolicy === 'CACHE_ONLY' &&
    stateClass !== 'DERIVED'
  ) {
    warnings.push(makeWarning(
      'CACHE_ONLY_NON_DERIVED_REVIEW_REQUIRED'
    ));
  }

  return Object.freeze({
    ok:
      failures.length === 0,

    status:
      failures.length === 0
        ? 'STATIC_DECLARATION_CONFORMANT'
        : 'REJECTED',

    contractId:
      H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

    priorVerifiedContractId:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    fieldId:
      candidate.fieldId || null,

    stateClass:
      stateClass || null,

    failures:
      freezeRecordArray(failures),

    warnings:
      freezeRecordArray(warnings),

    runtimeActivated:
      false,

    validationClaim:
      false
  });
}

export function validateHEarthStateSchema(schema) {
  if (!Array.isArray(schema)) {
    return Object.freeze({
      ok:
        false,

      status:
        'REJECTED',

      contractId:
        H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

      priorVerifiedContractId:
        H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID,

      priorContractIdVerified:
        H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED,

      priorKnownOrReportedContractId:
        H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

      declarationCount:
        0,

      duplicateFieldIds:
        Object.freeze([]),

      failures:
        Object.freeze([
          makeFailure('STATE_SCHEMA_NOT_ARRAY')
        ]),

      receipts:
        Object.freeze([]),

      nonArraySchemaRejected:
        true,

      runtimeActivated:
        false,

      validationClaim:
        false
    });
  }

  const declarations = schema;
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

  const failures = [];

  if (!declarationsConform) {
    failures.push(makeFailure(
      'STATE_SCHEMA_DECLARATION_FAILURE'
    ));
  }

  if (!duplicatesAbsent) {
    failures.push(makeFailure(
      'STATE_SCHEMA_DUPLICATE_FIELD_IDS',
      { duplicateFieldIds: Object.freeze([...duplicateIds]) }
    ));
  }

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

    priorVerifiedContractId:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    declarationCount:
      declarations.length,

    duplicateFieldIds:
      Object.freeze([...duplicateIds]),

    failures:
      freezeRecordArray(failures),

    receipts:
      Object.freeze(receipts),

    nonArraySchemaRejected:
      false,

    runtimeActivated:
      false,

    validationClaim:
      false
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

    ordinaryMutationAuthority:
      'H_EARTH_MUTATION_COMMIT_FOR_RUNTIME_MUTABLE_ONLY',

    constitutionalOrdinaryMutation:
      false,

    rendererMutationAuthority:
      false,

    geometryMutationAuthority:
      false,

    diagnosticMutationAuthority:
      false,

    asyncDirectMutationAuthority:
      false,

    routeMutationAuthority:
      false,

    persistenceActivationAuthority:
      false,

    runtimeActivated:
      false,

    liveRuntimeClaim:
      false,

    moduleGraphExecutionProof:
      false,

    importResolutionProof:
      false,

    harnessExecution:
      false,

    testExecution:
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

export const H_EARTH_STATE_CLASSIFICATION_STEP_RELATIONSHIPS =
  Object.freeze({
    step012DConsumer:
      Object.freeze({
        file:
          '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.state.js',
        contractId:
          'H_EARTH_STATE_FILE_RENEWAL_STEP_012D_MANIFEST_INTEGRITY_BOUNDARY_ALIGNED_STATE_BRIDGE_v1',
        importsThisFile:
          true,
        validatesFieldDeclarations:
          true,
        fieldDeclarationSource:
          'H_EARTH_STATE_FIELD_DECLARATIONS',
        validationCall:
          'validateHEarthStateSchema(H_EARTH_STATE_FIELD_DECLARATIONS)',
        importResolutionVerifiedHere:
          false,
        moduleEvaluationVerifiedHere:
          false,
        liveRuntimeActivationCreatedHere:
          false
      }),

    step012FExecutionGate:
      Object.freeze({
        file:
          '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/h-earth.preflight-lanes.js',
        contractId:
          'H_EARTH_PREFLIGHT_LANES_FILE_BIRTH_STEP_012F_TEST_LANE_ENUMERATION_v1',
        identifiesThisFileAsRuntimeKernelDependencyReviewTarget:
          true,
        executablePreflightMayProceedFromThisFileAlone:
          false,
        harnessExecutionMayProceedFromThisFileAlone:
          false,
        testExecutionMayProceedFromThisFileAlone:
          false
      }),

    siblingRuntimeKernelDependency:
      Object.freeze({
        file:
          '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/runtime/h-earth.deterministic-runtime.js',
        priorKnownContractId:
          'H_EARTH_DETERMINISTIC_RUNTIME_REFERENCE_KERNEL_v1',
        reviewedByThisFile:
          false,
        renewedByThisFile:
          false
      }),

    adjacentDeferredReplayDependency:
      Object.freeze({
        file:
          '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/runtime/h-earth.canonical-replay.js',
        priorKnownContractId:
          'H_EARTH_CANONICAL_SERIALIZATION_AND_REPLAY_v1',
        status:
          'ADJACENT_AWARENESS_ONLY',
        reviewedByThisFile:
          false,
        renewedByThisFile:
          false
      })
  });

export const H_EARTH_STATE_CLASSIFICATION_ALLOWED_DESCRIPTOR_CLAIMS =
  Object.freeze([
    'stateClassificationDescriptorRead',
    'stateClassificationVocabularyDefined',
    'stateFieldDeclarationValidatorDefined',
    'stateSchemaValidatorDefined',
    'nonArraySchemaRejectedFailClosed',
    'step012DCompatibilityVocabularyRecorded',
    'step012DConsumerRelationshipRecorded',
    'step012FExecutionGateRelationshipRecorded',
    'runtimeBoundaryRecorded'
  ]);

export const H_EARTH_STATE_CLASSIFICATION_BLOCKED_CLAIMS =
  Object.freeze([
    'PASS_CANDIDATE',
    'runtimeActivated',
    'runtimeCreated',
    'intentAdmitted',
    'tickCommitted',
    'actionExecuted',
    'readoutExecuted',
    'observationAcquired',
    'receiptOccurrenceGenerated',
    'receiptPersisted',
    'neighboringSourceModuleImported',
    'neighboringSourceModuleExecuted',
    'moduleGraphExecuted',
    'importResolutionVerified',
    'runtimeDependencyResolutionVerified',
    'installedModuleEvaluationVerified',
    'executableHarnessConstructed',
    'executableHarnessLogicExecuted',
    'harnessExecuted',
    'testExecuted',
    'preflightExecuted',
    'rendererActivated',
    'routeActivated',
    'validationClaim',
    'productionClaim',
    'deploymentClaim',
    'visualPassClaim',
    'matrixCollapse'
  ]);

export const H_EARTH_STATE_CLASSIFICATION_CLAIM_GUARD_MODEL =
  Object.freeze({
    modelId:
      'H_EARTH_STATE_CLASSIFICATION_CLAIM_GUARD_MODEL',

    securityProperty:
      'ALLOWLIST_WITH_UNKNOWN_REJECTION',

    allowedClaimListIsAuthoritative:
      true,

    blockedClaimListIsExplanatoryNotExhaustive:
      true,

    unknownClaimsRejectedIndependentlyOfBlockedList:
      true,

    allowedClaims:
      H_EARTH_STATE_CLASSIFICATION_ALLOWED_DESCRIPTOR_CLAIMS,

    blockedClaims:
      H_EARTH_STATE_CLASSIFICATION_BLOCKED_CLAIMS
  });

export function isHEarthStateClassificationClaimAllowed(claimName) {
  if (!claimName || typeof claimName !== 'string') return false;

  const allowedClaims =
    new Set(H_EARTH_STATE_CLASSIFICATION_ALLOWED_DESCRIPTOR_CLAIMS);

  return allowedClaims.has(claimName);
}

export function classifyHEarthStateClassificationClaim(claimName) {
  if (!claimName || typeof claimName !== 'string') {
    return Object.freeze({
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
    new Set(H_EARTH_STATE_CLASSIFICATION_ALLOWED_DESCRIPTOR_CLAIMS);

  const blockedClaims =
    new Set(H_EARTH_STATE_CLASSIFICATION_BLOCKED_CLAIMS);

  if (allowedClaims.has(claimName)) {
    return Object.freeze({
      claimName,
      recognized:
        true,
      allowed:
        true,
      classification:
        'ALLOW_STATIC_STATE_CLASSIFICATION_DESCRIPTOR_READ_ONLY',
      failClosed:
        true
    });
  }

  if (blockedClaims.has(claimName)) {
    return Object.freeze({
      claimName,
      recognized:
        true,
      allowed:
        false,
      classification:
        'REJECTED_EXPLICITLY_BLOCKED_RUNTIME_OR_EXECUTION_CLAIM',
      blockedClaimListIsExplanatoryNotExhaustive:
        true,
      failClosed:
        true
    });
  }

  return Object.freeze({
    claimName,
    recognized:
      false,
    allowed:
      false,
    classification:
      'REJECTED_UNKNOWN_OR_UNAUTHORIZED_STATE_CLASSIFICATION_CLAIM',
    unknownClaimsRejectedIndependentlyOfBlockedList:
      true,
    failClosed:
      true
  });
}

export function getHEarthStateClassificationAuthority() {
  return H_EARTH_STATE_CLASSIFICATION_AUTHORITY;
}

export function getHEarthStateClassificationContract() {
  return H_EARTH_STATE_CLASSIFICATION_CONTRACT;
}

export function getHEarthStateClassificationBoundaryFlags() {
  return H_EARTH_STATE_CLASSIFICATION_BOUNDARY_FLAGS;
}

export function getHEarthStateClassificationStep012DCompatibility() {
  return H_EARTH_STATE_CLASSIFICATION_STEP_012D_COMPATIBILITY;
}

export function getHEarthStateClassificationStepRelationships() {
  return H_EARTH_STATE_CLASSIFICATION_STEP_RELATIONSHIPS;
}

export function getHEarthStateClassificationClaimGuardModel() {
  return H_EARTH_STATE_CLASSIFICATION_CLAIM_GUARD_MODEL;
}

export function getHEarthStateClassificationDescriptorReceipt() {
  return Object.freeze({
    receiptType:
      'H_EARTH_STATE_CLASSIFICATION_STEP_012G_DESCRIPTOR_RECEIPT',

    receiptId:
      'H_EARTH_STATE_CLASSIFICATION_STEP_012G_RUNTIME_KERNEL_DEPENDENCY_REVIEW_DESCRIPTOR_RECEIPT_v1',

    contractId:
      H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

    priorVerifiedContractId:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID,

    priorContractIdVerified:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED,

    priorKnownOrReportedContractId:
      H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

    file:
      '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/runtime/h-earth.state-classification.js',

    status:
      'STEP_012G_STATIC_RUNTIME_STATE_CLASSIFICATION_REVIEW_DESCRIPTOR_DEFINED',

    authorityBoundaryRecorded:
      true,

    ownModuleInitializationExecution:
      true,

    staticClassificationVocabularyConstructedHere:
      true,

    staticValidatorFunctionsDefinedHere:
      true,

    step012DCompatibilityVocabularyRecorded:
      true,

    requiredOrderingPoliciesRecorded:
      true,

    requiredVersionSensitivityPoliciesRecorded:
      true,

    requiredFailureDispositionsRecorded:
      true,

    nonArraySchemaRejectedFailClosed:
      true,

    step012DConsumerRelationshipRecorded:
      true,

    step012FExecutionGateRelationshipRecorded:
      true,

    neighboringSourceModuleImport:
      false,

    neighboringSourceModuleExecution:
      false,

    importResolutionProof:
      false,

    runtimeDependencyResolutionProof:
      false,

    installedModuleEvaluationProof:
      false,

    moduleGraphExecution:
      false,

    executableHarnessConstructedHere:
      false,

    executableHarnessLogicExecution:
      false,

    harnessExecutedHere:
      false,

    testExecutedHere:
      false,

    preflightExecutedHere:
      false,

    liveRuntimeActivated:
      false,

    runtimeCreated:
      false,

    intentAdmitted:
      false,

    tickCommitted:
      false,

    actionExecuted:
      false,

    readoutExecuted:
      false,

    observationAcquired:
      false,

    receiptOccurrenceGenerated:
      false,

    receiptPersisted:
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
      false,

    nextRuntimeKernelTarget:
      '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/runtime/h-earth.deterministic-runtime.js',

    nextRuntimeKernelTargetRenewalAuthorizedByThisFile:
      false,

    finalMarker:
      'export default H_EARTH_STATE_CLASSIFICATION;'
  });
}

export function getHEarthStateClassificationReceipt() {
  return getHEarthStateClassificationDescriptorReceipt();
}

export const H_EARTH_STATE_CLASSIFICATION = Object.freeze({
  id:
    'H_EARTH_STATE_CLASSIFICATION',

  file:
    '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/runtime/h-earth.state-classification.js',

  contractId:
    H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

  priorVerifiedContractId:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_VERIFIED_CONTRACT_ID,

  priorContractIdVerified:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_CONTRACT_ID_VERIFIED,

  priorKnownOrReportedContractId:
    H_EARTH_STATE_CLASSIFICATION_PRIOR_KNOWN_OR_REPORTED_CONTRACT_ID,

  authority:
    H_EARTH_STATE_CLASSIFICATION_AUTHORITY,

  contract:
    H_EARTH_STATE_CLASSIFICATION_CONTRACT,

  boundaryFlags:
    H_EARTH_STATE_CLASSIFICATION_BOUNDARY_FLAGS,

  boundary:
    H_EARTH_STATE_CLASSIFICATION_BOUNDARY,

  step012DCompatibility:
    H_EARTH_STATE_CLASSIFICATION_STEP_012D_COMPATIBILITY,

  stepRelationships:
    H_EARTH_STATE_CLASSIFICATION_STEP_RELATIONSHIPS,

  classes:
    H_EARTH_STATE_CLASSES,

  hashPolicies:
    H_EARTH_HASH_POLICIES,

  persistencePolicies:
    H_EARTH_PERSISTENCE_POLICIES,

  nullPolicies:
    H_EARTH_NULL_POLICIES,

  undefinedPolicies:
    H_EARTH_UNDEFINED_POLICIES,

  orderingPolicies:
    H_EARTH_ORDERING_POLICIES,

  versionSensitivityPolicies:
    H_EARTH_VERSION_SENSITIVITY_POLICIES,

  failureDispositions:
    H_EARTH_FAILURE_DISPOSITIONS,

  requiredCommonFields:
    H_EARTH_STATE_REQUIRED_COMMON_FIELDS,

  requiredFieldsByClass:
    H_EARTH_STATE_REQUIRED_FIELDS_BY_CLASS,

  forbiddenAuthoritativeHashClasses:
    H_EARTH_STATE_FORBIDDEN_AUTHORITATIVE_HASH_CLASSES,

  validateFieldDeclaration:
    validateHEarthFieldDeclaration,

  validateSchema:
    validateHEarthStateSchema,

  claimGuardModel:
    H_EARTH_STATE_CLASSIFICATION_CLAIM_GUARD_MODEL,

  allowedDescriptorClaims:
    H_EARTH_STATE_CLASSIFICATION_ALLOWED_DESCRIPTOR_CLAIMS,

  blockedClaims:
    H_EARTH_STATE_CLASSIFICATION_BLOCKED_CLAIMS,

  mode:
    'STATIC_RUNTIME_STATE_CLASSIFICATION_REVIEW_ONLY',

  ownModuleInitializationExecution:
    true,

  step012DCompatibilityVocabularyRecorded:
    true,

  nonArraySchemaRejectedFailClosed:
    true,

  neighboringSourceModuleImport:
    false,

  neighboringSourceModuleExecution:
    false,

  runtimeActivated:
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
    'export default H_EARTH_STATE_CLASSIFICATION;'
});

export default H_EARTH_STATE_CLASSIFICATION;
