// /showroom/globe/h-earth/region-summits.js
// COMPLETE RENEWED FILE
// H_EARTH_REGION_SUMMITS_FILE_BIRTH_STEP_007D_PUBLIC_JURISDICTION_EXPORT_FILTER_v1
//
// Renews:
// H_EARTH_REGION_SUMMITS_FILE_BIRTH_STEP_007C_MACRO_ANCHOR_PUBLIC_LOOKUP_FAIL_CLOSED_v1
//
// Consumes:
// /showroom/globe/h-earth/region-foundation.js
// H_EARTH_REGION_FOUNDATION_FILE_BIRTH_STEP_003_SPACE_LATTICE_FOUNDATION_v1
//
// /showroom/globe/h-earth/region-news.js
// H_EARTH_REGION_NEWS_FILE_BIRTH_STEP_004_DIRECTIONAL_CLASSIFICATION_v1
//
// /showroom/globe/h-earth/region-fibonacci.js
// H_EARTH_REGION_FIBONACCI_FILE_BIRTH_STEP_005_SEQUENCE_PROJECTION_v1
//
// Context:
// /showroom/globe/h-earth/region-integrity.js
// H_EARTH_REGION_INTEGRITY_FILE_BIRTH_STEP_006_FOUNDATION_SPINE_AUDIT_v1
// is the lower-spine audit for Steps 001–005. This file does not import it.
//
// Purpose:
// Defines Nine Summit macro-anchor slot identity, continuous placement,
// derived relations, deterministic raw cell assignment, constructed public
// jurisdiction filtering, and fail-closed public lookup behavior over the
// existing H-Earth Path 3 foundation.
//
// This file creates static macro-anchor descriptors only.
//
// It does not create:
// - coordinate space
// - lattice cells
// - NEWS classification
// - Fibonacci projection
// - final Fibonacci governance
// - NEWS/Fibonacci synchronization
// - chronological 256 sequencing
// - renderer behavior
// - camera behavior
// - travel behavior
// - streaming/loading/visibility behavior
// - terrain
// - mountains
// - water
// - shoreline geometry
// - rocks, puddles, foam, manor, or detail geometry
// - diagnostics runtime
// - production claim
// - validation claim
// - visual-pass claim
// - runtime admission claim
// - renderer admission claim
//
// Ownership:
// region-summits.js owns:
// - Nine Summit macro-anchor slot identity records
// - continuous XYZ anchor placement
// - derived anchor cell relation
// - derived NEWS relation
// - derived Fibonacci projection relation
// - deterministic raw authored-slot jurisdiction assignment
// - constructed-descriptor-governed public jurisdiction map
// - fail-closed constructed-summit public lookup filtering
// - summit lookup helpers
// - summit receipt
//
// region-summits.js does not own:
// - axis law
// - origin
// - region bounds
// - cell creation
// - NEWS classification law
// - Fibonacci projection law
// - renderer target generation
// - travel authorization
// - loading priority
// - terrain expression
// - final domain summit identity
//
// Anchor model:
// Hybrid placement.
// - Summit slots, technical IDs, anchor classes, and broad continuous
//   coordinates are authored.
// - Containing cell, NEWS relation, Fibonacci relation, and jurisdiction
//   membership are derived from the existing foundation.
//
// Fail-closed export rule:
// Raw deterministic assignment may identify the nearest authored summit slot.
// Public constructed-summit lookup may return only a successfully constructed
// summit descriptor.
// No unqualified public jurisdiction export may alias the raw assignment map.
//
// Boundary:
// A summit anchor is not a mountain.
// A summit jurisdiction is not a travel permission.
// A summit coordinate is not a render target.
// Static descriptor admission is not runtime admission.
// Rejected descriptors are not publicly returned as usable jurisdictions.

import {
  H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
  describeHEarthFoundationCoordinate,
  getHEarthFoundationCells,
  getHEarthFoundationCellByCoordinate
} from './region-foundation.js';

import {
  H_EARTH_REGION_NEWS_CONTRACT_ID,
  getHEarthRegionNewsClassificationByCellId,
  getHEarthRegionNewsClassificationAtCoordinate,
  getHEarthRegionNewsGovernanceOrder,
  getHEarthRegionNewsVisibleCircumferenceOrder
} from './region-news.js';

import {
  H_EARTH_REGION_FIBONACCI_CONTRACT_ID,
  getHEarthRegionFibonacciProjectionByCellId,
  getHEarthRegionFibonacciProjectionAtCoordinate,
  getHEarthRegionFibonacciSequence
} from './region-fibonacci.js';

export const H_EARTH_REGION_SUMMITS_CONTRACT_ID =
  'H_EARTH_REGION_SUMMITS_FILE_BIRTH_STEP_007D_PUBLIC_JURISDICTION_EXPORT_FILTER_v1';

export const H_EARTH_REGION_SUMMITS_RENEWS_CONTRACT_ID =
  'H_EARTH_REGION_SUMMITS_FILE_BIRTH_STEP_007C_MACRO_ANCHOR_PUBLIC_LOOKUP_FAIL_CLOSED_v1';

export const H_EARTH_REGION_SUMMIT_FAILURE_CLASSES = Object.freeze({
  FOUNDATION_COORDINATE_REJECTED: 'FOUNDATION_COORDINATE_REJECTED',
  ANCHOR_CELL_UNRESOLVED: 'ANCHOR_CELL_UNRESOLVED',
  ANCHOR_NEWS_RELATION_UNRESOLVED: 'ANCHOR_NEWS_RELATION_UNRESOLVED',
  ANCHOR_FIBONACCI_RELATION_UNRESOLVED:
    'ANCHOR_FIBONACCI_RELATION_UNRESOLVED',
  JURISDICTION_CONSTRUCTION_FAILED: 'JURISDICTION_CONSTRUCTION_FAILED'
});

export const H_EARTH_REGION_SUMMIT_CONSTRUCTION_STATUSES = Object.freeze({
  CONSTRUCTED: 'SUMMIT_MACRO_DESCRIPTOR_CONSTRUCTED',
  REJECTED: 'SUMMIT_MACRO_DESCRIPTOR_REJECTED'
});

export const H_EARTH_REGION_SUMMIT_RECEIPT_STATUSES = Object.freeze({
  DEFINED: 'NINE_SUMMIT_MACRO_ANCHORS_DEFINED',
  PARTIALLY_DEFINED: 'NINE_SUMMIT_MACRO_ANCHORS_PARTIALLY_DEFINED',
  REJECTED: 'NINE_SUMMIT_MACRO_ANCHOR_CONSTRUCTION_REJECTED'
});

export const H_EARTH_REGION_SUMMITS_STATUS = Object.freeze({
  path: 'PATH_3_COORDINATE_GOVERNED_IMMERSIVE_REGION',
  buildStage: 'NINE_SUMMIT_MACRO_ANCHOR_SLOT_PLACEMENT_ONLY',
  implementationClass: 'STATIC_MACRO_ANCHOR_DESCRIPTOR_LAYER',

  productionClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  rendererClaim: false,
  cameraClaim: false,
  travelClaim: false,
  streamingClaim: false,
  loadingClaim: false,
  visibilityClaim: false,
  terrainClaim: false,
  mountainClaim: false,
  detailGeometryClaim: false,
  finalDomainSummitIdentityClaim: false,
  finalFibonacciGovernanceClaim: false,
  fibonacciSynchronizationClaim: false,
  chronological256SequenceClaim: false,
  runtimeAdmissionClaim: false,
  rendererAdmissionClaim: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_SUMMITS_OWNERSHIP = Object.freeze({
  consumesRegionFoundation: true,
  consumesRegionNews: true,
  consumesRegionFibonacci: true,

  createsMacroAnchorSlotIdentity: true,
  createsContinuousAnchorPlacement: true,
  derivesAnchorCellRelation: true,
  derivesAnchorNewsRelation: true,
  derivesAnchorFibonacciRelation: true,
  derivesRawAuthoredSlotJurisdictionAssignment: true,
  createsConstructedPublicJurisdictionMap: true,
  filtersPublicLookupsToConstructedSummits: true,

  createsCoordinateSpace: false,
  createsLatticeCells: false,
  createsNewsClassification: false,
  createsFibonacciProjection: false,
  createsFinalFibonacciGovernance: false,
  createsFibonacciSynchronization: false,
  createsChronological256Sequence: false,
  createsFinalDomainSummitIdentity: false,
  createsRenderer: false,
  createsCamera: false,
  createsTravelController: false,
  createsRuntimeStreaming: false,
  createsLoadingPriority: false,
  createsVisibilityPipeline: false,
  createsTerrain: false,
  createsMountains: false,
  createsDetailGeometry: false,
  createsDiagnosticsRuntime: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY = Object.freeze({
  placementModel: 'HYBRID_AUTHORED_ANCHORS_DERIVED_RELATIONS',

  authoredElements: Object.freeze([
    'summitId',
    'summitIndex',
    'summitSlot',
    'macroAnchorClass',
    'identityStatus',
    'worldCoordinate'
  ]),

  derivedElements: Object.freeze([
    'anchorCell',
    'anchorNewsRelation',
    'anchorFibonacciProjection',
    'rawJurisdictionAssignment',
    'constructedJurisdictionLookup',
    'jurisdictionNewsProfile',
    'jurisdictionFibonacciProfile'
  ]),

  rawJurisdictionAssignmentScope:
    'AUTHORED_SLOT_CELL_CENTER_ASSIGNMENT',

  publicJurisdictionMapScope:
    'CONSTRUCTED_DESCRIPTOR_GOVERNED_PUBLIC_JURISDICTION',

  constructedDescriptorRequiredForPublicJurisdiction: true,

  jurisdictionAssignmentMethod:
    'NEAREST_CELL_CENTER_TO_CONTINUOUS_XZ_ANCHOR_WITH_STABLE_SUMMIT_INDEX_TIEBREAK',

  continuousNearestMethod:
    'NEAREST_CONTINUOUS_XZ_COORDINATE_TO_SUMMIT_ANCHOR_WITH_STABLE_SUMMIT_INDEX_TIEBREAK',

  distanceMetricForJurisdiction:
    'EUCLIDEAN_XZ_DISTANCE_FROM_EXISTING_CELL_CENTER_TO_SUMMIT_ANCHOR',

  distanceMetricForContinuousNearest:
    'EUCLIDEAN_XZ_DISTANCE_FROM_SUPPLIED_COORDINATE_TO_SUMMIT_ANCHOR',

  numericTiePolicy:
    'CURRENT_ANCHOR_XZ_VALUES_ARE_INTEGER_AND_EXACT_EQUALITY_TIEBREAK_IS_ACCEPTED_FOR_THIS_VERSION',

  anchorCoordinateAuthority:
    'CONTINUOUS_XYZ_COORDINATES_FIRST_CELL_RELATIONS_DERIVED',

  expectedJurisdictionCountsScope:
    'CURRENT_STEP_007D_16_X_16_LATTICE_AND_STEP_007D_ANCHOR_COORDINATES_ONLY',

  createsTerrain: false,
  createsRendererTarget: false,
  createsTravelPermission: false,
  createsLoadingPriority: false,
  createsVisibilityPriority: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_SUMMIT_SLOTS = Object.freeze([
  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_CENTER',
    summitIndex: 0,
    summitSlot: 'CENTER',
    macroAnchorClass: 'CENTER_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'CENTER_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: 0, y: 24, z: 0 })
  }),

  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_NORTH',
    summitIndex: 1,
    summitSlot: 'NORTH',
    macroAnchorClass: 'CARDINAL_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'NORTH_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: 0, y: 32, z: 180 })
  }),

  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_EAST',
    summitIndex: 2,
    summitSlot: 'EAST',
    macroAnchorClass: 'CARDINAL_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'EAST_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: 180, y: 18, z: 0 })
  }),

  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_WEST',
    summitIndex: 3,
    summitSlot: 'WEST',
    macroAnchorClass: 'CARDINAL_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'WEST_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: -180, y: 18, z: 0 })
  }),

  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_SOUTH',
    summitIndex: 4,
    summitSlot: 'SOUTH',
    macroAnchorClass: 'CARDINAL_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'SOUTH_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: 0, y: 12, z: -180 })
  }),

  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_NORTHEAST',
    summitIndex: 5,
    summitSlot: 'NORTHEAST',
    macroAnchorClass: 'INTERCARDINAL_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'NORTHEAST_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: 180, y: 28, z: 180 })
  }),

  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_NORTHWEST',
    summitIndex: 6,
    summitSlot: 'NORTHWEST',
    macroAnchorClass: 'INTERCARDINAL_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'NORTHWEST_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: -180, y: 28, z: 180 })
  }),

  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_SOUTHEAST',
    summitIndex: 7,
    summitSlot: 'SOUTHEAST',
    macroAnchorClass: 'INTERCARDINAL_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'SOUTHEAST_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: 180, y: 14, z: -180 })
  }),

  Object.freeze({
    summitId: 'H_EARTH_SUMMIT_SOUTHWEST',
    summitIndex: 8,
    summitSlot: 'SOUTHWEST',
    macroAnchorClass: 'INTERCARDINAL_MACRO_ANCHOR',
    identityStatus: 'DOMAIN_IDENTITY_RESERVED',
    identityLabel: 'SOUTHWEST_SUMMIT_RESERVED',
    finalDomainIdentity: null,
    worldCoordinate: Object.freeze({ x: -180, y: 14, z: -180 })
  })
]);

export const H_EARTH_REGION_SUMMIT_EXPECTED_JURISDICTION_COUNT_FIXTURE =
  Object.freeze({
    scope:
      'CURRENT_STEP_007D_16_X_16_LATTICE_AND_STEP_007D_ANCHOR_COORDINATES_ONLY',

    counts: Object.freeze({
      H_EARTH_SUMMIT_CENTER: 36,
      H_EARTH_SUMMIT_NORTH: 30,
      H_EARTH_SUMMIT_EAST: 30,
      H_EARTH_SUMMIT_WEST: 30,
      H_EARTH_SUMMIT_SOUTH: 30,
      H_EARTH_SUMMIT_NORTHEAST: 25,
      H_EARTH_SUMMIT_NORTHWEST: 25,
      H_EARTH_SUMMIT_SOUTHEAST: 25,
      H_EARTH_SUMMIT_SOUTHWEST: 25
    }),

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false
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

function squaredDistanceXZ(left, right) {
  if (!left || !right) {
    return Number.POSITIVE_INFINITY;
  }

  const dx = Number(left.x) - Number(right.x);
  const dz = Number(left.z) - Number(right.z);

  if (!Number.isFinite(dx) || !Number.isFinite(dz)) {
    return Number.POSITIVE_INFINITY;
  }

  return dx * dx + dz * dz;
}

function getStableSummitSlotById(summitId) {
  const normalizedSummitId = String(summitId || '').trim();

  if (!normalizedSummitId) {
    return null;
  }

  return (
    H_EARTH_REGION_SUMMIT_SLOTS.find(
      (slot) => slot.summitId === normalizedSummitId
    ) || null
  );
}

function getNearestSummitSlotForPointXZ(point) {
  if (!point) {
    return null;
  }

  let selectedSlot = null;
  let selectedDistanceSquared = Number.POSITIVE_INFINITY;

  H_EARTH_REGION_SUMMIT_SLOTS.forEach((slot) => {
    const candidateDistanceSquared = squaredDistanceXZ(
      point,
      slot.worldCoordinate
    );

    if (
      candidateDistanceSquared < selectedDistanceSquared ||
      (
        candidateDistanceSquared === selectedDistanceSquared &&
        selectedSlot &&
        slot.summitIndex < selectedSlot.summitIndex
      ) ||
      !selectedSlot
    ) {
      selectedSlot = slot;
      selectedDistanceSquared = candidateDistanceSquared;
    }
  });

  if (!selectedSlot) {
    return null;
  }

  return Object.freeze({
    summitId: selectedSlot.summitId,
    summitIndex: selectedSlot.summitIndex,
    summitSlot: selectedSlot.summitSlot,
    distanceXZ: Math.sqrt(selectedDistanceSquared),
    distanceSquaredXZ: selectedDistanceSquared,
    numericTiePolicy:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.numericTiePolicy,

    travelPermissionClaim: false,
    loadingPriorityClaim: false,
    visibilityPriorityClaim: false,
    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,

    claimBoundaryPreserved: true
  });
}

function getNearestSummitSlotForCellCenter(cell) {
  if (!cell?.center) {
    return null;
  }

  const nearest = getNearestSummitSlotForPointXZ(cell.center);

  if (!nearest) {
    return null;
  }

  return Object.freeze({
    ...nearest,
    assignmentMethod:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.jurisdictionAssignmentMethod,
    distanceSource: 'CELL_CENTER',
    distanceFromCellCenterXZ: nearest.distanceXZ,
    distanceFromCellCenterSquaredXZ: nearest.distanceSquaredXZ
  });
}

function createBoundaryRecord() {
  return freezePlain({
    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsFibonacciProjection: false,
    createsFinalFibonacciGovernance: false,
    createsFibonacciSynchronization: false,
    createsChronological256Sequence: false,
    createsFinalDomainSummitIdentity: false,
    createsTerrain: false,
    createsMountains: false,
    createsGeometry: false,
    createsRenderer: false,
    createsCamera: false,
    createsTravelController: false,
    controlsTravel: false,
    controlsStreaming: false,
    controlsLoading: false,
    controlsVisibility: false,
    ownsRendererProjection: false,
    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,
    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,
    claimBoundaryPreserved: true
  });
}

function getSummitStaticDescriptorAdmission({ admitted, failureClasses }) {
  return freezePlain({
    scope: 'STEP_007_STATIC_MACRO_DESCRIPTOR',
    admitted: Boolean(admitted),
    failureClasses: Array.isArray(failureClasses)
      ? failureClasses
      : [],

    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,
    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });
}

function isConstructedSummitDescriptor(summit) {
  return (
    summit?.descriptorConstructionStatus ===
      H_EARTH_REGION_SUMMIT_CONSTRUCTION_STATUSES.CONSTRUCTED &&
    summit?.admission?.scope ===
      'STEP_007_STATIC_MACRO_DESCRIPTOR' &&
    summit?.admission?.admitted === true
  );
}

export function isHEarthRegionConstructedSummitDescriptor(summit) {
  return isConstructedSummitDescriptor(summit);
}

function createRejectedSummitDescriptor({
  summitSlot,
  failureClasses,
  foundationDescription = null,
  anchorCell = null,
  anchorNewsRelation = null,
  anchorFibonacciProjection = null,
  jurisdictionMemberCellIds = null
}) {
  return freezePlain({
    summitId: summitSlot?.summitId || null,
    summitIndex: summitSlot?.summitIndex ?? null,
    summitSlot: summitSlot?.summitSlot || null,

    identity: {
      identityStatus: summitSlot?.identityStatus || 'UNKNOWN',
      identityLabel: summitSlot?.identityLabel || null,
      finalDomainIdentity: summitSlot?.finalDomainIdentity || null,
      domainIdentityFinalized: false,
      narrativeAuthorityClaim: false
    },

    authorityClass: 'MACRO_SPATIAL_ANCHOR',

    descriptorConstructionStatus:
      H_EARTH_REGION_SUMMIT_CONSTRUCTION_STATUSES.REJECTED,

    foundationCoordinateStatus:
      foundationDescription?.foundationAccepted === true
        ? 'FOUNDATION_COORDINATE_ACCEPTED'
        : 'FOUNDATION_COORDINATE_REJECTED',

    relationDerivationStatus: 'DERIVED_RELATIONS_INCOMPLETE',

    admission: getSummitStaticDescriptorAdmission({
      admitted: false,
      failureClasses
    }),

    anchor: {
      placementModel:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.placementModel,

      worldCoordinate: summitSlot?.worldCoordinate || null,

      coordinateAccepted:
        foundationDescription?.foundationAccepted === true,

      foundationDescription,

      anchorCellId: anchorCell?.cellId || null,
      anchorCell,

      anchorNewsClass: anchorNewsRelation?.newsClass || null,
      anchorNewsRelation,

      anchorFibonacciBandId:
        anchorFibonacciProjection?.fibonacciProjection?.fibonacciBandId ||
        null,

      anchorFibonacciProjection
    },

    jurisdiction: {
      assignmentMethod:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.jurisdictionAssignmentMethod,

      constructionScope:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
          .rawJurisdictionAssignmentScope,

      constructedDescriptorRequiredForPublicJurisdiction: true,

      distanceMetric:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.distanceMetricForJurisdiction,

      memberCellIds: Array.isArray(jurisdictionMemberCellIds)
        ? jurisdictionMemberCellIds
        : [],

      memberCellCount: Array.isArray(jurisdictionMemberCellIds)
        ? jurisdictionMemberCellIds.length
        : 0,

      travelPermissionClaim: false,
      loadingPriorityClaim: false,
      streamingPriorityClaim: false,
      visibilityPriorityClaim: false,
      rendererPriorityClaim: false,
      runtimeAdmissionClaim: false,
      rendererAdmissionClaim: false
    },

    lineage: {
      regionFoundationContractId: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionNewsContractId: H_EARTH_REGION_NEWS_CONTRACT_ID,
      regionFibonacciContractId: H_EARTH_REGION_FIBONACCI_CONTRACT_ID,
      regionSummitsContractId: H_EARTH_REGION_SUMMITS_CONTRACT_ID
    },

    boundaries: createBoundaryRecord(),

    descriptorOnly: true,
    claimBoundaryPreserved: true
  });
}

function buildSummitJurisdictionConstruction() {
  const cells = getHEarthFoundationCells();
  const rawJurisdictionByCellId = {};
  const memberCellIdsBySummitId = {};

  H_EARTH_REGION_SUMMIT_SLOTS.forEach((slot) => {
    memberCellIdsBySummitId[slot.summitId] = [];
  });

  (Array.isArray(cells) ? cells : []).forEach((cell) => {
    const nearestSummit = getNearestSummitSlotForCellCenter(cell);

    if (!cell?.cellId || !nearestSummit?.summitId) {
      return;
    }

    rawJurisdictionByCellId[cell.cellId] = freezePlain({
      cellId: cell.cellId,
      summitId: nearestSummit.summitId,
      summitIndex: nearestSummit.summitIndex,
      summitSlot: nearestSummit.summitSlot,
      distanceSource: 'CELL_CENTER',
      distanceFromCellCenterXZ: nearestSummit.distanceFromCellCenterXZ,
      distanceFromCellCenterSquaredXZ:
        nearestSummit.distanceFromCellCenterSquaredXZ,
      assignmentMethod:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.jurisdictionAssignmentMethod,
      constructionScope:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
          .rawJurisdictionAssignmentScope,
      constructedDescriptorRequiredForPublicJurisdiction: true,

      travelPermissionClaim: false,
      loadingPriorityClaim: false,
      visibilityPriorityClaim: false,
      runtimeAdmissionClaim: false,
      rendererAdmissionClaim: false,

      claimBoundaryPreserved: true
    });

    memberCellIdsBySummitId[nearestSummit.summitId].push(cell.cellId);
  });

  Object.keys(memberCellIdsBySummitId).forEach((summitId) => {
    memberCellIdsBySummitId[summitId] = Object.freeze(
      memberCellIdsBySummitId[summitId]
    );
  });

  const totalFoundationCellCount = Array.isArray(cells)
    ? cells.length
    : 0;

  const assignedCellCount = Object.keys(rawJurisdictionByCellId).length;

  return freezePlain({
    rawJurisdictionByCellId,
    memberCellIdsBySummitId,
    totalFoundationCellCount,
    assignedCellCount,

    allCellsAssignedToOneAuthoredSlot:
      totalFoundationCellCount > 0 &&
      assignedCellCount === totalFoundationCellCount,

    constructionMethod:
      'ONE_CELL_TO_ONE_DETERMINISTIC_AUTHORED_SLOT_ASSIGNMENT_MAP',

    constructionScope:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
        .rawJurisdictionAssignmentScope,

    publicJurisdictionMapScope:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
        .publicJurisdictionMapScope,

    constructedDescriptorRequiredForPublicJurisdiction: true,

    claimBoundaryPreserved: true
  });
}

export const H_EARTH_REGION_SUMMIT_JURISDICTION_CONSTRUCTION =
  buildSummitJurisdictionConstruction();

function getJurisdictionCellIdsForSummitId(summitId) {
  const normalizedSummitId = String(summitId || '').trim();

  if (!normalizedSummitId) {
    return Object.freeze([]);
  }

  return (
    H_EARTH_REGION_SUMMIT_JURISDICTION_CONSTRUCTION
      .memberCellIdsBySummitId[normalizedSummitId] || Object.freeze([])
  );
}

function summarizeNewsProfile(cellIds) {
  const profile = {
    NORTH: 0,
    EAST: 0,
    WEST: 0,
    SOUTH: 0,
    CENTER: 0,
    UNKNOWN: 0
  };

  (Array.isArray(cellIds) ? cellIds : []).forEach((cellId) => {
    const classification = getHEarthRegionNewsClassificationByCellId(cellId);
    const newsClass = classification?.newsClass || 'UNKNOWN';

    if (Object.prototype.hasOwnProperty.call(profile, newsClass)) {
      profile[newsClass] += 1;
    } else {
      profile.UNKNOWN += 1;
    }
  });

  return Object.freeze(profile);
}

function summarizeFibonacciProfile(cellIds) {
  const sequence = getHEarthRegionFibonacciSequence();
  const profile = {};

  (Array.isArray(sequence) ? sequence : []).forEach((sequenceValue, index) => {
    const bandId = `H_EARTH_FIBONACCI_BAND_${String(index).padStart(2, '0')}`;

    profile[bandId] = {
      bandId,
      sequenceIndex: index,
      sequenceValue,
      cellCount: 0
    };
  });

  (Array.isArray(cellIds) ? cellIds : []).forEach((cellId) => {
    const projection = getHEarthRegionFibonacciProjectionByCellId(cellId);
    const bandId = projection?.fibonacciProjection?.fibonacciBandId;

    if (bandId && profile[bandId]) {
      profile[bandId].cellCount += 1;
    }
  });

  Object.keys(profile).forEach((bandId) => {
    profile[bandId] = Object.freeze(profile[bandId]);
  });

  return Object.freeze(profile);
}

export function createHEarthRegionSummitDescriptor(summitSlotOrId) {
  const requestedId =
    typeof summitSlotOrId === 'string'
      ? summitSlotOrId
      : summitSlotOrId?.summitId;

  const summitSlot = getStableSummitSlotById(requestedId);

  if (!summitSlot) {
    return null;
  }

  const foundationDescription = describeHEarthFoundationCoordinate(
    summitSlot.worldCoordinate
  );

  const anchorCell = getHEarthFoundationCellByCoordinate(
    summitSlot.worldCoordinate
  );

  const anchorNewsRelation =
    getHEarthRegionNewsClassificationAtCoordinate(
      summitSlot.worldCoordinate
    );

  const anchorFibonacciProjection =
    getHEarthRegionFibonacciProjectionAtCoordinate(
      summitSlot.worldCoordinate
    );

  const jurisdictionMemberCellIds =
    getJurisdictionCellIdsForSummitId(summitSlot.summitId);

  const failureClasses = [];

  if (foundationDescription?.foundationAccepted !== true) {
    failureClasses.push(
      H_EARTH_REGION_SUMMIT_FAILURE_CLASSES.FOUNDATION_COORDINATE_REJECTED
    );
  }

  if (!anchorCell?.cellId) {
    failureClasses.push(
      H_EARTH_REGION_SUMMIT_FAILURE_CLASSES.ANCHOR_CELL_UNRESOLVED
    );
  }

  if (!anchorNewsRelation?.newsClass) {
    failureClasses.push(
      H_EARTH_REGION_SUMMIT_FAILURE_CLASSES
        .ANCHOR_NEWS_RELATION_UNRESOLVED
    );
  }

  if (
    !anchorFibonacciProjection?.fibonacciProjection?.fibonacciBandId
  ) {
    failureClasses.push(
      H_EARTH_REGION_SUMMIT_FAILURE_CLASSES
        .ANCHOR_FIBONACCI_RELATION_UNRESOLVED
    );
  }

  if (
    !Array.isArray(jurisdictionMemberCellIds) ||
    jurisdictionMemberCellIds.length < 1
  ) {
    failureClasses.push(
      H_EARTH_REGION_SUMMIT_FAILURE_CLASSES
        .JURISDICTION_CONSTRUCTION_FAILED
    );
  }

  if (failureClasses.length > 0) {
    return createRejectedSummitDescriptor({
      summitSlot,
      failureClasses,
      foundationDescription,
      anchorCell,
      anchorNewsRelation,
      anchorFibonacciProjection,
      jurisdictionMemberCellIds
    });
  }

  return freezePlain({
    summitId: summitSlot.summitId,
    summitIndex: summitSlot.summitIndex,
    summitSlot: summitSlot.summitSlot,

    identity: {
      identityStatus: summitSlot.identityStatus,
      identityLabel: summitSlot.identityLabel,
      finalDomainIdentity: summitSlot.finalDomainIdentity,
      domainIdentityFinalized: false,
      narrativeAuthorityClaim: false
    },

    authorityClass: 'MACRO_SPATIAL_ANCHOR',

    descriptorConstructionStatus:
      H_EARTH_REGION_SUMMIT_CONSTRUCTION_STATUSES.CONSTRUCTED,

    foundationCoordinateStatus: 'FOUNDATION_COORDINATE_ACCEPTED',

    relationDerivationStatus: 'DERIVED_RELATIONS_COMPLETE',

    admission: getSummitStaticDescriptorAdmission({
      admitted: true,
      failureClasses: []
    }),

    anchor: {
      placementModel:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.placementModel,

      worldCoordinate: summitSlot.worldCoordinate,

      coordinateAccepted: true,

      foundationDescription,

      anchorCellId: anchorCell.cellId,
      anchorCell,

      anchorNewsClass: anchorNewsRelation.newsClass,
      anchorNewsRelation,

      anchorFibonacciBandId:
        anchorFibonacciProjection.fibonacciProjection.fibonacciBandId,

      anchorFibonacciProjection
    },

    jurisdiction: {
      assignmentMethod:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.jurisdictionAssignmentMethod,

      constructionScope:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
          .rawJurisdictionAssignmentScope,

      publicJurisdictionMapScope:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
          .publicJurisdictionMapScope,

      constructedDescriptorRequiredForPublicJurisdiction: true,

      distanceMetric:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.distanceMetricForJurisdiction,

      memberCellIds: jurisdictionMemberCellIds,
      memberCellCount: jurisdictionMemberCellIds.length,

      newsProfile: summarizeNewsProfile(jurisdictionMemberCellIds),
      fibonacciProfile: summarizeFibonacciProfile(jurisdictionMemberCellIds),

      travelPermissionClaim: false,
      loadingPriorityClaim: false,
      streamingPriorityClaim: false,
      visibilityPriorityClaim: false,
      rendererPriorityClaim: false,
      runtimeAdmissionClaim: false,
      rendererAdmissionClaim: false
    },

    lineage: {
      regionFoundationContractId: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionNewsContractId: H_EARTH_REGION_NEWS_CONTRACT_ID,
      regionFibonacciContractId: H_EARTH_REGION_FIBONACCI_CONTRACT_ID,
      regionSummitsContractId: H_EARTH_REGION_SUMMITS_CONTRACT_ID
    },

    boundaries: createBoundaryRecord(),

    descriptorOnly: true,
    claimBoundaryPreserved: true
  });
}

export function buildHEarthRegionSummitDescriptors() {
  return Object.freeze(
    H_EARTH_REGION_SUMMIT_SLOTS
      .map((slot) => createHEarthRegionSummitDescriptor(slot.summitId))
      .filter(Boolean)
  );
}

export const H_EARTH_REGION_SUMMIT_DESCRIPTORS =
  buildHEarthRegionSummitDescriptors();

export function buildHEarthRegionAllSummitsById(
  summitDescriptors = H_EARTH_REGION_SUMMIT_DESCRIPTORS
) {
  const records = {};

  (Array.isArray(summitDescriptors) ? summitDescriptors : []).forEach(
    (summit) => {
      if (!summit?.summitId) {
        return;
      }

      records[summit.summitId] = summit;
    }
  );

  return freezePlain(records);
}

export const H_EARTH_REGION_ALL_SUMMITS_BY_ID =
  buildHEarthRegionAllSummitsById();

export function buildHEarthRegionConstructedSummitsById(
  summitDescriptors = H_EARTH_REGION_SUMMIT_DESCRIPTORS
) {
  const records = {};

  (Array.isArray(summitDescriptors) ? summitDescriptors : []).forEach(
    (summit) => {
      if (!summit?.summitId || !isConstructedSummitDescriptor(summit)) {
        return;
      }

      records[summit.summitId] = summit;
    }
  );

  return freezePlain(records);
}

export const H_EARTH_REGION_SUMMITS_BY_ID =
  buildHEarthRegionConstructedSummitsById();

export function buildHEarthRegionSummitsByAnchorCellId(
  summitDescriptors = H_EARTH_REGION_SUMMIT_DESCRIPTORS
) {
  const records = {};

  (Array.isArray(summitDescriptors) ? summitDescriptors : []).forEach(
    (summit) => {
      if (!isConstructedSummitDescriptor(summit)) {
        return;
      }

      const cellId = summit?.anchor?.anchorCellId;

      if (!cellId) {
        return;
      }

      if (!Array.isArray(records[cellId])) {
        records[cellId] = [];
      }

      records[cellId].push(summit.summitId);
    }
  );

  Object.keys(records).forEach((cellId) => {
    records[cellId] = Object.freeze(records[cellId]);
  });

  return Object.freeze(records);
}

export const H_EARTH_REGION_SUMMITS_BY_ANCHOR_CELL_ID =
  buildHEarthRegionSummitsByAnchorCellId();

export const H_EARTH_REGION_RAW_SUMMIT_JURISDICTION_BY_CELL_ID =
  H_EARTH_REGION_SUMMIT_JURISDICTION_CONSTRUCTION.rawJurisdictionByCellId;

export function buildHEarthRegionConstructedSummitJurisdictionByCellId() {
  const records = {};

  Object.entries(
    H_EARTH_REGION_RAW_SUMMIT_JURISDICTION_BY_CELL_ID
  ).forEach(([cellId, assignment]) => {
    const summit = getHEarthRegionSummitById(assignment?.summitId);

    if (!isConstructedSummitDescriptor(summit)) {
      return;
    }

    records[cellId] = freezePlain({
      cellId,
      assignment,
      summitId: summit.summitId,
      summitSlot: summit.summitSlot,
      publicLookupFilter:
        'CONSTRUCTED_SUMMIT_DESCRIPTOR_REQUIRED',
      mapScope:
        H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
          .publicJurisdictionMapScope,

      travelPermissionClaim: false,
      loadingPriorityClaim: false,
      visibilityPriorityClaim: false,
      runtimeAdmissionClaim: false,
      rendererAdmissionClaim: false,

      claimBoundaryPreserved: true
    });
  });

  return freezePlain(records);
}

export const H_EARTH_REGION_SUMMIT_JURISDICTION_BY_CELL_ID =
  buildHEarthRegionConstructedSummitJurisdictionByCellId();

export function getHEarthRegionSummitDescriptors() {
  return H_EARTH_REGION_SUMMIT_DESCRIPTORS;
}

export function getHEarthRegionAllSummitsById() {
  return H_EARTH_REGION_ALL_SUMMITS_BY_ID;
}

export function getHEarthRegionRawSummitById(summitId) {
  const normalizedSummitId = String(summitId || '').trim();

  if (!normalizedSummitId) {
    return null;
  }

  return H_EARTH_REGION_ALL_SUMMITS_BY_ID[normalizedSummitId] || null;
}

export function getHEarthRegionSummitsById() {
  return H_EARTH_REGION_SUMMITS_BY_ID;
}

export function getHEarthRegionSummitById(summitId) {
  const normalizedSummitId = String(summitId || '').trim();

  if (!normalizedSummitId) {
    return null;
  }

  return H_EARTH_REGION_SUMMITS_BY_ID[normalizedSummitId] || null;
}

export function getHEarthRegionSummitsByAnchorCellId(cellId) {
  const normalizedCellId = String(cellId || '').trim();

  if (!normalizedCellId) {
    return Object.freeze([]);
  }

  return (
    H_EARTH_REGION_SUMMITS_BY_ANCHOR_CELL_ID[normalizedCellId] ||
    Object.freeze([])
  );
}

export function getHEarthRegionRawSummitJurisdictionAssignmentByCellId(
  cellId
) {
  const normalizedCellId = String(cellId || '').trim();

  if (!normalizedCellId) {
    return null;
  }

  return (
    H_EARTH_REGION_RAW_SUMMIT_JURISDICTION_BY_CELL_ID[
      normalizedCellId
    ] || null
  );
}

export function getHEarthRegionSummitJurisdictionByCellId(cellId) {
  const normalizedCellId = String(cellId || '').trim();

  if (!normalizedCellId) {
    return null;
  }

  const publicJurisdiction =
    H_EARTH_REGION_SUMMIT_JURISDICTION_BY_CELL_ID[
      normalizedCellId
    ];

  if (!publicJurisdiction?.summitId) {
    return null;
  }

  const summit = getHEarthRegionSummitById(publicJurisdiction.summitId);

  if (!isConstructedSummitDescriptor(summit)) {
    return null;
  }

  return freezePlain({
    cellId: normalizedCellId,
    assignment: publicJurisdiction.assignment,
    summit,

    jurisdictionSource: 'CELL_CENTER_ASSIGNMENT',
    publicLookupFilter:
      'CONSTRUCTED_SUMMIT_DESCRIPTOR_REQUIRED',
    mapScope:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
        .publicJurisdictionMapScope,

    travelPermissionClaim: false,
    loadingPriorityClaim: false,
    visibilityPriorityClaim: false,
    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,

    claimBoundaryPreserved: true
  });
}

export function getHEarthRegionSummitJurisdictionAtCoordinate(coordinate) {
  const foundationDescription = describeHEarthFoundationCoordinate(coordinate);

  if (foundationDescription?.foundationAccepted !== true) {
    return null;
  }

  const cell = getHEarthFoundationCellByCoordinate(coordinate);

  if (!cell?.cellId) {
    return null;
  }

  const jurisdiction = getHEarthRegionSummitJurisdictionByCellId(cell.cellId);

  if (!jurisdiction) {
    return null;
  }

  return freezePlain({
    coordinate,
    coordinateCellId: cell.cellId,
    jurisdictionSource:
      'CONTAINING_CELL_GOVERNED_SUMMIT_JURISDICTION',
    publicLookupFilter:
      'CONSTRUCTED_SUMMIT_DESCRIPTOR_REQUIRED',
    mapScope:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
        .publicJurisdictionMapScope,
    summitId: jurisdiction.summit.summitId,
    summitSlot: jurisdiction.summit.summitSlot,
    assignment: jurisdiction.assignment,
    summit: jurisdiction.summit,

    note:
      'This is cell-governed summit jurisdiction for the containing cell, not continuous geometric nearest-summit calculation.',

    travelPermissionClaim: false,
    loadingPriorityClaim: false,
    visibilityPriorityClaim: false,
    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,

    claimBoundaryPreserved: true
  });
}

export function getHEarthRegionNearestSummitForCoordinate(coordinate) {
  const foundationDescription = describeHEarthFoundationCoordinate(coordinate);

  if (foundationDescription?.foundationAccepted !== true) {
    return null;
  }

  const nearestSummit = getNearestSummitSlotForPointXZ(coordinate);

  if (!nearestSummit?.summitId) {
    return null;
  }

  const summit = getHEarthRegionSummitById(nearestSummit.summitId);

  if (!isConstructedSummitDescriptor(summit)) {
    return null;
  }

  return freezePlain({
    coordinate,
    nearestComputation:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.continuousNearestMethod,

    publicLookupFilter:
      'CONSTRUCTED_SUMMIT_DESCRIPTOR_REQUIRED',

    summitId: nearestSummit.summitId,
    summitIndex: nearestSummit.summitIndex,
    summitSlot: nearestSummit.summitSlot,

    distanceSource: 'CONTINUOUS_COORDINATE',
    distanceFromCoordinateXZ: nearestSummit.distanceXZ,
    distanceFromCoordinateSquaredXZ: nearestSummit.distanceSquaredXZ,

    summit,

    note:
      'This is continuous-coordinate nearest-summit calculation, not cell-governed jurisdiction.',

    travelPermissionClaim: false,
    loadingPriorityClaim: false,
    visibilityPriorityClaim: false,
    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,
    rendererClaim: false,

    claimBoundaryPreserved: true
  });
}

export function getHEarthRegionNearestSummitForCoordinateCell(coordinate) {
  const foundationDescription = describeHEarthFoundationCoordinate(coordinate);

  if (foundationDescription?.foundationAccepted !== true) {
    return null;
  }

  const coordinateCell = getHEarthFoundationCellByCoordinate(coordinate);

  if (!coordinateCell?.cellId) {
    return null;
  }

  const nearestSummit = getNearestSummitSlotForCellCenter(coordinateCell);

  if (!nearestSummit?.summitId) {
    return null;
  }

  const summit = getHEarthRegionSummitById(nearestSummit.summitId);

  if (!isConstructedSummitDescriptor(summit)) {
    return null;
  }

  return freezePlain({
    coordinate,
    coordinateCellId: coordinateCell.cellId,
    nearestComputation:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.jurisdictionAssignmentMethod,

    publicLookupFilter:
      'CONSTRUCTED_SUMMIT_DESCRIPTOR_REQUIRED',

    summitId: nearestSummit.summitId,
    summitIndex: nearestSummit.summitIndex,
    summitSlot: nearestSummit.summitSlot,

    distanceSource: 'CELL_CENTER',
    distanceFromCellCenterXZ: nearestSummit.distanceFromCellCenterXZ,
    distanceFromCellCenterSquaredXZ:
      nearestSummit.distanceFromCellCenterSquaredXZ,

    summit,

    note:
      'This is nearest summit for the containing cell center, not direct continuous-coordinate nearest-summit calculation.',

    travelPermissionClaim: false,
    loadingPriorityClaim: false,
    visibilityPriorityClaim: false,
    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,
    rendererClaim: false,

    claimBoundaryPreserved: true
  });
}

function getConstructedSummitIndexFilterEvidence(constructedSummits) {
  const constructedIndexEntries = Object.entries(
    H_EARTH_REGION_SUMMITS_BY_ID
  );

  const constructedSummitIdIndexFiltered =
    constructedIndexEntries.length === constructedSummits.length &&
    constructedIndexEntries.every(
      ([summitId, summit]) =>
        summitId === summit?.summitId &&
        isConstructedSummitDescriptor(summit)
    ) &&
    constructedSummits.every(
      (summit) =>
        H_EARTH_REGION_SUMMITS_BY_ID[summit.summitId] === summit
    );

  const constructedAnchorCellIndexFiltered =
    Object.values(H_EARTH_REGION_SUMMITS_BY_ANCHOR_CELL_ID).every(
      (summitIds) =>
        Array.isArray(summitIds) &&
        summitIds.every((summitId) =>
          isConstructedSummitDescriptor(
            H_EARTH_REGION_SUMMITS_BY_ID[summitId]
          )
        )
    );

  const constructedJurisdictionMapEntries = Object.entries(
    H_EARTH_REGION_SUMMIT_JURISDICTION_BY_CELL_ID
  );

  const constructedJurisdictionMapFiltered =
    constructedJurisdictionMapEntries.every(
      ([cellId, jurisdiction]) => {
        const summit = getHEarthRegionSummitById(
          jurisdiction?.summitId
        );

        return (
          cellId === jurisdiction?.cellId &&
          jurisdiction?.publicLookupFilter ===
            'CONSTRUCTED_SUMMIT_DESCRIPTOR_REQUIRED' &&
          isConstructedSummitDescriptor(summit)
        );
      }
    );

  return freezePlain({
    constructedSummitIdIndexFiltered,
    constructedAnchorCellIndexFiltered,
    constructedJurisdictionMapFiltered,
    publicLookupFunctionsFailClosed: true,

    publicConstructedSummitLookupFilterEnabled:
      constructedSummitIdIndexFiltered &&
      constructedAnchorCellIndexFiltered &&
      constructedJurisdictionMapFiltered
  });
}

function getHEarthRegionSummitReceiptStatus(summary) {
  if (!summary || summary.constructedSummitCount < 1) {
    return H_EARTH_REGION_SUMMIT_RECEIPT_STATUSES.REJECTED;
  }

  if (
    summary.summitCountMatchesExpected === true &&
    summary.allSummitDescriptorsConstructed === true &&
    summary.allAnchorCoordinatesAccepted === true &&
    summary.allAnchorRelationsComplete === true &&
    summary.allCellsAssignedToOneAuthoredSlot === true &&
    summary.constructedJurisdictionMapCellCount ===
      summary.totalFoundationCellCount &&
    summary.publicConstructedSummitLookupFilterEnabled === true
  ) {
    return H_EARTH_REGION_SUMMIT_RECEIPT_STATUSES.DEFINED;
  }

  return H_EARTH_REGION_SUMMIT_RECEIPT_STATUSES.PARTIALLY_DEFINED;
}

export function getHEarthRegionSummitSummary() {
  const summitDescriptors = getHEarthRegionSummitDescriptors();
  const cells = getHEarthFoundationCells();

  const constructedSummits = summitDescriptors.filter((summit) =>
    isConstructedSummitDescriptor(summit)
  );

  const rejectedSummits = summitDescriptors.filter(
    (summit) =>
      summit?.descriptorConstructionStatus ===
      H_EARTH_REGION_SUMMIT_CONSTRUCTION_STATUSES.REJECTED
  );

  const allSummitDescriptorsConstructed =
    constructedSummits.length === summitDescriptors.length;

  const allAnchorCoordinatesAccepted =
    summitDescriptors.length > 0 &&
    summitDescriptors.every(
      (summit) => summit?.anchor?.coordinateAccepted === true
    );

  const allAnchorRelationsComplete =
    summitDescriptors.length > 0 &&
    summitDescriptors.every(
      (summit) =>
        summit?.relationDerivationStatus ===
        'DERIVED_RELATIONS_COMPLETE'
    );

  const totalJurisdictionCells =
    H_EARTH_REGION_SUMMIT_JURISDICTION_CONSTRUCTION.assignedCellCount;

  const allCellsAssignedToOneAuthoredSlot =
    H_EARTH_REGION_SUMMIT_JURISDICTION_CONSTRUCTION
      .allCellsAssignedToOneAuthoredSlot === true &&
    totalJurisdictionCells === (Array.isArray(cells) ? cells.length : 0);

  const constructedJurisdictionMapCellCount = Object.keys(
    H_EARTH_REGION_SUMMIT_JURISDICTION_BY_CELL_ID
  ).length;

  const filterEvidence =
    getConstructedSummitIndexFilterEvidence(constructedSummits);

  const actualJurisdictionCounts = {};

  H_EARTH_REGION_SUMMIT_SLOTS.forEach((slot) => {
    actualJurisdictionCounts[slot.summitId] =
      getJurisdictionCellIdsForSummitId(slot.summitId).length;
  });

  const summary = freezePlain({
    contractId: H_EARTH_REGION_SUMMITS_CONTRACT_ID,
    renewsContractId: H_EARTH_REGION_SUMMITS_RENEWS_CONTRACT_ID,

    consumedContracts: {
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID,
      regionFibonacci: H_EARTH_REGION_FIBONACCI_CONTRACT_ID
    },

    summitCount: summitDescriptors.length,
    expectedSummitCount: 9,
    summitCountMatchesExpected: summitDescriptors.length === 9,

    constructedSummitCount: constructedSummits.length,
    rejectedSummitCount: rejectedSummits.length,
    allSummitDescriptorsConstructed,

    allAnchorCoordinatesAccepted,
    allAnchorRelationsComplete,

    totalFoundationCellCount: Array.isArray(cells) ? cells.length : 0,
    totalRawJurisdictionCells: totalJurisdictionCells,
    totalJurisdictionCells,
    constructedJurisdictionMapCellCount,
    allCellsAssignedToOneAuthoredSlot,

    rawJurisdictionAssignmentScope:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
        .rawJurisdictionAssignmentScope,

    publicJurisdictionMapScope:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY
        .publicJurisdictionMapScope,

    constructedDescriptorRequiredForPublicJurisdiction: true,

    constructedSummitIdIndexFiltered:
      filterEvidence.constructedSummitIdIndexFiltered,

    constructedAnchorCellIndexFiltered:
      filterEvidence.constructedAnchorCellIndexFiltered,

    constructedJurisdictionMapFiltered:
      filterEvidence.constructedJurisdictionMapFiltered,

    publicLookupFunctionsFailClosed:
      filterEvidence.publicLookupFunctionsFailClosed,

    publicConstructedSummitLookupFilterEnabled:
      filterEvidence.publicConstructedSummitLookupFilterEnabled,

    placementModel:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.placementModel,

    jurisdictionAssignmentMethod:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.jurisdictionAssignmentMethod,

    continuousNearestMethod:
      H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY.continuousNearestMethod,

    expectedJurisdictionCountsFixture:
      H_EARTH_REGION_SUMMIT_EXPECTED_JURISDICTION_COUNT_FIXTURE,

    actualJurisdictionCounts: freezePlain(actualJurisdictionCounts),

    newsGovernanceOrder: getHEarthRegionNewsGovernanceOrder(),
    newsVisibleCircumferenceOrder:
      getHEarthRegionNewsVisibleCircumferenceOrder(),

    fibonacciSequence: getHEarthRegionFibonacciSequence(),

    finalDomainSummitIdentitiesFinalized: false,
    finalDomainSummitIdentityClaim: false,

    staticDescriptorAdmissionScope:
      'STEP_007_STATIC_MACRO_DESCRIPTOR',

    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsFibonacciProjection: false,
    createsFinalFibonacciGovernance: false,
    createsFibonacciSynchronization: false,
    createsChronological256Sequence: false,
    createsRenderer: false,
    createsCamera: false,
    createsTravel: false,
    createsStreaming: false,
    createsLoadingPriority: false,
    createsVisibilityPipeline: false,
    createsTerrain: false,
    createsMountains: false,
    createsDetails: false,
    createsDiagnosticsRuntime: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });

  return freezePlain({
    ...summary,
    receiptStatus: getHEarthRegionSummitReceiptStatus(summary)
  });
}

export const H_EARTH_REGION_SUMMITS = Object.freeze({
  contractId: H_EARTH_REGION_SUMMITS_CONTRACT_ID,
  renewsContractId: H_EARTH_REGION_SUMMITS_RENEWS_CONTRACT_ID,

  consumedContracts: Object.freeze({
    regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
    regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID,
    regionFibonacci: H_EARTH_REGION_FIBONACCI_CONTRACT_ID
  }),

  status: H_EARTH_REGION_SUMMITS_STATUS,
  ownership: H_EARTH_REGION_SUMMITS_OWNERSHIP,
  placementPolicy: H_EARTH_REGION_SUMMIT_PLACEMENT_POLICY,

  summitSlots: H_EARTH_REGION_SUMMIT_SLOTS,
  summitDescriptors: H_EARTH_REGION_SUMMIT_DESCRIPTORS,

  allSummitsById: H_EARTH_REGION_ALL_SUMMITS_BY_ID,
  constructedSummitsById: H_EARTH_REGION_SUMMITS_BY_ID,

  summitsByAnchorCellId: H_EARTH_REGION_SUMMITS_BY_ANCHOR_CELL_ID,

  rawSummitJurisdictionConstruction:
    H_EARTH_REGION_SUMMIT_JURISDICTION_CONSTRUCTION,

  rawSummitJurisdictionByCellId:
    H_EARTH_REGION_RAW_SUMMIT_JURISDICTION_BY_CELL_ID,

  constructedPublicSummitJurisdictionByCellId:
    H_EARTH_REGION_SUMMIT_JURISDICTION_BY_CELL_ID,

  publicJurisdictionLookupRequiresConstructedDescriptor: true,

  expectedJurisdictionCountsFixture:
    H_EARTH_REGION_SUMMIT_EXPECTED_JURISDICTION_COUNT_FIXTURE,

  macroAnchorSlotDescriptorOnly: true,
  finalDomainSummitIdentitiesFinalized: false,

  createsCoordinateSpace: false,
  createsLatticeCells: false,
  createsNewsClassification: false,
  createsFibonacciProjection: false,
  createsFinalFibonacciGovernance: false,
  createsFibonacciSynchronization: false,
  createsChronological256Sequence: false,
  createsFinalDomainSummitIdentity: false,
  createsRenderer: false,
  createsCamera: false,
  createsTravelController: false,
  createsRuntimeStreaming: false,
  createsLoadingPriority: false,
  createsVisibilityPipeline: false,
  createsTerrain: false,
  createsMountains: false,
  createsDetailGeometry: false,
  createsDiagnosticsRuntime: false,

  runtimeAdmissionClaim: false,
  rendererAdmissionClaim: false,
  validationClaim: false,
  productionClaim: false,
  visualPassClaim: false,

  claimBoundaryPreserved: true
});

export function getHEarthRegionSummitsContract() {
  return H_EARTH_REGION_SUMMITS;
}

export function getHEarthRegionSummitsReceipt() {
  const summary = getHEarthRegionSummitSummary();

  return freezePlain({
    receiptId:
      'H_EARTH_REGION_SUMMITS_RECEIPT_STEP_007D_PUBLIC_JURISDICTION_EXPORT_FILTER_v1',

    contractId: H_EARTH_REGION_SUMMITS_CONTRACT_ID,
    renewsContractId: H_EARTH_REGION_SUMMITS_RENEWS_CONTRACT_ID,

    consumedContracts: {
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID,
      regionFibonacci: H_EARTH_REGION_FIBONACCI_CONTRACT_ID
    },

    status: summary.receiptStatus,

    summitCount: summary.summitCount,
    expectedSummitCount: summary.expectedSummitCount,
    summitCountMatchesExpected: summary.summitCountMatchesExpected,

    constructedSummitCount: summary.constructedSummitCount,
    rejectedSummitCount: summary.rejectedSummitCount,
    allSummitDescriptorsConstructed:
      summary.allSummitDescriptorsConstructed,

    allAnchorCoordinatesAccepted:
      summary.allAnchorCoordinatesAccepted,
    allAnchorRelationsComplete:
      summary.allAnchorRelationsComplete,

    totalFoundationCellCount: summary.totalFoundationCellCount,
    totalRawJurisdictionCells: summary.totalRawJurisdictionCells,
    constructedJurisdictionMapCellCount:
      summary.constructedJurisdictionMapCellCount,

    allCellsAssignedToOneAuthoredSlot:
      summary.allCellsAssignedToOneAuthoredSlot,

    rawJurisdictionAssignmentScope:
      summary.rawJurisdictionAssignmentScope,

    publicJurisdictionMapScope:
      summary.publicJurisdictionMapScope,

    constructedDescriptorRequiredForPublicJurisdiction:
      summary.constructedDescriptorRequiredForPublicJurisdiction,

    constructedSummitIdIndexFiltered:
      summary.constructedSummitIdIndexFiltered,

    constructedAnchorCellIndexFiltered:
      summary.constructedAnchorCellIndexFiltered,

    constructedJurisdictionMapFiltered:
      summary.constructedJurisdictionMapFiltered,

    publicLookupFunctionsFailClosed:
      summary.publicLookupFunctionsFailClosed,

    publicConstructedSummitLookupFilterEnabled:
      summary.publicConstructedSummitLookupFilterEnabled,

    placementModel: summary.placementModel,
    jurisdictionAssignmentMethod:
      summary.jurisdictionAssignmentMethod,
    continuousNearestMethod:
      summary.continuousNearestMethod,

    expectedJurisdictionCountsFixture:
      summary.expectedJurisdictionCountsFixture,

    actualJurisdictionCounts: summary.actualJurisdictionCounts,

    continuousCoordinatesArePrimary: true,
    cellRelationsAreDerived: true,
    newsRelationsAreDerived: true,
    fibonacciRelationsAreDerived: true,

    rawAssignmentApi:
      'getHEarthRegionRawSummitJurisdictionAssignmentByCellId',

    rawAssignmentExport:
      'H_EARTH_REGION_RAW_SUMMIT_JURISDICTION_BY_CELL_ID',

    constructedPublicJurisdictionExport:
      'H_EARTH_REGION_SUMMIT_JURISDICTION_BY_CELL_ID',

    cellGovernedJurisdictionApi:
      'getHEarthRegionSummitJurisdictionAtCoordinate',

    continuousNearestSummitApi:
      'getHEarthRegionNearestSummitForCoordinate',

    cellCenterNearestSummitApi:
      'getHEarthRegionNearestSummitForCoordinateCell',

    staticDescriptorAdmissionScope:
      'STEP_007_STATIC_MACRO_DESCRIPTOR',

    runtimeAdmissionClaim: false,
    rendererAdmissionClaim: false,

    finalDomainSummitIdentitiesFinalized: false,
    finalDomainSummitIdentityClaim: false,

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsFibonacciProjection: false,
    createsFinalFibonacciGovernance: false,
    createsFibonacciSynchronization: false,
    createsChronological256Sequence: false,
    createsRenderer: false,
    createsCamera: false,
    createsTravel: false,
    createsStreaming: false,
    createsLoadingPriority: false,
    createsVisibilityPipeline: false,
    createsTerrain: false,
    createsMountains: false,
    createsDetails: false,
    createsDiagnosticsRuntime: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });
}

export default H_EARTH_REGION_SUMMITS;
