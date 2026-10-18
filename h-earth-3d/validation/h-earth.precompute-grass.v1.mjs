/** Offline compiler of the accepted b6dc7d7f planting; never runs in a browser. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
export const baseline='b6dc7d7fed63316af13c339b5583ee97842a00f4';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const render='showroom/globe/h-earth/render/';
const sha=b=>createHash('sha256').update(b).digest('hex');
const source=p=>execFileSync('git',['show',baseline+':'+p],{cwd:root,maxBuffer:32*1024*1024,encoding:'utf8'});
export async function savePresentation(presentation){
 const started=performance.now(),count=presentation.tiles.reduce((n,t)=>n+t.roots.length,0),stride=52;
 assert.equal(count,988170);
 const habitat=presentation.habitat,bytes=Buffer.alloc(count*stride+habitat.pixels.length);
 let i=0;const original=[],packed=new Float32Array(count*4),metadata=[];
 for(const tile of presentation.tiles)for(const r of tile.roots){
  const offset=i*stride;
  for(const [j,key]of ['x','y','z','angle','slope'].entries()){assert(Number.isFinite(r[key]));bytes.writeDoubleLE(r[key],offset+j*8);}
  for(const [j,key]of ['seed','triangleId'].entries()){assert(Number.isInteger(r[key])&&r[key]>=0&&r[key]<=0xffffffff);bytes.writeUInt32LE(r[key],offset+40+j*4);}
  assert([undefined,'RAVINE','RAVINE_SUPPLEMENT'].includes(r.region));
  bytes.writeUInt32LE(r.region==='RAVINE'?1:r.region==='RAVINE_SUPPLEMENT'?2:0,offset+48);
  packed.set([r.x,r.y,r.z,r.angle],i*4);
  if(r.region!=='RAVINE_SUPPLEMENT'){original.push(r.x,r.y,r.z,r.angle);metadata.push(r.seed,r.region==='RAVINE'?1:0);}
  i++;
 }
 Buffer.from(habitat.pixels).copy(bytes,count*stride);
 const originalHash=sha(Buffer.from(Float32Array.from(original).buffer));
 const metadataHash=sha(Buffer.from(Uint32Array.from(metadata).buffer));
 assert.equal(originalHash,'d90752a5e4d9c4f1f3e0bcc56edac6bc53cff09e07f1c70c0b1f12f9fff06dde');
 assert.equal(metadataHash,'fbdd8604fb367bfce0528edfa01f13d5b797ad9d6a0804e7dfbc57806ac09417');
 const compressed=gzipSync(bytes,{level:9});
 // Timing is run evidence, not part of the deterministic manifest.
 const receipt=structuredClone(presentation.receipt);delete receipt.elapsedMilliseconds;
 const manifest={schema:'H_EARTH_PRECOMPUTED_GRASS_v1',baseline,rootCount:count,stride,rawBytes:bytes.length,compressedBytes:compressed.length,rawSha256:sha(bytes),compressedSha256:sha(compressed),packedSha256:sha(Buffer.from(packed.buffer)),originalPackedSha256:originalHash,originalSeedRegionSha256:metadataHash,atlasSha256:sha(habitat.pixels),worldSha256:'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a',tiles:presentation.tiles.map(({id,minX,minZ,roots})=>({id,minX,minZ,count:roots.length})),habitat:{size:habitat.size,width:habitat.width,height:habitat.height,bounds:habitat.bounds,ravine:{bounds:habitat.ravine.bounds},receipt:habitat.receipt},receipt};
 const json=JSON.stringify(manifest)+'\n';
 fs.writeFileSync(path.join(root,render,'assets/precomputed-grass.v1.bin.gz'),compressed);
 fs.writeFileSync(path.join(root,render,'assets/precomputed-grass.v1.json'),json);
 const loaderPath=path.join(root,render,'precomputed-grass.v1.js');
 fs.writeFileSync(loaderPath,fs.readFileSync(loaderPath,'utf8').replace(/const MANIFEST_SHA256='[^']*';/,`const MANIFEST_SHA256='${sha(json)}';`));
 const {decodePrecomputedGrass}=await import(pathToFileURL(loaderPath));
 const decoded=await decodePrecomputedGrass(manifest,bytes);
 for(let t=0;t<presentation.tiles.length;t++)assert.deepEqual(decoded.tiles[t],presentation.tiles[t]);
 assert.deepEqual(decoded.habitat.pixels,habitat.pixels);
 const evidence={schema:'H_EARTH_PRECOMPUTED_GRASS_CHECKPOINT_v1',baseline,rootCount:count,packedBytes:packed.byteLength,rawBytes:bytes.length,compressedBytes:compressed.length,rawSha256:manifest.rawSha256,packedSha256:manifest.packedSha256,atlasSha256:manifest.atlasSha256,originalPackedSha256:originalHash,originalSeedRegionSha256:metadataHash,exactEveryRootFieldAndTileOrder:true,exactHabitatPixels:true,offlineBuildMilliseconds:performance.now()-globalThis.precomputeStarted,serializationAndEqualityMilliseconds:performance.now()-started,cpuOnly:true,browserReadinessVerified:false,phonePerformanceVerified:false,visualAcceptance:false};
 fs.mkdirSync(path.join(root,'h-earth-3d/evidence/precomputed-grass-v1'),{recursive:true});
 fs.writeFileSync(path.join(root,'h-earth-3d/evidence/precomputed-grass-v1/checkpoint.json'),JSON.stringify(evidence,null,2)+'\n');
 console.log(JSON.stringify(evidence,null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 globalThis.precomputeStarted=performance.now();
 const changed=execFileSync('git',['diff',baseline,'--name-only','--',render,'showroom/globe/h-earth/functional-landscape/','h-earth-3d/terrain/','h-earth-3d/environment/'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(Boolean);
 const permitted=new Set([render+'persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',render+'precomputed-grass.v1.js',render+'assets/precomputed-grass.v1.json',render+'assets/precomputed-grass.v1.bin.gz']);
 assert.deepEqual(changed.filter(p=>!permitted.has(p)),[],'Accepted planting dependencies changed: requalification required');

 const testPath='h-earth-3d/validation/h-earth.grass-continuity.v1.test.mjs';
 let fixture=source(testPath);
 const begin=fixture.indexOf("test('supplement envelope"),body=fixture.indexOf("const root=new URL",begin),end=fixture.indexOf('const all=presentation.tiles',body);
 assert(begin>0&&body>begin&&end>body);
 fixture=fixture.slice(0,begin)+fixture.slice(body,end);
 fixture=fixture.replace("import test from 'node:test';",'');
 fixture=fixture.replace("const sourceDir=process.env.H_EARTH_GRASS_SOURCE_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../showroom/globe/h-earth/render');",`const sourceDir=${JSON.stringify(path.resolve(root,render))};`);
 // The accepted renderer contains the exact habitat callback. Keep it pinned
 // even after the browser changes to loading its compiled output.
 const renderer='persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
 fixture=fixture.replace("const read=name=>fs.readFileSync(path.join(sourceDir,name),'utf8');",`const read=name=>name===${JSON.stringify(renderer)}?${JSON.stringify(source(render+renderer))}:fs.readFileSync(path.join(sourceDir,name),'utf8');`);
 const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-precompute-'));
 try{
  const entry=path.join(temporary,'fixture.mjs');
  globalThis.savePrecomputedPresentation=savePresentation;
  fs.writeFileSync(entry,fixture+'\nawait globalThis.savePrecomputedPresentation(presentation);\n');
  await import(pathToFileURL(entry));
 }finally{fs.rmSync(temporary,{recursive:true,force:true});}
}
