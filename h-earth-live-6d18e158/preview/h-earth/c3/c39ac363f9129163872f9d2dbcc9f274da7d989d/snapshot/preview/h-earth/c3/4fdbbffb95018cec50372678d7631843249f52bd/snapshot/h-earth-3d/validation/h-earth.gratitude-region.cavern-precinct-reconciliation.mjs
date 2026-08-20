import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  deriveGRCRCandidateEnvelope,
  evaluateGRCRTerrainSightline,
  extractGRCRTerrainMetrics,
  resolveGRCRFormationMembership,
  resolveGRCRSemanticAddressProjection,
  searchGRCRConnectedSurface
} from './h-earth.gratitude-region.coordinate-reconciliation.harness.mjs';
import { identifyGRCREntryFirstLawfulInlandExit } from './h-earth.gratitude-region.entry-zone-reconciliation.mjs';
import {
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT,
  evaluateHEarthRun8AMountainContribution
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
const keyOf = (x, z) => `${x},${z}`;
const round = (value, digits = 9) => Number(value.toFixed(digits));
const distanceXZ = (left, right) => Math.hypot(right.x - left.x, right.z - left.z);
const contains = (bounds, x, z) => x >= bounds.xMinimum && x <= bounds.xMaximum && z >= bounds.zMinimum && z <= bounds.zMaximum;
const snap = (value, step) => Math.round(value / step) * step;

const MOUNTAIN = H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT;
const TRANSITION = MOUNTAIN.transitionBounds;
const CORE = MOUNTAIN.coreBounds;
const WORLD = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
const WORLD_BOUNDARY_MARGIN = 16;
const SEARCH = freeze({
  xMinimum: TRANSITION.xMinimum + 4,
  xMaximum: TRANSITION.xMaximum - 4,
  zMinimum: TRANSITION.zMinimum + 4,
  zMaximum: TRANSITION.zMaximum - 4,
  step: 4,
  outwardProbeDistance: 8,
  precinctOffsetDistance: 16
});
const ROUTE = freeze({
  xMinimum: -240,
  xMaximum: 96,
  zMinimum: -312,
  zMaximum: -144,
  step: 8,
  minimumElevation: 0.25,
  maximumSlope: 2.25,
  maximumNeighborElevationDelta: 18
});
const DIRECTIONS = freeze([
  freeze({ id: 'EAST', x: 1, z: 0 }),
  freeze({ id: 'WEST', x: -1, z: 0 }),
  freeze({ id: 'BEACHWARD', x: 0, z: 1 }),
  freeze({ id: 'MOUNTAINWARD', x: 0, z: -1 })
]);

export const H_EARTH_GRATITUDE_REGION_CAVERN_PRECINCT_RECONCILIATION = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_CAVERN_PRECINCT_RECONCILIATION_v1',
  checkpointId: 'GR-CR-04H',
  status: 'CAVERN_PRECINCT_SECTION_EXECUTION_ENABLED',
  completedMicroCheckpoints: freeze(['GR-CR-04A', 'GR-CR-04B', 'GR-CR-04C', 'GR-CR-04D', 'GR-CR-04E', 'GR-CR-04F', 'GR-CR-04G', 'GR-CR-04H']),
  candidateClass: 'MEASURED_OR_DERIVED_CANDIDATE_PENDING_LATER_MANIFEST_ACCEPTANCE',
  accepted: false,
  finalCoordinatesAssigned: false,
  entranceConstruction: false,
  terrainExcavation: false,
  cavernGeometryGeneration: false,
  narrativeContentResolution: false
});

