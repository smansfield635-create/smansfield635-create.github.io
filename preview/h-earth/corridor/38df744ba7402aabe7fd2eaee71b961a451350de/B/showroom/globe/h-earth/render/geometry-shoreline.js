/** H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_23923_OPTICAL_RECOVERY_v4 */
import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord,
  mergeHEarthGeometryBounds
} from './geometry-kernel.js';
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
  sampleHEarthWorldManifold
} from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import { getHEarthCanonicalShorelineZ } from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
// Authored X/Z units are meters. The coast itself is the immutable zero contour.
// Sample its canonical curve once; each query finds the closest point on that
// polyline. A 1 m chord limits curvature approximation without per-frame work.
const COAST_MIN_X=-7200,COAST_MAX_X=7200,COAST_STEP_METERS=1;
const coastSamples=Array.from({length:COAST_MAX_X-COAST_MIN_X+1},(_,i)=>getHEarthCanonicalShorelineZ(COAST_MIN_X+i));
export function getHEarthSignedCoastDistanceMeters(worldX,worldZ){
  if(!Number.isFinite(worldX)||!Number.isFinite(worldZ))return Number.NaN;
  const localCoast=getHEarthCanonicalShorelineZ(worldX);
  const delta=worldZ-localCoast;
  // Beyond this distance every coastal color/material transition is saturated.
  // The canonical coast varies by far less than 260 m across this domain.
  if(Math.abs(delta)>620)return delta>0?-620:620;
  const reach=Math.abs(delta)+COAST_STEP_METERS;
  const first=Math.max(0,Math.floor(worldX-reach-COAST_MIN_X));
  const last=Math.min(coastSamples.length-2,Math.ceil(worldX+reach-COAST_MIN_X));
  let best=delta*delta;
  for(let i=first;i<=last;i++){
    const ax=COAST_MIN_X+i,az=coastSamples[i],vx=COAST_STEP_METERS,vz=coastSamples[i+1]-az;
    const t=Math.min(1,Math.max(0,((worldX-ax)*vx+(worldZ-az)*vz)/(vx*vx+vz*vz)));
    const dx=worldX-ax-t*vx,dz=worldZ-az-t*vz;
    best=Math.min(best,dx*dx+dz*dz);
  }
  return delta>0?-Math.sqrt(best):Math.sqrt(best);
}
const SCALE=2**24;
const canonical=v=>{const x=Math.round(v*SCALE)/SCALE;return Object.is(x,-0)?0:x};
const clamp01=v=>Math.min(1,Math.max(0,v));
const smoothstep=(a,b,x)=>{const t=clamp01((x-a)/(b-a));return t*t*(3-2*t)};
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));

export const H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID='H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_COASTAL_CONTINUITY_v2';

export const H_EARTH_FUNCTIONAL_SHORELINE_BANDS=freeze([
  {bandId:'DRY_SAND_EDGE',innerOffset:34,outerOffset:14,materialReference:'H_EARTH_MATERIAL_DRY_SAND',materialIntent:'DRY_SAND'},
  {bandId:'DAMP_TRANSITION',innerOffset:14,outerOffset:4,materialReference:'H_EARTH_MATERIAL_WET_SAND',materialIntent:'DAMP_SAND_TRANSITION'},
  {bandId:'WET_SAND',innerOffset:4,outerOffset:0,materialReference:'H_EARTH_MATERIAL_WET_SAND',materialIntent:'WET_SAND'},
  {bandId:'FOAM_CONTACT',innerOffset:0,outerOffset:-3.2,materialReference:'H_EARTH_MATERIAL_FOAM',materialIntent:'FOAM_CONTACT'},
  {bandId:'SHALLOW_WATER',innerOffset:-3.2,outerOffset:-22,materialReference:'H_EARTH_MATERIAL_NEARSHORE_WATER',materialIntent:'SHALLOW_WATER'},
  {bandId:'NEARSHORE_WATER',innerOffset:-22,outerOffset:-58,materialReference:'H_EARTH_MATERIAL_NEARSHORE_WATER',materialIntent:'NEARSHORE_WATER'},
  {bandId:'OPEN_WATER',innerOffset:-58,outerOffset:-320,materialReference:'H_EARTH_MATERIAL_OPEN_WATER',materialIntent:'OPEN_WATER_NEAR_MID_REPRESENTATION'}
]);

