(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_READINESS_CONTEXT_V2';
if(globalThis[GLOBAL]?.mounted)return;
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const FAMILY_ORDER=Object.freeze(['research','trl','tra']);
const FAMILY_META=Object.freeze({
  research:Object.freeze({label:'RESEARCH',heading:'Current Research Frontier',status:'Active frontier'}),
  trl:Object.freeze({label:'TRL',heading:'Technology Readiness Level',status:'Level 7'}),
  tra:Object.freeze({label:'TRA',heading:'Technology Readiness Assessment',status:'Level 4 · Benchmarked'})
});
const DATA=Object.freeze({
  research:Object.freeze([
    Object.freeze({title:'Agentic Frontier',provocation:'The research question is no longer whether an agent can write code. It is whether governed agency can remain inspectable while substantial work keeps moving.',body:'Diamond Gate is testing single-operator, multi-agent software production under explicit authority, exact-state identity, qualification, provenance, recovery, and publication controls. The corrected 906-PR audit records 699 material PRs: 17 PARAMOUNT + 682 STANDARD.',href:'/evidence/agentic-frontier/',label:'Open the Agentic Software Frontier →'}),
    Object.freeze({title:'AF-IR-01 controlled comparison',provocation:'One controlled data point can constrain a claim without pretending to settle the field.',body:'Under the frozen common task/model/runtime/verifier conditions tested in AF-IR-01, the Diamond Gate lane passed while the stock OpenHands lane ended FAIL/INACTIVE. That result is explicitly limited to the tested comparison.',href:'/evidence/agentic-frontier/#inspect',label:'Inspect the comparison boundary →'}),
    Object.freeze({title:'Multi-agent coordination is documented',provocation:'Many agents are useful only if their authority and state do not blur together.',body:'Repository-native routing, single-flight locks, independent verifier roles, exact-head rebinding, handoffs, and recovery preserve a documented collaboration topology under one operator. Efficiency improvement remains a separate unproven question.',href:'/evidence/agentic-frontier/',label:'See the coordination architecture →'}),
    Object.freeze({title:'The limits stay visible',provocation:'A frontier claim becomes stronger when the missing evidence is kept in view.',body:'The original v0 audit survives only as aggregate totals, so row-level agreement, Cohen’s kappa, and a disagreement ledger cannot legitimately be reconstructed. External validation and a larger frozen comparative battery remain ahead.',href:'/evidence/agentic-frontier/',label:'Read the methodological limits →'})
  ]),
  trl:Object.freeze([
    Object.freeze({title:'Software TRL 7',provocation:'Readiness is not a badge. It is a boundary the system must keep surviving.',body:'Diamond Gate self-assesses the governed software-construction platform at Software TRL 7 against NASA’s published criteria. The claim is bounded and inspectable; TRL 8 and 9 remain unclaimed.',href:'/evidence/readiness/',label:'Inspect the TRL 7 closure matrix →',rail:true}),
    Object.freeze({title:'Governed construction is operational',provocation:'A change is not complete because code was written.',body:'Authority, bounded mutation, qualification, approved commit, deployment, and live behavioral verification remain separate controlled events.',href:'/governance/',label:'Inspect the operating boundary →'}),
    Object.freeze({title:'Recovery is part of maturity',provocation:'Maturity includes what happens after a test proves us wrong.',body:'Contrary evidence is retained, the defect is traced to its owning layer, the smallest lawful correction is made, and the exact successor is requalified before a live pass is declared.',href:'/evidence/',label:'Follow the evidence trail →'}),
    Object.freeze({title:'TRL 8 remains a real threshold',provocation:'The next level requires stronger completion evidence—not more confident language.',body:'Complete and stable system-wide verification and validation is a different threshold from frontier sophistication or throughput. Higher readiness remains unclaimed until that threshold is satisfied.',href:'/evidence/readiness/',label:'See where the claim stops →'})
  ]),
  tra:Object.freeze([
    Object.freeze({title:'Level 4 · BENCHMARKED',provocation:'The evidence base is benchmarked, but it is not yet externally validated.',body:'The completed material-work audit and controlled experiments strengthen the Level-4 assessment. Level 5 remains dependent on genuine external validation rather than additional internal confidence.',href:'/evidence/',label:'Enter the evidence room →'}),
    Object.freeze({title:'Contrary evidence changes the state',provocation:'A failed browser run is not noise.',body:'A material failure blocks acceptance until the exact defect is explained, corrected at the responsible layer, and reverified. Disconfirming evidence is preserved rather than explained away.',href:'/laws/',label:'Read the governing standards →'}),
    Object.freeze({title:'Authority matters',provocation:'A technically correct patch to the wrong owner is still wrong.',body:'Before mutation, the repository traces which controller, state, presentation layer, or publication surface owns the behavior. Only the demonstrated defect becomes admissible scope.',href:'/governance/',label:'Inspect authority and scope →'}),
    Object.freeze({title:'Level 5 is external',provocation:'More internal tests cannot be relabeled as independent validation.',body:'The next assessment threshold requires genuine external validation. Until that occurs, the public assessment remains Level 4 · BENCHMARKED.',href:'/evidence/',label:'Inspect the current evidence boundary →'})
  ])
});
function makeSlide(def,type,index){
  const article=document.createElement('article');article.className='compass-readiness-slide';article.id=`compass-readiness-${type}-slide-${index+1}`;article.dataset.readinessTitle=def.title;
  const prov=document.createElement('p');prov.className='compass-readiness-provocation';prov.textContent=def.provocation;article.append(prov);
  const body=document.createElement('p');body.textContent=def.body;article.append(body);
  if(def.rail){const ol=document.createElement('ol');ol.className='compass-readiness-rail';ol.setAttribute('aria-label','Software technology readiness levels 1 through 9');for(let i=1;i<=9;i++){const li=document.createElement('li');li.textContent=String(i);if(i<8)li.dataset.attained='';if(i===7)li.setAttribute('aria-current','step');if(i>7)li.dataset.unclaimed='';ol.append(li);}article.append(ol);}
  const a=document.createElement('a');a.href=def.href;a.textContent=def.label;article.append(a);return article;
}
function buildFamily(type){
  const meta=FAMILY_META[type],defs=DATA[type];
  const section=document.createElement('section');section.className='compass-readiness-family';section.dataset.readinessFamily=type;section.setAttribute('aria-roledescription','carousel');section.tabIndex=0;
  const head=document.createElement('header');head.className='compass-readiness-head';head.innerHTML=`<div><p>${meta.heading}</p><h3></h3></div><div class="compass-readiness-meta"><span class="compass-readiness-status">${meta.status}</span><span class="compass-readiness-ordinal" aria-live="polite"></span></div>`;section.append(head);
  const tabs=document.createElement('div');tabs.className='compass-readiness-slide-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',`${meta.label} carousel slides`);
  const viewport=document.createElement('div');viewport.className='compass-readiness-viewport';
  const slides=defs.map((def,i)=>{const slide=makeSlide(def,type,i);viewport.append(slide);const tab=document.createElement('button');tab.type='button';tab.className='compass-readiness-slide-tab';tab.setAttribute('role','tab');tab.setAttribute('aria-controls',slide.id);tab.setAttribute('aria-label',def.title);tab.textContent=String(i+1).padStart(2,'0');tabs.append(tab);return slide;});
  section.append(tabs,viewport);return{section,slides,tabs:[...tabs.children],title:q('h3',head),ordinal:q('.compass-readiness-ordinal',head)};
}
function wireCarousel(family){
  let index=0,startX=null;const n=family.slides.length;
  const render=()=>{family.slides.forEach((node,i)=>{const active=i===index,prev=i===(index-1+n)%n,next=i===(index+1)%n;node.dataset.active=active?'true':'false';node.dataset.position=active?'active':prev?'prev':next?'next':'far';node.hidden=false;node.setAttribute('aria-hidden',active?'false':'true');node.toggleAttribute('inert',!active);});family.tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',active?'true':'false');tab.tabIndex=active?0:-1;});family.title.textContent=family.slides[index].dataset.readinessTitle||'';family.ordinal.textContent=`${index+1} / ${n}`;family.section.dataset.slide=String(index+1);};
  const goTo=value=>{index=(value+n)%n;render();};family.tabs.forEach((tab,i)=>tab.addEventListener('click',()=>goTo(i)));
  family.section.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();goTo(index-1);}else if(event.key==='ArrowRight'){event.preventDefault();goTo(index+1);}else if(event.key==='Home'){event.preventDefault();goTo(0);}else if(event.key==='End'){event.preventDefault();goTo(n-1);}else return;if(event.target.closest('.compass-readiness-slide-tabs'))family.tabs[index].focus();});
  const viewport=q('.compass-readiness-viewport',family.section);viewport.addEventListener('pointerdown',event=>{if(event.target.closest('a,button'))return;startX=event.clientX;},{passive:true});viewport.addEventListener('pointerup',event=>{if(startX===null)return;const dx=event.clientX-startX;startX=null;if(Math.abs(dx)>42)goTo(index+(dx<0?1:-1));},{passive:true});viewport.addEventListener('pointercancel',()=>{startX=null;},{passive:true});render();return{goTo};
}
function install(){
  const built=q('.compass-built');if(!built)return false;
  let stage=q('[data-compass-readiness-static="v2"]')||q('.compass-readiness-stage',built);
  if(!stage){stage=document.createElement('div');stage.className='compass-readiness-stage';built.append(stage);}
  if(stage.dataset.readinessOwner==='context-v2')return true;
  stage.className='compass-readiness-stage';stage.dataset.compassReadinessStage='context-v2';stage.dataset.readinessOwner='context-v2';stage.dataset.activeFamily='research';stage.innerHTML='';
  const familyTabs=document.createElement('div');familyTabs.className='compass-readiness-tabs';familyTabs.setAttribute('role','tablist');familyTabs.setAttribute('aria-label','Research, technology readiness, and assessment');stage.append(familyTabs);
  const tabMap={},families={};
  FAMILY_ORDER.forEach(type=>{const tab=document.createElement('button');tab.type='button';tab.className='compass-readiness-tab';tab.setAttribute('role','tab');tab.textContent=FAMILY_META[type].label;familyTabs.append(tab);tabMap[type]=tab;families[type]=buildFamily(type);stage.append(families[type].section);wireCarousel(families[type]);});
  const setFamily=type=>{FAMILY_ORDER.forEach(name=>{const active=name===type;tabMap[name].setAttribute('aria-selected',active?'true':'false');tabMap[name].tabIndex=active?0:-1;families[name].section.hidden=!active;families[name].section.toggleAttribute('inert',!active);});stage.dataset.activeFamily=type;};
  FAMILY_ORDER.forEach(type=>tabMap[type].addEventListener('click',()=>setFamily(type)));
  familyTabs.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const current=Math.max(0,FAMILY_ORDER.indexOf(stage.dataset.activeFamily));let next=current;if(event.key==='Home')next=0;else if(event.key==='End')next=FAMILY_ORDER.length-1;else next=(current+(event.key==='ArrowRight'?1:-1)+FAMILY_ORDER.length)%FAMILY_ORDER.length;const type=FAMILY_ORDER[next];setFamily(type);tabMap[type].focus();});
  let style=document.getElementById('compass-readiness-context-v2-style');if(!style){style=document.createElement('style');style.id='compass-readiness-context-v2-style';style.textContent='[data-readiness-family="research"] .compass-readiness-slide-tab[aria-selected="true"]{border-color:rgba(190,159,255,.62);background:rgba(190,159,255,.10);color:rgba(244,237,255,.98)}[data-readiness-family="research"] .compass-readiness-provocation{border-left-color:rgba(190,159,255,.62);background:linear-gradient(90deg,rgba(190,159,255,.075),transparent)}';document.head.append(style);}
  setFamily('research');
  globalThis.DGB_COMPASS_READINESS_CONTEXT_V1=globalThis[GLOBAL]=Object.freeze({mounted:true,version:'context-v2',readinessPresentationOwner:'DGB_COMPASS_READINESS_CONTEXT_V2',familyOrder:FAMILY_ORDER,defaultFamily:'research',defaultResearchCard:'Agentic Frontier',slideCounts:Object.freeze({research:4,trl:4,tra:4}),stageReplacement:false,geometryChanged:false,compassStateChanged:false});return true;
}
if(!install()){document.addEventListener('DOMContentLoaded',install,{once:true});}
})();
