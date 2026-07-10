/**
 * h-earth.state.js
 *
 * DGB H-Earth Scratch Rebuild
 * Room 2 — Manifest / State / Receipts Lane
 *
 * Purpose:
 * Defines the bounded H-Earth state catalog, preserves the original
 * ground-inspection transition identity, classifies the complete current
 * deterministic runtime state shape, verifies declaration coverage against
 * the constructed initial state, and exposes a fail-closed initial-state
 * candidate.
 *
 * Integration:
 * Consumes:
 * - /h-earth-3d/runtime/h-earth.state-classification.js
 * - /h-earth-3d/runtime/h-earth.deterministic-runtime.js
 *
 * Boundary:
 * This file establishes catalog and deterministic-kernel compatibility only.
 * It does not activate a route, renderer, controller, traversal system,
 * survival system, persistence service, or production runtime.
 */

import {
  H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,
  validateHEarthStateSchema
} from './runtime/h-earth.state-classification.js';

import {
  H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,
  H_EARTH_VERSION_ENVELOPE,
  createHEarthInitialState
} from './runtime/h-earth.deterministic-runtime.js';

export const H_EARTH_STATE_CATALOG_CONTRACT_ID =
  'H_EARTH_STATE_CATALOG_DETERMINISTIC_INTEGRATION_v3';

export const H_EARTH_STATE = Object.freeze({
  H_EARTH_GROUND_VIEW_ACTIVE:
    'H_EARTH_GROUND_VIEW_ACTIVE',

  H_EARTH_SURFACE_INSPECTION_ACTIVE:
    'H_EARTH_SURFACE_INSPECTION_ACTIVE'
});

export const H_EARTH_STATE_IDENTIFIERS = Object.freeze({
  matrixId:
    'H_EARTH_GROUND_VIEW_MATRIX',

  matrixName:
    'H-Earth',

  sceneIdentity:
    'earth-water-air-survival-shoreline-manor',

  canonicalRegionCellId:
    'H_EARTH_REGION_CELL_X07_Z08',

  activeCellId:
    'H_EARTH_GROUND_CELL_001',

  inspectGroundActionId:
    'INSPECT_GROUND',

  inspectGroundActionLabel:
    'Inspect Ground',

  groundConditionReadoutId:
    'GROUND_CONDITION_READ',

  groundConditionReadoutLabel:
    'Ground Condition Read',

  groundInspectionReceiptId:
    'H_EARTH_GROUND_INSPECTION_RECEIPT',

  inspectGroundTransitionId:
    'H_EARTH_INSPECT_GROUND_STATE_TRANSITION',

  inspectGroundRuleId:
    'H_EARTH_INSPECT_GROUND_RULE_v1'
});

