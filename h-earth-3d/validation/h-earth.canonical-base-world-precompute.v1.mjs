#!/usr/bin/env node
/** Gen2666: source-bound, deterministic, complete raw+canonical base-world precomputation. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import { performance } from 'node:perf_hooks';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RENDER = 'showroom/globe/h-earth/render/';
const ASSET = `${RENDER}assets/h-earth-canonical-base-world.v1.json.gz`;
const MANIFEST = `${RENDER}assets/h-earth-canonical-base-world.v1.manifest.json`;
const SOURCE_BLOBS = Object.freeze({
  [`${RENDER}woodland-rock-presentation.v1.js`]: '77e7038d27862a39c31676d1d9a1ee9a84d5f267',
  [`${RENDER}woodland-fine-grass.v1.js`]: '3e6668025258dfaa4e1b1f198723b8904b398add',
  [`${RENDER}live-render-package.run8e-r2.canonical.js`]: '41092afa665f715027f54bc6c52898b839911235',
  [`${RENDER}live-render-package.run8e-r2.js`]: 'd362035f091a7fd997553239c048e87e8b46e4c7',
  [`${RENDER}run8e-successor-environment.js`]: '92d5cb9523619fed34382986232c3d8c261e2a8d',
  [`${RENDER}persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js`]: '3ea4c09ddfc777ba21f8756b2d37e258fde5c805',
  [`${RENDER}geometry-landscape-sector.p2.js`]: 'c26247dcb69cb52c968fcd3ef6c2626eaa577d03',
  [`${RENDER}landscape-groundcover.global-v1.js`]: 'e02c8f751dbb2011b5611f19136e7f2fea33397a',
  [`${RENDER}woodland-clearing-trial.js`]: '14c366d2241469fbccd08ee31bbeac0f1b7598f4',
  [`${RENDER}geometry-woodland-tree-trial.js`]: '3958513dec53aa27f4216388a190f772e71fb9b0'
});
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const fatal = (code, detail='') => { throw new Error(`${code}${detail?`:${detail}`:''}`); };
const read = name => fs.readFileSync(path.join(ROOT,name));
function sourceConstructionBytes(filename,bytes){
  if(!filename.endsWith('/live-render-package.run8e-r2.canonical.js'))return bytes;
  let text=bytes.toString('utf8');
  if(!text.includes('// GEN2666_HYDRATION_BEGIN'))return bytes;
  const replacements=[["// GEN2666_HYDRATION_BEGIN\nasync function hydratePrecomputedBaseWorld(){\n  if(typeof fetch!=='function'||typeof DecompressionStream!=='function'||!globalThis.crypto?.subtle)\n    throw new Error('GEN2666_HYDRATION_CAPABILITY_UNAVAILABLE');\n  const response=await fetch(new URL('./assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url));\n  if(!response.ok)throw new Error(`GEN2666_ASSET_HTTP_${response.status}`);\n  const packed=await response.arrayBuffer();\n  if(packed.byteLength!==11736235)throw new Error('GEN2666_COMPRESSED_LENGTH_MISMATCH');\n  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',packed)),byte=>byte.toString(16).padStart(2,'0')).join('');\n  if(digest!=='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a')throw new Error('GEN2666_SHA256_MISMATCH');\n  const unpacked=await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();\n  if(unpacked.byteLength!==51163475)throw new Error('GEN2666_UNCOMPRESSED_LENGTH_MISMATCH');\n  const value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(unpacked));\n  if(value?.raw?.packageIdentity!=='H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_0C47F685'||\n     value?.canonical?.packageIdentity!=='H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_2F3D0EB2'||\n     value.raw.revision!==1||value.canonical.revision!==2)\n    throw new Error('GEN2666_PACKAGE_IDENTITY_MISMATCH');\n  return value;\n}\n// GEN2666_HYDRATION_END\n", ""], ["      // GEN2666_WORKER_HYDRATION_BEGIN\n      let raw,canonical,precomputed=null;\n      const hydrationStart=preparationNow();\n      try{precomputed=await hydratePrecomputedBaseWorld();}\n      catch(error){\n        const failure={name:error?.name??'Error',message:error?.message??String(error)};\n        globalThis.postMessage({phase:'PRECOMPUTED_BASE_WORLD_FALLBACK',failure});\n        if(timing)timing.precomputedFailure=failure;\n      }\n      if(timing){timing.hydrationDurationMs=durationBetween(hydrationStart,preparationNow());timing.baseWorldSource=precomputed?'PRECOMPUTED_SHA256_VERIFIED':'ORIGINAL_SOURCE_FALLBACK';}\n      if(precomputed){\n        ({raw,canonical}=precomputed);\n        if(timing){timing.rawBuildDurationMs=0;timing.canonicalBuildDurationMs=0;}\n        globalThis.postMessage({phase:'RAW_PACKAGE_COMPLETE'});\n      }else{\n        const rawStart=timing?preparationNow():null;\n        try{raw=getRawPackage({deferVegetation:true});}finally{if(timing)timing.rawBuildDurationMs=durationBetween(rawStart,preparationNow());}\n        globalThis.postMessage({phase:'RAW_PACKAGE_COMPLETE'});\n        const canonicalStart=timing?preparationNow():null;\n        try{canonical=getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});}finally{if(timing)timing.canonicalBuildDurationMs=durationBetween(canonicalStart,preparationNow());}\n      }\n      // GEN2666_WORKER_HYDRATION_END\n", "      const rawStart=timing?preparationNow():null;let raw;\n      try{raw=getRawPackage({deferVegetation:true});}finally{if(timing)timing.rawBuildDurationMs=durationBetween(rawStart,preparationNow());}\n      globalThis.postMessage({phase:'RAW_PACKAGE_COMPLETE'});\n      const canonicalStart=timing?preparationNow():null;let canonical;\n      try{canonical=getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});}finally{if(timing)timing.canonicalBuildDurationMs=durationBetween(canonicalStart,preparationNow());}\n"], ["          // GEN2666_FALLBACK_NOTIFICATION_BEGIN\n          if(data?.phase==='PRECOMPUTED_BASE_WORLD_FALLBACK'&&stage==='RAW'){\n            publishPreparationProgress({phase:data.phase,failure:data.failure,completed:0,total:1,unit:'packages'});\n            console.warn('H-Earth precomputed base world unavailable; using original source generation',data.failure);\n            return;\n          }\n          // GEN2666_FALLBACK_NOTIFICATION_END\n", ""]];
  for(const [candidate,baseline] of replacements){
    assert.equal(text.split(candidate).length,2,'GEN2666_HYDRATION_DELTA_DRIFT');
    text=text.replace(candidate,baseline);
  }
  return Buffer.from(text);
}
function requireSourceIdentity() {
  for (const [filename, expected] of Object.entries(SOURCE_BLOBS)) {
    const actual = gitBlob(sourceConstructionBytes(filename,read(filename)));
    if (actual !== expected) fatal('GEN2666_SOURCE_CLOSURE_DRIFT', `${filename}:${actual}`);
  }
}
const format = value => JSON.stringify(value, null, 2) + '\n';
function stableMetadata(value) {
  if (value.eligible !== true) fatal('GEN2666_INVALID_SOURCE_PACKAGE');
  // Construction timing is diagnostic metadata, explicitly outside world identity.
  // The compiled asset carries no benchmark from the builder's machine.
  return { ...value, constructionMilliseconds: 0 };
}
const record = ({raw,canonical}) => ({raw:stableMetadata(raw),canonical:stableMetadata(canonical)});
async function modules() {
  const mod = await import(pathToFileURL(path.join(ROOT,`${RENDER}live-render-package.run8e-r2.canonical.js`)).href);
  // Reuse the exact original raw-module instance selected by the canonical owner.
  const raw = await import(pathToFileURL(path.join(ROOT,`${RENDER}live-render-package.run8e-r2.js`)).href+'?cb=meadow-distribution-20261006');
  return {mod,raw};
}
function freezePackageRecords(value) {
  const buffers = new WeakSet([...Object.values(value.raw.buffers), ...Object.values(value.canonical.buffers)]);
  const seen = new WeakSet(), stack = [value];
  while (stack.length) {
    const item = stack.pop();
    if (!item || typeof item !== 'object' || seen.has(item)) continue;
    seen.add(item);
    if (!buffers.has(item)) for (const child of Object.values(item)) if (child && typeof child === 'object') stack.push(child);
    Object.freeze(item);
  }
  return value;
}
function examine(value, manifest, {actualSourceRecords=null}={}) {
  assert.equal(value?.raw?.eligible, true);
  assert.equal(value?.canonical?.eligible, true);
  assert.equal(value.raw.packageIdentity, manifest.rawPackageIdentity);
  assert.equal(value.canonical.packageIdentity, manifest.packageIdentity);
  assert.equal(value.raw.contentDigest, manifest.rawDigest);
  assert.equal(value.canonical.contentDigest, manifest.canonicalDigest);
  assert.equal(value.raw.revision,1);
  assert.equal(value.canonical.revision,2);
  assert.equal(value.raw.packageOccurrenceId,value.canonical.packageOccurrenceId);
  assert.deepEqual([value.raw.vertexCount,value.raw.indexCount,value.raw.primitiveCount], [110269,311466,14]);
  assert.deepEqual(value.raw.primitiveIds, value.canonical.primitiveIds);
  assert.deepEqual(value.raw.drawRanges,value.canonical.drawRanges);
  assert.deepEqual(value.raw.primitiveSpans,value.canonical.primitiveSpans);
  // Canonical clearing attributes are deliberately rounded onto a 2^-24 grid.
  // Compare each to its own exact source below, not raw against canonical.
  assert.equal(value.raw.clearingAttributes.length, value.canonical.clearingAttributes.length);
  for (const [label,pkg] of Object.entries(value)) {
    assert.deepEqual(Object.keys(pkg.buffers).sort(), manifest.bufferNames.slice().sort());
    for (const name of manifest.bufferNames) {
      const buffer = pkg.buffers[name];
      assert.equal(buffer.length,manifest.bufferLengths[name]);
      if (actualSourceRecords) {
        const source = actualSourceRecords[label].buffers[name];
        assert.equal(buffer.length,source.length);
        // Preserve primitive number representation, not just rounded Float32 output.
        for(let i=0;i<buffer.length;i++)if(!Object.is(buffer[i],source[i]))fatal('GEN2666_BUFFER_VALUE_MISMATCH',`${label}.${name}[${i}]`);
      }
    }
  }
  if(actualSourceRecords)assert.deepStrictEqual(value,JSON.parse(JSON.stringify(actualSourceRecords)),'GEN2666_FULL_RECORD_MISMATCH');
  assert.equal(value.canonical.sourceAuthorities.numericCanonicalizationLaw,'ROUND_TO_BINARY_GRID_2^-24_AND_NORMALIZE_NEGATIVE_ZERO');
  return true;
}
async function build() {
  requireSourceIdentity();
  const {mod,raw:rawModule} = await modules();
  const buildStart=performance.now();
  const canonical=mod.getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});
  const raw=rawModule.getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation:true});
  const sourceBuildMs=performance.now()-buildStart;
  const data=record({raw,canonical});
  const bufferNames=Object.keys(raw.buffers);
  const text=JSON.stringify(data);
  const packed=gzipSync(Buffer.from(text),{level:4,mtime:0});
  const manifest={
    schema:'H_EARTH_GEN2666_PRECOMPUTED_BASE_WORLD_MANIFEST_v1',
    operationId:'H_EARTH_CANONICAL_COLD_START_PRECOMPUTED_BASE_WORLD_20261011_001',
    provenance:'QUALIFIED_GEN2659_SAME_SOURCE_CLOSURE',
    sourceBlobs:SOURCE_BLOBS,
    packageIdentity:canonical.packageIdentity,canonicalDigest:canonical.contentDigest,
    rawPackageIdentity:raw.packageIdentity,rawDigest:raw.contentDigest,
    packageOccurrenceId:raw.packageOccurrenceId,
    binary:{path:ASSET,format:'gzip',encoding:'UTF8_JSON_RAW_AND_CANONICAL_v1',bytes:packed.length,uncompressedBytes:Buffer.byteLength(text),sha256:sha256(packed)},
    bufferNames,
    bufferLengths:Object.fromEntries(bufferNames.map(name=>[name,raw.buffers[name].length])),
    protectedWorld:{approvedTrees:4,legacyTrees:0,groundCoverTiles:648,groundCoverInstances:61235,vegetationBatches:108,vegetationPlacements:27585},
    runtimeConstructionMillisecondsStored:false,
    sourceBuildMilliseconds:Math.round(sourceBuildMs),
    packageReuseAuthority:'NONE_SELF_VERIFIED_BYTE_PARITY_ONLY',
    releaseAuthorized:false,physicalAndroidQualified:false
  };
  // The build-machine duration must not affect the asset identity or manifest contract.
  delete manifest.sourceBuildMilliseconds;
  fs.mkdirSync(path.dirname(path.join(ROOT,ASSET)),{recursive:true});
  fs.writeFileSync(path.join(ROOT,ASSET),packed);
  fs.writeFileSync(path.join(ROOT,MANIFEST),format(manifest));
  console.log(format({schema:'H_EARTH_GEN2666_PRECOMPUTE_BUILD_RECEIPT_v1',result:'BUILT_NOT_ADMITTED_FOR_RELEASE',sourceBuildMilliseconds:Math.round(sourceBuildMs),binary:manifest.binary,identity:manifest.packageIdentity}));
}
async function verify({withSource=false}={}) {
  requireSourceIdentity();
  const manifest=JSON.parse(read(MANIFEST).toString('utf8'));
  assert.equal(manifest.schema,'H_EARTH_GEN2666_PRECOMPUTED_BASE_WORLD_MANIFEST_v1');
  assert.deepEqual(manifest.sourceBlobs,SOURCE_BLOBS);
  assert.equal(manifest.binary.path,ASSET);
  const packed=read(ASSET);
  assert.equal(packed.length,manifest.binary.bytes);
  assert.equal(sha256(packed),manifest.binary.sha256);
  const start=performance.now();
  const unpacked=gunzipSync(packed);
  assert.equal(unpacked.length,manifest.binary.uncompressedBytes);
  const value=JSON.parse(unpacked.toString('utf8'));
  const hydrationMs=performance.now()-start;
  freezePackageRecords(value);
  const {mod,raw:rawModule}=await modules();
  assert.equal(rawModule.evaluateHEarthRun8ER2ImmutableLiveRenderPackage(value.raw).eligible,true);
  assert.equal(rawModule.evaluateHEarthRun8ER2ImmutableLiveRenderPackage(value.canonical).eligible,true);
  let actualSourceRecords=null;
  if(withSource){const canonical=mod.getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});const raw=rawModule.getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation:true});actualSourceRecords=record({raw,canonical});}
  examine(value,manifest,{actualSourceRecords});
  console.log(format({schema:'H_EARTH_GEN2666_PRECOMPUTE_PARITY_RECEIPT_v1',result:'PASS',exactSourceBound:true,fullRawAndCanonicalRecords:true,nineCanonicalAndRawBuffers:true,originalPackageIdentity:manifest.packageIdentity,transportSha256:manifest.binary.sha256,transportBytes:packed.length,hydrationMilliseconds:Math.round(hydrationMs),freshSourceCompared:withSource,environmentalIdentityPreserved:true,physicalAndroidQualified:false,releaseAuthorized:false}));
}
async function main(){const args=process.argv.slice(2);assert.equal(args.length,1,'Exactly one mode required');if(args[0]==='--build')await build();else if(args[0]==='--verify')await verify();else if(args[0]==='--verify-source')await verify({withSource:true});else fatal('GEN2666_UNKNOWN_MODE',args[0]);}
main().catch(error=>{console.error(JSON.stringify({schema:'H_EARTH_GEN2666_PRECOMPUTE_PARITY_RECEIPT_v1',result:'FAIL_CLOSED',error:error.stack??String(error)}));process.exitCode=1;});
