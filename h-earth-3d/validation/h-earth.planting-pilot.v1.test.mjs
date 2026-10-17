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
function config(reverse=false){return {visibleSurface:{admitGround:()=>true,ground:{sample:sampleGround},water:{sample:(x,z)=>inBox(x,z,rendered)?{y:20}:null}},geology:{meshes:[{role:'FRESHWATER_RIVER',mesh:{positions:riverPositions,indices:new Uint16Array(reverse?[0,2,3,0,1,2]:[0,1,2,0,2,3])}}],sampleWaterAt:(x,z)=>{const half=5+(z+345)/7;return inBox(x,z,hidden)||Math.abs(x+80)<=half?{y:20}:null;}},sampleMaterial:(x)=>({valid:true,surfaceClass:x<-100?'STONE_AND_SPARSE_SOIL':'LOWLAND_SOIL',soilDepth:.3}),toLocal:(x,y,z)=>({x,y,z}),estate,obstacles,trees,oasis,sampleStructure:(x,z)=>inBox(x,z,structure)?{hardExclusions:['building']}:null};}
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
 assert.match(parent,/import\s*\{buildPlantingPilotLayout,isPlantingPilotPoint,createUniformGroundAdmission\}/);assert.match(parent,/import\s*\{createPlantingPilotRenderer\}/);
 for(const alias of ['pilotMaterialAt','pilotEstate','pilotStructureAt'])assert.match(parent,new RegExp('import[^;]*\\b'+alias+'\\b'));
 assert.match(parent,/sampleMaterial:pilotMaterialAt,toLocal:unprojectPlanetVertex,estate:pilotEstate/);
 assert.match(parent,/sampleStructure:pilotStructureAt/);assert.match(parent,/visibleSurface:resources\.vegetationVisibleSurface,geology:resources\.geologicalRuntime/);
 assert.equal([...parent.matchAll(/placementExclusion:isPlantingPilotPoint/g)].length,0);
 assert.match(parent,/pilotCoverageOwner\.commit\(\{uploadComplete:state\.uploadComplete,coverageValidated:state\.coverageValidated,glError:error\}\)/);
 assert.match(parent,/resources\.plantingPilot&&pilotCoverageOwner\.shouldDrawPilot\(\)/);
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
 const actual=await buildPlantingPilotLayout({admitGround:()=>true,visibleSurface,geology,sampleMaterial:material.sampleHEarthRun8CSuccessorSurfaceMaterial,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,obstacles:payload.raw.landscapeCoverFootprints??[],trees:payload.raw.landscapeFloorFootprints??[],oasis:grass.H_EARTH_OASIS_FOLIAGE_SAMPLE});
 assert.ok(actual.roots.length>0,'Exact current canonical scene must admit planting');
 let contactChecks=0,hiddenWaterChecks=0,boundsChecks=0;
 for(const root of actual.roots){
  const support=visibleSurface.ground.sample(root.x,root.z);assert.ok(support);assert.equal(root.y,Math.fround(support.y));assert.equal(root.support.triangleId,support.triangleId);assert.equal(root.support.owner,support.owner);contactChecks++;
  const hiddenWet=geology.sampleWaterAt(root.x,root.z),renderedWet=visibleSurface.water.sample(root.x,root.z);
  assert.ok(!hiddenWet||root.y>hiddenWet.y+PLANTING_PILOT.waterClearance);assert.ok(!renderedWet||root.y>renderedWet.y+PLANTING_PILOT.waterClearance);hiddenWaterChecks++;
  assert.ok(root.x>=-105&&root.x<=-25&&root.z>=-345&&root.z<=-275);boundsChecks++;
 }
 const uploadSource=await readFile(new URL('gpu-upload-views.run8e-r2d.js',base),'utf8');
 const beachFixture=await buildCanonicalBeachFixture({baseDirectory:new URL('../../',import.meta.url).pathname,pkg:payload.raw,geology,uploadSource,
  protectedReferenceAt:(x,y,z)=>{const q=terrain.unprojectPlanetVertex(x,y,z);assert.ok(q.z< -260||q.z> -150||q.x> -24,'Pilot/fixed-root fixture must stay outside protected reference clearing');return false;}});
 const {createUniformGroundAdmission}=await load('../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js');
 const actualAdmission=await createUniformGroundAdmission({visibleSurface:beachFixture.visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,obstacles:payload.raw.landscapeCoverFootprints??[],trees:payload.raw.landscapeFloorFootprints??[],oasis:grass.H_EARTH_OASIS_FOLIAGE_SAMPLE});
 const qualified=await buildPlantingPilotLayout({admitGround:actualAdmission,visibleSurface:beachFixture.visibleSurface,geology,sampleMaterial:material.sampleHEarthRun8CSuccessorSurfaceMaterial,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,obstacles:payload.raw.landscapeCoverFootprints??[],trees:payload.raw.landscapeFloorFootprints??[],oasis:grass.H_EARTH_OASIS_FOLIAGE_SAMPLE});
 assert.equal(qualified.receipt.rootCount,5313);assert.equal(qualified.receipt.layoutDigest,'FNV1A32_NONCRYPTOGRAPHIC:2ce04494');assert.deepEqual(qualified.records,actual.records,'Actual shared renderer signal preserves all historical inland pilot records');
 const x=3.7832353115081787,z=-127.66645812988281,support=beachFixture.visibleSurface.ground.sample(x,z),beach=beachFixture.visibleSurface.beach.sample({x,z,support});
 assert.equal(support.triangleId,14688);assert.ok(Math.abs(beach.rawSandCoverage-.9175581216095148)<1e-12);assert.equal(actualAdmission(x,z,support),false,'Actual admitted >90% rendered-sand root now rejected');
 t.diagnostic(JSON.stringify({scope:'ACTUAL_INDEXED_GPU_ATTRIBUTE_PROVIDER_CPU_NOT_BROWSER',pilotRoots:qualified.receipt.rootCount,pilotDigest:qualified.receipt.layoutDigest,knownBeachRootSandCoverage:beach.rawSandCoverage,admission:actualAdmission.getReceipt()}));
 assert.deepEqual(sourceDigests(),before,'Raw and canonical source buffers remain byte-for-byte equivalent');
 assert.equal(contactChecks,actual.receipt.rootCount);assert.equal(hiddenWaterChecks,actual.receipt.rootCount);assert.equal(boundsChecks,actual.receipt.rootCount);
 t.diagnostic(JSON.stringify({scope:'HISTORICAL_PILOT_CANONICAL_CPU_WITH_EXPLICIT_PRE_BEACH_ADMISSION_FIXTURE_NOT_GPU_OR_NEW_BEACH_ACCEPTANCE',worldSha256:createHash('sha256').update(bytes).digest('hex'),rootCount:actual.roots.length,contactChecks,hiddenWaterChecks,boundsChecks,layout:actual.receipt}));
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
 const visibleSurface={admitGround:()=>true,ground:{sample:()=>({y:0,slope:0,triangleId:0,owner:'CANONICAL_VISIBLE_TERRAIN'})},water:{sample:()=>null}};
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


