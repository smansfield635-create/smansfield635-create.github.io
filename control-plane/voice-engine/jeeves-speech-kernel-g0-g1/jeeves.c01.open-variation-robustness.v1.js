'use strict';
const PLAN=require('./jeeves.c01.realization-plan.v2.js');
const R=require('./jeeves.c01.robustness-renderer.v1.js');
const SR=R.SR;
const PROBES=Object.freeze(Array.from({length:30},(_,i)=>200+i*300));
function sig(a){const n=a.length,b=[];let rms=0,z=0;for(let i=0;i<n;i++){rms+=a[i]*a[i];if(i&&Math.sign(a[i-1])!==Math.sign(a[i]))z++;}for(const f of PROBES){let re=0,im=0;for(let i=0;i<n;i++){const w=.5-.5*Math.cos(2*Math.PI*i/Math.max(1,n-1)),q=2*Math.PI*f*i/SR,x=a[i]*w;re+=x*Math.cos(q);im-=x*Math.sin(q);}b.push(Math.log1p(re*re+im*im));}let m=b.reduce((x,y)=>x+y,0)/b.length,sd=Math.sqrt(b.reduce((x,y)=>x+(y-m)**2,0)/b.length)||1;return {rms:Math.sqrt(rms/Math.max(1,n)),zcr:z/Math.max(1,n),bands:b.map(x=>(x-m)/sd)};}
function d(a,b){let x=(a.rms-b.rms)**2*2+(a.zcr-b.zcr)**2*15;for(let i=0;i<a.bands.length;i++)x+=(a.bands[i]-b.bands[i])**2/a.bands.length;return x;}
function regions(audio){const win=Math.round(.010*SR),hop=Math.round(.005*SR),e=[];for(let s=0;s<audio.length;s+=hop){let q=0;for(let i=s;i<Math.min(audio.length,s+win);i++)q+=audio[i]*audio[i];e.push(Math.sqrt(q/Math.max(1,Math.min(audio.length,s+win)-s)));}const mx=Math.max(...e),thr=Math.max(1e-7,mx*.008);let active=e.map(x=>x>thr),runs=[],st=null;for(let i=0;i<=active.length;i++){if(i<active.length&&active[i]&&st===null)st=i;if((i===active.length||!active[i])&&st!==null){runs.push([st,i]);st=null;}}const merged=[];for(const r of runs){if(!merged.length||((r[0]-merged[merged.length-1][1])*hop/SR)>.065)merged.push(r);else merged[merged.length-1][1]=r[1];}return merged.filter(r=>(r[1]-r[0])*hop/SR>.15).map(r=>audio.slice(Math.max(0,r[0]*hop),Math.min(audio.length,r[1]*hop+win)));}
function prototypes(){const nominal=R.render({durationScale:1,f0Hz:100,formantScale:1,noiseSeed:503}),rr=regions(nominal.audio);if(rr.length!==3)throw new Error('nominal regions');return PLAN.WORDS.map((x,i)=>({word:x[0],s:sig(rr[i])}));}
function decode(audio,bank){const rr=regions(audio),out=[];for(const r of rr){const s=sig(r),scores=bank.map(p=>({word:p.word,d:d(s,p.s)})).sort((a,b)=>a.d-b.d);out.push({word:scores[0].word,margin:scores[1].d-scores[0].d});}return {regions:rr.length,out};}
const CASES=Object.freeze([
 {id:'nominal',durationScale:1,f0Hz:100,formantScale:1,noiseSeed:503},
 {id:'duration-low',durationScale:.92,f0Hz:100,formantScale:1,noiseSeed:503},{id:'duration-high',durationScale:1.08,f0Hz:100,formantScale:1,noiseSeed:503},
 {id:'f0-low',durationScale:1,f0Hz:94,formantScale:1,noiseSeed:503},{id:'f0-high',durationScale:1,f0Hz:106,formantScale:1,noiseSeed:503},
 {id:'formant-low',durationScale:1,f0Hz:100,formantScale:.97,noiseSeed:503},{id:'formant-high',durationScale:1,f0Hz:100,formantScale:1.03,noiseSeed:503},
 {id:'noise-211',durationScale:1,f0Hz:100,formantScale:1,noiseSeed:211},{id:'noise-887',durationScale:1,f0Hz:100,formantScale:1,noiseSeed:887},
 {id:'corner-a',durationScale:.92,f0Hz:94,formantScale:.97,noiseSeed:211},{id:'corner-b',durationScale:1.08,f0Hz:106,formantScale:1.03,noiseSeed:887},
 {id:'cross-a',durationScale:.92,f0Hz:106,formantScale:1.03,noiseSeed:887},{id:'cross-b',durationScale:1.08,f0Hz:94,formantScale:.97,noiseSeed:211}
]);
function evaluate(){const bank=prototypes(),expected=PLAN.WORDS.map(x=>x[0]),results=CASES.map(c=>{const q=decode(R.render(c).audio,bank),words=q.out.map(x=>x.word),margins=q.out.map(x=>x.margin),pass=q.regions===3&&words.every((w,i)=>w===expected[i])&&margins.every(x=>x>0);return {id:c.id,pass,regions:q.regions,words,margins};});return {pass:results.every(x=>x.pass),cases:results.length,passed:results.filter(x=>x.pass).length,results};}
module.exports=Object.freeze({CASES,regions,decode,evaluate});
