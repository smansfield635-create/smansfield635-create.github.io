import {mountExperienceLivingObject,AWARDS_EXPERIENCE_CYCLE_A_CONTRACT} from './experience-cycle-a.mjs';
import {mountWorldLivingObject,AWARDS_WORLD_CYCLE_B_CONTRACT} from './world-cycle-b.mjs';
import {mountCoherenceLivingObject,AWARDS_COHERENCE_CYCLE_C_CONTRACT} from './coherence-cycle-c.mjs';
import {mountTrustLivingObject,AWARDS_TRUST_CYCLE_D_CONTRACT} from './trust-cycle-d.mjs';
import {createAwardsEstateCycleE,AWARDS_ESTATE_CYCLE_E_CONTRACT} from './estate-cycle-e.mjs';

const CONTRACT=Object.freeze({
  id:'AWARDS_SHARED_CAROUSEL_COMPOSITION_CYCLE_F_V1',
  cycle:'F_SHARED_COMPOSITION',
  claim:'Five independently closed living objects compose into one shared Awards carousel without losing their identities.',
  governingHead:'a7399e6c08378e59b3544f3cf6839a1abf8dd8f9',
  objectContracts:Object.freeze({
    experience:AWARDS_EXPERIENCE_CYCLE_A_CONTRACT.id,
    world:AWARDS_WORLD_CYCLE_B_CONTRACT.id,
    coherence:AWARDS_COHERENCE_CYCLE_C_CONTRACT.id,
    trust:AWARDS_TRUST_CYCLE_D_CONTRACT.id,
    estate:AWARDS_ESTATE_CYCLE_E_CONTRACT.id
  }),
  sharedLifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']),
  traversal:Object.freeze({swipeDrag:true,rearTapToFront:true,activeTapToReader:true,keyboard:true,exactHashFocusRestReturn:true}),
  runtime:Object.freeze({maxActiveLivingObjectInstances:1,rearHeavyRuntime:false,inactiveTeardown:true}),
  reducedMotionEquivalent:true,
  bottomTrophyCarouselMutationAuthorized:false
});

