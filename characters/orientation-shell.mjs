import {getDestination} from './destination-registry.mjs';
import {createCloudTraversalController} from './cloud-traversal.mjs';

export const FRONTIER_DESTINATION_CARDS=Object.freeze({
  crossing:Object.freeze({
    place:'The Crossing',presence:'The first crews',
    front:Object.freeze([
      'The first crews have enough to keep going, but not enough to make everything dependable at once.',
      'What they solve first will shape what they are able to solve next.'
    ]),
    quote:null,
    story:'This is where exploration became responsibility. Once the return path failed, Audralia stopped being somewhere people could simply visit. It had to become somewhere people could live.',
    clock:'The pressure here is deciding what cannot wait. Early choices determine which choices will still be available later.'
  }),
  dextrion:Object.freeze({
    place:'Earth-side transmission',presence:null,
    front:Object.freeze([
      "Two reports from Audralia don't agree.",
      'Before anybody changes anything else, Dextrion wants to know what actually happened.'
    ]),
    quote:"I don't need the answer I expected. I need the answer we've actually got.",
    story:'Dextrion opened the path but cannot live the consequences from Earth. Audralia has to solve its own problems; his job is to help make sure the people there learn from what really happened rather than what everyone hoped would happen.',
    clock:'A failed attempt can still move things forward. A wrong conclusion can send everyone in the wrong direction.'
  }),
  alaric:Object.freeze({
    place:'Watchfire Overlook',presence:null,
    front:Object.freeze([
      'The north path is getting harder to use.',
      'Alaric wants another way ready before somebody gets stranded.'
    ]),
    quote:"I don't need everyone to agree with me. I need us to have somewhere else to go.",
    story:'Audralia cannot depend on everything going according to plan. Alaric is helping build a world that still has choices when conditions change.',
    clock:'There is still time to choose another route. If they wait until the old one is unusable, that choice disappears.'
  }),
  tarian:Object.freeze({
    place:'Waterline Station',presence:null,
    front:Object.freeze([
      "The water level is lower than it should be, and they don't know why yet."
    ]),
    quote:"We need to solve this quickly. If we don't, I'm going to have to shut something down.",
    story:'Water is one of the first things Audralia has to keep available for itself. If this keeps happening, everything that depends on it remains vulnerable.',
    clock:'Right now they still have enough water to investigate the problem. If the level keeps falling, the question changes from finding the cause to deciding what gets cut off.'
  }),
  manor:Object.freeze({
    place:'Mirror Manor',presence:null,
    front:Object.freeze([
      'Everything was fine until the heat came.',
      "Now the Manor can't keep everything running the way everyone wants at the same time."
    ]),
    quote:null,
    story:'This is the first place where everything Audralia has learned has to work together as one home. A good solution by itself is not necessarily a good solution once everybody depends on it.',
    clock:'The Manor still has choices. The important question is which changes leave the most choices available tomorrow.'
  }),
  elara:Object.freeze({
    place:'Signal Lantern Field',presence:null,
    front:Object.freeze([
      'The same lanterns changed before the last two problems in the field.',
      'They changed again this morning.'
    ]),
    quote:"I'm not saying it means something. I'm saying we should find out before we ignore it.",
    story:'Audralia will not always get an obvious warning before something changes. Elara is trying to learn which small signs are worth paying attention to—and which are just noise.',
    clock:'Checking a false warning costs some time. Ignoring a real one can cost the chance to act before the problem becomes obvious.'
  }),
  soren:Object.freeze({
    place:'Restoration Boundary',presence:null,
    front:Object.freeze([
      'The restored ground looks healthy again.',
      "The water just below it doesn't."
    ]),
    quote:'Before we call this fixed, I want to know what happened down here.',
    story:"Audralia cannot survive by making one place better while quietly making another worse. Soren's job is to make sure progress is real.",
    clock:'Hidden damage becomes harder to undo the longer it continues. Right now they still have a chance to find the cause before the new problem becomes normal.'
  }),
  auren:Object.freeze({
    place:null,presence:null,
    front:Object.freeze([
      'The new shelter made it through the storm.',
      'Auren is already worried about building the next one.'
    ]),
    quote:'I can make this one work. I need a way we can keep doing it.',
    story:'One safe building is not enough. Audralia has to be able to create and repair safe places wherever people eventually need them.',
    clock:"Tonight's shelter is secure. The pressure is what happens when the next one—and the one after that—needs the same people, time and materials."
  }),
  jeeves:Object.freeze({
    place:'Mirror Manor',presence:null,
    front:Object.freeze([
      'A crew made the same mistake this morning that another crew made months ago.',
      'The Manor already had the answer. They never saw it.'
    ]),
    quote:"We knew this. The problem is they didn't.",
    story:'Audralia cannot keep learning the same lessons from the beginning. What people discover has to survive them, travel to others and remain understandable when it is needed again.',
    clock:'Every repeated mistake costs time and resources twice. The longer useful knowledge stays trapped in rooms, records or individual memories, the slower the whole world learns.'
  }),
  remote:Object.freeze({
    place:'Beyond the Manor',presence:'Remote Team',
    front:Object.freeze([
      "The same water setup that works near the Manor isn't working here.",
      'They came out here specifically so they would not have to run back to the Manor every time something went wrong.'
    ]),
    quote:null,
    story:'If Audralia only works around the Manor, it is not a self-sustaining world yet. What people have learned has to work in new places with different conditions.',
    clock:'The camp is stable enough to adapt. If they cannot solve problems with what is available locally, every future settlement remains tied to the estate.'
  })
});

