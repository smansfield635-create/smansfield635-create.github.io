/* /assets/compass/compass.crystals.js
   DGB Compass — Celestial atmosphere and state-guidance renewal.
   Scope: compass.crystals.js only.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_CRYSTALS_CELESTIAL_ATMOSPHERE_GUIDANCE_TNT_v1",
    file: "/assets/compass/compass.crystals.js",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false,
    createMirrorlandMeshAuthorized: false
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

  const MODES = Object.freeze({
    COMPASS: "COMPASS_MODE",
    ORBIT: "ORBIT_MODE",
    DESTINATION: "DESTINATION_MODE"
  });

  const DIAGNOSTIC_MODES = Object.freeze({
    NONE: "NONE",
    OPAQUE_UNLIT: "OPAQUE_UNLIT",
    NORMALS: "NORMAL_VISUALIZATION",
    FACET_ONLY: "FACET_LIGHTING_ONLY",
    HALO_DISABLED: "HALO_DISABLED",
    MIRRORLAND_ONLY: "MIRRORLAND_ISOLATION",
    CARDINAL_ONLY: "CARDINAL_ISOLATION",
    ROOM_ONLY: "ROOM_ISOLATION"
  });

  const BACKGROUND = Object.freeze({
    enabled: true,
    starCount: 90,
    twinkle: true,
    shootingStars: true,
    shootingStarIntervalMs: 7000,
    shootingStarVarianceMs: 2200
  });

  const INSTRUCTION_COPY = Object.freeze({
    orbit:
      "Swipe to rotate the orbit. Tap an axis to inspect and unfold its petals.",
    flower:
      "Swipe to return to the compass orbit. Tap a petal to inspect its path. Enter Room opens the selected destination."
  });

  const STAR_PALETTE = Object.freeze({
    mirror: [0.82, 0.94, 1.0],
    north: [0.72, 0.88, 1.0],
    east: [0.56, 0.92, 1.0],
    south: [1.0, 0.82, 0.48],
    west: [0.96, 0.68, 0.46],
    roomNorth: [0.66, 0.84, 1.0],
    roomEast: [0.55, 0.90, 0.96],
    roomSouth: [1.0, 0.76, 0.42],
    roomWest: [0.94, 0.62, 0.42],
    background: [0.70, 0.84, 1.0],
    shooting: [0.86, 0.94, 1.0]
  });

  const MATERIALS = Object.freeze({
    BACKGROUND_STAR: Object.freeze({
      specular: 0.00,
      rim: 0.00,
      emissive: 0.26,
      alpha: 0.42,
      sparkle: 0.08,
      halo: 0.00,
      contrast: 1.00
    }),
    SHOOTING_STAR: Object.freeze({
      specular: 0.00,
      rim: 0.18,
      emissive: 0.42,
      alpha: 0.48,
      sparkle: 0.12,
      halo: 0.00,
      contrast: 1.00
    }),
    MIRRORLAND_HERO: Object.freeze({
      specular: 1.50,
      rim: 1.20,
      emissive: 0.28,
      alpha: 0.95,
      sparkle: 0.34,
      halo: 1.05,
      contrast: 1.16
    }),
    CARDINAL_IDLE: Object.freeze({
      specular: 1.18,
      rim: 1.02,
      emissive: 0.17,
      alpha: 0.90,
      sparkle: 0.26,
      halo: 0.82,
      contrast: 1.16
    }),
    CARDINAL_FOCUSED: Object.freeze({
      specular: 1.50,
      rim: 1.30,
      emissive: 0.24,
      alpha: 0.96,
      sparkle: 0.36,
      halo: 1.18,
      contrast: 1.24
    }),
    CARDINAL_SELECTED: Object.freeze({
      specular: 1.62,
      rim: 1.38,
      emissive: 0.28,
      alpha: 0.97,
      sparkle: 0.42,
      halo: 1.25,
      contrast: 1.28
    }),
    ROOM_IDLE: Object.freeze({
      specular: 1.04,
      rim: 0.90,
      emissive: 0.15,
      alpha: 0.88,
      sparkle: 0.22,
      halo: 0.64,
      contrast: 1.10
    }),
    ROOM_SELECTED: Object.freeze({
      specular: 1.34,
      rim: 1.14,
      emissive: 0.24,
      alpha: 0.95,
      sparkle: 0.34,
      halo: 0.96,
      contrast: 1.20
    })
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

  const QUALITY = Object.freeze({
    devicePixelRatioCap: 2,
    cardinalSegments: 8,
    roomSegments: 6,
    mirrorlandDefaultScale: 0,
    mirrorlandHeroScale: 2.35,
    cardinalScale: 1.05,
    focusedCardinalScale: 1.28,
    selectedCardinalScale: 1.38,
    roomScale: 0.92,
    selectedRoomScale: 1.14,
    maxYaw: 0.22,
    maxPitch: 0.14
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    rendererInitialized: false,
    shaderProgramsLinked: false,
    MirrorlandMeshLoaded: false,
    MirrorlandDrawn: false,
    MirrorlandRemovedFromEntranceConstellation: true,
    centerReservedAndOpen: true,
    backgroundStarsEnabled: BACKGROUND.enabled,
    backgroundStarCount: BACKGROUND.starCount,
    backgroundStarsInitialized: false,
    backgroundTwinkleEnabled: BACKGROUND.twinkle,
    shootingStarsEnabled: BACKGROUND.shootingStars,
    shootingStarIntervalMs: BACKGROUND.shootingStarIntervalMs,
    shootingStarActive: false,
    backgroundDrawCallsLastFrame: 0,
    reducedMotionBackgroundSuppressed: false,
    instructionState: "orbit",
    instructionCopy: INSTRUCTION_COPY.orbit,
    cardinalMeshCount: 0,
    roomMeshCount: 0,
    drawCallsLastFrame: 0,
    cameraOrientation: "pending",
    activeMode: "pending",
    activeDestination: "",
    diagnosticModeAvailable: true,
    diagnosticMode: DIAGNOSTIC_MODES.NONE,
    glError: "not-checked",
    rootStatus: "pending",
    sceneStatus: "pending",
    mountStatus: "pending",
    canvasStatus: "pending",
    webglContextStatus: "pending",
    shaderStatus: "pending",
    programStatus: "pending",
    meshBuildStatus: "pending",
    registryBuildStatus: "pending",
    renderLoopStatus: "pending",
    topAuthorityCardinal: "north",
    cardinalScale: QUALITY.cardinalScale,
    focusedCardinalScale: QUALITY.focusedCardinalScale,
    selectedCardinalScale: QUALITY.selectedCardinalScale,
    roomScale: QUALITY.roomScale,
    selectedRoomScale: QUALITY.selectedRoomScale,
    rotationModel: "BOUNDED_YAW_PITCH_WITH_DOMINANT_RZ",
    failureReason: null,
    remainingVisualDefects: [],
    visualPassClaimed: false
  };

  const ADAPTER_RECEIPT = {
    adapterIdentity: "DGB_MIRRORLAND_OBJECT_TO_GPU_RESOURCE_ADAPTER_v1",
    meshAvailable: false,
    objectIdentity: "",
    objectResult: "",
    validationResult: "",
    vertexCount: 0,
    triangleCount: 0,
    indexType: "",
    sourceGeometryMutated: false,
    geometryRegenerated: false,
    fallbackGenerated: false,
    result: "pending",
    failureReason: null
  };

  const state = {
    root: null,
    scene: null,
    mount: null,
    canvas: null,
    surface: null,
    gl: null,
    uintExtension: null,
    program: null,
    attribs: null,
    uniforms: null,
    meshes: new Map(),
    registry: new Map(),
    mode: MODES.COMPASS,
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    selectedDestinationType: "",
    flowerExpanded: false,
    reducedMotion: false,
    diagnosticMode: DIAGNOSTIC_MODES.NONE,
    orbitAngle: 0,
    targetOrbitAngle: 0,
    width: 1,
    height: 1,
    pixelRatio: 1,
    time: 0,
    lastTime: 0,
    raf: 0,
    running: false,
    pointer: null,
    view: null,
    projection: null,
    camera: {
      eye: [0, 0.78, 6.7],
      target: [0, 0, 0],
      nextEye: [0, 0.78, 6.7],
      nextTarget: [0, 0, 0]
    },
    shootingStar: {
      active: false,
      startMs: 0,
      durationMs: 1700,
      nextMs: 0,
      seed: 0
    }
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

  function emitFailure(stage, reason, extra = {}) {
    emitReceipt({
      ...extra,
      initializationStage: stage,
      failureReason: reason,
      renderLoopStatus: state.running ? RECEIPT.renderLoopStatus : "held"
    });
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CRYSTALS = Object.freeze({
      contract: CONTRACT,
      receipt: () => Object.freeze({ ...RECEIPT }),
      mirrorlandAdapterReceipt: () => Object.freeze({ ...ADAPTER_RECEIPT }),

      setDiagnosticMode: (mode) => {
        const requested = String(mode || DIAGNOSTIC_MODES.NONE);
        state.diagnosticMode = Object.values(DIAGNOSTIC_MODES).includes(requested)
          ? requested
          : DIAGNOSTIC_MODES.NONE;
        emitReceipt({
          diagnosticMode: state.diagnosticMode,
          diagnosticModeAvailable: true
        });
      },

      requestAxisSwipe: (axis) => {
        const api = globalThis.DGB_COMPASS_CONTROLLER;
        if (api && typeof api.requestAxisSwipe === "function") {
          api.requestAxisSwipe(axis);
          return true;
        }
        emitReceipt({ failureReason: "CONTROLLER_AXIS_API_UNAVAILABLE" });
        return false;
      },

      requestDirectionSelection: (direction) => {
        const api = globalThis.DGB_COMPASS_CONTROLLER;
        if (api && typeof api.requestDirectionSelection === "function") {
          api.requestDirectionSelection(direction);
          return true;
        }
        emitReceipt({ failureReason: "CONTROLLER_DIRECTION_API_UNAVAILABLE" });
        return false;
      },

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
      },

      dispose: disposeResources
    });
  }

  function qs(selectors, root = document) {
    for (const selector of selectors) {
      const el = root.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function seeded(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
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
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    void main() {
      vec3 pos = aPosition;

      if (uHaloPass > 0.5) {
        pos += normalize(aNormal) * uHaloExpansion;
      }

      vec4 world = uModel * vec4(pos, 1.0);
      vec4 view = uView * world;

      vNormal = normalize(uNormalMatrix * aNormal);
      vColor = aColor;
      vViewPosition = view.xyz;
      vWorldPosition = world.xyz;
      vHaloPass = uHaloPass;

      gl_Position = uProjection * view;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    uniform float uTime;
    uniform float uDiagnosticMode;
    uniform float uProminence;
    uniform float uSpecular;
    uniform float uRim;
    uniform float uEmissive;
    uniform float uAlpha;
    uniform float uSparkle;
    uniform float uTwinkle;
    uniform float uContrast;
    uniform float uHaloStrength;

    uniform vec3 uKeyLight;
    uniform vec3 uFillLight;
    uniform vec3 uRimLight;
    uniform vec3 uAmbientColor;

    float hash31(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    }

    void main() {
      vec3 n = normalize(vNormal);
      vec3 viewDir = normalize(-vViewPosition);
      vec3 base = max(vColor, vec3(0.02));

      if (uDiagnosticMode > 1.5 && uDiagnosticMode < 2.5) {
        gl_FragColor = vec4(n * 0.5 + 0.5, 1.0);
        return;
      }

      if (uDiagnosticMode > 0.5 && uDiagnosticMode < 1.5) {
        gl_FragColor = vec4(base, 1.0);
        return;
      }

      float facingToCamera = dot(n, viewDir);
      float rearSuppression = smoothstep(-0.18, 0.34, facingToCamera);
      float sideRim = pow(1.0 - abs(facingToCamera), 2.4);

      float key = max(dot(n, normalize(-uKeyLight)), 0.0);
      float fill = max(dot(n, normalize(-uFillLight)), 0.0);
      float rear = max(dot(n, normalize(-uRimLight)), 0.0);
      float fresnel = pow(1.0 - max(facingToCamera, 0.0), 2.05);
      float facing = pow(max(dot(reflect(normalize(uKeyLight), n), viewDir), 0.0), 28.0);

      float facetBand = pow(abs(dot(n, normalize(vec3(0.45, 0.72, 0.53)))), 5.0);
      float sparkleSeed = hash31(floor((n + vWorldPosition) * 18.0));
      float sparklePhase = sin(uTime * 1.85 + sparkleSeed * 6.28318);
      float sparkle = smoothstep(0.74, 1.0, facing + facetBand * 0.34) *
        (0.76 + sparklePhase * 0.24) *
        uSparkle *
        rearSuppression;

      float twinkle = 1.0 + sin(uTime * 0.70 + sparkleSeed * 6.28318) * 0.045 * uTwinkle;

      if (vHaloPass > 0.5) {
        vec3 haloColor = base * (0.70 + fresnel * 1.18 + sideRim * 0.42 + rear * 0.24) * uHaloStrength * twinkle;
        float haloAlpha = clamp((0.040 + fresnel * 0.18 + sideRim * 0.08) * uProminence * uHaloStrength, 0.0, 0.34);
        gl_FragColor = vec4(haloColor, haloAlpha);
        return;
      }

      float diffuse = 0.24 + key * 0.82 + fill * 0.30 + rear * 0.14;
      diffuse = mix(diffuse, pow(diffuse, 0.68), clamp(uContrast - 1.0, 0.0, 0.7));

      vec3 lit = base * diffuse * twinkle;
      vec3 spec = vec3(1.0, 0.96, 0.82) * facing * uSpecular * rearSuppression;
      vec3 rim = base * (fresnel * 0.72 + sideRim * 0.38) * uRim;
      vec3 coolRim = vec3(0.68, 0.86, 1.0) * (fresnel * 0.22 + sideRim * 0.14) * uRim;
      vec3 emissive = base * uEmissive;
      vec3 spark = vec3(1.0, 0.96, 0.78) * sparkle;

      float rearDim = mix(0.62, 1.0, rearSuppression);
      vec3 color = ((lit + spec + rim + coolRim + emissive + spark) * uProminence + uAmbientColor * base * 0.20) * rearDim;

      float alpha = clamp(uAlpha * (0.70 + uProminence * 0.30 + fresnel * 0.08), 0.12, 1.0);
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
    const len = Math.hypot(a[0], a[1], a[2]);
    if (!Number.isFinite(len) || len <= 1e-14) return [0, 0, 1];
    return [a[0] / len, a[1] / len, a[2] / len];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function createBuffer(gl, target, data, usage = gl.STATIC_DRAW) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);
    return buffer;
  }

  function buildGpuMesh(gl, mesh) {
    const gpu = {
      vertexCount: mesh.vertexCount,
      triangleCount: mesh.triangleCount,
      position: createBuffer(gl, gl.ARRAY_BUFFER, mesh.positions),
      normal: createBuffer(gl, gl.ARRAY_BUFFER, mesh.normals),
      color: createBuffer(gl, gl.ARRAY_BUFFER, mesh.colors),
      indexed: !!mesh.indices,
      index: null,
      indexType: null,
      indexCount: 0,
      isMirrorland: mesh.isMirrorland === true,
      isBackground: mesh.isBackground === true
    };

    if (mesh.indices) {
      gpu.indexCount = mesh.indices.length;
      gpu.indexType = mesh.indexType;
      gpu.index = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
    }

    return Object.freeze(gpu);
  }

  function createQuadMeshFromRects(rects, color) {
    const positions = [];
    const normals = [];
    const colors = [];

    rects.forEach((r) => {
      const x = r.x;
      const y = r.y;
      const z = r.z;
      const w = r.w;
      const h = r.h;
      const c = r.color || color;
      const points = [
        [x - w, y - h, z],
        [x + w, y - h, z],
        [x + w, y + h, z],
        [x - w, y - h, z],
        [x + w, y + h, z],
        [x - w, y + h, z]
      ];

      points.forEach((p) => {
        positions.push(p[0], p[1], p[2]);
        normals.push(0, 0, 1);
        colors.push(c[0], c[1], c[2]);
      });
    });

    return Object.freeze({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      vertexCount: positions.length / 3,
      triangleCount: positions.length / 9,
      isBackground: true
    });
  }

  function createBackgroundStarsMesh() {
    const rects = [];

    for (let i = 0; i < BACKGROUND.starCount; i += 1) {
      const rx = seeded(i + 11);
      const ry = seeded(i + 23);
      const rz = seeded(i + 37);
      const rs = seeded(i + 41);
      const rc = seeded(i + 53);

      const clearCenter =
        Math.abs(rx - 0.5) < 0.19 &&
        Math.abs(ry - 0.5) < 0.18;

      const x = (rx - 0.5) * (clearCenter ? 9.2 : 8.2);
      const y = (ry - 0.5) * (clearCenter ? 6.2 : 5.7);
      const z = -7.6 - rz * 2.2;
      const size = 0.006 + rs * 0.020;
      const lift = 0.38 + rc * 0.34;

      rects.push({
        x,
        y,
        z,
        w: size,
        h: size,
        color: [
          STAR_PALETTE.background[0] * lift,
          STAR_PALETTE.background[1] * lift,
          STAR_PALETTE.background[2] * lift
        ]
      });
    }

    return createQuadMeshFromRects(rects, STAR_PALETTE.background);
  }

  function createShootingStarMesh() {
    const rects = [];
    const segments = 7;

    for (let i = 0; i < segments; i += 1) {
      const t = i / Math.max(1, segments - 1);
      const alphaLift = 1.0 - t * 0.72;
      rects.push({
        x: t * 0.42,
        y: -t * 0.18,
        z: -7.0,
        w: 0.075 * (1.0 - t * 0.70),
        h: 0.010,
        color: [
          STAR_PALETTE.shooting[0] * alphaLift,
          STAR_PALETTE.shooting[1] * alphaLift,
          STAR_PALETTE.shooting[2] * alphaLift
        ]
      });
    }

    return createQuadMeshFromRects(rects, STAR_PALETTE.shooting);
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

  function adaptMirrorlandObjectToGpuMesh(gl) {
    const object = resolveMirrorlandObject();
    const source = object.generatedGeometry || object;
    const positions = source.positions || object.positions;
    const normals = source.normals || object.normals;
    const rawIndices = source.triangleIndices || source.indices || object.triangleIndices || object.indices;

    if (!positions || !normals || !rawIndices) {
      throw new Error("MIRRORLAND_APPROVED_ARRAYS_MISSING");
    }

    if (positions.length === 0 || positions.length % 3 !== 0) {
      throw new Error("MIRRORLAND_POSITION_ARRAY_INVALID");
    }

    if (normals.length !== positions.length) {
      throw new Error("MIRRORLAND_NORMAL_ARRAY_LENGTH_MISMATCH");
    }

    if (rawIndices.length === 0 || rawIndices.length % 3 !== 0) {
      throw new Error("MIRRORLAND_INDEX_ARRAY_INVALID");
    }

    for (let i = 0; i < positions.length; i += 1) {
      if (!Number.isFinite(positions[i])) throw new Error("MIRRORLAND_NONFINITE_POSITION:" + i);
      if (!Number.isFinite(normals[i])) throw new Error("MIRRORLAND_NONFINITE_NORMAL:" + i);
    }

    const vertexCount = positions.length / 3;
    let maxIndex = 0;

    for (let i = 0; i < rawIndices.length; i += 1) {
      const value = rawIndices[i];
      if (!Number.isInteger(value) || value < 0 || value >= vertexCount) {
        throw new Error("MIRRORLAND_INVALID_INDEX:" + i);
      }
      maxIndex = Math.max(maxIndex, value);
    }

    let indices;
    let indexType;

    if (maxIndex <= 65535) {
      indices = new Uint16Array(rawIndices);
      indexType = gl.UNSIGNED_SHORT;
    } else {
      const extension = state.uintExtension || gl.getExtension("OES_element_index_uint");
      state.uintExtension = extension;
      if (!extension) throw new Error("MIRRORLAND_UINT_INDEX_EXTENSION_UNAVAILABLE");
      indices = new Uint32Array(rawIndices);
      indexType = gl.UNSIGNED_INT;
    }

    const colors = new Float32Array(positions.length);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = STAR_PALETTE.mirror[0];
      colors[i + 1] = STAR_PALETTE.mirror[1];
      colors[i + 2] = STAR_PALETTE.mirror[2];
    }

    ADAPTER_RECEIPT.meshAvailable = true;
    ADAPTER_RECEIPT.objectIdentity = object.identity;
    ADAPTER_RECEIPT.objectResult = object.result || "";
    ADAPTER_RECEIPT.validationResult = object.validation.result || "";
    ADAPTER_RECEIPT.vertexCount = vertexCount;
    ADAPTER_RECEIPT.triangleCount = rawIndices.length / 3;
    ADAPTER_RECEIPT.indexType = indexType === gl.UNSIGNED_INT ? "UNSIGNED_INT" : "UNSIGNED_SHORT";
    ADAPTER_RECEIPT.sourceGeometryMutated = false;
    ADAPTER_RECEIPT.geometryRegenerated = false;
    ADAPTER_RECEIPT.fallbackGenerated = false;
    ADAPTER_RECEIPT.result = "REVIEW_PASS";
    ADAPTER_RECEIPT.failureReason = null;

    return buildGpuMesh(gl, Object.freeze({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors,
      indices,
      indexType,
      vertexCount,
      triangleCount: rawIndices.length / 3,
      isMirrorland: true
    }));
  }

  function createDiamondStarMesh(options) {
    const points = options.points || 8;
    const radius = options.radius || 0.62;
    const inner = options.inner || radius * 0.46;
    const depth = options.depth || 0.42;
    const crown = options.crown || 0.22;
    const color = options.color || STAR_PALETTE.north;
    const warmth = options.warmth || 0;

    const verts = [];
    const faces = [];

    function add(p) {
      verts.push(p);
      return verts.length - 1;
    }

    function face(a, b, c) {
      faces.push([a, b, c]);
    }

    const frontApex = add([0, 0, depth]);
    const rearApex = add([0, 0, -depth]);
    const frontCrown = add([0, 0, depth + crown]);
    const rearCrown = add([0, 0, -depth - crown * 0.72]);

    const outer = [];
    const innerRing = [];
    const frontBevel = [];
    const rearBevel = [];

    for (let i = 0; i < points * 2; i += 1) {
      const isPoint = i % 2 === 0;
      const angle = (Math.PI * 2 * i) / (points * 2) - Math.PI / 2;
      const r = isPoint ? radius : inner;
      const yScale = 0.78;
      const ridge = isPoint ? 0.05 : -0.02;

      outer.push(add([Math.cos(angle) * r, Math.sin(angle) * r * yScale, ridge]));
      innerRing.push(add([Math.cos(angle) * r * 0.38, Math.sin(angle) * r * yScale * 0.38, depth * 0.14]));
      frontBevel.push(add([Math.cos(angle) * r * 0.72, Math.sin(angle) * r * yScale * 0.72, depth * 0.52]));
      rearBevel.push(add([Math.cos(angle) * r * 0.68, Math.sin(angle) * r * yScale * 0.68, -depth * 0.48]));
    }

    const count = outer.length;

    for (let i = 0; i < count; i += 1) {
      const next = (i + 1) % count;

      face(frontApex, innerRing[i], innerRing[next]);
      face(frontCrown, frontBevel[next], frontBevel[i]);
      face(frontBevel[i], outer[i], outer[next]);
      face(frontBevel[i], outer[next], frontBevel[next]);
      face(innerRing[i], frontBevel[i], frontBevel[next]);
      face(innerRing[i], frontBevel[next], innerRing[next]);

      face(rearApex, rearBevel[next], rearBevel[i]);
      face(rearCrown, rearBevel[i], rearBevel[next]);
      face(rearBevel[i], outer[next], outer[i]);
      face(rearBevel[i], rearBevel[next], outer[next]);
    }

    const outPositions = [];
    const outNormals = [];
    const outColors = [];

    faces.forEach((item, faceIndex) => {
      const a = verts[item[0]];
      const b = verts[item[1]];
      const c = verts[item[2]];
      const normal = normalize(cross(sub(b, a), sub(c, a)));
      const lift = 0.84 + (faceIndex % 7) * 0.034;
      const sparkleLift = faceIndex % 5 === 0 ? 0.13 : 0;

      [a, b, c].forEach((p) => {
        outPositions.push(p[0], p[1], p[2]);
        outNormals.push(normal[0], normal[1], normal[2]);
        outColors.push(
          Math.min(color[0] * lift + warmth * 0.06 + sparkleLift, 1),
          Math.min(color[1] * lift + warmth * 0.04 + sparkleLift, 1),
          Math.min(color[2] * lift + warmth * 0.02 + sparkleLift, 1)
        );
      });
    });

    return Object.freeze({
      positions: new Float32Array(outPositions),
      normals: new Float32Array(outNormals),
      colors: new Float32Array(outColors),
      vertexCount: outPositions.length / 3,
      triangleCount: faces.length
    });
  }

  function buildMeshes(gl) {
    const meshes = new Map();

    if (BACKGROUND.enabled) {
      meshes.set("background-stars", buildGpuMesh(gl, createBackgroundStarsMesh()));
      meshes.set("shooting-star", buildGpuMesh(gl, createShootingStarMesh()));
      emitReceipt({
        backgroundStarsInitialized: true,
        backgroundStarCount: BACKGROUND.starCount
      });
    }

    try {
      meshes.set("mirrorland", adaptMirrorlandObjectToGpuMesh(gl));
      emitReceipt({
        MirrorlandMeshLoaded: true,
        mirrorlandObjectStatus: "found",
        mirrorlandValidationStatus: "REVIEW_PASS"
      });
    } catch (error) {
      ADAPTER_RECEIPT.result = "FAIL";
      ADAPTER_RECEIPT.failureReason = error && error.message ? error.message : String(error);
      emitFailure("Mirrorland adaptation", "MIRRORLAND_ADAPTATION_HELD:" + ADAPTER_RECEIPT.failureReason, {
        MirrorlandMeshLoaded: false
      });
    }

    WINGS.forEach((wing) => {
      const baseColor = STAR_PALETTE[wing];
      const roomColor =
        wing === "north" ? STAR_PALETTE.roomNorth :
        wing === "east" ? STAR_PALETTE.roomEast :
        wing === "south" ? STAR_PALETTE.roomSouth :
        STAR_PALETTE.roomWest;

      meshes.set("wing-" + wing, buildGpuMesh(gl, createDiamondStarMesh({
        points: QUALITY.cardinalSegments,
        radius: 0.72,
        inner: 0.30,
        depth: 0.42,
        crown: 0.20,
        color: baseColor,
        warmth: wing === "south" || wing === "west" ? 0.10 : 0.02
      })));

      meshes.set("room-" + wing, buildGpuMesh(gl, createDiamondStarMesh({
        points: QUALITY.roomSegments,
        radius: 0.42,
        inner: 0.20,
        depth: 0.25,
        crown: 0.10,
        color: roomColor,
        warmth: wing === "south" || wing === "west" ? 0.08 : 0.02
      })));
    });

    emitReceipt({
      meshBuildStatus: "built",
      cardinalMeshCount: 4,
      roomMeshCount: 4
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
      material: opts.material || "CARDINAL_IDLE",
      baseMaterial: opts.material || "CARDINAL_IDLE",
      color: opts.color || STAR_PALETTE.north,
      phase: opts.phase || 0,
      visible: true,
      transform: {
        x: 0, y: 0, z: 0,
        rx: 0, ry: 0, rz: 0,
        sx: 1, sy: 1, sz: 1,
        prominence: 1,
        halo: 0,
        rotationSpeed: 0.12,
        float: 0
      },
      target: {
        x: 0, y: 0, z: 0,
        sx: 1, sy: 1, sz: 1,
        prominence: 1,
        halo: 0,
        rotationSpeed: 0.12,
        float: 0
      }
    };
  }

  function buildRegistry() {
    const registry = new Map();

    registry.set("background-stars", node("background-stars", "background", {
      meshKey: "background-stars",
      material: "BACKGROUND_STAR",
      phase: 0.1
    }));

    registry.set("shooting-star", node("shooting-star", "background", {
      meshKey: "shooting-star",
      material: "SHOOTING_STAR",
      phase: 0.2
    }));

    registry.set("mirrorland", node("mirrorland", "mirrorland", {
      label: "Mirrorland",
      short: "Center fulcrum",
      meshKey: "mirrorland",
      material: "MIRRORLAND_HERO",
      color: STAR_PALETTE.mirror,
      phase: 0.4
    }));

    WINGS.forEach((wing, wingIndex) => {
      const copy = AXIS_COPY[wing];

      registry.set(wing, node(wing, "cardinal", {
        label: copy.label,
        short: copy.short,
        wing,
        meshKey: "wing-" + wing,
        material: "CARDINAL_IDLE",
        color: STAR_PALETTE[wing],
        phase: wingIndex * 1.37 + 0.22
      }));

      DEFAULT_ROOMS[wing].forEach((room, index) => {
        registry.set(room.id, node(room.id, "petal", {
          label: room.label,
          short: room.short,
          wing,
          roomIndex: index,
          coordinate: coordinateFor(index, DEFAULT_ROOMS[wing].length),
          meshKey: "room-" + wing,
          material: "ROOM_IDLE",
          color:
            wing === "north" ? STAR_PALETTE.roomNorth :
            wing === "east" ? STAR_PALETTE.roomEast :
            wing === "south" ? STAR_PALETTE.roomSouth :
            STAR_PALETTE.roomWest,
          phase: wingIndex * 1.13 + index * 0.47
        }));
      });
    });

    emitReceipt({ registryBuildStatus: "built" });
    return registry;
  }

  function readControllerState() {
    const ds = state.root.dataset || {};

    state.mode = String(ds.compassMode || MODES.COMPASS).toUpperCase();
    state.orbitFocus = normalizeWing(ds.orbitFocus || ds.selectedCardinal || ds.selectedWing || "");
    state.selectedCardinal = normalizeWing(ds.selectedCardinal || "");
    state.selectedRoom = String(ds.selectedRoom || "");
    state.selectedDestinationType = String(ds.selectedDestinationType || "").trim().toLowerCase();
    state.flowerExpanded = ds.flowerExpanded === "true";
    state.reducedMotion =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      ds.reducedMotion === "true";

    state.targetOrbitAngle = ORBIT_ANGLES[state.orbitFocus] || 0;

    emitReceipt({
      activeMode: state.mode,
      activeDestination: state.selectedDestinationType || "",
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
      wing === "north" ? [0, 1.32, -0.10] :
      wing === "east" ? [1.48, 0, -0.10] :
      wing === "south" ? [0, -1.32, -0.10] :
      [-1.48, 0, -0.10];

    return rotate2D(base, state.orbitAngle);
  }

  function roomPetalPosition(index, count) {
    const radius = count === 4 ? 1.24 : 1.34;
    const angle = (Math.PI * 2 * index) / Math.max(count, 1) - Math.PI / 2;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.78, 0.26];
  }

  function setTarget(n, values) {
    Object.assign(n.target, values);
  }

  function setUniformScale(values, scale) {
    values.sx = scale;
    values.sy = scale;
    values.sz = scale;
    return values;
  }

  function updateOrbitAngle(dt) {
    if (state.reducedMotion) {
      state.orbitAngle = state.targetOrbitAngle;
      return;
    }

    let delta = state.targetOrbitAngle - state.orbitAngle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;

    state.orbitAngle += delta * Math.min(1, dt * 4.8);
  }

  function topAuthorityWing() {
    let bestWing = "north";
    let bestY = -Infinity;

    WINGS.forEach((wing) => {
      const p = orbitWingPosition(wing);
      if (p[1] > bestY) {
        bestY = p[1];
        bestWing = wing;
      }
    });

    return bestWing;
  }

  function updateShootingStar(nowMs) {
    if (!BACKGROUND.shootingStars || state.reducedMotion) {
      state.shootingStar.active = false;
      return;
    }

    if (!state.shootingStar.nextMs) {
      state.shootingStar.nextMs = nowMs + BACKGROUND.shootingStarIntervalMs;
    }

    if (!state.shootingStar.active && nowMs >= state.shootingStar.nextMs) {
      state.shootingStar.active = true;
      state.shootingStar.startMs = nowMs;
      state.shootingStar.seed += 1;
    }

    if (state.shootingStar.active && nowMs - state.shootingStar.startMs > state.shootingStar.durationMs) {
      state.shootingStar.active = false;
      state.shootingStar.nextMs =
        nowMs +
        BACKGROUND.shootingStarIntervalMs +
        (seeded(state.shootingStar.seed + 201) - 0.5) * BACKGROUND.shootingStarVarianceMs;
    }
  }

  function updateTargets() {
    const topWing = topAuthorityWing();
    const focus = state.orbitFocus || topWing || "north";
    const mirrorlandSelected = state.selectedDestinationType === "mirrorland";
    const activeFlower = state.flowerExpanded && state.selectedCardinal && !mirrorlandSelected;
    const selectedRooms = DEFAULT_ROOMS[state.selectedCardinal || focus] || [];

    emitReceipt({ topAuthorityCardinal: topWing });

    state.registry.forEach((n) => {
      n.visible = false;
      n.material = n.baseMaterial;
      setTarget(n, {
        x: 0, y: 0, z: -1,
        sx: 1, sy: 1, sz: 1,
        prominence: 0,
        halo: 0,
        rotationSpeed: 0.06,
        float: 0
      });
    });

    const background = state.registry.get("background-stars");
    if (background && BACKGROUND.enabled) {
      background.visible = true;
      setTarget(background, setUniformScale({
        x: 0, y: 0, z: -2.2,
        prominence: state.reducedMotion ? 0.34 : 0.46,
        halo: 0,
        rotationSpeed: 0,
        float: 0
      }, 1));
    }

    const shooting = state.registry.get("shooting-star");
    if (shooting) {
      const active = state.shootingStar.active && !state.reducedMotion;
      const progress = active
        ? Math.max(0, Math.min(1, (performance.now() - state.shootingStar.startMs) / state.shootingStar.durationMs))
        : 0;

      shooting.visible = active;
      setTarget(shooting, setUniformScale({
        x: -2.2 + progress * 1.1 + (seeded(state.shootingStar.seed + 12) - 0.5) * 0.7,
        y: 1.82 - progress * 0.54 + (seeded(state.shootingStar.seed + 19) - 0.5) * 0.38,
        z: -2.8,
        prominence: active ? Math.sin(progress * Math.PI) * 0.58 : 0,
        halo: 0,
        rotationSpeed: 0,
        float: 0
      }, 1));
    }

    const mirrorland = state.registry.get("mirrorland");

    if (mirrorland) {
      mirrorland.visible = false;

      if (mirrorlandSelected && state.meshes.has("mirrorland")) {
        mirrorland.visible = true;
        setTarget(mirrorland, setUniformScale({
          x: 0, y: 0.02, z: 0.34,
          prominence: 1.08,
          halo: 1.05,
          rotationSpeed: 0.10,
          float: 0
        }, QUALITY.mirrorlandHeroScale));
      }
    }

    if (mirrorlandSelected) {
      state.camera.nextEye = [0, 0.74, state.width / Math.max(1, state.height) < 0.8 ? 7.6 : 6.2];
      state.camera.nextTarget = [0, 0, 0];
      return;
    }

    if (!activeFlower) {
      WINGS.forEach((wing) => {
        const n = state.registry.get(wing);
        const p = orbitWingPosition(wing);
        const focused = wing === topWing;

        n.visible = true;
        n.material = focused ? "CARDINAL_FOCUSED" : "CARDINAL_IDLE";

        setTarget(n, setUniformScale({
          x: p[0], y: p[1], z: focused ? 0.34 : p[2],
          prominence: focused ? 1.0 : 0.74,
          halo: focused ? 1.0 : 0.52,
          rotationSpeed: focused ? 0.16 : 0.09,
          float: focused ? 0.012 : 0.006
        }, focused ? QUALITY.focusedCardinalScale : QUALITY.cardinalScale));
      });

      state.camera.nextEye = [0, 0.80, state.width / Math.max(1, state.height) < 0.8 ? 7.2 : 6.05];
      state.camera.nextTarget = [0, 0, 0];
      return;
    }

    WINGS.forEach((wing) => {
      const n = state.registry.get(wing);
      n.visible = false;
      setTarget(n, setUniformScale({
        x: 0, y: 0.10, z: -0.6,
        prominence: 0,
        halo: 0,
        rotationSpeed: 0.06,
        float: 0
      }, 0.4));
    });

    selectedRooms.forEach((room, index) => {
      const n = state.registry.get(room.id);
      if (!n) return;

      const p = roomPetalPosition(index, selectedRooms.length);
      const selected = state.selectedRoom === room.id;

      n.visible = true;
      n.material = selected ? "ROOM_SELECTED" : "ROOM_IDLE";

      setTarget(n, setUniformScale({
        x: p[0], y: p[1] - 0.14, z: selected ? 0.86 : 0.42,
        prominence: selected ? 1.0 : 0.86,
        halo: selected ? 0.88 : 0.48,
        rotationSpeed: selected ? 0.12 : 0.08,
        float: selected ? 0.012 : 0.006
      }, selected ? QUALITY.selectedRoomScale : QUALITY.roomScale));
    });

    state.camera.nextEye = [0, 0.66, state.width / Math.max(1, state.height) < 0.8 ? 7.5 : 5.85];
    state.camera.nextTarget = [0, 0.03, 0];
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateTransforms(dt) {
    const speed = state.reducedMotion ? 1 : Math.min(1, dt * 6.2);

    state.registry.forEach((n) => {
      const a = n.transform;
      const b = n.target;

      ["x", "y", "z", "sx", "sy", "sz", "prominence", "halo", "rotationSpeed", "float"].forEach((key) => {
        a[key] = lerp(a[key], b[key], speed);
      });

      if (state.reducedMotion) {
        a.rx = 0;
        a.ry = 0;
        return;
      }

      if (n.type === "background") {
        a.rx = 0;
        a.ry = 0;
        return;
      }

      a.rz += dt * a.rotationSpeed;
      a.ry = Math.sin(state.time * 0.42 + n.phase) * QUALITY.maxYaw * Math.max(0.35, a.prominence);
      a.rx = Math.sin(state.time * 0.31 + n.phase * 0.73) * QUALITY.maxPitch * Math.max(0.35, a.prominence);
    });

    for (let i = 0; i < 3; i += 1) {
      state.camera.eye[i] = lerp(state.camera.eye[i], state.camera.nextEye[i], speed);
      state.camera.target[i] = lerp(state.camera.target[i], state.camera.nextTarget[i], speed);
    }
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

  function modelMatrix(n, haloPass) {
    const t = n.transform;
    const floatY =
      !state.reducedMotion && n.type !== "mirrorland" && n.type !== "background"
        ? Math.sin(state.time * 0.95 + n.roomIndex * 0.72 + n.phase) * t.float
        : 0;

    const haloScale = haloPass ? 1.0 + t.halo * 0.10 : 1;

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

    if (x < -1.30 || x > 1.30 || y < -1.30 || y > 1.30) return null;

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

    const labelScale =
      n.type === "mirrorland" ? 0.96 :
      n.type === "cardinal" ? 0.80 :
      0.78;

    el.style.left = screen.x + "px";
    el.style.top = screen.y + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.transform = "translate(-50%, -50%) scale(" + labelScale + ")";
    el.style.opacity = String(Math.max(0, Math.min(1, n.transform.prominence)));
    el.style.pointerEvents = n.transform.prominence >= 0.18 ? "auto" : "none";
    el.style.zIndex = n.type === "petal" ? "5" : n.type === "mirrorland" ? "6" : "4";
  }

  function syncInstructionCopy() {
    if (!state.root) return;

    const note = state.root.querySelector(".compass-accessibility-note");
    if (!note) return;

    const expanded = state.flowerExpanded === true;
    const copy = expanded ? INSTRUCTION_COPY.flower : INSTRUCTION_COPY.orbit;

    note.textContent = copy;

    emitReceipt({
      instructionState: expanded ? "flowerExpanded" : "orbit",
      instructionCopy: copy
    });
  }

  function syncSemanticObjects() {
    state.registry.forEach(syncSemanticNode);
    syncInstructionCopy();
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
      target.closest("[data-compass-cardinal], [data-compass-room], [data-compass-object='mirrorland'], [data-compass-enter], [data-compass-return-to-orbit], a, button")
    );
  }

  function findHit(event) {
    const rect = state.surface.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const radius = Math.max(46, Math.min(80, rect.width * 0.090));
    let best = null;
    let bestDistance = Infinity;

    state.registry.forEach((n) => {
      if (n.type === "background") return;
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
      emitFailure("pointer bridge", "MISSING_COMPASS_GESTURE_SURFACE");
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
    const dpr = Math.min(globalThis.devicePixelRatio || 1, QUALITY.devicePixelRatioCap);
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
  }

  function bindAttrib(gl, buffer, location, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  function applyMaterial(gl, materialName, prominence, haloStrength) {
    let material = MATERIALS[materialName] || MATERIALS.CARDINAL_IDLE;

    if (state.diagnosticMode === DIAGNOSTIC_MODES.OPAQUE_UNLIT) {
      material = {
        specular: 0,
        rim: 0,
        emissive: 0,
        alpha: 1,
        sparkle: 0,
        halo: 0,
        contrast: 1
      };
    }

    const atmospheric = materialName === "BACKGROUND_STAR" || materialName === "SHOOTING_STAR";

    if (state.reducedMotion || atmospheric) {
      gl.uniform1f(state.uniforms.twinkle, state.reducedMotion ? 0 : 0.42);
      gl.uniform1f(state.uniforms.sparkle, atmospheric ? 0.04 : 0);
    } else {
      gl.uniform1f(state.uniforms.twinkle, 1);
      gl.uniform1f(state.uniforms.sparkle, material.sparkle);
    }

    gl.uniform1f(state.uniforms.prominence, prominence);
    gl.uniform1f(state.uniforms.specular, material.specular);
    gl.uniform1f(state.uniforms.rim, material.rim);
    gl.uniform1f(state.uniforms.emissive, material.emissive);
    gl.uniform1f(state.uniforms.alpha, material.alpha);
    gl.uniform1f(state.uniforms.contrast, material.contrast);
    gl.uniform1f(state.uniforms.haloStrength, material.halo * haloStrength);
  }

  function shouldDrawForDiagnostic(n) {
    if (state.diagnosticMode === DIAGNOSTIC_MODES.MIRRORLAND_ONLY) return n.type === "mirrorland";
    if (state.diagnosticMode === DIAGNOSTIC_MODES.CARDINAL_ONLY) return n.type === "cardinal";
    if (state.diagnosticMode === DIAGNOSTIC_MODES.ROOM_ONLY) return n.type === "petal";
    return true;
  }

  function drawNode(n, haloPass) {
    if (!n.visible || n.transform.prominence < 0.04 || !shouldDrawForDiagnostic(n)) return 0;

    if (state.diagnosticMode === DIAGNOSTIC_MODES.HALO_DISABLED && haloPass) return 0;
    if (n.type === "background" && haloPass) return 0;

    const mesh = state.meshes.get(n.meshKey);
    if (!mesh) return 0;

    const gl = state.gl;

    bindAttrib(gl, mesh.position, state.attribs.position, 3);
    bindAttrib(gl, mesh.normal, state.attribs.normal, 3);
    bindAttrib(gl, mesh.color, state.attribs.color, 3);

    const model = modelMatrix(n, haloPass);
    gl.uniformMatrix4fv(state.uniforms.model, false, new Float32Array(model));
    gl.uniformMatrix4fv(state.uniforms.view, false, new Float32Array(state.view));
    gl.uniformMatrix4fv(state.uniforms.projection, false, new Float32Array(state.projection));
    gl.uniformMatrix3fv(state.uniforms.normalMatrix, false, new Float32Array(normalMatrix3(model)));
    gl.uniform1f(state.uniforms.time, state.time);
    gl.uniform1f(state.uniforms.haloPass, haloPass ? 1 : 0);
    gl.uniform1f(state.uniforms.haloExpansion, n.type === "mirrorland" ? 0.030 : 0.075);
    gl.uniform1f(state.uniforms.diagnosticMode,
      state.diagnosticMode === DIAGNOSTIC_MODES.OPAQUE_UNLIT ? 1 :
      state.diagnosticMode === DIAGNOSTIC_MODES.NORMALS ? 2 :
      state.diagnosticMode === DIAGNOSTIC_MODES.FACET_ONLY ? 3 :
      0
    );

    applyMaterial(gl, n.material, n.transform.prominence, n.transform.halo);

    if (mesh.indexed) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.index);
      gl.drawElements(gl.TRIANGLES, mesh.indexCount, mesh.indexType, 0);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
    }

    if (n.type === "mirrorland" && !haloPass) {
      RECEIPT.MirrorlandDrawn = true;
    }

    return 1;
  }

  function render(now) {
    if (!state.running) return;

    const seconds = now * 0.001;
    const dt = state.lastTime ? Math.min(0.05, seconds - state.lastTime) : 0.016;
    state.lastTime = seconds;
    state.time = seconds;

    readControllerState();
    updateShootingStar(now);
    updateOrbitAngle(dt);
    updateTargets();
    updateTransforms(dt);
    resize();

    const gl = state.gl;
    const aspect = state.width / Math.max(1, state.height);

    state.view = lookAt4(state.camera.eye, state.camera.target, [0, 1, 0]);
    state.projection = perspective4(Math.PI / (aspect < 0.8 ? 4.45 : 4.85), aspect, 0.1, 60);

    gl.clearColor(0.015, 0.018, 0.034, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(state.program);
    gl.uniform3f(state.uniforms.keyLight, -0.42, -0.82, -0.68);
    gl.uniform3f(state.uniforms.fillLight, 0.72, -0.24, -0.54);
    gl.uniform3f(state.uniforms.rimLight, 0.08, 0.46, 1.0);
    gl.uniform3f(state.uniforms.ambientColor, 0.10, 0.12, 0.18);

    let drawCalls = 0;
    let backgroundDrawCalls = 0;
    let visible = 0;

    gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    ["background-stars", "shooting-star"].forEach((id) => {
      const n = state.registry.get(id);
      if (n && n.visible) {
        backgroundDrawCalls += drawNode(n, false);
      }
    });

    gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    state.registry.forEach((n) => {
      if (n.type === "background") return;
      if (n.visible && n.transform.prominence > 0.04) {
        drawCalls += drawNode(n, true);
      }
    });

    gl.depthMask(true);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    state.registry.forEach((n) => {
      if (n.type === "background") return;
      if (n.visible && n.transform.prominence > 0.04 && shouldDrawForDiagnostic(n)) {
        visible += 1;
        drawCalls += drawNode(n, false);
      }
    });

    syncSemanticObjects();

    const glError = gl.getError();
    emitReceipt({
      rendererInitialized: true,
      drawCallsLastFrame: drawCalls + backgroundDrawCalls,
      backgroundDrawCallsLastFrame: backgroundDrawCalls,
      visibleObjectCount: visible,
      shootingStarActive: state.shootingStar.active,
      reducedMotionBackgroundSuppressed: state.reducedMotion,
      glError: glError === gl.NO_ERROR ? "NO_ERROR" : String(glError),
      renderLoopStatus: state.reducedMotion ? "active-reduced-motion" : "active",
      cameraOrientation: "+Z_FRONT_BOUNDED_THREE_QUARTER",
      diagnosticMode: state.diagnosticMode,
      failureReason: null
    });

    state.raf = requestAnimationFrame(render);
  }

  function disposeResources() {
    state.running = false;
    cancelAnimationFrame(state.raf);

    if (state.gl) {
      state.meshes.forEach((mesh) => {
        if (mesh.position) state.gl.deleteBuffer(mesh.position);
        if (mesh.normal) state.gl.deleteBuffer(mesh.normal);
        if (mesh.color) state.gl.deleteBuffer(mesh.color);
        if (mesh.index) state.gl.deleteBuffer(mesh.index);
      });

      if (state.program) state.gl.deleteProgram(state.program);
    }

    state.meshes.clear();
    state.registry.clear();

    emitReceipt({
      renderLoopStatus: "disposed",
      rendererInitialized: false
    });
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      state.running = false;
      cancelAnimationFrame(state.raf);
      emitFailure("context", "WEBGL_CONTEXT_LOST", {
        webglContextStatus: "lost",
        renderLoopStatus: "held"
      });
    });

    state.canvas.addEventListener("webglcontextrestored", () => {
      emitReceipt({
        webglContextStatus: "restored",
        renderLoopStatus: "restart-required"
      });
    });
  }

  function init() {
    exposeApi();

    try {
      state.root = findRoot();
      state.scene = qs(["[data-compass-scene]", ".compass-scene"], state.root);
      state.mount = qs(["[data-compass-crystals-mount]", ".compass-scene__visual", ".compass-scene"], state.root) || state.root;

      emitReceipt({
        rootStatus: state.root ? "found" : "missing",
        sceneStatus: state.scene ? "found" : "missing",
        mountStatus: state.mount ? "found" : "missing",
        initializationStage: "DOM resolution"
      });

      state.canvas = ensureCanvas(state.mount);
      emitReceipt({ canvasStatus: "created-or-found", initializationStage: "canvas" });

      const gl = getGL(state.canvas);
      if (!gl) {
        emitFailure("WebGL context creation", "WEBGL_CONTEXT_UNAVAILABLE", {
          webglContextStatus: "unavailable"
        });
        return;
      }

      state.gl = gl;
      emitReceipt({ webglContextStatus: "acquired", initializationStage: "WebGL context creation" });

      bindContextLifecycle();

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.CULL_FACE);

      state.program = createProgram(gl);
      emitReceipt({
        shaderStatus: "compiled",
        programStatus: "linked",
        shaderProgramsLinked: true,
        initializationStage: "shader compilation"
      });

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
        time: gl.getUniformLocation(state.program, "uTime"),
        diagnosticMode: gl.getUniformLocation(state.program, "uDiagnosticMode"),
        prominence: gl.getUniformLocation(state.program, "uProminence"),
        specular: gl.getUniformLocation(state.program, "uSpecular"),
        rim: gl.getUniformLocation(state.program, "uRim"),
        emissive: gl.getUniformLocation(state.program, "uEmissive"),
        alpha: gl.getUniformLocation(state.program, "uAlpha"),
        sparkle: gl.getUniformLocation(state.program, "uSparkle"),
        twinkle: gl.getUniformLocation(state.program, "uTwinkle"),
        contrast: gl.getUniformLocation(state.program, "uContrast"),
        haloStrength: gl.getUniformLocation(state.program, "uHaloStrength"),
        haloPass: gl.getUniformLocation(state.program, "uHaloPass"),
        haloExpansion: gl.getUniformLocation(state.program, "uHaloExpansion"),
        keyLight: gl.getUniformLocation(state.program, "uKeyLight"),
        fillLight: gl.getUniformLocation(state.program, "uFillLight"),
        rimLight: gl.getUniformLocation(state.program, "uRimLight"),
        ambientColor: gl.getUniformLocation(state.program, "uAmbientColor")
      };

      state.meshes = buildMeshes(gl);
      state.registry = buildRegistry();
      bindPointerBridge();

      state.shootingStar.nextMs = performance.now() + BACKGROUND.shootingStarIntervalMs;

      state.running = true;
      state.raf = requestAnimationFrame(render);

      emitReceipt({
        rendererInitialized: true,
        renderLoopStatus: "active",
        initializationStage: "render-loop startup"
      });
    } catch (error) {
      emitFailure("initialization", "CRYSTALS_INIT_FAILURE:" + (error && error.message ? error.message : String(error)));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
