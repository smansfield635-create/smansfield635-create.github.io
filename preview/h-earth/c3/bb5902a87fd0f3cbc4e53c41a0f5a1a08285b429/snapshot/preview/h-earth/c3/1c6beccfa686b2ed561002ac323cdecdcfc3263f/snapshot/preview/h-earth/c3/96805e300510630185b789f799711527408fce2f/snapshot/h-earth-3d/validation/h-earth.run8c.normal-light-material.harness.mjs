import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  H_EARTH_SURFACE_CLASSES
} from '../environment/h-earth.surface-state-field.js';

import {
  getHEarthRun8CMaterialPrototypeMap,
  sampleHEarthRun8CSuccessorSurfaceMaterial,
  evaluateHEarthRun8CSuccessorSurfaceMaterial
} from '../environment/h-earth.successor-surface-material.run8c.js';

import {
  sampleHEarthAtmosphereState
} from '../environment/h-earth.atmosphere-state.js';

import {
  H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
  evaluateHEarthRun8CControlContract
} from '../control-plane/run-8/h-earth.run8c.normal-light-material.js';

import {
  evaluateHEarthRun8B
} from '../control-plane/run-8/h-earth.run8b.successor-neutral-geometry.js';

import {
  constructHEarthRun8BSuccessorTerrainAndMountain
} from '../../showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';

import {
  buildHEarthAtmospherePresentation
} from '../../showroom/globe/h-earth/render/environment-atmosphere.js';

import {
  H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID,
  buildHEarthRun8CTerrainMaterialLightingPresentation,
  evaluateHEarthRun8CTerrainMaterialLightingPresentation,
  projectHEarthRun8CVertexMaterialLighting
} from '../../showroom/globe/h-earth/render/lighting-material-successor-terrain.run8c.js';

let assertionsPassed = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertionsPassed += 1;
};
const near = (actual, expected, tolerance, message) => {
  assert.ok(Number.isFinite(actual), `${message}: actual must be finite`);
  assert.ok(Math.abs(actual - expected) <= tolerance,
    `${message}: expected ${expected}, received ${actual}`);
  assertionsPassed += 2;
};
const digest = (value) => crypto.createHash('sha256')
  .update(JSON.stringify(value))
  .digest('hex');

const control = evaluateHEarthRun8CControlContract();
check(control.eligible === true, `Run 8C control contract failed: ${control.issues.join(',')}`);
check(control.contractId === H_EARTH_RUN_8C_CONTROL_CONTRACT_ID, 'Run 8C control identity mismatch');

const run8B = evaluateHEarthRun8B();
check(run8B.eligible === true, `Run 8B predecessor failed: ${run8B.issues.join(',')}`);
check(run8B.run8CStatus === 'AUTHORIZED_BY_RUN_8B_PASS', 'Run 8C must be authorized by Run 8B');

const prototypes = getHEarthRun8CMaterialPrototypeMap();
for (const surfaceClass of H_EARTH_SURFACE_CLASSES) {
  check(Boolean(prototypes[surfaceClass]), `Run 7B prototype missing for ${surfaceClass}`);
  check(prototypes[surfaceClass].sourceSurfaceClass === surfaceClass,
    `Prototype class mismatch for ${surfaceClass}`);
}

const mountainMaterial = sampleHEarthRun8CSuccessorSurfaceMaterial(-96, -270);
check(evaluateHEarthRun8CSuccessorSurfaceMaterial(mountainMaterial).eligible === true,
  'Mountain successor material sample must pass');
check(mountainMaterial.surfaceClass === 'STONE_AND_SPARSE_SOIL',
  'Mountain core must resolve as stone and sparse soil');
check(mountainMaterial.mountainContribution > 20,
  'Mountain core material sample must preserve successor mountain mass');

const coastMaterial = sampleHEarthRun8CSuccessorSurfaceMaterial(0, -90);
check(evaluateHEarthRun8CSuccessorSurfaceMaterial(coastMaterial).eligible === true,
  'Coastal successor material sample must pass');