export const H_EARTH_STATE_TRANSITIONS = Object.freeze({
  inspectGround: Object.freeze({
    transitionId:
      H_EARTH_STATE_IDENTIFIERS
        .inspectGroundTransitionId,

    transitionExpressionClass:
      'DESCRIPTIVE_TRANSITION_IDENTITY_ONLY',

    executableRuntimeTransition:
      Object.freeze({
        fieldId:
          'cells.H_EARTH_GROUND_CELL_001.lifecycle',

        fromValue:
          'ADDRESSABLE',

        toValue:
          'ACTIVE',

        commitAuthority:
          'H_EARTH_MUTATION_COMMIT'
      }),

    fromState:
      H_EARTH_STATE
        .H_EARTH_GROUND_VIEW_ACTIVE,

    toState:
      H_EARTH_STATE
        .H_EARTH_SURFACE_INSPECTION_ACTIVE,

    actionId:
      H_EARTH_STATE_IDENTIFIERS
        .inspectGroundActionId,

    actionLabel:
      H_EARTH_STATE_IDENTIFIERS
        .inspectGroundActionLabel,

    triggeringAction:
      H_EARTH_STATE_IDENTIFIERS
        .inspectGroundActionLabel,

    readoutId:
      H_EARTH_STATE_IDENTIFIERS
        .groundConditionReadoutId,

    readoutLabel:
      H_EARTH_STATE_IDENTIFIERS
        .groundConditionReadoutLabel,

    outputReadout:
      H_EARTH_STATE_IDENTIFIERS
        .groundConditionReadoutLabel,

    receiptId:
      H_EARTH_STATE_IDENTIFIERS
        .groundInspectionReceiptId,

    outputReceipt:
      H_EARTH_STATE_IDENTIFIERS
        .groundInspectionReceiptId,

    activeCell:
      H_EARTH_STATE_IDENTIFIERS
        .activeCellId,

    sceneIdentity:
      H_EARTH_STATE_IDENTIFIERS
        .sceneIdentity,

    governingRule:
      H_EARTH_STATE_IDENTIFIERS
        .inspectGroundRuleId,

    targetTickPolicy:
      'NEXT_COMMITTABLE_SIMULATION_TICK',

    mutationAuthority:
      'H_EARTH_MUTATION_COMMIT',

    transitionPolicy:
      'ORDERED_DETERMINISTIC_COMMIT_ONLY',

    boundary:
      Object.freeze({
        runtimeStateExecutionClaim:
          false,

        rendererStateActivationClaim:
          false,

        validationStateActivationClaim:
          false,

        openWorldStateActivationClaim:
          false,

        survivalStateActivationClaim:
          false,

        routeIntegrationClaim:
          false,

        githubInstallationClaim:
          false,

        matrixCollapse:
          false
      })
  })
});

function constitutionalField({
  fieldId,
  ruleId,
  jurisdiction,
  versionSensitivity =
    'WORLD_SCHEMA_VERSION_BOUND'
}) {
  return Object.freeze({
    fieldId,

    stateClass:
      'CONSTITUTIONAL',

    schemaVersion:
      '1.0.0-candidate',

    authorityOwner:
      'H_EARTH_STATE_CATALOG',

    writeAuthority:
      'CONSTITUTIONAL_DEFINITION_ONLY',

    persistencePolicy:
      'SNAPSHOT',

    hashPolicy:
      'AUTHORITATIVE_INCLUDED',

    nullPolicy:
      'NULL_FORBIDDEN',

    undefinedPolicy:
      'UNDEFINED_FORBIDDEN',

    orderingPolicy:
      'CANONICAL_PROPERTY_ORDER',

    versionSensitivity,

    failureDisposition:
      'FAIL_CLOSED',

    constitutionalRuleId:
      ruleId,

    jurisdiction,

    changePolicy:
      'EXPLICIT_VERSIONED_RENEWAL_ONLY'
  });
}

function runtimeMutableField({
  fieldId,
  authorityOwner,
  mutationRuleId,
  lifecycleOwner,
  nullPolicy =
    'NULL_FORBIDDEN',
  orderingPolicy =
    'CANONICAL_PROPERTY_ORDER',
  versionSensitivity =
    'SIMULATION_LAW_VERSION_BOUND'
}) {
  return Object.freeze({
    fieldId,

    stateClass:
      'RUNTIME_MUTABLE',

    schemaVersion:
      '1.0.0-candidate',

    authorityOwner,

    writeAuthority:
      'H_EARTH_MUTATION_COMMIT',

    persistencePolicy:
      'SNAPSHOT',

    hashPolicy:
      'AUTHORITATIVE_INCLUDED',

    nullPolicy,

    undefinedPolicy:
      'UNDEFINED_FORBIDDEN',

    orderingPolicy,

    versionSensitivity,

    failureDisposition:
      'FAIL_CLOSED',

    mutationRuleId,

    commitBoundary:
      'H_EARTH_MUTATION_COMMIT',

    lifecycleOwner
  });
}

