import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNativeWebGLDevice } from './dgb.native-webgl-device.v1.mjs';

function fakeCanvas({ webgl2 = false, uint32 = false, compileFail = false, linkFail = false, fboIncomplete = false, textureFail = false } = {}) {
  const log = [], handlers = new Map();
  let contextLost = false, id = 0;
  const bindings = { texture: null, framebuffer: null, renderbuffer: null, unpack: 4 };
  const obj = type => ({ type, id: ++id });
  const gl = {
    VERTEX_SHADER: 1, FRAGMENT_SHADER: 2, COMPILE_STATUS: 3, LINK_STATUS: 4,
    ARRAY_BUFFER: 5, ELEMENT_ARRAY_BUFFER: 6, STATIC_DRAW: 7,
    FLOAT: 8, TRIANGLES: 9, UNSIGNED_SHORT: 10, UNSIGNED_BYTE: 11, UNSIGNED_INT: 12,
    TEXTURE_2D: 13, RGBA: 14, TEXTURE_BINDING_2D: 15, UNPACK_ALIGNMENT: 16,
    TEXTURE_WRAP_S: 17, TEXTURE_WRAP_T: 18, TEXTURE_MIN_FILTER: 19, TEXTURE_MAG_FILTER: 20,
    CLAMP_TO_EDGE: 21, NEAREST: 22, LINEAR: 23, MAX_TEXTURE_SIZE: 24,
    MAX_RENDERBUFFER_SIZE: 25, FRAMEBUFFER: 26, FRAMEBUFFER_BINDING: 27,
    COLOR_ATTACHMENT0: 28, DEPTH_ATTACHMENT: 29, FRAMEBUFFER_COMPLETE: 30,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 31, RENDERBUFFER: 32,
    RENDERBUFFER_BINDING: 33, DEPTH_COMPONENT16: 34,
    createShader() { log.push('createShader'); return obj('shader'); },
    shaderSource() {}, compileShader() {}, getShaderParameter() { return !compileFail; },
    getShaderInfoLog() { return 'mock compile error'; }, deleteShader() { log.push('deleteShader'); },
    createProgram() { log.push('createProgram'); return obj('program'); },
    attachShader() {}, linkProgram() {}, getProgramParameter() { return !linkFail; },
    getProgramInfoLog() { return 'mock link error'; }, deleteProgram() { log.push('deleteProgram'); },
    createBuffer() { log.push('createBuffer'); return obj('buffer'); },
    bindBuffer() {}, bufferData() { log.push('bufferData'); }, deleteBuffer() { log.push('deleteBuffer'); },
    getExtension(n) { return n === 'OES_element_index_uint' && uint32 ? {} : null; },
    getParameter(p) {
      if (p === this.MAX_TEXTURE_SIZE || p === this.MAX_RENDERBUFFER_SIZE) return 1024;
      if (p === this.TEXTURE_BINDING_2D) return bindings.texture;
      if (p === this.FRAMEBUFFER_BINDING) return bindings.framebuffer;
      if (p === this.RENDERBUFFER_BINDING) return bindings.renderbuffer;
      if (p === this.UNPACK_ALIGNMENT) return bindings.unpack;
      return null;
    },
    createTexture() { log.push('createTexture'); return textureFail ? null : obj('texture'); },
    bindTexture(_target, handle) { bindings.texture = handle; log.push('bindTexture'); },
    pixelStorei(_name, value) { bindings.unpack = value; },
    texParameteri() { log.push('texParameteri'); },
    texImage2D(_target, _level, _format, width, height, _border, _format2, _type, pixels) {
      log.push('texImage2D:' + width + 'x' + height + ':' + (pixels?.byteLength ?? 'null'));
    },
    deleteTexture() { log.push('deleteTexture'); },
    createFramebuffer() { log.push('createFramebuffer'); return obj('framebuffer'); },
    bindFramebuffer(_target, handle) { bindings.framebuffer = handle; log.push('bindFramebuffer'); },
    framebufferTexture2D() { log.push('framebufferTexture2D'); },
    checkFramebufferStatus() { return fboIncomplete ? this.FRAMEBUFFER_INCOMPLETE_ATTACHMENT : this.FRAMEBUFFER_COMPLETE; },
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
  return { canvas, gl, log };
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
