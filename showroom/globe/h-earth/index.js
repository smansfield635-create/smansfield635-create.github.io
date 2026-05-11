// /showroom/globe/h-earth/index.js
// H_EARTH_G1_RUNTIME_GOVERNED_PRIVATE_ROOM_ROUTE_TNT_v16B
// Full-file replacement.
// Private H-Earth route doorway authority only.
//
// Purpose:
// - Keep the accepted H-Earth private page standard.
// - Make the route doorway thin.
// - Hand orchestration to the runtime governor.
// - Prevent private route lag/freezing caused by repeated orchestration.
// - Keep parent truth immutable.
// - Keep ground-level mode held.
// - Keep estate placement held.
// - Keep visual pass claim false.

const CONTRACT = "H_EARTH_G1_RUNTIME_GOVERNED_PRIVATE_ROOM_ROUTE_TNT_v16B";
const RUNTIME_CONTRACT = "H_EARTH_G1_PERFORMANCE_RUNTIME_GOVERNOR_TNT_v16A";
const PAIR_CONTRACT = "H_EARTH_G1_PERFORMANCE_RUNTIME_GOVERNOR_PAIR_TNT_v16";
const HTML_CONTRACT = "H_EARTH_G1_PRIVATE_ORBITAL_BUILD_ROOM_RESTORE_HTML_TNT_v15";
const PREVIOUS_CONTRACT = "H_EARTH_G1_PRIVATE_ORBITAL_BUILD_ROOM_RESTORE_ROUTE_TNT_v15";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";

const ROUTE = "/showroom/globe/h-earth/";
const PLANET = "H-Earth";
const BUILD_MODE = "orbital-aerial-first";
const RUNTIME_PATH = "/assets/h-earth/h-earth/runtime.js";
const CACHE_KEY = "2026-05-11-h-earth-runtime-governed-private-room-route-v16b";

const state = {
  contract: CONTRACT,
  runtimeContract: RUNTIME_CONTRACT,
  pairContract: PAIR_CONTRACT,
  htmlContract: HTML_CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  seedPacket: SEED_PACKET,
  route: ROUTE,
  planet: PLANET,
  buildMode: BUILD_MODE,
  runtimePath: RUNTIME_PATH,
  cacheKey: CACHE_KEY,
  status: "route-not-started",
  runtimeStatus: null,
  errors: []
};

function byId(id) {
  return document.getElementById(id);
}

function codeLine(text) {
  const code = document.createElement("code");
  code.textContent = text;
  return code;
}

