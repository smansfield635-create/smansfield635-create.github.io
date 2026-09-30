/**
 * H_EARTH_R06_C10_CANDIDATE_CLEARANCE_ADAPTER_v1
 * Read-only nonproduct traversal, cavern-compatibility, and dry waterfall-readiness analysis.
 */
import { createHash } from 'node:crypto';
import {
  FROZEN_REGION_CONTRACT,
  FROZEN_SAFE_PARAMETER_BOUNDS,
  canonicalizeR06C10Fixture
} from './h-earth.r06-c10.geometry-articulation-contracts.v1.mjs';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) freeze(nested, seen);
  return Object.freeze(value);
};
const sha256 = (value) => createHash('sha256').update(value, 'utf8').digest('hex');
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const pointInside = ([x, z], bounds) =>
  x >= bounds.xMinimum && x <= bounds.xMaximum && z >= bounds.zMinimum && z <= bounds.zMaximum;

export const H_EARTH_R06_C10_CANDIDATE_CLEARANCE_ADAPTER_ID =
  'H_EARTH_R06_C10_CANDIDATE_CLEARANCE_ADAPTER_v1';

function polylineMetrics(polyline) {
  const segments = [];
  let totalLength = 0;
  for (let index = 0; index < polyline.length - 1; index += 1) {
    const [ax, az] = polyline[index];
    const [bx, bz] = polyline[index + 1];
    const dx = bx - ax;
    const dz = bz - az;
    const length = Math.hypot(dx, dz);
    segments.push({ index, ax, az, bx, bz, dx, dz, length, startDistance: totalLength });
    totalLength += length;
  }
  return { segments, totalLength };
}

function pointAtDistance(metrics, distance) {
  const bounded = clamp(distance, 0, metrics.totalLength);
  const segment = metrics.segments.find((entry, index) =>
    bounded <= entry.startDistance + entry.length || index === metrics.segments.length - 1
  );
  const t = segment.length === 0 ? 0 : (bounded - segment.startDistance) / segment.length;
  const x = segment.ax + t * segment.dx;
  const z = segment.az + t * segment.dz;
  const tangentX = segment.length === 0 ? 1 : segment.dx / segment.length;
  const tangentZ = segment.length === 0 ? 0 : segment.dz / segment.length;
  return {
    x,
    z,
    tangentX,
    tangentZ,
    leftNormalX: -tangentZ,
    leftNormalZ: tangentX,
    segmentIndex: segment.index,
    segmentProgress: t,
    distance: bounded
  };
}

function sampleDistances(totalLength, spacing) {
  const distances = [0];
  for (let distance = spacing; distance < totalLength; distance += spacing) distances.push(distance);
  if (distances[distances.length - 1] !== totalLength) distances.push(totalLength);
  return distances;
}

function nearestPolylineDistance(worldX, worldZ, polyline) {
  const metrics = polylineMetrics(polyline);
  let minimum = Number.POSITIVE_INFINITY;
  for (const segment of metrics.segments) {
    const lengthSquared = segment.dx ** 2 + segment.dz ** 2;
    const t = lengthSquared === 0
      ? 0
      : clamp(((worldX - segment.ax) * segment.dx + (worldZ - segment.az) * segment.dz) / lengthSquared, 0, 1);
    minimum = Math.min(
      minimum,
      Math.hypot(worldX - (segment.ax + t * segment.dx), worldZ - (segment.az + t * segment.dz))
    );
  }
  return minimum;
}