// Proposed cache scheduler regressions: synthetic dependencies, not pixel proof.
{
const progressiveLegacyCacheSource = "export function createNearbyFineGrassCache(pkg,{visibleSurface,yieldControl=async()=>{},onProgress=()=>{},placementExclusion=null}={}){\n if(typeof visibleSurface?.ground?.sample!=='function'||typeof visibleSurface?.water?.sample!=='function')throw Error('NEARBY_FINE_GRASS_VISIBLE_SURFACE_REQUIRED');\n if(placementExclusion!==null&&typeof placementExclusion!=='function')throw Error('NEARBY_FINE_GRASS_EXCLUSION_INVALID');\n const spacing=.22,tileMeters=4,maximumRoots=65536;\n const tiles=new Map(),obstacles=pkg.landscapeCoverFootprints??[],trees=pkg.landscapeFloorFootprints??[];\n let lastKey=null,lastPresentation=null,latestRequest=null,worker=null,requestRevision=0;\n const tileDistance=(tx,tz,cx,cz)=>Math.hypot(cx-Math.max(tx*4,Math.min(tx*4+4,cx)),cz-Math.max(tz*4,Math.min(tz*4+4,cz)));\n async function constructTile(tx,tz,revision){\n  const roots=[],rejections={};let candidates=0,slice=performance.now();\n  const reject=reason=>rejections[reason]=(rejections[reason]??0)+1;\n  // Neighboring cells may jitter across a tile boundary. Both tiles examine the\n  // apron, but only the world-position owner retains that root, exactly once.\n  for(let iz=Math.floor(tz*4/spacing)-1;iz<=Math.ceil((tz*4+4)/spacing)+1;iz++){\n   if(revision!==requestRevision)return null;\n   for(let ix=Math.floor(tx*4/spacing)-1;ix<=Math.ceil((tx*4+4)/spacing)+1;ix++){\n    const x=f((ix+(hash(ix,iz,10)/4294967296-.5)*.76)*spacing),z=f((iz+(hash(ix,iz,11)/4294967296-.5)*.76)*spacing);\n    if(Math.floor(x/4)!==tx||Math.floor(z/4)!==tz)continue;candidates++;\n    if(placementExclusion?.(x,z)){reject('SHARED_PILOT_OWNER');continue;}\n    const s=visibleSurface.ground.sample(x,z);\n    if(!s){reject('NO_VISIBLE_TERRAIN');continue;}\n    if(isWoodlandFineGrassPoint(x,s.y,z)){reject('APPROVED_WOODLAND_OWNER');continue;}\n    const water=visibleSurface.water.sample(x,z);\n    if(water&&s.y<=water.y+.01){reject('RENDERED_WATER');continue;}\n    const a=inverseHEarthGroundCoverPoint(x,s.y,z),m=materialAt(a.x,a.z);\n    if(m?.valid!==true||s.slope>.35||!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20)){reject('MATERIAL_OR_SLOPE');continue;}\n    if(!woodlandGrassClear(a.x,a.z)||obstacles.some(t=>Math.hypot(x-t.x,z-t.z)<t.radius+.03)||trees.some(t=>Math.hypot(x-t.x,z-t.z)<t.trunkRadius+.10)){reject('PROTECTED_FOOTPRINT');continue;}\n    roots.push({x,y:s.y,z,angle:f(hash(ix,iz,12)/4294967296*Math.PI*2),seed:hash(ix,iz,13),triangleId:s.triangleId,slope:s.slope,owner:s.owner});\n    if((candidates&63)===0&&performance.now()-slice>=8){await yieldControl();slice=performance.now();}\n   }\n   if(performance.now()-slice>=8){await yieldControl();slice=performance.now();}\n  }\n  roots.sort((a,b)=>a.seed-b.seed||a.z-b.z||a.x-b.x);\n  return {id:`NEARBY:${tx}:${tz}`,minX:tx*4,minZ:tz*4,roots,candidates,rejections};\n }\n async function updateNow(camera,{coreRadiusMeters:coreRadius,outerRadiusMeters:outerRadius},revision){\n  const point=camera?.position??camera;\n  if(!point||![point.x,point.z].every(Number.isFinite))throw Error('NEARBY_FINE_GRASS_CAMERA_INVALID');\n  const cx=Math.floor(point.x/4)*4+2,cz=Math.floor(point.z/4)*4+2,key=`${cx}:${cz}:${coreRadius}:${outerRadius}`;\n  if(key===lastKey)return lastPresentation;\n  const started=performance.now(),requested=[];let builtTiles=0,reusedTiles=0,slice=started;\n  for(const [id,tile] of tiles)if(tileDistance(tile.minX/4,tile.minZ/4,cx,cz)>outerRadius+8)tiles.delete(id);\n  for(let tz=Math.floor((cz-outerRadius)/4);tz<=Math.floor((cz+outerRadius)/4);tz++)for(let tx=Math.floor((cx-outerRadius)/4);tx<=Math.floor((cx+outerRadius)/4);tx++){\n   const distance=tileDistance(tx,tz,cx,cz);if(distance<=outerRadius)requested.push({tx,tz,distance});\n  }\n  requested.sort((a,b)=>a.distance-b.distance||a.tz-b.tz||a.tx-b.tx);\n  for(const {tx,tz} of requested){\n   if(revision!==requestRevision)return null;\n   const id=`${tx}:${tz}`;\n   if(tiles.has(id)){reusedTiles++;continue;}\n   const tile=await constructTile(tx,tz,revision);\n   if(!tile||revision!==requestRevision)return null;\n   tiles.set(id,tile);builtTiles++;\n   onProgress({phase:'NEARBY_FINE_GRASS_TILES',completedTiles:builtTiles+reusedTiles,totalTiles:requested.length,centerX:cx,centerZ:cz});\n   if(performance.now()-slice>=8){await yieldControl();slice=performance.now();}\n  }\n  const output=[];let contacts=0;\n  for(const {tx,tz} of requested){\n   const tile=tiles.get(`${tx}:${tz}`),roots=tile.roots.filter(root=>{\n    const distance=Math.hypot(root.x-cx,root.z-cz);\n    if(distance<=coreRadius)return true;if(distance>=outerRadius)return false;\n    const t=(outerRadius-distance)/(outerRadius-coreRadius),weight=t*t*(3-2*t);\n    return hash(Math.round(root.x/spacing),Math.round(root.z/spacing),14)/4294967296<weight;\n   });\n   if(roots.length){output.push({id:tile.id,minX:tile.minX,minZ:tile.minZ,roots});contacts+=roots.length;}\n  }\n  // The supported circular lattice normally fits without truncation. The cap\n  // is a deterministic fail-closed budget, never a tile-order clipping rule.\n  if(contacts>maximumRoots)throw Error('NEARBY_FINE_GRASS_ROOT_BUDGET_EXCEEDED:'+contacts);\n  output.sort((a,b)=>a.minZ-b.minZ||a.minX-b.minX);\n  const presentation={tiles:output};await prepareWoodlandSelectionCache(presentation,yieldControl);\n  if(revision!==requestRevision)return null;\n  // Bound retained tile data too. Eviction changes work cost only; regenerated\n  // absolute-grid roots are byte-identical on an A-B-A walk.\n  let cachedRoots=[...tiles.values()].reduce((n,t)=>n+t.roots.length,0);\n  if(cachedRoots>maximumRoots){\n   const eviction=[...tiles.entries()].sort((a,b)=>tileDistance(b[1].minX/4,b[1].minZ/4,cx,cz)-tileDistance(a[1].minX/4,a[1].minZ/4,cx,cz)||b[1].minZ-a[1].minZ||b[1].minX-a[1].minX);\n   for(const [id,tile] of eviction){if(cachedRoots<=maximumRoots)break;tiles.delete(id);cachedRoots-=tile.roots.length;}\n  }\n  presentation.receipt={schema:'H_EARTH_NEARBY_FINE_GRASS_CACHE_v1',contactCount:contacts,tileCount:output.length,builtTiles,reusedTiles,cachedTiles:tiles.size,cachedRoots,maximumRoots,centerX:cx,centerZ:cz,spacing,coreRadiusMeters:coreRadius,outerRadiusMeters:outerRadius,elapsedMilliseconds:performance.now()-started,rootEncoding:'ACTUAL_FLOAT32_VISIBLE_TRIANGLE_CONTACTS',originalRecordsChanged:false,terrainChanged:false,approvedWoodlandOwnerPreserved:true};\n  lastKey=key;lastPresentation=presentation;return presentation;\n }\n return Object.freeze({update(camera,{coreRadiusMeters=24,outerRadiusMeters=32}={}){\n  if(![coreRadiusMeters,outerRadiusMeters].every(Number.isFinite)||coreRadiusMeters<=0||coreRadiusMeters>=outerRadiusMeters||outerRadiusMeters>32)throw Error('NEARBY_FINE_GRASS_RADIUS_INVALID');\n  const point=camera?.position??camera;\n  if(!point||![point.x,point.z].every(Number.isFinite))throw Error('NEARBY_FINE_GRASS_CAMERA_INVALID');\n  if(worker&&latestRequest.options.coreRadiusMeters===coreRadiusMeters&&latestRequest.options.outerRadiusMeters===outerRadiusMeters&&Math.floor(latestRequest.camera.x/4)===Math.floor(point.x/4)&&Math.floor(latestRequest.camera.z/4)===Math.floor(point.z/4))return worker;\n  latestRequest={camera:{x:point.x,z:point.z},options:{coreRadiusMeters,outerRadiusMeters},revision:++requestRevision};\n  if(!worker)worker=(async()=>{\n   try{\n    // All pending callers receive the newest completed presentation. A newer\n    // camera request cancels obsolete work at the next bounded tile/row yield.\n    while(true){const request=latestRequest,result=await updateNow(request.camera,request.options,request.revision);if(request.revision===requestRevision)return result;}\n   }finally{worker=null;}\n  })();\n  return worker;\n }});\n}\n\n";
async function loadProgressiveCacheFixture(legacy=false){
 let source=await readFile(new URL('../../showroom/globe/h-earth/render/woodland-fine-grass.v1.js',import.meta.url),'utf8');
 if(legacy){const first=source.indexOf('export function createNearbyFineGrassCache('),last=source.indexOf('export function selectWoodlandFineGrass(');assert.ok(first>=0&&last>first);source=source.slice(0,first)+progressiveLegacyCacheSource+source.slice(last);}
 const dependencies=`let fixtureClock=0;const performance={now:()=>++fixtureClock};
 const inverseHEarthGroundCoverPoint=(x,y,z)=>({x,z});
 const materialAt=()=>({valid:true,surfaceClass:'COASTAL_SOIL',soilDepth:1,shorelineDistance:40});
 const far={minX:10000,maxX:10001,minZ:10000,maxZ:10001};
 const estate={manorCore:far,gardens:far,outbuildingProposal:far,acceptedEnvelope:far,footRoute:[],footRouteRadius:1};
 const oasis=far;const sampleHEarthGen311PlacementStructureDisposition=()=>({hardExclusions:[],planningHolds:[]});\n`;
 return import('data:text/javascript;base64,'+Buffer.from(dependencies+source.replace(/^import[^\n]+\n/gm,'')).toString('base64'));
}
const pkg={landscapeCoverFootprints:[],landscapeFloorFootprints:[]};
const a={x:200,z:-200},b={x:204,z:-200},options={coreRadiusMeters:8,outerRadiusMeters:12};
function progressiveSurface(onSample=()=>{}){return{admitGround:()=>true,ground:{sample(x,z){onSample(x,z);return{y:0,slope:0,triangleId:7,owner:'CANONICAL_VISIBLE_TERRAIN'};}},water:{sample:()=>null}};}
function progressiveRoots(p){return p.tiles.flatMap(t=>t.roots);}
function progressiveSignature(p){return p.tiles.map(t=>[t.id,t.roots.map(r=>[r.x,r.y,r.z,r.angle,r.seed,r.triangleId,r.slope,r.owner])]);}
function checkProgressiveSnapshot(p,meta){
 assert.ok(progressiveRoots(p).length>0,'Never publish an empty progressive replacement');
 for(const key of ['requestRevision','key','presentationSequence','complete'])assert.equal(p.receipt[key],meta[key],key+' receipt/callback mismatch');
 assert.equal(typeof meta.complete,'boolean');assert.ok(Number.isSafeInteger(meta.presentationSequence)&&meta.presentationSequence>0);
 const seen=new Set();for(const root of progressiveRoots(p)){const id=root.x+':'+root.z;assert.equal(seen.has(id),false,'Duplicate world root');seen.add(id);}
}
test('publishes coherent nonempty partial data before settled completion',async()=>{
 const {createNearbyFineGrassCache}=await loadProgressiveCacheFixture(),seen=[];let finished=false;
 const cache=createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface(),onPresentation(p,m){checkProgressiveSnapshot(p,m);assert.equal(finished,false);seen.push({p,m,progressiveSignature:progressiveSignature(p)});}});
 const final=await cache.update(a,options);finished=true;
 assert.ok(seen.some(s=>s.m.complete===false),'At least one bounded partial snapshot must precede completion');
 assert.equal(seen.at(-1).m.complete,true);assert.deepEqual(progressiveSignature(seen.at(-1).p),progressiveSignature(final));
 for(let i=1;i<seen.length;i++)assert.ok(seen[i].m.presentationSequence>seen[i-1].m.presentationSequence);
 for(const old of seen)assert.deepEqual(progressiveSignature(old.p),old.progressiveSignature,'Published root arrays remain unchanged after later work');
});
test('camera movement preserves in-flight tile work and publishes while moving',async()=>{
 const {createNearbyFineGrassCache}=await loadProgressiveCacheFixture(),calls=new Map(),published=[];let moved=false,second,cache;
 cache=createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface((x,z)=>{const id=x+':'+z;calls.set(id,(calls.get(id)??0)+1);}),yieldControl:async()=>{if(!moved){moved=true;second=cache.update(b,options);}},onPresentation(p,m){checkProgressiveSnapshot(p,m);published.push({p,m});}});
 const first=cache.update(a,options),final=await first;await second;
 assert.equal(moved,true);assert.ok(published.some(s=>s.m.requestRevision>=2),'Latest moving request publishes');
 // A and B overlap the camera-nearest started tile. Completing tiles independently
 // of request revision avoids resampling any contact in that retained tile.
 const retained=progressiveRoots(final).filter(r=>Math.floor(r.x/4)===50&&Math.floor(r.z/4)===-50);
 assert.ok(retained.length>0);for(const r of retained)assert.equal(calls.get(r.x+':'+r.z),1,'Camera revision must not restart a retained tile');
 const sequences=published.map(s=>s.m.presentationSequence);assert.equal(new Set(sequences).size,sequences.length);
});
test('settled roots and selected GPU pixels match pre-repair algorithm A-B-A',async()=>{
 const current=await loadProgressiveCacheFixture(),prior=await loadProgressiveCacheFixture(true),seen=[];
 const fixed=current.createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface(),onPresentation(p,m){checkProgressiveSnapshot(p,m);}}),old=prior.createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface()});
 for(const camera of [a,b,a]){
  const [actual,expected]=await Promise.all([fixed.update(camera,options),old.update(camera,options)]);
  assert.deepEqual(progressiveSignature(actual),progressiveSignature(expected),'Settled eligibility, root IDs and geometry remain equivalent');
  const sa=current.selectWoodlandFineGrass(actual,camera),sb=prior.selectWoodlandFineGrass(expected,camera);
  assert.deepEqual(sa.pixels,sb.pixels);assert.deepEqual(sa.groups,sb.groups);assert.equal(sa.contactCount,sb.contactCount);
  assert.equal(actual.receipt.complete,true);seen.push(progressiveSignature(actual));
 }
 assert.deepEqual(seen[0],seen[2]);
});

