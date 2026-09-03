export const SCENE_ENTRY_STATES=Object.freeze(['ENTER_REQUESTED','UI_SETTLE','FADE_TO_BLACK','BLACK_HOLD','ROUTE_HANDOFF']);
export const FUTURE_SCENE_ENTRY_STATES=Object.freeze(['SCENE_BOOT','FADE_FROM_BLACK','SCENE_ACTIVE']);

function ensureVeil(root=document.body){
  let veil=document.querySelector('[data-scene-transition-veil]');
  if(veil)return veil;
  veil=document.createElement('div');
  veil.dataset.sceneTransitionVeil='';
  veil.setAttribute('aria-hidden','true');
  Object.assign(veil.style,{position:'fixed',inset:'0',zIndex:'100',background:'#000',opacity:'0',pointerEvents:'none',transition:'opacity 420ms ease'});
  root.appendChild(veil);
  return veil;
}

export function createSceneTransitionController({root=document.body,reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,onState=()=>{}}={}){
  const veil=ensureVeil(root);
  let state='SCENE_ACTIVE';
  let locked=false;
  const setState=next=>{state=next;veil.dataset.state=next;onState(next);};
  const clear=()=>{locked=false;veil.style.pointerEvents='none';veil.style.opacity='0';setState('SCENE_ACTIVE');};
  window.addEventListener('pageshow',clear);
  window.addEventListener('pagehide',()=>{veil.style.pointerEvents='none';});
  window.addEventListener('popstate',clear);
  const enter=async route=>{
    if(locked||typeof route!=='string'||!route.startsWith('/'))return false;
    locked=true;
    setState('ENTER_REQUESTED');
    await new Promise(r=>setTimeout(r,reducedMotion?20:110));
    setState('UI_SETTLE');
    veil.style.pointerEvents='auto';
    veil.style.transition=reducedMotion?'opacity 110ms linear':'opacity 420ms ease';
    setState('FADE_TO_BLACK');
    requestAnimationFrame(()=>{veil.style.opacity='1';});
    await new Promise(r=>setTimeout(r,reducedMotion?130:470));
    setState('BLACK_HOLD');
    sessionStorage.setItem('mirrorland-scene-entry','FADE_FROM_BLACK');
    await new Promise(r=>setTimeout(r,reducedMotion?45:140));
    setState('ROUTE_HANDOFF');
    location.assign(route);
    return true;
  };
  const consumeEntryMarker=()=>{
    if(sessionStorage.getItem('mirrorland-scene-entry')!=='FADE_FROM_BLACK')return false;
    sessionStorage.removeItem('mirrorland-scene-entry');
    veil.style.opacity='1';
    veil.style.pointerEvents='none';
    veil.style.transition=reducedMotion?'opacity 110ms linear':'opacity 440ms ease';
    setState('SCENE_BOOT');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{setState('FADE_FROM_BLACK');veil.style.opacity='0';setTimeout(()=>setState('SCENE_ACTIVE'),reducedMotion?130:480);}));
    return true;
  };
  return Object.freeze({enter,clear,consumeEntryMarker,getState:()=>state,isLocked:()=>locked});
}
