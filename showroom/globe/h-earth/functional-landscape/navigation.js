/**
 * /showroom/globe/h-earth/functional-landscape/navigation.js
 * H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_RUN_6F_v1
 *
 * Gen323 successor amendment: horizontal locomotion is no longer accepted
 * before the presented terrain segment is evaluated. Traversable grades are
 * followed incrementally; non-traversable grades reject before an exterior
 * observer can enter the terrain representation.
 */
import { H_EARTH_3D_CAMERA_CAPACITY } from '../capacity.js';
import { sampleHEarthTerrainField } from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN } from '../../../../h-earth-3d/integration/h-earth.landscape-realization-planner.js';
import {
  H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
  H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
  sampleHEarthVisibleTerrainClearanceSurface,
  sampleHEarthVisibleTerrainClearanceEnvelope
} from './visible-terrain-clearance.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const normalizeDegrees=value=>{let r=value%360;if(r>180)r-=360;if(r<-180)r+=360;return r};

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID='H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_RUN_6F_v1';
export const H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_CONTRACT_ID='H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_GEN312_v1';
export const H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID='H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_GEN323_v1';

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE=freeze({
  contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
  cameraClearanceSuccessorContractId:H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_CONTRACT_ID,
  terrainConformingLocomotionContractId:H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID,
  visibleTerrainClearanceContractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
  protectedGeographicFloor:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
  eyeHeight:2.25,
  minimumTerrainClearance:1.6,
  clearanceDeadband:0.28,
  maximumUphillRisePerProposal:12,
  maximumDownhillSettlePerProposal:3.25,
  sweptPathSampleSpacing:0.5,
  maximumTraversableGradeRisePerRun:1.25,
  lookAheadClearanceDistance:6,
  clearanceFootprintRadius:1.25,
  movementStepWorldUnits:5,
  maximumMovementIntentWorldUnits:12,
  lookDistanceWorldUnits:18,
  turnStepDegrees:6,
  pitchStepDegrees:4,
  pitchMinimumDegrees:-42,
  pitchMaximumDegrees:32,
  verticalFovMinimumDegrees:H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.verticalFovDegrees.minimum,
  verticalFovMaximumDegrees:H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.verticalFovDegrees.maximum,
  nearPlane:H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.nearPlane,
  farPlane:H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.farPlane,
  selectionProjectionModel:'CHUNK_LOCAL_NEAREST_AVAILABLE_TERRAIN_MEMBER',
  authority:freeze({
    emitsCameraProposal:true,
    validatesTerrainClearance:true,
    validatesSweptPresentedTerrainTraversal:true,
    retainsLastLawfulStateForRecovery:true,
    samplesPresentedTerrainRepresentation:true,
    ownsCanonicalCameraState:false,
    ownsTerrainField:false,
    ownsVisibleRelief:false,
    ownsGeography:false,
    ownsTopology:false,
    ownsNavigationScale:false,
    ownsSemanticAddressIdentity:false,
    ownsCollisionOrPhysics:false,
    ownsRenderer:false
  })
});

export const H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS=freeze({
  COAST:{waypointId:'COAST',label:'Coastal entry',position:{x:0,z:-96},yawDegrees:0,pitchDegrees:-8},
  BERM:{waypointId:'BERM',label:'Coastal berm',position:{x:0,z:-132},yawDegrees:0,pitchDegrees:-7},
  LOWLAND:{waypointId:'LOWLAND',label:'Lowland',position:{x:-42,z:-158},yawDegrees:-18,pitchDegrees:-6},
  HILL:{waypointId:'HILL',label:'Navigable hill',position:{x:72,z:-172},yawDegrees:18,pitchDegrees:-8},
  RIDGE:{waypointId:'RIDGE',label:'Ridge or bluff',position:{x:145,z:-225},yawDegrees:12,pitchDegrees:-10}
});

