import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync,gzipSync} from 'node:zlib';
import {visibleSurface,cover,materials,habitatModule} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {centralGroundAdmission as admit} from '../coastal-grass-redistribution-v1/central-admission.mjs';
import {contourWeight} from '../coastal-grass-redistribution-v1/field.mjs';
import {centralRetention} from '../coastal-grass-redistribution-v1/central-contour.mjs';
import {hillsideDensity} from '../../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
const sha=b=>createHash('sha256').update(b).digest('hex');
const input=process.env.GRASS_BASE_ASSET_DIR;assert(input,'GRASS_BASE_ASSET_DIR required');
const output=process.env.GRASS_REPAIR_OUTPUT_DIR;assert(output,'GRASS_REPAIR_OUTPUT_DIR required');
const manifestBytes=fs.readFileSync(path.join(input,'precomputed-grass.v1.json'));
assert.equal(sha(manifestBytes),'e186d57007b252015cdad1d720c300637f3c8ace75a469db2970d335c7ea153a');
const manifest=JSON.parse(manifestBytes),raw=gunzipSync(fs.readFileSync(path.join(input,'precomputed-grass.v1.bin.gz')));
assert.equal(sha(raw),manifest.rawSha256);
const key=(x,z)=>Math.floor(x)+':'+Math.floor(z),tiles=[],cells=new Map(),positions=new Set();let offset=0;
for(const t of manifest.tiles){const records=[];for(let j=0;j<t.count;j++){const b=raw.subarray(offset,offset+52);offset+=52;records.push(b);const x=b.readDoubleLE(0),z=b.readDoubleLE(16),k=key(x,z);if(!cells.has(k))cells.set(k,[]);cells.get(k).push({b,t,j});positions.add(x+':'+z);}tiles.push({...t,records});}
function witness(x,z){const s=visibleSurface.sample(x,z);if(!s||s.slope>1.6||!admit(x,z,s))return null;const local=cover.inverseHEarthGroundCoverPoint(x,s.y,z);if(centralRetention(local.x,s.y,local.z)<.999)return null;const m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(local.x,local.z);if(!(m?.valid===true&&(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20)))return null;const shore=visibleSurface.beach.sample({x,z,support:s});if(!shore?.valid)return null;const density=hillsideDensity({x,y:s.y,z,shaderSlope:shore.shaderSlope,contactDistance:shore.interpolatedExposedContactDistance,sandCoverage:shore.rawSandCoverage});if(!Number.isFinite(density)||density<=0||contourWeight(local.x,local.z)<.999)return null;return {s,density};}
// Only comparable fully eligible cells outside the approved contour taper.
const census=JSON.parse(fs.readFileSync(new URL('./combined-census.json',import.meta.url)));
assert.equal(census.inputRawSha256,manifest.rawSha256);assert.equal(census.combinedRoots,2914527);
const runtimeText=gunzipSync(fs.readFileSync(new URL('./runtime-current.json.gz',import.meta.url))).toString();assert.equal(sha(runtimeText),census.runtimeSha256);
const runtime=JSON.parse(runtimeText),near=new Map();
for(const t of runtime.tiles)for(const r of t.roots){const k=Math.floor(r.x/.08)+':'+Math.floor(r.z/.08);if(!near.has(k))near.set(k,[]);near.get(k).push(r);}
function nearRuntime(x,z){const ix=Math.floor(x/.08),iz=Math.floor(z/.08);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(const r of near.get((ix+dx)+':'+(iz+dz))||[])if(Math.hypot(x-r.x,z-r.z)<.075)return true;return false;}
const plan=JSON.parse(fs.readFileSync(new URL('./density-plan.json',import.meta.url)));assert.equal(plan.inputRawSha256,manifest.rawSha256);
const proposals=[],donors=[],targets=[],hash=habitatModule.habitatHash;
for(const change of plan.tiles){const tile=tiles.find(t=>t.minX===change.x&&t.minZ===change.z);assert(tile);assert.equal(tile.count,change.before);assert.equal(tile.baselineCount,change.baselineCount);assert(change.after>=tile.baselineCount);const delta=change.after-change.before;
 if(delta<0){const pool=tile.records.map((b,j)=>({b,j,t:tile})).filter(r=>r.j>=tile.baselineCount&&witness(r.b.readDoubleLE(0),r.b.readDoubleLE(16))).sort((a,b)=>a.b.readUInt32LE(40)-b.b.readUInt32LE(40));assert(pool.length>=-delta);donors.push(...pool.slice(0,-delta));}
 else for(let n=0;n<delta;n++){let selected=null;for(let attempt=0;attempt<1024;attempt++){
 const xx=Math.fround(change.x+.04+3.92*hash(change.x*31+n,change.z,2894+attempt*2)/4294967296),zz=Math.fround(change.z+.04+3.92*hash(change.x*17+n,change.z,2895+attempt*2)/4294967296),q=witness(xx,zz);
 if(q&&!positions.has(xx+':'+zz)&&!nearRuntime(xx,zz)){selected={x:xx,z:zz,...q};positions.add(xx+':'+zz);break;}
 }assert(selected,'TARGET_CAPACITY '+JSON.stringify(change));proposals.push(selected);}
 targets.push({tile:[change.x,change.z],before:change.before,after:change.after});
}
assert.equal(donors.length,proposals.length);assert.equal(donors.length,plan.moved);assert(proposals.length>0);
const removed=new Set(donors.map(r=>r.b.byteOffset)),byId=new Map(tiles.map(t=>[t.id,t]));
for(const t of tiles)t.records=t.records.filter(b=>!removed.has(b.byteOffset));
const changes=[];
for(let i=0;i<proposals.length;i++){const q=proposals[i],old=donors[i].b,b=Buffer.from(old);b.writeDoubleLE(q.x,0);b.writeDoubleLE(Math.fround(q.s.y),8);b.writeDoubleLE(q.z,16);b.writeDoubleLE(q.s.slope,32);b.writeUInt32LE(q.s.triangleId,44);const ix=Math.floor(q.x/4),iz=Math.floor(q.z/4),id=ix+':'+iz;if(!byId.has(id)){const t={id,minX:ix*4,minZ:iz*4,baselineCount:0,records:[]};byId.set(id,t);tiles.push(t);}byId.get(id).records.push(b);changes.push({fromOffset:old.byteOffset-raw.byteOffset,to:[q.x,Math.fround(q.s.y),q.z],seed:b.readUInt32LE(40)});}
let priorOffset=0;for(const t of manifest.tiles){const now=byId.get(t.id);assert.equal(now.baselineCount,t.baselineCount);assert(Buffer.concat(now.records.slice(0,t.baselineCount)).equals(raw.subarray(priorOffset,priorOffset+t.baselineCount*52)),'PREFIX_CHANGED');priorOffset+=t.count*52;}
const records=tiles.flatMap(t=>t.records);assert.equal(records.length,2858738);assert(Math.max(...tiles.map(t=>t.records.length))<=816,'TILE_BUDGET');
// Recompute only coastal atlas texels whose nine-sample footprint intersects
// changed cells. Panel bounds and every other texel remain byte-identical.
const pixels=Buffer.from(raw.subarray(offset)),allCells=new Map();
for(const b of records){const k=key(b.readDoubleLE(0),b.readDoubleLE(16));allCells.set(k,(allCells.get(k)||0)+1);}
const bounds=manifest.habitat.coastal.bounds,sx=(bounds[2]-bounds[0])/192,sz=(bounds[3]-bounds[1])/192;let atlasChanged=0;
for(let az=0;az<192;az++)for(let ax=0;ax<192;ax++){
 const xx=bounds[0]+(ax+.5)*sx,zz=bounds[1]+(az+.5)*sz;
 if(!targets.some(t=>{const [x,z]=t.tile;return xx+sx/3>=x&&xx-sx/3<x+4&&zz+sz/3>=z&&zz-sz/3<z+4;}))continue;
 let sum=0;for(const dx of [-.333,0,.333])for(const dz of [-.333,0,.333]){const x=xx+dx*sx,z=zz+dz*sz,s=visibleSurface.sample(x,z);if(s&&s.slope<=1.6&&admit(x,z,s)){const a=cover.inverseHEarthGroundCoverPoint(x,s.y,z),m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);if(m?.valid===true&&(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20))sum+=Math.min(1,(allCells.get(key(x,z))||0)/24);}}
 const i=az*576+384+ax,value=Math.round(255*sum/9);if(pixels[i]!==value)atlasChanged++;pixels[i]=value;
}
const next=Buffer.concat([...records,pixels]),compressed=gzipSync(next,{level:9});
const packed=new Float32Array(records.length*4);for(let i=0;i<records.length;i++)for(let j=0;j<4;j++)packed[i*4+j]=records[i].readDoubleLE(j*8);
const report={schema:'H_EARTH_PLANTING_BOUNDARY_COMPILER_v1',status:'DIAGNOSTIC_CANDIDATE_NOT_RELEASE_READY',inputRawSha256:manifest.rawSha256,moved:changes.length,rootCount:records.length,prefixesPreserved:true,targets,changes,rawSha256:sha(next),compressedSha256:sha(compressed),packedSha256:sha(Buffer.from(packed.buffer)),densityMetrics:plan.metrics,atlasChanged,atlasSha256:sha(pixels),remaining:['RUNTIME_CAVERN_COMPARISON','DRAW_AND_FRAME_BUDGET','VISUAL_AND_PHYSICAL_ACCEPTANCE','REMAINING_LANDSCAPE_BOUNDARIES']};
const nextManifest={...manifest,rawBytes:next.length,compressedBytes:compressed.length,rawSha256:report.rawSha256,compressedSha256:report.compressedSha256,packedSha256:report.packedSha256,atlasSha256:report.atlasSha256,tiles:tiles.map(({records,...t})=>({...t,count:records.length})),receipt:{...manifest.receipt,tileCount:tiles.length,plantingBoundaryRepair:{moved:report.moved,prefixesPreserved:true}}};
fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'precomputed-grass.v1.bin.gz'),compressed);fs.writeFileSync(path.join(output,'precomputed-grass.v1.json'),JSON.stringify(nextManifest));fs.writeFileSync(path.join(output,'compiler-report.json'),JSON.stringify(report,null,2));console.log('REPAIR_COMPILED',JSON.stringify({moved:report.moved,rootCount:report.rootCount,rawSha256:report.rawSha256}));
