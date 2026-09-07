(()=>{'use strict';

const CONTRACT=Object.freeze({
  version:'COMPASS_PRERENDERED_THIN_PLAYER_R8_v2',
  mutationClass:'BOUNDED_PAGE_RELEASE',
  operationId:'COMPASS_V2_R6_R10_MASTER_PLAYER_RELEASE_20260907_001',
  mediaPath:'/assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4',
  mediaBytes:2723640,
  mediaSha256:'0326240cf1d3d8cf7753b91ea1cd0206378b8db7e37590b8bb39c37f6b50f444',
  mediaGitBlob:'b48bc48e531c3eb29bd1a94a91725badd30186f5',
  sourceHead:'650a0ce31d5667821fc6c0827cd95ee1874c4ba8',
  masterDurationMs:38000,
  entryPrerollMs:4350,
  entryPrerollCountedInMaster:false,
  entryContinuityLaw:'SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER',
  naturalFadeMs:460
});
const STATE=Object.freeze({ARMED:'ARMED',PLAYING:'PLAYING',SETTLED:'SETTLED'});
const ENTRY_TESSELLATE_START_MS=140;
const ENTRY_TESSELLATE_END_MS=820;
const ENTRY_CELL_TRAVEL_END_MS=2300;
const ENTRY_COMPASS_START_MS=1700;
const ENTRY_COMPASS_END_MS=3550;
const ENTRY_GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5));
const ENTRY_SEED=0x0b17e17;
const ENTRY_COLORS=['255,248,224','154,217,225','234,208,131','170,155,224'];

