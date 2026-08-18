import crypto from 'node:crypto';

import {
  deriveGRCRCandidateEnvelope,
  extractGRCRTerrainMetrics,
  resolveGRCRFormationMembership,
  resolveGRCRSemanticAddressProjection,
  executeGRCR01IntegratedHarness
} from './h-earth.gratitude-region.coordinate-reconciliation.harness.mjs';
import { executeGRCREntryZoneSection } from './h-earth.gratitude-region.entry-zone-reconciliation.mjs';
import { executeGRCRMirrorManorSection } from './h-earth.gratitude-region.mirror-manor-reconciliation.mjs';
import { executeGRCRCavernPrecinctSection } from './h-earth.gratitude-region.cavern-precinct-reconciliation.mjs';
import {
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import { H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD } from '../terrain/h-earth.successor-terrain-field.run8b.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
const digest = (value) => crypto.createHash('sha256').update(stable(value)).digest('hex');
const round = (value, digits = 9) => Number(value.toFixed(digits));
const keyOf = (x, z) => `${x},${z}`;
const snap = (value, step) => Math.round(value / step) * step;
const distanceXZ = (left, right) => Math.hypot(right.x - left.x, right.z - left.z);
const WORLD = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
const MOUNTAIN = H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT;
const GRID_STEP = 8;
const SURFACE_RADIUS = 48;
const EXPANSION_RADIUS = 72;
const WORLD_BOUNDARY_MARGIN = 16;
const MINIMUM_CONNECTED_SAMPLE_COUNT = 44;
const FUNCTIONAL_CELL_COUNT = 11;
const MAXIMUM_SURFACE_SLOPE = 0.7;
const MAXIMUM_SURFACE_NEIGHBOR_DELTA = 6;
const MAXIMUM_ROUTE_SLOPE = 1.15;
const MAXIMUM_ROUTE_NEIGHBOR_DELTA = 9;

const SEARCH_FRAMES = freeze([
  freeze({
    searchAreaId: 'EXISTING_LOWLAND',
    bounds: freeze({ xMinimum: -176, xMaximum: -24, zMinimum: -208, zMaximum: -128 }),
    seedStep: 16
  }),
  freeze({
    searchAreaId: 'COASTAL_TO_INLAND_TRANSITION',
    bounds: freeze({ xMinimum: -160, xMaximum: 160, zMinimum: -216, zMaximum: -128 }),
    seedStep: 24
  }),
  freeze({
    searchAreaId: 'MODERATE_MOUNTAIN_FOOTHILL_OR_OTHER_BROAD_EXISTING_SURFACE',
    bounds: freeze({ xMinimum: -216, xMaximum: 216, zMinimum: -256, zMaximum: -144 }),
    seedStep: 24
  })
]);

export const H_EARTH_GRATITUDE_REGION_FRONTIER_PLAINS_CAPACITY_RELATIONSHIP_RECONCILIATION = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_FRONTIER_PLAINS_CAPACITY_RELATIONSHIP_RECONCILIATION_v1',
  areaId: 'GRATITUDE_REGION_FRONTIER_PLAINS',
  humanName: 'Frontier Plains',
  sectionIdentitySource: 'CONTROLLING_SPATIAL_DEVELOPMENT_ARTIFACT_AREA_ID',
  numberedGRCRSectionIdentityAssigned: false,
  microCheckpointInventoryAssigned: false,
  model: 'ONE_INTEGRATED_CLOSED_SYSTEM_PRECINCT',
  functionalCellCapacityCount: FUNCTIONAL_CELL_COUNT,
  exactLaneToCellMappingDeferred: true,
  exactCellPlacementAuthorized: false,
  terrainMutation: false,
  geometryConstruction: false
});

function normalizeBounds(bounds) {
  return freeze({
    xMinimum: bounds?.xMinimum ?? bounds?.xMin,
    xMaximum: bounds?.xMaximum ?? bounds?.xMax,
    zMinimum: bounds?.zMinimum ?? bounds?.zMin,
    zMaximum: bounds?.zMaximum ?? bounds?.zMax
  });
}

function expandBounds(bounds, amount) {
  const normalized = normalizeBounds(bounds);
  return freeze({
    xMinimum: normalized.xMinimum - amount,
    xMaximum: normalized.xMaximum + amount,
    zMinimum: normalized.zMinimum - amount,
    zMaximum: normalized.zMaximum + amount
  });
}

function contains(bounds, x, z) {
  const normalized = normalizeBounds(bounds);
  return x >= normalized.xMinimum && x <= normalized.xMaximum
    && z >= normalized.zMinimum && z <= normalized.zMaximum;
}

function distanceToBounds(point, bounds) {
  const normalized = normalizeBounds(bounds);
  const dx = point.x < normalized.xMinimum
    ? normalized.xMinimum - point.x
    : point.x > normalized.xMaximum
      ? point.x - normalized.xMaximum
      : 0;
  const dz = point.z < normalized.zMinimum
    ? normalized.zMinimum - point.z
    : point.z > normalized.zMaximum
      ? point.z - normalized.zMaximum
      : 0;
  return Math.hypot(dx, dz);
}

function distanceBetweenBounds(leftBounds, rightBounds) {
  const left = normalizeBounds(leftBounds);
  const right = normalizeBounds(rightBounds);
  const dx = left.xMaximum < right.xMinimum
    ? right.xMinimum - left.xMaximum
    : right.xMaximum < left.xMinimum
      ? left.xMinimum - right.xMaximum
      : 0;
  const dz = left.zMaximum < right.zMinimum
    ? right.zMinimum - left.zMaximum
    : right.zMaximum < left.zMinimum
      ? left.zMinimum - right.zMaximum
      : 0;
  return Math.hypot(dx, dz);
}

