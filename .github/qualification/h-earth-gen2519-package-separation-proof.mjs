import { getHEarthOW01CanonicalLiveRenderPackageOccurrence, getHEarthRun8ER2CanonicalVegetationPresentationPlan } from '../../preview/h-earth/corridor/38df744ba7402aabe7fd2eaee71b961a451350de/B/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

const EXPECTED_SHA='271e881272861547411ccd700ce1a3b310b4e4ac';
const EXPECTED_POPULATION=27585;
const MAX_BATCH=256;
const fail=(index,name,observed,expected)=>{console.error(JSON.stringify({schema:'H_EARTH_GEN2519_PACKAGE_SEPARATION_EXECUTION_PROOF_v1',result:'FAIL',targetSha:EXPECTED_SHA,firstFailedAssertion:index,name,observed,expected},null,2));process.exit(1);};
const pass=[];
const assert=(index,name,ok,observed,expected)=>{if(!ok)fail(index,name,observed,expected);pass.push({index,name,result:'PASS',observed,expected});};

const base=getHEarthOW01CanonicalLiveRenderPackageOccurrence();
const plan=getHEarthRun8ER2CanonicalVegetationPresentationPlan();

assert(1,'BASE_PACKAGE_VEGETATION_COUNT',base?.roleCounts?.VEGETATION===0,base?.roleCounts?.VEGETATION,0);
assert(2,'BOUNDED_POPULATION',plan?.instanceCount===EXPECTED_POPULATION,plan?.instanceCount,EXPECTED_POPULATION);
const maxBatch=Math.max(0,...(plan?.batches??[]).map(batch=>Number(batch.count)));
assert(3,'MAXIMUM_BATCH_SIZE',maxBatch<=MAX_BATCH,maxBatch,'<=256');
assert(4,'DROPPED_PLACEMENTS',plan?.droppedPlacementCount===0,plan?.droppedPlacementCount,0);
const ids=Array.from(plan?.placementIds??[]);
const unique=new Set(ids);
assert(5,'UNIQUE_PLACEMENT_IDS',unique.size===EXPECTED_POPULATION,unique.size,EXPECTED_POPULATION);
const flattened=[];
for(const batch of plan?.batches??[]) {
  const start=Number(batch.start),count=Number(batch.count);
  flattened.push(...ids.slice(start,start+count));
}
const flattenedCounts=new Map();
for(const id of flattened) flattenedCounts.set(id,(flattenedCounts.get(id)??0)+1);
const missing=ids.filter(id=>!flattenedCounts.has(id));
const duplicates=[...flattenedCounts.entries()].filter(([,count])=>count!==1).map(([id])=>id);
assert(6,'MISSING_AND_DUPLICATE_IDS',missing.length===0&&duplicates.length===0,{missing:missing.length,duplicates:duplicates.length},{missing:0,duplicates:0});
const canonicalOrdering=flattened.length===ids.length&&flattened.every((id,index)=>id===ids[index]);
assert(7,'CANONICAL_ORDERING_PRESERVED',canonicalOrdering,canonicalOrdering,true);
const complete=plan?.completeWorldPlacementCoverageRequired===true&&flattened.length===EXPECTED_POPULATION&&unique.size===EXPECTED_POPULATION;
assert(8,'COMPLETE_WORLD_COVERAGE',complete,{required:plan?.completeWorldPlacementCoverageRequired,covered:flattened.length},'PASS');
console.log(JSON.stringify({schema:'H_EARTH_GEN2519_PACKAGE_SEPARATION_EXECUTION_PROOF_v1',result:'PASS',targetSha:EXPECTED_SHA,assertions:pass},null,2));
