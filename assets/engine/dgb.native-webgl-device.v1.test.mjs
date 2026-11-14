import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNativeWebGLDevice } from './dgb.native-webgl-device.v1.mjs';

function fakeCanvas({ webgl2 = false, uint32 = false, compileFail = false, linkFail = false, fboIncomplete = false, textureFail = false, fboIncompleteAfter = 0, uploadGlError = false, depthTexture = false, failDynamicUploadOnce = false } = {}) {
  const log = [], handlers = new Map();
  let contextLost = false, id = 0, framebufferChecks = 0;
  const bindings = { texture: null, framebuffer: null, renderbuffer: null, unpack: 4, arrayBuffer: null, elementArrayBuffer: null };
  const buffers = new Map();
  let dynamicFailures = failDynamicUploadOnce ? 1 : 0;
  const obj = type => ({ type, id: ++id });
  const gl = {
    VERTEX_SHADER: 1, FRAGMENT_SHADER: 2, COMPILE_STATUS: 3, LINK_STATUS: 4,
    ARRAY_BUFFER: 5, ELEMENT_ARRAY_BUFFER: 6, STATIC_DRAW: 7, DYNAMIC_DRAW: 36, ARRAY_BUFFER_BINDING: 37,
    FLOAT: 8, TRIANGLES: 9, UNSIGNED_SHORT: 10, UNSIGNED_BYTE: 11, UNSIGNED_INT: 12,
    TEXTURE_2D: 13, RGBA: 14, TEXTURE_BINDING_2D: 15, UNPACK_ALIGNMENT: 16,
    TEXTURE_WRAP_S: 17, TEXTURE_WRAP_T: 18, TEXTURE_MIN_FILTER: 19, TEXTURE_MAG_FILTER: 20,
    CLAMP_TO_EDGE: 21, NEAREST: 22, LINEAR: 23, MAX_TEXTURE_SIZE: 24,
    MAX_RENDERBUFFER_SIZE: 25, FRAMEBUFFER: 26, FRAMEBUFFER_BINDING: 27,
    COLOR_ATTACHMENT0: 28, DEPTH_ATTACHMENT: 29, FRAMEBUFFER_COMPLETE: 30,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 31, RENDERBUFFER: 32,
    RENDERBUFFER_BINDING: 33, DEPTH_COMPONENT16: 34, DEPTH_COMPONENT: 35, NO_ERROR: 0, INVALID_OPERATION: 98,
    createShader() { log.push('createShader'); return obj('shader'); },
    shaderSource() {}, compileShader() {}, getShaderParameter() { return !compileFail; },
    getShaderInfoLog() { return 'mock compile error'; }, deleteShader() { log.push('deleteShader'); },
    createProgram() { log.push('createProgram'); return obj('program'); },
    attachShader() {}, linkProgram() {}, getProgramParameter() { return !linkFail; },
    getProgramInfoLog() { return 'mock link error'; }, deleteProgram() { log.push('deleteProgram'); },
    createBuffer() { log.push('createBuffer'); return obj('buffer'); },
    bindBuffer(target, handle) {
      if (target === this.ARRAY_BUFFER) bindings.arrayBuffer = handle;
      else if (target === this.ELEMENT_ARRAY_BUFFER) bindings.elementArrayBuffer = handle;
    },
    bufferData(target, data) {
      log.push('bufferData');
      const handle = target === this.ARRAY_BUFFER ? bindings.arrayBuffer : bindings.elementArrayBuffer;
      if (handle && ArrayBuffer.isView(data)) buffers.set(handle, data.slice());
    },
    bufferSubData(target, offset, data) {
      log.push('bufferSubData');
      if (target !== this.ARRAY_BUFFER || !bindings.arrayBuffer) throw Error('MOCK_BUFFER_NOT_BOUND');
      const current = buffers.get(bindings.arrayBuffer);
      if (!current || offset % current.BYTES_PER_ELEMENT) throw Error('MOCK_BUFFER_STORAGE_INVALID');
      current.set(data, offset / current.BYTES_PER_ELEMENT);
      if (dynamicFailures > 0) { dynamicFailures--; throw Error('SIMULATED_PARTIAL_GPU_UPLOAD'); }
    },
    deleteBuffer(handle) { log.push('deleteBuffer'); buffers.delete(handle); },
    getExtension(n) { return (n === 'OES_element_index_uint' && uint32) || (n === 'WEBGL_depth_texture' && depthTexture) ? {} : null; },
    getParameter(p) {
      if (p === this.MAX_TEXTURE_SIZE || p === this.MAX_RENDERBUFFER_SIZE) return 1024;
      if (p === this.TEXTURE_BINDING_2D) return bindings.texture;
      if (p === this.FRAMEBUFFER_BINDING) return bindings.framebuffer;
      if (p === this.RENDERBUFFER_BINDING) return bindings.renderbuffer;
      if (p === this.UNPACK_ALIGNMENT) return bindings.unpack;
      if (p === this.ARRAY_BUFFER_BINDING) return bindings.arrayBuffer;
      return null;
    },
    createTexture() { log.push('createTexture'); return textureFail ? null : obj('texture'); },
    bindTexture(_target, handle) { bindings.texture = handle; log.push('bindTexture'); },
    pixelStorei(_name, value) { bindings.unpack = value; },
    texParameteri() { log.push('texParameteri'); },
    texImage2D(_target, _level, _format, width, height, _border, _format2, _type, pixels) {
      log.push('texImage2D:' + width + 'x' + height + ':' + (pixels?.byteLength ?? 'null'));
      if (_format === this.DEPTH_COMPONENT || _format === this.DEPTH_COMPONENT16) {
        log.push('depthTexImage2D:' + _format + ':' + _format2 + ':' + _type);
      }
    },
    getError() { return uploadGlError ? this.INVALID_OPERATION : this.NO_ERROR; },
    deleteTexture() { log.push('deleteTexture'); },
    createFramebuffer() { log.push('createFramebuffer'); return obj('framebuffer'); },
    bindFramebuffer(_target, handle) { bindings.framebuffer = handle; log.push('bindFramebuffer'); },
    framebufferTexture2D() { log.push('framebufferTexture2D'); },
    checkFramebufferStatus() { framebufferChecks++; return (fboIncomplete || (fboIncompleteAfter > 0 && framebufferChecks >= fboIncompleteAfter)) ? this.FRAMEBUFFER_INCOMPLETE_ATTACHMENT : this.FRAMEBUFFER_COMPLETE; },
    deleteFramebuffer() { log.push('deleteFramebuffer'); },
    createRenderbuffer() { log.push('createRenderbuffer'); return obj('renderbuffer'); },
    bindRenderbuffer(_target, handle) { bindings.renderbuffer = handle; },
    renderbufferStorage() { log.push('renderbufferStorage'); },
    framebufferRenderbuffer() { log.push('framebufferRenderbuffer'); },
    deleteRenderbuffer() { log.push('deleteRenderbuffer'); },
    useProgram() {}, getAttribLocation(_program,name) { return name==='a_position'?0:-1; },
    enableVertexAttribArray() {}, disableVertexAttribArray() {},
    vertexAttribPointer() { log.push('vertexAttribPointer'); },
    vertexAttribIPointer() { log.push('vertexAttribIPointer'); },
    drawArrays() { log.push('drawArrays'); }, drawElements() { log.push('drawElements'); },
    viewport() { log.push('viewport'); }, isContextLost() { return contextLost; }
  };
  const canvas = {
    width: 256, height: 256,
    getContext(kind) { log.push('getContext:'+kind); if (kind==='webgl2' && !webgl2) return null; return gl; },
    addEventListener(name,callback) { handlers.set(name,callback); },
    removeEventListener(name) { handlers.delete(name); },
    trigger(name) { contextLost = name === 'webglcontextlost'; handlers.get(name)?.({preventDefault(){log.push('preventDefault')}}); }
  };
  return { canvas, gl, log, buffers };
}
const shader = { vertexSource:'attribute vec3 a_position; void main(){gl_Position=vec4(a_position,1.0);}', fragmentSource:'void main(){gl_FragColor=vec4(1.0);}' };
const positions = new Float32Array([-1,-1,0, 1,-1,0, 0,1,0]);
const attrib = { name:'a_position', data:positions, size:3 };

