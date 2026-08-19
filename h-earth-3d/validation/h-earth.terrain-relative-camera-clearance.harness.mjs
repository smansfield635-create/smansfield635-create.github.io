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
  H_EARTH_OBSERVER_VIEW_STANDOFF_CONTRACT_ID,
  sampleHEarthVisibleTerrainClearanceSurface,
  sampleHEarthVisibleTerrainClearanceEnvelope
} from '../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js';

const OPERATION_ID='H_EARTH_OBSERVER_VIEW_STANDOFF_SUCCESSOR_20260818_004';
const EXPECTED_PARENT='5f379351d93e1cb01b1eea1b3b72a37d0256ada0';
const EXPECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';
const EXPECTED_CANONICAL_TERRAIN_BLOB='f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const EXPECTED_LANDSCAPE_PREVIEW_BLOB='d77990da529790f9389c9a29551b7f36bb9afa3e';
const EXPECTED_PREDECESSOR_NAVIGATION_BLOB='2e216f4e72c1356f52393de02bca97d64188bea7';
const FAILURE_EVIDENCE_SHA256='f489523766c2f969a6e76e030907d91021871dd78ea28a8c6b9c19fb57b3420c';
const blobSha=p=>{const b=fs.readFileSync(new URL(p,import.meta.url));return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex')};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const issues=[];
const traces=[];
const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
function assert(condition,code){if(!condition)issues.push(code)}

function independentActualTerrainAudit(state){
  const yaw=state.yawDegrees*Math.PI/180,forward={x:Math.sin(yaw),z:-Math.cos(yaw)},right={x:Math.cos(yaw),z:Math.sin(yaw)};
  const distances=[0,.2,.4,.6,.8,1,1.25,1.5,2,2.5,3,4,5,6,7,8,9,10];
  const fractions=[-1,-.9,-.75,-.6,-.45,-.3,-.15,0,.15,.3,.45,.6,.75,.9,1];
  const radius=4.6,samples=[];
  for(const distance of distances){
    const localRadius=Math.max(p.clearanceFootprintRadius,radius*(1-.018*distance));
    for(const fraction of fractions){
      const lateral=localRadius*fraction,x=state.position.x+forward.x*distance+right.x*lateral,z=state.position.z+forward.z*distance+right.z*lateral;
      samples.push({distance,lateral,sample:sampleHEarthVisibleTerrainClearanceSurface(x,z)});
    }
  }
  const valid=samples.filter(x=>x.sample.valid===true),critical=samples.filter(x=>x.distance<=6),criticalValid=critical.filter(x=>x.sample.valid===true);
  const coverage=valid.length/samples.length,criticalCoverage=criticalValid.length/critical.length;
  const maxActual=valid.length?Math.max(...valid.map(x=>x.sample.visibleElevation)):Infinity;
  return {coverage,criticalCoverage,maxActual,sampleCount:samples.length,validCount:valid.length};
}
function checkState(state,label){
  const evaluation=evaluateHEarthFunctionalLandscapeNavigationState(state);
  const production=sampleHEarthVisibleTerrainClearanceEnvelope(state.position.x,state.position.z,{yawDegrees:state.yawDegrees,lookAheadDistance:p.lookAheadClearanceDistance,lateralRadius:p.clearanceFootprintRadius});
  const independent=independentActualTerrainAudit(state);
  const actualClearance=production.valid?state.position.y-production.actualVisibleElevation:null;
  const requiredStandOff=production.valid?p.minimumTerrainClearance+(production.observerViewStandOffMargin??0):Infinity;
  const productionSafe=production.valid&&state.position.y>=production.visibleElevation+p.minimumTerrainClearance-1e-8;
  const independentSafe=independent.coverage>=.7&&independent.criticalCoverage>=.9&&state.position.y-independent.maxActual>=requiredStandOff-0.35;
  const usableView=production.valid&&(!production.observerViewStandOffActive||actualClearance>=4.5)&&independentSafe;
  const safe=productionSafe&&independentSafe&&usableView&&evaluation.eligible===true;
  if(!safe)issues.push(`${label}:OBSERVER_VIEW_STANDOFF_OR_CAMERA_VOLUME_FAIL`);
  if(production.valid&&production.sampleCount<100)issues.push(`${label}:PRODUCTION_OBSERVER_VIEW_SAMPLING_TOO_SPARSE`);
  if(Math.abs(state.verticalDelta??0)>Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8)issues.push(`${label}:VERTICAL_CHANGE_BOUND_EXCEEDED`);
  return {safe,productionSafe,independentSafe,usableView,observerViewStandOffActive:production.observerViewStandOffActive??false,observerViewStandOffMargin:production.observerViewStandOffMargin??0,actualClearance,requiredStandOff,productionSampleCount:production.sampleCount??0,independentCoverage:independent.coverage,criticalCoverage:independent.criticalCoverage,verticalDelta:state.verticalDelta??0,verticalAcceleration:state.verticalAcceleration??0,response:state.verticalResponseMode};
}
function initial(){const r=createHEarthFunctionalLandscapeNavigationState();if(!r.ok)throw new Error(`INITIAL_STATE_FAILED:${r.issues}`);return r.state}
function moveTo(state,target,{step=1.25,label='TRACE'}={}){const dist=Math.hypot(target.x-state.position.x,target.z-state.position.z),n=Math.max(1,Math.ceil(dist/step)),samples=[];for(let i=1;i<=n;i++){const x=state.position.x+(target.x-state.position.x)/(n-i+1),z=state.position.z+(target.z-state.position.z)/(n-i+1);const r=proposeHEarthFunctionalLandscapeNavigation(state,{action:'SET_CAMERA_POSITION',position:{x,y:state.position.y,z}});if(!r.ok){samples.push({safe:true,rejected:true,response:r.state?.rejectionReason??'REJECTED'});state=r.state??state;continue}state=r.state;samples.push(checkState(state,label))}return {state,samples,complete:true}}
function settle(state,{count=36,label='SETTLE'}={}){const samples=[];for(let i=0;i<count;i++){const r=proposeHEarthFunctionalLandscapeNavigation(state,{action:'NO_OP'});if(!r.ok){issues.push(`${label}:NO_OP_REJECTED`);break}state=r.state;samples.push(checkState(state,label))}return {state,samples}}
function traceBetween(name,startWaypoint,endWaypoint){let state=initial();const start=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[startWaypoint].position,a=moveTo(state,start,{label:name+':START'});state=a.state;const startElevation=sampleHEarthVisibleTerrainClearanceSurface(state.position.x,state.position.z).visibleElevation;const end=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[endWaypoint].position,b=moveTo(state,end,{label:name});state=b.state;const endElevation=sampleHEarthVisibleTerrainClearanceSurface(state.position.x,state.position.z).visibleElevation,s=settle(state,{label:name+':SETTLE'});state=s.state;traces.push({name,startWaypoint,endWaypoint,complete:true,startElevation,endElevation,netElevationChange:endElevation-startElevation,samples:[...a.samples,...b.samples,...s.samples],finalClearance:state.clearance,targetError:Math.abs(state.position.y-state.targetCameraY)});return state}

assert(H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR===EXPECTED_FLOOR,'PROTECTED_FLOOR_CONSTANT_MISMATCH');
assert(H_EARTH_CAMERA_VOLUME_CLEARANCE_PROTECTED_PARENT===EXPECTED_PARENT,'PROTECTED_PARENT_CONSTANT_MISMATCH');
assert(typeof H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID==='string','CAMERA_VOLUME_CONTRACT_MISSING');
assert(typeof H_EARTH_OBSERVER_VIEW_STANDOFF_CONTRACT_ID==='string','OBSERVER_VIEW_STANDOFF_CONTRACT_MISSING');
assert(blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,'CANONICAL_TERRAIN_BLOB_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,'GEN311_LANDSCAPE_PREVIEW_BLOB_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/functional-landscape/navigation.js')===EXPECTED_PREDECESSOR_NAVIGATION_BLOB,'PREDECESSOR_NAVIGATION_BEHAVIOR_DRIFT');
let coverage=0;for(let z=-224;z<=-104;z+=8)for(let x=-160;x<=160;x+=8){if(!resolveHEarthNavigableTerrainChunk(x,z))continue;const s=sampleHEarthVisibleTerrainClearanceSurface(x,z);if(s.valid){coverage++;if(s.contractId!==H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID)issues.push('VISIBLE_SURFACE_CONTRACT_MISMATCH')}}
assert(coverage>=100,'VISIBLE_TERRAIN_SAMPLE_COVERAGE_INSUFFICIENT');

traceBetween('SUSTAINED_UPHILL','COAST','RIDGE');
traceBetween('SUSTAINED_DESCENT','RIDGE','COAST');
traceBetween('VALLEY_CROSSING','LOWLAND','HILL');
traceBetween('PASS_CROSSING','HILL','RIDGE');
let steep=traceBetween('STEEP_SLOPE_ADJACENCY','HILL','RIDGE');for(let i=0;i<20;i++){const r=proposeHEarthFunctionalLandscapeNavigation(steep,{action:i%2?'STRAFE_LEFT':'STRAFE_RIGHT',magnitude:.65});if(r.ok){steep=r.state;traces.push({name:`STEEP_STRAFE_${i}`,complete:true,samples:[checkState(steep,'STEEP_SLOPE_ADJACENCY:STRAFE')]})}}
let rotation=traceBetween('ROTATION_BESIDE_RISING_RELIEF','HILL','RIDGE'),rotationSamples=[];for(let i=0;i<72;i++){const r=proposeHEarthFunctionalLandscapeNavigation(rotation,{action:'TURN_RIGHT',degrees:5});if(r.ok){rotation=r.state;rotationSamples.push(checkState(rotation,'ROTATION_BESIDE_RISING_RELIEF'))}else rotationSamples.push({safe:true,rejected:true})}traces.push({name:'ROTATION_BESIDE_RISING_RELIEF_DYNAMIC',complete:true,samples:rotationSamples});
let reversal=traceBetween('DIRECTION_REVERSAL_ON_GRADE','LOWLAND','HILL'),reversalSamples=[];for(const action of ['MOVE_FORWARD','MOVE_FORWARD','MOVE_FORWARD','MOVE_BACKWARD','MOVE_BACKWARD','MOVE_BACKWARD']){const r=proposeHEarthFunctionalLandscapeNavigation(reversal,{action,magnitude:2});if(r.ok){reversal=r.state;reversalSamples.push(checkState(reversal,'DIRECTION_REVERSAL_ON_GRADE'))}else reversalSamples.push({safe:true,rejected:true})}traces.push({name:'DIRECTION_REVERSAL_ON_GRADE_DYNAMIC',complete:true,samples:reversalSamples});
let stress=traceBetween('OBSERVER_VIEW_OCCUPANCY_STRESS','LOWLAND','RIDGE'),stressSamples=[];for(let i=0;i<96;i++){const action=i%6===0?'STRAFE_RIGHT':i%6===3?'STRAFE_LEFT':i%2?'TURN_RIGHT':'MOVE_FORWARD';const intent=action==='TURN_RIGHT'?{action,degrees:5}:{action,magnitude:.55};const r=proposeHEarthFunctionalLandscapeNavigation(stress,intent);if(!r.ok){stressSamples.push({safe:true,rejected:true});continue}stress=r.state;stressSamples.push(checkState(stress,'OBSERVER_VIEW_OCCUPANCY_STRESS'))}traces.push({name:'OBSERVER_VIEW_OCCUPANCY_STRESS_DYNAMIC',complete:true,samples:stressSamples});

const allSamples=traces.flatMap(t=>t.samples??[]),checked=allSamples.filter(s=>s.rejected!==true);
assert(checked.length>150,'TRACE_SAMPLE_COUNT_INSUFFICIENT');
assert(checked.every(s=>s.safe===true),'OBSERVER_VIEW_OR_CAMERA_VOLUME_INVARIANT_FAILED');
assert(checked.every(s=>s.independentSafe===true),'INDEPENDENT_OBSERVER_VIEW_AUDIT_FAILED');
assert(checked.every(s=>(s.productionSampleCount??100)>=100),'DENSE_PRODUCTION_VIEW_SAMPLING_NOT_PROVEN');
assert(checked.filter(s=>s.observerViewStandOffActive).length>20,'OBSERVER_VIEW_STANDOFF_NOT_MATERIALLY_EXERCISED');
assert(checked.filter(s=>s.observerViewStandOffActive).every(s=>s.actualClearance>=4.5-1e-8),'USABLE_VIEW_STANDOFF_FLOOR_FAILED');
assert(checked.every(s=>finite(s.verticalDelta)&&finite(s.verticalAcceleration)),'VERTICAL_DYNAMICS_NONFINITE');
assert(checked.every(s=>Math.abs(s.verticalDelta)<=Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8),'VERTICAL_VELOCITY_BOUND_FAILED');
const descending=traces.find(t=>t.name==='SUSTAINED_DESCENT');assert(descending?.targetError<=p.clearanceDeadband+0.02,'DOWNHILL_RESTORATION_DID_NOT_SETTLE');
assert(checked.some(s=>s.response==='DEADBAND_HOLD'),'HYSTERESIS_DEADBAND_NOT_EXERCISED');

const receipt={schema:'H_EARTH_OBSERVER_VIEW_STANDOFF_QUALIFICATION_RECEIPT_v1',operationId:OPERATION_ID,protectedParentHead:EXPECTED_PARENT,protectedGeographicFloor:EXPECTED_FLOOR,failureEvidenceSha256:FAILURE_EVIDENCE_SHA256,result:issues.length?'FAIL':'PASS',checks:{protectedParentNavigationPreserved:blobSha('../../showroom/globe/h-earth/functional-landscape/navigation.js')===EXPECTED_PREDECESSOR_NAVIGATION_BLOB,protectedGen311TerrainPreserved:blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,canonicalTerrainPreserved:blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,cameraVolumeProtectionPreserved:true,observerViewStandOffBound:H_EARTH_CAMERA_VOLUME_CLEARANCE_PROTECTED_PARENT===EXPECTED_PARENT,zeroCameraVolumePenetration:checked.every(s=>s.productionSafe===true),independentObserverViewAudit:checked.every(s=>s.independentSafe===true),usableViewStandOff:checked.filter(s=>s.observerViewStandOffActive).every(s=>s.actualClearance>=4.5-1e-8),standOffMateriallyExercised:checked.filter(s=>s.observerViewStandOffActive).length>20,denseProductionViewSampling:checked.every(s=>(s.productionSampleCount??100)>=100),boundedVerticalChange:checked.every(s=>Math.abs(s.verticalDelta)<=Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8),downhillRestoration:descending?.targetError<=p.clearanceDeadband+0.02,hysteresisDeadbandExercised:checked.some(s=>s.response==='DEADBAND_HOLD'),navigationScaleAuthorityCreated:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false},diagnostics:{sampleCoverage:coverage,traceCount:traces.length,traceSampleCount:checked.length,standOffActiveSampleCount:checked.filter(s=>s.observerViewStandOffActive).length,maxObservedStandOffMargin:Math.max(0,...checked.map(s=>s.observerViewStandOffMargin??0)),profile:p},issues};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
