/** H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_COASTAL_CONTINUITY_v2 */
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
const clamp01=v=>Math.max(0,Math.min(1,v));
const smooth=t=>{const q=clamp01(t);return q*q*(3-2*q)};
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));

export const H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID='H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_COASTAL_CONTINUITY_v2';

/* Geometry segmentation remains an implementation detail. Water color is NOT
 * assigned by band identity; every water vertex resolves color from its signed
 * distance to the canonical coastline using one shared continuous law. */
export const H_EARTH_FUNCTIONAL_SHORELINE_BANDS=freeze([
  {bandId:'DRY_SAND_EDGE',innerOffset:54,outerOffset:22,materialReference:'H_EARTH_MATERIAL_DRY_SAND',materialIntent:'DRY_SAND'},
  {bandId:'DAMP_TRANSITION',innerOffset:22,outerOffset:7,materialReference:'H_EARTH_MATERIAL_WET_SAND',materialIntent:'DAMP_SAND_TRANSITION'},
  {bandId:'WET_SAND',innerOffset:7,outerOffset:0,materialReference:'H_EARTH_MATERIAL_WET_SAND',materialIntent:'WET_SAND'},
  {bandId:'FOAM_CONTACT',innerOffset:0,outerOffset:-1.25,materialReference:'H_EARTH_MATERIAL_FOAM',materialIntent:'FOAM_CONTACT'},
  {bandId:'SHALLOW_WATER',innerOffset:-1.25,outerOffset:-42,materialReference:'H_EARTH_MATERIAL_NEARSHORE_WATER',materialIntent:'SHALLOW_WATER'},
  {bandId:'NEARSHORE_WATER',innerOffset:-42,outerOffset:-132,materialReference:'H_EARTH_MATERIAL_NEARSHORE_WATER',materialIntent:'NEARSHORE_WATER'},
  {bandId:'OPEN_WATER',innerOffset:-132,outerOffset:-520,materialReference:'H_EARTH_MATERIAL_OPEN_WATER',materialIntent:'OPEN_WATER_NEAR_MID_REPRESENTATION'}
]);

const LAND_RENDER_MATERIALS=freeze({
  DRY_SAND_EDGE:freeze({rgba:[190,173,126,255],transparencyClass:'OPAQUE'}),
  DAMP_TRANSITION:freeze({rgba:[151,143,105,255],transparencyClass:'OPAQUE'}),
  WET_SAND:freeze({rgba:[120,126,101,255],transparencyClass:'OPAQUE'}),
  FOAM_CONTACT:freeze({rgba:[225,239,232,148],transparencyClass:'TRANSLUCENT'})
});

const WATER_COLOR_STOPS=freeze([
  freeze({d:0,rgba:[57,177,188,194]}),
  freeze({d:26,rgba:[48,160,177,199]}),
  freeze({d:68,rgba:[37,135,164,207]}),
  freeze({d:138,rgba:[29,111,148,217]}),
  freeze({d:245,rgba:[22,86,126,231]}),
  freeze({d:390,rgba:[17,68,108,245]}),
  freeze({d:520,rgba:[15,57,96,255]})
]);

function waterColorAtOffset(offset){
  const d=Math.max(0,-offset);
  for(let i=0;i<WATER_COLOR_STOPS.length-1;i++){
    const a=WATER_COLOR_STOPS[i],b=WATER_COLOR_STOPS[i+1];
    if(d<=b.d){const t=smooth((d-a.d)/Math.max(1e-9,b.d-a.d));return mix(a.rgba,b.rgba,t)}
  }
  return [...WATER_COLOR_STOPS.at(-1).rgba];
}

/* Broad/medium/local terms vary each shared coastal boundary without allowing
 * adjacent meshes to separate. The canonical shoreline itself remains exact. */
function organicBoundaryOffset(x,baseOffset){
  if(baseOffset===0)return 0;
  const magnitude=Math.abs(baseOffset);
  const phase=magnitude*0.0187;
  const broad=Math.sin(x/233+phase)*0.18;
  const medium=Math.sin(x/103-phase*0.71)*0.09;
  const local=Math.sin(x/47+phase*1.73)*0.035;
  const asymmetry=Math.sin((x+baseOffset*4.1)/337)*0.065;
  const factor=Math.max(0.68,Math.min(1.38,1+broad+medium+local+asymmetry));
  return baseOffset*factor;
}

/* The realization window follows the camera laterally and exceeds the complete
 * lawful visual horizon plus overlap. It is a moving representation of the
 * unbounded procedural coast, never a world terminal. */
const HORIZON_HALF_EXTENT=5120;
const SAMPLE_SPACING=10;
function shorelineWindow(cameraWorld){
  const center=Number.isFinite(cameraWorld?.x)?cameraWorld.x:0;
  const minimum=Math.floor((center-HORIZON_HALF_EXTENT)/SAMPLE_SPACING)*SAMPLE_SPACING;
  const maximum=Math.ceil((center+HORIZON_HALF_EXTENT)/SAMPLE_SPACING)*SAMPLE_SPACING;
  const sampleCount=Math.round((maximum-minimum)/SAMPLE_SPACING)+1;
  return freeze({center,minimum,maximum,sampleCount,spacing:SAMPLE_SPACING,halfExtent:HORIZON_HALF_EXTENT});
}

