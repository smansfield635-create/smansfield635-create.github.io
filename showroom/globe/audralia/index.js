// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V17_256_LATTICE_CANONICAL_BAR_JS_TNT_v1
// Full-file replacement. Route doorway authority only.

const ROUTE_RECEIPT = "AUDRALIA_ROUTE_V17_256_LATTICE_CANONICAL_BAR_TNT_v1";
const JS_RECEIPT = "AUDRALIA_ROUTE_V17_256_LATTICE_CANONICAL_BAR_JS_TNT_v1";
const PREVIOUS_HTML_RECEIPT = "AUDRALIA_ROUTE_V16_CANONICAL_MOUNT_CANVAS_ATTACHMENT_TNT_v1";
const PREVIOUS_ROUTE_RECEIPT = "AUDRALIA_ROUTE_V16_CANONICAL_MOUNT_CANVAS_ATTACHMENT_JS_TNT_v1";

const ROUTE_PATH = "/showroom/globe/audralia/";
const CANVAS_PATH = "/assets/audralia/audralia.canvas.js";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const SURFACE_PATH = "/assets/audralia/audralia.surface.js";
const HEX_CHILD_PATH = "/assets/audralia/audralia.hex.surface.js";
const GRANDCHILD_RELIEF_PATH = "/assets/audralia/audralia.relief.surface.js";

const EXPECTED_CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const EXPECTED_CANVAS_CONTRACT = "AUDRALIA_CANVAS_PARENT_CONTRACT_CHILD_ACTIVATION_TNT_v13";
const EXPECTED_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10";
const EXPECTED_SURFACE_RECEIPT = "AUDRALIA_SURFACE_PARENT_COASTLINE_RIDGE_FEATHER_TNT_v6";
const EXPECTED_HEX_CHILD_RECEIPT = "AUDRALIA_HEX_SURFACE_CHILD_GRANDCHILD_RELIEF_BIND_TNT_v4";
const EXPECTED_GRANDCHILD_RELIEF_RECEIPT = "AUDRALIA_GRANDCHILD_RELIEF_FIELD_EXPRESSOR_TNT_v1";

const LATTICE_DOMAINS = [
  "route_identity",
  "contract_lineage",
  "static_mount_proof",
  "status_proof",
  "script_handoff",
  "canvas_authority_bridge",
  "runtime_bridge",
  "surface_chain",
  "topology_hydration_awareness",
  "readiness_timing",
  "error_transparency",
  "accessibility_semantics",
  "responsive_containment",
  "deployment_cache_proof",
  "gauges_compatibility",
  "non_ownership_boundaries"
];

const LATTICE_GATES = [
  "declare",
  "expose",
  "locate",
  "verify",
  "stamp",
  "report",
  "fallback",
  "fail_honest",
  "avoid_duplication",
  "avoid_stale_text",
  "preserve_route",
  "preserve_downstream_ownership",
  "preserve_no_graphicbox",
  "preserve_no_image_generation",
  "preserve_no_visual_pass_claim",
  "export_receipt"
];

