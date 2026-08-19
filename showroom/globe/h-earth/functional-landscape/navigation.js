/**
 * /showroom/globe/h-earth/functional-landscape/navigation.js
 * H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_RUN_6F_v1
 *
 * Gen324: ordinary ground locomotion is terrain-supported. Accepted X/Z
 * positions derive camera Y from the exact presented terrain surface plus the
 * required observer support offset. Swept-path anti-tunneling remains active;
 * camera-volume and observer-view clearance remain secondary protections.
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
export const H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID='H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_GEN324_v1';

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE=freeze({
  contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
  cameraClearanceSuccessorContractId:H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_CONTRACT_ID,
  terrainConformingLocomotionContractId:H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID,
  terrainSupportedLocomotionContractId:H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID,
  visibleTerrainClearanceContractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
  protectedGeographicFloor:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
  eyeHeight:2.25,
  minimumTerrainClearance:1.6,
  terrainSupportOffset:2.25,
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
  authority:freeze({emitsCameraProposal:true,validatesTerrainClearance:true,validatesSweptPresentedTerrainTraversal:true,bindsGroundLocomotionToPresentedTerrainSupport:true,retainsLastLawfulStateForRecovery:true,samplesPresentedTerrainRepresentation:true,ownsCanonicalCameraState:false,ownsTerrainField:false,ownsVisibleRelief:false,ownsGeography:false,ownsTopology:false,ownsNavigationScale:false,ownsSemanticAddressIdentity:false,ownsCollisionOrPhysics:false,ownsRenderer:false})
});

export const H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS=freeze({COAST:{waypointId:'COAST',label:'Coastal entry',position:{x:0,z:-96},yawDegrees:0,pitchDegrees:-8},BERM:{waypointId:'BERM',label:'Coastal berm',position:{x:0,z:-132},yawDegrees:0,pitchDegrees:-7},LOWLAND:{waypointId:'LOWLAND',label:'Lowland',position:{x:-42,z:-158},yawDegrees:-18,pitchDegrees:-6},HILL:{waypointId:'HILL',label:'Navigable hill',position:{x:72,z:-172},yawDegrees:18,pitchDegrees:-8},RIDGE:{waypointId:'RIDGE',label:'Ridge or bluff',position:{x:145,z:-225},yawDegrees:12,pitchDegrees:-10}});
const terrainChunks=()=>H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks.filter(c=>c.terrainMemberAddressIds.length>0&&c.physicalRole.includes('TERRAIN'));
export function resolveHEarthNavigableTerrainChunk(worldX,worldZ){if(!finite(worldX)||!finite(worldZ))return null;const e=1e-8;return terrainChunks().filter(c=>worldX>=c.worldBounds.xMin-e&&worldX<=c.worldBounds.xMax+e&&worldZ>=c.worldBounds.zMin-e&&worldZ<=c.worldBounds.zMax+e).sort((a,b)=>a.chunkId.localeCompare(b.chunkId))[0]??null}
function parseAddress(address){const m=/:R(\d+):C(\d+)$/.exec(address);return m?{address,row:Number(m[1]),column:Number(m[2])}:null}
function resolveSemanticSelection(chunk,x,z){const candidates=chunk.terrainMemberAddressIds.map(parseAddress).filter(Boolean);if(!candidates.length)return freeze({selectedSemanticAddressId:null,selectionProjectionModel:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.selectionProjectionModel});const xp=clamp((x-chunk.worldBounds.xMin)/Math.max(1e-8,chunk.worldBounds.xMax-chunk.worldBounds.xMin),0,.999999),zp=clamp((z-chunk.worldBounds.zMin)/Math.max(1e-8,chunk.worldBounds.zMax-chunk.worldBounds.zMin),0,.999999),tc=chunk.addressRange.columnMin+Math.floor(xp*4),tr=chunk.addressRange.rowMin+Math.floor(zp*4),selected=[...candidates].sort((a,b)=>(Math.abs(a.row-tr)+Math.abs(a.column-tc))-(Math.abs(b.row-tr)+Math.abs(b.column-tc))||a.address.localeCompare(b.address))[0];return freeze({selectedSemanticAddressId:selected.address,targetSemanticCoordinate:{row:tr,column:tc},selectionProjectionModel:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.selectionProjectionModel})}

function resolveLawfulPosition({worldX,worldZ,requestedY=null,yawDegrees=0,initial=false,terrainSupported=false}){
  const chunk=resolveHEarthNavigableTerrainChunk(worldX,worldZ);if(!chunk)return freeze({eligible:false,status:'POSITION_OUTSIDE_NAVIGABLE_TERRAIN',issues:['NO_NAVIGABLE_TERRAIN_CHUNK']});
  const canonicalTerrainSample=sampleHEarthTerrainField(worldX,worldZ);if(canonicalTerrainSample?.valid!==true||!finite(canonicalTerrainSample.elevation))return freeze({eligible:false,status:'TERRAIN_SAMPLE_INVALID',issues:['CANONICAL_TERRAIN_SAMPLE_INVALID']});
  const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,actualSurface=sampleHEarthVisibleTerrainClearanceSurface(worldX,worldZ);if(actualSurface?.valid!==true||!finite(actualSurface.visibleElevation))return freeze({eligible:false,status:'PRESENTED_TERRAIN_SURFACE_INVALID',issues:['PRESENTED_TERRAIN_SURFACE_INVALID']});
  const visible=sampleHEarthVisibleTerrainClearanceEnvelope(worldX,worldZ,{yawDegrees,lookAheadDistance:p.lookAheadClearanceDistance,lateralRadius:p.clearanceFootprintRadius});if(visible?.valid!==true||!finite(visible.visibleElevation))return freeze({eligible:false,status:'VISIBLE_TERRAIN_CLEARANCE_SAMPLE_INVALID',issues:['VISIBLE_TERRAIN_CLEARANCE_SAMPLE_INVALID']});
  const supportY=actualSurface.visibleElevation+p.terrainSupportOffset,secondaryMinimumY=visible.visibleElevation+p.minimumTerrainClearance,secondaryTargetY=visible.visibleElevation+p.eyeHeight;
  let y,mode;
  if(initial||!finite(requestedY)){y=Math.max(supportY,secondaryTargetY);mode:'INITIAL_TERRAIN_SUPPORT_LOCK'}
  if(initial||!finite(requestedY)){mode='INITIAL_TERRAIN_SUPPORT_LOCK'}
  else if(terrainSupported){y=Math.max(supportY,secondaryMinimumY);mode='TERRAIN_SUPPORTED_GROUND_FOLLOW'}
  else {const error=secondaryTargetY-requestedY;if(Math.abs(error)<=p.clearanceDeadband){y=Math.max(requestedY,secondaryMinimumY);mode='DEADBAND_HOLD'}else if(error>0){y=requestedY+Math.min(error,p.maximumUphillRisePerProposal);if(y<secondaryMinimumY)return freeze({eligible:false,status:'UPHILL_CLEARANCE_RATE_EXCEEDED',issues:['CAMERA_CANNOT_REACH_VISIBLE_TERRAIN_CLEARANCE_WITHIN_BOUND']});mode='BOUNDED_UPHILL_FOLLOW'}else{y=Math.max(requestedY-Math.min(-error,p.maximumDownhillSettlePerProposal),secondaryMinimumY);mode='CONTROLLED_DOWNHILL_SETTLE'}}
  const actualSurfaceClearance=y-actualSurface.visibleElevation,clearance=y-visible.visibleElevation,selection=resolveSemanticSelection(chunk,worldX,worldZ);
  return freeze({eligible:actualSurfaceClearance>=p.minimumTerrainClearance-1e-9&&clearance>=p.minimumTerrainClearance-1e-9,status:'POSITION_TERRAIN_SUPPORTED_CLEARANCE_PASS',position:{x:worldX,y,z:worldZ},terrainElevation:visible.visibleElevation,visibleTerrainElevation:visible.visibleElevation,actualSurfaceElevation:actualSurface.visibleElevation,actualSurfaceClearance,terrainSupportY:supportY,terrainSupportError:y-supportY,terrainSupported,canonicalTerrainElevation:canonicalTerrainSample.elevation,minimumCameraY:secondaryMinimumY,targetCameraY:secondaryTargetY,clearance,recovered:finite(requestedY)&&requestedY<supportY,verticalResponseMode:mode,verticalDelta:finite(requestedY)?y-requestedY:0,clearanceSurfaceContractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,protectedGeographicFloor:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,chunkId:chunk.chunkId,physicalRole:chunk.physicalRole,formationIds:chunk.formationIds,selectedSemanticAddressId:selection.selectedSemanticAddressId,selectionProjectionModel:selection.selectionProjectionModel,terrainSample:canonicalTerrainSample,visibleTerrainSample:visible,actualSurfaceSample:actualSurface,issues:[]})
}

export function resolveHEarthSweptTerrainTraversal(startPosition,endPosition){const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;if(!startPosition||!endPosition||![startPosition.x,startPosition.z,endPosition.x,endPosition.z].every(finite))return freeze({traversable:false,status:'SWEPT_TERRAIN_PATH_INVALID',issues:['SWEEP_ENDPOINT_INVALID'],samples:[]});const dx=endPosition.x-startPosition.x,dz=endPosition.z-startPosition.z,distance=Math.hypot(dx,dz),steps=Math.max(1,Math.ceil(distance/p.sweptPathSampleSpacing)),samples=[];let previous=null,maxGradeRisePerRun=0,maxGradeDegrees=0;for(let i=0;i<=steps;i++){const t=i/steps,x=startPosition.x+dx*t,z=startPosition.z+dz*t;if(!resolveHEarthNavigableTerrainChunk(x,z))return freeze({traversable:false,status:'SWEPT_PATH_OUTSIDE_NAVIGABLE_TERRAIN',issues:['SWEPT_PATH_OUTSIDE_NAVIGABLE_TERRAIN'],samples});const surface=sampleHEarthVisibleTerrainClearanceSurface(x,z);if(surface?.valid!==true||!finite(surface.visibleElevation))return freeze({traversable:false,status:'SWEPT_TERRAIN_SAMPLE_INVALID',issues:['SWEPT_TERRAIN_SAMPLE_INVALID'],samples});const sample={index:i,t,x,z,terrainY:surface.visibleElevation};if(previous){const run=Math.hypot(x-previous.x,z-previous.z),rise=surface.visibleElevation-previous.terrainY,gradeRisePerRun=run>1e-9?Math.abs(rise)/run:0,gradeDegrees=Math.atan(gradeRisePerRun)*180/Math.PI;Object.assign(sample,{run,rise,gradeRisePerRun,gradeDegrees});maxGradeRisePerRun=Math.max(maxGradeRisePerRun,gradeRisePerRun);maxGradeDegrees=Math.max(maxGradeDegrees,gradeDegrees);if(gradeRisePerRun>p.maximumTraversableGradeRisePerRun+1e-9)return freeze({traversable:false,status:'NONCLIMBABLE_GRADE_REJECTED',issues:['NONCLIMBABLE_GRADE_REJECTED'],samples:freeze([...samples,freeze(sample)]),distance,maxGradeRisePerRun,maxGradeDegrees,blockingSample:freeze(sample),interiorTransitionRepresentable:false})}samples.push(freeze(sample));previous=sample}return freeze({traversable:true,status:'SWEPT_TERRAIN_PATH_TRAVERSABLE',issues:[],samples,distance,maxGradeRisePerRun,maxGradeDegrees,sampleCount:samples.length,sweptBeforePositionAcceptance:true,interiorTransitionRepresentable:false})}
function followSweptTerrainPath(currentState,targetX,targetZ,yawDegrees){const sweep=resolveHEarthSweptTerrainTraversal(currentState.position,{x:targetX,z:targetZ});if(!sweep.traversable)return freeze({eligible:false,status:sweep.status,issues:sweep.issues,sweep});let positionResult=null,requestedY=currentState.position.y,totalVerticalDelta=0;for(let i=1;i<sweep.samples.length;i++){const s=sweep.samples[i],r=resolveLawfulPosition({worldX:s.x,worldZ:s.z,requestedY,yawDegrees,terrainSupported:true});if(!r.eligible)return freeze({eligible:false,status:r.status,issues:r.issues,sweep,blockedAtSample:i});totalVerticalDelta+=r.position.y-requestedY;requestedY=r.position.y;positionResult=r}if(!positionResult){positionResult=resolveLawfulPosition({worldX:targetX,worldZ:targetZ,requestedY,yawDegrees,terrainSupported:true});if(!positionResult.eligible)return freeze({eligible:false,status:positionResult.status,issues:positionResult.issues,sweep})}return freeze({eligible:true,status:'SWEPT_TERRAIN_SUPPORTED_TRAVERSAL_PASS',issues:[],positionResult,recovered:false,totalVerticalDelta,sweep,terrainConforming:true,terrainSupported:true,interiorTransitionRepresentable:false})}
function createState({positionResult,yawDegrees,pitchDegrees,verticalFovDegrees,sequence,action,accepted,recovered,rejectionReason=null,previousVerticalDelta=0,traversal=null}){const traversalInfo=traversal?freeze({mode:traversal.status,sweptBeforePositionAcceptance:traversal.sweep?.sweptBeforePositionAcceptance===true,sweptTerrainSampleCount:traversal.sweep?.sampleCount??traversal.sweep?.samples?.length??0,maxGradeRisePerRun:traversal.sweep?.maxGradeRisePerRun??0,maxGradeDegrees:traversal.sweep?.maxGradeDegrees??0,terrainConforming:traversal.terrainConforming===true,terrainSupported:traversal.terrainSupported===true,interiorTransitionRepresentable:traversal.interiorTransitionRepresentable===true}):freeze({mode:'NO_TRANSLATIONAL_SWEEP',sweptBeforePositionAcceptance:false,sweptTerrainSampleCount:0,maxGradeRisePerRun:0,maxGradeDegrees:0,terrainConforming:false,terrainSupported:false,interiorTransitionRepresentable:false});return freeze({contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,cameraClearanceSuccessorContractId:H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_CONTRACT_ID,terrainConformingLocomotionContractId:H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_CONTRACT_ID,terrainSupportedLocomotionContractId:H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID,stateId:`H_EARTH_NAVIGATION_STATE_${String(sequence).padStart(4,'0')}`,sequence,action,accepted,recovered,rejectionReason,position:positionResult.position,yawDegrees: