import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const source=readFileSync(fileURLToPath(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url)),'utf8');
const old='      palette=mix(palette,groundcoverTone,groundcoverWeight);';
const bridge=[
 '      // One soil-side chromatic bridge: continuous, reversible and',
 '      // source-local. Keep existing patch, habitat and protection weights.',
 '      float groundcoverSoilBridge=0.30*',
 '        (groundcoverOrganic*0.78+mesoField*0.22)*',
 '        (1.0-groundcoverPatch)*',
 '        groundcoverSuitability*groundcoverProtection;',
 '      vec3 groundcoverBridgeSoil=mix(',
 '        palette,groundcoverTone,groundcoverSoilBridge',
 '      );',
 '      palette=mix(groundcoverBridgeSoil,groundcoverTone,groundcoverWeight);'
].join('\n');
const gitBlob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0'+s).digest('hex');
const smoothstep=(a,b,x)=>{const z=Math.min(1,Math.max(0,(x-a)/(b-a)));return z*z*(3-2*z)};
const mix3=(a,b,t)=>a.map((x,i)=>x*(1-t)+b[i]*t);
const luminosity=x=>0.2126*x[0]+0.7152*x[1]+0.0722*x[2];
function compose(soil,tone,signal,suitability=1,protection=1) {
 const patch=smoothstep(0.20,0.66,signal);
 const continuity=smoothstep(0.30,0.85,patch);
 const weight=0.88*patch*(1-0.25*continuity)*suitability*protection;
 const b=0.30*signal*(1-patch)*suitability*protection;
 const oldColor=mix3(soil,tone,weight);
 const candidate=mix3(mix3(soil,tone,b),tone,weight);
 return {patch,weight,bridge:b,oldColor,candidate};
}
const soils=[[0.390,0.248,0.148],[0.520,0.440,0.270],[0.300,0.235,0.155],
 [0.235,0.188,0.130],[0.480,0.315,0.140],[0.355,0.333,0.305]];
const moistures=[0.20,0.30,0.40,0.50,0.60,0.70];
const drynesses=[0,0.15,0.35,0.65];
const tone=(moist,dry)=>mix3(mix3([0.110,0.118,0.075],[0.075,0.090,0.055],moist),[0.175,0.150,0.095],dry);
const equal=(a,b,tag)=>a.forEach((x,i)=>assert.ok(Math.abs(x-b[i])<1e-12,tag+':'+i+':'+x+':'+b[i]));
test('exactly one admitted source substitution; reverse yields immutable baseline Git blob',()=>{
 assert.equal(source.split(bridge).length,2);
 assert.equal(source.includes(old),false);
 const reverted=source.replace(bridge,old);
 assert.equal(gitBlob(reverted),'85ee835060d5106a670077a5f4352b7ad202b49b');
 const begin=source.indexOf('// H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN');
 const end=source.indexOf('// H_EARTH_BROAD_GROUNDCOVER_V1_END',begin);
 assert.ok(begin>=0&&end>begin);
 const block=source.slice(begin,end);
 for(const fragment of [
  'float groundcoverPatch=smoothstep(', '0.20,0.66,groundcoverOrganic*0.78+mesoField*0.22',
  'float groundcoverWeight=0.88*groundcoverPatch*',
  'groundcoverSuitability*groundcoverProtection;',
  'groundcoverTone*=0.88+0.24*materialVariation;',
  'float groundcoverSoilBridge=0.30*',
  'palette=mix(groundcoverBridgeSoil,groundcoverTone,groundcoverWeight);'
 ])assert.ok(block.includes(fragment),'expected: '+fragment);
 assert.equal(block.match(/noise2\s*\(/g)?.length,1,'no new sampling beyond original');
});
test('all 144 soil/moisture/dryness profiles remain monotone, finite and reduce peak transition gradient',()=>{
 let count=0,peakOld=0,peakNew=0;
 const N=1000;
 for(const soil of soils)for(const moist of moistures)for(const dry of drynesses){
  const t=tone(moist,dry);
  let prevOld=null,prevNew=null;
  for(let i=0;i<=N;i++){
   const x=compose(soil,t,i/N);
   const lOld=luminosity(x.oldColor),lNew=luminosity(x.candidate);
   assert.ok(Number.isFinite(lOld)&&Number.isFinite(lNew),'finite');
   if(prevOld!==null){
    const a=prevOld-lOld,b=prevNew-lNew;
    assert.ok(a>=-1e-12,'original not monotone');
    assert.ok(b>=-1e-12,'candidate hue/luminance reversal');
    peakOld=Math.max(peakOld,a);
    peakNew=Math.max(peakNew,b);
   }
   prevOld=lOld;prevNew=lNew;
  }
  count++;
 }
 assert.equal(count,144);assert.ok(peakOld>0);
 assert.ok(peakNew/peakOld<0.92,'peak gradient reduction too small: '+peakNew/peakOld);
});
test('eligible outer-patch tint bounded, core and excluded/protected soil exact',()=>{
 for(const soil of soils)for(const moist of moistures)for(const dry of drynesses){
  const t=tone(moist,dry);
  let maxBridge=0;
  for(let i=0;i<=1000;i++){
   const s=i/1000,full=compose(soil,t,s);
   assert.ok(full.bridge>=0&&full.bridge<0.10,'bounded outer-chromatic undertone');
   maxBridge=Math.max(maxBridge,full.bridge);
   if(s>=0.66-1e-12)equal(full.candidate,full.oldColor,'core exact');
   if(s===0)equal(full.candidate,soil,'bare soil at zero');
   for(const [suit,protect] of [[0,1],[1,0]]){
    const ex=compose(soil,t,s,suit,protect);
    equal(ex.candidate,soil,'excluded/protected exact');
   }
   assert.ok(full.candidate.every(v=>Number.isFinite(v)&&v>=0&&v<=1),'physical RGB');
  }
  assert.ok(maxBridge>0.04&&maxBridge<0.10,'active but bounded');
 }
});
test('no new threshold, texture, geometry, canopy or per-pixel noise sample introduced',()=>{
 assert.equal(bridge.includes('smoothstep'),false);
 for(const n of ['noise2(', 'texture(', 'discard;', 'fwidth(', 'gl_', 'geometry', 'vegetation'])assert.equal(bridge.includes(n),false,n);
 assert.ok(bridge.includes('groundcoverSuitability*groundcoverProtection'));
 assert.ok(bridge.includes('(1.0-groundcoverPatch)'));
});