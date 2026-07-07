// /showroom/globe/h-earth/controller.js
// FULL-FILE REPLACEMENT
// H_EARTH_3D_CANDIDATE_PREVIEW_CONTROLLER_STEP_018D_v1
//
// Purpose:
// Owns matrix-backed inspection behavior for the H-Earth 3D Candidate Preview route.
//
// This controller attaches to the scene-first HTML/CSS environment,
// initializes the compositor, binds inspection targets, reads the installed
// /h-earth-3d/ source layer where available, returns governed Ground Condition
// Read outputs, exposes route status, and preserves all claim boundaries.
//
// This file does not claim final renderer activation, WebGL/canvas activation,
// visual-pass validation, production validation, open-world traversal,
// survival simulation, swimming, manor interior access, distant traversal,
// or matrix collapse.

"use strict";

import { bootHEarth3DCompositor } from "./compositor.js";

const CONTROLLER_CONTRACT = "H_EARTH_3D_CANDIDATE_PREVIEW_CONTROLLER_STEP_018D_v1";
const ROUTE = "/showroom/globe/h-earth/";
const SOURCE_ROOT = "/h-earth-3d/";

const MODULE_PATHS = Object.freeze({
  manifest: SOURCE_ROOT + "h-earth.manifest.js",
  matrix: SOURCE_ROOT + "h-earth.matrix.js",
  state: SOURCE_ROOT + "h-earth.state.js",
  receipts: SOURCE_ROOT + "h-earth.receipts.js",
  cell: SOURCE_ROOT + "cells/ground-cell-001.js",
  objects: SOURCE_ROOT + "objects/ground-cell-001.objects.js",
  zones: SOURCE_ROOT + "zones/ground-cell-001.zones.js",
  action: SOURCE_ROOT + "actions/inspect-ground.js",
  readout: SOURCE_ROOT + "readouts/ground-condition-read.js",
  boundaries: SOURCE_ROOT + "boundaries/matrix-boundaries.js",
  renderPlaceholder: SOURCE_ROOT + "render/render-placeholder.js",
  integrity: SOURCE_ROOT + "h-earth.integrity.js",
  harness: SOURCE_ROOT + "h-earth.non-rendering-harness.js"
});

const CLAIMS = Object.freeze({
  threeDCandidatePreview: true,
  navigableCandidateScene: true,
  inspectableCandidateScene: true,
  matrixBackedInspection: true,
  sourceLayerGitHubUploaded: true,

  finalRendererActivationClaim: false,
  rendererActivationClaim: false,
  webglActivationClaim: false,
  canvasActivationClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionDeploymentClaim: false,
  openWorldTraversal: false,
  openWorldExpansion: false,
  survivalSimulation: false,
  swimming: false,
  waterTraversal: false,
  fluidSimulation: false,
  manorInterior: false,
  distantTraversal: false,
  matrixCollapse: false
});

