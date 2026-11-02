/** Diamond Gate native frame pipeline v1.
 * World-independent ordered frame submission over an accepted WebGL1/WebGL2 GPU device.
 * E1 owns programs, meshes, render targets, context recovery and disposal.
 */
const instances = new WeakMap();
const passes = new Set(['OPAQUE', 'TRANSPARENT']);
const culls = new Set(['NONE', 'BACK', 'FRONT']);
const depths = new Set(['TEST_WRITE', 'OFF']);
const numeric = value => typeof value === 'number' && Number.isFinite(value);
const rgba = value => Array.isArray(value) && value.length === 4 && value.every(x => numeric(x) && x >= 0 && x <= 1);

function requireDevice(device) {
  if (!device || typeof device !== 'object' || !['WEBGL1', 'WEBGL2'].includes(device.backend) ||
    !device.gl || typeof device.draw !== 'function' || typeof device.bindRenderTarget !== 'function' ||
    typeof device.createProgram !== 'function' || typeof device.createMesh !== 'function' ||
    typeof device.status !== 'function') throw new TypeError('E1_NATIVE_DEVICE_REQUIRED');
  const state = device.status();
  if (state.disposed) throw new Error('DEVICE_DISPOSED');
  if (state.lost || state.restorationError) throw new Error('GRAPHICS_CONTEXT_NOT_READY');
}

const vertex1 = `attribute vec2 aPosition; attribute vec2 aUV;
varying vec2 vUV;
void main() { vUV = aUV; gl_Position = vec4(aPosition, 0.0, 1.0); }`;
const fragment1 = `precision mediump float;
varying vec2 vUV;
uniform sampler2D uColor;
void main() { gl_FragColor = texture2D(uColor, vUV); }`;
const vertex2 = `#version 300 es
in vec2 aPosition; in vec2 aUV;
out vec2 vUV;
void main() { vUV = aUV; gl_Position = vec4(aPosition, 0.0, 1.0); }`;
const fragment2 = `#version 300 es
precision mediump float;
in vec2 vUV;
uniform sampler2D uColor;
out vec4 color;
void main() { color = texture(uColor, vUV); }`;

