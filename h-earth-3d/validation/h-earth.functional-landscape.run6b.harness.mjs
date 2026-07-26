import assert from 'node:assert/strict';

import {
  H_EARTH_TERRAIN_FIELD,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_TERRAIN_FORMATIONS,
  evaluateHEarthTerrainFormations
} from '../terrain/h-earth.terrain-formations.js';

import {
  buildHEarthLandscapeRealizationPlan,
  getHEarthFunctionalLandscapeRealizationReceipt
} from '../integration/h-earth.landscape-realization-planner.js';

const first = buildHEarthLandscapeRealizationPlan();
const second = buildHEarthLandscapeRealizationPlan();
const formations = evaluateHEarthTerrainFormations();

assert.equal(H_EARTH_TERRAIN_FIELD.generationRevision, 1);
assert.equal(Object.keys(H_EARTH_TERRAIN_FORMATIONS).length >= 6, true);
assert.equal(
  Object.values(H_EARTH_TERRAIN_FORMATIONS)
    .every((formation) => formation.generationRevision === 2),
  true
);
assert.equal(formations.eligible, true);
assert.equal(first.eligible, true);
assert.equal(first.semanticAddressCount, 256);
assert.equal(first.terrainAddressCount, 124);
assert.equal(first.shorelineWaterAddressCount, 96);
assert.equal(first.proxyAddressCount, 36);
assert.equal(first.physicalChunkCount, 16);
assert.equal(first.terrainChunkCount, 10);
assert.equal(
  first.chunks.every((chunk) => chunk.memberAddressCount === 16),
  true
);
assert.equal(first.deterministicDigest, second.deterministicDigest);

const allAddresses = first.chunks.flatMap((chunk) => chunk.memberAddressIds);
const terrainAddresses = first.chunks.flatMap(
  (chunk) => chunk.terrainMemberAddressIds
);
const shorelineWaterAddresses = first.chunks.flatMap(
  (chunk) => chunk.shorelineWaterMemberAddressIds
);
const proxyAddresses = first.chunks.flatMap(
  (chunk) => chunk.proxyMemberAddressIds
);
assert.equal(allAddresses.length, 256);
assert.equal(new Set(allAddresses).size, 256);
assert.equal(
  new Set([
    ...terrainAddresses,
    ...shorelineWaterAddresses,
    ...proxyAddresses
  ]).size,
  256
);

for (const role of [
  'COASTAL_FOREGROUND_TERRAIN',
  'COASTAL_TO_INLAND_TRANSITION_TERRAIN',
  'SHORELINE_AND_WATER_REALIZATION',
  'INLAND_ELEVATED_TERRAIN_WITH_PROXY_PARTITIONS',
  'DISTANT_OFFSHORE_AND_ATMOSPHERIC_PROXY'
]) {
  assert.equal(
    first.chunks.some((chunk) => chunk.physicalRole === role),
    true
  );
}

assert.equal(
  first.chunks.some((chunk) => chunk.formationClasses.includes('HILL')),
  true
);
assert.equal(
  first.chunks.some((chunk) =>
    chunk.formationClasses.includes('RIDGE_OR_BLUFF')),
  true
);
assert.equal(
  first.chunks.some((chunk) =>
    chunk.formationClasses.includes('VALLEY_OR_DRAINAGE')),
  true
);
assert.equal(
  first.chunks.some((chunk) =>
    chunk.formationClasses.includes('DISTANT_HIGHLAND_OR_MOUNTAIN')),
  true
);

for (const point of [
  [-192, -96],
  [0, -82],
  [72, -172],
  [145, -225],
  [2, -198],
  [192, -244]
]) {
  const sample = sampleHEarthTerrainField(point[0], point[1]);
  assert.equal(sample.valid, true);
  assert.equal(Number.isFinite(sample.elevation), true);
  assert.equal(Number.isFinite(sample.normal.x), true);
  assert.equal(Number.isFinite(sample.normal.y), true);
  assert.equal(Number.isFinite(sample.normal.z), true);
}

const receipt = getHEarthFunctionalLandscapeRealizationReceipt();
assert.equal(receipt.eligible, true);
console.log(JSON.stringify(receipt, null, 2));
