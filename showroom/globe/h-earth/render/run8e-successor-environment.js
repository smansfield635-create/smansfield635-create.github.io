// Observation-only synchronous spans; the operation and its exceptions are unchanged.
const startupMeasure=(name,operation)=>globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.measure?globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS.measure(name,operation):operation();
/** H_EARTH_RUN_8E_GRATITUDE_AUDRALIA_RECIPROCAL_REGIONAL_DEVELOPMENT_GEN311_v1 */
import { admitHEarthPrimitiveBatch,mergeHEarthGeometryBounds,isHEarthAABB3D } from './geometry-kernel.js';
import { previewHEarthFunctionalLandscape, H_EARTH_FUNCTIONAL_LANDSCAPE_DEFAULT_CAMERA } from './landscape-preview.js?cb=b8fc053cb9abb6c6';
import { buildHEarthRun8CTerrainMaterialLightingPresentation,evaluateHEarthRun8CTerrainMaterialLightingPresentation } from './lighting-material-successor-terrain.run8c.js';
import { planHEarthGen2514GroundedVegetation,constructHEarthGen2514GroundedVegetationBatch } from './geometry-grounded-vegetation.run8d.js?cb=8c008f474e4f74f1';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
import { H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID } from '../../../../h-earth-3d/environment/h-earth.successor-vegetation.run8d.js';
import { prepareHEarthFunctionalLandscapeRenderPlan,rasterizeHEarthFunctionalLandscapePlan } from './renderer.functional-landscape.js';
import { H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID,H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,buildHEarthRun8EPacket002SuccessorTransfer } from '../../../../h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js?cb=d12121468273fcf4';
import { H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,evaluateHEarthRun8EControlContract } from '../../../../h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js';
import { H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID } from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import { H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID } from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';
const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const canonical=values=>Object.freeze([...new Set((values??[]).filter(v=>typeof v==='string'&&v.length))].sort());
const mix=(a,b,t)=>Math.round(a+(b-a)*t);
const RUN8C_PRESENTATION_DISTANCE_MAX=768;
export const H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID='H_EARTH_RUN_8E_GRATITUDE_AUDRALIA_RECIPROCAL_REGIONAL_REPAIR_GEN310_v1';
export const H_EARTH_GEN311_RUN_8E_REGIONAL_INTEGRATION_CONTRACT_ID='H_EARTH_RUN_8E_GRATITUDE_AUDRALIA_RECIPROCAL_REGIONAL_DEVELOPMENT_GEN311_v1';
function averageColors(colors){const valid=colors.filter(c=>Array.isArray(c)&&c.length===4);return valid.length?[0,1,2,3].map(i=>Math.round(valid.reduce((s,c)=>s+c[i],0)/valid.length)):[116,103,73,255];}
function terrainTriangleColors(primitive,presentation){const indices=primitive?.geometry?.indices??[],attrs=presentation?.vertexAttributes??[],colors=[];for(let o=0;o+2<indices.length;o+=3)colors.push(averageColors([attrs[indices[o]]?.finalColorRgba,attrs[indices[o+1]]?.finalColorRgba,attrs[indices[o+2]]?.finalColorRgba]));return freeze(colors);}
function vegetationColor(p){const intent=String(p?.materialHint?.materialIntent??''),zone=String(p?.metadata?.gen311RegionalEcology?.ecologicalZone??'');if(intent.includes('TRUNK')||intent.includes('WOODY'))return[83,62,38,255];if(zone==='WIND_EXPOSED_RIDGELINE')return[66,91,54,255];if(zone==='SHELTERED_MOIST_VALLEY')return[37,122,58,255];if(zone==='SUBTROPICAL_FOOTHILL_WOODLAND')return[42,111,48,255];if(zone==='DRAINAGE_DIVIDE_WOODLAND')return[45,93,48,255];if(zone==='PASS_CORRIDOR_MOSAIC')return[57,124,57,255];if(intent.includes('CONIFER'))return[34,78,47,255];if(intent.includes('SHRUB'))return[45,105,53,255];return[64,137,64,255];}
function farMaterial(role){if(role==='FAR_OCEAN')return freeze({rgba:[35,82,98,255],transparencyClass:'OPAQUE'});return freeze({rgba:[58,88,63,255],transparencyClass:'OPAQUE'});}
function attachRegionalEcology(primitives,regionalVegetation){const byPopulation=new Map((regionalVegetation?.instances??[]).map(i=>[i.sourcePopulationInstanceId,i.regionalEcology]));return primitives.map(p=>{const sourceId=p.metadata?.sourcePopulationInstanceId,ecology=sourceId?byPopulation.get(sourceId):null;return ecology?freeze({...p,metadata:freeze({...p.metadata,gen311RegionalEcology:ecology,gen311SuccessorVegetationContractId:H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID})}):p;});}
function decoratePrimitive(p,terrainSourceId,terrainColors){
  const far=p.metadata?.representationClass==='FAR',farSurface=p.metadata?.farSurfaceClass;
  const role=p.primitiveId===terrainSourceId?'TERRAIN':p.metadata?.run8DInstanceId?'VEGETATION':far&&farSurface==='OCEAN'?'FAR_OCEAN':far?'FAR_TERRAIN':'SHORELINE';
  const material=role==='TERRAIN'?{rgba:terrainColors?.[0]??[103,104,65,255],transparencyClass:'OPAQUE'}:role==='FAR_OCEAN'?(p.renderMaterial??farMaterial(role)):role==='FAR_TERRAIN'?farMaterial(role):role==='VEGETATION'?{rgba:vegetationColor(p),transparencyClass:'OPAQUE'}:p.renderMaterial;
  return freeze({...p,renderMaterial:material,renderTriangleColors:role==='TERRAIN'?terrainColors:null,metadata:freeze({...p.metadata,run8ERenderClass:role,geographicIdentity:role==='FAR_TERRAIN'||role==='FAR_OCEAN'?'AUDRALIA':'GRATITUDE',climateIdentity:'WARM_SUBTROPICAL_COASTAL',topologySourceId:p.metadata?.topologySourceId??(role==='VEGETATION'?null:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID),samePhysicalDepthDomainAsTerrain:role==='VEGETATION'||role==='FAR_TERRAIN'||role==='FAR_OCEAN'?true:p.metadata?.samePhysicalDepthDomainAsTerrain,atmosphericDistanceContinuation:role==='FAR_TERRAIN'||role==='FAR_OCEAN',oceanFacingWaterContinuationMaterialized:role==='FAR_OCEAN',farOceanVertexColorPreserved:role==='FAR_OCEAN'&&Array.isArray(p.renderMaterial?.vertexRgba),gen311RegionalDevelopmentIntegrated:true})});
}
// Descriptive zones follow the existing Gen311 landform mapping. They do not
// replace continuous response signals, replan population, or identify species.
function gen2515RegionalEcology(instance, issues) {
  const sample = sampleHEarthRun8BSuccessorTerrainField(instance.worldAnchor.x, instance.worldAnchor.z);
  const landform = sample.regionalArticulation?.landformClass;
  const zones = {
    RIDGELINE: 'WIND_EXPOSED_RIDGELINE', PASS: 'PASS_CORRIDOR_MOSAIC',
    VALLEY: 'SHELTERED_MOIST_VALLEY', WATERSHED: 'DRAINAGE_DIVIDE_WOODLAND',
    FOOTHILL: 'SUBTROPICAL_FOOTHILL_WOODLAND', HIGHLAND_SLOPE: 'MONTANE_TRANSITION',
    LOWLAND: 'COASTAL_LOWLAND'
  };
  if (sample.valid !== true || sample.regionalArticulation?.valid !== true || !zones[landform]) {
    issues.push(`GEN2515_ECOLOGICAL_ZONE_UNRESOLVED:${instance.placementId}`);
  }
  const sourceCommunity = instance.archetypeId === 'COASTAL_GRASS_TUFT' ? 'groundcover' : null;
  if (!sourceCommunity) issues.push(`GEN2515_COMMUNITY_UNRESOLVED:${instance.placementId}`);
  return freeze({ecologicalZone: zones[landform] ?? null, sourceCommunity,
    communityWeights: instance.communityWeights, continuousSignals: instance.continuousSignals,
    habitatDisposition: instance.habitatDisposition, ecologicalValidityClaim: false});
}
let gen2515VegetationCache = null;
function gen2515Vegetation() {
  if (gen2515VegetationCache) return gen2515VegetationCache;
  const plan = planHEarthGen2514GroundedVegetation();
  const issues = [...(plan.issues ?? [])], instances = [];
  if (plan.eligible !== true) issues.push('GEN2515_GEOMETRY_PLAN_NOT_ELIGIBLE');
  else for (const batch of plan.batches) {
    const built = constructHEarthGen2514GroundedVegetationBatch(plan, batch.batchId);
    if (built.eligible !== true) issues.push(`GEN2515_BATCH_FAILED:${batch.batchId}`, ...(built.issues ?? []));
    instances.push(...(built.instances ?? []));
  }
  const regionalInstances = instances.map(i => freeze({sourcePopulationInstanceId: i.sourcePopulationInstanceId,
    regionalEcology: gen2515RegionalEcology(i, issues)}));
  const ecologyByPopulation = new Map(regionalInstances.map(i => [i.sourcePopulationInstanceId, i.regionalEcology]));
  const primitives = instances.flatMap(i => (i.components ?? []).map(c => {
    const p = c.primitiveRecord;
    if (!p) { issues.push(`GEN2515_PRIMITIVE_MISSING:${i.placementId}`); return null; }
    return freeze({...p, metadata: freeze({...p.metadata, run8DInstanceId: i.instanceId,
      sourcePopulationInstanceId: i.sourcePopulationInstanceId, gen2514PlacementId: i.placementId,
      gen311RegionalEcology: ecologyByPopulation.get(i.sourcePopulationInstanceId),
      gen311SuccessorVegetationContractId: H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID})});
  }).filter(Boolean));
  gen2515VegetationCache = freeze({eligible: plan.eligible === true && issues.length === 0 && instances.length === plan.instanceCount,
    plan, instances: freeze(instances), regionalInstances: freeze(regionalInstances), primitives: freeze(primitives),
    instanceCount: instances.length, primitiveCount: primitives.length, issues: freeze(issues),
    cameraIndependent: true, populationLimit: null, legacyPopulationPlannerUsed: false});
  return gen2515VegetationCache;
}
let gen2515VegetationGroundedPlanCache = null;
let gen2515VegetationWorldTruthPlanCache = null;
let vegetationPreparation = null;
export const isHEarthGen2515VegetationWorldTruthPrepared=()=>gen2515VegetationWorldTruthPlanCache!==null;
// The existing planner worker also constructs one complete, unchanged logical batch at a time.
let vegetationWorker=null,vegetationWorkerPending=null,vegetationWorkerNextBatch=0,vegetationWorkerFailure=null;
async function freezeVegetationWorkerResult(value){
  const seen=new WeakSet(),stack=[value];let budgetStart=performance.now(),visited=0;
  while(stack.length){
    const item=stack.pop();
    if(item===null||typeof item!=='object'||Object.isFrozen(item)||seen.has(item))continue;
    seen.add(item);for(const child of Object.values(item))if(child&&typeof child==='object')stack.push(child);
    Object.freeze(item);
    if(++visited%128===0&&performance.now()-budgetStart>=8){await new Promise(resolve=>setTimeout(resolve,0));budgetStart=performance.now();}
  }
  return value;
}
function failVegetationWorker(error){
  vegetationWorkerFailure=error;vegetationWorker?.terminate();vegetationWorker=null;
  const pending=vegetationWorkerPending;vegetationWorkerPending=null;pending?.reject(error);
}
export function prepareHEarthGen2515VegetationWorldTruthPlan() {
  if(vegetationPreparation)return vegetationPreparation;
  vegetationPreparation=new Promise((resolve,reject)=>{
    vegetationWorkerPending={kind:'PLAN',resolve,reject};
    try{
      const workerUrl=new URL(import.meta.url);workerUrl.searchParams.set('hearthVegetationPlanner','1');
      const worker=vegetationWorker=new Worker(workerUrl,{type:'module'});
      worker.onerror=event=>failVegetationWorker(new Error(event.message||'GEN2515_VEGETATION_WORKER_FAILED'));
      worker.onmessageerror=()=>failVegetationWorker(new Error('GEN2515_VEGETATION_WORKER_MESSAGE_INVALID'));
      worker.onmessage=async event=>{
        const pending=vegetationWorkerPending,diagnostics=globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS;
        if(!pending||pending.receiving){failVegetationWorker(new Error('GEN2515_VEGETATION_WORKER_UNEXPECTED_MESSAGE'));return;}
        pending.receiving=true;
        const receivedAt=diagnostics?.performanceEnabled?performance.now():0;
        try{
          const data=event.data;
          if(data?.error)throw new Error(data.error.message||'GEN2515_VEGETATION_WORKER_FAILED');
          if(pending.kind==='PLAN'){
            if(data?.type!=='H_EARTH_QUALIFIED_VEGETATION_PREPARED')throw new Error('GEN2515_VEGETATION_WORKER_PLAN_INVALID');
            const plan=data.plan;
            if(plan?.eligible!==true||plan.contractId!=='H_EARTH_GEN2510_PLACEMENT_GROUNDED_RUN8D_GEOMETRY_v1'||!Array.isArray(plan.instances)||!Array.isArray(plan.batches)||plan.instances.length!==plan.instanceCount||plan.issues?.length!==0)throw new Error('GEN2515_VEGETATION_WORKER_PLAN_INVALID');
            if(diagnostics?.performanceEnabled)diagnostics.recordCost('WORKER_PLAN',data.durationMs);
            await freezeVegetationWorkerResult(plan);
            if(vegetationWorker!==worker)return;
            gen2515VegetationGroundedPlanCache=plan;
            const truth=getHEarthGen2515VegetationWorldTruthPlan();vegetationWorkerPending=null;pending.resolve(truth);
          }else{
            const batch=data.batch,descriptor=gen2515VegetationGroundedPlanCache.batches[vegetationWorkerNextBatch];
            const expectedIds=gen2515VegetationGroundedPlanCache.instances.slice(descriptor.start,descriptor.start+descriptor.count).map(instance=>instance.placementId);
            if(data?.type!=='H_EARTH_VEGETATION_BATCH_PREPARED'||data.batchId!==pending.batchId||batch?.batchId!==pending.batchId||batch.eligible!==true||batch.instanceCount!==descriptor.count||!Array.isArray(batch.placementIds)||batch.placementIds.length!==expectedIds.length||batch.placementIds.some((id,index)=>id!==expectedIds[index])||!Array.isArray(batch.primitives)||batch.issues?.length!==0)throw new Error('GEN2515_VEGETATION_WORKER_BATCH_INVALID');
            await freezeVegetationWorkerResult(batch);
            if(vegetationWorker!==worker)return;
            vegetationWorkerNextBatch++;vegetationWorkerPending=null;
            if(vegetationWorkerNextBatch===gen2515VegetationGroundedPlanCache.batches.length){worker.terminate();vegetationWorker=null;}
            pending.resolve(batch);
          }
        }catch(error){failVegetationWorker(error);}
        finally{if(diagnostics?.performanceEnabled)diagnostics.recordCost('WORKER_RECEIVE_FREEZE',performance.now()-receivedAt);}
      };
      worker.postMessage({type:'H_EARTH_PREPARE_QUALIFIED_VEGETATION'});
    }catch(error){failVegetationWorker(error);}
  });
  return vegetationPreparation;
}
export async function constructHEarthGen2515VegetationPresentationBatchAsync(batchId){
  await prepareHEarthGen2515VegetationWorldTruthPlan();
  if(vegetationWorkerFailure)throw vegetationWorkerFailure;
  if(vegetationWorkerPending)throw new Error('GEN2515_VEGETATION_WORKER_BATCH_IN_FLIGHT');
  const descriptor=gen2515VegetationGroundedPlanCache.batches[vegetationWorkerNextBatch];
  if(!vegetationWorker||descriptor?.batchId!==batchId)throw new Error('GEN2515_VEGETATION_WORKER_BATCH_ORDER_INVALID');
  return new Promise((resolve,reject)=>{
    vegetationWorkerPending={kind:'BATCH',batchId,resolve,reject};
    try{vegetationWorker.postMessage({type:'H_EARTH_PREPARE_VEGETATION_BATCH',batchId});}catch(error){failVegetationWorker(error);}
  });
}
function getGen2515VegetationGroundedPlan() {
  if (!gen2515VegetationGroundedPlanCache) gen2515VegetationGroundedPlanCache = startupMeasure('VEGETATION_GROUNDED_PLAN',()=>planHEarthGen2514GroundedVegetation());
  return gen2515VegetationGroundedPlanCache;
}
export function getHEarthGen2515VegetationWorldTruthPlan() {
  if (gen2515VegetationWorldTruthPlanCache) return gen2515VegetationWorldTruthPlanCache;
  const plan = getGen2515VegetationGroundedPlan();
  const issues = [...(plan.issues ?? [])];
  if (plan.eligible !== true) issues.push('GEN2515_GEOMETRY_PLAN_NOT_ELIGIBLE');
  const placementIds = freeze((plan.instances ?? []).map(instance => instance.placementId));
  const batches = freeze((plan.batches ?? []).map(batch => freeze({
    batchId: batch.batchId,
    start: batch.start,
    count: batch.count
  })));
  gen2515VegetationWorldTruthPlanCache = freeze({
    eligible: plan.eligible === true && issues.length === 0,
    contractId: plan.contractId,
    instanceCount: plan.instanceCount,
    placementIds,
    batches,
    maxInstancesPerMaterializationBatch: plan.performancePolicy?.maxInstancesPerMaterializationBatch ?? null,
    populationLimit: plan.performancePolicy?.populationLimit ?? null,
    droppedPlacementCount: plan.performancePolicy?.droppedPlacementCount ?? null,
    completeWorldPlacementCoverageRequired: plan.performancePolicy?.completeWorldPlacementCoverageRequired === true,
    partitionOrder: plan.performancePolicy?.partitionOrder ?? null,
    cameraIndependent: plan.performancePolicy?.cameraIndependent === true,
    lodOrVisibilitySelectionPerformed: plan.performancePolicy?.lodOrVisibilitySelectionPerformed === true,
    retainedGeometryPolicy: plan.performancePolicy?.retainedGeometryPolicy ?? null,
    issues: freeze(issues)
  });
  return gen2515VegetationWorldTruthPlanCache;
}
export function constructHEarthGen2515VegetationPresentationBatch(batchId) {
  const plan = getGen2515VegetationGroundedPlan();
  const issues = [...(plan.issues ?? [])];
  const built = constructHEarthGen2514GroundedVegetationBatch(plan, batchId);
  if (built.eligible !== true) issues.push(`GEN2515_BATCH_FAILED:${batchId}`, ...(built.issues ?? []));
  const regionalInstances = (built.instances ?? []).map(instance => freeze({
    sourcePopulationInstanceId: instance.sourcePopulationInstanceId,
    regionalEcology: gen2515RegionalEcology(instance, issues)
  }));
  const ecologyByPopulation = new Map(regionalInstances.map(instance => [
    instance.sourcePopulationInstanceId,
    instance.regionalEcology
  ]));
  const primitives = (built.instances ?? []).flatMap(instance => (instance.components ?? []).map(component => {
    const primitive = component.primitiveRecord;
    if (!primitive) {
      issues.push(`GEN2515_PRIMITIVE_MISSING:${instance.placementId}`);
      return null;
    }
    return freeze({
      ...primitive,
      metadata: freeze({
        ...primitive.metadata,
        run8DInstanceId: instance.instanceId,
        sourcePopulationInstanceId: instance.sourcePopulationInstanceId,
        gen2514PlacementId: instance.placementId,
        gen311RegionalEcology: ecologyByPopulation.get(instance.sourcePopulationInstanceId),
        gen311SuccessorVegetationContractId: H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID
      })
    });
  }).filter(Boolean));
  return freeze({
    eligible: plan.eligible === true && built.eligible === true && issues.length === 0,
    batchId,
    instanceCount: built.instanceCount ?? 0,
    placementIds: freeze((built.instances ?? []).map(instance => instance.placementId)),
    regionalInstances: freeze(regionalInstances),
    primitives: freeze(primitives),
    issues: freeze(issues),
    cameraIndependent: true,
    lodOrVisibilitySelectionPerformed: false
  });
}
export function buildHEarthRun8ENeutralPackage({cameraWorld=H_EARTH_FUNCTIONAL_LANDSCAPE_DEFAULT_CAMERA,deferVegetation=false}={}){
  const manifold=startupMeasure('BASE_WORLD_MANIFOLD',()=>previewHEarthFunctionalLandscape({cameraWorld})),issues=[];
  if(manifold?.ok!==true)issues.push(...(manifold?.issues??['RUN_8E_MANIFOLD_PREVIEW_INVALID']));
  if(manifold?.geographicIdentity?.playableRegion!=='GRATITUDE'||manifold?.geographicIdentity?.continentalContext!=='AUDRALIA'||manifold?.oceanFacingEmptinessPreserved!==true)issues.push('RUN_8E_GEOGRAPHIC_IDENTITY_INVALID');
  if(manifold?.oceanVisualContinuationMaterialized!==true)issues.push('RUN_8E_OCEAN_CONTINUATION_NOT_MATERIALIZED');
  if(manifold?.regionalDevelopment?.contractId==null)issues.push('GEN311_REGIONAL_DEVELOPMENT_PREVIEW_MISSING');
  const vegetationTruth=deferVegetation?null:startupMeasure('VEGETATION_WORLD_TRUTH',()=>getHEarthGen2515VegetationWorldTruthPlan());
  if(!deferVegetation&&vegetationTruth.eligible!==true)issues.push(...vegetationTruth.issues);
  const primitives=freeze([...(manifold?.primitives??[])]);
  const bounds=primitives.length?mergeHEarthGeometryBounds(primitives.map(p=>p.geometry.bounds)):null;
  if(!isHEarthAABB3D(bounds))issues.push('RUN_8E_NEUTRAL_PACKAGE_BOUNDS_INVALID');
  const ids=primitives.map(p=>p.primitiveId);
  if(new Set(ids).size!==ids.length)issues.push('RUN_8E_DUPLICATE_PRIMITIVE_ID');
  const regionalVegetation=deferVegetation?freeze({eligible:false,status:'PENDING_POST_READY_VALIDATION',contractId:H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID,instanceCount:null,instances:freeze([]),presentationSeparated:true,batchCount:null}):freeze({eligible:vegetationTruth.eligible===true,contractId:H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID,instanceCount:vegetationTruth.instanceCount,instances:freeze([]),source:'GEN2514_QUALIFIED_GEOMETRY_BOUNDED_PRESENTATION',presentationSeparated:true,batchCount:vegetationTruth.batches.length});
  return freeze({ok:issues.length===0,status:issues.length?'RUN_8E_WORLD_MANIFOLD_NEUTRAL_PACKAGE_FAILED':'RUN_8E_WORLD_MANIFOLD_NEUTRAL_PACKAGE_COMPLETE',contractId:H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID,gen311IntegrationContractId:H_EARTH_GEN311_RUN_8E_REGIONAL_INTEGRATION_CONTRACT_ID,compositionMode:'GRATITUDE_AUDRALIA_WORLD_MANIFOLD_GEN311_REGIONAL_ELABORATION',controllingRun8EContractId:H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,geographicIdentity:manifold?.geographicIdentity,regionalDevelopment:manifold?.regionalDevelopment,regionalVegetation,regionalEcologyPrimitiveCount:0,representationPlan:manifold?.representationPlan,worldManifoldUnion:manifold?.worldManifoldUnion,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,primitives,primitiveIds:freeze(ids),primitiveCount:primitives.length,terrainPrimitiveCount:manifold?.componentResults?.terrain?.primitive?1:0,shorelinePrimitiveCount:manifold?.componentResults?.shoreline?.primitives?.length??0,farRepresentationPrimitiveCount:(manifold?.componentResults?.distantContext?.primitives??[]).filter(p=>p?.metadata?.representationClass==='FAR').length,vegetationPrimitiveCount:0,vegetationWorldTruthInstanceCount:vegetationTruth?.instanceCount??null,...(deferVegetation?{vegetationAdmissionMode:'BASE_WORLD_ONLY'}:{}),vegetationPresentationSeparated:true,bounds,semanticAddressCount:manifold?.semanticAddressCount??0,semanticAddressIds:manifold?.semanticAddressIds??[],terrainAddressCount:manifold?.terrainAddressCount??0,terrainAddressIds:manifold?.terrainAddressIds??[],shorelineWaterAddressCount:manifold?.shorelineWaterAddressCount??0,shorelineWaterAddressIds:manifold?.shorelineWaterAddressIds??[],proxySummarizedAddressCount:manifold?.proxySummarizedAddressCount??0,proxySummarizedAddressIds:manifold?.proxySummarizedAddressIds??[],formationIds:canonical([...(manifold?.formationIds??[]),'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001']),shorelineBandIds:canonical((manifold?.componentResults?.shoreline?.primitives??[]).map(p=>p.metadata?.bandId)),oceanFacingEmptinessPreserved:true,oceanVisualContinuationMaterialized:true,oppositeShoreFabricationProhibited:true,legacyProxyIncluded:false,legacyProxyPreservedOutsideSuccessorFrame:false,successorMountainIncluded:true,continuousWorldManifold:manifold?.worldManifoldUnion?.valid===true,canonicalWorldFieldProtected:true,regionalEnvironmentMaterialized:true,admitted:false,WestAdmissionPerformed:false,packet002TransferPerformed:false,issues});
}
export function constructHEarthRun8ESuccessorEnvironmentFrame({camera,viewport={width:320,height:180,pixelRatio:1},timeOfDayHours=15.25,frameOccurrenceId='H_EARTH_RUN_8E_SUCCESSOR_FRAME_OCCURRENCE_001',transferOccurrenceId='H_EARTH_RUN_8E_PACKET_002_TRANSFER_OCCURRENCE_001'}={}){const issues=[],control=evaluateHEarthRun8EControlContract();if(control.eligible!==true)issues.push(...control.issues);if(!camera||![camera.position?.x,camera.position?.y,camera.position?.z,camera.target?.x,camera.target?.y,camera.target?.z].every(finite))issues.push('RUN_8E_CAMERA_INVALID');const neutralPackage=buildHEarthRun8ENeutralPackage({cameraWorld:camera?.position});if(neutralPackage.ok!==true)issues.push(...neutralPackage.issues);const westAdmission=issues.length===0?admitHEarthPrimitiveBatch(neutralPackage.primitives,{frameId:`${frameOccurrenceId}:WEST_AGGREGATE`,metadata:{successorProgram:'H_EARTH_RUN_8E_GEN311_REGIONAL',presentationMode:'GRATITUDE_AUDRALIA_WORLD_MANIFOLD_REGIONAL_ELABORATION'}}):null;const transfer=issues.length===0?buildHEarthRun8EPacket002SuccessorTransfer({neutralPackage,westBatchAdmissionResult:westAdmission,transferOccurrenceId}):null;if(transfer?.ok!==true||transfer?.contractId!==H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID)issues.push(...(transfer?.issues??['RUN_8E_PACKET_002_TRANSFER_FAILED']));const worldFarPlane=finite(camera?.farPlane)?camera.farPlane:RUN8C_PRESENTATION_DISTANCE_MAX,run8CPresentationFarPlane=Math.min(worldFarPlane,RUN8C_PRESENTATION_DISTANCE_MAX),presentation=issues.length===0?buildHEarthRun8CTerrainMaterialLightingPresentation({timeOfDayHours,cameraWorld:camera.position,viewportWidth:viewport.width,viewportHeight:viewport.height,cameraFarPlane:run8CPresentationFarPlane}):null,presentationEvaluation=presentation?evaluateHEarthRun8CTerrainMaterialLightingPresentation(presentation):{eligible:false,issues:['RUN_8E_RUN_8C_PRESENTATION_MISSING']};if(presentationEvaluation.eligible!==true)issues.push(...presentationEvaluation.issues);if(issues.length)return freeze({ok:false,status:'RUN_8E_WORLD_MANIFOLD_FRAME_REJECTED',contractId:H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,worldFarPlane,run8CPresentationFarPlane,issues});const terrainSourceId=presentation.sourcePrimitiveId,terrainPrimitive=transfer.admittedPrimitives.find(p=>p.primitiveId===terrainSourceId),colors=terrainTriangleColors(terrainPrimitive,presentation),primitives=transfer.admittedPrimitives.map(p=>decoratePrimitive(p,terrainSourceId,colors)),sky=presentation.skyGradientStops,farOceanCount=primitives.filter(p=>p.metadata?.run8ERenderClass==='FAR_OCEAN').length,farLandCount=primitives.filter(p=>p.metadata?.run8ERenderClass==='FAR_TERRAIN').length,regionalEcologyCount=primitives.filter(p=>p.metadata?.gen311RegionalEcology).length;if(farOceanCount!==1||farLandCount!==1)return freeze({ok:false,status:'RUN_8E_WORLD_MANIFOLD_FRAME_REJECTED',contractId:H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,worldFarPlane,run8CPresentationFarPlane,issues:['RUN_8E_RECIPROCAL_FAR_REPRESENTATION_INVALID']});return freeze({ok:true,status:'RUN_8E_WORLD_MANIFOLD_FRAME_COMPLETE',contractId:H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,gen311IntegrationContractId:H_EARTH_GEN311_RUN_8E_REGIONAL_INTEGRATION_CONTRACT_ID,frameId:frameOccurrenceId,frameOccurrenceId,revision:6,presentationMode:'GRATITUDE_AUDRALIA_WORLD_MANIFOLD_GEN311_REGIONAL_ELABORATION',geographicIdentity:neutralPackage.geographicIdentity,regionalDevelopment:neutralPackage.regionalDevelopment,regionalVegetation:neutralPackage.regionalVegetation,regionalEcologyPrimitiveCount:regionalEcologyCount,vegetationWorldTruthInstanceCount:neutralPackage.vegetationWorldTruthInstanceCount,vegetationPresentationSeparated:neutralPackage.vegetationPresentationSeparated,neutralPackage,westAdmission,transfer,packet002SuccessorTransferExecuted:true,representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,worldManifoldUnion:neutralPackage.worldManifoldUnion,primitiveCount:primitives.length,primitiveIds:primitives.map(p=>p.primitiveId),primitives,admittedPrimitives:primitives,bounds:transfer.bounds,camera:freeze({...camera}),viewport:freeze({...viewport}),worldFarPlane,run8CPresentationFarPlane,presentationDistanceDecoupledFromWorldEnvelope:worldFarPlane>run8CPresentationFarPlane,environment:freeze({skyTop:sky[0].rgba,skyHorizon:sky[sky.length-1].rgba,groundHaze:presentation.horizonHaze.rgba,skyGradientStops:sky,sunDisc:presentation.sunDisc,ownsSkyAuthority:true,singleSkyAuthority:true,climateIdentity:'WARM_SUBTROPICAL_COASTAL',atmosphericDepthContinuity:true,regionalEnvironmentalResponse:true}),run8CPresentation:presentation,visibility:freeze({visiblePrimitiveIds:primitives.map(p=>p.primitiveId),hiddenPrimitiveIds:[]}),terrainTriangleColorCount:colors.length,terrainOcclusionExecuted:true,sameWorldToCameraTransformForAllRepresentations:true,singlePhysicalDepthDomain:true,continuousWorldManifold:true,canonicalWorldFieldProtected:true,regionalEnvironmentMaterialized:true,oceanFacingEmptinessPreserved:true,oceanVisualContinuationMaterialized:true,farOceanPrimitiveCount:farOceanCount,farLandPrimitiveCount:farLandCount,oppositeShoreFabricationProhibited:true,legacyProxyIncluded:false,legacyProxyPreservedOutsideSuccessorFrame:false,rendererAuthorityCreated:false,cameraAuthorityCreated:false,publicRouteMutation:false,deployment:false,issues:[]});}
function applyColors(plan,frame){const map=new Map(frame.primitives.map(p=>[p.primitiveId,p])),triangles=plan.triangles.map(t=>{const p=map.get(t.primitiveId),rgba=p?.renderTriangleColors?.[t.sourceTriangleIndex]??p?.renderMaterial?.rgba??t.material.rgba;return freeze({...t,material:freeze({...t.material,rgba})});}),opaqueTriangles=triangles.filter(t=>t.material.transparencyClass!=='TRANSLUCENT'),translucentTriangles=triangles.filter(t=>t.material.transparencyClass==='TRANSLUCENT').sort((a,b)=>b.cameraDepth-a.cameraDepth);return freeze({...plan,triangles,opaqueTriangles,translucentTriangles,run8EWorldManifoldMaterialProjection:true,gen311RegionalEnvironmentProjection:true});}
export function prepareHEarthRun8ERenderPlan(frame,viewport){const base=prepareHEarthFunctionalLandscapeRenderPlan(frame,viewport);return base?.eligible===true?applyColors(base,frame):base;}
export function rasterizeHEarthRun8ERenderPlan(plan,frame){const base=rasterizeHEarthFunctionalLandscapePlan(plan);if(base?.ok!==true)return base;const rgba=new Uint8ClampedArray(base.rgba),depth=base.depth,stops=frame.environment.skyGradientStops;let skyPixelCount=0;for(let y=0;y<base.height;y++){const t=y/Math.max(1,base.height-1);let left=stops[0],right=stops[stops.length-1];for(let i=1;i<stops.length;i++)if(t<=stops[i].offset){left=stops[i-1];right=stops[i];break;}const span=Math.max(Number.EPSILON,right.offset-left.offset),a=Math.min(1,Math.max(0,(t-left.offset)/span)),color=[0,1,2,3].map(c=>mix(left.rgba[c],right.rgba[c],a));for(let x=0;x<base.width;x++){const p=y*base.width+x;if(depth[p]!==Number.POSITIVE_INFINITY)continue;const o=p*4;rgba[o]=color[0];rgba[o+1]=color[1];rgba[o+2]=color[2];rgba[o+3]=255;skyPixelCount++;}}return {...base,rgba,skyPixelCount,alphaClosed:true,singleSkyAuthorityMaterialized:true,singlePhysicalDepthDomainExecuted:true,worldManifoldRepresentationPlanExecuted:true,gen311RegionalEnvironmentProjection:true,oceanVisualContinuationMaterialized:frame.oceanVisualContinuationMaterialized===true};}
export function evaluateHEarthRun8EFrame(frame){const issues=[];if(frame?.ok!==true||frame?.contractId!==H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID)issues.push('RUN_8E_FRAME_INVALID');if(frame?.gen311IntegrationContractId!==H_EARTH_GEN311_RUN_8E_REGIONAL_INTEGRATION_CONTRACT_ID)issues.push('GEN311_RUN_8E_INTEGRATION_MISSING');if(frame?.transfer?.ok!==true||frame?.packet002SuccessorTransferExecuted!==true)issues.push('RUN_8E_TRANSFER_NOT_EXECUTED');if(frame?.geographicIdentity?.playableRegion!=='GRATITUDE'||frame?.geographicIdentity?.continentalContext!=='AUDRALIA'||frame?.geographicIdentity?.climate!=='WARM_SUBTROPICAL_COASTAL')issues.push('RUN_8E_GEOGRAPHIC_IDENTITY_NOT_PRESERVED');if(frame?.oceanFacingEmptinessPreserved!==true||frame?.oppositeShoreFabricationProhibited!==true)issues.push('RUN_8E_OCEAN_FACING_IDENTITY_INVALID');if(frame?.oceanVisualContinuationMaterialized!==true||frame?.farOceanPrimitiveCount!==1||frame?.farLandPrimitiveCount!==1)issues.push('RUN_8E_RECIPROCAL_WORLD_CONTINUATION_INVALID');if(frame?.representationPlanContractId!==H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID||frame?.topologySourceId!==H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID||frame?.continuousWorldManifold!==true||frame?.canonicalWorldFieldProtected!==true)issues.push('RUN_8E_WORLD_MANIFOLD_NOT_PRESERVED');if(frame?.regionalEnvironmentMaterialized!==true||frame?.vegetationPresentationSeparated!==true||!Number.isInteger(frame?.vegetationWorldTruthInstanceCount)||frame.vegetationWorldTruthInstanceCount<=0||!Number.isInteger(frame?.regionalEcologyPrimitiveCount)||frame.regionalEcologyPrimitiveCount<0)issues.push('GEN311_REGIONAL_ENVIRONMENT_NOT_MATERIALIZED');if(frame?.singlePhysicalDepthDomain!==true||frame?.terrainOcclusionExecuted!==true)issues.push('RUN_8E_DEPTH_DOMAIN_NOT_EXECUTED');if(frame?.environment?.singleSkyAuthority!==true||frame?.environment?.atmosphericDepthContinuity!==true)issues.push('RUN_8E_SKY_NOT_INTEGRATED');if(frame?.legacyProxyIncluded!==false)issues.push('RUN_8E_LEGACY_PROXY_DISPOSITION_INVALID');if(frame?.cameraAuthorityCreated!==false||frame?.rendererAuthorityCreated!==false||frame?.deployment!==false)issues.push('RUN_8E_AUTHORITY_BOUNDARY_VIOLATION');if(!finite(frame?.worldFarPlane)||!finite(frame?.run8CPresentationFarPlane)||frame.run8CPresentationFarPlane>RUN8C_PRESENTATION_DISTANCE_MAX||frame.run8CPresentationFarPlane>frame.worldFarPlane)issues.push('RUN_8E_PRESENTATION_DISTANCE_BOUNDARY_INVALID');return freeze({eligible:issues.length===0,status:issues.length?'RUN_8E_FRAME_FAIL':'RUN_8E_FRAME_PASS',issues});}
export default H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID;

