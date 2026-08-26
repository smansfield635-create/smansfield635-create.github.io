(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_READINESS_CONTEXT_V2';
if(globalThis[GLOBAL]?.mounted)return;
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const FAMILY_ORDER=Object.freeze(['research','trl','tra']);
const stage=q('[data-compass-readiness-static="v2"]');
if(!stage)throw new Error('COMPASS_READINESS_STATIC_MARKUP_MISSING');
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
setFamily('research');stage.dataset.readinessOwner='context-v2';
globalThis.DGB_COMPASS_READINESS_CONTEXT_V1=globalThis[GLOBAL]=Object.freeze({mounted:true,version:'context-v2',readinessPresentationOwner:'STATIC_MARKUP_PLUS_DGB_COMPASS_READINESS_CONTEXT_V2',familyOrder:FAMILY_ORDER,defaultFamily:'research',defaultResearchCard:'Agentic Frontier',slideCounts:Object.freeze({research:4,trl:4,tra:4}),stageReplacement:false,initialStateInMarkup:true,geometryChanged:false,compassStateChanged:false});
})();
