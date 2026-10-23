import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {visibleSurface,groundAdmission,materials,cover,habitatModule,geology} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {HILLSIDE_SHORELINE as config,hillsideWeight,hillsideDensity} from '../../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
import {buildCavernEntranceGrass} from '../../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js';
import {buildCavernPalmPlacement} from '../../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
const root=new URL('../../../',import.meta.url),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',base='db743204f1fcc0b6d8fd1dae5bf3b590be5f6d9d',sha=b=>createHash('sha256').update(b).digest('hex');
const git=p=>execFileSync('git',['show',base+':'+p],{cwd:root,maxBuffer:120*1024*1024});
const priorJson=git(asset+'json'),prior=JSON.parse(priorJson),compressedBefore=git(asset+'bin.gz'),rawBefore=gunzipSync(compressedBefore);
assert.equal(sha(rawBefore),prior.rawSha256);assert.equal(prior.rootCount,1518809);
const acceptance=JSON.parse(fs.readFileSync(new URL('./acceptance.json',import.meta.url)));
assert.equal(acceptance.baseline,base);
const scanBounds=[-512,-360,512,160],seedRegions=[{name:'ESTABLISHED_COASTAL_HILLSIDE',bounds:[-136,-253,249,-101]},{name:'SHOULDER',center:[-52,-208],radii:[58,46]},{name:'WEST',center:[18,-226],radii:[42,39]}];
function seedNames(x,z){return seedRegions.filter(r=>r.bounds?x>=r.bounds[0]&&x<=r.bounds[2]&&z>=r.bounds[1]&&z<=r.bounds[3]:((x-r.center[0])/r.radii[0])**2+((z-r.center[1])/r.radii[1])**2<=1).map(r=>r.name);}
const tiles=new Map(),cells=new Map(),positions=new Set(),outside=[],retained=[],removed=[];
const cell=(x,z)=>Math.floor(x)+':'+Math.floor(z);
let offset=0;
function witness(x,z){const s=visibleSurface.sample(x,z);if(!s)return null;const beach=visibleSurface.beach.sample({x,z,support:s});assert(beach.valid);const a=cover.inverseHEarthGroundCoverPoint(x,s.y,z),material=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);return {s,beach,material};}
function rejection(x,z,w){if(!w)return 'NO_SUPPORT';const water=visibleSurface.water.sample(x,z);if(water&&w.s.y<=water.y+.03)return 'WATER';if(w.s.slope>1.6)return 'STEEP';if(!groundAdmission(x,z,w.s))return 'GROUND_ADMISSION';const m=w.material;if(m?.valid!==true)return 'INVALID_MATERIAL';if(!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20))return 'MATERIAL';return null;}
function admitted(x,z,w){return rejection(x,z,w)===null;}
function density(x,z,w){return hillsideDensity({x,y:w.s.y,z,shaderSlope:w.beach.shaderSlope,contactDistance:w.beach.interpolatedExposedContactDistance,sandCoverage:w.beach.rawSandCoverage});}
function add(b){const x=b.readDoubleLE(0),z=b.readDoubleLE(16),id=Math.floor(x/4)+':'+Math.floor(z/4);if(!tiles.has(id))tiles.set(id,{id,minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,records:[]});tiles.get(id).records.push(b);cells.set(cell(x,z),(cells.get(cell(x,z))||0)+1);positions.add(x+':'+z);}
for(const t of prior.tiles)for(let i=0;i<t.count;i++){const b=rawBefore.subarray(offset,offset+52);offset+=52;retained.push(b);add(b);}
assert.equal(retained.length,prior.rootCount);
const savedBeforeCells=new Map(cells),priorTileCounts=new Map(prior.tiles.map(t=>[t.id,t.count])),priorPackedTiles=[];let priorPackedOffset=0;
for(const tile of prior.tiles){const packed=new Float32Array(tile.count*4);for(let i=0;i<tile.count;i++)for(let j=0;j<4;j++)packed[i*4+j]=rawBefore.readDoubleLE(priorPackedOffset+i*52+j*8);priorPackedOffset+=tile.count*52;priorPackedTiles.push({...tile,baselineCount:tile.count,packed});}
const runtimeGenerated=await buildCavernEntranceGrass({existingTiles:priorPackedTiles,visibleSurface:{...visibleSurface,admitGround:groundAdmission},geology,palms:buildCavernPalmPlacement(geology).receipt.placements});
const runtimeBaseline=JSON.parse(JSON.stringify(runtimeGenerated,(key,value)=>/Ms$|Milliseconds$/.test(key)?undefined:value));
const runtimeBaselineBytes=Buffer.from(JSON.stringify(runtimeBaseline)+'\n'),runtimeBaselineSha256=sha(runtimeBaselineBytes),runtimeCells=new Map(),runtimePhysicalCounts=new Map(),runtimeNearCells=new Map();let runtimeBaselineCount=0;
for(const tile of runtimeBaseline.tiles)for(const r of tile.roots){const key=cell(r.x,r.z),physicalKey=Math.floor(r.x/4)+':'+Math.floor(r.z/4),nearKey=Math.floor(r.x/.08)+':'+Math.floor(r.z/.08);runtimeCells.set(key,(runtimeCells.get(key)||0)+1);runtimePhysicalCounts.set(physicalKey,(runtimePhysicalCounts.get(physicalKey)||0)+1);cells.set(key,(cells.get(key)||0)+1);if(!runtimeNearCells.has(nearKey))runtimeNearCells.set(nearKey,[]);runtimeNearCells.get(nearKey).push(r);runtimeBaselineCount++;}
assert.equal(runtimeBaselineCount,runtimeBaseline.receipt.contactCount);
function nearBaselineRuntime(x,z){const ix=Math.floor(x/.08),iz=Math.floor(z/.08);for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)for(const r of runtimeNearCells.get((ix+dx)+':'+(iz+dz))||[])if(Math.hypot(x-r.x,z-r.z)<.075)return true;return false;}
console.log('BASELINE_RUNTIME',JSON.stringify({roots:runtimeBaselineCount,sha256:runtimeBaselineSha256}));
const priorPixels=rawBefore.subarray(offset),beforeCells=new Map(cells),hash=habitatModule.habitatHash,f=Math.fround,spacing=.14,added=[],coverage=[];

