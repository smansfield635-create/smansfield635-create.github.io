import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

import { getHEarthCanonicalShorelineZ } from '../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField,
  evaluateHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';
import { H_EARTH_TERRAIN_FORMATIONS } from '../terrain/h-earth.terrain-formations.js';
import { H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT } from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN } from '../integration/h-earth.landscape-realization-planner.js';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';

const MANIFEST_PATH = 'h-earth-3d/control-plane/region-001-reconciliation/h-earth.region-001.mirrorland-narrative-character-temporal-reconciliation.manifest.v1.json';
const SPATIAL_ARTIFACT_PATH = 'h-earth-3d/control-plane/region-001-reconciliation/h-earth.region-001.gratitude-region-spatial-interaction-area-development.v1.json';
const RECEIPT_PATH = process.env.H_EARTH_GRATITUDE_RECEIPT ?? '/tmp/h-earth-gratitude-region-coordinate-reconciliation.receipt.json';
const EXPECTED_MANIFEST_BLOB = '1702d62036a6b241fdadddfabc304a5288f38652';
const EXPECTED_SPATIAL_ARTIFACT_BLOB = 'ee5ca94f5ae55ce8f11b460428b800ad4e9a2a9d';
const BASELINE_MAIN_HEAD = 'f24294725991be3f6e3f202cf275de52fb6065b5';

