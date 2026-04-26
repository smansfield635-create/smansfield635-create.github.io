(function () {
  "use strict";

  var VERSION = "spine-canopy-parachute-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";

  var FILES = [
    {
      id: "rootHtml",
      label: "Root HTML",
      path: "/index.html",
      required: [
        "data-root-boot-id=\"root-sun-asset-b1\"",
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
        "ROOT_BOOT_ID = \"root-sun-asset-b1\"",
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
    sourceResults: [],
    canopyResults: [],
    visualProbe: null,
    scores: {
      source: 0,
      visual: 0,
      drift: 100,
      overall: 0
    }
  };

  function by(selector) {
    return document.querySelector(selector);
  }

  function setText(selector, value) {
    var node = by(selector);
    if (node) node.textContent = value;
  }

  function statusClass(status) {
    if (status === "STRONG") return "strong";
    if (status === "FAIL") return "fail";
    return "watch";
  }

  function statusHtml(status) {
    return '<span class="status ' + statusClass(status) + '">' + status + '</span>';
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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
        finding: "Required canopy markers present."
      };
    }

    return {
      id: file.id,
      label: file.label,
      path: file.path,
      status: "WATCH",
      score: Math.max(40, 100 - missing.length * 18),
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
          var root;
          var sunMount;
          var sunFallback;
          var sunCanvas;
          var background;

          try {
            win = iframe.contentWindow;
            doc = iframe.contentDocument || (win && win.document);
            canopy = win && win.DGBSpineCanopy && typeof win.DGBSpineCanopy.getPublicState === "function"
              ? win.DGBSpineCanopy.getPublicState()
              : null;

            root = doc && (doc.getElementById("door-root") || doc.querySelector("[data-universe-sun]"));
            sunMount = doc && doc.querySelector("[data-dgb-sun-mount]");
            sunFallback = sunMount && sunMount.querySelector("[data-sun-fallback]");
            sunCanvas = sunMount && sunMount.querySelector("canvas");
            background = doc && doc.querySelector(".universe-sky");

            finish({
              ok: true,
              rootPresent: Boolean(root),
              indexBootExecuted: Boolean(win && win.DGBIndexBoot),
              canopyPresent: Boolean(canopy),
              sunMountPresent: Boolean(sunMount),
              fallbackSunPresent: Boolean(sunFallback),
              canvasSunPresent: Boolean(sunCanvas),
              sunVisible: Boolean(sunFallback || sunCanvas),
              backgroundVisible: Boolean(background),
              canopy: canopy
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
        finding: finding
      });
    }

    push("Root HTML served", probe && probe.rootPresent, "Root document exists in same-origin visual probe.");
    push("Index boot executed", probe && probe.indexBootExecuted, "window.DGBIndexBoot is present in root page.");
    push("Canopy runtime present", probe && probe.canopyPresent, "window.DGBSpineCanopy is present in root page.");
    push("Sun mount present", probe && probe.sunMountPresent, "Root contains [data-dgb-sun-mount].");
    push("Visible sun present", probe && probe.sunVisible, "Canvas sun or fallback sun is present.");
    push("Background visible", probe && probe.backgroundVisible, "Universe background exists without owning the sun.");
    push("False health blocked", probe && probe.sunVisible, "Full health is forbidden when visible sun is false.");

    state.canopyResults = rows;
    return
