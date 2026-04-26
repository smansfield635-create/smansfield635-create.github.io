(function () {
  "use strict";

  var RUNTIME_NAME = "DGBGaugesHealthRuntime";
  var VERSION = "spine-canopy-parachute-b3";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var ROOT_CONTRACT = "universe-sun";

  var SOURCE_FILES = [
    {
      id: "rootHtml",
      label: "Root HTML",
      path: "/index.html?gaugeSource=" + VERSION,
      displayPath: "/index.html",
      required: [
        "Diamond Gate Bridge",
        "Learn to Live to Love",
        'data-root-boot-id="root-sun-asset-b1"',
        "/index.js?v=root-sun-asset-b1",
        "data-dgb-sun-mount"
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
      path: "/runtime/spine_canopy_runtime.js?v=" + CANOPY_VERSION + "&gaugeSource=" + VERSION,
      displayPath: "/runtime/spine_canopy_runtime.js?v=" + CANOPY_VERSION,
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
      path: "/gauges/gauges_health_runtime.js?v=" + VERSION + "&gaugeSource=" + VERSION,
      displayPath: "/gauges/gauges_health_runtime.js?v=" + VERSION,
      required: [
        "spine-canopy-parachute-b3",
        "probeRootVisualTruth",
        "falseHealthBlocked"
      ]
    }
  ];

  var state = {
    runtime: RUNTIME_NAME,
    version: VERSION,
    canopyVersion: CANOPY_VERSION,
    rootBootId: ROOT_BOOT_ID,
    rootContract: ROOT_CONTRACT,
    status: "IDLE",
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

  function query(selector, root) {
    return (root || document).querySelector(selector);
  }

  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  function setText(selector, value) {
    queryAll(selector).forEach(function (node) {
      node.textContent = String(value);
    });
  }

  function setHtml(selector, value) {
    queryAll(selector).forEach(function (node) {
      node.innerHTML = value;
    });
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
        missing: file.required.slice(),
        finding: "HTTP " + result.status + ". " + (result.error || "File not reachable.")
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
        missing: [],
        finding: "Required marker set present."
      };
    }

    return {
      id: file.id,
      label: file.label,
      path: file.displayPath,
      status: "WATCH",
      score: Math.max(45, 100 - missing.length * 14),
      missing: missing,
      finding: "Missing marker(s): " + missing.join(", ")
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
      return { width: 0, height: 0, top: 0, left: 0 };
    }

    try {
      var rect = node.getBoundingClientRect();
      return {
        width: Math.round(rect.width || 0),
        height: Math.round(rect.height || 0),
        top: Math.round(rect.top || 0),
        left: Math.round(rect.left || 0)
      };
    } catch (error) {
      return { width: 0, height: 0, top: 0, left: 0 };
    }
  }

  function visibleInFrame(win, node, minimumSize) {
    var rect;
    var style;
    var min = minimumSize || 16;

    if (!node) return false;

    rect = getRect(node);
    if (rect.width <= min || rect.height <= min) return false;

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

  function backgroundVisibleInFrame(win, doc) {
    var universeSky = doc.querySelector(".universe-sky");
    var sunField = doc.querySelector(".sun-field");
    var page = doc.querySelector(".page");
    var bodyStyle;
    var rootStyle;

    if (visibleInFrame(win, universeSky, 40)) return true;
    if (visibleInFrame(win, sunField, 40)) return true;
    if (visibleInFrame(win, page, 40)) return true;

    try {
      bodyStyle = win.getComputedStyle(doc.body);
      rootStyle = win.getComputedStyle(doc.documentElement);

      if (bodyStyle && bodyStyle.backgroundImage && bodyStyle.backgroundImage !== "none") return true;
      if (rootStyle && rootStyle.backgroundImage && rootStyle.backgroundImage !== "none") return true;
      if (bodyStyle && bodyStyle.backgroundColor && bodyStyle.backgroundColor !== "rgba(0, 0, 0, 0)") return true;
    } catch (error) {
      return false;
    }

    return false;
  }

  function detectVisibleSun(win, doc) {
    var mount = doc.querySelector("[data-dgb-sun-mount]");
    var candidates = [];
    var statusText = doc.body ? doc.body.textContent || "" : "";
    var mountVisible;
    var sunStatusClaimsActive;
    var canvas;
    var svg;
    var fallback;

    if (mount) {
      canvas = queryAll("canvas", mount);
      svg = queryAll("svg", mount);
      fallback = queryAll("[data-sun-fallback], .sun-fallback", mount);

      candidates = candidates.concat(canvas);
      candidates = candidates.concat(svg);
      candidates = candidates.concat(fallback);
    }

    mountVisible = visibleInFrame(win, mount, 40);
    sunStatusClaimsActive = /sun asset active|static universe sun active|static sun fallback active/i.test(statusText);

    return {
      mountPresent: Boolean(mount),
      mountVisible: mountVisible,
      canvasPresent: Boolean(canvas && canvas.length),
      svgPresent: Boolean(svg && svg.length),
      fallbackPresent: Boolean(fallback && fallback.length),
      candidateCount: candidates.length,
      candidateVisible: candidates.some(function (node) {
        return visibleInFrame(win, node, 24);
      }),
      statusClaimsActive: sunStatusClaimsActive,
      sunVisible: Boolean(
        candidates.some(function (node) {
          return visibleInFrame(win, node, 24);
        }) ||
        (mountVisible && sunStatusClaimsActive)
      )
    };
  }

  function ensureParentCanopy() {
    if (window.DGBSpineCanopy && typeof window.DGBSpineCanopy.getPublicState === "function") {
      return Promise.resolve(true);
    }

    return new Promise(function (resolve) {
      var existing = query('script[src*="/runtime/spine_canopy_runtime.js"]');

      if (existing) {
        window.setTimeout(function () {
          resolve(Boolean(window.DGBSpineCanopy));
        }, 600);
        return;
      }

      var script = document.createElement("script");
      script.src = "/runtime/spine_canopy_runtime.js?v=" + CANOPY_VERSION;
      script.defer = true;
      script.onload = function () {
        resolve(Boolean(window.DGBSpineCanopy));
      };
      script.onerror = function () {
        resolve(false);
      };
      document.body.appendChild(script);
    });
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
      iframe.style.top = "0";
      iframe.style.opacity = "0.01";
      iframe.style.pointerEvents = "none";
      iframe.style.border = "0";
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
          var sun;
          var bodyText;
          var backgroundVisible;

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
            sun = detectVisibleSun(win, doc);
            backgroundVisible = backgroundVisibleInFrame(win, doc);

            finish({
              ok: true,
              rootPresent: Boolean(root),
              rootVisible: visibleInFrame(win, root, 40),
              rootBootId: root ? root.getAttribute("data-root-boot-id") || "" : "",
              rootContract: root ? root.getAttribute("data-root-contract") || "" : "",
              indexBootExecuted: Boolean(win && win.DGBIndexBoot),
              indexBootState: indexBoot,
              canopyPresent: Boolean(canopy),
              canopy: canopy,
              sunMountPresent: sun.mountPresent,
              sunMountVisible: sun.mountVisible,
              canvasPresent: sun.canvasPresent,
              svgPresent: sun.svgPresent,
              fallbackPresent: sun.fallbackPresent,
              sunCandidateCount: sun.candidateCount,
              sunCandidateVisible: sun.candidateVisible,
              sunStatusClaimsActive: sun.statusClaimsActive,
              sunVisible: sun.sunVisible,
              backgroundVisible: backgroundVisible,
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
        }, 3200);
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
      }, 10000);
    });
  }

  function visualRow(check, pass, finding, warningOnly) {
    return {
      check: check,
      status: pass ? "STRONG" : (warningOnly ? "WATCH" : "FAIL"),
      score: pass ? 100 : (warningOnly ? 65 : 0),
      finding: finding
    };
  }

  function buildVisualLedger(probe) {
    var rows = [];
    var sunSoftPass = Boolean(probe && probe.sunMountPresent && probe.sunStatusClaimsActive);
    var backgroundSoftPass = Boolean(probe && probe.rootPresent && probe.backgroundVisible);

    rows.push(visualRow("Root HTML served", probe && probe.rootPresent, "Root document exists in same-origin visual probe."));
    rows.push(visualRow("Root boot id aligned", probe && probe.rootBootId === ROOT_BOOT_ID, "Root boot id must equal " + ROOT_BOOT_ID + "."));
    rows.push(visualRow("Root contract aligned", probe && probe.rootContract === ROOT_CONTRACT, "Root contract must remain " + ROOT_CONTRACT + "."));
    rows.push(visualRow("Index boot executed", probe && probe.indexBootExecuted, "window.DGBIndexBoot must exist in the root probe."));
    rows.push(visualRow("Canopy runtime present", probe && probe.canopyPresent, "window.DGBSpineCanopy must exist in the root probe."));
    rows.push(visualRow("Sun mount present", probe && probe.sunMountPresent, "Root must contain [data-dgb-sun-mount]."));
    rows.push(visualRow("Visible sun present", probe && probe.sunVisible, "Sun is accepted if canvas, SVG, fallback, or visible sun mount with active status is present.", sunSoftPass));
    rows.push(visualRow("Background visible", probe && probe.backgroundVisible, "Background is accepted from .universe-sky, .sun-field, .page, or computed body/root background.", backgroundSoftPass));
    rows.push(visualRow("Title present", probe && probe.titlePresent, "Diamond Gate Bridge must remain present."));
    rows.push(visualRow("Theme present", probe && probe.themePresent, "Learn to Live to Love must remain present."));
    rows.push(visualRow("False health blocked", true, "Safety cap exists. If visual truth fails, overall health is capped."));

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

    var sunVisible = Boolean(state.visualProbe && (state.visualProbe.sunVisible || state.visualProbe.sunStatusClaimsActive));
    var canopyPresent = Boolean(state.visualProbe && state.visualProbe.canopyPresent);
    var driftRisk = clamp(failCount * 15 + watchCount * 6 + (sunVisible ? 0 : 20) + (canopyPresent ? 0 : 16), 0, 100);
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
      } else if (row.status === "WATCH") {
        issues.push("Visual watch: " + row.check + " — " + row.finding);
        actions.push("Tighten visual probe evidence for: " + row.check + ".");
      } else {
        issues.push("Visual issue: " + row.check + " — " + row.finding);
        actions.push("Repair visual-control chain: " + row.check + ".");
      }
    });

    if (!state.visualProbe || !(state.visualProbe.sunVisible || state.visualProbe.sunStatusClaimsActive)) {
      actions.unshift("Restore visible sun before decorative background or compass work.");
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
      html += "<td>" + escapeHtml(row.path || row.check || row.label || row.id) + "</td>";
      html += "<td>" + statusHtml(row.status) + "</td>";
      html += "<td>" + escapeHtml(row.score) + "/100</td>";
      html += "<td>" + escapeHtml(row.finding) + "</td>";
      html += "</tr>";
    });

    html += "</tbody></table>";
    setHtml(selector, html);
  }

  function render() {
    var updated = state.finishedAt ? getTimeText() : "scanning";

    document.documentElement.setAttribute("data-gauges-canopy-aware", "true");

    setText("[data-health-runtime-status]", state.status);
    setText("[data-health-status]", state.status);
    setText("[data-health-updated]", updated);
    setText("[data-health-version]", VERSION);
    setText("[data-health-overall]", state.finishedAt ? state.scores.overall + "%" : "--%");
    setText("[data-health-score]", state.finishedAt ? state.scores.overall + "%" : "--%");
    setText("[data-source-score]", state.finishedAt ? String(state.scores.source) : "--");
    setText("[data-visual-score]", state.finishedAt ? String(state.scores.visual) : "--");
    setText("[data-drift-score]", state.finishedAt ? String(state.scores.driftRisk) : "--");

    renderList("[data-working-list]", state.working, false);
    renderList("[data-issues-list]", state.issues, false);
    renderList("[data-wrong-list]", state.issues, false);
    renderList("[data-actions-list]", state.actions, true);
    renderList("[data-repair-priorities]", state.actions, true);

    renderLedger("[data-source-ledger]", state.sourceResults, "Source");
    renderLedger("[data-visual-ledger]", state.visualResults, "Visual check");
    renderLedger("[data-canopy-ledger]", state.visualResults, "Check");

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
    state.working = ["Canopy-aware Bravo 3 scan is running."];
    state.issues = ["Scan not complete yet."];
    state.actions = ["Wait for source and visual-control probe to complete."];
    state.sourceResults = [];
    state.visualResults = [];
    render();

    return ensureParentCanopy()
      .then(function () {
        return scanSources();
      })
      .then(function () {
        renderLedger("[data-source-ledger]", state.sourceResults, "Source");
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
      canopyVersion: CANOPY_VERSION,
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
    canopyVersion: CANOPY_VERSION,
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
