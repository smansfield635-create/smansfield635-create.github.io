/*
  Diamond Gate Bridge — Cross-Board Site Runtime
  File: /runtime/site_runtime.js
  Generation: 1
  Role: shared runtime coordination, baseline receipts, route health, page/runtime registration.
*/

(function () {
  "use strict";

  var RUNTIME_NAME = "DGBSiteRuntime";
  var VERSION = "1.0.0";

  var ROUTES = [
    { id: "home", label: "Home", path: "/" },
    { id: "prelude", label: "Prelude", path: "/prelude/" },
    { id: "explore", label: "Explore", path: "/explore/" },
    { id: "products", label: "Products", path: "/products/" },
    { id: "gauges", label: "Gauges", path: "/gauges/" },
    { id: "frontier", label: "Frontier", path: "/frontier/" },
    { id: "laws", label: "Laws", path: "/laws/" },
    { id: "governance", label: "Governance", path: "/governance/" }
  ];

  var state = {
    name: RUNTIME_NAME,
    version: VERSION,
    startedAt: Date.now(),
    currentPage: detectCurrentPage(),
    theme: "Learn to Live to Love",
    visibleFirst: false,
    baselines: {},
    pages: {},
    runtimes: {},
    routes: ROUTES.slice(),
    receipts: [],
    warnings: [],
    health: {
      overall: 0,
      visibleFirst: 0,
      runtime: 0,
      routeCoverage: 0,
      driftRisk: 100
    }
  };

  function now() {
    return new Date().toISOString();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function detectCurrentPage() {
    var path = window.location.pathname || "/";

    if (path === "/" || path === "/index.html") return "home";
    if (path.indexOf("/gauges") === 0) return "gauges";
    if (path.indexOf("/products") === 0) return "products";
    if (path.indexOf("/laws") === 0) return "laws";
    if (path.indexOf("/governance") === 0) return "governance";
    if (path.indexOf("/prelude") === 0) return "prelude";
    if (path.indexOf("/explore") === 0) return "explore";
    if (path.indexOf("/frontier") === 0) return "frontier";

    return "unknown";
  }

  function addReceipt(type, payload) {
    var receipt = {
      type: type,
      time: now(),
      page: state.currentPage,
      payload: payload || {}
    };

    state.receipts.push(receipt);

    if (state.receipts.length > 80) {
      state.receipts.shift();
    }

    publishState();

    return receipt;
  }

  function addWarning(code, message, payload) {
    var warning = {
      code: code,
      message: message,
      time: now(),
      page: state.currentPage,
      payload: payload || {}
    };

    state.warnings.push(warning);

    if (state.warnings.length > 80) {
      state.warnings.shift();
    }

    publishState();

    return warning;
  }

  function hasVisibleRoot() {
    var root =
      document.getElementById("door-root") ||
      document.getElementById("page-root") ||
      document.querySelector("[data-root-door]") ||
      document.querySelector("main");

    return Boolean(root && root.textContent && root.textContent.trim().length > 80);
  }

  function hasTheme() {
    return document.body && document.body.textContent.indexOf(state.theme) !== -1;
  }

  function getRouteCoverage() {
    var links = Array.prototype.slice.call(document.querySelectorAll("a[href]"));
    var hrefs = links.map(function (link) {
      return link.getAttribute("href");
    });

    var matched = ROUTES.filter(function (route) {
      return hrefs.indexOf(route.path) !== -1;
    });

    return {
      total: ROUTES.length,
      matched: matched.length,
      score: ROUTES.length ? Math.round((matched.length / ROUTES.length) * 100) : 0,
      matchedRoutes: matched.map(function (route) {
        return route.id;
      })
    };
  }

  function computeHealth() {
    var routeCoverage = getRouteCoverage();

    var visibleFirstScore = state.visibleFirst ? 100 : hasVisibleRoot() ? 76 : 0;

    var runtimeNames = Object.keys(state.runtimes);
    var runtimeValidated = runtimeNames.filter(function (name) {
      return state.runtimes[name] && state.runtimes[name].validated;
    }).length;

    var runtimeScore = runtimeNames.length
      ? Math.round((runtimeValidated / runtimeNames.length) * 100)
      : 45;

    var themeScore = hasTheme() ? 100 : 40;

    var driftRisk = Math.max(
      0,
      100 - Math.round((visibleFirstScore + runtimeScore + routeCoverage.score + themeScore) / 4)
    );

    state.health = {
      overall: Math.round((visibleFirstScore + runtimeScore + routeCoverage.score + themeScore + (100 - driftRisk)) / 5),
      visibleFirst: visibleFirstScore,
      runtime: runtimeScore,
      routeCoverage: routeCoverage.score,
      driftRisk: driftRisk
    };

    return clone(state.health);
  }

  function publishState() {
    document.documentElement.setAttribute("data-dgb-site-runtime", "active");
    document.documentElement.setAttribute("data-dgb-current-page", state.currentPage);
    document.documentElement.setAttribute("data-dgb-runtime-health", String(state.health.overall));
  }

  function registerPage(config) {
    var pageId = (config && config.id) || state.currentPage;

    state.pages[pageId] = {
      id: pageId,
      title: (config && config.title) || document.title || pageId,
      baseline: (config && config.baseline) || "unbound",
      theme: (config && config.theme) || state.theme,
      visibleFirst: Boolean(config && config.visibleFirst),
      registeredAt: now()
    };

    if (state.pages[pageId].visibleFirst) {
      state.visibleFirst = true;
    }

    if (state.pages[pageId].baseline) {
      state.baselines[pageId] = state.pages[pageId].baseline;
    }

    computeHealth();

    return addReceipt("PAGE_REGISTERED", state.pages[pageId]);
  }

  function registerRuntime(config) {
    var runtimeId = (config && config.id) || "unknown_runtime";

    state.runtimes[runtimeId] = {
      id: runtimeId,
      page: (config && config.page) || state.currentPage,
      role: (config && config.role) || "runtime",
      path: (config && config.path) || "",
      validated: Boolean(config && config.validated),
      optional: Boolean(config && config.optional),
      registeredAt: now()
    };

    computeHealth();

    return addReceipt("RUNTIME_REGISTERED", state.runtimes[runtimeId]);
  }

  function updateRuntimeStatus(runtimeId, patch) {
    if (!state.runtimes[runtimeId]) {
      state.runtimes[runtimeId] = {
        id: runtimeId,
        page: state.currentPage,
        role: "runtime",
        path: "",
        validated: false,
        optional: true,
        registeredAt: now()
      };
    }

    Object.keys(patch || {}).forEach(function (key) {
      state.runtimes[runtimeId][key] = patch[key];
    });

    state.runtimes[runtimeId].updatedAt = now();

    computeHealth();

    return addReceipt("RUNTIME_UPDATED", state.runtimes[runtimeId]);
  }

  function registerVisibleFirst(payload) {
    state.visibleFirst = true;
    computeHealth();

    return addReceipt("VISIBLE_FIRST_CONFIRMED", payload || {});
  }

  function auditCurrentPage() {
    var visible = hasVisibleRoot();
    var theme = hasTheme();
    var routeCoverage = getRouteCoverage();

    if (!visible) {
      addWarning("VISIBLE_FIRST_FAIL", "Current page does not have a strong visible-first root.");
    }

    if (!theme && state.currentPage === "home") {
      addWarning("THEME_MISSING", "Root page does not visibly contain Learn to Live to Love.");
    }

    if (routeCoverage.score < 50) {
      addWarning("LOW_ROUTE_COVERAGE", "Current page exposes fewer than half of expected route links.", routeCoverage);
    }

    computeHealth();

    return addReceipt("PAGE_AUDIT_COMPLETE", {
      visibleFirst: visible,
      themePresent: theme,
      routeCoverage: routeCoverage,
      health: clone(state.health)
    });
  }

  function getState() {
    computeHealth();
    return clone(state);
  }

  function validate() {
    computeHealth();

    return {
      ok: hasVisibleRoot(),
      runtime: RUNTIME_NAME,
      version: VERSION,
      currentPage: state.currentPage,
      visibleFirst: state.visibleFirst || hasVisibleRoot(),
      themePresent: hasTheme(),
      health: clone(state.health)
    };
  }

  function start() {
    registerPage({
      id: state.currentPage,
      title: document.title || state.currentPage,
      baseline: document.body && document.body.textContent.indexOf("Root Door Seasonal Solar Baseline") !== -1
        ? "Generation 1 Root Door Seasonal Solar Baseline 1"
        : "unbound",
      theme: state.theme,
      visibleFirst: hasVisibleRoot()
    });

    auditCurrentPage();

    publishState();
  }

  window[RUNTIME_NAME] = Object.freeze({
    name: RUNTIME_NAME,
    version: VERSION,
    start: start,
    registerPage: registerPage,
    registerRuntime: registerRuntime,
    updateRuntimeStatus: updateRuntimeStatus,
    registerVisibleFirst: registerVisibleFirst,
    auditCurrentPage: auditCurrentPage,
    addReceipt: addReceipt,
    addWarning: addWarning,
    getState: getState,
    validate: validate
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
