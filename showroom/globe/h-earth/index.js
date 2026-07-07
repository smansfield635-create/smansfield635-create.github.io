// /showroom/globe/h-earth/index.js
// FULL-FILE REPLACEMENT
// H_EARTH_3D_CANDIDATE_PREVIEW_BOOTSTRAP_STEP_018E_v1
//
// Purpose:
// Thin route bootstrap for the H-Earth 3D Candidate Preview.
//
// This file starts the controller, which starts the compositor.
// It does not own the scene, camera behavior, inspection logic, matrix facts,
// readouts, source definitions, renderer activation, WebGL/canvas activation,
// visual-pass validation, production validation, open-world traversal,
// survival simulation, swimming, manor interior access, distant traversal,
// or matrix collapse.

"use strict";

const BOOTSTRAP_CONTRACT = "H_EARTH_3D_CANDIDATE_PREVIEW_BOOTSTRAP_STEP_018E_v1";
const ROUTE = "/showroom/globe/h-earth/";
const CONTROLLER_PATH = "./controller.js";

const CLAIMS = Object.freeze({
  threeDCandidatePreview: true,
  navigableCandidateScene: true,
  inspectableCandidateScene: true,
  matrixBackedInspection: true,

  finalRendererActivationClaim: false,
  rendererActivationClaim: false,
  webglActivationClaim: false,
  canvasActivationClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionDeploymentClaim: false,
  openWorldTraversal: false,
  survivalSimulation: false,
  swimming: false,
  manorInterior: false,
  distantTraversal: false,
  matrixCollapse: false
});

function setDataset(node, key, value) {
  if (!node || !node.dataset) return;
  node.dataset[key] = String(value);
}

function markRoute(extra = {}) {
  const markers = Object.assign({
    route: ROUTE,
    bootstrapContract: BOOTSTRAP_CONTRACT,
    routeScript: "index.js",
    routeScriptRole: "h-earth-thin-bootstrap",

    matrix: "H-Earth",
    matrixRole: "Ground-View Matrix",
    activeCell: "H_EARTH_GROUND_CELL_001",
    sceneIdentity: "earth-water-air-survival-shoreline-manor",
    firstAction: "Inspect Ground",
    firstReadout: "Ground Condition Read",
    firstReceipt: "H_EARTH_GROUND_INSPECTION_RECEIPT",

    sourceRoot: "/h-earth-3d/",
    controllerPath: CONTROLLER_PATH,

    threeDCandidatePreview: "true",
    navigableCandidateScene: "true",
    inspectableCandidateScene: "true",
    matrixBackedInspection: "true",

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

function buildBootstrapReceipt(extra = {}) {
  return Object.freeze(Object.assign({
    contract: BOOTSTRAP_CONTRACT,
    route: ROUTE,
    script: "/showroom/globe/h-earth/index.js",
    role: "thin route bootstrap",
    controllerPath: CONTROLLER_PATH,
    matrix: "H-Earth",
    matrixRole: "Ground-View Matrix",
    activeCell: "H_EARTH_GROUND_CELL_001",
    sceneIdentity: "earth-water-air-survival-shoreline-manor",
    claims: CLAIMS,
    timestamp: new Date().toISOString()
  }, extra));
}

function renderBootError(message) {
  const status = document.getElementById("hEarthRouteStatus");
  if (!status) return;

  status.dataset.bootstrapError = message;

  const errorBox = document.createElement("section");
  errorBox.className = "h-earth-hud-panel h-earth-bootstrap-error";
  errorBox.setAttribute("aria-live", "polite");
  errorBox.innerHTML = `
    <h2>Bootstrap Error</h2>
    <p>The H-Earth controller did not start. Scene HTML/CSS may display, but camera and inspection behavior will remain inactive.</p>
    <p><code>${String(message)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></p>
  `;

  status.insertAdjacentElement("afterbegin", errorBox);
}

async function bootController() {
  markRoute({
    bootstrapStarted: "true",
    bootstrapReadyState: document.readyState
  });

  try {
    const controllerModule = await import(CONTROLLER_PATH);

    const bootControllerFn =
      controllerModule.bootHEarth3DCandidatePreview ||
      controllerModule.default;

    if (typeof bootControllerFn !== "function") {
      throw new Error(
        "controller.js did not export bootHEarth3DCandidatePreview or a default boot function."
      );
    }

    const controllerReceipt = await bootControllerFn({
      route: ROUTE,
      bootstrapContract: BOOTSTRAP_CONTRACT
    });

    const receipt = buildBootstrapReceipt({
      controllerBooted: true,
      controllerReceipt: controllerReceipt || null
    });

    window.DGBHEarth3DCandidateBootstrapReceipt = receipt;

    markRoute({
      bootstrapComplete: "true",
      controllerBooted: "true",
      controllerError: "false"
    });

    return receipt;
  } catch (error) {
    const message = error && error.message ? error.message : String(error);

    const receipt = buildBootstrapReceipt({
      controllerBooted: false,
      error: message
    });

    window.DGBHEarth3DCandidateBootstrapReceipt = receipt;

    markRoute({
      bootstrapComplete: "false",
      controllerBooted: "false",
      controllerError: message
    });

    renderBootError(message);

    return receipt;
  }
}

function boot() {
  markRoute({
    bootstrapMounted: "true"
  });

  bootController();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