function distanceToPolyline(point, points) {
  if (!Array.isArray(points) || points.length === 0) return Number.POSITIVE_INFINITY;
  let minimum = Number.POSITIVE_INFINITY;
  for (const candidate of points) minimum = Math.min(minimum, distanceXZ(point, candidate));
  return minimum;
}

function extractContextFromRegressionReceipts(regressions) {
  const entry = regressions.entry.evidence;
  const manor = regressions.manor.evidence;
  const cavern = regressions.cavern.evidence;
  const cavernRelation = cavern.selectedExteriorRelation ?? {};
  const cavernEnvelope = cavernRelation.precinctEnvelope?.envelope
    ?? cavern.precinctEnvelope?.envelope
    ?? cavern.precinctEnvelope
    ?? null;
  const cavernApproach = cavern.lawfulApproachCandidate
    ?? cavernRelation.approach
    ?? null;
  const lowCorridorPoints = (manor.lowCorridor?.trace ?? [])
    .map((entryValue) => entryValue.metrics?.world ?? entryValue.world ?? null)
    .filter(Boolean)
    .map((point) => freeze({ x: point.x, z: point.z }));
  const cavernApproachPoints = (cavernApproach?.path ?? [])
    .map((point) => freeze({ x: point.x, z: point.z }));
  const shorelinePoints = (entry.waterwardExclusion?.exclusionTrace ?? [])
    .map((point) => freeze({ x: point.x, z: point.z }));
  return freeze({
    entryEnvelope: entry.envelope,
    entryStart: freeze({
      x: entry.firstLawfulInlandExit.x,
      z: entry.firstLawfulInlandExit.z
    }),
    shorelinePoints: freeze(shorelinePoints),
    manorEnvelope: manor.envelope,
    manorStart: freeze({
      x: manor.envelope.center.x,
      z: manor.envelope.center.z
    }),
    manorLowCorridorPoints: freeze(lowCorridorPoints),
    manorLowCorridorHalfWidth: manor.lowCorridor?.noBuildHalfWidth ?? 6,
    cavernEnvelope,
    cavernCenter: freeze({
      x: cavernRelation.precinctCenter?.x ?? cavernEnvelope?.center?.x,
      z: cavernRelation.precinctCenter?.z ?? cavernEnvelope?.center?.z
    }),
    cavernApproachPoints: freeze(cavernApproachPoints),
    mountainCoreBounds: normalizeBounds(MOUNTAIN.coreBounds),
    mountainTransitionBounds: normalizeBounds(MOUNTAIN.transitionBounds)
  });
}

function runFrozenRegressions() {
  const harness = executeGRCR01IntegratedHarness();
  const entry = executeGRCREntryZoneSection();
  const manor = executeGRCRMirrorManorSection();
  const cavern = executeGRCRCavernPrecinctSection();
  const receipts = freeze({ harness, entry, manor, cavern });
  const summaries = freeze(Object.fromEntries(Object.entries(receipts).map(([id, receipt]) => [id, freeze({
    sectionId: receipt.sectionId,
    status: receipt.status,
    sectionStatus: receipt.sectionStatus,
    eligible: receipt.eligible,
    firstExecutionDigest: receipt.firstExecutionDigest,
    secondExecutionDigest: receipt.secondExecutionDigest,
    deterministicRepeatExecution: receipt.deterministicRepeatExecution
  })])));
  return freeze({
    eligible: Object.values(receipts).every((receipt) => receipt.eligible === true && receipt.sectionStatus === 'PASS_CLOSED'),
    receipts,
    summaries,
    regressionDigest: digest(summaries)
  });
}

function reservationReasons(point, context) {
  const reasons = [];
  if (contains(expandBounds(context.entryEnvelope.bounds, 12), point.x, point.z)) reasons.push('ENTRY_ZONE_PRESERVATION_BUFFER');
  if (contains(expandBounds(context.manorEnvelope.bounds, 16), point.x, point.z)) reasons.push('MIRROR_MANOR_PRESERVATION_BUFFER');
  if (context.cavernEnvelope && contains(expandBounds(context.cavernEnvelope.bounds, 20), point.x, point.z)) reasons.push('CAVERN_PRECINCT_PRESERVATION_BUFFER');
  if (contains(context.mountainCoreBounds, point.x, point.z)) reasons.push('MOUNTAIN_CORE_NO_BUILD');
  if (distanceToPolyline(point, context.manorLowCorridorPoints) <= context.manorLowCorridorHalfWidth + 6) reasons.push('MIRROR_MANOR_LOW_CORRIDOR_NO_BUILD');
  if (distanceToPolyline(point, context.cavernApproachPoints) <= 16) reasons.push('CAVERN_APPROACH_PRESERVATION_CORRIDOR');
  return reasons;
}

function isWorldMarginClear(bounds) {
  const normalized = normalizeBounds(bounds);
  const clearance = Math.min(
    normalized.xMinimum - WORLD.xMinimum,
    WORLD.xMaximum - normalized.xMaximum,
    normalized.zMinimum - WORLD.zMinimum,
    WORLD.zMaximum - normalized.zMaximum
  );
  return freeze({ clear: clearance >= WORLD_BOUNDARY_MARGIN, clearance });
}

