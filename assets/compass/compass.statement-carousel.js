(()=>{
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const mod=(value,base)=>((value%base)+base)%base;
  function arrive(item){
    item.classList.remove('is-arriving');void item.offsetWidth;item.classList.add('is-arriving');
    setTimeout(()=>item.classList.remove('is-arriving'),reduce.matches?160:420);
  }
  function mount(){
    const header=document.querySelector('.compass-estate__header');
    if(!header||header.querySelector('[data-statement-orbit]'))return;
    const items=[header.querySelector('.compass-estate__sentence'),header.querySelector('.compass-estate__epigraph')];
    if(items.some(item=>!item))return;
    const stage=document.createElement('section');
    stage.className='compass-statement-orbit';stage.dataset.statementOrbit='true';stage.tabIndex=0;
    stage.setAttribute('role','region');stage.setAttribute('aria-roledescription','carousel');stage.setAttribute('aria-label','Opening thoughts');
    const guidance=document.createElement('p');guidance.className='compass-statement-guidance';guidance.textContent='Swipe to read the other thought.';
    const status=document.createElement('p');status.className='compass-orbit-status';status.setAttribute('aria-live','polite');
    let index=0,busy=false;
    items.forEach((item,i)=>{item.classList.add('compass-statement-object');item.dataset.slot=i?'rear':'front';stage.append(item)});
    stage.append(guidance,status);header.insertBefore(stage,header.querySelector('.compass-introduction'));
    const render=arrival=>{
      items.forEach((item,i)=>{const front=i===index;item.dataset.slot=front?'front':'rear';item.toggleAttribute('inert',!front);item.setAttribute('aria-hidden',front?'false':'true');item.setAttribute('aria-current',front?'true':'false')});
      status.textContent=`Thought ${index+1} of ${items.length}`;if(arrival)arrive(items[index]);
    };
    const rotate=direction=>{if(busy)return;busy=true;index=mod(index+direction,items.length);render(true);setTimeout(()=>busy=false,reduce.matches?120:260)};
    window.CompassOrbitInput?.claimSwipe(stage,rotate);
    stage.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();rotate(event.key==='ArrowRight'?1:-1)}});
    render(true);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
  window.CompassStatementCarousel=Object.freeze({version:'statement-v1'});
})();
