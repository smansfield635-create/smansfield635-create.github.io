import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {
  planImmutableTiles, detailWeight, selectFineTiles, createSingleOwnerVegetation,
} from '../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';

function root(x,z,seed=.25){return {x,y:2,z,angle:.5,seed,triangleId:12,slope:.1};}
function presentation(){return {tiles:[
  {id:'west',minX:-4,minZ:0,roots:[root(-3,1),root(-1,3,.75)]},
  {id:'east',minX:0,minZ:0,roots:[root(1,1,.5)]},
  {id:'far',minX:100,minZ:100,roots:[root(101,101,.1)]},
],receipt:{contactCount:4}};}

test('tile planning retains all root identities in finite immutable upload buffers',()=>{
  const input=presentation(),before=structuredClone(input),tiles=planImmutableTiles(input);
  assert.equal(tiles.length,3);assert.equal(tiles.reduce((n,t)=>n+t.count,0),4);
  const ids=tiles.flatMap(t=>t.rootIds);assert.equal(new Set(ids).size,4);
  for(const tile of tiles){assert.ok(tile.packed instanceof Float32Array);assert.ok(tile.packed.every(Number.isFinite));assert.equal(tile.rootIds.length,tile.count);}
  assert.deepEqual(input,before);
});
test('planning snapshots root records independently from later input mutation',()=>{
  const input=presentation(),tiles=planImmutableTiles(input),before=tiles.map(t=>Array.from(t.packed));
  input.tiles[0].roots[0].x=999;input.tiles[0].roots.push(root(2,2));
  assert.deepEqual(tiles.map(t=>Array.from(t.packed)),before);
});
test('forward-return selection uses same immutable tiles and exact root identities',()=>{
  const tiles=planImmutableTiles(presentation()),before=tiles.map(t=>({id:t.id,roots:[...t.rootIds],data:Array.from(t.packed)}));
  const route=[{x:-3,z:1},{x:20,z:1},{x:50,z:1},{x:20,z:1},{x:-3,z:1}];
  const selected=route.map(camera=>selectFineTiles(tiles,camera));
  assert.deepEqual(selected[0].map(t=>t.rootIds),selected.at(-1).map(t=>t.rootIds));
  assert.deepEqual(selected[1].map(t=>t.rootIds),selected[3].map(t=>t.rootIds));
  assert.ok(selected.flat().every(t=>tiles.includes(t)),'selection references original immutable tile');
  assert.deepEqual(tiles.map(t=>({id:t.id,roots:[...t.rootIds],data:Array.from(t.packed)})),before);
});
test('detail fades continuously between full fourteen and zero twenty-four meters',()=>{
  for(const d of [0,1,13.999,14])assert.equal(detailWeight(d),1);
  for(const d of [24,24.001,100])assert.equal(detailWeight(d),0);
  let previous=1;
  for(let d=14;d<=24;d+=.01){const value=detailWeight(d);assert.ok(value>=0&&value<=1);assert.ok(value<=previous+1e-12);assert.ok(Math.abs(value-previous)<.01);previous=value;}
  assert.ok(Math.abs(detailWeight(14+1e-6)-1)<1e-5);assert.ok(detailWeight(24-1e-6)<1e-5);
});
test('fine selection uses nearest tile boundary rather than tile center',()=>{
  const tiles=planImmutableTiles({tiles:[{id:'edge',minX:0,minZ:0,roots:[root(1,1)]}],receipt:{contactCount:1}});
  assert.equal(selectFineTiles(tiles,{x:27.99,z:2}).length,1);
  assert.equal(selectFineTiles(tiles,{x:28,z:2}).length,0);
});
test('empty presentation cannot claim an installed owner',()=>{assert.throws(()=>planImmutableTiles({tiles:[],receipt:{contactCount:0}}));});
test('duplicate tile identifiers are rejected',()=>{const p=presentation();p.tiles[1].id=p.tiles[0].id;assert.throws(()=>planImmutableTiles(p));});
test('duplicate root records cannot acquire separate presentation ownership',()=>{const p=presentation();p.tiles[0].roots.push({...p.tiles[0].roots[0]});p.receipt.contactCount++;assert.throws(()=>planImmutableTiles(p));});
for(const key of ['x','y','z','angle','seed','slope'])test(`nonfinite ${key} rejected before buffer upload`,()=>{const p=presentation();p.tiles[0].roots[0][key]=NaN;assert.throws(()=>planImmutableTiles(p));});
test('declared contact count must match actual records',()=>{const p=presentation();p.receipt.contactCount++;assert.throws(()=>planImmutableTiles(p));});

