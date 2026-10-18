import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash,webcrypto} from 'node:crypto';
const sourceDir=process.env.H_EARTH_PLANTING_SOURCE_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../showroom/globe/h-earth/render');
const read=name=>fs.readFileSync(path.join(sourceDir,name),'utf8');
const src=read('live-render-package.run8e-r2.js'),canon=read('live-render-package.run8e-r2.canonical.js'),grass=read('woodland-fine-grass.v1.js');
const packet=read('verified-planting-packet.v1.js');
const trees=JSON.parse(packet.match(/H_EARTH_VERIFIED_PLANTING_TREES = Object.freeze\((\[.*\])\.map\(Object.freeze\)\)/)[1]);
const identity=JSON.parse(packet.match(/H_EARTH_VERIFIED_PLANTING_PACKET = Object.freeze\((\{.*\})\);/)[1]);
const world=fs.readFileSync(process.env.H_EARTH_EXACT_WORLD_BINARY||path.join(sourceDir,'assets/h-earth-canonical-base-world.v1.json.gz'));
assert.equal(createHash('sha256').update(world).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const value=JSON.parse(gunzipSync(world)),base=value.raw;
for(const pkg of [value.raw,value.canonical]){Object.values(pkg.buffers).forEach(Object.freeze);Object.freeze(pkg.buffers);Object.freeze(pkg.primitiveSpans);Object.freeze(pkg.drawRanges);}
// Execute exact adapter/evaluator bodies without regenerating the world or census.
const prelude=src.slice(src.indexOf('function createHashWriter()'),src.indexOf('export function buildHEarthRun8ER2ImmutableLiveRenderPackage'));
const evaluate=src.slice(src.indexOf('function* evaluatePackageChecks('),src.indexOf('export async function adoptHEarthRun8ER2DeferredLiveRenderPackage')).replaceAll('export ','');
const adapter=src.slice(src.indexOf('export function applyHEarthVerifiedPlantingPackage('),src.indexOf('let cachedDeferredPackage = null;')).replaceAll('export ','');
const context={H_EARTH_VERIFIED_PLANTING_TREES:trees,H_EARTH_VERIFIED_PLANTING_PACKET:identity,H_EARTH_RUN_8E_R2_CONTRACT_ID:base.contractId,H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID:base.sourceAuthorities.packet002TransferContractId,H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID:base.sourceAuthorities.run8CMaterialContractId,H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID:base.sourceAuthorities.atmosphereContractId,H_EARTH_RUN_8E_R2_HISTORICAL_OCCURRENCE_ID:'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_OCCURRENCE_001',finite:Number.isFinite,freezeArray:x=>Object.freeze(Array.from(x)),freezeRecord:Object.freeze};
const apply=Function(...Object.keys(context),prelude+evaluate+adapter+'\nreturn applyHEarthVerifiedPlantingPackage;')(...Object.values(context));
const integrated=apply(base),canonical=apply(base,{canonicalBase:value.canonical});

test('adapter adds exact saved four tree IDs/spans and preserves original buffers',()=>{
 assert.equal(integrated.landscapeFloorFootprints.length,8);
 assert.deepEqual(integrated.landscapeFloorFootprints.slice(0,4),base.landscapeFloorFootprints);
 assert.equal(integrated.primitiveCount,base.primitiveCount+8);
 assert.equal(integrated.primitiveSpans.filter(s=>s.primitiveId.startsWith('H_EARTH_LANDSCAPE_P2_')||s.plantingTreeId).reduce((n,s)=>n+s.triangleCount,0),79052);
 assert(identity.counts.total<=600000&&identity.counts.ravine<=150000&&identity.counts.total*16<=9600000);
 for(const [name,old] of Object.entries(base.buffers))assert.deepEqual(integrated.buffers[name].slice(0,old.length),old,name);
 for(const tree of trees){
  const spans=integrated.primitiveSpans.filter(s=>s.plantingTreeId===tree.id);assert.equal(spans.length,2);assert(spans.every(s=>s.templateTreeId===tree.templateId));
  const floor=integrated.landscapeFloorFootprints.find(t=>t.id===tree.id),cover=integrated.landscapeCoverFootprints.find(t=>t.id===tree.id);
  assert.equal(floor.x,tree.x);assert.equal(floor.z,tree.z);assert.equal(floor.grassExclusionRadius,2.108);assert.equal(cover.radius+.10,2.108);
 }
 assert.equal(apply(integrated),integrated,'adapter must be idempotent');
 console.log(JSON.stringify({check:'TREE_ADAPTER',trees:8,addedSpans:8,addedTriangles:integrated.triangleCount-base.triangleCount}));
});
test('generated canonicalization and precomputed adapter agree on all numeric buffers',()=>{
 const float=new Set(['positions','normals','baseColorsLinear','materialParameters']);
 for(const [name,values] of Object.entries(integrated.buffers)){
  const expected=float.has(name)?values.map(v=>{const n=Math.round(v*16777216)/16777216;return Object.is(n,-0)?0:n;}):values;
  assert.deepEqual(canonical.buffers[name],expected,name);
  assert.deepEqual(canonical.buffers[name].slice(0,value.canonical.buffers[name].length),value.canonical.buffers[name],name+' preserved prefix');
 }
 assert.equal(canonical.revision,2);
});
test('actual hydration body invokes the same adapter and keeps packet verification',async()=>{
 let body=canon.slice(canon.indexOf('async function hydratePrecomputedBaseWorld()'),canon.indexOf('// GEN2666_HYDRATION_END')).replaceAll('import.meta.url',JSON.stringify('file:///fixture/live-render-package.run8e-r2.canonical.js'));
 const hydrate=Function('applyHEarthVerifiedPlantingPackage','fetch','crypto',body+';return hydratePrecomputedBaseWorld;')(apply,async()=>new Response(world),webcrypto);
 const hydrated=await hydrate();assert.equal(hydrated.raw.contentDigest,integrated.contentDigest);assert.equal(hydrated.canonical.contentDigest,canonical.contentDigest);
 assert(src.includes('return applyHEarthVerifiedPlantingPackage(packageRecord);'),'generated path must use adapter');
});
test('selected-cell atlas keeps woodland texels and shared explicit clearances',()=>{
 const cells=read('verified-planting-cells.v1.js').replaceAll('export ','');
 const fn=grass.slice(grass.indexOf('export function applyVerifiedPlantingHabitat('),grass.indexOf('/** Presentation-only woodland grass.')).replaceAll('export ','');
 const atlas=Function(cells+fn+';return applyVerifiedPlantingHabitat;')();
 const size=192,pixels=new Uint8Array(size*size*2);for(let i=0;i<pixels.length;i++)pixels[i]=i%251;
 const field={size,width:size*2,height:size,pixels,woodland:{sample:()=>0},ravine:{},receipt:{ravine:{}}},next=atlas(field);
 for(let z=0;z<size;z++)assert.deepEqual(next.pixels.slice(z*size*2,z*size*2+size),pixels.slice(z*size*2,z*size*2+size));
 assert.equal(next.receipt.verifiedPlantingCells,12577);assert.deepEqual(next.ravine.bounds,[-290,-562,79,-242]);
 assert(grass.includes('planWoodlandHabitatCandidates(habitat.woodland??habitat)'));assert(grass.includes('saved=await decodeVerifiedPlantingRoots()'));
 assert(grass.includes('VERIFIED_PLANTING_ROOT_REJECTED'));assert(grass.includes('VERIFIED_PLANTING_TERRAIN_CONTACT_CHANGED'));assert(grass.includes('VERIFIED_PLANTING_POPULATION_MISMATCH'));
 assert(grass.includes('t.grassExclusionRadius??t.radius+.03'));
 const renderer=read('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');assert(renderer.includes('t.grassExclusionRadius??t.radius+1.5'));assert(renderer.includes('applyVerifiedPlantingHabitat(await buildWoodlandHabitatField('));
});

// Opt-in exact CPU runtime qualification. This uses actual production builders and
// an instrumented GL API; it does not claim shader/raster/device acceptance.
test('integrated actual terrain, packet identities, owner submission and continuous bark clearance', {skip:process.env.H_EARTH_PLANTING_FULL_QUALIFICATION!=='1'},async()=>{
const root=new URL('../../../../',new URL('file://'+sourceDir+'/')),render=new URL('showroom/globe/h-earth/render/',root);
const mod=rel=>import(new URL(rel,root));
console.log('STAGE adapters-ready');
const bridge=await mod('showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js');
const geology=bridge.constructGeologicalRuntimeBridge(canonical);
console.log('STAGE geology-ready');
const terrain=await mod('h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs');
const placement=await mod('h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js');
const materials=await mod('h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js');
const woodland=await import(new URL('woodland-fine-grass.v1.js',render));
const habitatModule=await import(new URL('woodland-habitat-field.v1.js',render));
const oasis=await import(new URL('grass-lowland-trial.js',render));
const pilot=await import(new URL('landscape-planting-pilot.v1.js',render));
const owner=await import(new URL('vegetation-single-owner.prototype.v1.js',render));
const fixtureSource=fs.readFileSync(new URL('h-earth-3d/validation/h-earth.planting-pilot.v1.test.mjs',root),'utf8');
const start=fixtureSource.indexOf('async function buildCanonicalBeachFixture('),end=fixtureSource.indexOf("\n\n\ntest(",start);
const {readFile}=await import('node:fs/promises');
const fixture=Function('assert','readFile',fixtureSource.slice(start,end)+';return buildCanonicalBeachFixture;')(assert,readFile);
const {visibleSurface}=await fixture({baseDirectory:root.pathname,pkg:integrated,geology,uploadSource:read('gpu-upload-views.run8e-r2d.js'),protectedReferenceAt:()=>false});
console.log('STAGE surface-ready');
const admitGround=await pilot.createUniformGroundAdmission({visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,obstacles:integrated.landscapeCoverFootprints,trees:integrated.landscapeFloorFootprints,oasis:oasis.H_EARTH_OASIS_FOLIAGE_SAMPLE,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,maximumSandCoverage:.12});
const renderer=read('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');
const replacement=renderer.slice(renderer.indexOf('  function prepareReplacementVegetation'));
const fieldCode=replacement.slice(replacement.indexOf('      const habitat=applyVerifiedPlantingHabitat'),replacement.indexOf('      const presentation=await buildWoodlandFineGrass'));
assert(fieldCode.length>0);
const ctx={...habitatModule,applyVerifiedPlantingHabitat:woodland.applyVerifiedPlantingHabitat,yieldToBrowserPaint:async()=>{},visibleSurface,admitGround,unprojectPlanetVertex:terrain.unprojectPlanetVertex,pilotMaterialAt:materials.sampleHEarthRun8CSuccessorSurfaceMaterial,woodlandGrassClear:woodland.woodlandGrassClear,pilotPackage:integrated,resources:{geologicalRuntime:geology}};
const field=await Function(...Object.keys(ctx),`return(async()=>{${fieldCode};return habitat;})()`)(...Object.values(ctx));
console.log('STAGE field-ready');


const presentation=await woodland.buildWoodlandFineGrass(integrated,{visibleSurface,admitGround,habitat:field});
const sha=v=>createHash('sha256').update(typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v)).digest('hex');
const p=presentation,all=p.tiles.flatMap(t=>t.roots),tiles=owner.planImmutableTiles(p);
const wood=all.filter(r=>r.region!=='RAVINE'),woodlandIdentity=sha([...wood].sort((a,b)=>a.x-b.x||a.z-b.z).map(({x,y,z,angle,seed})=>({x,y,z,angle,seed})));
assert.equal(woodlandIdentity,'e40321b7e6d05793f66431f38c669055a563c3229970aa6ecda3d838c3d298a5');
const packed=Buffer.concat(tiles.map(t=>Buffer.from(t.packed.buffer))),metadata=Buffer.alloc(all.length*8);let at=0;for(const r of all){metadata.writeUInt32LE(r.seed>>>0,at);metadata.writeUInt32LE(r.region==='RAVINE'?1:0,at+4);at+=8;}
assert.equal(sha(packed),'d90752a5e4d9c4f1f3e0bcc56edac6bc53cff09e07f1c70c0b1f12f9fff06dde');assert.equal(sha(metadata),'fbdd8604fb367bfce0528edfa01f13d5b797ad9d6a0804e7dfbc57806ac09417');

let allocated=0,uploaded=0,uploads=0,drawn=0;const spans=[];
const gl=new Proxy({COMPILE_STATUS:1,LINK_STATUS:2,createShader:()=>({}),createProgram:()=>({}),createVertexArray:()=>({}),createBuffer:()=>({}),getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:(_p,n)=>n,bufferData:(_t,n)=>{allocated+=n;},bufferSubData:(_t,offset,data)=>{assert.equal(offset,uploaded);uploaded+=data.byteLength;uploads++;},drawArraysInstanced:(_t,_f,_v,n)=>{drawn+=n;spans.push(n);}}, {get:(o,k)=>k in o?o[k]:(()=>{})});
const environment={sunDirection:{x:0,y:1,z:0},sunColor:[1,1,1],groundHazeColor:[.5,.6,.7],sunIntensity:1,fogStartDistance:100,fogFalloff:.001,maximumFogFactor:.6};
const gpuOwner=await owner.createSingleOwnerVegetation(gl,p,{environment,planetRadius:420000});
const packet=(x,z)=>({camera:{position:{x,y:10,z},viewProjectionMatrix:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}});
const before=uploaded,a=gpuOwner.draw(packet(55,-307)),b=gpuOwner.draw(packet(-141,-226)),again=gpuOwner.draw(packet(55,-307));assert.deepEqual(a,again);assert.equal(uploaded,before);assert.equal(allocated,8402272);assert.equal(uploaded,allocated);
const receipt=gpuOwner.getReceipt();assert.equal(receipt.installedRootCount,525142);assert.equal(receipt.rootOwnerCount,1);assert.equal(receipt.perFrameUploadBytes,0);gpuOwner.dispose();
const checks=[];
for(let i=0;i<8;i++){
 const t=integrated.landscapeFloorFootprints[i],span=i<4?integrated.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_LANDSCAPE_P2_BARK'):integrated.primitiveSpans.find(s=>s.plantingTreeId===t.id&&s.primitiveId.endsWith('_BARK'));
 const v0=span.vertexStart+(i<4?i*608:0),p=integrated.buffers.positions;
 let radial=0;const basal=[];
 for(let j=0;j<608;j++){const k=(v0+j)*3,x=Math.fround(p[k]),y=Math.fround(p[k+1]),z=Math.fround(p[k+2]);radial=Math.max(radial,Math.hypot(x-t.x,z-t.z));if(j<6){const ground=visibleSurface.sample(x,z);basal.push({x,y,z,burial:ground?ground.y-y:null});}}
 checks.push({id:t.id,center:visibleSurface.sample(t.x,t.z),maximumBarkRadius:radial,minimumBasalVertexBurial:Math.min(...basal.map(p=>p.burial??-Infinity)),basal});
}

assert(checks.every(t=>t.minimumBasalVertexBurial>=.11999));
assert(checks.every(t=>t.maximumBarkRadius+.071<5),'all bark lies inside clearance neighborhood');

const roots=all,clearances=[];
const clipped=(points,ceiling)=>{const out=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],ain=a[1]<=ceiling,bin=b[1]<=ceiling;if(ain)out.push(a);if(ain!==bin){const q=(ceiling-a[1])/(b[1]-a[1]);out.push(a.map((v,k)=>v+(b[k]-v)*q));}}return out;};
for(let i=0;i<8;i++){
 const t=integrated.landscapeFloorFootprints[i],span=i<4?integrated.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_LANDSCAPE_P2_BARK'):integrated.primitiveSpans.find(s=>s.plantingTreeId===t.id&&s.primitiveId.endsWith('_BARK'));
 const nearby=roots.filter(r=>Math.hypot(r.x-t.x,r.z-t.z)<5),ceiling=nearby.length?Math.max(...nearby.map(r=>r.y))+.213:visibleSurface.sample(t.x,t.z).y+.213;
 let radius=0;const start=span.indexStart+(i<4?i*3048:0);
 for(let j=start;j<start+3048;j+=3){const triangle=[0,1,2].map(k=>{const at=integrated.buffers.indices[j+k]*3;return integrated.buffers.positions.slice(at,at+3).map(Math.fround);});for(const v of clipped(triangle,ceiling))radius=Math.max(radius,Math.hypot(v[0]-t.x,v[2]-t.z));}
 const nearest=Math.min(...nearby.map(r=>Math.hypot(r.x-t.x,r.z-t.z))),gap=nearest-radius-.071;
 clearances.push({id:t.id,nearbyRoots:nearby.length,grassVerticalCeiling:ceiling,continuousBarkRadialEnvelope:radius,nearestRoot:nearest,grassHorizontalEnvelope:.071,continuousSeparationLowerBound:gap,pass:gap>0});
 assert(gap>0,'continuous bark/grass envelope '+t.id);
}
console.log('INTEGRATED_CPU_PACKET',JSON.stringify({woodland:wood.length,total:all.length,woodlandIdentity,rootDataSha256:sha(packed),seedRegionSha256:sha(metadata),packedBytes:packed.length,tileCount:tiles.length,maxTile:Math.max(...tiles.map(t=>t.count)),minimumBarkGrassSeparation:Math.min(...clearances.map(t=>t.continuousSeparationLowerBound)),cpuSubmissionOnly:true}));

});

