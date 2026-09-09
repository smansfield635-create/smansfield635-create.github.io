import {mountFrontierCycle1} from './frontier-cycle1.mjs';

const CYCLE_ID = 'DOOR_EXPLORE_11_CARD_TRAVERSAL_CYCLE1_DOOR_FRONTIER_v1';
const CARD_ORDER = Object.freeze(['products','gauges','frontier','laws','governance','home']);
const CARD_META = Object.freeze({
  products:Object.freeze({index:'01',name:'Products',route:'/products/',summary:'Applied work and practical systems.',action:'Open Products'}),
  gauges:Object.freeze({index:'02',name:'Gauges',route:'/gauges/',summary:'Measurement, signal, and system state.',action:'Check Gauges'}),
  frontier:Object.freeze({index:'03',name:'Frontier',route:'/explore/frontier/',summary:'Experimental systems become tangible before you enter.',action:'Open Frontier'}),
  laws:Object.freeze({index:'04',name:'Laws',route:'/laws/',summary:'Constraints, admissibility, and what may be claimed.',action:'Open Laws'}),
  governance:Object.freeze({index:'05',name:'Governance',route:'/governance/',summary:'Rules, decisions, and bounded execution.',action:'Open Governance'}),
  home:Object.freeze({index:'06',name:'Home',route:'/home/',summary:'The central estate hub and identity anchor.',action:'Open Home'})
});

function installStyles(){
  if(document.getElementById('door-cycle1-carousel-styles')) return;
  const style=document.createElement('style');
  style.id='door-cycle1-carousel-styles';
  style.textContent=`
  .entry-section[data-door-cycle1]{overflow:visible}
  .entry-section[data-door-cycle1] .section-heading p{max-width:34rem}
  .entry-grid[data-door-carousel]{display:grid!important;grid-template-columns:none!important;grid-auto-flow:column;grid-auto-columns:minmax(19rem,37%);gap:.8rem;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:inline mandatory;scrollbar-width:none;padding:.18rem .2rem 1rem;touch-action:pan-x pan-y;cursor:grab}
  .entry-grid[data-door-carousel].is-dragging{cursor:grabbing;scroll-snap-type:none;user-select:none}
  .entry-grid[data-door-carousel]::-webkit-scrollbar{display:none}
  .entry-grid[data-door-carousel]>.entry-card{display:flex;min-height:31rem;flex-direction:column;padding:0!important;scroll-snap-align:center;scroll-snap-stop:always}
  .entry-grid[data-door-carousel]>.entry-card:hover{transform:none}
  .door-cycle1-visual{position:relative;min-height:18rem;overflow:hidden;background:radial-gradient(circle at 50% 42%,rgba(125,231,255,.08),transparent 46%),linear-gradient(180deg,rgba(11,23,40,.88),rgba(3,7,14,.96))}
  .door-cycle1-visual::before,.door-cycle1-visual::after{position:absolute;left:50%;top:50%;content:"";border:1px solid rgba(245,212,127,.16);transform:translate(-50%,-50%) rotate(45deg)}
  .door-cycle1-visual::before{width:7rem;height:7rem}.door-cycle1-visual::after{width:3.4rem;height:3.4rem;border-color:rgba(125,231,255,.18)}
  .entry-card[data-card="products"] .door-cycle1-visual{background:radial-gradient(circle at 50% 42%,rgba(146,240,197,.13),transparent 46%),linear-gradient(180deg,#0a1a23,#04090e)}
  .entry-card[data-card="laws"] .door-cycle1-visual{background:radial-gradient(circle at 50% 42%,rgba(245,212,127,.13),transparent 46%),linear-gradient(180deg,#17150d,#070704)}
  .entry-card[data-card="governance"] .door-cycle1-visual{background:radial-gradient(circle at 50% 42%,rgba(183,152,255,.13),transparent 46%),linear-gradient(180deg,#141025,#07050d)}
  .entry-card[data-card="home"] .door-cycle1-visual{background:radial-gradient(circle at 50% 42%,rgba(255,216,147,.11),transparent 46%),linear-gradient(180deg,#19140d,#080603)}
  .door-cycle1-copy{display:flex;flex:1;flex-direction:column;padding:1.1rem 1.2rem 1.25rem}
  .door-cycle1-copy .card-index{margin-bottom:.55rem}.door-cycle1-copy h3{margin-bottom:.55rem}.door-cycle1-copy p{margin-bottom:0}.door-cycle1-copy .card-route{margin-top:auto;padding-top:.9rem}
  .entry-card[data-card="frontier"]{border-color:rgba(125,231,255,.36)}
  .entry-card[data-card="frontier"] .frontier-cycle1-stage{min-height:18rem;border-radius:0}
  .door-cycle1-swipe-cue{display:flex;align-items:center;gap:.6rem;margin:.05rem .35rem 0;color:rgba(174,184,201,.72);font-size:.64rem;font-weight:850;letter-spacing:.1em;text-transform:uppercase}
  .door-cycle1-swipe-cue::before,.door-cycle1-swipe-cue::after{height:1px;flex:1;content:"";background:linear-gradient(90deg,transparent,rgba(255,255,255,.11))}.door-cycle1-swipe-cue::after{transform:scaleX(-1)}
  @media(max-width:68rem){.entry-grid[data-door-carousel]{grid-auto-columns:minmax(18rem,58%)}}
  @media(max-width:54rem){.entry-grid[data-door-carousel]{grid-auto-columns:minmax(17rem,84%)}}
  @media(max-width:40rem){.entry-grid[data-door-carousel]{grid-template-columns:none!important;grid-auto-columns:92%;gap:.55rem;padding-inline:.05rem}.entry-grid[data-door-carousel]>.entry-card{min-height:28rem}.door-cycle1-visual,.entry-card[data-card="frontier"] .frontier-cycle1-stage{min-height:15rem}}
  @media(prefers-reduced-motion:reduce){.entry-grid[data-door-carousel]{scroll-behavior:auto}}
  `;
  document.head.append(style);
}

