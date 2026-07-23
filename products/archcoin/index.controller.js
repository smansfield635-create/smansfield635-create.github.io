/* /products/archcoin/index.controller.js
   ARCHCOIN canonical transaction, state, navigation, projection-admission,
   and gesture-custody authority.

   CONTROLLER DETERMINES AUTHORITY.
   PLANET DETERMINES WORLD TRUTH.
   COMPOSITOR DETERMINES PROJECTION.
   INTERACTIONS PROPOSE POINTER INTENT.
*/
(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_CONTROLLER",
    version: "8.0.0-planet-authority-projection-admission",
    file: "/products/archcoin/index.controller.js",
    frameSchema: "ARCHCOIN_CONTROLLER_FRAME_v8",
    projectionSchema: "ARCHCOIN_SHARED_PROJECTION_SNAPSHOT_v2",
    worldSchema: "ARCHCOIN_CANONICAL_WORLD_SNAPSHOT_v1"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const MODES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER",
    HELD: "HELD"
  });
  const PHASES = Object.freeze({
    IDLE: "IDLE",
    PREVIEW: "PREVIEW",
    COMMITTED: "COMMITTED",
    CANCELLED: "CANCELLED"
  });
  const DESTINATIONS = Object.freeze({
    NONE: "",
    CARDINAL: "cardinal",
    ROOM: "room",
    HOME_COMPASS: "home-compass"
  });
  const IDENTITY = Object.freeze([0, 0, 0, 1]);
  const EPSILON = 1e-10;

  const listeners = new Set();
  const projectionListeners = new Set();

  const state = {
    initialized: false,
    disposed: false,
    root: null,
    planet: null,
    frameRevision: 0,
    acceptedProjectionRevision: -1,
    acceptedWorldRevision: -1,
    presentationMode: MODES.CONSTELLATION,
    selectedCardinal: "",
    selectedRoom: "",
    activeClusterWing: "",
    held: false,
    reducedMotion: false,
    route: "/products/archcoin/",
    panel: "",
    orbit: {
      phase: PHASES.IDLE,
      originQuaternion: Array.from(IDENTITY),
      previewQuaternion: Array.from(IDENTITY),
      committedQuaternion: Array.from(IDENTITY),
      previewPrimaryId: "north",
      committedPrimaryId: "north"
    },
    cluster: {
      phase: PHASES.IDLE,
      wing: "",
      originQuaternion: Array.from(IDENTITY),
      previewQuaternion: Array.from(IDENTITY),
      committedQuaternion: Array.from(IDENTITY),
      previewPrimaryId: "",
      committedPrimaryId: ""
    },
    gesture: null,
    semanticProjection: Object.freeze([]),
    projectionSnapshot: null,
    lastAction: "pending",
    lastFailure: ""
  };

  function invariant(condition, code, details = null) {
    if (condition) return;
    const error = new Error(code);
    error.code = code;
    error.details = details;
    throw error;
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function nonNegativeInteger(value, fallback = 0) {
    const number = Math.trunc(finiteNumber(value, fallback));
    return number >= 0 ? number : fallback;
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function normalizeQuaternion(value, fallback = IDENTITY) {
    const source = Array.isArray(value) || ArrayBuffer.isView(value)
      ? Array.from(value)
      : Array.from(fallback);
    if (source.length !== 4) return Array.from(fallback);
    const quaternion = source.map((component, index) =>
      finiteNumber(component, fallback[index])
    );
    const length = Math.hypot(...quaternion);
    if (!Number.isFinite(length) || length <= EPSILON) return Array.from(fallback);
    return quaternion.map(component => component / length);
  }

  function cloneGesture(gesture) {
    if (!gesture) return null;
    return Object.freeze({
      gestureId: gesture.gestureId,
      pointerId: gesture.pointerId,
      gestureScope: gesture.gestureScope,
      acceptedTargetKey: gesture.acceptedTargetKey,
      acceptedWorldRevision: gesture.acceptedWorldRevision,
      acceptedProjectionRevision: gesture.acceptedProjectionRevision,
      staleRevisionFloor: gesture.staleRevisionFloor,
      targetReplacementRevision: gesture.targetReplacementRevision,
      startedAt: gesture.startedAt
    });
  }

  function roomWing(roomId) {
    const id = normalizeRoomId(roomId);
    if (id.startsWith("contract-")) return "north";
    if (id.startsWith("receivable-")) return "east";
    if (id.startsWith("payable-")) return "south";
    if (id.startsWith("allocation-")) return "west";
    return "";
  }

  function projectionRecordIdentity(record) {
    if (!record || typeof record !== "object") return "";
    const kind = String(record.kind || "").trim().toLowerCase();
    const id = String(record.id || "").trim();
    return kind && id ? `${kind}:${id}` : "";
  }

  function freezeProjectionRecord(record) {
    const identity = projectionRecordIdentity(record);
    if (!identity) return null;
    const kind = String(record.kind).trim().toLowerCase();
    const id = String(record.id).trim();
    if (kind === "planet" || id === "main-compass-planet" || id === "home-compass") {
      return null;
    }
    return Object.freeze({
      nodeKey: String(record.nodeKey || identity),
      kind,
      id,
      wing: normalizeWing(record.wing),
      x: finiteNumber(record.x),
      y: finiteNumber(record.y),
      radiusPx: Math.max(0, finiteNumber(record.radiusPx)),
      ndcDepth: finiteNumber(record.ndcDepth),
      clipW: finiteNumber(record.clipW, 1),
      viewDepth: finiteNumber(record.viewDepth),
      depthLayer: String(record.depthLayer || "").trim().toLowerCase(),
      centerWorldOverlap: Boolean(record.centerWorldOverlap),
      visible: record.visible !== false,
      worldRevision: nonNegativeInteger(record.worldRevision),
      projectionRevision: nonNegativeInteger(record.projectionRevision)
    });
  }

  function snapshot() {
    return Object.freeze({
      schema: MODULE.frameSchema,
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      frameRevision: state.frameRevision,
      presentationMode: state.presentationMode,
      selectedCardinal: state.selectedCardinal,
      selectedRoom: state.selectedRoom,
      activeClusterWing: state.activeClusterWing,
      held: state.held,
      reducedMotion: state.reducedMotion,
      route: state.route,
      panel: state.panel,
      orbitOrientation: Object.freeze({
        phase: state.orbit.phase,
        quaternion: Object.freeze(Array.from(state.orbit.previewQuaternion)),
        previewQuaternion: Object.freeze(Array.from(state.orbit.previewQuaternion)),
        committedQuaternion: Object.freeze(Array.from(state.orbit.committedQuaternion)),
        previewPrimaryId: state.orbit.previewPrimaryId,
        committedPrimaryId: state.orbit.committedPrimaryId
      }),
      cluster: Object.freeze({
        phase: state.cluster.phase,
        wing: state.cluster.wing,
        orientation: Object.freeze({
          quaternion: Object.freeze(Array.from(state.cluster.previewQuaternion))
        }),
        previewQuaternion: Object.freeze(Array.from(state.cluster.previewQuaternion)),
        committedQuaternion: Object.freeze(Array.from(state.cluster.committedQuaternion)),
        previewPrimaryId: state.cluster.previewPrimaryId,
        committedPrimaryId: state.cluster.committedPrimaryId
      }),
      gesture: cloneGesture(state.gesture),
      acceptedWorldRevision: state.acceptedWorldRevision,
      acceptedProjectionRevision: state.acceptedProjectionRevision,
      lastAction: state.lastAction,
      lastFailure: state.lastFailure
    });
  }

  function publishFrame(action) {
    state.frameRevision += 1;
    state.lastAction = action;
    const frame = snapshot();
    for (const listener of listeners) {
      try { listener(frame); } catch (_) {}
    }
    return frame;
  }

  function publishProjection() {
    const records = state.semanticProjection;
    for (const listener of projectionListeners) {
      try { listener(records, state.projectionSnapshot); } catch (_) {}
    }
    return records;
  }

  function resolvePlanet() {
    return state.planet || globalThis.DGB_ARCHCOIN_PLANET || null;
  }

  function validatePlanetPrimary(scope, primaryId, quaternion) {
    const planet = resolvePlanet();
    if (!planet || typeof planet.validatePrimaryIdentity !== "function") return true;
    const result = planet.validatePrimaryIdentity({
      scope,
      primaryId,
      quaternion,
      wing: scope === "CLUSTER" ? state.cluster.wing : undefined
    });
    return Boolean(result && result.valid);
  }

  function settledQuaternion(scope, primaryId, fallback) {
    const planet = resolvePlanet();
    if (!planet || typeof planet.getSettledQuaternion !== "function") {
      return normalizeQuaternion(fallback);
    }
    try {
      return normalizeQuaternion(planet.getSettledQuaternion({
        scope,
        primaryId,
        wing: scope === "CLUSTER" ? state.cluster.wing : undefined,
        currentQuaternion: fallback
      }), fallback);
    } catch (_) {
      return normalizeQuaternion(fallback);
    }
  }

  function initialQuaternion(scope, primaryId) {
    const planet = resolvePlanet();
    if (!planet || typeof planet.getInitialOrientation !== "function") {
      return Array.from(IDENTITY);
    }
    try {
      return normalizeQuaternion(planet.getInitialOrientation({
        scope,
        primaryId,
        wing: scope === "CLUSTER" ? state.cluster.wing : undefined
      }));
    } catch (_) {
      return Array.from(IDENTITY);
    }
  }

  function ensureInitialized() {
    invariant(state.initialized && !state.disposed, "ARCHCOIN_CONTROLLER_NOT_ACTIVE");
  }

  function initialize(options = {}) {
    invariant(!state.disposed, "ARCHCOIN_CONTROLLER_DISPOSED");
    if (state.initialized) return receipt();
    state.root = options.root || (typeof document !== "undefined" ? document : null);
    state.planet = options.planet || globalThis.DGB_ARCHCOIN_PLANET || null;
    state.reducedMotion = Boolean(options.reducedMotion);
    state.orbit.originQuaternion = initialQuaternion("ORBIT", "north");
    state.orbit.previewQuaternion = Array.from(state.orbit.originQuaternion);
    state.orbit.committedQuaternion = Array.from(state.orbit.originQuaternion);
    state.initialized = true;
    publishFrame("initialize");
    return receipt();
  }

  function getFrameState() {
    ensureInitialized();
    return snapshot();
  }

  function subscribeFrameState(listener) {
    invariant(typeof listener === "function", "ARCHCOIN_CONTROLLER_LISTENER_REQUIRED");
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function subscribeSemanticProjection(listener) {
    invariant(typeof listener === "function", "ARCHCOIN_PROJECTION_LISTENER_REQUIRED");
    projectionListeners.add(listener);
    return () => projectionListeners.delete(listener);
  }

  function getSemanticProjection() {
    ensureInitialized();
    return state.semanticProjection;
  }

  function getAcceptedProjectionSnapshot() {
    ensureInitialized();
    return state.projectionSnapshot;
  }

  function submitProjectionSnapshot(input) {
    ensureInitialized();
    invariant(input && typeof input === "object", "ARCHCOIN_PROJECTION_SNAPSHOT_REQUIRED");
    invariant(input.schema === MODULE.projectionSchema, "ARCHCOIN_PROJECTION_SCHEMA_REJECTED");
    const projectionRevision = nonNegativeInteger(input.projectionRevision, -1);
    const worldRevision = nonNegativeInteger(input.worldRevision, -1);
    invariant(projectionRevision > state.acceptedProjectionRevision, "ARCHCOIN_STALE_PROJECTION_REJECTED");
    invariant(worldRevision >= state.acceptedWorldRevision, "ARCHCOIN_STALE_WORLD_REJECTED");

    const records = [];
    const identities = new Set();
    for (const source of Array.isArray(input.records) ? input.records : []) {
      const record = freezeProjectionRecord(source);
      if (!record) continue;
      const identity = `${record.kind}:${record.id}`;
      invariant(!identities.has(identity), "ARCHCOIN_DUPLICATE_PROJECTION_IDENTITY", identity);
      identities.add(identity);
      records.push(record);
    }

    state.acceptedProjectionRevision = projectionRevision;
    state.acceptedWorldRevision = worldRevision;
    state.semanticProjection = Object.freeze(records);
    state.projectionSnapshot = Object.freeze({
      schema: MODULE.projectionSchema,
      projectionRevision,
      worldRevision,
      frameRevision: nonNegativeInteger(input.frameRevision),
      records: state.semanticProjection
    });

    if (state.gesture && projectionRevision > state.gesture.staleRevisionFloor) {
      state.gesture.staleRevisionFloor = projectionRevision;
    }

    publishProjection();
    publishFrame("submit-projection-snapshot");
    return state.projectionSnapshot;
  }

  function beginGesture({ gestureId, pointerId, gestureScope, targetKey = "" } = {}) {
    ensureInitialized();
    invariant(!state.gesture, "ARCHCOIN_GESTURE_ALREADY_ACTIVE");
    const scope = String(gestureScope || "").trim().toUpperCase();
    invariant(scope === "ORBIT" || scope === "CLUSTER", "ARCHCOIN_GESTURE_SCOPE_REJECTED");
    state.gesture = {
      gestureId: String(gestureId || `gesture-${state.frameRevision + 1}`),
      pointerId: finiteNumber(pointerId, -1),
      gestureScope: scope,
      acceptedTargetKey: String(targetKey || ""),
      acceptedWorldRevision: state.acceptedWorldRevision,
      acceptedProjectionRevision: state.acceptedProjectionRevision,
      staleRevisionFloor: state.acceptedProjectionRevision,
      targetReplacementRevision: 0,
      startedAt: Date.now()
    };
    publishFrame("begin-gesture");
    return cloneGesture(state.gesture);
  }

  function replaceGestureTarget({ gestureId, targetKey, projectionRevision } = {}) {
    ensureInitialized();
    invariant(state.gesture, "ARCHCOIN_NO_ACTIVE_GESTURE");
    invariant(String(gestureId || "") === state.gesture.gestureId, "ARCHCOIN_GESTURE_ID_MISMATCH");
    const revision = nonNegativeInteger(projectionRevision, -1);
    invariant(revision >= state.gesture.staleRevisionFloor, "ARCHCOIN_GESTURE_TARGET_STALE");
    const key = String(targetKey || "").trim();
    invariant(key && key !== "planet:main-compass-planet", "ARCHCOIN_GESTURE_TARGET_REJECTED");
    const exists = state.semanticProjection.some(record =>
      `${record.kind}:${record.id}` === key && record.visible
    );
    invariant(exists, "ARCHCOIN_GESTURE_TARGET_NOT_ADMITTED");
    state.gesture.acceptedTargetKey = key;
    state.gesture.acceptedProjectionRevision = revision;
    state.gesture.targetReplacementRevision += 1;
    publishFrame("replace-gesture-target");
    return cloneGesture(state.gesture);
  }

  function endGesture(reason = "complete") {
    ensureInitialized();
    const ended = cloneGesture(state.gesture);
    state.gesture = null;
    publishFrame(`end-gesture:${String(reason || "complete")}`);
    return ended;
  }

  function beginOrbitGesture(input = {}) {
    ensureInitialized();
    if (!state.gesture) beginGesture({ ...input, gestureScope: "ORBIT" });
    state.orbit.phase = PHASES.PREVIEW;
    state.orbit.originQuaternion = Array.from(state.orbit.committedQuaternion);
    state.orbit.previewQuaternion = Array.from(state.orbit.committedQuaternion);
    publishFrame("begin-orbit-gesture");
    return snapshot();
  }

  function requestOrbitPreview({ quaternion, primaryId } = {}) {
    ensureInitialized();
    invariant(state.orbit.phase === PHASES.PREVIEW, "ARCHCOIN_ORBIT_PREVIEW_NOT_OPEN");
    const normalizedPrimary = normalizeWing(primaryId);
    invariant(normalizedPrimary, "ARCHCOIN_ORBIT_PRIMARY_REJECTED");
    const normalizedQuaternion = normalizeQuaternion(quaternion, state.orbit.previewQuaternion);
    invariant(validatePlanetPrimary("ORBIT", normalizedPrimary, normalizedQuaternion),
      "ARCHCOIN_ORBIT_PRIMARY_IDENTITY_REJECTED");
    state.orbit.previewQuaternion = normalizedQuaternion;
    state.orbit.previewPrimaryId = normalizedPrimary;
    return publishFrame("orbit-preview");
  }

  function requestOrbitCommit() {
    ensureInitialized();
    invariant(state.orbit.phase === PHASES.PREVIEW, "ARCHCOIN_ORBIT_COMMIT_NOT_OPEN");
    const settled = settledQuaternion("ORBIT", state.orbit.previewPrimaryId, state.orbit.previewQuaternion);
    state.orbit.previewQuaternion = Array.from(settled);
    state.orbit.committedQuaternion = Array.from(settled);
    state.orbit.committedPrimaryId = state.orbit.previewPrimaryId;
    state.orbit.phase = PHASES.COMMITTED;
    if (state.gesture && state.gesture.gestureScope === "ORBIT") state.gesture = null;
    return publishFrame("orbit-commit");
  }

  function requestOrbitCancel(reason = "cancelled") {
    ensureInitialized();
    state.orbit.previewQuaternion = Array.from(state.orbit.originQuaternion);
    state.orbit.previewPrimaryId = state.orbit.committedPrimaryId;
    state.orbit.phase = PHASES.CANCELLED;
    if (state.gesture && state.gesture.gestureScope === "ORBIT") state.gesture = null;
    return publishFrame(`orbit-cancel:${String(reason)}`);
  }

  function beginClusterGesture(wing, input = {}) {
    ensureInitialized();
    const normalizedWing = normalizeWing(wing);
    invariant(normalizedWing, "ARCHCOIN_CLUSTER_WING_REJECTED");
    if (!state.gesture) beginGesture({ ...input, gestureScope: "CLUSTER" });
    state.cluster.wing = normalizedWing;
    state.cluster.phase = PHASES.PREVIEW;
    state.cluster.originQuaternion = Array.from(state.cluster.committedQuaternion);
    state.cluster.previewQuaternion = Array.from(state.cluster.committedQuaternion);
    return publishFrame("begin-cluster-gesture");
  }

  function requestClusterPreview(wing, { quaternion, primaryId } = {}) {
    ensureInitialized();
    const normalizedWing = normalizeWing(wing);
    invariant(state.cluster.phase === PHASES.PREVIEW, "ARCHCOIN_CLUSTER_PREVIEW_NOT_OPEN");
    invariant(normalizedWing && normalizedWing === state.cluster.wing, "ARCHCOIN_CLUSTER_WING_MISMATCH");
    const roomId = normalizeRoomId(primaryId);
    invariant(roomId && roomWing(roomId) === normalizedWing, "ARCHCOIN_CLUSTER_PRIMARY_REJECTED");
    const normalizedQuaternion = normalizeQuaternion(quaternion, state.cluster.previewQuaternion);
    invariant(validatePlanetPrimary("CLUSTER", roomId, normalizedQuaternion),
      "ARCHCOIN_CLUSTER_PRIMARY_IDENTITY_REJECTED");
    state.cluster.previewQuaternion = normalizedQuaternion;
    state.cluster.previewPrimaryId = roomId;
    return publishFrame("cluster-preview");
  }

  function requestClusterCommit(wing) {
    ensureInitialized();
    const normalizedWing = normalizeWing(wing);
    invariant(state.cluster.phase === PHASES.PREVIEW, "ARCHCOIN_CLUSTER_COMMIT_NOT_OPEN");
    invariant(normalizedWing === state.cluster.wing, "ARCHCOIN_CLUSTER_WING_MISMATCH");
    const settled = settledQuaternion("CLUSTER", state.cluster.previewPrimaryId, state.cluster.previewQuaternion);
    state.cluster.previewQuaternion = Array.from(settled);
    state.cluster.committedQuaternion = Array.from(settled);
    state.cluster.committedPrimaryId = state.cluster.previewPrimaryId;
    state.cluster.phase = PHASES.COMMITTED;
    if (state.gesture && state.gesture.gestureScope === "CLUSTER") state.gesture = null;
    return publishFrame("cluster-commit");
  }

  function requestClusterCancel(wing, reason = "cancelled") {
    ensureInitialized();
    const normalizedWing = normalizeWing(wing);
    invariant(!normalizedWing || normalizedWing === state.cluster.wing, "ARCHCOIN_CLUSTER_WING_MISMATCH");
    state.cluster.previewQuaternion = Array.from(state.cluster.originQuaternion);
    state.cluster.previewPrimaryId = state.cluster.committedPrimaryId;
    state.cluster.phase = PHASES.CANCELLED;
    if (state.gesture && state.gesture.gestureScope === "CLUSTER") state.gesture = null;
    return publishFrame(`cluster-cancel:${String(reason)}`);
  }

  function requestCardinalSelection(wing) {
    ensureInitialized();
    const normalizedWing = normalizeWing(wing);
    invariant(normalizedWing, "ARCHCOIN_CARDINAL_SELECTION_REJECTED");
    state.selectedCardinal = normalizedWing;
    state.selectedRoom = "";
    state.activeClusterWing = normalizedWing;
    state.presentationMode = MODES.CLUSTER;
    state.cluster.wing = normalizedWing;
    state.cluster.previewQuaternion = initialQuaternion("CLUSTER", "");
    state.cluster.committedQuaternion = Array.from(state.cluster.previewQuaternion);
    state.route = `/products/archcoin/?wing=${encodeURIComponent(normalizedWing)}`;
    state.panel = `cluster:${normalizedWing}`;
    return publishFrame("select-cardinal");
  }

  function requestRoomSelection(roomId) {
    ensureInitialized();
    const id = normalizeRoomId(roomId);
    const wing = roomWing(id);
    invariant(id && wing, "ARCHCOIN_ROOM_SELECTION_REJECTED");
    invariant(!state.activeClusterWing || wing === state.activeClusterWing,
      "ARCHCOIN_ROOM_OUTSIDE_ACTIVE_CLUSTER");
    state.selectedCardinal = wing;
    state.activeClusterWing = wing;
    state.selectedRoom = id;
    state.presentationMode = MODES.CLUSTER;
    state.route = `/products/archcoin/?room=${encodeURIComponent(id)}`;
    state.panel = `room:${id}`;
    return publishFrame("select-room");
  }

  function requestCompassSelection() {
    ensureInitialized();
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.activeClusterWing = "";
    state.presentationMode = MODES.CONSTELLATION;
    state.route = "/products/archcoin/";
    state.panel = "home-compass";
    return publishFrame("select-home-compass");
  }

  function requestReturnToConstellation() {
    return requestCompassSelection();
  }

  function setHeld(value) {
    ensureInitialized();
    state.held = Boolean(value);
    state.presentationMode = state.held
      ? MODES.HELD
      : state.activeClusterWing
        ? MODES.CLUSTER
        : MODES.CONSTELLATION;
    return publishFrame("set-held");
  }

  function setReducedMotion(value) {
    ensureInitialized();
    state.reducedMotion = Boolean(value);
    return publishFrame("set-reduced-motion");
  }

  function getWorldRequest() {
    ensureInitialized();
    return Object.freeze({
      frameRevision: state.frameRevision,
      presentationMode: state.presentationMode,
      selectedCardinal: state.selectedCardinal,
      selectedRoom: state.selectedRoom,
      activeClusterWing: state.activeClusterWing,
      held: state.held,
      reducedMotion: state.reducedMotion,
      orbitOrientation: Object.freeze({
        quaternion: Object.freeze(Array.from(state.orbit.previewQuaternion))
      }),
      committedOrbitOrientation: Object.freeze({
        quaternion: Object.freeze(Array.from(state.orbit.committedQuaternion))
      }),
      orbit: Object.freeze({
        previewQuaternion: Object.freeze(Array.from(state.orbit.previewQuaternion)),
        committedQuaternion: Object.freeze(Array.from(state.orbit.committedQuaternion)),
        previewPrimaryId: state.orbit.previewPrimaryId,
        committedPrimaryId: state.orbit.committedPrimaryId
      }),
      cluster: Object.freeze({
        wing: state.cluster.wing,
        orientation: Object.freeze({
          quaternion: Object.freeze(Array.from(state.cluster.previewQuaternion))
        }),
        previewQuaternion: Object.freeze(Array.from(state.cluster.previewQuaternion)),
        committedQuaternion: Object.freeze(Array.from(state.cluster.committedQuaternion)),
        previewPrimaryId: state.cluster.previewPrimaryId,
        committedPrimaryId: state.cluster.committedPrimaryId
      })
    });
  }

  function getControllerContract() {
    return Object.freeze({
      module: MODULE,
      authority: Object.freeze({
        transactions: true,
        navigation: true,
        projectionAdmission: true,
        gestureCustody: true,
        worldGeometry: false,
        cameraProjection: false,
        pointerInterpretation: false
      }),
      methods: Object.freeze([
        "initialize", "getFrameState", "getWorldRequest",
        "submitProjectionSnapshot", "getAcceptedProjectionSnapshot",
        "getSemanticProjection", "subscribeFrameState",
        "subscribeSemanticProjection", "beginGesture",
        "replaceGestureTarget", "endGesture",
        "beginOrbitGesture", "requestOrbitPreview",
        "requestOrbitCommit", "requestOrbitCancel",
        "beginClusterGesture", "requestClusterPreview",
        "requestClusterCommit", "requestClusterCancel",
        "requestCardinalSelection", "requestRoomSelection",
        "requestCompassSelection", "requestReturnToConstellation",
        "setHeld", "setReducedMotion", "receipt", "dispose"
      ])
    });
  }

  function receipt() {
    return Object.freeze({
      module: MODULE,
      initialized: state.initialized,
      disposed: state.disposed,
      frameRevision: state.frameRevision,
      acceptedWorldRevision: state.acceptedWorldRevision,
      acceptedProjectionRevision: state.acceptedProjectionRevision,
      semanticProjectionCount: state.semanticProjection.length,
      activeGesture: cloneGesture(state.gesture),
      lastAction: state.lastAction,
      lastFailure: state.lastFailure
    });
  }

  function dispose() {
    listeners.clear();
    projectionListeners.clear();
    state.root = null;
    state.planet = null;
    state.gesture = null;
    state.semanticProjection = Object.freeze([]);
    state.projectionSnapshot = null;
    state.initialized = false;
    state.disposed = true;
    state.lastAction = "dispose";
    return receipt();
  }

  const API = Object.freeze({
    initialize,
    getFrameState,
    getWorldRequest,
    submitProjectionSnapshot,
    getAcceptedProjectionSnapshot,
    getSemanticProjection,
    subscribeFrameState,
    subscribeSemanticProjection,
    beginGesture,
    replaceGestureTarget,
    endGesture,
    beginOrbitGesture,
    requestOrbitPreview,
    requestOrbitCommit,
    requestOrbitCancel,
    beginClusterGesture,
    requestClusterPreview,
    requestClusterCommit,
    requestClusterCancel,
    requestCardinalSelection,
    requestRoomSelection,
    requestCompassSelection,
    requestReturnToConstellation,
    setHeld,
    setReducedMotion,
    getControllerContract,
    normalizeQuaternion,
    receipt,
    dispose
  });

  globalThis.DGB_ARCHCOIN_CONTROLLER = API;
})();
