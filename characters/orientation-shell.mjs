import {ORIENTATION_INSTRUMENTS,CONNECTED_WORLDS,getDestination,resolveSceneRoute} from './destination-registry.mjs';
import {createCloudTraversalController} from './cloud-traversal.mjs';
import {createSceneTransitionController} from './scene-transition.mjs';

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const world=document.querySelector('.world');
const story=document.querySelector('#story');
const storyTitle=document.querySelector('#story-title');
const status=document.querySelector('#status');
const mapPanel=document.querySelector('#coast-map');
const existingReturn=document.querySelector('#return');
const shell=document.createElement('nav');
shell.className='orientation-shell';
shell.setAttribute('aria-label','Mirrorland orientation');
shell.innerHTML=`<button type="button" data-orientation="STORY">Story</button><button type="button" data-orientation="CLOCK">Clock</button><button type="button" data-scene-enter hidden>Enter</button><div class="orientation-worlds" hidden><a href="${CONNECTED_WORLDS.COMPASS.route}">Compass</a><a href="${CONNECTED_WORLDS.SHOWROOM.route}">Showroom</a><a href="${CONNECTED_WORLDS.H_EARTH.route}">H-Earth</a><a href="${CONNECTED_WORLDS.AUDRALIA.route}">Audralia</a></div>`;
const css=document.createElement('style');
css.textContent=`.orientation-shell{position:fixed;left:clamp(14px,3vw,42px);bottom:max(24px,env(safe-area-inset-bottom));z-index:10;display:flex;gap:.42rem;align-items:center}.orientation-shell button,.orientation-worlds a{border:1px solid rgba(255,255,255,.2);border-radius:999px;background:rgba(3,10,19,.72);color:#fff;padding:.55rem .78rem;font:800 .72rem/1 Inter,ui-sans-serif,system-ui;text-decoration:none;backdrop-filter:blur(12px);cursor:pointer}.orientation-shell [data-scene-enter]{background:#f3dfaa;color:#102027}.orientation-worlds{position:absolute;left:0;bottom:calc(100% + .45rem);display:flex;gap:.35rem;padding:.4rem;border:1px solid rgba(255,255,255,.16);border-radius:1rem;background:rgba(3,10,19,.84);backdrop-filter:blur(14px)}.orientation-worlds[hidden]{display:none}@media(max-width:720px){.orientation-shell{left:14px;bottom:76px}.orientation-shell button{padding:.6rem .68rem}.orientation-worlds{max-width:calc(100vw - 28px);flex-wrap:wrap}}`;
document.head.appendChild(css);world?.appendChild(shell);

const transition=createSceneTransitionController({root:document.body,reducedMotion,onState:s=>{document.documentElement.dataset.sceneTransition=s;}});
transition.consumeEntryMarker();
const clouds=createCloudTraversalController({root:document.body,reducedMotion,onState:s=>{document.documentElement.dataset.cloudTravel=s;if(status&&['CLOUD_ENTRY','CLOUD_TRANSIT'].includes(s))status.textContent='Within the cloud layer · the coast falls from view';}});

let activeId=null;
const enterButton=shell.querySelector('[data-scene-enter]');
const worlds=shell.querySelector('.orientation-worlds');
const findSignalId=target=>target?.closest?.('.signal')?.dataset?.destinationId||target?.closest?.('.signal')?.dataset?.id||null;

function syncActiveFromStory(){
  const title=storyTitle?.textContent?.trim();
  if(!title)return;
  const match=Object.values((awaitRegistry())).find(d=>d.title===title);
  if(match){activeId=match.id;enterButton.hidden=false;}
}
function awaitRegistry(){return Object.fromEntries(['crossing','dextrion','alaric','tarian','manor','elara','soren','auren','jeeves','remote'].map(id=>[id,getDestination(id)]).filter(([,v])=>v));}

const observer=new MutationObserver(()=>{if(story?.classList.contains('show'))syncActiveFromStory();});
if(story)observer.observe(story,{attributes:true,subtree:true,childList:true,characterData:true});

document.addEventListener('click',event=>{
  const signal=event.target.closest?.('.signal');
  if(signal){
    const label=signal.textContent?.trim();
    const dest=Object.values(awaitRegistry()).find(d=>label?.includes(d.title));
    if(dest){activeId=dest.id;enterButton.hidden=true;clouds.begin({destinationId:dest.id});}
  }
},true);

shell.querySelector('[data-orientation="STORY"]').addEventListener('click',()=>{
  if(story?.classList.contains('show')){story.classList.remove('show');return;}
  if(activeId){const inspect=document.querySelector('#inspect');if(inspect&&!inspect.hidden)inspect.click();}
  else if(status)status.textContent=`${ORIENTATION_INSTRUMENTS.STORY.title} · select a place or character to reveal its context`;
});

shell.querySelector('[data-orientation="CLOCK"]').addEventListener('click',()=>{
  worlds.hidden=!worlds.hidden;
  if(status)status.textContent=worlds.hidden?'Orbit · survey the coast':'Clock · orient between the connected worlds';
});

enterButton.addEventListener('click',()=>{
  const route=resolveSceneRoute(activeId);
  if(!route)return;
  transition.enter(route);
});

existingReturn?.addEventListener('click',()=>{transition.clear();clouds.clear();activeId=null;enterButton.hidden=true;worlds.hidden=true;});
window.addEventListener('keydown',event=>{if(event.key==='Escape'){transition.clear();worlds.hidden=true;if(mapPanel?.classList.contains('show'))return;}});

const params=new URLSearchParams(location.search);
const sceneId=params.get('scene');
if(sceneId&&getDestination(sceneId)){
  activeId=sceneId;
  enterButton.hidden=false;
  if(status)status.textContent=`Scene threshold · ${getDestination(sceneId).title}`;
}
