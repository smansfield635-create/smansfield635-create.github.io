#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS,
  H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID,
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState,
  resolveHEarthNavigableTerrainChunk
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import {
  H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
  H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID,
  H_EARTH_OBSERVER_VIEW_STANDOFF_CONTRACT_ID,
  sampleHEarthVisibleTerrainClearanceSurface,
  sampleHEarthVisibleTerrainClearanceEnvelope
} from '../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js';

const OPERATION_ID='H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_SUCCESSOR_20260818_001';
const EXPECTED_PARENT='777d96d2990a4580071d11aadab83fa70370ca5a';
const EXPECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';
const FAILURE_EVIDENCE_SHA256='3b804913c6069c123f3e881249cbac12a45d46a9e741b00fcd81bd8b447d0f22';
const EXPECTED_CANONICAL_TERRAIN_BLOB='f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const EXPECTED_LANDSCAPE_PREVIEW_BLOB='d77990da529790f9389c9a29551b7f36bb9afa3e';
const EXPECTED_CLEARANCE_BLOB='f2a001dc2ec6fc821bcbf9888f51d4064f028241';
const blobSha=p=>{const b=fs.readFileSync(new URL(p,import.meta.url));return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex')};
const issues=[];
const diagnostics={acceptedStates:0,rejectedStates:0,sweptStates:0,totalSweptSamples:0,risingTransitions:0,descendingTransitions:0,lowYCorrections:0,longSweepChecks:0};
const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
const finite=v=>typeof v==='number'&&Number.isFinite(v);
function assert(c,code){if(!c&&!issues.includes(code))issues.push(code)}
function surface(x,z){return sampleHEarthVisibleTerrainClearanceSurface(x,z)}
function initial(id='COAST'){const r=createHEarthFunctionalLandscapeNavigationState({waypointId:id});if(!r.ok)throw new Error(`INITIAL_STATE_FAILED:${id}:${r.issues}`);return r.state}
function expectedFloor(state){const s=surface(state.position.x,state.position.z);const e=sampleHEarthVisibleTerrainClearanceEnvelope(state.position.x,state.position.z,{yawDegrees:state.yawDegrees,lookAheadDistance:p.lookAheadClearanceDistance,lateralRadius:p.clearanceFootprintRadius});if(!s.valid||!e.valid)return null;return {surface:s.visibleElevation,envelope:e.visibleElevation,minY:Math.max(s.visibleElevation+p.hardTerrainSupportOffset,e.visibleElevation+p.minimumTerrainClearance,e.visibleElevation+p.eyeHeight)};}
function audit(state,label){const floor=expectedFloor(state),evaluation=evaluateHEarthFunctionalLandscapeNavigationState(state);const safe=!!floor&&evaluation.eligible===true&&state.position.y>=floor.minY-1e-8&&state.position.y>=floor.surface+p.hardTerrainSupportOffset-1e-8&&state.terrainSupported===true;if(!safe)issues.push(`${label}:TERRAIN_SUPPORT_FAIL`);assert(state.terrainSupportedLocomotionContractId===H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID,`${label}:CONTRACT_ID_MISSING`);diagnostics.acceptedStates++;if((state.sweptTerrainSupportSampleCount??0)>0){diagnostics.sweptStates++;diagnostics.totalSweptSamples+=state.sweptTerrainSupportSampleCount;}return {safe,floor};}

assert(H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR===EXPECTED_FLOOR,'PROTECTED_FLOOR_MISMATCH');
assert(typeof H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID==='string','CAMERA_VOLUME_PROTECTION_MISSING');
assert(typeof H_EARTH_OBSERVER_VIEW_STANDOFF_CONTRACT_ID==='string','OBSERVER_STANDOFF_MISSING');
assert(typeof H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID==='string','TERRAIN_SUPPORTED_CONTRACT_MISSING');
assert(blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,'CANONICAL_TERRAIN_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,'GEN311_LANDSCAPE_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js')===EXPECTED_CLEARANCE_BLOB,'CAMERA_PROTECTION_STACK_DRIFT');

let coverage=0;for(let z=-224;z<=-104;z+=8)for(let x=-160;x<=160;x+=8){if(resolveHEarthNavigableTerrainChunk(x,z)&&surface(x,z).valid)coverage++;}assert(coverage>=100,'VISIBLE_TERRAIN_COVERAGE_INSUFFICIENT');

function findLocalRise(){for(const id of Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){const st=initial(id),a=surface(st.position.x,st.position.z);for(const d of [1,2,3,4,5,6,8,10])for(let i=0;i<32;i++){const q=i*Math.PI*2/32,x=st.position.x+Math.cos(q)*d,z=st.position.z+Math.sin(q)*d;if(!resolveHEarthNavigableTerrainChunk(x,z))continue;const b=surface(x,z);if(b.valid&&b.visibleElevation>a.visibleElevation+0.5)return{id,state:st,target:{x,z},rise:b.visibleElevation-a.visibleElevation};}}return null;}
const rise=findLocalRise();assert(!!rise,'NO_ACCESSIBLE_RISING_TERRAIN_FOUND');
if(rise){const before=rise.state,up=proposeHEarthFunctionalLandscapeNavigation(before,{action:'SET_CAMERA_POSITION',position:{x:rise.target.x,y:-9999,z:rise.target.z}});assert(up.ok,'RISING_TERRAIN_MOVE_REJECTED');if(up.ok){const au=audit(up.state,'RISING_TERRAIN');assert(up.state.position.y>before.position.y+0.25,'RISING_TERRAIN_DID_NOT_FORCE_CAMERA_UP');assert(up.state.position.y>=au.floor.surface+p.hardTerrainSupportOffset-1e-8,'CAMERA_NOT_SUPPORTED_BY_RISING_SURFACE');assert((up.state.sweptTerrainSupportSampleCount??0)>1,'RISING_MOVE_NOT_SWEPT');diagnostics.risingTransitions++;diagnostics.lowYCorrections++;const down=proposeHEarthFunctionalLandscapeNavigation(up.state,{action:'SET_CAMERA_POSITION',position:{x:before.position.x,y:-9999,z:before.position.z}});assert(down.ok,'REVERSE_DESCENT_REJECTED');if(down.ok){audit(down.state,'REVERSE_DESCENT');assert(down.state.position.y<up.state.position.y-0.25,'REVERSE_DESCENT_DID_NOT_LOWER_CAMERA');diagnostics.descendingTransitions++;diagnostics.lowYCorrections++;}}}

// Maliciously low requested Y at the same X/Z must never enter the terrain.
for(const id of Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){const st=initial(id),r=proposeHEarthFunctionalLandscapeNavigation(st,{action:'SET_CAMERA_POSITION',position:{x:st.position.x,y:-1e6,z:st.position.z}});assert(r.ok,`LOW_Y:${id}:REJECTED`);if(r.ok){const a=audit(r.state,`LOW_Y:${id}`);assert(r.state.position.y>=a.floor.surface+p.hardTerrainSupportOffset-1e-8,`LOW_Y:${id}:INTERIOR_REACHABLE`);diagnostics.lowYCorrections++;}}

// Long translations must sweep intermediate terrain while every accepted endpoint is terrain-supported.
for(const [id,target] of [['COAST',{x:120,z:-210}],['LOWLAND',{x:120,z:-210}],['HILL',{x:-100,z:-140}],['RIDGE',{x:-80,z:-180}]]){const st=initial(id),r=proposeHEarthFunctionalLandscapeNavigation(st,{action:'SET_CAMERA_POSITION',position:{x:target.x,y:-9999,z:target.z}});diagnostics.longSweepChecks++;if(r.ok){audit(r.state,`LONG:${id}`);assert((r.state.sweptTerrainSupportSampleCount??0)>10,`LONG:${id}:SWEEP_TOO_SPARSE`);}else diagnostics.rejectedStates++;}

// Ordinary directional movement must continuously inherit terrain support.
for(const id of Object.keys(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){let st=initial(id);audit(st,`INITIAL:${id}`);for(let i=0;i<60;i++){const action=i%13===0?'TURN_RIGHT':i%17===0?'STRAFE_LEFT':i%7===0?'MOVE_BACKWARD':'MOVE_FORWARD';const intent=action==='TURN_RIGHT'?{action,degrees:5}:{action,magnitude:.75};const r=proposeHEarthFunctionalLandscapeNavigation(st,intent);if(r.ok){st=r.state;audit(st,`WALK:${id}`);if(action!=='TURN_RIGHT')assert((st.sweptTerrainSupportSampleCount??0)>0,`WALK:${id}:UNSWEPT_TRANSLATION`);}else{diagnostics.rejectedStates++;st=r.state??st;audit(st,`HELD:${id}`);}}}

assert(diagnostics.acceptedStates>100,'ACCEPTED_STATE_COVERAGE_INSUFFICIENT');
assert(diagnostics.risingTransitions>=1,'RISING_TERRAIN_ASCENT_NOT_PROVEN');
assert(diagnostics.descendingTransitions>=1,'SURFACE_DESCENT_NOT_PROVEN');
assert(diagnostics.lowYCorrections>=5,'LOW_Y_INTERIOR_PREVENTION_NOT_PROVEN');
assert(diagnostics.sweptStates>20,'SWEPT_SUPPORT_NOT_MATERIALLY_EXERCISED');
assert(diagnostics.totalSweptSamples>100,'SWEPT_SAMPLE_COUNT_INSUFFICIENT');
assert(diagnostics.longSweepChecks===4,'LONG_SWEEP_BATTERY_INCOMPLETE');

const receipt={schema:'H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_QUALIFICATION_RECEIPT_v1',operationId:OPERATION_ID,protectedParentHead:EXPECTED_PARENT,protectedGeographicFloor:EXPECTED_FLOOR,failureEvidenceSha256:FAILURE_EVIDENCE_SHA256,result:issues.length?'FAIL':'PASS',checks:{terrainSupportedCameraY:issues.every(x=>!x.includes('TERRAIN_SUPPORT_FAIL')),risingTerrainForcesAscent:diagnostics.risingTransitions>=1,descentFollowsSurface:diagnostics.descendingTransitions>=1,interiorStateUnreachable:diagnostics.lowYCorrections>=5,sweptPathPreserved:diagnostics.sweptStates>20,cameraVolumeProtectionPreserved:blobSha('../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js')===EXPECTED_CLEARANCE_BLOB,observerViewStandOffPreserved:typeof H_EARTH_OBSERVER_VIEW_STANDOFF_CONTRACT_ID==='string',canonicalTerrainPreserved:blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,gen311LandscapePreserved:blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,geographyAuthorityCreated:false,topologyAuthorityCreated:false,navigationScaleAuthorityCreated:false},diagnostics:{coverage,...diagnostics,profile:p,riseCandidate:rise?{waypointId:rise.id,rise:rise.rise}:null},issues};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
