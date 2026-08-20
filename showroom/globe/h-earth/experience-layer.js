import {getHEarthCanonicalShorelineZ} from '../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const STAGE_PROGRESS=Object.freeze({
  CANVAS_ACQUIRED:8,
  WEBGL2_CONTEXT_REQUESTED:14,
  WEBGL2_CONTEXT_ACQUIRED:22,
  WEBGL_IDENTITY_CAPTURED:28,
  RENDERER_CONSTRUCTOR_ENTERED:34,
  RENDERER_CONSTRUCTOR_RETURNED:40,
  INITIALIZATION_ENTERED:46,
  VERTEX_SHADER_COMPILED:54,
  FRAGMENT_SHADER_COMPILED:60,
  PROGRAM_LINKED:66,
  GPU_RESOURCES_CREATED:74,
  FRAMEBUFFER_VALIDATED:82,
  INITIAL_DRAW_ENTERED:88,
  INITIAL_DRAW_RETURNED:92,
  FIRST_FRAME_PRESENTED:97,
  READY_PUBLISHED:100
});
const STAGE_LABEL=Object.freeze({
  CANVAS_ACQUIRED:'Preparing world surface',
  WEBGL2_CONTEXT_REQUESTED:'Starting graphics engine',
  WEBGL2_CONTEXT_ACQUIRED:'Graphics engine online',
  WEBGL_IDENTITY_CAPTURED:'Reading device capabilities',
  RENDERER_CONSTRUCTOR_ENTERED:'Constructing world renderer',
  RENDERER_CONSTRUCTOR_RETURNED:'Renderer constructed',
  INITIALIZATION_ENTERED:'Initializing environment',
  VERTEX_SHADER_COMPILED:'Preparing world geometry',
  FRAGMENT_SHADER_COMPILED:'Preparing light and atmosphere',
  PROGRAM_LINKED:'Linking GPU presentation',
  GPU_RESOURCES_CREATED:'Loading world resources',
  FRAMEBUFFER_VALIDATED:'Validating display surface',
  INITIAL_DRAW_ENTERED:'Drawing first world frame',
  INITIAL_DRAW_RETURNED:'First draw complete',
  FIRST_FRAME_PRESENTED:'World visible',
  READY_PUBLISHED:'H-Earth ready'
});

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const style=document.createElement('style');
style.textContent=`
.h-earth-experience-loader{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 70%,rgba(18,67,79,.34),transparent 40%),linear-gradient(180deg,#07151d 0%,#082431 52%,#07161b 100%);color:#eef8f6;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transition:opacity .5s ease,visibility .5s ease}
.h-earth-experience-loader[data-ready="true"]{opacity:0;visibility:hidden;pointer-events:none}
.h-earth-experience-loader__card{width:min(760px,92vw);padding:clamp(24px,5vw,48px);border:1px solid rgba(220,242,238,.22);border-radius:28px;background:rgba(2,13,18,.72);box-shadow:0 30px 100px rgba(0,0,0,.44);backdrop-filter:blur(16px)}
.h-earth-experience-loader__eyebrow{margin:0 0 12px;color:#bde7db;font-size:.72rem;font-weight:900;letter-spacing:.17em;text-transform:uppercase}
.h-earth-experience-loader__headline{margin:0;font-size:clamp(2rem,7vw,4.8rem);line-height:.92;letter-spacing:-.055em}
.h-earth-experience-loader__status{margin:18px 0 0;color:rgba(238,248,246,.78);font-size:clamp(.96rem,2vw,1.12rem)}
.h-earth-experience-loader__rail{position:relative;height:12px;margin-top:26px;overflow:hidden;border:1px solid rgba(220,242,238,.2);border-radius:999px;background:rgba(255,255,255,.06)}
.h-earth-experience-loader__fill{height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#4da8b6,#8ed6c1,#d9f5e8);box-shadow:0 0 28px rgba(122,220,198,.44);transition:width .32s cubic-bezier(.2,.8,.2,1)}
.h-earth-experience-loader__meta{display:flex;justify-content:space-between;gap:18px;align-items:baseline;margin-top:12px}
.h-earth-experience-loader__percent{font-variant-numeric:tabular-nums;font-size:clamp(2rem,6vw,4.6rem);font-weight:900;letter-spacing:-.06em}
.h-earth-experience-loader__note{max-width:30rem;color:rgba(238,248,246,.58);font-size:.76rem;line-height:1.45;text-align:right}
.h-earth-experience-audio{position:fixed;right:14px;bottom:14px;z-index:2147483000;display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid rgba(220,242,238,.2);border-radius:999px;background:rgba(2,10,14,.72);backdrop-filter:blur(12px);color:#e8f4f1;font:750 .72rem/1 Inter,ui-sans-serif,system-ui;box-shadow:0 12px 34px rgba(0,0,0,.28)}
.h-earth-experience-audio button{border:0;border-radius:999px;padding:7px 10px;color:inherit;background:rgba(255,255,255,.08);font:inherit;cursor:pointer}
.h-earth-experience-audio output{min-width:5.4rem;color:rgba(232,244,241,.72);font-variant-numeric:tabular-nums}
@media(max-width:520px){.h-earth-experience-loader__meta{align-items:flex-start;flex-direction:column}.h-earth-experience-loader__note{text-align:left}.h-earth-experience-audio{right:8px;bottom:8px}}
${reducedMotion?'.h-earth-experience-loader,.h-earth-experience-loader__fill{transition:none!important}':''}
`;
document.head.appendChild(style);

