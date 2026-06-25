/* /assets/compass/compass.crystals.js
   DGB Compass — New Mirrorland object integrated WebGL expression.
   Scope: compass.crystals.js only.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_MIRRORLAND_OBJECT_CRYSTALS_TNT_v1",
    file: "/assets/compass/compass.crystals.js",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false,
    createMirrorlandMeshAuthorized: false
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

  const STAR_PALETTE = Object.freeze({
    north: [0.74, 0.88, 1.0],
    east: [0.62, 0.86, 0.96],
    south: [1.0, 0.88, 0.62],
    west: [0.92, 0.76, 0.58],
    petalNorth: [0.68, 0.84, 1.0],
    petalEast: [0.62, 0.90, 0.96],
    petalSouth: [1.0, 0.82, 0.56],
    petalWest: [0.94, 0.72, 0.56],
    mirror: [0.82, 0.94, 1.0]
  });

  const DEFAULT_ROOMS = Object.freeze({
    north: [
      { id: "north-1", label: "Compass Desk", short: "Reset orientation" },
      { id: "north-2", label: "Guide Desk", short: "Read the map" },
      { id: "north-3", label: "Front Door", short: "Enter formally" },
      { id: "north-4", label: "About Sean", short: "Builder context" },
      { id: "north-5", label: "Philosophy Library", short: "Founding thought" }
    ],
    east: [
      { id: "east-1", label: "Atlas Study", short: "Open worlds" },
      { id: "east-2", label: "ZIONTS", short: "Earth warning-path" },
      { id: "east-3", label: "Audralia", short: "Audrey chamber" },
      { id: "east-4", label: "Hearth", short: "Diagnostic chamber" },
      { id: "east-5", label: "H-Earth", short: "Parallel world" }
    ],
    south: [
      { id: "south-1", label: "The Lab", short: "Use instruments" },
      { id: "south-2", label: "Law Library", short: "Read standards" },
      { id: "south-3", label: "Council Room", short: "Inspect authority" },
      { id: "south-4", label: "Control Cockpit", short: "Operate controls" }
    ],
    west: [
      { id: "west-1", label: "Frontier Yard", short: "Workshop edge" },
      { id: "west-2", label: "Energy Bench", short: "Inspect power" },
      { id: "west-3", label: "Water Bench", short: "Inspect flow" },
      { id: "west-4", label: "Infrastructure Bay", short: "Inspect support" },
      { id: "west-5", label: "Vision Window", short: "See horizon" }
    ]
  });

  const AXIS_COPY = Object.freeze({
    north: { label: "Orientation", short: "North Star path" },
    east: { label: "Worlds", short: "Estate worlds" },
    south: { label: "Instruments", short: "Measure and govern" },
    west: { label: "Frontier", short: "Build next" }
  });

  const WING_THEMES = Object.freeze({
    north: { color: STAR_PALETTE.north, rx: 0.29, rz: 0.19, h: 0.68, glow: 1.44 },
    east: { color: STAR_PALETTE.east, rx: 0.29, rz: 0.19, h: 0.66, glow: 0.96 },
    south: { color: STAR_PALETTE.south, rx: 0.28, rz: 0.18, h: 0.65, glow: 0.90 },
    west: { color: STAR_PALETTE.west, rx: 0.29, rz: 0.19, h: 0.66, glow: 0.94 }
  });

  const ORBIT_ANGLES = Object.freeze({
    north: 0,
    east: Math.PI / 2,
    south: Math.PI,
    west: -Math.PI / 2
  });

  const GESTURE = Object.freeze({
    minimumSwipeDistancePx: 42,
    maximumTapDistancePx: 12,
    directionalDominanceRatio: 1.25
  });

  const MIRRORLAND_FIXED_DISPLAY_SCALE = 1.45;

  const RECEIPT = {
    contractId: CONTRACT.id,
    rootStatus: "pending",
    sceneStatus: "pending",
    mountStatus: "pending",
    canvasStatus: "pending",
    canvasCssWidth: 0,
    canvasCssHeight: 0,
    drawingBufferWidth: 0,
    drawingBufferHeight: 0,
    webglContextStatus: "pending",
    shaderStatus: "pending",
    programStatus: "pending",
    meshBuildStatus: "pending",
    registryBuildStatus: "pending",
    mirrorlandObjectStatus: "pending",
    mirrorlandValidationStatus: "pending",
    mirrorlandAdapterStatus: "pending",
    mirrorlandVertexCount: 0,
    mirrorlandTriangleCount: 0,
    genericMeshCount: 0,
    renderLoopStatus: "pending",
    drawCallsLastFrame: 0,
    visibleObjectCount: 0,
    mode: "unknown",
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    selectedDestinationType: "",
    flowerExpanded: false,
    failureReason: null,
    visualPassClaimed: false
  };

  const ADAPTER_RECEIPT = {
    adapterIdentity: "DGB_MIRRORLAND_INDEXED_TO_FLAT_WEBGL_ADAPTER_v1",
    meshAvailable: false,
    vertexCount: 0,
    triangleCount: 0,
    adapterValidation: "pending",
    legacyFallbackPermitted: false,
    haloPassDisabledForMirrorland: true,
    fixedUniformScale: MIRRORLAND_FIXED_DISPLAY_SCALE,
    failureReason: null
  };

  const state = {
    root: null,
    scene: null,
    canvas: null,
    surface: null,
    gl: null,
    program: null,
    attribs: null,
    uniforms: null,
    registry: new Map(),
    meshes: new Map(),
    mode: "COMPASS_MODE",
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    selectedDestinationType: "",
    flowerExpanded: false,
    reducedMotion: false,
    orbitAngle: 0,
    targetOrbitAngle: 0,
    width: 1,
    height: 1,
    pixelRatio: 1,
    view: null,
    projection: null,
    pointer: null,
    running: false,
    lastTime: 0,
    time: 0,
    raf: 0
  };

  function emitReceipt(extra = {}) {
    Object.assign(RECEIPT, extra, { visualPassClaimed: false });

    if (state.root) {
      state.root.dataset.compassCrystalsReceipt = JSON.stringify(RECEIPT);
      state.root.dataset.compassCrystalsStatus = RECEIPT.failureReason ? "held" : "available";
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.canvas) {
      state.canvas.dataset.compassCrystalsReceipt = JSON.stringify(RECEIPT);
      state.canvas.dataset.visualPassClaimed = "false";
    }

    globalThis.DGB_COMPASS_CRYSTALS_RECEIPT = Object.freeze({ ...RECEIPT });
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CRYSTALS = Object.freeze({
      contract: CONTRACT,
      receipt: () => Object.freeze({ ...RECEIPT }),
      mirrorlandAdapterReceipt: () => Object.freeze({ ...ADAPTER_RECEIPT }),
      stop: () => {
        state.running = false;
        cancelAnimationFrame(state.raf);
        emitReceipt({ renderLoopStatus: "stopped" });
      },
      start: () => {
        if (!state.running && state.gl && state.program) {
          state.running = true;
          state.raf = requestAnimationFrame(render);
          emitReceipt({ renderLoopStatus: "active" });
        }
      }
    });
  }

  function hold(reason, extra = {}) {
    emitReceipt({
      ...extra,
      failureReason: reason,
      renderLoopStatus: state.running ? RECEIPT.renderLoopStatus : "held"
    });
  }

  function qs(selectors, root = document) {
    for (const selector of selectors) {
      const el = root.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  function findRoot() {
    return qs(["[data-compass-root]", "#compass", "main"]) || document.body;
  }

  function ensureCanvas(mount) {
    const existing = mount.querySelector("canvas[data-compass-crystals-canvas]");
    if (existing) return existing;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("data-compass-crystals-canvas", "true");
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";

    if (getComputedStyle(mount).position === "static") {
      mount.style.position = "relative";
    }

    mount.prepend(canvas);
    return canvas;
  }

  function getGL(canvas) {
    return canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      depth: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false
    });
  }

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uNormalMatrix;
    uniform float uProminence;
    uniform float uHaloPass;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying float vProminence;
    varying float vHaloPass;
    varying vec3 vViewPosition;

    void main() {
      vec3 pos = aPosition;

      if (uHaloPass > 0.5) {
        pos += normalize(aNormal) * 0.10;
      }

      vec4 world = uModel * vec4(pos, 1.0);
      vec4 view = uView * world;

      vNormal = normalize(uNormalMatrix * aNormal);
      vColor = aColor;
      vProminence = uProminence;
      vHaloPass = uHaloPass;
      vViewPosition = view.xyz;

      gl_Position = uProjection * view;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying float vProminence;
    varying float vHaloPass;
    varying vec3 vViewPosition;

    uniform vec3 uKeyLightDirection;
    uniform vec3 uFillLightDirection;
    uniform float uAmbientStrength;

    void main() {
      vec3 n = normalize(vNormal);
      vec3 viewDir = normalize(-vViewPosition);

      float key = max(dot(n, normalize(-uKeyLightDirection)), 0.0);
      float fill = max(dot(n, normalize(-uFillLightDirection)), 0.0) * 0.38;
      float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 2.0);

      if (vHaloPass > 0.5) {
        vec3 halo = vColor * (0.45 + rim * 0.80);
        gl_FragColor = vec4(halo, 0.14 * vProminence);
        return;
      }

      float light = uAmbientStrength + key * 0.82 + fill + rim * 0.22;
      vec3 color = vColor * light;
      float alpha = clamp(0.18 + vProminence * 0.78 + rim * 0.06, 0.10, 0.98);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader) || "unknown shader error";
      gl.deleteShader(shader);
      throw new Error(info);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program) || "unknown program link error";
      gl.deleteProgram(program);
      throw new Error(info);
    }

    return program;
  }

  function v3(x, y, z) {
    return [x, y, z];
  }

  function sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
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

  function normalize(a) {
    const length = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / length, a[1] / length, a[2] / length];
  }

  function createBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
  }

  function buildGpuMesh(gl, mesh) {
    return Object.freeze({
      vertexCount: mesh.vertexCount,
      triangleCount: mesh.triangleCount,
      position: createBuffer(gl, mesh.positions),
      normal: createBuffer(gl, mesh.normals),
      color: createBuffer(gl, mesh.colors),
      isMirrorlandReviewGeometry: mesh.isMirrorlandReviewGeometry === true,
      adapterValidation: mesh.adapterValidation || null
    });
  }

  function createStarMesh(params) {
    const count = params.segments || 8;
    const color = params.color || STAR_PALETTE.north;
    const rx = params.rx || 0.32;
    const rz = params.rz || 0.20;
    const h = params.h || 0.60;
    const positions = [];
    const faces = [];

    function push(p) {
      positions.push(p);
      return positions.length - 1;
    }

    const top = push(v3(0, h * 0.30, 0));
    const bottom = push(v3(0, -h * 0.30, 0));

    for (let i = 0; i < count; i += 1) {
      const a = (Math.PI * 2 * i) / count;
      const b = (Math.PI * 2 * (i + 1)) / count;
      const tip = push(v3(Math.cos(a) * rx * 1.35, 0, Math.sin(a) * rz * 1.35));
      const next = push(v3(Math.cos(b) * rx * 0.52, 0, Math.sin(b) * rz * 0.52));
      const root = push(v3(Math.cos(a) * rx * 0.38, 0, Math.sin(a) * rz * 0.38));

      faces.push([top, root, tip]);
      faces.push([top, tip, next]);
      faces.push([bottom, tip, root]);
      faces.push([bottom, next, tip]);
    }

    const outPositions = [];
    const outNormals = [];
    const outColors = [];

    faces.forEach((face, faceIndex) => {
      const a = positions[face[0]];
      const b = positions[face[1]];
      const c = positions[face[2]];
      const normal = normalize(cross(sub(b, a), sub(c, a)));
      const lift = 0.88 + (faceIndex % 4) * 0.035;
      const facetColor = [
        Math.min(color[0] * lift, 1),
        Math.min(color[1] * lift, 1),
        Math.min(color[2] * lift, 1)
      ];

      [a, b, c].forEach((p) => {
        outPositions.push(p[0], p[1], p[2]);
        outNormals.push(normal[0], normal[1], normal[2]);
        outColors.push(facetColor[0], facetColor[1], facetColor[2]);
      });
    });

    return Object.freeze({
      vertexCount: outPositions.length / 3,
      triangleCount: faces.length,
      positions: new Float32Array(outPositions),
      normals: new Float32Array(outNormals),
      colors: new Float32Array(outColors)
    });
  }

  function resolveMirrorlandObject() {
    if (typeof DGB_MIRRORLAND_SELF_CONTAINED_REVIEW_OBJECT_v1 === "undefined") {
      throw new Error("MIRRORLAND_OBJECT_IDENTIFIER_UNDEFINED");
    }

    const object = DGB_MIRRORLAND_SELF_CONTAINED_REVIEW_OBJECT_v1;

    if (!object || object.identity !== "DGB_MIRRORLAND_SELF_CONTAINED_REVIEW_OBJECT_v1") {
      throw new Error("MIRRORLAND_OBJECT_IDENTITY_INVALID");
    }

    const validationResult =
      object.validation && typeof object.validation === "object"
        ? object.validation.result
        : "";

    if (object.result !== "REVIEW_PASS" || validationResult !== "REVIEW_PASS") {
      throw new Error("MIRRORLAND_OBJECT_NOT_REVIEW_PASS");
    }

    return object;
  }

  function extractMirrorlandGeometry(object) {
    const source = object.generatedGeometry || object;

    const positions = source.positions;
    const indices = source.triangleIndices || source.indices;

    if (!positions || !indices) {
      throw new Error("MIRRORLAND_GEOMETRY_FIELDS_MISSING");
    }

    return Object.freeze({
      positions,
      indices
    });
  }

  function computeFaceNormalFromPositions(positions, i0, i1, i2) {
    const a = i0 * 3;
    const b = i1 * 3;
    const c = i2 * 3;

    const x0 = positions[a];
    const y0 = positions[a + 1];
    const z0 = positions[a + 2];

    const x1 = positions[b];
    const y1 = positions[b + 1];
    const z1 = positions[b + 2];

    const x2 = positions[c];
    const y2 = positions[c + 1];
    const z2 = positions[c + 2];

    const values = [x0, y0, z0, x1, y1, z1, x2, y2, z2];

    for (let i = 0; i < values.length; i += 1) {
      if (!Number.isFinite(values[i])) {
        throw new Error("MIRRORLAND_NONFINITE_TRIANGLE_COORDINATE");
      }
    }

    const ux = x1 - x0;
    const uy = y1 - y0;
    const uz = z1 - z0;

    const vx = x2 - x0;
    const vy = y2 - y0;
    const vz = z2 - z0;

    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const length = Math.hypot(nx, ny, nz);

    if (!Number.isFinite(length) || length <= 1e-14) {
      throw new Error("MIRRORLAND_DEGENERATE_TRIANGLE");
    }

    return Object.freeze({
      normal: [nx / length, ny / length, nz / length],
      triangle: values
    });
  }

  function expandMirrorlandIndexedGeometry(geometry) {
    const positions = geometry.positions;
    const indices = geometry.indices;

    if (positions.length === 0 || positions.length % 3 !== 0) {
      throw new Error("MIRRORLAND_POSITION_ARRAY_INVALID");
    }

    if (indices.length === 0 || indices.length % 3 !== 0) {
      throw new Error("MIRRORLAND_INDEX_ARRAY_INVALID");
    }

    const vertexCount = positions.length / 3;

    for (let i = 0; i < positions.length; i += 1) {
      if (!Number.isFinite(positions[i])) {
        throw new Error("MIRRORLAND_NONFINITE_POSITION:" + i);
      }
    }

    const flatPositions = new Float32Array(indices.length * 3);
    const flatNormals = new Float32Array(indices.length * 3);
    const flatColors = new Float32Array(indices.length * 3);

    let destination = 0;

    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i];
      const i1 = indices[i + 1];
      const i2 = indices[i + 2];

      if (
        !Number.isInteger(i0) ||
        !Number.isInteger(i1) ||
        !Number.isInteger(i2) ||
        i0 < 0 ||
        i1 < 0 ||
        i2 < 0 ||
        i0 >= vertexCount ||
        i1 >= vertexCount ||
        i2 >= vertexCount ||
        i0 === i1 ||
        i1 === i2 ||
        i2 === i0
      ) {
        throw new Error("MIRRORLAND_INVALID_TRIANGLE_INDEX:" + i / 3);
      }

      const face = computeFaceNormalFromPositions(positions, i0, i1, i2);
      const normal = face.normal;
      const triangle = face.triangle;

      for (let k = 0; k < 9; k += 1) {
        const component = k % 3;
        flatPositions[destination + k] = triangle[k];
        flatNormals[destination + k] = normal[component];
        flatColors[destination + k] = STAR_PALETTE.mirror[component];
      }

      destination += 9;
    }

    ADAPTER_RECEIPT.meshAvailable = true;
    ADAPTER_RECEIPT.vertexCount = indices.length;
    ADAPTER_RECEIPT.triangleCount = indices.length / 3;
    ADAPTER_RECEIPT.adapterValidation = "REVIEW_PASS";
    ADAPTER_RECEIPT.failureReason = null;

    return Object.freeze({
      positions: flatPositions,
      normals: flatNormals,
      colors: flatColors,
      vertexCount: indices.length,
      triangleCount: indices.length / 3,
      isMirrorlandReviewGeometry: true,
      adapterValidation: "REVIEW_PASS"
    });
  }

  function buildMirrorlandMesh(gl) {
    const object = resolveMirrorlandObject();
    const geometry = extractMirrorlandGeometry(object);
    const expanded = expandMirrorlandIndexedGeometry(geometry);

    emitReceipt({
      mirrorlandObjectStatus: "found",
      mirrorlandValidationStatus: "REVIEW_PASS",
      mirrorlandAdapterStatus: "REVIEW_PASS",
      mirrorlandVertexCount: expanded.vertexCount,
      mirrorlandTriangleCount: expanded.triangleCount
    });

    return buildGpuMesh(gl, expanded);
  }

  function buildGenericMeshes(gl, meshes) {
    WINGS.forEach((wing) => {
      const theme = WING_THEMES[wing];
      const petalColor =
        wing === "north" ? STAR_PALETTE.petalNorth :
        wing === "east" ? STAR_PALETTE.petalEast :
        wing === "south" ? STAR_PALETTE.petalSouth :
        STAR_PALETTE.petalWest;

      meshes.set("wing-" + wing, buildGpuMesh(gl, createStarMesh({
        segments: 8,
        rx: theme.rx,
        rz: theme.rz,
        h: theme.h,
        color: theme.color
      })));

      meshes.set("room-" + wing, buildGpuMesh(gl, createStarMesh({
        segments: 6,
        rx: 0.22,
        rz: 0.12,
        h: 0.36,
        color: petalColor
      })));
    });
  }

  function buildMeshes(gl) {
    const meshes = new Map();

    buildGenericMeshes(gl, meshes);

    try {
      meshes.set("mirrorland", buildMirrorlandMesh(gl));
    } catch (error) {
      ADAPTER_RECEIPT.meshAvailable = false;
      ADAPTER_RECEIPT.adapterValidation = "FAIL";
      ADAPTER_RECEIPT.failureReason = error && error.message ? error.message : String(error);

      hold("MIRRORLAND_MESH_HELD:" + ADAPTER_RECEIPT.failureReason, {
        mirrorlandObjectStatus: "unavailable-or-invalid",
        mirrorlandAdapterStatus: "held"
      });
    }

    emitReceipt({
      meshBuildStatus: "built",
      genericMeshCount: WINGS.length * 2,
      mirrorlandLegacyFallback: false
    });

    return meshes;
  }

  function coordinateFor(index, count) {
    const five = ["CROWN", "RIGHT FIELD", "LOWER RIGHT", "LOWER LEFT", "LEFT FIELD"];
    const four = ["CROWN", "RIGHT FIELD", "ROOT", "LEFT FIELD"];
    if (count === 5) return five[index] || "";
    if (count === 4) return four[index] || "";
    return String(index + 1);
  }

  function node(id, type, opts = {}) {
    return {
      id,
      type,
      label: opts.label || id,
      short: opts.short || "",
      wing: opts.wing || "",
      roomIndex: opts.roomIndex || 0,
      coordinate: opts.coordinate || "",
      meshKey: opts.meshKey || type,
      rotationBias: opts.rotationBias || 1,
      glowColor: opts.glowColor || STAR_PALETTE.north,
      visible: true,
      transform: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, prominence: 1, rotationSpeed: 0.2, float: 0 },
      target: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, prominence: 1, rotationSpeed: 0.2, float: 0 }
    };
  }

  function buildRegistry() {
    const registry = new Map();

    registry.set("mirrorland", node("mirrorland", "mirrorland", {
      label: "Mirrorland",
      short: "Center fulcrum",
      meshKey: "mirrorland",
      glowColor: STAR_PALETTE.mirror,
      rotationBias: 0.55
    }));

    WINGS.forEach((wing) => {
      const copy = AXIS_COPY[wing];

      registry.set(wing, node(wing, "cardinal", {
        label: copy.label,
        short: copy.short,
        wing,
        meshKey: "wing-" + wing,
        glowColor: STAR_PALETTE[wing],
        rotationBias: 0.80
      }));

      DEFAULT_ROOMS[wing].forEach((room, index) => {
        registry.set(room.id, node(room.id, "petal", {
          label: room.label,
          short: room.short,
          wing,
          roomIndex: index,
          coordinate: coordinateFor(index, DEFAULT_ROOMS[wing].length),
          meshKey: "room-" + wing,
          glowColor:
            wing === "north" ? STAR_PALETTE.petalNorth :
            wing === "east" ? STAR_PALETTE.petalEast :
            wing === "south" ? STAR_PALETTE.petalSouth :
            STAR_PALETTE.petalWest,
          rotationBias: 0.90
        }));
      });
    });

    return registry;
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function readControllerState() {
    const ds = state.root.dataset || {};

    state.mode = String(ds.compassMode || "COMPASS_MODE").toUpperCase();
    state.orbitFocus = normalizeWing(ds.orbitFocus || ds.selectedCardinal || ds.selectedWing || "");
    state.selectedCardinal = normalizeWing(ds.selectedCardinal || "");
    state.selectedRoom = String(ds.selectedRoom || "");
    state.selectedDestinationType = String(ds.selectedDestinationType || "").trim().toLowerCase();
    state.flowerExpanded = ds.flowerExpanded === "true";
    state.reducedMotion =
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      ds.reducedMotion === "true";

    state.targetOrbitAngle = ORBIT_ANGLES[state.orbitFocus] || 0;

    emitReceipt({
      mode: state.mode,
      orbitFocus: state.orbitFocus,
      selectedCardinal: state.selectedCardinal,
      selectedRoom: state.selectedRoom,
      selectedDestinationType: state.selectedDestinationType,
      flowerExpanded: state.flowerExpanded
    });
  }

  function rotate2D(point, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [point[0] * c - point[1] * s, point[0] * s + point[1] * c, point[2] || 0];
  }

  function orbitWingPosition(wing) {
    const base =
      wing === "north" ? [0, 1.34, -0.16] :
      wing === "east" ? [1.64, 0, -0.16] :
      wing === "south" ? [0, -1.34, -0.16] :
      [-1.64, 0, -0.16];

    return rotate2D(base, state.orbitAngle);
  }

  function roomPetalPosition(index, count) {
    const map5 = [[0, 1.04, 0.14], [0.96, 0.31, 0.10], [0.59, -0.84, 0.10], [-0.59, -0.84, 0.10], [-0.96, 0.31, 0.10]];
    const map4 = [[0, 0.96, 0.12], [0.96, 0, 0.10], [0, -0.96, 0.10], [-0.96, 0, 0.10]];

    if (count === 5) return map5[index] || [0, 0, 0];
    if (count === 4) return map4[index] || [0, 0, 0];

    const angle = (Math.PI * 2 * index) / Math.max(count, 1) - Math.PI / 2;
    return [Math.cos(angle) * 0.98, Math.sin(angle) * 0.98, 0.10];
  }

  function setTarget(n, values) {
    Object.assign(n.target, values);
  }

  function setMirrorlandTarget(n, values) {
    setTarget(n, Object.assign({}, values, {
      sx: MIRRORLAND_FIXED_DISPLAY_SCALE,
      sy: MIRRORLAND_FIXED_DISPLAY_SCALE,
      sz: MIRRORLAND_FIXED_DISPLAY_SCALE,
      float: 0
    }));
  }

  function updateOrbitAngle(dt) {
    if (state.reducedMotion) {
      state.orbitAngle = state.targetOrbitAngle;
      return;
    }

    let delta = state.targetOrbitAngle - state.orbitAngle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;

    state.orbitAngle += delta * Math.min(1, dt * 4.65);
  }

  function updateTargets() {
    const focus = state.orbitFocus || "north";
    const mirrorlandSelected = state.selectedDestinationType === "mirrorland";
    const activeFlower = state.flowerExpanded && state.selectedCardinal && !mirrorlandSelected;
    const selectedRooms = DEFAULT_ROOMS[state.selectedCardinal || focus] || [];

    state.registry.forEach((n) => {
      n.visible = false;
      setTarget(n, { x: 0, y: 0, z: -1, sx: 1, sy: 1, sz: 1, prominence: 0, rotationSpeed: 0.08, float: 0 });
    });

    const mirrorland = state.registry.get("mirrorland");
    if (mirrorland) {
      mirrorland.visible = state.meshes.has("mirrorland");

      if (mirrorlandSelected) {
        setMirrorlandTarget(mirrorland, { x: 0, y: 0.02, z: 0.28, prominence: 1.05, rotationSpeed: 0.10 });
      } else if (activeFlower) {
        setMirrorlandTarget(mirrorland, { x: -1.74, y: -1.20, z: -1.20, prominence: 0.08, rotationSpeed: 0.04 });
      } else {
        setMirrorlandTarget(mirrorland, { x: 0, y: 0, z: 0.05, prominence: 0.92, rotationSpeed: 0.08 });
      }
    }

    if (!activeFlower) {
      WINGS.forEach((wing) => {
        const n = state.registry.get(wing);
        const p = orbitWingPosition(wing);
        const focused = wing === focus;

        n.visible = true;
        setTarget(n, {
          x: p[0],
          y: p[1],
          z: focused ? 0.18 : p[2],
          sx: focused ? 1.00 : 0.72,
          sy: focused ? 1.16 : 0.88,
          sz: focused ? 1.00 : 0.72,
          prominence: focused ? 1.0 : 0.62,
          rotationSpeed: focused ? 0.14 : 0.08,
          float: focused ? 0.018 : 0.008
        });
      });
      return;
    }

    WINGS.forEach((wing) => {
      const n = state.registry.get(wing);
      n.visible = wing === state.selectedCardinal;

      setTarget(n, {
        x: 0,
        y: 0,
        z: 0.08,
        sx: 0.42,
        sy: 0.52,
        sz: 0.42,
        prominence: wing === state.selectedCardinal ? 0.46 : 0,
        rotationSpeed: 0.06,
        float: 0.004
      });
    });

    selectedRooms.forEach((room, index) => {
      const n = state.registry.get(room.id);
      if (!n) return;

      const p = roomPetalPosition(index, selectedRooms.length);
      const selected = state.selectedRoom === room.id;

      n.visible = true;
      setTarget(n, {
        x: p[0],
        y: p[1],
        z: selected ? 0.68 : p[2] + 0.13,
        sx: selected ? 0.92 : 0.70,
        sy: selected ? 0.92 : 0.70,
        sz: selected ? 0.92 : 0.70,
        prominence: selected ? 1.08 : 0.86,
        rotationSpeed: selected ? 0.14 : 0.08,
        float: selected ? 0.018 : 0.010
      });
    });
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateTransforms(dt) {
    const speed = Math.min(1, dt * 6.1);

    state.registry.forEach((n) => {
      const a = n.transform;
      const b = n.target;

      ["x", "y", "z", "sx", "sy", "sz", "prominence", "rotationSpeed", "float"].forEach((key) => {
        a[key] = lerp(a[key], b[key], speed);
      });

      if (!state.reducedMotion) {
        a.ry += dt * a.rotationSpeed;
        a.rx += dt * a.rotationSpeed * 0.14;
        a.rz += dt * a.rotationSpeed * 0.06;
      }
    });
  }

  function identity4() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  function multiply4(a, b) {
    const out = new Array(16).fill(0);
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        for (let k = 0; k < 4; k += 1) {
          out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
        }
      }
    }
    return out;
  }

  function translate4(x, y, z) {
    const m = identity4();
    m[12] = x;
    m[13] = y;
    m[14] = z;
    return m;
  }

  function scale4(x, y, z) {
    const m = identity4();
    m[0] = x;
    m[5] = y;
    m[10] = z;
    return m;
  }

  function rotateX4(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }

  function rotateY4(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }

  function rotateZ4(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  function perspective4(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, (2 * far * near) * nf, 0];
  }

  function lookAt4(eye, center, up) {
    const z = normalize(sub(eye, center));
    const x = normalize(cross(up, z));
    const y = cross(z, x);
    return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1];
  }

  function normalMatrix3(model) {
    return [model[0], model[1], model[2], model[4], model[5], model[6], model[8], model[9], model[10]];
  }

  function modelMatrix(n, haloPass) {
    const t = n.transform;
    const isMirrorland = n.type === "mirrorland";

    const floatY =
      !isMirrorland && !state.reducedMotion
        ? Math.sin(state.time * 1.1 + n.roomIndex * 0.7 + n.rotationBias) * t.float
        : 0;

    const haloScale =
      haloPass && !isMirrorland
        ? 1.10
        : 1;

    return multiply4(
      translate4(t.x, t.y + floatY, t.z),
      multiply4(
        rotateZ4(t.rz),
        multiply4(
          rotateY4(t.ry),
          multiply4(
            rotateX4(t.rx),
            scale4(t.sx * haloScale, t.sy * haloScale, t.sz * haloScale)
          )
        )
      )
    );
  }

  function transformPoint4(m, p) {
    return [
      m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12] * p[3],
      m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13] * p[3],
      m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14] * p[3],
      m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15] * p[3]
    ];
  }

  function projectNode(n) {
    if (!state.view || !state.projection) return null;

    const model = modelMatrix(n, false);
    const mvp = multiply4(state.projection, multiply4(state.view, model));
    const clip = transformPoint4(mvp, [0, 0, 0, 1]);

    if (!clip[3]) return null;

    const x = clip[0] / clip[3];
    const y = clip[1] / clip[3];

    if (x < -1.35 || x > 1.35 || y < -1.35 || y > 1.35) return null;

    return {
      x: ((x + 1) / 2) * state.width / state.pixelRatio,
      y: ((1 - y) / 2) * state.height / state.pixelRatio
    };
  }

  function semanticElementForNode(n) {
    if (!state.root || !n) return null;
    if (n.type === "mirrorland") return state.root.querySelector("[data-compass-object='mirrorland']");
    if (n.type === "cardinal") return state.root.querySelector("[data-compass-cardinal][data-wing='" + n.wing + "']");
    if (n.type === "petal") return state.root.querySelector("[data-compass-room][data-room-id='" + n.id + "']");
    return null;
  }

  function syncSemanticNode(n) {
    const el = semanticElementForNode(n);
    if (!el || !(state.surface && state.surface.contains(el))) return;

    const screen = n.visible && n.transform.prominence >= 0.08 ? projectNode(n) : null;

    if (!screen) {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      return;
    }

    const primary = el.querySelector("span:first-child");
    const secondary = el.querySelector("span:last-child");

    if (primary) primary.textContent = n.type === "mirrorland" ? "Mirrorland" : n.label;
    if (secondary) secondary.textContent = n.type === "mirrorland" ? "Center fulcrum" : n.short;

    el.style.left = screen.x + "px";
    el.style.top = screen.y + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.transform = "translate(-50%, -50%) scale(" + (n.type === "mirrorland" ? 0.90 : 0.78) + ")";
    el.style.opacity = String(Math.max(0, Math.min(1, n.transform.prominence)));
    el.style.pointerEvents = n.transform.prominence >= 0.18 ? "auto" : "none";
    el.style.zIndex = n.type === "petal" ? "5" : n.type === "mirrorland" ? "6" : "3";
  }

  function syncSemanticObjects() {
    state.registry.forEach(syncSemanticNode);

    const note = state.root.querySelector(".compass-accessibility-note");
    if (note) {
      note.textContent = "Swipe to rotate the orbit. Tap a star to inspect. Use Enter Room only when you are ready to navigate.";
    }
  }

  function classifyGesture(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const distance = Math.hypot(dx, dy);

    if (distance <= GESTURE.maximumTapDistancePx) return { type: "tap", dx, dy };
    if (distance < GESTURE.minimumSwipeDistancePx) return { type: "ambiguous", dx, dy };

    if (absX > absY * GESTURE.directionalDominanceRatio) {
      return { type: "swipe", axis: "horizontal", raw: dx > 0 ? "swipeRight" : "swipeLeft", dx, dy };
    }

    if (absY > absX * GESTURE.directionalDominanceRatio) {
      return { type: "swipe", axis: "vertical", raw: dy > 0 ? "swipeDown" : "swipeUp", dx, dy };
    }

    return { type: "ambiguous", dx, dy };
  }

  function requestAxisSwipe(axis, raw, gesture) {
    const api = globalThis.DGB_COMPASS_CONTROLLER;
    const ok = !!api && typeof api.requestAxisSwipe === "function";

    if (ok) api.requestAxisSwipe(axis);

    emitReceipt({
      controllerApiAvailable: ok,
      failureReason: ok ? null : "CONTROLLER_AXIS_API_UNAVAILABLE",
      lastPointerAction: ok ? raw || "axis-swipe" : "controller-axis-api-unavailable",
      gestureType: "swipe",
      gestureDx: gesture ? gesture.dx : 0,
      gestureDy: gesture ? gesture.dy : 0
    });
  }

  function requestNodeSelection(n, gesture) {
    const api = globalThis.DGB_COMPASS_CONTROLLER;
    let ok = false;

    if (api && n.type === "mirrorland" && typeof api.requestMirrorlandSelection === "function") {
      api.requestMirrorlandSelection();
      ok = true;
    }

    if (api && n.type === "cardinal" && typeof api.requestCardinalSelection === "function") {
      api.requestCardinalSelection(n.wing);
      ok = true;
    }

    if (api && n.type === "petal" && typeof api.requestRoomSelection === "function") {
      api.requestRoomSelection(n.id);
      ok = true;
    }

    emitReceipt({
      controllerApiAvailable: ok,
      failureReason: ok ? null : "CONTROLLER_SELECTION_API_UNAVAILABLE",
      lastPointerAction: ok ? "visual-node-selection-requested" : "controller-selection-api-unavailable",
      gestureType: "tap",
      gestureDx: gesture ? gesture.dx : 0,
      gestureDy: gesture ? gesture.dy : 0
    });
  }

  function isSemanticTarget(target) {
    return !!(
      target &&
      target.closest &&
      target.closest("[data-compass-cardinal], [data-compass-room], [data-compass-object='mirrorland'], a, button")
    );
  }

  function findHit(event) {
    const rect = state.surface.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const radius = Math.max(38, Math.min(70, rect.width * 0.08));
    let best = null;
    let bestDistance = Infinity;

    state.registry.forEach((n) => {
      if (!n.visible || n.transform.prominence < 0.12) return;

      const screen = projectNode(n);
      if (!screen) return;

      const d = Math.hypot(px - screen.x, py - screen.y);
      if (d <= radius && d < bestDistance) {
        best = n;
        bestDistance = d;
      }
    });

    return best;
  }

  function handlePointerDown(event) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch (_) {}

    state.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      semanticStart: isSemanticTarget(event.target)
    };
  }

  function handlePointerMove(event) {
    if (!state.pointer || event.pointerId !== state.pointer.id) return;

    if (Math.hypot(event.clientX - state.pointer.x, event.clientY - state.pointer.y) >= GESTURE.minimumSwipeDistancePx) {
      event.preventDefault();
    }
  }

  function handlePointerUp(event) {
    if (!state.pointer || event.pointerId !== state.pointer.id) return;

    const pointer = state.pointer;
    state.pointer = null;

    const gesture = classifyGesture(pointer, { x: event.clientX, y: event.clientY });

    if (gesture.type === "swipe") {
      event.preventDefault();
      requestAxisSwipe(gesture.axis, gesture.raw, gesture);
      return;
    }

    if (gesture.type !== "tap") return;

    if (pointer.semanticStart || isSemanticTarget(event.target)) return;

    const hit = findHit(event);
    if (hit) requestNodeSelection(hit, gesture);
  }

  function handlePointerCancel() {
    state.pointer = null;
  }

  function bindPointerBridge() {
    state.surface =
      state.canvas.closest("[data-compass-scene]") ||
      state.canvas.closest(".compass-scene") ||
      state.scene ||
      state.canvas.parentElement ||
      state.root;

    if (!state.surface) {
      hold("MISSING_COMPASS_GESTURE_SURFACE");
      return;
    }

    state.surface.style.touchAction = "none";
    state.surface.style.overscrollBehavior = "contain";
    state.surface.addEventListener("pointerdown", handlePointerDown, { passive: false });
    state.surface.addEventListener("pointermove", handlePointerMove, { passive: false });
    state.surface.addEventListener("pointerup", handlePointerUp, { passive: false });
    state.surface.addEventListener("pointercancel", handlePointerCancel, { passive: false });
  }

  function resize() {
    const rect = state.canvas.getBoundingClientRect();
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.pixelRatio = dpr;
    state.width = width;
    state.height = height;
    state.gl.viewport(0, 0, width, height);

    emitReceipt({
      canvasCssWidth: rect.width,
      canvasCssHeight: rect.height,
      drawingBufferWidth: width,
      drawingBufferHeight: height
    });
  }

  function bindAttrib(gl, buffer, location, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  function drawNode(n, haloPass) {
    if (!n.visible || n.transform.prominence < 0.04) return;

    const mesh = state.meshes.get(n.meshKey);
    if (!mesh) return;

    if (n.type === "mirrorland" && haloPass) return;

    const gl = state.gl;
    bindAttrib(gl, mesh.position, state.attribs.position, 3);
    bindAttrib(gl, mesh.normal, state.attribs.normal, 3);
    bindAttrib(gl, mesh.color, state.attribs.color, 3);

    const model = modelMatrix(n, haloPass && n.type !== "mirrorland");

    gl.uniformMatrix4fv(state.uniforms.model, false, new Float32Array(model));
    gl.uniformMatrix4fv(state.uniforms.view, false, new Float32Array(state.view));
    gl.uniformMatrix4fv(state.uniforms.projection, false, new Float32Array(state.projection));
    gl.uniformMatrix3fv(state.uniforms.normalMatrix, false, new Float32Array(normalMatrix3(model)));
    gl.uniform1f(state.uniforms.prominence, Math.max(0, n.transform.prominence));
    gl.uniform1f(state.uniforms.haloPass, haloPass && n.type !== "mirrorland" ? 1 : 0);

    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
  }

  function render(now) {
    if (!state.running) return;

    const seconds = now * 0.001;
    const dt = state.lastTime ? Math.min(0.05, seconds - state.lastTime) : 0.016;
    state.lastTime = seconds;
    state.time = seconds;

    readControllerState();
    updateOrbitAngle(dt);
    updateTargets();
    updateTransforms(dt);
    resize();

    const gl = state.gl;
    gl.clearColor(0.02, 0.025, 0.04, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = state.width / Math.max(1, state.height);
    const cameraZ = aspect < 0.8 ? 8.2 : 6.7;
    const cameraY = state.selectedDestinationType === "mirrorland" ? 0.60 : 0.70;

    state.view = lookAt4([0, cameraY, cameraZ], [0, 0, 0], [0, 1, 0]);
    state.projection = perspective4(Math.PI / 4.8, aspect, 0.1, 40);

    syncSemanticObjects();

    gl.useProgram(state.program);
    gl.uniform3f(state.uniforms.keyLightDirection, -0.36, -0.84, -0.70);
    gl.uniform3f(state.uniforms.fillLightDirection, 0.72, -0.34, -0.52);
    gl.uniform1f(state.uniforms.ambientStrength, 0.32);

    let drawCalls = 0;
    let visible = 0;

    gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    state.registry.forEach((n) => {
      if (n.visible && n.transform.prominence > 0.04 && n.type !== "mirrorland") {
        drawNode(n, true);
        drawCalls += 1;
      }
    });

    gl.depthMask(true);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    state.registry.forEach((n) => {
      if (n.visible && n.transform.prominence > 0.04) {
        visible += 1;
        drawNode(n, false);
        drawCalls += 1;
      }
    });

    emitReceipt({
      visibleObjectCount: visible,
      drawCallsLastFrame: drawCalls,
      renderLoopStatus: state.reducedMotion ? "active-reduced-motion" : "active",
      failureReason: null
    });

    state.raf = requestAnimationFrame(render);
  }

  function init() {
    exposeApi();

    try {
      state.root = findRoot();
      state.scene = qs(["[data-compass-scene]", ".compass-scene"], state.root);
      const mount = qs(["[data-compass-crystals-mount]", ".compass-scene__visual", ".compass-scene"], state.root) || state.root;

      emitReceipt({
        rootStatus: state.root ? "found" : "missing",
        sceneStatus: state.scene ? "found" : "missing",
        mountStatus: mount ? "found" : "missing"
      });

      state.canvas = ensureCanvas(mount);
      emitReceipt({ canvasStatus: "created-or-found" });

      const gl = getGL(state.canvas);
      if (!gl) {
        hold("WEBGL_CONTEXT_UNAVAILABLE", { webglContextStatus: "unavailable" });
        return;
      }

      state.gl = gl;
      emitReceipt({ webglContextStatus: "acquired" });

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.CULL_FACE);

      state.program = createProgram(gl);
      emitReceipt({ shaderStatus: "compiled", programStatus: "linked" });

      state.attribs = {
        position: gl.getAttribLocation(state.program, "aPosition"),
        normal: gl.getAttribLocation(state.program, "aNormal"),
        color: gl.getAttribLocation(state.program, "aColor")
      };

      state.uniforms = {
        model: gl.getUniformLocation(state.program, "uModel"),
        view: gl.getUniformLocation(state.program, "uView"),
        projection: gl.getUniformLocation(state.program, "uProjection"),
        normalMatrix: gl.getUniformLocation(state.program, "uNormalMatrix"),
        prominence: gl.getUniformLocation(state.program, "uProminence"),
        haloPass: gl.getUniformLocation(state.program, "uHaloPass"),
        keyLightDirection: gl.getUniformLocation(state.program, "uKeyLightDirection"),
        fillLightDirection: gl.getUniformLocation(state.program, "uFillLightDirection"),
        ambientStrength: gl.getUniformLocation(state.program, "uAmbientStrength")
      };

      state.meshes = buildMeshes(gl);
      state.registry = buildRegistry();
      emitReceipt({ registryBuildStatus: "built" });

      bindPointerBridge();

      state.running = true;
      state.raf = requestAnimationFrame(render);
      emitReceipt({ renderLoopStatus: "active" });
    } catch (error) {
      hold("CRYSTALS_INIT_FAILURE:" + (error && error.message ? error.message : String(error)));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
