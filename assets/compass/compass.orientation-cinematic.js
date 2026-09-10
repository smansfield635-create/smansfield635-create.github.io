(()=>{'use strict';

const CONTRACT=Object.freeze({
  version:'COMPASS_EXPERIENTIAL_PLAYER_R11A_V7_V8_HYBRID_CANDIDATE',
  mutationClass:'RUNTIME_OR_NEW_DEVELOPMENT',
  operationId:'COMPASS_R11A_V7_V8_HYBRID_CANDIDATE_20260909_001',
  mediaPath:'/assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4?v=r11a-v7-v8-hybrid&cb=507081bfe7290b20',
  mediaBytes:9141773,
  mediaSha256:'507081bfe7290b201c357368649430b2de7b1c45bba141f2037e0b28f0faec01',
  mediaGitBlob:'758806d9df52cb33ef61892bb49a97b46f90cbb5',
  posterPath:'/assets/compass/cinematic-media/compass-main-orientation-entry-frame.png?v=r11a-v7-v8-hybrid&cb=47ca784c3f679555',
  posterBytes:87700,
  posterSha256:'47ca784c3f67955554536852b96cb109547d83497d0dbef7edeb3ecd3dce1061',
  sourceHead:'324ca040f05e7919ae6f6ca29d48fc8dee462fa2',
  masterDurationMs:64767,
  entryPrerollMs:0,
  entryPrerollCountedInMaster:true,
  entryContinuityLaw:'FILMED_ENTRY_PANEL_DISINTEGRATION_IS_INCLUDED_IN_THE_SINGLE_MASTER',
  viewportLaw:'ONE_CONTINUOUS_EXPERIENTIAL_REGION',
  terminalLaw:'MOVIE_DISSOLVES_TO_CANONICAL_LIVE_FOUR_STAR_COMPASS',
  naturalFadeMs:2200
});
const STATE=Object.freeze({ARMED:'ARMED',PLAYING:'PLAYING',SETTLED:'SETTLED'});
const ENTRY_POLICY=Object.freeze({
  version:'COMPASS_ORIENTATION_ENTRY_ROUTING_V1',
  externalOrDirect:'OFFER',
  internalReturn:'BYPASS',
  historyReturn:'BYPASS',
  reload:'BYPASS',
  replay:'ALWAYS_AVAILABLE'
});
const ENTRY_TESSELLATE_START_MS=140;
const ENTRY_TESSELLATE_END_MS=820;
const ENTRY_CELL_TRAVEL_END_MS=2300;
const ENTRY_FILM_REVEAL_MS=780;
const ENTRY_GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5));
const ENTRY_SEED=0x0b17e17;
const ENTRY_COLORS=['255,248,224','154,217,225','234,208,131','170,155,224'];
const ENTRY_CONTROL_RETRACT_MS=170;
const AUDRALIA_PERCEPTUAL_DWELL_MS=2000;
const AUDRALIA_HOLD=Object.freeze({captureAt:49.30,revealAt:49.70,releaseAt:1499/30,clearAt:50.24});

