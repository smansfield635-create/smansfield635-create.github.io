import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN
} from '../terrain/h-earth.world-manifold-domain.js';
import {
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT,
  evaluateHEarthRun8AMountainContribution
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import {
  H_EARTH_TERRAIN_FORMATIONS,
  H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID
} from '../terrain/h-earth.terrain-formations.js';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN,
  H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID
} from '../integration/h-earth.landscape-realization-planner.js';

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
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const keyOf = (x, z) => `${x},${z}`;
const WITNESS = freeze({ x: 0, z: -256 });
const FORMATION_WITNESS = freeze({ x: 72, z: -172 });
const ADDRESS_WITNESS = FORMATION_WITNESS;
const CONNECTED_SURFACE_WITNESS = FORMATION_WITNESS;
const SIGHTLINE_WITNESS = freeze({ from: { x: 72, z: -172 }, to: { x: 72, z: -180 } });

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS_v1',
  checkpointId: 'GR-CR-01L',
  status: 'INTEGRATED_HARNESS_DETERMINISM_EXECUTION_ENABLED',
  completedMicroCheckpoints: freeze([
    'GR-CR-01A', 'GR-CR-01B', 'GR-CR-01C', 'GR-CR-01D', 'GR-CR-01E', 'GR-CR-01F',
    'GR-CR-01G', 'GR-CR-01H', 'GR-CR-01I', 'GR-CR-01J', 'GR-CR-01K'
  ]),
  sourceImportsEstablished: true,
  terrainSamplingExecuted: true,
  terrainMetricExtractionEnabled: true,
  formationMembershipResolutionEnabled: true,
  semanticAddressProjectionEnabled: true,
  connectedSurfaceSearchEnabled: true,
  terrainOcclusionSightlineEnabled: true,
  candidateEnvelopeDerivationEnabled: true,
  integratedDeterminismExecutionEnabled: true,
  areaCandidateCoordinatesDerived: false,
  selfTestEnvelopeDerived: true,
  nextSection: 'GR-CR-02_ENTRY_ZONE',
  nextSectionExecuted: false
});

function importIssues() {
  const issues = [];
  if (H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.contractId !== H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID) issues.push('SUCCESSOR_TERRAIN_CONTRACT_ID_MISMATCH');
  if (stable(H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain) !== stable(H_EARTH_WORLD_MANIFOLD_DOMAIN.worldDomain)) issues.push('SUCCESSOR_WORLD_DOMAIN_NOT_CANONICAL_MANIFOLD_DOMAIN');
  if (!Object.isFrozen(H_EARTH_TERRAIN_FORMATIONS)) issues.push('FORMATION_AUTHORITY_NOT_FROZEN');
  if (H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID.length === 0) issues.push('FORMATION_CONTRACT_ID_MISSING');
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.contractId !== H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID) issues.push('REALIZATION_PLAN_CONTRACT_ID_MISMATCH');
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.eligible !== true) issues.push('REALIZATION_PLAN_NOT_ELIGIBLE');
  return issues;
}

export function extractGRCRTerrainMetrics(worldX, worldZ) {
  const sample = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (sample?.valid !== true) return freeze({ valid: false, worldX, worldZ });
  const normalY = sample?.normal?.y;
  const gradient = Number.isFinite(normalY) && Math.abs(normalY) > 1e-12
    ? freeze({ x: -sample.normal.x / normalY, z: -sample.normal.z / normalY })
    : freeze({ x: Number.NaN, z: Number.NaN });
  return freeze({ valid: true, contractId: sample.contractId, world: sample.world, elevation: sample.elevation, gradient, slope: sample.slope, curvature: sample.curvature, normal: sample.normal });
}

const contains = (bounds, x, z) => x >= bounds.xMin && x <= bounds.xMax && z >= bounds.zMin && z <= bounds.zMax;
const containsRun8 = (bounds, x, z) => x >= bounds.xMinimum && x <= bounds.xMaximum && z >= bounds.zMinimum && z <= bounds.zMaximum;

export function resolveGRCRFormationMembership(worldX, worldZ) {
  const legacy = Object.values(H_EARTH_TERRAIN_FORMATIONS).filter((formation) => contains(formation.worldBounds, worldX, worldZ)).map((formation) => formation.formationId).sort();
  const successorMountainContribution = evaluateHEarthRun8AMountainContribution(worldX, worldZ);
  const successor = containsRun8(H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.transitionBounds, worldX, worldZ) && successorMountainContribution > 0
    ? [H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.formationId]
    : [];
  return freeze({ world: freeze({ x: worldX, z: worldZ }), legacyFormationIds: freeze(legacy), successorFormationIds: freeze(successor), formationIds: freeze([...new Set([...legacy, ...successor])].sort()), successorMountainContribution });
}

