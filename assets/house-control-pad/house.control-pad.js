// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_LEAN_IMMERSIVE_ESTATE_CONTROLLER_TNT_v2
// Full-file replacement.
//
// Required load order:
//
// 1. /assets/house-control-pad/house.control-pad.data.js
// 2. /assets/house-control-pad/house.control-pad.js
// 3. /assets/house-control-pad/house.avatar-life.js
//
// Required styles:
//
// 1. /assets/house-control-pad/house.control-pad.css
// 2. /assets/house-control-pad/house.avatars.css
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
// - controller initialization
// - House opening and closing
// - Estate View
// - Room View
// - camera calculations
// - camera transitions
// - room selection
// - progressive room-information state
// - explicit route actions
// - corridor pathfinding
// - guide travel
// - persistent guide locations
// - same-room handling
// - DOM construction
// - focus management
// - accessibility coordination
// - reduced-motion detection
// - public API
// - lifecycle cleanup
// - coordination with HOUSE_AVATAR_LIFE
//
// This file does not own:
//
// - canonical room content
// - canonical routes
// - canonical room geometry
// - canonical agent identity data
// - avatar blink scheduling
// - inactivity timing
// - avatar gesture selection
// - yawn scheduling
// - room architecture CSS
// - avatar appearance CSS
// - animation keyframes
//
// Canonical names:
//
// - Jeeves
// - Auren
// - Soren
// - Elara
//

