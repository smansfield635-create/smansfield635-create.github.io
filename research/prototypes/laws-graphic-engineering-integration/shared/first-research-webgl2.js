const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec3 aPosition;
in vec4 aColor;
in float aSize;
uniform mat4 uMvp;
uniform float uPointMode;
out vec4 vColor;
void main() {
  gl_Position = uMvp * vec4(aPosition, 1.0);
  gl_PointSize = aSize;
  vColor = aColor;
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec4 vColor;
uniform float uPointMode;
out vec4 outColor;
void main() {
  if (uPointMode > 0.5) {
    vec2 p = gl_PointCoord - vec2(0.5);
    float d = abs(p.x) + abs(p.y);
    if (d > 0.5) discard;
  }
  outColor = vColor;
}`;

const NODE_POSITIONS = Object.freeze({
  flow: [-3.6, -0.35, 0.15],
  integrity: [-1.8, 0.55, -0.15],
  reality: [0, 0.95, 0.25],
  structure: [1.8, 0.55, -0.15],
  test: [3.6, -0.35, 0.15],
  research: [0, -1.55, -0.55]
});

const LENS_COLORS = Object.freeze({
  practical: {
    sequence: [0.95, 0.76, 0.32, 0.96],
    research: [0.64, 0.52, 1.0, 0.9],
    tether: [0.39, 0.84, 0.88, 0.5]
  },
  engineering: {
    sequence: [0.35, 0.84, 0.95, 0.96],
    research: [0.95, 0.65, 0.28, 0.88],
    tether: [0.64, 0.78, 1.0, 0.58]
  },
  empirical: {
    sequence: [0.65, 0.8, 0.98, 0.82],
    research: [0.48, 0.9, 0.66, 0.96],
    tether: [0.72, 0.62, 1.0, 0.55]
  }
});

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

function identity() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function multiply(a, b) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

function perspective(fovy, aspect, near, far) {
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

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
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

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function lookAt(eye, target, up) {
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

function rotationX(angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ]);
}

function rotationY(angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ]);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function mix3(a, b, t) {
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
}

function transformPoint(matrix, point) {
  const [x, y, z] = point;
  const w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  return [
    (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w,
    (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
    (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w
  ];
}

function addVertex(target, position, color, size = 1) {
  target.positions.push(...position);
  target.colors.push(...color);
  target.sizes.push(size);
}

function addLine(target, a, b, color) {
  addVertex(target, a, color, 1);
  addVertex(target, b, color, 1);
}

function ringPoint(index, count, phase, tilt = 0.34) {
  const angle = (index / count) * Math.PI * 2 + phase;
  const x = Math.cos(angle) * 4.55;
  const y = Math.sin(angle) * 2.25 - 0.15;
  const z = Math.sin(angle) * 0.95;
  const c = Math.cos(tilt);
  const s = Math.sin(tilt);
  return [x, y * c - z * s, y * s + z * c - 0.2];
}

function createStaticSvg(content) {
  const nodes = content.first.map((item, index) => {
    const x = 112 + index * 144;
    const y = 190 - Math.sin((index / 4) * Math.PI) * 58;
    return { ...item, x, y };
  });
  const lines = nodes.slice(0, -1).map((node, index) => {
    const next = nodes[index + 1];
    return `<line x1="${node.x}" y1="${node.y}" x2="${next.x}" y2="${next.y}" />`;
  }).join("");
  const tethers = nodes.map((node) => `<line class="tether" x1="400" y1="322" x2="${node.x}" y2="${node.y}" />`).join("");
  const nodeSvg = nodes.map((node) => `
    <g transform="translate(${node.x} ${node.y})">
      <path d="M0 -22 L22 0 L0 22 L-22 0 Z" />
      <text y="5">${node.letter}</text>
      <text class="label" y="45">${node.label}</text>
    </g>`).join("");
  return `
  <svg viewBox="0 0 800 430" role="img" aria-labelledby="first-static-title first-static-desc">
    <title id="first-static-title">Research comes F.I.R.S.T. relationship</title>
    <desc id="first-static-desc">Five ordered F.I.R.S.T. nodes are connected as a sequence. Research surrounds the sequence and is tethered to every stage as an examination and record relationship.</desc>
    <style>
      .orbit{fill:none;stroke:#ad91ff;stroke-width:3;stroke-dasharray:8 8}.path{fill:none;stroke:#f2cb68;stroke-width:4}.tether{stroke:#69dce7;stroke-width:1.5;opacity:.55}path{fill:#101a3c;stroke:#f2cb68;stroke-width:2}text{fill:#fff;font:700 16px system-ui;text-anchor:middle}.label{fill:#c9d2e7;font-size:12px}.research{fill:#2b2059;stroke:#ad91ff;stroke-width:3}
    </style>
    <ellipse class="orbit" cx="400" cy="210" rx="355" ry="155" />
    <g class="path">${lines}</g>
    <g>${tethers}</g>
    ${nodeSvg}
    <g transform="translate(400 322)"><circle class="research" r="42"/><text y="5">R+</text><text class="label" y="65">Research</text></g>
  </svg>`;
}

class FirstResearchWebGL2Adapter {
  constructor({ canvas, content }) {
    this.canvas = canvas;
    this.content = content;
    this.gl = null;
    this.program = null;
    this.vao = null;
    this.buffers = {};
    this.locations = {};
    this.viewport = { width: 1, height: 1, pixelRatio: 1 };
    this.motionMode = "full";
    this.lens = "practical";
    this.selectedId = "research";
    this.startedAt = performance.now();
    this.suspended = false;
    this.contextStatus = "UNINITIALIZED";
    this.lastMvp = identity();
    this.lastNodePositions = new Map();
    this.errors = [];
  }

  initialize() {
    const gl = this.canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "high-performance" });
    if (!gl) {
      this.contextStatus = "WEBGL2_UNAVAILABLE";
      throw new Error("WebGL2 is not available.");
    }
    this.gl = gl;
    this.program = createProgram(gl);
    this.locations = {
      position: gl.getAttribLocation(this.program, "aPosition"),
      color: gl.getAttribLocation(this.program, "aColor"),
      size: gl.getAttribLocation(this.program, "aSize"),
      mvp: gl.getUniformLocation(this.program, "uMvp"),
      pointMode: gl.getUniformLocation(this.program, "uPointMode")
    };
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    this.buffers.position = gl.createBuffer();
    this.buffers.color = gl.createBuffer();
    this.buffers.size = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
    gl.enableVertexAttribArray(this.locations.color);
    gl.vertexAttribPointer(this.locations.color, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.size);
    gl.enableVertexAttribArray(this.locations.size);
    gl.vertexAttribPointer(this.locations.size, 1, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    this.contextStatus = "READY";
    return this;
  }

  resize({ width, height, deviceClass }) {
    if (!this.gl) return;
    const ratioCap = deviceClass === "phone" ? 1.35 : 1.8;
    const pixelRatio = Math.min(globalThis.devicePixelRatio || 1, ratioCap);
    const nextWidth = Math.max(1, Math.round(width * pixelRatio));
    const nextHeight = Math.max(1, Math.round(height * pixelRatio));
    if (this.canvas.width !== nextWidth || this.canvas.height !== nextHeight) {
      this.canvas.width = nextWidth;
      this.canvas.height = nextHeight;
    }
    this.viewport = { width: nextWidth, height: nextHeight, pixelRatio };
    this.gl.viewport(0, 0, nextWidth, nextHeight);
  }

  setMotionMode(mode) {
    this.motionMode = mode;
    if (mode === "full") this.startedAt = performance.now();
  }

  setLens(lens) {
    this.lens = lens;
  }

  setSelected(id) {
    this.selectedId = id;
  }

  suspend() {
    this.suspended = true;
  }

  resume() {
    this.suspended = false;
  }

  buildGeometry(now) {
    const palette = LENS_COLORS[this.lens] || LENS_COLORS.practical;
    const lines = { positions: [], colors: [], sizes: [] };
    const points = { positions: [], colors: [], sizes: [] };
    const elapsed = Math.max(0, now - this.startedAt);
    const full = this.motionMode === "full";
    const phase = full ? elapsed * 0.00016 : 0;
    const settle = full ? clamp(elapsed / 1500) : 1;
    const ringReveal = easeOutCubic(full ? clamp((elapsed - 520) / 1100) : 1);
    const tetherReveal = easeOutCubic(full ? clamp((elapsed - 920) / 900) : 1);

    const positions = new Map();
    this.content.first.forEach((item, index) => {
      const delay = index * 120;
      const local = full ? easeOutCubic(clamp((elapsed - delay) / 850)) : 1;
      const target = NODE_POSITIONS[item.id];
      const origin = [0, -1.1, -1.4];
      const position = mix3(origin, target, local * settle + (1 - settle) * local);
      if (full) position[2] += Math.sin(phase * 5 + index) * 0.05;
      positions.set(item.id, position);
    });
    positions.set("research", NODE_POSITIONS.research);
    this.lastNodePositions = positions;

    for (let index = 0; index < this.content.first.length - 1; index += 1) {
      const a = positions.get(this.content.first[index].id);
      const b = positions.get(this.content.first[index + 1].id);
      addLine(lines, a, b, [...palette.sequence.slice(0, 3), 0.62]);
    }

    const ringSegments = 112;
    const visibleSegments = Math.max(1, Math.floor(ringSegments * ringReveal));
    for (let index = 0; index < visibleSegments; index += 1) {
      const a = ringPoint(index, ringSegments, phase);
      const b = ringPoint(index + 1, ringSegments, phase);
      addLine(lines, a, b, palette.research);
    }

    this.content.first.forEach((item, index) => {
      const node = positions.get(item.id);
      const anchor = ringPoint(Math.floor((index / this.content.first.length) * ringSegments), ringSegments, phase);
      const endpoint = mix3(NODE_POSITIONS.research, anchor, 0.48);
      addLine(lines, endpoint, node, [...palette.tether.slice(0, 3), palette.tether[3] * tetherReveal]);
    });

    this.content.first.forEach((item) => {
      const active = item.id === this.selectedId;
      addVertex(points, positions.get(item.id), active ? [1, 0.84, 0.36, 1] : palette.sequence, (active ? 26 : 18) * this.viewport.pixelRatio);
    });
    addVertex(points, positions.get("research"), this.selectedId === "research" ? [0.82, 0.7, 1, 1] : palette.research, (this.selectedId === "research" ? 31 : 22) * this.viewport.pixelRatio);

    return { lines, points, phase };
  }

  upload(data) {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.positions), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.colors), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.size);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.sizes), gl.DYNAMIC_DRAW);
  }

  render(now = performance.now()) {
    if (!this.gl || this.suspended || this.motionMode === "static") return;
    const gl = this.gl;
    const { lines, points, phase } = this.buildGeometry(now);
    const aspect = this.viewport.width / Math.max(1, this.viewport.height);
    const projection = perspective(Math.PI / 4.1, aspect, 0.1, 50);
    const eye = [0, 0.15, aspect < 0.8 ? 13.2 : 11.1];
    const view = lookAt(eye, [0, -0.15, 0], [0, 1, 0]);
    const model = multiply(rotationY(this.motionMode === "full" ? Math.sin(phase) * 0.035 : 0), rotationX(-0.08));
    this.lastMvp = multiply(projection, multiply(view, model));

    gl.clearColor(0.015, 0.025, 0.07, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.locations.mvp, false, this.lastMvp);

    gl.uniform1f(this.locations.pointMode, 0);
    this.upload(lines);
    gl.drawArrays(gl.LINES, 0, lines.positions.length / 3);
    gl.uniform1f(this.locations.pointMode, 1);
    this.upload(points);
    gl.drawArrays(gl.POINTS, 0, points.positions.length / 3);
    gl.bindVertexArray(null);
  }

  projectLabels() {
    const width = this.viewport.width / this.viewport.pixelRatio;
    const height = this.viewport.height / this.viewport.pixelRatio;
    const result = {};
    for (const [id, position] of this.lastNodePositions.entries()) {
      const clip = transformPoint(this.lastMvp, position);
      result[id] = {
        x: (clip[0] * 0.5 + 0.5) * width,
        y: (-clip[1] * 0.5 + 0.5) * height,
        visible: clip[2] >= -1 && clip[2] <= 1
      };
    }
    return result;
  }

  captureReceipt() {
    return {
      rendererId: "DGB_LAWS_FIRST_RESEARCH_WEBGL2_SHARED_v1",
      contentId: this.content.id,
      lens: this.lens,
      motionMode: this.motionMode,
      selectedId: this.selectedId,
      contextStatus: this.contextStatus,
      suspended: this.suspended,
      visibleObjectIds: [...this.content.first.map((item) => item.id), "research", "sequence-path", "research-orbit", "research-tethers"],
      semanticDomAuthority: true,
      routeAuthority: false,
      evidenceStatusMutationAuthority: false,
      errors: [...this.errors]
    };
  }

  dispose() {
    if (!this.gl) return;
    const gl = this.gl;
    Object.values(this.buffers).forEach((buffer) => gl.deleteBuffer(buffer));
    if (this.vao) gl.deleteVertexArray(this.vao);
    if (this.program) gl.deleteProgram(this.program);
    this.gl = null;
    this.contextStatus = "DISPOSED";
  }
}

export function mountFirstResearchMechanic({ root, canvas, labelHost, staticHost, statusHost, content, onSelect = () => {} }) {
  if (!root || !canvas || !labelHost || !staticHost || !content) {
    throw new Error("First Research mechanic requires root, canvas, label host, static host, and content.");
  }

  staticHost.innerHTML = createStaticSvg(content);
  const labels = new Map();
  [...content.first, content.research].forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `first-research-label${item.id === "research" ? " first-research-label--research" : ""}`;
    button.dataset.relationshipId = item.id;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `${item.label}: ${item.question}`);
    button.innerHTML = `<span>${item.letter}</span><strong>${item.label}</strong>`;
    button.addEventListener("click", () => onSelect(item.id));
    labelHost.append(button);
    labels.set(item.id, button);
  });

  let adapter;
  let available = true;
  try {
    adapter = new FirstResearchWebGL2Adapter({ canvas, content }).initialize();
  } catch (error) {
    available = false;
    root.dataset.motion = "static";
    statusHost.textContent = "Static equivalent active because WebGL2 is unavailable. The complete relationship remains present.";
  }

  let animationFrame = 0;
  let running = false;
  const updateLabels = () => {
    if (!adapter || root.dataset.motion === "static") return;
    const projections = adapter.projectLabels();
    for (const [id, button] of labels.entries()) {
      const point = projections[id];
      if (!point) continue;
      button.style.left = `${point.x}px`;
      button.style.top = `${point.y}px`;
      button.hidden = !point.visible;
    }
  };
  const frame = (now) => {
    if (!running) return;
    adapter?.render(now);
    updateLabels();
    animationFrame = requestAnimationFrame(frame);
  };

  const api = {
    available,
    setLens(lens) {
      adapter?.setLens(lens);
    },
    setMotionMode(mode) {
      root.dataset.motion = mode;
      adapter?.setMotionMode(mode);
      if (mode === "static") api.stop();
      else api.start();
    },
    setSelected(id) {
      adapter?.setSelected(id);
      labels.forEach((button, key) => button.setAttribute("aria-pressed", String(key === id)));
      onSelect(id, { fromMechanic: true });
    },
    resize(dimensions) {
      adapter?.resize(dimensions);
      adapter?.render();
      updateLabels();
    },
    start() {
      if (!adapter || running || root.dataset.motion === "static") return;
      adapter.resume();
      running = true;
      animationFrame = requestAnimationFrame(frame);
    },
    stop() {
      if (!running) {
        adapter?.suspend();
        return;
      }
      running = false;
      cancelAnimationFrame(animationFrame);
      adapter?.suspend();
    },
    captureReceipt() {
      return adapter?.captureReceipt() || {
        rendererId: "STATIC_EQUIVALENT_ONLY",
        contentId: content.id,
        motionMode: "static",
        semanticDomAuthority: true,
        evidenceStatusMutationAuthority: false,
        errors: ["WEBGL2_UNAVAILABLE"]
      };
    },
    dispose() {
      api.stop();
      adapter?.dispose();
      labelHost.replaceChildren();
    }
  };

  return api;
}
