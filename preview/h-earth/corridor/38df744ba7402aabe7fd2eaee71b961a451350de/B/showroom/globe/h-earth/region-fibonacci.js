// /showroom/globe/h-earth/region-fibonacci.js
// COMPLETE NEW FILE
// H_EARTH_REGION_FIBONACCI_FILE_BIRTH_STEP_005_SEQUENCE_PROJECTION_v1
//
// Consumes:
// /showroom/globe/h-earth/region-space.js
// H_EARTH_REGION_SPACE_FILE_BIRTH_STEP_001_COORDINATE_CONSTITUTION_v1
//
// /showroom/globe/h-earth/region-lattice.js
// H_EARTH_REGION_LATTICE_FILE_BIRTH_STEP_002_NEUTRAL_256_CELL_SUBDIVISION_v1
//
// /showroom/globe/h-earth/region-foundation.js
// H_EARTH_REGION_FOUNDATION_FILE_BIRTH_STEP_003_SPACE_LATTICE_FOUNDATION_v1
//
// /showroom/globe/h-earth/region-news.js
// H_EARTH_REGION_NEWS_FILE_BIRTH_STEP_004_DIRECTIONAL_CLASSIFICATION_v1
//
// Purpose:
// Assigns a restricted Fibonacci sequence projection over existing H-Earth
// region lattice cells.
//
// This file creates Fibonacci projection metadata only.
//
// It does not create:
// - coordinate space
// - lattice cells
// - independent bounds
// - NEWS classification
// - final Fibonacci governance
// - NEWS/Fibonacci synchronization authority
// - chronological 256 sequence authority
// - Nine Summit anchors
// - renderer behavior
// - camera behavior
// - travel behavior
// - streaming/loading/visibility behavior
// - terrain
// - water
// - shoreline geometry
// - rocks, puddles, foam, manor, or detail geometry
// - diagnostics
// - production claim
// - validation claim
// - visual-pass claim
//
// Ownership:
// region-fibonacci.js owns:
// - Fibonacci sequence values used for local projection
// - center-core distance projection over existing cells
// - band labels derived from existing lattice positions
// - Fibonacci lookup helpers
// - projection receipts
//
// region-fibonacci.js does not own:
// - axis law
// - origin
// - region bounds
// - cell creation
// - NEWS classification
// - NEWS governance order
// - final Fibonacci protocol
// - chronological 256 sequencing
// - renderer
// - travel
//
// Boundary:
// This is a sequence projection layer, not final Fibonacci governance.
// Exact spiral / fulcrum / synchronization law remains reserved for a later
// extracted governance file.

import {
  H_EARTH_REGION_SPACE_CONTRACT_ID,
  H_EARTH_REGION_SPACE,
  describeCoordinate
} from './region-space.js';

import {
  H_EARTH_REGION_LATTICE_CONTRACT_ID,
  H_EARTH_REGION_LATTICE_DIMENSIONS,
  getHEarthRegionLatticeCells,
  getHEarthRegionCellById,
  getHEarthRegionCellAtCoordinate
} from './region-lattice.js';

import {
  H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
  describeHEarthFoundationCoordinate
} from './region-foundation.js';

import {
  H_EARTH_REGION_NEWS_CONTRACT_ID,
  getHEarthRegionNewsClassificationByCellId,
  getHEarthRegionNewsSummary,
  getHEarthRegionNewsGovernanceOrder,
  getHEarthRegionNewsVisibleCircumferenceOrder
} from './region-news.js';

export const H_EARTH_REGION_FIBONACCI_CONTRACT_ID =
  'H_EARTH_REGION_FIBONACCI_FILE_BIRTH_STEP_005_SEQUENCE_PROJECTION_v1';

export const H_EARTH_REGION_FIBONACCI_SEQUENCE = Object.freeze([
  1,
  2,
  3,
  5,
  8,
  13,
  21,
  34
]);

