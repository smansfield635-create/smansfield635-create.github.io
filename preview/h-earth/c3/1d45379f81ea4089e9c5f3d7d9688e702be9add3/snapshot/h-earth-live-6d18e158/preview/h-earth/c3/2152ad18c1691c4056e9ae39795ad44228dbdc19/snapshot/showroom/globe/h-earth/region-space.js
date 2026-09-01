// /showroom/globe/h-earth/region-space.js
// COMPLETE NEW FILE
// H_EARTH_REGION_SPACE_FILE_BIRTH_STEP_001_COORDINATE_CONSTITUTION_v1
//
// Purpose:
// Defines the neutral XYZ coordinate constitution for the first H-Earth
// Path 3 traversable region.
//
// This file creates mathematical space only.
//
// It does not create:
// - renderer behavior
// - camera behavior
// - travel behavior
// - lattice cells
// - NEWS classification
// - Fibonacci bands
// - Nine Summit anchors
// - rocks, puddles, foam, manor, shoreline detail, or terrain detail
// - production claim
// - validation claim
// - visual-pass claim
//
// Ownership:
// region-space.js owns:
// - axis law
// - origin
// - region bounds
// - world-unit scale
// - surface baseline
// - coordinate validation
// - coordinate clamping
// - future scale policy
//
// Later files must consume this coordinate constitution.
// Later files must not invent separate coordinate logic.

const H_EARTH_REGION_SPACE_CONTRACT_ID =
  "H_EARTH_REGION_SPACE_FILE_BIRTH_STEP_001_COORDINATE_CONSTITUTION_v1";

const REGION_WIDTH_X = 512;
const REGION_DEPTH_Z = 512;
const REGION_HEIGHT_Y = 160;

const REGION_HALF_X = REGION_WIDTH_X / 2;
const REGION_HALF_Z = REGION_DEPTH_Z / 2;

const SURFACE_BASELINE_Y = 0;