check(['WET_SAND', 'DRY_SAND'].includes(coastMaterial.surfaceClass),
  'Coastal witness must resolve to a sand material class');

const geometryBefore = constructHEarthRun8BSuccessorTerrainAndMountain();
check(geometryBefore.ok === true, 'Run 8B geometry must construct before Run 8C');
const geometryDigestBefore = digest(geometryBefore.primitive);

const cameraWorld = { x: 0, y: 26, z: 48 };
const day = buildHEarthRun8CTerrainMaterialLightingPresentation({
  timeOfDayHours: 15.25,
  cameraWorld,
  viewportWidth: 640,
  viewportHeight: 360,
  cameraFarPlane: 768
});
const dayEvaluation = evaluateHEarthRun8CTerrainMaterialLightingPresentation(day);
check(dayEvaluation.eligible === true, `Day presentation failed: ${dayEvaluation.issues.join(',')}`);
check(day.contractId === H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID,
  'Run 8C presentation identity mismatch');
check(day.sunDisc.visible === true, 'Day sun disc must be visibly represented');
check(['DAY_LOW_SUN', 'DAY_HIGH_SUN'].includes(day.timeOfDayPhase),
  'Day phase must be classified as daylight');
check(day.vertexAttributeCount === geometryBefore.primitive.geometry.vertices.length,
  'Every Run 8B vertex must receive a Run 8C presentation attribute');
check(day.summary.surfaceClassCount >= 5,
  'Run 8C must preserve broad material class differentiation');
check(day.summary.classCounts.STONE_AND_SPARSE_SOIL > 0,
  'Run 8C must materialize mountain stone response');
check(day.summary.classCounts.WET_SAND > 0,
  'Run 8C must materialize wet-sand response');
check(day.summary.diffuseRange > 0.05,
  'World normals must produce nontrivial diffuse variation');
check(day.summary.luminanceRange > 5,
  'Material and light response must produce nontrivial luminance variation');
check(day.summary.hazeRange > 0,
  'Camera distance must produce atmospheric depth variation');

for (const attribute of day.vertexAttributes) {
  check(attribute.eligible === true, `Vertex ${attribute.index} must be eligible`);
  check(attribute.finalColorRgba.length === 4, `Vertex ${attribute.index} final RGBA missing`);
  check(attribute.finalColorRgba.every((channel) =>
    Number.isInteger(channel) && channel >= 0 && channel <= 255),
  `Vertex ${attribute.index} final color invalid`);
  check(attribute.diffuseLightFactor >= 0 && attribute.diffuseLightFactor <= 1,
    `Vertex ${attribute.index} diffuse factor invalid`);
  check(attribute.ambientLightFactor > 0 && attribute.ambientLightFactor <= 1,
    `Vertex ${attribute.index} ambient factor invalid`);
  check(attribute.slopeShadeFactor > 0 && attribute.slopeShadeFactor <= 1,
    `Vertex ${attribute.index} slope factor invalid`);
  check(attribute.curvatureOcclusionFactor > 0 &&
    attribute.curvatureOcclusionFactor <= 1,
  `Vertex ${attribute.index} curvature factor invalid`);
  check(attribute.wetnessResponse > 0 && attribute.wetnessResponse <= 1,
    `Vertex ${attribute.index} wetness response invalid`);
  check(attribute.roughnessResponse > 0 && attribute.roughnessResponse <= 1,
    `Vertex ${attribute.index} roughness response invalid`);
  check(attribute.reflectanceResponse >= 0 && attribute.reflectanceResponse <= 1,
    `Vertex ${attribute.index} reflectance response invalid`);
  check(attribute.distanceHazeFactor >= 0 && attribute.distanceHazeFactor <= 1,
    `Vertex ${attribute.index} haze factor invalid`);
  check(attribute.cameraDistance >= 0, `Vertex ${attribute.index} camera distance invalid`);
}

