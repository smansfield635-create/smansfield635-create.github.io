// /assets/house-control-pad/house.control-pad.control2.js
// HOUSE_CONTROL_PAD_CONTROL_2_SCENE_COMPOSITION_CONTROLLER_TNT_v1
// Full-file replacement.
//
// CONTROL PAD CONTROL 2 AUTHORITY ONLY.
//
// Owns:
// - usable viewport measurement
// - estate framing
// - room framing
// - camera transform execution
// - camera scale clamping
// - camera target conversion
// - desktop and mobile camera selection
// - header compensation
// - footer compensation
// - arrival-sheet compensation
// - browser safe-area compensation
// - resize recovery
// - orientation recovery
// - neighboring-facet visibility
// - avatar safe-frame sizing
// - avatar root containment
// - avatar root scale limits
// - composition state
//
// Does not own:
// - controller open-state authority
// - room-selection authority
// - guide authority
// - routes
// - room definitions
// - facet definitions
// - resident behavior timing
// - resident anatomy
// - resident local gestures
//
// Runtime dependencies:
//
// window.HOUSE_CONTROL_PAD_DATA
// window.HOUSE_CONTROL_PAD
//
// Public runtime object:
//
// window.HOUSE_CONTROL_PAD_CONTROL_2
//
// Separation law:
//
// Data describes.
// House CSS renders architecture.
// Control Pad Control 1 coordinates.
// Control Pad Control 2 composes.
// Avatar Life schedules.
// Avatar CSS expresses.
//

