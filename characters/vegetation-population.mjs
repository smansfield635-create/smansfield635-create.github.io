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
  boundaryMeshWeight:1.35,
  bridgeChainSpacing:52,
  bridgeSwapBudget:192,
  redundancyRadius:72,
  pathBoundaryPreference:.18,
  pathTransitionPreference:.08
});
const STAND_RECORDS=new Map(getStandTopologySeeds().map(stand=>[stand.id,stand]));

export const CANONICAL_VEGETATION_POPULATION_CONTRACT=freeze({
  schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_CONTRACT_v1',
  operationId:'MIRRORLAND_POST_GEN2002_CANOPY_BRIDGE_CHAIN_REPAIR_20260908_001',
  stage:'GENERIC_STAND_ANCHORED_ELIGIBLE_PATH_BRIDGE_CHAIN_REPAIR',
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
  deterministicStandBackbone:true,
  deterministicEligiblePathBridgeChains:true,
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

const cellKey=(row,column)=>`${row},${column}`;
const worldDistance=(a,b)=>Math.hypot(a.ecology.world.x-b.ecology.world.x,a.ecology.world.z-b.ecology.world.z);
function candidateNeighbors(candidate,candidateByCell){
  const neighbors=[];
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(dr===0&&dc===0)continue;
    const other=candidateByCell.get(cellKey(candidate.lattice.row+dr,candidate.lattice.column+dc));
    if(other)neighbors.push(other);
  }
  return neighbors.sort((a,b)=>a.lattice.row-b.lattice.row||a.lattice.column-b.lattice.column||a.id.localeCompare(b.id));
}
function buildStandAnchors(candidates){
  const byStand=new Map();
  for(const candidate of candidates){
    if(!byStand.has(candidate.environment.standId))byStand.set(candidate.environment.standId,[]);
    byStand.get(candidate.environment.standId).push(candidate);
  }
  const anchors=[];
  for(const [standId,items] of [...byStand.entries()].sort((a,b)=>a[0].localeCompare(b[0]))){
    const stand=STAND_RECORDS.get(standId);
    if(!stand)continue;
    const anchor=[...items].sort((a,b)=>{
      const da=Math.hypot(a.ecology.world.x-stand.world.x,a.ecology.world.z-stand.world.z);
      const db=Math.hypot(b.ecology.world.x-stand.world.x,b.ecology.world.z-stand.world.z);
      return da-db||b.territorialScore-a.territorialScore||a.id.localeCompare(b.id);
    })[0];
    if(anchor)anchors.push({standId,candidate:anchor});
  }
  return anchors;
}
function buildStandBackbone(anchors){
  if(anchors.length<2)return [];
  const ordered=[...anchors].sort((a,b)=>a.standId.localeCompare(b.standId));
  const connected=new Set([ordered[0].standId]);
  const edges=[];
  while(connected.size<ordered.length){
    let best=null;
    for(const from of ordered){
      if(!connected.has(from.standId))continue;
      for(const to of ordered){
        if(connected.has(to.standId))continue;
        const distance=worldDistance(from.candidate,to.candidate);
        const key=`${from.standId}->${to.standId}`;
        if(!best||distance<best.distance||(distance===best.distance&&key<best.key))best={from,to,distance,key};
      }
    }
    if(!best)break;
    edges.push(best);
    connected.add(best.to.standId);
  }
  return edges;
}
class MinHeap{
  constructor(){this.items=[];}
  push(item){
    const a=this.items;a.push(item);let i=a.length-1;
    while(i>0){const p=(i-1)>>1;if(a[p].cost<item.cost||(a[p].cost===item.cost&&a[p].id<=item.id))break;a[i]=a[p];i=p;}
    a[i]=item;
  }
  pop(){
    const a=this.items;if(!a.length)return null;const root=a[0],tail=a.pop();if(a.length){let i=0;while(true){let l=i*2+1,r=l+1;if(l>=a.length)break;let c=r<a.length&&(a[r].cost<a[l].cost||(a[r].cost===a[l].cost&&a[r].id<a[l].id))?r:l;if(a[c].cost>tail.cost||(a[c].cost===tail.cost&&a[c].id>=tail.id))break;a[i]=a[c];i=c;}a[i]=tail;}return root;
  }
  get size(){return this.items.length;}
}
function pathStepCost(a,b){
  const distance=worldDistance(a,b);
  const boundary=(a.boundaryContinuityAffinity+b.boundaryContinuityAffinity)/2;
  const transition=(a.environment.spatialZone==='TRANSITION'||b.environment.spatialZone==='TRANSITION')?1:0;
  const preference=1+TOPOLOGY.pathBoundaryPreference*boundary+TOPOLOGY.pathTransitionPreference*transition;
  return distance/preference;
}
function shortestEligiblePath(start,end,candidateByCell){
  if(start.id===end.id)return [start];
  const heap=new MinHeap();
  const best=new Map([[start.id,0]]),previous=new Map();
  heap.push({id:start.id,candidate:start,cost:0});
  while(heap.size){
    const current=heap.pop();
    if(current.cost!==best.get(current.id))continue;
    if(current.id===end.id){
      const path=[];let id=end.id;
      while(id){const item=candidateByCell.get(id)||[start,end].find(x=>x.id===id);if(!item)break;path.push(item);id=previous.get(id);}
      return path.reverse();
    }
    for(const neighbor of candidateNeighbors(current.candidate,candidateByCell.byLattice)){
      const nextCost=current.cost+pathStepCost(current.candidate,neighbor);
      const prior=best.get(neighbor.id);
      if(prior===undefined||nextCost<prior-1e-9||(Math.abs(nextCost-prior)<=1e-9&&current.id<(previous.get(neighbor.id)||'~'))){
        best.set(neighbor.id,nextCost);previous.set(neighbor.id,current.id);heap.push({id:neighbor.id,candidate:neighbor,cost:nextCost});
      }
    }
  }
  return null;
}
function createCandidateIndexes(candidates){
  const byId=new Map(),byLattice=new Map();
  for(const candidate of candidates){byId.set(candidate.id,candidate);byLattice.set(cellKey(candidate.lattice.row,candidate.lattice.column),candidate);}
  byId.byLattice=byLattice;
  return byId;
}
function sampleBridgePath(path){
  if(!path?.length)return [];
  const sampled=[path[0]];let last=path[0];
  for(let i=1;i<path.length-1;i++){
    if(worldDistance(last,path[i])>=TOPOLOGY.bridgeChainSpacing){sampled.push(path[i]);last=path[i];}
  }
  if(path.length>1&&sampled[sampled.length-1].id!==path[path.length-1].id)sampled.push(path[path.length-1]);
  return sampled;
}
function centerOut(items){
  const result=[];if(!items.length)return result;
  let left=Math.floor((items.length-1)/2),right=left+1;
  while(left>=0||right<items.length){if(left>=0)result.push(items[left--]);if(right<items.length)result.push(items[right++]);}
  return result;
}
function redundancyScore(candidate,selected){
  const limit2=TOPOLOGY.redundancyRadius*TOPOLOGY.redundancyRadius;
  let neighbors=0,sameStand=0,nearest2=Infinity;
  for(const other of selected){
    if(other.id===candidate.id)continue;
    const dx=candidate.ecology.world.x-other.ecology.world.x,dz=candidate.ecology.world.z-other.ecology.world.z,d2=dx*dx+dz*dz;
    if(d2>limit2)continue;
    neighbors++;if(other.environment.standId===candidate.environment.standId)sameStand++;if(d2<nearest2)nearest2=d2;
  }
  if(!neighbors)return -Infinity;
  const proximity=Number.isFinite(nearest2)?clamp((TOPOLOGY.redundancyRadius-Math.sqrt(nearest2))/TOPOLOGY.redundancyRadius,0,1):0;
  const interior=candidate.environment.spatialZone==='INTERIOR'?.35:0;
  return quantize(neighbors*2+sameStand*.6+proximity+interior-candidate.boundaryContinuityAffinity*.5,12);
}
function refineBridgeChains(initialSelected,candidates){
  const indexes=createCandidateIndexes(candidates);
  const anchors=buildStandAnchors(candidates);
  const backbone=buildStandBackbone(anchors);
  const pathRecords=[];
  const bridgeChainIds=new Set();
  for(const edge of backbone){
    const path=shortestEligiblePath(edge.from.candidate,edge.to.candidate,indexes);
    if(!path?.length)continue;
    const sampled=sampleBridgePath(path);
    for(const candidate of sampled)bridgeChainIds.add(candidate.id);
    pathRecords.push({edge,sampled,pathLength:path.length});
  }
  const selectedIds=new Set(initialSelected.map(x=>x.id));
  const queues=pathRecords.map(record=>centerOut(record.sampled.filter(x=>!selectedIds.has(x.id))));
  const additions=[],additionIds=new Set();
  for(let round=0;additions.length<TOPOLOGY.bridgeSwapBudget;round++){
    let progressed=false;
    for(const queue of queues){
      const candidate=queue[round];
      if(!candidate||additionIds.has(candidate.id))continue;
      additions.push(candidate);additionIds.add(candidate.id);progressed=true;
      if(additions.length>=TOPOLOGY.bridgeSwapBudget)break;
    }
    if(!progressed)break;
  }
  const removalPool=initialSelected.filter(x=>!bridgeChainIds.has(x.id)).map(candidate=>({candidate,score:redundancyScore(candidate,initialSelected)})).filter(x=>Number.isFinite(x.score)).sort((a,b)=>b.score-a.score||a.candidate.territorialScore-b.candidate.territorialScore||a.candidate.id.localeCompare(b.candidate.id));
  const swapCount=Math.min(additions.length,removalPool.length);
  const usedAdditions=additions.slice(0,swapCount);
  const removals=removalPool.slice(0,swapCount);
  const removeIds=new Set(removals.map(x=>x.candidate.id));
  const selected=initialSelected.filter(x=>!removeIds.has(x.id));
  for(const candidate of usedAdditions)selected.push(candidate);
  if(selected.length!==GRID.exactTargetCount)throw new Error(`BRIDGE_CHAIN_BUDGET_DIVERGENCE:${selected.length}:${GRID.exactTargetCount}`);
  return {
    selected,
    anchorCount:anchors.length,
    backboneEdgeCount:backbone.length,
    pathCount:pathRecords.length,
    sampledChainMemberCount:bridgeChainIds.size,
    addedCount:usedAdditions.length,
    removedCount:removals.length,
    pathSummaries:pathRecords.map(record=>freeze({fromStandId:record.edge.from.standId,toStandId:record.edge.to.standId,pathLength:record.pathLength,sampledCount:record.sampled.length}))
  };
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
  const refinement=refineBridgeChains(allocation.selected,candidates);
  const selected=refinement.selected;
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
    selectionLaw:'EXACT_818_CANONICAL_ECOLOGY_ELIGIBLE_NON_OPENING_BOUNDARY_WEIGHTED_MESH_PLUS_STAND_ANCHORED_SHORTEST_ELIGIBLE_PATH_BRIDGE_CHAINS',
    meshSpacing:allocation.meshSpacing,meshRowAspect:TOPOLOGY.rowAspect,meshNodeCount:allocation.meshNodeCount,meshRoundCounts:freeze(allocation.roundCounts.map(x=>freeze({...x}))),
    bridgeChainAnchorCount:refinement.anchorCount,bridgeChainBackboneEdgeCount:refinement.backboneEdgeCount,bridgeChainPathCount:refinement.pathCount,
    bridgeChainSampledMemberCount:refinement.sampledChainMemberCount,bridgeChainAddedCount:refinement.addedCount,bridgeChainRemovedCount:refinement.removedCount,
    bridgeChainPathSummaries:freeze(refinement.pathSummaries),
    standCandidateCounts:freeze(standCandidateCounts),standSelectedCounts:freeze(standSelectedCounts),classCandidateCounts:freeze(classCandidateCounts),classSelectedCounts:freeze(classSelectedCounts),
    zoneCandidateCounts:freeze(zoneCandidateCounts),zoneSelectedCounts:freeze(zoneSelectedCounts),
    compositionFeatherCandidateCount:candidates.filter(x=>x.environment.compositionBand==='FEATHER').length,
    compositionFeatherSelectedCount:candidates.filter(x=>x.environment.compositionBand==='FEATHER'&&selectedIds.has(x.id)).length,
    compatibleInteriorCandidateCount:candidates.filter(x=>x.environment.spatialZone==='INTERIOR'&&x.environment.compositionBand==='NONE').length,
    compatibleInteriorSelectedCount:candidates.filter(x=>x.environment.spatialZone==='INTERIOR'&&x.environment.compositionBand==='NONE'&&selectedIds.has(x.id)).length,
    previousPositionSetImmutable:false,previousCoreConcentrationAuthoritySuperseded:true,deterministicTerritorialCellRoundRobin:false,deterministicAdaptiveConnectedMesh:true,
    deterministicStaggeredTwoDimensionalMesh:true,deterministicBoundaryContinuityWeightedMesh:true,deterministicStandBackbone:true,deterministicEligiblePathBridgeChains:true,
    canonicalHardOpeningsPreserved:true,deviceCameraDestinationInputsUsed:false,highResolutionCandidateCapacity:true,wetMarginCanopySuppression:true,territorialContinuityRepair:true
  });
  return freeze({schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_v1',operationId:CANONICAL_VEGETATION_POPULATION_CONTRACT.operationId,stage:CANONICAL_VEGETATION_POPULATION_CONTRACT.stage,frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,envelope:freeze({...envelope}),ecologyAuthority:VEGETATION_ECOLOGY_AUTHORITY.schema,organizationAuthority:'MIRRORLAND_EDGE_ECOLOGY_CONTRACT_v1',canonicalPopulation:true,standEdgeOrganized:true,deviceInvariant:true,cameraInvariant:true,representationAssigned:false,lodAssigned:false,fixedTargetCount:true,exactTargetCount:GRID.exactTargetCount,instanceCount:instances.length,diagnostics,instances:freeze(instances)});
}

export function buildCanonicalVegetationPopulation(){if(!cachedPopulation)cachedPopulation=createCanonicalPopulation();return cachedPopulation;}
export function getCanonicalVegetationPopulation(_presentationContext=undefined){return buildCanonicalVegetationPopulation();}
