import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {createHash,webcrypto} from 'node:crypto';
import {createOasisBankField,assertOasisBankBudget,OASIS_BANK_ALLOCATION,oasisBankTiles} from '../../../showroom/globe/h-earth/render/oasis-bank-field.v1.js';
import {GRASS_CONTINUITY_ALLOCATION} from '../../../showroom/globe/h-earth/render/grass-continuity-supplement.v1.js';
import {integrated,visibleSurface,geology,terrain,placement,materials} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {buildLargeP2BoulderPresentation} from '../../../showroom/globe/h-earth/render/large-p2-boulder-presentation.v1.js';
import {buildHEarthOasisConnectedBasinIndex,H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis} from '../../../showroom/globe/h-earth/render/grass-lowland-trial.js';
import {createUniformGroundAdmission} from '../../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js';
import {loadPrecomputedGrass,takePrecomputedGrassPlan} from '../../../showroom/globe/h-earth/render/precomputed-grass.v1.js';
import {loadPrecomputedOasisSoil} from '../../../showroom/globe/h-earth/render/precomputed-oasis-soil.v1.js';
const root=new URL('../../../',import.meta.url),base='2f3d00175eaf6edae6d59cf0a5f5fa4e36f9e088',asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',sha=b=>createHash('sha256').update(b).digest('hex');
const git=p=>execFileSync('git',['show',base+':'+p],{cwd:root,maxBuffer:180*1024*1024});
const read=p=>fs.readFileSync(new URL(p,root));
const manifest=JSON.parse(read(asset+'json')),raw=gunzipSync(read(asset+'bin.gz')),prior=JSON.parse(git(asset+'json')),before=gunzipSync(git(asset+'bin.gz'));
const points=JSON.parse(fs.readFileSync(new URL('./addition-witnesses.json',import.meta.url)));
const field=createOasisBankField(buildHEarthOasisConnectedBasinIndex(integrated).wetCells);
const admit=await createUniformGroundAdmission({visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,obstacles:integrated.landscapeCoverFootprints,trees:integrated.landscapeFloorFootprints,oasis,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,maximumSandCoverage:.12,oasisReservedAt:(x,z)=>field(x,z)<=0});
test('all prior roots, original tile prefixes and complete habitat atlas preserved byte for byte',()=>{
 let oldOffset=0,newOffset=0;const priorTiles=new Map(prior.tiles.map(t=>[t.id,t]));
 for(const t of manifest.tiles){const old=priorTiles.get(t.id);if(old){assert.equal(t.baselineCount,old.baselineCount);assert.deepEqual(raw.subarray(newOffset,newOffset+old.count*52),before.subarray(oldOffset,oldOffset+old.count*52));oldOffset+=old.count*52;}else assert.equal(t.baselineCount,0);newOffset+=t.count*52;assert(t.count<=1600);}
 assert.equal(oldOffset,prior.rootCount*52);assert.deepEqual(raw.subarray(newOffset),before.subarray(oldOffset));assert.equal(sha(raw),manifest.rawSha256);assert.equal(manifest.rootCount,prior.rootCount);assert.deepEqual(raw,before);const tiles=oasisBankTiles(prior.rootCount);assert.equal(tiles.reduce((n,t)=>n+t.count,0),points.length);let offset=prior.rootCount;for(const t of tiles){assert.equal(t.first,offset);assert.equal(t.baselineCount,0);offset+=t.count;}const actual=new Set(tiles.flatMap(t=>Array.from({length:t.count},(_,i)=>Array.from(t.packed.subarray(i*4,i*4+4)).join(':'))));for(const p of points)assert(actual.has([p.x,p.y,p.z,Math.fround(p.rank*Math.PI*2)].join(':')));
});
test('every new blade is dry, grounded, within connected bank and outside protected footprints',()=>{
 assert(points.length>100);const seen=new Set();
 for(const p of points){const s=visibleSurface.sample(p.x,p.z);assert(s&&s.slope<=.55);assert.equal(Math.fround(s.y),p.y);assert.equal(s.triangleId,p.triangleId);const local=terrain.unprojectPlanetVertex(p.x,p.y,p.z);assert(field(local.x,local.z)>0);assert(admit(p.x,p.z,s));const key=`${p.x}:${p.z}`;assert(!seen.has(key));seen.add(key);const m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(local.x,local.z);assert(m.valid&&m.soilDepth>=(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?.035:.20));}
 assert.equal(field(-100,-160),0);assert.equal(field(0,-204),0);assert.throws(()=>createOasisBankField([]));assert.throws(()=>field(NaN,0));
});
test('both allocations fail closed independently, including runtime entrance roots',()=>{
 assertOasisBankBudget(prior.rootCount+54218,points.length,GRASS_CONTINUITY_ALLOCATION);
 assert.throws(()=>assertOasisBankBudget(GRASS_CONTINUITY_ALLOCATION.maximumRoots+1,0,GRASS_CONTINUITY_ALLOCATION));
 assert.throws(()=>assertOasisBankBudget(0,OASIS_BANK_ALLOCATION.maximumRoots+1,GRASS_CONTINUITY_ALLOCATION));assert.throws(()=>assertOasisBankBudget(0,-1,GRASS_CONTINUITY_ALLOCATION));
 assert(points.length*4<=23696);assert(points.length*16<=65536);
});
test('authenticated global loader and bank payload preserve custody',async()=>{
 globalThis.crypto??=webcrypto;const fetchImpl=async url=>new Response(read('showroom/globe/h-earth/render/assets/'+new URL(url).pathname.split('/').pop()));
 const presentation=await loadPrecomputedGrass({packed:true,fetchImpl}),plan=takePrecomputedGrassPlan(presentation);
 assert.equal(oasisBankTiles().reduce((n,t)=>n+t.count,0),points.length);assert.equal(plan.tiles.reduce((n,t)=>n+t.count,0),manifest.rootCount);assert.equal(takePrecomputedGrassPlan(presentation),undefined);
 await assert.rejects(loadPrecomputedGrass({packed:true,fetchImpl:async()=>new Response('{}')}),/MANIFEST_INTEGRITY/);
 const mask=await loadPrecomputedOasisSoil(integrated,{fetchImpl});assert.equal(mask.supplementalRootCount,points.length);assert.equal(mask.grassTuftCount,350);
});
test('fourteen rocks retain submerged bases and identities while exposed form and neutral colors change',async()=>{
 const path='showroom/globe/h-earth/render/large-p2-boulder-presentation.v1.js';
 const source=git(path).toString().replace(/from '([^']+)'/g,(_,p)=>`from '${new URL(p,new URL(path,root)).href}'`);
 const old=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).buildLargeP2BoulderPresentation(integrated),next=buildLargeP2BoulderPresentation(integrated);
 assert.equal(next.records.length,14);assert.equal(next.positions.length,old.positions.length);assert.deepEqual(next.indices,old.indices);assert.deepEqual(next.suppressedTriangleOffsets,old.suppressedTriangleOffsets);assert.deepEqual(next.protectedSmallTriangleOffsets,old.protectedSmallTriangleOffsets);
 for(let i=0;i<14;i++){const a=old.records[i],b=next.records[i];assert.deepEqual(b.presentationCenter,a.presentationCenter);assert.deepEqual(b.terrainContactWitnesses,a.terrainContactWitnesses);const offset=b.vertexStart*3;assert.deepEqual(next.positions.subarray(offset,offset+72),old.positions.subarray(offset,offset+72));assert.notDeepEqual(next.positions.subarray(offset+72,offset+180),old.positions.subarray(offset+72,offset+180));}
 assert([...next.normals].every(Number.isFinite));assert.notDeepEqual(next.baseColorsLinear,old.baseColorsLinear);
 for(let i=0;i<next.baseColorsLinear.length;i+=4){const c=[...next.baseColorsLinear.subarray(i,i+3)];assert(Math.max(...c)-Math.min(...c)<.10);}
});
test('active owner uploads global, bank and entrance contacts exactly once within named budgets',async()=>{
 const {createSingleOwnerVegetation}=await import('../../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js');
 const {CAVERN_PALM_PLACEMENTS}=await import('../../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js');
 let allocated=0,uploaded=0,nextOffset=0,objects=0;
 const gl=new Proxy({NO_ERROR:0,ARRAY_BUFFER:1,STATIC_DRAW:2,FLOAT:3,TRIANGLES:4,VERTEX_SHADER:5,FRAGMENT_SHADER:6,COMPILE_STATUS:7,LINK_STATUS:8,BUFFER_SIZE:9,
 createShader:()=>({}),createProgram:()=>({}),createVertexArray:()=>({}),createBuffer:()=>{objects++;return {};},getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:()=>({}),isContextLost:()=>false,getError:()=>0,
 bufferData:(_target,size)=>{allocated=size;},getBufferParameter:()=>allocated,
 bufferSubData:(_target,offset,data)=>{assert.equal(offset,nextOffset);uploaded+=data.byteLength;nextOffset+=data.byteLength;}
 },{get:(target,key)=>key in target?target[key]:(()=>{})});
 const fetchImpl=async url=>new Response(read('showroom/globe/h-earth/render/assets/'+new URL(url).pathname.split('/').pop()));
 const presentation=await loadPrecomputedGrass({packed:true,fetchImpl});
 const owner=await createSingleOwnerVegetation(gl,presentation,{planetRadius:420000,environment:{sunDirection:{x:0,y:1,z:0},sunColor:[1,1,1],groundHazeColor:[.5,.6,.7],sunIntensity:1,fogStartDistance:100,fogFalloff:.001,maximumFogFactor:.6},entranceGrass:{visibleSurface,geology,palms:CAVERN_PALM_PLACEMENTS}});
 const receipt=owner.getReceipt();assert.equal(receipt.originalRootCount,prior.rootCount);assert.equal(receipt.oasisRoots,points.length);assert.equal(receipt.installedRootCount,prior.rootCount+54218+points.length);assert.equal(allocated,receipt.installedRootCount*16);assert.equal(uploaded,allocated);assert.equal(objects,1);assert(allocated<=receipt.maximumPackedBytes);assert.equal(receipt.globalMaximumPackedBytes,GRASS_CONTINUITY_ALLOCATION.maximumPackedBytes);owner.dispose();
});