// No alternate geometry implementation: worker calls the same synchronous constructor.
if(typeof DedicatedWorkerGlobalScope!=='undefined'&&globalThis instanceof DedicatedWorkerGlobalScope&&new URL(import.meta.url).searchParams.get('hearthVegetationPlanner')==='1'){
  let nextBatch=0,prepared=false;
  globalThis.addEventListener('message',event=>{
    try{
      if(event.data?.type==='H_EARTH_PREPARE_QUALIFIED_VEGETATION'){
        if(prepared)throw new Error('GEN2515_VEGETATION_WORKER_ALREADY_PREPARED');
        const startedAt=performance.now(),plan=getGen2515VegetationGroundedPlan();prepared=true;
        globalThis.postMessage({type:'H_EARTH_QUALIFIED_VEGETATION_PREPARED',plan,durationMs:performance.now()-startedAt});
      }else if(event.data?.type==='H_EARTH_PREPARE_VEGETATION_BATCH'){
        const descriptor=gen2515VegetationGroundedPlanCache?.batches[nextBatch];
        if(!prepared||descriptor?.batchId!==event.data.batchId)throw new Error('GEN2515_VEGETATION_WORKER_BATCH_ORDER_INVALID');
        const batch=constructHEarthGen2515VegetationPresentationBatch(event.data.batchId);nextBatch++;
        globalThis.postMessage({type:'H_EARTH_VEGETATION_BATCH_PREPARED',batchId:event.data.batchId,batch});
      }else throw new Error('GEN2515_VEGETATION_WORKER_REQUEST_INVALID');
    }catch(error){globalThis.postMessage({type:'H_EARTH_QUALIFIED_VEGETATION_FAILED',error:{name:error?.name,message:error?.message,stack:error?.stack}});globalThis.close();}
  });
}
