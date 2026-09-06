import assert from 'node:assert/strict';

export const GESTURE_RESPONSE_HARNESS_SCHEMA='GESTURE_RESPONSE_HARNESS_v1';

export async function dispatchTouchPointer(page,{selector,type,pointerId,x,y,isPrimary=pointerId===1}){
  return page.evaluate(({selector,type,pointerId,x,y,isPrimary})=>{
    const target=document.querySelector(selector);
    if(!(target instanceof Element))throw new Error(`GESTURE_TARGET_MISSING:${selector}`);
    target.dispatchEvent(new PointerEvent(type,{
      bubbles:true,cancelable:true,composed:true,pointerId,pointerType:'touch',isPrimary,
      clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1,
      pressure:type==='pointerup'||type==='pointercancel'?0:.5
    }));
  },{selector,type,pointerId,x,y,isPrimary});
}

export function requireFiniteMeasurement(value,label){
  assert.equal(Number.isFinite(value),true,`${label}_NOT_FINITE`);
  return value;
}

export function euclideanDelta(a,b,keys){
  return Math.hypot(...keys.map(key=>Number(b?.[key]??0)-Number(a?.[key]??0)));
}