function persistedEventField({
  fieldId,
  authorityOwner,
  eventSchemaId,
  orderingPolicy
}) {
  return Object.freeze({
    fieldId,

    stateClass:
      'PERSISTED_EVENT',

    schemaVersion:
      '1.0.0-candidate',

    authorityOwner,

    writeAuthority:
      'H_EARTH_MUTATION_COMMIT',

    persistencePolicy:
      'SNAPSHOT_AND_EVENT',

    hashPolicy:
      'AUTHORITATIVE_INCLUDED',

    nullPolicy:
      'NULL_FORBIDDEN',

    undefinedPolicy:
      'UNDEFINED_FORBIDDEN',

    orderingPolicy,

    versionSensitivity:
      'EVENT_SCHEMA_VERSION_BOUND',

    failureDisposition:
      'FAIL_CLOSED',

    eventSchemaId,

    eventOrderPolicy:
      'APPEND_ORDER_IS_AUTHORITATIVE',

    immutabilityPolicy:
      'APPEND_ONLY_FINALIZED_IMMUTABLE'
  });
}

export const H_EARTH_STATE_FIELD_DECLARATIONS =
  Object.freeze([
    constitutionalField({
      fieldId:
        'activeMatrix',

      ruleId:
        'H_EARTH_ACTIVE_MATRIX_IDENTITY_RULE_v1',

      jurisdiction:
        'H_EARTH_GROUND_VIEW_MATRIX'
    }),

    constitutionalField({
      fieldId:
        'matrixIdentity',

      ruleId:
        'H_EARTH_MATRIX_IDENTITY_RULE_v1',

      jurisdiction:
        'H_EARTH_GROUND_VIEW_MATRIX'
    }),

    constitutionalField({
      fieldId:
        'sceneIdentity',

      ruleId:
        'H_EARTH_SCENE_IDENTITY_RULE_v1',

      jurisdiction:
        'H_EARTH_GROUND_CELL_001'
    }),

    constitutionalField({
      fieldId:
        'canonicalRegionCellId',

      ruleId:
        'H_EARTH_CANONICAL_REGION_CELL_RULE_v1',

      jurisdiction:
        'PATH_3',

      versionSensitivity:
        'REGION_SPACE_VERSION_BOUND'
    }),

    constitutionalField({
      fieldId:
        'activeDomainCellId',

      ruleId:
        'H_EARTH_DOMAIN_CELL_RULE_v1',

      jurisdiction:
        'H_EARTH_GROUND_CELL_001'
    }),

    constitutionalField({
      fieldId:
        'firstActionId',

      ruleId:
        'H_EARTH_FIRST_ACTION_IDENTITY_RULE_v1',

      jurisdiction:
        'H_EARTH_GROUND_CELL_001'
    }),

    constitutionalField({
      fieldId:
        'firstReadoutId',

      ruleId:
        'H_EARTH_FIRST_READOUT_IDENTITY_RULE_v1',

      jurisdiction:
        'H_EARTH_GROUND_CELL_001'
    }),

    constitutionalField({
      fieldId:
        'firstReceiptId',

      ruleId:
        'H_EARTH_FIRST_RECEIPT_IDENTITY_RULE_v1',

      jurisdiction:
        'H_EARTH_GROUND_CELL_001'
    }),

    runtimeMutableField({
      fieldId:
        'simulationTick',

      authorityOwner:
        'H_EARTH_DETERMINISTIC_RUNTIME',

      mutationRuleId:
        'H_EARTH_FIXED_TICK_MUTATION_RULE_v1',

      lifecycleOwner:
        'H_EARTH_DETERMINISTIC_RUNTIME',

      orderingPolicy:
        'MONOTONIC_INTEGER_ORDER'
    }),

    runtimeMutableField({
      fieldId:
        'stateVersion',

      authorityOwner:
        'H_EARTH_DETERMINISTIC_RUNTIME',

      mutationRuleId:
        'H_EARTH_STATE_VERSION_INCREMENT_RULE_v1',

      lifecycleOwner:
        'H_EARTH_DETERMINISTIC_RUNTIME',

      orderingPolicy:
        'MONOTONIC_INTEGER_ORDER'
    }),

    runtimeMutableField({
      fieldId:
        'cells.H_EARTH_GROUND_CELL_001.lifecycle',

      authorityOwner:
        'H_EARTH_GROUND_CELL_001',

      mutationRuleId:
        'H_EARTH_CELL_LIFECYCLE_MUTATION_RULE_v1',

      lifecycleOwner:
        'H_EARTH_GROUND_CELL_001',

      orderingPolicy:
        'DECLARED_LIFECYCLE_ORDER',

      versionSensitivity:
        'CELL_SCHEMA_VERSION_BOUND'
    }),

    runtimeMutableField({
      fieldId:
        'cells.H_EARTH_GROUND_CELL_001.admitted',

      authorityOwner:
        'H_EARTH_GROUND_CELL_001',

      mutationRuleId:
        'H_EARTH_CELL_ADMISSION_MUTATION_RULE_v1',

      lifecycleOwner:
        'H_EARTH_GROUND_CELL_001',

      orderingPolicy:
        'BOOLEAN_FALSE_TO_TRUE_ONLY',

      versionSensitivity:
        'CELL_SCHEMA_VERSION_BOUND'
    }),

    runtimeMutableField({
      fieldId:
        'cells.H_EARTH_GROUND_CELL_001.active',

      authorityOwner:
        'H_EARTH_GROUND_CELL_001',

      mutationRuleId:
        'H_EARTH_CELL_ACTIVE_MUTATION_RULE_v1',

      lifecycleOwner:
        'H_EARTH_GROUND_CELL_001',

      orderingPolicy:
        'BOOLEAN_FALSE_TO_TRUE_ONLY',

      versionSensitivity:
        'CELL_SCHEMA_VERSION_BOUND'
    }),

    runtimeMutableField({
      fieldId:
        'cells.H_EARTH_GROUND_CELL_001.inspectionCount',

      authorityOwner:
        'H_EARTH_GROUND_CELL_001',

      mutationRuleId:
        'H_EARTH_INSPECTION_COUNT_INCREMENT_RULE_v1',

      lifecycleOwner:
        'H_EARTH_GROUND_CELL_001',

      orderingPolicy:
        'MONOTONIC_INTEGER_ORDER',

      versionSensitivity:
        'CELL_SCHEMA_VERSION_BOUND'
    }),

    runtimeMutableField({
      fieldId:
        'cells.H_EARTH_GROUND_CELL_001.lastInspectionTick',

      authorityOwner:
        'H_EARTH_GROUND_CELL_001',

      mutationRuleId:
        'H_EARTH_LAST_INSPECTION_TICK_RULE_v1',

      lifecycleOwner:
        'H_EARTH_GROUND_CELL_001',

      nullPolicy:
        'NULL_MEANS_NOT_YET_RESOLVED',

      orderingPolicy:
        'MONOTONIC_INTEGER_ORDER',

      versionSensitivity:
        'CELL_SCHEMA_VERSION_BOUND'
    }),

    persistedEventField({
      fieldId:
        'readouts',

      authorityOwner:
        'H_EARTH_DETERMINISTIC_RUNTIME',

      eventSchemaId:
        'H_EARTH_GROUND_CONDITION_READ_EVENT_v1',

      orderingPolicy:
        'SIMULATION_TICK_THEN_MUTATION_ID'
    }),

    persistedEventField({
      fieldId:
        'committedMutationIds',

      authorityOwner:
        'H_EARTH_DETERMINISTIC_RUNTIME',

      eventSchemaId:
        'H_EARTH_COMMITTED_MUTATION_EVENT_v1',

      orderingPolicy:
        'COMMIT_SEQUENCE_ORDER'
    }),

    persistedEventField({
      fieldId:
        'rejectedMutationIds',

      authorityOwner:
        'H_EARTH_DETERMINISTIC_RUNTIME',

      eventSchemaId:
        'H_EARTH_REJECTED_MUTATION_EVENT_v1',

      orderingPolicy:
        'REJECTION_SEQUENCE_ORDER'
    }),

    Object.freeze({
      fieldId:
        'diagnosticTiming',

      stateClass:
        'DIAGNOSTIC_ONLY',

      schemaVersion:
        '1.0.0-candidate',

      authorityOwner:
        'H_EARTH_DIAGNOSTIC_HARNESS',

      writeAuthority:
        'DIAGNOSTIC_HARNESS_ONLY',

      persistencePolicy:
        'NEVER_PERSIST',

      hashPolicy:
        'DIAGNOSTIC_HASH_ONLY',

      nullPolicy:
        'NULL_MEANS_NOT_APPLICABLE',

      undefinedPolicy:
        'OMITTED_BY_SCHEMA',

      orderingPolicy:
        'NON_AUTHORITATIVE',

      versionSensitivity:
        'DIAGNOSTIC_HARNESS_VERSION_BOUND',

      failureDisposition:
        'AUTHORITATIVE_STATE_UNAFFECTED',

      diagnosticKind:
        'EXECUTION_TIMING',

      claimLevel:
        'DIAGNOSTIC_ONLY',

      authoritativeExclusion:
        true
    }),

    Object.freeze({
      fieldId:
        'ephemeralVisualState',

      stateClass:
        'EPHEMERAL_VISUAL',

      schemaVersion:
        '1.0.0-candidate',

      authorityOwner:
        'H_EARTH_RENDERER',

      writeAuthority:
        'RENDERER_LOCAL_ONLY',

      persistencePolicy:
        'NEVER_PERSIST',

      hashPolicy:
        'NOT_HASHED',

      nullPolicy:
        'NULL_MEANS_NOT_APPLICABLE',

      undefinedPolicy:
        'OMITTED_BY_SCHEMA',

      orderingPolicy:
        'NON_AUTHORITATIVE',

      versionSensitivity:
        'RENDERER_VERSION_LOCAL',

      failureDisposition:
        'AUTHORITATIVE_STATE_UNAFFECTED',

      rendererScope:
        'PRESENTATION_ONLY',

      discardPolicy:
        'DISCARD_WITHOUT_STATE_MUTATION'
    })
  ]);