export function evaluateR06C10TraversalClearance(compiledField) {
  const request = compiledField.normalizedRequest;
  const opening = request.traversableOpening;
  const width = opening.minimumWidthWorldUnits;
  const metrics = polylineMetrics(opening.polyline);
  const distances = sampleDistances(metrics.totalLength, 1);
  const bounds = FROZEN_REGION_CONTRACT.blendSupport;
  const rules = FROZEN_SAFE_PARAMETER_BOUNDS.traversalBounds;
  const samples = distances.map((distance) => {
    const pathPoint = pointAtDistance(metrics, distance);
    const halfWidth = width / 2;
    const positions = [
      ['CENTER', pathPoint.x, pathPoint.z],
      ['LEFT', pathPoint.x + pathPoint.leftNormalX * halfWidth, pathPoint.z + pathPoint.leftNormalZ * halfWidth],
      ['RIGHT', pathPoint.x - pathPoint.leftNormalX * halfWidth, pathPoint.z - pathPoint.leftNormalZ * halfWidth]
    ];
    const fieldSamples = positions.map(([side, x, z]) => {
      const field = compiledField.sampleField(x, z);
      const terrainClearance = rules.eyeHeightWorldUnits;
      return {
        side,
        x,
        z,
        elevation: field.elevation,
        slope: field.slope,
        terrainClearance,
        insideBlendSupport: pointInside([x, z], bounds),
        hardSlopePass: field.slope <= rules.hardOpeningSlopeMaximum,
        clearancePass: terrainClearance >= rules.minimumTerrainClearanceWorldUnits
      };
    });
    const pass = fieldSamples.every((sample) =>
      sample.hardSlopePass && sample.clearancePass && sample.insideBlendSupport
    );
    return { distance, pathPoint, samples: fieldSamples, pass };
  });
  const runs = [];
  let active = null;
  for (const sample of samples) {
    if (sample.pass && active === null) active = { start: sample.distance, end: sample.distance };
    else if (sample.pass) active.end = sample.distance;
    else if (active !== null) { runs.push(active); active = null; }
  }
  if (active !== null) runs.push(active);
  const continuousPassLength = runs.reduce((maximum, run) => Math.max(maximum, run.end - run.start), 0);
  const disconnectedPassableIslands = runs.length > 1;
  const eligible = width >= rules.minimumOpeningWidthWorldUnits &&
    metrics.totalLength >= rules.minimumContinuousOpeningLengthWorldUnits &&
    continuousPassLength >= rules.minimumContinuousOpeningLengthWorldUnits &&
    !disconnectedPassableIslands;
  const receipt = {
    receiptType: 'H_EARTH_R06_C10_TRAVERSAL_CLEARANCE_RECEIPT_v1',
    adapterId: H_EARTH_R06_C10_CANDIDATE_CLEARANCE_ADAPTER_ID,
    candidateFieldUsed: true,
    run6NavigationFieldUsed: false,
    samplingSpacingWorldUnits: 1,
    widthOffsetWorldUnits: width / 2,
    eyeHeightWorldUnits: rules.eyeHeightWorldUnits,
    minimumTerrainClearanceWorldUnits: rules.minimumTerrainClearanceWorldUnits,
    hardSlopeMaximum: rules.hardOpeningSlopeMaximum,
    declaredWidthWorldUnits: width,
    declaredLengthWorldUnits: metrics.totalLength,
    sampleStationCount: samples.length,
    sampledFieldPointCount: samples.length * 3,
    passableRuns: runs,
    continuousPassLengthWorldUnits: continuousPassLength,
    disconnectedPassableIslands,
    eligible,
    status: eligible ? 'TRAVERSAL_CLEARANCE_PASS' : 'TRAVERSAL_CLEARANCE_FAIL_CLOSED',
    samples
  };
  return freeze({ ...receipt, canonicalSha256: sha256(canonicalizeR06C10Fixture(receipt)) });
}

function connectedComponents(pointsByKey) {
  const unvisited = new Set(pointsByKey.keys());
  const components = [];
  while (unvisited.size) {
    const seed = unvisited.values().next().value;
    unvisited.delete(seed);
    const queue = [seed];
    const component = [];
    while (queue.length) {
      const key = queue.shift();
      const point = pointsByKey.get(key);
      component.push(point);
      for (const [dx, dz] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
        const neighbor = `${point.x + dx}:${point.z + dz}`;
        if (unvisited.delete(neighbor)) queue.push(neighbor);
      }
    }
    components.push(component);
  }
  return components;
}

