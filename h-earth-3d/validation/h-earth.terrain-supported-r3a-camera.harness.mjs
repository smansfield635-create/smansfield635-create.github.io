#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS,
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthVisibleTerrainClearanceSurface } from '../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../terrain/h-earth.successor-terrain-field.run8b.js';
import {
  H_EARTH_RUN_8E_R3A_TERRAIN_SUPPORTED_CAMERA_RECONCILIATION_ID,
  reconcileHEarthRun8ER3APresentationState,
  createHEarthRun8ER3AFrameUniformPacket,
  evaluateHEarthRun8ER3AFrameUniformPacket
} from '../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';

const OPERATION_ID='H_EARTH_R3A_TERRAIN_SUPPORTED_CAMERA_RECONCILIATION_SUCCESSOR_20260819_001';
const EXPECTED_PARENT='579820ddeea71362a3b2087e8aec38ee5eb0baab';
const EXPECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';
const FAILURE_EVIDENCE_SHA256='542142acd58c4764d7711466caef67892861d67a9900d49d37da9ba5f0f1920c';
const EXPECTED_NAVIGATION_BLOB='7f0506771ed8d4ea66685e0ae21f9459f2746970';
const EXPECTED_CLEARANCE_BLOB='f2a001dc2ec6fc821bcbf9888f51d4064f028241';
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const blobSha=(relative)=>{const b=fs.readFileSync(new URL(relative,import.meta.url));return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex')};
const issues=[];
const diagnostics={packetChecks:0,exactPreservationChecks:0,lowYCorrections:0,risingTransitions:0,descendingTransitions:0,directionalAccepted:0,maxOldOverrideGap:0,risingTerrainDelta:0,descendingTerrainDelta:0};
const assert=(condition,code)=>{if(!condition&&!issues.includes(code))issues.push(code)};
const viewport={width:640,height:360,pixelRatio:1};

assert(blobSha('../../showroom/globe/h-earth/functional-landscape/navigation.js')===EXPECTED_NAVIGATION_BLOB,'GEN324_NAVIGATION_BLOB_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js')===EXPECTED_CLEARANCE_BLOB,'VISIBLE_TERRAIN_CLEARANCE_BLOB_DRIFT');
assert(H_EARTH_RUN_8E_R3A_TERRAIN_SUPPORTED_CAMERA_RECONCILIATION_ID==='H_EARTH_RUN_8E_R3A_TERRAIN_SUPPORTED_CAMERA_RECONCILIATION_GEN325_v1','R3A_SUCCESSOR_ID_MISMATCH');

function packetAudit(state,label,requireExact=false){
  const navEval=evaluateHEarthFunctionalLandscapeNavigationState(state);
  assert(navEval?.eligible===true,`${label}:NAVIGATION_STATE_INVALID`);
  const surface=sampleHEarthVisibleTerrainClearanceSurface(state.position.x,state.position.z);
  assert(surface?.valid===true,`${label}:PRESENTED_TERRAIN_INVALID`);
  assert(state.position.y>=surface.visibleElevation+2.25-1e-8,`${label}:NAVIGATION_BELOW_PRESENTED_SUPPORT`);
  const reconciled=reconcileHEarthRun8ER3APresentationState(state);
  assert(reconciled.position.y>=state.position.y-1e-9,`${label}:RECONCILIATION_LOWERED_Y`);
  const packet=createHEarthRun8ER3AFrameUniformPacket({navigationState:state,viewport,frameSequence:diagnostics.packetChecks+1});
  const evalPacket=evaluateHEarthRun8ER3AFrameUniformPacket(packet);
  assert(evalPacket.eligible===true,`${label}:PACKET_INVALID:${evalPacket.issues?.join('|')}`);
  assert(packet.camera.position.y>=state.position.y-1e-9,`${label}:GPU_PACKET_LOWER_THAN_NAVIGATION`);
  assert(packet.terrainSupportedNavigationYPreserved===true,`${label}:PRESERVATION_FLAG_FALSE`);
  assert(Math.abs(packet.presentationCameraY-packet.camera.position.y)<=1e-9,`${label}:PRESENTATION_CAMERA_IDENTITY_MISMATCH`);
  if(requireExact){
    assert(Math.abs(packet.camera.position.y-state.position.y)<=1e-9,`${label}:SUPPORTED_Y_NOT_EXACTLY_PRESERVED`);
    diagnostics.exactPreservationChecks++;
  }
  diagnostics.packetChecks++;
  return packet;
}
function initial(waypointId){const r=createHEarthFunctionalLandscapeNavigationState({waypointId});assert(r?.ok===true,`INITIAL_${waypointId}_FAILED`);return r.state}

