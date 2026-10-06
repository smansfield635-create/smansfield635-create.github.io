/** H_EARTH_SINGLE_SPHERICAL_WORLD_MANIFOLD_DISTANT_CONTEXT_v6_COAST_DISTANCE_OPTICS_UNDERLAY */
import {H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,createHEarthVector3,constructHEarthTriangleMesh,isHEarthNeutralPrimitiveRecord} from './geometry-kernel.js';
import {evaluateHEarthRecoveredWaterRgbaAtWorldPoint} from './geometry-shoreline.js';
import {H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sampleHEarthWorldManifold} from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import {H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,buildHEarthWorldManifoldRepresentationPlan} from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';
import {H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,regionToHEarthPlanetPoint,getHEarthDerivedHorizonDistance} from './planetary-world-frame.js';

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

/** Subtract the detailed footprint before projection, then weld its actual
 * projected boundary. This changes representation ownership, never G_world.
 * Crossing cells are clipped, not discarded; ocean construction is untouched. */
function buildLandMesh(plan,rings,sectorCount,nearTerrain=null){
  const vertices=plan.vertices.map(v=>createHEarthVector3(v.world.x,v.world.y,v.world.z));
  const indices=[];let retainedCellCount=0,suppressedCellCount=0,mixedTransitionCellCount=0;
  const axes=nearTerrain?.geometry?.attributes;
  const xs=axes?.xValues,zs=axes?.zValues,near=nearTerrain?.geometry?.vertices;
  const hasNear=Array.isArray(xs)&&Array.isArray(zs)&&Array.isArray(near)&&near.length===xs.length*zs.length;
  if(nearTerrain&&!hasNear)throw new Error('FAR_NEAR_SEAM_SOURCE_INVALID');
  const box=hasNear?{minX:xs[0],maxX:xs.at(-1),minZ:zs[0],maxZ:zs.at(-1)}:null;
  const epsilon=1e-7,seamKeys=new Set();let clippedTriangleCount=0,removedTriangleCount=0,seamVertexCount=0;
  const key=v=>[v.x,v.y,v.z].map(n=>n.toFixed(9)).join(':');
  const vertexMap=new Map(vertices.map((v,i)=>[key(v),i]));
  function add(v){const k=key(v);if(vertexMap.has(k))return vertexMap.get(k);const i=vertices.length;vertices.push(createHEarthVector3(v.x,v.y,v.z));vertexMap.set(k,i);return i;}
  function sideOf(p){if(!box)return null;if(p.z>=box.minZ-epsilon&&p.z<=box.maxZ+epsilon){if(Math.abs(p.x-box.minX)<epsilon)return'LEFT';if(Math.abs(p.x-box.maxX)<epsilon)return'RIGHT';}if(p.x>=box.minX-epsilon&&p.x<=box.maxX+epsilon){if(Math.abs(p.z-box.minZ)<epsilon)return'BOTTOM';if(Math.abs(p.z-box.maxZ)<epsilon)return'TOP';}return null;}
  function weld(p){const side=sideOf(p);if(!side)return p.world;const vertical=side==='LEFT'||side==='RIGHT',axis=vertical?zs:xs,t=vertical?p.z:p.x;let i=0;while(i<axis.length-2&&axis[i+1]<t-epsilon)i++;const f=Math.max(0,Math.min(1,(t-axis[i])/(axis[i+1]-axis[i]))),index=j=>vertical?j*xs.length+(side==='LEFT'?0:xs.length-1):(side==='BOTTOM'?0:zs.length-1)*xs.length+j,a=near[index(i)],b=near[index(i+1)];const v={x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,z:a.z+(b.z-a.z)*f};seamKeys.add(key(v));return v;}
  function interpolate(a,b,t){return{x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,world:{x:a.world.x+(b.world.x-a.world.x)*t,y:a.world.y+(b.world.y-a.world.y)*t,z:a.world.z+(b.world.z-a.world.z)*t}};}
  function clip(poly,coordinate,value,keepGreater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a[coordinate]-value)*(keepGreater?1:-1),db=(b[coordinate]-value)*(keepGreater?1:-1),ai=da>=-1e-10,bi=db>=-1e-10;if(ai)out.push(a);if(ai!==bi){const p=interpolate(a,b,da/(da-db));p[coordinate]=value;out.push(p);}}return out;}
  function expandBoundary(poly){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];out.push(a);let vertical=null;if(Math.abs(a.x-b.x)<epsilon&&(Math.abs(a.x-box.minX)<epsilon||Math.abs(a.x-box.maxX)<epsilon))vertical=true;else if(Math.abs(a.z-b.z)<epsilon&&(Math.abs(a.z-box.minZ)<epsilon||Math.abs(a.z-box.maxZ)<epsilon))vertical=false;if(vertical===null)continue;const axis=vertical?zs:xs,aa=vertical?a.z:a.x,bb=vertical?b.z:b.x,steps=axis.filter(t=>t>Math.min(aa,bb)+epsilon&&t<Math.max(aa,bb)-epsilon);if(bb<aa)steps.reverse();for(const t of steps)out.push(interpolate(a,b,(t-aa)/(bb-aa)));}return out;}
  function emit(poly){if(poly.length<3)return;const expanded=hasNear?expandBoundary(poly):poly,points=expanded.map(weld);const ids=points.map(add);if(ids.length===3){const [a,b,c]=points;if(Math.abs((b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x))>1e-10)indices.push(...ids);return;}const center=points.reduce((p,v)=>({x:p.x+v.x/points.length,y:p.y+v.y/points.length,z:p.z+v.z/points.length}),{x:0,y:0,z:0}),ci=add(center);for(let i=0;i<ids.length;i++){const j=(i+1)%ids.length,a=points[i],b=points[j];if(Math.abs((a.x-center.x)*(b.z-center.z)-(a.z-center.z)*(b.x-center.x))>1e-10)indices.push(ci,ids[i],ids[j]);}}
  function triangle(ids){const poly=ids.map(i=>({x:plan.vertices[i].planarWorld.x,z:plan.vertices[i].planarWorld.z,world:plan.vertices[i].world}));if(!hasNear){indices.push(...ids);return;}if(poly.every(p=>p.x<box.minX)||poly.every(p=>p.x>box.maxX)||poly.every(p=>p.z<box.minZ)||poly.every(p=>p.z>box.maxZ)){indices.push(...ids);return;}let remainder=poly;const outside=[];for(const [coordinate,value,greater] of [['x',box.minX,true],['x',box.maxX,false],['z',box.minZ,true],['z',box.maxZ,false]]){if(remainder.length<3)break;const piece=clip(remainder,coordinate,value,!greater);if(piece.length>=3)outside.push(piece);remainder=clip(remainder,coordinate,value,greater);}if(!outside.length)removedTriangleCount++;else{clippedTriangleCount++;outside.forEach(emit);}}
  for(let ring=0;ring<rings.length-1;ring++)for(let column=0;column<sectorCount;column++){
    const next=(column+1)%sectorCount,a=ring*sectorCount+column,b=ring*sectorCount+next,d=(ring+1)*sectorCount+next,e=(ring+1)*sectorCount+column;
    const cell=[plan.vertices[a],plan.vertices[b],plan.vertices[d],plan.vertices[e]],votes=cell.filter(v=>v.terrainSilhouettePermitted===true).length;
    if(votes<3){suppressedCellCount++;continue}if(votes<4)mixedTransitionCellCount++;triangle([a,e,b]);triangle([b,e,d]);retainedCellCount++;
  }
  seamVertexCount=seamKeys.size;
  return compact(vertices,indices,{retainedCellCount,suppressedCellCount,mixedTransitionCellCount,nearFootprintExcluded:hasNear,nearBoundarySource:hasNear?nearTerrain.primitiveId:null,clippedTriangleCount,removedTriangleCount,seamVertexCount,seamLaw:hasNear?'FINAL_NEAR_PROJECTED_PIECEWISE_LINEAR_BOUNDARY':null});
}

