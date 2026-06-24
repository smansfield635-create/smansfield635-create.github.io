/* /assets/compass/compass.crystals.js
   DGB Compass — Orbit Flower Traversal WebGL visualization layer.
   Scope: compass.crystals.js only.
   Owns visualization, gesture detection, hit detection, and controller selection requests.
   Does not own routes, route validation, navigation execution, labels, panel copy, CSS, or visual-pass claims.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_ORBIT_FLOWER_TRAVERSAL_CRYSTALS_TNT_v1",
    file: "/assets/compass/compass.crystals.js",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false,
    fifthFileAuthorized: false
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

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

  const WING_THEMES = Object.freeze({
    north: { color: [0.68, 0.86, 1.0], rx: 0.42, rz: 0.30, h: 0.84, elongation: 1.22, irregularity: 0.018, rotationBias: 0.95 },
    east: { color: [0.48, 0.94, 0.86], rx: 0.44, rz: 0.31, h: 0.82, elongation: 1.18, irregularity: 0.026, rotationBias: 1.05 },
    south: { color: [0.98, 0.76, 0.42], rx: 0.43, rz: 0.30, h: 0.80, elongation: 1.14, irregularity: 0.014, rotationBias: 0.88 },
    west: { color: [0.88, 0.62, 0.50], rx: 0.45, rz: 0.31, h: 0.82, elongation: 1.24, irregularity: 0.038, rotationBias: 1.12 }
  });

  const GESTURE = Object.freeze({
    minimumSwipeDistancePx: 42,
    maximumTapDistancePx: 12,
    directionalDominanceRatio: 1.25
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
    orbitFocusObserved: "",
    selectedCardinalObserved: "",
    selectedRoomObserved: "",
    flowerExpandedObserved: false,
    renderLoopStatus: "pending",
    lastPointerAction: "none",
    lastSwipeAxis: "",
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
      float alpha = clamp(0.26 + vProminence * 0.74, 0.16, 1.0);
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
      rx: 0.66,
      rz: 0.48,
      h: 1.02,
      crown: true,
      color: [0.72, 0.94, 1.0],
      irregularity: 0.012,
      warmth: 0.08,
      elongation: 1.03
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
        segments: 6,
        rx: 0.27,
        rz: 0.20,
        h: 0.46,
        crown: false,
        color: theme.color,
        irregularity: theme.irregularity * 0.55,
        warmth: wing === "south" || wing === "west" ? 0.12 : 0.04,
        elongation: 1.08
      })));
    });

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
      wing: opts.wing || "",
      roomIndex: opts.roomIndex || 0,
      coordinate: opts.coordinate || "",
      meshKey: opts.meshKey || type,
      rotationBias: opts.rotationBias || 1,
      visible: true,
      transform: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, prominence: 1, rotationSpeed: 0.25 },
      target: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, prominence: 1, rotationSpeed: 0.25 }
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

      registry.set(wing, node(wing, "cardinal", {
        label: wing.charAt(0).toUpperCase() + wing.slice(1),
        wing,
        meshKey: "wing-" + wing,
        rotationBias: theme.rotationBias
      }));

      const rooms = DEFAULT_ROOMS[wing];
      rooms.forEach((room, index) => {
        registry.set(room.id, node(room.id, "petal", {
          label: room.label,
          wing,
          roomIndex: index,
          coordinate: coordinateFor(index, rooms.length),
          meshKey: "room-" + wing,
          rotationBias: 0.82 + index * 0.035
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

    emitReceipt({
      currentModeObserved: state.mode,
      orbitFocusObserved: state.orbitFocus,
      selectedCardinalObserved: state.selectedCardinal,
      selectedRoomObserved: state.selectedRoom,
      flowerExpandedObserved: state.flowerExpanded
    });
  }

  function isSemanticInteractionTarget(target) {
    return !!(
      target &&
      target.closest &&
      target.closest(
        "[data-compass-cardinal], [data-compass-wing], [data-compass-room], [data-compass-object='mirrorland'], [data-compass-return], [data-compass-return-to-orbit], [data-compass-enter], .compass-value-card, a, button"
      )
    );
  }

  function wingPosition(wing) {
    switch (wing) {
      case "north": return [0, 1.42, -0.12];
      case "east": return [1.82, 0, -0.12];
      case "south": return [0, -1.42, -0.12];
      case "west": return [-1.82, 0, -0.12];
      default: return [0, 0, 0];
    }
  }

  function inactiveWingPosition(wing) {
    switch (wing) {
      case "north": return [0, 1.82, -0.98];
      case "east": return [2.22, 0, -0.98];
      case "south": return [0, -1.82, -0.98];
      case "west": return [-2.22, 0, -0.98];
      default: return [0, 0, -0.98];
    }
  }

  function roomPetalPosition(index, count) {
    const map5 = [
      [0, 0.88, 0.08],
      [0.76, 0.42, 0.04],
      [0.94, -0.14, 0.00],
      [0.48, -0.76, 0.04],
      [0, 0, 0.20]
    ];

    const map4 = [
      [-0.68, 0.52, 0.04],
      [0.68, 0.52, 0.04],
      [-0.68, -0.52, 0.04],
      [0.68, -0.52, 0.04]
    ];

    if (count === 5) return map5[index] || [0, 0, 0];
    if (count === 4) return map4[index] || [0, 0, 0];

    const angle = (Math.PI * 2 * index) / Math.max(count, 1) - Math.PI / 2;
    return [Math.cos(angle) * 0.86, Math.sin(angle) * 0.58, 0.04];
  }

  function rotatePointForWing(point, wing) {
    const x = point[0];
    const y = point[1];
    const z = point[2];

    switch (wing) {
      case "north": return [x, y + 0.38, z];
      case "east": return [y + 0.38, -x, z];
      case "south": return [-x, -y - 0.38, z];
      case "west": return [-y - 0.38, x, z];
      default: return [x, y, z];
    }
  }

  function setTarget(n, t) {
    Object.assign(n.target, t);
  }

  function updateTargets() {
    const focus = state.orbitFocus || "north";
    const activeFlower = state.flowerExpanded && state.selectedCardinal;
    const selectedRooms = DEFAULT_ROOMS[state.selectedCardinal || focus] || [];
    const selectedRoomId = state.selectedRoom;

    state.registry.forEach((n) => {
      n.visible = false;
      setTarget(n, { x: 0, y: 0, z: 0, sx: 1, sy: 1, sz: 1, prominence: 0, rotationSpeed: 0.10 });
    });

    const mirrorland = state.registry.get("mirrorland");
    mirrorland.visible = true;

    if (!activeFlower) {
      setTarget(mirrorland, {
        x: 0, y: 0, z: 0.04,
        sx: state.mode === "DESTINATION_MODE" ? 1.02 : 1.14,
        sy: state.mode === "DESTINATION_MODE" ? 1.02 : 1.14,
        sz: state.mode === "DESTINATION_MODE" ? 1.02 : 1.14,
        prominence: 0.94,
        rotationSpeed: 0.12
      });

      WINGS.forEach((wing) => {
        const n = state.registry.get(wing);
        const p = wingPosition(wing);
        const focused = wing === focus;

        n.visible = true;
        setTarget(n, {
          x: p[0], y: p[1], z: focused ? 0.12 : p[2],
          sx: focused ? 1.16 : 0.88,
          sy: focused ? 1.42 : 1.12,
          sz: focused ? 1.16 : 0.88,
          prominence: focused ? 1.02 : 0.72,
          rotationSpeed: focused ? 0.17 * n.rotationBias : 0.12 * n.rotationBias
        });
      });

      return;
    }

    setTarget(mirrorland, {
      x: 0, y: 0, z: -0.30,
      sx: 0.62, sy: 0.62, sz: 0.62,
      prominence: 0.30,
      rotationSpeed: 0.05
    });

    WINGS.forEach((wing) => {
      const n = state.registry.get(wing);

      if (wing === state.selectedCardinal) {
        n.visible = true;
        setTarget(n, {
          x: 0, y: 0, z: 0.16,
          sx: 1.22,
          sy: 1.52,
          sz: 1.22,
          prominence: 1.06,
          rotationSpeed: 0.14 * n.rotationBias
        });
        return;
      }

      const p = inactiveWingPosition(wing);
      n.visible = true;
      setTarget(n, {
        x: p[0], y: p[1], z: p[2],
        sx: 0.40, sy: 0.52, sz: 0.40,
        prominence: 0.18,
        rotationSpeed: 0.04 * n.rotationBias
      });
    });

    selectedRooms.forEach((room, index) => {
      const n = state.registry.get(room.id);
      const base = roomPetalPosition(index, selectedRooms.length);
      const p = rotatePointForWing(base, state.selectedCardinal);
      const selected = selectedRoomId === room.id;

      n.visible = true;
      setTarget(n, {
        x: p[0],
        y: p[1],
        z: selected ? 0.52 : p[2] + 0.10,
        sx: selected ? 0.82 : 0.62,
        sy: selected ? 0.82 : 0.62,
        sz: selected ? 0.82 : 0.62,
        prominence: selected ? 1.0 : 0.76,
        rotationSpeed: selected ? 0.16 * n.rotationBias : 0.10 * n.rotationBias
      });
    });
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

  function classifyGesture(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const distance = Math.hypot(dx, dy);

    if (distance <= GESTURE.maximumTapDistancePx) return { type: "tap" };
    if (distance < GESTURE.minimumSwipeDistancePx) return { type: "ambiguous" };

    if (absX > absY * GESTURE.directionalDominanceRatio) {
      return { type: "swipe", axis: "horizontal", raw: dx > 0 ? "swipeRight" : "swipeLeft" };
    }

    if (absY > absX * GESTURE.directionalDominanceRatio) {
      return { type: "swipe", axis: "vertical", raw: dy > 0 ? "swipeDown" : "swipeUp" };
    }

    return { type: "ambiguous" };
  }

  function requestAxisSwipe(axis, raw) {
    const api = globalThis.DGB_COMPASS_CONTROLLER;
    const available = !!api && typeof api.requestAxisSwipe === "function";

    if (!available) {
      emitReceipt({
        lastPointerAction: "controller-axis-api-unavailable",
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
      lastSwipeAxis: axis,
      controllerRequest: "requestAxisSwipe:" + axis,
      controllerApiAvailable: true,
      failureReason: null
    });
  }

  function requestNodeSelection(nodeHit) {
    const api = globalThis.DGB_COMPASS_CONTROLLER;
    if (!api || !nodeHit) return;

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
      selectedVisualNodeId: nodeHit.id,
      selectedVisualNodeType: nodeHit.type,
      selectedVisualNodeWing: nodeHit.wing || "",
      selectedVisualNodeCoordinate: nodeHit.coordinate || "",
      controllerRequest: request,
      controllerApiAvailable: ok,
      failureReason: ok ? null : "CONTROLLER_SELECTION_API_UNAVAILABLE"
    });
  }

  function findHit(event) {
    readControllerState();
    updateTargets();
    updateTransforms(0);

    const surface = event.currentTarget;
    const rect = surface.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    let best = null;
    let bestDistance = Infinity;
    const hitRadius = Math.max(34, Math.min(62, rect.width * 0.07));

    state.registry.forEach((n) => {
      if (!n.visible || n.transform.prominence < 0.14) return;

      const screen = projectNode(n);
      if (!screen) return;

      const dx = px - screen.x;
      const dy = py - screen.y;
      const d = Math.hypot(dx, dy);

      const localRadius = n.type === "mirrorland" || n.type === "cardinal"
        ? hitRadius * 1.18
        : hitRadius;

      if (d < bestDistance && d <= localRadius) {
        best = n;
        bestDistance = d;
      }
    });

    return best;
  }

  function handlePointerDown(event) {
    if (state.failHeld) return;

    if (isSemanticInteractionTarget(event.target)) {
      state.pointer = null;
      emitReceipt({
        lastPointerAction: "semantic-control-ignored",
        controllerRequest: "",
        controllerApiAvailable: !!globalThis.DGB_COMPASS_CONTROLLER,
        failureReason: null
      });
      return;
    }

    state.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now()
    };

    emitReceipt({
      lastPointerAction: "pointer-down",
      controllerRequest: "",
      controllerApiAvailable: !!globalThis.DGB_COMPASS_CONTROLLER,
      failureReason: null
    });
  }

  function handlePointerUp(event) {
    if (state.failHeld || !state.pointer) return;

    if (event.pointerId !== state.pointer.id) {
      state.pointer = null;
      emitReceipt({ lastPointerAction: "pointer-id-mismatch" });
      return;
    }

    if (isSemanticInteractionTarget(event.target)) {
      state.pointer = null;
      emitReceipt({
        lastPointerAction: "semantic-control-ignored",
        controllerRequest: "",
        controllerApiAvailable: !!globalThis.DGB_COMPASS_CONTROLLER,
        failureReason: null
      });
      return;
    }

    const gesture = classifyGesture(state.pointer, { x: event.clientX, y: event.clientY });
    state.pointer = null;

    if (gesture.type === "swipe") {
      requestAxisSwipe(gesture.axis, gesture.raw);
      return;
    }

    if (gesture.type === "ambiguous") {
      emitReceipt({
        lastPointerAction: "ambiguous-gesture-no-action",
        lastSwipeAxis: "",
        controllerRequest: "",
        failureReason: null
      });
      return;
    }

    const hit = findHit(event);

    if (!hit) {
      emitReceipt({
        lastPointerAction: "tap-no-hit",
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

    requestNodeSelection(hit);
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
    const cameraZ = aspect < 0.8 ? 7.9 : 6.3;
    const view = lookAt4([0, 0.72, cameraZ], [0, 0, 0], [0, 1, 0]);
    const projection = perspective4(Math.PI / 4.6, aspect, 0.1, 40);

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
    const surface =
      state.canvas.closest(".compass-scene") ||
      state.canvas.parentElement ||
      state.root;

    surface.addEventListener("pointerdown", handlePointerDown);
    surface.addEventListener("pointerup", handlePointerUp);
    surface.addEventListener("pointercancel", () => {
      state.pointer = null;
      emitReceipt({ lastPointerAction: "pointer-cancelled", failureReason: null });
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
