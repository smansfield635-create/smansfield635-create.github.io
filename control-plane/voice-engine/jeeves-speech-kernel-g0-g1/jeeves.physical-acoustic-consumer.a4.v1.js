'use strict';
const A1=require('./jeeves.physical-acoustic-consumer.a0a1.v1.js');
const A2=require('./jeeves.physical-acoustic-consumer.a2.v1.js');
const A3=require('./jeeves.physical-acoustic-consumer.a3.v1.js');
const SR=A1.SR;
const NASALS=new Set(['M','N','NG']);
const FRICATIVES=new Set(['F','V','S','Z','SH','ZH','TH','DH','H']);
const STOPS=new Set(['P','B','T','D','K','G']);
const VOWELS=new Set(Object.keys(A1.FORMANTS));
const SONORANTS=new Set(['R','L','W','Y','M','N','NG']);
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function hash01(a,b){const x=Math.sin((a+1)*12.9898+(b+1)*78.233)*43758.5453;return x-Math.floor(x);}
function coeff(freq,bw){const r=Math.exp(-Math.PI*bw/SR),th=2*Math.PI*freq/SR;return{b0:1-r,a1:2*r*Math.cos(th),a2:-r*r};}
function step(x,c,s){const y=c.b0*x+c.a1*s.y1+c.a2*s.y2;s.y2=s.y1;s.y1=y;return y;}
function onePole(x,a,s){const y=(1-a)*x+a*s.y;s.y=y;return y;}
function placeForStop(ph){return ['P','B'].includes(ph)?'labial':['T','D'].includes(ph)?'alveolar':'velar';}
function fricativeProfile(ph){
  if(['S','Z'].includes(ph))return{center:6500,bw:1700,gain:.58};
  if(['SH','ZH'].includes(ph))return{center:3600,bw:1400,gain:.56};
  if(['F','V'].includes(ph))return{center:2500,bw:2300,gain:.34};
  if(['TH','DH'].includes(ph))return{center:3000,bw:2600,gain:.30};
  return{center:1500,bw:2800,gain:.18};
}
function stopProfile(ph){const p=placeForStop(ph);return p==='labial'?{center:1100,bw:1200,gain:.36}:p==='alveolar'?{center:4300,bw:1500,gain:.52}:{center:2700,bw:1000,gain:.48};}
function nasalProfile(ph){return ph==='M'?{pole:250,zero:1000}:ph==='N'?{pole:300,zero:1450}:{pole:330,zero:1900};}
function render(performanceState,phonemeFrames){
  if(!performanceState||!Array.isArray(phonemeFrames)||!phonemeFrames.length)throw new Error('A4_INPUT_INVALID');
  const tract=[{y1:0,y2:0},{y1:0,y2:0},{y1:0,y2:0}],classState={fr:{y1:0,y2:0},burst:{y1:0,y2:0},nasal:{y1:0,y2:0},zero:{y:0}},parts=[];
  let phase=0,globalSample=0,cycleIndex=0;const total=phonemeFrames.reduce((s,f)=>s+Math.round(f.durationMs*SR/1000),0);
  for(let fi=0;fi<phonemeFrames.length;fi++){
    const frame=phonemeFrames[fi],ph=frame.phoneme,prev=phonemeFrames[fi-1]?.phoneme,next=phonemeFrames[fi+1]?.phoneme,n=Math.max(1,Math.round(frame.durationMs*SR/1000)),out=new Float32Array(n);
    const voiced=VOWELS.has(ph)||SONORANTS.has(ph)||['B','D','G','V','Z','ZH','DH','JH'].includes(ph),fric=FRICATIVES.has(ph),stop=STOPS.has(ph),nasal=NASALS.has(ph);
    for(let i=0;i<n;i++,globalSample++){
      const q=i/Math.max(1,n-1),phrase=globalSample/Math.max(1,total-1),baseF0=performanceState.f0CenterHz*Math.pow(2,(performanceState.f0ExcursionSemitones*.35*Math.sin(Math.PI*phrase))/12),perturb=(hash01(cycleIndex,17)-.5)*.012,f0=baseF0*(1+perturb);phase+=f0/SR;if(phase>=1){phase-=1;cycleIndex++;}
      const attack=Math.max(1,performanceState.attackMs*SR/1000),env=Math.min(1,i/attack,(n-i)/Math.max(1,attack*1.4));
      let exc=A3.sourceSample({phase,cycleIndex,sampleIndex:globalSample,fi,voiced,fricative:false,performanceState});
      if(fric){const noise=(hash01(fi+53,globalSample)-.5)*2,p=fricativeProfile(ph);exc+=step(noise,coeff(p.center,p.bw),classState.fr)*p.gain*8;}
      if(stop){const closure=Math.max(0,1-Math.min(1,i/Math.max(1,.010*SR)));exc*=.18+.82*(1-closure);if(i<.016*SR){const noise=(hash01(fi+71,globalSample)-.5)*2,p=stopProfile(ph);exc+=step(noise,coeff(p.center,p.bw),classState.burst)*p.gain*10*(1-i/(.016*SR));}}
      const g=A2.articulatoryTargets(prev,ph,next,q);let y=exc;for(let r=0;r<3;r++)y=step(y,coeff(g.formants[r],g.bandwidths[r]),tract[r]);
      if(nasal){const p=nasalProfile(ph),pole=step(y,coeff(p.pole,90),classState.nasal),a=Math.exp(-2*Math.PI*p.zero/SR),low=onePole(y,a,classState.zero);y=.72*pole+.38*(y-low);}
      const variability=1+performanceState.energyVariance*.25*Math.sin(2*Math.PI*(.7*phrase+.11*fi)),gain=1.05-.23*clamp(performanceState.restraint,0,1);out[i]=clamp(y*performanceState.energyScale*variability*gain*env*42,-1,1);
    }
    parts.push(out);
  }
  const len=parts.reduce((s,p)=>s+p.length,0),buf=new Float32Array(len);let at=0;for(const p of parts){buf.set(p,at);at+=p.length;}return buf;
}
module.exports=Object.freeze({SR,nasalProfile,fricativeProfile,stopProfile,placeForStop,render});
