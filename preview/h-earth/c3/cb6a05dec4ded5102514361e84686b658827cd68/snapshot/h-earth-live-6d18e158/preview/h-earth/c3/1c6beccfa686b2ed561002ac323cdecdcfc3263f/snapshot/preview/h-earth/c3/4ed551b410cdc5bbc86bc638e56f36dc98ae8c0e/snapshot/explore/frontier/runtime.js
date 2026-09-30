(function () {
  "use strict";

  var DGB_FRONTIER_RUNTIME_VERSION = "FRONTIER_RUNTIME_G1_LOCK_v1";

  var ROUTES = {
    explore: "/explore/",
    frontier: "/explore/frontier/",
    shimmer: "/explore/frontier/shimmer/",
    lattice: "/explore/frontier/lattice/",
    trajectory: "/explore/frontier/trajectory/",
    vision: "/explore/frontier/vision/",
    visionRemote: "/explore/frontier/vision-remote/",
    urban: "/explore/frontier/urban/",
    closedLoop: "/explore/frontier/closed-loop/",
    water: "/explore/frontier/water/",
    waste: "/explore/frontier/waste/",
    energy: "/explore/frontier/energy/",
    infrastructure: "/explore/frontier/infrastructure/",
    manual: "/explore/frontier/manual/",
    door: "/door/",
    home: "/home/",
    prelude: "/prelude/",
    products: "/products/",
    gauges: "/gauges/",
    laws: "/laws/",
    about: "/about/"
  };

  var FRONTIER_ALIASES = {
    "/frontier": ROUTES.frontier,
    "/frontier/": ROUTES.frontier,
    "frontier": ROUTES.frontier,
    "frontier/": ROUTES.frontier
  };

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
    return value === "zh" || value === "es" || value === "en" ? value : "en";
  }

  function normalizeTime(value) {
    if (value === "trajectory") return "post";
    return value === "origin" || value === "now" || value === "post" ? value : "now";
  }

  function normalizeLane(value) {
    return value === "engineering" || value === "platform" ? value : "platform";
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

    if (FRONTIER_ALIASES[clean]) return FRONTIER_ALIASES[clean];

    if (clean === "/explore/frontier") return ROUTES.frontier;
    if (clean === "/explore") return ROUTES.explore;

    if (clean.indexOf("https://diamondgatebridge.com/frontier") === 0) {
      return clean.replace(
        "https://diamondgatebridge.com/frontier",
        "https://diamondgatebridge.com/explore/frontier"
      );
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
    var path = String(route || "");
    var hashIndex = path.indexOf("#");

    if (hashIndex >= 0) {
      hash = path.slice(hashIndex);
      path = path.slice(0, hashIndex);
    }

    var queryIndex = path.indexOf("?");

    if (queryIndex >= 0) {
      path = path.slice(0, queryIndex);
    }

    return {
      path: normalizeRoute(path),
      hash: hash
    };
  }

  function wireLink(anchor, state) {
    var rawRoute = anchor.getAttribute("data-route") || anchor.getAttribute("href");

    if (!isInternalRoute(rawRoute)) return;

    var parts = splitRoute(rawRoute);

    if (!parts.path) return;

    anchor.setAttribute("href", parts.path + buildQuery(state) + parts.hash);

    if (anchor.hasAttribute("data-route")) {
      anchor.setAttribute("data-route", parts.path);
    }
  }

  function wireRoutes(state) {
    document.querySelectorAll("a[href], a[data-route]").forEach(function (anchor) {
      wireLink(anchor, state);
    });
  }

  function repairFrontierAliases() {
    document.querySelectorAll(
      "a[href='/frontier'],a[href='/frontier/'],a[data-route='/frontier'],a[data-route='/frontier/']"
    ).forEach(function (node) {
      node.setAttribute("href", ROUTES.frontier);
      if (node.hasAttribute("data-route")) {
        node.setAttribute("data-route", ROUTES.frontier);
      }
    });
  }

  function redirectLegacyFrontierPath() {
    var path = window.location.pathname;

    if (path === "/frontier" || path === "/frontier/") {
      window.location.replace(ROUTES.frontier + window.location.search + window.location.hash);
    }
  }

  function applyRuntimeIdentity() {
    var path = window.location.pathname;

    document.documentElement.setAttribute("data-dgb-frontier-runtime", DGB_FRONTIER_RUNTIME_VERSION);
    document.documentElement.setAttribute("data-dgb-display-name", "Frontier");
    document.documentElement.setAttribute("data-dgb-parent-section", "Explore");

    if (path.indexOf(ROUTES.frontier) === 0) {
      document.documentElement.setAttribute("data-dgb-route-family", "frontier");
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
        state.gd_lang = normalizeLang(
          button.getAttribute("data-value") ||
          button.value ||
          button.textContent.trim().toLowerCase()
        );

        safeStorageSet("gd_lang", state.gd_lang);
        applyStateControls(state);
        wireRoutes(state);
        window.history.replaceState({}, "", window.location.pathname + buildQuery(state) + window.location.hash);
      });
    });

    document.querySelectorAll("[data-dgb-lane-control]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.lane = normalizeLane(
          button.getAttribute("data-value") ||
          button.value ||
          button.textContent.trim().toLowerCase()
        );

        applyStateControls(state);
        wireRoutes(state);
        window.history.replaceState({}, "", window.location.pathname + buildQuery(state) + window.location.hash);
      });
    });
  }

  function markFrontierLinks() {
    Object.keys(ROUTES).forEach(function (key) {
      var route = ROUTES[key];

      if (route.indexOf(ROUTES.frontier) === 0) {
        document.querySelectorAll("a[href^='" + route + "'],a[data-route^='" + route + "']").forEach(function (node) {
          node.setAttribute("data-frontier-route", key);
        });
      }
    });
  }

  function mountReceipt(state) {
    var existing = document.getElementById("dgb-frontier-runtime-receipt");
    if (existing) existing.remove();

    var receipt = document.createElement("script");
    receipt.type = "application/json";
    receipt.id = "dgb-frontier-runtime-receipt";
    receipt.textContent = JSON.stringify({
      runtime: DGB_FRONTIER_RUNTIME_VERSION,
      display_name: "Frontier",
      parent_section: "Explore",
      canonical_route: ROUTES.frontier,
      canonical_file: "/explore/frontier/index.html",
      repaired_alias: "/frontier/",
      state_carry: {
        gd_lang: state.gd_lang,
        gd_style: state.gd_style,
        gd_time: state.gd_time,
        gd_depth: state.gd_depth,
        lane: state.lane
      },
      rule: "The page is called Frontier. It lives at /explore/frontier/."
    });

    document.body.appendChild(receipt);
  }

  function init() {
    redirectLegacyFrontierPath();
    applyRuntimeIdentity();

    var state = readState();

    repairFrontierAliases();
    wireRoutes(state);
    applyStateControls(state);
    bindStateControls(state);
    markFrontierLinks();
    mountReceipt(state);

    window.DGBFrontierRuntime = Object.freeze({
      version: DGB_FRONTIER_RUNTIME_VERSION,
      routes: Object.freeze(Object.assign({}, ROUTES)),
      readState: readState,
      buildQuery: function (overrides) {
        return buildQuery(readState(), overrides || {});
      },
      normalizeRoute: normalizeRoute,
      wire: function () {
        var nextState = readState();
        repairFrontierAliases();
        wireRoutes(nextState);
        markFrontierLinks();
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
