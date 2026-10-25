/**
 * H-Earth terrain-supported navigation successor.
 * Ordinary ground traversal derives camera Y from the exact presented terrain.
 */
import {resolveGeologicalRuntimeFootSupport,getGeologicalRuntimeBridge} from './geological-runtime-bridge.v1.js?rev=gen2780-stable-planting-v1';
import { H_EARTH_3D_CAMERA_CAPACITY } from '../capacity.js';
import { sampleHEarthTerrainField } from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN } from '../../../../h-earth-3d/integration/h-earth.landscape-realization-planner.js';
import {
  H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
  H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
  sampleHEarthVisibleTerrainClearanceSurface
} from './visible-terrain-clearance.js?cb=3bd635f46186bf3c';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const norm=d=>{let x=d%360;if(x>180)x-=360;if(x<-180)x+=360;return x};

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID='H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_RUN_6F_v1';
export const H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_CONTRACT_ID='H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_GEN324_v1';
export const H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID='H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_GEN324_v1';
// The walking limit is separate from the original semantic-address chunks.
// These bounds remain inside the existing near/mid terrain and its clearance footprint.
export const H_EARTH_MOUNTAIN_TRAVERSAL_DOMAIN=freeze({xMin:-256,xMax:256,zMin:-400,zMax:-80});
export const H_EARTH_NAVIGATION_BOUNDARY_MESSAGE="You've reached the edge of this area. Turn back to continue exploring.";
export function isHEarthPositionInsideTraversalDomain(x,z){const b=H_EARTH_MOUNTAIN_TRAVERSAL_DOMAIN;return finite(x)&&finite(z)&&x>=b.xMin&&x<=b.xMax&&z>=b.zMin&&z<=b.zMax;}
export function resolveHEarthNavigationBoundaryFeedback(previousMessage,proposal){
  const travel=['MOVE_FORWARD','MOVE_BACKWARD','STRAFE_LEFT','STRAFE_RIGHT'].includes(proposal?.intent?.action);
  if(travel&&proposal.accepted===false&&proposal.issues?.includes('OUTER_NAVIGATION_BOUNDARY'))return H_EARTH_NAVIGATION_BOUNDARY_MESSAGE;
  if(proposal?.accepted===true&&proposal.moved===true)return '';
  return previousMessage??'';
}
export const H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE=freeze({
  contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
  cameraClearanceSuccessorContractId:H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_CONTRACT_ID,
  terrainSupportedLocomotionContractId:H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID,
  visibleTerrainClearanceContractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
  protectedGeographicFloor:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
  eyeHeight:2.25,minimumTerrainClearance:1.6,hardTerrainSupportOffset:2.25,
  sweptTerrainSampleSpacing:0.35,movementStepWorldUnits:5,maximumMovementIntentWorldUnits:12,
  lookAheadClearanceDistance:6,clearanceFootprintRadius:1.25,lookDistanceWorldUnits:18,
  turnStepDegrees:6,pitchStepDegrees:4,pitchMinimumDegrees:-42,pitchMaximumDegrees:32,
  verticalFovMinimumDegrees:H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.verticalFovDegrees.minimum,
  verticalFovMaximumDegrees:H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.verticalFovDegrees.maximum,
  nearPlane:H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.nearPlane,
  farPlane:H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.farPlane,
  selectionProjectionModel:'CHUNK_LOCAL_NEAREST_AVAILABLE_TERRAIN_MEMBER',
  authority:freeze({emitsCameraProposal:true,validatesTerrainClearance:true,retainsLastLawfulStateForRecovery:true,samplesPresentedTerrainRepresentation:true,terrainSupportedLocomotion:true,ownsCanonicalCameraState:false,ownsTerrainField:false,ownsVisibleRelief:false,ownsGeography:false,ownsTopology:false,ownsNavigationScale:false,ownsSemanticAddressIdentity:false,ownsCollisionOrPhysics:false,ownsRenderer:false})
});