export function resolveCardGesture({flipped,deltaX,deltaY,horizontalIntent,threshold=42,tapSlop=7}){
  const current=Boolean(flipped);
  if(Math.hypot(deltaX,deltaY)<tapSlop)return !current;
  if(horizontalIntent&&Math.abs(deltaX)>=threshold)return !current;
  return current;
}

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const world=document.querySelector('.world');
const story=document.querySelector('#story');
const storyKind=document.querySelector('#story-kind');
const storyTitle=document.querySelector('#story-title');
const storyCopy=document.querySelector('#story-copy');
const storyMore=document.querySelector('#story-more');
const status=document.querySelector('#status');
const mapPanel=document.querySelector('#coast-map');
const mapButton=document.querySelector('#map-toggle');
const existingReturn=document.querySelector('#return');
const inspectButton=document.querySelector('#inspect');

const css=document.createElement('style');
css.textContent=`
.clock-star,.clock-anomaly,.map-node[data-id="clock"]{display:none!important}
.story.frontier-card-mode{width:min(480px,calc(100vw - 28px));max-height:none;overflow:visible;padding:0;border:0;background:transparent;backdrop-filter:none;box-shadow:none;perspective:1500px}
.story.frontier-card-mode>.story-source{display:none!important}
.frontier-card{position:relative;width:100%;height:min(560px,calc(100vh - 188px));min-height:370px;touch-action:pan-y;cursor:grab;outline:none;user-select:none;-webkit-user-select:none}
.frontier-card:active{cursor:grabbing}.frontier-card:focus-visible{outline:2px solid #f3dfaa;outline-offset:5px;border-radius:1.35rem}
.frontier-card__inner{position:relative;width:100%;height:100%;display:grid;transform-style:preserve-3d;transition:transform .58s cubic-bezier(.2,.72,.22,1)}
.frontier-card__inner.dragging{transition:none}
.frontier-card__face{grid-area:1/1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:auto;padding:1.15rem 1.18rem 1rem;border:1px solid rgba(255,255,255,.25);border-radius:1.35rem;background:linear-gradient(155deg,rgba(10,25,39,.96),rgba(3,9,17,.98));box-shadow:0 30px 90px rgba(0,0,0,.42);backface-visibility:hidden;-webkit-backface-visibility:hidden}
.frontier-card__face--back{transform:rotateY(180deg);background:linear-gradient(155deg,rgba(18,26,37,.97),rgba(5,10,18,.99))}
.frontier-card__kicker{font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;font-weight:900;color:#f3dfaa;min-height:.8rem}
.frontier-card__title{margin:.38rem 0 .28rem;font-size:clamp(1.75rem,3.5vw,2.65rem);letter-spacing:-.045em;line-height:.98}
.frontier-card__presence{margin:0 0 .78rem;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.58)}
.frontier-card__problem{display:grid;gap:.55rem;margin-top:.65rem}.frontier-card__problem p{margin:0;font-size:clamp(.92rem,1.6vw,1rem);line-height:1.5;color:rgba(255,255,255,.9)}
.frontier-card__quote{margin:.86rem 0 0;padding:.76rem .82rem;border-left:2px solid rgba(243,223,170,.62);background:rgba(243,223,170,.055);border-radius:0 .8rem .8rem 0;font-size:.93rem;line-height:1.48;color:#f7edcf;font-weight:650}
.frontier-card__actions{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:auto;padding-top:1rem}.frontier-card__actions button{border-radius:999px;padding:.62rem .78rem;font-weight:900;font-size:.72rem;cursor:pointer}
.frontier-card__map{border:1px solid #f3dfaa;background:#f3dfaa;color:#102027}.frontier-card__return{border:1px solid rgba(255,255,255,.24);background:rgba(255,255,255,.07);color:#fff}.frontier-card__enter{border:1px solid rgba(218,231,255,.25);background:rgba(218,231,255,.08);color:rgba(237,244,255,.84)}
.frontier-card__actions button:focus-visible{outline:2px solid #fff;outline-offset:2px}.frontier-card__notice{margin:.55rem 0 0;font-size:.7rem;font-weight:850;letter-spacing:.08em;text-transform:uppercase;color:#f3dfaa}.frontier-card__notice[hidden]{display:none}
.frontier-card__cue{margin:.72rem 0 0;text-align:center;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;font-weight:850;color:rgba(255,255,255,.48)}
.frontier-card__back-head{padding-bottom:.72rem;border-bottom:1px solid rgba(255,255,255,.13)}
.frontier-card__context{display:grid;gap:1rem;padding:.95rem 0}.frontier-card__context section{padding:.75rem .78rem;border:1px solid rgba(255,255,255,.11);border-radius:.95rem;background:rgba(255,255,255,.035)}
.frontier-card__label{display:block;margin-bottom:.32rem;font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;font-weight:900;color:#f3dfaa}.frontier-card__context p{margin:0;font-size:.9rem;line-height:1.5;color:rgba(255,255,255,.84)}
@media(max-width:720px){.story.frontier-card-mode{left:14px;right:14px;width:auto;bottom:126px}.frontier-card{height:min(510px,calc(100vh - 190px));min-height:330px}.frontier-card__face{padding:1rem}.frontier-card__title{font-size:clamp(1.55rem,8vw,2.15rem)}.frontier-card__actions{gap:.38rem}.frontier-card__actions button{padding:.62rem .68rem}.frontier-card__context{gap:.72rem}.frontier-card__context section{padding:.65rem .68rem}.frontier-card__context p{font-size:.84rem}}
@media(prefers-reduced-motion:reduce){.frontier-card__inner{transition:none}}
`;
document.head.appendChild(css);

