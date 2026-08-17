/** H_EARTH_WORLD_MANIFOLD_FAR_CONTEXT_GEOMETRY_GEN306_v2 */
import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID
} from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import {
  H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,
  buildHEarthWorldManifoldRepresentationPlan
} from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};

export const H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID='H_EARTH_WORLD_MANIFOLD_FAR_CONTEXT_GEOMETRY_GEN306_v2_COMPACT_RADIAL_LAND';

function buildCompactFarLandMesh(plan,rings,sectorCount){
  const rawVertices=plan.vertices.map(v=>createHEarthVector3(v.world.x,v.world.y,v.world.z));
  const rawIndices=[];
  const rows=rings.length,cols=sectorCount;
  let suppressedOceanCellCount=0;
  let retainedLandCellCount=0;
  for(let r=0;r<rows-1;r++){
    for(let c=0;c<cols;c++){
      const n=(c+1)%cols;
      const a=r*cols+c,b=r*cols+n,d=(r+1)*cols+n,e=(r+1)*cols+c;
      const cell=[plan.vertices[a],plan.vertices[b],plan.vertices[d],plan.vertices[e]];
      if(cell.some(v=>v.terrainSilhouettePermitted!==true)){
        suppressedOceanCellCount++;
        continue;
      }
      rawIndices.push(a,e,b,b,e,d);
      retainedLandCellCount++;
    }
  }

  const referenced=[...new Set(rawIndices)].sort((a,b)=>a-b);
  const remap=new Map(referenced.map((oldIndex,newIndex)=>[oldIndex,newIndex]));
  const vertices=referenced.map(index=>rawVertices[index]);
  const indices=rawIndices.map(index=>remap.get(index));

  return freeze({
    vertices,
    indices,
    sourceVertexCount:rawVertices.length,
    compactVertexCount:vertices.length,
    removedUnreferencedVertexCount:rawVertices.length-vertices.length,
    suppressedOceanCellCount,
    retainedLandCellCount,
    triangleCount:indices.length/3
  });
}

export function constructHEarthDistantContextGeometry({cameraWorld={x:0,y:8,z:-40},rings=[520,820,1180,1680,2200],sectorCount=64}={}){
  const plan=buildHEarthWorldManifoldRepresentationPlan({cameraWorld,rings,sectorCount});
  const issues=[];
  if(plan.eligible!==true)issues.push(...plan.issues);
  const mesh=buildCompactFarLandMesh(plan,rings,sectorCount);
  if(mesh.indices.length===0||mesh.vertices.length<3)issues.push('FAR_LAND_REPRESENTATION_EMPTY');
  const primitiveId='H_EARTH_WORLD_MANIFOLD:FAR_LAND_REPRESENTATION';
  const construction=issues.length===0?constructHEarthTriangleMesh({
    primitiveId,
    geometryId:`${primitiveId}:GEOMETRY`,
    primitiveType:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices:mesh.vertices,
    indices:mesh.indices,
    normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole:'WORLD_MANIFOLD_FAR_LAND_REPRESENTATION',
    materialHint:freeze({materialReference:'H_EARTH_MATERIAL_HIGHLAND_PROXY',materialIntent:'G_WORLD_FAR_ATMOSPHERIC_TERRAIN'}),
    source:freeze({sourceType:'WORLD_MANIFOLD_REPRESENTATION_PLAN',representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID}),
    metadata:freeze({providerContractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,representationClass:'FAR',representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceAuthority:'DERIVED_REPRESENTATION_ONLY',independentGeographyAuthority:false,directionalBandConstruction:false,radialRingSectorTopology:true,ringCount:rings.length,sectorCount,sourceVertexCount:mesh.sourceVertexCount,compactVertexCount:mesh.compactVertexCount,removedUnreferencedVertexCount:mesh.removedUnreferencedVertexCount,suppressedOceanCellCount:mesh.suppressedOceanCellCount,retainedLandCellCount:mesh.retainedLandCellCount,oceanSectorEmptinessEnforced:true,hardWorldTerminalAuthority:false,visualContinuationLayer:true,navigationAddressIds:[],navigable:false,collisionAuthority:false,accessibleRegionExpansion:false,oceanFacingLandmassCreated:false,visibleRectangularTerminationProhibited:true,admitted:false,aggregateFrameAuthority:false})
  }):null;
  const primitive=construction?.primitiveRecord??null;
  if(construction&&construction.valid!==true){
    issues.push('FAR_REPRESENTATION_CONSTRUCTION_INVALID');
    for(const issue of construction.issues??[]){
      if(issue?.blocking===true||issue?.severity==='ERROR')issues.push(`SOUTH:${issue.code??'UNKNOWN'}`);
    }
  }
  if(primitive&&!isHEarthNeutralPrimitiveRecord(primitive))issues.push('FAR_REPRESENTATION_PRIMITIVE_INVALID');
  return freeze({ok:issues.length===0,status:issues.length?'DISTANT_CONTEXT_GEOMETRY_FAILED':'DISTANT_CONTEXT_GEOMETRY_COMPLETE',contractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,representationPlan:plan,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,representationClass:'FAR',meshDiagnostics:mesh,constructionDiagnostics:construction?.valid===true?null:(construction?.issues??[]),primitives:primitive?[primitive]:[],bounds:primitive?.geometry?.bounds??null,visualContinuationLayer:true,accessibleRegionExpansion:false,radialHorizonContinuity:true,oceanSectorEmptinessEnforced:true,independentGeographyAuthority:false,admitted:false,issues});
}