(function bindHouseControlPadControl2(global) {
  "use strict";

  var CONTRACT =
    "HOUSE_CONTROL_PAD_CONTROL_2_SCENE_COMPOSITION_CONTROLLER_TNT_v1";

  var VERSION =
    "1.0.0";

  var READY_EVENT =
    "house-control-pad:control-2-ready";

  var COMPOSITION_EVENT =
    "house-control-pad:composition-updated";

  var VIEWPORT_EVENT =
    "house-control-pad:viewport-measured";

  var DEFAULT_WORLD_WIDTH =
    1000;

  var DEFAULT_WORLD_HEIGHT =
    900;

  var DEFAULT_PERSPECTIVE =
    1180;

  var MINIMUM_STAGE_WIDTH =
    240;

  var MINIMUM_STAGE_HEIGHT =
    220;

  var RESIZE_DEBOUNCE_MS =
    90;

  var ORIENTATION_SETTLE_MS =
    180;

  var state = {
    mounted: false,
    destroyed: false,
    active: false,

    viewMode: "estate",
    currentRoomId: null,
    currentAgentId: null,
    arrivalVisible: false,

    context: null,
    data: null,

    overlay: null,
    panel: null,
    header: null,
    viewport: null,
    cameraRig: null,
    estate: null,
    heartRearShell: null,
    heartShell: null,
    facetLayer: null,
    corridorLayer: null,
    roomLayer: null,
    avatarLayer: null,
    arrivalSheet: null,
    footer: null,
    status: null,

    roomElements: Object.create(null),
    facetElements: Object.create(null),
    avatarMounts: Object.create(null),

    listeners: [],
    observers: [],

    resizeTimer: null,
    orientationTimer: null,
    animationFrame: null,

    lastMeasurement: null,
    lastComposition: null,

    reducedMotion: false,
    mobile: false,
    narrow: false,

    camera: {
      targetX: 500,
      targetY: 450,
      targetZ: 0,

      translateX: 0,
      translateY: 0,
      translateZ: 0,

      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,

      scale: 1,
      perspective: DEFAULT_PERSPECTIVE
    }
  };

  function getData() {
    return global.HOUSE_CONTROL_PAD_DATA || null;
  }

  function emit(eventName, detail) {
    try {
      global.dispatchEvent(
        new CustomEvent(eventName, {
          detail: detail || {}
        })
      );
    } catch (error) {
      // No-op.
    }
  }

  function listen(target, eventName, handler, options) {
    if (
      !target ||
      typeof target.addEventListener !== "function"
    ) {
      return;
    }

    target.addEventListener(
      eventName,
      handler,
      options
    );

    state.listeners.push({
      target: target,
      eventName: eventName,
      handler: handler,
      options: options
    });
  }

  function removeAllListeners() {
    state.listeners.forEach(
      function removeListener(record) {
        record.target.removeEventListener(
          record.eventName,
          record.handler,
          record.options
        );
      }
    );

    state.listeners.length = 0;
  }

  function registerObserver(observer) {
    if (!observer) {
      return;
    }

    state.observers.push(observer);
  }

  function disconnectObservers() {
    state.observers.forEach(
      function disconnectObserver(observer) {
        if (
          observer &&
          typeof observer.disconnect === "function"
        ) {
          observer.disconnect();
        }
      }
    );

    state.observers.length = 0;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function finiteNumber(value, fallback) {
    var number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function px(value) {
    return String(value) + "px";
  }

  function setVariable(element, name, value) {
    if (!element) {
      return;
    }

    element.style.setProperty(
      name,
      value
    );
  }

  function setAttribute(element, name, value) {
    if (!element) {
      return;
    }

    element.setAttribute(
      name,
      String(value)
    );
  }

  function getRect(element) {
    if (
      !element ||
      typeof element.getBoundingClientRect !== "function"
    ) {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: 0,
        height: 0
      };
    }

    return element.getBoundingClientRect();
  }

  function getComputedNumber(element, propertyName) {
    if (!element) {
      return 0;
    }

    var value =
      global.getComputedStyle(element)
        .getPropertyValue(propertyName);

    var number =
      parseFloat(value);

    return Number.isFinite(number)
      ? number
      : 0;
  }

  function getSafeAreaInset(name) {
    if (!state.overlay) {
      return 0;
    }

    var probe =
      global.document.createElement("div");

    probe.style.position = "fixed";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    probe.style[name] =
      "env(safe-area-inset-" +
      name.replace(/[A-Z]/g, function convert(letter) {
        return "-" + letter.toLowerCase();
      }) +
      ")";

    global.document.body.appendChild(probe);

    var value =
      getComputedNumber(
        probe,
        name
      );

    probe.remove();

    return value;
  }

  function detectEnvironment() {
    var width =
      global.innerWidth ||
      global.document.documentElement.clientWidth ||
      1024;

    state.mobile =
      width <= 760;

    state.narrow =
      width <= 520;

    state.reducedMotion =
      Boolean(
        global.matchMedia &&
        global.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      );
  }

  function normalizeContext(context) {
    context = context || {};

    state.context =
      context;

    state.data =
      context.data ||
      getData();

    state.overlay =
      context.overlay ||
      state.overlay;

    state.panel =
      context.panel ||
      state.panel;

    state.header =
      context.header ||
      (
        state.panel
          ? state.panel.querySelector(
              "[data-house-control-pad-header], .hcp-header"
            )
          : null
      );

    state.viewport =
      context.viewport ||
      state.viewport;

    state.cameraRig =
      context.cameraRig ||
      state.cameraRig;

    state.estate =
      context.estate ||
      state.estate;

    state.heartRearShell =
      context.heartRearShell ||
      state.heartRearShell;

    state.heartShell =
      context.heartShell ||
      state.heartShell;

    state.facetLayer =
      context.facetLayer ||
      state.facetLayer;

    state.corridorLayer =
      context.corridorLayer ||
      state.corridorLayer;

    state.roomLayer =
      context.roomLayer ||
      state.roomLayer;

    state.avatarLayer =
      context.avatarLayer ||
      state.avatarLayer;

    state.arrivalSheet =
      context.arrivalSheet ||
      state.arrivalSheet;

    state.footer =
      context.footer ||
      (
        state.panel
          ? state.panel.querySelector(
              "[data-house-control-pad-footer], .hcp-footer"
            )
          : null
      );

    state.status =
      context.status ||
      state.status;

    state.roomElements =
      context.roomElements ||
      context.rooms ||
      state.roomElements;

    state.facetElements =
      context.facetElements ||
      context.facets ||
      state.facetElements;

    state.avatarMounts =
      context.avatarMounts ||
      state.avatarMounts;
  }

  function validateMountContext() {
    return Boolean(
      state.data &&
      state.panel &&
      state.viewport &&
      state.cameraRig &&
      state.estate
    );
  }

  function mount(context) {
    if (state.destroyed) {
      return false;
    }

    normalizeContext(context);
    detectEnvironment();

    if (!validateMountContext()) {
      return false;
    }

    if (!state.mounted) {
      bindRuntimeEvents();
      bindObservers();
      enforceSingleCameraOwner();
      establishSafeFrameDefaults();

      state.mounted = true;
    }

    state.active = true;

    measureAndCompose({
      reason: "mount",
      immediate: true
    });

    return true;
  }

  function enforceSingleCameraOwner() {
    if (!state.cameraRig) {
      return;
    }

    state.cameraRig.setAttribute(
      "data-camera-transform-owner",
      "true"
    );

    if (
      state.estate &&
      state.estate !== state.cameraRig
    ) {
      state.estate.setAttribute(
        "data-camera-transform-owner",
        "false"
      );

      state.estate.style.transform =
        "";
    }

    var nestedLegacyStage =
      state.cameraRig.querySelector(
        ".hcp-estate-stage"
      );

    if (
      nestedLegacyStage &&
      nestedLegacyStage !== state.estate
    ) {
      nestedLegacyStage.style.transform =
        "none";

      nestedLegacyStage.style.transformOrigin =
        "50% 50%";

      nestedLegacyStage.setAttribute(
        "data-camera-transform-owner",
        "false"
      );
    }
  }

  function establishSafeFrameDefaults() {
    Object.keys(
      state.avatarMounts || {}
    ).forEach(
      function establishRoomSafeFrame(roomId) {
        var mount =
          state.avatarMounts[roomId];

        if (!mount) {
          return;
        }

        var safeFrame =
          mount.closest(
            "[data-house-avatar-safe-frame], .hcp-avatar-safe-frame"
          );

        if (!safeFrame) {
          return;
        }

        safeFrame.setAttribute(
          "data-house-room",
          roomId
        );

        safeFrame.setAttribute(
          "data-avatar-contained",
          "true"
        );

        safeFrame.style.position =
          safeFrame.style.position ||
          "absolute";

        safeFrame.style.overflow =
          "hidden";

        safeFrame.style.contain =
          "layout paint";

        safeFrame.style.isolation =
          "isolate";

        mount.style.position =
          mount.style.position ||
          "absolute";

        mount.style.left =
          "50%";

        mount.style.bottom =
          "0";

        mount.style.transformOrigin =
          "50% 100%";
      }
    );
  }

  function bindRuntimeEvents() {
    listen(
      global,
      "resize",
      handleResize,
      {
        passive: true
      }
    );

    listen(
      global,
      "orientationchange",
      handleOrientationChange,
      {
        passive: true
      }
    );

    if (global.visualViewport) {
      listen(
        global.visualViewport,
        "resize",
        handleVisualViewportChange,
        {
          passive: true
        }
      );

      listen(
        global.visualViewport,
        "scroll",
        handleVisualViewportChange,
        {
          passive: true
        }
      );
    }

    listen(
      global,
      "house-control-pad:avatar-size-changed",
      handleAvatarSizeChanged
    );
  }

  function bindObservers() {
    if (
      typeof global.ResizeObserver === "function"
    ) {
      var resizeObserver =
        new global.ResizeObserver(
          function handleObservedResize() {
            scheduleReframe(
              "resize-observer"
            );
          }
        );

      [
        state.panel,
        state.header,
        state.viewport,
        state.arrivalSheet,
        state.footer
      ].forEach(
        function observeElement(element) {
          if (element) {
            resizeObserver.observe(
              element
            );
          }
        }
      );

      registerObserver(
        resizeObserver
      );
    }

    if (
      typeof global.MutationObserver === "function" &&
      state.arrivalSheet
    ) {
      var mutationObserver =
        new global.MutationObserver(
          function handleArrivalMutation() {
            var visible =
              state.arrivalSheet.getAttribute(
                "data-visible"
              ) === "true";

            if (
              visible !==
              state.arrivalVisible
            ) {
              state.arrivalVisible =
                visible;

              scheduleReframe(
                "arrival-mutation"
              );
            }
          }
        );

      mutationObserver.observe(
        state.arrivalSheet,
        {
          attributes: true,
          attributeFilter: [
            "data-visible",
            "style",
            "class"
          ],
          childList: true,
          subtree: true
        }
      );

      registerObserver(
        mutationObserver
      );
    }
  }

  function handleResize() {
    scheduleReframe(
      "window-resize"
    );
  }

  function handleVisualViewportChange() {
    scheduleReframe(
      "visual-viewport"
    );
  }

  function handleOrientationChange() {
    if (state.orientationTimer) {
      global.clearTimeout(
        state.orientationTimer
      );
    }

    state.orientationTimer =
      global.setTimeout(
        function settleOrientation() {
          detectEnvironment();

          measureAndCompose({
            reason: "orientation",
            immediate: true
          });
        },
        ORIENTATION_SETTLE_MS
      );
  }

  function handleAvatarSizeChanged(event) {
    var detail =
      event && event.detail
        ? event.detail
        : {};

    if (
      !detail.roomId ||
      detail.roomId ===
        state.currentRoomId
    ) {
      scheduleReframe(
        "avatar-size-changed"
      );
    }
  }

  function scheduleReframe(reason) {
    if (
      state.destroyed ||
      !state.mounted ||
      !state.active
    ) {
      return;
    }

    if (state.resizeTimer) {
      global.clearTimeout(
        state.resizeTimer
      );
    }

    state.resizeTimer =
      global.setTimeout(
        function runScheduledReframe() {
          detectEnvironment();

          measureAndCompose({
            reason:
              reason ||
              "scheduled"
          });
        },
        RESIZE_DEBOUNCE_MS
      );
  }

  function open(payload) {
    payload = payload || {};

    state.active = true;

    if (payload.roomId) {
      state.currentRoomId =
        payload.roomId;
    }

    measureAndCompose({
      reason: "open",
      immediate: true
    });
  }

  function close() {
    state.active = false;

    cancelAnimationFrame();

    if (state.cameraRig) {
      state.cameraRig.removeAttribute(
        "data-camera-animating"
      );
    }
  }

  function showEstate(payload) {
    payload = payload || {};

    state.active = true;
    state.viewMode = "estate";
    state.currentRoomId = null;
    state.currentAgentId = null;

    applyNeighborVisibility(
      null,
      "estate"
    );

    measureAndCompose({
      reason: "show-estate",
      immediate:
        Boolean(payload.immediate)
    });
  }

  function focusRoom(roomId, payload) {
    payload = payload || {};

    if (!roomId) {
      return;
    }

    state.active = true;
    state.viewMode = "room";
    state.currentRoomId = roomId;
    state.currentAgentId =
      payload.agentId ||
      state.currentAgentId;

    applyNeighborVisibility(
      roomId,
      "room"
    );

    measureAndCompose({
      reason: "focus-room",
      immediate:
        Boolean(payload.immediate)
    });
  }

  function roomArrived(roomId, payload) {
    payload = payload || {};

    if (roomId) {
      state.currentRoomId =
        roomId;
    }

    if (payload.agentId) {
      state.currentAgentId =
        payload.agentId;
    }

    sizeAvatarForRoom(
      state.currentRoomId
    );

    measureAndCompose({
      reason: "room-arrived"
    });
  }

  function setArrivalSheetVisible(visible, payload) {
    payload = payload || {};

    state.arrivalVisible =
      Boolean(visible);

    if (payload.roomId) {
      state.currentRoomId =
        payload.roomId;
    }

    if (state.arrivalSheet) {
      setAttribute(
        state.arrivalSheet,
        "data-composition-visible",
        state.arrivalVisible
      );
    }

    measureAndCompose({
      reason:
        state.arrivalVisible
          ? "arrival-open"
          : "arrival-close"
    });
  }

  function reframe(payload) {
    payload = payload || {};

    if (payload.roomId) {
      state.currentRoomId =
        payload.roomId;
    }

    if (payload.viewMode) {
      state.viewMode =
        payload.viewMode;
    }

    if (
      typeof payload.arrivalVisible ===
        "boolean"
    ) {
      state.arrivalVisible =
        payload.arrivalVisible;
    }

    measureAndCompose({
      reason: "explicit-reframe"
    });
  }

  function handleCommand(command, payload) {
    if (command === "open") {
      open(payload);
      return;
    }

    if (command === "close") {
      close(payload);
      return;
    }

    if (command === "showEstate") {
      showEstate(payload);
      return;
    }

    if (command === "focusRoom") {
      focusRoom(
        payload && payload.roomId,
        payload
      );
      return;
    }

    if (command === "roomArrived") {
      roomArrived(
        payload && payload.roomId,
        payload
      );
      return;
    }

    if (
      command ===
      "setArrivalSheetVisible"
    ) {
      setArrivalSheetVisible(
        payload && payload.visible,
        payload
      );
      return;
    }

    if (command === "reframe") {
      reframe(payload);
    }
  }

  function measureAndCompose(options) {
    options = options || {};

    if (
      !state.active ||
      !validateMountContext()
    ) {
      return null;
    }

    detectEnvironment();

    var measurement =
      measureUsableViewport();

    state.lastMeasurement =
      measurement;

    applyMeasuredVariables(
      measurement
    );

    var composition =
      state.viewMode === "room" &&
      state.currentRoomId
        ? calculateRoomComposition(
            state.currentRoomId,
            measurement
          )
        : calculateEstateComposition(
            measurement
          );

    if (!composition) {
      return null;
    }

    state.lastComposition =
      composition;

    applyCameraComposition(
      composition,
      {
        immediate:
          Boolean(options.immediate)
      }
    );

    if (
      state.viewMode === "room" &&
      state.currentRoomId
    ) {
      sizeAvatarForRoom(
        state.currentRoomId,
        measurement,
        composition
      );
    } else {
      sizeAllAvatarsForEstate(
        measurement,
        composition
      );
    }

    emit(
      COMPOSITION_EVENT,
      {
        contract: CONTRACT,
        reason:
          options.reason ||
          "compose",
        viewMode:
          state.viewMode,
        roomId:
          state.currentRoomId,
        measurement:
          cloneMeasurement(
            measurement
          ),
        composition:
          cloneComposition(
            composition
          )
      }
    );

    return composition;
  }

  function measureUsableViewport() {
    var panelRect =
      getRect(state.panel);

    var headerRect =
      getRect(state.header);

    var footerRect =
      getRect(state.footer);

    var arrivalRect =
      getRect(state.arrivalSheet);

    var viewportRect =
      getRect(state.viewport);

    var visualViewport =
      global.visualViewport;

    var visibleWindowWidth =
      visualViewport
        ? visualViewport.width
        : global.innerWidth;

    var visibleWindowHeight =
      visualViewport
        ? visualViewport.height
        : global.innerHeight;

    var arrivalVisible =
      Boolean(
        state.arrivalVisible &&
        state.arrivalSheet &&
        state.arrivalSheet.getAttribute(
          "data-visible"
        ) === "true"
      );

    var headerHeight =
      finiteNumber(
        headerRect.height,
        0
      );

    var footerHeight =
      finiteNumber(
        footerRect.height,
        0
      );

    var arrivalHeight =
      arrivalVisible
        ? finiteNumber(
            arrivalRect.height,
            0
          )
        : 0;

    var panelWidth =
      finiteNumber(
        panelRect.width,
        visibleWindowWidth
      );

    var panelHeight =
      finiteNumber(
        panelRect.height,
        visibleWindowHeight
      );

    var viewportWidth =
      Math.max(
        MINIMUM_STAGE_WIDTH,
        finiteNumber(
          viewportRect.width,
          panelWidth
        )
      );

    var viewportHeight =
      Math.max(
        MINIMUM_STAGE_HEIGHT,
        finiteNumber(
          viewportRect.height,
          panelHeight -
          headerHeight -
          footerHeight -
          arrivalHeight
        )
      );

    var stageLeft =
      finiteNumber(
        viewportRect.left,
        panelRect.left
      );

    var stageTop =
      finiteNumber(
        viewportRect.top,
        panelRect.top +
        headerHeight
      );

    var safeTop =
      Math.max(
        0,
        visualViewport
          ? visualViewport.offsetTop
          : 0
      );

    var safeLeft =
      Math.max(
        0,
        visualViewport
          ? visualViewport.offsetLeft
          : 0
      );

    var measurement = {
      windowWidth:
        finiteNumber(
          visibleWindowWidth,
          viewportWidth
        ),

      windowHeight:
        finiteNumber(
          visibleWindowHeight,
          viewportHeight
        ),

      panelWidth:
        panelWidth,

      panelHeight:
        panelHeight,

      headerHeight:
        headerHeight,

      footerHeight:
        footerHeight,

      arrivalHeight:
        arrivalHeight,

      arrivalVisible:
        arrivalVisible,

      viewportWidth:
        viewportWidth,

      viewportHeight:
        viewportHeight,

      stageLeft:
        stageLeft,

      stageTop:
        stageTop,

      stageCenterX:
        stageLeft +
        viewportWidth / 2,

      stageCenterY:
        stageTop +
        viewportHeight / 2,

      safeTop:
        safeTop,

      safeLeft:
        safeLeft,

      mobile:
        state.mobile,

      narrow:
        state.narrow,

      portrait:
        viewportHeight >=
        viewportWidth
    };

    emit(
      VIEWPORT_EVENT,
      {
        contract: CONTRACT,
        measurement:
          cloneMeasurement(
            measurement
          )
      }
    );

    return measurement;
  }

  function applyMeasuredVariables(measurement) {
    if (!state.panel) {
      return;
    }

    setVariable(
      state.panel,
      "--hcp-measured-header-height",
      px(measurement.headerHeight)
    );

    setVariable(
      state.panel,
      "--hcp-measured-footer-height",
      px(measurement.footerHeight)
    );

    setVariable(
      state.panel,
      "--hcp-measured-arrival-height",
      px(measurement.arrivalHeight)
    );

    setVariable(
      state.panel,
      "--hcp-usable-stage-width",
      px(measurement.viewportWidth)
    );

    setVariable(
      state.panel,
      "--hcp-usable-stage-height",
      px(measurement.viewportHeight)
    );

    setAttribute(
      state.panel,
      "data-mobile",
      measurement.mobile
    );

    setAttribute(
      state.panel,
      "data-narrow",
      measurement.narrow
    );

    setAttribute(
      state.panel,
      "data-arrival-visible",
      measurement.arrivalVisible
    );
  }

  function getWorld() {
    var world =
      state.data &&
      state.data.heartWorld
        ? state.data.heartWorld
        : {};

    return {
      width:
        finiteNumber(
          world.width,
          DEFAULT_WORLD_WIDTH
        ),

      height:
        finiteNumber(
          world.height,
          DEFAULT_WORLD_HEIGHT
        ),

      perspective:
        finiteNumber(
          world.perspective,
          DEFAULT_PERSPECTIVE
        ),

      defaultCamera:
        world.defaultCamera ||
        {}
    };
  }

  function calculateEstateComposition(measurement) {
    var world =
      getWorld();

    var camera =
      world.defaultCamera || {};

    var modeCamera =
      measurement.mobile &&
      camera.mobile
        ? camera.mobile
        : camera;

    var horizontalPadding =
      measurement.narrow
        ? 16
        : measurement.mobile
          ? 24
          : 46;

    var verticalPadding =
      measurement.narrow
        ? 14
        : measurement.mobile
          ? 20
          : 38;

    var fitScale =
      Math.min(
        (
          measurement.viewportWidth -
          horizontalPadding * 2
        ) /
        world.width,

        (
          measurement.viewportHeight -
          verticalPadding * 2
        ) /
        world.height
      );

    var preferredScale =
      finiteNumber(
        modeCamera.scale,
        fitScale
      );

    var scale =
      clamp(
        Math.min(
          fitScale,
          preferredScale
        ),
        measurement.narrow
          ? 0.42
          : measurement.mobile
            ? 0.48
            : 0.56,
        measurement.mobile
          ? 0.9
          : 1
      );

    var target =
      modeCamera.target || {
        x: world.width / 2,
        y: world.height / 2,
        z: 0
      };

    return createComposition({
      mode:
        "estate",

      roomId:
        null,

      targetX:
        finiteNumber(
          target.x,
          world.width / 2
        ),

      targetY:
        finiteNumber(
          target.y,
          world.height / 2
        ),

      targetZ:
        finiteNumber(
          target.z,
          0
        ),

      scale:
        scale,

      perspective:
        finiteNumber(
          modeCamera.perspective,
          world.perspective
        ),

      rotateX:
        finiteNumber(
          modeCamera.rotateX,
          0
        ),

      rotateY:
        finiteNumber(
          modeCamera.rotateY,
          0
        ),

      rotateZ:
        finiteNumber(
          modeCamera.rotateZ,
          0
        ),

      translateZ:
        calculateDistanceTranslation(
          modeCamera.distance,
          world,
          scale
        ),

      viewportWidth:
        measurement.viewportWidth,

      viewportHeight:
        measurement.viewportHeight
    });
  }

  function calculateRoomComposition(
    roomId,
    measurement
  ) {
    var room =
      state.data.getRoom
        ? state.data.getRoom(roomId)
        : state.data.rooms[roomId];

    if (
      !room ||
      !room.heart3d
    ) {
      return calculateEstateComposition(
        measurement
      );
    }

    var world =
      getWorld();

    var camera =
      room.heart3d.camera || {};

    var modeCamera =
      measurement.mobile &&
      camera.mobile
        ? camera.mobile
        : camera;

    var focusBounds =
      room.heart3d.focusBounds || {
        minX:
          room.heart3d.center.x -
          room.heart3d.size.width / 2,

        maxX:
          room.heart3d.center.x +
          room.heart3d.size.width / 2,

        minY:
          room.heart3d.center.y -
          room.heart3d.size.height / 2,

        maxY:
          room.heart3d.center.y +
          room.heart3d.size.height / 2
      };

    var roomWidth =
      Math.max(
        1,
        focusBounds.maxX -
        focusBounds.minX
      );

    var roomHeight =
      Math.max(
        1,
        focusBounds.maxY -
        focusBounds.minY
      );

    var contextRadius =
      finiteNumber(
        modeCamera.contextRadius,
        finiteNumber(
          camera.contextRadius,
          Math.max(
            roomWidth,
            roomHeight
          )
        )
      );

    var contextWidth =
      Math.max(
        roomWidth,
        contextRadius * 2
      );

    var contextHeight =
      Math.max(
        roomHeight,
        contextRadius * 1.55
      );

    var horizontalPadding =
      measurement.narrow
        ? 20
        : measurement.mobile
          ? 28
          : 52;

    var verticalPadding =
      measurement.narrow
        ? 18
        : measurement.mobile
          ? 26
          : 46;

    var availableWidth =
      Math.max(
        MINIMUM_STAGE_WIDTH,
        measurement.viewportWidth -
        horizontalPadding * 2
      );

    var availableHeight =
      Math.max(
        MINIMUM_STAGE_HEIGHT,
        measurement.viewportHeight -
        verticalPadding * 2
      );

    var fitScale =
      Math.min(
        availableWidth /
        contextWidth,

        availableHeight /
        contextHeight
      );

    var preferredScale =
      finiteNumber(
        modeCamera.scale,
        fitScale
      );

    var minimumContextFraction =
      finiteNumber(
        state.data.heartWorld &&
        state.data.heartWorld
          .roomViewLaw &&
        state.data.heartWorld
          .roomViewLaw
          .minimumVisibleHeartFraction,
        0.28
      );

    var maximumRoomScale =
      calculateMaximumRoomScale(
        roomWidth,
        roomHeight,
        measurement,
        minimumContextFraction
      );

    var scale =
      clamp(
        Math.min(
          fitScale,
          preferredScale,
          maximumRoomScale
        ),
        measurement.narrow
          ? 0.72
          : measurement.mobile
            ? 0.78
            : 0.86,
        measurement.mobile
          ? 1.18
          : 1.34
      );

    var target =
      modeCamera.target ||
      camera.target ||
      room.heart3d.center;

    var arrivalBias =
      calculateArrivalBias(
        measurement,
        room
      );

    return createComposition({
      mode:
        "room",

      roomId:
        roomId,

      targetX:
        finiteNumber(
          target.x,
          room.heart3d.center.x
        ),

      targetY:
        finiteNumber(
          target.y,
          room.heart3d.center.y
        ) +
        arrivalBias.targetYOffset,

      targetZ:
        finiteNumber(
          target.z,
          room.heart3d.center.z
        ),

      scale:
        scale,

      perspective:
        finiteNumber(
          modeCamera.perspective,
          world.perspective
        ),

      rotateX:
        finiteNumber(
          modeCamera.rotateX,
          0
        ),

      rotateY:
        finiteNumber(
          modeCamera.rotateY,
          0
        ),

      rotateZ:
        finiteNumber(
          modeCamera.rotateZ,
          0
        ),

      translateZ:
        calculateDistanceTranslation(
          modeCamera.distance,
          world,
          scale
        ),

      viewportWidth:
        measurement.viewportWidth,

      viewportHeight:
        measurement.viewportHeight,

      stageOffsetY:
        arrivalBias.stageOffsetY
    });
  }

  function calculateMaximumRoomScale(
    roomWidth,
    roomHeight,
    measurement,
    minimumContextFraction
  ) {
    var maximumWidthFraction =
      1 -
      minimumContextFraction * 0.72;

    var maximumHeightFraction =
      1 -
      minimumContextFraction * 0.62;

    var maximumByWidth =
      (
        measurement.viewportWidth *
        maximumWidthFraction
      ) /
      roomWidth;

    var maximumByHeight =
      (
        measurement.viewportHeight *
        maximumHeightFraction
      ) /
      roomHeight;

    return Math.min(
      maximumByWidth,
      maximumByHeight
    );
  }

  function calculateArrivalBias(
    measurement,
    room
  ) {
    if (
      !measurement.arrivalVisible ||
      measurement.arrivalHeight <= 0
    ) {
      return {
        targetYOffset: 0,
        stageOffsetY: 0
      };
    }

    var arrivalRatio =
      clamp(
        measurement.arrivalHeight /
        Math.max(
          1,
          measurement.panelHeight
        ),
        0,
        0.32
      );

    var roomHeight =
      room &&
      room.heart3d &&
      room.heart3d.size
        ? room.heart3d.size.height
        : 150;

    return {
      targetYOffset:
        -roomHeight *
        arrivalRatio *
        0.72,

      stageOffsetY:
        -measurement.arrivalHeight *
        0.12
    };
  }

  function calculateDistanceTranslation(
    distance,
    world,
    scale
  ) {
    var resolvedDistance =
      finiteNumber(
        distance,
        0
      );

    if (!resolvedDistance) {
      return 0;
    }

    var referenceDistance =
      Math.max(
        world.width,
        world.height
      );

    return clamp(
      (
        referenceDistance -
        resolvedDistance
      ) *
      0.08 *
      scale,
      -180,
      120
    );
  }

  function createComposition(options) {
    var world =
      getWorld();

    var stageCenterX =
      options.viewportWidth / 2;

    var stageCenterY =
      options.viewportHeight / 2 +
      finiteNumber(
        options.stageOffsetY,
        0
      );

    var targetScreenX =
      options.targetX *
      options.scale;

    var targetScreenY =
      options.targetY *
      options.scale;

    var translateX =
      stageCenterX -
      targetScreenX;

    var translateY =
      stageCenterY -
      targetScreenY;

    return {
      mode:
        options.mode,

      roomId:
        options.roomId,

      targetX:
        options.targetX,

      targetY:
        options.targetY,

      targetZ:
        options.targetZ,

      translateX:
        translateX,

      translateY:
        translateY,

      translateZ:
        options.translateZ,

      scale:
        options.scale,

      perspective:
        options.perspective,

      rotateX:
        options.rotateX,

      rotateY:
        options.rotateY,

      rotateZ:
        options.rotateZ,

      worldWidth:
        world.width,

      worldHeight:
        world.height,

      viewportWidth:
        options.viewportWidth,

      viewportHeight:
        options.viewportHeight
    };
  }

  function applyCameraComposition(
    composition,
    options
  ) {
    options = options || {};

    if (
      !state.cameraRig ||
      !state.viewport
    ) {
      return;
    }

    cancelAnimationFrame();

    setVariable(
      state.viewport,
      "--hcp-camera-perspective",
      px(composition.perspective)
    );

    setVariable(
      state.panel,
      "--hcp-camera-perspective",
      px(composition.perspective)
    );

    setVariable(
      state.cameraRig,
      "--hcp-camera-x",
      px(composition.translateX)
    );

    setVariable(
      state.cameraRig,
      "--hcp-camera-y",
      px(composition.translateY)
    );

    setVariable(
      state.cameraRig,
      "--hcp-camera-z",
      px(composition.translateZ)
    );

    setVariable(
      state.cameraRig,
      "--hcp-camera-scale",
      String(composition.scale)
    );

    setVariable(
      state.cameraRig,
      "--hcp-camera-rotate-x",
      composition.rotateX + "deg"
    );

    setVariable(
      state.cameraRig,
      "--hcp-camera-rotate-y",
      composition.rotateY + "deg"
    );

    setVariable(
      state.cameraRig,
      "--hcp-camera-rotate-z",
      composition.rotateZ + "deg"
    );

    setAttribute(
      state.cameraRig,
      "data-camera-mode",
      composition.mode
    );

    setAttribute(
      state.cameraRig,
      "data-camera-room",
      composition.roomId || ""
    );

    var immediate =
      options.immediate ||
      state.reducedMotion;

    if (immediate) {
      state.cameraRig.style.transition =
        "none";

      forceLayout(
        state.cameraRig
      );

      state.cameraRig.style.transform =
        buildCameraTransform(
          composition
        );

      state.animationFrame =
        global.requestAnimationFrame(
          function restoreTransition() {
            state.cameraRig.style.transition =
              "";
          }
        );

      return;
    }

    state.cameraRig.setAttribute(
      "data-camera-animating",
      "true"
    );

    state.cameraRig.style.transform =
      buildCameraTransform(
        composition
      );

    var transitionMs =
      finiteNumber(
        state.data &&
        state.data.timing &&
        state.data.timing.CAMERA_MS,
        620
      );

    global.setTimeout(
      function clearCameraAnimation() {
        if (state.cameraRig) {
          state.cameraRig.removeAttribute(
            "data-camera-animating"
          );
        }
      },
      transitionMs + 40
    );
  }

  function buildCameraTransform(composition) {
    return (
      "translate3d(" +
      composition.translateX +
      "px," +
      composition.translateY +
      "px," +
      composition.translateZ +
      "px) " +
      "rotateX(" +
      composition.rotateX +
      "deg) " +
      "rotateY(" +
      composition.rotateY +
      "deg) " +
      "rotateZ(" +
      composition.rotateZ +
      "deg) " +
      "scale(" +
      composition.scale +
      ")"
    );
  }

  function forceLayout(element) {
    if (!element) {
      return;
    }

    void element.offsetWidth;
  }

  function cancelAnimationFrame() {
    if (state.animationFrame) {
      global.cancelAnimationFrame(
        state.animationFrame
      );

      state.animationFrame = null;
    }
  }

  function applyNeighborVisibility(
    roomId,
    mode
  ) {
    var rooms =
      state.data &&
      state.data.rooms
        ? state.data.rooms
        : {};

    Object.keys(
      state.roomElements || {}
    ).forEach(
      function applyRoomVisibility(id) {
        var element =
          state.roomElements[id];

        var facet =
          state.facetElements[id];

        if (!element) {
          return;
        }

        if (mode === "estate") {
          setAttribute(
            element,
            "data-composition-relation",
            "estate"
          );

          if (facet) {
            setAttribute(
              facet,
              "data-composition-relation",
              "estate"
            );
          }

          return;
        }

        if (id === roomId) {
          setAttribute(
            element,
            "data-composition-relation",
            "focused"
          );

          if (facet) {
            setAttribute(
              facet,
              "data-composition-relation",
              "focused"
            );
          }

          return;
        }

        var focusedRoom =
          rooms[roomId];

        var isNeighbor =
          Boolean(
            focusedRoom &&
            Array.isArray(
              focusedRoom.relatedRooms
            ) &&
            focusedRoom.relatedRooms
              .indexOf(id) !== -1
          );

        setAttribute(
          element,
          "data-composition-relation",
          isNeighbor
            ? "neighbor"
            : "distant"
        );

        if (facet) {
          setAttribute(
            facet,
            "data-composition-relation",
            isNeighbor
              ? "neighbor"
              : "distant"
          );
        }
      }
    );
  }

  function sizeAllAvatarsForEstate(
    measurement,
    composition
  ) {
    Object.keys(
      state.avatarMounts || {}
    ).forEach(
      function sizeEstateAvatar(roomId) {
        sizeAvatarForRoom(
          roomId,
          measurement,
          composition,
          {
            estateMode: true
          }
        );
      }
    );
  }

  function sizeAvatarForRoom(
    roomId,
    measurement,
    composition,
    options
  ) {
    options = options || {};

    if (!roomId) {
      return;
    }

    var room =
      state.data &&
      state.data.getRoom
        ? state.data.getRoom(roomId)
        : state.data.rooms[roomId];

    var mount =
      state.avatarMounts &&
      state.avatarMounts[roomId];

    var roomElement =
      state.roomElements &&
      state.roomElements[roomId];

    if (
      !room ||
      !mount ||
      !roomElement
    ) {
      return;
    }

    var safeFrame =
      mount.closest(
        "[data-house-avatar-safe-frame], .hcp-avatar-safe-frame"
      );

    if (!safeFrame) {
      return;
    }

    measurement =
      measurement ||
      state.lastMeasurement ||
      measureUsableViewport();

    composition =
      composition ||
      state.lastComposition ||
      (
        state.viewMode === "room"
          ? calculateRoomComposition(
              roomId,
              measurement
            )
          : calculateEstateComposition(
              measurement
            )
      );

    var roomRect =
      getRect(roomElement);

    var roomWidth =
      Math.max(
        1,
        roomRect.width
      );

    var roomHeight =
      Math.max(
        1,
        roomRect.height
      );

    var law =
      state.data &&
      state.data.heartWorld &&
      state.data.heartWorld.roomViewLaw
        ? state.data.heartWorld.roomViewLaw
        : {};

    var maximumFieldFraction =
      measurement.mobile
        ? finiteNumber(
            law.mobileMaximumAvatarFieldFraction,
            0.32
          )
        : finiteNumber(
            law.maximumAvatarFieldFraction,
            0.36
          );

    if (options.estateMode) {
      maximumFieldFraction =
        measurement.mobile
          ? 0.2
          : 0.24;
    }

    var safeWidth =
      roomWidth *
      clamp(
        maximumFieldFraction,
        0.18,
        0.4
      );

    var safeHeight =
      roomHeight *
      (
        options.estateMode
          ? 0.46
          : measurement.mobile
            ? 0.62
            : 0.68
      );

    var minimumWidth =
      measurement.mobile
        ? 34
        : 44;

    var minimumHeight =
      measurement.mobile
        ? 52
        : 68;

    safeWidth =
      Math.max(
        minimumWidth,
        safeWidth
      );

    safeHeight =
      Math.max(
        minimumHeight,
        safeHeight
      );

    var anchor =
      room.heart3d.avatarAnchor;

    var bounds =
      room.heart3d.focusBounds;

    var boundWidth =
      Math.max(
        1,
        bounds.maxX -
        bounds.minX
      );

    var boundHeight =
      Math.max(
        1,
        bounds.maxY -
        bounds.minY
      );

    var anchorX =
      (
        anchor.x -
        bounds.minX
      ) /
      boundWidth;

    var anchorY =
      (
        anchor.y -
        bounds.minY
      ) /
      boundHeight;

    anchorX =
      clamp(
        anchorX,
        0.18,
        0.82
      );

    anchorY =
      clamp(
        anchorY,
        0.26,
        0.82
      );

    var left =
      clamp(
        anchorX * 100 -
        (
          safeWidth /
          roomWidth *
          100
        ) / 2,
        3,
        97 -
        (
          safeWidth /
          roomWidth *
          100
        )
      );

    var top =
      clamp(
        anchorY * 100 -
        (
          safeHeight /
          roomHeight *
          100
        ) * 0.72,
        4,
        96 -
        (
          safeHeight /
          roomHeight *
          100
        )
      );

    safeFrame.style.left =
      left + "%";

    safeFrame.style.top =
      top + "%";

    safeFrame.style.width =
      safeWidth + "px";

    safeFrame.style.height =
      safeHeight + "px";

    safeFrame.style.overflow =
      "hidden";

    safeFrame.style.contain =
      "layout paint";

    safeFrame.style.isolation =
      "isolate";

    setAttribute(
      safeFrame,
      "data-avatar-safe-mode",
      options.estateMode
        ? "estate"
        : "room"
    );

    var resident =
      mount.querySelector(
        "[data-house-avatar], .hcp-avatar"
      );

    var rootScale =
      calculateAvatarRootScale(
        room,
        safeFrame,
        resident,
        measurement,
        options
      );

    setVariable(
      safeFrame,
      "--hcp-avatar-root-scale",
      String(rootScale)
    );

    setVariable(
      mount,
      "--hcp-avatar-root-scale",
      String(rootScale)
    );

    mount.style.left =
      "50%";

    mount.style.bottom =
      "0";

    mount.style.width =
      "100%";

    mount.style.height =
      "100%";

    mount.style.transform =
      "translateX(-50%)";

    mount.style.transformOrigin =
      "50% 100%";

    if (resident) {
      resident.style.maxWidth =
        "100%";

      resident.style.maxHeight =
        "100%";

      resident.style.transformOrigin =
        "50% 100%";

      resident.style.setProperty(
        "--hcp-avatar-structural-scale",
        String(rootScale)
      );

      setAttribute(
        resident,
        "data-avatar-contained",
        "true"
      );

      setAttribute(
        resident,
        "data-avatar-composition-mode",
        options.estateMode
          ? "estate"
          : "room"
      );
    }
  }

  function calculateAvatarRootScale(
    room,
    safeFrame,
    resident,
    measurement,
    options
  ) {
    var agent =
      getRoomAgent(room);

    var preferredScale =
      1;

    if (
      agent &&
      agent.scale
    ) {
      if (options.estateMode) {
        preferredScale =
          finiteNumber(
            agent.scale.overview,
            1
          );
      } else {
        preferredScale =
          finiteNumber(
            agent.scale.room,
            1
          );
      }
    }

    var safeRect =
      getRect(safeFrame);

    var residentRect =
      resident
        ? getRect(resident)
        : {
            width: safeRect.width,
            height: safeRect.height
          };

    var naturalWidth =
      Math.max(
        1,
        finiteNumber(
          residentRect.width,
          safeRect.width
        )
      );

    var naturalHeight =
      Math.max(
        1,
        finiteNumber(
          residentRect.height,
          safeRect.height
        )
      );

    var fitScale =
      Math.min(
        safeRect.width /
        naturalWidth,

        safeRect.height /
        naturalHeight
      );

    if (
      !Number.isFinite(fitScale) ||
      fitScale <= 0
    ) {
      fitScale = 1;
    }

    var maximumScale =
      options.estateMode
        ? measurement.mobile
          ? 0.72
          : 0.84
        : measurement.mobile
          ? 0.9
          : 1;

    return clamp(
      Math.min(
        preferredScale,
        fitScale,
        maximumScale
      ),
      0.42,
      maximumScale
    );
  }

  function getRoomAgent(room) {
    if (
      !room ||
      !state.data
    ) {
      return null;
    }

    var authorityId =
      room.authority;

    if (
      state.data.getAgent &&
      authorityId
    ) {
      return state.data.getAgent(
        authorityId
      );
    }

    return (
      state.data.agents &&
      state.data.agents[authorityId]
    ) || null;
  }

  function cloneMeasurement(measurement) {
    return {
      windowWidth:
        measurement.windowWidth,

      windowHeight:
        measurement.windowHeight,

      panelWidth:
        measurement.panelWidth,

      panelHeight:
        measurement.panelHeight,

      headerHeight:
        measurement.headerHeight,

      footerHeight:
        measurement.footerHeight,

      arrivalHeight:
        measurement.arrivalHeight,

      arrivalVisible:
        measurement.arrivalVisible,

      viewportWidth:
        measurement.viewportWidth,

      viewportHeight:
        measurement.viewportHeight,

      stageLeft:
        measurement.stageLeft,

      stageTop:
        measurement.stageTop,

      stageCenterX:
        measurement.stageCenterX,

      stageCenterY:
        measurement.stageCenterY,

      mobile:
        measurement.mobile,

      narrow:
        measurement.narrow,

      portrait:
        measurement.portrait
    };
  }

  function cloneComposition(composition) {
    return {
      mode:
        composition.mode,

      roomId:
        composition.roomId,

      targetX:
        composition.targetX,

      targetY:
        composition.targetY,

      targetZ:
        composition.targetZ,

      translateX:
        composition.translateX,

      translateY:
        composition.translateY,

      translateZ:
        composition.translateZ,

      scale:
        composition.scale,

      perspective:
        composition.perspective,

      rotateX:
        composition.rotateX,

      rotateY:
        composition.rotateY,

      rotateZ:
        composition.rotateZ,

      viewportWidth:
        composition.viewportWidth,

      viewportHeight:
        composition.viewportHeight
    };
  }

  function getState() {
    return {
      contract:
        CONTRACT,

      version:
        VERSION,

      mounted:
        state.mounted,

      destroyed:
        state.destroyed,

      active:
        state.active,

      viewMode:
        state.viewMode,

      currentRoomId:
        state.currentRoomId,

      currentAgentId:
        state.currentAgentId,

      arrivalVisible:
        state.arrivalVisible,

      mobile:
        state.mobile,

      narrow:
        state.narrow,

      lastMeasurement:
        state.lastMeasurement
          ? cloneMeasurement(
              state.lastMeasurement
            )
          : null,

      lastComposition:
        state.lastComposition
          ? cloneComposition(
              state.lastComposition
            )
          : null
    };
  }

  function destroy() {
    if (state.destroyed) {
      return;
    }

    state.active = false;
    state.mounted = false;
    state.destroyed = true;

    if (state.resizeTimer) {
      global.clearTimeout(
        state.resizeTimer
      );
    }

    if (state.orientationTimer) {
      global.clearTimeout(
        state.orientationTimer
      );
    }

    cancelAnimationFrame();
    removeAllListeners();
    disconnectObservers();

    state.context = null;
    state.data = null;

    state.overlay = null;
    state.panel = null;
    state.header = null;
    state.viewport = null;
    state.cameraRig = null;
    state.estate = null;
    state.heartRearShell = null;
    state.heartShell = null;
    state.facetLayer = null;
    state.corridorLayer = null;
    state.roomLayer = null;
    state.avatarLayer = null;
    state.arrivalSheet = null;
    state.footer = null;
    state.status = null;

    state.roomElements =
      Object.create(null);

    state.facetElements =
      Object.create(null);

    state.avatarMounts =
      Object.create(null);
  }

  var API = {
    contract:
      CONTRACT,

    version:
      VERSION,

    role:
      "control-2",

    mount:
      mount,

    open:
      open,

    close:
      close,

    showEstate:
      showEstate,

    focusRoom:
      focusRoom,

    roomArrived:
      roomArrived,

    setArrivalSheetVisible:
      setArrivalSheetVisible,

    reframe:
      reframe,

    handleCommand:
      handleCommand,

    measureUsableViewport:
      measureUsableViewport,

    calculateEstateComposition:
      calculateEstateComposition,

    calculateRoomComposition:
      calculateRoomComposition,

    sizeAvatarForRoom:
      sizeAvatarForRoom,

    getState:
      getState,

    destroy:
      destroy
  };

  global.HOUSE_CONTROL_PAD_CONTROL_2 =
    API;

  emit(
    READY_EVENT,
    {
      contract:
        CONTRACT,

      version:
        VERSION,

      role:
        "control-2",

      runtimeObject:
        "HOUSE_CONTROL_PAD_CONTROL_2"
    }
  );
})(window);