function makeStaticVisual(){
  const visual=document.createElement('div');
  visual.className='door-cycle1-visual';
  visual.setAttribute('aria-hidden','true');
  return visual;
}

function makeCopy(meta, existing=null){
  const copy=document.createElement('div');
  copy.className='door-cycle1-copy';
  const index=document.createElement('span');
  index.className='card-index';
  index.textContent=`${meta.index} · ${meta.name}`;
  const title=document.createElement('h3'); title.textContent=meta.name;
  const paragraph=document.createElement('p'); paragraph.textContent=meta.summary;
  const route=document.createElement('span'); route.className='card-route'; route.textContent=meta.action;
  copy.append(index,title,paragraph,route);
  if(existing){
    const oldParagraph=existing.querySelector('p');
    if(oldParagraph?.textContent?.trim()) paragraph.textContent=oldParagraph.textContent.trim();
  }
  return copy;
}

function makeCard(id,existing=null){
  const meta=CARD_META[id];
  const card=existing || document.createElement('a');
  card.className='entry-card reveal is-visible';
  card.href=meta.route;
  card.dataset.card=id;
  card.dataset.doorLink='';
  card.replaceChildren();
  if(id==='frontier'){
    const stage=document.createElement('div');
    stage.className='frontier-cycle1-stage';
    stage.dataset.frontierCycle1='';
    stage.setAttribute('aria-label','Applied Systems transformation');
    const caption=document.createElement('div');caption.className='frontier-cycle1-caption';
    const left=document.createElement('div');const label=document.createElement('span');label.textContent='Representative slice';const strong=document.createElement('strong');strong.textContent='Applied systems become tangible.';left.append(label,strong);
    const status=document.createElement('span');status.className='frontier-cycle1-status';status.textContent='Frontier · Live';caption.append(left,status);stage.append(caption);card.append(stage);
  } else card.append(makeStaticVisual());
  card.append(makeCopy(meta,existing));
  return card;
}

