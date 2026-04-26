/* TNT RENEWAL — /gauges/gauges_health_runtime.js
   GAUGES HEALTH RUNTIME · GENERATION 2 COMPASS COCKPIT · BRAVO 6
   VERSION = "spine-canopy-parachute-b6"
   PURPOSE:
     - Calibrate cockpit visual probe to the live root viewport
     - Wait for cockpit hydration instead of failing too early
     - Accept DGBCompassCockpit OR runtime-set cockpit attributes
     - Accept visible sun by visible mount/fallback/canvas/SVG truth
     - Accept universe background by element presence OR computed background
     - Keep false-health blocking strict on cockpit + canopy + visible sun
*/

(function () {
  "use strict";

  var VERSION = "spine-canopy-parachute-b6";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var COCKPIT_VERSION = "root-compass-cockpit-b1";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";

  var FILES = [
    {
      label: "Root Compass Cockpit",
      path: "/index.html",
      required: [
        "Compass Cockpit",
        "root-compass-cockpit-b1",
        "ROOT_COMPASS_COCKPIT_GENERATION_2_SOURCE_MARKER_B1",
        "data-root-boot-id=\"root-sun-asset-b1\"",
        "data-dgb-sun-mount",
        "data-sun-fallback",
        "Learn to Live to Love",
        "/index.js"
      ]
    },
    {
      label: "Root cockpit boot",
      path: "/index.js?v=root-sun-asset-b1",
      required: [
        "ROOT_BOOT_ID = \"root-sun-asset-b1\"",
        "root-compass-cockpit-b1",
        "DGBCompassCockpit",
        "DGBIndexBoot",
        "ensureFallbackSun",
        "held-by-canopy"
      ]
    },
    {
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
      label: "Sun asset runtime",
      path: "/runtime/sun_asset_runtime.js?v=root-sun-asset-b1",
      required: [
        "DGBSunAssetRuntime",
        "root-sun-asset-b1",
        "DGBSpineCanopy"
      ]
    },
    {
      label: "Sun manifest",
      path: "/assets/sun/sun_manifest.json?v=root-sun-asset-b1",
      required: [
        "root-sun-asset-b1"
      ]
    },
    {
      label: "Gauges health runtime",
      path: "/gauges/gauges_health_runtime.js?v=spine-canopy-parachute-b6",
      required: [
        "spine-canopy-parachute-b6",
        "root-compass-cockpit-b1",
        "probeRootVisualTruth",
        "falseHealthBlocked"
      ]
    }
  ];

  var state = {
    sourceResults: [],
    visualResults: [],
    scores: {
      source: 0,
      visual: 0,
      drift: 100,
      overall: 0
    }
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function setText(selector, value) {
    var node = $(selector);
    if (node) node.textContent = value;
  }

  function clearNode(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  function statusClass(status) {
    if (status === "STRONG") return "strong";
    if (status === "FAIL") return "fail";
    return "watch";
  }

  function makeStatus(status) {
    var span = document.createElement("span");
    span.className = "status " + statusClass(status);
    span.textContent = status;
    return span;
  }

  function makeRow(labelText, status, finding) {
    var row = document.createElement("div");
    var label = document.createElement("strong");
    var detail = document.createElement("span");

    row.className = "row";
    label.textContent = labelText;
    detail.textContent = finding;

    row.appendChild(label);
    row.appendChild(makeStatus(status));
    row.appendChild(detail);

    return row;
  }

  function makeLi(text) {
    var li = document.createElement("li");
    li.textContent = text;
    return li;
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
        label: file.label,
        path: file.path,
        status: "FAIL",
        score: 0,
        finding: "HTTP " + result.status + ". " + (result.error || "File not reachable.")
      };
    }

    missing = file.required.filter(function (marker) {
      return result.text.indexOf(marker) === -1;
    });

    if (!missing.length) {
      return {
        label: file.label,
        path: file.path,
        status: "STRONG",
        score: 100,
        finding: "Required marker set present."
      };
    }

    return {
      label: file.label,
      path: file.path,
      status: missing.length > 2 ? "FAIL" : "WATCH",
      score: Math.max(40, 100 - missing.length * 14),
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

  function visibleElement(node) {
    var rect;
    var style;

    if (!node) return false;

    rect = node.getBoundingClientRect();
    style = node.ownerDocument.defaultView.getComputedStyle(node);

    return Boolean(
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || 1) > 0
    );
  }

  function meaningfulBox(node, minSize) {
    var rect;

    if (!node) return false;

    rect = node.getBoundingClientRect();
    return Boolean(rect.width >= minSize && rect.height >= minSize);
  }

  function computedBackgroundPresent(doc) {
    var bodyStyle;
    var htmlStyle;

    if (!doc || !doc.defaultView) return false;

    bodyStyle = doc.defaultView.getComputedStyle(doc.body);
    htmlStyle = doc.defaultView.getComputedStyle(doc.documentElement);

    return Boolean(
      (bodyStyle.backgroundImage && bodyStyle.backgroundImage !== "none") ||
      (htmlStyle.backgroundImage && htmlStyle.backgroundImage !== "none") ||
      (bodyStyle.backgroundColor && bodyStyle.backgroundColor !== "rgba(0, 0, 0, 0)" && bodyStyle.backgroundColor !== "transparent") ||
      (htmlStyle.backgroundColor && htmlStyle.backgroundColor !== "rgba(0, 0, 0, 0)" && htmlStyle.backgroundColor !== "transparent")
    );
  }

  function safePublicState(win, name) {
    try {
      if (win && win[name] && typeof win[name].getPublicState === "function") {
        return win[name].getPublicState();
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function probeRootVisualTruth() {
    return new Promise(function (resolve) {
      var iframe = document.createElement("iframe");
      var settled = false;
      var started = Date.now();

      iframe.setAttribute("title", "Compass cockpit visual truth probe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "fixed";
      iframe.style.width = "390px";
      iframe.style.height = "844px";
      iframe.style.left = "-2400px";
      iframe.style.top = "0";
      iframe.style.opacity = "0.01";
      iframe.style.pointerEvents = "none";
      iframe.style.border = "0";
      iframe.src = "/?cockpitGaugeProbe=bravo6-" + encodeURIComponent(String(Date.now()));

      function finish(payload) {
        if (settled) return;
        settled = true;

        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        resolve(payload);
      }

      function readProbe() {
        var win;
        var doc;
        var root;
        var indexBoot;
        var cockpit;
        var canopy;
        var mount;
        var fallback;
        var canvas;
        var svg;
        var background;
        var cockpitWindow;
        var controls;
        var bodyText;
        var rootAttrRuntime;
        var cockpitRuntimeByApi;
        var indexRuntimeByApi;
        var sunByElement;
        var sunByMount;
        var backgroundByElement;
        var backgroundByComputed;

        try {
          win = iframe.contentWindow;
          doc = iframe.contentDocument || (win && win.document);

          if (!doc || !doc.body) return null;

          root = doc.getElementById("door-root") || doc.querySelector("[data-root-door]");
          indexBoot = safePublicState(win, "DGBIndexBoot");
          cockpit = safePublicState(win, "DGBCompassCockpit");
          canopy = safePublicState(win, "DGBSpineCanopy");

          mount = doc.querySelector("[data-dgb-sun-mount]");
          fallback = mount && mount.querySelector("[data-sun-fallback]");
          canvas = mount && mount.querySelector("canvas");
          svg = mount && mount.querySelector("svg");
          background = doc.querySelector(".universe-sky");
          cockpitWindow = doc.querySelector("[data-cockpit-window]");
          controls = doc.querySelector("[data-cockpit-control-panel]");
          bodyText = doc.body.textContent || "";

          rootAttrRuntime = Boolean(root && (
            root.getAttribute("data-index-boot") === COCKPIT_VERSION ||
            root.getAttribute("data-js-renewal-marker") ||
            root.getAttribute("data-venue-bridge") ||
            root.getAttribute("data-canopy-relationship") === "held-by-canopy"
          ));

          indexRuntimeByApi = Boolean(indexBoot || (win && win.DGBIndexBoot));
          cockpitRuntimeByApi = Boolean(cockpit || (win && win.DGBCompassCockpit));

          sunByElement = Boolean(
            (fallback && visibleElement(fallback)) ||
            (canvas && visibleElement(canvas)) ||
            (svg && visibleElement(svg))
          );

          sunByMount = Boolean(mount && visibleElement(mount) && meaningfulBox(mount, 40));

          backgroundByElement = Boolean(background);
          backgroundByComputed = computedBackgroundPresent(doc);

          return {
            ok: true,
            hydratedEnough: Boolean(indexRuntimeByApi || cockpitRuntimeByApi || rootAttrRuntime),
            rootPresent: Boolean(root),
            rootBootAligned: Boolean(root && root.getAttribute("data-root-boot-id") === ROOT_BOOT_ID),
            rootContractAligned: Boolean(root && root.getAttribute("data-root-contract") === "universe-sun"),
            cockpitMarkerAligned: Boolean(root && root.getAttribute("data-compass-cockpit") === COCKPIT_VERSION),
            sourceMarkerAligned: Boolean(root && root.getAttribute("data-source-marker") === "ROOT_COMPASS_COCKPIT_GENERATION_2_SOURCE_MARKER_B1"),
            indexBootExecuted: Boolean(indexRuntimeByApi || rootAttrRuntime),
            cockpitRuntimePresent: Boolean(cockpitRuntimeByApi || rootAttrRuntime),
            canopyRuntimePresent: Boolean(canopy || (win && win.DGBSpineCanopy)),
            sunMountPresent: Boolean(mount),
            fallbackSunPresent: Boolean(fallback),
            canvasSunPresent: Boolean(canvas),
            svgSunPresent: Boolean(svg),
            visibleSunPresent: Boolean(sunByElement || sunByMount),
            backgroundVisible: Boolean(backgroundByElement || backgroundByComputed),
            cockpitWindowPresent: Boolean(cockpitWindow && visibleElement(cockpitWindow)),
            cockpitControlsPresent: Boolean(controls && visibleElement(controls)),
            titlePresent: bodyText.indexOf("Diamond Gate Bridge") !== -1,
            themePresent: bodyText.indexOf("Learn to Live to Love") !== -1,
            cockpit: cockpit,
            indexBoot: indexBoot,
            canopy: canopy
          };
        } catch (error) {
          return {
            ok: false,
            error: error && error.message ? error.message : "iframe probe read failed"
          };
        }
      }

      function poll() {
        var probe = readProbe();

        if (probe && probe.ok && probe.hydratedEnough) {
          finish(probe);
          return;
        }

        if (probe && probe.ok && Date.now() - started > 5200) {
          finish(probe);
          return;
        }

        if (probe && !probe.ok) {
          finish(probe);
          return;
        }

        if (Date.now() - started > 8000) {
          finish({
            ok: false,
            error: "root visual probe timed out"
          });
          return;
        }

        window.setTimeout(poll, 220);
      }

      iframe.onload = function () {
        window.setTimeout(poll, 500);
      };

      iframe.onerror = function () {
        finish({
          ok: false,
          error: "root iframe failed to load"
        });
      };

      document.body.appendChild(iframe);
    });
  }

  function buildVisualLedger(probe) {
    var rows = [];

    function push(check, pass, finding, warningOnly) {
      rows.push({
        check: check,
        status: pass ? "STRONG" : (warningOnly ? "WATCH" : "FAIL"),
        finding: finding
      });
    }

    if (!probe || !probe.ok) {
      rows.push({
        check: "Root visual probe",
        status: "FAIL",
        finding: probe && probe.error ? probe.error : "Visual probe did not complete."
      });
      state.visualResults = rows;
      return rows;
    }

    push("Root HTML served", probe.rootPresent, "Root document exists in calibrated same-origin visual probe.");
    push("Root boot id aligned", probe.rootBootAligned, "Root boot id must equal " + ROOT_BOOT_ID + ".");
    push("Root contract aligned", probe.rootContractAligned, "Root contract must remain universe-sun.");
    push("Cockpit marker aligned", probe.cockpitMarkerAligned, "Root must declare " + COCKPIT_VERSION + ".");
    push("Source marker aligned", probe.sourceMarkerAligned, "Root must declare cockpit source marker B1.");
    push("Index boot executed", probe.indexBootExecuted, "window.DGBIndexBoot or runtime-set root boot attributes must exist.");
    push("Cockpit runtime present", probe.cockpitRuntimePresent, "window.DGBCompassCockpit or runtime-set cockpit attributes must exist.");
    push("Canopy runtime present", probe.canopyRuntimePresent, "window.DGBSpineCanopy must exist.");
    push("Sun mount present", probe.sunMountPresent, "Root must contain [data-dgb-sun-mount].");
    push("Visible sun present", probe.visibleSunPresent, "Canvas, SVG, fallback, or visible mounted sun body must be measurable.");
    push("Background visible", probe.backgroundVisible, "Universe background must exist or computed page background must be non-empty.");
    push("Cockpit window present", probe.cockpitWindowPresent, "Cockpit viewport must be visible.");
    push("Cockpit controls present", probe.cockpitControlsPresent, "Cockpit control panel must be visible.");
    push("Title present", probe.titlePresent, "Diamond Gate Bridge must remain present.");
    push("Theme present", probe.themePresent, "Learn to Live to Love must remain present.");

    push(
      "False health blocked",
      Boolean(probe.visibleSunPresent && probe.cockpitRuntimePresent && probe.canopyRuntimePresent),
      "Strong health is forbidden when cockpit, canopy, or visible sun truth fails."
    );

    state.visualResults = rows;
    return rows;
  }

  function average(results) {
    if (!results.length) return 0;
    return Math.round(results.reduce(function (sum, item) {
      return sum + (Number(item.score) || (item.status === "STRONG" ? 100 : item.status === "WATCH" ? 60 : 0));
    }, 0) / results.length);
  }

  function scoreVisual(rows) {
    var total = rows.length * 100;
    var value;

    if (!rows.length) return 0;

    value = rows.reduce(function (sum, row) {
      if (row.status === "STRONG") return sum + 100;
      if (row.status === "WATCH") return sum + 60;
      return sum;
    }, 0);

    return Math.round(value / total * 100);
  }

  function hasStrong(checkName) {
    return state.visualResults.some(function (r) {
      return r.check === checkName && r.status === "STRONG";
    });
  }

  function computeScores() {
    var source = average(state.sourceResults);
    var visual = scoreVisual(state.visualResults);
    var failures = state.sourceResults.filter(function (r) { return r.status === "FAIL"; }).length +
      state.visualResults.filter(function (r) { return r.status === "FAIL"; }).length;
    var watches = state.sourceResults.filter(function (r) { return r.status === "WATCH"; }).length +
      state.visualResults.filter(function (r) { return r.status === "WATCH"; }).length;
    var visibleSunStrong = hasStrong("Visible sun present");
    var cockpitStrong = hasStrong("Cockpit runtime present");
    var canopyStrong = hasStrong("Canopy runtime present");
    var falseHealthBlocked = hasStrong("False health blocked");
    var drift = Math.min(100, failures * 22 + watches * 7);
    var overall = Math.round(source * 0.38 + visual * 0.62);

    if (!visibleSunStrong || !cockpitStrong || !canopyStrong || !falseHealthBlocked) {
      overall = Math.min(overall, 72);
      drift = Math.max(drift, 60);
    }

    state.scores.source = source;
    state.scores.visual = visual;
    state.scores.drift = drift;
    state.scores.overall = overall;

    return state.scores;
  }

  function renderLists() {
    var working = $("#workingList");
    var wrong = $("#wrongList");
    var todo = $("#todoList");
    var issues = [];

    clearNode(working);
    clearNode(wrong);
    clearNode(todo);

    state.sourceResults.forEach(function (r) {
      if (r.status === "STRONG") working.appendChild(makeLi("Source strong: " + r.path + "."));
      else issues.push("Source issue: " + r.path + " — " + r.finding);
    });

    state.visualResults.forEach(function (r) {
      if (r.status === "STRONG") working.appendChild(makeLi("Cockpit truth passed: " + r.check + "."));
      else issues.push("Cockpit issue: " + r.check + " — " + r.finding);
    });

    if (!working.children.length) working.appendChild(makeLi("No confirmed working item yet."));

    if (!issues.length) {
      wrong.appendChild(makeLi("No blocking cockpit issue detected by the current scan."));
      todo.appendChild(makeLi("Continue controlled refinement under Bravo 6 cockpit-aware canopy supervision."));
      return;
    }

    issues.forEach(function (issue) {
      wrong.appendChild(makeLi(issue));
    });

    issues.slice(0, 8).forEach(function (issue) {
      var item = document.createElement("li");
      item.textContent = issue
        .replace(/^Source issue: /, "Repair source marker or file availability: ")
        .replace(/^Cockpit issue: /, "Repair cockpit visual-control chain: ");
      todo.appendChild(item);
    });
  }

  function renderLedgers() {
    var sourceLedger = $("#sourceLedger");
    var visualLedger = $("#visualLedger");

    clearNode(sourceLedger);
    clearNode(visualLedger);

    state.sourceResults.forEach(function (r) {
      sourceLedger.appendChild(makeRow(r.path, r.status, r.finding));
    });

    state.visualResults.forEach(function (r) {
      visualLedger.appendChild(makeRow(r.check, r.status, r.finding));
    });
  }

  function renderScores() {
    var scores = computeScores();
    var status = "STRONG";

    if (scores.overall < 75 || scores.drift >= 60) status = "FAIL";
    else if (scores.overall < 95 || scores.drift > 10) status = "WATCH";

    setText("#statusText", status);
    setText("#updatedText", new Date().toLocaleTimeString());
    setText("#runtimeText", VERSION);
    setText("#overallScore", String(scores.overall) + "%");
    setText("#sourceScore", String(scores.source));
    setText("#visualScore", String(scores.visual));
    setText("#driftScore", String(scores.drift));
  }

  function run() {
    scanSources()
      .then(function () {
        return probeRootVisualTruth();
      })
      .then(function (probe) {
        buildVisualLedger(probe);
        renderLists();
        renderLedgers();
        renderScores();
      })
      .catch(function (error) {
        state.visualResults = [{
          check: "Gauge runtime",
          status: "FAIL",
          finding: error && error.message ? error.message : "Gauge runtime failed."
        }];
        renderLists();
        renderLedgers();
        renderScores();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