const ROUTE_STATE = {
  ok: false,
  loaded: false,
  receipt: ROUTE_RECEIPT,
  jsReceipt: JS_RECEIPT,
  previousHtmlReceipt: PREVIOUS_HTML_RECEIPT,
  previousRouteReceipt: PREVIOUS_ROUTE_RECEIPT,
  route: ROUTE_PATH,
  classification: "V17_256_LATTICE_CANONICAL_BAR",
  latticeDomains: LATTICE_DOMAINS.length,
  latticeGates: LATTICE_GATES.length,
  latticeCells: LATTICE_DOMAINS.length * LATTICE_GATES.length,
  latticeReady: false,
  statusNodeFound: false,
  staticMountFound: false,
  canonicalMountFound: false,
  defensiveMountCreated: false,
  mountFound: false,
  mountId: "audralia-canvas-mount",
  outerMountId: "audralia-mount",
  importsAttempted: false,
  runtimeImported: false,
  surfaceImported: false,
  hexChildImported: false,
  grandchildReliefImported: false,
  canvasAuthorityImported: false,
  canvasMountFunctionFound: false,
  mountCallAttempted: false,
  mountCallSucceeded: false,
  canvasFoundAfterMount: false,
  canvasReceiptVisible: false,
  canvasContractVisible: false,
  canvasReceipt: EXPECTED_CANVAS_RECEIPT,
  canvasContract: EXPECTED_CANVAS_CONTRACT,
  runtimeReceipt: EXPECTED_RUNTIME_RECEIPT,
  surfaceReceipt: EXPECTED_SURFACE_RECEIPT,
  hexChildReceipt: EXPECTED_HEX_CHILD_RECEIPT,
  grandchildReliefReceipt: EXPECTED_GRANDCHILD_RELIEF_RECEIPT,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  heavyRuntimeLoaded: false,
  errors: [],
  warnings: [],
  lastUpdated: ""
};

function $(selector) {
  return document.querySelector(selector);
}

function firstString(...values) {
  for (const value of values) {
    const text = value === null || value === undefined ? "" : String(value).trim();
    if (text) return text;
  }
  return "";
}

function recordError(label, error) {
  const text = `${label}: ${String(error?.message || error || "unknown error")}`;
  if (!ROUTE_STATE.errors.includes(text)) ROUTE_STATE.errors.push(text);
}

function recordWarning(label, warning) {
  const text = `${label}: ${String(warning || "warning")}`;
  if (!ROUTE_STATE.warnings.includes(text)) ROUTE_STATE.warnings.push(text);
}

function safeCall(fn, fallback = null) {
  try {
    return typeof fn === "function" ? fn() : fallback;
  } catch (error) {
    recordError("safe call failed", error);
    return fallback;
  }
}

function resolveStatusNode() {
  return (
    $("#audralia-route-status") ||
    $("[data-audralia-route-status='true']") ||
    $("[data-audralia-route-status]") ||
    $("#audralia-status") ||
    $("[data-route-status]")
  );
}

function resolveOuterMount() {
  return (
    $("#audralia-mount") ||
    $("[data-audralia-mount='true']") ||
    $("[data-audralia-mount]") ||
    $("[data-gauges-visible-mount='true']") ||
    $("[data-audralia-render-mount]")
  );
}

function resolveCanonicalMount() {
  return (
    $("#audralia-canvas-mount") ||
    $("[data-audralia-canvas-mount='true']") ||
    $("[data-audralia-canvas-mount]") ||
    resolveOuterMount()
  );
}

function resolveCanvasNode() {
  const mount = resolveCanonicalMount();
  const outerMount = resolveOuterMount();

  return (
    document.querySelector("[data-audralia-canvas='true']") ||
    document.querySelector("[data-audralia-canvas]") ||
    (mount && mount.querySelector("canvas")) ||
    (outerMount && outerMount.querySelector("canvas")) ||
    document.querySelector("#audralia-canvas-mount canvas") ||
    document.querySelector("#audralia-mount canvas")
  );
}

function ensureStaticStatusNode() {
  let node = resolveStatusNode();
  if (node) return node;

  const main = document.querySelector("main") || document.body;
  node = document.createElement("div");
  node.id = "audralia-route-status";
  node.dataset.audraliaRouteStatus = "true";
  node.dataset.gaugesVisibleStatus = "true";
  node.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  node.dataset.audraliaRouteJsReceipt = JS_RECEIPT;
  node.dataset.graphicBox = "false";
  node.dataset.imageGeneration = "false";
  node.dataset.visualPassClaimed = "false";
  node.textContent = "Audralia V17 route status created defensively.";
  main.prepend(node);
  recordWarning("status", "status node was created defensively");
  return node;
}