function readClosedMirrorManorState() {
  const path = new URL('./h-earth.gratitude-region.mirror-manor-reconciliation.receipt.v1.json', import.meta.url);
  const receipt = JSON.parse(fs.readFileSync(path, 'utf8'));
  const center = receipt?.mirrorManorCandidate?.center ?? null;
  const eligible = receipt?.status === 'PASS_CLOSED'
    && receipt?.mirrorManorCandidate?.eligible === true
    && receipt?.mirrorManorCandidate?.accepted === false
    && Number.isFinite(center?.x)
    && Number.isFinite(center?.z);
  return freeze({
    checkpointId: 'GR-CR-04A',
    eligible,
    status: eligible ? 'PRIOR_MIRROR_MANOR_PASS_CLOSED_STATE_READ' : 'PRIOR_MIRROR_MANOR_STATE_INVALID',
    sourceSchemaVersion: receipt?.schemaVersion ?? null,
    sourceCheckpointId: receipt?.checkpointId ?? null,
    center: eligible ? freeze({ x: center.x, z: center.z }) : null,
    accepted: false,
    finalCoordinatesAssigned: false,
    issues: freeze(eligible ? [] : ['PRIOR_MIRROR_MANOR_PASS_CLOSED_STATE_REQUIRED'])
  });
}

function createSampler() {
  const cache = new Map();
  return (x, z) => {
    const key = keyOf(round(x, 6), round(z, 6));
    if (!cache.has(key)) cache.set(key, extractGRCRTerrainMetrics(x, z));
    return cache.get(key);
  };
}

function evaluateCrossClearance(sample, face, outward) {
  const perpendicular = { x: -outward.z, z: outward.x };
  const points = [];
  for (const offset of [-4, 0, 4]) {
    const x = face.x + perpendicular.x * offset;
    const z = face.z + perpendicular.z * offset;
    const metrics = sample(x, z);
    points.push(freeze({ offset, x, z, metrics }));
  }
  const valid = points.every((point) => point.metrics.valid === true);
  const elevations = points.filter((point) => point.metrics.valid).map((point) => point.metrics.elevation);
  const slopes = points.filter((point) => point.metrics.valid).map((point) => point.metrics.slope);
  return freeze({
    valid,
    widthWorldUnits: 8,
    sampleCount: points.length,
    elevationRange: elevations.length ? Math.max(...elevations) - Math.min(...elevations) : null,
    maximumSlope: slopes.length ? Math.max(...slopes) : null,
    points: freeze(points)
  });
}