test('async partial callback never blocks tile construction and final callback precedes settlement',async()=>{
 const {createNearbyFineGrassCache}=await loadProgressiveCacheFixture();
 let release,first=true,callbacks=0,settled=false;
 const held=new Promise(resolve=>{release=resolve;});
 const cache=createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface(),yieldControl:async()=>{},async onPresentation(p,m){
  checkProgressiveSnapshot(p,m);assert.equal(Object.isFrozen(p),true);assert.equal(Object.isFrozen(p.tiles),true);assert.equal(Object.isFrozen(p.receipt),true);
  assert.equal(settled,false,'update resolves after the final callback');callbacks++;
  if(first){first=false;await held;}
 }});
 const done=cache.update(a,{coreRadiusMeters:2,outerRadiusMeters:4}).then(value=>{settled=true;return value;});
 for(let i=0;i<25000;i++)await Promise.resolve();
 assert.equal(first,false,'A ready partial callback started');assert.equal(cache.getReceipt().building,false,'The builder finishes while the first callback remains blocked');assert.equal(settled,false);
 release();const final=await done;assert.equal(final.receipt.complete,true);assert.ok(callbacks>=2);
});
test('presentation callback failures reject completion and remain sticky without destroying cached tiles',async()=>{
 const {createNearbyFineGrassCache}=await loadProgressiveCacheFixture();
 let shouldThrow=true;
 const cache=createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface(),yieldControl:async()=>{},onPresentation(){if(shouldThrow)throw Error('FIXTURE_PRESENTATION_CALLBACK_FAILURE');}});
 await assert.rejects(cache.update(a,{coreRadiusMeters:2,outerRadiusMeters:4}),/FIXTURE_PRESENTATION_CALLBACK_FAILURE/);
 const failed=cache.getReceipt();assert.match(failed.stickyError,/FIXTURE_PRESENTATION_CALLBACK_FAILURE/);assert.ok(failed.errorCount>=1);assert.ok(failed.cachedRoots>0);assert.ok(failed.cachedRoots<=65536);
 shouldThrow=false;const recovered=await cache.update(b,{coreRadiusMeters:2,outerRadiusMeters:4});
 assert.equal(recovered.receipt.complete,true);assert.match(cache.getReceipt().stickyError,/FIXTURE_PRESENTATION_CALLBACK_FAILURE/,'Later success must preserve the earlier error');
});
test('world tile cache stays bounded at each publication and completion while traversing full radius',async()=>{
 const {createNearbyFineGrassCache}=await loadProgressiveCacheFixture();let cache,progressChecks=0;
 cache=createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface(),yieldControl:async()=>{},onProgress(){progressChecks++;assert.ok(cache.getReceipt().cachedRoots<=65536,'Cache bound holds immediately after tile insertion');}});
 for(const camera of [a,{x:260,z:-200},a]){
  const p=await cache.update(camera);assert.equal(p.receipt.complete,true);assert.ok(p.receipt.contactCount<=65536);assert.ok(p.receipt.cachedRoots<=65536);assert.ok(p.receipt.peakCachedRoots<=65536);assert.ok(p.receipt.peakRequestRoots<=65536);
  assert.deepEqual(p.receipt.retainedRootBounds,{cache:65536,currentRequest:65536,preparingSnapshot:65536,lastPresentation:65536,rendererInstalledNearby:65536,additionalInFlightTiles:1,maximumInFlightTileRoots:484});
 }
 assert.ok(progressChecks>0);
});

