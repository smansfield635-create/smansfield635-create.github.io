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

export async function waitForStateChange(page,{readState,changedFrom,timeoutMs=2500,pollMs=8,label='STATE_CHANGE'}){
  const started=Date.now();
  let state=await readState(page);
  while(Date.now()-started<timeoutMs){
    if(changedFrom(state))return Object.freeze({latencyMs:Date.now()-started,state});
    await new Promise(resolve=>setTimeout(resolve,pollMs));
    state=await readState(page);
  }
  throw new Error(`${label}_TIMEOUT:${JSON.stringify(state)}`);
}

export async function measurePostRelease(page,{readState,baselineState,delta,settleMs=180}){
  await new Promise(resolve=>setTimeout(resolve,settleMs));
  const settledState=await readState(page);
  return Object.freeze({settleMs,baselineState,settledState,delta:delta(baselineState,settledState)});
}

export function requireFiniteMeasurement(value,label){
  assert.equal(Number.isFinite(value),true,`${label}_NOT_FINITE`);
  assert.equal(value>=0,true,`${label}_NEGATIVE`);
  return value;
}

export function euclideanDelta(a,b,keys){
  return Math.hypot(...keys.map(key=>Number(b?.[key]??0)-Number(a?.[key]??0)));
}