test('WebGL1 device owns program/buffers and executes indexed drawElements', () => {
  const {canvas,log}=fakeCanvas();
  const d=createNativeWebGLDevice(canvas);
  const p=d.createProgram(shader);
  const m=d.createMesh({ attributes:[attrib], indices:new Uint16Array([0,1,2]), vertexCount:3 });
  d.viewport();
  assert.deepEqual(d.draw({program:p,mesh:m}), {backend:'WEBGL1',indexed:true,verticesOrIndices:3});
  assert(log.includes('drawElements'));
  assert(log.includes('bufferData'));
  assert.equal(log.filter(x=>x==='deleteShader').length,2);
  d.dispose();
  assert.equal(log.filter(x=>x==='deleteBuffer').length,2);
  assert.equal(log.filter(x=>x==='deleteProgram').length,1);
  assert.equal(d.status().disposed,true);
  assert.throws(()=>d.draw({program:p,mesh:m}),/DEVICE_DISPOSED/);
});

test('WebGL1 unindexed drawArrays and invalid external handle fail closed', () => {
  const {canvas,log}=fakeCanvas(); const d=createNativeWebGLDevice(canvas);
  const p=d.createProgram(shader),m=d.createMesh({attributes:[attrib],vertexCount:3});
  assert.equal(d.draw({program:p,mesh:m}).indexed,false);
  assert(log.includes('drawArrays'));
  assert.throws(()=>d.draw({program:{},mesh:m}),/PROGRAM_NOT_OWNED/);
  d.dispose();
});


