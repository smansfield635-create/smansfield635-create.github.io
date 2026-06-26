/* /assets/compass/compass.mirrorland-window.js
   DGB Compass — Architectural Mirrorland stained-glass Window renderer.

   Scope:
   - consume the validated architectural Window object;
   - build GPU resources from retained geometry arrays;
   - render frame, lead, glass, aperture stencil, and rear motion field;
   - render a small static dormant Window;
   - expand the same Window during reveal;
   - expose restrained motion only after activation;
   - emit completion/failure receipts and events.

   This file does not own:
   - Compass navigation;
   - controller state;
   - route execution;
   - cardinal or petal rendering;
   - constellation gestures;
   - semantic HTML controls;
   - Mirrorland geometry generation.

   Required script order:
   1. compass.controller.js
   2. DGB_MIRRORLAND_ARCHITECTURAL_STAINED_GLASS_WINDOW_PREBUILD_v1.js
   3. DGB_MIRRORLAND_ARCHITECTURAL_STAINED_GLASS_WINDOW_OBJECT_v1.js
   4. compass.mirrorland-window.js
   5. compass.crystals.js
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "DGB_COMPASS_MIRRORLAND_ARCHITECTURAL_WINDOW_RENDERER_TNT_v3",

    file:
      "/assets/compass/compass.mirrorland-window.js",

    role:
      "MIRRORLAND_ARCHITECTURAL_WINDOW_RENDERER",

    geometryObjectId:
      "DGB_MIRRORLAND_ARCHITECTURAL_STAINED_GLASS_WINDOW_OBJECT_v1",

    prebuildId:
      "DGB_MIRRORLAND_ARCHITECTURAL_STAINED_GLASS_WINDOW_PREBUILD_v1",

    geometryGenerationAuthorized:
      false,

    sourceGeometryMutationAuthorized:
      false,

    navigationAuthority:
      false,

    controllerAuthority:
      false,

    semanticControlAuthority:
      false,

    cardinalRenderingAuthority:
      false,

    petalRenderingAuthority:
      false,

    crystalsAuthority:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const STATES = Object.freeze({
    DORMANT:
      "dormant",

    REVEALING:
      "revealing",

    FOCUSED:
      "focused",

    WITHDRAWING:
      "withdrawing",

    NAVIGATING:
      "navigating"
  });

  const STATE_VALUES =
    Object.freeze(
      Object.values(STATES)
    );

  const DEFAULT_PROFILES = Object.freeze({
    dormant:
      Object.freeze({
        scale:
          0.31,

        motionOpacity:
          0,

        glassTransmission:
          0.52,

        glassEmissive:
          0.72,

        frameHighlight:
          0.74,

        leadContrast:
          0.88,

        parallax:
          0,

        revealProgress:
          0
      }),

    revealing:
      Object.freeze({
        startScale:
          0.31,

        endScale:
          1,

        durationMs:
          920,

        motionDelayMs:
          380,

        motionStartOpacity:
          0,

        motionEndOpacity:
          0.82,

        glassTransmissionStart:
          0.52,

        glassTransmissionEnd:
          1,

        frameHighlightStart:
          0.74,

        frameHighlightEnd:
          1,

        leadContrastStart:
          0.88,

        leadContrastEnd:
          1
      }),

    focused:
      Object.freeze({
        scale:
          1,

        motionOpacity:
          0.88,

        glassTransmission:
          1,

        glassEmissive:
          1,

        frameHighlight:
          1,

        leadContrast:
          1,

        parallax:
          1,

        revealProgress:
          1
      }),

    withdrawing:
      Object.freeze({
        startScale:
          1,

        endScale:
          0.31,

        durationMs:
          760,

        motionStartOpacity:
          0.88,

        motionEndOpacity:
          0,

        glassTransmissionStart:
          1,

        glassTransmissionEnd:
          0.52,

        frameHighlightStart:
          1,

        frameHighlightEnd:
          0.74,

        leadContrastStart:
          1,

        leadContrastEnd:
          0.88
      }),

    navigating:
      Object.freeze({
        scale:
          1.04,

        motionOpacity:
          1,

        glassTransmission:
          1,

        glassEmissive:
          1,

        frameHighlight:
          1.08,

        leadContrast:
          1.04,

        parallax:
          1,

        revealProgress:
          1
      })
  });

  const QUALITY = Object.freeze({
    devicePixelRatioCap:
      2,

    fieldOfViewRadians:
      Math.PI / 4.7,

    near:
      0.1,

    far:
      40,

    cameraZDesktop:
      3.45,

    cameraZMobile:
      3.72,

    mobileAspectThreshold:
      0.82,

    maximumParallaxX:
      0.055,

    maximumParallaxY:
      0.038,

    transitionCompletionTolerance:
      0.002,

    idleFrameIntervalMs:
      1000 / 24,

    activeFrameIntervalMs:
      1000 / 60
  });

  const EVENTS = Object.freeze({
    READY:
      "dgb:mirrorland-window-ready",

    TRANSITION_COMPLETE:
      "dgb:mirrorland-window-transition-complete",

    FAILURE:
      "dgb:mirrorland-window-failure",

    RECEIPT:
      "dgb:mirrorland-window-receipt"
  });

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    rendererRole:
      CONTRACT.role,

    geometryObjectId:
      CONTRACT.geometryObjectId,

    rendererInitialized:
      false,

    geometryObjectFound:
      false,

    geometryObjectValidated:
      false,

    sourceGeometryMutated:
      false,

    frameBuffersBuilt:
      false,

    leadBuffersBuilt:
      false,

    glassBuffersBuilt:
      false,

    apertureBuffersBuilt:
      false,

    motionBuffersBuilt:
      false,

    apertureUsesStencilMask:
      true,

    apertureDrawnAsOpaqueForeground:
      false,

    dormantMiniatureEnabled:
      true,

    dormantMotionVisible:
      false,

    dormantMotionRunning:
      false,

    focusedMotionVisible:
      false,

    focusedMotionRunning:
      false,

    currentState:
      STATES.DORMANT,

    previousState:
      "",

    currentScale:
      DEFAULT_PROFILES.dormant.scale,

    currentMotionOpacity:
      0,

    currentGlassTransmission:
      DEFAULT_PROFILES.dormant.glassTransmission,

    transitionProgress:
      0,

    transitionRunning:
      false,

    transitionCompletionEmitted:
      false,

    reducedMotion:
      false,

    reducedMotionUsesStaticRearLight:
      false,

    canvasStatus:
      "pending",

    webglStatus:
      "pending",

    stencilStatus:
      "pending",

    shaderStatus:
      "pending",

    bufferStatus:
      "pending",

    renderLoopStatus:
      "pending",

    drawCallsLastFrame:
      0,

    frameDrawCallsLastFrame:
      0,

    leadDrawCallsLastFrame:
      0,

    glassDrawCallsLastFrame:
      0,

    motionDrawCallsLastFrame:
      0,

    stencilDrawCallsLastFrame:
      0,

    glError:
      "not-checked",

    failureReason:
      null,

    visualPassClaimed:
      false
  };

  const state = {
    root:
      null,

    scene:
      null,

    mount:
      null,

    canvas:
      null,

    gl:
      null,

    geometryObject:
      null,

    programs:
      Object.create(null),

    resources:
      Object.create(null),

    locations:
      Object.create(null),

    running:
      false,

    raf:
      0,

    lastRenderMs:
      0,

    lastReceiptMs:
      0,

    width:
      1,

    height:
      1,

    pixelRatio:
      1,

    reducedMotion:
      false,

    currentState:
      STATES.DORMANT,

    previousState:
      "",

    stateEnteredAtMs:
      0,

    transitionCompletionEmitted:
      false,

    currentProfile: {
      scale:
        DEFAULT_PROFILES.dormant.scale,

      motionOpacity:
        0,

      glassTransmission:
        DEFAULT_PROFILES.dormant.glassTransmission,

      glassEmissive:
        DEFAULT_PROFILES.dormant.glassEmissive,

      frameHighlight:
        DEFAULT_PROFILES.dormant.frameHighlight,

      leadContrast:
        DEFAULT_PROFILES.dormant.leadContrast,

      parallax:
        0,

      revealProgress:
        0
    },

    pointer: {
      x:
        0,

      y:
        0,

      targetX:
        0,

      targetY:
        0
    },

    matrices: {
      model:
        null,

      view:
        null,

      projection:
        null
    }
  };

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

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.max(
      minimum,
      Math.min(
        maximum,
        value
      )
    );
  }

  function lerp(
    start,
    end,
    amount
  ) {
    return (
      start +
      (
        end -
        start
      ) *
      amount
    );
  }

  function smoothstep01(value) {
    const t =
      clamp(
        value,
        0,
        1
      );

    return (
      t *
      t *
      (
        3 -
        2 *
        t
      )
    );
  }

  function easeOutCubic(value) {
    const t =
      clamp(
        value,
        0,
        1
      );

    return (
      1 -
      Math.pow(
        1 -
        t,
        3
      )
    );
  }

  function easeInOutCubic(value) {
    const t =
      clamp(
        value,
        0,
        1
      );

    return (
      t < 0.5
        ? 4 *
          t *
          t *
          t
        : 1 -
          Math.pow(
            -2 *
            t +
            2,
            3
          ) /
          2
    );
  }

  function normalizeState(value) {
    const candidate =
      String(
        value ||
        STATES.DORMANT
      )
        .trim()
        .toLowerCase();

    return STATE_VALUES.includes(
      candidate
    )
      ? candidate
      : STATES.DORMANT;
  }

  function dispatch(
    type,
    detail
  ) {
    const target =
      state.root ||
      document;

    target.dispatchEvent(
      new CustomEvent(
        type,
        {
          bubbles:
            true,

          detail
        }
      )
    );
  }

  function emitReceipt(
    extra = {},
    forceEvent = false
  ) {
    Object.assign(
      RECEIPT,
      {
        currentState:
          state.currentState,

        previousState:
          state.previousState,

        currentScale:
          state.currentProfile.scale,

        currentMotionOpacity:
          state.currentProfile.motionOpacity,

        currentGlassTransmission:
          state.currentProfile.glassTransmission,

        transitionProgress:
          state.currentProfile.revealProgress,

        transitionRunning:
          state.currentState ===
            STATES.REVEALING ||
          state.currentState ===
            STATES.WITHDRAWING,

        transitionCompletionEmitted:
          state.transitionCompletionEmitted,

        reducedMotion:
          state.reducedMotion,

        dormantMotionVisible:
          state.currentState ===
            STATES.DORMANT
            ? state.currentProfile.motionOpacity >
              0.001
            : false,

        dormantMotionRunning:
          state.currentState ===
            STATES.DORMANT
            ? false
            : RECEIPT.dormantMotionRunning,

        focusedMotionVisible:
          (
            state.currentState ===
              STATES.FOCUSED ||
            state.currentState ===
              STATES.NAVIGATING
          ) &&
          state.currentProfile.motionOpacity >
            0.001,

        focusedMotionRunning:
          (
            state.currentState ===
              STATES.FOCUSED ||
            state.currentState ===
              STATES.NAVIGATING
          ) &&
          !state.reducedMotion,

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
      JSON.stringify(
        RECEIPT
      );

    if (state.root) {
      state.root.dataset.compassMirrorlandWindowReceipt =
        serialized;

      state.root.dataset.compassMirrorlandWindowRendererStatus =
        RECEIPT.failureReason
          ? "held"
          : "available";

      state.root.dataset.visualPassClaimed =
        "false";
    }

    if (state.canvas) {
      state.canvas.dataset.compassMirrorlandWindowReceipt =
        serialized;

      state.canvas.dataset.visualPassClaimed =
        "false";
    }

    const receiptElement =
      state.root
        ? state.root.querySelector(
            "[data-compass-mirrorland-window-receipt]"
          )
        : null;

    if (receiptElement) {
      receiptElement.value =
        serialized;

      receiptElement.textContent =
        serialized;

      receiptElement.dataset.visualPassClaimed =
        "false";
    }

    globalThis.DGB_COMPASS_MIRRORLAND_WINDOW_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });

    const now =
      performance.now();

    if (
      forceEvent ||
      now -
        state.lastReceiptMs >
        500
    ) {
      state.lastReceiptMs =
        now;

      dispatch(
        EVENTS.RECEIPT,
        Object.freeze({
          ...RECEIPT
        })
      );
    }
  }

  function fail(
    stage,
    reason,
    extra = {}
  ) {
    state.running =
      false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );
    }

    emitReceipt(
      {
        ...extra,

        failureStage:
          stage,

        failureReason:
          reason,

        renderLoopStatus:
          "held"
      },
      true
    );

    dispatch(
      EVENTS.FAILURE,
      Object.freeze({
        contractId:
          CONTRACT.id,

        stage,

        reason
      })
    );
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_MIRRORLAND_WINDOW =
      Object.freeze({
        contract:
          CONTRACT,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        start:
          () => {
            if (
              !state.running &&
              state.gl &&
              state.programs.surface
            ) {
              state.running =
                true;

              state.lastRenderMs =
                0;

              state.raf =
                requestAnimationFrame(
                  render
                );

              emitReceipt({
                renderLoopStatus:
                  "active"
              });
            }
          },

        stop:
          () => {
            state.running =
              false;

            cancelAnimationFrame(
              state.raf
            );

            emitReceipt({
              renderLoopStatus:
                "stopped"
            });
          },

        dispose:
          dispose,

        requestRender:
          () => {
            if (
              !state.running &&
              state.gl
            ) {
              renderOnce(
                performance.now()
              );
            }
          }
      });
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

  function resolveGeometryObject() {
    const object =
      globalThis[
        CONTRACT.geometryObjectId
      ];

    if (!object) {
      throw new Error(
        "ARCHITECTURAL_WINDOW_OBJECT_UNAVAILABLE"
      );
    }

    if (
      object.identity !==
      CONTRACT.geometryObjectId
    ) {
      throw new Error(
        "ARCHITECTURAL_WINDOW_OBJECT_IDENTITY_INVALID"
      );
    }

    if (
      !object.validation ||
      object.validation.result !==
        "REVIEW_PASS" ||
      object.validation.structurallyValid !==
        true
    ) {
      throw new Error(
        "ARCHITECTURAL_WINDOW_OBJECT_VALIDATION_FAILED"
      );
    }

    if (
      !object.geometry ||
      !object.geometry.frame ||
      !object.geometry.lead ||
      !object.geometry.glass ||
      !object.geometry.apertureMask ||
      !object.geometry.motionBoundary
    ) {
      throw new Error(
        "ARCHITECTURAL_WINDOW_GEOMETRY_INCOMPLETE"
      );
    }

    return object;
  }

  function ensureCanvas(mount) {
    const existing =
      mount.querySelector(
        "canvas[data-compass-mirrorland-window-canvas]"
      );

    if (existing) {
      return existing;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.setAttribute(
      "data-compass-mirrorland-window-canvas",
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

    canvas.style.position =
      "absolute";

    canvas.style.inset =
      "0";

    canvas.style.display =
      "block";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.pointerEvents =
      "none";

    if (
      getComputedStyle(
        mount
      ).position ===
      "static"
    ) {
      mount.style.position =
        "absolute";

      mount.style.inset =
        "0";
    }

    mount.appendChild(
      canvas
    );

    return canvas;
  }

  function createContext(canvas) {
    return canvas.getContext(
      "webgl",
      {
        alpha:
          true,

        antialias:
          true,

        depth:
          true,

        stencil:
          true,

        premultipliedAlpha:
          true,

        preserveDrawingBuffer:
          false,

        powerPreference:
          "high-performance"
      }
    );
  }

  const surfaceVertexShader = `
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
        vec4(
          aPosition,
          1.0
        );

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

      gl_Position =
        uProjection *
        view;
    }
  `;

  const surfaceFragmentShader = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    uniform float uTime;
    uniform float uMaterialKind;
    uniform float uOpacity;
    uniform float uTransmission;
    uniform float uEmissive;
    uniform float uHighlight;
    uniform float uContrast;
    uniform float uRevealProgress;
    uniform float uReducedMotion;

    uniform vec3 uKeyLight;
    uniform vec3 uFillLight;
    uniform vec3 uRimLight;

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
        normalize(
          vNormal
        );

      vec3 viewDirection =
        normalize(
          -vViewPosition
        );

      float cameraFacing =
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
              -uKeyLight
            )
          ),
          0.0
        );

      float fill =
        max(
          dot(
            normal,
            normalize(
              -uFillLight
            )
          ),
          0.0
        );

      float rim =
        pow(
          1.0 -
          cameraFacing,
          2.1
        );

      float grain =
        hash31(
          floor(
            vWorldPosition *
            93.0
          )
        );

      if (
        uMaterialKind <
        0.5
      ) {
        vec3 metalBase =
          vColor *
          (
            0.36 +
            key *
            0.52 +
            fill *
            0.18
          );

        vec3 warmEdge =
          vec3(
            0.62,
            0.42,
            0.17
          ) *
          rim *
          0.22 *
          uHighlight;

        float patina =
          (
            grain -
            0.5
          ) *
          0.06;

        vec3 color =
          metalBase +
          warmEdge +
          patina;

        gl_FragColor =
          vec4(
            color,
            uOpacity
          );

        return;
      }

      if (
        uMaterialKind <
        1.5
      ) {
        vec3 leadBase =
          vColor *
          (
            0.42 +
            key *
            0.34 +
            fill *
            0.10
          ) *
          uContrast;

        vec3 coolEdge =
          vec3(
            0.18,
            0.23,
            0.29
          ) *
          rim *
          0.13;

        float oxidation =
          (
            grain -
            0.5
          ) *
          0.035;

        vec3 color =
          leadBase +
          coolEdge +
          oxidation;

        gl_FragColor =
          vec4(
            color,
            uOpacity
          );

        return;
      }

      float irregularity =
        (
          hash31(
            vWorldPosition *
            51.0 +
            normal *
            7.0
          ) -
          0.5
        );

      float highlight =
        pow(
          max(
            dot(
              reflect(
                normalize(
                  uKeyLight
                ),
                normal
              ),
              viewDirection
            ),
            0.0
          ),
          24.0
        );

      float edgeAbsorption =
        pow(
          1.0 -
          cameraFacing,
          1.45
        );

      float dormantRestraint =
        mix(
          0.76,
          1.0,
          uRevealProgress
        );

      vec3 transmittedColor =
        vColor *
        (
          0.72 +
          key *
          0.20 +
          fill *
          0.10
        ) *
        dormantRestraint;

      transmittedColor +=
        vec3(
          0.62,
          0.78,
          0.94
        ) *
        rim *
        0.12;

      transmittedColor +=
        vec3(
          1.0,
          0.91,
          0.72
        ) *
        highlight *
        0.22 *
        uHighlight;

      transmittedColor +=
        vColor *
        uEmissive *
        0.12;

      transmittedColor *=
        1.0 +
        irregularity *
        0.11;

      transmittedColor *=
        1.0 -
        edgeAbsorption *
        0.18;

      float glassAlpha =
        clamp(
          uOpacity *
          (
            0.56 +
            (
              1.0 -
              uTransmission
            ) *
            0.32 +
            edgeAbsorption *
            0.08
          ),
          0.24,
          0.92
        );

      gl_FragColor =
        vec4(
          transmittedColor,
          glassAlpha
        );
    }
  `;

  const motionVertexShader = `
    attribute vec3 aPosition;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vec4 world =
        uModel *
        vec4(
          aPosition,
          1.0
        );

      vWorldPosition =
        world.xyz;

      vUv =
        aPosition.xy *
        0.5 +
        0.5;

      gl_Position =
        uProjection *
        uView *
        world;
    }
  `;

  const motionFragmentShader = `
    precision mediump float;

    varying vec2 vUv;
    varying vec3 vWorldPosition;

    uniform float uTime;
    uniform float uOpacity;
    uniform float uReducedMotion;
    uniform float uRevealProgress;
    uniform vec2 uParallax;

    float hash21(vec2 p) {
      return fract(
        sin(
          dot(
            p,
            vec2(
              127.1,
              311.7
            )
          )
        ) *
        43758.5453123
      );
    }

    float noise(vec2 p) {
      vec2 i =
        floor(p);

      vec2 f =
        fract(p);

      vec2 u =
        f *
        f *
        (
          3.0 -
          2.0 *
          f
        );

      return mix(
        mix(
          hash21(
            i +
            vec2(
              0.0,
              0.0
            )
          ),
          hash21(
            i +
            vec2(
              1.0,
              0.0
            )
          ),
          u.x
        ),
        mix(
          hash21(
            i +
            vec2(
              0.0,
              1.0
            )
          ),
          hash21(
            i +
            vec2(
              1.0,
              1.0
            )
          ),
          u.x
        ),
        u.y
      );
    }

    float fbm(vec2 p) {
      float value =
        0.0;

      float amplitude =
        0.5;

      for (
        int index = 0;
        index < 4;
        index++
      ) {
        value +=
          noise(p) *
          amplitude;

        p =
          p *
          2.02 +
          vec2(
            17.1,
            9.2
          );

        amplitude *=
          0.5;
      }

      return value;
    }

    void main() {
      float activeTime =
        uReducedMotion >
        0.5
          ? 0.0
          : uTime;

      vec2 centered =
        vUv -
        0.5;

      float radial =
        length(
          centered
        );

      vec2 parallaxUv =
        vUv +
        uParallax *
        (
          0.24 +
          radial *
          0.16
        );

      float distant =
        fbm(
          parallaxUv *
          3.2 +
          vec2(
            activeTime *
            0.018,
            -activeTime *
            0.012
          )
        );

      float veil =
        fbm(
          parallaxUv *
          5.0 +
          vec2(
            -activeTime *
            0.026,
            activeTime *
            0.015
          )
        );

      float nearShadow =
        fbm(
          parallaxUv *
          7.6 +
          vec2(
            activeTime *
            0.014,
            activeTime *
            0.009
          )
        );

      float distantLight =
        smoothstep(
          0.47,
          0.82,
          distant
        );

      float atmosphericVeil =
        smoothstep(
          0.35,
          0.78,
          veil
        );

      float shadowDrift =
        smoothstep(
          0.44,
          0.76,
          nearShadow
        );

      vec3 deepWorld =
        vec3(
          0.015,
          0.042,
          0.090
        );

      vec3 mineralLight =
        vec3(
          0.080,
          0.300,
          0.410
        ) *
        distantLight *
        0.72;

      vec3 violetDistance =
        vec3(
          0.220,
          0.110,
          0.350
        ) *
        atmosphericVeil *
        0.38;

      vec3 oldGold =
        vec3(
          0.520,
          0.310,
          0.095
        ) *
        pow(
          distantLight,
          2.3
        ) *
        0.24;

      vec3 color =
        deepWorld +
        mineralLight +
        violetDistance +
        oldGold;

      color *=
        1.0 -
        shadowDrift *
        0.24;

      float edgeFade =
        smoothstep(
          0.51,
          0.38,
          radial
        );

      float reveal =
        smoothstep(
          0.04,
          0.72,
          uRevealProgress
        );

      gl_FragColor =
        vec4(
          color,
          uOpacity *
          edgeFade *
          reveal
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
        "UNKNOWN_SHADER_COMPILE_ERROR";

      gl.deleteShader(
        shader
      );

      throw new Error(
        info
      );
    }

    return shader;
  }

  function createProgram(
    gl,
    vertexSource,
    fragmentSource
  ) {
    const vertexShader =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexSource
      );

    const fragmentShader =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentSource
      );

    const program =
      gl.createProgram();

    gl.attachShader(
      program,
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(
      vertexShader
    );

    gl.deleteShader(
      fragmentShader
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

      throw new Error(
        info
      );
    }

    return program;
  }

  function createBuffer(
    gl,
    target,
    data
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
      gl.STATIC_DRAW
    );

    return buffer;
  }

  function buildGpuResource(
    gl,
    geometry
  ) {
    if (
      !geometry ||
      !geometry.positions ||
      !geometry.normals ||
      !geometry.colors ||
      !geometry.indices
    ) {
      throw new Error(
        "GEOMETRY_RESOURCE_INCOMPLETE:" +
        (
          geometry &&
          geometry.id
            ? geometry.id
            : "UNKNOWN"
        )
      );
    }

    const indexType =
      geometry.indexType ===
      "UNSIGNED_INT"
        ? gl.UNSIGNED_INT
        : gl.UNSIGNED_SHORT;

    if (
      indexType ===
      gl.UNSIGNED_INT
    ) {
      const extension =
        gl.getExtension(
          "OES_element_index_uint"
        );

      if (!extension) {
        throw new Error(
          "UNSIGNED_INT_INDEX_EXTENSION_UNAVAILABLE:" +
          geometry.id
        );
      }
    }

    return Object.freeze({
      id:
        geometry.id,

      materialId:
        geometry.materialId,

      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          geometry.positions
        ),

      normal:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          geometry.normals
        ),

      color:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          geometry.colors
        ),

      index:
        createBuffer(
          gl,
          gl.ELEMENT_ARRAY_BUFFER,
          geometry.indices
        ),

      indexCount:
        geometry.indices.length,

      indexType,

      vertexCount:
        geometry.vertexCount,

      triangleCount:
        geometry.triangleCount
    });
  }

  function buildPrograms(gl) {
    const surface =
      createProgram(
        gl,
        surfaceVertexShader,
        surfaceFragmentShader
      );

    const motion =
      createProgram(
        gl,
        motionVertexShader,
        motionFragmentShader
      );

    state.programs.surface =
      surface;

    state.programs.motion =
      motion;

    state.locations.surface = {
      attributes: {
        position:
          gl.getAttribLocation(
            surface,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            surface,
            "aNormal"
          ),

        color:
          gl.getAttribLocation(
            surface,
            "aColor"
          )
      },

      uniforms: {
        model:
          gl.getUniformLocation(
            surface,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            surface,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            surface,
            "uProjection"
          ),

        normalMatrix:
          gl.getUniformLocation(
            surface,
            "uNormalMatrix"
          ),

        time:
          gl.getUniformLocation(
            surface,
            "uTime"
          ),

        materialKind:
          gl.getUniformLocation(
            surface,
            "uMaterialKind"
          ),

        opacity:
          gl.getUniformLocation(
            surface,
            "uOpacity"
          ),

        transmission:
          gl.getUniformLocation(
            surface,
            "uTransmission"
          ),

        emissive:
          gl.getUniformLocation(
            surface,
            "uEmissive"
          ),

        highlight:
          gl.getUniformLocation(
            surface,
            "uHighlight"
          ),

        contrast:
          gl.getUniformLocation(
            surface,
            "uContrast"
          ),

        revealProgress:
          gl.getUniformLocation(
            surface,
            "uRevealProgress"
          ),

        reducedMotion:
          gl.getUniformLocation(
            surface,
            "uReducedMotion"
          ),

        keyLight:
          gl.getUniformLocation(
            surface,
            "uKeyLight"
          ),

        fillLight:
          gl.getUniformLocation(
            surface,
            "uFillLight"
          ),

        rimLight:
          gl.getUniformLocation(
            surface,
            "uRimLight"
          )
      }
    };

    state.locations.motion = {
      attributes: {
        position:
          gl.getAttribLocation(
            motion,
            "aPosition"
          )
      },

      uniforms: {
        model:
          gl.getUniformLocation(
            motion,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            motion,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            motion,
            "uProjection"
          ),

        time:
          gl.getUniformLocation(
            motion,
            "uTime"
          ),

        opacity:
          gl.getUniformLocation(
            motion,
            "uOpacity"
          ),

        reducedMotion:
          gl.getUniformLocation(
            motion,
            "uReducedMotion"
          ),

        revealProgress:
          gl.getUniformLocation(
            motion,
            "uRevealProgress"
          ),

        parallax:
          gl.getUniformLocation(
            motion,
            "uParallax"
          )
      }
    };
  }

  function buildResources(gl) {
    const geometry =
      state.geometryObject.geometry;

    state.resources.frame =
      buildGpuResource(
        gl,
        geometry.frame
      );

    state.resources.lead =
      buildGpuResource(
        gl,
        geometry.lead
      );

    state.resources.glass =
      buildGpuResource(
        gl,
        geometry.glass
      );

    state.resources.aperture =
      buildGpuResource(
        gl,
        geometry.apertureMask
      );

    state.resources.motion =
      buildGpuResource(
        gl,
        geometry.motionBoundary
      );

    emitReceipt({
      frameBuffersBuilt:
        true,

      leadBuffersBuilt:
        true,

      glassBuffersBuilt:
        true,

      apertureBuffersBuilt:
        true,

      motionBuffersBuilt:
        true,

      bufferStatus:
        "built"
    });
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(
    a,
    b
  ) {
    const result =
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
          result[
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

    return result;
  }

  function translate4(
    x,
    y,
    z
  ) {
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

  function scale4(
    x,
    y,
    z
  ) {
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

  function perspective4(
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const factor =
      1 /
      Math.tan(
        fieldOfView /
        2
      );

    const rangeInverse =
      1 /
      (
        near -
        far
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
        far +
        near
      ) *
      rangeInverse,
      -1,

      0,
      0,
      (
        2 *
        far *
        near
      ) *
      rangeInverse,
      0
    ];
  }

  function subtract3(
    a,
    b
  ) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function cross3(
    a,
    b
  ) {
    return [
      a[1] * b[2] -
      a[2] * b[1],

      a[2] * b[0] -
      a[0] * b[2],

      a[0] * b[1] -
      a[1] * b[0]
    ];
  }

  function normalize3(vector) {
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

  function dot3(
    a,
    b
  ) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function lookAt4(
    eye,
    center,
    up
  ) {
    const z =
      normalize3(
        subtract3(
          eye,
          center
        )
      );

    const x =
      normalize3(
        cross3(
          up,
          z
        )
      );

    const y =
      cross3(
        z,
        x
      );

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot3(x, eye),
      -dot3(y, eye),
      -dot3(z, eye),
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

  function readControllerState(nowMs) {
    const dataset =
      state.root.dataset ||
      {};

    const requestedState =
      normalizeState(
        dataset.mirrorlandWindowState
      );

    if (
      requestedState !==
      state.currentState
    ) {
      state.previousState =
        state.currentState;

      state.currentState =
        requestedState;

      state.stateEnteredAtMs =
        nowMs;

      state.transitionCompletionEmitted =
        false;
    }

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
  }

  function profileForState(nowMs) {
    const objectProfiles =
      state.geometryObject.runtimeProfiles ||
      {};

    const dormant =
      objectProfiles.dormant ||
      DEFAULT_PROFILES.dormant;

    const revealing =
      objectProfiles.revealing ||
      DEFAULT_PROFILES.revealing;

    const focused =
      objectProfiles.focused ||
      DEFAULT_PROFILES.focused;

    const withdrawing =
      objectProfiles.withdrawing ||
      DEFAULT_PROFILES.withdrawing;

    const navigating =
      objectProfiles.navigating ||
      DEFAULT_PROFILES.navigating;

    if (
      state.currentState ===
      STATES.DORMANT
    ) {
      return {
        scale:
          dormant.scale ??
          DEFAULT_PROFILES.dormant.scale,

        motionOpacity:
          0,

        glassTransmission:
          dormant.glassTransmissionMultiplier ??
          DEFAULT_PROFILES.dormant.glassTransmission,

        glassEmissive:
          dormant.glassEmissiveMultiplier ??
          DEFAULT_PROFILES.dormant.glassEmissive,

        frameHighlight:
          dormant.frameHighlightMultiplier ??
          DEFAULT_PROFILES.dormant.frameHighlight,

        leadContrast:
          dormant.leadContrastMultiplier ??
          DEFAULT_PROFILES.dormant.leadContrast,

        parallax:
          0,

        revealProgress:
          0
      };
    }

    if (
      state.currentState ===
      STATES.REVEALING
    ) {
      const duration =
        state.reducedMotion
          ? 1
          : revealing.durationMs ??
            DEFAULT_PROFILES.revealing.durationMs;

      const rawProgress =
        clamp(
          (
            nowMs -
            state.stateEnteredAtMs
          ) /
          Math.max(
            1,
            duration
          ),
          0,
          1
        );

      const eased =
        easeOutCubic(
          rawProgress
        );

      const motionDelay =
        state.reducedMotion
          ? 0
          : revealing.motionStartDelayMs ??
            DEFAULT_PROFILES.revealing.motionDelayMs;

      const motionDuration =
        Math.max(
          1,
          duration -
          motionDelay
        );

      const motionProgress =
        clamp(
          (
            nowMs -
            state.stateEnteredAtMs -
            motionDelay
          ) /
          motionDuration,
          0,
          1
        );

      return {
        scale:
          lerp(
            revealing.startScale ??
              dormant.scale ??
              DEFAULT_PROFILES.revealing.startScale,

            revealing.endScale ??
              focused.scale ??
              DEFAULT_PROFILES.revealing.endScale,

            eased
          ),

        motionOpacity:
          state.reducedMotion
            ? lerp(
                0,
                0.34,
                smoothstep01(
                  motionProgress
                )
              )
            : lerp(
                revealing.motionFieldStartOpacity ??
                  DEFAULT_PROFILES.revealing.motionStartOpacity,

                revealing.motionFieldEndOpacity ??
                  DEFAULT_PROFILES.revealing.motionEndOpacity,

                smoothstep01(
                  motionProgress
                )
              ),

        glassTransmission:
          lerp(
            revealing.glassTransmissionStart ??
              DEFAULT_PROFILES.revealing.glassTransmissionStart,

            revealing.glassTransmissionEnd ??
              DEFAULT_PROFILES.revealing.glassTransmissionEnd,

            eased
          ),

        glassEmissive:
          lerp(
            dormant.glassEmissiveMultiplier ??
              DEFAULT_PROFILES.dormant.glassEmissive,

            focused.glassEmissiveMultiplier ??
              DEFAULT_PROFILES.focused.glassEmissive,

            eased
          ),

        frameHighlight:
          lerp(
            revealing.frameHighlightStart ??
              DEFAULT_PROFILES.revealing.frameHighlightStart,

            revealing.frameHighlightEnd ??
              DEFAULT_PROFILES.revealing.frameHighlightEnd,

            eased
          ),

        leadContrast:
          lerp(
            revealing.leadContrastStart ??
              DEFAULT_PROFILES.revealing.leadContrastStart,

            revealing.leadContrastEnd ??
              DEFAULT_PROFILES.revealing.leadContrastEnd,

            eased
          ),

        parallax:
          eased,

        revealProgress:
          rawProgress
      };
    }

    if (
      state.currentState ===
      STATES.WITHDRAWING
    ) {
      const duration =
        state.reducedMotion
          ? 1
          : withdrawing.durationMs ??
            DEFAULT_PROFILES.withdrawing.durationMs;

      const rawProgress =
        clamp(
          (
            nowMs -
            state.stateEnteredAtMs
          ) /
          Math.max(
            1,
            duration
          ),
          0,
          1
        );

      const eased =
        easeInOutCubic(
          rawProgress
        );

      return {
        scale:
          lerp(
            withdrawing.startScale ??
              DEFAULT_PROFILES.withdrawing.startScale,

            withdrawing.endScale ??
              DEFAULT_PROFILES.withdrawing.endScale,

            eased
          ),

        motionOpacity:
          lerp(
            withdrawing.motionFieldStartOpacity ??
              DEFAULT_PROFILES.withdrawing.motionStartOpacity,

            withdrawing.motionFieldEndOpacity ??
              DEFAULT_PROFILES.withdrawing.motionEndOpacity,

            smoothstep01(
              rawProgress
            )
          ),

        glassTransmission:
          lerp(
            withdrawing.glassTransmissionStart ??
              DEFAULT_PROFILES.withdrawing.glassTransmissionStart,

            withdrawing.glassTransmissionEnd ??
              DEFAULT_PROFILES.withdrawing.glassTransmissionEnd,

            eased
          ),

        glassEmissive:
          lerp(
            focused.glassEmissiveMultiplier ??
              DEFAULT_PROFILES.focused.glassEmissive,

            dormant.glassEmissiveMultiplier ??
              DEFAULT_PROFILES.dormant.glassEmissive,

            eased
          ),

        frameHighlight:
          lerp(
            withdrawing.frameHighlightStart ??
              DEFAULT_PROFILES.withdrawing.frameHighlightStart,

            withdrawing.frameHighlightEnd ??
              DEFAULT_PROFILES.withdrawing.frameHighlightEnd,

            eased
          ),

        leadContrast:
          lerp(
            withdrawing.leadContrastStart ??
              DEFAULT_PROFILES.withdrawing.leadContrastStart,

            withdrawing.leadContrastEnd ??
              DEFAULT_PROFILES.withdrawing.leadContrastEnd,

            eased
          ),

        parallax:
          1 -
          eased,

        revealProgress:
          1 -
          rawProgress
      };
    }

    if (
      state.currentState ===
      STATES.NAVIGATING
    ) {
      return {
        scale:
          navigating.scale ??
          DEFAULT_PROFILES.navigating.scale,

        motionOpacity:
          state.reducedMotion
            ? 0.42
            : navigating.motionFieldOpacity ??
              DEFAULT_PROFILES.navigating.motionOpacity,

        glassTransmission:
          navigating.glassTransmissionMultiplier ??
          DEFAULT_PROFILES.navigating.glassTransmission,

        glassEmissive:
          navigating.glassEmissiveMultiplier ??
          DEFAULT_PROFILES.navigating.glassEmissive,

        frameHighlight:
          navigating.frameHighlightMultiplier ??
          DEFAULT_PROFILES.navigating.frameHighlight,

        leadContrast:
          navigating.leadContrastMultiplier ??
          DEFAULT_PROFILES.navigating.leadContrast,

        parallax:
          1,

        revealProgress:
          1
      };
    }

    return {
      scale:
        focused.scale ??
        DEFAULT_PROFILES.focused.scale,

      motionOpacity:
        state.reducedMotion
          ? 0.42
          : focused.motionFieldOpacity ??
            DEFAULT_PROFILES.focused.motionOpacity,

      glassTransmission:
        focused.glassTransmissionMultiplier ??
        DEFAULT_PROFILES.focused.glassTransmission,

      glassEmissive:
        focused.glassEmissiveMultiplier ??
        DEFAULT_PROFILES.focused.glassEmissive,

      frameHighlight:
        focused.frameHighlightMultiplier ??
        DEFAULT_PROFILES.focused.frameHighlight,

      leadContrast:
        focused.leadContrastMultiplier ??
        DEFAULT_PROFILES.focused.leadContrast,

      parallax:
        state.reducedMotion
          ? 0
          : 1,

      revealProgress:
        1
    };
  }

  function updateProfile(nowMs) {
    state.currentProfile =
      profileForState(
        nowMs
      );

    if (
      (
        state.currentState ===
          STATES.REVEALING ||
        state.currentState ===
          STATES.WITHDRAWING
      ) &&
      state.currentProfile.revealProgress <=
        QUALITY.transitionCompletionTolerance &&
      state.currentState ===
        STATES.WITHDRAWING
    ) {
      emitTransitionComplete();
    }

    if (
      state.currentState ===
        STATES.REVEALING &&
      state.currentProfile.revealProgress >=
        1 -
        QUALITY.transitionCompletionTolerance
    ) {
      emitTransitionComplete();
    }
  }

  function emitTransitionComplete() {
    if (
      state.transitionCompletionEmitted
    ) {
      return;
    }

    state.transitionCompletionEmitted =
      true;

    const detail =
      Object.freeze({
        contractId:
          CONTRACT.id,

        state:
          state.currentState,

        previousState:
          state.previousState,

        scale:
          state.currentProfile.scale,

        motionOpacity:
          state.currentProfile.motionOpacity
      });

    dispatch(
      EVENTS.TRANSITION_COMPLETE,
      detail
    );

    const controller =
      globalThis.DGB_COMPASS_CONTROLLER;

    if (
      controller &&
      typeof controller.receiveMirrorlandWindowCompletion ===
        "function"
    ) {
      controller.receiveMirrorlandWindowCompletion(
        detail
      );
    }

    emitReceipt(
      {
        lastTransitionCompletion:
          detail
      },
      true
    );
  }

  function updatePointerParallax() {
    const amount =
      state.currentProfile.parallax;

    const targetX =
      state.reducedMotion
        ? 0
        : state.pointer.targetX *
          amount;

    const targetY =
      state.reducedMotion
        ? 0
        : state.pointer.targetY *
          amount;

    state.pointer.x =
      lerp(
        state.pointer.x,
        targetX,
        0.055
      );

    state.pointer.y =
      lerp(
        state.pointer.y,
        targetY,
        0.055
      );
  }

  function resize() {
    const rect =
      state.canvas.getBoundingClientRect();

    const ratio =
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
          ratio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height *
          ratio
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

    state.width =
      width;

    state.height =
      height;

    state.pixelRatio =
      ratio;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function updateMatrices() {
    const aspect =
      state.width /
      Math.max(
        1,
        state.height
      );

    const cameraZ =
      aspect <
      QUALITY.mobileAspectThreshold
        ? QUALITY.cameraZMobile
        : QUALITY.cameraZDesktop;

    const parallaxX =
      state.pointer.x *
      QUALITY.maximumParallaxX;

    const parallaxY =
      state.pointer.y *
      QUALITY.maximumParallaxY;

    const scale =
      state.currentProfile.scale;

    const tiltX =
      state.reducedMotion
        ? 0
        : -parallaxY *
          0.28;

    const tiltY =
      state.reducedMotion
        ? 0
        : parallaxX *
          0.34;

    state.matrices.model =
      multiply4(
        translate4(
          0,
          0,
          0
        ),

        multiply4(
          rotateY4(
            tiltY
          ),

          multiply4(
            rotateX4(
              tiltX
            ),

            scale4(
              scale,
              scale,
              scale
            )
          )
        )
      );

    state.matrices.view =
      lookAt4(
        [
          parallaxX,
          parallaxY,
          cameraZ
        ],
        [
          0,
          0,
          0
        ],
        [
          0,
          1,
          0
        ]
      );

    state.matrices.projection =
      perspective4(
        QUALITY.fieldOfViewRadians,
        aspect,
        QUALITY.near,
        QUALITY.far
      );
  }

  function bindAttribute(
    gl,
    buffer,
    location,
    size
  ) {
    if (
      location <
      0
    ) {
      return;
    }

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

  function bindSurfaceResource(resource) {
    const gl =
      state.gl;

    const locations =
      state.locations.surface;

    bindAttribute(
      gl,
      resource.position,
      locations.attributes.position,
      3
    );

    bindAttribute(
      gl,
      resource.normal,
      locations.attributes.normal,
      3
    );

    bindAttribute(
      gl,
      resource.color,
      locations.attributes.color,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      resource.index
    );
  }

  function applySurfaceMatrices(nowMs) {
    const gl =
      state.gl;

    const uniforms =
      state.locations.surface.uniforms;

    gl.uniformMatrix4fv(
      uniforms.model,
      false,
      new Float32Array(
        state.matrices.model
      )
    );

    gl.uniformMatrix4fv(
      uniforms.view,
      false,
      new Float32Array(
        state.matrices.view
      )
    );

    gl.uniformMatrix4fv(
      uniforms.projection,
      false,
      new Float32Array(
        state.matrices.projection
      )
    );

    gl.uniformMatrix3fv(
      uniforms.normalMatrix,
      false,
      new Float32Array(
        normalMatrix3(
          state.matrices.model
        )
      )
    );

    gl.uniform1f(
      uniforms.time,
      nowMs *
      0.001
    );

    gl.uniform1f(
      uniforms.revealProgress,
      state.currentProfile.revealProgress
    );

    gl.uniform1f(
      uniforms.reducedMotion,
      state.reducedMotion
        ? 1
        : 0
    );

    gl.uniform3f(
      uniforms.keyLight,
      -0.36,
      -0.74,
      -0.62
    );

    gl.uniform3f(
      uniforms.fillLight,
      0.68,
      -0.18,
      -0.48
    );

    gl.uniform3f(
      uniforms.rimLight,
      0.12,
      0.52,
      1
    );
  }

  function drawSurface(
    resource,
    options,
    nowMs
  ) {
    const gl =
      state.gl;

    const program =
      state.programs.surface;

    const uniforms =
      state.locations.surface.uniforms;

    gl.useProgram(
      program
    );

    bindSurfaceResource(
      resource
    );

    applySurfaceMatrices(
      nowMs
    );

    gl.uniform1f(
      uniforms.materialKind,
      options.materialKind
    );

    gl.uniform1f(
      uniforms.opacity,
      options.opacity
    );

    gl.uniform1f(
      uniforms.transmission,
      options.transmission
    );

    gl.uniform1f(
      uniforms.emissive,
      options.emissive
    );

    gl.uniform1f(
      uniforms.highlight,
      options.highlight
    );

    gl.uniform1f(
      uniforms.contrast,
      options.contrast
    );

    gl.drawElements(
      gl.TRIANGLES,
      resource.indexCount,
      resource.indexType,
      0
    );

    return 1;
  }

  function drawApertureStencil(nowMs) {
    const gl =
      state.gl;

    const resource =
      state.resources.aperture;

    gl.enable(
      gl.STENCIL_TEST
    );

    gl.stencilMask(
      0xFF
    );

    gl.stencilFunc(
      gl.ALWAYS,
      1,
      0xFF
    );

    gl.stencilOp(
      gl.KEEP,
      gl.KEEP,
      gl.REPLACE
    );

    gl.colorMask(
      false,
      false,
      false,
      false
    );

    gl.depthMask(
      false
    );

    gl.disable(
      gl.BLEND
    );

    drawSurface(
      resource,
      {
        materialKind:
          0,

        opacity:
          0,

        transmission:
          0,

        emissive:
          0,

        highlight:
          0,

        contrast:
          1
      },
      nowMs
    );

    gl.colorMask(
      true,
      true,
      true,
      true
    );

    gl.depthMask(
      true
    );

    gl.stencilMask(
      0x00
    );

    gl.stencilFunc(
      gl.EQUAL,
      1,
      0xFF
    );

    gl.stencilOp(
      gl.KEEP,
      gl.KEEP,
      gl.KEEP
    );

    return 1;
  }

  function drawMotion(nowMs) {
    const opacity =
      state.currentProfile.motionOpacity;

    if (
      opacity <=
      0.001
    ) {
      return 0;
    }

    const gl =
      state.gl;

    const program =
      state.programs.motion;

    const locations =
      state.locations.motion;

    const resource =
      state.resources.motion;

    gl.useProgram(
      program
    );

    bindAttribute(
      gl,
      resource.position,
      locations.attributes.position,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      resource.index
    );

    gl.uniformMatrix4fv(
      locations.uniforms.model,
      false,
      new Float32Array(
        state.matrices.model
      )
    );

    gl.uniformMatrix4fv(
      locations.uniforms.view,
      false,
      new Float32Array(
        state.matrices.view
      )
    );

    gl.uniformMatrix4fv(
      locations.uniforms.projection,
      false,
      new Float32Array(
        state.matrices.projection
      )
    );

    gl.uniform1f(
      locations.uniforms.time,
      nowMs *
      0.001
    );

    gl.uniform1f(
      locations.uniforms.opacity,
      opacity
    );

    gl.uniform1f(
      locations.uniforms.reducedMotion,
      state.reducedMotion
        ? 1
        : 0
    );

    gl.uniform1f(
      locations.uniforms.revealProgress,
      state.currentProfile.revealProgress
    );

    gl.uniform2f(
      locations.uniforms.parallax,
      state.pointer.x *
      0.018,

      state.pointer.y *
      0.014
    );

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.depthMask(
      false
    );

    gl.drawElements(
      gl.TRIANGLES,
      resource.indexCount,
      resource.indexType,
      0
    );

    gl.depthMask(
      true
    );

    return 1;
  }

  function renderScene(nowMs) {
    const gl =
      state.gl;

    resize();
    updateMatrices();

    gl.clearColor(
      0,
      0,
      0,
      0
    );

    gl.clearStencil(
      0
    );

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT |
      gl.STENCIL_BUFFER_BIT
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthFunc(
      gl.LEQUAL
    );

    gl.disable(
      gl.CULL_FACE
    );

    let drawCalls =
      0;

    let frameDrawCalls =
      0;

    let leadDrawCalls =
      0;

    let glassDrawCalls =
      0;

    let motionDrawCalls =
      0;

    let stencilDrawCalls =
      0;

    stencilDrawCalls +=
      drawApertureStencil(
        nowMs
      );

    motionDrawCalls +=
      drawMotion(
        nowMs
      );

    gl.disable(
      gl.STENCIL_TEST
    );

    gl.stencilMask(
      0xFF
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthMask(
      true
    );

    gl.disable(
      gl.BLEND
    );

    frameDrawCalls +=
      drawSurface(
        state.resources.frame,
        {
          materialKind:
            0,

          opacity:
            1,

          transmission:
            0,

          emissive:
            0,

          highlight:
            state.currentProfile.frameHighlight,

          contrast:
            1
        },
        nowMs
      );

    leadDrawCalls +=
      drawSurface(
        state.resources.lead,
        {
          materialKind:
            1,

          opacity:
            1,

          transmission:
            0,

          emissive:
            0,

          highlight:
            0.42,

          contrast:
            state.currentProfile.leadContrast
        },
        nowMs
      );

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.depthMask(
      false
    );

    glassDrawCalls +=
      drawSurface(
        state.resources.glass,
        {
          materialKind:
            2,

          opacity:
            0.88,

          transmission:
            state.currentProfile.glassTransmission,

          emissive:
            state.currentProfile.glassEmissive,

          highlight:
            state.currentProfile.frameHighlight,

          contrast:
            1
        },
        nowMs
      );

    gl.depthMask(
      true
    );

    drawCalls =
      frameDrawCalls +
      leadDrawCalls +
      glassDrawCalls +
      motionDrawCalls +
      stencilDrawCalls;

    const glError =
      gl.getError();

    emitReceipt({
      rendererInitialized:
        true,

      renderLoopStatus:
        state.running
          ? "active"
          : "single-frame",

      drawCallsLastFrame:
        drawCalls,

      frameDrawCallsLastFrame:
        frameDrawCalls,

      leadDrawCallsLastFrame:
        leadDrawCalls,

      glassDrawCallsLastFrame:
        glassDrawCalls,

      motionDrawCallsLastFrame:
        motionDrawCalls,

      stencilDrawCallsLastFrame:
        stencilDrawCalls,

      apertureUsesStencilMask:
        true,

      apertureDrawnAsOpaqueForeground:
        false,

      reducedMotionUsesStaticRearLight:
        state.reducedMotion &&
        state.currentProfile.motionOpacity >
          0.001,

      glError:
        glError ===
        gl.NO_ERROR
          ? "NO_ERROR"
          : String(
              glError
            ),

      failureReason:
        null
    });
  }

  function shouldAnimateContinuously() {
    if (
      state.currentState ===
        STATES.REVEALING ||
      state.currentState ===
        STATES.WITHDRAWING
    ) {
      return true;
    }

    if (
      (
        state.currentState ===
          STATES.FOCUSED ||
        state.currentState ===
          STATES.NAVIGATING
      ) &&
      !state.reducedMotion
    ) {
      return true;
    }

    return false;
  }

  function renderOnce(nowMs) {
    readControllerState(
      nowMs
    );

    updateProfile(
      nowMs
    );

    updatePointerParallax();

    renderScene(
      nowMs
    );
  }

  function render(nowMs) {
    if (!state.running) {
      return;
    }

    const desiredInterval =
      shouldAnimateContinuously()
        ? QUALITY.activeFrameIntervalMs
        : QUALITY.idleFrameIntervalMs;

    if (
      state.lastRenderMs &&
      nowMs -
        state.lastRenderMs <
        desiredInterval
    ) {
      state.raf =
        requestAnimationFrame(
          render
        );

      return;
    }

    state.lastRenderMs =
      nowMs;

    renderOnce(
      nowMs
    );

    state.raf =
      requestAnimationFrame(
        render
      );
  }

  function bindPointerParallax() {
    const surface =
      state.scene ||
      state.mount;

    if (!surface) {
      return;
    }

    surface.addEventListener(
      "pointermove",
      (event) => {
        if (
          state.currentState ===
            STATES.DORMANT ||
          state.reducedMotion
        ) {
          state.pointer.targetX =
            0;

          state.pointer.targetY =
            0;

          return;
        }

        const rect =
          surface.getBoundingClientRect();

        const normalizedX =
          (
            event.clientX -
            rect.left
          ) /
          Math.max(
            1,
            rect.width
          ) *
          2 -
          1;

        const normalizedY =
          (
            event.clientY -
            rect.top
          ) /
          Math.max(
            1,
            rect.height
          ) *
          2 -
          1;

        state.pointer.targetX =
          clamp(
            normalizedX,
            -1,
            1
          );

        state.pointer.targetY =
          clamp(
            -normalizedY,
            -1,
            1
          );
      },
      {
        passive:
          true
      }
    );

    surface.addEventListener(
      "pointerleave",
      () => {
        state.pointer.targetX =
          0;

        state.pointer.targetY =
          0;
      },
      {
        passive:
          true
      }
    );
  }

  function bindStateObserver() {
    const observer =
      new MutationObserver(
        (mutations) => {
          const relevant =
            mutations.some(
              (mutation) =>
                mutation.type ===
                  "attributes" &&
                (
                  mutation.attributeName ===
                    "data-mirrorland-window-state" ||
                  mutation.attributeName ===
                    "data-reduced-motion"
                )
            );

          if (
            relevant &&
            !state.running
          ) {
            renderOnce(
              performance.now()
            );
          }
        }
      );

    observer.observe(
      state.root,
      {
        attributes:
          true,

        attributeFilter: [
          "data-mirrorland-window-state",
          "data-reduced-motion"
        ]
      }
    );

    state.resources.stateObserver =
      observer;
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();

        state.running =
          false;

        cancelAnimationFrame(
          state.raf
        );

        fail(
          "context",
          "WEBGL_CONTEXT_LOST",
          {
            webglStatus:
              "lost"
          }
        );
      }
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        emitReceipt(
          {
            webglStatus:
              "restored",

            renderLoopStatus:
              "reload-required"
          },
          true
        );
      }
    );
  }

  function dispose() {
    state.running =
      false;

    cancelAnimationFrame(
      state.raf
    );

    if (
      state.resources.stateObserver
    ) {
      state.resources.stateObserver.disconnect();
    }

    if (state.gl) {
      [
        "frame",
        "lead",
        "glass",
        "aperture",
        "motion"
      ].forEach((key) => {
        const resource =
          state.resources[key];

        if (!resource) {
          return;
        }

        if (resource.position) {
          state.gl.deleteBuffer(
            resource.position
          );
        }

        if (resource.normal) {
          state.gl.deleteBuffer(
            resource.normal
          );
        }

        if (resource.color) {
          state.gl.deleteBuffer(
            resource.color
          );
        }

        if (resource.index) {
          state.gl.deleteBuffer(
            resource.index
          );
        }
      });

      if (
        state.programs.surface
      ) {
        state.gl.deleteProgram(
          state.programs.surface
        );
      }

      if (
        state.programs.motion
      ) {
        state.gl.deleteProgram(
          state.programs.motion
        );
      }
    }

    emitReceipt(
      {
        rendererInitialized:
          false,

        renderLoopStatus:
          "disposed"
      },
      true
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
            "[data-compass-mirrorland-window-mount]",
            ".compass-scene__mirrorland-window"
          ],
          state.root
        );

      if (!state.root) {
        throw new Error(
          "MISSING_COMPASS_ROOT"
        );
      }

      if (!state.scene) {
        throw new Error(
          "MISSING_COMPASS_SCENE"
        );
      }

      if (!state.mount) {
        throw new Error(
          "MISSING_MIRRORLAND_WINDOW_MOUNT"
        );
      }

      state.geometryObject =
        resolveGeometryObject();

      emitReceipt({
        geometryObjectFound:
          true,

        geometryObjectValidated:
          true
      });

      state.canvas =
        ensureCanvas(
          state.mount
        );

      emitReceipt({
        canvasStatus:
          "created-or-found"
      });

      state.gl =
        createContext(
          state.canvas
        );

      if (!state.gl) {
        throw new Error(
          "WEBGL_CONTEXT_UNAVAILABLE"
        );
      }

      const stencilBits =
        state.gl.getParameter(
          state.gl.STENCIL_BITS
        );

      if (
        !stencilBits ||
        stencilBits <
        1
      ) {
        throw new Error(
          "STENCIL_BUFFER_UNAVAILABLE"
        );
      }

      emitReceipt({
        webglStatus:
          "acquired",

        stencilStatus:
          "available:" +
          stencilBits
      });

      bindContextLifecycle();

      state.gl.enable(
        state.gl.DEPTH_TEST
      );

      state.gl.depthFunc(
        state.gl.LEQUAL
      );

      state.gl.disable(
        state.gl.CULL_FACE
      );

      buildPrograms(
        state.gl
      );

      emitReceipt({
        shaderStatus:
          "compiled-and-linked"
      });

      buildResources(
        state.gl
      );

      bindPointerParallax();
      bindStateObserver();

      state.currentState =
        normalizeState(
          state.root.dataset
            .mirrorlandWindowState
        );

      state.previousState =
        "";

      state.stateEnteredAtMs =
        performance.now();

      state.reducedMotion =
        (
          typeof globalThis.matchMedia ===
            "function" &&
          globalThis.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
        ) ||
        state.root.dataset
          .reducedMotion ===
          "true";

      state.running =
        true;

      state.raf =
        requestAnimationFrame(
          render
        );

      emitReceipt(
        {
          rendererInitialized:
            true,

          renderLoopStatus:
            "active",

          failureReason:
            null
        },
        true
      );

      dispatch(
        EVENTS.READY,
        Object.freeze({
          contractId:
            CONTRACT.id,

          geometryObjectId:
            CONTRACT.geometryObjectId,

          state:
            state.currentState,

          reducedMotion:
            state.reducedMotion
        })
      );
    } catch (error) {
      fail(
        "initialization",
        "MIRRORLAND_WINDOW_INIT_FAILURE:" +
        (
          error &&
          error.message
            ? error.message
            : String(
                error
              )
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
        once:
          true
      }
    );
  } else {
    init();
  }
})();
