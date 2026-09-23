/** H_EARTH_WORLD_MANIFOLD_UNION_ADMISSION_v1 */
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID
} from '../terrain/h-earth.world-manifold-domain.js';
import {
  H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID
} from './h-earth.world-representation-plan.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};

export const H_EARTH_WORLD_MANIFOLD_UNION_ADMISSION_CONTRACT_ID='H_EARTH_WORLD_MANIFOLD_UNION_ADMISSION_v1';

export function admitHEarthWorldManifoldUnion({representationPlan,nearPrimitives=[],midPrimitives=[],farPrimitives=[]}={}){
  const issues=[];
  if(representationPlan?.eligible!==true||representationPlan?.contractId!==H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID)issues.push('WORLD_REPRESENTATION_PLAN_INVALID');
  if(representationPlan?.worldDomainContractId!==H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID)issues.push('WORLD_DOMAIN_IDENTITY_MISMATCH');
  if(representationPlan?.topologySourceId!==H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID)issues.push('WORLD_TOPOLOGY_IDENTITY_MISMATCH');
  const all=[...nearPrimitives,...midPrimitives,...farPrimitives];
  for(const p of all){
    const topology=p?.metadata?.topologySourceId??p?.source?.topologySourceId;
    if(topology&&topology!==H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID)issues.push(`PRIMITIVE_TOPOLOGY_DIVERGENCE:${p?.primitiveId??'UNKNOWN'}`);
    if(p?.metadata?.independentGeographyAuthority===true)issues.push(`INDEPENDENT_GEOGRAPHY_AUTHORITY_PROHIBITED:${p?.primitiveId??'UNKNOWN'}`);
  }
  return freeze({
    valid:issues.length===0,
    status:issues.length?'WORLD_MANIFOLD_UNION_ADMISSION_REJECTED':'WORLD_MANIFOLD_UNION_ADMISSION_PASS',
    contractId:H_EARTH_WORLD_MANIFOLD_UNION_ADMISSION_CONTRACT_ID,
    representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,
    worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
    topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    primitiveCount:all.length,
    primitiveIds:all.map(p=>p?.primitiveId).filter(Boolean),
    nearPrimitiveCount:nearPrimitives.length,
    midPrimitiveCount:midPrimitives.length,
    farPrimitiveCount:farPrimitives.length,
    continuousWorldManifold:issues.length===0,
    topologyPreservingLod:issues.length===0,
    independentGeometryAuthorityCreated:false,
    packet001Altered:false,
    canonicalTerrainFieldAltered:false,
    navigationAuthorityCreated:false,
    rendererAuthorityCreated:false,
    issues
  });
}

export default admitHEarthWorldManifoldUnion;