test('evicted raw tiles retain every still-eligible installed root in progressive overlap',async()=>{
 const current=await loadProgressiveCacheFixture(),prior=await loadProgressiveCacheFixture(true);
 let observe=false,partialCount=0,provisionalSeen=false,required;
 const identity=r=>`${r.x}:${r.z}`;
 const cache=current.createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface(),yieldControl:async()=>{},onPresentation(p,m){
  if(!observe||m.complete)return;partialCount++;provisionalSeen ||= p.receipt.provisionalTileCount>0;
  const present=new Set(progressiveRoots(p).map(identity));for(const id of required)assert.ok(present.has(id),'Still-eligible installed root lost during partial replacement: '+id);
 }});
 const initial=await cache.update(a),legacy=prior.createNearbyFineGrassCache(pkg,{visibleSurface:progressiveSurface()});
 const expected=await legacy.update(b),eligible=new Set(progressiveRoots(expected).map(identity));
 required=new Set(progressiveRoots(initial).map(identity).filter(id=>eligible.has(id)));assert.ok(required.size>10000);
 observe=true;const final=await cache.update(b);
 assert.ok(partialCount>0);assert.ok(provisionalSeen,'Full-radius raw-cache eviction must exercise provisional retained support');
 assert.deepEqual(progressiveSignature(final),progressiveSignature(expected));assert.equal(final.receipt.provisionalTileCount,0);
});

