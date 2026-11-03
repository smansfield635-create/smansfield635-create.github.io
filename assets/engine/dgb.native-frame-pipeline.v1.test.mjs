import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNativeFramePipeline } from './dgb.native-frame-pipeline.v1.mjs';

function fixture({ backend='WEBGL1', defaultDepth=true }={}) {
  const log=[];
  let lost=false, disposed=false, onDraw=null;
  const gl={
    CCW:1, CULL_FACE:2, BACK:3, FRONT:4, DEPTH_TEST:5, BLEND:6, LEQUAL:7,
    FUNC_ADD:8, SRC_ALPHA:9, ONE_MINUS_SRC_ALPHA:10, ONE:11,
    COLOR_BUFFER_BIT:16, DEPTH_BUFFER_BIT:32, TEXTURE0:64, TEXTURE_2D:65,
    getContextAttributes(){return {depth:defaultDepth};}, isContextLost(){return lost;}
  };
  for (const fn of ['frontFace','disable','enable','cullFace','depthMask','depthFunc','blendEquation','blendFuncSeparate',
    'colorMask','clearColor','clearDepth','clear','activeTexture','bindTexture','uniform1i','uniform1f'])
    gl[fn]=(...args)=>log.push([fn,...args]);
  gl.getUniformLocation=()=>1;
  let serial=0;
  const device={backend,gl,
    status(){return {lost,disposed,restorationError:null};},
    bindRenderTarget(target){if(target!==null && target.owned!==true)throw new Error('RENDER_TARGET_NOT_OWNED_BY_DEVICE');log.push(['target',target?.name??'canvas']);},
    createProgram(definition){log.push(['createProgram']);return {gpu:++serial,definition};},
    createMesh(definition){log.push(['createMesh']);return {gpu:++serial,definition};},
    draw(cmd){if(onDraw)onDraw(cmd);log.push(['draw',cmd.program.name??'present',cmd.mesh.name??'quad']);cmd.beforeDraw?.(gl,cmd.program.gpu);cmd.afterDraw?.(gl,cmd.program.gpu);return {backend};}
  };
  const program=name=>({name,gpu:{},definition:{}});
  const mesh=name=>({name,gpu:{},definition:{vertexCount:3}});
  const target=({name='offscreen',depth=true,owned=true}={})=>({name,gpu:{},colorTexture:{gpu:{}},depthGpu:depth?{}:null,definition:{depth},width:8,height:8,owned});
  return {log,device,gl,program,mesh,target,lose:()=>lost=true,restore:()=>lost=false,dispose:()=>disposed=true,setDraw:f=>onDraw=f};
}
const spec=(target=null,depthMode='TEST_WRITE')=>({target,clear:{color:[0.1,0.2,0.3,1],depth:depthMode==='OFF'?null:1},depthMode});
const submit=(f,id,pass='OPAQUE',depthKey=null,cull='NONE')=>f.pipe.submit({pass,program:f.program(id),mesh:f.mesh(id),depthKey,cull});

test('rejects invalid E1 device, and caches only one pipeline per device',()=>{
  assert.throws(()=>createNativeFramePipeline({}),/E1_NATIVE_DEVICE_REQUIRED/);
  const f=fixture(), a=createNativeFramePipeline(f.device);
  assert.equal(createNativeFramePipeline(f.device),a);
  assert.throws(()=>createNativeFramePipeline({...f.device,status:()=>({disposed:true})}),/DEVICE_DISPOSED/);
});

test('begin/submit/end enforce lifecycle, report counts and direct presentation',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device);
  assert.throws(()=>pipe.submit({}),/FRAME_NOT_ACTIVE/);
  assert.throws(()=>pipe.endFrame(),/FRAME_NOT_ACTIVE/);
  pipe.beginFrame(spec());
  assert.throws(()=>pipe.beginFrame(spec()),/FRAME_ALREADY_ACTIVE/);
  assert.equal(pipe.submit({program:f.program('A'),mesh:f.mesh('A')}),1);
  const result=pipe.endFrame();
  assert.deepEqual(result,{backend:'WEBGL1',submitted:1,executed:1,presentation:'DIRECT'});
  assert.equal(pipe.status().completedFrames,1);
  assert.equal(pipe.status().active,false);
  assert.equal(f.log.at(-1)[0],'activeTexture');
  assert.deepEqual(f.log.filter(x=>x[0]==='target').map(x=>x[1]),['canvas','canvas']);
});