export const H_EARTH_STATE_SCHEMA_RECEIPT =
  validateHEarthStateSchema(
    H_EARTH_STATE_FIELD_DECLARATIONS
  );

if (!H_EARTH_STATE_SCHEMA_RECEIPT.ok) {
  throw new Error(
    'H_EARTH_STATE_SCHEMA_STATIC_CONFORMANCE_FAILED'
  );
}

export function createHEarthCatalogInitialState(
  overrides = undefined
) {
  if (overrides !== undefined) {
    throw new TypeError(
      'H_EARTH_CONSTITUTIONAL_INITIAL_STATE_OVERRIDE_REJECTED'
    );
  }

  return createHEarthInitialState({
    activeMatrix:
      H_EARTH_STATE_IDENTIFIERS.matrixName,

    matrixIdentity:
      H_EARTH_STATE_IDENTIFIERS.matrixId,

    sceneIdentity:
      H_EARTH_STATE_IDENTIFIERS.sceneIdentity,

    canonicalRegionCellId:
      H_EARTH_STATE_IDENTIFIERS
        .canonicalRegionCellId,

    activeDomainCellId:
      H_EARTH_STATE_IDENTIFIERS.activeCellId,

    firstActionId:
      H_EARTH_STATE_IDENTIFIERS
        .inspectGroundActionId,

    firstReadoutId:
      H_EARTH_STATE_IDENTIFIERS
        .groundConditionReadoutId,

    firstReceiptId:
      H_EARTH_STATE_IDENTIFIERS
        .groundInspectionReceiptId
  });
}

