import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const load=async path=>import('data:text/javascript;base64,'+Buffer.from(await readFile(new URL(path,import.meta.url),'utf8')).toString('base64'));
const {buildPlantingPilotLayout,PLANTING_PILOT}=await load('../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js');
const {createPlantingPilotRenderer}=await load('../../showroom/globe/h-earth/render/planting-pilot-renderer.v1.js');
const box=(minX,maxX,minZ,maxZ)=>({minX,maxX,minZ,maxZ});
const inBox=(x,z,b)=>x>=b.minX&&x<=b.maxX&&z>=b.minZ&&z<=b.maxZ;
const groundY=(x,z)=>10+.01*x+.005*z;
// A planar indexed surface; triangle IDs derive from the diagonal, independent of traversal.
const ground={positions:new Float32Array([-105,groundY(-105,-345),-345,-25,groundY(-25,-345),-345,-25,groundY(-25,-275),-275,-105,groundY(-105,-275),-275]),indices:new Uint16Array([0,1,2,0,2,3])};
function sampleGround(x,z){
 const p=ground.positions,i=ground.indices;
 for(let t=0;t<i.length;t+=3){const a=i[t]*3,b=i[t+1]*3,c=i[t+2]*3;const den=(p[b+2]-p[c+2])*(p[a]-p[c])+(p[c]-p[b])*(p[a+2]-p[c+2]);const u=((p[b+2]-p[c+2])*(x-p[c])+(p[c]-p[b])*(z-p[c+2]))/den,v=((p[c+2]-p[a+2])*(x-p[c])+(p[a]-p[c])*(z-p[c+2]))/den;if(u>=-1e-8&&v>=-1e-8&&u+v<=1+1e-8)return {y:u*p[a+1]+v*p[b+1]+(1-u-v)*p[c+1],slope:.02,owner:'CANONICAL_VISIBLE_TERRAIN',triangleId:t/3};}
 return null;
}
const riverPositions=new Float32Array([-85,9,-345,-75,9,-345,-65,9,-275,-95,9,-275]);
const hidden=box(-48,-38,-320,-308),rendered=box(-102,-97,-330,-318),structure=box(-60,-52,-300,-290);
const estate={manorCore:box(-102,-96,-306,-298),gardens:box(500,510,500,510),outbuildingProposal:box(520,530,520,530),acceptedEnvelope:box(540,550,540,550),footRoute:[{x:-32,z:-340},{x:-32,z:-280}],footRouteRadius:1.5};
const obstacles=[{x:-55,z:-330,radius:3}],trees=[{x:-56,z:-310,trunkRadius:1.5}],oasis=box(-104,-98,-290,-280);
const vertices=[[-85,-345],[-75,-345],[-65,-275],[-95,-275]];
function segmentDistance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);}
const bankDistance=(x,z)=>Math.min(...vertices.map((a,i)=>segmentDistance(x,z,a,vertices[(i+1)%4])));
function config(reverse=false){return {visibleSurface:{ground:{sample:sampleGround},water:{sample:(x,z)=>inBox(x,z,rendered)?{y:20}:null}},geology:{meshes:[{role:'FRESHWATER_RIVER',mesh:{positions:riverPositions,indices:new Uint16Array(reverse?[0,2,3,0,1,2]:[0,1,2,0,2,3])}}],sampleWaterAt:(x,z)=>{const half=5+(z+345)/7;return inBox(x,z,hidden)||Math.abs(x+80)<=half?{y:20}:null;}},sampleMaterial:(x)=>({valid:true,surfaceClass:x<-100?'STONE_AND_SPARSE_SOIL':'LOWLAND_SOIL',soilDepth:.3}),toLocal:(x,y,z)=>({x,y,z}),estate,obstacles,trees,oasis,sampleStructure:(x,z)=>inBox(x,z,structure)?{hardExclusions:['building']}:null};}
let layout;
test('deterministic indexed support, reverse traversal and A-B-A camera independence',async()=>{
 const a=await buildPlantingPilotLayout({...config(),camera:{x:0,z:0}}),b=await buildPlantingPilotLayout({...config(true),camera:{x:999,z:999}}),again=await buildPlantingPilotLayout({...config(),camera:{x:0,z:0}});layout=a;
 assert.deepEqual(a.records,b.records);assert.deepEqual(a.roots,b.roots);assert.deepEqual(a.records,again.records);assert.equal(a.receipt.layoutDigest,b.receipt.layoutDigest);assert.ok(a.roots.length>500);assert.ok(a.roots.length<=PLANTING_PILOT.maximumRoots);assert.equal(a.receipt.recordBytes,a.roots.length*32);assert.equal(a.receipt.waterBoundaryEdges,4);
});
test('every root contacts an indexed triangle and respects water, variable banks and protected land',async()=>{
 layout??=await buildPlantingPilotLayout(config());const families=new Set();
 for(const r of layout.roots){assert.equal(r.y,Math.fround(sampleGround(r.x,r.z).y));assert.equal(r.support.triangleId,sampleGround(r.x,r.z).triangleId);assert.ok(!inBox(r.x,r.z,hidden));assert.ok(!inBox(r.x,r.z,rendered));assert.ok(!config().geology.sampleWaterAt(r.x,r.z));assert.ok(!inBox(r.x,r.z,structure));assert.ok(!inBox(r.x,r.z,estate.manorCore));assert.ok(!inBox(r.x,r.z,oasis));assert.ok(segmentDistance(r.x,r.z,[-32,-340],[-32,-280])>1.6);assert.ok(Math.hypot(r.x+55,r.z+330)>=3.1);assert.ok(Math.hypot(r.x+56,r.z+310)>=1.65);assert.ok(bankDistance(r.x,r.z)>2);if(r.bankDistance!==null)assert.ok(Math.abs(r.bankDistance-bankDistance(r.x,r.z))<1e-8);if(r.family==='PLANTED_BANK')assert.ok(bankDistance(r.x,r.z)<=8);families.add(r.family);assert.ok(r.height>0&&r.height<=.401);}
 assert.equal(families.size,4);assert.ok(layout.receipt.rejections.FUTURE_WATER>0);assert.ok(layout.receipt.rejections.RENDERED_WATER>0);assert.ok(layout.receipt.rejections.STRUCTURE>0);assert.ok(layout.receipt.rejections.PROTECTED_FOOTPRINT>0);
});
test('invalid boundaries and missing support fail closed or reject roots',async()=>{
 await assert.rejects(buildPlantingPilotLayout({}),/CALLBACK_REQUIRED/);const c=config();c.geology.meshes=[];await assert.rejects(buildPlantingPilotLayout(c),/BOUNDARY_MISSING/);const d=config();d.visibleSurface.ground.sample=()=>null;assert.equal((await buildPlantingPilotLayout(d)).roots.length,0);const e=config();e.geology.meshes[0].mesh.indices=new Uint16Array([0,1,99]);await assert.rejects(buildPlantingPilotLayout(e),/WATER_INDEX_INVALID/);
});
test('unsupported owners, steep slopes and shallow soil admit no planting',async()=>{
 for(const [support,material,reason] of [
  [{y:10,slope:0,owner:'CAVERN_PHYSICAL_SHELL'},{valid:true,surfaceClass:'LOWLAND_SOIL',soilDepth:.3},'UNSUPPORTED_SURFACE_OWNER'],
  [{y:10,slope:.36,owner:'CANONICAL_VISIBLE_TERRAIN'},{valid:true,surfaceClass:'LOWLAND_SOIL',soilDepth:.3},'MATERIAL_OR_SLOPE'],
  [{y:10,slope:0,owner:'CANONICAL_VISIBLE_TERRAIN'},{valid:true,surfaceClass:'LOWLAND_SOIL',soilDepth:.19},'MATERIAL_OR_SLOPE'],
  [{y:10,slope:0,owner:'CANONICAL_VISIBLE_TERRAIN'},{valid:true,surfaceClass:'STONE_AND_SPARSE_SOIL',soilDepth:.034},'MATERIAL_OR_SLOPE']
 ]){const c=config();c.visibleSurface.ground.sample=()=>support;c.sampleMaterial=()=>material;const result=await buildPlantingPilotLayout(c);assert.equal(result.roots.length,0);assert.ok(result.receipt.rejections[reason]>0);}
});
function mockGL(failUpload=0){let serial=0;const calls={uploads:[],draws:[],deletedBuffers:[],deletedShaders:[],deletedPrograms:[],deletedVaos:[],sources:[],createdBuffers:0,uniforms:[]};const gl={...Object.fromEntries(['VERTEX_SHADER','FRAGMENT_SHADER','COMPILE_STATUS','LINK_STATUS','ARRAY_BUFFER','ELEMENT_ARRAY_BUFFER','STATIC_DRAW','FLOAT','DEPTH_TEST','BLEND','CULL_FACE','TRIANGLES','UNSIGNED_SHORT'].map((k,i)=>[k,i+1])),NO_ERROR:0,createShader:()=>({id:++serial}),shaderSource:(s,source)=>calls.sources.push(source),compileShader(){},getShaderParameter:()=>true,createProgram:()=>({id:++serial}),attachShader(){},linkProgram(){},getProgramParameter:()=>true,createVertexArray:()=>({id:++serial}),bindVertexArray(){},createBuffer:()=>{calls.createdBuffers++;return {id:++serial};},bindBuffer(){},bufferData:(target,data,usage)=>{calls.uploads.push({target,data:data.slice(),usage});if(calls.uploads.length===failUpload)throw Error('injected upload failure');},enableVertexAttribArray(){},vertexAttribPointer(){},vertexAttribDivisor(){},getUniformLocation:(p,name)=>name,getError:()=>0,useProgram(){},enable(){},depthMask(){},disable(){},uniformMatrix4fv(){},uniform3f:(...args)=>calls.uniforms.push(args),uniform1f:(...args)=>calls.uniforms.push(args),uniform1i(){},drawElementsInstanced:(...args)=>calls.draws.push(args),deleteBuffer:b=>calls.deletedBuffers.push(b),deleteShader:s=>calls.deletedShaders.push(s),deleteProgram:p=>calls.deletedPrograms.push(p),deleteVertexArray:v=>calls.deletedVaos.push(v)};return {gl,calls};}
const packet=(x,z)=>({camera:{viewProjectionMatrix:new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),position:{x,y:2,z}}});
test('mock GL: static buffers, exactly two draws/frame, no camera uploads, idempotent cleanup',async()=>{
 layout??=await buildPlantingPilotLayout(config());const {gl,calls}=mockGL(),renderer=createPlantingPilotRenderer(gl,layout);assert.equal(calls.uploads.length,3);assert.ok(calls.uploads.every(u=>u.usage===gl.STATIC_DRAW));const rootBuffer=calls.uploads[1].data;assert.deepEqual(rootBuffer,layout.records);
 for(const p of [packet(0,0),packet(-80,-300),packet(0,0)])renderer.draw(p);
 assert.equal(calls.draws.length,6);assert.deepEqual(calls.draws.map(d=>d[1]),[24,48,24,48,24,48]);assert.ok(calls.draws.every(d=>d[4]===layout.roots.length));assert.equal(calls.uploads.length,3);assert.equal(calls.createdBuffers,3);assert.deepEqual(rootBuffer,layout.records);const receipt=renderer.getReceipt();assert.equal(receipt.perFrameUploadBytes,0);assert.equal(receipt.frameCount,3);assert.equal(receipt.drawCallCount,6);assert.ok(receipt.gpuByteLength<receipt.maximumGpuBytes);assert.match(calls.sources[0],/float height=aShape\.x\s*;/);assert.equal([...calls.sources[0].matchAll(/\bheight\s*=/g)].length,1,'A single common height assignment must serve both detail passes');assert.match(calls.sources[0],/vec3 world=aRootAngle\.xyz\+vec3\(displacement\.x,height\*t,displacement\.y\)/);assert.doesNotMatch(calls.sources[0],/height\s*[*\/+-]=/);renderer.dispose();renderer.dispose();assert.equal(calls.deletedBuffers.length,3);assert.equal(calls.deletedShaders.length,2);assert.equal(calls.deletedPrograms.length,1);assert.equal(calls.deletedVaos.length,1);assert.throws(()=>renderer.draw(packet(0,0)),/DISPOSED/);
});
test('mock GL: failed allocation cleans partial resources and malformed records reject',()=>{
 const {gl,calls}=mockGL(2);assert.throws(()=>createPlantingPilotRenderer(gl,layout),/injected upload failure/);assert.equal(calls.deletedBuffers.length,2);assert.equal(calls.deletedShaders.length,2);assert.equal(calls.deletedPrograms.length,1);assert.equal(calls.deletedVaos.length,1);assert.throws(()=>createPlantingPilotRenderer(gl,{records:new Float32Array(9)}),/RECORDS_INVALID/);assert.throws(()=>createPlantingPilotRenderer(gl,{records:new Float32Array(8)}),/SHAPE_INVALID/);const huge=new Float32Array(140000*8);for(let i=0;i<huge.length;i+=8){huge[i+4]=.2;huge[i+5]=.03;}assert.throws(()=>createPlantingPilotRenderer(gl,{records:huge}),/GPU_BUDGET_EXCEEDED/);
});