const parseAddress = (address) => {
  const match = /:R(\d+):C(\d+)$/.exec(address);
  return match ? { address, row: Number(match[1]), column: Number(match[2]) } : null;
};

export function resolveGRCRSemanticAddressProjection(worldX, worldZ) {
  const epsilon = 1e-8;
  const chunk = H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks
    .filter((candidate) => candidate.terrainMemberAddressIds.length > 0 && candidate.physicalRole.includes('TERRAIN'))
    .filter((candidate) => worldX >= candidate.worldBounds.xMin - epsilon && worldX <= candidate.worldBounds.xMax + epsilon && worldZ >= candidate.worldBounds.zMin - epsilon && worldZ <= candidate.worldBounds.zMax + epsilon)
    .sort((left, right) => left.chunkId.localeCompare(right.chunkId))[0] ?? null;
  if (!chunk) return freeze({ valid: false, status: 'NO_TERRAIN_CHUNK', world: freeze({ x: worldX, z: worldZ }) });
  const candidates = chunk.terrainMemberAddressIds.map(parseAddress).filter(Boolean);
  if (candidates.length === 0) return freeze({ valid: false, status: 'NO_TERRAIN_ADDRESSES', chunkId: chunk.chunkId });
  const xProgress = clamp((worldX - chunk.worldBounds.xMin) / Math.max(1e-8, chunk.worldBounds.xMax - chunk.worldBounds.xMin), 0, 0.999999);
  const zProgress = clamp((worldZ - chunk.worldBounds.zMin) / Math.max(1e-8, chunk.worldBounds.zMax - chunk.worldBounds.zMin), 0, 0.999999);
  const targetColumn = chunk.addressRange.columnMin + Math.floor(xProgress * 4);
  const targetRow = chunk.addressRange.rowMin + Math.floor(zProgress * 4);
  const selected = [...candidates].sort((left, right) => {
    const leftDistance = Math.abs(left.row - targetRow) + Math.abs(left.column - targetColumn);
    const rightDistance = Math.abs(right.row - targetRow) + Math.abs(right.column - targetColumn);
    return leftDistance - rightDistance || left.address.localeCompare(right.address);
  })[0];
  return freeze({ valid: true, status: 'SEMANTIC_ADDRESS_PROJECTED', world: freeze({ x: worldX, z: worldZ }), chunkId: chunk.chunkId, physicalRole: chunk.physicalRole, formationIds: chunk.formationIds, selectedSemanticAddressId: selected.address, targetSemanticCoordinate: freeze({ row: targetRow, column: targetColumn }), projectionModel: 'CHUNK_LOCAL_NEAREST_AVAILABLE_TERRAIN_MEMBER' });
}

export function searchGRCRConnectedSurface({ centerX, centerZ, radius = 8, step = 4, maximumSlope = 0.48, maximumNeighborElevationDelta = 4 }) {
  const points = new Map();
  for (let z = centerZ - radius; z <= centerZ + radius; z += step) {
    for (let x = centerX - radius; x <= centerX + radius; x += step) {
      if (Math.hypot(x - centerX, z - centerZ) > radius + 1e-8) continue;
      const metrics = extractGRCRTerrainMetrics(x, z);
      if (metrics.valid && metrics.slope <= maximumSlope) points.set(keyOf(x, z), metrics);
    }
  }
  const seed = points.get(keyOf(centerX, centerZ)) ?? null;
  if (!seed) return freeze({ eligible: false, status: 'CONNECTED_SURFACE_SEED_INELIGIBLE', samples: freeze([]), issues: freeze(['SEED_INELIGIBLE']) });
  const queue = [seed];
  const visited = new Map([[keyOf(seed.world.x, seed.world.z), seed]]);
  const offsets = [[step, 0], [-step, 0], [0, step], [0, -step]];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const [dx, dz] of offsets) {
      const neighbor = points.get(keyOf(current.world.x + dx, current.world.z + dz));
      if (!neighbor) continue;
      const neighborKey = keyOf(neighbor.world.x, neighbor.world.z);
      if (visited.has(neighborKey)) continue;
      if (Math.abs(neighbor.elevation - current.elevation) > maximumNeighborElevationDelta) continue;
      visited.set(neighborKey, neighbor);
      queue.push(neighbor);
    }
  }
  const samples = [...visited.values()].sort((a, b) => a.world.z - b.world.z || a.world.x - b.world.x);
  return freeze({ eligible: samples.length > 0, status: samples.length > 0 ? 'CONNECTED_SURFACE_SEARCH_COMPLETE' : 'CONNECTED_SURFACE_SEARCH_EMPTY', center: freeze({ x: centerX, z: centerZ }), radius, step, maximumSlope, maximumNeighborElevationDelta, sampleCount: samples.length, samples: freeze(samples), issues: freeze([]) });
}

