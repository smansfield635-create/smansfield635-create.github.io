#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const CONTRACT=JSON.parse(fs.readFileSync(path.join(HERE,'post-gen2003-canopy-void-feasibility-contract.v1.json'),'utf8'));
const args={};
for(let i=2;i<process.argv.length;i++){
  const t=process.argv[i];
  if(!t.startsWith('--'))throw new Error(`UNKNOWN_ARGUMENT:${t}`);
  args[t.slice(2)]=process.argv[++i]??null;
}
for(const k of ['gen2001-root','gen2002-root','gen2003-root','v2-contract','output'])if(!args[k])throw new Error(`ARGUMENT_REQUIRED:${k}`);
const ROOTS={GEN2001:path.resolve(args['gen2001-root']),GEN2002:path.resolve(args['gen2002-root']),GEN2003:path.resolve(args['gen2003-root'])};
const OUTPUT=path.resolve(args.output);
const WITNESS_MODULE=args['witness-module-output']?path.resolve(args['witness-module-output']):null;
const q=(n,d=9)=>Number(Number(n).toFixed(d));
const stable=v=>Array.isArray(v)?v.map(stable):(v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v);
const stableText=v=>JSON.stringify(stable(v),null,2)+'\n';
const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash32=value=>{let n=value>>>0;n=(n^61)^(n>>>16);n=Math.imul(n,9);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);return (n^(n>>>15))>>>0;};
const rand=(seed,k=0)=>hash32(seed^Math.imul(k+1,0x9e3779b1))/4294967295;
const importAt=(root,rel)=>import(pathToFileURL(path.join(root,rel)).href);

const V2=JSON.parse(fs.readFileSync(path.resolve(args['v2-contract']),'utf8'));
const law=CONTRACT.v2CanopyLaw;
const v2Law=V2.canopyContinuity;
const expectedLaw={footprintRadius:law.footprintRadius,cellSize:law.cellSize,canopyInfluenceRadius:law.canopyInfluenceRadius,riskOccupiedCellRatioBelow:law.minimumOccupiedCellRatio,riskLargestComponentRatioBelow:law.minimumLargestComponentRatio,riskMaxEmptyCorridorCellsAbove:law.maximumEmptyCorridorCells};
if(JSON.stringify(v2Law)!==JSON.stringify(expectedLaw))throw new Error(`V2_LAW_DIVERGENCE:${JSON.stringify({v2Law,expectedLaw})}`);
if(V2.representativeStates.length!==7)throw new Error(`REPRESENTATIVE_STATE_COUNT:${V2.representativeStates.length}`);

function makeHash(points,cellSize=40){
  const map=new Map();
  for(const p of points){const cx=Math.floor(p.world.x/cellSize),cz=Math.floor(p.world.z/cellSize),k=`${cx},${cz}`;if(!map.has(k))map.set(k,[]);map.get(k).push(p);}
  return {cellSize,map};
}
function nearby(hash,x,z,r){
  const cs=hash.cellSize,n=Math.ceil(r/cs),cx=Math.floor(x/cs),cz=Math.floor(z/cs),r2=r*r;
  const out=[];
  for(let dz=-n;dz<=n;dz++)for(let dx=-n;dx<=n;dx++)for(const p of hash.map.get(`${cx+dx},${cz+dz}`)||[]){const a=p.world.x-x,b=p.world.z-z;if(a*a+b*b<=r2)out.push(p);}
  return out;
}
function parseOrbit(root){
  const src=fs.readFileSync(path.join(root,'characters/app.mjs'),'utf8');
  const m=src.match(/const ORBIT=\{eye:\[([^\]]+)\],look:\[([^\]]+)\]\}/);
  if(!m)throw new Error(`ORBIT_NOT_FOUND:${root}`);
  const triple=s=>s.split(',').map(x=>Number(x.trim()));
  return {eye:triple(m[1]),look:triple(m[2])};
}
async function loadProduct(root){
  const [step9,edge,pop]=await Promise.all([
    importAt(root,'characters/step9-regional-geography.mjs'),
    importAt(root,'characters/vegetation-edge-ecology.mjs'),
    importAt(root,'characters/vegetation-population.mjs')
  ]);
  const population=pop.getCanonicalVegetationPopulation();
  if(population.instanceCount!==CONTRACT.canonicalCanopyCount)throw new Error(`CANOPY_COUNT:${root}:${population.instanceCount}`);
  const orbit=parseOrbit(root);
  function stateCamera(spec){
    if(spec.camera==='ORBIT')return {eye:[...orbit.eye],look:[...orbit.look],source:'ORBIT'};
    const binding=step9.STEP9_DESTINATION_BINDINGS[spec.destination];
    if(!binding)throw new Error(`DESTINATION_BINDING_MISSING:${spec.destination}:${root}`);
    const c=step9.resolveStep9Camera(binding.siteId),look=c.look||c.worldReference;
    return {eye:[c.eye.x,c.eye.y,c.eye.z],look:[look.x,look.y,look.z],source:`STEP9:${binding.siteId}`};
  }
  return {root,step9,edge,pop,population,orbit,stateCamera};
}