function safeError(error) {
  if (!error) return "unknown error";
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function recordError(label, error) {
  state.errors.push({
    label,
    message: safeError(error),
    at: new Date().toISOString()
  });
}

function runtimeUrl() {
  return `${RUNTIME_PATH}?v=${encodeURIComponent(CACHE_KEY)}`;
}

function mountTarget() {
  return (
    byId("hEarthCanvasCompositionMount") ||
    document.querySelector("[data-h-earth-canvas-mount]") ||
    document.querySelector("[data-h-earth-private-room-mount]") ||
    document.querySelector("main") ||
    document.body
  );
}

function receiptPanel() {
  return (
    byId("hEarthReceiptPanel") ||
    document.querySelector("[data-receipt-panel='h-earth-private-orbital-room']") ||
    null
  );
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.routeDoorwayTopLevelExecuted = "true";
  root.dataset.routeDoorwayReceipt = CONTRACT;
  root.dataset.routeDoorwayContract = CONTRACT;
  root.dataset.hEarthRuntimeReceipt = RUNTIME_CONTRACT;
  root.dataset.hEarthRuntimePairReceipt = PAIR_CONTRACT;
  root.dataset.htmlReceipt = HTML_CONTRACT;
  root.dataset.previousRouteDoorwayContract = PREVIOUS_CONTRACT;
  root.dataset.hEarthSeedPacket = SEED_PACKET;
  root.dataset.hEarthPrivateRoom = "true";
  root.dataset.hEarthRoom = "runtime-governed-private-orbital-aerial-build-room";
  root.dataset.parentCoreChainStatus = state.status;
  root.dataset.cacheKey = CACHE_KEY;
  root.dataset.hEarthBuildMode = BUILD_MODE;
  root.dataset.hEarthRuntimePath = RUNTIME_PATH;

  root.dataset.hEarthGroundLevelReady = "false";
  root.dataset.hEarthEstatePlacementReady = "false";
  root.dataset.hEarthParentMutationAuthorized = "false";
  root.dataset.hEarthVisualPassClaim = "false";
  root.dataset.earthMutationAuthorized = "false";
  root.dataset.hearthMutationAuthorized = "false";
  root.dataset.audraliaMutationAuthorized = "false";
  root.dataset.generatedImage = "false";
  root.dataset.graphicBox = "false";
  root.dataset.visualPassClaim = "false";
}

function publishRouteReceipt() {
  const panel = receiptPanel();
  if (!panel) return;

  const runtimeStatus = state.runtimeStatus || {};

  panel.dataset.routeReceipt = CONTRACT;
  panel.dataset.runtimeReceipt = RUNTIME_CONTRACT;
  panel.dataset.pairReceipt = PAIR_CONTRACT;
  panel.dataset.previousRouteReceipt = PREVIOUS_CONTRACT;
  panel.dataset.hEarthRouteStatus = state.status;
  panel.dataset.hEarthPrivateRoom = "true";
  panel.dataset.hEarthBuildMode = BUILD_MODE;
  panel.dataset.hEarthRuntimePath = RUNTIME_PATH;
  panel.dataset.hEarthGroundLevelReady = "false";
  panel.dataset.hEarthEstatePlacementReady = "false";
  panel.dataset.hEarthParentMutationAuthorized = "false";
  panel.dataset.hEarthVisualPassClaim = "false";

  panel.replaceChildren(
    codeLine(`PAIR_RECEIPT: ${PAIR_CONTRACT}`),
    codeLine(`ROUTE_RECEIPT: ${CONTRACT}`),
    codeLine(`RUNTIME_RECEIPT: ${RUNTIME_CONTRACT}`),
    codeLine(`HTML_RECEIPT: ${HTML_CONTRACT}`),
    codeLine(`PREVIOUS_ROUTE: ${PREVIOUS_CONTRACT}`),
    codeLine(`SEED_PACKET: ${SEED_PACKET}`),
    codeLine(`ROUTE: ${ROUTE}`),
    codeLine(`PLANET: ${PLANET}`),
    codeLine(`PRIVATE_ROOM: true`),
    codeLine(`BUILD_MODE: ${BUILD_MODE}`),
    codeLine(`ROUTE_STATUS: ${state.status}`),
    codeLine(`RUNTIME_PATH: ${RUNTIME_PATH}`),
    codeLine(`RUNTIME_STATUS: ${runtimeStatus.status || "pending"}`),
    codeLine(`RUNTIME_BOOTED: ${String(runtimeStatus.booted ?? false)}`),
    codeLine(`RUNTIME_PAUSED: ${String(runtimeStatus.visibilityPaused ?? false)}`),
    codeLine(`RUNTIME_DPR_CAP: ${runtimeStatus.maxDevicePixelRatio ?? "pending"}`),
    codeLine(`PARENT_CHAIN_READY: ${String(runtimeStatus.parentChainReady ?? false)}`),
    codeLine(`CANVAS_INDEX_READY: ${String(runtimeStatus.canvasIndexReady ?? false)}`),
    codeLine(`TERRAIN_ELEVATION_READY: ${String(runtimeStatus.terrainElevationReady ?? false)}`),
    codeLine(`ORBITAL_SURFACE_READY: ${String(runtimeStatus.orbitalSurfaceReady ?? false)}`),
    codeLine(`ORBITAL_SURFACE_RECEIPT: ${runtimeStatus.orbitalSurfaceReceipt || "pending"}`),
    codeLine(`ORBITAL_SURFACE_STATUS: ${runtimeStatus.orbitalSurfaceStatus || "pending"}`),
    codeLine(`GROUND_LEVEL_READY: false`),
    codeLine(`ESTATE_PLACEMENT_READY: false`),
    codeLine(`PARENT_MUTATION_AUTHORIZED: false`),
    codeLine(`VISUAL_PASS_CLAIM: false`),
    codeLine(`GENERATED_IMAGE: false`),
    codeLine(`GRAPHIC_BOX: false`)
  );
}

function renderRouteFailure(message) {
  const mount = mountTarget();
  if (!mount) return;

  const shell = document.createElement("div");
  shell.setAttribute("aria-live", "polite");
  shell.style.position = "absolute";
  shell.style.left = "50%";
  shell.style.top = "50%";
  shell.style.width = "min(88%, 520px)";
  shell.style.transform = "translate(-50%, -50%)";
  shell.style.padding = "16px";
  shell.style.border = "1px solid rgba(255,155,155,.42)";
  shell.style.borderRadius = "24px";
  shell.style.background = "rgba(5,9,18,.82)";
  shell.style.color = "#f6ead2";
  shell.style.textAlign = "center";
  shell.style.font = "700 .9rem Inter, system-ui, sans-serif";
  shell.style.letterSpacing = ".02em";
  shell.style.boxShadow = "0 20px 60px rgba(0,0,0,.35)";

  const heading = document.createElement("div");
  heading.textContent = "H-Earth runtime failed";
  heading.style.color = "#ff9b9b";
  heading.style.fontWeight = "900";
  heading.style.textTransform = "uppercase";
  heading.style.letterSpacing = ".08em";
  heading.style.marginBottom = "10px";

  const body = document.createElement("div");
  body.textContent = message;
  body.style.color = "#b9c1cf";
  body.style.fontWeight = "700";
  body.style.lineHeight = "1.45";

  shell.appendChild(heading);
  shell.appendChild(body);

  mount.replaceChildren(shell);
}

async function boot() {
  state.status = "route-doorway-top-level-executed";
  stampDocument();
  publishRouteReceipt();

  try {
    state.status = "importing-runtime-governor";
    stampDocument();
    publishRouteReceipt();

    const runtime = await import(runtimeUrl());

    if (!runtime || typeof runtime.bootHEarthRuntime !== "function") {
      throw new Error("runtime export missing: bootHEarthRuntime");
    }

    state.status = "runtime-imported-booting";
    stampDocument();
    publishRouteReceipt();

    state.runtimeStatus = await runtime.bootHEarthRuntime({
      mount: mountTarget(),
      receiptPanel: receiptPanel(),
      routeDoorwayContract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      pairContract: PAIR_CONTRACT,
      previousRouteDoorwayContract: PREVIOUS_CONTRACT,
      privateRoom: true,
      route: ROUTE,
      planet: PLANET,
      buildMode: BUILD_MODE,
      readOnly: true,
      runtimeGoverned: true,
      mutationAuthorized: false,
      groundLevelReady: false,
      estatePlacementReady: false
    });

    state.status = state.runtimeStatus?.booted
      ? "runtime-governed-private-room-active"
      : "runtime-governed-private-room-held";

    stampDocument();
    publishRouteReceipt();
  } catch (error) {
    recordError("route-runtime-boot", error);
    state.status = "runtime-import-or-boot-failed";
    stampDocument();
    publishRouteReceipt();
    renderRouteFailure(safeError(error));
  }
}

stampDocument();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  RUNTIME_CONTRACT,
  PAIR_CONTRACT,
  HTML_CONTRACT,
  PREVIOUS_CONTRACT,
  SEED_PACKET,
  ROUTE,
  BUILD_MODE,
  RUNTIME_PATH,
  CACHE_KEY
};