const sortedByDistance = [...day.vertexAttributes]
  .sort((left, right) => left.cameraDistance - right.cameraDistance);
const quartileSize = Math.max(1, Math.floor(sortedByDistance.length / 4));
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const nearHazeMean = mean(sortedByDistance.slice(0, quartileSize)
  .map((attribute) => attribute.distanceHazeFactor));
const farHazeMean = mean(sortedByDistance.slice(-quartileSize)
  .map((attribute) => attribute.distanceHazeFactor));
check(farHazeMean > nearHazeMean,
  'Far terrain must carry more atmospheric haze than near terrain');

const uniqueMaterialProfiles = new Set(day.vertexAttributes
  .map((attribute) => attribute.materialProfileId));
const uniqueFinalColors = new Set(day.vertexAttributes
  .map((attribute) => attribute.finalColorRgba.join(',')));
check(uniqueMaterialProfiles.size >= 5,
  'Run 8C must preserve at least five material profile identities');
check(uniqueFinalColors.size >= 128,
  'Normal, material and atmospheric response must not collapse to flat colors');

const night = buildHEarthRun8CTerrainMaterialLightingPresentation({
  timeOfDayHours: 1,
  cameraWorld,
  viewportWidth: 640,
  viewportHeight: 360,
  cameraFarPlane: 768
});
const nightEvaluation = evaluateHEarthRun8CTerrainMaterialLightingPresentation(night);
check(nightEvaluation.eligible === true, `Night presentation failed: ${nightEvaluation.issues.join(',')}`);
check(night.timeOfDayPhase === 'NIGHT', 'Night phase must be established');
check(night.sunDisc.visible === false, 'Night sun disc must not be visible');
check(day.summary.meanLuminance > night.summary.meanLuminance + 8,
  'Day and night material lighting must be visibly differentiated');
check(JSON.stringify(day.skyGradientStops) !== JSON.stringify(night.skyGradientStops),
  'Day and night sky presentation must differ');

const dawnAtmosphere = sampleHEarthAtmosphereState({
  timeOfDayHours: 7,
  observerElevation: cameraWorld.y,
  viewDistance: 768
});
const dawnPresentation = buildHEarthAtmospherePresentation(dawnAtmosphere, {
  viewportWidth: 640,
  viewportHeight: 360,
  cameraFarPlane: 768
});
check(dawnAtmosphere.timeOfDay.phase === 'TWILIGHT' ||
  dawnAtmosphere.timeOfDay.phase === 'DAY_LOW_SUN',
'Dawn atmosphere must resolve a low-sun transition state');
check(dawnPresentation.eligible === true, 'Dawn atmosphere presentation must pass');
check(dawnPresentation.sunDisc.visible === true,
  'Dawn/low-sun state must provide a visible sun disc when intensity is positive');

const mountainVertexIndex = day.vertexAttributes.reduce((best, attribute, index) => {
  const distance = Math.hypot(attribute.world.x + 96, attribute.world.z + 270);
  return distance < best.distance ? { index, distance } : best;
}, { index: -1, distance: Infinity }).index;
check(mountainVertexIndex >= 0, 'Mountain presentation witness must resolve');
const dayMountain = day.vertexAttributes[mountainVertexIndex];
const nightMountain = night.vertexAttributes[mountainVertexIndex];
check(dayMountain.surfaceClass === 'STONE_AND_SPARSE_SOIL',
  'Mountain presentation witness must preserve stone material identity');
check(dayMountain.finalColorRgba.join(',') !== nightMountain.finalColorRgba.join(','),
  'Mountain form must respond differently to day and night light');

const directProjection = projectHEarthRun8CVertexMaterialLighting({
  world: mountainMaterial.world,
  normal: mountainMaterial.normal,
  surfaceMaterial: mountainMaterial,
  atmosphereState: sampleHEarthAtmosphereState({
    timeOfDayHours: 15.25,
    observerElevation: cameraWorld.y,
    viewDistance: 768
  }),
  cameraWorld
});
check(directProjection.eligible === true,
  'Direct mountain normal/light/material projection must pass');