test('afterDraw callback runs in draw finally on success or failure, preserving original error', () => {
  const {canvas,gl}=fakeCanvas(),d=createNativeWebGLDevice(canvas);
  const p=d.createProgram(shader),m=d.createMesh({attributes:[attrib],vertexCount:3});
  const events=[];
  d.draw({program:p,mesh:m,beforeDraw(){events.push('before');},afterDraw(){events.push('after');}});
  assert.deepEqual(events,['before','after']);
  assert.throws(()=>d.draw({program:p,mesh:m,afterDraw:5}),/AFTER_DRAW_INVALID/);
  gl.drawArrays=()=>{events.push('failure');throw Error('DRAW_FAILED');};
  assert.throws(()=>d.draw({program:p,mesh:m,afterDraw(){events.push('cleanup');}}),/DRAW_FAILED/);
  assert.deepEqual(events,['before','after','failure','cleanup']);
});

test('WebGL1 refuses uint32 indices without extension and releases buffers', () => {
  const {canvas,log}=fakeCanvas(); const d=createNativeWebGLDevice(canvas);
  assert.throws(()=>d.createMesh({attributes:[attrib],indices:new Uint32Array([0,1,2]),vertexCount:3}),/EXTENSION_REQUIRED/);
  assert.equal(log.filter(x=>x==='createBuffer').length,1);
  assert.equal(log.filter(x=>x==='deleteBuffer').length,1);
  d.dispose();
});

test('WebGL2 uses native integer attribute pointer', () => {
  const {canvas,log}=fakeCanvas({webgl2:true}); const d=createNativeWebGLDevice(canvas,{backend:'WEBGL2'});
  const p=d.createProgram(shader); const m=d.createMesh({attributes:[{...attrib,integer:true,type:12}],vertexCount:3});
  d.draw({program:p,mesh:m}); assert(log.includes('vertexAttribIPointer')); assert(log.includes('getContext:webgl2')); d.dispose();
});

test('context restoration rebuilds programs and buffers; no stale handles reused', () => {
  const {canvas,log}=fakeCanvas(); const d=createNativeWebGLDevice(canvas);
  const p=d.createProgram(shader),m=d.createMesh({attributes:[attrib],vertexCount:3});
  const oldProgram=p.gpu,oldBuffer=m.gpu.attributes[0].buffer;
  assert.throws(()=>d.recover(),/RECOVERY_REQUIRES_CONTEXT_LOSS/);
  canvas.trigger('webglcontextlost');
  assert.equal(d.status().lost,true);
  assert.throws(()=>d.draw({program:p,mesh:m}),/GRAPHICS_CONTEXT_LOST/);
  canvas.trigger('webglcontextrestored');
  assert.equal(d.status().lost,false);
  assert.notEqual(p.gpu,oldProgram); assert.notEqual(m.gpu.attributes[0].buffer,oldBuffer);
  assert(log.includes('preventDefault'));
  d.draw({program:p,mesh:m}); d.dispose();
});

test('shader and program creation failures clean up allocated resources', () => {
  const first=fakeCanvas({compileFail:true}),d1=createNativeWebGLDevice(first.canvas);
  assert.throws(()=>d1.createProgram(shader),/SHADER_COMPILE_FAILED/);
  assert.equal(first.log.filter(x=>x==='deleteShader').length,1); d1.dispose();
  const second=fakeCanvas({linkFail:true}),d2=createNativeWebGLDevice(second.canvas);
  assert.throws(()=>d2.createProgram(shader),/PROGRAM_LINK_FAILED/);
  assert.equal(second.log.filter(x=>x==='deleteShader').length,2);
  assert.equal(second.log.filter(x=>x==='deleteProgram').length,1); d2.dispose();
});

