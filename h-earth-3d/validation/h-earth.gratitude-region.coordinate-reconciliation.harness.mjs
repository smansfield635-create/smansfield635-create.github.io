import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';
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
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const WITNESS = freeze({ x: 0, z: -256 });
const FORMATION_WITNESS = freeze({ x: 72, z: -172 });
const ADDRESS_WITNESS = FORMATION_WITNESS;

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS_v1',
  checkpointId: 'GR-CR-01H',
  status: 'SEMANTIC_ADDRESS_PROJECTION_ENABLED',
  sourceImportsEstablished: true,
  terrainSamplingExecuted: true,
  terrainMetricExtractionEnabled: true,
  formationMembershipResolutionEnabled: true,
  semanticAddressProjectionEnabled: true,
  semanticRowsTreatedAsLiteralWorldZ: false,
  candidateCoordinatesDerived: false,
  durableReceiptEmitted: false,
  nextCheckpoint: 'GR-CR-01I_ADD_CONNECTED_SURFACE_SEARCH'
});

function importIssues() {
  const issues = [];
  if (H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.contractId !== H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID) issues.push('SUCCESSOR_TERRAIN_CONTRACT_ID_MISMATCH');
  if (H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.zMinimum !== -320) issues.push('SUCCESSOR_WORLD_DOMAIN_NOT_LOCKED');
  if (!Object.isFrozen(H_EARTH_TERRAIN_FORMATIONS)) issues.push('FORMATION_AUTHORITY_NOT_FROZEN');
  if (H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID.length === 0) issues.push('FORMATION_CONTRACT_ID_MISSING');
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.contractId !== H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID) issues.push('REALIZATION_PLAN_CONTRACT_ID_MISMATCH');
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.eligible !== true) issues.push('REALIZATION_PLAN_NOT_ELIGIBLE');
  return issues;
}

export function extractGRCRTerrainMetrics(worldX, worldZ) {
  const sample = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (sample?.valid !== true) return freeze({ valid: false, worldX, worldZ });
  return freeze({ valid: true, contractId: sample.contractId, world: sample.world, elevation: sample.elevation, gradient: freeze({ x: sample.gradient.x, z: sample.gradient.z }), slope: sample.slope, curvature: sample.curvature, normal: sample.normal });
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
  return freeze({
    valid: true,
    status: 'SEMANTIC_ADDRESS_PROJECTED',
    world: freeze({ x: worldX, z: worldZ }),
    chunkId: chunk.chunkId,
    physicalRole: chunk.physicalRole,
    formationIds: chunk.formationIds,
    selectedSemanticAddressId: selected.address,
    targetSemanticCoordinate: freeze({ row: targetRow, column: targetColumn }),
    projectionModel: 'CHUNK_LOCAL_NEAREST_AVAILABLE_TERRAIN_MEMBER'
  });
}

export function evaluateGRCR01HSemanticProjection() {
  const sampleA = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const sampleB = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const metrics = extractGRCRTerrainMetrics(WITNESS.x, WITNESS.z);
  const membership = resolveGRCRFormationMembership(FORMATION_WITNESS.x, FORMATION_WITNESS.z);
  const projection = resolveGRCRSemanticAddressProjection(ADDRESS_WITNESS.x, ADDRESS_WITNESS.z);
  const issues = importIssues();
  if (sampleA?.valid !== true || sampleB?.valid !== true) issues.push('WITNESS_SAMPLE_INVALID');
  if (stable(sampleA) !== stable(sampleB)) issues.push('REPEATED_WITNESS_NOT_BYTE_STABLE');
  if (metrics.valid !== true) issues.push('TERRAIN_METRICS_EXTRACTION_INVALID');
  if (!membership.formationIds.includes('H_EARTH_NAVIGABLE_HILL_001')) issues.push('HILL_FORMATION_WITNESS_NOT_RESOLVED');
  if (projection.valid !== true) issues.push('SEMANTIC_PROJECTION_INVALID');
  if (projection.targetSemanticCoordinate?.row !== 6 || projection.targetSemanticCoordinate?.column !== 11) issues.push('SEMANTIC_PROJECTION_TARGET_UNEXPECTED');
  if (!String(projection.selectedSemanticAddressId).endsWith(':R06:C11')) issues.push('SEMANTIC_ADDRESS_WITNESS_UNEXPECTED');
  return freeze({
    checkpointId: 'GR-CR-01H',
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'GR_CR_01H_SEMANTIC_PROJECTION_PASS' : 'GR_CR_01H_SEMANTIC_PROJECTION_FAIL',
    witness: WITNESS,
    addressWitness: ADDRESS_WITNESS,
    projection,
    semanticRowsTreatedAsLiteralWorldZ: false,
    candidateCoordinatesDerived: false,
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
  const receipt = evaluateGRCR01HSemanticProjection();
  const outputPath = process.env.H_EARTH_GR_CR_RECEIPT;
  if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt));
  if (!receipt.eligible) process.exitCode = 1;
}

export default H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS;
