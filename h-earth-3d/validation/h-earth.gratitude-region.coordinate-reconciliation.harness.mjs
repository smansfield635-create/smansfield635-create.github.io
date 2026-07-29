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
  checkpointId: 'GR-CR-01D',
  status: 'REPEATED_WITNESS_DETERMINISM_ENABLED',
  sourceImportsEstablished: true,
  terrainSamplingExecuted: true,
  deterministicRepeatEnabled: true,
  candidateCoordinatesDerived: false,
  durableReceiptEmitted: false,
  nextCheckpoint: 'GR-CR-01E_ADD_ELEVATION_AND_GRADIENT_EXTRACTION'
});

export function evaluateGRCR01BLockedImports() {
  const issues = [];
  if (H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.contractId !== H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID) issues.push('SUCCESSOR_TERRAIN_CONTRACT_ID_MISMATCH');
  if (H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.zMinimum !== -320) issues.push('SUCCESSOR_WORLD_DOMAIN_NOT_LOCKED');
  if (!Object.isFrozen(H_EARTH_TERRAIN_FORMATIONS)) issues.push('FORMATION_AUTHORITY_NOT_FROZEN');
  if (H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID.length === 0) issues.push('FORMATION_CONTRACT_ID_MISSING');
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.contractId !== H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID) issues.push('REALIZATION_PLAN_CONTRACT_ID_MISMATCH');
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.eligible !== true) issues.push('REALIZATION_PLAN_NOT_ELIGIBLE');
  return freeze({ eligible: issues.length === 0, issues: freeze(issues) });
}

export function evaluateGRCR01DRepeatedWitnessDeterminism() {
  const imports = evaluateGRCR01BLockedImports();
  const sampleA = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const sampleB = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const serializedA = stable(sampleA);
  const serializedB = stable(sampleB);
  const issues = [...imports.issues];
  if (sampleA?.valid !== true || sampleB?.valid !== true) issues.push('WITNESS_SAMPLE_INVALID');
  if (!Number.isFinite(sampleA?.elevation) || !Number.isFinite(sampleB?.elevation)) issues.push('WITNESS_ELEVATION_NONFINITE');
  if (serializedA !== serializedB) issues.push('REPEATED_WITNESS_NOT_BYTE_STABLE');
  return freeze({
    checkpointId: 'GR-CR-01D',
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'GR_CR_01D_REPEAT_DETERMINISM_PASS' : 'GR_CR_01D_REPEAT_DETERMINISM_FAIL',
    witness: WITNESS,
    firstSample: sampleA,
    secondSample: sampleB,
    repeatedSampleByteStable: serializedA === serializedB,
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
  const receipt = evaluateGRCR01DRepeatedWitnessDeterminism();
  const outputPath = process.env.H_EARTH_GR_CR_RECEIPT;
  if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt));
  if (!receipt.eligible) process.exitCode = 1;
}

export default H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS;
