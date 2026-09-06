const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec3 aPosition;
in vec4 aColor;
uniform mat4 uMvp;
uniform float uEmphasis;
uniform float uPointSize;
out vec4 vColor;
void main() {
  gl_Position = uMvp * vec4(aPosition, 1.0);
  gl_PointSize = uPointSize;
  float brightness = mix(0.32, 1.0, uEmphasis);
  vColor = vec4(aColor.rgb * brightness, aColor.a * mix(0.42, 1.0, uEmphasis));
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 outColor;
void main() {
  outColor = vColor;
}`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unknown shader compilation error";
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
    const message = gl.getProgramInfoLog(program) || "Unknown program link error";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

function color(hex, alpha = 1) {
  const value = hex.replace("#", "");
  const number = Number.parseInt(value, 16);
  return [
    ((number >> 16) & 255) / 255,
    ((number >> 8) & 255) / 255,
    (number & 255) / 255,
    alpha
  ];
}

function mat4Identity() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function mat4Multiply(a, b) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[0 * 4 + row] * b[column * 4 + 0] +
        a[1 * 4 + row] * b[column * 4 + 1] +
        a[2 * 4 + row] * b[column * 4 + 2] +
        a[3 * 4 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

function mat4Perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

function normalize(v) {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function mat4LookAt(eye, target, up) {
  const z = normalize(subtract(eye, target));
  const x = normalize(cross(up, z));
  const y = cross(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ]);
}

function mat4Translation(x, y, z) {
  const out = mat4Identity();
  out[12] = x;
  out[13] = y;
  out[14] = z;
  return out;
}

function mat4Scale(x, y, z) {
  const out = mat4Identity();
  out[0] = x;
  out[5] = y;
  out[10] = z;
  return out;
}

function mat4RotationY(angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ]);
}

function mat4RotationX(angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ]);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function pushVertex(target, position, rgba) {
  target.positions.push(...position);
  target.colors.push(...rgba);
}

function createLineObject(id, vertices, rgba, mode = "LINES", center = [0, 0, 0]) {
  const data = { positions: [], colors: [] };
  vertices.forEach((position) => pushVertex(data, position, rgba));
  return { id, mode, center, ...data };
}

function circleVertices(radius, segments = 96, center = [0, 0, 0]) {
  const vertices = [];
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const b = ((i + 1) / segments) * Math.PI * 2;
    vertices.push(
      [center[0] + Math.cos(a) * radius, center[1] + Math.sin(a) * radius, center[2]],
      [center[0] + Math.cos(b) * radius, center[1] + Math.sin(b) * radius, center[2]]
    );
  }
  return vertices;
}

function cubeLineVertices(size = 1, center = [0, 0, 0]) {
  const s = size / 2;
  const points = [
    [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
    [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
  ].map(([x, y, z]) => [x + center[0], y + center[1], z + center[2]]);
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  return edges.flatMap(([a, b]) => [points[a], points[b]]);
}

function octahedronTriangles(radius = 1.2, center = [0, 0, 0]) {
  const [cx, cy, cz] = center;
  const top = [cx, cy + radius, cz];
  const bottom = [cx, cy - radius, cz];
  const east = [cx + radius, cy, cz];
  const west = [cx - radius, cy, cz];
  const north = [cx, cy, cz + radius];
  const south = [cx, cy, cz - radius];
  return [
    top, east, north, top, north, west, top, west, south, top, south, east,
    bottom, north, east, bottom, west, north, bottom, south, west, bottom, east, south
  ];
}

function makePath(pressure = 4) {
  const vertices = [];
  const bend = (pressure / 10) * 1.15;
  const points = [];
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    const x = -4.1 + t * 8.2;
    const y = -1.9 + t * 3.2 + Math.sin(t * Math.PI * 2) * bend;
    const z = Math.sin(t * Math.PI) * 0.65;
    points.push([x, y, z]);
  }
  for (let i = 0; i < points.length - 1; i += 1) {
    vertices.push(points[i], points[i + 1]);
  }
  return vertices;
}

function gateVertices(center, width = 1.15, height = 2.1) {
  const [x, y, z] = center;
  const half = width / 2;
  return [
    [x - half, y - height / 2, z], [x - half, y + height / 2, z],
    [x + half, y - height / 2, z], [x + half, y + height / 2, z],
    [x - half, y + height / 2, z], [x + half, y + height / 2, z]
  ];
}

function latticeGeometry() {
  const nodes = [
    [2.45, 1.7, .2], [3.35, 2.2, -.2], [4.0, 1.35, .35], [3.0, .85, -.15], [4.25, .45, .1]
  ];
  const edges = [[0,1],[1,2],[2,3],[3,0],[1,3],[2,4],[3,4]];
  return {
    lines: edges.flatMap(([a, b]) => [nodes[a], nodes[b]]),
    points: nodes
  };
}

function ledgerVertices() {
  const vertices = [];
  for (let layer = 0; layer < 4; layer += 1) {
    const x = -4.15 + layer * .16;
    const y = 1.8 - layer * .13;
    const z = -.35 + layer * .18;
    const w = 1.65;
    const h = .85;
    vertices.push(
      [x - w / 2, y - h / 2, z], [x + w / 2, y - h / 2, z],
      [x + w / 2, y - h / 2, z], [x + w / 2, y + h / 2, z],
      [x + w / 2, y + h / 2, z], [x - w / 2, y + h / 2, z],
      [x - w / 2, y + h / 2, z], [x - w / 2, y - h / 2, z]
    );
  }
  return vertices;
}

function createSceneObjects(parameters) {
  const fieldColor = color("#68e4ff", .46);
  const pathColor = color("#f5d36b", .95);
  const gateColor = color("#71e3ba", .95);
  const latticeColor = color("#9f82ff", .88);
  const volumeColor = color("#68e4ff", .8);
  const orbitColor = color("#f5d36b", .58);
  const fractureColor = color("#ff778d", 1);
  const ledgerColor = color("#c7d4ff", .78);
  const crystalColors = [
    color("#fff2a6", .98), color("#ffb44f", .98), color("#ff7b39", .98),
    color("#ffe79a", .98), color("#ff9c47", .98), color("#fff6ca", .98),
    color("#ffbd57", .98), color("#ff8a3d", .98)
  ];

  const fieldVertices = [
    ...circleVertices(2.3, 96, [-1.0, .15, -.4]),
    ...circleVertices(3.0, 96, [-1.0, .15, -.45]),
    ...circleVertices(3.65, 96, [-1.0, .15, -.5])
  ];

  const lattice = latticeGeometry();
  const crystalPositions = octahedronTriangles(1.1, [0, 0, .35]);
  const crystalData = { positions: [], colors: [] };
  crystalPositions.forEach((position, index) => pushVertex(crystalData, position, crystalColors[Math.floor(index / 3) % crystalColors.length]));

  return [
    createLineObject("field", fieldVertices, fieldColor, "LINES", [-1.0, .15, -.45]),
    createLineObject("path", makePath(parameters.pressure), pathColor, "LINES", [0, 0, 0]),
    createLineObject("gate", [...gateVertices([-1.25, -.05, .1]), ...gateVertices([1.2, .8, .18])], gateColor, "LINES", [0, .35, .15]),
    createLineObject("lattice", lattice.lines, latticeColor, "LINES", [3.35, 1.35, .05]),
    createLineObject("lattice-points", lattice.points, color("#d9cfff", 1), "POINTS", [3.35, 1.35, .05]),
    createLineObject("volume", cubeLineVertices(2.0, [3.0, -1.35, .2]), volumeColor, "LINES", [3.0, -1.35, .2]),
    createLineObject("orbit", circleVertices(1.8, 110, [0, 0, .2]), orbitColor, "LINES", [0, 0, .2]),
    createLineObject("fracture", [[.9,2.45,.2],[1.25,1.95,.35],[1.05,1.55,.05],[1.7,1.1,.3]], fractureColor, "LINE_STRIP", [1.2, 1.8, .2]),
    { id: "crystal", mode: "TRIANGLES", center: [0, 0, .35], ...crystalData },
    createLineObject("ledger", ledgerVertices(), ledgerColor, "LINES", [-3.9, 1.6, 0])
  ];
}

const STAGE_TARGETS = {
  field: [-1.0, .1, 0],
  path: [0, -.15, 0],
  gate: [0, .35, 0],
  lattice: [3.15, 1.25, 0],
  volume: [2.75, -1.15, 0],
  orbit: [0, 0, 0],
  fracture: [1.25, 1.75, 0],
  crystal: [0, 0, .25],
  ledger: [-3.55, 1.45, 0]
};

export class LawsWebGL2Adapter {
  constructor() {
    this.rendererId = "DGB_LAWS_NATIVE_WEBGL2_RESEARCH_ADAPTER_v1";
    this.sceneSpec = null;
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.locations = null;
    this.objects = [];
    this.activePrimitive = "field";
    this.previousPrimitive = "field";
    this.parameters = { capacity: 7, pressure: 4, available: 3 };
    this.motionMode = "full";
    this.suspended = false;
    this.contextStatus = "UNINITIALIZED";
    this.errors = [];
    this.transitionStartedAt = 0;
    this.transitionDuration = 720;
    this.viewport = { width: 1, height: 1, pixelRatio: 1 };
    this.pointer = { x: 0, y: 0 };
  }

  initialize(sceneSpec, host) {
    this.sceneSpec = sceneSpec;
    this.canvas = host;
    const gl = host.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "high-performance" });
    if (!gl) {
      this.contextStatus = "WEBGL2_UNAVAILABLE";
      throw new Error("WebGL2 is not available in this browser.");
    }
    this.gl = gl;
    this.program = createProgram(gl);
    this.locations = {
      position: gl.getAttribLocation(this.program, "aPosition"),
      color: gl.getAttribLocation(this.program, "aColor"),
      mvp: gl.getUniformLocation(this.program, "uMvp"),
      emphasis: gl.getUniformLocation(this.program, "uEmphasis"),
      pointSize: gl.getUniformLocation(this.program, "uPointSize")
    };
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    this.rebuildObjects();
    this.contextStatus = "READY";
    return this;
  }

  rebuildObjects() {
    if (!this.gl) return;
    this.disposeObjects();
    this.objects = createSceneObjects(this.parameters).map((object) => this.uploadObject(object));
  }

  uploadObject(object) {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.locations.color);
    gl.vertexAttribPointer(this.locations.color, 4, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    return {
      ...object,
      vao,
      positionBuffer,
      colorBuffer,
      count: object.positions.length / 3
    };
  }

  resize(dimensions, deviceClass = "desktop") {
    if (!this.gl || !this.canvas) return;
    const ratioCap = deviceClass === "phone" ? 1.5 : 2;
    const pixelRatio = Math.min(globalThis.devicePixelRatio || 1, ratioCap);
    const width = Math.max(1, Math.floor(dimensions.width * pixelRatio));
    const height = Math.max(1, Math.floor(dimensions.height * pixelRatio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.viewport = { width, height, pixelRatio };
    this.gl.viewport(0, 0, width, height);
  }

  setState(canonicalState) {
    const next = canonicalState?.activePrimitive;
    if (!next || next === this.activePrimitive) return;
    this.previousPrimitive = this.activePrimitive;
    this.activePrimitive = next;
    this.transitionStartedAt = performance.now();
  }

  setParameters(parameterState) {
    this.parameters = {
      capacity: Number(parameterState.capacity),
      pressure: Number(parameterState.pressure),
      available: Number(parameterState.available)
    };
    this.rebuildObjects();
  }

  setMotionMode(mode) {
    this.motionMode = mode;
    if (mode !== "full") this.transitionStartedAt = 0;
  }

  setPointer(pointerState) {
    this.pointer.x = Math.max(-1, Math.min(1, pointerState.x || 0));
    this.pointer.y = Math.max(-1, Math.min(1, pointerState.y || 0));
  }

  render(frameState = {}) {
    if (!this.gl || this.suspended || this.motionMode === "static") return;
    const gl = this.gl;
    const now = frameState.now || performance.now();
    const aspect = this.viewport.width / Math.max(1, this.viewport.height);
    const projection = mat4Perspective(Math.PI / 4.2, aspect, .1, 60);

    const duration = this.motionMode === "reduced" ? 1 : this.transitionDuration;
    const rawProgress = this.transitionStartedAt ? Math.min(1, (now - this.transitionStartedAt) / duration) : 1;
    const progress = easeOutCubic(rawProgress);
    const fromTarget = STAGE_TARGETS[this.previousPrimitive] || [0, 0, 0];
    const toTarget = STAGE_TARGETS[this.activePrimitive] || [0, 0, 0];
    const target = [
      lerp(fromTarget[0], toTarget[0], progress) * .18,
      lerp(fromTarget[1], toTarget[1], progress) * .18,
      0
    ];

    const pointerWeight = this.motionMode === "full" ? .28 : 0;
    const eye = [this.pointer.x * pointerWeight, -this.pointer.y * pointerWeight, 12.2];
    const view = mat4LookAt(eye, target, [0, 1, 0]);
    const globalRotation = mat4Multiply(
      mat4RotationY(this.pointer.x * .09 * pointerWeight),
      mat4RotationX(-this.pointer.y * .06 * pointerWeight)
    );

    gl.clearColor(.015, .025, .065, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.program);

    const availableScale = .35 + (this.parameters.available / 10) * .95;
    const pressureScale = .9 + (this.parameters.pressure / 10) * .22;
    const stagePulse = this.motionMode === "full" && rawProgress < 1 ? Math.sin(progress * Math.PI) : 0;

    for (const object of this.objects) {
      const semanticId = object.id === "lattice-points" ? "lattice" : object.id;
      const active = semanticId === this.activePrimitive;
      const previous = semanticId === this.previousPrimitive;
      let emphasis = active ? 1 : .12;
      if (previous && rawProgress < 1) emphasis = lerp(.86, .12, progress);
      if (active && rawProgress < 1) emphasis = lerp(.34, 1, progress);

      let model = mat4Identity();
      if (semanticId === "volume") {
        const center = object.center;
        model = mat4Multiply(
          mat4Translation(center[0], center[1], center[2]),
          mat4Multiply(mat4Scale(availableScale, availableScale, availableScale), mat4Translation(-center[0], -center[1], -center[2]))
        );
      } else if (semanticId === "field") {
        const center = object.center;
        model = mat4Multiply(
          mat4Translation(center[0], center[1], center[2]),
          mat4Multiply(mat4Scale(pressureScale, pressureScale, 1), mat4Translation(-center[0], -center[1], -center[2]))
        );
      } else if (semanticId === "orbit" && active) {
        const angle = stagePulse * .7;
        model = mat4RotationY(angle);
      } else if (semanticId === "crystal") {
        const angle = this.motionMode === "full" ? stagePulse * .26 : 0;
        model = mat4Multiply(mat4RotationY(angle), mat4RotationX(-angle * .45));
      } else if (semanticId === "ledger" && active) {
        model = mat4Translation(0, stagePulse * .1, 0);
      }

      model = mat4Multiply(globalRotation, model);
      const mvp = mat4Multiply(projection, mat4Multiply(view, model));
      gl.uniformMatrix4fv(this.locations.mvp, false, mvp);
      gl.uniform1f(this.locations.emphasis, emphasis);
      gl.uniform1f(this.locations.pointSize, active ? 11 * this.viewport.pixelRatio : 7 * this.viewport.pixelRatio);
      gl.bindVertexArray(object.vao);

      const mode = object.mode === "TRIANGLES" ? gl.TRIANGLES
        : object.mode === "POINTS" ? gl.POINTS
        : object.mode === "LINE_STRIP" ? gl.LINE_STRIP
        : gl.LINES;
      gl.drawArrays(mode, 0, object.count);
    }

    gl.bindVertexArray(null);
  }

  hitTest() {
    return null;
  }

  captureReceipt() {
    return {
      rendererId: this.rendererId,
      sceneSpecId: this.sceneSpec?.sceneId || null,
      canonicalStateId: this.activePrimitive,
      parameterState: { ...this.parameters },
      motionMode: this.motionMode,
      frameStatus: this.suspended ? "SUSPENDED" : "READY",
      resourceStatus: this.objects.length ? "ALLOCATED" : "EMPTY",
      contextStatus: this.contextStatus,
      visibleObjectIds: [...new Set(this.objects.map((object) => object.id.replace("-points", "")))],
      errors: [...this.errors]
    };
  }

  suspend() {
    this.suspended = true;
  }

  resume() {
    this.suspended = false;
  }

  disposeObjects() {
    if (!this.gl) return;
    for (const object of this.objects) {
      this.gl.deleteVertexArray(object.vao);
      this.gl.deleteBuffer(object.positionBuffer);
      this.gl.deleteBuffer(object.colorBuffer);
    }
    this.objects = [];
  }

  dispose() {
    if (!this.gl) return;
    this.disposeObjects();
    if (this.program) this.gl.deleteProgram(this.program);
    this.program = null;
    this.gl = null;
    this.contextStatus = "DISPOSED";
  }
}
