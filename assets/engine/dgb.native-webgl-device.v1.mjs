/** Diamond Gate native GPU device v1.
 * Owns WebGL resources for ONE canvas/context. It does not own cameras, scene truth,
 * materials, shader dialect conversion, product RAFs, or production publication.
 * Asset definitions are held while device is alive to permit context restoration;
 * callers must treat supplied typed arrays and shader strings as immutable.
 */
export function createNativeWebGLDevice(canvas, {
  backend = 'WEBGL1',
  contextAttributes = { alpha: true, antialias: true, depth: true }
} = {}) {
  if (!canvas || typeof canvas.getContext !== 'function') throw new TypeError('CANVAS_REQUIRED');
  if (backend !== 'WEBGL1' && backend !== 'WEBGL2') throw new TypeError('BACKEND_UNSUPPORTED');
  const gl = canvas.getContext(backend === 'WEBGL2' ? 'webgl2' : 'webgl', contextAttributes);
  if (!gl) throw new Error(`${backend}_CONTEXT_UNAVAILABLE`);

  const programs = new Set();
  const meshes = new Set();
  let lost = false, disposed = false, restorationError = null;
  const assertActive = () => {
    if (disposed) throw new Error('DEVICE_DISPOSED');
    if (lost || gl.isContextLost?.()) throw new Error('GRAPHICS_CONTEXT_LOST');
    if (restorationError) throw restorationError;
  };
  const requireOwned = (set, item, kind) => {
    if (!set.has(item)) throw new Error(`${kind}_NOT_OWNED_BY_DEVICE`);
    if (!item.gpu) throw new Error(`${kind}_NOT_RESIDENT`);
  };
  function shader(type, source) {
    if (typeof source !== 'string' || !source.trim()) throw new TypeError('SHADER_SOURCE_REQUIRED');
    const out = gl.createShader(type);
    if (!out) throw new Error('SHADER_ALLOCATION_FAILED');
    try {
      gl.shaderSource(out, source);
      gl.compileShader(out);
      if (!gl.getShaderParameter(out, gl.COMPILE_STATUS)) {
        throw new Error('SHADER_COMPILE_FAILED: ' + (gl.getShaderInfoLog(out) || 'unknown'));
      }
      return out;
    } catch (error) {
      gl.deleteShader(out);
      throw error;
    }
  }
  function linkProgram(definition) {
    const vertex = shader(gl.VERTEX_SHADER, definition.vertexSource);
    let fragment = null, program = null, ok = false;
    try {
      fragment = shader(gl.FRAGMENT_SHADER, definition.fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error('PROGRAM_ALLOCATION_FAILED');
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('PROGRAM_LINK_FAILED: ' + (gl.getProgramInfoLog(program) || 'unknown'));
      }
      ok = true;
      return program;
    } finally {
      gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      if (!ok && program) gl.deleteProgram(program);
    }
  }
  function createBuffer(target, bytes, usage) {
    const b = gl.createBuffer();
    if (!b) throw new Error('BUFFER_ALLOCATION_FAILED');
    try {
      gl.bindBuffer(target, b);
      gl.bufferData(target, bytes, usage);
      return b;
    } catch (e) {
      gl.deleteBuffer(b);
      throw e;
    }
  }
  function uploadMesh(definition) {
    const owned = [];
    try {
      const attributes = definition.attributes.map(attr => {
        const buffer = createBuffer(gl.ARRAY_BUFFER, attr.data, definition.usage ?? gl.STATIC_DRAW);
        owned.push(buffer);
        return { ...attr, buffer };
      });
      let index = null, indexType = null;
      if (definition.indices) {
        if (definition.indices instanceof Uint16Array) indexType = gl.UNSIGNED_SHORT;
        else if (definition.indices instanceof Uint8Array) indexType = gl.UNSIGNED_BYTE;
        else if (definition.indices instanceof Uint32Array) {
          if (backend === 'WEBGL1' && !gl.getExtension('OES_element_index_uint')) {
            throw new Error('WEBGL1_UINT32_INDICES_EXTENSION_REQUIRED');
          }
          indexType = gl.UNSIGNED_INT;
        } else throw new TypeError('INDEX_TYPE_UNSUPPORTED');
        index = createBuffer(gl.ELEMENT_ARRAY_BUFFER, definition.indices, definition.usage ?? gl.STATIC_DRAW);
        owned.push(index);
      }
      return { attributes, index, indexType };
    } catch (error) {
      for (const buffer of owned) gl.deleteBuffer(buffer);
      throw error;
    }
  }
  function createProgram({ vertexSource, fragmentSource }) {
    assertActive();
    const definition = { vertexSource, fragmentSource };
    const record = { definition, gpu: linkProgram(definition) };
    programs.add(record);
    return record;
  }
  function createMesh({ attributes, indices = null, vertexCount, usage } = {}) {
    assertActive();
    if (!Array.isArray(attributes) || !attributes.length) throw new TypeError('MESH_ATTRIBUTES_REQUIRED');
    if (!Number.isInteger(vertexCount) || vertexCount < 1) throw new TypeError('VERTEX_COUNT_INVALID');
    const seen = new Set();
    for (const a of attributes) {
      if (!a || typeof a.name !== 'string' || !a.name || seen.has(a.name)) throw new TypeError('ATTRIBUTE_NAME_INVALID_OR_DUPLICATE');
      seen.add(a.name);
      if (!ArrayBuffer.isView(a.data) || a.data instanceof DataView || !a.data.byteLength) throw new TypeError('ATTRIBUTE_TYPED_DATA_REQUIRED');
      if (!Number.isInteger(a.size) || a.size < 1 || a.size > 4) throw new TypeError('ATTRIBUTE_SIZE_INVALID');
      if (a.integer && backend !== 'WEBGL2') throw new Error('INTEGER_ATTRIBUTE_REQUIRES_WEBGL2');
    }
    if (indices && (!ArrayBuffer.isView(indices) || !indices.length)) throw new TypeError('INDICES_TYPED_DATA_REQUIRED');
    const definition = { attributes, indices, vertexCount, usage };
    const record = { definition, gpu: uploadMesh(definition) };
    meshes.add(record);
    return record;
  }
  function draw({ program, mesh, mode = gl.TRIANGLES, first = 0, count = null, beforeDraw } = {}) {
    assertActive();
    requireOwned(programs, program, 'PROGRAM');
    requireOwned(meshes, mesh, 'MESH');
    if (!Number.isInteger(first) || first < 0) throw new TypeError('FIRST_VERTEX_INVALID');
    const max = mesh.definition.indices ? mesh.definition.indices.length : mesh.definition.vertexCount;
    const actualCount = count === null ? max - first : count;
    if (!Number.isInteger(actualCount) || actualCount <= 0 || first + actualCount > max) throw new TypeError('DRAW_RANGE_INVALID');
    const enabled = [];
    gl.useProgram(program.gpu);
    try {
      for (const attr of mesh.gpu.attributes) {
        const loc = gl.getAttribLocation(program.gpu, attr.name);
        if (loc < 0) continue;
        gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
        gl.enableVertexAttribArray(loc);
        enabled.push(loc);
        const type = attr.type ?? gl.FLOAT;
        if (attr.integer) gl.vertexAttribIPointer(loc, attr.size, type, attr.stride ?? 0, attr.offset ?? 0);
        else gl.vertexAttribPointer(loc, attr.size, type, Boolean(attr.normalized), attr.stride ?? 0, attr.offset ?? 0);
      }
      if (typeof beforeDraw === 'function') beforeDraw(gl, program.gpu);
      if (mesh.gpu.index) {
        const size = mesh.gpu.indexType === gl.UNSIGNED_INT ? 4 : mesh.gpu.indexType === gl.UNSIGNED_SHORT ? 2 : 1;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.gpu.index);
        gl.drawElements(mode, actualCount, mesh.gpu.indexType, first * size);
      } else gl.drawArrays(mode, first, actualCount);
    } finally {
      for (const loc of enabled) gl.disableVertexAttribArray(loc);
    }
    return { backend, indexed: Boolean(mesh.gpu.index), verticesOrIndices: actualCount };
  }
  function viewport(width = canvas.width, height = canvas.height) {
    assertActive();
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new TypeError('VIEWPORT_INVALID');
    gl.viewport(0, 0, width, height);
  }
  function destroyResources() {
    if (!lost && !gl.isContextLost?.()) {
      for (const mesh of meshes) {
        if (mesh.gpu) {
          for (const attr of mesh.gpu.attributes) gl.deleteBuffer(attr.buffer);
          if (mesh.gpu.index) gl.deleteBuffer(mesh.gpu.index);
        }
      }
      for (const program of programs) if (program.gpu) gl.deleteProgram(program.gpu);
    }
    for (const mesh of meshes) mesh.gpu = null;
    for (const program of programs) program.gpu = null;
  }
  function recover() {
    if (disposed) throw new Error('DEVICE_DISPOSED');
    if (!lost && !restorationError) throw new Error('RECOVERY_REQUIRES_CONTEXT_LOSS');
    if (gl.isContextLost?.()) throw new Error('GRAPHICS_CONTEXT_STILL_LOST');
    // Do not resurrect stale WebGL handles: recreate all device-owned resources.
    lost = false;
    restorationError = null;
    try {
      for (const p of programs) p.gpu = linkProgram(p.definition);
      for (const m of meshes) m.gpu = uploadMesh(m.definition);
    } catch (error) {
      restorationError = error;
      destroyResources();
      throw error;
    }
  }
  function onContextLost(event) {
    event.preventDefault?.();
    lost = true;
    for (const p of programs) p.gpu = null;
    for (const m of meshes) m.gpu = null;
  }
  function onContextRestored() {
    try { recover(); } catch (_) { /* fail closed; status exposes error */ }
  }
  canvas.addEventListener?.('webglcontextlost', onContextLost, false);
  canvas.addEventListener?.('webglcontextrestored', onContextRestored, false);
  function dispose() {
    if (disposed) return;
    destroyResources();
    programs.clear();
    meshes.clear();
    disposed = true;
    canvas.removeEventListener?.('webglcontextlost', onContextLost, false);
    canvas.removeEventListener?.('webglcontextrestored', onContextRestored, false);
  }
  return Object.freeze({
    backend, gl, createProgram, createMesh, draw, viewport, recover, dispose,
    status() { return Object.freeze({ backend, lost, disposed, restorationError: restorationError?.message ?? null, programs: programs.size, meshes: meshes.size }); }
  });
}
