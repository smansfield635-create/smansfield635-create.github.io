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
  const textures = new Set();
  const targets = new Set();
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

  // Resource records retain their definitions; raw GPU handles never survive context loss.
  const byteSize = (width, height, components = 4) => {
    const bytes = width * height * components;
    if (!Number.isSafeInteger(bytes)) throw new RangeError('RESOURCE_BYTE_SIZE_INVALID');
    return bytes;
  };
  function validateImageSize(width, height, withDepth = false) {
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1) {
      throw new TypeError('RESOURCE_SIZE_INVALID');
    }
    byteSize(width, height);
    const textureLimit = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (!Number.isInteger(textureLimit) || textureLimit < 1) throw new Error('TEXTURE_LIMIT_UNAVAILABLE');
    if (width > textureLimit || height > textureLimit) throw new RangeError('TEXTURE_SIZE_LIMIT_EXCEEDED');
    if (withDepth) {
      const depthLimit = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
      if (!Number.isInteger(depthLimit) || depthLimit < 1) throw new Error('RENDERBUFFER_LIMIT_UNAVAILABLE');
      if (width > depthLimit || height > depthLimit) throw new RangeError('RENDERBUFFER_SIZE_LIMIT_EXCEEDED');
    }
  }
  function validateTextureDefinition({ width, height, pixels = null, filter = 'NEAREST' } = {}) {
    validateImageSize(width, height);
    if (filter !== 'NEAREST' && filter !== 'LINEAR') throw new TypeError('TEXTURE_FILTER_UNSUPPORTED');
    if (pixels !== null && !(pixels instanceof Uint8Array || pixels instanceof Uint8ClampedArray)) {
      throw new TypeError('RGBA8_PIXELS_REQUIRED');
    }
    if (pixels !== null && pixels.byteLength !== byteSize(width, height)) {
      throw new RangeError('RGBA8_PIXEL_LENGTH_MISMATCH');
    }
    return { width, height, filter, pixels: pixels === null ? null : new Uint8Array(pixels) };
  }
  function allocateTexture(definition) {
    const priorTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
    const priorAlignment = gl.getParameter(gl.UNPACK_ALIGNMENT);
    let texture = null;
    try {
      texture = gl.createTexture();
      if (!texture) throw new Error('TEXTURE_ALLOCATION_FAILED');
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[definition.filter]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[definition.filter]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, definition.width, definition.height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, definition.pixels);
      if (typeof gl.getError === 'function') {
        const error = gl.getError();
        if (error !== gl.NO_ERROR) throw new Error('TEXTURE_UPLOAD_GL_ERROR:' + error);
      }
      return texture;
    } catch (error) {
      if (texture) gl.deleteTexture(texture);
      throw error;
    } finally {
      gl.bindTexture(gl.TEXTURE_2D, priorTexture);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, priorAlignment);
    }
  }
  function createTexture2D(specification) {
    assertActive();
    const definition = validateTextureDefinition(specification);
    const record = { definition, gpu: allocateTexture(definition) };
    textures.add(record);
    return record;
  }
  function releaseTargetParts(framebuffer, depthBuffer, colorTexture) {
    if (framebuffer) gl.deleteFramebuffer(framebuffer);
    if (depthBuffer) gl.deleteRenderbuffer(depthBuffer);
    if (colorTexture) gl.deleteTexture(colorTexture);
  }
  function allocateTargetParts(definition) {
    const oldFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    const oldRenderbuffer = gl.getParameter(gl.RENDERBUFFER_BINDING);
    let colorTexture = null, framebuffer = null, depthBuffer = null;
    try {
      colorTexture = allocateTexture({ width: definition.width, height: definition.height,
        pixels: null, filter: 'NEAREST' });
      framebuffer = gl.createFramebuffer();
      if (!framebuffer) throw new Error('FRAMEBUFFER_ALLOCATION_FAILED');
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
      if (definition.depth) {
        depthBuffer = gl.createRenderbuffer();
        if (!depthBuffer) throw new Error('RENDERBUFFER_ALLOCATION_FAILED');
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, definition.width, definition.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
      }
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('FRAMEBUFFER_INCOMPLETE');
      }
      return { framebuffer, colorTexture, depthBuffer };
    } catch (error) {
      releaseTargetParts(framebuffer, depthBuffer, colorTexture);
      throw error;
    } finally {
      gl.bindRenderbuffer(gl.RENDERBUFFER, oldRenderbuffer);
      gl.bindFramebuffer(gl.FRAMEBUFFER, oldFramebuffer);
    }
  }
  function createRenderTarget({ width, height, depth = true } = {}) {
    assertActive();
    if (typeof depth !== 'boolean') throw new TypeError('RENDER_TARGET_DEPTH_INVALID');
    validateImageSize(width, height, depth);
    const definition = { width, height, depth };
    const parts = allocateTargetParts(definition);
    const record = { definition, width, height, gpu: parts.framebuffer,
      colorTexture: { gpu: parts.colorTexture }, depthGpu: parts.depthBuffer };
    targets.add(record);
    return record;
  }
  function bindRenderTarget(target = null) {
    assertActive();
    if (target !== null) requireOwned(targets, target, 'RENDER_TARGET');
    gl.bindFramebuffer(gl.FRAMEBUFFER, target === null ? null : target.gpu);
    gl.viewport(0, 0, target === null ? canvas.width : target.width,
      target === null ? canvas.height : target.height);
  }
  function resizeRenderTarget(target, width, height) {
    assertActive();
    requireOwned(targets, target, 'RENDER_TARGET');
    validateImageSize(width, height, target.definition.depth);
    if (width === target.width && height === target.height) return target;
    const bound = gl.getParameter(gl.FRAMEBUFFER_BINDING) === target.gpu;
    const replacement = allocateTargetParts({ width, height, depth: target.definition.depth });
    const previous = { framebuffer: target.gpu, depthBuffer: target.depthGpu,
      colorTexture: target.colorTexture.gpu };
    target.definition = { width, height, depth: target.definition.depth };
    target.width = width;
    target.height = height;
    target.gpu = replacement.framebuffer;
    target.colorTexture.gpu = replacement.colorTexture;
    target.depthGpu = replacement.depthBuffer;
    if (bound) bindRenderTarget(target);
    releaseTargetParts(previous.framebuffer, previous.depthBuffer, previous.colorTexture);
    return target;
  }
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
      for (const target of targets) releaseTargetParts(target.gpu, target.depthGpu, target.colorTexture.gpu);
      for (const texture of textures) if (texture.gpu) gl.deleteTexture(texture.gpu);
      for (const mesh of meshes) {
        if (mesh.gpu) {
          for (const attr of mesh.gpu.attributes) gl.deleteBuffer(attr.buffer);
          if (mesh.gpu.index) gl.deleteBuffer(mesh.gpu.index);
        }
      }
      for (const program of programs) if (program.gpu) gl.deleteProgram(program.gpu);
    }
    for (const target of targets) {
      target.gpu = null; target.colorTexture.gpu = null; target.depthGpu = null;
    }
    for (const texture of textures) texture.gpu = null;
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
      for (const t of textures) t.gpu = allocateTexture(t.definition);
      for (const target of targets) {
        const next = allocateTargetParts(target.definition);
        target.gpu = next.framebuffer; target.colorTexture.gpu = next.colorTexture;
        target.depthGpu = next.depthBuffer;
      }
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
    for (const t of textures) t.gpu = null;
    for (const target of targets) {
      target.gpu = null; target.colorTexture.gpu = null; target.depthGpu = null;
    }
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
    textures.clear();
    targets.clear();
    disposed = true;
    canvas.removeEventListener?.('webglcontextlost', onContextLost, false);
    canvas.removeEventListener?.('webglcontextrestored', onContextRestored, false);
  }
  return Object.freeze({
    backend, gl, createProgram, createMesh, createTexture2D, createRenderTarget,
    bindRenderTarget, resizeRenderTarget, draw, viewport, recover, dispose,
    status() {
      const estimatedTextureBytes = [...textures].reduce((n, t) => n + byteSize(t.definition.width, t.definition.height), 0) +
        [...targets].reduce((n, t) => n + byteSize(t.width, t.height), 0);
      const estimatedRenderbufferBytes = [...targets].reduce((n, t) =>
        n + (t.definition.depth ? byteSize(t.width, t.height, 2) : 0), 0);
      const estimatedMeshBytes = [...meshes].reduce((n, m) =>
        n + m.definition.attributes.reduce((sum, a) => sum + a.data.byteLength, 0) +
        (m.definition.indices?.byteLength ?? 0), 0);
      return Object.freeze({ backend, lost, disposed, restorationError: restorationError?.message ?? null,
        programs: programs.size, meshes: meshes.size, textures: textures.size + targets.size,
        renderTargets: targets.size, estimatedTextureBytes, estimatedRenderbufferBytes,
        estimatedTotalResourceBytes: estimatedTextureBytes + estimatedRenderbufferBytes + estimatedMeshBytes,
        memoryBasis: 'ENGINE_OWNED_ALLOCATION_ESTIMATE_NOT_VRAM_TOTAL' });
    }
  });
}
