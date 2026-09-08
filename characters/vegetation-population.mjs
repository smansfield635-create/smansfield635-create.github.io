import {GRATITUDE_DEVELOPMENT_FRAME} from './gratitude-geography.adapter.mjs';
import {
  VEGETATION_ECOLOGY_AUTHORITY,
  sampleCanonicalVegetationEcology
} from './vegetation-ecology.mjs';
import {resolveVegetationEnvironment} from './vegetation-edge-ecology.mjs';
import {getStandTopologySeeds} from './vegetation-stand-topology.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const quantize=(value,digits=6)=>Number(Number(value).toFixed(digits));
const hash32=value=>{
  let n=value>>>0;
  n=(n^61)^(n>>>16);
  n=Math.imul(n,9);
  n=n^(n>>>4);
  n=Math.imul(n,0x27d4eb2d);
  return (n^(n>>>15))>>>0;
};
const rand=(seed,k=0)=>hash32(seed^Math.imul(k+1,0x9e3779b1))/4294967295;

const GRID=freeze({
  columns:196,
  rows:147,
  insetFraction:.025,
  jitterFraction:.18,
  minimumForestWeight:.04,
  minimumShorelineDistance:6,
  exactTargetCount:818,
  territorialCellSize:80,
  wetMarginSuppression:.10
});
const TOPOLOGY=freeze({
  meshSpacingStart:64,
  meshSpacingEnd:136,
  meshSpacingStep:8,
  staggerFraction:.5,
  rowAspect:.866025403784,
  boundaryContinuityDistance:160,
  boundaryMeshWeight:1.35
});
const STAND_RECORDS=new Map(getStandTopologySeeds().map(stand=>[stand.id,stand]));

export const CANONICAL_VEGETATION_POPULATION_CONTRACT=freeze({
  schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_CONTRACT_v1',
  operationId:'MIRRORLAND_POST_GEN2000_ECOLOGICAL_RELATION_REPAIR_20260908_001',
  stage:'GENERIC_NON_OPENING_STAND_TRANSITION_CONTINUITY_REPAIR',
  frameAuthority:'characters/gratitude-geography.adapter.mjs#GRATITUDE_DEVELOPMENT_FRAME',
  frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,
  ecologyAuthority:VEGETATION_ECOLOGY_AUTHORITY.schema,
  organizationAuthority:'MIRRORLAND_EDGE_ECOLOGY_CONTRACT_v1',
  standSeedAuthority:'characters/vegetation-stand-topology.mjs#getStandTopologySeeds',
  geographyDeterminesEligibility:true,
  standCompositionDeterminesOrganization:true,
  rendererDeterminesRepresentation:true,
  populationIdentityDeviceInvariant:true,
  populationIdentityCameraInvariant:true,
  runtimeIdentityInputs:freeze([]),
  prohibitedIdentityInputs:freeze(['DEVICE_CLASS','VIEWPORT_CLASS','CAMERA_STATE','REDUCED_MOTION','LOD','DESTINATION_ID']),
  downstreamRepresentation:'MIRRORLAND_HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT_v1',
  previousPositionSetImmutable:false,
  exactPopulationBudget:GRID.exactTargetCount,
  grid:GRID,
  topology:TOPOLOGY,
  fixedTargetCount:true,
  territorialContinuityRepair:true,
  deterministicTerritorialCellRoundRobin:false,
  deterministicAdaptiveConnectedMesh:true,
  deterministicStaggeredTwoDimensionalMesh:true,
  deterministicBoundaryContinuityWeightedMesh:true,
  canonicalHardOpeningsPreserved:true,
  canonicalStandSeedCenteredAllocation:false,
  ecologyDerivedDominantForestCoreAllocation:false
});

const increment=(object,key)=>{object[key]=(object[key]||0)+1;};
const sortTerritorialCandidates=(a,b)=>b.territorialScore-a.territorialScore||a.id.localeCompare(b.id);
let cachedPopulation=null;

