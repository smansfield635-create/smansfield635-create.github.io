/**
 * H_EARTH_FOUR_TREE_COMPACT_FOLIAGE_V1
 * Generation 2633: bounded compact leaf-buffer custody and resource accounting.
 * This module does not assert that a standalone reconstruction proof qualifies
 * the integrated renderer. Color/shadow integration and device review remain gates.
 */
export const FOUR_TREE_COMPACT_TARGETS = Object.freeze([
  'P2_TREE_A_03', 'P2_TREE_A_06', 'P2_TREE_A_08', 'P2_TREE_A_11'
]);
export const FOUR_TREE_COMPACT_CONTRACT = Object.freeze({
  schema: 'H_EARTH_FOUR_TREE_COMPACT_FOLIAGE_v1',
  approvedSource: '9cff8bbd6ccca95ccd51da72570f92af4778425a',
  leafCount: 7168,
  compactRecordBytes: 24,
  sidecarRecordBytes: 32,
  compactBufferBytes: 172032,
  sidecarBufferBytes: 229376,
  maxAddedGpuBytes: 6291456,
  maxAddedMainDraws: 4,
  maxAddedShadowDraws: 4,
  maxAddedPrograms: 2,
  maxAddedBuffers: 3,
  maxAddedVertexArrays: 1,
  maxAddedTextures: 0,
  maxAddedFramebuffers: 0,
  targets: FOUR_TREE_COMPACT_TARGETS
});
function exactBytes(view, bytes, label) {
  if (!ArrayBuffer.isView(view) || view.byteLength !== bytes) {
    throw new RangeError(`FOUR_TREE_COMPACT_${label}_BYTE_LENGTH`);
  }
  return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}
export function validateFourTreeCompactPayload({ compactRecords, contactSidecar, leafCount = 7168 }) {
  if (leafCount !== FOUR_TREE_COMPACT_CONTRACT.leafCount) {
    throw new RangeError('FOUR_TREE_COMPACT_LEAF_COUNT');
  }
  const compact = exactBytes(compactRecords, leafCount * 24, 'RECORD');
  const sidecar = exactBytes(contactSidecar, leafCount * 32, 'SIDECAR');
  return Object.freeze({ leafCount, compactBytes: compact.byteLength,
    sidecarBytes: sidecar.byteLength, totalBytes: compact.byteLength + sidecar.byteLength });
}
/**
 * Uploads the exact already-qualified packed bytes. Does not re-encode them:
 * reconstructing a different quantizer would invalidate the preserved GPU proof.
 * Caller retains ownership and must invoke dispose exactly once.
 */
