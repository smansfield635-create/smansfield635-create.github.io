(()=>{
  'use strict';
  const mod=(value,base)=>((value%base)+base)%base;
  const focus=e=>{try{e?.focus({preventScroll:true})}catch{e?.focus()}};
  function mount(){
    const legacy=document.querySelector('[data-compass-capability-switcher]');if(!legacy||document.querySelector('[data-capability-orbit]'))return;
    const stage=document.createElement('section');stage.className='compass-capability-orbit';stage.dataset.capabilityOrbit='true';stage.dataset.capabilityMode='orbit';stage.tabIndex=0;stage.setAttribute('role','region');stage.setAttribute('aria-roledescription','carousel');stage.setAttribute('aria-label','Signature capabilities');
    const diagnostic=document.createElement('article');diagnostic.className='compass-orbit-plaque';diagnostic.dataset.capability='diagnostic';diagnostic.innerHTML=`<div class="compass-plaque-copy"><p class="compass-estate__kicker">Diagnostic</p><h2>Coherence Diagnostic</h2><p>Compare what matters to you with how you are actually living and deciding. See areas of alignment, tension, and repeated mismatch.</p><a class="compass-orbit-action" href="/coherence-diagnostic/">RUN THE DIAGNOSTIC</a></div><div class="compass-brain-field" data-human-brain><canvas aria-label="Rotating anatomical brain with X, Y, and Z orientation axes"></canvas><div class="compass-brain-axis" aria-hidden="true"><i class="axis-y">Y</i><i class="axis-x">X</i><i class="axis-z">Z</i></div></div>`;
    const house=document.createElement('article');house.className='compass-orbit-plaque';house.dataset.capability='house';house.innerHTML=`<div class="compass-house-parent" data-house-parent><div class="compass-plaque-copy"><p class="compass-estate__kicker">Ask for directions</p><h2>Talk to the House</h2><p>Open the House guides, then swipe to choose Jeeves, Elara, or Auren.</p><button class="compass-orbit-action" type="button" data-enter-house>OPEN HOUSE GUIDES</button></div></div><div class="house-orbit" data-house-orbit hidden role="region" aria-roledescription="carousel" aria-label="House guides"></div>`;
    const guidance=document.createElement('p');guidance.className='compass-capability-guidance';guidance.textContent='Swipe to rotate the orbit. Tap the clear card to enter.';
    const status=document.createElement('p');status.className='compass-orbit-status';status.setAttribute('aria-live','polite');
    stage.append(diagnostic,house,guidance,status);legacy.replaceWith(stage);
    const cards=[diagnostic,house],houseParent=house.querySelector('[data-house-parent]'),houseOrbit=house.querySelector('[data-house-orbit]');
    const definitions=[
      {id:'jeeves',status:'Whole House',name:'Talk to Jeeves',body:'Meet the House interface and receive guidance through the estate and Hearth.',href:'/showroom/globe/hearth/jeeves/'},
      {id:'elara',status:'Heart and meaning',name:'Talk to Elara',body:'Meet Elara for relational, emotional, and meaning-centered orientation.',href:''},
      {id:'auren',status:'Product floor',name:'Talk to Auren',body:'Enter Auren’s product-facing room for practical systems and useful next steps.',href:'/showroom/globe/hearth/auren/'}
    ];
    definitions.forEach(d=>{const m=document.createElement('article');m.className='house-orbit-member';m.dataset.member=d.id;m.innerHTML=`<span class="house-member-status">${d.status}</span><h3>${d.name}</h3><p>${d.body}</p><div class="compass-plaque-actions">${d.href?`<a class="compass-orbit-action" href="${d.href}" data-house-function>${d.name}</a>`:`<button class="compass-orbit-action" type="button" disabled aria-disabled="true">${d.name}</button>`}<button class="compass-orbit-action compass-orbit-action--secondary" type="button" data-return-house>RETURN TO ORBIT</button></div>`;houseOrbit.append(m)});
    const members=[...houseOrbit.children];let cardIndex=0,memberIndex=0,mode='orbit',busy=false;
    const announce=()=>document.dispatchEvent(new CustomEvent('compass:capability-change',{detail:{mode,capability:cards[cardIndex].dataset.capability,member:definitions[memberIndex].id}}));
    function renderCards(){cards.forEach((card,i)=>{const front=i===cardIndex;card.dataset.slot=front?'front':'rear';card.toggleAttribute('inert',!front);card.setAttribute('aria-hidden',front?'false':'true')});status.textContent=`Capability ${cardIndex+1} of 2`;announce()}
    function renderMembers(){members.forEach((m,i)=>{const delta=mod(i-memberIndex,members.length);m.dataset.slot=delta===0?'front':delta===1?'rear-next':'rear-prev';m.toggleAttribute('inert',delta!==0);m.setAttribute('aria-hidden',delta===0?'false':'true')});status.textContent=`House guide ${memberIndex+1} of ${members.length}: ${definitions[memberIndex].name}`;announce()}
    const settle=fn=>{if(busy)return;busy=true;fn();setTimeout(()=>busy=false,260)};
    const rotateCard=d=>{if(mode!=='orbit')return;settle(()=>{cardIndex=mod(cardIndex+d,2);renderCards()})};
    const rotateMember=d=>{if(mode!=='house')return;settle(()=>{memberIndex=mod(memberIndex+d,members.length);renderMembers()})};
    const enterHouse=()=>{if(cardIndex!==1||mode==='house')return;mode='house';stage.dataset.capabilityMode='house-members';houseParent.hidden=true;houseOrbit.hidden=false;guidance.textContent='Swipe for another House guide. Tap the clear guide to talk.';renderMembers();focus(members[memberIndex].querySelector('a,button'))};
    const leaveHouse=()=>{if(mode!=='house')return;mode='orbit';stage.dataset.capabilityMode='orbit';houseOrbit.hidden=true;houseParent.hidden=false;guidance.textContent='Swipe to rotate the orbit. Tap the clear card to enter.';renderCards();focus(house.querySelector('[data-enter-house]'))};
    house.querySelector('[data-enter-house]').addEventListener('click',enterHouse);
    houseOrbit.addEventListener('click',e=>{if(e.target.closest('[data-return-house]')){e.preventDefault();leaveHouse()}});
    window.CompassOrbitInput?.claimSwipe(stage,rotateCard,{disabled:()=>mode!=='orbit'});window.CompassOrbitInput?.claimSwipe(houseOrbit,rotateMember,{disabled:()=>mode!=='house'});
    stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();mode==='house'?rotateMember(e.key==='ArrowRight'?1:-1):rotateCard(e.key==='ArrowRight'?1:-1)}else if(e.key==='Escape'&&mode==='house'){e.preventDefault();leaveHouse()}});
    renderCards();renderMembers();
    const canvas=diagnostic.querySelector('[data-human-brain] canvas');window.CompassBrainScene?.mount(canvas,{foreground:()=>mode==='orbit'&&cardIndex===0});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
  window.CompassEditorialCarousel=Object.freeze({version:'successor-v5',mount});
})();