export const H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS=freeze({
  COAST:{waypointId:'COAST',label:'Coastal entry',position:{x:0,z:-96},yawDegrees:0,pitchDegrees:-8},
  BERM:{waypointId:'BERM',label:'Coastal berm',position:{x:0,z:-132},yawDegrees:0,pitchDegrees:-7},
  LOWLAND:{waypointId:'LOWLAND',label:'Lowland',position:{x:-42,z:-158},yawDegrees:-18,pitchDegrees:-6},
  HILL:{waypointId:'HILL',label:'Navigable hill',position:{x:72,z:-172},yawDegrees:18,pitchDegrees:-8},
  RIDGE:{waypointId:'RIDGE',label:'Ridge or bluff',position:{x:145,z:-225},yawDegrees:12,pitchDegrees:-10},
  // Owner-reviewed exact walking camera (woodland-clearing-trial.record.json).
  // Explicit visit only: the canonical COAST landing remains unchanged.
  // Explicit candidate-only visit; default H-Earth coastal entry is unchanged.
  GEOLOGICAL_CAVERN_REAR_APPROACH:{waypointId:'GEOLOGICAL_CAVERN_REAR_APPROACH',label:'Rear-valley natural cavern',position:{x:40,z:-264},yawDegrees:180,pitchDegrees:4},
  WOODLAND_CLEARING_FOUR_TREES:{waypointId:'WOODLAND_CLEARING_FOUR_TREES',label:'Four approved woodland trees',position:{x:-139.40267987050615,z:-194.5},yawDegrees:0,pitchDegrees:16}
});