function inspectUsablePoint(x, z, context, {
  maximumSlope = MAXIMUM_SURFACE_SLOPE,
  maximumMountainContribution = 12,
  minimumElevation = 0.5
} = {}) {
  const metrics = extractGRCRTerrainMetrics(x, z);
  if (!metrics.valid) return null;
  if (metrics.elevation < minimumElevation || metrics.slope > maximumSlope) return null;
  const membership = resolveGRCRFormationMembership(x, z);
  if (membership.successorMountainContribution > maximumMountainContribution) return null;
  if (reservationReasons({ x, z }, context).length > 0) return null;
  return freeze({ metrics, membership });
}

function searchUsableSurface(centerX, centerZ, context) {
  const points = new Map();
  for (let z = centerZ - SURFACE_RADIUS; z <= centerZ + SURFACE_RADIUS; z += GRID_STEP) {
    for (let x = centerX - SURFACE_RADIUS; x <= centerX + SURFACE_RADIUS; x += GRID_STEP) {
      if (Math.hypot(x - centerX, z - centerZ) > SURFACE_RADIUS + 1e-8) continue;
      const inspected = inspectUsablePoint(x, z, context);
      if (inspected) points.set(keyOf(x, z), inspected);
    }
  }
  const seed = points.get(keyOf(centerX, centerZ));
  if (!seed) return freeze({ eligible: false, status: 'FRONTIER_SURFACE_SEED_INELIGIBLE', step: GRID_STEP, samples: freeze([]), issues: freeze(['SEED_INELIGIBLE']) });
  const queue = [seed];
  const visited = new Map([[keyOf(centerX, centerZ), seed]]);
  const offsets = [[GRID_STEP, 0], [-GRID_STEP, 0], [0, GRID_STEP], [0, -GRID_STEP]];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const [dx, dz] of offsets) {
      const nextX = current.metrics.world.x + dx;
      const nextZ = current.metrics.world.z + dz;
      const next = points.get(keyOf(nextX, nextZ));
      if (!next) continue;
      const nextKey = keyOf(nextX, nextZ);
      if (visited.has(nextKey)) continue;
      if (Math.abs(next.metrics.elevation - current.metrics.elevation) > MAXIMUM_SURFACE_NEIGHBOR_DELTA) continue;
      visited.set(nextKey, next);
      queue.push(next);
    }
  }
  const entries = [...visited.values()].sort((left, right) => left.metrics.world.z - right.metrics.world.z || left.metrics.world.x - right.metrics.world.x);
  const samples = entries.map((entry) => entry.metrics);
  return freeze({
    eligible: samples.length >= MINIMUM_CONNECTED_SAMPLE_COUNT,
    status: samples.length >= MINIMUM_CONNECTED_SAMPLE_COUNT
      ? 'CONNECTED_USABLE_FRONTIER_SURFACE_DERIVED_NONFINAL'
      : 'CONNECTED_USABLE_FRONTIER_SURFACE_INSUFFICIENT',
    center: freeze({ x: centerX, z: centerZ }),
    radius: SURFACE_RADIUS,
    step: GRID_STEP,
    maximumSlope: MAXIMUM_SURFACE_SLOPE,
    maximumNeighborElevationDelta: MAXIMUM_SURFACE_NEIGHBOR_DELTA,
    sampleCount: samples.length,
    samples: freeze(samples),
    surfaceDigest: digest(samples),
    issues: freeze(samples.length >= MINIMUM_CONNECTED_SAMPLE_COUNT ? [] : ['INSUFFICIENT_CONNECTED_CAPACITY'])
  });
}

function deriveExpansionCapacity(center, context, existingKeys) {
  const samples = [];
  for (let z = center.z - EXPANSION_RADIUS; z <= center.z + EXPANSION_RADIUS; z += GRID_STEP) {
    for (let x = center.x - EXPANSION_RADIUS; x <= center.x + EXPANSION_RADIUS; x += GRID_STEP) {
      const radius = Math.hypot(x - center.x, z - center.z);
      if (radius <= SURFACE_RADIUS || radius > EXPANSION_RADIUS + 1e-8) continue;
      if (existingKeys.has(keyOf(x, z))) continue;
      const inspected = inspectUsablePoint(x, z, context, {
        maximumSlope: 0.85,
        maximumMountainContribution: 16,
        minimumElevation: 0.25
      });
      if (inspected) samples.push(inspected.metrics);
    }
  }
  samples.sort((left, right) => left.world.z - right.world.z || left.world.x - right.world.x);
  return freeze({
    status: 'ADJACENT_EXPANSION_CAPACITY_DERIVED_NONFINAL',
    sampleCount: samples.length,
    approximateAreaWorldUnitsSquared: samples.length * GRID_STEP * GRID_STEP,
    maximumRadius: EXPANSION_RADIUS,
    expansionGeometryAuthorized: false,
    sampleDigest: digest(samples)
  });
}

function nearestShorelineRelation(center, shorelinePoints) {
  if (!Array.isArray(shorelinePoints) || shorelinePoints.length === 0) {
    return freeze({ available: false, status: 'OPTIONAL_WATER_RELATION_NOT_RESOLVED', accepted: false });
  }
  const selected = [...shorelinePoints].sort((left, right) => distanceXZ(center, left) - distanceXZ(center, right) || left.x - right.x || left.z - right.z)[0];
  return freeze({
    available: true,
    status: 'MEASURED_SHORELINE_RELATION_DERIVED_NONFINAL',
    nearestMeasuredShorelinePoint: selected,
    straightLineDistance: distanceXZ(center, selected),
    accepted: false,
    waterInfrastructureAssigned: false
  });
}

