/** H_EARTH_GRATITUDE_AUDRALIA_LANDSCAPE_PREVIEW_GEN311_v2_VISIBLE_REGIONAL_RELIEF */
import {
  isHEarthNeutralPrimitiveRecord,
  isHEarthAABB3D,
  mergeHEarthGeometryBounds,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
} from './geometry-kernel.js';
import { constructHEarthRun8BSuccessorTerrainAndMountain } from './geometry-successor-terrain.run8b.js';
import { constructHEarthFunctionalShorelineGeometry } from './geometry-shoreline.js';
import { constructHEarthDistantContextGeometry } from './geometry-distant-context.js';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN } from '../../../../h-earth-3d/integration/h-earth.landscape-realization-planner.js';
import { H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID } from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import {
  H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID,
  deriveHEarthGen311RegionalArticulation
} from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
import { buildHEarthWorldManifoldRepresentationPlan } from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';
import { admitHEarthWorldManifoldUnion } from '../../../../h-earth-3d/integration/h-earth.world-manifold-union-admission.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const canonical=values=>Object.freeze([...new Set((values??[]).filter(v=>typeof v==='string'&&v.length))].sort());
const clamp01=v=>Math.min(1,Math.max(0,v));
const smoothstep=(a,b,x)=>{const t=clamp01((x-a)/(b-a));return t*t*(3-2*t)};

export const H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID='H_EARTH_GRATITUDE_AUDRALIA_LANDSCAPE_PREVIEW_GEN310_v1';
export const H_EARTH_GEN311_LANDSCAPE_PREVIEW_EXTENSION_CONTRACT_ID='H_EARTH_GRATITUDE_AUDRALIA_LANDSCAPE_PREVIEW_GEN311_v2_VISIBLE_REGIONAL_RELIEF';
export const H_EARTH_GEN311_REGIONAL_RELIEF_CONTRACT_ID='H_EARTH_GRATITUDE_REGIONAL_RELIEF_PROJECTION_GEN311_v1_DERIVED_NONAUTHORITATIVE';

function regionalWitnesses(){
  const points=[];
  for(let z=-224;z<=-48;z+=32)for(let x=-160;x<=160;x+=40)points.push([x,z]);
  const samples=points.map(([x,z])=>deriveHEarthGen311RegionalArticulation(x,z)).filter(s=>s.valid===true);
  const classes=canonical(samples.map(s=>s.landformClass));
  const maxima={ridge:0,pass:0,valley:0,watershed:0,foothill:0};
  for(const s of samples){
    maxima.ridge=Math.max(maxima.ridge,s.ridgeSignal);
    maxima.pass=Math.max(maxima.pass,s.passSignal);
    maxima.valley=Math.max(maxima.valley,s.valleySignal);
    maxima.watershed=Math.max(maxima.watershed,s.watershedSignal);
    maxima.foothill=Math.max(maxima.foothill,s.foothillSignal);
  }
  return freeze({
    contractId:H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID,
    sampleCount:samples.length,
    landformClasses:classes,
    landformClassCount:classes.length,
    maxima:freeze(maxima),
    samples:freeze(samples),
    derivedFromCanonicalWorldManifold:true,
    topologyMutation:false,
    canonicalElevationMutation:false
  });
}

function regionalReliefMask(x,z){
  const inland=smoothstep(-92,-176,z)*(1-smoothstep(-470,-620,z));
  const lateral=1-smoothstep(225,365,Math.abs(x));
  return clamp01(inland*lateral);
}

function regionalReliefDelta(vertex){
  const a=deriveHEarthGen311RegionalArticulation(vertex.x,vertex.z);
  if(a?.valid!==true)return 0;
  const mask=regionalReliefMask(vertex.x,vertex.z);
  if(mask<=0)return 0;
  const positiveElevation=Math.max(0,vertex.y);
  const structural=
    a.ridgeSignal*24+
    a.watershedSignal*9+
    a.foothillSignal*13-
    a.valleySignal*14-
    a.passSignal*7;
  const inheritedRelief=positiveElevation*.22;
  return mask*(structural+inheritedRelief);
}

