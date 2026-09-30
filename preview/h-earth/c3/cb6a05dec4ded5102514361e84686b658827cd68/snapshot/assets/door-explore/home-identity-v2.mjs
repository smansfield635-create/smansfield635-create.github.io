import { createCardClock } from './card-lifecycle-v1.mjs';

const HOME_IDENTITY_CYCLE_MS = 12000;
const SPECIMEN_ID = 'DOOR_EXPLORE_HOME_IDENTITY_SPATIAL_V2';
const HOUSE_SCENE_URL = '/assets/compass/compass.house-scene.js?v=mirror-manor-gothic-phase3-carousel-v6-material-detail-final';
const HOUSE_RENDERER_VERSION = 'mirror-manor-gothic-phase3-carousel-v6-material-detail-final';
const HOUSE_CONTRACT = 'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1';

const clamp01 = x => Math.max(0, Math.min(1, Number(x) || 0));
const smooth01 = x => { x = clamp01(x); return x*x*(3-2*x); };

function getHomeIdentityState(elapsedMs, variant='home', reduced=false) {
  const identity = variant === 'identity';
  if (reduced) return Object.freeze(identity
    ? { phase:'NETWORK', camera:.56, lights:.52, links:1, pulse:.68, settle:1 }
    : { phase:'LIVED', camera:.62, lights:1, links:0, pulse:.18, settle:1 });
  const t = (((elapsedMs % HOME_IDENTITY_CYCLE_MS) + HOME_IDENTITY_CYCLE_MS) % HOME_IDENTITY_CYCLE_MS) / HOME_IDENTITY_CYCLE_MS;
  let phase, camera=0, lights=0, links=0, pulse=0, settle=0;
  if (!identity) {
    if (t < .18) { phase='ARRIVAL'; camera=smooth01(t/.18)*.25; }
    else if (t < .42) { phase='APPROACH'; const p=smooth01((t-.18)/.24); camera=.25+.55*p; lights=.18*p; }
    else if (t < .64) { phase='LIGHT'; const p=smooth01((t-.42)/.22); camera=.8-.12*p; lights=.18+.82*p; pulse=.18*p; }
    else if (t < .84) { phase='LIVED'; const p=smooth01((t-.64)/.20); camera=.68-.08*p; lights=1; pulse=.18+.28*Math.sin(Math.PI*p); settle=p; }
    else { phase='RETURN'; const p=smooth01((t-.84)/.16); camera=.60*(1-p); lights=1-p; pulse=.18*(1-p); settle=1-p; }
  } else {
    if (t < .20) { phase='ROOT'; camera=smooth01(t/.20)*.28; lights=.24; }
    else if (t < .43) { phase='RESOLVE'; const p=smooth01((t-.20)/.23); camera=.28+.36*p; lights=.24+.24*p; links=.36*p; pulse=.12*p; }
    else if (t < .66) { phase='LINK'; const p=smooth01((t-.43)/.23); camera=.64-.08*p; lights=.48; links=.36+.64*p; pulse=.12+.58*p; }
    else if (t < .85) { phase='NETWORK'; const p=smooth01((t-.66)/.19); camera=.56+.05*Math.sin(Math.PI*p); lights=.48+.08*p; links=1; pulse=.70+.24*Math.sin(Math.PI*p); settle=p; }
    else { phase='RETURN'; const p=smooth01((t-.85)/.15); camera=.56*(1-p); lights=.56-.30*p; links=1-p; pulse=.70*(1-p); settle=1-p; }
  }
  return Object.freeze({phase,camera:clamp01(camera),lights:clamp01(lights),links:clamp01(links),pulse:clamp01(pulse),settle:clamp01(settle)});
}

