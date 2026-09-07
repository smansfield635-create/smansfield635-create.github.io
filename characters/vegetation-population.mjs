import {GRATITUDE_DEVELOPMENT_FRAME} from './gratitude-geography.adapter.mjs';
import {
  VEGETATION_ECOLOGY_AUTHORITY,
  sampleCanonicalVegetationEcology
} from './vegetation-ecology.mjs';
import {resolveVegetationEnvironment} from './vegetation-edge-ecology.mjs';

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
  columns:60,
  rows:44,
  insetFraction:.025,
  jitterFraction:.34,
  minimumForestWeight:.08,
  minimumShorelineDistance:12,
  exactTargetCount:818,
  reservedEdgeCount:72,
  reservedTransitionCount:54,
  standMassExponent:2.35,
  standCoreScale:72,
  wetMarginSuppression:.34
});

export const CANONICAL_VEGETATION_POPULATION_CONTRACT=freeze({
  schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_CONTRACT_v1',
  operationId:'MIRRORLAND_STAND_TOPOLOGY_EDGE_ECOLOGY_NEGATIVE_SPACE_20260906_002',
  stage:'STAND_EDGE_ORGANIZED_CANONICAL_POPULATION',
  frameAuthority:'characters/gratitude-geography.adapter.mjs#GRATITUDE_DEVELOPMENT_FRAME',
  frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,
  ecologyAuthority:VEGETATION_ECOLOGY_AUTHORITY.schema,
  organizationAuthority:'MIRRORLAND_EDGE_ECOLOGY_CONTRACT_v1',
  geographyDeterminesEligibility:true,
  standCompositionDeterminesOrganization:true,
  rendererDeterminesRepresentation:true,
  populationIdentityDeviceInvariant:true,
  populationIdentityCameraInvariant:true,
  runtimeIdentityInputs:freeze([]),
  prohibitedIdentityInputs:freeze(['DEVICE_CLASS','VIEWPORT_CLASS','CAMERA_STATE','REDUCED_MOTION','LOD']),
  downstreamRepresentation:'MIRRORLAND_HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT_v1',
  previousPositionSetImmutable:false,
  exactPopulationBudget:GRID.exactTargetCount,
  grid:GRID,
  fixedTargetCount:true
});

const increment=(object,key)=>{object[key]=(object[key]||0)+1;};
const sortCandidates=(a,b)=>b.selectionScore-a.selectionScore||a.id.localeCompare(b.id);
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
  const ecologySupport=clamp(.46+.54*forestWeight,0,1);
  const stableVariation=.86+.14*rand(seed,3);
  const wetAffinity=wetMarginAffinity(ecology);
  const hydrologyCanopyFactor=1-GRID.wetMarginSuppression*wetAffinity;
  const selectionScore=environment.canopyDensity*ecologySupport*stableVariation*hydrologyCanopyFactor;
  const coreAffinity=clamp(environment.standBoundaryDistance/GRID.standCoreScale,0,1);
  const territorialScore=selectionScore*(.80+.48*coreAffinity);
  return {
    id:`veg-r${row}-c${column}`,
    lattice:{row,column,seed},
    ecology,
    environment,
    forestWeight,
    wetMarginAffinity:quantize(wetAffinity,12),
    selectionScore:quantize(selectionScore,12),
    territorialScore:quantize(territorialScore,12)
  };
}