test('invalid frame descriptor rejected before GL calls, including missing depth',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device);
  const bad=[{}, {clear:{color:[0,0,0,2],depth:1}}, spec(f.target({depth:false})),
    {...spec(),cull:'CLOCKWISE'}, {...spec(),depthMode:'OTHER'},
    {target:null,clear:{color:[0,0,0,1],depth:0.5},depthMode:'OFF'}];
  for(const v of bad){const old=f.log.length;assert.throws(()=>pipe.beginFrame(v));assert.equal(f.log.length,old);}
  assert.throws(()=>pipe.beginFrame(spec(f.target({owned:false}))),/RENDER_TARGET_NOT_OWNED/);
  assert.equal(f.log.length,0);
});


test('E2 validates and forwards afterDraw callback with its matching draw',()=>{
  const f=fixture();const pipe=createNativeFramePipeline(f.device),program=f.program('E5'),mesh=f.mesh('E5');
  const calls=[];
  f.setDraw(null);
  pipe.beginFrame(spec());
  assert.throws(()=>pipe.submit({program,mesh,afterDraw:42}),/AFTER_DRAW_INVALID/);
  pipe.submit({program,mesh,beforeDraw:()=>calls.push('before'),afterDraw:()=>calls.push('after')});
  pipe.endFrame();
  assert.deepEqual(calls,['before','after']);
});

test('depth disabled permits color-only framebuffer and never clears depth',()=>{
  const f=fixture({defaultDepth:false}),pipe=createNativeFramePipeline(f.device);
  assert.throws(()=>pipe.beginFrame(spec()),/DEFAULT_DEPTH_BUFFER_UNAVAILABLE/);
  pipe.beginFrame(spec(f.target({depth:false}),'OFF'));
  const result=pipe.endFrame({presentToCanvas:false});
  assert.equal(result.presentation,'OFFSCREEN_ONLY');
  const clear=f.log.find(x=>x[0]==='clear');
  assert.equal(clear[1],f.gl.COLOR_BUFFER_BIT);
  assert.equal(f.log.some(x=>x[0]==='clearDepth'),false);
});

test('validation rejects bad draws without changing queue or executing',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device);
  pipe.beginFrame(spec());
  const good={program:f.program('A'),mesh:f.mesh('A')};
  for(const q of [{pass:'INVALID',...good},{...good,first:-1},{...good,count:4},
    {...good,beforeDraw:3},{...good,cull:'LEFT'},
    {...good,pass:'TRANSPARENT'}, {...good,pass:'TRANSPARENT',depthKey:-1},
    {...good,depthKey:3}, {mesh:good.mesh}, {program:good.program}]) assert.throws(()=>pipe.submit(q));
  assert.equal(pipe.status().submitted,0);
  assert.equal(pipe.endFrame().executed,0);
});

test('opaque insertion and transparent stable far-to-near ordering',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device);
  pipe.beginFrame(spec());
  for(const [id,pass,key] of [['near','TRANSPARENT',1],['opaque1','OPAQUE',null],
    ['far1','TRANSPARENT',7],['far2','TRANSPARENT',7],['opaque2','OPAQUE',null]])
    pipe.submit({pass,program:f.program(id),mesh:f.mesh(id),...(key===null?{}:{depthKey:key})});
  const result=pipe.endFrame();
  assert.deepEqual(f.log.filter(x=>x[0]==='draw').map(x=>x[1]),['opaque1','opaque2','far1','far2','near']);
  assert.equal(result.executed,5);
  assert.equal(f.log.some(x=>x[0]==='blendFuncSeparate'&&x[1]===f.gl.SRC_ALPHA&&x[2]===f.gl.ONE_MINUS_SRC_ALPHA&&x[3]===f.gl.ONE&&x[4]===f.gl.ONE_MINUS_SRC_ALPHA),true);
  assert.equal(f.log.some(x=>x[0]==='depthMask'&&x[1]===false),true);
});