function wetMarginAffinity(ecology){
  const wet=Math.max(Number(ecology.hydrology?.riverWeight)||0,Number(ecology.hydrology?.lakeWeight)||0);
  const shore=Math.max(0,Number(ecology.shorelineDistance)||0);
  const slopeOk=['LEVEL','GENTLE','MODERATE'].includes(ecology.slopeClass);
  if(ecology.hydrology?.drainageClass!=='LAND'||!slopeOk)return 0;
  const wetSignal=clamp((wet-.06)/.30,0,1);
  const shoreSignal=clamp((260-shore)/180,0,1);
  return wetSignal*shoreSignal;
}
function standCarryingCapacity(stand){
  const forestWeight=clamp(Number(stand?.source?.forestWeight)||0,0,1);
  const shorelineDistance=Math.max(0,Number(stand?.source?.shorelineDistance)||0);
  const inlandContinuity=clamp(shorelineDistance/900,.2,1.2);
  return quantize(forestWeight*inlandContinuity,12);
}
function boundaryContinuityAffinity(environment){
  const distanceAffinity=clamp(1-(Number(environment.standBoundaryDistance)||0)/TOPOLOGY.boundaryContinuityDistance,0,1);
  const zoneAffinity=environment.spatialZone==='EDGE'?1:(environment.spatialZone==='TRANSITION'?.82:.18);
  return clamp(distanceAffinity*zoneAffinity,0,1);
}
function createCandidate(row,column,envelope,insetX,insetZ,usableWidth,usableDepth){
  const seed=hash32(Math.imul(row+1,73856093)^Math.imul(column+1,19349663)^0x5a17c3d9);
  const jitterX=(rand(seed,1)-.5)*2*GRID.jitterFraction;
  const jitterZ=(rand(seed,2)-.5)*2*GRID.jitterFraction;
  const u=clamp((column+.5+jitterX)/GRID.columns,0,1);
  const v=clamp((row+.5+jitterZ)/GRID.rows,0,1);
  const worldX=envelope.xMinimum+insetX+u*usableWidth;
  const worldZ=envelope.zMinimum+insetZ+v*usableDepth;
  const ecology=sampleCanonicalVegetationEcology(worldX,worldZ);
  if(ecology?.valid!==true)return null;
  const forestWeight=Number(ecology.biome?.forestWeight)||0;
  if(forestWeight<GRID.minimumForestWeight)return null;
  if(ecology.hydrology?.drainageClass!=='LAND')return null;
  if(ecology.shorelineDistance<GRID.minimumShorelineDistance)return null;
  const environment=resolveVegetationEnvironment(ecology.world.x,ecology.world.z);
  if(environment.spatialZone==='OPENING'||environment.canopyDensity<=0)return null;
  const standRecord=STAND_RECORDS.get(environment.standId);
  if(!standRecord)throw new Error(`STAND_SEED_MISSING:${environment.standId}`);
  const standSeed=standRecord.world;
  const standSeedDistance=Math.hypot(ecology.world.x-standSeed.x,ecology.world.z-standSeed.z);
  const carryingCapacity=standCarryingCapacity(standRecord);
  const ecologySupport=clamp(.46+.54*forestWeight,0,1);
  const stableVariation=.92+.08*rand(seed,3);
  const wetAffinity=wetMarginAffinity(ecology);
  const hydrologyCanopyFactor=1-GRID.wetMarginSuppression*wetAffinity;
  const selectionScore=environment.canopyDensity*ecologySupport*stableVariation*hydrologyCanopyFactor;
  const continuityAffinity=boundaryContinuityAffinity(environment);
  const territorialScore=selectionScore*(.88+.30*continuityAffinity)*(.92+.16*forestWeight);
  return {
    id:`veg-r${row}-c${column}`,
    lattice:{row,column,seed},
    ecology,
    environment,
    standSeed,
    standSeedDistance:quantize(standSeedDistance,6),
    standCarryingCapacity:carryingCapacity,
    forestWeight,
    wetMarginAffinity:quantize(wetAffinity,12),
    boundaryContinuityAffinity:quantize(continuityAffinity,12),
    selectionScore:quantize(selectionScore,12),
    territorialScore:quantize(territorialScore,12)
  };
}

