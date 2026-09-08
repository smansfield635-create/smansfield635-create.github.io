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
const STAND_RECORDS=new Map(getStandTopologySeeds().map(stand=>[stand.id,stand]));

export const CANONICAL_VEGETATION_POPULATION_CONTRACT=freeze({
  schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_CONTRACT_v1',
  operationId:'MIRRORLAND_POST_GEN1992_ENVIRONMENT_MATERIAL_REPAIR_20260907_002',
  stage:'CONTIGUOUS_TERRITORIAL_CANOPY_ENVIRONMENT_REPAIR',
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
  fixedTargetCount:true,
  territorialContinuityRepair:true,
  deterministicTerritorialCellRoundRobin:true,
  deterministicMultiPassTerritorialSpacing:false,
  canonicalStandSeedCenteredAllocation:false,
  ecologyDerivedDominantForestCoreAllocation:false
});

const increment=(object,key)=>{object[key]=(object[key]||0)+1;};
const sortTerritorialCandidates=(a,b)=>b.territorialScore-a.territorialScore||b.selectionScore-a.selectionScore||a.id.localeCompare(b.id);

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
  const boundarySupport=clamp(environment.standBoundaryDistance/160,0,1);
  const territorialScore=selectionScore*(.72+.28*boundarySupport)*(.92+.16*forestWeight);
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
    selectionScore:quantize(selectionScore,12),
    territorialScore:quantize(territorialScore,12)
  };
}

function allocateTerritorialCoverage(candidates,budget){
  const buckets=new Map();
  for(const candidate of candidates){
    const cx=Math.floor(candidate.ecology.world.x/GRID.territorialCellSize);
    const cz=Math.floor(candidate.ecology.world.z/GRID.territorialCellSize);
    const key=`${cx},${cz}`;
    if(!buckets.has(key))buckets.set(key,{cx,cz,items:[]});
    buckets.get(key).items.push(candidate);
  }
  const cells=[...buckets.values()].map(cell=>({
    ...cell,
    rank:hash32(Math.imul(cell.cx,73856093)^Math.imul(cell.cz,19349663)^0x71c8e3d5),
    items:cell.items.sort(sortTerritorialCandidates)
  })).sort((a,b)=>a.rank-b.rank||a.cz-b.cz||a.cx-b.cx);
  const selected=[];
  const selectedIds=new Set();
  const roundCounts=[];
  for(let round=0;selected.length<budget;round++){
    let added=0;
    for(const cell of cells){
      if(selected.length>=budget)break;
      const candidate=cell.items[round];
      if(!candidate||selectedIds.has(candidate.id))continue;
      selected.push(candidate);
      selectedIds.add(candidate.id);
      added++;
    }
    roundCounts.push({round,added,total:selected.length});
    if(!added)break;
  }
  if(selected.length<budget){
    for(const candidate of [...candidates].sort(sortTerritorialCandidates)){
      if(selected.length>=budget)break;
      if(selectedIds.has(candidate.id))continue;
      selected.push(candidate);
      selectedIds.add(candidate.id);
    }
  }
  return {selected:selected.slice(0,budget),roundCounts,territorialCellCount:cells.length};
}

