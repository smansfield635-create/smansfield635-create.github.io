/* TNT RENEWAL — /gauges/gauges_health_runtime.js
   GAUGES HEALTH RUNTIME · GENERATION 2 COMPASS COCKPIT · BRAVO 6 · SUN VISUAL CONTRACT B2
   VERSION = "spine-canopy-parachute-b6"
   SUN_VISUAL_CONTRACT = "sun-visual-contract-b2"

   PURPOSE:
     - Preserve Bravo 6 cockpit visual probe.
     - Stop stale manifest reads from holding Source at 98.
     - Cache-bust source fetches without changing public source labels.
     - Verify the actual satellite-observational sun asset chain.
     - Keep page health separate from visual contract precision.
     - No graphics box.
     - No generated image.
*/

(function () {
  "use strict";

  var VERSION = "spine-canopy-parachute-b6";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var COCKPIT_VERSION = "root-compass-cockpit-b1";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var SUN_VISUAL_PROFILE = "satellite-observational-solar-disc-b8";
  var SUN_RUNTIME_VERSION = "sun-asset-runtime-satellite-b8";
  var SOURCE_MARKER = "ROOT_COMPASS_COCKPIT_GENERATION_2_SOURCE_MARKER_B1";
  var JS_SOURCE_MARKER = "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1";

  var FILES = [
    {
      label: "Root Compass",
      path: "/index.html",
      displayPath: "/index.html",
      required: [
        "Diamond Gate Bridge",
        "Learn to Live to Love",
        "root-sun-asset-b1",
        "root-compass-cockpit-b1",
        SOURCE_MARKER,
        "data-dgb-sun-mount",
        "data-sun-fallback",
        "/index.js"
      ]
    },
    {
      label: "Root cockpit boot",
      path: "/index.js?v=root-sun-asset-b1-satellite-sun-b8",
      displayPath: "/index.js?v=root-sun-asset-b1-satellite-sun-b8",
      required: [
        "ROOT_BOOT_ID",
        "root-sun-asset-b1",
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
      displayPath: "/runtime/spine_canopy_runtime.js?v=spine-canopy-parachute-b1",
      required: [
        "DGBSpineCanopy",
        "spine-canopy-parachute-b1",
        "sunVisible",
        "falseHealthBlocked"
      ]
    },
    {
      label: "Sun asset runtime",
      path: "/runtime/sun_asset_runtime.js?v=sun-asset-runtime-satellite-b8",
      displayPath: "/runtime/sun_asset_runtime.js?v=sun-asset-runtime-satellite-b8",
      required: [
        "DGBSunAssetRuntime",
        "root-sun-asset-b1",
        "DGBSunCanvas",
        "satellite-observational-solar-disc-b8",
        "sun-asset-runtime-satellite-b8"
      ]
    },
    {
      label: "Sun canvas renderer",
      path: "/assets/sun/sun_canvas.js?v=satellite-observational-solar-disc-b8",
      displayPath: "/assets/sun/sun_canvas.js?v=satellite-observational-solar-disc-b8",
      required: [
        "DGBSunCanvas",
        "satellite-observational-solar-disc-b8",
        "limb",
        "granulation",
        "sunspots"
      ]
    },
    {
      label: "Sun manifest",
      path: "/assets/sun/sun_manifest.json?v=satellite-observational-solar-disc-b8",
      displayPath: "/assets/sun/sun_manifest.json?v=satellite-observational-solar-disc-b8",
      required: [
        "root-sun-asset-b1",
        "satellite-observational-solar-disc",
        "satellite-observational-solar-disc-b8"
      ]
    },
    {
      label: "Sun material CSS",
      path: "/assets/sun/sun_material.css?v=satellite-observational-solar-disc-b8",
      displayPath: "/assets/sun/sun_material.css?v=satellite-observational-solar-disc-b8",
      required: [
        "data-dgb-sun-mount",
        "data-satellite-sun-canvas"
      ]
    },
    {
      label: "Sun SVG reference",
      path: "/assets/sun/sun.svg?v=satellite-observational-solar-disc-b8",
      displayPath: "/assets/sun/sun.svg?v=satellite-observational-solar-disc-b8",
      required: [
        "satellite-observational",
        "limb",
        "sunspots"
      ]
    },
    {
      label: "Gauges health runtime",
      path: "/gauges/gauges_health_runtime.js?v=spine-canopy-parachute-b6-sun-contract-b2",
      displayPath: "/gauges/gauges_health_runtime.js?v=spine-canopy-parachute-b6-sun-contract-b2",
      required: [
        "spine-canopy-parachute-b6",
        "root-compass-cockpit-b1",
        "probeRootVisualTruth",
        "falseHealthBlocked",
        "sun-visual-contract-b2"
      ]
    }
  ];

  var state = {
    sourceResults: [],
    visualResults: [],
    sunContractResults: [],
    scores: {
      source: 0,
      visual: 0,
      sun: 0,
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

  function cacheBust(path) {
    var joiner = path.indexOf("?") === -1 ? "?" : "&";
    return path + joiner + "gaugeBust=" + encodeURIComponent(String(Date.now()));
  }

  function fetchText(file) {
    var fetchPath = cacheBust(file.path);

    return fetch(fetchPath, {
      cache: "reload",
      credentials: "same-origin",
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    }).then(function (response) {
      return response.text().then(function (text) {
        return {
          ok: response.ok,
          status: response.status,
          path: file.displayPath || file.path,
          fetchPath: fetchPath,
          text: text
        };
      });
    }).catch(function (error) {
      return {
        ok: false,
        status: 0,
        path: file.displayPath || file.path,
        fetchPath: fetchPath,
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
        path: result.path,
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
        path: result.path,
        status: "STRONG",
        score: 100,
        finding: "Required marker set present."
      };
    }

    return {
      label: file.label,
      path: result.path,
      status: missing.length > 2 ? "FAIL" : "WATCH",
      score: Math.max(40, 100 - missing.length * 14),
      finding: "Missing marker(s): " + missing.join(", ")
    };
  }

  function scanSources() {
    return Promise.all(FILES.map(function (file) {
      return fetchText(file).then(function (result) {
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

  function safeRuntimeState(win) {
    try {
      if (win && win.DGBSunAssetRuntime && typeof win.DGBSunAssetRuntime.getState === "function") {
        return win.DGBSunAssetRuntime.getState();
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
      iframe.src = "/?cockpitGaugeProbe=bravo6-sun-contract-b2-" + encodeURIComponent(String(Date.now()));

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
        var sunRuntime;
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
          sunRuntime = safeRuntimeState(win);

          mount = doc.querySelector("[data-dgb-sun-mount]");
          fallback = mount && mount.querySelector("[data-sun-fallback]");
          canvas = mount && mount.querySelector("canvas");
          svg = mount && mount.querySelector("svg");
          background = doc.querySelector(".universe-sky");
          cockpitWindow = doc.querySelector("[data-cockpit-window]");
          controls = doc.querySelector("[data-cockpit-control-panel]");
          bodyText = doc.body.textContent || "";

          rootAttrRuntime = Boolean(root && (
            root.getAttribute("data-index-boot") ||
            root.getAttribute("data-js-renewal-marker") ||
            root.getAttribute("data-venue-bridge") ||
            root.getAttribute("data-canopy-relationship") === "held-by-canopy"
          ));

          indexRuntimeByApi = Boolean(indexBoot || (win && win.DGBIndexBoot));
          cockpitRuntimeByApi = Boolean(cockpit || (win && win.DGBCompassCockpit));

          sunByElement = Boolean(
            (canvas && visibleElement(canvas)) ||
            (svg && visibleElement(svg)) ||
            (fallback && visibleElement(fallback))
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
            sourceMarkerAligned: Boolean(root && root.getAttribute("data-source-marker") === SOURCE_MARKER),
            indexBootExecuted: Boolean(indexRuntimeByApi || rootAttrRuntime),
            cockpitRuntimePresent: Boolean(cockpitRuntimeByApi || rootAttrRuntime),
            canopyRuntimePresent: Boolean(canopy || (win && win.DGBSpineCanopy)),
            sunRuntimePresent: Boolean(sunRuntime || (win && win.DGBSunAssetRuntime)),
            sunCanvasGlobalPresent: Boolean(win && win.DGBSunCanvas),
            sunRuntimeVersionAligned: Boolean(sunRuntime && sunRuntime.canvasVersion === SUN_VISUAL_PROFILE),
            sunMountPresent: Boolean(mount),
            fallbackSunPresent: Boolean(fallback),
            canvasSunPresent: Boolean(canvas),
            svgSunPresent: Boolean(svg),
            visibleSunPresent: Boolean(sunByElement || sunByMount),
            satelliteSunProfilePresent: Boolean(
              mount &&
              (
                mount.getAttribute("data-sun-visual-profile") === SUN_VISUAL_PROFILE ||
                mount.getAttribute("data-sun-canvas-version") === SUN_VISUAL_PROFILE ||
                mount.getAttribute("data-sun-satellite-profile") === SUN_VISUAL_PROFILE
              )
            ),
            backgroundVisible: Boolean(backgroundByElement || backgroundByComputed),
            cockpitWindowPresent: Boolean(cockpitWindow && visibleElement(cockpitWindow)),
            cockpitControlsPresent: Boolean(controls && visibleElement(controls)),
            titlePresent: bodyText.indexOf("Diamond Gate Bridge") !== -1,
            themePresent: bodyText.indexOf("Learn to Live to Love") !== -1,
            cockpit: cockpit,
            indexBoot: indexBoot,
            canopy: canopy,
            sunRuntime: sunRuntime
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

        if (probe && probe.ok && Date.now() - started > 5400) {
          finish(probe);
          return;
        }

        if (probe && !probe.ok) {
          finish(probe);
          return;
        }

        if (Date.now() - started > 8200) {
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
    push("Sun runtime present", probe.sunRuntimePresent, "window.DGBSunAssetRuntime must exist.");
    push("Sun canvas global present", probe.sunCanvasGlobalPresent, "window.DGBSunCanvas must exist.");
    push("Sun runtime profile aligned", probe.sunRuntimeVersionAligned, "Sun runtime must report " + SUN_VISUAL_PROFILE + ".", true);
    push("Sun mount present", probe.sunMountPresent, "Root must contain [data-dgb-sun-mount].");
    push("Visible sun present", probe.visibleSunPresent, "Canvas, SVG, fallback, or visible mounted sun body must be measurable.");
    push("Satellite sun profile present", probe.satelliteSunProfilePresent, "Sun mount should declare " + SUN_VISUAL_PROFILE + ".", true);
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

  function buildSunContractResults() {
    var sourceStrong = state.sourceResults.every(function (r) {
      return r.status === "STRONG";
    });

    var canvasStrong = state.sourceResults.some(function (r) {
      return r.path.indexOf("/assets/sun/sun_canvas.js") !== -1 && r.status === "STRONG";
    });

    var runtimeStrong = state.sourceResults.some(function (r) {
      return r.path.indexOf("/runtime/sun_asset_runtime.js") !== -1 && r.status === "STRONG";
    });

    var manifestStrong = state.sourceResults.some(function (r) {
      return r.path.indexOf("/assets/sun/sun_manifest.json") !== -1 && r.status === "STRONG";
    });

    var svgStrong = state.sourceResults.some(function (r) {
      return r.path.indexOf("/assets/sun/sun.svg") !== -1 && r.status === "STRONG";
    });

    var profileVisible = state.visualResults.some(function (r) {
      return r.check === "Satellite sun profile present" && r.status === "STRONG";
    });

    state.sunContractResults = [
      {
        check: "Sun source chain current",
        status: sourceStrong ? "STRONG" : "WATCH",
        finding: sourceStrong ? "All required source markers are present." : "At least one source marker is not yet current."
      },
      {
        check: "Canvas owns solar body",
        status: canvasStrong ? "STRONG" : "WATCH",
        finding: canvasStrong ? "sun_canvas.js carries the satellite-observational contract." : "sun_canvas.js is not yet confirmed current."
      },
      {
        check: "Runtime mounts canvas",
        status: runtimeStrong ? "STRONG" : "WATCH",
        finding: runtimeStrong ? "sun_asset_runtime.js carries the satellite-observational mount contract." : "sun_asset_runtime.js is not yet confirmed current."
      },
      {
        check: "Manifest names target",
        status: manifestStrong ? "STRONG" : "WATCH",
        finding: manifestStrong ? "sun_manifest.json names root boot and satellite visual target." : "sun_manifest.json still needs marker alignment."
      },
      {
        check: "SVG reference aligned",
        status: svgStrong ? "STRONG" : "WATCH",
        finding: svgStrong ? "sun.svg reference is aligned to satellite-observational target." : "sun.svg is not yet confirmed current."
      },
      {
        check: "Live mount declares profile",
        status: profileVisible ? "STRONG" : "WATCH",
        finding: profileVisible ? "Live root mount declares the satellite profile." : "Live root is visually passing, but profile declaration is not yet fully confirmed."
      }
    ];

    return state.sunContractResults;
  }

  function average(results) {
    if (!results.length) return 0;

    return Math.round(results.reduce(function (sum, item) {
      return sum + (
        Number(item.score) ||
        (item.status === "STRONG" ? 100 : item.status === "WATCH" ? 60 : 0)
      );
    }, 0) / results.length);
  }

  function scoreRows(rows) {
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
    var visual = scoreRows(state.visualResults);
    var sun = scoreRows(state.sunContractResults);

    var failures =
      state.sourceResults.filter(function (r) { return r.status === "FAIL"; }).length +
      state.visualResults.filter(function (r) { return r.status === "FAIL"; }).length +
      state.sunContractResults.filter(function (r) { return r.status === "FAIL"; }).length;

    var watches =
      state.sourceResults.filter(function (r) { return r.status === "WATCH"; }).length +
      state.visualResults.filter(function (r) { return r.status === "WATCH"; }).length +
      state.sunContractResults.filter(function (r) { return r.status === "WATCH"; }).length;

    var visibleSunStrong = hasStrong("Visible sun present");
    var cockpitStrong = hasStrong("Cockpit runtime present");
    var canopyStrong = hasStrong("Canopy runtime present");
    var falseHealthBlocked = hasStrong("False health blocked");

    var drift = Math.min(100, failures * 22 + watches * 7);
    var overall = Math.round(source * 0.32 + visual * 0.50 + sun * 0.18);

    if (!visibleSunStrong || !cockpitStrong || !canopyStrong || !falseHealthBlocked) {
      overall = Math.min(overall, 72);
      drift = Math.max(drift, 60);
    }

    state.scores.source = source;
    state.scores.visual = visual;
    state.scores.sun = sun;
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

    state.sunContractResults.forEach(function (r) {
      if (r.status === "STRONG") working.appendChild(makeLi("Sun contract passed: " + r.check + "."));
      else issues.push("Sun contract issue: " + r.check + " — " + r.finding);
    });

    if (!working.children.length) {
      working.appendChild(makeLi("No confirmed working item yet."));
    }

    if (!issues.length) {
      wrong.appendChild(makeLi("No blocking cockpit or sun-contract issue detected by the current scan."));
      todo.appendChild(makeLi("Lock the current Compass sun visual baseline, then continue controlled refinement."));
      return;
    }

    issues.forEach(function (issue) {
      wrong.appendChild(makeLi(issue));
    });

    issues.slice(0, 10).forEach(function (issue) {
      var item = document.createElement("li");
      item.textContent = issue
        .replace(/^Source issue: /, "Repair source marker or file availability: ")
        .replace(/^Cockpit issue: /, "Repair cockpit visual-control chain: ")
        .replace(/^Sun contract issue: /, "Repair sun visual contract chain: ");
      todo.appendChild(item);
    });
  }

  function renderLedgers() {
    var sourceLedger = $("#sourceLedger");
    var visualLedger = $("#visualLedger");
    var sunLedger = $("#sunContractLedger");

    clearNode(sourceLedger);
    clearNode(visualLedger);
    if (sunLedger) clearNode(sunLedger);

    state.sourceResults.forEach(function (r) {
      sourceLedger.appendChild(makeRow(r.path, r.status, r.finding));
    });

    state.visualResults.forEach(function (r) {
      visualLedger.appendChild(makeRow(r.check, r.status, r.finding));
    });

    if (sunLedger) {
      state.sunContractResults.forEach(function (r) {
        sunLedger.appendChild(makeRow(r.check, r.status, r.finding));
      });
    }
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

    var sunScore = $("#sunScore");
    if (sunScore) sunScore.textContent = String(scores.sun);
  }

  function run() {
    scanSources()
      .then(function () {
        return probeRootVisualTruth();
      })
      .then(function (probe) {
        buildVisualLedger(probe);
        buildSunContractResults();
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

        buildSunContractResults();
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
