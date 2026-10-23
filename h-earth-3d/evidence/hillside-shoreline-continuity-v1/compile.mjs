import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {visibleSurface,groundAdmission,materials,cover,habitatModule} from './support-fixture.mjs';
import {HILLSIDE_SHORELINE as config,hillsideWeight,hillsideDensity} from '../../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
const root=new URL('../../../',import.meta.url),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',base='c64e78d5a05711f0b2ec7e98fb400c65d8e430df',sha=b=>createHash('sha256').update(b).digest('hex');
const git=p=>execFileSync('git',['show',base+':'+p],{cwd:root,maxBuffer:120*1024*1024});
const priorJson=git(asset+'json'),prior=JSON.parse(priorJson),compressedBefore=git(asset+'bin.gz'),rawBefore=gunzipSync(compressedBefore);
assert.equal(sha(rawBefore),prior.rawSha256);assert.equal(prior.rootCount,1457471);
const tiles=new Map(),cells=new Map(),positions=new Set(),outside=[],retained=[],removed=[];
const cell=(x,z)=>Math.floor(x)+':'+Math.floor(z);
let offset=0;
function witness(x,z){const s=visibleSurface.sample(x,z);if(!s)return null;const beach=visibleSurface.beach.sample({x,z,support:s});assert(beach.valid);const a=cover.inverseHEarthGroundCoverPoint(x,s.y,z),material=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);return {s,beach,material};}
function admitted(x,z,w){if(!w||w.s.slope>1.6||!groundAdmission(x,z,w.s))return false;const m=w.material;return m?.valid===true&&(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20);}
function density(x,z,w){return hillsideDensity({x,y:w.s.y,z,shaderSlope:w.beach.shaderSlope,contactDistance:w.beach.interpolatedExposedContactDistance,sandCoverage:w.beach.rawSandCoverage});}
function add(b){const x=b.readDoubleLE(0),z=b.readDoubleLE(16),id=Math.floor(x/4)+':'+Math.floor(z/4);if(!tiles.has(id))tiles.set(id,{id,minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,records:[]});tiles.get(id).records.push(b);cells.set(cell(x,z),(cells.get(cell(x,z))||0)+1);positions.add(x+':'+z);}
for(const t of prior.tiles)for(let i=0;i<t.count;i++){const b=rawBefore.subarray(offset,offset+52);offset+=52;const x=b.readDoubleLE(0),z=b.readDoubleLE(16);
 if(!hillsideWeight(x,z)){outside.push(b);add(b);continue;}
 const w=witness(x,z),water=visibleSurface.water.sample(x,z);
 // Existing accepted planting remains exact unless it is on actual beach/water.
 if(!w||w.beach.rawSandCoverage>.12||(water&&w.s.y<=water.y+.03)){removed.push(b);continue;}
 retained.push(b);add(b);
}
const priorPixels=rawBefore.subarray(offset),beforeCells=new Map(cells),hash=habitatModule.habitatHash,f=Math.fround,spacing=config.spacing,added=[],coverage=[];
let eligibleCells=0,shortCells=0;
const [x0,z0,x1,z1]=config.bounds;
const proposals=new Map(),components=[],seen=new Set();
for(let cz=z0;cz<z1;cz++)for(let cx=x0;cx<x1;cx++){const w=witness(cx+.5,cz+.5);if(admitted(cx+.5,cz+.5,w)&&density(cx+.5,cz+.5,w)>0)proposals.set(cell(cx,cz),{cx,cz,w});}
for(const [key,v]of proposals){if(seen.has(key))continue;const queue=[v];seen.add(key);for(let i=0;i<queue.length;i++){const q=queue[i];for(const [dx,dz]of [[-1,0],[1,0],[0,-1],[0,1]]){const k=cell(q.cx+dx,q.cz+dz);if(proposals.has(k)&&!seen.has(k)){seen.add(k);queue.push(proposals.get(k));}}}components.push(queue);}
components.sort((a,b)=>b.length-a.length);const connected=new Set(components[0].map(v=>cell(v.cx,v.cz)));
console.log('CONNECTED_COMPONENTS',components.map(v=>v.length));
for(let cz=z0;cz<z1;cz++)for(let cx=x0;cx<x1;cx++){
 if(!connected.has(cell(cx,cz)))continue;const w=proposals.get(cell(cx,cz)).w;
 const d=density(cx+.5,cz+.5,w),quota=Math.floor(d)+(hash(cx,cz,config.seed)/4294967296<d%1?1:0);if(!quota)continue;eligibleCells++;
 const key=cell(cx,cz),points=[];
 for(let iz=Math.floor(cz/spacing)-1;iz<=Math.ceil((cz+1)/spacing);iz++)for(let ix=Math.floor(cx/spacing)-1;ix<=Math.ceil((cx+1)/spacing);ix++){
  const x=f((ix+.5+(hash(ix,iz,config.seed+1)/4294967296-.5)*.76)*spacing),z=f((iz+.5+(hash(ix,iz,config.seed+2)/4294967296-.5)*.76)*spacing);
  if(Math.floor(x)!==cx||Math.floor(z)!==cz||positions.has(x+':'+z))continue;points.push({x,z,ix,iz,rank:hash(ix,iz,config.seed+3)});
 }
 points.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);
 for(const p of points){if((cells.get(key)||0)>=quota)break;const q=witness(p.x,p.z);if(!admitted(p.x,p.z,q)||density(p.x,p.z,q)<=0)continue;
  const b=Buffer.alloc(52);[p.x,f(q.s.y),p.z,f(hash(p.ix,p.iz,config.seed+4)/4294967296*Math.PI*2),q.s.slope].forEach((v,i)=>b.writeDoubleLE(v,i*8));b.writeUInt32LE(hash(p.ix,p.iz,config.seed+5),40);b.writeUInt32LE(q.s.triangleId,44);b.writeUInt32LE(2,48);add(b);added.push(b);
 }
 const final=cells.get(key)||0;if(final<quota)shortCells++;
 coverage.push({x:cx+.5,z:cz+.5,y:w.s.y,slope:w.s.slope,sand:w.beach.rawSandCoverage,contact:w.beach.interpolatedExposedContactDistance,quota,before:beforeCells.get(key)||0,after:final});
}
const ordered=[...tiles.values()].filter(t=>t.records.length),count=ordered.reduce((n,t)=>n+t.records.length,0),maxTile=Math.max(...ordered.map(t=>t.records.length));
console.log('ALLOCATION',JSON.stringify({count,added:added.length,removed:removed.length,maxTile,eligibleCells,shortCells}));
assert(count<=config.maximumRoots,'HILLSIDE_POPULATION_BUDGET:'+count);assert(maxTile<=1600);
const pixels=Buffer.from(priorPixels),size=192,width=576,bounds=prior.habitat.coastal.bounds,stepX=(bounds[2]-bounds[0])/size,stepZ=(bounds[3]-bounds[1])/size;
for(let z=0;z<size;z++)for(let x=0;x<size;x++){
 const xx=bounds[0]+(x+.5)*stepX,zz=bounds[1]+(z+.5)*stepZ,weight=hillsideWeight(xx,zz);if(!weight)continue;
 const w=witness(xx,zz);let value=0;
 if(connected.has(cell(xx,zz))&&w&&admitted(xx,zz,w)){let sum=0,valid=true;for(const dz of [-.5,0,.5])for(const dx of [-.5,0,.5]){const px=xx+dx*stepX,pz=zz+dz*stepZ,q=witness(px,pz);if(!q||q.beach.rawSandCoverage>.12||!admitted(px,pz,q)){valid=false;break;}sum+=Math.min(1,(cells.get(cell(px,pz))||0)/16);}if(valid)value=Math.round(255*sum/9);}
 const index=z*width+384+x;pixels[index]=Math.round(pixels[index]*(1-weight)+value*weight);
}
const rootBytes=Buffer.concat(ordered.flatMap(t=>t.records)),raw=Buffer.concat([rootBytes,pixels]),compressed=gzipSync(raw,{level:9}),packed=new Float32Array(count*4);
for(let i=0;i<count;i++)for(let j=0;j<4;j++)packed[i*4+j]=rootBytes.readDoubleLE(i*52+j*8);
const measurement={schema:'H_EARTH_HILLSIDE_SHORELINE_CONTINUITY_v1',baseline:base,bounds:config.bounds,priorCount:prior.rootCount,rootCount:count,added:added.length,removed:removed.length,outsideCount:outside.length,outsideSha256:sha(Buffer.concat(outside)),retainedInsideCount:retained.length,retainedInsideSha256:sha(Buffer.concat(retained)),addedSha256:sha(Buffer.concat(added)),removedSha256:sha(Buffer.concat(removed)),eligibleCells,shortCells,componentSizes:components.map(v=>v.length),selectedComponentCells:connected.size,maximumTileRoots:maxTile,compressedBytes:compressed.length,compressedDeltaBytes:compressed.length-compressedBefore.length,packedBytes:packed.byteLength,rawSha256:sha(raw),packedSha256:sha(Buffer.from(packed.buffer)),atlasSha256:sha(pixels),woodlandAndRavinePanelsPreserved:true,actualDevicePerformance:'NOT_YET_MEASURED',visualAcceptance:'PENDING'};
const manifest={...prior,rootCount:count,rawBytes:raw.length,compressedBytes:compressed.length,rawSha256:sha(raw),compressedSha256:sha(compressed),packedSha256:measurement.packedSha256,atlasSha256:measurement.atlasSha256,tiles:ordered.map(t=>({id:t.id,minX:t.minX,minZ:t.minZ,count:t.records.length})),receipt:{...prior.receipt,contactCount:count,tileCount:ordered.length,grassContinuity:{...prior.receipt.grassContinuity,totalContacts:count,addedContacts:prior.receipt.grassContinuity.addedContacts+added.length-removed.length,packedBytes:packed.byteLength},hillsideShoreline:measurement},habitat:{...prior.habitat,receipt:{...prior.habitat.receipt,hillsideShoreline:measurement}}};
const json=JSON.stringify(manifest)+'\n';
if(process.argv.includes('--verify')){assert.deepEqual(fs.readFileSync(new URL(asset+'bin.gz',root)),compressed);assert.equal(fs.readFileSync(new URL(asset+'json',root),'utf8'),json);console.log('DETERMINISTIC_HILLSIDE_RECOMPILE_PASS');}else{
 fs.writeFileSync(new URL(asset+'bin.gz',root),compressed);fs.writeFileSync(new URL(asset+'json',root),json);
 for(const [name,data]of [['added',Buffer.concat(added)],['removed',Buffer.concat(removed)]])fs.writeFileSync(new URL('./'+name+'.bin.gz',import.meta.url),gzipSync(data,{level:9}));
 fs.writeFileSync(new URL('./coverage.json',import.meta.url),JSON.stringify(coverage));fs.writeFileSync(new URL('./checkpoint.json',import.meta.url),JSON.stringify(measurement,null,2)+'\n');
 const p=new URL('showroom/globe/h-earth/render/precomputed-grass.v1.js',root),s=fs.readFileSync(p,'utf8').replace(/const MANIFEST_SHA256='[^']*';/,`const MANIFEST_SHA256='${sha(json)}';`).replaceAll('!==1457471','!=='+count);fs.writeFileSync(p,s);
 console.log(JSON.stringify(measurement));
}
