import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {FOOTHILL_MEADOW_GLSL} from '../../showroom/globe/h-earth/render/foothill-meadow-field.v1.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createHEarthLoadingScreen} from '../../showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js';
import {createSingleOwnerVegetation} from '../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';
function harness(){
 const nodes=new Map(),timers=new Map(),frames=[];let id=0;
 const node=()=>({dataset:{},hidden:false,disabled:true,textContent:'',listeners:{},setAttribute(k,v){this[k]=v;},addEventListener(k,f){this.listeners[k]=f;},querySelector(k){if(!nodes.has(k))nodes.set(k,node());return nodes.get(k);}});
 const shell=node(),document={createElement:()=>shell,body:{appendChild(){}}};
 const loader=createHEarthLoadingScreen({document,now:()=>100,requestFrame:f=>frames.push(f),schedule:f=>{timers.set(++id,f);return id;},cancelSchedule:id=>timers.delete(id)});
 return {loader,shell,nodes,timers,frames,tick(){const [id,f]=timers.entries().next().value;timers.delete(id);f();},click(s){nodes.get(s).listeners.click();}};
}
const pose=sequence=>({sequence,position:{x:sequence,y:0,z:0},yawDegrees:0,pitchDegrees:0,verticalFovDegrees:60});
test('stories rotate, pause and resume without driving loading progress',()=>{
 const h=harness();assert.match(h.shell.innerHTML,/Gratitude/);assert.doesNotMatch(h.shell.innerHTML,/<(?:img|video|canvas)\b|@import|https?:/);
 h.tick();assert.equal(h.nodes.get('[data-story-title]').textContent,'From open meadow to sheltered ravine.');
 h.click('[data-story-pause]');assert.equal(h.timers.size,0);h.click('[data-story-next]');assert.equal(h.nodes.get('[data-story-count]').textContent,'03 / 03');assert.equal(h.timers.size,0);
 h.click('[data-story-pause]');assert.equal(h.timers.size,1);
 h.loader.update({progress:.8});assert.equal(h.nodes.get('[data-loading-progress]').hidden,true);
 h.loader.update({completed:4,total:10});assert.equal(h.nodes.get('[data-loading-progress]').value,4);
 h.loader.update({completed:3,total:10});assert.equal(h.nodes.get('[data-loading-progress]').value,4);
});
test('entry still requires changed input, corresponding presentation and next frame',()=>{
 const h=harness();h.loader.enableControls(pose(0));assert.equal(h.timers.size,0);assert.equal(h.nodes.get('[data-enter]').disabled,true);
 h.loader.observeInput({accepted:true},pose(1));h.loader.observePresentation(pose(1),{navigationSequence:0});assert.equal(h.frames.length,0);
 h.loader.observePresentation(pose(1),{navigationSequence:1});assert.equal(h.nodes.get('[data-enter]').disabled,true);h.frames.shift()();assert.equal(h.nodes.get('[data-enter]').disabled,false);
 h.click('[data-enter]');assert.equal(h.loader.getReceipt().mode,'entered');assert.equal(h.shell.hidden,true);
});
test('failure wins over queued readiness, future updates and repeated errors',()=>{
 const h=harness();h.loader.enableControls(pose(0));h.loader.observeInput({accepted:true},pose(1));h.loader.observePresentation(pose(1),{navigationSequence:1});
 h.loader.fail(Error('OWNER_CONTEXT_LOST:VERTEX:NO_DRIVER_LOG'));h.frames.shift()();h.loader.enableControls(pose(0));h.loader.update({completed:10,total:10});h.loader.fail(Error('secondary'));
 assert.equal(h.loader.getReceipt().mode,'failed');assert.match(h.loader.getReceipt().failure.message,/OWNER_CONTEXT_LOST/);assert.equal(h.nodes.get('[data-enter]').disabled,true);assert.equal(h.timers.size,0);assert.equal(h.nodes.get('[data-loading-activity]').textContent,'Graphics preparation stopped');
});
const presentation=()=>({tiles:[{id:'control',minX:-140,minZ:-196,roots:[{x:-139.4,y:2,z:-194.5,angle:0,seed:.5,slope:.1}]}],receipt:{contactCount:1}});
function glFixture(overrides={}){const deleted=[];let id=0;const gl=new Proxy({VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,isContextLost:()=>false,createProgram:()=>({p:++id}),createShader:type=>({type,id:++id}),getShaderParameter:()=>true,getProgramParameter:()=>true,getShaderInfoLog:()=>null,getProgramInfoLog:()=>null,deleteShader:x=>deleted.push(x),deleteProgram:x=>deleted.push(x),...overrides},{get:(o,k)=>k in o?o[k]:()=>{}});return {gl,deleted};}
for(const [name,overrides,expected,deletions] of [
 ['lost context',{isContextLost:()=>true},/OWNER_CONTEXT_LOST:PROGRAM:NO_DRIVER_LOG/,0],
 ['program allocation',{createProgram:()=>null},/OWNER_PROGRAM_ALLOCATION:PROGRAM/,0],
 ['shader allocation',{createShader:()=>null},/OWNER_SHADER_ALLOCATION:VERTEX/,1],
 ['vertex no log',{getShaderParameter:()=>false},/OWNER_SHADER_COMPILE:VERTEX:NO_DRIVER_LOG/,2],
 ['fragment log',{getShaderParameter:s=>s.type===1,getShaderInfoLog:()=> 'driver message'},/OWNER_SHADER_COMPILE:FRAGMENT:driver message/,3],
 ['link no log',{getProgramParameter:()=>false},/OWNER_LINK:PROGRAM:NO_DRIVER_LOG/,3],
])test(`graphics failure distinguishes ${name} and cleans allocated objects`,async()=>{
 const f=glFixture(overrides);await assert.rejects(createSingleOwnerVegetation(f.gl,presentation(),{environment:{},planetRadius:6200000}),expected);assert.equal(f.deleted.length,deletions);
});
test('context lost during compile takes precedence over an empty driver log',async()=>{
 let lost=false;const f=glFixture({isContextLost:()=>lost,compileShader:()=>{lost=true;},getShaderParameter:()=>null});await assert.rejects(createSingleOwnerVegetation(f.gl,presentation(),{environment:{},planetRadius:6200000}),/OWNER_CONTEXT_LOST:VERTEX:NO_DRIVER_LOG/);assert.equal(f.deleted.length,2);
});
test('public context loss is terminal even if preparation later completes',async()=>{
 const source=readFileSync(new URL('../../showroom/globe/h-earth/vegetation-prototype/route.js',import.meta.url),'utf8');
 const declarations=source.slice(source.indexOf('function progress(stage,label)'),source.indexOf('\ntry{\n  if(diagnosticReplay)'));
 let listener,cancelled=0,failures=0,readyEvents=0;const root={dataset:{}},canvas={style:{},addEventListener:(_n,f)=>listener=f};
 const context=vm.createContext({root,canvas,status:{},Error,diagnosticReplay:false,interactiveReady:true,terminalFailure:null,presenter:{cancel:()=>cancelled++},loader:{fail:()=>failures++,beginStage(){},update(){}},window:{dispatchEvent:()=>readyEvents++},CustomEvent:class{},assertRouteActive(){if(context.terminalFailure)throw context.terminalFailure;}});
 vm.runInContext(declarations,context);listener();vm.runInContext('markReady()',context);assert.throws(()=>vm.runInContext("progress('world','late')",context),/GRAPHICS_CONTEXT_LOST/);listener();
 assert.equal(cancelled,1);assert.equal(failures,1);assert.equal(readyEvents,0);assert.equal(root.dataset.run8eReady,'false');assert.equal(root.dataset.worldFirstFrameReady,'false');assert.equal(canvas.style.pointerEvents,'none');
});