for(const waypointId of Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){
  const state=initial(waypointId);packetAudit(state,`WAYPOINT:${waypointId}`);
  const low=proposeHEarthFunctionalLandscapeNavigation(state,{action:'SET_CAMERA_POSITION',position:{x:state.position.x,y:-999,z:state.position.z}});
  assert(low?.ok===true,`LOW_Y_${waypointId}_REJECTED`);
  if(low?.ok){assert(low.state.position.y>=state.terrainElevation+2.25-1e-8,`LOW_Y_${waypointId}_NOT_CORRECTED`);packetAudit(low.state,`LOW_Y:${waypointId}`);diagnostics.lowYCorrections++}
}

function discoverPresentedReliefDominance(){
  let best=null;
  for(const waypointId of Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){
    const origin=initial(waypointId);
    for(const distance of [1,2,3,4,5,6,8,10,12,16,20]) for(let i=0;i<48;i++){
      const angle=i*Math.PI*2/48,x=origin.position.x+Math.cos(angle)*distance,z=origin.position.z+Math.sin(angle)*distance;
      const proposed=proposeHEarthFunctionalLandscapeNavigation(origin,{action:'SET_CAMERA_POSITION',position:{x,y:-999,z}});
      if(proposed?.ok!==true)continue;
      const state=proposed.state,run8=sampleHEarthRun8BSuccessorTerrainField(x,z);if(run8?.valid!==true||!finite(run8.elevation))continue;
      const oldFloor=run8.elevation+2.25,gap=state.position.y-oldFloor;if(!best||gap>best.gap)best={waypointId,origin,state,gap,oldFloor};
    }
  }
  return best;
}
function discoverRisingPair(){
  let best=null;
  for(const waypointId of Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){
    const origin=initial(waypointId),a=sampleHEarthVisibleTerrainClearanceSurface(origin.position.x,origin.position.z);if(a?.valid!==true)continue;
    for(const distance of [0.5,1,1.5,2,3,4,5,6,8,10,12]) for(let i=0;i<64;i++){
      const angle=i*Math.PI*2/64,x=origin.position.x+Math.cos(angle)*distance,z=origin.position.z+Math.sin(angle)*distance;
      const proposed=proposeHEarthFunctionalLandscapeNavigation(origin,{action:'SET_CAMERA_POSITION',position:{x,y:-999,z}});if(proposed?.ok!==true)continue;
      const b=sampleHEarthVisibleTerrainClearanceSurface(x,z);if(b?.valid!==true)continue;
      const delta=b.visibleElevation-a.visibleElevation;
      if(delta>0.25&&(!best||delta>best.delta))best={waypointId,origin,up:proposed.state,delta};
    }
  }
  return best;
}

const dominance=discoverPresentedReliefDominance();
assert(!!dominance,'NO_PRESENTED_RELIEF_DOMINANCE_CASE_FOUND');
if(dominance){diagnostics.maxOldOverrideGap=dominance.gap;assert(dominance.gap>0.5,'PRESENTED_RELIEF_NOT_MATERIALLY_ABOVE_RUN8B_FLOOR');packetAudit(dominance.state,'DOMINANT_PRESENTED_RELIEF',true)}

