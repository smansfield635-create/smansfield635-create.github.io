(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_READINESS_CONTEXT_V3';
if(globalThis[GLOBAL]?.mounted)return;
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const FAMILY_ORDER=Object.freeze(['research','trl','tra']);
const stage=q('[data-compass-readiness-static="v2"]');
if(!stage)throw new Error('COMPASS_READINESS_STATIC_MARKUP_MISSING');

/* Gen1722 hierarchy restoration: pre-#2102 readiness authority lived inside Built Different. */
const built=q('.compass-built');
const builtMore=built?.querySelector('.compass-built__more');
if(!built||!builtMore)throw new Error('COMPASS_READINESS_LOWER_PAGE_OWNER_MISSING');
built.insertBefore(stage,builtMore);
stage.dataset.compassReadinessPlacement='built-different-lower-page';

/* Owner-approved mystery language only. Compass runtime/mechanics remain untouched. */
const instruction=q('.compass-instrument > .compass-orbit-intro > p:last-child');
if(instruction)instruction.textContent='The stars do more than guide us to the answers we seek. Bring one forward, tap to see what it reveals, or use the appropriate star as a lens to discover the hidden door.';

/* Methods & Models-derived glass/numeric continuity. Presentation-only; no Compass geometry/runtime ownership. */
const style=document.createElement('style');
style.id='compass-readiness-gen1722-continuity';
style.textContent=`
.compass-built .compass-readiness-stage{position:relative;width:min(100%,72rem);margin:clamp(2.25rem,6vw,4.5rem) auto 1.6rem;padding:clamp(.6rem,1.6vw,1rem);border:1px solid rgba(210,229,235,.11);border-radius:1.65rem;background:linear-gradient(145deg,rgba(9,22,31,.28),rgba(3,11,18,.12));box-shadow:0 28px 90px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.055);backdrop-filter:blur(15px) saturate(1.08);-webkit-backdrop-filter:blur(15px) saturate(1.08);overflow:visible!important}
.compass-built .compass-readiness-stage::before{content:"";position:absolute;inset:-12% 6% 24%;z-index:-1;pointer-events:none;background:radial-gradient(ellipse at 50% 18%,rgba(99,196,216,.10),rgba(189,158,246,.045) 38%,transparent 70%);filter:blur(18px)}
.compass-built .compass-readiness-tabs{gap:.34rem;margin:0 auto 1rem;padding:.28rem;width:fit-content;max-width:100%;border:1px solid rgba(209,227,233,.10);border-radius:999px;background:rgba(2,10,16,.22);backdrop-filter:blur(12px)}
.compass-built .compass-readiness-tab{min-height:38px;padding:.55rem .9rem;border-color:transparent!important;background:transparent!important;color:rgba(218,229,229,.58)!important}
.compass-built .compass-readiness-tab[aria-selected="true"]{border-color:rgba(240,213,139,.30)!important;background:linear-gradient(135deg,rgba(244,214,128,.14),rgba(101,202,222,.06))!important;color:rgba(255,245,214,.98)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 8px 25px rgba(0,0,0,.16)}
.compass-built .compass-readiness-family{padding:clamp(1rem,2.3vw,1.45rem)!important;border:1px solid rgba(210,228,234,.11)!important;border-radius:1.4rem!important;background:linear-gradient(145deg,rgba(14,30,40,.38),rgba(4,13,21,.20))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.045)!important;backdrop-filter:blur(16px) saturate(1.12);-webkit-backdrop-filter:blur(16px) saturate(1.12)}
.compass-built .compass-readiness-slide-tabs{gap:.28rem;margin:.1rem 0 .65rem}
.compass-built .compass-readiness-slide-tab{width:38px;min-width:38px;height:38px;min-height:38px;padding:0;border-radius:50%!important;border:1px solid rgba(211,229,234,.12)!important;background:rgba(3,12,19,.22)!important;color:rgba(215,229,231,.48)!important;font-size:.62rem!important;letter-spacing:.03em;backdrop-filter:blur(10px)}
.compass-built .compass-readiness-slide-tab[aria-selected="true"]{border-color:rgba(244,214,128,.54)!important;background:rgba(244,214,128,.12)!important;color:rgba(255,244,207,.98)!important;box-shadow:0 0 0 3px rgba(244,214,128,.035),0 9px 25px rgba(0,0,0,.18)}
.compass-built [data-readiness-family="research"] .compass-readiness-slide-tab[aria-selected="true"]{border-color:rgba(190,159,255,.58)!important;background:rgba(190,159,255,.12)!important;color:#f4edff!important}
.compass-built [data-readiness-family="tra"] .compass-readiness-slide-tab[aria-selected="true"]{border-color:rgba(104,209,229,.58)!important;background:rgba(104,209,229,.11)!important;color:#def7fa!important}
.compass-built .compass-readiness-viewport{min-height:26rem!important;overflow:visible!important}
.compass-built .compass-readiness-slide{width:min(76%,690px)!important;min-height:18.5rem!important;border:1px solid rgba(211,229,234,.11)!important;border-radius:1.35rem!important;background:linear-gradient(145deg,rgba(18,37,48,.60),rgba(5,16,24,.38))!important;box-shadow:0 24px 66px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.055)!important;backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}
.compass-built .compass-readiness-slide[data-position="prev"],.compass-built .compass-readiness-slide[data-position="next"]{opacity:.28!important;filter:saturate(.72) brightness(.68)!important}
.compass-built .compass-readiness-slide[data-position="prev"]{transform:translate(-50%,-50%) translateX(-67%) scale(.86) rotateY(6deg)!important}
.compass-built .compass-readiness-slide[data-position="next"]{transform:translate(-50%,-50%) translateX(67%) scale(.86) rotateY(-6deg)!important}
.compass-built .compass-readiness-provocation{background:linear-gradient(90deg,rgba(244,214,128,.065),transparent)!important}
@media(max-width:620px){.compass-built .compass-readiness-stage{margin-top:2.5rem;padding:.55rem;border-radius:1.25rem}.compass-built .compass-readiness-family{padding:.8rem!important}.compass-built .compass-readiness-viewport{min-height:29rem!important}.compass-built .compass-readiness-slide{width:84%!important;min-height:21rem!important}.compass-built .compass-readiness-slide[data-position="prev"]{transform:translate(-50%,-50%) translateX(-82%) scale(.8)!important}.compass-built .compass-readiness-slide[data-position="next"]{transform:translate(-50%,-50%) translateX(82%) scale(.8)!important}}
@media(prefers-reduced-motion:reduce){.compass-built .compass-readiness-slide{transition:none!important}}
`;
document.head.append(style);

const familyTabs=qa(':scope > .compass-readiness-tabs > .compass-readiness-tab',stage);
const families=Object.fromEntries(FAMILY_ORDER.map(type=>[type,q(`:scope > [data-readiness-family="${type}"]`,stage)]));
if(familyTabs.length!==3||FAMILY_ORDER.some(type=>!families[type]))throw new Error('COMPASS_READINESS_STATIC_STRUCTURE_INVALID');
const tabMap=Object.fromEntries(FAMILY_ORDER.map((type,index)=>[type,familyTabs[index]]));
function wireCarousel(type){
  const section=families[type],slides=qa('.compass-readiness-slide',section),tabs=qa('.compass-readiness-slide-tab',section),title=q('.compass-readiness-head h3',section),ordinal=q('.compass-readiness-ordinal',section),viewport=q('.compass-readiness-viewport',section);
  if(slides.length!==4||tabs.length!==4||!title||!ordinal||!viewport)throw new Error(`COMPASS_${type.toUpperCase()}_STATIC_CAROUSEL_INVALID`);
  let index=Math.max(0,slides.findIndex(node=>node.dataset.position==='active')),startX=null;
  const render=()=>{const n=slides.length;slides.forEach((node,i)=>{const active=i===index,prev=i===(index-1+n)%n,next=i===(index+1)%n;node.dataset.active=active?'true':'false';node.dataset.position=active?'active':prev?'prev':next?'next':'far';node.hidden=false;node.setAttribute('aria-hidden',active?'false':'true');node.toggleAttribute('inert',!active);});tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',active?'true':'false');tab.tabIndex=active?0:-1;});title.textContent=slides[index].dataset.readinessTitle||title.textContent;ordinal.textContent=`${index+1} / ${n}`;section.dataset.slide=String(index+1);};
  const goTo=value=>{index=(value+slides.length)%slides.length;render();};
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>goTo(i)));
  section.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();goTo(index-1);}else if(event.key==='ArrowRight'){event.preventDefault();goTo(index+1);}else if(event.key==='Home'){event.preventDefault();goTo(0);}else if(event.key==='End'){event.preventDefault();goTo(slides.length-1);}else return;if(event.target.closest('.compass-readiness-slide-tabs'))tabs[index].focus();});
  viewport.addEventListener('pointerdown',event=>{if(event.target.closest('a,button'))return;startX=event.clientX;},{passive:true});viewport.addEventListener('pointerup',event=>{if(startX===null)return;const dx=event.clientX-startX;startX=null;if(Math.abs(dx)>42)goTo(index+(dx<0?1:-1));},{passive:true});viewport.addEventListener('pointercancel',()=>{startX=null;},{passive:true});render();return{slides,tabs,goTo};
}
const carousel=Object.fromEntries(FAMILY_ORDER.map(type=>[type,wireCarousel(type)]));
function setFamily(type){if(!FAMILY_ORDER.includes(type))return;FAMILY_ORDER.forEach(name=>{const active=name===type;tabMap[name].setAttribute('aria-selected',active?'true':'false');tabMap[name].tabIndex=active?0:-1;families[name].hidden=!active;families[name].toggleAttribute('inert',!active);});stage.dataset.activeFamily=type;}
FAMILY_ORDER.forEach(type=>tabMap[type].addEventListener('click',()=>setFamily(type)));
q(':scope > .compass-readiness-tabs',stage).addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const current=Math.max(0,FAMILY_ORDER.indexOf(stage.dataset.activeFamily));let next=current;if(event.key==='Home')next=0;else if(event.key==='End')next=FAMILY_ORDER.length-1;else next=(current+(event.key==='ArrowRight'?1:-1)+FAMILY_ORDER.length)%FAMILY_ORDER.length;const type=FAMILY_ORDER[next];setFamily(type);tabMap[type].focus();});
setFamily('research');stage.dataset.readinessOwner='context-v3';
globalThis.DGB_COMPASS_READINESS_CONTEXT_V1=globalThis[GLOBAL]=Object.freeze({mounted:true,version:'context-v3-gen1722',readinessPresentationOwner:'STATIC_MARKUP_PLUS_DGB_COMPASS_READINESS_CONTEXT_V3',placementOwner:'COMPASS_BUILT_DIFFERENT_LOWER_PAGE',familyOrder:FAMILY_ORDER,defaultFamily:'research',defaultResearchCard:'Agentic Frontier',slideCounts:Object.freeze({research:4,trl:4,tra:4}),stageReplacement:false,initialStateInMarkup:true,geometryChanged:false,compassStateChanged:false,protectedCompassRuntimeChanged:false});
})();
