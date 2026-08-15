'use strict';

const SR = 24000;

const FORMANTS = Object.freeze({
  AA: [730,1090,2440], AE:[660,1720,2410], AH:[640,1190,2390], AO:[570,840,2410],
  EH:[530,1840,2480], ER:[490,1350,1690], IH:[400,1990,2550], IY:[270,2290,3010],
  OW:[570,840,2410], UH:[440,1020,2240], UW:[300,870,2240], AY:[650,1500,2500],
  EY:[500,1900,2600]
});
const BW = Object.freeze([90,120,160]);
const VOWELS = new Set(Object.keys(FORMANTS));
const SONORANTS = new Set(['R','L','W','Y','M','N','NG']);
const FRICATIVES = new Set(['F','V','S','Z','SH','ZH','TH','DH','H']);
const STOPS = new Set(['P','B','T','D','K','G']);

function clamp(x,a,b){ return Math.max(a,Math.min(b,x)); }
function smoothstep(x){ x=clamp(x,0,1); return x*x*(3-2*x); }
function hash01(a,b){ const x=Math.sin((a+1)*12.9898+(b+1)*78.233)*43758.5453; return x-Math.floor(x); }
function lerp(a,b,t){ return a+(b-a)*t; }

function rosenbergPulse(phase,openQ=0.58,closeQ=0.18){
  phase=((phase%1)+1)%1;
  if(phase<openQ){ const q=phase/openQ; return 0.5*(1-Math.cos(Math.PI*q)); }
  if(phase<openQ+closeQ){ const q=(phase-openQ)/closeQ; return Math.cos(0.5*Math.PI*q); }
  return 0;
}

function resonatorCoeffs(freq,bw){
  const r=Math.exp(-Math.PI*bw/SR);
  const theta=2*Math.PI*freq/SR;
  const a1=2*r*Math.cos(theta), a2=-r*r;
  const b0=1-r;
  return {b0,a1,a2};
}

function stepResonator(x,c,s){
  const y=c.b0*x+c.a1*s.y1+c.a2*s.y2;
  s.y2=s.y1; s.y1=y; return y;
}

function targetFormants(ph){ return FORMANTS[ph] || FORMANTS.AH; }
function targetBandwidths(ph){
  if(ph==='M'||ph==='N'||ph==='NG') return [110,150,210];
  if(SONORANTS.has(ph)) return [100,135,180];
  return BW;
}

function interpolateTargets(prev,cur,next,t){
  const C=targetFormants(cur), P=targetFormants(prev||cur), N=targetFormants(next||cur);
  const edge=0.22;
  if(t<edge){ const u=smoothstep(t/edge); return C.map((v,i)=>lerp(P[i],v,u)); }
  if(t>1-edge){ const u=smoothstep((t-(1-edge))/edge); return C.map((v,i)=>lerp(v,N[i],u)); }
  return C;
}

function validateInputs(performanceState, phonemeFrames){
  if(!performanceState || typeof performanceState!=='object') throw new Error('PERFORMANCE_STATE_REQUIRED');
  for(const k of ['f0CenterHz','f0ExcursionSemitones','energyScale','energyVariance','attackMs','restraint','urgency']){
    if(!Number.isFinite(performanceState[k])) throw new Error(`PERFORMANCE_STATE_${k}_INVALID`);
  }
  if(!Array.isArray(phonemeFrames)||phonemeFrames.length===0) throw new Error('PHONEME_FRAMES_REQUIRED');
  for(const f of phonemeFrames){
    if(!f || typeof f.phoneme!=='string' || !Number.isFinite(f.durationMs) || f.durationMs<=0) throw new Error('PHONEME_FRAME_INVALID');
  }
}

function render(performanceState, phonemeFrames){
  validateInputs(performanceState,phonemeFrames);
  const parts=[]; let globalSample=0; let phase=0;
  const states=[{y1:0,y2:0},{y1:0,y2:0},{y1:0,y2:0}];
  const totalSamples=Math.max(1,phonemeFrames.reduce((s,x)=>s+Math.round(x.durationMs*SR/1000),0));
  for(let fi=0;fi<phonemeFrames.length;fi++){
    const frame=phonemeFrames[fi], ph=frame.phoneme;
    const prev=phonemeFrames[fi-1]?.phoneme, next=phonemeFrames[fi+1]?.phoneme;
    const n=Math.max(1,Math.round(frame.durationMs*SR/1000));
    const out=new Float32Array(n);
    const voiced=VOWELS.has(ph)||SONORANTS.has(ph)||['B','D','G','V','Z','ZH','DH','JH'].includes(ph);
    const fric=FRICATIVES.has(ph)||['CH','JH'].includes(ph);
    const stop=STOPS.has(ph);
    for(let i=0;i<n;i++,globalSample++){
      const q=i/Math.max(1,n-1);
      const phrase=globalSample/Math.max(1,totalSamples-1);
      const semitoneSwing=performanceState.f0ExcursionSemitones*(0.35*Math.sin(Math.PI*phrase));
      const f0=performanceState.f0CenterHz*Math.pow(2,semitoneSwing/12);
      phase += f0/SR; if(phase>=1) phase-=1;
      const attack=Math.max(1,performanceState.attackMs*SR/1000);
      const env=Math.min(1,i/attack,(n-i)/Math.max(attack*1.4,1));
      const noise=(hash01(fi,globalSample)-0.5)*2;
      let exc=0;
      if(voiced) exc += rosenbergPulse(phase)*0.78 + noise*0.025;
      if(fric) exc += noise*(ph==='H'?0.16:0.42);
      if(stop && i<Math.min(n,Math.round(0.018*SR))) exc += noise*0.55*(1-i/Math.max(1,Math.round(0.018*SR)));
      if(!voiced && !fric && !stop) exc += noise*0.08;
      const F=interpolateTargets(prev,ph,next,q), B=targetBandwidths(ph);
      let y=exc;
      for(let r=0;r<3;r++) y=stepResonator(y,resonatorCoeffs(F[r],B[r]),states[r]);
      const variability=1+performanceState.energyVariance*0.25*Math.sin(2*Math.PI*(0.7*phrase+0.11*fi));
      const restraintGain=lerp(1.05,0.82,clamp(performanceState.restraint,0,1));
      out[i]=clamp(y*performanceState.energyScale*variability*restraintGain*env*52,-1,1);
    }
    parts.push(out);
  }
  const total=parts.reduce((s,p)=>s+p.length,0), result=new Float32Array(total); let at=0;
  for(const p of parts){ result.set(p,at); at+=p.length; }
  return result;
}

function metrics(buf){
  let sum=0, peak=0, zc=0;
  for(let i=0;i<buf.length;i++){ const x=buf[i]; sum+=x*x; peak=Math.max(peak,Math.abs(x)); if(i&&Math.sign(buf[i-1])!==Math.sign(x)) zc++; }
  return Object.freeze({sampleRate:SR,sampleCount:buf.length,durationSeconds:buf.length/SR,rms:Math.sqrt(sum/Math.max(1,buf.length)),peak,zeroCrossingRate:zc/Math.max(1,buf.length)});
}

module.exports=Object.freeze({SR,FORMANTS,rosenbergPulse,resonatorCoeffs,interpolateTargets,render,metrics});