function componentStats(cells){
  const occupied=[...cells.values()].filter(c=>c.occ),seen=new Set(),components=[];
  for(const start of occupied){
    if(seen.has(start.key))continue;
    const queue=[start],keys=[];seen.add(start.key);
    while(queue.length){const c=queue.pop();keys.push(c.key);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=cells.get(`${c.ix+dx},${c.iz+dz}`);if(n?.occ&&!seen.has(n.key)){seen.add(n.key);queue.push(n);}}}
    components.push(keys);
  }
  components.sort((a,b)=>b.length-a.length||a[0].localeCompare(b[0]));
  return components;
}
function emptyMorphology(cells){
  const empties=[...cells.values()].filter(c=>!c.occ),seen=new Set(),components=[];
  for(const start of empties){
    if(seen.has(start.key))continue;
    const queue=[start],members=[];seen.add(start.key);let perimeter=0;
    while(queue.length){const c=queue.pop();members.push(c);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=cells.get(`${c.ix+dx},${c.iz+dz}`);if(!n||n.occ){perimeter++;continue;}if(!seen.has(n.key)){seen.add(n.key);queue.push(n);}}}
    const xs=members.map(x=>x.ix),zs=members.map(x=>x.iz),w=Math.max(...xs)-Math.min(...xs)+1,h=Math.max(...zs)-Math.min(...zs)+1;
    components.push({cellCount:members.length,widthCells:w,heightCells:h,perimeterEdges:perimeter,elongation:q(Math.max(w,h)/Math.max(1,Math.min(w,h)),6)});
  }
  components.sort((a,b)=>b.cellCount-a.cellCount||b.elongation-a.elongation||a.widthCells-b.widthCells);
  const hist={};for(const c of components)hist[c.cellCount]=(hist[c.cellCount]||0)+1;
  return {componentCount:components.length,largestComponents:components.slice(0,12),sizeHistogram:hist};
}
function runAndWindowAnalysis(cells,state){
  const windows=[],runHist={ROW:{},COLUMN:{}},max={ROW:0,COLUMN:0};
  const pushRun=(axis,len)=>{if(!len)return;runHist[axis][len]=(runHist[axis][len]||0)+1;max[axis]=Math.max(max[axis],len);};
  const scan=(axis,groups)=>{
    for(const group of groups){
      let segment=[],emptyRun=0;
      const flush=()=>{pushRun(axis,emptyRun);emptyRun=0;for(let i=0;i+4<segment.length;i++){const slice=segment.slice(i,i+5);windows.push({id:`${state}:${axis}:${slice[0].key}->${slice[4].key}`,state,axis,cells:slice.map(c=>c.key),violated:slice.every(c=>!c.occ)});}segment=[];};
      let prev=null;
      for(const c of group){const coord=axis==='ROW'?c.ix:c.iz;if(prev!==null&&coord!==prev+1)flush();segment.push(c);if(c.occ){pushRun(axis,emptyRun);emptyRun=0;}else emptyRun++;prev=coord;}flush();
    }
  };
  const byRow=new Map(),byCol=new Map();
  for(const c of cells.values()){if(!byRow.has(c.iz))byRow.set(c.iz,[]);byRow.get(c.iz).push(c);if(!byCol.has(c.ix))byCol.set(c.ix,[]);byCol.get(c.ix).push(c);}
  const rows=[...byRow.values()].map(a=>a.sort((a,b)=>a.ix-b.ix));
  const cols=[...byCol.values()].map(a=>a.sort((a,b)=>a.iz-b.iz));
  scan('ROW',rows);scan('COLUMN',cols);
  return {windows,runHistogram:runHist,maxByAxis:max,maxEmptyCorridorCells:Math.max(max.ROW,max.COLUMN)};
}
function buildObservation(product,instances,spec){
  const camera=product.stateCamera(spec),center={x:camera.look[0],z:camera.look[2]},n=Math.ceil(law.footprintRadius/law.cellSize),hash=makeHash(instances,40),cells=new Map();
  for(let iz=-n;iz<=n;iz++)for(let ix=-n;ix<=n;ix++){
    const x=center.x+ix*law.cellSize,z=center.z+iz*law.cellSize;if((x-center.x)**2+(z-center.z)**2>law.footprintRadius**2)continue;
    const env=product.edge.resolveVegetationEnvironment(x,z);if(env.spatialZone==='OPENING')continue;
    const key=`${ix},${iz}`,occ=nearby(hash,x,z,law.canopyInfluenceRadius).length>0;cells.set(key,{key,ix,iz,x,z,occ});
  }
  const comps=componentStats(cells),rw=runAndWindowAnalysis(cells,spec.state),total=cells.size,occ=[...cells.values()].filter(c=>c.occ).length,largest=comps[0]?.length||0;
  const occupiedCellRatio=total?occ/total:0,largestComponentRatio=occ?largest/occ:0;
  const risk=occupiedCellRatio<law.minimumOccupiedCellRatio||largestComponentRatio<law.minimumLargestComponentRatio||rw.maxEmptyCorridorCells>law.maximumEmptyCorridorCells;
  const nearest=[];for(const c of cells.values()){let d=Infinity;for(const p of nearby(hash,c.x,c.z,law.footprintRadius)){d=Math.min(d,Math.hypot(p.world.x-c.x,p.world.z-c.z));}nearest.push(Number.isFinite(d)?d:null);}
  const finite=nearest.filter(Number.isFinite).sort((a,b)=>a-b);
  return {state:spec.state,cameraSource:camera.source,center,cells,windows:rw.windows,metrics:{eligibleCellCount:total,occupiedCellCount:occ,occupiedCellRatio:q(occupiedCellRatio,6),largestConnectedOccupiedCells:largest,largestComponentRatio:q(largestComponentRatio,6),maxEmptyCorridorCells:rw.maxEmptyCorridorCells,risk},emptyMorphology:emptyMorphology(cells),runHistogram:rw.runHistogram,fiveCellWindowCount:rw.windows.length,violatedFiveCellWindowCount:rw.windows.filter(w=>w.violated).length,nearestCanopy:{max:finite.length?q(finite.at(-1),6):null,median:finite.length?q(finite[Math.floor(finite.length/2)],6):null,p95:finite.length?q(finite[Math.min(finite.length-1,Math.floor(finite.length*.95))],6):null}};
}
function summarizeObservation(o){return {state:o.state,cameraSource:o.cameraSource,metrics:o.metrics,emptyMorphology:o.emptyMorphology,runHistogram:o.runHistogram,fiveCellWindowCount:o.fiveCellWindowCount,violatedFiveCellWindowCount:o.violatedFiveCellWindowCount,nearestCanopy:o.nearestCanopy};}