test('WebGL1 NPOT typed RGBA textures allocate and restore prior binding', () => {
  const { canvas, gl, log } = fakeCanvas();
  const old = { external: true }; gl.bindTexture(gl.TEXTURE_2D, old);
  const d = createNativeWebGLDevice(canvas);
  const t = d.createTexture2D({ width: 3, height: 5, pixels: new Uint8Array(60), filter: 'LINEAR' });
  assert(t.gpu); assert.equal(gl.getParameter(gl.TEXTURE_BINDING_2D), old);
  assert(log.includes('texImage2D:3x5:60'));
  assert.equal(d.status().textures, 1);
  assert.equal(d.status().estimatedTextureBytes, 60);
  d.dispose(); assert.equal(log.filter(x => x === 'deleteTexture').length, 1);
});

test('both backends allocate complete color+depth16 render targets and resize', () => {
  for (const backend of ['WEBGL1', 'WEBGL2']) {
    const { canvas, gl, log } = fakeCanvas({ webgl2: true });
    const d = createNativeWebGLDevice(canvas, { backend });
    const rt = d.createRenderTarget({ width: 3, height: 5 });
    assert(rt.gpu && rt.colorTexture.gpu && rt.depthGpu);
    d.bindRenderTarget(rt);
    assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), rt.gpu);
    const old = rt.gpu, color = rt.colorTexture.gpu;
    assert.equal(d.resizeRenderTarget(rt, 7, 9), rt);
    assert.notEqual(rt.gpu, old); assert.notEqual(rt.colorTexture.gpu, color);
    assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), rt.gpu);
    d.bindRenderTarget(null);
    assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), null);
    assert.equal(d.status().renderTargets, 1);
    assert.equal(d.status().estimatedTextureBytes, 7 * 9 * 4);
    assert.equal(d.status().estimatedRenderbufferBytes, 7 * 9 * 2);
    d.dispose();
    assert.equal(log.filter(x => x === 'deleteFramebuffer').length, 2);
    assert.equal(log.filter(x => x === 'deleteRenderbuffer').length, 2);
    assert.equal(log.filter(x => x === 'deleteTexture').length, 2);
  }
});

test('invalid dimensions, RGBA byte length, and oversized texture reject without allocation', () => {
  const { canvas, log } = fakeCanvas();
  const d = createNativeWebGLDevice(canvas);
  assert.throws(() => d.createTexture2D({ width: 0, height: 3 }), /RESOURCE_SIZE_INVALID/);
  assert.throws(() => d.createTexture2D({ width: 3, height: 5, pixels: new Uint8Array(59) }), /RGBA8_PIXEL_LENGTH_MISMATCH/);
  assert.throws(() => d.createTexture2D({ width: 1025, height: 2 }), /TEXTURE_SIZE_LIMIT_EXCEEDED/);
  assert.throws(() => d.createTexture2D({ width: 2, height: 2, filter: 'MIPMAP' }), /TEXTURE_FILTER_UNSUPPORTED/);
  assert.equal(log.filter(x => x === 'createTexture').length, 0);
  d.dispose();
});

test('incomplete target is rejected and provisional GPU handles deleted', () => {
  const { canvas, log } = fakeCanvas({ fboIncomplete: true });
  const d = createNativeWebGLDevice(canvas);
  assert.throws(() => d.createRenderTarget({ width: 4, height: 4 }), /FRAMEBUFFER_INCOMPLETE/);
  assert.equal(d.status().renderTargets, 0);
  assert.equal(log.filter(x => x === 'deleteTexture').length, 1);
  assert.equal(log.filter(x => x === 'deleteFramebuffer').length, 1);
  assert.equal(log.filter(x => x === 'deleteRenderbuffer').length, 1);
  d.dispose();
});

test('texture and target records recover without stale native WebGL handles', () => {
  const { canvas, log } = fakeCanvas({ webgl2: true });
  const d = createNativeWebGLDevice(canvas, { backend: 'WEBGL2' });
  const texture = d.createTexture2D({ width: 2, height: 2, pixels: new Uint8Array(16) });
  const target = d.createRenderTarget({ width: 8, height: 8, depth: false });
  const oldTex = texture.gpu, oldTarget = target.gpu, oldColor = target.colorTexture.gpu;
  canvas.trigger('webglcontextlost'); assert.equal(d.status().lost, true);
  assert.equal(texture.gpu, null); assert.equal(target.gpu, null);
  canvas.trigger('webglcontextrestored');
  assert.equal(d.status().lost, false);
  assert.notEqual(texture.gpu, oldTex); assert.notEqual(target.gpu, oldTarget);
  assert.notEqual(target.colorTexture.gpu, oldColor);
  assert.equal(d.status().renderTargets, 1);
  d.dispose();
  assert.equal(log.filter(x => x === 'deleteFramebuffer').length, 1);
});