export const H_EARTH_INITIAL_STATE_CANDIDATE =
  createHEarthCatalogInitialState();

function isPlainRecord(value) {
  return Boolean(value) &&
    typeof value === 'object' &&
    !Array.isArray(value);
}

function collectRuntimeFieldPaths(
  value,
  prefix = ''
) {
  if (Array.isArray(value)) {
    return prefix
      ? [prefix]
      : [];
  }

  if (!isPlainRecord(value)) {
    return prefix
      ? [prefix]
      : [];
  }

  const keys =
    Object.keys(value)
      .sort();

  if (keys.length === 0) {
    return prefix
      ? [prefix]
      : [];
  }

  const paths = [];

  for (const key of keys) {
    const path =
      prefix
        ? `${prefix}.${key}`
        : key;

    const child =
      value[key];

    if (
      Array.isArray(child) ||
      !isPlainRecord(child)
    ) {
      paths.push(path);
      continue;
    }

    paths.push(
      ...collectRuntimeFieldPaths(
        child,
        path
      )
    );
  }

  return paths;
}

function isAuthoritativeRuntimeDeclaration(
  declaration
) {
  return (
    declaration.stateClass !==
      'DIAGNOSTIC_ONLY' &&
    declaration.stateClass !==
      'EPHEMERAL_VISUAL'
  );
}