function sampleExistingMountainExterior(sample) {
  const candidates = [];
  let sampledPointCount = 0;
  for (let z = SEARCH.zMinimum; z <= SEARCH.zMaximum; z += SEARCH.step) {
    for (let x = SEARCH.xMinimum; x <= SEARCH.xMaximum; x += SEARCH.step) {
      sampledPointCount += 1;
      if (contains(CORE, x, z)) continue;
      const face = sample(x, z);
      if (!face.valid || face.elevation <= 2 || face.slope > 3) continue;
      const mountainContribution = evaluateHEarthRun8AMountainContribution(x, z);
      if (!Number.isFinite(mountainContribution) || mountainContribution < 2) continue;
      const formation = resolveGRCRFormationMembership(x, z);
      if (!formation.formationIds.includes(MOUNTAIN.formationId)) continue;

      const outwardOptions = DIRECTIONS.map((direction) => {
        const probe = {
          x: x + direction.x * SEARCH.outwardProbeDistance,
          z: z + direction.z * SEARCH.outwardProbeDistance
        };
        const probeContribution = evaluateHEarthRun8AMountainContribution(probe.x, probe.z);
        return freeze({
          direction,
          probe: freeze(probe),
          probeContribution,
          contributionDrop: mountainContribution - probeContribution
        });
      }).sort((left, right) => right.contributionDrop - left.contributionDrop || left.direction.id.localeCompare(right.direction.id));

      const outward = outwardOptions[0];
      if (!outward || outward.contributionDrop < 1 || outward.probeContribution > mountainContribution * 0.9) continue;
      const apron = sample(outward.probe.x, outward.probe.z);
      const precinctCenter = {
        x: x + outward.direction.x * SEARCH.precinctOffsetDistance,
        z: z + outward.direction.z * SEARCH.precinctOffsetDistance
      };
      if (precinctCenter.x < WORLD.xMinimum + WORLD_BOUNDARY_MARGIN
        || precinctCenter.x > WORLD.xMaximum - WORLD_BOUNDARY_MARGIN
        || precinctCenter.z < WORLD.zMinimum + WORLD_BOUNDARY_MARGIN
        || precinctCenter.z > WORLD.zMaximum - WORLD_BOUNDARY_MARGIN) continue;
      const precinct = sample(precinctCenter.x, precinctCenter.z);
      if (!apron.valid || !precinct.valid) continue;
      if (apron.elevation <= ROUTE.minimumElevation || precinct.elevation <= ROUTE.minimumElevation) continue;
      if (apron.slope > 2 || precinct.slope > 1.8) continue;
      if (Math.abs(face.elevation - apron.elevation) > 20 || Math.abs(apron.elevation - precinct.elevation) > 12) continue;
      if (contains(CORE, precinctCenter.x, precinctCenter.z)) continue;
      const clearance = evaluateCrossClearance(sample, { x, z }, outward.direction);
      if (!clearance.valid || clearance.maximumSlope > 3.25 || clearance.elevationRange > 18) continue;

      candidates.push(freeze({
        face: freeze({ x, z }),
        faceTerrain: face,
        faceMountainContribution: mountainContribution,
        faceFormationMembership: formation,
        outwardDirection: outward.direction,
        outwardProbe: outward,
        apronTerrain: apron,
        precinctCenter: freeze(precinctCenter),
        precinctTerrain: precinct,
        crossClearance: clearance,
        attachmentLawSatisfied: true,
        mountainCoreEntryRequired: false,
        accepted: false,
        finalEntranceAnchor: false
      }));
    }
  }
  candidates.sort((left, right) => right.outwardProbe.contributionDrop - left.outwardProbe.contributionDrop
    || left.precinctTerrain.slope - right.precinctTerrain.slope
    || right.faceMountainContribution - left.faceMountainContribution
    || left.face.x - right.face.x
    || left.face.z - right.face.z);
  return freeze({
    checkpointId: 'GR-CR-04B',
    eligible: candidates.length > 0,
    status: candidates.length > 0 ? 'EXISTING_MOUNTAIN_EXTERIOR_FACE_RELATIONS_DERIVED_NONFINAL' : 'NO_MOUNTAIN_EXTERIOR_FACE_RELATION_FOUND',
    searchBounds: SEARCH,
    mountainCoreBounds: CORE,
    mountainTransitionBounds: TRANSITION,
    sampledPointCount,
    candidateCount: candidates.length,
    candidates: freeze(candidates.slice(0, 96)),
    accepted: false,
    finalEntranceAnchor: false,
    issues: freeze(candidates.length > 0 ? [] : ['NO_ELIGIBLE_EXISTING_MOUNTAIN_EXTERIOR_FACE'])
  });
}

