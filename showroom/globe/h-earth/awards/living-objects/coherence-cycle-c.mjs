const DONOR=Object.freeze({
  stagePath:'/assets/compass/capability-object-stage.js',
  stageBlob:'0a7578ce4628e6774cb8da79c2434dbe96d0d6f0',
  brainPath:'/assets/compass/capability-object-brain-v9.js',
  brainBlob:'5908a5ed2e364159d6c6eabde74887225b922620',
  version:'COMPASS_BRAIN_V9_REFERENCE_REBUILD_v2',
  contract:'COMPASS_COHERISCOPE_ANATOMICAL_WEBGL_v9_REFERENCE_REBUILD',
  referenceTarget:'APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE'
});
const LIFECYCLE=Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']);
const CONTRACT=Object.freeze({
  id:'AWARDS_COHERENCE_LIVING_OBJECT_APPROVED_BRAIN_V9_AMBIENT_V6',
  cycle:'C_COHERENCE',
  claim:'Coherence can be inspected without pretending uncertainty is certainty.',
  recognizableObject:'BRAIN',
  renderer:'APPROVED_HIGH_FIDELITY_BRAIN_V9',
  signatureEvent:'CONTINUOUS_SLOW_ROTATION',
  eventCount:1,
  compositionProfile:Object.freeze({
    reference:'LIVE_COHERISCOPE_APPROVED_HIGH_FIDELITY_ANATOMICAL_REFERENCE',
    hostShape:'COMPACT_ANATOMICAL_FIELD',
    presentationAuthority:'APPROVED_REFERENCE_RENDERER',
    environment:'DARK_AMBIENT_DEPTH_FIELD',
    motion:'CONTINUOUS_SLOW_ROTATION'
  }),
  sourceBinding:Object.freeze({approvedBrainV9:DONOR}),
  lifecycle:LIFECYCLE
});

const srcdoc=()=>`<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="dark"><style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}
body{position:relative;isolation:isolate;background:radial-gradient(circle at 52% 46%,rgba(173,73,94,.18),transparent 32%),radial-gradient(circle at 50% 52%,rgba(85,194,214,.08),transparent 60%),linear-gradient(145deg,rgba(7,16,22,.98),rgba(2,6,10,.99) 72%)}
body::before{content:"";position:absolute;inset:8% 7%;z-index:0;border-radius:50%;background:radial-gradient(ellipse,rgba(215,116,135,.10),rgba(75,173,194,.035) 48%,transparent 72%);filter:blur(9px);pointer-events:none}
body::after{content:"";position:absolute;inset:11%;z-index:0;border:1px solid rgba(122,210,226,.08);border-radius:50%;box-shadow:0 0 34px rgba(105,193,210,.045),inset 0 0 30px rgba(220,129,146,.035);pointer-events:none}
canvas{position:relative;z-index:1;display:block;width:100%;height:100%;min-width:100%;min-height:100%;pointer-events:none;filter:brightness(1.12) saturate(1.06) drop-shadow(0 18px 24px rgba(18,2,8,.46))}
</style></head><body><canvas id="brain" data-capability-brain-v9 aria-hidden="true"></canvas><script src="${DONOR.stagePath}?v=${DONOR.stageBlob}"></script><script src="${DONOR.brainPath}?v=${DONOR.brainBlob}"></script><script>
const canvas=document.getElementById('brain');
window.__AWARDS_DONOR_BRIDGE__={
  kind:'BRAIN_V9',
  ready:()=>!!canvas._brainV9,
  inspect:()=>canvas._brainV9?.inspect?.()||null,
  activate:()=>canvas._brainV9?.capture?.()||null,
  restore:()=>canvas._brainV9?.setView?.(.48,-.075),
  destroy:()=>canvas._brainV9?.destroy?.()
};
</script></body></html>`;

