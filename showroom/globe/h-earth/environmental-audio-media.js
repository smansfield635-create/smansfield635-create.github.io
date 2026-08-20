import {getHEarthCanonicalShorelineZ} from '../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const existingUi=document.querySelector('.h-earth-experience-audio');
const button=existingUi?.querySelector('button')||null;

function writeAscii(view,offset,text){for(let i=0;i<text.length;i++)view.setUint8(offset+i,text.charCodeAt(i));}
function createCoastalWav(seconds=10,sampleRate=22050){
  const samples=Math.floor(seconds*sampleRate);
  const bytes=44+samples*2;
  const buffer=new ArrayBuffer(bytes);
  const view=new DataView(buffer);
  writeAscii(view,0,'RIFF');view.setUint32(4,bytes-8,true);writeAscii(view,8,'WAVE');writeAscii(view,12,'fmt ');
  view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeAscii(view,36,'data');view.setUint32(40,samples*2,true);
  let low=0,mid=0;
  for(let i=0;i<samples;i++){
    const t=i/sampleRate;
    const white=Math.random()*2-1;
    low=low*.992+white*.008;
    mid=mid*.86+white*.14;
    const waveA=Math.pow((Math.sin(t*Math.PI*2*.115)+1)*.5,5);
    const waveB=Math.pow((Math.sin(t*Math.PI*2*.073+1.7)+1)*.5,7);
    const wash=.42*low+.16*mid;
    const breakNoise=(white*.58+mid*.32)*(waveA*.72+waveB*.48);
    const wind=(white*.13+mid*.08)*(0.65+0.35*Math.sin(t*Math.PI*2*.041+0.9));
    const sample=Math.max(-1,Math.min(1,(wash+breakNoise+wind)*.82));
    view.setInt16(44+i*2,Math.round(sample*32767),true);
  }
  return new Blob([buffer],{type:'audio/wav'});
}

const audio=document.createElement('audio');
audio.loop=true;audio.preload='auto';audio.playsInline=true;audio.volume=.92;
audio.src=URL.createObjectURL(createCoastalWav());
audio.style.display='none';
document.body.appendChild(audio);

let started=false;
let muted=false;
let proximityTimer=0;

function updateProximity(){
  const p=window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.getSnapshot?.()?.state?.position;
  let distance=0;
  if(Number.isFinite(p?.x)&&Number.isFinite(p?.z)){
    const shore=getHEarthCanonicalShorelineZ(p.x);
    distance=Number.isFinite(shore)?Math.abs(p.z-shore):0;
  }
  const coastal=Math.max(0,Math.min(1,1-distance/420));
  const target=muted?0:(.48+.48*coastal);
  audio.volume=Math.max(0,Math.min(1,target));
}

async function ensurePlayback(){
  if(started&&!audio.paused)return true;
  try{
    await audio.play();
    started=!audio.paused;
  }catch(error){
    started=false;
  }
  if(button){
    button.setAttribute('aria-pressed',started&&!muted?'true':'false');
    button.setAttribute('aria-label',started?(muted?'Enable environmental sound':'Mute environmental sound'):'Start environmental sound');
  }
  if(started&&!proximityTimer){updateProximity();proximityTimer=setInterval(updateProximity,500);}
  return started;
}

const activate=()=>{void ensurePlayback();};
for(const type of ['pointerdown','touchend','click','keydown'])window.addEventListener(type,activate,{once:true,capture:true,passive:type!=='keydown'});

if(button){
  button.addEventListener('click',async event=>{
    event.preventDefault();event.stopImmediatePropagation();
    if(!started){await ensurePlayback();return;}
    muted=!muted;audio.muted=muted;
    existingUi.dataset.muted=muted?'true':'false';
    button.setAttribute('aria-pressed',muted?'false':'true');
    button.setAttribute('aria-label',muted?'Enable environmental sound':'Mute environmental sound');
    updateProximity();
  },true);
}

document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();else if(started&&!muted)void audio.play().catch(()=>{});});
window.addEventListener('beforeunload',()=>{clearInterval(proximityTimer);URL.revokeObjectURL(audio.src);},{once:true});

window.H_EARTH_MEDIA_AUDIO=Object.freeze({
  version:'H_EARTH_MEDIA_AUDIO_23949_v1',
  delivery:'HTML_MEDIA_ELEMENT_GENERATED_WAV',
  get started(){return started;},
  get paused(){return audio.paused;},
  get muted(){return muted;},
  get volume(){return audio.volume;},
  start:ensurePlayback
});
