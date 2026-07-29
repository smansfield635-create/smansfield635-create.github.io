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

const WITNESS = freeze({ x: 0, z: -256 });

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS =
  freeze({
    contractId: 'H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS_v1',
    checkpointId: 'GR-CR-01C',
    status: 'ONE_SUCCESSOR_TERRAIN_WITNESS_SAMPLE_ENABLED',
    repositoryPath: '/h-earth-3d/validation/h-earth.gratitude-region.coordinate-reconciliation.harness.mjs',
    controllingInputLedgerPath: '/h-earth-3d/control-plane/region-001-reconciliation/h-earth.gratitude-region.coordinate-reconciliation.input-ledger.v1.json',
    sourceImportsEstablished: true,
    terrainSamplingExecuted: true,
    measurementScope: 'ONE_LOCKED_WITNESS_ONLY',
    candidateCoordinatesDerived: false,
    durableReceiptEmitted: false,
    nextCheckpoint: 'GR-CR-01D_REPEAT_WITNESS_AND_VERIFY_DETERMINISM'
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

export function evaluateGRCR01CWitnessSample() {
  const imports = evaluateGRCR01BLockedImports();
  const sample = sampleHEarthRun8BSuccessorTerrainField(WITNESS.x, WITNESS.z);
  const issues = [...imports.issues];
  if (sample?.valid !== true) issues.push('WITNESS_SAMPLE_INVALID');
  if (!Number.isFinite(sample?.elevation)) issues.push('WITNESS_ELEVATION_NONFINITE');
  if (sample?.contractId !== H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID) issues.push('WITNESS_CONTRACT_ID_MISMATCH');
  return freeze({
    checkpointId: 'GR-CR-01C',
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'GR_CR_01C_WITNESS_SAMPLE_PASS' : 'GR_CR_01C_WITNESS_SAMPLE_FAIL',
    witness: WITNESS,
    sample,
    terrainSamplingExecuted: true,
    measurementScope: 'ONE_LOCKED_WITNESS_ONLY',
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
  const receipt = evaluateGRCR01CWitnessSample();
  const outputPath = process.env.H_EARTH_GR_CR_RECEIPT;
  if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt));
  if (!receipt.eligible) process.exitCode = 1;
}

export default H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_HARNESS;
