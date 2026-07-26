/* /laws/index.interactions.js
   Laws shared Compass-family interaction loader wrapper.

   Preserves the complete working loader in
   /laws/index.interactions.loader.source.js, preserves projected labels and
   the existing pointer/gesture authority, and adds one bounded capture layer:
   pointer taps originating inside the visible center Compass are intercepted
   before overlapping crystal hit-testing can claim them.
*/
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_LAWS_INTERACTIONS_CENTER_CAPTURE_SAFE_WRAPPER_v2",
    sourceUrl:
      "./index.interactions.loader.source.js?v=LAWS_INTERACTIONS_LOADER_SOURCE_v1",
    build:
      "LAWS_COMPASS_CENTER_EXCLUSIVE_SPHERICAL_XYZ_DIRECT_MANIPULATION_v6",
    horizontalDragYawSign:
      "POSITIVE",
    clusterGeometryModel:
      "BOUNDED_SPHERICAL_XYZ_CLUSTER",
    clusterFullXyzRotation:
      true,
    centerCompassCapture:
      true,
    centerCompassHitGeometry:
      "VISIBLE_CONTROL_ELLIPSE",
    centerCompassTapMaximumDistancePx:
      10,
    centerCompassTapMaximumDurationMs:
      650,
    ownsController:
      false,
    ownsCrystals:
      false,
    ownsNavigation:
      false
  });

  const SCRIPT_ATTRIBUTE =
    "data-laws-center-capture-safe-spherical-xyz-interactions-source";
  const CENTER_CAPTURE_ATTRIBUTE =
    "data-laws-center-compass-capture-safe";

  function fail(code, details = null) {
    const error = new Error(code);
    error.code = code;
    error.details = details;

    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsInteractionsWrapperStatus = "held";
      root.dataset.lawsInteractionsWrapperFailure = code;
    }

    globalThis.DGB_LAWS_INTERACTIONS_WRAPPER_FAILURE =
      Object.freeze({
        contractId: CONTRACT.id,
        code,
        details
      });

    globalThis.dispatchEvent(
      new CustomEvent(
        "DGB_LAWS_INTERACTIONS_WRAPPER_FAILURE",
        {
          detail:
            globalThis.DGB_LAWS_INTERACTIONS_WRAPPER_FAILURE
        }
      )
    );

    throw error;
  }

  function loadSourceSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);

    if (request.status < 200 || request.status >= 300) {
      fail(
        `LAWS_INTERACTIONS_SOURCE_LOAD_FAILED:${request.status}`,
        { url }
      );
    }

    return request.responseText;
  }

  function replaceRequired(source, before, after, identity) {
    const count = source.split(before).length - 1;

    if (count !== 1) {
      fail(
        `LAWS_INTERACTIONS_REQUIRED_SOURCE_PATTERN_INVALID:${identity}`,
        {
          expected: 1,
          actual: count
        }
      );
    }

    return source.replace(before, after);
  }

  function transformSource(input) {
    let source = input;

    source = replaceRequired(
      source,
      '"LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4"',
      '"LAWS_COMPASS_CENTER_EXCLUSIVE_SPHERICAL_XYZ_DIRECT_MANIPULATION_v6"',
      "BUILD_IDENTITY"
    );

    source = replaceRequired(
      source,
      'horizontalDragYawSign: "NEGATIVE",',
      'horizontalDragYawSign: "POSITIVE",',
      "POSITIVE_HORIZONTAL_DRAG_RECEIPT"
    );

    source = replaceRequired(
      source,
      "clusterMaximumTiltRadians: 0.30,",
      "clusterFullXyzRotation: true,",
      "FULL_XYZ_ROTATION_RECEIPT"
    );

    source = replaceRequired(
      source,
      "euclideanClusterOrbitRequired: true,",
      "boundedSphericalXyzClusterRequired: true,",
      "SPHERICAL_CLUSTER_RECEIPT"
    );

    const retiredTokens = [
      '"LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4"',
      'horizontalDragYawSign: "NEGATIVE"',
      "clusterMaximumTiltRadians: 0.30",
      "euclideanClusterOrbitRequired: true"
    ];

    for (const token of retiredTokens) {
      if (source.includes(token)) {
        fail(
          "LAWS_INTERACTIONS_RETIRED_TOKEN_REMAINS",
          { token }
        );
      }
    }

    const requiredTokens = [
      '"LAWS_COMPASS_CENTER_EXCLUSIVE_SPHERICAL_XYZ_DIRECT_MANIPULATION_v6"',
      'horizontalDragYawSign: "POSITIVE"',
      "clusterFullXyzRotation: true",
      "boundedSphericalXyzClusterRequired: true"
    ];

    for (const token of requiredTokens) {
      if (!source.includes(token)) {
        fail(
          "LAWS_INTERACTIONS_REQUIRED_TOKEN_MISSING",
          { token }
        );
      }
    }

    return source;
  }

  function installCenterCompassCapture() {
    const root =
      document.querySelector("[data-laws-root]");
    const field =
      root && root.querySelector("[data-laws-scene-field]");
    const control =
      root && root.querySelector("[data-upstream-compass-control]");

    if (!root || !field || !control) {
      return false;
    }

    if (field.hasAttribute(CENTER_CAPTURE_ATTRIBUTE)) {
      return true;
    }

    field.setAttribute(CENTER_CAPTURE_ATTRIBUTE, "true");

    let activePointer = null;
    let suppressClickUntil = 0;

    function controller() {
      const value =
        globalThis.DGB_LAWS_CONTROLLER;

      return (
        value &&
        typeof value.requestCompassSelection === "function"
      )
        ? value
        : null;
    }

    function insideVisibleCompass(clientX, clientY) {
      const rect =
        control.getBoundingClientRect();

      if (
        !rect ||
        rect.width <= 0 ||
        rect.height <= 0
      ) {
        return false;
      }

      const radiusX =
        rect.width * 0.5;
      const radiusY =
        rect.height * 0.5;
      const centerX =
        rect.left + radiusX;
      const centerY =
        rect.top + radiusY;
      const normalizedX =
        (clientX - centerX) / radiusX;
      const normalizedY =
        (clientY - centerY) / radiusY;

      return (
        normalizedX * normalizedX +
        normalizedY * normalizedY
      ) <= 1;
    }

    function stopPointerEvent(event) {
      if (event.cancelable) {
        event.preventDefault();
      }

      event.stopImmediatePropagation();
    }

    function clearPointer(event = null) {
      if (
        activePointer &&
        event &&
        activePointer.id !== event.pointerId
      ) {
        return;
      }

      if (
        activePointer &&
        typeof field.releasePointerCapture === "function"
      ) {
        try {
          field.releasePointerCapture(activePointer.id);
        } catch (_) {
          // The pointer may already have been released.
        }
      }

      activePointer = null;
    }

    field.addEventListener(
      "pointerdown",
      event => {
        if (
          activePointer ||
          (event.pointerType === "mouse" && event.button !== 0) ||
          !insideVisibleCompass(event.clientX, event.clientY)
        ) {
          return;
        }

        activePointer = {
          id: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          startTime: performance.now(),
          maximumDistance: 0
        };

        if (typeof field.setPointerCapture === "function") {
          try {
            field.setPointerCapture(event.pointerId);
          } catch (_) {
            // Capture support is optional; coordinate ownership remains valid.
          }
        }

        root.dataset.lawsCenterCompassPointerState =
          "captured";

        stopPointerEvent(event);
      },
      {
        capture: true,
        passive: false
      }
    );

    field.addEventListener(
      "pointermove",
      event => {
        if (
          !activePointer ||
          activePointer.id !== event.pointerId
        ) {
          return;
        }

        activePointer.maximumDistance =
          Math.max(
            activePointer.maximumDistance,
            Math.hypot(
              event.clientX - activePointer.startX,
              event.clientY - activePointer.startY
            )
          );

        stopPointerEvent(event);
      },
      {
        capture: true,
        passive: false
      }
    );

    field.addEventListener(
      "pointerup",
      event => {
        if (
          !activePointer ||
          activePointer.id !== event.pointerId
        ) {
          return;
        }

        activePointer.maximumDistance =
          Math.max(
            activePointer.maximumDistance,
            Math.hypot(
              event.clientX - activePointer.startX,
              event.clientY - activePointer.startY
            )
          );

        const duration =
          performance.now() -
          activePointer.startTime;
        const qualifiesAsTap =
          activePointer.maximumDistance <=
            CONTRACT.centerCompassTapMaximumDistancePx &&
          duration <=
            CONTRACT.centerCompassTapMaximumDurationMs;

        stopPointerEvent(event);

        if (qualifiesAsTap) {
          const activeController =
            controller();

          if (activeController) {
            activeController.requestCompassSelection();
            root.dataset.lawsCenterCompassPointerState =
              "selected";
          } else {
            root.dataset.lawsCenterCompassPointerState =
              "controller-unavailable";
          }
        } else {
          root.dataset.lawsCenterCompassPointerState =
            "cancelled";
        }

        suppressClickUntil =
          performance.now() + 520;
        clearPointer(event);
      },
      {
        capture: true,
        passive: false
      }
    );

    field.addEventListener(
      "pointercancel",
      event => {
        if (
          activePointer &&
          activePointer.id === event.pointerId
        ) {
          stopPointerEvent(event);
          root.dataset.lawsCenterCompassPointerState =
            "cancelled";
          clearPointer(event);
        }
      },
      {
        capture: true,
        passive: false
      }
    );

    field.addEventListener(
      "lostpointercapture",
      event => {
        if (
          activePointer &&
          activePointer.id === event.pointerId
        ) {
          activePointer = null;
        }
      },
      {
        capture: true,
        passive: true
      }
    );

    field.addEventListener(
      "click",
      event => {
        if (
          performance.now() < suppressClickUntil
        ) {
          stopPointerEvent(event);
        }
      },
      {
        capture: true,
        passive: false
      }
    );

    root.dataset.lawsCenterCompassCapture =
      "active";
    root.dataset.lawsCenterCompassHitGeometry =
      CONTRACT.centerCompassHitGeometry;

    return true;
  }

  function install() {
    if (
      document.querySelector(
        `script[${SCRIPT_ATTRIBUTE}]`
      )
    ) {
      return;
    }

    const source =
      transformSource(
        loadSourceSynchronously(
          CONTRACT.sourceUrl
        )
      );

    const script = document.createElement("script");
    script.setAttribute(
      SCRIPT_ATTRIBUTE,
      "true"
    );
    script.dataset.ready = "false";
    script.textContent =
      source +
      "\n//# sourceURL=/laws/index.interactions.center-capture-safe-spherical-xyz.js";
    document.head.append(script);
    script.dataset.ready = "true";

    const centerCaptureInstalled =
      installCenterCompassCapture();

    if (!centerCaptureInstalled) {
      [80, 240, 600].forEach(delay =>
        setTimeout(
          installCenterCompassCapture,
          delay
        )
      );
    }

    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsInteractionsWrapperStatus =
        "available";
      root.dataset.lawsInteractionsWrapperContract =
        CONTRACT.id;
      root.dataset.lawsHorizontalDragYawSign =
        CONTRACT.horizontalDragYawSign;
      root.dataset.lawsClusterGeometryModel =
        CONTRACT.clusterGeometryModel;
      root.dataset.lawsClusterFullXyzRotation =
        "true";
      root.dataset.lawsProjectedCategoryLabelsPreserved =
        "true";
    }

    globalThis.DGB_LAWS_INTERACTIONS_WRAPPER_RECEIPT =
      Object.freeze({
        contractId:
          CONTRACT.id,
        sourceUrl:
          CONTRACT.sourceUrl,
        build:
          CONTRACT.build,
        horizontalDragYawSign:
          CONTRACT.horizontalDragYawSign,
        clusterGeometryModel:
          CONTRACT.clusterGeometryModel,
        clusterFullXyzRotation:
          CONTRACT.clusterFullXyzRotation,
        centerCompassCapture:
          CONTRACT.centerCompassCapture,
        centerCompassHitGeometry:
          CONTRACT.centerCompassHitGeometry,
        centerCompassTapMaximumDistancePx:
          CONTRACT.centerCompassTapMaximumDistancePx,
        centerCompassTapMaximumDurationMs:
          CONTRACT.centerCompassTapMaximumDurationMs,
        centerCaptureInstalled,
        completeLoaderPreserved:
          true,
        projectedCategoryLabelsPreserved:
          true,
        sourceTransformed:
          true,
        sourceExecuted:
          Boolean(
            globalThis.DGB_LAWS_INTERACTION_STANDARD_RECEIPT
          ),
        visualPassClaimed:
          false
      });

    globalThis.dispatchEvent(
      new CustomEvent(
        "DGB_LAWS_INTERACTIONS_WRAPPER_READY",
        {
          detail:
            globalThis
              .DGB_LAWS_INTERACTIONS_WRAPPER_RECEIPT
        }
      )
    );
  }

  install();
})();
