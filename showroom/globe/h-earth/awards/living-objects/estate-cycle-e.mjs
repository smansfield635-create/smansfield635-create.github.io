const DONOR=Object.freeze({
  path:'/assets/compass/compass.house-scene.js',
  blob:'a82e3c963a10808b9f8f1922faab45155ea4a62b',
  version:'mirror-manor-gothic-phase3-carousel-v6-material-detail-final',
  contract:'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1'
});
const TORCH_SOURCE=Object.freeze({
  cssPath:'/assets/home/home.arrival.css',
  jsPath:'/assets/home/home.arrival.js',
  contract:'HOME_ARRIVAL_EXTERIOR_v1',
  torchCount:6,
  ignitionOrder:Object.freeze([0,5,1,4,2,3])
});
const LIFECYCLE=Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']);
const CONTRACT=Object.freeze({
  id:'AWARDS_ESTATE_LIVING_OBJECT_MANOR_TORCH_AMBIENCE_V6',
  cycle:'E_ESTATE',
  claim:'The surprise is not one feature. It is that the pieces belong together.',
  recognizableObject:'HOUSE_MANOR',
  renderer:'PROVEN_COMPASS_MANOR_PRESENTATION_WITH_HOME_TORCH_AMBIENCE',
  signatureEvent:'TORCHLIT_ESTATE_ARRIVAL',
  eventCount:1,
  compositionProfile:Object.freeze({
    reference:'PROVEN_COMPASS_MANOR_CAROUSEL_PLUS_HOME_COURTYARD_TORCHES',
    hostShape:'ARCHITECTURAL_THREE_QUARTER_FIELD',
    presentationAuthority:'DONOR_RENDERER_PLUS_PROVEN_AMBIENCE',
    environment:'NIGHT_ESTATE_FIELD',
    torchCount:6,
    perimeterGlow:true,
    continuousAmbience:'TORCH_FLICKER'
  }),
  sourceBinding:Object.freeze({compassHouseScene:DONOR,homeTorchAmbience:TORCH_SOURCE}),
  lifecycle:LIFECYCLE
});

const srcdoc=(reduced=false)=>`<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="dark"><style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}
body{position:relative;isolation:isolate;background:radial-gradient(ellipse at 50% 76%,rgba(255,139,59,.11),transparent 37%),radial-gradient(circle at 50% 44%,rgba(109,157,185,.07),transparent 58%),linear-gradient(180deg,#071019 0%,#02060b 68%,#010306 100%)}
#estateGlow{position:absolute;z-index:0;left:50%;top:47%;width:78%;height:66%;transform:translate(-50%,-50%);border-radius:46% 46% 38% 38%;border:1px solid rgba(244,203,128,.09);box-shadow:0 0 36px rgba(243,185,99,.055),inset 0 0 46px rgba(116,190,210,.035);background:radial-gradient(ellipse at 50% 68%,rgba(255,156,73,.055),transparent 60%);filter:blur(.2px);pointer-events:none}
#courtGlow{position:absolute;z-index:1;left:50%;bottom:9%;width:70%;height:27%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(255,151,64,.17),rgba(255,126,42,.045) 45%,transparent 72%);filter:blur(9px);pointer-events:none}
canvas{position:absolute;z-index:2;inset:0;display:block;width:100%;height:100%;min-width:100%;min-height:100%;pointer-events:none;filter:brightness(1.12) saturate(.96) contrast(1.08) drop-shadow(0 20px 26px rgba(0,0,0,.42))}
#torches{position:absolute;inset:0;z-index:4;pointer-events:none}
.torch{position:absolute;left:var(--x);top:var(--y);width:.62rem;height:2.45rem;transform:translate(-50%,-50%) scale(var(--s,1));transform-origin:50% 100%;opacity:.32;filter:saturate(.82);transition:opacity .45s ease,filter .45s ease}
.torch::before{content:"";position:absolute;left:50%;bottom:.02rem;width:.13rem;height:1.50rem;transform:translateX(-50%);border-radius:.1rem;background:linear-gradient(90deg,#302720,#6f594c 47%,#211b17);box-shadow:0 0 0 1px rgba(255,255,255,.035)}
.torch::after{content:"";position:absolute;left:50%;bottom:1.28rem;width:.62rem;height:.94rem;transform:translateX(-50%) scale(.56);transform-origin:50% 100%;border-radius:52% 48% 56% 44% / 66% 61% 39% 34%;background:radial-gradient(circle at 52% 70%,#fff8c7 0 11%,#ffd36d 26%,#ff8b35 54%,rgba(255,74,21,.34) 71%,transparent 74%);filter:drop-shadow(0 0 .42rem rgba(255,160,70,.82));opacity:0;transition:opacity .3s ease,transform .5s cubic-bezier(.2,.8,.2,1)}
.halo{position:absolute;left:50%;bottom:1.08rem;width:4.2rem;height:4.2rem;transform:translate(-50%,50%) scale(.58);border-radius:50%;background:radial-gradient(circle,rgba(255,183,91,.24),rgba(255,122,43,.08) 42%,transparent 70%);filter:blur(6px);opacity:0;transition:opacity .7s ease,transform .9s ease}
.torch.is-lit{opacity:1;filter:saturate(1.12)}.torch.is-lit::after{opacity:1;transform:translateX(-50%) scale(1);animation:flame 1.65s ease-in-out infinite alternate}.torch.is-lit .halo{opacity:1;transform:translate(-50%,50%) scale(1);animation:halo 2.4s ease-in-out infinite alternate}.torch:nth-child(2n).is-lit::after{animation-delay:-.7s}.torch:nth-child(3n).is-lit .halo{animation-delay:-1.2s}
@keyframes flame{0%{transform:translateX(-50%) scale(.93) rotate(-1.4deg);filter:drop-shadow(0 0 .34rem rgba(255,160,70,.72))}100%{transform:translateX(-50%) scale(1.07,.96) rotate(1.6deg);filter:drop-shadow(0 0 .58rem rgba(255,182,92,.94))}}
@keyframes halo{0%{opacity:.70;transform:translate(-50%,50%) scale(.92)}100%{opacity:1;transform:translate(-50%,50%) scale(1.08)}}
.reduced .torch.is-lit::after,.reduced .torch.is-lit .halo{animation:none}
</style></head><body class="${reduced?'reduced':''}"><div id="estateGlow" aria-hidden="true"></div><div id="courtGlow" aria-hidden="true"></div><canvas id="manor" aria-hidden="true"></canvas><div id="torches" aria-hidden="true">
<span class="torch" style="--x:20%;--y:67%;--s:.82"><i class="halo"></i></span><span class="torch" style="--x:31%;--y:74%;--s:.90"><i class="halo"></i></span><span class="torch" style="--x:42%;--y:79%;--s:.96"><i class="halo"></i></span><span class="torch" style="--x:58%;--y:79%;--s:.96"><i class="halo"></i></span><span class="torch" style="--x:69%;--y:74%;--s:.90"><i class="halo"></i></span><span class="torch" style="--x:80%;--y:67%;--s:.82"><i class="halo"></i></span>
</div><script src="${DONOR.path}?v=${DONOR.blob}"></script><script>
const canvas=document.getElementById('manor');
const torches=[...document.querySelectorAll('.torch')];
const reduced=${reduced?'true':'false'};
const api=window.CompassHouseScene?.mount?.(canvas,{foreground:()=>true})||null;
let lit=false,timers=[];
function lightTorches(){if(lit)return;lit=true;if(reduced){torches.forEach(t=>t.classList.add('is-lit'));return}const order=[0,5,1,4,2,3];order.forEach((index,step)=>timers.push(setTimeout(()=>torches[index]?.classList.add('is-lit'),220+step*105)))}
function extinguish(){timers.forEach(clearTimeout);timers=[];torches.forEach(t=>t.classList.remove('is-lit'));lit=false}
window.__AWARDS_DONOR_BRIDGE__={kind:'MANOR',ready:()=>{const ok=!!api?.inspect?.()?.ready;if(ok)lightTorches();return ok},inspect:()=>Object.assign({},api?.inspect?.()||{}, {torchCount:torches.length,torchesLit:lit,ambientEnvironment:'NIGHT_ESTATE_FIELD'}),draw:()=>api?.draw?.(),setForeground:on=>{api?.setForeground?.(!!on);if(on)lightTorches();else extinguish()},ignite:lightTorches,extinguish,destroy:()=>{extinguish();api?.setForeground?.(false)}};
</script></body></html>`;

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
  root.className='awards-manor-object awards-manor-proven-reuse awards-manor-ambient-stage';
  root.dataset.recognizableObject='HOUSE_MANOR';
  root.dataset.presentationAuthority='PROVEN_COMPASS_MANOR_PLUS_HOME_TORCH_AMBIENCE';
  root.dataset.donorPath=DONOR.path;
  root.dataset.donorBlob=DONOR.blob;
  root.dataset.torchSource=TORCH_SOURCE.contract;
  root.dataset.torchCount=String(TORCH_SOURCE.torchCount);
  root.dataset.ambientEnvironment='NIGHT_ESTATE_FIELD';
  root.setAttribute('aria-label','Mirror Manor true 3D at night with torchlit courtyard');
  const frame=doc.createElement('iframe');
  frame.className='awards-true3d-frame awards-manor-proven-frame awards-manor-ambient-frame';
  frame.setAttribute('title','Mirror Manor architectural scene with torchlit courtyard ambience');
  frame.setAttribute('aria-hidden','true');
  frame.style.cssText='display:block;width:100%;height:100%;min-height:0;border:0;background:#03080d;pointer-events:none;overflow:hidden;border-radius:16px;box-shadow:inset 0 0 34px rgba(244,192,111,.055),0 12px 30px rgba(0,0,0,.24);transform-origin:50% 55%;transition:transform 260ms ease,filter 260ms ease,opacity 260ms ease';
  frame.srcdoc=srcdoc(!!reducedMotion);
  root.append(frame);
  let state='REAR_INERT',phase='loading',destroyed=false,timer=0,bridge=null,error=null;
  const ready=waitForBridge(frame).then(x=>{if(destroyed)return null;bridge=x;phase='rest';bridge.setForeground?.(true);bridge.draw?.();bridge.ignite?.();return x}).catch(e=>{error=e;phase='error';return null});
  function S(next){if(!LIFECYCLE.includes(next))throw new Error('ESTATE_INVALID_STATE');state=next;root.dataset.lifecycle=next;return api}
  function settleVisual(){frame.style.transform='scale(1)';frame.style.filter='none';frame.style.opacity='1';bridge?.setForeground?.(true);bridge?.draw?.();bridge?.ignite?.()}
  function approach(){settleVisual();return S('APPROACHING')}
  function rest(){settleVisual();return S('FOREGROUND_REST')}
  function stable(){settleVisual();return S('FOREGROUND_IDLE')}
  function playSignature(){S('SIGNATURE_PLAY');phase='torchlit-arrival';bridge?.draw?.();bridge?.ignite?.();if(!reducedMotion){frame.style.transform='scale(1.018)';frame.style.filter='brightness(1.07) saturate(1.04)';clearTimeout(timer);timer=setTimeout(()=>{if(destroyed)return;settleVisual();phase='ambient';S('FOREGROUND_IDLE')},850)}else{phase='ambient';S('FOREGROUND_IDLE')}return api}
  function select(){S('SELECT_RESPONSE');if(!reducedMotion)frame.style.transform='scale(.985)';return api}
  function openReader(){S('READER_OPEN');frame.style.opacity='.82';return api}
  function restore(){S('RETURN_RESTORING');clearTimeout(timer);settleVisual();timer=setTimeout(()=>{if(!destroyed){phase='ambient';rest()}},reducedMotion?0:220);return api}
  function inspect(){return Object.freeze({state,phase,reducedMotion:!!reducedMotion,webglContexts:destroyed?0:1,renderer:DONOR.version,donorContract:DONOR.contract,recognizableObject:'HOUSE_MANOR',signatureEvent:CONTRACT.signatureEvent,eventCount:1,donorReady:!!bridge,donorError:error?.message||null,donorInspection:bridge?.inspect?.()||null,torchCount:TORCH_SOURCE.torchCount,torchSource:TORCH_SOURCE.contract,ambientEnvironment:'NIGHT_ESTATE_FIELD',perimeterGlow:true,compositionProfile:CONTRACT.compositionProfile,sourceBinding:CONTRACT.sourceBinding,presentationAuthority:'PROVEN_COMPASS_MANOR_PLUS_HOME_TORCH_AMBIENCE'})}
  function destroy(){destroyed=true;clearTimeout(timer);bridge?.destroy?.();bridge=null;try{frame.src='about:blank'}catch{}frame.remove();root.remove()}
  const api=Object.freeze({element:root,contract:CONTRACT,ready,approach,rest,playSignature,select,openReader,restore,stable,inspect,destroy});
  return api;
}

export{CONTRACT as AWARDS_ESTATE_CYCLE_E_CONTRACT};
export default createAwardsEstateCycleE;
