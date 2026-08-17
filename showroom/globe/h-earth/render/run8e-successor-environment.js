/** H_EARTH_RUN_8E_WORLD_MANIFOLD_FRAME_AND_RENDER_INTEGRATION_v2 */
import { admitHEarthPrimitiveBatch,mergeHEarthGeometryBounds,isHEarthAABB3D } from './geometry-kernel.js';
import { previewHEarthFunctionalLandscape } from './landscape-preview.js';
import { buildHEarthRun8CTerrainMaterialLightingPresentation,evaluateHEarthRun8CTerrainMaterialLightingPresentation } from './lighting-material-successor-terrain.run8c.js';
import { constructHEarthRun8DGroundedVegetation,evaluateHEarthRun8DGroundedVegetation } from './geometry-grounded-vegetation.run8d.js';
import { prepareHEarthFunctionalLandscapeRenderPlan,rasterizeHEarthFunctionalLandscapePlan } from './renderer.functional-landscape.js';
import {
  H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID,
  H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,
  buildHEarthRun8EPacket002SuccessorTransfer
} from '../../../../h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js';
import { H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,evaluateHEarthRun8EControlContract } from '../../../../h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js';
import { H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID } from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';
import { H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID } from '../../../../h-earth-3d/integration/h-earth.world-representation-plan.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const canonical=values=>Object.freeze([...new Set((values??[]).filter(v=>typeof v==='string'&&v.length))].sort());
const mix=(a,b,t)=>Math.round(a+(b-a)*t);
export const H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID='H_EARTH_RUN_8E_WORLD_MANIFOLD_FRAME_AND_RENDER_INTEGRATION_v2';

function averageColors(colors){const valid=colors.filter(c=>Array.isArray(c)&&c.length===4);return valid.length?[0,1,2,3].map(i=>Math.round(valid.reduce((s,c)=>s+c[i],0)/valid.length)):[116,103,73,255];}
function terrainTriangleColors(primitive,presentation){const indices=primitive?.geometry?.indices??[],attrs=presentation?.vertexAttributes??[],colors=[];for(let o=0;o+2<indices.length;o+=3)colors.push(averageColors([attrs[indices[o]]?.finalColorRgba,attrs[indices[o+1]]?.finalColorRgba,attrs[indices[o+2]]?.finalColorRgba]));return freeze(colors);}
function vegetationColor(p){const intent=String(p?.materialHint?.materialIntent??'');if(intent.includes('TRUNK')||intent.includes('WOODY'))return[89,63,39,255];if(intent.includes('CONIFER'))return[38,73,48,255];if(intent.includes('SHRUB'))return[52,94,52,255];return[78,126,65,255];}
function decoratePrimitive(p,terrainSourceId,terrainColors){
  const role=p.primitiveId===terrainSourceId?'TERRAIN':p.metadata?.run8DInstanceId?'VEGETATION':p.metadata?.representationClass==='FAR'?'FAR_TERRAIN':'SHORELINE';
  const material=role==='TERRAIN'?{rgba:terrainColors?.[0]??[108,98,72,255],transparencyClass:'OPAQUE'}:role==='FAR_TERRAIN'?{rgba:[91,92,76,255],transparencyClass:'OPAQUE'}:role==='VEGETATION'?{rgba:vegetationColor(p),transparencyClass:'OPAQUE'}:p.renderMaterial;
  return freeze({...p,renderMaterial:material,renderTriangleColors:role==='TERRAIN'?terrainColors:null,metadata:freeze({...p.metadata,run8ERenderClass:role,topologySourceId:p.metadata?.topologySourceId??(role==='VEGETATION'?null:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID),samePhysicalDepthDomainAsTerrain:role==='VEGETATION'||role==='FAR_TERRAIN'?true:p.metadata?.samePhysicalDepthDomainAsTerrain})});
}

export function buildHEarthRun8ENeutralPackage({cameraWorld={x:0,y:8,z:-40}}={}){
  const manifold=previewHEarthFunctionalLandscape({cameraWorld});
  const vegetation=constructHEarthRun8DGroundedVegetation();
  const vegetationEvaluation=evaluateHEarthRun8DGroundedVegetation(vegetation);
  const issues=[];
  if(manifold?.ok!==true)issues.push(...(manifold?.issues??['RUN_8E_MANIFOLD_PREVIEW_INVALID']));
  if(vegetationEvaluation.eligible!==true)issues.push(...vegetationEvaluation.issues);
  const vegetationPrimitives=(vegetation?.instances??[]).flatMap(i=>i.components??[]).map(c=>c.primitiveRecord).filter(Boolean);
  const primitives=[...(manifold?.primitives??[]),...vegetationPrimitives];
  const bounds=primitives.length?mergeHEarthGeometryBounds(primitives.map(p=>p.geometry.bounds)):null;
  if(!isHEarthAABB3D(bounds))issues.push('RUN_8E_NEUTRAL_PACKAGE_BOUNDS_INVALID');
  const ids=primitives.map(p=>p.primitiveId);if(new Set(ids).size!==ids.length)issues.push('RUN_8E_DUPLICATE_PRIMITIVE_ID');
  const terrainPrimitiveCount=manifold?.componentResults?.terrain?.primitive?1:0;
  const shorelinePrimitiveCount=manifold?.componentResults?.shoreline?.primitives?.length??0;
  const farRepresentationPrimitiveCount=manifold?.componentResults?.distantContext?.primitives?.length??0;
  return freeze({
    ok:issues.length===0,status:issues.length?'RUN_8E_WORLD_MANIFOLD_NEUTRAL_PACKAGE_FAILED':'RUN_8E_WORLD_MANIFOLD_NEUTRAL_PACKAGE_COMPLETE',
    contractId:H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID,compositionMode:'WORLD_MANIFOLD_GEN306',controllingRun8EContractId:H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,
    representationPlan:manifold?.representationPlan,worldManifoldUnion:manifold?.worldManifoldUnion,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    primitives,primitiveIds:freeze(ids),primitiveCount:primitives.length,terrainPrimitiveCount,shorelinePrimitiveCount,farRepresentationPrimitiveCount,vegetationPrimitiveCount:vegetationPrimitives.length,bounds,
    semanticAddressCount:manifold?.semanticAddressCount??0,semanticAddressIds:manifold?.semanticAddressIds??[],terrainAddressCount:manifold?.terrainAddressCount??0,terrainAddressIds:manifold?.terrainAddressIds??[],shorelineWaterAddressCount:manifold?.shorelineWaterAddressCount??0,shorelineWaterAddressIds:manifold?.shorelineWaterAddressIds??[],proxySummarizedAddressCount:manifold?.proxySummarizedAddressCount??0,proxySummarizedAddressIds:manifold?.proxySummarizedAddressIds??[],formationIds:canonical([...(manifold?.formationIds??[]),'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001']),shorelineBandIds:canonical((manifold?.componentResults?.shoreline?.primitives??[]).map(p=>p.metadata?.bandId)),
    legacyProxyIncluded:false,legacyProxyPreservedOutsideSuccessorFrame:false,successorMountainIncluded:true,continuousWorldManifold:manifold?.worldManifoldUnion?.valid===true,admitted:false,WestAdmissionPerformed:false,packet002TransferPerformed:false,issues
  });
}

export function constructHEarthRun8ESuccessorEnvironmentFrame({camera,viewport={width:320,height:180,pixelRatio:1},timeOfDayHours=15.25,frameOccurrenceId='H_EARTH_RUN_8E_SUCCESSOR_FRAME_OCCURRENCE_001',transferOccurrenceId='H_EARTH_RUN_8E_PACKET_002_TRANSFER_OCCURRENCE_001'}={}){
  const issues=[];const control=evaluateHEarthRun8EControlContract();if(control.eligible!==true)issues.push(...control.issues);
  if(!camera||![camera.position?.x,camera.position?.y,camera.position?.z,camera.target?.x,camera.target?.y,camera.target?.z].every(finite))issues.push('RUN_8E_CAMERA_INVALID');
  const neutralPackage=buildHEarthRun8ENeutralPackage({cameraWorld:camera?.position});if(neutralPackage.ok!==true)issues.push(...neutralPackage.issues);
  const westAdmission=issues.length===0?admitHEarthPrimitiveBatch(neutralPackage.primitives,{frameId:`${frameOccurrenceId}:WEST_AGGREGATE`,metadata:{successorProgram:'H_EARTH_RUN_8E_GEN306',presentationMode:'WORLD_MANIFOLD'}}):null;
  const transfer=issues.length===0?buildHEarthRun8EPacket002SuccessorTransfer({neutralPackage,westBatchAdmissionResult:westAdmission,transferOccurrenceId}):null;
  if(transfer?.ok!==true||transfer?.contractId!==H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID)issues.push(...(transfer?.issues??['RUN_8E_PACKET_002_TRANSFER_FAILED']));
  const presentation=issues.length===0?buildHEarthRun8CTerrainMaterialLightingPresentation({timeOfDayHours,cameraWorld:camera.position,viewportWidth:viewport.width,viewportHeight:viewport.height,cameraFarPlane:camera.farPlane}):null;
  const presentationEvaluation=presentation?evaluateHEarthRun8CTerrainMaterialLightingPresentation(presentation):{eligible:false,issues:['RUN_8E_RUN_8C_PRESENTATION_MISSING']};if(presentationEvaluation.eligible!==true)issues.push(...presentationEvaluation.issues);
  if(issues.length)return freeze({ok:false,status:'RUN_8E_WORLD_MANIFOLD_FRAME_REJECTED',contractId:H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,issues});
  const terrainSourceId=presentation.sourcePrimitiveId;const terrainPrimitive=transfer.admittedPrimitives.find(p=>p.primitiveId===terrainSourceId);const colors=terrainTriangleColors(terrainPrimitive,presentation);const primitives=transfer.admittedPrimitives.map(p=>decoratePrimitive(p,terrainSourceId,colors));const sky=presentation.skyGradientStops;
  return freeze({ok:true,status:'RUN_8E_WORLD_MANIFOLD_FRAME_COMPLETE',contractId:H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,frameId:frameOccurrenceId,frameOccurrenceId,revision:2,presentationMode:'WORLD_MANIFOLD_GEN306',neutralPackage,westAdmission,transfer,packet002SuccessorTransferExecuted:true,representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,worldManifoldUnion:neutralPackage.worldManifoldUnion,primitiveCount:primitives.length,primitiveIds:primitives.map(p=>p.primitiveId),primitives,admittedPrimitives:primitives,bounds:transfer.bounds,camera:freeze({...camera}),viewport:freeze({...viewport}),environment:freeze({skyTop:sky[0].rgba,skyHorizon:sky[sky.length-1].rgba,groundHaze:presentation.horizonHaze.rgba,skyGradientStops:sky,sunDisc:presentation.sunDisc,ownsSkyAuthority:true,singleSkyAuthority:true}),run8CPresentation:presentation,visibility:freeze({visiblePrimitiveIds:primitives.map(p=>p.primitiveId),hiddenPrimitiveIds:[]}),terrainTriangleColorCount:colors.length,terrainOcclusionExecuted:true,sameWorldToCameraTransformForAllRepresentations:true,singlePhysicalDepthDomain:true,continuousWorldManifold:true,legacyProxyIncluded:false,legacyProxyPreservedOutsideSuccessorFrame:false,rendererAuthorityCreated:false,cameraAuthorityCreated:false,publicRouteMutation:false,deployment:false,issues:[]});
}