function createCanonicalPopulation(){
  const envelope=GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const width=envelope.xMaximum-envelope.xMinimum;
  const depth=envelope.zMaximum-envelope.zMinimum;
  const insetX=width*GRID.insetFraction;
  const insetZ=depth*GRID.insetFraction;
  const usableWidth=width-insetX*2;
  const usableDepth=depth-insetZ*2;
  const candidates=[];

  for(let row=0;row<GRID.rows;row++){
    for(let column=0;column<GRID.columns;column++){
      const candidate=createCandidate(row,column,envelope,insetX,insetZ,usableWidth,usableDepth);
      if(candidate)candidates.push(candidate);
    }
  }
  if(candidates.length<GRID.exactTargetCount)throw new Error(`TERRITORIAL_CANOPY_UNDERFLOW:${candidates.length}:${GRID.exactTargetCount}`);

  const allocation=allocateTerritorialCoverage(candidates,GRID.exactTargetCount);
  const selected=allocation.selected;
  if(selected.length!==GRID.exactTargetCount)throw new Error(`TERRITORIAL_CANOPY_TARGET_UNRESOLVED:${selected.length}:${GRID.exactTargetCount}`);

  selected.sort((a,b)=>a.lattice.row-b.lattice.row||a.lattice.column-b.lattice.column);
  const instances=selected.map(candidate=>{
    const {ecology,environment}=candidate;
    return freeze({
      id:candidate.id,
      lattice:freeze({...candidate.lattice}),
      world:freeze({x:quantize(ecology.world.x),y:quantize(ecology.world.y),z:quantize(ecology.world.z)}),
      forestWeight:quantize(candidate.forestWeight,12),
      biomeClass:ecology.biome.class,
      drainageClass:ecology.hydrology.drainageClass,
      materialProfile:ecology.materialProfile,
      slope:quantize(ecology.slope,12),
      slopeClass:ecology.slopeClass,
      shorelineDistance:quantize(ecology.shorelineDistance,6),
      standId:environment.standId,
      standClass:environment.standClass,
      spatialZone:environment.spatialZone,
      standSeedDistance:candidate.standSeedDistance,
      standCarryingCapacity:candidate.standCarryingCapacity,
      standBoundaryDistance:environment.standBoundaryDistance,
      canopyDensity:environment.canopyDensity,
      compositionTerritoryId:environment.compositionTerritoryId,
      compositionSiteId:environment.compositionSiteId,
      compositionBand:environment.compositionBand,
      wetMarginAffinity:candidate.wetMarginAffinity,
      selectionScore:candidate.selectionScore,
      territorialScore:candidate.territorialScore,
      organizationAuthority:environment.edgeEcologyAuthority,
      geographyAuthority:ecology.geographyAuthority,
      sourceContractId:ecology.sourceContractId
    });
  });

  const standCandidateCounts={},standSelectedCounts={},classCandidateCounts={},classSelectedCounts={};
  const zoneCandidateCounts={INTERIOR:0,EDGE:0,TRANSITION:0,OPENING:0};
  const zoneSelectedCounts={INTERIOR:0,EDGE:0,TRANSITION:0,OPENING:0};
  for(const candidate of candidates){increment(standCandidateCounts,candidate.environment.standId);increment(classCandidateCounts,candidate.environment.standClass);increment(zoneCandidateCounts,candidate.environment.spatialZone);}
  for(const instance of instances){increment(standSelectedCounts,instance.standId);increment(classSelectedCounts,instance.standClass);increment(zoneSelectedCounts,instance.spatialZone);}
  const selectedIds=new Set(instances.map(x=>x.id));
  const diagnostics=freeze({
    candidateCount:candidates.length,
    selectedCount:instances.length,
    rejectedEligibleCount:candidates.length-instances.length,
    selectionLaw:'EXACT_818_CANONICAL_ECOLOGY_ELIGIBLE_NON_OPENING_TERRITORIAL_CELL_ROUND_ROBIN',
    territorialCellSize:GRID.territorialCellSize,
    territorialCellCount:allocation.territorialCellCount,
    territorialRoundCounts:freeze(allocation.roundCounts.map(x=>freeze({...x}))),
    standCandidateCounts:freeze(standCandidateCounts),
    standSelectedCounts:freeze(standSelectedCounts),
    classCandidateCounts:freeze(classCandidateCounts),
    classSelectedCounts:freeze(classSelectedCounts),
    zoneCandidateCounts:freeze(zoneCandidateCounts),
    zoneSelectedCounts:freeze(zoneSelectedCounts),
    compositionFeatherCandidateCount:candidates.filter(x=>x.environment.compositionBand==='FEATHER').length,
    compositionFeatherSelectedCount:candidates.filter(x=>x.environment.compositionBand==='FEATHER'&&selectedIds.has(x.id)).length,
    compatibleInteriorCandidateCount:candidates.filter(x=>x.environment.spatialZone==='INTERIOR'&&x.environment.compositionBand==='NONE').length,
    compatibleInteriorSelectedCount:candidates.filter(x=>x.environment.spatialZone==='INTERIOR'&&x.environment.compositionBand==='NONE'&&selectedIds.has(x.id)).length,
    previousPositionSetImmutable:false,
    previousCoreConcentrationAuthoritySuperseded:true,
    deterministicTerritorialCellRoundRobin:true,
    deviceCameraDestinationInputsUsed:false,
    highResolutionCandidateCapacity:true,
    wetMarginCanopySuppression:true,
    territorialContinuityRepair:true
  });

  return freeze({schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_v1',operationId:CANONICAL_VEGETATION_POPULATION_CONTRACT.operationId,stage:CANONICAL_VEGETATION_POPULATION_CONTRACT.stage,frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,envelope:freeze({...envelope}),ecologyAuthority:VEGETATION_ECOLOGY_AUTHORITY.schema,organizationAuthority:'MIRRORLAND_EDGE_ECOLOGY_CONTRACT_v1',canonicalPopulation:true,standEdgeOrganized:true,deviceInvariant:true,cameraInvariant:true,representationAssigned:false,lodAssigned:false,fixedTargetCount:true,exactTargetCount:GRID.exactTargetCount,instanceCount:instances.length,diagnostics,instances:freeze(instances)});
}

export function buildCanonicalVegetationPopulation(){if(!cachedPopulation)cachedPopulation=createCanonicalPopulation();return cachedPopulation;}
export function getCanonicalVegetationPopulation(_presentationContext=undefined){return buildCanonicalVegetationPopulation();}
