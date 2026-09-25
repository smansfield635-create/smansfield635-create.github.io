// /showroom/globe/h-earth/region-domain-consumer-preflight.js
// COMPLETE RENEWED FILE
// H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FILE_BIRTH_STEP_008C_CLAIM_BOUNDARY_FAILURE_TAXONOMY_v1
//
// Renews:
// H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FILE_BIRTH_STEP_008B_BINDING_SCHEMA_AND_WARNING_ALIGNMENT_v1
//
// Consumes:
// /showroom/globe/h-earth/region-foundation.js
// H_EARTH_REGION_FOUNDATION_FILE_BIRTH_STEP_003_SPACE_LATTICE_FOUNDATION_v1
//
// /showroom/globe/h-earth/region-summits.js
// H_EARTH_REGION_SUMMITS_FILE_BIRTH_STEP_007D_PUBLIC_JURISDICTION_EXPORT_FILTER_v1
//
// Purpose:
// Defines and preflights the lawful dependency boundary between the Path 3
// static spatial foundation and the /h-earth-3d/ scratch domain/runtime layer.
//
// This file creates descriptor-only consumer-boundary records.
//
// It does not import from /h-earth-3d/.
// It does not mutate /h-earth-3d/.
// It does not renew scratch files.
// It does not activate runtime.
// It does not create renderer behavior.
// It does not independently preflight specialist NEWS/Fibonacci consumer APIs.
//
// Dependency law:
// /showroom/globe/h-earth/ may define Path 3 static spatial authority.
// /h-earth-3d/ may consume Path 3.
// /showroom/globe/h-earth/ must not depend on /h-earth-3d/.

import {
  H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
  describeHEarthFoundationCoordinate,
  getHEarthFoundationCellById
} from './region-foundation.js';

import {
  H_EARTH_REGION_SUMMITS_CONTRACT_ID,
  H_EARTH_REGION_SUMMIT_RECEIPT_STATUSES,
  getHEarthRegionSummitJurisdictionByCellId,
  getHEarthRegionSummitSummary,
  getHEarthRegionSummitsReceipt
} from './region-summits.js';

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CONTRACT_ID =
  'H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FILE_BIRTH_STEP_008C_CLAIM_BOUNDARY_FAILURE_TAXONOMY_v1';

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RENEWS_CONTRACT_ID =
  'H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FILE_BIRTH_STEP_008B_BINDING_SCHEMA_AND_WARNING_ALIGNMENT_v1';

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_STATUS =
  Object.freeze({
    path: 'PATH_3_COORDINATE_GOVERNED_IMMERSIVE_REGION',
    buildStage: 'DOMAIN_CONSUMER_PREFLIGHT_ONLY',
    implementationClass: 'STATIC_BOUNDARY_AND_BINDING_DESCRIPTOR',

    productionClaim: false,
    validationClaim: false,
    visualPassClaim: false,
    rendererClaim: false,
    runtimeActivationClaim: false,
    travelClaim: false,
    mutationClaim: false,
    saveReplayClaim: false,
    hEarth3DMutationClaim: false,
    scratchFileRenewalClaim: false,
    specialistNewsConsumerAccessClaim: false,
    specialistFibonacciConsumerAccessClaim: false,

    claimBoundaryPreserved: true
  });

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_OWNERSHIP =
  Object.freeze({
    consumesRegionFoundation: true,
    consumesRegionSummits: true,

    declaresDependencyDirection: true,
    declaresAuthoritySeparation: true,
    declaresBindingLaw: true,
    checksCandidateBindingDescriptorStructure: true,
    classifiesAllClaimBoundaryFailures: true,
    createsCandidateBindingDescriptor: true,
    alignsWarningsWithPreflightChecks: true,
    createsPreflightReceipt: true,

    importsFromHEarth3D: false,
    mutatesHEarth3D: false,
    renewsHEarth3DFiles: false,
    activatesRuntime: false,
    createsRenderer: false,
    createsTravelController: false,
    createsMutationEngine: false,
    createsSaveReplaySystem: false,

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsFibonacciProjection: false,
    createsSummitJurisdiction: false,

    claimBoundaryPreserved: true
  });

export const H_EARTH_REGION_DOMAIN_CONSUMER_DEPENDENCY_DIRECTION =
  Object.freeze({
    path3StaticFoundationPath: '/showroom/globe/h-earth/',
    hEarth3DScratchDomainPath: '/h-earth-3d/',

    path3MayDependOnHEarth3D: false,
    hEarth3DMayConsumePath3: true,

    reverseDependencyProhibited: true,

    allowedDependencyDirection:
      '/h-earth-3d/ -> /showroom/globe/h-earth/',

    prohibitedDependencyDirection:
      '/showroom/globe/h-earth/ -> /h-earth-3d/',

    thisFileImportsHEarth3D: false,
    thisFileReadsHEarth3DFiles: false,
    thisFileMutatesHEarth3DFiles: false,

    claimBoundaryPreserved: true
  });

