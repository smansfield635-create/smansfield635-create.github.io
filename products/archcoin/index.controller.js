/* /products/archcoin/index.controller.js
   ARCHCOIN transactional orientation and route authority.
   DGB_ARCHCOIN_CONTROLLER 8.0.0-transactional-precision
*/
(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_CONTROLLER",
    version: "8.0.0-transactional-precision",
    file: "/products/archcoin/index.controller.js",
    contract: "ARCHCOIN_TRANSACTIONAL_PRECISION_TARGET_CONTRACT_v1"
  });

  const STRUCTURAL = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    ROOM_SELECTED: "ROOM_SELECTED",
    SYSTEM_HELD: "SYSTEM_HELD"
  });

  const PHASE = Object.freeze({
    ORIENTATION: "ORIENTATION",
    ALLOCATION: "ALLOCATION",
    SELECTION: "SELECTION",
    PREVIEW: "PREVIEW",
    CONFIRMATION: "CONFIRMATION",
    SETTLEMENT: "SETTLEMENT",
    ROUTE_COMMIT: "ROUTE_COMMIT",
    CANCELLED: "CANCELLED"
  });

  const DESTINATION = Object.freeze({
    NONE: "",
    CARDINAL: "cardinal",
    ROOM: "room",
    HOME_COMPASS: "home-compass"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const WING_TO_COIN = Object.freeze({
    north: "contract",
    east: "receivable",
    south: "payable",
    west: "allocation"
  });
  const WING_LABEL = Object.freeze({
    north: "Contract",
    east: "Receivable",
    south: "Payable",
    west: "Allocation"
  });

  const ROOM_RECORDS = Object.freeze(
    WINGS.flatMap(wing => ["overview", "engineering", "platform", "governance"].map(lens => Object.freeze({
      type: DESTINATION.ROOM,
      id: `${WING_TO_COIN[wing]}-${lens}`,
      wing,
      coin: WING_TO_COIN[wing],
      lens,
      label: `${WING_LABEL[wing]} ${lens[0].toUpperCase()}${lens.slice(1)}`,
      route: `/products/archcoin/${WING_TO_COIN[wing]}/${lens}/`
    })))
  );
  const ROOM_BY_ID = new Map(ROOM_RECORDS.map(record => [record.id, record]));

  const subscribers = new Set();
  let confirmationTimer = 0;
  let routeTimer = 0;

  const state = {
    initialized: false,
    root: null,
    structuralState: STRUCTURAL.CONSTELLATION,
    transactionPhase: PHASE.ORIENTATION,
    transactionRevision: 0,
    reducedMotion: false,
    activeWing: "",
    selectedTargetType: DESTINATION.NONE,
    selectedTargetId: "",
    previewTargetType: DESTINATION.NONE,
    previewTargetId: "",
    previewRoute: "",
    previewAccepted: false,
    confirmationTargetType: DESTINATION.NONE,
    confirmationTargetId: "",
    confirmationStartedAt: 0,
    confirmationDurationMs: 220,
    confirmationCompleted: false,
    settlementTargetType: DESTINATION.NONE,
    settlementTargetId: "",
    settlementStartedAt: 0,
    settlementCompleted: false,
    routeCommitAuthorized: false,
    routeCommitStarted: false,
    cancellationReason: "",
    allocation: {
      targetType: DESTINATION.NONE,
      targetId: "",
      confidence: 0,
      runnerUpId: "",
      margin: 0,
      ambiguous: true
    },
    orientation: { yaw: 0, pitch: 0 },
    committedOrientation: { yaw: 0, pitch: 0 },
    clusterOrientation: { yaw: 0, pitch: 0 },
    committedClusterOrientation: { yaw: 0, pitch: 0 },
    lastCommittedTargetType: DESTINATION.NONE,
    lastCommittedTargetId: "",
    lastAction: "pending",
    lastFailure: "",
    transitionReceipts: []
  };

  function cloneFrame() {
    return Object.freeze({
      module: MODULE,
      structuralState: state.structuralState,
      transactionPhase: state.transactionPhase,
      transactionRevision: state.transactionRevision,
      reducedMotion: state.reducedMotion,
      activeWing: state.activeWing,
      selectedTargetType: state.selectedTargetType,
      selectedTargetId: state.selectedTargetId,
      previewTargetType: state.previewTargetType,
      previewTargetId: state.previewTargetId,
      previewRoute: state.previewRoute,
      previewAccepted: state.previewAccepted,
      confirmationTargetType: state.confirmationTargetType,
      confirmationTargetId: state.confirmationTargetId,
      confirmationStartedAt: state.confirmationStartedAt,
      confirmationDurationMs: state.confirmationDurationMs,
      confirmationCompleted: state.confirmationCompleted,
      settlementTargetType: state.settlementTargetType,
      settlementTargetId: state.settlementTargetId,
      settlementStartedAt: state.settlementStartedAt,
      settlementCompleted: state.settlementCompleted,
      routeCommitAuthorized: state.routeCommitAuthorized,
      cancellationReason: state.cancellationReason,
      allocation: Object.freeze({ ...state.allocation }),
      orientation: Object.freeze({ ...state.orientation }),
      clusterOrientation: Object.freeze({ ...state.clusterOrientation }),
      lastAction: state.lastAction,
      lastFailure: state.lastFailure
    });
  }

  function publish(reason = "frame") {
    state.lastAction = reason;
    syncRoot();
    const frame = cloneFrame();
    subscribers.forEach(fn => {
      try { fn(frame); } catch (error) { console.error(error); }
    });
    window.dispatchEvent(new CustomEvent("ARCHCOIN_CONTROLLER_FRAME", { detail: frame }));
    return frame;
  }

  function syncRoot() {
    if (!state.root) return;
    const root = state.root;
    root.dataset.archcoinControllerState = state.structuralState;
    root.dataset.archcoinNavigationState = state.structuralState;
    root.dataset.archcoinPresentationMode = state.structuralState === STRUCTURAL.CONSTELLATION ? "CONSTELLATION" : state.structuralState === STRUCTURAL.SYSTEM_HELD ? "HELD" : "CLUSTER";
    root.dataset.archcoinTransactionPhase = state.transactionPhase;
    root.dataset.archcoinTransactionRevision = String(state.transactionRevision);
    root.dataset.activeClusterWing = state.activeWing;
    root.dataset.selectedDestinationType = state.selectedTargetType;
    root.dataset.selectedDestinationId = state.selectedTargetId;
    root.dataset.selectedRoute = state.previewRoute;
    root.dataset.reducedMotion = String(state.reducedMotion);
    root.dataset.archcoinControllerStatus = "ready";
    root.dataset.archcoinControllerReceipt = JSON.stringify({
      contract: MODULE.contract,
      version: MODULE.version,
      phase: state.transactionPhase,
      revision: state.transactionRevision,
      homeCompassIndependent: true,
      routeBeforeSettlementCount: 0
    });
  }

  function receipt(requestedPhase, accepted, rejectionReason = "", targetType = "", targetId = "") {
    const record = Object.freeze({
      transactionRevision: state.transactionRevision,
      previousPhase: state.transactionPhase,
      requestedPhase,
      resultingPhase: accepted ? requestedPhase : state.transactionPhase,
      structuralState: state.structuralState,
      targetType,
      targetId,
      accepted,
      rejectionReason,
      timestamp: Date.now(),
      routeCommitAuthorized: state.routeCommitAuthorized,
      homeCompassStateUnaffected: true
    });
    state.transitionReceipts.push(record);
    if (state.transitionReceipts.length > 30) state.transitionReceipts.shift();
    window.dispatchEvent(new CustomEvent("ARCHCOIN_TRANSACTION_RECEIPT", { detail: record }));
    return record;
  }

  function isHeld() { return state.structuralState === STRUCTURAL.SYSTEM_HELD; }
  function nextRevision() { state.transactionRevision += 1; return state.transactionRevision; }
  function validTarget(type, id) {
    if (type === DESTINATION.CARDINAL) return WINGS.includes(id);
    if (type === DESTINATION.ROOM) return ROOM_BY_ID.has(id);
    return false;
  }
  function routeFor(type, id) {
    if (type === DESTINATION.ROOM) return ROOM_BY_ID.get(id)?.route || "";
    if (type === DESTINATION.CARDINAL) return `/products/archcoin/${WING_TO_COIN[id]}/`;
    return "";
  }

  function setPhase(phase, reason, targetType = "", targetId = "") {
    state.transactionPhase = phase;
    receipt(phase, true, "", targetType, targetId);
    publish(reason);
  }

  function clearTimers() {
    window.clearTimeout(confirmationTimer);
    window.clearTimeout(routeTimer);
    confirmationTimer = 0;
    routeTimer = 0;
  }

  function resetPending() {
    state.selectedTargetType = DESTINATION.NONE;
    state.selectedTargetId = "";
    state.previewTargetType = DESTINATION.NONE;
    state.previewTargetId = "";
    state.previewRoute = "";
    state.previewAccepted = false;
    state.confirmationTargetType = DESTINATION.NONE;
    state.confirmationTargetId = "";
    state.confirmationStartedAt = 0;
    state.confirmationCompleted = false;
    state.settlementTargetType = DESTINATION.NONE;
    state.settlementTargetId = "";
    state.settlementStartedAt = 0;
    state.settlementCompleted = false;
    state.routeCommitAuthorized = false;
    state.routeCommitStarted = false;
    state.allocation = { targetType: "", targetId: "", confidence: 0, runnerUpId: "", margin: 0, ambiguous: true };
  }

  function beginAllocation() {
    if (isHeld()) return false;
    if (![PHASE.ORIENTATION, PHASE.ALLOCATION, PHASE.CANCELLED].includes(state.transactionPhase)) return false;
    if (state.transactionPhase !== PHASE.ALLOCATION) nextRevision();
    state.transactionPhase = PHASE.ALLOCATION;
    state.cancellationReason = "";
    publish("allocation-begin");
    return true;
  }

  function updateAllocation(payload = {}) {
    if (state.transactionPhase !== PHASE.ALLOCATION || isHeld()) return false;
    const targetType = payload.targetType || "";
    const targetId = payload.targetId || "";
    const confidence = Number(payload.confidence) || 0;
    const margin = Number(payload.margin) || 0;
    const ambiguous = !validTarget(targetType, targetId) || confidence < 0.64 || margin < 0.14;
    state.allocation = { targetType, targetId, confidence, runnerUpId: payload.runnerUpId || "", margin, ambiguous };
    publish("allocation-update");
    return !ambiguous;
  }

  function completeAllocation(payload = {}) {
    if (state.transactionPhase !== PHASE.ALLOCATION) return false;
    if (state.allocation.ambiguous) {
      cancelTransaction({ reason: "AMBIGUOUS_ALLOCATION" });
      return false;
    }
    return selectDestination({ targetType: state.allocation.targetType, targetId: state.allocation.targetId, deliberate: Boolean(payload.deliberate) });
  }

  function selectDestination(payload = {}) {
    const targetType = payload.targetType;
    const targetId = payload.targetId;
    if (isHeld() || !validTarget(targetType, targetId)) return false;
    if (targetType === DESTINATION.ROOM && (!state.activeWing || ROOM_BY_ID.get(targetId)?.wing !== state.activeWing)) return false;
    if (state.transactionPhase === PHASE.PREVIEW && state.previewTargetType === targetType && state.previewTargetId === targetId && payload.deliberate) return acceptPreview({ targetType, targetId });
    clearTimers();
    nextRevision();
    state.selectedTargetType = targetType;
    state.selectedTargetId = targetId;
    state.transactionPhase = PHASE.SELECTION;
    publish("selection");
    return openPreview({ targetType, targetId, revision: state.transactionRevision });
  }

  function openPreview(payload = {}) {
    if (isHeld() || state.transactionPhase !== PHASE.SELECTION || payload.revision !== state.transactionRevision || !validTarget(payload.targetType, payload.targetId)) return false;
    state.previewTargetType = payload.targetType;
    state.previewTargetId = payload.targetId;
    state.previewRoute = routeFor(payload.targetType, payload.targetId);
    state.previewAccepted = false;
    setPhase(PHASE.PREVIEW, "preview-open", payload.targetType, payload.targetId);
    return true;
  }

  function acceptPreview(payload = {}) {
    if (state.transactionPhase !== PHASE.PREVIEW || isHeld()) return false;
    if (payload.targetType && payload.targetType !== state.previewTargetType) return false;
    if (payload.targetId && payload.targetId !== state.previewTargetId) return false;
    state.previewAccepted = true;
    return beginConfirmation({ targetType: state.previewTargetType, targetId: state.previewTargetId, revision: state.transactionRevision });
  }

  function beginConfirmation(payload = {}) {
    if (state.transactionPhase !== PHASE.PREVIEW || payload.revision !== state.transactionRevision) return false;
    state.confirmationTargetType = payload.targetType;
    state.confirmationTargetId = payload.targetId;
    state.confirmationStartedAt = performance.now();
    state.confirmationDurationMs = state.reducedMotion ? 120 : 220;
    state.confirmationCompleted = false;
    setPhase(PHASE.CONFIRMATION, "confirmation-begin", payload.targetType, payload.targetId);
    confirmationTimer = window.setTimeout(() => completeConfirmation({ revision: state.transactionRevision }), state.confirmationDurationMs);
    return true;
  }

  function completeConfirmation(payload = {}) {
    if (state.transactionPhase !== PHASE.CONFIRMATION || payload.revision !== state.transactionRevision) return false;
    state.confirmationCompleted = true;
    return beginSettlement({ targetType: state.confirmationTargetType, targetId: state.confirmationTargetId, revision: state.transactionRevision });
  }

  function beginSettlement(payload = {}) {
    if (!state.confirmationCompleted || payload.revision !== state.transactionRevision) return false;
    state.settlementTargetType = payload.targetType;
    state.settlementTargetId = payload.targetId;
    state.settlementStartedAt = performance.now();
    state.settlementCompleted = false;
    setPhase(PHASE.SETTLEMENT, "settlement-begin", payload.targetType, payload.targetId);
    window.dispatchEvent(new CustomEvent("ARCHCOIN_SETTLEMENT_REQUEST", { detail: { revision: state.transactionRevision, targetType: payload.targetType, targetId: payload.targetId, maximumDurationMs: 700 } }));
    return true;
  }

  function completeSettlement(payload = {}) {
    if (state.transactionPhase !== PHASE.SETTLEMENT || payload.revision !== state.transactionRevision) return false;
    if (payload.targetType !== state.settlementTargetType || payload.targetId !== state.settlementTargetId) return false;
    if (payload.timedOut) {
      cancelTransaction({ reason: "SETTLEMENT_TIMEOUT" });
      return false;
    }
    state.settlementCompleted = true;
    state.lastCommittedTargetType = payload.targetType;
    state.lastCommittedTargetId = payload.targetId;
    return authorizeRouteCommit(payload);
  }

  function authorizeRouteCommit(payload = {}) {
    if (!state.confirmationCompleted || !state.settlementCompleted || state.transactionPhase !== PHASE.SETTLEMENT) return false;
    state.routeCommitAuthorized = true;
    setPhase(PHASE.ROUTE_COMMIT, "route-authorized", payload.targetType, payload.targetId);
    routeTimer = window.setTimeout(() => commitRoute(payload), 20);
    return true;
  }

  function commitRoute(payload = {}) {
    if (!state.routeCommitAuthorized || state.routeCommitStarted || state.transactionPhase !== PHASE.ROUTE_COMMIT) return false;
    state.routeCommitStarted = true;
    if (payload.targetType === DESTINATION.CARDINAL) {
      state.activeWing = payload.targetId;
      state.structuralState = STRUCTURAL.CLUSTER_OPEN;
      state.committedOrientation = { ...state.orientation };
      state.clusterOrientation = { yaw: 0, pitch: 0 };
      state.committedClusterOrientation = { yaw: 0, pitch: 0 };
      resetPending();
      state.transactionPhase = PHASE.ORIENTATION;
      publish("cluster-open");
      return true;
    }
    if (payload.targetType === DESTINATION.ROOM) {
      const route = routeFor(payload.targetType, payload.targetId);
      if (!route) return false;
      state.structuralState = STRUCTURAL.ROOM_SELECTED;
      publish("room-route-commit");
      window.location.assign(route);
      return true;
    }
    return false;
  }

  function cancelTransaction(payload = {}) {
    if (state.routeCommitAuthorized) return false;
    clearTimers();
    state.cancellationReason = String(payload.reason || "CANCELLED");
    state.orientation = { ...state.committedOrientation };
    state.clusterOrientation = { ...state.committedClusterOrientation };
    resetPending();
    state.transactionPhase = PHASE.CANCELLED;
    publish("transaction-cancelled");
    requestAnimationFrame(() => {
      if (state.transactionPhase === PHASE.CANCELLED) {
        state.transactionPhase = PHASE.ORIENTATION;
        publish("orientation-restored");
      }
    });
    return true;
  }

  function returnToConstellation(reason = "CLUSTER_RETURN_CONTROL") {
    if (![STRUCTURAL.CLUSTER_OPEN, STRUCTURAL.ROOM_SELECTED].includes(state.structuralState)) return false;
    if (!state.routeCommitAuthorized) cancelTransaction({ reason });
    state.structuralState = STRUCTURAL.CONSTELLATION;
    state.activeWing = "";
    state.orientation = { ...state.committedOrientation };
    resetPending();
    state.transactionPhase = PHASE.ORIENTATION;
    publish("return-to-constellation");
    return true;
  }

  function updateOrientation(payload = {}) {
    if (isHeld()) return false;
    const target = state.structuralState === STRUCTURAL.CONSTELLATION ? state.orientation : state.clusterOrientation;
    target.yaw = Math.max(-0.22, Math.min(0.22, Number(payload.yaw) || 0));
    target.pitch = Math.max(-0.14, Math.min(0.14, Number(payload.pitch) || 0));
    publish("orientation-preview");
    return true;
  }

  function commitOrientation() {
    if (state.structuralState === STRUCTURAL.CONSTELLATION) state.committedOrientation = { ...state.orientation };
    else state.committedClusterOrientation = { ...state.clusterOrientation };
    publish("orientation-committed");
    return true;
  }

  function requestHomeReturn() {
    clearTimers();
    if (!state.routeCommitAuthorized) cancelTransaction({ reason: "HOME_COMPASS_RETURN" });
    state.structuralState = STRUCTURAL.SYSTEM_HELD;
    state.transactionPhase = PHASE.ORIENTATION;
    publish("home-compass-return");
    window.location.assign("/index.html");
    return true;
  }

  function getDestination(type, id) {
    if (type === DESTINATION.CARDINAL && WINGS.includes(id)) return Object.freeze({ type, id, wing: id, coin: WING_TO_COIN[id], label: WING_LABEL[id], route: routeFor(type, id) });
    if (type === DESTINATION.ROOM) return ROOM_BY_ID.get(id) || null;
    return null;
  }

  function subscribe(fn) {
    if (typeof fn !== "function") return () => {};
    subscribers.add(fn);
    fn(cloneFrame());
    return () => subscribers.delete(fn);
  }

  function initialize() {
    if (state.initialized) return true;
    state.root = document.querySelector("[data-archcoin-root]");
    if (!state.root) return false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    state.reducedMotion = media.matches;
    media.addEventListener?.("change", event => { state.reducedMotion = event.matches; publish("reduced-motion-change"); });
    state.initialized = true;
    publish("initialized");
    window.dispatchEvent(new CustomEvent("ARCHCOIN_CONTROLLER_READY", { detail: cloneFrame() }));
    return true;
  }

  const API = Object.freeze({
    MODULE, STRUCTURAL, PHASE, DESTINATION, WINGS,
    initialize, subscribe, getFrame: cloneFrame, getDestination,
    beginAllocation, updateAllocation, completeAllocation,
    selectDestination, openPreview, acceptPreview,
    beginConfirmation, completeConfirmation,
    beginSettlement, completeSettlement,
    authorizeRouteCommit, commitRoute,
    cancelTransaction, returnToConstellation,
    updateOrientation, commitOrientation, requestHomeReturn,
    getTransitionReceipts: () => Object.freeze([...state.transitionReceipts])
  });

  window.DGB_ARCHCOIN_CONTROLLER = API;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();