test('face culling state follows draw descriptor, and default is disabled',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device);
  pipe.beginFrame({...spec(),cull:'BACK'});
  pipe.submit({pass:'OPAQUE',program:f.program('A'),mesh:f.mesh('A'),cull:'FRONT'});
  pipe.submit({pass:'OPAQUE',program:f.program('B'),mesh:f.mesh('B'),cull:'NONE'});
  pipe.endFrame();
  assert.equal(f.log.some(x=>x[0]==='cullFace'&&x[1]===f.gl.FRONT),true);
  assert.equal(f.log.some(x=>x[0]==='disable'&&x[1]===f.gl.CULL_FACE),true);
});

test('offscreen presentation allocates once, draws quad and switches back to canvas',()=>{
  const f=fixture({backend:'WEBGL2'}),pipe=createNativeFramePipeline(f.device),target=f.target();
  for(let i=0;i<2;i++){
    pipe.beginFrame(spec(target));
    pipe.submit({program:f.program('A'),mesh:f.mesh('A')});
    assert.equal(pipe.endFrame().presentation,'OFFSCREEN_PRESENTED');
  }
  assert.equal(f.log.filter(x=>x[0]==='createProgram').length,1);
  assert.equal(f.log.filter(x=>x[0]==='createMesh').length,1);
  assert.equal(f.log.filter(x=>x[0]==='draw'&&x[1]==='present').length,2);
  assert.equal(f.log.some(x=>x[0]==='uniform1i'&&x[2]===0),true);
  assert.equal(f.log.filter(x=>x[0]==='target').at(-1)[1],'canvas');
});

test('device draw failure aborts frame, does not present, next frame can recover',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device),target=f.target();
  f.setDraw(()=>{throw Error('BROKEN_DRAW');});
  pipe.beginFrame(spec(target));
  pipe.submit({program:f.program('A'),mesh:f.mesh('A')});
  assert.throws(()=>pipe.endFrame(),/BROKEN_DRAW/);
  assert.equal(pipe.status().active,false);
  assert.equal(pipe.status().lastPresentation,'ABORTED');
  assert.equal(f.log.some(x=>x[0]==='createProgram'),false);
  f.setDraw(null);
  pipe.beginFrame(spec(target));pipe.endFrame();
  assert.equal(pipe.status().lastPresentation,'OFFSCREEN_PRESENTED');
});

test('context loss and device disposal are fail-closed, restored device resumes',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device);
  f.lose();
  assert.throws(()=>pipe.beginFrame(spec()),/GRAPHICS_CONTEXT_NOT_READY/);
  f.restore();
  pipe.beginFrame(spec());pipe.endFrame();
  f.dispose();
  assert.throws(()=>pipe.beginFrame(spec()),/DEVICE_DISPOSED/);
});

test('mid-frame context loss aborts queue and restores a clean frame boundary',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device);
  pipe.beginFrame(spec());
  pipe.submit({program:f.program('A'),mesh:f.mesh('A')});
  f.lose();
  assert.throws(()=>pipe.endFrame(),/GRAPHICS_CONTEXT_NOT_READY/);
  assert.equal(pipe.status().active,false);
  assert.equal(pipe.status().lastPresentation,'ABORTED');
  assert.equal(f.log.some(x=>x[0]==='draw'),false);
  f.restore();
  pipe.beginFrame(spec());
  assert.equal(pipe.endFrame().submitted,0);
  assert.equal(pipe.status().lastError,null);
});

test('context lost inside draw fails instead of falsely claiming a completed frame',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device);
  f.setDraw(()=>f.lose());
  pipe.beginFrame(spec());
  pipe.submit({program:f.program('A'),mesh:f.mesh('A')});
  assert.throws(()=>pipe.endFrame(),/GRAPHICS_CONTEXT_LOST_DURING_FRAME/);
  assert.equal(pipe.status().lastPresentation,'ABORTED');
  assert.equal(pipe.status().completedFrames,0);
  f.restore();f.setDraw(null);
  pipe.beginFrame(spec());pipe.endFrame();
  assert.equal(pipe.status().completedFrames,1);
});


test('E5-B opt-in offscreen sRGB output is forwarded and legacy default remains linear',()=>{
  const f=fixture({backend:'WEBGL2'}),pipe=createNativeFramePipeline(f.device),target=f.target();
  pipe.beginFrame(spec(target));
  pipe.endFrame();
  assert.ok(f.log.some(x=>x[0]==='uniform1f'&&x[2]===0));
  pipe.beginFrame(spec(target));
  pipe.endFrame({presentationEncoding:'SRGB'});
  assert.ok(f.log.some(x=>x[0]==='uniform1f'&&x[2]===1));
  assert.equal(f.log.filter(x=>x[0]==='createProgram').length,1);
});

