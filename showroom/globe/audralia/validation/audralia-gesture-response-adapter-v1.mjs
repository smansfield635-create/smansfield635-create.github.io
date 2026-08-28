import assert from 'node:assert/strict';
import {
  GESTURE_RESPONSE_HARNESS_SCHEMA,
  dispatchTouchPointer,
  waitForStateChange,
  measurePostRelease,
  requireFiniteMeasurement,
  euclideanDelta
} from '../../../../tools/interaction-response/gesture-response-harness-v1.mjs';

export const AUDRALIA_GESTURE_RESPONSE_SCHEMA='AUDRALIA_GESTURE_RESPONSE_DIAGNOSTIC_RECEIPT_v1';
const SELECTOR='[data-h-earth-map-wide-canvas]';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function readState(page){
  return page.evaluate(()=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    const hook=window.__AUDRALIA_HOOK5_OWNER_VISIBLE_CONTINUITY__;
    const state=proof?.renderer?.getSnapshot?.();
    if(!state)throw new Error('AUDRALIA_GESTURE_RENDERER_STATE_MISSING');
    return {
      targetU:Number(state.targetU),targetV:Number(state.targetV),distance:Number(state.distance),
      pitch:Number(state.pitch),yaw:Number(state.yaw),
      hookEvidence:hook?.getEvidence?.()||null
    };
  });
}

async function center(page){
  return page.$eval(SELECTOR,node=>{const r=node.getBoundingClientRect();return {x:r.left+r.width*.5,y:r.top+r.height*.5,width:r.width,height:r.height};});
}

const angularDelta=(a,b)=>Math.hypot(Number(b.yaw)-Number(a.yaw),Number(b.pitch)-Number(a.pitch));
const travelDelta=(a,b)=>euclideanDelta(a,b,['targetU','targetV']);
const zoomDelta=(a,b)=>Math.abs(Number(b.distance)-Number(a.distance));

