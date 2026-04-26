(function () {
  "use strict";

  var VERSION = "spine-canopy-parachute-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var RUNTIME_NAME = "DGBGaugesHealthRuntime";

  var FILES = [
    {
      id: "rootHtml",
      label: "Root HTML",
      path: "/index.html",
      required: [
        'data-root-boot-id="root-sun-asset-b1"',
        "/runtime/spine_canopy_runtime.js?v=spine-canopy-parachute-b1",
        "/index.js?v=root-sun-asset-b1",
        "data-sun-fallback"
      ]
    },
    {
      id: "indexBoot",
      label: "Index boot",
      path: "/index.js?v=root-sun-asset-b1",
      required: [
        'ROOT_BOOT_ID = "root-sun-asset-b1"',
        "DGBSpineCanopy",
        "ensureFallbackSun",
        "held-by-canopy"
      ]
    },
    {
      id: "canopyRuntime",
      label: "Spine canopy runtime",
      path: "/runtime/spine_canopy_runtime.js?v=spine-canopy-parachute-b1",
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
      path: "/runtime/sun_asset_runtime.js?v=root-sun-asset-b1",
      required: [
        "DGBSunAssetRuntime",
        "universe-scale-field-b7",
        "satellite-solar-disc-b6",
        "DGBSpineCanopy"
      ]
    },
    {
      id: "sunManifest",
      label: "Sun manifest",
      path: "/assets/sun/sun_manifest.json?v=root-sun-asset-b1",
      required: [
        "DGB_SUN_ASSET_SPINE_v2_CANOPY_BOUND",
        "root-sun-asset-b1",
        "spine-canopy-parachute-b1",
        "satellite-solar-disc-b6"
      ]
    },
    {
      id: "gaugesRuntime",
      label: "Gauges health runtime",
      path: "/gauges/gauges_health_runtime.js?v=spine-canopy-parachute-b1",
      required: [
        "spine-canopy-parachute-b1",
        "probeRootVisualTruth",
        "falseHealthBlocked"
      ]
    }
  ];

  var state = {
    startedAt: null,
    updatedAt: null,
    sourceResults: [],
    canopyResults: [],
    visualProbe: null,
    priorities: [],
    scores: {
      source: 0,
      visual: 0,
      drift: 100,
      overall: 0
    },
    falseHealthBlocked: true,
    status: "PENDING",
    version: VERSION,
    rootBootId: ROOT_BOOT_ID
  };

  function by(selector) {
    return document.querySelector(selector);
  }

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setText(selector, value) {
    var node = by(selector);
    if (node) node.textContent = value;
  }

  function setHtml(selector, value) {
    var node = by(selector);
    if (node) node.innerHTML = value;
  }

  function round(value) {
    return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
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

  function statusClass(status) {
    if (status === "STRONG") return "strong";
    if (status === "FAIL") return "fail";
    return "watch";
  }

  function statusHtml(status) {
    return '<span class="status ' + statusClass(status) + '">' + escapeHtml(status) + "</span>";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getClockText() {
    var date = new Date();
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function fetchText(path) {
    return fetch(path, {
      cache: "no-store",
      credentials: "same-origin"
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
    });
  }

  function scoreFile(file, result) {
    var missing;

    if (!result.ok) {
      return {
        id: file.id,
        label: file.label,
        path: file.path,
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
        path: file.path,
        status: "STRONG",
        score: 100,
        missing: [],
        finding: "Required canopy markers present."
      };
    }

    return {
      id: file.id,
      label: file.label,
      path: file.path,
      status: "WATCH",
      score: Math.max(40, 100 - missing.length * 18),
      missing: missing,
      finding: "Missing marker(s): " + missing.join(", ")
    };
  }

  function scanSources() {
    return Promise.all(FILES.map(function (file) {
      return fetchText(file.path).then(function (result) {
        return scoreFile(file, result);
      });
    })).then(function (results) {
      state.sourceResults = results;
      return results;
    });
  }

  function probeRootVisualTruth() {
    return new Promise(function (resolve) {
      var iframe = document.createElement("iframe");
      var settled = false;

      iframe.setAttribute("title", "Root visual truth probe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "fixed";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
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
          var fallbackRect;
          var canvasRect;
          var svgRect;
          var backgroundRect;

          try {
            win = iframe.contentWindow;
            doc = iframe.contentDocument || (win && win.document);

            canopy = win && win.DGBSpineCanopy && typeof win.DGBSpineCanopy.getPublicState === "function"
              ? win.DGBSpineCanopy.getPublicState()
              : null;

            indexBoot = win && win.DGBIndexBoot && typeof win.DGBIndexBoot.getState === "function"
              ? win.DGBIndexBoot.getState()
              : null;

            root = doc && (doc.getElementById("door-root") || doc.querySelector("[data-universe-sun]"));
            sunMount = doc && doc.querySelector("[data-dgb-sun-mount]");
            sunFallback = sunMount && sunMount.querySelector("[data-sun-fallback]");
            sunCanvas = sunMount && sunMount.querySelector("canvas");
            sunSvg = sunMount && sunMount.querySelector("svg");
            background = doc && doc.querySelector(".universe-sky");

            fallbackRect = sunFallback && typeof sunFallback.getBoundingClientRect === "function"
              ? sunFallback.getBoundingClientRect()
              : null;

            canvasRect = sunCanvas && typeof sunCanvas.getBoundingClientRect === "function"
              ? sunCanvas.getBoundingClientRect()
              : null;

            svgRect = sunSvg && typeof sunSvg.getBoundingClientRect === "function"
              ? sunSvg.getBoundingClientRect()
              : null;

            backgroundRect = background && typeof background.getBoundingClientRect === "function"
              ? background.getBoundingClientRect()
              : null;

            finish({
              ok: true,
              rootPresent: Boolean(root),
              indexBootExecuted: Boolean(win && win.DGBIndexBoot),
              indexBootState: indexBoot,
              canopyPresent: Boolean(canopy),
              canopy: canopy,
              sunMountPresent: Boolean(sunMount),
              fallbackSunPresent: Boolean(sunFallback),
              fallbackSunVisible: Boolean(fallbackRect && fallbackRect.width > 24 && fallbackRect.height > 24),
              canvasSunPresent: Boolean(sunCanvas),
              canvasSunVisible: Boolean(canvasRect && canvasRect.width > 24 && canvasRect.height > 24),
              svgSunPresent: Boolean(sunSvg),
              svgSunVisible: Boolean(svgRect && svgRect.width > 24 && svgRect.height > 24),
              sunVisible: Boolean(
                (fallbackRect && fallbackRect.width > 24 && fallbackRect.height > 24) ||
                (canvasRect && canvasRect.width > 24 && canvasRect.height > 24) ||
                (svgRect && svgRect.width > 24 && svgRect.height > 24)
              ),
              backgroundPresent: Boolean(background),
              backgroundVisible: Boolean(backgroundRect && backgroundRect.width > 100 && backgroundRect.height > 100),
              titlePresent: Boolean(doc && /Diamond Gate Bridge/i.test(doc.body ? doc.body.textContent : "")),
              themePresent: Boolean(doc && /Learn to Live to Love/i.test(doc.body ? doc.body.textContent : "")),
              rootBootId: root ? root.getAttribute("data-root-boot-id") : "",
              rootContract: root ? root.getAttribute("data-root-contract") : ""
            });
          } catch (error) {
            finish({
              ok: false,
              error: error && error.message ? error.message : "iframe probe failed"
            });
          }
        }, 2400);
      };

      iframe.onerror = function () {
        finish({
          ok: false,
          error: "root iframe failed to load"
        });
      };

      document.body.appendChild(iframe);

      window.setTimeout(function () {
        finish({
          ok: false,
          error: "root visual probe timed out"
        });
      }, 7000);
    });
  }

  function buildCanopyLedger(probe) {
    var rows = [];

    function push(check, pass, finding, warningOnly) {
      var status = pass ? "STRONG" : (warningOnly ? "WATCH" : "FAIL");
      rows.push({
        check: check,
        status: status,
        score: pass ? 100 : (warningOnly ? 60 : 0),
        finding: finding
      });
    }

    push("Root HTML served", probe && probe.rootPresent, "Root document exists in same-origin visual probe.");
    push("Root boot id aligned", probe && probe.rootBootId === ROOT_BOOT_ID, "Root boot id must equal " + ROOT_BOOT_ID + ".");
    push("Root contract aligned", probe && probe.rootContract === "universe-sun", "Root contract must remain universe-sun.");
    push("Index boot executed", probe && probe.indexBootExecuted, "window.DGBIndexBoot is present in root page.");
    push("Canopy runtime present", probe && probe.canopyPresent, "window.DGBSpineCanopy is present in root page.");
    push("Sun mount present", probe && probe.sunMountPresent, "Root contains [data-dgb-sun-mount].");
    push("Visible sun present", probe && probe.sunVisible, "Canvas sun, SVG sun, or fallback sun is visibly present.");
    push("Background visible", probe && probe.backgroundVisible, "Universe background exists without owning the sun.");
    push("Title present", probe && probe.titlePresent, "Diamond Gate Bridge remains visible or present in root body.");
    push("Theme present", probe && probe.themePresent, "Learn to Live to Love remains visible or present in root body.");
    push("False health blocked", probe && probe.sunVisible, "Full health is forbidden when visible sun is false.");

    state.canopyResults = rows;
    return rows;
  }

  function computeScores() {
    var sourceScore = average(state.sourceResults.map(function (result) {
      return result.score;
    }));

    var visualScore = average(state.canopyResults.map(function (result) {
      return result.score;
    }));

    var failCount = state.sourceResults.concat(state.canopyResults).filter(function (result) {
      return result.status === "FAIL";
    }).length;

    var watchCount = state.sourceResults.concat(state.canopyResults).filter(function (result) {
      return result.status === "WATCH";
    }).length;

    var sunVisible = Boolean(state.visualProbe && state.visualProbe.sunVisible);
    var canopyPresent = Boolean(state.visualProbe && state.visualProbe.canopyPresent);
    var driftRisk = round(Math.min(100, failCount * 18 + watchCount * 7 + (sunVisible ? 0 : 24) + (canopyPresent ? 0 : 18)));
    var overall = round(sourceScore * 0.42 + visualScore * 0.48 + (100 - driftRisk) * 0.10);

    if (!sunVisible) {
      overall = Math.min(overall, 78);
      state.falseHealthBlocked = true;
    }

    if (!canopyPresent) {
      overall = Math.min(overall, 84);
      state.falseHealthBlocked = true;
    }

    state.scores = {
      source: sourceScore,
      visual: visualScore,
      drift: driftRisk,
      overall: overall
    };

    if (overall >= 94 && sunVisible && canopyPresent) {
      state.status = "STRONG";
    } else if (overall >= 78) {
      state.status = "WATCH";
    } else {
      state.status = "FAIL";
    }

    return state.scores;
  }

  function buildPriorities() {
    var priorities = [];

    function add(priority, text) {
      priorities.push({
        priority: priority,
        text: text
      });
    }

    if (!state.visualProbe || !state.visualProbe.canopyPresent) {
      add(1, "Create or repair /runtime/spine_canopy_runtime.js so root visual truth can be supervised above the spine.");
    }

    if (!state.visualProbe || !state.visualProbe.sunVisible) {
      add(2, "Restore visible sun protection. The gauges must not report strong health while the visible sun is absent.");
    }

    if (!state.visualProbe || !state.visualProbe.indexBootExecuted) {
      add(3, "Repair /index.js?v=root-sun-asset-b1 so the root boot executes and reports state.");
    }

    state.sourceResults.forEach(function (result) {
      if (result.status === "FAIL") {
        add(4, "Fix unreachable file: " + result.path + ".");
      } else if (result.status === "WATCH") {
        add(5, "Repair marker drift in " + result.path + ": " + result.finding);
      }
    });

    if (!priorities.length) {
      add(1, "No blocking canopy issue detected. Continue controlled visual refinement only under canopy supervision.");
    }

    priorities.sort(function (a, b) {
      return a.priority - b.priority;
    });

    state.priorities = priorities;
    return priorities;
  }

  function renderScoreCards() {
    setText("[data-health-score]", String(state.scores.overall) + "%");
    setText("[data-source-score]", String(state.scores.source));
    setText("[data-visual-score]", String(state.scores.visual));
    setText("[data-drift-score]", String(state.scores.drift));
    setText("[data-health-status]", state.status);
    setText("[data-health-updated]", getClockText());
    setText("[data-health-version]", VERSION);

    all("[data-health-status-class]").forEach(function (node) {
      node.classList.remove("strong", "watch", "fail");
      node.classList.add(statusClass(state.status));
    });
  }

  function renderSourceLedger() {
    var html = "";

    html += '<table class="health-ledger">';
    html += "<thead><tr>";
    html += "<th>File</th>";
    html += "<th>Path</th>";
    html += "<th>Status</th>";
    html += "<th>Score</th>";
    html += "<th>Finding</th>";
    html += "</tr></thead><tbody>";

    state.sourceResults.forEach(function (row) {
      html += "<tr>";
      html += "<td>" + escapeHtml(row.label) + "</td>";
      html += "<td><code>" + escapeHtml(row.path) + "</code></td>";
      html += "<td>" + statusHtml(row.status) + "</td>";
      html += "<td>" + escapeHtml(row.score) + "/100</td>";
      html += "<td>" + escapeHtml(row.finding) + "</td>";
      html += "</tr>";
    });

    html += "</tbody></table>";

    setHtml("[data-source-ledger]", html);
  }

  function renderCanopyLedger() {
    var html = "";

    html += '<table class="health-ledger">';
    html += "<thead><tr>";
    html += "<th>Check</th>";
    html += "<th>Status</th>";
    html += "<th>Finding</th>";
    html += "</tr></thead><tbody>";

    state.canopyResults.forEach(function (row) {
      html += "<tr>";
      html += "<td>" + escapeHtml(row.check) + "</td>";
      html += "<td>" + statusHtml(row.status) + "</td>";
      html += "<td>" + escapeHtml(row.finding) + "</td>";
      html += "</tr>";
    });

    html += "</tbody></table>";

    setHtml("[data-canopy-ledger]", html);
  }

  function renderPriorities() {
    var html = "";

    html += "<ol>";
    state.priorities.forEach(function (item) {
      html += "<li>" + escapeHtml(item.text) + "</li>";
    });
    html += "</ol>";

    setHtml("[data-repair-priorities]", html);
  }

  function renderWorkingWrong() {
    var working = [];
    var wrong = [];

    state.sourceResults.forEach(function (result) {
      if (result.status === "STRONG") {
        working.push("Source strong: " + result.path + ".");
      } else {
        wrong.push("Source issue: " + result.path + " — " + result.finding);
      }
    });

    state.canopyResults.forEach(function (result) {
      if (result.status === "STRONG") {
        working.push("Canopy check passed: " + result.check + ".");
      } else {
        wrong.push("Canopy issue: " + result.check + " — " + result.finding);
      }
    });

    setHtml("[data-working-list]", "<ul>" + working.map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("") + "</ul>");

    setHtml("[data-wrong-list]", "<ul>" + wrong.map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("") + "</ul>");
  }

  function renderFallbackPanel() {
    var host = by("[data-canopy-health-runtime]");
    var html;

    if (!host) {
      host = document.createElement("section");
      host.setAttribute("data-canopy-health-runtime", "");
      host.style.margin = "24px 0";
      document.body.appendChild(host);
    }

    if (host.getAttribute("data-rendered-by-runtime") === "true") return;

    html =
      '<section class="runtime-health-panel">' +
      '<h2>Canopy visual-control health</h2>' +
      '<p>Version: <code data-health-version>' + escapeHtml(VERSION) + "</code></p>" +
      '<div class="runtime-health-grid">' +
      '<article><strong>Website health</strong><span data-health-score>Pending</span></article>' +
      '<article><strong>Source</strong><span data-source-score>Pending</span></article>' +
      '<article><strong>Visual truth</strong><span data-visual-score>Pending</span></article>' +
      '<article><strong>Drift risk</strong><span data-drift-score>Pending</span></article>' +
      "</div>" +
      '<p>Status: <strong data-health-status>Pending</strong> · Updated: <span data-health-updated>Pending</span></p>' +
      "<h3>What is working</h3>" +
      '<div data-working-list><p>Pending.</p></div>' +
      "<h3>What is wrong</h3>" +
      '<div data-wrong-list><p>Pending.</p></div>' +
      "<h3>What needs to be done</h3>" +
      '<div data-repair-priorities><p>Pending.</p></div>' +
      "<h3>Source ledger</h3>" +
      '<div data-source-ledger><p>Pending.</p></div>' +
      "<h3>Canopy visual ledger</h3>" +
      '<div data-canopy-ledger><p>Pending.</p></div>' +
      "</section>";

    if (!by("[data-health-score]")) {
      host.innerHTML = html;
      host.setAttribute("data-rendered-by-runtime", "true");
    }
  }

  function injectMinimalStyles() {
    if (by("style[data-gauges-health-runtime-style]")) return;

    var style = document.createElement("style");
    style.setAttribute("data-gauges-health-runtime-style", VERSION);
    style.textContent =
      ".runtime-health-panel{border:1px solid rgba(255,248,231,.16);border-radius:24px;padding:18px;background:rgba(2,6,16,.58);color:inherit}" +
      ".runtime-health-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:16px 0}" +
      ".runtime-health-grid article{border:1px solid rgba(255,248,231,.14);border-radius:18px;padding:14px;background:rgba(255,255,255,.035)}" +
      ".runtime-health-grid strong{display:block;color:rgba(255,248,231,.64);font-size:.78rem;text-transform:uppercase;letter-spacing:.08em}" +
      ".runtime-health-grid span{display:block;margin-top:6px;font-size:1.8rem;font-weight:900}" +
      ".health-ledger{width:100%;border-collapse:collapse;margin:12px 0 20px;font-size:.86rem}" +
      ".health-ledger th,.health-ledger td{border-bottom:1px solid rgba(255,248,231,.13);padding:10px;text-align:left;vertical-align:top}" +
      ".health-ledger code{font-size:.82rem;white-space:normal;word-break:break-word}" +
      ".status{display:inline-flex;border-radius:999px;padding:4px 8px;font-weight:900;font-size:.72rem;letter-spacing:.06em}" +
      ".status.strong{background:rgba(76,211,137,.14);color:#80f0b6}" +
      ".status.watch{background:rgba(255,203,92,.14);color:#ffe19a}" +
      ".status.fail{background:rgba(255,91,91,.14);color:#ff9a9a}" +
      "@media(max-width:760px){.runtime-health-grid{grid-template-columns:1fr 1fr}.health-ledger{font-size:.78rem}}" +
      "@media(max-width:480px){.runtime-health-grid{grid-template-columns:1fr}}";

    document.head.appendChild(style);
  }

  function render() {
    renderFallbackPanel();
    injectMinimalStyles();
    renderScoreCards();
    renderSourceLedger();
    renderCanopyLedger();
    renderPriorities();
    renderWorkingWrong();
  }

  function runScan() {
    state.startedAt = new Date().toISOString();
    state.status = "PENDING";

    setText("[data-health-status]", "Scanning");
    setText("[data-health-updated]", "Scanning");

    return scanSources()
      .then(function () {
        return probeRootVisualTruth();
      })
      .then(function (probe) {
        buildCanopyLedger(probe);
        computeScores();
        buildPriorities();
        state.updatedAt = new Date().toISOString();
        render();
        return getPublicState();
      })
      .catch(function (error) {
        state.status = "FAIL";
        state.visualProbe = {
          ok: false,
          error: error && error.message ? error.message : "unknown scan failure"
        };
        buildCanopyLedger(state.visualProbe);
        computeScores();
        buildPriorities();
        state.updatedAt = new Date().toISOString();
        render();
        return getPublicState();
      });
  }

  function getPublicState() {
    return {
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      status: state.status,
      startedAt: state.startedAt,
      updatedAt: state.updatedAt,
      sourceResults: state.sourceResults.slice(),
      canopyResults: state.canopyResults.slice(),
      visualProbe: state.visualProbe,
      priorities: state.priorities.slice(),
      scores: {
        source: state.scores.source,
        visual: state.scores.visual,
        drift: state.scores.drift,
        overall: state.scores.overall
      },
      falseHealthBlocked: state.falseHealthBlocked
    };
  }

  window[RUNTIME_NAME] = Object.freeze({
    version: VERSION,
    rootBootId: ROOT_BOOT_ID,
    runScan: runScan,
    getPublicState: getPublicState,
    probeRootVisualTruth: probeRootVisualTruth,
    falseHealthBlocked: true
  });

  function boot() {
    renderFallbackPanel();
    injectMinimalStyles();
    runScan();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