export const H_EARTH_REGION_FIBONACCI_STATUS = Object.freeze({
  path: 'PATH_3_COORDINATE_GOVERNED_IMMERSIVE_REGION',
  buildStage: 'FIBONACCI_SEQUENCE_PROJECTION_ONLY',
  implementationClass: 'RESTRICTED_FIBONACCI_PROJECTION_OVER_EXISTING_LATTICE',

  productionClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  rendererClaim: false,
  cameraClaim: false,
  travelClaim: false,
  streamingClaim: false,
  loadingClaim: false,
  visibilityClaim: false,
  finalFibonacciGovernanceClaim: false,
  fibonacciSynchronizationClaim: false,
  chronological256SequenceClaim: false,
  nineSummitClaim: false,
  detailGeometryClaim: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_FIBONACCI_OWNERSHIP = Object.freeze({
  consumesRegionSpace: true,
  consumesRegionLattice: true,
  consumesRegionFoundation: true,
  consumesRegionNews: true,

  projectsFibonacciSequenceOverExistingCells: true,
  assignsProjectionBandMetadata: true,
  providesFibonacciLookupHelpers: true,

  createsCoordinateSpace: false,
  createsLatticeCells: false,
  redefinesAxes: false,
  redefinesOrigin: false,
  redefinesWorldBounds: false,
  redefinesCellBounds: false,
  createsNewsClassification: false,
  redefinesNewsGovernanceOrder: false,

  createsFinalFibonacciGovernance: false,
  createsFibonacciSynchronization: false,
  createsChronological256Sequence: false,
  createsNineSummitAnchors: false,
  createsRenderer: false,
  createsCamera: false,
  createsTravelController: false,
  createsRuntimeStreaming: false,
  createsLoadingPriority: false,
  createsVisibilityPipeline: false,
  createsTerrain: false,
  createsDetailGeometry: false,
  createsDiagnostics: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_FIBONACCI_PROJECTION_POLICY = Object.freeze({
  projectionStatus: 'LOCAL_GEOMETRIC_PROJECTION_NOT_FINAL_PROTOCOL',

  sequence: H_EARTH_REGION_FIBONACCI_SEQUENCE,

  projectionMethod:
    'CENTER_CORE_LATTICE_DISTANCE_TO_FIBONACCI_SEQUENCE',

  centerCoreCells: Object.freeze([
    'H_EARTH_REGION_CELL_X07_Z07',
    'H_EARTH_REGION_CELL_X08_Z07',
    'H_EARTH_REGION_CELL_X07_Z08',
    'H_EARTH_REGION_CELL_X08_Z08'
  ]),

  centerCoreLatticeRange: Object.freeze({
    latticeX: Object.freeze([7, 8]),
    latticeZ: Object.freeze([7, 8])
  }),

  distanceMetricsIncluded: Object.freeze([
    'centerCoreOffsetX',
    'centerCoreOffsetZ',
    'chebyshevDistance',
    'manhattanDistance',
    'euclideanDistance'
  ]),

  bandAssignmentRule:
    'Fibonacci sequence index follows Chebyshev distance from the four-cell center core, capped to the available local sequence length.',

  createsLoadingPriority: false,
  createsStreamingPriority: false,
  createsTravelPermission: false,
  createsFinalSpiralLaw: false,
  createsFulcrumSynchronization: false,
  createsChronological256Sequence: false,

  futureGovernanceExtractionRequired: true,

  claimBoundaryPreserved: true
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function padBandIndex(value) {
  return String(value).padStart(2, '0');
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isCenterCoreCell(cell) {
  if (!cell || typeof cell !== 'object') {
    return false;
  }

  return (
    (cell.latticeX === 7 || cell.latticeX === 8) &&
    (cell.latticeZ === 7 || cell.latticeZ === 8)
  );
}

function getCenterCoreOffset(latticeX, latticeZ) {
  if (
    !Number.isInteger(latticeX) ||
    !Number.isInteger(latticeZ)
  ) {
    return null;
  }

  let offsetX = 0;
  let offsetZ = 0;

  if (latticeX < 7) {
    offsetX = 7 - latticeX;
  } else if (latticeX > 8) {
    offsetX = latticeX - 8;
  }

  if (latticeZ < 7) {
    offsetZ = 7 - latticeZ;
  } else if (latticeZ > 8) {
    offsetZ = latticeZ - 8;
  }

  return Object.freeze({
    offsetX,
    offsetZ,
    signedRelation: Object.freeze({
      x:
        latticeX < 7
          ? 'negative-x-side-of-center-core'
          : latticeX > 8
            ? 'positive-x-side-of-center-core'
            : 'center-core-x',
      z:
        latticeZ < 7
          ? 'negative-z-side-of-center-core'
          : latticeZ > 8
            ? 'positive-z-side-of-center-core'
            : 'center-core-z'
    })
  });
}

function getProjectionMetricsForCell(cell) {
  if (!cell || typeof cell !== 'object') {
    return null;
  }

  const offset = getCenterCoreOffset(cell.latticeX, cell.latticeZ);

  if (!offset) {
    return null;
  }

  const chebyshevDistance = Math.max(offset.offsetX, offset.offsetZ);
  const manhattanDistance = offset.offsetX + offset.offsetZ;
  const euclideanDistance = Math.sqrt(
    offset.offsetX * offset.offsetX +
      offset.offsetZ * offset.offsetZ
  );

  const sequenceIndex = Math.min(
    chebyshevDistance,
    H_EARTH_REGION_FIBONACCI_SEQUENCE.length - 1
  );

  const sequenceValue =
    H_EARTH_REGION_FIBONACCI_SEQUENCE[sequenceIndex];

  const previousSequenceValue =
    sequenceIndex > 0
      ? H_EARTH_REGION_FIBONACCI_SEQUENCE[sequenceIndex - 1]
      : null;

  const nextSequenceValue =
    sequenceIndex < H_EARTH_REGION_FIBONACCI_SEQUENCE.length - 1
      ? H_EARTH_REGION_FIBONACCI_SEQUENCE[sequenceIndex + 1]
      : null;

  return Object.freeze({
    centerCoreOffsetX: offset.offsetX,
    centerCoreOffsetZ: offset.offsetZ,
    centerCoreSignedRelation: offset.signedRelation,

    chebyshevDistance,
    manhattanDistance,
    euclideanDistance,

    fibonacciSequenceIndex: sequenceIndex,
    fibonacciSequenceValue: sequenceValue,
    previousFibonacciSequenceValue: previousSequenceValue,
    nextFibonacciSequenceValue: nextSequenceValue,

    fibonacciBandId: `H_EARTH_FIBONACCI_BAND_${padBandIndex(sequenceIndex)}`,
    fibonacciBandLabel:
      sequenceIndex === 0
        ? 'CENTER_CORE_FIBONACCI_PROJECTION_BAND'
        : `FIBONACCI_PROJECTION_BAND_${sequenceValue}`,

    centerCoreCell: isCenterCoreCell(cell),

    projectionMethod:
      H_EARTH_REGION_FIBONACCI_PROJECTION_POLICY.projectionMethod,

    finalFibonacciGovernanceClaim: false,
    fibonacciSynchronizationClaim: false,
    chronological256SequenceClaim: false,

    claimBoundaryPreserved: true
  });
}

export function createHEarthRegionFibonacciProjectionForCell(
  cellOrCellId
) {
  const cell =
    typeof cellOrCellId === 'string'
      ? getHEarthRegionCellById(cellOrCellId)
      : cellOrCellId;

  if (!cell?.cellId || !cell?.center) {
    return null;
  }

  const projectionMetrics = getProjectionMetricsForCell(cell);

  if (!projectionMetrics) {
    return null;
  }

  const newsClassification =
    getHEarthRegionNewsClassificationByCellId(cell.cellId);

  const axisRelation =
    describeCoordinate(cell.center)?.axisRelation || null;

  return Object.freeze({
    cellId: cell.cellId,

    latticeX: cell.latticeX,
    latticeZ: cell.latticeZ,
    linearIndex: cell.linearIndex,

    center: clone(cell.center),
    axisRelation,

    newsContext: newsClassification
      ? Object.freeze({
          newsClass: newsClassification.newsClass,
          governanceOrderIndex:
            newsClassification.governanceOrderIndex,
          visibleCircumferenceOrderIndex:
            newsClassification.visibleCircumferenceOrderIndex,
          newsClassificationAssigned: true
        })
      : Object.freeze({
          newsClass: null,
          governanceOrderIndex: null,
          visibleCircumferenceOrderIndex: null,
          newsClassificationAssigned: false
        }),

    fibonacciProjection: projectionMetrics,

    projectionOnly: true,
    finalFibonacciGovernanceClaim: false,
    fibonacciSynchronizationClaim: false,
    chronological256SequenceClaim: false,

    createsCoordinateSpace: false,
    createsLatticeCell: false,
    createsNewsClassification: false,
    createsNineSummitAnchor: false,
    createsRendererState: false,
    createsTravelState: false,
    createsLoadingState: false,
    createsVisibilityState: false,

    claimBoundaryPreserved: true
  });
}

export function buildHEarthRegionFibonacciProjections(
  cells = getHEarthRegionLatticeCells()
) {
  const projections = [];

  (Array.isArray(cells) ? cells : []).forEach((cell) => {
    const projection =
      createHEarthRegionFibonacciProjectionForCell(cell);

    if (projection) {
      projections.push(projection);
    }
  });

  return Object.freeze(projections);
}

export const H_EARTH_REGION_FIBONACCI_PROJECTIONS =
  buildHEarthRegionFibonacciProjections();

export function buildHEarthRegionFibonacciProjectionsByCellId(
  projections = H_EARTH_REGION_FIBONACCI_PROJECTIONS
) {
  const records = {};

  (Array.isArray(projections) ? projections : []).forEach(
    (projection) => {
      if (!projection?.cellId) {
        return;
      }

      records[projection.cellId] = projection;
    }
  );

  return Object.freeze(records);
}

export const H_EARTH_REGION_FIBONACCI_PROJECTIONS_BY_CELL_ID =
  buildHEarthRegionFibonacciProjectionsByCellId();

export function buildHEarthRegionFibonacciCellsByBand(
  projections = H_EARTH_REGION_FIBONACCI_PROJECTIONS
) {
  const records = {};

  H_EARTH_REGION_FIBONACCI_SEQUENCE.forEach((sequenceValue, index) => {
    const bandId = `H_EARTH_FIBONACCI_BAND_${padBandIndex(index)}`;

    records[bandId] = {
      bandId,
      sequenceIndex: index,
      sequenceValue,
      cellIds: []
    };
  });

  (Array.isArray(projections) ? projections : []).forEach(
    (projection) => {
      const bandId =
        projection?.fibonacciProjection?.fibonacciBandId;

      if (!bandId || !records[bandId]) {
        return;
      }

      records[bandId].cellIds.push(projection.cellId);
    }
  );

  Object.keys(records).forEach((bandId) => {
    records[bandId] = Object.freeze({
      ...records[bandId],
      cellIds: Object.freeze(records[bandId].cellIds)
    });
  });

  return Object.freeze(records);
}

export const H_EARTH_REGION_FIBONACCI_CELLS_BY_BAND =
  buildHEarthRegionFibonacciCellsByBand();

export function getHEarthRegionFibonacciSequence() {
  return H_EARTH_REGION_FIBONACCI_SEQUENCE;
}

export function getHEarthRegionFibonacciProjectionPolicy() {
  return H_EARTH_REGION_FIBONACCI_PROJECTION_POLICY;
}

export function getHEarthRegionFibonacciProjections() {
  return H_EARTH_REGION_FIBONACCI_PROJECTIONS;
}

export function getHEarthRegionFibonacciProjectionsByCellId() {
  return H_EARTH_REGION_FIBONACCI_PROJECTIONS_BY_CELL_ID;
}

export function getHEarthRegionFibonacciCellsByBand() {
  return H_EARTH_REGION_FIBONACCI_CELLS_BY_BAND;
}

export function getHEarthRegionFibonacciProjectionByCellId(cellId) {
  const normalizedCellId = String(cellId || '').trim();

  if (!normalizedCellId) {
    return null;
  }

  return (
    H_EARTH_REGION_FIBONACCI_PROJECTIONS_BY_CELL_ID[
      normalizedCellId
    ] || null
  );
}

export function getHEarthRegionFibonacciProjectionAtCoordinate(
  coordinate
) {
  const foundationDescription =
    describeHEarthFoundationCoordinate(coordinate);

  if (foundationDescription?.foundationAccepted !== true) {
    return null;
  }

  const cell = getHEarthRegionCellAtCoordinate(coordinate);

  if (!cell?.cellId) {
    return null;
  }

  return getHEarthRegionFibonacciProjectionByCellId(cell.cellId);
}

export function getHEarthRegionFibonacciBandRecord(bandIdOrIndex) {
  if (
    Number.isInteger(bandIdOrIndex) &&
    bandIdOrIndex >= 0 &&
    bandIdOrIndex < H_EARTH_REGION_FIBONACCI_SEQUENCE.length
  ) {
    return (
      H_EARTH_REGION_FIBONACCI_CELLS_BY_BAND[
        `H_EARTH_FIBONACCI_BAND_${padBandIndex(bandIdOrIndex)}`
      ] || null
    );
  }

  const normalizedBandId = String(bandIdOrIndex || '').trim();

  if (!normalizedBandId) {
    return null;
  }

  return H_EARTH_REGION_FIBONACCI_CELLS_BY_BAND[normalizedBandId] || null;
}

export function getHEarthRegionFibonacciBandForCell(cellOrCellId) {
  const projection =
    typeof cellOrCellId === 'string'
      ? getHEarthRegionFibonacciProjectionByCellId(cellOrCellId)
      : createHEarthRegionFibonacciProjectionForCell(cellOrCellId);

  if (!projection?.fibonacciProjection?.fibonacciBandId) {
    return null;
  }

  return getHEarthRegionFibonacciBandRecord(
    projection.fibonacciProjection.fibonacciBandId
  );
}

export function getHEarthRegionFibonacciSummary() {
  const projections = getHEarthRegionFibonacciProjections();
  const cellsByBand = getHEarthRegionFibonacciCellsByBand();
  const newsSummary = getHEarthRegionNewsSummary();

  const bandSummaries = Object.keys(cellsByBand).map((bandId) => {
    const band = cellsByBand[bandId];

    return Object.freeze({
      bandId,
      sequenceIndex: band.sequenceIndex,
      sequenceValue: band.sequenceValue,
      cellCount: band.cellIds.length
    });
  });

  return Object.freeze({
    contractId: H_EARTH_REGION_FIBONACCI_CONTRACT_ID,

    consumedContracts: Object.freeze({
      regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
      regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID
    }),

    projectionStatus:
      H_EARTH_REGION_FIBONACCI_PROJECTION_POLICY.projectionStatus,

    sequence: H_EARTH_REGION_FIBONACCI_SEQUENCE,

    totalProjectedCells: projections.length,

    expectedCellCount:
      H_EARTH_REGION_LATTICE_DIMENSIONS.totalCells,

    allLatticeCellsProjected:
      projections.length === H_EARTH_REGION_LATTICE_DIMENSIONS.totalCells,

    bandSummaries: Object.freeze(bandSummaries),

    newsSummaryAvailable: Boolean(newsSummary),
    newsTotalClassifiedCells:
      newsSummary?.totalClassifiedCells || 0,

    governanceOrder: getHEarthRegionNewsGovernanceOrder(),
    visibleCircumferenceOrder:
      getHEarthRegionNewsVisibleCircumferenceOrder(),

    newsFibonacciSynchronizationClaim: false,
    finalFibonacciGovernanceClaim: false,
    chronological256SequenceClaim: false,
    spiralLawClaim: false,
    fulcrumSynchronizationClaim: false,

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsNineSummitAnchors: false,
    createsRenderer: false,
    createsCamera: false,
    createsTravel: false,
    createsStreaming: false,
    createsLoadingPriority: false,
    createsVisibilityPipeline: false,
    createsTerrain: false,
    createsDetails: false,
    createsDiagnostics: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    futureGovernanceExtractionRequired: true,

    claimBoundaryPreserved: true
  });
}

export const H_EARTH_REGION_FIBONACCI = Object.freeze({
  contractId: H_EARTH_REGION_FIBONACCI_CONTRACT_ID,

  consumedContracts: Object.freeze({
    regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
    regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
    regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
    regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID
  }),

  status: H_EARTH_REGION_FIBONACCI_STATUS,
  ownership: H_EARTH_REGION_FIBONACCI_OWNERSHIP,
  projectionPolicy: H_EARTH_REGION_FIBONACCI_PROJECTION_POLICY,

  sequence: H_EARTH_REGION_FIBONACCI_SEQUENCE,

  projections: H_EARTH_REGION_FIBONACCI_PROJECTIONS,
  projectionsByCellId:
    H_EARTH_REGION_FIBONACCI_PROJECTIONS_BY_CELL_ID,
  cellsByBand: H_EARTH_REGION_FIBONACCI_CELLS_BY_BAND,

  fibonacciProjectionOnly: true,

  createsCoordinateSpace: false,
  createsLatticeCells: false,
  createsNewsClassification: false,
  createsFinalFibonacciGovernance: false,
  createsFibonacciSynchronization: false,
  createsChronological256Sequence: false,
  createsNineSummitAnchors: false,
  createsRenderer: false,
  createsCamera: false,
  createsTravelController: false,
  createsRuntimeStreaming: false,
  createsLoadingPriority: false,
  createsVisibilityPipeline: false,
  createsTerrain: false,
  createsDetailGeometry: false,
  createsDiagnostics: false,

  validationClaim: false,
  productionClaim: false,
  visualPassClaim: false,

  futureGovernanceExtractionRequired: true,

  claimBoundaryPreserved: true
});

export function getHEarthRegionFibonacciContract() {
  return H_EARTH_REGION_FIBONACCI;
}

export function getHEarthRegionFibonacciReceipt() {
  const summary = getHEarthRegionFibonacciSummary();

  return Object.freeze({
    receiptId:
      'H_EARTH_REGION_FIBONACCI_RECEIPT_STEP_005_SEQUENCE_PROJECTION_v1',

    contractId: H_EARTH_REGION_FIBONACCI_CONTRACT_ID,

    consumedContracts: Object.freeze({
      regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
      regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID
    }),

    status: 'FIBONACCI_SEQUENCE_PROJECTION_DEFINED',

    projectionStatus:
      H_EARTH_REGION_FIBONACCI_PROJECTION_POLICY.projectionStatus,

    sequence: H_EARTH_REGION_FIBONACCI_SEQUENCE,

    totalProjectedCells: summary.totalProjectedCells,
    expectedCellCount: summary.expectedCellCount,
    allLatticeCellsProjected: summary.allLatticeCellsProjected,

    bandSummaries: summary.bandSummaries,

    consumesExistingSpace: true,
    consumesExistingLattice: true,
    consumesExistingFoundation: true,
    consumesExistingNews: true,

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsFinalFibonacciGovernance: false,
    createsFibonacciSynchronization: false,
    createsChronological256Sequence: false,
    createsNineSummitAnchors: false,
    createsRenderer: false,
    createsCamera: false,
    createsTravel: false,
    createsStreaming: false,
    createsLoadingPriority: false,
    createsVisibilityPipeline: false,
    createsTerrain: false,
    createsDetails: false,
    createsDiagnostics: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    futureGovernanceExtractionRequired: true,

    claimBoundaryPreserved: true
  });
}

export default H_EARTH_REGION_FIBONACCI;
