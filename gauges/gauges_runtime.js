/* TNT RENEWAL — /gauges/gauges_health_runtime.js
   GAUGES · GENERATION 2 · EARTH COHERENCE DIAGNOSTIC RUNTIME B6

   Adds visual coherence scoring:
   - local JPG existence
   - manifest alignment
   - showroom consumer contract
   - renderer/runtime contract
   - texture entropy / color diversity
   - cloud band dominance / placeholder detection
   - live canvas size / zoom / canvas readback
   - false 100 blocked when Earth looks wrong
*/

(function () {
  "use strict";

  var CONFIG = {
    showroomHtml: "/showroom/index.html",
    earthCanvasJs: "/assets/earth/earth_canvas.js",
    earthRuntimeJs: "/runtime/earth_asset_runtime.js",
    earthManifest: "/assets/earth/earth_manifest.json",
    surfaceJpg: "/assets/earth/earth_surface_2048.jpg",
    cloudsJpg: "/assets/earth/earth_clouds_2048.jpg",
    probeUrl: "/showroom/?dgb_probe=earth_coherence_b6",
    oldViewTerms: [
      "Choose Your View",
      "Earth View",
      "Satellite View",
      "Solar Context",
      "Galaxy Context",
      "Demo Mode"
    ],
    forbiddenSunRuntime: [
      "sun_asset_runtime.js",
      "sun_canvas.js"
    ]
  };

  var report = {
    asset: [],
    consumer: [],
    spine: [],
    control: [],
    coherence: [],
    verdict: [],
    todo: [],
    flags: {
      surface: false,
      clouds: false,
      manifest: false,
      showroomConsumer: false,
      oldViewsRemoved: false,
      noSunRuntime: false,
      canvasScript: false,
      runtimeScript: false,
      canvasBudget: false,
      zoomApi: false,
      runtimeControls: false,
      liveMount: false,
      liveCanvas: false,
      liveControls: false,
      textureCoherent: false,
      cloudsCoherent: false,
      liveGlobeCoherent: false,
      zoomSafe: false
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

  function todo(status, label, detail, code) {
    add("todo", status, label, detail, code);
  }

  function weight(status) {
    if (status === "STRONG") return 100;
    if (status === "INFO") return 88;
    if (status === "WATCH") return 58;
    return 0;
  }

  function score(entries) {
    if (!entries.length) return 100;

    return Math.round(entries.reduce(function (sum, entry) {
      return sum + weight(entry.status);
    }, 0) / entries.length);
  }

  function labelFor(value) {
    if (value >= 90) return "STRONG";
    if (value >= 65) return "WATCH";
    return "FAIL";
  }

  function classFor(value) {
    if (value >= 90) return "strong";
    if (value >= 65) return "watch";
    return "fail";
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = String(value);
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
        label: "No diagnostic row",
        detail: "No row was produced for this section."
      }));
      return;
    }

    entries.forEach(function (entry) {
      target.appendChild(makeItem(entry));
    });
  }

  function fetchText(path) {
    return fetch(path + "?v=earth-coherence-b6-" + Date.now(), {
      cache: "no-store"
    })
      .then(function (response) {
        return response.text().then(function (text) {
          return {
            ok: response.ok,
            status: response.status,
            text: text,
            path: path
          };
        });
      })
      .catch(function (error) {
        return {
          ok: false,
          status: 0,
          text: "",
          path: path,
          error: error && error.message ? error.message : "fetch failed"
        };
      });
  }

  function loadImage(path) {
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
          path: path,
          image: null,
          reason: "timeout"
        });
      }, 5000);

      image.onload = function () {
        finish({
          ok: true,
          path: path,
          image: image,
          width: image.naturalWidth || image.width || 0,
          height: image.naturalHeight || image.height || 0
        });
      };

      image.onerror = function () {
        finish({
          ok: false,
          path: path,
          image: null,
          reason: "load-error"
        });
      };

      image.src = path + "?v=earth-coherence-b6-" + Date.now();
    });
  }

  function analyzeImageStats(image, sampleSize) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    var data;
    var pixels;
    var i;
    var r;
    var g;
    var b;
    var lum;
    var colorBuckets = {};
    var whiteish = 0;
    var blueish = 0;
    var greenish = 0;
    var darkish = 0;
    var edgeSum = 0;
    var flatRuns = 0;
    var lastLum = null;
    var uniqueCount;
    var meanLum = 0;
    var variance = 0;

    sampleSize = sampleSize || 160;
    canvas.width = sampleSize;
    canvas.height = Math.round(sampleSize / 2);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    pixels = data.length / 4;

    for (i = 0; i < data.length; i += 4) {
      r = data[i];
      g = data[i + 1];
      b = data[i + 2];
      lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      meanLum += lum;

      colorBuckets[
        Math.floor(r / 24) + "-" + Math.floor(g / 24) + "-" + Math.floor(b / 24)
      ] = true;

      if (r > 188 && g > 188 && b > 188) whiteish += 1;
      if (b > r + 24 && b > g + 8) blueish += 1;
      if (g > r + 8 && g > b - 5) greenish += 1;
      if (lum < 45) darkish += 1;

      if (lastLum !== null) {
        edgeSum += Math.abs(lum - lastLum);
        if (Math.abs(lum - lastLum) < 2) flatRuns += 1;
      }

      lastLum = lum;
    }

    meanLum = meanLum / pixels;

    for (i = 0; i < data.length; i += 4) {
      lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      variance += Math.pow(lum - meanLum, 2);
    }

    variance = variance / pixels;
    uniqueCount = Object.keys(colorBuckets).length;

    return {
      width: image.naturalWidth || image.width || 0,
      height: image.naturalHeight || image.height || 0,
      uniqueBuckets: uniqueCount,
      meanLum: Math.round(meanLum),
      variance: Math.round(variance),
      edgeAverage: Math.round(edgeSum / Math.max(1, pixels - 1)),
      flatRatio: Math.round((flatRuns / Math.max(1, pixels - 1)) * 100),
      whiteRatio: Math.round((whiteish / pixels) * 100),
      blueRatio: Math.round((blueish / pixels) * 100),
      greenRatio: Math.round((greenish / pixels) * 100),
      darkRatio: Math.round((darkish / pixels) * 100)
    };
  }

  function analyzeAssets() {
    return Promise.all([
      loadImage(CONFIG.surfaceJpg).then(function (result) {
        if (result.ok) {
          var stats = analyzeImageStats(result.image, 180);
          var placeholderRisk = stats.uniqueBuckets < 80 || stats.edgeAverage < 5 || stats.flatRatio > 72;

          report.flags.surface = true;
          add("asset", "STRONG", "Local Earth surface JPG", "Same-origin Earth surface loaded.", result.path + " · " + result.width + "x" + result.height);

          if (!placeholderRisk) {
            report.flags.textureCoherent = true;
            add("coherence", "STRONG", "Surface texture density acceptable", "Surface has enough color and luminance variation for a real-map pass.", JSON.stringify(stats));
          } else {
            add("coherence", "FAIL", "Surface texture reads placeholder/cartoon", "The surface file exists, but its sampled texture is too flat/simple for the visual target.", JSON.stringify(stats));
            todo("FAIL", "Replace Earth surface texture", "Use a real satellite Earth surface JPG instead of a procedural placeholder.", CONFIG.surfaceJpg);
          }
        } else {
          add("asset", "FAIL", "Local Earth surface JPG missing", "The Earth surface JPG is not reachable.", CONFIG.surfaceJpg);
          todo("FAIL", "Create Earth surface JPG", "Create the required same-origin JPG.", CONFIG.surfaceJpg);
        }
      }),

      loadImage(CONFIG.cloudsJpg).then(function (result) {
        if (result.ok) {
          var stats = analyzeImageStats(result.image, 180);
          var bandRisk = stats.uniqueBuckets < 45 || stats.edgeAverage < 3 || stats.flatRatio > 78;
          var cloudTooDark = stats.whiteRatio < 4 && stats.meanLum < 70;

          report.flags.clouds = true;
          add("asset", "STRONG", "Local Earth clouds JPG", "Same-origin Earth cloud map loaded.", result.path + " · " + result.width + "x" + result.height);

          if (!bandRisk && !cloudTooDark) {
            report.flags.cloudsCoherent = true;
            add("coherence", "STRONG", "Cloud texture coherence acceptable", "Cloud file has enough soft variation to support the globe.", JSON.stringify(stats));
          } else {
            add("coherence", "FAIL", "Cloud map reads artificial/banded", "The cloud file exists, but the sampled texture looks too procedural or stripe-like.", JSON.stringify(stats));
            todo("FAIL", "Replace Earth cloud texture", "Use a real cloud map texture instead of generated bands.", CONFIG.cloudsJpg);
          }
        } else {
          add("asset", "FAIL", "Local Earth clouds JPG missing", "The Earth cloud JPG is not reachable.", CONFIG.cloudsJpg);
          todo("FAIL", "Create Earth cloud JPG", "Create the required same-origin JPG.", CONFIG.cloudsJpg);
        }
      }),

      fetchText(CONFIG.earthManifest).then(function (result) {
        if (!result.ok) {
          add("asset", "FAIL", "Earth manifest missing", "The Earth manifest is not reachable.", CONFIG.earthManifest);
          todo("FAIL", "Restore Earth manifest", "Create or repair the Earth manifest.", CONFIG.earthManifest);
          return;
        }

        if (
          result.text.indexOf("earth_surface_2048.jpg") !== -1 &&
          result.text.indexOf("earth_clouds_2048.jpg") !== -1
        ) {
          report.flags.manifest = true;
          add("asset", "STRONG", "Earth manifest points to local JPG assets", "Manifest uses the required local JPG paths.", CONFIG.earthManifest);
        } else {
          add("asset", "FAIL", "Earth manifest asset mismatch", "Manifest does not point to both required JPG assets.", CONFIG.earthManifest);
          todo("FAIL", "Repair Earth manifest", "Manifest must point to earth_surface_2048.jpg and earth_clouds_2048.jpg.", CONFIG.earthManifest);
        }
      })
    ]);
  }

  function analyzeShowroom(result) {
    var text = result.text || "";
    var oldViewsFound;
    var sunRuntimeFound;

    if (!result.ok) {
      add("consumer", "FAIL", "Showroom source unreachable", "Could not fetch showroom source.", CONFIG.showroomHtml);
      todo("FAIL", "Repair showroom source", "Showroom must be reachable.", CONFIG.showroomHtml);
      return;
    }

    add("consumer", "STRONG", "Showroom source reachable", "Showroom source returned successfully.", CONFIG.showroomHtml);

    if (text.indexOf("data-dgb-earth-mount") !== -1) {
      report.flags.showroomConsumer = true;
      add("consumer", "STRONG", "Earth mount declared", "Showroom exposes the Earth Asset Spine mount.", "data-dgb-earth-mount");
    } else {
      add("consumer", "FAIL", "Earth mount missing", "Showroom is not consuming the Earth Asset Spine.", "data-dgb-earth-mount");
      todo("FAIL", "Restore Earth mount", "Showroom must include one Earth mount.", "<div data-dgb-earth-mount></div>");
    }

    if (text.indexOf("/assets/earth/earth_canvas.js") !== -1) {
      report.flags.canvasScript = true;
      add("consumer", "STRONG", "Earth canvas script loaded", "Showroom loads the Earth renderer spine.", "/assets/earth/earth_canvas.js");
    } else {
      add("consumer", "FAIL", "Earth canvas script missing", "Showroom does not load the Earth renderer spine.", "/assets/earth/earth_canvas.js");
      todo("FAIL", "Load Earth canvas script", "Add the Earth canvas spine script to showroom.", "/assets/earth/earth_canvas.js");
    }

    if (text.indexOf("/runtime/earth_asset_runtime.js") !== -1) {
      report.flags.runtimeScript = true;
      add("consumer", "STRONG", "Earth runtime script loaded", "Showroom loads the Earth runtime/control spine.", "/runtime/earth_asset_runtime.js");
    } else {
      add("consumer", "FAIL", "Earth runtime script missing", "Showroom does not load Earth runtime.", "/runtime/earth_asset_runtime.js");
      todo("FAIL", "Load Earth runtime script", "Add Earth runtime to showroom.", "/runtime/earth_asset_runtime.js");
    }

    oldViewsFound = CONFIG.oldViewTerms.filter(function (term) {
      return text.indexOf(term) !== -1;
    });

    if (!oldViewsFound.length) {
      report.flags.oldViewsRemoved = true;
      add("consumer", "STRONG", "Old view bubbles absent", "Old explanatory view controls are not present in source.");
    } else {
      add("consumer", "FAIL", "Old view bubbles still present", "Remove old view-label controls from showroom.", oldViewsFound.join(", "));
      todo("FAIL", "Remove old view controls", "Delete the old view-bubble controls from showroom.", oldViewsFound.join(", "));
    }

    sunRuntimeFound = CONFIG.forbiddenSunRuntime.filter(function (term) {
      return text.indexOf(term) !== -1;
    });

    if (!sunRuntimeFound.length) {
      report.flags.noSunRuntime = true;
      add("consumer", "STRONG", "No active Sun runtime", "Showroom does not load active Sun renderer scripts.");
    } else {
      add("consumer", "FAIL", "Sun runtime contamination", "Showroom still references active Sun runtime scripts.", sunRuntimeFound.join(", "));
      todo("FAIL", "Remove Sun runtime from showroom", "Showroom Sun must remain CSS-only.", sunRuntimeFound.join(", "));
    }
  }

  function analyzeCanvas(result) {
    var text = result.text || "";

    if (!result.ok) {
      add("spine", "FAIL", "Earth canvas file unreachable", "Could not fetch Earth canvas renderer.", CONFIG.earthCanvasJs);
      todo("FAIL", "Restore Earth canvas file", "Create or repair the Earth renderer file.", CONFIG.earthCanvasJs);
      return;
    }

    add("spine", "STRONG", "Earth canvas file reachable", "Earth canvas renderer returned successfully.", CONFIG.earthCanvasJs);

    if (text.indexOf("window.DGBEarthCanvas") !== -1 && text.indexOf("createEarthRenderer") !== -1) {
      add("spine", "STRONG", "Renderer factory present", "Earth renderer exposes its factory.");
    } else {
      add("spine", "FAIL", "Renderer factory missing", "Earth canvas does not expose the expected renderer factory.", "window.DGBEarthCanvas.create");
      todo("FAIL", "Restore renderer factory", "Earth canvas must expose window.DGBEarthCanvas.create.");
    }

    if (text.indexOf("targetFrameMs") !== -1) {
      report.flags.canvasBudget = true;
      add("spine", "STRONG", "Frame budget present", "Render budget belongs in Earth canvas and is present.", "targetFrameMs");
    } else {
      add("spine", "FAIL", "Frame budget missing", "Earth canvas does not expose targetFrameMs.", "targetFrameMs");
      todo("FAIL", "Restore render budget", "Add targetFrameMs to earth_canvas.js.");
    }

    if (text.indexOf("setZoom") !== -1 && text.indexOf("zoomIn") !== -1 && text.indexOf("zoomOut") !== -1) {
      report.flags.zoomApi = true;
      add("spine", "STRONG", "Zoom API present", "Earth renderer exposes setZoom, zoomIn, and zoomOut.");
    } else {
      add("spine", "FAIL", "Zoom API missing", "Earth renderer does not expose full zoom API.", "setZoom / zoomIn / zoomOut");
      todo("FAIL", "Restore zoom API", "Earth canvas must expose setZoom, zoomIn, and zoomOut.");
    }

    if (text.indexOf("earth_surface_2048.jpg") !== -1 && text.indexOf("earth_clouds_2048.jpg") !== -1) {
      add("spine", "STRONG", "Renderer points to JPG assets", "Earth canvas references the required JPG asset paths.");
    } else {
      add("spine", "FAIL", "Renderer JPG references missing", "Earth canvas does not reference both required JPG assets.", "earth_surface_2048.jpg / earth_clouds_2048.jpg");
      todo("FAIL", "Point renderer to JPG assets", "Earth canvas must default to the required JPG file paths.");
    }
  }

  function analyzeRuntime(result) {
    var text = result.text || "";

    if (!result.ok) {
      add("control", "FAIL", "Earth runtime file unreachable", "Could not fetch Earth runtime.", CONFIG.earthRuntimeJs);
      todo("FAIL", "Restore Earth runtime", "Create or repair the Earth runtime file.", CONFIG.earthRuntimeJs);
      return;
    }

    add("control", "STRONG", "Earth runtime file reachable", "Earth runtime returned successfully.", CONFIG.earthRuntimeJs);

    if (text.indexOf("window.DGBEarthAsset") !== -1) {
      add("control", "STRONG", "Runtime global present", "Runtime exposes DGBEarthAsset.");
    } else {
      add("control", "FAIL", "Runtime global missing", "Runtime does not expose DGBEarthAsset.", "window.DGBEarthAsset");
      todo("FAIL", "Expose runtime global", "Runtime must expose window.DGBEarthAsset.");
    }

    if (text.indexOf("data-dgb-earth-controls") !== -1 && text.indexOf("dgb-earth-control-panel") !== -1) {
      report.flags.runtimeControls = true;
      add("control", "STRONG", "Runtime control panel present", "Runtime injects the Earth control panel.");
    } else {
      add("control", "FAIL", "Runtime control panel missing", "Runtime does not inject Earth controls.", "data-dgb-earth-controls");
      todo("FAIL", "Restore runtime controls", "Runtime must inject the Earth zoom controls.");
    }

    if (
      text.indexOf("Zoom Out") !== -1 &&
      text.indexOf("Zoom In") !== -1 &&
      text.indexOf("Reset Earth") !== -1
    ) {
      add("control", "STRONG", "Control labels present", "Zoom and reset labels are present in runtime.");
    } else {
      add("control", "FAIL", "Control labels missing", "Runtime does not contain the expected control labels.", "Zoom Out / Zoom In / Reset Earth");
      todo("FAIL", "Restore control labels", "Runtime must include Zoom Out, Zoom In, Reset Earth, and Pause Spin.");
    }
  }

  function analyzeLiveCanvasPixels(canvas) {
    var ctx;
    var sampleCanvas;
    var sampleCtx;
    var stats;

    try {
      ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("no context");

      sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = 120;
      sampleCanvas.height = 120;
      sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
      sampleCtx.drawImage(canvas, 0, 0, 120, 120);

      stats = analyzeImageStats(sampleCanvas, 120);

      if (stats.uniqueBuckets >= 70 && stats.edgeAverage >= 4 && stats.flatRatio <= 76) {
        report.flags.liveGlobeCoherent = true;
        add("coherence", "WATCH", "Live globe has measurable texture", "Live canvas has measurable variation, but final visual still requires human inspection.", JSON.stringify(stats));
      } else {
        add("coherence", "FAIL", "Live globe reads too flat/cartooned", "Live canvas exists, but pixel coherence shows insufficient texture variation.", JSON.stringify(stats));
        todo("FAIL", "Repair live globe visual coherence", "Replace placeholder assets or tune projection/cloud compositing until the live canvas reads as Earth.");
      }
    } catch (error) {
      add("coherence", "WATCH", "Live canvas pixel read unavailable", "Canvas exists, but pixel-level live readback failed.", error && error.message ? error.message : "unknown");
    }
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
        add("control", "WATCH", "Live probe missing", "No showroom probe iframe exists.");
        finish();
        return;
      }

      iframe.addEventListener("load", function () {
        window.setTimeout(function () {
          var doc;
          var mount;
          var canvas;
          var controls;
          var zoomValue;

          try {
            doc = iframe.contentDocument || iframe.contentWindow.document;
          } catch (error) {
            add("control", "FAIL", "Live probe blocked", "Could not inspect live showroom DOM.");
            finish();
            return;
          }

          mount = doc.querySelector("[data-dgb-earth-mount]");
          canvas = doc.querySelector("[data-dgb-earth-canvas], #earthCanvas");
          controls = doc.querySelector("[data-dgb-earth-controls]");

          if (mount) {
            report.flags.liveMount = true;
            add("control", "STRONG", "Live Earth mount found", "Live showroom exposes Earth mount.");
          } else {
            add("control", "FAIL", "Live Earth mount missing", "Live showroom does not expose Earth mount.");
          }

          if (canvas && canvas.clientWidth > 50 && canvas.clientHeight > 50) {
            report.flags.liveCanvas = true;
            add("control", "STRONG", "Live Earth canvas found", "Runtime created measurable Earth canvas.", Math.round(canvas.clientWidth) + "x" + Math.round(canvas.clientHeight));
            analyzeLiveCanvasPixels(canvas);
          } else {
            add("control", "WATCH", "Live Earth canvas not confirmed", "Runtime canvas was not measurable during probe.");
            add("coherence", "FAIL", "Live globe canvas not measurable", "Coherence cannot pass without a measurable live canvas.");
          }

          if (controls) {
            report.flags.liveControls = true;
            add("control", "STRONG", "Live zoom controls found", "Runtime injected the zoom control panel.");
          } else {
            add("control", "FAIL", "Live zoom controls missing", "Runtime did not inject the zoom control panel.");
          }

          if (mount) {
            zoomValue = Number(mount.getAttribute("data-earth-zoom") || "1");
            if (Number.isFinite(zoomValue) && zoomValue >= 0.72 && zoomValue <= 1.38) {
              report.flags.zoomSafe = true;
              add("coherence", "STRONG", "Zoom within renderer bounds", "Live zoom is inside the declared safe range.", String(zoomValue));
            } else {
              add("coherence", "FAIL", "Zoom outside safe range", "Live zoom is missing or outside the declared safe renderer bounds.", String(zoomValue));
              todo("FAIL", "Repair zoom state", "Runtime should expose a valid data-earth-zoom between 0.72 and 1.38.");
            }
          }

          finish();
        }, 1400);
      }, { once: true });

      iframe.src = CONFIG.probeUrl + "&t=" + Date.now();

      window.setTimeout(function () {
        add("control", "WATCH", "Probe timeout", "Showroom probe did not complete quickly.");
        add("coherence", "WATCH", "Live coherence probe timeout", "Live visual coherence could not fully complete in time.");
        finish();
      }, 7500);
    });
  }

  function finalize() {
    var assetScore = score(report.asset);
    var consumerScore = score(report.consumer);
    var spineScore = Math.round((score(report.spine) * 0.62) + (score(report.control) * 0.38));
    var coherenceScore = score(report.coherence);
    var verdictScore = Math.round((assetScore * 0.20) + (consumerScore * 0.20) + (spineScore * 0.25) + (coherenceScore * 0.35));
    var driftScore = Math.max(0, 100 - verdictScore);
    var blocker = "projection-math";
    var status = labelFor(verdictScore);
    var statusNode = $("overallStatus");

    if (!report.flags.surface || !report.flags.clouds || !report.flags.manifest) {
      blocker = "asset-control";
    } else if (!report.flags.showroomConsumer || !report.flags.canvasScript || !report.flags.runtimeScript || !report.flags.oldViewsRemoved || !report.flags.noSunRuntime) {
      blocker = "showroom-consumer-contract";
    } else if (!report.flags.canvasBudget || !report.flags.zoomApi) {
      blocker = "earth-renderer-spine";
    } else if (!report.flags.runtimeControls || !report.flags.liveControls) {
      blocker = "runtime-control-panel";
    } else if (!report.flags.textureCoherent || !report.flags.cloudsCoherent || !report.flags.liveGlobeCoherent) {
      blocker = "globe-visual-coherence";
    } else {
      blocker = "projection-math";
      todo("WATCH", "Tune projection math", "The remaining work should target spherical wrap, orientation, cloud opacity, axis, and zoom radius.");
    }

    if (blocker === "globe-visual-coherence" && verdictScore > 79) {
      verdictScore = 79;
      status = "WATCH";
      driftScore = 21;
    }

    if (blocker !== "projection-math" && verdictScore > 89) {
      verdictScore = 89;
      status = "WATCH";
      driftScore = 11;
    }

    setText("verdictScore", verdictScore);
    setText("assetScore", assetScore);
    setText("consumerScore", consumerScore);
    setText("spineScore", spineScore);
    setText("coherenceScore", coherenceScore);
    setText("driftScore", driftScore);

    setText("verdictNote", status);
    setText("assetNote", labelFor(assetScore));
    setText("consumerNote", labelFor(consumerScore));
    setText("spineNote", labelFor(spineScore));
    setText("coherenceNote", labelFor(coherenceScore));
    setText("driftNote", driftScore <= 10 ? "LOW" : driftScore <= 35 ? "WATCH" : "HIGH");

    if (statusNode) {
      statusNode.className = "status " + classFor(verdictScore);
      statusNode.textContent = status + " · PRIMARY BLOCKER: " + blocker.toUpperCase();
    }

    if (blocker === "asset-control") {
      setText("statusHeadline", "Asset control is the blocker.");
    } else if (blocker === "showroom-consumer-contract") {
      setText("statusHeadline", "Showroom consumer contract is the blocker.");
    } else if (blocker === "earth-renderer-spine") {
      setText("statusHeadline", "Earth renderer spine is the blocker.");
    } else if (blocker === "runtime-control-panel") {
      setText("statusHeadline", "Runtime control panel is the blocker.");
    } else if (blocker === "globe-visual-coherence") {
      setText("statusHeadline", "Globe visual coherence is the blocker.");
    } else {
      setText("statusHeadline", "Projection math is now the blocker.");
    }

    add("verdict", status, "Primary blocker", "The current most likely blocker is " + blocker + ".", blocker);

    renderList("verdictList", report.verdict);
    renderList("assetLedger", report.asset);
    renderList("consumerLedger", report.consumer);
    renderList("spineLedger", report.spine);
    renderList("controlLedger", report.control);
    renderList("coherenceLedger", report.coherence);
    renderList("todoList", report.todo);
  }

  function boot() {
    Promise.all([
      analyzeAssets(),
      fetchText(CONFIG.showroomHtml).then(analyzeShowroom),
      fetchText(CONFIG.earthCanvasJs).then(analyzeCanvas),
      fetchText(CONFIG.earthRuntimeJs).then(analyzeRuntime)
    ])
      .then(analyzeProbe)
      .then(finalize)
      .catch(function (error) {
        add("verdict", "FAIL", "Gauge runtime failed", "Diagnostic runtime failed before completion.", error && error.message ? error.message : "unknown error");
        finalize();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