const terrainChunks=()=>H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks.filter(c=>c.terrainMemberAddressIds.length>0&&c.physicalRole.includes('TERRAIN'));
function containedTerrainChunk(x,z){const e=1e-8;return terrainChunks().filter(c=>x>=c.worldBounds.xMin-e&&x<=c.worldBounds.xMax+e&&z>=c.worldBounds.zMin-e&&z<=c.worldBounds.zMax+e).sort((a,b)=>a.chunkId.localeCompare(b.chunkId))[0]??null;}
export function resolveHEarthNavigableTerrainChunk(x,z){
  if(!isHEarthPositionInsideTraversalDomain(x,z))return null;
  const contained=containedTerrainChunk(x,z);if(contained)return contained;
  // Preserve accepted address identities; extended ground projects to the nearest
  // existing terrain chunk. This does not enlarge that chunk's canonical bounds.
  const distance=c=>{const b=c.worldBounds;return Math.hypot(x-clamp(x,b.xMin,b.xMax),z-clamp(z,b.zMin,b.zMax));};
  return terrainChunks().sort((a,b)=>distance(a)-distance(b)||a.chunkId.localeCompare(b.chunkId))[0]??null;
}
function parseAddress(a){const m=/:R(\d+):C(\d+)$/.exec(a);return m?{address:a,row:Number(m[1]),column:Number(m[2])}:null;}
function semantic(chunk,x,z){const c=chunk.terrainMemberAddressIds.map(parseAddress).filter(Boolean);if(!c.length)return{selectedSemanticAddressId:null};const xp=clamp((x-chunk.worldBounds.xMin)/Math.max(1e-8,chunk.worldBounds.xMax-chunk.worldBounds.xMin),0,.999999),zp=clamp((z-chunk.worldBounds.zMin)/Math.max(1e-8,chunk.worldBounds.zMax-chunk.worldBounds.zMin),0,.999999),tc=chunk.addressRange.columnMin+Math.floor(xp*4),tr=chunk.addressRange.rowMin+Math.floor(zp*4);return{selectedSemanticAddressId:[...c].sort((a,b)=>(Math.abs(a.row-tr)+Math.abs(a.column-tc))-(Math.abs(b.row-tr)+Math.abs(b.column-tc))||a.address.localeCompare(b.address))[0].address};}
// Local physical support is never blended: it remains an immutable hard floor.
function sampleExteriorSupport(x,z){
  const support=resolveGeologicalRuntimeFootSupport(x,z,{layer:'SURFACE'});
  if(support&&support.class!=='INTERIOR')return support.eligible?
    {valid:true,visibleElevation:support.footY,geologicalSupport:support}:
    {valid:false,issues:support.issues};
  return sampleHEarthVisibleTerrainClearanceSurface(x,z);
}
function exteriorRimDistance(x,z,model){
  const b=model.localBounds,front=b.zMax;
  // Exact L-shaped exterior support footprint used by the installed bridge.
  const points=[[b.xMin,b.zMin],[b.xMax,b.zMin],[b.xMax,front],[-120,front],[-120,-440],[b.xMin,-440]];
  let distance=Infinity;
  for(let i=0;i<points.length;i++){
    const [ax,az]=points[i],[bx,bz]=points[(i+1)%points.length],dx=bx-ax,dz=bz-az;
    const t=clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz),0,1);
    distance=Math.min(distance,Math.hypot(x-ax-t*dx,z-az-t*dz));
  }
  return distance;
}
function stateNavigationLayer(state){
  if(state.navigationLayer==='SURFACE')return 'SURFACE';
  if(state.navigationLayer==='INTERIOR'){
    const support=resolveGeologicalRuntimeFootSupport(state.position.x,state.position.z,{layer:'INTERIOR'});
    return support?.eligible&&Math.abs(state.position.y-support.eyeY)<1e-6?'INTERIOR':'INVALID';
  }
  if(state.navigationLayer!==undefined)return 'INVALID';
  // One-time compatibility for an already accepted old interior state. X/Z
  // alone never selects the cave; its recorded height must fit the real floor.
  if(state.geologicalFloorClass==='INTERIOR'){
    const support=resolveGeologicalRuntimeFootSupport(state.position.x,state.position.z,{layer:'INTERIOR'});
    if(support?.eligible&&Math.abs(state.position.y-support.eyeY)<1e-6)return 'INTERIOR';
  }
  return 'SURFACE';
}
function layerForSegment(from,x,z){
  const layer=from.navigationLayer??'SURFACE',model=getGeologicalRuntimeBridge();
  if(!model)return{eligible:layer==='SURFACE',layer,issues:['GEOLOGICAL_INTERIOR_UNAVAILABLE']};
  const {site,portal}=model,start=from.position;
  const entering=layer==='SURFACE'&&start.z<site.portalZ&&z>=site.portalZ;
  const exiting=layer==='INTERIOR'&&start.z>=site.portalZ&&z<site.portalZ;
  if(!entering&&!exiting)return{eligible:true,layer};
  const t=(site.portalZ-start.z)/(z-start.z),crossX=start.x+(x-start.x)*t;
  const crossing=resolveGeologicalRuntimeFootSupport(crossX,site.portalZ+1e-5,{layer:'INTERIOR'});
  const distance=Math.hypot(crossX-start.x,site.portalZ-start.z),allowance=.65*distance+.04;
  const lowAndAligned=crossing?.eligible&&Math.abs(from.terrainElevation-crossing.footY)<=allowance&&
    Math.abs(start.y-crossing.eyeY)<=allowance&&start.y<=crossing.ceilingY-.35;
  if(lowAndAligned)return{eligible:true,layer:entering?'INTERIOR':'SURFACE'};
  if(exiting)return{eligible:false,layer,issues:['CAVERN_PORTAL_CROSSING_REJECTED']};
  // High surface travel over the opening stays on the upper skin. A low
  // approach may not jump a vertical rock face when the aperture is blocked.
  if(crossX>=portal.aperture.xMin&&crossX<=portal.aperture.xMax){
    const top=resolveGeologicalRuntimeFootSupport(crossX,site.portalZ+1e-5,{layer:'SURFACE'});
    const section=model.formation.caveSectionAt?.(crossX,site.portalZ);
    const openingCeiling=section?.ceilingY??model.formation.roofAt?.(crossX,site.portalZ);
    if(top?.eligible&&finite(openingCeiling)&&start.y<openingCeiling&&from.terrainElevation<top.footY-allowance)
      return{eligible:false,layer,issues:['CAVERN_PORTAL_CROSSING_REJECTED']};
  }
  return{eligible:true,layer};
}
function guardSupportAt(from,x,z,p){
  const transition=layerForSegment(from,x,z);
  if(!transition.eligible)return{eligible:false,class:'INTERIOR',issues:transition.issues};
  return resolveGeologicalRuntimeFootSupport(x,z,{eyeHeight:p.eyeHeight,layer:transition.layer});
}
function nearCameraSupport(x,z,p,ground){
  const origin={position:{x,y:ground+p.eyeHeight,z},terrainElevation:ground,navigationLayer:'SURFACE'};
  // A yaw-independent local geometric guard rejects obstructed positions;
  // it never raises the walking eye above its local support. The existing
  // cave wall clearance is .35m. This is a sampled guard, not full physics.
  const radius=Math.max(.35,2*p.nearPlane);
  let highest=-Infinity;
  for(let i=0;i<17;i++){
    const angle=i*Math.PI/8,r=i===16?0:radius;
    const sx=x+Math.cos(angle)*r,sz=z+Math.sin(angle)*r;
    let cave=guardSupportAt(origin,sx,sz,p);
    const model=getGeologicalRuntimeBridge();
    if(cave&&!cave.eligible&&model&&cave.class==='EXTERIOR_DRY_CHANNEL'&&
        cave.issues?.length===1&&cave.issues[0]==='GEOLOGICAL_VISIBLE_OUTDOOR_SUPPORT_MISSING'&&
        (exteriorRimDistance(sx,sz,model)<=1e-5||Math.abs(sz-model.site.portalZ)<=1e-5)){
      // A guard sample exactly on the emitted rim can fall between rounded
      // triangles. Query actual physical neighbors at ±20 micrometre X/Z offsets and
      // retain their highest support; never substitute the intact mountain.
      // A real interior collision remains a rejection, even at this epsilon.
      let highestSupport=null;
      for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){
        const adjacent=guardSupportAt(origin,sx+dx*2e-5,sz+dz*2e-5,p);
        if(adjacent?.class==='INTERIOR'&&!adjacent.eligible)return{eligible:false,issues:adjacent.issues};
        if(adjacent?.eligible&&(!highestSupport||adjacent.footY>highestSupport.footY))highestSupport=adjacent;
      }
      if(highestSupport)cave=highestSupport;
    }
    if(cave&&!cave.eligible)return{eligible:false,issues:cave.issues};
    const surface=cave?{valid:true,visibleElevation:cave.footY}:sampleHEarthVisibleTerrainClearanceSurface(sx,sz);
    if(!surface.valid)return{eligible:false,issues:['NEAR_CAMERA_SUPPORT_UNAVAILABLE']};
    highest=Math.max(highest,surface.visibleElevation);
  }
  return{eligible:true,minimumCameraY:highest+p.minimumTerrainClearance,radius};
}
function resolvePosition(x,z,yaw=0,layer='SURFACE'){
  if(layer!=='SURFACE'&&layer!=='INTERIOR')return{eligible:false,issues:['GEOLOGICAL_NAVIGATION_LAYER_INVALID']};
  if(!finite(x)||!finite(z))return{eligible:false,issues:['NAVIGATION_POSITION_INVALID']};
  if(!isHEarthPositionInsideTraversalDomain(x,z))return{eligible:false,issues:['OUTER_NAVIGATION_BOUNDARY']};
  const chunk=resolveHEarthNavigableTerrainChunk(x,z);
  if(!chunk)return{eligible:false,issues:['NO_NAVIGABLE_TERRAIN_CHUNK']};
  const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE;
  const cave=resolveGeologicalRuntimeFootSupport(x,z,{eyeHeight:p.eyeHeight,layer});
  if(cave&&!cave.eligible)return{eligible:false,issues:cave.issues};
  const canonical=sampleHEarthTerrainField(x,z),sel=semantic(chunk,x,z);
  if(cave?.class==='INTERIOR'){
    const y=cave.footY+p.eyeHeight;
    if(!finite(cave.ceilingY)||y>cave.ceilingY-.35)return{eligible:false,issues:['CAVERN_SOLID_OR_HEADROOM_COLLISION']};
    return{eligible:true,navigationLayer:'INTERIOR',position:{x,y,z},terrainElevation:cave.footY,
      visibleTerrainElevation:cave.footY,clearanceReferenceElevation:cave.footY,
      canonicalTerrainElevation:canonical?.valid?canonical.elevation:cave.footY,
      minimumCameraY:y,targetCameraY:y,clearance:p.eyeHeight,
      chunkId:chunk.chunkId,physicalRole:chunk.physicalRole,formationIds:chunk.formationIds,
      selectedSemanticAddressId:sel.selectedSemanticAddressId,selectionProjectionModel:'GEOLOGICAL_PHYSICAL_CAVERN_FLOOR',
      terrainSupported:true,geologicalPhysicalSupport:true,geologicalFloorClass:cave.class,
      geologicalCeilingY:cave.ceilingY,issues:[]};
  }
  const surface=sampleExteriorSupport(x,z);
  if(canonical?.valid!==true||surface?.valid!==true)return{eligible:false,issues:['PRESENTED_TERRAIN_SAMPLE_INVALID']};
  const ground=surface.visibleElevation,y=ground+p.eyeHeight;
  const near=nearCameraSupport(x,z,p,ground);
  if(!near.eligible)return near;
  if(y<near.minimumCameraY-1e-8)return{eligible:false,issues:['LOCAL_TERRAIN_CLEARANCE_COLLISION']};
  const minimumCameraY=y;
  return{eligible:true,navigationLayer:'SURFACE',position:{x,y,z},terrainElevation:ground,visibleTerrainElevation:ground,
    clearanceReferenceElevation:ground,canonicalTerrainElevation:canonical.elevation,
    minimumCameraY,targetCameraY:y,clearance:y-ground,
    chunkId:chunk.chunkId,physicalRole:chunk.physicalRole,formationIds:chunk.formationIds,
    selectedSemanticAddressId:sel.selectedSemanticAddressId,
    selectionProjectionModel:cave?'GEOLOGICAL_PHYSICAL_EXTERIOR_LOCAL_SUPPORT':containedTerrainChunk(x,z)?p.selectionProjectionModel:'EXTENDED_GROUND_NEAREST_EXISTING_TERRAIN_MEMBER',
    terrainSupported:true,geologicalPhysicalSupport:!!cave,geologicalFloorClass:cave?.class??null,
    geologicalCeilingY:null,issues:[]};
}
function sweep(state,x,z,yaw){
  const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,dx=x-state.position.x,dz=z-state.position.z;
  const d=Math.hypot(dx,dz),n=Math.max(1,Math.ceil(d/p.sweptTerrainSampleSpacing));
  let last=resolvePosition(state.position.x,state.position.z,state.yawDegrees,stateNavigationLayer(state));
  if(!last.eligible)return{eligible:false,issues:last.issues,sampleCount:0};
  // Retain the actual accepted source height for portal admission, not a new
  // projected height inferred solely from its X/Z.
  last={...last,position:{...last.position,y:state.position.y}};
  for(let i=1;i<=n;i++){
    const t=i/n,nx=state.position.x+dx*t,nz=state.position.z+dz*t;
    const transition=layerForSegment(last,nx,nz);
    if(!transition.eligible)return{eligible:false,issues:transition.issues,sampleCount:i-1};
    const r=resolvePosition(nx,nz,yaw,transition.layer);
    if(!r.eligible)return{eligible:false,issues:r.issues,sampleCount:i-1};
    // Bound both ascent and descent: local ground attachment cannot turn a
    // vertical face into a step. Retain the tighter cavern/portal grade.
    const grade=(r.navigationLayer==='INTERIOR'||last.navigationLayer==='INTERIOR') ? .65 : 1;
    if(Math.abs(r.terrainElevation-last.terrainElevation)>grade*(d/n)+.04)
      return{eligible:false,issues:['GEOLOGICAL_UNWALKABLE_STEP_GRADE'],sampleCount:i-1};
    last=r;
  }
  return{eligible:true,result:last,sampleCount:n};
}
function stateFrom(r,{yaw,pitch,fov,sequence,action,accepted=true,rejectionReason=null,previousY=null,swept=0}){return freeze({contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,cameraClearanceSuccessorContractId:H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_CONTRACT_ID,terrainSupportedLocomotionContractId:H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_CONTRACT_ID,stateId:`H_EARTH_NAVIGATION_STATE_${String(sequence).padStart(4,'0')}`,sequence,action,accepted,recovered:false,rejectionReason,navigationLayer:r.navigationLayer??'SURFACE',position:r.position,yawDegrees:norm(yaw),pitchDegrees:clamp(pitch,H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.pitchMinimumDegrees,H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.pitchMaximumDegrees),verticalFovDegrees:clamp(fov,H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.verticalFovMinimumDegrees,H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.verticalFovMaximumDegrees),terrainElevation:r.terrainElevation,visibleTerrainElevation:r.visibleTerrainElevation,clearanceReferenceElevation:r.clearanceReferenceElevation,canonicalTerrainElevation:r.canonicalTerrainElevation,minimumCameraY:r.minimumCameraY,targetCameraY:r.targetCameraY,clearance:r.clearance,verticalResponseMode:'HARD_TERRAIN_SUPPORT',verticalDelta:finite(previousY)?r.position.y-previousY:0,verticalAcceleration:0,clearanceSurfaceContractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,protectedGeographicFloor:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,chunkId:r.chunkId,physicalRole:r.physicalRole,formationIds:r.formationIds,selectedSemanticAddressId:r.selectedSemanticAddressId,selectionProjectionModel:r.selectionProjectionModel,terrainClearanceReceiptId:`H_EARTH_VISIBLE_TERRAIN_CLEARANCE_RECEIPT_${String(sequence).padStart(4,'0')}`,terrainSupported:true,geologicalPhysicalSupport:r.geologicalPhysicalSupport===true,geologicalFloorClass:r.geologicalFloorClass??null,geologicalCeilingY:r.geologicalCeilingY??null,sweptTerrainSupportSampleCount:swept,canonicalCameraStateAuthority:false,collisionOrPhysicsClaim:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false,navigationScaleAuthorityCreated:false});}
export function createHEarthFunctionalLandscapeNavigationState({waypointId='COAST'}={}){const w=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[waypointId]??H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST,r=resolvePosition(w.position.x,w.position.z,w.yawDegrees);if(!r.eligible)return freeze({ok:false,status:'INITIAL_NAVIGATION_STATE_REJECTED',issues:r.issues});return freeze({ok:true,status:'INITIAL_NAVIGATION_STATE_COMPLETE',state:stateFrom(r,{yaw:w.yawDegrees,pitch:w.pitchDegrees,fov:56,sequence:1,action:`GOTO_WAYPOINT:${w.waypointId}`}),issues:[]});}
function delta(state,action,m){const y=state.yawDegrees*Math.PI/180,f={x:Math.sin(y),z:-Math.cos(y)},r={x:Math.cos(y),z:Math.sin(y)};if(action==='MOVE_FORWARD')return{x:f.x*m,z:f.z*m};if(action==='MOVE_BACKWARD')return{x:-f.x*m,z:-f.z*m};if(action==='STRAFE_LEFT')return{x:-r.x*m,z:-r.z*m};if(action==='STRAFE_RIGHT')return{x:r.x*m,z:r.z*m};return{x:0,z:0};}
export function proposeHEarthFunctionalLandscapeNavigation(current,intent={}){if(!current||current.contractId!==H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID)return freeze({ok:false,status:'NAVIGATION_PROPOSAL_REJECTED',state:current??null,issues:['CURRENT_NAVIGATION_STATE_INVALID']});const p=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,action=typeof intent.action==='string'?intent.action:'NO_OP',sequence=current.sequence+1;if(action==='RESET'){const r=createHEarthFunctionalLandscapeNavigationState();return freeze({ok:r.ok,status:r.ok?'NAVIGATION_RESET_COMPLETE':'NAVIGATION_RESET_FAILED',state:r.ok?stateFrom(resolvePosition(r.state.position.x,r.state.position.z,r.state.yawDegrees),{yaw:r.state.yawDegrees,pitch:r.state.pitchDegrees,fov:r.state.verticalFovDegrees,sequence,action,previousY:current.position.y}):current,issues:r.issues});}const attachment=resolvePosition(current.position.x,current.position.z,current.yawDegrees,stateNavigationLayer(current));if(!attachment.eligible||!finite(current.position.y)||Math.abs(current.position.y-attachment.position.y)>1e-8)return freeze({ok:false,status:'NAVIGATION_PROPOSAL_REJECTED_STATE_PRESERVED',state:current,issues:attachment.eligible?['CAMERA_NOT_ATTACHED_TO_LOCAL_SUPPORT']:attachment.issues});let x=current.position.x,z=current.position.z,yaw=current.yawDegrees,pitch=current.pitchDegrees,fov=current.verticalFovDegrees;if(action==='GOTO_WAYPOINT'){const w=H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[intent.waypointId];if(!w)return freeze({ok:false,status:'NAVIGATION_WAYPOINT_REJECTED',state:current,issues:['UNKNOWN_WAYPOINT']});x=w.position.x;z=w.position.z;yaw=w.yawDegrees;pitch=w.pitchDegrees;}else if(['MOVE_FORWARD','MOVE_BACKWARD','STRAFE_LEFT','STRAFE_RIGHT'].includes(action)){const m=clamp(finite(intent.magnitude)?Math.abs(intent.magnitude):p.movementStepWorldUnits,0,p.maximumMovementIntentWorldUnits),d=delta(current,action,m);x+=d.x;z+=d.z;}else if(action==='TURN_LEFT')yaw-=clamp(finite(intent.degrees)?Math.abs(intent.degrees):p.turnStepDegrees,0,8);else if(action==='TURN_RIGHT')yaw+=clamp(finite(intent.degrees)?Math.abs(intent.degrees):p.turnStepDegrees,0,8);else if(action==='PITCH_UP')pitch+=clamp(finite(intent.degrees)?Math.abs(intent.degrees):p.pitchStepDegrees,0,8);else if(action==='PITCH_DOWN')pitch-=clamp(finite(intent.degrees)?Math.abs(intent.degrees):p.pitchStepDegrees,0,8);else if(action==='ZOOM_IN')fov-=clamp(finite(intent.degrees)?Math.abs(intent.degrees):3,0,6);else if(action==='ZOOM_OUT')fov+=clamp(finite(intent.degrees)?Math.abs(intent.degrees):3,0,6);else if(action==='SET_CAMERA_POSITION'){x=intent.position?.x;z=intent.position?.z;}const moved=Math.hypot(x-current.position.x,z-current.position.z)>1e-9,s=moved?sweep(current,x,z,yaw):null,r=moved?(s.eligible?s.result:null):resolvePosition(x,z,yaw,stateNavigationLayer(current));if(!r?.eligible)return freeze({ok:false,status:'NAVIGATION_PROPOSAL_REJECTED_STATE_PRESERVED',state:current,issues:s?.issues??r?.issues??['TERRAIN_SUPPORT_REJECTED']});return freeze({ok:true,status:'NAVIGATION_PROPOSAL_ACCEPTED',state:stateFrom(r,{yaw,pitch,fov,sequence,action,previousY:current.position.y,swept:s?.sampleCount??0}),issues:[]});}
export function createHEarthFunctionalLandscapeCamera(state){if(!state||state.contractId!==H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID)return null;const yaw=state.yawDegrees*Math.PI/180,pitch=state.pitchDegrees*Math.PI/180,h=Math.cos(pitch),d=H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.lookDistanceWorldUnits,dir={x:Math.sin(yaw)*h,y:Math.sin(pitch),z:-Math.cos(yaw)*h};return freeze({position:freeze({...state.position}),target:freeze({x:state.position.x+dir.x*d,y:state.position.y+dir.y*d,z:state.position.z+dir.z*d}),up:freeze({x:0,y:1,z:0}),verticalFovDegrees:state.verticalFovDegrees,nearPlane:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.nearPlane,farPlane:H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.farPlane,sourceCapacityContractId:'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5',cameraAuthority:'SUCCESSOR_COMPOSITOR_ACCEPTED_NAVIGATION_PROPOSAL',terrainClearanceReceiptId:state.terrainClearanceReceiptId,visibleTerrainClearanceContractId:state.clearanceSurfaceContractId});}
export function evaluateHEarthFunctionalLandscapeNavigationState(state){const issues=[];if(!state||state.contractId!==H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID)issues.push('NAVIGATION_STATE_INVALID');else{const r=resolvePosition(state.position.x,state.position.z,state.yawDegrees,stateNavigationLayer(state));if(!r.eligible)issues.push(...r.issues);else if(!finite(state.position.y)||Math.abs(state.position.y-r.position.y)>1e-8)issues.push('CAMERA_NOT_ATTACHED_TO_LOCAL_SUPPORT');if(!state.selectedSemanticAddressId)issues.push('SEMANTIC_SELECTION_MISSING');if(state.terrainSupported!==true)issues.push('TERRAIN_SUPPORT_FLAG_MISSING');}return freeze({eligible:issues.length===0,status:issues.length?'NAVIGATION_STATE_FAIL':'NAVIGATION_STATE_PASS',issues});}
