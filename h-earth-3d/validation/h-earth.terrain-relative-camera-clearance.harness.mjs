#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS,
  H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID,
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState,
  resolveHEarthNavigableTerrainChunk,
  resolveHEarthSweptTerrainTraversal
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import {
  H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
  H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID,
  H_EARTH_OBSERVER_VIEW_STANDOFF_CONTRACT_ID,
  sampleHEarthVisibleTerrainClearanceSurface,
  sampleHEarthVisibleTerrainClearanceEnvelope
} from '../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js';

const OPERATION_ID='H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_SUCCESSOR_20260818_001';
const EXPECTED_PARENT='a233238aaa013109ced14b5e5ceeb3fcc2d083d3';
const EXPECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';
const FAILURE_EVIDENCE_SHA256='7d4d8cc9298d5e162bb797a186690643838affe12adf38d2861bfbe0f370c0ae';
const EXPECTED_CANONICAL_TERRAIN_BLOB='f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const EXPECTED_LANDSCAPE_PREVIEW_BLOB='d77990da529790f9389c9a29551b7f36bb9afa3e';
const EXPECTED_PARENT_CLEARANCE_BLOB='f2a001dc2ec6fc821bcbf9888f51d4064f028241';
const blobSha=p=>{const b=fs.readFileSync(new URL(p,import.meta.url));return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex')};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const issues=[];
const diagnostics={acceptedStates:0,rejectedStates:0,sweptAcceptedStates:0,totalSweptSamples:0,climbTransitions:0,descentTransitions:0,steepRejections:0,longSweepChecks:0};
const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
function assert(condition,code){if(!condition&&!issues.includes(code))issues.push(code)}
function sameXZ(a,b,eps=1e-9){return Math.abs(a.x-b.x)<=eps&&Math.abs(a.z-b.z)<=eps}
function surface(x,z){return sampleHEarthVisibleTerrainClearanceSurface(x,z)}
function initial(waypointId='COAST'){const r=createHEarthFunctionalLandscapeNavigationState({waypointId});if(!r.ok)throw new Error(`INITIAL_STATE_FAILED:${waypointId}:${r.issues}`);return r.state}

function auditState(state,label){
  const evaluation=evaluateHEarthFunctionalLandscapeNavigationState(state);
  const actual=surface(state.position.x,state.position.z);
  const envelope=sampleHEarthVisibleTerrainClearanceEnvelope(state.position.x,state.position.z,{yawDegrees:state.yawDegrees,lookAheadDistance:p.lookAheadClearanceDistance,lateralRadius:p.clearanceFootprintRadius});
  const actualSafe=actual.valid===true&&state.position.y>=actual.visibleElevation+p.minimumTerrainClearance-1e-8;
  const envelopeSafe=envelope.valid===true&&state.position.y>=envelope.visibleElevation+p.minimumTerrainClearance-1e-8;
  const interiorUnreachable=state.traversal?.interiorTransitionRepresentable!==true;
  const safe=evaluation.eligible===true&&actualSafe&&envelopeSafe&&interiorUnreachable;
  if(!safe)issues.push(`${label}:ACCEPTED_STATE_NOT_EXTERIOR_SAFE`);
  if(state.terrainConformingLocomotionContractId!==H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID)issues.push(`${label}:LOCOMOTION_CONTRACT_MISSING`);
  diagnostics.acceptedStates++;
  if(state.traversal?.sweptBeforePositionAcceptance){diagnostics.sweptAcceptedStates++;diagnostics.totalSweptSamples+=state.traversal.sweptTerrainSampleCount??0;}
  return {safe,actualTerrainY:actual.visibleElevation,envelopeY:envelope.visibleElevation,cameraY:state.position.y,traversal:state.traversal};
}
function attemptSet(state,target,label){
  const before=state;
  const r=proposeHEarthFunctionalLandscapeNavigation(state,{action:'SET_CAMERA_POSITION',position:{x:target.x,y:state.position.y,z:target.z}});
  if(r.ok){auditState(r.state,label);return {accepted:true,state:r.state,before,result:r};}
  diagnostics.rejectedStates++;
  const held=r.state??state;
  assert(sameXZ(held.position,before.position),`${label}:REJECTION_CHANGED_XZ`);
  auditState(held,`${label}:HELD`);
  return {accepted:false,state:held,before,result:r};
}

assert(H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR===EXPECTED_FLOOR,'PROTECTED_GEOGRAPHIC_FLOOR_MISMATCH');
assert(typeof H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID==='string','CAMERA_VOLUME_CONTRACT_MISSING');
assert(typeof H_EARTH_OBSERVER_VIEW_STANDOFF_CONTRACT_ID==='string','OBSERVER_VIEW_STANDOFF_CONTRACT_MISSING');
assert(typeof H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID==='string','TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_MISSING');
assert(blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,'CANONICAL_TERRAIN_BLOB_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,'GEN311_LANDSCAPE_PREVIEW_BLOB_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js')===EXPECTED_PARENT_CLEARANCE_BLOB,'CAMERA_VOLUME_OR_OBSERVER_STANDOFF_PROTECTION_DRIFT');

let terrainCoverage=0;
for(let z=-224;z<=-104;z+=8)for(let x=-160;x<=160;x+=8){if(!resolveHEarthNavigableTerrainChunk(x,z))continue;const s=surface(x,z);if(s.valid)terrainCoverage++;}
assert(terrainCoverage>=100,'VISIBLE_TERRAIN_SAMPLE_COVERAGE_INSUFFICIENT');

function discoverLocalFromWaypoint({kind}){
  const waypointIds=Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS);
  const distances=[1,2,3,4,5,6,8,10,12];
  const angles=Array.from({length:32},(_,i)=>i*Math.PI*2/32);
  for(const waypointId of waypointIds){
    const state=initial(waypointId),a=surface(state.position.x,state.position.z);
    if(!a.valid)continue;
    for(const distance of distances)for(const angle of angles){
      const end={x:state.position.x+Math.cos(angle)*distance,z:state.position.z+Math.sin(angle)*distance};
      if(!resolveHEarthNavigableTerrainChunk(end.x,end.z))continue;
      const b=surface(end.x,end.z);if(!b.valid)continue;
      const sweep=resolveHEarthSweptTerrainTraversal(state.position,end),rise=b.visibleElevation-a.visibleElevation;
      if(kind==='climb'&&sweep.traversable&&rise>0.4)return {waypointId,state,end,rise,sweep};
      if(kind==='steep'&&!sweep.traversable&&sweep.status==='NONCLIMBABLE_GRADE_REJECTED')return {waypointId,state,end,rise,sweep};
    }
  }
  return null;
}

const climbCandidate=discoverLocalFromWaypoint({kind:'climb'});
const steepCandidate=discoverLocalFromWaypoint({kind:'steep'});
assert(!!climbCandidate,'NO_ACCESSIBLE_REAL_CLIMBABLE_POSITIVE_GRADE_FOUND');
assert(!!steepCandidate,'NO_ACCESSIBLE_REAL_NONCLIMBABLE_GRADE_FOUND');

// Real climb from an existing lawful waypoint, then reverse the exact accepted segment for descent.
let descentDiagnostic=null;
if(climbCandidate){
  const startState=climbCandidate.state,startXZ={x:startState.position.x,z:startState.position.z},beforeTerrain=surface(startXZ.x,startXZ.z).visibleElevation;
  const up=attemptSet(startState,climbCandidate.end,'CLIMBABLE_GRADE');
  assert(up.accepted,'CLIMBABLE_GRADE_WAS_NOT_ACCEPTED');
  if(up.accepted){
    const afterTerrain=surface(up.state.position.x,up.state.position.z).visibleElevation;
    assert(afterTerrain>beforeTerrain+0.25,'CLIMB_DID_NOT_GAIN_TERRAIN_ELEVATION');
    assert(up.state.traversal?.terrainConforming===true,'CLIMB_NOT_MARKED_TERRAIN_CONFORMING');
    assert(up.state.traversal?.sweptBeforePositionAcceptance===true,'CLIMB_NOT_SWEPT_BEFORE_ACCEPTANCE');
    assert((up.state.traversal?.sweptTerrainSampleCount??0)>2,'CLIMB_SWEEP_SAMPLE_COUNT_TOO_SMALL');
    diagnostics.climbTransitions++;
    const down=attemptSet(up.state,startXZ,'CLIMBABLE_DESCENT');
    assert(down.accepted,'CLIMBABLE_DESCENT_WAS_NOT_ACCEPTED');
    if(down.accepted){const downTerrain=surface(down.state.position.x,down.state.position.z).visibleElevation;assert(downTerrain<afterTerrain-0.25,'DESCENT_DID_NOT_LOSE_TERRAIN_ELEVATION');assert(down.state.traversal?.terrainConforming===true,'DESCENT_NOT_TERRAIN_CONFORMING');diagnostics.descentTransitions++;descentDiagnostic={rise:downTerrain-afterTerrain,maxGradeRisePerRun:down.state.traversal?.maxGradeRisePerRun,maxGradeDegrees:down.state.traversal?.maxGradeDegrees};}
  }
}

// Real steep grade from an existing lawful waypoint must preserve the current exterior position.
if(steepCandidate){
  const state=steepCandidate.state,before={...state.position};
  const r=attemptSet(state,steepCandidate.end,'NONCLIMBABLE_GRADE');
  assert(!r.accepted,'NONCLIMBABLE_GRADE_WAS_ACCEPTED');
  assert(sameXZ(r.state.position,before),'NONCLIMBABLE_REJECTION_DID_NOT_PRESERVE_POSITION');
  assert(r.result?.state?.rejectionReason==='NONCLIMBABLE_GRADE_REJECTED','NONCLIMBABLE_REJECTION_REASON_MISMATCH');
  diagnostics.steepRejections++;
}

// Long anti-tunneling tests originate at lawful waypoints. Every long move either sweeps and conforms or rejects in place.
const longCases=[['COAST',{x:120,z:-210}],['LOWLAND',{x:120,z:-210}],['HILL',{x:-100,z:-140}],['RIDGE',{x:-80,z:-180}]];
for(const [waypointId,target] of longCases){const state=initial(waypointId),before={...state.position},sweep=resolveHEarthSweptTerrainTraversal(before,target),r=attemptSet(state,target,`LONG_SWEEP:${waypointId}`);diagnostics.longSweepChecks++;if(r.accepted){assert(sweep.traversable===true,'LONG_MOVE_ACCEPTED_DESPITE_NONTRAVERSABLE_SWEEP');assert(r.state.traversal?.sweptBeforePositionAcceptance===true,'LONG_MOVE_NOT_SWEPT_BEFORE_ACCEPTANCE');assert((r.state.traversal?.sweptTerrainSampleCount??0)>10,'LONG_MOVE_SWEEP_SAMPLE_COUNT_INSUFFICIENT');}else assert(sameXZ(r.state.position,before),'LONG_MOVE_REJECTION_CHANGED_POSITION');}

// Exercise ordinary directional locomotion from each lawful waypoint.
for(const waypointId of Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){
  let walk=initial(waypointId);
  for(let i=0;i<40;i++){
    const action=i%10===0?'TURN_RIGHT':i%10===5?'TURN_LEFT':i%4===0?'STRAFE_RIGHT':i%7===0?'MOVE_BACKWARD':'MOVE_FORWARD';
    const intent=action.startsWith('TURN')?{action,degrees:5}:{action,magnitude:0.65};
    const r=proposeHEarthFunctionalLandscapeNavigation(walk,intent);
    if(r.ok){walk=r.state;const a=auditState(walk,`DIRECTIONAL:${waypointId}`);if(!action.startsWith('TURN')){assert(walk.traversal?.sweptBeforePositionAcceptance===true,'DIRECTIONAL_TRANSLATION_NOT_SWEPT');assert(a.safe,'DIRECTIONAL_ACCEPTED_STATE_UNSAFE');}}
    else{diagnostics.rejectedStates++;walk=r.state??walk;auditState(walk,`DIRECTIONAL_HELD:${waypointId}`);}
  }
}

assert(diagnostics.acceptedStates>80,'ACCEPTED_STATE_COVERAGE_INSUFFICIENT');
assert(diagnostics.sweptAcceptedStates>10,'SWEPT_TRANSLATION_NOT_MATERIALLY_EXERCISED');
assert(diagnostics.totalSweptSamples>50,'SWEPT_TERRAIN_SAMPLE_COUNT_INSUFFICIENT');
assert(diagnostics.climbTransitions>=1,'CLIMBABLE_SURFACE_FOLLOW_NOT_PROVEN');
assert(diagnostics.descentTransitions>=1,'DESCENT_SURFACE_FOLLOW_NOT_PROVEN');
assert(diagnostics.steepRejections>=1,'NONCLIMBABLE_GRADE_REJECTION_NOT_PROVEN');
assert(diagnostics.longSweepChecks>=4,'ANTI_TUNNELING_SWEEP_NOT_PROVEN');

const receipt={
  schema:'H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_QUALIFICATION_RECEIPT_v1',operationId:OPERATION_ID,protectedParentHead:EXPECTED_PARENT,protectedGeographicFloor:EXPECTED_FLOOR,failureEvidenceSha256:FAILURE_EVIDENCE_SHA256,result:issues.length?'FAIL':'PASS',
  checks:{sweptPresentedTerrainBeforePositionAcceptance:diagnostics.sweptAcceptedStates>10,climbableGradeSurfaceFollow:diagnostics.climbTransitions>=1,climbableDescentSurfaceFollow:diagnostics.descentTransitions>=1,nonclimbableGradeRejectedBeforePenetration:diagnostics.steepRejections>=1,exteriorToInteriorTransitionRepresentable:false,longStepAntiTunneling:diagnostics.longSweepChecks>=4,cameraVolumeProtectionPreserved:blobSha('../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js')===EXPECTED_PARENT_CLEARANCE_BLOB,observerViewStandOffPreserved:typeof H_EARTH_OBSERVER_VIEW_STANDOFF_CONTRACT_ID==='string',canonicalTerrainPreserved:blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,gen311LandscapePreserved:blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,navigationScaleAuthorityCreated:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false},
  diagnostics:{terrainCoverage,profile:p,...diagnostics,climbCandidate:climbCandidate?{waypointId:climbCandidate.waypointId,rise:climbCandidate.rise,maxGradeRisePerRun:climbCandidate.sweep.maxGradeRisePerRun,maxGradeDegrees:climbCandidate.sweep.maxGradeDegrees}:null,descentCandidate:descentDiagnostic,steepCandidate:steepCandidate?{waypointId:steepCandidate.waypointId,rise:steepCandidate.rise,status:steepCandidate.sweep.status,maxGradeRisePerRun:steepCandidate.sweep.maxGradeRisePerRun,maxGradeDegrees:steepCandidate.sweep.maxGradeDegrees}:null},issues
};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
