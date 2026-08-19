#!/usr/bin/env node
import {
  H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  H_EARTH_PLANETARY_WORLD_FRAME,
  regionToHEarthPlanetPoint,
  getHEarthPlanetRelativeUp,
  getHEarthDerivedHorizonDistance
} from '../../showroom/globe/h-earth/render/planetary-world-frame.js';
import { buildHEarthWorldManifoldRepresentationPlan } from '../integration/h-earth.world-representation-plan.js';
import { constructHEarthDistantContextGeometry } from '../../showroom/globe/h-earth/render/geometry-distant-context.js';
import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import {
  H_EARTH_RUN_8E_R3A_PLANETARY_SPATIAL_COHERENCE_ID,
  createHEarthRun8ER3AFrameUniformPacket,
  evaluateHEarthRun8ER3AFrameUniformPacket
} from '../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';

const OPERATION_ID='H_EARTH_PLANETARY_SPATIAL_COHERENCE_SUCCESSOR_20260819_001';
const EXPECTED_PARENT='13d1a4af631d5282b741325a57a5f42852e4342c';
const EXPECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';
const FAILURE_EVIDENCE_SHA256='8b230cde50b6adc57bab5de57b5df09417e5058153d823293381aa3231cee364';
const issues=[];
const diagnostics={localPatchChecks:0,sphericalChecks:0,azimuthChecks:0,normalChecks:0,horizonChecks:0,fixedAnchorVertexChecks:0,distantGeometryIdentityChecks:0,r3aPacketChecks:0,terrainSupportedYPreservationChecks:0,maxSphericalDrop:0,maxHorizontalProjectionDelta:0,maxAdjacentCameraDelta:0};
const assert=(c,code)=>{if(!c&&!issues.includes(code))issues.push(code)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const near=(a,b,e=1e-8)=>Math.abs(a-b)<=e;
const vecNear=(a,b,e=1e-8)=>near(a.x,b.x,e)&&near(a.y,b.y,e)&&near(a.z,b.z,e);

assert(H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID==='H_EARTH_PLANETARY_SPATIAL_COHERENCE_GEN326_v1','PLANETARY_FRAME_ID_MISMATCH');
assert(H_EARTH_RUN_8E_R3A_PLANETARY_SPATIAL_COHERENCE_ID==='H_EARTH_RUN_8E_R3A_PLANETARY_SPATIAL_COHERENCE_GEN326_v1','R3A_SPATIAL_ID_MISMATCH');
assert(H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius===1100,'TANGENT_RADIUS_DRIFT');
assert(H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius===420000,'PLANET_RADIUS_DRIFT');

for(const p of [{x:0,y:7,z:0},{x:400,y:12,z:-500},{x:1000,y:3,z:0}]){
  const q=regionToHEarthPlanetPoint(p);
  assert(q.spatialClass==='LOCAL_TANGENT_PATCH',`LOCAL_PATCH_CLASS:${p.x}:${p.z}`);
  assert(vecNear(q,p),`LOCAL_PATCH_GEOMETRY_MUTATED:${p.x}:${p.z}`);
  diagnostics.localPatchChecks++;
}

for(const radius of [2260,3160,4400,6000,7600,9200]){
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,p={x:Math.cos(a)*radius,y:0,z:Math.sin(a)*radius},q=regionToHEarthPlanetPoint(p),up=getHEarthPlanetRelativeUp(p);
    assert(q.spatialClass==='EXACT_SPHERICAL_CONTINUATION',`SPHERE_CLASS:${radius}:${i}`);
    assert(q.y<-.1,`SPHERE_DOES_NOT_FALL_AWAY:${radius}:${i}`);
    const horizontalDelta=Math.hypot(q.x-p.x,q.z-p.z),drop=p.y-q.y,n=Math.hypot(up.x,up.y,up.z);
    assert(horizontalDelta>1e-6,`FULL_XZ_PROJECTION_MISSING:${radius}:${i}`);
    assert(near(n,1,1e-9),`PLANET_NORMAL_NOT_UNIT:${radius}:${i}`);
    assert(Math.abs(up.x)+Math.abs(up.z)>1e-6,`PLANET_NORMAL_DID_NOT_ROTATE:${radius}:${i}`);
    diagnostics.maxSphericalDrop=Math.max(diagnostics.maxSphericalDrop,drop);
    diagnostics.maxHorizontalProjectionDelta=Math.max(diagnostics.maxHorizontalProjectionDelta,horizontalDelta);
    diagnostics.sphericalChecks++;diagnostics.azimuthChecks++;diagnostics.normalChecks++;
  }
}

