// /assets/house-control-pad/house.avatar-life.js
// HOUSE_AVATAR_LIFE_SCHEDULER_TNT_v1
// Full-file replacement.
//
// AVATAR LIFE AUTHORITY ONLY.
//
// Owns:
// - resident idle scheduling
// - blink scheduling
// - slow-blink scheduling
// - double-blink scheduling
// - gesture scheduling
// - expression scheduling
// - travel-state timing
// - arrival-state timing
// - attention requests
// - speaking-state timing
// - resident activity suspension
// - reduced-motion behavior
// - visibility recovery
//
// Does not own:
// - avatar anatomy
// - avatar drawing
// - avatar permanent root placement
// - avatar permanent root scale
// - avatar safe-frame dimensions
// - room selection
// - camera framing
// - controller routes
// - guide authority
//
// Runtime dependencies:
//
// window.HOUSE_CONTROL_PAD_DATA
// window.HOUSE_CONTROL_PAD
//
// Public runtime object:
//
// window.HOUSE_AVATAR_LIFE
//
// Separation law:
//
// Data describes.
// Control Pad Control 1 coordinates.
// Control Pad Control 2 composes.
// Avatar Life schedules.
// Avatar CSS expresses.
//

(function bindHouseAvatarLife(global) {
  "use strict";

  var CONTRACT =
    "HOUSE_AVATAR_LIFE_SCHEDULER_TNT_v1";

  var VERSION =
    "1.0.0";

  var READY_EVENT =
    "house-control-pad:avatar-life-ready";

  var STATE_EVENT =
    "house-control-pad:avatar-state-changed";

  var GESTURE_EVENT =
    "house-control-pad:avatar-gesture";

  var EXPRESSION_EVENT =
    "house-control-pad:avatar-expression";

  var ATTENTION_EVENT =
    "house-control-pad:avatar-attention";

  var DEFAULT_IDLE_MIN_MS =
    4200;

  var DEFAULT_IDLE_MAX_MS =
    9200;

  var DEFAULT_BLINK_MIN_MS =
    2600;

  var DEFAULT_BLINK_MAX_MS =
    6200;

  var DEFAULT_GESTURE_DURATION_MS =
    1200;

  var DEFAULT_EXPRESSION_DURATION_MS =
    1800;

  var DEFAULT_TRAVEL_DURATION_MS =
    520;

  var DEFAULT_ARRIVAL_DURATION_MS =
    900;

  var DEFAULT_SPEAKING_DURATION_MS =
    2400;

  var state = {
    mounted: false,
    destroyed: false,
    active: true,
    documentVisible: true,
    reducedMotion: false,

    context: null,
    controller: null,
    panel: null,

    roomElements: Object.create(null),
    avatarMounts: Object.create(null),

    agents: Object.create(null),
    listeners: [],

    timers: Object.create(null),
    gestureTokens: Object.create(null),
    expressionTokens: Object.create(null),
    stateTokens: Object.create(null)
  };

  function getData() {
    return global.HOUSE_CONTROL_PAD_DATA || null;
  }

  function getController() {
    return global.HOUSE_CONTROL_PAD || null;
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

  function finiteNumber(value, fallback) {
    var number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function randomBetween(minimum, maximum) {
    var min =
      finiteNumber(
        minimum,
        0
      );

    var max =
      finiteNumber(
        maximum,
        min
      );

    if (max < min) {
      var swap = min;
      min = max;
      max = swap;
    }

    return (
      min +
      Math.random() *
      (max - min)
    );
  }

  function randomInteger(minimum, maximum) {
    return Math.floor(
      randomBetween(
        minimum,
        maximum + 1
      )
    );
  }

  function chooseRandom(items) {
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return null;
    }

    return items[
      randomInteger(
        0,
        items.length - 1
      )
    ];
  }

  function getAgent(agentId) {
    var data =
      getData();

    if (!data) {
      return null;
    }

    if (
      typeof data.getAgent === "function"
    ) {
      return data.getAgent(agentId);
    }

    return data.agents
      ? data.agents[agentId] || null
      : null;
  }

  function getControllerState() {
    var controller =
      state.controller ||
      getController();

    if (
      controller &&
      typeof controller.getState ===
        "function"
    ) {
      return controller.getState();
    }

    return {
      open: true,
      viewMode: "estate",
      currentRoomId: null,
      currentAgentId: null,
      traveling: false
    };
  }

  function normalizeContext(context) {
    context =
      context || {};

    state.context =
      context;

    state.controller =
      context.controller ||
      getController();

    state.panel =
      context.panel ||
      state.panel;

    state.roomElements =
      context.roomElements ||
      context.rooms ||
      state.roomElements;

    state.avatarMounts =
      context.avatarMounts ||
      state.avatarMounts;
  }

  function detectReducedMotion() {
    state.reducedMotion =
      Boolean(
        global.matchMedia &&
        global.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      );
  }

  function mount(context) {
    if (state.destroyed) {
      return false;
    }

    normalizeContext(context);
    detectReducedMotion();

    if (!state.panel) {
      return false;
    }

    discoverAgents();

    if (!state.mounted) {
      bindRuntimeEvents();
      state.mounted = true;
    }

    state.active = true;

    startAllResidents();

    emit(
      READY_EVENT,
      {
        contract: CONTRACT,
        version: VERSION,
        role: "avatar-life",
        residentCount:
          Object.keys(
            state.agents
          ).length
      }
    );

    return true;
  }

  function bindRuntimeEvents() {
    listen(
      global.document,
      "visibilitychange",
      handleVisibilityChange
    );

    listen(
      global,
      "house-control-pad:open",
      handleControllerOpen
    );

    listen(
      global,
      "house-control-pad:close",
      handleControllerClose
    );

    listen(
      global,
      "house-control-pad:room-entering",
      handleRoomEntering
    );

    listen(
      global,
      "house-control-pad:room-arrived",
      handleRoomArrived
    );

    listen(
      global,
      "house-control-pad:guide-request",
      handleGuideRequest
    );

    if (global.matchMedia) {
      var motionQuery =
        global.matchMedia(
          "(prefers-reduced-motion: reduce)"
        );

      if (
        typeof motionQuery.addEventListener ===
          "function"
      ) {
        listen(
          motionQuery,
          "change",
          handleMotionPreferenceChange
        );
      }
    }
  }

  function handleVisibilityChange() {
    state.documentVisible =
      global.document.visibilityState !==
      "hidden";

    if (!state.documentVisible) {
      suspendAllResidents();
      return;
    }

    if (state.active) {
      startAllResidents();
    }
  }

  function handleMotionPreferenceChange(event) {
    state.reducedMotion =
      Boolean(event.matches);

    restartAllResidents();
  }

  function handleControllerOpen() {
    state.active = true;
    startAllResidents();
  }

  function handleControllerClose() {
    state.active = false;
    suspendAllResidents();
  }

  function handleRoomEntering(event) {
    var detail =
      event && event.detail
        ? event.detail
        : {};

    if (
      detail.agentId &&
      detail.roomId
    ) {
      travel(
        detail.agentId,
        detail.roomId
      );
    }
  }

  function handleRoomArrived(event) {
    var detail =
      event && event.detail
        ? event.detail
        : {};

    if (
      detail.agentId &&
      detail.roomId
    ) {
      arrive(
        detail.agentId,
        detail.roomId
      );
    }
  }

  function handleGuideRequest(event) {
    var detail =
      event && event.detail
        ? event.detail
        : {};

    if (
      detail.agentId &&
      detail.roomId
    ) {
      requestAttention(
        detail.agentId,
        detail.roomId
      );
    }
  }

  function discoverAgents() {
    var data =
      getData();

    if (
      !data ||
      !data.agents
    ) {
      return;
    }

    Object.keys(
      data.agents
    ).forEach(
      function discoverAgent(agentId) {
        var agent =
          data.agents[agentId];

        var resident =
          state.panel.querySelector(
            '[data-house-avatar]' +
            '[data-agent-id="' +
            escapeSelector(agentId) +
            '"]'
          );

        if (!resident) {
          return;
        }

        state.agents[agentId] = {
          id: agentId,
          config: agent,
          element: resident,
          roomId:
            resident.getAttribute(
              "data-house-room"
            ) ||
            agent.homeRoom,
          currentState:
            resident.getAttribute(
              "data-avatar-state"
            ) ||
            "resting",
          currentGesture: null,
          currentExpression: null,
          suspended: false
        };
      }
    );
  }

  function startAllResidents() {
    if (
      !state.active ||
      !state.documentVisible
    ) {
      return;
    }

    Object.keys(
      state.agents
    ).forEach(
      function startResident(agentId) {
        startResidentLife(
          agentId
        );
      }
    );
  }

  function suspendAllResidents() {
    Object.keys(
      state.agents
    ).forEach(
      function suspendResident(agentId) {
        suspendResidentLife(
          agentId
        );
      }
    );
  }

  function restartAllResidents() {
    suspendAllResidents();

    if (
      state.active &&
      state.documentVisible
    ) {
      startAllResidents();
    }
  }

  function startResidentLife(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return;
    }

    record.suspended = false;

    scheduleBlink(
      agentId
    );

    if (!state.reducedMotion) {
      scheduleIdleGesture(
        agentId
      );
    }
  }

  function suspendResidentLife(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return;
    }

    record.suspended = true;

    clearTimer(
      agentId,
      "blink"
    );

    clearTimer(
      agentId,
      "idle"
    );

    clearTimer(
      agentId,
      "gesture"
    );

    clearTimer(
      agentId,
      "expression"
    );

    clearTimer(
      agentId,
      "state"
    );

    clearTransientPresentation(
      agentId
    );
  }

  function scheduleBlink(agentId) {
    var record =
      state.agents[agentId];

    if (
      !record ||
      record.suspended ||
      !state.active ||
      !state.documentVisible
    ) {
      return;
    }

    clearTimer(
      agentId,
      "blink"
    );

    var life =
      getLifeProfile(
        record.config
      );

    var blinkRange =
      life.blinkRangeMs || [
        DEFAULT_BLINK_MIN_MS,
        DEFAULT_BLINK_MAX_MS
      ];

    var delay =
      randomBetween(
        blinkRange[0],
        blinkRange[1]
      );

    setTimer(
      agentId,
      "blink",
      global.setTimeout(
        function executeScheduledBlink() {
          if (
            record.suspended ||
            !state.active ||
            !state.documentVisible
          ) {
            return;
          }

          performBlink(agentId);

          scheduleBlink(
            agentId
          );
        },
        delay
      )
    );
  }

  function performBlink(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return;
    }

    var life =
      getLifeProfile(
        record.config
      );

    var roll =
      Math.random();

    var slowBlinkChance =
      clamp(
        finiteNumber(
          life.slowBlinkChance,
          0.12
        ),
        0,
        1
      );

    var doubleBlinkChance =
      clamp(
        finiteNumber(
          life.doubleBlinkChance,
          0.08
        ),
        0,
        1
      );

    if (
      roll <
      doubleBlinkChance
    ) {
      applyTemporaryAttribute(
        record.element,
        "data-double-blink",
        "true",
        430
      );

      return;
    }

    if (
      roll <
      doubleBlinkChance +
      slowBlinkChance
    ) {
      applyTemporaryAttribute(
        record.element,
        "data-slow-blink",
        "true",
        310
      );

      return;
    }

    applyTemporaryAttribute(
      record.element,
      "data-blink",
      "true",
      140
    );
  }

  function scheduleIdleGesture(agentId) {
    var record =
      state.agents[agentId];

    if (
      !record ||
      record.suspended ||
      state.reducedMotion ||
      !state.active ||
      !state.documentVisible
    ) {
      return;
    }

    clearTimer(
      agentId,
      "idle"
    );

    var life =
      getLifeProfile(
        record.config
      );

    var idleRange =
      life.idleRangeMs || [
        DEFAULT_IDLE_MIN_MS,
        DEFAULT_IDLE_MAX_MS
      ];

    var delay =
      randomBetween(
        idleRange[0],
        idleRange[1]
      );

    setTimer(
      agentId,
      "idle",
      global.setTimeout(
        function executeIdleGesture() {
          if (
            record.suspended ||
            state.reducedMotion ||
            !state.active ||
            !state.documentVisible
          ) {
            return;
          }

          if (
            mayPerformIdleGesture(
              agentId
            )
          ) {
            performIdleGesture(
              agentId
            );
          }

          scheduleIdleGesture(
            agentId
          );
        },
        delay
      )
    );
  }

  function mayPerformIdleGesture(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return false;
    }

    var controllerState =
      getControllerState();

    if (
      controllerState.traveling &&
      controllerState.currentAgentId ===
        agentId
    ) {
      return false;
    }

    if (
      record.currentState ===
        "speaking" ||
      record.currentState ===
        "traveling" ||
      record.currentState ===
        "arriving"
    ) {
      return false;
    }

    return true;
  }

  function performIdleGesture(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return;
    }

    var life =
      getLifeProfile(
        record.config
      );

    var gestures =
      life.idleGestures ||
      life.gestures ||
      getDefaultGestures(
        agentId
      );

    var gesture =
      chooseRandom(
        gestures
      );

    if (!gesture) {
      return;
    }

    performGesture(
      agentId,
      gesture,
      finiteNumber(
        life.gestureDurationMs,
        DEFAULT_GESTURE_DURATION_MS
      )
    );
  }

  function getLifeProfile(agent) {
    if (!agent) {
      return {};
    }

    return (
      agent.life ||
      agent.lifeProfile ||
      agent.behavior ||
      {}
    );
  }

  function getDefaultGestures(agentId) {
    var defaults = {
      jeeves: [
        "small-head-move",
        "monocle-adjust",
        "cuff-correction",
        "jacket-smooth"
      ],

      auren: [
        "shoulder-shift",
        "gear-adjust",
        "tool-check",
        "maker-stretch"
      ],

      soren: [
        "slow-head-tilt",
        "lens-adjust",
        "seal-inspection",
        "brief-eye-rest"
      ],

      elara: [
        "slow-head-tilt",
        "hair-adjust",
        "signal-pulse",
        "soft-stretch"
      ]
    };

    return defaults[agentId] || [
      "small-head-move",
      "shoulder-shift",
      "posture-reset"
    ];
  }

  function performGesture(
    agentId,
    gesture,
    duration
  ) {
    var record =
      state.agents[agentId];

    if (
      !record ||
      !gesture
    ) {
      return false;
    }

    duration =
      finiteNumber(
        duration,
        DEFAULT_GESTURE_DURATION_MS
      );

    var token =
      incrementToken(
        state.gestureTokens,
        agentId
      );

    clearTimer(
      agentId,
      "gesture"
    );

    record.currentGesture =
      gesture;

    record.element.setAttribute(
      "data-gesture",
      gesture
    );

    emit(
      GESTURE_EVENT,
      {
        contract: CONTRACT,
        agentId: agentId,
        roomId: record.roomId,
        gesture: gesture,
        duration: duration
      }
    );

    setTimer(
      agentId,
      "gesture",
      global.setTimeout(
        function clearGestureAfterDuration() {
          if (
            state.gestureTokens[
              agentId
            ] !== token
          ) {
            return;
          }

          clearGesture(
            agentId
          );
        },
        state.reducedMotion
          ? 80
          : duration
      )
    );

    return true;
  }

  function clearGesture(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return;
    }

    record.currentGesture =
      null;

    record.element.removeAttribute(
      "data-gesture"
    );

    clearTimer(
      agentId,
      "gesture"
    );
  }

  function setExpression(
    agentId,
    expression,
    duration
  ) {
    var record =
      state.agents[agentId];

    if (
      !record ||
      !expression
    ) {
      return false;
    }

    duration =
      finiteNumber(
        duration,
        DEFAULT_EXPRESSION_DURATION_MS
      );

    var token =
      incrementToken(
        state.expressionTokens,
        agentId
      );

    clearTimer(
      agentId,
      "expression"
    );

    record.currentExpression =
      expression;

    record.element.setAttribute(
      "data-expression",
      expression
    );

    emit(
      EXPRESSION_EVENT,
      {
        contract: CONTRACT,
        agentId: agentId,
        roomId: record.roomId,
        expression: expression,
        duration: duration
      }
    );

    if (duration > 0) {
      setTimer(
        agentId,
        "expression",
        global.setTimeout(
          function clearExpressionAfterDuration() {
            if (
              state.expressionTokens[
                agentId
              ] !== token
            ) {
              return;
            }

            clearExpression(
              agentId
            );
          },
          state.reducedMotion
            ? 100
            : duration
        )
      );
    }

    return true;
  }

  function clearExpression(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return;
    }

    record.currentExpression =
      null;

    record.element.removeAttribute(
      "data-expression"
    );

    clearTimer(
      agentId,
      "expression"
    );
  }

  function setState(
    agentId,
    nextState,
    options
  ) {
    var record =
      state.agents[agentId];

    if (
      !record ||
      !nextState
    ) {
      return false;
    }

    options =
      options || {};

    if (options.roomId) {
      record.roomId =
        options.roomId;

      record.element.setAttribute(
        "data-house-room",
        options.roomId
      );
    }

    var previousState =
      record.currentState;

    record.currentState =
      nextState;

    record.element.setAttribute(
      "data-avatar-state",
      nextState
    );

    emit(
      STATE_EVENT,
      {
        contract: CONTRACT,
        agentId: agentId,
        roomId: record.roomId,
        previousState:
          previousState,
        state:
          nextState
      }
    );

    if (
      finiteNumber(
        options.duration,
        0
      ) > 0
    ) {
      scheduleStateReset(
        agentId,
        options.duration,
        options.returnState ||
        "resting"
      );
    }

    return true;
  }

  function scheduleStateReset(
    agentId,
    duration,
    returnState
  ) {
    var token =
      incrementToken(
        state.stateTokens,
        agentId
      );

    clearTimer(
      agentId,
      "state"
    );

    setTimer(
      agentId,
      "state",
      global.setTimeout(
        function resetResidentState() {
          if (
            state.stateTokens[
              agentId
            ] !== token
          ) {
            return;
          }

          setState(
            agentId,
            returnState || "resting"
          );
        },
        state.reducedMotion
          ? 80
          : duration
      )
    );
  }

  function travel(agentId, roomId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return false;
    }

    clearGesture(
      agentId
    );

    clearExpression(
      agentId
    );

    setState(
      agentId,
      "traveling",
      {
        roomId: roomId
      }
    );

    performGesture(
      agentId,
      getTravelGesture(agentId),
      DEFAULT_TRAVEL_DURATION_MS
    );

    return true;
  }

  function arrive(agentId, roomId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return false;
    }

    setState(
      agentId,
      "arriving",
      {
        roomId: roomId,
        duration:
          DEFAULT_ARRIVAL_DURATION_MS,
        returnState:
          "focused"
      }
    );

    setExpression(
      agentId,
      getArrivalExpression(
        agentId
      ),
      DEFAULT_ARRIVAL_DURATION_MS +
      400
    );

    performGesture(
      agentId,
      getArrivalGesture(
        agentId
      ),
      DEFAULT_ARRIVAL_DURATION_MS +
      300
    );

    return true;
  }

  function requestAttention(agentId, roomId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return false;
    }

    record.roomId =
      roomId ||
      record.roomId;

    clearGesture(
      agentId
    );

    setState(
      agentId,
      "focused",
      {
        roomId:
          record.roomId
      }
    );

    setExpression(
      agentId,
      getAttentionExpression(
        agentId
      ),
      2200
    );

    performGesture(
      agentId,
      getAttentionGesture(
        agentId
      ),
      1500
    );

    emit(
      ATTENTION_EVENT,
      {
        contract: CONTRACT,
        agentId: agentId,
        roomId: record.roomId
      }
    );

    return true;
  }

  function speak(
    agentId,
    duration,
    options
  ) {
    var record =
      state.agents[agentId];

    if (!record) {
      return false;
    }

    options =
      options || {};

    duration =
      finiteNumber(
        duration,
        DEFAULT_SPEAKING_DURATION_MS
      );

    setState(
      agentId,
      "speaking",
      {
        roomId:
          options.roomId ||
          record.roomId,
        duration:
          duration,
        returnState:
          options.returnState ||
          "focused"
      }
    );

    setExpression(
      agentId,
      options.expression ||
      "speaking",
      duration
    );

    if (options.gesture) {
      performGesture(
        agentId,
        options.gesture,
        duration
      );
    }

    return true;
  }

  function rest(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return false;
    }

    clearTransientPresentation(
      agentId
    );

    setState(
      agentId,
      "resting"
    );

    return true;
  }

  function focus(agentId, roomId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return false;
    }

    setState(
      agentId,
      "focused",
      {
        roomId:
          roomId ||
          record.roomId
      }
    );

    return true;
  }

  function getTravelGesture(agentId) {
    var gestures = {
      jeeves:
        "posture-reset",

      auren:
        "shoulder-shift",

      soren:
        "slow-head-tilt",

      elara:
        "signal-pulse"
    };

    return gestures[agentId] ||
      "posture-reset";
  }

  function getArrivalGesture(agentId) {
    var gestures = {
      jeeves:
        "formal-welcome",

      auren:
        "tool-ready",

      soren:
        "diagnostic-attend",

      elara:
        "signal-greeting"
    };

    return gestures[agentId] ||
      "small-head-move";
  }

  function getArrivalExpression(agentId) {
    var expressions = {
      jeeves:
        "attentive-formal",

      auren:
        "ready-practical",

      soren:
        "diagnostic-attention",

      elara:
        "warm-attention"
    };

    return expressions[agentId] ||
      "warm-attention";
  }

  function getAttentionGesture(agentId) {
    var gestures = {
      jeeves:
        "formal-reference",

      auren:
        "teaching-ready",

      soren:
        "diagnostic-attend",

      elara:
        "signal-illumination"
    };

    return gestures[agentId] ||
      "small-head-move";
  }

  function getAttentionExpression(agentId) {
    var expressions = {
      jeeves:
        "attentive-formal",

      auren:
        "ready-practical",

      soren:
        "diagnostic-attention",

      elara:
        "warm-attention"
    };

    return expressions[agentId] ||
      "warm-attention";
  }

  function clearTransientPresentation(agentId) {
    clearGesture(
      agentId
    );

    clearExpression(
      agentId
    );

    var record =
      state.agents[agentId];

    if (!record) {
      return;
    }

    record.element.removeAttribute(
      "data-blink"
    );

    record.element.removeAttribute(
      "data-slow-blink"
    );

    record.element.removeAttribute(
      "data-double-blink"
    );
  }

  function applyTemporaryAttribute(
    element,
    name,
    value,
    duration
  ) {
    if (!element) {
      return;
    }

    element.setAttribute(
      name,
      value
    );

    global.setTimeout(
      function removeTemporaryAttribute() {
        if (element) {
          element.removeAttribute(
            name
          );
        }
      },
      state.reducedMotion
        ? 60
        : duration
    );
  }

  function incrementToken(collection, key) {
    collection[key] =
      finiteNumber(
        collection[key],
        0
      ) + 1;

    return collection[key];
  }

  function ensureTimerRecord(agentId) {
    if (!state.timers[agentId]) {
      state.timers[agentId] = {
        blink: null,
        idle: null,
        gesture: null,
        expression: null,
        state: null
      };
    }

    return state.timers[agentId];
  }

  function setTimer(agentId, timerName, timerId) {
    var record =
      ensureTimerRecord(
        agentId
      );

    record[timerName] =
      timerId;
  }

  function clearTimer(agentId, timerName) {
    var record =
      state.timers[agentId];

    if (
      !record ||
      !record[timerName]
    ) {
      return;
    }

    global.clearTimeout(
      record[timerName]
    );

    record[timerName] =
      null;
  }

  function clearAllTimers() {
    Object.keys(
      state.timers
    ).forEach(
      function clearResidentTimers(agentId) {
        [
          "blink",
          "idle",
          "gesture",
          "expression",
          "state"
        ].forEach(
          function clearNamedTimer(timerName) {
            clearTimer(
              agentId,
              timerName
            );
          }
        );
      }
    );
  }

  function getResidentState(agentId) {
    var record =
      state.agents[agentId];

    if (!record) {
      return null;
    }

    return {
      id: record.id,
      roomId: record.roomId,
      state: record.currentState,
      gesture: record.currentGesture,
      expression:
        record.currentExpression,
      suspended:
        record.suspended
    };
  }

  function getState() {
    var residents =
      Object.create(null);

    Object.keys(
      state.agents
    ).forEach(
      function collectResidentState(agentId) {
        residents[agentId] =
          getResidentState(
            agentId
          );
      }
    );

    return {
      contract: CONTRACT,
      version: VERSION,
      mounted: state.mounted,
      destroyed: state.destroyed,
      active: state.active,
      documentVisible:
        state.documentVisible,
      reducedMotion:
        state.reducedMotion,
      residents: residents
    };
  }

  function destroy() {
    if (state.destroyed) {
      return;
    }

    state.active = false;
    state.mounted = false;
    state.destroyed = true;

    clearAllTimers();
    removeAllListeners();

    Object.keys(
      state.agents
    ).forEach(
      function clearResident(agentId) {
        clearTransientPresentation(
          agentId
        );
      }
    );

    state.context = null;
    state.controller = null;
    state.panel = null;

    state.roomElements =
      Object.create(null);

    state.avatarMounts =
      Object.create(null);

    state.agents =
      Object.create(null);

    state.timers =
      Object.create(null);

    state.gestureTokens =
      Object.create(null);

    state.expressionTokens =
      Object.create(null);

    state.stateTokens =
      Object.create(null);
  }

  function escapeSelector(value) {
    if (
      global.CSS &&
      typeof global.CSS.escape ===
        "function"
    ) {
      return global.CSS.escape(
        String(value)
      );
    }

    return String(value).replace(
      /["\\]/g,
      "\\$&"
    );
  }

  var API = {
    contract: CONTRACT,
    version: VERSION,

    role:
      "avatar-life",

    mount: mount,

    startAllResidents:
      startAllResidents,

    suspendAllResidents:
      suspendAllResidents,

    restartAllResidents:
      restartAllResidents,

    setState:
      setState,

    performGesture:
      performGesture,

    clearGesture:
      clearGesture,

    setExpression:
      setExpression,

    clearExpression:
      clearExpression,

    travel:
      travel,

    arrive:
      arrive,

    requestAttention:
      requestAttention,

    speak:
      speak,

    rest:
      rest,

    focus:
      focus,

    getResidentState:
      getResidentState,

    getState:
      getState,

    destroy:
      destroy
  };

  global.HOUSE_AVATAR_LIFE =
    API;

  emit(
    READY_EVENT,
    {
      contract: CONTRACT,
      version: VERSION,
      role: "avatar-life",
      runtimeObject:
        "HOUSE_AVATAR_LIFE"
    }
  );
})(window);
