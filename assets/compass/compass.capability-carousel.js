(()=>{
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const mod=(value,base)=>((value%base)+base)%base;
  const focus=element=>{try{element?.focus({preventScroll:true})}catch{element?.focus()}};
  const interactive='a,button,input,select,textarea,[data-human-brain]';
  const element=(tag,className)=>{const item=document.createElement(tag);item.className=className;return item};
  function region(item,label,guidance){item.tabIndex=0;item.setAttribute('role','region');item.setAttribute('aria-roledescription','carousel');item.setAttribute('aria-label',label);item.setAttribute('aria-describedby',guidance)}
  function liveStatus(){const item=element('p','compass-orbit-status');item.setAttribute('aria-live','polite');item.setAttribute('aria-atomic','true');return item}
  function setInteractive(container,enabled){
    container.toggleAttribute('inert',!enabled);container.setAttribute('aria-hidden',enabled?'false':'true');container.tabIndex=enabled?0:-1;
    container.querySelectorAll('a,button,input,select,textarea').forEach(control=>{
      if(enabled){if(control.dataset.orbitTabindex==='none')control.removeAttribute('tabindex');else if(control.dataset.orbitTabindex!=null)control.tabIndex=Number(control.dataset.orbitTabindex);delete control.dataset.orbitTabindex}
      else{if(control.dataset.orbitTabindex==null)control.dataset.orbitTabindex=control.hasAttribute('tabindex')?control.getAttribute('tabindex'):'none';control.tabIndex=-1}
    });
  }
  function place(item,index,count,delta,label,enabled=true){
    const front=delta===0;item.dataset.slot=front?'front':delta===1?'rear-next':'rear-prev';item.setAttribute('role','group');item.setAttribute('aria-roledescription','slide');item.setAttribute('aria-posinset',index+1);item.setAttribute('aria-setsize',count);item.setAttribute('aria-current',front);item.setAttribute('aria-label',label);setInteractive(item,front&&enabled);
  }
  function controls(kind,rotate){
    const group=element('div','compass-orbit-controls');group.setAttribute('aria-label',`${kind} controls`);
    group.innerHTML=`<button type="button" data-orbit-previous aria-label="Previous ${kind}">‹</button><button type="button" data-orbit-next aria-label="Next ${kind}">›</button>`;
    group.children[0].onclick=()=>rotate(-1);group.children[1].onclick=()=>rotate(1);return group;
  }
  function statusRail(kind,labels){
    const rail=element('ol','compass-status-rail');rail.dataset.statusRail=kind;rail.setAttribute('aria-hidden','true');rail.innerHTML=labels.map(label=>`<li data-state="unseen">${label}</li>`).join('');return rail;
  }
  function settleRail(rail,index,visited){
    visited.add(index);[...rail.children].forEach((item,itemIndex)=>item.dataset.state=itemIndex===index?'current':visited.has(itemIndex)?'visited':'unseen');
  }
  function mountCapability(){
    const legacy=document.querySelector('[data-compass-capability-switcher]');if(!legacy||document.querySelector('[data-capability-orbit]'))return;
    const stage=element('section','compass-capability-orbit');stage.dataset.capabilityOrbit='true';stage.dataset.capabilityMode='orbit';region(stage,'Signature Diamond Gate capabilities','compass-capability-guidance');
    const diagnostic=element('article','compass-orbit-plaque');diagnostic.dataset.capability='diagnostic';diagnostic.innerHTML=`<div class="compass-plaque-copy"><p class="compass-estate__kicker">Diagnostic</p><h2 id="compass-capability-diagnostic-title">Coherence Diagnostic</h2><p>Compare what matters to you with how you are actually living and deciding. See areas of alignment, tension, and repeated mismatch.</p><a class="compass-orbit-action" href="/coherence-diagnostic/" data-capability-function="diagnostic">RUN THE DIAGNOSTIC</a></div><div class="compass-brain-field" data-human-brain><canvas role="img" aria-label="Eye-level rotating three-dimensional human brain with left and right hemispheres, fissure, cerebellum, pons, brainstem, and X, Y, Z spatial orientation axes"></canvas><div class="compass-brain-axis" aria-hidden="true"><i class="axis-y">Y</i><i class="axis-x">X</i><i class="axis-z">Z</i></div></div>`;
    const awards=element('article','compass-orbit-plaque compass-orbit-plaque--awards');awards.dataset.capability='awards';awards.innerHTML=`<div class="compass-plaque-copy"><p class="compass-estate__kicker">Awards &amp; Recognition</p><h2 id="compass-capability-awards-title">One body of work. Five reasons to look closer.</h2><p>Interactive worlds. Original characters. Browser-native 3D. A growing software platform. Governed construction that keeps the whole estate coherent as it evolves.</p><ul class="compass-awards-facets" aria-label="Five Diamond Gate capability facets"><li>Experience</li><li>Native Craft</li><li>Governed Construction</li><li>Continuity &amp; Recovery</li><li>Integrated Platform</li></ul><p class="compass-awards-boundary">Built in 2026 · Entering the 2027 award season</p><a class="compass-orbit-action" href="/showroom/globe/h-earth/awards/" data-capability-function="awards">Explore the Awards Layer</a></div><div class="compass-award-object" aria-hidden="true"><div class="compass-award-trophy"><i class="compass-trophy-bowl"></i><i class="compass-trophy-handle compass-trophy-handle--left"></i><i class="compass-trophy-handle compass-trophy-handle--right"></i><i class="compass-trophy-stem"></i><i class="compass-trophy-base"></i><i class="compass-trophy-gleam"></i></div></div>`;
    const house=element('article','compass-orbit-plaque');house.dataset.capability='house';house.innerHTML=`<div class="compass-house-parent" data-house-parent><div class="compass-plaque-copy"><p class="compass-estate__kicker">Ask for directions</p><h2 id="compass-capability-house-title">Talk to the House</h2><p>Open the House guides, then swipe to choose Jeeves, Elara, or Auren.</p><button class="compass-orbit-action" type="button" data-enter-house>OPEN HOUSE GUIDES</button></div></div><div class="house-orbit" data-house-orbit hidden role="region" aria-roledescription="carousel" aria-label="House guides"></div>`;
    const orbitGuidance='Swipe to rotate the orbit. Use the action on the clear card to enter.',guidance=element('p','compass-capability-guidance');guidance.id='compass-capability-guidance';guidance.dataset.capabilityGuidance='true';guidance.setAttribute('aria-live','polite');guidance.textContent=orbitGuidance;
    const status=liveStatus();
    const cards=[diagnostic,awards,house],names=['Coherence Diagnostic','Awards & Recognition','Talk to the House'],capabilityRail=statusRail('capability',['Diagnostic','Awards','House']),capabilityVisited=new Set();let cardIndex=0,memberIndex=0,mode='orbit',busy=false,settleTimer=0,awardsTimer=0,houseReturnScroll=null;
    const finish=commit=>{clearTimeout(settleTimer);if(reduce.matches){queueMicrotask(()=>{busy=false;commit()})}else settleTimer=setTimeout(()=>{busy=false;commit()},320)};
    const rotateCard=direction=>{if(mode!=='orbit'||busy)return;busy=true;cardIndex=mod(cardIndex+direction,cards.length);renderCards();finish(()=>settleCards(true))};
    stage.append(...cards,capabilityRail,controls('capability',rotateCard),guidance,status);legacy.replaceWith(stage);
    const houseParent=house.querySelector('[data-house-parent]'),houseOrbit=house.querySelector('[data-house-orbit]');
    const definitions=[
      {id:'jeeves',status:'Whole House',name:'Talk to Jeeves',body:'Meet the House interface and receive guidance through the estate and Hearth.',href:'/showroom/globe/hearth/jeeves/'},
      {id:'elara',status:'Heart and meaning',name:'Talk to Elara',body:'Meet Elara for relational, emotional, and meaning-centered orientation.',href:'/elara/'},
      {id:'auren',status:'Product floor',name:'Talk to Auren',body:'Enter Auren’s product-facing room for practical systems and useful next steps.',href:'/products/auren/'}
    ];
    definitions.forEach(definition=>{const member=element('article','house-orbit-member');member.dataset.member=definition.id;member.innerHTML=`<span class="house-member-status">${definition.status}</span><h3>${definition.name}</h3><p>${definition.body}</p><div class="compass-plaque-actions"><a class="compass-orbit-action" href="${definition.href}" data-house-function="${definition.id}">${definition.name}</a><button class="compass-orbit-action compass-orbit-action--secondary" type="button" data-return-house>RETURN TO ORBIT</button></div>`;houseOrbit.append(member)});
    const members=[...houseOrbit.children];
    const announce=()=>document.dispatchEvent(new CustomEvent('compass:capability-change',{detail:{mode,capability:cards[cardIndex].dataset.capability,member:definitions[memberIndex].id}}));
    function illuminateAwards(){clearTimeout(awardsTimer);awards.classList.remove('is-illuminating');if(reduce.matches||cardIndex!==1||mode!=='orbit')return;void awards.offsetWidth;awards.classList.add('is-illuminating');awardsTimer=setTimeout(()=>awards.classList.remove('is-illuminating'),800)}
    function renderCards(){cards.forEach((card,index)=>place(card,index,cards.length,mod(index-cardIndex,cards.length),`Capability ${index+1} of ${cards.length}: ${names[index]}`))}
    function settleCards(arrival=false){settleRail(capabilityRail,cardIndex,capabilityVisited);status.textContent=`Capability ${cardIndex+1} of ${cards.length}: ${names[cardIndex]}`;if(arrival)illuminateAwards();announce()}
    function renderMembers(){members.forEach((member,index)=>place(member,index,members.length,mod(index-memberIndex,members.length),`House guide ${index+1} of ${members.length}: ${definitions[index].name}`,mode==='house'))}
    function settleMembers(){status.textContent=`House guide ${memberIndex+1} of ${members.length}: ${definitions[memberIndex].name}`;announce()}
    const rotateMember=direction=>{if(mode!=='house'||busy)return;busy=true;memberIndex=mod(memberIndex+direction,members.length);renderMembers();finish(()=>{if(mode==='house')settleMembers()})};
    const enterHouse=()=>{if(cardIndex!==2||mode==='house'||busy)return;houseReturnScroll={left:window.scrollX,top:window.scrollY};mode='house';stage.dataset.capabilityMode='house-members';houseParent.hidden=true;houseOrbit.hidden=false;guidance.textContent='Swipe for another House guide. Tap the clear guide to talk. Return to Orbit restores the capability orbit.';renderMembers();settleMembers();focus(members[memberIndex])};
    const leaveHouse=()=>{if(mode!=='house')return;const returnScroll=houseReturnScroll;clearTimeout(settleTimer);busy=false;mode='orbit';stage.dataset.capabilityMode='orbit';houseOrbit.hidden=true;houseParent.hidden=false;guidance.textContent=orbitGuidance;renderMembers();renderCards();settleCards();focus(house.querySelector('[data-enter-house]'));if(returnScroll)window.scrollTo(returnScroll.left,returnScroll.top);houseReturnScroll=null};
    house.querySelector('[data-enter-house]').addEventListener('click',enterHouse);houseOrbit.addEventListener('click',event=>{if(event.target.closest('[data-return-house]')){event.preventDefault();leaveHouse()}});
    cards.forEach((card,index)=>{const activate=()=>{if(index!==cardIndex||mode!=='orbit')return;if(card===house)enterHouse();else card.querySelector('[data-capability-function]')?.click()};card.addEventListener('click',event=>{if(event.target===card||!event.target.closest(interactive))activate()});card.addEventListener('keydown',event=>{if(event.target===card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();activate()}})});
    const brainField=diagnostic.querySelector('[data-human-brain]');let brainPointer=false;stage.addEventListener('pointerdown',event=>{const r=brainField.getBoundingClientRect();brainPointer=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom},true);stage.addEventListener('click',event=>{if(brainPointer){brainPointer=false;event.stopPropagation()}},true);stage.addEventListener('pointercancel',()=>brainPointer=false,true);
    window.CompassOrbitInput?.claimSwipe(stage,rotateCard,{disabled:()=>mode!=='orbit'||brainPointer});window.CompassOrbitInput?.claimSwipe(houseOrbit,rotateMember,{disabled:()=>mode!=='house'});
    stage.addEventListener('keydown',event=>{const parentTarget=event.target===stage||event.target===cards[cardIndex],memberTarget=event.target===members[memberIndex];if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&(mode==='house'?memberTarget:parentTarget)){event.preventDefault();mode==='house'?rotateMember(event.key==='ArrowRight'?1:-1):rotateCard(event.key==='ArrowRight'?1:-1)}else if(event.key==='Escape'&&mode==='house'){event.preventDefault();leaveHouse()}});
    renderMembers();renderCards();settleCards();const canvas=diagnostic.querySelector('[data-human-brain] canvas');window.CompassBrainScene?.mount(canvas,{foreground:()=>mode==='orbit'&&cards[cardIndex].dataset.capability==='diagnostic'});
  }
  function mountProof(){
    const stage=document.querySelector('[data-proof-orbit]');if(!stage||stage.dataset.proofMounted)return;stage.dataset.proofMounted='true';stage.classList.add('is-enhanced');region(stage,'Built Different proof points','compass-proof-guidance');
    const cards=[...stage.querySelectorAll('[data-proof-card]')],names=cards.map(card=>card.querySelector('h3')?.textContent.trim()||'Proof point'),proofRail=statusRail('proof',['TRL 7','Bounded','Checked']),proofVisited=new Set();if(cards.length!==3)return;let index=0,busy=false,settleTimer=0;
    const guidance=element('p','compass-proof-guidance');guidance.id='compass-proof-guidance';guidance.textContent='Swipe or use the controls to inspect one proof point at a time.';
    const status=liveStatus();
    const settle=()=>{busy=false;settleRail(proofRail,index,proofVisited);status.textContent=`Proof point ${index+1} of ${cards.length}: ${names[index]}`;document.dispatchEvent(new CustomEvent('compass:proof-change',{detail:{proof:cards[index].dataset.proofCard}}))};
    const rotate=direction=>{if(busy)return;busy=true;index=mod(index+direction,cards.length);render();clearTimeout(settleTimer);if(reduce.matches)queueMicrotask(settle);else settleTimer=setTimeout(settle,320)};
    stage.append(proofRail,controls('proof point',rotate),guidance,status);
    function render(){cards.forEach((card,cardIndex)=>place(card,cardIndex,cards.length,mod(cardIndex-index,cards.length),`Proof point ${cardIndex+1} of ${cards.length}: ${names[cardIndex]}`))}
    window.CompassOrbitInput?.claimSwipe(stage,rotate);stage.addEventListener('keydown',event=>{if((event.target===stage||event.target===cards[index])&&(event.key==='ArrowRight'||event.key==='ArrowLeft')){event.preventDefault();rotate(event.key==='ArrowRight'?1:-1)}});render();settle();
  }
  function mount(){mountCapability();mountProof()}
  const publicApi=Object.freeze({version:'root-award-finish-successor-v1',mount});
  Object.defineProperty(window,'CompassEditorialCarousel',{configurable:false,enumerable:true,get:()=>publicApi,set:()=>{}});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();
