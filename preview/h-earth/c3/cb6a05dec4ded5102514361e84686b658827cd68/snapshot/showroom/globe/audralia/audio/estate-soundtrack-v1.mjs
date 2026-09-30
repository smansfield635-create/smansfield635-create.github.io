const SWAN_LAKE_URL='https://upload.wikimedia.org/wikipedia/commons/4/4d/Peter_Ilyich_Tchaikovsky-_Swan_Lake-_Extract_from_Act_1.ogg';
const GYMNOPEDIE_URL='https://upload.wikimedia.org/wikipedia/commons/2/2a/Gymnopedie_No._1_%28ISRC_USUAN1100787%29.mp3';
const READY_PHASE='RUNTIME_INVARIANTS_READY';
const audio=document.createElement('audio');
audio.dataset.audraliaEstateSoundtrack='true';
audio.preload='auto';
audio.loop=true;
audio.volume=0.34;
audio.setAttribute('aria-hidden','true');
document.body.append(audio);

const control=document.querySelector('[data-audralia-soundtrack-toggle]');
const status=document.querySelector('[data-audralia-soundtrack-status]');
let desired='loading';
let gestureArmed=false;
let destroyed=false;

function ready(){
  return window.__AUDRALIA_STARTUP_DIAGNOSTIC__?.phase===READY_PHASE ||
    window.__AUDRALIA_STARTUP_DIAGNOSTIC__?.status==='READY' ||
    window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants?.pass===true;
}

function currentUrl(){return desired==='exploration'?GYMNOPEDIE_URL:SWAN_LAKE_URL;}
function publish(state,extra={}){
  const receipt=Object.freeze({
    schema:'AUDRALIA_ESTATE_SOUNDTRACK_RUNTIME_RECEIPT_v1',
    state,
    desiredTrack:desired,
    source:currentUrl(),
    muted:audio.muted,
    paused:audio.paused,
    singletonCount:document.querySelectorAll('audio[data-audralia-estate-soundtrack="true"]').length,
    ...extra
  });
  window.__AUDRALIA_ESTATE_SOUNDTRACK__=receipt;
  if(status)status.textContent=audio.muted?'Soundtrack muted':(desired==='exploration'?'Gymnopédie soundtrack':'Swan Lake loading soundtrack');
  if(control){
    control.setAttribute('aria-pressed',String(audio.muted));
    control.textContent=audio.muted?'soundtrack · muted':'soundtrack · on';
  }
  return receipt;
}

function disarmGesture(){
  if(!gestureArmed)return;
  gestureArmed=false;
  window.removeEventListener('pointerdown',resumeFromGesture,true);
  window.removeEventListener('keydown',resumeFromGesture,true);
}

function armGesture(){
  if(gestureArmed||destroyed||audio.muted)return;
  gestureArmed=true;
  window.addEventListener('pointerdown',resumeFromGesture,{capture:true,once:true});
  window.addEventListener('keydown',resumeFromGesture,{capture:true,once:true});
  publish('WAITING_FOR_USER_GESTURE');
}

async function safePlay(reason){
  if(destroyed||audio.muted)return publish('MUTED',{reason});
  try{
    await audio.play();
    disarmGesture();
    return publish('PLAYING',{reason});
  }catch(error){
    if(error?.name==='NotAllowedError'){
      armGesture();
      return publish('AUTOPLAY_BLOCKED_RECOVERABLE',{reason,code:'AUTOPLAY_BLOCKED'});
    }
    return publish('PLAYBACK_UNAVAILABLE',{reason,code:error?.name||'PLAYBACK_ERROR',message:String(error?.message||error)});
  }
}

function resumeFromGesture(){
  gestureArmed=false;
  void safePlay('USER_GESTURE_RECOVERY');
}

function setTrack(next,reason){
  if(desired===next&&audio.src===currentUrl())return;
  desired=next;
  const url=currentUrl();
  if(audio.src!==url){
    audio.pause();
    audio.src=url;
    audio.load();
  }
  publish('TRACK_SELECTED',{reason});
  void safePlay(reason);
}

function inspectReadyState(){
  if(destroyed)return;
  if(ready()&&desired!=='exploration')setTrack('exploration','AUDRALIA_RUNTIME_READY');
}

control?.addEventListener('pointerdown',event=>event.stopPropagation());
control?.addEventListener('click',event=>{
  event.preventDefault();
  event.stopPropagation();
  audio.muted=!audio.muted;
  if(audio.muted){
    disarmGesture();
    audio.pause();
    publish('MUTED_BY_USER');
  }else{
    publish('UNMUTED_BY_USER');
    void safePlay('USER_UNMUTE');
  }
});

window.addEventListener('AUDRALIA_STARTUP_PHASE',inspectReadyState);
const readyTimer=window.setInterval(inspectReadyState,250);
window.addEventListener('pagehide',()=>{
  destroyed=true;
  window.clearInterval(readyTimer);
  disarmGesture();
  audio.pause();
  audio.remove();
},{once:true});

setTrack('loading','PAGE_BINDING_INITIALIZED');
inspectReadyState();