test('actual single-owner palette shaders compile and link with software GLES',async t=>{
 const owner=readFileSync(new URL('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js',import.meta.url),'utf8');
 const declarations=owner.match(/const VS=([\s\S]*?);\nconst FS=([\s\S]*?);\nexport async/);assert.ok(declarations);
 const shaders={vertex:vm.runInNewContext(declarations[1],{FOOTHILL_MEADOW_GLSL}),fragment:vm.runInNewContext(declarations[2])};
 const established=readFileSync(new URL('./h-earth.fine-grass-continuity.v1.test.mjs',import.meta.url),'utf8');
 const probe=established.split('const SOFTWARE_GLES_PROBE=String.raw`')[1].split("getstr=F(")[0].replace(/^names=.*\n/m,'')+'\nprint(json.dumps(results))\n';
 const directory=await mkdtemp(join(tmpdir(),'h-earth-owner-gles-'));
 try{
  await Promise.all([writeFile(join(directory,'compile_shader.py'),probe),writeFile(join(directory,'vertex.glsl'),shaders.vertex),writeFile(join(directory,'fragment.glsl'),shaders.fragment)]);
  const result=spawnSync(process.env.CODEX_PRIMARY_RUNTIME_PYTHON||'python3',[join(directory,'compile_shader.py')],{encoding:'utf8',timeout:30000,env:{...process.env,EGL_PLATFORM:'surfaceless',LIBGL_ALWAYS_SOFTWARE:'1'}});
  if(result.error?.code==='ENOENT'||/EGL_UNAVAILABLE_|libEGL.so.1: cannot open shared object file/.test(result.stderr)){t.skip('Optional software GLES unavailable');return;}
  assert.equal(result.status,0,'ACTUAL_OWNER_GLES_COMPILE_LINK_FAILED: '+result.stderr);
  const evidence=JSON.parse(result.stdout);assert.ok(evidence.vertex.pass&&evidence.fragment.pass&&evidence.link.pass);
 }finally{await rm(directory,{recursive:true,force:true});}
});
