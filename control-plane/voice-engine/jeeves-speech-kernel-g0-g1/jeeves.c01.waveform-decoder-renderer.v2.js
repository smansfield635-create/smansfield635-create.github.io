'use strict';
const PLAN=require('./jeeves.c01.realization-plan.v2.js');
const SR=24000;
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function hash01(a,b){const x=Math.sin((a+1)*12.9898+(b+1)*78.233)*43758.5453;return x-Math.floor(x);}
function coeff(freq,bw){const r=Math.exp(-Math.PI*bw/SR),th=2*Math.PI*freq/SR;return{b0:1-r,a1:2*r*Math.cos(th),a2:-r*r};}
function step(x,c,s){const y=c.b0*x+c.a1*s.y1+c.a2*s.y2;s.y2=s.y1;s.y1=y;return y;}
function parallel(src,F,B){const states=F.map(()=>({y1:0,y2:0})),out=new Float32Array(src.length);for(let i=0;i<src.length;i++){let y=0;for(let k=0;k<F.length;k++)y+=step(src[i],coeff(F[k],B[k]),states[k]);out[i]=y/F.length;}return out;}
function renderPhone(seg,index){const spec=PLAN.PHONE[seg.phone],cls=spec.class,f=seg.features,n=Math.max(1,Math.round(seg.durationMs*SR/1000)),src=new Float32Array(n),noise=new Float32Array(n);let phase=0;for(let i=0;i<n;i++){const q=i/Math.max(1,n-1),z=(hash01(index,i)-.5)*2,env=Math.min(1,i/(.006*SR),(n-i)/(.010*SR));noise[i]=z*env;phase=(phase+100/SR)%1;const pulse=Math.max(0,Math.sin(2*Math.PI*phase));let x=f.voicing?(pulse*.55+z*.01):0;if(cls==='fricative')x+=z*.34;if(cls==='stop'){if(q<f.closureFraction)x*=.02;else if(q<f.closureFraction+.18)x+=z*.60*(1-(q-f.closureFraction)/.18);}src[i]=x*env;}
let out;if(cls==='vowel'||cls==='approximant')out=parallel(src,[f.formant1Hz,f.formant2Hz,f.formant3Hz],[90,130,180]);else if(cls==='nasal')out=parallel(src,[f.nasalPoleHz,900],[90,180]);else if(cls==='fricative')out=parallel(src,[f.spectralCenterHz,Math.min(9000,f.spectralCenterHz+900)],[f.spectralBandwidthHz,1700]);else if(cls==='stop')out=parallel(src,[f.burstCenterHz,Math.min(9000,f.burstCenterHz+900)],[f.burstBandwidthHz,1500]);else out=src;
if(cls==='vowel'||cls==='approximant')for(let i=0;i<n;i++)out[i]=out[i]*.85+src[i]*.15;if(cls==='fricative')for(let i=0;i<n;i++)out[i]+=noise[i]*.08;if(cls==='stop')for(let i=0;i<n;i++){const q=i/Math.max(1,n-1);if(q>=f.closureFraction&&q<f.closureFraction+.18)out[i]+=noise[i]*.12;}
let peak=0;for(const x of out)peak=Math.max(peak,Math.abs(x));const g=peak>.5?.5/peak:1;for(let i=0;i<n;i++)out[i]=clamp(out[i]*g,-.8,.8);return out;}
function render(){const parts=[],segments=[];let at=0,pi=0;for(const seg of PLAN.realization()){const audio=seg.type==='WORD_GAP'?new Float32Array(Math.round(seg.durationMs*SR/1000)):renderPhone(seg,pi++);parts.push(audio);segments.push(Object.freeze({...seg,startSample:at,endSample:at+audio.length}));at+=audio.length;}const audio=new Float32Array(at);let p=0;for(const part of parts){audio.set(part,p);p+=part.length;}return Object.freeze({sampleRate:SR,audio,segments:Object.freeze(segments)});}
module.exports=Object.freeze({SR,renderPhone,render});
