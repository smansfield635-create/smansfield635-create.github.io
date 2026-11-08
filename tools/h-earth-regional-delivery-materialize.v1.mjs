#!/usr/bin/env node
// H-Earth Gen3186: deterministic materialization of the proven 32 m regional
// grass partition. Never modifies or regenerates the accepted planting source.
// Output is staging evidence until an independently admitted asset adoption.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {fileURLToPath, pathToFileURL} from 'node:url';

const SOURCE=Object.freeze({
 manifestSha256:'9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf',
 compressedSha256:'4a2ff2a135984d67d68d3df7c3212236894c75b66826f256a60130c87b73e800',
 rawSha256:'bb5bdea6223aaea0422bac76f73da46d0370e51d81b3fdb280c970c408879a97',
 frozenHead:'c9e20794436378bef65bea4ec3c0a10eec78751e',
 roots:2858738, tiles:8198, stride:52, rawBytes:148764968,
 compressedBytes:64564514, habitatBytes:576*192,
 regions:182, maxCompressedBytes:8000000,
 expectedRegionalGzipBytes:64552251,
 expectedHabitatGzipBytes:30166,
 expectedLargestRegionBytes:1024288
});
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const assert=(ok,code)=>{if(!ok)throw Error('H_EARTH_REGION_'+code);};
const keyOrder=(a,b)=>a.localeCompare(b,'en',{numeric:true});
const regionKey=(tile,side=32)=>String(Math.floor(tile.minX/side))+':'+String(Math.floor(tile.minZ/side));
const pathForRegion=id=>'grass-region.'+id.replace(':','.')+'.v1.bin.gz';

export function groupSourceTiles(tiles,{stride=52,regionSideMeters=32}={}){
 assert(Array.isArray(tiles)&&tiles.length>0,'TILES_INVALID');
 const grouped=new Map(),ids=new Set();let first=0;
 for(const [tileIndex,tile] of tiles.entries()){
  assert(typeof t.id==='string'&&!ids.has(t.id),'TILE_ID_DUPLICATE');
  ids.add(t.id);
  assert(Number.isInteger(t.count)&&t.count>0&&Number.isInteger(t.baselineCount)&&t.baselineCount>=0&&t.baselineCount<=t.count,'TILE_COUNT_INVALID');
  assert(Number.isFinite(t.minX)&&Number.isFinite(t.minZ)&&t.id===String(t.minX/4)+':'+String(t.minZ/4),'TILE_COORDINATES_INVALID');
  const key=regionKey(t,regionSideMeters);
  if(!grouped.has(key))grouped.set(key,{id:key,tiles:[],roots:0,rawBytes:0});
  const g=grouped.get(key);
  g.tiles.push({tileId:t.id,tileIndex,minX:t.minX,minZ:t.minZ,
   sourceFirstRoot:first,regionFirstRoot:g.roots,count:t.count,baselineCount:t.baselineCount});
  g.roots+=t.count;g.rawBytes+=t.count*stride;first+=t.count;
 }
 const regions=[...grouped.values()].sort((a,b)=>keyOrder(a.id,b.id));
 return{sourceRoots:first,sourceTiles:tiles.length,regions};
}

export function buildRegionBuffers(sourceRootBytes,layout,{stride=52}={}){
 const packets=[];
 for(const region of layout.regions){
  const raw=Buffer.allocUnsafe(region.rawBytes);
  let cursor=0;
  for(const tile of region.tiles){
   const offset=tile.sourceFirstRoot*stride,length=tile.count*stride;
   assert(offset+length<=sourceRootBytes.byteLength,'SOURCE_ROOT_RANGE');
   sourceRootBytes.copy(raw,cursor,offset,offset+length);cursor+=length;
  }
  assert(cursor===raw.byteLength&&region.roots*stride===cursor,'REGION_LAYOUT');
  const compressed=zlib.gzipSync(raw,{level:9,mtime:0});
  assert(compressed.length<=SOURCE.maxCompressedBytes,'REGION_COMPRESSED_BUDGET');
  assert(zlib.gunzipSync(compressed).equals(raw),'REGION_GZIP_ROUNDTRIP');
  packets.push({region,raw,compressed,sha256:hash(compressed)});
 }
 return packets;
}

