(()=>{
'use strict';

const CONTRACT=Object.freeze({
  version:'COMPASS_PRERENDERED_THIN_PLAYER_T12_v1',
  mutationClass:'BOUNDED_PAGE_RELEASE',
  mediaPath:'/assets/compass/cinematic-media/compass-main-orientation-final-v1.mp4',
  mediaBytes:3828177,
  mediaSha256:'6ada38eadeb6243b3809167f45dd8a74808c88ac677273683338772e7899b4e7',
  mediaGitBlob:'ca95d7c17ef54044a11bc456a949c33fa9820bc0',
  sourceHead:'96c89ec797490a5dc0e3dd343f4d34a396adaa02',
  masterDurationMs:38000,
  naturalFadeMs:460
});
const STATE=Object.freeze({ARMED:'ARMED',PLAYING:'PLAYING',SETTLED:'SETTLED'});
const q=(s,r=document)=>r.querySelector(s);
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
const session={
  state:null,
  overlay:null,
  video:null,
  gate:null,
  play:null,
  skip:null,
  replay:null,
  root:null,
  rootInert:false,
  rootAriaHidden:null,
  priorFocus:null,
  ambient:null,
  ambientSnapshot:null,
  url:null,
  historyLength:0,
  fadeStarted:false,
  settlementCount:0
};

function markState(state){
  session.state=state;
  if(session.overlay)session.overlay.dataset.state=state;
  document.documentElement.dataset.compassOrientationCinematic=state;
}

function snapshotAmbient(){
  const audio=q('[data-compass-ambient-audio]');
  session.ambient=audio||null;
  if(!audio){session.ambientSnapshot=null;return;}
  session.ambientSnapshot=Object.freeze({
    muted:Boolean(audio.muted),
    volume:Number.isFinite(audio.volume)?audio.volume:.24,
    paused:Boolean(audio.paused)
  });
  try{audio.pause();}catch{}
  audio.muted=true;
}

function suppressAmbient(){
  const audio=session.ambient;
  if(!audio)return;
  audio.muted=true;
}

function restoreAmbient(){
  const audio=session.ambient;
  const snap=session.ambientSnapshot;
  if(!audio||!snap)return;
  try{audio.pause();}catch{}
  audio.muted=snap.muted;
  audio.volume=snap.volume;
  if(!snap.paused){
    const p=audio.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{});
  }
  session.ambient=null;
  session.ambientSnapshot=null;
}

function captureProduct(){
  const root=q('[data-compass-root]');
  if(!root)throw new Error('COMPASS_ROOT_MISSING');
  session.root=root;
  session.rootInert=Boolean(root.inert);
  session.rootAriaHidden=root.getAttribute('aria-hidden');
  session.priorFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  root.inert=true;
  root.setAttribute('aria-hidden','true');
}

function restoreProduct(){
  const root=session.root;
  if(!root)return;
  root.inert=session.rootInert;
  if(session.rootAriaHidden===null)root.removeAttribute('aria-hidden');
  else root.setAttribute('aria-hidden',session.rootAriaHidden);
}

function makeButton(label,attr,kind='secondary'){
  const b=document.createElement('button');
  b.type='button';
  b.className=`compass-prerendered-player__button is-${kind}`;
  b.textContent=label;
  b.setAttribute(attr,'');
  return b;
}

function buildOverlay(){
  const overlay=document.createElement('section');
  overlay.className='compass-prerendered-player';
  overlay.setAttribute('data-main-orientation-film','');
  overlay.setAttribute('data-player-contract',CONTRACT.version);
  overlay.setAttribute('data-media-git-blob',CONTRACT.mediaGitBlob);
  overlay.setAttribute('data-media-sha256',CONTRACT.mediaSha256);
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Diamond Gate Bridge orientation film');

  const video=document.createElement('video');
  video.className='compass-prerendered-player__video';
  video.playsInline=true;
  video.preload='metadata';
  video.controls=false;
  video.disablePictureInPicture=true;
  video.setAttribute('aria-label','Diamond Gate Bridge orientation film');
  video.setAttribute('data-main-orientation-video','');
  video.src=CONTRACT.mediaPath;

  const gate=document.createElement('div');
  gate.className='compass-prerendered-player__gate';
  gate.setAttribute('data-main-orientation-gate','');
  gate.innerHTML='<div class="compass-prerendered-player__gate-card"><p class="compass-prerendered-player__eyebrow">Diamond Gate Bridge</p><h2>Find your way.</h2><p>A short orientation before you enter.</p><div class="compass-prerendered-player__actions"></div></div>';
  const actions=q('.compass-prerendered-player__actions',gate);
  const play=makeButton(reduced()?'Enter Compass':'Play intro','data-main-orientation-play','primary');
  const skip=makeButton('Skip intro','data-main-orientation-skip');
  actions.append(play,skip);

  const playingSkip=makeButton('Skip','data-main-orientation-skip','quiet');
  playingSkip.classList.add('compass-prerendered-player__skip');

  overlay.append(video,gate,playingSkip);
  session.overlay=overlay;
  session.video=video;
  session.gate=gate;
  session.play=play;
  session.skip=skip;
  document.body.append(overlay);
  return overlay;
}

function ensureReplay(){
  let button=q('[data-main-orientation-replay]');
  if(button){session.replay=button;return button;}
  button=makeButton('Replay intro','data-main-orientation-replay','replay');
  button.classList.add('compass-prerendered-player__replay');
  button.setAttribute('aria-label','Replay Diamond Gate Bridge orientation');
  button.addEventListener('click',()=>mount('replay'));
  document.body.append(button);
  session.replay=button;
  return button;
}

function removeReplay(){
  session.replay?.remove();
  session.replay=null;
}

function emitSettlement(reason){
  session.settlementCount+=1;
  document.dispatchEvent(new CustomEvent('dgb:compass-orientation-cinematic-settled',{detail:{
    reason,
    playerContract:CONTRACT.version,
    mediaPath:CONTRACT.mediaPath,
    mediaBytes:CONTRACT.mediaBytes,
    mediaSha256:CONTRACT.mediaSha256,
    mediaGitBlob:CONTRACT.mediaGitBlob,
    sourceHead:CONTRACT.sourceHead,
    masterDurationMs:CONTRACT.masterDurationMs,
    urlUnchanged:location.href===session.url,
    historyUnchanged:history.length===session.historyLength,
    navigationIntentEvents:0,
    settlementCount:session.settlementCount
  }}));
}

function cleanupOverlay(){
  window.removeEventListener('keydown',onKey,true);
  const video=session.video;
  if(video){
    try{video.pause();}catch{}
    video.removeAttribute('src');
    try{video.load();}catch{}
  }
  session.overlay?.remove();
  session.overlay=null;
  session.video=null;
  session.gate=null;
  session.play=null;
  session.skip=null;
  session.fadeStarted=false;
}

function settle(reason='complete'){
  if(session.state===STATE.SETTLED)return;
  cleanupOverlay();
  restoreProduct();
  restoreAmbient();
  document.documentElement.classList.remove('compass-orientation-cinematic-active');
  delete document.documentElement.dataset.compassOrientationCinematic;
  session.state=STATE.SETTLED;
  const replay=ensureReplay();
  if(reason==='skip-armed'&&session.priorFocus?.isConnected)session.priorFocus.focus({preventScroll:true});
  else replay.focus({preventScroll:true});
  emitSettlement(reason);
}

function maybeNaturalFade(){
  const video=session.video;
  const overlay=session.overlay;
  if(!video||!overlay||session.fadeStarted||!Number.isFinite(video.duration))return;
  if(video.duration-video.currentTime<=CONTRACT.naturalFadeMs/1000){
    session.fadeStarted=true;
    overlay.classList.add('is-natural-handoff');
  }
}

async function play(){
  if(session.state!==STATE.ARMED)return;
  if(reduced()){settle('reduced-motion-complete');return;}
  markState(STATE.PLAYING);
  session.gate?.setAttribute('hidden','');
  suppressAmbient();
  try{
    session.video.currentTime=0;
    const p=session.video.play();
    if(p&&typeof p.then==='function')await p;
  }catch(error){
    session.overlay?.setAttribute('data-player-error',String(error?.name||'PLAY_FAILED'));
    settle('fail-open');
  }
}

function onOverlayClick(event){
  if(event.target.closest('[data-main-orientation-play]')){
    event.preventDefault();
    event.stopPropagation();
    void play();
    return;
  }
  if(event.target.closest('[data-main-orientation-skip]')){
    event.preventDefault();
    event.stopPropagation();
    settle(session.state===STATE.PLAYING?'skip-playing':'skip-armed');
  }
}

function onKey(event){
  if(session.state===STATE.SETTLED)return;
  if(event.key==='Escape'){
    event.preventDefault();
    event.stopPropagation();
    settle(session.state===STATE.PLAYING?'skip-playing':'skip-armed');
  }
}

function onAmbientTrigger(){
  if(session.state===STATE.PLAYING)queueMicrotask(suppressAmbient);
}

function bindOverlay(){
  const overlay=session.overlay;
  const video=session.video;
  overlay.addEventListener('click',onOverlayClick);
  video.addEventListener('ended',()=>settle('complete'),{once:true});
  video.addEventListener('error',()=>settle('fail-open'),{once:true});
  video.addEventListener('timeupdate',maybeNaturalFade);
  window.addEventListener('keydown',onKey,true);
}

function mount(source='initial'){
  if(session.overlay)return;
  removeReplay();
  session.url=location.href;
  session.historyLength=history.length;
  session.fadeStarted=false;
  try{
    captureProduct();
    snapshotAmbient();
    document.documentElement.classList.add('compass-orientation-cinematic-active');
    const overlay=buildOverlay();
    overlay.dataset.mountSource=source;
    overlay.dataset.reducedMotion=String(reduced());
    markState(STATE.ARMED);
    bindOverlay();
    session.play?.focus({preventScroll:true});
  }catch(error){
    cleanupOverlay();
    restoreProduct();
    restoreAmbient();
    document.documentElement.classList.remove('compass-orientation-cinematic-active');
    delete document.documentElement.dataset.compassOrientationCinematic;
    session.state=STATE.SETTLED;
    console.error('COMPASS_PRERENDERED_PLAYER_FAIL_OPEN',error);
  }
}

['pointerdown','pointerup','touchstart','touchend','click','keydown','wheel'].forEach(type=>document.addEventListener(type,onAmbientTrigger,true));

globalThis.__DGB_COMPASS_PRERENDERED_PLAYER__=Object.freeze({
  contract:CONTRACT,
  replay:()=>mount('inspection-api'),
  skip:()=>settle(session.state===STATE.PLAYING?'skip-playing':'skip-armed'),
  inspect:()=>Object.freeze({
    state:session.state,
    overlayMounted:Boolean(session.overlay),
    mediaPath:CONTRACT.mediaPath,
    mediaGitBlob:CONTRACT.mediaGitBlob,
    reducedMotion:reduced(),
    rootInert:Boolean(session.root?.inert),
    ambientMuted:Boolean(session.ambient?.muted),
    currentTime:Number(session.video?.currentTime||0),
    duration:Number(session.video?.duration||0)
  })
});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount('ordinary-entry'),{once:true});
else mount('ordinary-entry');
})();