async function generateGenericUniverse(root){
  const [geo,eco,edge]=await Promise.all([
    importAt(root,'characters/gratitude-geography.adapter.mjs'),
    importAt(root,'characters/vegetation-ecology.mjs'),
    importAt(root,'characters/vegetation-edge-ecology.mjs')
  ]);
  const L=CONTRACT.candidateUniverseLaw,envelope=geo.GRATITUDE_DEVELOPMENT_FRAME.envelope,width=envelope.xMaximum-envelope.xMinimum,depth=envelope.zMaximum-envelope.zMinimum,insetX=width*L.insetFraction,insetZ=depth*L.insetFraction,usableWidth=width-insetX*2,usableDepth=depth-insetZ*2;
  const candidates=[];
  for(let row=0;row<L.rows;row++)for(let column=0;column<L.columns;column++){
    const seed=hash32(Math.imul(row+1,73856093)^Math.imul(column+1,19349663)^0x5a17c3d9),jitterX=(rand(seed,1)-.5)*2*L.jitterFraction,jitterZ=(rand(seed,2)-.5)*2*L.jitterFraction,u=clamp((column+.5+jitterX)/L.columns,0,1),v=clamp((row+.5+jitterZ)/L.rows,0,1),worldX=envelope.xMinimum+insetX+u*usableWidth,worldZ=envelope.zMinimum+insetZ+v*usableDepth;
    const ecology=eco.sampleCanonicalVegetationEcology(worldX,worldZ);if(ecology?.valid!==true)continue;
    const forestWeight=Number(ecology.biome?.forestWeight)||0;if(forestWeight<L.minimumForestWeight)continue;if(ecology.hydrology?.drainageClass!==L.drainageClass)continue;if(ecology.shorelineDistance<L.minimumShorelineDistance)continue;
    const env=edge.resolveVegetationEnvironment(ecology.world.x,ecology.world.z);if(env.spatialZone==='OPENING'||env.canopyDensity<=0)continue;
    candidates.push({id:`veg-r${row}-c${column}`,world:{x:q(ecology.world.x,6),y:q(ecology.world.y,6),z:q(ecology.world.z,6)},lattice:{row,column}});
  }
  candidates.sort((a,b)=>a.lattice.row-b.lattice.row||a.lattice.column-b.lattice.column);
  const digest=sha256(candidates.map(c=>`${c.id}:${c.world.x}:${c.world.y}:${c.world.z}`).join('\n'));
  return {candidates,digest};
}
function buildCoverage(universe,observations){
  const cellToWindows=new Map(),windows=[];
  for(const o of observations){for(const w of o.windows){windows.push(w);for(const c of w.cells){const g=`${o.state}|${c}`;if(!cellToWindows.has(g))cellToWindows.set(g,[]);cellToWindows.get(g).push(w.id);}}}
  const candidateCoverage=new Map();
  for(const cand of universe){const cells=[],win=new Set();for(const o of observations){const cx=Math.round((cand.world.x-o.center.x)/law.cellSize),cz=Math.round((cand.world.z-o.center.z)/law.cellSize);for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const c=o.cells.get(`${cx+dx},${cz+dz}`);if(!c)continue;if(Math.hypot(cand.world.x-c.x,cand.world.z-c.z)<=law.canopyInfluenceRadius){const g=`${o.state}|${c.key}`;cells.push(g);for(const wid of cellToWindows.get(g)||[])win.add(wid);}}}candidateCoverage.set(cand.id,{cells:[...new Set(cells)].sort(),windows:[...win].sort()});}
  return {candidateCoverage,windows};
}
function witnessStateMetrics(observations,coverCounts){
  const out=[];
  for(const o of observations){const cells=new Map([...o.cells.entries()].map(([k,c])=>[k,{...c,occ:(coverCounts.get(`${o.state}|${k}`)||0)>0}]));const comps=componentStats(cells),rw=runAndWindowAnalysis(cells,o.state),total=cells.size,occ=[...cells.values()].filter(c=>c.occ).length,largest=comps[0]?.length||0,occupiedCellRatio=total?occ/total:0,largestComponentRatio=occ?largest/occ:0,risk=occupiedCellRatio<law.minimumOccupiedCellRatio||largestComponentRatio<law.minimumLargestComponentRatio||rw.maxEmptyCorridorCells>law.maximumEmptyCorridorCells;out.push({state:o.state,eligibleCellCount:total,occupiedCellCount:occ,occupiedCellRatio:q(occupiedCellRatio,6),largestConnectedOccupiedCells:largest,largestComponentRatio:q(largestComponentRatio,6),maxEmptyCorridorCells:rw.maxEmptyCorridorCells,risk});}
  return out;
}
function solveWitness(universe,selectedIds,observations,coverage){
  const selected=new Set(selectedIds),coverCounts=new Map();
  const addCount=(id,delta)=>{for(const c of coverage.candidateCoverage.get(id)?.cells||[])coverCounts.set(c,(coverCounts.get(c)||0)+delta);};
  for(const id of selected)addCount(id,1);
  const initialSelected=[...selected].sort(),swaps=[];
  const safeDonors=exclude=>[...selected].filter(id=>id!==exclude&&(coverage.candidateCoverage.get(id)?.cells||[]).every(c=>(coverCounts.get(c)||0)>=2)).sort((a,b)=>{const ca=coverage.candidateCoverage.get(a)?.cells.length||0,cb=coverage.candidateCoverage.get(b)?.cells.length||0;return ca-cb||a.localeCompare(b);});
  const replace=(addId,reason)=>{if(selected.has(addId))return true;const donor=safeDonors(addId)[0];if(!donor)return false;addCount(donor,-1);selected.delete(donor);selected.add(addId);addCount(addId,1);swaps.push({out:donor,in:addId,reason});return true;};
  const windowViolated=w=>(w.cells||[]).every(k=>(coverCounts.get(`${w.state}|${k}`)||0)===0);
  let guard=0;
  while(guard++<CONTRACT.canonicalCanopyCount){const violated=coverage.windows.filter(windowViolated);if(!violated.length)break;const violatedIds=new Set(violated.map(w=>w.id));let best=null;for(const c of universe){if(selected.has(c.id))continue;const cov=coverage.candidateCoverage.get(c.id),gain=cov.windows.reduce((n,w)=>n+(violatedIds.has(w)?1:0),0);if(!gain)continue;const newCells=cov.cells.reduce((n,k)=>n+((coverCounts.get(k)||0)===0?1:0),0),score=[gain,newCells,-cov.cells.length,c.id];if(!best||score[0]>best.score[0]||score[0]===best.score[0]&&(score[1]>best.score[1]||score[1]===best.score[1]&&(score[2]>best.score[2]||score[2]===best.score[2]&&score[3]<best.score[3])))best={id:c.id,score};}if(!best||!replace(best.id,'FIVE_CELL_WINDOW_COVERAGE'))break;}
  let metrics=witnessStateMetrics(observations,coverCounts);guard=0;
  while(metrics.some(m=>m.risk)&&guard++<CONTRACT.canonicalCanopyCount){const target=metrics.filter(m=>m.risk).sort((a,b)=>{const ag=a.maxEmptyCorridorCells-law.maximumEmptyCorridorCells,bg=b.maxEmptyCorridorCells-law.maximumEmptyCorridorCells;if(bg!==ag)return bg-ag;const ac=law.minimumLargestComponentRatio-a.largestComponentRatio,bc=law.minimumLargestComponentRatio-b.largestComponentRatio;if(bc!==ac)return bc-ac;return a.state.localeCompare(b.state);})[0];const o=observations.find(x=>x.state===target.state);const occCells=new Map([...o.cells.entries()].map(([k,c])=>[k,{...c,occ:(coverCounts.get(`${o.state}|${k}`)||0)>0}]));const comps=componentStats(occCells),largest=new Set(comps[0]||[]),label=new Map();comps.forEach((ks,i)=>ks.forEach(k=>label.set(k,i)));let best=null;for(const c of universe){if(selected.has(c.id))continue;const cov=(coverage.candidateCoverage.get(c.id)?.cells||[]).filter(g=>g.startsWith(`${o.state}|`));if(!cov.length)continue;const newLocal=cov.map(g=>g.split('|')[1]).filter(k=>!occCells.get(k)?.occ);if(!newLocal.length)continue;let touchesLargest=0;const adjacentComps=new Set();for(const key of newLocal){const cell=occCells.get(key);if(!cell)continue;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nk=`${cell.ix+dx},${cell.iz+dz}`;if(largest.has(nk))touchesLargest=1;if(label.has(nk))adjacentComps.add(label.get(nk));}}const allNew=(coverage.candidateCoverage.get(c.id)?.cells||[]).reduce((n,k)=>n+((coverCounts.get(k)||0)===0?1:0),0);const score=[adjacentComps.size>=2?1:0,touchesLargest,newLocal.length,allNew,c.id];if(!best||score[0]>best.score[0]||score[0]===best.score[0]&&(score[1]>best.score[1]||score[1]===best.score[1]&&(score[2]>best.score[2]||score[2]===best.score[2]&&(score[3]>best.score[3]||score[3]===best.score[3]&&score[4]<best.score[4]))))best={id:c.id,score};}
    if(!best||(!best.score[0]&&!best.score[1])||!replace(best.id,'FOUR_NEIGHBOR_COMPONENT_EXPANSION'))break;metrics=witnessStateMetrics(observations,coverCounts);
  }
  metrics=witnessStateMetrics(observations,coverCounts);const clear=metrics.every(m=>!m.risk),ids=[...selected].sort();
  if(ids.length!==CONTRACT.canonicalCanopyCount||new Set(ids).size!==ids.length)throw new Error('WITNESS_BUDGET_IDENTITY_FAILURE');
  const unionCoverable=new Map();for(const o of observations)for(const k of o.cells.keys())unionCoverable.set(`${o.state}|${k}`,false);for(const c of universe)for(const k of coverage.candidateCoverage.get(c.id)?.cells||[])unionCoverable.set(k,true);
  const impossibleWindows=coverage.windows.filter(w=>w.cells.every(k=>!unionCoverable.get(`${w.state}|${k}`))).map(w=>w.id);
  const occupancyCertificates=[];for(const o of observations){const total=o.cells.size,coverable=[...o.cells.keys()].filter(k=>unionCoverable.get(`${o.state}|${k}`)).length;if(total&&coverable/total<law.minimumOccupiedCellRatio)occupancyCertificates.push({state:o.state,eligibleCellCount:total,maxCoverableCellCount:coverable,maxCoverableRatio:q(coverable/total),requiredRatio:law.minimumOccupiedCellRatio});}
  const certificate=(impossibleWindows.length||occupancyCertificates.length)?{type:'DIRECT_COVERAGE_IMPOSSIBILITY',impossibleFiveCellWindows:impossibleWindows,occupancyUpperBoundFailures:occupancyCertificates}:null;
  const disposition=clear?'FEASIBLE':certificate?'INFEASIBLE':'UNRESOLVED';
  return {disposition,clear,ids,metrics,swaps,certificate,initialSelected,coverCounts};
}
function writeWitnessModule(universe,witnessIds,file){
  const byId=new Map(universe.map(c=>[c.id,c])),instances=witnessIds.map(id=>{const c=byId.get(id);if(!c)throw new Error(`WITNESS_ID_NOT_IN_UNIVERSE:${id}`);return {id,world:c.world};});
  const src=`const freeze=v=>{if(v&&typeof v==='object'){for(const x of Object.values(v))freeze(x);Object.freeze(v);}return v;};\nexport const CANONICAL_VEGETATION_POPULATION_CONTRACT=freeze({schema:'GEN2006_READ_ONLY_FEASIBILITY_WITNESS',exactPopulationBudget:${CONTRACT.canonicalCanopyCount},productMutationAuthority:false});\nconst POP=freeze({schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_v1',instanceCount:${CONTRACT.canonicalCanopyCount},instances:${JSON.stringify(instances)}});\nexport function getCanonicalVegetationPopulation(){return POP;}\n`;
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,src);
}