export const H_EARTH_REGION_DOMAIN_CONSUMER_AUTHORITY_SEPARATION =
  Object.freeze({
    path3Owns: Object.freeze([
      'coordinate-space',
      'region-bounds',
      'lattice-cell-ids',
      'neutral-256-cell-lattice',
      'NEWS-classification',
      'Fibonacci-projection',
      'Nine-Summit-macro-jurisdiction',
      'static-spatial-address-authority'
    ]),

    hEarth3DOwns: Object.freeze([
      'domain-cell-realization',
      'zones',
      'objects',
      'actions',
      'readouts',
      'mutable-runtime-state',
      'receipts',
      'non-rendering-harness',
      'future-render-descriptors'
    ]),

    path3Question:
      'Where does this exist, what spatial identity does it have, and which macro jurisdiction contains it?',

    hEarth3DQuestion:
      'What exists there, what can happen there, what state can change, and what the player experiences?',

    hEarth3DMayRedefineCoordinates: false,
    hEarth3DMayRedefineLatticeCells: false,
    hEarth3DMayRedefineNewsClassification: false,
    hEarth3DMayRedefineFibonacciProjection: false,
    hEarth3DMayRedefineSummitJurisdiction: false,

    path3MayDefineDomainObjects: false,
    path3MayDefineActions: false,
    path3MayDefineReadouts: false,
    path3MayDefineMutableRuntimeState: false,

    specialistNewsConsumerAccessDeferred: true,
    specialistFibonacciConsumerAccessDeferred: true,

    claimBoundaryPreserved: true
  });

export const H_EARTH_REGION_DOMAIN_BINDING_CLASSES = Object.freeze({
  DOMAIN_REALIZATION_OF_SPATIAL_CELL:
    'DOMAIN_REALIZATION_OF_SPATIAL_CELL'
});

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES =
  Object.freeze({
    PASS: 'PASS',
    PASS_WITH_WARNINGS: 'PASS_WITH_WARNINGS',
    FAIL: 'FAIL'
  });

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES =
  Object.freeze({
    SPATIAL_CELL_UNRESOLVED: 'SPATIAL_CELL_UNRESOLVED',
    FOUNDATION_COORDINATE_UNACCEPTED: 'FOUNDATION_COORDINATE_UNACCEPTED',
    SUMMIT_PUBLIC_JURISDICTION_UNRESOLVED:
      'SUMMIT_PUBLIC_JURISDICTION_UNRESOLVED',

    REVERSE_DEPENDENCY_DECLARED: 'REVERSE_DEPENDENCY_DECLARED',
    DOMAIN_REDEFINES_PATH3_AUTHORITY:
      'DOMAIN_REDEFINES_PATH3_AUTHORITY',

    DOMAIN_BINDING_DESCRIPTOR_INCOMPLETE:
      'DOMAIN_BINDING_DESCRIPTOR_INCOMPLETE',
    DOMAIN_BINDING_CLASS_UNAUTHORIZED:
      'DOMAIN_BINDING_CLASS_UNAUTHORIZED',
    DOMAIN_BINDING_PATH_MISMATCH:
      'DOMAIN_BINDING_PATH_MISMATCH',

    SPATIAL_AUTHORITY_SOURCE_MISMATCH:
      'SPATIAL_AUTHORITY_SOURCE_MISMATCH',
    DOMAIN_RUNTIME_OWNERSHIP_DECLARATION_INVALID:
      'DOMAIN_RUNTIME_OWNERSHIP_DECLARATION_INVALID',

    RUNTIME_ACTIVATION_CLAIM_PRESENT:
      'RUNTIME_ACTIVATION_CLAIM_PRESENT',
    RENDERER_CLAIM_PRESENT:
      'RENDERER_CLAIM_PRESENT',
    TRAVEL_CLAIM_PRESENT:
      'TRAVEL_CLAIM_PRESENT',
    MUTATION_CLAIM_PRESENT:
      'MUTATION_CLAIM_PRESENT',
    SAVE_REPLAY_CLAIM_PRESENT:
      'SAVE_REPLAY_CLAIM_PRESENT',
    VALIDATION_CLAIM_PRESENT:
      'VALIDATION_CLAIM_PRESENT',
    PRODUCTION_CLAIM_PRESENT:
      'PRODUCTION_CLAIM_PRESENT',
    VISUAL_PASS_CLAIM_PRESENT:
      'VISUAL_PASS_CLAIM_PRESENT',

    WARNING_REGISTRY_ENTRY_UNRESOLVED:
      'WARNING_REGISTRY_ENTRY_UNRESOLVED'
  });

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_WARNING_RECORDS =
  Object.freeze([
    Object.freeze({
      checkId: 'SCRATCH_FILE_AUDIT_DEFERRED_PREFLIGHT',
      warningId: 'PREFLIGHT_WARNING_01_SCRATCH_FILES_NOT_IMPORTED',
      severity: 'MINOR_EVIDENCE_WARNING',
      summary:
        'Scratch files are retained and require audit/binding, but this Path 3 preflight does not import or mutate them.',
      claim: 'SCRATCH_FILE_CONFORMANCE_NOT_CLAIMED'
    }),

    Object.freeze({
      checkId: 'CANDIDATE_BINDING_IMPLEMENTATION_DEFERRED_PREFLIGHT',
      warningId: 'PREFLIGHT_WARNING_02_BINDING_IS_CANDIDATE_DESCRIPTOR',
      severity: 'MINOR_EVIDENCE_WARNING',
      summary:
        'The initial binding is descriptor-only and has not been implemented inside /h-earth-3d/.',
      claim: 'DOMAIN_BINDING_IMPLEMENTATION_NOT_CLAIMED'
    }),

    Object.freeze({
      checkId: 'SPECIALIST_NEWS_FIBONACCI_ACCESS_DEFERRED_PREFLIGHT',
      warningId:
        'PREFLIGHT_WARNING_03_SPECIALIST_NEWS_FIBONACCI_ACCESS_DEFERRED',
      severity: 'MINOR_EVIDENCE_WARNING',
      summary:
        'This Step 008C file consumes foundation and summits only. Direct specialist NEWS/Fibonacci consumer access is deferred.',
      claim:
        'SPECIALIST_NEWS_FIBONACCI_CONSUMER_ACCESS_NOT_CLAIMED'
    })
  ]);

export const H_EARTH_REGION_INITIAL_DOMAIN_BINDING_CANDIDATE =
  Object.freeze({
    bindingId:
      'H_EARTH_DOMAIN_BINDING_CANDIDATE_GROUND_CELL_001_TO_REGION_CELL_X07_Z08',

    bindingClass:
      H_EARTH_REGION_DOMAIN_BINDING_CLASSES
        .DOMAIN_REALIZATION_OF_SPATIAL_CELL,

    spatialCellId: 'H_EARTH_REGION_CELL_X07_Z08',
    domainCellId: 'H_EARTH_GROUND_CELL_001',

    domainLayerPath: '/h-earth-3d/',
    spatialFoundationPath: '/showroom/globe/h-earth/',

    path3SpatialAuthority: true,
    spatialAuthoritySource: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,

    domainLayerMayOwnGovernedRuntimeState: true,
    runtimeStateImplemented: false,

    path3DependsOnDomain: false,
    domainMayRedefineCoordinates: false,
    domainMayRedefineLatticeCells: false,
    domainMayRedefineNewsClassification: false,
    domainMayRedefineFibonacciProjection: false,
    domainMayRedefineSummitJurisdiction: false,

    runtimeActivationClaim: false,
    rendererClaim: false,
    travelClaim: false,
    mutationClaim: false,
    saveReplayClaim: false,
    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    descriptorOnly: true,
    claimBoundaryPreserved: true
  });

function freezePlain(value) {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return Object.freeze(value.map((item) => freezePlain(item)));
  }

  const output = {};

  Object.keys(value).forEach((key) => {
    output[key] = freezePlain(value[key]);
  });

  return Object.freeze(output);
}

function createPreflightCheck({
  checkId,
  status,
  severity = 'INFO',
  summary,
  details = null,
  failureClasses = []
}) {
  return freezePlain({
    checkId,
    status,
    severity,
    summary,
    details,
    failureClasses,
    claimBoundaryPreserved: true
  });
}

function createMissingWarningRecordFailure(checkId) {
  return createPreflightCheck({
    checkId: 'WARNING_REGISTRY_ENTRY_UNRESOLVED',
    status:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,
    severity: 'BLOCKER',
    summary:
      'A required preflight warning record could not be resolved from the warning registry.',
    details: {
      requestedCheckId: checkId,
      warningRegistryEntryResolved: false
    },
    failureClasses: [
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .WARNING_REGISTRY_ENTRY_UNRESOLVED
    ]
  });
}

function createWarningPreflightCheck(warningRecord, details = null) {
  if (!warningRecord) {
    return createMissingWarningRecordFailure('UNKNOWN_WARNING_CHECK');
  }

  return createPreflightCheck({
    checkId: warningRecord.checkId,
    status:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES
        .PASS_WITH_WARNINGS,
    severity: warningRecord.severity,
    summary: warningRecord.summary,
    details: {
      warningId: warningRecord.warningId,
      claim: warningRecord.claim,
      ...(details || {})
    },
    failureClasses: []
  });
}

function getWarningRecordByCheckId(checkId) {
  return (
    H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_WARNING_RECORDS.find(
      (record) => record.checkId === checkId
    ) || null
  );
}

function isPassStatus(status) {
  return (
    status ===
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.PASS ||
    status ===
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES
        .PASS_WITH_WARNINGS
  );
}

function collectFailures(checks) {
  return Object.freeze(
    (Array.isArray(checks) ? checks : []).filter(
      (check) =>
        check.status ===
        H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL
    )
  );
}

function collectWarnings(checks) {
  return Object.freeze(
    (Array.isArray(checks) ? checks : []).filter(
      (check) =>
        check.status ===
          H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES
            .PASS_WITH_WARNINGS ||
        check.severity === 'MINOR_EVIDENCE_WARNING'
    )
  );
}

function hasNonemptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function sameSortedStringArray(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right)) {
    return false;
  }

  if (left.length !== right.length) {
    return false;
  }

  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();

  return sortedLeft.every((value, index) => value === sortedRight[index]);
}

function checkDependencyDirection() {
  const direction = H_EARTH_REGION_DOMAIN_CONSUMER_DEPENDENCY_DIRECTION;

  const pass =
    direction.path3MayDependOnHEarth3D === false &&
    direction.hEarth3DMayConsumePath3 === true &&
    direction.reverseDependencyProhibited === true &&
    direction.thisFileImportsHEarth3D === false &&
    direction.thisFileReadsHEarth3DFiles === false &&
    direction.thisFileMutatesHEarth3DFiles === false;

  return createPreflightCheck({
    checkId: 'DEPENDENCY_DIRECTION_PREFLIGHT',
    status: pass
      ? H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.PASS
      : H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Verifies Path 3 does not declare dependency on /h-earth-3d/ while /h-earth-3d/ is allowed to consume Path 3.',
    details: direction,
    failureClasses: pass
      ? []
      : [
          H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
            .REVERSE_DEPENDENCY_DECLARED
        ]
  });
}

function checkAuthoritySeparation() {
  const authority =
    H_EARTH_REGION_DOMAIN_CONSUMER_AUTHORITY_SEPARATION;

  const pass =
    authority.hEarth3DMayRedefineCoordinates === false &&
    authority.hEarth3DMayRedefineLatticeCells === false &&
    authority.hEarth3DMayRedefineNewsClassification === false &&
    authority.hEarth3DMayRedefineFibonacciProjection === false &&
    authority.hEarth3DMayRedefineSummitJurisdiction === false &&
    authority.path3MayDefineDomainObjects === false &&
    authority.path3MayDefineActions === false &&
    authority.path3MayDefineReadouts === false &&
    authority.path3MayDefineMutableRuntimeState === false;

  return createPreflightCheck({
    checkId: 'AUTHORITY_SEPARATION_PREFLIGHT',
    status: pass
      ? H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.PASS
      : H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Verifies Path 3 and /h-earth-3d/ ownership boundaries remain separated.',
    details: authority,
    failureClasses: pass
      ? []
      : [
          H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
            .DOMAIN_REDEFINES_PATH3_AUTHORITY
        ]
  });
}

function checkInitialBindingDescriptorStructure(candidate) {
  const failureClasses = [];

  const bindingIdPresent = hasNonemptyString(candidate.bindingId);
  const spatialCellIdPresent = hasNonemptyString(candidate.spatialCellId);
  const domainCellIdPresent = hasNonemptyString(candidate.domainCellId);

  const bindingClassPass =
    candidate.bindingClass ===
    H_EARTH_REGION_DOMAIN_BINDING_CLASSES
      .DOMAIN_REALIZATION_OF_SPATIAL_CELL;

  const pathPass =
    candidate.domainLayerPath === '/h-earth-3d/' &&
    candidate.spatialFoundationPath === '/showroom/globe/h-earth/';

  const descriptorOnlyPass = candidate.descriptorOnly === true;

  if (!bindingIdPresent || !spatialCellIdPresent || !domainCellIdPresent) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .DOMAIN_BINDING_DESCRIPTOR_INCOMPLETE
    );
  }

  if (!bindingClassPass) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .DOMAIN_BINDING_CLASS_UNAUTHORIZED
    );
  }

  if (!pathPass) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .DOMAIN_BINDING_PATH_MISMATCH
    );
  }

  if (!descriptorOnlyPass) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .DOMAIN_BINDING_DESCRIPTOR_INCOMPLETE
    );
  }

  const pass =
    bindingIdPresent &&
    spatialCellIdPresent &&
    domainCellIdPresent &&
    bindingClassPass &&
    pathPass &&
    descriptorOnlyPass;

  return createPreflightCheck({
    checkId: 'INITIAL_BINDING_DESCRIPTOR_STRUCTURE_PREFLIGHT',
    status: pass
      ? H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.PASS
      : H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Verifies that the candidate binding contains complete spatial and domain identities and uses the authorized binding class.',
    details: {
      bindingIdPresent,
      spatialCellIdPresent,
      domainCellIdPresent,
      bindingClassPass,
      pathPass,
      descriptorOnlyPass,
      candidate
    },
    failureClasses
  });
}

