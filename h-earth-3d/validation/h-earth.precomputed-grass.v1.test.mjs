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
const fetchImpl=async url=>new Response(await fs.readFile(url));
test('exact accepted roots, atlas, ordering and existing GPU allocation survive loading',async()=>{
 const started=performance.now(),presentation=await loadPrecomputedGrass({fetchImpl}),loaded=performance.now();
 const planned=planImmutableTiles(presentation),packed=Buffer.concat(planned.map(t=>Buffer.from(t.packed.buffer)));
 assert.equal(sha(packed),manifest.packedSha256);assert.equal(packed.length,repair.totalContacts*16);
 assert.equal(sha(presentation.habitat.pixels),manifest.atlasSha256);
 assert.equal(planned.reduce((n,t)=>n+t.count,0),repair.totalContacts);
 const original=[],metadata=[];let supplement=0;
 for(const tile of presentation.tiles)for(const r of tile.roots){if(r.region==='RAVINE_SUPPLEMENT'){supplement++;continue;}original.push(r.x,r.y,r.z,r.angle);metadata.push(r.seed,r.region==='RAVINE'?1:0);}
 assert.equal(supplement,602761+repair.addedContacts);assert.equal(original.length/4,525142);
 assert.equal(sha(Buffer.from(Float32Array.from(original).buffer)),'d90752a5e4d9c4f1f3e0bcc56edac6bc53cff09e07f1c70c0b1f12f9fff06dde');
 assert.equal(sha(Buffer.from(Uint32Array.from(metadata).buffer)),'fbdd8604fb367bfce0528edfa01f13d5b797ad9d6a0804e7dfbc57806ac09417');
 console.log('PRECOMPUTED_GRASS_CPU',JSON.stringify({loadMilliseconds:loaded-started,loadAndGpuPackingMilliseconds:performance.now()-started,compressedBytes:compressed.length,roots:repair.totalContacts,networkAndGpuAndBrowserExcluded:true}));
});
test('manifest, compressed payload, raw payload, truncation and network failure fail closed',async()=>{
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async()=>new Response('corrupt')}),/MANIFEST_INTEGRITY/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async url=>String(url).endsWith('.json')?new Response(manifestBytes):new Response(compressed.subarray(1))}),/COMPRESSED_INTEGRITY/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async()=>new Response('',{status:503})}),/MANIFEST_HTTP_503/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async url=>String(url).endsWith('.json')?new Response(manifestBytes):new Response('',{status:404})}),/DATA_HTTP_404/);
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
 assert(replacement.includes('await loadPrecomputedGrass('));
 assert(!replacement.includes('await buildWoodlandFineGrass('));assert(!replacement.includes('await buildWoodlandHabitatField('));
 assert(replacement.includes('await createSingleOwnerVegetation(gl,presentation,'));
 assert(replacement.includes('mask.width!==104||mask.height!==146||mask.grassTuftCount!==350'));
});
test('spatial repair preserves every baseline record and woodland texel, with exact admitted additions',async()=>{
 const checkpoint=JSON.parse(await fs.readFile(new URL('h-earth-3d/evidence/grass-spatial-repair-v1/checkpoint.json',root)));
 const input=gunzipSync(await fs.readFile(new URL('h-earth-3d/evidence/grass-spatial-repair-v1/roots.json.gz',root)));
 assert.equal(sha(input),checkpoint.savedCandidateSha256);
 const expected=new Map(JSON.parse(input).map(r=>[r.x+':'+r.z,r]));assert.equal(expected.size,checkpoint.addedContacts);
 const counts=new Map(checkpoint.originalTileCounts.map(t=>[t.id,t.count])),raw=gunzipSync(compressed),original=[];let offset=0,added=0;
 for(const t of manifest.tiles){
  const n=counts.get(t.id)||0;assert(t.count>=n&&t.count<=1600);original.push(raw.subarray(offset,offset+n*52));
  for(let i=n;i<t.count;i++){
   const o=offset+i*52,x=raw.readDoubleLE(o),z=raw.readDoubleLE(o+16),key=x+':'+z,r=expected.get(key);assert(r,'unexpected or duplicate addition '+key);
   assert.equal(t.id,Math.floor(x/4)+':'+Math.floor(z/4));
   for(const [j,k]of ['x','y','z','angle','slope'].entries())assert.equal(raw.readDoubleLE(o+j*8),r[k]);
   assert.equal(raw.readUInt32LE(o+40),r.seed);assert.equal(raw.readUInt32LE(o+44),r.triangleId);assert.equal(raw.readUInt32LE(o+48),2);
   expected.delete(key);added++;
  }
  offset+=t.count*52;
 }
 assert.equal(added,checkpoint.addedContacts);assert.equal(expected.size,0);
 assert.equal(sha(Buffer.concat(original)),checkpoint.originalRootsSha256);
 const {execFileSync}=await import('node:child_process');
 const baselineRaw=gunzipSync(execFileSync('git',['show','12357909b2cbaab16052b6c30459065547fe9440:showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz'],{cwd:root,maxBuffer:100*1024*1024}));
 assert.deepEqual(Buffer.concat(original),baselineRaw.subarray(0,1127903*52));
 const atlas=raw.subarray(offset),woodland=[];for(let z=0;z<192;z++)woodland.push(atlas.subarray(z*384,z*384+192));
 assert.equal(sha(Buffer.concat(woodland)),'0097da1d3979fde2ba0ac2d6582469ff194063ff74036ea3fd37d48f1b2b99d2');
 assert.equal(manifest.receipt.grassContinuity.totalContacts,repair.totalContacts);
 assert.equal(manifest.receipt.grassContinuity.addedContacts,602761+repair.addedContacts);
 assert.equal(manifest.receipt.foothillMeadow.originalRootsPreserved,true);
});
test('fine silhouette preserves height and distance detail, and soil treatment stays habitat-bound',async()=>{
 const owner=await fs.readFile(new URL('vegetation-single-owner.prototype.v1.js',render),'utf8');
 const width=owner.match(/float width=mix\((\.[0-9]+),(\.[0-9]+),h\)\*scale;/);assert(width);assert(+width[1]>=.010&&+width[2]<=.016);
 assert(owner.includes('float height=mix(.11,.21,h)*scale;'));
 assert(owner.includes('float scale=uFine==1?detail:1.;'));
 const renderer=await fs.readFile(new URL('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',render),'utf8');
 const block=renderer.slice(renderer.indexOf('if(worldSoilTerrain&&uWoodlandHabitatEnabled==1){'),renderer.indexOf('// Front-bank contrast follows'));
 assert(block.includes('vec3 habitatSoil=vec3(0.105,0.112,0.060)'));
 assert(block.includes('base=mix(base,habitatSoil,habitatCoverage*.68);'));
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