function stampOuterMount(node) {
  if (!node) return;
  if (!node.id) node.id = "audralia-mount";
  node.dataset.audraliaMount = "true";
  node.dataset.gaugesVisibleMount = "true";
  node.dataset.staticMountProof = "true";
  node.dataset.routeContract = ROUTE_RECEIPT;
  node.dataset.routeJsContract = JS_RECEIPT;
  node.dataset.graphicBox = "false";
  node.dataset.imageGeneration = "false";
  node.dataset.visualPassClaimed = "false";
}

function stampMount(node) {
  if (!node) return;
  if (!node.id) node.id = "audralia-canvas-mount";
  node.dataset.audraliaCanvasMount = "true";
  node.dataset.audraliaMount = "true";
  node.dataset.canonicalMount = "true";
  node.dataset.gaugesVisibleMount = "true";
  node.dataset.staticMountProof = "true";
  node.dataset.route = ROUTE_PATH;
  node.dataset.routeContract = ROUTE_RECEIPT;
  node.dataset.routeJsContract = JS_RECEIPT;
  node.dataset.canvasAuthority = CANVAS_PATH;
  node.dataset.graphicBox = "false";
  node.dataset.imageGeneration = "false";
  node.dataset.visualPassClaimed = "false";
}

function ensureCanonicalMount() {
  const existingCanonical = $("#audralia-canvas-mount") || $("[data-audralia-canvas-mount='true']");
  if (existingCanonical) {
    stampMount(existingCanonical);
    const outer = resolveOuterMount();
    if (outer) stampOuterMount(outer);
    return existingCanonical;
  }

  let outer = resolveOuterMount();
  if (!outer) {
    outer = document.createElement("section");
    outer.id = "audralia-mount";
    outer.className = "canvas-shell audralia-defensive-mount-shell";
    stampOuterMount(outer);
    const target = document.querySelector(".canvas-card") || document.querySelector("main") || document.body;
    target.appendChild(outer);
    ROUTE_STATE.defensiveMountCreated = true;
    recordWarning("mount", "outer mount was created defensively");
  }

  const canonical = document.createElement("div");
  canonical.id = "audralia-canvas-mount";
  stampMount(canonical);
  outer.appendChild(canonical);
  ROUTE_STATE.defensiveMountCreated = true;
  recordWarning("mount", "canonical canvas mount was created defensively");
  return canonical;
}

function stampCanvas(canvas) {
  if (!canvas) return;
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("data-audralia-canvas-mounted", "true");
  canvas.setAttribute("data-gauges-visible-canvas", "true");
  canvas.setAttribute("data-audralia-route-receipt", ROUTE_RECEIPT);
  canvas.setAttribute("data-audralia-route-js-receipt", JS_RECEIPT);
  canvas.setAttribute("data-audralia-canvas-receipt", ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT);
  canvas.setAttribute("data-audralia-canvas-contract", ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT);
  canvas.setAttribute("data-graphic-box", "false");
  canvas.setAttribute("data-image-generation", "false");
  canvas.setAttribute("data-visual-pass-claimed", "false");
}

function setRootDataset() {
  document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRouteJsReceipt = JS_RECEIPT;
  document.documentElement.dataset.audraliaRoutePreviousHtmlReceipt = PREVIOUS_HTML_RECEIPT;
  document.documentElement.dataset.audraliaRoutePreviousReceipt = PREVIOUS_ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRouteMountFound = String(ROUTE_STATE.mountFound);
  document.documentElement.dataset.audraliaStaticMountFound = String(ROUTE_STATE.staticMountFound);
  document.documentElement.dataset.audraliaCanonicalMountFound = String(ROUTE_STATE.canonicalMountFound);
  document.documentElement.dataset.audraliaRouteCanvasAuthorityImported = String(ROUTE_STATE.canvasAuthorityImported);
  document.documentElement.dataset.audraliaRouteMountCallAttempted = String(ROUTE_STATE.mountCallAttempted);
  document.documentElement.dataset.audraliaRouteMountCallSucceeded = String(ROUTE_STATE.mountCallSucceeded);
  document.documentElement.dataset.audraliaRouteCanvasFoundAfterMount = String(ROUTE_STATE.canvasFoundAfterMount);
  document.documentElement.dataset.audraliaRouteCanvasReceipt = ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaRouteCanvasContract = ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT;
  document.documentElement.dataset.audraliaLatticeCells = String(ROUTE_STATE.latticeCells);
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
  document.documentElement.dataset.heavyRuntimeLoaded = "false";
}