const terrainChunks=()=>H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks.filter(c=>c.terrainMemberAddressIds.length>0&&c.physicalRole.includes('TERRAIN'));
export function resolveHEarthNavigableTerrainChunk(worldX,worldZ){
  if(!finite(worldX)||!finite(worldZ))return null;
  const e=1e-8;
  return terrainChunks().filter(c=>worldX>=c.worldBounds.xMin-e&&worldX<=c.worldBounds.xMax+e&&worldZ>=c.worldBounds.zMin-e&&worldZ<=c.worldBounds.zMax+e).sort((a,b)=>a.chunkId.localeCompare(b.chunkId))[0]??null;
}
function parseAddress(address){const m=/:R(\d+):C(\d+)$/.exec(address);return m?{address,row:Number(m[1]),column:Number(m[2])}:null}
function resolveSemanticSelection(chunk,x,z){
  const candidates=chunk.terrainMemberAddressIds.map(parseAddress).filter(Boolean);
  if(!candidates.length)return freeze({selectedSemanticAddressId:null,selectionProjectionModel:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.selectionProjectionModel});
  const xp=clamp((x-chunk.worldBounds.xMin)/Math.max(1e-8,chunk.worldBounds.xMax-chunk.worldBounds.xMin),0,.999999);
  const zp=clamp((z-chunk.worldBounds.zMin)/Math.max(1e-8,chunk.worldBounds.zMax-chunk.worldBounds.zMin),0,.999999);
  const tc=chunk.addressRange.columnMin+Math.floor(xp*4),tr=chunk.addressRange.rowMin+Math.floor(zp*4);
  const selected=[...candidates].sort((a,b)=>(Math.abs(a.row-tr)+Math.abs(a.column-tc))-(Math.abs(b.row-tr)+Math.abs(b.column-tc))||a.address.localeCompare(b.address))[0];
  return freeze({selectedSemanticAddressId:selected.address,targetSemanticCoordinate:{row:tr,column:tc},selectionProjectionModel:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.selectionProjectionModel});
}

function verticalResponse({requestedY,targetY,minimumY,initial=false}){
  const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  if(initial||!finite(requestedY))return freeze({eligible:true,y:targetY,mode:'INITIAL_VISIBLE_TERRAIN_LOCK',verticalDelta:finite(requestedY)?targetY-requestedY:0,recovered:!finite(requestedY)});
  const error=targetY-requestedY;
  if(Math.abs(error)<=p.clearanceDeadband)return freeze({eligible:requestedY>=minimumY,y:requestedY,mode:'DEADBAND_HOLD',verticalDelta:0,recovered:false});
  if(error>0){
    const y=requestedY+Math.min(error,p.maximumUphillRisePerProposal);
    if(y<minimumY)return freeze({eligible:false,y:requestedY,mode:'UPHILL_RATE_LIMIT_REJECT',verticalDelta:0,recovered:false});
    return freeze({eligible:true,y,mode:'BOUNDED_UPHILL_FOLLOW',verticalDelta:y-requestedY,recovered:requestedY<minimumY});
  }
  const y=requestedY-Math.min(-error,p.maximumDownhillSettlePerProposal);
  return freeze({eligible:y>=minimumY,y:Math.max(y,minimumY),mode:'CONTROLLED_DOWNHILL_SETTLE',verticalDelta:Math.max(y,minimumY)-requestedY,recovered:false});
}