const q=(s,r=document)=>r.querySelector(s);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const easeOut=t=>1-Math.pow(1-clamp(t),3);
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
const session={
  state:null,overlay:null,video:null,ambientVideo:null,audraliaHoldAmbient:null,audraliaHoldForeground:null,gate:null,play:null,skip:null,replay:null,
  root:null,rootInert:false,rootAriaHidden:null,priorFocus:null,
  ambient:null,ambientSnapshot:null,url:null,historyLength:0,
  fadeStarted:false,settlementCount:0,
  entryCanvas:null,entryCtx:null,entryWidth:0,entryHeight:0,entryDpr:1,
  entryStars:[],entryCells:[],entryStartedAt:0,entryRaf:0,
  playRequested:false,entryTransitionComplete:false,videoReady:false,
  videoStartRequested:false,firstFramePresented:false,entryAction:'',entryDecision:null,
  entryControlTimer:0,audraliaFrameCallback:0,audraliaHoldCaptured:false,audraliaHoldVisible:false,audraliaHoldReleased:false,
  audraliaDwellTimer:0,audraliaDwellStarted:false,audraliaDwellComplete:false,audraliaDwellMediaTime:0
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
function suppressAmbient(){if(session.ambient)session.ambient.muted=true;}
function restoreAmbient(){
  const audio=session.ambient,snap=session.ambientSnapshot;
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
  overlay.setAttribute('data-entry-policy',ENTRY_POLICY.version);
  overlay.setAttribute('data-media-git-blob',CONTRACT.mediaGitBlob);
  overlay.setAttribute('data-media-sha256',CONTRACT.mediaSha256);
  overlay.setAttribute('data-entry-preroll-ms',String(CONTRACT.entryPrerollMs));
  overlay.setAttribute('data-entry-preroll-counted-in-master',String(CONTRACT.entryPrerollCountedInMaster));
  overlay.setAttribute('data-entry-continuity-law',CONTRACT.entryContinuityLaw);
  overlay.setAttribute('data-entry-state','IDLE');
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Diamond Gate Bridge orientation film');

  const ambientVideo=document.createElement('video');
  ambientVideo.className='compass-prerendered-player__ambient-video';
  ambientVideo.playsInline=true;
  ambientVideo.preload='auto';
  ambientVideo.controls=false;
  ambientVideo.muted=true;
  ambientVideo.disablePictureInPicture=true;
  ambientVideo.setAttribute('aria-hidden','true');
  ambientVideo.poster=CONTRACT.posterPath;
  ambientVideo.src=CONTRACT.mediaPath;

  const video=document.createElement('video');
  video.className='compass-prerendered-player__video';
  video.playsInline=true;
  video.preload='auto';
  video.controls=false;
  video.disablePictureInPicture=true;
  video.setAttribute('aria-label','Diamond Gate Bridge orientation film');
  video.setAttribute('data-main-orientation-video','');
  video.poster=CONTRACT.posterPath;
  video.src=CONTRACT.mediaPath;

  const audraliaHoldAmbient=document.createElement('canvas');
  audraliaHoldAmbient.className='compass-prerendered-player__audralia-hold compass-prerendered-player__audralia-hold--ambient';
  audraliaHoldAmbient.setAttribute('aria-hidden','true');

  const audraliaHoldForeground=document.createElement('canvas');
  audraliaHoldForeground.className='compass-prerendered-player__audralia-hold compass-prerendered-player__audralia-hold--foreground';
  audraliaHoldForeground.setAttribute('aria-hidden','true');

  const gate=document.createElement('div');
  gate.className='compass-prerendered-player__gate';
  gate.setAttribute('data-main-orientation-gate','');
  gate.tabIndex=-1;
  gate.innerHTML='<canvas class="compass-prerendered-player__entry-canvas" data-main-orientation-entry-canvas aria-hidden="true"></canvas><div class="compass-prerendered-player__gate-card" data-main-orientation-entry-card><p class="compass-prerendered-player__eyebrow">Diamond Gate Bridge</p><h2>Find your way.</h2><p>A short orientation before you enter.</p><div class="compass-prerendered-player__actions"></div></div>';
  const actions=q('.compass-prerendered-player__actions',gate);
  const play=makeButton(reduced()?'Enter Compass':'Play intro','data-main-orientation-play','primary');
  const skip=makeButton('Skip intro','data-main-orientation-skip');
  actions.append(play,skip);

  const playingSkip=makeButton('Skip','data-main-orientation-skip','quiet');
  playingSkip.classList.add('compass-prerendered-player__skip');

  overlay.append(ambientVideo,audraliaHoldAmbient,video,audraliaHoldForeground,gate,playingSkip);
  session.overlay=overlay;
  session.video=video;
  session.ambientVideo=ambientVideo;
  session.audraliaHoldAmbient=audraliaHoldAmbient;
  session.audraliaHoldForeground=audraliaHoldForeground;
  session.gate=gate;
  session.play=play;
  session.skip=skip;
  session.entryCanvas=q('[data-main-orientation-entry-canvas]',gate);
  document.body.append(overlay);
  return overlay;
}

function currentNavigationType(){
  const entry=performance.getEntriesByType?.('navigation')?.[0];
  return typeof entry?.type==='string'?entry.type:'navigate';
}
function decideOrdinaryEntry({
  referrer=document.referrer,
  navigationType=currentNavigationType(),
  origin=location.origin
}={}){
  let sameOriginReferrer=false;
  if(referrer){
    try{sameOriginReferrer=new URL(referrer,location.href).origin===origin;}catch{}
  }
  let reason='EXTERNAL_OR_DIRECT_ENTRY';
  if(navigationType==='back_forward')reason='HISTORY_RETURN';
  else if(navigationType==='reload')reason='RELOAD';
  else if(sameOriginReferrer)reason='INTERNAL_RETURN';
  return Object.freeze({
    offer:reason==='EXTERNAL_OR_DIRECT_ENTRY',
    reason,
    navigationType,
    sameOriginReferrer
  });
}
function emitEntryDecision(decision){
  document.dispatchEvent(new CustomEvent('dgb:compass-orientation-entry-decision',{detail:{
    policy:ENTRY_POLICY.version,
    ...decision,
    replayAvailable:true
  }}));
}
function bypassOrdinaryEntry(decision){
  session.entryDecision=decision;
  session.state=STATE.SETTLED;
  delete document.documentElement.dataset.compassOrientationCinematic;
  document.documentElement.dataset.compassOrientationEntry=decision.reason;
  ensureReplay();
}
function routeOrdinaryEntry(){
  const decision=decideOrdinaryEntry();
  session.entryDecision=decision;
  document.documentElement.dataset.compassOrientationEntry=decision.reason;
  if(decision.offer)mount('ordinary-entry');
  else bypassOrdinaryEntry(decision);
  emitEntryDecision(decision);
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
function removeReplay(){session.replay?.remove();session.replay=null;}

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
    entryPreRollMs:CONTRACT.entryPrerollMs,
    entryPreRollCountedInMaster:CONTRACT.entryPrerollCountedInMaster,
    entryContinuityLaw:CONTRACT.entryContinuityLaw,
    firstFramePresentedBeforeEntryClear:session.firstFramePresented,
    urlUnchanged:location.href===session.url,
    historyUnchanged:history.length===session.historyLength,
    navigationIntentEvents:0,
    settlementCount:session.settlementCount
  }}));
}