function computeLatticeReady() {
  ROUTE_STATE.latticeReady = Boolean(
    ROUTE_STATE.latticeDomains === 16 &&
    ROUTE_STATE.latticeGates === 16 &&
    ROUTE_STATE.latticeCells === 256 &&
    ROUTE_STATE.statusNodeFound &&
    ROUTE_STATE.mountFound
  );
}

function buildLatticeReceipt() {
  return {
    contract: ROUTE_RECEIPT,
    jsContract: JS_RECEIPT,
    domains: LATTICE_DOMAINS.slice(),
    gates: LATTICE_GATES.slice(),
    cells: ROUTE_STATE.latticeCells,
    ready: ROUTE_STATE.latticeReady,
    htmlRole: "STATIC_GEOMETRIC_FOUNDATION",
    jsRole: "DYNAMIC_LAB_INSTRUMENT_CONTROLLER",
    canvasRole: "DOWNSTREAM_RENDER_AUTHORITY",
    gaugesRole: "READ_ONLY_PROOF_CONSOLE"
  };
}

function publishState(extra = {}) {
  Object.assign(ROUTE_STATE, extra);

  const statusNode = resolveStatusNode();
  const outerMount = resolveOuterMount();
  const canonicalMount = resolveCanonicalMount();
  const canvas = resolveCanvasNode();

  ROUTE_STATE.statusNodeFound = Boolean(statusNode);
  ROUTE_STATE.staticMountFound = Boolean(outerMount || canonicalMount);
  ROUTE_STATE.canonicalMountFound = Boolean(canonicalMount);
  ROUTE_STATE.mountFound = Boolean(canonicalMount || outerMount);
  ROUTE_STATE.canvasFoundAfterMount = Boolean(canvas) || ROUTE_STATE.canvasFoundAfterMount;

  computeLatticeReady();

  ROUTE_STATE.ok = Boolean(
    ROUTE_STATE.latticeReady &&
    ROUTE_STATE.mountFound &&
    ROUTE_STATE.canvasAuthorityImported &&
    ROUTE_STATE.canvasMountFunctionFound &&
    ROUTE_STATE.mountCallAttempted &&
    ROUTE_STATE.mountCallSucceeded &&
    ROUTE_STATE.canvasFoundAfterMount
  );

  ROUTE_STATE.loaded = ROUTE_STATE.ok;
  ROUTE_STATE.lastUpdated = new Date().toISOString();

  if (outerMount) stampOuterMount(outerMount);
  if (canonicalMount) stampMount(canonicalMount);
  if (canvas) stampCanvas(canvas);

  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATE;
  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATE;
  window.__AUDRALIA_ROUTE_RECEIPT__ = ROUTE_RECEIPT;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;
  window.__AUDRALIA_ROUTE_LATTICE__ = buildLatticeReceipt();

  if (!window.__AUDRALIA_CANVAS_STATUS__) {
    window.__AUDRALIA_CANVAS_STATUS__ = {
      receipt: ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT,
      contract: ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT,
      routeReceipt: ROUTE_RECEIPT,
      routeJsReceipt: JS_RECEIPT,
      bridgedByRoute: true,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    };
  }

  setRootDataset();
  writeStatus();

  try {
    window.dispatchEvent(new CustomEvent("audralia:route-status", { detail: ROUTE_STATE }));
  } catch (_) {}

  return ROUTE_STATE;
}

