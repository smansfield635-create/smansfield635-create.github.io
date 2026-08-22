const loader=document.querySelector('[data-audralia-loader]');
const originalPanel=loader?.querySelector('.audralia-loading-panel');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const gaProofMode=(()=>{try{return new URLSearchParams(location.search).get('gaProof')==='1';}catch(_error){return false;}})();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

const style=document.createElement('style');
style.textContent=`
.audralia-experience-loader{position:fixed!important;inset:0!important;z-index:2147483600!important;display:grid!important;place-items:center!important;padding:24px!important;background:radial-gradient(circle at 50% 70%,rgba(18,67,79,.34),transparent 40%),linear-gradient(180deg,#07151d 0%,#082431 52%,#07161b 100%)!important;color:#eef8f6!important;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;transition:opacity .5s ease,visibility .5s ease!important}
.audralia-experience-loader[data-ready="true"]{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
.audralia-experience-loader[data-failed="true"]{opacity:1!important;visibility:visible!important;pointer-events:auto!important}
.audralia-experience-loader__card{width:min(760px,92vw);padding:clamp(24px,5vw,48px);border:1px solid rgba(220,242,238,.22);border-radius:28px;background:rgba(2,13,18,.72);box-shadow:0 30px 100px rgba(0,0,0,.44);backdrop-filter:blur(16px)}
.audralia-experience-loader__eyebrow{margin:0 0 12px;color:#bde7db;font-size:.72rem;font-weight:900;letter-spacing:.17em;text-transform:uppercase}
.audralia-experience-loader__headline{margin:0;font-size:clamp(2rem,7vw,4.8rem);line-height:.92;letter-spacing:-.055em}
.audralia-experience-loader__status{margin:18px 0 0;color:rgba(238,248,246,.8);font-size:clamp(.96rem,2vw,1.12rem)}
.audralia-experience-loader__rail{position:relative;height:13px;margin-top:26px;overflow:hidden;border:1px solid rgba(220,242,238,.22);border-radius:999px;background:rgba(255,255,255,.06)}
.audralia-experience-loader__fill{position:relative;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#4da8b6,#8ed6c1,#d9f5e8);box-shadow:0 0 28px rgba(122,220,198,.44);transition:width .3s cubic-bezier(.2,.8,.2,1)}
.audralia-experience-loader__fill::after{content:"";position:absolute;inset:-2px;width:42%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent);transform:translateX(-140%);animation:audraliaStageActivity 1.25s linear infinite}
@keyframes audraliaStageActivity{to{transform:translateX(340%)}}
.audralia-experience-loader__meta{display:flex;justify-content:space-between;gap:18px;align-items:baseline;margin-top:12px}
.audralia-experience-loader__percent{font-variant-numeric:tabular-nums;font-size:clamp(2rem,6vw,4.6rem);font-weight:900;letter-spacing:-.06em}
.audralia-experience-loader__note{max-width:31rem;color:rgba(238,248,246,.6);font-size:.76rem;line-height:1.45;text-align:right}
.audralia-experience-loader__steps{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-top:18px}
.audralia-experience-loader__step{height:4px;border-radius:999px;background:rgba(255,255,255,.09)}
.audralia-experience-loader__step[data-state="done"]{background:rgba(146,224,201,.78)}
.audralia-experience-loader__step[data-state="active"]{background:rgba(218,247,237,.92);box-shadow:0 0 14px rgba(150,226,204,.5);animation:audraliaStepPulse 1s ease-in-out infinite alternate}
@keyframes audraliaStepPulse{from{opacity:.48}to{opacity:1}}
.audralia-experience-loader__retry{margin-top:18px;padding:10px 16px;border:1px solid rgba(220,242,238,.24);border-radius:999px;background:rgba(255,255,255,.06);color:inherit;font:inherit;font-weight:800;cursor:pointer}
.audralia-world-canvas{background:#06161d!important}
@media(max-width:520px){.audralia-experience-loader__meta{align-items:flex-start;flex-direction:column}.audralia-experience-loader__note{text-align:left}}
${reducedMotion?'.audralia-experience-loader,.audralia-experience-loader__fill{transition:none!important}.audralia-experience-loader__fill::after,.audralia-experience-loader__step{animation:none!important}':''}
`;
document.head.appendChild(style);

if(loader&&originalPanel){
  loader.classList.add('audralia-experience-loader');
  originalPanel.className='audralia-experience-loader__card';
  originalPanel.innerHTML=`<p class="audralia-experience-loader__eyebrow">Audralia · live world initialization</p><h1 class="audralia-experience-loader__headline">Entering the world.</h1><p class="audralia-experience-loader__status" data-audralia-loader-stage>Preparing browser-native world runtime</p><div class="audralia-experience-loader__rail" data-audralia-loader-track role="progressbar" aria-label="Audralia initialization progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="audralia-experience-loader__fill" data-audralia-loader-fill></div></div><div class="audralia-experience-loader__meta"><strong class="audralia-experience-loader__percent" data-audralia-loader-progress>0%</strong><span class="audralia-experience-loader__note" data-audralia-loader-note>The number is the verified startup floor. Motion within each band means the current renderer stage is still actively working.</span></div><div class="audralia-experience-loader__steps" aria-hidden="true">${'<i class="audralia-experience-loader__step"></i>'.repeat(5)}</div>`;
}

