// Gen2826 RGB-only structural verifier, independent of the appearance function.
// Never treat this comparison alone as owner/device acceptance.
import fs from 'node:fs';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
export const SHA = bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
export const COUNTS=Object.freeze({land:1284360,indices:192624,water:671188,waterIndices:143856});
const assert=(ok,msg)=>{if(!ok)throw Error('FAIL_CLOSED_'+msg)};
const rawWords=a=>new Uint32Array(a.buffer,a.byteOffset,a.byteLength/4);
export function verifyMaterialDelta(original,candidate){
  const a=original.landMesh,b=candidate.landMesh,x=original.coastalWaterMesh,y=candidate.coastalWaterMesh;
  for(const [label,p,q,length] of [
    ['LAND',a.vertices,b.vertices,COUNTS.land],
    ['LAND_INDICES',a.indices,b.indices,COUNTS.indices],
    ['WATER',x.vertices,y.vertices,COUNTS.water],
    ['WATER_INDICES',x.indices,y.indices,COUNTS.waterIndices]
  ])assert(p?.length===length&&q?.length===length&&p.constructor===q.constructor,'COUNT_OR_TYPE_'+label);
  let changed=0,large=0,eligibleFloatWords=0;
  const u=rawWords(a.vertices),v=rawWords(b.vertices);
  for(let i=0;i<u.length;i++){
    const channel=i%10;
    if(channel<6||channel===9)assert(u[i]===v[i],'GEOGRAPHY_OR_NORMAL_OR_ALPHA_DELTA_'+i);
    else {
      const color=b.vertices[i];
      assert(Number.isFinite(color)&&color>=0&&color<=1,'RGB_RANGE_'+i);
      if(u[i]!==v[i]){changed++;eligibleFloatWords++}
    }
  }
  for(let i=0;i<COUNTS.land;i+=10){
    const delta=Math.hypot(a.vertices[i+6]-b.vertices[i+6],a.vertices[i+7]-b.vertices[i+7],a.vertices[i+8]-b.vertices[i+8]);
    if(delta>0)changed++;
    if(delta>.03)large++;
  }
  for(const [label,p,q] of [['LAND_INDICES',a.indices,b.indices],['WATER',x.vertices,y.vertices],['WATER_INDICES',x.indices,y.indices]]){
    const pp=rawWords(p),qq=rawWords(q);
    for(let i=0;i<pp.length;i++)assert(pp[i]===qq[i],label+'_BYTE_DELTA_'+i);
  }
  const originalStatistics=JSON.stringify({land:a.statistics,water:x.statistics});
  const successorStatistics=JSON.stringify({land:b.statistics,water:y.statistics});
  assert(originalStatistics===successorStatistics,'STATISTICS_DELTA');
  assert(eligibleFloatWords>0,'NO_RGB_DELTA');
  assert(large>=Math.ceil(COUNTS.land/10*.10),'INSUFFICIENT_MACRO_DELTA');
  return Object.freeze({schema:'AUDRALIA_GRATITUDE_MATERIAL_DELTA_v2',result:'PASS_STATIC_WORD_COMPARISON',
    landVertices:COUNTS.land/10,landIndices:COUNTS.indices,waterFloats:COUNTS.water,waterIndices:COUNTS.waterIndices,
    nonRgbWordDeltas:0,waterWordDeltas:0,eligibleRgbChangedWords:eligibleFloatWords,significantRgbVertices:large,
    statisticsSha256:SHA(Buffer.from(originalStatistics)),ownerPhysicalAcceptance:false});
}
export function encodeMeshes(built){
  const land=built.landMesh,water=built.coastalWaterMesh;
  const stats=Buffer.from(JSON.stringify({land:land.statistics,water:water.statistics}),'utf8');
  const header=Buffer.alloc(32);header.write('AUDGMV1',0,'ascii');
  for(const [offset,val] of [[8,1],[12,land.vertices.length],[16,land.indices.length],[20,water.vertices.length],[24,water.indices.length],[28,stats.length]])header.writeUInt32LE(val,offset);
  const bytes=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
  return Buffer.concat([header,bytes(land.vertices),bytes(land.indices),bytes(water.vertices),bytes(water.indices),stats]);
}
export function verifyGzipParts(payload,parts,provenance){
  assert(parts.length===8&&provenance.mesh.partCount===8,'PART_COUNT');
  const decoded=[];
  for(let i=0;i<parts.length;i++){
    const item=parts[i],m=provenance.mesh.parts[i],expanded=zlib.gunzipSync(item);
    assert(m.index===i&&m.file==='gratitude-mesh-v1.part-'+String(i).padStart(2,'0')+'.gz','PART_ID_'+i);
    assert(item.length===m.compressedBytes&&SHA(item)===m.compressedSha256,'PART_COMPRESSED_SHA_'+i);
    assert(expanded.length===m.expandedBytes&&SHA(expanded)===m.expandedSha256,'PART_EXPANDED_SHA_'+i);
    decoded.push(expanded);
  }
  assert(Buffer.concat(decoded).equals(payload),'EIGHT_PART_REASSEMBLY');
  assert(SHA(payload)===provenance.mesh.payloadSha256,'PAYLOAD_SHA');
  return Object.freeze({partCount:8,payloadSha256:SHA(payload),result:'PASS_EIGHT_PARTS'});
}
export function verifyFileOutput(outputDir,provenance){
  const load=n=>fs.readFileSync(outputDir+'/'+n);
  const expanded=zlib.gunzipSync(load('gratitude-mesh-v1.bin.gz'));
  assert(SHA(expanded)===provenance.mesh.payloadSha256,'FULL_GZIP_PAYLOAD');
  const parts=Array.from({length:8},(_,i)=>load('gratitude-mesh-v1.part-'+String(i).padStart(2,'0')+'.gz'));
  return verifyGzipParts(expanded,parts,provenance);
}
