import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Source-only Stage A checks. These do NOT constitute GLSL compilation,
// camera screenshots, physical-device validation or owner acceptance.
const renderPath = new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js', import.meta.url);
const terrainPath = new URL('../terrain/h-earth.terrain-field.js', import.meta.url);
const surfacePath = new URL('../environment/h-earth.successor-surface-material.run8c.js', import.meta.url);
const source = readFileSync(renderPath, 'utf8');
const terrainBytes = readFileSync(terrainPath);
const surfaceBytes = readFileSync(surfacePath);
const blob = value => createHash('sha1').update('blob ' + value.byteLength + '\0').update(value).digest('hex');
const begin = '// H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN';
const end = '// H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_END';
const occurrences = token => source.split(token).length - 1;

test('Stage A patch is one bounded real terrain shader insertion', () => {
  assert.equal(occurrences(begin), 1);
  assert.equal(occurrences(end), 1);
  assert.ok(source.indexOf(begin) < source.indexOf(end));
  assert.ok(source.indexOf('if(worldSoilTerrain)') < source.indexOf(begin));
  assert.ok(source.indexOf(end) < source.indexOf('base=palette;', source.indexOf(begin)));
  assert.match(source, /bool worldSoilTerrain=geologicalEarthRock\|\|vRoleCode==1u\|\|/);
  const stage = source.slice(source.indexOf(begin), source.indexOf(end));
  assert.match(stage, /if\(!geologicalEarthRock\)/);
  assert.match(stage, /inlandIdentity=smoothstep\(/);
  assert.match(stage, /protectedGrove=1\.0-smoothstep\(/);
  assert.match(stage, /identityWeight=inlandIdentity\*/);
  assert.match(stage, /palette=mix\(palette,identityBase,identityWeight\)/);
});

test('Visible ground identities use spatially continuous material mechanisms', () => {
  const stage = source.slice(source.indexOf(begin), source.indexOf(end));
  for (const signal of [
    'vCoastDistanceMeters', 'vWorldPosition.y',
    'macroField', 'mesoField', 'detailField',
    'rockExposure', 'slopeResponse', 'materialVariation',
    'shelteredBasin', 'fertilePatch', 'upperDry', 'mineralExposure'
  ]) assert.ok(stage.includes(signal), 'missing signal ' + signal);
  for (const material of [
    'compactEarth', 'coastalSilt', 'fertileEarth',
    'shelteredEarth', 'dryFoothill', 'erodedMineral'
  ]) assert.match(stage, new RegExp('vec3 ' + material + '=vec3\\('));
  assert.ok(stage.includes('not a claim of a new freshwater river'));
});

test('Approved real soil image and independent native shoreline/woodland/plant presentation survive', () => {
  for (const token of [
    'H_EARTH_ACTUAL_WORLD_SOIL_MATERIAL_20261010_V2',
    'vec3 worldSoilReference=pow(worldSoilTexel,vec3(2.2))*0.75;',
    'uClearingSoil,worldSoilXZ*0.28',
    'worldSoilAlbedoAuthority',
    '// SHORELINE_SOIL_BEGIN shade',
    'uShorelineSoilCoverage',
    'uWoodlandHabitatEnabled==1',
    'uLandscapeFloorFootprints',
    'vRoleCode==4u',
    'WOODLAND_FINE_GRASS_FS',
    'RENDERED_BEACH_GLSL'
  ]) assert.ok(source.includes(token), 'protected renderer marker missing: ' + token);
});

test('Stage A does not alter canonical B2 terrain or successor material source bytes', () => {
  assert.equal(blob(terrainBytes), '71a95053892140d792573587a6b82798663e3df1');
  assert.equal(blob(surfaceBytes), 'a510fa1da1a5d1852153c9d22d2df4f2a4d4efde');
});

// Next gates: WebGL2 shader link, actual source-to-pixel comparison, mobile
// performance and root/vegetation identity, then owner KEEP|ONE_REPAIR|REJECT.
