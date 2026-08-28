import assert from 'node:assert/strict';
import {GESTURE_RESPONSE_HARNESS_SCHEMA,dispatchTouchPointer,requireFiniteMeasurement} from '../../../../tools/interaction-response/gesture-response-harness-v1.mjs';

export const AUDRALIA_TRAVEL_SPATIAL_SCHEMA='AUDRALIA_TWO_FINGER_TRAVEL_SPATIAL_CONSISTENCY_RECEIPT_v1';
const SELECTOR='[data-h-earth-map-wide-canvas]';
const R=6200;
const MAX_TARGET_ARC=R*Math.PI*.9;
const NORTH=[0,.5,-.8660254037844386],MERIDIAN=[0,.8660254037844386,.5],EAST=[1,0,0];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const rad=deg=>deg*Math.PI/180;

export function targetFromLatLon(lat,lon){
  const cl=Math.cos(lat);
  const direction=[0,1,2].map(i=>EAST[i]*cl*Math.sin(lon)+MERIDIAN[i]*cl*Math.cos(lon)+NORTH[i]*Math.sin(lat));
  const d=norm(direction),angle=Math.acos(clamp(d[1],-1,1)),sine=Math.sin(angle);
  if(Math.abs(sine)<1e-9)return {targetU:0,targetV:0};
  return {targetU:R*angle*d[0]/sine,targetV:R*angle*d[2]/sine};
}

export function tangentDirection(targetU,targetV){
  const radius=Math.hypot(targetU,targetV);
  if(radius<1e-9)return [0,1,0];
  const angle=radius/R,sine=Math.sin(angle),cosine=Math.cos(angle);
  return norm([sine*targetU/radius,cosine,sine*targetV/radius]);
}

const sphericalArc=(a,b)=>R*Math.acos(clamp(dot(tangentDirection(a.targetU,a.targetV),tangentDirection(b.targetU,b.targetV)),-1,1));
const targetDelta=(a,b)=>({u:b.targetU-a.targetU,v:b.targetV-a.targetV,magnitude:Math.hypot(b.targetU-a.targetU,b.targetV-a.targetV)});

async function readState(page){
  return page.evaluate(()=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    const state=proof?.renderer?.getSnapshot?.();
    if(!state)throw new Error('AUDRALIA_TRAVEL_RENDERER_STATE_MISSING');
    return {targetU:Number(state.targetU),targetV:Number(state.targetV),distance:Number(state.distance),pitch:Number(state.pitch),yaw:Number(state.yaw)};
  });
}

async function center(page){
  return page.$eval(SELECTOR,node=>{const r=node.getBoundingClientRect();return {x:r.left+r.width*.5,y:r.top+r.height*.5,width:r.width,height:r.height};});
}

async function setState(page,state){
  await page.evaluate(state=>{
    const proof=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    if(typeof proof?.setCameraStateForTest!=='function')throw new Error('AUDRALIA_TRAVEL_TEST_CAMERA_SURFACE_MISSING');
    proof.setCameraStateForTest(state);
  },state);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  return readState(page);
}

async function solarVector(page){
  return page.evaluate(()=>window.__AUDRALIA_CELESTIAL_STATE__?.getSolarVector?.()||null);
}

async function dispatchTravel(page,{sign,pointerBase,c}){
  const y=c.y+56;
  const a=pointerBase,b=pointerBase+1;
  const offsets=[18,46,82].map(v=>sign*v);
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerdown',pointerId:a,x:c.x-35,y,isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerdown',pointerId:b,x:c.x+35,y,isPrimary:false});
  const trajectory=[await readState(page)];
  for(const offset of offsets){
    await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:a,x:c.x-35,y:y+offset,isPrimary:true});
    await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointermove',pointerId:b,x:c.x+35,y:y+offset,isPrimary:false});
    trajectory.push(await readState(page));
  }
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerup',pointerId:a,x:c.x-35,y:y+offsets.at(-1),isPrimary:true});
  await dispatchTouchPointer(page,{selector:SELECTOR,type:'pointerup',pointerId:b,x:c.x+35,y:y+offsets.at(-1),isPrimary:false});
  trajectory.push(await readState(page));
  return trajectory;
}

function summarizeTrajectory(trajectory){
  const start=trajectory[0],end=trajectory.at(-1),delta=targetDelta(start,end);
  const steps=[];
  let limiterObserved=false;
  for(let i=1;i<trajectory.length;i++){
    const prior=trajectory[i-1],next=trajectory[i],d=targetDelta(prior,next),arc=sphericalArc(prior,next),radius=Math.hypot(next.targetU,next.targetV);
    if(radius>=MAX_TARGET_ARC-1e-6)limiterObserved=true;
    steps.push({targetDelta:d,geodesicArc:arc,targetRadius:radius});
  }
  const geodesicArc=sphericalArc(start,end);
  const responseScale=delta.magnitude>1e-9?geodesicArc/delta.magnitude:null;
  return Object.freeze({start,end,targetDelta:delta,geodesicArc,responseScale,limiterObserved,steps:Object.freeze(steps)});
}

async function chooseDarkMidLatitude(page){
  const sun=await solarVector(page);
  const candidates=[-175,-155,-135,-115,-95,95,115,135,155,175].map(lon=>({lat:18,lon,...targetFromLatLon(rad(18),rad(lon))}));
  if(!Array.isArray(sun)||sun.length!==3)return {...candidates[3],sunDot:null};
  return candidates.map(candidate=>({...candidate,sunDot:dot(tangentDirection(candidate.targetU,candidate.targetV),sun)})).sort((a,b)=>a.sunDot-b.sunDot)[0];
}

