export const CLOUD_TRAVEL_STATES=Object.freeze(['ORBIT','ASCENT','CLOUD_ENTRY','CLOUD_TRANSIT','DESCENT','ARRIVAL']);
export const CLOUD_IDENTITY_FRAME='WORLD_ANCHORED';
export const SAFE_INTERIOR=Object.freeze({minimumHorizontalInset:230,frame:Object.freeze({xMin:-1050,xMax:1050,zMin:-1200,zMax:280})});

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function safeInteriorPoint(world,{minimumHorizontalInset=SAFE_INTERIOR.minimumHorizontalInset}={}){
  const f=SAFE_INTERIOR.frame;
  return Object.freeze({
    x:clamp(world.x,f.xMin+minimumHorizontalInset,f.xMax-minimumHorizontalInset),
    y:world.y,
    z:clamp(world.z,f.zMin+minimumHorizontalInset,f.zMax-minimumHorizontalInset)
  });
}
export function isSafeInteriorPoint(world,{minimumHorizontalInset=SAFE_INTERIOR.minimumHorizontalInset}={}){
  const f=SAFE_INTERIOR.frame;
  return world.x>=f.xMin+minimumHorizontalInset&&world.x<=f.xMax-minimumHorizontalInset&&world.z>=f.zMin+minimumHorizontalInset&&world.z<=f.zMax-minimumHorizontalInset;
}

function ensureCloudLayer(root=document.body){
  let layer=document.querySelector('[data-mirrorland-cloud-traversal]');
  if(layer)return layer;
  layer=document.createElement('div');
  layer.dataset.mirrorlandCloudTraversal='';
  layer.setAttribute('aria-hidden','true');
  Object.assign(layer.style,{position:'fixed',inset:'0',zIndex:'11',pointerEvents:'none',opacity:'0',transition:'opacity 420ms ease',background:'radial-gradient(ellipse at 28% 44%,rgba(212,225,236,.28),transparent 36%),radial-gradient(ellipse at 72% 58%,rgba(173,194,211,.26),transparent 38%),linear-gradient(180deg,rgba(80,105,126,.08),rgba(215,225,233,.24),rgba(71,91,109,.08))',backdropFilter:'blur(.8px)'});
  root.appendChild(layer);
  return layer;
}

export function createCloudTraversalController({root=document.body,reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,onState=()=>{}}={}){
  const layer=ensureCloudLayer(root);
  let state='ORBIT';
  let timers=[];
  let disposed=false;
  let transitionEpoch=0;
  const setState=next=>{
    state=next;
    layer.dataset.state=next;
    document.documentElement.dataset.cloudTravel=next;
    onState(next);
  };
  const cancelTimers=()=>{for(const id of timers)clearTimeout(id);timers=[];};
  const clear=()=>{
    transitionEpoch+=1;
    cancelTimers();
    layer.style.opacity='0';
    setState('ORBIT');
  };
  const schedule=(epoch,ms,fn)=>timers.push(setTimeout(()=>{if(!disposed&&epoch===transitionEpoch)fn();},ms));
  const begin=({destinationId,worldAnchor=null}={})=>{
    transitionEpoch+=1;
    const epoch=transitionEpoch;
    cancelTimers();
    layer.style.opacity='0';
    setState('ORBIT');
    layer.dataset.destinationId=destinationId||'';
    layer.dataset.cloudIdentity=CLOUD_IDENTITY_FRAME;
    if(worldAnchor)layer.dataset.worldAnchor=`${worldAnchor.x},${worldAnchor.z}`;
    else delete layer.dataset.worldAnchor;
    if(reducedMotion){
      setState('CLOUD_TRANSIT');
      layer.style.transition='opacity 100ms linear';
      layer.style.opacity='.18';
      schedule(epoch,650,()=>{layer.style.opacity='0';setState('ARRIVAL');});
      return;
    }
    layer.style.transition='opacity 420ms ease';
    setState('ASCENT');
    schedule(epoch,420,()=>{setState('CLOUD_ENTRY');layer.style.opacity='.12';});
    schedule(epoch,900,()=>{setState('CLOUD_TRANSIT');layer.style.opacity='.22';});
    schedule(epoch,1780,()=>{setState('DESCENT');layer.style.opacity='.10';});
    schedule(epoch,2460,()=>{layer.style.opacity='0';setState('ARRIVAL');});
  };
  const onSignalClick=event=>{
    const signal=event.target?.closest?.('.signal[data-id],.signal[data-destination-id]');
    if(!signal||disposed)return;
    if(event.__mirrorlandCloudTraversalHandled)return;
    event.__mirrorlandCloudTraversalHandled=true;
    begin({destinationId:signal.dataset.destinationId||signal.dataset.id||''});
  };
  document.addEventListener('click',onSignalClick,true);
  const dispose=()=>{disposed=true;document.removeEventListener('click',onSignalClick,true);clear();};
  setState('ORBIT');
  const api=Object.freeze({begin,clear,dispose,getState:()=>state,identityFrame:CLOUD_IDENTITY_FRAME});
  globalThis.__MIRRORLAND_CLOUD_TRAVERSAL__=api;
  return api;
}
