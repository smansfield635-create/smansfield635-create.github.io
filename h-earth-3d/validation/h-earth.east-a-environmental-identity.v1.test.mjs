import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { sampleHEarthTerrainElevation } from '../terrain/h-earth.terrain-field.js';

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

// Qualified product boundary: the published Gen2666 mesh was not rebaked
// after the B2 canonical sampler changed. A passing witness verifies the
// discrepancy; it is NOT permission to use a second runtime elevation law.
test('B2 precomputed height identity mismatch is detected before Stage B', () => {
  const binary = new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz', import.meta.url);
  const precomputed = JSON.parse(gunzipSync(readFileSync(binary)).toString('utf8')).canonical;
  const positions = precomputed.buffers.positions;
  const terrainVertices = precomputed.primitiveSpans.find(span => span.role === 'TERRAIN').vertexCount;
  let nearest = -1, best = Infinity;
  for (let i=0; i<terrainVertices; i++) {
    const dx=positions[i*3]-208, dz=positions[i*3+2]+344;
    const distance=dx*dx+dz*dz;
    if(distance<best) {best=distance;nearest=i;}
  }
  assert.ok(nearest>=0 && best<.01, 'EXACT_EAST_A_PACKAGE_VERTEX_MISSING');
  const x=positions[nearest*3], y=positions[nearest*3+1], z=positions[nearest*3+2];
  const b2Elevation=sampleHEarthTerrainElevation(x,z);
  assert.ok(b2Elevation-y>5.5 && b2Elevation-y<6.1,
    'EXPECTED_PUBLISHED_G_WORLD_AND_GEN2666_MESH_DIVERGENCE_NOT_FOUND');
  const canon = readFileSync(new URL('../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js',import.meta.url),'utf8');
  assert.ok(canon.includes('GEN2666_HYDRATION_BEGIN'));
  assert.ok(canon.includes('48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a'));
  assert.ok(source.includes('const elevation=surface.height+(t.elevation-surface.field)*smoothFade;'));
  // The local refinement's field-minus-interpolated-field subtraction
  // cancels B2 at old mesh vertices, and the initial patch is 128 m wide.
  // This recorded discrepancy must be reconciled before Stage B is accepted.
});

// Gen2823 owner ONE_REPAIR: source-bound weight budget, not visual acceptance.
test('Regional soil color preserves at least 34 percent of preceding approved photo-based albedo', () => {
  const begin = source.indexOf('// H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN');
  const end = source.indexOf('// H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_END', begin);
  assert.ok(begin > 0 && end > begin, 'MATERIAL_SCOPE_MISSING');
  const stage = source.slice(begin, end);
  assert.match(stage, /0\\.48\\+0\\.10\\*abs\\(fertilePatch-0\\.5\\)\\*2\\.0\\+/);
  assert.match(stage, /0\\.08\\*mineralExposure,0\\.0,0\\.66/);
  assert.match(stage, /identityWeight=inlandIdentity\\*/);
  assert.match(stage, /\\(1\\.0-protectedGrove\\)\\*identityContrast/);
  const weights = [];
  for (const fertilePatch of [0, 0.5, 1]) for (const mineralExposure of [0, 0.5, 1]) {
    const contrast = Math.min(0.66, Math.max(0, 0.48 + 0.10 * Math.abs(fertilePatch - 0.5) * 2 + 0.08 * mineralExposure));
    weights.push(contrast);
    assert.ok(contrast >= 0.48 && contrast <= 0.66, 'PHOTO_ALBEDO_BUDGET_EXCEEDED');
  }
  assert.ok(Math.max(...weights) - Math.min(...weights) > 0.15, 'REGIONAL_DIFFERENTIATION_COLLAPSED');
  assert.ok(source.indexOf('vec3 worldSoilActualAlbedo=') < begin, 'APPROVED_SOIL_TEXTURE_NOT_PRIOR');
  assert.match(stage, /if\\(!geologicalEarthRock\\)/);
  assert.match(stage, /inlandIdentity=smoothstep\\(/);
});
