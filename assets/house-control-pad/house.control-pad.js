// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_PRIMARY_CONTROLLER_CONTROL_1_TNT_v1
// Full-file replacement.
//
// CONTROL 1 AUTHORITY ONLY.
//
// Owns:
// - controller mounting
// - controller opening and closing
// - House DOM construction
// - room and facet construction from data
// - room selection
// - room-entry state
// - guide-authority resolution
// - route requests
// - arrival-sheet content
// - status messaging
// - coordination with Control Pad Control 2
// - coordination with Avatar Life
//
// Does not own:
// - camera calculations
// - camera transforms
// - usable viewport measurement
// - room fitting
// - responsive composition
// - arrival-sheet compensation
// - avatar root placement
// - avatar root scale
// - avatar containment calculations
// - avatar drawing
// - blink, gesture, or idle timing
//
// Runtime dependencies:
//
// window.HOUSE_CONTROL_PAD_DATA
// window.HOUSE_CONTROL_PAD_CONTROL_2
// window.HOUSE_AVATAR_LIFE
//
// Canonical files:
//
// /assets/house-control-pad/house.control-pad.data.js
// /assets/house-control-pad/house.control-pad.css
// /assets/house-control-pad/house.control-pad.js
// /assets/house-control-pad/house.control-pad.control2.js
// /assets/house-control-pad/house.avatar-life.js
// /assets/house-control-pad/house.avatars.css
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

