(()=>{
'use strict';

const BUILD=Object.freeze({
  version:'homepage-cinematic-shell-20260904-001',
  sourceMain:'46c56e0519fc875eac877b4bc921e3151b019a2f',
  specificationCommit:'88473442959299d6f6af82396917f0578074cab2',
  mutationClass:'BOUNDED_PAGE_RELEASE'
});
const STATE=Object.freeze({ARMED:'ARMED',PLAYING:'PLAYING',RESTORE:'RESTORE',SETTLED:'SETTLED'});
const MASTER_DURATION_MS=38000;
const RESTORE_FADE_MS=460;
const PREVIEW_PARAM='compassCinematicConstruction';
const SHOTS=Object.freeze([
  Object.freeze({id:'S01',beat:'Arrival',purpose:'Enter Diamond Gate Bridge',startMs:0,endMs:4500}),
  Object.freeze({id:'S02',beat:'Orientation',purpose:'Establish how the estate is navigated',startMs:4500,endMs:9500}),
  Object.freeze({id:'S03',beat:'Chapter One',purpose:'Show where a visitor can begin',startMs:9500,endMs:14500}),
  Object.freeze({id:'S04',beat:'Choice / Readiness',purpose:'Reveal structured paths through the estate',startMs:14500,endMs:19500}),
  Object.freeze({id:'S05',beat:'Threshold',purpose:'Cross from orientation into deeper experience',startMs:19500,endMs:25500}),
  Object.freeze({id:'S06',beat:'Elsewhere',purpose:'Reveal story and world possibility',startMs:25500,endMs:30500}),
  Object.freeze({id:'S07',beat:'Breadth / Engagement',purpose:'Reveal ways to engage and estate breadth',startMs:30500,endMs:34000}),
  Object.freeze({id:'S08',beat:'Return / Handoff',purpose:'Restore visitor agency',startMs:34000,endMs:38000})
]);
const $=(selector,root=document)=>root.querySelector(selector);
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
const previewEnabled=()=>new URLSearchParams(location.search).get(PREVIEW_PARAM)==='1';
const session={phase:null,overlay:null,stage:null,renderer:null,raf:0,startAt:0,settled:false,restoring:false,priorFocus:null,root:null,rootInert:false,rootAriaHidden:null,url:'',historyLength:0,liveIdentity:null,errorCode:null,lastShotId:null};

function captureLiveIdentity(root){
  return Object.freeze({
    mode:root.getAttribute('data-compass-mode'),
    renderedForegroundCardinal:root.getAttribute('data-rendered-foreground-cardinal'),
    readableCardinal:root.getAttribute('data-readable-cardinal'),
    selectedCardinal:root.getAttribute('data-selected-cardinal'),
    selectedRoom:root.getAttribute('data-selected-room')
  });
}
function setPhase(phase){session.phase=phase;if(session.overlay)session.overlay.dataset.state=phase;document.documentElement.dataset.compassOrientationCinematic=phase;}
function clearClock(){if(session.raf)cancelAnimationFrame(session.raf);session.raf=0;}
function restoreProductSurface(){
  if(!session.root)return;
  session.root.inert=session.rootInert;
  if(session.rootAriaHidden===null)session.root.removeAttribute('aria-hidden');
  else session.root.setAttribute('aria-hidden',session.rootAriaHidden);
}
function currentShot(elapsedMs){return SHOTS.find((shot)=>elapsedMs>=shot.startMs&&elapsedMs<shot.endMs)||SHOTS[SHOTS.length-1];}
function shotProgress(shot,elapsedMs){return Math.max(0,Math.min(1,(elapsedMs-shot.startMs)/(shot.endMs-shot.startMs)));}
function emitSettled(reason){
  document.dispatchEvent(new CustomEvent('dgb:compass-orientation-cinematic-settled',{detail:{
    reason,
    durationMs:MASTER_DURATION_MS,
    sourceMain:BUILD.sourceMain,
    specificationCommit:BUILD.specificationCommit,
    mutationClass:BUILD.mutationClass,
    navigationIntentEvents:0,
    urlUnchanged:location.href===session.url,
    historyUnchanged:history.length===session.historyLength,
    errorCode:session.errorCode,
    finalShotId:session.lastShotId
  }}));
}
function finalizeRestore(reason,overlay){
  session.renderer?.dispose?.();
  session.renderer=null;
  overlay?.remove();
  restoreProductSurface();
  document.documentElement.classList.remove('compass-orientation-cinematic-active');
  delete document.documentElement.dataset.compassOrientationCinematic;
  const target=session.priorFocus&&session.priorFocus.isConnected?session.priorFocus:null;
  if(target&&typeof target.focus==='function')target.focus({preventScroll:true});
  session.settled=true;
  session.restoring=false;
  session.overlay=null;
  session.stage=null;
  session.phase=STATE.SETTLED;
  emitSettled(reason);
}
function restore(reason='complete'){
  if(session.settled||session.restoring)return;
  session.restoring=true;
  clearClock();
  setPhase(STATE.RESTORE);
  const overlay=session.overlay;
  if(overlay){overlay.dataset.restoreReason=reason;overlay.classList.add('is-restoring');}
  const delay=!reduced()&&reason==='complete'?RESTORE_FADE_MS:0;
  window.setTimeout(()=>finalizeRestore(reason,overlay),delay);
}
function failOpen(code){session.errorCode=String(code||'CINEMATIC_SHELL_FAILURE');restore('fail-open');}
function onKey(event){if(event.key==='Escape'){event.preventDefault();restore(session.phase===STATE.ARMED?'skip-armed':'skip-playing');}}
function onOverlayClick(event){if(event.target.closest('[data-main-orientation-skip]'))restore(session.phase===STATE.ARMED?'skip-armed':'skip-playing');}
function animatedShell(){
  const overlay=document.createElement('section');
  overlay.id='compass-orientation-cinematic';
  overlay.className='compass-orientation-cinematic';
  overlay.dataset.state=STATE.ARMED;
  overlay.dataset.mainOrientationFilm=BUILD.version;
  overlay.dataset.sourceMain=BUILD.sourceMain;
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Welcome to Diamond Gate Bridge');
  overlay.innerHTML='<div class="compass-orientation-cinematic__stage" data-cinematic-stage></div><button class="compass-orientation-cinematic__skip" type="button" data-main-orientation-skip>Skip intro</button><output class="compass-orientation-cinematic__debug" data-cinematic-debug hidden></output>';
  return overlay;
}
function reducedShell(){
  const overlay=document.createElement('section');
  overlay.id='compass-orientation-cinematic';
  overlay.className='compass-orientation-cinematic';
  overlay.dataset.state=STATE.ARMED;
  overlay.dataset.mainOrientationFilm=`${BUILD.version}-reduced`;
  overlay.dataset.sourceMain=BUILD.sourceMain;
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-labelledby','compass-orientation-reduced-title');
  const items=SHOTS.map((shot)=>`<li><strong>${shot.beat}.</strong> ${shot.purpose}.</li>`).join('');
  overlay.innerHTML=`<div class="compass-orientation-cinematic__stage"><div class="compass-orientation-cinematic__reduced"><p class="compass-orientation-cinematic__eyebrow">Diamond Gate Bridge · Reduced motion</p><h2 id="compass-orientation-reduced-title">Welcome to Diamond Gate Bridge</h2><ol class="compass-orientation-cinematic__reduced-map">${items}</ol><button type="button" data-main-orientation-skip>Continue to Compass</button></div></div>`;
  return overlay;
}
async function loadRenderer(){
  const [renderModule,mediaModule]=await Promise.all([
    import('/assets/compass/compass.orientation-cinematic.render.js'),
    import('/assets/compass/compass.orientation-cinematic.media.js')
  ]);
  mediaModule.assertCinematicMediaManifest(mediaModule.CINEMATIC_MEDIA_MANIFEST);
  return renderModule.createCinematicRenderer({stage:session.stage,media:mediaModule.CINEMATIC_MEDIA_MANIFEST});
}
function tick(now){
  if(session.settled||session.restoring)return;
  const elapsedMs=Math.min(MASTER_DURATION_MS,Math.max(0,now-session.startAt));
  const shot=currentShot(elapsedMs);
  session.lastShotId=shot.id;
  session.overlay.dataset.shotId=shot.id;
  session.renderer?.renderFrame?.({elapsedMs,shot,shotProgress:shotProgress(shot,elapsedMs),masterDurationMs:MASTER_DURATION_MS,liveIdentity:session.liveIdentity});
  const debug=$('[data-cinematic-debug]',session.overlay);
  if(debug&&!debug.hidden)debug.value=`${shot.id} · ${shot.beat} · ${(elapsedMs/1000).toFixed(2)}s`;
  if(elapsedMs>=MASTER_DURATION_MS){restore('complete');return;}
  session.raf=requestAnimationFrame(tick);
}
function bindOverlay(overlay){
  session.overlay=overlay;
  document.body.appendChild(overlay);
  session.root.inert=true;
  session.root.setAttribute('aria-hidden','true');
  document.documentElement.classList.add('compass-orientation-cinematic-active');
  overlay.addEventListener('click',onOverlayClick);
  window.addEventListener('keydown',onKey,true);
  setPhase(STATE.ARMED);
}
function startReduced(){
  const overlay=reducedShell();
  bindOverlay(overlay);
  $('[data-main-orientation-skip]',overlay)?.focus({preventScroll:true});
}
async function startAnimated(){
  const overlay=animatedShell();
  bindOverlay(overlay);
  session.stage=$('[data-cinematic-stage]',overlay);
  session.renderer=await loadRenderer();
  session.renderer.mount();
  setPhase(STATE.PLAYING);
  session.startAt=performance.now();
  session.raf=requestAnimationFrame(tick);
  $('[data-main-orientation-skip]',overlay)?.focus({preventScroll:true});
}
async function mount(){
  if(window.self!==window.top)return;
  session.root=$('[data-compass-root]');
  if(!session.root||!$('[data-compass-scene]'))return;
  session.priorFocus=document.activeElement;
  session.rootInert=session.root.inert;
  session.rootAriaHidden=session.root.getAttribute('aria-hidden');
  session.url=location.href;
  session.historyLength=history.length;
  session.liveIdentity=captureLiveIdentity(session.root);
  if(!previewEnabled())return;
  try{if(reduced())startReduced();else await startAnimated();}
  catch(error){failOpen(error?.message||'CINEMATIC_SHELL_INIT_FAILURE');}
}

window.DGB_MAIN_ORIENTATION_CINEMATIC=Object.freeze({
  version:BUILD.version,
  durationMs:MASTER_DURATION_MS,
  sourceMain:BUILD.sourceMain,
  specificationCommit:BUILD.specificationCommit,
  mutationClass:BUILD.mutationClass,
  constructionPreviewParameter:`${PREVIEW_PARAM}=1`,
  shots:SHOTS,
  restore,
  inspect:()=>Object.freeze({phase:session.phase,settled:session.settled,restoring:session.restoring,errorCode:session.errorCode,lastShotId:session.lastShotId,liveIdentity:session.liveIdentity,previewEnabled:previewEnabled()})
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
