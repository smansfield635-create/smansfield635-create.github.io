(function () {
  "use strict";

  var DGB_EXPLORE_RUNTIME_VERSION = "EXPLORE_FRONTIER_RUNTIME_G1_LOCK_v1";

  var ROUTES = {
    explore: "/explore/",
    frontier: "/explore/frontier/",
    frontierLegacy: "/frontier/",
    door: "/door/",
    home: "/home/",
    prelude: "/prelude/",
    products: "/products/",
    gauges: "/gauges/",
    laws: "/laws/",
    about: "/about/"
  };

  var FRONTIER_CHILDREN = [
    "/explore/frontier/shimmer/",
    "/explore/frontier/lattice/",
    "/explore/frontier/trajectory/",
    "/explore/frontier/vision/",
    "/explore/frontier/vision-remote/",
    "/explore/frontier/urban/",
    "/explore/frontier/closed-loop/",
    "/explore/frontier/water/",
    "/explore/frontier/waste/",
    "/explore/frontier/energy/",
    "/explore/frontier/infrastructure/",
    "/explore/frontier/manual/"
  ];

  function safeStorageGet(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {}
  }

  function normalizeLang(value) {
    if (value === "zh" || value === "es" || value === "en") return value;
    return "en";
  }

  function normalizeTime(value) {
    if (value === "trajectory") return "post";
    if (value === "origin" || value === "now" || value === "post") return value;
    return "now";
  }

  function normalizeLane(value) {
    if (value === "engineering" || value === "platform") return value;
    return "platform";
  }

  function readState() {
    var params = new URLSearchParams(window.location.search);

    var lang = normalizeLang(
      params.get("gd_lang") ||
      params.get("lang") ||
      safeStorageGet("gd_lang", "en")
    );

    var time = normalizeTime(
      params.get("gd_time") ||
      params.get("time") ||
      safeStorageGet("gd_time", "now")
    );

    var lane = normalizeLane(params.get("lane") || "platform");

    safeStorageSet("gd_lang", lang);
    safeStorageSet("gd_style", "informal");
    safeStorageSet("gd_time", time);
    safeStorageSet("gd_depth", "explore");

    return {
      gd_lang: lang,
      gd_style: "informal",
      gd_time: time,
      gd_depth: "explore",
      lane: lane
    };
  }

  function buildQuery(state, overrides) {
    var next = Object.assign({}, state, overrides || {});
    var query = new URLSearchParams();

    query.set("gd_lang", normalizeLang(next.gd_lang));
    query.set("gd_style", "informal");
    query.set("gd_time", normalizeTime(next.gd_time));
    query.set("gd_depth", "explore");
    query.set("lane", normalizeLane(next.lane));

    return "?" + query.toString();
  }

  function normalizeRoute(route) {
    if (!route) return "";

    var clean = String(route).trim();

    if (clean === "/frontier" || clean === "/frontier/") {
      return ROUTES.frontier;
    }

    if (clean === "frontier" || clean === "frontier/") {
      return ROUTES.frontier;
    }

    if (clean === "/explore/frontier" || clean === "/explore/frontier/") {
      return ROUTES.frontier;
    }

    if (clean === "/explore" || clean === "/explore/") {
      return ROUTES.explore;
    }

    if (clean.indexOf("https://diamondgatebridge.com/frontier") === 0) {
      return clean.replace("https://diamondgatebridge.com/frontier", "https://diamondgatebridge.com/explore/frontier");
    }

    return clean;
  }

  function isInternalRoute(route) {
    if (!route) return false;

    if (route.indexOf("mailto:") === 0) return false;
    if (route.indexOf("tel:") === 0) return false;
    if (route.indexOf("#") === 0) return false;
    if (route.indexOf("http://") === 0 && route.indexOf("http://diamondgatebridge.com") !== 0) return false;
    if (route.indexOf("https://") === 0 && route.indexOf("https://diamondgatebridge.com") !== 0) return false;

    return true;
  }

  function splitRoute(route) {
    var hash = "";
    var query = "";
    var path = route;

    var hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      hash = path.slice(hashIndex);
      path = path.slice(0, hashIndex);
    }

    var queryIndex = path.indexOf("?");
    if (queryIndex >= 0) {
      query = path.slice(queryIndex);
      path = path.slice(0, queryIndex);
    }

    return {
      path: normalizeRoute(path),
      query: query,
      hash: hash
    };
  }

  function wireLink(anchor, state) {
    var route = anchor.getAttribute("data-route") || anchor.getAttribute("href");

    if (!isInternalRoute(route)) return;

    var parts = splitRoute(route);

    if (!parts.path) return;

    var target = parts.path + buildQuery(state) + parts.hash;

    anchor.setAttribute("href", target);

    if (anchor.hasAttribute("data-route")) {
      anchor.setAttribute("data-route", parts.path);
    }
  }

  function wireRoutes(state) {
    var anchors = document.querySelectorAll("a[href], a[data-route]");

    anchors.forEach(function (anchor) {
      wireLink(anchor, state);
    });
  }

  function repairFrontierAliases() {
    var frontierSelectors = [
      "a[href='/frontier']",
      "a[href='/frontier/']",
      "a[data-route='/frontier']",
      "a[data-route='/frontier/']"
    ];

    document.querySelectorAll(frontierSelectors.join(",")).forEach(function (node) {
      node.setAttribute("href", ROUTES.frontier);
      if (node.hasAttribute("data-route")) {
        node.setAttribute("data-route", ROUTES.frontier);
      }
    });
  }

  function applyRuntimeIdentity() {
    var path = window.location.pathname;

    document.documentElement.setAttribute("data-dgb-explore-runtime", DGB_EXPLORE_RUNTIME_VERSION);

    if (path === ROUTES.explore) {
      document.documentElement.setAttribute("data-dgb-route-family", "explore");
      document.documentElement.setAttribute("data-dgb-display-name", "Explore");
    } else if (path === ROUTES.frontier || path.indexOf(ROUTES.frontier) === 0) {
      document.documentElement.setAttribute("data-dgb-route-family", "frontier");
      document.documentElement.setAttribute("data-dgb-display-name", "Frontier");
      document.documentElement.setAttribute("data-dgb-parent-section", "Explore");
    }

    if (path === "/frontier" || path === "/frontier/") {
      window.location.replace(ROUTES.frontier + window.location.search + window.location.hash);
    }
  }

  function setPressed(groupSelector, activeValue) {
    document.querySelectorAll(groupSelector).forEach(function (button) {
      var value = button.getAttribute("data-value") || button.value || button.textContent.trim().toLowerCase();
      button.setAttribute("aria-pressed", value === activeValue ? "true" : "false");
    });
  }

  function applyStateControls(state) {
    setPressed("[data-dgb-lang-control]", state.gd_lang);
    setPressed("[data-dgb-lane-control]", state.lane);
  }

  function bindStateControls(state) {
    document.querySelectorAll("[data-dgb-lang-control]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.gd_lang = normalizeLang(button.getAttribute("data-value") || button.value || button.textContent.trim().toLowerCase());
        safeStorageSet("gd_lang", state.gd_lang);
        applyStateControls(state);
        wireRoutes(state);
        window.history.replaceState({}, "", window.location.pathname + buildQuery(state) + window.location.hash);
      });
    });

    document.querySelectorAll("[data-dgb-lane-control]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.lane = normalizeLane(button.getAttribute("data-value") || button.value || button.textContent.trim().toLowerCase());
        applyStateControls(state);
        wireRoutes(state);
        window.history.replaceState({}, "", window.location.pathname + buildQuery(state) + window.location.hash);
      });
    });
  }

  function markFrontierChildren() {
    FRONTIER_CHILDREN.forEach(function (route) {
      document.querySelectorAll("a[href^='" + route + "'], a[data-route^='" + route + "']").forEach(function (node) {
        node.setAttribute("data-frontier-child", "true");
      });
    });
  }

  function mountReceipt(state) {
    var existing = document.getElementById("dgb-explore-runtime-receipt");
    if (existing) existing.remove();

    var receipt = document.createElement("script");
    receipt.type = "application/json";
    receipt.id = "dgb-explore-runtime-receipt";
    receipt.textContent = JSON.stringify({
      runtime: DGB_EXPLORE_RUNTIME_VERSION,
      display_names: {
        explore: "Explore",
        frontier: "Frontier"
      },
      canonical_routes: {
        explore: ROUTES.explore,
        frontier: ROUTES.frontier
      },
      broken_alias_repaired: "/frontier/",
      state_carry: {
        gd_lang: state.gd_lang,
        gd_style: state.gd_style,
        gd_time: state.gd_time,
        gd_depth: state.gd_depth,
        lane: state.lane
      },
      rule: "Explore is the parent route. Frontier is the display name under /explore/frontier/."
    });

    document.body.appendChild(receipt);
  }

  function init() {
    applyRuntimeIdentity();

    var state = readState();

    repairFrontierAliases();
    wireRoutes(state);
    applyStateControls(state);
    bindStateControls(state);
    markFrontierChildren();
    mountReceipt(state);

    window.DGBExploreRuntime = Object.freeze({
      version: DGB_EXPLORE_RUNTIME_VERSION,
      routes: Object.freeze(Object.assign({}, ROUTES)),
      frontierChildren: Object.freeze(FRONTIER_CHILDREN.slice()),
      readState: readState,
      buildQuery: function (overrides) {
        return buildQuery(readState(), overrides || {});
      },
      normalizeRoute: normalizeRoute,
      wire: function () {
        var nextState = readState();
        repairFrontierAliases();
        wireRoutes(nextState);
        mountReceipt(nextState);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