function cancelEntryFrame(){
  if(session.entryRaf)cancelAnimationFrame(session.entryRaf);
  session.entryRaf=0;
}
function cancelAudraliaFrame(){
  if(session.audraliaFrameCallback&&session.video?.cancelVideoFrameCallback)session.video.cancelVideoFrameCallback(session.audraliaFrameCallback);
  session.audraliaFrameCallback=0;
}
function cleanupOverlay(){
  window.removeEventListener('keydown',onKey,true);
  window.removeEventListener('resize',resizeEntryCanvas);
  cancelEntryFrame();
  cancelAudraliaFrame();
  if(session.entryControlTimer)clearTimeout(session.entryControlTimer);
  if(session.audraliaDwellTimer)clearTimeout(session.audraliaDwellTimer);
  for(const video of [session.video,session.ambientVideo])if(video){try{video.pause();}catch{}video.removeAttribute('src');try{video.load();}catch{}}
  session.overlay?.remove();
  session.overlay=null;
  session.video=null;
  session.ambientVideo=null;
  session.audraliaHoldAmbient=null;
  session.audraliaHoldForeground=null;
  session.gate=null;
  session.play=null;
  session.skip=null;
  session.entryCanvas=null;
  session.entryCtx=null;
  session.entryControlTimer=0;
  session.audraliaDwellTimer=0;
  session.fadeStarted=false;
}