export function evaluateGRCRTerrainSightline({ from, to, sampleCount = 24, endpointEyeHeight = 2.25, terrainClearance = 0.15 }) {
  const start = extractGRCRTerrainMetrics(from.x, from.z);
  const end = extractGRCRTerrainMetrics(to.x, to.z);
  if (!start.valid || !end.valid) return freeze({ valid: false, status: 'SIGHTLINE_ENDPOINT_INVALID', clear: false, issues: freeze(['INVALID_ENDPOINT']) });
  const startY = start.elevation + endpointEyeHeight;
  const endY = end.elevation + endpointEyeHeight;
  const samples = [];
  let maximumObstruction = Number.NEGATIVE_INFINITY;
  let blockedSampleCount = 0;
  for (let index = 1; index < sampleCount; index += 1) {
    const t = index / sampleCount;
    const x = from.x + (to.x - from.x) * t;
    const z = from.z + (to.z - from.z) * t;
    const terrain = extractGRCRTerrainMetrics(x, z);
    if (!terrain.valid) return freeze({ valid: false, status: 'SIGHTLINE_INTERMEDIATE_SAMPLE_INVALID', clear: false, issues: freeze(['INVALID_INTERMEDIATE_SAMPLE']) });
    const lineY = startY + (endY - startY) * t;
    const obstruction = terrain.elevation + terrainClearance - lineY;
    maximumObstruction = Math.max(maximumObstruction, obstruction);
    if (obstruction > 0) blockedSampleCount += 1;
    samples.push(freeze({ index, t, x, z, terrainElevation: terrain.elevation, lineY, obstruction }));
  }
  return freeze({ valid: true, status: 'TERRAIN_OCCLUSION_SIGHTLINE_COMPLETE', clear: blockedSampleCount === 0, from: freeze({ ...from, y: startY }), to: freeze({ ...to, y: endY }), sampleCount, blockedSampleCount, maximumObstruction, samples: freeze(samples), issues: freeze([]) });
}

export function deriveGRCRCandidateEnvelope(connectedSurface, { envelopeId = 'GR_CR_SELF_TEST_ENVELOPE', selfTestOnly = true } = {}) {
  if (connectedSurface?.eligible !== true || !Array.isArray(connectedSurface.samples) || connectedSurface.samples.length === 0) {
    return freeze({ eligible: false, status: 'CANDIDATE_ENVELOPE_INPUT_INVALID', issues: freeze(['CONNECTED_SURFACE_REQUIRED']) });
  }
  const samples = connectedSurface.samples;
  const xs = samples.map((sample) => sample.world.x);
  const zs = samples.map((sample) => sample.world.z);
  const elevations = samples.map((sample) => sample.elevation);
  const slopes = samples.map((sample) => sample.slope);
  const center = freeze({ x: xs.reduce((sum, value) => sum + value, 0) / xs.length, z: zs.reduce((sum, value) => sum + value, 0) / zs.length });
  const envelopeCore = {
    envelopeId,
    selfTestOnly,
    finalPlacement: false,
    accepted: false,
    center,
    bounds: freeze({ xMinimum: Math.min(...xs), xMaximum: Math.max(...xs), zMinimum: Math.min(...zs), zMaximum: Math.max(...zs) }),
    elevationRange: freeze({ minimum: Math.min(...elevations), maximum: Math.max(...elevations) }),
    slopeRange: freeze({ minimum: Math.min(...slopes), maximum: Math.max(...slopes) }),
    connectedSampleCount: samples.length,
    approximateSampleAreaWorldUnitsSquared: samples.length * connectedSurface.step * connectedSurface.step,
    sourceConnectedSurfaceDigest: digest(connectedSurface)
  };
  return freeze({ eligible: true, status: 'CANDIDATE_ENVELOPE_DERIVED_NONFINAL', ...envelopeCore, envelopeDigest: digest(envelopeCore), issues: freeze([]) });
}

