import {getHEarthCanonicalShorelineZ} from '../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const STAGES=Object.freeze([
  ['CANVAS_ACQUIRED',8,'Preparing world surface'],
  ['WEBGL2_CONTEXT_REQUESTED',14,'Starting graphics engine'],
  ['WEBGL2_CONTEXT_ACQUIRED',22,'Graphics engine online'],
  ['WEBGL_IDENTITY_CAPTURED',28,'Reading device capabilities'],
  ['RENDERER_CONSTRUCTOR_ENTERED',34,'Constructing world renderer'],
  ['RENDERER_CONSTRUCTOR_RETURNED',40,'Renderer constructed'],
  ['INITIALIZATION_ENTERED',46,'Initializing environment'],
  ['VERTEX_SHADER_COMPILED',54,'Preparing world geometry'],
  ['FRAGMENT_SHADER_COMPILED',60,'Preparing light and atmosphere'],
  ['PROGRAM_LINKED',66,'Linking GPU presentation'],
  ['GPU_RESOURCES_CREATED',74,'Loading world resources'],
  ['FRAMEBUFFER_VALIDATED',82,'Validating display surface'],
  ['INITIAL_DRAW_ENTERED',88,'Drawing first world frame'],
  ['INITIAL_DRAW_RETURNED',92,'First draw complete'],
  ['FIRST_FRAME_PRESENTED',97,'Presenting H-Earth'],
  ['READY_PUBLISHED',100,'H-Earth ready']
]);
const PROGRESS=Object.freeze(Object.fromEntries(STAGES.map(([stage,value])=>[stage,value])));
const LABEL=Object.freeze(Object.fromEntries(STAGES.map(([stage,,label])=>[stage,label])));
const NEXT_LIMIT=Object.freeze(Object.fromEntries(STAGES.map(([stage,value],index)=>[stage,(STAGES[index+1]?.[1]??100)-1])));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

const style=document.createElement('style');
style.textContent=`
.h-earth-experience-loader{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 70%,rgba(18,67,79,.34),transparent 40%),linear-gradient(180deg,#07151d 0%,#082431 52%,#07161b 100%);color:#eef8f6;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transition:opacity .5s ease,visibility .5s ease}
.h-earth-experience-loader[data-ready="true"]{opacity:0;visibility:hidden;pointer-events:none}
.h-earth-experience-loader__card{width:min(760px,92vw);padding:clamp(24px,5vw,48px);border:1px solid rgba(220,242,238,.22);border-radius:28px;background:rgba(2,13,18,.72);box-shadow:0 30px 100px rgba(0,0,0,.44);backdrop-filter:blur(16px)}
.h-earth-experience-loader__eyebrow{margin:0 0 12px;color:#bde7db;font-size:.72rem;font-weight:900;letter-spacing:.17em;text-transform:uppercase}
.h-earth-experience-loader__headline{margin:0;font-size:clamp(2rem,7vw,4.8rem);line-height:.92;letter-spacing:-.055em}
.h-earth-experience-loader__status{margin:18px 0 0;color:rgba(238,248,246,.8);font-size:clamp(.96rem,2vw,1.12rem)}
.h-earth-experience-loader__rail{position:relative;height:13px;margin-top:26px;overflow:hidden;border:1px solid rgba(220,242,238,.22);border-radius:999px;background:rgba(255,255,255,.06)}
.h-earth-experience-loader__fill{position:relative;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#4da8b6,#8ed6c1,#d9f5e8);box-shadow:0 0 28px rgba(122,220,198,.44);transition:width .3s cubic-bezier(.2,.8,.2,1)}
.h-earth-experience-loader__fill::after{content:"";position:absolute;inset:-2px;width:42%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent);transform:translateX(-140%);animation:hEarthStageActivity 1.25s linear infinite}
@keyframes hEarthStageActivity{to{transform:translateX(340%)}}
.h-earth-experience-loader__meta{display:flex;justify-content:space-between;gap:18px;align-items:baseline;margin-top:12px}
.h-earth-experience-loader__percent{font-variant-numeric:tabular-nums;font-size:clamp(2rem,6vw,4.6rem);font-weight:900;letter-spacing:-.06em}
.h-earth-experience-loader__note{max-width:31rem;color:rgba(238,248,246,.6);font-size:.76rem;line-height:1.45;text-align:right}
.h-earth-experience-loader__steps{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-top:18px}
.h-earth-experience-loader__step{height:4px;border-radius:999px;background:rgba(255,255,255,.09)}
.h-earth-experience-loader__step[data-state="done"]{background:rgba(146,224,201,.78)}
.h-earth-experience-loader__step[data-state="active"]{background:rgba(218,247,237,.92);box-shadow:0 0 14px rgba(150,226,204,.5);animation:hEarthStepPulse 1s ease-in-out infinite alternate}
@keyframes hEarthStepPulse{from{opacity:.48}to{opacity:1}}
.h-earth-experience-audio{position:fixed;right:14px;bottom:14px;z-index:2147483000;width:42px;height:42px;border:1px solid rgba(220,242,238,.18);border-radius:50%;background:rgba(2,10,14,.58);backdrop-filter:blur(10px);box-shadow:0 10px 28px rgba(0,0,0,.24);opacity:.58;transition:opacity .18s ease,background .18s ease}
.h-earth-experience-audio:hover,.h-earth-experience-audio:focus-within{opacity:1}
.h-earth-experience-audio button{position:absolute;inset:0;border:0;border-radius:50%;background:transparent;color:#e8f4f1;cursor:pointer;font:800 0/1 sans-serif}
.h-earth-experience-audio button::before{content:"";position:absolute;left:11px;top:15px;width:8px;height:12px;background:currentColor;clip-path:polygon(0 30%,45% 30%,100% 0,100% 100%,45% 70%,0 70%)}
.h-earth-experience-audio button::after{content:"";position:absolute;left:22px;top:14px;width:9px;height:14px;border:2px solid currentColor;border-left:0;border-top-color:transparent;border-bottom-color:transparent;border-radius:0 50% 50% 0;opacity:.8}
.h-earth-experience-audio[data-muted="true"] button::after{border:0;width:12px;height:2px;left:21px;top:20px;background:currentColor;transform:rotate(-45deg)}
@media(max-width:520px){.h-earth-experience-loader__meta{align-items:flex-start;flex-direction:column}.h-earth-experience-loader__note{text-align:left}.h-earth-experience-audio{right:9px;bottom:9px}}
${reducedMotion?'.h-earth-experience-loader,.h-earth-experience-loader__fill{transition:none!important}.h-earth-experience-loader__fill::after,.h-earth-experience-loader__step{animation:none!important}':''}
`;
document.head.appendChild(style);

const loader=document.createElement('div');
loader.className='h-earth-experience-loader';
loader.setAttribute('role','status');
loader.setAttribute('aria-live','polite');
loader.innerHTML=`<div class="h-earth-experience-loader__card"><p class="h-earth-experience-loader__eyebrow">H-Earth · live world initialization</p><h1 class="h-earth-experience-loader__headline">Entering the coast.</h1><p class="h-earth-experience-loader__status">Preparing browser-native world runtime</p><div class="h-earth-experience-loader__rail" aria-hidden="true"><div class="h-earth-experience-loader__fill"></div></div><div class="h-earth-experience-loader__meta"><strong class="h-earth-experience-loader__percent">0%</strong><span class="h-earth-experience-loader__note">The number is the verified startup floor. Motion within each band means the current renderer stage is still actively working.</span></div><div class="h-earth-experience-loader__steps" aria-hidden="true">${'<i class="h-earth-experience-loader__step"></i>'.repeat(5)}</div></div>`;
document.body.appendChild(loader);
const fill=loader.querySelector('.h-earth-experience-loader__fill');
const percentNode=loader.querySelector('.h-earth-experience-loader__percent');
const statusNode=loader.querySelector('.h-earth-experience-loader__status');
const stepNodes=[...loader.querySelectorAll('.h-earth-experience-loader__step')];
let verifiedProgress=0;
let displayedProgress=0;
let activeStage='';
let activeCeiling=0;
let readyHideTimer=0;
let activityTimer=0;