const STYLE_ID='awards-shared-carousel-cycle-f-style';
const STYLE=`
[data-living-host]{display:block;position:absolute;inset:auto clamp(12px,2.5vw,26px) auto auto;width:clamp(150px,28%,220px);aspect-ratio:1;top:50%;transform:translateY(-50%);overflow:visible;contain:layout paint style;pointer-events:none}
[data-living-host]>*{width:100%;height:100%}
[data-living-host][data-shared-state="REAR_INERT"]{opacity:.32;filter:saturate(.72) blur(1px)}
[data-living-host][data-shared-state="APPROACHING"]{opacity:.72}
[data-living-host][data-shared-state="SELECT_RESPONSE"]{transform:translateY(-50%) scale(.96)}
[data-living-host][data-shared-state="READER_OPEN"]{opacity:.78}
.awards-lo--experience{position:relative;width:100%;height:100%;min-height:220px;perspective:760px;overflow:hidden;isolation:isolate;background:radial-gradient(circle at 50% 48%,rgba(137,227,255,.08),transparent 42%)}
.awards-lo--experience .exp-space{position:absolute;inset:4%;transform-style:preserve-3d;perspective:680px}
.awards-lo--experience .exp-field{position:absolute;inset:10%;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.18,.78,.2,1)}
.awards-lo--experience .exp-node{position:absolute;left:50%;top:50%;width:26px;height:26px;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) translateZ(var(--z)) rotateX(var(--rx)) rotateY(var(--ry));transition:transform .72s cubic-bezier(.18,.78,.2,1),opacity .4s ease}
.awards-lo--experience .exp-crystal{position:absolute;inset:0;border:1px solid rgba(137,227,255,.45);transform:rotate(45deg);background:rgba(8,25,38,.72);box-shadow:0 0 18px rgba(137,227,255,.12)}
.awards-lo--experience .exp-crystal span{position:absolute;inset:0;display:grid;place-items:center;transform:rotate(-45deg);font:800 7px/1 system-ui;color:#dff9ff}
.awards-lo--experience .exp-core{position:absolute;left:50%;top:50%;width:54px;height:54px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(234,211,154,.42);box-shadow:0 0 30px rgba(234,211,154,.1)}
.awards-lo--experience .exp-core__ring{position:absolute;inset:8%;border-radius:50%;border:1px solid rgba(137,227,255,.24)}
.awards-lo--experience .exp-core__ring--b{inset:23%;border-color:rgba(147,224,189,.36)}
.awards-lo--experience .exp-core__point{position:absolute;left:50%;top:50%;width:6px;height:6px;border-radius:50%;transform:translate(-50%,-50%);background:#ead39a;box-shadow:0 0 14px #ead39a}
.awards-lo--experience .exp-horizon{position:absolute;left:50%;top:50%;border-radius:50%;transform:translate(-50%,-50%) rotateX(68deg);border:1px solid rgba(137,227,255,.12)}
.awards-lo--experience .exp-horizon--outer{width:86%;height:86%}.awards-lo--experience .exp-horizon--inner{width:60%;height:60%}
.awards-lo--experience .exp-cluster{position:absolute;left:50%;top:50%;width:76px;height:76px;transform:translate(-50%,-50%) scale(.42);opacity:0;transition:.65s ease}
.awards-lo--experience .exp-room{position:absolute;width:18px;height:18px;border:1px solid rgba(147,224,189,.5);background:rgba(8,25,38,.84);display:grid;place-items:center;font:700 5px/1 system-ui;color:#dfffe9}.awards-lo--experience .exp-room--1{left:0;top:29px}.awards-lo--experience .exp-room--2{right:0;top:29px}.awards-lo--experience .exp-room--3{left:29px;top:0}.awards-lo--experience .exp-room--4{left:29px;bottom:0}
.awards-lo--experience .exp-threshold{position:absolute;left:50%;top:50%;width:58px;height:74px;transform:translate(-50%,-50%) translateZ(42px) scale(.45);opacity:0;transition:.65s ease}.awards-lo--experience .exp-threshold__frame{position:absolute;inset:0;border:1px solid rgba(234,211,154,.6);background:rgba(7,18,27,.5);box-shadow:0 0 25px rgba(234,211,154,.08)}
.awards-lo--experience[data-exp-phase="orient"] .exp-field{transform:rotateZ(10deg) scale(1.03)}
.awards-lo--experience[data-exp-phase="cluster"] .exp-node{opacity:.35}.awards-lo--experience[data-exp-phase="cluster"] .exp-cluster{opacity:1;transform:translate(-50%,-50%) scale(1)}
.awards-lo--experience[data-exp-phase="select"] .exp-cluster{opacity:1;transform:translate(-50%,-50%) scale(1.12)}
.awards-lo--experience[data-exp-phase="threshold"] .exp-threshold,.awards-lo--experience[data-exp-phase="travel"] .exp-threshold{opacity:1;transform:translate(-50%,-50%) translateZ(42px) scale(1)}
.awards-lo--experience[data-exp-phase="rear"]{opacity:.28;filter:saturate(.7) blur(1px)}
.awards-lo--experience[data-exp-phase="equivalent"] .exp-cluster{opacity:.82;transform:translate(-50%,-50%) scale(.9)}.awards-lo--experience[data-exp-phase="equivalent"] .exp-threshold{opacity:.72;transform:translate(-50%,-50%) scale(.82)}
.awards-shared-rear-cue{position:absolute;inset:18%;display:grid;place-items:center;border:1px solid rgba(147,224,189,.2);border-radius:50%;font:800 10px/1 system-ui;letter-spacing:.14em;color:rgba(215,239,230,.64);text-align:center}
@media(max-width:760px){[data-living-host]{right:-2px;width:170px}}
@media(prefers-reduced-motion:reduce){[data-living-host],.awards-lo--experience *{transition:none!important;animation:none!important}}
`;

const labels=Object.freeze({experience:'EXPERIENCE',world:'WORLD',coherence:'COHERENCE',trust:'TRUST',estate:'ESTATE'});
const factories=Object.freeze({
  experience:(host,reducedMotion)=>mountExperienceLivingObject(host,{reducedMotion}),
  world:(host,reducedMotion)=>mountWorldLivingObject(host,{reducedMotion}),
  coherence:(host,reducedMotion)=>mountCoherenceLivingObject(host,{reducedMotion}),
  trust:(host,reducedMotion)=>mountTrustLivingObject(host,{reducedMotion}),
  estate:(host,reducedMotion)=>createAwardsEstateCycleE({document:host.ownerDocument,reducedMotion})
});

function ensureStyle(doc){let s=doc.getElementById(STYLE_ID);if(s)return;s=doc.createElement('style');s.id=STYLE_ID;s.textContent=STYLE;doc.head.append(s)}
function hostFor(card){return card?.querySelector('[data-living-host]')||null}
function paintRear(card,reducedMotion){const host=hostFor(card);if(!host)return;host.replaceChildren();host.dataset.sharedState='REAR_INERT';host.dataset.livingState='REAR_INERT';host.dataset.livingReduced=String(reducedMotion);host.dataset.storyKind=card.dataset.story;const cue=host.ownerDocument.createElement('div');cue.className='awards-shared-rear-cue';cue.textContent=labels[card.dataset.story]||card.dataset.story?.toUpperCase()||'OBJECT';host.append(cue)}