function captureAudraliaHold(){
  const video=session.video;
  if(!video?.videoWidth||!video.videoHeight)return false;
  for(const canvas of [session.audraliaHoldAmbient,session.audraliaHoldForeground]){
    if(!canvas)continue;
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)continue;
    ctx.drawImage(video,0,0,canvas.width,canvas.height);
  }
  session.audraliaHoldCaptured=true;
  return true;
}
function startAudraliaPerceptualDwell(){
  if(session.audraliaDwellStarted||session.state!==STATE.PLAYING||session.entryAction!=='play')return;
  const video=session.video,ambientVideo=session.ambientVideo;
  if(!video)return;
  session.audraliaDwellStarted=true;
  session.audraliaDwellMediaTime=video.currentTime;
  try{video.pause();}catch{}
  if(ambientVideo)try{ambientVideo.pause();}catch{}
  session.audraliaDwellTimer=window.setTimeout(()=>{
    session.audraliaDwellTimer=0;
    if(session.state!==STATE.PLAYING||session.entryAction!=='play'||session.video!==video)return;
    session.audraliaDwellComplete=true;
    if(ambientVideo===session.ambientVideo){
      const ambientPlay=ambientVideo.play();
      if(ambientPlay&&typeof ambientPlay.catch==='function')ambientPlay.catch(()=>{});
    }
    const p=video.play();
    if(p&&typeof p.catch==='function')p.catch(error=>{
      session.overlay?.setAttribute('data-player-error',String(error?.name||'AUDRALIA_DWELL_RESUME_FAILED'));
      settle('fail-open');
    });
  },AUDRALIA_PERCEPTUAL_DWELL_MS);
}
function updateAudraliaHold(mediaTime){
  if(session.state!==STATE.PLAYING||!Number.isFinite(mediaTime))return;
  if(!session.audraliaHoldCaptured&&mediaTime>=AUDRALIA_HOLD.captureAt&&mediaTime<AUDRALIA_HOLD.revealAt)captureAudraliaHold();
  if(!session.audraliaHoldVisible&&mediaTime>=AUDRALIA_HOLD.revealAt&&mediaTime<AUDRALIA_HOLD.clearAt){
    if(!session.audraliaHoldCaptured&&!captureAudraliaHold())return;
    session.audraliaHoldVisible=true;
    for(const canvas of [session.audraliaHoldAmbient,session.audraliaHoldForeground])canvas?.classList.add('is-active');
  }
  if(session.audraliaHoldVisible&&!session.audraliaDwellStarted&&mediaTime>=AUDRALIA_HOLD.revealAt&&mediaTime<AUDRALIA_HOLD.releaseAt)startAudraliaPerceptualDwell();
  if(session.audraliaHoldVisible&&!session.audraliaHoldReleased&&mediaTime>=AUDRALIA_HOLD.releaseAt){
    session.audraliaHoldReleased=true;
    for(const canvas of [session.audraliaHoldAmbient,session.audraliaHoldForeground])canvas?.classList.add('is-releasing');
  }
  if(mediaTime>=AUDRALIA_HOLD.clearAt){
    for(const canvas of [session.audraliaHoldAmbient,session.audraliaHoldForeground])canvas?.classList.remove('is-active','is-releasing');
    cancelAudraliaFrame();
  }
}
function monitorAudraliaFrame(_now,metadata){
  updateAudraliaHold(Number(metadata?.mediaTime));
  if(session.video?.requestVideoFrameCallback&&Number(metadata?.mediaTime)<AUDRALIA_HOLD.clearAt){
    session.audraliaFrameCallback=session.video.requestVideoFrameCallback(monitorAudraliaFrame);
  }
}
function startAudraliaMonitor(){
  const video=session.video;
  if(!video?.requestVideoFrameCallback||session.audraliaFrameCallback)return;
  session.audraliaFrameCallback=video.requestVideoFrameCallback(monitorAudraliaFrame);
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
  if((reason==='skip-armed'||reason==='skip-preroll')&&session.priorFocus?.isConnected)session.priorFocus.focus({preventScroll:true});
  else replay.focus({preventScroll:true});
  emitSettlement(reason);
}

function maybeNaturalFade(){
  const video=session.video,overlay=session.overlay;
  if(!video||!overlay||session.fadeStarted||!Number.isFinite(video.duration))return;
  if(video.duration-video.currentTime<=CONTRACT.naturalFadeMs/1000){
    session.fadeStarted=true;
    overlay.classList.add('is-natural-handoff');
  }
}

function randomFactory(seed){
  let value=seed>>>0;
  return()=>{value+=0x6d2b79f5;let result=value;result=Math.imul(result^(result>>>15),result|1);result^=result+Math.imul(result^(result>>>7),result|61);return((result^(result>>>14))>>>0)/4294967296;};
}
function resizeEntryCanvas(){
  const canvas=session.entryCanvas;
  if(!canvas)return;
  const width=Math.max(320,innerWidth||document.documentElement.clientWidth||320);
  const height=Math.max(480,innerHeight||document.documentElement.clientHeight||480);
  const dpr=Math.min(devicePixelRatio||1,width<=820?1.25:1.5);
  session.entryWidth=width;session.entryHeight=height;session.entryDpr=dpr;
  canvas.width=Math.max(1,Math.round(width*dpr));
  canvas.height=Math.max(1,Math.round(height*dpr));
  canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;
  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
  if(!ctx)return;
  session.entryCtx=ctx;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const random=randomFactory(ENTRY_SEED^width^(height<<7));
  const count=Math.round(clamp(Math.round(width*height/7200),96,210));
  session.entryStars=Array.from({length:count},(_,index)=>{
    const radius=Math.sqrt((index+.5)/count);
    const angle=index*ENTRY_GOLDEN_ANGLE+mix(-.08,.08,random());
    return Object.freeze({
      x:clamp(.5+Math.cos(angle)*radius*.69+mix(-.018,.018,random()),.012,.988)*width,
      y:clamp(.5+Math.sin(angle)*radius*.63+mix(-.018,.018,random()),.012,.988)*height,
      radius:mix(.5,1.7,random()),alpha:mix(.30,.88,random()),
      color:ENTRY_COLORS[Math.floor(random()*ENTRY_COLORS.length)],phase:random()*Math.PI*2
    });
  });
}
function buildEntryTessellation(surface){
  const rect=surface.getBoundingClientRect(),baseSize=clamp(Math.min(rect.width,rect.height)*.035,14,44);
  const sx=baseSize*.90,sy=baseSize*.72;
  const cols=Math.ceil(rect.width/sx)+2,rows=Math.ceil(rect.height/sy)+2;
  const random=randomFactory(ENTRY_SEED^Math.round(rect.width*17)^Math.round(rect.height*31));
  const stars=session.entryStars,cells=[];
  for(let row=-1;row<rows;row++)for(let col=-1;col<cols;col++){
    const x=rect.left+col*sx+(row%2?sx*.5:0),y=rect.top+row*sy;
    if(x<rect.left-baseSize||x>rect.right+baseSize||y<rect.top-baseSize||y>rect.bottom+baseSize)continue;
    const target=stars[Math.floor(random()*stars.length)]||{x:session.entryWidth*.5,y:session.entryHeight*.5};
    cells.push({x,y,targetX:target.x,targetY:target.y,size:baseSize*mix(.72,1.08,random()),delay:random()*.32,rotation:mix(-.24,.24,random()),spin:mix(-1.4,1.4,random()),tone:random()<.33?'gold':'cool'});
  }
  session.entryCells=cells;
}
function drawEntryCell(cell,x,y,size,alpha,rotation){
  const ctx=session.entryCtx,half=size*.5,rise=size*.28;
  ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.globalAlpha=alpha;
  ctx.beginPath();ctx.moveTo(0,-rise);ctx.lineTo(half,0);ctx.lineTo(0,rise);ctx.lineTo(-half,0);ctx.closePath();
  ctx.fillStyle=cell.tone==='gold'?'rgba(255,234,165,.92)':'rgba(215,239,239,.88)';ctx.fill();ctx.restore();
}
function drawEntryStars(alpha,now){
  const ctx=session.entryCtx;
  for(let i=0;i<session.entryStars.length;i++){
    const star=session.entryStars[i],pulse=.86+.14*Math.sin(now*.00125+star.phase+i*.07);
    ctx.beginPath();ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);
    ctx.fillStyle=`rgba(${star.color},${star.alpha*alpha*pulse})`;ctx.fill();
  }
}
function drawEntryIdle(now=performance.now()){
  const ctx=session.entryCtx;
  if(!ctx)return;
  ctx.setTransform(session.entryDpr,0,0,session.entryDpr,0,0);
  ctx.clearRect(0,0,session.entryWidth,session.entryHeight);
  drawEntryStars(.10,now);
}
function drawEntryTransition(now){
  if(session.state===STATE.SETTLED)return;
  const ctx=session.entryCtx,elapsed=Math.max(0,now-session.entryStartedAt);
  if(!ctx){settle('fail-open');return;}
  ctx.setTransform(session.entryDpr,0,0,session.entryDpr,0,0);
  ctx.clearRect(0,0,session.entryWidth,session.entryHeight);
  const starProgress=easeOut(clamp((elapsed-900)/(ENTRY_CELL_TRAVEL_END_MS-900)));
  drawEntryStars(mix(.12,session.entryAction==='play'?.82:.28,starProgress),now);
  const tileProgress=clamp((elapsed-ENTRY_TESSELLATE_START_MS)/(ENTRY_TESSELLATE_END_MS-ENTRY_TESSELLATE_START_MS));
  const moveProgress=clamp((elapsed-ENTRY_TESSELLATE_END_MS)/(ENTRY_CELL_TRAVEL_END_MS-ENTRY_TESSELLATE_END_MS));
  for(const cell of session.entryCells){
    const local=clamp((moveProgress-cell.delay)/Math.max(.001,1-cell.delay)),travel=easeOut(local);
    const x=mix(cell.x,cell.targetX,travel),y=mix(cell.y,cell.targetY,travel)-Math.sin(local*Math.PI)*18;
    const size=cell.size*mix(.92+tileProgress*.08,.10,travel),alpha=clamp(tileProgress*1.3)*(1-Math.pow(local,2.2));
    drawEntryCell(cell,x,y,size,alpha,cell.rotation+cell.spin*travel);
  }
  const card=q('[data-main-orientation-entry-card]',session.overlay);
  if(card){
    const fade=clamp((elapsed-ENTRY_TESSELLATE_START_MS*.72)/(ENTRY_TESSELLATE_END_MS+420-ENTRY_TESSELLATE_START_MS*.72));
    card.style.opacity=String(1-fade);card.style.transform=`scale(${mix(1,.988,fade)})`;card.style.pointerEvents=fade>.06?'none':'auto';
  }
  if(session.entryAction==='play'&&elapsed>=ENTRY_FILM_REVEAL_MS&&!session.entryTransitionComplete){
    session.entryTransitionComplete=true;
    if(session.overlay)session.overlay.dataset.entryState='DOM_DISSOLVING_FILM_STARTING';
  }
  if(session.entryAction==='play')void maybeStartMasterPlayback();
  if(elapsed>=ENTRY_CELL_TRAVEL_END_MS){
    if(session.entryAction!=='play'){settle(session.entryAction||'skip-armed');return;}
    if(session.firstFramePresented){session.gate?.setAttribute('hidden','');cancelEntryFrame();return;}
  }
  session.entryRaf=requestAnimationFrame(drawEntryTransition);
}