function updateLoaderVisual(){
  fill.style.width=`${displayedProgress}%`;
  percentNode.textContent=`${Math.floor(displayedProgress)}%`;
  const group=Math.min(4,Math.floor(displayedProgress/20));
  stepNodes.forEach((node,index)=>node.dataset.state=index<group?'done':index===group?'active':'pending');
}
function startBoundedActivity(stage){
  clearInterval(activityTimer);
  activeStage=stage;
  activeCeiling=Math.max(verifiedProgress,NEXT_LIMIT[stage]??verifiedProgress);
  if(reducedMotion||activeCeiling<=verifiedProgress)return;
  activityTimer=setInterval(()=>{
    if(displayedProgress>=activeCeiling)return;
    displayedProgress=Math.min(activeCeiling,displayedProgress+1);
    updateLoaderVisual();
  },520);
}
function renderReceipt(receipt){
  if(!receipt?.stages)return;
  let progress=0;
  let stage='';
  let label='Preparing browser-native world runtime';
  let failedStage=null;
  for(const [name,status] of Object.entries(receipt.stages)){
    if(status==='PASS'){
      progress=Math.max(progress,PROGRESS[name]??0);
      stage=name;
      label=LABEL[name]??label;
    }else if(status==='FAIL'){
      failedStage=name;
      break;
    }
  }
  verifiedProgress=Math.max(verifiedProgress,progress);
  displayedProgress=Math.max(displayedProgress,verifiedProgress);
  updateLoaderVisual();
  if(failedStage){
    clearInterval(activityTimer);
    statusNode.textContent=`Startup held at ${LABEL[failedStage]??failedStage}`;
    loader.dataset.failed='true';
    return;
  }
  statusNode.textContent=label;
  if(stage&&stage!==activeStage)startBoundedActivity(stage);
  if(verifiedProgress>=100){
    clearInterval(activityTimer);
    displayedProgress=100;
    updateLoaderVisual();
    clearTimeout(readyHideTimer);
    readyHideTimer=setTimeout(()=>{loader.dataset.ready='true';setTimeout(()=>loader.remove(),700);},reducedMotion?0:420);
  }
}
window.addEventListener('h-earth-renderer-startup-receipt',event=>renderReceipt(event.detail));
renderReceipt(window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.());

const audioUi=document.createElement('div');
audioUi.className='h-earth-experience-audio';
audioUi.innerHTML='<button type="button" aria-label="Mute environmental sound" aria-pressed="false"></button>';
document.body.appendChild(audioUi);
const audioButton=audioUi.querySelector('button');
let audioContext=null;
let master=null;
let breakGain=null;
let washGain=null;
let windGain=null;
let audioStarted=false;
let audioMuted=false;
let proximityTimer=0;

