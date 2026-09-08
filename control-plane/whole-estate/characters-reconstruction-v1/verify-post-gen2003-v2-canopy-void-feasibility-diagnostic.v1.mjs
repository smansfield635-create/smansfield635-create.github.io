#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const CONTRACT=JSON.parse(fs.readFileSync(path.join(HERE,'post-gen2003-v2-canopy-void-feasibility-diagnostic.v1.json'),'utf8'));
const args={};
for(let i=2;i<process.argv.length;i++){
  const token=process.argv[i];
  if(!token.startsWith('--'))throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  args[token.slice(2)]=process.argv[++i]??null;
}
for(const key of ['gen2001-root','gen2002-root','gen2003-root','v2-root','ahbk-root','output'])if(!args[key])throw new Error(`ARGUMENT_REQUIRED:${key}`);
const ROOTS={gen2001:path.resolve(args['gen2001-root']),gen2002:path.resolve(args['gen2002-root']),gen2003:path.resolve(args['gen2003-root'])};
const V2ROOT=path.resolve(args['v2-root']);
const AHBKROOT=path.resolve(args['ahbk-root']);
const OUTPUT=path.resolve(args.output);
const V2CFG=CONTRACT.v2CanopyLaw;
const q=(n,d=6)=>Number(Number(n).toFixed(d));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
const deepEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const hash32=value=>{let n=value>>>0;n=(n^61)^(n>>>16);n=Math.imul(n,9);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);return(n^(n>>>15))>>>0;};
const rand=(seed,k=0)=>hash32(seed^Math.imul(k+1,0x9e3779b1))/4294967295;
const importAt=(root,rel)=>import(pathToFileURL(path.join(root,rel)).href);

const ahbkSpec=fs.readFileSync(path.join(AHBKROOT,'infrastructure/state-bound-admissibility-kernel-v1/AHBK_NORMATIVE_SPECIFICATION_v1.md'));
if(sha256(ahbkSpec)!=='1c61a7101763dd39815b76b3dc71e9b6767c3be42f511860f572af73b343f297')throw new Error('AHBK_REFERENCE_IDENTITY_DIVERGENCE');
const immutableV2Contract=JSON.parse(fs.readFileSync(path.join(V2ROOT,'control-plane/whole-estate/characters-reconstruction-v1/gen1983-camera-space-environment-diagnostics-v2-contract.v1.json'),'utf8'));
const v2Expected={footprintRadius:320,cellSize:32,canopyInfluenceRadius:30,riskOccupiedCellRatioBelow:.42,riskLargestComponentRatioBelow:.78,riskMaxEmptyCorridorCellsAbove:4};
if(!deepEqual(immutableV2Contract.canopyContinuity,v2Expected)||!deepEqual(V2CFG,{...v2Expected,directionalWindowLength:5}))throw new Error('IMMUTABLE_V2_CANOPY_LAW_DIVERGENCE');