async function createActualMergeWorkerFixture(){
 const source=await readFile(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const start=source.indexOf('let mergeWorker=null,mergePending=false'),end=source.indexOf('resources.mergeFinePresentation=mergeFinePresentation;',start);
 assert.ok(start>=0&&end>start,'Actual production merge worker must be extracted');
 const worker=source.slice(start,end);
 return Function(`const resources={woodlandFineGrass:{id:'PRIOR'}},vegetationTrace=null;let woodlandFinePresentation=null,nearbyFinePresentation=null,nearbyFineDesiredKey=null;const pending=[],installed=[];
 const yieldToBrowserPaint=async()=>{};
 const prepareWoodlandSelectionCache=p=>new Promise((resolve,reject)=>pending.push({p,resolve,reject}));
 const installFinePresentation=p=>{installed.push(p);resources.woodlandFineGrass={presentation:p,selection:{retained:true},selectionKey:'STATIONARY'};return resources.woodlandFineGrass;};
 ${worker}
 return {merge:mergeFinePresentation,pending,installed,resources,set(key,sequence){nearbyFineDesiredKey=key;nearbyFinePresentation={tiles:[{id:'NEARBY:FIXTURE',minX:0,minZ:0,roots:[{x:sequence,y:0,z:0,angle:0,seed:sequence,triangleId:0,slope:0,owner:'CANONICAL_VISIBLE_TERRAIN'}]}],receipt:{key,presentationSequence:sequence,contactCount:1}};},setDesired(key){nearbyFineDesiredKey=key;},setPresentation(key,sequence,tiles,complete=false,requestRevision=1){nearbyFineDesiredKey=key;nearbyFinePresentation={tiles,receipt:{key,presentationSequence:sequence,contactCount:tiles.reduce((n,t)=>n+t.roots.length,0),complete,requestRevision}};}};`)();
}
async function progressiveMicrotasksUntil(predicate){for(let i=0;i<1000&&!predicate();i++)await Promise.resolve();assert.ok(predicate(),'Expected controlled merge checkpoint');}
test('actual merge worker rejects stale key but allows useful older same-key partial before its successor',async()=>{
 const stale=await createActualMergeWorkerFixture();stale.set('A',1);const first=stale.merge();assert.equal(stale.pending.length,1);
 stale.set('B',2);const second=stale.merge();assert.equal(first,second);stale.pending[0].resolve();
 await progressiveMicrotasksUntil(()=>stale.pending.length===2);assert.equal(stale.installed.length,0,'Old-key prepared snapshot must not install');
 stale.pending[1].resolve();await second;assert.deepEqual(stale.installed.map(p=>p.receipt.nearby.key),['B']);
 const same=await createActualMergeWorkerFixture();same.set('A',1);const older=same.merge();same.set('A',2);same.merge();same.pending[0].resolve();
 await progressiveMicrotasksUntil(()=>same.pending.length===2);assert.deepEqual(same.installed.map(p=>p.receipt.nearby.presentationSequence),[1],'Completed useful same-key partial must not starve');
 same.pending[1].resolve();await older;assert.deepEqual(same.installed.map(p=>p.receipt.nearby.presentationSequence),[1,2]);
 const failed=await createActualMergeWorkerFixture();failed.set('A',1);const work=failed.merge();const rejection=assert.rejects(work,/CONTROLLED_PREPARE_FAILURE/);failed.pending[0].reject(Error('CONTROLLED_PREPARE_FAILURE'));await rejection;
 assert.deepEqual(failed.installed,[]);assert.equal(failed.resources.woodlandFineGrass.id,'PRIOR','Failed preparation retains prior installed state');
});


test('populated first tile followed by empty tiles suppresses partial publication churn but completes',async()=>{
 const {createNearbyFineGrassCache}=await loadProgressiveCacheFixture(),seen=[],progress=[];
 const visibleSurface={admitGround:()=>true,ground:{sample(x,z){return Math.floor(x/4)===50&&Math.floor(z/4)===-50?{y:0,slope:0,triangleId:7,owner:'CANONICAL_VISIBLE_TERRAIN'}:null;}},water:{sample:()=>null}};
 const cache=createNearbyFineGrassCache(pkg,{visibleSurface,yieldControl:async()=>{},onProgress:p=>progress.push(p),onPresentation(p,m){seen.push({p,m});}});
 const final=await cache.update(a,{coreRadiusMeters:2,outerRadiusMeters:4});
 assert.ok(final.receipt.contactCount>0);assert.ok(progress.length>2);
 assert.equal(seen.length,2,'Only first content and mandatory final metadata are published');
 assert.deepEqual(progressiveSignature(seen[0].p),progressiveSignature(final));
 assert.equal(seen[0].m.complete,false);assert.equal(seen[1].m.complete,true);
 assert.equal(final.receipt.completedTileCount,final.receipt.requestedTileCount);
 const failing=createNearbyFineGrassCache(pkg,{visibleSurface,yieldControl:async()=>{},onPresentation(p,m){if(m.complete)throw Error('FINAL_AFTER_EMPTY_TILES');}});
 await assert.rejects(failing.update(a,{coreRadiusMeters:2,outerRadiusMeters:4}),/FINAL_AFTER_EMPTY_TILES/);
 assert.match(failing.getReceipt().stickyError,/FINAL_AFTER_EMPTY_TILES/);
});
test('actual merge retains selection for exact same final content but delivers equal-count changed identities',async()=>{
 const f=await createActualMergeWorkerFixture();
 const root={x:200,y:0,z:-200,angle:.1,seed:1,triangleId:7,slope:0,owner:'CANONICAL_VISIBLE_TERRAIN'};
 const tiles=[{id:'NEARBY:50:-50',minX:200,minZ:-200,roots:[root]}];
 f.setPresentation('A',1,tiles);const first=f.merge();f.pending[0].resolve();await first;
 const installed=f.resources.woodlandFineGrass,selection=installed.selection;
 f.setPresentation('A',2,[{...tiles[0],roots:[{...root}]}],true);await f.merge();
 assert.equal(f.pending.length,1,'Identical final content skips selection preparation');
 assert.equal(f.installed.length,1);assert.equal(f.resources.woodlandFineGrass,installed);
 assert.equal(installed.selection,selection);assert.equal(installed.selectionKey,'STATIONARY');
 assert.equal(installed.presentation.receipt.nearby.complete,true);
 assert.equal(installed.presentation.receipt.nearby.presentationSequence,2);
 f.setPresentation('A',3,[{...tiles[0],roots:[{...root,seed:2}]}],true);
 const changed=f.merge();assert.equal(f.pending.length,2,'Equal count changed seed must prepare');f.pending[1].resolve();await changed;
 assert.equal(f.installed.length,2);assert.equal(f.installed[1].tiles[0].roots[0].seed,2);
 f.setPresentation('A',4,[{...tiles[0],roots:[{...root,seed:2}]}],true,2);
 const revision=f.merge();assert.equal(f.pending.length,3,'New request revision is not suppressed');f.pending[2].resolve();await revision;
 assert.equal(f.installed.length,3);
});

}