let eligibleCells=0,shortCells=0,shortFullyEligibleCells=0;const rejectionCounts={},censusRejections={};
const [x0,z0,x1,z1]=scanBounds;
const proposals=new Map(),components=[],seen=new Set(),centerRejectReasons=new Map(),probeCache=new Map();
function probesAt(cx,cz){const key=cell(cx,cz);if(probeCache.has(key))return probeCache.get(key);let eligibleProbes=0,densitySum=0,representative=null;const probeRejections={},probes=[];for(let pz=0;pz<4;pz++)for(let px=0;px<4;px++){const x=cx+(px+.5)/4,z=cz+(pz+.5)/4,w=witness(x,z),reason=rejection(x,z,w)||(density(x,z,w)>0?null:'ZERO_TERRAIN_DENSITY');if(reason)probeRejections[reason]=(probeRejections[reason]||0)+1;else{eligibleProbes++;densitySum+=density(x,z,w);if(!representative)representative={x,z,w};}probes.push({x,z,reason,density:reason?0:density(x,z,w)});}const result={eligibleProbes,densitySum,probeRejections,probes,representative};probeCache.set(key,result);return result;}
for(let cz=z0;cz<z1;cz++)for(let cx=x0;cx<x1;cx++){const w=witness(cx+.5,cz+.5),key=cell(cx,cz);const reason=rejection(cx+.5,cz+.5,w)||(density(cx+.5,cz+.5,w)>0?null:'ZERO_TERRAIN_DENSITY');if(reason){censusRejections[reason]=(censusRejections[reason]||0)+1;centerRejectReasons.set(key,reason);}else proposals.set(key,{cx,cz,w,centerEligible:true,representativeX:cx+.5,representativeZ:cz+.5});}
const centerEligibleCells=proposals.size,boundaryChecked=new Set(),frontier=[...proposals.values()];let boundaryIncludedCells=0;
for(let i=0;i<frontier.length;i++){const v=frontier[i];for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dz)continue;const cx=v.cx+dx,cz=v.cz+dz;if(cx<x0||cx>=x1||cz<z0||cz>=z1)continue;const key=cell(cx,cz);if(proposals.has(key)||boundaryChecked.has(key))continue;boundaryChecked.add(key);const p=probesAt(cx,cz);if(!p.eligibleProbes)continue;const priorReason=centerRejectReasons.get(key);assert(priorReason);censusRejections[priorReason]--;centerRejectReasons.delete(key);const q={cx,cz,w:p.representative.w,centerEligible:false,representativeX:p.representative.x,representativeZ:p.representative.z};proposals.set(key,q);frontier.push(q);boundaryIncludedCells++;}}
assert.equal(proposals.size+Object.values(censusRejections).reduce((n,v)=>n+v,0),(x1-x0)*(z1-z0));
console.log('BOUNDARY_CENSUS',JSON.stringify({centerEligibleCells,boundaryCheckedCells:boundaryChecked.size,boundaryIncludedCells}));

