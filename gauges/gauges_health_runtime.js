(function () {
  "use strict";

  var RUNTIME_NAME = "DGBGaugesHealthRuntime";
  var VERSION = "spine-canopy-parachute-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var ROOT_CONTRACT = "universe-sun";

  var SOURCE_FILES = [
    {
      id: "rootHtml",
      label: "Root HTML",
      path: "/index.html?gaugeSource=" + VERSION,
      displayPath: "/index.html",
      required: [
        'data-root-boot-id="root-sun-asset-b1"',
        "/index.js?v=root-sun-asset-b1",
        "data-dgb-sun-mount",
        "Learn to Live to Love"
      ]
    },
    {
      id: "indexBoot",
      label: "Index boot",
      path: "/index.js?v=root-sun-asset-b1&gaugeSource=" + VERSION,
      displayPath: "/index.js?v=root-sun-asset-b1",
      required: [
        'ROOT_BOOT_ID = "root-sun-asset-b1"',
        "DGBIndexBoot",
        "ensureFallbackSun"
      ]
    },
    {
      id: "canopyRuntime",
      label: "Spine canopy runtime",
      path: "/runtime/spine_canopy_runtime.js?v=spine-canopy-parachute-b1&gaugeSource=" + VERSION,
      displayPath: "/runtime/spine_canopy_runtime.js?v=spine-canopy-parachute-b1",
      required: [
        "DGBSpineCanopy",
        "spine-canopy-parachute-b1",
        "sunVisible",
        "falseHealthBlocked"
      ]
    },
    {
      id: "sunRuntime",
      label: "Sun asset runtime",
      path: "/runtime/sun_asset_runtime.js?v=root-sun-asset-b1&gaugeSource=" + VERSION,
      displayPath: "/runtime/sun_asset_runtime.js?v=root-sun-asset-b1",
      required: [
        "DGBSunAssetRuntime",
        "universe-scale-field-b7",
        "satellite-solar-disc-b6"
      ]
    },
    {
      id: "sunManifest",
      label: "Sun manifest",
      path: "/assets/sun/sun_manifest.json?v=root-sun-asset-b1&gaugeSource=" + VERSION,
      displayPath: "/assets/sun/sun_manifest.json?v=root-sun-asset-b1",
      required: [
        "root-sun-asset-b1",
        "satellite-solar-disc-b6"
      ]
    },
    {
      id: "gaugesRuntime",
      label: "Gauges health runtime",
      path: "/gauges/gauges_health_runtime.js?v=spine-canopy-parachute-b1&gaugeSource=" + VERSION,
      displayPath: "/gauges/gauges_health_runtime.js?v=spine-canopy-parachute-b1",
      required: [
        "spine-canopy-parachute-b1",
        "probeRootVisualTruth",
        "falseHealthBlocked"
      ]
    }
  ];

  var state = {
    runtime: RUNTIME_NAME,
    version: VERSION,
    rootBootId: ROOT_BOOT_ID,
    rootContract: ROOT_CONTRACT,
    status: "idle",
    startedAt: "",
    finishedAt: "",
    sourceResults: [],
    visualResults: [],
    visualProbe: null,
    working: [],
    issues: [],
    actions: [],
    scores: {
      overall: 0,
      source: 0,
      visual: 0,
      driftRisk: 100
    },
    falseHealthBlocked: true
  };

  function by(selector, root) {
    return (root || document).querySelector(selector);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function round(value) {
    return Math.round(Number(value) || 0);
  }

  function average(values) {
    var clean = values.filter(function (value) {
      return typeof value === "number" && isFinite(value);
    });

    if (!clean.length) return 0;

    return round(clean.reduce(function (sum, value) {
      return sum + value;
    }, 0) / clean.length);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setText(selector, value) {
    var node = by(selector);
    if (node) node.textContent = String(value);
  }

  function setHtml(selector, value) {
    var node = by(selector);
    if (node) node.innerHTML = value;
  }

  function statusClass(status) {
    if (status === "STRONG") return "strong";
    if (status === "FAIL") return "fail";
    return "watch";
  }

  function statusHtml(status) {
    return '<span class="status ' + statusClass(status) + '">' + escapeHtml(status) + "</span>";
  }

  function getTimeText() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function fetchText(path) {
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timeout = controller ? window.setTimeout(function () {
      controller.abort();
    }, 8500) : null;

    return fetch(path, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      return response.text().then(function (text) {
        return {
          ok: response.ok,
          status: response.status,
          path: path,
          text: text
        };
      });
    }).catch(function (error) {
      return {
        ok: false,
        status: 0,
        path: path,
        text: "",
        error: error && error.message ? error.message : "fetch failed"
      };
    }).finally(function () {
      if (timeout) window.clearTimeout(timeout);
    });
  }

  function scoreSource(file, result) {
    var missing;

    if (!result.ok) {
      return {
        id: file.id,
        label: file.label,
        path: file.displayPath,
        status: "FAIL",
        score: 0,
        finding: "HTTP " + result.status + ". " + (result.error || "File not reachable."),
        missing: file.required.slice()
      };
    }

    missing = file.required.filter(function (marker) {
      return result.text.indexOf(marker) === -1;
    });

    if (!missing.length) {
      return {
        id: file.id,
        label: file.label,
        path: file.displayPath,
        status: "STRONG",
        score: 100,
        finding: "Required canopy markers present.",
        missing: []
      };
    }

    return {
      id: file.id,
      label: file.label,
      path: file.displayPath,
      status: "WATCH",
      score: Math.max(40, 100 - missing.length * 16),
      finding: "Missing marker(s): " + missing.join(", "),
      missing: missing
    };
  }

  function scanSources() {
    return Promise.all(SOURCE_FILES.map(function (file) {
      return fetchText(file.path).then(function (result) {
        return scoreSource(file, result);
      });
    })).then(function (results) {
      state.sourceResults = results;
      return results;
    });
  }

  function getRect(node) {
    if (!node || typeof node.getBoundingClientRect !== "function") {
      return { width: 0, height: 0 };
    }

    try {
      var rect = node.getBoundingClientRect();
      return {
        width: Math.round(rect.width || 0),
        height: Math.round(rect.height || 0)
      };
    } catch (error) {
      return { width: 0, height: 0 };
    }
  }

  function visibleInFrame(win, node) {
    var rect;
    var style;

    if (!node) return false;

    rect = getRect(node);
    if (rect.width <= 16 || rect.height <= 16) return false;

    try {
      style = win.getComputedStyle(node);
      if (!style) return true;
      if (style.display === "none") return false;
      if (style.visibility === "hidden") return false;
      if (Number(style.opacity) === 0) return false;
    } catch (error) {
      return true;
    }

    return true;
  }

  function probeRootVisualTruth() {
    return new Promise(function (resolve) {
      var iframe = document.createElement("iframe");
      var settled = false;

      iframe.setAttribute("title", "Root visual truth probe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "fixed";
      iframe.style.width = "390px";
      iframe.style.height = "844px";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      iframe.src = "/?canopyGaugeProbe=" + encodeURIComponent(String(Date.now()));

      function finish(payload) {
        if (settled) return;
        settled = true;

        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);

        state.visualProbe = payload;
        resolve(payload);
      }

      iframe.onload = function () {
        window.setTimeout(function () {
          var win;
          var doc;
          var canopy;
          var indexBoot;
          var root;
          var sunMount;
          var sunFallback;
          var sunCanvas;
          var sunSvg;
          var background;
          var bodyText;
          var fallbackVisible;
          var canvasVisible;
          var svgVisible;

          try {
            win = iframe.contentWindow;
            doc = iframe.contentDocument || (win && win.document);
            bodyText = doc && doc.body ? doc.body.textContent || "" : "";

            canopy = win && win.DGBSpineCanopy && typeof win.DGBSpineCanopy.getPublicState === "function"
              ? win.DGBSpineCanopy.getPublicState()
              : null;

            indexBoot = win && win.DGBIndexBoot && typeof win.DGBIndexBoot.getState === "function"
              ? win.DGBIndexBoot.getState()
              : null;

            root = doc && (doc.getElementById("door-root") || doc.querySelector("[data-universe-sun]") || doc.querySelector("main"));
            sunMount = doc && doc.querySelector("[data-dgb-sun-mount]");
            sunFallback = sunMount && sunMount.querySelector("[data-sun-fallback]");
            sunCanvas = sunMount && sunMount.querySelector("canvas");
            sunSvg = sunMount && sunMount.querySelector("svg");
            background = doc && doc.querySelector(".universe-sky");

            fallbackVisible = visibleInFrame(win, sunFallback);
            canvasVisible = visibleInFrame(win, sunCanvas);
            svgVisible = visibleInFrame(win, sunSvg);

            finish({
              ok: true,
              rootPresent: Boolean(root),
              rootBootId: root ? root.getAttribute("data-root-boot-id") || "" : "",
              rootContract: root ? root.getAttribute("data-root-contract") || "" : "",
              indexBootExecuted: Boolean(win && win.DGBIndexBoot),
              indexBootState: indexBoot,
              canopyPresent: Boolean(canopy),
              canopy: canopy,
              sunMountPresent: Boolean(sunMount),
              fallbackSunPresent: Boolean(sunFallback),
              fallbackSunVisible: fallbackVisible,
              canvasSunPresent: Boolean(sunCanvas),
              canvasSunVisible: canvasVisible,
              svgSunPresent: Boolean(sunSvg),
              svgSunVisible: svgVisible,
              sunVisible: Boolean(fallbackVisible || canvasVisible || svgVisible),
              backgroundPresent: Boolean(background),
              backgroundVisible: visibleInFrame(win, background),
              titlePresent: /Diamond Gate Bridge/i.test(bodyText),
              themePresent: /Learn to Live to Love/i.test(bodyText),
              falseHealthBlocked: true
            });
          } catch (error) {
            finish({
              ok: false,
              error: error && error.message ? error.message : "iframe probe failed",
              falseHealthBlocked: true
            });
          }
        }, 2600);
      };

      iframe.onerror = function () {
        finish({
          ok: false,
          error: "root iframe failed to load",
          falseHealthBlocked: true
        });
      };

      document.body.appendChild(iframe);

      window.setTimeout(function () {
        finish({
          ok: false,
          error: "root visual probe timed out",
          falseHealthBlocked: true
        });
      }, 8000);
    });
  }

  function visualRow(check, pass, finding, warningOnly) {
    return {
      check: check,
      status: pass ? "STRONG" : (warningOnly ? "WATCH" : "FAIL"),
      score: pass ? 100 : (warningOnly ? 60 : 0),
      finding: finding
    };
  }

  function buildVisualLedger(probe) {
    var rows = [];

    rows.push(visualRow("Root document present", probe && probe.rootPresent, "Root page exists in same-origin visual probe."));
    rows.push(visualRow("Root boot id aligned", probe && probe.rootBootId === ROOT_BOOT_ID, "Root boot id must equal " + ROOT_BOOT_ID + "."));
    rows.push(visualRow("Root contract aligned", probe && probe.rootContract === ROOT_CONTRACT, "Root contract must remain " + ROOT_CONTRACT + "."));
    rows.push(visualRow("Index boot executed", probe && probe.indexBootExecuted, "window.DGBIndexBoot must be present in the root iframe."));
    rows.push(visualRow("Canopy runtime present", probe && probe.canopyPresent, "window.DGBSpineCanopy must be present in the root iframe."));
    rows.push(visualRow("Sun mount present", probe && probe.sunMountPresent, "Root must contain [data-dgb-sun-mount]."));
    rows.push(visualRow("Visible sun present", probe && probe.sunVisible, "Canvas, SVG, or fallback sun must be visibly present."));
    rows.push(visualRow("Background visible", probe && probe.backgroundVisible, "Universe background must be visible without owning the sun."));
    rows.push(visualRow("Title present", probe && probe.titlePresent, "Diamond Gate Bridge must remain present."));
    rows.push(visualRow("Theme present", probe && probe.themePresent, "Learn to Live to Love must remain present."));
    rows.push(visualRow("False health blocked", true, "Strong health is capped whenever visible sun or canopy truth is absent."));

    state.visualResults = rows;
    return rows;
  }

  function computeScores() {
    var sourceScore = average(state.sourceResults.map(function (row) {
      return row.score;
    }));
    var visualScore = average(state.visualResults.map(function (row) {
      return row.score;
    }));
    var failCount = state.sourceResults.concat(state.visualResults).filter(function (row) {
      return row.status === "FAIL";
    }).length;
    var watchCount = state.sourceResults.concat(state.visualResults).filter(function (row) {
      return row.status === "WATCH";
    }).length;
    var sunVisible = Boolean(state.visualProbe && state.visualProbe.sunVisible);
    var canopyPresent = Boolean(state.visualProbe && state.visualProbe.canopyPresent);
    var driftRisk = clamp(failCount * 16 + watchCount * 7 + (sunVisible ? 0 : 22) + (canopyPresent ? 0 : 18), 0, 100);
    var overall = round(sourceScore * 0.38 + visualScore * 0.52 + (100 - driftRisk) * 0.10);

    if (!sunVisible) overall = Math.min(overall, 78);
    if (!canopyPresent) overall = Math.min(overall, 84);

    state.scores = {
      source: sourceScore,
      visual: visualScore,
      driftRisk: round(driftRisk),
      overall: round(overall)
    };

    if (state.scores.overall >= 94 && sunVisible && canopyPresent) {
      state.status = "STRONG";
    } else if (state.scores.overall >= 78) {
      state.status = "WATCH";
    } else {
      state.status = "FAIL";
    }

    return state.scores;
  }

  function buildWorkingIssuesActions() {
    var working = [];
    var issues = [];
    var actions = [];

    state.sourceResults.forEach(function (row) {
      if (row.status === "STRONG") {
        working.push("Source strong: " + row.path + ".");
      } else {
        issues.push("Source issue: " + row.path + " — " + row.finding);
        actions.push("Repair source marker or file availability for " + row.path + ".");
      }
    });

    state.visualResults.forEach(function (row) {
      if (row.status === "STRONG") {
        working.push("Visual truth passed: " + row.check + ".");
      } else {
        issues.push("Visual issue: " + row.check + " — " + row.finding);
        actions.push("Repair visual-control chain: " + row.check + ".");
      }
    });

    if (!state.visualProbe || !state.visualProbe.sunVisible) {
      actions.unshift("Restore visible sun before any decorative background or compass work.");
    }

    if (!state.visualProbe || !state.visualProbe.canopyPresent) {
      actions.unshift("Load /runtime/spine_canopy_runtime.js before trusting any strong health score.");
    }

    if (!issues.length) {
      issues.push("No blocking canopy issue detected by the current scan.");
    }

    if (!actions.length) {
      actions.push("Continue controlled refinement under canopy supervision.");
    }

    state.working = working.length ? working : ["No confirmed working items measured yet."];
    state.issues = Array.from(new Set(issues));
    state.actions = Array.from(new Set(actions));
  }

  function renderList(selector, items, ordered) {
    var tag = ordered ? "ol" : "ul";
    var html = "<" + tag + ">";

    items.forEach(function (item) {
      html += "<li>" + escapeHtml(item) + "</li>";
    });

    html += "</" + tag + ">";
    setHtml(selector, html);
  }

  function renderLedger(selector, rows, firstColumn) {
    var html = "";

    html += '<table class="health-ledger">';
    html += "<thead><tr>";
    html += "<th>" + escapeHtml(firstColumn) + "</th>";
    html += "<th>Status</th>";
    html += "<th>Score</th>";
    html += "<th>Finding</th>";
    html += "</tr></thead><tbody>";

    rows.forEach(function (row) {
      html += "<tr>";
      html += "<td>" + escapeHtml(row.path || row.check || row.label) + "</td>";
      html += "<td>" + statusHtml(row.status) + "</td>";
      html += "<td>" + escapeHtml(row.score) + "/100</td>";
      html += "<td>" + escapeHtml(row.finding) + "</td>";
      html += "</tr>";
    });

    html += "</tbody></table>";
    setHtml(selector, html);
  }

  function render() {
    var statusText = state.status === "idle" ? "PENDING" : state.status;

    document.documentElement.setAttribute("data-gauges-canopy-aware", "true");

    setText("[data-health-runtime-status]", statusText);
    setText("[data-health-updated]", state.finishedAt ? getTimeText() : "scanning");
    setText("[data-health-version]", VERSION);
    setText("[data-health-overall]", state.finishedAt ? state.scores.overall + "%" : "--%");
    setText("[data-source-score]", state.finishedAt ? String(state.scores.source) : "--");
    setText("[data-visual-score]", state.finishedAt ? String(state.scores.visual) : "--");
    setText("[data-drift-score]", state.finishedAt ? String(state.scores.driftRisk) : "--");

    renderList("[data-working-list]", state.working, false);
    renderList("[data-issues-list]", state.issues, false);
    renderList("[data-actions-list]", state.actions, true);
    renderLedger("[data-source-ledger]", state.sourceResults, "Source");
    renderLedger("[data-visual-ledger]", state.visualResults, "Visual check");

    if (window.DGBSpineCanopy && typeof window.DGBSpineCanopy.registerVisual === "function") {
      window.DGBSpineCanopy.registerVisual("gauges", {
        runtime: RUNTIME_NAME,
        version: VERSION,
        status: state.status,
        overall: state.scores.overall,
        falseHealthBlocked: true
      });
    }
  }

  function runScan() {
    state.status = "SCANNING";
    state.startedAt = new Date().toISOString();
    state.finishedAt = "";
    state.working = ["Canopy-aware scan is running."];
    state.issues = ["Scan not complete yet."];
    state.actions = ["Wait for source and visual-control probe to complete."];
    render();

    return scanSources()
      .then(function () {
        return probeRootVisualTruth();
      })
      .then(function (probe) {
        buildVisualLedger(probe);
        computeScores();
        buildWorkingIssuesActions();
        state.finishedAt = new Date().toISOString();
        render();
        return getPublicState();
      })
      .catch(function (error) {
        state.visualProbe = {
          ok: false,
          error: error && error.message ? error.message : "unknown scan failure",
          falseHealthBlocked: true
        };
        buildVisualLedger(state.visualProbe);
        computeScores();
        buildWorkingIssuesActions();
        state.status = "FAIL";
        state.finishedAt = new Date().toISOString();
        render();
        return getPublicState();
      });
  }

  function getPublicState() {
    return JSON.parse(JSON.stringify({
      runtime: RUNTIME_NAME,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      rootContract: ROOT_CONTRACT,
      status: state.status,
      startedAt: state.startedAt,
      finishedAt: state.finishedAt,
      scores: state.scores,
      sourceResults: state.sourceResults,
      visualResults: state.visualResults,
      visualProbe: state.visualProbe,
      working: state.working,
      issues: state.issues,
      actions: state.actions,
      falseHealthBlocked: true
    }));
  }

  window[RUNTIME_NAME] = Object.freeze({
    name: RUNTIME_NAME,
    version: VERSION,
    rootBootId: ROOT_BOOT_ID,
    runScan: runScan,
    getPublicState: getPublicState,
    probeRootVisualTruth: probeRootVisualTruth,
    falseHealthBlocked: true
  });

  function boot() {
    if (window.DGBSpineCanopy && typeof window.DGBSpineCanopy.registerSource === "function") {
      window.DGBSpineCanopy.registerSource("gaugesHealthRuntime", {
        path: "/gauges/gauges_health_runtime.js",
        version: VERSION,
        role: "canopy-aware-health-scan"
      });
    }

    runScan();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