// Exercise actual renderer refresh and draw intake with controlled async cache dependencies.
async function createActualStartupRadiusFixture({holdMerges=false}={}){
 const path='../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
 const source=await readFile(new URL(path,import.meta.url),'utf8');
 const first=source.indexOf('let nearbyFineUpdateInFlight=null'),draw=source.indexOf('function drawWoodlandFineGrass(packet,maximumParents){',first);
 assert.ok(first>=0&&draw>first);
 const bodyEnd=source.indexOf('const state=resources.woodlandFineGrass;if(!state)return;',draw);
 assert.ok(bodyEnd>draw);
 const actual=source.slice(first,draw)+source.slice(draw,bodyEnd+'const state=resources.woodlandFineGrass;if(!state)return;'.length)+'\n}';
 return Function(`let nearbyFineInitialComplete=false,nearbyFineDesiredKey=null,nearbyFineReady=false;const calls=[],pending=[],progress=[],merges=[];
 const observeVegetation=()=>{};
 const resources={mergeFinePresentation:()=>${holdMerges}?new Promise(resolve=>merges.push(resolve)):Promise.resolve()};
 const nearbyFineCache={update(camera,options){calls.push({camera:{...camera},options:{...options}});return new Promise((resolve,reject)=>pending.push({resolve,reject}));}};
 const fineGrassProgress=p=>{progress.push(p);if(p.phase==='NEARBY_FINE_GRASS_GPU_READY')drawWoodlandFineGrass({camera:{position:{x:200,z:-200}}},1024);};
 ${actual}
 return{calls,pending,progress,merges,resources,refresh:refreshNearbyFineGrass,draw:()=>drawWoodlandFineGrass({camera:{position:{x:200,z:-200}}},1024)};`)();
}
async function startupRadiusMicrotasks(){for(let i=0;i<20;i++)await Promise.resolve();}
test('actual incremental preview draw keeps initial radius until successful initial closure then expands normally',async()=>{
 const f=await createActualStartupRadiusFixture(),initial=f.refresh({x:200,z:-200},{initial:true});
 assert.deepEqual(f.calls.map(c=>c.options),[{coreRadiusMeters:8,outerRadiusMeters:12}]);
 // The public PARTIAL_GPU_READY handler calls the installed preview draw;
 // exercise its actual refresh intake before the initial cache await resolves.
 f.draw();f.draw();await startupRadiusMicrotasks();
 assert.equal(f.calls.length,1,'Partial preview must not supersede initial 8/12m with full 24/32m');
 f.pending[0].resolve({receipt:{contactCount:100}});await initial;await startupRadiusMicrotasks();
 assert.equal(f.progress.filter(p=>p.phase==='NEARBY_FINE_GRASS_GPU_READY').length,1);
 assert.deepEqual(f.calls.map(c=>c.options),[{coreRadiusMeters:8,outerRadiusMeters:12},{coreRadiusMeters:24,outerRadiusMeters:32}], 'Existing ready preview may request full detail only after initial succeeds');
});
test('failed initial closure contains full-radius draw refresh without establishing retry recovery',async()=>{
 const f=await createActualStartupRadiusFixture(),initial=f.refresh({x:200,z:-200},{initial:true});
 const rejected=assert.rejects(initial,/CONTROLLED_INITIAL_FAILURE/);f.pending[0].reject(Error('CONTROLLED_INITIAL_FAILURE'));await rejected;
 f.draw();await startupRadiusMicrotasks();
 assert.equal(f.calls.length,1,'Failed initial request retains initial-radius mode');
 assert.equal(f.progress.filter(p=>p.phase==='NEARBY_FINE_GRASS_GPU_READY').length,0);
});

test('movement-superseded initial await cannot bypass initial radius through default refresh',async()=>{
 const f=await createActualStartupRadiusFixture();
 const original=f.refresh({x:196,z:-200},{initial:true});
 f.draw();assert.equal(f.calls.length,2,'Preview movement starts a new initial camera cell');
 f.pending[0].resolve({receipt:{contactCount:100}});await original;
 assert.equal(f.progress.filter(p=>p.phase==='NEARBY_FINE_GRASS_GPU_READY').length,0,'Stale original closure does not complete initialization');
 // The upload caller resumes after its original await and calls the default refresh.
 const resumed=f.refresh({x:196,z:-200});
 assert.deepEqual(f.calls.map(c=>c.options),Array.from({length:3},()=>({coreRadiusMeters:8,outerRadiusMeters:12})), 'Default refresh remains initial while no current initial closure succeeded');
 f.pending[1].resolve({receipt:{contactCount:100}});await startupRadiusMicrotasks();
 assert.equal(f.progress.filter(p=>p.phase==='NEARBY_FINE_GRASS_GPU_READY').length,0);
 f.pending[2].resolve({receipt:{contactCount:100}});await resumed;await startupRadiusMicrotasks();
 assert.equal(f.progress.filter(p=>p.phase==='NEARBY_FINE_GRASS_GPU_READY').length,1);
 assert.deepEqual(f.calls[3].options,{coreRadiusMeters:24,outerRadiusMeters:32},'Full radius unlocks after current initial merge succeeds');
});

test('same-key A-B-A request cannot unlock startup through an obsolete yielding merge',async()=>{
 const f=await createActualStartupRadiusFixture({holdMerges:true});
 const first=f.refresh({x:200,z:-200},{initial:true});
 f.pending[0].resolve({receipt:{contactCount:100}});await startupRadiusMicrotasks();
 assert.equal(f.merges.length,1,'First A is waiting in merge');
 const middle=f.refresh({x:204,z:-200},{initial:true});
 const latest=f.refresh({x:200,z:-200},{initial:true});
 f.pending[1].resolve({receipt:{contactCount:100}});await middle;
 f.pending[2].resolve({receipt:{contactCount:100}});await startupRadiusMicrotasks();
 assert.equal(f.merges.length,2,'Latest A is independently waiting in merge');
 f.merges[0]();await first;await startupRadiusMicrotasks();
 assert.equal(f.progress.filter(p=>p.phase==='NEARBY_FINE_GRASS_GPU_READY').length,0,'Obsolete first A cannot unlock initialization despite the matching latest key');
 f.draw();assert.equal(f.calls.length,3,'Draw remains coalesced with current initial A');
 f.merges[1]();await latest;await startupRadiusMicrotasks();
 assert.equal(f.progress.filter(p=>p.phase==='NEARBY_FINE_GRASS_GPU_READY').length,1);
 assert.deepEqual(f.calls[3].options,{coreRadiusMeters:24,outerRadiusMeters:32},'Only latest successful A unlocks full radius');
});