function representativeAddressEvidence(surface, envelope) {
  const samples = surface.samples;
  const targets = [
    samples.find((sample) => sample.world.x === surface.center.x && sample.world.z === surface.center.z) ?? samples[0],
    [...samples].sort((left, right) => left.world.x - right.world.x || left.world.z - right.world.z)[0],
    [...samples].sort((left, right) => right.world.x - left.world.x || left.world.z - right.world.z)[0],
    [...samples].sort((left, right) => left.world.z - right.world.z || left.world.x - right.world.x)[0],
    [...samples].sort((left, right) => right.world.z - left.world.z || left.world.x - right.world.x)[0]
  ].filter(Boolean);
  const projections = [];
  const seen = new Set();
  for (const target of targets) {
    const projection = resolveGRCRSemanticAddressProjection(target.world.x, target.world.z);
    const projectionKey = `${projection.status}:${projection.chunkId ?? ''}:${projection.selectedSemanticAddressId ?? ''}`;
    if (seen.has(projectionKey)) continue;
    seen.add(projectionKey);
    projections.push(freeze({
      world: freeze({ x: target.world.x, z: target.world.z }),
      status: projection.status,
      valid: projection.valid,
      chunkId: projection.chunkId ?? null,
      physicalRole: projection.physicalRole ?? null,
      semanticAddressId: projection.selectedSemanticAddressId ?? null,
      projectionModel: projection.projectionModel ?? null
    }));
  }
  return freeze({
    status: 'SEMANTIC_AND_PHYSICAL_ADDRESS_CORRESPONDENCE_DERIVED_NONFINAL',
    center: envelope.center,
    projections: freeze(projections),
    physicalChunkIds: freeze([...new Set(projections.map((projection) => projection.chunkId).filter(Boolean))].sort()),
    semanticAddressIds: freeze([...new Set(projections.map((projection) => projection.semanticAddressId).filter(Boolean))].sort()),
    exactFunctionalCellPlacementAssigned: false,
    exactLaneToCellMappingAssigned: false
  });
}

function formationEvidence(surface) {
  const counts = new Map();
  let maximumMountainContribution = 0;
  for (const sample of surface.samples) {
    const membership = resolveGRCRFormationMembership(sample.world.x, sample.world.z);
    maximumMountainContribution = Math.max(maximumMountainContribution, membership.successorMountainContribution);
    for (const formationId of membership.formationIds) counts.set(formationId, (counts.get(formationId) ?? 0) + 1);
  }
  return freeze({
    formationSampleCounts: freeze([...counts.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([formationId, sampleCount]) => freeze({ formationId, sampleCount }))),
    maximumSuccessorMountainContribution: maximumMountainContribution,
    mountainCoreSampleCount: surface.samples.filter((sample) => contains(MOUNTAIN.coreBounds, sample.world.x, sample.world.z)).length
  });
}

class MinHeap {
  constructor() {
    this.values = [];
  }

  push(value) {
    this.values.push(value);
    let index = this.values.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.values[parent].priority <= this.values[index].priority) break;
      [this.values[parent], this.values[index]] = [this.values[index], this.values[parent]];
      index = parent;
    }
  }

  pop() {
    if (this.values.length === 0) return null;
    const first = this.values[0];
    const last = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = last;
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (left < this.values.length && this.values[left].priority < this.values[smallest].priority) smallest = left;
        if (right < this.values.length && this.values[right].priority < this.values[smallest].priority) smallest = right;
        if (smallest === index) break;
        [this.values[index], this.values[smallest]] = [this.values[smallest], this.values[index]];
        index = smallest;
      }
    }
    return first;
  }

  get size() {
    return this.values.length;
  }
}

function routeReservationAllowed(point, start, context) {
  const reasons = reservationReasons(point, context);
  return reasons.filter((reason) => {
    if (reason === 'ENTRY_ZONE_PRESERVATION_BUFFER' && distanceXZ(point, start) <= 36) return false;
    if (reason === 'MIRROR_MANOR_PRESERVATION_BUFFER' && distanceXZ(point, start) <= 36) return false;
    if (reason === 'CAVERN_APPROACH_PRESERVATION_CORRIDOR' && distanceXZ(point, start) <= 32) return false;
    return true;
  });
}