function normalizeEstate(api,host){return Object.freeze({
  contract:api.contract,
  setState(next){host.dataset.objectState=next;if(next==='APPROACHING')api.approach();else if(next==='FOREGROUND_REST')api.rest();else if(next==='FOREGROUND_IDLE')api.stable();else if(next==='REAR_INERT')api.rest();return next},
  playSignature:()=>api.playSignature(),
  selectResponse(){host.dataset.objectState='SELECT_RESPONSE';return 'SELECT_RESPONSE'},
  readerOpen:()=>api.openReader(),
  restore:()=>api.restore(),
  inspect:()=>api.inspect(),
  destroy:()=>api.destroy(),
  element:api.element
})}

function mountObject(card,reducedMotion){const host=hostFor(card);if(!host)throw new Error('CYCLE_F_LIVING_HOST_REQUIRED');const story=card.dataset.story;const factory=factories[story];if(!factory)throw new Error(`CYCLE_F_UNKNOWN_OBJECT:${story}`);host.replaceChildren();host.dataset.storyKind=story;host.dataset.livingReduced=String(reducedMotion);const raw=factory(host,reducedMotion);if(story==='estate'){host.replaceChildren(raw.element);return normalizeEstate(raw,host)}return raw}

export function createAwardsSharedCarouselCycleF(cards,{reducedMotion=false}={}){
  if(!Array.isArray(cards)||cards.length!==5)throw new Error('CYCLE_F_REQUIRES_EXACTLY_FIVE_CARDS');
  const doc=cards[0]?.ownerDocument||document;ensureStyle(doc);
  const expected=['experience','world','coherence','trust','estate'];
  if(cards.some((card,i)=>card.dataset.story!==expected[i]))throw new Error('CYCLE_F_CARD_ORDER_OR_IDENTITY_MISMATCH');
  let activeCard=null,activeObject=null,token=0,timer=0;
  cards.forEach(card=>{card.tabIndex=-1;paintRear(card,reducedMotion)});
  const setShared=(card,state)=>{const host=hostFor(card);if(!host)return;host.dataset.sharedState=state;host.dataset.livingState=state;card.dataset.livingState=state};
  const destroyActive=()=>{if(!activeObject)return;try{activeObject.destroy?.()}finally{activeObject=null}};
  function activate(card,{play=true}={}){
    if(!card)return;token++;clearTimeout(timer);
    if(activeCard&&activeCard!==card){destroyActive();setShared(activeCard,'REAR_INERT');paintRear(activeCard,reducedMotion)}else destroyActive();
    activeCard=card;setShared(card,'APPROACHING');activeObject=mountObject(card,reducedMotion);activeObject.setState?.('APPROACHING');activeObject.setState?.('FOREGROUND_REST');setShared(card,'FOREGROUND_REST');
    const t=token;if(play)timer=setTimeout(()=>{if(t!==token||card!==activeCard)return;setShared(card,'SIGNATURE_PLAY');activeObject?.playSignature?.();setShared(card,'FOREGROUND_IDLE')},reducedMotion?0:90);
  }
  async function select(card,open){if(card!==activeCard||!activeObject)return;token++;clearTimeout(timer);setShared(card,'SELECT_RESPONSE');activeObject.selectResponse?.();if(!reducedMotion)await new Promise(r=>setTimeout(r,230));if(card!==activeCard||!activeObject)return;setShared(card,'READER_OPEN');activeObject.readerOpen?.();open?.()}
  function restore(card){if(!card)return;token++;clearTimeout(timer);if(card!==activeCard||!activeObject){destroyActive();if(activeCard)paintRear(activeCard,reducedMotion);activeCard=card;activeObject=mountObject(card,reducedMotion)}setShared(card,'RETURN_RESTORING');activeObject.restore?.();requestAnimationFrame(()=>{if(card!==activeCard)return;activeObject?.setState?.('FOREGROUND_REST');setShared(card,'FOREGROUND_REST')})}
  function inspect(){const objectInspection=activeObject?.inspect?.()||null;return Object.freeze({controller:CONTRACT.id,cycle:CONTRACT.cycle,states:CONTRACT.sharedLifecycle,activeStory:activeCard?.dataset.story||null,activeObjectContract:activeObject?.contract?.id||null,activeLivingObjectInstances:activeObject?1:0,maxActiveLivingObjectInstances:1,rearHeavyRuntime:false,inactiveTeardown:true,topWebglContexts:Number(objectInspection?.webglContexts||0),reducedMotion:!!reducedMotion,objectInspection})}
  function teardown(){token++;clearTimeout(timer);destroyActive();if(activeCard)paintRear(activeCard,reducedMotion);activeCard=null}
  return Object.freeze({contract:CONTRACT,activate,select,restore,inspect,teardown})
}

export {CONTRACT as AWARDS_SHARED_CAROUSEL_CYCLE_F_CONTRACT};
export default createAwardsSharedCarouselCycleF;