function nearestStaggeredTarget(candidate,spacing){
  const rowStep=spacing*TOPOLOGY.rowAspect;
  const z=candidate.ecology.world.z,x=candidate.ecology.world.x;
  const row=Math.round(z/rowStep);
  const offset=(Math.abs(row)%2)*spacing*TOPOLOGY.staggerFraction;
  const column=Math.round((x-offset)/spacing);
  const target={x:column*spacing+offset,z:row*rowStep};
  return {...target,distance2:(x-target.x)**2+(z-target.z)**2,row,column};
}
function meshCandidate(candidate,target,spacing){
  const normalizedDistance2=target.distance2/(spacing*spacing);
  const meshTargetCost=normalizedDistance2/(1+TOPOLOGY.boundaryMeshWeight*candidate.boundaryContinuityAffinity);
  return {...candidate,meshTargetDistance2:target.distance2,meshTargetCost:quantize(meshTargetCost,12)};
}
function buildMeshNodes(candidates,spacing){
  const nodes=new Map();
  for(const candidate of candidates){
    const target=nearestStaggeredTarget(candidate,spacing);
    const key=`${target.row},${target.column}`;
    if(!nodes.has(key))nodes.set(key,{key,target:{x:target.x,z:target.z,row:target.row,column:target.column},items:[]});
    nodes.get(key).items.push(meshCandidate(candidate,target,spacing));
  }
  return [...nodes.values()].map(node=>({
    ...node,
    rank:hash32(Math.imul(node.target.row,73856093)^Math.imul(node.target.column,19349663)^0x4c53a91d),
    items:node.items.sort((a,b)=>a.meshTargetCost-b.meshTargetCost||a.meshTargetDistance2-b.meshTargetDistance2||sortTerritorialCandidates(a,b))
  })).sort((a,b)=>a.target.row-b.target.row||a.target.column-b.target.column||a.rank-b.rank);
}
function allocateConnectedMesh(candidates,budget){
  let nodes=null,meshSpacing=TOPOLOGY.meshSpacingEnd;
  for(let spacing=TOPOLOGY.meshSpacingStart;spacing<=TOPOLOGY.meshSpacingEnd;spacing+=TOPOLOGY.meshSpacingStep){
    const candidateNodes=buildMeshNodes(candidates,spacing);
    nodes=candidateNodes;meshSpacing=spacing;
    if(candidateNodes.length<=budget)break;
  }
  const selected=[],selectedIds=new Set(),roundCounts=[];
  for(let round=0;selected.length<budget;round++){
    let added=0;
    for(const node of nodes){
      if(selected.length>=budget)break;
      const candidate=node.items[round];
      if(!candidate||selectedIds.has(candidate.id))continue;
      selected.push(candidate);selectedIds.add(candidate.id);added++;
    }
    roundCounts.push({round,added,total:selected.length});
    if(!added)break;
  }
  if(selected.length<budget){
    const fallback=[...candidates].filter(x=>!selectedIds.has(x.id)).map(candidate=>{
      const target=nearestStaggeredTarget(candidate,meshSpacing);
      return meshCandidate(candidate,target,meshSpacing);
    }).sort((a,b)=>a.meshTargetCost-b.meshTargetCost||a.meshTargetDistance2-b.meshTargetDistance2||sortTerritorialCandidates(a,b));
    for(const candidate of fallback){if(selected.length>=budget)break;selected.push(candidate);selectedIds.add(candidate.id);}
  }
  return {selected:selected.slice(0,budget),roundCounts,meshSpacing,meshNodeCount:nodes.length};
}

