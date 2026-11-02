import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNativeWebGLDevice } from './dgb.native-webgl-device.v1.mjs';

function fakeCanvas({ webgl2 = false, uint32 = false, compileFail = false, linkFail = false } = {}) {
  const log = [], handlers = new Map();
  let contextLost = false, id = 0;
  const obj = type => ({ type, id: ++id });
  const gl = {
    VERTEX_SHADER: 1, FRAGMENT_SHADER: 2, COMPILE_STATUS: 3, LINK_STATUS: 4,
    ARRAY_BUFFER: 5, ELEMENT_ARRAY_BUFFER: 6, STATIC_DRAW: 7,
    FLOAT: 8, TRIANGLES: 9, UNSIGNED_SHORT: 10, UNSIGNED_BYTE: 11, UNSIGNED_INT: 12,
    createShader() { log.push('createShader'); return obj('shader'); },
    shaderSource() {}, compileShader() {}, getShaderParameter() { return !compileFail; },
    getShaderInfoLog() { return 'mock compile error'; }, deleteShader() { log.push('deleteShader'); },
    createProgram() { log.push('createProgram'); return obj('program'); },
    attachShader() {}, linkProgram() {}, getProgramParameter() { return !linkFail; },
    getProgramInfoLog() { return 'mock link error'; }, deleteProgram() { log.push('deleteProgram'); },
    createBuffer() { log.push('createBuffer'); return obj('buffer'); },
    bindBuffer() {}, bufferData() { log.push('bufferData'); }, deleteBuffer() { log.push('deleteBuffer'); },
    getExtension(n) { return n === 'OES_element_index_uint' && uint32 ? {} : null; },
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
