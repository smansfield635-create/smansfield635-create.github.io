import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';
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
const WITNESS = freeze({ x: 0, z: -256 });

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS = freeze({
  contractId: 'H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS_v1',
  checkpointId: 'GR-CR-01F',
  status: 'SLOPE_AND_CURVATURE_EXTRACTION_ENABLED',
  sourceImportsEstablished: true,
  terrainSamplingExecuted: true,
  elevationGradientExtractionEnabled: true,
  slopeCurvatureExtractionEnabled: true,
  candidateCoordinatesDerived: false,
  durableReceiptEmitted: false,
  nextCheckpoint: 'GR-CR-01G_ADD_FORMATION_MEMBERSHIP_RESOLUTION'
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
  return freeze({
    valid: true,
    contractId: sample.contractId,
    world: sample.world,
    elevation: sample.elevation,
    gradient: freeze({ x: sample.gradient.x, z: sample.gradient.z }),
    slope: sample.slope,
    curvature: sample.curvature,
    normal: sample.normal
  });
}

export function evaluateGRCR01FSlopeCurvatureExtraction() {
  const sampleA = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const sampleB = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const metrics = extractGRCRTerrainMetrics(WITNESS.x, WITNESS.z);
  const issues = importIssues();
  if (sampleA?.valid !== true || sampleB?.valid !== true) issues.push('WITNESS_SAMPLE_INVALID');
  if (stable(sampleA) !== stable(sampleB)) issues.push('REPEATED_WITNESS_NOT_BYTE_STABLE');
  if (metrics.valid !== true) issues.push('TERRAIN_METRICS_EXTRACTION_INVALID');
  for (const value of [metrics.elevation, metrics.gradient?.x, metrics.gradient?.z, metrics.slope, metrics.curvature]) {
    if (!Number.isFinite(value)) issues.push('TERRAIN_METRIC_NONFINITE');
  }
  return freeze({
    checkpointId: 'GR-CR-01F',
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'GR_CR_01F_SLOPE_CURVATURE_PASS' : 'GR_CR_01F_SLOPE_CURVATURE_FAIL',
    witness: WITNESS,
    metrics,
    repeatedSampleByteStable: stable(sampleA) === stable(sampleB),
    terrainSamplingExecuted: true,
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
  const receipt = evaluateGRCR01FSlopeCurvatureExtraction();
  const outputPath = process.env.H_EARTH_GR_CR_RECEIPT;
  if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt));
  if (!receipt.eligible) process.exitCode = 1;
}

export default H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS;