function buildRouteField(sample, origin) {
  const nodes = new Map();
  for (let z = ROUTE.zMinimum; z <= ROUTE.zMaximum; z += ROUTE.step) {
    for (let x = ROUTE.xMinimum; x <= ROUTE.xMaximum; x += ROUTE.step) {
      if (contains(CORE, x, z)) continue;
      const terrain = sample(x, z);
      if (!terrain.valid || terrain.elevation < ROUTE.minimumElevation || terrain.slope > ROUTE.maximumSlope) continue;
      nodes.set(keyOf(x, z), freeze({ x, z, terrain }));
    }
  }
  const startCandidates = [...nodes.values()].sort((left, right) => distanceXZ(left, origin) - distanceXZ(right, origin) || left.x - right.x || left.z - right.z);
  const start = startCandidates[0] ?? null;
  if (!start || distanceXZ(start, origin) > 20) {
    return freeze({ checkpointId: 'GR-CR-04C', eligible: false, status: 'ROUTE_FIELD_START_NOT_FOUND', nodeCount: nodes.size, issues: freeze(['LAWFUL_ROUTE_START_NOT_FOUND']) });
  }

  const distances = new Map([...nodes.keys()].map((key) => [key, Number.POSITIVE_INFINITY]));
  const previous = new Map();
  const unvisited = new Set(nodes.keys());
  const startKey = keyOf(start.x, start.z);
  distances.set(startKey, 0);
  const offsets = [
    [ROUTE.step, 0], [-ROUTE.step, 0], [0, ROUTE.step], [0, -ROUTE.step],
    [ROUTE.step, ROUTE.step], [ROUTE.step, -ROUTE.step], [-ROUTE.step, ROUTE.step], [-ROUTE.step, -ROUTE.step]
  ];

  while (unvisited.size > 0) {
    let currentKey = null;
    let currentDistance = Number.POSITIVE_INFINITY;
    for (const key of unvisited) {
      const candidateDistance = distances.get(key);
      if (candidateDistance < currentDistance || (candidateDistance === currentDistance && key < currentKey)) {
        currentKey = key;
        currentDistance = candidateDistance;
      }
    }
    if (currentKey === null || !Number.isFinite(currentDistance)) break;
    unvisited.delete(currentKey);
    const current = nodes.get(currentKey);
    for (const [dx, dz] of offsets) {
      const neighborKey = keyOf(current.x + dx, current.z + dz);
      if (!unvisited.has(neighborKey)) continue;
      const neighbor = nodes.get(neighborKey);
      const elevationDelta = Math.abs(neighbor.terrain.elevation - current.terrain.elevation);
      if (elevationDelta > ROUTE.maximumNeighborElevationDelta) continue;
      const segmentDistance = Math.hypot(dx, dz);
      const ascent = Math.max(0, neighbor.terrain.elevation - current.terrain.elevation);
      const segmentCost = segmentDistance * (1 + neighbor.terrain.slope * 0.12) + ascent * 0.08;
      const nextDistance = currentDistance + segmentCost;
      if (nextDistance < distances.get(neighborKey)) {
        distances.set(neighborKey, nextDistance);
        previous.set(neighborKey, currentKey);
      }
    }
  }

  return freeze({
    checkpointId: 'GR-CR-04C',
    eligible: true,
    status: 'LAWFUL_LAND_ROUTE_FIELD_DERIVED_NONFINAL',
    routeGrid: ROUTE,
    origin: freeze({ x: origin.x, z: origin.z }),
    start: freeze({ x: start.x, z: start.z, terrain: start.terrain }),
    nodeCount: nodes.size,
    nodes,
    distances,
    previous,
    accepted: false,
    finalRoute: false,
    issues: freeze([])
  });
}

function resolveRoute(routeField, target) {
  if (!routeField.eligible) return freeze({ eligible: false, status: 'ROUTE_FIELD_REQUIRED', issues: freeze(['ROUTE_FIELD_REQUIRED']) });
  const targetX = snap(target.x, ROUTE.step);
  const targetZ = snap(target.z, ROUTE.step);
  const targetKey = keyOf(targetX, targetZ);
  const targetNode = routeField.nodes.get(targetKey) ?? null;
  const routeCost = targetNode ? routeField.distances.get(targetKey) : Number.POSITIVE_INFINITY;
  if (!targetNode || !Number.isFinite(routeCost) || distanceXZ(targetNode, target) > 6) {
    return freeze({ eligible: false, status: 'NO_LAWFUL_ROUTE_TO_PRECINCT', target: freeze({ ...target }), snappedTarget: freeze({ x: targetX, z: targetZ }), issues: freeze(['NO_LAWFUL_ROUTE_TO_PRECINCT']) });
  }
  const reverse = [];
  let currentKey = targetKey;
  const startKey = keyOf(routeField.start.x, routeField.start.z);
  while (currentKey) {
    const node = routeField.nodes.get(currentKey);
    reverse.push(freeze({ x: node.x, z: node.z, elevation: node.terrain.elevation, slope: node.terrain.slope }));
    if (currentKey === startKey) break;
    currentKey = routeField.previous.get(currentKey) ?? null;
  }
  const reachedStart = reverse[reverse.length - 1]?.x === routeField.start.x && reverse[reverse.length - 1]?.z === routeField.start.z;
  const path = reverse.reverse();
  const maximumSlope = Math.max(...path.map((point) => point.slope));
  let maximumNeighborElevationDelta = 0;
  let pathDistance = 0;
  for (let index = 1; index < path.length; index += 1) {
    maximumNeighborElevationDelta = Math.max(maximumNeighborElevationDelta, Math.abs(path[index].elevation - path[index - 1].elevation));
    pathDistance += distanceXZ(path[index - 1], path[index]);
  }
  return freeze({
    eligible: path.length >= 2 && reachedStart,
    status: path.length >= 2 && reachedStart ? 'LAWFUL_LAND_APPROACH_CANDIDATE_DERIVED_NOT_ACCEPTED' : 'LAWFUL_LAND_APPROACH_HELD',
    target: freeze({ ...target }),
    snappedTarget: freeze({ x: targetX, z: targetZ }),
    snappedTargetOffset: distanceXZ(targetNode, target),
    pathPointCount: path.length,
    pathDistance,
    routeCost,
    maximumSlope,
    maximumNeighborElevationDelta,
    path: freeze(path),
    accepted: false,
    finalRoute: false,
    issues: freeze(path.length >= 2 && reachedStart ? [] : ['ROUTE_RECONSTRUCTION_FAILED'])
  });
}