function materializeGen311RegionalRelief(terrainResult){
  const base=terrainResult?.primitive;
  const vertices=base?.geometry?.vertices;
  const indices=base?.geometry?.indices;
  if(!base||!Array.isArray(vertices)||!Array.isArray(indices))return freeze({ok:false,primitive:null,issues:['GEN311_BASE_TERRAIN_GEOMETRY_MISSING']});

  let maximumPositiveDelta=0,maximumNegativeDelta=0,nonzeroVertexCount=0;
  const projectedVertices=vertices.map(v=>{
    const delta=regionalReliefDelta(v);
    if(Math.abs(delta)>1e-9)nonzeroVertexCount++;
    maximumPositiveDelta=Math.max(maximumPositiveDelta,delta);
    maximumNegativeDelta=Math.min(maximumNegativeDelta,delta);
    return createHEarthVector3(v.x,v.y+delta,v.z);
  });

  const construction=constructHEarthTriangleMesh({
    primitiveId:base.primitiveId,
    geometryId:base.geometry.geometryId,
    primitiveType:base.primitiveType??H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices:projectedVertices,
    indices:[...indices],
    normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    transform:base.geometry.transform,
    semanticRole:base.semanticRole,
    materialHint:base.materialHint,
    visibilityHint:base.visibilityHint,
    interactionHint:base.interactionHint,
    source:base.geometry.source??base.source,
    attributes:base.geometry.attributes,
    metadata:{
      ...(base.metadata??{}),
      gen311RegionalReliefContractId:H_EARTH_GEN311_REGIONAL_RELIEF_CONTRACT_ID,
      gen311RegionalReliefMaterialized:true,
      gen311RegionalReliefNonzeroVertexCount:nonzeroVertexCount,
      gen311RegionalReliefMaximumPositiveDelta:maximumPositiveDelta,
      gen311RegionalReliefMaximumNegativeDelta:maximumNegativeDelta,
      canonicalWorldFieldMutated:false,
      geographyAuthorityCreated:false,
      topologyAuthorityCreated:false,
      navigationAuthorityCreated:false,
      accessibleRegionExpansion:false
    }
  });
  const primitive=construction?.primitiveRecord??null;
  const issues=[];
  if(construction?.valid!==true||!isHEarthNeutralPrimitiveRecord(primitive))issues.push('GEN311_REGIONAL_RELIEF_CONSTRUCTION_INVALID');
  if(nonzeroVertexCount<100)issues.push('GEN311_REGIONAL_RELIEF_COVERAGE_INSUFFICIENT');
  if(maximumPositiveDelta<8)issues.push('GEN311_REGIONAL_RELIEF_POSITIVE_DEPTH_INSUFFICIENT');
  if(maximumNegativeDelta>-2)issues.push('GEN311_REGIONAL_RELIEF_VALLEY_DEPTH_INSUFFICIENT');
  return freeze({
    ok:issues.length===0,
    contractId:H_EARTH_GEN311_REGIONAL_RELIEF_CONTRACT_ID,
    primitive,
    construction,
    nonzeroVertexCount,
    maximumPositiveDelta,
    maximumNegativeDelta,
    canonicalWorldFieldMutated:false,
    canonicalElevationValuesPreservedAtSource:true,
    independentGeographyAuthority:false,
    topologyMutation:false,
    accessibleRegionExpansion:false,
    issues
  });
}

