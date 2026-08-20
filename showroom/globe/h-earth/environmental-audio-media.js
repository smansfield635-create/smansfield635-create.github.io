const style=document.createElement('style');
style.textContent=`.h-earth-ambient-control{position:fixed;right:10px;bottom:10px;z-index:2147483000;width:38px;height:38px;border:1px solid rgba(220,242,238,.14);border-radius:50%;background:rgba(2,10,14,.42);backdrop-filter:blur(8px);opacity:.42;transition:opacity .18s ease}.h-earth-ambient-control:focus-within,.h-earth-ambient-control:hover{opacity:.9}.h-earth-ambient-control button{position:absolute;inset:0;border:0;border-radius:50%;background:transparent;color:#e8f4f1;font:800 0/1 sans-serif}.h-earth-ambient-control button::before{content:'♪';position:absolute;inset:0;display:grid;place-items:center;font:700 16px/1 system-ui}.h-earth-ambient-control[data-muted='true'] button::after{content:'';position:absolute;left:10px;right:10px;top:18px;height:2px;background:currentColor;transform:rotate(-45deg)}`;
document.head.appendChild(style);
const ui=document.createElement('div');ui.className='h-earth-ambient-control';ui.innerHTML='<button type="button" aria-label="Start environmental sound" aria-pressed="false"></button>';document.body.appendChild(ui);
const button=ui.querySelector('button');

const ROLES=Object.freeze({
  COAST:'COASTAL_FOREGROUND_TERRAIN',
  TRANSITION:'COASTAL_TO_INLAND_TRANSITION_TERRAIN',
  HIGHLAND:'INLAND_ELEVATED_TERRAIN_WITH_PROXY_PARTITIONS'
});
const PROFILES=Object.freeze({
  [ROLES.COAST]:Object.freeze({surf:.34,scrub:.025,wind:.055}),
  [ROLES.TRANSITION]:Object.freeze({surf:.075,scrub:.115,wind:.08}),
  [ROLES.HIGHLAND]:Object.freeze({surf:0,scrub:.045,wind:.16})
});