function writeStatus() {
  const node = resolveStatusNode();
  if (!node) return;

  const lines = [
    ROUTE_STATE.ok ? "Audralia V17 256-lattice canonical bar complete." : "Audralia V17 256-lattice canonical bar active.",
    `Route ${ROUTE_RECEIPT}`,
    `Route JS ${JS_RECEIPT}`,
    `Previous HTML ${PREVIOUS_HTML_RECEIPT}`,
    `Previous JS ${PREVIOUS_ROUTE_RECEIPT}`,
    `Lattice ${ROUTE_STATE.latticeDomains}x${ROUTE_STATE.latticeGates}=${ROUTE_STATE.latticeCells}`,
    `Status node found ${ROUTE_STATE.statusNodeFound}`,
    `Static mount found ${ROUTE_STATE.staticMountFound}`,
    `Canonical mount found ${ROUTE_STATE.canonicalMountFound}`,
    `Defensive mount created ${ROUTE_STATE.defensiveMountCreated}`,
    `Canvas authority imported ${ROUTE_STATE.canvasAuthorityImported}`,
    `Mount function found ${ROUTE_STATE.canvasMountFunctionFound}`,
    `Mount call attempted ${ROUTE_STATE.mountCallAttempted}`,
    `Mount call succeeded ${ROUTE_STATE.mountCallSucceeded}`,
    `Canvas found after mount ${ROUTE_STATE.canvasFoundAfterMount}`,
    `Canvas receipt ${ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT}`,
    `Canvas contract ${ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT}`,
    `Runtime ${ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT}`,
    `Surface ${ROUTE_STATE.surfaceReceipt || EXPECTED_SURFACE_RECEIPT}`,
    `Hex child ${ROUTE_STATE.hexChildReceipt || EXPECTED_HEX_CHILD_RECEIPT}`,
    `Grandchild relief ${ROUTE_STATE.grandchildReliefReceipt || EXPECTED_GRANDCHILD_RELIEF_RECEIPT}`,
    "GraphicBox false",
    "Image generation false",
    "Visual pass claimed false"
  ];

  if (ROUTE_STATE.warnings.length) lines.push(`Warnings ${ROUTE_STATE.warnings.slice(-3).join(" | ")}`);
  if (ROUTE_STATE.errors.length) lines.push(`Errors ${ROUTE_STATE.errors.slice(-3).join(" | ")}`);

  node.textContent = lines.join("\n");
  node.setAttribute("data-audralia-route-loaded", String(ROUTE_STATE.ok));
  node.setAttribute("data-audralia-route-receipt", ROUTE_RECEIPT);
  node.setAttribute("data-audralia-route-js-receipt", JS_RECEIPT);
  node.setAttribute("data-audralia-route-lattice-cells", String(ROUTE_STATE.latticeCells));
  node.setAttribute("data-audralia-static-mount-found", String(ROUTE_STATE.staticMountFound));
  node.setAttribute("data-audralia-canonical-mount-found", String(ROUTE_STATE.canonicalMountFound));
  node.setAttribute("data-audralia-canvas-mounted", String(ROUTE_STATE.canvasFoundAfterMount));
  node.setAttribute("data-audralia-canvas-receipt", ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT);
  node.setAttribute("data-audralia-canvas-contract", ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT);
  node.setAttribute("data-graphic-box", "false");
  node.setAttribute("data-image-generation", "false");
  node.setAttribute("data-visual-pass-claimed", "false");
}

async function importOptionalModule(path, label) {
  try {
    return await import(`${path}?route=${encodeURIComponent(ROUTE_RECEIPT)}&v=${encodeURIComponent(JS_RECEIPT)}`);
  } catch (error) {
    recordError(`${label} import failed`, error);
    return null;
  }
}

