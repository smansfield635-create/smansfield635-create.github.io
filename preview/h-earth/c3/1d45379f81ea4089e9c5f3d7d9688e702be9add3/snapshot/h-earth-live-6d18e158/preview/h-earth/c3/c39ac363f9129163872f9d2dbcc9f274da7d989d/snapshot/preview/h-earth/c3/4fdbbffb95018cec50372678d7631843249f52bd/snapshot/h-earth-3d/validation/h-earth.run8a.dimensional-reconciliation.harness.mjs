import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_PACKAGE,
  H_EARTH_RUN_8A_OUTPUTS,
  H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION,
  H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION,
  H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION,
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT,
  H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT,
  H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT,
  H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT,
  H_EARTH_RUN_8A_SOUTH_AND_WEST_COMPATIBILITY_MAP,
  H_EARTH_RUN_8A_FUTURE_PACKET_002_PROVENANCE_REQUIREMENTS,
  evaluateHEarthRun8AMountainContribution,
  sampleHEarthRun8ASuccessorTerrainElevation,
  sampleHEarthRun8ASuccessorTerrainField,
  evaluateHEarthRun8AFormerBoundaryContinuity,
  evaluateHEarthRun8AContract
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import {
  H_EARTH_TERRAIN_FIELD,
  sampleHEarthTerrainElevation
} from '../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_TERRAIN_FORMATIONS
} from '../terrain/h-earth.terrain-formations.js';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN
} from '../integration/h-earth.landscape-realization-planner.js';
import {
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  constructHEarthTriangleMesh,
  constructHEarthHeightFieldMesh,
  admitHEarthPrimitiveRecord,
  admitHEarthPrimitiveBatch
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';

const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((key) =>
        `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;

let assertionsPassed = 0;
const check = (condition, message = 'assertion failed') => {
  assert.ok(condition, message);
  assertionsPassed += 1;
};
const equal = (actual, expected, message) => {
  assert.equal(actual, expected, message);
  assertionsPassed += 1;
};

const packet001Source = fs.readFileSync(
  'h-earth-3d/integration/h-earth.source-object-geometry-resolution.js', 'utf8');
const packet002Source = fs.readFileSync(
  'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js', 'utf8');
const proxySource = fs.readFileSync(
  'showroom/globe/h-earth/render/geometry-distant-context.js', 'utf8');
const terrainProviderSource = fs.readFileSync(
  'showroom/globe/h-earth/render/geometry-landscape.js', 'utf8');

const evaluation = evaluateHEarthRun8AContract();
equal(evaluation.eligible, true, `integrated evaluation failed: ${evaluation.issues.join(',')}`);
equal(evaluation.status, 'RUN_8A_DIMENSIONAL_RECONCILIATION_PASS');
equal(H_EARTH_RUN_8A_OUTPUTS.length, 10);
equal(H_EARTH_TERRAIN_FIELD.worldDomain.zMinimum, -256);
equal(H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.zMinimum, -320);
equal(H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.zMaximum, 64);
equal(H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.xMinimum, -256);
equal(H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.xMaximum, 256);

const predecessor = H_EARTH_TERRAIN_FORMATIONS.DISTANT_HIGHLAND_001;
equal(predecessor.formationId, 'H_EARTH_DISTANT_HIGHLAND_001');
equal(predecessor.fullRealizationEligibility, false);
equal(predecessor.proxyRealizationEligibility, true);
equal(predecessor.navigationClass, 'NON_NAVIGABLE_PROXY_ONLY');
equal(H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.predecessorDisposition,
  'PRESERVE_CURRENT_BASELINE_AND_HISTORY');
equal(H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.inPlaceReclassification,
  'PROHIBITED');
equal(H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.successorFormationId,
  'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001');
equal(H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.fullRealizationEligibility, true);
equal(H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.proxyRealizationEligibility, true);
equal(H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.continuousGeometryImpliesUniversalNavigability, false);

const proxyBand = H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks.find(
  (chunk) => chunk.realizationState === 'DISTANT_PROXY' &&
    chunk.worldBounds.zMin === -320 && chunk.worldBounds.zMax === -256
);
check(Boolean(proxyBand), 'existing -320 to -256 proxy band must remain established');
check(packet001Source.includes('PACKET_001_WET_SAND_ONLY'));
check(packet001Source.includes('This packet supports only wetSand'));
check(packet001Source.includes('OBJ_002_FOREGROUND_WET_SAND'));
equal(H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION.packet001.universalResolver, false);
equal(H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION.packet001.successorMountainDisposition,
  'NEW_PACKET_001_STYLE_FORMATION_RESOLUTION_LANE_REQUIRED');
equal(H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION.packet002.shapeDefinitionAuthority, false);
equal(H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION.packet002.successorDisposition,
  'NEW_NARROW_SUCCESSOR_POST_WEST_TRANSFER_LANE_REQUIRED');
check(packet002Source.includes('EXPECTED_PREVIEW_CONTRACT_ID'));
check(packet002Source.includes('EXPECTED_SHORELINE_PREVIEW_CONTRACT_ID'));
check(!packet002Source.includes('H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001'));

check(proxySource.includes('const sampleCount = 17'));
check(proxySource.includes('DISTANT_HIGHLAND_OR_MOUNTAIN_PROXY'));
check(proxySource.includes('OPEN_ALLOWED'));
check(terrainProviderSource.includes('samplesPerAxis: 9'));
equal(H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.currentBaseline.samplesPerAxis, 9);
equal(H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.profiles.FULL_DETAIL.baseSpacingWorldUnits, 4);
equal(H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.profiles.FULL_DETAIL.refinementSpacingWorldUnits, 2);

check(typeof constructHEarthTriangleMesh === 'function');
check(typeof constructHEarthHeightFieldMesh === 'function');
check(typeof admitHEarthPrimitiveRecord === 'function');
check(typeof admitHEarthPrimitiveBatch === 'function');
check(typeof H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID === 'string');
check(typeof H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID === 'string');
check(typeof H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID === 'string');
check(typeof H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID === 'string');
equal(H_EARTH_RUN_8A_SOUTH_AND_WEST_COMPATIBILITY_MAP.south.status,
  'COMPATIBLE_NO_KERNEL_RENEWAL_REQUIRED');
equal(H_EARTH_RUN_8A_SOUTH_AND_WEST_COMPATIBILITY_MAP.west.status,
  'COMPATIBLE_NO_ADMISSION_RENEWAL_REQUIRED');

const continuity = evaluateHEarthRun8AFormerBoundaryContinuity({
  xSamples: Array.from({ length: 33 }, (_, index) => -256 + index * 16),
  epsilon: 0.01
});
equal(continuity.eligible, true,
  `continuity failed: C0=${continuity.maximumHeightDiscontinuity}, C1=${continuity.maximumGradientDiscontinuity}`);
check(continuity.maximumHeightDiscontinuity <= continuity.c0Tolerance);
check(continuity.maximumGradientDiscontinuity <= continuity.c1Tolerance);
continuity.samples.forEach((sample) => {
  check(Number.isFinite(sample.center));
  check(Number.isFinite(sample.north));
  check(Number.isFinite(sample.south));
  check(sample.heightDiscontinuity <= continuity.c0Tolerance);
  check(sample.gradientDiscontinuity <= continuity.c1Tolerance);
});

let gridSamples = 0;
let maximumElevation = Number.NEGATIVE_INFINITY;
let minimumElevation = Number.POSITIVE_INFINITY;
let maximumMountainContribution = 0;
for (let worldX = -256; worldX <= 256; worldX += 16) {
  for (let worldZ = -320; worldZ <= 64; worldZ += 8) {
    const sample = sampleHEarthRun8ASuccessorTerrainField(worldX, worldZ);
    gridSamples += 1;
    equal(sample.valid, true);
    check(Number.isFinite(sample.elevation));
    check(Number.isFinite(sample.gradient.x));
    check(Number.isFinite(sample.gradient.z));
    check(Number.isFinite(sample.normal.x));
    check(Number.isFinite(sample.normal.y));
    check(Number.isFinite(sample.normal.z));
    check(Math.abs(Math.hypot(sample.normal.x, sample.normal.y, sample.normal.z) - 1) <= 1e-9);
    check(sample.world.x === worldX && sample.world.z === worldZ);
    check(['SUCCESSOR_EXTENSION_REGION',
      'LEGACY_DOMAIN_WITH_SUCCESSOR_FORMATION_SPECIALIZATION']
      .includes(sample.domainRegion));
    maximumElevation = Math.max(maximumElevation, sample.elevation);
    minimumElevation = Math.min(minimumElevation, sample.elevation);
    maximumMountainContribution = Math.max(maximumMountainContribution, sample.mountainContribution);
  }
}
equal(gridSamples, 1617);
check(maximumMountainContribution > 60);
check(maximumElevation > 80);
check(minimumElevation > -30);
check(maximumElevation < 150);

equal(evaluateHEarthRun8AMountainContribution(200, -270), 0);
equal(evaluateHEarthRun8AMountainContribution(-96, -319), 0);
equal(evaluateHEarthRun8AMountainContribution(-96, -210), 0);
const depthSeries = [-304, -288, -272, -256, -240, -224]
  .map((worldZ) => evaluateHEarthRun8AMountainContribution(-96, worldZ));
check(new Set(depthSeries.map((value) => value.toFixed(6))).size >= 5);
check(depthSeries.some((value) => value > 60));
check(sampleHEarthRun8ASuccessorTerrainElevation(-96, -300) !==
  sampleHEarthTerrainElevation(-96, -300));
check(Number.isNaN(sampleHEarthRun8ASuccessorTerrainElevation(-96, -321)));
check(Number.isNaN(sampleHEarthRun8ASuccessorTerrainElevation(257, -270)));

equal(H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.requiresMultipleZBands, true);
equal(H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.requiresGroundConnection, true);
equal(H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.independentProxyShapeInvention,
  'PROHIBITED');
equal(H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
  .worldAnchorLaw.cameraRelativePosition, 'PROHIBITED');
equal(H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
  .worldAnchorLaw.screenRelativePosition, 'PROHIBITED');
equal(H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
  .worldAnchorLaw.sameWorldToCameraTransformAsTerrain, 'REQUIRED');
equal(Object.keys(H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT
  .archetypes).length, 3);
check(H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.requiredInputs.includes('WORLD_NORMAL'));
check(H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.requiredInputs.includes('SUN_DIRECTION_NORMALIZED'));
check(H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.requiredOutputs.includes('DISTANCE_HAZE_FACTOR'));
equal(H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.laws.flatColorAsDepthSubstitute,
  'PROHIBITED');

[
  'PREDECESSOR_FORMATION_ID', 'SUCCESSOR_FORMATION_ID', 'TERRAIN_FIELD_REVISION',
  'DIMENSIONAL_CONTRACT_ID', 'SAMPLING_PROFILE_ID', 'TOPOLOGY_PROFILE_ID',
  'NORMAL_PROFILE_ID', 'FULL_OR_PROXY_REALIZATION_CLASS',
  'GEOMETRY_CONSTRUCTION_RECEIPT', 'WEST_ADMISSION_IDENTITY'
].forEach((field) => check(
  H_EARTH_RUN_8A_FUTURE_PACKET_002_PROVENANCE_REQUIREMENTS.requiredFields.includes(field),
  `missing provenance field ${field}`
));
equal(H_EARTH_RUN_8A_PACKAGE.stoppingBoundary.run8BConstructionAuthorized, false);
equal(H_EARTH_RUN_8A_PACKAGE.stoppingBoundary.publicVisualClaimAuthorized, false);
equal(H_EARTH_RUN_8A_PACKAGE.stoppingBoundary.routeMutationAuthorized, false);
equal(H_EARTH_RUN_8A_PACKAGE.stoppingBoundary.deploymentAuthorized, false);

const deterministicDigest = crypto.createHash('sha256')
  .update(stable(H_EARTH_RUN_8A_PACKAGE))
  .digest('hex');
check(/^[a-f0-9]{64}$/.test(deterministicDigest));

const receipt = {
  receiptType: 'H_EARTH_RUN_8A_DIMENSIONAL_RECONCILIATION_RECEIPT',
  eligible: true,
  status: 'RUN_8A_PASS_CLOSED',
  contractId: H_EARTH_RUN_8A_CONTRACT_ID,
  parentCommit: 'bb1273ecad6ad1441555e035a58d2ae7a1c3dc91',
  workspaceBranch: 'agent/h-earth-run8a-dimensional-reconciliation-001',
  outputCount: H_EARTH_RUN_8A_OUTPUTS.length,
  assertionsPassed,
  gridSamples,
  currentTerrainZMinimum: H_EARTH_TERRAIN_FIELD.worldDomain.zMinimum,
  successorTerrainZMinimum:
    H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.zMinimum,
  maximumHeightDiscontinuity: continuity.maximumHeightDiscontinuity,
  maximumGradientDiscontinuity: continuity.maximumGradientDiscontinuity,
  minimumElevation,
  maximumElevation,
  maximumMountainContribution,
  deterministicDigest,
  legacyProxyPreserved: true,
  successorContinuousMountainAuthorized: true,
  packet001SuccessorLaneRequired: true,
  packet002SuccessorLaneRequired: true,
  southKernelRenewalRequired: false,
  westAdmissionRenewalRequired: false,
  run8BConstructionAuthority: 'WITHHELD_PENDING_RUN_8A_PASS',
  publicVisualClaim: false,
  localConstruction: false,
  productFilesChanged: 0,
  issues: []
};

if (process.env.H_EARTH_RUN8A_RECEIPT) {
  fs.writeFileSync(process.env.H_EARTH_RUN8A_RECEIPT,
    `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
}
console.log(JSON.stringify(receipt, null, 2));
