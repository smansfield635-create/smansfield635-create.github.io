import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const renderer=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
const block=renderer.split('    // H_EARTH_NATURAL_DRY_SAND_BLEND_V1_BEGIN')[1].split('    // H_EARTH_NATURAL_DRY_SAND_BLEND_V1_END')[0];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const smoothstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
function statement(name){const m=block.match(new RegExp('float '+name+'=([\\s\\S]*?);'));assert.ok(m,name);return 'let '+name+'='+m[1]+';';}
const dry=new Function('inlandMeters','drySandWarp','clamp','smoothstep',statement('drySandT')+statement('drySandEnvelope')+statement('drySandWeight')+'return drySandWeight;');
test('actual shader dry blend remains bounded and preserves both endpoints',()=>{
 for(let warp=-3;warp<=3;warp+=.125)for(let d=-5;d<=70;d+=.125){
  const w=dry(d,warp,clamp,smoothstep);assert.ok(w>=0&&w<=1);
  if(d<=10)assert.equal(w,1);if(d>=50)assert.equal(w,0);
 }
});
test('actual shader has no reversal or jump along its dry-distance axis',()=>{
 for(let warp=-3;warp<=3;warp+=.25){let prior=1;for(let d=9;d<=51;d+=.01){
  const w=dry(d,warp,clamp,smoothstep);assert.ok(w<=prior+1e-12);assert.ok(prior-w<.0006);prior=w;
 }}
});
test('both blend joins have vanishing endpoint derivative',()=>{
 for(const warp of [-3,0,3])for(const [d,end] of [[10,1],[50,0]]){
  assert.ok(Math.abs(dry(d+(d===10?.0001:-.0001),warp,clamp,smoothstep)-end)<1e-9);
 }
});
test('organic warp and grain are bounded without a third color palette',()=>{
 assert.ok(block.includes('2.25*(2.0*noise2(')&&block.includes('0.75*(2.0*noise2('));
 assert.ok(block.includes('sand*=1.0+0.06*drySandGrainCarry*(2.0*grain-1.0)'));
 assert.ok(!/vec3/.test(block));
 for(let w=0;w<=1;w+=.001)for(const g of [0,1]){const f=1+.06*4*w*(1-w)*(2*g-1);assert.ok(f>=.94-1e-12&&f<=1.06+1e-12);}
});
test('wet contact suitability and shared planting provider stay native',()=>{
 assert.ok(block.includes('min(inlandMeters,10.0),vCoastDistanceMeters,vWorldPosition.y,slope'));
 assert.ok(block.includes('sandCoverage=mix(sandCoverage,naturalSandCoverage,drySandProtection)'));
 assert.ok(renderer.includes("import {RENDERED_BEACH_GLSL,createRenderedBeachProvider,createPilotCoverageOwner} from './rendered-beach-signal.v1.js?rev=gen2782-rendered-landscape-v1'"));
});
test('protection field matches the existing approved groundcover protections',()=>{
 const names=['OasisX','OasisZ','EstateX','EstateZ','RouteT','RouteDistance'];
 for(const name of names){
  const old=renderer.match(new RegExp('float groundcover'+name+'=([\\s\\S]*?);'))[1].replaceAll('groundcover','drySand');
  const value=block.match(new RegExp('float drySand'+name+'=([\\s\\S]*?);'))[1];assert.equal(value.replace(/\s+/g,''),old.replace(/\s+/g,''));
 }
 assert.ok(block.includes('smoothstep(22.0,42.0,distance(world,vec2(-139.40268,-210.74617)))'));
 assert.ok(block.includes('smoothstep(0.0,12.0,length(vec2(drySandOasisX,drySandOasisZ)))'));
 assert.ok(block.includes('smoothstep(0.0,10.0,length(vec2(drySandEstateX,drySandEstateZ)))'));
 assert.ok(block.includes('smoothstep(4.0,9.0,drySandRouteDistance)'));
});
test('removing the declared block restores the exact approved production renderer',()=>{
 const recovered=renderer.replace(/    \/\/ H_EARTH_NATURAL_DRY_SAND_BLEND_V1_BEGIN[\s\S]*?    \/\/ H_EARTH_NATURAL_DRY_SAND_BLEND_V1_END\n/,'');
 assert.equal(createHash('sha256').update(recovered).digest('hex'),'a2ab977a3ea620f7bf87b3bdfb4e6a720cf7801f2ecbb670b4ac2dfccacf917d');
});