function readSupportReceipts(runtimeModule, surfaceModule, hexModule, reliefModule) {
  const runtimeStatus = safeCall(() => runtimeModule && runtimeModule.getStatus && runtimeModule.getStatus(), {}) || window.__AUDRALIA_RUNTIME_STATUS__ || {};
  const surfaceStatus = safeCall(() => surfaceModule && surfaceModule.getStatus && surfaceModule.getStatus(), {}) || surfaceModule?.AUDRALIA_SURFACE_STATUS || {};
  const hexStatus = safeCall(() => hexModule && hexModule.getAudraliaHexSurfaceStatus && hexModule.getAudraliaHexSurfaceStatus(), {}) || hexModule?.AUDRALIA_HEX_SURFACE_STATUS || {};
  const reliefStatus = safeCall(() => reliefModule && reliefModule.getAudraliaReliefSurfaceStatus && reliefModule.getAudraliaReliefSurfaceStatus(), {}) || reliefModule?.AUDRALIA_RELIEF_SURFACE_STATUS || {};

  ROUTE_STATE.runtimeImported = Boolean(runtimeModule);
  ROUTE_STATE.runtimeReceipt = firstString(runtimeModule?.AUDRALIA_RUNTIME_RECEIPT_VALUE, runtimeStatus?.receipt, EXPECTED_RUNTIME_RECEIPT);

  ROUTE_STATE.surfaceImported = Boolean(surfaceModule);
  ROUTE_STATE.surfaceReceipt = firstString(surfaceModule?.AUDRALIA_SURFACE_RECEIPT_VALUE, surfaceStatus?.receipt, EXPECTED_SURFACE_RECEIPT);

  ROUTE_STATE.hexChildImported = Boolean(hexModule);
  ROUTE_STATE.hexChildReceipt = firstString(hexModule?.AUDRALIA_HEX_SURFACE_RECEIPT_VALUE, hexStatus?.receipt, EXPECTED_HEX_CHILD_RECEIPT);

  ROUTE_STATE.grandchildReliefImported = Boolean(reliefModule);
  ROUTE_STATE.grandchildReliefReceipt = firstString(reliefModule?.AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE, reliefStatus?.receipt, EXPECTED_GRANDCHILD_RELIEF_RECEIPT);
}

