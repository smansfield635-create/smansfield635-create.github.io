/* /products/archcoin/index.compositor.js
   ARCHCOIN dedicated camera and visual compositor.

   Module:
   DGB_ARCHCOIN_COMPOSITOR
   1.0.0-camera-depth-layer-orchestration

   Controller anchor:
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Crystals compatibility anchor:
   DGB_ARCHCOIN_CRYSTALS
   2.0.0-controller-decoupled-crystal-renderer

   Responsibilities:
   - camera state and camera presets;
   - view and projection matrices;
   - viewport and pixel-ratio management;
   - fixed Compass visual-plane depth;
   - world-to-screen projection;
   - projected Compass-overlap measurement;
   - stable rear/front classification with hysteresis;
   - rear/front crystal-canvas construction;
   - page-level rear / Compass / front / semantic ordering;
   - composite-pass orchestration;
   - style rollback and owned-layer disposal.

   Explicitly not owned:
   - navigation state;
   - wing or room selection;
   - route entry;
   - controller writes;
   - semantic interaction authorization;
   - Compass navigation;
   - Compass geometry;
   - Compass renderer lifecycle;
   - crystal meshes, materials, shaders, animation, or semantic relocation.

   Bounded integration renewal:
   - public compositor module version remains unchanged;
   - Controller 7.0.0 is accepted;
   - projectWorldPoint() retains all existing fields;
   - projectWorldPoint() adds visible and compassOverlap;
   - camera mathematics and depth mathematics remain unchanged.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    moduleId:
      "DGB_ARCHCOIN_COMPOSITOR",

    moduleVersion:
      "1.0.0-camera-depth-layer-orchestration",

    file:
      "/products/archcoin/index.compositor.js",

    receiptId:
      "AUDRALIA_ARCHCOIN_COMPOSITOR_RECEIPT_v1",

    requiredControllerModuleId:
      "DGB_ARCHCOIN_CONTROLLER",

    requiredControllerModuleVersion:
      "7.0.0-controller-interaction-semantic-priority",

    compatibleCrystalsModuleId:
      "DGB_ARCHCOIN_CRYSTALS",

    compatibleCrystalsModuleVersion:
      "2.0.0-controller-decoupled-crystal-renderer",

    visualPassClaimed:
      false,

    runtimePassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const PRESENTATIONS = Object.freeze({
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER:
      "CLUSTER",

    HELD:
      "HELD"
  });

  const DEPTH_LAYERS = Object.freeze({
    REAR:
      "REAR",

    FRONT:
      "FRONT"
  });

  const LAYERS = Object.freeze({
    REAR:
      Object.freeze({
        id:
          "REAR",

        datasetValue:
          "rear",

        zIndex:
          1
      }),

    COMPASS:
      Object.freeze({
        id:
          "COMPASS",

        zIndex:
          2
      }),

    FRONT:
      Object.freeze({
        id:
          "FRONT",

        datasetValue:
          "front",

        zIndex:
          3
      }),

    SEMANTIC:
      Object.freeze({
        id:
          "SEMANTIC",

        zIndex:
          4
      })
  });

  const CAMERA = Object.freeze({
    transitionSpeed:
      6.2,

    near:
      0.1,

    far:
      60,

    normalFieldOfViewDivisor:
      4.85,

    mobileFieldOfViewDivisor:
      4.45,

    mobileAspectThreshold:
      0.82,

    maximumDeltaSeconds:
      0.05,

    depthHysteresis:
      0.025,

    normalDevicePixelRatioCap:
      2,

    lowPowerDevicePixelRatioCap:
      1.5,

    lowPowerHardwareConcurrencyThreshold:
      4,

    compassOverlapPadding:
      4,

    defaultProjectedRadius:
      0,

    constellation:
      Object.freeze({
        normalEye:
          Object.freeze([
            0,
            0.76,
            6.05
          ]),

        mobileEye:
          Object.freeze([
            0,
            0.76,
            7.10
          ]),

        target:
          Object.freeze([
            0,
            0.03,
            0.06
          ])
      }),

    cluster:
      Object.freeze({
        normalEye:
          Object.freeze([
            0,
            0.62,
            6.28
          ]),

        mobileEye:
          Object.freeze([
            0,
            0.62,
            7.68
          ]),

        target:
          Object.freeze([
            0,
            0.02,
            0.04
          ])
      }),

    held:
      Object.freeze({
        eye:
          Object.freeze([
            0,
            0.76,
            6.45
          ]),

        target:
          Object.freeze([
            0,
            0,
            0
          ])
      })
  });

  const state = {
    initialized:
      false,

    disposed:
      false,

    status:
      "uninitialized",

    root:
      null,

    scene:
      null,

    field:
      null,

    compassMount:
      null,

    semanticLayer:
      null,

    controller:
      null,

    rearCanvas:
      null,

    frontCanvas:
      null,

    width:
      1,

    height:
      1,

    cssWidth:
      1,

    cssHeight:
      1,

    pixelRatio:
      1,

    presentation:
      PRESENTATIONS.HELD,

    held:
      true,

    reducedMotion:
      false,

    camera:
      {
        eye:
          CAMERA.held.eye.slice(),

        target:
          CAMERA.held.target.slice(),

        targetEye:
          CAMERA.held.eye.slice(),

        targetTarget:
          CAMERA.held.target.slice(),

        fieldOfView:
          Math.PI /
          CAMERA.normalFieldOfViewDivisor
      },

    viewMatrix:
      null,

    projectionMatrix:
      null,

    viewProjectionMatrix:
      null,

    compassPlaneViewDepth:
      0,

    previousFrameTime:
      0,

    stackingValidated:
      false,

    styleSnapshots:
      [],

    lastError:
      "",

    rearVisibleNodeCount:
      0,

    frontVisibleNodeCount:
      0,

    lastFrameReceipt:
      null
  };

  const RECEIPT = {
    receiptId:
      CONTRACT.receiptId,

    moduleId:
      CONTRACT.moduleId,

    moduleVersion:
      CONTRACT.moduleVersion,

    requiredControllerModuleId:
      CONTRACT.requiredControllerModuleId,

    requiredControllerModuleVersion:
      CONTRACT.requiredControllerModuleVersion,

    compatibleCrystalsModuleId:
      CONTRACT.compatibleCrystalsModuleId,

    compatibleCrystalsModuleVersion:
      CONTRACT.compatibleCrystalsModuleVersion,

    initialized:
      false,

    status:
      "uninitialized",

    currentPresentation:
      PRESENTATIONS.HELD,

    cameraEye:
      CAMERA.held.eye.slice(),

    cameraTarget:
      CAMERA.held.target.slice(),

    fieldOfView:
      Math.PI /
      CAMERA.normalFieldOfViewDivisor,

    viewportWidth:
      1,

    viewportHeight:
      1,

    pixelRatio:
      1,

    compassPlaneViewDepth:
      0,

    rearLayerCreated:
      false,

    frontLayerCreated:
      false,

    rearVisibleNodeCount:
      0,

    frontVisibleNodeCount:
      0,

    depthHysteresis:
      CAMERA.depthHysteresis,

    stackingValidated:
      false,

    lastError:
      "",

    visualPassClaimed:
      false,

    runtimePassClaimed:
      false,

    deploymentAuthorized:
      false,

    productionAuthorized:
      false
  };

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error =
      new Error(code);

    error.code =
      code;

    error.details =
      details;

    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(
      selector
    );
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

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const number =
      Number(value);

    return Number.isFinite(
      number
    )
      ? number
      : fallback;
  }

  function cloneVector(vector) {
    return [
      finiteNumber(
        vector &&
        vector[0],
        0
      ),

      finiteNumber(
        vector &&
        vector[1],
        0
      ),

      finiteNumber(
        vector &&
        vector[2],
        0
      )
    ];
  }

  function subtract(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function dot(a, b) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
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

  function vectorLength(vector) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalizeVector(
    vector,
    fallback = [
      0,
      0,
      1
    ]
  ) {
    const length =
      vectorLength(
        vector
      );

    if (
      !Number.isFinite(
        length
      ) ||
      length <=
        1e-12
    ) {
      return fallback.slice();
    }

    return [
      vector[0] /
        length,

      vector[1] /
        length,

      vector[2] /
        length
    ];
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

  function multiply4(
    a,
    b
  ) {
    const output =
      new Array(16)
        .fill(0);

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

    const range =
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
      range,
      -1,

      0,
      0,
      2 *
      far *
      near *
      range,
      0
    ];
  }

  function lookAt4(
    eye,
    center,
    up
  ) {
    const z =
      normalizeVector(
        subtract(
          eye,
          center
        )
      );

    const x =
      normalizeVector(
        cross(
          up,
          z
        ),
        [
          1,
          0,
          0
        ]
      );

    const y =
      cross(
        z,
        x
      );

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

  function captureStyle(
    element,
    property
  ) {
    return Object.freeze({
      element,
      property,

      value:
        element.style[
          property
        ]
    });
  }

  function mutateStyle(
    element,
    property,
    value
  ) {
    state.styleSnapshots.push(
      captureStyle(
        element,
        property
      )
    );

    element.style[
      property
    ] =
      value;
  }

  function restoreStyles() {
    for (
      const snapshot
      of state.styleSnapshots
        .slice()
        .reverse()
    ) {
      snapshot.element.style[
        snapshot.property
      ] =
        snapshot.value;
    }

    state.styleSnapshots =
      [];
  }

  function createCanvas(
    definition
  ) {
    const existing =
      qs(
        `canvas[data-archcoin-compositor-layer="${definition.datasetValue}"]`,
        state.field
      );

    invariant(
      !existing,
      `ARCHCOIN_COMPOSITOR_DUPLICATE_LAYER:${definition.id}`
    );

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.dataset
      .archcoinCompositorLayer =
      definition.datasetValue;

    canvas.dataset
      .archcoinCrystalsCanvas =
      definition.datasetValue;

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

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.display =
      "block";

    canvas.style.background =
      "transparent";

    canvas.style.pointerEvents =
      "none";

    canvas.style.zIndex =
      String(
        definition.zIndex
      );

    canvas.style.contain =
      "strict";

    state.field.appendChild(
      canvas
    );

    return canvas;
  }

  function removeCanvas(canvas) {
    if (
      canvas &&
      canvas.parentNode
    ) {
      canvas.parentNode
        .removeChild(
          canvas
        );
    }
  }

  function requireController() {
    const controller =
      globalThis
        .DGB_ARCHCOIN_CONTROLLER;

    invariant(
      controller,
      "ARCHCOIN_COMPOSITOR_CONTROLLER_REQUIRED"
    );

    invariant(
      controller.moduleId ===
        CONTRACT
          .requiredControllerModuleId,
      "ARCHCOIN_COMPOSITOR_CONTROLLER_MODULE_INVALID",
      {
        expected:
          CONTRACT
            .requiredControllerModuleId,

        actual:
          controller.moduleId
      }
    );

    invariant(
      controller.moduleVersion ===
        CONTRACT
          .requiredControllerModuleVersion,
      "ARCHCOIN_COMPOSITOR_CONTROLLER_VERSION_INVALID",
      {
        expected:
          CONTRACT
            .requiredControllerModuleVersion,

        actual:
          controller.moduleVersion
      }
    );

    invariant(
      typeof controller
        .getFrameState ===
        "function",
      "ARCHCOIN_COMPOSITOR_CONTROLLER_FRAME_SURFACE_REQUIRED"
    );

    return controller;
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-archcoin-root]"
      );

    invariant(
      state.root,
      "ARCHCOIN_COMPOSITOR_ROOT_NOT_FOUND"
    );

    state.scene =
      qs(
        "[data-archcoin-scene]",
        state.root
      );

    invariant(
      state.scene,
      "ARCHCOIN_COMPOSITOR_SCENE_NOT_FOUND"
    );

    state.field =
      qs(
        "[data-archcoin-scene-field]",
        state.scene
      ) ||
      qs(
        ".archcoin-scene__field",
        state.scene
      ) ||
      state.scene;

    invariant(
      state.field,
      "ARCHCOIN_COMPOSITOR_FIELD_NOT_FOUND"
    );

    state.compassMount =
      qs(
        "[data-upstream-compass-mount]",
        state.root
      );

    invariant(
      state.compassMount,
      "ARCHCOIN_COMPOSITOR_COMPASS_MOUNT_NOT_FOUND"
    );

    state.semanticLayer =
      qs(
        "[data-archcoin-objects]",
        state.root
      );

    invariant(
      state.semanticLayer,
      "ARCHCOIN_COMPOSITOR_SEMANTIC_LAYER_NOT_FOUND"
    );
  }

  function establishLayerOrder() {
    const fieldPosition =
      globalThis
        .getComputedStyle(
          state.field
        )
        .position;

    if (
      fieldPosition ===
      "static"
    ) {
      mutateStyle(
        state.field,
        "position",
        "relative"
      );
    }

    mutateStyle(
      state.field,
      "isolation",
      "isolate"
    );

    mutateStyle(
      state.compassMount,
      "zIndex",
      String(
        LAYERS.COMPASS
          .zIndex
      )
    );

    mutateStyle(
      state.semanticLayer,
      "zIndex",
      String(
        LAYERS.SEMANTIC
          .zIndex
      )
    );

    state.rearCanvas =
      createCanvas(
        LAYERS.REAR
      );

    state.frontCanvas =
      createCanvas(
        LAYERS.FRONT
      );
  }

  function stackingContextFacts(
    element
  ) {
    const style =
      globalThis
        .getComputedStyle(
          element
        );

    return Object.freeze({
      position:
        style.position,

      zIndex:
        style.zIndex,

      transform:
        style.transform,

      opacity:
        style.opacity,

      isolation:
        style.isolation,

      contain:
        style.contain,

      overflow:
        style.overflow
    });
  }

  function validateStacking() {
    invariant(
      state.rearCanvas &&
      state.frontCanvas,
      "ARCHCOIN_COMPOSITOR_LAYERS_REQUIRED"
    );

    invariant(
      state.rearCanvas
        .parentElement ===
        state.field,
      "ARCHCOIN_COMPOSITOR_REAR_LAYER_PARENT_INVALID"
    );

    invariant(
      state.frontCanvas
        .parentElement ===
        state.field,
      "ARCHCOIN_COMPOSITOR_FRONT_LAYER_PARENT_INVALID"
    );

    invariant(
      globalThis
        .getComputedStyle(
          state.rearCanvas
        )
        .pointerEvents ===
        "none",
      "ARCHCOIN_COMPOSITOR_REAR_POINTER_EVENTS_INVALID"
    );

    invariant(
      globalThis
        .getComputedStyle(
          state.frontCanvas
        )
        .pointerEvents ===
        "none",
      "ARCHCOIN_COMPOSITOR_FRONT_POINTER_EVENTS_INVALID"
    );

    invariant(
      Number(
        state.rearCanvas
          .style.zIndex
      ) ===
        LAYERS.REAR.zIndex,
      "ARCHCOIN_COMPOSITOR_REAR_Z_INDEX_INVALID"
    );

    invariant(
      Number(
        state.compassMount
          .style.zIndex
      ) ===
        LAYERS.COMPASS.zIndex,
      "ARCHCOIN_COMPOSITOR_COMPASS_Z_INDEX_INVALID"
    );

    invariant(
      Number(
        state.frontCanvas
          .style.zIndex
      ) ===
        LAYERS.FRONT.zIndex,
      "ARCHCOIN_COMPOSITOR_FRONT_Z_INDEX_INVALID"
    );

    invariant(
      Number(
        state.semanticLayer
          .style.zIndex
      ) ===
        LAYERS.SEMANTIC.zIndex,
      "ARCHCOIN_COMPOSITOR_SEMANTIC_Z_INDEX_INVALID"
    );

    state.stackingValidated =
      true;

    state.root.dataset
      .archcoinCompositeStackingValidated =
      "true";

    state.root.dataset
      .archcoinCompositeOrder =
      "REAR_COMPASS_FRONT_SEMANTIC";

    state.root.dataset
      .archcoinCompositeFieldFacts =
      JSON.stringify(
        stackingContextFacts(
          state.field
        )
      );
  }

  function lowPowerDevice() {
    return Boolean(
      navigator
        .hardwareConcurrency &&
      navigator
        .hardwareConcurrency <=
        CAMERA
          .lowPowerHardwareConcurrencyThreshold
    );
  }

  function resize() {
    invariant(
      state.initialized &&
      !state.disposed,
      "ARCHCOIN_COMPOSITOR_NOT_AVAILABLE"
    );

    const rect =
      state.field
        .getBoundingClientRect();

    const cap =
      lowPowerDevice()
        ? CAMERA
            .lowPowerDevicePixelRatioCap
        : CAMERA
            .normalDevicePixelRatioCap;

    state.pixelRatio =
      Math.min(
        globalThis.devicePixelRatio ||
        1,
        cap
      );

    state.cssWidth =
      Math.max(
        1,
        rect.width
      );

    state.cssHeight =
      Math.max(
        1,
        rect.height
      );

    state.width =
      Math.max(
        1,
        Math.floor(
          state.cssWidth *
          state.pixelRatio
        )
      );

    state.height =
      Math.max(
        1,
        Math.floor(
          state.cssHeight *
          state.pixelRatio
        )
      );

    [
      state.rearCanvas,
      state.frontCanvas
    ].forEach(
      canvas => {
        if (
          canvas.width !==
            state.width ||
          canvas.height !==
            state.height
        ) {
          canvas.width =
            state.width;

          canvas.height =
            state.height;
        }
      }
    );

    return Object.freeze({
      width:
        state.width,

      height:
        state.height,

      cssWidth:
        state.cssWidth,

      cssHeight:
        state.cssHeight,

      pixelRatio:
        state.pixelRatio
    });
  }

  function normalizePresentation(
    frame
  ) {
    if (
      !frame ||
      frame.held
    ) {
      return PRESENTATIONS.HELD;
    }

    if (
      frame.presentation &&
      frame.presentation
        .outerCardinalsActive ===
        true
    ) {
      return PRESENTATIONS
        .CONSTELLATION;
    }

    if (
      frame.presentation &&
      frame.presentation
        .activeRoomCluster ===
        true
    ) {
      return PRESENTATIONS.CLUSTER;
    }

    return PRESENTATIONS.HELD;
  }

  function resolveCameraPreset(
    presentation
  ) {
    const mobile =
      state.cssWidth /
      Math.max(
        1,
        state.cssHeight
      ) <
      CAMERA.mobileAspectThreshold;

    if (
      presentation ===
      PRESENTATIONS.CONSTELLATION
    ) {
      return Object.freeze({
        eye:
          (
            mobile
              ? CAMERA
                  .constellation
                  .mobileEye
              : CAMERA
                  .constellation
                  .normalEye
          ).slice(),

        target:
          CAMERA
            .constellation
            .target
            .slice()
      });
    }

    if (
      presentation ===
      PRESENTATIONS.CLUSTER
    ) {
      return Object.freeze({
        eye:
          (
            mobile
              ? CAMERA
                  .cluster
                  .mobileEye
              : CAMERA
                  .cluster
                  .normalEye
          ).slice(),

        target:
          CAMERA
            .cluster
            .target
            .slice()
      });
    }

    return Object.freeze({
      eye:
        CAMERA.held.eye.slice(),

      target:
        CAMERA.held.target.slice()
    });
  }

  function updateCamera(
    frame,
    deltaSeconds
  ) {
    state.presentation =
      normalizePresentation(
        frame
      );

    state.held =
      state.presentation ===
      PRESENTATIONS.HELD;

    state.reducedMotion =
      Boolean(
        frame &&
        frame.reducedMotion
      );

    const preset =
      resolveCameraPreset(
        state.presentation
      );

    state.camera.targetEye =
      preset.eye.slice();

    state.camera.targetTarget =
      preset.target.slice();

    const amount =
      state.reducedMotion
        ? 1
        : Math.min(
            1,
            deltaSeconds *
            CAMERA.transitionSpeed
          );

    for (
      let index = 0;
      index < 3;
      index += 1
    ) {
      state.camera.eye[index] =
        lerp(
          state.camera.eye[index],
          state.camera
            .targetEye[index],
          amount
        );

      state.camera.target[index] =
        lerp(
          state.camera.target[index],
          state.camera
            .targetTarget[index],
          amount
        );
    }

    const aspect =
      state.width /
      Math.max(
        1,
        state.height
      );

    state.camera.fieldOfView =
      Math.PI /
      (
        aspect <
        CAMERA.mobileAspectThreshold
          ? CAMERA
              .mobileFieldOfViewDivisor
          : CAMERA
              .normalFieldOfViewDivisor
      );

    state.viewMatrix =
      lookAt4(
        state.camera.eye,
        state.camera.target,
        [
          0,
          1,
          0
        ]
      );

    state.projectionMatrix =
      perspective4(
        state.camera.fieldOfView,
        aspect,
        CAMERA.near,
        CAMERA.far
      );

    state.viewProjectionMatrix =
      multiply4(
        state.projectionMatrix,
        state.viewMatrix
      );

    const compassReference =
      transformPoint4(
        state.viewMatrix,
        [
          state.camera.target[0],
          state.camera.target[1],
          state.camera.target[2],
          1
        ]
      );

    state.compassPlaneViewDepth =
      compassReference[2];

    invariant(
      Number.isFinite(
        state.compassPlaneViewDepth
      ),
      "ARCHCOIN_COMPOSITOR_COMPASS_PLANE_INVALID"
    );
  }

  function beginFrame(options = {}) {
    invariant(
      state.initialized &&
      !state.disposed,
      "ARCHCOIN_COMPOSITOR_NOT_AVAILABLE"
    );

    resize();

    const nowSeconds =
      Number.isFinite(
        options.nowSeconds
      )
        ? options.nowSeconds
        : performance.now() *
          0.001;

    const deltaSeconds =
      Number.isFinite(
        options.deltaSeconds
      )
        ? clamp(
            options.deltaSeconds,
            0,
            CAMERA
              .maximumDeltaSeconds
          )
        : state.previousFrameTime
          ? clamp(
              nowSeconds -
              state.previousFrameTime,
              0,
              CAMERA
                .maximumDeltaSeconds
            )
          : 0.016;

    state.previousFrameTime =
      nowSeconds;

    const frame =
      options.frame ||
      state.controller
        .getFrameState();

    updateCamera(
      frame,
      deltaSeconds
    );

    publishReceipt();

    return Object.freeze({
      presentation:
        state.presentation,

      held:
        state.held,

      reducedMotion:
        state.reducedMotion,

      deltaSeconds,

      camera:
        getCamera(),

      viewMatrix:
        getViewMatrix(),

      projectionMatrix:
        getProjectionMatrix(),

      compassPlaneViewDepth:
        state.compassPlaneViewDepth,

      viewport:
        Object.freeze({
          width:
            state.width,

          height:
            state.height,

          cssWidth:
            state.cssWidth,

          cssHeight:
            state.cssHeight,

          pixelRatio:
            state.pixelRatio
        })
    });
  }

  function getCamera() {
    return Object.freeze({
      eye:
        Object.freeze(
          state.camera.eye.slice()
        ),

      target:
        Object.freeze(
          state.camera.target.slice()
        ),

      targetEye:
        Object.freeze(
          state.camera
            .targetEye
            .slice()
        ),

      targetTarget:
        Object.freeze(
          state.camera
            .targetTarget
            .slice()
        ),

      fieldOfView:
        state.camera.fieldOfView,

      near:
        CAMERA.near,

      far:
        CAMERA.far
    });
  }

  function getViewMatrix() {
    invariant(
      state.viewMatrix,
      "ARCHCOIN_COMPOSITOR_VIEW_MATRIX_NOT_READY"
    );

    return state.viewMatrix.slice();
  }

  function getProjectionMatrix() {
    invariant(
      state.projectionMatrix,
      "ARCHCOIN_COMPOSITOR_PROJECTION_MATRIX_NOT_READY"
    );

    return state.projectionMatrix
      .slice();
  }

  function getCompassPlaneViewDepth() {
    return state.compassPlaneViewDepth;
  }

  /*
   * Returns the Compass bounds in field-local CSS pixels.
   *
   * The compositor may inspect the Compass mount as a visual depth and overlap
   * reference. It does not inherit Compass state or own Compass navigation.
   */
  function getCompassFieldBounds() {
    invariant(
      state.field &&
      state.compassMount,
      "ARCHCOIN_COMPOSITOR_COMPASS_BOUNDS_NOT_AVAILABLE"
    );

    const fieldRect =
      state.field
        .getBoundingClientRect();

    const compassRect =
      state.compassMount
        .getBoundingClientRect();

    return Object.freeze({
      left:
        compassRect.left -
        fieldRect.left,

      top:
        compassRect.top -
        fieldRect.top,

      right:
        compassRect.right -
        fieldRect.left,

      bottom:
        compassRect.bottom -
        fieldRect.top,

      width:
        compassRect.width,

      height:
        compassRect.height,

      centerX:
        compassRect.left -
        fieldRect.left +
        compassRect.width /
        2,

      centerY:
        compassRect.top -
        fieldRect.top +
        compassRect.height /
        2
    });
  }

  function projectedCircleOverlapsCompass(
    x,
    y,
    projectedRadius,
    padding
  ) {
    const bounds =
      getCompassFieldBounds();

    const radius =
      Math.max(
        0,
        finiteNumber(
          projectedRadius,
          CAMERA
            .defaultProjectedRadius
        )
      );

    const safePadding =
      Math.max(
        0,
        finiteNumber(
          padding,
          CAMERA
            .compassOverlapPadding
        )
      );

    const expandedRadius =
      radius +
      safePadding;

    const closestX =
      clamp(
        x,
        bounds.left,
        bounds.right
      );

    const closestY =
      clamp(
        y,
        bounds.top,
        bounds.bottom
      );

    const deltaX =
      x -
      closestX;

    const deltaY =
      y -
      closestY;

    return (
      deltaX *
        deltaX +
      deltaY *
        deltaY
    ) <=
      expandedRadius *
        expandedRadius;
  }

  function projectWorldPoint(
    worldPoint,
    options = {}
  ) {
    invariant(
      state.viewMatrix &&
      state.projectionMatrix &&
      state.viewProjectionMatrix,
      "ARCHCOIN_COMPOSITOR_FRAME_NOT_BEGUN"
    );

    const point =
      cloneVector(
        worldPoint
      );

    const clip =
      transformPoint4(
        state.viewProjectionMatrix,
        [
          point[0],
          point[1],
          point[2],
          1
        ]
      );

    if (
      !Number.isFinite(
        clip[3]
      ) ||
      Math.abs(
        clip[3]
      ) <=
        1e-12
    ) {
      return null;
    }

    const normalizedX =
      clip[0] /
      clip[3];

    const normalizedY =
      clip[1] /
      clip[3];

    const normalizedZ =
      clip[2] /
      clip[3];

    const rejectionMargin =
      Number.isFinite(
        options.rejectionMargin
      )
        ? Math.max(
            0,
            options.rejectionMargin
          )
        : 0.30;

    const insideRejectionBounds =
      normalizedX >=
        -1 -
        rejectionMargin &&
      normalizedX <=
        1 +
        rejectionMargin &&
      normalizedY >=
        -1 -
        rejectionMargin &&
      normalizedY <=
        1 +
        rejectionMargin;

    if (
      !insideRejectionBounds
    ) {
      return null;
    }

    const x =
      (
        (
          normalizedX +
          1
        ) /
        2
      ) *
      state.cssWidth;

    const y =
      (
        (
          1 -
          normalizedY
        ) /
        2
      ) *
      state.cssHeight;

    const inFrontOfCamera =
      clip[3] >
      0;

    const insideClipVolume =
      normalizedX >=
        -1 &&
      normalizedX <=
        1 &&
      normalizedY >=
        -1 &&
      normalizedY <=
        1 &&
      normalizedZ >=
        -1 &&
      normalizedZ <=
        1;

    const visible =
      inFrontOfCamera &&
      insideClipVolume;

    const compassOverlap =
      projectedCircleOverlapsCompass(
        x,
        y,
        options.projectedRadius,
        options.compassOverlapPadding
      );

    return Object.freeze({
      x,
      y,
      normalizedX,
      normalizedY,
      normalizedZ,

      clipW:
        clip[3],

      visible,
      compassOverlap
    });
  }

  function worldPointToViewDepth(
    worldPoint
  ) {
    invariant(
      state.viewMatrix,
      "ARCHCOIN_COMPOSITOR_VIEW_MATRIX_NOT_READY"
    );

    const point =
      cloneVector(
        worldPoint
      );

    return transformPoint4(
      state.viewMatrix,
      [
        point[0],
        point[1],
        point[2],
        1
      ]
    )[2];
  }

  function classifyDepth(options = {}) {
    const worldPoint =
      cloneVector(
        options.worldPoint
      );

    const previousLayer =
      options.previousLayer ===
        DEPTH_LAYERS.FRONT
        ? DEPTH_LAYERS.FRONT
        : DEPTH_LAYERS.REAR;

    const viewDepth =
      worldPointToViewDepth(
        worldPoint
      );

    const offsetFromCompassPlane =
      viewDepth -
      state.compassPlaneViewDepth;

    const hysteresis =
      Number.isFinite(
        options.hysteresis
      )
        ? Math.max(
            0,
            options.hysteresis
          )
        : CAMERA.depthHysteresis;

    let layer =
      previousLayer;

    if (
      offsetFromCompassPlane >
      hysteresis
    ) {
      layer =
        DEPTH_LAYERS.FRONT;
    } else if (
      offsetFromCompassPlane <
      -hysteresis
    ) {
      layer =
        DEPTH_LAYERS.REAR;
    }

    return Object.freeze({
      layer,
      viewDepth,

      compassPlaneViewDepth:
        state.compassPlaneViewDepth,

      offsetFromCompassPlane,
      hysteresis
    });
  }

  function partitionNodes(options = {}) {
    const nodes =
      Array.isArray(
        options.nodes
      )
        ? options.nodes
        : [];

    invariant(
      typeof options
        .getWorldCenter ===
        "function",
      "ARCHCOIN_COMPOSITOR_WORLD_CENTER_CALLBACK_REQUIRED"
    );

    const getPreviousLayer =
      typeof options
        .getPreviousLayer ===
        "function"
        ? options.getPreviousLayer
        : node =>
            node &&
            node.depthLayer ===
              DEPTH_LAYERS.FRONT
              ? DEPTH_LAYERS.FRONT
              : DEPTH_LAYERS.REAR;

    const setClassification =
      typeof options
        .setClassification ===
        "function"
        ? options.setClassification
        : () => {};

    const rear = [];
    const front = [];

    nodes.forEach(
      node => {
        const classification =
          classifyDepth({
            worldPoint:
              options
                .getWorldCenter(
                  node
                ),

            previousLayer:
              getPreviousLayer(
                node
              ),

            hysteresis:
              options.hysteresis
          });

        setClassification(
          node,
          classification
        );

        if (
          classification.layer ===
          DEPTH_LAYERS.FRONT
        ) {
          front.push(
            node
          );
        } else {
          rear.push(
            node
          );
        }
      }
    );

    const sort =
      typeof options.sort ===
        "function"
        ? options.sort
        : null;

    if (sort) {
      rear.sort(
        sort
      );

      front.sort(
        sort
      );
    }

    state.rearVisibleNodeCount =
      rear.length;

    state.frontVisibleNodeCount =
      front.length;

    return Object.freeze({
      rear:
        Object.freeze(
          rear.slice()
        ),

      front:
        Object.freeze(
          front.slice()
        )
    });
  }

  function renderComposite(options = {}) {
    invariant(
      state.initialized &&
      !state.disposed,
      "ARCHCOIN_COMPOSITOR_NOT_AVAILABLE"
    );

    invariant(
      typeof options
        .getWorldCenter ===
        "function",
      "ARCHCOIN_COMPOSITOR_WORLD_CENTER_CALLBACK_REQUIRED"
    );

    invariant(
      typeof options
        .drawRear ===
        "function",
      "ARCHCOIN_COMPOSITOR_REAR_DRAW_CALLBACK_REQUIRED"
    );

    invariant(
      typeof options
        .drawFront ===
        "function",
      "ARCHCOIN_COMPOSITOR_FRONT_DRAW_CALLBACK_REQUIRED"
    );

    const partition =
      partitionNodes({
        nodes:
          options.nodes,

        getWorldCenter:
          options
            .getWorldCenter,

        getPreviousLayer:
          options
            .getPreviousLayer,

        setClassification:
          options
            .setClassification,

        hysteresis:
          options.hysteresis,

        sort:
          options.sort
      });

    const rearResult =
      options.drawRear(
        partition.rear,
        getRearLayer()
      );

    const frontResult =
      options.drawFront(
        partition.front,
        getFrontLayer()
      );

    state.lastFrameReceipt =
      Object.freeze({
        presentation:
          state.presentation,

        rearVisibleNodeCount:
          partition.rear.length,

        frontVisibleNodeCount:
          partition.front.length,

        rearResult:
          rearResult ===
          undefined
            ? null
            : rearResult,

        frontResult:
          frontResult ===
          undefined
            ? null
            : frontResult,

        compassPlaneViewDepth:
          state.compassPlaneViewDepth
      });

    publishReceipt();

    return Object.freeze({
      rearNodes:
        partition.rear,

      frontNodes:
        partition.front,

      rearResult:
        state
          .lastFrameReceipt
          .rearResult,

      frontResult:
        state
          .lastFrameReceipt
          .frontResult,

      camera:
        getCamera(),

      viewMatrix:
        getViewMatrix(),

      projectionMatrix:
        getProjectionMatrix(),

      compassPlaneViewDepth:
        state.compassPlaneViewDepth
    });
  }

  function getRearLayer() {
    invariant(
      state.rearCanvas,
      "ARCHCOIN_COMPOSITOR_REAR_LAYER_NOT_READY"
    );

    return Object.freeze({
      id:
        DEPTH_LAYERS.REAR,

      canvas:
        state.rearCanvas,

      width:
        state.width,

      height:
        state.height,

      cssWidth:
        state.cssWidth,

      cssHeight:
        state.cssHeight,

      pixelRatio:
        state.pixelRatio
    });
  }

  function getFrontLayer() {
    invariant(
      state.frontCanvas,
      "ARCHCOIN_COMPOSITOR_FRONT_LAYER_NOT_READY"
    );

    return Object.freeze({
      id:
        DEPTH_LAYERS.FRONT,

      canvas:
        state.frontCanvas,

      width:
        state.width,

      height:
        state.height,

      cssWidth:
        state.cssWidth,

      cssHeight:
        state.cssHeight,

      pixelRatio:
        state.pixelRatio
    });
  }

  function publishReceipt(extra = {}) {
    Object.assign(
      RECEIPT,
      {
        initialized:
          state.initialized &&
          !state.disposed,

        status:
          state.status,

        currentPresentation:
          state.presentation,

        cameraEye:
          state.camera.eye.slice(),

        cameraTarget:
          state.camera.target.slice(),

        fieldOfView:
          state.camera.fieldOfView,

        viewportWidth:
          state.width,

        viewportHeight:
          state.height,

        pixelRatio:
          state.pixelRatio,

        compassPlaneViewDepth:
          state.compassPlaneViewDepth,

        rearLayerCreated:
          Boolean(
            state.rearCanvas
          ),

        frontLayerCreated:
          Boolean(
            state.frontCanvas
          ),

        rearVisibleNodeCount:
          state
            .rearVisibleNodeCount,

        frontVisibleNodeCount:
          state
            .frontVisibleNodeCount,

        depthHysteresis:
          CAMERA.depthHysteresis,

        stackingValidated:
          state.stackingValidated,

        lastError:
          state.lastError,

        visualPassClaimed:
          false,

        runtimePassClaimed:
          false,

        deploymentAuthorized:
          false,

        productionAuthorized:
          false
      },
      extra
    );

    const frozen =
      Object.freeze({
        ...RECEIPT,

        cameraEye:
          Object.freeze(
            RECEIPT
              .cameraEye
              .slice()
          ),

        cameraTarget:
          Object.freeze(
            RECEIPT
              .cameraTarget
              .slice()
          )
      });

    globalThis
      .DGB_ARCHCOIN_COMPOSITOR_RECEIPT =
      frozen;

    if (state.root) {
      state.root.dataset
        .archcoinCompositorReceipt =
        JSON.stringify(
          frozen
        );

      state.root.dataset
        .archcoinCompositorStatus =
        state.status;

      state.root.dataset
        .archcoinCompositorVersion =
        CONTRACT.moduleVersion;

      state.root.dataset
        .archcoinCompositorControllerVersion =
        CONTRACT
          .requiredControllerModuleVersion;

      state.root.dataset
        .archcoinCompassPlaneViewDepth =
        String(
          state.compassPlaneViewDepth
        );

      state.root.dataset
        .archcoinRearVisibleNodeCount =
        String(
          state
            .rearVisibleNodeCount
        );

      state.root.dataset
        .archcoinFrontVisibleNodeCount =
        String(
          state
            .frontVisibleNodeCount
        );

      state.root.dataset
        .visualPassClaimed =
        "false";
    }

    return frozen;
  }

  function receipt() {
    return publishReceipt();
  }

  function rollbackInitialization() {
    removeCanvas(
      state.rearCanvas
    );

    removeCanvas(
      state.frontCanvas
    );

    state.rearCanvas =
      null;

    state.frontCanvas =
      null;

    restoreStyles();

    state.initialized =
      false;

    state.stackingValidated =
      false;

    state.viewMatrix =
      null;

    state.projectionMatrix =
      null;

    state.viewProjectionMatrix =
      null;

    if (state.root) {
      delete state.root.dataset
        .archcoinCompositeStackingValidated;

      delete state.root.dataset
        .archcoinCompositeOrder;
    }
  }

  function initialize() {
    if (
      state.initialized &&
      !state.disposed
    ) {
      return receipt();
    }

    invariant(
      !state.disposed,
      "ARCHCOIN_COMPOSITOR_ALREADY_DISPOSED"
    );

    state.status =
      "initializing";

    state.lastError =
      "";

    try {
      resolveDom();

      state.controller =
        requireController();

      establishLayerOrder();

      state.initialized =
        true;

      resize();

      validateStacking();

      state.status =
        "available";

      state.root.dataset
        .archcoinCompositorCameraOwner =
        "true";

      state.root.dataset
        .archcoinCompositorCompassLogicOwned =
        "false";

      state.root.dataset
        .archcoinCompositorCompassOverlapMeasurementOwned =
        "true";

      state.root.dataset
        .archcoinCompositorCrystalGeometryOwned =
        "false";

      state.root.dataset
        .archcoinCompositorDepthClassificationOwned =
        "true";

      return receipt();
    } catch (error) {
      state.lastError =
        error &&
        error.message
          ? error.message
          : String(
              error
            );

      state.status =
        "failed";

      rollbackInitialization();

      publishReceipt({
        initialized:
          false,

        status:
          "failed",

        lastError:
          state.lastError
      });

      globalThis.dispatchEvent(
        new CustomEvent(
          "ARCHCOIN_COMPOSITOR_FAILURE",
          {
            detail:
              Object.freeze({
                phase:
                  "initialize",

                code:
                  error &&
                  error.code
                    ? error.code
                    : "",

                message:
                  state.lastError,

                details:
                  error &&
                  error.details
                    ? error.details
                    : null
              })
          }
        )
      );

      throw error;
    }
  }

  function dispose() {
    if (
      state.disposed
    ) {
      return true;
    }

    state.disposed =
      true;

    state.status =
      "disposed";

    removeCanvas(
      state.rearCanvas
    );

    removeCanvas(
      state.frontCanvas
    );

    state.rearCanvas =
      null;

    state.frontCanvas =
      null;

    restoreStyles();

    state.initialized =
      false;

    state.stackingValidated =
      false;

    state.rearVisibleNodeCount =
      0;

    state.frontVisibleNodeCount =
      0;

    state.viewMatrix =
      null;

    state.projectionMatrix =
      null;

    state.viewProjectionMatrix =
      null;

    if (state.root) {
      delete state.root.dataset
        .archcoinCompositeStackingValidated;

      delete state.root.dataset
        .archcoinCompositeOrder;

      state.root.dataset
        .archcoinCompositorStatus =
        "disposed";
    }

    publishReceipt({
      initialized:
        false,

      status:
        "disposed",

      rearLayerCreated:
        false,

      frontLayerCreated:
        false,

      rearVisibleNodeCount:
        0,

      frontVisibleNodeCount:
        0,

      stackingValidated:
        false
    });

    return true;
  }

  globalThis
    .DGB_ARCHCOIN_COMPOSITOR =
    Object.freeze({
      moduleId:
        CONTRACT.moduleId,

      moduleVersion:
        CONTRACT.moduleVersion,

      contract:
        CONTRACT,

      presentations:
        PRESENTATIONS,

      depthLayers:
        DEPTH_LAYERS,

      initialize,
      resize,
      beginFrame,
      getCamera,
      getViewMatrix,
      getProjectionMatrix,
      getCompassPlaneViewDepth,
      getCompassFieldBounds,
      projectWorldPoint,
      classifyDepth,
      partitionNodes,
      renderComposite,
      getRearLayer,
      getFrontLayer,
      receipt,
      dispose
    });
})();