function noteVideoReady(){
  const video=session.video;
  if(!video||video.readyState<2)return;
  session.videoReady=true;
  if(session.overlay)session.overlay.dataset.videoReady='true';
  void maybeStartMasterPlayback();
}
function revealFirstPresentedFrame(){
  if(session.state===STATE.SETTLED||session.firstFramePresented)return;
  session.firstFramePresented=true;
  if(session.overlay){
    session.overlay.dataset.entryState='COMPLETE';
    session.overlay.dataset.firstFramePresentedBeforeEntryClear='true';
  }
  markState(STATE.PLAYING);
  session.gate?.setAttribute('hidden','');
  cancelEntryFrame();
}
async function maybeStartMasterPlayback(){
  if(session.videoStartRequested||session.state===STATE.SETTLED||!session.playRequested||!session.entryTransitionComplete||!session.videoReady)return;
  const video=session.video,ambientVideo=session.ambientVideo;
  if(!video)return;
  session.videoStartRequested=true;
  suppressAmbient();
  try{
    video.currentTime=0;
    if(ambientVideo){ambientVideo.currentTime=0;const ambientPlay=ambientVideo.play();if(ambientPlay&&typeof ambientPlay.catch==='function')ambientPlay.catch(()=>{});}
    if(typeof video.requestVideoFrameCallback==='function'){
      video.requestVideoFrameCallback(()=>revealFirstPresentedFrame());
    }else{
      video.addEventListener('playing',()=>requestAnimationFrame(revealFirstPresentedFrame),{once:true});
    }
    const p=video.play();
    startAudraliaMonitor();
    if(p&&typeof p.then==='function')await p;
    if(typeof video.requestVideoFrameCallback!=='function'&&video.readyState>=2&&video.currentTime>0)requestAnimationFrame(revealFirstPresentedFrame);
  }catch(error){
    session.overlay?.setAttribute('data-player-error',String(error?.name||'PLAY_FAILED'));
    settle('fail-open');
  }
}

