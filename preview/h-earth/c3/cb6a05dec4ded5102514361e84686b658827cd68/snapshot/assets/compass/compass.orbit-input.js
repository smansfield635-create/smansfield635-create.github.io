(()=>{
  'use strict';

  function installAboutDoorway(){
    const mount=()=>{
      const panel=document.querySelector('#chapter-about');
      if(!panel||panel.querySelector('a[href="/about/"]'))return;
      const doorway=document.createElement('a');
      doorway.href='/about/';
      doorway.textContent='About Diamond Gate Bridge →';
      doorway.dataset.compassAboutDoorway='true';
      panel.appendChild(doorway);
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
    else mount();
  }

  function retireLegacyPostDragAxisFallback(){
    const stage=document.querySelector('[data-compass-scene]');
    const root=document.querySelector('[data-compass-root]');
    const controller=globalThis.DGB_COMPASS_CONTROLLER;
    if(!stage||!root||!controller||typeof controller.requestAxisSwipe!=='function')return;

    let pointerId=null,startX=0,startY=0,suppressAxisSwipeUntil=0;
    const originalRequestAxisSwipe=controller.requestAxisSwipe.bind(controller);

    // Capture-phase tracking is intentional. The crystals owner releases pointer
    // capture inside its bubble-phase pointerup handler, which synchronously emits
    // lostpointercapture. If suppression is armed only in bubble phase, that event
    // clears pointerId first and the obsolete index.html axis fallback escapes.
    stage.addEventListener('pointerdown',event=>{
      if(event.button>0||root.dataset.compassMode!=='CONSTELLATION')return;
      pointerId=event.pointerId;startX=event.clientX;startY=event.clientY;
    },true);

    stage.addEventListener('pointerup',event=>{
      if(pointerId===null||event.pointerId!==pointerId)return;
      const dx=event.clientX-startX,dy=event.clientY-startY;
      pointerId=null;
      if(Math.hypot(dx,dy)>=8)suppressAxisSwipeUntil=performance.now()+520;
    },true);

    const clearPointer=event=>{
      if(pointerId===null||!event||event.pointerId===pointerId)pointerId=null;
    };
    stage.addEventListener('pointercancel',clearPointer,true);
    stage.addEventListener('lostpointercapture',clearPointer,true);

    globalThis.DGB_COMPASS_CONTROLLER=Object.freeze({
      ...controller,
      requestAxisSwipe(axis){
        if(performance.now()<=suppressAxisSwipeUntil)return false;
        return originalRequestAxisSwipe(axis);
      }
    });
  }

  function claimSwipe(stage,onResolve,{disabled=()=>false,exclude='a,button,input,select,textarea,[role="button"],[data-human-brain]'}={}){
    let active=false,captured=false,startX=0,startY=0,pointerId=null;
    stage.style.touchAction='pan-y';
    const clear=event=>{
      if(captured&&pointerId!==null&&stage.hasPointerCapture?.(pointerId))stage.releasePointerCapture?.(pointerId);
      active=false;captured=false;pointerId=null;
    };
    stage.addEventListener('pointerdown',event=>{
      if(disabled()||event.button>0||event.target.closest(exclude))return;
      active=true;captured=false;pointerId=event.pointerId;startX=event.clientX;startY=event.clientY;
    });
    stage.addEventListener('pointermove',event=>{
      if(!active||captured||event.pointerId!==pointerId)return;
      const dx=event.clientX-startX,dy=event.clientY-startY;
      if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.25)return;
      captured=true;stage.setPointerCapture?.(pointerId);
    });
    stage.addEventListener('pointerup',event=>{
      if(!active||event.pointerId!==pointerId)return;
      const dx=event.clientX-startX,dy=event.clientY-startY,width=Math.max(1,stage.getBoundingClientRect().width);
      const accepted=captured&&(Math.abs(dx)>=36||Math.abs(dx)>=width*.08)&&Math.abs(dx)>=Math.abs(dy)*1.25;
      clear(event);
      if(!accepted)return;
      event.preventDefault();onResolve(dx<0?1:-1);
    });
    stage.addEventListener('pointercancel',clear);
    return clear;
  }

  installAboutDoorway();
  retireLegacyPostDragAxisFallback();
  window.CompassOrbitInput=Object.freeze({claimSwipe});
})();