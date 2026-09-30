// /showroom/globe/h-earth/region-integrity.js
// COMPLETE NEW FILE
// H_EARTH_REGION_INTEGRITY_FILE_BIRTH_STEP_006_FOUNDATION_SPINE_AUDIT_v1
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
// /showroom/globe/h-earth/region-fibonacci.js
// H_EARTH_REGION_FIBONACCI_FILE_BIRTH_STEP_005_SEQUENCE_PROJECTION_v1
//
// Purpose:
// Audits the H-Earth Path 3 mathematical foundation spine from Steps 001–005.
//
// This file creates integrity/audit descriptors only.
//
// It does not create:
// - coordinate space
// - lattice cells
// - NEWS classification
// - Fibonacci bands
// - final Fibonacci governance
// - NEWS/Fibonacci synchronization
// - chronological 256 sequencing
// - Nine Summit anchors
// - renderer behavior
// - camera behavior
// - travel behavior
// - streaming/loading/visibility behavior
// - terrain
// - water
// - shoreline geometry
// - rocks, puddles, foam, manor, or detail geometry
// - production claim
// - validation claim
// - visual-pass claim
//
// Ownership:
// region-integrity.js owns:
// - structural audit descriptors for Steps 001–005
// - API warning preservation
// - claim-leak checks
// - foundation spine receipt
//
// region-integrity.js does not own:
// - any mathematical law from Steps 001–005
// - any renderer, travel, terrain, summit, or detail behavior
//
// Boundary:
// Integrity audit is not validation.
// Integrity audit is not production.
// Integrity audit is not a visual pass.

import {
  H_EARTH_REGION_SPACE_CONTRACT_ID,
  H_EARTH_REGION_SPACE,
  getRegionBounds,
  getRegionOrigin,
  getRegionSurfaceBaseline,
  isCoordinateInsideRegion,
  describeCoordinate,
  getRegionSpaceReceipt
} from './region-space.js';

import {
  H_EARTH_REGION_LATTICE_CONTRACT_ID,
  H_EARTH_REGION_LATTICE,
  H_EARTH_REGION_LATTICE_DIMENSIONS,
  getHEarthRegionLatticeCells,
  getHEarthRegionCellById,
  getHEarthRegionCellByLatticeIndex,
  getHEarthRegionCellAtCoordinate,
  getHEarthRegionCellStructuralAdjacency,
  getHEarthRegionLatticeReceipt
} from './region-lattice.js';

import {
  H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
  H_EARTH_REGION_FOUNDATION,
  describeHEarthFoundationCoordinate,
  getHEarthRegionFoundationReceipts
} from './region-foundation.js';

import {
  H_EARTH_REGION_NEWS_CONTRACT_ID,
  H_EARTH_REGION_NEWS,
  getHEarthRegionNewsReceipt,
  getHEarthRegionNewsSummary,
  getHEarthRegionNewsGovernanceOrder,
  getHEarthRegionNewsVisibleCircumferenceOrder,
  getHEarthRegionNewsClassifications,
  getHEarthRegionNewsClassificationByCellId
} from './region-news.js';

import {
  H_EARTH_REGION_FIBONACCI_CONTRACT_ID,
  H_EARTH_REGION_FIBONACCI,
  getHEarthRegionFibonacciReceipt,
  getHEarthRegionFibonacciSummary,
  getHEarthRegionFibonacciSequence,
  getHEarthRegionFibonacciProjections,
  getHEarthRegionFibonacciProjectionByCellId
} from './region-fibonacci.js';

export const H_EARTH_REGION_INTEGRITY_CONTRACT_ID =
  'H_EARTH_REGION_INTEGRITY_FILE_BIRTH_STEP_006_FOUNDATION_SPINE_AUDIT_v1';

