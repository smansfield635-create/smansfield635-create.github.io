(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_PRESENTATION_RETIREMENT_V2';
if(globalThis[GLOBAL]?.mounted)return;
const state={root:null};
function retireLegacyPresentation(){
  const root=state.root||document.querySelector('[data-compass-root]');
  if(!root)return;
  document.querySelectorAll('link[data-compass-identity-style]').forEach(node=>node.remove());
  root.querySelectorAll('[data-compass-identity-bounded],.compass-identity-3d').forEach(node=>node.remove());
  const title=root.querySelector('#compass-title');
  if(title){title.hidden=false;title.removeAttribute('aria-hidden');}
  delete root.dataset.studioIdentity;
  root.dataset.compassIdentityPolicy='canonical-static-title';
}
function installNarrowStyle(){
  document.getElementById('compass-bounded-presentation-style-v2')?.remove();
  document.getElementById('compass-runtime-retirement-style-v1')?.remove();
  document.getElementById('compass-runtime-retirement-style-v2')?.remove();
  if(document.getElementById('compass-presentation-convergence-style-v3'))return;
  const style=document.createElement('style');style.id='compass-presentation-convergence-style-v3';
  style.textContent=`
.compass-estate__header{min-height:0!important;height:auto!important;padding-top:clamp(1rem,3vw,2rem)!important;padding-bottom:clamp(.65rem,1.6vw,1.1rem)!important}
.compass-statement-orbit{min-height:6.2rem!important;margin:clamp(.75rem,2vw,1.35rem) auto .35rem!important}
.compass-editorial-intro{margin-top:clamp(.45rem,1.2vw,.8rem)!important;margin-bottom:clamp(.75rem,1.8vw,1.15rem)!important}
.compass-instrument{padding:clamp(.8rem,2.2vw,1.35rem)!important;border:1px solid rgba(124,220,255,.16)!important;border-radius:clamp(1.25rem,2.6vw,2rem)!important;background:linear-gradient(145deg,rgba(4,12,19,.64),rgba(5,11,18,.38))!important;box-shadow:0 22px 64px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.045)!important}
.compass-orbit-intro{width:min(100%,900px)!important;margin:0 auto clamp(.75rem,1.8vw,1.1rem)!important;padding:clamp(.9rem,2vw,1.25rem) clamp(1rem,2.5vw,1.45rem)!important;border:1px solid rgba(216,184,106,.15)!important;border-radius:1rem!important;background:linear-gradient(135deg,rgba(216,184,106,.045),rgba(102,205,224,.035))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important}
.compass-guidance,[data-compass-guidance]{position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:14px!important;z-index:20!important;width:min(calc(100% - 32px),720px)!important;height:auto!important;min-height:42px!important;margin:0!important;padding:10px 14px!important;overflow:visible!important;clip:auto!important;clip-path:none!important;white-space:normal!important;border:1px solid rgba(124,220,255,.22)!important;border-radius:999px!important;background:rgba(3,9,16,.88)!important;box-shadow:0 12px 34px rgba(0,0,0,.30)!important;color:rgba(239,245,241,.94)!important;font:800 clamp(.7rem,1.45vw,.82rem)/1.35 Inter,ui-sans-serif,system-ui,sans-serif!important;text-align:center!important;transform:translateX(-50%)!important;opacity:1!important;visibility:visible!important;pointer-events:none!important}
/* Mirrorland entrances are part of the threshold, not a detached panel. */
.compass-scene{position:relative!important;overflow:hidden!important}
.compass-mirrorland-routes.compass-mirrorland-threshold-routes{position:absolute!important;left:50%!important;top:50%!important;z-index:34!important;width:min(88%,640px)!important;margin:0!important;padding:clamp(.8rem,2vw,1.15rem)!important;transform:translate(-50%,-42%)!important;border:1px solid rgba(244,214,128,.30)!important;border-radius:1.35rem!important;background:radial-gradient(circle at 50% 12%,rgba(244,214,128,.12),transparent 42%),linear-gradient(145deg,rgba(4,10,18,.44),rgba(5,17,25,.78))!important;box-shadow:0 28px 80px rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.09)!important;backdrop-filter:blur(8px)!important;text-align:center!important;pointer-events:auto!important}
.compass-mirrorland-routes.compass-mirrorland-threshold-routes[hidden]{display:none!important}
.compass-mirrorland-threshold-routes>.compass-estate__kicker{margin:.1rem 0 .15rem!important;color:rgba(244,214,128,.94)!important;letter-spacing:.18em!important}
.compass-mirrorland-threshold-routes>h3{margin:.15rem auto .8rem!important;font-family:var(--font-display,Georgia,serif)!important;font-size:clamp(1.35rem,3vw,2.15rem)!important;line-height:1.03!important;color:rgba(255,249,230,.98)!important}
.compass-mirrorland-threshold-routes nav{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:.62rem!important;align-items:stretch!important}
.compass-mirrorland-threshold-routes a{position:relative!important;display:grid!important;align-content:end!important;min-height:7.2rem!important;padding:1rem .75rem!important;border:1px solid rgba(248,222,147,.28)!important;border-radius:1rem!important;color:rgba(255,249,230,.98)!important;background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(8,20,29,.64))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 12px 32px rgba(0,0,0,.26)!important;text-decoration:none!important;font:850 clamp(.72rem,1.55vw,.88rem)/1.2 Inter,ui-sans-serif,system-ui,sans-serif!important;letter-spacing:.06em!important;text-transform:uppercase!important;overflow:hidden!important;transition:transform .18s ease,border-color .18s ease,background .18s ease,box-shadow .18s ease!important}
.compass-mirrorland-threshold-routes a::before{content:attr(data-threshold-kicker);position:absolute;left:.75rem;top:.72rem;color:rgba(151,224,239,.86);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase}
.compass-mirrorland-threshold-routes a:hover,.compass-mirrorland-threshold-routes a:focus-visible{transform:translateY(-2px)!important;border-color:rgba(248,222,147,.72)!important;background:linear-gradient(180deg,rgba(244,214,128,.10),rgba(8,20,29,.72))!important;box-shadow:0 18px 42px rgba(0,0,0,.36),0 0 28px rgba(244,214,128,.08)!important;outline:none!important}
.compass-mirrorland-threshold-routes a[data-threshold-return]{grid-column:1/-1!important;min-height:auto!important;padding:.58rem .8rem!important;border-color:rgba(147,215,231,.18)!important;background:rgba(3,10,16,.44)!important;color:rgba(218,232,234,.78)!important;font-size:.68rem!important;letter-spacing:.08em!important}
.compass-mirrorland-threshold-routes a[data-threshold-return]::before{content:none!important}
/* Readiness and assessment become two distinct evidence instruments. */
.compass-built{overflow:visible!important}
.compass-proof-orbit[data-proof-orbit]{display:none!important}
.compass-readiness-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(.85rem,2vw,1.2rem);margin-top:1.25rem}
.compass-readiness-carousel{position:relative;overflow:hidden;padding:clamp(1rem,2.6vw,1.4rem);border:1px solid rgba(211,225,233,.18);border-radius:1.15rem;background:linear-gradient(150deg,rgba(15,29,40,.82),rgba(6,15,23,.72));box-shadow:0 22px 54px rgba(0,0,0,.27),inset 0 1px 0 rgba(255,255,255,.07);min-height:22rem}
.compass-readiness-carousel[data-readiness-carousel="trl"]{border-color:rgba(244,214,128,.26)}
.compass-readiness-carousel[data-readiness-carousel="tra"]{border-color:rgba(104,209,229,.24)}
.compass-readiness-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:.8rem}
.compass-readiness-head p{margin:0!important;color:rgba(244,214,128,.88)!important;font:800 .66rem/1.2 Inter,ui-sans-serif,system-ui,sans-serif!important;letter-spacing:.16em!important;text-transform:uppercase!important}
.compass-readiness-head h3{margin:.18rem 0 0!important;font-family:var(--font-display,Georgia,serif)!important;font-size:clamp(1.5rem,3vw,2.35rem)!important;line-height:1!important;color:rgba(255,248,229,.98)!important}
.compass-readiness-status{flex:0 0 auto;padding:.35rem .52rem;border:1px solid rgba(244,214,128,.24);border-radius:999px;background:rgba(244,214,128,.055);color:rgba(255,244,210,.88);font:800 .62rem/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase}
.compass-readiness-viewport{position:relative;min-height:14.8rem}
.compass-readiness-slide{display:none;align-content:start;gap:.7rem;min-height:14.8rem;padding:.35rem 0}
.compass-readiness-slide[data-active="true"]{display:grid}
.compass-readiness-slide strong{display:block;max-width:24ch;font-family:var(--font-display,Georgia,serif);font-size:clamp(1.22rem,2.5vw,1.75rem);line-height:1.08;color:rgba(255,249,231,.98)}
.compass-readiness-slide p{margin:0!important;max-width:58ch!important;color:rgba(226,234,232,.84)!important;font-size:clamp(.85rem,1.55vw,.96rem)!important;line-height:1.55!important}
.compass-readiness-slide .compass-readiness-provocation{padding:.72rem .82rem;border-left:2px solid rgba(244,214,128,.52);border-radius:.15rem .75rem .75rem .15rem;background:linear-gradient(90deg,rgba(244,214,128,.07),transparent);color:rgba(255,244,211,.96)!important;font-weight:760!important}
.compass-readiness-slide a{display:inline-flex;width:fit-content;margin-top:.15rem;padding:.58rem .74rem;border:1px solid rgba(145,219,235,.22);border-radius:.7rem;color:rgba(223,246,250,.94);text-decoration:none;font-weight:850}
.compass-readiness-slide a:hover,.compass-readiness-slide a:focus-visible{border-color:rgba(244,214,128,.58);color:#fff5d1;outline:none}
.compass-readiness-controls{display:flex;align-items:center;justify-content:space-between;gap:.65rem;margin-top:.8rem;padding-top:.7rem;border-top:1px solid rgba(211,225,233,.10)}
.compass-readiness-controls button{min-width:42px;min-height:38px;padding:.4rem .65rem;border:1px solid rgba(211,225,233,.17);border-radius:.7rem;background:rgba(4,13,20,.55);color:rgba(234,242,239,.9);font:850 .7rem/1 Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer}
.compass-readiness-dots{display:flex;justify-content:center;gap:.38rem;flex:1}
.compass-readiness-dots button{min-width:8px!important;width:8px!important;min-height:8px!important;height:8px!important;padding:0!important;border-radius:50%!important;border:0!important;background:rgba(211,225,233,.24)!important}
.compass-readiness-dots button[aria-current="true"]{background:rgba(244,214,128,.92)!important;box-shadow:0 0 14px rgba(244,214,128,.24)!important}
.compass-readiness-rail{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:.22rem;margin:.2rem 0 .35rem;padding:0;list-style:none}
.compass-readiness-rail li{display:grid;place-items:center;min-height:1.65rem;border:1px solid rgba(211,225,233,.14);border-radius:.42rem;color:rgba(215,226,224,.58);font:850 .64rem/1 Inter,ui-sans-serif,system-ui,sans-serif}
.compass-readiness-rail li[data-attained]{border-color:rgba(244,214,128,.22);color:rgba(245,226,169,.78);background:rgba(244,214,128,.035)}
.compass-readiness-rail li[aria-current="step"]{border-color:rgba(244,214,128,.72);background:rgba(244,214,128,.13);color:#fff1bf;box-shadow:0 0 18px rgba(244,214,128,.10)}
/* One architectural language for lower-page entrances. */
.compass-monuments,.compass-build-cta{border:1px solid rgba(130,210,228,.14)!important;border-radius:1.35rem!important;background:linear-gradient(145deg,rgba(5,14,22,.54),rgba(6,16,23,.30))!important;box-shadow:0 22px 58px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.035)!important}
.compass-monuments{padding:clamp(.85rem,2vw,1.15rem)!important}
.compass-build-cta{padding:clamp(1rem,2.4vw,1.35rem)!important;margin-top:clamp(1rem,2.2vw,1.4rem)!important}
@media(max-width:900px){.compass-readiness-pair{grid-template-columns:1fr}.compass-readiness-carousel{min-height:0}.compass-readiness-viewport,.compass-readiness-slide{min-height:13rem}}
@media(max-width:820px){.compass-instrument{padding:.65rem!important}.compass-orbit-intro{padding:.85rem .8rem!important}.compass-guidance,[data-compass-guidance]{bottom:10px!important;width:calc(100% - 22px)!important;border-radius:16px!important;font-size:.7rem!important}.compass-mirrorland-threshold-routes{width:calc(100% - 24px)!important;transform:translate(-50%,-45%)!important}.compass-mirrorland-threshold-routes nav{grid-template-columns:1fr!important}.compass-mirrorland-threshold-routes a{min-height:4.6rem!important}.compass-mirrorland-threshold-routes a[data-threshold-return]{grid-column:auto!important}}
@media(max-width:560px){.compass-orbit-intro>p:not(.compass-estate__kicker){font-size:.88rem!important;line-height:1.45!important}.compass-built__lead{font-size:.9rem!important;line-height:1.48!important}.compass-readiness-carousel{padding:.9rem!important}.compass-readiness-slide{min-height:12rem}.compass-readiness-head h3{font-size:1.5rem!important}}
`;
  document.head.append(style);
}
function integrateMirrorlandThreshold(){
  const root=state.root;
  const scene=root?.querySelector('[data-compass-scene]');
  const routes=root?.querySelector('[data-compass-mirrorland-routes]');
  if(!scene||!routes)return false;
  routes.classList.add('compass-mirrorland-threshold-routes');
  routes.setAttribute('data-presentation-owner','compass-presentation-convergence-v3');
  const links=[...routes.querySelectorAll('a')];
  const kickers=['Story','World','Atlas'];
  links.forEach((link,index)=>{
    if(link.hasAttribute('data-compass-mirrorland-inline-back')){
      link.setAttribute('data-threshold-return','true');
      link.removeAttribute('data-threshold-kicker');
    }else{
      link.setAttribute('data-threshold-kicker',kickers[index]||'Enter');
    }
  });
  const windowMount=scene.querySelector('[data-compass-mirrorland-window-mount]');
  if(windowMount)windowMount.insertAdjacentElement('afterend',routes);else scene.append(routes);
  return true;
}
function createSlide({title,body,provocation,href,label,rail}){
  const article=document.createElement('article');article.className='compass-readiness-slide';
  const strong=document.createElement('strong');strong.textContent=title;article.append(strong);
  if(provocation){const p=document.createElement('p');p.className='compass-readiness-provocation';p.textContent=provocation;article.append(p);}
  if(body){const p=document.createElement('p');p.textContent=body;article.append(p);}
  if(rail){const ol=document.createElement('ol');ol.className='compass-readiness-rail';ol.setAttribute('aria-label','Software technology readiness levels 1 through 9');for(let i=1;i<=9;i++){const li=document.createElement('li');li.textContent=String(i);if(i<8)li.dataset.attained='';if(i===7)li.setAttribute('aria-current','step');if(i>7)li.dataset.unclaimed='';ol.append(li);}article.append(ol);}
  if(href&&label){const a=document.createElement('a');a.href=href;a.textContent=label;article.append(a);}
  return article;
}
function buildCarousel(type,title,status,slides){
  const section=document.createElement('section');section.className='compass-readiness-carousel';section.dataset.readinessCarousel=type;section.setAttribute('aria-label',title);
  const head=document.createElement('header');head.className='compass-readiness-head';head.innerHTML=`<div><p>${type==='trl'?'Technology Readiness Level':'Technology Readiness Assessment'}</p><h3>${title}</h3></div><span class="compass-readiness-status">${status}</span>`;section.append(head);
  const viewport=document.createElement('div');viewport.className='compass-readiness-viewport';slides.forEach((slide,index)=>{slide.dataset.active=index===0?'true':'false';slide.setAttribute('aria-hidden',index===0?'false':'true');viewport.append(slide)});section.append(viewport);
  const controls=document.createElement('div');controls.className='compass-readiness-controls';
  const prev=document.createElement('button');prev.type='button';prev.textContent='Previous';prev.setAttribute('aria-label',`Previous ${title} slide`);
  const next=document.createElement('button');next.type='button';next.textContent='Next';next.setAttribute('aria-label',`Next ${title} slide`);
  const dots=document.createElement('div');dots.className='compass-readiness-dots';
  let index=0;const render=()=>{[...viewport.children].forEach((node,i)=>{node.dataset.active=i===index?'true':'false';node.setAttribute('aria-hidden',i===index?'false':'true')});[...dots.children].forEach((node,i)=>node.setAttribute('aria-current',i===index?'true':'false'))};
  slides.forEach((_,i)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`Show ${title} slide ${i+1}`);dot.addEventListener('click',()=>{index=i;render()});dots.append(dot)});
  prev.addEventListener('click',()=>{index=(index-1+slides.length)%slides.length;render()});next.addEventListener('click',()=>{index=(index+1)%slides.length;render()});
  controls.append(prev,dots,next);section.append(controls);render();return section;
}
function installReadinessPair(){
  const built=state.root?.querySelector('.compass-built');
  const orbit=built?.querySelector('[data-proof-orbit]');
  if(!built||!orbit||built.querySelector('.compass-readiness-pair'))return false;
  const trlSlides=[
    createSlide({title:'Software TRL 7',provocation:'This is not a prototype claim. It is a bounded claim that the software has been demonstrated in an operationally relevant environment.',body:'Diamond Gate self-assesses the governed software-construction platform at Software TRL 7 against NASA’s published criteria. TRL 8 and 9 remain explicitly unclaimed.',href:'/evidence/readiness/',label:'Inspect the TRL 7 closure matrix →',rail:true}),
    createSlide({title:'Where the claim stops',provocation:'A mature system is easier to trust when it tells you exactly what it has not proven.',body:'No NASA endorsement. No universal scientific validation. No claim that every page or experiment has reached the same maturity. The boundary is part of the evidence.',href:'/governance/',label:'Inspect the governing boundary →'}),
    createSlide({title:'What would justify TRL 8?',provocation:'The next level is not awarded by optimism. It requires stronger completion evidence.',body:'The open question is whether the full operational system can close its remaining qualification boundaries repeatedly enough to justify a higher readiness disposition.',href:'/evidence/',label:'Follow the evidence trail →'})
  ];
  const traSlides=[
    createSlide({title:'Can the readiness claim survive inspection?',provocation:'TRA is the adversarial companion to TRL: not “what level do we want?” but “what evidence would make that level defensible?”',body:'The assessment separates source claims, rendered behavior, exact-head publication, and live verification so a maturity label cannot outrun the evidence.',href:'/evidence/',label:'Enter the evidence room →'}),
    createSlide({title:'Candidate is not release',provocation:'Qualification, merge, deployment, and live verification are four different events.',body:'Diamond Gate keeps those transitions separate so a successful build cannot quietly masquerade as a verified public result.',href:'/governance/',label:'Inspect governance →'}),
    createSlide({title:'The contrary evidence matters',provocation:'A failed browser run is not noise. It is evidence against the current claim until the exact defect is resolved.',body:'Assessment records are most useful when they preserve failure boundaries, stale assumptions, and the conditions under which a result should be rejected.',href:'/laws/',label:'Read the governing standards →'}),
    createSlide({title:'From assessment to instrument',provocation:'The point is not to admire a score. The point is to know what can lawfully happen next.',body:'Gauges, laws, governance, and evidence development turn assessment into bounded operational decisions instead of decorative maturity language.',href:'/gauges/',label:'Open the instruments →'})
  ];
  const pair=document.createElement('div');pair.className='compass-readiness-pair';pair.dataset.compassReadinessPair='trl-tra';pair.append(buildCarousel('trl','TRL · Maturity of the system','Level 7',trlSlides),buildCarousel('tra','TRA · Strength of the claim','Inspectable',traSlides));
  orbit.insertAdjacentElement('afterend',pair);
  return true;
}
function unifyLowerEstate(){
  state.root?.querySelector('.compass-monuments')?.setAttribute('data-estate-surface','entrances');
  state.root?.querySelector('.compass-build-cta')?.setAttribute('data-estate-surface','construction');
}
function mount(){
  state.root=document.querySelector('[data-compass-root]');if(!state.root)return;
  retireLegacyPresentation();
  installNarrowStyle();
  const thresholdIntegrated=integrateMirrorlandThreshold();
  const readinessIntegrated=installReadinessPair();
  unifyLowerEstate();
  globalThis[GLOBAL]=Object.freeze({
    mounted:true,
    version:'presentation-convergence-v3',
    legacyIdentityRetired:true,
    mirrorlandInteractionOwner:'DGB_COMPASS_CONTROLLER',
    mirrorlandPresentationOwner:'DGB_COMPASS_PRESENTATION_CONVERGENCE_V3',
    readinessPresentationOwner:'DGB_COMPASS_PRESENTATION_CONVERGENCE_V3',
    guidanceOwner:'DGB_COMPASS_CONTROLLER',
    thresholdIntegrated,
    readinessIntegrated,
    broadPresentationOwnership:false
  });
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();