const horizons=[0,12,50,100,250].map(h=>({h,d:getHEarthDerivedHorizonDistance(h)}));
for(let i=0;i<horizons.length;i++){assert(finite(horizons[i].d),`HORIZON_NONFINITE:${i}`);if(i>0)assert(horizons[i].d>horizons[i-1].d,`HORIZON_NOT_MONOTONIC:${i}`);diagnostics.horizonChecks++;}

const cameraA={x:0,y:12,z:-40},cameraB={x:9,y:14,z:-34};
const planA=buildHEarthWorldManifoldRepresentationPlan({cameraWorld:cameraA});
const planB=buildHEarthWorldManifoldRepresentationPlan({cameraWorld:cameraB});
assert(planA.eligible&&planB.eligible,'WORLD_PLAN_INVALID');
assert(planA.continuationAnchorFixed===true&&planB.continuationAnchorFixed===true,'CONTINUATION_ANCHOR_NOT_FIXED');
assert(planA.worldRecenteredForCamera===false&&planB.worldRecenteredForCamera===false,'WORLD_CAMERA_RECENTER_STILL_ACTIVE');
assert(planA.vertices.length===planB.vertices.length,'WORLD_PLAN_VERTEX_COUNT_CHANGED_WITH_CAMERA');
for(let i=0;i<Math.min(planA.vertices.length,planB.vertices.length);i++){
  const a=planA.vertices[i],b=planB.vertices[i];
  assert(vecNear(a.planarWorld,b.planarWorld,1e-9),`PLANAR_ANCHOR_JUMP:${i}`);
  assert(vecNear(a.world,b.world,1e-9),`SPHERICAL_WORLD_ANCHOR_JUMP:${i}`);
  diagnostics.fixedAnchorVertexChecks++;
}

const farA=constructHEarthDistantContextGeometry({cameraWorld:cameraA});
const farB=constructHEarthDistantContextGeometry({cameraWorld:cameraB});
assert(farA.ok&&farB.ok,'DISTANT_CONTEXT_INVALID');
assert(farA.fullXYZSphericalContinuation===true&&farB.fullXYZSphericalContinuation===true,'DISTANT_CONTEXT_NOT_SPHERICAL');
assert(farA.worldRecenteredForCamera===false&&farB.worldRecenteredForCamera===false,'DISTANT_WORLD_RECENTER_FLAG_INVALID');
for(let p=0;p<Math.min(farA.primitives.length,farB.primitives.length);p++){
  const va=farA.primitives[p].geometry.vertices,vb=farB.primitives[p].geometry.vertices;
  assert(va.length===vb.length,`DISTANT_VERTEX_COUNT_JUMP:${p}`);
  for(let i=0;i<Math.min(va.length,vb.length);i++){assert(vecNear(va[i],vb[i],1e-9),`DISTANT_GEOMETRY_JUMP:${p}:${i}`);diagnostics.distantGeometryIdentityChecks++;}
}

