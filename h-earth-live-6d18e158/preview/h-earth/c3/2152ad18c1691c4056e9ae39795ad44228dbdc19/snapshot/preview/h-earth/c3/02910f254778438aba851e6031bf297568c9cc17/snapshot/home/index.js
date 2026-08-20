// /home/index.js
// TNT FULL-FILE REPLACEMENT
// HOME_RECEIVER_ORBIT_BOOT_AUTHORITY_TNT_v1
// Purpose:
// - Pair /home/ HTML with a lightweight JS authority.
// - Verify the four-point receiver orbit.
// - Publish Home route status.
// - Preserve CSS-only animation.
// - No heavy runtime. No generated image. No graphic box. No streaming. No visual pass claim.

const HOME_STATE = Object.freeze({
  contract: "HOME_RECEIVER_ORBIT_BOOT_AUTHORITY_TNT_v1",
  route: "/home/",
  page: "home",
  role: "estate-receiver",
  renewedHtmlContract: "HOME_LOCAL_4_POINT_RECEIVER_ORBIT_AUTHORITY_RENEWAL_TNT_v1",
  alignmentContract: "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2",
  animationStandard: "LOCAL_4_DIAMOND_RECEIVER_ORBIT_STANDARD_v1",
  primaryNodeCount: 4,
  heavyRuntimeLoaded: false,
  generatedImage: false,
  graphicBox: false,
  streaming: false,
  visualPassClaimed: false
});

const HOME_PRIMARY_ROUTES = Object.freeze({
  north: Object.freeze({
    key: "north",
    label: "Manor",
    route: "/explore/",
    role: "rooms"
  }),

  east: Object.freeze({
    key: "east",
    label: "Book",
    route: "/nine-summits-of-love/",
    role: "climb"
  }),

  south: Object.freeze({
    key: "south",
    label: "Showroom",
    route: "/showroom/",
    role: "atrium"
  }),

  west: Object.freeze({
    key: "west",
    label: "Gauges",
    route: "/gauges/",
    role: "proof"
  })
});

const state = {
  booted: false,
  valid: false,
  nodeCount: 0,
  missingDirections: [],
  routeMismatches: [],
  lastFocusedDirection: ""
};

function markDocument(extra = {}) {
  const markers = {
    homeJsContract: HOME_STATE.contract,
    homeHtmlContract: HOME_STATE.renewedHtmlContract,
    homeRoute: HOME_STATE.route,
    homeRole: HOME_STATE.role,
    homeJsMounted: String(state.booted),
    homeOrbitValid: String(state.valid),
    homeNodeCount: String(state.nodeCount),
    homeHeavyRuntimeLoaded: "false",
    generatedImage: "false",
    graphicBox: "false",
    streaming: "false",
    visualPassClaimed: "false",
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function getStage() {
  return document.querySelector("[data-home-stage]");
}

function getOrbit() {
  return document.querySelector("[data-home-orbit]");
}

function getNodes() {
  return [...document.querySelectorAll("[data-home-node]")];
}

function normalizeRoute(route) {
  const value = String(route || "").trim();
  if (!value) return "/";
  return value.endsWith("/") ? value : `${value}/`;
}

function getExpectedRoute(direction) {
  return HOME_PRIMARY_ROUTES[direction]?.route || "";
}

function auditOrbit() {
  const nodes = getNodes();
  const seenDirections = new Set();
  const routeMismatches = [];

  nodes.forEach((node) => {
    const direction = String(node.dataset.homeDirection || "").trim().toLowerCase();
    const actualRoute = normalizeRoute(node.getAttribute("href") || node.dataset.homeRoute);
    const expectedRoute = normalizeRoute(getExpectedRoute(direction));

    if (direction) seenDirections.add(direction);

    if (expectedRoute && actualRoute !== expectedRoute) {
      routeMismatches.push({
        direction,
        expected: expectedRoute,
        actual: actualRoute
      });
    }

    node.dataset.homeNodeBound = node.dataset.homeNodeBound || "false";
    node.dataset.homeExpectedRoute = expectedRoute || "unknown";
  });

  const missingDirections = Object.keys(HOME_PRIMARY_ROUTES).filter(
    (direction) => !seenDirections.has(direction)
  );

  state.nodeCount = nodes.length;
  state.missingDirections = missingDirections;
  state.routeMismatches = routeMismatches;
  state.valid =
    nodes.length === HOME_STATE.primaryNodeCount &&
    missingDirections.length === 0 &&
    routeMismatches.length === 0;

  return Object.freeze({
    valid: state.valid,
    nodeCount: state.nodeCount,
    expectedNodeCount: HOME_STATE.primaryNodeCount,
    missingDirections: [...missingDirections],
    routeMismatches: routeMismatches.map((item) => Object.freeze({ ...item }))
  });
}

function bindNode(node) {
  if (node.dataset.homeNodeBound === "true") return;

  node.dataset.homeNodeBound = "true";

  node.addEventListener("focus", () => {
    state.lastFocusedDirection = node.dataset.homeDirection || "";
    markDocument({
      homeLastFocusedDirection: state.lastFocusedDirection
    });
  });

  node.addEventListener("mouseenter", () => {
    state.lastFocusedDirection = node.dataset.homeDirection || "";
    markDocument({
      homeLastFocusedDirection: state.lastFocusedDirection
    });
  });
}

function bindNodes() {
  getNodes().forEach(bindNode);
}

function publishStatus() {
  window.DGBHomeReceiver = Object.freeze({
    ...HOME_STATE,

    primaryRoutes: HOME_PRIMARY_ROUTES,

    auditOrbit,

    status() {
      return Object.freeze({
        ...HOME_STATE,
        ready: state.booted,
        orbitValid: state.valid,
        nodeCount: state.nodeCount,
        expectedNodeCount: HOME_STATE.primaryNodeCount,
        missingDirections: [...state.missingDirections],
        routeMismatches: state.routeMismatches.map((item) => Object.freeze({ ...item })),
        lastFocusedDirection: state.lastFocusedDirection,
        stagePresent: Boolean(getStage()),
        orbitPresent: Boolean(getOrbit())
      });
    }
  });
}

function boot() {
  if (state.booted) return window.DGBHomeReceiver || null;

  state.booted = true;

  bindNodes();
  const audit = auditOrbit();

  markDocument({
    homeBooted: "true",
    homeOrbitValid: String(audit.valid),
    homeNodeCount: String(audit.nodeCount),
    homeMissingDirections: audit.missingDirections.join(",") || "none",
    homeRouteMismatches: audit.routeMismatches.length ? String(audit.routeMismatches.length) : "none"
  });

  publishStatus();

  return window.DGBHomeReceiver;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  HOME_STATE,
  HOME_PRIMARY_ROUTES,
  auditOrbit,
  boot
};

export default Object.freeze({
  model: "home-receiver-orbit-boot-authority",
  contract: HOME_STATE.contract,
  route: HOME_STATE.route,
  boot,
  auditOrbit
});
