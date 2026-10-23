import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {habitatHash} from '../../showroom/globe/h-earth/render/woodland-habitat-field.v1.js';
import {hillsideWeight,hillsideSandCoverage,hillsideDensity,HILLSIDE_SHORELINE} from '../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
const root=new URL('../../',import.meta.url),evidence='h-earth-3d/evidence/terrain-grass-continuity-v2/',asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',read=p=>fs.readFileSync(new URL(p,root)),sha=b=>createHash('sha256').update(b).digest('hex');
const checkpoint=JSON.parse(read(evidence+'checkpoint.json')),manifest=JSON.parse(read(asset+'json')),raw=gunzipSync(read(asset+'bin.gz')),added=gunzipSync(read(evidence+'added.bin.gz'));
const runtimeBaselineBytes=gunzipSync(read(evidence+'runtime-baseline.json.gz')),runtimeBaseline=JSON.parse(runtimeBaselineBytes);
assert.equal(sha(runtimeBaselineBytes),checkpoint.runtimeBaselineSha256);
assert.equal(runtimeBaseline.receipt.contactCount,checkpoint.runtimeBaselineCount);
const acceptance=JSON.parse(read(evidence+'acceptance.json'));
assert.equal(checkpoint.baseline,'db743204f1fcc0b6d8fd1dae5bf3b590be5f6d9d');
assert.equal(sha(read(evidence+'acceptance.json')),checkpoint.acceptanceSha256);
const records=b=>Array.from({length:b.length/52},(_,i)=>b.subarray(i*52,(i+1)*52));
export const addedRecords=records(added).map(b=>({x:b.readDoubleLE(0),y:b.readDoubleLE(8),z:b.readDoubleLE(16),angle:b.readDoubleLE(24),slope:b.readDoubleLE(32),seed:b.readUInt32LE(40),triangleId:b.readUInt32LE(44),region:'RAVINE_SUPPLEMENT'}));
test('whole baseline retained byte-exact, additions unique and bounded, atlas panels preserved',()=>{
 const priorJson=JSON.parse(execFileSync('git',['show',checkpoint.baseline+':'+asset+'json'],{cwd:root})),prior=gunzipSync(execFileSync('git',['show',checkpoint.baseline+':'+asset+'bin.gz'],{cwd:root,maxBuffer:120*1024*1024}));
 assert.equal(checkpoint.removed,0);assert.equal(sha(added),checkpoint.addedSha256);assert.equal(sha(raw),manifest.rawSha256);assert.equal(sha(read(asset+'bin.gz')),manifest.compressedSha256);
 const expected=new Map(records(added).map(b=>[b.readDoubleLE(0)+':'+b.readDoubleLE(16),b])),counts=new Map(priorJson.tiles.map(t=>[t.id,t.count])),preserved=[],outside=[],unique=new Set();let offset=0;
 for(const t of manifest.tiles){const n=counts.get(t.id)||0;assert(t.count>=n&&t.count<=1600);preserved.push(raw.subarray(offset,offset+n*52));for(let i=0;i<t.count;i++){const b=raw.subarray(offset+i*52,offset+(i+1)*52),x=b.readDoubleLE(0),z=b.readDoubleLE(16),key=x+':'+z;assert(!unique.has(key));unique.add(key);assert.equal(t.id,Math.floor(x/4)+':'+Math.floor(z/4));if(i>=n){assert.deepEqual(b,expected.get(key));expected.delete(key);}if(!hillsideWeight(x,z))outside.push(b);}offset+=t.count*52;}
 assert.equal(expected.size,0);assert.deepEqual(Buffer.concat(preserved),prior.subarray(0,priorJson.rootCount*52));assert.equal(sha(Buffer.concat(preserved)),checkpoint.baselineRootRecordsSha256);assert.equal(checkpoint.allBaselineRecordsPreserved,true);
 const atlas=raw.subarray(offset),oldAtlas=prior.subarray(priorJson.rootCount*52);for(let z=0;z<192;z++)assert.deepEqual(atlas.subarray(z*576,z*576+384),oldAtlas.subarray(z*576,z*576+384));
 assert.equal(priorJson.rootCount,1518809);assert.equal(manifest.rootCount,priorJson.rootCount+checkpoint.added);assert.equal(checkpoint.budgetApproval,'NOT_CLAIMED');assert.deepEqual(manifest.habitat.coastal.bounds,checkpoint.bounds);
});
test('terrain coast and bank laws are smooth without rectangular boundaries and retain wet exclusions',()=>{
 const at=(s,c=1,x=0,z=-180)=>hillsideSandCoverage({x,z,shaderSlope:s,rawSandCoverage:c});
 assert.equal(at(0),1);assert.equal(at(.01),1);assert.equal(at(.08),0);assert.equal(at(.08,1,300),0);assert.equal(at(.08,0),0);
 for(let s=0;s<.2;s+=.0001)assert(Math.abs(at(s+.0001)-at(s))<.003);
 for(const [x,z]of [[-136,-180],[249,-180],[0,-101]]){assert.equal(hillsideWeight(x,z),1);assert.equal(at(.08,.8,x,z),0);}
 assert(hillsideWeight(0,-253)>0,'previous rectangular southern edge must not zero suitable grass');
 for(const x of [-512,-136,249,512])assert.equal(hillsideWeight(x,-180),1,'computational x bounds cannot clip terrain');
 assert.equal(hillsideWeight(0,-300),0,'genuine inland side remains outside scope');
 for(const contactDistance of [-10,0])assert.equal(hillsideDensity({x:0,y:5,z:-180,shaderSlope:.1,contactDistance,sandCoverage:0}),0);
 assert.equal(hillsideDensity({x:0,y:5,z:-180,shaderSlope:0,contactDistance:5,sandCoverage:1}),0);
 for(const [y,target]of [[5,acceptance.lowerTerrainRootsPerSquareMetre],[20,24],[38,acceptance.middleTerrainRootsPerSquareMetre],[50,acceptance.crestRootsPerSquareMetre],[65,1.5]])assert.equal(hillsideDensity({x:0,y,z:-180,shaderSlope:.1,contactDistance:20,sandCoverage:0}),target);
 for(let y=0;y<65;y+=.1){const atY=y=>hillsideDensity({x:0,y,z:-180,shaderSlope:.1,contactDistance:20,sandCoverage:0});assert(atY(y+.1)<=atY(y)+1e-12);assert(Math.abs(atY(y+.1)-atY(y))<.15);}
 const shader=read('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').toString();assert(shader.includes('${HILLSIDE_SHORELINE_GLSL}'));assert(shader.includes('hillsideSandCoverage(world,slope,renderedBeachCoverage('));
 const provider=read('showroom/globe/h-earth/render/vegetation-visible-surface.v1.js').toString();assert(provider.includes('shaderSlope:b.shaderSlope,rawSandCoverage:b.rawSandCoverage'));
});
test('whole seeded component census closes on all four sides and every fully eligible quota is filled',()=>{
 const c=JSON.parse(gunzipSync(read(evidence+'coverage.json.gz'))),reports=checkpoint.componentReport,[x0,z0,x1,z1]=checkpoint.scanBounds;
 assert.equal(c.length,checkpoint.eligibleCells);assert.equal(checkpoint.shortFullyEligibleCells,0);
 assert.equal(reports.reduce((sum,r)=>sum+r.cells,0),checkpoint.componentSizes.reduce((sum,n)=>sum+n,0));
 const selected=reports.filter(r=>r.selected);assert(selected.length>0);assert.equal(selected.reduce((sum,r)=>sum+r.cells,0),checkpoint.selectedComponentCells);assert.equal(c.length,checkpoint.selectedComponentCells);
 for(const r of reports){assert.equal(r.selected,r.seeds.length>0);if(r.selected){assert.equal(r.exclusionReason,null);assert(r.bounds[0]>x0&&r.bounds[1]>z0&&r.bounds[2]<x1&&r.bounds[3]<z1);}else assert.equal(r.exclusionReason,'NO_ESTABLISHED_REGION_INTERSECTION');}
 const seedNames=new Set(selected.flatMap(r=>r.seeds));for(const seed of checkpoint.seedRegions)assert(seedNames.has(seed.name),'unrepresented intended seed '+seed.name);
 assert.equal(c.filter(p=>!p.centerEligible).length,checkpoint.selectedBoundaryCells);assert(checkpoint.boundaryIncludedCells>=checkpoint.selectedBoundaryCells);assert.equal(checkpoint.centerEligibleCells+checkpoint.boundaryIncludedCells,reports.reduce((n,r)=>n+r.cells,0));assert.equal(reports.reduce((n,r)=>n+r.cells,0)+Object.values(checkpoint.censusRejections).reduce((n,k)=>n+k,0),(x1-x0)*(z1-z0));
 let shorts=0;for(const p of c){assert.equal(p.probes.length,16);assert.equal(p.probes.filter(q=>q.reason===null).length,p.eligibleProbes);const d=p.probes.reduce((n,q)=>n+q.density,0)/16;assert.equal(p.quota,Math.floor(d)+(habitatHash(Math.floor(p.x),Math.floor(p.z),HILLSIDE_SHORELINE.seed)/4294967296<d%1?1:0));assert(p.eligibleProbes>=0&&p.eligibleProbes<=16);assert.equal(p.eligibleProbes+Object.values(p.probeRejections).reduce((n,k)=>n+k,0),16);assert.equal(p.before,p.savedBefore+p.runtimeOccupancy);assert.equal(p.after,p.savedAfter+p.runtimeOccupancy);assert(p.savedAfter>=p.savedBefore);assert(p.after>=p.before);assert.equal(p.requiredOccupancy,Math.max(p.before,p.quota));assert(p.quota>=0&&p.quota<=24);if(p.eligibleProbes===16)assert(p.after>=p.requiredOccupancy);if(p.after<p.quota){shorts++;assert(p.eligibleProbes<16);assert(Object.values(p.candidateRejections).reduce((n,k)=>n+k,0)>0);}assert(p.sand<=.12);}
 assert.equal(shorts,checkpoint.shortCells);
 const changed=c.filter(p=>p.after>p.before);assert(changed.length>0);assert(changed.some(p=>p.y>32));assert(changed.some(p=>p.contact<10&&p.slope>.25));assert(changed.some(p=>p.x<-136||p.x>249||p.z<-253||p.z>-101),'repair must extend beyond former rectangle');
});
test('every new root is grounded on actual geometry, dry, admitted, and within shared classification',async()=>{
 const {visibleSurface,groundAdmission,materials,cover}=await import('../evidence/hillside-shoreline-continuity-v1/support-fixture.mjs');
 const runtimeIndex=new Map();for(const t of runtimeBaseline.tiles)for(const r of t.roots){const k=Math.floor(r.x/.08)+':'+Math.floor(r.z/.08);if(!runtimeIndex.has(k))runtimeIndex.set(k,[]);runtimeIndex.get(k).push(r);}
 for(const r of addedRecords){for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)for(const old of runtimeIndex.get((Math.floor(r.x/.08)+dx)+':'+(Math.floor(r.z/.08)+dz))||[])assert(Math.hypot(old.x-r.x,old.z-r.z)>=.075,'addition overlaps baseline runtime grass');assert(hillsideWeight(r.x,r.z)>0);const s=visibleSurface.sample(r.x,r.z);assert(s);assert.equal(Math.fround(s.y),r.y);assert.equal(s.triangleId,r.triangleId);assert.equal(s.slope,r.slope);assert(s.slope<=1.6);assert(groundAdmission(r.x,r.z,s));const b=visibleSurface.beach.sample({x:r.x,z:r.z,support:s});assert(b.valid&&b.rawSandCoverage<=.12);const w=visibleSurface.water.sample(r.x,r.z);assert(!w||s.y>w.y+.03);const a=cover.inverseHEarthGroundCoverPoint(r.x,r.y,r.z),m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);assert(m.valid);assert(m.soilDepth>=(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?.035:.20));assert(hillsideDensity({x:r.x,y:r.y,z:r.z,shaderSlope:b.shaderSlope,contactDistance:b.interpolatedExposedContactDistance,sandCoverage:b.rawSandCoverage})>0);}
});

