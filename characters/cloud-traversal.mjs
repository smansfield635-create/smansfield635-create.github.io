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

const timelineFractions=Object.freeze({ASCENT:0,CLOUD_ENTRY:.17,CLOUD_TRANSIT:.37,DESCENT:.72,ARRIVAL:1});
export function buildCloudTraversalTimeline({durationMs=2460,reducedMotion=false}={}){
  const duration=Math.max(reducedMotion?160:800,Number.isFinite(durationMs)?durationMs:2460);
  return Object.freeze([
    Object.freeze({state:'ASCENT',atMs:0}),
    Object.freeze({state:'CLOUD_ENTRY',atMs:Math.round(duration*timelineFractions.CLOUD_ENTRY)}),
    Object.freeze({state:'CLOUD_TRANSIT',atMs:Math.round(duration*timelineFractions.CLOUD_TRANSIT)}),
    Object.freeze({state:'DESCENT',atMs:Math.round(duration*timelineFractions.DESCENT)}),
    Object.freeze({state:'ARRIVAL',atMs:duration})
  ]);
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

export function createCloudTraversalController({root=document.body,reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,onState=()=>{},autoBindSignals=false}={}){
  const layer=ensureCloudLayer(root);
  let state='ORBIT';
  let timers=[];
  let disposed=false;
  let transitionEpoch=0;
  const setState=next=>{
    if(!CLOUD_TRAVEL_STATES.includes(next))throw new RangeError(`UNKNOWN_CLOUD_TRAVEL_STATE:${next}`);
    state=next;
    layer.dataset.state=next;
    document.documentElement.dataset.cloudTravel=next;
    onState(next);
  };
  const opacityFor=next=>next==='CLOUD_ENTRY'?'.12':next==='CLOUD_TRANSIT'?'.22':next==='DESCENT'?'.10':'0';
  const cancelTimers=()=>{for(const id of timers)clearTimeout(id);timers=[];};
  const schedule=(epoch,ms,fn)=>timers.push(setTimeout(()=>{if(!disposed&&epoch===transitionEpoch)fn();},ms));
  const clear=()=>{
    transitionEpoch+=1;
    cancelTimers();
    layer.style.opacity='0';
    delete layer.dataset.destinationId;
    delete layer.dataset.worldAnchor;
    setState('ORBIT');
  };
  const complete=()=>{
    transitionEpoch+=1;
    cancelTimers();
    layer.style.opacity='0';
    setState('ARRIVAL');
  };
  const begin=({destinationId,worldAnchor=null,durationMs=2460}={})=>{
    transitionEpoch+=1;
    const epoch=transitionEpoch;
    cancelTimers();
    layer.style.opacity='0';
    setState('ORBIT');
    layer.dataset.destinationId=destinationId||'';
    layer.dataset.cloudIdentity=CLOUD_IDENTITY_FRAME;
    const safeAnchor=worldAnchor?safeInteriorPoint(worldAnchor):null;
    if(safeAnchor){
      layer.dataset.worldAnchor=`${safeAnchor.x},${safeAnchor.z}`;
      layer.dataset.safeInterior='true';
    }else{
      delete layer.dataset.worldAnchor;
      delete layer.dataset.safeInterior;
    }
    layer.style.transition=reducedMotion?'opacity 80ms linear':'opacity 420ms ease';
    const timeline=buildCloudTraversalTimeline({durationMs,reducedMotion});
    for(const entry of timeline){
      const apply=()=>{setState(entry.state);layer.style.opacity=opacityFor(entry.state);};
      if(entry.atMs===0)apply();else schedule(epoch,entry.atMs,apply);
    }
    return Object.freeze({destinationId:destinationId||'',safeAnchor,timeline});
  };
  const onSignalClick=event=>{
    const signal=event.target?.closest?.('.signal[data-id],.signal[data-destination-id]');
    if(!signal||disposed)return;
    if(event.__mirrorlandCloudTraversalHandled)return;
    event.__mirrorlandCloudTraversalHandled=true;
    begin({destinationId:signal.dataset.destinationId||signal.dataset.id||''});
  };
  if(autoBindSignals)document.addEventListener('click',onSignalClick,true);
  const dispose=()=>{
    disposed=true;
    if(autoBindSignals)document.removeEventListener('click',onSignalClick,true);
    clear();
  };
  setState('ORBIT');
  const api=Object.freeze({begin,complete,clear,dispose,getState:()=>state,identityFrame:CLOUD_IDENTITY_FRAME,autoBindSignals});
  globalThis.__MIRRORLAND_CLOUD_TRAVERSAL__=api;
  return api;
}
