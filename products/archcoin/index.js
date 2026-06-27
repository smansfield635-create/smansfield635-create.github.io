/* ==========================================================================
   /products/archcoin/index.js

   ARCHCOIN
   TRANSACTION ORBIT RUNTIME
   PRODUCT-LOCAL MOTION + GEOMETRY ENHANCEMENT

   Contract:
   - Enhance the anchored ARCHCOIN HTML and controller.
   - Keep the page readable and functional without this runtime.
   - Treat the controller as state authority.
   - Render a 3D-like four-coin orbit and per-coin information clusters.
   - Distinguish tap, drag, controlled release, and cluster flick return.
   - Support reduced motion and fail-soft behavior.
   - No external dependency.
   - No generated image.
   - No GraphicBox.

   Owns:
   - specialized orbit presentation
   - transient gesture state
   - 2D canvas field rendering
   - 3D-like projection and motion
   - cluster overlay rendering
   - runtime receipts

   Does not own:
   - durable page state
   - legal transitions
   - section meaning
   - financial authority
   - remote data authority
========================================================================== */

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_TRANSACTION_ORBIT_RUNTIME_REBUILD_v1",
    previousId: "ARCHCOIN_TRANSACTION_ORBIT_CONTROLLER_REBUILD_v1",
    file: "/products/archcoin/index.js",
    releaseId: "archcoin-transaction-orbit-runtime-v1",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const STATES = Object.freeze({
    ORBIT: "ARCHCOIN_TRANSACTION_ORBIT",
    CLUSTER_OPEN: "FOUR_COIN_POSITION_SELECTED",
    NODE_SELECTED: "TRANSACTION_LAYER_DESCENDED",
    RETURNING: "RETURNING_TO_TRANSACTION_ORBIT",
    HELD: "HELD"
  });

  const COINS = Object.freeze(["contract", "receivable", "payable", "allocation"]);

  const CLUSTER_NODE_ORDER = Object.freeze([
    "engineering",
    "platform",
    "accountability",
    "guardrails"
  ]);

  const GESTURE = Object.freeze({
    dragDeadZonePx: 6,
    maximumTapDistancePx: 12,
    minimumDragDistancePx: 8,
    radiansPerViewport: Math.PI * 1.08,
    settleSpeed: 7.2,
    suppressClickMs: 520,
    sampleWindowMs: 140,
    maximumSamples: 16,
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
    orbitHorizontalRadius: 1.44,
    orbitVerticalRadius: 1.18,
    orbitDepthRadius: 1.04,
    clusterHorizontalRadius: 1.12,
    clusterVerticalRadius: 0.92,
    clusterDepthRadius: 0.86,
    orbitPrimaryAnchor: Object.freeze([0, 0.72, 0.69]),
    clusterPrimaryAnchor: Object.freeze([0, 0.66, 0.75]),
    orbitCardScale: 1,
    orbitFocusedScale: 1.22,
    clusterNodeScale: 0.82,
    clusterPrimaryScale: 1.08,
    idleProminence: 0.62,
    focusedProminence: 1,
    nodeProminence: 0.88,
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
      color: "rgba(243,200,111,1)"
    }),
    receivable: Object.freeze({
      label: "Receivable",
      color: "rgba(141,216,255,1)"
    }),
    payable: Object.freeze({
      label: "Payable",
      color: "rgba(255,179,154,1)"
    }),
    allocation: Object.freeze({
      label: "Allocation",
      color: "rgba(143,240,195,1)"
    })
  });

  const NODE_LABELS = Object.freeze({
    engineering: "Engineering",
    platform: "Platform",
    accountability: "Accountability",
    guardrails: "Guardrails"
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    previousContractId: CONTRACT.previousId,
    status: "pending",
    rendererInitialized: false,
    runtimeState: STATES.ORBIT,
    orbitFocus: "contract",
    selectedCoinPosition: "",
    selectedNodeId: "",
    activeClusterWing: "",
    lastGestureType: "",
    lastGestureDistance: 0,
    lastGestureDurationMs: 0,
    lastAverageVelocityPxPerMs: 0,
    lastReleaseVelocityPxPerMs: 0,
    reducedMotion: false,
    visualPassClaimed: false
  };

  const state = {
    root: null,
    orbitStage: null,
    geometryMount: null,
    receiptOutput: null,
    canvas: null,
    context: null,
    clusterLayer: null,
    clusterButtons: new Map(),

    width: 1,
    height: 1,
    pixelRatio: 1,

    time: 0,
    lastTime: 0,
    raf: 0,
    running: false,

    reducedMotion: false,
    controller: null,

    orbitButtons: new Map(),
    lifecycleNodes: [],
    fieldStars: [],

    orbitQuaternion: [0, 0, 0, 1],
    orbitTargetQuaternion: [0, 0, 0, 1],
    clusterQuaternions: new Map(),
    clusterTargetQuaternions: new Map(),
    clusterPrimaryNodeByCoin: new Map(),

    pointer: null,
    suppressClickUntil: 0,
    initialized: false
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
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

  function normalizeCoin(value) {
    const coin = String(value || "").trim().toLowerCase();
    return COINS.includes(coin) ? coin : "";
  }

  function controllerFrame() {
    const controller = state.controller;
    if (controller && typeof controller.getFrameState === "function") {
      return controller.getFrameState();
    }

    return Object.freeze({
      state: STATES.ORBIT,
      orbitFocus: "contract",
      selectedCoinPosition: "",
      selectedNodeId: "",
      panelDescended: false,
      lifecycleVisible: true
    });
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

  function clusterBaseVector(index, count) {
    const safeCount = Math.max(1, count);
    const longitude = (Math.PI * 2 * index) / safeCount - Math.PI / 2;
    const latitude = Math.sin((index + 0.5) * 1.73) * 0.44;
    const cosineLatitude = Math.cos(latitude);

    return normalizeVector([
      Math.cos(longitude) * cosineLatitude,
      Math.sin(latitude),
      Math.sin(longitude) * cosineLatitude
    ]);
  }

  function orbitAnchorVector() {
    return normalizeVector(QUALITY.orbitPrimaryAnchor);
  }

  function clusterAnchorVector() {
    return normalizeVector(QUALITY.clusterPrimaryAnchor);
  }

  function nearestOrbitFocus(quaternion) {
    const anchor = orbitAnchorVector();
    let bestCoin = "contract";
    let bestScore = -Infinity;

    COINS.forEach((coin) => {
      const base = COIN_BASE_VECTORS[coin];
      const rotated = normalizeVector(quaternionRotateVector(quaternion, base));
      const score = dot(rotated, anchor);

      if (score > bestScore) {
        bestScore = score;
        bestCoin = coin;
      }
    });

    return bestCoin;
  }

  function nearestClusterPrimary(coin, quaternion) {
    let bestId = "";
    let bestScore = -Infinity;
    const anchor = clusterAnchorVector();

    CLUSTER_NODE_ORDER.forEach((nodeType, index) => {
      const vector = clusterBaseVector(index, CLUSTER_NODE_ORDER.length);
      const rotated = normalizeVector(quaternionRotateVector(quaternion, vector));
      const score = dot(rotated, anchor);
      const nodeId = `${coin}-${nodeType}`;

      if (score > bestScore) {
        bestScore = score;
        bestId = nodeId;
      }
    });

    return bestId;
  }

  function settledOrbitQuaternion(coin, currentQuaternion) {
    const currentVector = normalizeVector(
      quaternionRotateVector(currentQuaternion, COIN_BASE_VECTORS[coin])
    );

    const alignment = quaternionFromUnitVectors(currentVector, orbitAnchorVector());

    return quaternionNormalize(quaternionMultiply(alignment, currentQuaternion));
  }

  function settledClusterQuaternion(nodeId, coin, currentQuaternion) {
    const nodeType = String(nodeId || "").split("-")[1] || "engineering";
    const index = Math.max(0, CLUSTER_NODE_ORDER.indexOf(nodeType));
    const currentVector = normalizeVector(
      quaternionRotateVector(currentQuaternion, clusterBaseVector(index, CLUSTER_NODE_ORDER.length))
    );

    const alignment = quaternionFromUnitVectors(currentVector, clusterAnchorVector());

    return quaternionNormalize(quaternionMultiply(alignment, currentQuaternion));
  }

  function resize() {
    const rect = state.orbitStage.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, QUALITY.maximumDevicePixelRatio);
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

  function buildFieldStars() {
    const cssWidth = state.width / state.pixelRatio;
    const cssHeight = state.height / state.pixelRatio;
    const count = Math.min(160, Math.max(72, Math.floor((cssWidth * cssHeight) / 14000)));

    state.fieldStars = Array.from({ length: count }, () => ({
      x: Math.random() * cssWidth,
      y: Math.random() * cssHeight,
      z: 0.22 + Math.random() * 0.78,
      size: 0.55 + Math.random() * 1.9,
      drift: (Math.random() - 0.5) * 0.08,
      pulse: Math.random() * Math.PI * 2
    }));
  }

  function ensureClusterButtons() {
    CLUSTER_NODE_ORDER.forEach((nodeType) => {
      const key = nodeType;
      if (state.clusterButtons.has(key)) {
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "orbit-point lifecycle-point";
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
      button.dataset.archcoinRuntimeClusterButton = "true";
      button.dataset.archcoinRuntimeNodeType = nodeType;
      button.innerHTML = `
        <span class="orbit-upright">
          <span class="orbit-gem-core">
            <svg class="arch-gem-svg" viewBox="0 0 220 160" aria-hidden="true" focusable="false">
              <use href="#archDigitalGem"></use>
            </svg>
            <span class="gem-label"><b>${NODE_LABELS[nodeType]}</b></span>
          </span>
        </span>
      `;

      state.clusterLayer.appendChild(button);
      state.clusterButtons.set(key, button);
    });
  }

  function applyRuntimeStageBaseline() {
    state.orbitStage.dataset.archcoinRuntime = "true";
    state.orbitStage.style.touchAction = "none";
    state.orbitStage.style.overscrollBehavior = "contain";

    state.canvas.style.position = "absolute";
    state.canvas.style.inset = "0";
    state.canvas.style.display = "block";
    state.canvas.style.pointerEvents = "none";
    state.canvas.style.zIndex = "1";

    state.clusterLayer.style.position = "absolute";
    state.clusterLayer.style.inset = "0";
    state.clusterLayer.style.pointerEvents = "none";
    state.clusterLayer.style.zIndex = "6";

    state.geometryMount.style.position = "absolute";
    state.geometryMount.style.inset = "0";
    state.geometryMount.style.pointerEvents = "none";
    state.geometryMount.style.zIndex = "2";

    state.orbitButtons.forEach((button) => {
      button.style.position = "absolute";
      button.style.left = "50%";
      button.style.top = "50%";
      button.style.animation = "none";
      button.style.pointerEvents = "auto";
      button.style.zIndex = "7";
    });

    state.lifecycleNodes.forEach((node) => {
      node.style.animation = "none";
      node.style.pointerEvents = "none";
      node.style.zIndex = "4";
    });
  }

  function projectOrbitCoin(coin, quaternion) {
    const unit = normalizeVector(quaternionRotateVector(quaternion, COIN_BASE_VECTORS[coin]));

    return {
      x: unit[0] * QUALITY.orbitHorizontalRadius,
      y: unit[1] * QUALITY.orbitVerticalRadius,
      z: unit[2] * QUALITY.orbitDepthRadius,
      depth: (unit[2] + 1) / 2,
      primary: clamp((dot(unit, orbitAnchorVector()) + 1) / 2, 0, 1)
    };
  }

  function projectClusterNode(nodeType, quaternion) {
    const index = Math.max(0, CLUSTER_NODE_ORDER.indexOf(nodeType));
    const unit = normalizeVector(
      quaternionRotateVector(quaternion, clusterBaseVector(index, CLUSTER_NODE_ORDER.length))
    );

    return {
      x: unit[0] * QUALITY.clusterHorizontalRadius,
      y: unit[1] * QUALITY.clusterVerticalRadius,
      z: unit[2] * QUALITY.clusterDepthRadius,
      depth: (unit[2] + 1) / 2,
      primary: clamp((dot(unit, clusterAnchorVector()) + 1) / 2, 0, 1)
    };
  }

  function orbitRect() {
    return state.orbitStage.getBoundingClientRect();
  }

  function stageCssSize() {
    const rect = orbitRect();
    return {
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height)
    };
  }

  function placeOrbitButtons(frame) {
    const size = stageCssSize();
    const centerX = size.width * 0.5;
    const centerY = size.height * 0.5;
    const selectedCoin = normalizeCoin(frame.selectedCoinPosition);

    COINS.forEach((coin) => {
      const button = state.orbitButtons.get(coin);
      if (!button) return;

      const projection = projectOrbitCoin(coin, state.orbitQuaternion);
      const focused = coin === frame.orbitFocus;
      const selected = coin === selectedCoin;

      const x = centerX + projection.x * size.width * 0.24;
      const y = centerY + projection.y * size.height * 0.22;
      const scale =
        (focused ? QUALITY.orbitFocusedScale : QUALITY.orbitCardScale) *
        (0.76 + projection.depth * 0.36) *
        (selected ? 1.05 : 1);
      const opacity = clamp(0.42 + projection.depth * 0.52 + (focused ? 0.12 : 0), 0.2, 1);

      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      button.style.transform = `translate(-50%, -50%) scale(${scale})`;
      button.style.opacity = String(opacity);
      button.style.filter = focused
        ? "brightness(1.12) saturate(1.08)"
        : `brightness(${0.86 + projection.depth * 0.24})`;

      button.dataset.archcoinRuntimeFocused = focused ? "true" : "false";
      button.dataset.archcoinRuntimeDepth = projection.depth.toFixed(4);
      button.style.zIndex = String(12 + Math.round(projection.depth * 40) + (focused ? 8 : 0));
    });
  }

  function placeLifecycleNodes(frame) {
    const size = stageCssSize();
    const centerX = size.width * 0.5;
    const centerY = size.height * 0.5;
    const visible = frame.lifecycleVisible !== false;

    state.lifecycleNodes.forEach((node, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(1, state.lifecycleNodes.length) - Math.PI / 2;
      const radiusX = size.width * 0.18;
      const radiusY = size.height * 0.16;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;

      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.transform = "translate(-50%, -50%) scale(1)";
      node.style.opacity = visible ? "" : "0.36";
      node.style.visibility = "visible";
      node.style.pointerEvents = "none";
    });
  }

  function placeClusterButtons(frame) {
    const activeCoin = normalizeCoin(frame.selectedCoinPosition);
    const clusterActive = frame.state === STATES.CLUSTER_OPEN || frame.state === STATES.NODE_SELECTED;
    const size = stageCssSize();
    const centerX = size.width * 0.5;
    const centerY = size.height * 0.5;
    const selectedNodeId = String(frame.selectedNodeId || "").trim();
    const quaternion = state.clusterQuaternions.get(activeCoin) || [0, 0, 0, 1];
    const primaryNodeId =
      state.clusterPrimaryNodeByCoin.get(activeCoin) ||
      nearestClusterPrimary(activeCoin || "contract", quaternion);

    state.clusterButtons.forEach((button, nodeType) => {
      const visible = clusterActive && !!activeCoin;
      const nodeId = `${activeCoin}-${nodeType}`;

      if (!visible) {
        button.hidden = true;
        button.setAttribute("aria-hidden", "true");
        button.style.pointerEvents = "none";
        return;
      }

      const projection = projectClusterNode(nodeType, quaternion);
      const x = centerX + projection.x * size.width * 0.18;
      const y = centerY + projection.y * size.height * 0.17;
      const primary = nodeId === primaryNodeId;
      const selected = nodeId === selectedNodeId;
      const scale =
        (primary ? QUALITY.clusterPrimaryScale : QUALITY.clusterNodeScale) *
        (0.76 + projection.depth * 0.34) *
        (selected ? 1.08 : 1);
      const opacity = clamp(
        0.38 + projection.depth * 0.48 + (primary ? 0.12 : 0) + (selected ? 0.08 : 0),
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
      button.style.zIndex = String(18 + Math.round(projection.depth * 40) + (primary ? 8 : 0));
      button.dataset.archcoinRuntimeCoin = activeCoin;
      button.dataset.archcoinRuntimeNodeId = nodeId;
      button.dataset.archcoinRuntimePrimary = primary ? "true" : "false";
      button.dataset.archcoinRuntimeSelected = selected ? "true" : "false";
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function drawField(frame, deltaTime) {
    const context = state.context;
    if (!context) return;

    const cssWidth = state.width / state.pixelRatio;
    const cssHeight = state.height / state.pixelRatio;

    context.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
    context.clearRect(0, 0, cssWidth, cssHeight);

    const clusterActive = frame.state === STATES.CLUSTER_OPEN || frame.state === STATES.NODE_SELECTED;
    const glowAlpha = clusterActive ? 0.075 : 0.052;
    const coreAlpha = clusterActive ? 0.048 : 0.032;

    state.fieldStars.forEach((star) => {
      star.pulse += deltaTime * (state.reducedMotion ? 0 : 0.8 + star.z * 0.9);
      star.y += state.reducedMotion ? 0 : star.drift * star.z * 0.6;

      if (star.y < -10) star.y = cssHeight + 10;
      if (star.y > cssHeight + 10) star.y = -10;

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

    radial.addColorStop(0, `rgba(127,255,212,${glowAlpha})`);
    radial.addColorStop(0.44, `rgba(126,203,255,${coreAlpha})`);
    radial.addColorStop(1, "rgba(0,0,0,0)");

    context.fillStyle = radial;
    context.fillRect(0, 0, cssWidth, cssHeight);

    context.save();
    context.translate(cssWidth * 0.5, cssHeight * 0.5);
    context.strokeStyle = `rgba(143,187,224,${clusterActive ? 0.16 : 0.10})`;
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

    const lastSample = pointer.samples.length ? pointer.samples[pointer.samples.length - 1] : null;
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
    const rect = orbitRect();
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
    const button = target && target.closest ? target.closest("[data-archcoin-coin-position]") : null;
    if (!button) return null;
    return normalizeCoin(button.dataset.archcoinCoinPosition);
  }

  function findClusterHit(target) {
    const button =
      target && target.closest ? target.closest("[data-archcoin-runtime-cluster-button]") : null;
    if (!button) return null;

    const coin = normalizeCoin(button.dataset.archcoinRuntimeCoin);
    const nodeId = String(button.dataset.archcoinRuntimeNodeId || "").trim();

    if (!coin || !nodeId) return null;

    return { coin, nodeId };
  }

  function bindPointerBridge() {
    state.orbitStage.addEventListener(
      "pointerdown",
      (event) => {
        if (performance.now() < state.suppressClickUntil) {
          event.preventDefault();
          return;
        }

        const frame = controllerFrame();
        const orbitHit = findOrbitHit(event.target);
        const clusterHit = findClusterHit(event.target);
        const scope =
          frame.state === STATES.ORBIT
            ? "orbit"
            : frame.state === STATES.CLUSTER_OPEN || frame.state === STATES.NODE_SELECTED
              ? "cluster"
              : "";

        if (!scope) return;

        if (scope === "orbit" && !orbitHit && event.target !== state.orbitStage && event.target !== state.canvas) {
          return;
        }

        if (
          scope === "cluster" &&
          !clusterHit &&
          event.target !== state.orbitStage &&
          event.target !== state.canvas
        ) {
          const orbitButton = findOrbitHit(event.target);
          if (!orbitButton) return;
        }

        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch (_) {}

        const activeCoin = normalizeCoin(frame.selectedCoinPosition) || normalizeCoin(frame.orbitFocus) || "contract";
        const startQuaternion =
          scope === "orbit"
            ? state.orbitQuaternion.slice()
            : (state.clusterQuaternions.get(activeCoin) || [0, 0, 0, 1]).slice();

        state.pointer = {
          id: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          startTime: performance.now(),
          lastX: event.clientX,
          lastY: event.clientY,
          scope,
          orbitHit,
          clusterHit,
          activeCoin,
          dragging: false,
          startQuaternion,
          currentQuaternion: startQuaternion.slice(),
          samples: [{ x: event.clientX, y: event.clientY, time: performance.now() }]
        };
      },
      { passive: false }
    );

    state.orbitStage.addEventListener(
      "pointermove",
      (event) => {
        const pointer = state.pointer;
        if (!pointer || event.pointerId !== pointer.id) return;

        const now = performance.now();
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
        addPointerSample(pointer, event.clientX, event.clientY, now);

        const distance = pointerDistance(pointer, event.clientX, event.clientY);

        if (!pointer.dragging && distance < GESTURE.dragDeadZonePx) {
          return;
        }

        if (!pointer.dragging) {
          pointer.dragging = true;
          state.orbitStage.dataset.archcoinDragging = "true";
        }

        event.preventDefault();

        pointer.currentQuaternion = dragQuaternionFromPointer(pointer, event.clientX, event.clientY);

        if (pointer.scope === "orbit") {
          state.orbitQuaternion = pointer.currentQuaternion.slice();
          state.orbitTargetQuaternion = pointer.currentQuaternion.slice();

          const primaryCoin = nearestOrbitFocus(pointer.currentQuaternion);
          if (state.controller && typeof state.controller.requestCoinFocus === "function") {
            state.controller.requestCoinFocus(primaryCoin);
          }

          emitReceipt({
            lastGestureType: "orbit-drag",
            lastGestureDistance: distance,
            lastGestureDurationMs: now - pointer.startTime,
            lastAverageVelocityPxPerMs: 0,
            lastReleaseVelocityPxPerMs: 0,
            lastFailure: null
          });

          return;
        }

        state.clusterQuaternions.set(pointer.activeCoin, pointer.currentQuaternion.slice());
        state.clusterTargetQuaternions.set(pointer.activeCoin, pointer.currentQuaternion.slice());

        const primaryNode = nearestClusterPrimary(pointer.activeCoin, pointer.currentQuaternion);
        state.clusterPrimaryNodeByCoin.set(pointer.activeCoin, primaryNode);

        emitReceipt({
          lastGestureType: "cluster-drag",
          lastGestureDistance: distance,
          lastGestureDurationMs: now - pointer.startTime,
          lastAverageVelocityPxPerMs: 0,
          lastReleaseVelocityPxPerMs: 0,
          lastFailure: null
        });
      },
      { passive: false }
    );

    state.orbitStage.addEventListener(
      "pointerup",
      (event) => {
        const pointer = state.pointer;
        if (!pointer || event.pointerId !== pointer.id) return;

        const now = performance.now();
        addPointerSample(pointer, event.clientX, event.clientY, now);

        const metrics = gestureMetrics(pointer, event.clientX, event.clientY, now);
        state.pointer = null;
        state.orbitStage.dataset.archcoinDragging = "false";

        try {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        } catch (_) {}

        if (pointer.dragging && pointer.scope === "orbit") {
          const primaryCoin = nearestOrbitFocus(pointer.currentQuaternion);
          const settled = settledOrbitQuaternion(primaryCoin, pointer.currentQuaternion);
          state.orbitTargetQuaternion = settled.slice();

          if (state.reducedMotion) {
            state.orbitQuaternion = settled.slice();
          }

          if (state.controller && typeof state.controller.requestCoinFocus === "function") {
            state.controller.requestCoinFocus(primaryCoin);
          }

          state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;

          emitReceipt({
            lastGestureType: "orbit-settle",
            lastGestureDistance: metrics.distance,
            lastGestureDurationMs: metrics.durationMs,
            lastAverageVelocityPxPerMs: metrics.averageVelocity,
            lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
            lastFailure: null
          });

          return;
        }

        if (pointer.dragging && pointer.scope === "cluster") {
          if (isQuickClusterFlick(metrics)) {
            if (state.controller && typeof state.controller.requestReturnToOrbit === "function") {
              state.controller.requestReturnToOrbit({ scrollToOrbit: false });
            }

            state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;

            emitReceipt({
              lastGestureType: "cluster-flick-return",
              lastGestureDistance: metrics.distance,
              lastGestureDurationMs: metrics.durationMs,
              lastAverageVelocityPxPerMs: metrics.averageVelocity,
              lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
              lastFailure: null
            });

            return;
          }

          const primaryNode = nearestClusterPrimary(pointer.activeCoin, pointer.currentQuaternion);
          const settled = settledClusterQuaternion(primaryNode, pointer.activeCoin, pointer.currentQuaternion);

          state.clusterTargetQuaternions.set(pointer.activeCoin, settled.slice());
          if (state.reducedMotion) {
            state.clusterQuaternions.set(pointer.activeCoin, settled.slice());
          }

          state.clusterPrimaryNodeByCoin.set(pointer.activeCoin, primaryNode);
          state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;

          emitReceipt({
            lastGestureType: "cluster-settle",
            lastGestureDistance: metrics.distance,
            lastGestureDurationMs: metrics.durationMs,
            lastAverageVelocityPxPerMs: metrics.averageVelocity,
            lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
            lastFailure: null
          });

          return;
        }

        if (metrics.distance <= GESTURE.maximumTapDistancePx) {
          const orbitHit = pointer.orbitHit || findOrbitHit(event.target);
          const clusterHit = pointer.clusterHit || findClusterHit(event.target);

          if (pointer.scope === "orbit" && orbitHit) {
            if (state.controller && typeof state.controller.requestCoinSelection === "function") {
              state.controller.requestCoinSelection(orbitHit, { scrollToPanel: true });
            }

            emitReceipt({
              lastGestureType: "orbit-tap",
              lastGestureDistance: metrics.distance,
              lastGestureDurationMs: metrics.durationMs,
              lastAverageVelocityPxPerMs: metrics.averageVelocity,
              lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
              lastFailure: null
            });

            return;
          }

          if (pointer.scope === "cluster" && clusterHit) {
            if (state.controller && typeof state.controller.requestNodeSelection === "function") {
              state.controller.requestNodeSelection(clusterHit.coin, clusterHit.nodeId, {
                scrollToSection: true
              });
            }

            emitReceipt({
              lastGestureType: "cluster-tap",
              lastGestureDistance: metrics.distance,
              lastGestureDurationMs: metrics.durationMs,
              lastAverageVelocityPxPerMs: metrics.averageVelocity,
              lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
              lastFailure: null
            });

            return;
          }
        }

        emitReceipt({
          lastGestureType: "ambiguous-release",
          lastGestureDistance: metrics.distance,
          lastGestureDurationMs: metrics.durationMs,
          lastAverageVelocityPxPerMs: metrics.averageVelocity,
          lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
          lastFailure: null
        });
      },
      { passive: false }
    );

    state.orbitStage.addEventListener(
      "pointercancel",
      (event) => {
        const pointer = state.pointer;
        if (!pointer || event.pointerId !== pointer.id) return;

        state.pointer = null;
        state.orbitStage.dataset.archcoinDragging = "false";

        emitReceipt({
          lastGestureType: "cancelled",
          lastFailure: null
        });
      },
      { passive: false }
    );

    state.orbitStage.addEventListener(
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
    const committedOrbit = normalizeCoin(frame.orbitFocus) || "contract";
    const canonicalOrbit = settledOrbitQuaternion(committedOrbit, state.orbitQuaternion);
    state.orbitTargetQuaternion = canonicalOrbit;

    if (!state.clusterQuaternions.has(committedOrbit)) {
      state.clusterQuaternions.set(committedOrbit, [0, 0, 0, 1]);
      state.clusterTargetQuaternions.set(committedOrbit, [0, 0, 0, 1]);
    }

    const activeCoin = normalizeCoin(frame.selectedCoinPosition);
    if (activeCoin) {
      const currentCluster = state.clusterQuaternions.get(activeCoin) || [0, 0, 0, 1];
      const primaryNode = nearestClusterPrimary(activeCoin, currentCluster);
      state.clusterPrimaryNodeByCoin.set(activeCoin, primaryNode);

      const settledCluster = settledClusterQuaternion(primaryNode, activeCoin, currentCluster);
      state.clusterTargetQuaternions.set(activeCoin, settledCluster);
    }
  }

  function updateMotion(frame, deltaTime) {
    state.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    COINS.forEach((coin) => {
      const current = state.clusterQuaternions.get(coin) || [0, 0, 0, 1];
      const target = state.clusterTargetQuaternions.get(coin) || [0, 0, 0, 1];

      if (state.pointer && state.pointer.scope === "cluster" && state.pointer.activeCoin === coin) {
        return;
      }

      if (state.reducedMotion) {
        state.clusterQuaternions.set(coin, target.slice());
        return;
      }

      state.clusterQuaternions.set(
        coin,
        quaternionSlerp(current, target, Math.min(1, deltaTime * GESTURE.settleSpeed))
      );
    });

    state.root.dataset.archcoinRuntimeState = frame.state;
    state.root.dataset.archcoinRuntimeOrbitFocus = frame.orbitFocus || "contract";
    state.root.dataset.archcoinRuntimeSelectedCoinPosition = frame.selectedCoinPosition || "";
    state.root.dataset.archcoinRuntimeSelectedNodeId = frame.selectedNodeId || "";
  }

  function emitReceipt(extra = {}) {
    const frame = controllerFrame();

    Object.assign(
      RECEIPT,
      {
        status: frame.state === STATES.HELD ? "held" : "available",
        rendererInitialized: state.initialized,
        runtimeState: frame.state,
        orbitFocus: frame.orbitFocus || "contract",
        selectedCoinPosition: frame.selectedCoinPosition || "",
        selectedNodeId: frame.selectedNodeId || "",
        activeClusterWing: frame.selectedCoinPosition || "",
        reducedMotion: state.reducedMotion,
        visualPassClaimed: false
      },
      extra
    );

    const serialized = JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.archcoinRuntimeReceipt = serialized;
      state.root.dataset.archcoinRuntimeStatus = RECEIPT.status;
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value = serialized;
      state.receiptOutput.textContent = serialized;
      state.receiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis.ARCHCOIN_ORBIT_RUNTIME_RECEIPT = Object.freeze({
      ...RECEIPT
    });
  }

  function render(now) {
    if (!state.running) return;

    const seconds = now * 0.001;
    const deltaTime = state.lastTime ? Math.min(0.05, seconds - state.lastTime) : 0.016;
    state.lastTime = seconds;
    state.time = seconds;

    const frame = controllerFrame();

    updateTargetsFromController(frame);
    updateMotion(frame, deltaTime);
    placeOrbitButtons(frame);
    placeLifecycleNodes(frame);
    placeClusterButtons(frame);
    drawField(frame, deltaTime);

    emitReceipt({
      lastFailure: null
    });

    state.raf = requestAnimationFrame(render);
  }

  function exposeApi() {
    globalThis.ARCHCOIN_ORBIT_RUNTIME = Object.freeze({
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
        if (state.running) return;
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
    state.root = qs("[data-archcoin-product='true']");
    if (!state.root) {
      throw new Error("ARCHCOIN_ROOT_NOT_FOUND");
    }

    state.orbitStage = qs("#archcoin-orbit-stage", state.root);
    if (!state.orbitStage) {
      throw new Error("ARCHCOIN_ORBIT_STAGE_NOT_FOUND");
    }

    state.geometryMount = qs("#archcoin-geometry-mount", state.root);
    if (!state.geometryMount) {
      throw new Error("ARCHCOIN_GEOMETRY_MOUNT_NOT_FOUND");
    }

    state.receiptOutput = qs("#archcoin-receipt-output", state.root);
    if (!state.receiptOutput) {
      throw new Error("ARCHCOIN_RECEIPT_OUTPUT_NOT_FOUND");
    }

    state.controller = globalThis.ARCHCOIN_ORBIT_CONTROLLER || null;
    if (!state.controller) {
      throw new Error("ARCHCOIN_CONTROLLER_NOT_AVAILABLE");
    }

    state.canvas = document.createElement("canvas");
    state.canvas.dataset.archcoinRuntimeCanvas = "true";
    state.canvas.setAttribute("aria-hidden", "true");
    state.geometryMount.appendChild(state.canvas);

    state.context = state.canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    if (!state.context) {
      throw new Error("ARCHCOIN_2D_CONTEXT_UNAVAILABLE");
    }

    state.clusterLayer = document.createElement("div");
    state.clusterLayer.dataset.archcoinRuntimeClusterLayer = "true";
    state.geometryMount.appendChild(state.clusterLayer);

    qsa("[data-archcoin-coin-position]", state.root).forEach((button) => {
      const coin = normalizeCoin(button.dataset.archcoinCoinPosition);
      if (!coin) return;
      state.orbitButtons.set(coin, button);
    });

    if (state.orbitButtons.size !== 4) {
      throw new Error(`ARCHCOIN_ORBIT_BUTTON_COUNT_INVALID:${state.orbitButtons.size}`);
    }

    state.lifecycleNodes = qsa("[data-archcoin-value-lifecycle-node]", state.root);
    ensureClusterButtons();
    applyRuntimeStageBaseline();

    COINS.forEach((coin) => {
      state.clusterQuaternions.set(coin, [0, 0, 0, 1]);
      state.clusterTargetQuaternions.set(coin, [0, 0, 0, 1]);
      state.clusterPrimaryNodeByCoin.set(coin, `${coin}-engineering`);
    });
  }

  function init() {
    try {
      resolveDom();
      resize();
      bindPointerBridge();
      exposeApi();

      state.initialized = true;
      state.running = true;

      emitReceipt({
        status: "available",
        rendererInitialized: true,
        lastGestureType: "runtime-initialized",
        lastFailure: null
      });

      window.addEventListener(
        "resize",
        () => {
          resize();
        },
        { passive: true }
      );

      state.raf = requestAnimationFrame(render);
    } catch (error) {
      state.running = false;
      emitReceipt({
        status: "held",
        rendererInitialized: false,
        lastGestureType: "runtime-init-failed",
        lastFailure: error && error.message ? error.message : String(error)
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