test('failed texture allocation does not leave a tracked resource', () => {
  const { canvas } = fakeCanvas({ textureFail: true });
  const d = createNativeWebGLDevice(canvas);
  assert.throws(() => d.createTexture2D({ width: 2, height: 2 }), /TEXTURE_ALLOCATION_FAILED/);
  assert.equal(d.status().textures, 0);
  d.dispose();
});

test('failed target resize preserves existing native framebuffer and size', () => {
  const { canvas, gl, log } = fakeCanvas({ fboIncompleteAfter: 2 });
  const d = createNativeWebGLDevice(canvas);
  const target = d.createRenderTarget({ width: 4, height: 4 });
  const original = target.gpu, originalColor = target.colorTexture.gpu;
  d.bindRenderTarget(target);
  assert.throws(() => d.resizeRenderTarget(target, 9, 7), /FRAMEBUFFER_INCOMPLETE/);
  assert.equal(target.gpu, original);
  assert.equal(target.colorTexture.gpu, originalColor);
  assert.equal(target.width, 4); assert.equal(target.height, 4);
  assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), original);
  assert.equal(d.status().estimatedTextureBytes, 64);
  assert.equal(log.filter(x => x === 'deleteFramebuffer').length, 1);
  d.dispose();
  assert.equal(log.filter(x => x === 'deleteFramebuffer').length, 2);
});

test('native GL texture upload errors fail closed with no resource registry leak', () => {
  const { canvas, log } = fakeCanvas({ uploadGlError: true });
  const d = createNativeWebGLDevice(canvas);
  assert.throws(() => d.createTexture2D({ width: 2, height: 2 }), /TEXTURE_UPLOAD_GL_ERROR/);
  assert.equal(d.status().textures, 0);
  assert.equal(log.filter(x => x === 'deleteTexture').length, 1);
  d.dispose();
});


test('E5 source repair: cleanup failure cannot mask primary draw exception', () => {
  const {canvas,gl}=fakeCanvas(),d=createNativeWebGLDevice(canvas);
  const p=d.createProgram(shader),m=d.createMesh({attributes:[attrib],vertexCount:3});
  const calls=[];
  gl.drawArrays=()=>{calls.push('draw');throw Error('PRIMARY_DRAW_FAILURE');};
  gl.disableVertexAttribArray=()=>{calls.push('disable');throw Error('ATTRIBUTE_CLEANUP_FAILURE');};
  assert.throws(()=>d.draw({program:p,mesh:m,afterDraw(){calls.push('after');throw Error('CALLBACK_CLEANUP_FAILURE');}}),/PRIMARY_DRAW_FAILURE/);
  assert.deepEqual(calls,['draw','after','disable']);
  d.dispose();
});

test('E5 source repair: falsy primary exception retained even if cleanup throws', () => {
  const {canvas,gl}=fakeCanvas(),d=createNativeWebGLDevice(canvas);
  const p=d.createProgram(shader),m=d.createMesh({attributes:[attrib],vertexCount:3});
  gl.drawArrays=()=>{throw null;};
  gl.disableVertexAttribArray=()=>{throw Error('ATTRIBUTE_CLEANUP_FAILURE');};
  let seen=Symbol('not-thrown');try{d.draw({program:p,mesh:m});}catch(error){seen=error;}
  assert.equal(seen,null);
  d.dispose();
});

test('E5 source repair: clean draw reports first cleanup exception and releases all attributes', () => {
  const {canvas,gl}=fakeCanvas(),d=createNativeWebGLDevice(canvas);
  const second={...attrib,name:'a_secondary'};
  gl.getAttribLocation=(_program,name)=>name==='a_position'?0:name==='a_secondary'?1:-1;
  const p=d.createProgram(shader),m=d.createMesh({attributes:[attrib,second],vertexCount:3});
  const calls=[];
  gl.disableVertexAttribArray=(loc)=>{calls.push('disable:'+loc);throw Error('DISABLE_FAILED:'+loc);};
  assert.throws(()=>d.draw({program:p,mesh:m,afterDraw(){calls.push('after');throw Error('AFTERDRAW_FAILURE');}}),/AFTERDRAW_FAILURE/);
  assert.deepEqual(calls,['after','disable:0','disable:1']);
  d.dispose();
});