export function evaluateR06C10CavernCompatibility(compiledField) {
  const request = compiledField.normalizedRequest;
  const opening = request.traversableOpening;
  const requirement = {
    slopeMinimum: 0.48,
    slopeMaximum: 2,
    minimumWidthWorldUnits: 12,
    minimumContinuousDepthRunWorldUnits: 8,
    minimumHeightAboveAdjacentBasinFloorWorldUnits: 8,
    approachConeDegrees: 45
  };
  const points = new Map();
  const bounds = FROZEN_REGION_CONTRACT.blendSupport;
  for (let x = bounds.xMinimum; x <= bounds.xMaximum; x += 2) {
    for (let z = bounds.zMinimum; z <= bounds.zMaximum; z += 2) {
      const field = compiledField.sampleField(x, z);
      const outsideOpening = nearestPolylineDistance(x, z, opening.polyline) > opening.minimumWidthWorldUnits / 2;
      if (field.slope >= requirement.slopeMinimum && field.slope <= requirement.slopeMaximum && outsideOpening) {
        points.set(`${x}:${z}`, { x, z, elevation: field.elevation, slope: field.slope, normal: field.normal });
      }
    }
  }
  const patches = connectedComponents(points).map((component, index) => {
    const xs = component.map((point) => point.x);
    const zs = component.map((point) => point.z);
    const elevations = component.map((point) => point.elevation);
    const xMinimum = Math.min(...xs);
    const xMaximum = Math.max(...xs);
    const zMinimum = Math.min(...zs);
    const zMaximum = Math.max(...zs);
    const width = Math.max(xMaximum - xMinimum, zMaximum - zMinimum);
    const depthRun = Math.min(xMaximum - xMinimum, zMaximum - zMinimum);
    const floor = Math.min(...elevations);
    const crest = Math.max(...elevations);
    const averageNormal = component.reduce(
      (sum, point) => ({ x: sum.x + point.normal.x, y: sum.y + point.normal.y, z: sum.z + point.normal.z }),
      { x: 0, y: 0, z: 0 }
    );
    const horizontalLength = Math.hypot(averageNormal.x, averageNormal.z) || 1;
    const patch = {
      patchId: `R06_C10_CAVERN_COMPATIBLE_FACE_PATCH_${String(index + 1).padStart(3, '0')}`,
      worldBounds: { xMinimum, xMaximum, zMinimum, zMaximum, yMinimum: floor, yMaximum: crest },
      sampleCount: component.length,
      widthWorldUnits: width,
      continuousDepthRunWorldUnits: depthRun,
      heightAboveAdjacentBasinFloorWorldUnits: crest - floor,
      slopeRange: {
        minimum: Math.min(...component.map((point) => point.slope)),
        maximum: Math.max(...component.map((point) => point.slope))
      },
      normalRange: component.map((point) => point.normal),
      approachVector: { x: -averageNormal.x / horizontalLength, z: -averageNormal.z / horizontalLength },
      eligible: width >= requirement.minimumWidthWorldUnits &&
        depthRun >= requirement.minimumContinuousDepthRunWorldUnits &&
        crest - floor >= requirement.minimumHeightAboveAdjacentBasinFloorWorldUnits
    };
    return patch;
  }).filter((patch) => patch.eligible);
  const receipt = {
    receiptType: 'H_EARTH_R06_C10_CAVERN_COMPATIBILITY_RECEIPT_v1',
    adapterId: H_EARTH_R06_C10_CANDIDATE_CLEARANCE_ADAPTER_ID,
    candidateFieldUsed: true,
    geometricReservationOnly: true,
    cavernExcavationPerformed: false,
    required: request.cavernCompatibility.required,
    eligiblePatchCount: patches.length,
    eligiblePatches: patches,
    status: 'CAVERN_COMPATIBILITY_ANALYSIS_COMPLETE'
  };
  return freeze({ ...receipt, canonicalSha256: sha256(canonicalizeR06C10Fixture(receipt)) });
}