export function createFourTreeCompactGpuBuffers(gl, payload) {
  if (!gl || typeof gl.createBuffer !== 'function') throw new TypeError('WEBGL2_REQUIRED');
  const accounting = validateFourTreeCompactPayload(payload);
  const created = [];
  try {
    for (const source of [payload.compactRecords, payload.contactSidecar]) {
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error('FOUR_TREE_COMPACT_BUFFER_ALLOCATION_FAILED');
      created.push(buffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    let disposed = false;
    return Object.freeze({
      compactBuffer: created[0], contactSidecarBuffer: created[1],
      accounting: Object.freeze({ ...accounting, bufferCount: 2,
        actualUploadedBytes: accounting.totalBytes }),
      dispose() {
        if (disposed) return;
        disposed = true;
        for (const buffer of created) gl.deleteBuffer(buffer);
      }
    });
  } catch (error) {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    for (const buffer of created) gl.deleteBuffer(buffer);
    throw error;
  }
}

/**
 * WebGL2 reconstruction contract for the qualified 24-byte packed stream.
 * Packed records are six little-endian uint32 words; the caller supplies
 * the original quantization scales and origin, not inferred scene constants.
 * Each leaf occupies four logical vertices in a six-index quad.
 */
export const FOUR_TREE_COMPACT_VERTEX_GLSL = `
precision highp float;
precision highp int;
layout(location=10) in uvec4 aCompactWords0;
layout(location=11) in uvec2 aCompactWords1;
uniform vec3 uCompactOrigin;
uniform vec3 uCompactPositionScale;
uniform vec2 uCompactLeafExtentScale;
vec3 reconstructCompactCenter(uvec4 words) {
  ivec3 signedCenter=ivec3(
    int(words.x<<16)>>16, int(words.x)>>16,
    int(words.y<<16)>>16);
  return uCompactOrigin+vec3(signedCenter)*uCompactPositionScale;
}
vec3 reconstructCompactCorner(uvec4 words, uvec2 extra, uint corner) {
  vec3 center=reconstructCompactCenter(words);
  float yaw=float(words.y>>16)*(6.283185307179586/65535.0);
  vec2 axis=vec2(cos(yaw),sin(yaw));
  vec2 orthogonal=vec2(-axis.y,axis.x);
  vec2 extent=vec2(float(words.z&65535u),float(words.z>>16))*uCompactLeafExtentScale;
  vec2 signs=vec2((corner&1u)==0u?-1.0:1.0,(corner&2u)==0u?-1.0:1.0);
  vec2 offset=axis*extent.x*signs.x+orthogonal*extent.y*signs.y;
  return center+vec3(offset.x,0.0,offset.y);
}
`;
/**
 * Complete WebGL2 shader pair for the existing packed reconstruction contract.
 * The caller supplies approved transforms; no new leaf geometry is generated.
 */
export const FOUR_TREE_COMPACT_COLOR_VERTEX_GLSL = `#version 300 es
${FOUR_TREE_COMPACT_VERTEX_GLSL}
uniform mat4 uCompactViewProjection;
void main() {
  vec3 position = reconstructCompactCorner(aCompactWords0, aCompactWords1, uint(gl_VertexID));
  gl_Position = uCompactViewProjection * vec4(position, 1.0);
}`;
export const FOUR_TREE_COMPACT_SHADOW_VERTEX_GLSL = `#version 300 es
${FOUR_TREE_COMPACT_VERTEX_GLSL}
uniform mat4 uCompactLightMatrix;
void main() {
  vec3 position = reconstructCompactCorner(aCompactWords0, aCompactWords1, uint(gl_VertexID));
  gl_Position = uCompactLightMatrix * vec4(position, 1.0);
}`;
export function bindFourTreeCompactMatrix(gl, program, name, matrix) {
  if (!gl || !program || !['uCompactViewProjection','uCompactLightMatrix'].includes(name))
    throw new TypeError('FOUR_TREE_COMPACT_MATRIX_BINDING_INVALID');
  if ((!Array.isArray(matrix) && !(matrix instanceof Float32Array)) ||
      matrix.length !== 16 || Array.from(matrix).some(v => !Number.isFinite(v)))
    throw new RangeError('FOUR_TREE_COMPACT_MATRIX_INVALID');
  const location=gl.getUniformLocation(program,name);
  if(location==null)throw new Error('FOUR_TREE_COMPACT_MATRIX_UNIFORM_INACTIVE:'+name);
  gl.useProgram(program);
  gl.uniformMatrix4fv(location,false,new Float32Array(matrix));
  return true;
}
export const FOUR_TREE_COMPACT_COLOR_FRAGMENT_GLSL = `#version 300 es
precision highp float;
out vec4 compactColor;
void main() { compactColor = vec4(0.33, 0.40, 0.21, 1.0); }`;
export const FOUR_TREE_COMPACT_SHADOW_FRAGMENT_GLSL = `#version 300 es
precision highp float;
void main() {}
`;

/**
 * Compile both compact passes as one owned GPU resource transaction.
 * The persistent renderer can install these programs with the approved
 * packed payload, then dispose the pair when the residency is released.
 */
export function createFourTreeCompactPrograms(gl) {
  if (!gl || typeof gl.createShader !== 'function') throw new TypeError('FOUR_TREE_COMPACT_WEBGL2_REQUIRED');
  const shaders=[], programs=[];
  const compile=(type,source,label)=>{
    const shader=gl.createShader(type);
    if(!shader)throw Error('FOUR_TREE_COMPACT_SHADER_ALLOCATION:'+label);
    shaders.push(shader);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
      throw Error('FOUR_TREE_COMPACT_SHADER_COMPILE:'+label+':'+gl.getShaderInfoLog(shader));
    return shader;
  };
  const link=(vertex,fragment,label)=>{
    const program=gl.createProgram();
    if(!program)throw Error('FOUR_TREE_COMPACT_PROGRAM_ALLOCATION:'+label);
    programs.push(program);
    gl.attachShader(program,vertex);
    gl.attachShader(program,fragment);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))
      throw Error('FOUR_TREE_COMPACT_PROGRAM_LINK:'+label+':'+gl.getProgramInfoLog(program));
    return program;
  };
  try {
    const color=link(compile(gl.VERTEX_SHADER,FOUR_TREE_COMPACT_COLOR_VERTEX_GLSL,'COLOR_VS'),
      compile(gl.FRAGMENT_SHADER,FOUR_TREE_COMPACT_COLOR_FRAGMENT_GLSL,'COLOR_FS'),'COLOR');
    const shadow=link(compile(gl.VERTEX_SHADER,FOUR_TREE_COMPACT_SHADOW_VERTEX_GLSL,'SHADOW_VS'),
      compile(gl.FRAGMENT_SHADER,FOUR_TREE_COMPACT_SHADOW_FRAGMENT_GLSL,'SHADOW_FS'),'SHADOW');
    for(const shader of shaders)gl.deleteShader(shader);
    let disposed=false;
    return Object.freeze({color,shadow,programCount:2,dispose(){
      if(disposed)return;
      disposed=true;
      for(const program of programs)gl.deleteProgram(program);
    }});
  }catch(error){
    for(const program of programs)gl.deleteProgram(program);
    for(const shader of shaders)gl.deleteShader(shader);
    throw error;
  }
}