const H_EARTH_REGION_SPACE = Object.freeze({
  contractId: H_EARTH_REGION_SPACE_CONTRACT_ID,

  status: Object.freeze({
    path: "PATH_3_COORDINATE_GOVERNED_IMMERSIVE_REGION",
    buildStage: "REGION_SPACE_ONLY",
    implementationClass: "NEUTRAL_COORDINATE_CONSTITUTION",

    productionClaim: false,
    validationClaim: false,
    visualPassClaim: false,

    rendererClaim: false,
    cameraClaim: false,
    travelClaim: false,
    latticeClaim: false,
    newsClaim: false,
    fibonacciClaim: false,
    nineSummitClaim: false,
    detailGeometryClaim: false
  }),

  units: Object.freeze({
    worldUnitName: "hEarthWorldUnit",
    scaleStatus: "LOCAL_REGION_SCALE_ONLY",
    oneWorldUnitMeaning:
      "One consistent local coordinate unit inside the initial H-Earth region.",
    realWorldMeterClaim: false
  }),

  axes: Object.freeze({
    x: Object.freeze({
      name: "X",
      meaning: "west/east",
      negative: "west",
      positive: "east"
    }),

    y: Object.freeze({
      name: "Y",
      meaning: "depth/elevation",
      baseline: SURFACE_BASELINE_Y,
      negative: "below surface / depth",
      positive: "elevation"
    }),

    z: Object.freeze({
      name: "Z",
      meaning: "south/north",
      negative: "south / return / near-field",
      positive: "north / forward / far-field"
    })
  }),

  origin: Object.freeze({
    x: 0,
    y: 0,
    z: 0,
    meaning: "Initial H-Earth region anchor / arrival coordinate"
  }),

  bounds: Object.freeze({
    x: Object.freeze({
      min: -REGION_HALF_X,
      max: REGION_HALF_X,
      span: REGION_WIDTH_X,
      axisMeaning: "west/east"
    }),

    y: Object.freeze({
      min: -40,
      max: 120,
      span: REGION_HEIGHT_Y,
      axisMeaning: "depth/elevation",
      surfaceBaseline: SURFACE_BASELINE_Y
    }),

    z: Object.freeze({
      min: -REGION_HALF_Z,
      max: REGION_HALF_Z,
      span: REGION_DEPTH_Z,
      axisMeaning: "south/north"
    })
  }),

  horizontalRegion: Object.freeze({
    xSpan: REGION_WIDTH_X,
    zSpan: REGION_DEPTH_Z,
    areaExpression: "512 x 512 local world units",
    totalHorizontalAreaUnits: REGION_WIDTH_X * REGION_DEPTH_Z
  }),

  verticalRegion: Object.freeze({
    yMin: -40,
    yMax: 120,
    ySpan: REGION_HEIGHT_Y,
    belowSurfaceUnits: 40,
    aboveSurfaceUnits: 120
  }),

  travelInterpretation: Object.freeze({
    status: "REFERENCE_ONLY_NOT_TRAVEL_BEHAVIOR",
    originToWestEdge: REGION_HALF_X,
    originToEastEdge: REGION_HALF_X,
    originToSouthEdge: REGION_HALF_Z,
    originToNorthEdge: REGION_HALF_Z,
    fullWestEastSpan: REGION_WIDTH_X,
    fullSouthNorthSpan: REGION_DEPTH_Z
  }),

  initialLoadedWindowReference: Object.freeze({
    status: "REFERENCE_ONLY_NOT_LOADING_BEHAVIOR",
    intendedCellWindow: "5 x 5 cells",
    intendedApproximateHorizontalSpan: "160 x 160 world units",
    note:
      "The full 512 x 512 region exists mathematically. Loading behavior belongs to a later file."
  }),

  reservedLatticeBasis: Object.freeze({
    status: "RESERVED_FOR_REGION_LATTICE_FILE",
    intendedCellColumnsX: 16,
    intendedCellRowsZ: 16,
    intendedTotalCells: 256,
    intendedCellWidthX: 32,
    intendedCellDepthZ: 32,
    createsCellsHere: false
  }),

  futureScalePolicy: Object.freeze({
    status: "LOCAL_REGION_NOW_GLOBAL_EXPANSION_RESERVED",
    localCoordinatesAreCurrentRegionCoordinates: true,
    globalExpansionReserved: true,
    originShiftReserved: true,
    parentWorldCoordinatesReserved: true,
    floatingOriginStrategyImplemented: false,
    parentWorldCoordinateSystemImplemented: false,
    claimsInitialBoundsAreFinalWorldBounds: false,
    note:
      "The initial X/Z bounds define the first H-Earth region only. They do not claim final global world limits."
  }),

  forbiddenOwnership: Object.freeze({
    createsRenderer: false,
    createsCamera: false,
    createsTravelController: false,
    createsLatticeCells: false,
    createsNewsClassification: false,
    createsFibonacciBands: false,
    createsNineSummitAnchors: false,
    createsDetailGeometry: false,
    createsRuntimeStreaming: false,
    createsDiagnostics: false
  })
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeCoordinateInput(input) {
  if (!input || typeof input !== "object") {
    return null;
  }

  const x = Number(input.x);
  const y = Number(input.y);
  const z = Number(input.z);

  if (!isFiniteNumber(x) || !isFiniteNumber(y) || !isFiniteNumber(z)) {
    return null;
  }

  return { x, y, z };
}

function getAxisBounds(axisName) {
  const axis = String(axisName || "").toLowerCase();

  if (axis === "x") return H_EARTH_REGION_SPACE.bounds.x;
  if (axis === "y") return H_EARTH_REGION_SPACE.bounds.y;
  if (axis === "z") return H_EARTH_REGION_SPACE.bounds.z;

  return null;
}

function isValueWithinAxis(axisName, value) {
  const bounds = getAxisBounds(axisName);

  if (!bounds || !isFiniteNumber(value)) {
    return false;
  }

  return value >= bounds.min && value <= bounds.max;
}

function clampValueToAxis(axisName, value) {
  const bounds = getAxisBounds(axisName);

  if (!bounds || !isFiniteNumber(value)) {
    return null;
  }

  return Math.max(bounds.min, Math.min(bounds.max, value));
}

function getCoordinateViolations(coordinate) {
  const point = normalizeCoordinateInput(coordinate);

  if (!point) {
    return [
      {
        axis: "coordinate",
        reason: "Coordinate must contain finite numeric x, y, and z values."
      }
    ];
  }

  const violations = [];

  if (!isValueWithinAxis("x", point.x)) {
    violations.push({
      axis: "x",
      value: point.x,
      min: H_EARTH_REGION_SPACE.bounds.x.min,
      max: H_EARTH_REGION_SPACE.bounds.x.max,
      reason: "X is outside west/east region bounds."
    });
  }

  if (!isValueWithinAxis("y", point.y)) {
    violations.push({
      axis: "y",
      value: point.y,
      min: H_EARTH_REGION_SPACE.bounds.y.min,
      max: H_EARTH_REGION_SPACE.bounds.y.max,
      reason: "Y is outside depth/elevation region bounds."
    });
  }

  if (!isValueWithinAxis("z", point.z)) {
    violations.push({
      axis: "z",
      value: point.z,
      min: H_EARTH_REGION_SPACE.bounds.z.min,
      max: H_EARTH_REGION_SPACE.bounds.z.max,
      reason: "Z is outside south/north region bounds."
    });
  }

  return violations;
}

function isCoordinateInsideRegion(coordinate) {
  return getCoordinateViolations(coordinate).length === 0;
}

function clampCoordinateToRegion(coordinate) {
  const point = normalizeCoordinateInput(coordinate);

  if (!point) {
    return null;
  }

  return {
    x: clampValueToAxis("x", point.x),
    y: clampValueToAxis("y", point.y),
    z: clampValueToAxis("z", point.z)
  };
}

function describeCoordinate(coordinate) {
  const point = normalizeCoordinateInput(coordinate);
  const violations = getCoordinateViolations(coordinate);

  if (!point) {
    return {
      validInput: false,
      insideRegion: false,
      violations
    };
  }

  return {
    validInput: true,
    insideRegion: violations.length === 0,
    coordinate: point,

    axisRelation: {
      x:
        point.x < 0
          ? "negative-x-west"
          : point.x > 0
            ? "positive-x-east"
            : "x-origin",

      y:
        point.y < SURFACE_BASELINE_Y
          ? "negative-y-below-surface"
          : point.y > SURFACE_BASELINE_Y
            ? "positive-y-elevated"
            : "y-surface-baseline",

      z:
        point.z < 0
          ? "negative-z-south"
          : point.z > 0
            ? "positive-z-north"
            : "z-origin"
    },

    violations
  };
}

function getRegionSpaceContract() {
  return clone(H_EARTH_REGION_SPACE);
}

function getRegionBounds() {
  return clone(H_EARTH_REGION_SPACE.bounds);
}

function getRegionOrigin() {
  return clone(H_EARTH_REGION_SPACE.origin);
}

function getRegionSurfaceBaseline() {
  return SURFACE_BASELINE_Y;
}

function getRegionSpaceReceipt() {
  return {
    receiptId: "H_EARTH_REGION_SPACE_RECEIPT_STEP_001_COORDINATE_CONSTITUTION_v1",
    contractId: H_EARTH_REGION_SPACE_CONTRACT_ID,
    status: "REGION_SPACE_DEFINED",

    ownsCoordinateConstitution: true,

    createsRenderer: false,
    createsCamera: false,
    createsTravel: false,
    createsLattice: false,
    createsNews: false,
    createsFibonacci: false,
    createsNineSummits: false,
    createsDetails: false,

    bounds: clone(H_EARTH_REGION_SPACE.bounds),
    origin: clone(H_EARTH_REGION_SPACE.origin),
    futureScalePolicy: clone(H_EARTH_REGION_SPACE.futureScalePolicy)
  };
}

export {
  H_EARTH_REGION_SPACE_CONTRACT_ID,
  H_EARTH_REGION_SPACE,
  getRegionSpaceContract,
  getRegionBounds,
  getRegionOrigin,
  getRegionSurfaceBaseline,
  getAxisBounds,
  isValueWithinAxis,
  clampValueToAxis,
  normalizeCoordinateInput,
  getCoordinateViolations,
  isCoordinateInsideRegion,
  clampCoordinateToRegion,
  describeCoordinate,
  getRegionSpaceReceipt
};