function buildContinuousOceanField(){
  const width=OCEAN_X.length,height=OCEAN_Z.length;
  const vertices=[],vertexRgba=[],samples=[];
  for(let zi=0;zi<height;zi++)for(let xi=0;xi<width;xi++){
    const x=OCEAN_X[xi],z=OCEAN_Z[zi],sample=sampleHEarthWorldManifold(x,z),q=regionToHEarthPlanetPoint({x,y:0.015,z});
    vertices.push(createHEarthVector3(q.x,q.y,q.z));
    vertexRgba.push(evaluateHEarthRecoveredWaterRgbaAtWorldPoint(x,z,{opaque:true}));
    samples.push(sample);
  }
  const indices=[];let retainedCellCount=0,landUnderlayCellCount=0,mixedCoastCellCount=0;
  for(let zi=0;zi<height-1;zi++)for(let xi=0;xi<width-1;xi++){
    const a=zi*width+xi,b=a+1,e=(zi+1)*width+xi,d=e+1;
    const cell=[samples[a],samples[b],samples[d],samples[e]],waterVotes=cell.filter(s=>s?.surfaceClass==='WATER').length;
    if(waterVotes===0)landUnderlayCellCount++;
    else if(waterVotes<4)mixedCoastCellCount++;
    indices.push(a,e,b,b,e,d);retainedCellCount++;
  }
  const maximumRadius=Math.max(...vertices.map(v=>Math.hypot(v.x,v.z)));
  return compact(vertices,indices,{retainedCellCount,landUnderlayCellCount,mixedCoastCellCount,gridWidth:width,gridHeight:height,xMinimum:OCEAN_X[0],xMaximum:OCEAN_X.at(-1),zMinimum:OCEAN_Z[0],zMaximum:OCEAN_Z.at(-1),outerRadius:maximumRadius,waterColorAuthority:'DISTANCE_FROM_CANONICAL_COAST_CONTINUOUS',historical23923ColorAnchorsPreserved:true,visibleWaterAuthority:'ONE_CONTINUOUS_OCEAN_SURFACE',nearCoastTessellation:'WORLD_SPACE_FIELD_NOT_RADIAL_RINGS',oceanUnderlayClosesRepresentationGaps:true,lateralColorTerminationPossible:false,visibleRectangularTerminationProhibited:true},vertexRgba);
}

