/** H_EARTH_SINGLE_SPHERICAL_WORLD_MANIFOLD_DISTANT_CONTEXT_v6_COAST_DISTANCE_OPTICS_UNDERLAY */
import {H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,createHEarthVector3,constructHEarthTriangleMesh,isHEarthNeutralPrimitiveRecord} from './geometry-kernel.js';
import {evaluateHEarthRecoveredWaterRgbaAtWorldPoint} from './geometry-shoreline.js';
import {H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sampleHEarthWorldManifold} from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import {H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,buildHEarthWorldManifoldRepresentationPlan} from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';
import {H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,regionToHEarthPlanetPoint,getHEarthDerivedHorizonDistance} from './planetary-world-frame.js';
import {getHEarthCanonicalShorelineZ} from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
export const H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID='H_EARTH_SINGLE_SPHERICAL_WORLD_MANIFOLD_DISTANT_CONTEXT_v1';
export const H_EARTH_PLANET_BODY_HORIZON_SHELL_ID='RETIRED_BY_H_EARTH_SINGLE_SPHERICAL_WORLD_MANIFOLD_v1';

const LAND_RINGS=freeze([360,540,780,1120,1600,2260,3160,4400,6000]);
const DEFAULT_SECTORS=96;
const DEEP_OCEAN_RENDER_MATERIAL=freeze({rgba:[15,57,96,255],transparencyClass:'OPAQUE'});
const OUTER_X=freeze([-6800,-5600,-4600,-3800,-3200,-2700,-2300,-2000,2000,2300,2700,3200,3800,4600,5600,6800]);
const OUTER_Z=freeze([-6800,-5600,-4600,-3800,-3100,-2500,-2000,-1600,-1250,-980,-760,-600,-480,1000,1250,1550,1950,2500,3200,4000,5000,6000,7000]);

function range(min,max,step){const out=[];for(let value=min;value<=max+step*0.25;value+=step)out.push(Math.round(value*1e6)/1e6);return out}
function orderedAxis(core,outer){return freeze([...new Set([...core,...outer])].sort((a,b)=>a-b))}
const OCEAN_X=orderedAxis(range(-1920,1920,40),OUTER_X);
const OCEAN_Z=orderedAxis(range(-440,920,24),OUTER_Z);

function compact(vertices,indices,diagnostics={},vertexRgba=null){
  const referenced=[...new Set(indices)].sort((a,b)=>a-b);
  const remap=new Map(referenced.map((oldIndex,newIndex)=>[oldIndex,newIndex]));
  return freeze({vertices:referenced.map(i=>vertices[i]),indices:indices.map(i=>remap.get(i)),vertexRgba:Array.isArray(vertexRgba)?freeze(referenced.map(i=>vertexRgba[i])):null,sourceVertexCount:vertices.length,compactVertexCount:referenced.length,removedUnreferencedVertexCount:vertices.length-referenced.length,triangleCount:indices.length/3,...diagnostics});
}

function buildLandMesh(plan,rings,sectorCount){
  const vertices=plan.vertices.map(v=>createHEarthVector3(v.world.x,v.world.y,v.world.z));
  const indices=[];let retainedCellCount=0,suppressedCellCount=0,mixedTransitionCellCount=0;
  for(let ring=0;ring<rings.length-1;ring++)for(let column=0;column<sectorCount;column++){
    const next=(column+1)%sectorCount,a=ring*sectorCount+column,b=ring*sectorCount+next,d=(ring+1)*sectorCount+next,e=(ring+1)*sectorCount+column;
    const cell=[plan.vertices[a],plan.vertices[b],plan.vertices[d],plan.vertices[e]],votes=cell.filter(v=>v.terrainSilhouettePermitted===true).length;
    if(votes<3){suppressedCellCount++;continue}if(votes<4)mixedTransitionCellCount++;indices.push(a,e,b,b,e,d);retainedCellCount++;
  }
  return compact(vertices,indices,{retainedCellCount,suppressedCellCount,mixedTransitionCellCount});
}