const loader=document.createElement('div');
loader.className='h-earth-experience-loader';
loader.setAttribute('role','status');
loader.setAttribute('aria-live','polite');
loader.innerHTML=`<div class="h-earth-experience-loader__card"><p class="h-earth-experience-loader__eyebrow">H-Earth · live world initialization</p><h1 class="h-earth-experience-loader__headline">Entering the coast.</h1><p class="h-earth-experience-loader__status">Preparing browser-native world runtime</p><div class="h-earth-experience-loader__rail" aria-hidden="true"><div class="h-earth-experience-loader__fill"></div></div><div class="h-earth-experience-loader__meta"><strong class="h-earth-experience-loader__percent">0%</strong><span class="h-earth-experience-loader__note">Progress reflects actual renderer startup stages. Environmental audio begins after your first interaction.</span></div></div>`;
document.body.appendChild(loader);
const fill=loader.querySelector('.h-earth-experience-loader__fill');
const percentNode=loader.querySelector('.h-earth-experience-loader__percent');
const statusNode=loader.querySelector('.h-earth-experience-loader__status');
let displayedProgress=0;
let readyHideTimer=0;

function renderReceipt(receipt){
  if(!receipt?.stages)return;
  let progress=0;
  let label='Preparing browser-native world runtime';
  let failedStage=null;
  for(const [stage,status] of Object.entries(receipt.stages)){
    if(status==='PASS'){
      progress=Math.max(progress,STAGE_PROGRESS[stage]??0);
      label=STAGE_LABEL[stage]??label;
    }else if(status==='FAIL'){
      failedStage=stage;
      break;
    }
  }
  displayedProgress=Math.max(displayedProgress,progress);
  fill.style.width=`${displayedProgress}%`;
  percentNode.textContent=`${displayedProgress}%`;
  if(failedStage){
    statusNode.textContent=`Startup held at ${STAGE_LABEL[failedStage]??failedStage}`;
    loader.dataset.failed='true';
    return;
  }
  statusNode.textContent=label;
  if(displayedProgress>=100){
    clearTimeout(readyHideTimer);
    readyHideTimer=setTimeout(()=>{loader.dataset.ready='true';setTimeout(()=>loader.remove(),700);},reducedMotion?0:420);
  }
}
window.addEventListener('h-earth-renderer-startup-receipt',event=>renderReceipt(event.detail));
renderReceipt(window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.());

const audioUi=document.createElement('div');
audioUi.className='h-earth-experience-audio';
audioUi.innerHTML='<button type="button" aria-pressed="false">Sound: ready</button><output>coastal mix</output>';
document.body.appendChild(audioUi);
const audioButton=audioUi.querySelector('button');
const proximityOutput=audioUi.querySelector('output');
let audioContext=null;
let master=null;
let surfGain=null;
let windGain=null;
let audioStarted=false;
let audioMuted=false;
let proximityTimer=0;

