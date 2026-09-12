const CONTRACT = Object.freeze({
  id: 'AWARDS_WORLD_LIVING_OBJECT_CYCLE_B_V1',
  cycle: 'B_WORLD',
  claim: 'The browser can hold a world.',
  sourceBinding: Object.freeze({
    governingHead: '751b93edbd662573231b651e2f915c3a5882a942',
    hEarthIndex: Object.freeze({path:'/showroom/globe/h-earth/index.js', blob:'b26aa16abfebf24bf0d77b62d36f7a11ade1ac5c'}),
    hEarthRenderer: Object.freeze({path:'/showroom/globe/h-earth/renderer.js', blob:'799d37cec5244e6aa19b7d94dffe37e182b85884'}),
    hEarthEnvironment: Object.freeze({path:'/showroom/globe/h-earth/environment.js', blob:'3f3bc750b0e1a87531e0ea425dc0ac343fb18381'}),
    hEarthCompositor: Object.freeze({path:'/showroom/globe/h-earth/compositor.js', blob:'3764f0d53b0564de7a5e983bd339dda75017bc82'})
  }),
  worldGrammar: Object.freeze([
    'BROWSER_NATIVE_WORLD_STAGE',
    'SPHERICAL_GLOBE_RESOLUTION',
    'WORLD_SPACE_GROUND_AND_SHORELINE',
    'DIRECT_MANIPULATION_VIEW',
    'INSPECTION_STATE_RETURN'
  ]),
  lifecycle: Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

const STYLE_ID='awards-world-cycle-b-style';
const STYLE=`
.awards-world-object{position:relative;width:100%;height:100%;min-height:240px;overflow:hidden;isolation:isolate;contain:layout paint style;pointer-events:none;perspective:760px;background:radial-gradient(circle at 52% 48%,rgba(92,196,225,.09),transparent 33%),radial-gradient(circle at 48% 58%,rgba(87,183,132,.055),transparent 45%)}
.awards-world-object .world-space{position:absolute;inset:2% 1%;transform-style:preserve-3d;perspective:680px}
.awards-world-object .world-orbit{position:absolute;left:50%;top:50%;width:min(72%,260px);aspect-ratio:1;transform-style:preserve-3d;transform:translate3d(-50%,-50%,0) rotateX(12deg) rotateY(-24deg);transition:transform .9s cubic-bezier(.18,.78,.2,1),filter .5s ease}
.awards-world-object .world-globe{position:absolute;inset:12%;border-radius:50%;transform-style:preserve-3d;background:radial-gradient(circle at 32% 28%,rgba(216,245,255,.35),rgba(74,168,206,.22) 18%,rgba(11,49,74,.88) 55%,rgba(2,15,27,.98) 78%);border:1px solid rgba(146,229,255,.35);box-shadow:inset -26px -20px 44px rgba(0,0,0,.62),inset 15px 8px 30px rgba(168,239,255,.08),0 0 26px rgba(89,196,225,.16)}
.awards-world-object .world-globe:before,.awards-world-object .world-globe:after{content:"";position:absolute;inset:7%;border-radius:50%;border:1px solid rgba(153,232,255,.16);transform:rotateX(69deg)}
.awards-world-object .world-globe:after{inset:22% 7%;transform:rotateY(71deg);border-color:rgba(161,240,199,.18)}
.awards-world-object .world-grid{position:absolute;inset:12%;border-radius:50%;background:repeating-linear-gradient(12deg,transparent 0 16px,rgba(153,232,255,.055) 17px 18px),repeating-linear-gradient(102deg,transparent 0 19px,rgba(153,232,255,.04) 20px 21px);clip-path:circle(50%)}
.awards-world-object .world-land{position:absolute;left:34%;top:27%;width:38%;height:42%;border-radius:56% 44% 62% 38% / 44% 62% 38% 56%;background:linear-gradient(145deg,rgba(164,211,142,.72),rgba(63,135,105,.58) 38%,rgba(24,79,69,.38));box-shadow:0 0 12px rgba(137,219,175,.2);transform:rotate(-17deg) translateZ(12px);clip-path:polygon(18% 8%,55% 0,87% 18%,100% 48%,79% 67%,68% 100%,34% 90%,8% 70%,0 39%)}
.awards-world-object .world-shore{position:absolute;left:31%;top:25%;width:44%;height:47%;border-radius:50%;border:1px solid rgba(235,220,166,.52);border-left-color:transparent;border-bottom-color:rgba(235,220,166,.18);transform:rotate(-20deg) translateZ(15px);opacity:.28;transition:opacity .45s ease,filter .45s ease}
.awards-world-object .world-lens{position:absolute;right:5%;top:14%;width:31%;aspect-ratio:1;border-radius:50%;border:1px solid rgba(238,215,144,.38);background:radial-gradient(circle,rgba(238,215,144,.1),rgba(5,18,24,.48) 58%,rgba(2,7,12,.76));box-shadow:0 0 26px rgba(238,215,144,.08);transform:translate3d(18px,-10px,40px) scale(.55);opacity:0;transition:opacity .48s ease,transform .75s cubic-bezier(.18,.78,.2,1)}
.awards-world-object .world-lens:before{content:"";position:absolute;left:50%;top:50%;width:72%;height:1px;background:linear-gradient(90deg,transparent,rgba(238,215,144,.65),transparent);transform:translate(-50%,-50%) rotate(-22deg)}
.awards-world-object .world-lens:after{content:"";position:absolute;left:50%;top:50%;height:72%;width:1px;background:linear-gradient(180deg,transparent,rgba(138,228,255,.55),transparent);transform:translate(-50%,-50%) rotate(18deg)}
.awards-world-object .world-signal{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:#fff2ba;box-shadow:0 0 5px #fff2ba,0 0 15px rgba(238,215,144,.85),0 0 30px rgba(138,228,255,.38);transform:translate3d(45px,-44px,30px);opacity:.32;transition:opacity .35s ease,transform .75s cubic-bezier(.18,.78,.2,1)}
.awards-world-object[data-world-phase="resolve"] .world-orbit{transform:translate3d(-50%,-50%,10px) rotateX(8deg) rotateY(24deg) scale(1.03)}
.awards-world-object[data-world-phase="terrain"] .world-land{filter:brightness(1.22) saturate(1.16)}
.awards-world-object[data-world-phase="shoreline"] .world-shore{opacity:.92;filter:drop-shadow(0 0 7px rgba(238,215,144,.5))}
.awards-world-object[data-world-phase="inspect"] .world-lens{opacity:1;transform:translate3d(0,0,70px) scale(1)}
.awards-world-object[data-world-phase="inspect"] .world-signal{opacity:1;transform:translate3d(53px,-48px,62px)}
.awards-world-object[data-world-phase="restore"] .world-orbit{transform:translate3d(-50%,-50%,0) rotateX(12deg) rotateY(-24deg) scale(.94)}
.awards-world-object[data-world-phase="selected"] .world-shore{opacity:1}.awards-world-object[data-world-phase="selected"] .world-signal{opacity:1}
.awards-world-object[data-world-phase="rear"]{opacity:.32;filter:saturate(.7) blur(1px)}
.awards-world-object[data-world-phase="equivalent"] .world-shore{opacity:.88}.awards-world-object[data-world-phase="equivalent"] .world-lens{opacity:.76;transform:translate3d(0,0,70px) scale(.9)}.awards-world-object[data-world-phase="equivalent"] .world-signal{opacity:1}
@media(max-width:760px){.awards-world-object .world-orbit{width:min(82%,238px)}.awards-world-object .world-lens{right:2%;top:12%;width:34%}}
@media(prefers-reduced-motion:reduce){.awards-world-object *{transition:none!important;animation:none!important}}
`;

function ensureStyle(){
  let style=document.getElementById(STYLE_ID);
  if(style)return style;
  style=document.createElement('style');style.id=STYLE_ID;style.textContent=STYLE;document.head.append(style);return style;
}

function markup(){return `<div class="awards-world-object" data-awards-lo="world" data-awards-lo-state="FOREGROUND_REST" data-world-phase="rest" aria-hidden="true"><div class="world-space"><div class="world-orbit"><div class="world-globe"></div><div class="world-grid"></div><div class="world-land"></div><div class="world-shore"></div><div class="world-signal"></div></div><div class="world-lens"></div></div></div>`;}

export function mountWorldLivingObject(root, options={}){
  if(!root || typeof root.replaceChildren!=='function') throw new TypeError('WORLD_ROOT_REQUIRED');
  ensureStyle();
  const reduced=options.reducedMotion ?? globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const wrap=document.createElement('div');wrap.innerHTML=markup();const node=wrap.firstElementChild;root.replaceChildren(node);
  let state='FOREGROUND_REST',token=0,timers=[];
  const phase=v=>{if(node)node.dataset.worldPhase=v};
  const clear=()=>{timers.forEach(clearTimeout);timers=[]};
  const schedule=(fn,ms,t)=>{const id=setTimeout(()=>{if(t===token)fn()},ms);timers.push(id)};
  function setState(next){if(!CONTRACT.lifecycle.includes(next))throw new Error(`WORLD_INVALID_STATE:${next}`);state=next;node.dataset.awardsLoState=next;return state}
  function stable(){phase(reduced?'equivalent':'idle');setState('FOREGROUND_IDLE')}
  function playSignature(){token++;clear();const t=token;setState('SIGNATURE_PLAY');if(reduced){phase('equivalent');return stable()}phase('resolve');schedule(()=>phase('terrain'),680,t);schedule(()=>phase('shoreline'),1420,t);schedule(()=>phase('inspect'),2260,t);schedule(()=>phase('restore'),3320,t);schedule(()=>stable(),4100,t);return t}
  function selectResponse(){token++;clear();setState('SELECT_RESPONSE');phase(reduced?'equivalent':'selected')}
  function readerOpen(){setState('READER_OPEN')}
  function restore(){token++;clear();setState('RETURN_RESTORING');phase(reduced?'equivalent':'restore');const t=token;schedule(()=>{phase('rest');setState('FOREGROUND_REST')},reduced?0:460,t)}
  function setLifecycle(next){token++;clear();setState(next);if(next==='REAR_INERT')phase('rear');else if(next==='APPROACHING')phase('approach');else if(next==='FOREGROUND_REST')phase('rest');else if(next==='FOREGROUND_IDLE')phase('idle')}
  function inspect(){return Object.freeze({contract:CONTRACT.id,cycle:CONTRACT.cycle,state,phase:node.dataset.worldPhase,reducedMotion:!!reduced,webglContexts:0,sourceBinding:CONTRACT.sourceBinding,worldGrammar:CONTRACT.worldGrammar.slice()})}
  function destroy(){token++;clear();root.replaceChildren()}
  if(reduced)phase('equivalent');
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:node})
}

export { CONTRACT as AWARDS_WORLD_CYCLE_B_CONTRACT };
