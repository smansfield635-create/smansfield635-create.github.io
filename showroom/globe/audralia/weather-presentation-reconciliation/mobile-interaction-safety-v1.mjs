const TARGET_SELECTOR='[data-h-earth-map-wide-canvas]';
const originalAdd=EventTarget.prototype.addEventListener;
const wrapped=new WeakMap();

EventTarget.prototype.addEventListener=function(type,listener,options){
  if(type==='pointermove'&&this instanceof HTMLCanvasElement&&this.matches?.(TARGET_SELECTOR)&&typeof listener==='function'){
    let byListener=wrapped.get(this);if(!byListener){byListener=new WeakMap();wrapped.set(this,byListener);}
    let proxy=byListener.get(listener);
    if(!proxy){
      let raf=0,last=null;
      proxy=function(event){
        last={pointerId:event.pointerId,clientX:event.clientX,clientY:event.clientY,buttons:event.buttons,pointerType:event.pointerType,isPrimary:event.isPrimary};
        if(raf)return;
        raf=requestAnimationFrame(()=>{
          raf=0;
          const e=last;last=null;
          if(!e)return;
          listener.call(this,{...e,preventDefault:()=>{},stopPropagation:()=>{},stopImmediatePropagation:()=>{}});
        });
      };
      byListener.set(listener,proxy);
    }
    return originalAdd.call(this,type,proxy,options);
  }
  return originalAdd.call(this,type,listener,options);
};

const evidence={schema:'AUDRALIA_MOBILE_INTERACTION_SAFETY_v1',pointerMoveRafCoalescing:true,contextLossCount:0,contextRestoreCount:0,lastContextLoss:null};
const instrument=canvas=>{
  if(!(canvas instanceof HTMLCanvasElement)||canvas.dataset.audraliaContextInstrumented==='true')return;
  canvas.dataset.audraliaContextInstrumented='true';
  originalAdd.call(canvas,'webglcontextlost',event=>{
    evidence.contextLossCount++;
    evidence.lastContextLoss={at:Date.now(),role:canvas.dataset.audraliaExteriorWeather?'exterior':canvas.dataset.audraliaCanonicalWeather?'canonical':canvas.hasAttribute('data-h-earth-map-wide-canvas')?'world':'overlay'};
    event.preventDefault?.();
    window.__AUDRALIA_MOBILE_INTERACTION_SAFETY_ERROR__={...evidence};
    console.error('AUDRALIA_WEBGL_CONTEXT_LOST',evidence.lastContextLoss);
  });
  originalAdd.call(canvas,'webglcontextrestored',()=>{evidence.contextRestoreCount++;console.info('AUDRALIA_WEBGL_CONTEXT_RESTORED');});
};

const scan=()=>document.querySelectorAll('canvas').forEach(instrument);
scan();
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
window.__AUDRALIA_MOBILE_INTERACTION_SAFETY__={getEvidence:()=>Object.freeze({...evidence})};