/**
 * Binds the exact quantization descriptors to an existing compact shader.
 * This deliberately rejects guessed defaults: all scales and the source
 * origin must be supplied from the approved packing receipt.
 */
export function bindFourTreeCompactReconstructionUniforms(gl, program, descriptor) {
  if (!gl || !program || !descriptor) throw new TypeError('FOUR_TREE_COMPACT_UNIFORM_INPUT_REQUIRED');
  const specs = [
    ['uCompactOrigin', descriptor.origin, 3],
    ['uCompactPositionScale', descriptor.positionScale, 3],
    ['uCompactLeafExtentScale', descriptor.leafExtentScale, 2]
  ];
  for (const [name, values, count] of specs) {
    if (!Array.isArray(values) && !(values instanceof Float32Array))
      throw new TypeError('FOUR_TREE_COMPACT_UNIFORM_VECTOR_REQUIRED:' + name);
    if (values.length !== count || Array.from(values).some(v => !Number.isFinite(v)))
      throw new RangeError('FOUR_TREE_COMPACT_UNIFORM_VECTOR_INVALID:' + name);
  }
  const locations = specs.map(([name]) => {
    const location = gl.getUniformLocation(program, name);
    if (location == null) throw new Error('FOUR_TREE_COMPACT_UNIFORM_NOT_ACTIVE:' + name);
    return location;
  });
  gl.useProgram(program);
  for (let i = 0; i < specs.length; i++) {
    const values = new Float32Array(specs[i][1]);
    if (specs[i][2] === 3) gl.uniform3fv(locations[i], values);
    else gl.uniform2fv(locations[i], values);
  }
  return Object.freeze({bound:true,uniformCount:3});
}

/** Transactional GPU residency for the approved four-tree compact payload. */
export function createFourTreeCompactResidency(gl, {compactRecords, contactSidecar, indexData, program, shadowProgram = null}) {
  const buffers = createFourTreeCompactGpuBuffers(gl, {compactRecords, contactSidecar});
  let drawView;
  try {
    drawView = createFourTreeCompactDrawView(gl, {
      compactBuffer: buffers.compactBuffer,
      contactSidecarBuffer: buffers.contactSidecarBuffer, indexData, program, shadowProgram
    });
  } catch (error) {
    buffers.dispose();
    throw error;
  }
  let disposed = false;
  return Object.freeze({
    accounting: Object.freeze({
      ...buffers.accounting,
      indexBytes: drawView.allocatedIndexBytes,
      totalUploadedBytes: buffers.accounting.actualUploadedBytes + drawView.allocatedIndexBytes,
      bufferCount: 3,
      vertexArrayCount: 1
    }),
    draw(count = FOUR_TREE_COMPACT_CONTRACT.leafCount, pass = 'color') {
      if (disposed) throw new Error('FOUR_TREE_COMPACT_RESIDENCY_DISPOSED');
      return drawView.draw(count, pass);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      try { drawView.dispose(); } finally { buffers.dispose(); }
    }
  });
}
export function validateFourTreeCompactDrawBudget(actual) {
  const limits = FOUR_TREE_COMPACT_CONTRACT;
  for (const [name, maximum] of [
    ['addedGpuBytes', limits.maxAddedGpuBytes],
    ['addedMainDraws', limits.maxAddedMainDraws],
    ['addedShadowDraws', limits.maxAddedShadowDraws],
    ['addedPrograms', limits.maxAddedPrograms],
    ['addedBuffers', limits.maxAddedBuffers],
    ['addedVertexArrays', limits.maxAddedVertexArrays],
    ['addedTextures', limits.maxAddedTextures],
    ['addedFramebuffers', limits.maxAddedFramebuffers]
  ]) {
    if (!Number.isSafeInteger(actual?.[name]) || actual[name] < 0 || actual[name] > maximum) {
      throw new RangeError('FOUR_TREE_COMPACT_RESOURCE_BUDGET:' + name);
    }
  }
  return Object.freeze({eligible:true, ...actual});
}