function resolveLawfulPosition({worldX,worldZ,requestedY=null,yawDegrees=0,initial=false}){
  const chunk=resolveHEarthNavigableTerrainChunk(worldX,worldZ);
  if(!chunk)return freeze({eligible:false,status:'POSITION_OUTSIDE_NAVIGABLE_TERRAIN',issues:['NO_NAVIGABLE_TERRAIN_CHUNK']});
  const canonicalTerrainSample=sampleHEarthTerrainField(worldX,worldZ);
  if(canonicalTerrainSample?.valid!==true||!finite(canonicalTerrainSample.elevation))return freeze({eligible:false,status:'TERRAIN_SAMPLE_INVALID',issues:['CANONICAL_TERRAIN_SAMPLE_INVALID']});
  const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  const visible=sampleHEarthVisibleTerrainClearanceEnvelope(worldX,worldZ,{yawDegrees,lookAheadDistance:p.lookAheadClearanceDistance,lateralRadius:p.clearanceFootprintRadius});
  if(visible?.valid!==true||!finite(visible.visibleElevation))return freeze({eligible:false,status:'VISIBLE_TERRAIN_CLEARANCE_SAMPLE_INVALID',issues:['VISIBLE_TERRAIN_CLEARANCE_SAMPLE_INVALID']});
  const actualSurface=sampleHEarthVisibleTerrainClearanceSurface(worldX,worldZ);
  if(actualSurface?.valid!==true||!finite(actualSurface.visibleElevation))return freeze({eligible:false,status:'PRESENTED_TERRAIN_SURFACE_INVALID',issues:['PRESENTED_TERRAIN_SURFACE_INVALID']});
  const minimumY=visible.visibleElevation+p.minimumTerrainClearance;
  const targetY=visible.visibleElevation+p.eyeHeight;
  const response=verticalResponse({requestedY,targetY,minimumY,initial:initial||requestedY===null});
  if(!response.eligible)return freeze({eligible:false,status:'UPHILL_CLEARANCE_RATE_EXCEEDED',issues:['CAMERA_CANNOT_REACH_VISIBLE_TERRAIN_CLEARANCE_WITHIN_BOUND']});
  const selection=resolveSemanticSelection(chunk,worldX,worldZ);
  const clearance=response.y-visible.visibleElevation;
  const actualSurfaceClearance=response.y-actualSurface.visibleElevation;
  return freeze({
    eligible:clearance>=p.minimumTerrainClearance-1e-9&&actualSurfaceClearance>=p.minimumTerrainClearance-1e-9,
    status:'POSITION_VISIBLE_TERRAIN_CLEARANCE_PASS',
    position:{x:worldX,y:response.y,z:worldZ},
    terrainElevation:visible.visibleElevation,
    visibleTerrainElevation:visible.visibleElevation,
    actualSurfaceElevation:actualSurface.visibleElevation,
    actualSurfaceClearance,
    canonicalTerrainElevation:canonicalTerrainSample.elevation,
    minimumCameraY:minimumY,
    targetCameraY:targetY,
    clearance,
    recovered:response.recovered,
    verticalResponseMode:response.mode,
    verticalDelta:response.verticalDelta,
    clearanceSurfaceContractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
    protectedGeographicFloor:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
    chunkId:chunk.chunkId,
    physicalRole:chunk.physicalRole,
    formationIds:chunk.formationIds,
    selectedSemanticAddressId:selection.selectedSemanticAddressId,
    selectionProjectionModel:selection.selectionProjectionModel,
    terrainSample:canonicalTerrainSample,
    visibleTerrainSample:visible,
    actualSurfaceSample:actualSurface,
    issues:[]
  });
}