function derivePrecinctEnvelope(candidate) {
  const connected = searchGRCRConnectedSurface({
    centerX: candidate.precinctCenter.x,
    centerZ: candidate.precinctCenter.z,
    radius: 12,
    step: 4,
    maximumSlope: 1.8,
    maximumNeighborElevationDelta: 12
  });
  const envelope = connected.eligible
    ? deriveGRCRCandidateEnvelope(connected, { envelopeId: 'GRATITUDE_REGION_CAVERN_PRECINCT_RESERVABLE_ENVELOPE_CANDIDATE_01', selfTestOnly: false })
    : freeze({ eligible: false, status: 'CONNECTED_PRECINCT_SURFACE_REQUIRED', issues: freeze(['CONNECTED_PRECINCT_SURFACE_REQUIRED']) });
  const coreConflictSamples = (connected.samples ?? []).filter((sample) => contains(CORE, sample.world.x, sample.world.z));
  const bounds = envelope.eligible ? envelope.bounds : null;
  const worldBoundaryClearance = bounds ? Math.min(
    bounds.xMinimum - WORLD.xMinimum,
    WORLD.xMaximum - bounds.xMaximum,
    bounds.zMinimum - WORLD.zMinimum,
    WORLD.zMaximum - bounds.zMaximum
  ) : Number.NEGATIVE_INFINITY;
  const boundaryClipped = !Number.isFinite(worldBoundaryClearance) || worldBoundaryClearance < 4;
  const eligible = connected.eligible === true && connected.sampleCount >= 5 && envelope.eligible === true && coreConflictSamples.length === 0 && boundaryClipped === false;
  return freeze({
    checkpointId: 'GR-CR-04F',
    eligible,
    status: eligible ? 'RESERVABLE_CAVERN_PRECINCT_ENVELOPE_DERIVED_NONFINAL' : 'RESERVABLE_CAVERN_PRECINCT_ENVELOPE_HELD',
    connectedSurface: connected,
    envelope,
    mountainCoreConflictSampleCount: coreConflictSamples.length,
    worldBoundaryClearance,
    boundaryClipped,
    accepted: false,
    finalPlacement: false,
    finalCoordinatesAssigned: false,
    issues: freeze(eligible ? [] : [boundaryClipped ? 'WORLD_BOUNDARY_CLIPPED_PRECINCT_ENVELOPE' : 'RESERVABLE_PRECINCT_ENVELOPE_INELIGIBLE'])
  });
}

