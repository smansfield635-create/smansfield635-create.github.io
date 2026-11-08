#!/usr/bin/env node
// H-Earth REGIONAL_PACKET_REPLACEMENT_V1 — new read-only diagnostic source.
// NOT the unrecovered h-earth-regional-packet-readonly-proof.mjs.
// Do not use as a product generator or as a registered command until canonical admission.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {gzipSync, gunzipSync} from 'node:zlib';

const FROZEN_REVISION='c9e20794436378bef65bea4ec3c0a10eec78751e';
const EXPECTED=Object.freeze({
  manifestSha256:'9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf',
  compressedSha256:'4a2ff2a135984d67d68d3df7c3212236894c75b66826f256a60130c87b73e800',
  rawSha256:'bb5bdea6223aaea0422bac76f73da46d0370e51d81b3fdb280c970c408879a97',
  rootCount:2858738, tileCount:8198, rawBytes:148764968,
  compressedBytes:64564514, stride:52, habitatBytes:576*192,
  maxRegionCompressedBytes:8000000,
  regionSideMeters:32,
});
const CAMERAS=Object.freeze([
  {name:'approved-four-trees',x:-139.40267987050615,z:-194.5,radiusMeters:64},
  {name:'rear-cavern',x:40,z:-300,radiusMeters:64},
]);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const requireEq=(got,want,code)=>assert.equal(got,want,code);
const fail=(code)=>{throw new Error(code);};
const regionKey=t=>`${Math.floor(t.minX/EXPECTED.regionSideMeters)}:${Math.floor(t.minZ/EXPECTED.regionSideMeters)}`;
const ordered=(a,b)=>a.localeCompare(b,'en',{numeric:true});
function auditManifest(m){
  requireEq(m.schema,'H_EARTH_PRECOMPUTED_GRASS_v1','MANIFEST_SCHEMA');
  requireEq(m.rootCount,EXPECTED.rootCount,'ROOT_COUNT');
  requireEq(m.tiles?.length,EXPECTED.tileCount,'TILE_COUNT');
  requireEq(m.stride,EXPECTED.stride,'STRIDE');
  requireEq(m.rawBytes,EXPECTED.rawBytes,'RAW_LENGTH');
  requireEq(m.compressedBytes,EXPECTED.compressedBytes,'COMPRESSED_LENGTH');
  requireEq(m.rawSha256,EXPECTED.rawSha256,'RAW_HASH_DECLARATION');
  requireEq(m.compressedSha256,EXPECTED.compressedSha256,'COMPRESSED_HASH_DECLARATION');
  requireEq(m.habitat?.width*m.habitat?.height,EXPECTED.habitatBytes,'HABITAT_DIMENSIONS');
  requireEq(m.receipt?.contactCount,EXPECTED.rootCount,'RECEIPT_CONTACT_COUNT');
  const tileIds=new Set();let counted=0,maxRegionRoots=0;
  const regionCounts=new Map();
  for(const t of m.tiles){
    if(typeof t.id!=='string'||tileIds.has(t.id))fail('DUPLICATE_OR_INVALID_TILE');
    tileIds.add(t.id);
    if(!Number.isInteger(t.count)||t.count<1||t.count>1600||!Number.isInteger(t.baselineCount)||t.baselineCount<0||t.baselineCount>t.count)fail('INVALID_TILE_COUNTS');
    if(!Number.isFinite(t.minX)||!Number.isFinite(t.minZ)||t.minX%4!==0||t.minZ%4!==0)fail('INVALID_TILE_BOUNDS');
    requireEq(t.id,`${t.minX/4}:${t.minZ/4}`,'TILE_ID_COORDINATES');
    counted+=t.count;
    const k=regionKey(t);const n=(regionCounts.get(k)||0)+t.count;regionCounts.set(k,n);maxRegionRoots=Math.max(maxRegionRoots,n);
  }
  requireEq(counted,EXPECTED.rootCount,'TILE_ROOT_SUM');
  requireEq(counted*EXPECTED.stride+EXPECTED.habitatBytes,EXPECTED.rawBytes,'RAW_LAYOUT');
  // An independent metadata-only bound, not an observed compression result.
  if(maxRegionRoots*EXPECTED.stride>=EXPECTED.maxRegionCompressedBytes)fail('REGION_RAW_BOUND_EXCEEDS_BUDGET');
  return{regionCount:regionCounts.size,largestRegionRawBytes:maxRegionRoots*EXPECTED.stride};
}
function packingProof(m,raw){
  const regions=new Map(),camRoots=Object.fromEntries(CAMERAS.map(c=>[c.name,0]));
  const sourceView=new DataView(raw.buffer,raw.byteOffset,raw.byteLength);
  const spatial={};for(const cam of CAMERAS)spatial[cam.name]={regions:new Set(),tileCoveredRoots:0,actualNearbyRoots:0};
  let offset=0;
  for(const t of m.tiles){
    const len=t.count*EXPECTED.stride,start=offset,end=start+len;
    if(end>EXPECTED.rootCount*EXPECTED.stride)fail('RAW_TRUNCATED');
    const k=regionKey(t);if(!regions.has(k))regions.set(k,[]);
    regions.get(k).push({tileId:t.id,sourceOffset:start,length:len,roots:t.count});
    for(const cam of CAMERAS){
      const dx=Math.max(t.minX-cam.x,0,cam.x-(t.minX+4));
      const dz=Math.max(t.minZ-cam.z,0,cam.z-(t.minZ+4));
      if(dx*dx+dz*dz<=cam.radiusMeters**2){spatial[cam.name].regions.add(k);spatial[cam.name].tileCoveredRoots+=t.count;}
    }
    for(let j=0;j<t.count;j++){
      const o=start+j*EXPECTED.stride;
      const x=sourceView.getFloat64(o,true), y=sourceView.getFloat64(o+8,true), z=sourceView.getFloat64(o+16,true);
      const angle=sourceView.getFloat64(o+24,true),slope=sourceView.getFloat64(o+32,true),region=sourceView.getUint32(o+48,true);
      if(![x,y,z,angle,slope].every(Number.isFinite)||region>2)fail('ROOT_RECORD_INVALID');
      if(x<t.minX||x>=t.minX+4||z<t.minZ||z>=t.minZ+4)fail('ROOT_OUTSIDE_TILE');
      for(const cam of CAMERAS)if((x-cam.x)**2+(z-cam.z)**2<=cam.radiusMeters**2){
        spatial[cam.name].actualNearbyRoots++;
        if(!spatial[cam.name].regions.has(k))fail('CAMERA_NEARBY_ROOT_MISSING_REGION');
      }
    }
    offset=end;
  }
  requireEq(offset,EXPECTED.rootCount*EXPECTED.stride,'ROOT_RECORD_LENGTH');
  const reconstructed=Buffer.allocUnsafe(raw.byteLength);const packetSummaries=[];
  let maxCompressed=0,totalCompressed=0,rootSum=0;
  for(const key of [...regions.keys()].sort(ordered)){
    const chunks=regions.get(key);
    const packetRaw=Buffer.concat(chunks.map(t=>raw.subarray(t.sourceOffset,t.sourceOffset+t.length)));
    const packetGzip=gzipSync(packetRaw,{level:9,mtime:0});
    if(packetGzip.length>EXPECTED.maxRegionCompressedBytes)fail('REGION_COMPRESSED_BUDGET');
    const decoded=gunzipSync(packetGzip);
    if(!decoded.equals(packetRaw))fail('PACKET_ROUNDTRIP');
    let local=0,packetRoots=0;
    for(const t of chunks){
      const s=decoded.subarray(local,local+t.length);
      reconstructed.set(s,t.sourceOffset);
      local+=t.length;packetRoots+=t.roots;
    }
    requireEq(local,decoded.length,'PACKET_LAYOUT_MISMATCH');
    maxCompressed=Math.max(maxCompressed,packetGzip.length);totalCompressed+=packetGzip.length;rootSum+=packetRoots;
    packetSummaries.push({regionId:key,tiles:chunks.length,roots:packetRoots,rawBytes:packetRaw.length,compressedBytes:packetGzip.length,compressedSha256:hash(packetGzip)});
  }
  requireEq(rootSum,EXPECTED.rootCount,'REGIONAL_ROOT_SUM');
  const habitatStart=EXPECTED.rootCount*EXPECTED.stride;
  const habitatRaw=raw.subarray(habitatStart);
  requireEq(habitatRaw.length,EXPECTED.habitatBytes,'HABITAT_TRAILER');
  const habitatGzip=gzipSync(habitatRaw,{level:9,mtime:0});
  reconstructed.set(gunzipSync(habitatGzip),habitatStart);
  requireEq(hash(reconstructed),EXPECTED.rawSha256,'EXACT_FULL_RAW_RECONSTRUCTION');
  if(!reconstructed.equals(raw))fail('RECONSTRUCTED_BYTES_DIFFER');
  const cameraCoverage=CAMERAS.map(c=>{
    const x=spatial[c.name];if(x.actualNearbyRoots===0)fail('EMPTY_CAMERA_ROOT_PROBE');
    const regionIds=[...x.regions].sort(ordered);
    const selectedPackets=packetSummaries.filter(p=>x.regions.has(p.regionId));
    return{name:c.name,x:c.x,z:c.z,radiusMeters:c.radiusMeters,regions:regionIds.length,selectedRegionIds:regionIds,tileCoveredRoots:x.tileCoveredRoots,actualNearbyRoots:x.actualNearbyRoots,compressedBytesForCoverage:selectedPackets.reduce((s,p)=>s+p.compressedBytes,0)};
  });
  return{result:'REGIONAL_PACKET_SOURCE_PROOF_PASS',frozenRevision:FROZEN_REVISION,originalVerifierRecovered:false,replacementSource:true,regionSideMeters:EXPECTED.regionSideMeters,maxRegionCompressedByteCeiling:EXPECTED.maxRegionCompressedBytes,sourceRoots:EXPECTED.rootCount,sourceTiles:EXPECTED.tileCount,regionCount:packetSummaries.length,rootSum,largestRegionalCompressedBytes:maxCompressed,totalRegionalCompressedBytes:totalCompressed,habitatCompressedBytes:habitatGzip.length,packetCompressionPlusHabitatBytes:totalCompressed+habitatGzip.length,sourceRawReconstructedSha256:hash(reconstructed),cameraCoverage,packetSummaries};
}
function main(){
  const base=process.argv[2]||path.join('showroom','globe','h-earth','render','assets');
  const manifestPath=path.join(base,'precomputed-grass.v1.json');
  const gzipPath=path.join(base,'precomputed-grass.v1.bin.gz');
  const manifestBuffer=fs.readFileSync(manifestPath);
  requireEq(hash(manifestBuffer),EXPECTED.manifestSha256,'FROZEN_MANIFEST_SHA256_MISMATCH');
  const m=JSON.parse(manifestBuffer.toString('utf8'));const metadata=auditManifest(m);
  const gz=fs.readFileSync(gzipPath);
  requireEq(gz.length,EXPECTED.compressedBytes,'SOURCE_GZIP_LENGTH');
  requireEq(hash(gz),EXPECTED.compressedSha256,'SOURCE_GZIP_SHA256');
  const raw=gunzipSync(gz);
  requireEq(raw.length,EXPECTED.rawBytes,'SOURCE_RAW_LENGTH');
  requireEq(hash(raw),EXPECTED.rawSha256,'SOURCE_RAW_SHA256');
  const proof=packingProof(m,raw);
  process.stdout.write(JSON.stringify({schema:'H_EARTH_REGIONAL_PACKET_REPLACEMENT_PROOF_v1',sourceIdentity:EXPECTED,metadata,...metadata,proof},null,2)+'\n');
}
try{main();}catch(e){process.stderr.write('FIRST_FAILED_ASSERTION '+(e.code||e.message)+'\n');process.exitCode=1;}