test('source integration retains shared ownership, versioned bridge and render/dispose paths',async()=>{
 const base=new URL('../../showroom/globe/h-earth/',import.meta.url);
 const read=path=>readFile(new URL(path,base),'utf8');
 const [parent,visible,nav,globalCover,fine,binding,publicEntry]=await Promise.all([
  read('render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),read('render/vegetation-visible-surface.v1.js'),read('functional-landscape/navigation.js'),read('render/landscape-groundcover.global-v1.js'),read('render/woodland-fine-grass.v1.js'),read('diagnostic/run8e-r3d/live-gpu-binding.js'),read('functional-landscape/public-live-gpu-integration.run8e-r3e.js')]);
 const bridgeQuery=source=>source.match(/from\s+['"][^'"]*geological-runtime-bridge\.v1\.js(\?[^'"]+)['"]/)[1];
 assert.equal(bridgeQuery(parent),bridgeQuery(visible));assert.equal(bridgeQuery(parent),bridgeQuery(nav));
 assert.match(parent,/import\s*\{buildPlantingPilotLayout,isPlantingPilotPoint\}/);assert.match(parent,/import\s*\{createPlantingPilotRenderer\}/);
 for(const alias of ['pilotMaterialAt','pilotEstate','pilotStructureAt'])assert.match(parent,new RegExp('import[^;]*\\b'+alias+'\\b'));
 assert.match(parent,/sampleMaterial:pilotMaterialAt,toLocal:unprojectPlanetVertex,estate:pilotEstate/);
 assert.match(parent,/sampleStructure:pilotStructureAt/);assert.match(parent,/visibleSurface:resources\.vegetationVisibleSurface,geology:resources\.geologicalRuntime/);
 assert.equal([...parent.matchAll(/placementExclusion:isPlantingPilotPoint/g)].length,2);
 assert.match(globalCover,/placementExclusion\?\.\(x,z\)\?null:surface\.sample\(x,z\)/);
 assert.match(fine,/placementExclusion\?\.\(x,z\).*SHARED_PILOT_OWNER/);
 assert.match(parent,/resources\.plantingPilot\.draw\(packet\)/);assert.match(parent,/disposePlantingPilot:.*resources\.plantingPilot\?\.dispose\(\)/);
 assert.match(binding,/disposePlantingPilot:.*renderer\.disposePlantingPilot\(\)/);assert.match(publicEntry,/if\(!event\.persisted\)binding\?\.disposePlantingPilot\?\.\(\)/);
});


test('exact hash-bound canonical scene CPU layout: every accepted root contacts current indexed exterior',async t=>{
 const fixture=new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url);
 let bytes;
 try{bytes=await readFile(fixture);}catch(error){if(error.code==='ENOENT'){t.skip('Full canonical world gzip is absent from this sparse local checkout; exact-scene CPU qualification did not run.');return;}throw error;}
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
 const payload=JSON.parse(gunzipSync(bytes).toString('utf8'));
 assert.ok(payload.raw?.buffers&&payload.canonical?.buffers,'Fixture must contain both raw and canonical render packages');
 const base=new URL('../../showroom/globe/h-earth/render/',import.meta.url);
 const parent=await readFile(new URL('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',base),'utf8');
 const specifier=parent.match(/from\s+['"]([^'"]*geological-runtime-bridge\.v1\.js\?[^'"]+)['"]/)[1];
 const [{constructGeologicalRuntimeBridge},{buildVegetationVisibleSurface},material,placement,grass,terrain]=await Promise.all([
  import(new URL(specifier,base)),import(new URL('vegetation-visible-surface.v1.js',base)),
  import(new URL('../../../../h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js',base)),
  import(new URL('../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js',base)),
  import(new URL('grass-lowland-trial.js',base)),
  import(new URL('../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs',base))]);
 const sourceDigests=()=>[payload.raw,payload.canonical].map(pkg=>createHash('sha256').update(JSON.stringify(pkg.buffers)).digest('hex'));
 const before=sourceDigests(),geology=constructGeologicalRuntimeBridge(payload.canonical),visibleSurface=buildVegetationVisibleSurface(payload.raw,{geology});
 const actual=await buildPlantingPilotLayout({visibleSurface,geology,sampleMaterial:material.sampleHEarthRun8CSuccessorSurfaceMaterial,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,obstacles:payload.raw.landscapeCoverFootprints??[],trees:payload.raw.landscapeFloorFootprints??[],oasis:grass.H_EARTH_OASIS_FOLIAGE_SAMPLE});
 assert.ok(actual.roots.length>0,'Exact current canonical scene must admit planting');
 let contactChecks=0,hiddenWaterChecks=0,boundsChecks=0;
 for(const root of actual.roots){
  const support=visibleSurface.ground.sample(root.x,root.z);assert.ok(support);assert.equal(root.y,Math.fround(support.y));assert.equal(root.support.triangleId,support.triangleId);assert.equal(root.support.owner,support.owner);contactChecks++;
  const hiddenWet=geology.sampleWaterAt(root.x,root.z),renderedWet=visibleSurface.water.sample(root.x,root.z);
  assert.ok(!hiddenWet||root.y>hiddenWet.y+PLANTING_PILOT.waterClearance);assert.ok(!renderedWet||root.y>renderedWet.y+PLANTING_PILOT.waterClearance);hiddenWaterChecks++;
  assert.ok(root.x>=-105&&root.x<=-25&&root.z>=-345&&root.z<=-275);boundsChecks++;
 }
 assert.deepEqual(sourceDigests(),before,'Raw and canonical source buffers remain byte-for-byte equivalent');
 assert.equal(contactChecks,actual.receipt.rootCount);assert.equal(hiddenWaterChecks,actual.receipt.rootCount);assert.equal(boundsChecks,actual.receipt.rootCount);
 t.diagnostic(JSON.stringify({scope:'EXACT_CANONICAL_SOURCE_CPU_ONLY_NOT_GPU',worldSha256:createHash('sha256').update(bytes).digest('hex'),rootCount:actual.roots.length,contactChecks,hiddenWaterChecks,boundsChecks,layout:actual.receipt}));
});


test('mock GL propagates supplied and default scene light/haze uniforms without uploads or height changes',async()=>{
 layout??=await buildPlantingPilotLayout(config());const {gl,calls}=mockGL(),renderer=createPlantingPilotRenderer(gl,layout);
 const latest=name=>calls.uniforms.filter(row=>row[0]===name).at(-1).slice(1);
 renderer.draw(packet(0,0));
 assert.deepEqual(latest('uSunDirection'),[-.4,.8,.3]);assert.deepEqual(latest('uSunIntensity'),[.88]);assert.deepEqual(latest('uSunColor'),[1,1,1]);assert.deepEqual(latest('uGroundHazeColor'),[.54,.59,.62]);assert.deepEqual(latest('uFogStartDistance'),[160]);assert.deepEqual(latest('uFogFalloff'),[.001]);assert.deepEqual(latest('uMaximumFogFactor'),[.65]);
 renderer.draw({...packet(-80,-300),environmentUniforms:{sunDirection:{x:1,y:2,z:3},sunIntensity:1.2,sunColor:[255,128,64],groundHazeColor:{r:.2,g:.3,b:.4},fogStartDistance:100,fogFalloff:.002,maximumFogFactor:.8}});
 assert.deepEqual(latest('uSunDirection'),[1,2,3]);assert.deepEqual(latest('uSunIntensity'),[1.2]);assert.deepEqual(latest('uSunColor'),[1,128/255,64/255]);assert.deepEqual(latest('uGroundHazeColor'),[.2,.3,.4]);assert.deepEqual(latest('uFogStartDistance'),[100]);assert.deepEqual(latest('uFogFalloff'),[.002]);assert.deepEqual(latest('uMaximumFogFactor'),[.8]);
 assert.equal(calls.uploads.length,3);assert.equal(calls.createdBuffers,3);assert.equal(calls.draws.length,4);assert.deepEqual(calls.uploads[1].data,layout.records);
 assert.match(calls.sources[0],/float height=aShape\.x\s*;/);assert.match(calls.sources[1],/pow\(clamp\(lit\*1\.12,0\.0,1\.0\),vec3\(1\.0\/2\.2\)\)/);assert.match(calls.sources[1],/fog\*0\.48/);assert.match(calls.sources[1],/uMaximumFogFactor\)\*0\.68/);
 renderer.dispose();
});

// Execute the actual woodland module with explicit synthetic external dependencies.
// This fixture verifies observer equivalence, not canonical-scene or phone appearance.
async function loadDiagnosticWoodlandFixture(){
 const source=await readFile(new URL('../../showroom/globe/h-earth/render/woodland-fine-grass.v1.js',import.meta.url),'utf8');
 const dependencies=`const inverseHEarthGroundCoverPoint=(x,y,z)=>({x,z});
 const materialAt=()=>({valid:true,surfaceClass:'COASTAL_SOIL',soilDepth:1,shorelineDistance:40});
 const far={minX:10000,maxX:10001,minZ:10000,maxZ:10001};
 const estate={manorCore:far,gardens:far,outbuildingProposal:far,acceptedEnvelope:far,footRoute:[],footRouteRadius:1};
 const oasis=far;const sampleHEarthGen311PlacementStructureDisposition=()=>({hardExclusions:[],planningHolds:[]});`;
 return import('data:text/javascript;base64,'+Buffer.from(dependencies+source.replace(/^import[^\n]+\n/gm,'')).toString('base64'));
}
test('diagnostic ring bounds, defensive copies and observer failure isolation',async()=>{
 const {createVegetationContinuityTrace}=await loadDiagnosticWoodlandFixture();let clock=0;
 const trace=createVegetationContinuityTrace({maximumEvents:2,maximumRoots:2,now:()=>++clock});
 const input={roots:[{x:1},{x:2},{x:3}]};assert.equal(trace.record('ONE',input),true);input.roots[0].x=99;
 assert.equal(trace.getSnapshot().events[0].details.roots[0].x,1);assert.equal(trace.getSnapshot().events[0].details.roots.length,2);
 const snapshot=trace.getSnapshot();snapshot.events[0].details.roots[0].x=100;assert.equal(trace.getSnapshot().events[0].details.roots[0].x,1);
 trace.record('TWO');trace.record('THREE');assert.deepEqual(trace.getSnapshot().events.map(e=>e.type),['TWO','THREE']);assert.equal(trace.summary().droppedCount,1);
 const cycle={};cycle.self=cycle;assert.equal(trace.record('CYCLE',cycle),false);assert.equal(trace.record('LARGE',{value:'x'.repeat(33000)}),false);assert.equal(trace.summary().observerErrorCount,2);
 assert.deepEqual(trace.getSnapshot({sinceSequence:2}).events.map(e=>e.sequence),[3]);trace.dispose();trace.dispose();assert.equal(trace.summary().eventCount,0);assert.equal(trace.record('AFTER'),false);
 assert.throws(()=>createVegetationContinuityTrace({maximumEvents:513}),/MAXIMUM_EVENTS/);
});
test('diagnostic identities distinguish presentation from support and membership from order',async()=>{
 const {summarizeVegetationRoots}=await loadDiagnosticWoodlandFixture();
 const roots=[{x:1,y:2,z:3,seed:4,owner:'ERODED_TERRAIN'},{x:5,y:6,z:7,seed:8,owner:'VISIBLE_REFINEMENT'}];
 const built=summarizeVegetationRoots(roots,{presentationOwner:'NEARBY',maximumRoots:1});
 const installed=summarizeVegetationRoots(roots,{ownerForRoot:()=> 'NEARBY',maximumRoots:1});
 assert.equal(built.digest,installed.digest);assert.equal(built.membershipDigest,installed.membershipDigest);assert.equal(built.sample[0].owner,'NEARBY');assert.equal(built.sample[0].supportOwner,'ERODED_TERRAIN');assert.equal(built.truncatedRootCount,1);
 const reversed=summarizeVegetationRoots([...roots].reverse(),{presentationOwner:'NEARBY'});assert.notEqual(built.digest,reversed.digest);assert.equal(built.membershipDigest,reversed.membershipDigest);
 const moved=summarizeVegetationRoots([{...roots[0],x:1.01},roots[1]],{presentationOwner:'NEARBY'});assert.notEqual(moved.membershipDigest,built.membershipDigest);
});
test('actual cache and selector give identical settled roots/pixels with diagnostics OFF and ON',async()=>{
 const {createNearbyFineGrassCache,selectWoodlandFineGrass,createVegetationContinuityTrace}=await loadDiagnosticWoodlandFixture();
 const visibleSurface={ground:{sample:()=>({y:0,slope:0,triangleId:0,owner:'CANONICAL_VISIBLE_TERRAIN'})},water:{sample:()=>null}};
 const pkg={landscapeCoverFootprints:[],landscapeFloorFootprints:[]},trace=createVegetationContinuityTrace(),off=createNearbyFineGrassCache(pkg,{visibleSurface}),on=createNearbyFineGrassCache(pkg,{visibleSurface,onDiagnostic:(type,details)=>trace.record(type,details)});
 const positions=[{x:200,z:-200},{x:204,z:-200},{x:200,z:-200}],sets=[];
 for(const camera of positions){
  const options={coreRadiusMeters:8,outerRadiusMeters:12};const [a,b]=await Promise.all([off.update(camera,options),on.update(camera,options)]);
  assert.deepEqual(a.tiles,b.tiles);assert.equal(a.receipt.diagnostic,undefined);assert.ok(b.receipt.diagnostic.requestRevision>0);
  const sa=selectWoodlandFineGrass(a,camera),sb=selectWoodlandFineGrass(b,camera);assert.deepEqual(sa.pixels,sb.pixels);assert.deepEqual(sa.groups,sb.groups);assert.equal(sa.contactCount,sb.contactCount);
  sets.push(a.tiles.flatMap(t=>t.roots).map(r=>`${r.x}:${r.z}`));
 }
 assert.deepEqual(sets[0],sets[2]);assert.notDeepEqual(sets[0],sets[1]);assert.ok(trace.getSnapshot().events.some(e=>e.type==='BUILD_COMPLETE'));
 const throwing=createNearbyFineGrassCache(pkg,{visibleSurface,onDiagnostic:()=>{throw Error('observer');}});assert.deepEqual((await throwing.update(positions[0],{coreRadiusMeters:8,outerRadiusMeters:12})).tiles,(await off.update(positions[0],{coreRadiusMeters:8,outerRadiusMeters:12})).tiles);
});
test('observer-only integration is explicitly opt-in and labels pixel/shoreline limits',async()=>{
 const base=new URL('../../showroom/globe/h-earth/',import.meta.url);
 const [parent,binding,entry,browser]=await Promise.all([readFile(new URL('render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',base),'utf8'),readFile(new URL('diagnostic/run8e-r3d/live-gpu-binding.js',base),'utf8'),readFile(new URL('functional-landscape/public-live-gpu-integration.run8e-r3e.js',base),'utf8'),readFile(new URL('./h-earth.cavern-vegetation-browser.v1.mjs',import.meta.url),'utf8')]);
 assert.match(parent,/vegetationTraceEnabled = false/);assert.match(parent,/vegetationTraceEnabled===true\?createVegetationContinuityTrace\(\):null/);
 assert.match(binding,/vegetationTraceEnabled:queryParameters.get\('vegetation-trace'\)==='v1'/);assert.match(entry,/get\('qualification'\)==='vegetation-continuity-v1'/);
 assert.match(parent,/renderedContactDistanceMeters:null,visibleSandWeight:null/);assert.match(parent,/visiblePixelsVerified:false/);assert.match(parent,/calledThisFrame/);
 assert.match(browser,/TRACE_CAPTURED_VISUAL_VERDICT_NOT_ESTABLISHED/);assert.match(browser,/exactOwnerVideoRouteReproduced:false/);assert.match(browser,/SYNTHETIC_WHEEL_THROUGH_REAL_INTAKE/);
});
test('diagnostic replay records actual achieved positions and never infers visual acceptance',async()=>{
 const {qualifyVegetationContinuity}=await load('./h-earth.cavern-vegetation-browser.v1.mjs');
 const oldWindow=globalThis.window,oldWheel=globalThis.WheelEvent;let z=-96,sequence=0;
 globalThis.window={};globalThis.WheelEvent=class{constructor(type,options){this.type=type;Object.assign(this,options);}};
 try{
  const result=await qualifyVegetationContinuity({canvas:{dispatchEvent:event=>{z+=event.deltaY<0?-4:4;sequence++;}},intake:{getNavigationState:()=>({position:{x:0,y:2.25,z},yawDegrees:0,pitchDegrees:-8,sequence})},binding:{getVegetationTrace:()=>({enabled:true,lastSequence:0,events:[],droppedCount:0}),getReceipt:()=>({counters:{renderFrameCallCount:sequence+1}}),getVegetationProbe:()=>({enabled:true,visiblePixelsVerified:false})},root:{dataset:{}},stationaryMilliseconds:0,steps:1,stepDelayMilliseconds:100});
  assert.equal(result.initial.renderFrameCallCount,1);assert.equal(result.final.renderFrameCallCount,3);assert.equal(result.cacheCellTransitions,2);assert.equal(result.returnDistanceMeters,0);assert.equal(result.movementObserved,true);assert.equal(result.visiblePixelsVerified,false);assert.equal(result.physicalDeviceAcceptance,false);assert.equal(result.exactOwnerVideoRouteReproduced,false);
 }finally{if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;if(oldWheel===undefined)delete globalThis.WheelEvent;else globalThis.WheelEvent=oldWheel;}
});