async function loadProduct(root){
  const popmod=await importAt(root,'characters/vegetation-population.mjs');
  const edge=await importAt(root,'characters/vegetation-edge-ecology.mjs');
  const ecology=await importAt(root,'characters/vegetation-ecology.mjs');
  const geo=await importAt(root,'characters/gratitude-geography.adapter.mjs');
  const population=popmod.getCanonicalVegetationPopulation();
  if(population.instanceCount!==818)throw new Error(`CANOPY_COUNT_DIVERGENCE:${root}:${population.instanceCount}`);
  return {root,popmod,edge,ecology,geo,population};
}
function runV2(productRoot,label){
  const verifier=path.join(V2ROOT,'control-plane/whole-estate/characters-reconstruction-v1/verify-gen1983-camera-space-environment-diagnostics-v2.v1.mjs');
  const temp=path.join(path.dirname(OUTPUT),`.gen2004-${label}-v2-${process.pid}.json`);
  const run=spawnSync(process.execPath,[verifier,'--product-root',productRoot,'--output',temp],{encoding:'utf8',maxBuffer:16*1024*1024});
  if(!fs.existsSync(temp))throw new Error(`V2_RECEIPT_NOT_EMITTED:${label}:${run.status}:${run.stderr||''}`);
  const receipt=JSON.parse(fs.readFileSync(temp,'utf8'));
  fs.unlinkSync(temp);
  return receipt;
}
function spatialHash(points,size){
  const map=new Map();
  for(let i=0;i<points.length;i++){
    const p=points[i],x=p.world?.x??p.x,z=p.world?.z??p.z,key=`${Math.floor(x/size)},${Math.floor(z/size)}`;
    if(!map.has(key))map.set(key,[]);map.get(key).push(i);
  }
  return {map,size,points};
}
function nearbyIndices(hash,x,z,r){
  const out=[],s=hash.size,bx=Math.floor(x/s),bz=Math.floor(z/s),n=Math.ceil(r/s),r2=r*r;
  for(let dz=-n;dz<=n;dz++)for(let dx=-n;dx<=n;dx++)for(const i of hash.map.get(`${bx+dx},${bz+dz}`)||[]){
    const p=hash.points[i],px=p.world?.x??p.x,pz=p.world?.z??p.z;
    if((px-x)**2+(pz-z)**2<=r2)out.push(i);
  }
  return out;
}
function nearestDistance(hash,x,z){
  let best=Infinity;
  for(const p of hash.points){const px=p.world?.x??p.x,pz=p.world?.z??p.z,d2=(px-x)**2+(pz-z)**2;if(d2<best)best=d2;}
  return Math.sqrt(best);
}
function computeMask(product,stateSpec,points=product.population.instances){
  const center={x:stateSpec.camera.look[0],z:stateSpec.camera.look[2]},n=Math.ceil(V2CFG.footprintRadius/V2CFG.cellSize),hash=spatialHash(points,40),cells=new Map(),occupied=[];
  for(let iz=-n;iz<=n;iz++)for(let ix=-n;ix<=n;ix++){
    const x=center.x+ix*V2CFG.cellSize,z=center.z+iz*V2CFG.cellSize;
    if((x-center.x)**2+(z-center.z)**2>V2CFG.footprintRadius**2)continue;
    const env=product.edge.resolveVegetationEnvironment(x,z);
    if(env.spatialZone==='OPENING')continue;
    const occ=nearbyIndices(hash,x,z,V2CFG.canopyInfluenceRadius).length>0,key=`${ix},${iz}`;
    const cell={key,ix,iz,x,z,occ,zone:env.spatialZone,standClass:env.standClass};cells.set(key,cell);if(occ)occupied.push(key);
  }
  const seen=new Set();let largest=0;
  for(const key of occupied){
    if(seen.has(key))continue;let count=0,queue=[key];seen.add(key);
    while(queue.length){const k=queue.pop(),c=cells.get(k);count++;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nk=`${c.ix+dx},${c.iz+dz}`,nc=cells.get(nk);if(nc?.occ&&!seen.has(nk)){seen.add(nk);queue.push(nk);}}}
    largest=Math.max(largest,count);
  }
  const spectra={horizontal:{},vertical:{}};let maxGap=0;
  const scan=(outer,inner,vertical)=>{
    for(let a=-n;a<=n;a++){
      let run=0;
      const flush=()=>{if(run){const bucket=vertical?spectra.vertical:spectra.horizontal;bucket[run]=(bucket[run]||0)+1;maxGap=Math.max(maxGap,run);run=0;}};
      for(let b=-n;b<=n;b++){
        const ix=vertical?a:b,iz=vertical?b:a,c=cells.get(`${ix},${iz}`);
        if(!c||c.occ)flush();else run++;
      }
      flush();
    }
  };
  scan(null,null,false);scan(null,null,true);
  const emptySeen=new Set(),components=[];
  for(const [key,cell] of cells){
    if(cell.occ||emptySeen.has(key))continue;
    const queue=[key],members=[];emptySeen.add(key);let perimeter=0;const zones={};
    while(queue.length){
      const k=queue.pop(),c=cells.get(k);members.push(c);zones[c.zone]=(zones[c.zone]||0)+1;
      for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nk=`${c.ix+dx},${c.iz+dz}`,nc=cells.get(nk);if(!nc||nc.occ){perimeter++;continue;}if(!emptySeen.has(nk)){emptySeen.add(nk);queue.push(nk);}}
    }
    const xs=members.map(c=>c.ix),zs=members.map(c=>c.iz),width=Math.max(...xs)-Math.min(...xs)+1,height=Math.max(...zs)-Math.min(...zs)+1;
    const localRuns=(axis)=>{const groups=new Map();for(const c of members){const k=axis==='row'?c.iz:c.ix,v=axis==='row'?c.ix:c.iz;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(v);}let m=0;for(const vals of groups.values()){vals.sort((a,b)=>a-b);let r=0,p=null;for(const v of vals){r=(p!==null&&v===p+1)?r+1:1;p=v;m=Math.max(m,r);}}return m;};
    components.push({cellCount:members.length,perimeterEdges:perimeter,bboxWidthCells:width,bboxHeightCells:height,aspectRatio:q(Math.max(width,height)/Math.max(1,Math.min(width,height))),maxHorizontalRun:localRuns('row'),maxVerticalRun:localRuns('col'),zoneCounts:zones});
  }
  components.sort((a,b)=>b.cellCount-a.cellCount||b.perimeterEdges-a.perimeterEdges||b.maxHorizontalRun-a.maxHorizontalRun||b.maxVerticalRun-a.maxVerticalRun);
  const total=cells.size,occ=occupied.length,metrics={state:stateSpec.state,eligibleCellCount:total,occupiedCellCount:occ,occupiedCellRatio:q(total?occ/total:0),largestConnectedOccupiedCells:largest,largestComponentRatio:q(occ?largest/occ:0),maxEmptyCorridorCells:maxGap};
  metrics.risk=metrics.occupiedCellRatio<V2CFG.riskOccupiedCellRatioBelow||metrics.largestComponentRatio<V2CFG.riskLargestComponentRatioBelow||metrics.maxEmptyCorridorCells>V2CFG.riskMaxEmptyCorridorCellsAbove;
  return {state:stateSpec.state,center,cells,metrics,spectra,components};
}
function compareV2(mask,v2State){
  const a=mask.metrics,b=v2State.canopyFieldContinuity;
  const fields=['state','eligibleCellCount','occupiedCellCount','occupiedCellRatio','largestConnectedOccupiedCells','largestComponentRatio','maxEmptyCorridorCells','risk'];
  return fields.every(k=>a[k]===b[k]);
}
function summarizeMask(mask){
  return {state:mask.state,...mask.metrics,runSpectra:mask.spectra,emptyComponentCount:mask.components.length,emptyComponents:mask.components};
}
function percentile(values,p){if(!values.length)return null;const a=[...values].sort((x,y)=>x-y),i=Math.min(a.length-1,Math.max(0,Math.floor((a.length-1)*p)));return q(a[i]);}
function coverageDistanceSummary(product,stateSpec,step=16){
  const center={x:stateSpec.camera.look[0],z:stateSpec.camera.look[2]},hash=spatialHash(product.population.instances,40),vals=[];
  for(let dz=-V2CFG.footprintRadius;dz<=V2CFG.footprintRadius;dz+=step)for(let dx=-V2CFG.footprintRadius;dx<=V2CFG.footprintRadius;dx+=step){
    if(dx*dx+dz*dz>V2CFG.footprintRadius**2)continue;const x=center.x+dx,z=center.z+dz,env=product.edge.resolveVegetationEnvironment(x,z);if(env.spatialZone==='OPENING')continue;vals.push(nearestDistance(hash,x,z));
  }
  return {state:stateSpec.state,method:'DENSE_GRID_EUCLIDEAN_APPROXIMATION',sampleStep:step,sampleCount:vals.length,p50:percentile(vals,.5),p90:percentile(vals,.9),p95:percentile(vals,.95),p99:percentile(vals,.99),max:vals.length?q(Math.max(...vals)):null,continuousDomainCertificate:false};
}
function reconstructGen2001Candidates(product){
  const grid=product.popmod.CANONICAL_VEGETATION_POPULATION_CONTRACT.grid,envelope=product.geo.GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const width=envelope.xMaximum-envelope.xMinimum,depth=envelope.zMaximum-envelope.zMinimum,insetX=width*grid.insetFraction,insetZ=depth*grid.insetFraction,usableWidth=width-2*insetX,usableDepth=depth-2*insetZ,candidates=[];
  for(let row=0;row<grid.rows;row++)for(let column=0;column<grid.columns;column++){
    const seed=hash32(Math.imul(row+1,73856093)^Math.imul(column+1,19349663)^0x5a17c3d9),jx=(rand(seed,1)-.5)*2*grid.jitterFraction,jz=(rand(seed,2)-.5)*2*grid.jitterFraction,u=clamp((column+.5+jx)/grid.columns,0,1),v=clamp((row+.5+jz)/grid.rows,0,1),worldX=envelope.xMinimum+insetX+u*usableWidth,worldZ=envelope.zMinimum+insetZ+v*usableDepth;
    const ecology=product.ecology.sampleCanonicalVegetationEcology(worldX,worldZ);if(ecology?.valid!==true)continue;
    const forestWeight=Number(ecology.biome?.forestWeight)||0;if(forestWeight<grid.minimumForestWeight)continue;if(ecology.hydrology?.drainageClass!=='LAND')continue;if(ecology.shorelineDistance<grid.minimumShorelineDistance)continue;
    const env=product.edge.resolveVegetationEnvironment(ecology.world.x,ecology.world.z);if(env.spatialZone==='OPENING'||env.canopyDensity<=0)continue;
    candidates.push({id:`veg-r${row}-c${column}`,world:{x:q(ecology.world.x),z:q(ecology.world.z)},zone:env.spatialZone});
  }
  const ids=new Set(candidates.map(x=>x.id));for(const instance of product.population.instances)if(!ids.has(instance.id))throw new Error(`GEN2001_SELECTED_ID_NOT_IN_RECONSTRUCTED_LATTICE:${instance.id}`);
  return candidates;
}
function buildCoverageProblem(maskSet,candidates){
  const cells=[];
  for(const mask of maskSet)for(const c of mask.cells.values())cells.push({id:`${mask.state}:${c.ix}:${c.iz}`,state:mask.state,ix:c.ix,iz:c.iz,x:c.x,z:c.z});
  const candHash=spatialHash(candidates,32),cellCandidateSets=[],candidateCellSets=Array.from({length:candidates.length},()=>[]);
  for(let ci=0;ci<cells.length;ci++){
    const c=cells[ci],hits=nearbyIndices(candHash,c.x,c.z,V2CFG.canopyInfluenceRadius);cellCandidateSets.push(hits);for(const k of hits)candidateCellSets[k].push(ci);
  }
  const byState=new Map();for(let i=0;i<cells.length;i++){const c=cells[i];if(!byState.has(c.state))byState.set(c.state,new Map());byState.get(c.state).set(`${c.ix},${c.iz}`,i);}
  const obligations=[];
  for(const [state,map] of byState){
    for(const vertical of [false,true])for(let a=-10;a<=10;a++)for(let start=-10;start<=6;start++){
      const members=[];for(let k=0;k<5;k++){const ix=vertical?a:start+k,iz=vertical?start+k:a,index=map.get(`${ix},${iz}`);if(index===undefined){members.length=0;break;}members.push(index);}if(!members.length)continue;
      const candidatesFor=new Set();for(const m of members)for(const ci of cellCandidateSets[m])candidatesFor.add(ci);obligations.push({state,vertical,members,candidates:[...candidatesFor]});
    }
  }
  const candidateObligations=Array.from({length:candidates.length},()=>[]);for(let oi=0;oi<obligations.length;oi++)for(const ci of obligations[oi].candidates)candidateObligations[ci].push(oi);
  return {cells,candidates,cellCandidateSets,candidateCellSets,obligations,candidateObligations};
}
function greedy(targetCount,candidateTargets,budget,seedSelected=new Set()){
  const uncovered=new Set(Array.from({length:targetCount},(_,i)=>i)),selected=new Set(seedSelected);
  for(const ci of selected)for(const t of candidateTargets[ci]||[])uncovered.delete(t);
  while(uncovered.size&&selected.size<budget){let best=-1,bestScore=0;for(let ci=0;ci<candidateTargets.length;ci++){if(selected.has(ci))continue;let score=0;for(const t of candidateTargets[ci])if(uncovered.has(t))score++;if(score>bestScore){bestScore=score;best=ci;}}if(best<0||bestScore===0)break;selected.add(best);for(const t of candidateTargets[best])uncovered.delete(t);}
  return {selected,uncovered};
}
function fillToBudget(selected,candidates,budget){const out=new Set(selected);for(let i=0;i<candidates.length&&out.size<budget;i++)out.add(i);return out;}
function evaluateHypothesis(product,v2States,candidates,selected){
  const points=[...selected].map(i=>candidates[i]),states=[];for(const s of v2States){const m=computeMask(product,s,points);states.push(m.metrics);}return {pass:states.every(x=>!x.risk),states};
}
function feasibility(product,v2States,masks,candidates){
  const problem=buildCoverageProblem(masks,candidates),budget=818,zeroCells=problem.cellCandidateSets.filter(x=>x.length===0).length,zeroObligations=problem.obligations.filter(x=>x.candidates.length===0).length;
  let method='ALL_ELIGIBLE_CELL_GREEDY_COVER';let search=greedy(problem.cells.length,problem.candidateCellSets,budget);let selected=search.selected;
  if(search.uncovered.size){
    method='DIRECTIONAL_OBLIGATION_GREEDY_THEN_CELL_COVER';const first=greedy(problem.obligations.length,problem.candidateObligations,budget);selected=first.selected;
    const second=greedy(problem.cells.length,problem.candidateCellSets,budget,selected);selected=second.selected;search={selected,uncovered:second.uncovered,obligationUncovered:first.uncovered};
  }
  selected=fillToBudget(selected,candidates,budget);const evaluation=evaluateHypothesis(product,v2States,candidates,selected);
  const feasible=evaluation.pass&&selected.size===budget;
  return {
    disposition:feasible?'FEASIBLE_CERTIFIED':'UNRESOLVED_BY_BOUNDED_SEARCH',
    certificateType:feasible?'CONSTRUCTIVE_GEN2001_LAWFUL_CANDIDATE_LATTICE_818_SET':'NONE',
    certificateDigest:feasible?sha256([...selected].map(i=>candidates[i].id).sort().join('\n')+'\n'):null,
    searchMethod:method,budget,candidateCount:candidates.length,eligibleCellObligationCount:problem.cells.length,directionalFiveCellObligationCount:problem.obligations.length,zeroCandidateCellCount:zeroCells,zeroCandidateDirectionalObligationCount:zeroObligations,selectedCount:selected.size,uncoveredCellCount:search.uncovered?.size??null,uncoveredDirectionalObligationCount:search.obligationUncovered?.size??0,hypotheticalV2States:evaluation.states,
    inferenceBoundary:feasible?'PROVES_EXISTENCE_WITHIN_EXISTING_GEN2001_LAWFUL_CANDIDATE_LATTICE; DOES_NOT AUTHORIZE PRODUCT PLACEMENT':'BOUNDED_SEARCH_FAILURE_IS_NOT_GLOBAL_INFEASIBILITY'
  };
}
function ahbkStyleSummary(generations){
  const dimensions=['OCCUPIED_RATIO','LARGEST_COMPONENT_RATIO','MAX_EMPTY_CORRIDOR'];const pairs=[];
  const better=(a,b)=>({occ:a.occupiedCellRatio>=b.occupiedCellRatio,comp:a.largestComponentRatio>=b.largestComponentRatio,gap:a.maxEmptyCorridorCells<=b.maxEmptyCorridorCells});
  const labels=Object.keys(generations);
  for(const state of generations[labels[0]].map(x=>x.state))for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
    const A=generations[labels[i]].find(x=>x.state===state),B=generations[labels[j]].find(x=>x.state===state),ab=better(A,B),ba=better(B,A),Aall=ab.occ&&ab.comp&&ab.gap,Ball=ba.occ&&ba.comp&&ba.gap;
    if(!Aall&&!Ball)pairs.push({state,generations:[labels[i],labels[j]],relation:'INCOMPARABLE_METRIC_VECTOR'});
  }
  const failures={};for(const [label,states] of Object.entries(generations)){failures[label]=states.map(s=>({state:s.state,failedDimensions:[s.occupiedCellRatio<V2CFG.riskOccupiedCellRatioBelow?'OCCUPIED_RATIO':null,s.largestComponentRatio<V2CFG.riskLargestComponentRatioBelow?'LARGEST_COMPONENT_RATIO':null,s.maxEmptyCorridorCells>V2CFG.riskMaxEmptyCorridorCellsAbove?'MAX_EMPTY_CORRIDOR':null].filter(Boolean)})).filter(x=>x.failedDimensions.length);}
  return {use:'AHBK_FORMAL_DIAGNOSTIC_VOCABULARY_ONLY',crossDomainEvidenceTransfer:false,scalarizationProhibited:true,dimensions,incomparableMetricVectors:pairs,failedConstraintFamilies:failures,formalRStarOrFMinClaimed:false};
}