function createNoiseBuffer(context,seconds=4){
  const buffer=context.createBuffer(1,Math.max(1,Math.floor(context.sampleRate*seconds)),context.sampleRate);
  const channel=buffer.getChannelData(0);
  let previous=0;
  for(let i=0;i<channel.length;i++){
    const white=Math.random()*2-1;
    previous=previous*.985+white*.015;
    channel[i]=white*.46+previous*.54;
  }
  return buffer;
}
function makeLoop(context,buffer){const source=context.createBufferSource();source.buffer=buffer;source.loop=true;return source;}
function setAudioMix(surf,wind){
  if(!audioContext||!surfGain||!windGain)return;
  const now=audioContext.currentTime;
  surfGain.gain.cancelScheduledValues(now);windGain.gain.cancelScheduledValues(now);
  surfGain.gain.linearRampToValueAtTime(surf,now+.35);
  windGain.gain.linearRampToValueAtTime(wind,now+.35);
}
function updateProximity(){
  const api=window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F;
  const snapshot=api?.getSnapshot?.();
  const p=snapshot?.state?.position;
  let distance=0;
  if(Number.isFinite(p?.x)&&Number.isFinite(p?.z)){
    const shorelineZ=getHEarthCanonicalShorelineZ(p.x);
    distance=Number.isFinite(shorelineZ)?Math.abs(p.z-shorelineZ):0;
  }
  const coastal=Math.max(0,Math.min(1,1-distance/260));
  const surf=.035+.19*(coastal*coastal);
  const wind=.07+.045*(1-coastal);
  setAudioMix(audioMuted?0:surf,audioMuted?0:wind);
  proximityOutput.value=distance>0?`${Math.round(distance)}m coast`:'coastal mix';
}
async function startAudio(){
  if(audioStarted){
    if(audioContext?.state==='suspended')await audioContext.resume();
    return;
  }
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx){audioButton.textContent='Sound unavailable';return;}
  audioContext=new Ctx();
  master=audioContext.createGain();master.gain.value=.42;master.connect(audioContext.destination);
  const buffer=createNoiseBuffer(audioContext);

  const surf=makeLoop(audioContext,buffer);
  const surfFilter=audioContext.createBiquadFilter();surfFilter.type='bandpass';surfFilter.frequency.value=620;surfFilter.Q.value=.65;
  surfGain=audioContext.createGain();surfGain.gain.value=.15;
  surf.connect(surfFilter).connect(surfGain).connect(master);
  const swell=audioContext.createOscillator();const swellDepth=audioContext.createGain();swell.frequency.value=.11;swellDepth.gain.value=.055;swell.connect(swellDepth).connect(surfGain.gain);

  const wind=makeLoop(audioContext,buffer);
  const windFilter=audioContext.createBiquadFilter();windFilter.type='lowpass';windFilter.frequency.value=780;windFilter.Q.value=.35;
  windGain=audioContext.createGain();windGain.gain.value=.08;
  wind.connect(windFilter).connect(windGain).connect(master);

  surf.start();wind.start();swell.start();
  audioStarted=true;
  audioButton.textContent='Sound: on';audioButton.setAttribute('aria-pressed','true');
  updateProximity();
  proximityTimer=setInterval(updateProximity,500);
}

const unlock=()=>startAudio().catch(()=>{});
for(const type of ['pointerdown','touchstart','keydown'])window.addEventListener(type,unlock,{once:true,passive:type!=='keydown',capture:true});
audioButton.addEventListener('click',async event=>{
  event.stopPropagation();
  await startAudio();
  audioMuted=!audioMuted;
  audioButton.textContent=audioMuted?'Sound: off':'Sound: on';
  audioButton.setAttribute('aria-pressed',audioMuted?'false':'true');
  updateProximity();
});
document.addEventListener('visibilitychange',()=>{
  if(!audioContext||!master)return;
  const target=document.hidden?0:(audioMuted?0:.42);
  master.gain.setTargetAtTime(target,audioContext.currentTime,.2);
});
window.addEventListener('beforeunload',()=>{clearInterval(proximityTimer);audioContext?.close?.();},{once:true});

window.H_EARTH_EXPERIENCE_LAYER=Object.freeze({
  version:'H_EARTH_EXPERIENCE_LAYER_23949_SUCCESSOR_v1',
  milestoneProgress:true,
  proceduralEnvironmentalAudio:true,
  canonicalCoastProximityAudio:true,
  geometryMutated:false,
  rendererMutated:false,
  get progress(){return displayedProgress;}
});