export function previewHEarthFunctionalLandscape({cameraWorld={x:0,y:8,z:-40}}={}){
  const representationPlan=buildHEarthWorldManifoldRepresentationPlan({cameraWorld});
  const baseTerrainResult=constructHEarthRun8BSuccessorTerrainAndMountain();
  const regionalRelief=materializeGen311RegionalRelief(baseTerrainResult);
  const terrainResult=regionalRelief.ok?freeze({...baseTerrainResult,primitive:regionalRelief.primitive,gen311RegionalRelief:regionalRelief}):baseTerrainResult;
  const shoreline=constructHEarthFunctionalShorelineGeometry();
  const distantContext=constructHEarthDistantContextGeometry({cameraWorld});
  const regionalDevelopment=regionalWitnesses();
  const issues=[];

  if(representationPlan.eligible!==true)issues.push(...representationPlan.issues);
  if(baseTerrainResult?.ok!==true||!baseTerrainResult.primitive)issues.push('COMPONENT_INVALID:terrain');
  if(regionalRelief.ok!==true)issues.push(...regionalRelief.issues);
  if(shoreline?.ok!==true)issues.push('COMPONENT_INVALID:shoreline');
  if(distantContext?.ok!==true)issues.push('COMPONENT_INVALID:distantContext');
  if(regionalDevelopment.sampleCount<20)issues.push('GEN311_REGIONAL_WITNESS_COVERAGE_INVALID');
  if(regionalDevelopment.contractId!==H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID)issues.push('GEN311_REGIONAL_ARTICULATION_IDENTITY_INVALID');
  if(distantContext?.geographicIdentity!=='AUDRALIA'||distantContext?.playableRegionIdentity!=='GRATITUDE'||distantContext?.oceanSectorEmptinessEnforced!==true)issues.push('GRATITUDE_AUDRALIA_CONTEXT_INVALID');
  if(distantContext?.oceanVisualContinuationMaterialized!==true)issues.push('OCEAN_VISUAL_CONTINUATION_MISSING');

  const farClasses=new Set((distantContext?.primitives??[]).map(p=>p.metadata?.farSurfaceClass));
  if(!farClasses.has('LAND')||!farClasses.has('OCEAN')||farClasses.size!==2)issues.push('RECIPROCAL_FAR_SURFACE_CLASSES_INVALID');
  if((distantContext?.primitives??[]).some(p=>p.metadata?.navigable!==false||p.metadata?.collisionAuthority!==false||p.metadata?.accessibleRegionExpansion!==false))issues.push('FAR_CONTINUATION_AUTHORITY_VIOLATION');

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
    gen311ExtensionContractId:H_EARTH_GEN311_LANDSCAPE_PREVIEW_EXTENSION_CONTRACT_ID,
    developmentPhase:'REGIONAL_ELABORATION',
    developmentTarget:'GRATITUDE_GEOGRAPHIC_AND_ENVIRONMENTAL_ARTICULATION',
    geographicIdentity:freeze({playableRegion:'GRATITUDE',continentalContext:'AUDRALIA',climate:'WARM_SUBTROPICAL_COASTAL'}),
    realizationPlanContractId:plan.contractId,
    representationPlan,
    regionalDevelopment,
    regionalRelief,
    worldManifoldUnion:union,
    topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    componentResults:{terrain:terrainResult,shoreline,distantContext},
    primitiveCount:primitives.length,
    primitiveIds,
    primitives,
    bounds,
    semanticAddressCount:semanticAddressIds.length,
    semanticAddressIds,
    terrainAddressCount:terrainAddressIds.length,
    terrainAddressIds,
    shorelineWaterAddressCount:shorelineWaterAddressIds.length,
    shorelineWaterAddressIds,
    proxySummarizedAddressCount:proxySummarizedAddressIds.length,
    proxySummarizedAddressIds,
    formationIds,
    semanticIdentityIndependentOfPhysicalGranularity:true,
    continuousWorldManifold:union.valid,
    oceanFacingEmptinessPreserved:distantContext?.oceanSectorEmptinessEnforced===true,
    oceanVisualContinuationMaterialized:distantContext?.oceanVisualContinuationMaterialized===true,
    reciprocalFarSurfaceClasses:freeze([...farClasses].sort()),
    oppositeShoreFabricationProhibited:true,
    independentComponentGeographyAuthority:false,
    canonicalWorldFieldProtected:true,
    regionalArticulationDerivedOnly:true,
    regionalReliefMaterialized:regionalRelief.ok===true,
    accessibleRegionExpansion:false,
    admitted:false,
    WestAdmissionPerformed:false,
    compositorNodeCreated:false,
    renderInstanceCreated:false,
    issues
  });
}

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW=previewHEarthFunctionalLandscape();