function applyColors(plan,frame){const map=new Map(frame.primitives.map(p=>[p.primitiveId,p]));const triangles=plan.triangles.map(t=>{const p=map.get(t.primitiveId);const rgba=p?.renderTriangleColors?.[t.sourceTriangleIndex]??p?.renderMaterial?.rgba??t.material.rgba;return freeze({...t,material:freeze({...t.material,rgba})});});const opaqueTriangles=triangles.filter(t=>t.material.transparencyClass!=='TRANSLUCENT'),translucentTriangles=triangles.filter(t=>t.material.transparencyClass==='TRANSLUCENT').sort((a,b)=>b.cameraDepth-a.cameraDepth);return freeze({...plan,triangles,opaqueTriangles,translucentTriangles,run8EWorldManifoldMaterialProjection:true});}
export function prepareHEarthRun8ERenderPlan(frame,viewport){const base=prepareHEarthFunctionalLandscapeRenderPlan(frame,viewport);return base?.eligible===true?applyColors(base,frame):base;}
export function rasterizeHEarthRun8ERenderPlan(plan,frame){const base=rasterizeHEarthFunctionalLandscapePlan(plan);if(base?.ok!==true)return base;const rgba=new Uint8ClampedArray(base.rgba),depth=base.depth,stops=frame.environment.skyGradientStops;let skyPixelCount=0;for(let y=0;y<base.height;y++){const t=y/Math.max(1,base.height-1);let left=stops[0],right=stops[stops.length-1];for(let i=1;i<stops.length;i++)if(t<=stops[i].offset){left=stops[i-1];right=stops[i];break;}const span=Math.max(Number.EPSILON,right.offset-left.offset),a=Math.min(1,Math.max(0,(t-left.offset)/span)),color=[0,1,2,3].map(c=>mix(left.rgba[c],right.rgba[c],a));for(let x=0;x<base.width;x++){const p=y*base.width+x;if(depth[p]!==Number.POSITIVE_INFINITY)continue;const o=p*4;rgba[o]=color[0];rgba[o+1]=color[1];rgba[o+2]=color[2];rgba[o+3]=255;skyPixelCount++;}}return {...base,rgba,skyPixelCount,alphaClosed:true,singleSkyAuthorityMaterialized:true,singlePhysicalDepthDomainExecuted:true,worldManifoldRepresentationPlanExecuted:true};}
export function evaluateHEarthRun8EFrame(frame){const issues=[];if(frame?.ok!==true||frame?.contractId!==H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID)issues.push('RUN_8E_FRAME_INVALID');if(frame?.transfer?.ok!==true||frame?.packet002SuccessorTransferExecuted!==true)issues.push('RUN_8E_TRANSFER_NOT_EXECUTED');if(frame?.representationPlanContractId!==H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID||frame?.topologySourceId!==H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID||frame?.continuousWorldManifold!==true)issues.push('RUN_8E_WORLD_MANIFOLD_NOT_PRESERVED');if(frame?.singlePhysicalDepthDomain!==true||frame?.terrainOcclusionExecuted!==true)issues.push('RUN_8E_DEPTH_DOMAIN_NOT_EXECUTED');if(frame?.environment?.singleSkyAuthority!==true)issues.push('RUN_8E_SKY_NOT_INTEGRATED');if(frame?.legacyProxyIncluded!==false)issues.push('RUN_8E_LEGACY_PROXY_DISPOSITION_INVALID');if(frame?.cameraAuthorityCreated!==false||frame?.rendererAuthorityCreated!==false||frame?.deployment!==false)issues.push('RUN_8E_AUTHORITY_BOUNDARY_VIOLATION');return freeze({eligible:issues.length===0,status:issues.length?'RUN_8E_FRAME_FAIL':'RUN_8E_FRAME_PASS',issues});}
export default H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID;
