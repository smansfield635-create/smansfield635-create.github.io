const DONOR=Object.freeze({
  brainPath:'/assets/compass/compass.hra-brain-scene.js',
  brainBlob:'c26603744e55c8ede2c82944bd0fd117d04dcbdb',
  version:'hra-atlas-webgl-carousel-v1',
  contract:'COMPASS_BRAIN_GEN1_HRA_GEOMETRY_FREEZE_v1',
  source:'https://ccf-ontology.hubmapconsortium.org/objects/v1.2/Allen_M_Brain.glb',
  expected:Object.freeze({meshes:283,triangles:656268}),
  referenceTarget:'QUALIFIED_HRA_ANATOMICAL_BRAIN'
});
const LIFECYCLE=Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']);
const CONTRACT=Object.freeze({
  id:'AWARDS_COHERENCE_LIVING_OBJECT_HRA_ANATOMICAL_BRAIN_V7',
  cycle:'C_COHERENCE',
  claim:'Coherence can be inspected without pretending uncertainty is certainty.',
  recognizableObject:'BRAIN',
  renderer:'QUALIFIED_HRA_ATLAS_BRAIN',
  signatureEvent:'CONTINUOUS_SLOW_HRA_YAW',
  eventCount:1,
  compositionProfile:Object.freeze({
    reference:'COMPASS_BRAIN_GEN1_HRA_GEOMETRY_FREEZE_v1',
    hostShape:'COMPACT_ANATOMICAL_FIELD',
    presentationAuthority:'QUALIFIED_HRA_GEOMETRY_RENDERER',
    environment:'DARK_AMBIENT_DEPTH_FIELD',
    motion:'CONTINUOUS_SLOW_HRA_YAW'
  }),
  sourceBinding:Object.freeze({qualifiedHraBrain:DONOR}),
  lifecycle:LIFECYCLE
});

const srcdoc=()=>`<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="dark"><style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}
body{position:relative;isolation:isolate;background:radial-gradient(circle at 52% 46%,rgba(173,73,94,.18),transparent 32%),radial-gradient(circle at 50% 52%,rgba(85,194,214,.08),transparent 60%),linear-gradient(145deg,rgba(7,16,22,.98),rgba(2,6,10,.99) 72%)}
body::before{content:"";position:absolute;inset:8% 7%;z-index:0;border-radius:50%;background:radial-gradient(ellipse,rgba(215,116,135,.10),rgba(75,173,194,.035) 48%,transparent 72%);filter:blur(9px);pointer-events:none}
body::after{content:"";position:absolute;inset:11%;z-index:0;border:1px solid rgba(122,210,226,.08);border-radius:50%;box-shadow:0 0 34px rgba(105,193,210,.045),inset 0 0 30px rgba(220,129,146,.035);pointer-events:none}
canvas{position:relative;z-index:1;display:block;width:100%;height:100%;min-width:100%;min-height:100%;pointer-events:none;filter:brightness(1.08) saturate(1.06) contrast(1.08) drop-shadow(0 18px 24px rgba(31,7,13,.38))}
</style></head><body><canvas id="brain" aria-hidden="true"></canvas><script src="${DONOR.brainPath}?v=${DONOR.brainBlob}"></script><script>
const canvas=document.getElementById('brain');
let foreground=true;
let loaded=false;
let loadError=null;
const api=window.CompassBrainScene?.mount?.(canvas,{foreground:()=>foreground})||null;
Promise.resolve(api?.load).then(ok=>{loaded=!!ok;if(!ok)loadError=new Error(canvas.dataset.brainFailure||'HRA_BRAIN_LOAD_FAILED')}).catch(error=>{loadError=error});
window.__AWARDS_DONOR_BRIDGE__={
  kind:'HRA_ANATOMICAL_BRAIN',
  ready:()=>!!api&&loaded&&canvas.dataset.brainReady==='true',
  inspect:()=>Object.assign({},api?.inspect?.()||null,{source:canvas.dataset.brainSource||null,meshes:+canvas.dataset.brainMeshCount||0,triangles:+canvas.dataset.brainTriangleCount||0,ready:canvas.dataset.brainReady==='true',failure:loadError?.message||canvas.dataset.brainFailure||null}),
  activate:()=>api?.activate?.()||false,
  restore:()=>api?.restore?.()||false,
  setForeground:on=>{foreground=!!on;if(foreground)api?.activate?.()},
  destroy:()=>{foreground=false}
};
</script></body></html>`;

