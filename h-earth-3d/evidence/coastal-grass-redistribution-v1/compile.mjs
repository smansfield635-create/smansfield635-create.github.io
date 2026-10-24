import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {visibleSurface,groundAdmission,materials,cover,habitatModule} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {recipientWeight,donorWeight} from './field.mjs';
const base='bce232104d36fc26d7fd3802b544e8910c89a5d6',root=new URL('../../../',import.meta.url),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',sha=b=>createHash('sha256').update(b).digest('hex');
const git=p=>execFileSync('git',['show',base+':'+p],{cwd:root,maxBuffer:180*1024*1024});
const prior=JSON.parse(git(asset+'json')),before=gunzipSync(git(asset+'bin.gz'));
assert.equal(sha(before),prior.rawSha256);
const occupied=new Set();const hash=habitatModule.habitatHash,tiles=new Map(),cells=new Map(),donors=[],retained=[];let offset=0;
const key=(x,z)=>Math.floor(x)+':'+Math.floor(z);
function witness(x,z){const s=visibleSurface.sample(x,z);if(!s)return null;const b=visibleSurface.beach.sample({x,z,support:s});if(!b.valid)return null;return {s,b};}
function eligible(x,z,w){if(!w||!groundAdmission(x,z,w.s)||w.s.slope>1.6)return false;const a=cover.inverseHEarthGroundCoverPoint(x,w.s.y,z),m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);return m?.valid===true&&(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20);}
function add(b,baseline=false){const x=b.readDoubleLE(0),z=b.readDoubleLE(16),id=Math.floor(x/4)+':'+Math.floor(z/4);if(!tiles.has(id))tiles.set(id,{id,minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,baseline:[],extra:[]});tiles.get(id)[baseline?'baseline':'extra'].push(b);cells.set(key(x,z),(cells.get(key(x,z))||0)+1);occupied.add(x+':'+z);}
for(const t of prior.tiles)for(let j=0;j<t.count;j++){
 const b=before.subarray(offset,offset+52);offset+=52;
 const x=b.readDoubleLE(0),y=b.readDoubleLE(8),z=b.readDoubleLE(16);
 let donate=false;
 if(j>=t.baselineCount&&b.readUInt32LE(48)===2&&y<8&&Math.abs(x)>250){const w=witness(x,z);donate=!!w&&hash(b.readUInt32LE(40),2878,11)/4294967296<donorWeight(x,y,z,w.b.interpolatedExposedContactDistance);}
 if(donate)donors.push(b);else {retained.push(b);add(b,j<t.baselineCount);}
}
console.log('DONOR_COHORT',donors.length);
// Generate candidates once, rank deterministically, and move no more roots than
// either the eligible destination capacity or the authenticated donor cohort.
const candidates=[];
for(let z=-283;z<-145;z++)for(const side of [-1,1])for(let ex=0;ex<194;ex++){
 const cx=side<0?-251-ex:250+ex,cw=recipientWeight(cx+.5,z+.5);if(!cw)continue;
 const quota=Math.floor(24*cw),existing=cells.get(key(cx,z))||0;
 for(let j=existing;j<quota;j++){
  const slot=(j*7+hash(cx,z,2881)%24)%24,ix=slot%6,iz=Math.floor(slot/6),x=Math.fround(cx+(ix+.15+.7*hash(cx*31+j,z,2878)/4294967296)/6),zz=Math.fround(z+(iz+.15+.7*hash(cx,z*31+j,2879)/4294967296)/4);
  if(occupied.has(x+':'+zz))continue;const w=witness(x,zz);if(!eligible(x,zz,w))continue;
  candidates.push({x,z:zz,w,rank:Math.hypot(Math.max(0,Math.abs(x)-300)/140,(zz+240)/90)+.10*hash(cx*31+j,z,2880)/4294967296});
 }
}
candidates.sort((a,b)=>a.rank-b.rank||a.x-b.x||a.z-b.z);
const moved=Math.min(donors.length,candidates.length);assert(moved>0,'NO_VALID_REDISTRIBUTION');assert.equal(moved,donors.length,'INSUFFICIENT_ROUNDED_DESTINATION_CAPACITY');
const changes=[];
for(let i=0;i<donors.length;i++){
 const old=donors[i];if(i>=moved){retained.push(old);add(old);continue;}
 const p=candidates[i],b=Buffer.from(old);b.writeDoubleLE(p.x,0);b.writeDoubleLE(Math.fround(p.w.s.y),8);b.writeDoubleLE(p.z,16);b.writeDoubleLE(p.w.s.slope,32);b.writeUInt32LE(p.w.s.triangleId,44);add(b);
 changes.push({from:[old.readDoubleLE(0),old.readDoubleLE(8),old.readDoubleLE(16)],to:[p.x,p.w.s.y,p.z],primitive:p.w.s.terrainPrimitiveId,triangleId:p.w.s.triangleId,seed:b.readUInt32LE(40)});
}
const ordered=[...tiles.values()],records=ordered.flatMap(t=>[...t.baseline,...t.extra]);assert.equal(records.length,prior.rootCount);
const maxTile=Math.max(...ordered.map(t=>t.baseline.length+t.extra.length));assert(maxTile<=1600);
console.log('MOVED',moved,'DESTINATION_CAPACITY',candidates.length);
const pixels=Buffer.from(before.subarray(offset)),bounds=[-448,prior.habitat.coastal.bounds[1],448,prior.habitat.coastal.bounds[3]],sx=(bounds[2]-bounds[0])/192,sz=(bounds[3]-bounds[1])/192;
for(let z=0;z<192;z++)for(let x=0;x<192;x++){
 let sum=0;for(const dz of [-.333,0,.333])for(const dx of [-.333,0,.333]){const xx=bounds[0]+(x+.5+dx)*sx,zz=bounds[1]+(z+.5+dz)*sz,w=witness(xx,zz);if(eligible(xx,zz,w))sum+=Math.min(1,(cells.get(key(xx,zz))||0)/24);}
 pixels[z*576+384+x]=Math.round(255*sum/9);
}
const rootBytes=Buffer.concat(records),raw=Buffer.concat([rootBytes,pixels]),compressed=gzipSync(raw,{level:9}),packed=new Float32Array(records.length*4);
for(let i=0;i<records.length;i++)for(let j=0;j<4;j++)packed[i*4+j]=records[i].readDoubleLE(j*8);
const report={schema:'H_EARTH_COASTAL_GRASS_REDISTRIBUTION_v1',baseline:base,rootCount:prior.rootCount,moved,added:0,removed:0,donorCandidates:donors.length,recipientCapacity:candidates.length,unchangedRoots:retained.length,unchangedRecordsSha256:sha(Buffer.concat(retained)),baselinePrefixesPreserved:true,nonCoastalAtlasPanelsPreserved:true,maximumTileRoots:maxTile,packedBytes:packed.byteLength,rawSha256:sha(raw),compressedSha256:sha(compressed),packedSha256:sha(Buffer.from(packed.buffer)),atlasSha256:sha(pixels),changesSha256:sha(JSON.stringify(changes)),actualDevicePerformance:'NOT_MEASURED'};
const manifest={...prior,rawBytes:raw.length,compressedBytes:compressed.length,rawSha256:report.rawSha256,compressedSha256:report.compressedSha256,packedSha256:report.packedSha256,atlasSha256:report.atlasSha256,tiles:ordered.map(t=>({id:t.id,minX:t.minX,minZ:t.minZ,count:t.baseline.length+t.extra.length,baselineCount:t.baseline.length})),receipt:{...prior.receipt,tileCount:ordered.length,coastalRedistribution:report},habitat:{...prior.habitat,coastal:{...prior.habitat.coastal,bounds}}};
const json=JSON.stringify(manifest)+'\n';
if(process.argv.includes('--verify')){assert.deepEqual(fs.readFileSync(new URL(asset+'bin.gz',root)),compressed);assert.equal(fs.readFileSync(new URL(asset+'json',root),'utf8'),json);console.log('DETERMINISTIC_REDISTRIBUTION_PASS');}else{
 fs.writeFileSync(new URL(asset+'bin.gz',root),compressed);fs.writeFileSync(new URL(asset+'json',root),json);
 fs.writeFileSync(new URL('./changes.json.gz',import.meta.url),gzipSync(JSON.stringify(changes),{level:9}));fs.writeFileSync(new URL('./receipt.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 const loader=new URL('showroom/globe/h-earth/render/precomputed-grass.v1.js',root);fs.writeFileSync(loader,fs.readFileSync(loader,'utf8').replace(/const MANIFEST_SHA256='[^']*';/,`const MANIFEST_SHA256='${sha(json)}';`));
 console.log(JSON.stringify(report));
}
