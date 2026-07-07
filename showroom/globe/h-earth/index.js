// /showroom/globe/h-earth/index.js
// FULL-FILE REPLACEMENT
// H_EARTH_3D_CANDIDATE_PREVIEW_BRIDGE_STEP_017A_v1
//
// Purpose:
// Turns the existing H-Earth route page into a matrix-backed,
// inspectable 3D-candidate preview surface.
//
// This file does not claim final renderer activation, visual validation,
// production validation, open-world traversal, survival simulation,
// manor interior access, distant traversal, swimming, WebGL activation,
// matrix collapse, or final 3D completion.
//
// It is an aggressive bridge step:
// - keeps the current beach page alive
// - moves active route behavior out of monolithic HTML
// - connects the visible page to h-earth-3d source modules
// - creates selectable inspection targets
// - returns governed Ground Condition Read status
// - prepares the route for later true 3D/WebGL upgrade

(function () {
  "use strict";

  var CONTRACT = "H_EARTH_3D_CANDIDATE_PREVIEW_BRIDGE_STEP_017A_v1";
  var ROUTE = "/showroom/globe/h-earth/";
  var SOURCE_ROOT = "/h-earth-3d/";

  var MODULE_PATHS = Object.freeze({
    manifest: SOURCE_ROOT + "h-earth.manifest.js",
    matrix: SOURCE_ROOT + "h-earth.matrix.js",
    state: SOURCE_ROOT + "h-earth.state.js",
    receipts: SOURCE_ROOT + "h-earth.receipts.js",
    objects: SOURCE_ROOT + "objects/ground-cell-001.objects.js",
    zones: SOURCE_ROOT + "zones/ground-cell-001.zones.js",
    action: SOURCE_ROOT + "actions/inspect-ground.js",
    readout: SOURCE_ROOT + "readouts/ground-condition-read.js",
    boundaries: SOURCE_ROOT + "boundaries/matrix-boundaries.js",
    renderPlaceholder: SOURCE_ROOT + "render/render-placeholder.js",
    integrity: SOURCE_ROOT + "h-earth.integrity.js",
    harness: SOURCE_ROOT + "h-earth.non-rendering-harness.js"
  });

  var TARGETS = Object.freeze([
    Object.freeze({
      id: "OBJ_002_FOREGROUND_WET_SAND",
      label: "Wet Sand",
      shortLabel: "Sand",
      zone: "ZONE_001_FOREGROUND_INSPECTION_ZONE",
      layer: "earth",
      role: "Primary inspection target",
      summary: "Foreground wet sand anchors the first H-Earth ground inspection.",
      readout: "Surface condition: wet, grounded, inspectable. The foreground is the first lawful survival contact point.",
      x: 50,
      y: 82
    }),
    Object.freeze({
      id: "OBJ_005_SHORELINE_FOAM_LINE",
      label: "Foam Line",
      shortLabel: "Foam",
      zone: "ZONE_002_SHORELINE_CONTACT_ZONE",
      layer: "earth-water-contact",
      role: "Supporting inspection target",
      summary: "The foam line marks the live contact boundary between earth and water.",
      readout: "Contact condition: active boundary. Water reaches the ground but does not authorize swimming or traversal.",
      x: 53,
      y: 69
    }),
    Object.freeze({
      id: "OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES",
      label: "Tide Pools",
      shortLabel: "Pools",
      zone: "ZONE_002_SHORELINE_CONTACT_ZONE",
      layer: "water-earth-contact",
      role: "Supporting inspection target",
      summary: "Reflective tide pools preserve shoreline detail and local water evidence.",
      readout: "Local water condition: shallow reflective pooling. Inspection allowed; fluid simulation not claimed.",
      x: 28,
      y: 74
    }),
    Object.freeze({
      id: "OBJ_010_SMALL_BEACH_STONES",
      label: "Small Stones",
      shortLabel: "Stones",
      zone: "ZONE_001_FOREGROUND_INSPECTION_ZONE",
      layer: "earth",
      role: "Supporting inspection target",
      summary: "Small stones add ground texture and scale evidence.",
      readout: "Ground texture condition: small stone scatter present. Object inspection allowed; collection mechanics not active.",
      x: 72,
      y: 84
    }),
    Object.freeze({
      id: "OBJ_011_FOREGROUND_JAGGED_ROCKS",
      label: "Jagged Rocks",
      shortLabel: "Rocks",
      zone: "ZONE_001_FOREGROUND_INSPECTION_ZONE",
      layer: "earth",
      role: "Supporting inspection target",
      summary: "Jagged rocks define foreground obstruction, edge, and survival caution.",
      readout: "Obstacle condition: jagged foreground rock edge. Inspection allowed; climbing/traversal not active.",
      x: 16,
      y: 86
    }),
    Object.freeze({
      id: "OBJ_009_MANOR_EXTERIOR_CONTEXT",
      label: "Manor Exterior",
      shortLabel: "Manor",
      zone: "ZONE_004_MANOR_CONTEXT_ZONE",
      layer: "hearth-context",
      role: "Context object only",
      summary: "The manor remains Hearth support/control context only.",
      readout: "Context condition: manor exterior visible only. Interior access is not authorized.",
      x: 84,
      y: 55
    }),
    Object.freeze({
      id: "OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS",
      label: "Distant Islets",
      shortLabel: "Islets",
      zone: "ZONE_005_DISTANT_WORLD_CONTEXT_ZONE",
      layer: "audralia-context",
      role: "Distant context only",
      summary: "Distant rock stacks and islets preserve Audralia/world context without traversal.",
      readout: "Distance condition: world context visible. Distant traversal is not authorized.",
      x: 20,
      y: 48
    }),
    Object.freeze({
      id: "AIR_HAZE_LIGHT_FIELD",
      label: "Air / Haze Field",
      shortLabel: "Air",
      zone: "ZONE_003_WATER_SURFACE_ZONE",
      layer: "air",
      role: "Environmental context",
      summary: "Air owns the upper field: light, haze, atmosphere, and breath.",
      readout: "Atmospheric condition: light and haze present. Air is represented as environmental context, not a weather simulator.",
      x: 61,
      y: 24
    })
  ]);

  var BOUNDARY_STATUS = Object.freeze({
    hEarth: "Ground-View Matrix",
    hearth: "support/control context only",
    audralia: "planetary-world context only",
    matrixCollapse: false,
    publicRouteIntegrationCandidate: true,
    threeDCandidatePreview: true,
    finalRendererActivationClaim: false,
    webglActivationClaim: false,
    canvasActivationClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    openWorldTraversal: false,
    survivalSimulation: false,
    swimming: false,
    manorInterior: false,
    distantTraversal: false
  });

  var state = {
    modules: Object.create(null),
    moduleErrors: Object.create(null),
    modulesLoaded: false,
    bridgeReady: false,
    selectedTargetId: "OBJ_002_FOREGROUND_WET_SAND",
    motionOn: true,
    detailEnhanced: false,
    viewResetCount: 0,
    inspections: 0,
    bootedAt: new Date().toISOString()
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setDataset(node, key, value) {
    if (!node || !node.dataset) return;
    node.dataset[key] = String(value);
  }

  function setText(node, value) {
    if (node) node.textContent = String(value);
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getTarget(targetId) {
    return TARGETS.find(function (target) {
      return target.id === targetId;
    }) || TARGETS[0];
  }

  function markDocument(extra) {
    var markers = Object.assign({
      route: ROUTE,
      contract: CONTRACT,
      page: "h-earth-survival-path",
      role: "h-earth-3d-candidate-preview-bridge",
      matrix: "H-Earth",
      matrixRole: "Ground-View Matrix",
      activeCell: "H_EARTH_GROUND_CELL_001",
      sceneIdentity: "earth-water-air-survival-shoreline-manor",
      firstAction: "Inspect Ground",
      firstReadout: "Ground Condition Read",
      selectedTarget: state.selectedTargetId,
      bridgeReady: state.bridgeReady ? "true" : "false",
      modulesLoaded: state.modulesLoaded ? "true" : "false",
      threeDCandidatePreview: "true",
      matrixBackedInspection: "true",
      hEarthGroundViewMatrix: "true",
      hearthSupportContextOnly: "true",
      audraliaPlanetaryWorldContextOnly: "true",
      matrixCollapse: "false",
      webglActivationClaim: "false",
      canvasActivationClaim: "false",
      finalRendererActivationClaim: "false",
      visualPassClaim: "false",
      validationClaim: "false",
      survivalSimulation: "false",
      openWorldTraversal: "false",
      manorInterior: "false",
      distantTraversal: "false"
    }, extra || {});

    Object.keys(markers).forEach(function (key) {
      setDataset(document.documentElement, key, markers[key]);
      setDataset(document.body, key, markers[key]);
    });
  }

  function injectStyles() {
    if (byId("hEarth3DCandidateBridgeStyles")) return;

    var style = document.createElement("style");
    style.id = "hEarth3DCandidateBridgeStyles";
    style.textContent = `
      .h-earth-bridge-targets{
        position:absolute;
        inset:0;
        z-index:16;
        pointer-events:none;
      }

      .h-earth-inspection-target{
        position:absolute;
        left:calc(var(--target-x,50) * 1%);
        top:calc(var(--target-y,50) * 1%);
        transform:translate(-50%,-50%);
        width:2.7rem;
        height:2.7rem;
        border:1px solid rgba(255,244,216,.55);
        border-radius:999px;
        background:
          radial-gradient(circle at 35% 25%,rgba(255,255,255,.90),transparent 20%),
          radial-gradient(circle,rgba(158,240,191,.70),rgba(141,216,255,.38) 48%,rgba(3,7,17,.80) 72%);
        box-shadow:
          0 0 0 .35rem rgba(158,240,191,.09),
          0 0 1.5rem rgba(141,216,255,.38),
          0 .75rem 1.7rem rgba(0,0,0,.42),
          inset 0 1px 0 rgba(255,255,255,.34);
        color:#041018;
        cursor:pointer;
        pointer-events:auto;
        display:grid;
        place-items:center;
        font-size:.58rem;
        font-weight:950;
        letter-spacing:.035em;
        text-transform:uppercase;
        transition:
          transform .18s ease,
          border-color .18s ease,
          box-shadow .18s ease,
          filter .18s ease;
      }

      .h-earth-inspection-target::before{
        content:"";
        position:absolute;
        inset:-.58rem;
        border:1px solid rgba(158,240,191,.18);
        border-radius:999px;
        animation:hEarthTargetPulse 2.8s ease-in-out infinite;
        animation-play-state:var(--motion-state,running);
      }

      .h-earth-inspection-target:hover,
      .h-earth-inspection-target:focus-visible,
      .h-earth-inspection-target.is-selected{
        transform:translate(-50%,-50%) scale(1.12);
        border-color:rgba(255,232,163,.95);
        box-shadow:
          0 0 0 .45rem rgba(243,200,111,.12),
          0 0 2.2rem rgba(243,200,111,.36),
          0 .95rem 2rem rgba(0,0,0,.48),
          inset 0 1px 0 rgba(255,255,255,.48);
        outline:none;
        filter:saturate(1.12);
      }

      .h-earth-inspection-target[data-context-only="true"]{
        background:
          radial-gradient(circle at 35% 25%,rgba(255,255,255,.75),transparent 20%),
          radial-gradient(circle,rgba(243,200,111,.62),rgba(141,216,255,.24) 48%,rgba(3,7,17,.76) 72%);
      }

      @keyframes hEarthTargetPulse{
        0%,100%{opacity:.38;transform:scale(.94)}
        50%{opacity:.82;transform:scale(1.14)}
      }

      .h-earth-matrix-panel{
        display:grid;
        gap:.8rem;
        padding:1rem;
        border:1px solid rgba(158,240,191,.20);
        border-radius:1.2rem;
        background:
          radial-gradient(circle at 0% 0%,rgba(158,240,191,.10),transparent 54%),
          radial-gradient(circle at 100% 0%,rgba(141,216,255,.10),transparent 54%),
          rgba(255,255,255,.035);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.07);
      }

      .h-earth-matrix-panel h3{
        margin:0;
        color:rgba(255,244,216,.98);
        font-size:clamp(1.05rem,2.6vw,1.35rem);
        line-height:1.1;
        letter-spacing:-.035em;
      }

      .h-earth-matrix-panel p{
        margin:0;
      }

      .h-earth-readout-grid{
        display:grid;
        grid-template-columns:1.15fr .85fr;
        gap:.85rem;
      }

      .h-earth-readout-card,
      .h-earth-boundary-card{
        min-height:10rem;
        display:grid;
        gap:.45rem;
        align-content:start;
        padding:.95rem;
        border:1px solid rgba(255,255,255,.12);
        border-radius:1rem;
        background:rgba(3,7,17,.36);
      }

      .h-earth-readout-card b,
      .h-earth-boundary-card b{
        color:var(--gold,#f3c86f);
        font-size:.66rem;
        letter-spacing:.12em;
        text-transform:uppercase;
      }

      .h-earth-readout-card strong,
      .h-earth-boundary-card strong{
        color:rgba(255,244,216,.98);
        font-size:1rem;
        line-height:1.15;
      }

      .h-earth-readout-card span,
      .h-earth-boundary-card span,
      .h-earth-readout-card code,
      .h-earth-boundary-card code{
        color:rgba(230,238,255,.78);
        font-size:.88rem;
        line-height:1.42;
      }

      .h-earth-readout-card code,
      .h-earth-boundary-card code{
        font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;
        overflow-wrap:anywhere;
      }

      .h-earth-target-strip{
        display:flex;
        flex-wrap:wrap;
        gap:.45rem;
      }

      .h-earth-target-chip{
        border:1px solid rgba(255,255,255,.13);
        border-radius:999px;
        padding:.48rem .7rem;
        background:rgba(255,255,255,.04);
        color:rgba(241,246,255,.86);
        cursor:pointer;
        font:inherit;
        font-size:.68rem;
        font-weight:950;
        letter-spacing:.055em;
        text-transform:uppercase;
      }

      .h-earth-target-chip.is-selected{
        border-color:rgba(158,240,191,.86);
        color:#041018;
        background:linear-gradient(135deg,#e8fff1,#9ef0bf);
      }

      .h-earth-target-chip:focus-visible{
        outline:2px solid var(--gold,#f3c86f);
        outline-offset:3px;
      }

      .h-earth-bridge-receipt{
        display:none!important;
      }

      @media (max-width:760px){
        .h-earth-readout-grid{
          grid-template-columns:1fr;
        }

        .h-earth-inspection-target{
          width:2.25rem;
          height:2.25rem;
          font-size:.48rem;
        }
      }

      @media (prefers-reduced-motion:reduce){
        .h-earth-inspection-target::before{
          animation:none!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureRouteScriptIdentity() {
    markDocument({
      routeScriptFound: "true",
      routeScriptContract: CONTRACT
    });
  }

  function createInspectionTargets(scene) {
    if (!scene || $(".h-earth-bridge-targets", scene)) return;

    var layer = document.createElement("div");
    layer.className = "h-earth-bridge-targets";
    layer.setAttribute("aria-label", "H-Earth matrix inspection targets");

    TARGETS.forEach(function (target) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "h-earth-inspection-target";
      button.dataset.targetId = target.id;
      button.dataset.zone = target.zone;
      button.dataset.layer = target.layer;
      button.dataset.contextOnly = String(/context/i.test(target.role));
      button.style.setProperty("--target-x", String(target.x));
      button.style.setProperty("--target-y", String(target.y));
      button.setAttribute("aria-label", "Inspect " + target.label);
      button.title = "Inspect " + target.label;
      button.textContent = target.shortLabel;

      button.addEventListener("click", function () {
        inspectTarget(target.id, "scene-target");
      });

      button.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inspectTarget(target.id, "scene-target-keyboard");
        }
      });

      layer.appendChild(button);
    });

    scene.appendChild(layer);
  }

  function createMatrixPanel(anchor) {
    if (!anchor || byId("hEarthMatrixPanel")) return;

    var panel = document.createElement("section");
    panel.className = "h-earth-matrix-panel";
    panel.id = "hEarthMatrixPanel";
    panel.setAttribute("aria-labelledby", "hEarthMatrixPanelTitle");

    panel.innerHTML = `
      <div class="kicker">Matrix-Backed 3D Candidate</div>
      <h3 id="hEarthMatrixPanelTitle">H-Earth is now a governed preview surface.</h3>
      <p>
        Select a shoreline target to return a Ground Condition Read. This is a 3D-candidate bridge:
        spatial inspection is active, while final renderer, WebGL, validation, survival simulation,
        and traversal claims remain false.
      </p>

      <div class="h-earth-target-strip" id="hEarthTargetStrip" aria-label="H-Earth inspection target list"></div>

      <div class="h-earth-readout-grid">
        <div class="h-earth-readout-card" id="hEarthReadoutCard" aria-live="polite">
          <b>Ground Condition Read</b>
          <strong>Awaiting inspection.</strong>
          <span>Select wet sand, foam, tide pools, stones, rocks, air, manor context, or distant context.</span>
          <code>H_EARTH_GROUND_CELL_001</code>
        </div>

        <div class="h-earth-boundary-card" id="hEarthBoundaryCard">
          <b>Boundary Status</b>
          <strong>H-Earth · Ground-View Matrix</strong>
          <span>Hearth remains support/control context only. Audralia remains planetary-world context only.</span>
          <code>matrixCollapse=false · visualPassClaim=false · validationClaim=false</code>
        </div>
      </div>
    `;

    anchor.insertAdjacentElement("afterend", panel);

    var strip = byId("hEarthTargetStrip");
    if (strip) {
      TARGETS.forEach(function (target) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "h-earth-target-chip";
        chip.dataset.targetId = target.id;
        chip.textContent = target.label;
        chip.addEventListener("click", function () {
          inspectTarget(target.id, "target-chip");
        });
        strip.appendChild(chip);
      });
    }
  }

  function createHiddenReceipt() {
    if (byId("hEarth3DCandidateBridgeReceipt")) return;

    var receipt = document.createElement("template");
    receipt.id = "hEarth3DCandidateBridgeReceipt";
    receipt.className = "h-earth-bridge-receipt";
    receipt.dataset.contractReceipt = CONTRACT;
    receipt.textContent = [
      CONTRACT,
      "route=/showroom/globe/h-earth/",
      "target=/showroom/globe/h-earth/index.js",
      "mode=3d_candidate_preview_bridge",
      "matrix=H-Earth",
      "matrix_role=Ground-View Matrix",
      "active_cell=H_EARTH_GROUND_CELL_001",
      "first_action=Inspect Ground",
      "first_readout=Ground Condition Read",
      "matrix_collapse=false",
      "webgl_activation_claim=false",
      "canvas_activation_claim=false",
      "final_renderer_activation_claim=false",
      "visual_pass_claim=false",
      "validation_claim=false",
      "open_world_traversal=false",
      "survival_simulation=false",
      "manor_interior=false",
      "distant_traversal=false"
    ].join("\n");

    document.body.appendChild(receipt);
  }

  function updateSceneStatus(target) {
    var status = $(".scene-status");
    if (!status || !target) return;

    status.textContent =
      "Inspection active: " + target.label + ". " +
      target.readout + " " +
      "Matrix: H-Earth Ground-View. Current runtime: 3D candidate preview bridge; final renderer, WebGL, validation, traversal, and survival simulation claims remain false.";
  }

  function updateCards(target, source) {
    var readout = byId("hEarthReadoutCard");
    var boundary = byId("hEarthBoundaryCard");

    if (readout && target) {
      readout.innerHTML = `
        <b>Ground Condition Read</b>
        <strong>${escapeHTML(target.label)}</strong>
        <span>${escapeHTML(target.readout)}</span>
        <span>${escapeHTML(target.summary)}</span>
        <code>${escapeHTML(target.id)} · ${escapeHTML(target.zone)} · source=${escapeHTML(source || "unknown")}</code>
      `;
    }

    if (boundary) {
      boundary.innerHTML = `
        <b>Boundary Status</b>
        <strong>H-Earth · Ground-View Matrix</strong>
        <span>Hearth remains support/control context only. Audralia remains planetary-world context only. Matrix collapse is false.</span>
        <code>3dCandidate=true · finalRendererClaim=false · webglClaim=false · validationClaim=false</code>
      `;
    }
  }

  function updateSelectionClasses(targetId) {
    $all(".h-earth-inspection-target").forEach(function (node) {
      node.classList.toggle("is-selected", node.dataset.targetId === targetId);
      node.setAttribute("aria-pressed", String(node.dataset.targetId === targetId));
    });

    $all(".h-earth-target-chip").forEach(function (node) {
      node.classList.toggle("is-selected", node.dataset.targetId === targetId);
      node.setAttribute("aria-pressed", String(node.dataset.targetId === targetId));
    });
  }

  function buildInspectionReceipt(target, source) {
    return Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      matrix: "H-Earth",
      matrixRole: "Ground-View Matrix",
      activeCell: "H_EARTH_GROUND_CELL_001",
      action: "Inspect Ground",
      readout: "Ground Condition Read",
      receipt: "H_EARTH_GROUND_INSPECTION_RECEIPT",
      selectedTarget: target.id,
      selectedTargetLabel: target.label,
      selectedZone: target.zone,
      selectedLayer: target.layer,
      selectedRole: target.role,
      source: source || "unknown",
      inspections: state.inspections,
      boundaryStatus: BOUNDARY_STATUS,
      modulesLoaded: state.modulesLoaded,
      moduleErrors: Object.keys(state.moduleErrors),
      timestamp: new Date().toISOString()
    });
  }

  function inspectTarget(targetId, source) {
    var target = getTarget(targetId);

    state.selectedTargetId = target.id;
    state.inspections += 1;

    updateSelectionClasses(target.id);
    updateSceneStatus(target);
    updateCards(target, source);

    var receipt = buildInspectionReceipt(target, source);
    window.DGBHEarth3DCandidateInspectionReceipt = receipt;

    markDocument({
      selectedTarget: target.id,
      selectedTargetLabel: target.label,
      selectedZone: target.zone,
      selectedLayer: target.layer,
      selectedRole: target.role,
      lastInspectionSource: source || "unknown",
      inspections: String(state.inspections),
      receipt: "H_EARTH_GROUND_INSPECTION_RECEIPT"
    });

    return receipt;
  }

  function bindExistingControls() {
    var body = document.body;
    var motionToggle = byId("motionToggle");
    var detailToggle = byId("detailToggle");
    var resetView = byId("resetView");

    if (motionToggle && !motionToggle.dataset.hEarthBridgeBound) {
      motionToggle.dataset.hEarthBridgeBound = "true";
      motionToggle.addEventListener("click", function () {
        state.motionOn = !body.classList.contains("motion-off");
        markDocument({ motion: state.motionOn ? "on" : "off" });
      }, { passive: true });
    }

    if (detailToggle && !detailToggle.dataset.hEarthBridgeBound) {
      detailToggle.dataset.hEarthBridgeBound = "true";
      detailToggle.addEventListener("click", function () {
        state.detailEnhanced = body.classList.contains("detail-enhanced");
        markDocument({ detail: state.detailEnhanced ? "enhanced" : "standard" });
      }, { passive: true });
    }

    if (resetView && !resetView.dataset.hEarthBridgeBound) {
      resetView.dataset.hEarthBridgeBound = "true";
      resetView.addEventListener("click", function () {
        state.viewResetCount += 1;
        markDocument({ viewResetCount: String(state.viewResetCount) });
      }, { passive: true });
    }
  }

  function exposeAPI() {
    window.DGBHEarth3DCandidatePreview = Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      status: function () {
        return Object.freeze({
          contract: CONTRACT,
          route: ROUTE,
          matrix: "H-Earth",
          matrixRole: "Ground-View Matrix",
          activeCell: "H_EARTH_GROUND_CELL_001",
          sceneIdentity: "earth-water-air-survival-shoreline-manor",
          selectedTarget: state.selectedTargetId,
          inspections: state.inspections,
          modulesLoaded: state.modulesLoaded,
          moduleErrors: Object.assign({}, state.moduleErrors),
          bridgeReady: state.bridgeReady,
          boundaryStatus: BOUNDARY_STATUS,
          bootedAt: state.bootedAt
        });
      },
      inspect: function (targetId) {
        return inspectTarget(targetId, "api");
      },
      targets: function () {
        return TARGETS.slice();
      },
      modules: function () {
        return Object.keys(state.modules);
      }
    });
  }

  function importOne(name, path) {
    return import(path).then(function (mod) {
      state.modules[name] = mod;
      return { name: name, ok: true, path: path };
    }).catch(function (error) {
      state.moduleErrors[name] = error && error.message ? error.message : String(error);
      return { name: name, ok: false, path: path, error: state.moduleErrors[name] };
    });
  }

  function loadMatrixModules() {
    var jobs = Object.keys(MODULE_PATHS).map(function (name) {
      return importOne(name, MODULE_PATHS[name]);
    });

    return Promise.all(jobs).then(function (results) {
      var loadedCount = results.filter(function (result) {
        return result.ok;
      }).length;

      state.modulesLoaded = loadedCount > 0;

      markDocument({
        hEarthModuleLoadAttempted: "true",
        hEarthModulesLoaded: String(loadedCount),
        hEarthModuleErrors: String(results.length - loadedCount)
      });

      return results;
    });
  }

  function applyModuleDerivedStatus() {
    var manifest = state.modules.manifest && state.modules.manifest.H_EARTH_MANIFEST;
    var matrix = state.modules.matrix && state.modules.matrix.H_EARTH_MATRIX;
    var action = state.modules.action && state.modules.action.H_EARTH_INSPECT_GROUND_ACTION;
    var readout = state.modules.readout && state.modules.readout.H_EARTH_GROUND_CONDITION_READ;

    markDocument({
      manifestSymbolFound: manifest ? "true" : "false",
      matrixSymbolFound: matrix ? "true" : "false",
      inspectActionSymbolFound: action ? "true" : "false",
      groundReadoutSymbolFound: readout ? "true" : "false"
    });

    window.DGBHEarth3DMatrixSourceSnapshot = Object.freeze({
      manifestFound: Boolean(manifest),
      matrixFound: Boolean(matrix),
      inspectActionFound: Boolean(action),
      groundConditionReadFound: Boolean(readout),
      manifest: manifest || null,
      matrix: matrix || null,
      inspectAction: action || null,
      groundConditionRead: readout || null
    });
  }

  function buildBridge() {
    var scene = byId("survivalScene");
    var sceneCard = $(".scene-card");

    injectStyles();
    createHiddenReceipt();
    bindExistingControls();

    if (scene) {
      createInspectionTargets(scene);
    }

    if (sceneCard) {
      createMatrixPanel(sceneCard);
    }

    state.bridgeReady = true;
    exposeAPI();

    inspectTarget(state.selectedTargetId, "initial-bridge-boot");

    markDocument({
      bridgeReady: "true",
      bridgeBuilt: "true"
    });
  }

  function boot() {
    ensureRouteScriptIdentity();
    buildBridge();

    loadMatrixModules()
      .then(function () {
        applyModuleDerivedStatus();
        markDocument({ matrixModuleBridgeComplete: "true" });
      })
      .catch(function (error) {
        markDocument({
          matrixModuleBridgeComplete: "false",
          matrixModuleBridgeError: error && error.message ? error.message : String(error)
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