const stage=document.querySelector('[data-audralia-loader-stage]');
const track=document.querySelector('[data-audralia-loader-track]');
const fill=document.querySelector('[data-audralia-loader-fill]');
const progress=document.querySelector('[data-audralia-loader-progress]');
const note=document.querySelector('[data-audralia-loader-note]');
const stepNodes=[...document.querySelectorAll('.audralia-experience-loader__step')];

let verified=0,displayed=0,ceiling=8,failed=false,stableReady=false,activityTimer=0,timeoutTimer=0,stableStartedAt=0,stableFrames=0;
const seenCanvases=new WeakSet();

function paint(){
  const bounded=Math.max(0,Math.min(100,displayed));
  if(fill)fill.style.width=`${bounded}%`;
  if(progress)progress.textContent=`${Math.floor(bounded)}%`;
  if(track)track.setAttribute('aria-valuenow',String(Math.floor(bounded)));
  if(loader)loader.dataset.progress=String(Math.floor(bounded));
  const group=Math.min(4,Math.floor(bounded/20));
  stepNodes.forEach((node,index)=>node.dataset.state=index<group?'done':index===group?'active':'pending');
}
function setVerified(value,label,nextCeiling=value){
  if(failed)return;
  verified=Math.max(verified,value);displayed=Math.max(displayed,verified);ceiling=Math.max(verified,nextCeiling);
  if(stage)stage.textContent=label;paint();
}
function beginActivity(){
  clearInterval(activityTimer);if(reducedMotion)return;
  activityTimer=setInterval(()=>{if(failed||displayed>=ceiling)return;displayed=Math.min(ceiling,displayed+1);paint();},520);
}
function showLoader(){if(!loader)return;loader.hidden=false;loader.dataset.ready='false';loader.removeAttribute('hidden');loader.classList.remove('is-ready');}
function fail(label,error){
  if(failed)return;failed=true;stableReady=false;clearInterval(activityTimer);clearTimeout(timeoutTimer);showLoader();
  const message=error instanceof Error?error.message:String(error||'unknown startup error');
  if(loader)loader.dataset.failed='true';if(stage)stage.textContent=label;if(progress)progress.textContent=`Held at ${Math.floor(displayed)}%`;
  if(note)note.textContent=`Audralia did not finish this startup stage: ${message}`;
  if(loader&&!loader.querySelector('.audralia-experience-loader__retry')){const retry=document.createElement('button');retry.type='button';retry.className='audralia-experience-loader__retry';retry.textContent='Retry Audralia';retry.addEventListener('click',()=>location.reload());originalPanel?.appendChild(retry);}
  window.__AUDRALIA_STARTUP_FAILURE__=Object.freeze({message,progress:displayed,label,at:Date.now()});
}
function attachCanvas(canvas){
  if(!(canvas instanceof HTMLCanvasElement)||seenCanvases.has(canvas))return;seenCanvases.add(canvas);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fail('Graphics surface was lost',`WEBGL_CONTEXT_LOST:${canvas.dataset.audraliaClearAtmosphere?'ATMOSPHERE':canvas.dataset.audraliaExteriorWeather?'REGIONAL_WEATHER':canvas.dataset.canonicalWeatherProjection?'LOCAL_WEATHER':'WORLD'}`);},{passive:false});
  canvas.addEventListener('webglcontextrestored',()=>{if(note)note.textContent='Graphics context restored. Retry Audralia to rebuild the world cleanly.';});
}
function scanCanvases(){document.querySelectorAll('canvas').forEach(attachCanvas);}
new MutationObserver(scanCanvases).observe(document.documentElement,{childList:true,subtree:true});scanCanvases();

// The parent app historically hid this loader as soon as its first architectural receipt passed.
// Keep it visible until the actual public weather stack survives a device-local stability window.
if(loader)new MutationObserver(()=>{if(!stableReady&&!failed&&(loader.hidden||loader.dataset.ready==='true'||loader.classList.contains('is-ready')))showLoader();}).observe(loader,{attributes:true,attributeFilter:['hidden','class','data-ready']});

async function waitFor(predicate,label,attempts=480){
  for(let i=0;i<attempts;i++){
    const value=predicate();if(value)return value;
    if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__)throw new Error(`QUALIFICATION_PARENT_FAILED:${label}:${window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__.message||''}`);
    if(window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__)throw new Error(`QUALIFICATION_GA_FAILED:${window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__.message}`);
    if(window.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__)throw new Error(`GC_L5_HANDOFF_FAILED:${window.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__.message}`);
    await sleep(25);
  }
  throw new Error(`QUALIFICATION_WAIT_TIMEOUT:${label}`);
}

