(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_READINESS_CONTEXT_V1';
if(globalThis[GLOBAL]?.mounted)return;
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const FAMILY_META=Object.freeze({
  trl:Object.freeze({label:'TRL',heading:'Technology Readiness Level',status:'Level 7'}),
  tra:Object.freeze({label:'TRA',heading:'Technology Readiness Assessment',status:'Adversarial'}),
  research:Object.freeze({label:'RESEARCH',heading:'Instrument Research',status:'Active frontier'})
});
const createSlide=({title,provocation,body,href,label,rail=false})=>{
  const article=document.createElement('article');
  article.className='compass-readiness-slide';
  article.dataset.readinessTitle=title;
  if(provocation){const p=document.createElement('p');p.className='compass-readiness-provocation';p.textContent=provocation;article.append(p);}
  if(body){const p=document.createElement('p');p.textContent=body;article.append(p);}
  if(rail){
    const ol=document.createElement('ol');ol.className='compass-readiness-rail';ol.setAttribute('aria-label','Software technology readiness levels 1 through 9');
    for(let i=1;i<=9;i++){const li=document.createElement('li');li.textContent=String(i);if(i<8)li.dataset.attained='';if(i===7)li.setAttribute('aria-current','step');if(i>7)li.dataset.unclaimed='';ol.append(li);}article.append(ol);
  }
  if(href&&label){const a=document.createElement('a');a.href=href;a.textContent=label;article.append(a);}
  return article;
};
const buildCarousel=(type,slides)=>{
  const meta=FAMILY_META[type];
  const section=document.createElement('section');
  section.className='compass-readiness-family';
  section.dataset.readinessFamily=type;
  section.setAttribute('aria-roledescription','carousel');
  section.tabIndex=0;
  const head=document.createElement('header');head.className='compass-readiness-head';
  head.innerHTML=`<div><p>${meta.heading}</p><h3></h3></div><div class="compass-readiness-meta"><span class="compass-readiness-status">${meta.status}</span><span class="compass-readiness-ordinal" aria-live="polite"></span></div>`;
  section.append(head);
  const title=q('h3',head),ordinal=q('.compass-readiness-ordinal',head);
  const innerTabs=document.createElement('div');innerTabs.className='compass-readiness-slide-tabs';innerTabs.setAttribute('role','tablist');innerTabs.setAttribute('aria-label',`${meta.label} carousel slides`);
  const viewport=document.createElement('div');viewport.className='compass-readiness-viewport';
  slides.forEach((slide,i)=>{slide.id=`compass-readiness-${type}-slide-${i+1}`;viewport.append(slide);const tab=document.createElement('button');tab.type='button';tab.className='compass-readiness-slide-tab';tab.setAttribute('role','tab');tab.setAttribute('aria-controls',slide.id);tab.setAttribute('aria-label',slide.dataset.readinessTitle||`Slide ${i+1}`);tab.textContent=String(i+1).padStart(2,'0');innerTabs.append(tab);});
  section.append(innerTabs,viewport);
  let index=0,startX=null;const tabs=[...innerTabs.children];
  const render=()=>{slides.forEach((node,i)=>{const active=i===index,prev=i===(index-1+slides.length)%slides.length,next=i===(index+1)%slides.length;node.dataset.active=active?'true':'false';node.dataset.position=active?'active':prev?'prev':next?'next':'far';node.hidden=false;node.setAttribute('aria-hidden',active?'false':'true');node.toggleAttribute('inert',!active);});tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',active?'true':'false');tab.tabIndex=active?0:-1;});title.textContent=slides[index].dataset.readinessTitle||'';ordinal.textContent=`${index+1} / ${slides.length}`;section.dataset.slide=String(index+1);section.setAttribute('aria-label',`${meta.label}: ${title.textContent}`);};
  const goTo=next=>{index=(next+slides.length)%slides.length;render();};const go=delta=>goTo(index+delta);
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>goTo(i)));
  section.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();go(-1);}else if(event.key==='ArrowRight'){event.preventDefault();go(1);}else if(event.key==='Home'){event.preventDefault();goTo(0);}else if(event.key==='End'){event.preventDefault();goTo(slides.length-1);}else return;if(event.target.closest('.compass-readiness-slide-tabs'))tabs[index].focus();});
  viewport.addEventListener('pointerdown',event=>{if(event.target.closest('a,button'))return;startX=event.clientX;},{passive:true});
  viewport.addEventListener('pointerup',event=>{if(startX===null)return;const dx=event.clientX-startX;startX=null;if(Math.abs(dx)>42)go(dx<0?1:-1);},{passive:true});
  viewport.addEventListener('pointercancel',()=>{startX=null;},{passive:true});
  render();return{section,goTo};
};
function install(){
  const built=q('.compass-built');
  const oldStage=built?.querySelector('.compass-readiness-stage');
  if(!built||!oldStage){requestAnimationFrame(install);return;}
  if(oldStage.dataset.readinessOwner==='context-v1')return;
  const trlSlides=[
    createSlide({title:'Software TRL 7',provocation:'Readiness is not a badge. It is a boundary the system must keep surviving.',body:'Diamond Gate self-assesses the governed software-construction platform at Software TRL 7 against NASA’s published criteria. The claim is bounded, inspectable, and explicit about what it does not establish. TRL 8 and 9 remain unclaimed.',href:'/evidence/readiness/',label:'Inspect the TRL 7 closure matrix →',rail:true}),
    createSlide({title:'Governed construction is operational',provocation:'A change is not complete because code was written.',body:'Authority, bounded mutation, qualification, exact-head publication, and live behavioral verification are separate controlled events. The operating system is designed to keep those transitions distinguishable.',href:'/governance/',label:'Inspect the operating boundary →'}),
    createSlide({title:'Recovery is part of maturity',provocation:'Maturity includes what happens after a test proves us wrong.',body:'Contrary evidence is retained, the defect is traced to its owning layer, the smallest lawful correction is made, and the exact successor is requalified before a live pass is declared.',href:'/evidence/',label:'Follow the evidence trail →'}),
    createSlide({title:'TRL 8 remains a real threshold',provocation:'The next level requires stronger completion evidence—not more confident language.',body:'The formal TRL disposition does not automatically extend to every research claim, experiment, page, or world. Higher readiness requires its own completed verification, validation, documentation, and closure.',href:'/evidence/readiness/',label:'See where the claim stops →'})
  ];
  const traSlides=[
    createSlide({title:'Can the claim survive contact with reality?',provocation:'The assessment is adversarial by design.',body:'Source, behavior, qualification, publication, and live verification are kept separate so a maturity label or success claim cannot outrun the evidence that actually supports it.',href:'/evidence/',label:'Enter the evidence room →'}),
    createSlide({title:'Contrary evidence changes the state',provocation:'A failed browser run is not noise.',body:'A material failure blocks acceptance until the exact defect is explained, corrected at the responsible layer, and reverified. The system is designed to preserve disconfirming evidence rather than explain it away.',href:'/laws/',label:'Read the governing standards →'}),
    createSlide({title:'Authority matters',provocation:'A technically correct patch to the wrong owner is still wrong.',body:'Before mutation, the page traces which controller, state, presentation layer, or publication surface actually owns the behavior. Coherent behavior is preserved; only the demonstrated defect becomes admissible scope.',href:'/governance/',label:'Inspect authority and scope →'}),
    createSlide({title:'Assessment becomes action',provocation:'Evidence should tell us what may lawfully happen next.',body:'Gates, governance, exact-head release, and rendered verification convert diagnosis into bounded operational decisions instead of decorative maturity language.',href:'/gauges/',label:'Open the instruments →'})
  ];
  const researchSlides=[
    createSlide({title:'Condition is not capacity',provocation:'Two systems can look equally stable while possessing very different remaining paths.',body:'The Intrinsic Maneuverability program asks how much admissible, identity-preserving room to move remains—not merely how the current state looks.',href:'/laws/research/methods-and-models/',label:'Open the research program →'}),
    createSlide({title:'The instrument is built to be falsified',provocation:'A serious instrument must make it possible for stronger evidence to defeat it.',body:'Route requirements, factor mappings, temporal windows, comparators, and failure conditions are declared before the result is interpreted. A surviving score is not treated as validation by itself.',href:'/laws/research/methods-and-models/',label:'Inspect methods and limits →'}),
    createSlide({title:'Prospective evidence exists',provocation:'The harder test is not what a system looks like now. It is what happens next.',body:'In a locked agricultural temporal block, CS4 improved held-out error versus current loss alone and current loss plus Varroa, but did not beat the additive Mean4 comparator. The result supports a multidimensional increment, not a multiplication-specific victory.',href:'/laws/research/methods-and-models/',label:'Inspect the bounded result →'}),
    createSlide({title:'The decisive threshold is still ahead',provocation:'Groundbreaking would require more than a promising comparison.',body:'The frontier is whether admissible maneuvering room itself adds reproducible prospective information beyond conventional condition measures and strong additive alternatives, then survives independent replication.',href:'/laws/research/methods-and-models/',label:'See the active frontier →'})
  ];
  const stage=document.createElement('div');stage.className='compass-readiness-stage';stage.dataset.compassReadinessStage='context-v1';stage.dataset.readinessOwner='context-v1';
  const tabs=document.createElement('div');tabs.className='compass-readiness-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Readiness and research family');
  const familyOrder=['trl','tra','research'];const tabMap={};
  familyOrder.forEach(type=>{const tab=document.createElement('button');tab.type='button';tab.className='compass-readiness-tab';tab.setAttribute('role','tab');tab.textContent=FAMILY_META[type].label;tabs.append(tab);tabMap[type]=tab;});
  stage.append(tabs);
  const families={trl:buildCarousel('trl',trlSlides),tra:buildCarousel('tra',traSlides),research:buildCarousel('research',researchSlides)};
  familyOrder.forEach(type=>stage.append(families[type].section));
  const setFamily=type=>{familyOrder.forEach(name=>{const active=name===type;tabMap[name].setAttribute('aria-selected',active?'true':'false');tabMap[name].tabIndex=active?0:-1;families[name].section.hidden=!active;families[name].section.toggleAttribute('inert',!active);});stage.dataset.activeFamily=type;};
  familyOrder.forEach(type=>tabMap[type].addEventListener('click',()=>setFamily(type)));
  tabs.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const current=Math.max(0,familyOrder.indexOf(stage.dataset.activeFamily));let next=current;if(event.key==='Home')next=0;else if(event.key==='End')next=familyOrder.length-1;else next=(current+(event.key==='ArrowRight'?1:-1)+familyOrder.length)%familyOrder.length;const type=familyOrder[next];setFamily(type);tabMap[type].focus();});
  const style=document.createElement('style');style.id='compass-readiness-context-v1-style';style.textContent='[data-readiness-family="research"] .compass-readiness-slide-tab[aria-selected="true"]{border-color:rgba(190,159,255,.62);background:rgba(190,159,255,.10);color:rgba(244,237,255,.98)}[data-readiness-family="research"] .compass-readiness-provocation{border-left-color:rgba(190,159,255,.62);background:linear-gradient(90deg,rgba(190,159,255,.075),transparent)}';document.head.append(style);
  oldStage.replaceWith(stage);setFamily('trl');
  globalThis[GLOBAL]=Object.freeze({mounted:true,version:'context-v1',readinessPresentationOwner:'DGB_COMPASS_READINESS_CONTEXT_V1',retiredStageOwner:'DGB_COMPASS_PRESENTATION_CONVERGENCE_V8_READINESS_ONLY',families:Object.freeze([...familyOrder]),slideCounts:Object.freeze({trl:trlSlides.length,tra:traSlides.length,research:researchSlides.length}),geometryChanged:false,compassStateChanged:false});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(install),{once:true}):requestAnimationFrame(install);
})();
