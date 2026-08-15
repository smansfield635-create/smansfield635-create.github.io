'use strict';
const A1=require('./jeeves.physical-acoustic-consumer.a0a1.v1.js');
const A2=require('./jeeves.physical-acoustic-consumer.a2.v1.js');
const SR=A1.SR;
const SONORANTS=new Set(['R','L','W','Y','M','N','NG']);
const FRICATIVES=new Set(['F','V','S','Z','SH','ZH','TH','DH','H']);
const STOPS=new Set(['P','B','T','D','K','G']);
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function hash01(a,b){const x=Math.sin((a+1)*12.9898+(b+1)*78.233)*43758.5453;return x-Math.floor(x);}
function resonatorCoeffs(freq,bw){const r=Math.exp(-Math.PI*bw/SR),theta=2*Math.PI*freq/SR;return{b0:1-r,a1:2*r*Math.cos(theta),a2:-r*r};}
function step(x,c,s){const y=c.b0*x+c.a1*s.y1+c.a2*s.y2;s.y2=s.y1;s.y1=y;return y;}
function glottalFlow(phase,openQ,closeQ){phase=((phase%1)+1)%1;if(phase<openQ){const u=phase/openQ;return .5-.5*Math.cos(Math.PI*u);}if(phase<openQ+closeQ){const u=(phase-openQ)/closeQ;const c=Math.cos(.5*Math.PI*u);return c*c;}return 0;}
function sourceSample({phase,cycleIndex,sampleIndex,fi,voiced,fricative,performanceState}){
  const restraint=clamp(performanceState.restraint,0,1),urgency=clamp(performanceState.urgency,0,1);
  const openQ=clamp(.60-.07*urgency+.04*restraint,.45,.72);
  const closeQ=clamp(.18+.035*urgency-.02*restraint,.10,.28);
  const tilt=clamp(.78+.10*restraint-.08*urgency,.55,.95);
  const noise=(hash01(fi,sampleIndex)-.5)*2;
  const glottal=glottalFlow(phase,openQ,closeQ);
  const differentiated=glottal-Math.max(0,glottalFlow((phase-.006+1)%1,openQ,closeQ));
  const shaped=(1-tilt)*glottal+tilt*differentiated*6;
  const aspirationGate=Math.pow(Math.sin(Math.PI*clamp(phase/Math.max(openQ,1e-6),0,1)),2);
  const aspiration=noise*aspirationGate*clamp(.045+.04*urgency,0,.12);
  let x=voiced?(shaped*.72+aspiration+noise*.018):0;
  if(fricative)x+=noise*(fi===-1?.16:.38);
  return x;
}
function render(performanceState,phonemeFrames){
  if(!performanceState||!Array.isArray(phonemeFrames)||!phonemeFrames.length)throw new Error('A3_INPUT_INVALID');
  const vowels=new Set(Object.keys(A1.FORMANTS)),states=[{y1:0,y2:0},{y1:0,y2:0},{y1:0,y2:0}],parts=[];
  let phase=0,globalSample=0,cycleIndex=0;const total=phonemeFrames.reduce((s,f)=>s+Math.round(f.durationMs*SR/1000),0);
  for(let fi=0;fi<phonemeFrames.length;fi++){
    const frame=phonemeFrames[fi],ph=frame.phoneme,prev=phonemeFrames[fi-1]?.phoneme,next=phonemeFrames[fi+1]?.phoneme,n=Math.max(1,Math.round(frame.durationMs*SR/1000)),out=new Float32Array(n);
    const voiced=vowels.has(ph)||SONORANTS.has(ph)||['B','D','G','V','Z','ZH','DH','JH'].includes(ph),fric=FRICATIVES.has(ph)||['CH','JH'].includes(ph),stop=STOPS.has(ph);
    for(let i=0;i<n;i++,globalSample++){
      const q=i/Math.max(1,n-1),phrase=globalSample/Math.max(1,total-1);
      const baseF0=performanceState.f0CenterHz*Math.pow(2,(performanceState.f0ExcursionSemitones*.35*Math.sin(Math.PI*phrase))/12);
      const perturb=(hash01(cycleIndex,17)-.5)*.012,f0=baseF0*(1+perturb);phase+=f0/SR;if(phase>=1){phase-=1;cycleIndex++;}
      const attack=Math.max(1,performanceState.attackMs*SR/1000),env=Math.min(1,i/attack,(n-i)/Math.max(1,attack*1.4));
      let exc=sourceSample({phase,cycleIndex,sampleIndex:globalSample,fi,voiced,fricative:fric,performanceState});
      if(stop&&i<.018*SR){const noise=(hash01(fi+31,globalSample)-.5)*2;exc+=noise*.50*(1-i/(.018*SR));}
      const g=A2.articulatoryTargets(prev,ph,next,q);let y=exc;for(let r=0;r<3;r++)y=step(y,resonatorCoeffs(g.formants[r],g.bandwidths[r]),states[r]);
      const variability=1+performanceState.energyVariance*.25*Math.sin(2*Math.PI*(.7*phrase+.11*fi)),gain=1.05-.23*clamp(performanceState.restraint,0,1);out[i]=clamp(y*performanceState.energyScale*variability*gain*env*48,-1,1);
    }
    parts.push(out);
  }
  const len=parts.reduce((s,p)=>s+p.length,0),buf=new Float32Array(len);let at=0;for(const p of parts){buf.set(p,at);at+=p.length;}return buf;
}
module.exports=Object.freeze({SR,glottalFlow,sourceSample,render});