function ownerPresentation(){return {tiles:[
 {id:'control',minX:-140,minZ:-196,roots:[root(-139.4,-194.5),root(-139,-195,.5)]},
 {id:'remote',minX:100,minZ:100,roots:[root(101,101,.75)]},
],receipt:{contactCount:3}};}
function fakeGL(){
 let next=0,buffer=null,offset=0,fine=0;const uploads=[],draws=[],deletions=[],colors=[];
 const gl=new Proxy({ARRAY_BUFFER:1,STATIC_DRAW:2,FLOAT:3,TRIANGLES:4,VERTEX_SHADER:5,FRAGMENT_SHADER:6,COMPILE_STATUS:7,LINK_STATUS:8,
  createShader:()=>({kind:'shader',id:++next}),createProgram:()=>({kind:'program',id:++next}),createVertexArray:()=>({kind:'vao',id:++next}),createBuffer:()=>({kind:'buffer',id:++next}),
  getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:(_p,name)=>name,
  bindBuffer:(_target,value)=>{buffer=value;},bufferData:(_target,data)=>{uploads.push({kind:'allocate',buffer,bytes:typeof data==='number'?data:data.byteLength});},
  bufferSubData:(_target,start,data)=>{uploads.push({kind:'upload',buffer,start,data:Array.from(data),bytes:data.byteLength});},
  vertexAttribPointer:(_loc,_size,_type,_normalized,_stride,start)=>{offset=start;},
  uniform1i:(name,value)=>{if(name==='uFine')fine=value;},drawArraysInstanced:(_mode,_first,vertices,count)=>{draws.push({buffer,offset,fine,vertices,count});},
  uniform3fv:(name,value)=>{assert.equal(value.length,3,'vec3 requires exactly RGB');assert.ok(Array.from(value).every(Number.isFinite));colors.push({name,value:Array.from(value)});},
  deleteBuffer:value=>deletions.push(value),deleteShader:value=>deletions.push(value),deleteProgram:value=>deletions.push(value),deleteVertexArray:value=>deletions.push(value),
 },{get:(target,name)=>name in target?target[name]:(()=>{})});
 return {gl,uploads,draws,deletions,colors};
}
const environment={sunDirection:{x:0,y:1,z:0},sunColor:[1,1,1],groundHazeColor:[.5,.6,.7],sunIntensity:1,fogStartDistance:100,fogFalloff:.001,maximumFogFactor:.6};
const packet=(x,z)=>({camera:{position:{x,y:4,z},viewProjectionMatrix:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}});
test('actual RGBA environment uploads only normalized RGB to vec3 uniforms',async()=>{
 const f=fakeGL();const owner=await createSingleOwnerVegetation(f.gl,ownerPresentation(),{environment:{...environment,sunColor:[255,244,230,255],groundHazeColor:[174,200,208,255]},planetRadius:6200000});
 assert.deepEqual(f.colors,[{name:'uSunColor',value:[1,244/255,230/255]},{name:'uHaze',value:[174/255,200/255,208/255]}]);owner.dispose();
});
test('RGBA alpha does not alter normalized RGB channel scale',async()=>{
 const f=fakeGL();const owner=await createSingleOwnerVegetation(f.gl,ownerPresentation(),{environment:{...environment,sunColor:[.5,.6,.7,255],groundHazeColor:[.2,.3,.4,255]},planetRadius:6200000});
 assert.deepEqual(f.colors,[{name:'uSunColor',value:[.5,.6,.7]},{name:'uHaze',value:[.2,.3,.4]}]);owner.dispose();
});
test('object RGB environment retains its three channel contract',async()=>{
 const f=fakeGL();const owner=await createSingleOwnerVegetation(f.gl,ownerPresentation(),{environment:{...environment,sunColor:{r:255,g:128,b:0},groundHazeColor:{r:.2,g:.3,b:.4}},planetRadius:6200000});
 assert.deepEqual(f.colors,[{name:'uSunColor',value:[1,128/255,0]},{name:'uHaze',value:[.2,.3,.4]}]);owner.dispose();
});
test('owner uploads exactly once, retains all coarse roots, and returns same fine roots',async()=>{
 const f=fakeGL(),p=ownerPresentation(),before=structuredClone(p),owner=await createSingleOwnerVegetation(f.gl,p,{environment,planetRadius:6200000});
 const uploadCount=f.uploads.length,receipt=owner.getReceipt(),coarse=[];
 assert.equal(receipt.installedRootCount,3);assert.equal(receipt.coarseRootCount,3);assert.equal(receipt.rootOwnerCount,1);
 assert.equal(f.uploads.filter(x=>x.kind==='allocate').length,1);assert.equal(f.uploads.reduce((n,u)=>n+(u.kind==='upload'?u.bytes:0),0),48);
 const frameDraws=[];
 for(const [x,z] of [[-139,-195],[-110,-195],[0,0],[-110,-195],[-139,-195]]){
  const start=f.draws.length;owner.draw(packet(x,z));frameDraws.push(f.draws.slice(start));coarse.push(f.draws[start]);
 }
 assert.equal(f.uploads.length,uploadCount,'no camera-dependent GPU upload');
 assert.ok(coarse.every(d=>d.fine===0&&d.count===3&&d.offset===0&&d.vertices===6));
 assert.deepEqual(frameDraws[0],frameDraws.at(-1));assert.deepEqual(frameDraws[1],frameDraws[3]);
 assert.ok(f.draws.every(d=>d.buffer===f.uploads[0].buffer),'coarse/fine share the same root buffer');
 assert.equal(owner.getReceipt().perFrameUploadBytes,0);assert.deepEqual(p,before);
 owner.dispose();assert.equal(owner.getReceipt().disposed,true);const deleted=f.deletions.length;
 assert.equal(deleted,5,'one buffer, one VAO, one program and two shaders freed');
 owner.dispose();assert.equal(f.deletions.length,deleted);assert.throws(()=>owner.draw(packet(-139,-195)));
});
test('float32-overflow input fails before any GL resources are created',async()=>{
 const p=ownerPresentation();p.tiles[0].roots[0].y=Number.MAX_VALUE;
 const f=fakeGL();await assert.rejects(createSingleOwnerVegetation(f.gl,p,{environment,planetRadius:6200000}));
 assert.equal(f.uploads.length,0);
});
test('tile upload budget rejects more than 1600 roots before processing root records',()=>{
 const p={tiles:[{id:'oversized',minX:0,minZ:0,roots:Array(1601).fill(null)}],receipt:{contactCount:1601}};
 assert.throws(()=>planImmutableTiles(p),/TILE_ROOT_BUDGET_EXCEEDED/);
});
test('total immutable population cannot exceed 7.2MB packed-root budget',()=>{
 const tiles=Array.from({length:282},(_,t)=>({id:`tile-${t}`,minX:t*4,minZ:0,
  roots:Array.from({length:1600},(_,i)=>root(t*4+(i%40)*.1,Math.floor(i/40)*.1,.25))}));
 assert.throws(()=>planImmutableTiles({tiles,receipt:{contactCount:451200}}),/POPULATION_GPU_BUDGET_EXCEEDED/);
});
test('owner rejects empty fixed control before allocating GPU resources',async()=>{
 const f=fakeGL();await assert.rejects(createSingleOwnerVegetation(f.gl,presentation(),{environment,planetRadius:6200000}),/EMPTY_FIXED_CONTROL/);
 assert.equal(f.uploads.length,0,'no upload for unusable control');
});
test('shader failure releases objects created during failed preparation',async()=>{
 const f=fakeGL();f.gl.getShaderParameter=()=>false;
 await assert.rejects(createSingleOwnerVegetation(f.gl,ownerPresentation(),{environment,planetRadius:6200000}),/OWNER_SHADER/);
 assert.equal(f.deletions.length,2,'failed shader plus program are deleted');
});
test('renderer seam selects replacement only for admitted exact option and deferred base',()=>{
 const source=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const guards=source.match(/  if\(vegetationStrategy!==null[\s\S]*?  if \(!\(canvas instanceof/)?.[0].replace(/  if \(!\(canvas instanceof$/,'');
 assert.ok(guards);
 const check=(vegetationStrategy,deferVegetation)=>vm.runInNewContext(guards,{vegetationStrategy,deferVegetation});
 assert.doesNotThrow(()=>check(null,false));assert.doesNotThrow(()=>check(null,true));
 assert.doesNotThrow(()=>check('SINGLE_OWNER_WOODLAND_V1',true));
 assert.throws(()=>check('SINGLE_OWNER_WOODLAND_V1',false),/PROTOTYPE_REQUIRES_DEFERRED_BASE/);
 for(const option of ['single_owner_woodland_v1','',true,{}])assert.throws(()=>check(option,true),/VEGETATION_STRATEGY_INVALID/);
 const dispatch=source.match(/    if\(vegetationStrategy\)\{\n      resources.singleOwnerVegetation[\s\S]*?\}else drawGlobalCover\(packet\);/)?.[0];assert.ok(dispatch);
 for(const selected of [null,'SINGLE_OWNER_WOODLAND_V1']){
  let owner=0,legacy=0;const gl=new Proxy({},{get:()=>()=>{}});
  vm.runInNewContext(dispatch,{vegetationStrategy:selected,resources:{singleOwnerVegetation:{draw:()=>owner++}},gl,packet:{},drawGlobalCover:()=>legacy++});
  assert.equal(owner,selected?1:0);assert.equal(legacy,selected?0:1);
 }
});
test('upload exception frees all allocated owner objects',async()=>{
 const f=fakeGL();f.gl.bufferSubData=()=>{throw Error('SIMULATED_UPLOAD_FAILURE');};
 await assert.rejects(createSingleOwnerVegetation(f.gl,ownerPresentation(),{environment,planetRadius:6200000}),/SIMULATED_UPLOAD_FAILURE/);
 assert.equal(f.deletions.length,5);
});
test('program link failure frees program and both compiled shaders',async()=>{
 const f=fakeGL();f.gl.getProgramParameter=()=>false;
 await assert.rejects(createSingleOwnerVegetation(f.gl,ownerPresentation(),{environment,planetRadius:6200000}),/OWNER_LINK/);
 assert.equal(f.deletions.length,3);
});



// Execute the actual route orchestration, substituting only its browser/GPU dependencies.
async function executeEntrance({pathname='/showroom/globe/h-earth/',search='',failPreparation=false,earlyProposal=false}={}){
 const source=readFileSync(new URL('../../showroom/globe/h-earth/vegetation-prototype/route.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
 const rootNode={dataset:{}},statusNode={textContent:''},events=[],wheelEvents=[],historyChanges=[];
 const location={pathname,search,hash:'#world'};let proposal=null,state=null,presents=0;
 const vegetation={controlRoots:['fixed-root'],installedRootCount:1,selectedFineRoots:1,drawCallCount:1,coarseRootCount:1,coarseTiles:1,perFrameUploadBytes:0};
 const canvas={style:{},clientWidth:640,clientHeight:360,dispatchEvent(event){
  wheelEvents.push(event);state={...state,sequence:state.sequence+1,position:{...state.position,z:state.position.z+(event.deltaY<0?-4:4)}};proposal({},state);
 }};
 const window={dispatchEvent:event=>events.push(event)};
 let initialized=false;
 const renderer={getResourceReceipt:()=>({singleOwnerVegetation:vegetation,counters:{}}),renderFrame:()=>{assert.equal(initialized,true,'never render before initialization');},presentColorFrame:()=>presents++,initialize:async()=>{initialized=true;},prepareReplacementVegetation:async()=>{if(failPreparation)throw Error('SIMULATED_PREPARATION_FAILURE');return {installed:true};}};
 const context={window,location,URLSearchParams,document:{getElementById:id=>id==='prototype-status'?statusNode:id==='h-earth-functional-landscape-canvas'?canvas:rootNode},
  performance:{now:()=>0},history:{state:{existing:true},replaceState(_state,_title,url){historyChanges.push(url);location.search=new URL(url,'https://example.test').search;}},
  setTimeout:callback=>{callback();},WheelEvent:class{constructor(type,options){Object.assign(this,{type},options);}},CustomEvent:class{constructor(type,options){Object.assign(this,{type},options);}},
  console:{error:()=>{}},prepareHEarthRun8ER2CanonicalLiveRenderPackage:async()=>{},
  createHEarthRun8ER3AFrameUniformPacket:({navigationState})=>({camera:{position:navigationState.position}}),
  installHEarthRun8ER3D2PointerTouchIntake:({onProposal})=>{proposal=onProposal;const woodland=new URLSearchParams(location.search).get('arrival')==='approved-four-trees';
   state={position:{x:woodland?-139.40267987050615:0,y:4,z:woodland?-194.5:0},yawDegrees:0,pitchDegrees:0,sequence:0};
   return {getNavigationState:()=>state,getReceipt:()=>({currentNavigationState:state})};},
  createHEarthRun8ER3CPersistentRenderer:async()=>{if(earlyProposal){assert.equal(canvas.style.pointerEvents,'none');proposal({},state);}return renderer;}};
 await vm.runInNewContext(`(async()=>{${source}\n})()`,context);
 return {rootNode,statusNode,window,wheelEvents,historyChanges,events,get presents(){return presents;},move(){state={...state,sequence:state.sequence+1,position:{...state.position,z:state.position.z-2}};proposal({},state);}};
}
test('public root without query starts woodland, emits ready and never synthesizes movement',async()=>{
 const result=await executeEntrance();
 assert.equal(result.rootNode.dataset.run8eReady,'true');assert.equal(result.wheelEvents.length,0);
 assert.equal(result.events.filter(event=>event.type==='h-earth-run8e-ready').length,1);
 const receipt=result.window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt();
 assert.equal(receipt.mode,'manual-public');assert.equal(receipt.automaticNavigation,false);assert.equal(receipt.eligible,true);
 assert.equal(receipt.singleOwnerVegetationQualification,null,'manual startup makes no replay qualification claim');
 assert.equal(receipt.intake.currentNavigationState.position.z,-194.5);
 assert.equal(receipt.intake.currentNavigationState.sequence,0);
 const before=result.presents;result.move();assert.equal(result.presents,before+1,'real intake navigation presents another frame');
});
test('public arrival selection preserves unrelated URL parameters and hash',async()=>{
 const result=await executeEntrance({search:'?visual=terrain-relief-v2&other=retained'});
 const url=new URL(result.historyChanges[0],'https://example.test');
 assert.equal(url.searchParams.get('arrival'),'approved-four-trees');assert.equal(url.searchParams.get('visual'),'terrain-relief-v2');assert.equal(url.searchParams.get('other'),'retained');assert.equal(url.hash,'#world');
});
test('diagnostic page retains exact synthetic forward-return replay and no public URL rewrite',async()=>{
 const result=await executeEntrance({pathname:'/showroom/globe/h-earth/vegetation-prototype.html',search:'?prototype=single-owner-v1&arrival=approved-four-trees'});
 assert.equal(result.historyChanges.length,0);assert.equal(result.wheelEvents.length,16);
 const receipt=result.window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt();assert.equal(receipt.eligible,true);
 assert.equal(receipt.singleOwnerVegetationQualification.result,'CAPTURED_POPULATED_CONTINUITY');assert.equal(receipt.singleOwnerVegetationQualification.returnDistanceMeters,0);
});
test('diagnostic replay still rejects missing explicit prototype selection',async()=>{
 const result=await executeEntrance({pathname:'/showroom/globe/h-earth/vegetation-prototype.html'});
 assert.equal(result.rootNode.dataset.run8eError,'true');assert.equal(result.wheelEvents.length,0);assert.equal(result.events.length,0);
});
test('failed public preparation does not announce readiness or initiate movement',async()=>{
 const result=await executeEntrance({failPreparation:true});
 assert.equal(result.rootNode.dataset.run8eError,'true');assert.notEqual(result.rootNode.dataset.run8eReady,'true');assert.equal(result.wheelEvents.length,0);assert.equal(result.events.length,0);assert.equal(result.window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt().eligible,false);
});
test('canonical HTML starts only single-owner entrance and preserves import identity map',()=>{
 const html=readFileSync(new URL('../../showroom/globe/h-earth/index.html',import.meta.url),'utf8');
 const scripts=[...html.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g)].map(match=>match[1]);
 assert.deepEqual(scripts,['./vegetation-prototype/route.js?rev=gen2791-single-owner-public-v1']);
 assert.ok(html.includes('type="importmap"'));assert.ok(!html.includes('data-h-earth-public-route'));
 assert.ok(!html.includes('public-live-gpu-integration.run8e-r3e'));
});

test('manual public intake proposals cannot render before initialization',async()=>{
 const result=await executeEntrance({earlyProposal:true});
 assert.equal(result.rootNode.dataset.run8eReady,'true');assert.equal(result.presents,2);assert.equal(result.wheelEvents.length,0);
});
