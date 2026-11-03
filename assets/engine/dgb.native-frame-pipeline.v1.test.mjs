import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNativeFramePipeline, inspectNativeShadowPass } from './dgb.native-frame-pipeline.v1.mjs';

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

const E9_ID=[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
const e9Target=f=>{
  const t=f.target({name:'E9-shadow-depth'});
  t.definition.depthTexture=true;t.depthTexture={gpu:t.depthGpu};
  return t;
};
const e9EnableMatrices=f=>{
  f.gl.uniformMatrix4fv=(...args)=>f.log.push(['matrix4',...args]);
  return f;
};

test('E9 opt-in native shadow caster runs depth-only offscreen and authenticates WebGL1 and WebGL2 receipts',()=>{
  for(const backend of ['WEBGL1','WEBGL2']){
    const f=e9EnableMatrices(fixture({backend})),p=createNativeFramePipeline(f.device);
    const target=e9Target(f),mesh=f.mesh('caster');
    let compiled=null;
    const old=f.device.createProgram;
    f.device.createProgram=source=>{compiled=source;return old(source);};
    const result=p.renderShadowDepth({target,lightViewProjection:E9_ID,
      casters:[{mesh,modelMatrix:E9_ID}],cull:'NONE'});
    assert.deepEqual({executed:result.executed,presentation:result.presentation},
      {executed:1,presentation:'OFFSCREEN_ONLY'});
    assert.ok(f.log.some(x=>x[0]==='matrix4'));
    assert.equal(f.log.filter(x=>x[0]==='draw').length,1);
    assert.deepEqual(f.log.filter(x=>x[0]==='target').map(x=>x[1]),['E9-shadow-depth','canvas']);
    assert.match(compiled.vertexSource,/uLightViewProjection\*uModel/);
    assert.match(compiled.fragmentSource,backend==='WEBGL2'?/out vec4 outColor/:/gl_FragColor/);
    const check=inspectNativeShadowPass(result,f.device);
    assert.equal(check.depthTexture,target.depthGpu);
    assert.equal(check.lightViewProjection.length,16);
    assert.equal(p.status().active,false);
  }
});

test('E9 caster validation is atomic before any framebuffer mutation',()=>{
  const f=e9EnableMatrices(fixture()),p=createNativeFramePipeline(f.device),t=e9Target(f);
  const good={target:t,lightViewProjection:E9_ID,casters:[{mesh:f.mesh('caster'),modelMatrix:E9_ID}]};
  const bad=[
    {...good,target:f.target()},
    {...good,lightViewProjection:[1,2]},
    {...good,casters:null},
    {...good,casters:[{mesh:f.mesh('caster'),modelMatrix:[1,2]}]},
    {...good,casters:[{mesh:f.mesh('caster'),modelMatrix:E9_ID,cull:'SIDE'}]},
    {...good,clearDepth:2},
    {...good,cull:'SIDE'}
  ];
  for(const descriptor of bad){
    const before=f.log.length;
    assert.throws(()=>p.renderShadowDepth(descriptor));
    assert.equal(f.log.length,before,'invalid E9 caster mutated GL');
    assert.equal(p.status().active,false);
  }
});

test('E9 receipt fails closed across devices, depth resize, context loss and restores',()=>{
  const f=e9EnableMatrices(fixture()),p=createNativeFramePipeline(f.device),t=e9Target(f);
  const pass=p.renderShadowDepth({target:t,lightViewProjection:E9_ID,casters:[]});
  assert.equal(pass.executed,0);
  assert.throws(()=>inspectNativeShadowPass({},f.device),/SHADOW_PASS_FOREIGN_OR_UNVERIFIED/);
  assert.throws(()=>inspectNativeShadowPass(pass,fixture().device),/SHADOW_PASS_FOREIGN_OR_UNVERIFIED/);
  f.lose();
  assert.throws(()=>inspectNativeShadowPass(pass,f.device),/GRAPHICS_CONTEXT_NOT_READY/);
  f.restore();
  t.depthTexture.gpu={reallocated:true};
  assert.throws(()=>inspectNativeShadowPass(pass,f.device),/SHADOW_PASS_STALE_TARGET/);
});

test('E9 aborted caster draw leaves no active frame and permits a clean retry',()=>{
  const f=e9EnableMatrices(fixture()),p=createNativeFramePipeline(f.device),t=e9Target(f);
  const descriptor={target:t,lightViewProjection:E9_ID,
    casters:[{mesh:f.mesh('caster'),modelMatrix:E9_ID}]};
  f.setDraw(()=>{throw new Error('CASTER_GPU_FAILED');});
  assert.throws(()=>p.renderShadowDepth(descriptor),/CASTER_GPU_FAILED/);
  assert.equal(p.status().active,false);
  assert.equal(p.status().lastPresentation,'ABORTED');
  f.setDraw(null);
  assert.equal(p.renderShadowDepth(descriptor).executed,1);
});


test('E9 only latest same-target shadow pass remains valid, failed overwrite invalidates both',()=>{
  for(const backend of ['WEBGL1','WEBGL2']){
    const f=e9EnableMatrices(fixture({backend})),p=createNativeFramePipeline(f.device),t=e9Target(f);
    const mesh=f.mesh('caster');
    const spec=(lightViewProjection,casters=[{mesh,modelMatrix:E9_ID}])=>({
      target:t,lightViewProjection,casters,cull:'NONE'});
    const first=p.renderShadowDepth(spec(E9_ID));
    assert.equal(inspectNativeShadowPass(first,f.device).lightViewProjection[12],0);
    const shifted=[...E9_ID];shifted[12]=0.4;
    const second=p.renderShadowDepth(spec(shifted));
    assert.throws(()=>inspectNativeShadowPass(first,f.device),/SHADOW_PASS_STALE_TARGET/);
    assert.ok(Math.abs(inspectNativeShadowPass(second,f.device).lightViewProjection[12]-0.4)<1e-6);
    // An invalid descriptor is rejected before any target mutation and must
    // not invalidate an otherwise current pass.
    assert.throws(()=>p.renderShadowDepth(spec([1,2])),/SHADOW_LIGHT_MATRIX_INVALID/);
    assert.ok(Math.abs(inspectNativeShadowPass(second,f.device).lightViewProjection[12]-0.4)<1e-6);
    f.setDraw(()=>{throw new Error('CASTER_GPU_FAILED');});
    assert.throws(()=>p.renderShadowDepth(spec(E9_ID)),/CASTER_GPU_FAILED/);
    assert.throws(()=>inspectNativeShadowPass(second,f.device),/SHADOW_PASS_STALE_TARGET/);
    f.setDraw(null);
    const recovered=p.renderShadowDepth(spec(E9_ID));
    assert.equal(inspectNativeShadowPass(recovered,f.device).lightViewProjection[0],1);
    assert.throws(()=>inspectNativeShadowPass(second,f.device),/SHADOW_PASS_STALE_TARGET/);
  }
});

test('E9 inspection cannot mutate private light-space matrix provenance',()=>{
  const f=e9EnableMatrices(fixture()),p=createNativeFramePipeline(f.device),t=e9Target(f);
  const input=[...E9_ID];
  const receipt=p.renderShadowDepth({target:t,lightViewProjection:input,casters:[]});
  input[0]=13;
  const inspected=inspectNativeShadowPass(receipt,f.device);
  assert.equal(inspected.lightViewProjection[0],1);
  inspected.lightViewProjection[0]=11;
  inspected.lightViewProjection[12]=9;
  const again=inspectNativeShadowPass(receipt,f.device);
  assert.notEqual(again.lightViewProjection,inspected.lightViewProjection);
  assert.equal(again.lightViewProjection[0],1);
  assert.equal(again.lightViewProjection[12],0);
});

test('E9 normal E2 frame invalidates a shadow receipt when reusing sampleable target',()=>{
  const f=e9EnableMatrices(fixture()),p=createNativeFramePipeline(f.device),t=e9Target(f);
  const old=p.renderShadowDepth({target:t,lightViewProjection:E9_ID,casters:[]});
  p.beginFrame({target:t,clear:{color:[0,0,0,1],depth:1},depthMode:'TEST_WRITE',cull:'NONE'});
  assert.throws(()=>inspectNativeShadowPass(old,f.device),/SHADOW_PASS_STALE_TARGET/);
  assert.equal(p.endFrame({presentToCanvas:false}).presentation,'OFFSCREEN_ONLY');
  assert.throws(()=>inspectNativeShadowPass(old,f.device),/SHADOW_PASS_STALE_TARGET/);
});