function findConnectedLandRoute(startInput, targetInput, context, routeId) {
  const start = freeze({ x: snap(startInput.x, GRID_STEP), z: snap(startInput.z, GRID_STEP) });
  const target = freeze({ x: snap(targetInput.x, GRID_STEP), z: snap(targetInput.z, GRID_STEP) });
  const bounds = freeze({
    xMinimum: Math.max(WORLD.xMinimum + WORLD_BOUNDARY_MARGIN, Math.min(start.x, target.x) - 64),
    xMaximum: Math.min(WORLD.xMaximum - WORLD_BOUNDARY_MARGIN, Math.max(start.x, target.x) + 64),
    zMinimum: Math.max(WORLD.zMinimum + WORLD_BOUNDARY_MARGIN, Math.min(start.z, target.z) - 64),
    zMaximum: Math.min(WORLD.zMaximum - WORLD_BOUNDARY_MARGIN, Math.max(start.z, target.z) + 64)
  });
  const metricsCache = new Map();
  const inspect = (x, z) => {
    const key = keyOf(x, z);
    if (metricsCache.has(key)) return metricsCache.get(key);
    const metrics = extractGRCRTerrainMetrics(x, z);
    let result = null;
    if (metrics.valid && metrics.elevation >= 0.25 && metrics.slope <= MAXIMUM_ROUTE_SLOPE) {
      const membership = resolveGRCRFormationMembership(x, z);
      const remainingReservations = routeReservationAllowed({ x, z }, start, context);
      if (membership.successorMountainContribution <= 18 && remainingReservations.length === 0) result = freeze({ metrics, membership });
    }
    metricsCache.set(key, result);
    return result;
  };
  const startInspection = inspect(start.x, start.z);
  const targetInspection = inspect(target.x, target.z);
  if (!startInspection || !targetInspection) {
    return freeze({ routeId, eligible: false, status: 'CONNECTED_LAND_ROUTE_ENDPOINT_INELIGIBLE', start, target, accepted: false, finalRoute: false, issues: freeze(['ROUTE_ENDPOINT_INELIGIBLE']) });
  }
  const open = new MinHeap();
  const startKey = keyOf(start.x, start.z);
  const targetKey = keyOf(target.x, target.z);
  const scores = new Map([[startKey, 0]]);
  const parents = new Map();
  open.push({ key: startKey, x: start.x, z: start.z, priority: distanceXZ(start, target) });
  const directions = [
    [GRID_STEP, 0], [-GRID_STEP, 0], [0, GRID_STEP], [0, -GRID_STEP],
    [GRID_STEP, GRID_STEP], [GRID_STEP, -GRID_STEP], [-GRID_STEP, GRID_STEP], [-GRID_STEP, -GRID_STEP]
  ];
  let visits = 0;
  while (open.size > 0 && visits < 12000) {
    const current = open.pop();
    visits += 1;
    if (current.key === targetKey) break;
    const currentInspection = inspect(current.x, current.z);
    if (!currentInspection) continue;
    const currentScore = scores.get(current.key);
    for (const [dx, dz] of directions) {
      const x = current.x + dx;
      const z = current.z + dz;
      if (!contains(bounds, x, z)) continue;
      const nextInspection = inspect(x, z);
      if (!nextInspection) continue;
      const elevationDelta = Math.abs(nextInspection.metrics.elevation - currentInspection.metrics.elevation);
      if (elevationDelta > MAXIMUM_ROUTE_NEIGHBOR_DELTA) continue;
      const travel = Math.hypot(dx, dz);
      const nextScore = currentScore + travel + nextInspection.metrics.slope * 2 + elevationDelta * 0.2;
      const nextKey = keyOf(x, z);
      if (nextScore >= (scores.get(nextKey) ?? Number.POSITIVE_INFINITY)) continue;
      scores.set(nextKey, nextScore);
      parents.set(nextKey, current.key);
      open.push({ key: nextKey, x, z, priority: nextScore + distanceXZ({ x, z }, target) });
    }
  }
  if (!scores.has(targetKey)) {
    return freeze({ routeId, eligible: false, status: 'CONNECTED_LAND_ROUTE_NOT_FOUND', start, target, searchBounds: bounds, visitedNodeCount: visits, accepted: false, finalRoute: false, issues: freeze(['NO_CONNECTED_LAND_ROUTE']) });
  }
  const pathKeys = [];
  let cursor = targetKey;
  while (cursor) {
    pathKeys.push(cursor);
    if (cursor === startKey) break;
    cursor = parents.get(cursor);
  }
  pathKeys.reverse();
  const path = pathKeys.map((pathKey) => {
    const [xValue, zValue] = pathKey.split(',').map(Number);
    const metrics = inspect(xValue, zValue).metrics;
    return freeze({ x: xValue, z: zValue, elevation: metrics.elevation, slope: metrics.slope });
  });
  let pathDistance = 0;
  let maximumSlope = 0;
  let maximumNeighborElevationDelta = 0;
  for (let index = 0; index < path.length; index += 1) {
    maximumSlope = Math.max(maximumSlope, path[index].slope);
    if (index > 0) {
      pathDistance += distanceXZ(path[index - 1], path[index]);
      maximumNeighborElevationDelta = Math.max(maximumNeighborElevationDelta, Math.abs(path[index].elevation - path[index - 1].elevation));
    }
  }
  return freeze({
    routeId,
    eligible: true,
    status: 'CONNECTED_LAND_ROUTE_CANDIDATE_DERIVED_NOT_ACCEPTED',
    start,
    target,
    snappedStartOffset: distanceXZ(startInput, start),
    snappedTargetOffset: distanceXZ(targetInput, target),
    pathPointCount: path.length,
    pathDistance,
    routeCost: scores.get(targetKey),
    maximumSlope,
    maximumNeighborElevationDelta,
    path: freeze(path),
    accepted: false,
    finalRoute: false,
    issues: freeze([])
  });
}

function deriveCandidateFromSeed(frame, x, z, context) {
  const surface = searchUsableSurface(x, z, context);
  if (!surface.eligible) return null;
  const envelope = deriveGRCRCandidateEnvelope(surface, {
    envelopeId: `FRONTIER_PLAINS_ANALYSIS_${frame.searchAreaId}_${x}_${z}`,
    selfTestOnly: false
  });
  if (!envelope.eligible) return null;
  const boundary = isWorldMarginClear(envelope.bounds);
  if (!boundary.clear) return null;
  const sampleKeys = new Set(surface.samples.map((sample) => keyOf(sample.world.x, sample.world.z)));
  const expansion = deriveExpansionCapacity(surface.center, context, sampleKeys);
  const slopes = surface.samples.map((sample) => sample.slope);
  const meanSlope = slopes.reduce((sum, value) => sum + value, 0) / slopes.length;
  const preliminaryScore = surface.sampleCount * 2
    + expansion.sampleCount * 0.5
    + Math.max(0, 30 - meanSlope * 30)
    + Math.min(30, distanceToBounds(surface.center, context.entryEnvelope.bounds) * 0.15)
    + Math.min(30, distanceToBounds(surface.center, context.manorEnvelope.bounds) * 0.15)
    + Math.min(30, distanceToBounds(surface.center, context.cavernEnvelope.bounds) * 0.15);
  return {
    frame,
    seed: freeze({ x, z }),
    surface,
    envelope,
    boundary,
    expansion,
    meanSlope,
    preliminaryScore
  };
}

function shortlistFrameCandidates(frame, context) {
  const raw = [];
  const firstX = Math.ceil(frame.bounds.xMinimum / GRID_STEP) * GRID_STEP;
  const firstZ = Math.ceil(frame.bounds.zMinimum / GRID_STEP) * GRID_STEP;
  for (let z = firstZ; z <= frame.bounds.zMaximum; z += frame.seedStep) {
    for (let x = firstX; x <= frame.bounds.xMaximum; x += frame.seedStep) {
      const candidate = deriveCandidateFromSeed(frame, x, z, context);
      if (candidate) raw.push(candidate);
    }
  }
  raw.sort((left, right) => right.preliminaryScore - left.preliminaryScore
    || right.surface.sampleCount - left.surface.sampleCount
    || left.seed.x - right.seed.x
    || left.seed.z - right.seed.z);
  const selected = [];
  for (const candidate of raw) {
    if (selected.some((existing) => distanceXZ(existing.seed, candidate.seed) < 40)) continue;
    selected.push(candidate);
    if (selected.length >= 6) break;
  }
  return selected;
}

function evaluateCandidate(raw, context) {
  const entryRoute = findConnectedLandRoute(context.entryStart, raw.seed, context, 'ENTRY_ZONE_TO_FRONTIER_PLAINS');
  const manorRoute = findConnectedLandRoute(context.manorStart, raw.seed, context, 'MIRROR_MANOR_TO_FRONTIER_PLAINS');
  const waterRelation = nearestShorelineRelation(raw.seed, context.shorelinePoints);
  const addressEvidence = representativeAddressEvidence(raw.surface, raw.envelope);
  const formations = formationEvidence(raw.surface);
  const separation = freeze({
    entryZoneEnvelopeDistance: distanceBetweenBounds(raw.envelope.bounds, context.entryEnvelope.bounds),
    mirrorManorEnvelopeDistance: distanceBetweenBounds(raw.envelope.bounds, context.manorEnvelope.bounds),
    cavernPrecinctEnvelopeDistance: distanceBetweenBounds(raw.envelope.bounds, context.cavernEnvelope.bounds),
    cavernApproachMinimumDistance: Math.min(...raw.surface.samples.map((sample) => distanceToPolyline(sample.world, context.cavernApproachPoints))),
    mountainCoreMinimumDistance: distanceBetweenBounds(raw.envelope.bounds, context.mountainCoreBounds)
  });
  const grossUsableArea = raw.surface.sampleCount * GRID_STEP * GRID_STEP;
  const nominalAreaPerFunctionalCapacity = grossUsableArea / FUNCTIONAL_CELL_COUNT;
  const supportsIntegratedCapacity = raw.surface.sampleCount >= MINIMUM_CONNECTED_SAMPLE_COUNT
    && entryRoute.eligible
    && manorRoute.eligible
    && formations.mountainCoreSampleCount === 0;
  const finalScore = raw.preliminaryScore
    + (entryRoute.eligible ? 30 : -80)
    + (manorRoute.eligible ? 30 : -80)
    + (waterRelation.available ? 8 : 0)
    + Math.min(25, separation.cavernApproachMinimumDistance * 0.15)
    + Math.min(25, separation.mountainCoreMinimumDistance * 0.1);
  return {
    raw,
    finalScore,
    eligible: supportsIntegratedCapacity,
    summary: freeze({
      sourceSearchAreaId: raw.frame.searchAreaId,
      seed: raw.seed,
      eligible: supportsIntegratedCapacity,
      accepted: false,
      finalPlacement: false,
      finalCoordinatesAssigned: false,
      envelope: raw.envelope,
      connectedUsableSurface: freeze({
        status: raw.surface.status,
        center: raw.surface.center,
        radius: raw.surface.radius,
        step: raw.surface.step,
        sampleCount: raw.surface.sampleCount,
        approximateAreaWorldUnitsSquared: grossUsableArea,
        meanSlope: raw.meanSlope,
        surfaceDigest: raw.surface.surfaceDigest
      }),
      expansionCapacity: raw.expansion,
      integratedClosedSystemCapacity: freeze({
        model: 'ONE_INTEGRATED_CLOSED_SYSTEM_PRECINCT',
        functionalCellCapacityCount: FUNCTIONAL_CELL_COUNT,
        capacitySupported: supportsIntegratedCapacity,
        grossUsableAreaWorldUnitsSquared: grossUsableArea,
        nominalAreaPerFunctionalCapacityIfEvenlyReserved: nominalAreaPerFunctionalCapacity,
        nominalAreaIsNotPlacement: true,
        elevenIndependentLaneZonesRejected: true,
        exactLaneToCellMappingDeferred: true,
        exactCellPlacementAuthorized: false,
        exactCellPlacementAssigned: false
      }),
      accessRelations: freeze({
        entryZone: entryRoute,
        mirrorManor: manorRoute
      }),
      landAndWaterRelations: freeze({
        landSurfaceStatus: raw.surface.status,
        optionalMeasuredShorelineRelation: waterRelation
      }),
      separationRelations: separation,
      noBuildAndPreservationCompliance: freeze({
        mountainCoreConflictSampleCount: formations.mountainCoreSampleCount,
        worldBoundaryClearance: raw.boundary.clearance,
        boundaryClipped: !raw.boundary.clear,
        entryZoneBufferConflictSampleCount: raw.surface.samples.filter((sample) => contains(expandBounds(context.entryEnvelope.bounds, 12), sample.world.x, sample.world.z)).length,
        manorBufferConflictSampleCount: raw.surface.samples.filter((sample) => contains(expandBounds(context.manorEnvelope.bounds, 16), sample.world.x, sample.world.z)).length,
        cavernBufferConflictSampleCount: raw.surface.samples.filter((sample) => contains(expandBounds(context.cavernEnvelope.bounds, 20), sample.world.x, sample.world.z)).length,
        cavernApproachConflictSampleCount: raw.surface.samples.filter((sample) => distanceToPolyline(sample.world, context.cavernApproachPoints) <= 16).length,
        manorLowCorridorConflictSampleCount: raw.surface.samples.filter((sample) => distanceToPolyline(sample.world, context.manorLowCorridorPoints) <= context.manorLowCorridorHalfWidth + 6).length
      }),
      formationEvidence: formations,
      addressEvidence,
      sharedFlowAndInfrastructureCorridors: freeze([
        freeze({ corridorClass: 'ENTRY_ACCESS_RELATION', status: entryRoute.status, accepted: false, exactInfrastructureAssigned: false }),
        freeze({ corridorClass: 'MANOR_ACCESS_RELATION', status: manorRoute.status, accepted: false, exactInfrastructureAssigned: false }),
        freeze({ corridorClass: 'OPTIONAL_WATER_RELATION', status: waterRelation.status, accepted: false, exactInfrastructureAssigned: false }),
        freeze({ corridorClass: 'INTERNAL_SHARED_FLOW_RESERVE', status: 'CAPACITY_RELATION_ONLY_NO_EXACT_CENTERLINE', accepted: false, exactInfrastructureAssigned: false })
      ]),
      candidateScore: finalScore,
      terrainMutation: false,
      geometryConstruction: false
    })
  };
}

function deriveFrontierPlainsCore(context) {
  const evaluated = SEARCH_FRAMES
    .flatMap((frame) => shortlistFrameCandidates(frame, context))
    .map((candidate) => evaluateCandidate(candidate, context))
    .sort((left, right) => Number(right.eligible) - Number(left.eligible)
      || right.finalScore - left.finalScore
      || left.raw.seed.x - right.raw.seed.x
      || left.raw.seed.z - right.raw.seed.z);
  const deduplicated = [];
  for (const candidate of evaluated) {
    if (deduplicated.some((existing) => distanceXZ(existing.raw.seed, candidate.raw.seed) < 48)) continue;
    deduplicated.push(candidate);
    if (deduplicated.length >= 3) break;
  }
  const ranked = deduplicated.map((candidate, index) => {
    const candidateId = `GRATITUDE_REGION_FRONTIER_PLAINS_PRECINCT_ENVELOPE_CANDIDATE_${String(index + 1).padStart(2, '0')}`;
    const summary = freeze({
      candidateId,
      candidateClass: 'MEASURED_OR_DERIVED_CANDIDATE_PENDING_LATER_MANIFEST_ACCEPTANCE',
      rank: index + 1,
      ...candidate.summary,
      candidateDigest: digest({ candidateId, ...candidate.summary })
    });
    return summary;
  });
  const primary = ranked[0] ?? null;
  const issues = [];
  if (ranked.length === 0) issues.push('NO_FRONTIER_PLAINS_CAPACITY_CANDIDATE');
  if (primary && !primary.eligible) issues.push('PRIMARY_FRONTIER_PLAINS_CANDIDATE_INELIGIBLE');
  if (primary && primary.integratedClosedSystemCapacity.functionalCellCapacityCount !== FUNCTIONAL_CELL_COUNT) issues.push('FUNCTIONAL_CAPACITY_COUNT_MISMATCH');
  return freeze({
    areaId: 'GRATITUDE_REGION_FRONTIER_PLAINS',
    humanName: 'Frontier Plains',
    sectionIdentitySource: 'CONTROLLING_SPATIAL_DEVELOPMENT_ARTIFACT_AREA_ID',
    numberedGRCRSectionIdentityAssigned: false,
    microCheckpointInventoryAssigned: false,
    candidateSearchAreas: SEARCH_FRAMES,
    requiredMeasurementsExecuted: freeze([
      'BROAD_USABLE_LAND_ENVELOPE',
      'MODERATE_SLOPE',
      'CONNECTED_LAND_ROUTE',
      'OPTIONAL_WATER_RELATION',
      'CAPACITY_FOR_MULTIPLE_FRONTIER_SCIENCE_FUNCTIONS',
      'SEPARATION_FROM_ENTRY_ZONE',
      'SEPARATION_FROM_MANOR_PRECINCT',
      'SEPARATION_FROM_CAVERN_APPROACH',
      'FUTURE_EXPANSION_CAPACITY'
    ]),
    rankedCandidateEnvelopes: freeze(ranked),
    primaryCandidate: primary,
    primaryCandidateAccepted: false,
    exactCellPlacementAuthorized: false,
    exactCellPlacementAssigned: false,
    exactLaneToCellMappingDeferred: true,
    elevenFunctionalCellsAssigned: false,
    frontierObjectsOrFacilitiesAuthorized: false,
    terrainFlatteningAssumed: false,
    noBuildAndPreservationAreas: freeze([
      freeze({ areaClass: 'ENTRY_ZONE_PRESERVATION_BUFFER', status: 'DERIVED_FROM_CLOSED_REGRESSION', acceptedAsFinal: false }),
      freeze({ areaClass: 'MIRROR_MANOR_PRESERVATION_BUFFER', status: 'DERIVED_FROM_CLOSED_REGRESSION', acceptedAsFinal: false }),
      freeze({ areaClass: 'MIRROR_MANOR_LOW_CORRIDOR', status: 'PRESERVED_NO_BUILD_RELATION', acceptedAsFinal: false }),
      freeze({ areaClass: 'CAVERN_PRECINCT_PRESERVATION_BUFFER', status: 'DERIVED_FROM_CLOSED_REGRESSION', acceptedAsFinal: false }),
      freeze({ areaClass: 'CAVERN_APPROACH_CORRIDOR', status: 'PRESERVED_NO_BUILD_RELATION', acceptedAsFinal: false }),
      freeze({ areaClass: 'MOUNTAIN_CORE', status: 'NO_BUILD_AND_NO_ENTRY', acceptedAsFinal: false }),
      freeze({ areaClass: 'WATER_BOUNDARY', status: 'HARD_BOUNDARY_PRESERVED', acceptedAsFinal: false })
    ]),
    preservationRules: freeze([
      'PLAINS_NAME_DOES_NOT_PREASSIGN_LOWLAND_COORDINATES',
      'FRONTIER_AREA_DERIVED_FROM_EXISTING_TERRAIN_CAPACITY',
      'NO_FRONTIER_OBJECTS_OR_FACILITIES_AUTHORIZED',
      'NO_TERRAIN_FLATTENING_ASSUMED',
      'ONE_INTEGRATED_CLOSED_SYSTEM_PRECINCT',
      'ELEVEN_FUNCTIONS_REMAIN_INTERDEPENDENT_CAPACITY_MODEL',
      'EXACT_LANE_TO_CELL_MAPPING_DEFERRED'
    ]),
    terrainMutation: false,
    geometryConstruction: false,
    runtimeMutation: false,
    gameplayMutation: false,
    publicRouteMutation: false,
    productionMutation: false,
    controllingManifestMutation: false,
    issues: freeze(issues),
    evidenceDigest: digest({ ranked, issues })
  });
}