const TARGETS = Object.freeze([
  Object.freeze({
    id: "OBJ_002_FOREGROUND_WET_SAND",
    label: "Foreground Wet Sand",
    shortLabel: "Wet Sand",
    zone: "ZONE_001_FOREGROUND_INSPECTION_ZONE",
    layer: "H-Earth / Earth",
    role: "Primary inspection target",
    targetKind: "primary",
    inspectable: true,
    contextOnly: false,
    readout:
      "Surface condition: coastal wet-sand and rock shoreline context, bounded to local surface inspection.",
    summary:
      "Wet sand is the primary lawful ground contact point for the first H-Earth inspection."
  }),

  Object.freeze({
    id: "OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES",
    label: "Tide Pools and Reflective Puddles",
    shortLabel: "Tide Pools",
    zone: "ZONE_002_SHORELINE_CONTACT_ZONE",
    layer: "H-Earth / Water",
    role: "Supporting inspection target",
    targetKind: "supporting",
    inspectable: true,
    contextOnly: false,
    readout:
      "Moisture condition: visible tide-pool and wet-sand moisture present; no survival hydration claim and no fluid simulation claim.",
    summary:
      "Tide pools provide local moisture evidence without authorizing swimming, water traversal, or fluid simulation."
  }),

  Object.freeze({
    id: "OBJ_010_SMALL_BEACH_STONES",
    label: "Small Beach Stones",
    shortLabel: "Small Stones",
    zone: "ZONE_001_FOREGROUND_INSPECTION_ZONE",
    layer: "H-Earth / Earth",
    role: "Supporting inspection target",
    targetKind: "supporting",
    inspectable: true,
    contextOnly: false,
    readout:
      "Ground texture condition: small beach stones are present inside the bounded foreground inspection zone.",
    summary:
      "Small stones supply scale, footing, and ground texture context. Collection mechanics are not active."
  }),

  Object.freeze({
    id: "OBJ_011_FOREGROUND_JAGGED_ROCKS",
    label: "Foreground Jagged Rocks",
    shortLabel: "Jagged Rocks",
    zone: "ZONE_001_FOREGROUND_INSPECTION_ZONE",
    layer: "H-Earth / Earth",
    role: "Supporting inspection target",
    targetKind: "supporting",
    inspectable: true,
    contextOnly: false,
    readout:
      "Obstacle condition: jagged foreground rock edge present; inspection allowed, climbing and traversal not active.",
    summary:
      "Jagged rocks define foreground obstruction and survival caution without activating traversal mechanics."
  }),

  Object.freeze({
    id: "OBJ_005_SHORELINE_FOAM_LINE",
    label: "Shoreline Foam Line",
    shortLabel: "Foam Line",
    zone: "ZONE_002_SHORELINE_CONTACT_ZONE",
    layer: "H-Earth / Water",
    role: "Supporting inspection target",
    targetKind: "supporting",
    inspectable: true,
    contextOnly: false,
    readout:
      "Shoreline contact condition: foam marks the live boundary between ground and water; no swimming, traversal, or fluid simulation is authorized.",
    summary:
      "The foam line is the visible contact boundary between Earth and Water."
  }),

  Object.freeze({
    id: "OBJ_009_MANOR_EXTERIOR_CONTEXT",
    label: "Manor Exterior Context",
    shortLabel: "Manor",
    zone: "ZONE_004_MANOR_CONTEXT_ZONE",
    layer: "Hearth Context",
    role: "Context object only",
    targetKind: "context",
    inspectable: false,
    contextOnly: true,
    readout:
      "Context condition: manor exterior is visible as Hearth support/control context only. Interior access is not authorized.",
    summary:
      "The manor remains context-only and does not become H-Earth ground authority."
  }),

  Object.freeze({
    id: "OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS",
    label: "Distance Rock Stacks and Islets",
    shortLabel: "Distant Islets",
    zone: "ZONE_005_DISTANT_WORLD_CONTEXT_ZONE",
    layer: "Audralia Context",
    role: "Distant context only",
    targetKind: "context",
    inspectable: false,
    contextOnly: true,
    readout:
      "Distance condition: distant rock stacks and islets preserve planetary-world context only. Distant traversal is not authorized.",
    summary:
      "Distant islets remain visual continuity/context and do not authorize open-world movement."
  })
]);

const TARGET_BY_ID = Object.freeze(
  TARGETS.reduce((map, target) => {
    map[target.id] = target;
    return map;
  }, Object.create(null))
);

const DEFAULT_TARGET_ID = "OBJ_002_FOREGROUND_WET_SAND";

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
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

function freezePlainObject(value) {
  return Object.freeze(Object.assign({}, value || {}));
}

function getTarget(targetId) {
  return TARGET_BY_ID[targetId] || TARGET_BY_ID[DEFAULT_TARGET_ID];
}

function createState(options = {}) {
  return {
    route: options.route || ROUTE,
    bootstrapContract: options.bootstrapContract || null,
    bootedAt: new Date().toISOString(),
    ready: false,
    selectedTargetId: DEFAULT_TARGET_ID,
    inspections: 0,
    modules: Object.create(null),
    moduleErrors: Object.create(null),
    modulesLoaded: false,
    moduleLoadComplete: false,
    sourceSnapshot: null,
    compositorReceipt: null,
    lastReceipt: null,
    listeners: []
  };
}

function rememberListener(state, node, type, handler, options) {
  if (!node || !node.addEventListener) return;
  node.addEventListener(type, handler, options);
  state.listeners.push(Object.freeze({ node, type, handler, options }));
}

