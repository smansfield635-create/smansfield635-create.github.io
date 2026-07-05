/* TARGET FILE: /showroom/index.object-stage.js */
/* COMPLETE NEW FILE */ 
/* SHOWROOM_OBJECT_STAGE_v2_SHARED_3D_256_LATTICE_ENVIRONMENT_WITHIN_EXISTING_CORRIDOR */

/*
  Showroom Object Stage

  Purpose:
  - Define the shared 3D environment for the Diamond and Window objects.
  - Build the environment from the two object geometry authorities:
    1. /showroom/index.diamond.geometry.js
    2. /showroom/index.window.js
  - Preserve the existing CSS corridor as the hard external boundary.
  - Establish a 16 × 16 / 256-seat diagnostic lattice scope.
  - Place Diamond and Window into one shared x/y/z world.
  - Define the aperture corridor from the Window foreground plane to the Diamond focal target.
  - Publish transforms, placements, projection data, receipts, and CSS variables.
  - Draw nothing.
  - Move no DOM nodes.
  - Expand no CSS box.
  - Own no controls, gestures, routes, UI, renderer internals, or object internals.

  Boundary:
  - The stage owns spatial authority only.
  - Diamond owns Diamond geometry.
  - Window owns Window geometry.
  - Controls behave inside the already-defined space.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_OBJECT_STAGE_v2_SHARED_3D_256_LATTICE_ENVIRONMENT_WITHIN_EXISTING_CORRIDOR",

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
      "shared-3d-spatial-environment-authority",

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

    windowReceipt:
      "[data-showroom-window-receipt]"
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
          "shared-diamond-window-stage-origin",

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

    role:
      "rear-3d-object",

    coordinateSystem:
      Object.freeze({
        x:
          "left-right",

        y:
          "vertical",

        z:
          "depth",

        origin:
          Object.freeze([0, 0, 0])
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
          Object.freeze([0, -0.12, 0])
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

  const WINDOW_SOURCE = Object.freeze({
    source:
      "/showroom/index.window.js",

    global:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

    role:
      "foreground-3d-threshold-object",

    coordinateSystem:
      Object.freeze({
        x:
          "left-right-normalized-from-original-480-design-width",

        y:
          "vertical-normalized-from-original-720-design-height",

        z:
          "depth-positive-toward-viewer",

        origin:
          "center-of-original-window-design"
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

        glassBack:
          -0.085,

        glassCore:
          -0.018,

        glassFace:
          0.018,

        glassBevel:
          0.050,

        cameFace:
          0.132,

        mullionFace:
          0.220,

        frameFace:
          0.245,

        frameLip:
          0.318,

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

    subscribers:
      new Set(),

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

  function add(a, b) {
    return [
      a[0] + b[0],
      a[1] + b[1],
      a[2] + b[2]
    ];
  }

  function scaleVector(vector, scale) {
    return [
      vector[0] * scale,
      vector[1] * scale,
      vector[2] * scale
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

  function copyVector(vector) {
    return Object.freeze([
      Number(vector[0]),
      Number(vector[1]),
      Number(vector[2])
    ]);
  }

  function copyRange(range) {
    return Object.freeze([
      Number(range[0]),
      Number(range[1])
    ]);
  }

  function rangeSize(range) {
    return Math.abs(range[1] - range[0]);
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
        "SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1"
    ) {
      return DIAMOND_SOURCE_DEFAULT;
    }

    const declared =
      api.bounds &&
      api.bounds.declaredWorldBounds;

    const localBounds =
      declared
        ? Object.freeze({
            x:
              copyRange(declared.x),

            y:
              copyRange(declared.y),

            z:
              copyRange(declared.z)
          })
        : DIAMOND_SOURCE_DEFAULT.localBounds;

    const profile =
      api.profile || {};

    const cameraPreparation =
      profile.cameraPreparation
        ? Object.freeze({
            position:
              copyVector(profile.cameraPreparation.initialPosition || DIAMOND_SOURCE_DEFAULT.cameraPreparation.position),

            target:
              copyVector(profile.cameraPreparation.initialTarget || DIAMOND_SOURCE_DEFAULT.cameraPreparation.target),

            fieldOfViewDegrees:
              Number(profile.cameraPreparation.fieldOfViewDegrees || DIAMOND_SOURCE_DEFAULT.cameraPreparation.fieldOfViewDegrees),

            distanceInitial:
              Number(profile.cameraPreparation.distanceInitial || DIAMOND_SOURCE_DEFAULT.cameraPreparation.distanceInitial),

            distanceMinimum:
              Number(profile.cameraPreparation.distanceMinimum || DIAMOND_SOURCE_DEFAULT.cameraPreparation.distanceMinimum),

            distanceMaximum:
              Number(profile.cameraPreparation.distanceMaximum || DIAMOND_SOURCE_DEFAULT.cameraPreparation.distanceMaximum)
          })
        : DIAMOND_SOURCE_DEFAULT.cameraPreparation;

    const anchors =
      api.anchors
        ? Object.freeze({
            table:
              copyVector(api.anchors.table.position || DIAMOND_SOURCE_DEFAULT.anchors.table),

            origin:
              copyVector(api.anchors.origin.position || DIAMOND_SOURCE_DEFAULT.anchors.origin),

            culet:
              copyVector(api.anchors.culet.position || DIAMOND_SOURCE_DEFAULT.anchors.culet),

            target:
              copyVector(cameraPreparation.target)
          })
        : DIAMOND_SOURCE_DEFAULT.anchors;

    return freezeDeep({
      ...DIAMOND_SOURCE_DEFAULT,

      contract:
        api.contract,

      version:
        api.version,

      receipt:
        api.getReceipt
          ? api.getReceipt()
          : api.receipt,

      lattice:
        Object.freeze({
          radial:
            Number(api.radialCount || 16),

          bands:
            Number(api.bandCount || 16),

          seats:
            Number(api.seatCount || 256),

          addressFormula:
            LATTICE_SCOPE.addressFormula
        }),

      localBounds,
      anchors,
      cameraPreparation
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
      copyVector(prep.position);

    const target =
      copyVector(prep.target);

    const forward =
      normalize(
        subtract(target, position)
      );

    const worldUp =
      [0, 1, 0];

    const right =
      normalize(
        cross(forward, worldUp)
      );

    const up =
      normalize(
        cross(right, forward)
      );

    return freezeDeep({
      model:
        "shared-stage-camera-derived-from-diamond-camera-preparation",

      position,
      target,
      forward:
        Object.freeze(forward),

      right:
        Object.freeze(right),

      up:
        Object.freeze(up),

      fieldOfViewDegrees:
        Number(prep.fieldOfViewDegrees),

      distanceInitial:
        Number(prep.distanceInitial),

      distanceMinimum:
        Number(prep.distanceMinimum),

      distanceMaximum:
        Number(prep.distanceMaximum)
    });
  }

  function buildObjectPlacements(
    diamondSource
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

    const diamondPlacement =
      freezeDeep({
        id:
          "stage-object-diamond",

        role:
          "rear-3d-object",

        source:
          diamondSource.source,

        sourceGlobal:
          diamondSource.global,

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
          copyVector(diamondSource.anchors.target),

        localAnchors:
          diamondSource.anchors,

        worldTarget:
          localToWorld(
            {
              position:
                diamondPosition,

              scale:
                diamondScale
            },
            diamondSource.anchors.target
          ),

        worldOrigin:
          localToWorld(
            {
              position:
                diamondPosition,

              scale:
                diamondScale
            },
            diamondSource.anchors.origin
          ),

        worldTable:
          localToWorld(
            {
              position:
                diamondPosition,

              scale:
                diamondScale
            },
            diamondSource.anchors.table
          ),

        worldCulet:
          localToWorld(
            {
              position:
                diamondPosition,

              scale:
                diamondScale
            },
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
        WINDOW_SOURCE.localBounds,
        STAGE_WORLD.fitEnvelope.window
      );

    const apertureLocal =
      WINDOW_SOURCE.aperture.localCenter;

    const target =
      diamondPlacement.worldTarget;

    const windowPosition =
      Object.freeze([
        target[0] - apertureLocal[0] * windowScale,
        target[1] - apertureLocal[1] * windowScale,
        STAGE_WORLD.depthPlanes.foregroundObject
      ]);

    const windowPlacement =
      freezeDeep({
        id:
          "stage-object-window",

        role:
          "foreground-3d-threshold-object",

        source:
          WINDOW_SOURCE.source,

        sourceGlobal:
          WINDOW_SOURCE.global,

        localCoordinateSystem:
          WINDOW_SOURCE.coordinateSystem,

        localBounds:
          WINDOW_SOURCE.localBounds,

        localBoundsCenter:
          boundsCenter(WINDOW_SOURCE.localBounds),

        design:
          WINDOW_SOURCE.design,

        depth:
          WINDOW_SOURCE.depth,

        projection:
          WINDOW_SOURCE.projection,

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
            {
              position:
                windowPosition,

              scale:
                windowScale
            },
            apertureLocal
          ),

        aperture:
          WINDOW_SOURCE.aperture,

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
            "stage-aperture-corridor-window-to-diamond",

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

    const x =
      dot(relative, camera.right);

    const y =
      dot(relative, camera.up);

    const z =
      dot(relative, camera.forward);

    return Object.freeze({
      x,
      y,
      z
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
            rectWithin(
              windowControlRect,
              sceneRect
            )
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

  function buildEnvironment(reason) {
    const diamondSource =
      readDiamondSource();

    state.diamondSource =
      diamondSource;

    const lattice =
      buildDiagnosticLattice();

    const corridor =
      buildCorridor();

    const camera =
      buildCamera(diamondSource);

    const placements =
      buildObjectPlacements(diamondSource);

    const environmentShell =
      {
        id:
          `showroom-object-stage-environment-${Date.now()}`,

        contractId:
          CONTRACT.id,

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
              WINDOW_SOURCE
          }),

        corridor,

        camera,

        objects:
          placements,

        validation:
          null
      };

    const environment =
      freezeDeep({
        ...environmentShell,

        validation:
          validateEnvironment(environmentShell)
      });

    return environment;
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
      "diamond-stage-present",
      Boolean(state.diamondStage),
      true,
      Boolean(state.diamondStage),
      "The Diamond stage must be present inside the corridor."
    );

    check(
      "window-mount-present",
      Boolean(state.windowMount),
      true,
      Boolean(state.windowMount),
      "The Window mount must be present inside the corridor."
    );

    check(
      "lattice-seat-count",
      environment.lattice.seatCount === 256,
      256,
      environment.lattice.seatCount,
      "The stage diagnostic lattice must expose exactly 256 seats."
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
      "window-3d-depth-present",
      WINDOW_SOURCE.localBounds.z[0] < WINDOW_SOURCE.localBounds.z[1],
      true,
      WINDOW_SOURCE.localBounds.z,
      "The Window must expose a positive 3D depth interval."
    );

    check(
      "aperture-corridor-present",
      environment.objects.apertureCorridor.length > 0,
      true,
      environment.objects.apertureCorridor.length,
      "The stage must define an optical corridor from Window aperture to Diamond focal target."
    );

    check(
      "aperture-x-aligned",
      environment.objects.apertureCorridor.alignedInX,
      true,
      environment.objects.apertureCorridor.alignedInX,
      "The Window aperture and Diamond focal target must align horizontally in stage space."
    );

    check(
      "aperture-y-aligned",
      environment.objects.apertureCorridor.alignedInY,
      true,
      environment.objects.apertureCorridor.alignedInY,
      "The Window aperture and Diamond focal target must align vertically in stage space."
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
      "The stage must not expand the existing CSS corridor."
    );

    check(
      "new-wrapper-forbidden",
      environment.corridor.newWrapperRequired === false,
      false,
      environment.corridor.newWrapperRequired,
      "The stage must not require a new wrapper."
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

  function writeEnvironmentToDom() {
    const environment =
      state.environment;

    if (
      !environment ||
      !state.scene
    ) {
      return;
    }

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
      "shared-3d-256-lattice-environment";

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
    }

    if (state.windowMount) {
      state.windowMount.dataset.showroomObjectStageParticipant =
        "window-mount";

      state.windowMount.dataset.showroomObjectStageApertureCorridor =
        "available";

      state.windowMount.dataset.showroomObjectStageScale =
        String(environment.objects.window.scale);
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

        sourceBasis:
          CONTRACT.sourceBasis,

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
          "shared-3d-256-lattice-environment",

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

        diamondStagePresent:
          Boolean(state.diamondStage),

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
      "object-stage-environment-refreshed";

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
        "SHOWROOM_OBJECT_STAGE_CORRIDOR_NOT_FOUND"
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
        SELECTORS.windowReceipt
      );

    if (!state.diamondLayer) {
      throw new Error(
        "SHOWROOM_OBJECT_STAGE_DIAMOND_LAYER_NOT_FOUND"
      );
    }

    if (!state.diamondStage) {
      throw new Error(
        "SHOWROOM_OBJECT_STAGE_DIAMOND_STAGE_NOT_FOUND"
      );
    }

    if (!state.windowLayer) {
      throw new Error(
        "SHOWROOM_OBJECT_STAGE_WINDOW_LAYER_NOT_FOUND"
      );
    }

    if (!state.windowMount) {
      throw new Error(
        "SHOWROOM_OBJECT_STAGE_WINDOW_MOUNT_NOT_FOUND"
      );
    }

    state.scene.dataset.showroomObjectStage =
      "initializing";

    state.scene.dataset.showroomObjectStageContract =
      CONTRACT.id;

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
          const shouldRefresh =
            mutations.some(mutation =>
              mutation.type === "childList" ||
              (
                mutation.type === "attributes" &&
                [
                  "style",
                  "class",
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
            "style",
            "class",
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
  }

  function fail(reason) {
    state.failed =
      true;

    state.lastFailure =
      String(reason || "SHOWROOM_OBJECT_STAGE_FAILURE");

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
        "object-stage-failed",

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
      "object-stage-disposed";

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

  function publicWorldToCorridor(
    worldPoint
  ) {
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

      state.lastAction =
        "object-stage-shared-3d-environment-initialized";

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