function play(){
  if(session.state!==STATE.ARMED||session.playRequested)return;
  if(reduced()){settle('reduced-motion-complete');return;}
  session.playRequested=true;
  session.entryAction='play';
  session.entryTransitionComplete=true;
  session.overlay.dataset.entryState='MASTER_STARTING';
  session.entryStartedAt=performance.now();
  suppressAmbient();
  const video=session.video;
  try{
    video.preload='auto';
    video.currentTime=0;
    if(video.readyState===0)video.load();
    noteVideoReady();
    void maybeStartMasterPlayback();
  }catch(error){
    session.overlay?.setAttribute('data-player-error',String(error?.name||'MEDIA_PREPARE_FAILED'));
    settle('fail-open');
  }
}

function skip(){
  if(session.state===STATE.SETTLED||session.entryAction.startsWith('skip'))return;
  if(reduced()){settle('reduced-motion-skip');return;}
  const playing=session.state===STATE.PLAYING;
  session.entryAction=playing?'skip-playing':'skip-armed';
  session.overlay.dataset.entryState='SKIP_DISSOLVE';
  session.overlay.classList.add('is-skip-handoff');
  session.gate?.removeAttribute('hidden');
  session.gate?.classList.add('is-dissolving','is-skip-dissolve');
  const card=q('[data-main-orientation-entry-card]',session.overlay);
  if(playing&&card)card.hidden=true;
  resizeEntryCanvas();
  buildEntryTessellation(playing?session.overlay:card);
  session.entryStartedAt=performance.now();
  session.entryRaf=requestAnimationFrame(drawEntryTransition);
}

function retractEntryControls(then){
  if(session.state!==STATE.ARMED||reduced()){then();return;}
  if(session.entryControlTimer||session.overlay?.dataset.entryState==='CONTROLS_RETRACTING')return;
  session.overlay.dataset.entryState='CONTROLS_RETRACTING';
  for(const button of [session.play,session.skip]){
    if(!button)continue;
    button.disabled=true;
    button.setAttribute('aria-disabled','true');
  }
  session.entryControlTimer=window.setTimeout(()=>{
    session.entryControlTimer=0;
    then();
  },ENTRY_CONTROL_RETRACT_MS);
}

function onOverlayClick(event){
  if(event.target.closest('[data-main-orientation-play]')){
    event.preventDefault();event.stopPropagation();retractEntryControls(play);return;
  }
  if(event.target.closest('[data-main-orientation-skip]')){
    event.preventDefault();event.stopPropagation();
    if(session.state===STATE.ARMED)retractEntryControls(skip);
    else skip();
  }
}
function onKey(event){
  if(session.state===STATE.SETTLED)return;
  if(event.key==='Escape'){
    event.preventDefault();event.stopPropagation();
    if(session.state===STATE.ARMED)retractEntryControls(skip);
    else skip();
  }
}
function onAmbientTrigger(){if(session.state===STATE.PLAYING||session.playRequested)queueMicrotask(suppressAmbient);}

function bindOverlay(){
  const overlay=session.overlay,video=session.video,ambientVideo=session.ambientVideo;
  overlay.addEventListener('click',onOverlayClick);
  video.addEventListener('loadeddata',noteVideoReady);
  video.addEventListener('canplay',noteVideoReady);
  video.addEventListener('ended',()=>settle('complete'),{once:true});
  video.addEventListener('error',()=>settle('fail-open'),{once:true});
  video.addEventListener('timeupdate',maybeNaturalFade);
  video.addEventListener('timeupdate',()=>updateAudraliaHold(video.currentTime));
  video.addEventListener('timeupdate',()=>{if(ambientVideo&&Math.abs((ambientVideo.currentTime||0)-(video.currentTime||0))>.09)ambientVideo.currentTime=video.currentTime;});
  window.addEventListener('keydown',onKey,true);
  window.addEventListener('resize',resizeEntryCanvas,{passive:true});
}