export const H_EARTH_REGION_INTEGRITY_STATUS = Object.freeze({
  path: 'PATH_3_COORDINATE_GOVERNED_IMMERSIVE_REGION',
  buildStage: 'FOUNDATION_SPINE_AUDIT_ONLY',
  implementationClass: 'STRUCTURAL_AUDIT_DESCRIPTOR',

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
  detailGeometryClaim: false,
  nineSummitClaim: false,
  finalFibonacciGovernanceClaim: false,
  fibonacciSynchronizationClaim: false,
  chronological256SequenceClaim: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_INTEGRITY_OWNERSHIP = Object.freeze({
  consumesRegionSpace: true,
  consumesRegionLattice: true,
  consumesRegionFoundation: true,
  consumesRegionNews: true,
  consumesRegionFibonacci: true,

  auditsFoundationSpine: true,
  preservesApiWarnings: true,
  checksClaimBoundaries: true,
  checksCellContinuity: true,
  checksNewsContinuity: true,
  checksFibonacciContinuity: true,

  createsCoordinateSpace: false,
  createsLatticeCells: false,
  createsNewsClassification: false,
  createsFibonacciBands: false,
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
  createsDiagnosticsRuntime: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_INTEGRITY_API_WARNINGS = Object.freeze([
  Object.freeze({
    warningId: 'API_WARNING_01_STEP_001_EXPORT_STYLE',
    severity: 'MINOR_WARNING',
    status: 'PRESERVED_NOT_REPAIRED',
    summary:
      'Step 001 uses named exports only. Future consumers must not assume every Path 3 foundation file has a default export.',
    lock:
      'Step 001 remains named-export authority unless deliberately version-renewed.',
    forbiddenAssumption:
      'Do not silently add or assume export default H_EARTH_REGION_SPACE.'
  }),

  Object.freeze({
    warningId: 'API_WARNING_02_IMMUTABILITY_CONSISTENCY',
    severity: 'MINOR_WARNING',
    status: 'PRESERVED_NOT_REPAIRED',
    summary:
      'Some helper returns are ordinary descriptor objects rather than frozen descriptors.',
    lock:
      'Consumers should treat all public descriptors as read-only regardless of runtime freezing.',
    futureStandardCandidate:
      'ALL_PUBLIC_DESCRIPTOR_RETURNS_ARE_FROZEN'
  }),

  Object.freeze({
    warningId: 'API_WARNING_03_DUPLICATED_FOUNDATION_SURFACES',
    severity: 'MINOR_WARNING',
    status: 'PRESERVED_NOT_REPAIRED',
    summary:
      'Step 003 intentionally provides a unified facade over Step 001 and Step 002.',
    lock:
      'Consumers should choose either specialist imports or unified foundation import and avoid unnecessary mixed pathways.'
  }),

  Object.freeze({
    warningId: 'API_WARNING_04_FUTURE_FIBONACCI_GOVERNANCE',
    severity: 'MINOR_WARNING',
    status: 'PRESERVED_NOT_REPAIRED',
    summary:
      'Step 005 is projection-only and does not own final Fibonacci governance.',
    lock:
      'Step 005 must not become owner of loading priority, travel permission, synchronization, spiral governance, fulcrum governance, or chronological 256 sequencing.'
  })
]);

const EXPECTED_SPACE_BOUNDS = Object.freeze({
  x: Object.freeze({ min: -256, max: 256, span: 512 }),
  y: Object.freeze({ min: -40, max: 120, span: 160 }),
  z: Object.freeze({ min: -256, max: 256, span: 512 }),
  surfaceBaselineY: 0
});

const EXPECTED_NEWS_GOVERNANCE_ORDER = Object.freeze([
  'NORTH',
  'EAST',
  'WEST',
  'SOUTH'
]);

const EXPECTED_NEWS_VISIBLE_CIRCUMFERENCE_ORDER = Object.freeze([
  'NORTH',
  'EAST',
  'SOUTH',
  'WEST'
]);

const EXPECTED_FIBONACCI_SEQUENCE = Object.freeze([
  1,
  2,
  3,
  5,
  8,
  13,
  21,
  34
]);

const FORBIDDEN_TRUE_CLAIM_KEYS = Object.freeze([
  'productionClaim',
  'validationClaim',
  'visualPassClaim',
  'rendererClaim',
  'cameraClaim',
  'travelClaim',
  'streamingClaim',
  'loadingClaim',
  'visibilityClaim',
  'terrainClaim',
  'detailGeometryClaim',
  'nineSummitClaim',
  'finalFibonacciGovernanceClaim',
  'fibonacciSynchronizationClaim',
  'chronological256SequenceClaim',

  'createsRenderer',
  'createsCamera',
  'createsTravel',
  'createsTravelController',
  'createsRuntimeStreaming',
  'createsStreaming',
  'createsLoadingPriority',
  'createsVisibilityPipeline',
  'createsTerrain',
  'createsDetails',
  'createsDetailGeometry',
  'createsDiagnostics',
  'createsDiagnosticsRuntime',
  'createsNineSummitAnchors',
  'createsFinalFibonacciGovernance',
  'createsFibonacciSynchronization',
  'createsChronological256Sequence'
]);

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

function createAuditRecord({
  auditId,
  status,
  severity = 'INFO',
  summary,
  details = null
}) {
  return freezePlain({
    auditId,
    status,
    severity,
    summary,
    details,
    claimBoundaryPreserved: true
  });
}

function arraysEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right)) {
    return false;
  }

  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function collectForbiddenTrueClaims(sourceName, value) {
  const findings = [];

  function visit(node, path) {
    if (!node || typeof node !== 'object') {
      return;
    }

    Object.keys(node).forEach((key) => {
      const nextPath = path ? `${path}.${key}` : key;
      const nextValue = node[key];

      if (
        FORBIDDEN_TRUE_CLAIM_KEYS.includes(key) &&
        nextValue === true
      ) {
        findings.push({
          sourceName,
          path: nextPath,
          key,
          value: nextValue
        });
      }

      if (
        nextValue &&
        typeof nextValue === 'object' &&
        !Array.isArray(nextValue)
      ) {
        visit(nextValue, nextPath);
      }
    });
  }

  visit(value, '');

  return findings;
}

function auditStep001RegionSpace() {
  const bounds = getRegionBounds();
  const origin = getRegionOrigin();
  const surfaceBaseline = getRegionSurfaceBaseline();

  const boundsPass =
    bounds?.x?.min === EXPECTED_SPACE_BOUNDS.x.min &&
    bounds?.x?.max === EXPECTED_SPACE_BOUNDS.x.max &&
    bounds?.x?.span === EXPECTED_SPACE_BOUNDS.x.span &&
    bounds?.y?.min === EXPECTED_SPACE_BOUNDS.y.min &&
    bounds?.y?.max === EXPECTED_SPACE_BOUNDS.y.max &&
    bounds?.y?.span === EXPECTED_SPACE_BOUNDS.y.span &&
    bounds?.z?.min === EXPECTED_SPACE_BOUNDS.z.min &&
    bounds?.z?.max === EXPECTED_SPACE_BOUNDS.z.max &&
    bounds?.z?.span === EXPECTED_SPACE_BOUNDS.z.span;

  const originPass =
    origin?.x === 0 &&
    origin?.y === 0 &&
    origin?.z === 0;

  const surfacePass =
    surfaceBaseline === EXPECTED_SPACE_BOUNDS.surfaceBaselineY;

  const edgeCoordinatePass =
    isCoordinateInsideRegion({ x: -256, y: 0, z: -256 }) === true &&
    isCoordinateInsideRegion({ x: 256, y: 0, z: 256 }) === true &&
    isCoordinateInsideRegion({ x: 0, y: -40, z: 0 }) === true &&
    isCoordinateInsideRegion({ x: 0, y: 120, z: 0 }) === true &&
    isCoordinateInsideRegion({ x: 257, y: 0, z: 0 }) === false &&
    isCoordinateInsideRegion({ x: 0, y: 121, z: 0 }) === false &&
    isCoordinateInsideRegion({ x: 0, y: 0, z: -257 }) === false;

  const axisRelationPass =
    describeCoordinate({ x: -1, y: -1, z: -1 })?.axisRelation?.x ===
      'negative-x-west' &&
    describeCoordinate({ x: 1, y: 1, z: 1 })?.axisRelation?.y ===
      'positive-y-elevated' &&
    describeCoordinate({ x: 0, y: 0, z: 0 })?.axisRelation?.z ===
      'z-origin';

  const pass =
    boundsPass &&
    originPass &&
    surfacePass &&
    edgeCoordinatePass &&
    axisRelationPass;

  return createAuditRecord({
    auditId: 'STEP_001_REGION_SPACE_AUDIT',
    status: pass ? 'PASS' : 'FAIL',
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Step 001 region-space coordinate constitution audit.',
    details: {
      contractId: H_EARTH_REGION_SPACE_CONTRACT_ID,
      boundsPass,
      originPass,
      surfacePass,
      edgeCoordinatePass,
      axisRelationPass,
      expectedBounds: EXPECTED_SPACE_BOUNDS,
      actualBounds: bounds,
      actualOrigin: origin,
      actualSurfaceBaseline: surfaceBaseline,
      receiptPresent:
        getRegionSpaceReceipt()?.contractId ===
        H_EARTH_REGION_SPACE_CONTRACT_ID
    }
  });
}

function auditStep002RegionLattice() {
  const cells = getHEarthRegionLatticeCells();

  const cellCountPass =
    Array.isArray(cells) &&
    cells.length === H_EARTH_REGION_LATTICE_DIMENSIONS.totalCells &&
    cells.length === 256;

  const dimensionPass =
    H_EARTH_REGION_LATTICE_DIMENSIONS.columnsX === 16 &&
    H_EARTH_REGION_LATTICE_DIMENSIONS.rowsZ === 16 &&
    H_EARTH_REGION_LATTICE_DIMENSIONS.cellWidthX === 32 &&
    H_EARTH_REGION_LATTICE_DIMENSIONS.cellDepthZ === 32;

  const cornerCellPass =
    getHEarthRegionCellById('H_EARTH_REGION_CELL_X00_Z00')?.worldBounds?.x
      ?.min === -256 &&
    getHEarthRegionCellById('H_EARTH_REGION_CELL_X15_Z15')?.worldBounds?.z
      ?.max === 256;

  const boundaryLookupPass =
    getHEarthRegionCellAtCoordinate({ x: -256, y: 0, z: -256 })?.cellId ===
      'H_EARTH_REGION_CELL_X00_Z00' &&
    getHEarthRegionCellAtCoordinate({ x: 256, y: 0, z: 256 })?.cellId ===
      'H_EARTH_REGION_CELL_X15_Z15' &&
    getHEarthRegionCellAtCoordinate({ x: -224, y: 0, z: -224 })?.cellId ===
      'H_EARTH_REGION_CELL_X01_Z01';

  const centersInsidePass = cells.every((cell) =>
    isCoordinateInsideRegion(cell.center)
  );

  const stableIdPass =
    getHEarthRegionCellByLatticeIndex(7, 8)?.cellId ===
    'H_EARTH_REGION_CELL_X07_Z08';

  const adjacencyPass =
    getHEarthRegionCellStructuralAdjacency(
      'H_EARTH_REGION_CELL_X07_Z08'
    )?.negativeXCellId === 'H_EARTH_REGION_CELL_X06_Z08' &&
    getHEarthRegionCellStructuralAdjacency(
      'H_EARTH_REGION_CELL_X07_Z08'
    )?.positiveZCellId === 'H_EARTH_REGION_CELL_X07_Z09';

  const pass =
    cellCountPass &&
    dimensionPass &&
    cornerCellPass &&
    boundaryLookupPass &&
    centersInsidePass &&
    stableIdPass &&
    adjacencyPass;

  return createAuditRecord({
    auditId: 'STEP_002_REGION_LATTICE_AUDIT',
    status: pass ? 'PASS' : 'FAIL',
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Step 002 region-lattice neutral 256-cell subdivision audit.',
    details: {
      contractId: H_EARTH_REGION_LATTICE_CONTRACT_ID,
      cellCountPass,
      dimensionPass,
      cornerCellPass,
      boundaryLookupPass,
      centersInsidePass,
      stableIdPass,
      adjacencyPass,
      actualCellCount: cells.length,
      expectedCellCount: 256,
      receiptPresent:
        getHEarthRegionLatticeReceipt()?.contractId ===
        H_EARTH_REGION_LATTICE_CONTRACT_ID
    }
  });
}

function auditStep003RegionFoundation() {
  const foundationReceipts = getHEarthRegionFoundationReceipts();

  const consumedContractsPass =
    foundationReceipts?.consumedContracts?.regionSpace ===
      H_EARTH_REGION_SPACE_CONTRACT_ID &&
    foundationReceipts?.consumedContracts?.regionLattice ===
      H_EARTH_REGION_LATTICE_CONTRACT_ID;

  const foundationCoordinatePass =
    describeHEarthFoundationCoordinate({
      x: 0,
      y: 0,
      z: 0
    })?.foundationAccepted === true;

  const foundationRejectsOutsidePass =
    describeHEarthFoundationCoordinate({
      x: 999,
      y: 0,
      z: 0
    })?.foundationAccepted === false;

  const cellCountPass =
    foundationReceipts?.actualCellCount === 256 &&
    foundationReceipts?.cellCountMatchesExpected === true;

  const noNewLawPass =
    foundationReceipts?.createsNewCoordinateLaw === false &&
    foundationReceipts?.createsNewLatticeLaw === false;

  const pass =
    consumedContractsPass &&
    foundationCoordinatePass &&
    foundationRejectsOutsidePass &&
    cellCountPass &&
    noNewLawPass;

  return createAuditRecord({
    auditId: 'STEP_003_REGION_FOUNDATION_AUDIT',
    status: pass ? 'PASS' : 'FAIL',
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Step 003 region-foundation composition/facade audit.',
    details: {
      contractId: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      consumedContractsPass,
      foundationCoordinatePass,
      foundationRejectsOutsidePass,
      cellCountPass,
      noNewLawPass,
      foundationReceiptStatus: foundationReceipts?.status || null
    }
  });
}

function auditStep004RegionNews() {
  const summary = getHEarthRegionNewsSummary();
  const classifications = getHEarthRegionNewsClassifications();

  const governanceOrderPass = arraysEqual(
    getHEarthRegionNewsGovernanceOrder(),
    EXPECTED_NEWS_GOVERNANCE_ORDER
  );

  const visibleOrderPass = arraysEqual(
    getHEarthRegionNewsVisibleCircumferenceOrder(),
    EXPECTED_NEWS_VISIBLE_CIRCUMFERENCE_ORDER
  );

  const allCellsClassifiedPass =
    summary?.totalClassifiedCells === 256 &&
    classifications.length === 256;

  const centerCellsPass =
    getHEarthRegionNewsClassificationByCellId(
      'H_EARTH_REGION_CELL_X07_Z07'
    )?.newsClass === 'CENTER' &&
    getHEarthRegionNewsClassificationByCellId(
      'H_EARTH_REGION_CELL_X08_Z07'
    )?.newsClass === 'CENTER' &&
    getHEarthRegionNewsClassificationByCellId(
      'H_EARTH_REGION_CELL_X07_Z08'
    )?.newsClass === 'CENTER' &&
    getHEarthRegionNewsClassificationByCellId(
      'H_EARTH_REGION_CELL_X08_Z08'
    )?.newsClass === 'CENTER';

  const orderDistinctionPass =
    summary?.governanceOrderIsNotVisibleCircumferenceOrder === true;

  const receiptPass =
    getHEarthRegionNewsReceipt()?.contractId ===
    H_EARTH_REGION_NEWS_CONTRACT_ID;

  const pass =
    governanceOrderPass &&
    visibleOrderPass &&
    allCellsClassifiedPass &&
    centerCellsPass &&
    orderDistinctionPass &&
    receiptPass;

  return createAuditRecord({
    auditId: 'STEP_004_REGION_NEWS_AUDIT',
    status: pass ? 'PASS' : 'FAIL',
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Step 004 region-news directional classification audit.',
    details: {
      contractId: H_EARTH_REGION_NEWS_CONTRACT_ID,
      governanceOrderPass,
      visibleOrderPass,
      allCellsClassifiedPass,
      centerCellsPass,
      orderDistinctionPass,
      receiptPass,
      summary
    }
  });
}

function auditStep005RegionFibonacci() {
  const summary = getHEarthRegionFibonacciSummary();
  const sequence = getHEarthRegionFibonacciSequence();
  const projections = getHEarthRegionFibonacciProjections();

  const sequencePass = arraysEqual(
    sequence,
    EXPECTED_FIBONACCI_SEQUENCE
  );

  const allCellsProjectedPass =
    summary?.totalProjectedCells === 256 &&
    projections.length === 256 &&
    summary?.allLatticeCellsProjected === true;

  const centerProjectionPass =
    getHEarthRegionFibonacciProjectionByCellId(
      'H_EARTH_REGION_CELL_X07_Z07'
    )?.fibonacciProjection?.fibonacciSequenceIndex === 0 &&
    getHEarthRegionFibonacciProjectionByCellId(
      'H_EARTH_REGION_CELL_X08_Z08'
    )?.fibonacciProjection?.fibonacciSequenceValue === 1;

  const outerProjectionPass =
    getHEarthRegionFibonacciProjectionByCellId(
      'H_EARTH_REGION_CELL_X00_Z00'
    )?.fibonacciProjection?.fibonacciSequenceIndex === 7 &&
    getHEarthRegionFibonacciProjectionByCellId(
      'H_EARTH_REGION_CELL_X15_Z15'
    )?.fibonacciProjection?.fibonacciSequenceValue === 34;

  const projectionOnlyPass =
    summary?.finalFibonacciGovernanceClaim === false &&
    summary?.newsFibonacciSynchronizationClaim === false &&
    summary?.chronological256SequenceClaim === false &&
    summary?.futureGovernanceExtractionRequired === true;

  const receiptPass =
    getHEarthRegionFibonacciReceipt()?.contractId ===
    H_EARTH_REGION_FIBONACCI_CONTRACT_ID;

  const pass =
    sequencePass &&
    allCellsProjectedPass &&
    centerProjectionPass &&
    outerProjectionPass &&
    projectionOnlyPass &&
    receiptPass;

  return createAuditRecord({
    auditId: 'STEP_005_REGION_FIBONACCI_AUDIT',
    status: pass ? 'PASS' : 'FAIL',
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Step 005 region-fibonacci restricted sequence projection audit.',
    details: {
      contractId: H_EARTH_REGION_FIBONACCI_CONTRACT_ID,
      sequencePass,
      allCellsProjectedPass,
      centerProjectionPass,
      outerProjectionPass,
      projectionOnlyPass,
      receiptPass,
      summary
    }
  });
}

function auditClaimBoundaryPreservation() {
  const sources = [
    {
      sourceName: 'region-space',
      value: H_EARTH_REGION_SPACE
    },
    {
      sourceName: 'region-lattice',
      value: H_EARTH_REGION_LATTICE
    },
    {
      sourceName: 'region-foundation',
      value: H_EARTH_REGION_FOUNDATION
    },
    {
      sourceName: 'region-news',
      value: H_EARTH_REGION_NEWS
    },
    {
      sourceName: 'region-fibonacci',
      value: H_EARTH_REGION_FIBONACCI
    }
  ];

  const findings = sources.flatMap((source) =>
    collectForbiddenTrueClaims(source.sourceName, source.value)
  );

  const pass = findings.length === 0;

  return createAuditRecord({
    auditId: 'FOUNDATION_SPINE_FORBIDDEN_CLAIM_AUDIT',
    status: pass ? 'PASS' : 'FAIL',
    severity: pass ? 'INFO' : 'BLOCKER',
    summary:
      'Checks that renderer/travel/detail/validation/production claims have not leaked into Steps 001–005.',
    details: {
      forbiddenTrueClaimCount: findings.length,
      findings
    }
  });
}

function auditApiWarningsPreserved() {
  return createAuditRecord({
    auditId: 'API_WARNINGS_PRESERVED_AUDIT',
    status: 'PASS_WITH_MINOR_WARNINGS',
    severity: 'MINOR_WARNING',
    summary:
      'Known API warnings from the Step 001–005 review are preserved as constraints, not repaired or suppressed.',
    details: {
      warningCount: H_EARTH_REGION_INTEGRITY_API_WARNINGS.length,
      warnings: H_EARTH_REGION_INTEGRITY_API_WARNINGS
    }
  });
}

export function buildHEarthRegionIntegrityAuditRecords() {
  return Object.freeze([
    auditStep001RegionSpace(),
    auditStep002RegionLattice(),
    auditStep003RegionFoundation(),
    auditStep004RegionNews(),
    auditStep005RegionFibonacci(),
    auditClaimBoundaryPreservation(),
    auditApiWarningsPreserved()
  ]);
}

export const H_EARTH_REGION_INTEGRITY_AUDIT_RECORDS =
  buildHEarthRegionIntegrityAuditRecords();

export function getHEarthRegionIntegrityAuditRecords() {
  return H_EARTH_REGION_INTEGRITY_AUDIT_RECORDS;
}

export function getHEarthRegionIntegrityFailures(
  records = H_EARTH_REGION_INTEGRITY_AUDIT_RECORDS
) {
  return Object.freeze(
    (Array.isArray(records) ? records : []).filter(
      (record) => record.status === 'FAIL'
    )
  );
}

export function getHEarthRegionIntegrityWarnings(
  records = H_EARTH_REGION_INTEGRITY_AUDIT_RECORDS
) {
  return Object.freeze(
    (Array.isArray(records) ? records : []).filter(
      (record) =>
        record.status === 'PASS_WITH_MINOR_WARNINGS' ||
        record.severity === 'MINOR_WARNING'
    )
  );
}

export function getHEarthRegionIntegrityOverallStatus(
  records = H_EARTH_REGION_INTEGRITY_AUDIT_RECORDS
) {
  const failures = getHEarthRegionIntegrityFailures(records);
  const warnings = getHEarthRegionIntegrityWarnings(records);

  if (failures.length > 0) {
    return 'FAIL';
  }

  if (warnings.length > 0) {
    return 'PASS_WITH_MINOR_WARNINGS';
  }

  return 'PASS';
}

export function getHEarthRegionIntegrityReport() {
  const records = getHEarthRegionIntegrityAuditRecords();
  const failures = getHEarthRegionIntegrityFailures(records);
  const warnings = getHEarthRegionIntegrityWarnings(records);
  const overallStatus = getHEarthRegionIntegrityOverallStatus(records);

  return freezePlain({
    reportId:
      'H_EARTH_REGION_INTEGRITY_REPORT_STEP_006_FOUNDATION_SPINE_AUDIT_v1',

    contractId: H_EARTH_REGION_INTEGRITY_CONTRACT_ID,

    consumedContracts: {
      regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
      regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID,
      regionFibonacci: H_EARTH_REGION_FIBONACCI_CONTRACT_ID
    },

    overallStatus,
    apiBlockers: failures.length,
    apiWarnings: warnings.length,

    auditRecordCount: records.length,
    auditRecords: records,

    stepStatus: {
      step001RegionSpace:
        records.find((record) => record.auditId === 'STEP_001_REGION_SPACE_AUDIT')
          ?.status || 'UNKNOWN',

      step002RegionLattice:
        records.find((record) => record.auditId === 'STEP_002_REGION_LATTICE_AUDIT')
          ?.status || 'UNKNOWN',

      step003RegionFoundation:
        records.find((record) => record.auditId === 'STEP_003_REGION_FOUNDATION_AUDIT')
          ?.status || 'UNKNOWN',

      step004RegionNews:
        records.find((record) => record.auditId === 'STEP_004_REGION_NEWS_AUDIT')
          ?.status || 'UNKNOWN',

      step005RegionFibonacci:
        records.find((record) => record.auditId === 'STEP_005_REGION_FIBONACCI_AUDIT')
          ?.status || 'UNKNOWN'
    },

    warningsPreserved: H_EARTH_REGION_INTEGRITY_API_WARNINGS,

    readyForStep007RegionSummits:
      overallStatus === 'PASS' ||
      overallStatus === 'PASS_WITH_MINOR_WARNINGS',

    nextRecommendedStep:
      overallStatus === 'FAIL'
        ? 'REPAIR_FOUNDATION_SPINE_BEFORE_STEP_007'
        : 'STEP_007_REGION_SUMMITS_MACRO_ANCHORS',

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsFibonacciBands: false,
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
    createsDiagnosticsRuntime: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });
}

export const H_EARTH_REGION_INTEGRITY = Object.freeze({
  contractId: H_EARTH_REGION_INTEGRITY_CONTRACT_ID,

  consumedContracts: Object.freeze({
    regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
    regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
    regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
    regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID,
    regionFibonacci: H_EARTH_REGION_FIBONACCI_CONTRACT_ID
  }),

  status: H_EARTH_REGION_INTEGRITY_STATUS,
  ownership: H_EARTH_REGION_INTEGRITY_OWNERSHIP,

  apiWarnings: H_EARTH_REGION_INTEGRITY_API_WARNINGS,
  auditRecords: H_EARTH_REGION_INTEGRITY_AUDIT_RECORDS,

  overallStatus: getHEarthRegionIntegrityOverallStatus(),

  foundationSpineAuditOnly: true,

  createsCoordinateSpace: false,
  createsLatticeCells: false,
  createsNewsClassification: false,
  createsFibonacciBands: false,
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
  createsDiagnosticsRuntime: false,

  validationClaim: false,
  productionClaim: false,
  visualPassClaim: false,

  claimBoundaryPreserved: true
});

export function getHEarthRegionIntegrityContract() {
  return H_EARTH_REGION_INTEGRITY;
}

export function getHEarthRegionIntegrityReceipt() {
  const report = getHEarthRegionIntegrityReport();

  return freezePlain({
    receiptId:
      'H_EARTH_REGION_INTEGRITY_RECEIPT_STEP_006_FOUNDATION_SPINE_AUDIT_v1',

    contractId: H_EARTH_REGION_INTEGRITY_CONTRACT_ID,

    consumedContracts: {
      regionSpace: H_EARTH_REGION_SPACE_CONTRACT_ID,
      regionLattice: H_EARTH_REGION_LATTICE_CONTRACT_ID,
      regionFoundation: H_EARTH_REGION_FOUNDATION_CONTRACT_ID,
      regionNews: H_EARTH_REGION_NEWS_CONTRACT_ID,
      regionFibonacci: H_EARTH_REGION_FIBONACCI_CONTRACT_ID
    },

    status: report.overallStatus,
    auditRecordCount: report.auditRecordCount,
    apiBlockers: report.apiBlockers,
    apiWarnings: report.apiWarnings,

    step001Api: report.stepStatus.step001RegionSpace,
    step002Api: report.stepStatus.step002RegionLattice,
    step003Api: report.stepStatus.step003RegionFoundation,
    step004Api: report.stepStatus.step004RegionNews,
    step005Api: report.stepStatus.step005RegionFibonacci,

    path3FoundationChain001To005Audited: true,

    readyForStep007RegionSummits:
      report.readyForStep007RegionSummits,

    nextRecommendedStep: report.nextRecommendedStep,

    createsCoordinateSpace: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsFibonacciBands: false,
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
    createsDiagnosticsRuntime: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });
}

export default H_EARTH_REGION_INTEGRITY;
