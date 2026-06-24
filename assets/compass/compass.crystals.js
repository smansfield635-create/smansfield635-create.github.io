/* /assets/compass/compass.crystals.js
   DGB Compass Generation Two — true 3D WebGL crystal visualization layer with roomId selection bridge.
   Scope: compass.crystals.js only.
   Owns visualization, visible room-node hit detection, coordinate placement, and controller selection requests.
   Does not own routes, route execution, semantic labels, controller state, HTML, CSS, or navigation.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_GENERATION_TWO_CRYSTALS_ROOM_ID_BRIDGE_TNT_v1",
    file: "/assets/compass/compass.crystals.js",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false,
    fifthFileAuthorized: false,
    owns: "single WebGL canvas visualization, scene graph, crystal meshes, lighting, animation, room-node hit detection, controller selection requests, receipts",
    doesNotOwn: "navigation, routes, route execution, semantic labels, controller state, HTML panel content, CSS layout authority"
  });

  const DEFAULT_ROOMS = Object.freeze({
    north: [
      { id: "north-1", label: "Compass Desk" },
      { id: "north-2", label: "Guide Desk" },
      { id: "north-3", label: "Front Door" },
      { id: "north-4", label: "About Sean" },
      { id: "north-5", label: "Philosophy Library" }
    ],
    east: [
      { id: "east-1", label: "Atlas Study" },
      { id: "east-2", label: "ZIONTS" },
      { id: "east-3", label: "Audralia Conservatory" },
      { id: "east-4", label: "Hearth" },
      { id: "east-5", label: "H-Earth" }
    ],
    south: [
      { id: "south-1", label: "The Lab" },
      { id: "south-2", label: "Law Library" },
      { id: "south-3", label: "Council Room" },
      { id: "south-4", label: "Control Cockpit" }
    ],
    west: [
      { id: "west-1", label: "Frontier Workshop Yard" },
      { id: "west-2", label: "Energy Bench" },
      { id: "west-3", label: "Water Bench" },
      { id: "west-4", label: "Infrastructure Bay" },
      { id: "west-5", label: "Vision Window" }
    ]
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

  const WING_THEMES = Object.freeze({
    north: { color: [0.68, 0.86, 1.0], rx: 0.46, rz: 0.34, h: 0.94, elongation: 1.0, irregularity: 0.018, rotationBias: 0.95 },
    east: { color: [0.48, 0.94, 0.86], rx: 0.50, rz: 0.37, h: 0.90, elongation: 1.04, irregularity: 0.026, rotationBias: 1.05 },
    south: { color: [0.98, 0.76, 0.42], rx: 0.49, rz: 0.34, h: 0.88, elongation: 0.98, irregularity: 0.014, rotationBias: 0.88 },
    west: { color: [0.88, 0.62, 0.50], rx: 0.51, rz: 0.36, h: 0.91, elongation: 1.08, irregularity: 0.038, rotationBias: 1.12 }
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    canvasMountStatus: "pending",
    webglContextStatus: "pending",
    shaderStatus: "pending",
    meshBuildStatus: "pending",
    registryBuildStatus: "pending",
    visibleObjectCount: 0,
    currentModeObserved: "unknown",
    renderLoopStatus: "pending",
    lastPointerAction: "none",
    selectedVisualNodeId: "",
    selectedVisualNodeType: "",
    selectedVisualNodeWing: "",
    selectedVisualNodeCoordinate: "",
    controllerSelectionRequested: false,
    controllerApiAvailable: false,
    failureReason: null,
    visualPassClaimed: false
  };

  const state = {
    root: null,
    canvas: null,
    gl: null,
    program: null,
    attribs: null,
    uniforms: null,
    registry: new Map(),
    meshes: new Map(),
    mode: "COMPASS_MODE",
    selectedWing: null,
    selectedRoom: null,
    reducedMotion: false,
    width: 1,
    height: 1,
    pixelRatio: 1,
    lastTime: 0,
    raf: 0,
    running: false,
    failHeld: false,
    view: null,
    projection: null
  };

  function emitReceipt(extra = {}) {
    Object.assign(RECEIPT, extra, { visualPassClaimed: false });

    if (state.root) {
      state.root.dataset.compassCrystalsReceipt = JSON.stringify(RECEIPT);
      state.root.dataset.compassCrystalsStatus = RECEIPT.failureReason ? "held" : "available";
    }

    if (state.canvas) {
      state.canvas.dataset.visualPassClaimed = "false";
      state.canvas.dataset.compassCrystalsReceipt = JSON.stringify(RECEIPT);
    }

    globalThis.DGB_COMPASS_CRYSTALS_RECEIPT = Object.freeze({ ...RECEIPT });
  }

  function hold(reason) {
    state.failHeld = true;
    emitReceipt({
      failureReason: reason,
      renderLoopStatus: "held"
    });
  }

  function qs(selectors) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  function findRoot() {
    return qs([
      "[data-compass-root]",
      "[data-dgb-compass]",
      ".compass",
      ".compass-shell",
      "#compass",
      "main"
    ]) || document.body;
  }

  function findCanvasMount(root) {
    return qs([
      "[data-compass-crystals-mount]",
      "[data-compass-canvas-mount]",
      ".compass-crystals",
      ".compass-visual",
      ".compass-canvas"
    ]) || root;
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
    canvas.style.pointerEvents = "auto";
    canvas.style.cursor = "pointer";

    const computed = getComputedStyle(mount);
    if (computed.position === "static") mount.style.position = "relative";

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

    varying vec3 vNormal;
    varying vec3 vColor;
    varying float vProminence;

    void main() {
      vNormal = normalize(uNormalMatrix * aNormal);
      vColor = aColor;
      vProminence = uProminence;
      gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying float vProminence;

    uniform vec3 uKeyLightDirection;
    uniform vec3 uFillLightDirection;
    uniform vec3 uRimLightDirection;
    uniform float uAmbientStrength;

    void main() {
      vec3 n = normalize(vNormal);
      float key = max(dot(n, normalize(-uKeyLightDirection)), 0.0);
      float fill = max(dot(n, normalize(-uFillLightDirection)), 0.0) * 0.45;
      float rim = pow(max(dot(n, normalize(-uRimLightDirection)), 0.0), 2.0) * 0.55;

      float light = uAmbientStrength + key * 0.85 + fill + rim;
      vec3 color = vColor * light * vProminence;
      float alpha = clamp(0.28 + vProminence * 0.72, 0.18, 1.0);

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

  function normalize(a) {
    const len = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / len, a[1] / len, a[2] / len];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function artifactOffset(index, irregularity) {
    if (!irregularity) return 1;
    return 1 + Math.sin(index * 2.17) * irregularity + Math.cos(index * 1.31) * irregularity * 0.55;
  }

  function mixColor(color, lift, warmth) {
    return [
      Math.min(color[0] * lift + warmth * 0.10, 1),
      Math.min(color[1] * lift + warmth * 0.075, 1),
      Math.min(color[2] * lift + warmth * 0.025, 1)
    ];
  }

  function createCrystalMesh(params) {
    const segments = params.segments || 8;
    const rx = params.rx || 0.55;
    const rz = params.rz || 0.38;
    const h = params.h || 1.0;
    const crown = !!params.crown;
    const color = params.color || [0.6, 0.85, 1.0];
    const irregularity = params.irregularity || 0;
    const warmth = params.warmth || 0;
    const elongation = params.elongation || 1;

    const positions = [];
    const faces = [];
    const top = positions.push(v3(0, h * elongation, 0)) - 1;
    const bottom = positions.push(v3(0, -h, 0)) - 1;

    const equator = [];
    for (let i = 0; i < segments; i += 1) {
      const a = (Math.PI * 2 * i) / segments;
      const offset = artifactOffset(i, irregularity);
      equator.push(positions.push(v3(
        Math.cos(a) * rx * offset,
        Math.sin(i * 1.7) * irregularity * 0.6,
        Math.sin(a) * rz * (2 - offset)
      )) - 1);
    }

    const crownRing = [];
    const lowerRing = [];

    if (crown) {
      for (let i = 0; i < segments; i += 1) {
        const a = (Math.PI * 2 * (i + 0.5)) / segments;
        const offset = artifactOffset(i + 3, irregularity * 0.85);
        crownRing.push(positions.push(v3(
          Math.cos(a) * rx * 0.62 * offset,
          h * 0.42 * elongation,
          Math.sin(a) * rz * 0.62 * (2 - offset)
        )) - 1);
      }

      for (let i = 0; i < segments; i += 1) {
        const a = (Math.PI * 2 * (i + 0.5)) / segments;
        const offset = artifactOffset(i + 7, irregularity * 0.75);
        lowerRing.push(positions.push(v3(
          Math.cos(a) * rx * 0.58 * offset,
          -h * 0.42,
          Math.sin(a) * rz * 0.58 * (2 - offset)
        )) - 1);
      }

      for (let i = 0; i < segments; i += 1) {
        const n = (i + 1) % segments;
        faces.push([top, crownRing[i], crownRing[n]]);
        faces.push([crownRing[i], equator[i], crownRing[n]]);
        faces.push([crownRing[n], equator[i], equator[n]]);
        faces.push([equator[i], lowerRing[i], equator[n]]);
        faces.push([equator[n], lowerRing[i], lowerRing[n]]);
        faces.push([lowerRing[i], bottom, lowerRing[n]]);
      }
    } else {
      for (let i = 0; i < segments; i += 1) {
        const n = (i + 1) % segments;
        faces.push([top, equator[i], equator[n]]);
        faces.push([equator[i], bottom, equator[n]]);
      }
    }

    const outPositions = [];
    const outNormals = [];
    const outColors = [];

    faces.forEach((face, faceIndex) => {
      const a = positions[face[0]];
      const b = positions[face[1]];
      const c = positions[face[2]];
      const normal = normalize(cross(sub(b, a), sub(c, a)));
      const facetLift = 0.82 + ((faceIndex % 6) * 0.043);
      const facetColor = mixColor(color, facetLift, warmth);

      [a, b, c].forEach((p) => {
        outPositions.push(p[0], p[1], p[2]);
        outNormals.push(normal[0], normal[1], normal[2]);
        outColors.push(facetColor[0], facetColor[1], facetColor[2]);
      });
    });

    return Object.freeze({
      vertexCount: outPositions.length / 3,
      positions: new Float32Array(outPositions),
      normals: new Float32Array(outNormals),
      colors: new Float32Array(outColors),
      triangleCount: faces.length
    });
  }

  function createBuffer(gl, data, usage = gl.STATIC_DRAW) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    return buffer;
  }

  function buildGpuMesh(gl, mesh) {
    return {
      vertexCount: mesh.vertexCount,
      triangleCount: mesh.triangleCount,
      position: createBuffer(gl, mesh.positions),
      normal: createBuffer(gl, mesh.normals),
      color: createBuffer(gl, mesh.colors)
    };
  }

  function buildMeshes(gl) {
    const meshes = new Map();

    meshes.set("mirrorland", buildGpuMesh(gl, createCrystalMesh({
      segments: 12,
      rx: 0.74,
      rz: 0.54,
      h: 1.26,
      crown: true,
      color: [0.72, 0.94, 1.0],
      irregularity: 0.012,
      warmth: 0.08,
      elongation: 1.05
    })));

    WINGS.forEach((wing) => {
      const theme = WING_THEMES[wing];

      meshes.set("wing-" + wing, buildGpuMesh(gl, createCrystalMesh({
        segments: 8,
        rx: theme.rx,
        rz: theme.rz,
        h: theme.h,
        crown: true,
        color: theme.color,
        irregularity: theme.irregularity,
        warmth: wing === "south" || wing === "west" ? 0.16 : 0.06,
        elongation: theme.elongation
      })));

      meshes.set("room-" + wing, buildGpuMesh(gl, createCrystalMesh({
        segments: 8,
        rx: 0.33,
        rz: 0.25,
        h: 0.57,
        crown: false,
        color: theme.color,
        irregularity: theme.irregularity * 0.65,
        warmth: wing === "south" || wing === "west" ? 0.12 : 0.04,
        elongation: 1
      })));
    });

    meshes.set("returnObject", buildGpuMesh(gl, createCrystalMesh({
      segments: 6,
      rx: 0.24,
      rz: 0.18,
      h: 0.38,
      crown: false,
      color: [1.0, 0.82, 0.54],
      irregularity: 0.028,
      warmth: 0.2,
      elongation: 1.08
    })));

    return meshes;
  }

  function coordinateFor(index, count) {
    const four = ["NW", "NE", "SW", "SE"];
    const five = ["N", "NE", "E", "SE", "CENTER"];
    if (count === 4) return four[index] || "";
    if (count === 5) return five[index] || "";
    return String(index + 1);
  }

  function node(id, type, opts = {}) {
    return {
      id,
      type,
      label: opts.label || id,
      wing: opts.wing || null,
      roomIndex: opts.roomIndex || 0,
      coordinate: opts.coordinate || "",
      meshKey: opts.meshKey || type,
      rotationBias: opts.rotationBias || 1,
      visible: true,
      transform: {
        x: 0, y: 0, z: 0,
        rx: 0, ry: 0, rz: 0,
        sx: 1, sy: 1, sz: 1,
        prominence: 1,
        rotationSpeed: 0.25
      },
      target: {
        x: 0, y: 0, z: 0,
        rx: 0, ry: 0, rz: 0,
        sx: 1, sy: 1, sz: 1,
        prominence: 1,
        rotationSpeed: 0.25
      }
    };
  }

  function buildRegistry() {
    const registry = new Map();

    registry.set("mirrorland", node("mirrorland", "mirrorland", {
      label: "Mirrorland",
      meshKey: "mirrorland",
      rotationBias: 0.72
    }));

    WINGS.forEach((wing) => {
      const theme = WING_THEMES[wing];

      registry.set(wing, node(wing, "wing", {
        label: wing.charAt(0).toUpperCase() + wing.slice(1),
        wing,
        meshKey: "wing-" + wing,
        rotationBias: theme.rotationBias
      }));

      const rooms = DEFAULT_ROOMS[wing];
      rooms.forEach((room, index) => {
        registry.set(room.id, node(room.id, "room", {
          label: room.label,
          wing,
          roomIndex: index,
          coordinate: coordinateFor(index, rooms.length),
          meshKey: "room-" + wing,
          rotationBias: 0.82 + index * 0.035
        }));
      });
    });

    registry.set("return", node("return", "returnObject", {
      label: "Return",
      meshKey: "returnObject",
      rotationBias: 1.2
    }));

    return registry;
  }

  function normalizeWing(value) {
    if (!value) return null;
    const v = String(value).toLowerCase();
    return WINGS.includes(v) ? v : null;
  }

  function readControllerState() {
    const root = state.root || document.documentElement;
    const ds = root.dataset || {};
    const rawMode = ds.compassMode || ds.mode || document.body.dataset.compassMode || "COMPASS_MODE";

    let mode = String(rawMode).toUpperCase();
    if (mode === "COMPASS") mode = "COMPASS_MODE";
    if (mode === "EXPANDED") mode = "EXPANDED_MODE";
    if (mode === "ROOM") mode = "ROOM_MODE";
    if (!["COMPASS_MODE", "EXPANDED_MODE", "ROOM_MODE"].includes(mode)) mode = "COMPASS_MODE";

    state.mode = mode;
    state.selectedWing = normalizeWing(ds.selectedWing || ds.activeWing || document.body.dataset.selectedWing || null);
    state.selectedRoom = ds.selectedRoom || ds.activeRoom || document.body.dataset.selectedRoom || null;
    state.reducedMotion =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      ds.reducedMotion === "true" ||
      document.body.dataset.reducedMotion === "true";

    emitReceipt({ currentModeObserved: state.mode });
  }

  function wingPosition(wing) {
    switch (wing) {
      case "north": return [0, 1.55, 0];
      case "east": return [2.05, 0, 0];
      case "south": return [0, -1.55, 0];
      case "west": return [-2.05, 0, 0];
      default: return [0, 0, 0];
    }
  }

  function roomClusterPosition(index, count) {
    const map5 = [
      [0, 1.08, -0.12],
      [1.18, 0.58, -0.10],
      [1.42, -0.28, -0.14],
      [0.74, -1.00, -0.12],
      [0, 0, 0.08]
    ];

    const map4 = [
      [-0.98, 0.72, -0.12],
      [0.98, 0.72, -0.12],
      [-0.98, -0.72, -0.12],
      [0.98, -0.72, -0.12]
    ];

    if (count === 5) return map5[index] || [0, 0, 0];
    if (count === 4) return map4[index] || [0, 0, 0];

    const angle = (Math.PI * 2 * index) / Math.max(count, 1) - Math.PI / 2;
    return [Math.cos(angle) * 1.45, Math.sin(angle) * 0.92, -0.12];
  }

  function setTarget(n, t) {
    Object.assign(n.target, t);
  }

  function updateTargets() {
    const selectedWing = state.selectedWing || "north";
    const selectedRooms = DEFAULT_ROOMS[selectedWing] || [];
    const selectedRoomId = state.selectedRoom;

    state.registry.forEach((n) => {
      n.visible = false;
      setTarget(n, {
        x: 0, y: 0, z: 0,
        sx: 1, sy: 1, sz: 1,
        prominence: 0,
        rotationSpeed: 0.15
      });
    });

    const mirrorland = state.registry.get("mirrorland");

    if (state.mode === "COMPASS_MODE") {
      mirrorland.visible = true;
      setTarget(mirrorland, {
        x: 0, y: 0, z: 0,
        sx: 1.45, sy: 1.45, sz: 1.45,
        prominence: 1.08,
        rotationSpeed: 0.16
      });

      WINGS.forEach((wing) => {
        const n = state.registry.get(wing);
        const p = wingPosition(wing);
        n.visible = true;
        setTarget(n, {
          x: p[0], y: p[1], z: p[2] - 0.15,
          sx: 1, sy: 1, sz: 1,
          prominence: 0.86,
          rotationSpeed: 0.22 * n.rotationBias
        });
      });
    }

    if (state.mode === "EXPANDED_MODE" || state.mode === "ROOM_MODE") {
      const parent = state.registry.get(selectedWing);
      if (parent) {
        parent.visible = true;
        setTarget(parent, {
          x: 0, y: 0, z: 0.15,
          sx: 1.18, sy: 1.18, sz: 1.18,
          prominence: 1.08,
          rotationSpeed: 0.18 * parent.rotationBias
        });
      }

      WINGS.forEach((wing) => {
        if (wing === selectedWing) return;
        const n = state.registry.get(wing);
        const p = wingPosition(wing);
        n.visible = true;
        setTarget(n, {
          x: p[0] * 1.35, y: p[1] * 1.35, z: -1.2,
          sx: 0.62, sy: 0.62, sz: 0.62,
          prominence: 0.28,
          rotationSpeed: 0.06 * n.rotationBias
        });
      });

      selectedRooms.forEach((room, index) => {
        const n = state.registry.get(room.id);
        const p = roomClusterPosition(index, selectedRooms.length);
        const selected = state.mode === "ROOM_MODE" && selectedRoomId === room.id;

        n.visible = true;
        setTarget(n, {
          x: p[0],
          y: p[1],
          z: selected ? 0.45 : p[2],
          sx: selected ? 0.86 : 0.60,
          sy: selected ? 0.86 : 0.60,
          sz: selected ? 0.86 : 0.60,
          prominence: selected ? 1.0 : state.mode === "ROOM_MODE" ? 0.38 : 0.78,
          rotationSpeed: selected ? 0.18 * n.rotationBias : 0.12 * n.rotationBias
        });
      });

      const ret = state.registry.get("return");
      ret.visible = true;
      setTarget(ret, {
        x: -1.75, y: -1.15, z: 0.32,
        sx: 0.52, sy: 0.52, sz: 0.52,
        prominence: 0.92,
        rotationSpeed: 0.28
      });
    }
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateTransforms(dt) {
    const speed = Math.min(1, dt * 6.5);
    state.registry.forEach((n) => {
      const a = n.transform;
      const b = n.target;

      ["x", "y", "z", "sx", "sy", "sz", "prominence", "rotationSpeed"].forEach((k) => {
        a[k] = lerp(a[k], b[k], speed);
      });

      if (!state.reducedMotion) {
        a.ry += dt * a.rotationSpeed;
        a.rx += dt * a.rotationSpeed * 0.23;
        a.rz += dt * a.rotationSpeed * 0.11;
      }
    });
  }

  function identity4() {
    return [1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1];
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
    m[12] = x; m[13] = y; m[14] = z;
    return m;
  }

  function scale4(x, y, z) {
    const m = identity4();
    m[0] = x; m[5] = y; m[10] = z;
    return m;
  }

  function rotateX4(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [1, 0, 0, 0,  0, c, s, 0,  0, -s, c, 0,  0, 0, 0, 1];
  }

  function rotateY4(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [c, 0, -s, 0,  0, 1, 0, 0,  s, 0, c, 0,  0, 0, 0, 1];
  }

  function rotateZ4(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [c, s, 0, 0,  -s, c, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1];
  }

  function perspective4(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ];
  }

  function lookAt4(eye, center, up) {
    const z = normalize(sub(eye, center));
    const x = normalize(cross(up, z));
    const y = cross(z, x);

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
    ];
  }

  function normalMatrix3(model) {
    return [
      model[0], model[1], model[2],
      model[4], model[5], model[6],
      model[8], model[9], model[10]
    ];
  }

  function modelMatrix(n) {
    const t = n.transform;
    return multiply4(
      translate4(t.x, t.y, t.z),
      multiply4(
        rotateZ4(t.rz),
        multiply4(
          rotateY4(t.ry),
          multiply4(
            rotateX4(t.rx),
            scale4(t.sx, t.sy, t.sz)
          )
        )
      )
    );
  }

  function transformPoint4(m, p) {
    const x = p[0], y = p[1], z = p[2], w = p[3];
    return [
      m[0] * x + m[4] * y + m[8] * z + m[12] * w,
      m[1] * x + m[5] * y + m[9] * z + m[13] * w,
      m[2] * x + m[6] * y + m[10] * z + m[14] * w,
      m[3] * x + m[7] * y + m[11] * z + m[15] * w
    ];
  }

  function projectNode(n) {
    if (!state.view || !state.projection) return null;

    const model = modelMatrix(n);
    const mv = multiply4(state.view, model);
    const mvp = multiply4(state.projection, mv);
    const clip = transformPoint4(mvp, [0, 0, 0, 1]);

    if (!clip[3]) return null;

    const ndcX = clip[0] / clip[3];
    const ndcY = clip[1] / clip[3];

    if (ndcX < -1.35 || ndcX > 1.35 || ndcY < -1.35 || ndcY > 1.35) return null;

    return {
      x: ((ndcX + 1) / 2) * state.width / state.pixelRatio,
      y: ((1 - ndcY) / 2) * state.height / state.pixelRatio
    };
  }

  function requestControllerRoomSelection(roomId, nodeHit) {
    const api = globalThis.DGB_COMPASS_CONTROLLER;
    const canRequest = !!api && (
      typeof api.requestRoomSelection === "function" ||
      typeof api.selectRoom === "function"
    );

    if (!canRequest) {
      emitReceipt({
        lastPointerAction: "controller-api-unavailable",
        selectedVisualNodeId: nodeHit ? nodeHit.id : "",
        selectedVisualNodeType: nodeHit ? nodeHit.type : "",
        selectedVisualNodeWing: nodeHit ? nodeHit.wing || "" : "",
        selectedVisualNodeCoordinate: nodeHit ? nodeHit.coordinate || "" : "",
        controllerSelectionRequested: false,
        controllerApiAvailable: false,
        failureReason: "CONTROLLER_API_UNAVAILABLE"
      });
      return;
    }

    if (typeof api.requestRoomSelection === "function") {
      api.requestRoomSelection(roomId);
    } else {
      api.selectRoom(roomId);
    }

    emitReceipt({
      lastPointerAction: "room-selection-requested",
      selectedVisualNodeId: nodeHit.id,
      selectedVisualNodeType: nodeHit.type,
      selectedVisualNodeWing: nodeHit.wing || "",
      selectedVisualNodeCoordinate: nodeHit.coordinate || "",
      controllerSelectionRequested: true,
      controllerApiAvailable: true,
      failureReason: null
    });
  }

  function handlePointerSelection(event) {
    if (!state.canvas || state.failHeld) return;

    readControllerState();
    updateTargets();
    updateTransforms(0);

    const rect = state.canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    let best = null;
    let bestDistance = Infinity;
    const hitRadius = Math.max(38, Math.min(64, rect.width * 0.075));

    state.registry.forEach((n) => {
      if (n.type !== "room") return;
      if (!n.visible || n.transform.prominence < 0.12) return;

      const screen = projectNode(n);
      if (!screen) return;

      const dx = px - screen.x;
      const dy = py - screen.y;
      const d = Math.hypot(dx, dy);

      if (d < bestDistance && d <= hitRadius) {
        best = n;
        bestDistance = d;
      }
    });

    if (!best) {
      emitReceipt({
        lastPointerAction: "pointer-no-room-hit",
        selectedVisualNodeId: "",
        selectedVisualNodeType: "",
        selectedVisualNodeWing: "",
        selectedVisualNodeCoordinate: "",
        controllerSelectionRequested: false,
        controllerApiAvailable: !!globalThis.DGB_COMPASS_CONTROLLER,
        failureReason: null
      });
      return;
    }

    requestControllerRoomSelection(best.id, best);
  }

  function resize() {
    const canvas = state.canvas;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    state.pixelRatio = dpr;
    state.width = width;
    state.height = height;

    state.gl.viewport(0, 0, width, height);
  }

  function bindAttrib(gl, buffer, location, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  function drawNode(n, view, projection) {
    if (!n.visible && n.transform.prominence < 0.03) return;

    const gl = state.gl;
    const mesh = state.meshes.get(n.meshKey);
    if (!mesh) return;

    bindAttrib(gl, mesh.position, state.attribs.position, 3);
    bindAttrib(gl, mesh.normal, state.attribs.normal, 3);
    bindAttrib(gl, mesh.color, state.attribs.color, 3);

    const model = modelMatrix(n);
    gl.uniformMatrix4fv(state.uniforms.model, false, new Float32Array(model));
    gl.uniformMatrix4fv(state.uniforms.view, false, new Float32Array(view));
    gl.uniformMatrix4fv(state.uniforms.projection, false, new Float32Array(projection));
    gl.uniformMatrix3fv(state.uniforms.normalMatrix, false, new Float32Array(normalMatrix3(model)));
    gl.uniform1f(state.uniforms.prominence, Math.max(0, n.transform.prominence));

    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
  }

  function render(now) {
    if (!state.running || state.failHeld) return;

    const t = now * 0.001;
    const dt = state.lastTime ? Math.min(0.05, t - state.lastTime) : 0.016;
    state.lastTime = t;

    readControllerState();
    updateTargets();
    updateTransforms(dt);
    resize();

    const gl = state.gl;
    gl.clearColor(0.02, 0.025, 0.04, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = state.width / Math.max(1, state.height);
    const cameraZ = aspect < 0.8 ? 8.2 : 6.7;
    const view = lookAt4([0, 0.82, cameraZ], [0, 0, 0], [0, 1, 0]);
    const projection = perspective4(Math.PI / 4.5, aspect, 0.1, 40);

    state.view = view;
    state.projection = projection;

    gl.useProgram(state.program);
    gl.uniform3f(state.uniforms.keyLightDirection, -0.4, -0.8, -0.7);
    gl.uniform3f(state.uniforms.fillLightDirection, 0.7, -0.35, -0.55);
    gl.uniform3f(state.uniforms.rimLightDirection, 0.1, 0.4, 1.0);
    gl.uniform1f(state.uniforms.ambientStrength, 0.22);

    let visible = 0;
    state.registry.forEach((n) => {
      if (n.visible && n.transform.prominence > 0.04) visible += 1;
      drawNode(n, view, projection);
    });

    emitReceipt({
      visibleObjectCount: visible,
      renderLoopStatus: state.reducedMotion ? "active-reduced-motion" : "active",
      failureReason: null
    });

    state.raf = requestAnimationFrame(render);
  }

  function bindPointerBridge() {
    state.canvas.addEventListener("click", handlePointerSelection);
    state.canvas.addEventListener("pointerdown", () => {
      emitReceipt({
        lastPointerAction: "pointer-down",
        controllerApiAvailable: !!globalThis.DGB_COMPASS_CONTROLLER
      });
    });
  }

  function init() {
    try {
      state.root = findRoot();
      const mount = findCanvasMount(state.root);
      state.canvas = ensureCanvas(mount);

      emitReceipt({ canvasMountStatus: "found" });

      const gl = getGL(state.canvas);
      if (!gl) {
        emitReceipt({ webglContextStatus: "unavailable" });
        hold("WEBGL_CONTEXT_UNAVAILABLE");
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
        keyLightDirection: gl.getUniformLocation(state.program, "uKeyLightDirection"),
        fillLightDirection: gl.getUniformLocation(state.program, "uFillLightDirection"),
        rimLightDirection: gl.getUniformLocation(state.program, "uRimLightDirection"),
        ambientStrength: gl.getUniformLocation(state.program, "uAmbientStrength")
      };

      emitReceipt({ shaderStatus: "compiled-linked" });

      state.meshes = buildMeshes(gl);
      emitReceipt({ meshBuildStatus: "built" });

      state.registry = buildRegistry();
      emitReceipt({ registryBuildStatus: "built" });

      bindPointerBridge();

      state.running = true;
      state.raf = requestAnimationFrame(render);

      globalThis.DGB_COMPASS_CRYSTALS = Object.freeze({
        contract: CONTRACT,
        receipt: () => Object.freeze({ ...RECEIPT }),
        stop: () => {
          state.running = false;
          cancelAnimationFrame(state.raf);
          emitReceipt({ renderLoopStatus: "stopped" });
        },
        start: () => {
          if (!state.running && !state.failHeld) {
            state.running = true;
            state.raf = requestAnimationFrame(render);
          }
        }
      });
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