/** Build a separate indexed compact-leaf draw view without touching the world VAO.
 * The caller must supply qualified per-leaf vertex indices and an exact
 * reconstruction shader program. No guessed shader is automatically selected.
 */
export function createFourTreeCompactDrawView(gl, {compactBuffer, contactSidecarBuffer, indexData, program, shadowProgram = null}) {
  if (!(indexData instanceof Uint16Array || indexData instanceof Uint32Array)) {
    throw new TypeError('FOUR_TREE_COMPACT_INDEX_TYPE_REQUIRED');
  }
  if (!program || !compactBuffer || !contactSidecarBuffer) {
    throw new TypeError('FOUR_TREE_COMPACT_DRAW_INPUT_MISSING');
  }
  // A quad must contain two nondegenerate triangles and cover all four corners.
  // Reject malformed topology before allocating any GPU resource.
  if (indexData.length === 6) {
    const corners = Array.from(indexData);
    const first = corners.slice(0,3), second = corners.slice(3,6);
    if (new Set(first).size !== 3 || new Set(second).size !== 3 ||
        new Set(corners).size !== 4)
      throw new RangeError('FOUR_TREE_COMPACT_QUAD_TOPOLOGY');
  }
  if(indexData.length!==6||Array.from(indexData).some(index=>index>3))
    throw new RangeError('FOUR_TREE_COMPACT_QUAD_INDEX_CONTRACT');
  const vao=gl.createVertexArray();
  if(!vao)throw new Error('FOUR_TREE_COMPACT_VAO_FAILED');
  let indexBuffer;
  try {
    gl.bindVertexArray(vao);
    indexBuffer=gl.createBuffer();
    if(!indexBuffer)throw new Error('FOUR_TREE_COMPACT_INDEX_BUFFER_FAILED');
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexData,gl.STATIC_DRAW);
    // One compact record describes one leaf, not one triangle vertex.
    // The per-instance divisor is essential: the six index corners belong
    // to the shared four-vertex leaf template and must not advance records.
    gl.bindBuffer(gl.ARRAY_BUFFER,compactBuffer);
    gl.enableVertexAttribArray(10);
    gl.vertexAttribIPointer(10,4,gl.UNSIGNED_INT,24,0);
    gl.vertexAttribDivisor(10,1);
    gl.enableVertexAttribArray(11);
    gl.vertexAttribIPointer(11,2,gl.UNSIGNED_INT,24,16);
    gl.vertexAttribDivisor(11,1);
    // Eight uint32 contact words per leaf, retained as integer attributes.
    gl.bindBuffer(gl.ARRAY_BUFFER,contactSidecarBuffer);
    for (const [location, offset] of [[12,0],[13,16]]) {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribIPointer(location,4,gl.UNSIGNED_INT,32,offset);
      gl.vertexAttribDivisor(location,1);
    }
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    let disposed=false;
    return Object.freeze({
      vao,program,indexBuffer,indexCount:indexData.length,
      indexType:indexData instanceof Uint32Array?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,
      allocatedIndexBytes:indexData.byteLength,
      // The six indices address the four corners of a single leaf.
      // Each instance advances the 24-byte packed record exactly once.
      draw(instanceCount=FOUR_TREE_COMPACT_CONTRACT.leafCount, pass='color') {
        if(disposed)throw new Error('FOUR_TREE_COMPACT_VIEW_DISPOSED');
        if(pass!=='color'&&pass!=='shadow')throw new RangeError('FOUR_TREE_COMPACT_DRAW_PASS_INVALID');
        if(pass==='shadow'&&!shadowProgram)throw new Error('FOUR_TREE_COMPACT_SHADOW_PROGRAM_REQUIRED');
        if(!Number.isSafeInteger(instanceCount)||instanceCount<0||instanceCount>FOUR_TREE_COMPACT_CONTRACT.leafCount)
          throw new RangeError('FOUR_TREE_COMPACT_INSTANCE_COUNT');
        gl.useProgram(pass==='shadow'?shadowProgram:program);
        gl.bindVertexArray(vao);
        try { gl.drawElementsInstanced(gl.TRIANGLES,indexData.length,
          indexData instanceof Uint32Array?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,0,instanceCount); }
        finally { gl.bindVertexArray(null); }
        return Object.freeze({instances:instanceCount,indicesPerInstance:indexData.length,
          submittedTriangles:instanceCount*2});
      },
      dispose(){if(disposed)return;disposed=true;gl.deleteBuffer(indexBuffer);gl.deleteVertexArray(vao);}
    });
  }catch(error){
    gl.bindVertexArray(null);
    if(indexBuffer)gl.deleteBuffer(indexBuffer);
    gl.deleteVertexArray(vao);
    throw error;
  }
}
