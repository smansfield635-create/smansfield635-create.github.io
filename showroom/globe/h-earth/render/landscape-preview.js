/** H_EARTH_WORLD_MANIFOLD_LANDSCAPE_PREVIEW_GEN306_v1 */
import { isHEarthNeutralPrimitiveRecord,isHEarthAABB3D,mergeHEarthGeometryBounds } from './geometry-kernel.js';
import { constructHEarthRun8BSuccessorTerrainAndMountain } from './geometry-successor-terrain.run8b.js';
import { constructHEarthFunctionalShorelineGeometry } from './geometry-shoreline.js';
import { constructHEarthDistantContextGeometry } from './geometry-distant-context.js';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN } from '../../../../h-earth-3d/integration/h-earth.landscape-realization-planner.js';
import {
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID
} from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import {
  buildHEarthWorldManifoldRepresentationPlan
} from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';
import { admitHEarthWorldManifoldUnion } from '../../../../h-earth-3d/integration/h-earth.world-manifold-union-admission.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const canonical=values=>Object.freeze([...new Set((values??[]).filter(v=>typeof v==='string'&&v.length))].sort());
export const H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID='H_EARTH_WORLD_MANIFOLD_LANDSCAPE_PREVIEW_GEN306_v1';

export function previewHEarthFunctionalLandscape({cameraWorld={x:0,y:8,z:-40}}={}){
  const representationPlan=buildHEarthWorldManifoldRepresentationPlan({cameraWorld});
  const terrainResult=constructHEarthRun8BSuccessorTerrainAndMountain();
  const shoreline=constructHEarthFunctionalShorelineGeometry();
  const distantContext=constructHEarthDistantContextGeometry({cameraWorld});
  const issues=[];
  if(representationPlan.eligible!==true)issues.push(...representationPlan.issues);
  if(terrainResult?.ok!==true||!terrainResult.primitive)issues.push('COMPONENT_INVALID:terrain');
  if(shoreline?.ok!==true)issues.push('COMPONENT_INVALID:shoreline');
  if(distantContext?.ok!==true)issues.push('COMPONENT_INVALID:distantContext');
  const nearPrimitives=terrainResult?.primitive?[terrainResult.primitive]:[];
  const midPrimitives=shoreline?.primitives??[];
  const farPrimitives=distantContext?.primitives??[];
  const union=admitHEarthWorldManifoldUnion({representationPlan,nearPrimitives,midPrimitives,farPrimitives});
  if(union.valid!==true)issues.push(...union.issues);
  const primitives=[...nearPrimitives,...midPrimitives,...farPrimitives];
  if(!primitives.every(isHEarthNeutralPrimitiveRecord))issues.push('COMPONENT_PRIMITIVES_INVALID');
  const bounds=primitives.length?mergeHEarthGeometryBounds(primitives.map(p=>p.geometry.bounds)):null;
  if(!isHEarthAABB3D(bounds))issues.push('AGGREGATE_BOUNDS_INVALID');
  const primitiveIds=primitives.map(p=>p.primitiveId);
  if(new Set(primitiveIds).size!==primitiveIds.length)issues.push('DUPLICATE_PRIMITIVE_ID');

  const plan=H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN;
  const semanticAddressIds=canonical(plan.chunks.flatMap(c=>c.memberAddressIds));
  const terrainAddressIds=canonical(plan.chunks.flatMap(c=>c.terrainMemberAddressIds));
  const shorelineWaterAddressIds=canonical(plan.chunks.flatMap(c=>c.shorelineWaterMemberAddressIds));
  const proxySummarizedAddressIds=canonical(plan.chunks.flatMap(c=>c.proxyMemberAddressIds));
  const formationIds=canonical(plan.chunks.flatMap(c=>c.formationIds));
  if(semanticAddressIds.length!==256)issues.push('SEMANTIC_ADDRESS_COUNT_INVALID');
  if(terrainAddressIds.length!==124)issues.push('TERRAIN_ADDRESS_COUNT_INVALID');
  if(shorelineWaterAddressIds.length!==96)issues.push('SHORELINE_ADDRESS_COUNT_INVALID');
  if(proxySummarizedAddressIds.length!==36)issues.push('PROXY_ADDRESS_COUNT_INVALID');

  return freeze({
    ok:issues.length===0,
    status:issues.length?'WORLD_MANIFOLD_NEUTRAL_PREVIEW_FAILED':'WORLD_MANIFOLD_NEUTRAL_PREVIEW_COMPLETE',
    contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID,
    realizationPlanContractId:plan.contractId,
    representationPlan,
    worldManifoldUnion:union,
    topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    componentResults:{terrain:terrainResult,shoreline,distantContext},
    primitiveCount:primitives.length,primitiveIds,primitives,bounds,
    semanticAddressCount:semanticAddressIds.length,semanticAddressIds,
    terrainAddressCount:terrainAddressIds.length,terrainAddressIds,
    shorelineWaterAddressCount:shorelineWaterAddressIds.length,shorelineWaterAddressIds,
    proxySummarizedAddressCount:proxySummarizedAddressIds.length,proxySummarizedAddressIds,
    formationIds,
    semanticIdentityIndependentOfPhysicalGranularity:true,
    continuousWorldManifold:union.valid,
    independentComponentGeographyAuthority:false,
    admitted:false,WestAdmissionPerformed:false,compositorNodeCreated:false,renderInstanceCreated:false,
    issues
  });
}

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW=previewHEarthFunctionalLandscape();
