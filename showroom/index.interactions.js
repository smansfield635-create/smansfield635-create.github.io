/* TARGET FILE: /showroom/index.interactions.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_CONSTELLATION_POINTER_GESTURE_INTERPRETER_TNT_v2 */
/*
  Exclusive motion authority:
  - Own pointer deltas.
  - Own direct-manipulation direction.
  - Own drag sensitivity.
  - Own grabbed-object tracking.
  - Own orbit and cluster axis selection.
  - Own gesture quaternion construction.
  - Own swipe classification.
  - Own outward cluster-exit intent.
  - Own tap-versus-drag arbitration.
  - Own Compass tap validation.
  - Own semantic-star hit testing.
  - Own synthetic-click suppression.
  - Own semantic activation dispatch.
  - Own reduced-motion-aware motion feel.

  Does not own:
  - page-level state;
  - route interpretation;
  - cluster expansion or collapse;
  - active-front selection;
  - dialog opening or closing;
  - navigation;
  - gauge selection;
  - Compass rendering;
  - orbit camera or projection;
  - crystal geometry or drawing;
  - Diamond motion, zoom, camera, renderer, or lifecycle;
  - Mirrorland Window rendering or lifecycle.

  Event boundary:
  - Valid Compass tap:
      dispatch "showroom:compass-activate".
  - Valid semantic-star tap:
      dispatch "showroom:semantic-activate".
  - Orbit or cluster motion:
      dispatch "showroom:orbit-motion".
  - Outward cluster-exit intent:
      dispatch "showroom:cluster-exit-intent".

  The controller interprets semantic meaning.
  The compositor and crystals consume motion without inheriting gesture policy.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_CONSTELLATION_POINTER_GESTURE_INTERPRETER_TNT_v2";

  const EVENTS = Object.freeze({
    ready:
      "showroom:interactions-ready",

    receipt:
      "showroom:interactions-receipt",

    semanticActivate:
      "showroom:semantic-activate",

    compassActivate:
      "showroom:compass-activate",

    orbitMotion:
      "showroom:orbit-motion",

    orbitMotionStart:
      "showroom:orbit-motion-start",

    orbitMotionEnd:
      "showroom:orbit-motion-end",

    clusterExitIntent:
      "showroom:cluster-exit-intent",

    interactionState:
      "showroom:interaction-state"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    receipt:
      "[data-showroom-interactions-receipt]",

    orbit:
      "#showroom-orbit",

    orbitField:
      "[data-showroom-orbit-field]",

    semanticObject:
      "[data-showroom-object]",

    compassControl:
      "[data-showroom-compass-control]",

    cluster:
      "[data-showroom-cluster]",

    diamondStage:
      "[data-showroom-diamond-stage]",

    windowControl:
      "[data-showroom-window-control]",

    dialog:
      "dialog"
  });

  const ATTRIBUTES = Object.freeze({
    ready:
      "data-showroom-interactions-ready",

    state:
      "data-showroom-interactions-state",

    held:
      "data-showroom-held",

    reducedMotion:
      "data-showroom-reduced-motion",

    activeCluster:
      "data-showroom-active-cluster",

    objectId:
      "data-showroom-object-id",

    objectBehavior:
      "data-showroom-object-behavior",

    objectSize:
      "data-showroom-object-size",

    clusterId:
      "data-showroom-cluster-id",

    clusterState:
      "data-showroom-cluster-state",

    interactionTarget:
      "data-showroom-interaction-target",

    pointerState:
      "data-showroom-pointer-state",

    grabbedObject:
      "data-showroom-grabbed-object",

    gestureMode:
      "data-showroom-gesture-mode",

    swipeClass:
      "data-showroom-swipe-class"
  });

  const CONFIG = Object.freeze({
    tapDistanceMouse:
      7,

    tapDistanceTouch:
      12,

    tapDistancePen:
      9,

    tapDurationMouse:
      520,

    tapDurationTouch:
      680,

    tapDurationPen:
      580,

    dragStartDistanceMouse:
      6,

    dragStartDistanceTouch:
      10,

    dragStartDistancePen:
      8,

    orbitSensitivityMouse:
      0.0062,

    orbitSensitivityTouch:
      0.0052,

    orbitSensitivityPen:
      0.0058,

    clusterSensitivityMultiplier:
      0.82,

    grabbedObjectSensitivityMultiplier:
      0.72,

    reducedMotionSensitivityMultiplier:
      0.66,

    velocitySmoothing:
      0.72,

    minimumMotionDelta:
      0.08,

    swipeVelocityThreshold:
      0.34,

    swipeDistanceThreshold:
      34,

    outwardExitDistance:
      52,

    outwardExitVelocity:
      0.42,

    outwardDirectionTolerance:
      0.42,

    clickSuppressionWindow:
      780,

    clickSuppressionDistance:
      18,

    pointerCaptureReleaseDelay:
      0,

    frameCoalescing:
      true
  });

  const state = {
    root: null,
    receipt: null,
    orbit: null,
    orbitField: null,
    compassControl: null,

    initialized: false,
    disposed: false,
    reducedMotion: false,
    held: false,

    activePointers: new Map(),
    primaryGesture: null,

    pendingMotionFrame: 0,
    pendingMotion: null,

    suppressedClicks: [],

    listeners: [],
    observers: [],

    counters: {
      pointerDown: 0,
      pointerMove: 0,
      pointerUp: 0,
      pointerCancel: 0,
      validTap: 0,
      drag: 0,
      semanticActivation: 0,
      compassActivation: 0,
      motionDispatch: 0,
      clusterExitIntent: 0,
      suppressedClick: 0
    }
  };

  function toArray(value) {
    return Array.from(value || []);
  }

  function normalize(value) {
    return String(value || "").trim();
  }

  function clamp(value, minimum, maximum) {
    return Math.min(
      maximum,
      Math.max(minimum, value)
    );
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function distance2d(
    x1,
    y1,
    x2,
    y2
  ) {
    return Math.hypot(
      x2 - x1,
      y2 - y1
    );
  }

  function addListener(
    target,
    type,
    handler,
    options
  ) {
    if (!target) {
      return;
    }

    target.addEventListener(
      type,
      handler,
      options
    );

    state.listeners.push(() => {
      target.removeEventListener(
        type,
        handler,
        options
      );
    });
  }

  function addObserver(observer) {
    state.observers.push(observer);
  }

  function setRootAttribute(
    name,
    value
  ) {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      name,
      String(value)
    );
  }

  function createReceipt(
    event,
    extra = {}
  ) {
    return Object.freeze({
      contract: CONTRACT,
      event,
      timestamp: nowIso(),

      ready:
        state.initialized &&
        !state.disposed,

      disposed:
        state.disposed,

      reducedMotion:
        state.reducedMotion,

      held:
        state.held,

      activePointers:
        state.activePointers.size,

      gestureActive:
        Boolean(state.primaryGesture),

      counters: Object.freeze({
        ...state.counters
      }),

      ...extra
    });
  }

  function publishReceipt(
    event,
    extra = {}
  ) {
    const payload =
      createReceipt(
        event,
        extra
      );

    if (state.receipt) {
      const serialized =
        JSON.stringify(payload);

      state.receipt.value =
        serialized;

      state.receipt.textContent =
        serialized;
    }

    window.dispatchEvent(
      new CustomEvent(
        EVENTS.receipt,
        {
          detail: payload
        }
      )
    );

    return payload;
  }

  function dispatch(
    eventName,
    detail = {}
  ) {
    const payload =
      Object.freeze({
        contract: CONTRACT,
        timestamp: nowIso(),
        ...detail
      });

    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail: payload
        }
      )
    );

    return payload;
  }

  function getPointerPolicy(
    pointerType
  ) {
    switch (pointerType) {
      case "touch":
        return Object.freeze({
          tapDistance:
            CONFIG.tapDistanceTouch,

          tapDuration:
            CONFIG.tapDurationTouch,

          dragStartDistance:
            CONFIG.dragStartDistanceTouch,

          sensitivity:
            CONFIG.orbitSensitivityTouch
        });

      case "pen":
        return Object.freeze({
          tapDistance:
            CONFIG.tapDistancePen,

          tapDuration:
            CONFIG.tapDurationPen,

          dragStartDistance:
            CONFIG.dragStartDistancePen,

          sensitivity:
            CONFIG.orbitSensitivityPen
        });

      default:
        return Object.freeze({
          tapDistance:
            CONFIG.tapDistanceMouse,

          tapDuration:
            CONFIG.tapDurationMouse,

          dragStartDistance:
            CONFIG.dragStartDistanceMouse,

          sensitivity:
            CONFIG.orbitSensitivityMouse
        });
    }
  }

  function isPrimaryPointerEvent(event) {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return false;
    }

    return event.isPrimary !== false;
  }

  function isDialogBlockingInteraction() {
    return Boolean(
      document.querySelector(
        `${SELECTORS.dialog}[open]`
      )
    );
  }

  function isInsideProtectedStage(target) {
    if (!(target instanceof Element)) {
      return false;
    }

    return Boolean(
      target.closest(
        SELECTORS.diamondStage
      ) ||
      target.closest(
        SELECTORS.windowControl
      )
    );
  }

  function isOrbitTarget(target) {
    if (!(target instanceof Element)) {
      return false;
    }

    return Boolean(
      target.closest(
        SELECTORS.orbitField
      )
    );
  }

  function resolveSemanticTarget(target) {
    if (!(target instanceof Element)) {
      return null;
    }

    const compass =
      target.closest(
        SELECTORS.compassControl
      );

    if (compass) {
      return Object.freeze({
        kind:
          "compass",

        element:
          compass,

        objectId:
          "main-compass",

        behavior:
          "compass-return",

        clusterId:
          "",

        size:
          "fixed"
      });
    }

    const object =
      target.closest(
        SELECTORS.semanticObject
      );

    if (!object) {
      return null;
    }

    return Object.freeze({
      kind:
        "object",

      element:
        object,

      objectId:
        normalize(
          object.getAttribute(
            ATTRIBUTES.objectId
          )
        ),

      behavior:
        normalize(
          object.getAttribute(
            ATTRIBUTES.objectBehavior
          )
        ),

      clusterId:
        normalize(
          object.getAttribute(
            ATTRIBUTES.clusterId
          )
        ),

      size:
        normalize(
          object.getAttribute(
            ATTRIBUTES.objectSize
          )
        )
    });
  }

  function resolveActiveCluster() {
    if (!state.root) {
      return null;
    }

    const activeClusterId =
      normalize(
        state.root.getAttribute(
          ATTRIBUTES.activeCluster
        )
      );

    if (!activeClusterId) {
      return null;
    }

    const cluster =
      document.querySelector(
        `${SELECTORS.cluster}[data-showroom-cluster-id="${CSS.escape(
          activeClusterId
        )}"]`
      );

    if (
      !cluster ||
      cluster.hidden ||
      cluster.getAttribute(
        ATTRIBUTES.clusterState
      ) !== "expanded"
    ) {
      return null;
    }

    return Object.freeze({
      id:
        activeClusterId,

      element:
        cluster
    });
  }

  function classifyGestureMode(
    semanticTarget,
    activeCluster
  ) {
    if (
      semanticTarget &&
      semanticTarget.kind === "compass"
    ) {
      return "compass";
    }

    if (
      semanticTarget &&
      semanticTarget.kind === "object"
    ) {
      if (
        semanticTarget.behavior ===
        "cluster"
      ) {
        return "cluster-parent";
      }

      if (
        semanticTarget.size ===
        "small"
      ) {
        return "cluster-child";
      }

      return "grabbed-object";
    }

    if (activeCluster) {
      return "cluster";
    }

    return "orbit";
  }

  function selectGestureAxis(
    deltaX,
    deltaY,
    mode
  ) {
    const absoluteX =
      Math.abs(deltaX);

    const absoluteY =
      Math.abs(deltaY);

    if (
      mode === "cluster" ||
      mode === "cluster-child" ||
      mode === "cluster-parent"
    ) {
      if (
        absoluteX >
        absoluteY * 1.25
      ) {
        return "cluster-yaw";
      }

      if (
        absoluteY >
        absoluteX * 1.25
      ) {
        return "cluster-pitch";
      }

      return "cluster-free";
    }

    if (
      absoluteX >
      absoluteY * 1.3
    ) {
      return "orbit-yaw";
    }

    if (
      absoluteY >
      absoluteX * 1.3
    ) {
      return "orbit-pitch";
    }

    return "orbit-free";
  }

  function normalizeVector3(
    x,
    y,
    z
  ) {
    const length =
      Math.hypot(x, y, z);

    if (length <= 1e-8) {
      return Object.freeze({
        x: 0,
        y: 1,
        z: 0
      });
    }

    return Object.freeze({
      x:
        x / length,

      y:
        y / length,

      z:
        z / length
    });
  }

  function axisForGesture(
    axisClass,
    deltaX,
    deltaY
  ) {
    switch (axisClass) {
      case "orbit-yaw":
      case "cluster-yaw":
        return normalizeVector3(
          0,
          deltaX >= 0 ? 1 : -1,
          0
        );

      case "orbit-pitch":
      case "cluster-pitch":
        return normalizeVector3(
          deltaY >= 0 ? 1 : -1,
          0,
          0
        );

      default:
        return normalizeVector3(
          deltaY,
          deltaX,
          0
        );
    }
  }

  function quaternionFromAxisAngle(
    axis,
    angle
  ) {
    const half =
      angle * 0.5;

    const sine =
      Math.sin(half);

    return Object.freeze({
      x:
        axis.x * sine,

      y:
        axis.y * sine,

      z:
        axis.z * sine,

      w:
        Math.cos(half)
    });
  }

  function classifySwipe(
    totalDeltaX,
    totalDeltaY,
    duration,
    velocityX,
    velocityY
  ) {
    const distance =
      Math.hypot(
        totalDeltaX,
        totalDeltaY
      );

    const velocity =
      Math.hypot(
        velocityX,
        velocityY
      );

    if (
      distance <
        CONFIG.swipeDistanceThreshold ||
      velocity <
        CONFIG.swipeVelocityThreshold
    ) {
      return Object.freeze({
        type:
          "none",

        direction:
          "none",

        distance,
        velocity,
        duration
      });
    }

    const horizontal =
      Math.abs(totalDeltaX) >=
      Math.abs(totalDeltaY);

    let direction;

    if (horizontal) {
      direction =
        totalDeltaX >= 0
          ? "right"
          : "left";
    } else {
      direction =
        totalDeltaY >= 0
          ? "down"
          : "up";
    }

    return Object.freeze({
      type:
        horizontal
          ? "horizontal"
          : "vertical",

      direction,
      distance,
      velocity,
      duration
    });
  }

  function getElementCenter(element) {
    if (!element) {
      return null;
    }

    const rect =
      element.getBoundingClientRect();

    return Object.freeze({
      x:
        rect.left +
        rect.width * 0.5,

      y:
        rect.top +
        rect.height * 0.5
    });
  }

  function calculateOutwardIntent(
    gesture,
    swipe
  ) {
    if (
      !gesture.activeCluster ||
      !swipe ||
      swipe.type === "none"
    ) {
      return null;
    }

    const clusterCenter =
      getElementCenter(
        gesture.activeCluster.element
      );

    if (!clusterCenter) {
      return null;
    }

    const startVector = {
      x:
        gesture.startX -
        clusterCenter.x,

      y:
        gesture.startY -
        clusterCenter.y
    };

    const movementVector = {
      x:
        gesture.lastX -
        gesture.startX,

      y:
        gesture.lastY -
        gesture.startY
    };

    const startLength =
      Math.hypot(
        startVector.x,
        startVector.y
      );

    const movementLength =
      Math.hypot(
        movementVector.x,
        movementVector.y
      );

    if (
      startLength <= 1 ||
      movementLength <
        CONFIG.outwardExitDistance
    ) {
      return null;
    }

    const outwardUnit = {
      x:
        startVector.x /
        startLength,

      y:
        startVector.y /
        startLength
    };

    const movementUnit = {
      x:
        movementVector.x /
        movementLength,

      y:
        movementVector.y /
        movementLength
    };

    const alignment =
      outwardUnit.x *
        movementUnit.x +
      outwardUnit.y *
        movementUnit.y;

    const velocity =
      Math.hypot(
        gesture.velocityX,
        gesture.velocityY
      );

    if (
      alignment <
        CONFIG.outwardDirectionTolerance ||
      velocity <
        CONFIG.outwardExitVelocity
    ) {
      return null;
    }

    return Object.freeze({
      clusterId:
        gesture.activeCluster.id,

      alignment,
      velocity,
      distance:
        movementLength,

      direction:
        swipe.direction
    });
  }

  function createPointerRecord(event) {
    return {
      pointerId:
        event.pointerId,

      pointerType:
        event.pointerType || "mouse",

      startX:
        event.clientX,

      startY:
        event.clientY,

      lastX:
        event.clientX,

      lastY:
        event.clientY,

      previousX:
        event.clientX,

      previousY:
        event.clientY,

      startTime:
        performance.now(),

      lastTime:
        performance.now(),

      previousTime:
        performance.now(),

      pressure:
        Number.isFinite(event.pressure)
          ? event.pressure
          : 0,

      buttons:
        event.buttons,

      target:
        event.target
    };
  }

  function createGesture(event) {
    const semanticTarget =
      resolveSemanticTarget(
        event.target
      );

    const activeCluster =
      resolveActiveCluster();

    const mode =
      classifyGestureMode(
        semanticTarget,
        activeCluster
      );

    const policy =
      getPointerPolicy(
        event.pointerType
      );

    return {
      pointerId:
        event.pointerId,

      pointerType:
        event.pointerType || "mouse",

      semanticTarget,
      grabbedObject:
        semanticTarget &&
        semanticTarget.kind === "object"
          ? semanticTarget
          : null,

      activeCluster,
      mode,
      policy,

      startX:
        event.clientX,

      startY:
        event.clientY,

      lastX:
        event.clientX,

      lastY:
        event.clientY,

      previousX:
        event.clientX,

      previousY:
        event.clientY,

      startTime:
        performance.now(),

      previousTime:
        performance.now(),

      lastTime:
        performance.now(),

      totalDistance:
        0,

      maximumDistance:
        0,

      velocityX:
        0,

      velocityY:
        0,

      dragging:
        false,

      cancelled:
        false,

      motionDispatched:
        false,

      axisClass:
        mode.includes("cluster")
          ? "cluster-free"
          : "orbit-free"
    };
  }

  function setInteractionState(
    pointerState,
    gesture = null
  ) {
    setRootAttribute(
      ATTRIBUTES.pointerState,
      pointerState
    );

    setRootAttribute(
      ATTRIBUTES.gestureMode,
      gesture
        ? gesture.mode
        : ""
    );

    setRootAttribute(
      ATTRIBUTES.grabbedObject,
      gesture &&
      gesture.grabbedObject
        ? gesture.grabbedObject.objectId
        : ""
    );

    dispatch(
      EVENTS.interactionState,
      {
        pointerState,

        gestureMode:
          gesture
            ? gesture.mode
            : null,

        grabbedObjectId:
          gesture &&
          gesture.grabbedObject
            ? gesture.grabbedObject.objectId
            : null,

        activeClusterId:
          gesture &&
          gesture.activeCluster
            ? gesture.activeCluster.id
            : null
      }
    );
  }

  function calculateSensitivity(gesture) {
    let sensitivity =
      gesture.policy.sensitivity;

    if (
      gesture.mode === "cluster" ||
      gesture.mode === "cluster-child" ||
      gesture.mode === "cluster-parent"
    ) {
      sensitivity *=
        CONFIG.clusterSensitivityMultiplier;
    }

    if (
      gesture.grabbedObject
    ) {
      sensitivity *=
        CONFIG.grabbedObjectSensitivityMultiplier;
    }

    if (state.reducedMotion) {
      sensitivity *=
        CONFIG.reducedMotionSensitivityMultiplier;
    }

    return sensitivity;
  }

  function createMotionPayload(
    gesture,
    deltaX,
    deltaY,
    timestamp
  ) {
    const axisClass =
      selectGestureAxis(
        deltaX,
        deltaY,
        gesture.mode
      );

    gesture.axisClass =
      axisClass;

    const axis =
      axisForGesture(
        axisClass,
        deltaX,
        deltaY
      );

    const sensitivity =
      calculateSensitivity(
        gesture
      );

    const signedMagnitude =
      Math.hypot(
        deltaX,
        deltaY
      ) * sensitivity;

    const dominantDirection =
      Math.abs(deltaX) >=
      Math.abs(deltaY)
        ? Math.sign(deltaX || 1)
        : Math.sign(deltaY || 1);

    const angle =
      clamp(
        signedMagnitude *
          dominantDirection,
        -0.24,
        0.24
      );

    const quaternion =
      quaternionFromAxisAngle(
        axis,
        angle
      );

    return Object.freeze({
      pointerId:
        gesture.pointerId,

      pointerType:
        gesture.pointerType,

      mode:
        gesture.mode,

      axisClass,

      axis,

      quaternion,

      angle,

      deltaX,

      deltaY,

      totalDeltaX:
        gesture.lastX -
        gesture.startX,

      totalDeltaY:
        gesture.lastY -
        gesture.startY,

      velocityX:
        gesture.velocityX,

      velocityY:
        gesture.velocityY,

      grabbedObjectId:
        gesture.grabbedObject
          ? gesture.grabbedObject.objectId
          : null,

      grabbedObjectBehavior:
        gesture.grabbedObject
          ? gesture.grabbedObject.behavior
          : null,

      activeClusterId:
        gesture.activeCluster
          ? gesture.activeCluster.id
          : null,

      reducedMotion:
        state.reducedMotion,

      timestamp
    });
  }

  function flushPendingMotion() {
    state.pendingMotionFrame = 0;

    const payload =
      state.pendingMotion;

    state.pendingMotion = null;

    if (
      !payload ||
      state.disposed
    ) {
      return;
    }

    state.counters.motionDispatch += 1;

    dispatch(
      EVENTS.orbitMotion,
      payload
    );
  }

  function queueMotion(payload) {
    if (!CONFIG.frameCoalescing) {
      state.counters.motionDispatch += 1;

      dispatch(
        EVENTS.orbitMotion,
        payload
      );

      return;
    }

    state.pendingMotion =
      payload;

    if (state.pendingMotionFrame) {
      return;
    }

    state.pendingMotionFrame =
      window.requestAnimationFrame(
        flushPendingMotion
      );
  }

  function suppressNextClick(
    element,
    pointerX,
    pointerY,
    reason
  ) {
    if (!element) {
      return;
    }

    state.suppressedClicks.push({
      element,
      expires:
        performance.now() +
        CONFIG.clickSuppressionWindow,

      x:
        pointerX,

      y:
        pointerY,

      reason
    });
  }

  function pruneSuppressedClicks() {
    const timestamp =
      performance.now();

    state.suppressedClicks =
      state.suppressedClicks.filter(
        (entry) =>
          entry.expires >= timestamp
      );
  }

  function shouldSuppressClick(event) {
    pruneSuppressedClicks();

    if (
      event.detail === 0
    ) {
      return false;
    }

    const target =
      event.target instanceof Element
        ? event.target
        : null;

    if (!target) {
      return false;
    }

    const index =
      state.suppressedClicks.findIndex(
        (entry) => {
          if (
            !(
              entry.element === target ||
              entry.element.contains(target) ||
              target.contains(entry.element)
            )
          ) {
            return false;
          }

          const distance =
            distance2d(
              entry.x,
              entry.y,
              event.clientX,
              event.clientY
            );

          return (
            distance <=
            CONFIG.clickSuppressionDistance
          );
        }
      );

    if (index < 0) {
      return false;
    }

    state.suppressedClicks.splice(
      index,
      1
    );

    return true;
  }

  function handleClickCapture(event) {
    if (!shouldSuppressClick(event)) {
      return;
    }

    state.counters.suppressedClick += 1;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    publishReceipt(
      "synthetic-click-suppressed"
    );
  }

  function dispatchSemanticActivation(
    gesture,
    event
  ) {
    const semanticTarget =
      gesture.semanticTarget;

    if (!semanticTarget) {
      return false;
    }

    suppressNextClick(
      semanticTarget.element,
      event.clientX,
      event.clientY,
      "pointer-semantic-activation"
    );

    if (
      semanticTarget.kind ===
      "compass"
    ) {
      state.counters.compassActivation += 1;
      state.counters.validTap += 1;

      dispatch(
        EVENTS.compassActivate,
        {
          target:
            "compass",

          kind:
            "compass",

          element:
            semanticTarget.element,

          objectId:
            semanticTarget.objectId,

          validTap:
            true,

          cancelled:
            false,

          wasDrag:
            false,

          pointerType:
            gesture.pointerType,

          duration:
            performance.now() -
            gesture.startTime,

          startX:
            gesture.startX,

          startY:
            gesture.startY,

          endX:
            event.clientX,

          endY:
            event.clientY
        }
      );

      publishReceipt(
        "compass-tap-dispatched"
      );

      return true;
    }

    state.counters.semanticActivation += 1;
    state.counters.validTap += 1;

    dispatch(
      EVENTS.semanticActivate,
      {
        target:
          "object",

        kind:
          "object",

        element:
          semanticTarget.element,

        objectId:
          semanticTarget.objectId,

        behavior:
          semanticTarget.behavior,

        clusterId:
          semanticTarget.clusterId ||
          null,

        validTap:
          true,

        cancelled:
          false,

        wasDrag:
          false,

        pointerType:
          gesture.pointerType,

        duration:
          performance.now() -
          gesture.startTime,

        startX:
          gesture.startX,

        startY:
          gesture.startY,

        endX:
          event.clientX,

        endY:
          event.clientY
      }
    );

    publishReceipt(
      "semantic-tap-dispatched",
      {
        objectId:
          semanticTarget.objectId,

        behavior:
          semanticTarget.behavior
      }
    );

    return true;
  }

  function isValidTap(
    gesture,
    event
  ) {
    const duration =
      performance.now() -
      gesture.startTime;

    const distance =
      distance2d(
        gesture.startX,
        gesture.startY,
        event.clientX,
        event.clientY
      );

    if (gesture.cancelled) {
      return false;
    }

    if (gesture.dragging) {
      return false;
    }

    if (
      duration >
      gesture.policy.tapDuration
    ) {
      return false;
    }

    if (
      distance >
      gesture.policy.tapDistance
    ) {
      return false;
    }

    if (!gesture.semanticTarget) {
      return false;
    }

    const releaseTarget =
      resolveSemanticTarget(
        document.elementFromPoint(
          event.clientX,
          event.clientY
        )
      );

    if (!releaseTarget) {
      return false;
    }

    return (
      releaseTarget.element ===
      gesture.semanticTarget.element
    );
  }

  function beginDrag(
    gesture,
    event
  ) {
    if (gesture.dragging) {
      return;
    }

    gesture.dragging = true;

    state.counters.drag += 1;

    setInteractionState(
      "dragging",
      gesture
    );

    dispatch(
      EVENTS.orbitMotionStart,
      {
        pointerId:
          gesture.pointerId,

        pointerType:
          gesture.pointerType,

        mode:
          gesture.mode,

        grabbedObjectId:
          gesture.grabbedObject
            ? gesture.grabbedObject.objectId
            : null,

        activeClusterId:
          gesture.activeCluster
            ? gesture.activeCluster.id
            : null,

        startX:
          gesture.startX,

        startY:
          gesture.startY,

        currentX:
          event.clientX,

        currentY:
          event.clientY
      }
    );
  }

  function updateGestureVelocity(
    gesture,
    event,
    timestamp
  ) {
    const elapsed =
      Math.max(
        1,
        timestamp -
        gesture.previousTime
      );

    const instantaneousX =
      (
        event.clientX -
        gesture.previousX
      ) / elapsed;

    const instantaneousY =
      (
        event.clientY -
        gesture.previousY
      ) / elapsed;

    gesture.velocityX =
      gesture.velocityX *
        CONFIG.velocitySmoothing +
      instantaneousX *
        (
          1 -
          CONFIG.velocitySmoothing
        );

    gesture.velocityY =
      gesture.velocityY *
        CONFIG.velocitySmoothing +
      instantaneousY *
        (
          1 -
          CONFIG.velocitySmoothing
        );
  }

  function updatePrimaryGesture(event) {
    const gesture =
      state.primaryGesture;

    if (
      !gesture ||
      gesture.pointerId !==
        event.pointerId
    ) {
      return;
    }

    const timestamp =
      performance.now();

    const deltaX =
      event.clientX -
      gesture.lastX;

    const deltaY =
      event.clientY -
      gesture.lastY;

    gesture.previousX =
      gesture.lastX;

    gesture.previousY =
      gesture.lastY;

    gesture.previousTime =
      gesture.lastTime;

    gesture.lastX =
      event.clientX;

    gesture.lastY =
      event.clientY;

    gesture.lastTime =
      timestamp;

    const segmentDistance =
      Math.hypot(
        deltaX,
        deltaY
      );

    gesture.totalDistance +=
      segmentDistance;

    gesture.maximumDistance =
      Math.max(
        gesture.maximumDistance,
        distance2d(
          gesture.startX,
          gesture.startY,
          gesture.lastX,
          gesture.lastY
        )
      );

    updateGestureVelocity(
      gesture,
      event,
      timestamp
    );

    if (
      !gesture.dragging &&
      gesture.maximumDistance >=
        gesture.policy.dragStartDistance
    ) {
      beginDrag(
        gesture,
        event
      );
    }

    if (!gesture.dragging) {
      return;
    }

    if (
      Math.abs(deltaX) <
        CONFIG.minimumMotionDelta &&
      Math.abs(deltaY) <
        CONFIG.minimumMotionDelta
    ) {
      return;
    }

    event.preventDefault();

    const payload =
      createMotionPayload(
        gesture,
        deltaX,
        deltaY,
        timestamp
      );

    gesture.motionDispatched =
      true;

    queueMotion(payload);
  }

  function finishPrimaryGesture(
    event,
    cancelled = false
  ) {
    const gesture =
      state.primaryGesture;

    if (
      !gesture ||
      gesture.pointerId !==
        event.pointerId
    ) {
      return;
    }

    gesture.cancelled =
      Boolean(cancelled);

    gesture.lastX =
      event.clientX;

    gesture.lastY =
      event.clientY;

    gesture.lastTime =
      performance.now();

    const duration =
      gesture.lastTime -
      gesture.startTime;

    if (
      isValidTap(
        gesture,
        event
      )
    ) {
      event.preventDefault();

      dispatchSemanticActivation(
        gesture,
        event
      );
    } else if (
      gesture.dragging
    ) {
      const semanticElement =
        gesture.semanticTarget
          ? gesture.semanticTarget.element
          : null;

      if (semanticElement) {
        suppressNextClick(
          semanticElement,
          event.clientX,
          event.clientY,
          "drag-completion"
        );
      }

      const totalDeltaX =
        gesture.lastX -
        gesture.startX;

      const totalDeltaY =
        gesture.lastY -
        gesture.startY;

      const swipe =
        classifySwipe(
          totalDeltaX,
          totalDeltaY,
          duration,
          gesture.velocityX,
          gesture.velocityY
        );

      setRootAttribute(
        ATTRIBUTES.swipeClass,
        swipe.direction
      );

      const outwardIntent =
        calculateOutwardIntent(
          gesture,
          swipe
        );

      if (outwardIntent) {
        state.counters.clusterExitIntent += 1;

        dispatch(
          EVENTS.clusterExitIntent,
          {
            ...outwardIntent,

            pointerType:
              gesture.pointerType,

            grabbedObjectId:
              gesture.grabbedObject
                ? gesture.grabbedObject.objectId
                : null
          }
        );
      }

      dispatch(
        EVENTS.orbitMotionEnd,
        {
          pointerId:
            gesture.pointerId,

          pointerType:
            gesture.pointerType,

          mode:
            gesture.mode,

          axisClass:
            gesture.axisClass,

          totalDeltaX,

          totalDeltaY,

          distance:
            Math.hypot(
              totalDeltaX,
              totalDeltaY
            ),

          duration,

          velocityX:
            gesture.velocityX,

          velocityY:
            gesture.velocityY,

          swipe,

          outwardClusterExitIntent:
            outwardIntent,

          grabbedObjectId:
            gesture.grabbedObject
              ? gesture.grabbedObject.objectId
              : null,

          activeClusterId:
            gesture.activeCluster
              ? gesture.activeCluster.id
              : null,

          cancelled:
            gesture.cancelled
        }
      );
    }

    releasePointerCapture(
      event.pointerId
    );

    state.activePointers.delete(
      event.pointerId
    );

    state.primaryGesture = null;

    setInteractionState(
      "idle"
    );

    publishReceipt(
      cancelled
        ? "gesture-cancelled"
        : "gesture-completed",
      {
        duration,

        dragged:
          gesture.dragging,

        validTap:
          !gesture.dragging &&
          !gesture.cancelled,

        mode:
          gesture.mode
      }
    );
  }

  function releasePointerCapture(pointerId) {
    if (!state.orbitField) {
      return;
    }

    try {
      if (
        state.orbitField.hasPointerCapture(
          pointerId
        )
      ) {
        state.orbitField.releasePointerCapture(
          pointerId
        );
      }
    } catch {
      /* Pointer capture release is best-effort. */
    }
  }

  function handlePointerDown(event) {
    if (
      state.disposed ||
      state.held ||
      isDialogBlockingInteraction() ||
      !isPrimaryPointerEvent(event) ||
      !isOrbitTarget(event.target) ||
      isInsideProtectedStage(event.target)
    ) {
      return;
    }

    state.counters.pointerDown += 1;

    const pointerRecord =
      createPointerRecord(event);

    state.activePointers.set(
      event.pointerId,
      pointerRecord
    );

    if (state.primaryGesture) {
      return;
    }

    state.primaryGesture =
      createGesture(event);

    setInteractionState(
      "pressed",
      state.primaryGesture
    );

    try {
      state.orbitField.setPointerCapture(
        event.pointerId
      );
    } catch {
      /* Capture may be unavailable on some synthetic events. */
    }

    publishReceipt(
      "gesture-started",
      {
        pointerType:
          state.primaryGesture.pointerType,

        mode:
          state.primaryGesture.mode,

        grabbedObjectId:
          state.primaryGesture.grabbedObject
            ? state.primaryGesture.grabbedObject.objectId
            : null,

        activeClusterId:
          state.primaryGesture.activeCluster
            ? state.primaryGesture.activeCluster.id
            : null
      }
    );
  }

  function handlePointerMove(event) {
    if (
      state.disposed ||
      !state.primaryGesture
    ) {
      return;
    }

    state.counters.pointerMove += 1;

    const pointer =
      state.activePointers.get(
        event.pointerId
      );

    if (pointer) {
      pointer.previousX =
        pointer.lastX;

      pointer.previousY =
        pointer.lastY;

      pointer.previousTime =
        pointer.lastTime;

      pointer.lastX =
        event.clientX;

      pointer.lastY =
        event.clientY;

      pointer.lastTime =
        performance.now();

      pointer.pressure =
        Number.isFinite(
          event.pressure
        )
          ? event.pressure
          : pointer.pressure;
    }

    updatePrimaryGesture(event);
  }

  function handlePointerUp(event) {
    state.counters.pointerUp += 1;

    finishPrimaryGesture(
      event,
      false
    );
  }

  function handlePointerCancel(event) {
    state.counters.pointerCancel += 1;

    finishPrimaryGesture(
      event,
      true
    );
  }

  function handleLostPointerCapture(event) {
    if (
      state.primaryGesture &&
      state.primaryGesture.pointerId ===
        event.pointerId
    ) {
      finishPrimaryGesture(
        event,
        true
      );
    }
  }

  function handleContextMenu(event) {
    if (
      state.primaryGesture &&
      state.primaryGesture.dragging
    ) {
      event.preventDefault();
    }
  }

  function handleDragStart(event) {
    if (
      isOrbitTarget(event.target)
    ) {
      event.preventDefault();
    }
  }

  function handleRootStateMutation() {
    if (!state.root) {
      return;
    }

    state.held =
      state.root.getAttribute(
        ATTRIBUTES.held
      ) === "true";

    state.reducedMotion =
      state.root.getAttribute(
        ATTRIBUTES.reducedMotion
      ) === "true" ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (
      state.held &&
      state.primaryGesture
    ) {
      const gesture =
        state.primaryGesture;

      releasePointerCapture(
        gesture.pointerId
      );

      state.activePointers.delete(
        gesture.pointerId
      );

      state.primaryGesture = null;

      setInteractionState(
        "idle"
      );
    }
  }

  function initializeRootObserver() {
    if (!state.root) {
      return;
    }

    const observer =
      new MutationObserver(
        handleRootStateMutation
      );

    observer.observe(
      state.root,
      {
        attributes: true,
        attributeFilter: [
          ATTRIBUTES.held,
          ATTRIBUTES.reducedMotion,
          ATTRIBUTES.activeCluster
        ]
      }
    );

    addObserver(observer);
  }

  function initializeReducedMotion() {
    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const update = () => {
      state.reducedMotion =
        mediaQuery.matches ||
        (
          state.root &&
          state.root.getAttribute(
            ATTRIBUTES.reducedMotion
          ) === "true"
        );

      publishReceipt(
        "reduced-motion-changed"
      );
    };

    state.reducedMotion =
      mediaQuery.matches;

    if (
      typeof mediaQuery.addEventListener ===
      "function"
    ) {
      addListener(
        mediaQuery,
        "change",
        update
      );
    } else if (
      typeof mediaQuery.addListener ===
      "function"
    ) {
      mediaQuery.addListener(update);

      state.listeners.push(() => {
        mediaQuery.removeListener(
          update
        );
      });
    }
  }

  function validateDom() {
    const issues = [];

    if (!state.root) {
      issues.push(
        "Missing [data-showroom-root]."
      );
    }

    if (!state.orbitField) {
      issues.push(
        "Missing [data-showroom-orbit-field]."
      );
    }

    if (!state.compassControl) {
      issues.push(
        "Missing [data-showroom-compass-control]."
      );
    }

    if (issues.length) {
      throw new Error(
        issues.join(" ")
      );
    }
  }

  function exposeApi() {
    const api = Object.freeze({
      contract: CONTRACT,

      getState() {
        return createReceipt(
          "state-requested",
          {
            gesture:
              state.primaryGesture
                ? {
                    pointerId:
                      state.primaryGesture.pointerId,

                    pointerType:
                      state.primaryGesture.pointerType,

                    mode:
                      state.primaryGesture.mode,

                    dragging:
                      state.primaryGesture.dragging,

                    grabbedObjectId:
                      state.primaryGesture.grabbedObject
                        ? state.primaryGesture.grabbedObject.objectId
                        : null,

                    activeClusterId:
                      state.primaryGesture.activeCluster
                        ? state.primaryGesture.activeCluster.id
                        : null
                  }
                : null
          }
        );
      },

      cancelGesture(reason = "api") {
        const gesture =
          state.primaryGesture;

        if (!gesture) {
          return false;
        }

        gesture.cancelled = true;

        releasePointerCapture(
          gesture.pointerId
        );

        state.activePointers.delete(
          gesture.pointerId
        );

        state.primaryGesture = null;

        setInteractionState(
          "idle"
        );

        publishReceipt(
          "gesture-cancelled-by-api",
          {
            reason
          }
        );

        return true;
      },

      setHeld(value) {
        state.held =
          Boolean(value);

        setRootAttribute(
          ATTRIBUTES.held,
          state.held
            ? "true"
            : "false"
        );

        handleRootStateMutation();

        return state.held;
      },

      dispose
    });

    Object.defineProperty(
      window,
      "SHOWROOM_INTERACTIONS",
      {
        configurable: true,
        enumerable: false,
        writable: false,
        value: api
      }
    );
  }

  function initialize() {
    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    try {
      state.root =
        document.querySelector(
          SELECTORS.root
        );

      state.receipt =
        document.querySelector(
          SELECTORS.receipt
        );

      state.orbit =
        document.querySelector(
          SELECTORS.orbit
        );

      state.orbitField =
        document.querySelector(
          SELECTORS.orbitField
        );

      state.compassControl =
        document.querySelector(
          SELECTORS.compassControl
        );

      validateDom();
      initializeReducedMotion();
      initializeRootObserver();
      handleRootStateMutation();

      addListener(
        state.orbitField,
        "pointerdown",
        handlePointerDown,
        {
          passive: false
        }
      );

      addListener(
        state.orbitField,
        "pointermove",
        handlePointerMove,
        {
          passive: false
        }
      );

      addListener(
        state.orbitField,
        "pointerup",
        handlePointerUp,
        {
          passive: false
        }
      );

      addListener(
        state.orbitField,
        "pointercancel",
        handlePointerCancel,
        {
          passive: false
        }
      );

      addListener(
        state.orbitField,
        "lostpointercapture",
        handleLostPointerCapture
      );

      addListener(
        state.orbitField,
        "contextmenu",
        handleContextMenu
      );

      addListener(
        state.orbitField,
        "dragstart",
        handleDragStart
      );

      /*
        Capture-phase suppression runs before the controller's direct
        semantic click listeners. Keyboard-generated clicks remain intact.
      */
      addListener(
        document,
        "click",
        handleClickCapture,
        true
      );

      exposeApi();

      state.initialized = true;

      setRootAttribute(
        ATTRIBUTES.ready,
        "true"
      );

      setRootAttribute(
        ATTRIBUTES.state,
        "ready"
      );

      setInteractionState(
        "idle"
      );

      publishReceipt("ready");

      dispatch(
        EVENTS.ready,
        {
          orbitField:
            true,

          compassTapDispatch:
            EVENTS.compassActivate,

          semanticTapDispatch:
            EVENTS.semanticActivate,

          motionDispatch:
            EVENTS.orbitMotion
        }
      );
    } catch (error) {
      if (state.root) {
        setRootAttribute(
          ATTRIBUTES.ready,
          "false"
        );

        setRootAttribute(
          ATTRIBUTES.state,
          "failed"
        );
      }

      publishReceipt(
        "fatal-error",
        {
          error: {
            name:
              error instanceof Error
                ? error.name
                : "Error",

            message:
              error instanceof Error
                ? error.message
                : String(error)
          }
        }
      );
    }
  }

  function dispose() {
    if (state.disposed) {
      return;
    }

    state.disposed = true;

    if (state.pendingMotionFrame) {
      cancelAnimationFrame(
        state.pendingMotionFrame
      );

      state.pendingMotionFrame = 0;
      state.pendingMotion = null;
    }

    if (state.primaryGesture) {
      releasePointerCapture(
        state.primaryGesture.pointerId
      );
    }

    state.primaryGesture = null;
    state.activePointers.clear();
    state.suppressedClicks.length = 0;

    for (
      const removeListener
      of state.listeners.splice(0)
    ) {
      try {
        removeListener();
      } catch {
        /* Disposal remains best-effort. */
      }
    }

    for (
      const observer
      of state.observers.splice(0)
    ) {
      try {
        observer.disconnect();
      } catch {
        /* Disposal remains best-effort. */
      }
    }

    setRootAttribute(
      ATTRIBUTES.ready,
      "false"
    );

    setRootAttribute(
      ATTRIBUTES.state,
      "disposed"
    );

    setInteractionState(
      "idle"
    );

    publishReceipt("disposed");

    try {
      delete window.SHOWROOM_INTERACTIONS;
    } catch {
      /* Noncritical cleanup. */
    }
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once: true
      }
    );
  } else {
    initialize();
  }

  window.addEventListener(
    "pagehide",
    dispose,
    {
      once: true
    }
  );
})();