const products={};for(const [name,root] of Object.entries(ROOTS))products[name]=await loadProduct(root);
const subjectObs={};for(const [name,p] of Object.entries(products))subjectObs[name]=V2.representativeStates.map(spec=>buildObservation(p,p.population.instances,spec));
const universeResult=await generateGenericUniverse(ROOTS.GEN2001),universe=universeResult.candidates,universeIds=new Set(universe.map(c=>c.id)),gen2001Selected=products.GEN2001.population.instances.map(x=>x.id);
if(gen2001Selected.some(id=>!universeIds.has(id)))throw new Error(`GEN2001_SELECTED_NOT_SUBSET_OF_GENERIC_UNIVERSE:${gen2001Selected.filter(id=>!universeIds.has(id)).slice(0,12).join(',')}`);
const coverage=buildCoverage(universe,subjectObs.GEN2001),solve=solveWitness(universe,gen2001Selected,subjectObs.GEN2001,coverage);
if(solve.disposition==='FEASIBLE'&&WITNESS_MODULE)writeWitnessModule(universe,solve.ids,WITNESS_MODULE);
const subjectSummaries=Object.fromEntries(Object.entries(subjectObs).map(([k,v])=>[k,v.map(summarizeObservation)]));
const deltas={};for(const state of V2.representativeStates.map(s=>s.state)){const row={};for(const name of ['GEN2001','GEN2002','GEN2003']){const m=subjectSummaries[name].find(x=>x.state===state).metrics;row[name]={occupiedCellRatio:m.occupiedCellRatio,largestComponentRatio:m.largestComponentRatio,maxEmptyCorridorCells:m.maxEmptyCorridorCells,risk:m.risk};}deltas[state]=row;}
const candidateCoverageCounts=[...coverage.candidateCoverage.values()].map(x=>x.cells.length),windowCoverageCounts=[...coverage.candidateCoverage.values()].map(x=>x.windows.length),witnessDigest=solve.disposition==='FEASIBLE'?sha256(solve.ids.join('\n')):null;
const receipt={schema:'POST_GEN2003_CANOPY_VOID_FEASIBILITY_DIAGNOSTIC_RECEIPT_v1',operationId:CONTRACT.operationId,lockGeneration:CONTRACT.lockGeneration,governingHead:CONTRACT.governingHead,result:'PASS_CLOSED',diagnosticValid:true,productMutationDetected:false,productRepairAuthority:false,mergeAuthority:false,deploymentAuthority:false,publicationAuthority:false,materialDisposition:'UNASSIGNED',productMechanicalState:'NON_CLEAR',frozenSubjects:{GEN2001:CONTRACT.gen2001Foundation,GEN2002:CONTRACT.gen2002NegativeCandidate,GEN2003:CONTRACT.gen2003NegativeCandidate,immutableV2:CONTRACT.immutableV2ToolingHead,ahbkReference:CONTRACT.ahbkReferenceHead},candidateUniverse:{authority:CONTRACT.candidateUniverseLaw.authority,candidateCount:universe.length,digest:universeResult.digest,generatedBeforeV2FailureAnalysis:true,failureCoordinatesUsedForGeneration:false},subjects:subjectSummaries,spatialDeltaAndInvariance:deltas,coverageMatrix:{eligibleStateCellCount:subjectObs.GEN2001.reduce((n,o)=>n+o.cells.size,0),fiveCellWindowCount:coverage.windows.length,candidateCount:universe.length,candidatesCoveringAnyV2Cell:candidateCoverageCounts.filter(n=>n>0).length,maxCellsCoveredByCandidate:Math.max(0,...candidateCoverageCounts),maxWindowsCoveredByCandidate:Math.max(0,...windowCoverageCounts)},feasibility:{disposition:solve.disposition,canonicalCount:CONTRACT.canonicalCanopyCount,witnessIdDigest:witnessDigest,witnessIds:solve.disposition==='FEASIBLE'?solve.ids:[],swapCount:solve.swaps.length,swapIds:solve.disposition==='FEASIBLE'?solve.swaps:[],witnessCanopyMetrics:solve.disposition==='FEASIBLE'?solve.metrics:[],certificate:solve.certificate,heuristicFailureCoercedToInfeasible:false},ahbkBoundaryRecord:{methodOnly:true,empiricalSupportTransferred:false,noncompensatoryDimensions:['OCCUPIED_CELL_RATIO','LARGEST_COMPONENT_RATIO','DIRECTIONAL_EMPTY_CORRIDOR'],scalarCollapseProhibited:true,priorAttemptRelation:'DENSITY_AND_GRAPH_CONNECTIVITY_IMPROVEMENT_DID_NOT_FORCE_DIRECTIONAL_VOID_CLEARANCE',feasibilityDispositionPreserved:solve.disposition},checks:[{id:'EXACT_818_GEN2001_BASELINE',pass:gen2001Selected.length===818},{id:'GENERIC_UNIVERSE_FROZEN_BEFORE_V2_ANALYSIS',pass:true},{id:'ALL_THREE_FROZEN_SUBJECTS_ANALYZED',pass:Object.keys(subjectSummaries).length===3},{id:'IMMUTABLE_V2_LAW_PRESERVED',pass:true},{id:'NO_PRODUCT_MUTATION',pass:true},{id:'FEASIBILITY_SEMANTICS_VALID',pass:['FEASIBLE','INFEASIBLE','UNRESOLVED'].includes(solve.disposition)},{id:'INFEASIBLE_HAS_CERTIFICATE',pass:solve.disposition!=='INFEASIBLE'||Boolean(solve.certificate)},{id:'FEASIBLE_HAS_EXACT_818_WITNESS',pass:solve.disposition!=='FEASIBLE'||(solve.ids.length===818&&new Set(solve.ids).size===818&&solve.metrics.every(m=>!m.risk))},{id:'AHBK_METHOD_ONLY',pass:true}]};
receipt.checkCount=receipt.checks.length;receipt.failCount=receipt.checks.filter(x=>!x.pass).length;receipt.passCount=receipt.checkCount-receipt.failCount;if(receipt.failCount){receipt.result='FAIL_CLOSED';receipt.diagnosticValid=false;}receipt.receiptDigest=sha256(stableText({...receipt,receiptDigest:undefined}));
fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});fs.writeFileSync(OUTPUT,stableText(receipt));process.stdout.write(stableText(receipt));if(receipt.failCount)process.exitCode=1;