function waitForBridge(frame,timeout=18000){
  return new Promise((resolve,reject)=>{
    const start=performance.now();
    const poll=()=>{
      const bridge=frame.contentWindow?.__AWARDS_DONOR_BRIDGE__;
      if(bridge?.ready?.())return resolve(bridge);
      if(performance.now()-start>timeout)return reject(new Error('COHERENCE_HRA_BRAIN_READY_TIMEOUT'));
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
  frame.className='awards-true3d-frame awards-brain-hra-frame';
  frame.setAttribute('title','Qualified HRA anatomical brain');
  frame.setAttribute('aria-hidden','true');
  frame.style.cssText='display:block;width:100%;height:100%;min-height:0;border:0;background:#03080d;pointer-events:none;overflow:hidden;border-radius:16px;box-shadow:inset 0 0 32px rgba(109,204,220,.045),0 12px 30px rgba(0,0,0,.22);transform-origin:50% 50%;transition:transform 260ms ease,filter 260ms ease,opacity 260ms ease';
  frame.srcdoc=srcdoc();
  root.replaceChildren(frame);
  root.dataset.presentationAuthority='QUALIFIED_HRA_ANATOMICAL_BRAIN';
  root.dataset.donorPath=DONOR.brainPath;
  root.dataset.donorBlob=DONOR.brainBlob;
  root.dataset.donorContract=DONOR.contract;
  root.dataset.expectedMeshes=String(DONOR.expected.meshes);
  root.dataset.expectedTriangles=String(DONOR.expected.triangles);
  root.dataset.ambientEnvironment='DARK_DEPTH_FIELD';
  root.dataset.motion='CONTINUOUS_SLOW_HRA_YAW';
  let state='FOREGROUND_REST',phase='loading',destroyed=false,timer=0,bridge=null,error=null;
  const ready=waitForBridge(frame).then(x=>{if(destroyed)return null;bridge=x;phase='rest';bridge.setForeground?.(true);return x}).catch(e=>{error=e;phase='error';return null});
  function S(next){if(!LIFECYCLE.includes(next))throw new Error('COHERENCE_INVALID_STATE');state=next;root.dataset.objectState=next;return next}
  function settleVisual(){frame.style.transform='scale(1)';frame.style.filter='none';frame.style.opacity='1';bridge?.setForeground?.(true)}
  function setState(next){S(next);if(next==='REAR_INERT'){bridge?.setForeground?.(false);return next}if(next==='FOREGROUND_REST'||next==='FOREGROUND_IDLE'||next==='APPROACHING')settleVisual();return next}
  function playSignature(){S('SIGNATURE_PLAY');phase='rotation';bridge?.setForeground?.(true);bridge?.activate?.();if(!reduced){frame.style.transform='scale(1.018)';frame.style.filter='brightness(1.06) saturate(1.04)';clearTimeout(timer);timer=setTimeout(()=>{if(destroyed)return;settleVisual();phase='rest';S('FOREGROUND_IDLE')},760)}else{phase='rest';S('FOREGROUND_IDLE')}return performance.now()}
  function selectResponse(){S('SELECT_RESPONSE');bridge?.setForeground?.(true);if(!reduced)frame.style.transform='scale(.985)'}
  function readerOpen(){S('READER_OPEN');bridge?.setForeground?.(false);frame.style.opacity='.82'}
  function restore(){S('RETURN_RESTORING');clearTimeout(timer);bridge?.setForeground?.(true);settleVisual();bridge?.restore?.();timer=setTimeout(()=>{if(!destroyed){phase='rest';S('FOREGROUND_REST')}},reduced?0:220)}
  function inspect(){return Object.freeze({contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:destroyed?0:1,renderer:DONOR.version,donorContract:DONOR.contract,referenceTarget:DONOR.referenceTarget,recognizableObject:'BRAIN',signatureEvent:CONTRACT.signatureEvent,eventCount:1,donorReady:!!bridge,donorError:error?.message||null,donorInspection:bridge?.inspect?.()||null,sourceBinding:CONTRACT.sourceBinding,presentationAuthority:'QUALIFIED_HRA_ANATOMICAL_BRAIN',ambientEnvironment:'DARK_DEPTH_FIELD'})}
  function destroy(){destroyed=true;clearTimeout(timer);bridge?.destroy?.();bridge=null;try{frame.src='about:blank'}catch{}frame.remove();root.replaceChildren()}
  return Object.freeze({contract:CONTRACT,ready,setState,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:frame});
}

export{CONTRACT as AWARDS_COHERENCE_CYCLE_C_CONTRACT};