export function resolveHEarthSweptTerrainTraversal(startPosition,endPosition){
  const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  if(!startPosition||!endPosition||![startPosition.x,startPosition.z,endPosition.x,endPosition.z].every(finite))return freeze({traversable:false,status:'SWEPT_TERRAIN_PATH_INVALID',issues:['SWEEP_ENDPOINT_INVALID'],samples:[]});
  const dx=endPosition.x-startPosition.x,dz=endPosition.z-startPosition.z,distance=Math.hypot(dx,dz);
  const steps=Math.max(1,Math.ceil(distance/p.sweptPathSampleSpacing));
  const samples=[];
  let previous=null,maxGradeRisePerRun=0,maxGradeDegrees=0;
  for(let i=0;i<=steps;i++){
    const t=i/steps,x=startPosition.x+dx*t,z=startPosition.z+dz*t;
    if(!resolveHEarthNavigableTerrainChunk(x,z))return freeze({traversable:false,status:'SWEPT_PATH_OUTSIDE_NAVIGABLE_TERRAIN',issues:['SWEPT_PATH_OUTSIDE_NAVIGABLE_TERRAIN'],samples});
    const surface=sampleHEarthVisibleTerrainClearanceSurface(x,z);
    if(surface?.valid!==true||!finite(surface.visibleElevation))return freeze({traversable:false,status:'SWEPT_TERRAIN_SAMPLE_INVALID',issues:['SWEPT_TERRAIN_SAMPLE_INVALID'],samples});
    const sample={index:i,t,x,z,terrainY:surface.visibleElevation};
    if(previous){
      const run=Math.hypot(x-previous.x,z-previous.z),rise=surface.visibleElevation-previous.terrainY,gradeRisePerRun=run>1e-9?Math.abs(rise)/run:0,gradeDegrees=Math.atan(gradeRisePerRun)*180/Math.PI;
      sample.run=run;sample.rise=rise;sample.gradeRisePerRun=gradeRisePerRun;sample.gradeDegrees=gradeDegrees;
      maxGradeRisePerRun=Math.max(maxGradeRisePerRun,gradeRisePerRun);maxGradeDegrees=Math.max(maxGradeDegrees,gradeDegrees);
      if(gradeRisePerRun>p.maximumTraversableGradeRisePerRun+1e-9)return freeze({traversable:false,status:'NONCLIMBABLE_GRADE_REJECTED',issues:['NONCLIMBABLE_GRADE_REJECTED'],samples:freeze([...samples,freeze(sample)]),distance,maxGradeRisePerRun,maxGradeDegrees,blockingSample:freeze(sample),interiorTransitionRepresentable:false});
    }
    samples.push(freeze(sample));previous=sample;
  }
  return freeze({traversable:true,status:'SWEPT_TERRAIN_PATH_TRAVERSABLE',issues:[],samples,distance,maxGradeRisePerRun,maxGradeDegrees,sampleCount:samples.length,sweptBeforePositionAcceptance:true,interiorTransitionRepresentable:false});
}

function followSweptTerrainPath(currentState,targetX,targetZ,yawDegrees){
  const sweep=resolveHEarthSweptTerrainTraversal(currentState.position,{x:targetX,z:targetZ});
  if(!sweep.traversable)return freeze({eligible:false,status:sweep.status,issues:sweep.issues,sweep});
  let positionResult=null,requestedY=currentState.position.y,totalVerticalDelta=0,recovered=false;
  for(let i=1;i<sweep.samples.length;i++){
    const s=sweep.samples[i];
    const r=resolveLawfulPosition({worldX:s.x,worldZ:s.z,requestedY,yawDegrees});
    if(!r.eligible)return freeze({eligible:false,status:r.status,issues:r.issues,sweep,blockedAtSample:i});
    totalVerticalDelta+=r.position.y-requestedY;requestedY=r.position.y;positionResult=r;recovered=recovered||r.recovered;
  }
  if(!positionResult){
    positionResult=resolveLawfulPosition({worldX:targetX,worldZ:targetZ,requestedY,yawDegrees});
    if(!positionResult.eligible)return freeze({eligible:false,status:positionResult.status,issues:positionResult.issues,sweep});
  }
  return freeze({eligible:true,status:'SWEPT_SURFACE_CONFORMING_TRAVERSAL_PASS',issues:[],positionResult,recovered,totalVerticalDelta,sweep,terrainConforming:true,interiorTransitionRepresentable:false});
}