function checkInitialBindingSpatialCell(candidate) {
  const cell = getHEarthFoundationCellById(candidate.spatialCellId);

  const foundationCoordinate =
    cell?.center
      ? describeHEarthFoundationCoordinate(cell.center)
      : null;

  const pass =
    Boolean(cell?.cellId) &&
    foundationCoordinate?.foundationAccepted === true;

  const failureClasses = [];

  if (!cell?.cellId) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .SPATIAL_CELL_UNRESOLVED
    );
  }

  if (
    cell?.cellId &&
    foundationCoordinate?.foundationAccepted !== true
  ) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .FOUNDATION_COORDINATE_UNACCEPTED
    );
  }

  return createPreflightCheck({
    checkId: 'INITIAL_BINDING_SPATIAL_CELL_PREFLIGHT',
    status: pass
      ? H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.PASS
      : H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Verifies the first candidate domain binding references an existing Path 3 spatial cell.',
    details: {
      bindingId: candidate.bindingId,
      spatialCellId: candidate.spatialCellId,
      resolvedCell: cell || null,
      foundationCoordinate
    },
    failureClasses
  });
}

function checkInitialBindingSummitJurisdiction(candidate) {
  const jurisdiction = getHEarthRegionSummitJurisdictionByCellId(
    candidate.spatialCellId
  );

  const pass = Boolean(jurisdiction?.summit?.summitId);

  return createPreflightCheck({
    checkId: 'INITIAL_BINDING_SUMMIT_JURISDICTION_PREFLIGHT',
    status: pass
      ? H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.PASS
      : H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Verifies the first candidate domain binding can resolve constructed public summit jurisdiction from Path 3.',
    details: {
      bindingId: candidate.bindingId,
      spatialCellId: candidate.spatialCellId,
      jurisdiction
    },
    failureClasses: pass
      ? []
      : [
          H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
            .SUMMIT_PUBLIC_JURISDICTION_UNRESOLVED
        ]
  });
}

function checkInitialBindingClaimBoundary(candidate) {
  const failureClasses = [];

  if (
    candidate.path3SpatialAuthority !== true ||
    candidate.spatialAuthoritySource !==
      H_EARTH_REGION_FOUNDATION_CONTRACT_ID
  ) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .SPATIAL_AUTHORITY_SOURCE_MISMATCH
    );
  }

  if (
    candidate.domainLayerMayOwnGovernedRuntimeState !== true ||
    candidate.runtimeStateImplemented !== false
  ) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .DOMAIN_RUNTIME_OWNERSHIP_DECLARATION_INVALID
    );
  }

  if (candidate.path3DependsOnDomain !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .REVERSE_DEPENDENCY_DECLARED
    );
  }

  if (
    candidate.domainMayRedefineCoordinates !== false ||
    candidate.domainMayRedefineLatticeCells !== false ||
    candidate.domainMayRedefineNewsClassification !== false ||
    candidate.domainMayRedefineFibonacciProjection !== false ||
    candidate.domainMayRedefineSummitJurisdiction !== false
  ) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .DOMAIN_REDEFINES_PATH3_AUTHORITY
    );
  }

  if (candidate.runtimeActivationClaim !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .RUNTIME_ACTIVATION_CLAIM_PRESENT
    );
  }

  if (candidate.rendererClaim !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .RENDERER_CLAIM_PRESENT
    );
  }

  if (candidate.travelClaim !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .TRAVEL_CLAIM_PRESENT
    );
  }

  if (candidate.mutationClaim !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .MUTATION_CLAIM_PRESENT
    );
  }

  if (candidate.saveReplayClaim !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .SAVE_REPLAY_CLAIM_PRESENT
    );
  }

  if (candidate.validationClaim !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .VALIDATION_CLAIM_PRESENT
    );
  }

  if (candidate.productionClaim !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .PRODUCTION_CLAIM_PRESENT
    );
  }

  if (candidate.visualPassClaim !== false) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .VISUAL_PASS_CLAIM_PRESENT
    );
  }

  if (candidate.descriptorOnly !== true) {
    failureClasses.push(
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
        .DOMAIN_BINDING_DESCRIPTOR_INCOMPLETE
    );
  }

  const pass =
    candidate.path3SpatialAuthority === true &&
    candidate.spatialAuthoritySource ===
      H_EARTH_REGION_FOUNDATION_CONTRACT_ID &&
    candidate.domainLayerMayOwnGovernedRuntimeState === true &&
    candidate.runtimeStateImplemented === false &&
    candidate.path3DependsOnDomain === false &&
    candidate.domainMayRedefineCoordinates === false &&
    candidate.domainMayRedefineLatticeCells === false &&
    candidate.domainMayRedefineNewsClassification === false &&
    candidate.domainMayRedefineFibonacciProjection === false &&
    candidate.domainMayRedefineSummitJurisdiction === false &&
    candidate.runtimeActivationClaim === false &&
    candidate.rendererClaim === false &&
    candidate.travelClaim === false &&
    candidate.mutationClaim === false &&
    candidate.saveReplayClaim === false &&
    candidate.validationClaim === false &&
    candidate.productionClaim === false &&
    candidate.visualPassClaim === false &&
    candidate.descriptorOnly === true;

  return createPreflightCheck({
    checkId: 'INITIAL_BINDING_CLAIM_BOUNDARY_PREFLIGHT',
    status: pass
      ? H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.PASS
      : H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Verifies the candidate binding reserves domain runtime ownership without claiming runtime activation, rendering, travel, mutation, save/replay, validation, production, or visual pass.',
    details: candidate,
    failureClasses
  });
}