const viewport={width:640,height:360,pixelRatio:1};
for(const waypointId of ['COAST','BERM','LOWLAND','HILL','RIDGE']){
  const init=createHEarthFunctionalLandscapeNavigationState({waypointId});
  assert(init?.ok===true,`NAV_INIT:${waypointId}`);if(init?.ok!==true)continue;
  let state=init.state,prev=null;
  for(let i=0;i<24;i++){
    const packet=createHEarthRun8ER3AFrameUniformPacket({navigationState:state,viewport,frameSequence:i+1}),evaluation=evaluateHEarthRun8ER3AFrameUniformPacket(packet);
    assert(evaluation.eligible===true,`R3A_PACKET_INVALID:${waypointId}:${i}:${evaluation.issues.join('|')}`);
    assert(packet.camera.position.y>=state.position.y-1e-9,`GEN325_CAMERA_Y_REGRESSION:${waypointId}:${i}`);
    assert(packet.planetRelativeUp===true&&packet.worldRecenteredForCamera===false,`R3A_PLANETARY_FRAME_MISSING:${waypointId}:${i}`);
    assert(packet.camera.farPlane>=packet.derivedGeometricHorizonDistance,`R3A_HORIZON_CLIPPED:${waypointId}:${i}`);
    const up=packet.camera.up,upNorm=Math.hypot(up.x,up.y,up.z);assert(near(upNorm,1,1e-8),`R3A_UP_NOT_UNIT:${waypointId}:${i}`);
    if(prev){const d=Math.hypot(packet.camera.position.x-prev.x,packet.camera.position.y-prev.y,packet.camera.position.z-prev.z);diagnostics.maxAdjacentCameraDelta=Math.max(diagnostics.maxAdjacentCameraDelta,d);assert(d<20,`R3A_CAMERA_DISCONTINUITY:${waypointId}:${i}`);}
    prev=packet.camera.position;diagnostics.r3aPacketChecks++;diagnostics.terrainSupportedYPreservationChecks++;
    const move=proposeHEarthFunctionalLandscapeNavigation(state,{action:i%7===0?'STRAFE_RIGHT':'MOVE_FORWARD',magnitude:.35});if(move?.ok===true)state=move.state;
  }
}

assert(diagnostics.localPatchChecks>=3,'LOCAL_PATCH_COVERAGE_INSUFFICIENT');
assert(diagnostics.sphericalChecks>=40,'SPHERICAL_COVERAGE_INSUFFICIENT');
assert(diagnostics.azimuthChecks>=40,'AZIMUTH_COVERAGE_INSUFFICIENT');
assert(diagnostics.fixedAnchorVertexChecks>500,'FIXED_ANCHOR_COVERAGE_INSUFFICIENT');
assert(diagnostics.distantGeometryIdentityChecks>500,'DISTANT_GEOMETRY_CONTINUITY_COVERAGE_INSUFFICIENT');
assert(diagnostics.r3aPacketChecks>=100,'R3A_PACKET_COVERAGE_INSUFFICIENT');
assert(diagnostics.maxSphericalDrop>20,'PLANETARY_CURVATURE_VISUALLY_INSUFFICIENT');
assert(diagnostics.maxHorizontalProjectionDelta>.01,'FULL_XYZ_CURVATURE_NOT_PROVEN');

const receipt={schema:'H_EARTH_PLANETARY_SPATIAL_COHERENCE_QUALIFICATION_RECEIPT_v1',operationId:OPERATION_ID,protectedParentHead:EXPECTED_PARENT,protectedGeographicFloor:EXPECTED_FLOOR,failureEvidenceSha256:FAILURE_EVIDENCE_SHA256,result:issues.length?'FAIL':'PASS',checks:{localTangentPatchPreserved:diagnostics.localPatchChecks>=3,fullXYZSphericalContinuation:diagnostics.sphericalChecks>=40,allAzimuthCurvature:diagnostics.azimuthChecks>=40,planetRelativeUpCoherent:diagnostics.normalChecks>=40,derivedHorizonMonotonic:diagnostics.horizonChecks>=5,fixedPlanetaryWorldAnchor:diagnostics.fixedAnchorVertexChecks>500,noCameraRelativeDistantGeometryRebuild:diagnostics.distantGeometryIdentityChecks>500,gen325TerrainSupportedCameraYPreserved:diagnostics.terrainSupportedYPreservationChecks>=100,r3aPlanetaryFrameBound:diagnostics.r3aPacketChecks>=100,screenSpaceCurvatureAuthorityCreated:false,geographyAuthorityCreated:false,navigationAuthorityCreated:false,deploymentPerformed:false},diagnostics,issues};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