near(directProjection.world.y, mountainMaterial.world.y, 1e-12,
  'Direct projection must preserve successor world elevation');

const repeatDay = buildHEarthRun8CTerrainMaterialLightingPresentation({
  timeOfDayHours: 15.25,
  cameraWorld,
  viewportWidth: 640,
  viewportHeight: 360,
  cameraFarPlane: 768
});
const dayDigest = digest(day);
const repeatDigest = digest(repeatDay);
check(dayDigest === repeatDigest, 'Run 8C repeat execution must be deterministic');

const geometryAfter = constructHEarthRun8BSuccessorTerrainAndMountain();
const geometryDigestAfter = digest(geometryAfter.primitive);
check(geometryDigestBefore === geometryDigestAfter,
  'Run 8C must not mutate the Run 8B neutral primitive');

for (const flag of [
  day.sourceNeutralPrimitiveMutated,
  day.rendererMutation,
  day.geometryMutation,
  day.WestAdmissionExecuted,
  day.packet002TransferExecuted,
  day.vegetationInstanceConstruction,
  day.publicRouteMutation,
  day.deployment,
  day.visualImprovementClaim
]) {
  check(flag === false, 'Run 8C stopping boundary must remain false');
}

const receipt = {
  receiptType: 'H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_RECEIPT',
  eligible: true,
  status: 'RUN_8C_PASS_CLOSED',
  contractId: H_EARTH_RUN_8C_CONTROL_CONTRACT_ID,
  normalLightMaterialContractId: H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_CONTRACT_ID,
  parentCommit: 'f3375d629633bbdadcbebcd91f2dc19796e366e1',
  workspaceBranch: 'agent/h-earth-run8c-normal-light-material-001',
  sourcePrimitiveId: day.sourcePrimitiveId,
  vertexAttributeCount: day.vertexAttributeCount,
  surfaceClassCount: day.summary.surfaceClassCount,
  materialProfileCount: uniqueMaterialProfiles.size,
  uniqueFinalColorCount: uniqueFinalColors.size,
  minimumDiffuse: day.summary.minimumDiffuse,
  maximumDiffuse: day.summary.maximumDiffuse,
  diffuseRange: day.summary.diffuseRange,
  minimumLuminance: day.summary.minimumLuminance,
  maximumLuminance: day.summary.maximumLuminance,
  meanDayLuminance: day.summary.meanLuminance,
  meanNightLuminance: night.summary.meanLuminance,
  minimumHaze: day.summary.minimumHaze,
  maximumHaze: day.summary.maximumHaze,
  nearHazeMean,
  farHazeMean,
  daySunDiscVisible: day.sunDisc.visible,
  nightSunDiscVisible: night.sunDisc.visible,
  dawnSunDiscVisible: dawnPresentation.sunDisc.visible,
  dayNightDifferentiation: true,
  normalDrivenVariation: day.summary.diffuseRange > 0.05,
  materialDifferentiation: uniqueMaterialProfiles.size >= 5,
  distanceHazeMonotonic: farHazeMean > nearHazeMean,
  successorMountainMaterialized: day.summary.classCounts.STONE_AND_SPARSE_SOIL > 0,
  run8BNeutralPrimitivePreserved: geometryDigestBefore === geometryDigestAfter,
  deterministicRepeatExecution: dayDigest === repeatDigest,
  deterministicDigest: dayDigest,
  assertionsPassed,
  materialAndLightingPresentation: true,
  rendererMutation: false,
  geometryMutation: false,
  WestAdmissionExecuted: false,
  packet002TransferExecuted: false,
  vegetationInstanceConstruction: false,
  publicRouteMutation: false,
  deployment: false,
  publicVisualImprovementClaim: false,
  localConstruction: false,
  run8DStatus: 'AUTHORIZED_BY_RUN_8C_PASS',
  issues: []
};

const output = process.env.H_EARTH_RUN8C_RECEIPT;
if (output) fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt));