const clouds=createCloudTraversalController({root:document.body,reducedMotion,onState:s=>{document.documentElement.dataset.cloudTravel=s;if(status&&['CLOUD_ENTRY','CLOUD_TRANSIT'].includes(s))status.textContent='Within the cloud layer · the coast falls from view';}});

let activeId=null;
let flipped=false;
let dragging=false;
let startX=0;
let startY=0;
let dragDelta=0;
let dragDeltaY=0;
let horizontalIntent=false;
let pointerId=null;

function prepareStoryCard(){
  if(!story||!storyKind||!storyTitle||!storyCopy||!storyMore)return null;
  const source=document.createElement('div');
  source.className='story-source';
  source.setAttribute('aria-hidden','true');
  for(const node of [storyKind,storyTitle,storyCopy,storyMore])source.appendChild(node);
  const card=document.createElement('div');
  card.className='frontier-card';
  card.tabIndex=0;
  card.setAttribute('role','group');
  card.setAttribute('aria-roledescription','two-sided destination card');
  card.setAttribute('data-card-schema','MIRRORLAND_FRONTIER_DESTINATION_CARD_SET_v1');
  card.innerHTML=`
    <div class="frontier-card__inner">
      <article class="frontier-card__face frontier-card__face--front" data-card-face="front">
        <div class="frontier-card__kicker" data-card-place></div>
        <h2 class="frontier-card__title" data-card-title></h2>
        <p class="frontier-card__presence" data-card-presence hidden></p>
        <div class="frontier-card__problem" data-card-problem></div>
        <blockquote class="frontier-card__quote" data-card-quote hidden></blockquote>
        <div class="frontier-card__actions">
          <button class="frontier-card__map" data-card-map type="button">Open coast map</button>
          <button class="frontier-card__return" data-card-return type="button">Return to orbit</button>
          <button class="frontier-card__enter" data-card-enter type="button">Enter</button>
        </div>
        <p class="frontier-card__notice" data-card-notice hidden aria-live="polite">Coming Soon</p>
        <p class="frontier-card__cue">Swipe either way for Story + Clock</p>
      </article>
      <article class="frontier-card__face frontier-card__face--back" data-card-face="back" aria-hidden="true">
        <div class="frontier-card__back-head"><span class="frontier-card__label">Context</span><h2 class="frontier-card__title" data-card-back-title></h2></div>
        <div class="frontier-card__context">
          <section><span class="frontier-card__label">Story</span><p data-card-story></p></section>
          <section><span class="frontier-card__label">Clock</span><p data-card-clock></p></section>
        </div>
        <div class="frontier-card__actions">
          <button class="frontier-card__map" data-card-map type="button">Open coast map</button>
          <button class="frontier-card__return" data-card-return type="button">Return to orbit</button>
        </div>
        <p class="frontier-card__cue">Swipe either way back to the scene card</p>
      </article>
    </div>`;
  story.append(source,card);
  return Object.freeze({
    card,
    inner:card.querySelector('.frontier-card__inner'),
    front:card.querySelector('[data-card-face="front"]'),
    back:card.querySelector('[data-card-face="back"]'),
    place:card.querySelector('[data-card-place]'),
    title:card.querySelector('[data-card-title]'),
    backTitle:card.querySelector('[data-card-back-title]'),
    presence:card.querySelector('[data-card-presence]'),
    problem:card.querySelector('[data-card-problem]'),
    quote:card.querySelector('[data-card-quote]'),
    story:card.querySelector('[data-card-story]'),
    clock:card.querySelector('[data-card-clock]'),
    notice:card.querySelector('[data-card-notice]')
  });
}

