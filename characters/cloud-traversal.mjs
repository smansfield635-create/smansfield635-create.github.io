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
  Object.assign(layer.style,{position:'fixed',inset:'0',zIndex:'11',pointerEvents:'none',opacity:'0',transition:'opacity 520ms ease',background:'radial-gradient(ellipse at 28% 44%,rgba(212,225,236,.52),transparent 36%),radial-gradient(ellipse at 72% 58%,rgba(173,194,211,.5),transparent 38%),linear-gradient(180deg,rgba(80,105,126,.18),rgba(215,225,233,.58),rgba(71,91,109,.2))',backdropFilter:'blur(1.5px)'});
  root.appendChild(layer);
  return layer;
}

export function createCloudTraversalController({root=document.body,reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,onState=()=>{}}={}){
  const layer=ensureCloudLayer(root);
  let state='ORBIT';
  let timers=[];
  const setState=next=>{state=next;layer.dataset.state=next;onState(next);};
  const clear=()=>{for(const id of timers)clearTimeout(id);timers=[];layer.style.opacity='0';setState('ORBIT');};
  const schedule=(ms,fn)=>timers.push(setTimeout(fn,ms));
  const begin=({destinationId,worldAnchor=null}={})=>{
    clear();
    layer.dataset.destinationId=destinationId||'';
    layer.dataset.cloudIdentity=CLOUD_IDENTITY_FRAME;
    if(worldAnchor)layer.dataset.worldAnchor=`${worldAnchor.x},${worldAnchor.z}`;
    if(reducedMotion){setState('CLOUD_TRANSIT');layer.style.transition='opacity 120ms linear';layer.style.opacity='.58';schedule(170,()=>{layer.style.opacity='0';setState('ARRIVAL');});return;}
    layer.style.transition='opacity 520ms ease';
    setState('ASCENT');
    schedule(420,()=>{setState('CLOUD_ENTRY');layer.style.opacity='.48';});
    schedule(900,()=>{setState('CLOUD_TRANSIT');layer.style.opacity='.9';});
    schedule(1780,()=>{setState('DESCENT');layer.style.opacity='.36';});
    schedule(2460,()=>{layer.style.opacity='0';setState('ARRIVAL');});
  };
  return Object.freeze({begin,clear,getState:()=>state,identityFrame:CLOUD_IDENTITY_FRAME});
}
