/* /assets/compass/compass.crystals.js
   DGB Compass — Navigational Star Orbit Flower Traversal WebGL layer.
   Scope: compass.crystals.js only.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_NAVIGATIONAL_STAR_ORBIT_FLOWER_TNT_v5",
    file: "/assets/compass/compass.crystals.js",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false,
    fifthFileAuthorized: false
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

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

  const STAR_PALETTE = Object.freeze({
    north: [0.74, 0.88, 1.0],
    east: [0.62, 0.86, 0.96],
    south: [1.0, 0.88, 0.62],
    west: [0.92, 0.76, 0.58],
    petalNorth: [0.68, 0.84, 1.0],
    petalEast: [0.62, 0.90, 0.96],
    petalSouth: [1.0, 0.82, 0.56],
    petalWest: [0.94, 0.72, 0.56],
    mirror: [0.78, 0.92, 1.0]
  });

  const WING_THEMES = Object.freeze({
    north: { color: STAR_PALETTE.north, rx: 0.31, rz: 0.23, h: 0.64, elongation: 1.18, irregularity: 0.010, rotationBias: 0.95, glow: 1.35 },
    east: { color: STAR_PALETTE.east, rx: 0.31, rz: 0.23, h: 0.62, elongation: 1.14, irregularity: 0.012, rotationBias: 1.05, glow: 0.92 },
    south: { color: STAR_PALETTE.south, rx: 0.30, rz: 0.22, h: 0.61, elongation: 1.12, irregularity: 0.010, rotationBias: 0.88, glow: 0.86 },
    west: { color: STAR_PALETTE.west, rx: 0.31, rz: 0.23, h: 0.62, elongation: 1.15, irregularity: 0.013, rotationBias: 1.12, glow: 0.90 }
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

  const RECEIPT = {
    contractId: CONTRACT.id,
    visualSystem: "navigational-stars",
    canvasMountStatus: "pending",
    webglContextStatus: "pending",
    shaderStatus: "pending",
    meshBuildStatus: "pending",
    registryBuildStatus: "pending",
    starGlowStatus: "pending",
    northStarGlow: "enabled",
    visibleObjectCount: 0,
    currentModeObserved: "unknown",
    orbitFocusObserved: "",
    orbitAngleObserved: 0,
    selectedCardinalObserved: "",
    selectedRoomObserved: "",
    flowerExpandedObserved: false,
    semanticSyncStatus: "pending",
    renderLoopStatus: "pending",
    lastPointerAction: "none",
    gestureType: "",
    gestureDx: 0,
    gestureDy: 0,
    lastSwipeAxis: "",
    pointerCaptured: false,
    selectedVisualNodeId: "",
    selectedVisualNodeType: "",
    selectedVisualNodeWing: "",
    selectedVisualNodeCoordinate: "",
    controllerRequest: "",
    controllerApiAvailable: false,
    failureReason: null,
    visualPassClaimed: false
  };

  const state = {
    root: null,
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
    flowerExpanded: false,
    reducedMotion: false,
    orbitAngle: 0,
    targetOrbitAngle: 0,
    width: 1,
    height: 1,
    pixelRatio: 1,
    lastTime: 0,
    raf: 0,
    running: false,
    failHeld: false,
    view: null,
    projection: null,
    pointer: null
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

  function hold(reason) {
    state.failHeld = true;
    emitReceipt({ failureReason: reason, renderLoopStatus: "held" });
  }

  function qs(selectors) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  function findRoot() {
    return qs(["[data-compass-root]", "#compass", "main"]) || document.body;
  }

  function findCanvasMount(root) {
    return qs(["[data-compass-crystals-mount]", ".compass-scene__visual", ".compass-scene"]) || root;
  }

  function findGestureSurface(root, canvas) {
    return (
      canvas.closest("[data-compass-scene]") ||
      canvas.closest(".compass-scene") ||
      root.querySelector("[data-compass-scene]") ||
      root.querySelector(".compass-scene") ||
      canvas.parentElement ||
      root
    );
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

    if (getComputedStyle(mount).position === "static") mount.style.position = "relative";

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
    uniform float uGlowStrength;
    uniform vec3 uGlowColor;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying float vProminence;
    varying float vGlowStrength;
    varying vec3 vGlowColor;

    void main() {
      vNormal = normalize(uNormalMatrix * aNormal);
      vColor = aColor;
      vProminence = uProminence;
      vGlowStrength = uGlowStrength;
      vGlowColor = uGlowColor;
      gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying float vProminence;
    varying float vGlowStrength;
    varying vec3 vGlowColor;

    uniform vec3 uKeyLightDirection;
    uniform vec3 uFillLightDirection;
    uniform vec3 uRimLightDirection;
    uniform float uAmbientStrength;

    void main() {
      vec3 n = normalize(vNormal);
      float key = max(dot(n, normalize(-uKeyLightDirection)), 0.0);
      float fill = max(dot(n, normalize(-uFillLightDirection)), 0.0) * 0.38;
      float rim = pow(max(dot(n, normalize(-uRimLightDirection)), 0.0), 2.0) * 0.70;
      float starCore = pow(max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 4.0);
      float light = uAmbientStrength + key * 0.82 + fill + rim;
      vec3 lit = vColor * light * vProminence;
      vec3 glow = vGlowColor * (rim * 0.48 + starCore * 0.52) * vGlowStrength * vProminence;
      vec3 color = lit + glow;
      float alpha = clamp(0.18 + vProminence * 0.70 + vGlowStrength * 0.06, 0.10, 0.96);
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

  function v3(x, y, z) { return [x, y, z]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function normalize(a) {
    const len = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / len, a[1] / len, a[2] / len];
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  function artifactOffset(index, irregularity) {
    if (!irregularity) return 1;
    return 1 + Math.sin(index * 2.17) * irregularity + Math.cos(index * 1.31) * irregularity * 0.55;
  }

  function mixColor(color, lift, warmth) {
    return [
      Math.min(color[0] * lift + warmth * 0.08, 1),
      Math.min(color[1] * lift + warmth * 0.06, 1),
      Math.min(color[2] * lift + warmth * 0.03, 1)
    ];
  }

  function createStarMesh(params) {
    const segments = params.segments || 8;
    const rx = params.rx || 0.42;
    const rz = params.rz || 0.30;
    const h = params.h || 0.76;
    const crown = !!params.crown;
    const color = params.color || STAR_PALETTE.north;
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
      const pointLift = i % 2 === 0 ? 1.08 : 0.86;
      const offset = artifactOffset(i, irregularity) * pointLift;
      equator.push(positions.push(v3(
        Math.cos(a) * rx * offset,
        Math.sin(i * 1.7) * irregularity * 0.45,
        Math.sin(a) * rz * (2 - offset * 0.58)
      )) - 1);
    }

    const crownRing = [];
    const lowerRing = [];

    if (crown) {
      for (let i = 0; i < segments; i += 1) {
        const a = (Math.PI * 2 * (i + 0.5)) / segments;
        const offset = artifactOffset(i + 3, irregularity * 0.85);
        crownRing.push(positions.push(v3(
          Math.cos(a) * rx * 0.54 * offset,
          h * 0.39 * elongation,
          Math.sin(a) * rz * 0.54 * (2 - offset)
        )) - 1);
      }

      for (let i = 0; i < segments; i += 1) {
        const a = (Math.PI * 2 * (i + 0.5)) / segments;
        const offset = artifactOffset(i + 7, irregularity * 0.75);
        lowerRing.push(positions.push(v3(
          Math.cos(a) * rx * 0.50 * offset,
          -h * 0.39,
          Math.sin(a) * rz * 0.50 * (2 - offset)
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
      const facetLift = 0.86 + ((faceIndex % 6) * 0.034);
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

    meshes.set("mirrorland", buildGpuMesh(gl, createStarMesh({
      segments: 12,
      rx: 0.54,
      rz: 0.40,
      h: 0.84,
      crown: true,
      color: STAR_PALETTE.mirror,
      irregularity: 0.010,
      warmth: 0.06,
      elongation: 1.00
    })));

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
        crown: true,
        color: theme.color,
        irregularity: theme.irregularity,
        warmth: wing === "south" || wing === "west" ? 0.08 : 0.04,
        elongation: theme.elongation
      })));

      meshes.set("room-" + wing, buildGpuMesh(gl, createStarMesh({
        segments: 6,
        rx: 0.24,
        rz: 0.18,
        h: 0.39,
        crown: false,
        color: petalColor,
        irregularity: theme.irregularity * 0.40,
        warmth: wing === "south" || wing === "west" ? 0.06 : 0.035,
        elongation: 1.04
      })));
    });

    emitReceipt({ starGlowStatus: "configured" });
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
      glowColor: opts.glowColor || [0.74, 0.88, 1.0],
      baseGlow: opts.baseGlow || 0.72,
      visible: true,
      transform: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, prominence: 1, rotationSpeed: 0.25, glow: opts.baseGlow || 0.72 },
      target: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, prominence: 1, rotationSpeed: 0.25, glow: opts.baseGlow || 0.72 }
    };
  }

  function buildRegistry() {
    const registry = new Map();

    registry.set("mirrorland", node("mirrorland", "mirrorland", {
      label: "Mirrorland",
      short: "Center fulcrum",
      meshKey: "mirrorland",
      rotationBias: 0.72,
      glowColor: STAR_PALETTE.mirror,
      baseGlow: 0.82
    }));

    WINGS.forEach((wing) => {
      const theme = WING_THEMES[wing];
      const copy = AXIS_COPY[wing];
      const petalColor =
        wing === "north" ? STAR_PALETTE.petalNorth :
        wing === "east" ? STAR_PALETTE.petalEast :
        wing === "south" ? STAR_PALETTE.petalSouth :
        STAR_PALETTE.petalWest;

      registry.set(wing, node(wing, "cardinal", {
        label: copy.label,
        short: copy.short,
        wing,
        meshKey: "wing-" + wing,
        rotationBias: theme.rotationBias,
        glowColor: theme.color,
        baseGlow: theme.glow
      }));

      DEFAULT_ROOMS[wing].forEach((room, index) => {
        registry.set(room.id, node(room.id, "petal", {
          label: room.label,
          short: room.short,
          wing,
          roomIndex: index,
          coordinate: coordinateFor(index, DEFAULT_ROOMS[wing].length),
          meshKey: "room-" + wing,
          rotationBias: 0.82 + index * 0.035,
          glowColor: petalColor,
          baseGlow: 0.78
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
    const root = state.root || document.documentElement;
    const ds = root.dataset || {};
    const rawMode = String(ds.compassMode || "COMPASS_MODE").toUpperCase();

    state.mode = rawMode;
    state.orbitFocus = normalizeWing(ds.orbitFocus || ds.selectedCardinal || ds.selectedWing || "");
    state.selectedCardinal = normalizeWing(ds.selectedCardinal || "");
    state.selectedRoom = String(ds.selectedRoom || "");
    state.flowerExpanded = ds.flowerExpanded === "true";
    state.reducedMotion =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      ds.reducedMotion === "true";

    state.targetOrbitAngle = ORBIT_ANGLES[state.orbitFocus] || 0;

    emitReceipt({
      currentModeObserved: state.mode,
      orbitFocusObserved: state.orbitFocus,
      orbitAngleObserved: Number(state.orbitAngle.toFixed(4)),
      selectedCardinalObserved: state.selectedCardinal,
      selectedRoomObserved: state.selectedRoom,
      flowerExpandedObserved: state.flowerExpanded
    });
  }

  function rotate2D(point, angle) {
    const x = point[0];
    const y = point[1];
    const z = point[2] || 0;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [x * c - y * s, x * s + y * c, z];
  }

  function baseWingPosition(wing) {
    switch (wing) {
      case "north": return [0, 1.34, -0.16];
      case "east": return [1.64, 0, -0.16];
      case "south": return [0, -1.34, -0.16];
      case "west": return [-1.64, 0, -0.16];
      default: return [0, 0, 0];
    }
  }

  function orbitWingPosition(wing) {
    return rotate2D(baseWingPosition(wing), state.orbitAngle);
  }

  function roomPetalPosition(index, count) {
    const map5 = [
      [0, 1.04, 0.14],
      [0.96, 0.31, 0.10],
      [0.59, -0.84, 0.10],
      [-0.59, -0.84, 0.10],
      [-0.96, 0.31, 0.10]
    ];
    const map4 = [
      [0, 0.96, 0.12],
      [0.96, 0, 0.10],
      [0, -0.96, 0.10],
      [-0.96, 0, 0.10]
    ];

    if (count === 5) return map5[index] || [0, 0, 0];
    if (count === 4) return map4[index] || [0, 0, 0];

    const angle = (Math.PI * 2 * index) / Math.max(count, 1) - Math.PI / 2;
    return [Math.cos(angle) * 0.98, Math.sin(angle) * 0.98, 0.10];
  }

  function setTarget(n, t) {
    Object.assign(n.target, t);
  }

  function shortestAngleDelta(from, to) {
    let delta = to - from;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    return delta;
  }

  function updateOrbitAngle(dt) {
    if (state.reducedMotion) {
      state.orbitAngle = state.targetOrbitAngle;
      return;
    }

    const speed = Math.min(1, dt * 5.2);
    state.orbitAngle += shortestAngleDelta(state.orbitAngle, state.targetOrbitAngle) * speed;
  }

  function updateTargets() {
    const focus = state.orbitFocus || "north";
    const activeFlower = state.flowerExpanded && state.selectedCardinal;
    const selectedRooms = DEFAULT_ROOMS[state.selectedCardinal || focus] || [];
    const selectedRoomId = state.selectedRoom;

    state.registry.forEach((n) => {
      n.visible = false;
      setTarget(n, { x: 0, y: 0, z: 0, sx: 1, sy: 1, sz: 1, prominence: 0, rotationSpeed: 0.10, glow: 0 });
    });

    const mirrorland = state.registry.get("mirrorland");
    mirrorland.visible = true;

    if (!activeFlower) {
      setTarget(mirrorland, {
        x: 0, y: 0, z: 0.04,
        sx: 0.96, sy: 0.96, sz: 0.96,
        prominence: 0.86,
        rotationSpeed: 0.10,
        glow: 0.86
      });

      WINGS.forEach((wing) => {
        const n = state.registry.get(wing);
        const p = orbitWingPosition(wing);
        const focused = wing === focus;
        const isNorthStar = wing === "north";

        n.visible = true;
        setTarget(n, {
          x: p[0],
          y: p[1],
          z: focused ? 0.14 : p[2],
          sx: focused ? 0.94 : 0.70,
          sy: focused ? 1.14 : 0.90,
          sz: focused ? 0.94 : 0.70,
          prominence: focused ? 1.0 : 0.62,
          rotationSpeed: focused ? 0.16 * n.rotationBias : 0.10 * n.rotationBias,
          glow: focused ? (isNorthStar ? 1.62 : 1.08) : (isNorthStar ? 1.05 : 0.62)
        });
      });

      return;
    }

    setTarget(mirrorland, {
      x: -1.72, y: -1.22, z: -1.46,
      sx: 0.24, sy: 0.24, sz: 0.24,
      prominence: 0.05,
      rotationSpeed: 0.03,
      glow: 0.12
    });

    WINGS.forEach((wing) => {
      const n = state.registry.get(wing);

      if (wing === state.selectedCardinal) {
        n.visible = true;
        setTarget(n, {
          x: 0, y: 0, z: 0.10,
          sx: 0.40, sy: 0.50, sz: 0.40,
          prominence: 0.44,
          rotationSpeed: 0.07 * n.rotationBias,
          glow: wing === "north" ? 1.12 : 0.62
        });
        return;
      }

      n.visible = false;
      setTarget(n, {
        x: 0, y: 0, z: -1.2,
        sx: 0.14, sy: 0.14, sz: 0.14,
        prominence: 0,
        rotationSpeed: 0.02,
        glow: 0
      });
    });

    selectedRooms.forEach((room, index) => {
      const n = state.registry.get(room.id);
      const p = roomPetalPosition(index, selectedRooms.length);
      const selected = selectedRoomId === room.id;

      n.visible = true;
      setTarget(n, {
        x: p[0],
        y: p[1],
        z: selected ? 0.60 : p[2] + 0.12,
        sx: selected ? 0.88 : 0.70,
        sy: selected ? 0.88 : 0.70,
        sz: selected ? 0.88 : 0.70,
        prominence: selected ? 1.06 : 0.84,
        rotationSpeed: selected ? 0.16 * n.rotationBias : 0.10 * n.rotationBias,
        glow: selected ? 1.14 : 0.72
      });
    });
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateTransforms(dt) {
    const speed = Math.min(1, dt * 6.5);

    state.registry.forEach((n) => {
      const a = n.transform;
      const b = n.target;

      ["x", "y", "z", "sx", "sy", "sz", "prominence", "rotationSpeed", "glow"].forEach((k) => {
        a[k] = lerp(a[k], b[k], speed);
      });

      if (!state.reducedMotion) {
        a.ry += dt * a.rotationSpeed;
        a.rx += dt * a.rotationSpeed * 0.18;
        a.rz += dt * a.rotationSpeed * 0.08;
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
        for (let k = 0; k < 4; k += 1) out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
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
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }

  function rotateY4(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }

  function rotateZ4(a) {
    const c = Math.cos(a), s = Math.sin(a);
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

  function modelMatrix(n) {
    const t = n.transform;
    return multiply4(
      translate4(t.x, t.y, t.z),
      multiply4(rotateZ4(t.rz), multiply4(rotateY4(t.ry), multiply4(rotateX4(t.rx), scale4(t.sx, t.sy, t.sz))))
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

  function semanticElementForNode(n) {
    if (!state.root || !n) return null;
    if (n.type === "mirrorland") return state.root.querySelector("[data-compass-object='mirrorland']");
    if (n.type === "cardinal") return state.root.querySelector("[data-compass-cardinal][data-wing='" + n.wing + "']");
    if (n.type === "petal") return state.root.querySelector("[data-compass-room][data-room-id='" + n.id + "']");
    return null;
  }

  function sceneContains(el) {
    return !!(state.surface && el && state.surface.contains(el));
  }

  function writeSemanticText(n, el) {
    if (!n || !el) return;

    const primary = el.querySelector("span:first-child");
    const secondary = el.querySelector("span:last-child");

    if (n.type === "cardinal") {
      if (primary) primary.textContent = n.label;
      if (secondary) secondary.textContent = n.short || "Tap to inspect";
      el.setAttribute("aria-label", n.label + ": " + (n.short || "Tap to inspect"));
      return;
    }

    if (n.type === "petal") {
      if (primary) primary.textContent = n.label;
      if (secondary) secondary.textContent = n.short || n.coordinate || "Tap to inspect";
      el.setAttribute("aria-label", n.label + ": " + (n.short || n.coordinate || "Tap to inspect"));
      return;
    }

    if (n.type === "mirrorland") {
      if (primary) primary.textContent = "Mirrorland";
      if (secondary) secondary.textContent = "Center fulcrum";
      el.setAttribute("aria-label", "Mirrorland: Center fulcrum");
    }
  }

  function syncSemanticNode(n) {
    const el = semanticElementForNode(n);
    if (!el || !sceneContains(el)) return;

    writeSemanticText(n, el);

    const shouldShow = n.visible && n.transform.prominence >= 0.08;
    const screen = shouldShow ? projectNode(n) : null;

    if (!screen) {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      return;
    }

    const activeFlower = state.flowerExpanded && state.selectedCardinal;
    const isSelectedAnchor = activeFlower && n.type === "cardinal" && n.wing === state.selectedCardinal;
    const isFocusedCardinal = !activeFlower && n.type === "cardinal" && n.wing === (state.orbitFocus || "north");

    const scale =
      n.type === "mirrorland" ? 0.90 :
      isSelectedAnchor ? 0.62 :
      isFocusedCardinal ? 0.94 :
      n.type === "cardinal" ? 0.76 :
      0.80;

    el.style.left = screen.x + "px";
    el.style.top = screen.y + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
    el.style.opacity = String(Math.max(0, Math.min(1, n.transform.prominence)));
    el.style.pointerEvents = n.transform.prominence >= 0.18 ? "auto" : "none";
    el.style.zIndex = n.type === "petal" ? "5" : isSelectedAnchor ? "4" : "3";
  }

  function syncInstructionCopy() {
    if (!state.root) return;

    const panelTitle = state.root.querySelector("[data-compass-panel-title]");
    const panelPurpose = state.root.querySelector("[data-compass-panel-purpose]");
    const panelRelationship = state.root.querySelector("[data-compass-panel-relationship]");
    const note = state.root.querySelector(".compass-accessibility-note");

    if (!state.flowerExpanded && !state.selectedRoom) {
      if (panelTitle && panelTitle.textContent.trim() === "Choose a direction") {
        panelTitle.textContent = "Choose a coordinate";
      }
      if (panelPurpose && /Swipe/i.test(panelPurpose.textContent)) {
        panelPurpose.textContent = "Swipe to rotate the orbit. Tap a star to inspect its path.";
      }
      if (panelRelationship && /Enter/i.test(panelRelationship.textContent)) {
        panelRelationship.textContent = "Enter only after a path is selected.";
      }
    }

    if (note) {
      note.textContent = "Swipe to rotate the orbit. Tap a star to inspect. Use Enter Room only when you are ready to navigate.";
    }
  }

  function syncSemanticObjects() {
    if (!state.surface || !state.root) return;
    state.registry.forEach(syncSemanticNode);
    syncInstructionCopy();
    emitReceipt({ semanticSyncStatus: "active" });
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
    const available = !!api && typeof api.requestAxisSwipe === "function";

    if (!available) {
      emitReceipt({
        lastPointerAction: "controller-axis-api-unavailable",
        gestureType: "swipe",
        gestureDx: gesture ? gesture.dx : 0,
        gestureDy: gesture ? gesture.dy : 0,
        lastSwipeAxis: axis,
        controllerRequest: "",
        controllerApiAvailable: false,
        failureReason: "CONTROLLER_AXIS_API_UNAVAILABLE"
      });
      return;
    }

    api.requestAxisSwipe(axis);

    emitReceipt({
      lastPointerAction: raw || "axis-swipe",
      gestureType: "swipe",
      gestureDx: gesture ? gesture.dx : 0,
      gestureDy: gesture ? gesture.dy : 0,
      lastSwipeAxis: axis,
      controllerRequest: "requestAxisSwipe:" + axis,
      controllerApiAvailable: true,
      failureReason: null
    });
  }

  function requestNodeSelection(nodeHit, gesture) {
    const api = globalThis.DGB_COMPASS_CONTROLLER;

    if (!api || !nodeHit) {
      emitReceipt({
        lastPointerAction: "controller-selection-api-unavailable",
        gestureType: "tap",
        gestureDx: gesture ? gesture.dx : 0,
        gestureDy: gesture ? gesture.dy : 0,
        controllerApiAvailable: false,
        failureReason: "CONTROLLER_SELECTION_API_UNAVAILABLE"
      });
      return;
    }

    let request = "";
    let ok = false;

    if (nodeHit.type === "mirrorland" && typeof api.requestMirrorlandSelection === "function") {
      api.requestMirrorlandSelection();
      request = "requestMirrorlandSelection";
      ok = true;
    }

    if (nodeHit.type === "cardinal" && typeof api.requestCardinalSelection === "function") {
      api.requestCardinalSelection(nodeHit.wing);
      request = "requestCardinalSelection:" + nodeHit.wing;
      ok = true;
    }

    if (nodeHit.type === "petal" && typeof api.requestRoomSelection === "function") {
      api.requestRoomSelection(nodeHit.id);
      request = "requestRoomSelection:" + nodeHit.id;
      ok = true;
    }

    emitReceipt({
      lastPointerAction: ok ? "visual-node-selection-requested" : "controller-selection-api-unavailable",
      gestureType: "tap",
      gestureDx: gesture ? gesture.dx : 0,
      gestureDy: gesture ? gesture.dy : 0,
      selectedVisualNodeId: nodeHit.id,
      selectedVisualNodeType: nodeHit.type,
      selectedVisualNodeWing: nodeHit.wing || "",
      selectedVisualNodeCoordinate: nodeHit.coordinate || "",
      controllerRequest: request,
      controllerApiAvailable: ok,
      failureReason: ok ? null : "CONTROLLER_SELECTION_API_UNAVAILABLE"
    });
  }

  function isSemanticInteractionTarget(target) {
    return !!(
      target &&
      target.closest &&
      target.closest("[data-compass-cardinal], [data-compass-wing], [data-compass-room], [data-compass-object='mirrorland'], [data-compass-return], [data-compass-return-to-orbit], [data-compass-enter], .compass-value-card, a, button")
    );
  }

  function findHit(event) {
    readControllerState();
    updateTargets();
    updateTransforms(0);

    const surface = state.surface || event.currentTarget;
    const rect = surface.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    let best = null;
    let bestDistance = Infinity;
    const hitRadius = Math.max(38, Math.min(68, rect.width * 0.078));

    state.registry.forEach((n) => {
      if (!n.visible || n.transform.prominence < 0.12) return;

      const screen = projectNode(n);
      if (!screen) return;

      const dx = px - screen.x;
      const dy = py - screen.y;
      const d = Math.hypot(dx, dy);

      const localRadius =
        n.type === "mirrorland" || n.type === "cardinal"
          ? hitRadius * 1.14
          : hitRadius * 1.10;

      if (d < bestDistance && d <= localRadius) {
        best = n;
        bestDistance = d;
      }
    });

    return best;
  }

  function handlePointerDown(event) {
    if (state.failHeld) return;

    const pointerCaptured = event.currentTarget && typeof event.currentTarget.setPointerCapture === "function";

    if (pointerCaptured) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (_) {}
    }

    state.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      semanticStart: isSemanticInteractionTarget(event.target),
      pointerCaptured,
      time: performance.now()
    };

    emitReceipt({
      lastPointerAction: "pointer-down",
      gestureType: "pending",
      gestureDx: 0,
      gestureDy: 0,
      pointerCaptured,
      controllerRequest: "",
      controllerApiAvailable: !!globalThis.DGB_COMPASS_CONTROLLER,
      failureReason: null
    });
  }

  function handlePointerMove(event) {
    if (state.failHeld || !state.pointer || event.pointerId !== state.pointer.id) return;

    const dx = event.clientX - state.pointer.x;
    const dy = event.clientY - state.pointer.y;

    if (Math.hypot(dx, dy) >= GESTURE.minimumSwipeDistancePx) {
      event.preventDefault();
      emitReceipt({
        lastPointerAction: "pointer-move-threshold-crossed",
        gestureType: "swipe-pending",
        gestureDx: dx,
        gestureDy: dy,
        pointerCaptured: state.pointer.pointerCaptured,
        failureReason: null
      });
    }
  }

  function handlePointerUp(event) {
    if (state.failHeld || !state.pointer) return;

    if (event.pointerId !== state.pointer.id) {
      state.pointer = null;
      emitReceipt({ lastPointerAction: "pointer-id-mismatch", gestureType: "cancelled" });
      return;
    }

    const pointer = state.pointer;
    const gesture = classifyGesture(pointer, { x: event.clientX, y: event.clientY });
    state.pointer = null;

    if (gesture.type === "swipe") {
      event.preventDefault();
      requestAxisSwipe(gesture.axis, gesture.raw, gesture);
      return;
    }

    if (gesture.type === "ambiguous") {
      emitReceipt({
        lastPointerAction: "ambiguous-gesture-no-action",
        gestureType: "ambiguous",
        gestureDx: gesture.dx,
        gestureDy: gesture.dy,
        lastSwipeAxis: "",
        controllerRequest: "",
        failureReason: null
      });
      return;
    }

    if (pointer.semanticStart || isSemanticInteractionTarget(event.target)) {
      emitReceipt({
        lastPointerAction: "semantic-tap-deferred-to-dom",
        gestureType: "tap",
        gestureDx: gesture.dx,
        gestureDy: gesture.dy,
        controllerRequest: "",
        controllerApiAvailable: !!globalThis.DGB_COMPASS_CONTROLLER,
        failureReason: null
      });
      return;
    }

    const hit = findHit(event);

    if (!hit) {
      emitReceipt({
        lastPointerAction: "tap-no-hit",
        gestureType: "tap",
        gestureDx: gesture.dx,
        gestureDy: gesture.dy,
        selectedVisualNodeId: "",
        selectedVisualNodeType: "",
        selectedVisualNodeWing: "",
        selectedVisualNodeCoordinate: "",
        controllerRequest: "",
        controllerApiAvailable: !!globalThis.DGB_COMPASS_CONTROLLER,
        failureReason: null
      });
      return;
    }

    requestNodeSelection(hit, gesture);
  }

  function handlePointerCancel() {
    state.pointer = null;
    emitReceipt({ lastPointerAction: "pointer-cancelled", gestureType: "cancelled", failureReason: null });
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

  function drawNode(n) {
    if (!n.visible && n.transform.prominence < 0.03) return;

    const gl = state.gl;
    const mesh = state.meshes.get(n.meshKey);
    if (!mesh) return;

    bindAttrib(gl, mesh.position, state.attribs.position, 3);
    bindAttrib(gl, mesh.normal, state.attribs.normal, 3);
    bindAttrib(gl, mesh.color, state.attribs.color, 3);

    const model = modelMatrix(n);
    const glow = Math.max(0, n.transform.glow || 0);

    gl.uniformMatrix4fv(state.uniforms.model, false, new Float32Array(model));
    gl.uniformMatrix4fv(state.uniforms.view, false, new Float32Array(state.view));
    gl.uniformMatrix4fv(state.uniforms.projection, false, new Float32Array(state.projection));
    gl.uniformMatrix3fv(state.uniforms.normalMatrix, false, new Float32Array(normalMatrix3(model)));
    gl.uniform1f(state.uniforms.prominence, Math.max(0, n.transform.prominence));
    gl.uniform1f(state.uniforms.glowStrength, glow);
    gl.uniform3f(state.uniforms.glowColor, n.glowColor[0], n.glowColor[1], n.glowColor[2]);

    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
  }

  function render(now) {
    if (!state.running || state.failHeld) return;

    const t = now * 0.001;
    const dt = state.lastTime ? Math.min(0.05, t - state.lastTime) : 0.016;
    state.lastTime = t;

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

    state.view = lookAt4([0, 0.70, cameraZ], [0, 0, 0], [0, 1, 0]);
    state.projection = perspective4(Math.PI / 4.8, aspect, 0.1, 40);

    syncSemanticObjects();

    gl.useProgram(state.program);
    gl.uniform3f(state.uniforms.keyLightDirection, -0.4, -0.8, -0.7);
    gl.uniform3f(state.uniforms.fillLightDirection, 0.7, -0.35, -0.55);
    gl.uniform3f(state.uniforms.rimLightDirection, 0.1, 0.4, 1.0);
    gl.uniform1f(state.uniforms.ambientStrength, 0.26);

    let visible = 0;

    state.registry.forEach((n) => {
      if (n.visible && n.transform.prominence > 0.04) visible += 1;
      drawNode(n);
    });

    emitReceipt({
      visibleObjectCount: visible,
      renderLoopStatus: state.reducedMotion ? "active-reduced-motion" : "active",
      failureReason: null
    });

    state.raf = requestAnimationFrame(render);
  }

  function bindPointerBridge() {
    state.surface = findGestureSurface(state.root, state.canvas);

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
        glowStrength: gl.getUniformLocation(state.program, "uGlowStrength"),
        glowColor: gl.getUniformLocation(state.program, "uGlowColor"),
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