const cardUi=prepareStoryCard();
if(inspectButton)inspectButton.textContent='Open card';

function settleCard(nextFlipped,{focus=false}={}){
  if(!cardUi)return;
  flipped=Boolean(nextFlipped);
  cardUi.inner.classList.remove('dragging');
  cardUi.inner.style.transform=`rotateY(${flipped?-180:0}deg)`;
  cardUi.front.setAttribute('aria-hidden',flipped?'true':'false');
  cardUi.back.setAttribute('aria-hidden',flipped?'false':'true');
  cardUi.card.dataset.face=flipped?'back':'front';
  const destination=getDestination(activeId);
  cardUi.card.setAttribute('aria-label',`${destination?.title||'Destination'} card, ${flipped?'Story and Clock':'scene foundation'} side. Swipe horizontally or press Enter to turn the card.`);
  if(focus)cardUi.card.focus();
}

function renderCard(id,{forceShow=false}={}){
  const data=FRONTIER_DESTINATION_CARDS[id];
  const destination=getDestination(id);
  if(!data||!destination||!cardUi)return false;
  activeId=id;
  story.dataset.destinationId=id;
  cardUi.place.textContent=data.place||'';
  cardUi.place.hidden=!data.place;
  cardUi.title.textContent=destination.title;
  cardUi.backTitle.textContent=destination.title;
  cardUi.presence.textContent=data.presence||'';
  cardUi.presence.hidden=!data.presence;
  cardUi.problem.innerHTML='';
  for(const line of data.front){const p=document.createElement('p');p.textContent=line;cardUi.problem.appendChild(p);}
  cardUi.quote.textContent=data.quote||'';
  cardUi.quote.hidden=!data.quote;
  cardUi.story.textContent=data.story;
  cardUi.clock.textContent=data.clock;
  cardUi.notice.hidden=true;
  story.classList.add('frontier-card-mode');
  settleCard(false);
  if(forceShow)story.classList.add('show');
  if(story.classList.contains('show')&&status)status.textContent=`${destination.title} · swipe the card for Story + Clock`;
  return true;
}

function clearCard(){
  if(!story)return;
  story.classList.remove('frontier-card-mode');
  story.removeAttribute('data-destination-id');
  activeId=null;
  settleCard(false);
}