for(const [key,v]of proposals){if(seen.has(key))continue;const queue=[v];seen.add(key);for(let i=0;i<queue.length;i++){const q=queue[i];for(const [dx,dz]of [[-1,0],[1,0],[0,-1],[0,1]]){const k=cell(q.cx+dx,q.cz+dz);if(proposals.has(k)&&!seen.has(k)){seen.add(k);queue.push(proposals.get(k));}}}components.push(queue);}
components.sort((a,b)=>b.length-a.length);const connected=new Set(),componentReport=[];let selectedBounds=[Infinity,Infinity,-Infinity,-Infinity];
for(let ci=0;ci<components.length;ci++){const component=components[ci],seeds=new Set();let bounds=[Infinity,Infinity,-Infinity,-Infinity];for(const v of component){bounds[0]=Math.min(bounds[0],v.cx);bounds[1]=Math.min(bounds[1],v.cz);bounds[2]=Math.max(bounds[2],v.cx+1);bounds[3]=Math.max(bounds[3],v.cz+1);for(const name of seedNames(v.cx+.5,v.cz+.5))seeds.add(name);}const selected=seeds.size>0;componentReport.push({id:ci,cells:component.length,bounds,selected,seeds:[...seeds],exclusionReason:selected?null:'NO_ESTABLISHED_REGION_INTERSECTION'});if(selected){assert(bounds[0]>x0&&bounds[1]>z0&&bounds[2]<x1&&bounds[3]<z1,'SELECTED_COMPONENT_TOUCHES_CENSUS_BOUNDARY_EXPAND_SCAN');for(const v of component)connected.add(cell(v.cx,v.cz));selectedBounds=[Math.min(selectedBounds[0],bounds[0]),Math.min(selectedBounds[1],bounds[1]),Math.max(selectedBounds[2],bounds[2]),Math.max(selectedBounds[3],bounds[3])];}}
assert(connected.size>0);console.log('CONNECTED_COMPONENTS',JSON.stringify(componentReport));
for(let cz=z0;cz<z1;cz++)for(let cx=x0;cx<x1;cx++){
 if(!connected.has(cell(cx,cz)))continue;const proposal=proposals.get(cell(cx,cz)),w=proposal.w;
 const {eligibleProbes,densitySum,probeRejections,probes}=probesAt(cx,cz);
 const d=densitySum/16,quota=Math.floor(d)+(hash(cx,cz,config.seed)/4294967296<d%1?1:0);eligibleCells++;
 const key=cell(cx,cz),points=[],candidateRejections={};
 for(let iz=Math.floor(cz/spacing)-1;iz<=Math.ceil((cz+1)/spacing);iz++)for(let ix=Math.floor(cx/spacing)-1;ix<=Math.ceil((cx+1)/spacing);ix++){
  const x=f((ix+.5+(hash(ix,iz,config.seed+1)/4294967296-.5)*.76)*spacing),z=f((iz+.5+(hash(ix,iz,config.seed+2)/4294967296-.5)*.76)*spacing);
  if(Math.floor(x)!==cx||Math.floor(z)!==cz||positions.has(x+':'+z))continue;points.push({x,z,ix,iz,rank:hash(ix,iz,config.seed+3)});
 }
 points.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);
 for(const p of points){if((cells.get(key)||0)>=quota)break;const q=witness(p.x,p.z);const reason=nearBaselineRuntime(p.x,p.z)?'BASELINE_RUNTIME_PROXIMITY':rejection(p.x,p.z,q)||(density(p.x,p.z,q)>0?null:'ZERO_TERRAIN_DENSITY');if(reason){rejectionCounts[reason]=(rejectionCounts[reason]||0)+1;candidateRejections[reason]=(candidateRejections[reason]||0)+1;continue;}
  const b=Buffer.alloc(52);[p.x,f(q.s.y),p.z,f(hash(p.ix,p.iz,config.seed+4)/4294967296*Math.PI*2),q.s.slope].forEach((v,i)=>b.writeDoubleLE(v,i*8));b.writeUInt32LE(hash(p.ix,p.iz,config.seed+5),40);b.writeUInt32LE(q.s.triangleId,44);b.writeUInt32LE(2,48);add(b);added.push(b);
 }
 const final=cells.get(key)||0;if(final<quota){shortCells++;if(eligibleProbes===16)shortFullyEligibleCells++;}
 coverage.push({x:cx+.5,z:cz+.5,centerEligible:proposal.centerEligible,representativeX:proposal.representativeX,representativeZ:proposal.representativeZ,probes,y:w.s.y,slope:w.s.slope,sand:w.beach.rawSandCoverage,contact:w.beach.interpolatedExposedContactDistance,quota,requiredOccupancy:Math.max(beforeCells.get(key)||0,quota),eligibleProbes,probeRejections,candidateRejections,savedBefore:savedBeforeCells.get(key)||0,savedAfter:final-(runtimeCells.get(key)||0),runtimeOccupancy:runtimeCells.get(key)||0,before:beforeCells.get(key)||0,after:final});
}
const ordered=[...tiles.values()].filter(t=>t.records.length),count=ordered.reduce((n,t)=>n+t.records.length,0),maxTile=ordered.reduce((n,t)=>Math.max(n,t.records.length),0);
console.log('ALLOCATION',JSON.stringify({count,added:added.length,removed:removed.length,maxTile,eligibleCells,shortCells}));
assert.equal(shortFullyEligibleCells,0,'FULLY_ELIGIBLE_CELLS_BELOW_FROZEN_QUOTA');assert.equal(count,prior.rootCount+added.length);assert(maxTile<=1600);const physicalCounts=new Map(runtimePhysicalCounts);for(const t of ordered)physicalCounts.set(t.id,(physicalCounts.get(t.id)||0)+t.records.length);const combinedMaximumTileRoots=[...physicalCounts.values()].reduce((n,k)=>Math.max(n,k),0);assert(combinedMaximumTileRoots<=1600,'COMBINED_RUNTIME_SAVED_TILE_BUDGET');
const pixels=Buffer.from(priorPixels),size=192,width=576,bounds=selectedBounds,stepX=(bounds[2]-bounds[0])/size,stepZ=(bounds[3]-bounds[1])/size;
for(let z=0;z<size;z++)for(let x=0;x<size;x++){const xx=bounds[0]+(x+.5)*stepX,zz=bounds[1]+(z+.5)*stepZ;let sum=0;for(const dz of [-.333,0,.333])for(const dx of [-.333,0,.333]){const px=xx+dx*stepX,pz=zz+dz*stepZ,q=witness(px,pz);if(connected.has(cell(px,pz))&&admitted(px,pz,q))sum+=Math.min(1,(cells.get(cell(px,pz))||0)/24);}pixels[z*width+384+x]=Math.round(255*sum/9);}
for(let z=0;z<size;z++)assert.deepEqual(pixels.subarray(z*width,z*width+384),priorPixels.subarray(z*width,z*width+384));
const rootBytes=Buffer.concat(ordered.flatMap(t=>t.records)),raw=Buffer.concat([rootBytes,pixels]),compressed=gzipSync(raw,{level:9}),packed=new Float32Array(count*4);
for(let i=0;i<count;i++)for(let j=0;j<4;j++)packed[i*4+j]=rootBytes.readDoubleLE(i*52+j*8);
const measurement={schema:'H_EARTH_TERRAIN_GRASS_CONTINUITY_v2',baseline:base,bounds:selectedBounds,scanBounds,centerEligibleCells,boundaryCheckedCells:boundaryChecked.size,boundaryIncludedCells,selectedBoundaryCells:coverage.reduce((n,p)=>n+Number(!p.centerEligible),0),seedRegions,componentReport,censusRejections,rejectionCounts,shortFullyEligibleCells,acceptanceSha256:sha(fs.readFileSync(new URL('./acceptance.json',import.meta.url))),allBaselineRecordsPreserved:true,baselineRootRecordsSha256:sha(Buffer.concat(retained)),budgetApproval:'NOT_CLAIMED',runtimeBaselineSha256,runtimeBaselineCount,baselineSavedCount:prior.rootCount,baselineCombinedCount:prior.rootCount+runtimeBaselineCount,combinedRootCount:count+runtimeBaselineCount,combinedMaximumTileRoots,combinedSavedRootBytes:count*52,savedPackedAndAtlasBytes:packed.byteLength+pixels.length,combinedPackedAndAtlasBytes:(count+runtimeBaselineCount)*16+pixels.length,priorCount:prior.rootCount,rootCount:count,added:added.length,removed:removed.length,outsideCount:outside.length,outsideSha256:sha(Buffer.concat(outside)),retainedInsideCount:retained.length,retainedInsideSha256:sha(Buffer.concat(retained)),addedSha256:sha(Buffer.concat(added)),removedSha256:sha(Buffer.concat(removed)),eligibleCells,shortCells,componentSizes:components.map(v=>v.length),selectedComponentCells:connected.size,maximumTileRoots:maxTile,compressedBytes:compressed.length,compressedDeltaBytes:compressed.length-compressedBefore.length,packedBytes:packed.byteLength,rawSha256:sha(raw),packedSha256:sha(Buffer.from(packed.buffer)),atlasSha256:sha(pixels),woodlandAndRavinePanelsPreserved:true,actualDevicePerformance:'NOT_YET_MEASURED',visualAcceptance:'NOT_REQUIRED_BY_OWNER; NOT_CLAIMED'};
const manifest={...prior,rootCount:count,rawBytes:raw.length,compressedBytes:compressed.length,rawSha256:sha(raw),compressedSha256:sha(compressed),packedSha256:measurement.packedSha256,atlasSha256:measurement.atlasSha256,tiles:ordered.map(t=>({id:t.id,minX:t.minX,minZ:t.minZ,count:t.records.length,baselineCount:priorTileCounts.get(t.id)||0})),receipt:{...prior.receipt,terrainRuntimeBaseline:{baseline:base,sha256:runtimeBaselineSha256,rootCount:runtimeBaselineCount},contactCount:count,tileCount:ordered.length,grassContinuity:{...prior.receipt.grassContinuity,totalContacts:count,addedContacts:prior.receipt.grassContinuity.addedContacts+added.length-removed.length,packedBytes:packed.byteLength},hillsideShoreline:measurement},habitat:{...prior.habitat,coastal:{...prior.habitat.coastal,bounds:selectedBounds},receipt:{...prior.habitat.receipt,hillsideShoreline:measurement}}};
const json=JSON.stringify(manifest)+'\n';
if(process.argv.includes('--verify')){assert.deepEqual(fs.readFileSync(new URL(asset+'bin.gz',root)),compressed);assert.equal(fs.readFileSync(new URL(asset+'json',root),'utf8'),json);assert.deepEqual(gunzipSync(fs.readFileSync(new URL('./runtime-baseline.json.gz',import.meta.url))),runtimeBaselineBytes);console.log('DETERMINISTIC_TERRAIN_CONTINUITY_RECOMPILE_PASS');}else{
 fs.writeFileSync(new URL('./runtime-baseline.json.gz',import.meta.url),gzipSync(runtimeBaselineBytes,{level:9}));
 fs.writeFileSync(new URL(asset+'bin.gz',root),compressed);fs.writeFileSync(new URL(asset+'json',root),json);
 for(const [name,data]of [['added',Buffer.concat(added)],['removed',Buffer.concat(removed)]])fs.writeFileSync(new URL('./'+name+'.bin.gz',import.meta.url),gzipSync(data,{level:9}));
 fs.writeFileSync(new URL('./coverage.json.gz',import.meta.url),gzipSync(Buffer.from(JSON.stringify(coverage)),{level:9}));fs.writeFileSync(new URL('./checkpoint.json',import.meta.url),JSON.stringify(measurement,null,2)+'\n');
 const p=new URL('showroom/globe/h-earth/render/precomputed-grass.v1.js',root),s=fs.readFileSync(p,'utf8').replace(/const MANIFEST_SHA256='[^']*';/,`const MANIFEST_SHA256='${sha(json)}';`).replace(/manifest\.rootCount!==\d+/g,'manifest.rootCount!=='+count).replace(/manifest\.receipt\?\.contactCount!==\d+/g,'manifest.receipt?.contactCount!=='+count);fs.writeFileSync(p,s);
 console.log(JSON.stringify(measurement));
}