export function reconstructSourceRootBytes(packets,rootCount,{stride=52}={}){
 const reconstructed=Buffer.alloc(rootCount*stride),seen=new Set();
 let installed=0;
 for(const packet of packets){
  const raw=zlib.gunzipSync(packet.compressed);
  let cursor=0;
  for(const tile of packet.region.tiles){
   assert(!seen.has(tile.tileIndex),'DUPLICATE_SOURCE_TILE');
   seen.add(tile.tileIndex);
   const length=tile.count*stride,offset=tile.sourceFirstRoot*stride;
   assert(offset+length<=reconstructed.length,'RECONSTRUCTION_RANGE');
   raw.copy(reconstructed,offset,cursor,cursor+length);
   cursor+=length;installed+=tile.count;
  }
  assert(cursor===raw.length,'REGION_RECONSTRUCTION_LENGTH');
 }
 assert(installed===rootCount,'RECONSTRUCTED_ROOT_COUNT');
 return reconstructed;
}

function parseArgs(argv){
 const args={};
 for(let i=0;i<argv.length;i+=2){
  const key=argv[i],value=argv[i+1];
  assert(key?.startsWith('--')&&typeof value==='string'&&!Object.hasOwn(args,key),'CLI_ARGUMENTS');
  args[key]=value;
 }
 assert(Object.keys(args).length===2&&args['--source-dir']&&args['--output-dir'],'CLI_SCOPE');
 return args;
}

