/** H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_GEN306_v1 */
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
const SCALE=2**24;
const canonical=v=>{const x=Math.round(v*SCALE)/SCALE;return Object.is(x,-0)?0:x};

export const H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID='H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_GEN306_G_WORLD_v1';
export const H_EARTH_FUNCTIONAL_SHORELINE_BANDS=freeze([
  {bandId:'DRY_SAND_EDGE',innerOffset:34,outerOffset:14,materialReference:'H_EARTH_MATERIAL_DRY_SAND',materialIntent:'DRY_SAND'},
  {bandId:'DAMP_TRANSITION',innerOffset:14,outerOffset:4,materialReference:'H_EARTH_MATERIAL_WET_SAND',materialIntent:'DAMP_SAND_TRANSITION'},
  {bandId:'WET_SAND',innerOffset:4,outerOffset:0,materialReference:'H_EARTH_MATERIAL_WET_SAND',materialIntent:'WET_SAND'},
  {bandId:'FOAM_CONTACT',innerOffset:0,outerOffset:-3.2,materialReference:'H_EARTH_MATERIAL_FOAM',materialIntent:'FOAM_CONTACT'},
  {bandId:'SHALLOW_WATER',innerOffset:-3.2,outerOffset:-22,materialReference:'H_EARTH_MATERIAL_NEARSHORE_WATER',materialIntent:'SHALLOW_WATER'},
  {bandId:'NEARSHORE_WATER',innerOffset:-22,outerOffset:-58,materialReference:'H_EARTH_MATERIAL_NEARSHORE_WATER',materialIntent:'NEARSHORE_WATER'},
  {bandId:'OPEN_WATER',innerOffset:-58,outerOffset:-320,materialReference:'H_EARTH_MATERIAL_OPEN_WATER',materialIntent:'OPEN_WATER_NEAR_MID_REPRESENTATION'}
]);

const WATER_RENDER_MATERIALS=freeze({
  SHALLOW_WATER:freeze({rgba:[58,168,181,218],transparencyClass:'TRANSLUCENT'}),
  NEARSHORE_WATER:freeze({rgba:[31,116,154,224],transparencyClass:'TRANSLUCENT'}),
  OPEN_WATER:freeze({rgba:[15,57,96,236],transparencyClass:'TRANSLUCENT'})
});

const sampleCount=257,shorelineXMinimum=-1024,shorelineXMaximum=1024;
const xAt=i=>shorelineXMinimum+(i/(sampleCount-1))*(shorelineXMaximum-shorelineXMinimum);
function pointAtOffset(x,offset){
  const shorelineZ=getHEarthCanonicalShorelineZ(x);
  const z=shorelineZ-offset;
  const sample=sampleHEarthWorldManifold(x,z);
  const waterward=offset<=0;
  return {x,y:waterward?0.02:sample.elevation,z,sample};
}
function constructBand(band){
  const vertices=[],indices=[],sourceSampleIds=[];
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
    metadata:freeze({providerContractId:H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,bandId:band.bandId,representationClass:band.bandId==='OPEN_WATER'?'MID':'NEAR',worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceSampleIds,sampleCount,shorelineXMinimum,shorelineXMaximum,independentGeographyAuthority:false,hardWorldTerminalAuthority:false,navigationAddressIds:[],navigable:false,collisionAuthority:false,accessibleRegionExpansion:false,oceanFacingLandmassCreated:false,admitted:false,aggregateFrameAuthority:false})
  });
  const basePrimitive=construction?.primitiveRecord??null;
  const waterMaterial=WATER_RENDER_MATERIALS[band.bandId]??null;
  const primitive=basePrimitive&&waterMaterial?freeze({...basePrimitive,renderMaterial:waterMaterial}):basePrimitive;
  return freeze({ok:construction?.valid===true&&isHEarthNeutralPrimitiveRecord(basePrimitive),bandId:band.bandId,primitive,issues:construction?.issues??[]});
}

export function constructHEarthFunctionalShorelineGeometry(){
  const results=H_EARTH_FUNCTIONAL_SHORELINE_BANDS.map(constructBand);
  const issues=results.filter(r=>!r.ok).map(r=>`SHORELINE_BAND_INVALID:${r.bandId}`);
  const primitives=results.filter(r=>r.ok).map(r=>r.primitive);
  const bounds=primitives.length?mergeHEarthGeometryBounds(primitives.map(p=>p.geometry.bounds)):null;
  return freeze({ok:issues.length===0&&primitives.length===7,status:issues.length?'FUNCTIONAL_SHORELINE_GEOMETRY_FAILED':'FUNCTIONAL_SHORELINE_GEOMETRY_COMPLETE',contractId:H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceBoundaryId:'H_EARTH_G_WORLD_CANONICAL_COAST',sourceBoundaryContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,bandCount:primitives.length,results,primitives,bounds,visualOceanContinuation:true,accessibleRegionExpansion:false,independentGeographyAuthority:false,admitted:false,issues});
}
