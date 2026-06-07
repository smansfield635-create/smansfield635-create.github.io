// /assets/hearth/hearth.canvas.launch.js
// HEARTH_CANVAS_LAUNCH_PREFACE_HOLD_DECOMMISSION_GATE_TNT_v1
// Full-file addition.
// Canvas Launch / preface-hold decommission gate only.
// Purpose:
// - Hold the initial Hearth preface/globe until the Canvas Hub declares the canvas surface worthy.
// - Boot/mount/start the Canvas Hub through public APIs only.
// - Consume the Canvas Hub handshake:
//   /assets/hearth/hearth.canvas.js
//   HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// - Keep the preface visible by default.
// - Decommission the preface only after Canvas publishes prefaceDecommissionAuthorized=true and surfaceWorthy=true.
// - Preserve Canvas as surface-worthiness authority.
// - Preserve this file as preface hold / preface decommission enforcement only.
// Does not own:
// - canvas drawing truth
// - canvas threshold authority
// - terrain/material/hydrology/elevation truth
// - controls
// - route conductor
// - diagnostic rail
// - North F21
// - ready text
// - visual pass
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT =
    "HEARTH_CANVAS_LAUNCH_PREFACE_HOLD_DECOMMISSION_GATE_TNT_v1";
  const RECEIPT =
    "HEARTH_CANVAS_LAUNCH_PREFACE_HOLD_DECOMMISSION_GATE_RECEIPT_v1";

  const VERSION =
    "2026-06-07.hearth-canvas-launch-preface-hold-decommission-gate-v1";

  const FILE = "/assets/hearth/hearth.canvas.launch.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const PREFACE_ID = "hearthCanvasLaunchPreface";
  const STYLE_ID = "hearthCanvasLaunchPrefaceStyle";

  const POLL_MS = 420;
  const MAX_BOOT_ATTEMPTS = 4;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvasLaunch: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const CANVAS_API_PATHS = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubSourceHoldPlanetSurfaceThresholdReceiver",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubSourceHoldPlanetSurfaceThresholdReceiver"
  ]);

  const CANVAS_PACKET_PATHS = Object.freeze([
    "HEARTH.canvasPrefaceHandshakePacket",
    "HEARTH.canvasSurfaceWorthinessPacket",
    "HEARTH.canvasPrefaceDecommissionPacket",
    "HEARTH_CANVAS_PREFACE_HANDSHAKE_PACKET",
    "HEARTH_CANVAS_SURFACE_WORTHINESS_PACKET",
    "HEARTH_CANVAS_PREFACE_DECOMMISSION_PACKET",
    "DEXTER_LAB.hearthCanvasPrefaceHandshakePacket",
    "DEXTER_LAB.hearthCanvasSurfaceWorthinessPacket",
    "DEXTER_LAB.hearthCanvasPrefaceDecommissionPacket"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    canvasFile: CANVAS_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

    loaded: true,
    booted: false,
    booting: false,
    mounted: false,
    started: false,
    disposed: false,

    launchRole: "preface-hold-decommission-gate",
    thresholdAuthorityOwned: false,
    prefaceHoldOwned: true,
    prefaceDecommissionEnforcementOwned: true,
    canvasBootInvocationOwned: true,

    currentRouteStatus: "UNKNOWN",
    domMutationAuthorized: false,

    prefaceId: PREFACE_ID,
    prefaceElementCreated: false,
    prefaceElementFound: false,
    prefaceVisible: false,
    prefaceHeld: true,
    prefaceDecommissioned: false,
    prefaceDecommissionLatched: false,
    prefaceDecommissionAuthorizedObserved: false,
    prefaceDecommissionReason: "WAITING_CANVAS_HANDSHAKE",
    initialPrefaceState: "HELD_BY_DEFAULT",
    initialPrefaceMustRemain: true,

    canvasObserved: false,
    canvasSourcePath: "NONE",
    canvasContract: "UNKNOWN",
    canvasReceipt: "UNKNOWN",
    canvasPublicApiReady: false,

    canvasBootAttempted: false,
    canvasBootAttemptCount: 0,
    canvasBootStatus: "NOT_ATTEMPTED",
    canvasBootMethod: "NONE",
    canvasBootError: "NONE",

    launchPacketSentToCanvas: false,
    launchPacketMethod: "NONE",
    launchPacketStatus: "NOT_SENT",
    launchPacketError: "NONE",

    handshakeObserved: false,
    handshakeSource: "NONE",
    handshakeStatus: "WAITING_CANVAS_HANDSHAKE",
    handshakePacketType: "NONE",
    handshakeContract: "UNKNOWN",
    handshakeReceipt: "UNKNOWN",
    handshakeCount: 0,

    surfaceWorthy: false,
    surfaceWorthinessStatus: "WAITING_CANVAS_HANDSHAKE",
    surfaceWorthinessScore: 0,
    surfaceWorthinessFirstFailedCoordinate: "WAITING_CANVAS_HANDSHAKE",
    prefaceHoldRequired: true,

    lastCanvasPacketAt: "",
    lastPacketSource: "NONE",
    lastPacketType: "NONE",
    lastAction: "LOADED",
    lastError: "NONE",
    firstFailedCoordinate: "WAITING_CANVAS_HANDSHAKE",
    recommendedNextOwner: "CANVAS_HUB",
    recommendedNextFile: CANVAS_FILE,
    recommendedNextAction: "WAIT_FOR_CANVAS_PREFACE_HANDSHAKE_OR_BOOT_CANVAS_HUB",

    pollActive: false,
    pollCount: 0,
    bootAttemptTimer: 0,
    pollTimer: 0,

    events: [],
    errors: [],
    updatedAt: "",

    ...NO_CLAIMS
  };

  const api = {};

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function bool(value) {
    return value === true || value === "true" || value === "TRUE" || value === 1 || value === "1";
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_LAUNCH_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 140);
    state.lastAction = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_LAUNCH_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 80);
    state.lastError = item.message || item.code;
    state.lastAction = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function currentPath() {
    try {
      return root.location && root.location.pathname ? root.location.pathname : "";
    } catch (_error) {
      return "";
    }
  }

  function evaluateRouteStatus() {
    const path = currentPath();

    if (path === DIAGNOSTIC_ROUTE || path === DIAGNOSTIC_ROUTE.replace(/\/$/, "")) {
      state.currentRouteStatus = "DIAGNOSTIC_RECEIVER";
      state.domMutationAuthorized = false;
      return state.currentRouteStatus;
    }

    if (path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, "")) {
      state.currentRouteStatus = "HEARTH_TARGET_ROUTE";
      state.domMutationAuthorized = true;
      return state.currentRouteStatus;
    }

    state.currentRouteStatus = "UNKNOWN_ROUTE";
    state.domMutationAuthorized = Boolean(doc && /\/showroom\/globe\/hearth\/?$/.test(path));
    return state.currentRouteStatus;
  }

  function safeQuery(selector, base = doc) {
    if (!base || !isFunction(base.querySelector)) return null;

    try {
      return base.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function getMount() {
    if (!doc) return null;

    return (
      safeQuery("#hearthCanvasMount") ||
      safeQuery("[data-hearth-canvas-mount='true']") ||
      safeQuery("[data-hearth-visible-planet-mount='true']") ||
      safeQuery("[data-hearth-planet-engine-mount='true']") ||
      safeQuery("#hearthGlobeStage") ||
      safeQuery("[data-hearth-globe-stage='true']")
    );
  }

  function ensureStyle() {
    if (!doc || doc.getElementById(STYLE_ID)) return;

    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.dataset.hearthCanvasLaunchPrefaceStyle = "true";
    style.textContent = `
      #${PREFACE_ID} {
        position: absolute;
        inset: 0;
        z-index: 8;
        display: grid;
        place-items: center;
        pointer-events: none;
        opacity: 1;
        transition: opacity 220ms ease;
      }
      #${PREFACE_ID}[data-hearth-preface-decommissioned="true"] {
        opacity: 0;
      }
      #${PREFACE_ID} .hearth-canvas-launch-preface-card {
        display: grid;
        place-items: center;
        gap: 0.65rem;
        min-width: min(72vw, 420px);
        min-height: min(72vw, 420px);
        color: rgba(236, 244, 255, 0.92);
        text-align: center;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #${PREFACE_ID} .hearth-canvas-launch-preface-orb {
        width: clamp(238px, 54vw, 520px);
        height: clamp(238px, 54vw, 520px);
        border-radius: 50%;
        background:
          radial-gradient(circle at 36% 28%, rgba(255, 232, 168, 0.28), transparent 0 14%, rgba(55, 133, 185, 0.42) 18%, transparent 39%),
          radial-gradient(circle at 52% 56%, rgba(31, 78, 122, 0.94), rgba(8, 28, 61, 0.98) 58%, rgba(2, 8, 22, 1) 100%);
        box-shadow:
          0 0 42px rgba(102, 207, 255, 0.22),
          inset -28px -32px 64px rgba(0, 0, 0, 0.38),
          inset 16px 12px 48px rgba(255, 234, 176, 0.08);
        position: relative;
        overflow: hidden;
      }
      #${PREFACE_ID} .hearth-canvas-launch-preface-orb::before {
        content: "";
        position: absolute;
        inset: 13%;
        border-radius: 50%;
        border: 1px solid rgba(216, 238, 255, 0.18);
        box-shadow:
          0 0 0 26px rgba(216, 238, 255, 0.035),
          0 0 0 74px rgba(216, 238, 255, 0.025);
      }
      #${PREFACE_ID} .hearth-canvas-launch-preface-orb::after {
        content: "";
        position: absolute;
        inset: -8%;
        background:
          linear-gradient(72deg, transparent 0 46%, rgba(255,255,255,0.08) 49%, transparent 54%),
          linear-gradient(114deg, transparent 0 44%, rgba(255,231,162,0.08) 47%, transparent 52%);
        transform: rotate(8deg);
      }
      #${PREFACE_ID} .hearth-canvas-launch-preface-label {
        max-width: 32rem;
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        background: rgba(2, 8, 22, 0.58);
        border: 1px solid rgba(216, 238, 255, 0.18);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.72rem;
      }
    `;

    const head = doc.head || doc.documentElement;
    if (head && isFunction(head.appendChild)) head.appendChild(style);
  }

  function ensurePreface() {
    evaluateRouteStatus();

    if (!state.domMutationAuthorized) {
      state.prefaceHeld = true;
      state.prefaceVisible = false;
      state.prefaceElementFound = false;
      state.firstFailedCoordinate = "DOM_MUTATION_NOT_AUTHORIZED_ON_CURRENT_ROUTE";
      state.recommendedNextOwner = "CANVAS_LAUNCH_ROUTE_PLACEMENT";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "LOAD_CANVAS_LAUNCH_ON_HEARTH_TARGET_ROUTE_ONLY";
      record("HEARTH_CANVAS_LAUNCH_PREFACE_DOM_HOLD_DIAGNOSTIC_OR_UNKNOWN_ROUTE", {
        currentRouteStatus: state.currentRouteStatus
      });
      return null;
    }

    const mount = getMount();

    if (!mount) {
      state.prefaceHeld = true;
      state.prefaceVisible = false;
      state.prefaceElementFound = false;
      state.firstFailedCoordinate = "HEARTH_CANVAS_MOUNT_NOT_FOUND";
      state.recommendedNextOwner = "HTML_MOUNT_OR_ROUTE_CONDUCTOR";
      state.recommendedNextFile = TARGET_ROUTE;
      state.recommendedNextAction = "VERIFY_HEARTH_CANVAS_MOUNT_EXISTS_BEFORE_LAUNCH_PREFACE";
      record("HEARTH_CANVAS_LAUNCH_PREFACE_MOUNT_NOT_FOUND");
      return null;
    }

    ensureStyle();

    try {
      const computed = root.getComputedStyle ? root.getComputedStyle(mount) : null;
      if (computed && computed.position === "static" && mount.style) {
        mount.style.position = "relative";
      }
    } catch (_error) {}

    let preface = doc.getElementById(PREFACE_ID);

    if (!preface) {
      preface = doc.createElement("div");
      preface.id = PREFACE_ID;
      preface.dataset.hearthCanvasLaunchPreface = "true";
      preface.dataset.hearthInitialPreface = "true";
      preface.dataset.hearthPrefaceHeld = "true";
      preface.dataset.hearthPrefaceDecommissioned = "false";
      preface.dataset.hearthPrefaceOwner = CONTRACT;
      preface.setAttribute("aria-hidden", "true");

      const card = doc.createElement("div");
      card.className = "hearth-canvas-launch-preface-card";

      const orb = doc.createElement("div");
      orb.className = "hearth-canvas-launch-preface-orb";

      const label = doc.createElement("div");
      label.className = "hearth-canvas-launch-preface-label";
      label.textContent = "Hearth source preface";

      card.appendChild(orb);
      card.appendChild(label);
      preface.appendChild(card);
      mount.appendChild(preface);

      state.prefaceElementCreated = true;

      record("HEARTH_CANVAS_LAUNCH_PREFACE_CREATED", {
        mountSelector: mount.id ? `#${mount.id}` : "HEARTH_CANVAS_MOUNT",
        prefaceId: PREFACE_ID
      });
    }

    state.prefaceElementFound = true;

    if (!state.prefaceDecommissionLatched) {
      preface.hidden = false;
      preface.style.display = "grid";
      preface.dataset.hearthPrefaceHeld = "true";
      preface.dataset.hearthPrefaceDecommissioned = "false";
      preface.dataset.hearthPrefaceDecommissionAuthorizedObserved = "false";
      state.prefaceHeld = true;
      state.prefaceVisible = true;
      state.initialPrefaceMustRemain = true;
      state.initialPrefaceState = "HELD_BY_DEFAULT";
    }

    state.mounted = true;
    return preface;
  }

  function findCanvasApi() {
    for (const path of CANVAS_API_PATHS) {
      const candidate = readPath(path);
      if (!candidate || (!isObject(candidate) && !isFunction(candidate))) continue;
      if (candidate === api) continue;

      const contract = safeString(candidate.contract || candidate.CONTRACT || candidate.canvasContract || "");

      state.canvasObserved = true;
      state.canvasSourcePath = path;
      state.canvasContract = contract || "UNKNOWN";
      state.canvasReceipt = safeString(candidate.receipt || candidate.RECEIPT || candidate.canvasReceipt || "UNKNOWN");
      state.canvasPublicApiReady = Boolean(
        isFunction(candidate.boot) ||
        isFunction(candidate.init) ||
        isFunction(candidate.start) ||
        isFunction(candidate.mount) ||
        isFunction(candidate.getPrefaceHandshakePacket) ||
        isFunction(candidate.composePrefaceHandshakePacket) ||
        isFunction(candidate.getCanvasSurfaceWorthinessPacket) ||
        isFunction(candidate.getPrefaceDecommissionPacket)
      );

      return candidate;
    }

    state.canvasObserved = false;
    state.canvasSourcePath = "NONE";
    state.canvasContract = "UNKNOWN";
    state.canvasReceipt = "UNKNOWN";
    state.canvasPublicApiReady = false;

    return null;
  }

  function callCanvasBoot(canvas, reason) {
    if (!canvas || state.canvasBootAttemptCount >= MAX_BOOT_ATTEMPTS) {
      return false;
    }

    const methods = ["boot", "init", "mount", "start", "run"];

    for (const method of methods) {
      if (!isFunction(canvas[method])) continue;

      try {
        state.canvasBootAttempted = true;
        state.canvasBootAttemptCount += 1;
        state.canvasBootMethod = method;
        state.canvasBootStatus = "CALLING_CANVAS_PUBLIC_API";

        const result = canvas[method]({
          source: "HEARTH_CANVAS_LAUNCH",
          sourceFile: FILE,
          reason,
          prefaceHoldRequired: true,
          prefaceDecommissionAuthorityOwnedByCanvas: true,
          launchOwnsThresholdAuthority: false,
          ...NO_CLAIMS
        });

        if (result && isFunction(result.then)) {
          result.catch((error) => {
            state.canvasBootStatus = "CANVAS_PUBLIC_API_ASYNC_ERROR";
            state.canvasBootError = error && error.message ? String(error.message) : safeString(error);
            recordError("HEARTH_CANVAS_LAUNCH_CANVAS_BOOT_ASYNC_ERROR", error, { method });
          });
        }

        state.canvasBootStatus = "CANVAS_PUBLIC_API_CALLED";
        state.canvasBootError = "NONE";

        record("HEARTH_CANVAS_LAUNCH_CANVAS_BOOT_API_CALLED", {
          method,
          reason,
          canvasSourcePath: state.canvasSourcePath
        });

        return true;
      } catch (error) {
        state.canvasBootStatus = "CANVAS_PUBLIC_API_ERROR";
        state.canvasBootError = error && error.message ? String(error.message) : safeString(error);
        recordError("HEARTH_CANVAS_LAUNCH_CANVAS_BOOT_API_ERROR", error, { method });
      }
    }

    state.canvasBootStatus = "NO_CANVAS_BOOT_METHOD_AVAILABLE";
    state.canvasBootMethod = "NONE";
    return false;
  }

  function composeLaunchPacket(reason = "launch-packet") {
    return {
      packetType: "HEARTH_CANVAS_LAUNCH_PREFACE_HOLD_REQUEST_PACKET_v1",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_LAUNCH",
      sourceRole: "preface-hold-decommission-gate",
      targetFile: CANVAS_FILE,
      targetCanvasContract: EXPECTED_CANVAS_CONTRACT,
      reason,

      prefaceHoldOwnedByLaunch: true,
      prefaceHoldRequired: true,
      initialPrefaceMustRemain: !state.prefaceDecommissionLatched,
      initialPrefaceState: state.initialPrefaceState,
      prefaceElementFound: state.prefaceElementFound,
      prefaceVisible: state.prefaceVisible,
      prefaceDecommissioned: state.prefaceDecommissioned,
      prefaceDecommissionAuthorityOwnedByCanvas: true,
      launchOwnsThresholdAuthority: false,

      canvasObserved: state.canvasObserved,
      canvasSourcePath: state.canvasSourcePath,
      canvasContract: state.canvasContract,
      canvasPublicApiReady: state.canvasPublicApiReady,

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function sendLaunchPacketToCanvas(reason = "send-launch-packet") {
    const canvas = findCanvasApi();
    const packet = composeLaunchPacket(reason);

    if (!canvas) {
      state.launchPacketStatus = "CANVAS_API_NOT_OBSERVED";
      state.launchPacketMethod = "NONE";
      return {
        sent: false,
        status: state.launchPacketStatus,
        packet
      };
    }

    const methods = [
      "receivePrefaceLaunchPacket",
      "receiveCanvasLaunchPacket",
      "receiveLaunchPacket",
      "consumePrefaceLaunchPacket",
      "acceptPrefaceLaunchPacket"
    ];

    for (const method of methods) {
      if (!isFunction(canvas[method])) continue;

      try {
        const result = canvas[method](clonePlain(packet), {
          source: "HEARTH_CANVAS_LAUNCH",
          sourceFile: FILE,
          reason
        });

        state.launchPacketSentToCanvas = true;
        state.launchPacketMethod = method;
        state.launchPacketStatus = "SENT_TO_CANVAS_PUBLIC_API";
        state.launchPacketError = "NONE";

        record("HEARTH_CANVAS_LAUNCH_PACKET_SENT_TO_CANVAS", {
          method,
          reason
        });

        if (result && isFunction(result.then)) {
          result.catch((error) => {
            state.launchPacketStatus = "CANVAS_LAUNCH_PACKET_ASYNC_ERROR";
            state.launchPacketError = error && error.message ? String(error.message) : safeString(error);
            recordError("HEARTH_CANVAS_LAUNCH_PACKET_ASYNC_ERROR", error, { method });
          });
        }

        return {
          sent: true,
          status: state.launchPacketStatus,
          method,
          packet
        };
      } catch (error) {
        state.launchPacketStatus = "CANVAS_LAUNCH_PACKET_SEND_ERROR";
        state.launchPacketError = error && error.message ? String(error.message) : safeString(error);
        recordError("HEARTH_CANVAS_LAUNCH_PACKET_SEND_ERROR", error, { method });
      }
    }

    state.launchPacketStatus = "CANVAS_LAUNCH_PACKET_RECEIVER_NOT_AVAILABLE";
    state.launchPacketMethod = "NONE";

    return {
      sent: false,
      status: state.launchPacketStatus,
      packet
    };
  }

  function readCanvasPacketFromApi(canvas, reason) {
    if (!canvas) return null;

    const methods = [
      "getPrefaceDecommissionPacket",
      "getCanvasSurfaceWorthinessPacket",
      "getPrefaceHandshakePacket",
      "composePrefaceHandshakePacket",
      "releaseToPrefaceLaunch",
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getSummary"
    ];

    for (const method of methods) {
      if (!isFunction(canvas[method])) continue;

      try {
        const result = canvas[method]({
          source: "HEARTH_CANVAS_LAUNCH",
          sourceFile: FILE,
          reason,
          readOnly: method !== "releaseToPrefaceLaunch",
          ...NO_CLAIMS
        });

        if (isObject(result)) {
          return {
            packet: result,
            source: `CANVAS_API:${method}`
          };
        }
      } catch (error) {
        recordError("HEARTH_CANVAS_LAUNCH_CANVAS_PACKET_READ_ERROR", error, { method });
      }
    }

    return null;
  }

  function readCanvasPacketFromGlobals() {
    for (const path of CANVAS_PACKET_PATHS) {
      const packet = readPath(path);
      if (isObject(packet)) {
        return {
          packet,
          source: `GLOBAL:${path}`
        };
      }
    }

    return null;
  }

  function normalizeHandshakePacket(packet, source) {
    const p = isObject(packet) ? packet : {};

    return {
      packet,
      source,
      packetType: safeString(p.packetType || p.PACKET_NAME || p.canvasPrefacePacketType || "UNKNOWN"),
      contract: safeString(p.contract || p.CONTRACT || p.canvasContract || p.currentCanvasParentContract || "UNKNOWN"),
      receipt: safeString(p.receipt || p.RECEIPT || p.canvasReceipt || p.currentCanvasParentReceipt || "UNKNOWN"),

      surfaceWorthy: bool(p.surfaceWorthy),
      surfaceWorthinessStatus: safeString(
        p.surfaceWorthinessStatus ||
        p.SURFACE_WORTHINESS_STATUS ||
        p.planetSurfaceThresholdStatus ||
        p.PLANET_SURFACE_THRESHOLD_STATUS ||
        "UNKNOWN"
      ),
      surfaceWorthinessScore: safeNumber(
        p.surfaceWorthinessScore ||
        p.SURFACE_WORTHINESS_SCORE ||
        p.thresholdSampleSuccessRatio ||
        p.THRESHOLD_SAMPLE_SUCCESS_RATIO,
        0
      ),
      surfaceWorthinessFirstFailedCoordinate: safeString(
        p.surfaceWorthinessFirstFailedCoordinate ||
        p.SURFACE_WORTHINESS_FIRST_FAILED_COORDINATE ||
        p.thresholdFirstFailedCoordinate ||
        p.THRESHOLD_FIRST_FAILED_COORDINATE ||
        p.firstFailedCoordinate ||
        p.FIRST_FAILED_COORDINATE ||
        "UNKNOWN"
      ),

      prefaceDecommissionAuthorized: bool(p.prefaceDecommissionAuthorized),
      prefaceHoldRequired:
        p.prefaceHoldRequired === undefined || p.prefaceHoldRequired === null
          ? true
          : bool(p.prefaceHoldRequired),

      canvasElementFound: bool(p.canvasElementFound || p.CANVAS_ELEMENT_FOUND),
      canvasSelector: safeString(p.canvasSelector || p.CANVAS_SELECTOR || "UNKNOWN"),
      canvasId: safeString(p.canvasId || p.CANVAS_ID || "UNKNOWN"),
      visiblePlanetProofReady: bool(p.visiblePlanetProofReady || p.VISIBLE_PLANET_PROOF_READY),
      planetSurfaceReady: bool(p.planetSurfaceReady || p.PLANET_SURFACE_READY)
    };
  }

  function consumeCanvasHandshakePacket(packet, options = {}) {
    const normalized = normalizeHandshakePacket(
      packet,
      options.source || "DIRECT_PACKET"
    );

    state.handshakeObserved = true;
    state.handshakeSource = normalized.source;
    state.handshakePacketType = normalized.packetType;
    state.handshakeContract = normalized.contract;
    state.handshakeReceipt = normalized.receipt;
    state.handshakeCount += 1;
    state.lastCanvasPacketAt = nowIso();
    state.lastPacketSource = normalized.source;
    state.lastPacketType = normalized.packetType;

    state.surfaceWorthy = normalized.surfaceWorthy;
    state.surfaceWorthinessStatus = normalized.surfaceWorthinessStatus;
    state.surfaceWorthinessScore = normalized.surfaceWorthinessScore;
    state.surfaceWorthinessFirstFailedCoordinate = normalized.surfaceWorthinessFirstFailedCoordinate;
    state.prefaceHoldRequired = normalized.prefaceHoldRequired;
    state.prefaceDecommissionAuthorizedObserved = normalized.prefaceDecommissionAuthorized;

    if (normalized.prefaceDecommissionAuthorized && normalized.surfaceWorthy) {
      state.handshakeStatus = "CANVAS_AUTHORIZED_PREFACE_DECOMMISSION";
      state.prefaceDecommissionReason = "CANVAS_SURFACE_WORTHY_AND_DECOMMISSION_AUTHORIZED";
      decommissionPreface("canvas-handshake-authorized");
    } else {
      state.handshakeStatus = "CANVAS_HANDSHAKE_OBSERVED_PREFACE_HELD";
      state.prefaceDecommissionReason =
        normalized.surfaceWorthinessFirstFailedCoordinate || "CANVAS_SURFACE_NOT_WORTHY_YET";
      holdPreface("canvas-handshake-preface-held");
    }

    updateDataset();
    publishGlobals("consume-canvas-handshake");

    return getReceiptLight(false);
  }

  function inspectCanvasHandshake(reason = "inspect-canvas-handshake") {
    const canvas = findCanvasApi();

    if (canvas) {
      const fromApi = readCanvasPacketFromApi(canvas, reason);
      if (fromApi && fromApi.packet) {
        return consumeCanvasHandshakePacket(fromApi.packet, {
          source: fromApi.source
        });
      }
    }

    const fromGlobal = readCanvasPacketFromGlobals();
    if (fromGlobal && fromGlobal.packet) {
      return consumeCanvasHandshakePacket(fromGlobal.packet, {
        source: fromGlobal.source
      });
    }

    state.handshakeStatus = "WAITING_CANVAS_HANDSHAKE";
    state.firstFailedCoordinate = "CANVAS_PREFACE_HANDSHAKE_NOT_OBSERVED";
    state.recommendedNextOwner = "CANVAS_HUB";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction = "PUBLISH_CANVAS_PREFACE_HANDSHAKE_PACKET_OR_BOOT_CANVAS_HUB";
    holdPreface("canvas-handshake-not-observed");

    return getReceiptLight(false);
  }

  function holdPreface(reason = "hold-preface") {
    if (state.prefaceDecommissionLatched) return false;

    const preface = ensurePreface();

    state.prefaceHeld = true;
    state.prefaceVisible = Boolean(preface);
    state.initialPrefaceMustRemain = true;
    state.initialPrefaceState = "HELD_UNTIL_CANVAS_WORTHY";
    state.prefaceDecommissioned = false;
    state.prefaceDecommissionReason = state.prefaceDecommissionReason || "WAITING_CANVAS_HANDSHAKE";

    if (preface) {
      preface.hidden = false;
      preface.style.display = "grid";
      preface.dataset.hearthPrefaceHeld = "true";
      preface.dataset.hearthPrefaceDecommissioned = "false";
      preface.dataset.hearthPrefaceHoldReason = reason;
      preface.dataset.hearthCanvasLaunchContract = CONTRACT;
    }

    record("HEARTH_CANVAS_LAUNCH_PREFACE_HELD", {
      reason,
      prefaceVisible: state.prefaceVisible,
      handshakeStatus: state.handshakeStatus
    });

    return true;
  }

  function decommissionPreface(reason = "decommission-preface") {
    const preface = doc ? doc.getElementById(PREFACE_ID) : null;

    state.prefaceDecommissionLatched = true;
    state.prefaceDecommissioned = true;
    state.prefaceHeld = false;
    state.prefaceVisible = false;
    state.initialPrefaceMustRemain = false;
    state.initialPrefaceState = "DECOMMISSIONED_BY_CANVAS_AUTHORITY";
    state.prefaceHoldRequired = false;
    state.prefaceDecommissionReason = reason;
    state.firstFailedCoordinate = "NONE";
    state.recommendedNextOwner = "TEACHER_REVIEW";
    state.recommendedNextFile = FILE;
    state.recommendedNextAction =
      "REVIEW_CANVAS_LAUNCH_PREFACE_DECOMMISSION_WITH_NO_READY_OR_VISUAL_PASS_CLAIM";

    if (preface) {
      preface.dataset.hearthPrefaceHeld = "false";
      preface.dataset.hearthPrefaceDecommissioned = "true";
      preface.dataset.hearthPrefaceDecommissionReason = reason;
      preface.dataset.hearthPrefaceDecommissionAuthorizedObserved = "true";

      root.setTimeout(() => {
        try {
          if (preface.parentNode) preface.parentNode.removeChild(preface);
        } catch (_error) {}
      }, 260);
    }

    stopPolling("preface-decommissioned");

    record("HEARTH_CANVAS_LAUNCH_PREFACE_DECOMMISSIONED", {
      reason,
      surfaceWorthy: state.surfaceWorthy,
      prefaceDecommissionAuthorizedObserved: state.prefaceDecommissionAuthorizedObserved
    });

    updateDataset();
    publishGlobals("preface-decommissioned");

    return true;
  }

  function startPolling(reason = "start-polling") {
    if (state.pollTimer || state.disposed || state.prefaceDecommissionLatched) return;

    state.pollActive = true;

    state.pollTimer = root.setInterval(() => {
      if (state.disposed || state.prefaceDecommissionLatched) {
        stopPolling("disposed-or-decommissioned");
        return;
      }

      state.pollCount += 1;

      const canvas = findCanvasApi();

      if (canvas && state.canvasBootAttemptCount < MAX_BOOT_ATTEMPTS && state.canvasBootStatus !== "CANVAS_PUBLIC_API_CALLED") {
        callCanvasBoot(canvas, `poll-${state.pollCount}`);
      }

      inspectCanvasHandshake(`poll-${state.pollCount}`);
    }, POLL_MS);

    record("HEARTH_CANVAS_LAUNCH_HANDSHAKE_POLLING_STARTED", { reason });
  }

  function stopPolling(reason = "stop-polling") {
    if (state.pollTimer) {
      try {
        root.clearInterval(state.pollTimer);
      } catch (_error) {}
      state.pollTimer = 0;
    }

    state.pollActive = false;
    record("HEARTH_CANVAS_LAUNCH_HANDSHAKE_POLLING_STOPPED", { reason });
  }

  function attachEventListeners() {
    if (!doc || state.eventsAttached) return;

    const handler = (event) => {
      const detail = event && event.detail ? event.detail : {};
      consumeCanvasHandshakePacket(detail, {
        source: `EVENT:${event.type}`
      });
    };

    try {
      doc.addEventListener("hearth:canvas-preface-handshake", handler);
      doc.addEventListener("hearth:canvas-surface-worthiness", handler);
      doc.addEventListener("hearth:canvas-preface-decommission", handler);

      if (isFunction(root.addEventListener)) {
        root.addEventListener("hearth:canvas-preface-handshake", handler);
        root.addEventListener("hearth:canvas-surface-worthiness", handler);
        root.addEventListener("hearth:canvas-preface-decommission", handler);
      }

      state.eventsAttached = true;

      record("HEARTH_CANVAS_LAUNCH_HANDSHAKE_EVENT_LISTENERS_ATTACHED");
    } catch (error) {
      recordError("HEARTH_CANVAS_LAUNCH_EVENT_LISTENER_ATTACHMENT_FAILED", error);
    }
  }

  function boot(options = {}) {
    if (state.booted && !options.force) return getReceipt();

    state.booting = true;
    state.started = true;
    state.updatedAt = nowIso();

    evaluateRouteStatus();
    publishGlobals("boot-early");
    ensurePreface();
    attachEventListeners();

    const canvas = findCanvasApi();
    if (canvas) callCanvasBoot(canvas, options.reason || "boot");

    sendLaunchPacketToCanvas(options.reason || "boot");
    inspectCanvasHandshake(options.reason || "boot");
    startPolling(options.reason || "boot");

    state.booted = true;
    state.booting = false;

    record("HEARTH_CANVAS_LAUNCH_BOOT_COMPLETE", {
      canvasObserved: state.canvasObserved,
      canvasSourcePath: state.canvasSourcePath,
      prefaceHeld: state.prefaceHeld,
      prefaceVisible: state.prefaceVisible,
      handshakeStatus: state.handshakeStatus
    });

    updateDataset();
    publishGlobals("boot-complete");

    return getReceipt();
  }

  function mount(options = {}) {
    ensurePreface();
    sendLaunchPacketToCanvas(options.reason || "mount");
    inspectCanvasHandshake(options.reason || "mount");
    startPolling(options.reason || "mount");
    updateDataset();
    publishGlobals("mount");

    return getReceiptLight(false);
  }

  function refresh(reason = "refresh") {
    evaluateRouteStatus();
    ensurePreface();

    const canvas = findCanvasApi();
    if (canvas) callCanvasBoot(canvas, reason);

    sendLaunchPacketToCanvas(reason);
    inspectCanvasHandshake(reason);

    if (!state.prefaceDecommissionLatched) startPolling(reason);

    updateDataset();
    publishGlobals(reason);

    return getReceipt();
  }

  function dispose(reason = "dispose") {
    stopPolling(reason);

    state.disposed = true;
    state.started = false;

    record("HEARTH_CANVAS_LAUNCH_DISPOSED", { reason });

    updateDataset();
    publishGlobals("dispose");

    return getReceipt();
  }

  function receiveCanvasPrefaceHandshakePacket(packet, options = {}) {
    return consumeCanvasHandshakePacket(packet, {
      ...options,
      source: options.source || "receiveCanvasPrefaceHandshakePacket"
    });
  }

  function receiveCanvasSurfaceWorthinessPacket(packet, options = {}) {
    return consumeCanvasHandshakePacket(packet, {
      ...options,
      source: options.source || "receiveCanvasSurfaceWorthinessPacket"
    });
  }

  function receiveCanvasPrefaceDecommissionPacket(packet, options = {}) {
    return consumeCanvasHandshakePacket(packet, {
      ...options,
      source: options.source || "receiveCanvasPrefaceDecommissionPacket"
    });
  }

  function composeReceiptLight() {
    return {
      packetType: "HEARTH_CANVAS_LAUNCH_PREFACE_HOLD_DECOMMISSION_GATE_RECEIPT_PACKET_v1",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      version: VERSION,
      file: FILE,
      canvasFile: CANVAS_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      loaded: state.loaded,
      booted: state.booted,
      mounted: state.mounted,
      started: state.started,
      disposed: state.disposed,

      currentRouteStatus: state.currentRouteStatus,
      domMutationAuthorized: state.domMutationAuthorized,

      launchRole: state.launchRole,
      thresholdAuthorityOwned: false,
      prefaceHoldOwned: true,
      prefaceDecommissionEnforcementOwned: true,
      canvasBootInvocationOwned: true,

      prefaceId: PREFACE_ID,
      prefaceElementCreated: state.prefaceElementCreated,
      prefaceElementFound: state.prefaceElementFound,
      prefaceVisible: state.prefaceVisible,
      prefaceHeld: state.prefaceHeld,
      prefaceDecommissioned: state.prefaceDecommissioned,
      prefaceDecommissionLatched: state.prefaceDecommissionLatched,
      prefaceDecommissionAuthorizedObserved: state.prefaceDecommissionAuthorizedObserved,
      prefaceDecommissionReason: state.prefaceDecommissionReason,
      initialPrefaceState: state.initialPrefaceState,
      initialPrefaceMustRemain: state.initialPrefaceMustRemain,

      canvasObserved: state.canvasObserved,
      canvasSourcePath: state.canvasSourcePath,
      canvasContract: state.canvasContract,
      canvasReceipt: state.canvasReceipt,
      canvasPublicApiReady: state.canvasPublicApiReady,

      canvasBootAttempted: state.canvasBootAttempted,
      canvasBootAttemptCount: state.canvasBootAttemptCount,
      canvasBootStatus: state.canvasBootStatus,
      canvasBootMethod: state.canvasBootMethod,
      canvasBootError: state.canvasBootError,

      launchPacketSentToCanvas: state.launchPacketSentToCanvas,
      launchPacketMethod: state.launchPacketMethod,
      launchPacketStatus: state.launchPacketStatus,
      launchPacketError: state.launchPacketError,

      handshakeObserved: state.handshakeObserved,
      handshakeSource: state.handshakeSource,
      handshakeStatus: state.handshakeStatus,
      handshakePacketType: state.handshakePacketType,
      handshakeContract: state.handshakeContract,
      handshakeReceipt: state.handshakeReceipt,
      handshakeCount: state.handshakeCount,

      surfaceWorthy: state.surfaceWorthy,
      surfaceWorthinessStatus: state.surfaceWorthinessStatus,
      surfaceWorthinessScore: state.surfaceWorthinessScore,
      surfaceWorthinessFirstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate,
      prefaceHoldRequired: state.prefaceHoldRequired,

      pollActive: state.pollActive,
      pollCount: state.pollCount,

      lastCanvasPacketAt: state.lastCanvasPacketAt,
      lastPacketSource: state.lastPacketSource,
      lastPacketType: state.lastPacketType,
      lastAction: state.lastAction,
      lastError: state.lastError,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,

      ownsCanvasDrawing: false,
      ownsCanvasThresholdAuthority: false,
      ownsCanvasSurfaceWorthinessAuthority: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsRouteConductor: false,
      ownsControls: false,
      ownsDiagnosticRail: false,
      ownsNorthF21: false,
      ownsReadyText: false,
      ownsVisualPass: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight() {
    return composeReceiptLight();
  }

  function getReceipt() {
    return {
      ...composeReceiptLight(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      state: clonePlain({
        ...state,
        events: undefined,
        errors: undefined
      }),
      updatedAt: nowIso()
    };
  }

  function getStatusText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_LAUNCH_PREFACE_HOLD_DECOMMISSION_GATE_STATUS",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `file=${r.file}`,
      `currentRouteStatus=${r.currentRouteStatus}`,
      `prefaceHeld=${r.prefaceHeld}`,
      `prefaceVisible=${r.prefaceVisible}`,
      `prefaceDecommissioned=${r.prefaceDecommissioned}`,
      `canvasObserved=${r.canvasObserved}`,
      `canvasSourcePath=${r.canvasSourcePath}`,
      `canvasBootStatus=${r.canvasBootStatus}`,
      `launchPacketStatus=${r.launchPacketStatus}`,
      `handshakeObserved=${r.handshakeObserved}`,
      `handshakeStatus=${r.handshakeStatus}`,
      `surfaceWorthy=${r.surfaceWorthy}`,
      `surfaceWorthinessStatus=${r.surfaceWorthinessStatus}`,
      `surfaceWorthinessFirstFailedCoordinate=${r.surfaceWorthinessFirstFailedCoordinate}`,
      `prefaceDecommissionAuthorizedObserved=${r.prefaceDecommissionAuthorizedObserved}`,
      `recommendedNextAction=${r.recommendedNextAction}`,
      `visualPassClaimed=false`,
      `generatedImage=false`,
      `graphicBox=false`,
      `webGL=false`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const ds = doc.documentElement.dataset;

    ds.hearthCanvasLaunchLoaded = "true";
    ds.hearthCanvasLaunchContract = CONTRACT;
    ds.hearthCanvasLaunchReceipt = RECEIPT;
    ds.hearthCanvasLaunchVersion = VERSION;
    ds.hearthCanvasLaunchFile = FILE;
    ds.hearthCanvasLaunchTargetCanvasFile = CANVAS_FILE;
    ds.hearthCanvasLaunchExpectedCanvasContract = EXPECTED_CANVAS_CONTRACT;

    ds.hearthCanvasLaunchCurrentRouteStatus = state.currentRouteStatus;
    ds.hearthCanvasLaunchDomMutationAuthorized = String(state.domMutationAuthorized);

    ds.hearthCanvasLaunchPrefaceHeld = String(state.prefaceHeld);
    ds.hearthCanvasLaunchPrefaceVisible = String(state.prefaceVisible);
    ds.hearthCanvasLaunchPrefaceDecommissioned = String(state.prefaceDecommissioned);
    ds.hearthCanvasLaunchPrefaceDecommissionLatched = String(state.prefaceDecommissionLatched);
    ds.hearthCanvasLaunchInitialPrefaceMustRemain = String(state.initialPrefaceMustRemain);
    ds.hearthCanvasLaunchInitialPrefaceState = state.initialPrefaceState;

    ds.hearthCanvasLaunchCanvasObserved = String(state.canvasObserved);
    ds.hearthCanvasLaunchCanvasSourcePath = state.canvasSourcePath;
    ds.hearthCanvasLaunchCanvasContract = state.canvasContract;
    ds.hearthCanvasLaunchCanvasPublicApiReady = String(state.canvasPublicApiReady);

    ds.hearthCanvasLaunchCanvasBootStatus = state.canvasBootStatus;
    ds.hearthCanvasLaunchPacketStatus = state.launchPacketStatus;
    ds.hearthCanvasLaunchHandshakeObserved = String(state.handshakeObserved);
    ds.hearthCanvasLaunchHandshakeSource = state.handshakeSource;
    ds.hearthCanvasLaunchHandshakeStatus = state.handshakeStatus;

    ds.hearthCanvasLaunchSurfaceWorthy = String(state.surfaceWorthy);
    ds.hearthCanvasLaunchSurfaceWorthinessStatus = state.surfaceWorthinessStatus;
    ds.hearthCanvasLaunchSurfaceWorthinessScore = String(state.surfaceWorthinessScore);
    ds.hearthCanvasLaunchSurfaceWorthinessFirstFailedCoordinate =
      state.surfaceWorthinessFirstFailedCoordinate;

    ds.hearthCanvasLaunchPrefaceDecommissionAuthorizedObserved =
      String(state.prefaceDecommissionAuthorizedObserved);
    ds.hearthCanvasLaunchPrefaceHoldRequired = String(state.prefaceHoldRequired);

    ds.hearthCanvasLaunchFirstFailedCoordinate = state.firstFailedCoordinate;
    ds.hearthCanvasLaunchRecommendedNextOwner = state.recommendedNextOwner;
    ds.hearthCanvasLaunchRecommendedNextFile = state.recommendedNextFile;
    ds.hearthCanvasLaunchRecommendedNextAction = state.recommendedNextAction;

    ds.hearthCanvasLaunchOwnsThresholdAuthority = "false";
    ds.hearthCanvasLaunchOwnsVisualPass = "false";
    ds.hearthCanvasLaunchVisualPassClaimed = "false";
    ds.hearthCanvasLaunchGeneratedImage = "false";
    ds.hearthCanvasLaunchGraphicBox = "false";
    ds.hearthCanvasLaunchWebgl = "false";
  }

  function publishGlobals(reason = "publish-globals") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight();

    setPath("HEARTH.canvasLaunch", api);
    setPath("HEARTH.canvasLaunchPrefaceGate", api);
    setPath("HEARTH.canvasPrefaceHoldGate", api);
    setPath("HEARTH.canvasPrefaceDecommissionGate", api);
    setPath("DEXTER_LAB.hearthCanvasLaunch", api);
    setPath("DEXTER_LAB.hearthCanvasLaunchPrefaceGate", api);

    root.HEARTH_CANVAS_LAUNCH = api;
    root.HEARTH_CANVAS_LAUNCH_PREFACE_GATE = api;
    root.HEARTH_CANVAS_PREFACE_HOLD_GATE = api;
    root.HEARTH_CANVAS_PREFACE_DECOMMISSION_GATE = api;

    hearth.canvasLaunchReceipt = receipt;
    hearth.canvasLaunchPrefaceGateReceipt = receipt;
    hearth.canvasPrefaceHoldGateReceipt = receipt;
    hearth.canvasPrefaceDecommissionGateReceipt = receipt;

    lab.hearthCanvasLaunchReceipt = receipt;
    lab.hearthCanvasLaunchPrefaceGateReceipt = receipt;

    root.HEARTH_CANVAS_LAUNCH_RECEIPT = receipt;
    root.HEARTH_CANVAS_LAUNCH_PREFACE_GATE_RECEIPT = receipt;
    root.HEARTH_CANVAS_PREFACE_HOLD_GATE_RECEIPT = receipt;
    root.HEARTH_CANVAS_PREFACE_DECOMMISSION_GATE_RECEIPT = receipt;
    root.HEARTH_CANVAS_LAUNCH_PACKET = composeLaunchPacket(reason);

    return true;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    canvasFile: CANVAS_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

    boot,
    init: boot,
    start: boot,
    run: boot,
    mount,
    refresh,
    dispose,

    holdPreface,
    decommissionPreface,
    ensurePreface,

    inspectCanvasHandshake,
    consumeCanvasHandshakePacket,
    receiveCanvasPrefaceHandshakePacket,
    receiveCanvasSurfaceWorthinessPacket,
    receiveCanvasPrefaceDecommissionPacket,

    composeLaunchPacket,
    sendLaunchPacketToCanvas,

    findCanvasApi,
    getReceipt,
    getReceiptLight,
    getStatus: getReceiptLight,
    getSummary: getReceiptLight,
    getReport: getReceipt,
    getStatusText,
    updateDataset,
    publishGlobals,

    ownsPrefaceHold: true,
    ownsPrefaceDecommissionEnforcement: true,
    ownsCanvasBootInvocation: true,
    ownsCanvasThresholdAuthority: false,
    ownsCanvasSurfaceWorthinessAuthority: false,
    ownsCanvasDrawing: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsRouteConductor: false,
    ownsControls: false,
    ownsDiagnosticRail: false,
    ownsNorthF21: false,
    ownsReadyText: false,
    ownsVisualPass: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    publishGlobals("immediate-publication");

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({ reason: "DOMContentLoaded" }), { once: true });
      } else {
        boot({ reason: "script-load" });
      }
    } else {
      boot({ reason: "no-document" });
    }
  } catch (error) {
    recordError("HEARTH_CANVAS_LAUNCH_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