function createState({positionResult,yawDegrees,pitchDegrees,verticalFovDegrees,sequence,action,accepted,recovered,rejectionReason=null,previousVerticalDelta=0,traversal=null}){
  const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  const traversalInfo=traversal?freeze({mode:traversal.status,sweptBeforePositionAcceptance:traversal.sweep?.sweptBeforePositionAcceptance===true,sweptTerrainSampleCount:traversal.sweep?.sampleCount??traversal.sweep?.samples?.length??0,maxGradeRisePerRun:traversal.sweep?.maxGradeRisePerRun??0,maxGradeDegrees:traversal.sweep?.maxGradeDegrees??0,terrainConforming:traversal.terrainConforming===true,interiorTransitionRepresentable:traversal.interiorTransitionRepresentable===true}):freeze({mode:'NO_TRANSLATIONAL_SWEEP',sweptBeforePositionAcceptance:false,sweptTerrainSampleCount:0,maxGradeRisePerRun:0,maxGradeDegrees:0,terrainConforming:false,interiorTransitionRepresentable:false});
  return freeze({
    contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
    cameraClearanceSuccessorContractId:H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_CONTRACT_ID,
    terrainConformingLocomotionContractId:H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID,
    stateId:`H_EARTH_NAVIGATION_STATE_${String(sequence).padStart(4,'0')}`,
    sequence,action,accepted,recovered,rejectionReason,
    position:positionResult.position,
    yawDegrees:normalizeDegrees(yawDegrees),
    pitchDegrees:clamp(pitchDegrees,p.pitchMinimumDegrees,p.pitchMaximumDegrees),
    verticalFovDegrees:clamp(verticalFovDegrees,p.verticalFovMinimumDegrees,p.verticalFovMaximumDegrees),
    terrainElevation:positionResult.terrainElevation,
    visibleTerrainElevation:positionResult.visibleTerrainElevation,
    actualSurfaceElevation:positionResult.actualSurfaceElevation,
    actualSurfaceClearance:positionResult.actualSurfaceClearance,
    canonicalTerrainElevation:positionResult.canonicalTerrainElevation,
    minimumCameraY:positionResult.minimumCameraY,
    targetCameraY:positionResult.targetCameraY,
    clearance:positionResult.clearance,
    verticalResponseMode:positionResult.verticalResponseMode,
    verticalDelta:positionResult.verticalDelta,
    verticalAcceleration:positionResult.verticalDelta-previousVerticalDelta,
    traversal:traversalInfo,
    clearanceSurfaceContractId:positionResult.clearanceSurfaceContractId,
    protectedGeographicFloor:positionResult.protectedGeographicFloor,
    chunkId:positionResult.chunkId,physicalRole:positionResult.physicalRole,formationIds:positionResult.formationIds,
    selectedSemanticAddressId:positionResult.selectedSemanticAddressId,selectionProjectionModel:positionResult.selectionProjectionModel,
    terrainClearanceReceiptId:`H_EARTH_VISIBLE_TERRAIN_CLEARANCE_RECEIPT_${String(sequence).padStart(4,'0')}`,
    canonicalCameraStateAuthority:false,collisionOrPhysicsClaim:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false,navigationScaleAuthorityCreated:false
  });
}

export function createHEarthFunctionalLandscapeNavigationState({waypointId='COAST'}={}){
  const w=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[waypointId]??H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST;
  const r=resolveLawfulPosition({worldX:w.position.x,worldZ:w.position.z,yawDegrees:w.yawDegrees,initial:true});
  if(!r.eligible)return freeze({ok:false,status:'INITIAL_NAVIGATION_STATE_REJECTED',issues:r.issues});
  return freeze({ok:true,status:'INITIAL_NAVIGATION_STATE_COMPLETE',state:createState({positionResult:r,yawDegrees:w.yawDegrees,pitchDegrees:w.pitchDegrees,verticalFovDegrees:56,sequence:1,action:`GOTO_WAYPOINT:${w.waypointId}`,accepted:true,recovered:false}),issues:[]});
}
function translationForAction(state,action,magnitude){const y=state.yawDegrees*Math.PI/180,f={x:Math.sin(y),z:-Math.cos(y)},r={x:Math.cos(y),z:Math.sin(y)};switch(action){case'MOVE_FORWARD':return{x:f.x*magnitude,z:f.z*magnitude};case'MOVE_BACKWARD':return{x:-f.x*magnitude,z:-f.z*magnitude};case'STRAFE_LEFT':return{x:-r.x*magnitude,z:-r.z*magnitude};case'STRAFE_RIGHT':return{x:r.x*magnitude,z:r.z*magnitude};default:return{x:0,z:0}}}

