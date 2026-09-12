import {mountExperienceLivingObject,AWARDS_EXPERIENCE_CYCLE_A_CONTRACT} from './experience-cycle-a.mjs';
import {mountWorldLivingObject,AWARDS_WORLD_CYCLE_B_CONTRACT} from './world-cycle-b.mjs';
import {mountCoherenceLivingObject,AWARDS_COHERENCE_CYCLE_C_CONTRACT} from './coherence-cycle-c.mjs';
import {mountTrustLivingObject,AWARDS_TRUST_CYCLE_D_CONTRACT} from './trust-cycle-d.mjs';
import {createAwardsEstateCycleE,AWARDS_ESTATE_CYCLE_E_CONTRACT} from './estate-cycle-e.mjs';

const CONTRACT=Object.freeze({
  id:'AWARDS_SHARED_CAROUSEL_COMPOSITION_CYCLE_F_V2_RECOGNITION_FIRST',
  cycle:'F_SHARED_COMPOSITION',
  claim:'Five independently recognizable estate objects compose into one shared Awards carousel without forcing a common visual cage.',
  governingHead:'521c4b146337e16c784b9f3f0a6bb94045b756b5',
  objectContracts:Object.freeze({
    experience:AWARDS_EXPERIENCE_CYCLE_A_CONTRACT.id,
    world:AWARDS_WORLD_CYCLE_B_CONTRACT.id,
    coherence:AWARDS_COHERENCE_CYCLE_C_CONTRACT.id,
    trust:AWARDS_TRUST_CYCLE_D_CONTRACT.id,
    estate:AWARDS_ESTATE_CYCLE_E_CONTRACT.id
  }),
  compositionProfiles:Object.freeze({
    experience:Object.freeze({shape:'VERTICAL_ARCHITECTURAL_WINDOW',aspect:'2/3'}),
    world:Object.freeze({shape:'WIDE_ENVIRONMENTAL_WORLD',aspect:'16/9'}),
    coherence:Object.freeze({shape:'COMPACT_ANATOMICAL_FIELD',aspect:'6/5'}),
    trust:Object.freeze({shape:'PANORAMIC_MOUNTAIN_RANGE',aspect:'2/1'}),
    estate:Object.freeze({shape:'ARCHITECTURAL_THREE_QUARTER_FIELD',aspect:'4/3'})
  }),
  sharedLifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']),
  traversal:Object.freeze({swipeDrag:true,rearTapToFront:true,activeTapToReader:true,keyboard:true,exactHashFocusRestReturn:true}),
  runtime:Object.freeze({maxActiveLivingObjectInstances:1,rearHeavyRuntime:false,inactiveTeardown:true}),
  recognitionLaw:Object.freeze({sharedCircleForbidden:true,objectSpecificFootprints:true,integrationMayNotDegradeStandaloneRecognition:true}),
  reducedMotionEquivalent:true,
  bottomTrophyCarouselMutationAuthorized:false
});

