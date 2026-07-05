/* TARGET FILE: /showroom/index.object-stage.js */
/* COMPLETE NEW FILE */
/* SHOWROOM_WINDOW_DIAMOND_STAGE_CASE_v2_256_LATTICE_CORRIDOR_ENVIRONMENT */

/*
  Showroom Window / Diamond Stage-Case

  Purpose:
  - Define a shared 3D environment-case for the Window and Diamond objects.
  - Use the existing CSS reveal corridor as a hard external boundary.
  - Use the Diamond geometry authority as the live rear-object source.
  - Use the current Window v1_3 geometry as the static foreground case source.
  - Optionally read the Window geometry receipt when available for confirmation.
  - Establish a 16 × 16 / 256-seat diagnostic stage lattice.
  - Place the Diamond and Window into one shared x/y/z coordinate system.
  - Define the optical corridor from the Window aperture to the Diamond target.
  - Publish spatial receipts, transforms, placements, and CSS variables.
  - Draw nothing.
  - Move no DOM nodes.
  - Expand no CSS box.
  - Own no controls, gestures, routes, UI, renderer internals, or object internals.

  Classification:
  - This is a stage-case, not a pure live-derived stage.
  - Diamond geometry is live-derived from DGBShowroomDiamondGeometryG3.
  - Window geometry is static-bound to the supplied v1_3 Window object contract.
  - Window getGeometryReceipt(), when available, is used as confirmation metadata.

  Runtime safety:
  - The mutation observer does not observe style/class.
  - Stage DOM writes are guarded to avoid self-refresh churn.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_WINDOW_DIAMOND_STAGE_CASE_v2_256_LATTICE_CORRIDOR_ENVIRONMENT",

    file:
      "/showroom/index.object-stage.js",

    publicSurface:
      "SHOWROOM_OBJECT_STAGE",

    receiptSurface:
      "SHOWROOM_OBJECT_STAGE_RECEIPT",

    sourceBasis:
      Object.freeze([
        "/showroom/index.diamond.geometry.js",
        "/showroom/index.window.js"
      ]),

    role:
      "shared-3d-stage-case-spatial-authority",

    fileClass:
      "stage-case",

    pureLiveStage:
      false,

    diamondSourceMode:
      "live-geometry-authority",

    windowSourceMode:
      "static-bound-window-v1-3-with-optional-receipt-confirmation",

    corridorBound:
      true,

    diagnosticLattice:
      "16x16-256-seat",

    rendererOwnership:
      false,

    drawingOwnership:
      false,

    diamondGeometryOwnership:
      false,

    windowGeometryOwnership:
      false,

    controlOwnership:
      false,

    uiOwnership:
      false,

    gestureOwnership:
      false,

    routeOwnership:
      false,

    pageStateOwnership:
      false,

    cssExpansionAuthorized:
      false,

    cssRenewalRequired:
      false,

    htmlRenewalRequired:
      false,

    newWrapperRequired:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    scene:
      "[data-showroom-reveal-scene]",

    diamondLayer:
      "[data-showroom-diamond-layer]",

    diamondStage:
      "[data-showroom-diamond-stage]",

    diamondCanvas:
      "canvas[data-showroom-diamond-canvas]",

    windowLayer:
      "[data-showroom-window-layer]",

    windowMount:
      "[data-showroom-window-mount]",

    windowCanvas:
      "canvas[data-showroom-window-canvas]",

    windowControl:
      "[data-showroom-window-control]",

    receiptTarget:
      "[data-showroom-object-stage-receipt], [data-showroom-window-receipt]"
  });

  const EVENTS = Object.freeze({
    READY:
      "SHOWROOM_OBJECT_STAGE_READY",

    UPDATED:
      "SHOWROOM_OBJECT_STAGE_UPDATED",

    DISPOSED:
      "SHOWROOM_OBJECT_STAGE_DISPOSED",

    FAILURE:
      "SHOWROOM_OBJECT_STAGE_FAILURE"
  });

  const EXTERNAL_EVENTS = Object.freeze({
    WINDOW_READY:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_READY",

    WINDOW_RENDERED:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_RENDERED",

    WINDOW_TRANSITION_COMPLETE:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_TRANSITION_COMPLETE"
  });

  const LATTICE_SCOPE = Object.freeze({
    radial:
      16,

    bands:
      16,

    seats:
      256,

    addressFormula:
      "seatIndex = band * 16 + radial"
  });

  const STAGE_WORLD = Object.freeze({
    coordinateSystem:
      Object.freeze({
        x:
          "left-right",

        y:
          "vertical",

        z:
          "depth",

        origin:
          "shared-window-diamond-stage-case-origin",

        zPositive:
          "toward-viewer"
      }),

    bounds:
      Object.freeze({
        x:
          Object.freeze([-1, 1]),

        y:
          Object.freeze([-1, 1]),

        z:
          Object.freeze([-1, 1])
      }),

    depthPlanes:
      Object.freeze({
        rearObject:
          -0.42,

        focalMidline:
          0,

        foregroundObject:
          0.34,

        apertureFace:
          0.66,

        controlPlane:
          0.92
      }),

    fitEnvelope:
      Object.freeze({
        diamond:
          Object.freeze({
            x:
              Object.freeze([-0.72, 0.72]),

            y:
              Object.freeze([-0.72, 0.72]),

            z:
              Object.freeze([-0.38, 0.38])
          }),

        window:
          Object.freeze({
            x:
              Object.freeze([-0.88, 0.88]),

            y:
              Object.freeze([-0.88, 0.88]),

            z:
              Object.freeze([-0.18, 0.18])
          })
      })
  });

  const DIAMOND_SOURCE_DEFAULT = Object.freeze({
    source:
      "/showroom/index.diamond.geometry.js",

    global:
      "DGBShowroomDiamondGeometryG3",

    expectedContract:
      "SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1",

    role:
      "rear-3d-object",

    readMode:
      "fallback-static-diamond-source",

    liveGeometryRead:
      false,

    coordinateSystem:
      Object.freeze({
        x:
          "left-right",

        y:
          "vertical",

        z:
          "depth",

        origin:
          Object.freeze([0, 0, 0]),

        automaticRotationAxis:
          "local-y",

        groundPlaneY:
          -1.31
      }),

    lattice:
      LATTICE_SCOPE,

    localBounds:
      Object.freeze({
        x:
          Object.freeze([-1.06, 1.06]),

        y:
          Object.freeze([-1.18, 0.76]),

        z:
          Object.freeze([-1.06, 1.06])
      }),

    anchors:
      Object.freeze({
        table:
          Object.freeze([0, 0.740, 0]),

        origin:
          Object.freeze([0, 0, 0]),

        culet:
          Object.freeze([0, -1.145, 0]),

        target:
          Object.freeze([0, -0.12, 0]),

        groundY:
          -1.31
      }),

    cameraPreparation:
      Object.freeze({
        position:
          Object.freeze([0.30, 0.18, 3.85]),

        target:
          Object.freeze([0, -0.12, 0]),

        fieldOfViewDegrees:
          32,

        distanceInitial:
          3.85,

        distanceMinimum:
          2.75,

        distanceMaximum:
          5.40
      })
  });

  const WINDOW_SOURCE_STATIC = Object.freeze({
    source:
      "/showroom/index.window.js",

    global:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

    expectedContract:
      "SHOWROOM_WINDOW_OBJECT_v1_3_FOREGROUND_LENS_APERTURE_FOCUS_OPTIMIZED_BASE",

    role:
      "foreground-3d-threshold-object",

    readMode:
      "static-bound-window-v1-3-source",

    liveGeometryRead:
      false,

    staticGeometryBound:
      true,

    coordinateSystem:
      Object.freeze({
        name:
          "W",

        x:
          "left-right-normalized-from-original-480-design-width",

        y:
          "vertical-normalized-from-original-720-design-height",

        z:
          "depth-positive-toward-viewer",

        origin:
          "center-of-original-window-design",

        motion:
          "object-frozen-in-time"
      }),

    design:
      Object.freeze({
        width:
          480,

        height:
          720,

        centerX:
          240,

        centerY:
          360,

        objectHalfWidth:
          240,

        objectHalfHeight:
          360
      }),

    localBounds:
      Object.freeze({
        x:
          Object.freeze([-1, 1]),

        y:
          Object.freeze([-1, 1]),

        z:
          Object.freeze([-0.20, 0.392])
      }),

    depth:
      Object.freeze({
        rearOcclusion:
          -0.20,

        rearGlassShadow:
          -0.12,

        glassBack:
          -0.085,

        glassCore:
          -0.018,

        glassFace:
          0.018,

        glassBevel:
          0.050,

        cameSide:
          0.075,

        cameFace:
          0.132,

        mullionSide:
          0.150,

        mullionFace:
          0.220,

        frameBack:
          0.010,

        frameBody:
          0.125,

        frameFace:
          0.245,

        frameLip:
          0.318,

        apertureWall:
          0.155,

        apertureFace:
          0.298,

        apertureLip:
          0.370,

        apertureGlow:
          0.382,

        surfaceAge:
          0.392
      }),

    projection:
      Object.freeze({
        focalLength:
          3.35,

        perspectiveStrength:
          0.88,

        tiltX:
          -0.038,

        tiltY:
          0.058,

        tiltZ:
          0
      }),

    aperture:
      Object.freeze({
        sourceCenter:
          Object.freeze([240, 328]),

        localCenter:
          Object.freeze([
            0,
            0.08888888888888889,
            0.370
          ]),

        clearSource:
          Object.freeze([
            Object.freeze([240, 260]),
            Object.freeze([266, 328]),
            Object.freeze([240, 396]),
            Object.freeze([214, 328])
          ]),

        outerSource:
          Object.freeze([
            Object.freeze([240, 214]),
            Object.freeze([306, 328]),
            Object.freeze([240, 442]),
            Object.freeze([174, 328])
          ]),

        focalRole:
          "foreground-lens-focus-to-diamond-behind"
      }),

    geometrySummary:
      Object.freeze({
        paneCount:
          21,

        uniqueCameSegmentCount:
          null,

        frameBandCount:
          12,

        aperturePointCount:
          4,

        apertureTransparent:
          true,

        apertureFocalRole:
          "foreground-lens-focus-to-diamond-behind"
      })
  });

  const state = {
    root:
      null,

    scene:
      null,

    diamondLayer:
      null,

    diamondStage:
      null,

    diamondCanvas:
      null,

    windowLayer:
      null,

    windowMount:
      null,

    windowCanvas:
      null,

    windowControl:
      null,

    receiptTarget:
      null,

    diamondSource:
      DIAMOND_SOURCE_DEFAULT,

    windowSource:
      WINDOW_SOURCE_STATIC,

    lattice:
      null,

    environment:
      null,

    receipt:
      null,

    initialized:
      false,

    disposed:
      false,

    failed:
      false,

    raf:
      0,

    resizeObserver:
      null,

    mutationObserver:
      null,

    resizeFallbackBound:
      false,

    windowEventBound:
      false,

    subscribers:
      new Set(),

    writingDom:
      false,

    lastAction:
      "",

    lastFailure:
      null
  };

  function freezeDeep(value) {
    if (
      !value ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    Object.freeze(value);

    Object.getOwnPropertyNames(value).forEach(
      key => freezeDeep(value[key])
    );

    return value;
  }

  function clonePlain(value) {
    if (
      !value ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(clonePlain);
    }

    const output = {};

    Object.keys(value).forEach(key => {
      output[key] =
        clonePlain(value[key]);
    });

    return output;
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    const number =
      Number(value);

    if (!Number.isFinite(number)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(
        maximum,
        number
      )
    );
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
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function magnitude(vector) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalize(vector) {
    const length =
      magnitude(vector);

    if (length <= 1e-9) {
      return [0, 0, 1];
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function safeNumber(
    value,
    fallback
  ) {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function copyVector(
    vector,
    fallback = [0, 0, 0]
  ) {
    const source =
      Array.isArray(vector) &&
      vector.length >= 3
        ? vector
        : fallback;

    return Object.freeze([
      safeNumber(source[0], fallback[0]),
      safeNumber(source[1], fallback[1]),
      safeNumber(source[2], fallback[2])
    ]);
  }

  function copyRange(
    range,
    fallback
  ) {
    const source =
      Array.isArray(range) &&
      range.length >= 2
        ? range
        : fallback;

    return Object.freeze([
      safeNumber(source[0], fallback[0]),
      safeNumber(source[1], fallback[1])
    ]);
  }

  function rangeSize(range) {
    return Math.abs(
      range[1] - range[0]
    );
  }

  function boundsSize(bounds) {
    return Object.freeze({
      x:
        rangeSize(bounds.x),

      y:
        rangeSize(bounds.y),

      z:
        rangeSize(bounds.z)
    });
  }

  function boundsCenter(bounds) {
    return Object.freeze([
      (bounds.x[0] + bounds.x[1]) / 2,
      (bounds.y[0] + bounds.y[1]) / 2,
      (bounds.z[0] + bounds.z[1]) / 2
    ]);
  }

  function fitScaleToEnvelope(
    localBounds,
    envelope
  ) {
    const local =
      boundsSize(localBounds);

    const fit =
      boundsSize(envelope);

    const scaleX =
      local.x > 0
        ? fit.x / local.x
        : 1;

    const scaleY =
      local.y > 0
        ? fit.y / local.y
        : 1;

    const scaleZ =
      local.z > 0
        ? fit.z / local.z
        : 1;

    return Math.min(
      scaleX,
      scaleY,
      scaleZ
    );
  }

  function getRect(element) {
    if (!element) {
      return Object.freeze({
        present:
          false,

        left:
          0,

        top:
          0,

        width:
          0,

        height:
          0,

        right:
          0,

        bottom:
          0,

        centerX:
          0,

        centerY:
          0
      });
    }

    const rect =
      element.getBoundingClientRect();

    return Object.freeze({
      present:
        true,

      left:
        rect.left,

      top:
        rect.top,

      width:
        rect.width,

      height:
        rect.height,

      right:
        rect.right,

      bottom:
        rect.bottom,

      centerX:
        rect.left + rect.width / 2,

      centerY:
        rect.top + rect.height / 2
    });
  }

  function rectWithin(
    child,
    parent
  ) {
    if (
      !child.present ||
      !parent.present
    ) {
      return false;
    }

    return (
      child.left >= parent.left - 0.5 &&
      child.top >= parent.top - 0.5 &&
      child.right <= parent.right + 0.5 &&
      child.bottom <= parent.bottom + 0.5
    );
  }

  function relativeRect(
    child,
    parent
  ) {
    if (
      !child.present ||
      !parent.present
    ) {
      return Object.freeze({
        present:
          false,

        left:
          0,

        top:
          0,

        width:
          0,

        height:
          0,

        right:
          0,

        bottom:
          0,

        centerX:
          0,

        centerY:
          0,

        normalizedCenterX:
          0.5,

        normalizedCenterY:
          0.5
      });
    }

    const left =
      child.left - parent.left;

    const top =
      child.top - parent.top;

    const centerX =
      left + child.width / 2;

    const centerY =
      top + child.height / 2;

    return Object.freeze({
      present:
        true,

      left,
      top,

      width:
        child.width,

      height:
        child.height,

      right:
        left + child.width,

      bottom:
        top + child.height,

      centerX,
      centerY,

      normalizedCenterX:
        parent.width > 0
          ? clamp(centerX / parent.width, 0, 1)
          : 0.5,

      normalizedCenterY:
        parent.height > 0
          ? clamp(centerY / parent.height, 0, 1)
          : 0.5
    });
  }

  function safeAnchorPosition(
    anchors,
    name,
    fallback
  ) {
    return copyVector(
      anchors &&
      anchors[name] &&
      anchors[name].position
        ? anchors[name].position
        : fallback,
      fallback
    );
  }

  function buildDiagnosticLattice() {
    const seats = [];

    for (
      let band = 0;
      band < LATTICE_SCOPE.bands;
      band += 1
    ) {
      for (
        let radial = 0;
        radial < LATTICE_SCOPE.radial;
        radial += 1
      ) {
        const seatIndex =
          band * LATTICE_SCOPE.radial + radial;

        const x =
          -1 +
          (
            radial + 0.5
          ) *
          (
            2 / LATTICE_SCOPE.radial
          );

        const y =
          1 -
          (
            band + 0.5
          ) *
          (
            2 / LATTICE_SCOPE.bands
          );

        seats.push(
          Object.freeze({
            id:
              `S3D-LATTICE-B${band}-R${radial}`,

            seatIndex,
            band,
            radial,

            worldPosition:
              Object.freeze([
                x,
                y,
                0
              ]),

            rearPlanePosition:
              Object.freeze([
                x,
                y,
                STAGE_WORLD.depthPlanes.rearObject
              ]),

            foregroundPlanePosition:
              Object.freeze([
                x,
                y,
                STAGE_WORLD.depthPlanes.foregroundObject
              ]),

            aperturePlanePosition:
              Object.freeze([
                x,
                y,
                STAGE_WORLD.depthPlanes.apertureFace
              ]),

            cardinal:
              radial % 4 === 0,

            major:
              radial % 2 === 0,

            diagnosticSeat:
              true
          })
        );
      }
    }

    return freezeDeep({
      scope:
        LATTICE_SCOPE,

      coordinateSystem:
        STAGE_WORLD.coordinateSystem,

      seats:
        Object.freeze(seats),

      seatCount:
        seats.length,

      xRange:
        STAGE_WORLD.bounds.x,

      yRange:
        STAGE_WORLD.bounds.y,

      zRange:
        STAGE_WORLD.bounds.z,

      depthPlanes:
        STAGE_WORLD.depthPlanes
    });
  }

  function readDiamondSource() {
    const api =
      globalThis.DGBShowroomDiamondGeometryG3;

    if (
      !api ||
      api.contract !==
        DIAMOND_SOURCE_DEFAULT.expectedContract
    ) {
      return DIAMOND_SOURCE_DEFAULT;
    }

    const declared =
      api.bounds &&
      api.bounds.declaredWorldBounds;

    const localBounds =
      Object.freeze({
        x:
          copyRange(
            declared && declared.x,
            DIAMOND_SOURCE_DEFAULT.localBounds.x
          ),

        y:
          copyRange(
            declared && declared.y,
            DIAMOND_SOURCE_DEFAULT.localBounds.y
          ),

        z:
          copyRange(
            declared && declared.z,
            DIAMOND_SOURCE_DEFAULT.localBounds.z
          )
      });

    const profile =
      api.profile || {};

    const profileCoordinateSystem =
      profile.coordinateSystem || {};

    const cameraPreparation =
      profile.cameraPreparation
        ? Object.freeze({
            position:
              copyVector(
                profile.cameraPreparation.initialPosition,
                DIAMOND_SOURCE_DEFAULT.cameraPreparation.position
              ),

            target:
              copyVector(
                profile.cameraPreparation.initialTarget,
                DIAMOND_SOURCE_DEFAULT.cameraPreparation.target
              ),

            fieldOfViewDegrees:
              safeNumber(
                profile.cameraPreparation.fieldOfViewDegrees,
                DIAMOND_SOURCE_DEFAULT.cameraPreparation.fieldOfViewDegrees
              ),

            distanceInitial:
              safeNumber(
                profile.cameraPreparation.distanceInitial,
                DIAMOND_SOURCE_DEFAULT.cameraPreparation.distanceInitial
              ),

            distanceMinimum:
              safeNumber(
                profile.cameraPreparation.distanceMinimum,
                DIAMOND_SOURCE_DEFAULT.cameraPreparation.distanceMinimum
              ),

            distanceMaximum:
              safeNumber(
                profile.cameraPreparation.distanceMaximum,
                DIAMOND_SOURCE_DEFAULT.cameraPreparation.distanceMaximum
              )
          })
        : DIAMOND_SOURCE_DEFAULT.cameraPreparation;

    const anchors =
      Object.freeze({
        table:
          safeAnchorPosition(
            api.anchors,
            "table",
            DIAMOND_SOURCE_DEFAULT.anchors.table
          ),

        origin:
          safeAnchorPosition(
            api.anchors,
            "origin",
            DIAMOND_SOURCE_DEFAULT.anchors.origin
          ),

        culet:
          safeAnchorPosition(
            api.anchors,
            "culet",
            DIAMOND_SOURCE_DEFAULT.anchors.culet
          ),

        target:
          copyVector(
            cameraPreparation.target,
            DIAMOND_SOURCE_DEFAULT.anchors.target
          ),

        groundY:
          safeNumber(
            api.anchors &&
              api.anchors.ground &&
              api.anchors.ground.y,
            DIAMOND_SOURCE_DEFAULT.anchors.groundY
          )
      });

    return freezeDeep({
      ...DIAMOND_SOURCE_DEFAULT,

      readMode:
        "live-diamond-geometry-authority",

      liveGeometryRead:
        true,

      contract:
        api.contract,

      version:
        api.version,

      receipt:
        api.getReceipt
          ? api.getReceipt()
          : api.receipt,

      coordinateSystem:
        Object.freeze({
          x:
            profileCoordinateSystem.x ||
            DIAMOND_SOURCE_DEFAULT.coordinateSystem.x,

          y:
            profileCoordinateSystem.y ||
            DIAMOND_SOURCE_DEFAULT.coordinateSystem.y,

          z:
            profileCoordinateSystem.z ||
            DIAMOND_SOURCE_DEFAULT.coordinateSystem.z,

          origin:
            copyVector(
              profileCoordinateSystem.origin,
              DIAMOND_SOURCE_DEFAULT.coordinateSystem.origin
            ),

          automaticRotationAxis:
            profileCoordinateSystem.automaticRotationAxis ||
            DIAMOND_SOURCE_DEFAULT.coordinateSystem.automaticRotationAxis,

          groundPlaneY:
            safeNumber(
              profileCoordinateSystem.groundPlaneY,
              DIAMOND_SOURCE_DEFAULT.coordinateSystem.groundPlaneY
            )
        }),

      lattice:
        Object.freeze({
          radial:
            safeNumber(api.radialCount, 16),

          bands:
            safeNumber(api.bandCount, 16),

          seats:
            safeNumber(api.seatCount, 256),

          addressFormula:
            LATTICE_SCOPE.addressFormula
        }),

      localBounds,
      anchors,
      cameraPreparation
    });
  }

  function readWindowSource() {
    const api =
      globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT;

    const base =
      {
        ...WINDOW_SOURCE_STATIC
      };

    if (
      !api ||
      typeof api.getGeometryReceipt !== "function"
    ) {
      return freezeDeep({
        ...base,

        readMode:
          "static-bound-window-source-no-live-object",

        liveGeometryRead:
          false,

        receiptConfirmed:
          false,

        geometryReceipt:
          null
      });
    }

    const geometryReceipt =
      api.getGeometryReceipt();

    if (
      !geometryReceipt ||
      !geometryReceipt.present
    ) {
      return freezeDeep({
        ...base,

        readMode:
          "static-bound-window-source-geometry-receipt-unavailable",

        liveGeometryRead:
          false,

        receiptConfirmed:
          false,

        geometryReceipt:
          geometryReceipt || null
      });
    }

    return freezeDeep({
      ...base,

      readMode:
        "static-bound-window-source-with-live-receipt-confirmation",

      liveGeometryRead:
        false,

      receiptConfirmed:
        true,

      geometryReceipt:
        clonePlain(geometryReceipt),

      receiptSummary:
        Object.freeze({
          coordinateSystem:
            geometryReceipt.coordinateSystem || null,

          design:
            geometryReceipt.design || null,

          paneCount:
            geometryReceipt.paneCount,

          uniqueCameSegmentCount:
            geometryReceipt.uniqueCameSegmentCount,

          frameBandCount:
            geometryReceipt.frameBandCount,

          aperturePointCount:
            geometryReceipt.aperturePointCount,

          apertureTransparent:
            geometryReceipt.apertureTransparent,

          apertureFocalRole:
            geometryReceipt.apertureFocalRole,

          depth:
            geometryReceipt.depth || null,

          renderModel:
            geometryReceipt.renderModel || null
        })
    });
  }

  function localToWorld(
    placement,
    localPoint
  ) {
    return Object.freeze([
      placement.position[0] + localPoint[0] * placement.scale,
      placement.position[1] + localPoint[1] * placement.scale,
      placement.position[2] + localPoint[2] * placement.scale
    ]);
  }

  function worldToLocal(
    placement,
    worldPoint
  ) {
    if (!placement.scale) {
      return Object.freeze([0, 0, 0]);
    }

    return Object.freeze([
      (worldPoint[0] - placement.position[0]) / placement.scale,
      (worldPoint[1] - placement.position[1]) / placement.scale,
      (worldPoint[2] - placement.position[2]) / placement.scale
    ]);
  }

  function buildCamera(diamondSource) {
    const prep =
      diamondSource.cameraPreparation ||
      DIAMOND_SOURCE_DEFAULT.cameraPreparation;

    const position =
      copyVector(
        prep.position,
        DIAMOND_SOURCE_DEFAULT.cameraPreparation.position
      );

    const target =
      copyVector(
        prep.target,
        DIAMOND_SOURCE_DEFAULT.cameraPreparation.target
      );

    const forward =
      normalize(
        subtract(target, position)
      );

    const worldUp =
      [0, 1, 0];

    let right =
      normalize(
        cross(forward, worldUp)
      );

    if (magnitude(right) <= 1e-9) {
      right =
        [1, 0, 0];
    }

    const up =
      normalize(
        cross(right, forward)
      );

    return freezeDeep({
      model:
        "shared-stage-case-camera-derived-from-diamond-camera-preparation",

      position,
      target,

      forward:
        Object.freeze(forward),

      right:
        Object.freeze(right),

      up:
        Object.freeze(up),

      fieldOfViewDegrees:
        safeNumber(
          prep.fieldOfViewDegrees,
          32
        ),

      distanceInitial:
        safeNumber(
          prep.distanceInitial,
          3.85
        ),

      distanceMinimum:
        safeNumber(
          prep.distanceMinimum,
          2.75
        ),

      distanceMaximum:
        safeNumber(
          prep.distanceMaximum,
          5.40
        )
    });
  }

  function buildObjectPlacements(
    diamondSource,
    windowSource
  ) {
    const diamondScale =
      fitScaleToEnvelope(
        diamondSource.localBounds,
        STAGE_WORLD.fitEnvelope.diamond
      );

    const diamondBoundsCenter =
      boundsCenter(
        diamondSource.localBounds
      );

    const diamondPosition =
      Object.freeze([
        -diamondBoundsCenter[0] * diamondScale,
        -diamondBoundsCenter[1] * diamondScale,
        STAGE_WORLD.depthPlanes.rearObject -
          diamondBoundsCenter[2] * diamondScale
      ]);

    const diamondPlacementShell =
      {
        position:
          diamondPosition,

        scale:
          diamondScale
      };

    const diamondPlacement =
      freezeDeep({
        id:
          "stage-case-object-diamond",

        role:
          "rear-3d-object",

        source:
          diamondSource.source,

        sourceGlobal:
          diamondSource.global,

        sourceReadMode:
          diamondSource.readMode,

        liveGeometryRead:
          diamondSource.liveGeometryRead,

        localCoordinateSystem:
          diamondSource.coordinateSystem,

        localBounds:
          diamondSource.localBounds,

        localBoundsCenter:
          diamondBoundsCenter,

        position:
          diamondPosition,

        scale:
          diamondScale,

        stageDepthPlane:
          STAGE_WORLD.depthPlanes.rearObject,

        localTarget:
          copyVector(
            diamondSource.anchors.target,
            DIAMOND_SOURCE_DEFAULT.anchors.target
          ),

        localAnchors:
          diamondSource.anchors,

        worldTarget:
          localToWorld(
            diamondPlacementShell,
            diamondSource.anchors.target
          ),

        worldOrigin:
          localToWorld(
            diamondPlacementShell,
            diamondSource.anchors.origin
          ),

        worldTable:
          localToWorld(
            diamondPlacementShell,
            diamondSource.anchors.table
          ),

        worldCulet:
          localToWorld(
            diamondPlacementShell,
            diamondSource.anchors.culet
          ),

        ownsGeometry:
          false,

        ownsRenderer:
          false,

        ownsControls:
          false
      });

    const windowScale =
      fitScaleToEnvelope(
        windowSource.localBounds,
        STAGE_WORLD.fitEnvelope.window
      );

    const apertureLocal =
      windowSource.aperture.localCenter;

    const target =
      diamondPlacement.worldTarget;

    const windowPosition =
      Object.freeze([
        target[0] - apertureLocal[0] * windowScale,
        target[1] - apertureLocal[1] * windowScale,
        STAGE_WORLD.depthPlanes.foregroundObject
      ]);

    const windowPlacementShell =
      {
        position:
          windowPosition,

        scale:
          windowScale
      };

    const windowPlacement =
      freezeDeep({
        id:
          "stage-case-object-window",

        role:
          "foreground-3d-threshold-object",

        source:
          windowSource.source,

        sourceGlobal:
          windowSource.global,

        sourceReadMode:
          windowSource.readMode,

        liveGeometryRead:
          false,

        staticGeometryBound:
          true,

        receiptConfirmed:
          Boolean(windowSource.receiptConfirmed),

        localCoordinateSystem:
          windowSource.coordinateSystem,

        localBounds:
          windowSource.localBounds,

        localBoundsCenter:
          boundsCenter(windowSource.localBounds),

        design:
          windowSource.design,

        depth:
          windowSource.depth,

        projection:
          windowSource.projection,

        position:
          windowPosition,

        scale:
          windowScale,

        stageDepthPlane:
          STAGE_WORLD.depthPlanes.foregroundObject,

        localApertureCenter:
          copyVector(apertureLocal),

        worldApertureCenter:
          localToWorld(
            windowPlacementShell,
            apertureLocal
          ),

        aperture:
          windowSource.aperture,

        geometryReceipt:
          windowSource.geometryReceipt || null,

        ownsGeometry:
          false,

        ownsRenderer:
          false,

        ownsControls:
          false
      });

    const apertureStart =
      windowPlacement.worldApertureCenter;

    const apertureEnd =
      diamondPlacement.worldTarget;

    const corridorVector =
      subtract(
        apertureEnd,
        apertureStart
      );

    const corridorDirection =
      normalize(corridorVector);

    return freezeDeep({
      diamond:
        diamondPlacement,

      window:
        windowPlacement,

      apertureCorridor:
        Object.freeze({
          id:
            "stage-case-aperture-corridor-window-to-diamond",

          role:
            "optical-corridor",

          fromObject:
            "window",

          toObject:
            "diamond",

          start:
            apertureStart,

          end:
            apertureEnd,

          vector:
            Object.freeze(corridorVector),

          direction:
            Object.freeze(corridorDirection),

          length:
            magnitude(corridorVector),

          alignedInX:
            Math.abs(apertureStart[0] - apertureEnd[0]) <= 1e-6,

          alignedInY:
            Math.abs(apertureStart[1] - apertureEnd[1]) <= 1e-6,

          foregroundZ:
            apertureStart[2],

          rearZ:
            apertureEnd[2]
        })
    });
  }

  function projectWorldToCamera(
    worldPoint,
    camera
  ) {
    const relative =
      subtract(
        worldPoint,
        camera.position
      );

    return Object.freeze({
      x:
        dot(relative, camera.right),

      y:
        dot(relative, camera.up),

      z:
        dot(relative, camera.forward)
    });
  }

  function projectWorldToNormalizedCorridor(
    worldPoint,
    environment
  ) {
    const cameraSpace =
      projectWorldToCamera(
        worldPoint,
        environment.camera
      );

    const fovRadians =
      environment.camera.fieldOfViewDegrees *
      Math.PI /
      180;

    const z =
      Math.max(
        0.001,
        cameraSpace.z
      );

    const aspect =
      environment.corridor.rect.width > 0 &&
      environment.corridor.rect.height > 0
        ? environment.corridor.rect.width /
          environment.corridor.rect.height
        : 1;

    const focal =
      1 / Math.tan(fovRadians / 2);

    const ndcX =
      (
        cameraSpace.x * focal / aspect
      ) /
      z;

    const ndcY =
      (
        cameraSpace.y * focal
      ) /
      z;

    return Object.freeze({
      x:
        clamp(
          0.5 + ndcX * 0.5,
          0,
          1
        ),

      y:
        clamp(
          0.5 - ndcY * 0.5,
          0,
          1
        ),

      raw:
        Object.freeze({
          x:
            ndcX,

          y:
            ndcY,

          z:
            cameraSpace.z
        })
    });
  }

  function projectWorldToCorridorPixel(
    worldPoint,
    environment
  ) {
    const normalized =
      projectWorldToNormalizedCorridor(
        worldPoint,
        environment
      );

    return Object.freeze({
      x:
        normalized.x *
        environment.corridor.rect.width,

      y:
        normalized.y *
        environment.corridor.rect.height,

      normalizedX:
        normalized.x,

      normalizedY:
        normalized.y,

      cameraZ:
        normalized.raw.z
    });
  }

  function buildCorridor() {
    const sceneRect =
      getRect(state.scene);

    const diamondLayerRect =
      getRect(state.diamondLayer);

    const diamondStageRect =
      getRect(state.diamondStage);

    const diamondCanvasRect =
      getRect(state.diamondCanvas);

    const windowLayerRect =
      getRect(state.windowLayer);

    const windowMountRect =
      getRect(state.windowMount);

    const windowCanvasRect =
      getRect(state.windowCanvas);

    const windowControlRect =
      getRect(state.windowControl);

    return freezeDeep({
      hardBoundary:
        "existing-css-corridor",

      selector:
        SELECTORS.scene,

      rect:
        sceneRect,

      contained:
        Object.freeze({
          diamondLayer:
            rectWithin(
              diamondLayerRect,
              sceneRect
            ),

          diamondStage:
            rectWithin(
              diamondStageRect,
              sceneRect
            ),

          diamondCanvas:
            diamondCanvasRect.present
              ? rectWithin(
                  diamondCanvasRect,
                  sceneRect
                )
              : true,

          windowLayer:
            rectWithin(
              windowLayerRect,
              sceneRect
            ),

          windowMount:
            rectWithin(
              windowMountRect,
              sceneRect
            ),

          windowCanvas:
            windowCanvasRect.present
              ? rectWithin(
                  windowCanvasRect,
                  sceneRect
                )
              : true,

          windowControl:
            windowControlRect.present
              ? rectWithin(
                  windowControlRect,
                  sceneRect
                )
              : true
        }),

      relative:
        Object.freeze({
          diamondLayer:
            relativeRect(
              diamondLayerRect,
              sceneRect
            ),

          diamondStage:
            relativeRect(
              diamondStageRect,
              sceneRect
            ),

          diamondCanvas:
            relativeRect(
              diamondCanvasRect,
              sceneRect
            ),

          windowLayer:
            relativeRect(
              windowLayerRect,
              sceneRect
            ),

          windowMount:
            relativeRect(
              windowMountRect,
              sceneRect
            ),

          windowCanvas:
            relativeRect(
              windowCanvasRect,
              sceneRect
            ),

          windowControl:
            relativeRect(
              windowControlRect,
              sceneRect
            )
        }),

      cssExpansion:
        false,

      cssRenewalRequired:
        false,

      newWrapperRequired:
        false
    });
  }

  function validateEnvironment(environment) {
    const checks = [];

    function check(
      id,
      pass,
      expected,
      actual,
      detail
    ) {
      checks.push(
        Object.freeze({
          id,
          pass:
            Boolean(pass),

          expected,
          actual,
          detail
        })
      );
    }

    check(
      "corridor-present",
      Boolean(state.scene),
      true,
      Boolean(state.scene),
      "The existing reveal-scene corridor must be present."
    );

    check(
      "diamond-layer-present",
      Boolean(state.diamondLayer),
      true,
      Boolean(state.diamondLayer),
      "The Diamond layer must be present inside the corridor."
    );

    check(
      "diamond-stage-present",
      Boolean(state.diamondStage),
      true,
      Boolean(state.diamondStage),
      "The Diamond stage must be present inside the corridor."
    );

    check(
      "window-layer-present",
      Boolean(state.windowLayer),
      true,
      Boolean(state.windowLayer),
      "The Window layer must be present inside the corridor."
    );

    check(
      "window-mount-present",
      Boolean(state.windowMount),
      true,
      Boolean(state.windowMount),
      "The Window mount must be present inside the corridor."
    );

    check(
      "stage-lattice-seat-count",
      environment.lattice.seatCount === 256,
      256,
      environment.lattice.seatCount,
      "The stage-case diagnostic lattice must expose exactly 256 seats."
    );

    check(
      "diamond-live-geometry-read",
      environment.sourceBasis.diamond.liveGeometryRead === true,
      true,
      environment.sourceBasis.diamond.liveGeometryRead,
      "The Diamond side should be live-derived from DGBShowroomDiamondGeometryG3."
    );

    check(
      "diamond-lattice-scope",
      environment.sourceBasis.diamond.lattice.radial === 16 &&
        environment.sourceBasis.diamond.lattice.bands === 16 &&
        environment.sourceBasis.diamond.lattice.seats === 256,
      "16x16/256",
      `${environment.sourceBasis.diamond.lattice.radial}x${environment.sourceBasis.diamond.lattice.bands}/${environment.sourceBasis.diamond.lattice.seats}`,
      "The Diamond geometry must match the 256 lattice scope."
    );

    check(
      "window-static-bound-declared",
      environment.sourceBasis.window.staticGeometryBound === true,
      true,
      environment.sourceBasis.window.staticGeometryBound,
      "The Window side must honestly declare static-bound stage-case geometry."
    );

    check(
      "window-3d-depth-present",
      environment.sourceBasis.window.localBounds.z[0] <
        environment.sourceBasis.window.localBounds.z[1],
      true,
      environment.sourceBasis.window.localBounds.z,
      "The Window stage-case source must expose a positive 3D depth interval."
    );

    check(
      "aperture-corridor-present",
      environment.objects.apertureCorridor.length > 0,
      true,
      environment.objects.apertureCorridor.length,
      "The stage-case must define an optical corridor from Window aperture to Diamond target."
    );

    check(
      "aperture-x-aligned",
      environment.objects.apertureCorridor.alignedInX,
      true,
      environment.objects.apertureCorridor.alignedInX,
      "The Window aperture and Diamond target must align horizontally in stage-case space."
    );

    check(
      "aperture-y-aligned",
      environment.objects.apertureCorridor.alignedInY,
      true,
      environment.objects.apertureCorridor.alignedInY,
      "The Window aperture and Diamond target must align vertically in stage-case space."
    );

    check(
      "window-foreground-of-diamond",
      environment.objects.window.worldApertureCenter[2] >
        environment.objects.diamond.worldTarget[2],
      true,
      {
        windowApertureZ:
          environment.objects.window.worldApertureCenter[2],

        diamondTargetZ:
          environment.objects.diamond.worldTarget[2]
      },
      "The Window aperture must occupy the foreground side of the Diamond target."
    );

    check(
      "css-expansion-forbidden",
      environment.corridor.cssExpansion === false,
      false,
      environment.corridor.cssExpansion,
      "The stage-case must not expand the existing CSS corridor."
    );

    check(
      "new-wrapper-forbidden",
      environment.corridor.newWrapperRequired === false,
      false,
      environment.corridor.newWrapperRequired,
      "The stage-case must not require a new wrapper."
    );

    const failed =
      checks.filter(item => !item.pass);

    return Object.freeze({
      passed:
        failed.length === 0,

      checkCount:
        checks.length,

      passCount:
        checks.length - failed.length,

      failCount:
        failed.length,

      checks:
        Object.freeze(checks),

      failed:
        Object.freeze(failed)
    });
  }

  function buildEnvironment(reason) {
    const diamondSource =
      readDiamondSource();

    const windowSource =
      readWindowSource();

    state.diamondSource =
      diamondSource;

    state.windowSource =
      windowSource;

    const lattice =
      buildDiagnosticLattice();

    const corridor =
      buildCorridor();

    const camera =
      buildCamera(diamondSource);

    const objects =
      buildObjectPlacements(
        diamondSource,
        windowSource
      );

    const environmentShell =
      {
        id:
          `showroom-window-diamond-stage-case-${Date.now()}`,

        contractId:
          CONTRACT.id,

        fileClass:
          CONTRACT.fileClass,

        reason:
          String(reason || "environment-refresh"),

        timestamp:
          Date.now(),

        world:
          STAGE_WORLD,

        lattice,

        sourceBasis:
          Object.freeze({
            diamond:
              diamondSource,

            window:
              windowSource
          }),

        corridor,

        camera,

        objects
      };

    return freezeDeep({
      ...environmentShell,

      validation:
        validateEnvironment(environmentShell)
    });
  }

  function writeEnvironmentToDom() {
    const environment =
      state.environment;

    if (
      !environment ||
      !state.scene
    ) {
      return;
    }

    state.writingDom =
      true;

    try {
      const aperturePixel =
        projectWorldToCorridorPixel(
          environment.objects.window.worldApertureCenter,
          environment
        );

      const diamondPixel =
        projectWorldToCorridorPixel(
          environment.objects.diamond.worldTarget,
          environment
        );

      state.scene.dataset.showroomObjectStage =
        "ready";

      state.scene.dataset.showroomObjectStageContract =
        CONTRACT.id;

      state.scene.dataset.showroomObjectStageType =
        "window-diamond-stage-case-3d-256-lattice";

      state.scene.dataset.showroomObjectStageFileClass =
        "stage-case";

      state.scene.dataset.showroomObjectStageCorridorBound =
        "true";

      state.scene.dataset.showroomObjectStageCssExpansion =
        "false";

      state.scene.dataset.showroomObjectStageLatticeSeats =
        String(LATTICE_SCOPE.seats);

      state.scene.dataset.showroomObjectStageApertureCorridor =
        "available";

      state.scene.dataset.showroomObjectStageValidation =
        environment.validation.passed
          ? "pass"
          : "fail";

      state.scene.dataset.showroomObjectStageDiamondSource =
        environment.sourceBasis.diamond.readMode;

      state.scene.dataset.showroomObjectStageWindowSource =
        environment.sourceBasis.window.readMode;

      state.scene.style.setProperty(
        "--showroom-object-stage-aperture-x",
        `${aperturePixel.x}px`
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-aperture-y",
        `${aperturePixel.y}px`
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-aperture-x-ratio",
        String(aperturePixel.normalizedX)
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-aperture-y-ratio",
        String(aperturePixel.normalizedY)
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-diamond-target-x",
        `${diamondPixel.x}px`
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-diamond-target-y",
        `${diamondPixel.y}px`
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-diamond-target-x-ratio",
        String(diamondPixel.normalizedX)
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-diamond-target-y-ratio",
        String(diamondPixel.normalizedY)
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-diamond-scale",
        String(environment.objects.diamond.scale)
      );

      state.scene.style.setProperty(
        "--showroom-object-stage-window-scale",
        String(environment.objects.window.scale)
      );

      if (state.diamondLayer) {
        state.diamondLayer.dataset.showroomObjectStageParticipant =
          "diamond";

        state.diamondLayer.dataset.showroomObjectStageRole =
          "rear-3d-object";

        state.diamondLayer.dataset.showroomObjectStageDepth =
          String(environment.objects.diamond.stageDepthPlane);

        state.diamondLayer.dataset.showroomObjectStageSource =
          environment.sourceBasis.diamond.readMode;
      }

      if (state.diamondStage) {
        state.diamondStage.dataset.showroomObjectStageParticipant =
          "diamond-stage";

        state.diamondStage.dataset.showroomObjectStageLatticeSeats =
          String(LATTICE_SCOPE.seats);

        state.diamondStage.dataset.showroomObjectStageScale =
          String(environment.objects.diamond.scale);
      }

      if (state.windowLayer) {
        state.windowLayer.dataset.showroomObjectStageParticipant =
          "window";

        state.windowLayer.dataset.showroomObjectStageRole =
          "foreground-3d-threshold-object";

        state.windowLayer.dataset.showroomObjectStageDepth =
          String(environment.objects.window.stageDepthPlane);

        state.windowLayer.dataset.showroomObjectStageSource =
          environment.sourceBasis.window.readMode;
      }

      if (state.windowMount) {
        state.windowMount.dataset.showroomObjectStageParticipant =
          "window-mount";

        state.windowMount.dataset.showroomObjectStageApertureCorridor =
          "available";

        state.windowMount.dataset.showroomObjectStageScale =
          String(environment.objects.window.scale);
      }
    } finally {
      requestAnimationFrame(
        () => {
          state.writingDom =
            false;
        }
      );
    }
  }

  function createReceipt(extra = {}) {
    const environment =
      state.environment;

    const receipt =
      freezeDeep({
        contractId:
          CONTRACT.id,

        file:
          CONTRACT.file,

        publicSurface:
          CONTRACT.publicSurface,

        status:
          state.disposed
            ? "disposed"
            : state.failed
              ? "failed"
              : state.initialized
                ? "available"
                : "pending",

        initialized:
          state.initialized,

        disposed:
          state.disposed,

        failed:
          state.failed,

        fileClass:
          CONTRACT.fileClass,

        pureLiveStage:
          false,

        stageCase:
          true,

        sourceBasis:
          CONTRACT.sourceBasis,

        diamondSourceMode:
          state.diamondSource
            ? state.diamondSource.readMode
            : "unknown",

        diamondLiveGeometryRead:
          state.diamondSource
            ? Boolean(state.diamondSource.liveGeometryRead)
            : false,

        windowSourceMode:
          state.windowSource
            ? state.windowSource.readMode
            : "unknown",

        windowStaticGeometryBound:
          true,

        windowReceiptConfirmed:
          state.windowSource
            ? Boolean(state.windowSource.receiptConfirmed)
            : false,

        corridorBound:
          true,

        cssExpansionAuthorized:
          false,

        cssRenewalRequired:
          false,

        htmlRenewalRequired:
          false,

        newWrapperRequired:
          false,

        stageType:
          "window-diamond-stage-case-3d-256-lattice",

        latticeSeats:
          environment
            ? environment.lattice.seatCount
            : 0,

        latticeRadial:
          LATTICE_SCOPE.radial,

        latticeBands:
          LATTICE_SCOPE.bands,

        corridorPresent:
          Boolean(state.scene),

        diamondLayerPresent:
          Boolean(state.diamondLayer),

        diamondStagePresent:
          Boolean(state.diamondStage),

        windowLayerPresent:
          Boolean(state.windowLayer),

        windowMountPresent:
          Boolean(state.windowMount),

        windowCanvasPresent:
          Boolean(state.windowCanvas),

        diamondCanvasPresent:
          Boolean(state.diamondCanvas),

        validationPassed:
          environment
            ? environment.validation.passed
            : false,

        validationFailCount:
          environment
            ? environment.validation.failCount
            : 0,

        apertureCorridorPresent:
          Boolean(
            environment &&
            environment.objects &&
            environment.objects.apertureCorridor
          ),

        apertureCorridorLength:
          environment
            ? environment.objects.apertureCorridor.length
            : 0,

        diamondScale:
          environment
            ? environment.objects.diamond.scale
            : 0,

        windowScale:
          environment
            ? environment.objects.window.scale
            : 0,

        ownsRenderer:
          false,

        ownsDrawing:
          false,

        ownsDiamondGeometry:
          false,

        ownsWindowGeometry:
          false,

        ownsControls:
          false,

        ownsUI:
          false,

        ownsGestures:
          false,

        ownsRoutes:
          false,

        ownsPageState:
          false,

        visualPassClaimed:
          false,

        productionAuthorized:
          false,

        deploymentAuthorized:
          false,

        lastAction:
          state.lastAction,

        lastFailure:
          state.lastFailure,

        ...extra
      });

    state.receipt =
      receipt;

    globalThis.SHOWROOM_OBJECT_STAGE_RECEIPT =
      receipt;

    if (state.receiptTarget) {
      try {
        state.receiptTarget.value =
          JSON.stringify(
            receipt,
            null,
            2
          );
      } catch (_) {
        state.receiptTarget.value =
          String(receipt.status);
      }
    }

    return receipt;
  }

  function notifySubscribers() {
    const snapshot =
      getSnapshot();

    state.subscribers.forEach(callback => {
      try {
        callback(snapshot);
      } catch (_) {}
    });
  }

  function dispatch(
    type,
    detail = {}
  ) {
    try {
      globalThis.dispatchEvent(
        new CustomEvent(
          type,
          {
            detail:
              Object.freeze({
                contractId:
                  CONTRACT.id,

                file:
                  CONTRACT.file,

                ...detail
              })
          }
        )
      );
    } catch (_) {}
  }

  function refresh(reason = "manual") {
    if (
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    state.environment =
      buildEnvironment(reason);

    writeEnvironmentToDom();

    state.lastAction =
      "stage-case-environment-refreshed";

    createReceipt({
      lastAction:
        state.lastAction,

      refreshReason:
        String(reason || "manual")
    });

    notifySubscribers();

    dispatch(
      EVENTS.UPDATED,
      {
        reason:
          String(reason || "manual"),

        environment:
          getEnvironment(),

        receipt:
          getReceipt()
      }
    );

    return true;
  }

  function requestRefresh(reason) {
    if (state.raf) {
      return;
    }

    state.raf =
      requestAnimationFrame(
        () => {
          state.raf =
            0;

          refresh(reason || "animation-frame");
        }
      );
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    state.scene =
      document.querySelector(
        SELECTORS.scene
      );

    if (!state.scene) {
      throw new Error(
        "SHOWROOM_STAGE_CASE_CORRIDOR_NOT_FOUND"
      );
    }

    state.diamondLayer =
      state.scene.querySelector(
        SELECTORS.diamondLayer
      );

    state.diamondStage =
      state.scene.querySelector(
        SELECTORS.diamondStage
      );

    state.diamondCanvas =
      state.scene.querySelector(
        SELECTORS.diamondCanvas
      );

    state.windowLayer =
      state.scene.querySelector(
        SELECTORS.windowLayer
      );

    state.windowMount =
      state.scene.querySelector(
        SELECTORS.windowMount
      );

    state.windowCanvas =
      state.scene.querySelector(
        SELECTORS.windowCanvas
      );

    state.windowControl =
      state.scene.querySelector(
        SELECTORS.windowControl
      );

    state.receiptTarget =
      document.querySelector(
        SELECTORS.receiptTarget
      );

    if (!state.diamondLayer) {
      throw new Error(
        "SHOWROOM_STAGE_CASE_DIAMOND_LAYER_NOT_FOUND"
      );
    }

    if (!state.diamondStage) {
      throw new Error(
        "SHOWROOM_STAGE_CASE_DIAMOND_STAGE_NOT_FOUND"
      );
    }

    if (!state.windowLayer) {
      throw new Error(
        "SHOWROOM_STAGE_CASE_WINDOW_LAYER_NOT_FOUND"
      );
    }

    if (!state.windowMount) {
      throw new Error(
        "SHOWROOM_STAGE_CASE_WINDOW_MOUNT_NOT_FOUND"
      );
    }

    state.scene.dataset.showroomObjectStage =
      "initializing";

    state.scene.dataset.showroomObjectStageContract =
      CONTRACT.id;

    state.scene.dataset.showroomObjectStageFileClass =
      "stage-case";

    state.scene.dataset.showroomObjectStageCssExpansion =
      "false";
  }

  function bindResize() {
    if (state.resizeObserver) {
      return;
    }

    if (typeof ResizeObserver === "function") {
      state.resizeObserver =
        new ResizeObserver(
          () => {
            requestRefresh("resize-observer");
          }
        );

      [
        state.scene,
        state.diamondLayer,
        state.diamondStage,
        state.windowLayer,
        state.windowMount
      ].forEach(element => {
        if (element) {
          state.resizeObserver.observe(element);
        }
      });

      return;
    }

    if (!state.resizeFallbackBound) {
      state.resizeFallbackBound =
        true;

      globalThis.addEventListener(
        "resize",
        handleResizeFallback,
        {
          passive:
            true
        }
      );
    }
  }

  function handleResizeFallback() {
    requestRefresh("resize-event");
  }

  function handleWindowGeometryEvent() {
    requestRefresh("window-object-geometry-event");
  }

  function bindWindowEvents() {
    if (state.windowEventBound) {
      return;
    }

    state.windowEventBound =
      true;

    [
      EXTERNAL_EVENTS.WINDOW_READY,
      EXTERNAL_EVENTS.WINDOW_RENDERED,
      EXTERNAL_EVENTS.WINDOW_TRANSITION_COMPLETE
    ].forEach(type => {
      globalThis.addEventListener(
        type,
        handleWindowGeometryEvent,
        {
          passive:
            true
        }
      );
    });
  }

  function unbindWindowEvents() {
    if (!state.windowEventBound) {
      return;
    }

    state.windowEventBound =
      false;

    [
      EXTERNAL_EVENTS.WINDOW_READY,
      EXTERNAL_EVENTS.WINDOW_RENDERED,
      EXTERNAL_EVENTS.WINDOW_TRANSITION_COMPLETE
    ].forEach(type => {
      globalThis.removeEventListener(
        type,
        handleWindowGeometryEvent
      );
    });
  }

  function bindMutationObserver() {
    if (
      typeof MutationObserver !== "function" ||
      state.mutationObserver ||
      !state.scene
    ) {
      return;
    }

    state.mutationObserver =
      new MutationObserver(
        mutations => {
          if (state.writingDom) {
            return;
          }

          const shouldRefresh =
            mutations.some(mutation =>
              mutation.type === "childList" ||
              (
                mutation.type === "attributes" &&
                [
                  "hidden",
                  "data-showroom-window-state",
                  "data-showroom-window-canvas-dormant"
                ].includes(mutation.attributeName)
              )
            );

          if (shouldRefresh) {
            state.windowCanvas =
              state.scene.querySelector(
                SELECTORS.windowCanvas
              );

            state.diamondCanvas =
              state.scene.querySelector(
                SELECTORS.diamondCanvas
              );

            requestRefresh("mutation-observer");
          }
        }
      );

    state.mutationObserver.observe(
      state.scene,
      {
        subtree:
          true,

        childList:
          true,

        attributes:
          true,

        attributeFilter:
          [
            "hidden",
            "data-showroom-window-state",
            "data-showroom-window-canvas-dormant"
          ]
      }
    );
  }

  function unbind() {
    if (state.raf) {
      cancelAnimationFrame(state.raf);

      state.raf =
        0;
    }

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();

      state.resizeObserver =
        null;
    }

    if (state.mutationObserver) {
      state.mutationObserver.disconnect();

      state.mutationObserver =
        null;
    }

    if (state.resizeFallbackBound) {
      state.resizeFallbackBound =
        false;

      globalThis.removeEventListener(
        "resize",
        handleResizeFallback
      );
    }

    unbindWindowEvents();
  }

  function fail(reason) {
    state.failed =
      true;

    state.lastFailure =
      String(reason || "SHOWROOM_STAGE_CASE_FAILURE");

    unbind();

    if (state.scene) {
      state.scene.dataset.showroomObjectStage =
        "failed";

      state.scene.dataset.showroomObjectStageFailure =
        state.lastFailure;
    }

    createReceipt({
      status:
        "failed",

      lastAction:
        "stage-case-failed",

      lastFailure:
        state.lastFailure
    });

    dispatch(
      EVENTS.FAILURE,
      {
        reason:
          state.lastFailure,

        receipt:
          getReceipt()
      }
    );
  }

  function dispose() {
    if (state.disposed) {
      return true;
    }

    unbind();

    state.disposed =
      true;

    state.initialized =
      false;

    state.subscribers.clear();

    if (state.scene) {
      state.scene.dataset.showroomObjectStage =
        "disposed";
    }

    state.lastAction =
      "stage-case-disposed";

    createReceipt({
      status:
        "disposed",

      disposed:
        true,

      initialized:
        false,

      lastAction:
        state.lastAction,

      lastFailure:
        null
    });

    dispatch(
      EVENTS.DISPOSED,
      {
        receipt:
          getReceipt()
      }
    );

    return true;
  }

  function getEnvironment() {
    return state.environment || null;
  }

  function getLattice() {
    return state.environment
      ? state.environment.lattice
      : null;
  }

  function getObjectPlacement(objectName) {
    if (
      !state.environment ||
      !state.environment.objects
    ) {
      return null;
    }

    return state.environment.objects[
      objectName
    ] || null;
  }

  function getApertureCorridor() {
    return state.environment &&
      state.environment.objects
      ? state.environment.objects.apertureCorridor
      : null;
  }

  function getReceipt() {
    return state.receipt
      ? freezeDeep({ ...state.receipt })
      : createReceipt();
  }

  function getSnapshot() {
    return freezeDeep({
      contract:
        CONTRACT,

      environment:
        getEnvironment(),

      receipt:
        getReceipt()
    });
  }

  function publicLocalToWorld(
    objectName,
    localPoint
  ) {
    const placement =
      getObjectPlacement(objectName);

    if (!placement) {
      return null;
    }

    return localToWorld(
      placement,
      localPoint
    );
  }

  function publicWorldToLocal(
    objectName,
    worldPoint
  ) {
    const placement =
      getObjectPlacement(objectName);

    if (!placement) {
      return null;
    }

    return worldToLocal(
      placement,
      worldPoint
    );
  }

  function publicWorldToCorridor(worldPoint) {
    if (!state.environment) {
      return null;
    }

    return projectWorldToCorridorPixel(
      worldPoint,
      state.environment
    );
  }

  function subscribe(callback) {
    if (typeof callback !== "function") {
      return () => {};
    }

    state.subscribers.add(callback);

    try {
      callback(getSnapshot());
    } catch (_) {}

    return () => {
      state.subscribers.delete(callback);
    };
  }

  function exposeApi() {
    globalThis.SHOWROOM_OBJECT_STAGE =
      Object.freeze({
        contract:
          CONTRACT,

        events:
          EVENTS,

        refresh,

        dispose,

        getEnvironment,

        getLattice,

        getObjectPlacement,

        getApertureCorridor,

        getReceipt,

        getSnapshot,

        localToWorld:
          publicLocalToWorld,

        worldToLocal:
          publicWorldToLocal,

        worldToCorridor:
          publicWorldToCorridor,

        subscribe,

        isReady:
          () => Boolean(
            state.initialized &&
            !state.failed &&
            !state.disposed &&
            state.environment &&
            state.environment.validation &&
            state.environment.validation.passed
          )
      });
  }

  function init() {
    try {
      const previous =
        globalThis.SHOWROOM_OBJECT_STAGE;

      if (
        previous &&
        typeof previous.dispose === "function"
      ) {
        try {
          previous.dispose();
        } catch (_) {}
      }

      exposeApi();
      discoverDom();

      state.lattice =
        buildDiagnosticLattice();

      state.initialized =
        true;

      refresh("initialization");

      bindResize();
      bindMutationObserver();
      bindWindowEvents();

      state.lastAction =
        "window-diamond-stage-case-initialized";

      createReceipt({
        status:
          "available",

        initialized:
          true,

        lastAction:
          state.lastAction,

        lastFailure:
          null
      });

      dispatch(
        EVENTS.READY,
        {
          environment:
            getEnvironment(),

          receipt:
            getReceipt()
        }
      );
    } catch (error) {
      exposeApi();

      fail(
        error && error.message
          ? error.message
          : String(error)
      );
    }
  }

  if (document.readyState === "loading") {
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