export function proposeHEarthFunctionalLandscapeNavigation(currentState,intent={}){
  if(!currentState||currentState.contractId!==H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID)return freeze({ok:false,status:'NAVIGATION_PROPOSAL_REJECTED',state:currentState??null,issues:['CURRENT_NAVIGATION_STATE_INVALID']});
  const action=typeof intent.action==='string'?intent.action:'NO_OP',sequence=currentState.sequence+1,p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  let x=currentState.position.x,z=currentState.position.z,y=currentState.position.y,yaw=currentState.yawDegrees,pitch=currentState.pitchDegrees,fov=currentState.verticalFovDegrees,initial=false,traversal=null;
  if(action==='RESET')return createHEarthFunctionalLandscapeNavigationState();
  if(action==='GOTO_WAYPOINT'){
    const w=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[intent.waypointId];
    if(!w)return freeze({ok:false,status:'NAVIGATION_WAYPOINT_REJECTED',state:currentState,issues:['UNKNOWN_WAYPOINT']});
    x=w.position.x;z=w.position.z;y=null;yaw=w.yawDegrees;pitch=w.pitchDegrees;initial=true;
  }else if(['MOVE_FORWARD','MOVE_BACKWARD','STRAFE_LEFT','STRAFE_RIGHT'].includes(action)){
    const magnitude=clamp(finite(intent.magnitude)?Math.abs(intent.magnitude):p.movementStepWorldUnits,0,p.maximumMovementIntentWorldUnits),d=translationForAction(currentState,action,magnitude);
    x+=d.x;z+=d.z;traversal=followSweptTerrainPath(currentState,x,z,yaw);
  }else if(action==='TURN_LEFT')yaw-=clamp(finite(intent.degrees)?Math.abs(intent.degrees):p.turnStepDegrees,0,8);
  else if(action==='TURN_RIGHT')yaw+=clamp(finite(intent.degrees)?Math.abs(intent.degrees):p.turnStepDegrees,0,8);
  else if(action==='PITCH_UP')pitch+=clamp(finite(intent.degrees)?Math.abs(intent.degrees):p.pitchStepDegrees,0,8);
  else if(action==='PITCH_DOWN')pitch-=clamp(finite(intent.degrees)?Math.abs(intent.degrees):p.pitchStepDegrees,0,8);
  else if(action==='ZOOM_IN')fov-=clamp(finite(intent.degrees)?Math.abs(intent.degrees):3,0,6);
  else if(action==='ZOOM_OUT')fov+=clamp(finite(intent.degrees)?Math.abs(intent.degrees):3,0,6);
  else if(action==='SET_CAMERA_POSITION'){
    x=intent.position?.x;z=intent.position?.z;y=intent.position?.y;
    traversal=followSweptTerrainPath(currentState,x,z,yaw);
  }
  if(traversal&&!traversal.eligible){
    const held=resolveLawfulPosition({worldX:currentState.position.x,worldZ:currentState.position.z,requestedY:currentState.position.y,yawDegrees:currentState.yawDegrees});
    return freeze({ok:false,status:'NAVIGATION_PROPOSAL_REJECTED_STATE_PRESERVED',state:createState({positionResult:held,yawDegrees:currentState.yawDegrees,pitchDegrees:currentState.pitchDegrees,verticalFovDegrees:currentState.verticalFovDegrees,sequence,action,accepted:false,recovered:false,rejectionReason:traversal.status,previousVerticalDelta:currentState.verticalDelta??0,traversal}),issues:traversal.issues});
  }
  const r=traversal?.eligible?traversal.positionResult:resolveLawfulPosition({worldX:x,worldZ:z,requestedY:y,yawDegrees:yaw,initial});
  if(!r.eligible){
    const held=resolveLawfulPosition({worldX:currentState.position.x,worldZ:currentState.position.z,requestedY:currentState.position.y,yawDegrees:currentState.yawDegrees});
    return freeze({ok:false,status:'NAVIGATION_PROPOSAL_REJECTED_STATE_PRESERVED',state:createState({positionResult:held,yawDegrees:currentState.yawDegrees,pitchDegrees:currentState.pitchDegrees,verticalFovDegrees:currentState.verticalFovDegrees,sequence,action,accepted:false,recovered:false,rejectionReason:r.status,previousVerticalDelta:currentState.verticalDelta??0,traversal}),issues:r.issues});
  }
  const state=createState({positionResult:r,yawDegrees:yaw,pitchDegrees:pitch,verticalFovDegrees:fov,sequence,action,accepted:true,recovered:traversal?.recovered??r.recovered,previousVerticalDelta:currentState.verticalDelta??0,traversal});
  return freeze({ok:true,status:traversal?'NAVIGATION_PROPOSAL_ACCEPTED_TERRAIN_CONFORMING':r.recovered?'NAVIGATION_PROPOSAL_ACCEPTED_WITH_TERRAIN_RECOVERY':'NAVIGATION_PROPOSAL_ACCEPTED',state,issues:[]});
}

