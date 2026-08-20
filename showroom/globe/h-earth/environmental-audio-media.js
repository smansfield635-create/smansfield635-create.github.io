import {getHEarthCanonicalShorelineZ} from '../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const style=document.createElement('style');
style.textContent=`.h-earth-ambient-control{position:fixed;right:10px;bottom:10px;z-index:2147483000;width:38px;height:38px;border:1px solid rgba(220,242,238,.14);border-radius:50%;background:rgba(2,10,14,.42);backdrop-filter:blur(8px);opacity:.42;transition:opacity .18s ease}.h-earth-ambient-control:focus-within,.h-earth-ambient-control:hover{opacity:.9}.h-earth-ambient-control button{position:absolute;inset:0;border:0;border-radius:50%;background:transparent;color:#e8f4f1;font:800 0/1 sans-serif}.h-earth-ambient-control button::before{content:'♪';position:absolute;inset:0;display:grid;place-items:center;font:700 16px/1 system-ui}.h-earth-ambient-control[data-muted='true'] button::after{content:'';position:absolute;left:10px;right:10px;top:18px;height:2px;background:currentColor;transform:rotate(-45deg)}`;
document.head.appendChild(style);
const ui=document.createElement('div');ui.className='h-earth-ambient-control';ui.innerHTML='<button type="button" aria-label="Start environmental sound" aria-pressed="false"></button>';document.body.appendChild(ui);
const button=ui.querySelector('button');

function writeAscii(view,offset,text){for(let i=0;i<text.length;i++)view.setUint8(offset+i,text.charCodeAt(i));}
function wavFromSamples(sampleValues,sampleRate){
  const bytes=44+sampleValues.length*2,buffer=new ArrayBuffer(bytes),view=new DataView(buffer);
  writeAscii(view,0,'RIFF');view.setUint32(4,bytes-8,true);writeAscii(view,8,'WAVE');writeAscii(view,12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeAscii(view,36,'data');view.setUint32(40,sampleValues.length*2,true);
  sampleValues.forEach((sample,index)=>view.setInt16(44+index*2,Math.round(Math.max(-1,Math.min(1,sample))*32767),true));
  return new Blob([buffer],{type:'audio/wav'});
}
function createSurfWav(seconds=41,sampleRate=22050){
  const samples=new Float32Array(Math.floor(seconds*sampleRate));
  const waveTimes=[1.6,7.1,13.4,20.6,28.8,36.2];
  let low=0,soft=0;
  for(let i=0;i<samples.length;i++){
    const t=i/sampleRate,white=Math.random()*2-1;
    low=low*.9974+white*.0026;soft=soft*.95+white*.05;
    let wash=0;
    for(const c of waveTimes){
      const d=(t-c)/2.65;
      if(Math.abs(d)<1){const envelope=Math.pow(Math.cos(d*Math.PI*.5),4);wash+=envelope*(low*.145+soft*.038);}
    }
    samples[i]=wash;
  }
  return wavFromSamples(samples,sampleRate);
}
function createWindWav(seconds=47,sampleRate=22050){
  const samples=new Float32Array(Math.floor(seconds*sampleRate));
  let slow=0,body=0,air=0;
  for(let i=0;i<samples.length;i++){
    const t=i/sampleRate,white=Math.random()*2-1;
    slow=slow*.9991+white*.0009;
    body=body*.992+white*.008;
    air=air*.965+white*.035;
    const gust=.62+.17*Math.sin(t*.23+.7)+.11*Math.sin(t*.071+2.1)+.06*Math.sin(t*.41+1.3);
    const natural=(slow*.20+body*.095+air*.018)*gust;
    samples[i]=natural;
  }
  return wavFromSamples(samples,sampleRate);
}
function makeAudio(blob){const audio=document.createElement('audio');audio.loop=true;audio.preload='auto';audio.playsInline=true;audio.src=URL.createObjectURL(blob);audio.style.display='none';document.body.appendChild(audio);return audio;}
const surfAudio=makeAudio(createSurfWav());
const windAudio=makeAudio(createWindWav());
let started=false,muted=false,proximityTimer=0,lastDistance=0;
const clamp01=value=>Math.max(0,Math.min(1,value));
function updateProximity(){
  const p=window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.getSnapshot?.()?.state?.position;
  let distance=lastDistance;
  if(Number.isFinite(p?.x)&&Number.isFinite(p?.z)){
    const shore=getHEarthCanonicalShorelineZ(p.x);
    if(Number.isFinite(shore))distance=Math.abs(p.z-shore);
  }
  lastDistance=distance;
  const coastal=clamp01(1-distance/600);
  const surfPresence=coastal*coastal;
  const inland=1-coastal;
  surfAudio.volume=muted?0:Math.min(.36,.015+.345*surfPresence);
  windAudio.volume=muted?0:Math.min(.14,.055+.075*Math.pow(inland,.72));
}
async function ensurePlayback(){
  if(started&&!surfAudio.paused&&!windAudio.paused)return true;
  try{
    const results=await Promise.allSettled([surfAudio.play(),windAudio.play()]);
    started=results.some(result=>result.status==='fulfilled')&&(!surfAudio.paused||!windAudio.paused);
  }catch{started=false;}
  button.setAttribute('aria-pressed',started&&!muted?'true':'false');
  button.setAttribute('aria-label',started?(muted?'Enable environmental sound':'Mute environmental sound'):'Start environmental sound');
  if(started&&!proximityTimer){updateProximity();proximityTimer=setInterval(updateProximity,450);}
  return started;
}
const activate=()=>{void ensurePlayback();};
for(const type of ['pointerdown','touchend','click','keydown'])window.addEventListener(type,activate,{once:true,capture:true,passive:type!=='keydown'});
button.addEventListener('click',async event=>{event.preventDefault();event.stopImmediatePropagation();if(!started){await ensurePlayback();return;}muted=!muted;surfAudio.muted=muted;windAudio.muted=muted;ui.dataset.muted=muted?'true':'false';button.setAttribute('aria-pressed',muted?'false':'true');button.setAttribute('aria-label',muted?'Enable environmental sound':'Mute environmental sound');updateProximity();},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){surfAudio.pause();windAudio.pause();}else if(started&&!muted){void surfAudio.play().catch(()=>{});void windAudio.play().catch(()=>{});}});
window.addEventListener('beforeunload',()=>{clearInterval(proximityTimer);URL.revokeObjectURL(surfAudio.src);URL.revokeObjectURL(windAudio.src);},{once:true});
window.H_EARTH_MEDIA_AUDIO=Object.freeze({version:'H_EARTH_MEDIA_AUDIO_23949_v4_SPATIAL_SURF_NATURAL_WIND',delivery:'DUAL_HTML_MEDIA_ELEMENT_GENERATED_WAV',singleAmbientAuthority:true,independentSurfAndWind:true,canonicalCoastProximityAudio:true,surfRecedesWithCoastDistance:true,naturalWindBed:true,get started(){return started;},get muted(){return muted;},get coastDistance(){return lastDistance;},get surfVolume(){return surfAudio.volume;},get windVolume(){return windAudio.volume;},start:ensurePlayback});
