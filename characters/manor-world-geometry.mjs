import {buildNeutralMesh} from '../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import {MATERIAL_ZONES} from '../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import {OMIT_FACE_MAP} from '../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs';
import {PHASE2_MATERIALS} from '../assets/manor-blueprint/manor.estate.gothic-detail-phase2.mjs';
import {buildPhase3DetailMesh,auditPhase3,PHASE3_MATERIALS} from '../assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs';
import {resolveLodSiteAnchor} from './gratitude-geography.adapter.mjs';

const freeze=value=>Object.freeze(value);
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const rounded=value=>Math.round(value*1e9)/1e9;

export const MIRROR_MANOR_WORLD_GEOMETRY_CONTRACT_ID='CHARACTERS_MIRROR_MANOR_WORLD_GEOMETRY_G4_v1';
export const MIRROR_MANOR_PHYSICAL_DONOR=freeze({
  scenePath:'assets/compass/compass.house-scene.js',
  sceneBlob:'a82e3c963a10808b9f8f1922faab45155ea4a62b',
  sceneVersion:'mirror-manor-gothic-phase3-carousel-v6-material-detail-final',
  sceneContract:'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1',
  authority:'PHYSICAL_EXPRESSION_ONLY_NO_GEOGRAPHY_OR_NARRATIVE_AUTHORITY',
  blueprintBlobs:freeze({
    neutral:'0377cb8b28907e3c10e6193dff3e720b8623f089',
    phase1:'c7bf5ccd2587e1a6087bb469a00bdae7c0a96f94',
    phase1b:'577503fd4b1cca1d17828672071409eaa0a300b2',
    phase2:'96702c6471ad2df893847f4f997b235cfaec6ee1',
    phase3:'38bc8fa60a251681cb5484926409290f66460ad0'
  })
});

const omittedFromWorld=id=>id==='FG'||id==='GHSE'||/(^|-)GATE($|-)/.test(id||'');
const detachedForegroundMesh=mesh=>{
  const triangles=mesh?.triangles||[];
  if(!triangles.length)return false;
  let minimumZ=Infinity;
  for(const vertex of triangles)if(Array.isArray(vertex)&&finite(vertex[2]))minimumZ=Math.min(minimumZ,vertex[2]);
  return minimumZ>13;
};
const surfaceClass=mesh=>{
  const id=mesh?.id||'',role=mesh?.role||'',material=mesh?.material||'';
  if(/^R-/.test(id)||/roof|crown/i.test(role)||/SLATE/i.test(material))return 'ROOF';
  if(/^(FC|TR-W|TR-E|IC)$/.test(id)||/court|terrace/i.test(role))return 'COURT';
  return 'STONE';
};
const colorFor=(mesh,sourceClass)=>{
  const surface=surfaceClass(mesh);
  if(sourceClass==='NEUTRAL'){
    if(surface==='ROOF')return [0.15,0.16,0.19];
    if(surface==='COURT')return [0.36,0.35,0.34];
    return [0.43,0.42,0.41];
  }
  const material=PHASE3_MATERIALS[mesh.material]||PHASE2_MATERIALS[mesh.material]||MATERIAL_ZONES[mesh.material]||MATERIAL_ZONES.GRAND_STONE;
  if(surface==='ROOF')return [0.15,0.16,0.19];
  return [...material.rgb];
};
const groupKey=(surface,color)=>`${surface}:${color.map(v=>v.toFixed(4)).join(',')}`;
const normalFor=(a,b,c)=>{
  const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2];
  const vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
  let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
  const length=Math.hypot(nx,ny,nz)||1;
  return [nx/length,ny/length,nz/length].map(rounded);
};
const meshFromTriangles=(id,entries,scale)=>{
  const positions=[],normals=[],indices=[],sourceMeshIds=[];
  let vertexIndex=0;
  for(const entry of entries){
    sourceMeshIds.push(entry.id);
    const triangles=entry.triangles||[];
    for(let index=0;index<triangles.length;index+=3){
      const a=triangles[index],b=triangles[index+1],c=triangles[index+2];
      if(!a||!b||!c)continue;
      const normal=normalFor(a,b,c);
      for(const point of [a,b,c]){
        positions.push(rounded(point[0]*scale),rounded(point[1]*scale),rounded(point[2]*scale));
        normals.push(...normal);
        indices.push(vertexIndex++);
      }
    }
  }
  return freeze({
    meshId:id,
    primitiveType:'TRIANGLE_MESH',
    sourceShape:'MATURE_COMPASS_MANOR_PHASE3_COMPOSITE',
    sourceMeshIds:freeze(sourceMeshIds),
    positions:freeze(positions),
    normals:freeze(normals),
    indices:freeze(indices),
    vertexCount:positions.length/3,
    triangleCount:indices.length/3,
    billboard:false,
    closedVolume:false
  });
};

