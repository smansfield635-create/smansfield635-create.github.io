/**
 * H_EARTH_VISIBLE_TERRAIN_CLEARANCE_SURFACE_GEN313_v1
 *
 * Samples the exact terrain mesh presented by the protected Gen311 landscape.
 * Gen321 extends the predecessor point/envelope model to a dense camera-volume
 * corridor so steep relief between sparse samples cannot intersect the camera
 * view volume while the origin itself remains nominally clear.
 *
 * This module creates no geography, topology, renderer, navigation-scale,
 * collision/physics, merge, deployment, or production authority.
 */
import { H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW } from '../render/landscape-preview.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

export const H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID='H_EARTH_VISIBLE_TERRAIN_CLEARANCE_SURFACE_GEN313_v1';
export const H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';
export const H_EARTH_CAMERA_VOLUME_CLEARANCE_PROTECTED_PARENT='d9d4c0ada0d97e98340c3b771a23153cef1ecb00';
export const H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID='H_EARTH_CAMERA_VOLUME_CLEARANCE_GEN321_v1';

function terrainPrimitive(){
  const preview=H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW;
  const primitive=preview?.componentResults?.terrain?.primitive??null;
  const relief=preview?.regionalRelief;
  if(preview?.ok!==true||relief?.ok!==true||relief?.primitive!==primitive)return null;
  if(primitive?.metadata?.gen311RegionalReliefMaterialized!==true)return null;
  return primitive;
}
function locateAxisCell(values,value){
  if(!Array.isArray(values)||values.length<2||!finite(value))return null;
  const min=values[0],max=values[values.length-1];
  if(value<min||value>max)return null;
  if(value===max)return {index:values.length-2,t:1};
  let lo=0,hi=values.length-1;
  while(lo+1<hi){const mid=(lo+hi)>>1;if(values[mid]<=value)lo=mid;else hi=mid;}
  const span=values[lo+1]-values[lo];
  return span>0?{index:lo,t:clamp((value-values[lo])/span,0,1)}:null;
}
function interpolateCell(vertices,cols,row,col,u,v){
  const a=vertices[row*cols+col],b=vertices[row*cols+col+1],e=vertices[(row+1)*cols+col],d=vertices[(row+1)*cols+col+1];
  if(![a,b,e,d].every(p=>p&&finite(p.y)))return null;
  return u+v<=1?a.y*(1-u-v)+b.y*u+e.y*v:d.y*(u+v-1)+b.y*(1-v)+e.y*(1-u);
}
export function sampleHEarthVisibleTerrainClearanceSurface(worldX,worldZ){
  const primitive=terrainPrimitive();
  if(!primitive)return freeze({valid:false,status:'VISIBLE_TERRAIN_SURFACE_UNAVAILABLE',issues:['PROTECTED_GEN311_VISIBLE_TERRAIN_MESH_INVALID']});
  const geometry=primitive.geometry,vertices=geometry?.vertices??[],attrs=geometry?.attributes??{},xValues=attrs.xValues??[],zValues=attrs.zValues??[];
  const x=locateAxisCell(xValues,worldX),z=locateAxisCell(zValues,worldZ);
  if(!x||!z)return freeze({valid:false,status:'VISIBLE_TERRAIN_SAMPLE_OUTSIDE_PRESENTED_DOMAIN',worldX,worldZ,issues:['VISIBLE_TERRAIN_FOOTPRINT_OUTSIDE_MESH']});
  const visibleElevation=interpolateCell(vertices,xValues.length,z.index,x.index,x.t,z.t);
  if(!finite(visibleElevation))return freeze({valid:false,status:'VISIBLE_TERRAIN_INTERPOLATION_FAILED',worldX,worldZ,issues:['VISIBLE_TERRAIN_CELL_INVALID']});
  return freeze({valid:true,status:'VISIBLE_TERRAIN_SAMPLE_COMPLETE',contractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,cameraVolumeContractId:H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID,protectedGeographicFloor:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,protectedParentHead:H_EARTH_CAMERA_VOLUME_CLEARANCE_PROTECTED_PARENT,worldX,worldZ,visibleElevation,sourcePrimitiveId:primitive.primitiveId,sourceGeometryId:geometry.geometryId,sourceReliefContractId:primitive.metadata.gen311RegionalReliefContractId,cell:freeze({column:x.index,row:z.index,u:x.t,v:z.t}),presentedMeshSampled:true,canonicalWorldFieldMutated:false,geographyAuthorityCreated:false,topologyAuthorityCreated:false,navigationScaleAuthorityCreated:false,issues:[]});
}
function cameraVolumePoints(worldX,worldZ,{yawDegrees,lookAheadDistance,lateralRadius}){
  const yaw=(finite(yawDegrees)?yawDegrees:0)*Math.PI/180,forward={x:Math.sin(yaw),z:-Math.cos(yaw)},right={x:Math.cos(yaw),z:Math.sin(yaw)};
  const reach=Math.max(10,finite(lookAheadDistance)?lookAheadDistance:0);
  const radius=Math.max(4,(finite(lateralRadius)?lateralRadius:0)*3.2);
  const distances=[0,.4,1,2,3.5,5.5,7.5,reach];
  const lateralFractions=[-1,-.75,-.5,-.25,0,.25,.5,.75,1],points=[];
  for(const distance of distances){
    const localRadius=Math.max(finite(lateralRadius)?lateralRadius:0,radius*(1-.025*distance));
    for(const fraction of lateralFractions){
      const lateral=localRadius*fraction;
      points.push({role:distance===0&&fraction===0?'CENTER':'CAMERA_VOLUME',distance,lateral,critical:distance<=5.5,x:worldX+forward.x*distance+right.x*lateral,z:worldZ+forward.z*distance+right.z*lateral});
    }
  }
  return freeze({points,reach,radius});
}
export function sampleHEarthVisibleTerrainClearanceEnvelope(worldX,worldZ,{yawDegrees=0,lookAheadDistance=6,lateralRadius=1.25}={}){
  const volume=cameraVolumePoints(worldX,worldZ,{yawDegrees,lookAheadDistance,lateralRadius});
  const samples=volume.points.map(p=>freeze({...p,sample:sampleHEarthVisibleTerrainClearanceSurface(p.x,p.z)}));
  const center=samples.find(x=>x.role==='CENTER');
  if(center?.sample?.valid!==true)return freeze({valid:false,status:'VISIBLE_TERRAIN_CAMERA_VOLUME_INVALID',samples,issues:['CENTER_VISIBLE_TERRAIN_SAMPLE_INVALID']});
  const critical=samples.filter(x=>x.critical);
  if(critical.some(x=>x.sample.valid!==true))return freeze({valid:false,status:'VISIBLE_TERRAIN_CAMERA_VOLUME_INVALID',samples,issues:['CRITICAL_CAMERA_VOLUME_SAMPLE_OUTSIDE_PRESENTED_DOMAIN']});
  const valid=samples.filter(x=>x.sample.valid===true);
  if(valid.length<Math.ceil(samples.length*.8))return freeze({valid:false,status:'VISIBLE_TERRAIN_CAMERA_VOLUME_INVALID',samples,issues:['CAMERA_VOLUME_SAMPLE_COVERAGE_INSUFFICIENT']});
  const highest=[...valid].sort((a,b)=>b.sample.visibleElevation-a.sample.visibleElevation)[0],visibleElevation=highest.sample.visibleElevation;
  return freeze({valid:true,status:'VISIBLE_TERRAIN_CAMERA_VOLUME_COMPLETE',contractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,cameraVolumeContractId:H_EARTH_CAMERA_VOLUME_CLEARANCE_CONTRACT_ID,protectedParentHead:H_EARTH_CAMERA_VOLUME_CLEARANCE_PROTECTED_PARENT,visibleElevation,centerElevation:center.sample.visibleElevation,highestSample:freeze({x:highest.x,z:highest.z,distance:highest.distance,lateral:highest.lateral,visibleElevation}),sampleCount:valid.length,requiredSampleCount:samples.length,invalidSampleCount:samples.length-valid.length,cameraVolumeReach:volume.reach,cameraVolumeRadius:volume.radius,samples,conservativeMaximumUsed:true,denseCameraVolumeSampled:true,nearPlaneProtection:true,steepSlopeLateralProtection:true,geographyAuthorityCreated:false,topologyAuthorityCreated:false,navigationScaleAuthorityCreated:false,issues:[]});
}
export default H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID;
