/*
  Diamond Gate Bridge — Gauges Visual Runtime
  File: /gauges/gauges_runtime.js
  Generation: 1
  Baseline: Gauges Baseline 4
  Role: optional visual/runtime enhancement for the Website Health Gauges page.
*/

(function () {
  "use strict";

  var RUNTIME_NAME = "DGBGaugesRuntime";
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";

  var state = {
    started: false,
    page: "gauges",
    baseline: "Generation 1 · Baseline 4",
    receipts: [],
    warnings: [],
    startedAt: null
  };

  function now() {
    return new Date().toISOString();
  }

  function siteRuntime() {
    return window[SITE_RUNTIME_NAME] || null;
  }

  function addReceipt(type, payload) {
    var receipt = {
      type: type,
      time: now(),
      payload: payload || {}
    };

    state.receipts.push(receipt);

    if (state.receipts.length > 50) {
      state.receipts.shift();
    }

    if (siteRuntime() && typeof siteRuntime().addReceipt === "function") {
      siteRuntime().addReceipt("GAUGES_VISUAL_" + type, payload || {});
    }

    return receipt;
  }

  function addWarning(code, message, payload) {
    var warning = {
      code: code,
      message: message,
      time: now(),
      payload: payload || {}
    };

    state.warnings.push(warning);

    if (state.warnings.length > 50) {
      state.warnings.shift();
    }

    if (siteRuntime() && typeof siteRuntime().addWarning === "function") {
      siteRuntime().addWarning(code, message, payload || {});
    }

    return warning;
  }

  function injectStyles() {
    if (document.getElementById("dgb-gauges-runtime-style")) return;

    var style = document.createElement("style");
    style.id = "dgb-gauges-runtime-style";
    style.textContent = [
      ":root{--dgb-gauge-runtime-glow:rgba(255,217,138,.22);}",
      "body[data-dgb-gauges-runtime='active']{--dgb-gauge-runtime-status:1;}",
      ".dgb-gauges-runtime-receipt{",
      "display:inline-flex;align-items:center;gap:.45rem;margin:.75rem 0 0;",
      "border:1px solid rgba(255,248,231,.18);border-radius:999px;",
      "padding:.45rem .7rem;background:rgba(255,255,255,.045);",
      "color:rgba(255,248,231,.72);font:700 .72rem/1 system-ui,sans-serif;",
      "letter-spacing:.11em;text-transform:uppercase;",
      "box-shadow:0 0 26px var(--dgb-gauge-runtime-glow);",
      "}",
      ".dgb-gauges-runtime-dot{width:.5rem;height:.5rem;border-radius:999px;",
      "background:rgba(255,217,138,.9);box-shadow:0 0 14px rgba(255,217,138,.72);}",
      "[data-dgb-gauge-enhanced='true']{",
      "box-shadow:0 0 0 1px rgba(255,248,231,.06),0 0 28px rgba(255,217,138,.06);",
      "}",
      ".dgb-gauge-runtime-soft-pulse{animation:dgbGaugeSoftPulse 3.2s ease-in-out infinite;}",
      "@keyframes dgbGaugeSoftPulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.08)}}",
      "@media (prefers-reduced-motion:reduce){.dgb-gauge-runtime-soft-pulse{animation:none}}"
    ].join("");

    document.head.appendChild(style);
  }

  function pageLooksLikeGauges() {
    var path = window.location.pathname || "";
    var text = document.body ? document.body.textContent : "";

    return (
      path.indexOf("/gauges") === 0 ||
      text.indexOf("Website Health Gauges") !== -1 ||
      text.indexOf("Current website health") !== -1 ||
      text.indexOf("Route health ledger") !== -1
    );
  }

  function findPrimaryHeading() {
    return (
      document.querySelector("h1") ||
      document.querySelector("[data-gauges-title]") ||
      document.querySelector("main")
    );
  }

  function installReceipt() {
    if (document.querySelector("[data-dgb-gauges-runtime-receipt]")) return;

    var anchor = findPrimaryHeading();
    if (!anchor || !anchor.parentNode) return;

    var receipt = document.createElement("div");
    receipt.className = "dgb-gauges-runtime-receipt";
    receipt.setAttribute("data-dgb-gauges-runtime-receipt", "true");

    var dot = document.createElement("span");
    dot.className = "dgb-gauges-runtime-dot";
    dot.setAttribute("aria-hidden", "true");

    var label = document.createElement("span");
    label.textContent = "Gauges visual runtime active";

    receipt.appendChild(dot);
    receipt.appendChild(label);

    if (anchor.nextSibling) {
      anchor.parentNode.insertBefore(receipt, anchor.nextSibling);
    } else {
      anchor.parentNode.appendChild(receipt);
    }
  }

  function enhanceGaugeSurfaces() {
    var textTargets = [
      "Website health",
      "Structure",
      "Runtime",
      "Content",
      "Drift Risk",
      "Route health ledger",
      "Runtime ledger",
      "What is working",
      "What is wrong",
      "What needs to be done"
    ];

    var candidates = Array.prototype.slice.call(document.querySelectorAll("section, article, div, li, table"));

    candidates.forEach(function (node) {
      var text = node.textContent || "";
      var matched = textTargets.some(function (target) {
        return text.indexOf(target) !== -1;
      });

      if (matched) {
        node.setAttribute("data-dgb-gauge-enhanced", "true");
      }
    });

    var strongNumbers = Array.prototype.slice.call(document.querySelectorAll("strong, b"));

    strongNumbers.forEach(function (node) {
      if (/\d+%|\d+\s*\/\s*100/.test(node.textContent || "")) {
        node.classList.add("dgb-gauge-runtime-soft-pulse");
      }
    });
  }

  function registerWithSiteRuntime(validated) {
    var site = siteRuntime();

    if (!site) return;

    if (typeof site.registerRuntime === "function") {
      site.registerRuntime({
        id: "gaugesVisualRuntime",
        page: "gauges",
        role: "optional-gauges-visual-enhancement",
        path: "/gauges/gauges_runtime.js",
        validated: Boolean(validated),
        optional: true
      });
    }

    if (typeof site.registerPage === "function") {
      site.registerPage({
        id: "gauges",
        title: "Website Health Gauges",
        baseline: state.baseline,
        theme: "Learn to Live to Love",
        visibleFirst: Boolean(document.body && document.body.textContent.length > 80)
      });
    }
  }

  function start() {
    if (state.started) return getState();

    state.started = true;
    state.startedAt = now();

    document.body.setAttribute("data-dgb-gauges-runtime", "active");

    injectStyles();

    if (!pageLooksLikeGauges()) {
      addWarning("GAUGES_PAGE_IDENTITY_WEAK", "The gauges runtime loaded, but the page identity did not strongly read as gauges.");
    }

    installReceipt();
    enhanceGaugeSurfaces();
    registerWithSiteRuntime(true);

    addReceipt("RUNTIME_STARTED", {
      path: "/gauges/gauges_runtime.js",
      baseline: state.baseline
    });

    return getState();
  }

  function validate() {
    var result = {
      ok: pageLooksLikeGauges(),
      runtime: RUNTIME_NAME,
      path: "/gauges/gauges_runtime.js",
      started: state.started,
      page: state.page,
      baseline: state.baseline,
      visualReceiptPresent: Boolean(document.querySelector("[data-dgb-gauges-runtime-receipt]")),
      externalImageDependency: false,
      graphicGenerationUsed: false
    };

    if (siteRuntime() && typeof siteRuntime().updateRuntimeStatus === "function") {
      siteRuntime().updateRuntimeStatus("gaugesVisualRuntime", {
        validated: result.ok,
        loaded: true,
        lastValidation: result
      });
    }

    return result;
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      started: state.started,
      startedAt: state.startedAt,
      page: state.page,
      baseline: state.baseline,
      receipts: state.receipts.slice(),
      warnings: state.warnings.slice()
    };
  }

  window[RUNTIME_NAME] = Object.freeze({
    start: start,
    validate: validate,
    getState: getState
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