function evaluateCandidate(candidate, routeField, entryOrigin, manorOrigin) {
  const approach = resolveRoute(routeField, candidate.precinctCenter);
  if (!approach.eligible) return freeze({ ...candidate, eligible: false, approach, rejectionReasons: freeze(['NO_LAWFUL_LAND_APPROACH']) });
  const precinctEnvelope = derivePrecinctEnvelope(candidate);
  const surfaceProjection = resolveGRCRSemanticAddressProjection(candidate.face.x, candidate.face.z);
  const entrySightline = evaluateGRCRTerrainSightline({ from: entryOrigin, to: candidate.face, sampleCount: 36, endpointEyeHeight: 2.25, terrainClearance: 0.15 });
  const manorSightline = evaluateGRCRTerrainSightline({ from: manorOrigin, to: candidate.face, sampleCount: 36, endpointEyeHeight: 2.25, terrainClearance: 0.15 });
  const eligible = precinctEnvelope.eligible === true
    && candidate.faceFormationMembership.formationIds.includes(MOUNTAIN.formationId)
    && candidate.faceMountainContribution > 0
    && contains(CORE, candidate.precinctCenter.x, candidate.precinctCenter.z) === false;
  const score = (eligible ? 100 : 0)
    + candidate.outwardProbe.contributionDrop * 1.5
    + Math.min(24, candidate.faceMountainContribution) * 0.4
    + (1 / (1 + candidate.precinctTerrain.slope)) * 12
    + Math.min(20, precinctEnvelope.connectedSurface.sampleCount) * 0.35
    - approach.routeCost * 0.02
    - Math.abs(candidate.faceTerrain.elevation - 36) * 0.03;
  return freeze({
    ...candidate,
    eligible,
    score,
    approach,
    precinctEnvelope,
    surfaceCorrespondence: freeze({
      checkpointId: 'GR-CR-04D',
      status: 'EXISTING_MOUNTAIN_SURFACE_CORRESPONDENCE_DERIVED_NONFINAL',
      terrainContractId: candidate.faceTerrain.contractId,
      mountainContractId: MOUNTAIN.contractId,
      mountainFormationId: MOUNTAIN.formationId,
      mountainContribution: candidate.faceMountainContribution,
      formationMembership: candidate.faceFormationMembership,
      semanticProjection: surfaceProjection,
      exteriorAttachmentRequired: true,
      exteriorAttachmentSatisfied: true,
      entranceOpeningConstructed: false,
      accepted: false
    }),
    visibilityEvidence: freeze({
      checkpointId: 'GR-CR-04E',
      status: 'VISIBILITY_AND_CONCEALMENT_EVIDENCE_DERIVED_NONFINAL',
      entryZone: freeze({ valid: entrySightline.valid, clear: entrySightline.clear, classification: entrySightline.clear ? 'VISIBLE_FROM_ENTRY_ZONE_NONFINAL' : 'TERRAIN_CONCEALED_FROM_ENTRY_ZONE_NONFINAL', maximumObstruction: entrySightline.maximumObstruction }),
      mirrorManor: freeze({ valid: manorSightline.valid, clear: manorSightline.clear, classification: manorSightline.clear ? 'VISIBLE_FROM_MIRROR_MANOR_NONFINAL' : 'TERRAIN_CONCEALED_FROM_MIRROR_MANOR_NONFINAL', maximumObstruction: manorSightline.maximumObstruction }),
      narrativeMeaningAssigned: false
    }),
    distanceEvidence: freeze({
      entryZoneStraightLineDistance: distanceXZ(entryOrigin, candidate.face),
      mirrorManorStraightLineDistance: distanceXZ(manorOrigin, candidate.face),
      mirrorManorApproachPathDistance: approach.pathDistance
    }),
    rejectionReasons: freeze(eligible ? [] : [...precinctEnvelope.issues])
  });
}