test('actual probe summaries preserve full identities while two bounded samples fit trace event budget',async()=>{
 const {summarizeVegetationRoots,createVegetationContinuityTrace}=await loadDiagnosticWoodlandFixture();
 const source=await readFile(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const helper=source.split('\n').find(line=>line.includes('const summarizeDiagnosticRoots='));
 const diagnosticRootOwners=new WeakMap();
 const summarize=Function('summarizeVegetationRoots','diagnosticRootOwners',helper+';return summarizeDiagnosticRoots;')(summarizeVegetationRoots,diagnosticRootOwners);
 assert.match(source,/installedFine:summarizeDiagnosticRoots\(nearby\([^\n]*\),64\)/);
 assert.match(source,/selectedFine:summarizeDiagnosticRoots\(selectedNearby\(\),64\)/);
 const roots=Array.from({length:180},(_,i)=>({x:200.123456789+i*.22,y:12.123456789,z:-200.123456789+i*.013,seed:(4294967295-i)>>>0,owner:'CANONICAL_VISIBLE_TERRAIN'}));
 for(const root of roots)diagnosticRootOwners.set(root,'APPROVED_WOODLAND');
 const full=summarize(roots),bounded=summarize(roots,64);
 for(const key of ['rootCount','digest','membershipDigest'])assert.equal(bounded[key],full[key]);
 assert.equal(bounded.sample.length,64);assert.equal(bounded.truncatedRootCount,roots.length-64);
 const details={enabled:true,x:200,z:-200,radius:8,installedFine:bounded,selectedFine:bounded,visiblePixelsVerified:false};
 assert.ok(JSON.stringify(details).length<=32768);
 const trace=createVegetationContinuityTrace();assert.equal(trace.record('EXPLICIT_GROUND_PROBE',details),true);assert.equal(trace.summary().observerErrorCount,0);
});


test('trace rejections retain bounded fixed reasons without copying error strings',async()=>{
 const {createVegetationContinuityTrace}=await loadDiagnosticWoodlandFixture();
 const trace=createVegetationContinuityTrace();
 assert.equal(trace.record('OVERSIZED',{payload:'x'.repeat(32769)}),false);
 assert.equal(trace.record('',{}),false);
 const circular={};circular.self=circular;assert.equal(trace.record('CIRCULAR',circular),false);
 const summary=trace.summary();assert.equal(summary.observerErrorCount,3);assert.equal(summary.droppedCount,3);
 assert.deepEqual(summary.rejectionReasonCounts,{TYPE_INVALID:1,TIME_INVALID:0,EVENT_TOO_LARGE:1,COPY_OR_RECORD_FAILED:1});
 summary.rejectionReasonCounts.EVENT_TOO_LARGE=999;assert.equal(trace.summary().rejectionReasonCounts.EVENT_TOO_LARGE,1);
 const invalidClock=createVegetationContinuityTrace({now:()=>NaN});assert.equal(invalidClock.record('INVALID_CLOCK'),false);assert.equal(invalidClock.summary().rejectionReasonCounts.TIME_INVALID,1);
});


test('shared rendered beach formula and provider retain exact indexed attributes and fail closed',async()=>{
 const {renderedBeachCoverage,createRenderedBeachProvider}=await load('../../showroom/globe/h-earth/render/rendered-beach-signal.v1.js');
 const part={partId:'BASE',owner:'CANONICAL_VISIBLE_TERRAIN',positions:new Float32Array([0,0,0,4,2,0,0,4,4]),indices:new Uint32Array([0,1,2]),normals:new Float32Array([0,1,0,.8660254,.5,0,0,.6,.8]),coastDistances:new Float32Array([4,20,60]),contactDistances:new Float32Array([2,16,40])};
 const support={partId:'BASE',surfaceRevision:1,owner:part.owner,y:1.5,triangleOffset:0,vertexIndices:[0,1,2],barycentricWeights:[.5,.25,.25]};
 const provider=createRenderedBeachProvider({surfaceRevision:1,parts:[part]}),actual=provider.sample({x:1,z:1,support});
 assert.equal(actual.valid,true);assert.equal(actual.worldY,1.5);assert.equal(actual.interpolatedCanonicalCoastDistance,22);assert.equal(actual.interpolatedExposedContactDistance,15);
 assert.equal(actual.rawSandCoverage,renderedBeachCoverage({contactDistance:15,coastDistance:22,worldY:1.5,normal:[part.normals[0]*.5+part.normals[3]*.25+part.normals[6]*.25,part.normals[1]*.5+part.normals[4]*.25+part.normals[7]*.25,part.normals[2]*.5+part.normals[5]*.25+part.normals[8]*.25]}));
 assert.equal(provider.sample({x:1,z:1,support:{...support,surfaceRevision:2}}).valid,false);
 assert.equal(createRenderedBeachProvider({surfaceRevision:1,parts:[{...part,normals:null}]}).sample({x:1,z:1,support}).valid,false);
 assert.equal(renderedBeachCoverage({contactDistance:140,coastDistance:140,worldY:1,normal:[0,1,0]}),0);
});
test('pilot owner commits once only after complete validated upload and final GL success, including empty habitat',async()=>{
 const {createPilotCoverageOwner}=await load('../../showroom/globe/h-earth/render/rendered-beach-signal.v1.js');
 const owner=createPilotCoverageOwner({contains:isPoint=>isPoint===0});
 for(const proof of [{},{uploadComplete:true,coverageValidated:true},{uploadComplete:false,coverageValidated:true,glError:0},{uploadComplete:true,coverageValidated:true,glError:1282}]){assert.equal(owner.commit(proof),false);assert.equal(owner.shouldDrawPilot(),true);assert.equal(owner.suppressUniform(0,0),true);}
 assert.equal(owner.commit({uploadComplete:true,coverageValidated:true,glError:0}),true);
 assert.equal(owner.shouldDrawPilot(),false);assert.equal(owner.suppressUniform(0,0),false);assert.equal(owner.commit({uploadComplete:true,coverageValidated:true,glError:0}),false);assert.equal(owner.getReceipt().transitionCount,1);
});
test('shared replacement admission rejects beach, missing evidence, future water and bare banks without a rectangle mask',async()=>{
 const {createUniformGroundAdmission}=await load('../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js');
 const cfg=config();let signal={valid:true,rawSandCoverage:0};cfg.visibleSurface.beach={sample:()=>signal};
 const admit=await createUniformGroundAdmission(cfg),x=-55,z=-315,s=sampleGround(x,z);
 assert.equal(admit(x,z,s),true);signal={valid:true,rawSandCoverage:.9175581216095148};assert.equal(admit(x,z,s),false);
 signal={valid:false,reason:'SOURCE_MISSING'};assert.throws(()=>admit(x,z,s),/EVIDENCE_UNAVAILABLE/);
 signal={valid:true,rawSandCoverage:0};cfg.geology.sampleWaterAt=()=>({y:s.y-.03});assert.equal(admit(x,z,s),false);
 assert.equal(admit.getReceipt().rectangleMask,false);assert.ok(admit.getReceipt().rejections.FUTURE_WATER>0);
});

async function buildCanonicalBeachFixture({baseDirectory,pkg,geology,uploadSource,protectedReferenceAt}){
 assert.equal(typeof protectedReferenceAt,'function','Declare the protected reference policy for this fixture');
 const render=baseDirectory+'showroom/globe/h-earth/render/';
 const source=await readFile(render+'persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','utf8');
 const {createRenderedBeachProvider}=await import('file://'+render+'rendered-beach-signal.v1.js');
 const {buildVegetationVisibleSurface}=await import('file://'+render+'vegetation-visible-surface.v1.js');
 const terrain=await import('file://'+baseDirectory+'h-earth-3d/terrain/h-earth.terrain-field.js');
 const contactCode=source.slice(source.indexOf('function* createExposedWaterContactFieldSteps'),source.indexOf('async function createExposedWaterContactFieldAsync'));
 assert.ok(contactCode.startsWith('function* createExposedWaterContactFieldSteps'));
 const makeContact=Function(contactCode+';return createExposedWaterContactField;')();
 const coastCode=uploadSource.slice(uploadSource.indexOf('const COAST_MIN_X'),uploadSource.indexOf('const freezeRecord')).replace('export function','function');
 const coastAt=Function('getHEarthCanonicalShorelineZ',coastCode+';return getHEarthSignedCoastDistanceMeters;')(terrain.getHEarthCanonicalShorelineZ);
 const decimalCode=uploadSource.slice(uploadSource.indexOf('function canonicalDecimal'),uploadSource.indexOf('function canonicalFloat32'));
 const decimal=Function('finite','H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION',decimalCode+';return canonicalDecimal;')(Number.isFinite,{decimalPlaces:6});
 const positions=Float32Array.from(pkg.buffers.positions),indices=Uint32Array.from(pkg.buffers.indices);
 const normals=Float32Array.from(Float32Array.from(pkg.buffers.normals),decimal);
 const field=makeContact({positions,indices},pkg.primitiveSpans),coastDistances=new Float32Array(positions.length/3);
 for(const span of pkg.primitiveSpans){
  if(span.role!=='TERRAIN'&&span.primitiveId!=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION')continue;
  for(let id=span.vertexStart;id<span.vertexStart+span.vertexCount;id++){
   const x=positions[id*3],y=positions[id*3+1],z=positions[id*3+2],h=Math.hypot(x,z),scale=h>Number.EPSILON?Math.atan2(h,y+420000)*420000/h:0;
   coastDistances[id]=coastAt(x*scale,z*scale);
  }
 }
 const normalStart=source.indexOf('const normals=new Float32Array(n*3);');
 const normalEnd=source.indexOf('const colors=new Float32Array(n*4)',normalStart);
 assert.ok(normalStart>=0&&normalEnd>normalStart);
 const makeGeoNormals=Function('positions','indices','n','role',source.slice(normalStart,normalEnd)+';return normals;');
 const geologyAttributes=geology.meshes.map(({role,mesh})=>{
  const n=mesh.vertexCount??mesh.positions.length/3,coastDistances=new Float32Array(n),contactDistances=new Float32Array(n);
  coastDistances.fill(140);contactDistances.fill(140);
  return {positions:mesh.positions,indices:mesh.indices,normals:makeGeoNormals(mesh.positions,mesh.indices,n,role),coastDistances,contactDistances};
 });
 assert.ok(source.includes('coast.fill(140);contact.fill(140);'));
 const base={positions,indices,normals,coastDistances,contactDistances:field.packageDistances};
 const visibleSurface=buildVegetationVisibleSurface(pkg,{geology,renderedAttributes:{base,geology:geologyAttributes},beachProviderFactory:createRenderedBeachProvider,protectedReferenceAt,surfaceRevision:1});
 return {visibleSurface,field,baseAttributes:base,geologyAttributes,limits:['Canonical base and geological exterior only; no current camera refinement','CPU source evaluation; not GPU raster acceptance']};
}


test('actual protected reference admission uses the same uploaded Float32 clearing bounds',async()=>{
 const source=await readFile(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const start=source.indexOf('const protectedReferenceAt=(x,y,z)=>{'),end=source.indexOf('const visibleSurface=buildVegetationVisibleSurface',start);assert.ok(start>=0&&end>start);
 const uploaded=new Float32Array([-156.1234567,-242.1234567,-124.1234567,-210.1234567]);
 const actual=Function('resources','planetRadius','unprojectPlanetVertex',source.slice(start,end)+';return protectedReferenceAt;')({clearing:{bounds:uploaded}},420000,(x,y,z)=>({x,z}));
 let lo=0,hi=1;for(let i=0;i<60;i++){const mid=(lo+hi)/2;if(mid*mid*(3-2*mid)<.99999)lo=mid;else hi=mid;}
 const threshold=hi*1.5,z=(uploaded[1]+uploaded[3])/2;
 assert.equal(actual(uploaded[0]+threshold+1e-8,0,z),true);
 assert.equal(actual(uploaded[0]+threshold-1e-8,0,z),false);
 assert.equal(actual(uploaded[0],0,z),false);
});


test('global archive submission mask precedes visibility budgets and cannot leak through partition IDs',async()=>{
 const source=await readFile(new URL('../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js',import.meta.url),'utf8');
 const fixture='const H_EARTH_PLANETARY_WORLD_FRAME={exactSphereRadius:420000};\n'+source.replace(/^import[^\n]+\n/gm,'');
 const {selectHEarthGlobalGroundCoverDraws,partitionHEarthMeadowSelectedInstances,selectHEarthMeadowMidDistancePatchDraws}=await import('data:text/javascript;base64,'+Buffer.from(fixture).toString('base64'));
 const cover={records:new Float32Array(5*20),admittedRecords:new Uint8Array([0,1,0,1,1]),tiles:[{start:0,count:5,minX:-1,maxX:1,minZ:-1,maxZ:1,ecoInstances:0}],receipt:{instanceCount:5}};
 const selected=selectHEarthGlobalGroundCoverDraws(cover,{x:0,z:0},{maximumInstances:2,maximumDraws:1});
 assert.equal(selected.visibleInstanceCount,2);assert.deepEqual(selected.draws[0].ids,[1,4],'Rejected archive slots do not consume the budget or renumber remaining records');
 const partition=partitionHEarthMeadowSelectedInstances(cover,selected,{disabled:true,clumps:[]});assert.deepEqual(Array.from(partition.ids),[1,4]);
 const lod=selectHEarthMeadowMidDistancePatchDraws(cover,{x:0,z:0},{sourceDraws:selected.draws,centerX:0,centerZ:0,maximumInstances:1});assert.equal(lod.draws.length,1);assert.deepEqual(lod.draws[0].ids,[1]);
 const untrusted=partitionHEarthMeadowSelectedInstances(cover,{draws:[{start:0,count:5,stride:1}]},{disabled:true,clumps:[]});assert.deepEqual(Array.from(untrusted.ids),[1,3,4],'Submission mask is rechecked at final partition');
});