function createCanonicalPopulation(){
  const envelope=GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const width=envelope.xMaximum-envelope.xMinimum,depth=envelope.zMaximum-envelope.zMinimum;
  const insetX=width*GRID.insetFraction,insetZ=depth*GRID.insetFraction;
  const usableWidth=width-insetX*2,usableDepth=depth-insetZ*2;
  const candidates=[];
  for(let row=0;row<GRID.rows;row++)for(let column=0;column<GRID.columns;column++){
    const candidate=createCandidate(row,column,envelope,insetX,insetZ,usableWidth,usableDepth);
    if(candidate)candidates.push(candidate);
  }
  if(candidates.length<GRID.exactTargetCount)throw new Error(`TERRITORIAL_CANOPY_UNDERFLOW:${candidates.length}:${GRID.exactTargetCount}`);
  const allocation=allocateConnectedMesh(candidates,GRID.exactTargetCount);
  const selected=allocation.selected;
  if(selected.length!==GRID.exactTargetCount)throw new Error(`CONNECTED_CANOPY_TARGET_UNRESOLVED:${selected.length}:${GRID.exactTargetCount}`);
  selected.sort((a,b)=>a.lattice.row-b.lattice.row||a.lattice.column-b.lattice.column);
  const instances=selected.map(candidate=>{
    const {ecology,environment}=candidate;
    return freeze({
      id:candidate.id,lattice:freeze({...candidate.lattice}),world:freeze({x:quantize(ecology.world.x),y:quantize(ecology.world.y),z:quantize(ecology.world.z)}),
      forestWeight:quantize(candidate.forestWeight,12),biomeClass:ecology.biome.class,drainageClass:ecology.hydrology.drainageClass,materialProfile:ecology.materialProfile,
      slope:quantize(ecology.slope,12),slopeClass:ecology.slopeClass,shorelineDistance:quantize(ecology.shorelineDistance,6),standId:environment.standId,standClass:environment.standClass,
      spatialZone:environment.spatialZone,standSeedDistance:candidate.standSeedDistance,standCarryingCapacity:candidate.standCarryingCapacity,standBoundaryDistance:environment.standBoundaryDistance,
      canopyDensity:environment.canopyDensity,compositionTerritoryId:environment.compositionTerritoryId,compositionSiteId:environment.compositionSiteId,compositionBand:environment.compositionBand,
      wetMarginAffinity:candidate.wetMarginAffinity,boundaryContinuityAffinity:candidate.boundaryContinuityAffinity,selectionScore:candidate.selectionScore,territorialScore:candidate.territorialScore,
      organizationAuthority:environment.edgeEcologyAuthority,geographyAuthority:ecology.geographyAuthority,sourceContractId:ecology.sourceContractId
    });
  });
  const standCandidateCounts={},standSelectedCounts={},classCandidateCounts={},classSelectedCounts={};
  const zoneCandidateCounts={INTERIOR:0,EDGE:0,TRANSITION:0,OPENING:0},zoneSelectedCounts={INTERIOR:0,EDGE:0,TRANSITION:0,OPENING:0};
  for(const candidate of candidates){increment(standCandidateCounts,candidate.environment.standId);increment(classCandidateCounts,candidate.environment.standClass);increment(zoneCandidateCounts,candidate.environment.spatialZone);}
  for(const instance of instances){increment(standSelectedCounts,instance.standId);increment(classSelectedCounts,instance.standClass);increment(zoneSelectedCounts,instance.spatialZone);}
  const selectedIds=new Set(instances.map(x=>x.id));
  const diagnostics=freeze({
    candidateCount:candidates.length,selectedCount:instances.length,rejectedEligibleCount:candidates.length-instances.length,
    selectionLaw:'EXACT_818_CANONICAL_ECOLOGY_ELIGIBLE_NON_OPENING_BOUNDARY_WEIGHTED_ADAPTIVE_STAGGERED_2D_WORLD_MESH',
    meshSpacing:allocation.meshSpacing,meshRowAspect:TOPOLOGY.rowAspect,meshNodeCount:allocation.meshNodeCount,meshRoundCounts:freeze(allocation.roundCounts.map(x=>freeze({...x}))),
    standCandidateCounts:freeze(standCandidateCounts),standSelectedCounts:freeze(standSelectedCounts),classCandidateCounts:freeze(classCandidateCounts),classSelectedCounts:freeze(classSelectedCounts),
    zoneCandidateCounts:freeze(zoneCandidateCounts),zoneSelectedCounts:freeze(zoneSelectedCounts),
    compositionFeatherCandidateCount:candidates.filter(x=>x.environment.compositionBand==='FEATHER').length,
    compositionFeatherSelectedCount:candidates.filter(x=>x.environment.compositionBand==='FEATHER'&&selectedIds.has(x.id)).length,
    compatibleInteriorCandidateCount:candidates.filter(x=>x.environment.spatialZone==='INTERIOR'&&x.environment.compositionBand==='NONE').length,
    compatibleInteriorSelectedCount:candidates.filter(x=>x.environment.spatialZone==='INTERIOR'&&x.environment.compositionBand==='NONE'&&selectedIds.has(x.id)).length,
    previousPositionSetImmutable:false,previousCoreConcentrationAuthoritySuperseded:true,deterministicTerritorialCellRoundRobin:false,deterministicAdaptiveConnectedMesh:true,
    deterministicStaggeredTwoDimensionalMesh:true,deterministicBoundaryContinuityWeightedMesh:true,canonicalHardOpeningsPreserved:true,
    deviceCameraDestinationInputsUsed:false,highResolutionCandidateCapacity:true,wetMarginCanopySuppression:true,territorialContinuityRepair:true
  });
  return freeze({schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_v1',operationId:CANONICAL_VEGETATION_POPULATION_CONTRACT.operationId,stage:CANONICAL_VEGETATION_POPULATION_CONTRACT.stage,frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,envelope:freeze({...envelope}),ecologyAuthority:VEGETATION_ECOLOGY_AUTHORITY.schema,organizationAuthority:'MIRRORLAND_EDGE_ECOLOGY_CONTRACT_v1',canonicalPopulation:true,standEdgeOrganized:true,deviceInvariant:true,cameraInvariant:true,representationAssigned:false,lodAssigned:false,fixedTargetCount:true,exactTargetCount:GRID.exactTargetCount,instanceCount:instances.length,diagnostics,instances:freeze(instances)});
}

export function buildCanonicalVegetationPopulation(){if(!cachedPopulation)cachedPopulation=createCanonicalPopulation();return cachedPopulation;}
export function getCanonicalVegetationPopulation(_presentationContext=undefined){return buildCanonicalVegetationPopulation();}
