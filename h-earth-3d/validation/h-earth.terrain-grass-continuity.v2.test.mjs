import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {hillsideWeight,hillsideDensity,hillsideDry,hillsideSandCoverage,HILLSIDE_SHORELINE_GLSL} from '../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
const evidence=new URL('../evidence/terrain-grass-continuity-v2/',import.meta.url);
const read=name=>{const p=new URL(name,evidence);if(name.endsWith('.gz'))return JSON.parse(gunzipSync(fs.readFileSync(p)));return JSON.parse(fs.existsSync(p)?fs.readFileSync(p):gunzipSync(fs.readFileSync(new URL(name+'.gz',evidence))));};
const contract=read('acceptance.json');
// Oracle implements the frozen North contract independently of the production law.
const s=(a,b,x)=>{const q=Math.min(1,Math.max(0,(x-a)/(b-a)));return q*q*(3-2*q);};
const spine=[[-52,-208],[18,-226],[86,-235],[148,-224]];
function divide(x){if(x<-52)return -208;if(x>=148)return -224;const i=spine.findIndex(p=>p[0]>x),a=spine[i-1],b=spine[i];return a[1]+(x-a[0])/(b[0]-a[0])*(b[1]-a[1]);}
test('frozen 24/8/1.5 contract; whole coast/hill transition without rectangular clips',()=>{
 assert.deepEqual([contract.lowerTerrainRootsPerSquareMetre,contract.middleTerrainRootsPerSquareMetre,contract.crestRootsPerSquareMetre],[24,8,1.5]);
 for(let x=-500;x<=500;x+=7)for(let dz=-60;dz<=120;dz+=3){const z=divide(x)+dz;assert(Math.abs(hillsideWeight(x,z)-s(-48,-24,dz))<1e-12);for(const y of [0,20,29,38,44,50,75])for(const slope of [0,.18,.3,.46,.8]){const expected=s(-48,-24,dz)*(24-16*s(20,38,y)-6.5*s(38,50,y))*(1-.7*s(.18,.46,slope));const actual=hillsideDensity({x,y,z,shaderSlope:slope,contactDistance:100,sandCoverage:0});assert(Math.abs(actual-expected)<1e-10);}}
 assert.equal(hillsideWeight(-136,-180),1);assert.equal(hillsideWeight(249,-180),1);assert.equal(hillsideWeight(0,-101),1);
 for(const y of [0,18,30,42,80])assert.equal(hillsideDry(0,y,-180),s(18,42,y));
 assert(HILLSIDE_SHORELINE_GLSL.includes('smoothstep(-48.,-24.,p.y-hillsideDivide(p.x))'));
});

// Source-level algebra proof. This does not execute GLSL or claim bitwise GPU
// parity: GLSL highp uses driver float arithmetic, whereas JS uses binary64.
test('shared GLSL divider, shoulder, dry and sand expressions match the CPU law',()=>{
 const expected=`
 float hillsideDivide(float x){
  if(x<=-52.)return -208.;
  if(x<=18.)return mix(-208.,-226.,(x+52.)/70.);
  if(x<=86.)return mix(-226.,-235.,(x-18.)/68.);
  if(x<=148.)return mix(-235.,-224.,(x-86.)/62.);
  return -224.;
 }
 float hillsideWeight(vec2 p){return smoothstep(-48.,-24.,p.y-hillsideDivide(p.x));}
 float hillsideSandCoverage(vec2 p,float slope,float original){return original*(1.-hillsideWeight(p)*smoothstep(.012,.065,slope));}
 float hillsideDry(vec3 p){return hillsideWeight(p.xz)*smoothstep(18.,42.,p.y);}
 `;
 const compact=x=>x.replace(/\s+/g,'');assert.equal(compact(HILLSIDE_SHORELINE_GLSL),compact(expected));
 // mix(a,b,t) = a+(b-a)t; adjacent segment values coincide at every knot.
 // smoothstep(a,b,x) = clamp((x-a)/(b-a),0,1)^2*(3-2*t), all a<b.
 const shaderDivide=x=>x<=-52?-208:x<=18?-208-18*(x+52)/70:x<=86?-226-9*(x-18)/68:x<=148?-235+11*(x-86)/62:-224;
 const xs=[-1000,1000,...[-52,18,86,148].flatMap(x=>[x-1e-6,x,x+1e-6]),-17,52,117];
 for(const x of xs){assert(Math.abs(divide(x)-shaderDivide(x))<1e-12);for(const delta of [-60,-48,-47.999,-36,-24.001,-24,0,100]){
  const z=shaderDivide(x)+delta,weight=s(-48,-24,delta);assert(Math.abs(hillsideWeight(x,z)-weight)<1e-12);
  for(const y of [-10,18,18.001,30,41.999,42,100])assert(Math.abs(hillsideDry(x,y,z)-weight*s(18,42,y))<1e-12);
  for(const slope of [0,.012,.012001,.0385,.064999,.065,1])for(const original of [0,.12,.5,1])assert(Math.abs(hillsideSandCoverage({x,z,shaderSlope:slope,rawSandCoverage:original})-original*(1-weight*s(.012,.065,slope)))<1e-12);
 }}
 const root=new URL('../../',import.meta.url),owner=fs.readFileSync(new URL('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js',root),'utf8'),renderer=fs.readFileSync(new URL('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',root),'utf8');
 assert(owner.includes('${HILLSIDE_SHORELINE_GLSL}'));assert(renderer.includes('${HILLSIDE_SHORELINE_GLSL}'));
 assert(owner.includes('max(foothillDryAmount(aRoot.xyz,uRadius),hillsideDry(aRoot.xyz))'));
 // The frozen hillside law continues governing accepted grass placement.
 // Soil presentation alone no longer follows its straight/horizontal world-Z divider.
 const soilStart=renderer.indexOf('  if(worldSoilTerrain){');
 const soilEnd=renderer.indexOf('  if(clearingType>0.5&&clearingType<1.5){\n    // Texture-derived shallow bark relief',soilStart);
 assert(soilStart>=0&&soilEnd>soilStart,'active terrain shader scope not found');
 const soil=renderer.slice(soilStart,soilEnd);
 assert(soil.includes('materialHillsideWeight=\n      smoothstep(28.0,92.0,max(0.0,vCoastDistanceMeters))*\n      (1.0-smoothstep(0.35,0.65,slope));'));
 assert(soil.includes('float sandCoverage=renderedBeachCoverage('));
 assert(soil.includes('(1.0-materialHillsideWeight*smoothstep(.012,.065,slope))'));
 assert(soil.includes('float steepBank=materialHillsideWeight*smoothstep(.012,.065,slope)'));
 assert(soil.includes('materialHillsideWeight*smoothstep(18.0,42.0,vWorldPosition.y)'));
 assert(!soil.includes('hillsideSandCoverage(world')&&!soil.includes('hillsideDry(vWorldPosition)'));
 const displayWeight=(coast,slope)=>s(28,92,Math.max(0,coast))*(1-s(.35,.65,slope));
 for(const coast of [0,28,48,72,92,140])for(const slope of [0,.2,.35,.5,.65,.9]){
   const weight=displayWeight(coast,slope);
   assert(weight>=0&&weight<=1);
   assert(Math.abs(weight-displayWeight(coast+.00001,slope))<.00001);
 }
});

test('complete census accounting, enclosure on every edge, and frozen quota completion',()=>{
 const cp=read('checkpoint.json'),rows=read('coverage.json.gz');
 assert.equal(cp.baseline,contract.baseline);assert.equal(cp.removed,0);assert(cp.allBaselineRecordsPreserved);
 const [x0,z0,x1,z1]=cp.scanBounds;
 assert.equal(Object.values(cp.censusRejections).reduce((a,b)=>a+b,0)+cp.componentReport.reduce((n,c)=>n+c.cells,0),(x1-x0)*(z1-z0));
 let selected=0;for(const c of cp.componentReport){if(!c.selected){assert.equal(c.exclusionReason,'NO_ESTABLISHED_REGION_INTERSECTION');continue;}selected+=c.cells;assert(c.seeds.length);assert(c.bounds[0]>x0&&c.bounds[1]>z0&&c.bounds[2]<x1&&c.bounds[3]<z1);}
 assert.equal(rows.length,selected);assert.equal(cp.selectedComponentCells,selected);assert.equal(cp.shortFullyEligibleCells,0);
 let changed=0;for(const r of rows){assert(r.after>=r.before);assert.equal(r.requiredOccupancy,Math.max(r.before,r.quota));assert.equal(r.eligibleProbes+Object.values(r.probeRejections).reduce((a,b)=>a+b,0),16);if(r.eligibleProbes===16)assert(r.after>=r.quota);if(r.after<r.quota){assert(r.eligibleProbes<16);assert(Object.values(r.candidateRejections).reduce((a,b)=>a+b,0)>0);}if(r.after>r.before)changed++;}
 assert(changed>10000);assert(cp.added>61338,'must materially exceed previous inadequate additions');
});