let assertionsPassed = 0;
const check = (condition, message) => { assert.ok(condition, message); assertionsPassed += 1; };
const equal = (actual, expected, message) => { assert.equal(actual, expected, message); assertionsPassed += 1; };
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const round = (value, digits = 6) => finite(value) ? Number(value.toFixed(digits)) : value;
const key = (x, z) => `${x},${z}`;
const distance = (left, right) => Math.hypot(left.x - right.x, left.z - right.z);
const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((name) => `${JSON.stringify(name)}:${stable(value[name])}`).join(',')}}`;
const sha256 = (value) => crypto.createHash('sha256').update(stable(value)).digest('hex');
const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

function samplePoint(x, z) {
  const sample = sampleHEarthRun8BSuccessorTerrainField(x, z);
  check(sample?.valid === true, `INVALID_TERRAIN_SAMPLE:${x}:${z}`);
  const shorelineZ = getHEarthCanonicalShorelineZ(x);
  return {
    x, y: round(sample.elevation), z,
    elevation: round(sample.elevation),
    slope: round(sample.slope),
    curvature: round(sample.curvature),
    mountainContribution: round(sample.mountainContribution),
    shorelineZ: round(shorelineZ),
    shorelineDistance: round(shorelineZ - z),
    normal: { x: round(sample.normal.x), y: round(sample.normal.y), z: round(sample.normal.z) }
  };
}

function positionSemanticCorrespondence(x, z) {
  const epsilon = 1e-8;
  const chunk = H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks
    .filter((candidate) => candidate.terrainMemberAddressIds.length > 0 && candidate.physicalRole.includes('TERRAIN') && x >= candidate.worldBounds.xMin - epsilon && x <= candidate.worldBounds.xMax + epsilon && z >= candidate.worldBounds.zMin - epsilon && z <= candidate.worldBounds.zMax + epsilon)
    .sort((left, right) => left.chunkId.localeCompare(right.chunkId))[0] ?? null;
  if (!chunk) return { chunkId: null, selectedSemanticAddressId: null, selectionProjectionModel: null };
  const parseAddress = (address) => {
    const match = /:R(\d+):C(\d+)$/.exec(address);
    return match ? { address, row: Number(match[1]), column: Number(match[2]) } : null;
  };
  const candidates = chunk.terrainMemberAddressIds.map(parseAddress).filter(Boolean);
  const xProgress = clamp((x - chunk.worldBounds.xMin) / Math.max(1e-8, chunk.worldBounds.xMax - chunk.worldBounds.xMin), 0, 0.999999);
  const zProgress = clamp((z - chunk.worldBounds.zMin) / Math.max(1e-8, chunk.worldBounds.zMax - chunk.worldBounds.zMin), 0, 0.999999);
  const targetColumn = chunk.addressRange.columnMin + Math.floor(xProgress * 4);
  const targetRow = chunk.addressRange.rowMin + Math.floor(zProgress * 4);
  const selected = [...candidates].sort((left, right) => {
    const leftDistance = Math.abs(left.row - targetRow) + Math.abs(left.column - targetColumn);
    const rightDistance = Math.abs(right.row - targetRow) + Math.abs(right.column - targetColumn);
    return leftDistance - rightDistance || left.address.localeCompare(right.address);
  })[0] ?? null;
  return {
    chunkId: chunk.chunkId,
    physicalRole: chunk.physicalRole,
    formationIds: chunk.formationIds,
    selectedSemanticAddressId: selected?.address ?? null,
    targetSemanticCoordinate: { row: targetRow, column: targetColumn },
    selectionProjectionModel: H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.selectionProjectionModel
  };
}

function formationMembership(x, z) {
  const ids = [];
  for (const descriptor of Object.values(H_EARTH_TERRAIN_FORMATIONS)) {
    const bounds = descriptor.worldBounds;
    if (bounds && x >= bounds.xMin && x <= bounds.xMax && z >= bounds.zMin && z <= bounds.zMax) ids.push(descriptor.formationId);
  }
  const transition = H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.transitionBounds;
  if (x >= transition.xMinimum && x <= transition.xMaximum && z >= transition.zMinimum && z <= transition.zMaximum) ids.push(H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.formationId);
  return [...new Set(ids)].sort();
}

function grid({ xMinimum, xMaximum, zMinimum, zMaximum, step, eligible }) {
  const samples = new Map();
  const valid = new Set();
  for (let x = xMinimum; x <= xMaximum + 1e-9; x += step) {
    for (let z = zMinimum; z <= zMaximum + 1e-9; z += step) {
      const sample = samplePoint(x, z);
      samples.set(key(x, z), sample);
      if (eligible(sample)) valid.add(key(x, z));
    }
  }
  return { samples, valid, step };
}

function connectedComponent({ samples, valid, step }, anchor) {
  check(valid.size > 0, 'EMPTY_ELIGIBLE_GRID');
  let startKey = key(anchor.x, anchor.z);
  if (!valid.has(startKey)) {
    startKey = [...valid].sort((left, right) => {
      const [lx, lz] = left.split(',').map(Number);
      const [rx, rz] = right.split(',').map(Number);
      return Math.hypot(lx - anchor.x, lz - anchor.z) - Math.hypot(rx - anchor.x, rz - anchor.z) || left.localeCompare(right);
    })[0];
  }
  const queue = [startKey];
  const seen = new Set([startKey]);
  while (queue.length > 0) {
    const current = queue.shift();
    const [x, z] = current.split(',').map(Number);
    for (const [dx, dz] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
      const neighbor = key(x + dx, z + dz);
      if (valid.has(neighbor) && !seen.has(neighbor)) { seen.add(neighbor); queue.push(neighbor); }
    }
  }
  return [...seen].map((id) => samples.get(id));
}

function summarizeSamples(samples, step) {
  check(samples.length > 0, 'EMPTY_SAMPLE_SUMMARY');
  const xs = samples.map((sample) => sample.x);
  const zs = samples.map((sample) => sample.z);
  const elevations = samples.map((sample) => sample.elevation);
  const slopes = samples.map((sample) => sample.slope);
  return {
    sampleCount: samples.length,
    sampleSpacingWorldUnits: step,
    sampledSupportAreaSquareWorldUnits: samples.length * step * step,
    bounds: { xMinimum: Math.min(...xs), xMaximum: Math.max(...xs), zMinimum: Math.min(...zs), zMaximum: Math.max(...zs) },
    elevationRange: { minimum: round(Math.min(...elevations)), maximum: round(Math.max(...elevations)) },
    slopeRange: { minimum: round(Math.min(...slopes)), maximum: round(Math.max(...slopes)) }
  };
}

function lineOfSight(observer, target, { observerHeight = 2.25, targetHeight = 2.25, stepWorldUnits = 1 } = {}) {
  const observerTerrain = samplePoint(observer.x, observer.z);
  const targetTerrain = samplePoint(target.x, target.z);
  const observerY = observerTerrain.elevation + observerHeight;
  const targetY = targetTerrain.elevation + targetHeight;
  const length = distance(observer, target);
  const segments = Math.max(2, Math.ceil(length / stepWorldUnits));
  let minimumClearance = Number.POSITIVE_INFINITY;
  let minimumClearancePoint = null;
  for (let index = 1; index < segments; index += 1) {
    const t = index / segments;
    const x = observer.x + (target.x - observer.x) * t;
    const z = observer.z + (target.z - observer.z) * t;
    const lineY = observerY + (targetY - observerY) * t;
    const terrainY = samplePoint(x, z).elevation;
    const clearance = lineY - terrainY;
    if (clearance < minimumClearance) {
      minimumClearance = clearance;
      minimumClearancePoint = { x: round(x), z: round(z), lineY: round(lineY), terrainY: round(terrainY), clearance: round(clearance) };
    }
  }
  return { visible: minimumClearance > 0, minimumClearance: round(minimumClearance), minimumClearancePoint };
}

function findMountainSummit() {
  let best = null;
  for (let x = -240; x <= 56; x += 2) {
    for (let z = -312; z <= -220; z += 2) {
      const sample = samplePoint(x, z);
      if (!best || sample.elevation > best.elevation || (sample.elevation === best.elevation && (sample.x < best.x || (sample.x === best.x && sample.z < best.z)))) best = sample;
    }
  }
  return best;
}

function maximalRectangle(mask) {
  const width = mask[0]?.length ?? 0;
  const heights = Array(width).fill(0);
  let best = null;
  for (let row = 0; row < mask.length; row += 1) {
    for (let column = 0; column < width; column += 1) heights[column] = mask[row][column] ? heights[column] + 1 : 0;
    const stack = [];
    for (let column = 0; column <= width; column += 1) {
      const height = column < width ? heights[column] : 0;
      let start = column;
      while (stack.length > 0 && stack[stack.length - 1].height > height) {
        const entry = stack.pop();
        const candidate = { area: entry.height * (column - entry.start), rowMinimum: row - entry.height + 1, rowMaximum: row, columnMinimum: entry.start, columnMaximum: column - 1 };
        if (!best || candidate.area > best.area || (candidate.area === best.area && stable(candidate) < stable(best))) best = candidate;
        start = entry.start;
      }
      if (stack.length === 0 || stack[stack.length - 1].height < height) stack.push({ start, height });
    }
  }
  return best;
}

function routeCandidate(startInput, goalInput, { step = 4, maximumSlope = 0.55 } = {}) {
  const snap = (value) => Math.round(value / step) * step;
  const start = { x: snap(startInput.x), z: snap(startInput.z) };
  const goal = { x: snap(goalInput.x), z: snap(goalInput.z) };
  const domain = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
  const samples = new Map();
  const node = (x, z) => { const id = key(x, z); if (!samples.has(id)) samples.set(id, samplePoint(x, z)); return samples.get(id); };
  const allowed = (x, z) => {
    if (x < domain.xMinimum || x > domain.xMaximum || z < domain.zMinimum || z > domain.zMaximum) return false;
    const sample = node(x, z);
    return sample.shorelineDistance >= 0 && sample.slope <= maximumSlope;
  };
  check(allowed(start.x, start.z), `ROUTE_START_NOT_ALLOWED:${key(start.x, start.z)}`);
  check(allowed(goal.x, goal.z), `ROUTE_GOAL_NOT_ALLOWED:${key(goal.x, goal.z)}`);
  const queue = [{ id: key(start.x, start.z), x: start.x, z: start.z, cost: 0, estimate: distance(start, goal) }];
  const costs = new Map([[key(start.x, start.z), 0]]);
  const previous = new Map();
  while (queue.length > 0) {
    queue.sort((left, right) => left.estimate - right.estimate || left.id.localeCompare(right.id));
    const current = queue.shift();
    if (current.id === key(goal.x, goal.z)) break;
    if (current.cost !== costs.get(current.id)) continue;
    for (const [dx, dz] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
      const x = current.x + dx;
      const z = current.z + dz;
      if (!allowed(x, z)) continue;
      const currentSample = node(current.x, current.z);
      const nextSample = node(x, z);
      const elevationGain = Math.max(0, nextSample.elevation - currentSample.elevation);
      const moveCost = step * (1 + nextSample.slope * 1.5 + elevationGain * 0.08);
      const nextCost = current.cost + moveCost;
      const id = key(x, z);
      if (nextCost < (costs.get(id) ?? Number.POSITIVE_INFINITY)) {
        costs.set(id, nextCost);
        previous.set(id, current.id);
        queue.push({ id, x, z, cost: nextCost, estimate: nextCost + Math.hypot(x - goal.x, z - goal.z) });
      }
    }
  }
  const goalKey = key(goal.x, goal.z);
  check(costs.has(goalKey), `ROUTE_NOT_FOUND:${key(start.x, start.z)}:${goalKey}`);
  const ids = [goalKey];
  while (ids[ids.length - 1] !== key(start.x, start.z)) ids.push(previous.get(ids[ids.length - 1]));
  ids.reverse();
  const path = ids.map((id) => { const [x, z] = id.split(',').map(Number); return node(x, z); });
  return {
    status: 'MEASURED_ROUTE_CANDIDATE_PENDING_MANIFEST_ACCEPTANCE',
    analysisStepWorldUnits: step,
    maximumPermittedSampleSlope: maximumSlope,
    nodeCount: path.length,
    pathLengthWorldUnits: (path.length - 1) * step,
    weightedCost: round(costs.get(goalKey)),
    start: path[0], end: path[path.length - 1],
    minimumElevation: round(Math.min(...path.map((sample) => sample.elevation))),
    maximumElevation: round(Math.max(...path.map((sample) => sample.elevation))),
    maximumEncounteredSlope: round(Math.max(...path.map((sample) => sample.slope))),
    polyline: path.filter((_, index) => index === 0 || index === path.length - 1 || index % 8 === 0).map(({ x, z, elevation }) => ({ x, z, y: elevation }))
  };
}

const manifest = readJson(MANIFEST_PATH);
const spatialArtifact = readJson(SPATIAL_ARTIFACT_PATH);
equal(manifest.measurementGate.readOnlyExistingWorldCoordinateReconciliationAuthorized, true, 'Read-only coordinate reconciliation must be authorized');
equal(manifest.coordinateReconciliationAuthorization.status, 'AUTHORIZED_BOUNDED_READ_ONLY', 'Authorization status must remain bounded read-only');
equal(manifest.coordinateReconciliationAuthorization.referenceArtifactBlob, EXPECTED_SPATIAL_ARTIFACT_BLOB, 'Authorization must reference the merged spatial artifact');
equal(manifest.coordinateReconciliationAuthorization.finalCoordinatesAssigned, false, 'Final coordinates must remain unassigned');
equal(manifest.coordinateReconciliationAuthorization.geometryConstructionAuthorized, false, 'Geometry must remain unauthorized');
equal(spatialArtifact.artifactIdentity.worldFacingRegionName, 'GRATITUDE_REGION', 'World-facing identity must be Gratitude Region');
equal(spatialArtifact.interactionAreaProgram.requiredAreaCount, 4, 'Exactly four interaction areas must be reconciled');
const fieldEvaluation = evaluateHEarthRun8BSuccessorTerrainField();
check(fieldEvaluation.eligible === true, 'Run 8B successor terrain field must pass');
equal(fieldEvaluation.contractId, H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID, 'Run 8B field identity must remain controlling');

const coastWaypoint = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST;
const bermWaypoint = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.BERM;
const hillWaypoint = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.HILL;
const coastAnchor = { ...coastWaypoint.position };
const manorAnchor = { ...hillWaypoint.position };

const entryGrid = grid({ xMinimum: -64, xMaximum: 64, zMinimum: -145, zMaximum: -70, step: 2, eligible: (sample) => sample.shorelineDistance >= 8 && sample.shorelineDistance <= 45 && sample.elevation >= -0.5 && sample.slope <= 0.35 && distance(sample, coastAnchor) <= 48 });
const entrySamples = connectedComponent(entryGrid, coastAnchor);
const entrySummary = summarizeSamples(entrySamples, 2);
const entryBoundary = [];
for (let x = entrySummary.bounds.xMinimum; x <= entrySummary.bounds.xMaximum; x += 8) entryBoundary.push({ x, z: round(getHEarthCanonicalShorelineZ(x)) });
const mountainSummit = findMountainSummit();

const manorCoreGrid = grid({ xMinimum: 0, xMaximum: 128, zMinimum: -210, zMaximum: -125, step: 2, eligible: (sample) => sample.elevation >= 28 && sample.slope <= 0.22 });
const manorCoreSamples = connectedComponent(manorCoreGrid, manorAnchor);
const manorCoreSummary = summarizeSamples(manorCoreSamples, 2);
const manorPrecinctGrid = grid({ xMinimum: 0, xMaximum: 128, zMinimum: -210, zMaximum: -125, step: 2, eligible: (sample) => sample.elevation >= 24 && sample.slope <= 0.35 });
const manorPrecinctSamples = connectedComponent(manorPrecinctGrid, manorAnchor);
const manorPrecinctSummary = summarizeSamples(manorPrecinctSamples, 2);
const beachVisibleCoreSamples = manorCoreSamples.filter((sample) => lineOfSight(sample, coastAnchor).visible);
const mountainVisibleCoreSamples = manorCoreSamples.filter((sample) => lineOfSight(sample, mountainSummit).visible);
const centerBeachSightline = lineOfSight(manorAnchor, coastAnchor);
const centerMountainSightline = lineOfSight(manorAnchor, mountainSummit);
check(centerBeachSightline.visible === true, 'Manor center must retain beachward sightline');
check(centerMountainSightline.visible === true, 'Manor center must retain mountainward sightline');
check(positionSemanticCorrespondence(manorAnchor.x, manorAnchor.z).selectedSemanticAddressId === 'H_EARTH_GROUND_CELL_001:R06:C11', 'HILL anchor must correspond to observed R06:C11 address');

const cavernCandidates = [];
for (let x = -220; x <= 52; x += 2) {
  let face = null;
  for (let z = -220; z >= -312; z -= 1) {
    const sample = samplePoint(x, z);
    if (sample.mountainContribution >= 8) { face = sample; break; }
  }
  if (!face) continue;
  const approach = samplePoint(x, face.z + 12);
  const manorDistance = distance(face, manorAnchor);
  const elevationDelta = face.elevation - approach.elevation;
  if (manorDistance <= 75 && face.slope >= 1.2 && face.slope <= 2.2 && approach.slope <= 0.48 && elevationDelta <= 8) cavernCandidates.push({ face, approach, distanceFromManorCandidate: round(manorDistance), elevationDelta: round(elevationDelta) });
}
check(cavernCandidates.length > 0, 'At least one cavern exterior face candidate is required');
const cavernRepresentative = cavernCandidates[Math.floor(cavernCandidates.length / 2)];
const cavernFaceSummary = summarizeSamples(cavernCandidates.map((candidate) => candidate.face), 2);
const cavernApproachSummary = summarizeSamples(cavernCandidates.map((candidate) => candidate.approach), 2);

const frontierXValues = [];
for (let x = -176; x <= -20; x += 4) frontierXValues.push(x);
const frontierZValues = [];
for (let z = -208; z <= -128; z += 4) frontierZValues.push(z);
const frontierSamples = frontierZValues.map((z) => frontierXValues.map((x) => samplePoint(x, z)));
const frontierMask = frontierSamples.map((row) => row.map((sample) => sample.shorelineDistance >= 50 && sample.elevation >= -4 && sample.elevation <= 12 && sample.slope <= 0.12));
const frontierRectangle = maximalRectangle(frontierMask);
check(frontierRectangle?.area > 0, 'Frontier Plains rectangle must be derived');
const frontierRectangleSamples = [];
for (let row = frontierRectangle.rowMinimum; row <= frontierRectangle.rowMaximum; row += 1) for (let column = frontierRectangle.columnMinimum; column <= frontierRectangle.columnMaximum; column += 1) frontierRectangleSamples.push(frontierSamples[row][column]);
const frontierSummary = summarizeSamples(frontierRectangleSamples, 4);
const frontierAnchor = { x: (frontierSummary.bounds.xMinimum + frontierSummary.bounds.xMaximum) / 2, z: (frontierSummary.bounds.zMinimum + frontierSummary.bounds.zMaximum) / 2 };
const cavernApproachAnchor = { x: cavernRepresentative.approach.x, z: cavernRepresentative.approach.z };

const routes = {
  entryToManor: routeCandidate(coastAnchor, manorAnchor),
  entryToFrontier: routeCandidate(coastAnchor, frontierAnchor),
  manorToCavernApproach: routeCandidate(manorAnchor, cavernApproachAnchor),
  frontierToCavernApproach: routeCandidate(frontierAnchor, cavernApproachAnchor),
  frontierToManor: routeCandidate(frontierAnchor, manorAnchor)
};

const areaCandidates = [
  {
    areaId: 'GRATITUDE_REGION_ENTRY_ZONE', humanName: 'Entry Zone', coordinateStatus: 'MEASURED_CANDIDATE',
    centerAnchor: { ...samplePoint(coastAnchor.x, coastAnchor.z), yawDegrees: coastWaypoint.yawDegrees, pitchDegrees: coastWaypoint.pitchDegrees, anchorSource: 'EXISTING_COAST_NAVIGATION_WAYPOINT' },
    boundaryEnvelope: entrySummary, waterBoundaryPolyline: entryBoundary,
    firstInlandExitCandidate: { ...samplePoint(bermWaypoint.position.x, bermWaypoint.position.z), yawDegrees: bermWaypoint.yawDegrees, pitchDegrees: bermWaypoint.pitchDegrees, anchorSource: 'EXISTING_BERM_NAVIGATION_WAYPOINT' },
    formationMembership: formationMembership(coastAnchor.x, coastAnchor.z), semanticAddressCorrespondence: positionSemanticCorrespondence(coastAnchor.x, coastAnchor.z),
    preservationAreas: ['WATERWARD_SIDE_OF_CANONICAL_SHORELINE', 'EXISTING_COAST_TO_BERM_NAVIGATION_RELATION'], confidence: 'HIGH_SOURCE_AND_EXECUTION_BACKED', acceptedByManifest: false
  },
  {
    areaId: 'GRATITUDE_REGION_MIRROR_MANOR_PRECINCT', humanName: 'Mirror Manor Precinct', coordinateStatus: 'MEASURED_CANDIDATE', candidateId: 'GRATITUDE_REGION_PRIMARY_MANOR_SITE_ENVELOPE_CANDIDATE_01',
    centerAnchor: { ...samplePoint(manorAnchor.x, manorAnchor.z), yawDegrees: hillWaypoint.yawDegrees, pitchDegrees: hillWaypoint.pitchDegrees, anchorSource: 'EXISTING_HILL_NAVIGATION_WAYPOINT_AND_PHYSICAL_SCREENSHOT_ALIGNMENT' },
    coreShelfEnvelope: manorCoreSummary, broaderPrecinctEnvelope: manorPrecinctSummary, formationMembership: formationMembership(manorAnchor.x, manorAnchor.z),
    semanticAddressCorrespondence: { center: positionSemanticCorrespondence(manorAnchor.x, manorAnchor.z), userObservedAddresses: ['H_EARTH_GROUND_CELL_001:R06:C11', 'H_EARTH_GROUND_CELL_001:R06:C12'], semanticAddressesAreDirectWorldCoordinates: false },
    sightlines: { beachwardAtCenter: centerBeachSightline, mountainwardAtCenter: centerMountainSightline, mountainSummitTarget: mountainSummit, coreShelfBeachVisibleSampleCount: beachVisibleCoreSamples.length, coreShelfMountainVisibleSampleCount: mountainVisibleCoreSamples.length, coreShelfSampleCount: manorCoreSamples.length },
    noBuildAndPreservationAreas: [{ id: 'H_EARTH_DRAINAGE_VALLEY_001_PRESERVATION_ENVELOPE', formationId: H_EARTH_TERRAIN_FORMATIONS.VALLEY_001.formationId, bounds: H_EARTH_TERRAIN_FORMATIONS.VALLEY_001.worldBounds, law: 'LOW_CORRIDOR_AND_DRAINAGE_RELATION_REMAINS_DISTINCT_FROM_MANOR_FOOTPRINT' }],
    confidence: 'HIGH_CANDIDATE_SITE_ENVELOPE_FINAL_FOOTPRINT_UNRESOLVED', finalAnchorAssigned: false, acceptedByManifest: false
  },
  {
    areaId: 'GRATITUDE_REGION_CAVERN_PRECINCT', humanName: 'Cavern Precinct', coordinateStatus: 'MEASURED_CANDIDATE',
    exteriorFaceCandidateBand: cavernFaceSummary, approachCandidateBand: cavernApproachSummary, representativeCandidateOnly: cavernRepresentative, candidateCount: cavernCandidates.length,
    formationMembership: formationMembership(cavernRepresentative.face.x, cavernRepresentative.face.z), semanticAddressCorrespondence: positionSemanticCorrespondence(cavernRepresentative.approach.x, cavernRepresentative.approach.z),
    preservationAreas: ['MOUNTAIN_EXTERIOR_MUST_REMAIN_CONTINUOUS', 'CAVERN_INTERIOR_REMAINS_SEPARATE_LATER_OCCURRENCE', 'NO_TERRAIN_PHASE_ENTRY'],
    confidence: 'MODERATE_EXTERIOR_FACE_BAND_CAVERN_FUNCTION_STILL_BLOCKING', finalEntranceAssigned: false, acceptedByManifest: false
  },
  {
    areaId: 'GRATITUDE_REGION_FRONTIER_PLAINS', humanName: 'Frontier Plains', coordinateStatus: 'MEASURED_CANDIDATE',
    centerAnchor: { ...samplePoint(frontierAnchor.x, frontierAnchor.z), anchorSource: 'DERIVED_CENTER_OF_MAXIMUM_ALL_ELIGIBLE_AXIS_ALIGNED_LOWLAND_RECTANGLE' }, boundaryEnvelope: frontierSummary,
    derivation: { searchFormationId: H_EARTH_TERRAIN_FORMATIONS.LOWLAND_001.formationId, searchBounds: H_EARTH_TERRAIN_FORMATIONS.LOWLAND_001.worldBounds, sampleSpacingWorldUnits: 4, eligibility: { minimumShorelineDistance: 50, elevationMinimum: -4, elevationMaximum: 12, maximumSlope: 0.12 }, maximalRectangleSampleArea: frontierRectangle.area },
    formationMembership: formationMembership(frontierAnchor.x, frontierAnchor.z), semanticAddressCorrespondence: positionSemanticCorrespondence(frontierAnchor.x, frontierAnchor.z),
    preservationAreas: ['NO_TERRAIN_FLATTENING_ASSUMED', 'NO_FRONTIER_OBJECT_OR_FACILITY_PLACEMENT', 'REQUIRED_RESERVE_FAMILIES_REMAIN_UNRESOLVED'],
    confidence: 'HIGH_LAND_CAPACITY_CANDIDATE_FUNCTIONAL_RESERVES_UNRESOLVED', acceptedByManifest: false
  }
];

equal(areaCandidates.length, 4, 'Exactly four candidate areas must be produced');
check(areaCandidates.every((candidate) => candidate.acceptedByManifest === false), 'No candidate may be accepted by this read-only checkpoint');

const core = {
  receiptType: 'H_EARTH_GRATITUDE_REGION_FOUR_AREA_READ_ONLY_COORDINATE_RECONCILIATION_RECEIPT',
  schemaVersion: 'H_EARTH_GRATITUDE_REGION_FOUR_AREA_READ_ONLY_COORDINATE_RECONCILIATION_v1',
  baselineMainHead: BASELINE_MAIN_HEAD,
  controllingManifestPath: MANIFEST_PATH,
  controllingManifestBlob: EXPECTED_MANIFEST_BLOB,
  spatialDevelopmentArtifactPath: SPATIAL_ARTIFACT_PATH,
  spatialDevelopmentArtifactBlob: EXPECTED_SPATIAL_ARTIFACT_BLOB,
  authorizationStatus: manifest.coordinateReconciliationAuthorization.status,
  resultsClassification: manifest.coordinateReconciliationAuthorization.resultsClassification,
  terrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  terrainFieldGenerationRevision: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
  areaCandidates,
  routeCandidates: routes,
  sourceHoldsPreserved: {
    broadTerrainMeasurementProgramAuthorized: false, finalCoordinatesAssigned: false, fourAreaEnvelopesAccepted: false, terrainMutationAuthorized: false, finalPlacementAuthorized: false, geometryConstructionAuthorized: false, gameplayChangeAuthorized: false, runtimeChangeAuthorized: false, publicRouteChangeAuthorized: false, productionChangeAuthorized: false, futureRegionConstructionAuthorized: false,
    spiritFormTraversalBlockerActive: true, mirrorMeIdentityClassBlockerActive: true, cavernFunctionBlockerActive: true, frontierReserveFamiliesBlockerActive: true
  },
  assertionsPassed,
  issues: []
};
const receipt = { ...core, eligible: true, status: 'GRATITUDE_REGION_FOUR_AREA_READ_ONLY_COORDINATE_RECONCILIATION_PASS', deterministicDigestAlgorithm: 'SHA256_STABLE_JSON', deterministicDigest: sha256(core) };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`RECEIPT_PATH=${RECEIPT_PATH}`);
console.log(`RECEIPT_STATUS=${receipt.status}`);
console.log(`RECEIPT_DIGEST=${receipt.deterministicDigest}`);
console.log(`AREA_CANDIDATE_COUNT=${receipt.areaCandidates.length}`);
console.log(`ASSERTIONS_PASSED=${receipt.assertionsPassed}`);
console.log(`H_EARTH_GRATITUDE_COORDINATE_RECEIPT=${JSON.stringify(receipt)}`);
