import {getHEarthCanonicalShorelineZ} from '../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const style=document.createElement('style');
style.textContent=`.h-earth-ambient-control{position:fixed;right:10px;bottom:10px;z-index:2147483000;width:38px;height:38px;border:1px solid rgba(220,242,238,.14);border-radius:50%;background:rgba(2,10,14,.42);backdrop-filter:blur(8px);opacity:.42;transition:opacity .18s ease}.h-earth-ambient-control:focus-within,.h-earth-ambient-control:hover{opacity:.9}.h-earth-ambient-control button{position:absolute;inset:0;border:0;border-radius:50%;background:transparent;color:#e8f4f1;font:800 0/1 sans-serif}.h-earth-ambient-control button::before{content:'♪';position:absolute;inset:0;display:grid;place-items:center;font:700 16px/1 system-ui}.h-earth-ambient-control[data-muted='true'] button::after{content:'';position:absolute;left:10px;right:10px;top:18px;height:2px;background:currentColor;transform:rotate(-45deg)}`;
document.head.appendChild(style);
const ui=document.createElement('div');ui.className='h-earth-ambient-control';ui.innerHTML='<button type="button" aria-label="Start environmental sound" aria-pressed="false"></button>';document.body.appendChild(ui);
const button=ui.querySelector('button');

function writeAscii(view,offset,text){for(let i=0;i<text.length;i++)view.setUint8(offset+i,text.charCodeAt(i));}
function createCoastalWav(seconds=38,sampleRate=22050){
  const samples=Math.floor(seconds*sampleRate),bytes=44+samples*2,buffer=new ArrayBuffer(bytes),view=new DataView(buffer);
  writeAscii(view,0,'RIFF');view.setUint32(4,bytes-8,true);writeAscii(view,8,'WAVE');writeAscii(view,12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeAscii(view,36,'data');view.setUint32(40,samples*2,true);
  let low=0,soft=0;
  const waveTimes=[1.8,7.4,13.9,21.8,29.1,35.2];
  for(let i=0;i<samples;i++){
    const t=i/sampleRate,white=Math.random()*2-1;
    low=low*.997+white*.003;soft=soft*.94+white*.06;
    let wave=0;
    for(const c of waveTimes){const d=(t-c)/2.4;if(Math.abs(d)<1){const e=Math.pow(Math.cos(d*Math.PI*.5),3);wave+=e*(low*.18+soft*.055);}}
    const breeze=(low*.038+soft*.018)*(0.78+0.22*Math.sin(t*.17));
    const sample=Math.max(-1,Math.min(1,wave+breeze));
    view.setInt16(44+i*2,Math.round(sample*32767),true);
  }
  return new Blob([buffer],{type:'audio/wav'});
}

const audio=document.createElement('audio');audio.loop=true;audio.preload='auto';audio.playsInline=true;audio.volume=.34;audio.src=URL.createObjectURL(createCoastalWav());audio.style.display='none';document.body.appendChild(audio);
let started=false,muted=false,proximityTimer=0;
function updateProximity(){
  const p=window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.getSnapshot?.()?.state?.position;
  let distance=0;if(Number.isFinite(p?.x)&&Number.isFinite(p?.z)){const shore=getHEarthCanonicalShorelineZ(p.x);distance=Number.isFinite(shore)?Math.abs(p.z-shore):0;}
  const coastal=Math.max(0,Math.min(1,1-distance/480));
  audio.volume=muted?0:(.18+.24*coastal);
}
async function ensurePlayback(){
  if(started&&!audio.paused)return true;
  try{await audio.play();started=!audio.paused;}catch{started=false;}
  button.setAttribute('aria-pressed',started&&!muted?'true':'false');button.setAttribute('aria-label',started?(muted?'Enable environmental sound':'Mute environmental sound'):'Start environmental sound');
  if(started&&!proximityTimer){updateProximity();proximityTimer=setInterval(updateProximity,700);}return started;
}
const activate=()=>{void ensurePlayback();};
for(const type of ['pointerdown','touchend','click','keydown'])window.addEventListener(type,activate,{once:true,capture:true,passive:type!=='keydown'});
button.addEventListener('click',async event=>{event.preventDefault();event.stopImmediatePropagation();if(!started){await ensurePlayback();return;}muted=!muted;audio.muted=muted;ui.dataset.muted=muted?'true':'false';button.setAttribute('aria-pressed',muted?'false':'true');button.setAttribute('aria-label',muted?'Enable environmental sound':'Mute environmental sound');updateProximity();},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();else if(started&&!muted)void audio.play().catch(()=>{});});
window.addEventListener('beforeunload',()=>{clearInterval(proximityTimer);URL.revokeObjectURL(audio.src);},{once:true});
window.H_EARTH_MEDIA_AUDIO=Object.freeze({version:'H_EARTH_MEDIA_AUDIO_23949_v3_GENTLE_COAST_NO_TONAL_CALLS',delivery:'HTML_MEDIA_ELEMENT_GENERATED_WAV',singleAmbientAuthority:true,distantGulls:false,canonicalCoastProximityAudio:true,get started(){return started;},get paused(){return audio.paused;},get muted(){return muted;},get volume(){return audio.volume;},start:ensurePlayback});