export function evaluateHEarthRuntimeFieldCoverage({
  state,
  declarations
}) {
  const runtimeFieldPaths =
    collectRuntimeFieldPaths(state);

  const authoritativeDeclarationIds =
    declarations
      .filter(
        isAuthoritativeRuntimeDeclaration
      )
      .map(
        (declaration) =>
          declaration.fieldId
      )
      .sort();

  const runtimePathSet =
    new Set(runtimeFieldPaths);

  const declarationIdSet =
    new Set(
      authoritativeDeclarationIds
    );

  const undeclaredRuntimeFieldPaths =
    runtimeFieldPaths
      .filter(
        (fieldPath) =>
          !declarationIdSet.has(fieldPath)
      );

  const declarationsAbsentFromRuntime =
    authoritativeDeclarationIds
      .filter(
        (fieldId) =>
          !runtimePathSet.has(fieldId)
      );

  const duplicateRuntimeFieldPaths =
    runtimeFieldPaths
      .filter(
        (fieldPath, index, values) =>
          values.indexOf(fieldPath) !== index
      );

  const duplicateDeclarationIds =
    authoritativeDeclarationIds
      .filter(
        (fieldId, index, values) =>
          values.indexOf(fieldId) !== index
      );

  const ok =
    undeclaredRuntimeFieldPaths.length === 0 &&
    declarationsAbsentFromRuntime.length === 0 &&
    duplicateRuntimeFieldPaths.length === 0 &&
    duplicateDeclarationIds.length === 0;

  return Object.freeze({
    ok,

    status:
      ok
        ? 'CURRENT_RUNTIME_FIELD_COVERAGE_PASS'
        : 'CURRENT_RUNTIME_FIELD_COVERAGE_FAILED',

    coverageLaw:
      'EXACT_AUTHORITATIVE_LEAF_AND_ARRAY_PARENT_PATH_MATCH',

    arrayCoveragePolicy:
      'ARRAY_PARENT_PATH_IS_DECLARATION_TERMINAL',

    excludedDeclarationClasses:
      Object.freeze([
        'DIAGNOSTIC_ONLY',
        'EPHEMERAL_VISUAL'
      ]),

    runtimeFieldCount:
      runtimeFieldPaths.length,

    authoritativeDeclarationCount:
      authoritativeDeclarationIds.length,

    runtimeFieldPaths:
      Object.freeze([
        ...runtimeFieldPaths
      ]),

    authoritativeDeclarationIds:
      Object.freeze([
        ...authoritativeDeclarationIds
      ]),

    undeclaredRuntimeFieldPaths:
      Object.freeze([
        ...undeclaredRuntimeFieldPaths
      ]),

    declarationsAbsentFromRuntime:
      Object.freeze([
        ...declarationsAbsentFromRuntime
      ]),

    duplicateRuntimeFieldPaths:
      Object.freeze([
        ...duplicateRuntimeFieldPaths
      ]),

    duplicateDeclarationIds:
      Object.freeze([
        ...duplicateDeclarationIds
      ])
  });
}

export const H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT =
  evaluateHEarthRuntimeFieldCoverage({
    state:
      H_EARTH_INITIAL_STATE_CANDIDATE,

    declarations:
      H_EARTH_STATE_FIELD_DECLARATIONS
  });

if (!H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT.ok) {
  throw new Error(
    'H_EARTH_RUNTIME_FIELD_COVERAGE_FAILED'
  );
}