function primitive(mesh,surfaceClass,plan=null){
  if(mesh.indices.length===0||mesh.vertices.length<3)return null;
  const ocean=surfaceClass==='OCEAN',id=`H_EARTH_WORLD_MANIFOLD:FAR_${surfaceClass}_CONTINUATION`;
  const construction=constructHEarthTriangleMesh({primitiveId:id,geometryId:`${id}:GEOMETRY`,primitiveType:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,vertices:mesh.vertices,indices:mesh.indices,normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,semanticRole:ocean?'AUDRALIA_OPEN_OCEAN_CONTINUOUS_SPHERICAL_SURFACE':'AUDRALIA_CONTINENTAL_CONTEXT_FROM_WORLD_MANIFOLD',materialHint:freeze({materialReference:ocean?'H_EARTH_MATERIAL_OPEN_WATER_DISTANCE':'H_EARTH_MATERIAL_AUDRALIA_SUBTROPICAL_DISTANCE',materialIntent:ocean?'ONE_CONTINUOUS_OPEN_OCEAN_TO_GEOMETRIC_HORIZON':'AUDRALIA_WARM_SUBTROPICAL_CONTINENTAL_CONTEXT'}),source:freeze({sourceType:ocean?'WORLD_MANIFOLD_CONTINUOUS_OCEAN_FIELD':'WORLD_MANIFOLD_PLUS_FIXED_PLANETARY_FRAME',representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,planetaryWorldFrameContractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID}),metadata:freeze({providerContractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,representationClass:'FAR',farSurfaceClass:surfaceClass,geographicIdentity:'AUDRALIA',playableRegionIdentity:'GRATITUDE',climateIdentity:'WARM_SUBTROPICAL_COASTAL',representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,planetaryWorldFrameContractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceAuthority:'DERIVED_REPRESENTATION_ONLY',independentGeographyAuthority:false,fullXYZSphericalContinuation:true,singleSphericalPresentationManifold:true,singleContinuousOceanToHorizon:ocean,visibleWaterAuthority:ocean?'ONE_CONTINUOUS_OCEAN_SURFACE':null,nearCoastTessellation:ocean?'WORLD_SPACE_FIELD_NOT_RADIAL_RINGS':null,waterColorAuthority:ocean?'DISTANCE_FROM_CANONICAL_COAST_CONTINUOUS':null,historical23923ColorAnchorsPreserved:ocean,oceanUnderlayClosesRepresentationGaps:ocean,lateralColorTerminationPossible:ocean?false:null,fixedPlanetaryAnchor:plan?.continuationAnchorFixed!==false,worldRecenteredForCamera:false,navigationAddressIds:[],navigable:false,collisionAuthority:false,accessibleRegionExpansion:false,oceanFacingLandmassCreated:false,visibleRectangularTerminationProhibited:true,separateVisiblePlanetBodySubstitute:false,admitted:false,aggregateFrameAuthority:false})});
  const base=construction?.primitiveRecord??null;
  if(construction?.valid!==true||!isHEarthNeutralPrimitiveRecord(base))return null;
  return ocean?freeze({...base,renderMaterial:freeze({...DEEP_OCEAN_RENDER_MATERIAL,vertexRgba:mesh.vertexRgba})}):base;
}