const q=(s,r=document)=>r.querySelector(s);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const easeOut=t=>1-Math.pow(1-clamp(t),3);
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
const session={
  state:null,overlay:null,video:null,gate:null,play:null,skip:null,replay:null,
  root:null,rootInert:false,rootAriaHidden:null,priorFocus:null,
  ambient:null,ambientSnapshot:null,url:null,historyLength:0,
  fadeStarted:false,settlementCount:0,
  entryCanvas:null,entryCtx:null,entryWidth:0,entryHeight:0,entryDpr:1,
  entryStars:[],entryCells:[],entryStartedAt:0,entryRaf:0,
  playRequested:false,entryTransitionComplete:false,videoReady:false,
  videoStartRequested:false,firstFramePresented:false
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
  overlay.setAttribute('data-media-git-blob',CONTRACT.mediaGitBlob);
  overlay.setAttribute('data-media-sha256',CONTRACT.mediaSha256);
  overlay.setAttribute('data-entry-preroll-ms',String(CONTRACT.entryPrerollMs));
  overlay.setAttribute('data-entry-preroll-counted-in-master','false');
  overlay.setAttribute('data-entry-continuity-law',CONTRACT.entryContinuityLaw);
  overlay.setAttribute('data-entry-state','IDLE');
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Diamond Gate Bridge orientation film');

  const video=document.createElement('video');
  video.className='compass-prerendered-player__video';
  video.playsInline=true;
  video.preload='auto';
  video.controls=false;
  video.disablePictureInPicture=true;
  video.setAttribute('aria-label','Diamond Gate Bridge orientation film');
  video.setAttribute('data-main-orientation-video','');
  video.src=CONTRACT.mediaPath;

  const gate=document.createElement('div');
  gate.className='compass-prerendered-player__gate';
  gate.setAttribute('data-main-orientation-gate','');
  gate.innerHTML='<canvas class="compass-prerendered-player__entry-canvas" data-main-orientation-entry-canvas aria-hidden="true"></canvas><div class="compass-prerendered-player__gate-card" data-main-orientation-entry-card><p class="compass-prerendered-player__eyebrow">Diamond Gate Bridge</p><h2>Find your way.</h2><p>A short orientation before you enter.</p><div class="compass-prerendered-player__actions"></div></div>';
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
  session.entryCanvas=q('[data-main-orientation-entry-canvas]',gate);
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
function cleanupOverlay(){
  window.removeEventListener('keydown',onKey,true);
  window.removeEventListener('resize',resizeEntryCanvas);
  cancelEntryFrame();
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
  session.entryCanvas=null;
  session.entryCtx=null;
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
function entryCompassTargets(){
  const width=session.entryWidth,height=session.entryHeight;
  const radius=Math.min(width,height)*(width<560?.34:.29),cx=width*.5,cy=height*.49;
  const targets=[];
  for(let ring=0;ring<3;ring++){
    const r=radius*(.34+ring*.25),count=ring===2?32:20;
    for(let i=0;i<count;i++){
      const a=i/count*Math.PI*2-Math.PI/2;
      targets.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});
    }
  }
  for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2-Math.PI/2,r=i%2===0?radius*.93:radius*.50;
    targets.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r*.78});
  }
  return targets;
}
function buildEntryTessellation(button){
  const rect=button.getBoundingClientRect(),baseSize=clamp(rect.height*.34,14,22);
  const sx=baseSize*.90,sy=baseSize*.72;
  const cols=Math.ceil(rect.width/sx)+2,rows=Math.ceil(rect.height/sy)+2;
  const random=randomFactory(ENTRY_SEED^Math.round(rect.width*17)^Math.round(rect.height*31));
  const compass=entryCompassTargets(),stars=session.entryStars,cells=[];
  for(let row=-1;row<rows;row++)for(let col=-1;col<cols;col++){
    const x=rect.left+col*sx+(row%2?sx*.5:0),y=rect.top+row*sy;
    if(x<rect.left-baseSize||x>rect.right+baseSize||y<rect.top-baseSize||y>rect.bottom+baseSize)continue;
    const target=random()<.62?compass[Math.floor(random()*compass.length)]:stars[Math.floor(random()*stars.length)]||{x:session.entryWidth*.5,y:session.entryHeight*.5};
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
function drawEntryCompass(alpha){
  if(alpha<=0)return;
  const ctx=session.entryCtx,w=session.entryWidth,h=session.entryHeight,cx=w*.5,cy=h*.49,r=Math.min(w,h)*(w<560?.34:.29);
  ctx.save();ctx.globalAlpha=alpha;ctx.lineWidth=1;
  for(const scale of [.34,.59,.84]){
    ctx.strokeStyle='rgba(120,220,232,.25)';ctx.beginPath();ctx.arc(cx,cy,r*scale,0,Math.PI*2);ctx.stroke();
  }
  ctx.strokeStyle='rgba(244,214,128,.48)';ctx.beginPath();ctx.moveTo(cx,cy-r*.96);ctx.lineTo(cx,cy+r*.96);ctx.moveTo(cx-r*.96,cy);ctx.lineTo(cx+r*.96,cy);ctx.stroke();
  ctx.beginPath();
  for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2-Math.PI/2,rr=i%2===0?r*.93:r*.50,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.78;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.closePath();ctx.strokeStyle='rgba(244,214,128,.62)';ctx.stroke();ctx.restore();
}
function drawEntryIdle(now=performance.now()){
  const ctx=session.entryCtx;
  if(!ctx)return;
  ctx.setTransform(session.entryDpr,0,0,session.entryDpr,0,0);
  ctx.clearRect(0,0,session.entryWidth,session.entryHeight);
  drawEntryStars(.10,now);drawEntryCompass(.10);
}
function drawEntryTransition(now){
  if(session.state===STATE.SETTLED||session.firstFramePresented)return;
  const ctx=session.entryCtx,elapsed=Math.max(0,now-session.entryStartedAt);
  if(!ctx){settle('fail-open');return;}
  ctx.setTransform(session.entryDpr,0,0,session.entryDpr,0,0);
  ctx.clearRect(0,0,session.entryWidth,session.entryHeight);
  const starProgress=easeOut(clamp((elapsed-900)/(ENTRY_CELL_TRAVEL_END_MS-900)));
  const compassProgress=easeOut(clamp((elapsed-ENTRY_COMPASS_START_MS)/(ENTRY_COMPASS_END_MS-ENTRY_COMPASS_START_MS)));
  drawEntryStars(mix(.12,.84,starProgress),now);drawEntryCompass(compassProgress);
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
  if(elapsed>=CONTRACT.entryPrerollMs&&!session.entryTransitionComplete){
    session.entryTransitionComplete=true;
    if(session.overlay)session.overlay.dataset.entryState='PREROLL_COMPLETE_WAITING_FOR_FRAME_1';
  }
  void maybeStartMasterPlayback();
  if(!session.firstFramePresented)session.entryRaf=requestAnimationFrame(drawEntryTransition);
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
  session.gate?.setAttribute('hidden','');
  cancelEntryFrame();
  markState(STATE.PLAYING);
}
async function maybeStartMasterPlayback(){
  if(session.videoStartRequested||session.state===STATE.SETTLED||!session.playRequested||!session.entryTransitionComplete||!session.videoReady)return;
  const video=session.video;
  if(!video)return;
  session.videoStartRequested=true;
  suppressAmbient();
  try{
    video.currentTime=0;
    if(typeof video.requestVideoFrameCallback==='function'){
      video.requestVideoFrameCallback(()=>revealFirstPresentedFrame());
    }else{
      video.addEventListener('playing',()=>requestAnimationFrame(revealFirstPresentedFrame),{once:true});
    }
    const p=video.play();
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
  session.overlay.dataset.entryState='TRANSITION';
  suppressAmbient();
  resizeEntryCanvas();
  buildEntryTessellation(session.play);
  session.entryStartedAt=performance.now();
  session.entryRaf=requestAnimationFrame(drawEntryTransition);
  const video=session.video;
  try{
    video.preload='auto';
    video.currentTime=0;
    video.load();
    noteVideoReady();
  }catch(error){
    session.overlay?.setAttribute('data-player-error',String(error?.name||'MEDIA_PREPARE_FAILED'));
    settle('fail-open');
  }
}

function onOverlayClick(event){
  if(event.target.closest('[data-main-orientation-play]')){
    event.preventDefault();event.stopPropagation();play();return;
  }
  if(event.target.closest('[data-main-orientation-skip]')){
    event.preventDefault();event.stopPropagation();
    settle(session.state===STATE.PLAYING?'skip-playing':session.playRequested?'skip-preroll':'skip-armed');
  }
}
function onKey(event){
  if(session.state===STATE.SETTLED)return;
  if(event.key==='Escape'){
    event.preventDefault();event.stopPropagation();
    settle(session.state===STATE.PLAYING?'skip-playing':session.playRequested?'skip-preroll':'skip-armed');
  }
}
function onAmbientTrigger(){if(session.state===STATE.PLAYING||session.playRequested)queueMicrotask(suppressAmbient);}

function bindOverlay(){
  const overlay=session.overlay,video=session.video;
  overlay.addEventListener('click',onOverlayClick);
  video.addEventListener('loadeddata',noteVideoReady);
  video.addEventListener('canplay',noteVideoReady);
  video.addEventListener('ended',()=>settle('complete'),{once:true});
  video.addEventListener('error',()=>settle('fail-open'),{once:true});
  video.addEventListener('timeupdate',maybeNaturalFade);
  window.addEventListener('keydown',onKey,true);
  window.addEventListener('resize',resizeEntryCanvas,{passive:true});
}

function resetRunState(){
  session.fadeStarted=false;
  session.entryStars=[];session.entryCells=[];
  session.entryStartedAt=0;session.entryRaf=0;
  session.playRequested=false;session.entryTransitionComplete=false;session.videoReady=false;
  session.videoStartRequested=false;session.firstFramePresented=false;
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
    overlay.dataset.reducedMotion=String(reduced());
    markState(STATE.ARMED);
    bindOverlay();
    resizeEntryCanvas();
    drawEntryIdle();
    noteVideoReady();
    session.play?.focus({preventScroll:true});
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
  replay:()=>mount('inspection-api'),
  skip:()=>settle(session.state===STATE.PLAYING?'skip-playing':session.playRequested?'skip-preroll':'skip-armed'),
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