function classifyRegion(id,start,forward,backward,baselineScale){
  const failures=[];
  if(!(forward.targetDelta.magnitude>1e-6)||!(backward.targetDelta.magnitude>1e-6))failures.push('DEFINITIVE_TWO_FINGER_TRAVEL_NO_MOVEMENT');
  const f=[forward.targetDelta.u,forward.targetDelta.v],b=[backward.targetDelta.u,backward.targetDelta.v];
  const opposition=(Math.hypot(...f)>1e-9&&Math.hypot(...b)>1e-9)?dot(norm(f),norm(b)):null;
  if(opposition!==null&&opposition>-.25)failures.push('DEFINITIVE_TWO_FINGER_TRAVEL_WRONG_DIRECTION');
  if(forward.limiterObserved||backward.limiterObserved)failures.push('DEFINITIVE_TWO_FINGER_TRAVEL_DISCONTINUITY');
  const scaleMean=[forward.responseScale,backward.responseScale].filter(Number.isFinite).reduce((a,b)=>a+b,0)/[forward.responseScale,backward.responseScale].filter(Number.isFinite).length;
  const baselineRatio=Number.isFinite(baselineScale)&&baselineScale>0&&Number.isFinite(scaleMean)?scaleMean/baselineScale:null;
  if(id!=='MID_LATITUDE_ILLUMINATED'&&Number.isFinite(baselineRatio)&&(baselineRatio<.5||baselineRatio>2))failures.push('DEFINITIVE_TWO_FINGER_TRAVEL_LOCATION_DEPENDENCE');
  return Object.freeze({id,start,forward,backward,opposition,meanGeodesicResponseScale:scaleMean,baselineRatio,failures:Object.freeze([...new Set(failures)])});
}

export async function runAudraliaTravelSpatialConsistencyDiagnostic(page,{candidateHead='UNKNOWN'}={}){
  const c=await center(page);
  assert.ok(c.width>100&&c.height>100,'AUDRALIA_TRAVEL_CANVAS_TOO_SMALL');
  const dark=await chooseDarkMidLatitude(page);
  const starts=[
    {id:'MID_LATITUDE_ILLUMINATED',lat:20,lon:10,...targetFromLatLon(rad(20),rad(10))},
    {id:'DARK_OR_NIGHT_SIDE',lat:dark.lat,lon:dark.lon,targetU:dark.targetU,targetV:dark.targetV,sunDot:dark.sunDot},
    {id:'HIGH_LATITUDE',lat:68,lon:20,...targetFromLatLon(rad(68),rad(20))},
    {id:'NEAR_POLAR',lat:84,lon:20,...targetFromLatLon(rad(84),rad(20))}
  ];
  const measurements=[];
  let baselineScale=null,pointerBase=2000;
  for(const start of starts){
    const state={targetU:start.targetU,targetV:start.targetV,distance:5000,pitch:1.02,yaw:0};
    const settled=await setState(page,state);
    const forward=summarizeTrajectory(await dispatchTravel(page,{sign:-1,pointerBase:pointerBase+=10,c}));
    await setState(page,state);
    const backward=summarizeTrajectory(await dispatchTravel(page,{sign:1,pointerBase:pointerBase+=10,c}));
    const provisional=classifyRegion(start.id,{...start,settled},forward,backward,baselineScale);
    if(start.id==='MID_LATITUDE_ILLUMINATED')baselineScale=provisional.meanGeodesicResponseScale;
    measurements.push(start.id==='MID_LATITUDE_ILLUMINATED'?classifyRegion(start.id,{...start,settled},forward,backward,baselineScale):provisional);
  }
  for(const measurement of measurements){
    requireFiniteMeasurement(measurement.forward.targetDelta.magnitude,`${measurement.id}_FORWARD_TARGET_DELTA`);
    requireFiniteMeasurement(measurement.backward.targetDelta.magnitude,`${measurement.id}_BACKWARD_TARGET_DELTA`);
    requireFiniteMeasurement(measurement.forward.geodesicArc,`${measurement.id}_FORWARD_GEODESIC_ARC`);
    requireFiniteMeasurement(measurement.backward.geodesicArc,`${measurement.id}_BACKWARD_GEODESIC_ARC`);
  }
  const failures=[...new Set(measurements.flatMap(x=>x.failures))];
  const firstDefinitiveFault=failures[0]||null;
  return Object.freeze({
    schema:AUDRALIA_TRAVEL_SPATIAL_SCHEMA,
    harnessSchema:GESTURE_RESPONSE_HARNESS_SCHEMA,
    result:firstDefinitiveFault?'PRODUCT_FAULT_ESTABLISHED':'NO_DEFINITIVE_TRAVEL_FAULT',
    candidateHead,
    blockingScope:'TWO_FINGER_GEOGRAPHIC_TRAVEL_ONLY',
    nonBlocking:Object.freeze(['LOOK_ROTATION','PINCH_ZOOM','FIRST_RESPONSE_LATENCY','POST_RELEASE_DRIFT','HOST_BROWSER_WEBGL_CDP_TIMEOUT_FLAGS']),
    geometry:Object.freeze({planetRadius:R,maxTargetArc:MAX_TARGET_ARC,coordinateModel:'GRATITUDE_CENTERED_TANGENT_PLANE_EXPONENTIAL_MAP'}),
    measurements:Object.freeze(measurements),
    firstDefinitiveFault,
    failures:Object.freeze(failures)
  });
}
