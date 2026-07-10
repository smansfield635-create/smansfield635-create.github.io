// /showroom/globe/h-earth/region-news.js
// COMPLETE NEW FILE
// H_EARTH_REGION_NEWS_FILE_BIRTH_STEP_004_DIRECTIONAL_CLASSIFICATION_v1
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
// Purpose:
// Classifies existing neutral H-Earth lattice cells by NEWS directional relation.
//
// This file creates directional classification only.
//
// It does not create:
// - coordinate space
// - lattice cells
// - independent cell bounds
// - Fibonacci bands
// - Fibonacci synchronization
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
// region-news.js owns:
// - NEWS directional classification of existing cells
// - distinction between governance order and visible circumference order
// - axis-derived directional sector assignment
// - center-cell classification
// - NEWS lookup helpers
//
// region-news.js does not own:
// - axis law
// - origin
// - bounds
// - cell creation
// - Fibonacci sequencing
// - chronological 256 sequencing
// - rendering
// - travel
//
// Required distinction:
// Governance order: North → East → West → South
// Visible circumference order: North → East → South → West

import {
  H_EARTH_REGION_SPACE_CONTRACT_ID,
  H_EARTH_REGION_SPACE,
  describeCoordinate
} from './region-space.js';

import {
  H_EARTH_REGION_LATTICE_CONTRACT_ID,
  getHEarthRegionLatticeCells,
  getHEarthRegionCellById,
  getHEarthRegionCellAtCoordinate
} from './region-lattice.js';

import {
  H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
  describeHEarthFoundationCoordinate
} from './region-foundation.js';

export const H_EARTH_REGION_NEWS_CONTRACT_ID =
  'H_EARTH_REGION_NEWS_FILE_BIRTH_STEP_004_DIRECTIONAL_CLASSIFICATION_v1';

export const H_EARTH_REGION_NEWS_GOVERNANCE_ORDER = Object.freeze([
  'NORTH',
  'EAST',
  'WEST',
  'SOUTH'
]);

export const H_EARTH_REGION_NEWS_VISIBLE_CIRCUMFERENCE_ORDER = Object.freeze([
  'NORTH',
  'EAST',
  'SOUTH',
  'WEST'
]);

export const H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION = 'CENTER';

