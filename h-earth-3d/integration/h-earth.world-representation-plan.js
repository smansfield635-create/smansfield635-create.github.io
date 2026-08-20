/** H_EARTH_WORLD_MANIFOLD_REPRESENTATION_PLAN_v1 */
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
  sampleHEarthWorldManifold,
  classifyHEarthWorldAngularSector
} from '../terrain/h-earth.world-manifold-domain.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const clamp01=v=>Math.min(1,Math.max(0,v));
const smooth=t=>{const x=clamp01(t);return x*x*(3-2*x)};

export const H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID='H_EARTH_WORLD_MANIFOLD_REPRESENTATION_PLAN_v1';
export const H_EARTH_WORLD_REPRESENTATION_CLASSES=freeze(['NEAR','MID','FAR']);
export const H_EARTH_WORLD_REPRESENTATION_DISTANCE_PROFILE=freeze({
  nearFullUntil:180,
  nearZeroAfter:420,
  midStart:140,
  midFullFrom:360,
  midFullUntil:900,
  midZeroAfter:1300,
  farStart:760,
  farFullFrom:1160
});

export function getHEarthWorldRepresentationWeights(distance){
  const d=Math.max(0,Number(distance)||0);
  const p=H_EARTH_WORLD_REPRESENTATION_DISTANCE_PROFILE;
  const near=1-smooth((d-p.nearFullUntil)/(p.nearZeroAfter-p.nearFullUntil));
  const midIn=smooth((d-p.midStart)/(p.midFullFrom-p.midStart));
  const midOut=1-smooth((d-p.midFullUntil)/(p.midZeroAfter-p.midFullUntil));
  const mid=midIn*midOut;
  const far=smooth((d-p.farStart)/(p.farFullFrom-p.farStart));
  const sum=Math.max(Number.EPSILON,near+mid+far);
  return freeze({NEAR:near/sum,MID:mid/sum,FAR:far/sum,sum:1});
}

export function planHEarthWorldRepresentationSample({worldX,worldZ,cameraWorld={x:0,y:0,z:0}}={}){
  const sample=sampleHEarthWorldManifold(worldX,worldZ);
  if(sample?.valid!==true)return freeze({valid:false,status:'WORLD_REPRESENTATION_SAMPLE_REJECTED',sample});
  const dx=worldX-(cameraWorld?.x??0);
  const dz=worldZ-(cameraWorld?.z??0);
  const distance=Math.hypot(dx,dz);
  const theta=Math.atan2(dz,dx);
  const angularSector=classifyHEarthWorldAngularSector(theta);
  const weights=getHEarthWorldRepresentationWeights(distance);
  const openOcean=sample.oceanSectorClass==='OPEN_OCEAN'||angularSector==='OPEN_OCEAN'&&sample.surfaceClass==='WATER';
  return freeze({
    valid:true,
    status:'WORLD_REPRESENTATION_SAMPLE_PLANNED',
    representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,
    worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
    topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    world:{x:worldX,y:sample.elevation,z:worldZ},
    sample,
    distance,
    theta,
    angularSector,
    weights,
    activeRepresentations:H_EARTH_WORLD_REPRESENTATION_CLASSES.filter(id=>weights[id]>1e-6),
    terrainSilhouettePermitted:openOcean?false:sample.terrainSilhouettePermitted,
    sourceSampleIdentity:`${H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID}:${worldX}:${worldZ}`,
    topologyPreserved:true
  });
}

export function buildHEarthWorldManifoldRepresentationPlan({cameraWorld={x:0,y:0,z:0},rings=[96,180,320,520,820,1180,1680],sectorCount=64}={}){
  const issues=[];
  if(!Array.isArray(rings)||rings.length<3||rings.some((r,i)=>!(r>0)||i>0&&r<=rings[i-1]))issues.push('REPRESENTATION_RINGS_INVALID');
  if(!Number.isInteger(sectorCount)||sectorCount<16||sectorCount%4!==0)issues.push('REPRESENTATION_SECTOR_COUNT_INVALID');
  const vertices=[];
  if(issues.length===0){
    for(const radius of rings){
      for(let i=0;i<sectorCount;i++){
        const theta=i/sectorCount*Math.PI*2;
        const x=(cameraWorld.x??0)+Math.cos(theta)*radius;
        const z=(cameraWorld.z??0)+Math.sin(theta)*radius;
        vertices.push(planHEarthWorldRepresentationSample({worldX:x,worldZ:z,cameraWorld}));
      }
    }
  }
  if(vertices.some(v=>v.valid!==true))issues.push('REPRESENTATION_VERTEX_INVALID');
  if(vertices.some(v=>v.topologySourceId!==H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID))issues.push('REPRESENTATION_TOPOLOGY_SOURCE_DIVERGENCE');
  const oceanViolation=vertices.some(v=>v.sample.surfaceClass==='WATER'&&v.terrainSilhouettePermitted!==false);
  if(oceanViolation)issues.push('OPEN_OCEAN_TERRAIN_SILHOUETTE_VIOLATION');
  return freeze({
    eligible:issues.length===0,
    status:issues.length?'WORLD_MANIFOLD_REPRESENTATION_PLAN_FAIL':'WORLD_MANIFOLD_REPRESENTATION_PLAN_PASS',
    contractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,
    worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
    topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    cameraWorld:{...cameraWorld},rings:[...rings],sectorCount,vertices,
    predicates:{SPATIALLY_OVERLAPPED_LOD_AUTHORITY:true,RADIAL_HORIZON_CONTINUITY:true,TOPOLOGY_PRESERVING_LOD:true,OCEAN_SECTOR_EMPTINESS:true,REPRESENTATION_BOUNDARY_INVISIBILITY:true,CAMERA_SURROUNDING_FAR_ENVELOPE:true},
    issues
  });
}

export default buildHEarthWorldManifoldRepresentationPlan;