export function constructHEarthDistantContextGeometry({cameraWorld={x:0,y:8,z:-40},sectorCount=DEFAULT_SECTORS,nearTerrain=null}={}){
  const landPlan=buildHEarthWorldManifoldRepresentationPlan({cameraWorld,rings:LAND_RINGS,sectorCount});
  const issues=[];
  if(landPlan.eligible!==true)issues.push(...landPlan.issues.map(i=>`LAND:${i}`));
  if(landPlan.vertices.some(v=>v.valid!==true))issues.push('FAR_CONTEXT_WORLD_SAMPLE_INVALID');
  if(issues.length)return freeze({ok:false,status:'DISTANT_CONTEXT_GEOMETRY_FAILED',contractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,primitives:[],issues});
  const landMesh=buildLandMesh(landPlan,LAND_RINGS,sectorCount,nearTerrain),oceanMesh=buildContinuousOceanField(),land=primitive(landMesh,'LAND',landPlan),ocean=primitive(oceanMesh,'OCEAN');
  if(!land)issues.push('FAR_LAND_REPRESENTATION_EMPTY_OR_INVALID');if(!ocean)issues.push('FAR_OCEAN_REPRESENTATION_EMPTY_OR_INVALID');
  const primitives=[land,ocean].filter(Boolean),horizon=getHEarthDerivedHorizonDistance(Math.max(0,Number(cameraWorld?.y)||0));
  if(oceanMesh.outerRadius<horizon)issues.push('CONTINUOUS_OCEAN_DOES_NOT_REACH_DERIVED_HORIZON');
  return freeze({ok:issues.length===0,status:issues.length?'DISTANT_CONTEXT_GEOMETRY_FAILED':'DISTANT_CONTEXT_GEOMETRY_COMPLETE',contractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,planetaryWorldFrameContractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,planetBodyHorizonShellId:H_EARTH_PLANET_BODY_HORIZON_SHELL_ID,representationPlan:landPlan,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,representationClass:'FAR',geographicIdentity:'AUDRALIA',playableRegionIdentity:'GRATITUDE',climateIdentity:'WARM_SUBTROPICAL_COASTAL',meshDiagnostics:freeze({land:landMesh,ocean:oceanMesh,triangleCount:landMesh.triangleCount+oceanMesh.triangleCount}),primitives,bounds:primitives[0]?.geometry?.bounds??null,visualContinuationLayer:false,fullXYZSphericalContinuation:true,singleSphericalPresentationManifold:true,derivedHorizonDistance:horizon,fixedPlanetaryAnchor:true,worldRecenteredForCamera:false,accessibleRegionExpansion:false,radialHorizonContinuity:true,oceanSectorEmptinessEnforced:true,oceanVisualContinuationMaterialized:true,planetBodyHorizonShellMaterialized:false,separateVisiblePlanetBodySubstitute:false,singleContinuousOceanToHorizon:true,visibleWaterAuthority:'ONE_CONTINUOUS_OCEAN_SURFACE',nearCoastTessellation:'WORLD_SPACE_FIELD_NOT_RADIAL_RINGS',waterColorAuthority:'DISTANCE_FROM_CANONICAL_COAST_CONTINUOUS',historical23923ColorAnchorsPreserved:true,oceanUnderlayClosesRepresentationGaps:true,lateralColorTerminationPossible:false,oppositeShoreFabricationProhibited:true,independentGeographyAuthority:false,admitted:false,issues});
}