/* /assets/compass/compass.crystals.js
   DGB Compass — Celestial atmosphere, cardinal stars, path stars,
   constellation gestures, and semantic synchronization.

   Scope: compass.crystals.js only.

   Mirrorland boundary:
   - no Mirrorland mesh;
   - no Mirrorland registry node;
   - no Mirrorland hit testing;
   - no Mirrorland semantic synchronization;
   - no Mirrorland review-object dependency;
   - no mutation of the Mirrorland threshold element;
   - no mutation of Mirrorland Window datasets or controls.

   Mirrorland visual ownership belongs exclusively to:
   /assets/compass/compass.mirrorland-window.js
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_CRYSTALS_CONSTELLATION_PATH_RENDERER_TNT_v3",
    file: "/assets/compass/compass.crystals.js",
    role: "CARDINAL_PETAL_ATMOSPHERE_RENDERER_ONLY",
    mirrorlandRendererFile:
      "/assets/compass/compass.mirrorland-window.js",
    mirrorlandMeshAuthorized: false,
    mirrorlandRegistryAuthorized: false,
    mirrorlandSemanticSyncAuthorized: false,
    mirrorlandHitTestingAuthorized: false,
    mirrorlandReviewObjectDependency: false,
    controllerAuthority: false,
    navigationAuthority: false,
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
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

  const MIRRORLAND_WINDOW_STATES = Object.freeze({
    DORMANT: "dormant",
    REVEALING: "revealing",
    FOCUSED: "focused",
    WITHDRAWING: "withdrawing",
    NAVIGATING: "navigating"
  });

  const DIAGNOSTIC_MODES = Object.freeze({
    NONE: "NONE",
    OPAQUE_UNLIT: "OPAQUE_UNLIT",
    NORMALS: "NORMAL_VISUALIZATION",
    FACET_ONLY: "FACET_LIGHTING_ONLY",
    HALO_DISABLED: "HALO_DISABLED",
    CARDINAL_ONLY: "CARDINAL_ISOLATION",
    ROOM_ONLY: "ROOM_ISOLATION",
    BACKGROUND_ONLY: "BACKGROUND_ISOLATION"
  });

  const BACKGROUND = Object.freeze({
    enabled: true,
    starCount: 90,
    twinkle: true,
    shootingStars: true,
    shootingStarIntervalMs: 7000,
    shootingStarVarianceMs: 2200
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
    rendererRole: CONTRACT.role,

    rendererInitialized: false,
    shaderProgramsLinked: false,

    mirrorlandMeshLoaded: false,
    mirrorlandDrawn: false,
    mirrorlandRegistryNodePresent: false,
    mirrorlandSemanticSyncEnabled: false,
    mirrorlandHitTestingEnabled: false,
    mirrorlandReviewObjectDependency: false,
    mirrorlandThresholdMutationCount: 0,
    centerReservedForMirrorlandThreshold: true,

    backgroundStarsEnabled:
      BACKGROUND.enabled,

    backgroundStarCount:
      BACKGROUND.starCount,

    backgroundStarsInitialized:
      false,

    backgroundTwinkleEnabled:
      BACKGROUND.twinkle,

    shootingStarsEnabled:
      BACKGROUND.shootingStars,

    shootingStarIntervalMs:
      BACKGROUND.shootingStarIntervalMs,

    shootingStarActive:
      false,

    backgroundDrawCallsLastFrame:
      0,

    reducedMotionBackgroundSuppressed:
      false,

    cardinalMeshCount:
      0,

    roomMeshCount:
      0,

    cardinalRegistryCount:
      0,

    roomRegistryCount:
      0,

    drawCallsLastFrame:
      0,

    visibleObjectCount:
      0,

    cameraOrientation:
      "pending",

    activeMode:
      "pending",

    activeDestination:
      "",

    mirrorlandWindowState:
      MIRRORLAND_WINDOW_STATES.DORMANT,

    compassInteractionSuppressedForMirrorland:
      false,

    diagnosticModeAvailable:
      true,

    diagnosticMode:
      DIAGNOSTIC_MODES.NONE,

    glError:
      "not-checked",

    rootStatus:
      "pending",

    sceneStatus:
      "pending",

    mountStatus:
      "pending",

    canvasStatus:
      "pending",

    webglContextStatus:
      "pending",

    shaderStatus:
      "pending",

    programStatus:
      "pending",

    meshBuildStatus:
      "pending",

    registryBuildStatus:
      "pending",

    renderLoopStatus:
      "pending",

    topAuthorityCardinal:
      "north",

    cardinalScale:
      QUALITY.cardinalScale,

    focusedCardinalScale:
      QUALITY.focusedCardinalScale,

    selectedCardinalScale:
      QUALITY.selectedCardinalScale,

    roomScale:
      QUALITY.roomScale,

    selectedRoomScale:
      QUALITY.selectedRoomScale,

    rotationModel:
      "BOUNDED_YAW_PITCH_WITH_DOMINANT_RZ",

    accessibilityNoteMutationAuthorized:
      false,

    failureReason:
      null,

    remainingVisualDefects:
      [],

    visualPassClaimed:
      false
  };

  const state = {
    root: null,
    scene: null,
    mount: null,
    canvas: null,
    surface: null,

    gl: null,
    program: null,
    attribs: null,
    uniforms: null,

    meshes: new Map(),
    registry: new Map(),

    mode:
      MODES.COMPASS,

    orbitFocus:
      "",

    selectedCardinal:
      "",

    selectedRoom:
      "",

    selectedDestinationType:
      "",

    flowerExpanded:
      false,

    mirrorlandWindowState:
      MIRRORLAND_WINDOW_STATES.DORMANT,

    mirrorlandInteractionSuppressed:
      false,

    reducedMotion:
      false,

    diagnosticMode:
      DIAGNOSTIC_MODES.NONE,

    orbitAngle:
      0,

    targetOrbitAngle:
      0,

    width:
      1,

    height:
      1,

    pixelRatio:
      1,

    time:
      0,

    lastTime:
      0,

    raf:
      0,

    running:
      false,

    pointer:
      null,

    view:
      null,

    projection:
      null,

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
    Object.assign(
      RECEIPT,
      {
        mirrorlandMeshLoaded:
          false,

        mirrorlandDrawn:
          false,

        mirrorlandRegistryNodePresent:
          false,

        mirrorlandSemanticSyncEnabled:
          false,

        mirrorlandHitTestingEnabled:
          false,

        mirrorlandReviewObjectDependency:
          false,

        centerReservedForMirrorlandThreshold:
          true,

        accessibilityNoteMutationAuthorized:
          false,

        mirrorlandWindowState:
          state.mirrorlandWindowState,

        compassInteractionSuppressedForMirrorland:
          state.mirrorlandInteractionSuppressed,

        visualPassClaimed:
          false
      },
      extra,
      {
        visualPassClaimed:
          false
      }
    );

    const serialized =
      JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.compassCrystalsReceipt =
        serialized;

      state.root.dataset.compassCrystalsStatus =
        RECEIPT.failureReason
          ? "held"
          : "available";

      state.root.dataset.visualPassClaimed =
        "false";
    }

    if (state.canvas) {
      state.canvas.dataset.compassCrystalsReceipt =
        serialized;

      state.canvas.dataset.visualPassClaimed =
        "false";
    }

    globalThis.DGB_COMPASS_CRYSTALS_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });
  }

  function emitFailure(
    stage,
    reason,
    extra = {}
  ) {
    emitReceipt({
      ...extra,

      initializationStage:
        stage,

      failureReason:
        reason,

      renderLoopStatus:
        state.running
          ? RECEIPT.renderLoopStatus
          : "held"
    });
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CRYSTALS =
      Object.freeze({
        contract:
          CONTRACT,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        setDiagnosticMode:
          (mode) => {
            const requested =
              String(
                mode ||
                DIAGNOSTIC_MODES.NONE
              );

            state.diagnosticMode =
              Object.values(
                DIAGNOSTIC_MODES
              ).includes(requested)
                ? requested
                : DIAGNOSTIC_MODES.NONE;

            emitReceipt({
              diagnosticMode:
                state.diagnosticMode,

              diagnosticModeAvailable:
                true
            });
          },

        requestAxisSwipe:
          (axis) => {
            const api =
              globalThis.DGB_COMPASS_CONTROLLER;

            if (
              api &&
              typeof api.requestAxisSwipe ===
                "function"
            ) {
              api.requestAxisSwipe(axis);
              return true;
            }

            emitReceipt({
              failureReason:
                "CONTROLLER_AXIS_API_UNAVAILABLE"
            });

            return false;
          },

        requestDirectionSelection:
          (direction) => {
            const api =
              globalThis.DGB_COMPASS_CONTROLLER;

            if (
              api &&
              typeof api.requestDirectionSelection ===
                "function"
            ) {
              api.requestDirectionSelection(
                direction
              );

              return true;
            }

            emitReceipt({
              failureReason:
                "CONTROLLER_DIRECTION_API_UNAVAILABLE"
            });

            return false;
          },

        stop:
          () => {
            state.running =
              false;

            globalThis.cancelAnimationFrame(
              state.raf
            );

            emitReceipt({
              renderLoopStatus:
                "stopped"
            });
          },

        start:
          () => {
            if (
              !state.running &&
              state.gl &&
              state.program
            ) {
              state.running =
                true;

              state.raf =
                globalThis.requestAnimationFrame(
                  render
                );

              emitReceipt({
                renderLoopStatus:
                  "active"
              });
            }
          },

        dispose:
          disposeResources
      });
  }

  function qs(
    selectors,
    root = document
  ) {
    for (const selector of selectors) {
      const element =
        root.querySelector(selector);

      if (element) {
        return element;
      }
    }

    return null;
  }

  function normalizeWing(value) {
    const wing =
      String(value || "")
        .trim()
        .toLowerCase();

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeMirrorlandWindowState(
    value
  ) {
    const requested =
      String(value || "")
        .trim()
        .toLowerCase();

    return Object.values(
      MIRRORLAND_WINDOW_STATES
    ).includes(requested)
      ? requested
      : MIRRORLAND_WINDOW_STATES.DORMANT;
  }

  function seeded(seed) {
    const x =
      Math.sin(seed * 12.9898) *
      43758.5453;

    return x - Math.floor(x);
  }

  function findRoot() {
    return (
      qs([
        "[data-compass-root]",
        "#compass",
        "main"
      ]) ||
      document.body
    );
  }

  function ensureCanvas(mount) {
    const existing =
      mount.querySelector(
        "canvas[data-compass-crystals-canvas]"
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

    canvas.style.display =
      "block";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.position =
      "absolute";

    canvas.style.inset =
      "0";

    canvas.style.pointerEvents =
      "none";

    if (
      globalThis.getComputedStyle(
        mount
      ).position === "static"
    ) {
      mount.style.position =
        "relative";
    }

    mount.prepend(canvas);

    return canvas;
  }

  function getGL(canvas) {
    return canvas.getContext(
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
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    void main() {
      vec3 position = aPosition;

      if (uHaloPass > 0.5) {
        position +=
          normalize(aNormal) *
          uHaloExpansion;
      }

      vec4 world =
        uModel *
        vec4(position, 1.0);

      vec4 view =
        uView *
        world;

      vNormal =
        normalize(
          uNormalMatrix *
          aNormal
        );

      vColor =
        aColor;

      vViewPosition =
        view.xyz;

      vWorldPosition =
        world.xyz;

      vHaloPass =
        uHaloPass;

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
        normalize(
          -vViewPosition
        );

      vec3 base =
        max(
          vColor,
          vec3(0.02)
        );

      if (
        uDiagnosticMode > 1.5 &&
        uDiagnosticMode < 2.5
      ) {
        gl_FragColor =
          vec4(
            normal * 0.5 + 0.5,
            1.0
          );

        return;
      }

      if (
        uDiagnosticMode > 0.5 &&
        uDiagnosticMode < 1.5
      ) {
        gl_FragColor =
          vec4(base, 1.0);

        return;
      }

      float facingToCamera =
        dot(
          normal,
          viewDirection
        );

      float rearSuppression =
        smoothstep(
          -0.18,
          0.34,
          facingToCamera
        );

      float sideRim =
        pow(
          1.0 -
          abs(facingToCamera),
          2.4
        );

      float key =
        max(
          dot(
            normal,
            normalize(-uKeyLight)
          ),
          0.0
        );

      float fill =
        max(
          dot(
            normal,
            normalize(-uFillLight)
          ),
          0.0
        );

      float rear =
        max(
          dot(
            normal,
            normalize(-uRimLight)
          ),
          0.0
        );

      float fresnel =
        pow(
          1.0 -
          max(
            facingToCamera,
            0.0
          ),
          2.05
        );

      float specularFacing =
        pow(
          max(
            dot(
              reflect(
                normalize(uKeyLight),
                normal
              ),
              viewDirection
            ),
            0.0
          ),
          28.0
        );

      float facetBand =
        pow(
          abs(
            dot(
              normal,
              normalize(
                vec3(
                  0.45,
                  0.72,
                  0.53
                )
              )
            )
          ),
          5.0
        );

      float sparkleSeed =
        hash31(
          floor(
            (
              normal +
              vWorldPosition
            ) *
            18.0
          )
        );

      float sparklePhase =
        sin(
          uTime * 1.85 +
          sparkleSeed *
          6.28318
        );

      float sparkle =
        smoothstep(
          0.74,
          1.0,
          specularFacing +
          facetBand * 0.34
        ) *
        (
          0.76 +
          sparklePhase * 0.24
        ) *
        uSparkle *
        rearSuppression;

      float twinkle =
        1.0 +
        sin(
          uTime * 0.70 +
          sparkleSeed *
          6.28318
        ) *
        0.045 *
        uTwinkle;

      if (vHaloPass > 0.5) {
        vec3 haloColor =
          base *
          (
            0.70 +
            fresnel * 1.18 +
            sideRim * 0.42 +
            rear * 0.24
          ) *
          uHaloStrength *
          twinkle;

        float haloAlpha =
          clamp(
            (
              0.040 +
              fresnel * 0.18 +
              sideRim * 0.08
            ) *
            uProminence *
            uHaloStrength,
            0.0,
            0.34
          );

        gl_FragColor =
          vec4(
            haloColor,
            haloAlpha
          );

        return;
      }

      float diffuse =
        0.24 +
        key * 0.82 +
        fill * 0.30 +
        rear * 0.14;

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

      vec3 lit =
        base *
        diffuse *
        twinkle;

      vec3 specular =
        vec3(
          1.0,
          0.96,
          0.82
        ) *
        specularFacing *
        uSpecular *
        rearSuppression;

      vec3 rim =
        base *
        (
          fresnel * 0.72 +
          sideRim * 0.38
        ) *
        uRim;

      vec3 coolRim =
        vec3(
          0.68,
          0.86,
          1.0
        ) *
        (
          fresnel * 0.22 +
          sideRim * 0.14
        ) *
        uRim;

      vec3 emissive =
        base *
        uEmissive;

      vec3 spark =
        vec3(
          1.0,
          0.96,
          0.78
        ) *
        sparkle;

      float rearDim =
        mix(
          0.62,
          1.0,
          rearSuppression
        );

      vec3 color =
        (
          (
            lit +
            specular +
            rim +
            coolRim +
            emissive +
            spark
          ) *
          uProminence +
          uAmbientColor *
          base *
          0.20
        ) *
        rearDim;

      float alpha =
        clamp(
          uAlpha *
          (
            0.70 +
            uProminence * 0.30 +
            fresnel * 0.08
          ),
          0.12,
          1.0
        );

      gl_FragColor =
        vec4(
          color,
          alpha
        );
    }
  `;

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(
      shader
    );

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const info =
        gl.getShaderInfoLog(
          shader
        ) ||
        "UNKNOWN_SHADER_ERROR";

      gl.deleteShader(
        shader
      );

      throw new Error(info);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragment =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );

    const program =
      gl.createProgram();

    gl.attachShader(
      program,
      vertex
    );

    gl.attachShader(
      program,
      fragment
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(
      vertex
    );

    gl.deleteShader(
      fragment
    );

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const info =
        gl.getProgramInfoLog(
          program
        ) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(
        program
      );

      throw new Error(info);
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
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-14
    ) {
      return [0, 0, 1];
    }

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

  function createBuffer(
    gl,
    target,
    data,
    usage = gl.STATIC_DRAW
  ) {
    const buffer =
      gl.createBuffer();

    gl.bindBuffer(
      target,
      buffer
    );

    gl.bufferData(
      target,
      data,
      usage
    );

    return buffer;
  }

  function buildGpuMesh(
    gl,
    mesh
  ) {
    return Object.freeze({
      vertexCount:
        mesh.vertexCount,

      triangleCount:
        mesh.triangleCount,

      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.positions
        ),

      normal:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.normals
        ),

      color:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.colors
        ),

      indexed:
        false,

      index:
        null,

      indexType:
        null,

      indexCount:
        0,

      isBackground:
        mesh.isBackground === true
    });
  }

  function createQuadMeshFromRects(
    rects,
    fallbackColor
  ) {
    const positions = [];
    const normals = [];
    const colors = [];

    rects.forEach((rect) => {
      const x =
        rect.x;

      const y =
        rect.y;

      const z =
        rect.z;

      const width =
        rect.w;

      const height =
        rect.h;

      const color =
        rect.color ||
        fallbackColor;

      const points = [
        [
          x - width,
          y - height,
          z
        ],
        [
          x + width,
          y - height,
          z
        ],
        [
          x + width,
          y + height,
          z
        ],
        [
          x - width,
          y - height,
          z
        ],
        [
          x + width,
          y + height,
          z
        ],
        [
          x - width,
          y + height,
          z
        ]
      ];

      points.forEach((point) => {
        positions.push(
          point[0],
          point[1],
          point[2]
        );

        normals.push(
          0,
          0,
          1
        );

        colors.push(
          color[0],
          color[1],
          color[2]
        );
      });
    });

    return Object.freeze({
      positions:
        new Float32Array(
          positions
        ),

      normals:
        new Float32Array(
          normals
        ),

      colors:
        new Float32Array(
          colors
        ),

      vertexCount:
        positions.length / 3,

      triangleCount:
        positions.length / 9,

      isBackground:
        true
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

      const clearCenter =
        Math.abs(randomX - 0.5) <
          0.19 &&
        Math.abs(randomY - 0.5) <
          0.18;

      const x =
        (randomX - 0.5) *
        (
          clearCenter
            ? 9.2
            : 8.2
        );

      const y =
        (randomY - 0.5) *
        (
          clearCenter
            ? 6.2
            : 5.7
        );

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

    return createQuadMeshFromRects(
      rects,
      STAR_PALETTE.background
    );
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
        Math.max(
          1,
          segments - 1
        );

      const alphaLift =
        1 -
        progress * 0.72;

      rects.push({
        x:
          progress * 0.42,

        y:
          -progress * 0.18,

        z:
          -7,

        w:
          0.075 *
          (
            1 -
            progress * 0.70
          ),

        h:
          0.010,

        color: [
          STAR_PALETTE.shooting[0] *
            alphaLift,

          STAR_PALETTE.shooting[1] *
            alphaLift,

          STAR_PALETTE.shooting[2] *
            alphaLift
        ]
      });
    }

    return createQuadMeshFromRects(
      rects,
      STAR_PALETTE.shooting
    );
  }

  function createDiamondStarMesh(
    options
  ) {
    const points =
      options.points || 8;

    const radius =
      options.radius || 0.62;

    const inner =
      options.inner ||
      radius * 0.46;

    const depth =
      options.depth || 0.42;

    const crown =
      options.crown || 0.22;

    const color =
      options.color ||
      STAR_PALETTE.north;

    const warmth =
      options.warmth || 0;

    const vertices = [];
    const faces = [];

    function add(point) {
      vertices.push(point);
      return vertices.length - 1;
    }

    function face(a, b, c) {
      faces.push([
        a,
        b,
        c
      ]);
    }

    const frontApex =
      add([
        0,
        0,
        depth
      ]);

    const rearApex =
      add([
        0,
        0,
        -depth
      ]);

    const frontCrown =
      add([
        0,
        0,
        depth + crown
      ]);

    const rearCrown =
      add([
        0,
        0,
        -depth -
        crown * 0.72
      ]);

    const outer = [];
    const innerRing = [];
    const frontBevel = [];
    const rearBevel = [];

    for (
      let index = 0;
      index < points * 2;
      index += 1
    ) {
      const isPoint =
        index % 2 === 0;

      const angle =
        Math.PI *
        2 *
        index /
        (
          points * 2
        ) -
        Math.PI / 2;

      const currentRadius =
        isPoint
          ? radius
          : inner;

      const yScale =
        0.78;

      const ridge =
        isPoint
          ? 0.05
          : -0.02;

      outer.push(
        add([
          Math.cos(angle) *
            currentRadius,

          Math.sin(angle) *
            currentRadius *
            yScale,

          ridge
        ])
      );

      innerRing.push(
        add([
          Math.cos(angle) *
            currentRadius *
            0.38,

          Math.sin(angle) *
            currentRadius *
            yScale *
            0.38,

          depth * 0.14
        ])
      );

      frontBevel.push(
        add([
          Math.cos(angle) *
            currentRadius *
            0.72,

          Math.sin(angle) *
            currentRadius *
            yScale *
            0.72,

          depth * 0.52
        ])
      );

      rearBevel.push(
        add([
          Math.cos(angle) *
            currentRadius *
            0.68,

          Math.sin(angle) *
            currentRadius *
            yScale *
            0.68,

          -depth * 0.48
        ])
      );
    }

    const count =
      outer.length;

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const next =
        (index + 1) %
        count;

      face(
        frontApex,
        innerRing[index],
        innerRing[next]
      );

      face(
        frontCrown,
        frontBevel[next],
        frontBevel[index]
      );

      face(
        frontBevel[index],
        outer[index],
        outer[next]
      );

      face(
        frontBevel[index],
        outer[next],
        frontBevel[next]
      );

      face(
        innerRing[index],
        frontBevel[index],
        frontBevel[next]
      );

      face(
        innerRing[index],
        frontBevel[next],
        innerRing[next]
      );

      face(
        rearApex,
        rearBevel[next],
        rearBevel[index]
      );

      face(
        rearCrown,
        rearBevel[index],
        rearBevel[next]
      );

      face(
        rearBevel[index],
        outer[next],
        outer[index]
      );

      face(
        rearBevel[index],
        rearBevel[next],
        outer[next]
      );
    }

    const outputPositions = [];
    const outputNormals = [];
    const outputColors = [];

    faces.forEach(
      (
        faceIndices,
        faceIndex
      ) => {
        const a =
          vertices[
            faceIndices[0]
          ];

        const b =
          vertices[
            faceIndices[1]
          ];

        const c =
          vertices[
            faceIndices[2]
          ];

        const normal =
          normalize(
            cross(
              subtract(b, a),
              subtract(c, a)
            )
          );

        const lift =
          0.84 +
          (
            faceIndex % 7
          ) *
          0.034;

        const sparkleLift =
          faceIndex % 5 === 0
            ? 0.13
            : 0;

        [
          a,
          b,
          c
        ].forEach((point) => {
          outputPositions.push(
            point[0],
            point[1],
            point[2]
          );

          outputNormals.push(
            normal[0],
            normal[1],
            normal[2]
          );

          outputColors.push(
            Math.min(
              color[0] * lift +
              warmth * 0.06 +
              sparkleLift,
              1
            ),

            Math.min(
              color[1] * lift +
              warmth * 0.04 +
              sparkleLift,
              1
            ),

            Math.min(
              color[2] * lift +
              warmth * 0.02 +
              sparkleLift,
              1
            )
          );
        });
      }
    );

    return Object.freeze({
      positions:
        new Float32Array(
          outputPositions
        ),

      normals:
        new Float32Array(
          outputNormals
        ),

      colors:
        new Float32Array(
          outputColors
        ),

      vertexCount:
        outputPositions.length / 3,

      triangleCount:
        faces.length,

      isBackground:
        false
    });
  }

  function roomPaletteForWing(wing) {
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

  function buildMeshes(gl) {
    const meshes =
      new Map();

    if (BACKGROUND.enabled) {
      meshes.set(
        "background-stars",
        buildGpuMesh(
          gl,
          createBackgroundStarsMesh()
        )
      );

      meshes.set(
        "shooting-star",
        buildGpuMesh(
          gl,
          createShootingStarMesh()
        )
      );

      emitReceipt({
        backgroundStarsInitialized:
          true,

        backgroundStarCount:
          BACKGROUND.starCount
      });
    }

    WINGS.forEach((wing) => {
      const cardinalColor =
        STAR_PALETTE[wing];

      const roomColor =
        roomPaletteForWing(wing);

      meshes.set(
        "wing-" + wing,
        buildGpuMesh(
          gl,
          createDiamondStarMesh({
            points:
              QUALITY.cardinalSegments,

            radius:
              0.72,

            inner:
              0.30,

            depth:
              0.42,

            crown:
              0.20,

            color:
              cardinalColor,

            warmth:
              (
                wing === "south" ||
                wing === "west"
              )
                ? 0.10
                : 0.02
          })
        )
      );

      meshes.set(
        "room-" + wing,
        buildGpuMesh(
          gl,
          createDiamondStarMesh({
            points:
              QUALITY.roomSegments,

            radius:
              0.42,

            inner:
              0.20,

            depth:
              0.25,

            crown:
              0.10,

            color:
              roomColor,

            warmth:
              (
                wing === "south" ||
                wing === "west"
              )
                ? 0.08
                : 0.02
          })
        )
      );
    });

    emitReceipt({
      meshBuildStatus:
        "built",

      cardinalMeshCount:
        4,

      roomMeshCount:
        4,

      mirrorlandMeshLoaded:
        false
    });

    return meshes;
  }

  function coordinateFor(
    index,
    count
  ) {
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

    if (count === 5) {
      return five[index] || "";
    }

    if (count === 4) {
      return four[index] || "";
    }

    return String(index + 1);
  }

  function node(
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
        options.meshKey || type,

      material:
        options.material ||
        "CARDINAL_IDLE",

      baseMaterial:
        options.material ||
        "CARDINAL_IDLE",

      color:
        options.color ||
        STAR_PALETTE.north,

      phase:
        options.phase || 0,

      visible:
        true,

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

        prominence: 1,
        halo: 0,
        rotationSpeed: 0.12,
        float: 0
      },

      target: {
        x: 0,
        y: 0,
        z: 0,

        sx: 1,
        sy: 1,
        sz: 1,

        prominence: 1,
        halo: 0,
        rotationSpeed: 0.12,
        float: 0
      }
    };
  }

  function buildRegistry() {
    const registry =
      new Map();

    registry.set(
      "background-stars",
      node(
        "background-stars",
        "background",
        {
          meshKey:
            "background-stars",

          material:
            "BACKGROUND_STAR",

          phase:
            0.1
        }
      )
    );

    registry.set(
      "shooting-star",
      node(
        "shooting-star",
        "background",
        {
          meshKey:
            "shooting-star",

          material:
            "SHOOTING_STAR",

          phase:
            0.2
        }
      )
    );

    WINGS.forEach(
      (
        wing,
        wingIndex
      ) => {
        const copy =
          AXIS_COPY[wing];

        registry.set(
          wing,
          node(
            wing,
            "cardinal",
            {
              label:
                copy.label,

              short:
                copy.short,

              wing,

              meshKey:
                "wing-" + wing,

              material:
                "CARDINAL_IDLE",

              color:
                STAR_PALETTE[wing],

              phase:
                wingIndex *
                1.37 +
                0.22
            }
          )
        );

        DEFAULT_ROOMS[wing].forEach(
          (
            room,
            index
          ) => {
            registry.set(
              room.id,
              node(
                room.id,
                "petal",
                {
                  label:
                    room.label,

                  short:
                    room.short,

                  wing,

                  roomIndex:
                    index,

                  coordinate:
                    coordinateFor(
                      index,
                      DEFAULT_ROOMS[wing]
                        .length
                    ),

                  meshKey:
                    "room-" + wing,

                  material:
                    "ROOM_IDLE",

                  color:
                    roomPaletteForWing(
                      wing
                    ),

                  phase:
                    wingIndex *
                    1.13 +
                    index *
                    0.47
                }
              )
            );
          }
        );
      }
    );

    const cardinalRegistryCount =
      WINGS.reduce(
        (
          count,
          wing
        ) =>
          count +
          (
            registry.has(wing)
              ? 1
              : 0
          ),
        0
      );

    const roomRegistryCount =
      WINGS.reduce(
        (
          count,
          wing
        ) =>
          count +
          DEFAULT_ROOMS[wing].filter(
            (room) =>
              registry.has(room.id)
          ).length,
        0
      );

    emitReceipt({
      registryBuildStatus:
        "built",

      cardinalRegistryCount,

      roomRegistryCount,

      mirrorlandRegistryNodePresent:
        registry.has("mirrorland")
    });

    return registry;
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
        dataset.selectedWing ||
        ""
      );

    state.selectedCardinal =
      normalizeWing(
        dataset.selectedCardinal ||
        ""
      );

    state.selectedRoom =
      String(
        dataset.selectedRoom ||
        ""
      );

    state.selectedDestinationType =
      String(
        dataset.selectedDestinationType ||
        ""
      )
        .trim()
        .toLowerCase();

    state.flowerExpanded =
      dataset.flowerExpanded ===
      "true";

    state.mirrorlandWindowState =
      normalizeMirrorlandWindowState(
        dataset.mirrorlandWindowState
      );

    state.mirrorlandInteractionSuppressed =
      state.mirrorlandWindowState !==
      MIRRORLAND_WINDOW_STATES.DORMANT;

    state.reducedMotion =
      (
        typeof globalThis.matchMedia ===
          "function" &&
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) ||
      dataset.reducedMotion ===
        "true";

    state.targetOrbitAngle =
      ORBIT_ANGLES[
        state.orbitFocus
      ] || 0;

    emitReceipt({
      activeMode:
        state.mode,

      activeDestination:
        state.selectedDestinationType ||
        "",

      mode:
        state.mode,

      orbitFocus:
        state.orbitFocus,

      selectedCardinal:
        state.selectedCardinal,

      selectedRoom:
        state.selectedRoom,

      selectedDestinationType:
        state.selectedDestinationType,

      flowerExpanded:
        state.flowerExpanded,

      mirrorlandWindowState:
        state.mirrorlandWindowState,

      compassInteractionSuppressedForMirrorland:
        state.mirrorlandInteractionSuppressed
    });
  }

  function rotate2D(
    point,
    angle
  ) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

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
      Math.PI *
      2 *
      index /
      Math.max(
        count,
        1
      ) -
      Math.PI / 2;

    return [
      Math.cos(angle) *
        radius,

      Math.sin(angle) *
        radius *
        0.78,

      0.26
    ];
  }

  function setTarget(
    targetNode,
    values
  ) {
    Object.assign(
      targetNode.target,
      values
    );
  }

  function setUniformScale(
    values,
    scale
  ) {
    values.sx =
      scale;

    values.sy =
      scale;

    values.sz =
      scale;

    return values;
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
      delta -=
        Math.PI * 2;
    }

    while (delta < -Math.PI) {
      delta +=
        Math.PI * 2;
    }

    state.orbitAngle +=
      delta *
      Math.min(
        1,
        deltaTime * 4.8
      );
  }

  function topAuthorityWing() {
    let bestWing =
      "north";

    let bestY =
      -Infinity;

    WINGS.forEach((wing) => {
      const position =
        orbitWingPosition(wing);

      if (
        position[1] >
        bestY
      ) {
        bestY =
          position[1];

        bestWing =
          wing;
      }
    });

    return bestWing;
  }

  function updateShootingStar(nowMs) {
    if (
      !BACKGROUND.shootingStars ||
      state.reducedMotion ||
      state.mirrorlandInteractionSuppressed
    ) {
      state.shootingStar.active =
        false;

      return;
    }

    if (!state.shootingStar.nextMs) {
      state.shootingStar.nextMs =
        nowMs +
        BACKGROUND.shootingStarIntervalMs;
    }

    if (
      !state.shootingStar.active &&
      nowMs >=
        state.shootingStar.nextMs
    ) {
      state.shootingStar.active =
        true;

      state.shootingStar.startMs =
        nowMs;

      state.shootingStar.seed +=
        1;
    }

    if (
      state.shootingStar.active &&
      nowMs -
        state.shootingStar.startMs >
        state.shootingStar.durationMs
    ) {
      state.shootingStar.active =
        false;

      state.shootingStar.nextMs =
        nowMs +
        BACKGROUND.shootingStarIntervalMs +
        (
          seeded(
            state.shootingStar.seed +
            201
          ) -
          0.5
        ) *
        BACKGROUND.shootingStarVarianceMs;
    }
  }

  function updateTargets() {
    const topWing =
      topAuthorityWing();

    const focus =
      state.orbitFocus ||
      topWing ||
      "north";

    const mirrorlandOwnsScene =
      state.selectedDestinationType ===
        "mirrorland" ||
      state.mirrorlandInteractionSuppressed;

    const activeFlower =
      state.flowerExpanded &&
      state.selectedCardinal &&
      !mirrorlandOwnsScene;

    const selectedRooms =
      DEFAULT_ROOMS[
        state.selectedCardinal ||
        focus
      ] || [];

    emitReceipt({
      topAuthorityCardinal:
        topWing
    });

    state.registry.forEach(
      (registryNode) => {
        registryNode.visible =
          false;

        registryNode.material =
          registryNode.baseMaterial;

        setTarget(
          registryNode,
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
      }
    );

    const background =
      state.registry.get(
        "background-stars"
      );

    if (
      background &&
      BACKGROUND.enabled
    ) {
      background.visible =
        true;

      setTarget(
        background,
        setUniformScale(
          {
            x: 0,
            y: 0,
            z: -2.2,

            prominence:
              mirrorlandOwnsScene
                ? 0.22
                : state.reducedMotion
                  ? 0.34
                  : 0.46,

            halo: 0,
            rotationSpeed: 0,
            float: 0
          },
          1
        )
      );
    }

    const shooting =
      state.registry.get(
        "shooting-star"
      );

    if (shooting) {
      const active =
        state.shootingStar.active &&
        !state.reducedMotion &&
        !mirrorlandOwnsScene;

      const progress =
        active
          ? Math.max(
              0,
              Math.min(
                1,
                (
                  performance.now() -
                  state.shootingStar.startMs
                ) /
                state.shootingStar.durationMs
              )
            )
          : 0;

      shooting.visible =
        active;

      setTarget(
        shooting,
        setUniformScale(
          {
            x:
              -2.2 +
              progress * 1.1 +
              (
                seeded(
                  state.shootingStar.seed +
                  12
                ) -
                0.5
              ) *
              0.7,

            y:
              1.82 -
              progress * 0.54 +
              (
                seeded(
                  state.shootingStar.seed +
                  19
                ) -
                0.5
              ) *
              0.38,

            z:
              -2.8,

            prominence:
              active
                ? Math.sin(
                    progress *
                    Math.PI
                  ) *
                  0.58
                : 0,

            halo:
              0,

            rotationSpeed:
              0,

            float:
              0
          },
          1
        )
      );
    }

    if (mirrorlandOwnsScene) {
      WINGS.forEach((wing) => {
        const cardinal =
          state.registry.get(wing);

        if (!cardinal) return;

        const position =
          orbitWingPosition(wing);

        cardinal.visible =
          true;

        cardinal.material =
          "CARDINAL_IDLE";

        setTarget(
          cardinal,
          setUniformScale(
            {
              x:
                position[0],

              y:
                position[1],

              z:
                -0.22,

              prominence:
                0.34,

              halo:
                0.18,

              rotationSpeed:
                0.04,

              float:
                0
            },
            QUALITY.cardinalScale *
            0.82
          )
        );
      });

      state.camera.nextEye = [
        0,
        0.78,
        state.width /
          Math.max(
            1,
            state.height
          ) <
        0.8
          ? 7.2
          : 6.15
      ];

      state.camera.nextTarget = [
        0,
        0,
        0
      ];

      return;
    }

    if (!activeFlower) {
      WINGS.forEach((wing) => {
        const cardinal =
          state.registry.get(wing);

        if (!cardinal) return;

        const position =
          orbitWingPosition(wing);

        const focused =
          wing === topWing;

        const explicitlySelected =
          wing ===
          state.selectedCardinal;

        cardinal.visible =
          true;

        cardinal.material =
          explicitlySelected
            ? "CARDINAL_SELECTED"
            : focused
              ? "CARDINAL_FOCUSED"
              : "CARDINAL_IDLE";

        const scale =
          explicitlySelected
            ? QUALITY.selectedCardinalScale
            : focused
              ? QUALITY.focusedCardinalScale
              : QUALITY.cardinalScale;

        setTarget(
          cardinal,
          setUniformScale(
            {
              x:
                position[0],

              y:
                position[1],

              z:
                focused ||
                explicitlySelected
                  ? 0.34
                  : position[2],

              prominence:
                explicitlySelected
                  ? 1.05
                  : focused
                    ? 1
                    : 0.74,

              halo:
                explicitlySelected
                  ? 1.08
                  : focused
                    ? 1
                    : 0.52,

              rotationSpeed:
                explicitlySelected
                  ? 0.18
                  : focused
                    ? 0.16
                    : 0.09,

              float:
                focused ||
                explicitlySelected
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
        state.width /
          Math.max(
            1,
            state.height
          ) <
        0.8
          ? 7.2
          : 6.05
      ];

      state.camera.nextTarget = [
        0,
        0,
        0
      ];

      return;
    }

    WINGS.forEach((wing) => {
      const cardinal =
        state.registry.get(wing);

      if (!cardinal) return;

      cardinal.visible =
        false;

      setTarget(
        cardinal,
        setUniformScale(
          {
            x:
              0,

            y:
              0.10,

            z:
              -0.6,

            prominence:
              0,

            halo:
              0,

            rotationSpeed:
              0.06,

            float:
              0
          },
          0.4
        )
      );
    });

    selectedRooms.forEach(
      (
        room,
        index
      ) => {
        const roomNode =
          state.registry.get(
            room.id
          );

        if (!roomNode) return;

        const position =
          roomPetalPosition(
            index,
            selectedRooms.length
          );

        const selected =
          state.selectedRoom ===
          room.id;

        roomNode.visible =
          true;

        roomNode.material =
          selected
            ? "ROOM_SELECTED"
            : "ROOM_IDLE";

        setTarget(
          roomNode,
          setUniformScale(
            {
              x:
                position[0],

              y:
                position[1] -
                0.14,

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
      }
    );

    state.camera.nextEye = [
      0,
      0.66,
      state.width /
        Math.max(
          1,
          state.height
        ) <
      0.8
        ? 7.5
        : 5.85
    ];

    state.camera.nextTarget = [
      0,
      0.03,
      0
    ];
  }

  function lerp(
    a,
    b,
    amount
  ) {
    return (
      a +
      (
        b - a
      ) *
      amount
    );
  }

  function updateTransforms(deltaTime) {
    const speed =
      state.reducedMotion
        ? 1
        : Math.min(
            1,
            deltaTime * 6.2
          );

    state.registry.forEach(
      (registryNode) => {
        const current =
          registryNode.transform;

        const target =
          registryNode.target;

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
          current[key] =
            lerp(
              current[key],
              target[key],
              speed
            );
        });

        if (state.reducedMotion) {
          current.rx =
            0;

          current.ry =
            0;

          return;
        }

        if (
          registryNode.type ===
          "background"
        ) {
          current.rx =
            0;

          current.ry =
            0;

          return;
        }

        current.rz +=
          deltaTime *
          current.rotationSpeed;

        current.ry =
          Math.sin(
            state.time * 0.42 +
            registryNode.phase
          ) *
          QUALITY.maxYaw *
          Math.max(
            0.35,
            current.prominence
          );

        current.rx =
          Math.sin(
            state.time * 0.31 +
            registryNode.phase *
            0.73
          ) *
          QUALITY.maxPitch *
          Math.max(
            0.35,
            current.prominence
          );
      }
    );

    for (
      let index = 0;
      index < 3;
      index += 1
    ) {
      state.camera.eye[index] =
        lerp(
          state.camera.eye[index],
          state.camera.nextEye[index],
          speed
        );

      state.camera.target[index] =
        lerp(
          state.camera.target[index],
          state.camera.nextTarget[index],
          speed
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
            column * 4 +
            row
          ] +=
            a[
              index * 4 +
              row
            ] *
            b[
              column * 4 +
              index
            ];
        }
      }
    }

    return output;
  }

  function translate4(x, y, z) {
    const matrix =
      identity4();

    matrix[12] =
      x;

    matrix[13] =
      y;

    matrix[14] =
      z;

    return matrix;
  }

  function scale4(x, y, z) {
    const matrix =
      identity4();

    matrix[0] =
      x;

    matrix[5] =
      y;

    matrix[10] =
      z;

    return matrix;
  }

  function rotateX4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateY4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateZ4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

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
      Math.tan(
        fieldOfView / 2
      );

    const nearFar =
      1 /
      (
        near - far
      );

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
      (
        far + near
      ) *
      nearFar,
      -1,

      0,
      0,
      (
        2 *
        far *
        near
      ) *
      nearFar,
      0
    ];
  }

  function lookAt4(
    eye,
    center,
    up
  ) {
    const z =
      normalize(
        subtract(
          eye,
          center
        )
      );

    const x =
      normalize(
        cross(
          up,
          z
        )
      );

    const y =
      cross(
        z,
        x
      );

    return [
      x[0],
      y[0],
      z[0],
      0,

      x[1],
      y[1],
      z[1],
      0,

      x[2],
      y[2],
      z[2],
      0,

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

  function modelMatrix(
    registryNode,
    haloPass
  ) {
    const transform =
      registryNode.transform;

    const floatY =
      !state.reducedMotion &&
      registryNode.type !==
        "background"
        ? Math.sin(
            state.time * 0.95 +
            registryNode.roomIndex *
            0.72 +
            registryNode.phase
          ) *
          transform.float
        : 0;

    const haloScale =
      haloPass
        ? 1 +
          transform.halo *
          0.10
        : 1;

    return multiply4(
      translate4(
        transform.x,
        transform.y +
          floatY,
        transform.z
      ),

      multiply4(
        rotateZ4(
          transform.rz
        ),

        multiply4(
          rotateY4(
            transform.ry
          ),

          multiply4(
            rotateX4(
              transform.rx
            ),

            scale4(
              transform.sx *
                haloScale,

              transform.sy *
                haloScale,

              transform.sz *
                haloScale
            )
          )
        )
      )
    );
  }

  function transformPoint4(
    matrix,
    point
  ) {
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

  function projectNode(registryNode) {
    if (
      !state.view ||
      !state.projection
    ) {
      return null;
    }

    const model =
      modelMatrix(
        registryNode,
        false
      );

    const modelView =
      multiply4(
        state.view,
        model
      );

    const modelViewProjection =
      multiply4(
        state.projection,
        modelView
      );

    const clip =
      transformPoint4(
        modelViewProjection,
        [
          0,
          0,
          0,
          1
        ]
      );

    if (!clip[3]) {
      return null;
    }

    const x =
      clip[0] /
      clip[3];

    const y =
      clip[1] /
      clip[3];

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
        (
          (
            x + 1
          ) /
          2
        ) *
        state.width /
        state.pixelRatio,

      y:
        (
          (
            1 - y
          ) /
          2
        ) *
        state.height /
        state.pixelRatio
    };
  }

  function semanticElementForNode(
    registryNode
  ) {
    if (
      !state.root ||
      !registryNode
    ) {
      return null;
    }

    if (
      registryNode.type ===
      "cardinal"
    ) {
      return state.root.querySelector(
        "[data-compass-cardinal][data-wing='" +
        registryNode.wing +
        "']"
      );
    }

    if (
      registryNode.type ===
      "petal"
    ) {
      return state.root.querySelector(
        "[data-compass-room][data-room-id='" +
        registryNode.id +
        "']"
      );
    }

    return null;
  }

  function syncSemanticNode(
    registryNode
  ) {
    if (
      registryNode.type !==
        "cardinal" &&
      registryNode.type !==
        "petal"
    ) {
      return;
    }

    const element =
      semanticElementForNode(
        registryNode
      );

    if (
      !element ||
      !(
        state.surface &&
        state.surface.contains(
          element
        )
      )
    ) {
      return;
    }

    const screen =
      registryNode.visible &&
      registryNode.transform
        .prominence >= 0.08
        ? projectNode(
            registryNode
          )
        : null;

    if (!screen) {
      element.style.opacity =
        "0";

      element.style.pointerEvents =
        "none";

      return;
    }

    const primary =
      element.querySelector(
        "span:first-child"
      );

    const secondary =
      element.querySelector(
        "span:last-child"
      );

    if (primary) {
      primary.textContent =
        registryNode.label;
    }

    if (secondary) {
      secondary.textContent =
        registryNode.short;
    }

    const labelScale =
      registryNode.type ===
      "cardinal"
        ? 0.80
        : 0.78;

    element.style.left =
      screen.x + "px";

    element.style.top =
      screen.y + "px";

    element.style.right =
      "auto";

    element.style.bottom =
      "auto";

    element.style.transform =
      "translate(-50%, -50%) scale(" +
      labelScale +
      ")";

    element.style.opacity =
      String(
        Math.max(
          0,
          Math.min(
            1,
            registryNode.transform
              .prominence
          )
        )
      );

    element.style.pointerEvents =
      state.mirrorlandInteractionSuppressed
        ? "none"
        : registryNode.transform
              .prominence >= 0.18
          ? "auto"
          : "none";

    element.style.zIndex =
      registryNode.type ===
      "petal"
        ? "5"
        : "4";
  }

  function syncSemanticObjects() {
    state.registry.forEach(
      syncSemanticNode
    );
  }

  function classifyGesture(
    start,
    end
  ) {
    const deltaX =
      end.x - start.x;

    const deltaY =
      end.y - start.y;

    const absoluteX =
      Math.abs(deltaX);

    const absoluteY =
      Math.abs(deltaY);

    const distance =
      Math.hypot(
        deltaX,
        deltaY
      );

    if (
      distance <=
      GESTURE.maximumTapDistancePx
    ) {
      return {
        type: "tap",
        dx: deltaX,
        dy: deltaY
      };
    }

    if (
      distance <
      GESTURE.minimumSwipeDistancePx
    ) {
      return {
        type: "ambiguous",
        dx: deltaX,
        dy: deltaY
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
          deltaX > 0
            ? "swipeRight"
            : "swipeLeft",
        dx: deltaX,
        dy: deltaY
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
          deltaY > 0
            ? "swipeDown"
            : "swipeUp",
        dx: deltaX,
        dy: deltaY
      };
    }

    return {
      type: "ambiguous",
      dx: deltaX,
      dy: deltaY
    };
  }

  function requestAxisSwipe(
    axis,
    raw,
    gesture
  ) {
    if (
      state.mirrorlandInteractionSuppressed
    ) {
      emitReceipt({
        lastPointerAction:
          "axis-swipe-held-during-mirrorland-window",

        gestureType:
          "swipe",

        gestureDx:
          gesture
            ? gesture.dx
            : 0,

        gestureDy:
          gesture
            ? gesture.dy
            : 0
      });

      return;
    }

    const api =
      globalThis.DGB_COMPASS_CONTROLLER;

    const available =
      !!api &&
      typeof api.requestAxisSwipe ===
        "function";

    if (available) {
      api.requestAxisSwipe(
        axis
      );
    }

    emitReceipt({
      controllerApiAvailable:
        available,

      failureReason:
        available
          ? null
          : "CONTROLLER_AXIS_API_UNAVAILABLE",

      lastPointerAction:
        available
          ? raw ||
            "axis-swipe"
          : "controller-axis-api-unavailable",

      gestureType:
        "swipe",

      gestureDx:
        gesture
          ? gesture.dx
          : 0,

      gestureDy:
        gesture
          ? gesture.dy
          : 0
    });
  }

  function requestNodeSelection(
    registryNode,
    gesture
  ) {
    if (
      state.mirrorlandInteractionSuppressed
    ) {
      return;
    }

    const api =
      globalThis.DGB_COMPASS_CONTROLLER;

    let available =
      false;

    if (
      api &&
      registryNode.type ===
        "cardinal" &&
      typeof api.requestCardinalSelection ===
        "function"
    ) {
      api.requestCardinalSelection(
        registryNode.wing
      );

      available =
        true;
    }

    if (
      api &&
      registryNode.type ===
        "petal" &&
      typeof api.requestRoomSelection ===
        "function"
    ) {
      api.requestRoomSelection(
        registryNode.id
      );

      available =
        true;
    }

    emitReceipt({
      controllerApiAvailable:
        available,

      failureReason:
        available
          ? null
          : "CONTROLLER_SELECTION_API_UNAVAILABLE",

      lastPointerAction:
        available
          ? "visual-node-selection-requested"
          : "controller-selection-api-unavailable",

      gestureType:
        "tap",

      gestureDx:
        gesture
          ? gesture.dx
          : 0,

      gestureDy:
        gesture
          ? gesture.dy
          : 0
    });
  }

  function isSemanticTarget(target) {
    return !!(
      target &&
      target.closest &&
      target.closest(
        [
          "[data-compass-cardinal]",
          "[data-compass-room]",
          "[data-compass-object='mirrorland']",
          "[data-compass-mirrorland-threshold]",
          "[data-compass-enter]",
          "[data-compass-return-to-orbit]",
          "[data-compass-mirrorland-back]",
          "a",
          "button"
        ].join(", ")
      )
    );
  }

  function findHit(event) {
    if (
      state.mirrorlandInteractionSuppressed
    ) {
      return null;
    }

    const rect =
      state.surface.getBoundingClientRect();

    const pointerX =
      event.clientX -
      rect.left;

    const pointerY =
      event.clientY -
      rect.top;

    const radius =
      Math.max(
        46,
        Math.min(
          80,
          rect.width * 0.090
        )
      );

    let best =
      null;

    let bestDistance =
      Infinity;

    state.registry.forEach(
      (registryNode) => {
        if (
          registryNode.type ===
          "background"
        ) {
          return;
        }

        if (
          !registryNode.visible ||
          registryNode.transform
            .prominence < 0.12
        ) {
          return;
        }

        const screen =
          projectNode(
            registryNode
          );

        if (!screen) return;

        const distance =
          Math.hypot(
            pointerX -
              screen.x,

            pointerY -
              screen.y
          );

        if (
          distance <= radius &&
          distance < bestDistance
        ) {
          best =
            registryNode;

          bestDistance =
            distance;
        }
      }
    );

    return best;
  }

  function handlePointerDown(event) {
    try {
      event.currentTarget
        .setPointerCapture(
          event.pointerId
        );
    } catch (_) {
      /* Pointer capture may be unavailable. */
    }

    state.pointer = {
      id:
        event.pointerId,

      x:
        event.clientX,

      y:
        event.clientY,

      semanticStart:
        isSemanticTarget(
          event.target
        )
    };
  }

  function handlePointerMove(event) {
    if (
      !state.pointer ||
      event.pointerId !==
        state.pointer.id
    ) {
      return;
    }

    if (
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

    state.pointer =
      null;

    const gesture =
      classifyGesture(
        pointer,
        {
          x:
            event.clientX,

          y:
            event.clientY
        }
      );

    if (
      gesture.type ===
      "swipe"
    ) {
      event.preventDefault();

      requestAxisSwipe(
        gesture.axis,
        gesture.raw,
        gesture
      );

      return;
    }

    if (
      gesture.type !==
      "tap"
    ) {
      return;
    }

    if (
      pointer.semanticStart ||
      isSemanticTarget(
        event.target
      )
    ) {
      return;
    }

    const hit =
      findHit(event);

    if (hit) {
      requestNodeSelection(
        hit,
        gesture
      );
    }
  }

  function handlePointerCancel() {
    state.pointer =
      null;
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
      state.canvas.parentElement ||
      state.root;

    if (!state.surface) {
      emitFailure(
        "pointer bridge",
        "MISSING_COMPASS_GESTURE_SURFACE"
      );

      return;
    }

    state.surface.style.touchAction =
      "none";

    state.surface.style.overscrollBehavior =
      "contain";

    state.surface.addEventListener(
      "pointerdown",
      handlePointerDown,
      {
        passive: false
      }
    );

    state.surface.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: false
      }
    );

    state.surface.addEventListener(
      "pointerup",
      handlePointerUp,
      {
        passive: false
      }
    );

    state.surface.addEventListener(
      "pointercancel",
      handlePointerCancel,
      {
        passive: false
      }
    );
  }

  function resize() {
    const rect =
      state.canvas.getBoundingClientRect();

    const devicePixelRatio =
      Math.min(
        globalThis.devicePixelRatio ||
        1,

        QUALITY.devicePixelRatioCap
      );

    const width =
      Math.max(
        1,
        Math.floor(
          rect.width *
          devicePixelRatio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height *
          devicePixelRatio
        )
      );

    if (
      state.canvas.width !==
        width ||
      state.canvas.height !==
        height
    ) {
      state.canvas.width =
        width;

      state.canvas.height =
        height;
    }

    state.pixelRatio =
      devicePixelRatio;

    state.width =
      width;

    state.height =
      height;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function bindAttribute(
    gl,
    buffer,
    location,
    size
  ) {
    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.enableVertexAttribArray(
      location
    );

    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function applyMaterial(
    gl,
    materialName,
    prominence,
    haloStrength
  ) {
    let material =
      MATERIALS[materialName] ||
      MATERIALS.CARDINAL_IDLE;

    if (
      state.diagnosticMode ===
      DIAGNOSTIC_MODES.OPAQUE_UNLIT
    ) {
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

    const atmospheric =
      materialName ===
        "BACKGROUND_STAR" ||
      materialName ===
        "SHOOTING_STAR";

    if (
      state.reducedMotion ||
      atmospheric
    ) {
      gl.uniform1f(
        state.uniforms.twinkle,
        state.reducedMotion
          ? 0
          : 0.42
      );

      gl.uniform1f(
        state.uniforms.sparkle,
        atmospheric
          ? 0.04
          : 0
      );
    } else {
      gl.uniform1f(
        state.uniforms.twinkle,
        1
      );

      gl.uniform1f(
        state.uniforms.sparkle,
        material.sparkle
      );
    }

    gl.uniform1f(
      state.uniforms.prominence,
      prominence
    );

    gl.uniform1f(
      state.uniforms.specular,
      material.specular
    );

    gl.uniform1f(
      state.uniforms.rim,
      material.rim
    );

    gl.uniform1f(
      state.uniforms.emissive,
      material.emissive
    );

    gl.uniform1f(
      state.uniforms.alpha,
      material.alpha
    );

    gl.uniform1f(
      state.uniforms.contrast,
      material.contrast
    );

    gl.uniform1f(
      state.uniforms.haloStrength,
      material.halo *
      haloStrength
    );
  }

  function shouldDrawForDiagnostic(
    registryNode
  ) {
    if (
      state.diagnosticMode ===
      DIAGNOSTIC_MODES.CARDINAL_ONLY
    ) {
      return (
        registryNode.type ===
        "cardinal"
      );
    }

    if (
      state.diagnosticMode ===
      DIAGNOSTIC_MODES.ROOM_ONLY
    ) {
      return (
        registryNode.type ===
        "petal"
      );
    }

    if (
      state.diagnosticMode ===
      DIAGNOSTIC_MODES.BACKGROUND_ONLY
    ) {
      return (
        registryNode.type ===
        "background"
      );
    }

    return true;
  }

  function drawNode(
    registryNode,
    haloPass
  ) {
    if (
      !registryNode.visible ||
      registryNode.transform
        .prominence < 0.04 ||
      !shouldDrawForDiagnostic(
        registryNode
      )
    ) {
      return 0;
    }

    if (
      state.diagnosticMode ===
        DIAGNOSTIC_MODES.HALO_DISABLED &&
      haloPass
    ) {
      return 0;
    }

    if (
      registryNode.type ===
        "background" &&
      haloPass
    ) {
      return 0;
    }

    const mesh =
      state.meshes.get(
        registryNode.meshKey
      );

    if (!mesh) {
      return 0;
    }

    const gl =
      state.gl;

    bindAttribute(
      gl,
      mesh.position,
      state.attribs.position,
      3
    );

    bindAttribute(
      gl,
      mesh.normal,
      state.attribs.normal,
      3
    );

    bindAttribute(
      gl,
      mesh.color,
      state.attribs.color,
      3
    );

    const model =
      modelMatrix(
        registryNode,
        haloPass
      );

    gl.uniformMatrix4fv(
      state.uniforms.model,
      false,
      new Float32Array(
        model
      )
    );

    gl.uniformMatrix4fv(
      state.uniforms.view,
      false,
      new Float32Array(
        state.view
      )
    );

    gl.uniformMatrix4fv(
      state.uniforms.projection,
      false,
      new Float32Array(
        state.projection
      )
    );

    gl.uniformMatrix3fv(
      state.uniforms.normalMatrix,
      false,
      new Float32Array(
        normalMatrix3(
          model
        )
      )
    );

    gl.uniform1f(
      state.uniforms.time,
      state.time
    );

    gl.uniform1f(
      state.uniforms.haloPass,
      haloPass
        ? 1
        : 0
    );

    gl.uniform1f(
      state.uniforms.haloExpansion,
      0.075
    );

    gl.uniform1f(
      state.uniforms.diagnosticMode,
      state.diagnosticMode ===
        DIAGNOSTIC_MODES.OPAQUE_UNLIT
        ? 1
        : state.diagnosticMode ===
            DIAGNOSTIC_MODES.NORMALS
          ? 2
          : state.diagnosticMode ===
              DIAGNOSTIC_MODES.FACET_ONLY
            ? 3
            : 0
    );

    applyMaterial(
      gl,
      registryNode.material,
      registryNode.transform
        .prominence,
      registryNode.transform
        .halo
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    return 1;
  }

  function render(now) {
    if (!state.running) {
      return;
    }

    const seconds =
      now * 0.001;

    const deltaTime =
      state.lastTime
        ? Math.min(
            0.05,
            seconds -
            state.lastTime
          )
        : 0.016;

    state.lastTime =
      seconds;

    state.time =
      seconds;

    readControllerState();
    updateShootingStar(now);
    updateOrbitAngle(deltaTime);
    updateTargets();
    updateTransforms(deltaTime);
    resize();

    const gl =
      state.gl;

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

    gl.useProgram(
      state.program
    );

    gl.uniform3f(
      state.uniforms.keyLight,
      -0.42,
      -0.82,
      -0.68
    );

    gl.uniform3f(
      state.uniforms.fillLight,
      0.72,
      -0.24,
      -0.54
    );

    gl.uniform3f(
      state.uniforms.rimLight,
      0.08,
      0.46,
      1
    );

    gl.uniform3f(
      state.uniforms.ambientColor,
      0.10,
      0.12,
      0.18
    );

    let drawCalls =
      0;

    let backgroundDrawCalls =
      0;

    let visibleObjectCount =
      0;

    gl.depthMask(
      false
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    [
      "background-stars",
      "shooting-star"
    ].forEach((id) => {
      const backgroundNode =
        state.registry.get(id);

      if (
        backgroundNode &&
        backgroundNode.visible
      ) {
        backgroundDrawCalls +=
          drawNode(
            backgroundNode,
            false
          );
      }
    });

    gl.depthMask(
      false
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE
    );

    state.registry.forEach(
      (registryNode) => {
        if (
          registryNode.type ===
          "background"
        ) {
          return;
        }

        if (
          registryNode.visible &&
          registryNode.transform
            .prominence > 0.04
        ) {
          drawCalls +=
            drawNode(
              registryNode,
              true
            );
        }
      }
    );

    gl.depthMask(
      true
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    state.registry.forEach(
      (registryNode) => {
        if (
          registryNode.type ===
          "background"
        ) {
          return;
        }

        if (
          registryNode.visible &&
          registryNode.transform
            .prominence > 0.04 &&
          shouldDrawForDiagnostic(
            registryNode
          )
        ) {
          visibleObjectCount +=
            1;

          drawCalls +=
            drawNode(
              registryNode,
              false
            );
        }
      }
    );

    syncSemanticObjects();

    const glError =
      gl.getError();

    emitReceipt({
      rendererInitialized:
        true,

      drawCallsLastFrame:
        drawCalls +
        backgroundDrawCalls,

      backgroundDrawCallsLastFrame:
        backgroundDrawCalls,

      visibleObjectCount,

      shootingStarActive:
        state.shootingStar.active,

      reducedMotionBackgroundSuppressed:
        state.reducedMotion,

      glError:
        glError ===
        gl.NO_ERROR
          ? "NO_ERROR"
          : String(glError),

      renderLoopStatus:
        state.reducedMotion
          ? "active-reduced-motion"
          : "active",

      cameraOrientation:
        "+Z_FRONT_BOUNDED_THREE_QUARTER",

      diagnosticMode:
        state.diagnosticMode,

      failureReason:
        null,

      mirrorlandMeshLoaded:
        false,

      mirrorlandDrawn:
        false,

      mirrorlandRegistryNodePresent:
        false,

      mirrorlandSemanticSyncEnabled:
        false,

      mirrorlandHitTestingEnabled:
        false,

      mirrorlandReviewObjectDependency:
        false
    });

    state.raf =
      globalThis.requestAnimationFrame(
        render
      );
  }

  function disposeResources() {
    state.running =
      false;

    globalThis.cancelAnimationFrame(
      state.raf
    );

    if (state.gl) {
      state.meshes.forEach(
        (mesh) => {
          if (mesh.position) {
            state.gl.deleteBuffer(
              mesh.position
            );
          }

          if (mesh.normal) {
            state.gl.deleteBuffer(
              mesh.normal
            );
          }

          if (mesh.color) {
            state.gl.deleteBuffer(
              mesh.color
            );
          }
        }
      );

      if (state.program) {
        state.gl.deleteProgram(
          state.program
        );
      }
    }

    state.meshes.clear();
    state.registry.clear();

    emitReceipt({
      renderLoopStatus:
        "disposed",

      rendererInitialized:
        false
    });
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();

        state.running =
          false;

        globalThis.cancelAnimationFrame(
          state.raf
        );

        emitFailure(
          "context",
          "WEBGL_CONTEXT_LOST",
          {
            webglContextStatus:
              "lost",

            renderLoopStatus:
              "held"
          }
        );
      }
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        emitReceipt({
          webglContextStatus:
            "restored",

          renderLoopStatus:
            "restart-required"
        });
      }
    );
  }

  function init() {
    exposeApi();

    try {
      state.root =
        findRoot();

      state.scene =
        qs(
          [
            "[data-compass-scene]",
            ".compass-scene"
          ],
          state.root
        );

      state.mount =
        qs(
          [
            "[data-compass-crystals-mount]",
            ".compass-scene__visual"
          ],
          state.root
        );

      emitReceipt({
        rootStatus:
          state.root
            ? "found"
            : "missing",

        sceneStatus:
          state.scene
            ? "found"
            : "missing",

        mountStatus:
          state.mount
            ? "found"
            : "missing",

        initializationStage:
          "DOM resolution"
      });

      if (!state.root) {
        throw new Error(
          "MISSING_DATA_COMPASS_ROOT"
        );
      }

      if (!state.scene) {
        throw new Error(
          "MISSING_DATA_COMPASS_SCENE"
        );
      }

      if (!state.mount) {
        throw new Error(
          "MISSING_DATA_COMPASS_CRYSTALS_MOUNT"
        );
      }

      state.canvas =
        ensureCanvas(
          state.mount
        );

      emitReceipt({
        canvasStatus:
          "created-or-found",

        initializationStage:
          "canvas"
      });

      const gl =
        getGL(
          state.canvas
        );

      if (!gl) {
        emitFailure(
          "WebGL context creation",
          "WEBGL_CONTEXT_UNAVAILABLE",
          {
            webglContextStatus:
              "unavailable"
          }
        );

        return;
      }

      state.gl =
        gl;

      emitReceipt({
        webglContextStatus:
          "acquired",

        initializationStage:
          "WebGL context creation"
      });

      bindContextLifecycle();

      gl.enable(
        gl.DEPTH_TEST
      );

      gl.depthFunc(
        gl.LEQUAL
      );

      gl.enable(
        gl.BLEND
      );

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );

      gl.disable(
        gl.CULL_FACE
      );

      state.program =
        createProgram(gl);

      emitReceipt({
        shaderStatus:
          "compiled",

        programStatus:
          "linked",

        shaderProgramsLinked:
          true,

        initializationStage:
          "shader compilation"
      });

      state.attribs = {
        position:
          gl.getAttribLocation(
            state.program,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            state.program,
            "aNormal"
          ),

        color:
          gl.getAttribLocation(
            state.program,
            "aColor"
          )
      };

      state.uniforms = {
        model:
          gl.getUniformLocation(
            state.program,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            state.program,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            state.program,
            "uProjection"
          ),

        normalMatrix:
          gl.getUniformLocation(
            state.program,
            "uNormalMatrix"
          ),

        time:
          gl.getUniformLocation(
            state.program,
            "uTime"
          ),

        diagnosticMode:
          gl.getUniformLocation(
            state.program,
            "uDiagnosticMode"
          ),

        prominence:
          gl.getUniformLocation(
            state.program,
            "uProminence"
          ),

        specular:
          gl.getUniformLocation(
            state.program,
            "uSpecular"
          ),

        rim:
          gl.getUniformLocation(
            state.program,
            "uRim"
          ),

        emissive:
          gl.getUniformLocation(
            state.program,
            "uEmissive"
          ),

        alpha:
          gl.getUniformLocation(
            state.program,
            "uAlpha"
          ),

        sparkle:
          gl.getUniformLocation(
            state.program,
            "uSparkle"
          ),

        twinkle:
          gl.getUniformLocation(
            state.program,
            "uTwinkle"
          ),

        contrast:
          gl.getUniformLocation(
            state.program,
            "uContrast"
          ),

        haloStrength:
          gl.getUniformLocation(
            state.program,
            "uHaloStrength"
          ),

        haloPass:
          gl.getUniformLocation(
            state.program,
            "uHaloPass"
          ),

        haloExpansion:
          gl.getUniformLocation(
            state.program,
            "uHaloExpansion"
          ),

        keyLight:
          gl.getUniformLocation(
            state.program,
            "uKeyLight"
          ),

        fillLight:
          gl.getUniformLocation(
            state.program,
            "uFillLight"
          ),

        rimLight:
          gl.getUniformLocation(
            state.program,
            "uRimLight"
          ),

        ambientColor:
          gl.getUniformLocation(
            state.program,
            "uAmbientColor"
          )
      };

      state.meshes =
        buildMeshes(gl);

      state.registry =
        buildRegistry();

      bindPointerBridge();

      state.shootingStar.nextMs =
        performance.now() +
        BACKGROUND.shootingStarIntervalMs;

      state.running =
        true;

      state.raf =
        globalThis.requestAnimationFrame(
          render
        );

      emitReceipt({
        rendererInitialized:
          true,

        renderLoopStatus:
          "active",

        initializationStage:
          "render-loop startup",

        mirrorlandMeshLoaded:
          false,

        mirrorlandRegistryNodePresent:
          false,

        mirrorlandSemanticSyncEnabled:
          false,

        mirrorlandHitTestingEnabled:
          false,

        mirrorlandReviewObjectDependency:
          false,

        centerReservedForMirrorlandThreshold:
          true
      });
    } catch (error) {
      emitFailure(
        "initialization",
        "CRYSTALS_INIT_FAILURE:" +
        (
          error &&
          error.message
            ? error.message
            : String(error)
        )
      );
    }
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();