function readCanvasStatus(canvasModule) {
  const status = safeCall(() => canvasModule && canvasModule.getAudraliaCanvasStatus && canvasModule.getAudraliaCanvasStatus(), {}) || window.__AUDRALIA_CANVAS_STATUS__ || window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ || {};

  ROUTE_STATE.canvasReceipt = firstString(status?.receipt, canvasModule?.RECEIPT, EXPECTED_CANVAS_RECEIPT);
  ROUTE_STATE.canvasContract = firstString(status?.contract, status?.revision, canvasModule?.CONTRACT, canvasModule?.REVISION, EXPECTED_CANVAS_CONTRACT);
  ROUTE_STATE.canvasReceiptVisible = Boolean(ROUTE_STATE.canvasReceipt);
  ROUTE_STATE.canvasContractVisible = Boolean(ROUTE_STATE.canvasContract);

  window.__AUDRALIA_CANVAS_STATUS__ = {
    ...(typeof status === "object" && status ? status : {}),
    receipt: ROUTE_STATE.canvasReceipt,
    contract: ROUTE_STATE.canvasContract,
    routeReceipt: ROUTE_RECEIPT,
    routeJsReceipt: JS_RECEIPT,
    bridgedByRoute: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function chooseMountFunction(canvasModule) {
  return (
    canvasModule?.mountAudraliaCanvas ||
    canvasModule?.renderAudraliaCanvas ||
    canvasModule?.bootAudraliaCanvas ||
    canvasModule?.createAudraliaCanvas ||
    canvasModule?.initAudraliaCanvas ||
    canvasModule?.renderAudralia ||
    canvasModule?.mountAudralia ||
    canvasModule?.render ||
    canvasModule?.mount ||
    canvasModule?.init ||
    canvasModule?.default?.mountAudraliaCanvas ||
    canvasModule?.default?.renderAudraliaCanvas ||
    canvasModule?.default?.bootAudraliaCanvas ||
    canvasModule?.default?.createAudraliaCanvas ||
    canvasModule?.default?.initAudraliaCanvas ||
    canvasModule?.default?.render ||
    canvasModule?.default?.mount ||
    canvasModule?.default?.init ||
    window.mountAudraliaCanvas ||
    window.renderAudraliaCanvas
  );
}

function attachReturnedCanvas(controller) {
  const mount = resolveCanonicalMount();
  if (!mount || !controller) return null;

  const directCanvas =
    controller instanceof HTMLCanvasElement
      ? controller
      : controller.canvas instanceof HTMLCanvasElement
        ? controller.canvas
        : controller.element instanceof HTMLCanvasElement
          ? controller.element
          : null;

  if (directCanvas && !directCanvas.isConnected) mount.appendChild(directCanvas);
  return directCanvas;
}

function clearFallback() {
  const fallback = document.querySelector("[data-audralia-mount-fallback]");
  if (fallback && resolveCanvasNode()) {
    fallback.textContent = "";
    fallback.setAttribute("hidden", "true");
  }
}

async function waitForCanvas(timeoutMs = 18000) {
  const started = performance.now();

  return new Promise((resolve) => {
    const check = () => {
      const canvas = resolveCanvasNode();

      if (canvas) {
        resolve(canvas);
        return;
      }

      if (performance.now() - started >= timeoutMs) {
        resolve(null);
        return;
      }

      window.requestAnimationFrame(check);
    };

    check();
  });
}

async function mountCanvas(canvasModule, runtimeModule) {
  const mount = ensureCanonicalMount();

  if (!mount) {
    recordError("mount", "Canonical mount could not be resolved or created");
    publishState();
    return null;
  }

  const mountFunction = chooseMountFunction(canvasModule);
  ROUTE_STATE.canvasMountFunctionFound = typeof mountFunction === "function";

  if (typeof mountFunction !== "function") {
    recordError("canvas authority", "No mount function found");
    publishState();
    return null;
  }

  ROUTE_STATE.mountCallAttempted = true;
  publishState();

  let controller = null;

  try {
    controller = await mountFunction(mount, {
      routeReceipt: ROUTE_RECEIPT,
      routeJsReceipt: JS_RECEIPT,
      previousHtmlReceipt: PREVIOUS_HTML_RECEIPT,
      previousRouteReceipt: PREVIOUS_ROUTE_RECEIPT,
      canonicalMountId: "audralia-canvas-mount",
      outerMountId: "audralia-mount",
      runtime: runtimeModule || null,
      runtimeMotion: runtimeModule || null,
      runtimeReceipt: ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT,
      runtimeSovereignty: "motion-only",
      runtimeVisualSovereignty: false,
      canvasReceipt: ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT,
      canvasContract: ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT,
      surfaceReceipt: ROUTE_STATE.surfaceReceipt || EXPECTED_SURFACE_RECEIPT,
      hexChildReceipt: ROUTE_STATE.hexChildReceipt || EXPECTED_HEX_CHILD_RECEIPT,
      grandchildReliefReceipt: ROUTE_STATE.grandchildReliefReceipt || EXPECTED_GRANDCHILD_RELIEF_RECEIPT,
      latticeCells: ROUTE_STATE.latticeCells,
      parentStandard: true,
      ratioLocked: true,
      childActivatedByParentContract: true,
      grandchildReliefActivated: true,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });

    ROUTE_STATE.mountCallSucceeded = true;
  } catch (error) {
    ROUTE_STATE.mountCallSucceeded = false;
    recordError("canvas mount call failed", error);
    publishState();
    return null;
  }

  const returnedCanvas = attachReturnedCanvas(controller);
  if (returnedCanvas) stampCanvas(returnedCanvas);

  const canvas = await waitForCanvas();
  ROUTE_STATE.canvasFoundAfterMount = Boolean(canvas);

  if (canvas) {
    stampCanvas(canvas);
    clearFallback();
  } else {
    recordError("canvas verification", "Mount call returned, but no canvas appeared in the canonical mount");
  }

  publishState();
  return controller;
}

function attachRuntimeInteraction(runtimeModule) {
  const mount = resolveCanonicalMount();
  if (!runtimeModule || !mount) return;

  safeCall(() => runtimeModule.start && runtimeModule.start());

  let lastX = 0;
  let lastY = 0;
  let active = false;

  mount.addEventListener("pointerdown", (event) => {
    active = true;
    lastX = event.clientX;
    lastY = event.clientY;
    safeCall(() => runtimeModule.setPointerActive && runtimeModule.setPointerActive(true));
  }, { passive: true });

  mount.addEventListener("pointermove", (event) => {
    if (!active) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    lastX = event.clientX;
    lastY = event.clientY;

    safeCall(() => runtimeModule.applyDragImpulse && runtimeModule.applyDragImpulse(dx, dy, 1));
  }, { passive: true });

  const endPointer = () => {
    active = false;
    safeCall(() => runtimeModule.setPointerActive && runtimeModule.setPointerActive(false));
  };

  mount.addEventListener("pointerup", endPointer, { passive: true });
  mount.addEventListener("pointercancel", endPointer, { passive: true });
  mount.addEventListener("pointerleave", endPointer, { passive: true });
}

function scheduleStatusRefreshes() {
  const delays = [0, 50, 120, 220, 400, 700, 1100, 1800, 3000, 5200, 7600, 11000, 14500, 19000];

  delays.forEach((delay) => {
    window.setTimeout(() => publishState({ statusRefreshDelay: delay }), delay);
  });
}

async function boot() {
  ensureStaticStatusNode();
  ensureCanonicalMount();

  publishState({
    statusNodeFound: Boolean(resolveStatusNode()),
    staticMountFound: Boolean(resolveOuterMount() || resolveCanonicalMount()),
    canonicalMountFound: Boolean(resolveCanonicalMount()),
    mountFound: Boolean(resolveCanonicalMount() || resolveOuterMount())
  });

  ROUTE_STATE.importsAttempted = true;
  publishState();

  const [runtimeModule, surfaceModule, hexModule, reliefModule, canvasModule] = await Promise.all([
    importOptionalModule(RUNTIME_PATH, "runtime"),
    importOptionalModule(SURFACE_PATH, "surface"),
    importOptionalModule(HEX_CHILD_PATH, "hex child"),
    importOptionalModule(GRANDCHILD_RELIEF_PATH, "grandchild relief"),
    importOptionalModule(CANVAS_PATH, "canvas")
  ]);

  readSupportReceipts(runtimeModule, surfaceModule, hexModule, reliefModule);

  ROUTE_STATE.canvasAuthorityImported = Boolean(canvasModule);

  if (!canvasModule) {
    recordError("canvas authority", "Canvas authority import failed");
    publishState();
    scheduleStatusRefreshes();
    return ROUTE_STATE;
  }

  readCanvasStatus(canvasModule);
  publishState();

  await mountCanvas(canvasModule, runtimeModule);
  attachRuntimeInteraction(runtimeModule);
  scheduleStatusRefreshes();

  return ROUTE_STATE;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  ROUTE_RECEIPT,
  JS_RECEIPT,
  PREVIOUS_HTML_RECEIPT,
  PREVIOUS_ROUTE_RECEIPT,
  LATTICE_DOMAINS,
  LATTICE_GATES,
  ROUTE_STATE,
  boot,
  publishState,
  buildLatticeReceipt
};

export default boot;
