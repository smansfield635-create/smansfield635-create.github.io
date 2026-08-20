/** H_EARTH_GRATITUDE_AUDRALIA_FAR_CONTEXT_GEOMETRY_GEN310_v1 */
import { H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,createHEarthVector3,constructHEarthTriangleMesh,isHEarthNeutralPrimitiveRecord } from './geometry-kernel.js';
import { H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID } from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import { H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,buildHEarthWorldManifoldRepresentationPlan } from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';
const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
export const H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID='H_EARTH_GRATITUDE_AUDRALIA_FAR_CONTEXT_GEOMETRY_GEN310_v1';
const DEFAULT_RINGS=freeze([360,540,780,1120,1600,2260,3160,4400,6000]);
const DEFAULT_SECTORS=96;
function buildCompactMesh(plan,rings,sectorCount,surfaceClass){
  const rawVertices=plan.vertices.map(v=>createHEarthVector3(v.world.x,surfaceClass==='OCEAN'?0.02:v.world.y,v.world.z)),rawIndices=[];
  let retainedCellCount=0,suppressedCellCount=0,mixedTransitionCellCount=0;
  for(let r=0;r<rings.length-1;r++)for(let c=0;c<sectorCount;c++){
    const n=(c+1)%sectorCount,a=r*sectorCount+c,b=r*sectorCount+n,d=(r+1)*sectorCount+n,e=(r+1)*sectorCount+c;
    const cell=[plan.vertices[a],plan.vertices[b],plan.vertices[d],plan.vertices[e]],landVotes=cell.filter(v=>v.terrainSilhouettePermitted===true).length;
    const keep=surfaceClass==='LAND'?landVotes>=3:landVotes<=2;
    if(!keep){suppressedCellCount++;continue;}
    if(landVotes>0&&landVotes<4)mixedTransitionCellCount++;
    rawIndices.push(a,e,b,b,e,d);retainedCellCount++;
  }
  const referenced=[...new Set(rawIndices)].sort((a,b)=>a-b),remap=new Map(referenced.map((oldIndex,newIndex)=>[oldIndex,newIndex]));
  return freeze({vertices:referenced.map(i=>rawVertices[i]),indices:rawIndices.map(i=>remap.get(i)),sourceVertexCount:rawVertices.length,compactVertexCount:referenced.length,removedUnreferencedVertexCount:rawVertices.length-referenced.length,retainedCellCount,suppressedCellCount,mixedTransitionCellCount,triangleCount:rawIndices.length/3});
}
function constructFarPrimitive({mesh,surfaceClass}){
  if(mesh.indices.length===0||mesh.vertices.length<3)return null;
  const ocean=surfaceClass==='OCEAN',primitiveId=`H_EARTH_WORLD_MANIFOLD:FAR_${surfaceClass}_CONTINUATION`;
  const construction=constructHEarthTriangleMesh({primitiveId,geometryId:`${primitiveId}:GEOMETRY`,primitiveType:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,vertices:mesh.vertices,indices:mesh.indices,normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,semanticRole:ocean?'AUDRALIA_OPEN_OCEAN_ATMOSPHERIC_CONTINUATION_FROM_WORLD_MANIFOLD':'AUDRALIA_CONTINENTAL_CONTEXT_FROM_WORLD_MANIFOLD',materialHint:freeze({materialReference:ocean?'H_EARTH_MATERIAL_OPEN_WATER_DISTANCE':'H_EARTH_MATERIAL_AUDRALIA_SUBTROPICAL_DISTANCE',materialIntent:ocean?'OPEN_OCEAN_DISTANCE_CONTINUATION':'AUDRALIA_WARM_SUBTROPICAL_CONTINENTAL_CONTEXT'}),source:freeze({sourceType:'WORLD_MANIFOLD_REPRESENTATION_PLAN',representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID}),metadata:freeze({providerContractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,representationClass:'FAR',farSurfaceClass:surfaceClass,geographicIdentity:'AUDRALIA',playableRegionIdentity:'GRATITUDE',climateIdentity:'WARM_SUBTROPICAL_COASTAL',representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceAuthority:'DERIVED_REPRESENTATION_ONLY',independentGeographyAuthority:false,directionalBandConstruction:false,radialRingSectorTopology:true,horizonBeyondNominalCameraEnvelope:true,atmosphericAttenuationRequired:true,oceanFacingWaterContinuation:ocean,oppositeShoreFabricationProhibited:true,hardWorldTerminalAuthority:false,visualContinuationLayer:true,navigationAddressIds:[],navigable:false,collisionAuthority:false,accessibleRegionExpansion:false,oceanFacingLandmassCreated:false,visibleRectangularTerminationProhibited:true,admitted:false,aggregateFrameAuthority:false})});
  return construction?.valid===true&&isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord)?construction.primitiveRecord:null;
}
export function constructHEarthDistantContextGeometry({cameraWorld={x:0,y:8,z:-40},rings=DEFAULT_RINGS,sectorCount=DEFAULT_SECTORS}={}){
  const plan=buildHEarthWorldManifoldRepresentationPlan({cameraWorld,rings,sectorCount}),issues=[];
  if(plan.eligible!==true)issues.push(...plan.issues);
  const landMesh=buildCompactMesh(plan,rings,sectorCount,'LAND'),oceanMesh=buildCompactMesh(plan,rings,sectorCount,'OCEAN');
  const land=constructFarPrimitive({mesh:landMesh,surfaceClass:'LAND'}),ocean=constructFarPrimitive({mesh:oceanMesh,surfaceClass:'OCEAN'});
  if(!land)issues.push('FAR_LAND_REPRESENTATION_EMPTY_OR_INVALID');if(!ocean)issues.push('FAR_OCEAN_REPRESENTATION_EMPTY_OR_INVALID');
  const primitives=[land,ocean].filter(Boolean);
  return freeze({ok:issues.length===0,status:issues.length?'DISTANT_CONTEXT_GEOMETRY_FAILED':'DISTANT_CONTEXT_GEOMETRY_COMPLETE',contractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,representationPlan:plan,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,representationClass:'FAR',geographicIdentity:'AUDRALIA',playableRegionIdentity:'GRATITUDE',climateIdentity:'WARM_SUBTROPICAL_COASTAL',meshDiagnostics:freeze({land:landMesh,ocean:oceanMesh,triangleCount:landMesh.triangleCount+oceanMesh.triangleCount,retainedLandCellCount:landMesh.retainedCellCount,retainedOceanCellCount:oceanMesh.retainedCellCount,suppressedOceanCellCount:0}),constructionDiagnostics:null,primitives,bounds:primitives[0]?.geometry?.bounds??null,visualContinuationLayer:true,accessibleRegionExpansion:false,radialHorizonContinuity:true,oceanSectorEmptinessEnforced:true,oceanVisualContinuationMaterialized:true,oppositeShoreFabricationProhibited:true,independentGeographyAuthority:false,admitted:false,issues});}
