import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {visibleSurface,groundAdmission,geology} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {contourWeight} from './field.mjs';
import {buildCavernEntranceGrass} from '../../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js';
import {buildCavernPalmPlacement} from '../../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
const root=new URL('../../../',import.meta.url),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',base='bce232104d36fc26d7fd3802b544e8910c89a5d6';
const git=p=>execFileSync('git',['show',base+':'+p],{cwd:root,maxBuffer:180*1024*1024}),sha=b=>createHash('sha256').update(b).digest('hex');
const oldManifest=JSON.parse(git(asset+'json')),oldRaw=gunzipSync(git(asset+'bin.gz')),manifest=JSON.parse(fs.readFileSync(new URL(asset+'json',root))),raw=gunzipSync(fs.readFileSync(new URL(asset+'bin.gz',root))),report=JSON.parse(fs.readFileSync(new URL('./receipt.json',import.meta.url))),changes=JSON.parse(gunzipSync(fs.readFileSync(new URL('./changes.json.gz',import.meta.url))));
function unpack(m,b){const map=new Map();let offset=0;for(const t of m.tiles){const records=[];for(let j=0;j<t.count;j++){records.push(b.subarray(offset,offset+52));offset+=52;}map.set(t.id,{...t,records});}return map;}
const oldTiles=unpack(oldManifest,oldRaw),tiles=unpack(manifest,raw),identity=b=>[b.readDoubleLE(0),b.readDoubleLE(8),b.readDoubleLE(16),b.readUInt32LE(40)].join(':');
test('count, GPU allocation, authenticated payload and baseline prefixes remain exact',()=>{
 assert.equal(manifest.rootCount,oldManifest.rootCount);assert.equal(report.added,0);assert.equal(report.removed,0);assert.equal(sha(raw),manifest.rawSha256);assert.equal(report.packedBytes,oldManifest.rootCount*16);
 for(const [id,t]of oldTiles){const n=tiles.get(id);if(!n){assert.equal(t.baselineCount,0);continue;}assert.equal(n.baselineCount,t.baselineCount);for(let j=0;j<t.baselineCount;j++)assert.deepEqual(n.records[j],t.records[j]);}
 for(const t of tiles.values())assert(t.count<=1600);
});
test('every unrelated record is byte-identical and every moved blade has exactly one destination',()=>{
 const removed=new Set(changes.map(c=>[...c.from,c.seed].join(':'))),added=new Set(changes.map(c=>[...c.to,c.seed].join(':')));assert.equal(removed.size,changes.length);assert.equal(added.size,changes.length);
 let preserved=0;
 for(const [id,t]of oldTiles){const a=t.records.filter(b=>!removed.has(identity(b))),b=(tiles.get(id)?.records||[]).filter(b=>!added.has(identity(b)));assert.deepEqual(Buffer.concat(b),Buffer.concat(a),id);preserved+=a.length;}
 assert.equal(preserved,report.unchangedRoots);assert.equal(preserved+changes.length,manifest.rootCount);
 const positions=new Set();for(const t of tiles.values())for(const b of t.records){const k=b.readDoubleLE(0)+':'+b.readDoubleLE(16);assert(!positions.has(k),'DUPLICATE_ROOT');positions.add(k);}
});
test('every moved destination is dry admitted rendered ground inside the rounded contour',()=>{
 for(const c of changes){const [x,y,z]=c.to,s=visibleSurface.sample(x,z);assert(s);assert.equal(s.y,y);assert.equal(s.terrainPrimitiveId,c.primitive);assert.equal(s.triangleId,c.triangleId);assert(groundAdmission(x,z,s));assert(Math.abs(x)>250&&Math.abs(x)<444);assert(z>-283&&z<-145);assert(contourWeight(x,z)>0);const w=visibleSurface.water.sample(x,z);assert(!w||y>w.y+.03);}
});
test('woodland and ravine atlas panels remain byte-identical',()=>{const off=manifest.rootCount*52;for(let z=0;z<192;z++)assert.deepEqual(raw.subarray(off+z*576,off+z*576+384),oldRaw.subarray(off+z*576,off+z*576+384));});
test('shared support change preserves exact procedural cavern baseline',async()=>{
 const existingTiles=[...tiles.values()].filter(t=>t.baselineCount).map(t=>{const packed=new Float32Array(t.baselineCount*4);for(let i=0;i<t.baselineCount;i++)for(let j=0;j<4;j++)packed[i*4+j]=t.records[i].readDoubleLE(j*8);return {...t,count:t.baselineCount,packed};});
 const result=await buildCavernEntranceGrass({existingTiles,visibleSurface:{...visibleSurface,admitGround:groundAdmission},geology,palms:buildCavernPalmPlacement(geology).receipt.placements});
 const bytes=Buffer.from(JSON.stringify(JSON.parse(JSON.stringify(result,(k,v)=>/Ms$|Milliseconds$/.test(k)?undefined:v)))+'\n');
 assert.equal(result.receipt.contactCount,54218);assert.equal(sha(bytes),oldManifest.receipt.terrainRuntimeBaseline.sha256);
});

test('coastal tip is shortened and rounded shoulder receives actual blades',()=>{
 let beforeTip=0,afterTip=0,shoulder=0;
 for(const [source,isOld] of [[oldTiles,true],[tiles,false]])for(const t of source.values())for(let j=t.baselineCount;j<t.records.length;j++){const b=t.records[j],x=b.readDoubleLE(0),y=b.readDoubleLE(8),z=b.readDoubleLE(16);if(Math.abs(x)>350&&z>-145&&y<6&&b.readUInt32LE(48)===2){if(isOld)beforeTip++;else afterTip++;}}
 for(const c of changes)if(Math.abs(c.to[0])>384&&c.to[2]<-190)shoulder++;
 assert(beforeTip>1000);assert.equal(afterTip,0);assert(shoulder>10000);
});
test('relocated blades span each full cell without repeated empty row bands',()=>{
 const bins=[0,0,0,0];for(const c of changes){const z=c.to[2];bins[Math.min(3,Math.floor((z-Math.floor(z))*4))]++;}
 for(const n of bins)assert(n>changes.length*.15&&n<changes.length*.35,'QUARTER_CELL_SAMPLING_BIAS');
});