test('E8 WebGL1 depth texture capability fails closed before allocating any GPU resources', () => {
  const {canvas,log}=fakeCanvas();
  const device=createNativeWebGLDevice(canvas);
  assert.throws(()=>device.createRenderTarget({width:5,height:4,depthTexture:true}),
    /WEBGL1_DEPTH_TEXTURE_EXTENSION_REQUIRED/);
  assert.equal(log.filter(x=>x==='createTexture').length,0);
  assert.equal(log.filter(x=>x==='createFramebuffer').length,0);
  assert.equal(device.status().renderTargets,0);
  device.dispose();
});

test('E8 WebGL1 depth-texture target samples DEPTH_COMPONENT16 storage via extension', () => {
  const {canvas,gl,log}=fakeCanvas({depthTexture:true});
  const previous={external:true};gl.bindTexture(gl.TEXTURE_2D,previous);
  const device=createNativeWebGLDevice(canvas);
  const target=device.createRenderTarget({width:3,height:5,depthTexture:true});
  assert.equal(target.definition.depthTexture,true);
  assert.equal(target.definition.depth,true);
  assert.equal(target.depthGpu,target.depthTexture.gpu);
  assert.equal(gl.getParameter(gl.TEXTURE_BINDING_2D),previous);
  assert(log.includes('depthTexImage2D:'+gl.DEPTH_COMPONENT+':'+gl.DEPTH_COMPONENT+':'+gl.UNSIGNED_SHORT));
  assert.equal(log.filter(x=>x==='framebufferTexture2D').length,2);
  assert.equal(log.filter(x=>x==='createRenderbuffer').length,0);
  assert.equal(device.status().estimatedTextureBytes,3*5*6);
  assert.equal(device.status().estimatedRenderbufferBytes,0);
  assert.equal(device.status().textures,2);
  const oldDepth=target.depthTexture.gpu,oldFbo=target.gpu;
  device.bindRenderTarget(target);
  device.resizeRenderTarget(target,7,9);
  assert.notEqual(target.depthTexture.gpu,oldDepth);
  assert.equal(target.depthTexture.gpu,target.depthGpu);
  assert.notEqual(target.gpu,oldFbo);
  assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING),target.gpu);
  assert.equal(device.status().estimatedTextureBytes,7*9*6);
  device.dispose();
  assert.equal(log.filter(x=>x==='deleteTexture').length,4);
  assert.equal(log.filter(x=>x==='deleteFramebuffer').length,2);
  assert.equal(log.filter(x=>x==='deleteRenderbuffer').length,0);
});

test('E8 WebGL2 native depth16 texture does not require WebGL1 extension and survives context restore', () => {
  const {canvas,gl,log}=fakeCanvas({webgl2:true});
  const device=createNativeWebGLDevice(canvas,{backend:'WEBGL2'});
  const target=device.createRenderTarget({width:6,height:4,depthTexture:true});
  assert(log.includes('depthTexImage2D:'+gl.DEPTH_COMPONENT16+':'+gl.DEPTH_COMPONENT+':'+gl.UNSIGNED_SHORT));
  const oldDepth=target.depthTexture.gpu,oldColor=target.colorTexture.gpu,oldFrame=target.gpu;
  canvas.trigger('webglcontextlost');
  assert.equal(target.depthTexture.gpu,null);
  assert.equal(target.depthGpu,null);
  assert.equal(device.status().lost,true);
  canvas.trigger('webglcontextrestored');
  assert.equal(device.status().lost,false);
  assert.notEqual(target.depthTexture.gpu,oldDepth);
  assert.notEqual(target.colorTexture.gpu,oldColor);
  assert.notEqual(target.gpu,oldFrame);
  assert.equal(target.depthGpu,target.depthTexture.gpu);
  assert.equal(device.status().estimatedTextureBytes,6*4*6);
  device.dispose();
  assert.equal(log.filter(x=>x==='deleteRenderbuffer').length,0);
});

test('E8 failed depth-texture framebuffer construction releases two provisional textures', () => {
  const {canvas,log}=fakeCanvas({webgl2:true,fboIncomplete:true});
  const device=createNativeWebGLDevice(canvas,{backend:'WEBGL2'});
  assert.throws(()=>device.createRenderTarget({width:4,height:4,depthTexture:true}),/FRAMEBUFFER_INCOMPLETE/);
  assert.equal(device.status().renderTargets,0);
  assert.equal(log.filter(x=>x==='deleteFramebuffer').length,1);
  assert.equal(log.filter(x=>x==='deleteTexture').length,2);
  assert.equal(log.filter(x=>x==='deleteRenderbuffer').length,0);
  device.dispose();
});