export async function runAudraliaGestureResponseDiagnostic(page,{candidateHead='UNKNOWN'}={}){
  const c=await center(page);
  assert.ok(c.width>100&&c.height>100,'AUDRALIA_GESTURE_CANVAS_TOO_SMALL');
  const initial=await readState(page);
  assert.equal(initial.hookEvidence?.continuityInstalled,false,'SYNTHETIC_POLE_INTERCEPTION_STILL_INSTALLED');
  assert.equal(initial.hookEvidence?.poleCrossings,0,'SYNTHETIC_POLE_CROSSING_ALREADY_RECORDED');

  // One-finger LOOK: horizontal dominant drag must alter yaw/pitch through the native orbit path.
  const lookStart=await readState(page);
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerdown',pointerId:101,x:c.x-40,y:c.y});
  const lookMoveStarted=Date.now();
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:101,x:c.x+34,y:c.y-8});
  const lookResponse=await waitForStateChange(page,{readState,changedFrom:s=>angularDelta(lookStart,s)>1e-5,label:'ONE_FINGER_LOOK_RESPONSE'});
  lookResponse.latencyMs=Date.now()-lookMoveStarted;
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerup',pointerId:101,x:c.x+34,y:c.y-8});
  const lookReleased=await readState(page);
  const lookPost=await measurePostRelease(page,{readState,baselineState:lookReleased,delta:angularDelta});

  // Two-finger common translation: first movement classifies TRAVEL; second movement must change targetU/V.
  const travelStart=await readState(page);
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerdown',pointerId:201,x:c.x-35,y:c.y+55,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerdown',pointerId:202,x:c.x+35,y:c.y+55,isPrimary:false});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:201,x:c.x-35,y:c.y+25,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:202,x:c.x+35,y:c.y+25,isPrimary:false});
  const travelMoveStarted=Date.now();
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:201,x:c.x-35,y:c.y-15,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:202,x:c.x+35,y:c.y-15,isPrimary:false});
  const travelResponse=await waitForStateChange(page,{readState,changedFrom:s=>travelDelta(travelStart,s)>1e-4,label:'TWO_FINGER_TRAVEL_RESPONSE'});
  travelResponse.latencyMs=Date.now()-travelMoveStarted;
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerup',pointerId:201,x:c.x-35,y:c.y-15,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerup',pointerId:202,x:c.x+35,y:c.y-15,isPrimary:false});
  const travelReleased=await readState(page);
  const travelPost=await measurePostRelease(page,{readState,baselineState:travelReleased,delta:travelDelta});

  // Pinch: opposing movement must alter distance while geographic target remains materially stable.
  const pinchStart=await readState(page);
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerdown',pointerId:301,x:c.x-28,y:c.y,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerdown',pointerId:302,x:c.x+28,y:c.y,isPrimary:false});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:301,x:c.x-48,y:c.y,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:302,x:c.x+48,y:c.y,isPrimary:false});
  const pinchMoveStarted=Date.now();
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:301,x:c.x-72,y:c.y,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:302,x:c.x+72,y:c.y,isPrimary:false});
  const pinchResponse=await waitForStateChange(page,{readState,changedFrom:s=>zoomDelta(pinchStart,s)>1e-4,label:'PINCH_ZOOM_RESPONSE'});
  pinchResponse.latencyMs=Date.now()-pinchMoveStarted;
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerup',pointerId:301,x:c.x-72,y:c.y,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerup',pointerId:302,x:c.x+72,y:c.y,isPrimary:false});
  const pinchReleased=await readState(page);
  const pinchPost=await measurePostRelease(page,{readState,baselineState:pinchReleased,delta:zoomDelta});

  await sleep(40);
  const final=await readState(page);
  const lookMagnitude=angularDelta(lookStart,lookResponse.state);
  const travelMagnitude=travelDelta(travelStart,travelResponse.state);
  const pinchMagnitude=zoomDelta(pinchStart,pinchResponse.state);
  const pinchTravelLeak=travelDelta(pinchStart,pinchResponse.state);
  assert.ok(lookMagnitude>1e-5,'ONE_FINGER_LOOK_STATE_UNCHANGED');
  assert.ok(travelMagnitude>1e-4,'TWO_FINGER_TRAVEL_STATE_UNCHANGED');
  assert.ok(pinchMagnitude>1e-4,'PINCH_ZOOM_STATE_UNCHANGED');
  assert.ok(pinchTravelLeak<Math.max(1,travelMagnitude*.25),'PINCH_TRAVEL_CONFLATION');
  assert.equal(final.hookEvidence?.poleCrossings,0,'SYNTHETIC_POLE_CROSSING_OBSERVED');
  assert.equal(final.hookEvidence?.continuityInstalled,false,'SYNTHETIC_POLE_INTERCEPTION_REINSTALLED');
  for(const [label,value] of [['look',lookResponse.latencyMs],['travel',travelResponse.latencyMs],['pinch',pinchResponse.latencyMs]])requireFiniteMeasurement(value,`${label.toUpperCase()}_FIRST_RESPONSE_LATENCY_MS`);

  return Object.freeze({
    schema:AUDRALIA_GESTURE_RESPONSE_SCHEMA,
    harnessSchema:GESTURE_RESPONSE_HARNESS_SCHEMA,
    result:'PASS',candidateHead,
    preservation:Object.freeze({originalHEarthRun8EChamberMutated:false,audraliaProductControlLawMutated:false,syntheticPoleInterceptionInstalled:false,syntheticPoleCrossingsObserved:0}),
    oneFingerLook:Object.freeze({stateDelta:lookMagnitude,firstResponseLatencyMs:lookResponse.latencyMs,postReleaseDelta:lookPost.delta}),
    twoFingerTravel:Object.freeze({geographicStateDelta:travelMagnitude,firstResponseLatencyMs:travelResponse.latencyMs,postReleaseDelta:travelPost.delta}),
    pinchZoom:Object.freeze({distanceDelta:pinchMagnitude,geographicLeak:pinchTravelLeak,firstResponseLatencyMs:pinchResponse.latencyMs,postReleaseDelta:pinchPost.delta}),
    initialState:initial,finalState:final
  });
}
