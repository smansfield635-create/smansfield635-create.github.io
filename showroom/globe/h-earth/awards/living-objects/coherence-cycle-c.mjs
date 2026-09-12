const DONOR=Object.freeze({
  path:'/assets/compass/compass.brain-scene.js',
  blob:'325b9486d0ab2136d425aed9468c22c28c67a57b',
  version:'anatomical-webgl-v8-3d-only',
  contract:'COMPASS_COHERISCOPE_ANATOMICAL_WEBGL_v8'
});
const LIFECYCLE=Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']);
const CONTRACT=Object.freeze({
  id:'AWARDS_COHERENCE_LIVING_OBJECT_PROVEN_COMPASS_REUSE_V5',
  cycle:'C_COHERENCE',
  claim:'Coherence can be inspected without pretending uncertainty is certainty.',
  recognizableObject:'BRAIN',
  renderer:'PROVEN_COMPASS_BRAIN_PRESENTATION',
  signatureEvent:'NEURAL_SYNCHRONIZATION',
  eventCount:1,
  compositionProfile:Object.freeze({reference:'PROVEN_COMPASS_COHERISCOPE_PORTAL',hostShape:'COMPACT_ANATOMICAL_FIELD',presentationAuthority:'DONOR_RENDERER'}),
  sourceBinding:Object.freeze({compassBrainScene:DONOR}),
  lifecycle:LIFECYCLE
});

const srcdoc=()=>`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}canvas{display:block;width:100%;height:100%;min-width:100%;min-height:100%;pointer-events:none}</style></head><body><canvas id="brain" aria-hidden="true"></canvas><script src="${DONOR.path}?v=${DONOR.blob}"></script><script>const canvas=document.getElementById('brain');const api=window.CompassBrainScene?.mount?.(canvas,{foreground:()=>true})||null;window.__AWARDS_DONOR_BRIDGE__={kind:'BRAIN',ready:()=>!!api,inspect:()=>api?.inspect?.()||null,activate:()=>api?.activate?.(),restore:()=>api?.restore?.()};</script></body></html>`;

function waitForBridge(frame,timeout=5000){
  return new Promise((resolve,reject)=>{
    const start=performance.now();
    const poll=()=>{
      const bridge=frame.contentWindow?.__AWARDS_DONOR_BRIDGE__;
      if(bridge?.ready?.())return resolve(bridge);
      if(performance.now()-start>timeout)return reject(new Error('COHERENCE_PROVEN_DONOR_READY_TIMEOUT'));
      requestAnimationFrame(poll);
    };
    poll();
  });
}

export function mountCoherenceLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('COHERENCE_ROOT_REQUIRED');
  const doc=root.ownerDocument||document;
  const reduced=options.reducedMotion??globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  const frame=doc.createElement('iframe');
  frame.className='awards-true3d-frame awards-brain-proven-frame';
  frame.setAttribute('title','Coheriscope anatomical brain');
  frame.setAttribute('aria-hidden','true');
  frame.style.cssText='display:block;width:100%;height:100%;min-height:0;border:0;background:transparent;pointer-events:none;overflow:hidden;transform-origin:50% 50%;transition:transform 260ms ease,filter 260ms ease,opacity 260ms ease';
  frame.srcdoc=srcdoc();
  root.replaceChildren(frame);
  root.dataset.presentationAuthority='PROVEN_COMPASS_BRAIN';
  root.dataset.donorPath=DONOR.path;
  root.dataset.donorBlob=DONOR.blob;
  let state='FOREGROUND_REST',phase='loading',destroyed=false,timer=0,bridge=null,error=null;
  const ready=waitForBridge(frame).then(x=>{if(destroyed)return null;bridge=x;phase='rest';return x}).catch(e=>{error=e;phase='error';return null});
  function S(next){if(!LIFECYCLE.includes(next))throw new Error('COHERENCE_INVALID_STATE');state=next;root.dataset.objectState=next;return next}
  function settleVisual(){frame.style.transform='scale(1)';frame.style.filter='none';frame.style.opacity='1'}
  function setState(next){S(next);if(next==='FOREGROUND_REST'||next==='FOREGROUND_IDLE'||next==='APPROACHING')settleVisual();return next}
  function playSignature(){S('SIGNATURE_PLAY');phase='donor-motion';bridge?.activate?.();if(!reduced){frame.style.transform='scale(1.025)';frame.style.filter='brightness(1.08) saturate(1.06)';clearTimeout(timer);timer=setTimeout(()=>{if(destroyed)return;settleVisual();phase='rest';S('FOREGROUND_IDLE')},900)}else{phase='rest';S('FOREGROUND_IDLE')}return performance.now()}
  function selectResponse(){S('SELECT_RESPONSE');if(!reduced)frame.style.transform='scale(.985)'}
  function readerOpen(){S('READER_OPEN');frame.style.opacity='.82'}
  function restore(){S('RETURN_RESTORING');clearTimeout(timer);settleVisual();bridge?.restore?.();timer=setTimeout(()=>{if(!destroyed){phase='rest';S('FOREGROUND_REST')}},reduced?0:220)}
  function inspect(){return Object.freeze({contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:destroyed?0:1,renderer:DONOR.version,donorContract:DONOR.contract,recognizableObject:'BRAIN',signatureEvent:CONTRACT.signatureEvent,eventCount:1,donorReady:!!bridge,donorError:error?.message||null,donorInspection:bridge?.inspect?.()||null,sourceBinding:CONTRACT.sourceBinding,presentationAuthority:'PROVEN_COMPASS_BRAIN'})}
  function destroy(){destroyed=true;clearTimeout(timer);bridge=null;try{frame.src='about:blank'}catch{}frame.remove();root.replaceChildren()}
  return Object.freeze({contract:CONTRACT,ready,setState,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:frame});
}

export{CONTRACT as AWARDS_COHERENCE_CYCLE_C_CONTRACT};