test('E8 failed shadow-depth resize preserves original framebuffer, depth sampler and dimensions', () => {
  const {canvas,gl,log}=fakeCanvas({webgl2:true,fboIncompleteAfter:2});
  const device=createNativeWebGLDevice(canvas,{backend:'WEBGL2'});
  const target=device.createRenderTarget({width:4,height:4,depthTexture:true});
  const frame=target.gpu,depth=target.depthGpu,color=target.colorTexture.gpu;
  device.bindRenderTarget(target);
  assert.throws(()=>device.resizeRenderTarget(target,9,7),/FRAMEBUFFER_INCOMPLETE/);
  assert.equal(target.gpu,frame);
  assert.equal(target.depthGpu,depth);
  assert.equal(target.depthTexture.gpu,depth);
  assert.equal(target.colorTexture.gpu,color);
  assert.equal(target.width,4);assert.equal(target.height,4);
  assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING),frame);
  assert.equal(device.status().estimatedTextureBytes,4*4*6);
  assert.equal(log.filter(x=>x==='deleteTexture').length,2);
  device.dispose();
  assert.equal(log.filter(x=>x==='deleteTexture').length,4);
});

test('E8 malformed depth-texture requests do not mutate GPU state and defaults remain legacy renderbuffers', () => {
  const {canvas,log}=fakeCanvas();
  const device=createNativeWebGLDevice(canvas);
  for(const opts of [{depthTexture:'yes'}, {depthTexture:1}, {depthTexture:true,depth:false}]) {
    assert.throws(()=>device.createRenderTarget({width:4,height:4,...opts}),/RENDER_TARGET_DEPTH_TEXTURE_INVALID/);
  }
  assert.equal(log.filter(x=>x==='createTexture').length,0);
  const legacy=device.createRenderTarget({width:4,height:4});
  assert.equal(legacy.depthTexture,null);
  assert(legacy.depthGpu);
  assert.equal(legacy.definition.depthTexture,false);
  assert.equal(device.status().estimatedRenderbufferBytes,4*4*2);
  device.dispose();
  assert.equal(log.filter(x=>x==='deleteRenderbuffer').length,1);
});

test('M1.1 dynamic mesh updates one GPU buffer in place, preserves ownership and caller isolation on WebGL1 and WebGL2', () => {
  for (const webgl2 of [false, true]) {
    const {canvas,gl,log,buffers} = fakeCanvas({webgl2});
    const device = createNativeWebGLDevice(canvas,{backend:webgl2?'WEBGL2':'WEBGL1'});
    const original = new Float32Array([-1,-1,0, 1,-1,0, 0,1,0]);
    const mesh = device.createMesh({attributes:[{name:'a_position',data:original,size:3,dynamic:true}],
      indices:new Uint16Array([0,1,2]),vertexCount:3});
    const buffer=mesh.gpu.attributes[0].buffer, before=log.filter(x=>x==='createBuffer').length;
    original[0]=999; // the caller never owns the retained dynamic snapshot
    assert.equal(mesh.definition.attributes[0].data[0],-1);
    const moving = new Float32Array([-0.5,-1,0, 1,-1,0, 0,1,0]);
    assert.equal(device.updateMeshAttribute(mesh,'a_position',moving),mesh);
    moving[0]=333;
    assert.equal(mesh.definition.attributes[0].data[0],-0.5);
    assert.equal(mesh.gpu.attributes[0].buffer,buffer);
    assert.equal(log.filter(x=>x==='createBuffer').length,before);
    assert.equal(log.filter(x=>x==='bufferSubData').length,1);
    assert.equal(buffers.get(buffer)[0],-0.5);
    assert.equal(device.status().meshes,1);
    for(let i=0;i<8;i++)device.updateMeshAttribute(mesh,'a_position',new Float32Array([i/10,-1,0,1,-1,0,0,1,0]));
    assert.equal(log.filter(x=>x==='createBuffer').length,before);
    assert.equal(device.status().meshes,1);
    device.dispose();
  }
});

