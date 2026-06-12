// /assets/house-control-pad/house.avatar-life.js
// HOUSE_AVATAR_LIFE_RUNTIME_TNT_v1
// Full-file addition.
//
// Required load order:
//
// 1. /assets/house-control-pad/house.control-pad.data.js
// 2. /assets/house-control-pad/house.control-pad.js
// 3. /assets/house-control-pad/house.avatar-life.js
//
// Required avatar presentation:
//
// /assets/house-control-pad/house.avatars.css
//
// Five-layer separation:
//
// Data describes.
// House CSS renders architecture.
// Controller coordinates.
// Avatar life schedules.
// Avatar CSS expresses the residents.
//
// This file owns:
//
// - avatar runtime state
// - independent blink scheduling
// - blink type selection
// - inactivity tracking
// - idle-stage calculation
// - personality-specific gesture scheduling
// - rare yawn and stretch eligibility
// - large-gesture exclusivity
// - state-priority enforcement
// - room-aware reactions
// - camera reaction coordination
// - travel interruption
// - arrival behavior
// - reduced-motion behavior
// - timer ownership
// - lifecycle cleanup
//
// This file does not own:
//
// - room content
// - room geometry
// - corridor definitions
// - route execution
// - pathfinding
// - camera calculations
// - guide travel interpolation
// - DOM construction
// - static architecture
// - avatar anatomy styling
// - animation keyframes
//
// Public authority:
//
// window.HOUSE_AVATAR_LIFE
//
// Canonical residents:
//
// - Jeeves
// - Auren
// - Soren
// - Elara
//

