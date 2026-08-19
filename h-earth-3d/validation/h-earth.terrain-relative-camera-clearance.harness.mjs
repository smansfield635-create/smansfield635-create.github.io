#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS,
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState,
  resolveHEarthNavigableTerrainChunk
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import {
  H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
  H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
  H_EARTH_CAMERA_VOLUME_CLEARANCE_PROTECTED_PARENT,
  H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID,
  sampleHEarthVisibleTerrainClearanceSurface,
  sampleHEarthVisibleTerrainClearanceEnvelope
} from '../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js';

const OPERATION_ID='H_EARTH_CAMERA_VOLUME_CLEARANCE_SUCCESSOR_20260818_003';
const EXPECTED_PARENT='d9d4c0ada0d97e98340c3b771a23153cef1ecb00';
const EXPECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';
const EXPECTED_CANONICAL_TERRAIN_BLOB='f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const EXPECTED_LANDSCAPE_PREVIEW_BLOB='d77990da529790f9389c9a29551b7f36bb9afa3e';
const EXPECTED_PREDECESSOR_NAVIGATION_BLOB='2e216f4e72c1356f52393de02bca97d64188bea7';
const blobSha=p=>{const b=fs.readFileSync(new URL(p,import.meta.url));return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex')};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const issues=[];
const traces=[];
const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
function assert(condition,code){if(!condition)issues.push(code)}

function independentCameraVolumeAudit(state){
  const yaw=state.yawDegrees*Math.PI/180,forward={x:Math.sin(yaw),z:-Math.cos(yaw)},right={x:Math.cos(yaw),z:Math.sin(yaw)};
  const distances=[0,.25,.5,.75,1,1.5,2.5,4,6,8,10];
  const fractions=[-1,-.8,-.6,-.4,-.2,0,.2,.4,.6,.8,1];
  const radius=4.2,samples=[];
  for(const distance of distances){
    const localRadius=Math.max(p.clearanceFootprintRadius,radius*(1-.02*distance));
    for(const fraction of fractions){
      const lateral=localRadius*fraction,x=state.position.x+forward.x*distance+right.x*lateral,z=state.position.z+forward.z*distance+right.z*lateral;
      const sample=sampleHEarthVisibleTerrainClearanceSurface(x,z);
      samples.push({distance,lateral,sample});
    }
  }
  const valid=samples.filter(x=>x.sample.valid===true);
  const critical=samples.filter(x=>x.distance<=5);
  const criticalValid=critical.filter(x=>x.sample.valid===true);
  const coverage=valid.length/samples.length,criticalCoverage=criticalValid.length/critical.length;
  const max=valid.length?Math.max(...valid.map(x=>x.sample.visibleElevation)):Infinity;
  const clearance=state.position.y-max;
  return {safe:coverage>=.72&&criticalCoverage>=.9&&clearance>=p.minimumTerrainClearance-1e-8,coverage,criticalCoverage,maxVisibleElevation:max,clearance,sampleCount:samples.length,validCount:valid.length};
}
function checkState(state,label){
  const evaluation=evaluateHEarthFunctionalLandscapeNavigationState(state);
  const production=sampleHEarthVisibleTerrainClearanceEnvelope(state.position.x,state.position.z,{yawDegrees:state.yawDegrees,lookAheadDistance:p.lookAheadClearanceDistance,lateralRadius:p.clearanceFootprintRadius});
  const independent=independentCameraVolumeAudit(state);
  const productionSafe=production.valid&&state.position.y>=production.visibleElevation+p.minimumTerrainClearance-1e-8;
  const safe=productionSafe&&independent.safe&&evaluation.eligible===true;
  if(!safe)issues.push(`${label}:CAMERA_VOLUME_TERRAIN_INTERSECTION_OR_STATE_FAIL`);
  if(production.valid&&production.sampleCount<60)issues.push(`${label}:PRODUCTION_CAMERA_VOLUME_SAMPLING_TOO_SPARSE`);
  if(Math.abs(state.verticalDelta??0)>Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8)issues.push(`${label}:VERTICAL_CHANGE_BOUND_EXCEEDED`);
  return {safe,productionSafe,independentSafe:independent.safe,productionClearance:production.valid?state.position.y-production.visibleElevation:null,independentClearance:independent.clearance,productionSampleCount:production.sampleCount??0,independentCoverage:independent.coverage,criticalCoverage:independent.criticalCoverage,verticalDelta:state.verticalDelta??0,verticalAcceleration:state.verticalAcceleration??0,response:state.verticalResponseMode};
}
function initial(){const r=createHEarthFunctionalLandscapeNavigationState();if(!r.ok)throw new Error(`INITIAL_STATE_FAILED:${r.issues}`);return r.state}
function moveTo(state,target,{step=1.5,label='TRACE'}={}){
  const dist=Math.hypot(target.x-state.position.x,target.z-state.position.z),n=Math.max(1,Math.ceil(dist/step)),samples=[];
  for(let i=1;i<=n;i++){
    const x=state.position.x+(target.x-state.position.x)/(n-i+1),z=state.position.z+(target.z-state.position.z)/(n-i+1);
    const r=proposeHEarthFunctionalLandscapeNavigation(state,{action:'SET_CAMERA_POSITION',position:{x,y:state.position.y,z}});
    if(!r.ok){issues.push(`${label}:MOVEMENT_REJECTED:${r.issues.join('|')}`);return {state,samples,complete:false};}
    state=r.state;samples.push(checkState(state,label));
  }
  return {state,samples,complete:true};
}
function settle(state,{count=30,label='SETTLE'}={}){const samples=[];for(let i=0;i<count;i++){const r=proposeHEarthFunctionalLandscapeNavigation(state,{action:'NO_OP'});if(!r.ok){issues.push(`${label}:NO_OP_REJECTED`);break;}state=r.state;samples.push(checkState(state,label));}return {state,samples}}
function traceBetween(name,startWaypoint,endWaypoint){
  let state=initial();
  const start=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[startWaypoint].position,a=moveTo(state,start,{label:name+':START'});state=a.state;
  const startElevation=sampleHEarthVisibleTerrainClearanceSurface(state.position.x,state.position.z).visibleElevation;
  const end=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[endWaypoint].position,b=moveTo(state,end,{label:name});state=b.state;
  const endElevation=sampleHEarthVisibleTerrainClearanceSurface(state.position.x,state.position.z).visibleElevation,s=settle(state,{label:name+':SETTLE'});state=s.state;
  traces.push({name,startWaypoint,endWaypoint,complete:a.complete&&b.complete,startElevation,endElevation,netElevationChange:endElevation-startElevation,samples:[...a.samples,...b.samples,...s.samples],finalClearance:state.clearance,targetError:Math.abs(state.position.y-state.targetCameraY)});
  return state;
}

assert(H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR===EXPECTED_FLOOR,'PROTECTED_FLOOR_CONSTANT_MISMATCH');
assert(H_EARTH_CAMERA_VOLUME_CLEARANCE_PROTECTED_PARENT===EXPECTED_PARENT,'PROTECTED_PARENT_CONSTANT_MISMATCH');
assert(typeof H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID==='string','CAMERA_VOLUME_CONTRACT_MISSING');
assert(blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,'CANONICAL_TERRAIN_BLOB_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,'GEN311_LANDSCAPE_PREVIEW_BLOB_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/functional-landscape/navigation.js')===EXPECTED_PREDECESSOR_NAVIGATION_BLOB,'PREDECESSOR_NAVIGATION_BEHAVIOR_DRIFT');
let coverage=0;
for(let z=-224;z<=-104;z+=8)for(let x=-160;x<=160;x+=8){if(!resolveHEarthNavigableTerrainChunk(x,z))continue;const s=sampleHEarthVisibleTerrainClearanceSurface(x,z);if(s.valid){coverage++;if(s.contractId!==H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID)issues.push('VISIBLE_SURFACE_CONTRACT_MISMATCH')}}
assert(coverage>=100,'VISIBLE_TERRAIN_SAMPLE_COVERAGE_INSUFFICIENT');

traceBetween('SUSTAINED_UPHILL','COAST','RIDGE');
traceBetween('SUSTAINED_DESCENT','RIDGE','COAST');
traceBetween('VALLEY_CROSSING','LOWLAND','HILL');
traceBetween('PASS_CROSSING','HILL','RIDGE');
let steep=traceBetween('STEEP_SLOPE_ADJACENCY','HILL','RIDGE');
for(let i=0;i<12;i++){const r=proposeHEarthFunctionalLandscapeNavigation(steep,{action:i%2?'STRAFE_LEFT':'STRAFE_RIGHT',magnitude:.75});if(r.ok){steep=r.state;checkState(steep,'STEEP_SLOPE_ADJACENCY:STRAFE')}else if(!String(r.state?.rejectionReason??'').includes('UPHILL'))issues.push('STEEP_SLOPE_ADJACENCY:UNEXPECTED_REJECTION')}
let rotation=traceBetween('ROTATION_BESIDE_RISING_RELIEF','HILL','RIDGE'),rotationSamples=[];
for(let i=0;i<60;i++){const r=proposeHEarthFunctionalLandscapeNavigation(rotation,{action:'TURN_RIGHT',degrees:6});if(!r.ok){issues.push('ROTATION_BESIDE_RISING_RELIEF:TURN_REJECTED');break}rotation=r.state;rotationSamples.push(checkState(rotation,'ROTATION_BESIDE_RISING_RELIEF'))}
traces.push({name:'ROTATION_BESIDE_RISING_RELIEF_DYNAMIC',complete:rotationSamples.length===60,samples:rotationSamples});
let reversal=traceBetween('DIRECTION_REVERSAL_ON_GRADE','LOWLAND','HILL'),reversalSamples=[];
for(const action of ['MOVE_FORWARD','MOVE_FORWARD','MOVE_FORWARD','MOVE_BACKWARD','MOVE_BACKWARD','MOVE_BACKWARD']){const r=proposeHEarthFunctionalLandscapeNavigation(reversal,{action,magnitude:2});if(!r.ok){issues.push(`DIRECTION_REVERSAL_ON_GRADE:${action}_REJECTED`);break}reversal=r.state;reversalSamples.push(checkState(reversal,'DIRECTION_REVERSAL_ON_GRADE'))}
traces.push({name:'DIRECTION_REVERSAL_ON_GRADE_DYNAMIC',complete:reversalSamples.length===6,samples:reversalSamples});

// Dedicated camera-volume stress: rotate through a full circle while near relief,
// then alternate short forward/strafe impulses. This is intended to catch the
// owner-observed class where sparse height samples pass while the view volume
// enters a steep slope.
let stress=traceBetween('CAMERA_VOLUME_FRUSTUM_STRESS','LOWLAND','HILL'),stressSamples=[];
for(let i=0;i<72;i++){
  const action=i%4===0?'STRAFE_RIGHT':i%4===2?'MOVE_FORWARD':'TURN_RIGHT';
  const intent=action==='TURN_RIGHT'?{action,degrees:5}:{action,magnitude:.65};
  const r=proposeHEarthFunctionalLandscapeNavigation(stress,intent);
  if(!r.ok){stressSamples.push({safe:true,rejected:true,response:r.state?.rejectionReason??'REJECTED'});continue}
  stress=r.state;stressSamples.push(checkState(stress,'CAMERA_VOLUME_FRUSTUM_STRESS'));
}
traces.push({name:'CAMERA_VOLUME_FRUSTUM_STRESS_DYNAMIC',complete:stressSamples.length===72,samples:stressSamples});

const allSamples=traces.flatMap(t=>t.samples??[]),checked=allSamples.filter(s=>s.rejected!==true);
assert(checked.length>120,'TRACE_SAMPLE_COUNT_INSUFFICIENT');
assert(checked.every(s=>s.safe===true),'ZERO_CAMERA_VOLUME_PENETRATION_INVARIANT_FAILED');
assert(checked.every(s=>s.independentSafe===true),'INDEPENDENT_CAMERA_VOLUME_AUDIT_FAILED');
assert(checked.every(s=>(s.productionSampleCount??60)>=60),'DENSE_PRODUCTION_VOLUME_SAMPLING_NOT_PROVEN');
assert(checked.every(s=>finite(s.verticalDelta)&&finite(s.verticalAcceleration)),'VERTICAL_DYNAMICS_NONFINITE');
assert(checked.every(s=>Math.abs(s.verticalDelta)<=Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8),'VERTICAL_VELOCITY_BOUND_FAILED');
const descending=traces.find(t=>t.name==='SUSTAINED_DESCENT');
assert(descending?.targetError<=p.clearanceDeadband+0.02,'DOWNHILL_RESTORATION_DID_NOT_SETTLE');
assert(checked.some(s=>s.response==='DEADBAND_HOLD'),'HYSTERESIS_DEADBAND_NOT_EXERCISED');
assert(traces.filter(t=>t.complete).length>=8,'REQUIRED_TRACE_BATTERY_INCOMPLETE');

const receipt={schema:'H_EARTH_CAMERA_VOLUME_CLEARANCE_QUALIFICATION_RECEIPT_v1',operationId:OPERATION_ID,protectedParentHead:EXPECTED_PARENT,protectedGeographicFloor:EXPECTED_FLOOR,result:issues.length?'FAIL':'PASS',checks:{protectedParentNavigationPreserved:blobSha('../../showroom/globe/h-earth/functional-landscape/navigation.js')===EXPECTED_PREDECESSOR_NAVIGATION_BLOB,protectedGen311TerrainPreserved:blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,canonicalTerrainPreserved:blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,cameraVolumeSamplerBound:H_EARTH_CAMERA_VOLUME_CLEARANCE_PROTECTED_PARENT===EXPECTED_PARENT,zeroCameraVolumePenetration:checked.every(s=>s.safe===true),independentCameraVolumeAudit:checked.every(s=>s.independentSafe===true),denseProductionVolumeSampling:checked.every(s=>(s.productionSampleCount??60)>=60),boundedVerticalChange:checked.every(s=>Math.abs(s.verticalDelta)<=Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8),downhillRestoration:descending?.targetError<=p.clearanceDeadband+0.02,hysteresisDeadbandExercised:checked.some(s=>s.response==='DEADBAND_HOLD'),frustumStressBattery:traces.some(t=>t.name==='CAMERA_VOLUME_FRUSTUM_STRESS_DYNAMIC'&&t.complete),navigationScaleAuthorityCreated:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false},diagnostics:{sampleCoverage:coverage,traceCount:traces.length,traceSampleCount:checked.length,profile:p,traces:traces.map(t=>({name:t.name,complete:t.complete,startElevation:t.startElevation,endElevation:t.endElevation,netElevationChange:t.netElevationChange,finalClearance:t.finalClearance,targetError:t.targetError,sampleCount:t.samples?.length??0}))},issues};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