export function deriveGRCRCavernPrecinctCandidate() {
  const sample = createSampler();
  const mirrorState = readClosedMirrorManorState();
  const entry = identifyGRCREntryFirstLawfulInlandExit();
  const entryOrigin = entry.firstLawfulExit
    ? freeze({ x: entry.firstLawfulExit.x, z: entry.firstLawfulExit.z })
    : freeze({ x: 0, z: -108 });
  const manorOrigin = mirrorState.center ?? freeze({ x: 80, z: -172 });
  const exterior = sampleExistingMountainExterior(sample);
  const routeField = buildRouteField(sample, manorOrigin);
  const evaluated = exterior.candidates
    .slice(0, 48)
    .map((candidate) => evaluateCandidate(candidate, routeField, entryOrigin, manorOrigin))
    .sort((left, right) => Number(right.eligible) - Number(left.eligible)
      || right.score - left.score
      || left.approach.routeCost - right.approach.routeCost
      || left.face.x - right.face.x
      || left.face.z - right.face.z);
  const selected = evaluated.find((candidate) => candidate.eligible) ?? null;
  const issues = [];
  if (!mirrorState.eligible) issues.push(...mirrorState.issues);
  if (!entry.eligible) issues.push('ENTRY_ZONE_LAWFUL_INLAND_EXIT_REQUIRED');
  if (!exterior.eligible) issues.push(...exterior.issues);
  if (!routeField.eligible) issues.push(...routeField.issues);
  if (!selected) issues.push('NO_ELIGIBLE_CAVERN_EXTERIOR_ENTRANCE_RELATION');

  const interiorTransitionRelation = selected ? freeze({
    checkpointId: 'GR-CR-04G',
    status: 'SEPARATE_INTERIOR_TRANSITION_RELATION_DERIVED_NOT_ASSIGNED',
    exteriorCandidateId: 'GRATITUDE_REGION_CAVERN_EXTERIOR_ENTRANCE_RELATION_CANDIDATE_01',
    separateBoundedInteriorOccurrenceRequired: true,
    inwardDirection: freeze({ x: -selected.outwardDirection.x, z: -selected.outwardDirection.z }),
    candidateDepthRangeWorldUnits: freeze({ minimum: 8, maximum: 32 }),
    interiorTransitionAnchorAssigned: false,
    interiorCoordinatesAssigned: false,
    cavernShapeAssigned: false,
    cavernSizeAssigned: false,
    cavernContentsAssigned: false,
    accepted: false
  }) : null;

  const candidate = freeze({
    checkpointId: 'GR-CR-04G',
    candidateId: 'GRATITUDE_REGION_CAVERN_EXTERIOR_ENTRANCE_RELATION_CANDIDATE_01',
    precinctEnvelopeId: 'GRATITUDE_REGION_CAVERN_PRECINCT_RESERVABLE_ENVELOPE_CANDIDATE_01',
    candidateClass: 'MEASURED_OR_DERIVED_CANDIDATE_PENDING_LATER_MANIFEST_ACCEPTANCE',
    eligible: issues.length === 0,
    accepted: false,
    finalPlacement: false,
    finalCoordinatesAssigned: false,
    finalEntranceAnchor: false,
    mirrorManorPriorState: mirrorState,
    entryZonePriorRelation: freeze({ eligible: entry.eligible, firstLawfulExit: entry.firstLawfulExit ? freeze({ x: entry.firstLawfulExit.x, z: entry.firstLawfulExit.z }) : null }),
    mountainContext: freeze({
      formationId: MOUNTAIN.formationId,
      contractId: MOUNTAIN.contractId,
      coreBounds: CORE,
      transitionBounds: TRANSITION,
      worldDomain: WORLD,
      worldBoundaryMargin: WORLD_BOUNDARY_MARGIN,
      exteriorAttachmentLaw: 'ENTRANCE_MUST_ATTACH_TO_EXISTING_MOUNTAIN_EXTERIOR',
      mountainPhaseEntryRequired: false
    }),
    exteriorSearchSummary: freeze({ searchBounds: SEARCH, sampledPointCount: exterior.sampledPointCount, faceCandidateCount: exterior.candidateCount }),
    evaluatedCandidateCount: evaluated.length,
    selectedExteriorRelation: selected,
    rejectedCandidateSummaries: freeze(evaluated.filter((candidate) => !candidate.eligible).slice(0, 12).map((candidate) => freeze({ face: candidate.face, precinctCenter: candidate.precinctCenter, rejectionReasons: candidate.rejectionReasons }))),
    lawfulApproachCandidate: selected?.approach ?? null,
    surfaceCorrespondence: selected?.surfaceCorrespondence ?? null,
    visibilityOrConcealmentEvidence: selected?.visibilityEvidence ?? null,
    reservablePrecinctEnvelope: selected?.precinctEnvelope ?? null,
    distanceEvidence: selected?.distanceEvidence ?? null,
    interiorTransitionRelation,
    preservationRules: freeze([
      'NO_MOUNTAIN_CORE_ROUTE_ENTRY',
      'NO_INTERIOR_GEOMETRY_BEFORE_ENTRANCE_ACCEPTANCE',
      'NO_CAVERN_FUNCTION_OR_CONTENT_CLAIM_BEYOND_CONTROLLING_MANIFEST',
      'EXISTING_MOUNTAIN_EXTERIOR_REMAINS_UNMUTATED'
    ]),
    entranceConstruction: false,
    terrainExcavation: false,
    cavernGeometryGeneration: false,
    narrativeContentResolution: false,
    terrainMutation: false,
    geometryConstruction: false,
    issues: freeze(issues)
  });
  return freeze({ ...candidate, candidateDigest: digest(candidate) });
}