let houseScenePromise = null;
function loadMatureHouseScene(){
  if(globalThis.CompassHouseScene?.version===HOUSE_RENDERER_VERSION) return Promise.resolve(globalThis.CompassHouseScene);
  if(!houseScenePromise){
    houseScenePromise = import(HOUSE_SCENE_URL).then(()=>{
      const scene=globalThis.CompassHouseScene;
      if(!scene?.mount) throw new Error('MATURE_COMPASS_HOUSE_SCENE_UNAVAILABLE');
      return scene;
    });
  }
  return houseScenePromise;
}

function mountHomeIdentity(root){
  if(typeof Element==='undefined'||!(root instanceof Element)||root.dataset.homeIdentityMounted==='true') return root?.__homeIdentityV2||null;
  const variant=root.dataset.homeIdentityVariant==='identity'?'identity':'home';
  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  const clock=createCardClock(root);
  const canvas=document.createElement('canvas');
  canvas.className='home-identity-v2-canvas';
  canvas.setAttribute('aria-hidden','true');
  root.prepend(canvas);

  let active=true, destroyed=false, raf=0, houseApi=null;
  root.dataset.homeIdentityMounted='true';
  root.dataset.homeIdentityDetail='mature-compass-house-pending';
  root.dataset.homeIdentityRenderer=HOUSE_RENDERER_VERSION;
  root.dataset.homeIdentityContract=HOUSE_CONTRACT;

  const tick=now=>{
    if(destroyed) return;
    const cardTime=clock.sample(now);
    const state=getHomeIdentityState(cardTime.elapsedMs,variant,reduced);
    root.dataset.homeIdentityPhase=state.phase;
    root.dataset.homeIdentityLifecycleGeneration=String(cardTime.generation);
    if(active||reduced) houseApi?.draw?.();
    if(!reduced) raf=requestAnimationFrame(tick);
  };

  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    active=!!entries[0]?.isIntersecting;
    houseApi?.setForeground?.(active||reduced);
    if(active) houseApi?.draw?.();
  },{threshold:.04}):null;
  observer?.observe(root);

  loadMatureHouseScene().then(scene=>{
    if(destroyed) return;
    houseApi=scene.mount(canvas,{foreground:()=>active||reduced});
    root.dataset.homeIdentityDetail='mature-compass-house';
    root.dataset.homeIdentitySource='assets/compass/compass.house-scene.js';
    root.dataset.homeIdentityHouseReady=houseApi?.inspect?.().ready?'true':'pending';
    houseApi?.draw?.();
  }).catch(error=>{
    root.dataset.homeIdentityDetail='mature-compass-house-error';
    root.dataset.homeIdentityError=String(error?.message||error);
  });

  if(reduced) tick(performance.now()); else raf=requestAnimationFrame(tick);

  const api=Object.freeze({
    specimenId:SPECIMEN_ID,
    variant,
    cycleMs:HOME_IDENTITY_CYCLE_MS,
    reducedMotion:reduced,
    cardClockContract:clock.contract,
    houseRenderer:HOUSE_RENDERER_VERSION,
    houseContract:HOUSE_CONTRACT,
    source:'assets/compass/compass.house-scene.js',
    inspect(){return Object.freeze({variant,phase:root.dataset.homeIdentityPhase||null,renderer:HOUSE_RENDERER_VERSION,contract:HOUSE_CONTRACT,house:houseApi?.inspect?.()||null});},
    destroy(){destroyed=true;cancelAnimationFrame(raf);observer?.disconnect();clock.destroy();canvas.remove();root.dataset.homeIdentityMounted='false';}
  });
  root.__homeIdentityV2=api;
  return api;
}

function auto(){document.querySelectorAll('[data-home-identity-v2]').forEach(mountHomeIdentity)}
if(typeof document!=='undefined') document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto();

function bindCarousel(carousel){if(!carousel||carousel.dataset.spatialCarouselBound==='true')return;}

export { SPECIMEN_ID, HOUSE_RENDERER_VERSION, HOUSE_CONTRACT, getHomeIdentityState, mountHomeIdentity };