function findExistingCards(grid){
  const map=new Map();
  for(const card of grid.querySelectorAll(':scope > .entry-card')){
    const href=card.getAttribute('href')||'';
    if(href.startsWith('/products/')) map.set('products',card);
    else if(href.startsWith('/gauges/')) map.set('gauges',card);
    else if(href.startsWith('/laws/')) map.set('laws',card);
  }
  return map;
}

function installCarouselInteraction(grid){
  const reduced=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  grid.tabIndex=0;
  grid.setAttribute('aria-label','Door route carousel');
  grid.addEventListener('keydown',event=>{
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight') return;
    event.preventDefault();
    grid.scrollBy({left:grid.clientWidth*(event.key==='ArrowRight'?0.72:-0.72),behavior:reduced?'auto':'smooth'});
  });
  let dragging=false,startX=0,startScroll=0,moved=0;
  grid.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0) return;
    dragging=true;startX=event.clientX;startScroll=grid.scrollLeft;moved=0;grid.classList.add('is-dragging');grid.setPointerCapture?.(event.pointerId);
  });
  grid.addEventListener('pointermove',event=>{
    if(!dragging) return;
    const delta=event.clientX-startX;moved=Math.max(moved,Math.abs(delta));grid.scrollLeft=startScroll-delta;
  });
  const release=event=>{if(!dragging)return;dragging=false;grid.classList.remove('is-dragging');try{grid.releasePointerCapture?.(event.pointerId)}catch{}};
  grid.addEventListener('pointerup',release);grid.addEventListener('pointercancel',release);
  grid.addEventListener('click',event=>{if(moved>7){event.preventDefault();event.stopPropagation();moved=0;}},true);
}

function mount(){
  const section=document.querySelector('.entry-section');
  const grid=section?.querySelector('.entry-grid');
  if(!section||!grid||grid.dataset.doorCycle1Mounted==='true') return;
  installStyles();
  const existing=findExistingCards(grid);
  const cards=CARD_ORDER.map(id=>makeCard(id,existing.get(id)||null));
  grid.replaceChildren(...cards);
  grid.dataset.doorCarousel='';grid.dataset.doorCycle1Mounted='true';section.dataset.doorCycle1='';
  const eyebrow=section.querySelector('.eyebrow'); if(eyebrow) eyebrow.textContent='Six Door Cards · Cycle 1';
  const heading=section.querySelector('h2'); if(heading) heading.textContent='Sample the estate before you enter.';
  const explanatory=section.querySelector('.section-heading > p'); if(explanatory) explanatory.textContent='Drag or swipe horizontally. Frontier is the first completed animated representative slice; the other five cards remain static until their cycles.';
  const cue=document.createElement('div');cue.className='door-cycle1-swipe-cue';cue.setAttribute('aria-hidden','true');cue.textContent='Drag · Swipe · Left / Right keys';grid.after(cue);
  installCarouselInteraction(grid);
  const frontier=grid.querySelector('[data-frontier-cycle1]'); if(frontier) mountFrontierCycle1(frontier);
  const root=document.documentElement;root.dataset.doorCardCount='6';root.dataset.doorFrontierCycle='closed-candidate';root.dataset.doorOrbitRemoved='false';
  window.DGBDoorTraversal=Object.freeze({contract:CYCLE_ID,doorCards:CARD_ORDER.map(id=>CARD_META[id].name),cycle:1,closedCard:'Frontier',crosswalkProgress:'1/11',frontierGeometrySource:'/showroom/globe/h-earth/render/geometry-kernel.js'});
  window.dispatchEvent(new CustomEvent('DGB_DOOR_CYCLE1_READY',{detail:window.DGBDoorTraversal}));
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
