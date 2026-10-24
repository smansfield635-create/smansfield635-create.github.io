import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {visibleSurface,groundAdmission as originalGroundAdmission,materials,cover,habitatModule} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {centralGroundAdmission as groundAdmission,oasisClearance,reservationReceipt} from './central-admission.mjs';
import {centralRetention} from './central-contour.mjs';
import {smooth} from '../../../showroom/globe/h-earth/render/grass-coastal-field.v1.js';
const base='0a1124d4337fdabed155273dbf80b4750188141b',root=new URL('../../../',import.meta.url),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',sha=b=>createHash('sha256').update(b).digest('hex');
const git=p=>execFileSync('git',['show',base+':'+p],{cwd:root,maxBuffer:180*1024*1024});
const prior=JSON.parse(git(asset+'json')),before=gunzipSync(git(asset+'bin.gz'));
assert.equal(sha(before),prior.rawSha256);
const occupied=new Set();const hash=habitatModule.habitatHash,tiles=new Map(),cells=new Map(),donors=[],retained=[];let offset=0;
const key=(x,z)=>Math.floor(x)+':'+Math.floor(z);
function witness(x,z){const s=visibleSurface.sample(x,z);if(!s)return null;const b=visibleSurface.beach.sample({x,z,support:s});if(!b.valid)return null;return {s,b};}
function eligible(x,z,w){if(!w||!groundAdmission(x,z,w.s)||w.s.slope>1.6)return false;const a=cover.inverseHEarthGroundCoverPoint(x,w.s.y,z),m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);return m?.valid===true&&(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20);}
function oasisWeight(x,z){return x<-26||x>42||z<-212||z>-123?1:smooth(0,4,oasisClearance(x,z));}
function add(b,baseline=false){const x=b.readDoubleLE(0),z=b.readDoubleLE(16),id=Math.floor(x/4)+':'+Math.floor(z/4);if(!tiles.has(id))tiles.set(id,{id,minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,baseline:[],extra:[]});tiles.get(id)[baseline?'baseline':'extra'].push(b);cells.set(key(x,z),(cells.get(key(x,z))||0)+1);occupied.add(x+':'+z);}
for(const t of prior.tiles)for(let j=0;j<t.count;j++){
 const b=before.subarray(offset,offset+52);offset+=52;
 const x=b.readDoubleLE(0),y=b.readDoubleLE(8),z=b.readDoubleLE(16);
 let donate=false;
 if(b.readUInt32LE(48)===2){
  const local=cover.inverseHEarthGroundCoverPoint(x,y,z);
  const weight=1-centralRetention(local.x,y,local.z);
  donate=hash(b.readUInt32LE(40),2878,13)/4294967296<weight;
 }

 if(donate)donors.push(b);else {retained.push(b);add(b,j<t.baselineCount);}
}
console.log('DONOR_COHORT',donors.length);
// Rank eligible inland candidates deterministically and relocate the entire
// authenticated donor cohort; insufficient capacity must fail before writes.
const candidates=[];let recipientCapacity=0;
const compare=(a,b)=>a.rank-b.rank||a.x-b.x||a.z-b.z;
// Keep only the smallest donor-count ranks in a deterministic max heap. The
// scanned inland capacity is counted separately; no unbounded witness retention.
function offer(p){
 recipientCapacity++;
 if(candidates.length<donors.length){candidates.push(p);let i=candidates.length-1;while(i){const parent=(i-1)>>1;if(compare(candidates[parent],candidates[i])>=0)break;[candidates[parent],candidates[i]]=[candidates[i],candidates[parent]];i=parent;}return;}
 if(compare(p,candidates[0])>=0)return;
 candidates[0]=p;let i=0;
 while(true){let largest=i;for(const child of [i*2+1,i*2+2])if(child<candidates.length&&compare(candidates[child],candidates[largest])>0)largest=child;if(largest===i)break;[candidates[i],candidates[largest]]=[candidates[largest],candidates[i]];i=largest;}
}
for(let z=-280;z<-175;z++)for(let cx=-180;cx<200;cx++){
 const mid=witness(cx+.5,z+.5);if(!mid||!eligible(cx+.5,z+.5,mid))continue;
 const local=cover.inverseHEarthGroundCoverPoint(cx+.5,mid.s.y,z+.5);
 // Recipient boundary uses the same contour; never replant removed clearance.
 const cw=centralRetention(local.x,mid.s.y,local.z)*oasisWeight(local.x,local.z);if(cw<.999)continue;
 const existing=cells.get(key(cx,z))||0;
 if(existing===0)continue; // Densify established inland planting; do not invent rectangular new patches.
 const edge=smooth(-180,-165,cx)*(1-smooth(185,200,cx))*smooth(-280,-265,z)*(1-smooth(-190,-175,z));
 const quota=Math.floor(32*edge);
 for(let j=existing;j<quota;j++){
  const slot=(j*7+hash(cx,z,2881)%32)%32,ix=slot%8,iz=Math.floor(slot/8),x=Math.fround(cx+(ix+.15+.7*hash(cx*31+j,z,2878)/4294967296)/8),zz=Math.fround(z+(iz+.15+.7*hash(cx,z*31+j,2879)/4294967296)/4);
  if(occupied.has(x+':'+zz))continue;const w=witness(x,zz);if(!eligible(x,zz,w))continue;
  const actual=cover.inverseHEarthGroundCoverPoint(x,w.s.y,zz);if(centralRetention(actual.x,w.s.y,actual.z)<.999||oasisWeight(actual.x,actual.z)<=0)continue;
  // Fill nearby inland gaps before denser existing ground, with no row bias.
  offer({x,z:zz,y:w.s.y,slope:w.s.slope,triangleId:w.s.triangleId,primitive:w.s.terrainPrimitiveId,rank:existing/32+.15*hash(cx*31+j,z,2880)/4294967296});
 }
}
candidates.sort(compare);
const moved=donors.length;assert(moved>0,'NO_VALID_REDISTRIBUTION');assert(candidates.length>=moved,'INSUFFICIENT_INLAND_CAPACITY_MUST_NOT_LEAVE_DONORS');

const chosen=new Set(donors.slice(0,moved).map(b=>b.byteOffset-before.byteOffset));
// Preserve original ordering and bytes for every unselected record.
tiles.clear();cells.clear();occupied.clear();retained.length=0;offset=0;
for(const t of prior.tiles)for(let j=0;j<t.count;j++){const b=before.subarray(offset,offset+52);if(!chosen.has(offset)){retained.push(b);add(b,j<t.baselineCount);}offset+=52;}
const changes=[];
for(let i=0;i<moved;i++){
 const old=donors[i];
 const p=candidates[i],b=Buffer.from(old);b.writeDoubleLE(p.x,0);b.writeDoubleLE(Math.fround(p.y),8);b.writeDoubleLE(p.z,16);b.writeDoubleLE(p.slope,32);b.writeUInt32LE(p.triangleId,44);add(b);
 changes.push({from:[old.readDoubleLE(0),old.readDoubleLE(8),old.readDoubleLE(16)],to:[p.x,p.y,p.z],primitive:p.primitive,triangleId:p.triangleId,seed:b.readUInt32LE(40)});
}
const ordered=[...tiles.values()],records=ordered.flatMap(t=>[...t.baseline,...t.extra]);assert.equal(records.length,prior.rootCount);
const maxTile=Math.max(...ordered.map(t=>t.baseline.length+t.extra.length));assert(maxTile<=1600);
console.log('MOVED',moved,'DESTINATION_CAPACITY',recipientCapacity);
const pixels=Buffer.from(before.subarray(offset)),bounds=[-448,prior.habitat.coastal.bounds[1],448,prior.habitat.coastal.bounds[3]],sx=(bounds[2]-bounds[0])/192,sz=(bounds[3]-bounds[1])/192;
for(let z=0;z<192;z++)for(let x=0;x<192;x++){
 let sum=0;for(const dz of [-.333,0,.333])for(const dx of [-.333,0,.333]){const xx=bounds[0]+(x+.5+dx)*sx,zz=bounds[1]+(z+.5+dz)*sz,w=witness(xx,zz);if(eligible(xx,zz,w))sum+=Math.min(1,(cells.get(key(xx,zz))||0)/24);}
 pixels[z*576+384+x]=Math.round(255*sum/9);
}
const rootBytes=Buffer.concat(records),raw=Buffer.concat([rootBytes,pixels]),compressed=gzipSync(raw,{level:9}),packed=new Float32Array(records.length*4);
for(let i=0;i<records.length;i++)for(let j=0;j<4;j++)packed[i*4+j]=records[i].readDoubleLE(j*8);
const report={schema:'H_EARTH_COASTAL_GRASS_REDISTRIBUTION_v1',baseline:base,rootCount:prior.rootCount,moved,added:0,removed:0,donorCandidates:donors.length,recipientCapacity,unmovedDonorCandidates:donors.length-moved,repairTarget:"SHORTEN_COMPLETE_CENTRAL_COASTAL_COHORT_AND_ROUND_ESTATE_CLEARANCE",oasisReservation:reservationReceipt,ownerImageRegistration:"NOT_CLAIMED_OWNER_WAIVED_CAMERA_PREVIEW",unchangedRoots:retained.length,unchangedRecordsSha256:sha(Buffer.concat(retained)),baselinePrefixesPreserved:false,unrelatedBaselineRecordsPreserved:true,nonCoastalAtlasPanelsPreserved:true,maximumTileRoots:maxTile,packedBytes:packed.byteLength,rawSha256:sha(raw),compressedSha256:sha(compressed),packedSha256:sha(Buffer.from(packed.buffer)),atlasSha256:sha(pixels),changesSha256:sha(JSON.stringify(changes)),actualDevicePerformance:'NOT_MEASURED'};
const manifest={...prior,rawBytes:raw.length,compressedBytes:compressed.length,rawSha256:report.rawSha256,compressedSha256:report.compressedSha256,packedSha256:report.packedSha256,atlasSha256:report.atlasSha256,tiles:ordered.map(t=>({id:t.id,minX:t.minX,minZ:t.minZ,count:t.baseline.length+t.extra.length,baselineCount:t.baseline.length})),receipt:{...prior.receipt,tileCount:ordered.length,coastalRedistribution:report},habitat:{...prior.habitat,coastal:{...prior.habitat.coastal,bounds}}};
const json=JSON.stringify(manifest)+'\n';
if(process.argv.includes('--verify')){assert.deepEqual(fs.readFileSync(new URL(asset+'bin.gz',root)),compressed);assert.equal(fs.readFileSync(new URL(asset+'json',root),'utf8'),json);console.log('DETERMINISTIC_REDISTRIBUTION_PASS');}else{
 fs.writeFileSync(new URL(asset+'bin.gz',root),compressed);fs.writeFileSync(new URL(asset+'json',root),json);
 fs.writeFileSync(new URL('./changes.json.gz',import.meta.url),gzipSync(JSON.stringify(changes),{level:9}));fs.writeFileSync(new URL('./receipt.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 const loader=new URL('showroom/globe/h-earth/render/precomputed-grass.v1.js',root);fs.writeFileSync(loader,fs.readFileSync(loader,'utf8').replace(/const MANIFEST_SHA256='[^']*';/,`const MANIFEST_SHA256='${sha(json)}';`));
 console.log(JSON.stringify(report));
}