function removeListeners(state) {
  state.listeners.forEach((entry) => {
    entry.node.removeEventListener(entry.type, entry.handler, entry.options);
  });
  state.listeners = [];
}

function markRoute(state, extra = {}) {
  const markers = Object.assign({
    route: ROUTE,
    controllerContract: CONTROLLER_CONTRACT,
    controllerReady: state.ready ? "true" : "false",
    matrix: "H-Earth",
    matrixRole: "Ground-View Matrix",
    activeCell: "H_EARTH_GROUND_CELL_001",
    sceneIdentity: "earth-water-air-survival-shoreline-manor",
    selectedTarget: state.selectedTargetId,
    firstAction: "Inspect Ground",
    firstReadout: "Ground Condition Read",
    firstReceipt: "H_EARTH_GROUND_INSPECTION_RECEIPT",
    sourceRoot: SOURCE_ROOT,
    matrixBackedInspection: "true",
    threeDCandidatePreview: "true",
    navigableCandidateScene: "true",
    inspectableCandidateScene: "true",
    finalRendererActivationClaim: "false",
    rendererActivationClaim: "false",
    webglActivationClaim: "false",
    canvasActivationClaim: "false",
    visualPassClaim: "false",
    validationClaim: "false",
    productionDeploymentClaim: "false",
    openWorldTraversal: "false",
    survivalSimulation: "false",
    swimming: "false",
    manorInterior: "false",
    distantTraversal: "false",
    matrixCollapse: "false"
  }, extra);

  Object.keys(markers).forEach((key) => {
    setDataset(document.documentElement, key, markers[key]);
    setDataset(document.body, key, markers[key]);
  });
}

function buildInspectionReceipt(state, target, source = "unknown") {
  return Object.freeze({
    contract: CONTROLLER_CONTRACT,
    route: ROUTE,
    matrix: "H-Earth",
    matrixRole: "Ground-View Matrix",
    activeCell: "H_EARTH_GROUND_CELL_001",
    sceneIdentity: "earth-water-air-survival-shoreline-manor",
    action: "Inspect Ground",
    readout: "Ground Condition Read",
    receipt: "H_EARTH_GROUND_INSPECTION_RECEIPT",
    selectedTarget: target.id,
    selectedTargetLabel: target.label,
    selectedZone: target.zone,
    selectedLayer: target.layer,
    selectedRole: target.role,
    targetKind: target.targetKind,
    source,
    inspections: state.inspections,
    modulesLoaded: state.modulesLoaded,
    moduleLoadComplete: state.moduleLoadComplete,
    moduleErrors: Object.keys(state.moduleErrors),
    claims: CLAIMS,
    timestamp: new Date().toISOString()
  });
}

function buildControllerReceipt(state, extra = {}) {
  return Object.freeze(Object.assign({
    contract: CONTROLLER_CONTRACT,
    route: ROUTE,
    ready: state.ready,
    matrix: "H-Earth",
    matrixRole: "Ground-View Matrix",
    activeCell: "H_EARTH_GROUND_CELL_001",
    sceneIdentity: "earth-water-air-survival-shoreline-manor",
    selectedTarget: state.selectedTargetId,
    inspections: state.inspections,
    modulesLoaded: state.modulesLoaded,
    moduleLoadComplete: state.moduleLoadComplete,
    moduleErrors: freezePlainObject(state.moduleErrors),
    compositorReceipt: state.compositorReceipt || null,
    sourceSnapshot: state.sourceSnapshot || null,
    claims: CLAIMS,
    bootedAt: state.bootedAt,
    timestamp: new Date().toISOString()
  }, extra));
}

function updateSelectedTargetClasses(targetId) {
  $all("[data-controller-target='inspection'], [data-target-chip]").forEach((node) => {
    const nodeTargetId = node.dataset.objectId || node.dataset.targetChip;
    const selected = nodeTargetId === targetId;

    node.classList.toggle("is-selected", selected);
    node.setAttribute("aria-pressed", selected ? "true" : "false");
  });
}

