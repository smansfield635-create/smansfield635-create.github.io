// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_ESTATE_BLUEPRINT_PORTRAIT_ICONS_JS_TNT_v3
// Full-file replacement.
//
// Purpose:
// - Provide a reusable universal House controller.
// - Room-first routing: user chooses or enters a room; controller determines authority.
// - Estate blueprint layout: rooms are containers with different sizes, not circular compass nodes.
// - Avatar portraits live inside home rooms.
// - Authorized avatar travels through estate hallways/room containers to the target room.
// - Arrival action opens the correct guide or room.
// - Avoid separate per-door portals.
// - Character-first routing remains future Portrait Hall scope.
//
// Required companion:
// - /assets/house-control-pad/house.control-pad.css
//
// Minimal room mount:
//
// <button type="button" data-house-control-pad-open>
//   Open House Controller
// </button>
//
// <div
//   data-house-control-pad-root
//   data-house-room="book-chamber"
// ></div>
//
// Public API:
// window.HOUSE_CONTROL_PAD.open({ room: "book-chamber" })
// window.HOUSE_CONTROL_PAD.close()
// window.HOUSE_CONTROL_PAD.travelToRoom("product-gallery")
// window.HOUSE_CONTROL_PAD.registerRoom({...})
// window.HOUSE_CONTROL_PAD.registerAgent({...})

