/**
 * H_EARTH_VISIBLE_TERRAIN_CLEARANCE_SURFACE_GEN312_v1
 *
 * Samples the exact terrain mesh presented by the protected Gen311 landscape
 * preview. This module creates no geography, topology, renderer, navigation,
 * collision, merge, deployment, or production authority.
 */
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW
} from '../render/landscape-preview.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

export const H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID='H_EARTH_VISIBLE_TERRAIN_CLEARANCE_SURFACE_GEN312_v1';
export const H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR='e03363f42441cea7587a49623fd878e8ca51fe28';

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
  if(!(span>0))return null;
  return {index:lo,t:clamp((value-values[lo])/span,0,1)};
}

function interpolateCell(vertices,cols,row,col,u,v){
  const a=vertices[row*cols+col];
  const b=vertices[row*cols+col+1];
  const e=vertices[(row+1)*cols+col];
  const d=vertices[(row+1)*cols+col+1];
  if(![a,b,e,d].every(p=>p&&finite(p.y)))return null;
  if(u+v<=1){
    return a.y*(1-u-v)+b.y*u+e.y*v;
  }
  return d.y*(u+v-1)+b.y*(1-v)+e.y*(1-u);
}

export function sampleHEarthVisibleTerrainClearanceSurface(worldX,worldZ){
  const primitive=terrainPrimitive();
  if(!primitive)return freeze({valid:false,status:'VISIBLE_TERRAIN_SURFACE_UNAVAILABLE',issues:['PROTECTED_GEN311_VISIBLE_TERRAIN_MESH_INVALID']});
  const geometry=primitive.geometry,vertices=geometry?.vertices??[];
  const attrs=geometry?.attributes??{};
  const xValues=attrs.xValues??[],zValues=attrs.zValues??[];
  const x=locateAxisCell(xValues,worldX),z=locateAxisCell(zValues,worldZ);
  if(!x||!z)return freeze({valid:false,status:'VISIBLE_TERRAIN_SAMPLE_OUTSIDE_PRESENTED_DOMAIN',worldX,worldZ,issues:['VISIBLE_TERRAIN_FOOTPRINT_OUTSIDE_MESH']});
  const visibleElevation=interpolateCell(vertices,xValues.length,z.index,x.index,x.t,z.t);
  if(!finite(visibleElevation))return freeze({valid:false,status:'VISIBLE_TERRAIN_INTERPOLATION_FAILED',worldX,worldZ,issues:['VISIBLE_TERRAIN_CELL_INVALID']});
  return freeze({
    valid:true,
    status:'VISIBLE_TERRAIN_SAMPLE_COMPLETE',
    contractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
    protectedGeographicFloor:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_PROTECTED_FLOOR,
    worldX,worldZ,visibleElevation,
    sourcePrimitiveId:primitive.primitiveId,
    sourceGeometryId:geometry.geometryId,
    sourceReliefContractId:primitive.metadata.gen311RegionalReliefContractId,
    cell:freeze({column:x.index,row:z.index,u:x.t,v:z.t}),
    presentedMeshSampled:true,
    canonicalWorldFieldMutated:false,
    geographyAuthorityCreated:false,
    topologyAuthorityCreated:false,
    navigationScaleAuthorityCreated:false,
    issues:[]
  });
}

export function sampleHEarthVisibleTerrainClearanceEnvelope(worldX,worldZ,{yawDegrees=0,lookAheadDistance=6,lateralRadius=1.25}={}){
  const yaw=(finite(yawDegrees)?yawDegrees:0)*Math.PI/180;
  const forward={x:Math.sin(yaw),z:-Math.cos(yaw)};
  const right={x:Math.cos(yaw),z:Math.sin(yaw)};
  const points=[
    {role:'CENTER',x:worldX,z:worldZ},
    {role:'LOOK_AHEAD',x:worldX+forward.x*lookAheadDistance,z:worldZ+forward.z*lookAheadDistance},
    {role:'LEFT_FOOTPRINT',x:worldX-right.x*lateralRadius,z:worldZ-right.z*lateralRadius},
    {role:'RIGHT_FOOTPRINT',x:worldX+right.x*lateralRadius,z:worldZ+right.z*lateralRadius}
  ];
  const samples=points.map(p=>freeze({...p,sample:sampleHEarthVisibleTerrainClearanceSurface(p.x,p.z)}));
  const valid=samples.filter(x=>x.sample.valid===true);
  if(valid.length===0)return freeze({valid:false,status:'VISIBLE_TERRAIN_ENVELOPE_INVALID',samples,issues:['NO_VALID_VISIBLE_TERRAIN_CLEARANCE_SAMPLE']});
  const visibleElevation=Math.max(...valid.map(x=>x.sample.visibleElevation));
  return freeze({
    valid:true,
    status:'VISIBLE_TERRAIN_ENVELOPE_COMPLETE',
    contractId:H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID,
    visibleElevation,
    centerElevation:valid.find(x=>x.role==='CENTER')?.sample.visibleElevation??visibleElevation,
    sampleCount:valid.length,
    samples,
    conservativeMaximumUsed:true,
    geographyAuthorityCreated:false,
    topologyAuthorityCreated:false,
    navigationScaleAuthorityCreated:false,
    issues:[]
  });
}

export default H_EARTH_VISIBLE_TERRAIN_CLEARANCE_CONTRACT_ID;