function updateReadoutPanel(target, receipt) {
  setText(byId("hEarthSelectedTargetLabel"), target.label);
  setText(byId("hEarthSelectedTargetStatus"), target.readout);

  const readoutPanel = byId("hEarthGroundReadout");
  if (!readoutPanel) return;

  setDataset(readoutPanel, "selectedTarget", target.id);
  setDataset(readoutPanel, "selectedZone", target.zone);
  setDataset(readoutPanel, "selectedLayer", target.layer);
  setDataset(readoutPanel, "receipt", receipt.receipt);
  setDataset(readoutPanel, "inspectionCount", receipt.inspections);
}

function updateBoundaryPanel() {
  const panel = byId("hEarthBoundaryPanel");
  if (!panel) return;

  setDataset(panel, "matrix", "H-Earth");
  setDataset(panel, "matrixRole", "Ground-View Matrix");
  setDataset(panel, "hearthContext", "support/control context only");
  setDataset(panel, "audraliaContext", "planetary-world context only");
  setDataset(panel, "matrixCollapse", "false");
}

function updateRouteStatus(state) {
  const status = byId("hEarthRouteStatus");
  if (!status) return;

  setDataset(status, "controllerReady", state.ready ? "true" : "false");
  setDataset(status, "modulesLoaded", state.modulesLoaded ? "true" : "false");
  setDataset(status, "moduleLoadComplete", state.moduleLoadComplete ? "true" : "false");
  setDataset(status, "selectedTarget", state.selectedTargetId);
  setDataset(status, "inspections", state.inspections);
}

function inspectTarget(state, targetId, source = "unknown") {
  const target = getTarget(targetId);

  if (!target.inspectable) {
    markRoute(state, {
      lastInspectionBlocked: "true",
      blockedTarget: target.id,
      blockedReason: "context-only"
    });
  }

  state.selectedTargetId = target.id;
  state.inspections += 1;

  updateSelectedTargetClasses(target.id);

  const receipt = buildInspectionReceipt(state, target, source);
  state.lastReceipt = receipt;

  updateReadoutPanel(target, receipt);
  updateBoundaryPanel();
  updateRouteStatus(state);

  markRoute(state, {
    selectedTarget: target.id,
    selectedTargetLabel: target.label,
    selectedZone: target.zone,
    selectedLayer: target.layer,
    selectedRole: target.role,
    targetKind: target.targetKind,
    inspections: state.inspections,
    lastInspectionSource: source,
    receipt: "H_EARTH_GROUND_INSPECTION_RECEIPT",
    lastInspectionBlocked: target.inspectable ? "false" : "true"
  });

  window.DGBHEarth3DCandidateInspectionReceipt = receipt;

  return receipt;
}

function bindInspectionTargets(state) {
  $all("[data-controller-target='inspection']").forEach((node) => {
    if (node.dataset.hEarthControllerBound === "true") return;
    node.dataset.hEarthControllerBound = "true";

    rememberListener(state, node, "click", () => {
      inspectTarget(state, node.dataset.objectId, "scene-anchor");
    });

    rememberListener(state, node, "keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      inspectTarget(state, node.dataset.objectId, "scene-anchor-keyboard");
    });
  });

  $all("[data-target-chip]").forEach((node) => {
    if (node.dataset.hEarthControllerBound === "true") return;
    node.dataset.hEarthControllerBound = "true";

    rememberListener(state, node, "click", () => {
      inspectTarget(state, node.dataset.targetChip, "target-chip");
    });
  });
}

function importOne(state, name, path) {
  return import(path)
    .then((module) => {
      state.modules[name] = module;
      return Object.freeze({ name, path, ok: true });
    })
    .catch((error) => {
      state.moduleErrors[name] = error && error.message ? error.message : String(error);
      return Object.freeze({
        name,
        path,
        ok: false,
        error: state.moduleErrors[name]
      });
    });
}

function loadSourceModules(state) {
  const jobs = Object.keys(MODULE_PATHS).map((name) => {
    return importOne(state, name, MODULE_PATHS[name]);
  });

  markRoute(state, {
    sourceModuleLoadAttempted: "true",
    sourceRoot: SOURCE_ROOT
  });

  return Promise.all(jobs).then((results) => {
    const loadedCount = results.filter((result) => result.ok).length;
    const errorCount = results.length - loadedCount;

    state.modulesLoaded = loadedCount > 0;
    state.moduleLoadComplete = true;

    markRoute(state, {
      sourceModulesLoaded: String(loadedCount),
      sourceModuleErrors: String(errorCount),
      sourceModuleLoadComplete: "true"
    });

    return Object.freeze(results);
  });
}

