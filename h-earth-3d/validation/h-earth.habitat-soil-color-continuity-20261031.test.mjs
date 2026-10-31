import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const shaderPath=new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
const helperPath=new URL('../../showroom/globe/h-earth/render/habitat-material-presentation.v1.js',import.meta.url);
const source=readFileSync(shaderPath,'utf8');
const helper=readFileSync(helperPath,'utf8');
const gitBlob=(text)=>{const b=Buffer.from(text,'utf8');return createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
const orig=[
 '    vec3 habitatSoil=landscapeCoverPalette(vWorldPosition.xz,foothillDry)*.72;',
 '    float habitatColorCoverage=clamp(habitatCoverage+habitatMaterialProtection(vWorldPosition.xz)*(habitatMaterialCoverage-habitatCoverage),0.0,1.0);',
 '    base=mix(base,habitatSoil,habitatColorCoverage*.68);'
].join('\n');
const start='    // Gen3030: ground material must keep its own soil color family and grain.';
const end='    base=mix(base,soilRelativeHabitat,habitatSupportC1*.68);';

test('Gen3030 exact source change reverses to original main shader bytes',()=>{
 const i=source.indexOf(start),j=source.indexOf(end,i);
 assert.ok(i>=0&&j>i);
 assert.equal(source.indexOf(start,i+1),-1);
 assert.equal(source.indexOf(end,j+1),-1);
 const block=source.slice(i,j+end.length);
 for(const anchor of [
  'float soilLuma=dot(base,vec3(0.2126,0.7152,0.0722));',
  'float habitatLuma=dot(habitatSoil,vec3(0.2126,0.7152,0.0722));',
  'float soilRelativeDarkness=clamp(habitatLuma/max(soilLuma,0.001),0.92,1.0);',
  'float habitatSupport=clamp(habitatColorCoverage,0.0,1.0);',
  'float habitatSupportC1=habitatSupport*habitatSupport*(3.0-2.0*habitatSupport);',
  'vec3 soilRelativeHabitat=base*soilRelativeDarkness;',
  end
 ])assert.ok(block.includes(anchor),'missing '+anchor);
 assert.ok(!source.includes('base=mix(base,habitatSoil,habitatColorCoverage*.68);'));
 const original=source.slice(0,i)+orig+source.slice(j+end.length);
 assert.equal(gitBlob(original),'85ee835060d5106a670077a5f4352b7ad202b49b');
});

test('original panel-local habitat presentation, protections and physical roots remain untouched',()=>{
 assert.equal(gitBlob(helper),'3fc89b5fa6b41455445efc5c3a08346508f119aa');
 for(const fragment of ['sigmaMeters:2','supportMeters:6','HABITAT_MATERIAL_PROTECTION_GLSL','rootAdmissionChanged:false','nativeRoughnessChanged:false'])assert.ok(helper.includes(fragment));
 for(const fragment of ['habitatCoverage+habitatMaterialProtection(vWorldPosition.xz)', 'terrainRoughnessForLighting=mix(terrainRoughnessForLighting,.94,habitatCoverage*.3);','landscapeCoverPalette(vWorldPosition.xz,foothillDry)'])assert.ok(source.includes(fragment));
});

test('soil-relative material response is bounded and does not import vegetation chroma',()=>{
 const mix=(a,b,w)=>a*(1-w)+b*w;
 const response=(base,habitatLuma,mask)=>{
  const y=base[0]*.2126+base[1]*.7152+base[2]*.0722;
  const ratio=Math.max(.92,Math.min(1,habitatLuma/Math.max(y,.001)));
  const h=Math.max(0,Math.min(1,mask)),c1=h*h*(3-2*h);
  return base.map(x=>mix(x,x*ratio,c1*.68));
 };
 for(const soil of [[.1,.14,.06],[.22,.19,.13],[.41,.29,.18],[.56,.43,.29]]){
  for(const pigment of [0,.04,.12,.35,.65])for(let i=0;i<=100;i++){
   const out=response(soil,pigment,i/100);
   for(let k=0;k<3;k++){
    assert.ok(out[k]>=soil[k]*(1-.08*.68)-1e-12);
    assert.ok(out[k]<=soil[k]+1e-12);
   }
   assert.ok(Math.abs(out[0]/soil[0]-out[1]/soil[1])<1e-10);
  }
 }
});

test('C1 membership endpoints and original coast-zero mask are preserved',()=>{
 const h=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 const eps=1e-5;
 assert.equal(h(0),0);assert.equal(h(1),1);
 assert.ok((h(eps)-h(0))/eps<0.001);
 assert.ok((h(1)-h(1-eps))/eps<0.001);
 let last=0;
 for(let i=0;i<=1000;i++){const v=h(i/1000);assert.ok(v>=last-1e-12);assert.ok(v>=0&&v<=1);last=v;}
 const soil=[.2,.3,.1];for(const ratio of [.92,.95,1])assert.deepEqual(soil.map(v=>v*(1-h(0)*.68*(1-ratio))),soil);
});

test('no shader, geographic, foliage, water or navigation reconstruction accompanies soil correction',()=>{
 for(const marker of [
  'H_EARTH_ACTUAL_WORLD_SOIL_MATERIAL_20261010_V2',
  'H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN',
  'H_EARTH_BROAD_GROUNDCOVER_V1_END',
  'renderedBeachCoverage(inlandMeters,vCoastDistanceMeters,vWorldPosition.y,slope)',
  'worldSoilLightingWeight=1.0;',
  'uHabitatMaterialPresentation'
 ])assert.ok(source.includes(marker));
});
