import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildHabitatMaterialPresentation, HABITAT_MATERIAL_FILTER } from '../../showroom/globe/h-earth/render/habitat-material-presentation.v1.js';

// Gen3030: source and mathematical candidate qualification, not GPU or owner KEEP.
const shader = readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js', import.meta.url),'utf8');
const start='// H_EARTH_GEN3030_HABITAT_SOIL_RELATIVE_C1_BEGIN';
const end='// H_EARTH_GEN3030_HABITAT_SOIL_RELATIVE_C1_END';
const count=token=>shader.split(token).length-1;
const section=shader.slice(shader.indexOf(start),shader.indexOf(end)+end.length);
const lumaWeights=[0.2126,0.7152,0.0722];
const dot=rgb=>rgb.reduce((sum,channel,i)=>sum+channel*lumaWeights[i],0);
const mix=(a,b,w)=>a.map((v,i)=>v*(1-w)+b[i]*w);
const c1=t=>t*t*(3-2*t);
const newAlbedo=(native,pigment,coverage)=>{
  const luminance=dot(native);
  const relative=pigment.map(value=>value*(luminance/Math.max(dot(pigment),0.0001)));
  return mix(native,relative,0.68*c1(coverage));
};
const rgbDistance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));

test('one bounded Gen3030 shader replacement is exclusively in world-soil habitat color',()=>{
  assert.equal(count(start),1);assert.equal(count(end),1);
  assert.ok(shader.indexOf('if(worldSoilTerrain&&uWoodlandHabitatEnabled==1)')<shader.indexOf(start));
  assert.ok(shader.indexOf(start)<shader.indexOf('float bankWindow=',shader.indexOf(start)));
  assert.match(section,/habitatColorCoverage=clamp\(habitatCoverage\+habitatMaterialProtection\(vWorldPosition.xz\)\*\(habitatMaterialCoverage-habitatCoverage\),0\.0,1\.0\)/);
  assert.match(section,/habitatAlbedoC1=habitatColorCoverage\*habitatColorCoverage\*\(3\.0-2\.0\*habitatColorCoverage\)/);
  assert.match(section,/habitatSoilPigment=landscapeCoverPalette\(vWorldPosition.xz,foothillDry\)/);
  assert.match(section,/nativeSoilAlbedo=base/);
  assert.match(section,/habitatSoilRelative=habitatSoilPigment\*\(nativeSoilLuminance\/habitatPigmentLuminance\)/);
  assert.match(section,/base=mix\(nativeSoilAlbedo,habitatSoilRelative,habitatAlbedoC1\*\.68\)/);
  assert.doesNotMatch(section,/landscapeCoverPalette\([^\n]*\)\*\.72/);
});

test('C1 support endpoints have zero first derivative and no direct mask step',()=>{
  const epsilon=1e-5;
  assert.equal(c1(0),0);assert.equal(c1(1),1);
  assert.ok(Math.abs((c1(epsilon)-c1(0))/epsilon)<0.00005);
  assert.ok(Math.abs((c1(1)-c1(1-epsilon))/epsilon)<0.00005);
  for(let i=0;i<=1000;i++) {
    const t=i/1000;
    assert.ok(c1(t)>=0 && c1(t)<=1);
    if(i>0)assert.ok(c1(t)>=c1((i-1)/1000));
  }
});

test('uncovered soil is exactly unchanged, including healthy coast/meadow controls',()=>{
  for(const native of [[132,116,91],[136,117,92],[95,86,72],[180,154,111]]){
    for(const pigment of [[138,147,94],[97,73,52]]){
      assert.deepEqual(newAlbedo(native,pigment,0),native);
    }
  }
});

test('occupied material hue changes without imposing the old absolute dark-luminance paint',()=>{
  const native=[132,116,91],pigment=[138,147,94];
  for(const coverage of [0.01,0.2,0.5,0.9,1]){
    const result=newAlbedo(native,pigment,coverage);
    assert.ok(Math.abs(dot(result)-dot(native))<1e-9,'soil luminance displaced');
    assert.ok(result.every(Number.isFinite));
  }
  assert.ok(rgbDistance(newAlbedo(native,pigment,1),native)>1,'habitat material must still respond');
  const old=mix(native,pigment.map(v=>0.72*v),0.68);
  const newResult=newAlbedo(native,pigment,1),lower=[136,117,92];
  assert.ok(rgbDistance(newResult,lower)<rgbDistance(old,lower)*0.8,
    'source-confirmed lower hillside color cutoff not reduced in bounded model');
});

test('native habitat roots and roughness remain authoritative, color atlas remains separate',()=>{
  assert.match(shader,/habitatCoverage=texture\(uWoodlandHabitat,habitatUv\)\.r/);
  assert.match(shader,/habitatMaterialCoverage=texture\(uHabitatMaterialPresentation,habitatUv\)\.r/);
  assert.match(shader,/terrainRoughnessForLighting=mix\(terrainRoughnessForLighting,\.94,habitatCoverage\*\.3\)/);
  assert.equal(HABITAT_MATERIAL_FILTER.sigmaMeters,2);
  assert.equal(HABITAT_MATERIAL_FILTER.supportMeters,6);
  const size=5,width=3*size,pixels=new Uint8Array(size*width);
  for(let z=0;z<size;z++)for(let x=0;x<size;x++)pixels[z*width+x]=x<2?255:0;
  const before=Uint8Array.from(pixels);
  const input={size,width,height:size,pixels,bounds:[0,0,5,5],ravine:{bounds:[0,0,5,5]},coastal:{bounds:[0,0,5,5]}};
  const output=buildHabitatMaterialPresentation(input);
  assert.deepEqual(pixels,before,'installed root atlas mutated');
  assert.equal(output.receipt.rootAdmissionChanged,false);
  assert.equal(output.receipt.nativeRoughnessChanged,false);
  for(let z=0;z<size;z++)for(let x=size;x<width;x++)assert.equal(output.pixels[z*width+x],0,'habitat atlas panel leakage');
  assert.ok(output.receipt.panels[0].changedTexels>0,'color-only presentation did not smooth material input');
});

test('candidate leaves geometry, grass, water and original soil texture authority in shader',()=>{
  for(const marker of [
    'bool worldSoilTerrain=geologicalEarthRock||vRoleCode==1u||',
    'H_EARTH_ACTUAL_WORLD_SOIL_MATERIAL_20261010_V2',
    'uWoodlandHabitatEnabled==1',
    'uClearingSoil,worldSoilXZ*0.28',
    'worldSoilAlbedoAuthority',
    'WOODLAND_FINE_GRASS_FS',
    'RENDERED_BEACH_GLSL',
    'SHORELINE_SOIL_BEGIN shade',
    'terrainRoughnessForLighting=mix(terrainRoughnessForLighting,.94,habitatCoverage*.3);'
  ])assert.ok(shader.includes(marker),marker+' changed or missing');
});
