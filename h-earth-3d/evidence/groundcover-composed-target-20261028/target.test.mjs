import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const renderer=new URL('../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
const source=readFileSync(renderer,'utf8');
const blockPattern=/^      \/\/ H_EARTH_GROUNDCOVER_SOIL_RELATIVE_TARGET_BEGIN\n[\s\S]*?^      \/\/ H_EARTH_GROUNDCOVER_SOIL_RELATIVE_TARGET_END\n/gm;
const blocks=[...source.matchAll(blockPattern)];
assert.equal(blocks.length,1);
const block=blocks[0][0];
const sha=s=>createHash('sha256').update(s).digest('hex');
const L=[.2126,.7152,.0722];
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const multiply=(a,b)=>a.map((x,i)=>x*b[i]);
const scale=(a,b)=>a.map(x=>x*b);
const mix=(a,b,w)=>a.map((x,i)=>x*(1-w)+b[i]*w);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-12,`${a} != ${b}`);

// Evaluate the actual marked arithmetic after translating GLSL vector operators.
// This is CPU algebra qualification, not GLSL compilation or pixel evidence.
const arithmetic=block.replace(/^.*\/\/.*$/gm,'')
  .replace(/\b(?:vec3|float) (\w+)=/g,'let $1=')
  .replace('vec3(0.2126,0.7152,0.0722)','[0.2126,0.7152,0.0722]')
  .replace('palette*groundcoverTone','multiply(palette,groundcoverTone)')
  .replace('groundcoverColoredSoil*(groundcoverSoilLuminance/groundcoverColoredLuminance)','scale(groundcoverColoredSoil,groundcoverSoilLuminance/groundcoverColoredLuminance)');
const endpoint=new Function('palette','groundcoverTone','dot','multiply','scale',`${arithmetic}\nreturn groundcoverTone;`);
const target=(s,t)=>endpoint(s,t,dot,multiply,scale);

test('the only approved renderer delta is the marked target block',()=>{
  assert.equal(sha(source.replace(blockPattern,'')),'fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec');
  assert.ok(!source.includes('H_EARTH_GROUNDCOVER_FOOTPRINT_'));
  assert.ok(source.includes('H_EARTH_GROUNDCOVER_SOIL_RELATIVE_TARGET_END\n      palette=mix(palette,groundcoverTone,groundcoverWeight);'));
});

test('stage luminance and scalar texture variation survive the full weight sweep',()=>{
  for(const soil of [[.39,.248,.148],[.08,.06,.025],[.48,.315,.14],[.20,.235,.135],[.001,.002,.003]]){
    for(const tone of [[.110,.118,.075],[.075,.090,.055],[.175,.150,.095]]){
      const t=target(soil,tone);
      for(const w of [0,.01,.1,.3,.5,.66,1]){
        const out=mix(soil,t,w);
        close(dot(out,L),dot(soil,L));
        for(const factor of [.5,.9,1.1,1.5]){
          const s2=scale(soil,factor),o2=mix(s2,target(s2,tone),w);
          o2.forEach((v,i)=>close(v,out[i]*factor));
        }
        out.forEach(v=>assert.ok(Number.isFinite(v)&&v>=0));
      }
    }
  }
});

test('zero weight, zero substrate and neutral cover remain identities',()=>{
  for(const soil of [[.39,.248,.148],[0,0,0],[0,.12,0]]){
    assert.deepEqual(mix(soil,target(soil,[.11,.118,.075]),0),soil);
    target(soil,[.1,.1,.1]).forEach((v,i)=>close(v,soil[i]));
    assert.deepEqual(target(soil,[0,0,0]),soil);
  }
});

test('substrate chromatic differences survive instead of converging to one absolute target',()=>{
  const tone=[.11,.118,.075],a=[.30,.20,.10],b=[.20,.22972595,.10];
  assert.notDeepEqual(target(a,tone),target(b,tone));
  for(const soil of [a,b]){
    const t=target(soil,tone);
    close(t[0]/t[1],soil[0]*tone[0]/(soil[1]*tone[1]));
  }
});

test('original absolute target exhibits the failure mechanism this candidate isolates',()=>{
  const soil=[.39,.248,.148],tone=[.11,.118,.075],w=.66;
  assert.ok(dot(mix(soil,tone,w),L)<dot(soil,L));
  const detail=[.01,.01,.01];
  const changed=soil.map((x,i)=>x+detail[i]);
  mix(changed,tone,w).forEach((v,i)=>close(v-mix(soil,tone,w)[i],detail[i]*(1-w)));
});

test('active shader consumers and terrain/vegetation gate remain source-bound',()=>{
  for(const snippet of [
    'bool geologicalEarthRock=vPrimitiveIndex==62001u;',
    'bool worldSoilTerrain=geologicalEarthRock||vRoleCode==1u||',
    'int(vPrimitiveIndex)==uGlobalCoverFarPrimitiveIndex;',
    'const WOODLAND_FINE_GRASS_FS=FS.replace(',
    'const GLOBAL_COVER_PATCH_SUPPRESSION_FS=FS',
    "createShader(gl.FRAGMENT_SHADER, FS, 'GF')",
    "createShader(gl.FRAGMENT_SHADER,GLOBAL_COVER_PATCH_SUPPRESSION_FS,'LOCAL_PREVIEW_FS')",
    "createShader(gl.FRAGMENT_SHADER,GLOBAL_COVER_PATCH_SUPPRESSION_FS,'GLOBAL_COVER_FS')",
    'vPrimitiveIndex=65535u;vRoleCode=3u;'
  ])assert.ok(source.includes(snippet),snippet);
});
