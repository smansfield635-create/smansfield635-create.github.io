'use strict';

const A1=require('./jeeves.physical-acoustic-consumer.a0a1.v1.js');
const SR=A1.SR;
const SONORANTS=new Set(['R','L','W','Y','M','N','NG']);

function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function smoothstep(x){x=clamp(x,0,1);return x*x*(3-2*x);}
function blend3(a,b,c,wa,wb,wc){const s=wa+wb+wc||1;return b.map((v,i)=>(a[i]*wa+v*wb+c[i]*wc)/s);}
function target(ph){return A1.FORMANTS[ph]||A1.FORMANTS.AH;}
function bandwidths(ph){if(['M','N','NG'].includes(ph))return[110,150,210];if(SONORANTS.has(ph))return[100,135,180];return[90,120,160];}

function gestureWeights(t){
  const carry=0.24,anticip=0.28,max=0.42;
  const prev=t<carry?max*(1-smoothstep(t/carry)):0;
  const next=t>1-anticip?max*smoothstep((t-(1-anticip))/anticip):0;
  return {prev,current:1,next};
}

function articulatoryTargets(prev,cur,next,t){
  const w=gestureWeights(t);
  return {
    formants:blend3(target(prev||cur),target(cur),target(next||cur),w.prev,w.current,w.next),
    bandwidths:blend3(bandwidths(prev||cur),bandwidths(cur),bandwidths(next||cur),w.prev,w.current,w.next),
    weights:w
  };
}

function resonatorCoeffs(freq,bw){const r=Math.exp(-Math.PI*bw/SR),theta=2*Math.PI*freq/SR;return{b0:1-r,a1:2*r*Math.cos(theta),a2:-r*r};}
function step(x,c,s){const y=c.b0*x+c.a1*s.y1+c.a2*s.y2;s.y2=s.y1;s.y1=y;return y;}
function hash01(a,b){const x=Math.sin((a+1)*12.9898+(b+1)*78.233)*43758.5453;return x-Math.floor(x);}
function pulse(phase,openQ=.58,closeQ=.18){phase=((phase%1)+1)%1;if(phase<openQ){const q=phase/openQ;return .5*(1-Math.cos(Math.PI*q));}if(phase<openQ+closeQ){const q=(phase-openQ)/closeQ;return Math.cos(.5*Math.PI*q);}return 0;}

function render(performanceState,phonemeFrames){
  if(!performanceState||!Array.isArray(phonemeFrames)||!phonemeFrames.length)throw new Error('A2_INPUT_INVALID');
  const vowel=new Set(Object.keys(A1.FORMANTS)),fric=new Set(['F','V','S','Z','SH','ZH','TH','DH','H']),stop=new Set(['P','B','T','D','K','G']);
  const states=[{y1:0,y2:0},{y1:0,y2:0},{y1:0,y2:0}],parts=[];
  let phase=0,globalSample=0;const total=phonemeFrames.reduce((s,f)=>s+Math.round(f.durationMs*SR/1000),0);
  for(let fi=0;fi<phonemeFrames.length;fi++){
    const frame=phonemeFrames[fi],ph=frame.phoneme,prev=phonemeFrames[fi-1]?.phoneme,next=phonemeFrames[fi+1]?.phoneme,n=Math.max(1,Math.round(frame.durationMs*SR/1000)),out=new Float32Array(n);
    const voiced=vowel.has(ph)||SONORANTS.has(ph)||['B','D','G','V','Z','ZH','DH','JH'].includes(ph);
    for(let i=0;i<n;i++,globalSample++){
      const q=i/Math.max(1,n-1),phrase=globalSample/Math.max(1,total-1),f0=performanceState.f0CenterHz*Math.pow(2,(performanceState.f0ExcursionSemitones*.35*Math.sin(Math.PI*phrase))/12);phase=(phase+f0/SR)%1;
      const noise=(hash01(fi,globalSample)-.5)*2,attack=Math.max(1,performanceState.attackMs*SR/1000),env=Math.min(1,i/attack,(n-i)/Math.max(1,attack*1.4));
      let exc=voiced?pulse(phase)*.78+noise*.025:0;if(fric.has(ph))exc+=noise*(ph==='H'?.16:.42);if(stop.has(ph)&&i<.018*SR)exc+=noise*.55*(1-i/(.018*SR));
      const g=articulatoryTargets(prev,ph,next,q);let y=exc;for(let r=0;r<3;r++)y=step(y,resonatorCoeffs(g.formants[r],g.bandwidths[r]),states[r]);
      const variability=1+performanceState.energyVariance*.25*Math.sin(2*Math.PI*(.7*phrase+.11*fi)),restraint=1.05-.23*clamp(performanceState.restraint,0,1);out[i]=clamp(y*performanceState.energyScale*variability*restraint*env*52,-1,1);
    }
    parts.push(out);
  }
  const len=parts.reduce((s,p)=>s+p.length,0),buf=new Float32Array(len);let at=0;for(const p of parts){buf.set(p,at);at+=p.length;}return buf;
}

module.exports=Object.freeze({SR,gestureWeights,articulatoryTargets,render});