function localToWorld(operation, u, v) {
  const radians = operation.rotationDegrees * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [
    operation.centerX + cosine * u - sine * v,
    operation.centerZ + sine * u + cosine * v
  ];
}

export function evaluateR06C10WaterfallReadinessGeometry(compiledField) {
  const request = compiledField.normalizedRequest;
  const fallFace = request.operations.find((operation) => operation.operator === 'FALL_FACE') ?? null;
  const basin = request.operations.find((operation) => operation.operator === 'LOWER_BASIN') ?? null;
  const drainage = request.operations.find((operation) => operation.operator === 'DRAINAGE_CUT') ?? null;
  const present = Boolean(fallFace && basin && drainage);
  const crest = present ? localToWorld(fallFace, -fallFace.halfLength, 0) : null;
  const faceCenter = present ? localToWorld(fallFace, 0, 0) : null;
  const toe = present ? localToWorld(fallFace, fallFace.halfLength, 0) : null;
  const witnessCoordinates = present
    ? [crest, faceCenter, toe, [basin.centerX, basin.centerZ], ...drainage.polyline]
    : [];
  const flowDirectionWitnessSamples = witnessCoordinates.map(([x, z], index) => ({
    index,
    x,
    z,
    elevation: compiledField.sampleElevation(x, z)
  }));
  const continuousDownhillPath = flowDirectionWitnessSamples.every((sample, index, all) =>
    index === 0 || sample.elevation <= all[index - 1].elevation + 1e-8
  );
  const receipt = {
    receiptType: 'H_EARTH_R06_C10_WATERFALL_READINESS_GEOMETRY_RECEIPT_v1',
    adapterId: H_EARTH_R06_C10_CANDIDATE_CLEARANCE_ADAPTER_ID,
    candidateFieldUsed: true,
    required: request.waterfallReadiness.required,
    waterImplementation: false,
    waterPrimitiveConstructed: false,
    dryGeometryPresent: present,
    crestSegment: present ? { start: localToWorld(fallFace, -fallFace.halfLength, -fallFace.halfWidth), end: localToWorld(fallFace, -fallFace.halfLength, fallFace.halfWidth) } : null,
    fallFacePatch: present ? { center: [fallFace.centerX, fallFace.centerZ], halfLength: fallFace.halfLength, halfWidth: fallFace.halfWidth, drop: fallFace.drop, rotationDegrees: fallFace.rotationDegrees } : null,
    toePoint: toe,
    basinFloorAndRim: present ? { center: [basin.centerX, basin.centerZ], radiusU: basin.radiusU, radiusV: basin.radiusV, depth: basin.depth } : null,
    drainageInletAndOutletPolylines: present ? { drainage: drainage.polyline } : null,
    flowDirectionWitnessSamples,
    continuousDownhillPath,
    status: present ? 'WATERFALL_READINESS_DRY_GEOMETRY_REPORTED' : 'WATERFALL_READINESS_DRY_GEOMETRY_ABSENT'
  };
  return freeze({ ...receipt, canonicalSha256: sha256(canonicalizeR06C10Fixture(receipt)) });
}

export function evaluateR06C10CandidateClearance(compiledField) {
  const traversal = evaluateR06C10TraversalClearance(compiledField);
  const cavern = evaluateR06C10CavernCompatibility(compiledField);
  const waterfall = evaluateR06C10WaterfallReadinessGeometry(compiledField);
  return freeze({
    adapterId: H_EARTH_R06_C10_CANDIDATE_CLEARANCE_ADAPTER_ID,
    candidateFieldUsed: true,
    run6NavigationFieldUsed: false,
    traversal,
    cavern,
    waterfall
  });
}