function writeAscii(view,offset,text){for(let i=0;i<text.length;i++)view.setUint8(offset+i,text.charCodeAt(i));}
function wavFromSamples(sampleValues,sampleRate){
  const bytes=44+sampleValues.length*2,buffer=new ArrayBuffer(bytes),view=new DataView(buffer);
  writeAscii(view,0,'RIFF');view.setUint32(4,bytes-8,true);writeAscii(view,8,'WAVE');writeAscii(view,12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeAscii(view,36,'data');view.setUint32(40,sampleValues.length*2,true);
  sampleValues.forEach((sample,index)=>view.setInt16(44+index*2,Math.round(Math.max(-1,Math.min(1,sample))*32767),true));
  return new Blob([buffer],{type:'audio/wav'});
}
function createSurfWav(seconds=43,sampleRate=22050){
  const samples=new Float32Array(Math.floor(seconds*sampleRate));
  const waveTimes=[1.8,7.6,14.2,21.9,30.1,37.5];
  let low=0,soft=0;
  for(let i=0;i<samples.length;i++){
    const t=i/sampleRate,white=Math.random()*2-1;
    low=low*.9975+white*.0025;soft=soft*.95+white*.05;
    let wash=0;
    for(const c of waveTimes){const d=(t-c)/2.8;if(Math.abs(d)<1){const e=Math.pow(Math.cos(d*Math.PI*.5),4);wash+=e*(low*.14+soft*.036);}}
    samples[i]=wash;
  }
  return wavFromSamples(samples,sampleRate);
}
function createScrubWav(seconds=49,sampleRate=22050){
  const samples=new Float32Array(Math.floor(seconds*sampleRate));
  let body=0,leaf=0;
  for(let i=0;i<samples.length;i++){
    const t=i/sampleRate,white=Math.random()*2-1;
    body=body*.994+white*.006;leaf=leaf*.84+white*.16;
    const pulse=.42+.12*Math.sin(t*.19+1.3)+.08*Math.sin(t*.053+.4)+.05*Math.sin(t*.47+2.2);
    samples[i]=(body*.085+leaf*.012)*pulse;
  }
  return wavFromSamples(samples,sampleRate);
}
function createHighlandWindWav(seconds=53,sampleRate=22050){
  const samples=new Float32Array(Math.floor(seconds*sampleRate));
  let deep=0,body=0,air=0;
  for(let i=0;i<samples.length;i++){
    const t=i/sampleRate,white=Math.random()*2-1;
    deep=deep*.99935+white*.00065;body=body*.994+white*.006;air=air*.972+white*.028;
    const gust=.54+.14*Math.sin(t*.17+.8)+.10*Math.sin(t*.061+2.4)+.07*Math.sin(t*.31+1.6);
    samples[i]=(deep*.18+body*.075+air*.012)*gust;
  }
  return wavFromSamples(samples,sampleRate);
}
function makeAudio(blob){const audio=document.createElement('audio');audio.loop=true;audio.preload='auto';audio.playsInline=true;audio.src=URL.createObjectURL(blob);audio.style.display='none';audio.volume=0;document.body.appendChild(audio);return audio;}
const surfAudio=makeAudio(createSurfWav());
const scrubAudio=makeAudio(createScrubWav());
const windAudio=makeAudio(createHighlandWindWav());
const channels=[surfAudio,scrubAudio,windAudio];
let started=false,muted=false,regionTimer=0,mixTimer=0;
let activeRole=ROLES.COAST;
let current={surf:0,scrub:0,wind:0};
let target={...PROFILES[activeRole]};

function resolveDisplayedRole(){
  const snapshotRole=window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.getSnapshot?.()?.state?.physicalRole;
  if(PROFILES[snapshotRole])return snapshotRole;
  const waypoint=document.getElementById('hud-waypoint')?.textContent?.trim();
  if(PROFILES[waypoint])return waypoint;
  const visibleText=[...document.querySelectorAll('output,code,span,div')].map(node=>node.textContent?.trim()).find(text=>PROFILES[text]);
  return visibleText||activeRole;
}
function setRole(role){
  if(!PROFILES[role]||role===activeRole)return;
  activeRole=role;
  target={...PROFILES[role]};
}
function mixStep(){
  const smoothing=.09;
  for(const key of ['surf','scrub','wind'])current[key]+=((muted?0:target[key])-current[key])*smoothing;
  surfAudio.volume=Math.max(0,Math.min(1,current.surf));
  scrubAudio.volume=Math.max(0,Math.min(1,current.scrub));
  windAudio.volume=Math.max(0,Math.min(1,current.wind));
}
function pollRegion(){setRole(resolveDisplayedRole());}
async function ensurePlayback(){
  if(started&&channels.some(audio=>!audio.paused))return true;
  const results=await Promise.allSettled(channels.map(audio=>audio.play()));
  started=results.some(result=>result.status==='fulfilled')&&channels.some(audio=>!audio.paused);
  button.setAttribute('aria-pressed',started&&!muted?'true':'false');
  button.setAttribute('aria-label',started?(muted?'Enable environmental sound':'Mute environmental sound'):'Start environmental sound');
  if(started&&!regionTimer){pollRegion();regionTimer=setInterval(pollRegion,260);mixTimer=setInterval(mixStep,90);}
  return started;
}
const activate=()=>{void ensurePlayback();};
for(const type of ['pointerdown','touchend','click','keydown'])window.addEventListener(type,activate,{once:true,capture:true,passive:type!=='keydown'});
button.addEventListener('click',async event=>{event.preventDefault();event.stopImmediatePropagation();if(!started){await ensurePlayback();return;}muted=!muted;ui.dataset.muted=muted?'true':'false';button.setAttribute('aria-pressed',muted?'false':'true');button.setAttribute('aria-label',muted?'Enable environmental sound':'Mute environmental sound');},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){channels.forEach(audio=>audio.pause());}else if(started&&!muted){channels.forEach(audio=>void audio.play().catch(()=>{}));}});
window.addEventListener('beforeunload',()=>{clearInterval(regionTimer);clearInterval(mixTimer);channels.forEach(audio=>URL.revokeObjectURL(audio.src));},{once:true});
window.H_EARTH_MEDIA_AUDIO=Object.freeze({
  version:'H_EARTH_MEDIA_AUDIO_23949_v5_REGION_CLASSIFIED_CROSSFADE',
  delivery:'THREE_LAYER_HTML_MEDIA_GENERATED_WAV',
  regionAuthority:'DISPLAYED_PHYSICAL_TERRAIN_ROLE',
  smoothRegionCrossfade:true,
  roles:Object.freeze(Object.values(ROLES)),
  get started(){return started;},
  get muted(){return muted;},
  get activeRole(){return activeRole;},
  get volumes(){return Object.freeze({...current});},
  start:ensurePlayback
});