test('combined population preserves entrance roots and reports allocation without claiming a GPU budget pass',async()=>{
 const {visibleSurface,geology,groundAdmission}=await import('../evidence/hillside-shoreline-continuity-v1/support-fixture.mjs');
 const {loadPrecomputedGrass,takePrecomputedGrassPlan}=await import('../../showroom/globe/h-earth/render/precomputed-grass.v1.js');
 const {runtimePlantingBaselineTiles}=await import('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js');
 const {buildCavernEntranceGrass}=await import('../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js');
 const {buildCavernPalmPlacement}=await import('../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js');
 const {GRASS_CONTINUITY_ALLOCATION:a}=await import('../../showroom/globe/h-earth/render/grass-continuity-supplement.v1.js');
 const p=await loadPrecomputedGrass({packed:true,fetchImpl:async u=>new Response(fs.readFileSync(u.pathname))}),plan=takePrecomputedGrassPlan(p);
 const entrance=await buildCavernEntranceGrass({existingTiles:runtimePlantingBaselineTiles(plan.tiles),visibleSurface:{...visibleSurface,admitGround:groundAdmission},geology,palms:buildCavernPalmPlacement(geology).receipt.placements});
 const priorManifest=JSON.parse(execFileSync('git',['show',checkpoint.baseline+':'+asset+'json'],{cwd:root}));
 const priorCounts=new Map(priorManifest.tiles.map(t=>[t.id,t.count]));
 const oldTiles=plan.tiles.filter(t=>priorCounts.has(t.id)).map(t=>({...t,count:priorCounts.get(t.id),packed:t.packed.slice(0,priorCounts.get(t.id)*4)}));
 const baselineEntrance=await buildCavernEntranceGrass({existingTiles:oldTiles,visibleSurface:{...visibleSurface,admitGround:groundAdmission},geology,palms:buildCavernPalmPlacement(geology).receipt.placements});
 const stable=p=>JSON.parse(JSON.stringify(p,(key,value)=>/Ms$|Milliseconds$/.test(key)?undefined:value));
 assert.deepEqual(stable(entrance),runtimeBaseline,'full cave and slope runtime roots equal frozen evidence');
 assert.deepEqual(stable(entrance),stable(baselineEntrance),'full baseline cave and slope runtime roots preserved');
 assert(entrance.tiles.some(t=>t.id.startsWith('CAVERN_ENTRANCE:')));assert(entrance.tiles.some(t=>t.id.startsWith('CAVERN_SLOPE:')));
 for(const t of plan.tiles)assert.equal(t.baselineCount,priorCounts.get(t.id)||0);
 const physicalCounts=new Map(plan.tiles.map(t=>[t.minX+':'+t.minZ,t.count]));for(const t of entrance.tiles){const k=t.minX+':'+t.minZ;physicalCounts.set(k,(physicalCounts.get(k)||0)+t.roots.length);}assert.equal([...physicalCounts.values()].reduce((n,v)=>Math.max(n,v),0),checkpoint.combinedMaximumTileRoots);assert(checkpoint.combinedMaximumTileRoots<=1600);
 const base=plan.tiles.reduce((n,t)=>n+t.count,0),combined=base+entrance.receipt.contactCount;
 assert.equal(base,manifest.rootCount);assert(entrance.receipt.interiorCount>0);assert.equal(checkpoint.packedBytes,base*16);assert.equal(checkpoint.savedPackedAndAtlasBytes,base*16+manifest.habitat.width*manifest.habitat.height);assert.equal(checkpoint.combinedPackedAndAtlasBytes,combined*16+manifest.habitat.width*manifest.habitat.height);assert.equal(checkpoint.combinedRootCount,combined);assert.equal(checkpoint.baselineCombinedCount,priorManifest.rootCount+entrance.receipt.contactCount);assert.deepEqual(manifest.receipt.terrainRuntimeBaseline,{baseline:checkpoint.baseline,sha256:checkpoint.runtimeBaselineSha256,rootCount:checkpoint.runtimeBaselineCount});
 console.log('COMBINED_POPULATION_BUDGET',JSON.stringify({base,entrance:entrance.receipt.contactCount,combined,limit:a.maximumRoots,headroom:a.maximumRoots-combined,combinedPackedBytes:combined*16,budgetApproved:false}));
});