const STYLE_ID='awards-shared-carousel-cycle-f-style';
const STYLE=`
[data-living-host]{display:block;position:absolute;top:50%;right:clamp(8px,2.2vw,24px);transform:translateY(-50%);overflow:visible;contain:layout paint style;pointer-events:none;z-index:0}
[data-living-host]::before{display:none!important;content:none!important}
[data-living-host]>*{display:block;width:100%!important;height:100%!important;min-height:0!important;max-width:none!important}
[data-living-host][data-story-kind="experience"]{width:clamp(180px,28%,250px);aspect-ratio:2/3}
[data-living-host][data-story-kind="world"]{width:clamp(300px,48%,470px);aspect-ratio:16/9}
[data-living-host][data-story-kind="coherence"]{width:clamp(240px,38%,350px);aspect-ratio:6/5}
[data-living-host][data-story-kind="trust"]{width:clamp(320px,51%,510px);aspect-ratio:2/1}
[data-living-host][data-story-kind="estate"]{width:clamp(285px,45%,440px);aspect-ratio:4/3}
.achievement-stage .instrument-card[data-story="experience"] .feature{padding-right:clamp(205px,34%,290px)}
.achievement-stage .instrument-card[data-story="world"] .feature{padding-right:clamp(325px,51%,500px)}
.achievement-stage .instrument-card[data-story="coherence"] .feature{padding-right:clamp(265px,42%,390px)}
.achievement-stage .instrument-card[data-story="trust"] .feature{padding-right:clamp(345px,54%,530px)}
.achievement-stage .instrument-card[data-story="estate"] .feature{padding-right:clamp(310px,48%,465px)}
[data-living-host][data-shared-state="REAR_INERT"]{opacity:.32;filter:saturate(.72) blur(1px)}
[data-living-host][data-shared-state="APPROACHING"]{opacity:.72}
[data-living-host][data-shared-state="SELECT_RESPONSE"]{transform:translateY(-50%) scale(.97)}
[data-living-host][data-shared-state="READER_OPEN"]{opacity:.78}
.awards-shared-rear-cue{position:absolute;inset:18%;display:grid;place-items:center;border:1px solid rgba(147,224,189,.18);border-radius:22px;font:800 10px/1 system-ui;letter-spacing:.14em;color:rgba(215,239,230,.64);text-align:center;background:linear-gradient(145deg,rgba(147,224,189,.025),rgba(2,8,11,.22))}
@media(max-width:760px){
  .achievement-stage .feature{padding:clamp(24px,7vw,34px) clamp(20px,6vw,30px) 220px!important;min-height:440px}
  [data-living-host]{left:50%;right:auto;top:auto;bottom:18px;transform:translateX(-50%);max-width:88%}
  [data-living-host][data-story-kind="experience"]{width:min(184px,66%);aspect-ratio:2/3}
  [data-living-host][data-story-kind="world"]{width:min(300px,90%);aspect-ratio:16/9}
  [data-living-host][data-story-kind="coherence"]{width:min(255px,82%);aspect-ratio:6/5}
  [data-living-host][data-story-kind="trust"]{width:min(310px,92%);aspect-ratio:2/1}
  [data-living-host][data-story-kind="estate"]{width:min(280px,88%);aspect-ratio:4/3}
  .achievement-stage .instrument-card[data-story="experience"] .feature{padding-bottom:292px!important;min-height:515px}
  .achievement-stage .instrument-card[data-story="coherence"] .feature{padding-bottom:245px!important;min-height:470px}
  .achievement-stage .instrument-card[data-story="estate"] .feature{padding-bottom:255px!important;min-height:480px}
  [data-living-host][data-shared-state="SELECT_RESPONSE"]{transform:translateX(-50%) scale(.97)}
}
@media(prefers-reduced-motion:reduce){[data-living-host]{transition:none!important;animation:none!important}}
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
  function inspect(){const objectInspection=activeObject?.inspect?.()||null;return Object.freeze({controller:CONTRACT.id,cycle:CONTRACT.cycle,states:CONTRACT.sharedLifecycle,activeStory:activeCard?.dataset.story||null,activeObjectContract:activeObject?.contract?.id||null,activeLivingObjectInstances:activeObject?1:0,maxActiveLivingObjectInstances:1,rearHeavyRuntime:false,inactiveTeardown:true,topWebglContexts:Number(objectInspection?.webglContexts||0),reducedMotion:!!reducedMotion,compositionProfile:CONTRACT.compositionProfiles[activeCard?.dataset.story]||null,objectInspection})}
  function teardown(){token++;clearTimeout(timer);destroyActive();if(activeCard)paintRear(activeCard,reducedMotion);activeCard=null}
  return Object.freeze({contract:CONTRACT,activate,select,restore,inspect,teardown})
}

export {CONTRACT as AWARDS_SHARED_CAROUSEL_CYCLE_F_CONTRACT};
export default createAwardsSharedCarouselCycleF;