export function materialize({sourceDir,outputDir}){
 const manifestBytes=fs.readFileSync(path.join(sourceDir,'precomputed-grass.v1.json'));
 assert(hash(manifestBytes)===SOURCE.manifestSha256,'FROZEN_MANIFEST_SHA');
 const sourceManifest=JSON.parse(manifestBytes.toString('utf8'));
 assert(sourceManifest.schema==='H_EARTH_PRECOMPUTED_GRASS_v1'&&sourceManifest.rootCount===SOURCE.roots&&
  sourceManifest.tiles.length===SOURCE.tiles&&sourceManifest.stride===SOURCE.stride&&
  sourceManifest.rawSha256===SOURCE.rawSha256&&sourceManifest.receipt?.contactCount===SOURCE.roots,
  'FROZEN_MANIFEST_IDENTITY');
 const originalCompressed=fs.readFileSync(path.join(sourceDir,'precomputed-grass.v1.bin.gz'));
 assert(originalCompressed.length===SOURCE.compressedBytes&&hash(originalCompressed)===SOURCE.compressedSha256,'FROZEN_COMPRESSED_SOURCE');
 const originalRaw=zlib.gunzipSync(originalCompressed);
 assert(originalRaw.length===SOURCE.rawBytes&&hash(originalRaw)===SOURCE.rawSha256,'FROZEN_RAW_SOURCE');
 const rootEnd=SOURCE.roots*SOURCE.stride;
 const rootBytes=originalRaw.subarray(0,rootEnd),habitat=originalRaw.subarray(rootEnd);
 assert(habitat.length===SOURCE.habitatBytes,'HABITAT_LENGTH');
 const layout=groupSourceTiles(sourceManifest.tiles);
 assert(layout.sourceRoots===SOURCE.roots&&layout.sourceTiles===SOURCE.tiles&&layout.regions.length===SOURCE.regions,'REGION_PARTITION');
 const packets=buildRegionBuffers(rootBytes,layout);
 const recoveredRoots=reconstructSourceRootBytes(packets,SOURCE.roots);
 assert(recoveredRoots.equals(rootBytes),'SOURCE_ROOT_BYTES_DIFFER');
 const habitatGzip=zlib.gzipSync(habitat,{level:9,mtime:0});
 assert(habitatGzip.length===SOURCE.expectedHabitatGzipBytes&&zlib.gunzipSync(habitatGzip).equals(habitat),'HABITAT_RECONSTRUCTION');
 assert(hash(Buffer.concat([recoveredRoots,habitat]))===SOURCE.rawSha256,'GLOBAL_RAW_RECONSTRUCTION');
 const totalRegionalGzipBytes=packets.reduce((n,p)=>n+p.compressed.length,0);
 const largestRegionalGzipBytes=Math.max(...packets.map(p=>p.compressed.length));
 assert(totalRegionalGzipBytes===SOURCE.expectedRegionalGzipBytes&&
  largestRegionalGzipBytes===SOURCE.expectedLargestRegionBytes,'FROZEN_PROOF_SIZE_MISMATCH');
 const regions=packets.map(({region,compressed,sha256})=>({
  id:region.id,path:'regions/'+pathForRegion(region.id),
  compressedBytes:compressed.length,compressedSha256:sha256,
  rawBytes:region.rawBytes,roots:region.roots,tiles:region.tiles
 }));
 const manifest={
  schema:'H_EARTH_PRECOMPUTED_GRASS_REGIONAL_v1',frozenRevision:SOURCE.frozenHead,
  sourceManifestSha256:SOURCE.manifestSha256,sourceCompressedSha256:SOURCE.compressedSha256,
  sourceRawSha256:SOURCE.rawSha256,sourceRoots:SOURCE.roots,sourceTiles:SOURCE.tiles,
  recordStride:SOURCE.stride,regionSideMeters:32,totalRegionCount:SOURCE.regions,
  sourceManifest,habitat:{path:'habitat.v1.bin.gz',compressedBytes:habitatGzip.length,
   compressedSha256:hash(habitatGzip),rawBytes:habitat.length,rawSha256:hash(habitat)},
  totalRegionalCompressedBytes:totalRegionalGzipBytes,regions
 };
 const repoRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 const dest=path.resolve(outputDir),parent=path.dirname(dest);
 assert(!dest.startsWith(repoRoot+path.sep)&&dest!==repoRoot,'OUTPUT_MUST_BE_EXTERNAL_STAGING');
 assert(!fs.existsSync(dest),'OUTPUT_ALREADY_EXISTS');
 fs.mkdirSync(parent,{recursive:true});
 const staged=fs.mkdtempSync(path.join(parent,'.h-earth-regions-'));
 try{
  fs.mkdirSync(path.join(staged,'regions'));
  for(const packet of packets)fs.writeFileSync(path.join(staged,'regions',pathForRegion(packet.region.id)),packet.compressed);
  fs.writeFileSync(path.join(staged,'habitat.v1.bin.gz'),habitatGzip);
  const manifestData=Buffer.from(JSON.stringify(manifest,null,2)+'\n');
  fs.writeFileSync(path.join(staged,'precomputed-grass-regional.v1.json'),manifestData);
  const report={schema:'H_EARTH_REGIONAL_DELIVERY_MATERIALIZATION_RECEIPT_v1',
   result:'EXACT_FROZEN_REGION_PACKETS_MATERIALIZED',sourceSha256:SOURCE.rawSha256,
   sourceRoots:SOURCE.roots,packetCount:packets.length,compressedBytes:totalRegionalGzipBytes,
   largestCompressedBytes:largestRegionalGzipBytes,habitatBytes:habitatGzip.length,
   regionalManifestSha256:hash(manifestData),sourceMutationPerformed:false,productMutationPerformed:false};
  fs.writeFileSync(path.join(staged,'materialization-receipt.json'),JSON.stringify(report,null,2)+'\n');
  fs.renameSync(staged,dest);
  return report;
 }catch(error){fs.rmSync(staged,{recursive:true,force:true});throw error;}
}

const invoked=process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url;
if(invoked){
 try{const args=parseArgs(process.argv.slice(2));console.log(JSON.stringify(materialize({
  sourceDir:path.resolve(args['--source-dir']),outputDir:path.resolve(args['--output-dir'])
 }),null,2));}
 catch(error){console.error('FIRST_FAILED_ASSERTION '+String(error.message));process.exitCode=1;}
}