function pointAtOffset(x,baseOffset){
  const offset=organicBoundaryOffset(x,baseOffset);
  const shorelineZ=getHEarthCanonicalShorelineZ(x);
  const z=shorelineZ-offset;
  const sample=sampleHEarthWorldManifold(x,z);
  const waterward=offset<0;
  return {x,y:waterward?0.02:sample.elevation,z,sample,offset};
}

function constructBand(band,window){
  const vertices=[],indices=[],sourceSampleIds=[],vertexRgba=[];
  for(let i=0;i<window.sampleCount;i++){
    const x=window.minimum+i*window.spacing;
    const a=pointAtOffset(x,band.innerOffset),b=pointAtOffset(x,band.outerOffset);
    vertices.push(
      createHEarthVector3(canonical(a.x),canonical(a.y),canonical(a.z)),
      createHEarthVector3(canonical(b.x),canonical(b.y),canonical(b.z))
    );
    if(band.bandId.includes('WATER')){
      vertexRgba.push(waterColorAtOffset(a.offset),waterColorAtOffset(b.offset));
    }
    sourceSampleIds.push(`H_EARTH_WORLD_MANIFOLD_SHORELINE_SAMPLE_${String(i).padStart(4,'0')}`);
  }
  for(let i=0;i<window.sampleCount-1;i++){
    const a=i*2,b=a+1,c=a+2,d=a+3;
    indices.push(a,c,b,b,c,d);
  }
  const primitiveId=`H_EARTH_FUNCTIONAL_SHORELINE:${band.bandId}`;
  const construction=constructHEarthTriangleMesh({
    primitiveId,
    geometryId:`${primitiveId}:GEOMETRY`,
    primitiveType:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole:`WORLD_MANIFOLD_COASTAL_CONTACT_${band.bandId}`,
    materialHint:freeze({materialReference:band.materialReference,materialIntent:band.materialIntent}),
    source:freeze({sourceType:'G_WORLD_COASTAL_CLASSIFICATION',worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID}),
    metadata:freeze({
      providerContractId:H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
      bandId:band.bandId,
      representationClass:band.bandId==='OPEN_WATER'?'MID':'NEAR',
      worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
      topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
      sourceSampleIds,
      sampleCount:window.sampleCount,
      shorelineXMinimum:window.minimum,
      shorelineXMaximum:window.maximum,
      shorelineWindowCenterX:window.center,
      shorelineWindowHalfExtent:window.halfExtent,
      cameraRelativeRealization:true,
      continuousWaterColorAuthority:band.bandId.includes('WATER'),
      colorIndependentOfPrimitiveBoundary:band.bandId.includes('WATER'),
      organicBoundaryVariation:true,
      regionalEdgeTerminationVisible:false,
      visibleRectangularTerminationProhibited:true,
      independentGeographyAuthority:false,
      hardWorldTerminalAuthority:false,
      navigationAddressIds:[],navigable:false,collisionAuthority:false,
      accessibleRegionExpansion:false,oceanFacingLandmassCreated:false,
      admitted:false,aggregateFrameAuthority:false
    })
  });
  const basePrimitive=construction?.primitiveRecord??null;
  let primitive=basePrimitive;
  if(basePrimitive){
    const landMaterial=LAND_RENDER_MATERIALS[band.bandId]??null;
    if(vertexRgba.length===vertices.length){
      primitive=freeze({...basePrimitive,renderMaterial:freeze({
        rgba:vertexRgba[0],
        vertexRgba:freeze(vertexRgba.map(c=>freeze([...c]))),
        transparencyClass:'TRANSLUCENT',
        colorAuthority:'CANONICAL_SHORE_SIGNED_DISTANCE_CONTINUOUS_FUNCTION'
      })});
    }else if(landMaterial){
      primitive=freeze({...basePrimitive,renderMaterial:landMaterial});
    }
  }
  return freeze({ok:construction?.valid===true&&isHEarthNeutralPrimitiveRecord(basePrimitive),bandId:band.bandId,primitive,issues:construction?.issues??[]});
}

export function constructHEarthFunctionalShorelineGeometry({cameraWorld={x:0,y:8,z:-40}}={}){
  const window=shorelineWindow(cameraWorld);
  const results=H_EARTH_FUNCTIONAL_SHORELINE_BANDS.map(b=>constructBand(b,window));
  const issues=results.filter(r=>!r.ok).map(r=>`SHORELINE_BAND_INVALID:${r.bandId}`);
  const primitives=results.filter(r=>r.ok).map(r=>r.primitive);
  const bounds=primitives.length?mergeHEarthGeometryBounds(primitives.map(p=>p.geometry.bounds)):null;
  return freeze({
    ok:issues.length===0&&primitives.length===7,
    status:issues.length?'FUNCTIONAL_SHORELINE_GEOMETRY_FAILED':'FUNCTIONAL_SHORELINE_GEOMETRY_COMPLETE',
    contractId:H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
    worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
    topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    sourceBoundaryId:'H_EARTH_G_WORLD_CANONICAL_COAST',
    sourceBoundaryContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
    bandCount:primitives.length,
    results,primitives,bounds,
    shorelineWindow:window,
    continuousWaterColorAuthority:true,
    waterColorIndependentOfMeshSegmentation:true,
    visualOceanContinuation:true,
    organicBoundaryVariation:true,
    cameraRelativeRealization:true,
    regionalEdgeTerminationVisible:false,
    visibleRectangularTerminationProhibited:true,
    accessibleRegionExpansion:false,
    independentGeographyAuthority:false,
    admitted:false,
    issues
  });
}
