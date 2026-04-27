/* TNT RENEWAL — /gauges/gauges_health_runtime.js
   GAUGES · GENERATION 2 · EARTH SHOWROOM DIAGNOSTIC B1

   PURPOSE:
     - Diagnose showroom Earth problem directly.
     - Check source availability.
     - Check renderer control ownership.
     - Check if Earth is canvas-rendered, not CSS-pasted flat.
     - Check real cloud map contract.
     - Check sun runtime absence from showroom.
     - Check mobile budget markers.
*/

(function () {
  "use strict";

  var REQUIRED = {
    showroom: "/showroom/",
    showroomSource: "/showroom/index.html",
    earthTexture: "land_ocean_ice_2048.jpg",
    cloudTexture: "cloud_combined_2048.jpg",
    expectedShowroomVersion: "generation-2-earth-renderer-stabilized-b7",
    expectedRenderer: "single-canvas-capped-orthographic-wrap",
    forbiddenSunRuntime: "/runtime/sun_asset_runtime.js",
    forbiddenSunCanvas: "/assets/sun/sun_canvas.js"
  };

  var state = {
    source: [],
    earth: [],
    control: [],
    todo: [],
    scores: {
      earth: 0,
      control: 0,
      budget: 0,
      drift: 100
    }
  };

  function $(id) {
    return document.getElementById(id);
  }

  function add(bucket, label, detail, status) {
    state[bucket].push({
      label: label,
      detail: detail,
      status: status
    });
  }

  function item(entry) {
    var node = document.createElement("div");
    var strong = document.createElement("strong");
    var span = document.createElement("span");

    node.className = "item";
    node.setAttribute("data-state", entry.status);

    strong.textContent = entry.status + " · " + entry.label;
    span.textContent = entry.detail;

    node.appendChild(strong);
    node.appendChild(span);

    return node;
  }

  function renderList(id, entries) {
    var target = $(id);
    if (!target) return;

    target.textContent = "";

    if (!entries.length) {
      target.appendChild(item({
        status: "STRONG",
        label: "No issue detected",
        detail: "No blocking issue was found in this section."
      }));
      return;
    }

    entries.forEach(function (entry) {
      target.appendChild(item(entry));
    });
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = value;
  }

  function statusClass(score) {
    if (score >= 90) return "strong";
    if (score >= 65) return "watch";
    return "fail";
  }

  function statusLabel(score) {
    if (score >= 90) return "STRONG";
    if (score >= 65) return "WATCH";
    return "FAIL";
  }

  function scoreFrom(entries) {
    if (!entries.length) return 100;

    var strong = entries.filter(function (e) { return e.status === "STRONG"; }).length;
    var watch = entries.filter(function (e) { return e.status === "WATCH"; }).length;
    var fail = entries.filter(function (e) { return e.status === "FAIL"; }).length;
    var total = entries.length;

    return Math.max(0, Math.round(((strong * 100) + (watch * 58) + (fail * 0)) / total));
  }

  function sourceFetch(path, markers) {
    return fetch(path + "?v=earth-showroom-diagnostic-b1", { cache: "no-store" })
      .then(function (res) {
        return res.text().then(function (text) {
          var missing = markers.filter(function (marker) {
            return text.indexOf(marker) === -1;
          });

          if (!res.ok) {
            add("source", path, "Source did not return OK status.", "FAIL");
            return "";
          }

          if (missing.length) {
            add("source", path, "Missing marker(s): " + missing.join(", "), "WATCH");
          } else {
            add("source", path, "Required marker set present.", "STRONG");
          }

          return text;
        });
      })
      .catch(function () {
        add("source", path, "Source could not be fetched.", "FAIL");
        return "";
      });
  }

  function checkShowroomSource(text) {
    if (!text) return;

    if (text.indexOf(REQUIRED.expectedShowroomVersion) !== -1) {
      add("earth", "Showroom version", "Current showroom declares Earth Renderer Stabilized B7.", "STRONG");
    } else {
      add("earth", "Showroom version", "Showroom does not declare the stabilized Earth renderer version.", "FAIL");
      state.todo.push({
        status: "FAIL",
        label: "Update showroom contract marker",
        detail: "The gauges expect generation-2-earth-renderer-stabilized-b7."
      });
    }

    if (text.indexOf(REQUIRED.expectedRenderer) !== -1) {
      add("earth", "Renderer contract", "Showroom declares single-canvas capped orthographic wrap.", "STRONG");
    } else {
      add("earth", "Renderer contract", "No proof that Earth is rendered by the intended spherical-wrap canvas.", "FAIL");
      state.todo.push({
        status: "FAIL",
        label: "Restore spherical-wrap renderer",
        detail: "The page must use a single canvas renderer, not a flat CSS background circle."
      });
    }

    if (text.indexOf(REQUIRED.earthTexture) !== -1) {
      add("earth", "Real Earth surface texture", "Earth surface source is present in showroom code.", "STRONG");
    } else {
      add("earth", "Real Earth surface texture", "Earth surface texture marker is missing.", "FAIL");
      state.todo.push({
        status: "FAIL",
        label: "Restore real Earth texture",
        detail: "The surface must use the real land/ocean/ice source."
      });
    }

    if (text.indexOf(REQUIRED.cloudTexture) !== -1) {
      add("earth", "Real cloud map", "Cloud map source is present in showroom code.", "STRONG");
    } else {
      add("earth", "Real cloud map", "Cloud map marker is missing.", "WATCH");
      state.todo.push({
        status: "WATCH",
        label: "Restore real cloud layer",
        detail: "Clouds should come from a real cloud map, not procedural universe clouds."
      });
    }

    if (text.indexOf(REQUIRED.forbiddenSunRuntime) === -1 && text.indexOf(REQUIRED.forbiddenSunCanvas) === -1) {
      add("control", "Sun runtime ownership", "Showroom does not load the active Compass sun runtime.", "STRONG");
    } else {
      add("control", "Sun runtime ownership", "Showroom still loads active sun runtime assets. This risks duplicate renderer ownership.", "FAIL");
      state.todo.push({
        status: "FAIL",
        label: "Remove active sun runtime from showroom",
        detail: "Earth is the only active renderer on the showroom. The sun should be CSS-only here."
      });
    }

    if (text.indexOf("targetFrameMs") !== -1 && text.indexOf("single active renderer") !== -1) {
      add("control", "Budget contract", "Showroom includes capped render-loop intent.", "STRONG");
    } else if (text.indexOf("targetFrameMs") !== -1) {
      add("control", "Budget contract", "Frame cap exists, but single-renderer language is not explicit.", "WATCH");
    } else {
      add("control", "Budget contract", "No frame-cap marker found.", "FAIL");
      state.todo.push({
        status: "FAIL",
        label: "Cap render budget",
        detail: "The Earth renderer should not redraw at full unbounded mobile rate."
      });
    }
  }

  function checkIframeProbe() {
    var iframe = $("showroomProbe");

    return new Promise(function (resolve) {
      var done = false;

      function finish() {
        if (done) return;
        done = true;
        resolve();
      }

      if (!iframe) {
        add("control", "Visual probe", "Showroom iframe probe is missing.", "WATCH");
        finish();
        return;
      }

      iframe.addEventListener("load", function () {
        var doc;
        var root;
        var canvas;
        var controller;
        var sunRuntimeScripts;
        var activeViewButtons;

        try {
          doc = iframe.contentDocument || iframe.contentWindow.document;
        } catch (error) {
          add("control", "Visual probe", "Could not access same-origin showroom probe.", "FAIL");
          finish();
          return;
        }

        root = doc.querySelector("[data-showroom-root]");
        canvas = doc.querySelector("#earthCanvas");
        controller = doc.querySelector("#earthController");
        activeViewButtons = doc.querySelectorAll("[data-view]");
        sunRuntimeScripts = Array.prototype.slice.call(doc.scripts || []).filter(function (script) {
          return script.src && (
            script.src.indexOf("sun_asset_runtime.js") !== -1 ||
            script.src.indexOf("sun_canvas.js") !== -1
          );
        });

        if (root) {
          add("control", "Showroom DOM root", "Showroom root is visible to same-origin gauge probe.", "STRONG");
        } else {
          add("control", "Showroom DOM root", "Showroom root was not found in probe.", "FAIL");
        }

        if (canvas && canvas.clientWidth > 40 && canvas.clientHeight > 40) {
          add("earth", "Earth canvas", "Earth canvas exists and has measurable dimensions.", "STRONG");
        } else {
          add("earth", "Earth canvas", "Earth canvas is missing or not measurable.", "FAIL");
          state.todo.push({
            status: "FAIL",
            label: "Restore measurable Earth canvas",
            detail: "The globe must be rendered through #earthCanvas."
          });
        }

        if (controller) {
          add("control", "Manual spin controller", "Earth controller exists for manual drag/spin.", "STRONG");
        } else {
          add("control", "Manual spin controller", "Manual drag controller is missing.", "FAIL");
        }

        if (activeViewButtons.length >= 5) {
          add("control", "View controls", "Public view controls are present.", "STRONG");
        } else {
          add("control", "View controls", "Expected public view controls are missing.", "WATCH");
        }

        if (!sunRuntimeScripts.length) {
          add("control", "Duplicate renderer scripts", "No active sun renderer scripts detected in showroom probe.", "STRONG");
        } else {
          add("control", "Duplicate renderer scripts", "Active sun renderer script is still loaded in showroom.", "FAIL");
        }

        finish();
      }, { once: true });

      window.setTimeout(function () {
        add("control", "Visual probe timeout", "Showroom probe did not complete quickly. Possible runtime or load-budget issue.", "WATCH");
        finish();
      }, 4500);
    });
  }

  function finalize() {
    var overall;
    var statusNode;

    state.scores.earth = scoreFrom(state.earth);
    state.scores.control = scoreFrom(state.control);
    state.scores.budget = Math.round((state.scores.control * 0.7) + (state.scores.earth * 0.3));
    state.scores.drift = Math.max(0, 100 - Math.round((state.scores.earth + state.scores.control + state.scores.budget) / 3));

    overall = Math.round((state.scores.earth + state.scores.control + state.scores.budget) / 3);

    setText("earthScore", state.scores.earth);
    setText("controlScore", state.scores.control);
    setText("budgetScore", state.scores.budget);
    setText("driftScore", state.scores.drift);

    statusNode = $("overallStatus");
    if (statusNode) {
      statusNode.className = "status " + statusClass(overall);
      statusNode.textContent = statusLabel(overall);
    }

    if (overall >= 90) {
      setText("statusHeadline", "Earth renderer is structurally stable.");
      state.todo.push({
        status: "STRONG",
        label: "Refine visual target only",
        detail: "Structure is not the blocker. Continue visual tuning: Americas orientation, cloud density, limb darkening, and axis feel."
      });
    } else if (overall >= 65) {
      setText("statusHeadline", "Earth renderer is close, but the control path is still muddy.");
    } else {
      setText("statusHeadline", "Earth renderer has a structural/control problem.");
    }

    renderList("verdictList", [
      {
        status: statusLabel(overall),
        label: "Diagnostic result",
        detail: "Earth " + state.scores.earth + " · Control " + state.scores.control + " · Budget " + state.scores.budget + " · Drift " + state.scores.drift
      }
    ]);

    renderList("earthLedger", state.earth);
    renderList("controlLedger", state.control);
    renderList("sourceLedger", state.source);
    renderList("todoList", state.todo);
  }

  function boot() {
    sourceFetch(REQUIRED.showroomSource, [
      "data-showroom-version",
      "data-earth-renderer",
      "data-earth-clouds"
    ])
      .then(function (text) {
        checkShowroomSource(text);
        return checkIframeProbe();
      })
      .then(finalize)
      .catch(function () {
        add("source", "Gauge runtime", "Gauge runtime failed before completion.", "FAIL");
        finalize();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