function stableFrameCheck(){
  if(failed||stableReady)return;
  const runtime=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.();
  const ga=window.__AUDRALIA_FAP1_GA_AUTHORITY__;
  const gb=window.__AUDRALIA_FAP1_W5_HANDOFF__;
  const gbReady=gaProofMode||(gb?.authority==='BOUNDED_GB_HANDOFF_ACTIVE'&&gb?.l5LightingActive===true&&gb?.l5LightingModel==='DIRECT_SUN_TRANSMITTANCE_ONLY');
  const world=document.querySelector('[data-h-earth-map-wide-canvas]');
  const visibleSurface=world instanceof HTMLCanvasElement&&world.width>1&&world.height>1;
  if(runtime?.invariants?.pass===true&&ga?.meteorologicalAuthority==='FAP1_ONLY'&&gbReady&&visibleSurface){
    if(!stableStartedAt)stableStartedAt=performance.now();stableFrames++;
    const stableMs=performance.now()-stableStartedAt;
    setVerified(97,'Verifying graphics stability',99);
    if(stableFrames>=45&&stableMs>=900){
      stableReady=true;displayed=100;verified=100;ceiling=100;paint();clearInterval(activityTimer);clearTimeout(timeoutTimer);
      if(stage)stage.textContent='Audralia ready';if(note)note.textContent='World surface, atmosphere, regional weather, local weather, and the device graphics surface are stable.';
      if(loader){loader.dataset.failed='false';loader.dataset.ready='true';setTimeout(()=>{if(stableReady&&!failed)loader.hidden=true;},reducedMotion?0:520);}
      window.__AUDRALIA_STARTUP_STABILITY__=Object.freeze({pass:true,stableFrames,stableMs,verifiedAt:Date.now()});
      return;
    }
  }else{stableStartedAt=0;stableFrames=0;}
  requestAnimationFrame(stableFrameCheck);
}

function observeRuntime(){
  if(failed||stableReady)return;
  if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.renderer)setVerified(28,'World renderer online',38);
  if(document.querySelector('[data-audralia-clear-atmosphere="true"]'))setVerified(46,'Atmosphere online',58);
  if(document.querySelector('[data-audralia-exterior-weather="true"]'))setVerified(60,'Regional weather online',72);
  if(document.querySelector('[data-canonical-weather-projection="true"]'))setVerified(74,'Local weather online',84);
  const ga=window.__AUDRALIA_FAP1_GA_AUTHORITY__;
  const gb=window.__AUDRALIA_FAP1_W5_HANDOFF__;
  if(ga?.meteorologicalAuthority==='FAP1_ONLY')setVerified(86,'FAP1 weather authority online',91);
  if(gaProofMode||(gb?.authority==='BOUNDED_GB_HANDOFF_ACTIVE'&&gb?.l5LightingActive===true))setVerified(92,'Weather lighting handoff online',96);
  if(window.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__&&!gaProofMode)return fail('Weather lighting handoff stopped',window.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__.message);
  if(window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__)return fail('FAP1 authority convergence stopped',window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__.message);
  if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__)return fail('World initialization stopped',window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__.message);
  requestAnimationFrame(observeRuntime);
}

async function boot(){
  showLoader();setVerified(4,'Preparing Audralia',12);beginActivity();
  try{
    setVerified(12,'Loading world systems',20);
    await waitFor(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.renderer&&typeof window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getCameraFrame==='function','PARENT_RECEIPT');
    setVerified(28,'World renderer online',38);
    await import('./fap1-ga-authority-bootstrap.mjs?cb=FAP1_GA_v3');
    await waitFor(()=>window.__AUDRALIA_FAP1_GA_AUTHORITY__?.meteorologicalAuthority==='FAP1_ONLY'&&typeof window.__AUDRALIA_FAP1_GA_AUTHORITY__?.renderNow==='function','GA_AUTHORITY');
    if(gaProofMode){await import('./fap1-ga-negative-proof-v2.mjs?cb=FAP1_GA_NEGATIVE_PROOF_v3');}
    else{
      await import('./fap1-w5-handoff-bootstrap.gb.mjs?cb=FAP1_GC_L5_DIRECT_v1');
      await waitFor(()=>window.__AUDRALIA_FAP1_W5_HANDOFF__?.authority==='BOUNDED_GB_HANDOFF_ACTIVE'&&window.__AUDRALIA_FAP1_W5_HANDOFF__?.l5LightingActive===true,'GC_L5_DIRECT');
    }
    setVerified(92,'Weather stack assembled',96);requestAnimationFrame(observeRuntime);requestAnimationFrame(stableFrameCheck);
  }catch(error){console.error('AUDRALIA_STARTUP_MODULE_GRAPH_FAILED',error);fail('World systems could not load',error);}
}
window.addEventListener('error',event=>{if(!failed&&!stableReady&&event?.error)fail('Audralia startup encountered an error',event.error);});
window.addEventListener('unhandledrejection',event=>{if(!failed&&!stableReady)fail('Audralia startup encountered an error',event.reason);});
timeoutTimer=setTimeout(()=>{if(!failed&&!stableReady){if(stage)stage.textContent='Still building Audralia…';if(note)note.textContent='This device is taking longer than expected. Startup remains active and the verified progress floor will continue to report the last completed world stage.';}},18000);
boot();