export const H_EARTH_RECOVERED_WATER_OPTICAL_ANCHORS=freeze({
  shallow:[58,168,181,255],
  shelf:[31,116,154,255],
  deep:[15,57,96,255]
});
const INVISIBLE_WATER=freeze({rgba:[0,0,0,0],transparencyClass:'TRANSLUCENT'});
const SAND_RENDER_MATERIALS=freeze({
  DRY_SAND_EDGE:{rgba:[200,183,145,255],transparencyClass:'OPAQUE'},
  DAMP_TRANSITION:{rgba:[187,169,133,255],transparencyClass:'OPAQUE'},
  WET_SAND:{rgba:[174,155,121,255],transparencyClass:'OPAQUE'}
});

export function evaluateHEarthRecoveredWaterRgbaFromCoastDistance(distance,{opaque=true}={}){
  const d=Math.max(0,Number.isFinite(distance)?distance:0);
  const shallowToShelf=smoothstep(6,86,d);
  const shelfToDeep=smoothstep(54,360,d);
  const first=mix(H_EARTH_RECOVERED_WATER_OPTICAL_ANCHORS.shallow,H_EARTH_RECOVERED_WATER_OPTICAL_ANCHORS.shelf,shallowToShelf);
  const rgba=mix(first,H_EARTH_RECOVERED_WATER_OPTICAL_ANCHORS.deep,shelfToDeep);
  return freeze(opaque?[rgba[0],rgba[1],rgba[2],255]:[rgba[0],rgba[1],rgba[2],236]);
}

export function evaluateHEarthRecoveredWaterRgbaAtWorldPoint(x,z,{opaque=true}={}){
  const shorelineZ=getHEarthCanonicalShorelineZ(x);
  const waterwardDistance=Number.isFinite(shorelineZ)&&Number.isFinite(z)?-getHEarthSignedCoastDistanceMeters(x,z):0;
  return evaluateHEarthRecoveredWaterRgbaFromCoastDistance(waterwardDistance,{opaque});
}

/* Kept as compatibility-only diagnostic. Visible ocean color no longer uses
 * seabed elevation because the recovered 23923 optics were coast-distance based. */
export function evaluateHEarthRecoveredWaterRgbaFromElevation(elevation,{opaque=false}={}){
  const depth=Math.max(0,-(Number.isFinite(elevation)?elevation:0));
  return evaluateHEarthRecoveredWaterRgbaFromCoastDistance(depth*72,{opaque});
}