function checkSummitFoundationAvailability() {
  const summary = getHEarthRegionSummitSummary();
  const receipt = getHEarthRegionSummitsReceipt();

  const pass =
    summary?.receiptStatus ===
      H_EARTH_REGION_SUMMIT_RECEIPT_STATUSES.DEFINED &&
    receipt?.status ===
      H_EARTH_REGION_SUMMIT_RECEIPT_STATUSES.DEFINED &&
    summary?.publicConstructedSummitLookupFilterEnabled === true;

  return createPreflightCheck({
    checkId: 'SUMMIT_FOUNDATION_AVAILABILITY_PREFLIGHT',
    status: pass
      ? H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.PASS
      : H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Verifies Step 007D summit macro jurisdiction is available as constructed public jurisdiction before domain binding.',
    details: {
      expectedStatus: H_EARTH_REGION_SUMMIT_RECEIPT_STATUSES.DEFINED,
      summary,
      receipt
    },
    failureClasses: pass
      ? []
      : [
          H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_FAILURE_CLASSES
            .SUMMIT_PUBLIC_JURISDICTION_UNRESOLVED
        ]
  });
}

function checkScratchAuditDeferred() {
  const checkId = 'SCRATCH_FILE_AUDIT_DEFERRED_PREFLIGHT';
  const warning = getWarningRecordByCheckId(checkId);

  if (!warning) {
    return createMissingWarningRecordFailure(checkId);
  }

  return createWarningPreflightCheck(warning, {
    scratchFilesDiscarded: false,
    scratchFilesRequireAuditAndBinding: true,
    hEarth3DMayConsumePath3: true,
    path3MayDependOnHEarth3D: false,
    scratchFileConformanceClaim: false,
    scratchFileMutationClaim: false
  });
}

function checkCandidateBindingImplementationDeferred() {
  const checkId = 'CANDIDATE_BINDING_IMPLEMENTATION_DEFERRED_PREFLIGHT';
  const warning = getWarningRecordByCheckId(checkId);

  if (!warning) {
    return createMissingWarningRecordFailure(checkId);
  }

  return createWarningPreflightCheck(warning, {
    bindingCandidateId:
      H_EARTH_REGION_INITIAL_DOMAIN_BINDING_CANDIDATE.bindingId,
    implementedInHEarth3D: false,
    mutatesHEarth3D: false,
    runtimeActivationClaim: false,
    rendererClaim: false,
    validationClaim: false
  });
}

function checkSpecialistNewsFibonacciAccessDeferred() {
  const checkId =
    'SPECIALIST_NEWS_FIBONACCI_ACCESS_DEFERRED_PREFLIGHT';
  const warning = getWarningRecordByCheckId(checkId);

  if (!warning) {
    return createMissingWarningRecordFailure(checkId);
  }

  return createWarningPreflightCheck(warning, {
    directSpecialistNewsImport: false,
    directSpecialistFibonacciImport: false,
    observedThroughSummitJurisdiction: true,
    specialistConsumerPreflightDeferred: true
  });
}

export function buildHEarthRegionDomainConsumerPreflightChecks() {
  const candidate = H_EARTH_REGION_INITIAL_DOMAIN_BINDING_CANDIDATE;

  return Object.freeze([
    checkDependencyDirection(),
    checkAuthoritySeparation(),
    checkSummitFoundationAvailability(),
    checkInitialBindingDescriptorStructure(candidate),
    checkInitialBindingSpatialCell(candidate),
    checkInitialBindingSummitJurisdiction(candidate),
    checkInitialBindingClaimBoundary(candidate),
    checkScratchAuditDeferred(),
    checkCandidateBindingImplementationDeferred(),
    checkSpecialistNewsFibonacciAccessDeferred()
  ]);
}

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CHECKS =
  buildHEarthRegionDomainConsumerPreflightChecks();

export function getHEarthRegionDomainConsumerPreflightChecks() {
  return H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CHECKS;
}

export function getHEarthRegionDomainConsumerPreflightFailures() {
  return collectFailures(
    H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CHECKS
  );
}

export function getHEarthRegionDomainConsumerPreflightWarnings() {
  return collectWarnings(
    H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CHECKS
  );
}

export function getHEarthRegionDomainConsumerPreflightOverallStatus() {
  const failures = getHEarthRegionDomainConsumerPreflightFailures();
  const warnings = getHEarthRegionDomainConsumerPreflightWarnings();

  if (failures.length > 0) {
    return H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES
      .FAIL;
  }

  if (warnings.length > 0) {
    return H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES
      .PASS_WITH_WARNINGS;
  }

  return H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES
    .PASS;
}

export function getHEarthRegionDomainConsumerBindingCandidate() {
  const candidate = H_EARTH_REGION_INITIAL_DOMAIN_BINDING_CANDIDATE;

  const cell = getHEarthFoundationCellById(candidate.spatialCellId);

  const summitJurisdiction =
    getHEarthRegionSummitJurisdictionByCellId(
      candidate.spatialCellId
    );

  return freezePlain({
    ...candidate,

    resolvedPath3: {
      spatialCellResolved: Boolean(cell?.cellId),
      spatialCell: cell || null,

      summitJurisdictionResolved:
        Boolean(summitJurisdiction?.summit?.summitId),

      summitJurisdiction: summitJurisdiction || null
    },

    bindingStatus:
      Boolean(cell?.cellId) &&
      Boolean(summitJurisdiction?.summit?.summitId)
        ? 'CANDIDATE_BINDING_SPATIAL_AUTHORITY_RESOLVED'
        : 'CANDIDATE_BINDING_SPATIAL_AUTHORITY_UNRESOLVED',

    implementedInHEarth3D: false,
    mutatesHEarth3D: false,
    runtimeStateImplemented: false,
    runtimeActivationClaim: false,
    rendererClaim: false,
    validationClaim: false,

    claimBoundaryPreserved: true
  });
}

function getWarningAlignmentEvidence(warnings) {
  const registeredWarningCheckIds =
    H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_WARNING_RECORDS.map(
      (record) => record.checkId
    );

  const emittedWarningCheckIds = (Array.isArray(warnings) ? warnings : [])
    .map((warning) => warning.checkId)
    .filter(Boolean);

  return freezePlain({
    registeredWarningCheckIds,
    emittedWarningCheckIds,

    warningRegistryAlignedWithChecks:
      sameSortedStringArray(
        registeredWarningCheckIds,
        emittedWarningCheckIds
      )
  });
}

export function getHEarthRegionDomainConsumerPreflightReport() {
  const checks = getHEarthRegionDomainConsumerPreflightChecks();
  const failures = getHEarthRegionDomainConsumerPreflightFailures();
  const warnings = getHEarthRegionDomainConsumerPreflightWarnings();
  const overallStatus =
    getHEarthRegionDomainConsumerPreflightOverallStatus();

  const warningAlignmentEvidence =
    getWarningAlignmentEvidence(warnings);

  return freezePlain({
    reportId:
      'H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_REPORT_STEP_008C_CLAIM_BOUNDARY_FAILURE_TAXONOMY_v1',

    contractId:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CONTRACT_ID,

    renewsContractId:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RENEWS_CONTRACT_ID,

    consumedContracts: {
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionSummits: H_EARTH_REGION_SUMMITS_CONTRACT_ID
    },

    overallStatus,

    preflightCheckCount: checks.length,
    failureCount: failures.length,
    warningCount: warnings.length,

    warningRegistryCount:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_WARNING_RECORDS.length,

    warningRegistryAlignedWithChecks:
      warningAlignmentEvidence.warningRegistryAlignedWithChecks,

    warningAlignmentEvidence,

    checks,
    failures,
    warnings,

    dependencyDirection:
      H_EARTH_REGION_DOMAIN_CONSUMER_DEPENDENCY_DIRECTION,

    authoritySeparation:
      H_EARTH_REGION_DOMAIN_CONSUMER_AUTHORITY_SEPARATION,

    bindingCandidate:
      getHEarthRegionDomainConsumerBindingCandidate(),

    scratchFilesDiscarded: false,
    scratchFilesRequireAuditAndBinding: true,

    path3MayDependOnHEarth3D: false,
    hEarth3DMayConsumePath3: true,

    specialistNewsConsumerAccessDeferred: true,
    specialistFibonacciConsumerAccessDeferred: true,

    readyForHEarth3DBindingAudit: isPassStatus(overallStatus),
    readyForRendererPreflight: false,
    readyForRuntimeActivation: false,

    createsRenderer: false,
    createsRuntime: false,
    activatesRuntime: false,
    mutatesHEarth3D: false,
    importsHEarth3D: false,
    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });
}