function waitForBridge(frame,timeout=7000){
  return new Promise((resolve,reject)=>{
    const start=performance.now();
    const poll=()=>{
      const bridge=frame.contentWindow?.__AWARDS_DONOR_BRIDGE__;
      if(bridge?.ready?.())return resolve(bridge);
      if(performance.now()-start>timeout)return reject(new Error('COHERENCE_APPROVED_BRAIN_V9_READY_TIMEOUT'));
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
  frame.className='awards-true3d-frame awards-brain-approved-v9-frame';
  frame.setAttribute('title','Coheriscope approved anatomical brain');
  frame.setAttribute('aria-hidden','true');
  frame.style.cssText='display:block;width:100%;height:100%;min-height:0;border:0;background:#03080d;pointer-events:none;overflow:hidden;border-radius:16px;box-shadow:inset 0 0 32px rgba(109,204,220,.045),0 12px 30px rgba(0,0,0,.22);transform-origin:50% 50%;transition:transform 260ms ease,filter 260ms ease,opacity 260ms ease';
  frame.srcdoc=srcdoc();
  root.replaceChildren(frame);
  root.dataset.presentationAuthority='APPROVED_HIGH_FIDELITY_BRAIN_V9';
  root.dataset.donorPath=DONOR.brainPath;
  root.dataset.donorBlob=DONOR.brainBlob;
  root.dataset.ambientEnvironment='DARK_DEPTH_FIELD';
  root.dataset.motion='CONTINUOUS_SLOW_ROTATION';
  let state='FOREGROUND_REST',phase='loading',destroyed=false,timer=0,bridge=null,error=null;
  const ready=waitForBridge(frame).then(x=>{if(destroyed)return null;bridge=x;phase='rest';return x}).catch(e=>{error=e;phase='error';return null});
  function S(next){if(!LIFECYCLE.includes(next))throw new Error('COHERENCE_INVALID_STATE');state=next;root.dataset.objectState=next;return next}
  function settleVisual(){frame.style.transform='scale(1)';frame.style.filter='none';frame.style.opacity='1'}
  function setState(next){S(next);if(next==='FOREGROUND_REST'||next==='FOREGROUND_IDLE'||next==='APPROACHING')settleVisual();return next}
  function playSignature(){S('SIGNATURE_PLAY');phase='rotation';bridge?.activate?.();if(!reduced){frame.style.transform='scale(1.018)';frame.style.filter='brightness(1.06) saturate(1.04)';clearTimeout(timer);timer=setTimeout(()=>{if(destroyed)return;settleVisual();phase='rest';S('FOREGROUND_IDLE')},760)}else{phase='rest';S('FOREGROUND_IDLE')}return performance.now()}
  function selectResponse(){S('SELECT_RESPONSE');if(!reduced)frame.style.transform='scale(.985)'}
  function readerOpen(){S('READER_OPEN');frame.style.opacity='.82'}
  function restore(){S('RETURN_RESTORING');clearTimeout(timer);settleVisual();bridge?.restore?.();timer=setTimeout(()=>{if(!destroyed){phase='rest';S('FOREGROUND_REST')}},reduced?0:220)}
  function inspect(){return Object.freeze({contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:destroyed?0:1,renderer:DONOR.version,donorContract:DONOR.contract,referenceTarget:DONOR.referenceTarget,recognizableObject:'BRAIN',signatureEvent:CONTRACT.signatureEvent,eventCount:1,donorReady:!!bridge,donorError:error?.message||null,donorInspection:bridge?.inspect?.()||null,sourceBinding:CONTRACT.sourceBinding,presentationAuthority:'APPROVED_HIGH_FIDELITY_BRAIN_V9',ambientEnvironment:'DARK_DEPTH_FIELD'})}
  function destroy(){destroyed=true;clearTimeout(timer);bridge?.destroy?.();bridge=null;try{frame.src='about:blank'}catch{}frame.remove();root.replaceChildren()}
  return Object.freeze({contract:CONTRACT,ready,setState,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:frame});
}

export{CONTRACT as AWARDS_COHERENCE_CYCLE_C_CONTRACT};
