import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const originalBlob='19eec736d247857a1ce232e693e583d3047079cf';
const source=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const marker=/      \/\/ H_EARTH_GEN3178_MULTITONE_BEGIN\n[\s\S]*?      \/\/ H_EARTH_GEN3178_MULTITONE_END\n/g;
const blocks=[...source.matchAll(marker)];
const approx=(a,b,eps=1e-12)=>Math.abs(a-b)<=eps;
function smoothstep(a,b,x){let t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function mix(a,b,t){return a+(b-a)*t}
function vmix(a,b,t){return a.map((v,i)=>mix(v,b[i],t))}
function vscale(a,s){return a.map((v,i)=>v*s[i])}
function run(s,macro,elig,soil,tone){
 const patch=smoothstep(.20,.66,s),cont=smoothstep(.30,.85,patch);
 const w=.88*patch*(1-.25*cont)*elig;
 const u=smoothstep(.03,.66,s+.06*(macro-.5)*(1-patch));
 const bridge=4*u*(1-u),extended=.66*(u+.70*u*(1-u))*elig;
 const weight=mix(w,extended,.95*bridge);
 const warm=vscale(vmix(tone,soil,.40),[1.10,.985,.865]);
 const moss=vscale(vmix(tone,soil,.24),[.89,1.18,.885]);
 const olive=vscale(vmix(tone,soil,.08),[.91,1.085,.935]);
 const a=1-u;
 const graded=tone.map((v,i)=>a*a*a*warm[i]+3*a*a*u*moss[i]+3*a*u*u*olive[i]+u*u*u*v);
 return {original:vmix(soil,tone,w),candidate:vmix(soil,graded,weight),weight,transition:u};
}
const soil=[.23,.18,.13],tone=[.092,.100,.063],lum=x=>x[0]*.2126+x[1]*.7152+x[2]*.0722;
test('one reversible shader composition edit and exact Gen3172 parent blob',()=>{
 assert.equal(blocks.length,1,'exact one multitone delta');
 const block=blocks[0][0];
 const restored=source.replace(block,'      palette=mix(palette,groundcoverTone,groundcoverWeight);\n');
 const bytes=Buffer.from(restored,'utf8');
 const gitBlob=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
 assert.equal(gitBlob,originalBlob,'unrelated renderer source mutated');
 for(const field of ['groundcoverSuitability*groundcoverProtection','0.06*(macroField-0.5)','groundcoverWarmEarth','groundcoverMossEarth','groundcoverMutedOlive','groundcoverMultitone','groundcoverWeight,groundcoverExtendedWeight','groundcoverTransitionBridge'])assert.ok(block.includes(field),'missing authored stage: '+field);
 assert.doesNotMatch(block,/\b(?:noise2|texture|uniform|sampler2D|discard)\s*\(/);
});
test('zero eligibility/native soil and saturated dark-olive endpoint are exact',()=>{
 for(const s of [-.1,0,.1,.2,.35,.45,.66,1])for(const macro of [0,.5,1]){
  assert.deepEqual(run(s,macro,0,soil,tone).candidate,soil);
  const out=run(s,macro,1,soil,tone);
  if(s>=.66)for(let i=0;i<3;i++)assert.ok(approx(out.candidate[i],out.original[i],2e-15));
  if(s<=0)assert.deepEqual(out.candidate,soil);
 }
});
test('continuous multi-tone transition reduces the attributed band-class gradient',()=>{
 let last=null,maxStep=0,largestDelta=0,maxOldGrad=0,maxNewGrad=0;
 for(let j=0;j<=2000;j++){
  const out=run(.66*j/2000,.5,1,soil,tone);
  largestDelta=Math.max(largestDelta,...out.candidate.map((v,i)=>Math.abs(v-out.original[i])));
  assert.ok(out.candidate.every(v=>Number.isFinite(v)&&v>=0&&v<1));
  if(last){
   maxStep=Math.max(maxStep,...out.candidate.map((v,i)=>Math.abs(v-last.candidate[i])));
   maxOldGrad=Math.max(maxOldGrad,Math.abs(lum(out.original)-lum(last.original)));
   maxNewGrad=Math.max(maxNewGrad,Math.abs(lum(out.candidate)-lum(last.candidate)));
  }
  last=out;
 }
 assert.ok(largestDelta>.02,'candidate not meaningfully different in modeled margin');
 assert.ok(maxStep<.002,'new hard transition detected');
 assert.ok(maxNewGrad<maxOldGrad*.90,'no reduction in maximum model gradient');
});
test('resident macro signal yields organic spatial variance without endpoint drift',()=>{
 const a=run(.30,0,1,soil,tone).candidate,b=run(.30,1,1,soil,tone).candidate;
 assert.ok(Math.max(...a.map((v,i)=>Math.abs(v-b[i])))>.001);
 for(const macro of [0,.5,1])for(const s of [.03,.66,.8])assert.ok(run(s,macro,1,soil,tone).candidate.every(Number.isFinite));
});
