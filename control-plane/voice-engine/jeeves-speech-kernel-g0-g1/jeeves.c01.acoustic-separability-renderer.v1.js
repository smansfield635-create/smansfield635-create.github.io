'use strict';
const PLAN=require('./jeeves.c01.realization-plan.v1.js');
const SR=24000;
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function hash01(a,b){const x=Math.sin((a+1)*12.9898+(b+1)*78.233)*43758.5453;return x-Math.floor(x);}
function coeff(freq,bw){const r=Math.exp(-Math.PI*bw/SR),th=2*Math.PI*freq/SR;return{b0:1-r,a1:2*r*Math.cos(th),a2:-r*r};}
function step(x,c,s){const y=c.b0*x+c.a1*s.y1+c.a2*s.y2;s.y2=s.y1;s.y1=y;return y;}
function renderPhone(seg,index){
  const n=Math.max(1,Math.round(seg.durationMs*SR/1000)),out=new Float32Array(n),st=[{y1:0,y2:0},{y1:0,y2:0},{y1:0,y2:0}];
  const cls=PLAN.PHONE[seg.phone].class,f=seg.features; let phase=0;
  for(let i=0;i<n;i++){
    const q=i/Math.max(1,n-1),noise=(hash01(index,i)-.5)*2,env=Math.min(1,i/(.006*SR),(n-i)/(.010*SR));
    phase=(phase+100/SR)%1; const pulse=Math.max(0,Math.sin(2*Math.PI*phase)); let x=0;
    if(f.voicing) x+=pulse*.55+noise*.01;
    if(cls==='fricative') x+=noise*.34;
    if(cls==='stop'){
      if(q<f.closureFraction)x*=.025;
      else if(q<f.closureFraction+.18)x+=noise*.55*(1-(q-f.closureFraction)/.18);
    }
    if(cls==='nasal'){
      let y=step(x,coeff(f.nasalPoleHz,90),st[0]);
      y+=step(x,coeff(900,180),st[1])*.25;
      out[i]=clamp(y*11*env,-.8,.8); continue;
    }
    let F,B;
    if(cls==='vowel'||cls==='approximant'){
      F=[f.formant1Hz,f.formant2Hz,f.formant3Hz];B=[90,130,180];
    }else if(cls==='fricative'){
      F=[f.spectralCenterHz,Math.min(9000,f.spectralCenterHz+900),Math.min(10000,f.spectralCenterHz+1700)];B=[f.spectralBandwidthHz,1700,2200];
    }else if(cls==='stop'){
      F=[f.burstCenterHz,Math.min(9000,f.burstCenterHz+900),Math.min(10000,f.burstCenterHz+1800)];B=[f.burstBandwidthHz,1500,2200];
    }else {F=[500,1500,2500];B=[110,160,220];}
    let y=x;for(let k=0;k<3;k++)y=step(y,coeff(F[k],B[k]),st[k]);
    if(cls==='fricative')y+=noise*.10;
    if(cls==='stop'&&q>=f.closureFraction&&q<f.closureFraction+.18)y+=noise*.12;
    out[i]=clamp(y*14*env,-.8,.8);
  }
  return out;
}
function render(){
  const plan=PLAN.realization(),parts=[],segments=[];let sampleAt=0,phoneIndex=0;
  for(const seg of plan){
    let audio;
    if(seg.type==='WORD_GAP') audio=new Float32Array(Math.round(seg.durationMs*SR/1000));
    else audio=renderPhone(seg,phoneIndex++);
    parts.push(audio);segments.push(Object.freeze({...seg,startSample:sampleAt,endSample:sampleAt+audio.length}));sampleAt+=audio.length;
  }
  const out=new Float32Array(sampleAt);let at=0;for(const p of parts){out.set(p,at);at+=p.length;}
  return Object.freeze({sampleRate:SR,audio:out,segments:Object.freeze(segments)});
}
function featureVector(audio,start,end){
  let e=0,zc=0,lo=0,hi=0;for(let i=start;i<end;i++){const x=audio[i];e+=x*x;if(i>start&&Math.sign(audio[i-1])!==Math.sign(x))zc++;if(i>start){const d=x-audio[i-1];hi+=d*d;lo+=x*x;}}
  const n=Math.max(1,end-start);return Object.freeze({rms:Math.sqrt(e/n),zcr:zc/n,hfRatio:hi/Math.max(1e-12,lo)});
}
module.exports=Object.freeze({SR,render,featureVector});