(function bindHouseControlPadControl1(global) {
  "use strict";

  var CONTRACT =
    "HOUSE_CONTROL_PAD_PRIMARY_CONTROLLER_CONTROL_1_TNT_v1";

  var VERSION =
    "1.0.0";

  var DATA_READY_EVENT =
    "house-control-pad:data-ready";

  var CONTROL_2_READY_EVENT =
    "house-control-pad:control-2-ready";

  var CONTROL_1_READY_EVENT =
    "house-control-pad:control-1-ready";

  var OPEN_EVENT =
    "house-control-pad:open";

  var CLOSE_EVENT =
    "house-control-pad:close";

  var ROOM_SELECTED_EVENT =
    "house-control-pad:room-selected";

  var ROOM_ENTERING_EVENT =
    "house-control-pad:room-entering";

  var ROOM_ARRIVED_EVENT =
    "house-control-pad:room-arrived";

  var GUIDE_REQUEST_EVENT =
    "house-control-pad:guide-request";

  var ROUTE_REQUEST_EVENT =
    "house-control-pad:route-request";

  var OPEN_TRIGGER_SELECTOR =
    "[data-house-control-pad-open]";

  var ROOT_SELECTOR =
    "[data-house-control-pad-root]";

  var state = {
    mounted: false,
    destroyed: false,
    open: false,

    viewMode: "estate",

    selectedRoomId: null,
    currentRoomId: null,
    previousRoomId: null,
    pendingRoomId: null,

    currentAgentId: null,

    traveling: false,
    arrivalVisible: false,

    travelToken: 0,

    returnFocusElement: null,

    data: null,
    control2: null,
    avatarLife: null,

    mountRoot: null,
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
    arrivalContent: null,
    footer: null,
    status: null,

    roomElements: Object.create(null),
    facetElements: Object.create(null),
    corridorElements: Object.create(null),
    avatarMounts: Object.create(null),

    listeners: [],
    pendingControl2Commands: []
  };

  function getData() {
    return global.HOUSE_CONTROL_PAD_DATA || null;
  }

  function getControl2() {
    return global.HOUSE_CONTROL_PAD_CONTROL_2 || null;
  }

  function getAvatarLife() {
    return global.HOUSE_AVATAR_LIFE || null;
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

  function createElement(tagName, className, attributes) {
    var element =
      global.document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (attributes) {
      Object.keys(attributes).forEach(
        function applyAttribute(name) {
          var value =
            attributes[name];

          if (
            value === false ||
            value === null ||
            typeof value === "undefined"
          ) {
            return;
          }

          if (value === true) {
            element.setAttribute(name, "");
            return;
          }

          element.setAttribute(
            name,
            String(value)
          );
        }
      );
    }

    return element;
  }

  function createSvgElement(tagName, attributes) {
    var element =
      global.document.createElementNS(
        "http://www.w3.org/2000/svg",
        tagName
      );

    if (attributes) {
      Object.keys(attributes).forEach(
        function applySvgAttribute(name) {
          var value =
            attributes[name];

          if (
            value === null ||
            typeof value === "undefined"
          ) {
            return;
          }

          element.setAttribute(
            name,
            String(value)
          );
        }
      );
    }

    return element;
  }

  function createTextElement(
    tagName,
    className,
    text,
    attributes
  ) {
    var element =
      createElement(
        tagName,
        className,
        attributes
      );

    element.textContent =
      typeof text === "string"
        ? text
        : "";

    return element;
  }

  function createButton(
    className,
    label,
    attributes
  ) {
    var button =
      createElement(
        "button",
        className,
        attributes
      );

    button.type = "button";
    button.textContent = label;

    return button;
  }

  function setStyleVariables(element, variables) {
    if (!element || !variables) {
      return;
    }

    Object.keys(variables).forEach(
      function setVariable(name) {
        element.style.setProperty(
          name,
          variables[name]
        );
      }
    );
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

  function roomExists(roomId) {
    return Boolean(
      state.data &&
      typeof state.data.roomExists === "function" &&
      state.data.roomExists(roomId)
    );
  }

  function agentExists(agentId) {
    return Boolean(
      state.data &&
      typeof state.data.agentExists === "function" &&
      state.data.agentExists(agentId)
    );
  }

  function normalizeRoomId(roomId) {
    if (roomExists(roomId)) {
      return roomId;
    }

    return state.data
      ? state.data.defaultRoomId
      : "house-core";
  }

  function getRoom(roomId) {
    if (
      state.data &&
      typeof state.data.getRoom === "function"
    ) {
      return state.data.getRoom(roomId);
    }

    return null;
  }

  function getAgent(agentId) {
    if (
      state.data &&
      typeof state.data.getAgent === "function"
    ) {
      return state.data.getAgent(agentId);
    }

    return null;
  }

  function resolveAuthority(roomId) {
    if (
      state.data &&
      typeof state.data.resolveAuthority === "function"
    ) {
      return state.data.resolveAuthority(roomId);
    }

    var room =
      getRoom(roomId);

    return room && room.authority
      ? room.authority
      : "jeeves";
  }

  function resolveInitialRoom(trigger) {
    if (
      trigger &&
      typeof trigger.getAttribute === "function"
    ) {
      var triggerRoom =
        trigger.getAttribute(
          "data-house-room"
        );

      if (roomExists(triggerRoom)) {
        return triggerRoom;
      }
    }

    if (
      state.data &&
      typeof state.data.resolveRoomFromPath === "function"
    ) {
      return state.data.resolveRoomFromPath(
        global.location.pathname
      );
    }

    return state.data.defaultRoomId;
  }

  function px(value) {
    return String(value) + "px";
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function setStatus(message) {
    if (state.status) {
      state.status.textContent =
        message || "";
    }
  }

  function setPanelAttribute(name, value) {
    if (!state.panel) {
      return;
    }

    state.panel.setAttribute(
      name,
      String(value)
    );
  }

  function mount() {
    if (
      state.destroyed ||
      state.mounted
    ) {
      return state.overlay;
    }

    state.data =
      getData();

    if (!state.data) {
      return null;
    }

    state.mountRoot =
      global.document.querySelector(
        ROOT_SELECTOR
      ) ||
      global.document.body;

    buildController();
    buildEstate();
    bindControllerEvents();
    bindOpenTriggers();
    connectControl2();
    connectAvatarLife();

    state.mounted = true;

    emit(
      CONTROL_1_READY_EVENT,
      {
        contract: CONTRACT,
        version: VERSION,
        role: "control-1",
        secondaryController:
          "HOUSE_CONTROL_PAD_CONTROL_2"
      }
    );

    if (state.pendingRoomId) {
      var pendingRoomId =
        state.pendingRoomId;

      state.pendingRoomId = null;

      open({
        roomId: pendingRoomId,
        enterRoom: true
      });
    }

    return state.overlay;
  }

  function buildController() {
    state.overlay =
      createElement(
        "div",
        "hcp-overlay",
        {
          "data-house-control-pad-overlay": "",
          "data-open": "false",
          "aria-hidden": "true"
        }
      );

    state.panel =
      createElement(
        "section",
        "hcp-panel",
        {
          "data-house-control-pad-panel": "",
          "data-house-view-mode": "estate",
          "data-current-room": "",
          "data-current-agent": "",
          "data-traveling": "false",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "hcp-title",
          "aria-describedby": "hcp-subtitle"
        }
      );

    state.header =
      buildHeader();

    state.viewport =
      buildViewport();

    state.arrivalSheet =
      buildArrivalSheet();

    state.footer =
      buildFooter();

    state.panel.appendChild(
      state.header
    );

    state.panel.appendChild(
      state.viewport
    );

    state.panel.appendChild(
      state.arrivalSheet
    );

    state.panel.appendChild(
      state.footer
    );

    state.overlay.appendChild(
      state.panel
    );

    state.mountRoot.appendChild(
      state.overlay
    );
  }

  function buildHeader() {
    var header =
      createElement(
        "header",
        "hcp-header",
        {
          "data-house-control-pad-header": ""
        }
      );

    var titleWrap =
      createElement(
        "div",
        "hcp-title-wrap"
      );

    var kicker =
      createTextElement(
        "div",
        "hcp-kicker",
        "Universal House Controller"
      );

    var title =
      createTextElement(
        "h2",
        "hcp-title",
        "Choose a room.",
        {
          id: "hcp-title"
        }
      );

    var subtitle =
      createTextElement(
        "p",
        "hcp-subtitle",
        "Explore the estate, enter a room, understand its purpose, and meet its resident guide.",
        {
          id: "hcp-subtitle"
        }
      );

    titleWrap.appendChild(kicker);
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    var controls =
      createElement(
        "div",
        "hcp-header-controls"
      );

    var returnEstate =
      createButton(
        "hcp-return-estate",
        "Return to Estate",
        {
          "data-house-return-estate": ""
        }
      );

    var closeButton =
      createButton(
        "hcp-close",
        "×",
        {
          "data-house-control-pad-close": "",
          "aria-label":
            "Close House Control Pad"
        }
      );

    controls.appendChild(returnEstate);
    controls.appendChild(closeButton);

    header.appendChild(titleWrap);
    header.appendChild(controls);

    return header;
  }

  function buildViewport() {
    var viewport =
      createElement(
        "div",
        "hcp-estate-viewport",
        {
          "data-house-estate-viewport": "",
          tabindex: "0",
          "aria-label":
            "Interactive House estate"
        }
      );

    state.cameraRig =
      createElement(
        "div",
        "hcp-camera-rig",
        {
          "data-house-camera-rig": ""
        }
      );

    state.estate =
      createElement(
        "div",
        "hcp-heart-estate hcp-estate-canvas",
        {
          "data-house-heart-estate": "",
          "data-house-estate-canvas": ""
        }
      );

    state.facetLayer =
      createElement(
        "div",
        "hcp-heart-facet-layer",
        {
          "data-house-heart-facet-layer": ""
        }
      );

    state.corridorLayer =
      createElement(
        "div",
        "hcp-heart-corridor-layer hcp-route-layer",
        {
          "data-house-heart-corridor-layer": ""
        }
      );

    state.roomLayer =
      createElement(
        "div",
        "hcp-heart-room-layer hcp-room-layer",
        {
          "data-house-heart-room-layer": ""
        }
      );

    state.avatarLayer =
      createElement(
        "div",
        "hcp-avatar-layer",
        {
          "data-house-avatar-layer": ""
        }
      );

    state.cameraRig.appendChild(
      state.estate
    );

    viewport.appendChild(
      state.cameraRig
    );

    return viewport;
  }

  function buildArrivalSheet() {
    var sheet =
      createElement(
        "section",
        "hcp-arrival-sheet",
        {
          "data-house-arrival-sheet": "",
          "data-visible": "false",
          "aria-hidden": "true",
          "aria-live": "polite"
        }
      );

    state.arrivalContent =
      createElement(
        "div",
        "hcp-arrival-content"
      );

    sheet.appendChild(
      state.arrivalContent
    );

    return sheet;
  }

  function buildFooter() {
    var footer =
      createElement(
        "footer",
        "hcp-footer",
        {
          "data-house-control-pad-footer": ""
        }
      );

    state.status =
      createTextElement(
        "div",
        "hcp-status",
        "Estate ready.",
        {
          "data-house-status": "",
          "aria-live": "polite"
        }
      );

    var footerActions =
      createElement(
        "div",
        "hcp-footer-actions"
      );

    var estateButton =
      createButton(
        "hcp-footer-button",
        "Estate View",
        {
          "data-house-return-estate": ""
        }
      );

    footerActions.appendChild(
      estateButton
    );

    footer.appendChild(
      state.status
    );

    footer.appendChild(
      footerActions
    );

    return footer;
  }

  function buildEstate() {
    buildHeartShells();
    buildFacets();
    buildCorridors();
    buildRooms();
    buildResidents();

    state.estate.appendChild(
      state.heartRearShell
    );

    state.estate.appendChild(
      state.heartShell
    );

    state.estate.appendChild(
      state.facetLayer
    );

    state.estate.appendChild(
      state.corridorLayer
    );

    state.estate.appendChild(
      state.roomLayer
    );

    state.estate.appendChild(
      state.avatarLayer
    );
  }

  function buildHeartShells() {
    var world =
      state.data.heartWorld;

    var viewBox =
      "0 0 " +
      world.width +
      " " +
      world.height;

    state.heartRearShell =
      createSvgElement(
        "svg",
        {
          class:
            "hcp-heart-rear-shell",
          viewBox: viewBox,
          "aria-hidden": "true"
        }
      );

    var rearPath =
      createSvgElement(
        "path",
        {
          d:
            world.silhouette.path,
          fill:
            "currentColor"
        }
      );

    state.heartRearShell.appendChild(
      rearPath
    );

    state.heartShell =
      createSvgElement(
        "svg",
        {
          class:
            "hcp-heart-shell",
          viewBox: viewBox,
          "aria-hidden": "true"
        }
      );

    var mainPath =
      createSvgElement(
        "path",
        {
          d:
            world.silhouette.path,
          fill:
            "currentColor"
        }
      );

    state.heartShell.appendChild(
      mainPath
    );
  }

  function buildFacets() {
    var world =
      state.data.heartWorld;

    var viewBox =
      "0 0 " +
      world.width +
      " " +
      world.height;

    Object.keys(
      state.data.heartFacets
    ).forEach(
      function buildFacet(roomId) {
        var room =
          getRoom(roomId);

        var facet =
          state.data.heartFacets[
            roomId
          ];

        if (!room || !facet) {
          return;
        }

        var button =
          createElement(
            "button",
            [
              "hcp-heart-facet",
              "hcp-heart-facet-" +
                roomId
            ].join(" "),
            {
              type: "button",
              "data-house-heart-facet": "",
              "data-house-room":
                roomId,
              "data-room-id":
                roomId,
              "data-facet-id":
                facet.id,
              "data-depth-band":
                facet.depthBand ||
                "middle",
              "data-selected":
                "false",
              "data-current":
                "false",
              "aria-label":
                "Select " +
                room.label
            }
          );

        button.style.position =
          "absolute";

        button.style.inset =
          "0";

        button.style.width =
          "100%";

        button.style.height =
          "100%";

        button.style.padding =
          "0";

        button.style.border =
          "0";

        button.style.background =
          "transparent";

        var svg =
          createSvgElement(
            "svg",
            {
              viewBox: viewBox,
              "aria-hidden": "true"
            }
          );

        svg.style.width =
          "100%";

        svg.style.height =
          "100%";

        var polygon =
          createSvgElement(
            "polygon",
            {
              class:
                "hcp-heart-facet-shape",
              points:
                serializeFacetPolygon(
                  facet.polygon
                ),
              "vector-effect":
                "non-scaling-stroke"
            }
          );

        svg.appendChild(
          polygon
        );

        button.appendChild(
          svg
        );

        state.facetLayer.appendChild(
          button
        );

        state.facetElements[
          roomId
        ] = button;
      }
    );
  }

  function serializeFacetPolygon(polygon) {
    return polygon.map(
      function serializePoint(point) {
        return (
          point[0] +
          "," +
          point[1]
        );
      }
    ).join(" ");
  }

  function buildCorridors() {
    var corridors =
      state.data.corridors;

    var renderedConnections =
      Object.create(null);

    Object.keys(corridors).forEach(
      function buildCorridorNode(corridorId) {
        var corridor =
          corridors[corridorId];

        var node =
          createElement(
            "span",
            "hcp-corridor-node",
            {
              "data-house-corridor-node": "",
              "data-corridor-id":
                corridorId,
              "aria-hidden":
                "true"
            }
          );

        node.style.left =
          px(corridor.x);

        node.style.top =
          px(corridor.y);

        node.style.transform =
          "translate3d(-50%, -50%, " +
          corridor.z +
          "px)";

        state.corridorLayer.appendChild(
          node
        );

        state.corridorElements[
          corridorId
        ] = node;
      }
    );

    Object.keys(corridors).forEach(
      function buildCorridorConnections(
        corridorId
      ) {
        var corridor =
          corridors[corridorId];

        corridor.connections.forEach(
          function buildConnection(
            connection
          ) {
            var start = {
              x: corridor.x,
              y: corridor.y,
              z: corridor.z
            };

            var end =
              resolveConnectionPoint(
                connection
              );

            if (!end) {
              return;
            }

            var connectionKey =
              normalizeConnectionKey(
                corridorId,
                connection
              );

            if (
              renderedConnections[
                connectionKey
              ]
            ) {
              return;
            }

            renderedConnections[
              connectionKey
            ] = true;

            var segment =
              createLineSegment(
                start,
                end
              );

            segment.setAttribute(
              "data-corridor-connection",
              connectionKey
            );

            state.corridorLayer.appendChild(
              segment
            );
          }
        );
      }
    );
  }

  function resolveConnectionPoint(connection) {
    if (
      connection.indexOf("room:") === 0
    ) {
      var roomId =
        connection.slice(5);

      var room =
        getRoom(roomId);

      if (!room) {
        return null;
      }

      return {
        x:
          room.heart3d.center.x,
        y:
          room.heart3d.center.y,
        z:
          room.heart3d.center.z
      };
    }

    var corridor =
      state.data.corridors[
        connection
      ];

    if (!corridor) {
      return null;
    }

    return {
      x: corridor.x,
      y: corridor.y,
      z: corridor.z
    };
  }

  function normalizeConnectionKey(
    corridorId,
    connection
  ) {
    if (
      connection.indexOf("room:") === 0
    ) {
      return (
        corridorId +
        "::" +
        connection
      );
    }

    return [
      corridorId,
      connection
    ].sort().join("::");
  }

  function createLineSegment(start, end) {
    var deltaX =
      end.x - start.x;

    var deltaY =
      end.y - start.y;

    var length =
      Math.sqrt(
        deltaX * deltaX +
        deltaY * deltaY
      );

    var angle =
      Math.atan2(
        deltaY,
        deltaX
      ) * 180 / Math.PI;

    var averageZ =
      (
        Number(start.z || 0) +
        Number(end.z || 0)
      ) / 2;

    var segment =
      createElement(
        "span",
        "hcp-heart-corridor",
        {
          "data-house-corridor-segment": "",
          "aria-hidden": "true"
        }
      );

    segment.style.left =
      px(start.x);

    segment.style.top =
      px(start.y);

    segment.style.width =
      px(length);

    segment.style.transform =
      "translateZ(" +
      averageZ +
      "px) rotate(" +
      angle +
      "deg)";

    return segment;
  }

  function buildRooms() {
    Object.keys(
      state.data.rooms
    ).forEach(
      function buildRoom(roomId) {
        var room =
          state.data.rooms[
            roomId
          ];

        var roomElement =
          createElement(
            "article",
            [
              "hcp-room-node",
              "hcp-room-" +
                room.type,
              "hcp-room-" +
                roomId
            ].join(" "),
            {
              "data-house-room-node": "",
              "data-house-room":
                roomId,
              "data-room-id":
                roomId,
              "data-room-type":
                room.type,
              "data-room-rank":
                room.rank,
              "data-authority":
                room.authority,
              "data-selected":
                "false",
              "data-current":
                "false",
              "data-focused":
                "false",
              "data-information-visible":
                "false",
              "data-summary-active":
                "false",
              tabindex: "0",
              role: "button",
              "aria-label":
                "Enter " +
                room.label
            }
          );

        applyRoomGeometry(
          roomElement,
          room
        );

        var floor =
          createElement(
            "div",
            "hcp-room-floor",
            {
              "aria-hidden":
                "true"
            }
          );

        var walls =
          buildRoomWalls();

        var architecture =
          buildRoomArchitecture(
            room
          );

        var interior =
          createElement(
            "div",
            "hcp-room-interior",
            {
              "data-house-room-interior": ""
            }
          );

        var safeFrame =
          createElement(
            "div",
            "hcp-avatar-safe-frame",
            {
              "data-house-avatar-safe-frame": "",
              "data-house-room":
                roomId
            }
          );

        var avatarMount =
          createElement(
            "div",
            "hcp-avatar-mount",
            {
              "data-house-avatar-mount": "",
              "data-house-room":
                roomId,
              "data-authority":
                room.authority
            }
          );

        safeFrame.appendChild(
          avatarMount
        );

        interior.appendChild(
          safeFrame
        );

        var labelZone =
          buildRoomLabelZone(
            room
          );

        var summaryZone =
          buildRoomSummaryZone(
            room
          );

        var detailZone =
          buildRoomDetailZone(
            room
          );

        var actionZone =
          buildRoomActionZone(
            room
          );

        roomElement.appendChild(
          floor
        );

        walls.forEach(
          function appendWall(wall) {
            roomElement.appendChild(
              wall
            );
          }
        );

        roomElement.appendChild(
          architecture
        );

        roomElement.appendChild(
          interior
        );

        roomElement.appendChild(
          labelZone
        );

        roomElement.appendChild(
          summaryZone
        );

        roomElement.appendChild(
          detailZone
        );

        roomElement.appendChild(
          actionZone
        );

        state.roomLayer.appendChild(
          roomElement
        );

        state.roomElements[
          roomId
        ] = roomElement;

        state.avatarMounts[
          roomId
        ] = avatarMount;
      }
    );
  }

  function applyRoomGeometry(
    element,
    room
  ) {
    var heart =
      room.heart3d;

    setStyleVariables(
      element,
      {
        "--room-center-x":
          px(heart.center.x),

        "--room-center-y":
          px(heart.center.y),

        "--room-z":
          px(heart.center.z),

        "--room-width":
          px(heart.size.width),

        "--room-height":
          px(heart.size.height),

        "--room-depth":
          px(heart.size.depth),

        "--room-floor-z":
          px(heart.floorZ),

        "--room-wall-height":
          px(
            Math.max(
              24,
              heart.wallZ -
              heart.floorZ
            )
          ),

        "--avatar-anchor-z":
          px(
            heart.avatarAnchor.z
          )
      }
    );
  }

  function buildRoomWalls() {
    return [
      createElement(
        "div",
        "hcp-room-wall hcp-room-wall-north",
        {
          "aria-hidden": "true"
        }
      ),
      createElement(
        "div",
        "hcp-room-wall hcp-room-wall-east",
        {
          "aria-hidden": "true"
        }
      ),
      createElement(
        "div",
        "hcp-room-wall hcp-room-wall-south",
        {
          "aria-hidden": "true"
        }
      ),
      createElement(
        "div",
        "hcp-room-wall hcp-room-wall-west",
        {
          "aria-hidden": "true"
        }
      )
    ];
  }

  function buildRoomArchitecture(room) {
    var architecture =
      createElement(
        "div",
        "hcp-room-architecture",
        {
          "aria-hidden": "true"
        }
      );

    room.architecturalFeatureZones.forEach(
      function buildFeature(feature) {
        var featureElement =
          createElement(
            "span",
            [
              "hcp-room-feature",
              "hcp-room-feature-" +
                feature.type
            ].join(" ")
          );

        featureElement.style.left =
          feature.x + "%";

        featureElement.style.top =
          feature.y + "%";

        featureElement.style.width =
          feature.width + "%";

        featureElement.style.height =
          feature.height + "%";

        architecture.appendChild(
          featureElement
        );
      }
    );

    return architecture;
  }

  function buildRoomLabelZone(room) {
    var zone =
      createElement(
        "div",
        "hcp-room-label-zone"
      );

    applyZone(
      zone,
      room.labelZone
    );

    var label =
      createTextElement(
        "strong",
        "hcp-room-label",
        room.shortLabel ||
        room.label
      );

    var category =
      createTextElement(
        "span",
        "hcp-room-category",
        room.categoryLabel
      );

    zone.appendChild(label);
    zone.appendChild(category);

    return zone;
  }

  function buildRoomSummaryZone(room) {
    var zone =
      createElement(
        "div",
        "hcp-room-summary-zone"
      );

    applyZone(
      zone,
      room.summaryZone
    );

    var summary =
      createTextElement(
        "p",
        "hcp-room-summary",
        room.summary
      );

    var agent =
      getAgent(
        room.authority
      );

    var guide =
      createTextElement(
        "span",
        "hcp-room-guide",
        agent
          ? agent.label
          : room.authority
      );

    zone.appendChild(summary);
    zone.appendChild(guide);

    return zone;
  }

  function buildRoomDetailZone(room) {
    var zone =
      createElement(
        "div",
        "hcp-room-detail-zone"
      );

    applyZone(
      zone,
      room.detailZone
    );

    var title =
      createTextElement(
        "h3",
        "hcp-room-detail-title",
        room.label
      );

    var copy =
      createTextElement(
        "p",
        "hcp-room-detail-copy",
        room.detail
      );

    var list =
      createElement(
        "ul",
        "hcp-room-visitor-list"
      );

    room.visitorCan.forEach(
      function appendVisitorItem(
        item
      ) {
        list.appendChild(
          createTextElement(
            "li",
            "",
            item
          )
        );
      }
    );

    zone.appendChild(title);
    zone.appendChild(copy);
    zone.appendChild(list);

    return zone;
  }

  function buildRoomActionZone(room) {
    var zone =
      createElement(
        "div",
        "hcp-room-action-zone"
      );

    applyZone(
      zone,
      room.actionZone
    );

    var actions =
      createElement(
        "div",
        "hcp-room-actions"
      );

    var routeAction =
      createButton(
        "hcp-room-action hcp-room-action-primary",
        "Open " +
        (
          room.shortLabel ||
          room.label
        ),
        {
          "data-house-route-action": "",
          "data-house-room":
            room.id,
          "data-route":
            room.route
        }
      );

    var agent =
      getAgent(
        room.authority
      );

    var guideAction =
      createButton(
        "hcp-room-action",
        agent
          ? agent.actionLabel
          : "Ask Guide",
        {
          "data-house-guide-action": "",
          "data-house-room":
            room.id,
          "data-agent-id":
            room.authority
        }
      );

    var estateAction =
      createButton(
        "hcp-room-action hcp-room-action-muted",
        "Estate View",
        {
          "data-house-return-estate": ""
        }
      );

    actions.appendChild(
      routeAction
    );

    actions.appendChild(
      guideAction
    );

    actions.appendChild(
      estateAction
    );

    zone.appendChild(
      actions
    );

    return zone;
  }

  function applyZone(element, zone) {
    if (!zone) {
      return;
    }

    element.style.left =
      zone.x + "%";

    element.style.top =
      zone.y + "%";

    element.style.width =
      zone.width + "%";

    element.style.height =
      zone.height + "%";
  }

  function buildResidents() {
    Object.keys(
      state.data.agents
    ).forEach(
      function buildResident(agentId) {
        var agent =
          state.data.agents[
            agentId
          ];

        var homeRoomId =
          agent.homeRoom;

        var mount =
          state.avatarMounts[
            homeRoomId
          ];

        if (!mount) {
          return;
        }

        var resident =
          createElement(
            "div",
            [
              "hcp-avatar",
              "hcp-avatar-" +
                agentId
            ].join(" "),
            {
              "data-house-avatar": "",
              "data-agent-id":
                agentId,
              "data-house-room":
                homeRoomId,
              "data-avatar-state":
                "resting",
              "data-avatar-focus":
                "false",
              "aria-label":
                agent.label
            }
          );

        var placeholder =
          createElement(
            "div",
            "hcp-avatar-placeholder",
            {
              "aria-hidden":
                "true"
            }
          );

        var placeholderName =
          createTextElement(
            "span",
            "hcp-avatar-name",
            agent.label
          );

        placeholder.appendChild(
          placeholderName
        );

        resident.appendChild(
          placeholder
        );

        mount.appendChild(
          resident
        );
      }
    );
  }

  function bindControllerEvents() {
    listen(
      state.overlay,
      "click",
      handleOverlayClick
    );

    listen(
      state.overlay,
      "keydown",
      handleOverlayKeydown
    );

    listen(
      global,
      CONTROL_2_READY_EVENT,
      handleControl2Ready
    );
  }

  function bindOpenTriggers() {
    var triggers =
      global.document.querySelectorAll(
        OPEN_TRIGGER_SELECTOR
      );

    Array.prototype.forEach.call(
      triggers,
      function bindTrigger(trigger) {
        if (
          trigger.getAttribute(
            "data-house-control-pad-bound"
          ) === "true"
        ) {
          return;
        }

        trigger.setAttribute(
          "data-house-control-pad-bound",
          "true"
        );

        listen(
          trigger,
          "click",
          function openFromTrigger(event) {
            event.preventDefault();

            state.returnFocusElement =
              trigger;

            open({
              roomId:
                resolveInitialRoom(
                  trigger
                ),
              enterRoom:
                trigger.getAttribute(
                  "data-house-enter-room"
                ) === "true"
            });
          }
        );
      }
    );
  }

  function handleOverlayClick(event) {
    var closeTrigger =
      event.target.closest(
        "[data-house-control-pad-close]"
      );

    if (closeTrigger) {
      event.preventDefault();
      close();
      return;
    }

    var returnEstateTrigger =
      event.target.closest(
        "[data-house-return-estate]"
      );

    if (returnEstateTrigger) {
      event.preventDefault();
      showEstate();
      return;
    }

    var routeTrigger =
      event.target.closest(
        "[data-house-route-action]"
      );

    if (routeTrigger) {
      event.preventDefault();

      requestRoute(
        routeTrigger.getAttribute(
          "data-house-room"
        ),
        routeTrigger.getAttribute(
          "data-route"
        )
      );

      return;
    }

    var guideTrigger =
      event.target.closest(
        "[data-house-guide-action]"
      );

    if (guideTrigger) {
      event.preventDefault();

      requestGuide(
        guideTrigger.getAttribute(
          "data-house-room"
        ),
        guideTrigger.getAttribute(
          "data-agent-id"
        )
      );

      return;
    }

    var facetTrigger =
      event.target.closest(
        "[data-house-heart-facet]"
      );

    if (facetTrigger) {
      event.preventDefault();

      selectRoom(
        facetTrigger.getAttribute(
          "data-house-room"
        ),
        {
          source:
            "facet"
        }
      );

      return;
    }

    var roomTrigger =
      event.target.closest(
        "[data-house-room-node]"
      );

    if (roomTrigger) {
      event.preventDefault();

      selectRoom(
        roomTrigger.getAttribute(
          "data-house-room"
        ),
        {
          source:
            "room"
        }
      );
    }
  }

  function handleOverlayKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();

      if (
        state.viewMode === "room"
      ) {
        showEstate();
      } else {
        close();
      }

      return;
    }

    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    var roomTrigger =
      event.target.closest(
        "[data-house-room-node]," +
        "[data-house-heart-facet]"
      );

    if (!roomTrigger) {
      return;
    }

    event.preventDefault();

    selectRoom(
      roomTrigger.getAttribute(
        "data-house-room"
      ),
      {
        source:
          "keyboard"
      }
    );
  }

  function handleControl2Ready() {
    connectControl2();
    flushControl2Commands();
  }

  function connectControl2() {
    state.control2 =
      getControl2();

    if (
      !state.control2 ||
      typeof state.control2.mount !==
        "function"
    ) {
      return false;
    }

    try {
      state.control2.mount(
        getControl2Context()
      );

      flushControl2Commands();

      return true;
    } catch (error) {
      setStatus(
        "Control Pad Control 2 could not mount."
      );

      return false;
    }
  }

  function connectAvatarLife() {
    state.avatarLife =
      getAvatarLife();

    if (
      !state.avatarLife ||
      typeof state.avatarLife.mount !==
        "function"
    ) {
      return false;
    }

    try {
      state.avatarLife.mount({
        controller:
          API,

        panel:
          state.panel,

        roomElements:
          state.roomElements,

        avatarMounts:
          state.avatarMounts,

        getState:
          getPublicState
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  function getControl2Context() {
    return {
      contract: CONTRACT,

      data:
        state.data,

      overlay:
        state.overlay,

      panel:
        state.panel,

      header:
        state.header,

      viewport:
        state.viewport,

      cameraRig:
        state.cameraRig,

      estate:
        state.estate,

      heartRearShell:
        state.heartRearShell,

      heartShell:
        state.heartShell,

      facetLayer:
        state.facetLayer,

      corridorLayer:
        state.corridorLayer,

      roomLayer:
        state.roomLayer,

      avatarLayer:
        state.avatarLayer,

      arrivalSheet:
        state.arrivalSheet,

      footer:
        state.footer,

      status:
        state.status,

      roomElements:
        state.roomElements,

      facetElements:
        state.facetElements,

      avatarMounts:
        state.avatarMounts,

      getState:
        getPublicState
    };
  }

  function queueControl2Command(
    command,
    payload
  ) {
    state.pendingControl2Commands.push({
      command: command,
      payload: payload || {}
    });
  }

  function sendControl2Command(
    command,
    payload
  ) {
    state.control2 =
      getControl2();

    if (!state.control2) {
      queueControl2Command(
        command,
        payload
      );

      return false;
    }

    try {
      if (
        command === "open" &&
        typeof state.control2.open ===
          "function"
      ) {
        state.control2.open(
          payload || {}
        );

        return true;
      }

      if (
        command === "close" &&
        typeof state.control2.close ===
          "function"
      ) {
        state.control2.close(
          payload || {}
        );

        return true;
      }

      if (
        command === "showEstate" &&
        typeof state.control2.showEstate ===
          "function"
      ) {
        state.control2.showEstate(
          payload || {}
        );

        return true;
      }

      if (
        command === "focusRoom" &&
        typeof state.control2.focusRoom ===
          "function"
      ) {
        state.control2.focusRoom(
          payload.roomId,
          payload || {}
        );

        return true;
      }

      if (
        command === "roomArrived" &&
        typeof state.control2.roomArrived ===
          "function"
      ) {
        state.control2.roomArrived(
          payload.roomId,
          payload || {}
        );

        return true;
      }

      if (
        command ===
          "setArrivalSheetVisible" &&
        typeof state.control2
          .setArrivalSheetVisible ===
          "function"
      ) {
        state.control2
          .setArrivalSheetVisible(
            Boolean(
              payload.visible
            ),
            payload || {}
          );

        return true;
      }

      if (
        command === "reframe" &&
        typeof state.control2.reframe ===
          "function"
      ) {
        state.control2.reframe(
          payload || {}
        );

        return true;
      }

      if (
        typeof state.control2
          .handleCommand ===
          "function"
      ) {
        state.control2.handleCommand(
          command,
          payload || {}
        );

        return true;
      }
    } catch (error) {
      setStatus(
        "Control Pad Control 2 command failed."
      );
    }

    return false;
  }

  function flushControl2Commands() {
    if (!getControl2()) {
      return;
    }

    var pending =
      state.pendingControl2Commands.slice();

    state.pendingControl2Commands.length =
      0;

    pending.forEach(
      function executePendingCommand(
        record
      ) {
        sendControl2Command(
          record.command,
          record.payload
        );
      }
    );
  }

  function open(options) {
    options = options || {};

    if (state.destroyed) {
      return;
    }

    if (!state.mounted) {
      state.pendingRoomId =
        normalizeRoomId(
          options.roomId
        );

      mount();

      if (!state.mounted) {
        return;
      }
    }

    var roomId =
      normalizeRoomId(
        options.roomId
      );

    state.open = true;

    state.overlay.setAttribute(
      "data-open",
      "true"
    );

    state.overlay.setAttribute(
      "aria-hidden",
      "false"
    );

    global.document.documentElement
      .setAttribute(
        "data-house-control-pad-open",
        "true"
      );

    global.document.body.setAttribute(
      "data-house-control-pad-open",
      "true"
    );

    showEstate({
      silent: true
    });

    sendControl2Command(
      "open",
      {
        roomId: roomId
      }
    );

    if (
      options.enterRoom === true
    ) {
      selectRoom(
        roomId,
        {
          source:
            "open",
          immediate:
            true
        }
      );
    } else {
      state.selectedRoomId =
        roomId;

      setRoomSelection(
        roomId,
        false
      );

      sendControl2Command(
        "showEstate",
        {
          selectedRoomId:
            roomId
        }
      );
    }

    global.requestAnimationFrame(
      function focusViewport() {
        if (
          state.viewport &&
          state.open
        ) {
          try {
            state.viewport.focus({
              preventScroll: true
            });
          } catch (error) {
            state.viewport.focus();
          }
        }
      }
    );

    emit(
      OPEN_EVENT,
      {
        contract: CONTRACT,
        roomId: roomId,
        viewMode:
          state.viewMode
      }
    );
  }

  function close() {
    if (
      !state.mounted ||
      !state.open
    ) {
      return;
    }

    state.open = false;
    state.traveling = false;
    state.travelToken += 1;

    hideArrivalSheet({
      reframe: false
    });

    state.overlay.setAttribute(
      "data-open",
      "false"
    );

    state.overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    global.document.documentElement
      .removeAttribute(
        "data-house-control-pad-open"
      );

    global.document.body
      .removeAttribute(
        "data-house-control-pad-open"
      );

    sendControl2Command(
      "close",
      {}
    );

    emit(
      CLOSE_EVENT,
      {
        contract: CONTRACT,
        roomId:
          state.currentRoomId,
        viewMode:
          state.viewMode
      }
    );

    if (
      state.returnFocusElement &&
      typeof state.returnFocusElement
        .focus === "function"
    ) {
      global.setTimeout(
        function restoreFocus() {
          try {
            state.returnFocusElement
              .focus({
                preventScroll: true
              });
          } catch (error) {
            state.returnFocusElement
              .focus();
          }
        },
        0
      );
    }
  }

  function showEstate(options) {
    options = options || {};

    state.viewMode =
      "estate";

    state.previousRoomId =
      state.currentRoomId;

    state.currentRoomId =
      null;

    state.currentAgentId =
      null;

    state.traveling =
      false;

    state.travelToken += 1;

    setPanelAttribute(
      "data-house-view-mode",
      "estate"
    );

    setPanelAttribute(
      "data-current-room",
      ""
    );

    setPanelAttribute(
      "data-current-agent",
      ""
    );

    setPanelAttribute(
      "data-traveling",
      "false"
    );

    clearRoomStates();

    hideArrivalSheet({
      reframe: false
    });

    setStatus(
      "Estate view ready. Choose a room."
    );

    sendControl2Command(
      "showEstate",
      {
        selectedRoomId:
          state.selectedRoomId
      }
    );

    if (!options.silent) {
      emit(
        ROOM_SELECTED_EVENT,
        {
          contract: CONTRACT,
          roomId: null,
          viewMode:
            "estate"
        }
      );
    }
  }

  function selectRoom(roomId, options) {
    options = options || {};

    var normalizedRoomId =
      normalizeRoomId(
        roomId
      );

    var room =
      getRoom(
        normalizedRoomId
      );

    if (!room) {
      return;
    }

    var authorityId =
      resolveAuthority(
        normalizedRoomId
      );

    state.previousRoomId =
      state.currentRoomId;

    state.selectedRoomId =
      normalizedRoomId;

    state.currentRoomId =
      normalizedRoomId;

    state.currentAgentId =
      authorityId;

    state.viewMode =
      "room";

    state.traveling =
      true;

    state.travelToken += 1;

    var activeTravelToken =
      state.travelToken;

    setPanelAttribute(
      "data-house-view-mode",
      "room"
    );

    setPanelAttribute(
      "data-current-room",
      normalizedRoomId
    );

    setPanelAttribute(
      "data-current-agent",
      authorityId
    );

    setPanelAttribute(
      "data-traveling",
      "true"
    );

    clearRoomStates();

    setRoomSelection(
      normalizedRoomId,
      true
    );

    hideArrivalSheet({
      reframe: false
    });

    setStatus(
      "Entering " +
      room.label +
      "."
    );

    emit(
      ROOM_SELECTED_EVENT,
      {
        contract: CONTRACT,
        roomId:
          normalizedRoomId,
        previousRoomId:
          state.previousRoomId,
        agentId:
          authorityId,
        source:
          options.source ||
          "unknown"
      }
    );

    emit(
      ROOM_ENTERING_EVENT,
      {
        contract: CONTRACT,
        roomId:
          normalizedRoomId,
        agentId:
          authorityId
      }
    );

    requestAvatarTravel(
      authorityId,
      normalizedRoomId
    );

    sendControl2Command(
      "focusRoom",
      {
        roomId:
          normalizedRoomId,
        agentId:
          authorityId,
        immediate:
          Boolean(
            options.immediate
          )
      }
    );

    var settleDelay =
      options.immediate
        ? 0
        : getCameraSettleDelay();

    global.setTimeout(
      function completeSelectedRoom() {
        if (
          activeTravelToken !==
            state.travelToken ||
          state.currentRoomId !==
            normalizedRoomId ||
          !state.open
        ) {
          return;
        }

        completeRoomArrival(
          normalizedRoomId,
          authorityId
        );
      },
      settleDelay
    );
  }

  function getCameraSettleDelay() {
    var timing =
      state.data.timing || {};

    return (
      Number(
        timing.CAMERA_MS ||
        620
      ) +
      Number(
        timing.CAMERA_SETTLE_MS ||
        170
      )
    );
  }

  function clearRoomStates() {
    Object.keys(
      state.roomElements
    ).forEach(
      function clearRoom(roomId) {
        var roomElement =
          state.roomElements[
            roomId
          ];

        roomElement.setAttribute(
          "data-selected",
          "false"
        );

        roomElement.setAttribute(
          "data-current",
          "false"
        );

        roomElement.setAttribute(
          "data-focused",
          "false"
        );

        roomElement.setAttribute(
          "data-information-visible",
          "false"
        );

        roomElement.removeAttribute(
          "data-arrived"
        );
      }
    );

    Object.keys(
      state.facetElements
    ).forEach(
      function clearFacet(roomId) {
        var facetElement =
          state.facetElements[
            roomId
          ];

        facetElement.setAttribute(
          "data-selected",
          "false"
        );

        facetElement.setAttribute(
          "data-current",
          "false"
        );
      }
    );

    var avatars =
      state.panel
        ? state.panel.querySelectorAll(
            "[data-house-avatar]"
          )
        : [];

    Array.prototype.forEach.call(
      avatars,
      function clearAvatar(avatar) {
        avatar.setAttribute(
          "data-avatar-focus",
          "false"
        );
      }
    );
  }

  function setRoomSelection(
    roomId,
    focused
  ) {
    var roomElement =
      state.roomElements[
        roomId
      ];

    var facetElement =
      state.facetElements[
        roomId
      ];

    if (roomElement) {
      roomElement.setAttribute(
        "data-selected",
        "true"
      );

      roomElement.setAttribute(
        "data-current",
        String(
          Boolean(focused)
        )
      );

      roomElement.setAttribute(
        "data-focused",
        String(
          Boolean(focused)
        )
      );
    }

    if (facetElement) {
      facetElement.setAttribute(
        "data-selected",
        "true"
      );

      facetElement.setAttribute(
        "data-current",
        String(
          Boolean(focused)
        )
      );
    }

    var avatar =
      state.panel
        ? state.panel.querySelector(
            '[data-house-avatar]' +
            '[data-house-room="' +
            escapeSelector(roomId) +
            '"]'
          )
        : null;

    if (avatar) {
      avatar.setAttribute(
        "data-avatar-focus",
        String(
          Boolean(focused)
        )
      );
    }
  }

  function completeRoomArrival(
    roomId,
    agentId
  ) {
    var room =
      getRoom(roomId);

    var agent =
      getAgent(agentId);

    if (!room || !agent) {
      return;
    }

    state.traveling =
      false;

    setPanelAttribute(
      "data-traveling",
      "false"
    );

    var roomElement =
      state.roomElements[
        roomId
      ];

    if (roomElement) {
      roomElement.setAttribute(
        "data-arrived",
        "true"
      );

      roomElement.setAttribute(
        "data-information-visible",
        "true"
      );
    }

    requestAvatarArrival(
      agentId,
      roomId
    );

    showArrivalSheet(
      room,
      agent
    );

    setStatus(
      room.label +
      " ready. " +
      agent.label +
      " is present."
    );

    sendControl2Command(
      "roomArrived",
      {
        roomId:
          roomId,
        agentId:
          agentId
      }
    );

    emit(
      ROOM_ARRIVED_EVENT,
      {
        contract: CONTRACT,
        roomId:
          roomId,
        agentId:
          agentId
      }
    );
  }

  function showArrivalSheet(
    room,
    agent
  ) {
    state.arrivalContent
      .replaceChildren();

    var eyebrow =
      createTextElement(
        "div",
        "hcp-arrival-eyebrow",
        "Guide Authority"
      );

    var title =
      createTextElement(
        "h3",
        "hcp-arrival-title",
        agent.label +
        " has arrived at " +
        room.label +
        "."
      );

    var body =
      createTextElement(
        "p",
        "hcp-arrival-body",
        agent.authorityLine
      );

    var actions =
      createElement(
        "div",
        "hcp-arrival-actions"
      );

    var routeButton =
      createButton(
        "hcp-arrival-action hcp-arrival-primary",
        getPrimaryActionLabel(
          room
        ),
        {
          "data-house-route-action": "",
          "data-house-room":
            room.id,
          "data-route":
            room.route
        }
      );

    var guideButton =
      createButton(
        "hcp-arrival-action",
        agent.actionLabel ||
        (
          "Ask " +
          agent.label
        ),
        {
          "data-house-guide-action": "",
          "data-house-room":
            room.id,
          "data-agent-id":
            agent.id
        }
      );

    var dismissButton =
      createButton(
        "hcp-arrival-action hcp-arrival-muted",
        "Dismiss",
        {
          "data-house-arrival-dismiss": ""
        }
      );

    actions.appendChild(
      routeButton
    );

    actions.appendChild(
      guideButton
    );

    actions.appendChild(
      dismissButton
    );

    state.arrivalContent.appendChild(
      eyebrow
    );

    state.arrivalContent.appendChild(
      title
    );

    state.arrivalContent.appendChild(
      body
    );

    state.arrivalContent.appendChild(
      actions
    );

    state.arrivalVisible =
      true;

    state.arrivalSheet.setAttribute(
      "data-visible",
      "true"
    );

    state.arrivalSheet.setAttribute(
      "aria-hidden",
      "false"
    );

    var dismissTrigger =
      state.arrivalSheet.querySelector(
        "[data-house-arrival-dismiss]"
      );

    if (dismissTrigger) {
      dismissTrigger.addEventListener(
        "click",
        function dismissArrival(
          event
        ) {
          event.preventDefault();

          hideArrivalSheet();
        },
        {
          once: true
        }
      );
    }

    sendControl2Command(
      "setArrivalSheetVisible",
      {
        visible:
          true,
        roomId:
          room.id,
        agentId:
          agent.id
      }
    );
  }

  function getPrimaryActionLabel(room) {
    if (
      room.visitorCan &&
      room.visitorCan.length > 0
    ) {
      return room.visitorCan[0];
    }

    return (
      "Open " +
      (
        room.shortLabel ||
        room.label
      )
    );
  }

  function hideArrivalSheet(options) {
    options = options || {};

    if (!state.arrivalSheet) {
      return;
    }

    state.arrivalVisible =
      false;

    state.arrivalSheet.setAttribute(
      "data-visible",
      "false"
    );

    state.arrivalSheet.setAttribute(
      "aria-hidden",
      "true"
    );

    sendControl2Command(
      "setArrivalSheetVisible",
      {
        visible:
          false,
        roomId:
          state.currentRoomId
      }
    );

    if (options.reframe !== false) {
      sendControl2Command(
        "reframe",
        {
          roomId:
            state.currentRoomId,
          viewMode:
            state.viewMode,
          arrivalVisible:
            false
        }
      );
    }
  }

  function requestRoute(roomId, route) {
    var normalizedRoomId =
      normalizeRoomId(
        roomId
      );

    var room =
      getRoom(
        normalizedRoomId
      );

    var targetRoute =
      route ||
      (
        room
          ? room.route
          : null
      );

    if (!targetRoute) {
      return;
    }

    emit(
      ROUTE_REQUEST_EVENT,
      {
        contract: CONTRACT,
        roomId:
          normalizedRoomId,
        route:
          targetRoute
      }
    );

    global.location.href =
      targetRoute;
  }

  function requestGuide(
    roomId,
    agentId
  ) {
    var normalizedRoomId =
      normalizeRoomId(
        roomId
      );

    var room =
      getRoom(
        normalizedRoomId
      );

    var resolvedAgentId =
      agentExists(agentId)
        ? agentId
        : resolveAuthority(
            normalizedRoomId
          );

    var agent =
      getAgent(
        resolvedAgentId
      );

    if (!room || !agent) {
      return;
    }

    emit(
      GUIDE_REQUEST_EVENT,
      {
        contract: CONTRACT,
        roomId:
          normalizedRoomId,
        agentId:
          resolvedAgentId,
        route:
          agent.route
      }
    );

    if (
      state.avatarLife &&
      typeof state.avatarLife
        .requestAttention ===
        "function"
    ) {
      state.avatarLife
        .requestAttention(
          resolvedAgentId,
          normalizedRoomId
        );

      setStatus(
        agent.label +
        " is attending in " +
        room.label +
        "."
      );

      return;
    }

    if (agent.route) {
      global.location.href =
        agent.route;
    }
  }

  function requestAvatarTravel(
    agentId,
    roomId
  ) {
    state.avatarLife =
      getAvatarLife();

    if (!state.avatarLife) {
      return;
    }

    if (
      typeof state.avatarLife.travel ===
        "function"
    ) {
      state.avatarLife.travel(
        agentId,
        roomId
      );

      return;
    }

    if (
      typeof state.avatarLife.setState ===
        "function"
    ) {
      state.avatarLife.setState(
        agentId,
        "traveling",
        {
          roomId: roomId
        }
      );
    }
  }

  function requestAvatarArrival(
    agentId,
    roomId
  ) {
    state.avatarLife =
      getAvatarLife();

    if (!state.avatarLife) {
      return;
    }

    if (
      typeof state.avatarLife.arrive ===
        "function"
    ) {
      state.avatarLife.arrive(
        agentId,
        roomId
      );

      return;
    }

    if (
      typeof state.avatarLife.setState ===
        "function"
    ) {
      state.avatarLife.setState(
        agentId,
        "arriving",
        {
          roomId: roomId
        }
      );
    }
  }

  function reframe() {
    sendControl2Command(
      "reframe",
      {
        roomId:
          state.currentRoomId,
        viewMode:
          state.viewMode,
        arrivalVisible:
          state.arrivalVisible
      }
    );
  }

  function rebindTriggers() {
    bindOpenTriggers();
  }

  function getPublicState() {
    return {
      contract: CONTRACT,
      version: VERSION,

      mounted:
        state.mounted,

      destroyed:
        state.destroyed,

      open:
        state.open,

      viewMode:
        state.viewMode,

      selectedRoomId:
        state.selectedRoomId,

      currentRoomId:
        state.currentRoomId,

      previousRoomId:
        state.previousRoomId,

      currentAgentId:
        state.currentAgentId,

      traveling:
        state.traveling,

      arrivalVisible:
        state.arrivalVisible
    };
  }

  function destroy() {
    if (state.destroyed) {
      return;
    }

    close();

    if (
      state.control2 &&
      typeof state.control2.destroy ===
        "function"
    ) {
      try {
        state.control2.destroy();
      } catch (error) {
        // No-op.
      }
    }

    if (
      state.avatarLife &&
      typeof state.avatarLife.destroy ===
        "function"
    ) {
      try {
        state.avatarLife.destroy();
      } catch (error) {
        // No-op.
      }
    }

    removeAllListeners();

    if (
      state.overlay &&
      state.overlay.parentNode
    ) {
      state.overlay.parentNode
        .removeChild(
          state.overlay
        );
    }

    state.mounted =
      false;

    state.destroyed =
      true;

    state.open =
      false;

    state.roomElements =
      Object.create(null);

    state.facetElements =
      Object.create(null);

    state.corridorElements =
      Object.create(null);

    state.avatarMounts =
      Object.create(null);

    state.pendingControl2Commands.length =
      0;
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
      "control-1",

    secondaryController:
      "HOUSE_CONTROL_PAD_CONTROL_2",

    mount: mount,
    open: open,
    close: close,

    showEstate:
      showEstate,

    selectRoom:
      selectRoom,

    hideArrivalSheet:
      hideArrivalSheet,

    requestRoute:
      requestRoute,

    requestGuide:
      requestGuide,

    reframe:
      reframe,

    rebindTriggers:
      rebindTriggers,

    getState:
      getPublicState,

    getControl2Context:
      getControl2Context,

    destroy:
      destroy
  };

  global.HOUSE_CONTROL_PAD =
    API;

  listen(
    global,
    DATA_READY_EVENT,
    function handleDataReady() {
      mount();
    }
  );

  if (
    global.document.readyState ===
      "loading"
  ) {
    listen(
      global.document,
      "DOMContentLoaded",
      function handleDomReady() {
        mount();
      },
      {
        once: true
      }
    );
  } else {
    mount();
  }
})(window);