function resetRunState(){
  session.fadeStarted=false;
  session.entryStars=[];session.entryCells=[];
  session.entryStartedAt=0;session.entryRaf=0;
  session.playRequested=false;session.entryTransitionComplete=false;session.videoReady=false;
  session.videoStartRequested=false;session.firstFramePresented=false;
  session.entryAction='';
  session.entryControlTimer=0;session.audraliaFrameCallback=0;
  session.audraliaHoldCaptured=false;session.audraliaHoldVisible=false;session.audraliaHoldReleased=false;
  session.audraliaDwellTimer=0;session.audraliaDwellStarted=false;session.audraliaDwellComplete=false;session.audraliaDwellMediaTime=0;
}
function mount(source='initial'){
  if(session.overlay)return;
  removeReplay();
  session.url=location.href;
  session.historyLength=history.length;
  resetRunState();
  try{
    captureProduct();
    snapshotAmbient();
    document.documentElement.classList.add('compass-orientation-cinematic-active');
    const overlay=buildOverlay();
    overlay.dataset.mountSource=source;
    overlay.dataset.entryRoute=source==='ordinary-entry'
      ?(session.entryDecision?.reason||'EXTERNAL_OR_DIRECT_ENTRY')
      :'REPLAY_FORCED';
    overlay.dataset.reducedMotion=String(reduced());
    markState(STATE.ARMED);
    bindOverlay();
    resizeEntryCanvas();
    drawEntryIdle();
    noteVideoReady();
    session.gate?.focus({preventScroll:true});
  }catch(error){
    cleanupOverlay();restoreProduct();restoreAmbient();
    document.documentElement.classList.remove('compass-orientation-cinematic-active');
    delete document.documentElement.dataset.compassOrientationCinematic;
    session.state=STATE.SETTLED;
    console.error('COMPASS_PRERENDERED_PLAYER_FAIL_OPEN',error);
  }
}

['pointerdown','pointerup','touchstart','touchend','click','keydown','wheel'].forEach(type=>document.addEventListener(type,onAmbientTrigger,true));

globalThis.__DGB_COMPASS_PRERENDERED_PLAYER__=Object.freeze({
  contract:CONTRACT,
  entryPolicy:ENTRY_POLICY,
  decideEntry:input=>decideOrdinaryEntry(input),
  replay:()=>mount('inspection-api'),
  skip,
  inspect:()=>Object.freeze({
    state:session.state,
    overlayMounted:Boolean(session.overlay),
    mediaPath:CONTRACT.mediaPath,
    mediaGitBlob:CONTRACT.mediaGitBlob,
    mediaSha256:CONTRACT.mediaSha256,
    entryPrerollMs:CONTRACT.entryPrerollMs,
    entryPrerollCountedInMaster:CONTRACT.entryPrerollCountedInMaster,
    playRequested:session.playRequested,
    entryTransitionComplete:session.entryTransitionComplete,
    videoReady:session.videoReady,
    firstFramePresentedBeforeEntryClear:session.firstFramePresented,
    entryAction:session.entryAction,
    viewportLaw:CONTRACT.viewportLaw,
    terminalLaw:CONTRACT.terminalLaw,
    reducedMotion:reduced(),
    rootInert:Boolean(session.root?.inert),
    ambientMuted:Boolean(session.ambient?.muted),
    currentTime:Number(session.video?.currentTime||0),
    duration:Number(session.video?.duration||0),
    audraliaPerceptualDwellMs:AUDRALIA_PERCEPTUAL_DWELL_MS,
    audraliaDwellStarted:session.audraliaDwellStarted,
    audraliaDwellComplete:session.audraliaDwellComplete,
    audraliaDwellMediaTime:session.audraliaDwellMediaTime,
    entryDecision:session.entryDecision
  })
});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',routeOrdinaryEntry,{once:true});
else routeOrdinaryEntry();
})();