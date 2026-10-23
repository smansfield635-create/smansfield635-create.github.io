import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {hillsideWeight,hillsideSandCoverage,hillsideDensity,HILLSIDE_SHORELINE} from '../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
const root=new URL('../../',import.meta.url),evidence='h-earth-3d/evidence/hillside-shoreline-continuity-v1/',asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',read=p=>fs.readFileSync(new URL(p,root)),sha=b=>createHash('sha256').update(b).digest('hex');
const checkpoint=JSON.parse(read(evidence+'checkpoint.json')),manifest=JSON.parse(read(asset+'json')),raw=gunzipSync(read(asset+'bin.gz')),added=gunzipSync(read(evidence+'added.bin.gz'));
const records=b=>Array.from({length:b.length/52},(_,i)=>b.subarray(i*52,(i+1)*52));
export const addedRecords=records(added).map(b=>({x:b.readDoubleLE(0),y:b.readDoubleLE(8),z:b.readDoubleLE(16),angle:b.readDoubleLE(24),slope:b.readDoubleLE(32),seed:b.readUInt32LE(40),triangleId:b.readUInt32LE(44),region:'RAVINE_SUPPLEMENT'}));
test('whole baseline retained byte-exact, additions unique and bounded, atlas panels preserved',()=>{
 const priorJson=JSON.parse(execFileSync('git',['show',checkpoint.baseline+':'+asset+'json'],{cwd:root})),prior=gunzipSync(execFileSync('git',['show',checkpoint.baseline+':'+asset+'bin.gz'],{cwd:root,maxBuffer:120*1024*1024}));
 assert.equal(checkpoint.removed,0);assert.equal(sha(added),checkpoint.addedSha256);assert.equal(sha(raw),manifest.rawSha256);assert.equal(sha(read(asset+'bin.gz')),manifest.compressedSha256);
 const expected=new Map(records(added).map(b=>[b.readDoubleLE(0)+':'+b.readDoubleLE(16),b])),counts=new Map(priorJson.tiles.map(t=>[t.id,t.count])),preserved=[],outside=[],unique=new Set();let offset=0;
 for(const t of manifest.tiles){const n=counts.get(t.id)||0;assert(t.count>=n&&t.count<=1600);preserved.push(raw.subarray(offset,offset+n*52));for(let i=0;i<t.count;i++){const b=raw.subarray(offset+i*52,offset+(i+1)*52),x=b.readDoubleLE(0),z=b.readDoubleLE(16),key=x+':'+z;assert(!unique.has(key));unique.add(key);assert.equal(t.id,Math.floor(x/4)+':'+Math.floor(z/4));if(i>=n){assert.deepEqual(b,expected.get(key));expected.delete(key);}if(!hillsideWeight(x,z))outside.push(b);}offset+=t.count*52;}
 assert.equal(expected.size,0);assert.deepEqual(Buffer.concat(preserved),prior.subarray(0,priorJson.rootCount*52));assert.equal(sha(Buffer.concat(outside)),checkpoint.outsideSha256);
 const atlas=raw.subarray(offset),oldAtlas=prior.subarray(priorJson.rootCount*52);for(let z=0;z<192;z++)assert.deepEqual(atlas.subarray(z*576,z*576+384),oldAtlas.subarray(z*576,z*576+384));
 assert(manifest.rootCount<=HILLSIDE_SHORELINE.maximumRoots);assert.equal(manifest.rootCount,priorJson.rootCount+checkpoint.added);assert(manifest.compressedBytes<priorJson.compressedBytes*1.10);
});
test('beach and bank laws have smooth boundaries, no water-only override, and preserve outside region',()=>{
 const at=(s,c=1,x=0,z=-180)=>hillsideSandCoverage({x,z,shaderSlope:s,rawSandCoverage:c});
 assert.equal(at(0),1);assert.equal(at(.01),1);assert.equal(at(.08),0);assert.equal(at(.08,1,300),1);assert.equal(at(.08,0),0);
 for(let s=0;s<.2;s+=.0001)assert(Math.abs(at(s+.0001)-at(s))<.003);
 for(const [x,z]of [[-136,-180],[249,-180],[0,-253],[0,-101]]){assert.equal(hillsideWeight(x,z),0);assert.equal(at(.08,.8,x,z),.8);}
 for(const contactDistance of [-10,0])assert.equal(hillsideDensity({x:0,y:5,z:-180,shaderSlope:.1,contactDistance,sandCoverage:0}),0);
 assert.equal(hillsideDensity({x:0,y:5,z:-180,shaderSlope:0,contactDistance:5,sandCoverage:1}),0);
 assert(hillsideDensity({x:0,y:5,z:-180,shaderSlope:.1,contactDistance:8,sandCoverage:0})>5);
 const shader=read('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').toString();assert(shader.includes('${HILLSIDE_SHORELINE_GLSL}'));assert(shader.includes('hillsideSandCoverage(world,slope,renderedBeachCoverage('));
 const provider=read('showroom/globe/h-earth/render/vegetation-visible-surface.v1.js').toString();assert(provider.includes('shaderSlope:b.shaderSlope,rawSandCoverage:b.rawSandCoverage'));
});
test('coverage is one connected component, every eligible quota filled, uplands and near banks improved',()=>{
 const c=JSON.parse(read(evidence+'coverage.json'));assert.equal(c.length,checkpoint.eligibleCells);assert.equal(checkpoint.shortCells,0);assert(checkpoint.componentSizes[0]>37000);assert(checkpoint.componentSizes[1]<20);
 for(const p of c){assert(p.after>=p.quota);assert(p.sand<=.12);}
 const changed=c.filter(p=>p.after>p.before);assert(changed.length>10000);
 assert(changed.some(p=>p.y>32));assert(changed.some(p=>p.contact<10&&p.slope>.25));
});
test('every new root is grounded on actual geometry, dry, admitted, and within shared classification',async()=>{
 const {visibleSurface,groundAdmission,materials,cover}=await import('../evidence/hillside-shoreline-continuity-v1/support-fixture.mjs');
 for(const r of addedRecords){assert(hillsideWeight(r.x,r.z)>0);const s=visibleSurface.sample(r.x,r.z);assert(s);assert.equal(Math.fround(s.y),r.y);assert.equal(s.triangleId,r.triangleId);assert.equal(s.slope,r.slope);assert(s.slope<=1.6);assert(groundAdmission(r.x,r.z,s));const b=visibleSurface.beach.sample({x:r.x,z:r.z,support:s});assert(b.valid&&b.rawSandCoverage<=.12);const w=visibleSurface.water.sample(r.x,r.z);assert(!w||s.y>w.y+.03);const a=cover.inverseHEarthGroundCoverPoint(r.x,r.y,r.z),m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);assert(m.valid);assert(m.soilDepth>=(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?.035:.20));assert(hillsideDensity({x:r.x,y:r.y,z:r.z,shaderSlope:b.shaderSlope,contactDistance:b.interpolatedExposedContactDistance,sandCoverage:b.rawSandCoverage})>0);}
});

test('combined precomputed and runtime entrance population respects existing GPU allocation',async()=>{
 const {visibleSurface,geology,groundAdmission}=await import('../evidence/hillside-shoreline-continuity-v1/support-fixture.mjs');
 const {loadPrecomputedGrass,takePrecomputedGrassPlan}=await import('../../showroom/globe/h-earth/render/precomputed-grass.v1.js');
 const {buildCavernEntranceGrass}=await import('../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js');
 const {buildCavernPalmPlacement}=await import('../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js');
 const {GRASS_CONTINUITY_ALLOCATION:a}=await import('../../showroom/globe/h-earth/render/grass-continuity-supplement.v1.js');
 const p=await loadPrecomputedGrass({packed:true,fetchImpl:async u=>new Response(fs.readFileSync(u.pathname))}),plan=takePrecomputedGrassPlan(p);
 const entrance=await buildCavernEntranceGrass({existingTiles:plan.tiles,visibleSurface:{...visibleSurface,admitGround:groundAdmission},geology,palms:buildCavernPalmPlacement(geology).receipt.placements});
 const priorManifest=JSON.parse(execFileSync('git',['show',checkpoint.baseline+':'+asset+'json'],{cwd:root}));
 const priorCounts=new Map(priorManifest.tiles.map(t=>[t.id,t.count]));
 const oldTiles=plan.tiles.filter(t=>priorCounts.has(t.id)).map(t=>({...t,count:priorCounts.get(t.id),packed:t.packed.slice(0,priorCounts.get(t.id)*4)}));
 const baselineEntrance=await buildCavernEntranceGrass({existingTiles:oldTiles,visibleSurface:{...visibleSurface,admitGround:groundAdmission},geology,palms:buildCavernPalmPlacement(geology).receipt.placements});
 const caveRoots=p=>p.tiles.filter(t=>t.id.startsWith('CAVERN_ENTRANCE:')).flatMap(t=>t.roots).map(r=>JSON.stringify(r)).sort();
 assert.deepEqual(caveRoots(entrance),caveRoots(baselineEntrance),'existing cave entrance roots preserved');
 const base=plan.tiles.reduce((n,t)=>n+t.count,0),combined=base+entrance.receipt.contactCount;
 assert(combined<=a.maximumRoots,`combined ${combined} exceeds ${a.maximumRoots}`);assert(combined*16<=a.maximumPackedBytes);assert(entrance.receipt.interiorCount>0);
 console.log('COMBINED_POPULATION_BUDGET',JSON.stringify({base,entrance:entrance.receipt.contactCount,combined,limit:a.maximumRoots,headroom:a.maximumRoots-combined}));
});
