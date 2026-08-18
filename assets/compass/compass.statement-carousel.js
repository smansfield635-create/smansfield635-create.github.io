(()=>{
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const mod=(value,base)=>((value%base)+base)%base;
  function arrive(item){
    item.classList.remove('is-arriving');void item.offsetWidth;item.classList.add('is-arriving');
    setTimeout(()=>item.classList.remove('is-arriving'),reduce.matches?160:560);
  }
  function mountStatements(){
    const header=document.querySelector('.compass-estate__header');
    if(!header||header.querySelector('[data-statement-orbit]'))return;
    const items=[header.querySelector('.compass-estate__sentence'),header.querySelector('.compass-estate__epigraph')];
    if(items.some(item=>!item))return;
    const stage=document.createElement('section');
    stage.className='compass-statement-orbit';stage.dataset.statementOrbit='true';stage.tabIndex=0;
    stage.setAttribute('role','region');stage.setAttribute('aria-roledescription','carousel');stage.setAttribute('aria-label','Opening thoughts');
    const guidance=document.createElement('p');guidance.className='compass-statement-guidance';guidance.textContent='Swipe the thought above.';
    const status=document.createElement('p');status.className='compass-orbit-status';status.setAttribute('aria-live','polite');
    let index=0,busy=false;
    items.forEach((item,i)=>{item.classList.add('compass-statement-object');item.dataset.slot=i?'rear':'front';stage.append(item)});
    stage.append(guidance,status);header.insertBefore(stage,header.querySelector('.compass-introduction'));
    const render=arrival=>{
      items.forEach((item,i)=>{const front=i===index;item.dataset.slot=front?'front':'rear';item.toggleAttribute('inert',!front);item.setAttribute('aria-hidden',front?'false':'true');item.setAttribute('aria-current',front?'true':'false')});
      status.textContent=`Thought ${index+1} of ${items.length}`;if(arrival)arrive(items[index]);
    };
    const rotate=direction=>{if(busy)return;busy=true;index=mod(index+direction,items.length);render(true);setTimeout(()=>busy=false,reduce.matches?120:340)};
    window.CompassOrbitInput?.claimSwipe(stage,rotate);
    stage.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();rotate(event.key==='ArrowRight'?1:-1)}});
    render(true);
  }
  function promoteSpacecraftSurface(attempt=0){
    const craft=document.querySelector('canvas[data-compass-spacecraft-layer]');
    if(!craft){if(attempt<40)setTimeout(()=>promoteSpacecraftSurface(attempt+1),50);return}
    if(craft.dataset.performanceTier!=='demand-driven-static-3d'){if(attempt<40)setTimeout(()=>promoteSpacecraftSurface(attempt+1),50);return}
    try{
      const snapshot=document.createElement('canvas');
      snapshot.width=craft.width;snapshot.height=craft.height;snapshot.className=craft.className;
      for(const {name,value} of [...craft.attributes])if(name.startsWith('data-')||name==='aria-hidden')snapshot.setAttribute(name,value);
      snapshot.dataset.presentationSurface='canonical-laws-3d-snapshot-2d';
      snapshot.dataset.webglLifecycle='released-after-canonical-3d-frame';
      snapshot.style.cssText=craft.style.cssText;
      const ctx=snapshot.getContext('2d',{alpha:true});
      if(!ctx)return;
      ctx.drawImage(craft,0,0);
      craft.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext();
      craft.replaceWith(snapshot);
    }catch{}
  }
  function mountWorldInteraction(){
    const root=document.querySelector('[data-compass-root]');
    const scene=document.querySelector('[data-compass-scene]');
    if(!root||!scene||root.dataset.flagshipWorldInteraction==='true')return;
    root.dataset.flagshipWorldInteraction='true';
    root.dataset.flagshipContract='COMPASS_GEN1533_SPATIAL_ESTATE_FLAGSHIP_v1';
    root.dataset.objectContinuity='SPATIAL_OBJECT_REMAINS_INFORMATION_OBJECT';
    root.dataset.spacecraftInteraction='BOUNDED_PARALLAX_PROXIMITY_RESPONSE_NO_NAVIGATION_AUTHORITY';
    let tx=0,ty=0,cx=0,cy=0,raf=0,settle=0;
    const apply=()=>{
      raf=0;cx+=(tx-cx)*.085;cy+=(ty-cy)*.085;
      root.style.setProperty('--flagship-x',cx.toFixed(4));
      root.style.setProperty('--flagship-y',cy.toFixed(4));
      root.style.setProperty('--flagship-energy',Math.min(1,Math.hypot(cx,cy)*1.35).toFixed(3));
      const craft=document.querySelector('[data-compass-spacecraft-layer]');
      if(craft){
        craft.style.setProperty('--craft-parallax-x',(cx*18).toFixed(2)+'px');
        craft.style.setProperty('--craft-parallax-y',(cy*12).toFixed(2)+'px');
        craft.dataset.interactionAuthority='bounded-spatial-response-only-no-navigation';
      }
      if(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)raf=requestAnimationFrame(apply);
    };
    const move=e=>{
      if(reduce.matches)return;
      const r=scene.getBoundingClientRect();
      if(e.clientY<r.top-120||e.clientY>r.bottom+120){tx*=.9;ty*=.9}else{
        tx=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/Math.max(1,r.width/2)));
        ty=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height/2))/Math.max(1,r.height/2)));
      }
      if(!raf)raf=requestAnimationFrame(apply);
      clearTimeout(settle);settle=setTimeout(()=>{tx=0;ty=0;if(!raf)raf=requestAnimationFrame(apply)},900);
    };
    const pulse=e=>{
      if(reduce.matches)return;
      const r=scene.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
      root.classList.remove('is-flagship-engaged');void root.offsetWidth;root.classList.add('is-flagship-engaged');
      setTimeout(()=>root.classList.remove('is-flagship-engaged'),720);
    };
    addEventListener('pointermove',move,{passive:true});
    scene.addEventListener('pointerdown',pulse,{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){tx=ty=0}});
  }
  function boot(){mountStatements();mountWorldInteraction();promoteSpacecraftSurface()}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
  window.CompassStatementCarousel=Object.freeze({version:'statement-flagship-v2',worldInteraction:'bounded-parallax-proximity',spacecraftSurface:'canonical-3d-frame-promoted-and-webgl-released'});
})();
