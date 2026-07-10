// /showroom/globe/h-earth/region-foundation.js
// COMPLETE NEW FILE
// H_EARTH_REGION_FOUNDATION_FILE_BIRTH_STEP_003_SPACE_LATTICE_FOUNDATION_v1
//
// Consumes:
// /showroom/globe/h-earth/region-space.js
// H_EARTH_REGION_SPACE_FILE_BIRTH_STEP_001_COORDINATE_CONSTITUTION_v1
//
// /showroom/globe/h-earth/region-lattice.js
// H_EARTH_REGION_LATTICE_FILE_BIRTH_STEP_002_NEUTRAL_256_CELL_SUBDIVISION_v1
//
// Purpose:
// Provides one neutral foundation surface for the current H-Earth Path 3
// coordinate region by composing the installed coordinate constitution and
// neutral 256-cell lattice.
//
// This file creates no new spatial law.
//
// It does not create:
// - independent coordinates
// - NEWS classification
// - Fibonacci bands
// - Fibonacci synchronization
// - Nine Summit anchors
// - renderer behavior
// - camera behavior
// - travel behavior
// - streaming/loading/visibility behavior
// - terrain
// - water
// - rocks, puddles, foam, manor, or detail geometry
// - diagnostics
// - production claim
// - validation claim
// - visual-pass claim

import {
  H_EARTH_REGION_SPACE_CONTRACT_ID,
  H_EARTH_REGION_SPACE,
  getRegionSpaceContract,
  getRegionBounds,
  getRegionOrigin,
  getRegionSurfaceBaseline,
  normalizeCoordinateInput,
  getCoordinateViolations,
  isCoordinateInsideRegion,
  clampCoordinateToRegion,
  describeCoordinate,
  getRegionSpaceReceipt
} from './region-space.js';

import {
  H_EARTH_REGION_LATTICE_CONTRACT_ID,
  H_EARTH_REGION_LATTICE,
  H_EARTH_REGION_LATTICE_DIMENSIONS,
  getHEarthRegionLatticeContract,
  getHEarthRegionLatticeReceipt,
  getHEarthRegionLatticeCells,
  getHEarthRegionLatticeCellsById,
  getHEarthRegionCellById,
  getHEarthRegionCellByLatticeIndex,
  getHEarthRegionCellAtCoordinate,
  resolveHEarthLatticeIndexesFromCoordinate,
  isHEarthCoordinateInsideCell,
  getHEarthRegionCellStructuralAdjacency
} from './region-lattice.js';

export const H_EARTH_REGION_FOUNDATION_CONTRACT_ID =
  'H_EARTH_REGION_FOUNDATION_FILE_BIRTH_STEP_003_SPACE_LATTICE_FOUNDATION_v1';