function buildSourceSnapshot(state) {
  const manifest = state.modules.manifest && state.modules.manifest.H_EARTH_MANIFEST;
  const matrix = state.modules.matrix && state.modules.matrix.H_EARTH_MATRIX;
  const cell = state.modules.cell && state.modules.cell.H_EARTH_GROUND_CELL_001;
  const objects = state.modules.objects && state.modules.objects.H_EARTH_GROUND_CELL_001_OBJECTS;
  const zones = state.modules.zones && state.modules.zones.H_EARTH_GROUND_CELL_001_ZONES;
  const action = state.modules.action && state.modules.action.H_EARTH_INSPECT_GROUND_ACTION;
  const readout = state.modules.readout && state.modules.readout.H_EARTH_GROUND_CONDITION_READ;
  const boundaries = state.modules.boundaries && state.modules.boundaries.H_EARTH_MATRIX_BOUNDARIES;

  const snapshot = Object.freeze({
    manifestFound: Boolean(manifest),
    matrixFound: Boolean(matrix),
    cellFound: Boolean(cell),
    objectsFound: Boolean(objects),
    zonesFound: Boolean(zones),
    inspectActionFound: Boolean(action),
    groundConditionReadFound: Boolean(readout),
    boundariesFound: Boolean(boundaries),

    canonicalManifestSymbol: manifest ? "H_EARTH_MANIFEST" : null,
    matrix: manifest && manifest.matrix ? manifest.matrix : "H-Earth",
    matrixRole: manifest && manifest.matrixRole ? manifest.matrixRole : "Ground-View Matrix",
    activeCell: manifest && manifest.activeCell ? manifest.activeCell : "H_EARTH_GROUND_CELL_001",
    sceneIdentity:
      manifest && manifest.sceneIdentity
        ? manifest.sceneIdentity
        : "earth-water-air-survival-shoreline-manor",

    primaryInspectionTarget:
      action && action.primaryFocusTarget
        ? action.primaryFocusTarget
        : DEFAULT_TARGET_ID,

    supportingInspectionTargets:
      action && action.supportingInspectionTargets
        ? Array.prototype.slice.call(action.supportingInspectionTargets)
        : [
            "OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES",
            "OBJ_010_SMALL_BEACH_STONES",
            "OBJ_011_FOREGROUND_JAGGED_ROCKS",
            "OBJ_005_SHORELINE_FOAM_LINE"
          ],

    boundaryMatrixCollapse:
      boundaries && typeof boundaries.matrixCollapse === "boolean"
        ? boundaries.matrixCollapse
        : false
  });

  state.sourceSnapshot = snapshot;

  window.DGBHEarth3DMatrixSourceSnapshot = snapshot;

  markRoute(state, {
    manifestSymbolFound: snapshot.manifestFound ? "true" : "false",
    matrixSymbolFound: snapshot.matrixFound ? "true" : "false",
    cellSymbolFound: snapshot.cellFound ? "true" : "false",
    objectsSymbolFound: snapshot.objectsFound ? "true" : "false",
    zonesSymbolFound: snapshot.zonesFound ? "true" : "false",
    inspectActionSymbolFound: snapshot.inspectActionFound ? "true" : "false",
    groundReadoutSymbolFound: snapshot.groundConditionReadFound ? "true" : "false",
    boundariesSymbolFound: snapshot.boundariesFound ? "true" : "false"
  });

  return snapshot;
}

function initializeCompositor(state) {
  try {
    state.compositorReceipt = bootHEarth3DCompositor({
      viewport: byId("hEarthViewport"),
      camera: byId("hEarthCamera"),
      scene: byId("hEarthScene"),
      controlsRoot: byId("hEarthCameraControls")
    });

    markRoute(state, {
      compositorInitializedByController: "true",
      compositorReady:
        state.compositorReceipt && state.compositorReceipt.ready ? "true" : "false"
    });
  } catch (error) {
    const message = error && error.message ? error.message : String(error);

    state.compositorReceipt = Object.freeze({
      contract: "H_EARTH_3D_CANDIDATE_PREVIEW_COMPOSITOR_STEP_018C_v1",
      route: ROUTE,
      ready: false,
      error: message,
      timestamp: new Date().toISOString()
    });

    markRoute(state, {
      compositorInitializedByController: "false",
      compositorError: message
    });
  }

  return state.compositorReceipt;
}

