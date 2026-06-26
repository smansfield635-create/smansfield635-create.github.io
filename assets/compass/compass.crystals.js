/* /assets/compass/compass.crystals.js
   DGB Compass — Cardinal stars, room clusters, atmosphere, and scene gestures.

   Protected behavior:
   - cardinal star opens its cluster;
   - room star selects its path;
   - cluster swipe returns to the constellation;
   - constellation swipe changes the facing wing;
   - semantic controls retain their native click behavior;
   - Mirrorland remains outside this renderer.

   Pointer rule:
   - territory is locked at pointerdown;
   - semantic controls are never captured;
   - rendered-star pointers never become scene swipes;
   - only empty-scene pointers may be captured;
   - tap <= 14 px;
   - ambiguous 15–41 px;
   - swipe >= 42 px with 1.25 directional dominance.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_CRYSTALS_RENDERER_v5",
    file: "/assets/compass/compass.crystals.js",
    role: "CARDINAL_ROOM_ATMOSPHERE_RENDERER",
    controllerAuthority: false,
    navigationAuthority: false,
    mirrorlandAuthority: false,
    pointerTerritoryLocking: true,
    visualPassClaimed: false
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const MODES = Object.freeze({
    COMPASS: "COMPASS_MODE",
    ORBIT: "ORBIT_MODE",
    DESTINATION: "DESTINATION_MODE"
  });

  const WINDOW_STATES = Object.freeze({
    DORMANT: "dormant",
    REVEALING: "revealing",
    FOCUSED: "focused",
    WITHDRAWING: "withdrawing",
    NAVIGATING: "navigating"
  });

  const GESTURE = Object.freeze({
    maximumTapDistancePx: 14,
    minimumSwipeDistancePx: 42,
    directionalDominanceRatio: 1.25
  });

  const QUALITY = Object.freeze({
    devicePixelRatioCap: 2,
    cardinalSegments: 8,
    roomSegments: 6,
    cardinalScale: 1.05,
    focusedCardinalScale: 1.28,
    selectedCardinalScale: 1.38,
    roomScale: 0.92,
    selectedRoomScale: 1.14,
    maxYaw: 0.22,
    maxPitch: 0.14
  });

  const BACKGROUND = Object.freeze({
    starCount: 90,
    shootingStarIntervalMs: 7000,
    shootingStarVarianceMs: 2200
  });

  const ORBIT_ANGLES = Object.freeze({
    north: 0,
    east: Math.PI / 2,
    south: Math.PI,
    west: -Math.PI / 2
  });

  const STAR_PALETTE = Object.freeze({
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
      specular: 0,
      rim: 0,
      emissive: 0.26,
      alpha: 0.42,
      sparkle: 0.08,
      halo: 0,
      contrast: 1
    }),

    SHOOTING_STAR: Object.freeze({
      specular: 0,
      rim: 0.18,
      emissive: 0.42,
      alpha: 0.48,
      sparkle: 0.12,
      halo: 0,
      contrast: 1
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
      specular: 1.12,
      rim: 1.08,
      emissive: 0.21,
      alpha: 0.90,
      sparkle: 0.27,
      halo: 0.82,
      contrast: 1.16
    }),

    ROOM_SELECTED: Object.freeze({
      specular: 1.38,
      rim: 1.22,
      emissive: 0.28,
      alpha: 0.96,
      sparkle: 0.38,
      halo: 1.08,
      contrast: 1.24
    })
  });

  const AXIS_COPY = Object.freeze({
    north: Object.freeze({
      label: "Orientation",
      short: "North Star path"
    }),

    east: Object.freeze({
      label: "Worlds",
      short: "Estate worlds"
    }),

    south: Object.freeze({
      label: "Instruments",
      short: "Measure and govern"
    }),

    west: Object.freeze({
      label: "Frontier",
      short: "Build next"
    })
  });

  const DEFAULT_ROOMS = Object.freeze({
    north: Object.freeze([
      Object.freeze({
        id: "north-1",
        label: "Compass Desk",
        short: "Reset orientation"
      }),
      Object.freeze({
        id: "north-2",
        label: "Guide Desk",
        short: "Read the map"
      }),
      Object.freeze({
        id: "north-3",
        label: "Front Door",
        short: "Enter formally"
      }),
      Object.freeze({
        id: "north-4",
        label: "About Sean",
        short: "Builder context"
      }),
      Object.freeze({
        id: "north-5",
        label: "Philosophy Library",
        short: "Founding thought"
      })
    ]),

    east: Object.freeze([
      Object.freeze({
        id: "east-1",
        label: "Atlas Study",
        short: "Open worlds"
      }),
      Object.freeze({
        id: "east-2",
        label: "ZIONTS",
        short: "Earth warning-path"
      }),
      Object.freeze({
        id: "east-3",
        label: "Audralia Conservatory",
        short: "Diagnostic civilization"
      }),
      Object.freeze({
        id: "east-4",
        label: "Hearth",
        short: "Diagnostic chamber"
      }),
      Object.freeze({
        id: "east-5",
        label: "H-Earth",
        short: "Parallel world"
      })
    ]),

    south: Object.freeze([
      Object.freeze({
        id: "south-1",
        label: "The Lab",
        short: "Use instruments"
      }),
      Object.freeze({
        id: "south-2",
        label: "Law Library",
        short: "Read standards"
      }),
      Object.freeze({
        id: "south-3",
        label: "Council Room",
        short: "Inspect authority"
      }),
      Object.freeze({
        id: "south-4",
        label: "Control Cockpit",
        short: "Operate controls"
      })
    ]),

    west: Object.freeze([
      Object.freeze({
        id: "west-1",
        label: "Frontier Workshop Yard",
        short: "Workshop edge"
      }),
      Object.freeze({
        id: "west-2",
        label: "Energy Bench",
        short: "Inspect power"
      }),
      Object.freeze({
        id: "west-3",
        label: "Water Bench",
        short: "Inspect flow"
      }),
      Object.freeze({
        id: "west-4",
        label: "Infrastructure Bay",
        short: "Inspect support"
      }),
      Object.freeze({
        id: "west-5",
        label: "Vision Window",
        short: "See horizon"
      })
    ])
  });

  const SEMANTIC_CONTROL_SELECTOR = [
    "[data-compass-object='mirrorland']",
    "[data-compass-mirrorland-threshold]",
    "[data-compass-cardinal]",
    "[data-compass-room]",
    "[data-compass-destination]",
    "[data-compass-enter]",
    "[data-compass-return-to-orbit]",
    "[data-compass-mirrorland-back]",
    "[data-compass-lens-tab]",
    "a",
    "button"
  ].join(", ");

  const state = {
    root: null,
    scene: null,
    mount: null,
    canvas: null,
    surface: null,

    gl: null,
    program: null,
    attributes: null,
    uniforms: null,

    meshes: new Map(),
    registry: new Map(),

    mode: MODES.COMPASS,
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    selectedDestinationType: "",
    flowerExpanded: false,

    windowState: WINDOW_STATES.DORMANT,
    mirrorlandSuppressed: false,
    reducedMotion: false,

    orbitAngle: 0,
    targetOrbitAngle: 0,

    width: 1,
    height: 1,
    pixelRatio: 1,

    time: 0,
    lastTime: 0,

    running: false,
    raf: 0,

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

  const RECEIPT = {
    contractId: CONTRACT.id,
    rendererRole: CONTRACT.role,

    rendererInitialized: false,
    controllerAuthority: false,
    navigationAuthority: false,

    mirrorlandMeshLoaded: false,
    mirrorlandDrawn: false,
    mirrorlandHitTestingEnabled: false,
    mirrorlandSemanticSyncEnabled: false,

    pointerTerritoryLockingEnabled: true,
    semanticPointerReservationEnabled: true,
    renderedNodePointerCaptureEnabled: false,
    emptyScenePointerCaptureEnabled: true,

    activePointerTerritory: "",
    activePointerNode: "",
    lastPointerAction: "pending",

    maximumTapDistancePx:
      GESTURE.maximumTapDistancePx,

    minimumSwipeDistancePx:
      GESTURE.minimumSwipeDistancePx,

    directionalDominanceRatio:
      GESTURE.directionalDominanceRatio,

    activeMode: "pending",
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    selectedDestinationType: "",
    flowerExpanded: false,

    mirrorlandWindowState:
      WINDOW_STATES.DORMANT,

    compassInteractionSuppressedForMirrorland:
      false,

    cardinalRegistryCount: 0,
    roomRegistryCount: 0,

    drawCallsLastFrame: 0,
    visibleObjectCount: 0,

    pointerBridgeStatus: "pending",
    renderLoopStatus: "pending",
    glError: "not-checked",
    failureReason: null,

    visualPassClaimed: false
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function first(selectors, root = document) {
    for (const selector of selectors) {
      const element = $(selector, root);

      if (element) {
        return element;
      }
    }

    return null;
  }

  function normalizeWing(value) {
    const wing = String(value || "")
      .trim()
      .toLowerCase();

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeWindowState(value) {
    const requested = String(value || "")
      .trim()
      .toLowerCase();

    return Object.values(WINDOW_STATES).includes(
      requested
    )
      ? requested
      : WINDOW_STATES.DORMANT;
  }

  function seeded(seed) {
    const value =
      Math.sin(seed * 12.9898) *
      43758.5453;

    return value - Math.floor(value);
  }

  function emitReceipt(extra = {}) {
    Object.assign(
      RECEIPT,
      {
        activeMode: state.mode,
        orbitFocus: state.orbitFocus,
        selectedCardinal:
          state.selectedCardinal,
        selectedRoom:
          state.selectedRoom,
        selectedDestinationType:
          state.selectedDestinationType,
        flowerExpanded:
          state.flowerExpanded,

        mirrorlandWindowState:
          state.windowState,

        compassInteractionSuppressedForMirrorland:
          state.mirrorlandSuppressed,

        activePointerTerritory:
          state.pointer
            ? state.pointer.territory
            : "",

        activePointerNode:
          state.pointer &&
          state.pointer.node
            ? state.pointer.node.id
            : "",

        visualPassClaimed: false
      },
      extra,
      {
        visualPassClaimed: false
      }
    );

    const receipt = Object.freeze({
      ...RECEIPT
    });

    const serialized =
      JSON.stringify(receipt);

    if (state.root) {
      state.root.dataset.compassCrystalsReceipt =
        serialized;

      state.root.dataset.compassCrystalsStatus =
        receipt.failureReason
          ? "held"
          : "available";
    }

    if (state.canvas) {
      state.canvas.dataset.compassCrystalsReceipt =
        serialized;
    }

    const slot = state.root
      ? $(
          "[data-compass-crystals-receipt]",
          state.root
        )
      : null;

    if (slot) {
      slot.value = serialized;
      slot.textContent = serialized;
    }

    globalThis.DGB_COMPASS_CRYSTALS_RECEIPT =
      receipt;
  }

  function fail(reason) {
    state.running = false;

    cancelAnimationFrame(state.raf);

    emitReceipt({
      rendererInitialized: false,
      renderLoopStatus: "held",
      failureReason: reason
    });
  }

  function ensureCanvas() {
    const existing = $(
      "canvas[data-compass-crystals-canvas]",
      state.mount
    );

    if (existing) {
      return existing;
    }

    const canvas =
      document.createElement("canvas");

    canvas.setAttribute(
      "data-compass-crystals-canvas",
      "true"
    );

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "role",
      "presentation"
    );

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";

    if (
      getComputedStyle(state.mount).position ===
      "static"
    ) {
      state.mount.style.position = "relative";
    }

    state.mount.prepend(canvas);

    return canvas;
  }

  function createContext() {
    return state.canvas.getContext(
      "webgl",
      {
        antialias: true,
        alpha: true,
        depth: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false
      }
    );
  }

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uNormalMatrix;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec4 world =
        uModel *
        vec4(aPosition, 1.0);

      vec4 view =
        uView *
        world;

      vNormal =
        normalize(
          uNormalMatrix *
          aNormal
        );

      vColor = aColor;
      vViewPosition = view.xyz;
      vWorldPosition = world.xyz;

      gl_Position =
        uProjection *
        view;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    uniform float uTime;
    uniform float uProminence;
    uniform float uSpecular;
    uniform float uRim;
    uniform float uEmissive;
    uniform float uAlpha;
    uniform float uSparkle;
    uniform float uTwinkle;
    uniform float uContrast;

    float hash31(vec3 p) {
      return fract(
        sin(
          dot(
            p,
            vec3(
              12.9898,
              78.233,
              37.719
            )
          )
        ) *
        43758.5453
      );
    }

    void main() {
      vec3 normal =
        normalize(vNormal);

      vec3 viewDirection =
        normalize(-vViewPosition);

      float facing =
        max(
          dot(
            normal,
            viewDirection
          ),
          0.0
        );

      float key =
        max(
          dot(
            normal,
            normalize(
              vec3(
                0.42,
                0.82,
                0.68
              )
            )
          ),
          0.0
        );

      float fill =
        max(
          dot(
            normal,
            normalize(
              vec3(
                -0.72,
                0.24,
                0.54
              )
            )
          ),
          0.0
        );

      float rim =
        pow(
          1.0 - facing,
          2.1
        );

      float specular =
        pow(
          max(
            dot(
              reflect(
                normalize(
                  vec3(
                    -0.42,
                    -0.82,
                    -0.68
                  )
                ),
                normal
              ),
              viewDirection
            ),
            0.0
          ),
          28.0
        );

      float seed =
        hash31(
          floor(
            (
              normal +
              vWorldPosition
            ) *
            18.0
          )
        );

      float sparkle =
        smoothstep(
          0.76,
          1.0,
          specular
        ) *
        (
          0.78 +
          sin(
            uTime * 1.85 +
            seed * 6.28318
          ) *
          0.22
        ) *
        uSparkle;

      float twinkle =
        1.0 +
        sin(
          uTime * 0.70 +
          seed * 6.28318
        ) *
        0.045 *
        uTwinkle;

      float diffuse =
        0.24 +
        key * 0.82 +
        fill * 0.30;

      diffuse =
        mix(
          diffuse,
          pow(diffuse, 0.68),
          clamp(
            uContrast - 1.0,
            0.0,
            0.7
          )
        );

      vec3 color =
        vColor *
        diffuse *
        twinkle;

      color +=
        vec3(
          1.0,
          0.96,
          0.82
        ) *
        specular *
        uSpecular;

      color +=
        vColor *
        rim *
        uRim;

      color +=
        vColor *
        uEmissive;

      color +=
        vec3(
          1.0,
          0.96,
          0.78
        ) *
        sparkle;

      color *=
        uProminence;

      float alpha =
        clamp(
          uAlpha *
          (
            0.72 +
            uProminence * 0.28
          ),
          0.10,
          1.0
        );

      gl_FragColor =
        vec4(
          color,
          alpha
        );
    }
  `;

  function compileShader(type, source) {
    const shader =
      state.gl.createShader(type);

    if (!shader) {
      throw new Error(
        "CRYSTALS_SHADER_CREATION_FAILED"
      );
    }

    state.gl.shaderSource(
      shader,
      source
    );

    state.gl.compileShader(shader);

    if (
      !state.gl.getShaderParameter(
        shader,
        state.gl.COMPILE_STATUS
      )
    ) {
      const message =
        state.gl.getShaderInfoLog(shader) ||
        "UNKNOWN_SHADER_ERROR";

      state.gl.deleteShader(shader);

      throw new Error(
        "CRYSTALS_SHADER_COMPILE_FAILED:" +
        message
      );
    }

    return shader;
  }

  function createProgram() {
    const gl = state.gl;

    const vertex = compileShader(
      gl.VERTEX_SHADER,
      vertexShaderSource
    );

    const fragment = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const program =
      gl.createProgram();

    if (!program) {
      throw new Error(
        "CRYSTALS_PROGRAM_CREATION_FAILED"
      );
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const message =
        gl.getProgramInfoLog(program) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(program);

      throw new Error(
        "CRYSTALS_PROGRAM_LINK_FAILED:" +
        message
      );
    }

    return program;
  }

  function subtract(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function cross(a, b) {
    return [
      a[1] * b[2] -
      a[2] * b[1],

      a[2] * b[0] -
      a[0] * b[2],

      a[0] * b[1] -
      a[1] * b[0]
    ];
  }

  function normalize(vector) {
    const length =
      Math.hypot(
        vector[0],
        vector[1],
        vector[2]
      ) ||
      1;

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function dot(a, b) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function createBuffer(data) {
    const buffer =
      state.gl.createBuffer();

    if (!buffer) {
      throw new Error(
        "CRYSTALS_BUFFER_CREATION_FAILED"
      );
    }

    state.gl.bindBuffer(
      state.gl.ARRAY_BUFFER,
      buffer
    );

    state.gl.bufferData(
      state.gl.ARRAY_BUFFER,
      data,
      state.gl.STATIC_DRAW
    );

    return buffer;
  }

  function buildGpuMesh(mesh) {
    return Object.freeze({
      position:
        createBuffer(mesh.positions),

      normal:
        createBuffer(mesh.normals),

      color:
        createBuffer(mesh.colors),

      vertexCount:
        mesh.vertexCount
    });
  }

  function createQuadMesh(rects) {
    const positions = [];
    const normals = [];
    const colors = [];

    rects.forEach((rect) => {
      const points = [
        [
          rect.x - rect.w,
          rect.y - rect.h,
          rect.z
        ],
        [
          rect.x + rect.w,
          rect.y - rect.h,
          rect.z
        ],
        [
          rect.x + rect.w,
          rect.y + rect.h,
          rect.z
        ],
        [
          rect.x - rect.w,
          rect.y - rect.h,
          rect.z
        ],
        [
          rect.x + rect.w,
          rect.y + rect.h,
          rect.z
        ],
        [
          rect.x - rect.w,
          rect.y + rect.h,
          rect.z
        ]
      ];

      points.forEach((point) => {
        positions.push(...point);
        normals.push(0, 0, 1);
        colors.push(...rect.color);
      });
    });

    return Object.freeze({
      positions:
        new Float32Array(positions),
      normals:
        new Float32Array(normals),
      colors:
        new Float32Array(colors),
      vertexCount:
        positions.length / 3
    });
  }

  function createBackgroundStarsMesh() {
    const rects = [];

    for (
      let index = 0;
      index < BACKGROUND.starCount;
      index += 1
    ) {
      const randomX =
        seeded(index + 11);

      const randomY =
        seeded(index + 23);

      const randomZ =
        seeded(index + 37);

      const randomSize =
        seeded(index + 41);

      const randomColor =
        seeded(index + 53);

      const x =
        (randomX - 0.5) * 8.2;

      const y =
        (randomY - 0.5) * 5.7;

      const z =
        -7.6 -
        randomZ * 2.2;

      const size =
        0.006 +
        randomSize * 0.020;

      const lift =
        0.38 +
        randomColor * 0.34;

      rects.push({
        x,
        y,
        z,
        w: size,
        h: size,
        color: [
          STAR_PALETTE.background[0] *
            lift,

          STAR_PALETTE.background[1] *
            lift,

          STAR_PALETTE.background[2] *
            lift
        ]
      });
    }

    return createQuadMesh(rects);
  }

  function createShootingStarMesh() {
    const rects = [];
    const segments = 7;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const progress =
        index /
        Math.max(1, segments - 1);

      const lift =
        1 -
        progress * 0.72;

      rects.push({
        x: progress * 0.42,
        y: -progress * 0.18,
        z: -7,

        w:
          0.075 *
          (
            1 -
            progress * 0.70
          ),

        h: 0.010,

        color: [
          STAR_PALETTE.shooting[0] *
            lift,

          STAR_PALETTE.shooting[1] *
            lift,

          STAR_PALETTE.shooting[2] *
            lift
        ]
      });
    }

    return createQuadMesh(rects);
  }

  function createDiamondStarMesh({
    points,
    radius,
    inner,
    depth,
    color
  }) {
    const vertices = [];
    const faces = [];

    function add(point) {
      vertices.push(point);
      return vertices.length - 1;
    }

    function face(a, b, c) {
      faces.push([a, b, c]);
    }

    const frontApex =
      add([0, 0, depth]);

    const rearApex =
      add([0, 0, -depth]);

    const outer = [];
    const frontRing = [];
    const rearRing = [];

    for (
      let index = 0;
      index < points * 2;
      index += 1
    ) {
      const pointed =
        index % 2 === 0;

      const angle =
        Math.PI * 2 * index /
        (points * 2) -
        Math.PI / 2;

      const currentRadius =
        pointed
          ? radius
          : inner;

      outer.push(
        add([
          Math.cos(angle) *
            currentRadius,

          Math.sin(angle) *
            currentRadius *
            0.78,

          pointed
            ? 0.04
            : -0.02
        ])
      );

      frontRing.push(
        add([
          Math.cos(angle) *
            currentRadius *
            0.58,

          Math.sin(angle) *
            currentRadius *
            0.78 *
            0.58,

          depth * 0.48
        ])
      );

      rearRing.push(
        add([
          Math.cos(angle) *
            currentRadius *
            0.56,

          Math.sin(angle) *
            currentRadius *
            0.78 *
            0.56,

          -depth * 0.46
        ])
      );
    }

    for (
      let index = 0;
      index < outer.length;
      index += 1
    ) {
      const next =
        (index + 1) %
        outer.length;

      face(
        frontApex,
        frontRing[index],
        frontRing[next]
      );

      face(
        frontRing[index],
        outer[index],
        outer[next]
      );

      face(
        frontRing[index],
        outer[next],
        frontRing[next]
      );

      face(
        rearApex,
        rearRing[next],
        rearRing[index]
      );

      face(
        rearRing[index],
        outer[next],
        outer[index]
      );

      face(
        rearRing[index],
        rearRing[next],
        outer[next]
      );
    }

    const positions = [];
    const normals = [];
    const colors = [];

    faces.forEach(
      (indices, faceIndex) => {
        const a =
          vertices[indices[0]];

        const b =
          vertices[indices[1]];

        const c =
          vertices[indices[2]];

        const normal =
          normalize(
            cross(
              subtract(b, a),
              subtract(c, a)
            )
          );

        const lift =
          0.84 +
          (faceIndex % 7) *
          0.034;

        [a, b, c].forEach((point) => {
          positions.push(...point);
          normals.push(...normal);

          colors.push(
            Math.min(
              color[0] * lift,
              1
            ),

            Math.min(
              color[1] * lift,
              1
            ),

            Math.min(
              color[2] * lift,
              1
            )
          );
        });
      }
    );

    return Object.freeze({
      positions:
        new Float32Array(positions),

      normals:
        new Float32Array(normals),

      colors:
        new Float32Array(colors),

      vertexCount:
        positions.length / 3
    });
  }

  function roomColor(wing) {
    if (wing === "north") {
      return STAR_PALETTE.roomNorth;
    }

    if (wing === "east") {
      return STAR_PALETTE.roomEast;
    }

    if (wing === "south") {
      return STAR_PALETTE.roomSouth;
    }

    return STAR_PALETTE.roomWest;
  }

  function buildMeshes() {
    state.meshes.set(
      "background-stars",
      buildGpuMesh(
        createBackgroundStarsMesh()
      )
    );

    state.meshes.set(
      "shooting-star",
      buildGpuMesh(
        createShootingStarMesh()
      )
    );

    WINGS.forEach((wing) => {
      state.meshes.set(
        `wing-${wing}`,
        buildGpuMesh(
          createDiamondStarMesh({
            points:
              QUALITY.cardinalSegments,

            radius: 0.72,
            inner: 0.30,
            depth: 0.42,
            color: STAR_PALETTE[wing]
          })
        )
      );

      state.meshes.set(
        `room-${wing}`,
        buildGpuMesh(
          createDiamondStarMesh({
            points:
              QUALITY.roomSegments,

            radius: 0.42,
            inner: 0.20,
            depth: 0.25,
            color: roomColor(wing)
          })
        )
      );
    });
  }

  function coordinateFor(index, count) {
    const five = [
      "CROWN",
      "RIGHT FIELD",
      "LOWER RIGHT",
      "LOWER LEFT",
      "LEFT FIELD"
    ];

    const four = [
      "CROWN",
      "RIGHT FIELD",
      "ROOT",
      "LEFT FIELD"
    ];

    return count === 5
      ? five[index] || ""
      : count === 4
        ? four[index] || ""
        : String(index + 1);
  }

  function createNode(
    id,
    type,
    options = {}
  ) {
    return {
      id,
      type,

      label:
        options.label || id,

      short:
        options.short || "",

      wing:
        options.wing || "",

      roomIndex:
        options.roomIndex || 0,

      coordinate:
        options.coordinate || "",

      meshKey:
        options.meshKey || "",

      baseMaterial:
        options.material ||
        "CARDINAL_IDLE",

      material:
        options.material ||
        "CARDINAL_IDLE",

      phase:
        options.phase || 0,

      visible: false,

      transform: {
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        sx: 1,
        sy: 1,
        sz: 1,
        prominence: 0,
        halo: 0,
        rotationSpeed: 0.08,
        float: 0
      },

      target: {
        x: 0,
        y: 0,
        z: 0,
        sx: 1,
        sy: 1,
        sz: 1,
        prominence: 0,
        halo: 0,
        rotationSpeed: 0.08,
        float: 0
      }
    };
  }

  function buildRegistry() {
    state.registry.set(
      "background-stars",
      createNode(
        "background-stars",
        "background",
        {
          meshKey:
            "background-stars",

          material:
            "BACKGROUND_STAR"
        }
      )
    );

    state.registry.set(
      "shooting-star",
      createNode(
        "shooting-star",
        "background",
        {
          meshKey:
            "shooting-star",

          material:
            "SHOOTING_STAR"
        }
      )
    );

    let roomCount = 0;

    WINGS.forEach(
      (wing, wingIndex) => {
        const copy =
          AXIS_COPY[wing];

        state.registry.set(
          wing,
          createNode(
            wing,
            "cardinal",
            {
              label: copy.label,
              short: copy.short,
              wing,
              meshKey:
                `wing-${wing}`,
              material:
                "CARDINAL_IDLE",
              phase:
                wingIndex * 1.37
            }
          )
        );

        DEFAULT_ROOMS[wing].forEach(
          (room, index) => {
            state.registry.set(
              room.id,
              createNode(
                room.id,
                "petal",
                {
                  label: room.label,
                  short: room.short,
                  wing,
                  roomIndex: index,
                  coordinate:
                    coordinateFor(
                      index,
                      DEFAULT_ROOMS[wing]
                        .length
                    ),
                  meshKey:
                    `room-${wing}`,
                  material:
                    "ROOM_IDLE",
                  phase:
                    wingIndex * 1.13 +
                    index * 0.47
                }
              )
            );

            roomCount += 1;
          }
        );
      }
    );

    emitReceipt({
      cardinalRegistryCount: 4,
      roomRegistryCount: roomCount
    });
  }

  function readControllerState() {
    const dataset =
      state.root.dataset || {};

    state.mode =
      String(
        dataset.compassMode ||
        MODES.COMPASS
      ).toUpperCase();

    state.orbitFocus =
      normalizeWing(
        dataset.orbitFocus ||
        dataset.selectedCardinal ||
        dataset.selectedWing
      );

    state.selectedCardinal =
      normalizeWing(
        dataset.selectedCardinal
      );

    state.selectedRoom =
      String(
        dataset.selectedRoom || ""
      );

    state.selectedDestinationType =
      String(
        dataset.selectedDestinationType ||
        ""
      )
        .trim()
        .toLowerCase();

    state.flowerExpanded =
      dataset.flowerExpanded === "true";

    state.windowState =
      normalizeWindowState(
        dataset.mirrorlandWindowState
      );

    state.mirrorlandSuppressed =
      state.windowState !==
      WINDOW_STATES.DORMANT;

    state.reducedMotion =
      (
        typeof globalThis.matchMedia ===
          "function" &&
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) ||
      dataset.reducedMotion === "true";

    state.targetOrbitAngle =
      ORBIT_ANGLES[
        state.orbitFocus
      ] || 0;
  }

  function rotate2D(point, angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);

    return [
      point[0] * cosine -
      point[1] * sine,

      point[0] * sine +
      point[1] * cosine,

      point[2] || 0
    ];
  }

  function orbitWingPosition(wing) {
    const base =
      wing === "north"
        ? [0, 1.32, -0.10]
        : wing === "east"
          ? [1.48, 0, -0.10]
          : wing === "south"
            ? [0, -1.32, -0.10]
            : [-1.48, 0, -0.10];

    return rotate2D(
      base,
      state.orbitAngle
    );
  }

  function roomPetalPosition(
    index,
    count
  ) {
    const radius =
      count === 4
        ? 1.24
        : 1.34;

    const angle =
      Math.PI * 2 * index /
      Math.max(1, count) -
      Math.PI / 2;

    return [
      Math.cos(angle) * radius,
      Math.sin(angle) *
        radius * 0.78,
      0.26
    ];
  }

  function setUniformScale(
    target,
    scale
  ) {
    target.sx = scale;
    target.sy = scale;
    target.sz = scale;

    return target;
  }

  function updateOrbitAngle(deltaTime) {
    if (state.reducedMotion) {
      state.orbitAngle =
        state.targetOrbitAngle;

      return;
    }

    let delta =
      state.targetOrbitAngle -
      state.orbitAngle;

    while (delta > Math.PI) {
      delta -= Math.PI * 2;
    }

    while (delta < -Math.PI) {
      delta += Math.PI * 2;
    }

    state.orbitAngle +=
      delta *
      Math.min(
        1,
        deltaTime * 4.8
      );
  }

  function topAuthorityWing() {
    let bestWing = "north";
    let bestY = -Infinity;

    WINGS.forEach((wing) => {
      const position =
        orbitWingPosition(wing);

      if (position[1] > bestY) {
        bestY = position[1];
        bestWing = wing;
      }
    });

    return bestWing;
  }

  function updateShootingStar(nowMs) {
    if (
      state.reducedMotion ||
      state.mirrorlandSuppressed
    ) {
      state.shootingStar.active = false;
      return;
    }

    if (!state.shootingStar.nextMs) {
      state.shootingStar.nextMs =
        nowMs +
        BACKGROUND
          .shootingStarIntervalMs;
    }

    if (
      !state.shootingStar.active &&
      nowMs >=
        state.shootingStar.nextMs
    ) {
      state.shootingStar.active = true;
      state.shootingStar.startMs =
        nowMs;
      state.shootingStar.seed += 1;
    }

    if (
      state.shootingStar.active &&
      nowMs -
        state.shootingStar.startMs >
        state.shootingStar.durationMs
    ) {
      state.shootingStar.active = false;

      state.shootingStar.nextMs =
        nowMs +
        BACKGROUND
          .shootingStarIntervalMs +
        (
          seeded(
            state.shootingStar.seed +
            201
          ) -
          0.5
        ) *
        BACKGROUND
          .shootingStarVarianceMs;
    }
  }

  function resetTargets() {
    state.registry.forEach((node) => {
      node.visible = false;
      node.material =
        node.baseMaterial;

      Object.assign(
        node.target,
        {
          x: 0,
          y: 0,
          z: -1,
          sx: 1,
          sy: 1,
          sz: 1,
          prominence: 0,
          halo: 0,
          rotationSpeed: 0.06,
          float: 0
        }
      );
    });
  }

  function updateTargets() {
    resetTargets();

    const topWing =
      topAuthorityWing();

    const focus =
      state.orbitFocus ||
      topWing ||
      "north";

    const mirrorlandOwnsScene =
      state.selectedDestinationType ===
        "mirrorland" ||
      state.mirrorlandSuppressed;

    const activeCluster =
      state.flowerExpanded &&
      state.selectedCardinal &&
      !mirrorlandOwnsScene;

    const background =
      state.registry.get(
        "background-stars"
      );

    if (background) {
      background.visible = true;

      Object.assign(
        background.target,
        {
          x: 0,
          y: 0,
          z: -2.2,
          sx: 1,
          sy: 1,
          sz: 1,
          prominence:
            mirrorlandOwnsScene
              ? 0.22
              : 0.46,
          halo: 0,
          rotationSpeed: 0,
          float: 0
        }
      );
    }

    const shooting =
      state.registry.get(
        "shooting-star"
      );

    if (shooting) {
      const active =
        state.shootingStar.active &&
        !mirrorlandOwnsScene &&
        !state.reducedMotion;

      const progress =
        active
          ? clamp(
              (
                performance.now() -
                state.shootingStar.startMs
              ) /
              state.shootingStar.durationMs,
              0,
              1
            )
          : 0;

      shooting.visible = active;

      Object.assign(
        shooting.target,
        {
          x:
            -2.2 +
            progress * 1.1,

          y:
            1.82 -
            progress * 0.54,

          z: -2.8,

          sx: 1,
          sy: 1,
          sz: 1,

          prominence:
            active
              ? Math.sin(
                  progress * Math.PI
                ) * 0.58
              : 0,

          halo: 0,
          rotationSpeed: 0,
          float: 0
        }
      );
    }

    if (mirrorlandOwnsScene) {
      WINGS.forEach((wing) => {
        const node =
          state.registry.get(wing);

        const position =
          orbitWingPosition(wing);

        node.visible = true;
        node.material =
          "CARDINAL_IDLE";

        Object.assign(
          node.target,
          setUniformScale(
            {
              x: position[0],
              y: position[1],
              z: -0.22,
              prominence: 0.34,
              halo: 0.18,
              rotationSpeed: 0.04,
              float: 0
            },
            QUALITY.cardinalScale *
              0.82
          )
        );
      });

      state.camera.nextEye = [
        0,
        0.78,
        6.15
      ];

      state.camera.nextTarget = [
        0,
        0,
        0
      ];

      return;
    }

    if (!activeCluster) {
      WINGS.forEach((wing) => {
        const node =
          state.registry.get(wing);

        const position =
          orbitWingPosition(wing);

        const focused =
          wing === topWing;

        const selected =
          wing ===
          state.selectedCardinal;

        node.visible = true;

        node.material =
          selected
            ? "CARDINAL_SELECTED"
            : focused
              ? "CARDINAL_FOCUSED"
              : "CARDINAL_IDLE";

        const scale =
          selected
            ? QUALITY
                .selectedCardinalScale
            : focused
              ? QUALITY
                  .focusedCardinalScale
              : QUALITY.cardinalScale;

        Object.assign(
          node.target,
          setUniformScale(
            {
              x: position[0],
              y: position[1],
              z:
                focused || selected
                  ? 0.34
                  : position[2],

              prominence:
                selected
                  ? 1.05
                  : focused
                    ? 1
                    : 0.74,

              halo:
                selected
                  ? 1.08
                  : focused
                    ? 1
                    : 0.52,

              rotationSpeed:
                selected
                  ? 0.18
                  : focused
                    ? 0.16
                    : 0.09,

              float:
                focused || selected
                  ? 0.012
                  : 0.006
            },
            scale
          )
        );
      });

      state.camera.nextEye = [
        0,
        0.80,
        6.05
      ];

      state.camera.nextTarget = [
        0,
        0,
        0
      ];

      return;
    }

    const rooms =
      DEFAULT_ROOMS[
        state.selectedCardinal ||
        focus
      ] || [];

    rooms.forEach((room, index) => {
      const node =
        state.registry.get(room.id);

      if (!node) return;

      const position =
        roomPetalPosition(
          index,
          rooms.length
        );

      const selected =
        state.selectedRoom === room.id;

      node.visible = true;

      node.material =
        selected
          ? "ROOM_SELECTED"
          : "ROOM_IDLE";

      Object.assign(
        node.target,
        setUniformScale(
          {
            x: position[0],
            y: position[1] - 0.14,
            z:
              selected
                ? 0.86
                : 0.42,

            prominence:
              selected
                ? 1
                : 0.90,

            halo:
              selected
                ? 1.02
                : 0.68,

            rotationSpeed:
              selected
                ? 0.12
                : 0.08,

            float:
              selected
                ? 0.012
                : 0.006
          },
          selected
            ? QUALITY.selectedRoomScale
            : QUALITY.roomScale
        )
      );
    });

    state.camera.nextEye = [
      0,
      0.66,
      5.85
    ];

    state.camera.nextTarget = [
      0,
      0.03,
      0
    ];
  }

  function lerpValue(a, b, amount) {
    return a + (b - a) * amount;
  }

  function updateTransforms(deltaTime) {
    const amount =
      state.reducedMotion
        ? 1
        : Math.min(
            1,
            deltaTime * 6.2
          );

    state.registry.forEach((node) => {
      [
        "x",
        "y",
        "z",
        "sx",
        "sy",
        "sz",
        "prominence",
        "halo",
        "rotationSpeed",
        "float"
      ].forEach((key) => {
        node.transform[key] =
          lerpValue(
            node.transform[key],
            node.target[key],
            amount
          );
      });

      if (
        state.reducedMotion ||
        node.type === "background"
      ) {
        node.transform.rx = 0;
        node.transform.ry = 0;
        return;
      }

      node.transform.rz +=
        deltaTime *
        node.transform.rotationSpeed;

      node.transform.ry =
        Math.sin(
          state.time * 0.42 +
          node.phase
        ) *
        QUALITY.maxYaw *
        Math.max(
          0.35,
          node.transform.prominence
        );

      node.transform.rx =
        Math.sin(
          state.time * 0.31 +
          node.phase * 0.73
        ) *
        QUALITY.maxPitch *
        Math.max(
          0.35,
          node.transform.prominence
        );
    });

    for (
      let index = 0;
      index < 3;
      index += 1
    ) {
      state.camera.eye[index] =
        lerpValue(
          state.camera.eye[index],
          state.camera.nextEye[index],
          amount
        );

      state.camera.target[index] =
        lerpValue(
          state.camera.target[index],
          state.camera.nextTarget[index],
          amount
        );
    }
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(a, b) {
    const output =
      new Array(16).fill(0);

    for (
      let row = 0;
      row < 4;
      row += 1
    ) {
      for (
        let column = 0;
        column < 4;
        column += 1
      ) {
        for (
          let index = 0;
          index < 4;
          index += 1
        ) {
          output[
            column * 4 + row
          ] +=
            a[
              index * 4 + row
            ] *
            b[
              column * 4 + index
            ];
        }
      }
    }

    return output;
  }

  function translate4(x, y, z) {
    const matrix = identity4();

    matrix[12] = x;
    matrix[13] = y;
    matrix[14] = z;

    return matrix;
  }

  function scale4(x, y, z) {
    const matrix = identity4();

    matrix[0] = x;
    matrix[5] = y;
    matrix[10] = z;

    return matrix;
  }

  function rotateX4(angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);

    return [
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateY4(angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);

    return [
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateZ4(angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);

    return [
      cosine, sine, 0, 0,
      -sine, cosine, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function perspective4(
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const factor =
      1 /
      Math.tan(fieldOfView / 2);

    const inverse =
      1 / (near - far);

    return [
      factor / aspect,
      0,
      0,
      0,

      0,
      factor,
      0,
      0,

      0,
      0,
      (far + near) * inverse,
      -1,

      0,
      0,
      2 * far * near * inverse,
      0
    ];
  }

  function lookAt4(eye, center, up) {
    const z =
      normalize(
        subtract(eye, center)
      );

    const x =
      normalize(
        cross(up, z)
      );

    const y =
      cross(z, x);

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot(x, eye),
      -dot(y, eye),
      -dot(z, eye),
      1
    ];
  }

  function normalMatrix3(model) {
    return [
      model[0],
      model[1],
      model[2],

      model[4],
      model[5],
      model[6],

      model[8],
      model[9],
      model[10]
    ];
  }

  function modelMatrix(node) {
    const transform =
      node.transform;

    const floatY =
      !state.reducedMotion &&
      node.type !== "background"
        ? Math.sin(
            state.time * 0.95 +
            node.roomIndex * 0.72 +
            node.phase
          ) *
          transform.float
        : 0;

    return multiply4(
      translate4(
        transform.x,
        transform.y + floatY,
        transform.z
      ),

      multiply4(
        rotateZ4(transform.rz),

        multiply4(
          rotateY4(transform.ry),

          multiply4(
            rotateX4(transform.rx),

            scale4(
              transform.sx,
              transform.sy,
              transform.sz
            )
          )
        )
      )
    );
  }

  function transformPoint4(matrix, point) {
    return [
      matrix[0] * point[0] +
      matrix[4] * point[1] +
      matrix[8] * point[2] +
      matrix[12] * point[3],

      matrix[1] * point[0] +
      matrix[5] * point[1] +
      matrix[9] * point[2] +
      matrix[13] * point[3],

      matrix[2] * point[0] +
      matrix[6] * point[1] +
      matrix[10] * point[2] +
      matrix[14] * point[3],

      matrix[3] * point[0] +
      matrix[7] * point[1] +
      matrix[11] * point[2] +
      matrix[15] * point[3]
    ];
  }

  function projectNode(node) {
    if (
      !state.view ||
      !state.projection
    ) {
      return null;
    }

    const modelView =
      multiply4(
        state.view,
        modelMatrix(node)
      );

    const projection =
      multiply4(
        state.projection,
        modelView
      );

    const clip =
      transformPoint4(
        projection,
        [0, 0, 0, 1]
      );

    if (!clip[3]) {
      return null;
    }

    const x =
      clip[0] / clip[3];

    const y =
      clip[1] / clip[3];

    if (
      x < -1.30 ||
      x > 1.30 ||
      y < -1.30 ||
      y > 1.30
    ) {
      return null;
    }

    return {
      x:
        ((x + 1) / 2) *
        state.width /
        state.pixelRatio,

      y:
        ((1 - y) / 2) *
        state.height /
        state.pixelRatio
    };
  }

  function semanticElementForNode(node) {
    if (node.type === "cardinal") {
      return $(
        `[data-compass-cardinal][data-wing="${node.wing}"]`,
        state.root
      );
    }

    if (node.type === "petal") {
      return $(
        `[data-compass-room][data-room-id="${node.id}"]`,
        state.root
      );
    }

    return null;
  }

  function syncSemanticNode(node) {
    if (
      node.type !== "cardinal" &&
      node.type !== "petal"
    ) {
      return;
    }

    const element =
      semanticElementForNode(node);

    if (
      !element ||
      !state.surface.contains(element)
    ) {
      return;
    }

    const screen =
      node.visible &&
      node.transform.prominence >= 0.08
        ? projectNode(node)
        : null;

    if (!screen) {
      element.style.opacity = "0";
      element.style.pointerEvents =
        "none";
      return;
    }

    const spans =
      element.querySelectorAll("span");

    if (spans[0]) {
      spans[0].textContent =
        node.label;
    }

    if (spans[1]) {
      spans[1].textContent =
        node.short;
    }

    element.style.left =
      `${screen.x}px`;

    element.style.top =
      `${screen.y}px`;

    element.style.right = "auto";
    element.style.bottom = "auto";

    element.style.transform =
      "translate(-50%, -50%) scale(.8)";

    element.style.opacity =
      String(
        clamp(
          node.transform.prominence,
          0,
          1
        )
      );

    element.style.pointerEvents =
      state.mirrorlandSuppressed
        ? "none"
        : node.transform.prominence >= 0.18
          ? "auto"
          : "none";

    element.style.zIndex =
      node.type === "petal"
        ? "5"
        : "4";
  }

  function syncSemanticObjects() {
    state.registry.forEach(
      syncSemanticNode
    );
  }

  function eventElement(target) {
    if (target instanceof Element) {
      return target;
    }

    if (
      target &&
      target.parentElement instanceof Element
    ) {
      return target.parentElement;
    }

    return null;
  }

  function semanticOwnerForTarget(target) {
    const element =
      eventElement(target);

    return element
      ? element.closest(
          SEMANTIC_CONTROL_SELECTOR
        )
      : null;
  }

  function classifyGesture(start, end) {
    const dx =
      end.x - start.x;

    const dy =
      end.y - start.y;

    const absoluteX =
      Math.abs(dx);

    const absoluteY =
      Math.abs(dy);

    const distance =
      Math.hypot(dx, dy);

    if (
      distance <=
      GESTURE.maximumTapDistancePx
    ) {
      return {
        type: "tap",
        dx,
        dy,
        distance
      };
    }

    if (
      distance <
      GESTURE.minimumSwipeDistancePx
    ) {
      return {
        type: "ambiguous",
        dx,
        dy,
        distance
      };
    }

    if (
      absoluteX >
      absoluteY *
      GESTURE.directionalDominanceRatio
    ) {
      return {
        type: "swipe",
        axis: "horizontal",
        raw:
          dx > 0
            ? "swipeRight"
            : "swipeLeft",
        dx,
        dy,
        distance
      };
    }

    if (
      absoluteY >
      absoluteX *
      GESTURE.directionalDominanceRatio
    ) {
      return {
        type: "swipe",
        axis: "vertical",
        raw:
          dy > 0
            ? "swipeDown"
            : "swipeUp",
        dx,
        dy,
        distance
      };
    }

    return {
      type: "ambiguous",
      dx,
      dy,
      distance
    };
  }

  function findHitAt(clientX, clientY) {
    if (state.mirrorlandSuppressed) {
      return null;
    }

    const rect =
      state.surface
        .getBoundingClientRect();

    const pointerX =
      clientX - rect.left;

    const pointerY =
      clientY - rect.top;

    const radius =
      Math.max(
        46,
        Math.min(
          80,
          rect.width * 0.090
        )
      );

    let best = null;
    let bestDistance = Infinity;

    state.registry.forEach((node) => {
      if (
        node.type === "background" ||
        !node.visible ||
        node.transform.prominence < 0.12
      ) {
        return;
      }

      const screen =
        projectNode(node);

      if (!screen) return;

      const distance =
        Math.hypot(
          pointerX - screen.x,
          pointerY - screen.y
        );

      if (
        distance <= radius &&
        distance < bestDistance
      ) {
        best = node;
        bestDistance = distance;
      }
    });

    return best;
  }

  function releasePointerCapture(event) {
    try {
      if (
        event.currentTarget &&
        typeof event.currentTarget
          .hasPointerCapture ===
          "function" &&
        event.currentTarget.hasPointerCapture(
          event.pointerId
        )
      ) {
        event.currentTarget.releasePointerCapture(
          event.pointerId
        );
      }
    } catch (_) {
      /* Capture release is optional. */
    }
  }

  function clearPointer(
    event,
    action,
    extra = {}
  ) {
    releasePointerCapture(event);

    state.pointer = null;

    emitReceipt({
      lastPointerAction: action,
      activePointerTerritory: "",
      activePointerNode: "",
      ...extra
    });
  }

  function requestAxisSwipe(
    axis,
    gesture
  ) {
    const controller =
      globalThis.DGB_COMPASS_CONTROLLER;

    const available =
      !!controller &&
      typeof controller
        .requestAxisSwipe === "function";

    if (available) {
      controller.requestAxisSwipe(axis);
    }

    emitReceipt({
      lastPointerAction:
        available
          ? `empty-scene-${axis}-swipe`
          : "controller-axis-api-unavailable",

      gestureType: gesture.type,
      gestureDx: gesture.dx,
      gestureDy: gesture.dy,

      failureReason:
        available
          ? null
          : "CONTROLLER_AXIS_API_UNAVAILABLE"
    });
  }

  function requestNodeSelection(
    node,
    gesture
  ) {
    const controller =
      globalThis.DGB_COMPASS_CONTROLLER;

    let available = false;

    if (
      controller &&
      node.type === "cardinal" &&
      typeof controller
        .requestCardinalSelection ===
        "function"
    ) {
      controller.requestCardinalSelection(
        node.wing,
        "visual-cardinal-tap"
      );

      available = true;
    }

    if (
      controller &&
      node.type === "petal" &&
      typeof controller
        .requestRoomSelection ===
        "function"
    ) {
      controller.requestRoomSelection(
        node.id,
        "visual-room-tap"
      );

      available = true;
    }

    emitReceipt({
      lastPointerAction:
        available
          ? "rendered-node-selection-requested"
          : "controller-selection-api-unavailable",

      gestureType: gesture.type,
      gestureDx: gesture.dx,
      gestureDy: gesture.dy,

      failureReason:
        available
          ? null
          : "CONTROLLER_SELECTION_API_UNAVAILABLE"
    });
  }

  function handlePointerDown(event) {
    const semanticOwner =
      semanticOwnerForTarget(
        event.target
      );

    if (semanticOwner) {
      state.pointer = null;

      emitReceipt({
        lastPointerAction:
          "semantic-pointer-reserved",
        activePointerTerritory:
          "semantic",
        activePointerNode: ""
      });

      return;
    }

    if (state.mirrorlandSuppressed) {
      clearPointer(
        event,
        "scene-pointer-held-during-mirrorland"
      );

      return;
    }

    const node =
      findHitAt(
        event.clientX,
        event.clientY
      );

    if (node) {
      state.pointer = {
        id: event.pointerId,
        territory: "rendered-node",
        node,
        x: event.clientX,
        y: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY
      };

      emitReceipt({
        lastPointerAction:
          "rendered-node-pointer-started",

        activePointerTerritory:
          "rendered-node",

        activePointerNode:
          node.id
      });

      return;
    }

    try {
      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    } catch (_) {
      /* Capture is optional. */
    }

    state.pointer = {
      id: event.pointerId,
      territory: "empty-scene",
      node: null,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY
    };

    emitReceipt({
      lastPointerAction:
        "empty-scene-pointer-started",

      activePointerTerritory:
        "empty-scene",

      activePointerNode: ""
    });
  }

  function handlePointerMove(event) {
    if (
      !state.pointer ||
      event.pointerId !==
        state.pointer.id
    ) {
      return;
    }

    if (state.mirrorlandSuppressed) {
      clearPointer(
        event,
        "scene-pointer-cancelled-during-mirrorland"
      );

      return;
    }

    state.pointer.lastX =
      event.clientX;

    state.pointer.lastY =
      event.clientY;

    if (
      state.pointer.territory ===
        "empty-scene" &&
      Math.hypot(
        event.clientX -
          state.pointer.x,

        event.clientY -
          state.pointer.y
      ) >=
        GESTURE.minimumSwipeDistancePx
    ) {
      event.preventDefault();
    }
  }

  function handlePointerUp(event) {
    if (
      !state.pointer ||
      event.pointerId !==
        state.pointer.id
    ) {
      return;
    }

    const pointer =
      state.pointer;

    releasePointerCapture(event);
    state.pointer = null;

    const gesture =
      classifyGesture(
        pointer,
        {
          x: event.clientX,
          y: event.clientY
        }
      );

    if (state.mirrorlandSuppressed) {
      emitReceipt({
        lastPointerAction:
          "pointer-completion-held-during-mirrorland",

        gestureType: gesture.type,
        gestureDx: gesture.dx,
        gestureDy: gesture.dy
      });

      return;
    }

    if (
      pointer.territory ===
      "rendered-node"
    ) {
      if (
        gesture.type === "tap" &&
        pointer.node
      ) {
        requestNodeSelection(
          pointer.node,
          gesture
        );

        return;
      }

      emitReceipt({
        lastPointerAction:
          gesture.type === "swipe"
            ? "rendered-node-drag-suppressed"
            : "rendered-node-gesture-ambiguous",

        gestureType: gesture.type,
        gestureDx: gesture.dx,
        gestureDy: gesture.dy
      });

      return;
    }

    if (
      pointer.territory !==
      "empty-scene"
    ) {
      return;
    }

    if (gesture.type === "swipe") {
      event.preventDefault();

      requestAxisSwipe(
        gesture.axis,
        gesture
      );

      return;
    }

    emitReceipt({
      lastPointerAction:
        gesture.type === "tap"
          ? "empty-scene-tap"
          : "ambiguous-empty-scene-gesture",

      gestureType: gesture.type,
      gestureDx: gesture.dx,
      gestureDy: gesture.dy
    });
  }

  function handlePointerCancel(event) {
    clearPointer(
      event,
      "scene-pointer-cancelled"
    );
  }

  function handleLostPointerCapture(event) {
    if (
      state.pointer &&
      event.pointerId ===
        state.pointer.id
    ) {
      state.pointer = null;

      emitReceipt({
        lastPointerAction:
          "empty-scene-pointer-capture-lost",

        activePointerTerritory: "",
        activePointerNode: ""
      });
    }
  }

  function bindPointerBridge() {
    state.surface =
      state.canvas.closest(
        "[data-compass-scene]"
      ) ||
      state.canvas.closest(
        ".compass-scene"
      ) ||
      state.scene ||
      state.mount ||
      state.root;

    if (!state.surface) {
      throw new Error(
        "MISSING_COMPASS_GESTURE_SURFACE"
      );
    }

    state.surface.style.touchAction =
      "none";

    state.surface.style.overscrollBehavior =
      "contain";

    state.surface.addEventListener(
      "pointerdown",
      handlePointerDown,
      { passive: false }
    );

    state.surface.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: false }
    );

    state.surface.addEventListener(
      "pointerup",
      handlePointerUp,
      { passive: false }
    );

    state.surface.addEventListener(
      "pointercancel",
      handlePointerCancel,
      { passive: false }
    );

    state.surface.addEventListener(
      "lostpointercapture",
      handleLostPointerCapture,
      { passive: true }
    );

    emitReceipt({
      pointerBridgeStatus:
        "bound-with-pointerdown-territory-lock"
    });
  }

  function resize() {
    const rect =
      state.canvas
        .getBoundingClientRect();

    const ratio =
      Math.min(
        globalThis.devicePixelRatio || 1,
        QUALITY.devicePixelRatioCap
      );

    const width =
      Math.max(
        1,
        Math.floor(
          rect.width * ratio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height * ratio
        )
      );

    if (
      state.canvas.width !== width ||
      state.canvas.height !== height
    ) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.pixelRatio = ratio;
    state.width = width;
    state.height = height;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function bindAttribute(
    buffer,
    location
  ) {
    if (location < 0) return;

    state.gl.bindBuffer(
      state.gl.ARRAY_BUFFER,
      buffer
    );

    state.gl.enableVertexAttribArray(
      location
    );

    state.gl.vertexAttribPointer(
      location,
      3,
      state.gl.FLOAT,
      false,
      0,
      0
    );
  }

  function applyMaterial(
    materialName,
    prominence
  ) {
    const material =
      MATERIALS[materialName] ||
      MATERIALS.CARDINAL_IDLE;

    state.gl.uniform1f(
      state.uniforms.prominence,
      prominence
    );

    state.gl.uniform1f(
      state.uniforms.specular,
      material.specular
    );

    state.gl.uniform1f(
      state.uniforms.rim,
      material.rim
    );

    state.gl.uniform1f(
      state.uniforms.emissive,
      material.emissive
    );

    state.gl.uniform1f(
      state.uniforms.alpha,
      material.alpha
    );

    state.gl.uniform1f(
      state.uniforms.sparkle,
      state.reducedMotion
        ? 0
        : material.sparkle
    );

    state.gl.uniform1f(
      state.uniforms.twinkle,
      state.reducedMotion
        ? 0
        : 1
    );

    state.gl.uniform1f(
      state.uniforms.contrast,
      material.contrast
    );
  }

  function drawNode(node) {
    if (
      !node.visible ||
      node.transform.prominence < 0.04
    ) {
      return 0;
    }

    const mesh =
      state.meshes.get(
        node.meshKey
      );

    if (!mesh) {
      return 0;
    }

    bindAttribute(
      mesh.position,
      state.attributes.position
    );

    bindAttribute(
      mesh.normal,
      state.attributes.normal
    );

    bindAttribute(
      mesh.color,
      state.attributes.color
    );

    const model =
      modelMatrix(node);

    state.gl.uniformMatrix4fv(
      state.uniforms.model,
      false,
      new Float32Array(model)
    );

    state.gl.uniformMatrix4fv(
      state.uniforms.view,
      false,
      new Float32Array(
        state.view
      )
    );

    state.gl.uniformMatrix4fv(
      state.uniforms.projection,
      false,
      new Float32Array(
        state.projection
      )
    );

    state.gl.uniformMatrix3fv(
      state.uniforms.normalMatrix,
      false,
      new Float32Array(
        normalMatrix3(model)
      )
    );

    state.gl.uniform1f(
      state.uniforms.time,
      state.time
    );

    applyMaterial(
      node.material,
      node.transform.prominence
    );

    state.gl.drawArrays(
      state.gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    return 1;
  }

  function render(now) {
    if (!state.running) {
      return;
    }

    const seconds = now * 0.001;

    const deltaTime =
      state.lastTime
        ? Math.min(
            0.05,
            seconds - state.lastTime
          )
        : 0.016;

    state.lastTime = seconds;
    state.time = seconds;

    readControllerState();
    updateShootingStar(now);
    updateOrbitAngle(deltaTime);
    updateTargets();
    updateTransforms(deltaTime);
    resize();

    const aspect =
      state.width /
      Math.max(
        1,
        state.height
      );

    state.view =
      lookAt4(
        state.camera.eye,
        state.camera.target,
        [0, 1, 0]
      );

    state.projection =
      perspective4(
        Math.PI /
        (
          aspect < 0.8
            ? 4.45
            : 4.85
        ),
        aspect,
        0.1,
        60
      );

    const gl = state.gl;

    gl.clearColor(
      0.015,
      0.018,
      0.034,
      0
    );

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    gl.useProgram(state.program);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    let drawCalls = 0;
    let visibleObjectCount = 0;

    state.registry.forEach((node) => {
      if (
        node.visible &&
        node.transform.prominence > 0.04
      ) {
        visibleObjectCount +=
          node.type === "background"
            ? 0
            : 1;

        drawCalls +=
          drawNode(node);
      }
    });

    syncSemanticObjects();

    const error = gl.getError();

    emitReceipt({
      rendererInitialized: true,
      renderLoopStatus:
        state.reducedMotion
          ? "active-reduced-motion"
          : "active",

      drawCallsLastFrame:
        drawCalls,

      visibleObjectCount,

      glError:
        error === gl.NO_ERROR
          ? "NO_ERROR"
          : String(error),

      failureReason:
        error === gl.NO_ERROR
          ? null
          : `WEBGL_ERROR_${error}`
    });

    if (error !== gl.NO_ERROR) {
      fail(
        `CRYSTALS_WEBGL_ERROR_${error}`
      );

      return;
    }

    state.raf =
      requestAnimationFrame(render);
  }

  function dispose() {
    state.running = false;

    cancelAnimationFrame(state.raf);

    if (state.surface) {
      state.surface.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      state.surface.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      state.surface.removeEventListener(
        "pointerup",
        handlePointerUp
      );

      state.surface.removeEventListener(
        "pointercancel",
        handlePointerCancel
      );

      state.surface.removeEventListener(
        "lostpointercapture",
        handleLostPointerCapture
      );
    }

    state.pointer = null;

    if (state.gl) {
      state.meshes.forEach((mesh) => {
        state.gl.deleteBuffer(
          mesh.position
        );

        state.gl.deleteBuffer(
          mesh.normal
        );

        state.gl.deleteBuffer(
          mesh.color
        );
      });

      if (state.program) {
        state.gl.deleteProgram(
          state.program
        );
      }
    }

    state.meshes.clear();
    state.registry.clear();

    emitReceipt({
      rendererInitialized: false,
      renderLoopStatus: "disposed",
      pointerBridgeStatus: "disposed"
    });
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CRYSTALS =
      Object.freeze({
        contract: CONTRACT,

        receipt() {
          return Object.freeze({
            ...RECEIPT
          });
        },

        requestAxisSwipe(axis) {
          const controller =
            globalThis
              .DGB_COMPASS_CONTROLLER;

          if (
            controller &&
            typeof controller
              .requestAxisSwipe ===
              "function"
          ) {
            return controller
              .requestAxisSwipe(axis);
          }

          return false;
        },

        requestDirectionSelection(
          direction
        ) {
          const controller =
            globalThis
              .DGB_COMPASS_CONTROLLER;

          if (
            controller &&
            typeof controller
              .requestDirectionSelection ===
              "function"
          ) {
            return controller
              .requestDirectionSelection(
                direction
              );
          }

          return false;
        },

        start() {
          if (
            !state.running &&
            state.gl &&
            state.program
          ) {
            state.running = true;
            state.raf =
              requestAnimationFrame(render);
          }
        },

        stop() {
          state.running = false;
          cancelAnimationFrame(state.raf);

          emitReceipt({
            renderLoopStatus: "stopped"
          });
        },

        dispose
      });
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();

        fail("WEBGL_CONTEXT_LOST");
      }
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        fail(
          "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED"
        );
      }
    );
  }

  function initializeDom() {
    state.root = first([
      "[data-compass-root]",
      "#compass",
      "main"
    ]);

    if (!state.root) {
      throw new Error(
        "MISSING_COMPASS_ROOT"
      );
    }

    state.scene = first(
      [
        "[data-compass-scene]",
        ".compass-scene"
      ],
      state.root
    );

    state.mount = first(
      [
        "[data-compass-crystals-mount]",
        ".compass-scene__visual"
      ],
      state.root
    );

    if (!state.scene) {
      throw new Error(
        "MISSING_COMPASS_SCENE"
      );
    }

    if (!state.mount) {
      throw new Error(
        "MISSING_COMPASS_CRYSTALS_MOUNT"
      );
    }

    state.canvas = ensureCanvas();
  }

  function initializeWebGl() {
    state.gl = createContext();

    if (!state.gl) {
      throw new Error(
        "WEBGL_CONTEXT_UNAVAILABLE"
      );
    }

    bindContextLifecycle();

    state.gl.enable(
      state.gl.DEPTH_TEST
    );

    state.gl.depthFunc(
      state.gl.LEQUAL
    );

    state.gl.enable(
      state.gl.BLEND
    );

    state.gl.blendFunc(
      state.gl.SRC_ALPHA,
      state.gl.ONE_MINUS_SRC_ALPHA
    );

    state.gl.disable(
      state.gl.CULL_FACE
    );

    state.program =
      createProgram();

    state.attributes = {
      position:
        state.gl.getAttribLocation(
          state.program,
          "aPosition"
        ),

      normal:
        state.gl.getAttribLocation(
          state.program,
          "aNormal"
        ),

      color:
        state.gl.getAttribLocation(
          state.program,
          "aColor"
        )
    };

    state.uniforms = {
      model:
        state.gl.getUniformLocation(
          state.program,
          "uModel"
        ),

      view:
        state.gl.getUniformLocation(
          state.program,
          "uView"
        ),

      projection:
        state.gl.getUniformLocation(
          state.program,
          "uProjection"
        ),

      normalMatrix:
        state.gl.getUniformLocation(
          state.program,
          "uNormalMatrix"
        ),

      time:
        state.gl.getUniformLocation(
          state.program,
          "uTime"
        ),

      prominence:
        state.gl.getUniformLocation(
          state.program,
          "uProminence"
        ),

      specular:
        state.gl.getUniformLocation(
          state.program,
          "uSpecular"
        ),

      rim:
        state.gl.getUniformLocation(
          state.program,
          "uRim"
        ),

      emissive:
        state.gl.getUniformLocation(
          state.program,
          "uEmissive"
        ),

      alpha:
        state.gl.getUniformLocation(
          state.program,
          "uAlpha"
        ),

      sparkle:
        state.gl.getUniformLocation(
          state.program,
          "uSparkle"
        ),

      twinkle:
        state.gl.getUniformLocation(
          state.program,
          "uTwinkle"
        ),

      contrast:
        state.gl.getUniformLocation(
          state.program,
          "uContrast"
        )
    };

    buildMeshes();
    buildRegistry();
  }

  function init() {
    exposeApi();

    try {
      initializeDom();
      initializeWebGl();
      bindPointerBridge();

      state.shootingStar.nextMs =
        performance.now() +
        BACKGROUND
          .shootingStarIntervalMs;

      state.running = true;

      state.raf =
        requestAnimationFrame(render);

      emitReceipt({
        rendererInitialized: true,
        renderLoopStatus: "active",
        pointerBridgeStatus:
          "bound-with-pointerdown-territory-lock",
        failureReason: null
      });
    } catch (error) {
      fail(
        error && error.message
          ? error.message
          : String(error)
      );
    }
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