function executeIntegratedCore() {
  const issues = importIssues();
  const witnessA = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const witnessB = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const metrics = extractGRCRTerrainMetrics(WITNESS.x, WITNESS.z);
  const membership = resolveGRCRFormationMembership(FORMATION_WITNESS.x, FORMATION_WITNESS.z);
  const projection = resolveGRCRSemanticAddressProjection(ADDRESS_WITNESS.x, ADDRESS_WITNESS.z);
  const connected = searchGRCRConnectedSurface({ centerX: CONNECTED_SURFACE_WITNESS.x, centerZ: CONNECTED_SURFACE_WITNESS.z });
  const sightline = evaluateGRCRTerrainSightline(SIGHTLINE_WITNESS);
  const envelope = deriveGRCRCandidateEnvelope(connected);

  if (witnessA?.valid !== true || witnessB?.valid !== true) issues.push('WITNESS_SAMPLE_INVALID');
  if (stable(witnessA) !== stable(witnessB)) issues.push('REPEATED_WITNESS_NOT_BYTE_STABLE');
  if (metrics.valid !== true || ![metrics.elevation, metrics.gradient?.x, metrics.gradient?.z, metrics.slope, metrics.curvature].every(Number.isFinite)) issues.push('TERRAIN_METRICS_INVALID');
  if (!membership.formationIds.includes('H_EARTH_NAVIGABLE_HILL_001')) issues.push('HILL_FORMATION_WITNESS_NOT_RESOLVED');
  if (projection.valid !== true || projection.targetSemanticCoordinate?.row !== 6 || projection.targetSemanticCoordinate?.column !== 11 || !String(projection.selectedSemanticAddressId).endsWith(':R06:C11')) issues.push('SEMANTIC_PROJECTION_WITNESS_FAILED');
  if (connected.eligible !== true || connected.sampleCount < 2) issues.push('CONNECTED_SURFACE_WITNESS_FAILED');
  if (sightline.valid !== true || sightline.samples.length !== 23 || !Number.isFinite(sightline.maximumObstruction)) issues.push('SIGHTLINE_WITNESS_FAILED');
  if (envelope.eligible !== true || envelope.selfTestOnly !== true || envelope.accepted !== false) issues.push('CANDIDATE_ENVELOPE_WITNESS_FAILED');

  return freeze({
    eligible: issues.length === 0,
    issues: freeze(issues),
    importedContractIds: freeze({
      successorTerrain: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
      formations: H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
      realizationPlanner: H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
      successorMountain: H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.contractId
    }),
    witness: freeze({ coordinate: WITNESS, elevation: witnessA.elevation, sampleDigest: digest(witnessA) }),
    terrainMetrics: freeze({ elevation: metrics.elevation, gradient: metrics.gradient, slope: metrics.slope, curvature: metrics.curvature }),
    formationWitness: freeze({ coordinate: FORMATION_WITNESS, formationIds: membership.formationIds, mountainContribution: membership.successorMountainContribution }),
    semanticProjectionWitness: freeze({ coordinate: ADDRESS_WITNESS, chunkId: projection.chunkId, selectedSemanticAddressId: projection.selectedSemanticAddressId, targetSemanticCoordinate: projection.targetSemanticCoordinate, projectionModel: projection.projectionModel }),
    connectedSurfaceWitness: freeze({ coordinate: CONNECTED_SURFACE_WITNESS, sampleCount: connected.sampleCount, digest: digest(connected) }),
    sightlineWitness: freeze({ ...SIGHTLINE_WITNESS, clear: sightline.clear, blockedSampleCount: sightline.blockedSampleCount, maximumObstruction: sightline.maximumObstruction, digest: digest(sightline) }),
    envelopeWitness: freeze({ envelopeId: envelope.envelopeId, selfTestOnly: envelope.selfTestOnly, accepted: envelope.accepted, bounds: envelope.bounds, elevationRange: envelope.elevationRange, slopeRange: envelope.slopeRange, connectedSampleCount: envelope.connectedSampleCount, envelopeDigest: envelope.envelopeDigest })
  });
}

export function executeGRCR01IntegratedHarness() {
  const first = executeIntegratedCore();
  const second = executeIntegratedCore();
  const firstDigest = digest(first);
  const secondDigest = digest(second);
  const deterministic = firstDigest === secondDigest;
  const issues = [...first.issues];
  if (!deterministic) issues.push('INTEGRATED_REPEAT_EXECUTION_NONDETERMINISTIC');
  return freeze({
    schemaVersion: 'H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS_RECEIPT_v1',
    checkpointId: 'GR-CR-01L',
    sectionId: 'GR-CR-01_ANALYSIS_HARNESS',
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'GR_CR_01L_INTEGRATED_HARNESS_PASS' : 'GR_CR_01L_INTEGRATED_HARNESS_FAIL',
    sectionStatus: issues.length === 0 ? 'PASS_CLOSED' : 'FAIL_STOPPED',
    completedMicroCheckpoints: freeze(['01A','01B','01C','01D','01E','01F','01G','01H','01I','01J','01K','01L']),
    firstExecutionDigest: firstDigest,
    secondExecutionDigest: secondDigest,
    deterministicRepeatExecution: deterministic,
    evidence: first,
    areaCandidateCoordinatesDerived: false,
    selfTestEnvelopeDerived: true,
    entryZoneMeasurementExecuted: false,
    nextSection: 'GR-CR-02_ENTRY_ZONE',
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

const directExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (directExecution) {
  const receipt = executeGRCR01IntegratedHarness();
  const outputPath = process.env.H_EARTH_GR_CR_RECEIPT;
  if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt));
  if (!receipt.eligible) process.exitCode = 1;
}

export default H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS;