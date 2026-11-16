import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {loadPrecomputedGrass,decodePrecomputedGrass} from '../../showroom/globe/h-earth/render/precomputed-grass.v1.js';
import {planImmutableTiles} from '../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';
const root=new URL('../../',import.meta.url),render=new URL('showroom/globe/h-earth/render/',root);
const manifestBytes=await fs.readFile(new URL('assets/precomputed-grass.v1.json',render));
const manifest=JSON.parse(manifestBytes),compressed=await fs.readFile(new URL('assets/precomputed-grass.v1.bin.gz',render));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const repair=JSON.parse(await fs.readFile(new URL('h-earth-3d/evidence/grass-spatial-repair-v1/checkpoint.json',root)));
const coastal=JSON.parse(await fs.readFile(new URL('h-earth-3d/evidence/grass-coastal-v1/checkpoint.json',root)));
const hillside=JSON.parse(await fs.readFile(new URL('h-earth-3d/evidence/hillside-shoreline-continuity-v1/checkpoint.json',root)));
const hillsideBytes=gunzipSync(await fs.readFile(new URL('h-earth-3d/evidence/hillside-shoreline-continuity-v1/added.bin.gz',root)));
const hillsideAdded=Array.from({length:hillsideBytes.length/52},(_,i)=>{const b=hillsideBytes.subarray(i*52,(i+1)*52);return{x:b.readDoubleLE(0),y:b.readDoubleLE(8),z:b.readDoubleLE(16),angle:b.readDoubleLE(24),slope:b.readDoubleLE(32),seed:b.readUInt32LE(40),triangleId:b.readUInt32LE(44),region:'RAVINE_SUPPLEMENT'};});
assert.equal(hillside.removed,0);assert.equal(sha(hillsideBytes),hillside.addedSha256);
const terrain=JSON.parse(await fs.readFile(new URL('h-earth-3d/evidence/terrain-grass-continuity-v2/checkpoint.json',root)));
const terrainBytes=gunzipSync(await fs.readFile(new URL('h-earth-3d/evidence/terrain-grass-continuity-v2/added.bin.gz',root)));
const terrainAdded=Array.from({length:terrainBytes.length/52},(_,i)=>{const b=terrainBytes.subarray(i*52,(i+1)*52);return{x:b.readDoubleLE(0),y:b.readDoubleLE(8),z:b.readDoubleLE(16),angle:b.readDoubleLE(24),slope:b.readDoubleLE(32),seed:b.readUInt32LE(40),triangleId:b.readUInt32LE(44),region:'RAVINE_SUPPLEMENT'};});
assert.equal(terrain.removed,0);assert.equal(sha(terrainBytes),terrain.addedSha256);
const fetchImpl=async url=>new Response(await fs.readFile(url));
test('exact accepted roots, atlas and ordering survive loading',async()=>{
 const started=performance.now(),presentation=await loadPrecomputedGrass({fetchImpl}),loaded=performance.now();
 const planned=planImmutableTiles(presentation),packed=Buffer.concat(planned.map(t=>Buffer.from(t.packed.buffer)));
 assert.equal(sha(packed),manifest.packedSha256);assert.equal(packed.length,manifest.rootCount*16);
 assert.equal(sha(presentation.habitat.pixels),manifest.atlasSha256);
 assert.equal(planned.reduce((n,t)=>n+t.count,0),manifest.rootCount);

 assert.equal(manifest.rootCount,2858738);
 assert.equal(manifest.stride,52);
 assert.equal(manifest.receipt.grassContinuity.originalCount,525142);
 assert.equal(manifest.originalPackedSha256,'d90752a5e4d9c4f1f3e0bcc56edac6bc53cff09e07f1c70c0b1f12f9fff06dde');
 assert.equal(manifest.originalSeedRegionSha256,'fbdd8604fb367bfce0528edfa01f13d5b797ad9d6a0804e7dfbc57806ac09417');
 assert.equal(manifest.receipt.coastalRedistribution.moved,60963);
 assert.equal(manifest.receipt.coastalRedistribution.added,0);
 assert.equal(manifest.receipt.coastalRedistribution.removed,0);
 assert.equal(manifest.receipt.plantingBoundaryRepair.moved,632);
 assert.equal(manifest.receipt.plantingBoundaryRepair.prefixesPreserved,true);
 assert.equal(manifest.receipt.grassContinuity.totalContacts,manifest.rootCount);
 console.log('PRECOMPUTED_GRASS_CPU',JSON.stringify({loadMilliseconds:loaded-started,loadAndGpuPackingMilliseconds:performance.now()-started,compressedBytes:compressed.length,roots:manifest.rootCount,networkAndGpuAndBrowserExcluded:true}));
});
test('manifest, compressed payload, raw payload, truncation and network failure fail closed',async()=>{
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async()=>new Response('corrupt')}),/MANIFEST_INTEGRITY/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async url=>url.pathname.endsWith('.json')?new Response(manifestBytes):new Response(compressed.subarray(1))}),/COMPRESSED_INTEGRITY/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async()=>new Response('',{status:503})}),/STARTUP_ASSET_FAILED:.*precomputed-grass\.v1\.json:HTTP_503/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async url=>url.pathname.endsWith('.json')?new Response(manifestBytes):new Response('',{status:404})}),/STARTUP_ASSET_FAILED:.*precomputed-grass\.v1\.bin\.gz:HTTP_404/);
 const seedCorrupt=gunzipSync(compressed);seedCorrupt[40]^=1;
 await assert.rejects(decodePrecomputedGrass(manifest,seedCorrupt),/DATA_INTEGRITY/);
 const raw=gunzipSync(compressed);raw[24]^=1;
 await assert.rejects(decodePrecomputedGrass(manifest,raw),/DATA_INTEGRITY/);
 await assert.rejects(decodePrecomputedGrass(manifest,raw.subarray(1)),/DATA_INTEGRITY/);
 await assert.rejects(decodePrecomputedGrass({...manifest,rootCount:1},raw),/IDENTITY_MISMATCH/);
});
test('replacement loads static planting without calling the terrain-generation loop',async()=>{
 const source=await fs.readFile(new URL('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',render),'utf8');
 const replacement=source.slice(source.indexOf('  function prepareReplacementVegetation'),source.indexOf('  async function uploadGlobalCover'));
 assert(replacement.includes('settle(loadPrecomputedGrass({packed:true,'));assert(replacement.includes('const grassResult=await grassPromise;if(grassResult.error)throw grassResult.error;'));
 assert(!replacement.includes('await buildWoodlandFineGrass('));assert(!replacement.includes('await buildWoodlandHabitatField('));
 assert(replacement.includes('await createSingleOwnerVegetation(gl,presentation,'));
 assert(replacement.includes('mask.width!==104||mask.height!==146||mask.grassTuftCount!==350'));
});
test('spatial repair preserves every baseline record and woodland texel, with exact admitted additions',async()=>{
 const checkpoint=JSON.parse(await fs.readFile(new URL('h-earth-3d/evidence/grass-spatial-repair-v1/checkpoint.json',root)));
 const input=gunzipSync(await fs.readFile(new URL('h-earth-3d/evidence/grass-spatial-repair-v1/roots.json.gz',root)));
 assert.equal(sha(input),checkpoint.savedCandidateSha256);
 const coastalInput=gunzipSync(await fs.readFile(new URL('h-earth-3d/evidence/grass-coastal-v1/roots.json.gz',root)));assert.equal(sha(coastalInput),coastal.savedCandidateSha256);
 const expected=new Map([...JSON.parse(input),...JSON.parse(coastalInput),...hillsideAdded,...terrainAdded].map(r=>[r.x+':'+r.z,r]));assert.equal(expected.size,checkpoint.addedContacts+coastal.addedContacts+hillside.added+terrain.added);

 // The original source census belongs to the immutable terrain-output snapshot,
 // not to the later legally relocated 2,858,738-root planting asset.
 const {execFileSync}=await import('node:child_process');
 const asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.';
 const historic='902b06404965527e98de2612ee824d87ce404eaf';
 const show=suffix=>execFileSync('git',['show',historic+':'+asset+suffix],{cwd:root,maxBuffer:180*1024*1024});
 const frozenManifest=JSON.parse(show('json')),raw=gunzipSync(show('bin.gz'));
 assert.equal(frozenManifest.rootCount,2858738);
 assert.equal(sha(raw),frozenManifest.rawSha256);
 assert.equal(sha(show('bin.gz')),frozenManifest.compressedSha256);
 const counts=new Map(checkpoint.originalTileCounts.map(t=>[t.id,t.count])),original=[];let offset=0,added=0;
 for(const t of frozenManifest.tiles){
  const n=counts.get(t.id)||0;assert(t.count>=n&&t.count<=1600);
  original.push(raw.subarray(offset,offset+n*52));
  for(let i=n;i<t.count;i++){
   const o=offset+i*52,x=raw.readDoubleLE(o),z=raw.readDoubleLE(o+16),key=x+':'+z,r=expected.get(key);assert(r,'unexpected or duplicate historical addition '+key);
   assert.equal(t.id,Math.floor(x/4)+':'+Math.floor(z/4));
   for(const [j,k]of ['x','y','z','angle','slope'].entries())assert.equal(raw.readDoubleLE(o+j*8),r[k]);
   assert.equal(raw.readUInt32LE(o+40),r.seed);assert.equal(raw.readUInt32LE(o+44),r.triangleId);assert.equal(raw.readUInt32LE(o+48),2);
   expected.delete(key);added++;
  }
  offset+=t.count*52;
 }
 assert.equal(added,checkpoint.addedContacts+coastal.addedContacts+hillside.added+terrain.added);
 assert.equal(expected.size,0);
 assert.equal(offset,frozenManifest.rootCount*52);
 assert.equal(sha(Buffer.concat(original)),checkpoint.originalRootsSha256);
 const baselineRaw=gunzipSync(execFileSync('git',['show','12357909b2cbaab16052b6c30459065547fe9440:'+asset+'bin.gz'],{cwd:root,maxBuffer:180*1024*1024}));
 assert.deepEqual(Buffer.concat(original),baselineRaw.subarray(0,1127903*52));
 const atlas=raw.subarray(offset),woodland=[];for(let z=0;z<192;z++)woodland.push(atlas.subarray(z*576,z*576+192));
 assert.equal(sha(Buffer.concat(woodland)),'0097da1d3979fde2ba0ac2d6582469ff194063ff74036ea3fd37d48f1b2b99d2');
 const originalFloat=[],originalMetadata=[];
 for(let o=0;o<offset;o+=52){
  const region=raw.readUInt32LE(o+48);if(region===2)continue;assert(region===0||region===1);
  for(const j of [0,8,16,24])originalFloat.push(raw.readDoubleLE(o+j));
  originalMetadata.push(raw.readUInt32LE(o+40),region);
 }
 assert.equal(originalFloat.length/4,525142);
 assert.equal(sha(Buffer.from(Float32Array.from(originalFloat).buffer)),manifest.originalPackedSha256);
 assert.equal(sha(Buffer.from(Uint32Array.from(originalMetadata).buffer)),manifest.originalSeedRegionSha256);
 assert.equal(manifest.receipt.grassContinuity.totalContacts,repair.totalContacts+coastal.addedContacts+hillside.added+terrain.added);
 assert.equal(manifest.receipt.grassContinuity.addedContacts,602761+repair.addedContacts+coastal.addedContacts+hillside.added+terrain.added);
 assert.equal(manifest.receipt.foothillMeadow.originalRootsPreserved,true);
});
test('fine silhouette has accepted numeric width, LOD, blade-height and habitat-bound soil limits',async()=>{
 const owner=await fs.readFile(new URL('vegetation-single-owner.prototype.v1.js',render),'utf8');
 const width=owner.match(/float width\s*=\s*mix\(\s*(\.?\d+(?:\.\d+)?)\s*,\s*(\.?\d+(?:\.\d+)?)\s*,\s*h\s*\)\s*\*\s*scale\s*\*\s*mix\(\s*(\.?\d+(?:\.\d+)?)\s*,\s*(\.?\d+(?:\.\d+)?)\s*,\s*tuftVariation\s*\)/);
 assert(width,'width must keep the two-axis tuft-variation operator');
 const [baseMin,baseMax,tuftMin,tuftMax]=width.slice(1).map(Number);
 assert(baseMin>=.010&&baseMax<=.016&&baseMin>0&&baseMin<=baseMax);
 assert.equal(tuftMin,1.18);assert.equal(tuftMax,1.42);
 const lod=owner.match(/float d=length\(aRoot\.xz-uCamera\.xz\),t=clamp\(\(d-(\d+(?:\.\d*)?)\)\/(\d+(?:\.\d*)?)\s*,\s*0\.?\s*,\s*1\.?\s*\)/);
 assert(lod,'fine-lobe distance transition missing');
 const lodStart=Number(lod[1]),lodSpan=Number(lod[2]);
 assert.equal(lodStart,14);assert.equal(lodStart+lodSpan,24);
 const {detailWeight}=await import('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js');
 const smooth=t=>t*t*(3-2*t);
 for(const d of [0,12,14,15,17,19,21,23,24,30]){
  const t=Math.max(0,Math.min(1,(d-lodStart)/lodSpan)),expected=1-smooth(t);
  assert(Math.abs(detailWeight(d)-expected)<1e-12,'fine-lobe fade regression '+d);
  for(const h of [0,.2,.5,.8,1])for(const tuft of [0,.25,.5,.75,1]){
   const actual=(baseMin+(baseMax-baseMin)*h)*(tuftMin+(tuftMax-tuftMin)*tuft);
   assert(actual>=baseMin*tuftMin-1e-12&&actual<=baseMax*tuftMax+1e-12);
   assert(actual*expected>=0&&actual*expected<=baseMax*tuftMax+1e-12);
  }
 }
 const height=owner.match(/float height\s*=\s*mix\(\s*mix\(\s*(\.?\d+(?:\.\d+)?)\s*,\s*(\.?\d+(?:\.\d+)?)\s*,h\s*\),\s*entranceHeight,\s*entrance\s*\)\s*\*\s*scale/);
 assert(height,'approved root-to-entrance height blend missing');
 assert.equal(Number(height[1]),.11);assert.equal(Number(height[2]),.21);
 assert(owner.includes('int k=gl_VertexID%6;')&&owner.includes('gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count)'));
 const renderer=await fs.readFile(new URL('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',render),'utf8');
 const begin=renderer.indexOf('if(worldSoilTerrain&&uWoodlandHabitatEnabled==1){'),end=renderer.indexOf('// Front-bank contrast follows',begin);
 assert(begin>=0&&end>begin,'protected habitat-color shader region missing');
 const block=renderer.slice(begin,end);
 assert(block.includes('habitatCoverage=texture(uWoodlandHabitat')&&block.includes('habitatMaterialCoverage=texture(uHabitatMaterialPresentation'));
 assert(block.includes('float gen3259OriginalHabitat=habitatColorCoverage;'));
 const strength=block.match(/float gen3259SoilStrength\s*=\s*mix\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,/);
 const colorBlend=block.match(/base\s*=\s*mix\(base,habitatSoil,habitatColorCoverage\s*\*\s*([\d.]+)\s*\)/);
 assert(strength&&colorBlend,'bounded R8 material operator missing');
 const [lo,hi]=strength.slice(1).map(Number),mixLimit=Number(colorBlend[1]);
 assert(lo>=0&&lo<=hi&&hi<=.16);assert(mixLimit>0&&mixLimit<=.68);
 assert(/gen3259MeadowExcess\s*=\s*max\(0\.0,meadowOccupancy\s*\*\s*meadowOuterWeight-gen3259OriginalHabitat\)/.test(block));
 for(const habitat of [0,.05,.4,1])for(const occupancy of [0,.1,.5,1])for(const outer of [0,.5,1])for(const fade of [0,.5,1])for(const soilStrength of [lo,hi]){
  const excess=Math.max(0,occupancy*outer-habitat),coverage=habitat+excess*soilStrength*fade;
  assert(coverage>=habitat-1e-12&&coverage<=1+1e-12);
  assert(coverage*mixLimit<=mixLimit+1e-12);
  if(occupancy===0)assert.equal(excess,0,'zero R8 occupancy must add no soil tint');
  if(habitat===0&&occupancy===0)assert.equal(coverage,0);
 }
});
 
test('uphill color stays inside confirmed foothills and retains the original habitat region',async()=>{
 const {sampleFoothillMeadowField:sample}=await import('../../showroom/globe/h-earth/render/foothill-meadow-field.v1.js');
 const {projectRegionVertex:project}=await import('../terrain/h-earth.geological-formation-successor.v1.mjs');
 const at=(x,z,h)=>{const p=project(x,h,z);return sample(p.x,p.y,p.z);};
 const low=at(-52,-208,12),high=at(-52,-208,25);
 assert.equal(low.dry,0);assert(high.dry>.5);assert(high.density<low.density);
 for(const [x,z] of [[-141,-226],[86,-235],[148,-224],[72,-172],[-9,-300]])assert.equal(at(x,z,35).dry,0);
 assert.deepEqual(manifest.habitat.ravine.bounds,manifest.habitat.receipt.ravine.bounds);
 assert.equal(manifest.receipt.foothillMeadow.connectorRoute.belowQuarter,0);
 assert.equal(manifest.receipt.foothillMeadow.oldRavineWorldSpaceDelta.oldNonzeroLost,0);
});