const rising=discoverRisingPair();
assert(!!rising,'NO_REAL_RISING_TERRAIN_PAIR_FOUND');
if(rising){
  diagnostics.risingTerrainDelta=rising.delta;
  assert(rising.up.position.y>rising.origin.position.y+0.25,'RISING_TERRAIN_DID_NOT_RAISE_NAVIGATION_Y');
  const upPacket=packetAudit(rising.up,'RISING_TERRAIN_PACKET');
  const back=proposeHEarthFunctionalLandscapeNavigation(rising.up,{action:'SET_CAMERA_POSITION',position:{x:rising.origin.position.x,y:-999,z:rising.origin.position.z}});
  assert(back?.ok===true,'REVERSE_DESCENT_REJECTED');
  if(back?.ok){
    const downPacket=packetAudit(back.state,'REVERSE_DESCENT_PACKET');
    diagnostics.descendingTerrainDelta=back.state.position.y-rising.up.position.y;
    assert(back.state.position.y<rising.up.position.y-0.25,'REVERSE_DID_NOT_LOWER_NAVIGATION_Y');
    assert(downPacket.camera.position.y<upPacket.camera.position.y-0.25,'REVERSE_DID_NOT_LOWER_GPU_CAMERA_Y');
    diagnostics.risingTransitions++;diagnostics.descendingTransitions++;
  }
}

for(const waypointId of Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){
  let state=initial(waypointId);
  for(let i=0;i<80;i++){
    const action=i%13===0?'TURN_RIGHT':i%17===0?'TURN_LEFT':i%7===0?'MOVE_BACKWARD':i%5===0?'STRAFE_RIGHT':'MOVE_FORWARD';
    const intent=action.startsWith('TURN')?{action,degrees:4}:{action,magnitude:0.4};
    const r=proposeHEarthFunctionalLandscapeNavigation(state,intent);if(r?.ok!==true)continue;state=r.state;packetAudit(state,`DIRECTIONAL:${waypointId}:${i}`);if(!action.startsWith('TURN'))diagnostics.directionalAccepted++;
  }
}
assert(diagnostics.packetChecks>100,'FULL_CHAIN_PACKET_COVERAGE_INSUFFICIENT');
assert(diagnostics.directionalAccepted>50,'DIRECTIONAL_FULL_CHAIN_COVERAGE_INSUFFICIENT');
assert(diagnostics.lowYCorrections>=5,'LOW_Y_RECOVERY_NOT_PROVEN');
assert(diagnostics.exactPreservationChecks>=1,'EXACT_HIGHER_SUPPORTED_Y_PRESERVATION_NOT_PROVEN');
assert(diagnostics.risingTransitions>=1,'RISING_TERRAIN_PACKET_ASCENT_NOT_PROVEN');
assert(diagnostics.descendingTransitions>=1,'DESCENT_PACKET_PROPAGATION_NOT_PROVEN');
assert(diagnostics.maxOldOverrideGap>0.5,'OLD_RUN8B_OVERRIDE_REGRESSION_CASE_NOT_PROVEN');

const receipt={schema:'H_EARTH_TERRAIN_SUPPORTED_R3A_CAMERA_QUALIFICATION_RECEIPT_v1',operationId:OPERATION_ID,protectedParentHead:EXPECTED_PARENT,protectedGeographicFloor:EXPECTED_FLOOR,failureEvidenceSha256:FAILURE_EVIDENCE_SHA256,result:issues.length?'FAIL':'PASS',checks:{gen324NavigationPreserved:blobSha('../../showroom/globe/h-earth/functional-landscape/navigation.js')===EXPECTED_NAVIGATION_BLOB,visibleTerrainClearancePreserved:blobSha('../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js')===EXPECTED_CLEARANCE_BLOB,downstreamCameraNeverLowered:true,presentedReliefAboveRun8BCaseExercised:diagnostics.maxOldOverrideGap>0.5,exactSupportedYPreservedWhenItControls:diagnostics.exactPreservationChecks>=1,lowYRecoverySurvivesR3A:diagnostics.lowYCorrections>=5,risingTerrainPropagatesToPacket:diagnostics.risingTransitions>=1,descentPropagatesToPacket:diagnostics.descendingTransitions>=1,navigationAuthorityCreated:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false,deploymentPerformed:false},diagnostics,issues};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
