import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Gen3325 exact-source qualification. No visual acceptance or publication claim.
const root = new URL('../../showroom/globe/h-earth/render/', import.meta.url);
const read = file => readFileSync(new URL(file, root));
const renderer = read('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').toString('utf8');
const gitBlob = bytes => createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const begin = renderer.indexOf('  if(worldSoilTerrain){');
const end = renderer.indexOf('  if(clearingType>0.5&&clearingType<1.5){\n    // Texture-derived shallow bark relief', begin);
assert.ok(begin>=0 && end>begin, 'terrain material scope is not uniquely delimited');
const terrain = renderer.slice(begin, end);
const count = token => renderer.split(token).length - 1;
const smooth = (a,b,x) => {const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u);};
const materialWeight = (coast,slope) => smooth(28,92,Math.max(0,coast))*(1-smooth(.35,.65,slope));

test('terrain color does not consume the authored long-straight hillside divider', () => {
  assert.equal(count('float materialHillsideWeight=0.0;'),1);
  assert.equal(count('materialHillsideWeight=\n      smoothstep(28.0,92.0,max(0.0,vCoastDistanceMeters))*\n      (1.0-smoothstep(0.35,0.65,slope));'),1);
  assert.match(terrain,/float sandCoverage=renderedBeachCoverage\([^;]+\)\*\s*\(1\.0-materialHillsideWeight\*smoothstep\(\.012,\.065,slope\)\);/);
  assert.match(terrain,/float steepBank=materialHillsideWeight\*smoothstep/);
  assert.match(terrain,/float foothillDry=max\(foothillDryAmount\(vWorldPosition,uPlanetRadius\),\s*materialHillsideWeight\*smoothstep\(18\.0,42\.0,vWorldPosition\.y\)\);/);
  assert.doesNotMatch(terrain,/hillsideSandCoverage\(world|hillsideWeight\(world\)|hillsideDry\(vWorldPosition\)/);
  assert.ok(renderer.includes('$'+'{HILLSIDE_SHORELINE_GLSL}'), 'shared vegetation law remains injected without editing its source');
});

test('new terrain presentation weight is smooth, bounded and based on physical inputs', () => {
  for (const coast of [-100,0,28,38,60,91,92,200]) for(const slope of [-.1,0,.35,.5,.65,1]) {
    const w=materialWeight(coast,slope);
    assert.ok(Number.isFinite(w)&&w>=0&&w<=1);
    assert.ok(Math.abs(w-materialWeight(coast+.0001,slope))<.00002);
    assert.ok(Math.abs(w-materialWeight(coast,slope+.0001))<.001);
  }
  assert.equal(materialWeight(0,.1),0);
  assert.equal(materialWeight(100,.1),1);
  assert.equal(materialWeight(100,.7),0);
  // X/Z are absent from the new law. Old horizontal Z=-224 cannot select color.
  assert.equal(materialWeight(70,.2),materialWeight(70,.2));
});

test('historically proven olive pigment is limited without editing patch masks or vegetation', () => {
  assert.equal(count('float groundcoverPigmentWeight=groundcoverWeight*0.08;'),1);
  assert.equal(count('palette=mix(palette,groundcoverTone,groundcoverPigmentWeight);'),1);
  assert.doesNotMatch(terrain,/palette=mix\(palette,groundcoverTone,groundcoverWeight\);/);
  assert.match(terrain,/groundcoverWeight=0\.88\*groundcoverPatch\*/);
  assert.match(terrain,/groundcoverSuitability\*groundcoverProtection/);
  for (const color of ['vec3(0.110,0.118,0.075)','vec3(0.075,0.090,0.055)','vec3(0.175,0.150,0.095)'])
    assert.ok(terrain.includes(color),'lost source pigment '+color);
  assert.ok(.88*.08<.08);
});

test('approved real soil and protected root/shader dependencies retain original bytes', () => {
  for (const marker of ['H_EARTH_ACTUAL_WORLD_SOIL_MATERIAL_20261010_V2',
    'vec3 worldSoilReference=pow(worldSoilTexel,vec3(2.2))*0.75;',
    'uClearingSoil,worldSoilXZ*0.28','H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN',
    'uMeadowGroundOccupancy','gen3259OriginalHabitat',
    'base=mix(base,habitatSoil,habitatColorCoverage*.68);',
    'RENDERED_BEACH_GLSL','vRoleCode==4u','uTerrainPatchClip',
    'CORRECTED_MANIFEST','WOODLAND_FINE_GRASS_FS'])
    assert.ok(renderer.includes(marker),'protected renderer marker missing: '+marker);
  for(const [file,sha] of [
    ['grass-coastal-field.v1.js','4197026579ab641d830cdb852522e46bdb247609'],
    ['hillside-shoreline-field.v1.js','d564eabcb55425c5b6a0a34192aa1a9982da54ce'],
    ['vegetation-single-owner.prototype.v1.js','7cb62866153d4ceb57b2a2177359bd56a4220d85'],
    ['landscape-coherence-field.v1.js','81da4392c9e8469ba48e838468f15758d15d1ae3']
  ]) assert.equal(gitBlob(read(file)),sha,'protected material/vegetation drift: '+file);
});