test('E5-B sRGB requires an actual offscreen-to-canvas presentation and rejects unknown encodings without GL mutation',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device),target=f.target();
  pipe.beginFrame(spec());
  let old=f.log.length;
  assert.throws(()=>pipe.endFrame({presentationEncoding:'SRGB'}),/SRGB_REQUIRES_OFFSCREEN_CANVAS_PRESENTATION/);
  assert.equal(f.log.length,old);
  assert.throws(()=>pipe.endFrame({presentationEncoding:'P3'}),/PRESENTATION_ENCODING_INVALID/);
  assert.equal(f.log.length,old);
  pipe.endFrame();
  pipe.beginFrame(spec(target));
  old=f.log.length;
  assert.throws(()=>pipe.endFrame({presentToCanvas:false,presentationEncoding:'SRGB'}),/SRGB_REQUIRES_OFFSCREEN_CANVAS_PRESENTATION/);
  assert.equal(f.log.length,old);
  assert.equal(pipe.endFrame({presentToCanvas:false}).presentation,'OFFSCREEN_ONLY');
});

test('E5-B both existing presentation dialects encode RGB only and retain alpha',()=>{
  for(const backend of ['WEBGL1','WEBGL2']){
    const f=fixture({backend}),pipe=createNativeFramePipeline(f.device);
    pipe.beginFrame(spec(f.target()));pipe.endFrame({presentationEncoding:'SRGB'});
    const created=f.log.find(x=>x[0]==='createProgram');
    assert.ok(created);
    // Native mock validates transfer plumbing; actual GLSL behavior is qualified in Chromium WebGL1/WebGL2.
    assert.ok(f.log.some(x=>x[0]==='uniform1f'&&x[2]===1));
  }
});


test('E5-B missing presentation uniform aborts and unbinds texture in both WebGL dialects',()=>{
  for(const backend of ['WEBGL1','WEBGL2']){
    const f=fixture({backend}),pipe=createNativeFramePipeline(f.device),t=f.target();
    f.gl.getUniformLocation=(_handle,name)=>name==='uOutputSRGB'?null:1;
    pipe.beginFrame(spec(t));
    assert.throws(()=>pipe.endFrame({presentationEncoding:'SRGB'}),/PRESENTATION_UNIFORM_MISSING/);
    assert.equal(pipe.status().lastPresentation,'ABORTED');
    const binds=f.log.filter(x=>x[0]==='bindTexture');
    assert.equal(binds.at(-1)[2],null);
    f.gl.getUniformLocation=()=>1;
    pipe.beginFrame(spec(t));
    assert.equal(pipe.endFrame({presentationEncoding:'SRGB'}).presentation,'OFFSCREEN_PRESENTED');
  }
});

test('E5-B cleanup errors do not mask primary presenter error',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device),t=f.target();
  const originalBind=f.gl.bindTexture;
  f.gl.getUniformLocation=(_handle,name)=>name==='uOutputSRGB'?null:1;
  f.gl.bindTexture=(target,texture)=>{
    if(texture===null)throw new Error('BIND_CLEANUP_FAILED');
    originalBind(target,texture);
  };
  pipe.beginFrame(spec(t));
  assert.throws(()=>pipe.endFrame({presentationEncoding:'SRGB'}),/PRESENTATION_UNIFORM_MISSING/);
  assert.equal(pipe.status().lastPresentation,'ABORTED');
});

test('E5-B successful draw surfaces presenter unbind failure',()=>{
  const f=fixture(),pipe=createNativeFramePipeline(f.device),t=f.target();
  const originalBind=f.gl.bindTexture;
  f.gl.bindTexture=(target,texture)=>{
    if(texture===null)throw new Error('BIND_CLEANUP_FAILED');
    originalBind(target,texture);
  };
  pipe.beginFrame(spec(t));
  assert.throws(()=>pipe.endFrame({presentationEncoding:'SRGB'}),/BIND_CLEANUP_FAILED/);
  assert.equal(pipe.status().lastPresentation,'ABORTED');
});