const sampleCount=257,shorelineXMinimum=-1024,shorelineXMaximum=1024;
const xAt=i=>shorelineXMinimum+(i/(sampleCount-1))*(shorelineXMaximum-shorelineXMinimum);
function metricBoundaryZ(x,offset){
  const shore=getHEarthCanonicalShorelineZ(x);
  if(offset===0||Math.abs(offset)>58)return shore-offset; // invisible open-water ribbon
  const direction=offset>0?-1:1,target=Math.abs(offset);
  let previous=shore;
  // Choose the first metric crossing on this X ray. This retains ribbon order
  // when a distant bay segment creates multiple closest-point candidates.
  for(let step=1;step<=Math.ceil(target*4+200);step++){
    const next=shore+direction*step*.5;
    if(Math.abs(getHEarthSignedCoastDistanceMeters(x,next))>=target){
      let a=previous,b=next;
      for(let k=0;k<18;k++){
        const mid=(a+b)*.5;
        if(Math.abs(getHEarthSignedCoastDistanceMeters(x,mid))>=target)b=mid;else a=mid;
      }
      return (a+b)*.5;
    }
    previous=next;
  }
  throw new Error('METRIC_SHORELINE_BOUNDARY_UNREACHABLE');
}
function pointAtOffset(x,offset){
  const z=metricBoundaryZ(x,offset);
  const sample=sampleHEarthWorldManifold(x,z);
  const waterward=offset<=0;
  return {x,y:waterward?0.02:sample.elevation,z,sample};
}
function constructBand(band){
  const vertices=[],indices=[],sourceSampleIds=[];
  const isWater=band.bandId==='SHALLOW_WATER'||band.bandId==='NEARSHORE_WATER'||band.bandId==='OPEN_WATER';
  for(let i=0;i<sampleCount;i++){
    const x=xAt(i),a=pointAtOffset(x,band.innerOffset),b=pointAtOffset(x,band.outerOffset);
    vertices.push(createHEarthVector3(canonical(a.x),canonical(a.y),canonical(a.z)),createHEarthVector3(canonical(b.x),canonical(b.y),canonical(b.z)));
    sourceSampleIds.push(`H_EARTH_WORLD_MANIFOLD_SHORELINE_SAMPLE_${String(i).padStart(3,'0')}`);
  }
  for(let i=0;i<sampleCount-1;i++){const a=i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,b,c,d);}
  const primitiveId=`H_EARTH_FUNCTIONAL_SHORELINE:${band.bandId}`;
  const construction=constructHEarthTriangleMesh({
    primitiveId,geometryId:`${primitiveId}:GEOMETRY`,primitiveType:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,indices,normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole:`WORLD_MANIFOLD_COASTAL_CONTACT_${band.bandId}`,
    materialHint:freeze({materialReference:band.materialReference,materialIntent:band.materialIntent}),
    source:freeze({sourceType:'G_WORLD_COASTAL_CLASSIFICATION',worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID}),
    metadata:freeze({providerContractId:H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,bandId:band.bandId,representationClass:band.bandId==='OPEN_WATER'?'MID':'NEAR',worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceSampleIds,sampleCount,shorelineXMinimum,shorelineXMaximum,waterPresentationDelegatedToContinuousOcean:isWater,finiteWaterRibbonVisible:false,historical23923ColorAnchorsPreserved:true,independentGeographyAuthority:false,hardWorldTerminalAuthority:false,navigationAddressIds:[],navigable:false,collisionAuthority:false,accessibleRegionExpansion:false,oceanFacingLandmassCreated:false,admitted:false,aggregateFrameAuthority:false})
  });
  const basePrimitive=construction?.primitiveRecord??null;
  const visibleSand=SAND_RENDER_MATERIALS[band.bandId]??null;
  const primitive=basePrimitive&&(isWater||visibleSand)?freeze({...basePrimitive,renderMaterial:isWater?INVISIBLE_WATER:visibleSand}):basePrimitive;
  return freeze({ok:construction?.valid===true&&isHEarthNeutralPrimitiveRecord(basePrimitive),bandId:band.bandId,primitive,issues:construction?.issues??[]});
}

export function constructHEarthFunctionalShorelineGeometry(){
  const results=H_EARTH_FUNCTIONAL_SHORELINE_BANDS.map(constructBand);
  const issues=results.filter(r=>!r.ok).map(r=>`SHORELINE_BAND_INVALID:${r.bandId}`);
  const primitives=results.filter(r=>r.ok).map(r=>r.primitive);
  const bounds=primitives.length?mergeHEarthGeometryBounds(primitives.map(p=>p.geometry.bounds)):null;
  return freeze({ok:issues.length===0&&primitives.length===7,status:issues.length?'FUNCTIONAL_SHORELINE_GEOMETRY_FAILED':'FUNCTIONAL_SHORELINE_GEOMETRY_COMPLETE',contractId:H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceBoundaryId:'H_EARTH_G_WORLD_CANONICAL_COAST',sourceBoundaryContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,bandCount:primitives.length,results,primitives,bounds,waterPresentationAuthority:'CONTINUOUS_OCEAN_ONLY',waterOpticalCoordinate:'DISTANCE_FROM_CANONICAL_COAST',historical23923ColorAnchorsPreserved:true,finiteWaterRibbonVisible:false,visualOceanContinuation:true,accessibleRegionExpansion:false,independentGeographyAuthority:false,admitted:false,issues});
}
