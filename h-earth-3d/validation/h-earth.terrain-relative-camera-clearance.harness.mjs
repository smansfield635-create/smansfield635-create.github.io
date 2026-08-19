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
  sampleHEarthVisibleTerrainClearanceSurface,
  sampleHEarthVisibleTerrainClearanceEnvelope
} from '../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js';

const EXPECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';
const EXPECTED_CANONICAL_TERRAIN_BLOB='f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const EXPECTED_LANDSCAPE_PREVIEW_BLOB='d77990da529790f9389c9a29551b7f36bb9afa3e';
const blobSha=p=>{const b=fs.readFileSync(new URL(p,import.meta.url));return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex')};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const issues=[];
const traces=[];
const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;

function assert(condition,code){if(!condition)issues.push(code)}
function checkState(state,label){
  const e=evaluateHEarthFunctionalLandscapeNavigationState(state);
  const visible=sampleHEarthVisibleTerrainClearanceEnvelope(state.position.x,state.position.z,{yawDegrees:state.yawDegrees,lookAheadDistance:p.lookAheadClearanceDistance,lateralRadius:p.clearanceFootprintRadius});
  const min=visible.valid?visible.visibleElevation+p.minimumTerrainClearance:Infinity;
  const safe=visible.valid&&state.position.y>=min-1e-8&&e.eligible===true;
  if(!safe)issues.push(`${label}:VISIBLE_TERRAIN_PENETRATION_OR_STATE_FAIL`);
  if(Math.abs(state.verticalDelta??0)>Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8)issues.push(`${label}:VERTICAL_CHANGE_BOUND_EXCEEDED`);
  return {safe,clearance:visible.valid?state.position.y-visible.visibleElevation:null,visibleElevation:visible.visibleElevation,verticalDelta:state.verticalDelta??0,verticalAcceleration:state.verticalAcceleration??0,response:state.verticalResponseMode};
}
function initial(){const r=createHEarthFunctionalLandscapeNavigationState();if(!r.ok)throw new Error(`INITIAL_STATE_FAILED:${r.issues}`);return r.state}
function moveTo(state,target,{step=2,label='TRACE'}={}){
  const dx=target.x-state.position.x,dz=target.z-state.position.z,dist=Math.hypot(dx,dz),n=Math.max(1,Math.ceil(dist/step));
  const samples=[];
  for(let i=1;i<=n;i++){
    const x=state.position.x+(target.x-state.position.x)/(n-i+1);
    const z=state.position.z+(target.z-state.position.z)/(n-i+1);
    const r=proposeHEarthFunctionalLandscapeNavigation(state,{action:'SET_CAMERA_POSITION',position:{x,y:state.position.y,z}});
    if(!r.ok){issues.push(`${label}:MOVEMENT_REJECTED:${r.issues.join('|')}`);return {state,samples,complete:false};}
    state=r.state;samples.push(checkState(state,label));
  }
  return {state,samples,complete:true};
}
function settle(state,{count=24,label='SETTLE'}={}){
  const samples=[];
  for(let i=0;i<count;i++){
    const r=proposeHEarthFunctionalLandscapeNavigation(state,{action:'NO_OP'});
    if(!r.ok){issues.push(`${label}:NO_OP_REJECTED`);break;}
    state=r.state;samples.push(checkState(state,label));
  }
  return {state,samples};
}
function traceBetween(name,startWaypoint,endWaypoint){
  let state=initial();
  const start=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[startWaypoint].position;
  let a=moveTo(state,start,{step:2,label:name+':START'});state=a.state;
  const startElevation=sampleHEarthVisibleTerrainClearanceSurface(state.position.x,state.position.z).visibleElevation;
  const end=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[endWaypoint].position;
  let b=moveTo(state,end,{step:2,label:name});state=b.state;
  const endElevation=sampleHEarthVisibleTerrainClearanceSurface(state.position.x,state.position.z).visibleElevation;
  const s=settle(state,{label:name+':SETTLE'});state=s.state;
  traces.push({name,startWaypoint,endWaypoint,complete:a.complete&&b.complete,startElevation,endElevation,netElevationChange:endElevation-startElevation,samples:[...a.samples,...b.samples,...s.samples],finalClearance:state.clearance,targetError:Math.abs(state.position.y-state.targetCameraY)});
  return state;
}

// Mesh identity and sampler coverage.
assert(H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR===EXPECTED_FLOOR,'PROTECTED_FLOOR_CONSTANT_MISMATCH');
assert(blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,'CANONICAL_TERRAIN_BLOB_DRIFT');
assert(blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,'GEN311_LANDSCAPE_PREVIEW_BLOB_DRIFT');
let coverage=0,reliefAboveCanonical=0;
for(let z=-224;z<=-104;z+=8)for(let x=-160;x<=160;x+=8){
  if(!resolveHEarthNavigableTerrainChunk(x,z))continue;
  const s=sampleHEarthVisibleTerrainClearanceSurface(x,z);
  if(s.valid){coverage++;if(s.contractId!==H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID)issues.push('VISIBLE_SURFACE_CONTRACT_MISMATCH');}
}
assert(coverage>=100,'VISIBLE_TERRAIN_SAMPLE_COVERAGE_INSUFFICIENT');

// Seven required traces.
const uphill=traceBetween('SUSTAINED_UPHILL','COAST','RIDGE');
const descent=traceBetween('SUSTAINED_DESCENT','RIDGE','COAST');
const valley=traceBetween('VALLEY_CROSSING','LOWLAND','HILL');
const pass=traceBetween('PASS_CROSSING','HILL','RIDGE');

let steep=traceBetween('STEEP_SLOPE_ADJACENCY','HILL','RIDGE');
for(let i=0;i<8;i++){
  const r=proposeHEarthFunctionalLandscapeNavigation(steep,{action:i%2?'STRAFE_LEFT':'STRAFE_RIGHT',magnitude:1});
  if(r.ok){steep=r.state;checkState(steep,'STEEP_SLOPE_ADJACENCY:STRAFE');}else if(!String(r.state?.rejectionReason??'').includes('UPHILL'))issues.push('STEEP_SLOPE_ADJACENCY:UNEXPECTED_REJECTION');
}

let rotation=traceBetween('ROTATION_BESIDE_RISING_RELIEF','HILL','RIDGE');
const rotationSamples=[];
for(let i=0;i<24;i++){
  const r=proposeHEarthFunctionalLandscapeNavigation(rotation,{action:'TURN_RIGHT',degrees:6});
  if(!r.ok){issues.push('ROTATION_BESIDE_RISING_RELIEF:TURN_REJECTED');break;}
  rotation=r.state;rotationSamples.push(checkState(rotation,'ROTATION_BESIDE_RISING_RELIEF'));
}
traces.push({name:'ROTATION_BESIDE_RISING_RELIEF_DYNAMIC',complete:rotationSamples.length===24,samples:rotationSamples});

let reversal=traceBetween('DIRECTION_REVERSAL_ON_GRADE','LOWLAND','HILL');
const reversalSamples=[];
for(const action of ['MOVE_FORWARD','MOVE_FORWARD','MOVE_FORWARD','MOVE_BACKWARD','MOVE_BACKWARD','MOVE_BACKWARD']){
  const r=proposeHEarthFunctionalLandscapeNavigation(reversal,{action,magnitude:2});
  if(!r.ok){issues.push(`DIRECTION_REVERSAL_ON_GRADE:${action}_REJECTED`);break;}
  reversal=r.state;reversalSamples.push(checkState(reversal,'DIRECTION_REVERSAL_ON_GRADE'));
}
traces.push({name:'DIRECTION_REVERSAL_ON_GRADE_DYNAMIC',complete:reversalSamples.length===6,samples:reversalSamples});

// Global dynamics checks.
const allSamples=traces.flatMap(t=>t.samples??[]);
assert(allSamples.length>80,'TRACE_SAMPLE_COUNT_INSUFFICIENT');
assert(allSamples.every(s=>s.safe===true),'ZERO_PENETRATION_INVARIANT_FAILED');
assert(allSamples.every(s=>finite(s.verticalDelta)&&finite(s.verticalAcceleration)),'VERTICAL_DYNAMICS_NONFINITE');
assert(allSamples.every(s=>Math.abs(s.verticalDelta)<=Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8),'VERTICAL_VELOCITY_BOUND_FAILED');
const descending=traces.find(t=>t.name==='SUSTAINED_DESCENT');
assert(descending?.targetError<=p.clearanceDeadband+0.02,'DOWNHILL_RESTORATION_DID_NOT_SETTLE');
assert(allSamples.filter(s=>s.response==='DEADBAND_HOLD').length>0,'HYSTERESIS_DEADBAND_NOT_EXERCISED');
assert(traces.filter(t=>t.complete).length>=7,'SEVEN_TRACE_BATTERY_INCOMPLETE');

const receipt={
  schema:'H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_QUALIFICATION_RECEIPT_v1',
  operationId:'H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_20260818_001',
  protectedGeographicFloor:EXPECTED_FLOOR,
  result:issues.length?'FAIL':'PASS',
  checks:{
    protectedGen311TerrainPreserved:blobSha('../../showroom/globe/h-earth/render/landscape-preview.js')===EXPECTED_LANDSCAPE_PREVIEW_BLOB,
    canonicalTerrainPreserved:blobSha('../terrain/h-earth.terrain-field.js')===EXPECTED_CANONICAL_TERRAIN_BLOB,
    visibleTerrainSamplerBound:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR===EXPECTED_FLOOR,
    zeroVisibleTerrainPenetration:allSamples.every(s=>s.safe===true),
    boundedVerticalChange:allSamples.every(s=>Math.abs(s.verticalDelta)<=Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-8),
    downhillRestoration:descending?.targetError<=p.clearanceDeadband+0.02,
    hysteresisDeadbandExercised:allSamples.some(s=>s.response==='DEADBAND_HOLD'),
    sevenTraceBattery:traces.filter(t=>t.complete).length>=7,
    navigationScaleAuthorityCreated:false,
    geographyAuthorityCreated:false,
    topologyAuthorityCreated:false
  },
  diagnostics:{sampleCoverage:coverage,traceCount:traces.length,traceSampleCount:allSamples.length,profile:p,traces:traces.map(t=>({name:t.name,complete:t.complete,startElevation:t.startElevation,endElevation:t.endElevation,netElevationChange:t.netElevationChange,finalClearance:t.finalClearance,targetError:t.targetError,sampleCount:t.samples?.length??0}))},
  issues
};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
