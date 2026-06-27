/* ==========================================================================
   /products/archcoin/index.js

   ARCHCOIN
   PAGE RUNTIME COORDINATION BRIDGE
   CONTROLLER + CRYSTALS BOOTSTRAP / RECEIPT / FAIL-SOFT ORCHESTRATION

   Full-file replacement scope:
   - Treat DGB_ARCHCOIN_CONTROLLER as the single page-state anchor.
   - Treat ARCHCOIN_CRYSTALS as the 3D crystal renderer.
   - Preserve visible-first HTML behavior if either subsystem fails.
   - Load controller first, then crystals.
   - Do not re-own page state, semantic meaning, panel copy, or geometry logic.
   - Publish runtime coordination receipt and runtime availability datasets.
   - Keep controller failure, crystals failure, and bridge failure distinct.
   - Fail soft.

   Owns:
   - file-order bootstrapping
   - bridge-level readiness checks
   - runtime availability datasets
   - bridge receipt emission
   - bridge-level start/stop passthrough
   - bridge event coordination

   Does not own:
   - page state machine
   - panel meaning
   - orbit / cluster geometry
   - pointer gesture classification
   - crystal shading / rendering
   - financial claims
========================================================================== */

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_RUNTIME_BRIDGE_CONTROLLER_AND_CRYSTALS_REBUILD_v1",
    previousId: "ARCHCOIN_CONSTELLATION_RUNTIME_CONTROLLER_CONFORMANT_REBUILD_v2",
    file: "/products/archcoin/index.js",
    releaseId: "archcoin-runtime-bridge-v1",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const STATES = Object.freeze({
    BOOTING: "BOOTING",
    AVAILABLE: "AVAILABLE",
    DEGRADED: "DEGRADED",
    HELD: "HELD",
    STOPPED: "STOPPED"
  });

  const REQUIRED_CONTROLLER_METHODS = Object.freeze([
    "receipt",
    "getFrameState",
    "requestCoinSelection",
    "requestRoomSelection",
    "requestReturnToOrbit",
    "requestReturnToConstellation",
    "requestReturnToCluster",
    "requestCenterCompassToggle",
    "requestCenterCompassOpen",
    "requestCenterCompassClose",
    "requestLensTab",
    "beginOrbitGesture",
    "requestOrbitPreview",
    "requestOrbitCommit",
    "requestOrbitCancel",
    "beginClusterGesture",
    "requestClusterPreview",
    "requestClusterCommit",
    "requestClusterCancel"
  ]);

  const OPTIONAL_CRYSTALS_METHODS = Object.freeze([
    "receipt",
    "start",
    "stop"
  ]);

  const RECEIPT = {
    contractId: CONTRACT.id,
    previousContractId: CONTRACT.previousId,
    status: "pending",
    bridgeInitialized: false,
    bridgeState: STATES.BOOTING,
    controllerLoaded: false,
    controllerReady: false,
    crystalsLoaded: false,
    crystalsReady: false,
    selectedWing: "",
    selectedCoin: "",
    selectedRoom: "",
    activeTab: "overview",
    orbitFocus: "north",
    orbitPreviewFocus: "north",
    activeClusterWing: "",
    clusterPrimaryRoom: "",
    clusterPreviewPrimaryRoom: "",
    controllerStatus: "",
    crystalsStatus: "",
    reducedMotion: false,
    heavyRuntimeLoaded: false,
    visualPassClaimed: false,
    lastAction: "",
    failureReason: ""
  };

  const state = {
    root: null,
    scene: null,
    objects: null,
    geometryMount: null,
    guidance: null,
    controllerReceiptOutput: null,
    crystalsReceiptOutput: null,
    runtimeReceiptOutput: null,

    controller: null,
    crystals: null,

    bridgeState: STATES.BOOTING,
    bridgeInitialized: false,
    failureReason: "",

    started: false,
    stoppedByBridge: false,
    raf: 0
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return ["north", "east", "south", "west"].includes(wing) ? wing : "";
  }

  function normalizeCoin(value) {
    const coin = String(value || "").trim().toLowerCase();
    return ["contract", "receivable", "payable", "allocation"].includes(coin) ? coin : "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function normalizeTab(value) {
    const tab = String(value || "").trim().toLowerCase();
    return ["overview", "engineering", "platform", "governance"].includes(tab) ? tab : "overview";
  }

  function scriptUrl(relativePath) {
    return new URL(relativePath, globalThis.location.href).href;
  }

  function runtimeReady() {
    return Boolean(state.controller && state.crystals);
  }

  function controllerReceipt() {
    if (!state.controller || typeof state.controller.receipt !== "function") {
      return null;
    }

    try {
      return state.controller.receipt();
    } catch (_) {
      return null;
    }
  }

  function crystalsReceipt() {
    if (!state.crystals || typeof state.crystals.receipt !== "function") {
      return null;
    }

    try {
      return state.crystals.receipt();
    } catch (_) {
      return null;
    }
  }

  function controllerFrame() {
    if (!state.controller || typeof state.controller.getFrameState !== "function") {
      return null;
    }

    try {
      return state.controller.getFrameState();
    } catch (_) {
      return null;
    }
  }

  function readReducedMotion(frame) {
    const mediaReduced =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return Boolean((frame && frame.reducedMotion) || mediaReduced);
  }

  function controllerIsUsable(controller) {
    return REQUIRED_CONTROLLER_METHODS.every(
      method => controller && typeof controller[method] === "function"
    );
  }

  function crystalsIsUsable(crystals) {
    return OPTIONAL_CRYSTALS_METHODS.every(method => typeof crystals?.[method] === "function");
  }

  function applyRuntimeDatasets(frame, controllerInfo, crystalsInfo) {
    if (!state.root || !state.scene) {
      return;
    }

    const selectedWing = normalizeWing(frame && frame.selectedCardinal);
    const selectedCoin = normalizeCoin(state.root.dataset.selectedCoin || "");
    const selectedRoom = normalizeRoomId(frame && frame.selectedRoom);
    const activeTab = normalizeTab(state.root.dataset.archcoinActiveTab || "");
    const orbitFocus = normalizeWing(frame && frame.orbitFocus) || "north";
    const orbitPreviewFocus =
      normalizeWing(frame && frame.orbitPreviewFocus) || orbitFocus || "north";
    const activeClusterWing =
      normalizeWing(frame && frame.activeClusterWing) || normalizeWing(state.root.dataset.activeClusterWing);

    const clusterPrimaryRoom =
      frame && frame.cluster ? normalizeRoomId(frame.cluster.primaryRoom) : "";
    const clusterPreviewPrimaryRoom =
      frame && frame.cluster ? normalizeRoomId(frame.cluster.previewPrimaryRoom) : "";

    state.root.dataset.archcoinRuntimeBridgeState = state.bridgeState.toLowerCase();
    state.root.dataset.archcoinRuntimeBridgeReady = runtimeReady() ? "true" : "false";
    state.root.dataset.archcoinRuntimeBridgeControllerReady = controllerInfo.ready ? "true" : "false";
    state.root.dataset.archcoinRuntimeBridgeCrystalsReady = crystalsInfo.ready ? "true" : "false";
    state.root.dataset.archcoinRuntimeBridgeFailure = state.failureReason || "";
    state.root.dataset.heavyRuntimeLoaded = runtimeReady() ? "true" : "false";
    state.root.dataset.visualPassClaimed = "false";

    state.scene.dataset.archcoinRuntimeBridgeState = state.bridgeState.toLowerCase();
    state.scene.dataset.archcoinRuntimeBridgeReady = runtimeReady() ? "true" : "false";
    state.scene.dataset.visualPassClaimed = "false";

    state.root.dataset.selectedWing = selectedWing;
    state.root.dataset.selectedCoin = selectedCoin;
    state.root.dataset.selectedRoom = selectedRoom;
    state.root.dataset.archcoinActiveTab = activeTab;
    state.root.dataset.orbitFocus = orbitFocus;
    state.root.dataset.orbitPreviewFocus = orbitPreviewFocus;
    state.root.dataset.activeClusterWing = activeClusterWing;
    state.root.dataset.clusterPrimaryRoom = clusterPrimaryRoom;
    state.root.dataset.clusterPreviewPrimaryRoom = clusterPreviewPrimaryRoom;
  }

  function emitReceipt(extra = {}) {
    const frame = controllerFrame();
    const controllerInfo = {
      loaded: Boolean(state.controller),
      ready: controllerIsUsable(state.controller),
      receipt: controllerReceipt()
    };
    const crystalsInfo = {
      loaded: Boolean(state.crystals),
      ready: crystalsIsUsable(state.crystals),
      receipt: crystalsReceipt()
    };

    const reducedMotion = readReducedMotion(frame);
    const selectedWing = normalizeWing(frame && frame.selectedCardinal);
    const selectedCoin = normalizeCoin(state.root?.dataset.selectedCoin || "");
    const selectedRoom = normalizeRoomId(frame && frame.selectedRoom);
    const activeTab = normalizeTab(state.root?.dataset.archcoinActiveTab || "overview");
    const orbitFocus = normalizeWing(frame && frame.orbitFocus) || "north";
    const orbitPreviewFocus =
      normalizeWing(frame && frame.orbitPreviewFocus) || orbitFocus || "north";
    const activeClusterWing =
      normalizeWing(frame && frame.activeClusterWing) || normalizeWing(state.root?.dataset.activeClusterWing || "");
    const clusterPrimaryRoom =
      frame && frame.cluster ? normalizeRoomId(frame.cluster.primaryRoom) : "";
    const clusterPreviewPrimaryRoom =
      frame && frame.cluster ? normalizeRoomId(frame.cluster.previewPrimaryRoom) : "";

    Object.assign(RECEIPT, {
      status:
        state.bridgeState === STATES.HELD
          ? "held"
          : state.bridgeState === STATES.STOPPED
            ? "stopped"
            : state.bridgeState === STATES.DEGRADED
              ? "degraded"
              : "available",
      bridgeInitialized: state.bridgeInitialized,
      bridgeState: state.bridgeState,
      controllerLoaded: controllerInfo.loaded,
      controllerReady: controllerInfo.ready,
      crystalsLoaded: crystalsInfo.loaded,
      crystalsReady: crystalsInfo.ready,
      selectedWing,
      selectedCoin,
      selectedRoom,
      activeTab,
      orbitFocus,
      orbitPreviewFocus,
      activeClusterWing,
      clusterPrimaryRoom,
      clusterPreviewPrimaryRoom,
      controllerStatus:
        controllerInfo.receipt && controllerInfo.receipt.status
          ? String(controllerInfo.receipt.status)
          : "",
      crystalsStatus:
        crystalsInfo.receipt && crystalsInfo.receipt.status
          ? String(crystalsInfo.receipt.status)
          : "",
      reducedMotion,
      heavyRuntimeLoaded: runtimeReady(),
      visualPassClaimed: false,
      failureReason: state.failureReason || "",
      ...extra
    });

    const serialized = JSON.stringify(RECEIPT);

    applyRuntimeDatasets(frame, controllerInfo, crystalsInfo);

    if (state.runtimeReceiptOutput) {
      state.runtimeReceiptOutput.value = serialized;
      state.runtimeReceiptOutput.textContent = serialized;
      state.runtimeReceiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis.ARCHCOIN_RUNTIME_BRIDGE_RECEIPT = Object.freeze({ ...RECEIPT });
  }

  function failHeld(reason, action = "bridge-held") {
    state.bridgeState = STATES.HELD;
    state.failureReason = String(reason || "UNKNOWN_BRIDGE_FAILURE");
    state.started = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    emitReceipt({
      lastAction: action,
      failureReason: state.failureReason
    });
  }

  function updateBridgeState(action = "bridge-refresh") {
    const controllerReady = controllerIsUsable(state.controller);
    const crystalsReady = crystalsIsUsable(state.crystals);

    if (state.stoppedByBridge) {
      state.bridgeState = STATES.STOPPED;
    } else if (controllerReady && crystalsReady) {
      state.bridgeState = STATES.AVAILABLE;
    } else if (controllerReady || crystalsReady) {
      state.bridgeState = STATES.DEGRADED;
    } else {
      state.bridgeState = STATES.HELD;
    }

    emitReceipt({
      lastAction: action
    });
  }

  function ensureScript(relativePath, globalName) {
    const existingGlobal = globalThis[globalName];
    if (existingGlobal) {
      return Promise.resolve(existingGlobal);
    }

    const absolute = scriptUrl(relativePath);
    const existingScript = Array.from(document.scripts).find(script => script.src === absolute);

    if (existingScript) {
      return new Promise((resolve, reject) => {
        const done = () => {
          const api = globalThis[globalName];
          if (api) {
            resolve(api);
          } else {
            reject(new Error(`GLOBAL_NOT_PUBLISHED:${globalName}`));
          }
        };

        existingScript.addEventListener("load", done, { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error(`SCRIPT_LOAD_FAILED:${relativePath}`)),
          { once: true }
        );
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = absolute;
      script.defer = true;
      script.dataset.archcoinRuntimeDependency = globalName;

      script.addEventListener(
        "load",
        () => {
          const api = globalThis[globalName];
          if (!api) {
            reject(new Error(`GLOBAL_NOT_PUBLISHED:${globalName}`));
            return;
          }
          resolve(api);
        },
        { once: true }
      );

      script.addEventListener(
        "error",
        () => reject(new Error(`SCRIPT_LOAD_FAILED:${relativePath}`)),
        { once: true }
      );

      document.head.appendChild(script);
    });
  }

  function handleControllerFailure(event) {
    const detail = event && event.detail ? event.detail : {};
    state.failureReason = detail.reason ? String(detail.reason) : "CONTROLLER_FAILURE_EVENT";
    updateBridgeState("controller-failure-event");
  }

  function handleCrystalsFailure(event) {
    const detail = event && event.detail ? event.detail : {};
    state.failureReason = detail.reason ? String(detail.reason) : "CRYSTALS_FAILURE_EVENT";
    updateBridgeState("crystals-failure-event");
  }

  function bindEvents() {
    globalThis.addEventListener("ARCHCOIN_CONTROLLER_FAILURE", handleControllerFailure);
    globalThis.addEventListener("ARCHCOIN_CRYSTALS_RENDER_FAILURE", handleCrystalsFailure);

    globalThis.addEventListener(
      "resize",
      () => {
        emitReceipt({ lastAction: "window-resize-sync" });
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
      if (!state.crystals || !crystalsIsUsable(state.crystals)) {
        emitReceipt({ lastAction: "visibilitychange-no-crystals" });
        return;
      }

      if (document.hidden) {
        if (typeof state.crystals.stop === "function") {
          state.crystals.stop();
          state.stoppedByBridge = false;
        }
        emitReceipt({ lastAction: "crystals-paused-hidden" });
        return;
      }

      if (typeof state.crystals.start === "function") {
        state.crystals.start();
      }
      emitReceipt({ lastAction: "crystals-resumed-visible" });
    });
  }

  function exposeApi() {
    globalThis.ARCHCOIN_RUNTIME_BRIDGE = Object.freeze({
      contract: CONTRACT,
      receipt: () => Object.freeze({ ...RECEIPT }),
      refresh: () => {
        updateBridgeState("bridge-refresh-api");
        return true;
      },
      start: () => {
        state.stoppedByBridge = false;

        if (state.crystals && typeof state.crystals.start === "function") {
          state.crystals.start();
        }

        state.started = true;
        updateBridgeState("bridge-started");
        return true;
      },
      stop: () => {
        state.stoppedByBridge = true;

        if (state.crystals && typeof state.crystals.stop === "function") {
          state.crystals.stop();
        }

        state.started = false;
        updateBridgeState("bridge-stopped");
        return true;
      },
      controller: () => state.controller || null,
      crystals: () => state.crystals || null
    });
  }

  function resolveDom() {
    state.root = qs("[data-archcoin-root]");
    if (!state.root) {
      throw new Error("ARCHCOIN_ROOT_NOT_FOUND");
    }

    state.scene = qs("[data-archcoin-scene]", state.root);
    if (!state.scene) {
      throw new Error("ARCHCOIN_SCENE_NOT_FOUND");
    }

    state.objects = qs("[data-archcoin-objects]", state.root);
    if (!state.objects) {
      throw new Error("ARCHCOIN_OBJECTS_NOT_FOUND");
    }

    state.geometryMount = qs("[data-archcoin-crystals-mount]", state.root);
    if (!state.geometryMount) {
      throw new Error("ARCHCOIN_CRYSTALS_MOUNT_NOT_FOUND");
    }

    state.guidance = qs("[data-archcoin-guidance]", state.root);
    state.controllerReceiptOutput = qs("[data-archcoin-controller-receipt]", state.root);
    state.crystalsReceiptOutput = qs("[data-archcoin-crystals-receipt]", state.root);

    state.runtimeReceiptOutput =
      qs("[data-archcoin-runtime-receipt]", state.root) ||
      (() => {
        const output = document.createElement("output");
        output.className = "receipt";
        output.dataset.archcoinRuntimeReceipt = "true";
        output.setAttribute("aria-hidden", "true");
        state.root.appendChild(output);
        return output;
      })();
  }

  async function bootstrap() {
    emitReceipt({ lastAction: "bootstrap-begin" });

    state.controller = await ensureScript("./index.controller.js", "DGB_ARCHCOIN_CONTROLLER");
    if (!controllerIsUsable(state.controller)) {
      throw new Error("DGB_ARCHCOIN_CONTROLLER_CONTRACT_INVALID");
    }

    emitReceipt({ lastAction: "controller-loaded" });

    state.crystals = await ensureScript("./index.crystals.js", "ARCHCOIN_CRYSTALS");
    if (!crystalsIsUsable(state.crystals)) {
      throw new Error("ARCHCOIN_CRYSTALS_CONTRACT_INVALID");
    }

    state.started = true;
    state.bridgeInitialized = true;
    state.failureReason = "";
    updateBridgeState("bootstrap-complete");
  }

  function init() {
    try {
      resolveDom();
      exposeApi();
      bindEvents();

      state.bridgeState = STATES.BOOTING;
      state.bridgeInitialized = true;
      emitReceipt({ lastAction: "bridge-initialized" });

      bootstrap().catch(error => {
        failHeld(
          `ARCHCOIN_RUNTIME_BRIDGE_BOOTSTRAP_FAILURE:${
            error && error.message ? error.message : String(error)
          }`,
          "bootstrap-failed"
        );
      });
    } catch (error) {
      failHeld(
        `ARCHCOIN_RUNTIME_BRIDGE_INIT_FAILURE:${
          error && error.message ? error.message : String(error)
        }`,
        "bridge-init-failed"
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