function allocateStandLocalInterior(source,budget){
  if(budget<=0)return [];
  const byStand=new Map();
  for(const candidate of source){
    const id=candidate.environment.standId;
    if(!byStand.has(id))byStand.set(id,[]);
    byStand.get(id).push(candidate);
  }
  const rows=[...byStand.entries()].map(([standId,items])=>{
    const canopyDensity=clamp(Number(items[0]?.environment?.standProfile?.canopyDensity)||0,0,1);
    const weight=items.length*Math.pow(Math.max(.04,canopyDensity),GRID.standMassExponent);
    return {standId,items:items.sort(sortTerritorialCandidates),weight,quota:0,remainder:0};
  }).sort((a,b)=>a.standId.localeCompare(b.standId));

  let remaining=Math.min(budget,source.length);
  while(remaining>0){
    const available=rows.filter(row=>row.quota<row.items.length);
    if(!available.length)break;
    const totalWeight=available.reduce((sum,row)=>sum+row.weight,0);
    let floorAssigned=0;
    const shares=available.map(row=>{
      const exact=totalWeight>0?remaining*(row.weight/totalWeight):remaining/available.length;
      const capacity=row.items.length-row.quota;
      const base=Math.min(capacity,Math.floor(exact));
      row.quota+=base;
      floorAssigned+=base;
      row.remainder=exact-Math.floor(exact);
      return row;
    });
    remaining-=floorAssigned;
    if(remaining<=0)break;
    shares.sort((a,b)=>b.remainder-a.remainder||b.weight-a.weight||a.standId.localeCompare(b.standId));
    let remainderAssigned=0;
    for(const row of shares){
      if(remaining<=0)break;
      if(row.quota>=row.items.length)continue;
      row.quota++;
      remaining--;
      remainderAssigned++;
    }
    if(floorAssigned===0&&remainderAssigned===0)break;
  }

  const selected=[];
  for(const row of rows)selected.push(...row.items.slice(0,row.quota));
  return selected.slice(0,budget);
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
  if(candidates.length<GRID.exactTargetCount)throw new Error(`STAND_EDGE_CANOPY_UNDERFLOW:${candidates.length}:${GRID.exactTargetCount}`);

  const edge=candidates.filter(x=>x.environment.spatialZone==='EDGE').sort(sortCandidates);
  const transition=candidates.filter(x=>x.environment.spatialZone==='TRANSITION').sort(sortCandidates);
  const interior=candidates.filter(x=>x.environment.spatialZone==='INTERIOR');
  const selected=[];
  const selectedIds=new Set();
  const take=(source,count)=>{
    for(const item of source){
      if(selected.length>=GRID.exactTargetCount||count<=0)break;
      if(selectedIds.has(item.id))continue;
      selected.push(item);selectedIds.add(item.id);count--;
    }
  };
  take(edge,Math.min(GRID.reservedEdgeCount,edge.length));
  take(transition,Math.min(GRID.reservedTransitionCount,transition.length));
  const interiorBudget=GRID.exactTargetCount-selected.length;
  take(allocateStandLocalInterior(interior,interiorBudget),interiorBudget);
  if(selected.length<GRID.exactTargetCount){
    take([...edge,...transition,...interior].sort(sortTerritorialCandidates),GRID.exactTargetCount-selected.length);
  }
  if(selected.length!==GRID.exactTargetCount)throw new Error(`STAND_EDGE_CANOPY_TARGET_UNRESOLVED:${selected.length}:${GRID.exactTargetCount}`);

  const candidateById=new Map(candidates.map(x=>[x.id,x]));
  selected.sort((a,b)=>a.lattice.row-b.lattice.row||a.lattice.column-b.lattice.column);
  const instances=selected.map(candidate=>{
    const {ecology,environment}=candidate;
    return freeze({
      id:candidate.id,
      lattice:freeze({...candidate.lattice}),
      world:freeze({
        x:quantize(ecology.world.x),
        y:quantize(ecology.world.y),
        z:quantize(ecology.world.z)
      }),
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
  for(const candidate of candidates){
    increment(standCandidateCounts,candidate.environment.standId);
    increment(classCandidateCounts,candidate.environment.standClass);
    increment(zoneCandidateCounts,candidate.environment.spatialZone);
  }
  for(const instance of instances){
    increment(standSelectedCounts,instance.standId);
    increment(classSelectedCounts,instance.standClass);
    increment(zoneSelectedCounts,instance.spatialZone);
  }
  const compositionFeatherCandidates=candidates.filter(x=>x.environment.compositionBand==='FEATHER');
  const compatibleInteriorCandidates=candidates.filter(x=>x.environment.spatialZone==='INTERIOR'&&x.environment.compositionBand==='NONE');
  const selectedSet=new Set(instances.map(x=>x.id));
  const diagnostics=freeze({
    candidateCount:candidates.length,
    selectedCount:instances.length,
    rejectedEligibleCount:candidates.length-instances.length,
    selectionLaw:'EXACT_818_WITH_RESERVED_EDGE_TRANSITION_AND_STAND_LOCAL_WEIGHTED_INTERIOR_MASSING',
    standCandidateCounts:freeze(standCandidateCounts),
    standSelectedCounts:freeze(standSelectedCounts),
    classCandidateCounts:freeze(classCandidateCounts),
    classSelectedCounts:freeze(classSelectedCounts),
    zoneCandidateCounts:freeze(zoneCandidateCounts),
    zoneSelectedCounts:freeze(zoneSelectedCounts),
    compositionFeatherCandidateCount:compositionFeatherCandidates.length,
    compositionFeatherSelectedCount:compositionFeatherCandidates.filter(x=>selectedSet.has(x.id)).length,
    compatibleInteriorCandidateCount:compatibleInteriorCandidates.length,
    compatibleInteriorSelectedCount:compatibleInteriorCandidates.filter(x=>selectedSet.has(x.id)).length,
    previousPositionSetImmutable:false,
    previousGlobalSprinklingAuthoritySuperseded:true,
    standLocalInteriorAllocation:true,
    wetMarginCanopySuppression:true,
    candidateIdentityCount:candidateById.size
  });

  return freeze({
    schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_v1',
    operationId:CANONICAL_VEGETATION_POPULATION_CONTRACT.operationId,
    stage:CANONICAL_VEGETATION_POPULATION_CONTRACT.stage,
    frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,
    envelope:freeze({...envelope}),
    ecologyAuthority:VEGETATION_ECOLOGY_AUTHORITY.schema,
    organizationAuthority:'MIRRORLAND_EDGE_ECOLOGY_CONTRACT_v1',
    canonicalPopulation:true,
    standEdgeOrganized:true,
    deviceInvariant:true,
    cameraInvariant:true,
    representationAssigned:false,
    lodAssigned:false,
    fixedTargetCount:true,
    exactTargetCount:GRID.exactTargetCount,
    instanceCount:instances.length,
    diagnostics,
    instances:freeze(instances)
  });
}

export function buildCanonicalVegetationPopulation(){
  if(!cachedPopulation)cachedPopulation=createCanonicalPopulation();
  return cachedPopulation;
}

export function getCanonicalVegetationPopulation(_presentationContext=undefined){
  return buildCanonicalVegetationPopulation();
}