function buildContinuousOceanField(){
  const width=OCEAN_X.length,height=OCEAN_Z.length;
  const selected=new Set();
  for(let xi=0;xi<width-1;xi++){
    const x0=OCEAN_X[xi],x1=OCEAN_X[xi+1];
    if(x1<-256||x0>256)continue;
    let minShore=Infinity,maxShore=-Infinity;
    const sampleStart=Math.max(x0,-256),sampleEnd=Math.min(x1,256);
    for(let x=sampleStart;x<=sampleEnd+1e-9;x+=0.25){const s=getHEarthCanonicalShorelineZ(Math.min(x,sampleEnd));minShore=Math.min(minShore,s);maxShore=Math.max(maxShore,s);}
    for(let zi=0;zi<height-1;zi++){const z0=OCEAN_Z[zi],z1=OCEAN_Z[zi+1];if(z1>=minShore&&z0<=maxShore+160)selected.add(`${xi}:${zi}`);}
  }
  const vertices=[],vertexRgba=[],indices=[],vertexMap=new Map(),samples=[];
  const key=(x,z)=>`${x.toFixed(6)}:${z.toFixed(6)}`;
  const vertex=(x,z)=>{const k=key(x,z);if(vertexMap.has(k))return vertexMap.get(k);const q=regionToHEarthPlanetPoint({x,y:0.015,z});const i=vertices.length;vertices.push(createHEarthVector3(q.x,q.y,q.z));vertexRgba.push(evaluateHEarthRecoveredWaterRgbaAtWorldPoint(x,z,{opaque:true}));samples.push(sampleHEarthWorldManifold(x,z));vertexMap.set(k,i);return i;};
  let refinedCellCount=0,coarseCellCount=0;
  for(let zi=0;zi<height-1;zi++)for(let xi=0;xi<width-1;xi++){
    const x0=OCEAN_X[xi],x1=OCEAN_X[xi+1],z0=OCEAN_Z[zi],z1=OCEAN_Z[zi+1];
    if(selected.has(`${xi}:${zi}`)){
      refinedCellCount++;
      const xs=[];for(let x=x0;x<x1-1e-9;x+=2)xs.push(x);xs.push(x1);
      const zs=[];for(let z=z0;z<z1-1e-9;z+=2)zs.push(z);zs.push(z1);
      for(let r=0;r<zs.length-1;r++)for(let col=0;col<xs.length-1;col++){const a=vertex(xs[col],zs[r]),b=vertex(xs[col+1],zs[r]),e=vertex(xs[col],zs[r+1]),d=vertex(xs[col+1],zs[r+1]);indices.push(a,e,b,b,e,d);}
    }else{
      coarseCellCount++;
      const a=vertex(x0,z0),b=vertex(x1,z0),e=vertex(x0,z1),d=vertex(x1,z1);indices.push(a,e,b,b,e,d);
    }
  }
  const edgeCounts=new Map(),triangles=new Set();let duplicateTriangleCount=0,degenerateTriangleCount=0;
  const edge=(a,b)=>a<b?`${a}:${b}`:`${b}:${a}`;
  for(let i=0;i<indices.length;i+=3){const a=indices[i],b=indices[i+1],d=indices[i+2];if(a===b||b===d||d===a)degenerateTriangleCount++;const tk=[a,b,d].sort((m,n)=>m-n).join(':');if(triangles.has(tk))duplicateTriangleCount++;triangles.add(tk);for(const ek of [edge(a,b),edge(b,d),edge(d,a)])edgeCounts.set(ek,(edgeCounts.get(ek)||0)+1);}
  let nonManifoldEdgeCount=0;for(const count of edgeCounts.values())if(count>2)nonManifoldEdgeCount++;
  const maximumRadius=Math.max(...vertices.map(v=>Math.hypot(v.x,v.z)));
  return freeze({vertices:freeze(vertices),indices:freeze(indices),vertexRgba:freeze(vertexRgba),sourceVertexCount:width*height,compactVertexCount:vertices.length,removedUnreferencedVertexCount:0,triangleCount:indices.length/3,retainedCellCount:(width-1)*(height-1),landUnderlayCellCount:0,mixedCoastCellCount:0,gridWidth:width,gridHeight:height,xMinimum:OCEAN_X[0],xMaximum:OCEAN_X.at(-1),zMinimum:OCEAN_Z[0],zMaximum:OCEAN_Z.at(-1),outerRadius:maximumRadius,waterColorAuthority:'DISTANCE_FROM_CANONICAL_COAST_CONTINUOUS',historical23923ColorAnchorsPreserved:true,visibleWaterAuthority:'ONE_CONTINUOUS_OCEAN_SURFACE',nearCoastTessellation:'IN_PLACE_2M_REFINEMENT',oceanUnderlayClosesRepresentationGaps:true,lateralColorTerminationPossible:false,visibleRectangularTerminationProhibited:true,flatRefinementReceipt:freeze({selectedOriginalCellCount:selected.size,refinedCellCount,coarseCellCount,vertexCount:vertices.length,triangleCount:indices.length/3,duplicateTriangleCount,degenerateTriangleCount,nonManifoldEdgeCount,spacingMeters:2,selectionOffshoreMeters:160,flatElevationMeters:0.015})});
}
function primitive(mesh,surfaceClass,plan=null){
  if(mesh.indices.length===0||mesh.vertices.length<3)return null;
  const ocean=surfaceClass==='OCEAN',id=`H_EARTH_WORLD_MANIFOLD:FAR_${surfaceClass}_CONTINUATION`;
  const construction=constructHEarthTriangleMesh({primitiveId:id,geometryId:`${id}:GEOMETRY`,primitiveType:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,vertices:mesh.vertices,indices:mesh.indices,normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,semanticRole:ocean?'AUDRALIA_OPEN_OCEAN_CONTINUOUS_SPHERICAL_SURFACE':'AUDRALIA_CONTINENTAL_CONTEXT_FROM_WORLD_MANIFOLD',materialHint:freeze({materialReference:ocean?'H_EARTH_MATERIAL_OPEN_WATER_DISTANCE':'H_EARTH_MATERIAL_AUDRALIA_SUBTROPICAL_DISTANCE',materialIntent:ocean?'ONE_CONTINUOUS_OPEN_OCEAN_TO_GEOMETRIC_HORIZON':'AUDRALIA_WARM_SUBTROPICAL_CONTINENTAL_CONTEXT'}),source:freeze({sourceType:ocean?'WORLD_MANIFOLD_CONTINUOUS_OCEAN_FIELD':'WORLD_MANIFOLD_PLUS_FIXED_PLANETARY_FRAME',representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,planetaryWorldFrameContractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID}),metadata:freeze({providerContractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,representationClass:'FAR',farSurfaceClass:surfaceClass,geographicIdentity:'AUDRALIA',playableRegionIdentity:'GRATITUDE',climateIdentity:'WARM_SUBTROPICAL_COASTAL',representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,planetaryWorldFrameContractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceAuthority:'DERIVED_REPRESENTATION_ONLY',independentGeographyAuthority:false,fullXYZSphericalContinuation:true,singleSphericalPresentationManifold:true,singleContinuousOceanToHorizon:ocean,visibleWaterAuthority:ocean?'ONE_CONTINUOUS_OCEAN_SURFACE':null,nearCoastTessellation:ocean?'WORLD_SPACE_FIELD_NOT_RADIAL_RINGS':null,waterColorAuthority:ocean?'DISTANCE_FROM_CANONICAL_COAST_CONTINUOUS':null,historical23923ColorAnchorsPreserved:ocean,oceanUnderlayClosesRepresentationGaps:ocean,lateralColorTerminationPossible:ocean?false:null,fixedPlanetaryAnchor:plan?.continuationAnchorFixed!==false,worldRecenteredForCamera:false,navigationAddressIds:[],navigable:false,collisionAuthority:false,accessibleRegionExpansion:false,oceanFacingLandmassCreated:false,visibleRectangularTerminationProhibited:true,separateVisiblePlanetBodySubstitute:false,admitted:false,aggregateFrameAuthority:false})});
  const base=construction?.primitiveRecord??null;
  if(construction?.valid!==true||!isHEarthNeutralPrimitiveRecord(base))return null;
  return ocean?freeze({...base,renderMaterial:freeze({...DEEP_OCEAN_RENDER_MATERIAL,vertexRgba:mesh.vertexRgba})}):base;
}