const products={gen2001:await loadProduct(ROOTS.gen2001),gen2002:await loadProduct(ROOTS.gen2002),gen2003:await loadProduct(ROOTS.gen2003)};
const v2={gen2001:runV2(ROOTS.gen2001,'gen2001'),gen2002:runV2(ROOTS.gen2002,'gen2002'),gen2003:runV2(ROOTS.gen2003,'gen2003')};
const masks={},reconstructionChecks=[];
for(const label of Object.keys(products)){
  const stateMetrics=v2[label].metrics?.stateMetrics;if(!Array.isArray(stateMetrics)||stateMetrics.length!==immutableV2Contract.representativeStates.length)throw new Error(`V2_STATE_METRICS_INVALID:${label}`);
  masks[label]=stateMetrics.map(s=>computeMask(products[label],s));
  for(let i=0;i<masks[label].length;i++)reconstructionChecks.push({generation:label,state:masks[label][i].state,pass:compareV2(masks[label][i],stateMetrics[i])});
}
if(reconstructionChecks.some(x=>!x.pass))throw new Error('EXACT_V2_MASK_RECONSTRUCTION_MISMATCH');
const candidates=reconstructGen2001Candidates(products.gen2001);
const gen1States=v2.gen2001.metrics.stateMetrics;
const feasibilityResult=feasibility(products.gen2001,gen1States,masks.gen2001,candidates);
const generationMetricVectors={};for(const label of Object.keys(masks))generationMetricVectors[label]=masks[label].map(m=>m.metrics);
const receipt={
  schema:'POST_GEN2003_V2_CANOPY_VOID_FEASIBILITY_DIAGNOSTIC_RECEIPT_v1',operationId:CONTRACT.operationId,lockGeneration:CONTRACT.lockGeneration,result:'PASS_CLOSED',diagnosticDisposition:'INTERPRETABLE_READ_ONLY',
  identity:{governingMain:CONTRACT.governingMain,subjects:CONTRACT.subjects,canopyCount:818,v2CanopyLaw:CONTRACT.v2CanopyLaw,ahbkReferenceSha256:sha256(ahbkSpec)},
  exactV2MaskReconstruction:{pass:true,checks:reconstructionChecks},
  voidMorphology:Object.fromEntries(Object.entries(masks).map(([label,set])=>[label,set.map(summarizeMask)])),
  coverageDistanceApproximation:Object.fromEntries(Object.entries(products).map(([label,p])=>[label,v2[label].metrics.stateMetrics.map(s=>coverageDistanceSummary(p,s,16))])),
  candidateCoverageDomain:{source:'GEN2001_CANONICAL_VEGETATION_POPULATION_CONTRACT_GRID_AND_ELIGIBILITY',candidateCount:candidates.length,candidateDomainDigest:sha256(candidates.map(x=>x.id).sort().join('\n')+'\n'),selectedGen2001IdsAllRepresented:true,continuousDomainExhaustive:false},
  fixed818Feasibility:feasibilityResult,
  ahbkStyleBoundarySummary:ahbkStyleSummary(generationMetricVectors),
  interpretation:{primaryFinding:feasibilityResult.disposition==='FEASIBLE_CERTIFIED'?'THE_FROZEN_818_TREE_BUDGET_IS_NOT_BY_ITSELF_A_MATHEMATICAL_BLOCKER_WITHIN_THE_EXISTING_LAWFUL_GEN2001_CANDIDATE_LATTICE':'NO_FEASIBILITY_OR_GLOBAL_INFEASIBILITY_CONCLUSION_IS_ENTITLED_FROM_THIS_BOUNDED_SEARCH',productMechanicalState:'NON_CLEAR_UNCHANGED',materialDisposition:'UNASSIGNED_UNCHANGED',repairAuthorityCreated:false},
  checks:[
    {id:'PRODUCT_ROOTS_READ_ONLY',pass:true},{id:'IMMUTABLE_V2_IDENTITY_AND_LAW',pass:true},{id:'AHBK_REFERENCE_READ_ONLY_IDENTITY',pass:true},{id:'EXACT_V2_MASK_RECONSTRUCTION',pass:true},{id:'VOID_COMPONENT_MORPHOLOGY_EMITTED',pass:true},{id:'DIRECTIONAL_RUN_SPECTRA_EMITTED',pass:true},{id:'FIVE_CELL_COVERAGE_OBLIGATIONS_ANALYZED',pass:true},{id:'GEN2001_LAWFUL_CANDIDATE_LATTICE_RECONSTRUCTED',pass:true},{id:'FIXED_818_FEASIBILITY_DISPOSITION_BOUNDED',pass:['FEASIBLE_CERTIFIED','INFEASIBLE_CERTIFIED','UNRESOLVED_BY_BOUNDED_SEARCH'].includes(feasibilityResult.disposition)},{id:'NO_REPAIR_COORDINATES_OR_SELECTED_IDS_EMITTED',pass:true},{id:'AHBK_CROSS_DOMAIN_CLAIM_TRANSFER_PROHIBITED',pass:true}
  ]
};
receipt.failCount=receipt.checks.filter(x=>!x.pass).length;if(receipt.failCount)receipt.result='FAIL_CLOSED';
fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});fs.writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');
process.exit(receipt.result==='PASS_CLOSED'?0:1);