function syncActiveFromStory(){
  const title=storyTitle?.textContent?.trim();
  if(!title)return;
  for(const id of Object.keys(FRONTIER_DESTINATION_CARDS)){
    if(getDestination(id)?.title===title){renderCard(id);return;}
  }
}

if(storyTitle){
  const observer=new MutationObserver(syncActiveFromStory);
  observer.observe(storyTitle,{subtree:true,childList:true,characterData:true});
}

function interactiveTarget(target){return Boolean(target?.closest?.('button,a,input,textarea,select'))}

cardUi?.card.addEventListener('pointerdown',event=>{
  if(interactiveTarget(event.target))return;
  dragging=true;startX=event.clientX;startY=event.clientY;dragDelta=0;dragDeltaY=0;horizontalIntent=false;pointerId=event.pointerId;
  cardUi.inner.classList.add('dragging');
  cardUi.card.setPointerCapture?.(event.pointerId);
});
cardUi?.card.addEventListener('pointermove',event=>{
  if(!dragging||event.pointerId!==pointerId)return;
  dragDelta=event.clientX-startX;
  dragDeltaY=event.clientY-startY;
  const horizontalDistance=Math.abs(dragDelta);
  const verticalDistance=Math.abs(dragDeltaY);
  if(!horizontalIntent&&horizontalDistance>=8&&horizontalDistance>verticalDistance*1.08)horizontalIntent=true;
  if(!horizontalIntent)return;
  event.preventDefault();
  const width=Math.max(1,cardUi.card.getBoundingClientRect().width);
  const travel=Math.min(155,horizontalDistance/width*210);
  const angle=(flipped?-180:0)+(dragDelta<0?-travel:travel);
  cardUi.inner.style.transform=`rotateY(${angle}deg)`;
},{passive:false});
function finishPointer(event){
  if(!dragging||event.pointerId!==pointerId)return;
  dragging=false;
  cardUi.card.releasePointerCapture?.(event.pointerId);
  settleCard(resolveCardGesture({flipped,deltaX:dragDelta,deltaY:dragDeltaY,horizontalIntent}));
  pointerId=null;dragDelta=0;dragDeltaY=0;horizontalIntent=false;
}
cardUi?.card.addEventListener('pointerup',finishPointer);
cardUi?.card.addEventListener('pointercancel',event=>{if(dragging&&event.pointerId===pointerId){dragging=false;pointerId=null;dragDelta=0;dragDeltaY=0;horizontalIntent=false;settleCard(flipped);}});
cardUi?.card.addEventListener('keydown',event=>{
  if(event.target!==cardUi.card)return;
  if(event.key==='Enter'||event.key===' '){event.preventDefault();settleCard(!flipped);}
});

story?.addEventListener('click',event=>{
  const map=event.target.closest?.('[data-card-map]');
  if(map){mapButton?.click();return;}
  const back=event.target.closest?.('[data-card-return]');
  if(back){existingReturn?.click();return;}
  const enter=event.target.closest?.('[data-card-enter]');
  if(enter&&activeId){
    const sourceEnter=[...(storyMore?.querySelectorAll('button')||[])].find(button=>/^Enter scene$/i.test((button.textContent||'').trim()));
    if(sourceEnter){sourceEnter.click();return;}
    cardUi.notice.hidden=false;
    const destination=getDestination(activeId);
    if(status)status.textContent=`${destination?.title||'This scene'} · Coming Soon`;
  }
});

document.addEventListener('click',event=>{
  const signal=event.target.closest?.('.signal');
  const id=signal?.dataset?.id;
  if(id&&FRONTIER_DESTINATION_CARDS[id])clouds.begin({destinationId:id});
},true);

existingReturn?.addEventListener('click',()=>{clouds.clear();clearCard();});
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&mapPanel?.classList.contains('show'))return;});

const params=new URLSearchParams(location.search);
const sceneId=params.get('scene');
if(sceneId&&FRONTIER_DESTINATION_CARDS[sceneId]&&getDestination(sceneId)){
  renderCard(sceneId,{forceShow:true});
  cardUi.notice.hidden=false;
  if(status)status.textContent=`${getDestination(sceneId).title} · Coming Soon`;
}