function exposeAPI(state) {
  const api = Object.freeze({
    contract: CONTROLLER_CONTRACT,
    route: ROUTE,

    status() {
      return buildControllerReceipt(state);
    },

    inspect(targetId) {
      return inspectTarget(state, targetId, "api");
    },

    targets() {
      return TARGETS.slice();
    },

    selectedTarget() {
      return getTarget(state.selectedTargetId);
    },

    modules() {
      return Object.keys(state.modules);
    },

    sourceSnapshot() {
      return state.sourceSnapshot;
    },

    compositor() {
      return window.DGBHEarth3DCandidateCompositor || null;
    },

    destroy() {
      removeListeners(state);

      if (
        window.DGBHEarth3DCandidateCompositor &&
        typeof window.DGBHEarth3DCandidateCompositor.destroy === "function"
      ) {
        window.DGBHEarth3DCandidateCompositor.destroy();
      }

      state.ready = false;
      markRoute(state, {
        controllerReady: "false",
        controllerDestroyed: "true"
      });

      return buildControllerReceipt(state, { destroyed: true });
    }
  });

  window.DGBHEarth3DCandidateController = api;
  window.DGBHEarth3DCandidatePreview = api;

  return api;
}

function verifySceneMounts() {
  const required = [
    "hEarthRoute",
    "hEarthViewport",
    "hEarthCamera",
    "hEarthScene",
    "hEarthForegroundInspectionZone",
    "hEarthShorelineContactZone",
    "hEarthWaterSurfaceZone",
    "hEarthManorContextZone",
    "hEarthDistantWorldZone",
    "hEarthGroundReadout"
  ];

  const missing = required.filter((id) => !byId(id));

  return Object.freeze({
    ok: missing.length === 0,
    missing: Object.freeze(missing)
  });
}

function markInitialSceneMounts(state) {
  TARGETS.forEach((target) => {
    const node = byId(target.id);
    if (!node) return;

    setDataset(node, "controllerKnownTarget", "true");
    setDataset(node, "targetKind", target.targetKind);
    setDataset(node, "targetRole", target.role);
    setDataset(node, "targetZone", target.zone);
    setDataset(node, "targetLayer", target.layer);
  });

  const mounts = verifySceneMounts();

  markRoute(state, {
    sceneMountsVerified: mounts.ok ? "true" : "false",
    missingSceneMounts: mounts.missing.join(",")
  });

  return mounts;
}

export function bootHEarth3DCandidatePreview(options = {}) {
  const state = createState(options);

  markRoute(state, {
    controllerBootAttempted: "true",
    bootstrapContract: state.bootstrapContract || "none"
  });

  const mounts = markInitialSceneMounts(state);

  initializeCompositor(state);
  bindInspectionTargets(state);
  exposeAPI(state);

  state.ready = true;

  const initialReceipt = inspectTarget(state, DEFAULT_TARGET_ID, "controller-initial-boot");

  loadSourceModules(state)
    .then(() => {
      buildSourceSnapshot(state);
      updateRouteStatus(state);

      window.DGBHEarth3DCandidateControllerReceipt = buildControllerReceipt(state, {
        initialInspectionReceipt: initialReceipt,
        sceneMounts: mounts
      });

      markRoute(state, {
        controllerReady: "true",
        controllerBootComplete: "true",
        sourceBridgeComplete: "true"
      });
    })
    .catch((error) => {
      const message = error && error.message ? error.message : String(error);

      markRoute(state, {
        sourceBridgeComplete: "false",
        sourceBridgeError: message
      });

      window.DGBHEarth3DCandidateControllerReceipt = buildControllerReceipt(state, {
        initialInspectionReceipt: initialReceipt,
        sceneMounts: mounts,
        sourceBridgeError: message
      });
    });

  const bootReceipt = buildControllerReceipt(state, {
    initialInspectionReceipt: initialReceipt,
    sceneMounts: mounts
  });

  window.DGBHEarth3DCandidateControllerReceipt = bootReceipt;

  return bootReceipt;
}

export default bootHEarth3DCandidatePreview;
