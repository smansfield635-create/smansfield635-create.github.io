/* /products/index.planet.js
   PRODUCTS_ARENA_CLUSTER_CENTER_PLANET_TRANSPLANT_v1
   Independent fixed center-world renderer consuming the canonical Audralia
   geometry authority. Visual only: no navigation, product-registry, label,
   settlement, projection, or gesture authority.
*/
(() => {
  "use strict";

  const MODULE = "DGB_PRODUCTS_CENTER_PLANET";
  const RECEIPT_KEY = "DGB_PRODUCTS_CENTER_PLANET_RECEIPT";
  const READY_EVENT = "PRODUCTS_CENTER_PLANET_READY";
  const FAILURE_EVENT = "PRODUCTS_CENTER_PLANET_FAILURE";
  const GEOMETRY_GLOBAL = "DGBAudraliaPlanetGeometry";
  const GEOMETRY_CONTRACT = "AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1";

  if (globalThis[MODULE]?.initialized) return;

  const CONFIG = Object.freeze({
    root: '[data-page-id="products"]',
    mount: '[data-products-planet-mount]',
    canvas: 'data-products-planet-canvas',
    terrainLevel: 3,
    oceanLevel: 2,
    cloudLevel: 2,
    atmosphereLevel: 2,
    dprCap: 1.5,
    geometryRetryMs: 100,
    maximumGeometryAttempts: 40,
    rotationSeconds: 72,
    cloudRotationSeconds: 108,
    pitch: -0.22,
    cameraDistance: 3.3,
    worldScale: 0.86
  });

  const MATERIAL_COLORS = Object.freeze([
    [0.025, 0.10, 0.25],
    [0.05, 0.24, 0.44],
    [0.12, 0.48, 0.58],
    [0.50, 0.47, 0.32],
    [0.68, 0.59, 0.38],
    [0.21, 0.45, 0.29],
    [0.11, 0.33, 0.26],
    [0.52, 0.44, 0.31],
    [0.31, 0.43, 0.34],
    [0.41, 0.41, 0.43],
    [0.82, 0.88, 0.86],
    [0.18, 0.52, 0.63],
    [0.12, 0.39, 0.51]
  ]);

  const state = {
    initialized: false,
    ready: false,
    failed: false,
    disposed: false,
    fallback: false,
    reducedMotion: false,
    root: null,
    mount: null,
    canvas: null,
    gl: null,
    program: null,
    attribs: null,
    uniforms: null,
    terrain: null,
    ocean: null,
    clouds: null,
    atmosphere: null,
    geometryAuthority: null,
    geometryPacket: null,
    resizeObserver: null,
    motionQuery: null,
    frame: 0,
    startedAt: 0,
    geometryAttempts: 0,
    width: 0,
    height: 0,
    dpr: 1,
    renderFrames: 0,
    lastError: ""
  };

  const VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;
    uniform mat4 uProjection;
    uniform float uYaw;
    uniform float uPitch;
    uniform float uScale;
    uniform float uDistance;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vWorld;

    vec3 rotatePoint(vec3 point) {
      float cy = cos(uYaw);
      float sy = sin(uYaw);
      float cp = cos(uPitch);
      float sp = sin(uPitch);
      vec3 yawed = vec3(point.x * cy + point.z * sy, point.y, -point.x * sy + point.z * cy);
      return vec3(yawed.x, yawed.y * cp - yawed.z * sp, yawed.y * sp + yawed.z * cp);
    }

    void main() {
      vec3 world = rotatePoint(aPosition * uScale);
      vec3 normal = normalize(rotatePoint(aNormal));
      world.z -= uDistance;
      vNormal = normal;
      vColor = aColor;
      vWorld = world;
      gl_Position = uProjection * vec4(world, 1.0);
    }
  `;

  const FRAGMENT_SHADER = `
    precision mediump float;
    uniform int uMode;
    uniform float uAlpha;
    uniform float uPulse;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vWorld;

    void main() {
      vec3 n = normalize(vNormal);
      vec3 light = normalize(vec3(-0.45, 0.70, 0.58));
      float diffuse = max(dot(n, light), 0.0);
      float rim = pow(1.0 - max(dot(n, normalize(-vWorld)), 0.0), 2.2);
      vec3 color = vColor;
      float alpha = uAlpha;

      if (uMode == 1) {
        color = mix(vec3(0.02, 0.10, 0.25), vec3(0.08, 0.38, 0.62), diffuse + 0.15);
      } else if (uMode == 2) {
        color = vec3(0.90, 0.96, 0.98);
        alpha *= 0.16 + diffuse * 0.16;
      } else if (uMode == 3) {
        color = vec3(0.27, 0.72, 1.0);
        alpha *= (0.08 + rim * 0.42) * (0.86 + uPulse * 0.14);
      } else {
        color = color * (0.30 + diffuse * 0.90) + rim * vec3(0.16, 0.34, 0.44);
      }

      gl_FragColor = vec4(color, alpha);
    }
  `;

  function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ]);
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "UNKNOWN_SHADER_ERROR";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function createProgram(gl) {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "PRODUCTS_PLANET_PROGRAM_LINK_FAILED");
    }
    return program;
  }

  function makeBuffer(gl, target, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);
    return buffer;
  }

  function terrainColors(mesh) {
    const colors = new Float32Array(mesh.vertexCount * 3);
    for (let index = 0; index < mesh.vertexCount; index += 1) {
      const hint = Number(mesh.materialHints?.[index] ?? 5);
      const color = MATERIAL_COLORS[hint] || MATERIAL_COLORS[5];
      colors[index * 3] = color[0];
      colors[index * 3 + 1] = color[1];
      colors[index * 3 + 2] = color[2];
    }
    return colors;
  }

  function solidColors(vertexCount, color) {
    const colors = new Float32Array(vertexCount * 3);
    for (let index = 0; index < vertexCount; index += 1) {
      colors[index * 3] = color[0];
      colors[index * 3 + 1] = color[1];
      colors[index * 3 + 2] = color[2];
    }
    return colors;
  }

  function gpuMesh(gl, mesh, colors) {
    const indices = mesh.indices instanceof Uint16Array
      ? mesh.indices
      : new Uint16Array(mesh.indices);
    return {
      vertexCount: mesh.vertexCount,
      indexCount: indices.length,
      position: makeBuffer(gl, gl.ARRAY_BUFFER, mesh.positions),
      normal: makeBuffer(gl, gl.ARRAY_BUFFER, mesh.normals),
      color: makeBuffer(gl, gl.ARRAY_BUFFER, colors),
      index: makeBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices)
    };
  }

  function deleteMesh(mesh) {
    if (!mesh || !state.gl) return;
    for (const key of ["position", "normal", "color", "index"]) {
      if (mesh[key]) state.gl.deleteBuffer(mesh[key]);
    }
  }

  function buildReceipt(extra = {}) {
    const geometryStatus = state.geometryAuthority?.getReceiptLight?.() || null;
    return {
      contract: "PRODUCTS_ARENA_CLUSTER_CENTER_PLANET_TRANSPLANT_v1",
      module: MODULE,
      sourceGeometryContract: GEOMETRY_CONTRACT,
      sourceGeometryReady: Boolean(geometryStatus?.ready),
      sourceGeometryHash: geometryStatus?.geometryHash || state.geometryPacket?.geometryHash || "",
      initialized: state.initialized,
      ready: state.ready,
      failed: state.failed,
      disposed: state.disposed,
      fallback: state.fallback,
      reducedMotion: state.reducedMotion,
      worldPosition: Object.freeze([0, 0, 0]),
      orbit: "NONE",
      internalRotation: true,
      route: "/",
      role: "MAIN_COMPASS_RETURN",
      productMember: false,
      registryMember: false,
      labelResolverMember: false,
      settlementMember: false,
      ownsNavigation: false,
      ownsControllerState: false,
      ownsProductGeometry: false,
      width: state.width,
      height: state.height,
      devicePixelRatio: state.dpr,
      geometryAttempts: state.geometryAttempts,
      renderFrames: state.renderFrames,
      lastError: state.lastError,
      visualPassClaimed: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT_KEY] = receipt;
    if (state.root) {
      state.root.dataset.productsPlanetStatus = state.failed ? "held" : state.ready ? "available" : "pending";
      state.root.dataset.productsCenterPlanetCount = state.ready || state.fallback ? "1" : "0";
      state.root.dataset.productsPlanetReceipt = JSON.stringify(receipt);
    }
    const output = document.querySelector("[data-products-planet-receipt]");
    if (output) output.value = JSON.stringify(receipt);
    return receipt;
  }

  function createFallback(reason) {
    state.fallback = true;
    const fallback = document.createElement("div");
    fallback.className = "products-planet-fallback";
    fallback.setAttribute("data-products-planet-fallback", "true");
    fallback.setAttribute("aria-hidden", "true");
    state.mount.replaceChildren(fallback);
    state.ready = true;
    publish({ lastAction: "planet-fallback", fallbackReason: reason });
    globalThis.dispatchEvent(new CustomEvent(READY_EVENT, { detail: globalThis[RECEIPT_KEY] }));
  }

  function fail(error) {
    const message = error instanceof Error ? error.message : String(error);
    state.lastError = message;
    state.failed = true;
    publish({ lastAction: "planet-failure", lastFailure: message });
    globalThis.dispatchEvent(new CustomEvent(FAILURE_EVENT, { detail: Object.freeze({ message }) }));
    if (state.mount && !state.ready) createFallback(message);
  }

  function resolveReducedMotion() {
    state.reducedMotion = Boolean(state.motionQuery?.matches || state.root?.dataset.reducedMotion === "true");
  }

  function resize() {
    if (!state.canvas || !state.gl) return;
    const rect = state.mount.getBoundingClientRect();
    state.width = Math.max(1, Math.round(rect.width));
    state.height = Math.max(1, Math.round(rect.height));
    state.dpr = Math.min(globalThis.devicePixelRatio || 1, CONFIG.dprCap);
    const width = Math.max(1, Math.round(state.width * state.dpr));
    const height = Math.max(1, Math.round(state.height * state.dpr));
    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;
    state.gl.viewport(0, 0, width, height);
  }

  function bindMesh(mesh) {
    const gl = state.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
    gl.enableVertexAttribArray(state.attribs.position);
    gl.vertexAttribPointer(state.attribs.position, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normal);
    gl.enableVertexAttribArray(state.attribs.normal);
    gl.vertexAttribPointer(state.attribs.normal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.color);
    gl.enableVertexAttribArray(state.attribs.color);
    gl.vertexAttribPointer(state.attribs.color, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.index);
  }

  function drawMesh(mesh, mode, alpha, yaw, scale, pulse) {
    if (!mesh) return;
    const gl = state.gl;
    bindMesh(mesh);
    gl.uniform1i(state.uniforms.mode, mode);
    gl.uniform1f(state.uniforms.alpha, alpha);
    gl.uniform1f(state.uniforms.yaw, yaw);
    gl.uniform1f(state.uniforms.pitch, CONFIG.pitch);
    gl.uniform1f(state.uniforms.scale, scale);
    gl.uniform1f(state.uniforms.distance, CONFIG.cameraDistance);
    gl.uniform1f(state.uniforms.pulse, pulse);
    gl.drawElements(gl.TRIANGLES, mesh.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  function render(now) {
    if (state.disposed || !state.gl || !state.ready || state.fallback) return;
    resize();
    const gl = state.gl;
    const seconds = (now - state.startedAt) / 1000;
    const yaw = state.reducedMotion ? 0.55 : seconds * Math.PI * 2 / CONFIG.rotationSeconds;
    const cloudYaw = state.reducedMotion ? 0.82 : seconds * Math.PI * 2 / CONFIG.cloudRotationSeconds;
    const pulse = state.reducedMotion ? 0 : (Math.sin(seconds * 0.55) + 1) / 2;
    const aspect = state.canvas.width / Math.max(1, state.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(state.program);
    gl.uniformMatrix4fv(state.uniforms.projection, false, perspective(Math.PI / 4.2, aspect, 0.1, 20));

    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    drawMesh(state.ocean, 1, 1, yaw, CONFIG.worldScale * 1.002, pulse);
    drawMesh(state.terrain, 0, 1, yaw, CONFIG.worldScale, pulse);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    drawMesh(state.clouds, 2, 0.45, cloudYaw, CONFIG.worldScale * 1.012, pulse);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    drawMesh(state.atmosphere, 3, 0.42, yaw, CONFIG.worldScale * 1.035, pulse);
    gl.depthMask(true);

    state.renderFrames += 1;
    if (state.renderFrames % 60 === 0) publish({ lastAction: "planet-rendering" });
    state.frame = requestAnimationFrame(render);
  }

  function buildGeometry() {
    const authority = globalThis[GEOMETRY_GLOBAL];
    if (!authority || authority.contract !== GEOMETRY_CONTRACT) return false;
    state.geometryAuthority = authority;
    state.geometryPacket = authority.createGeometry({
      terrainLevel: CONFIG.terrainLevel,
      oceanLevel: CONFIG.oceanLevel,
      cloudLevel: CONFIG.cloudLevel,
      atmosphereLevel: CONFIG.atmosphereLevel,
      includeHydrology: false,
      deepValidation: false
    });
    const gl = state.gl;
    state.terrain = gpuMesh(gl, state.geometryPacket.terrain, terrainColors(state.geometryPacket.terrain));
    state.ocean = gpuMesh(gl, state.geometryPacket.ocean, solidColors(state.geometryPacket.ocean.vertexCount, [0.05, 0.28, 0.50]));
    state.clouds = gpuMesh(gl, state.geometryPacket.clouds, solidColors(state.geometryPacket.clouds.vertexCount, [0.92, 0.97, 1.0]));
    state.atmosphere = gpuMesh(gl, state.geometryPacket.atmosphere, solidColors(state.geometryPacket.atmosphere.vertexCount, [0.35, 0.78, 1.0]));
    return true;
  }

  function waitForGeometry() {
    state.geometryAttempts += 1;
    try {
      if (buildGeometry()) {
        state.ready = true;
        state.startedAt = performance.now();
        publish({ lastAction: "planet-ready" });
        globalThis.dispatchEvent(new CustomEvent(READY_EVENT, { detail: globalThis[RECEIPT_KEY] }));
        state.frame = requestAnimationFrame(render);
        return;
      }
      if (state.geometryAttempts >= CONFIG.maximumGeometryAttempts) {
        throw new Error("PRODUCTS_PLANET_GEOMETRY_AUTHORITY_UNAVAILABLE");
      }
      setTimeout(waitForGeometry, CONFIG.geometryRetryMs);
    } catch (error) {
      fail(error);
    }
  }

  function dispose() {
    state.disposed = true;
    if (state.frame) cancelAnimationFrame(state.frame);
    state.resizeObserver?.disconnect();
    state.motionQuery?.removeEventListener?.("change", onMotion);
    deleteMesh(state.terrain);
    deleteMesh(state.ocean);
    deleteMesh(state.clouds);
    deleteMesh(state.atmosphere);
    if (state.program && state.gl) state.gl.deleteProgram(state.program);
    state.canvas?.remove();
    publish({ lastAction: "planet-disposed" });
  }

  function onMotion() {
    resolveReducedMotion();
    publish({ lastAction: "reduced-motion-changed" });
  }

  function initialize() {
    try {
      state.root = document.querySelector(CONFIG.root);
      state.mount = document.querySelector(CONFIG.mount);
      if (!state.root || !state.mount) throw new Error("PRODUCTS_PLANET_MOUNT_NOT_FOUND");

      state.canvas = document.createElement("canvas");
      state.canvas.setAttribute(CONFIG.canvas, "true");
      state.canvas.setAttribute("aria-hidden", "true");
      state.canvas.style.pointerEvents = "none";
      state.mount.replaceChildren(state.canvas);

      state.gl = state.canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
      if (!state.gl) {
        createFallback("WEBGL_CONTEXT_UNAVAILABLE");
        state.initialized = true;
        return;
      }

      const gl = state.gl;
      state.program = createProgram(gl);
      state.attribs = Object.freeze({
        position: gl.getAttribLocation(state.program, "aPosition"),
        normal: gl.getAttribLocation(state.program, "aNormal"),
        color: gl.getAttribLocation(state.program, "aColor")
      });
      state.uniforms = Object.freeze({
        projection: gl.getUniformLocation(state.program, "uProjection"),
        yaw: gl.getUniformLocation(state.program, "uYaw"),
        pitch: gl.getUniformLocation(state.program, "uPitch"),
        scale: gl.getUniformLocation(state.program, "uScale"),
        distance: gl.getUniformLocation(state.program, "uDistance"),
        mode: gl.getUniformLocation(state.program, "uMode"),
        alpha: gl.getUniformLocation(state.program, "uAlpha"),
        pulse: gl.getUniformLocation(state.program, "uPulse")
      });

      state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
      state.motionQuery?.addEventListener?.("change", onMotion);
      resolveReducedMotion();

      state.resizeObserver = new ResizeObserver(resize);
      state.resizeObserver.observe(state.mount);
      state.initialized = true;
      publish({ lastAction: "planet-initialized" });
      waitForGeometry();
    } catch (error) {
      fail(error);
    }
  }

  globalThis[MODULE] = Object.freeze({
    initialized: false,
    receipt: () => Object.freeze(buildReceipt()),
    resize,
    dispose
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