// West verifier: actual asset occupancy and independently sampled geometry are
// the oracle; compiler-reported quotas and counts are not accepted on their own.
test('independent full census, every 4x4 probe, actual occupancy and baseline preservation',async()=>{
 const {execFileSync}=await import('node:child_process');
 const {createHash}=await import('node:crypto');
 const {visibleSurface,groundAdmission,materials,cover,geology}=await import('../evidence/hillside-shoreline-continuity-v1/support-fixture.mjs');
 const sha=b=>createHash('sha256').update(b).digest('hex'),root=new URL('../../',import.meta.url),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.';
 const cp=read('checkpoint.json'),rows=read('coverage.json.gz');
 // Execute the frozen North/West 4x4 census on the original output commit,
 // before the later accepted coastal relocations altered root tile prefixes.
 const historic='902b06404965527e98de2612ee824d87ce404eaf';
 const showHistorical=suffix=>execFileSync('git',['show',historic+':'+asset+suffix],{cwd:root,maxBuffer:180*1024*1024});
 const manifest=JSON.parse(showHistorical('json')),raw=gunzipSync(showHistorical('bin.gz'));
 assert.equal(sha(raw),manifest.rawSha256);assert.equal(manifest.rootCount,2858738);
 const priorManifest=JSON.parse(execFileSync('git',['show',contract.baseline+':'+asset+'json'],{cwd:root,maxBuffer:10*1024*1024})),prior=gunzipSync(execFileSync('git',['show',contract.baseline+':'+asset+'bin.gz'],{cwd:root,maxBuffer:120*1024*1024}));
 assert.equal(sha(raw),manifest.rawSha256);assert.equal(sha(fs.readFileSync(new URL('acceptance.json',evidence))),cp.acceptanceSha256);
 const key=(x,z)=>Math.floor(x)+':'+Math.floor(z),before=new Map(),after=new Map(),oldTiles=new Map(),priorPackedTiles=[];let offset=0;
 for(const tile of priorManifest.tiles){const packed=new Float32Array(tile.count*4);for(let i=0;i<tile.count;i++)for(let j=0;j<4;j++)packed[i*4+j]=prior.readDoubleLE(offset+i*52+j*8);priorPackedTiles.push({...tile,packed});oldTiles.set(tile.id,{offset,count:tile.count});for(let i=0;i<tile.count;i++){const o=offset+i*52,k=key(prior.readDoubleLE(o),prior.readDoubleLE(o+16));before.set(k,(before.get(k)||0)+1);}offset+=tile.count*52;}
 offset=0;let preserved=0;
 for(const tile of manifest.tiles){const old=oldTiles.get(tile.id);assert.equal(tile.baselineCount,old?.count||0);if(old){assert(tile.count>=old.count);assert.deepEqual(raw.subarray(offset,offset+old.count*52),prior.subarray(old.offset,old.offset+old.count*52));preserved+=old.count;oldTiles.delete(tile.id);}assert(tile.count<=1600);for(let i=0;i<tile.count;i++){const o=offset+i*52,x=raw.readDoubleLE(o),z=raw.readDoubleLE(o+16),k=key(x,z);assert.equal(tile.id,Math.floor(x/4)+':'+Math.floor(z/4));after.set(k,(after.get(k)||0)+1);}offset+=tile.count*52;}
 assert.equal(preserved,priorManifest.rootCount);assert.equal(oldTiles.size,0);assert.equal(offset,manifest.rootCount*52);assert.equal(manifest.rootCount,priorManifest.rootCount+cp.added);
 for(let z=0;z<192;z++)assert.deepEqual(raw.subarray(offset+z*576,offset+z*576+384),prior.subarray(priorManifest.rootCount*52+z*576,priorManifest.rootCount*52+z*576+384));

 const {runtimePlantingBaselineTiles}=await import('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js');
 const historicalTiles=[];let historicOffset=0;
 for(const tile of manifest.tiles){
  const packed=new Float32Array(tile.count*4);
  for(let i=0;i<tile.count;i++)for(let j=0;j<4;j++)packed[i*4+j]=raw.readDoubleLE(historicOffset+i*52+j*8);
  historicalTiles.push({...tile,packed});historicOffset+=tile.count*52;
 }
 assert.equal(historicOffset,manifest.rootCount*52);
 const runtimeInput=runtimePlantingBaselineTiles(historicalTiles);
 assert.equal(runtimeInput.length,priorPackedTiles.length);
 for(let i=0;i<runtimeInput.length;i++){const actual=runtimeInput[i],old=priorPackedTiles[i];assert.equal(actual.id,old.id);assert.equal(actual.minX,old.minX);assert.equal(actual.minZ,old.minZ);assert.equal(actual.count,old.count);assert.deepEqual(actual.packed,old.packed);}
 const {buildCavernEntranceGrass}=await import('../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js');
 const {buildCavernPalmPlacement}=await import('../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js');
 const runtimeBytes=gunzipSync(fs.readFileSync(new URL('runtime-baseline.json.gz',evidence))),runtime=JSON.parse(runtimeBytes);
 assert.equal(sha(runtimeBytes),cp.runtimeBaselineSha256);
 const regenerated=await buildCavernEntranceGrass({existingTiles:priorPackedTiles,visibleSurface:{...visibleSurface,admitGround:groundAdmission},geology,palms:buildCavernPalmPlacement(geology).receipt.placements});
 const stable=JSON.parse(JSON.stringify(regenerated,(key,value)=>/Ms$|Milliseconds$/.test(key)?undefined:value));
 assert.deepEqual(runtime,stable,'complete prior runtime entrance AND slope population');
 assert(runtime.tiles.some(t=>t.id.startsWith('CAVERN_ENTRANCE:')));assert(runtime.tiles.some(t=>t.id.startsWith('CAVERN_SLOPE:')));
 const runtimeOccupancy=new Map(),physical=new Map(manifest.tiles.map(t=>[t.id,t.count]));let runtimeCount=0;
 for(const tile of runtime.tiles)for(const r of tile.roots){const k=key(r.x,r.z),p=Math.floor(r.x/4)+':'+Math.floor(r.z/4);runtimeOccupancy.set(k,(runtimeOccupancy.get(k)||0)+1);physical.set(p,(physical.get(p)||0)+1);runtimeCount++;}
 assert.equal(runtimeCount,runtime.receipt.contactCount);assert.equal(runtimeCount,cp.runtimeBaselineCount);
 assert.equal(cp.baselineCombinedCount,priorManifest.rootCount+runtimeCount);assert.equal(cp.combinedRootCount,manifest.rootCount+runtimeCount);
 const physicalMax=[...physical.values()].reduce((a,b)=>Math.max(a,b),0);assert(physicalMax<=1600);assert.equal(physicalMax,cp.combinedMaximumTileRoots);
 const sample=(x,z)=>{
  const hit=visibleSurface.sample(x,z);if(!hit)return {reason:'NO_SUPPORT',density:0};
  const water=visibleSurface.water.sample(x,z);if(water&&hit.y<=water.y+.03)return {reason:'WATER',density:0};
  if(hit.slope>1.6)return {reason:'STEEP',density:0};
  if(!groundAdmission(x,z,hit))return {reason:'GROUND_ADMISSION',density:0};
  const authored=cover.inverseHEarthGroundCoverPoint(x,hit.y,z),material=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(authored.x,authored.z);
  if(material?.valid!==true)return {reason:'INVALID_MATERIAL',density:0};
  const soil=material.surfaceClass==='STONE_AND_SPARSE_SOIL'?material.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(material.surfaceClass)&&material.soilDepth>=.20;
  if(!soil)return {reason:'MATERIAL',density:0};
  const beach=visibleSurface.beach.sample({x,z,support:hit});assert(beach.valid);
  const sand=beach.rawSandCoverage,contact=beach.interpolatedExposedContactDistance,slope=beach.shaderSlope;
  const bank=s(.012,.065,slope),shore=s(2,6+10*(1-bank),contact);
  const density=sand>.12||contact<=0?0:s(-48,-24,z-divide(x))*shore*(1-s(0,.12,sand))*(24-16*s(20,38,hit.y)-6.5*s(38,50,hit.y))*(1-.7*s(.18,.46,slope));
  return {reason:density>0?null:'ZERO_TERRAIN_DENSITY',density};
 };
 const probeCache=new Map();
 const probe=(cx,cz)=>{const k=key(cx,cz);if(probeCache.has(k))return probeCache.get(k);const out=[];for(let z=0;z<4;z++)for(let x=0;x<4;x++){const xx=cx+(x+.5)/4,zz=cz+(z+.5)/4;out.push({x:xx,z:zz,...sample(xx,zz)});}probeCache.set(k,out);return out;};
 const [x0,z0,x1,z1]=cp.scanBounds;assert.deepEqual(cp.scanBounds,[-512,-360,512,160]);
 const candidates=new Map(),reasons={},rejected=new Map();
 for(let z=z0;z<z1;z++)for(let x=x0;x<x1;x++){const result=sample(x+.5,z+.5),k=key(x,z);if(result.reason){reasons[result.reason]=(reasons[result.reason]||0)+1;rejected.set(k,result.reason);}else candidates.set(k,{x,z,center:true});}
 assert.equal(candidates.size,cp.centerEligibleCells);
 const frontier=[...candidates.values()],checked=new Set();let included=0;
 for(let i=0;i<frontier.length;i++){const c=frontier[i];for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dz)continue;const x=c.x+dx,z=c.z+dz,k=key(x,z);if(x<x0||x>=x1||z<z0||z>=z1||candidates.has(k)||checked.has(k))continue;checked.add(k);if(!probe(x,z).some(p=>!p.reason))continue;reasons[rejected.get(k)]--;const boundaryCell={x,z,center:false};candidates.set(k,boundaryCell);frontier.push(boundaryCell);included++;}}
 assert.deepEqual(reasons,cp.censusRejections);assert.equal(included,cp.boundaryIncludedCells);assert.equal(checked.size,cp.boundaryCheckedCells);
 const seeded=(x,z)=>(x>=-136&&x<=249&&z>=-253&&z<=-101)||((x+52)/58)**2+((z+208)/46)**2<=1||((x-18)/42)**2+((z+226)/39)**2<=1;
 const selected=new Map(),seen=new Set(),components=[];
 for(const [k,c]of candidates){if(seen.has(k))continue;const queue=[c];seen.add(k);let seeds=false;for(let i=0;i<queue.length;i++){const q=queue[i];if(seeded(q.x+.5,q.z+.5))seeds=true;for(const [dx,dz]of [[0,1],[0,-1],[1,0],[-1,0]]){const kk=key(q.x+dx,q.z+dz);if(candidates.has(kk)&&!seen.has(kk)){seen.add(kk);queue.push(candidates.get(kk));}}}components.push(queue.length);if(seeds)for(const q of queue)selected.set(key(q.x,q.z),q);}
 assert.deepEqual(components.sort((a,b)=>b-a),cp.componentSizes);assert.equal(selected.size,rows.length);
 const hash=(x,z)=>{let h=Math.imul(x^0x51ed270b,1597334677)^Math.imul(z^0x68bc21eb,3812015801)^Math.imul(2876,747796405);h=Math.imul(h^(h>>>16),2246822519);h=Math.imul(h^(h>>>13),3266489917);return(h^(h>>>16))>>>0;};
 let short=0,shortFull=0;
 for(const row of rows){const x=Math.floor(row.x),z=Math.floor(row.z),k=key(x,z),candidate=selected.get(k);assert(candidate,'unexpected/duplicate coverage cell '+k);assert.equal(row.centerEligible,candidate.center);selected.delete(k);assert(x>x0&&x<x1-1&&z>z0&&z<z1-1);
  const probes=probe(x,z),counts={};let sum=0,eligible=0;assert.equal(row.probes.length,16);
  for(let i=0;i<16;i++){const p=probes[i],saved=row.probes[i];assert.equal(saved.x,p.x);assert.equal(saved.z,p.z);assert.equal(saved.reason,p.reason);assert(Math.abs(saved.density-p.density)<1e-10,'probe density '+k);if(p.reason)counts[p.reason]=(counts[p.reason]||0)+1;else{sum+=p.density;eligible++;}}
  const density=sum/16,quota=Math.floor(density)+Number(hash(x,z)/4294967296<density%1),savedOld=before.get(k)||0,savedActual=after.get(k)||0,reserved=runtimeOccupancy.get(k)||0,old=savedOld+reserved,actual=savedActual+reserved;
  assert.equal(row.savedBefore,savedOld);assert.equal(row.savedAfter,savedActual);assert.equal(row.runtimeOccupancy,reserved);assert.equal(row.quota,quota);assert.equal(row.before,old);assert.equal(row.after,actual);assert.equal(row.requiredOccupancy,Math.max(old,quota));assert.deepEqual(row.probeRejections,counts);assert.equal(row.eligibleProbes,eligible);assert(actual>=old);
  if(actual<quota){short++;if(eligible===16)shortFull++;assert(eligible<16);assert(Object.values(row.candidateRejections).reduce((n,v)=>n+v,0)>0);}
 }
 assert.equal(selected.size,0);assert.equal(short,cp.shortCells);assert.equal(shortFull,0);
 console.log('WEST_INDEPENDENT_TERRAIN_CENSUS',JSON.stringify({cells:rows.length,probes:rows.length*16,boundaryCells:included,baselineRootsPreserved:preserved,runtimeRootsPreserved:runtimeCount,combinedMaximumTileRoots:physicalMax,shortCells:short,shortFullyEligibleCells:shortFull}));
});

 
// Preserve the original frozen 4x4 census above. These are separately admitted,
// later relocations; the CURRENT asset must never be substituted for that oracle.
test('post-terrain ledger, 60,963 redistribution moves and 632 planting moves have zero unaccounted root loss',async()=>{
 const {execFileSync}=await import('node:child_process');
 const {createHash}=await import('node:crypto');
 const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),root=new URL('../../',import.meta.url);
 const asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.';
 const maxBuffer=180*1024*1024;
 const git=(commit,suffix)=>execFileSync('git',['show',commit+':'+asset+suffix],{cwd:root,maxBuffer});
 const snapshot=(commit)=>{
  const m=JSON.parse(git(commit,'json')),compressed=git(commit,'bin.gz'),raw=gunzipSync(compressed);
  assert.equal(sha(compressed),m.compressedSha256);
  assert.equal(sha(raw),m.rawSha256);
  assert.equal(m.rootCount,2858738);assert.equal(m.stride,52);
  assert.equal(raw.length,m.rootCount*52+576*192);
  return {m,raw};
 };
 const onDisk=()=>{
  const m=JSON.parse(fs.readFileSync(new URL(asset+'json',root))),compressed=fs.readFileSync(new URL(asset+'bin.gz',root)),raw=gunzipSync(compressed);
  assert.equal(sha(compressed),m.compressedSha256);assert.equal(sha(raw),m.rawSha256);
  assert.equal(m.rootCount,2858738);assert.equal(raw.length,m.rootCount*52+576*192);
  return {m,raw};
 };
 const original=snapshot('902b06404965527e98de2612ee824d87ce404eaf');
 assert.equal(original.m.rawSha256,'a7988a67d4f12eece749b2699655444b73a6384588ed5af78f367dc1145fb50b');
 const before=snapshot('0a1124d4337fdabed155273dbf80b4750188141b');
 assert.equal(before.m.rawSha256,'9b850685afcca54f4a96b45f5b45c2301d114da797449462bf33f831929dcf97');
 const after=snapshot('2f3d00175eaf6edae6d59cf0a5f5fa4e36f9e088');
 assert.equal(after.m.rawSha256,'2f196095203c9a4a250c697496c6734f8d8e60487684d3956bd05950c5a5b020');
 const current=onDisk();
 assert.equal(current.m.rawSha256,'bb5bdea6223aaea0422bac76f73da46d0370e51d81b3fdb280c970c408879a97');
 // Independent multiset: exact (seed, float32 blade angle) pairs survive
 // every epoch, including the earlier accepted post-terrain relocations.
 const invariant=s=>{
  const pairs=new BigUint64Array(s.m.rootCount),angleBits=new DataView(new ArrayBuffer(4));
  const regions=[0,0,0];let index=0;
  for(const tile of s.m.tiles){
   assert(tile.count>=1&&tile.count<=1600);
   assert(tile.baselineCount>=0&&tile.baselineCount<=tile.count);
   for(let j=0;j<tile.count;j++,index++){
    const o=index*52,x=s.raw.readDoubleLE(o),y=s.raw.readDoubleLE(o+8),z=s.raw.readDoubleLE(o+16);
    assert(Number.isFinite(x)&&Number.isFinite(y)&&Number.isFinite(z));
    assert(x>=tile.minX&&x<tile.minX+4&&z>=tile.minZ&&z<tile.minZ+4,'ROOT_OUTSIDE_ACTUAL_TILE');
    const region=s.raw.readUInt32LE(o+48);assert(region<=2);regions[region]++;
    angleBits.setFloat32(0,s.raw.readDoubleLE(o+24),true);
    pairs[index]=(BigInt(s.raw.readUInt32LE(o+40))<<32n)|BigInt(angleBits.getUint32(0,true));
   }
  }
  assert.equal(index,s.m.rootCount);
  pairs.sort();
  return {sha256:sha(Buffer.from(pairs.buffer)),regions};
 };
 const originalInvariant=invariant(original);
 for(const s of [before,after,current])assert.deepEqual(invariant(s),originalInvariant,'ROOT_SEED_ANGLE_REGION_LOSS_OR_DRIFT');
 const rr=JSON.parse(fs.readFileSync(new URL('h-earth-3d/evidence/coastal-grass-redistribution-v1/receipt.json',root)));
 const changeBytes=gunzipSync(fs.readFileSync(new URL('h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz',root)));
 const changes=JSON.parse(changeBytes);
 assert.equal(sha(changeBytes),rr.changesSha256);
 assert.equal(rr.moved,60963);assert.equal(changes.length,rr.moved);
 assert.equal(rr.added,0);assert.equal(rr.removed,0);assert.equal(rr.unmovedDonorCandidates,0);
 assert.equal(rr.unchangedRoots+changes.length,current.m.rootCount);
 assert.equal(rr.rawSha256,after.m.rawSha256);
 const key=(x,y,z,seed)=>[x,y,z,seed].join(':');
 const identity=b=>key(b.readDoubleLE(0),b.readDoubleLE(8),b.readDoubleLE(16),b.readUInt32LE(40));
 const from=new Map(),to=new Map();
 for(const c of changes){
  const kFrom=key(...c.from,c.seed),kTo=key(c.to[0],Math.fround(c.to[1]),c.to[2],c.seed);
  assert(!from.has(kFrom)&&!to.has(kTo),'DUPLICATE_MOVEMENT_RECEIPT');
  from.set(kFrom,c);to.set(kTo,c);
 }
 const select=(s,ids)=>{
  const selected=new Map();for(let o=0;o<s.m.rootCount*52;o+=52){
   const b=s.raw.subarray(o,o+52),id=identity(b);
   if(ids.has(id)){assert(!selected.has(id),'DUPLICATE_MATCHING_ROOT');selected.set(id,b);}
  }assert.equal(selected.size,ids.size,'MISSING_OR_UNACCOUNTED_ROOT');return selected;
 };
 const donors=select(before,from),recipients=select(after,to);
 for(const c of changes){
  const old=donors.get(key(...c.from,c.seed)),now=recipients.get(key(c.to[0],Math.fround(c.to[1]),c.to[2],c.seed));
  assert(old&&now,'UNACCOUNTED_REDISTRIBUTION');
  assert.equal(old.readDoubleLE(24),now.readDoubleLE(24),'BLADE_ANGLE_CHANGED');
  assert.equal(old.readUInt32LE(40),now.readUInt32LE(40),'SEED_CHANGED');
  assert.equal(old.readUInt32LE(48),now.readUInt32LE(48),'REGION_CHANGED');
  assert.equal(now.readUInt32LE(44),c.triangleId,'TRIANGLE_WITNESS_CHANGED');
  assert(Number.isFinite(now.readDoubleLE(32)),'INVALID_RELOCATED_SLOPE');
 }
 const report=JSON.parse(fs.readFileSync(new URL('h-earth-3d/evidence/planting-boundary-repair-v1/compiler-report.json',root)));
 const verify=JSON.parse(fs.readFileSync(new URL('h-earth-3d/evidence/planting-boundary-repair-v1/independent-verification.json',root)));
 assert.equal(report.inputRawSha256,after.m.rawSha256);
 assert.equal(report.rawSha256,current.m.rawSha256);
 assert.equal(report.packedSha256,current.m.packedSha256);
 assert.equal(report.atlasSha256,current.m.atlasSha256);
 assert.equal(report.moved,632);assert.equal(report.changes.length,632);
 assert.equal(report.rootCount,current.m.rootCount);assert.equal(report.prefixesPreserved,true);
 assert.equal(verify.moved,632);assert.equal(verify.seedMultiset,'PASS');
 const repairTo=new Map(),repairFrom=new Set();
 for(const c of report.changes){
  assert(Number.isSafeInteger(c.fromOffset)&&c.fromOffset>=0&&c.fromOffset%52===0&&c.fromOffset<after.m.rootCount*52);
  assert(!repairFrom.has(c.fromOffset));repairFrom.add(c.fromOffset);
  const old=after.raw.subarray(c.fromOffset,c.fromOffset+52);
  assert.equal(old.readUInt32LE(40),c.seed,'PLANTING_REPAIR_DONOR_SEED');
  const destKey=key(...c.to,c.seed);assert(!repairTo.has(destKey),'DUPLICATE_PLANTING_TARGET');
  repairTo.set(destKey,{old,change:c});
 }
 const repaired=select(current,repairTo);
 for(const [k,{old,change}] of repairTo){
  const now=repaired.get(k);assert(now,'MISSING_REPAIRED_ROOT');
  assert.equal(now.readDoubleLE(24),old.readDoubleLE(24));
  assert.equal(now.readUInt32LE(40),old.readUInt32LE(40));
  assert.equal(now.readUInt32LE(48),old.readUInt32LE(48));
  assert(Number.isFinite(now.readDoubleLE(32)));
  assert.equal(now.readDoubleLE(0),change.to[0]);
  assert.equal(now.readDoubleLE(8),change.to[1]);
  assert.equal(now.readDoubleLE(16),change.to[2]);
 }
 // The repair's prefix custody is tested from actual 52-byte records, not
 // from a compiler PASS field. The earlier redistribution may move prefixes.
 assert.equal(after.m.tiles.length,current.m.tiles.length);
 let oldOffset=0,newOffset=0;const prefixHash=createHash('sha256');
 for(let i=0;i<after.m.tiles.length;i++){
  const old=after.m.tiles[i],now=current.m.tiles[i];assert.equal(old.id,now.id);
  assert.equal(old.baselineCount,now.baselineCount);
  const n=old.baselineCount*52;
  assert.deepEqual(after.raw.subarray(oldOffset,oldOffset+n),current.raw.subarray(newOffset,newOffset+n),'CURRENT_PREFIX_CHANGED_'+old.id);
  prefixHash.update(current.raw.subarray(newOffset,newOffset+n));
  oldOffset+=old.count*52;newOffset+=now.count*52;
 }
 assert.equal(prefixHash.digest('hex'),verify.prefixSha256);
 assert.equal(oldOffset,after.m.rootCount*52);assert.equal(newOffset,current.m.rootCount*52);
 for(let z=0;z<192;z++){
  const i=z*576;
  assert.deepEqual(original.raw.subarray(original.m.rootCount*52+i,original.m.rootCount*52+i+384),current.raw.subarray(newOffset+i,newOffset+i+384),'PROTECTED_HABITAT_ATLAS_CHANGED');
 }
 assert.equal(current.m.receipt.coastalRedistribution.moved,60963);
 assert.equal(current.m.receipt.plantingBoundaryRepair.moved,632);
 console.log('POST_TERRAIN_MOVEMENT_CUSTODY',JSON.stringify({originalCensusCommit:'902b06404965527e98de2612ee824d87ce404eaf',redistribution:changes.length,plantingRepair:report.changes.length,roots:current.m.rootCount,zeroUnaccountedSeedAngleRootLoss:true}));
});
