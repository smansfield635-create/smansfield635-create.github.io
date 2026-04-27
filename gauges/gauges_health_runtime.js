/* TNT RENEWAL — /gauges/gauges_health_runtime.js
   GAUGES · GENERATION 2 · EARTH DIAGNOSTIC CONSOLE B2

   PURPOSE:
     - Produce a diagnostic, not a question list.
     - Identify the actual blocker category.
     - Test showroom source.
     - Test expected local assets.
     - Test external fallback assets.
     - Test canvas render capability.
     - Test cross-origin pixel-read limitation.
     - Test if the showroom still loads duplicate sun renderers.
     - Test if Earth renderer is present and measurable.
*/

(function () {
  "use strict";

  var CONFIG = {
    showroomHtml: "/showroom/index.html",
    showroomUrl: "/showroom/?dgb_gauge_probe=earth_diagnostic_console_b2",

    expectedShowroomMarkers: [
      "data-showroom-root",
      "data-earth-renderer",
      "data-earth-clouds",
      "earthCanvas",
      "targetFrameMs"
    ],

    localAssets: [
      {
        name: "Local Earth surface",
        url: "/assets/earth/earth_surface_2048.jpg",
        purpose: "Preferred same-origin Earth texture for pixel-readable diagnostics."
      },
      {
        name: "Local Earth cloud map",
        url: "/assets/earth/earth_clouds_2048.jpg",
        purpose: "Preferred same-origin cloud texture for pixel-readable diagnostics."
      }
    ],

    externalAssets: [
      {
        name: "External Earth surface fallback",
        url: "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg",
        purpose: "Remote Earth surface texture fallback."
      },
      {
        name: "External Earth cloud fallback",
        url: "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg",
        purpose: "Remote cloud map fallback."
      }
    ],

    forbiddenShowroomScripts: [
      "sun_asset_runtime.js",
      "sun_canvas.js"
    ]
  };

  var report = {
    asset: [],
    renderer: [],
    budget: [],
    visual: [],
    verdict: [],
    todo: [],
    flags: {
      showroomSourceOk: false,
      localEarthAsset: false,
      localCloudAsset: false,
      externalEarthAsset: false,
      externalCloudAsset: false,
      externalCanvasTaint: false,
      earthCanvasFound: false,
      earthRendererMarker: false,
      budgetMarker: false,
      duplicateSunRuntime: false,
      probeOk: false
    }
  };

  function $(id) {
    return document.getElementById(id);
  }

  function add(bucket, status, label, detail, code) {
    report[bucket].push({
      status: status,
      label: label,
      detail: detail,
      code: code || ""
    });
  }

  function addTodo(status, label, detail, code) {
    add("todo", status, label, detail, code);
  }

  function stateWeight(status) {
    if (status === "STRONG") return 100;
    if (status === "INFO") return 88;
    if (status === "WATCH") return 58;
    return 0;
  }

  function score(entries) {
    if (!entries.length) return 100;
    var total = entries.reduce(function (sum, entry) {
      return sum + stateWeight(entry.status);
    }, 0);
    return Math.round(total / entries.length);
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = String(value);
  }

  function statusClass(scoreValue) {
    if (scoreValue >= 90) return "strong";
    if (scoreValue >= 65) return "watch";
    return "fail";
  }

  function statusLabel(scoreValue) {
    if (scoreValue >= 90) return "STRONG";
    if (scoreValue >= 65) return "WATCH";
    return "FAIL";
  }

  function makeItem(entry) {
    var node = document.createElement("div");
    var strong = document.createElement("strong");
    var span = document.createElement("span");

    node.className = "item";
    node.setAttribute("data-state", entry.status);

    strong.textContent = entry.status + " · " + entry.label;
    span.textContent = entry.detail;

    node.appendChild(strong);
    node.appendChild(span);

    if (entry.code) {
      var code = document.createElement("code");
      code.textContent = entry.code;
      node.appendChild(code);
    }

    return node;
  }

  function renderList(id, entries) {
    var target = $(id);
    if (!target) return;

    target.textContent = "";

    if (!entries.length) {
      target.appendChild(makeItem({
        status: "INFO",
        label: "No data",
        detail: "No diagnostic entries were produced for this section."
      }));
      return;
    }

    entries.forEach(function (entry) {
      target.appendChild(makeItem(entry));
    });
  }

  function fetchText(url) {
    return fetch(url + (url.indexOf("?") === -1 ? "?v=" : "&v=") + "earth-diagnostic-console-b2", {
      cache: "no-store"
    }).then(function (response) {
      return response.text().then(function (text) {
        return {
          ok: response.ok,
          status: response.status,
          text: text
        };
      });
    }).catch(function (error) {
      return {
        ok: false,
        status: 0,
        text: "",
        error: error
      };
    });
  }

  function testImage(url) {
    return new Promise(function (resolve) {
      var image = new Image();
      var done = false;
      var timer;

      function finish(result) {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        resolve(result);
      }

      timer = window.setTimeout(function () {
        finish({
          ok: false,
          url: url,
          width: 0,
          height: 0,
          reason: "timeout"
        });
      }, 5000);

      image.onload = function () {
        finish({
          ok: true,
          url: url,
          width: image.naturalWidth || image.width || 0,
          height: image.naturalHeight || image.height || 0,
          image: image
        });
      };

      image.onerror = function () {
        finish({
          ok: false,
          url: url,
          width: 0,
          height: 0,
          reason: "load-error"
        });
      };

      image.crossOrigin = "anonymous";
      image.src = url + (url.indexOf("?") === -1 ? "?v=" : "&v=") + "earth-diagnostic-console-b2";
    });
  }

  function testCanvasPixelRead(imageResult) {
    var canvas;
    var ctx;

    if (!imageResult || !imageResult.ok || !imageResult.image) {
      return {
        ok: false,
        readable: false,
        reason: "image-not-loaded"
      };
    }

    canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    ctx = canvas.getContext("2d");

    try {
      ctx.drawImage(imageResult.image, 0, 0, 16, 16);
      ctx.getImageData(0, 0, 1, 1);
      return {
        ok: true,
        readable: true,
        reason: "pixel-readable"
      };
    } catch (error) {
      return {
        ok: true,
        readable: false,
        reason: error && error.name ? error.name : "pixel-read-blocked"
      };
    }
  }

  function analyzeSource(source) {
    var text = source.text || "";

    if (source.ok) {
      report.flags.showroomSourceOk = true;
      add("renderer", "STRONG", "Showroom source reachable", "The showroom source file returned successfully.", CONFIG.showroomHtml);
    } else {
      add("renderer", "FAIL", "Showroom source unreachable", "The gauges cannot inspect the showroom source. This is a source-chain failure.", CONFIG.showroomHtml);
      addTodo("FAIL", "Restore showroom source reachability", "The gauges need /showroom/index.html to return a readable document.", CONFIG.showroomHtml);
      return;
    }

    CONFIG.expectedShowroomMarkers.forEach(function (marker) {
      if (text.indexOf(marker) !== -1) {
        add("renderer", "STRONG", "Marker present", "Required marker exists in showroom source.", marker);
      } else {
        add("renderer", "FAIL", "Marker missing", "Required marker is absent from showroom source.", marker);
        addTodo("FAIL", "Restore missing showroom marker", "The diagnostic contract expects this marker in /showroom/index.html.", marker);
      }
    });

    if (text.indexOf("data-earth-renderer=\"single-canvas-capped-orthographic-wrap\"") !== -1) {
      report.flags.earthRendererMarker = true;
      add("renderer", "STRONG", "Single Earth renderer declared", "The showroom declares Earth as a capped orthographic canvas renderer.");
    } else {
      add("renderer", "WATCH", "Renderer declaration not exact", "The showroom may still render Earth, but it does not declare the expected exact renderer contract.");
      addTodo("WATCH", "Rebind renderer declaration", "Use the exact Earth renderer marker so gauges can identify the ownership contract.", "data-earth-renderer=\"single-canvas-capped-orthographic-wrap\"");
    }

    if (text.indexOf("targetFrameMs") !== -1) {
      report.flags.budgetMarker = true;
      add("budget", "STRONG", "Frame budget marker found", "The showroom declares a capped render-loop marker.");
    } else {
      add("budget", "FAIL", "No frame budget marker", "The renderer may be drawing at an unbounded mobile rate.");
      addTodo("FAIL", "Restore mobile render cap", "The Earth renderer should include targetFrameMs or equivalent frame-budget enforcement.");
    }

    CONFIG.forbiddenShowroomScripts.forEach(function (fragment) {
      if (text.indexOf(fragment) !== -1) {
        report.flags.duplicateSunRuntime = true;
        add("renderer", "FAIL", "Duplicate renderer risk", "The showroom source still references a sun renderer asset. Earth should be the only active renderer.", fragment);
        addTodo("FAIL", "Remove active sun renderer from showroom", "Keep the sun CSS-only on the Earth showroom page.", fragment);
      }
    });

    if (!report.flags.duplicateSunRuntime) {
      add("renderer", "STRONG", "No active sun renderer in source", "The showroom source does not reference the active Compass sun renderer.");
    }

    if (text.indexOf("https://eoimages.gsfc.nasa.gov") !== -1) {
      add("asset", "WATCH", "External Earth assets detected", "The showroom currently relies on remote Earth/cloud assets. This may render visually but limits local control and diagnostics.");
      addTodo("WATCH", "Move Earth assets local", "Add same-origin assets so the gauges can inspect pixels and the page is not dependent on remote load timing.", "/assets/earth/earth_surface_2048.jpg and /assets/earth/earth_clouds_2048.jpg");
    } else if (text.indexOf("/assets/earth/") !== -1) {
      add("asset", "STRONG", "Local Earth asset path detected", "The showroom references local Earth asset paths.");
    } else {
      add("asset", "FAIL", "No Earth asset path detected", "The showroom source does not expose a clear Earth texture path.");
      addTodo("FAIL", "Declare Earth asset paths", "The showroom should expose explicit Earth surface and cloud asset paths.");
    }
  }

  function analyzeAssets() {
    var localTests = CONFIG.localAssets.map(function (asset) {
      return testImage(asset.url).then(function (result) {
        if (result.ok) {
          if (asset.name.indexOf("surface") !== -1) report.flags.localEarthAsset = true;
          if (asset.name.indexOf("cloud") !== -1) report.flags.localCloudAsset = true;

          add("asset", "STRONG", asset.name, "Same-origin asset loaded. Pixel-level diagnostics are possible.", asset.url + " · " + result.width + "x" + result.height);
        } else {
          add("asset", "WATCH", asset.name + " missing", "Same-origin asset is not available. The page may still work through external fallback, but diagnostics/control are weaker.", asset.url);
        }
      });
    });

    var externalTests = CONFIG.externalAssets.map(function (asset) {
      return testImage(asset.url).then(function (result) {
        var pixelRead;

        if (result.ok) {
          if (asset.name.indexOf("surface") !== -1) report.flags.externalEarthAsset = true;
          if (asset.name.indexOf("cloud") !== -1) report.flags.externalCloudAsset = true;

          add("asset", "STRONG", asset.name, "External fallback asset loaded.", asset.url + " · " + result.width + "x" + result.height);

          pixelRead = testCanvasPixelRead(result);
          if (pixelRead.readable) {
            add("asset", "INFO", asset.name + " canvas-readable", "Canvas pixel inspection is allowed for this asset in the current browser session.");
          } else {
            report.flags.externalCanvasTaint = true;
            add("asset", "WATCH", asset.name + " pixel inspection blocked", "The asset can display, but canvas pixel diagnostics are blocked or unreliable. This is not necessarily a visual failure; it is a control/diagnostic limitation.", pixelRead.reason);
          }
        } else {
          add("asset", "FAIL", asset.name + " unavailable", "External fallback asset did not load.", asset.url);
        }
      });
    });

    return Promise.all(localTests.concat(externalTests));
  }

  function analyzeProbe() {
    var iframe = $("showroomProbe");

    return new Promise(function (resolve) {
      var done = false;

      function finish() {
        if (done) return;
        done = true;
        resolve();
      }

      if (!iframe) {
        add("renderer", "FAIL", "Probe iframe missing", "The gauges cannot inspect the live showroom DOM.");
        finish();
        return;
      }

      iframe.addEventListener("load", function () {
        var doc;
        var root;
        var canvas;
        var controller;
        var scripts;
        var duplicateScripts;
        var viewButtons;
        var rendererMarker;
        var cloudsMarker;

        try {
          doc = iframe.contentDocument || iframe.contentWindow.document;
        } catch (error) {
          add("renderer", "FAIL", "Same-origin probe blocked", "The gauges cannot access the showroom DOM. This prevents live renderer diagnostics.");
          finish();
          return;
        }

        report.flags.probeOk = true;

        root = doc.querySelector("[data-showroom-root]");
        canvas = doc.querySelector("#earthCanvas");
        controller = doc.querySelector("#earthController");
        scripts = Array.prototype.slice.call(doc.scripts || []);
        duplicateScripts = scripts.filter(function (script) {
          return CONFIG.forbiddenShowroomScripts.some(function (fragment) {
            return script.src && script.src.indexOf(fragment) !== -1;
          });
        });
        viewButtons = doc.querySelectorAll("[data-view]");
        rendererMarker = root ? root.getAttribute("data-earth-renderer") : "";
        cloudsMarker = root ? root.getAttribute("data-earth-clouds") : "";

        if (root) {
          add("renderer", "STRONG", "Live showroom root found", "The live showroom DOM exposes its root diagnostic attributes.");
        } else {
          add("renderer", "FAIL", "Live showroom root missing", "The live page does not expose [data-showroom-root].");
          addTodo("FAIL", "Restore showroom root attribute", "The live page must expose the showroom root for gauges to diagnose it.", "[data-showroom-root]");
        }

        if (canvas && canvas.clientWidth > 80 && canvas.clientHeight > 80) {
          report.flags.earthCanvasFound = true;
          add("renderer", "STRONG", "Live Earth canvas measurable", "The Earth canvas exists and has measurable dimensions.", Math.round(canvas.clientWidth) + "x" + Math.round(canvas.clientHeight));
        } else {
          add("renderer", "FAIL", "Live Earth canvas missing", "The page is not exposing a measurable #earthCanvas.");
          addTodo("FAIL", "Restore measurable Earth canvas", "The showroom must render Earth through a visible #earthCanvas.");
        }

        if (controller) {
          add("renderer", "STRONG", "Manual spin controller present", "The live page exposes #earthController for manual drag/spin.");
        } else {
          add("renderer", "FAIL", "Manual spin controller missing", "Manual spin cannot be confirmed.");
          addTodo("FAIL", "Restore manual spin controller", "Add #earthController around the canvas.");
        }

        if (duplicateScripts.length) {
          add("renderer", "FAIL", "Duplicate active renderer loaded", "Showroom live DOM still loads sun renderer scripts. This can interfere with budget and ownership.", duplicateScripts.map(function (s) { return s.src; }).join(" | "));
          addTodo("FAIL", "Remove duplicate active renderer scripts", "Earth showroom should not load sun runtime scripts.");
        } else {
          add("renderer", "STRONG", "No duplicate sun runtime live", "The live showroom DOM does not load active sun renderer scripts.");
        }

        if (viewButtons.length >= 5) {
          add("renderer", "STRONG", "View controls live", "Public view controls are present and measurable.");
        } else {
          add("renderer", "WATCH", "View controls incomplete", "Fewer than five view controls were found.");
        }

        if (rendererMarker === "single-canvas-capped-orthographic-wrap") {
          add("renderer", "STRONG", "Live renderer marker exact", "The live root declares the expected renderer.", rendererMarker);
        } else {
          add("renderer", "WATCH", "Live renderer marker mismatch", "The live renderer marker is missing or different.", rendererMarker || "none");
        }

        if (cloudsMarker && cloudsMarker.indexOf("cloud") !== -1) {
          add("asset", "STRONG", "Live cloud marker present", "The live root declares cloud-map usage.", cloudsMarker);
        } else {
          add("asset", "WATCH", "Live cloud marker unclear", "The live root does not clearly declare cloud-map usage.", cloudsMarker || "none");
        }

        finish();
      }, { once: true });

      window.setTimeout(function () {
        add("budget", "WATCH", "Showroom probe slow", "The hidden live showroom probe did not complete quickly. This indicates possible runtime load or budget pressure.");
        finish();
      }, 5000);
    });
  }

  function analyzeVisualGap() {
    if (report.flags.earthCanvasFound && report.flags.earthRendererMarker) {
      add("visual", "WATCH", "Likely remaining blocker: projection fidelity", "The structure exists, but the visual may still fail if the renderer maps longitude/latitude with weak depth compression or incorrect orientation.");
      addTodo("WATCH", "Tune projection math next", "If all source/control rows pass but the globe still looks wrong, the next fix belongs inside the spherical projection math: limb compression, orientation, cloud opacity, and Americas-facing default.");
    }

    if (!report.flags.localEarthAsset || !report.flags.localCloudAsset) {
      add("visual", "WATCH", "Asset control is incomplete", "The page can use remote assets, but local assets are needed for stable diagnostics, cache control, and predictable visual tuning.");
    }

    if (report.flags.externalCanvasTaint) {
      add("visual", "WATCH", "External assets limit diagnostics", "The external assets may render, but gauge-level pixel diagnostics may be blocked. This limits proof that the canvas output matches the target.");
    }

    if (report.flags.duplicateSunRuntime) {
      add("visual", "FAIL", "Renderer ownership conflict", "If the sun runtime is active on the showroom, it competes with Earth as the page’s main renderer and can confuse the repair path.");
    }

    if (!report.flags.externalEarthAsset && !report.flags.localEarthAsset) {
      add("visual", "FAIL", "No reliable Earth surface asset", "The showroom cannot reach a reliable Earth texture source.");
    }

    if (!report.flags.externalCloudAsset && !report.flags.localCloudAsset) {
      add("visual", "FAIL", "No reliable cloud asset", "The showroom cannot reach a reliable real cloud source.");
    }
  }

  function finalVerdict() {
    var assetScore = score(report.asset);
    var rendererScore = score(report.renderer);
    var budgetScore = score(report.budget);
    var visualScore = score(report.visual);
    var verdictScore = Math.round((assetScore * 0.28) + (rendererScore * 0.34) + (budgetScore * 0.18) + (visualScore * 0.20));
    var driftScore = Math.max(0, 100 - verdictScore);
    var statusNode = $("overallStatus");
    var status = statusLabel(verdictScore);
    var primaryBlocker = "visual-calibration";

    if (!report.flags.showroomSourceOk) {
      primaryBlocker = "source-chain";
    } else if (!report.flags.localEarthAsset || !report.flags.localCloudAsset) {
      primaryBlocker = "asset-control";
    } else if (!report.flags.earthCanvasFound || !report.flags.earthRendererMarker) {
      primaryBlocker = "renderer-ownership";
    } else if (report.flags.duplicateSunRuntime) {
      primaryBlocker = "duplicate-runtime";
    } else if (budgetScore < 80) {
      primaryBlocker = "runtime-budget";
    } else {
      primaryBlocker = "projection-math";
    }

    setText("verdictScore", verdictScore);
    setText("assetScore", assetScore);
    setText("rendererScore", rendererScore);
    setText("budgetScore", budgetScore);
    setText("driftScore", driftScore);

    setText("verdictNote", status);
    setText("assetNote", statusLabel(assetScore));
    setText("rendererNote", statusLabel(rendererScore));
    setText("budgetNote", statusLabel(budgetScore));
    setText("driftNote", driftScore <= 10 ? "LOW" : driftScore <= 35 ? "WATCH" : "HIGH");

    if (statusNode) {
      statusNode.className = "status " + statusClass(verdictScore);
      statusNode.textContent = status + " · PRIMARY BLOCKER: " + primaryBlocker.toUpperCase();
    }

    add("verdict", status, "Primary blocker", "The current most likely blocker is " + primaryBlocker + ".", primaryBlocker);

    if (primaryBlocker === "asset-control") {
      setText("statusHeadline", "Asset control is the current blocker.");
      addTodo("FAIL", "Create local Earth assets", "Add local Earth surface and cloud assets so the showroom and gauges stop depending on remote imagery and blocked pixel diagnostics.", "/assets/earth/earth_surface_2048.jpg · /assets/earth/earth_clouds_2048.jpg");
    } else if (primaryBlocker === "projection-math") {
      setText("statusHeadline", "Projection math is the current blocker.");
      addTodo("WATCH", "Repair spherical projection math", "The remaining issue is likely not source or assets. Repair the canvas longitude-to-limb compression, cloud opacity, and Americas-facing default orientation.");
    } else if (primaryBlocker === "renderer-ownership") {
      setText("statusHeadline", "Renderer ownership is the current blocker.");
      addTodo("FAIL", "Restore Earth as the single active renderer", "The showroom must expose #earthCanvas and the exact single-canvas renderer marker.");
    } else if (primaryBlocker === "duplicate-runtime") {
      setText("statusHeadline", "Duplicate runtime ownership is the current blocker.");
      addTodo("FAIL", "Remove active sun runtime from showroom", "Sun remains CSS-only on showroom; Earth canvas is the only active renderer.");
    } else if (primaryBlocker === "runtime-budget") {
      setText("statusHeadline", "Runtime budget is the current blocker.");
      addTodo("WATCH", "Lower render cost", "Reduce slice count, cap frame rate further, and pause rendering when offscreen.");
    } else {
      setText("statusHeadline", "Source chain is the current blocker.");
    }

    renderList("verdictList", report.verdict);
    renderList("assetLedger", report.asset);
    renderList("rendererLedger", report.renderer);
    renderList("budgetLedger", report.budget);
    renderList("visualLedger", report.visual);
    renderList("todoList", report.todo);
  }

  function boot() {
    fetchText(CONFIG.showroomHtml)
      .then(function (source) {
        analyzeSource(source);
        return analyzeAssets();
      })
      .then(analyzeProbe)
      .then(function () {
        analyzeVisualGap();
        finalVerdict();
      })
      .catch(function (error) {
        add("verdict", "FAIL", "Gauge runtime failed", "The diagnostic runtime did not complete.", error && error.message ? error.message : "unknown error");
        finalVerdict();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