export function executeGRCRCavernPrecinctSection() {
  const first = deriveGRCRCavernPrecinctCandidate();
  const second = deriveGRCRCavernPrecinctCandidate();
  const firstDigest = digest(first);
  const secondDigest = digest(second);
  const issues = [...first.issues];
  if (!first.eligible) issues.push('CAVERN_PRECINCT_CANDIDATE_INELIGIBLE');
  if (firstDigest !== secondDigest) issues.push('CAVERN_PRECINCT_SECTION_NONDETERMINISTIC');
  if (first.accepted !== false || first.finalPlacement !== false || first.finalCoordinatesAssigned !== false || first.finalEntranceAnchor !== false) issues.push('CAVERN_PRECINCT_AUTHORITY_OVERREACH');
  if (first.entranceConstruction !== false || first.terrainExcavation !== false || first.cavernGeometryGeneration !== false || first.narrativeContentResolution !== false) issues.push('CAVERN_PRECINCT_PROHIBITED_MUTATION_OR_CONTENT_RESOLUTION');
  return freeze({
    schemaVersion: 'H_EARTH_GRATITUDE_REGION_CAVERN_PRECINCT_RECONCILIATION_RECEIPT_v1',
    checkpointId: 'GR-CR-04H',
    sectionId: 'GR-CR-04_CAVERN_PRECINCT',
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'GR_CR_04H_CAVERN_PRECINCT_PASS' : 'GR_CR_04H_CAVERN_PRECINCT_FAIL',
    sectionStatus: issues.length === 0 ? 'PASS_CLOSED' : 'FAIL_STOPPED',
    completedMicroCheckpoints: freeze(['04A', '04B', '04C', '04D', '04E', '04F', '04G', '04H']),
    firstExecutionDigest: firstDigest,
    secondExecutionDigest: secondDigest,
    deterministicRepeatExecution: firstDigest === secondDigest,
    evidence: first,
    cavernPrecinctMeasurementExecuted: true,
    cavernExteriorRelationDerived: first.selectedExteriorRelation !== null,
    cavernPrecinctEnvelopeDerived: first.reservablePrecinctEnvelope?.eligible === true,
    cavernCandidateAccepted: false,
    finalCoordinatesAssigned: false,
    entranceConstruction: false,
    terrainExcavation: false,
    cavernGeometryGeneration: false,
    narrativeContentResolution: false,
    nextSection: 'FOLLOW_CONTROLLING_ROADMAP_WHEN_RETRIEVED',
    nextAuthorizedProgramTarget: 'FRONTIER_PLAINS',
    terrainMutation: false,
    geometryConstruction: false,
    runtimeMutation: false,
    gameplayMutation: false,
    publicRouteMutation: false,
    productionMutation: false,
    controllingManifestMutation: false,
    issues: freeze(issues)
  });
}

export default H_EARTH_GRATITUDE_REGION_CAVERN_PRECINCT_RECONCILIATION;