export function createNativeFramePipeline(device) {
  requireDevice(device);
  if (instances.has(device)) return instances.get(device);
  const gl = device.gl;
  let active = null, presenter = null, lastError = null, lastPresentation = null;
  let completedFrames = 0, submitted = 0, executed = 0;

  function assertReady() {
    const s = device.status();
    if (s.disposed || s.lost || s.restorationError || gl.isContextLost?.()) {
      const error = new Error(s.disposed ? 'DEVICE_DISPOSED' : 'GRAPHICS_CONTEXT_NOT_READY');
      if (active) {
        active = null;
        lastError = error.message;
        lastPresentation = 'ABORTED';
      }
      throw error;
    }
  }
  function inspectFrame(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('FRAME_DESCRIPTOR_REQUIRED');
    const { target = null, clear, depthMode = 'TEST_WRITE', cull = 'NONE' } = input;
    if (!depths.has(depthMode)) throw new TypeError('DEPTH_MODE_INVALID');
    if (!culls.has(cull)) throw new TypeError('FACE_CULL_INVALID');
    if (!clear || !rgba(clear.color)) throw new TypeError('CLEAR_COLOR_INVALID');
    if (depthMode === 'OFF' && clear.depth !== null) throw new TypeError('DEPTH_CLEAR_MUST_BE_NULL');
    if (depthMode === 'TEST_WRITE' && (!numeric(clear.depth) || clear.depth < 0 || clear.depth > 1)) throw new TypeError('CLEAR_DEPTH_INVALID');
    if (target !== null) {
      if (typeof target !== 'object' || !target.gpu || !target.colorTexture?.gpu ||
          !Number.isInteger(target.width) || !Number.isInteger(target.height)) throw new TypeError('RENDER_TARGET_INVALID');
      if (depthMode === 'TEST_WRITE' && (!target.definition?.depth || !target.depthGpu)) throw new TypeError('DEPTH_ATTACHMENT_REQUIRED');
    } else if (depthMode === 'TEST_WRITE' && gl.getContextAttributes?.()?.depth === false) {
      throw new Error('DEFAULT_DEPTH_BUFFER_UNAVAILABLE');
    }
    return { target, clear: { color: [...clear.color], depth: clear.depth }, depthMode, cull };
  }
  function setCull(mode) {
    gl.frontFace(gl.CCW);
    if (mode === 'NONE') gl.disable(gl.CULL_FACE);
    else { gl.enable(gl.CULL_FACE); gl.cullFace(gl[mode]); }
  }
  function setPass(pass, depthMode) {
    if (depthMode === 'OFF') { gl.disable(gl.DEPTH_TEST); gl.depthMask(false); }
    else { gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(pass === 'OPAQUE'); }
    if (pass === 'TRANSPARENT') {
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    } else gl.disable(gl.BLEND);
  }
  function resetState() {
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.colorMask(true, true, true, true);
    gl.activeTexture?.(gl.TEXTURE0);
  }
  function ensurePresenter() {
    if (presenter) return presenter;
    const is2 = device.backend === 'WEBGL2';
    const program = device.createProgram({ vertexSource: is2 ? vertex2 : vertex1, fragmentSource: is2 ? fragment2 : fragment1 });
    const mesh = device.createMesh({
      vertexCount: 6,
      attributes: [
        { name: 'aPosition', size: 2, data: new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]) },
        { name: 'aUV', size: 2, data: new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1]) }
      ]
    });
    presenter = { program, mesh };
    return presenter;
  }
  function beginFrame(specification) {
    assertReady();
    if (active) throw new Error('FRAME_ALREADY_ACTIVE');
    const spec = inspectFrame(specification);
    // E1 verifies render-target device ownership before touching the context.
    device.bindRenderTarget(spec.target);
    try {
      gl.colorMask(true, true, true, true);
      setPass('OPAQUE', spec.depthMode);
      setCull(spec.cull);
      const color = spec.clear.color;
      gl.clearColor(color[0], color[1], color[2], color[3]);
      let bits = gl.COLOR_BUFFER_BIT;
      if (spec.depthMode === 'TEST_WRITE') { gl.clearDepth(spec.clear.depth); bits |= gl.DEPTH_BUFFER_BIT; }
      gl.clear(bits);
      active = { ...spec, commands: [] };
      lastError = null;
      submitted = 0; executed = 0;
      return this;
    } catch (error) {
      try { device.bindRenderTarget(null); resetState(); } catch {}
      lastError = error.message; throw error;
    }
  }
  function submit(input) {
    assertReady();
    if (!active) throw new Error('FRAME_NOT_ACTIVE');
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('DRAW_DESCRIPTOR_REQUIRED');
    const { pass = 'OPAQUE', program, mesh, first = 0, count = null,
      beforeDraw = null, depthKey = null, cull = active.cull } = input;
    if (!passes.has(pass)) throw new TypeError('DRAW_PASS_INVALID');
    if (!culls.has(cull)) throw new TypeError('FACE_CULL_INVALID');
    if (!program?.gpu || !mesh?.gpu) throw new TypeError('DRAW_GPU_RESOURCES_REQUIRED');
    if (!Number.isInteger(first) || first < 0) throw new TypeError('FIRST_VERTEX_INVALID');
    const max = mesh.definition?.indices?.length ?? mesh.definition?.vertexCount;
    const n = count === null ? max - first : count;
    if (!Number.isInteger(n) || n < 1 || !Number.isInteger(max) || first + n > max) throw new TypeError('DRAW_RANGE_INVALID');
    if (beforeDraw !== null && typeof beforeDraw !== 'function') throw new TypeError('BEFORE_DRAW_INVALID');
    if (pass === 'TRANSPARENT' && (!numeric(depthKey) || depthKey < 0)) throw new TypeError('TRANSPARENT_DEPTH_KEY_REQUIRED');
    if (pass === 'OPAQUE' && depthKey !== null) throw new TypeError('OPAQUE_DEPTH_KEY_FORBIDDEN');
    active.commands.push({ pass, program, mesh, first, count, beforeDraw, cull, depthKey, order: active.commands.length });
    submitted++;
    return submitted;
  }
  function endFrame({ presentToCanvas = true } = {}) {
    assertReady();
    if (!active) throw new Error('FRAME_NOT_ACTIVE');
    if (typeof presentToCanvas !== 'boolean') throw new TypeError('PRESENTATION_OPTION_INVALID');
    const frame = active;
    active = null;
    let result;
    try {
      const ordered = [...frame.commands.filter(x => x.pass === 'OPAQUE'),
        ...frame.commands.filter(x => x.pass === 'TRANSPARENT').sort((a,b) => b.depthKey - a.depthKey || a.order - b.order)];
      for (const cmd of ordered) {
        setPass(cmd.pass, frame.depthMode); setCull(cmd.cull);
        device.draw({ program: cmd.program, mesh: cmd.mesh, first: cmd.first, count: cmd.count,
          beforeDraw: cmd.beforeDraw ?? undefined });
        executed++;
      }
      let presentation = frame.target === null ? 'DIRECT' : 'OFFSCREEN_ONLY';
      if (frame.target && presentToCanvas) {
        const { program, mesh } = ensurePresenter();
        device.bindRenderTarget(null);
        gl.disable(gl.DEPTH_TEST); gl.depthMask(false); gl.disable(gl.CULL_FACE); gl.disable(gl.BLEND);
        gl.colorMask(true, true, true, true);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, frame.target.colorTexture.gpu);
        device.draw({ program, mesh, beforeDraw: (context, handle) => {
          const location = context.getUniformLocation(handle, 'uColor');
          if (location !== null) context.uniform1i(location, 0);
        } });
        gl.bindTexture(gl.TEXTURE_2D, null);
        presentation = 'OFFSCREEN_PRESENTED';
      }
      completedFrames++; lastPresentation = presentation; lastError = null;
      result = Object.freeze({ backend: device.backend, submitted, executed, presentation });
      return result;
    } catch (error) {
      lastError = error.message;
      lastPresentation = 'ABORTED';
      throw error;
    } finally {
      try { if (!gl.isContextLost?.()) { device.bindRenderTarget(null); resetState(); } } catch {}
    }
  }
  const api = Object.freeze({ beginFrame, submit, endFrame,
    status() { const s = device.status(); return Object.freeze({ backend: device.backend, active: Boolean(active),
      completedFrames, submitted, executed, lastError, lastPresentation,
      deviceLost: Boolean(s.lost), deviceDisposed: Boolean(s.disposed) }); }
  });
  instances.set(device, api);
  return api;
}