/*
AUDRALIA_ARCHCOIN_COMPOSITOR_BOUNDED_CONTROLLER_7_INTEGRATION_RESULT_v2

Artifact:
 /products/archcoin/index.compositor.js

Module:
 DGB_ARCHCOIN_COMPOSITOR
 1.0.0-camera-depth-layer-orchestration

Required controller:
 DGB_ARCHCOIN_CONTROLLER
 7.0.0-controller-interaction-semantic-priority

Compatible crystals:
 DGB_ARCHCOIN_CRYSTALS
 2.0.0-controller-decoupled-crystal-renderer

Bounded corrections:
- replaced obsolete Controller 6.0.1 requirement
- accepts exact Controller 7.0.0 module version
- preserved compositor public module version
- preserved all existing compositor public surfaces
- preserved camera presets
- preserved camera interpolation
- preserved view and projection mathematics
- preserved Compass-plane depth calculation
- preserved depth hysteresis
- preserved rear/front classification
- preserved rear/front canvas construction
- preserved layer ordering
- preserved composite-pass orchestration
- added cached view-projection matrix
- added receipt initialized field required by crystals lifecycle inspection
- added field-local Compass bounds
- added projected Compass-overlap measurement
- extended projectWorldPoint() with normalizedZ
- extended projectWorldPoint() with visible
- extended projectWorldPoint() with compassOverlap
- changed data-archcoin-crystals-canvas value to rear/front layer identity
- retained x, y, normalizedX, normalizedY, and clipW

Not changed:
- controller
- crystals
- HTML
- CSS
- Compass geometry
- Compass renderer
- crystal geometry
- crystal materials
- crystal shaders
- navigation authority
- semantic interaction authority
- route authority

Runtime execution:
NOT PERFORMED

Visual acceptance:
NOT CLAIMED

Production authorization:
FALSE

Deployment authorization:
FALSE
*/
