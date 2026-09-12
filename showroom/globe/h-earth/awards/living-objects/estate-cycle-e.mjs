const DONOR=Object.freeze({
  path:'/assets/compass/compass.house-scene.js',
  blob:'a82e3c963a10808b9f8f1922faab45155ea4a62b',
  version:'mirror-manor-gothic-phase3-carousel-v6-material-detail-final',
  contract:'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1'
});
const LIFECYCLE=Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']);
const CONTRACT=Object.freeze({
  id:'AWARDS_ESTATE_LIVING_OBJECT_PROVEN_COMPASS_REUSE_V5',
  cycle:'E_ESTATE',
  claim:'The surprise is not one feature. It is that the pieces belong together.',
  recognizableObject:'HOUSE_MANOR',
  renderer:'PROVEN_COMPASS_MANOR_PRESENTATION',
  signatureEvent:'STRUCTURAL_ASSEMBLY',
  eventCount:1,
  compositionProfile:Object.freeze({reference:'PROVEN_COMPASS_MANOR_CAROUSEL',hostShape:'ARCHITECTURAL_THREE_QUARTER_FIELD',presentationAuthority:'DONOR_RENDERER'}),
  sourceBinding:Object.freeze({compassHouseScene:DONOR}),
  lifecycle:LIFECYCLE
});

const srcdoc=()=>`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}canvas{display:block;width:100%;height:100%;min-width:100%;min-height:100%;pointer-events:none}</style></head><body><canvas id="manor" aria-hidden="true"></canvas><script src="${DONOR.path}?v=${DONOR.blob}"></script><script>const canvas=document.getElementById('manor');const api=window.CompassHouseScene?.mount?.(canvas,{foreground:()=>true})||null;window.__AWARDS_DONOR_BRIDGE__={kind:'MANOR',ready:()=>!!api?.inspect?.()?.ready,inspect:()=>api?.inspect?.()||null,draw:()=>api?.draw?.(),setForeground:on=>api?.setForeground?.(!!on)};</script></body></html>`;

function waitForBridge(frame,timeout=10000){
  return new Promise((resolve,reject)=>{
    const start=performance.now();
    const poll=()=>{
      const bridge=frame.contentWindow?.__AWARDS_DONOR_BRIDGE__;
      if(bridge?.ready?.())return resolve(bridge);
      if(performance.now()-start>timeout)return reject(new Error('ESTATE_PROVEN_DONOR_READY_TIMEOUT'));
      requestAnimationFrame(poll);
    };
    poll();
  });
}

export function createAwardsEstateCycleE({document:doc=document,reducedMotion=false}={}){
  const root=doc.createElement('section');
  root.className='awards-manor-object awards-manor-proven-reuse';
  root.dataset.recognizableObject='HOUSE_MANOR';
  root.dataset.presentationAuthority='PROVEN_COMPASS_MANOR';
  root.dataset.donorPath=DONOR.path;
  root.dataset.donorBlob=DONOR.blob;
  root.setAttribute('aria-label','Mirror Manor true 3D');
  const frame=doc.createElement('iframe');
  frame.className='awards-true3d-frame awards-manor-proven-frame';
  frame.setAttribute('title','Mirror Manor architectural scene');
  frame.setAttribute('aria-hidden','true');
  frame.style.cssText='display:block;width:100%;height:100%;min-height:0;border:0;background:transparent;pointer-events:none;overflow:hidden;transform-origin:50% 55%;transition:transform 260ms ease,filter 260ms ease,opacity 260ms ease';
  frame.srcdoc=srcdoc();
  root.append(frame);
  let state='REAR_INERT',phase='loading',destroyed=false,timer=0,bridge=null,error=null;
  const ready=waitForBridge(frame).then(x=>{if(destroyed)return null;bridge=x;phase='rest';bridge.setForeground?.(true);bridge.draw?.();return x}).catch(e=>{error=e;phase='error';return null});
  function S(next){if(!LIFECYCLE.includes(next))throw new Error('ESTATE_INVALID_STATE');state=next;root.dataset.lifecycle=next;return api}
  function settleVisual(){frame.style.transform='scale(1)';frame.style.filter='none';frame.style.opacity='1';bridge?.setForeground?.(true);bridge?.draw?.()}
  function approach(){settleVisual();return S('APPROACHING')}
  function rest(){settleVisual();return S('FOREGROUND_REST')}
  function stable(){settleVisual();return S('FOREGROUND_IDLE')}
  function playSignature(){S('SIGNATURE_PLAY');phase='donor-presentation';bridge?.draw?.();if(!reducedMotion){frame.style.transform='scale(1.02)';frame.style.filter='brightness(1.08)';clearTimeout(timer);timer=setTimeout(()=>{if(destroyed)return;settleVisual();phase='rest';S('FOREGROUND_IDLE')},900)}else{phase='rest';S('FOREGROUND_IDLE')}return api}
  function select(){S('SELECT_RESPONSE');if(!reducedMotion)frame.style.transform='scale(.985)';return api}
  function openReader(){S('READER_OPEN');frame.style.opacity='.82';return api}
  function restore(){S('RETURN_RESTORING');clearTimeout(timer);settleVisual();timer=setTimeout(()=>{if(!destroyed){phase='rest';rest()}},reducedMotion?0:220);return api}
  function inspect(){return Object.freeze({state,phase,reducedMotion:!!reducedMotion,webglContexts:destroyed?0:1,renderer:DONOR.version,donorContract:DONOR.contract,recognizableObject:'HOUSE_MANOR',signatureEvent:CONTRACT.signatureEvent,eventCount:1,donorReady:!!bridge,donorError:error?.message||null,donorInspection:bridge?.inspect?.()||null,compositionProfile:CONTRACT.compositionProfile,sourceBinding:CONTRACT.sourceBinding,presentationAuthority:'PROVEN_COMPASS_MANOR'})}
  function destroy(){destroyed=true;clearTimeout(timer);bridge=null;try{frame.src='about:blank'}catch{}frame.remove();root.remove()}
  const api=Object.freeze({element:root,contract:CONTRACT,ready,approach,rest,playSignature,select,openReader,restore,stable,inspect,destroy});
  return api;
}

export{CONTRACT as AWARDS_ESTATE_CYCLE_E_CONTRACT};
export default createAwardsEstateCycleE;
