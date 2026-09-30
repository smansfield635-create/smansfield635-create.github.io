(()=>{
  'use strict';
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
  window.CompassOrbitInput=Object.freeze({claimSwipe});
})();