(function bindLeanHouseControlPadController(global) {
  "use strict";

  var CONTRACT =
    "HOUSE_CONTROL_PAD_LEAN_IMMERSIVE_ESTATE_CONTROLLER_TNT_v2";

  var DATA_CONTRACT =
    "HOUSE_CONTROL_PAD_STATIC_ESTATE_DATA_TNT_v1";

  var DATA = global.HOUSE_CONTROL_PAD_DATA;

  if (!DATA) {
    reportFatal(
      "HOUSE_CONTROL_PAD_DATA is unavailable. Load " +
        "/assets/house-control-pad/house.control-pad.data.js " +
        "before house.control-pad.js."
    );

    return;
  }

  var DEFAULT_ROOM_ID = DATA.defaultRoomId;
  var VIEW_MODE = DATA.viewModes;
  var TIMING = DATA.timing;

  var ROOMS = DATA.rooms;
  var AGENTS = DATA.agents;
  var CORRIDORS = DATA.corridors;

  var STATE = {
    initialized: false,
    ready: false,
    isOpen: false,

    currentPageRoom: DEFAULT_ROOM_ID,
    selectedRoom: null,
    selectedAgent: null,

    viewMode: VIEW_MODE.ESTATE,
    zoomLevel: 1,
    focusedRoom: null,
    previousFocusedRoom: null,

    cameraTransitioning: false,
    cameraToken: 0,
    cameraTimers: [],

    traveling: false,
    travelToken: 0,
    travelTimers: [],
    activePath: [],

    reducedMotion: false,
    reducedMotionMedia: null,

    agentLocations: clone(DATA.homeAgentLocations),

    previousFocus: null,

    root: null,
    overlay: null,
    panel: null,
    header: null,
    returnButton: null,
    closeButton: null,

    estateViewport: null,
    estateStage: null,
    estateCanvas: null,
    routeLayer: null,
    roomLayer: null,
    avatarLayer: null,

    arrivalSheet: null,
    status: null,

    boundOpenButtons: new WeakSet(),

    resizeFrame: 0
  };

  function reportFatal(message) {
    try {
      console.error("[House Control Pad]", message);
    } catch (error) {
      // No-op.
    }

    try {
      global.dispatchEvent(
        new CustomEvent("house-control-pad:error", {
          detail: {
            contract: CONTRACT,
            fatal: true,
            message: message
          }
        })
      );
    } catch (error) {
      // No-op.
    }
  }

  function clone(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(clone);
    }

    var copy = {};

    Object.keys(value).forEach(function cloneKey(key) {
      copy[key] = clone(value[key]);
    });

    return copy;
  }

  function normalize(value) {
    if (
      value === null ||
      typeof value === "undefined"
    ) {
      return "";
    }

    return String(value)
      .replace(/\s+/g, " ")
      .trim();
  }

  function clamp(value, minimum, maximum) {
    return Math.min(
      maximum,
      Math.max(minimum, value)
    );
  }

  function q(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function create(tagName, className, attributes) {
    var node = document.createElement(tagName);

    if (className) {
      node.className = className;
    }

    if (
      attributes &&
      typeof attributes === "object"
    ) {
      Object.keys(attributes).forEach(
        function applyAttribute(key) {
          var value = attributes[key];

          if (key === "text") {
            node.textContent = value;
            return;
          }

          if (key === "html") {
            node.innerHTML = value;
            return;
          }

          if (
            value !== null &&
            typeof value !== "undefined"
          ) {
            node.setAttribute(key, value);
          }
        }
      );
    }

    return node;
  }

  function roomExists(roomId) {
    return DATA.roomExists(roomId);
  }

  function agentExists(agentId) {
    return DATA.agentExists(agentId);
  }

  function corridorExists(corridorId) {
    return DATA.corridorExists(corridorId);
  }

  function getRoom(roomId) {
    return DATA.getRoom(roomId);
  }

  function getAgent(agentId) {
    return DATA.getAgent(agentId);
  }

  function resolveAuthority(roomOrRoomId) {
    return DATA.resolveAuthority(roomOrRoomId);
  }

  function getAvatarLife() {
    return global.HOUSE_AVATAR_LIFE || null;
  }

  function notifyAvatarLife(methodName) {
    var avatarLife = getAvatarLife();

    if (
      !avatarLife ||
      typeof avatarLife[methodName] !== "function"
    ) {
      return undefined;
    }

    var args = Array.prototype.slice.call(
      arguments,
      1
    );

    try {
      return avatarLife[methodName].apply(
        avatarLife,
        args
      );
    } catch (error) {
      try {
        console.warn(
          "[House Control Pad] Avatar-life call failed:",
          methodName,
          error
        );
      } catch (consoleError) {
        // No-op.
      }

      return undefined;
    }
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
  }

  function ensureRoot() {
    var root = q(
      "[data-house-control-pad-root]"
    );

    if (!root) {
      root = create("div", "", {
        "data-house-control-pad-root": "true"
      });

      document.body.appendChild(root);
    }

    STATE.root = root;

    return root;
  }

  function setStatus(message) {
    if (STATE.status) {
      STATE.status.textContent =
        normalize(message);
    }
  }

  function setDocumentOpenState(isOpen) {
    var value = isOpen ? "true" : "false";

    document.documentElement.setAttribute(
      "data-house-control-pad-open",
      value
    );

    document.body.setAttribute(
      "data-house-control-pad-open",
      value
    );
  }

  function safeFocus(node) {
    if (
      !node ||
      typeof node.focus !== "function"
    ) {
      return;
    }

    try {
      node.focus({
        preventScroll: true
      });
    } catch (error) {
      node.focus();
    }
  }

  function getFocusable(root) {
    return qa(
      [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(","),
      root
    ).filter(function keepFocusable(node) {
      return (
        node.offsetParent !== null ||
        node === document.activeElement
      );
    });
  }

  function trapFocus(event) {
    if (
      !STATE.isOpen ||
      !STATE.panel ||
      event.key !== "Tab"
    ) {
      return;
    }

    var focusable = getFocusable(STATE.panel);

    if (!focusable.length) {
      return;
    }

    var first = focusable[0];
    var last =
      focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault();
      safeFocus(last);
      return;
    }

    if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      safeFocus(first);
    }
  }

  function handleKeydown(event) {
    notifyAvatarLife("recordInteraction", {
      source: "keyboard",
      eventType: event.key
    });

    if (!STATE.isOpen) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      if (STATE.viewMode === VIEW_MODE.ROOM) {
        returnToEstate();
      } else {
        closeControlPad();
      }

      return;
    }

    trapFocus(event);
  }

  function clearTimerList(timerList) {
    timerList.forEach(function clearTimer(timerId) {
      global.clearTimeout(timerId);
      global.clearInterval(timerId);
    });

    timerList.length = 0;
  }

  function cancelCameraTransition() {
    STATE.cameraToken += 1;
    STATE.cameraTransitioning = false;

    clearTimerList(STATE.cameraTimers);
  }

  function clearTravelSegments() {
    if (!STATE.routeLayer) {
      return;
    }

    qa(
      "[data-house-travel-segment]",
      STATE.routeLayer
    ).forEach(function removeSegment(segment) {
      segment.remove();
    });
  }

  function cancelTravel(options) {
    options = options || {};

    STATE.travelToken += 1;
    STATE.traveling = false;
    STATE.activePath = [];

    clearTimerList(STATE.travelTimers);
    clearTravelSegments();

    if (STATE.panel) {
      qa(
        "[data-house-avatar]",
        STATE.panel
      ).forEach(function clearTravelState(node) {
        node.setAttribute(
          "data-traveling",
          "false"
        );
      });
    }

    if (!options.silent) {
      notifyAvatarLife("handleTravelCancel");
    }
  }

  function getCurrentRoomFromDOM() {
    var root = q(
      "[data-house-control-pad-root]"
    );

    var rootRoom =
      root &&
      root.getAttribute("data-house-room");

    if (roomExists(rootRoom)) {
      return rootRoom;
    }

    var bodyRoom =
      document.body &&
      document.body.getAttribute(
        "data-house-room"
      );

    if (roomExists(bodyRoom)) {
      return bodyRoom;
    }

    var htmlRoom =
      document.documentElement.getAttribute(
        "data-house-room"
      );

    if (roomExists(htmlRoom)) {
      return htmlRoom;
    }

    return DATA.resolveRoomFromPath(
      global.location.pathname
    );
  }

  function getAgentLocation(agentId) {
    var agent = getAgent(agentId);

    return (
      STATE.agentLocations[agent.id] ||
      agent.homeRoom
    );
  }

  function setAgentLocation(
    agentId,
    roomId
  ) {
    if (
      !agentExists(agentId) ||
      !roomExists(roomId)
    ) {
      return false;
    }

    STATE.agentLocations[agentId] =
      roomId;

    return true;
  }

  function resetAgentLocations() {
    cancelTravel({
      silent: true
    });

    STATE.agentLocations = clone(
      DATA.homeAgentLocations
    );

    if (STATE.initialized) {
      restoreAgentPositions();
      updateAvatarVisibility();
      updateAvatarScaleModes();
    }

    notifyAvatarLife(
      "handleAgentLocationsReset",
      clone(STATE.agentLocations)
    );

    setStatus(
      "All guides returned to their home rooms."
    );

    emit(
      "house-control-pad:agent-locations-reset",
      {
        agentLocations: clone(
          STATE.agentLocations
        )
      }
    );

    return clone(
      STATE.agentLocations
    );
  }

  function getRoomAnchorId(roomId) {
    return "room:" + roomId;
  }

  function getRoomCenter(roomId) {
    var room = getRoom(roomId);

    return {
      x: room.x + room.width / 2,
      y: room.y + room.height / 2
    };
  }

  function getRoomZonePoint(
    roomId,
    zoneName
  ) {
    var room = getRoom(roomId);

    var zone =
      room[zoneName] || {
        x: 50,
        y: 50,
        width: 0,
        height: 0
      };

    return {
      x:
        room.x +
        room.width *
          ((zone.x + zone.width / 2) /
            100),

      y:
        room.y +
        room.height *
          ((zone.y + zone.height / 2) /
            100)
    };
  }

  function getRoomPortraitPoint(roomId) {
    return getRoomZonePoint(
      roomId,
      "portraitZone"
    );
  }

  function getGraphNeighbors(nodeId) {
    if (
      typeof nodeId !== "string"
    ) {
      return [];
    }

    if (
      nodeId.indexOf("room:") === 0
    ) {
      var roomId = nodeId.slice(5);
      var room = getRoom(roomId);

      return Array.isArray(
        room.corridorAccess
      )
        ? room.corridorAccess.slice()
        : [];
    }

    var corridor = CORRIDORS[nodeId];

    return corridor &&
      Array.isArray(corridor.connections)
      ? corridor.connections.slice()
      : [];
  }

  function findGraphPath(
    fromRoomId,
    toRoomId
  ) {
    var start =
      getRoomAnchorId(fromRoomId);

    var goal =
      getRoomAnchorId(toRoomId);

    if (start === goal) {
      return [start];
    }

    var queue = [start];
    var visited = {};
    var previous = {};

    visited[start] = true;

    while (queue.length) {
      var current = queue.shift();
      var neighbors =
        getGraphNeighbors(current);

      for (
        var index = 0;
        index < neighbors.length;
        index += 1
      ) {
        var next = neighbors[index];

        if (visited[next]) {
          continue;
        }

        visited[next] = true;
        previous[next] = current;

        if (next === goal) {
          return reconstructPath(
            previous,
            start,
            goal
          );
        }

        queue.push(next);
      }
    }

    return [];
  }

  function reconstructPath(
    previous,
    start,
    goal
  ) {
    var path = [goal];
    var cursor = goal;

    while (
      cursor !== start &&
      previous[cursor]
    ) {
      cursor = previous[cursor];
      path.unshift(cursor);
    }

    if (path[0] !== start) {
      return [];
    }

    return path;
  }

  function graphNodePoint(nodeId) {
    if (
      nodeId.indexOf("room:") === 0
    ) {
      return getRoomPortraitPoint(
        nodeId.slice(5)
      );
    }

    var corridor = CORRIDORS[nodeId];

    if (!corridor) {
      return null;
    }

    return {
      x: corridor.x,
      y: corridor.y
    };
  }

  function graphPathToVisualPoints(path) {
    return path
      .map(function mapPathNode(nodeId) {
        var point = graphNodePoint(nodeId);

        if (!point) {
          return null;
        }

        return {
          id: nodeId,
          roomId:
            nodeId.indexOf("room:") === 0
              ? nodeId.slice(5)
              : null,
          point: point
        };
      })
      .filter(Boolean);
  }

  function setCurrentPageRoom(roomId) {
    var room = getRoom(roomId);

    STATE.currentPageRoom = room.id;

    if (STATE.root) {
      STATE.root.setAttribute(
        "data-house-room",
        room.id
      );
    }

    if (!STATE.panel) {
      return;
    }

    qa(
      "[data-house-room-node]",
      STATE.panel
    ).forEach(function clearCurrentRoom(node) {
      node.setAttribute(
        "data-current",
        "false"
      );
    });

    markRoomState(
      room.id,
      "data-current",
      true
    );
  }

  function clearRoomInteractionStates() {
    if (!STATE.panel) {
      return;
    }

    qa(
      "[data-house-room-node]",
      STATE.panel
    ).forEach(function clearRoomState(node) {
      node.setAttribute(
        "data-selected",
        "false"
      );

      node.setAttribute(
        "data-destination",
        "false"
      );

      node.setAttribute(
        "data-arrived",
        "false"
      );

      node.setAttribute(
        "data-focused",
        "false"
      );
    });

    qa(
      "[data-house-avatar]",
      STATE.panel
    ).forEach(function clearAvatarState(node) {
      node.setAttribute(
        "data-selected",
        "false"
      );

      node.setAttribute(
        "data-arrived",
        "false"
      );

      node.setAttribute(
        "data-focused",
        "false"
      );
    });
  }

  function markRoomState(
    roomId,
    attribute,
    value
  ) {
    if (!STATE.panel) {
      return;
    }

    var roomNode = q(
      '[data-house-room-node="' +
        roomId +
        '"]',
      STATE.panel
    );

    if (roomNode) {
      roomNode.setAttribute(
        attribute,
        value ? "true" : "false"
      );
    }
  }

  function markAgentState(
    agentId,
    attribute,
    value
  ) {
    if (!STATE.panel) {
      return;
    }

    var avatarNode = q(
      '[data-house-avatar="' +
        agentId +
        '"]',
      STATE.panel
    );

    if (avatarNode) {
      avatarNode.setAttribute(
        attribute,
        value ? "true" : "false"
      );
    }
  }

  function setAvatarPoint(
    agentId,
    point,
    roomId
  ) {
    if (
      !STATE.panel ||
      !point
    ) {
      return;
    }

    var avatar = q(
      '[data-house-avatar="' +
        agentId +
        '"]',
      STATE.panel
    );

    if (!avatar) {
      return;
    }

    avatar.style.left =
      point.x + "%";

    avatar.style.top =
      point.y + "%";

    if (roomId) {
      avatar.setAttribute(
        "data-current-room",
        roomId
      );
    }
  }

  function setAvatarRoom(
    agentId,
    roomId
  ) {
    setAvatarPoint(
      agentId,
      getRoomPortraitPoint(roomId),
      roomId
    );
  }

  function restoreAgentPositions() {
    Object.keys(AGENTS).forEach(
      function restoreAgent(agentId) {
        setAvatarRoom(
          agentId,
          getAgentLocation(agentId)
        );
      }
    );
  }

  function setViewMode(viewMode) {
    STATE.viewMode =
      viewMode === VIEW_MODE.ROOM
        ? VIEW_MODE.ROOM
        : VIEW_MODE.ESTATE;

    STATE.zoomLevel =
      STATE.viewMode === VIEW_MODE.ROOM
        ? 2
        : 1;

    if (STATE.panel) {
      STATE.panel.setAttribute(
        "data-house-view-mode",
        STATE.viewMode
      );

      STATE.panel.setAttribute(
        "data-house-zoom-level",
        String(STATE.zoomLevel)
      );
    }

    if (STATE.returnButton) {
      STATE.returnButton.hidden =
        STATE.viewMode !==
        VIEW_MODE.ROOM;
    }

    notifyAvatarLife(
      "handleViewModeChange",
      {
        viewMode: STATE.viewMode,
        zoomLevel: STATE.zoomLevel,
        focusedRoom:
          STATE.focusedRoom
      }
    );
  }

  function getViewMode() {
    return STATE.viewMode;
  }

  function getOverviewTransform() {
    if (
      !STATE.estateViewport ||
      !STATE.estateCanvas
    ) {
      return {
        scale: 1,
        x: 0,
        y: 0
      };
    }

    var viewportWidth =
      STATE.estateViewport.clientWidth;

    var viewportHeight =
      STATE.estateViewport.clientHeight;

    var canvasWidth =
      STATE.estateCanvas.offsetWidth;

    var canvasHeight =
      STATE.estateCanvas.offsetHeight;

    if (
      !viewportWidth ||
      !viewportHeight ||
      !canvasWidth ||
      !canvasHeight
    ) {
      return {
        scale: 1,
        x: 0,
        y: 0
      };
    }

    var scale = Math.min(
      viewportWidth / canvasWidth,
      viewportHeight / canvasHeight
    );

    scale = clamp(
      scale,
      0.26,
      1
    );

    return {
      scale: scale,
      x:
        (viewportWidth -
          canvasWidth * scale) /
        2,
      y:
        (viewportHeight -
          canvasHeight * scale) /
        2
    };
  }

  function getRoomTransform(roomId) {
    var room = getRoom(roomId);
    var camera =
      room.cameraFocus || {};

    var requestedScale =
      Number(camera.scale) || 1.7;

    if (
      !STATE.estateViewport ||
      !STATE.estateCanvas
    ) {
      return {
        scale: requestedScale,
        x: 0,
        y: 0
      };
    }

    var viewportWidth =
      STATE.estateViewport.clientWidth;

    var viewportHeight =
      STATE.estateViewport.clientHeight;

    var canvasWidth =
      STATE.estateCanvas.offsetWidth;

    var canvasHeight =
      STATE.estateCanvas.offsetHeight;

    var roomCenter =
      getRoomCenter(roomId);

    var roomCenterX =
      canvasWidth *
      (roomCenter.x / 100);

    var roomCenterY =
      canvasHeight *
      (roomCenter.y / 100);

    var scale = requestedScale;

    var x =
      viewportWidth / 2 -
      roomCenterX * scale +
      Number(camera.offsetX || 0);

    var y =
      viewportHeight / 2 -
      roomCenterY * scale +
      Number(camera.offsetY || 0);

    return {
      scale: scale,
      x: x,
      y: y
    };
  }

  function applyCameraTransform(
    transform,
    immediate
  ) {
    if (!STATE.estateStage) {
      return;
    }

    STATE.estateStage.style.transition =
      immediate ||
      STATE.reducedMotion
        ? "none"
        : "";

    STATE.estateStage.style.transform =
      "translate3d(" +
      transform.x +
      "px," +
      transform.y +
      "px,0) scale(" +
      transform.scale +
      ")";
  }

  function focusRoom(
    roomId,
    options
  ) {
    options = options || {};

    if (!roomExists(roomId)) {
      return false;
    }

    var transform =
      options.overview
        ? getOverviewTransform()
        : getRoomTransform(roomId);

    applyCameraTransform(
      transform,
      Boolean(options.immediate)
    );

    return true;
  }

  function revealRoomInformation(
    roomId,
    visible
  ) {
    if (!STATE.panel) {
      return;
    }

    var roomNode = q(
      '[data-house-room-node="' +
        roomId +
        '"]',
      STATE.panel
    );

    if (!roomNode) {
      return;
    }

    roomNode.setAttribute(
      "data-information-visible",
      visible ? "true" : "false"
    );
  }

  function hideAllRoomInformation() {
    if (!STATE.panel) {
      return;
    }

    qa(
      "[data-house-room-node]",
      STATE.panel
    ).forEach(function hideRoomInformation(node) {
      node.setAttribute(
        "data-information-visible",
        "false"
      );
    });
  }

  function updateAvatarScaleModes() {
    if (!STATE.panel) {
      return;
    }

    Object.keys(AGENTS).forEach(
      function updateAvatarScale(agentId) {
        var avatar = q(
          '[data-house-avatar="' +
            agentId +
            '"]',
          STATE.panel
        );

        if (!avatar) {
          return;
        }

        var agent = getAgent(agentId);
        var currentRoom =
          getAgentLocation(agentId);

        var roomScaleMode =
          STATE.viewMode === VIEW_MODE.ROOM &&
          currentRoom ===
            STATE.focusedRoom;

        avatar.setAttribute(
          "data-avatar-scale-mode",
          roomScaleMode
            ? "room"
            : "overview"
        );

        avatar.style.setProperty(
          "--hcp-agent-overview-scale",
          String(agent.scale.overview)
        );

        avatar.style.setProperty(
          "--hcp-agent-room-scale",
          String(agent.scale.room)
        );

        avatar.style.setProperty(
          "--hcp-agent-conversation-scale",
          String(
            agent.scale.conversation
          )
        );
      }
    );
  }

  function roomIsRelated(
    roomId,
    comparisonRoomId
  ) {
    var room = getRoom(roomId);
    var comparisonRoom =
      getRoom(comparisonRoomId);

    return (
      room.relatedRooms.indexOf(
        comparisonRoomId
      ) !== -1 ||
      comparisonRoom.relatedRooms.indexOf(
        roomId
      ) !== -1
    );
  }

  function updateAvatarVisibility() {
    if (!STATE.panel) {
      return;
    }

    Object.keys(AGENTS).forEach(
      function updateAvatar(agentId) {
        var avatar = q(
          '[data-house-avatar="' +
            agentId +
            '"]',
          STATE.panel
        );

        if (!avatar) {
          return;
        }

        if (
          STATE.viewMode ===
            VIEW_MODE.ESTATE ||
          !STATE.focusedRoom
        ) {
          avatar.setAttribute(
            "data-camera-visible",
            "true"
          );

          return;
        }

        var currentRoomId =
          getAgentLocation(agentId);

        var visible =
          currentRoomId ===
            STATE.focusedRoom ||
          roomIsRelated(
            currentRoomId,
            STATE.focusedRoom
          );

        avatar.setAttribute(
          "data-camera-visible",
          visible ? "true" : "false"
        );
      }
    );
  }

  function enterRoomView(
    roomId,
    options
  ) {
    options = options || {};

    if (!STATE.initialized) {
      render();
    }

    var room = getRoom(roomId);
    var authorityId =
      resolveAuthority(room);

    cancelCameraTransition();
    hideArrivalSheet();
    hideAllRoomInformation();

    STATE.previousFocusedRoom =
      STATE.focusedRoom;

    STATE.focusedRoom = room.id;
    STATE.selectedRoom = room.id;
    STATE.selectedAgent =
      authorityId;

    STATE.cameraTransitioning = true;

    setViewMode(VIEW_MODE.ROOM);

    clearRoomInteractionStates();
    setCurrentPageRoom(
      STATE.currentPageRoom
    );

    markRoomState(
      room.id,
      "data-selected",
      true
    );

    markRoomState(
      room.id,
      "data-focused",
      true
    );

    markAgentState(
      authorityId,
      "data-focused",
      true
    );

    updateAvatarVisibility();
    updateAvatarScaleModes();

    notifyAvatarLife(
      "handleRoomSelected",
      {
        roomId: room.id,
        agentId: authorityId,
        room: room
      }
    );

    var token = STATE.cameraToken;

    focusRoom(room.id, {
      immediate: Boolean(
        options.immediate
      )
    });

    setStatus(
      "Entering " +
        room.label +
        ". " +
        room.summary
    );

    emit(
      "house-control-pad:camera-start",
      {
        viewMode: VIEW_MODE.ROOM,
        room: room.id,
        agent: authorityId,
        camera: clone(
          room.cameraFocus
        )
      }
    );

    var revealDelay =
      STATE.reducedMotion ||
      options.immediate
        ? 0
        : TIMING.CAMERA_MS;

    var revealTimer =
      global.setTimeout(
        function settleRoomCamera() {
          if (
            token !==
            STATE.cameraToken
          ) {
            return;
          }

          STATE.cameraTransitioning =
            false;

          revealRoomInformation(
            room.id,
            true
          );

          var roomNode = q(
            '[data-house-room-node="' +
              room.id +
              '"]',
            STATE.panel
          );

          safeFocus(roomNode);

          notifyAvatarLife(
            "handleCameraSettled",
            {
              viewMode:
                VIEW_MODE.ROOM,
              roomId: room.id,
              agentId:
                authorityId
            }
          );

          emit(
            "house-control-pad:room-view",
            {
              room: room.id,
              agent: authorityId,
              camera: clone(
                room.cameraFocus
              ),
              architecture:
                room.architecturalShape
            }
          );

          if (
            options.summon !== false
          ) {
            var summonTimer =
              global.setTimeout(
                function summonAfterCamera() {
                  if (
                    token !==
                    STATE.cameraToken
                  ) {
                    return;
                  }

                  travelToRoom(
                    room.id,
                    {
                      source:
                        "room-view",
                      preserveCamera:
                        true,
                      skipRoomView:
                        true
                    }
                  );
                },
                STATE.reducedMotion
                  ? 0
                  : TIMING.CAMERA_SETTLE_MS
              );

            STATE.cameraTimers.push(
              summonTimer
            );
          }
        },
        revealDelay
      );

    STATE.cameraTimers.push(
      revealTimer
    );

    return true;
  }

  function returnToEstate(options) {
    options = options || {};

    if (!STATE.initialized) {
      return false;
    }

    cancelCameraTransition();
    hideArrivalSheet();
    hideAllRoomInformation();

    var previousRoom =
      STATE.focusedRoom;

    STATE.previousFocusedRoom =
      previousRoom;

    STATE.focusedRoom = null;
    STATE.cameraTransitioning = true;

    setViewMode(VIEW_MODE.ESTATE);

    updateAvatarVisibility();
    updateAvatarScaleModes();

    notifyAvatarLife(
      "handleReturnToEstate",
      {
        previousRoom:
          previousRoom
      }
    );

    var token = STATE.cameraToken;

    focusRoom(DEFAULT_ROOM_ID, {
      overview: true,
      immediate: Boolean(
        options.immediate
      )
    });

    setStatus(
      previousRoom
        ? "Returned to the full estate from " +
            getRoom(previousRoom).label +
            "."
        : "Full estate overview."
    );

    emit(
      "house-control-pad:camera-start",
      {
        viewMode:
          VIEW_MODE.ESTATE,
        previousRoom:
          previousRoom
      }
    );

    var settleDelay =
      STATE.reducedMotion ||
      options.immediate
        ? 0
        : TIMING.CAMERA_MS;

    var settleTimer =
      global.setTimeout(
        function settleEstateCamera() {
          if (
            token !==
            STATE.cameraToken
          ) {
            return;
          }

          STATE.cameraTransitioning =
            false;

          if (previousRoom) {
            markRoomState(
              previousRoom,
              "data-selected",
              true
            );

            var previousRoomNode = q(
              '[data-house-room-node="' +
                previousRoom +
                '"]',
              STATE.panel
            );

            safeFocus(
              previousRoomNode
            );
          }

          notifyAvatarLife(
            "handleCameraSettled",
            {
              viewMode:
                VIEW_MODE.ESTATE,
              previousRoom:
                previousRoom
            }
          );

          emit(
            "house-control-pad:estate-view",
            {
              previousRoom:
                previousRoom
            }
          );
        },
        settleDelay
      );

    STATE.cameraTimers.push(
      settleTimer
    );

    return true;
  }

  function getEstateCanvasPixelPoint(
    percentagePoint
  ) {
    if (!STATE.estateCanvas) {
      return {
        x: 0,
        y: 0
      };
    }

    return {
      x:
        STATE.estateCanvas.offsetWidth *
        (percentagePoint.x / 100),

      y:
        STATE.estateCanvas.offsetHeight *
        (percentagePoint.y / 100)
    };
  }

  function drawTravelSegment(
    fromPoint,
    toPoint,
    index
  ) {
    if (!STATE.routeLayer) {
      return null;
    }

    var fromPixels =
      getEstateCanvasPixelPoint(
        fromPoint
      );

    var toPixels =
      getEstateCanvasPixelPoint(
        toPoint
      );

    var deltaX =
      toPixels.x - fromPixels.x;

    var deltaY =
      toPixels.y - fromPixels.y;

    var length = Math.sqrt(
      deltaX * deltaX +
      deltaY * deltaY
    );

    var angle =
      Math.atan2(
        deltaY,
        deltaX
      ) *
      180 /
      Math.PI;

    var segment = create(
      "span",
      "hcp-travel-segment",
      {
        "data-house-travel-segment":
          "true",
        "aria-hidden": "true"
      }
    );

    segment.style.left =
      fromPixels.x + "px";

    segment.style.top =
      fromPixels.y + "px";

    segment.style.width =
      length + "px";

    segment.style.transform =
      "rotate(" +
      angle +
      "deg)";

    segment.style.animationDelay =
      index * 55 + "ms";

    STATE.routeLayer.appendChild(
      segment
    );

    return segment;
  }

  function drawTravelPath(points) {
    clearTravelSegments();

    for (
      var index = 0;
      index < points.length - 1;
      index += 1
    ) {
      drawTravelSegment(
        points[index].point,
        points[index + 1].point,
        index
      );
    }
  }

  function hideArrivalSheet() {
    if (!STATE.arrivalSheet) {
      return;
    }

    STATE.arrivalSheet.setAttribute(
      "data-visible",
      "false"
    );
  }

  function showArrivalSheet(
    room,
    agent,
    sameRoom
  ) {
    if (!STATE.arrivalSheet) {
      return;
    }

    var title = q(
      "[data-hcp-arrival-title]",
      STATE.arrivalSheet
    );

    var body = q(
      "[data-hcp-arrival-body]",
      STATE.arrivalSheet
    );

    var roomButton = q(
      "[data-hcp-arrival-room]",
      STATE.arrivalSheet
    );

    var talkButton = q(
      "[data-hcp-arrival-talk]",
      STATE.arrivalSheet
    );

    if (title) {
      title.textContent =
        sameRoom
          ? agent.label +
            " is already in " +
            room.label +
            "."
          : agent.label +
            " has arrived at " +
            room.label +
            ".";
    }

    if (body) {
      body.textContent =
        agent.authorityLine;
    }

    if (roomButton) {
      roomButton.textContent =
        room.visitorCan &&
        room.visitorCan.length
          ? room.visitorCan[0]
          : "Open " +
            room.shortLabel;
    }

    if (talkButton) {
      talkButton.textContent =
        agent.actionLabel;
    }

    STATE.arrivalSheet.setAttribute(
      "data-visible",
      "true"
    );
  }

  function completeArrival(
    room,
    agent,
    sameRoom,
    token
  ) {
    if (
      token !== STATE.travelToken
    ) {
      return;
    }

    STATE.traveling = false;
    STATE.activePath = [];

    clearTimerList(
      STATE.travelTimers
    );

    clearTravelSegments();

    setAgentLocation(
      agent.id,
      room.id
    );

    setAvatarRoom(
      agent.id,
      room.id
    );

    markAgentState(
      agent.id,
      "data-traveling",
      false
    );

    markAgentState(
      agent.id,
      "data-arrived",
      true
    );

    markRoomState(
      room.id,
      "data-destination",
      false
    );

    markRoomState(
      room.id,
      "data-arrived",
      true
    );

    updateAvatarVisibility();
    updateAvatarScaleModes();

    setStatus(
      sameRoom
        ? agent.label +
            " is already in " +
            room.label +
            "."
        : agent.label +
            " has arrived at " +
            room.label +
            "."
    );

    showArrivalSheet(
      room,
      agent,
      sameRoom
    );

    notifyAvatarLife(
      "handleArrival",
      {
        roomId: room.id,
        agentId: agent.id,
        sameRoom:
          Boolean(sameRoom),
        arrivalGesture:
          room.roomBehavior
            .arrivalGesture ||
          agent.arrivalGesture
      }
    );

    emit(
      "house-control-pad:arrival",
      {
        room: room.id,
        agent: agent.id,
        sameRoom:
          Boolean(sameRoom),
        roomRoute: room.route,
        agentRoute: agent.route
      }
    );
  }

  function animateAgentAlongPath(
    agent,
    room,
    visualPoints,
    token
  ) {
    if (!visualPoints.length) {
      completeArrival(
        room,
        agent,
        false,
        token
      );

      return;
    }

    STATE.activePath =
      visualPoints.map(
        function mapVisualPoint(item) {
          return item.id;
        }
      );

    markAgentState(
      agent.id,
      "data-traveling",
      true
    );

    notifyAvatarLife(
      "handleTravelStart",
      {
        agentId: agent.id,
        roomId: room.id,
        expression:
          agent.travelExpression,
        path:
          STATE.activePath.slice()
      }
    );

    drawTravelPath(
      visualPoints
    );

    for (
      var index = 1;
      index < visualPoints.length;
      index += 1
    ) {
      (function schedulePoint(
        pointItem,
        pointIndex
      ) {
        var timer =
          global.setTimeout(
            function moveAgent() {
              if (
                token !==
                STATE.travelToken
              ) {
                return;
              }

              setAvatarPoint(
                agent.id,
                pointItem.point,
                pointItem.roomId
              );

              notifyAvatarLife(
                "handleTravelStep",
                {
                  agentId:
                    agent.id,
                  roomId:
                    pointItem.roomId,
                  nodeId:
                    pointItem.id,
                  index:
                    pointIndex
                }
              );
            },
            STATE.reducedMotion
              ? 0
              : pointIndex *
                  TIMING.TRAVEL_SEGMENT_MS
          );

        STATE.travelTimers.push(
          timer
        );
      })(
        visualPoints[index],
        index
      );
    }

    var completionDelay =
      STATE.reducedMotion
        ? 0
        : Math.max(
            1,
            visualPoints.length - 1
          ) *
            TIMING.TRAVEL_SEGMENT_MS +
          TIMING.TRAVEL_SETTLE_MS;

    var completionTimer =
      global.setTimeout(
        function finishTravel() {
          completeArrival(
            room,
            agent,
            false,
            token
          );
        },
        completionDelay
      );

    STATE.travelTimers.push(
      completionTimer
    );
  }

  function travelToRoom(
    roomId,
    options
  ) {
    options = options || {};

    if (!STATE.initialized) {
      render();
    }

    if (!STATE.isOpen) {
      openControlPad({
        room: roomId
      });
    }

    var room = getRoom(roomId);

    if (
      STATE.viewMode ===
        VIEW_MODE.ESTATE &&
      options.skipRoomView !== true
    ) {
      enterRoomView(room.id, {
        summon: false
      });

      var cameraToken =
        STATE.cameraToken;

      var delayedTravel =
        global.setTimeout(
          function travelAfterRoomView() {
            if (
              cameraToken !==
              STATE.cameraToken
            ) {
              return;
            }

            travelToRoom(
              room.id,
              {
                source:
                  options.source ||
                  "estate-selection",
                preserveCamera: true,
                skipRoomView: true,
                agent:
                  options.agent
              }
            );
          },
          STATE.reducedMotion
            ? 0
            : TIMING.CAMERA_MS +
                TIMING.CAMERA_SETTLE_MS
        );

      STATE.cameraTimers.push(
        delayedTravel
      );

      return true;
    }

    cancelTravel({
      silent: true
    });

    hideArrivalSheet();

    var authorityId =
      options.agent &&
      agentExists(options.agent)
        ? options.agent
        : resolveAuthority(room);

    var agent =
      getAgent(authorityId);

    var fromRoomId =
      getAgentLocation(agent.id);

    var token =
      STATE.travelToken;

    STATE.selectedRoom =
      room.id;

    STATE.selectedAgent =
      agent.id;

    clearRoomInteractionStates();
    setCurrentPageRoom(
      STATE.currentPageRoom
    );

    markRoomState(
      room.id,
      "data-selected",
      true
    );

    markRoomState(
      room.id,
      "data-destination",
      true
    );

    markRoomState(
      room.id,
      "data-focused",
      true
    );

    markAgentState(
      agent.id,
      "data-selected",
      true
    );

    markAgentState(
      agent.id,
      "data-focused",
      true
    );

    revealRoomInformation(
      room.id,
      true
    );

    if (
      fromRoomId === room.id
    ) {
      completeArrival(
        room,
        agent,
        true,
        token
      );

      emit(
        "house-control-pad:same-room",
        {
          room: room.id,
          agent: agent.id
        }
      );

      return true;
    }

    var graphPath =
      findGraphPath(
        fromRoomId,
        room.id
      );

    if (!graphPath.length) {
      setStatus(
        "No declared corridor route connects " +
          getRoom(fromRoomId).label +
          " to " +
          room.label +
          "."
      );

      emit(
        "house-control-pad:route-unavailable",
        {
          agent: agent.id,
          from: fromRoomId,
          to: room.id
        }
      );

      return false;
    }

    var visualPoints =
      graphPathToVisualPoints(
        graphPath
      );

    STATE.traveling = true;

    setStatus(
      agent.label +
        " is traveling from " +
        getRoom(fromRoomId).label +
        " to " +
        room.label +
        "."
    );

    animateAgentAlongPath(
      agent,
      room,
      visualPoints,
      token
    );

    emit(
      "house-control-pad:travel",
      {
        source:
          options.source ||
          "unknown",
        room: room.id,
        agent: agent.id,
        from: fromRoomId,
        to: room.id,
        graphPath:
          graphPath.slice()
      }
    );

    return true;
  }

  function positionZone(
    node,
    zone
  ) {
    node.style.left =
      zone.x + "%";

    node.style.top =
      zone.y + "%";

    node.style.width =
      zone.width + "%";

    node.style.height =
      zone.height + "%";
  }

  function buildFeatureNode(feature) {
    var featureNode = create(
      "span",
      "hcp-room-feature hcp-room-feature-" +
        feature.type,
      {
        "data-house-feature-type":
          feature.type,
        "aria-hidden": "true"
      }
    );

    featureNode.style.left =
      feature.x + "%";

    featureNode.style.top =
      feature.y + "%";

    featureNode.style.width =
      feature.width + "%";

    featureNode.style.height =
      feature.height + "%";

    return featureNode;
  }

  function navigateToRoute(route) {
    if (!route) {
      return;
    }

    global.location.href = route;
  }

  function buildRoomActions(room) {
    var actionContainer = create(
      "div",
      "hcp-room-actions",
      {
        "data-house-room-actions":
          room.id
      }
    );

    var authorityId =
      resolveAuthority(room);

    var authority =
      getAgent(authorityId);

    var primary = create(
      "button",
      "hcp-room-action hcp-room-action-primary",
      {
        type: "button",
        "data-house-room-open":
          room.id,
        text:
          room.visitorCan &&
          room.visitorCan.length
            ? room.visitorCan[0]
            : "Open Room"
      }
    );

    var talk = create(
      "button",
      "hcp-room-action",
      {
        type: "button",
        "data-house-agent-open":
          authority.id,
        text:
          authority.actionLabel
      }
    );

    var relatedRoomId =
      room.relatedRooms &&
      room.relatedRooms.length
        ? room.relatedRooms[0]
        : null;

    var related = create(
      "button",
      "hcp-room-action",
      {
        type: "button",
        text: relatedRoomId
          ? "Visit " +
            getRoom(
              relatedRoomId
            ).shortLabel
          : "Return to Estate"
      }
    );

    var back = create(
      "button",
      "hcp-room-action hcp-room-action-muted",
      {
        type: "button",
        text: "Return to Estate"
      }
    );

    primary.addEventListener(
      "click",
      function openRoom(event) {
        event.stopPropagation();

        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "room-action",
            roomId: room.id
          }
        );

        navigateToRoute(
          room.route
        );
      }
    );

    talk.addEventListener(
      "click",
      function openGuide(event) {
        event.stopPropagation();

        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "guide-action",
            agentId:
              authority.id
          }
        );

        navigateToRoute(
          authority.route
        );
      }
    );

    related.addEventListener(
      "click",
      function openRelated(event) {
        event.stopPropagation();

        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "related-room-action",
            roomId:
              relatedRoomId
          }
        );

        if (relatedRoomId) {
          enterRoomView(
            relatedRoomId
          );
        } else {
          returnToEstate();
        }
      }
    );

    back.addEventListener(
      "click",
      function returnFromRoom(event) {
        event.stopPropagation();

        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "return-to-estate"
          }
        );

        returnToEstate();
      }
    );

    actionContainer.appendChild(
      primary
    );

    actionContainer.appendChild(
      talk
    );

    actionContainer.appendChild(
      related
    );

    actionContainer.appendChild(
      back
    );

    return actionContainer;
  }

  function buildRoomNode(room) {
    var authority =
      getAgent(
        resolveAuthority(room)
      );

    var roomNode = create(
      "section",
      [
        "hcp-room-node",
        "hcp-room-" + room.type,
        "hcp-room-rank-" + room.rank,
        "hcp-room-shape-" +
          room.architecturalShape,
        "hcp-room-wing-" +
          room.estateWing
      ].join(" "),
      {
        tabindex: "0",
        role: "button",
        "data-house-room-node":
          room.id,
        "data-house-room-type":
          room.type,
        "data-house-room-rank":
          room.rank,
        "data-house-room-shape":
          room.architecturalShape,
        "data-house-cardinal-sector":
          room.cardinalSector,
        "data-house-estate-wing":
          room.estateWing,
        "data-current": "false",
        "data-selected": "false",
        "data-destination":
          "false",
        "data-arrived": "false",
        "data-focused": "false",
        "data-information-visible":
          "false",
        "data-summary-active":
          "false",
        "aria-label":
          room.label +
          ". " +
          room.summary +
          " Guide: " +
          authority.label +
          "."
      }
    );

    roomNode.style.left =
      room.x + "%";

    roomNode.style.top =
      room.y + "%";

    roomNode.style.width =
      room.width + "%";

    roomNode.style.height =
      room.height + "%";

    var architecture = create(
      "div",
      "hcp-room-architecture",
      {
        "aria-hidden": "true"
      }
    );

    room.architecturalFeatureZones.forEach(
      function appendFeature(feature) {
        architecture.appendChild(
          buildFeatureNode(feature)
        );
      }
    );

    var labelZone = create(
      "div",
      "hcp-room-label-zone"
    );

    positionZone(
      labelZone,
      room.labelZone
    );

    labelZone.appendChild(
      create(
        "span",
        "hcp-room-label",
        {
          text:
            room.shortLabel
        }
      )
    );

    labelZone.appendChild(
      create(
        "span",
        "hcp-room-category",
        {
          text:
            room.categoryLabel
        }
      )
    );

    var summaryZone = create(
      "div",
      "hcp-room-summary-zone"
    );

    positionZone(
      summaryZone,
      room.summaryZone
    );

    summaryZone.appendChild(
      create(
        "p",
        "hcp-room-summary",
        {
          text: room.summary
        }
      )
    );

    summaryZone.appendChild(
      create(
        "span",
        "hcp-room-guide",
        {
          text:
            "Guide: " +
            authority.label
        }
      )
    );

    var detailZone = create(
      "div",
      "hcp-room-detail-zone"
    );

    positionZone(
      detailZone,
      room.detailZone
    );

    detailZone.appendChild(
      create(
        "h3",
        "hcp-room-detail-title",
        {
          text: room.label
        }
      )
    );

    detailZone.appendChild(
      create(
        "p",
        "hcp-room-detail-copy",
        {
          text: room.detail
        }
      )
    );

    var visitorList = create(
      "ul",
      "hcp-room-visitor-list"
    );

    room.visitorCan.forEach(
      function appendVisitorItem(item) {
        visitorList.appendChild(
          create(
            "li",
            "",
            {
              text: item
            }
          )
        );
      }
    );

    detailZone.appendChild(
      visitorList
    );

    var portraitZone = create(
      "div",
      "hcp-room-portrait-zone",
      {
        "aria-hidden": "true"
      }
    );

    positionZone(
      portraitZone,
      room.portraitZone
    );

    var actionZone = create(
      "div",
      "hcp-room-action-zone"
    );

    positionZone(
      actionZone,
      room.actionZone
    );

    actionZone.appendChild(
      buildRoomActions(room)
    );

    roomNode.appendChild(
      architecture
    );

    roomNode.appendChild(
      labelZone
    );

    roomNode.appendChild(
      summaryZone
    );

    roomNode.appendChild(
      detailZone
    );

    roomNode.appendChild(
      portraitZone
    );

    roomNode.appendChild(
      actionZone
    );

    roomNode.addEventListener(
      "click",
      function selectRoom(event) {
        if (
          event.target.closest(
            "button"
          )
        ) {
          return;
        }

        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "room-selection",
            roomId: room.id
          }
        );

        if (
          STATE.viewMode ===
            VIEW_MODE.ROOM &&
          STATE.focusedRoom ===
            room.id
        ) {
          revealRoomInformation(
            room.id,
            true
          );

          return;
        }

        enterRoomView(room.id);
      }
    );

    roomNode.addEventListener(
      "keydown",
      function activateRoom(event) {
        if (
          event.key !== "Enter" &&
          event.key !== " "
        ) {
          return;
        }

        event.preventDefault();

        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "room-keyboard-selection",
            roomId: room.id
          }
        );

        if (
          STATE.viewMode ===
            VIEW_MODE.ROOM &&
          STATE.focusedRoom ===
            room.id
        ) {
          revealRoomInformation(
            room.id,
            true
          );

          return;
        }

        enterRoomView(room.id);
      }
    );

    roomNode.addEventListener(
      "mouseenter",
      function activateSummary() {
        roomNode.setAttribute(
          "data-summary-active",
          "true"
        );
      }
    );

    roomNode.addEventListener(
      "mouseleave",
      function deactivateSummary() {
        roomNode.setAttribute(
          "data-summary-active",
          "false"
        );
      }
    );

    roomNode.addEventListener(
      "focus",
      function focusSummary() {
        roomNode.setAttribute(
          "data-summary-active",
          "true"
        );
      }
    );

    roomNode.addEventListener(
      "blur",
      function blurSummary() {
        roomNode.setAttribute(
          "data-summary-active",
          "false"
        );
      }
    );

    return roomNode;
  }

  function buildAvatarAnatomy(agent) {
    var identity =
      agent.visualIdentity;

    var portrait = create(
      "span",
      [
        "hcp-avatar-portrait",
        "hcp-silhouette-" +
          identity.silhouette,
        "hcp-face-shape-" +
          identity.faceShape,
        "hcp-hair-" +
          identity.hairStyle,
        "hcp-brows-" +
          identity.browStyle,
        "hcp-eyes-" +
          identity.eyeStyle,
        "hcp-mouth-" +
          identity.mouthStyle,
        "hcp-clothing-" +
          identity.clothingStyle,
        "hcp-posture-" +
          identity.posture,
        "hcp-accessory-" +
          identity.accessory,
        "hcp-cue-" +
          identity.identityCue
      ].join(" "),
      {
        "aria-hidden": "true"
      }
    );

    var frame = create(
      "span",
      "hcp-portrait-frame"
    );

    var torso = create(
      "span",
      "hcp-portrait-torso"
    );

    var shoulders = create(
      "span",
      "hcp-portrait-shoulders"
    );

    var clothing = create(
      "span",
      "hcp-portrait-clothing"
    );

    var neck = create(
      "span",
      "hcp-portrait-neck"
    );

    var ears = create(
      "span",
      "hcp-portrait-ears"
    );

    var head = create(
      "span",
      "hcp-portrait-head"
    );

    var hairBack = create(
      "span",
      "hcp-portrait-hair-back"
    );

    var hairFront = create(
      "span",
      "hcp-portrait-hair-front"
    );

    var brows = create(
      "span",
      "hcp-portrait-brows"
    );

    var eyes = create(
      "span",
      "hcp-portrait-eyes"
    );

    var leftEye = create(
      "span",
      "hcp-portrait-eye hcp-portrait-eye-left"
    );

    var rightEye = create(
      "span",
      "hcp-portrait-eye hcp-portrait-eye-right"
    );

    var leftLid = create(
      "span",
      "hcp-portrait-lid hcp-portrait-lid-left"
    );

    var rightLid = create(
      "span",
      "hcp-portrait-lid hcp-portrait-lid-right"
    );

    var pupils = create(
      "span",
      "hcp-portrait-pupils"
    );

    var leftPupil = create(
      "span",
      "hcp-portrait-pupil hcp-portrait-pupil-left"
    );

    var rightPupil = create(
      "span",
      "hcp-portrait-pupil hcp-portrait-pupil-right"
    );

    var nose = create(
      "span",
      "hcp-portrait-nose"
    );

    var mouth = create(
      "span",
      "hcp-portrait-mouth"
    );

    var accessory = create(
      "span",
      "hcp-portrait-accessory"
    );

    var identityCue = create(
      "span",
      "hcp-portrait-identity-cue"
    );

    var badge = create(
      "span",
      "hcp-portrait-badge",
      {
        text:
          agent.label.charAt(0)
      }
    );

    leftEye.appendChild(
      leftLid
    );

    rightEye.appendChild(
      rightLid
    );

    pupils.appendChild(
      leftPupil
    );

    pupils.appendChild(
      rightPupil
    );

    eyes.appendChild(
      leftEye
    );

    eyes.appendChild(
      rightEye
    );

    eyes.appendChild(
      pupils
    );

    head.appendChild(
      brows
    );

    head.appendChild(
      eyes
    );

    head.appendChild(
      nose
    );

    head.appendChild(
      mouth
    );

    torso.appendChild(
      shoulders
    );

    torso.appendChild(
      clothing
    );

    torso.appendChild(
      neck
    );

    frame.appendChild(
      torso
    );

    frame.appendChild(
      ears
    );

    frame.appendChild(
      hairBack
    );

    frame.appendChild(
      head
    );

    frame.appendChild(
      hairFront
    );

    frame.appendChild(
      accessory
    );

    frame.appendChild(
      identityCue
    );

    frame.appendChild(
      badge
    );

    portrait.appendChild(
      frame
    );

    return portrait;
  }

  function buildAvatar(agent) {
    var avatar = create(
      "button",
      "hcp-avatar hcp-avatar-" +
        agent.id,
      {
        type: "button",
        "data-house-avatar":
          agent.id,
        "data-avatar-state":
          "resting",
        "data-avatar-gesture": "",
        "data-avatar-expression":
          "",
        "data-avatar-scale-mode":
          "overview",
        "data-camera-visible":
          "true",
        "data-blinking": "false",
        "data-blink-type": "",
        "data-traveling":
          "false",
        "data-arrived": "false",
        "data-selected": "false",
        "data-focused": "false",
        "data-current-room":
          agent.homeRoom,
        "aria-label":
          agent.label +
          ". " +
          agent.description
      }
    );

    avatar.appendChild(
      buildAvatarAnatomy(agent)
    );

    avatar.appendChild(
      create(
        "span",
        "hcp-avatar-nameplate",
        {
          text: agent.label
        }
      )
    );

    avatar.addEventListener(
      "click",
      function selectAvatar(event) {
        event.stopPropagation();

        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "avatar-selection",
            agentId: agent.id
          }
        );

        enterRoomView(
          getAgentLocation(
            agent.id
          ),
          {
            summon: false
          }
        );
      }
    );

    return avatar;
  }

  function buildHeader() {
    var header = create(
      "header",
      "hcp-header"
    );

    var titleWrap = create(
      "div",
      "hcp-title-wrap"
    );

    titleWrap.appendChild(
      create(
        "div",
        "hcp-kicker",
        {
          text:
            "Universal House Controller"
        }
      )
    );

    titleWrap.appendChild(
      create(
        "h2",
        "hcp-title",
        {
          text:
            "Choose a room. The House summons the right guide."
        }
      )
    );

    titleWrap.appendChild(
      create(
        "p",
        "hcp-subtitle",
        {
          text:
            "Explore the estate, enter a room, understand its purpose, and meet its resident guide."
        }
      )
    );

    var controls = create(
      "div",
      "hcp-header-controls"
    );

    var returnButton = create(
      "button",
      "hcp-return-estate",
      {
        type: "button",
        hidden: "hidden",
        text: "Return to Estate"
      }
    );

    var closeButton = create(
      "button",
      "hcp-close",
      {
        type: "button",
        "data-house-control-pad-close":
          "true",
        "aria-label":
          "Close House controller",
        text: "×"
      }
    );

    returnButton.addEventListener(
      "click",
      function returnFromHeader() {
        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "header-return"
          }
        );

        returnToEstate();
      }
    );

    closeButton.addEventListener(
      "click",
      closeControlPad
    );

    controls.appendChild(
      returnButton
    );

    controls.appendChild(
      closeButton
    );

    header.appendChild(
      titleWrap
    );

    header.appendChild(
      controls
    );

    STATE.header = header;
    STATE.returnButton =
      returnButton;
    STATE.closeButton =
      closeButton;

    return header;
  }

  function buildArrivalSheet() {
    var sheet = create(
      "section",
      "hcp-arrival-sheet",
      {
        "data-house-control-pad-arrival":
          "true",
        "data-visible": "false",
        "aria-label":
          "Guide arrival"
      }
    );

    var content = create(
      "div",
      "hcp-arrival-content"
    );

    content.appendChild(
      create(
        "div",
        "hcp-arrival-eyebrow",
        {
          text:
            "Guide Authority"
        }
      )
    );

    content.appendChild(
      create(
        "h3",
        "hcp-arrival-title",
        {
          "data-hcp-arrival-title":
            "true",
          text:
            "Choose a room."
        }
      )
    );

    content.appendChild(
      create(
        "p",
        "hcp-arrival-body",
        {
          "data-hcp-arrival-body":
            "true",
          text:
            "The House will summon the correct guide."
        }
      )
    );

    var actions = create(
      "div",
      "hcp-arrival-actions"
    );

    var roomButton = create(
      "button",
      "hcp-arrival-action hcp-arrival-primary",
      {
        type: "button",
        "data-hcp-arrival-room":
          "true",
        text: "Open Room"
      }
    );

    var talkButton = create(
      "button",
      "hcp-arrival-action",
      {
        type: "button",
        "data-hcp-arrival-talk":
          "true",
        text: "Talk to Guide"
      }
    );

    var dismissButton = create(
      "button",
      "hcp-arrival-action hcp-arrival-muted",
      {
        type: "button",
        text: "Dismiss"
      }
    );

    roomButton.addEventListener(
      "click",
      function openSelectedRoom() {
        if (!STATE.selectedRoom) {
          return;
        }

        navigateToRoute(
          getRoom(
            STATE.selectedRoom
          ).route
        );
      }
    );

    talkButton.addEventListener(
      "click",
      function openSelectedAgent() {
        if (!STATE.selectedAgent) {
          return;
        }

        navigateToRoute(
          getAgent(
            STATE.selectedAgent
          ).route
        );
      }
    );

    dismissButton.addEventListener(
      "click",
      hideArrivalSheet
    );

    actions.appendChild(
      roomButton
    );

    actions.appendChild(
      talkButton
    );

    actions.appendChild(
      dismissButton
    );

    content.appendChild(
      actions
    );

    sheet.appendChild(
      content
    );

    STATE.arrivalSheet =
      sheet;

    return sheet;
  }

  function buildFooter() {
    var footer = create(
      "footer",
      "hcp-footer"
    );

    var status = create(
      "div",
      "hcp-status",
      {
        "data-house-control-pad-status":
          "true",
        "aria-live": "polite",
        text:
          "House controller ready."
      }
    );

    var actions = create(
      "div",
      "hcp-footer-actions"
    );

    var summonButton = create(
      "button",
      "hcp-footer-button",
      {
        type: "button",
        text:
          "Summon guide for this page"
      }
    );

    summonButton.addEventListener(
      "click",
      function summonCurrentPageGuide() {
        notifyAvatarLife(
          "recordInteraction",
          {
            source:
              "page-guide-summon",
            roomId:
              STATE.currentPageRoom
          }
        );

        enterRoomView(
          STATE.currentPageRoom
        );
      }
    );

    actions.appendChild(
      summonButton
    );

    footer.appendChild(
      status
    );

    footer.appendChild(
      actions
    );

    STATE.status = status;

    return footer;
  }

  function buildEstate() {
    var viewport = create(
      "section",
      "hcp-estate-viewport",
      {
        "data-house-estate-viewport":
          "true",
        tabindex: "0",
        "aria-label":
          "Immersive House estate"
      }
    );

    var stage = create(
      "div",
      "hcp-estate-stage",
      {
        "data-house-estate-stage":
          "true"
      }
    );

    var canvas = create(
      "div",
      "hcp-estate-canvas",
      {
        "data-house-estate-canvas":
          "true",
        "data-blueprint-layout":
          "immersive-cardinal-estate"
      }
    );

    var routeLayer = create(
      "div",
      "hcp-route-layer",
      {
        "data-house-route-layer":
          "true",
        "aria-hidden": "true"
      }
    );

    var roomLayer = create(
      "div",
      "hcp-room-layer",
      {
        "data-house-room-layer":
          "true"
      }
    );

    Object.keys(ROOMS).forEach(
      function appendRoom(roomId) {
        var room =
          ROOMS[roomId];

        if (room.visible !== false) {
          roomLayer.appendChild(
            buildRoomNode(room)
          );
        }
      }
    );

    var avatarLayer = create(
      "div",
      "hcp-avatar-layer",
      {
        "data-house-avatar-layer":
          "true"
      }
    );

    Object.keys(AGENTS).forEach(
      function appendAvatar(agentId) {
        avatarLayer.appendChild(
          buildAvatar(
            AGENTS[agentId]
          )
        );
      }
    );

    canvas.appendChild(
      routeLayer
    );

    canvas.appendChild(
      roomLayer
    );

    canvas.appendChild(
      avatarLayer
    );

    stage.appendChild(
      canvas
    );

    viewport.appendChild(
      stage
    );

    STATE.estateViewport =
      viewport;

    STATE.estateStage =
      stage;

    STATE.estateCanvas =
      canvas;

    STATE.routeLayer =
      routeLayer;

    STATE.roomLayer =
      roomLayer;

    STATE.avatarLayer =
      avatarLayer;

    return viewport;
  }

  function buildPanel() {
    var overlay = create(
      "div",
      "hcp-overlay",
      {
        "data-house-control-pad-overlay":
          "true",
        "data-open": "false",
        role: "dialog",
        "aria-modal": "true",
        "aria-label":
          "House controller"
      }
    );

    var panel = create(
      "div",
      "hcp-panel",
      {
        "data-house-control-pad-panel":
          "true",
        "data-house-view-mode":
          VIEW_MODE.ESTATE,
        "data-house-zoom-level":
          "1"
      }
    );

    panel.appendChild(
      buildHeader()
    );

    panel.appendChild(
      buildEstate()
    );

    panel.appendChild(
      buildArrivalSheet()
    );

    panel.appendChild(
      buildFooter()
    );

    overlay.appendChild(
      panel
    );

    overlay.addEventListener(
      "click",
      function closeFromBackdrop(event) {
        if (event.target === overlay) {
          closeControlPad();
        }
      }
    );

    STATE.overlay = overlay;
    STATE.panel = panel;

    return overlay;
  }

  function render() {
    ensureRoot();

    cancelCameraTransition();

    cancelTravel({
      silent: true
    });

    notifyAvatarLife(
      "handleControllerRenderStart"
    );

    if (
      STATE.overlay &&
      STATE.overlay.parentNode
    ) {
      STATE.overlay.parentNode.removeChild(
        STATE.overlay
      );
    }

    document.body.appendChild(
      buildPanel()
    );

    restoreAgentPositions();
    updateAvatarScaleModes();
    updateAvatarVisibility();

    setCurrentPageRoom(
      STATE.currentPageRoom
    );

    STATE.initialized = true;
    STATE.ready = true;

    document.documentElement.setAttribute(
      "data-house-control-pad-ready",
      "true"
    );

    document.documentElement.setAttribute(
      "data-house-control-pad-layout",
      "immersive-cardinal-estate"
    );

    notifyAvatarLife(
      "bindController",
      getAvatarLifeBridge()
    );

    emit(
      "house-control-pad:ready",
      {
        dataContract:
          DATA_CONTRACT,
        currentPageRoom:
          STATE.currentPageRoom,
        viewMode:
          STATE.viewMode,
        roomFirst: true,
        immersiveCamera: true,
        uniqueArchitecture:
          true,
        separatedAvatarLife:
          true
      }
    );
  }

  function openControlPad(options) {
    options = options || {};

    if (!STATE.initialized) {
      render();
    }

    cancelCameraTransition();

    cancelTravel({
      silent: true
    });

    hideArrivalSheet();
    hideAllRoomInformation();
    clearRoomInteractionStates();

    STATE.previousFocus =
      document.activeElement;

    STATE.currentPageRoom =
      getRoom(
        options.room ||
          getCurrentRoomFromDOM()
      ).id;

    STATE.selectedRoom = null;
    STATE.selectedAgent = null;
    STATE.focusedRoom = null;
    STATE.previousFocusedRoom =
      null;

    setCurrentPageRoom(
      STATE.currentPageRoom
    );

    setViewMode(
      VIEW_MODE.ESTATE
    );

    STATE.overlay.setAttribute(
      "data-open",
      "true"
    );

    STATE.isOpen = true;

    setDocumentOpenState(true);

    restoreAgentPositions();
    updateAvatarScaleModes();
    updateAvatarVisibility();

    setStatus(
      "Estate overview. Select a room to zoom in and meet its guide."
    );

    document.addEventListener(
      "keydown",
      handleKeydown
    );

    notifyAvatarLife(
      "recordInteraction",
      {
        source:
          "controller-open"
      }
    );

    notifyAvatarLife(
      "start",
      getAvatarLifeBridge()
    );

    global.setTimeout(
      function initializeEstateCamera() {
        focusRoom(
          DEFAULT_ROOM_ID,
          {
            overview: true,
            immediate: true
          }
        );

        safeFocus(
          STATE.estateViewport
        );
      },
      40
    );

    if (options.autoSummon) {
      global.setTimeout(
        function autoSummonCurrentRoom() {
          enterRoomView(
            STATE.currentPageRoom
          );
        },
        220
      );
    }

    emit(
      "house-control-pad:open",
      {
        currentPageRoom:
          STATE.currentPageRoom,
        viewMode:
          VIEW_MODE.ESTATE
      }
    );

    return true;
  }

  function closeControlPad() {
    if (!STATE.overlay) {
      return false;
    }

    cancelCameraTransition();

    cancelTravel({
      silent: true
    });

    hideArrivalSheet();

    notifyAvatarLife(
      "stop",
      {
        reason:
          "controller-close"
      }
    );

    STATE.overlay.setAttribute(
      "data-open",
      "false"
    );

    STATE.isOpen = false;

    setDocumentOpenState(false);

    document.removeEventListener(
      "keydown",
      handleKeydown
    );

    if (STATE.previousFocus) {
      safeFocus(
        STATE.previousFocus
      );

      STATE.previousFocus =
        null;
    }

    emit(
      "house-control-pad:close"
    );

    return true;
  }

  function handleResize() {
    if (!STATE.isOpen) {
      return;
    }

    if (STATE.resizeFrame) {
      global.cancelAnimationFrame(
        STATE.resizeFrame
      );
    }

    STATE.resizeFrame =
      global.requestAnimationFrame(
        function refitCamera() {
          STATE.resizeFrame = 0;

          if (
            STATE.viewMode ===
              VIEW_MODE.ROOM &&
            STATE.focusedRoom
          ) {
            focusRoom(
              STATE.focusedRoom,
              {
                immediate: true
              }
            );
          } else {
            focusRoom(
              DEFAULT_ROOM_ID,
              {
                overview: true,
                immediate: true
              }
            );
          }
        }
      );
  }

  function detectReducedMotion() {
    var media = global.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    STATE.reducedMotionMedia =
      media;

    STATE.reducedMotion =
      media.matches;

    document.documentElement.setAttribute(
      "data-house-reduced-motion",
      STATE.reducedMotion
        ? "true"
        : "false"
    );

    function handleChange(event) {
      STATE.reducedMotion =
        event.matches;

      document.documentElement.setAttribute(
        "data-house-reduced-motion",
        STATE.reducedMotion
          ? "true"
          : "false"
      );

      notifyAvatarLife(
        "handleReducedMotionChange",
        {
          reducedMotion:
            STATE.reducedMotion
        }
      );

      handleResize();
    }

    if (
      typeof media.addEventListener ===
      "function"
    ) {
      media.addEventListener(
        "change",
        handleChange
      );
    } else if (
      typeof media.addListener ===
      "function"
    ) {
      media.addListener(
        handleChange
      );
    }
  }

  function bindOpenButtons() {
    qa(
      "[data-house-control-pad-open]"
    ).forEach(function bindButton(button) {
      if (
        STATE.boundOpenButtons.has(
          button
        )
      ) {
        return;
      }

      STATE.boundOpenButtons.add(
        button
      );

      button.addEventListener(
        "click",
        function openFromButton() {
          openControlPad({
            room:
              button.getAttribute(
                "data-house-room"
              ) ||
              getCurrentRoomFromDOM(),

            autoSummon:
              button.getAttribute(
                "data-house-control-pad-auto-summon"
              ) === "true"
          });
        }
      );
    });
  }

  function getRouteGraph() {
    var graph = {};

    Object.keys(ROOMS).forEach(
      function addRoom(roomId) {
        graph[
          getRoomAnchorId(roomId)
        ] = getGraphNeighbors(
          getRoomAnchorId(roomId)
        );
      }
    );

    Object.keys(CORRIDORS).forEach(
      function addCorridor(corridorId) {
        graph[corridorId] =
          getGraphNeighbors(
            corridorId
          );
      }
    );

    return clone(graph);
  }

  function getEstateState() {
    return {
      contract: CONTRACT,
      dataContract:
        DATA.contract,
      initialized:
        STATE.initialized,
      ready:
        STATE.ready,
      isOpen:
        STATE.isOpen,

      currentPageRoom:
        STATE.currentPageRoom,
      selectedRoom:
        STATE.selectedRoom,
      selectedAgent:
        STATE.selectedAgent,

      viewMode:
        STATE.viewMode,
      zoomLevel:
        STATE.zoomLevel,
      focusedRoom:
        STATE.focusedRoom,
      previousFocusedRoom:
        STATE.previousFocusedRoom,

      cameraTransitioning:
        STATE.cameraTransitioning,
      traveling:
        STATE.traveling,
      activePath:
        STATE.activePath.slice(),

      reducedMotion:
        STATE.reducedMotion,

      agentLocations:
        clone(
          STATE.agentLocations
        )
    };
  }

  function getAvatarElement(agentId) {
    if (!STATE.panel) {
      return null;
    }

    return q(
      '[data-house-avatar="' +
        agentId +
        '"]',
      STATE.panel
    );
  }

  function getRoomElement(roomId) {
    if (!STATE.panel) {
      return null;
    }

    return q(
      '[data-house-room-node="' +
        roomId +
        '"]',
      STATE.panel
    );
  }

  function setAvatarDOMState(
    agentId,
    state
  ) {
    var avatar =
      getAvatarElement(agentId);

    if (!avatar) {
      return false;
    }

    if (
      state.primaryState
    ) {
      avatar.setAttribute(
        "data-avatar-state",
        state.primaryState
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

    return true;
  }

  function getAvatarLifeBridge() {
    return {
      contract: CONTRACT,
      data: DATA,

      getState:
        getEstateState,

      getAvatarElement:
        getAvatarElement,

      getRoomElement:
        getRoomElement,

      getAgentLocation:
        getAgentLocation,

      setAvatarDOMState:
        setAvatarDOMState,

      isOpen: function isOpen() {
        return STATE.isOpen;
      },

      isCameraTransitioning:
        function isCameraTransitioning() {
          return STATE.cameraTransitioning;
        },

      isTraveling:
        function isTraveling(agentId) {
          if (!agentId) {
            return STATE.traveling;
          }

          var avatar =
            getAvatarElement(
              agentId
            );

          return Boolean(
            avatar &&
            avatar.getAttribute(
              "data-traveling"
            ) === "true"
          );
        },

      getFocusedRoom:
        function getFocusedRoom() {
          return STATE.focusedRoom;
        },

      getViewMode:
        getViewMode,

      getReducedMotion:
        function getReducedMotion() {
          return STATE.reducedMotion;
        },

      emit: emit
    };
  }

  function registerRoom() {
    throw new Error(
      "Runtime room mutation is disabled in the separated data architecture. " +
        "Add rooms to house.control-pad.data.js."
    );
  }

  function registerAgent() {
    throw new Error(
      "Runtime agent mutation is disabled in the separated data architecture. " +
        "Add agents to house.control-pad.data.js."
    );
  }

  function cleanup() {
    cancelCameraTransition();

    cancelTravel({
      silent: true
    });

    notifyAvatarLife(
      "destroy"
    );

    if (STATE.resizeFrame) {
      global.cancelAnimationFrame(
        STATE.resizeFrame
      );

      STATE.resizeFrame = 0;
    }
  }

  function boot() {
    var validation =
      typeof DATA.getValidationReport ===
      "function"
        ? DATA.getValidationReport()
        : null;

    if (
      validation &&
      !validation.valid
    ) {
      reportFatal(
        "House Control Pad data validation failed: " +
          validation.errors.join(
            " | "
          )
      );

      return;
    }

    STATE.currentPageRoom =
      getCurrentRoomFromDOM();

    detectReducedMotion();
    ensureRoot();
    render();
    bindOpenButtons();

    global.addEventListener(
      "resize",
      handleResize,
      {
        passive: true
      }
    );

    global.addEventListener(
      "orientationchange",
      handleResize,
      {
        passive: true
      }
    );

    global.addEventListener(
      "beforeunload",
      cleanup
    );

    global.HOUSE_CONTROL_PAD = {
      contract: CONTRACT,
      dataContract:
        DATA.contract,

      open:
        openControlPad,

      close:
        closeControlPad,

      travelToRoom:
        travelToRoom,

      enterRoomView:
        enterRoomView,

      returnToEstate:
        returnToEstate,

      focusRoom:
        focusRoom,

      getRouteGraph:
        getRouteGraph,

      getAgentLocation:
        getAgentLocation,

      resetAgentLocations:
        resetAgentLocations,

      getEstateState:
        getEstateState,

      getState:
        getEstateState,

      getViewMode:
        getViewMode,

      getAvatarElement:
        getAvatarElement,

      getRoomElement:
        getRoomElement,

      getAvatarLifeBridge:
        getAvatarLifeBridge,

      registerRoom:
        registerRoom,

      registerAgent:
        registerAgent,

      rooms:
        ROOMS,

      agents:
        AGENTS,

      corridors:
        CORRIDORS,

      data:
        DATA
    };

    emit(
      "house-control-pad:controller-ready",
      {
        dataContract:
          DATA.contract,
        currentPageRoom:
          STATE.currentPageRoom
      }
    );
  }

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