export const H_EARTH_REGION_NEWS_STATUS = Object.freeze({
  path: 'PATH_3_COORDINATE_GOVERNED_IMMERSIVE_REGION',
  buildStage: 'NEWS_DIRECTIONAL_CLASSIFICATION_ONLY',
  implementationClass: 'NEWS_CLASSIFICATION_OVER_EXISTING_LATTICE',

  productionClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  rendererClaim: false,
  cameraClaim: false,
  travelClaim: false,
  streamingClaim: false,
  loadingClaim: false,
  visibilityClaim: false,
  fibonacciClaim: false,
  fibonacciSynchronizationClaim: false,
  nineSummitClaim: false,
  detailGeometryClaim: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_NEWS_OWNERSHIP = Object.freeze({
  consumesRegionSpace: true,
  consumesRegionLattice: true,
  consumesRegionFoundation: true,

  classifiesExistingCells: true,
  createsNewsClassification: true,
  preservesGovernanceOrder: true,
  preservesVisibleCircumferenceOrder: true,
  distinguishesGovernanceFromVisibleOrder: true,

  createsCoordinateSpace: false,
  createsLatticeCells: false,
  redefinesAxes: false,
  redefinesOrigin: false,
  redefinesWorldBounds: false,
  redefinesCellBounds: false,

  createsFibonacciBands: false,
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeNewsClass(value) {
  const normalized = String(value || '').trim().toUpperCase();

  if (
    normalized === 'NORTH' ||
    normalized === 'EAST' ||
    normalized === 'WEST' ||
    normalized === 'SOUTH' ||
    normalized === 'CENTER'
  ) {
    return normalized;
  }

  return null;
}

function getGovernanceOrderIndex(newsClass) {
  const normalized = normalizeNewsClass(newsClass);

  if (normalized === H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION) {
    return null;
  }

  const index = H_EARTH_REGION_NEWS_GOVERNANCE_ORDER.indexOf(normalized);
  return index >= 0 ? index : null;
}

function getVisibleCircumferenceOrderIndex(newsClass) {
  const normalized = normalizeNewsClass(newsClass);

  if (normalized === H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION) {
    return null;
  }

  const index =
    H_EARTH_REGION_NEWS_VISIBLE_CIRCUMFERENCE_ORDER.indexOf(normalized);

  return index >= 0 ? index : null;
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

function classifyNewsFromCoordinateRelation(coordinate) {
  const pointDescription = describeCoordinate(coordinate);

  if (!pointDescription?.validInput) {
    return null;
  }

  const point = pointDescription.coordinate;

  if (!point) {
    return null;
  }

  if (point.x === 0 && point.z === 0) {
    return H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION;
  }

  const absX = Math.abs(point.x);
  const absZ = Math.abs(point.z);

  if (absZ >= absX) {
    return point.z >= 0 ? 'NORTH' : 'SOUTH';
  }

  return point.x >= 0 ? 'EAST' : 'WEST';
}

export function classifyHEarthRegionCellNews(cellOrCellId) {
  const cell =
    typeof cellOrCellId === 'string'
      ? getHEarthRegionCellById(cellOrCellId)
      : cellOrCellId;

  if (!cell?.cellId || !cell?.center) {
    return null;
  }

  const newsClass = isCenterCoreCell(cell)
    ? H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION
    : classifyNewsFromCoordinateRelation(cell.center);

  if (!newsClass) {
    return null;
  }

  const axisRelation = describeCoordinate(cell.center)?.axisRelation || null;

  return Object.freeze({
    cellId: cell.cellId,

    latticeX: cell.latticeX,
    latticeZ: cell.latticeZ,

    center: clone(cell.center),
    axisRelation,

    newsClass,

    governanceOrder:
      newsClass === H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION
        ? null
        : H_EARTH_REGION_NEWS_GOVERNANCE_ORDER,

    governanceOrderIndex: getGovernanceOrderIndex(newsClass),

    visibleCircumferenceOrder:
      newsClass === H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION
        ? null
        : H_EARTH_REGION_NEWS_VISIBLE_CIRCUMFERENCE_ORDER,

    visibleCircumferenceOrderIndex:
      getVisibleCircumferenceOrderIndex(newsClass),

    classificationMethod: isCenterCoreCell(cell)
      ? 'CENTER_CORE_FOUR_CELL_CLASSIFICATION'
      : 'AXIS_DOMINANCE_FROM_EXISTING_CELL_CENTER',

    governanceOrderIsNotVisibleCircumferenceOrder: true,

    createsCoordinateSpace: false,
    createsLatticeCell: false,
    createsFibonacciBand: false,
    createsFibonacciSynchronization: false,
    createsChronological256Sequence: false,
    createsNineSummitAnchor: false,
    createsRendererState: false,
    createsTravelState: false,
    createsLoadingState: false,
    createsVisibilityState: false,

    newsClassificationAssigned: true,
    claimBoundaryPreserved: true
  });
}

export function buildHEarthRegionNewsClassifications(
  cells = getHEarthRegionLatticeCells()
) {
  const classifications = [];

  (Array.isArray(cells) ? cells : []).forEach((cell) => {
    const classification = classifyHEarthRegionCellNews(cell);

    if (classification) {
      classifications.push(classification);
    }
  });

  return Object.freeze(classifications);
}

export const H_EARTH_REGION_NEWS_CLASSIFICATIONS =
  buildHEarthRegionNewsClassifications();

export function buildHEarthRegionNewsClassificationsByCellId(
  classifications = H_EARTH_REGION_NEWS_CLASSIFICATIONS
) {
  const records = {};

  (Array.isArray(classifications) ? classifications : []).forEach(
    (classification) => {
      if (!classification?.cellId) {
        return;
      }

      records[classification.cellId] = classification;
    }
  );

  return Object.freeze(records);
}

export const H_EARTH_REGION_NEWS_CLASSIFICATIONS_BY_CELL_ID =
  buildHEarthRegionNewsClassificationsByCellId();

export function buildHEarthRegionNewsCellsByClass(
  classifications = H_EARTH_REGION_NEWS_CLASSIFICATIONS
) {
  const records = {
    NORTH: [],
    EAST: [],
    WEST: [],
    SOUTH: [],
    CENTER: []
  };

  (Array.isArray(classifications) ? classifications : []).forEach(
    (classification) => {
      const newsClass = normalizeNewsClass(classification?.newsClass);

      if (!newsClass || !Array.isArray(records[newsClass])) {
        return;
      }

      records[newsClass].push(classification.cellId);
    }
  );

  return Object.freeze({
    NORTH: Object.freeze(records.NORTH),
    EAST: Object.freeze(records.EAST),
    WEST: Object.freeze(records.WEST),
    SOUTH: Object.freeze(records.SOUTH),
    CENTER: Object.freeze(records.CENTER)
  });
}

export const H_EARTH_REGION_NEWS_CELLS_BY_CLASS =
  buildHEarthRegionNewsCellsByClass();

export function getHEarthRegionNewsClassifications() {
  return H_EARTH_REGION_NEWS_CLASSIFICATIONS;
}

export function getHEarthRegionNewsClassificationsByCellId() {
  return H_EARTH_REGION_NEWS_CLASSIFICATIONS_BY_CELL_ID;
}

export function getHEarthRegionNewsCellsByClass() {
  return H_EARTH_REGION_NEWS_CELLS_BY_CLASS;
}

export function getHEarthRegionNewsClassificationByCellId(cellId) {
  const normalizedCellId = String(cellId || '').trim();

  if (!normalizedCellId) {
    return null;
  }

  return H_EARTH_REGION_NEWS_CLASSIFICATIONS_BY_CELL_ID[normalizedCellId] || null;
}

export function getHEarthRegionNewsClassificationAtCoordinate(coordinate) {
  const foundationDescription =
    describeHEarthFoundationCoordinate(coordinate);

  if (foundationDescription?.foundationAccepted !== true) {
    return null;
  }

  const cell = getHEarthRegionCellAtCoordinate(coordinate);

  if (!cell?.cellId) {
    return null;
  }

  return getHEarthRegionNewsClassificationByCellId(cell.cellId);
}

export function getHEarthRegionCellsByNewsClass(newsClass) {
  const normalized = normalizeNewsClass(newsClass);

  if (!normalized) {
    return Object.freeze([]);
  }

  return H_EARTH_REGION_NEWS_CELLS_BY_CLASS[normalized] || Object.freeze([]);
}

export function getHEarthRegionNewsGovernanceOrder() {
  return H_EARTH_REGION_NEWS_GOVERNANCE_ORDER;
}

export function getHEarthRegionNewsVisibleCircumferenceOrder() {
  return H_EARTH_REGION_NEWS_VISIBLE_CIRCUMFERENCE_ORDER;
}

export function getHEarthRegionNewsOrderRecord(newsClass) {
  const normalized = normalizeNewsClass(newsClass);

  if (!normalized) {
    return null;
  }

  return Object.freeze({
    newsClass: normalized,

    isCenter:
      normalized === H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION,

    governanceOrder:
      normalized === H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION
        ? null
        : H_EARTH_REGION_NEWS_GOVERNANCE_ORDER,

    governanceOrderIndex: getGovernanceOrderIndex(normalized),

    visibleCircumferenceOrder:
      normalized === H_EARTH_REGION_NEWS_CENTER_CLASSIFICATION
        ? null
        : H_EARTH_REGION_NEWS_VISIBLE_CIRCUMFERENCE_ORDER,

    visibleCircumferenceOrderIndex:
      getVisibleCircumferenceOrderIndex(normalized),

    governanceOrderIsNotVisibleCircumferenceOrder: true,

    chronological256SequenceClaim: false,
    fibonacciSynchronizationClaim: false,

    claimBoundaryPreserved: true
  });
}

export function getHEarthRegionNewsSummary() {
  const cellsByClass = getHEarthRegionNewsCellsByClass();

  return Object.freeze({
    contractId: H_EARTH_REGION_NEWS_CONTRACT_ID,

    consumedContracts: Object.freeze({
      regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
      regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID
    }),

    totalClassifiedCells:
      H_EARTH_REGION_NEWS_CLASSIFICATIONS.length,

    northCellCount: cellsByClass.NORTH.length,
    eastCellCount: cellsByClass.EAST.length,
    westCellCount: cellsByClass.WEST.length,
    southCellCount: cellsByClass.SOUTH.length,
    centerCellCount: cellsByClass.CENTER.length,

    governanceOrder: H_EARTH_REGION_NEWS_GOVERNANCE_ORDER,
    visibleCircumferenceOrder:
      H_EARTH_REGION_NEWS_VISIBLE_CIRCUMFERENCE_ORDER,

    governanceOrderIsNotVisibleCircumferenceOrder: true,

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsFibonacciBands: false,
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

    claimBoundaryPreserved: true
  });
}

export const H_EARTH_REGION_NEWS = Object.freeze({
  contractId: H_EARTH_REGION_NEWS_CONTRACT_ID,

  consumedContracts: Object.freeze({
    regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
    regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
    regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID
  }),

  status: H_EARTH_REGION_NEWS_STATUS,
  ownership: H_EARTH_REGION_NEWS_OWNERSHIP,

  governanceOrder: H_EARTH_REGION_NEWS_GOVERNANCE_ORDER,
  visibleCircumferenceOrder:
    H_EARTH_REGION_NEWS_VISIBLE_CIRCUMFERENCE_ORDER,

  classifications: H_EARTH_REGION_NEWS_CLASSIFICATIONS,
  classificationsByCellId:
    H_EARTH_REGION_NEWS_CLASSIFICATIONS_BY_CELL_ID,
  cellsByClass: H_EARTH_REGION_NEWS_CELLS_BY_CLASS,

  directionalClassificationOnly: true,

  createsCoordinateSpace: false,
  createsLatticeCells: false,
  createsFibonacciBands: false,
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

  claimBoundaryPreserved: true
});

export function getHEarthRegionNewsContract() {
  return H_EARTH_REGION_NEWS;
}

export function getHEarthRegionNewsReceipt() {
  const summary = getHEarthRegionNewsSummary();

  return Object.freeze({
    receiptId:
      'H_EARTH_REGION_NEWS_RECEIPT_STEP_004_DIRECTIONAL_CLASSIFICATION_v1',

    contractId: H_EARTH_REGION_NEWS_CONTRACT_ID,

    consumedContracts: Object.freeze({
      regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
      regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID
    }),

    status: 'NEWS_DIRECTIONAL_CLASSIFICATION_DEFINED',

    totalClassifiedCells: summary.totalClassifiedCells,
    northCellCount: summary.northCellCount,
    eastCellCount: summary.eastCellCount,
    westCellCount: summary.westCellCount,
    southCellCount: summary.southCellCount,
    centerCellCount: summary.centerCellCount,

    allLatticeCellsClassified:
      summary.totalClassifiedCells === getHEarthRegionLatticeCells().length,

    governanceOrder: H_EARTH_REGION_NEWS_GOVERNANCE_ORDER,
    visibleCircumferenceOrder:
      H_EARTH_REGION_NEWS_VISIBLE_CIRCUMFERENCE_ORDER,

    governanceOrderIsNotVisibleCircumferenceOrder: true,

    regionSpaceStillOwnsAxisLaw: true,
    regionLatticeStillOwnsCellCreation: true,
    regionFoundationStillOwnsFoundationFacade: true,

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsFibonacciBands: false,
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

    claimBoundaryPreserved: true
  });
}

export default H_EARTH_REGION_NEWS;