export const H_EARTH_STATE_INTEGRATION_RECEIPT =
  Object.freeze({
    contractId:
      H_EARTH_STATE_CATALOG_CONTRACT_ID,

    stateClassificationContractId:
      H_EARTH_STATE_CLASSIFICATION_CONTRACT_ID,

    deterministicRuntimeContractId:
      H_EARTH_DETERMINISTIC_RUNTIME_CONTRACT_ID,

    stateSchemaConformant:
      H_EARTH_STATE_SCHEMA_RECEIPT.ok,

    declaredFieldCount:
      H_EARTH_STATE_SCHEMA_RECEIPT
        .declarationCount,

    completeCurrentRuntimeFieldCoverage:
      H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT
        .ok,

    runtimeFieldCoverageStatus:
      H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT
        .status,

    runtimeFieldCount:
      H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT
        .runtimeFieldCount,

    authoritativeDeclarationCount:
      H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT
        .authoritativeDeclarationCount,

    undeclaredRuntimeFieldCount:
      H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT
        .undeclaredRuntimeFieldPaths
        .length,

    declarationsAbsentFromRuntimeCount:
      H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT
        .declarationsAbsentFromRuntime
        .length,

    runtimeFieldCoverageDerived:
      true,

    runtimeFieldCoverageHardCoded:
      false,

    readoutsAuthoritativeClassification:
      'PERSISTED_EVENT',

    transitionExpressionClass:
      'DESCRIPTIVE_TRANSITION_IDENTITY_ONLY',

    constitutionalOverridePolicy:
      'FAIL_CLOSED_NO_OVERRIDE',

    transitionCount:
      Object.keys(
        H_EARTH_STATE_TRANSITIONS
      ).length,

    versionEnvelope:
      H_EARTH_VERSION_ENVELOPE,

    initialStateConstructed:
      true,

    deterministicKernelConnected:
      true,

    runtimeActivated:
      false,

    routeIntegrated:
      false,

    rendererIntegrated:
      false,

    controllerIntegrated:
      false,

    persistenceActivated:
      false,

    githubInstallationClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false
  });

export const H_EARTH_STATE_BOUNDARY =
  Object.freeze({
    activeSpatialAuthority:
      'PATH_3_ONLY',

    ordinaryMutationAuthority:
      'H_EARTH_MUTATION_COMMIT',

    constitutionalOverrideAuthority:
      false,

    rendererMutationAuthority:
      false,

    diagnosticMutationAuthority:
      false,

    asynchronousDirectMutationAuthority:
      false,

    runtimeFieldCoveragePolicy:
      'SELF_VERIFYING_FAIL_CLOSED',

    runtimeStateExecutionClaim:
      false,

    rendererStateActivationClaim:
      false,

    validationStateActivationClaim:
      false,

    openWorldStateActivationClaim:
      false,

    survivalStateActivationClaim:
      false,

    routeIntegrationClaim:
      false,

    githubInstallationClaim:
      false,

    matrixCollapse:
      false,

    productionClaim:
      false
  });

export default Object.freeze({
  contractId:
    H_EARTH_STATE_CATALOG_CONTRACT_ID,

  states:
    H_EARTH_STATE,

  identifiers:
    H_EARTH_STATE_IDENTIFIERS,

  transitions:
    H_EARTH_STATE_TRANSITIONS,

  fieldDeclarations:
    H_EARTH_STATE_FIELD_DECLARATIONS,

  schemaReceipt:
    H_EARTH_STATE_SCHEMA_RECEIPT,

  initialState:
    H_EARTH_INITIAL_STATE_CANDIDATE,

  createInitialState:
    createHEarthCatalogInitialState,

  evaluateRuntimeFieldCoverage:
    evaluateHEarthRuntimeFieldCoverage,

  runtimeFieldCoverageReceipt:
    H_EARTH_RUNTIME_FIELD_COVERAGE_RECEIPT,

  integrationReceipt:
    H_EARTH_STATE_INTEGRATION_RECEIPT,

  boundary:
    H_EARTH_STATE_BOUNDARY
});