test('complete preparation module executes both startup branches; inherited albedo drift is explicit', {skip:process.env.H_EARTH_PLANTING_FULL_QUALIFICATION!=='1'},async()=>{
 const {Worker}=await import('node:worker_threads');
 const results=[];
 const workerSource="import {parentPort,workerData} from 'node:worker_threads';import fs from 'node:fs';import assert from 'node:assert/strict';\nconst phases=[];globalThis.postMessage=data=>{phases.push(data.phase??'ERROR');if(data.error)throw Error(data.error.message);if(data.phase==='CANONICAL_PACKAGE_COMPLETE'){assert.equal(data.raw.landscapeFloorFootprints.length,8);assert.equal(data.canonical.landscapeFloorFootprints.length,8);assert.equal(data.raw.verifiedPlanting.addedTreeIds.length,4);parentPort.postMessage({raw:data.raw,canonical:data.canonical,mode:workerData.mode,rawDigest:data.raw.contentDigest,canonicalDigest:data.canonical.contentDigest,rawIdentity:data.raw.packageIdentity,canonicalIdentity:data.canonical.packageIdentity,rawVertices:data.raw.vertexCount,rawTriangles:data.raw.triangleCount,phases,timing:data.timing});}};\nglobalThis.fetch=async()=>{if(workerData.mode==='generated')throw Error('QUALIFICATION_FORCED_PRECOMPUTED_UNAVAILABLE');return new Response(fs.readFileSync(workerData.world));};\nawait import(workerData.moduleUrl);\nawait globalThis.onmessage();\n";
 for(const mode of ['precomputed','generated'])results.push(await new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64')),{workerData:{mode,world:process.env.H_EARTH_EXACT_WORLD_BINARY||path.join(sourceDir,'assets/h-earth-canonical-base-world.v1.json.gz'),moduleUrl:new URL('file://'+path.join(sourceDir,'live-render-package.run8e-r2.canonical.js')).href+'?hearthCanonicalPreparation=1&hearthCanonicalTiming=1'},resourceLimits:{maxOldGenerationSizeMb:2048}});
  worker.on('message',resolve);worker.on('error',reject);worker.on('exit',code=>{if(code)reject(Error('WORKER_EXIT_'+code));});
 }));
 const differences=[];
 for(const type of ['raw','canonical'])for(const [name,a] of Object.entries(results[0][type].buffers)){
  const b=results[1][type].buffers[name],prefix=value[type].buffers[name].length;assert.equal(a.length,b.length);
  let old=0,added=0,maximum=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i]){if(i<prefix)old++;else added++;maximum=Math.max(maximum,Math.abs(a[i]-b[i]));}
  if(old||added){assert.equal(name,'baseColorsLinear','startup geometry/material parity');if(type==='canonical')assert.equal(added,0,'added canonical tree colors');differences.push({type,name,old,added,maximum});}
 }
 console.log('COMPLETE_NODE_STARTUP',JSON.stringify({results:results.map(({raw,canonical,...summary})=>summary),differences,fullByteParity:differences.length===0,scope:'Production module in Node workers; browser main adoption/WebGL/device acceptance unproven',classification:differences.length?'INHERITED_BASE_ALBEDO_DIVERGENCE_RECORDED_NOT_REPAIRED':'EXACT_PARITY'}));
});