export function buildMirrorManorWorldGeometry(lod='LOCAL'){
  if(!['REGIONAL','LOCAL'].includes(lod))throw new RangeError(`UNKNOWN_MIRROR_MANOR_G4_LOD:${lod}`);
  const audit=auditPhase3();
  if(!audit.passStatic)throw new Error('MIRROR_MANOR_PHASE3_DONOR_AUDIT_FAILED');
  const detail=buildPhase3DetailMesh();
  const geography=resolveLodSiteAnchor('MIRROR_MANOR',lod);
  const scale=geography.landmarkScale;
  const groups=new Map();
  const add=(mesh,sourceClass)=>{
    if(!mesh||omittedFromWorld(mesh.id)||detachedForegroundMesh(mesh))return;
    const surface=surfaceClass(mesh),color=colorFor(mesh,sourceClass),key=groupKey(surface,color);
    if(!groups.has(key))groups.set(key,{surface,color,meshes:[]});
    groups.get(key).meshes.push(mesh);
  };
  for(const mesh of buildNeutralMesh({omitFaceMap:OMIT_FACE_MAP}).meshes){
    if(mesh.id===detail.suppressedNeutralRoofId)continue;
    add(mesh,'NEUTRAL');
  }
  for(const mesh of detail.replacementRoof)add(mesh,'DETAIL');
  if(lod==='LOCAL')for(const mesh of detail.meshes)add(mesh,'DETAIL');
  const components=[];
  let ordinal=0;
  for(const group of groups.values()){
    const mesh=meshFromTriangles(`MANOR_G4_${group.surface}_${++ordinal}`,group.meshes,scale);
    if(mesh.vertexCount===0)continue;
    components.push(freeze({
      componentId:mesh.meshId,
      semanticRole:`MIRROR_MANOR_${group.surface}`,
      surfaceClass:group.surface,
      mesh:freeze({...mesh,lightingResponse:freeze({model:'NORMAL_DRIVEN_LAMBERTIAN_WITH_DONOR_COLOR',baseColor:freeze(group.color.map(rounded)),roughness:group.surface==='ROOF'?0.88:0.82,metalness:0.02,emissiveStrength:0})})
    }));
  }
  const vertexCount=components.reduce((sum,entry)=>sum+entry.mesh.vertexCount,0);
  const triangleCount=components.reduce((sum,entry)=>sum+entry.mesh.triangleCount,0);
  return freeze({
    contractId:MIRROR_MANOR_WORLD_GEOMETRY_CONTRACT_ID,
    geometryIdentity:'MIRROR_MANOR_WORLD_GEOMETRY:COMPASS_PHASE3:G4',
    siteId:'MIRROR_MANOR',
    lod,
    representation:'STRUCTURAL_3D_TRIANGLE_MESH_ASSEMBLY',
    donor:MIRROR_MANOR_PHYSICAL_DONOR,
    donorAudit:freeze({contract:audit.contract,passStatic:audit.passStatic}),
    geography:freeze({
      adapterId:geography.adapterId,
      canonicalWorldReference:geography.canonicalWorldReference,
      mapReference:geography.mapReference,
      samplingDensity:geography.samplingDensity,
      landmarkScale:geography.landmarkScale,
      geographicStateChanged:false,
      finalContinentalAuthorityCreated:false
    }),
    components:freeze(components),
    componentCount:components.length,
    vertexCount,
    triangleCount,
    omittedDetachedForeground:true,
    omittedGatehouse:true,
    omittedFormalGardenPlinth:true,
    navigationAuthorityCreated:false,
    narrativeAuthorityCreated:false,
    geographyAuthorityCreated:false,
    rendererIntegrationPerformed:false
  });
}

export function evaluateMirrorManorWorldGeometry(){
  const regional=buildMirrorManorWorldGeometry('REGIONAL');
  const local=buildMirrorManorWorldGeometry('LOCAL');
  const issues=[];
  if(regional.geometryIdentity!==local.geometryIdentity)issues.push('LOD_GEOMETRY_IDENTITY_DRIFT');
  if(regional.geography.canonicalWorldReference.x!==local.geography.canonicalWorldReference.x||regional.geography.canonicalWorldReference.y!==local.geography.canonicalWorldReference.y||regional.geography.canonicalWorldReference.z!==local.geography.canonicalWorldReference.z)issues.push('LOD_GEOGRAPHIC_STATE_DRIFT');
  if(regional.vertexCount>local.vertexCount||regional.triangleCount>local.triangleCount)issues.push('REGIONAL_LOD_EXCEEDS_LOCAL');
  if(local.vertexCount<=0||local.triangleCount<=0)issues.push('LOCAL_MANOR_GEOMETRY_EMPTY');
  if(!local.donorAudit.passStatic)issues.push('DONOR_AUDIT_NOT_PASS');
  return freeze({
    schema:'CHARACTERS_MIRROR_MANOR_WORLD_GEOMETRY_G4_RECEIPT_v1',
    result:issues.length===0?'PASS_MIRROR_MANOR_WORLD_GEOMETRY':'HELD_MIRROR_MANOR_WORLD_GEOMETRY',
    eligible:issues.length===0,
    regional:freeze({componentCount:regional.componentCount,vertexCount:regional.vertexCount,triangleCount:regional.triangleCount,landmarkScale:regional.geography.landmarkScale}),
    local:freeze({componentCount:local.componentCount,vertexCount:local.vertexCount,triangleCount:local.triangleCount,landmarkScale:local.geography.landmarkScale}),
    canonicalWorldReference:local.geography.canonicalWorldReference,
    issues,
    boundaries:freeze({physicalExpressionOnly:true,geographyAuthorityCreated:false,narrativeAuthorityCreated:false,navigationAuthorityCreated:false})
  });
}