(function houseControlPadEstateBlueprintPortraitIcons() {
  "use strict";

  var CONTRACT = "HOUSE_CONTROL_PAD_ESTATE_BLUEPRINT_PORTRAIT_ICONS_JS_TNT_v3";
  var DEFAULT_ROOM_ID = "house-core";

  var STATE = {
    initialized: false,
    isOpen: false,
    isAnimating: false,
    currentRoom: DEFAULT_ROOM_ID,
    selectedRoom: null,
    selectedAgent: null,
    root: null,
    overlay: null,
    panel: null,
    map: null,
    avatarLayer: null,
    status: null,
    arrivalPanel: null,
    previousFocus: null,
    animationTimer: null
  };

  /*
    Estate blueprint geometry:
    x/y/w/h are percentages of the blueprint canvas.
    avatarX/avatarY are room-local percentages translated to map coordinates.
    Rooms are intentionally different sizes.
  */
  var ROOMS = {
    "guide-foyer": {
      id: "guide-foyer",
      label: "Guide Foyer",
      shortLabel: "Guide",
      type: "orientation",
      route: "/site-guide/",
      authority: "jeeves",
      x: 34,
      y: 5,
      w: 32,
      h: 15,
      avatarX: 50,
      avatarY: 56,
      doors: ["house-core", "book-chamber", "human-threshold"],
      description: "The practical guide foyer and orientation threshold."
    },

    "human-threshold": {
      id: "human-threshold",
      label: "Human Threshold",
      shortLabel: "Sean",
      type: "human",
      route: "/meet-sean-mansfield/",
      authority: "elara",
      x: 5,
      y: 5,
      w: 27,
      h: 25,
      avatarX: 58,
      avatarY: 60,
      doors: ["guide-foyer", "showroom", "house-core"],
      description: "Meet Sean and the human voice behind the House."
    },

    "book-chamber": {
      id: "book-chamber",
      label: "Book Chamber",
      shortLabel: "Book",
      type: "book",
      route: "/nine-summits-of-love/",
      authority: "elara",
      x: 68,
      y: 5,
      w: 27,
      h: 25,
      avatarX: 42,
      avatarY: 60,
      doors: ["guide-foyer", "law-library", "house-core"],
      description: "The Nine Summits of Love, 256 Carats of Human Potential, and the climb toward Love."
    },

    "showroom": {
      id: "showroom",
      label: "Showroom / Atrium",
      shortLabel: "Showroom",
      type: "showroom",
      route: "/showroom/",
      authority: "jeeves",
      x: 5,
      y: 33,
      w: 27,
      h: 26,
      avatarX: 58,
      avatarY: 50,
      doors: ["human-threshold", "house-core", "atlas-study"],
      description: "The public showroom and visible proof-object entry."
    },

    "house-core": {
      id: "house-core",
      label: "House Core",
      shortLabel: "Core",
      type: "orientation",
      route: "/",
      authority: "jeeves",
      x: 34,
      y: 23,
      w: 32,
      h: 36,
      avatarX: 50,
      avatarY: 50,
      doors: ["guide-foyer", "human-threshold", "book-chamber", "showroom", "product-gallery", "portrait-hall"],
      description: "The central compass of the estate. Use this when the visitor needs whole-House orientation."
    },

    "product-gallery": {
      id: "product-gallery",
      label: "Product Gallery",
      shortLabel: "Products",
      type: "product",
      route: "/products/",
      authority: "auren",
      x: 68,
      y: 33,
      w: 27,
      h: 26,
      avatarX: 42,
      avatarY: 50,
      doors: ["book-chamber", "house-core", "education-room", "law-library"],
      description: "The practical product floor and public value gallery."
    },

    "atlas-study": {
      id: "atlas-study",
      label: "Atlas Study",
      shortLabel: "Atlas",
      type: "world",
      route: "/showroom/globe/",
      authority: "jeeves",
      x: 5,
      y: 62,
      w: 27,
      h: 16,
      avatarX: 58,
      avatarY: 52,
      doors: ["showroom", "hearth-room", "portrait-hall"],
      description: "World, globe, planet, and atlas study."
    },

    "hearth-room": {
      id: "hearth-room",
      label: "Hearth Room",
      shortLabel: "Hearth",
      type: "world",
      route: "/showroom/globe/hearth/",
      authority: "jeeves",
      x: 5,
      y: 81,
      w: 27,
      h: 14,
      avatarX: 58,
      avatarY: 50,
      doors: ["atlas-study"],
      description: "Hearth world room and planetary lane."
    },

    "portrait-hall": {
      id: "portrait-hall",
      label: "Portrait Hall",
      shortLabel: "Portraits",
      type: "future-character",
      route: "/characters/",
      authority: "jeeves",
      x: 34,
      y: 62,
      w: 32,
      h: 33,
      avatarX: 50,
      avatarY: 44,
      doors: ["house-core", "atlas-study", "diagnostic-room"],
      description: "Future character-first routing. For now, Jeeves orients the hall."
    },

    "education-room": {
      id: "education-room",
      label: "Education Room",
      shortLabel: "Education",
      type: "product",
      route: "/products/education/",
      authority: "auren",
      x: 68,
      y: 62,
      w: 27,
      h: 14,
      avatarX: 42,
      avatarY: 50,
      doors: ["product-gallery", "diagnostic-room"],
      description: "Education systems, 1,001 Traversal, and practical learning tools."
    },

    "diagnostic-room": {
      id: "diagnostic-room",
      label: "Diagnostic Room",
      shortLabel: "Diagnostic",
      type: "diagnostic",
      route: "/coherence-diagnostic/",
      authority: "soren",
      x: 68,
      y: 79,
      w: 27,
      h: 16,
      avatarX: 42,
      avatarY: 48,
      doors: ["education-room", "portrait-hall", "frontier-workshop"],
      description: "Coherence diagnostic boundary, assessment, and orientation logic."
    },

    "law-library": {
      id: "law-library",
      label: "Law Library",
      shortLabel: "Laws",
      type: "law",
      route: "/laws/",
      authority: "jeeves",
      x: 68,
      y: 23,
      w: 27,
      h: 7,
      avatarX: 42,
      avatarY: 50,
      doors: ["book-chamber", "product-gallery"],
      description: "Laws, governance, and proof language."
    },

    "lab": {
      id: "lab",
      label: "The Lab",
      shortLabel: "Lab",
      type: "proof",
      route: "/gauges/",
      authority: "jeeves",
      x: 34,
      y: 96,
      w: 15,
      h: 0,
      hidden: true,
      avatarX: 50,
      avatarY: 50,
      doors: ["portrait-hall"],
      description: "Gauges, proof surfaces, and instrumentation."
    },

    "frontier-workshop": {
      id: "frontier-workshop",
      label: "Frontier Workshop",
      shortLabel: "Frontier",
      type: "frontier",
      route: "/explore/frontier/",
      authority: "auren",
      x: 50,
      y: 96,
      w: 16,
      h: 0,
      hidden: true,
      avatarX: 50,
      avatarY: 50,
      doors: ["diagnostic-room"],
      description: "Frontier systems and experimental applied lanes."
    }
  };

  var AGENTS = {
    jeeves: {
      id: "jeeves",
      label: "Jeeves",
      title: "House Guide",
      homeRoom: "house-core",
      route: "/showroom/globe/hearth/jeeves/",
      palette: "jeeves",
      face: "butler",
      authorityLine: "Jeeves has authority for whole-House orientation, the Showroom, the Atlas, and rooms where the visitor needs the map.",
      actionLabel: "Ask Jeeves",
      description: "Whole House map, orientation, and where every door belongs."
    },

    auren: {
      id: "auren",
      label: "Auren",
      title: "Product Guide",
      homeRoom: "product-gallery",
      route: "/products/auren/",
      palette: "auren",
      face: "maker",
      authorityLine: "Auren has authority for products, practical tools, Education, 1,001 Traversal, and applied systems.",
      actionLabel: "Talk to Auren",
      description: "Product floor, tools, practical systems, and Education."
    },

    soren: {
      id: "soren",
      label: "Soren",
      title: "Diagnostic Guide",
      homeRoom: "diagnostic-room",
      route: "/coherence-diagnostic/",
      palette: "soren",
      face: "lens",
      authorityLine: "Soren has authority for diagnostic boundaries, coherence orientation, and assessment logic.",
      actionLabel: "Talk to Soren",
      description: "Diagnostic room, coherence boundary, and assessment orientation."
    },

    elara: {
      id: "elara",
      label: "Elara",
      title: "Signal Bearer",
      homeRoom: "human-threshold",
      route: "/elara/",
      palette: "elara",
      face: "signal",
      authorityLine: "Elara has authority for the human threshold, Sean, the Book Chamber, and Mirrorland’s climate.",
      actionLabel: "Talk to Elara",
      description: "Human threshold, The Nine Summits of Love, and Mirrorland’s climate."
    }
  };

  var AUTHORITY_FALLBACK = {
    orientation: "jeeves",
    showroom: "jeeves",
    world: "jeeves",
    proof: "jeeves",
    law: "jeeves",
    product: "auren",
    frontier: "auren",
    diagnostic: "soren",
    human: "elara",
    book: "elara",
    "future-character": "jeeves"
  };

  function normalize(value) {
    if (value === null || typeof value === "undefined") return "";
    return String(value).replace(/\s+/g, " ").trim();
  }

  function q(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function create(tag, className, attrs) {
    var node = document.createElement(tag);

    if (className) node.className = className;

    if (attrs && typeof attrs === "object") {
      Object.keys(attrs).forEach(function (key) {
        if (key === "text") {
          node.textContent = attrs[key];
        } else if (key === "html") {
          node.innerHTML = attrs[key];
        } else if (key === "dataset" && attrs[key]) {
          Object.keys(attrs[key]).forEach(function (dataKey) {
            node.dataset[dataKey] = attrs[key][dataKey];
          });
        } else if (key === "aria" && attrs[key]) {
          Object.keys(attrs[key]).forEach(function (ariaKey) {
            node.setAttribute("aria-" + ariaKey, attrs[key][ariaKey]);
          });
        } else if (attrs[key] !== null && typeof attrs[key] !== "undefined") {
          node.setAttribute(key, attrs[key]);
        }
      });
    }

    return node;
  }

  function empty(node) {
    if (!node) return;
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function escapeHTML(value) {
    return normalize(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function roomExists(roomId) {
    return Boolean(ROOMS[roomId]);
  }

  function agentExists(agentId) {
    return Boolean(AGENTS[agentId]);
  }

  function getRoom(roomId) {
    if (roomExists(roomId)) return ROOMS[roomId];
    return ROOMS[DEFAULT_ROOM_ID];
  }

  function getAgent(agentId) {
    if (agentExists(agentId)) return AGENTS[agentId];
    return AGENTS.jeeves;
  }

  function resolveAuthority(room) {
    if (!room) return "jeeves";
    if (agentExists(room.authority)) return room.authority;
    if (room.type && AUTHORITY_FALLBACK[room.type]) return AUTHORITY_FALLBACK[room.type];
    return "jeeves";
  }

  function roomCenter(room) {
    var safeRoom = getRoom(room && room.id ? room.id : room);

    if (safeRoom.hidden) {
      if (safeRoom.id === "lab") return { x: 41.5, y: 92 };
      if (safeRoom.id === "frontier-workshop") return { x: 58, y: 92 };
    }

    return {
      x: safeRoom.x + safeRoom.w / 2,
      y: safeRoom.y + safeRoom.h / 2
    };
  }

  function roomAvatarPoint(room) {
    var safeRoom = getRoom(room && room.id ? room.id : room);

    if (safeRoom.hidden) {
      return roomCenter(safeRoom);
    }

    return {
      x: safeRoom.x + safeRoom.w * ((safeRoom.avatarX || 50) / 100),
      y: safeRoom.y + safeRoom.h * ((safeRoom.avatarY || 50) / 100)
    };
  }

  function getCurrentRoomFromDOM() {
    var root = q("[data-house-control-pad-root]");
    var explicit = root && root.getAttribute("data-house-room");

    if (roomExists(explicit)) return explicit;

    var bodyRoom = document.body && document.body.getAttribute("data-house-room");
    if (roomExists(bodyRoom)) return bodyRoom;

    var htmlRoom = document.documentElement.getAttribute("data-house-room");
    if (roomExists(htmlRoom)) return htmlRoom;

    var route = location.pathname.replace(/\/+$/, "/");

    var routeMatches = Object.keys(ROOMS).filter(function (roomId) {
      return ROOMS[roomId].route === route;
    });

    if (routeMatches.length) return routeMatches[0];

    if (route.indexOf("/meet-sean-mansfield/") === 0) return "human-threshold";
    if (route.indexOf("/nine-summits-of-love/") === 0) return "book-chamber";
    if (route.indexOf("/elara/") === 0) return "human-threshold";
    if (route.indexOf("/products/auren/") === 0) return "product-gallery";
    if (route.indexOf("/products/education/") === 0) return "education-room";
    if (route.indexOf("/products/") === 0) return "product-gallery";
    if (route.indexOf("/coherence-diagnostic/") === 0) return "diagnostic-room";
    if (route.indexOf("/showroom/globe/hearth/") === 0) return "hearth-room";
    if (route.indexOf("/showroom/globe/") === 0) return "atlas-study";
    if (route.indexOf("/showroom/") === 0) return "showroom";
    if (route.indexOf("/site-guide/") === 0) return "guide-foyer";
    if (route.indexOf("/gauges/") === 0) return "lab";
    if (route.indexOf("/laws/") === 0) return "law-library";
    if (route.indexOf("/characters/") === 0) return "portrait-hall";
    if (route.indexOf("/explore/frontier/") === 0) return "frontier-workshop";
    if (route === "/") return "house-core";

    return DEFAULT_ROOM_ID;
  }

  function ensureRoot() {
    var root = q("[data-house-control-pad-root]");

    if (!root) {
      root = create("div", "", {
        "data-house-control-pad-root": "true",
        "data-house-room": getCurrentRoomFromDOM()
      });

      document.body.appendChild(root);
    }

    STATE.root = root;
    return root;
  }

  function setStatus(message) {
    if (STATE.status) STATE.status.textContent = normalize(message);
  }

  function setBodyOpen(isOpen) {
    document.documentElement.setAttribute("data-house-control-pad-open", isOpen ? "true" : "false");
    document.body.setAttribute("data-house-control-pad-open", isOpen ? "true" : "false");
  }

  function safeFocus(node) {
    if (!node || typeof node.focus !== "function") return;

    try {
      node.focus({ preventScroll: true });
    } catch (error) {
      node.focus();
    }
  }

  function getFocusable(root) {
    return qa(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      root
    ).filter(function (node) {
      return node.offsetParent !== null || node === document.activeElement;
    });
  }

  function trapFocus(event) {
    if (!STATE.isOpen || !STATE.panel || event.key !== "Tab") return;

    var focusables = getFocusable(STATE.panel);
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      safeFocus(last);
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      safeFocus(first);
    }
  }

  function handleKeydown(event) {
    if (!STATE.isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeControlPad();
      return;
    }

    trapFocus(event);
  }

  function clearAnimationTimer() {
    if (STATE.animationTimer) {
      window.clearTimeout(STATE.animationTimer);
      STATE.animationTimer = null;
    }
  }

  function clearTravelPath() {
    qa("[data-house-control-pad-travel-path]", STATE.panel).forEach(function (line) {
      line.remove();
    });
  }

  function drawTravelSegment(fromPoint, toPoint, index) {
    if (!STATE.map || !fromPoint || !toPoint) return null;

    var line = create("div", "hcp-travel-line", {
      "data-house-control-pad-travel-path": "true"
    });

    var dx = toPoint.x - fromPoint.x;
    var dy = toPoint.y - fromPoint.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;

    line.style.left = fromPoint.x + "%";
    line.style.top = fromPoint.y + "%";
    line.style.width = length + "%";
    line.style.transform = "rotate(" + angle + "deg)";
    line.style.animationDelay = (index * 80) + "ms";

    STATE.map.appendChild(line);

    return line;
  }

  function buildTravelPath(fromRoom, toRoom) {
    var from = roomAvatarPoint(fromRoom);
    var to = roomAvatarPoint(toRoom);
    var center = roomCenter(ROOMS["house-core"]);

    if (fromRoom.id === "house-core" || toRoom.id === "house-core") {
      return [from, to];
    }

    return [from, center, to];
  }

  function drawTravelPath(fromRoom, toRoom) {
    clearTravelPath();

    var path = buildTravelPath(fromRoom, toRoom);

    for (var i = 0; i < path.length - 1; i += 1) {
      drawTravelSegment(path[i], path[i + 1], i);
    }
  }

  function clearActiveStates() {
    qa("[data-house-room-node]", STATE.panel).forEach(function (node) {
      node.setAttribute("data-selected", "false");
      node.setAttribute("data-current", "false");
      node.setAttribute("data-arrival", "false");
    });

    qa("[data-house-avatar]", STATE.panel).forEach(function (node) {
      node.setAttribute("data-selected", "false");
      node.setAttribute("data-traveling", "false");
      node.setAttribute("data-arrived", "false");
    });
  }

  function markRoomState(roomId, key, value) {
    var node = q('[data-house-room-node="' + roomId + '"]', STATE.panel);
    if (node) node.setAttribute(key, value ? "true" : "false");
  }

  function markAgentState(agentId, key, value) {
    var node = q('[data-house-avatar="' + agentId + '"]', STATE.panel);
    if (node) node.setAttribute(key, value ? "true" : "false");
  }

  function setAvatarPosition(agentId, roomId) {
    var agent = getAgent(agentId);
    var room = getRoom(roomId);
    var avatar = q('[data-house-avatar="' + agent.id + '"]', STATE.panel);
    var point = roomAvatarPoint(room);

    if (!avatar || !point) return;

    avatar.style.left = point.x + "%";
    avatar.style.top = point.y + "%";
    avatar.setAttribute("data-current-room", room.id);
  }

  function resetAvatarHomePositions() {
    Object.keys(AGENTS).forEach(function (agentId) {
      var agent = AGENTS[agentId];
      setAvatarPosition(agentId, agent.homeRoom);
    });
  }

  function setCurrentRoom(roomId) {
    var room = getRoom(roomId);

    STATE.currentRoom = room.id;

    if (STATE.root) {
      STATE.root.setAttribute("data-house-room", room.id);
    }

    markRoomState(room.id, "data-current", true);
  }

  function buildHeader() {
    var header = create("header", "hcp-header", {
      "aria-label": "House Control Pad header"
    });

    var titleWrap = create("div", "hcp-title-wrap");
    var kicker = create("div", "hcp-kicker", { text: "Universal House Controller" });
    var title = create("h2", "hcp-title", { text: "Choose the room. The House summons the right guide." });
    var subtitle = create("p", "hcp-subtitle", {
      text: "Estate blueprint routing: rooms have boundaries, size, adjacency, and authority."
    });

    titleWrap.appendChild(kicker);
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    var closeButton = create("button", "hcp-close", {
      type: "button",
      "data-house-control-pad-close": "true",
      "aria-label": "Close House Control Pad",
      text: "×"
    });

    closeButton.addEventListener("click", closeControlPad);

    header.appendChild(titleWrap);
    header.appendChild(closeButton);

    return header;
  }

  function buildRoomNode(room) {
    if (room.hidden) return null;

    var authority = getAgent(resolveAuthority(room));

    var node = create("button", "hcp-room-node hcp-room-" + room.type, {
      type: "button",
      "data-house-room-node": room.id,
      "data-house-room-type": room.type,
      "data-selected": "false",
      "data-current": "false",
      "data-arrival": "false",
      "aria-label": room.label + ". " + room.description + " Authority: " + authority.label + "."
    });

    node.style.left = room.x + "%";
    node.style.top = room.y + "%";
    node.style.width = room.w + "%";
    node.style.height = room.h + "%";

    var interior = create("span", "hcp-room-interior");
    var label = create("span", "hcp-room-label", { text: room.shortLabel || room.label });
    var full = create("span", "hcp-room-full-label", { text: room.label });
    var authorityNode = create("span", "hcp-room-authority", { text: authority.label });

    interior.appendChild(label);
    interior.appendChild(full);
    interior.appendChild(authorityNode);

    node.appendChild(interior);

    node.addEventListener("click", function () {
      travelToRoom(room.id, { source: "room-click" });
    });

    return node;
  }

  function buildAvatarFace(agent) {
    var face = create("span", "hcp-avatar-face hcp-face-" + agent.face, {
      "aria-hidden": "true"
    });

    var glow = create("span", "hcp-face-glow");
    var hair = create("span", "hcp-face-hair");
    var head = create("span", "hcp-face-head");
    var eyes = create("span", "hcp-face-eyes");
    var nose = create("span", "hcp-face-nose");
    var mouth = create("span", "hcp-face-mouth");
    var cue = create("span", "hcp-face-cue");
    var badge = create("span", "hcp-face-badge", { text: agent.label.charAt(0) });

    head.appendChild(eyes);
    head.appendChild(nose);
    head.appendChild(mouth);

    face.appendChild(glow);
    face.appendChild(hair);
    face.appendChild(head);
    face.appendChild(cue);
    face.appendChild(badge);

    return face;
  }

  function buildAvatar(agent) {
    var avatar = create("button", "hcp-avatar hcp-avatar-" + agent.palette, {
      type: "button",
      "data-house-avatar": agent.id,
      "data-house-avatar-face": agent.face,
      "data-selected": "false",
      "data-traveling": "false",
      "data-arrived": "false",
      "data-current-room": agent.homeRoom,
      "aria-label": agent.label + ". " + agent.description
    });

    var face = buildAvatarFace(agent);
    var label = create("span", "hcp-avatar-label", { text: agent.label });

    avatar.appendChild(face);
    avatar.appendChild(label);

    avatar.addEventListener("click", function () {
      travelToRoom(agent.homeRoom, { source: "agent-home-click", agent: agent.id });
    });

    return avatar;
  }

  function buildHallways() {
    var halls = create("div", "hcp-hallways", { "aria-hidden": "true" });

    [
      "main-vertical",
      "main-horizontal",
      "north-hall",
      "south-hall",
      "west-hall",
      "east-hall"
    ].forEach(function (name) {
      halls.appendChild(create("span", "hcp-hallway hcp-hallway-" + name));
    });

    return halls;
  }

  function buildMap() {
    var mapWrap = create("section", "hcp-map-wrap", {
      "aria-label": "Estate blueprint"
    });

    var map = create("div", "hcp-map", {
      "data-house-control-pad-map": "true",
      "data-blueprint-layout": "estate-floor-plan"
    });

    var blueprint = create("div", "hcp-blueprint-lines", { "aria-hidden": "true" });

    map.appendChild(blueprint);
    map.appendChild(buildHallways());

    Object.keys(ROOMS).forEach(function (roomId) {
      var roomNode = buildRoomNode(ROOMS[roomId]);
      if (roomNode) map.appendChild(roomNode);
    });

    var avatarLayer = create("div", "hcp-avatar-layer", {
      "data-house-control-pad-avatar-layer": "true",
      "aria-hidden": "false"
    });

    Object.keys(AGENTS).forEach(function (agentId) {
      avatarLayer.appendChild(buildAvatar(AGENTS[agentId]));
    });

    map.appendChild(avatarLayer);
    mapWrap.appendChild(map);

    STATE.map = map;
    STATE.avatarLayer = avatarLayer;

    return mapWrap;
  }

  function buildRoomList() {
    var list = create("section", "hcp-room-list", {
      "aria-label": "House rooms"
    });

    var heading = create("h3", "hcp-section-title", { text: "Rooms by authority" });
    list.appendChild(heading);

    Object.keys(ROOMS).forEach(function (roomId) {
      var room = ROOMS[roomId];
      var agent = getAgent(resolveAuthority(room));

      var button = create("button", "hcp-room-card", {
        type: "button",
        "data-house-room-card": room.id
      });

      button.innerHTML =
        '<span class="hcp-room-card-main">' +
          '<b>' + escapeHTML(room.label) + '</b>' +
          '<small>' + escapeHTML(room.description) + '</small>' +
        '</span>' +
        '<span class="hcp-room-card-guide">' + escapeHTML(agent.label) + '</span>';

      button.addEventListener("click", function () {
        travelToRoom(room.id, { source: "room-card-click" });
      });

      list.appendChild(button);
    });

    return list;
  }

  function buildArrivalPanel() {
    var panel = create("section", "hcp-arrival-panel", {
      "data-house-control-pad-arrival": "true",
      "data-visible": "false",
      "aria-label": "Guide arrival"
    });

    var eyebrow = create("div", "hcp-arrival-eyebrow", { text: "Guide authority" });
    var title = create("h3", "hcp-arrival-title", {
      "data-hcp-arrival-title": "true",
      text: "Choose a room."
    });

    var body = create("p", "hcp-arrival-body", {
      "data-hcp-arrival-body": "true",
      text: "The House will summon the right guide."
    });

    var actions = create("div", "hcp-arrival-actions");

    var talk = create("button", "hcp-arrival-action hcp-arrival-primary", {
      type: "button",
      "data-hcp-arrival-talk": "true",
      text: "Talk to Guide"
    });

    var openRoom = create("button", "hcp-arrival-action", {
      type: "button",
      "data-hcp-arrival-room": "true",
      text: "Open Room"
    });

    var cancel = create("button", "hcp-arrival-action hcp-arrival-muted", {
      type: "button",
      text: "Cancel"
    });

    talk.addEventListener("click", openSelectedAgent);
    openRoom.addEventListener("click", openSelectedRoom);
    cancel.addEventListener("click", hideArrivalPanel);

    actions.appendChild(talk);
    actions.appendChild(openRoom);
    actions.appendChild(cancel);

    panel.appendChild(eyebrow);
    panel.appendChild(title);
    panel.appendChild(body);
    panel.appendChild(actions);

    STATE.arrivalPanel = panel;

    return panel;
  }

  function buildFooter() {
    var footer = create("footer", "hcp-footer");

    var status = create("div", "hcp-status", {
      "data-house-control-pad-status": "true",
      "aria-live": "polite",
      text: "House Control Pad ready."
    });

    var controls = create("div", "hcp-footer-actions");

    var currentRoomButton = create("button", "hcp-footer-button", {
      type: "button",
      text: "Summon guide for this room"
    });

    currentRoomButton.addEventListener("click", function () {
      travelToRoom(STATE.currentRoom, { source: "current-room" });
    });

    var coreButton = create("button", "hcp-footer-button", {
      type: "button",
      text: "Return to House Core"
    });

    coreButton.addEventListener("click", function () {
      travelToRoom("house-core", { source: "footer-core" });
    });

    controls.appendChild(currentRoomButton);
    controls.appendChild(coreButton);

    footer.appendChild(status);
    footer.appendChild(controls);

    STATE.status = status;

    return footer;
  }

  function buildPanel() {
    var overlay = create("div", "hcp-overlay", {
      "data-house-control-pad-overlay": "true",
      "data-open": "false",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "House Control Pad"
    });

    var panel = create("div", "hcp-panel", {
      "data-house-control-pad-panel": "true"
    });

    var body = create("div", "hcp-body");

    panel.appendChild(buildHeader());
    body.appendChild(buildMap());
    body.appendChild(buildRoomList());

    panel.appendChild(body);
    panel.appendChild(buildArrivalPanel());
    panel.appendChild(buildFooter());

    overlay.appendChild(panel);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeControlPad();
    });

    STATE.overlay = overlay;
    STATE.panel = panel;

    return overlay;
  }

  function render() {
    ensureRoot();

    if (STATE.overlay && STATE.overlay.parentNode) {
      STATE.overlay.parentNode.removeChild(STATE.overlay);
    }

    var overlay = buildPanel();
    document.body.appendChild(overlay);

    resetAvatarHomePositions();

    STATE.initialized = true;

    document.documentElement.setAttribute("data-house-control-pad-ready", "true");
    document.documentElement.setAttribute("data-house-control-pad-layout", "estate-floor-plan");
    document.body.setAttribute("data-house-control-pad-ready", "true");
    document.body.setAttribute("data-house-control-pad-layout", "estate-floor-plan");

    window.dispatchEvent(new CustomEvent("house-control-pad:ready", {
      detail: {
        contract: CONTRACT,
        currentRoom: STATE.currentRoom,
        layout: "estate-floor-plan",
        roomContainers: true,
        roomFirst: true,
        avatarPortraits: true,
        characterFirstDeferredToPortraitHall: true
      }
    }));
  }

  function openControlPad(options) {
    if (!STATE.initialized) render();

    options = options || {};

    STATE.previousFocus = document.activeElement;

    var requestedRoom = options.room || getCurrentRoomFromDOM();
    var room = getRoom(requestedRoom);

    STATE.currentRoom = room.id;
    STATE.selectedRoom = null;
    STATE.selectedAgent = null;

    if (STATE.overlay) {
      STATE.overlay.setAttribute("data-open", "true");
    }

    STATE.isOpen = true;
    setBodyOpen(true);

    clearActiveStates();
    resetAvatarHomePositions();
    hideArrivalPanel();

    setCurrentRoom(room.id);
    markRoomState(room.id, "data-current", true);

    setStatus("Current room: " + room.label + ". Choose a room or summon the authority for this room.");

    document.addEventListener("keydown", handleKeydown);

    window.setTimeout(function () {
      var close = q("[data-house-control-pad-close]", STATE.panel);
      safeFocus(close || STATE.panel);
    }, 30);

    if (options.autoSummon) {
      window.setTimeout(function () {
        travelToRoom(room.id, { source: "auto-summon" });
      }, 260);
    }

    window.dispatchEvent(new CustomEvent("house-control-pad:open", {
      detail: {
        contract: CONTRACT,
        currentRoom: room.id,
        layout: "estate-floor-plan"
      }
    }));
  }

  function closeControlPad() {
    if (!STATE.overlay) return;

    clearAnimationTimer();

    STATE.overlay.setAttribute("data-open", "false");
    STATE.isOpen = false;
    STATE.isAnimating = false;
    setBodyOpen(false);
    setStatus("House Control Pad closed.");

    document.removeEventListener("keydown", handleKeydown);

    if (STATE.previousFocus) {
      safeFocus(STATE.previousFocus);
      STATE.previousFocus = null;
    }

    window.dispatchEvent(new CustomEvent("house-control-pad:close", {
      detail: {
        contract: CONTRACT
      }
    }));
  }

  function hideArrivalPanel() {
    if (!STATE.arrivalPanel) return;

    STATE.arrivalPanel.setAttribute("data-visible", "false");
  }

  function showArrivalPanel(room, agent) {
    if (!STATE.arrivalPanel || !room || !agent) return;

    var title = q("[data-hcp-arrival-title]", STATE.arrivalPanel);
    var body = q("[data-hcp-arrival-body]", STATE.arrivalPanel);
    var talk = q("[data-hcp-arrival-talk]", STATE.arrivalPanel);
    var roomButton = q("[data-hcp-arrival-room]", STATE.arrivalPanel);

    if (title) {
      title.textContent = agent.label + " has arrived at " + room.label + ".";
    }

    if (body) {
      body.textContent = agent.authorityLine;
    }

    if (talk) {
      talk.textContent = agent.actionLabel;
    }

    if (roomButton) {
      roomButton.textContent = "Open " + room.shortLabel;
    }

    STATE.arrivalPanel.setAttribute("data-visible", "true");

    setStatus(agent.label + " has arrived at " + room.label + ".");

    window.dispatchEvent(new CustomEvent("house-control-pad:arrival", {
      detail: {
        contract: CONTRACT,
        room: room.id,
        agent: agent.id,
        agentRoute: agent.route,
        roomRoute: room.route
      }
    }));
  }

  function openSelectedAgent() {
    var agent = getAgent(STATE.selectedAgent);

    if (agent && agent.route) {
      window.location.href = agent.route;
    }
  }

  function openSelectedRoom() {
    var room = getRoom(STATE.selectedRoom);

    if (room && room.route) {
      window.location.href = room.route;
    }
  }

  function travelToRoom(roomId, options) {
    if (!STATE.initialized) render();

    if (!STATE.isOpen) {
      openControlPad({ room: roomId });
    }

    clearAnimationTimer();

    options = options || {};

    var targetRoom = getRoom(roomId);
    var authorityId = options.agent && agentExists(options.agent)
      ? options.agent
      : resolveAuthority(targetRoom);

    var agent = getAgent(authorityId);
    var homeRoom = getRoom(agent.homeRoom);

    STATE.selectedRoom = targetRoom.id;
    STATE.selectedAgent = agent.id;
    STATE.isAnimating = true;

    clearActiveStates();
    hideArrivalPanel();

    markRoomState(STATE.currentRoom, "data-current", true);
    markRoomState(targetRoom.id, "data-selected", true);
    markAgentState(agent.id, "data-selected", true);

    setAvatarPosition(agent.id, homeRoom.id);

    drawTravelPath(homeRoom, targetRoom);

    setStatus(agent.label + " is moving from " + homeRoom.label + " to " + targetRoom.label + ".");

    var avatar = q('[data-house-avatar="' + agent.id + '"]', STATE.panel);
    var targetPoint = roomAvatarPoint(targetRoom);

    if (avatar) {
      avatar.setAttribute("data-traveling", "true");

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          avatar.style.left = targetPoint.x + "%";
          avatar.style.top = targetPoint.y + "%";
        });
      });
    }

    STATE.animationTimer = window.setTimeout(function () {
      STATE.isAnimating = false;

      clearTravelPath();
      markAgentState(agent.id, "data-traveling", false);
      markAgentState(agent.id, "data-arrived", true);
      markRoomState(targetRoom.id, "data-arrival", true);

      if (avatar) {
        avatar.setAttribute("data-current-room", targetRoom.id);
      }

      showArrivalPanel(targetRoom, agent);
    }, 1180);

    window.dispatchEvent(new CustomEvent("house-control-pad:travel", {
      detail: {
        contract: CONTRACT,
        source: options.source || "unknown",
        room: targetRoom.id,
        agent: agent.id,
        from: homeRoom.id,
        to: targetRoom.id,
        layout: "estate-floor-plan"
      }
    }));
  }

  function registerRoom(room) {
    if (!room || !room.id) return false;

    ROOMS[room.id] = {
      id: normalize(room.id),
      label: normalize(room.label || room.id),
      shortLabel: normalize(room.shortLabel || room.label || room.id),
      type: normalize(room.type || "orientation"),
      route: normalize(room.route || "/"),
      authority: normalize(room.authority || "jeeves"),
      x: typeof room.x === "number" ? room.x : 40,
      y: typeof room.y === "number" ? room.y : 40,
      w: typeof room.w === "number" ? room.w : 20,
      h: typeof room.h === "number" ? room.h : 14,
      avatarX: typeof room.avatarX === "number" ? room.avatarX : 50,
      avatarY: typeof room.avatarY === "number" ? room.avatarY : 50,
      doors: Array.isArray(room.doors) ? room.doors : [],
      hidden: Boolean(room.hidden),
      description: normalize(room.description || "")
    };

    if (STATE.initialized) render();

    return true;
  }

  function registerAgent(agent) {
    if (!agent || !agent.id) return false;

    AGENTS[agent.id] = {
      id: normalize(agent.id),
      label: normalize(agent.label || agent.id),
      title: normalize(agent.title || "Guide"),
      homeRoom: roomExists(agent.homeRoom) ? agent.homeRoom : DEFAULT_ROOM_ID,
      route: normalize(agent.route || "/"),
      palette: normalize(agent.palette || agent.id),
      face: normalize(agent.face || "guide"),
      authorityLine: normalize(agent.authorityLine || ""),
      actionLabel: normalize(agent.actionLabel || "Talk to Guide"),
      description: normalize(agent.description || "")
    };

    if (STATE.initialized) render();

    return true;
  }

  function bindOpenButtons() {
    qa("[data-house-control-pad-open]").forEach(function (button) {
      if (button.getAttribute("data-house-control-pad-bound") === "true") return;

      button.setAttribute("data-house-control-pad-bound", "true");

      button.addEventListener("click", function () {
        var room = button.getAttribute("data-house-room") || getCurrentRoomFromDOM();
        var autoSummon = button.getAttribute("data-house-control-pad-auto-summon") === "true";

        openControlPad({
          room: room,
          autoSummon: autoSummon
        });
      });
    });
  }

  function boot() {
    STATE.currentRoom = getCurrentRoomFromDOM();

    ensureRoot();
    render();
    bindOpenButtons();

    window.HOUSE_CONTROL_PAD = {
      contract: CONTRACT,
      open: openControlPad,
      close: closeControlPad,
      travelToRoom: travelToRoom,
      registerRoom: registerRoom,
      registerAgent: registerAgent,
      rooms: ROOMS,
      agents: AGENTS,
      getState: function () {
        return {
          initialized: STATE.initialized,
          isOpen: STATE.isOpen,
          isAnimating: STATE.isAnimating,
          currentRoom: STATE.currentRoom,
          selectedRoom: STATE.selectedRoom,
          selectedAgent: STATE.selectedAgent,
          layout: "estate-floor-plan",
          avatarPortraits: true
        };
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    window.setTimeout(boot, 0);
  }
})();
