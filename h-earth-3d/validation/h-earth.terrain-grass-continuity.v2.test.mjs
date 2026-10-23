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
 assert(renderer.includes('max(foothillDryAmount(vWorldPosition,uPlanetRadius),hillsideDry(vWorldPosition))'));
 assert(renderer.includes('hillsideSandCoverage(world,slope,renderedBeachCoverage('));
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
 const cp=read('checkpoint.json'),rows=read('coverage.json.gz'),manifest=JSON.parse(fs.readFileSync(new URL(asset+'json',root))),raw=gunzipSync(fs.readFileSync(new URL(asset+'bin.gz',root)));
 const priorManifest=JSON.parse(execFileSync('git',['show',contract.baseline+':'+asset+'json'],{cwd:root,maxBuffer:10*1024*1024})),prior=gunzipSync(execFileSync('git',['show',contract.baseline+':'+asset+'bin.gz'],{cwd:root,maxBuffer:120*1024*1024}));
 assert.equal(sha(raw),manifest.rawSha256);assert.equal(sha(fs.readFileSync(new URL('acceptance.json',evidence))),cp.acceptanceSha256);
 const key=(x,z)=>Math.floor(x)+':'+Math.floor(z),before=new Map(),after=new Map(),oldTiles=new Map(),priorPackedTiles=[];let offset=0;
 for(const tile of priorManifest.tiles){const packed=new Float32Array(tile.count*4);for(let i=0;i<tile.count;i++)for(let j=0;j<4;j++)packed[i*4+j]=prior.readDoubleLE(offset+i*52+j*8);priorPackedTiles.push({...tile,packed});oldTiles.set(tile.id,{offset,count:tile.count});for(let i=0;i<tile.count;i++){const o=offset+i*52,k=key(prior.readDoubleLE(o),prior.readDoubleLE(o+16));before.set(k,(before.get(k)||0)+1);}offset+=tile.count*52;}
 offset=0;let preserved=0;
 for(const tile of manifest.tiles){const old=oldTiles.get(tile.id);assert.equal(tile.baselineCount,old?.count||0);if(old){assert(tile.count>=old.count);assert.deepEqual(raw.subarray(offset,offset+old.count*52),prior.subarray(old.offset,old.offset+old.count*52));preserved+=old.count;oldTiles.delete(tile.id);}assert(tile.count<=1600);for(let i=0;i<tile.count;i++){const o=offset+i*52,x=raw.readDoubleLE(o),z=raw.readDoubleLE(o+16),k=key(x,z);assert.equal(tile.id,Math.floor(x/4)+':'+Math.floor(z/4));after.set(k,(after.get(k)||0)+1);}offset+=tile.count*52;}
 assert.equal(preserved,priorManifest.rootCount);assert.equal(oldTiles.size,0);assert.equal(offset,manifest.rootCount*52);assert.equal(manifest.rootCount,priorManifest.rootCount+cp.added);
 for(let z=0;z<192;z++)assert.deepEqual(raw.subarray(offset+z*576,offset+z*576+384),prior.subarray(priorManifest.rootCount*52+z*576,priorManifest.rootCount*52+z*576+384));
 const {loadPrecomputedGrass,takePrecomputedGrassPlan}=await import('../../showroom/globe/h-earth/render/precomputed-grass.v1.js');
 const {runtimePlantingBaselineTiles}=await import('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js');
 const authenticated=await loadPrecomputedGrass({packed:true,fetchImpl:async url=>new Response(fs.readFileSync(url.pathname))});
 const plan=takePrecomputedGrassPlan(authenticated),runtimeInput=runtimePlantingBaselineTiles(plan.tiles);
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
