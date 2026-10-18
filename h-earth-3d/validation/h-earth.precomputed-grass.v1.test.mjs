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
const fetchImpl=async url=>new Response(await fs.readFile(url));
test('exact accepted roots, atlas, ordering and existing GPU allocation survive loading',async()=>{
 const started=performance.now(),presentation=await loadPrecomputedGrass({fetchImpl}),loaded=performance.now();
 const planned=planImmutableTiles(presentation),packed=Buffer.concat(planned.map(t=>Buffer.from(t.packed.buffer)));
 assert.equal(sha(packed),manifest.packedSha256);assert.equal(packed.length,15810720);
 assert.equal(sha(presentation.habitat.pixels),manifest.atlasSha256);
 assert.equal(planned.reduce((n,t)=>n+t.count,0),988170);
 const original=[],metadata=[];let supplement=0;
 for(const tile of presentation.tiles)for(const r of tile.roots){if(r.region==='RAVINE_SUPPLEMENT'){supplement++;continue;}original.push(r.x,r.y,r.z,r.angle);metadata.push(r.seed,r.region==='RAVINE'?1:0);}
 assert.equal(supplement,463028);assert.equal(original.length/4,525142);
 assert.equal(sha(Buffer.from(Float32Array.from(original).buffer)),'d90752a5e4d9c4f1f3e0bcc56edac6bc53cff09e07f1c70c0b1f12f9fff06dde');
 assert.equal(sha(Buffer.from(Uint32Array.from(metadata).buffer)),'fbdd8604fb367bfce0528edfa01f13d5b797ad9d6a0804e7dfbc57806ac09417');
 console.log('PRECOMPUTED_GRASS_CPU',JSON.stringify({loadMilliseconds:loaded-started,loadAndGpuPackingMilliseconds:performance.now()-started,compressedBytes:compressed.length,roots:988170,networkAndGpuAndBrowserExcluded:true}));
});
test('manifest, compressed payload, raw payload, truncation and network failure fail closed',async()=>{
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async()=>new Response('corrupt')}),/MANIFEST_INTEGRITY/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async url=>String(url).endsWith('.json')?new Response(manifestBytes):new Response(compressed.subarray(1))}),/COMPRESSED_INTEGRITY/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async()=>new Response('',{status:503})}),/MANIFEST_HTTP_503/);
 await assert.rejects(loadPrecomputedGrass({fetchImpl:async url=>String(url).endsWith('.json')?new Response(manifestBytes):new Response('',{status:404})}),/DATA_HTTP_404/);
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