export const H_EARTH_REGION_FOUNDATION_STATUS = Object.freeze({
  path: 'PATH_3_COORDINATE_GOVERNED_IMMERSIVE_REGION',
  buildStage: 'SPACE_AND_LATTICE_FOUNDATION_ONLY',
  implementationClass: 'NEUTRAL_FOUNDATION_COMPOSITION',

  productionClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  rendererClaim: false,
  cameraClaim: false,
  travelClaim: false,
  streamingClaim: false,
  loadingClaim: false,
  visibilityClaim: false,
  newsClaim: false,
  fibonacciClaim: false,
  nineSummitClaim: false,
  detailGeometryClaim: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_FOUNDATION_OWNERSHIP = Object.freeze({
  consumesRegionSpace: true,
  consumesRegionLattice: true,
  composesExistingFoundation: true,
  createsNewCoordinateLaw: false,
  createsNewLatticeLaw: false,

  providesUnifiedFoundationSurface: true,
  providesCoordinateFacade: true,
  providesCellFacade: true,
  providesReceiptFacade: true,

  createsNewsClassification: false,
  createsFibonacciBands: false,
  createsFibonacciSynchronization: false,
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

function getFoundationSpaceContract() {
  return getRegionSpaceContract();
}

function getFoundationLatticeContract() {
  return getHEarthRegionLatticeContract();
}

export function getHEarthRegionFoundationContract() {
  return Object.freeze({
    contractId: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,

    consumedContracts: Object.freeze({
      regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
      regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID
    }),

    status: H_EARTH_REGION_FOUNDATION_STATUS,
    ownership: H_EARTH_REGION_FOUNDATION_OWNERSHIP,

    space: getFoundationSpaceContract(),
    lattice: getFoundationLatticeContract(),

    neutralFoundationOnly: true,

    createsNewsClassification: false,
    createsFibonacciBands: false,
    createsFibonacciSynchronization: false,
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
}

export function getHEarthRegionFoundationBounds() {
  return getRegionBounds();
}

export function getHEarthRegionFoundationOrigin() {
  return getRegionOrigin();
}

export function getHEarthRegionFoundationSurfaceBaseline() {
  return getRegionSurfaceBaseline();
}

export function describeHEarthFoundationCoordinate(coordinate) {
  const point = normalizeCoordinateInput(coordinate);
  const coordinateDescription = describeCoordinate(coordinate);

  if (!point || coordinateDescription.validInput !== true) {
    return Object.freeze({
      validInput: false,
      insideRegion: false,
      coordinate: null,
      coordinateDescription,
      latticeIndexes: null,
      cell: null,
      structuralAdjacency: null,
      foundationAccepted: false,
      reason: 'Coordinate must contain finite numeric x, y, and z values.'
    });
  }

  const latticeIndexes =
    resolveHEarthLatticeIndexesFromCoordinate(point);

  const cell =
    latticeIndexes?.cellId
      ? getHEarthRegionCellById(latticeIndexes.cellId)
      : null;

  const structuralAdjacency =
    cell?.cellId
      ? getHEarthRegionCellStructuralAdjacency(cell.cellId)
      : null;

  return Object.freeze({
    validInput: true,
    insideRegion: isCoordinateInsideRegion(point),
    coordinate: Object.freeze(point),

    coordinateDescription,
    latticeIndexes,
    cell,
    structuralAdjacency,

    foundationAccepted:
      coordinateDescription.insideRegion === true &&
      Boolean(latticeIndexes) &&
      Boolean(cell),

    createsNewsClassification: false,
    createsFibonacciBand: false,
    createsNineSummitAnchor: false,
    createsTravelDecision: false,
    createsRendererState: false,

    claimBoundaryPreserved: true
  });
}

export function getHEarthFoundationCellByCoordinate(coordinate) {
  return getHEarthRegionCellAtCoordinate(coordinate);
}

export function getHEarthFoundationCellById(cellId) {
  return getHEarthRegionCellById(cellId);
}

export function getHEarthFoundationCellByLatticeIndex(latticeX, latticeZ) {
  return getHEarthRegionCellByLatticeIndex(latticeX, latticeZ);
}

export function getHEarthFoundationCells() {
  return getHEarthRegionLatticeCells();
}

export function getHEarthFoundationCellsById() {
  return getHEarthRegionLatticeCellsById();
}

export function getHEarthFoundationCellStructuralAdjacency(cellOrCellId) {
  return getHEarthRegionCellStructuralAdjacency(cellOrCellId);
}

export function isHEarthFoundationCoordinateInsideCell(
  coordinate,
  cellOrCellId
) {
  return isHEarthCoordinateInsideCell(coordinate, cellOrCellId);
}

export function getHEarthRegionFoundationReceipts() {
  return Object.freeze({
    foundationReceiptId:
      'H_EARTH_REGION_FOUNDATION_RECEIPT_STEP_003_SPACE_LATTICE_FOUNDATION_v1',

    contractId: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,

    consumedContracts: Object.freeze({
      regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
      regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID
    }),

    regionSpaceReceipt: getRegionSpaceReceipt(),
    regionLatticeReceipt: getHEarthRegionLatticeReceipt(),

    status: 'SPACE_AND_LATTICE_FOUNDATION_COMPOSED',

    spaceBoundsPresent: Boolean(H_EARTH_REGION_SPACE?.bounds),
    latticeCellsPresent: Array.isArray(getHEarthRegionLatticeCells()),

    expectedCellCount:
      H_EARTH_REGION_LATTICE_DIMENSIONS.totalCells,

    actualCellCount:
      getHEarthRegionLatticeCells().length,

    cellCountMatchesExpected:
      getHEarthRegionLatticeCells().length ===
      H_EARTH_REGION_LATTICE_DIMENSIONS.totalCells,

    coordinateFacadeDefined:
      typeof describeHEarthFoundationCoordinate === 'function',

    cellFacadeDefined:
      typeof getHEarthFoundationCellById === 'function',

    createsNewCoordinateLaw: false,
    createsNewLatticeLaw: false,
    createsNews: false,
    createsFibonacci: false,
    createsNineSummits: false,
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

export const H_EARTH_REGION_FOUNDATION = Object.freeze({
  contractId: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,

  consumedContracts: Object.freeze({
    regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
    regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID
  }),

  status: H_EARTH_REGION_FOUNDATION_STATUS,
  ownership: H_EARTH_REGION_FOUNDATION_OWNERSHIP,

  neutralFoundationOnly: true,

  regionBounds: getRegionBounds(),
  regionOrigin: getRegionOrigin(),
  regionSurfaceBaseline: getRegionSurfaceBaseline(),

  latticeDimensions: H_EARTH_REGION_LATTICE_DIMENSIONS,
  latticeCellCount: getHEarthRegionLatticeCells().length,

  createsNewCoordinateLaw: false,
  createsNewLatticeLaw: false,
  createsNewsClassification: false,
  createsFibonacciBands: false,
  createsFibonacciSynchronization: false,
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

export {
  getCoordinateViolations,
  isCoordinateInsideRegion,
  clampCoordinateToRegion,
  normalizeCoordinateInput
};

export default H_EARTH_REGION_FOUNDATION;