export function createHEarthFunctionalLandscapeCamera(state){
  if(!state||state.contractId!==H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID)return null;
  const yaw=state.yawDegrees*Math.PI/180,pitch=state.pitchDegrees*Math.PI/180,h=Math.cos(pitch),d=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.lookDistanceWorldUnits,dir={x:Math.sin(yaw)*h,y:Math.sin(pitch),z:-Math.cos(yaw)*h};
  return freeze({position:freeze({...state.position}),target:freeze({x:state.position.x+dir.x*d,y:state.position.y+dir.y*d,z:state.position.z+dir.z*d}),up:freeze({x:0,y:1,z:0}),verticalFovDegrees:state.verticalFovDegrees,nearPlane:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.nearPlane,farPlane:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.farPlane,sourceCapacityContractId:'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5',cameraAuthority:'SUCCESSOR_COMPOSITOR_ACCEPTED_NAVIGATION_PROPOSAL',terrainClearanceReceiptId:state.terrainClearanceReceiptId,visibleTerrainClearanceContractId:state.clearanceSurfaceContractId});
}

export function evaluateHEarthFunctionalLandscapeNavigationState(state){
  const issues=[];
  if(!state||state.contractId!==H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID)issues.push('NAVIGATION_STATE_INVALID');
  else{
    const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
    const visible=sampleHEarthVisibleTerrainClearanceEnvelope(state.position.x,state.position.z,{yawDegrees:state.yawDegrees,lookAheadDistance:p.lookAheadClearanceDistance,lateralRadius:p.clearanceFootprintRadius});
    if(visible?.valid!==true)issues.push('VISIBLE_TERRAIN_SAMPLE_INVALID');
    else if(state.position.y<visible.visibleElevation+p.minimumTerrainClearance-1e-9)issues.push('CAMERA_BELOW_VISIBLE_TERRAIN_CLEARANCE');
    const actual=sampleHEarthVisibleTerrainClearanceSurface(state.position.x,state.position.z);
    if(actual?.valid!==true)issues.push('PRESENTED_TERRAIN_SAMPLE_INVALID');
    else if(state.position.y<actual.visibleElevation+p.minimumTerrainClearance-1e-9)issues.push('CAMERA_INTERIOR_TO_PRESENTED_TERRAIN');
    const canonical=sampleHEarthTerrainField(state.position.x,state.position.z);if(canonical?.valid!==true)issues.push('CANONICAL_TERRAIN_SAMPLE_INVALID');
    if(!resolveHEarthNavigableTerrainChunk(state.position.x,state.position.z))issues.push('POSITION_OUTSIDE_NAVIGABLE_TERRAIN');
    if(!state.selectedSemanticAddressId)issues.push('SEMANTIC_SELECTION_MISSING');
    if(state.clearanceSurfaceContractId!==H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID)issues.push('VISIBLE_TERRAIN_CLEARANCE_CONTRACT_MISSING');
    if(state.protectedGeographicFloor!==H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR)issues.push('PROTECTED_GEOGRAPHIC_FLOOR_IDENTITY_MISMATCH');
    if(state.terrainConformingLocomotionContractId!==H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID)issues.push('TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_MISSING');
    if(state.traversal?.interiorTransitionRepresentable===true)issues.push('INTERIOR_TRANSITION_REPRESENTABLE');
    if(Math.abs(state.verticalDelta??0)>Math.max(p.maximumUphillRisePerProposal,p.maximumDownhillSettlePerProposal)+1e-9)issues.push('VERTICAL_DELTA_BOUND_EXCEEDED');
  }
  return freeze({eligible:issues.length===0,status:issues.length?'NAVIGATION_STATE_FAIL':'NAVIGATION_STATE_PASS',issues});
}