export function executeFrontierPlainsCapacityRelationshipSection() {
  const regression = runFrozenRegressions();
  const context = extractContextFromRegressionReceipts(regression.receipts);
  const first = deriveFrontierPlainsCore(context);
  const second = deriveFrontierPlainsCore(context);
  const firstDigest = digest(first);
  const secondDigest = digest(second);
  const issues = [...first.issues];
  if (!regression.eligible) issues.push('FROZEN_PRIOR_SECTION_REGRESSION_FAILURE');
  if (firstDigest !== secondDigest) issues.push('FRONTIER_PLAINS_REPEAT_EXECUTION_NONDETERMINISTIC');
  if (first.primaryCandidateAccepted !== false || first.exactCellPlacementAuthorized !== false || first.exactCellPlacementAssigned !== false) issues.push('FRONTIER_PLAINS_AUTHORITY_OVERREACH');
  if (first.frontierObjectsOrFacilitiesAuthorized !== false || first.terrainFlatteningAssumed !== false) issues.push('FRONTIER_PLAINS_CONSTRUCTION_OVERREACH');
  return freeze({
    schemaVersion: 'H_EARTH_GRATITUDE_REGION_FRONTIER_PLAINS_CAPACITY_RELATIONSHIP_RECONCILIATION_RECEIPT_v1',
    areaId: 'GRATITUDE_REGION_FRONTIER_PLAINS',
    humanName: 'Frontier Plains',
    sectionId: 'GRATITUDE_REGION_FRONTIER_PLAINS_CAPACITY_AND_RELATIONSHIP_ANALYSIS',
    numberedGRCRSectionIdentityAssigned: false,
    microCheckpointInventoryAssigned: false,
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'FRONTIER_PLAINS_CAPACITY_RELATIONSHIP_ANALYSIS_PASS'
      : 'FRONTIER_PLAINS_CAPACITY_RELATIONSHIP_ANALYSIS_FAIL',
    sectionStatus: issues.length === 0
      ? 'EXECUTION_PASS_PENDING_DURABLE_CLOSURE'
      : 'FAIL_STOPPED',
    frozenRegressionStatus: freeze({
      doNotReopen: freeze(['GR-CR-01', 'GR-CR-02', 'GR-CR-03', 'GR-CR-04']),
      regressionEligible: regression.eligible,
      regressionDigest: regression.regressionDigest,
      receipts: regression.summaries
    }),
    firstExecutionDigest: firstDigest,
    secondExecutionDigest: secondDigest,
    deterministicRepeatExecution: firstDigest === secondDigest,
    evidence: first,
    frontierPlainsMeasurementExecuted: true,
    frontierPlainsCapacityCandidatesDerived: first.rankedCandidateEnvelopes.length > 0,
    frontierPlainsCandidateAccepted: false,
    exactCellPlacementAuthorized: false,
    exactCellPlacementAssigned: false,
    exactLaneToCellMappingDeferred: true,
    elevenFunctionalCellsAssigned: false,
    productConstructionAuthorized: false,
    nextProgramTargetAssigned: false,
    terrainMutation: false,
    geometryConstruction: false,
    runtimeMutation: false,
    gameplayMutation: false,
    publicRouteMutation: false,
    productionMutation: false,
    controllingManifestMutation: false,
    registryOccurrenceResolution: 'OPEN_SEPARATE_LIFECYCLE_LANE',
    issues: freeze(issues)
  });
}

export default H_EARTH_GRATITUDE_REGION_FRONTIER_PLAINS_CAPACITY_RELATIONSHIP_RECONCILIATION;