function createNoiseBuffer(context,seconds=6){
  const buffer=context.createBuffer(1,Math.max(1,Math.floor(context.sampleRate*seconds)),context.sampleRate);
  const channel=buffer.getChannelData(0);
  let brown=0;
  for(let i=0;i<channel.length;i++){
    const white=Math.random()*2-1;
    brown=(brown+0.025*white)/1.025;
    channel[i]=Math.max(-1,Math.min(1,white*.33+brown*2.4));
  }
  return buffer;
}
function makeLoop(context,buffer){const source=context.createBufferSource();source.buffer=buffer;source.loop=true;return source;}
function makeLfo(context,frequency,depth,target){
  const osc=context.createOscillator();
  const gain=context.createGain();
  osc.frequency.value=frequency;gain.gain.value=depth;
  osc.connect(gain).connect(target);osc.start();
}
function setAudioMix(breakLevel,washLevel,windLevel){
  if(!audioContext||!breakGain||!washGain||!windGain)return;
  const now=audioContext.currentTime;
  for(const [node,value] of [[breakGain,breakLevel],[washGain,washLevel],[windGain,windLevel]]){
    node.gain.cancelScheduledValues(now);
    node.gain.setTargetAtTime(audioMuted?0:value,now,.28);
  }
}
function updateProximity(){
  const api=window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F;
  const p=api?.getSnapshot?.()?.state?.position;
  let distance=0;
  if(Number.isFinite(p?.x)&&Number.isFinite(p?.z)){
    const shorelineZ=getHEarthCanonicalShorelineZ(p.x);
    distance=Number.isFinite(shorelineZ)?Math.abs(p.z-shorelineZ):0;
  }
  const coastal=Math.max(0,Math.min(1,1-distance/320));
  const near=coastal*coastal;
  setAudioMix(.18+.34*near,.15+.22*coastal,.055+.07*(1-coastal));
}
async function startAudio(){
  if(audioStarted){if(audioContext?.state==='suspended')await audioContext.resume();return;}
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx)return;
  audioContext=new Ctx();
  const compressor=audioContext.createDynamicsCompressor();
  compressor.threshold.value=-18;compressor.knee.value=14;compressor.ratio.value=4;compressor.attack.value=.02;compressor.release.value=.45;
  master=audioContext.createGain();master.gain.value=.72;master.connect(compressor).connect(audioContext.destination);
  const buffer=createNoiseBuffer(audioContext);

  const breaking=makeLoop(audioContext,buffer);
  const breakFilter=audioContext.createBiquadFilter();breakFilter.type='bandpass';breakFilter.frequency.value=920;breakFilter.Q.value=.5;
  breakGain=audioContext.createGain();breakGain.gain.value=.36;
  breaking.connect(breakFilter).connect(breakGain).connect(master);
  makeLfo(audioContext,.13,.12,breakGain.gain);

  const wash=makeLoop(audioContext,buffer);
  const washFilter=audioContext.createBiquadFilter();washFilter.type='lowpass';washFilter.frequency.value=330;washFilter.Q.value=.3;
  washGain=audioContext.createGain();washGain.gain.value=.24;
  wash.connect(washFilter).connect(washGain).connect(master);
  makeLfo(audioContext,.075,.075,washGain.gain);

  const wind=makeLoop(audioContext,buffer);
  const windFilter=audioContext.createBiquadFilter();windFilter.type='bandpass';windFilter.frequency.value=1450;windFilter.Q.value=.22;
  windGain=audioContext.createGain();windGain.gain.value=.07;
  wind.connect(windFilter).connect(windGain).connect(master);
  makeLfo(audioContext,.045,.025,windGain.gain);

  breaking.start();wash.start();wind.start();
  audioStarted=true;
  audioButton.setAttribute('aria-pressed','false');
  audioButton.setAttribute('aria-label','Mute environmental sound');
  updateProximity();
  proximityTimer=setInterval(updateProximity,450);
}
const unlock=()=>startAudio().catch(()=>{});
for(const type of ['pointerdown','touchstart','keydown'])window.addEventListener(type,unlock,{once:true,passive:type!=='keydown',capture:true});
audioButton.addEventListener('click',async event=>{
  event.stopPropagation();
  const wasStarted=audioStarted;
  await startAudio();
  if(!wasStarted)return;
  audioMuted=!audioMuted;
  audioUi.dataset.muted=audioMuted?'true':'false';
  audioButton.setAttribute('aria-pressed',audioMuted?'true':'false');
  audioButton.setAttribute('aria-label',audioMuted?'Enable environmental sound':'Mute environmental sound');
  updateProximity();
});
document.addEventListener('visibilitychange',()=>{
  if(!audioContext||!master)return;
  master.gain.setTargetAtTime(document.hidden?0:(audioMuted?0:.72),audioContext.currentTime,.2);
});
window.addEventListener('beforeunload',()=>{clearInterval(activityTimer);clearInterval(proximityTimer);audioContext?.close?.();},{once:true});

window.H_EARTH_EXPERIENCE_LAYER=Object.freeze({
  version:'H_EARTH_EXPERIENCE_LAYER_23949_SUCCESSOR_v2',
  verifiedMilestoneProgress:true,
  boundedStageActivity:true,
  proceduralEnvironmentalAudio:true,
  canonicalCoastProximityAudio:true,
  discreetAudioControl:true,
  geometryMutated:false,
  rendererMutated:false,
  get verifiedProgress(){return verifiedProgress;},
  get displayedProgress(){return displayedProgress;}
});