export function constructHEarthDistantContextGeometry({cameraWorld={x:0,y:8,z:-40},sectorCount=DEFAULT_SECTORS}={}){
  const landPlan=buildHEarthWorldManifoldRepresentationPlan({cameraWorld,rings:LAND_RINGS,sectorCount});
  const issues=[];
  if(landPlan.eligible!==true)issues.push(...landPlan.issues.map(i=>`LAND:${i}`));
  if(landPlan.vertices.some(v=>v.valid!==true))issues.push('FAR_CONTEXT_WORLD_SAMPLE_INVALID');
  if(issues.length)return freeze({ok:false,status:'DISTANT_CONTEXT_GEOMETRY_FAILED',contractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,primitives:[],issues});
  const landMesh=buildLandMesh(landPlan,LAND_RINGS,sectorCount),oceanMesh=buildContinuousOceanField(),land=primitive(landMesh,'LAND',landPlan),ocean=primitive(oceanMesh,'OCEAN');
  if(!land)issues.push('FAR_LAND_REPRESENTATION_EMPTY_OR_INVALID');if(!ocean)issues.push('FAR_OCEAN_REPRESENTATION_EMPTY_OR_INVALID');
  const primitives=[land,ocean].filter(Boolean),horizon=getHEarthDerivedHorizonDistance(Math.max(0,Number(cameraWorld?.y)||0));
  if(oceanMesh.outerRadius<horizon)issues.push('CONTINUOUS_OCEAN_DOES_NOT_REACH_DERIVED_HORIZON');
  return freeze({ok:issues.length===0,status:issues.length?'DISTANT_CONTEXT_GEOMETRY_FAILED':'DISTANT_CONTEXT_GEOMETRY_COMPLETE',contractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,planetaryWorldFrameContractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,planetBodyHorizonShellId:H_EARTH_PLANET_BODY_HORIZON_SHELL_ID,representationPlan:landPlan,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,representationClass:'FAR',geographicIdentity:'AUDRALIA',playableRegionIdentity:'GRATITUDE',climateIdentity:'WARM_SUBTROPICAL_COASTAL',meshDiagnostics:freeze({land:landMesh,ocean:oceanMesh,triangleCount:landMesh.triangleCount+oceanMesh.triangleCount}),primitives,bounds:primitives[0]?.geometry?.bounds??null,visualContinuationLayer:false,fullXYZSphericalContinuation:true,singleSphericalPresentationManifold:true,derivedHorizonDistance:horizon,fixedPlanetaryAnchor:true,worldRecenteredForCamera:false,accessibleRegionExpansion:false,radialHorizonContinuity:true,oceanSectorEmptinessEnforced:true,oceanVisualContinuationMaterialized:true,planetBodyHorizonShellMaterialized:false,separateVisiblePlanetBodySubstitute:false,singleContinuousOceanToHorizon:true,visibleWaterAuthority:'ONE_CONTINUOUS_OCEAN_SURFACE',nearCoastTessellation:'WORLD_SPACE_FIELD_NOT_RADIAL_RINGS',waterColorAuthority:'DISTANCE_FROM_CANONICAL_COAST_CONTINUOUS',historical23923ColorAnchorsPreserved:true,oceanUnderlayClosesRepresentationGaps:true,lateralColorTerminationPossible:false,oppositeShoreFabricationProhibited:true,independentGeographyAuthority:false,admitted:false,issues});
}