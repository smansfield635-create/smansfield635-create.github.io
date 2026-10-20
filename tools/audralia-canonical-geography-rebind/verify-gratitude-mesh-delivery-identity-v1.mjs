#!/usr/bin/env node
// Runs the actual loader against immutable mesh fixtures; never writes product files.
// Optional AUDRALIA_DELIVERY_FIXTURE_ROOT points to a full checkout/dist root.
// Optional AUDRALIA_DELIVERY_ORIGINAL_PROVENANCE points to historical Gen2826 provenance.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash,webcrypto} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=fileURLToPath(new URL('../../',import.meta.url));
const FIXTURES=process.env.AUDRALIA_DELIVERY_FIXTURE_ROOT||ROOT;
const TARGET='showroom/globe/h-earth/terrain-estate-construction-v1';
const EXPECTED='f136a8c696e38ef72e062bb69ae8e5a625000cc88ab436967f4df766637cee28';
const HISTORICAL='305657c266ca8ce91227f31cb064b90ed9c744b68a0dcd77ef3914c3cb323c95';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const fixtureDir=path.join(FIXTURES,TARGET);
const provenance=JSON.parse(fs.readFileSync(path.join(fixtureDir,'gratitude-mesh-v1.provenance.json'),'utf8'));
assert.equal(provenance.mesh.payloadSha256,EXPECTED,'fixture must be repaired Gen2829');
const fullGzip=fs.readFileSync(path.join(fixtureDir,'gratitude-mesh-v1.bin.gz'));
const payload=gunzipSync(fullGzip);
assert.equal(digest(payload),EXPECTED,'independent full-gzip payload identity');
const chunks=new Map(provenance.mesh.parts.map(p=>[p.file,fs.readFileSync(path.join(fixtureDir,p.file))]));
assert.equal(chunks.size,8);
const before=new Map([...chunks].map(([name,bytes])=>[name,digest(bytes)]));
const oldPath=process.env.AUDRALIA_DELIVERY_ORIGINAL_PROVENANCE;
const stale=oldPath?JSON.parse(fs.readFileSync(oldPath,'utf8')):structuredClone(provenance);
stale.mesh.payloadSha256=HISTORICAL;
assert.equal(stale.mesh.payloadSha256,HISTORICAL);
const loaderUrl=pathToFileURL(path.join(ROOT,TARGET,'precomputed-gratitude-mesh-v1.mjs'));
const {loadPrecomputedGratitudeMesh}=await import(loaderUrl.href);
const originalGlobals=new Map(['fetch','window','location','crypto'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
Object.defineProperty(globalThis,'crypto',{configurable:true,value:webcrypto});
const cases=[];
try{
  const run=async({name,options={},metadata=provenance,corrupt=false,error=null,fetchCount=9,versioned=true})=>{
    const calls=[];
    globalThis.window={};
    globalThis.location={origin:loaderUrl.origin};
    globalThis.fetch=async(input,init)=>{
      const url=new URL(input);
      calls.push({url:url.href,cache:init?.cache});
      assert.equal(init?.cache,'force-cache');
      if(versioned)assert.equal(url.searchParams.get('mesh'),EXPECTED,'each requested asset must bind repaired payload');
      else assert.equal(url.search,'','legacy caller URL must remain unchanged');
      const file=path.basename(url.pathname);
      if(file==='gratitude-mesh-v1.provenance.json')return new Response(JSON.stringify(metadata),{headers:{'Content-Type':'application/json'}});
      assert.ok(chunks.has(file),'only declared chunk files may be fetched');
      const bytes=Buffer.from(chunks.get(file));
      if(corrupt&&file==='gratitude-mesh-v1.part-00.gz')bytes[30]^=1;
      return new Response(bytes);
    };
    if(error){
      await assert.rejects(()=>loadPrecomputedGratitudeMesh(options),e=>e.message===error,name);
      assert.equal(window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__,undefined,'failed load must not install a mesh');
    }else{
      const mesh=await loadPrecomputedGratitudeMesh(options);
      assert.equal(mesh,window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__);
      assert.equal(mesh.authority.meshPayloadSha256,EXPECTED);
      assert.equal(mesh.verifiedChunkCount,8);
      assert.equal(mesh.sameOriginCriticalPath,true);
      const landBytes=Buffer.from(mesh.landMesh.vertices.buffer,mesh.landMesh.vertices.byteOffset,mesh.landMesh.vertices.byteLength);
      assert.ok(landBytes.equals(payload.subarray(32,32+landBytes.length)),'actual loaded land buffer equals repaired fixture');
      const landIndexBytes=mesh.landMesh.indices.byteLength;
      const waterStart=32+landBytes.length+landIndexBytes;
      const waterBytes=Buffer.from(mesh.coastalWaterMesh.vertices.buffer,mesh.coastalWaterMesh.vertices.byteOffset,mesh.coastalWaterMesh.vertices.byteLength);
      assert.ok(waterBytes.equals(payload.subarray(waterStart,waterStart+waterBytes.length)),'actual loaded water buffer equals immutable fixture');
    }
    assert.equal(calls.length,fetchCount,name+' fetch count');
    cases.push({name,result:'PASS',fetchCount:calls.length,error});
  };
  await run({name:'historical provenance rejected before chunks',options:{expectedPayloadSha256:EXPECTED},metadata:stale,error:'AUDRALIA_MESH_EXPECTED_PAYLOAD_MISMATCH',fetchCount:1});
  await run({name:'repaired payload accepted with nine versioned URLs',options:{expectedPayloadSha256:EXPECTED}});
  await run({name:'corrupted compressed chunk rejected',options:{expectedPayloadSha256:EXPECTED},corrupt:true,error:'AUDRALIA_MESH_PART_0_COMPRESSED_DIGEST_INVALID',fetchCount:2});
  await run({name:'malformed expectation rejected before fetch',options:{expectedPayloadSha256:'not-a-sha256'},error:'AUDRALIA_MESH_EXPECTED_PAYLOAD_INVALID',fetchCount:0});
  const badGeography=structuredClone(provenance);badGeography.canonicalGeography.gitBlobSha='0'.repeat(40);
  await run({name:'original geography guard retained',options:{expectedPayloadSha256:EXPECTED},metadata:badGeography,error:'AUDRALIA_MESH_PROVENANCE_GEOGRAPHY_INVALID',fetchCount:1});
  await run({name:'legacy caller remains compatible and URL isolation retained',versioned:false});
  for(const [name,hash]of before)assert.equal(digest(fs.readFileSync(path.join(fixtureDir,name))),hash);
  assert.equal(digest(fs.readFileSync(path.join(fixtureDir,'gratitude-mesh-v1.bin.gz'))),digest(fullGzip));
  const html=fs.readFileSync(path.join(ROOT,'showroom/globe/audralia/index.html'),'utf8');
  assert.ok(html.includes("loadPrecomputedGratitudeMesh({expectedPayloadSha256:'"+EXPECTED+"'});"),'entry must independently pin repaired digest');
  assert.ok(html.includes('GRATITUDE_EXACT_MESH_DELIVERY_GEN2833'),'entry must bind changed loader module');
  console.log(JSON.stringify({schema:'AUDRALIA_MESH_DELIVERY_IDENTITY_VERIFICATION_v1',result:'PASS_NATIVE_LOADER_FIXTURES',expectedPayloadSha256:EXPECTED,historicalProvenanceFixture:oldPath?'EXACT_GIT_HELD_GEN2826':'HISTORICAL_IDENTITY_ON_COMPATIBLE_CANONICAL_METADATA',cases,fixtureFilesUnchanged:true,loadedLandAndWaterBuffersEqualFixture:true,nativeBrowserExecuted:false,ownerPhysicalAcceptance:false},null,2));
}finally{
  for(const [key,descriptor]of originalGlobals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
}