export const H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT =
  Object.freeze({
    contractId:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CONTRACT_ID,

    renewsContractId:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RENEWS_CONTRACT_ID,

    consumedContracts: Object.freeze({
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionSummits: H_EARTH_REGION_SUMMITS_CONTRACT_ID
    }),

    status: H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_STATUS,
    ownership: H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_OWNERSHIP,

    dependencyDirection:
      H_EARTH_REGION_DOMAIN_CONSUMER_DEPENDENCY_DIRECTION,

    authoritySeparation:
      H_EARTH_REGION_DOMAIN_CONSUMER_AUTHORITY_SEPARATION,

    warningRecords:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_WARNING_RECORDS,

    initialBindingCandidate:
      H_EARTH_REGION_INITIAL_DOMAIN_BINDING_CANDIDATE,

    checks: H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CHECKS,

    overallStatus:
      getHEarthRegionDomainConsumerPreflightOverallStatus(),

    path3MayDependOnHEarth3D: false,
    hEarth3DMayConsumePath3: true,

    scratchFilesDiscarded: false,
    scratchFilesRequireAuditAndBinding: true,

    specialistNewsConsumerAccessDeferred: true,
    specialistFibonacciConsumerAccessDeferred: true,

    readyForHEarth3DBindingAudit:
      getHEarthRegionDomainConsumerPreflightOverallStatus() !==
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RESULT_STATUSES.FAIL,

    readyForRendererPreflight: false,
    readyForRuntimeActivation: false,

    createsRenderer: false,
    createsRuntime: false,
    activatesRuntime: false,
    importsHEarth3D: false,
    mutatesHEarth3D: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });

export function getHEarthRegionDomainConsumerPreflightContract() {
  return H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT;
}

export function getHEarthRegionDomainConsumerPreflightReceipt() {
  const report = getHEarthRegionDomainConsumerPreflightReport();

  return freezePlain({
    receiptId:
      'H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RECEIPT_STEP_008C_CLAIM_BOUNDARY_FAILURE_TAXONOMY_v1',

    contractId:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_CONTRACT_ID,

    renewsContractId:
      H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT_RENEWS_CONTRACT_ID,

    consumedContracts: {
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionSummits: H_EARTH_REGION_SUMMITS_CONTRACT_ID
    },

    status: report.overallStatus,

    preflightCheckCount: report.preflightCheckCount,
    failureCount: report.failureCount,
    warningCount: report.warningCount,
    warningRegistryCount: report.warningRegistryCount,
    warningRegistryAlignedWithChecks:
      report.warningRegistryAlignedWithChecks,

    dependencyDirectionLocked:
      report.path3MayDependOnHEarth3D === false &&
      report.hEarth3DMayConsumePath3 === true,

    path3MayDependOnHEarth3D: false,
    hEarth3DMayConsumePath3: true,

    scratchFilesDiscarded: false,
    scratchFilesRequireAuditAndBinding: true,

    specialistNewsConsumerAccessDeferred: true,
    specialistFibonacciConsumerAccessDeferred: true,

    bindingCandidateId:
      report.bindingCandidate.bindingId,

    spatialCellId:
      report.bindingCandidate.spatialCellId,

    domainCellId:
      report.bindingCandidate.domainCellId,

    bindingClass:
      report.bindingCandidate.bindingClass,

    path3SpatialAuthority:
      report.bindingCandidate.path3SpatialAuthority,

    spatialAuthoritySource:
      report.bindingCandidate.spatialAuthoritySource,

    domainLayerMayOwnGovernedRuntimeState:
      report.bindingCandidate.domainLayerMayOwnGovernedRuntimeState,

    runtimeStateImplemented:
      report.bindingCandidate.runtimeStateImplemented,

    spatialCellResolved:
      report.bindingCandidate.resolvedPath3.spatialCellResolved,

    summitJurisdictionResolved:
      report.bindingCandidate.resolvedPath3
        .summitJurisdictionResolved,

    readyForHEarth3DBindingAudit:
      report.readyForHEarth3DBindingAudit,

    readyForRendererPreflight: false,
    readyForRuntimeActivation: false,

    createsRenderer: false,
    createsRuntime: false,
    activatesRuntime: false,
    importsHEarth3D: false,
    mutatesHEarth3D: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });
}

export default H_EARTH_REGION_DOMAIN_CONSUMER_PREFLIGHT;
