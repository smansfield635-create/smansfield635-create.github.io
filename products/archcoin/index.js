/* ==========================================================================
   /products/archcoin/index.js

   ARCHCOIN
   FOUR-COIN CONSTELLATION RUNTIME
   CONTROLLER-CONFORMANT CANVAS + 3D-LIKE ORBIT / CLUSTER ENHANCEMENT

   Full-file renewal scope:
   - Conform to DGB_ARCHCOIN_CONTROLLER as the single anchor authority.
   - Preserve visible-first HTML behavior when runtime is absent.
   - Enhance the anchored HTML with runtime-only orbital motion and
     controller-conformant interaction support.
   - Render a 3D-like four-coin outer constellation and per-wing
     four-room cluster descent using spherical quaternion motion.
   - Keep semantic HTML controls authoritative and accessible.
   - Distinguish tap, drag, controlled release, and quick cluster flick return.
   - Never invent alternate page states or alternate controller contracts.
   - Fail soft.

   Owns:
   - runtime canvas field
   - transient orbit / cluster presentation
   - runtime gesture bridge
   - 3D-like projection math
   - runtime receipts

   Does not own:
   - page state authority
   - durable DOM meaning
   - legal transitions
   - financial claims
   - controller contract
   - semantic panel content
========================================================================== */

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_CONSTELLATION_RUNTIME_CONTROLLER_CONFORMANT_REBUILD_v2",
    previousId: "ARCHCOIN_TRANSACTION_ORBIT_RUNTIME_REBUILD_v1",
    file: "/products/archcoin/index.js",
    releaseId: "archcoin-constellation-runtime-v2",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const CONTROLLER_STATES = Object.freeze({
    ORBIT: "ORBIT",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    INFO_OPEN: "INFO_OPEN",
    HELD: "HELD"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const COINS = Object.freeze(["contract", "receivable", "payable", "allocation"]);
  const TABS = Object.freeze(["overview", "engineering", "platform", "governance"]);

  const COIN_BY_WING = Object.freeze({
    north: "contract",
    east: "receivable",
    south: "payable",
    west: "allocation"
  });

  const WING_BY_COIN = Object.freeze({
    contract: "north",
    receivable: "east",
    payable: "south",
    allocation: "west"
  });

  const TAB_LABELS = Object.freeze({
    overview: "Overview",
    engineering: "Engineering",
    platform: "Platform",
    governance: "Governance"
  });

  const GESTURE = Object.freeze({
    dragDeadZonePx: 6,
    maximumTapDistancePx: 12,
    minimumDragDistancePx: 8,
    radiansPerViewport: Math.PI * 1.10,
    settleSpeed: 7.2,
    suppressClickMs: 520,
    sampleWindowMs: 140,
    maximumSamples: 18,
    flickMaximumDurationMs: 260,
    flickMinimumDistancePx: 52,
    flickMinimumAverageVelocityPxPerMs: 0.55,
    flickMinimumReleaseVelocityPxPerMs: 0.72,
    flickMinimumDirectionalRatio: 1.24,
    flickMaximumPauseBeforeReleaseMs: 90,
    flickMaximumPathEfficiencyLoss: 0.24
  });

  const QUALITY = Object.freeze({
    maximumDevicePixelRatio: 2,

    orbitHorizontalRadius: 1.46,
    orbitVerticalRadius: 1.18,
    orbitDepthRadius: 1.06,

    clusterHorizontalRadius: 1.14,
    clusterVerticalRadius: 0.95,
    clusterDepthRadius: 0.88,

    orbitPrimaryAnchor: Object.freeze([0, 0.72, 0.69]),
    clusterPrimaryAnchor: Object.freeze([0, 0.66, 0.75]),

    orbitCardScale: 1.00,
    orbitFocusedScale: 1.22,

    clusterNodeScale: 0.82,
    clusterPrimaryScale: 1.08,
    clusterSelectedScale: 1.14,

    maximumCardinalLift: 0.12,
    maximumNodeLift: 0.08,

    atmosphereStarMinimum: 72,
    atmosphereStarMaximum: 160,

    maxYaw: 0.22,
    maxPitch: 0.14
  });

  const COIN_BASE_VECTORS = Object.freeze({
    contract: Object.freeze([0, 1, 0]),
    receivable: Object.freeze([1, 0, 0]),
    payable: Object.freeze([0, -1, 0]),
    allocation: Object.freeze([-1, 0, 0])
  });

  const COIN_DISPLAY = Object.freeze({
    contract: Object.freeze({
      label: "Contract",
      color: "rgba(243,200,111,1)",
      glow: "rgba(243,200,111,0.34)"
    }),
    receivable: Object.freeze({
      label: "Receivable",
      color: "rgba(141,216,255,1)",
      glow: "rgba(141,216,255,0.34)"
    }),
    payable: Object.freeze({
      label: "Payable",
      color: "rgba(255,179,154,1)",
      glow: "rgba(255,179,154,0.32)"
    }),
    allocation: Object.freeze({
      label: "Allocation",
      color: "rgba(143,240,195,1)",
      glow: "rgba(143,240,195,0.30)"
    })
  });

  const WING_RING_ROTATION = Object.freeze({
    north: 0,
    east: Math.PI / 2,
    south: Math.PI,
    west: Math.PI * 1.5
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    previousContractId: CONTRACT.previousId,
    status: "pending",
    rendererInitialized: false,
    runtimeControllerPresent: false,
    runtimeState: CONTROLLER_STATES.ORBIT,
    selectedWing: "",
    selectedCoin: "",
    selectedRoom: "",
    activeTab: "overview",
    orbitFocus: "north",
    orbitPreviewFocus: "north",
    activeClusterWing: "",
    clusterPrimaryRoom: "",
    clusterPreviewPrimaryRoom: "",
    lastGestureType: "",
    lastGestureDistance: 0,
    lastGestureDurationMs: 0,
    lastAverageVelocityPxPerMs: 0,
    lastReleaseVelocityPxPerMs: 0,
    reducedMotion: false,
    visualPassClaimed: false,
    failureReason: ""
  };

  const state = {
    root: null,
    scene: null,
    objects: null,
    geometryMount: null,
    guidance: null,
    receiptOutput: null,

    canvas: null,
    context: null,
    runtimeRoomLayer: null,
    runtimeRoomButtons: new Map(),

    controller: null,

    width: 1,
    height: 1,
    pixelRatio: 1,

    time: 0,
    lastTime: 0,
    raf: 0,
    running: false,
    initialized: false,
    reducedMotion: false,
    failureReason: "",

    fieldStars: [],

    orbitButtonsByWing: new Map(),
    roomButtonsById: new Map(),

    orbitQuaternion: [0, 0, 0, 1],
    orbitTargetQuaternion: [0, 0, 0, 1],

    clusterQuaternionsByWing: new Map(),
    clusterTargetQuaternionsByWing: new Map(),

    pointer: null,
    suppressClickUntil: 0
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function cssEscape(value) {
    const text = String(value || "");
    if (globalThis.CSS && typeof globalThis.CSS.escape === "function") {
      return globalThis.CSS.escape(text);
    }
    return text.replace(/["\\]/g, "\\$&");
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function lerp(a, b, amount) {
    return a + (b - a) * amount;
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function now() {
    return performance.now();
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeCoin(value) {
    const coin = String(value || "").trim().toLowerCase();
    return COINS.includes(coin) ? coin : "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function normalizeTab(value) {
    const tab = String(value || "").trim().toLowerCase();
    return TABS.includes(tab) ? tab : "overview";
  }

  function coinForWing(wing) {
    return COIN_BY_WING[normalizeWing(wing)] || "";
  }

  function wingForCoin(coin) {
    return WING_BY_COIN[normalizeCoin(coin)] || "";
  }

  function vectorLength(vector) {
    return Math.hypot(vector[0], vector[1], vector[2]);
  }

  function normalizeVector(vector, fallback = [0, 0, 1]) {
    const length = vectorLength(vector);
    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }

    return [vector[0] / length, vector[1] / length, vector[2] / length];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function quaternionNormalize(value, fallback = [0, 0, 0, 1]) {
    const source =
      Array.isArray(value) || ArrayBuffer.isView(value) ? Array.from(value) : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
    ];

    const length = Math.hypot(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    );

    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }

    return quaternion.map((component) => component / length);
  }

  function quaternionMultiplyRaw(a, b) {
    return [
      a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
      a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
      a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
      a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
    ];
  }

  function quaternionMultiply(a, b) {
    return quaternionNormalize(quaternionMultiplyRaw(a, b));
  }

  function quaternionConjugate(quaternion) {
    return [-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3]];
  }

  function quaternionFromAxisAngle(axis, angle) {
    const normalizedAxis = normalizeVector(axis);
    const half = angle * 0.5;
    const sine = Math.sin(half);

    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
  }

  function quaternionRotateVector(quaternion, vector) {
    const q = quaternionNormalize(quaternion);
    const pure = [vector[0], vector[1], vector[2], 0];
    const rotated = quaternionMultiplyRaw(
      quaternionMultiplyRaw(q, pure),
      quaternionConjugate(q)
    );

    return [rotated[0], rotated[1], rotated[2]];
  }

  function quaternionFromUnitVectors(fromVector, toVector) {
    const from = normalizeVector(fromVector);
    const to = normalizeVector(toVector);
    const cosine = clamp(dot(from, to), -1, 1);

    if (cosine > 0.999999) {
      return [0, 0, 0, 1];
    }

    if (cosine < -0.999999) {
      let axis = cross([1, 0, 0], from);

      if (vectorLength(axis) < 1e-6) {
        axis = cross([0, 1, 0], from);
      }

      return quaternionFromAxisAngle(normalizeVector(axis), Math.PI);
    }

    const axis = cross(from, to);
    return quaternionNormalize([axis[0], axis[1], axis[2], 1 + cosine]);
  }

  function quaternionSlerp(fromValue, toValue, amount) {
    const from = quaternionNormalize(fromValue);
    let to = quaternionNormalize(toValue);

    let cosine =
      from[0] * to[0] +
      from[1] * to[1] +
      from[2] * to[2] +
      from[3] * to[3];

    if (cosine < 0) {
      to = [-to[0], -to[1], -to[2], -to[3]];
      cosine = -cosine;
    }

    if (cosine > 0.9995) {
      return quaternionNormalize([
        from[0] + (to[0] - from[0]) * amount,
        from[1] + (to[1] - from[1]) * amount,
        from[2] + (to[2] - from[2]) * amount,
        from[3] + (to[3] - from[3]) * amount
      ]);
    }

    const theta = Math.acos(clamp(cosine, -1, 1));
    const sineTheta = Math.sin(theta);

    const weightFrom = Math.sin((1 - amount) * theta) / sineTheta;
    const weightTo = Math.sin(amount * theta) / sineTheta;

    return quaternionNormalize([
      from[0] * weightFrom + to[0] * weightTo,
      from[1] * weightFrom + to[1] * weightTo,
      from[2] * weightFrom + to[2] * weightTo,
      from[3] * weightFrom + to[3] * weightTo
    ]);
  }

  function safeQuaternion(value, fallback = [0, 0, 0, 1]) {
    return quaternionNormalize(value, fallback);
  }

  function emitReceipt(extra = {}) {
    const frame = getControllerFrame();

    Object.assign(
      RECEIPT,
      {
        status: state.failureReason || frame.state === CONTROLLER_STATES.HELD ? "held" : "available",
        rendererInitialized: state.initialized,
        runtimeControllerPresent: Boolean(state.controller),
        runtimeState: frame.state,
        selectedWing: normalizeWing(frame.selectedCardinal),
        selectedCoin: normalizeCoin(frame.selectedCoin),
        selectedRoom: normalizeRoomId(frame.selectedRoom),
        activeTab: normalizeTab(
          state.root && state.root.dataset ? state.root.dataset.archcoinActiveTab : "overview"
        ),
        orbitFocus: normalizeWing(frame.orbitFocus) || "north",
        orbitPreviewFocus: normalizeWing(frame.orbitPreviewFocus) || normalizeWing(frame.orbitFocus) || "north",
        activeClusterWing: normalizeWing(frame.activeClusterWing),
        clusterPrimaryRoom:
          frame.cluster && frame.cluster.primaryRoom ? normalizeRoomId(frame.cluster.primaryRoom) : "",
        clusterPreviewPrimaryRoom:
          frame.cluster && frame.cluster.previewPrimaryRoom
            ? normalizeRoomId(frame.cluster.previewPrimaryRoom)
            : "",
        reducedMotion: state.reducedMotion,
        visualPassClaimed: false,
        failureReason: state.failureReason || "",
        ...extra
      }
    );

    const serialized = JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.archcoinRuntimeReceipt = serialized;
      state.root.dataset.archcoinRuntimeStatus = RECEIPT.status;
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.scene) {
      state.scene.dataset.archcoinRuntimeStatus = RECEIPT.status;
      state.scene.dataset.visualPassClaimed = "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value = serialized;
      state.receiptOutput.textContent = serialized;
      state.receiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis.ARCHCOIN_CONSTELLATION_RUNTIME_RECEIPT = Object.freeze({
      ...RECEIPT
    });
  }

  function failHeld(reason) {
    state.failureReason = String(reason || "UNKNOWN_RUNTIME_FAILURE");
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    emitReceipt({
      status: "held",
      rendererInitialized: false,
      lastGestureType: "runtime-held"
    });
  }

  function getControllerFrame() {
    if (state.controller && typeof state.controller.getFrameState === "function") {
      return state.controller.getFrameState();
    }

    return Object.freeze({
      state: CONTROLLER_STATES.HELD,
      orbitFocus: "north",
      orbitPreviewFocus: "north",
      orbitPhase: "COMMITTED",
      orbitGestureActive: false,
      orbitOrientation: Object.freeze({
        quaternion: Object.freeze([0, 0, 0, 1]),
        primaryId: "north"
      }),
      activeClusterWing: "",
      cluster: null,
      selectedCardinal: "",
      selectedCoin: "",
      selectedRoom: "",
      selectedDestinationType: "",
      selectedDestinationId: "",
      selectedDestinationLabel: "",
      selectedRoute: "",
      reducedMotion: true,
      prominence: Object.freeze({
        compass: 1,
        window: 0
      })
    });
  }

  function orbitAnchorVector() {
    return normalizeVector(QUALITY.orbitPrimaryAnchor);
  }

  function clusterAnchorVector() {
    return normalizeVector(QUALITY.clusterPrimaryAnchor);
  }

  function clusterBaseVector(index, count, wing) {
    const safeCount = Math.max(1, count);
    const rotation = finiteNumber(WING_RING_ROTATION[normalizeWing(wing)], 0);
    const longitude = (Math.PI * 2 * index) / safeCount - Math.PI / 2 + rotation;
    const latitude = Math.sin((index + 0.5) * 1.73) * 0.44;
    const cosineLatitude = Math.cos(latitude);

    return normalizeVector([
      Math.cos(longitude) * cosineLatitude,
      Math.sin(latitude),
      Math.sin(longitude) * cosineLatitude
    ]);
  }

  function nearestOrbitWing(quaternion) {
    const anchor = orbitAnchorVector();

    let bestWing = "north";
    let bestScore = -Infinity;

    WINGS.forEach((wing) => {
      const coin = coinForWing(wing);
      const rotated = normalizeVector(quaternionRotateVector(quaternion, COIN_BASE_VECTORS[coin]));
      const score = dot(rotated, anchor);

      if (score > bestScore) {
        bestScore = score;
        bestWing = wing;
      }
    });

    return bestWing;
  }

  function roomButtonsForWing(wing) {
    return qsa(`[data-archcoin-room][data-wing="${cssEscape(wing)}"]`, state.root);
  }

  function nearestPrimaryRoomId(wing, quaternion) {
    const buttons = roomButtonsForWing(wing);
    const anchor = clusterAnchorVector();

    let bestRoomId = buttons.length
      ? normalizeRoomId(buttons[0].dataset.roomId)
      : "";
    let bestScore = -Infinity;

    buttons.forEach((button, index) => {
      const base = clusterBaseVector(index, buttons.length, wing);
      const rotated = normalizeVector(quaternionRotateVector(quaternion, base));
      const score = dot(rotated, anchor);
      const roomId = normalizeRoomId(button.dataset.roomId);

      if (score > bestScore) {
        bestScore = score;
        bestRoomId = roomId;
      }
    });

    return bestRoomId;
  }

  function settledOrbitQuaternion(wing, currentQuaternion) {
    const coin = coinForWing(wing) || "contract";
    const currentVector = normalizeVector(
      quaternionRotateVector(currentQuaternion, COIN_BASE_VECTORS[coin])
    );

    const alignment = quaternionFromUnitVectors(currentVector, orbitAnchorVector());
    return quaternionNormalize(quaternionMultiply(alignment, currentQuaternion));
  }

  function settledClusterQuaternion(roomId, wing, currentQuaternion) {
    const buttons = roomButtonsForWing(wing);
    const index = Math.max(
      0,
      buttons.findIndex((button) => normalizeRoomId(button.dataset.roomId) === normalizeRoomId(roomId))
    );

    const currentVector = normalizeVector(
      quaternionRotateVector(
        currentQuaternion,
        clusterBaseVector(index, Math.max(1, buttons.length), wing)
      )
    );

    const alignment = quaternionFromUnitVectors(currentVector, clusterAnchorVector());
    return quaternionNormalize(quaternionMultiply(alignment, currentQuaternion));
  }

  function createRuntimeCanvas() {
    const existing = qs("canvas[data-archcoin-runtime-canvas]", state.geometryMount);
    if (existing) {
      return existing;
    }

    const canvas = document.createElement("canvas");
    canvas.dataset.archcoinRuntimeCanvas = "true";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";

    state.geometryMount.appendChild(canvas);
    return canvas;
  }

  function createRuntimeRoomLayer() {
    const existing = qs("[data-archcoin-runtime-room-layer]", state.geometryMount);
    if (existing) {
      return existing;
    }

    const layer = document.createElement("div");
    layer.dataset.archcoinRuntimeRoomLayer = "true";
    layer.style.position = "absolute";
    layer.style.inset = "0";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "6";

    state.geometryMount.appendChild(layer);
    return layer;
  }

  function buildFieldStars() {
    const cssWidth = state.width / state.pixelRatio;
    const cssHeight = state.height / state.pixelRatio;
    const count = Math.min(
      QUALITY.atmosphereStarMaximum,
      Math.max(
        QUALITY.atmosphereStarMinimum,
        Math.floor((cssWidth * cssHeight) / 14000)
      )
    );

    state.fieldStars = Array.from({ length: count }, () => ({
      x: Math.random() * cssWidth,
      y: Math.random() * cssHeight,
      z: 0.22 + Math.random() * 0.78,
      size: 0.55 + Math.random() * 1.9,
      drift: (Math.random() - 0.5) * 0.08,
      pulse: Math.random() * Math.PI * 2
    }));
  }

  function resize() {
    const rect = state.scene.getBoundingClientRect();
    const ratio = Math.min(
      globalThis.devicePixelRatio || 1,
      QUALITY.maximumDevicePixelRatio
    );

    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));

    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.canvas.style.width = `${Math.max(1, rect.width)}px`;
    state.canvas.style.height = `${Math.max(1, rect.height)}px`;

    state.width = width;
    state.height = height;
    state.pixelRatio = ratio;

    buildFieldStars();
  }

  function stageCssSize() {
    const rect = state.scene.getBoundingClientRect();
    return {
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height)
    };
  }

  function syncRuntimeStageBaseline() {
    state.scene.dataset.archcoinRuntime = "true";
    state.scene.style.touchAction = "none";
    state.scene.style.overscrollBehavior = "contain";

    state.geometryMount.style.position = "absolute";
    state.geometryMount.style.inset = "0";
    state.geometryMount.style.pointerEvents = "none";
    state.geometryMount.style.zIndex = "2";

    state.objects.style.zIndex = "7";

    state.orbitButtonsByWing.forEach((button) => {
      button.style.position = "absolute";
      button.style.left = "50%";
      button.style.top = "50%";
      button.style.animation = "none";
      button.style.zIndex = "7";
      button.style.pointerEvents = "auto";
      button.dataset.archcoinRuntimeEnhanced = "true";
    });
  }

  function initializeMaps() {
    WINGS.forEach((wing) => {
      state.clusterQuaternionsByWing.set(wing, [0, 0, 0, 1]);
      state.clusterTargetQuaternionsByWing.set(wing, [0, 0, 0, 1]);
    });

    qsa("[data-archcoin-cardinal]", state.root).forEach((button) => {
      const wing = normalizeWing(button.dataset.wing);
      if (!wing) {
        return;
      }
      state.orbitButtonsByWing.set(wing, button);
    });

    qsa("[data-archcoin-room]", state.root).forEach((button) => {
      const roomId = normalizeRoomId(button.dataset.roomId);
      if (!roomId) {
        return;
      }
      state.roomButtonsById.set(roomId, button);
    });

    if (state.orbitButtonsByWing.size !== 4) {
      throw new Error(`ARCHCOIN_CARDINAL_COUNT_INVALID:${state.orbitButtonsByWing.size}`);
    }
  }

  function createRuntimeRoomButton(roomId, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.hidden = true;
    button.setAttribute("aria-hidden", "true");
    button.className = "archcoin-room";
    button.dataset.archcoinRuntimeRoomButton = "true";
    button.dataset.roomId = roomId;
    button.style.position = "absolute";
    button.style.left = "50%";
    button.style.top = "50%";
    button.style.pointerEvents = "auto";
    button.style.zIndex = "8";
    button.style.animation = "none";
    button.style.margin = "0";
    button.style.transform = "translate(-50%, -50%)";
    button.innerHTML = `
      <span class="archcoin-room-upright">
        <span class="archcoin-gem-core">
          <svg class="arch-gem-svg" viewBox="0 0 220 160" aria-hidden="true" focusable="false">
            <use href="#archDigitalGem"></use>
          </svg>
          <span class="gem-label">
            <b>${label}</b>
            <strong></strong>
          </span>
        </span>
      </span>
    `;
    return button;
  }

  function ensureRuntimeRoomButtons() {
    qsa("[data-archcoin-room]", state.root).forEach((roomButton) => {
      const roomId = normalizeRoomId(roomButton.dataset.roomId);
      const tab = normalizeTab(roomButton.dataset.tab);
      if (!roomId || state.runtimeRoomButtons.has(roomId)) {
        return;
      }

      const runtimeButton = createRuntimeRoomButton(
        roomId,
        TAB_LABELS[tab] || "Path"
      );

      runtimeButton.addEventListener("click", (event) => {
        if (now() < state.suppressClickUntil) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (!state.controller || typeof state.controller.requestRoomSelection !== "function") {
          return;
        }

        event.preventDefault();
        state.controller.requestRoomSelection(roomId, "runtime-click");
      });

      state.runtimeRoomLayer.appendChild(runtimeButton);
      state.runtimeRoomButtons.set(roomId, runtimeButton);
    });
  }

  function readReducedMotion(frame) {
    const mediaReduced =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

    state.reducedMotion = Boolean(frame && frame.reducedMotion) || Boolean(mediaReduced);
  }

  function projectOrbitWing(wing, quaternion) {
    const coin = coinForWing(wing);
    const unit = normalizeVector(quaternionRotateVector(quaternion, COIN_BASE_VECTORS[coin]));

    return {
      x: unit[0] * QUALITY.orbitHorizontalRadius,
      y: unit[1] * QUALITY.orbitVerticalRadius,
      z: unit[2] * QUALITY.orbitDepthRadius,
      depth: (unit[2] + 1) / 2,
      primary: clamp((dot(unit, orbitAnchorVector()) + 1) / 2, 0, 1)
    };
  }

  function projectClusterRoom(roomId, wing, quaternion) {
    const buttons = roomButtonsForWing(wing);
    const index = Math.max(
      0,
      buttons.findIndex((button) => normalizeRoomId(button.dataset.roomId) === normalizeRoomId(roomId))
    );

    const unit = normalizeVector(
      quaternionRotateVector(
        quaternion,
        clusterBaseVector(index, Math.max(1, buttons.length), wing)
      )
    );

    return {
      x: unit[0] * QUALITY.clusterHorizontalRadius,
      y: unit[1] * QUALITY.clusterVerticalRadius,
      z: unit[2] * QUALITY.clusterDepthRadius,
      depth: (unit[2] + 1) / 2,
      primary: clamp((dot(unit, clusterAnchorVector()) + 1) / 2, 0, 1)
    };
  }

  function placeOrbitButtons(frame) {
    const size = stageCssSize();
    const centerX = size.width * 0.5;
    const centerY = size.height * 0.5;

    const focusWing = normalizeWing(frame.orbitFocus) || "north";
    const selectedWing = normalizeWing(frame.selectedCardinal);

    state.orbitButtonsByWing.forEach((button, wing) => {
      const projection = projectOrbitWing(wing, state.orbitQuaternion);
      const focused = wing === focusWing;
      const selected = wing === selectedWing;

      const x = centerX + projection.x * size.width * 0.24;
      const y = centerY + projection.y * size.height * 0.22;

      const scale =
        (focused ? QUALITY.orbitFocusedScale : QUALITY.orbitCardScale) *
        (0.76 + projection.depth * 0.36) *
        (selected ? 1.05 : 1);

      const opacity = clamp(
        0.42 + projection.depth * 0.52 + (focused ? 0.12 : 0),
        0.20,
        1
      );

      const brightness = focused
        ? 1.14
        : 0.86 + projection.depth * 0.22;

      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      button.style.transform = `translate(-50%, -50%) scale(${scale})`;
      button.style.opacity = String(opacity);
      button.style.filter = `brightness(${brightness}) saturate(${focused ? 1.08 : 1})`;
      button.style.zIndex = String(12 + Math.round(projection.depth * 40) + (focused ? 8 : 0));

      button.dataset.archcoinRuntimeFocused = focused ? "true" : "false";
      button.dataset.archcoinRuntimeSelected = selected ? "true" : "false";
      button.dataset.archcoinRuntimeDepth = projection.depth.toFixed(4);
    });
  }

  function hideRuntimeRooms() {
    state.runtimeRoomButtons.forEach((button) => {
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
      button.style.pointerEvents = "none";
    });
  }

  function placeRuntimeRoomButtons(frame) {
    const clusterActive =
      frame.state === CONTROLLER_STATES.CLUSTER_OPEN ||
      frame.state === CONTROLLER_STATES.INFO_OPEN;

    const activeWing = normalizeWing(frame.activeClusterWing || frame.selectedCardinal);
    const selectedRoom = normalizeRoomId(frame.selectedRoom);

    if (!clusterActive || !activeWing) {
      hideRuntimeRooms();
      return;
    }

    const quaternion =
      state.clusterQuaternionsByWing.get(activeWing) || [0, 0, 0, 1];

    const primaryRoom =
      frame.cluster && frame.cluster.primaryRoom
        ? normalizeRoomId(frame.cluster.primaryRoom)
        : nearestPrimaryRoomId(activeWing, quaternion);

    const size = stageCssSize();
    const centerX = size.width * 0.5;
    const centerY = size.height * 0.5;

    state.runtimeRoomButtons.forEach((button, roomId) => {
      const roomButton = state.roomButtonsById.get(roomId);
      const roomWing = roomButton ? normalizeWing(roomButton.dataset.wing) : "";

      if (roomWing !== activeWing) {
        button.hidden = true;
        button.setAttribute("aria-hidden", "true");
        button.style.pointerEvents = "none";
        return;
      }

      const projection = projectClusterRoom(roomId, activeWing, quaternion);
      const primary = roomId === primaryRoom;
      const selected = roomId === selectedRoom;

      const x = centerX + projection.x * size.width * 0.18;
      const y = centerY + projection.y * size.height * 0.17;

      const scale =
        (selected
          ? QUALITY.clusterSelectedScale
          : primary
            ? QUALITY.clusterPrimaryScale
            : QUALITY.clusterNodeScale) *
        (0.76 + projection.depth * 0.34);

      const opacity = clamp(
        0.38 +
          projection.depth * 0.48 +
          (primary ? 0.12 : 0) +
          (selected ? 0.08 : 0),
        0.16,
        1
      );

      button.hidden = false;
      button.setAttribute("aria-hidden", "false");
      button.style.pointerEvents = "auto";
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      button.style.transform = `translate(-50%, -50%) scale(${scale})`;
      button.style.opacity = String(opacity);
      button.style.zIndex = String(
        18 + Math.round(projection.depth * 40) + (primary ? 8 : 0) + (selected ? 8 : 0)
      );

      button.dataset.archcoinRuntimePrimary = primary ? "true" : "false";
      button.dataset.archcoinRuntimeSelected = selected ? "true" : "false";
      button.dataset.archcoinRuntimeDepth = projection.depth.toFixed(4);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function drawField(frame, deltaTime) {
    const context = state.context;
    if (!context) {
      return;
    }

    const cssWidth = state.width / state.pixelRatio;
    const cssHeight = state.height / state.pixelRatio;

    context.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
    context.clearRect(0, 0, cssWidth, cssHeight);

    const clusterActive =
      frame.state === CONTROLLER_STATES.CLUSTER_OPEN ||
      frame.state === CONTROLLER_STATES.INFO_OPEN;

    state.fieldStars.forEach((star) => {
      star.pulse += deltaTime * (state.reducedMotion ? 0 : 0.8 + star.z * 0.9);
      star.y += state.reducedMotion ? 0 : star.drift * star.z * 0.6;

      if (star.y < -10) {
        star.y = cssHeight + 10;
      }

      if (star.y > cssHeight + 10) {
        star.y = -10;
      }

      const alpha = 0.16 + (Math.sin(star.pulse) * 0.5 + 0.5) * 0.34 * star.z;

      context.beginPath();
      context.fillStyle = `rgba(190,225,255,${alpha.toFixed(3)})`;
      context.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
      context.fill();
    });

    const radial = context.createRadialGradient(
      cssWidth * 0.5,
      cssHeight * 0.38,
      0,
      cssWidth * 0.5,
      cssHeight * 0.5,
      Math.max(cssWidth, cssHeight) * 0.52
    );

    radial.addColorStop(0, clusterActive ? "rgba(127,255,212,0.075)" : "rgba(127,255,212,0.052)");
    radial.addColorStop(0.44, clusterActive ? "rgba(126,203,255,0.048)" : "rgba(126,203,255,0.032)");
    radial.addColorStop(1, "rgba(0,0,0,0)");

    context.fillStyle = radial;
    context.fillRect(0, 0, cssWidth, cssHeight);

    context.save();
    context.translate(cssWidth * 0.5, cssHeight * 0.5);
    context.strokeStyle = clusterActive ? "rgba(143,187,224,0.16)" : "rgba(143,187,224,0.10)";
    context.lineWidth = 1;

    context.beginPath();
    context.ellipse(0, 0, cssWidth * 0.24, cssHeight * 0.17, 0.12, 0, Math.PI * 2);
    context.stroke();

    context.beginPath();
    context.ellipse(0, 0, cssWidth * 0.14, cssHeight * 0.10, -0.08, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  function pointerDistance(pointer, clientX, clientY) {
    return Math.hypot(clientX - pointer.startX, clientY - pointer.startY);
  }

  function addPointerSample(pointer, clientX, clientY, time) {
    pointer.samples.push({ x: clientX, y: clientY, time });

    const minimumTime = time - Math.max(GESTURE.sampleWindowMs * 2, 260);

    pointer.samples = pointer.samples
      .filter((sample) => sample.time >= minimumTime)
      .slice(-GESTURE.maximumSamples);
  }

  function gestureMetrics(pointer, endX, endY, endTime) {
    const dx = endX - pointer.startX;
    const dy = endY - pointer.startY;
    const distance = Math.hypot(dx, dy);
    const durationMs = Math.max(1, endTime - pointer.startTime);
    const averageVelocity = distance / durationMs;

    const recentSamples = pointer.samples.filter(
      (sample) => sample.time >= endTime - GESTURE.sampleWindowMs
    );

    const releaseStart = recentSamples.length
      ? recentSamples[0]
      : { x: pointer.startX, y: pointer.startY, time: pointer.startTime };

    const releaseDistance = Math.hypot(endX - releaseStart.x, endY - releaseStart.y);
    const releaseDuration = Math.max(1, endTime - releaseStart.time);
    const releaseVelocity = releaseDistance / releaseDuration;

    let pathLength = 0;
    let previous = { x: pointer.startX, y: pointer.startY };

    pointer.samples.forEach((sample) => {
      pathLength += Math.hypot(sample.x - previous.x, sample.y - previous.y);
      previous = sample;
    });

    pathLength += Math.hypot(endX - previous.x, endY - previous.y);

    const pathEfficiency = pathLength > 0 ? distance / pathLength : 1;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const directionalRatio = Math.max(absX, absY) / Math.max(1, Math.min(absX, absY));

    const lastSample = pointer.samples.length
      ? pointer.samples[pointer.samples.length - 1]
      : null;

    const pauseBeforeRelease = lastSample ? Math.max(0, endTime - lastSample.time) : durationMs;

    return {
      dx,
      dy,
      distance,
      durationMs,
      averageVelocity,
      releaseVelocity,
      pathEfficiency,
      directionalRatio,
      pauseBeforeRelease
    };
  }

  function isQuickClusterFlick(metrics) {
    return (
      metrics.durationMs <= GESTURE.flickMaximumDurationMs &&
      metrics.distance >= GESTURE.flickMinimumDistancePx &&
      metrics.averageVelocity >= GESTURE.flickMinimumAverageVelocityPxPerMs &&
      metrics.releaseVelocity >= GESTURE.flickMinimumReleaseVelocityPxPerMs &&
      metrics.directionalRatio >= GESTURE.flickMinimumDirectionalRatio &&
      metrics.pauseBeforeRelease <= GESTURE.flickMaximumPauseBeforeReleaseMs &&
      1 - metrics.pathEfficiency <= GESTURE.flickMaximumPathEfficiencyLoss
    );
  }

  function dragQuaternionFromPointer(pointer, clientX, clientY) {
    const rect = state.scene.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    const dx = clientX - pointer.startX;
    const dy = clientY - pointer.startY;

    const yaw = (dx / width) * GESTURE.radiansPerViewport;
    const pitch = (dy / height) * GESTURE.radiansPerViewport;

    const yawQuaternion = quaternionFromAxisAngle([0, 1, 0], yaw);
    const pitchQuaternion = quaternionFromAxisAngle([1, 0, 0], pitch);

    return quaternionNormalize(
      quaternionMultiply(pitchQuaternion, quaternionMultiply(yawQuaternion, pointer.startQuaternion))
    );
  }

  function findOrbitHit(target) {
    const button =
      target && target.closest ? target.closest("[data-archcoin-cardinal]") : null;

    if (!button) {
      return "";
    }

    return normalizeWing(button.dataset.wing);
  }

  function findClusterHit(target) {
    const button =
      target && target.closest ? target.closest("[data-archcoin-runtime-room-button]") : null;

    if (!button) {
      return "";
    }

    return normalizeRoomId(button.dataset.roomId);
  }

  function startPointerCapture(event) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch (_) {}
  }

  function releasePointerCapture(event) {
    try {
      if (
        event.currentTarget &&
        event.currentTarget.hasPointerCapture &&
        event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (_) {}
  }

  function bindPointerBridge() {
    state.scene.addEventListener(
      "pointerdown",
      (event) => {
        if (now() < state.suppressClickUntil) {
          event.preventDefault();
          return;
        }

        const frame = getControllerFrame();
        const orbitHit = findOrbitHit(event.target);
        const clusterHit = findClusterHit(event.target);

        const scope =
          frame.state === CONTROLLER_STATES.ORBIT
            ? "orbit"
            : frame.state === CONTROLLER_STATES.CLUSTER_OPEN || frame.state === CONTROLLER_STATES.INFO_OPEN
              ? "cluster"
              : "";

        if (!scope) {
          return;
        }

        if (scope === "orbit" && !orbitHit && event.target !== state.scene && event.target !== state.canvas) {
          return;
        }

        if (
          scope === "cluster" &&
          !clusterHit &&
          event.target !== state.scene &&
          event.target !== state.canvas
        ) {
          const orbitFallback = findOrbitHit(event.target);
          if (!orbitFallback) {
            return;
          }
        }

        const activeWing = normalizeWing(frame.activeClusterWing || frame.selectedCardinal);
        const startQuaternion =
          scope === "orbit"
            ? state.orbitQuaternion.slice()
            : (state.clusterQuaternionsByWing.get(activeWing) || [0, 0, 0, 1]).slice();

        startPointerCapture(event);

        state.pointer = {
          id: event.pointerId,
          scope,
          startX: event.clientX,
          startY: event.clientY,
          lastX: event.clientX,
          lastY: event.clientY,
          startTime: performance.now(),
          dragging: false,
          orbitHit,
          clusterHit,
          activeWing,
          startQuaternion,
          currentQuaternion: startQuaternion.slice(),
          samples: [{ x: event.clientX, y: event.clientY, time: performance.now() }]
        };
      },
      { passive: false }
    );

    state.scene.addEventListener(
      "pointermove",
      (event) => {
        const pointer = state.pointer;
        if (!pointer || event.pointerId !== pointer.id) {
          return;
        }

        const currentTime = performance.now();
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
        addPointerSample(pointer, event.clientX, event.clientY, currentTime);

        const distance = pointerDistance(pointer, event.clientX, event.clientY);

        if (!pointer.dragging && distance < GESTURE.dragDeadZonePx) {
          return;
        }

        if (!pointer.dragging) {
          pointer.dragging = true;
          state.scene.dataset.archcoinDragging = "true";
          state.root.dataset.archcoinDragging = "true";
        }

        event.preventDefault();

        pointer.currentQuaternion = dragQuaternionFromPointer(pointer, event.clientX, event.clientY);

        if (pointer.scope === "orbit") {
          state.orbitQuaternion = pointer.currentQuaternion.slice();
          state.orbitTargetQuaternion = pointer.currentQuaternion.slice();

          const previewWing = nearestOrbitWing(pointer.currentQuaternion);

          if (state.controller && typeof state.controller.requestOrbitPreview === "function") {
            state.controller.requestOrbitPreview({
              quaternion: pointer.currentQuaternion.slice(),
              primaryWing: previewWing
            });
          }

          emitReceipt({
            lastGestureType: "orbit-drag",
            lastGestureDistance: distance,
            lastGestureDurationMs: currentTime - pointer.startTime,
            lastAverageVelocityPxPerMs: 0,
            lastReleaseVelocityPxPerMs: 0
          });

          return;
        }

        if (!pointer.activeWing) {
          return;
        }

        state.clusterQuaternionsByWing.set(pointer.activeWing, pointer.currentQuaternion.slice());
        state.clusterTargetQuaternionsByWing.set(pointer.activeWing, pointer.currentQuaternion.slice());

        const previewPrimaryRoom = nearestPrimaryRoomId(pointer.activeWing, pointer.currentQuaternion);

        if (state.controller && typeof state.controller.requestClusterPreview === "function") {
          state.controller.requestClusterPreview(pointer.activeWing, {
            quaternion: pointer.currentQuaternion.slice(),
            primaryRoom: previewPrimaryRoom
          });
        }

        emitReceipt({
          lastGestureType: "cluster-drag",
          lastGestureDistance: distance,
          lastGestureDurationMs: currentTime - pointer.startTime,
          lastAverageVelocityPxPerMs: 0,
          lastReleaseVelocityPxPerMs: 0
        });
      },
      { passive: false }
    );

    state.scene.addEventListener(
      "pointerup",
      (event) => {
        const pointer = state.pointer;
        if (!pointer || event.pointerId !== pointer.id) {
          return;
        }

        const currentTime = performance.now();
        addPointerSample(pointer, event.clientX, event.clientY, currentTime);

        const metrics = gestureMetrics(pointer, event.clientX, event.clientY, currentTime);

        state.pointer = null;
        state.scene.dataset.archcoinDragging = "false";
        state.root.dataset.archcoinDragging = "false";

        releasePointerCapture(event);

        if (pointer.dragging && pointer.scope === "orbit") {
          const primaryWing = nearestOrbitWing(pointer.currentQuaternion);
          const settled = settledOrbitQuaternion(primaryWing, pointer.currentQuaternion);

          state.orbitTargetQuaternion = settled.slice();

          if (state.reducedMotion) {
            state.orbitQuaternion = settled.slice();
          }

          if (state.controller && typeof state.controller.requestOrbitCommit === "function") {
            state.controller.requestOrbitCommit({
              quaternion: settled.slice(),
              primaryWing
            });
          }

          state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;

          emitReceipt({
            lastGestureType: "orbit-settle",
            lastGestureDistance: metrics.distance,
            lastGestureDurationMs: metrics.durationMs,
            lastAverageVelocityPxPerMs: metrics.averageVelocity,
            lastReleaseVelocityPxPerMs: metrics.releaseVelocity
          });

          return;
        }

        if (pointer.dragging && pointer.scope === "cluster") {
          if (!pointer.activeWing) {
            return;
          }

          if (isQuickClusterFlick(metrics)) {
            if (
              state.controller &&
              typeof state.controller.requestReturnToConstellation === "function"
            ) {
              state.controller.requestReturnToConstellation({
                source: "runtime-cluster-flick"
              });
            }

            state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;

            emitReceipt({
              lastGestureType: "cluster-flick-return",
              lastGestureDistance: metrics.distance,
              lastGestureDurationMs: metrics.durationMs,
              lastAverageVelocityPxPerMs: metrics.averageVelocity,
              lastReleaseVelocityPxPerMs: metrics.releaseVelocity
            });

            return;
          }

          const primaryRoom = nearestPrimaryRoomId(pointer.activeWing, pointer.currentQuaternion);
          const settled = settledClusterQuaternion(
            primaryRoom,
            pointer.activeWing,
            pointer.currentQuaternion
          );

          state.clusterTargetQuaternionsByWing.set(pointer.activeWing, settled.slice());

          if (state.reducedMotion) {
            state.clusterQuaternionsByWing.set(pointer.activeWing, settled.slice());
          }

          if (state.controller && typeof state.controller.requestClusterCommit === "function") {
            state.controller.requestClusterCommit(pointer.activeWing, {
              quaternion: settled.slice(),
              primaryRoom
            });
          }

          state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;

          emitReceipt({
            lastGestureType: "cluster-settle",
            lastGestureDistance: metrics.distance,
            lastGestureDurationMs: metrics.durationMs,
            lastAverageVelocityPxPerMs: metrics.averageVelocity,
            lastReleaseVelocityPxPerMs: metrics.releaseVelocity
          });

          return;
        }

        if (metrics.distance <= GESTURE.maximumTapDistancePx) {
          const orbitHit = pointer.orbitHit || findOrbitHit(event.target);
          const clusterHit = pointer.clusterHit || findClusterHit(event.target);

          if (pointer.scope === "orbit" && orbitHit) {
            if (
              state.controller &&
              typeof state.controller.requestCoinSelection === "function"
            ) {
              state.controller.requestCoinSelection(orbitHit, "runtime-tap");
            }

            emitReceipt({
              lastGestureType: "orbit-tap",
              lastGestureDistance: metrics.distance,
              lastGestureDurationMs: metrics.durationMs,
              lastAverageVelocityPxPerMs: metrics.averageVelocity,
              lastReleaseVelocityPxPerMs: metrics.releaseVelocity
            });

            return;
          }

          if (pointer.scope === "cluster" && clusterHit) {
            if (
              state.controller &&
              typeof state.controller.requestRoomSelection === "function"
            ) {
              state.controller.requestRoomSelection(clusterHit, "runtime-tap");
            }

            emitReceipt({
              lastGestureType: "cluster-tap",
              lastGestureDistance: metrics.distance,
              lastGestureDurationMs: metrics.durationMs,
              lastAverageVelocityPxPerMs: metrics.averageVelocity,
              lastReleaseVelocityPxPerMs: metrics.releaseVelocity
            });

            return;
          }
        }

        emitReceipt({
          lastGestureType: "ambiguous-release",
          lastGestureDistance: metrics.distance,
          lastGestureDurationMs: metrics.durationMs,
          lastAverageVelocityPxPerMs: metrics.averageVelocity,
          lastReleaseVelocityPxPerMs: metrics.releaseVelocity
        });
      },
      { passive: false }
    );

    state.scene.addEventListener(
      "pointercancel",
      (event) => {
        const pointer = state.pointer;
        if (!pointer || event.pointerId !== pointer.id) {
          return;
        }

        state.pointer = null;
        state.scene.dataset.archcoinDragging = "false";
        state.root.dataset.archcoinDragging = "false";
        releasePointerCapture(event);

        emitReceipt({
          lastGestureType: "cancelled"
        });
      },
      { passive: false }
    );

    state.scene.addEventListener(
      "click",
      (event) => {
        if (performance.now() < state.suppressClickUntil) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
      },
      true
    );
  }

  function updateTargetsFromController(frame) {
    const committedOrbitWing = normalizeWing(frame.orbitFocus) || "north";
    const committedOrbitQuaternion =
      frame.orbitOrientation && frame.orbitOrientation.quaternion
        ? safeQuaternion(frame.orbitOrientation.quaternion, state.orbitQuaternion)
        : settledOrbitQuaternion(committedOrbitWing, state.orbitQuaternion);

    state.orbitTargetQuaternion = committedOrbitQuaternion.slice();

    WINGS.forEach((wing) => {
      const current = state.clusterQuaternionsByWing.get(wing) || [0, 0, 0, 1];
      let target = current.slice();

      if (
        frame.cluster &&
        normalizeWing(frame.cluster.wing) === wing &&
        frame.cluster.orientation &&
        frame.cluster.orientation.quaternion
      ) {
        target = safeQuaternion(frame.cluster.orientation.quaternion, current);
      }

      state.clusterTargetQuaternionsByWing.set(wing, target.slice());
    });
  }

  function updateMotion(frame, deltaTime) {
    readReducedMotion(frame);

    if (!state.pointer || state.pointer.scope !== "orbit") {
      if (state.reducedMotion) {
        state.orbitQuaternion = state.orbitTargetQuaternion.slice();
      } else {
        state.orbitQuaternion = quaternionSlerp(
          state.orbitQuaternion,
          state.orbitTargetQuaternion,
          Math.min(1, deltaTime * GESTURE.settleSpeed)
        );
      }
    }

    WINGS.forEach((wing) => {
      const current = state.clusterQuaternionsByWing.get(wing) || [0, 0, 0, 1];
      const target = state.clusterTargetQuaternionsByWing.get(wing) || [0, 0, 0, 1];

      if (state.pointer && state.pointer.scope === "cluster" && state.pointer.activeWing === wing) {
        return;
      }

      if (state.reducedMotion) {
        state.clusterQuaternionsByWing.set(wing, target.slice());
        return;
      }

      state.clusterQuaternionsByWing.set(
        wing,
        quaternionSlerp(current, target, Math.min(1, deltaTime * GESTURE.settleSpeed))
      );
    });
  }

  function render(nowValue) {
    if (!state.running) {
      return;
    }

    const seconds = nowValue * 0.001;
    const deltaTime = state.lastTime ? Math.min(0.05, seconds - state.lastTime) : 0.016;
    state.lastTime = seconds;
    state.time = seconds;

    const frame = getControllerFrame();

    updateTargetsFromController(frame);
    updateMotion(frame, deltaTime);

    placeOrbitButtons(frame);
    placeRuntimeRoomButtons(frame);
    drawField(frame, deltaTime);

    emitReceipt();

    state.raf = requestAnimationFrame(render);
  }

  function exposeApi() {
    globalThis.ARCHCOIN_CONSTELLATION_RUNTIME = Object.freeze({
      contract: CONTRACT,

      receipt: () =>
        Object.freeze({
          ...RECEIPT
        }),

      stop: () => {
        state.running = false;

        if (state.raf) {
          cancelAnimationFrame(state.raf);
          state.raf = 0;
        }

        emitReceipt({
          status: "stopped",
          lastGestureType: "runtime-stopped"
        });
      },

      start: () => {
        if (state.running) {
          return;
        }

        state.running = true;
        state.lastTime = 0;
        state.raf = requestAnimationFrame(render);

        emitReceipt({
          status: "available",
          lastGestureType: "runtime-started"
        });
      }
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
      throw new Error("ARCHCOIN_GEOMETRY_MOUNT_NOT_FOUND");
    }

    state.guidance = qs("[data-archcoin-guidance]", state.root);
    state.receiptOutput = qs("[data-archcoin-crystals-receipt]", state.root);

    state.controller = globalThis.DGB_ARCHCOIN_CONTROLLER || null;
    if (!state.controller) {
      throw new Error("DGB_ARCHCOIN_CONTROLLER_NOT_AVAILABLE");
    }

    state.canvas = createRuntimeCanvas();
    state.context = state.canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    if (!state.context) {
      throw new Error("ARCHCOIN_2D_CONTEXT_UNAVAILABLE");
    }

    state.runtimeRoomLayer = createRuntimeRoomLayer();
  }

  function init() {
    try {
      resolveDom();
      initializeMaps();
      ensureRuntimeRoomButtons();
      syncRuntimeStageBaseline();
      resize();
      bindPointerBridge();
      exposeApi();

      state.initialized = true;
      state.running = true;

      emitReceipt({
        status: "available",
        rendererInitialized: true,
        lastGestureType: "runtime-initialized"
      });

      globalThis.addEventListener(
        "resize",
        () => {
          resize();
        },
        { passive: true }
      );

      state.raf = requestAnimationFrame(render);
    } catch (error) {
      failHeld(
        `ARCHCOIN_RUNTIME_INIT_FAILURE:${
          error && error.message ? error.message : String(error)
        }`
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