(function bindHouseAvatarLifeRuntime(global) {
  "use strict";

  var CONTRACT =
    "HOUSE_AVATAR_LIFE_RUNTIME_TNT_v1";

  var DATA = global.HOUSE_CONTROL_PAD_DATA;

  if (!DATA) {
    reportFatal(
      "HOUSE_CONTROL_PAD_DATA is unavailable. Load " +
        "/assets/house-control-pad/house.control-pad.data.js " +
        "before house.avatar-life.js."
    );

    return;
  }

  var AGENTS = DATA.agents;
  var ROOMS = DATA.rooms;
  var TIMING = DATA.timing;
  var IDLE_STAGE = DATA.idleStages;
  var STATE_PRIORITY =
    DATA.avatarStatePriority;

  var LIFE = {
    initialized: false,
    enabled: true,
    running: false,
    destroyed: false,
    reducedMotion: false,

    bridge: null,

    lastInteractionAt: Date.now(),
    lastInteractionRecordedAt: 0,
    idleStage: IDLE_STAGE.ACTIVE,

    activeLargeGestureAgent: null,
    lastLargeGestureAt: 0,

    evaluationTimer: null,
    globalTimers: [],

    interactionBound: false,
    interactionHandlers: [],

    agentRuntime: {}
  };

  function reportFatal(message) {
    try {
      console.error(
        "[House Avatar Life]",
        message
      );
    } catch (error) {
      // No-op.
    }

    emit(
      "house-avatar-life:error",
      {
        fatal: true,
        message: message
      }
    );
  }

  function emit(eventName, detail) {
    try {
      global.dispatchEvent(
        new CustomEvent(eventName, {
          detail: Object.assign(
            {
              contract: CONTRACT
            },
            detail || {}
          )
        })
      );
    } catch (error) {
      // No-op.
    }

    if (
      LIFE.bridge &&
      typeof LIFE.bridge.emit === "function"
    ) {
      try {
        LIFE.bridge.emit(
          eventName,
          Object.assign(
            {
              avatarLifeContract:
                CONTRACT
            },
            detail || {}
          )
        );
      } catch (error) {
        // No-op.
      }
    }
  }

  function agentExists(agentId) {
    return Boolean(
      typeof agentId === "string" &&
      Object.prototype.hasOwnProperty.call(
        AGENTS,
        agentId
      )
    );
  }

  function getAgent(agentId) {
    if (agentExists(agentId)) {
      return AGENTS[agentId];
    }

    return AGENTS.jeeves;
  }

  function getRoom(roomId) {
    if (
      typeof roomId === "string" &&
      Object.prototype.hasOwnProperty.call(
        ROOMS,
        roomId
      )
    ) {
      return ROOMS[roomId];
    }

    return ROOMS[DATA.defaultRoomId];
  }

  function randomBetween(minimum, maximum) {
    return Math.round(
      minimum +
      Math.random() *
        (maximum - minimum)
    );
  }

  function chance(probability) {
    return Math.random() < probability;
  }

  function choose(list) {
    if (
      !Array.isArray(list) ||
      !list.length
    ) {
      return null;
    }

    return list[
      Math.floor(
        Math.random() * list.length
      )
    ];
  }

  function now() {
    return Date.now();
  }

  function clearTimer(timerId) {
    if (!timerId) {
      return;
    }

    global.clearTimeout(timerId);
    global.clearInterval(timerId);
  }

  function removeTimerFromList(
    timerId,
    timerList
  ) {
    var index =
      timerList.indexOf(timerId);

    if (index !== -1) {
      timerList.splice(index, 1);
    }
  }

  function scheduleTimeout(
    callback,
    delay,
    ownerList
  ) {
    var timerList =
      ownerList || LIFE.globalTimers;

    var timerId =
      global.setTimeout(
        function executeScheduledTimeout() {
          removeTimerFromList(
            timerId,
            timerList
          );

          callback();
        },
        Math.max(0, delay)
      );

    timerList.push(timerId);

    return timerId;
  }

  function clearTimerList(timerList) {
    timerList.forEach(
      function cancelTimer(timerId) {
        clearTimer(timerId);
      }
    );

    timerList.length = 0;
  }

  function getRuntime(agentId) {
    if (!LIFE.agentRuntime[agentId]) {
      LIFE.agentRuntime[agentId] = {
        agentId: agentId,

        primaryState: "resting",
        previousState: null,

        gesture: null,
        expression: null,

        blinking: false,
        blinkType: null,

        stateToken: 0,
        blinkToken: 0,
        gestureToken: 0,

        blinkTimer: null,
        gestureTimer: null,
        stateTimer: null,

        timers: [],

        lastBlinkAt: 0,
        lastGestureAt: 0,
        lastYawnAt: 0,
        lastTravelAt: 0,
        lastArrivalAt: 0,

        gestureCooldowns: {},

        cameraFocused: false,
        roomFocused: false,
        traveling: false,
        arriving: false,
        speaking: false,
        disabled: false,

        currentRoomId:
          getAgent(agentId).homeRoom
      };
    }

    return LIFE.agentRuntime[agentId];
  }

  function getAvatarElement(agentId) {
    if (
      !LIFE.bridge ||
      typeof LIFE.bridge.getAvatarElement !==
        "function"
    ) {
      return null;
    }

    return LIFE.bridge.getAvatarElement(
      agentId
    );
  }

  function setAvatarDOMState(
    agentId,
    state
  ) {
    if (
      LIFE.bridge &&
      typeof LIFE.bridge.setAvatarDOMState ===
        "function"
    ) {
      LIFE.bridge.setAvatarDOMState(
        agentId,
        state
      );

      return;
    }

    var avatar =
      getAvatarElement(agentId);

    if (!avatar) {
      return;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        state,
        "primaryState"
      )
    ) {
      avatar.setAttribute(
        "data-avatar-state",
        state.primaryState || "resting"
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        state,
        "gesture"
      )
    ) {
      avatar.setAttribute(
        "data-avatar-gesture",
        state.gesture || ""
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        state,
        "expression"
      )
    ) {
      avatar.setAttribute(
        "data-avatar-expression",
        state.expression || ""
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        state,
        "blinking"
      )
    ) {
      avatar.setAttribute(
        "data-blinking",
        state.blinking
          ? "true"
          : "false"
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        state,
        "blinkType"
      )
    ) {
      avatar.setAttribute(
        "data-blink-type",
        state.blinkType || ""
      );
    }
  }

  function syncRuntimeToDOM(agentId) {
    var runtime =
      getRuntime(agentId);

    setAvatarDOMState(
      agentId,
      {
        primaryState:
          runtime.primaryState,
        gesture:
          runtime.gesture,
        expression:
          runtime.expression,
        blinking:
          runtime.blinking,
        blinkType:
          runtime.blinkType
      }
    );
  }

  function getPriority(stateName) {
    if (
      Object.prototype.hasOwnProperty.call(
        STATE_PRIORITY,
        stateName
      )
    ) {
      return STATE_PRIORITY[stateName];
    }

    return 0;
  }

  function canOverrideState(
    currentState,
    nextState
  ) {
    return (
      getPriority(nextState) >=
      getPriority(currentState)
    );
  }

  function deriveBaselineState(agentId) {
    var runtime =
      getRuntime(agentId);

    if (
      !LIFE.enabled ||
      runtime.disabled
    ) {
      return "disabled";
    }

    if (runtime.traveling) {
      return "traveling";
    }

    if (runtime.arriving) {
      return "arriving";
    }

    if (runtime.speaking) {
      return "speaking";
    }

    if (
      runtime.cameraFocused ||
      runtime.roomFocused
    ) {
      return "focused";
    }

    return "resting";
  }

  function setPrimaryState(
    agentId,
    nextState,
    metadata
  ) {
    metadata = metadata || {};

    var runtime =
      getRuntime(agentId);

    var currentState =
      runtime.primaryState ||
      "resting";

    if (
      metadata.force !== true &&
      !canOverrideState(
        currentState,
        nextState
      )
    ) {
      return false;
    }

    runtime.stateToken += 1;
    runtime.previousState =
      currentState;

    runtime.primaryState =
      nextState;

    runtime.gesture =
      metadata.gesture || null;

    runtime.expression =
      metadata.expression || null;

    syncRuntimeToDOM(agentId);

    emit(
      "house-avatar-life:state-change",
      {
        agentId: agentId,
        previousState:
          currentState,
        primaryState:
          nextState,
        gesture:
          runtime.gesture,
        expression:
          runtime.expression
      }
    );

    return true;
  }

  function releasePrimaryState(
    agentId,
    expectedState
  ) {
    var runtime =
      getRuntime(agentId);

    if (
      expectedState &&
      runtime.primaryState !==
        expectedState
    ) {
      return false;
    }

    var baseline =
      deriveBaselineState(agentId);

    runtime.primaryState =
      baseline;

    runtime.gesture = null;
    runtime.expression = null;
    runtime.stateToken += 1;

    syncRuntimeToDOM(agentId);

    return true;
  }

  function clearAgentTimers(agentId) {
    var runtime =
      getRuntime(agentId);

    clearTimer(
      runtime.blinkTimer
    );

    clearTimer(
      runtime.gestureTimer
    );

    clearTimer(
      runtime.stateTimer
    );

    runtime.blinkTimer = null;
    runtime.gestureTimer = null;
    runtime.stateTimer = null;

    clearTimerList(
      runtime.timers
    );
  }

  function chooseBlinkType(agent) {
    if (
      chance(
        agent.blinkProfile
          .doubleBlinkChance
      )
    ) {
      return "double";
    }

    if (
      chance(
        agent.blinkProfile
          .slowBlinkChance
      )
    ) {
      return "slow";
    }

    return "single";
  }

  function blinkAllowed(agentId) {
    var runtime =
      getRuntime(agentId);

    if (
      !LIFE.running ||
      !LIFE.enabled ||
      LIFE.reducedMotion ||
      runtime.disabled
    ) {
      return false;
    }

    if (
      runtime.primaryState ===
        "traveling" ||
      runtime.primaryState ===
        "arriving" ||
      runtime.primaryState ===
        "gesturing" ||
      runtime.primaryState ===
        "sleepy" ||
      runtime.primaryState ===
        "disabled"
    ) {
      return false;
    }

    return true;
  }

  function scheduleNextBlink(
    agentId,
    options
  ) {
    options = options || {};

    if (!agentExists(agentId)) {
      return false;
    }

    var runtime =
      getRuntime(agentId);

    var agent =
      getAgent(agentId);

    clearTimer(
      runtime.blinkTimer
    );

    runtime.blinkTimer = null;

    if (
      !LIFE.running ||
      !LIFE.enabled ||
      LIFE.reducedMotion ||
      runtime.disabled
    ) {
      return false;
    }

    var delay =
      options.initial
        ? agent.blinkProfile
            .initialOffset
        : randomBetween(
            agent.blinkProfile.min,
            agent.blinkProfile.max
          );

    runtime.blinkTimer =
      scheduleTimeout(
        function executeBlink() {
          runtime.blinkTimer = null;

          if (
            !blinkAllowed(agentId)
          ) {
            scheduleNextBlink(
              agentId
            );

            return;
          }

          performBlink(
            agentId,
            chooseBlinkType(agent)
          );
        },
        delay,
        runtime.timers
      );

    return true;
  }

  function performBlink(
    agentId,
    blinkType
  ) {
    if (
      !agentExists(agentId) ||
      !blinkAllowed(agentId)
    ) {
      return false;
    }

    var runtime =
      getRuntime(agentId);

    runtime.blinkToken += 1;

    var token =
      runtime.blinkToken;

    runtime.blinking = true;
    runtime.blinkType =
      blinkType || "single";

    runtime.lastBlinkAt =
      now();

    syncRuntimeToDOM(agentId);

    emit(
      "house-avatar-life:blink",
      {
        agentId: agentId,
        blinkType:
          runtime.blinkType
      }
    );

    var duration =
      runtime.blinkType === "slow"
        ? TIMING.BLINK_SLOW_MS
        : TIMING.BLINK_SINGLE_MS;

    scheduleTimeout(
      function finishFirstBlink() {
        if (
          token !==
          runtime.blinkToken
        ) {
          return;
        }

        runtime.blinking = false;
        runtime.blinkType = null;

        syncRuntimeToDOM(
          agentId
        );

        if (
          blinkType === "double"
        ) {
          scheduleTimeout(
            function beginSecondBlink() {
              if (
                token !==
                runtime.blinkToken
              ) {
                return;
              }

              runtime.blinking = true;
              runtime.blinkType =
                "single";

              syncRuntimeToDOM(
                agentId
              );

              scheduleTimeout(
                function finishSecondBlink() {
                  if (
                    token !==
                    runtime.blinkToken
                  ) {
                    return;
                  }

                  runtime.blinking =
                    false;

                  runtime.blinkType =
                    null;

                  syncRuntimeToDOM(
                    agentId
                  );

                  scheduleNextBlink(
                    agentId
                  );
                },
                TIMING.BLINK_SINGLE_MS,
                runtime.timers
              );
            },
            TIMING.BLINK_DOUBLE_GAP_MS,
            runtime.timers
          );

          return;
        }

        scheduleNextBlink(
          agentId
        );
      },
      duration,
      runtime.timers
    );

    return true;
  }

  function cancelBlink(agentId) {
    var runtime =
      getRuntime(agentId);

    runtime.blinkToken += 1;

    clearTimer(
      runtime.blinkTimer
    );

    runtime.blinkTimer = null;
    runtime.blinking = false;
    runtime.blinkType = null;

    syncRuntimeToDOM(agentId);
  }

  function deriveIdleStage() {
    var idleDuration =
      now() -
      LIFE.lastInteractionAt;

    if (idleDuration < 20000) {
      return IDLE_STAGE.ACTIVE;
    }

    if (idleDuration < 45000) {
      return IDLE_STAGE.SETTLED;
    }

    if (idleDuration < 90000) {
      return IDLE_STAGE.IDLE;
    }

    return IDLE_STAGE.LONG_IDLE;
  }

  function updateIdleStage() {
    var previousStage =
      LIFE.idleStage;

    LIFE.idleStage =
      deriveIdleStage();

    if (
      previousStage !==
      LIFE.idleStage
    ) {
      emit(
        "house-avatar-life:idle-stage",
        {
          previousStage:
            previousStage,
          idleStage:
            LIFE.idleStage,
          idleDuration:
            now() -
            LIFE.lastInteractionAt
        }
      );
    }
  }

  function recordInteraction(metadata) {
    metadata = metadata || {};

    var currentTime = now();

    if (
      currentTime -
        LIFE.lastInteractionRecordedAt <
      TIMING.INTERACTION_THROTTLE_MS
    ) {
      return false;
    }

    LIFE.lastInteractionRecordedAt =
      currentTime;

    LIFE.lastInteractionAt =
      currentTime;

    var previousStage =
      LIFE.idleStage;

    LIFE.idleStage =
      IDLE_STAGE.ACTIVE;

    if (
      previousStage !==
      IDLE_STAGE.ACTIVE
    ) {
      emit(
        "house-avatar-life:interaction-reset",
        {
          source:
            metadata.source ||
            "unknown",
          previousIdleStage:
            previousStage
        }
      );
    }

    return true;
  }

  function bindInteractionTracking() {
    if (LIFE.interactionBound) {
      return;
    }

    var definitions = [
      {
        target: document,
        eventName: "pointerdown",
        options: {
          passive: true
        }
      },
      {
        target: document,
        eventName: "touchstart",
        options: {
          passive: true
        }
      },
      {
        target: document,
        eventName: "touchmove",
        options: {
          passive: true
        }
      },
      {
        target: document,
        eventName: "wheel",
        options: {
          passive: true
        }
      },
      {
        target: document,
        eventName: "scroll",
        options: {
          passive: true,
          capture: true
        }
      },
      {
        target: document,
        eventName: "keydown",
        options: false
      },
      {
        target: document,
        eventName: "pointermove",
        options: {
          passive: true
        }
      }
    ];

    definitions.forEach(
      function bindDefinition(definition) {
        var handler =
          function interactionHandler() {
            recordInteraction({
              source:
                definition.eventName
            });
          };

        definition.target.addEventListener(
          definition.eventName,
          handler,
          definition.options
        );

        LIFE.interactionHandlers.push({
          target:
            definition.target,
          eventName:
            definition.eventName,
          handler:
            handler,
          options:
            definition.options
        });
      }
    );

    LIFE.interactionBound = true;
  }

  function unbindInteractionTracking() {
    LIFE.interactionHandlers.forEach(
      function removeHandler(binding) {
        binding.target.removeEventListener(
          binding.eventName,
          binding.handler,
          binding.options
        );
      }
    );

    LIFE.interactionHandlers.length = 0;
    LIFE.interactionBound = false;
  }

  function gestureAllowed(
    agentId,
    level
  ) {
    if (
      !LIFE.running ||
      !LIFE.enabled ||
      LIFE.reducedMotion ||
      LIFE.destroyed
    ) {
      return false;
    }

    var runtime =
      getRuntime(agentId);

    if (
      runtime.disabled ||
      runtime.traveling ||
      runtime.arriving ||
      runtime.speaking
    ) {
      return false;
    }

    if (
      runtime.primaryState ===
        "gesturing" ||
      runtime.primaryState ===
        "sleepy"
    ) {
      return false;
    }

    if (
      LIFE.bridge &&
      typeof LIFE.bridge
        .isCameraTransitioning ===
        "function" &&
      LIFE.bridge
        .isCameraTransitioning()
    ) {
      return false;
    }

    if (
      level === "large" &&
      LIFE.activeLargeGestureAgent &&
      LIFE.activeLargeGestureAgent !==
        agentId
    ) {
      return false;
    }

    if (
      level === "large" &&
      now() -
        LIFE.lastLargeGestureAt <
        TIMING.LARGE_GESTURE_MIN_GAP_MS
    ) {
      return false;
    }

    return true;
  }

  function inferGestureState(
    gestureName,
    options
  ) {
    if (
      options &&
      options.sleepy
    ) {
      return "sleepy";
    }

    if (
      /yawn|eye-rest|sleep/i.test(
        gestureName || ""
      )
    ) {
      return "sleepy";
    }

    if (
      /glance|head-tilt|brow/i.test(
        gestureName || ""
      )
    ) {
      return "glancing";
    }

    return "gesturing";
  }

  function performGesture(
    agentId,
    gestureName,
    options
  ) {
    options = options || {};

    if (
      !agentExists(agentId) ||
      !gestureName
    ) {
      return false;
    }

    var level =
      options.level || "medium";

    if (
      !gestureAllowed(
        agentId,
        level
      )
    ) {
      return false;
    }

    var runtime =
      getRuntime(agentId);

    cancelBlink(agentId);

    runtime.gestureToken += 1;

    var token =
      runtime.gestureToken;

    var gestureState =
      inferGestureState(
        gestureName,
        options
      );

    var duration =
      Number(options.duration) ||
      (
        level === "large"
          ? randomBetween(
              1900,
              2800
            )
          : level === "minor"
            ? randomBetween(
                650,
                1050
              )
            : randomBetween(
                950,
                1550
              )
      );

    if (level === "large") {
      LIFE.activeLargeGestureAgent =
        agentId;

      LIFE.lastLargeGestureAt =
        now();
    }

    runtime.lastGestureAt =
      now();

    if (
      gestureState === "sleepy"
    ) {
      runtime.lastYawnAt =
        now();
    }

    setPrimaryState(
      agentId,
      gestureState,
      {
        gesture:
          gestureName,
        expression:
          options.expression ||
          null
      }
    );

    emit(
      "house-avatar-life:gesture",
      {
        agentId: agentId,
        gesture:
          gestureName,
        level: level,
        state:
          gestureState,
        duration: duration
      }
    );

    runtime.gestureTimer =
      scheduleTimeout(
        function finishGesture() {
          if (
            token !==
            runtime.gestureToken
          ) {
            return;
          }

          runtime.gestureTimer =
            null;

          if (
            LIFE.activeLargeGestureAgent ===
            agentId
          ) {
            LIFE.activeLargeGestureAgent =
              null;
          }

          releasePrimaryState(
            agentId,
            gestureState
          );

          scheduleNextBlink(
            agentId
          );
        },
        duration,
        runtime.timers
      );

    return true;
  }

  function evaluateActiveStage(
    agentId
  ) {
    var runtime =
      getRuntime(agentId);

    if (
      runtime.primaryState ===
        "resting" ||
      runtime.primaryState ===
        "focused"
    ) {
      return;
    }

    if (
      runtime.primaryState ===
        "glancing"
    ) {
      releasePrimaryState(
        agentId,
        "glancing"
      );
    }
  }

  function evaluateSettledStage(
    agentId
  ) {
    var runtime =
      getRuntime(agentId);

    if (
      now() -
        runtime.lastGestureAt <
      13000
    ) {
      return;
    }

    if (!chance(0.12)) {
      return;
    }

    var gesture =
      choose(
        getAgent(agentId)
          .idleProfile
          .minorGestures
      );

    performGesture(
      agentId,
      gesture,
      {
        level: "minor"
      }
    );
  }

  function evaluateIdleStage(
    agentId
  ) {
    var runtime =
      getRuntime(agentId);

    if (
      now() -
        runtime.lastGestureAt <
      15000
    ) {
      return;
    }

    var agent =
      getAgent(agentId);

    if (chance(0.11)) {
      performGesture(
        agentId,
        choose(
          agent.idleProfile
            .mediumGestures
        ),
        {
          level: "medium"
        }
      );

      return;
    }

    if (chance(0.16)) {
      performGesture(
        agentId,
        choose(
          agent.idleProfile
            .minorGestures
        ),
        {
          level: "minor"
        }
      );
    }
  }

  function evaluateLongIdleStage(
    agentId
  ) {
    var runtime =
      getRuntime(agentId);

    if (
      now() -
        runtime.lastGestureAt <
      18000
    ) {
      return;
    }

    var agent =
      getAgent(agentId);

    var yawnCooldownPassed =
      now() -
        runtime.lastYawnAt >
      agent.idleProfile
        .yawnCooldown;

    var yawnEligible =
      yawnCooldownPassed &&
      chance(
        agent.idleProfile
          .yawnChance
      );

    if (yawnEligible) {
      performGesture(
        agentId,
        choose(
          agent.idleProfile
            .rareGestures
        ),
        {
          level: "large",
          sleepy: true
        }
      );

      return;
    }

    if (chance(0.08)) {
      performGesture(
        agentId,
        choose(
          agent.idleProfile
            .mediumGestures
        ),
        {
          level: "medium"
        }
      );

      return;
    }

    if (chance(0.12)) {
      performGesture(
        agentId,
        choose(
          agent.idleProfile
            .minorGestures
        ),
        {
          level: "minor"
        }
      );
    }
  }

  function evaluateAgentIdle(agentId) {
    var runtime =
      getRuntime(agentId);

    if (
      runtime.disabled ||
      runtime.traveling ||
      runtime.arriving ||
      runtime.speaking
    ) {
      return;
    }

    if (
      runtime.primaryState !==
        "resting" &&
      runtime.primaryState !==
        "focused"
    ) {
      return;
    }

    if (
      LIFE.idleStage ===
      IDLE_STAGE.ACTIVE
    ) {
      evaluateActiveStage(
        agentId
      );

      return;
    }

    if (
      LIFE.idleStage ===
      IDLE_STAGE.SETTLED
    ) {
      evaluateSettledStage(
        agentId
      );

      return;
    }

    if (
      LIFE.idleStage ===
      IDLE_STAGE.IDLE
    ) {
      evaluateIdleStage(
        agentId
      );

      return;
    }

    if (
      LIFE.idleStage ===
      IDLE_STAGE.LONG_IDLE
    ) {
      evaluateLongIdleStage(
        agentId
      );
    }
  }

  function evaluateLife() {
    if (
      !LIFE.running ||
      !LIFE.enabled ||
      LIFE.destroyed ||
      LIFE.reducedMotion
    ) {
      return;
    }

    if (
      LIFE.bridge &&
      typeof LIFE.bridge.isOpen ===
        "function" &&
      !LIFE.bridge.isOpen()
    ) {
      return;
    }

    updateIdleStage();

    Object.keys(AGENTS).forEach(
      function evaluateAgent(agentId) {
        evaluateAgentIdle(
          agentId
        );
      }
    );
  }

  function startEvaluationTimer() {
    clearTimer(
      LIFE.evaluationTimer
    );

    LIFE.evaluationTimer = null;

    if (
      !LIFE.running ||
      !LIFE.enabled ||
      LIFE.reducedMotion
    ) {
      return;
    }

    LIFE.evaluationTimer =
      global.setInterval(
        evaluateLife,
        TIMING.LIFE_EVALUATION_MS
      );
  }

  function stopEvaluationTimer() {
    clearTimer(
      LIFE.evaluationTimer
    );

    LIFE.evaluationTimer = null;
  }

  function initializeAgentRuntime() {
    Object.keys(AGENTS).forEach(
      function initializeAgent(agentId) {
        var runtime =
          getRuntime(agentId);

        runtime.currentRoomId =
          AGENTS[agentId].homeRoom;

        syncRuntimeToDOM(
          agentId
        );
      }
    );
  }

  function start(bridge) {
    if (bridge) {
      bindController(bridge);
    }

    if (
      LIFE.destroyed ||
      !LIFE.enabled
    ) {
      return false;
    }

    LIFE.running = true;

    LIFE.reducedMotion =
      resolveReducedMotion();

    LIFE.lastInteractionAt =
      now();

    LIFE.idleStage =
      IDLE_STAGE.ACTIVE;

    bindInteractionTracking();
    initializeAgentRuntime();

    Object.keys(AGENTS).forEach(
      function beginAgentLife(agentId) {
        var runtime =
          getRuntime(agentId);

        runtime.disabled = false;
        runtime.traveling = false;
        runtime.arriving = false;
        runtime.speaking = false;

        releasePrimaryState(
          agentId
        );

        scheduleNextBlink(
          agentId,
          {
            initial: true
          }
        );
      }
    );

    startEvaluationTimer();

    LIFE.initialized = true;

    emit(
      "house-avatar-life:start",
      {
        reducedMotion:
          LIFE.reducedMotion,
        agentCount:
          Object.keys(AGENTS).length
      }
    );

    return true;
  }

  function stop(options) {
    options = options || {};

    LIFE.running = false;

    stopEvaluationTimer();

    Object.keys(AGENTS).forEach(
      function stopAgent(agentId) {
        var runtime =
          getRuntime(agentId);

        clearAgentTimers(
          agentId
        );

        runtime.blinkToken += 1;
        runtime.gestureToken += 1;
        runtime.stateToken += 1;

        runtime.blinking = false;
        runtime.blinkType = null;
        runtime.gesture = null;
        runtime.expression = null;

        runtime.traveling = false;
        runtime.arriving = false;
        runtime.speaking = false;

        runtime.primaryState =
          runtime.disabled
            ? "disabled"
            : "resting";

        syncRuntimeToDOM(
          agentId
        );
      }
    );

    LIFE.activeLargeGestureAgent =
      null;

    emit(
      "house-avatar-life:stop",
      {
        reason:
          options.reason ||
          "unspecified"
      }
    );

    return true;
  }

  function pause() {
    LIFE.enabled = false;

    stop({
      reason: "paused"
    });

    Object.keys(AGENTS).forEach(
      function disableAgent(agentId) {
        var runtime =
          getRuntime(agentId);

        runtime.disabled = true;

        setPrimaryState(
          agentId,
          "disabled",
          {
            force: true
          }
        );
      }
    );

    emit(
      "house-avatar-life:pause"
    );

    return true;
  }

  function resume() {
    LIFE.enabled = true;
    LIFE.destroyed = false;

    Object.keys(AGENTS).forEach(
      function enableAgent(agentId) {
        var runtime =
          getRuntime(agentId);

        runtime.disabled = false;

        releasePrimaryState(
          agentId,
          "disabled"
        );
      }
    );

    emit(
      "house-avatar-life:resume"
    );

    if (
      LIFE.bridge &&
      (
        typeof LIFE.bridge.isOpen !==
          "function" ||
        LIFE.bridge.isOpen()
      )
    ) {
      start();
    }

    return true;
  }

  function resolveReducedMotion() {
    if (
      LIFE.bridge &&
      typeof LIFE.bridge
        .getReducedMotion ===
        "function"
    ) {
      return Boolean(
        LIFE.bridge
          .getReducedMotion()
      );
    }

    if (
      typeof global.matchMedia ===
      "function"
    ) {
      return global
        .matchMedia(
          "(prefers-reduced-motion: reduce)"
        )
        .matches;
    }

    return false;
  }

  function handleReducedMotionChange(
    payload
  ) {
    LIFE.reducedMotion =
      Boolean(
        payload &&
        payload.reducedMotion
      );

    Object.keys(AGENTS).forEach(
      function handleAgent(agentId) {
        cancelBlink(agentId);

        var runtime =
          getRuntime(agentId);

        if (
          LIFE.reducedMotion &&
          (
            runtime.primaryState ===
              "gesturing" ||
            runtime.primaryState ===
              "glancing" ||
            runtime.primaryState ===
              "sleepy"
          )
        ) {
          runtime.gestureToken += 1;

          releasePrimaryState(
            agentId
          );
        }
      }
    );

    if (LIFE.reducedMotion) {
      stopEvaluationTimer();
    } else if (
      LIFE.running &&
      LIFE.enabled
    ) {
      Object.keys(AGENTS).forEach(
        function restartBlink(agentId) {
          scheduleNextBlink(
            agentId,
            {
              initial: true
            }
          );
        }
      );

      startEvaluationTimer();
    }

    emit(
      "house-avatar-life:reduced-motion",
      {
        reducedMotion:
          LIFE.reducedMotion
      }
    );

    return true;
  }

  function bindController(bridge) {
    if (!bridge) {
      return false;
    }

    LIFE.bridge = bridge;

    LIFE.reducedMotion =
      resolveReducedMotion();

    Object.keys(AGENTS).forEach(
      function synchronizeAgent(agentId) {
        var runtime =
          getRuntime(agentId);

        if (
          typeof bridge.getAgentLocation ===
          "function"
        ) {
          runtime.currentRoomId =
            bridge.getAgentLocation(
              agentId
            );
        }

        syncRuntimeToDOM(
          agentId
        );
      }
    );

    LIFE.initialized = true;

    emit(
      "house-avatar-life:controller-bound",
      {
        controllerContract:
          bridge.contract || null
      }
    );

    return true;
  }

  function handleControllerRenderStart() {
    Object.keys(AGENTS).forEach(
      function resetRenderedAgent(agentId) {
        var runtime =
          getRuntime(agentId);

        runtime.blinkToken += 1;
        runtime.gestureToken += 1;
        runtime.stateToken += 1;

        clearAgentTimers(
          agentId
        );
      }
    );

    return true;
  }

  function handleViewModeChange(
    payload
  ) {
    payload = payload || {};

    var focusedRoom =
      payload.focusedRoom || null;

    Object.keys(AGENTS).forEach(
      function updateAgentFocus(agentId) {
        var runtime =
          getRuntime(agentId);

        var agentRoom =
          getCurrentAgentRoom(
            agentId
          );

        runtime.cameraFocused =
          payload.viewMode ===
            DATA.viewModes.ROOM &&
          Boolean(focusedRoom) &&
          agentRoom === focusedRoom;

        if (
          !runtime.traveling &&
          !runtime.arriving &&
          !runtime.speaking &&
          runtime.primaryState !==
            "gesturing" &&
          runtime.primaryState !==
            "sleepy" &&
          runtime.primaryState !==
            "glancing"
        ) {
          releasePrimaryState(
            agentId
          );
        }
      }
    );

    return true;
  }

  function handleRoomSelected(
    payload
  ) {
    payload = payload || {};

    var roomId =
      payload.roomId;

    var assignedAgentId =
      payload.agentId;

    Object.keys(AGENTS).forEach(
      function reactToSelection(agentId) {
        var runtime =
          getRuntime(agentId);

        runtime.roomFocused =
          agentId ===
          assignedAgentId;

        if (
          agentId ===
          assignedAgentId
        ) {
          cancelBlink(agentId);

          setPrimaryState(
            agentId,
            "focused",
            {
              expression:
                getAgent(agentId)
                  .focusedExpression,
              force: true
            }
          );

          var room =
            getRoom(roomId);

          var glanceGesture =
            chooseRoomGlanceGesture(
              agentId,
              room
            );

          if (
            glanceGesture &&
            !LIFE.reducedMotion
          ) {
            scheduleTimeout(
              function performAssignedGlance() {
                performGesture(
                  agentId,
                  glanceGesture,
                  {
                    level: "minor",
                    duration: 780
                  }
                );
              },
              110,
              runtime.timers
            );
          }

          return;
        }

        if (
          !LIFE.reducedMotion &&
          chance(0.18)
        ) {
          var minorGesture =
            choose(
              getAgent(agentId)
                .idleProfile
                .minorGestures
            );

          scheduleTimeout(
            function performOtherGuideReaction() {
              performGesture(
                agentId,
                minorGesture,
                {
                  level: "minor",
                  duration: 700
                }
              );
            },
            randomBetween(
              180,
              520
            ),
            runtime.timers
          );
        }
      }
    );

    emit(
      "house-avatar-life:room-selected",
      {
        roomId: roomId,
        agentId:
          assignedAgentId
      }
    );

    return true;
  }

  function chooseRoomGlanceGesture(
    agentId,
    room
  ) {
    var agent =
      getAgent(agentId);

    var preferred =
      agent.idleProfile
        .minorGestures.filter(
          function filterGlance(gesture) {
            return /glance|head|brow|signal/i.test(
              gesture
            );
          }
        );

    if (preferred.length) {
      return choose(preferred);
    }

    return choose(
      agent.idleProfile
        .minorGestures
    );
  }

  function handleCameraSettled(
    payload
  ) {
    payload = payload || {};

    Object.keys(AGENTS).forEach(
      function settleAgent(agentId) {
        var runtime =
          getRuntime(agentId);

        var currentRoom =
          getCurrentAgentRoom(
            agentId
          );

        runtime.cameraFocused =
          payload.viewMode ===
            DATA.viewModes.ROOM &&
          payload.roomId ===
            currentRoom;

        if (
          !runtime.traveling &&
          !runtime.arriving &&
          !runtime.speaking
        ) {
          releasePrimaryState(
            agentId
          );
        }
      }
    );

    return true;
  }

  function handleReturnToEstate() {
    Object.keys(AGENTS).forEach(
      function returnAgentToAmbient(agentId) {
        var runtime =
          getRuntime(agentId);

        runtime.cameraFocused = false;
        runtime.roomFocused = false;

        if (
          !runtime.traveling &&
          !runtime.arriving &&
          !runtime.speaking
        ) {
          releasePrimaryState(
            agentId
          );
        }
      }
    );

    return true;
  }

  function handleTravelStart(
    payload
  ) {
    payload = payload || {};

    var agentId =
      payload.agentId;

    if (!agentExists(agentId)) {
      return false;
    }

    var runtime =
      getRuntime(agentId);

    cancelBlink(agentId);

    runtime.traveling = true;
    runtime.arriving = false;
    runtime.lastTravelAt =
      now();

    runtime.currentRoomId =
      getCurrentAgentRoom(
        agentId
      );

    setPrimaryState(
      agentId,
      "traveling",
      {
        expression:
          payload.expression ||
          getAgent(agentId)
            .travelExpression,
        force: true
      }
    );

    emit(
      "house-avatar-life:travel-start",
      {
        agentId: agentId,
        roomId:
          payload.roomId,
        path:
          Array.isArray(
            payload.path
          )
            ? payload.path.slice()
            : []
      }
    );

    return true;
  }

  function handleTravelStep(
    payload
  ) {
    payload = payload || {};

    var agentId =
      payload.agentId;

    if (!agentExists(agentId)) {
      return false;
    }

    var runtime =
      getRuntime(agentId);

    if (payload.roomId) {
      runtime.currentRoomId =
        payload.roomId;
    }

    return true;
  }

  function handleTravelCancel() {
    Object.keys(AGENTS).forEach(
      function cancelAgentTravel(agentId) {
        var runtime =
          getRuntime(agentId);

        if (!runtime.traveling) {
          return;
        }

        runtime.traveling = false;
        runtime.arriving = false;

        releasePrimaryState(
          agentId,
          "traveling"
        );

        scheduleNextBlink(
          agentId
        );
      }
    );

    return true;
  }

  function handleArrival(
    payload
  ) {
    payload = payload || {};

    var agentId =
      payload.agentId;

    var roomId =
      payload.roomId;

    if (
      !agentExists(agentId) ||
      !roomId
    ) {
      return false;
    }

    var runtime =
      getRuntime(agentId);

    runtime.traveling = false;
    runtime.arriving = true;
    runtime.lastArrivalAt =
      now();

    runtime.currentRoomId =
      roomId;

    cancelBlink(agentId);

    setPrimaryState(
      agentId,
      "arriving",
      {
        gesture:
          payload.arrivalGesture ||
          getAgent(agentId)
            .arrivalGesture,
        force: true
      }
    );

    var token =
      ++runtime.stateToken;

    runtime.stateTimer =
      scheduleTimeout(
        function finishArrivalState() {
          if (
            token !==
            runtime.stateToken
          ) {
            return;
          }

          runtime.arriving = false;
          runtime.stateTimer = null;

          releasePrimaryState(
            agentId,
            "arriving"
          );

          scheduleNextBlink(
            agentId
          );
        },
        LIFE.reducedMotion
          ? 0
          : TIMING.ARRIVAL_HOLD_MS,
        runtime.timers
      );

    emit(
      "house-avatar-life:arrival",
      {
        agentId: agentId,
        roomId: roomId,
        sameRoom:
          Boolean(
            payload.sameRoom
          ),
        gesture:
          payload.arrivalGesture ||
          getAgent(agentId)
            .arrivalGesture
      }
    );

    return true;
  }

  function handleAgentLocationsReset(
    locations
  ) {
    Object.keys(AGENTS).forEach(
      function resetAgentRuntime(agentId) {
        var runtime =
          getRuntime(agentId);

        runtime.currentRoomId =
          locations &&
          locations[agentId]
            ? locations[agentId]
            : getAgent(agentId)
                .homeRoom;

        runtime.traveling = false;
        runtime.arriving = false;
        runtime.cameraFocused =
          false;
        runtime.roomFocused =
          false;

        releasePrimaryState(
          agentId
        );
      }
    );

    return true;
  }

  function getCurrentAgentRoom(
    agentId
  ) {
    if (
      LIFE.bridge &&
      typeof LIFE.bridge
        .getAgentLocation ===
        "function"
    ) {
      return LIFE.bridge
        .getAgentLocation(
          agentId
        );
    }

    return getRuntime(agentId)
      .currentRoomId;
  }

  function setSpeaking(
    agentId,
    speaking,
    expression
  ) {
    if (!agentExists(agentId)) {
      return false;
    }

    var runtime =
      getRuntime(agentId);

    runtime.speaking =
      Boolean(speaking);

    if (runtime.speaking) {
      cancelBlink(agentId);

      setPrimaryState(
        agentId,
        "speaking",
        {
          expression:
            expression ||
            "speaking",
          force: true
        }
      );
    } else {
      releasePrimaryState(
        agentId,
        "speaking"
      );

      scheduleNextBlink(
        agentId
      );
    }

    return true;
  }

  function triggerGesture(
    agentId,
    gestureName,
    options
  ) {
    return performGesture(
      agentId,
      gestureName,
      options || {}
    );
  }

  function triggerBlink(
    agentId,
    blinkType
  ) {
    return performBlink(
      agentId,
      blinkType || "single"
    );
  }

  function getAvatarLifeState(
    agentId
  ) {
    if (!agentExists(agentId)) {
      return null;
    }

    var runtime =
      getRuntime(agentId);

    return {
      contract: CONTRACT,
      agentId: agentId,

      primaryState:
        runtime.primaryState,
      previousState:
        runtime.previousState,

      gesture:
        runtime.gesture,
      expression:
        runtime.expression,

      blinking:
        runtime.blinking,
      blinkType:
        runtime.blinkType,

      traveling:
        runtime.traveling,
      arriving:
        runtime.arriving,
      speaking:
        runtime.speaking,
      disabled:
        runtime.disabled,

      cameraFocused:
        runtime.cameraFocused,
      roomFocused:
        runtime.roomFocused,

      currentRoomId:
        getCurrentAgentRoom(
          agentId
        ),

      lastBlinkAt:
        runtime.lastBlinkAt,
      lastGestureAt:
        runtime.lastGestureAt,
      lastYawnAt:
        runtime.lastYawnAt,
      lastTravelAt:
        runtime.lastTravelAt,
      lastArrivalAt:
        runtime.lastArrivalAt,

      idleStage:
        LIFE.idleStage,
      lifeEnabled:
        LIFE.enabled,
      running:
        LIFE.running,
      reducedMotion:
        LIFE.reducedMotion
    };
  }

  function getState() {
    var agents = {};

    Object.keys(AGENTS).forEach(
      function collectAgentState(agentId) {
        agents[agentId] =
          getAvatarLifeState(
            agentId
          );
      }
    );

    return {
      contract: CONTRACT,
      initialized:
        LIFE.initialized,
      enabled:
        LIFE.enabled,
      running:
        LIFE.running,
      destroyed:
        LIFE.destroyed,
      reducedMotion:
        LIFE.reducedMotion,

      lastInteractionAt:
        LIFE.lastInteractionAt,
      idleStage:
        LIFE.idleStage,

      activeLargeGestureAgent:
        LIFE.activeLargeGestureAgent,
      lastLargeGestureAt:
        LIFE.lastLargeGestureAt,

      agents: agents
    };
  }

  function destroy() {
    stop({
      reason: "destroy"
    });

    unbindInteractionTracking();

    clearTimerList(
      LIFE.globalTimers
    );

    LIFE.bridge = null;
    LIFE.destroyed = true;
    LIFE.initialized = false;

    emit(
      "house-avatar-life:destroy"
    );

    return true;
  }

  function boot() {
    initializeAgentRuntime();

    if (
      global.HOUSE_CONTROL_PAD &&
      typeof global.HOUSE_CONTROL_PAD
        .getAvatarLifeBridge ===
        "function"
    ) {
      bindController(
        global.HOUSE_CONTROL_PAD
          .getAvatarLifeBridge()
      );
    }

    LIFE.initialized = true;

    emit(
      "house-avatar-life:ready",
      {
        agentCount:
          Object.keys(AGENTS).length,
        dataContract:
          DATA.contract
      }
    );

    if (
      global.HOUSE_CONTROL_PAD &&
      typeof global.HOUSE_CONTROL_PAD
        .getEstateState ===
        "function"
    ) {
      var estateState =
        global.HOUSE_CONTROL_PAD
          .getEstateState();

      if (estateState.isOpen) {
        start();
      }
    }
  }

  global.HOUSE_AVATAR_LIFE = {
    contract: CONTRACT,
    dataContract:
      DATA.contract,

    bindController:
      bindController,

    start:
      start,

    stop:
      stop,

    pause:
      pause,

    resume:
      resume,

    destroy:
      destroy,

    recordInteraction:
      recordInteraction,

    triggerBlink:
      triggerBlink,

    triggerGesture:
      triggerGesture,

    setSpeaking:
      setSpeaking,

    getAvatarLifeState:
      getAvatarLifeState,

    getState:
      getState,

    handleControllerRenderStart:
      handleControllerRenderStart,

    handleViewModeChange:
      handleViewModeChange,

    handleRoomSelected:
      handleRoomSelected,

    handleCameraSettled:
      handleCameraSettled,

    handleReturnToEstate:
      handleReturnToEstate,

    handleTravelStart:
      handleTravelStart,

    handleTravelStep:
      handleTravelStep,

    handleTravelCancel:
      handleTravelCancel,

    handleArrival:
      handleArrival,

    handleAgentLocationsReset:
      handleAgentLocationsReset,

    handleReducedMotionChange:
      handleReducedMotionChange
  };

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {
        once: true
      }
    );
  } else {
    global.setTimeout(
      boot,
      0
    );
  }
})(window);