test('M1.1 restores latest successful dynamic geometry after real device context recreation path', () => {
  const {canvas,buffers,log}=fakeCanvas();
  const device=createNativeWebGLDevice(canvas);
  const mesh=device.createMesh({attributes:[{name:'a_position',data:positions,size:3,dynamic:true}],vertexCount:3});
  device.updateMeshAttribute(mesh,'a_position',new Float32Array([0.25,0.5,0,1,-1,0,0,1,0]));
  const originalBuffer=mesh.gpu.attributes[0].buffer;
  canvas.trigger('webglcontextlost');
  assert.throws(()=>device.updateMeshAttribute(mesh,'a_position',positions),/GRAPHICS_CONTEXT_LOST/);
  canvas.trigger('webglcontextrestored');
  assert.equal(device.status().lost,false);
  const newBuffer=mesh.gpu.attributes[0].buffer;
  assert.notEqual(originalBuffer,newBuffer);
  assert.deepEqual(Array.from(buffers.get(newBuffer)),[0.25,0.5,0,1,-1,0,0,1,0]);
  assert(log.filter(x=>x==='createBuffer').length>=2);
  device.dispose();
});

test('M1.1 dynamic attribute schema and update input reject invalid types, lengths and ownership', () => {
  const {canvas}=fakeCanvas();
  const device=createNativeWebGLDevice(canvas),other=createNativeWebGLDevice(fakeCanvas().canvas);
  const mesh=device.createMesh({attributes:[{name:'a_position',data:positions,size:3,dynamic:true}],vertexCount:3});
  const staticMesh=device.createMesh({attributes:[attrib],vertexCount:3});
  assert.throws(()=>device.updateMeshAttribute(mesh,'nope',positions),/MESH_ATTRIBUTE_NOT_FOUND/);
  assert.throws(()=>device.updateMeshAttribute(staticMesh,'a_position',positions),/MESH_ATTRIBUTE_NOT_DYNAMIC/);
  assert.throws(()=>other.updateMeshAttribute(mesh,'a_position',positions),/MESH_NOT_OWNED_BY_DEVICE/);
  assert.throws(()=>device.updateMeshAttribute(mesh,'a_position',Array.from(positions)),/DYNAMIC_ATTRIBUTE_FLOAT32_REQUIRED/);
  assert.throws(()=>device.updateMeshAttribute(mesh,'a_position',new Float32Array([0,1,2])),/DYNAMIC_ATTRIBUTE_LENGTH_MISMATCH/);
  const bad=new Float32Array(positions);bad[0]=NaN;
  assert.throws(()=>device.updateMeshAttribute(mesh,'a_position',bad),/DYNAMIC_ATTRIBUTE_NONFINITE/);
  assert.throws(()=>device.createMesh({attributes:[{name:'a_position',data:new Uint16Array(9),size:3,dynamic:true}],vertexCount:3}),/DYNAMIC_ATTRIBUTE_FLOAT32_REQUIRED/);
  assert.throws(()=>device.createMesh({attributes:[{name:'a_position',data:new Float32Array(6),size:3,dynamic:true}],vertexCount:3}),/DYNAMIC_ATTRIBUTE_VERTEX_COUNT_MISMATCH/);
  assert.throws(()=>device.createMesh({attributes:[{name:'a_position',data:positions,size:3,dynamic:true,stride:12}],vertexCount:3}),/DYNAMIC_ATTRIBUTE_INTERLEAVED_UNSUPPORTED/);
  device.dispose();other.dispose();
});

test('M1.1 failed partial GPU update rolls back old bytes and does not commit corrupted CPU state', () => {
  const {canvas,log,buffers,gl}=fakeCanvas({failDynamicUploadOnce:true});
  const device=createNativeWebGLDevice(canvas);
  const mesh=device.createMesh({attributes:[{name:'a_position',data:positions,size:3,dynamic:true}],vertexCount:3});
  const original=Array.from(mesh.definition.attributes[0].data);
  const oldBinding=gl.getParameter(gl.ARRAY_BUFFER_BINDING);
  assert.throws(()=>device.updateMeshAttribute(mesh,'a_position',new Float32Array([0,0,0,1,-1,0,0,1,0])),/SIMULATED_PARTIAL_GPU_UPLOAD/);
  assert.deepEqual(Array.from(mesh.definition.attributes[0].data),original);
  assert.deepEqual(Array.from(buffers.get(mesh.gpu.attributes[0].buffer)),original);
  assert.equal(gl.getParameter(gl.ARRAY_BUFFER_BINDING),oldBinding);
  assert.equal(log.filter(x=>x==='bufferSubData').length,2);
  assert.equal(device.status().restorationError,null);
  device.dispose();
});
