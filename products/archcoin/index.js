/* ==========================================================================
   /products/archcoin/index.js
   ARCHCOIN · TRANSACTION TEMPLATE AND BOND LAYER RUNTIME · v2.1

   PURPOSE:
   - Renew the ARCHCOIN runtime against the corrected four-coin primary model.
   - Preserve visible-first behavior if runtime is delayed or unavailable.
   - Keep the four-coin transaction orbit primary.
   - Keep the five-node value lifecycle secondary.
   - Keep adapter-aware participation explanatory only.
   - Keep same-origin manifest hydration guarded and dormant-safe.
   - Keep receipts bounded.
   - Provide a stronger geometric transaction orbit with controlled drag,
     settlement, focus, selection, and return-to-transaction-orbit behavior.
   - No external dependency.
   - No heavy framework.
   - No financial execution.
========================================================================== */

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_TRANSACTION_TEMPLATE_AND_BOND_LAYER_REBUILD_v2",
    previousId: "ARCHCOIN_PRODUCT_GRANDCHILD_VALUE_ORBIT_ANIMATION_TNT_v4",
    file: "/products/archcoin/index.js",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const STATES = Object.freeze({
    TRANSACTION_ORBIT: "ARCHCOIN_TRANSACTION_ORBIT",
    FOUR_COIN_POSITION_FOCUSED: "FOUR_COIN_POSITION_FOCUSED",
    FOUR_COIN_POSITION_SELECTED: "FOUR_COIN_POSITION_SELECTED",
    TRANSACTION_LAYER_DESCENDED: "TRANSACTION_LAYER_DESCENDED",
    VALUE_LIFECYCLE_VISIBLE: "VALUE_LIFECYCLE_VISIBLE",
    RETURNING_TO_TRANSACTION_ORBIT: "RETURNING_TO_TRANSACTION_ORBIT",
    HELD: "HELD"
  });

  const COIN_POSITIONS = Object.freeze([
    "contract",
    "receivable",
    "payable",
    "allocation"
  ]);

  const LIFECYCLE_NODES = Object.freeze([
    "contribute",
    "trace",
    "record",
    "allocate",
    "trust"
  ]);

  const MANIFEST_SCHEMA = Object.freeze({
    version: "ARCHCOIN_MANIFEST_SCHEMA_DEFERRED",
    frozen: false,
    allowedKeys: Object.freeze([])
  });

  const ORBIT = Object.freeze({
    primaryAnchorDegrees: -90,
    settleSpeed: 8.2,
    dragRadiansPerViewport: Math.PI * 1.18,
    focusScaleFront: 1.16,
    selectedScaleFront: 1.22,
    ordinaryScaleBase: 0.78,
    ordinaryScaleDepthLift: 0.34,
    innerScaleBase: 0.76,
    innerScaleDepthLift: 0.22,
    primaryRadiusFactor: 0.40,
    secondaryRadiusFactor: 0.25,
    primaryDepthAmplitude: 0.22,
    secondaryDepthAmplitude: 0.13,
    suppressClickMs: 520,
    dragDeadZonePx: 7,
    maximumTapDistancePx: 12,
    sampleWindowMs: 140,
    maximumSamples: 18,
    flickMaximumDurationMs: 260,
    flickMinimumDistancePx: 48,
    flickMinimumAverageVelocityPxPerMs: 0.55,
    flickMinimumReleaseVelocityPxPerMs: 0.72,
    flickMinimumDirectionalRatio: 1.22,
    flickMaximumPauseBeforeReleaseMs: 96,
    flickMaximumPathEfficiencyLoss: 0.24
  });

  const POSITION_CONTENT = Object.freeze({
    contract: Object.freeze({
      title: "Contract Authority",
      subtitle: "Authority binds movement",
      copy:
        "The contract position names the agreement, permission, signature, term, or governing frame that authorizes value movement. ARCHCOIN begins by making authority explicit before movement is amplified.",
      receipt: Object.freeze([
        ["Primary model", "Four-coin transaction template"],
        ["Coin position", "Contract"],
        ["Transaction role", "Authority / binding frame"],
        ["Selection read", "Movement begins under an authorized contract"]
      ])
    }),

    receivable: Object.freeze({
      title: "Inbound Value / Receivable",
      subtitle: "Inbound value arrives",
      copy:
        "The receivable position names what entered, from where it arrived, which counterparty supplied it, and what purpose the inbound value is supposed to serve.",
      receipt: Object.freeze([
        ["Primary model", "Four-coin transaction template"],
        ["Coin position", "Receivable"],
        ["Transaction role", "Inbound value / accounts receivable"],
        ["Selection read", "Arrival makes value visible"]
      ])
    }),

    payable: Object.freeze({
      title: "Outbound Obligation / Payable",
      subtitle: "Obligation must settle",
      copy:
        "The payable position names responsibility, duty, pressure owed, settlement logic, and outgoing obligation. ARCHCOIN keeps obligation visible instead of letting it disappear behind vague motion.",
      receipt: Object.freeze([
        ["Primary model", "Four-coin transaction template"],
        ["Coin position", "Payable"],
        ["Transaction role", "Outbound obligation / accounts payable"],
        ["Selection read", "Responsibility remains bound to movement"]
      ])
    }),

    allocation: Object.freeze({
      title: "Allocation / Growth",
      subtitle: "Growth stays governed",
      copy:
        "The allocation position names distribution, reinvestment, growth pressure, expansion routing, and governed allocation inside the bond frame rather than outside it.",
      receipt: Object.freeze([
        ["Primary model", "Four-coin transaction template"],
        ["Coin position", "Allocation"],
        ["Transaction role", "Allocation / growth / distribution"],
        ["Selection read", "Expansion remains inside the bond frame"]
      ])
    })
  });

  const LIFECYCLE_CONTENT = Object.freeze({
    contribute: Object.freeze({
      title: "Contribute",
      copy:
        "A contribution enters the transaction field as money, work, time, support, assets, attention, or another defined input. This explains entry into the transaction, not the total architecture.",
      receipt: Object.freeze([
        ["Secondary model", "Five-node value lifecycle"],
        ["Lifecycle node", "Contribute"],
        ["Hierarchy", "Secondary explanatory layer"],
        ["Read", "Contribution enters the four-coin transaction frame"]
      ])
    }),

    trace: Object.freeze({
      title: "Trace",
      copy:
        "The source, route, and purpose of value are clarified before amplification claims dominate interpretation.",
      receipt: Object.freeze([
        ["Secondary model", "Five-node value lifecycle"],
        ["Lifecycle node", "Trace"],
        ["Hierarchy", "Secondary explanatory layer"],
        ["Read", "Traceability explains movement inside the four-coin model"]
      ])
    }),

    record: Object.freeze({
      title: "Record",
      copy:
        "The event becomes accountable through receipt logic, ledger logic, bond logic, or another readable transaction record.",
      receipt: Object.freeze([
        ["Secondary model", "Five-node value lifecycle"],
        ["Lifecycle node", "Record"],
        ["Hierarchy", "Secondary explanatory layer"],
        ["Read", "Recording preserves accountability"]
      ])
    }),

    allocate: Object.freeze({
      title: "Allocate",
      copy:
        "Distribution follows rules rather than impulse. Allocation remains visible because it is already a primary position in the four-coin transaction architecture.",
      receipt: Object.freeze([
        ["Secondary model", "Five-node value lifecycle"],
        ["Lifecycle node", "Allocate"],
        ["Hierarchy", "Secondary explanatory layer"],
        ["Read", "Lifecycle allocation supports the primary allocation position"]
      ])
    }),

    trust: Object.freeze({
      title: "Trust",
      copy:
        "Trust grows when authority, inflow, obligation, and allocation can be checked instead of merely asserted.",
      receipt: Object.freeze([
        ["Secondary model", "Five-node value lifecycle"],
        ["Lifecycle node", "Trust"],
        ["Hierarchy", "Secondary explanatory layer"],
        ["Read", "Trust is an effect of visible transaction discipline"]
      ])
    })
  });

  const ADAPTER_CONTENT = Object.freeze({
    referenced: Object.freeze({
      title: "Referenced asset participation",
      copy:
        "An external asset may be referenced inside the transaction frame without claiming custody, execution, or protocol merger.",
      receipt: Object.freeze([
        ["Adapter mode", "Referenced"],
        ["Execution claim", "False"],
        ["Custody claim", "False"],
        ["Read", "ARCHCOIN may classify the asset inside the transaction model"]
      ])
    }),

    wrapped: Object.freeze({
      title: "Wrapped asset participation",
      copy:
        "A wrapped participation mode still requires explicit implementation, custody assumptions, settlement logic, and operational evidence outside this page.",
      receipt: Object.freeze([
        ["Adapter mode", "Wrapped"],
        ["Execution claim", "False"],
        ["Automatic validity", "False"],
        ["Read", "Wrapping requires explicit implementation"]
      ])
    }),

    routed: Object.freeze({
      title: "Routed asset participation",
      copy:
        "An asset may be assigned a transaction role such as contract, receivable, payable, or allocation without claiming the underlying chain has been unified automatically.",
      receipt: Object.freeze([
        ["Adapter mode", "Routed"],
        ["Execution claim", "False"],
        ["Automatic chain merger", "False"],
        ["Read", "Routing assigns transaction role, not automatic protocol unity"]
      ])
    }),

    accounted: Object.freeze({
      title: "Accounted-for asset participation",
      copy:
        "ARCHCOIN may account for heterogeneous value inside one readable bond representation while leaving security, custody, exchange, and finality claims outside mere declaration.",
      receipt: Object.freeze([
        ["Adapter mode", "Accounted For"],
        ["Execution claim", "False"],
        ["Automatic custody", "False"],
        ["Read", "Accounting binds representation, not automatic execution"]
      ])
    })
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    previousContractId: CONTRACT.previousId,
    status: "pending",
    state: STATES.TRANSACTION_ORBIT,
    orbitFocus: "contract",
    primaryCoinPosition: "contract",
    selectedCoinPosition: "",
    selectedLifecycleNode: "",
    selectedAdapterSlot: "",
    transactionLayerDescended: false,
    lifecycleVisible: true,
    manifestHydrationEnabled: false,
    manifestHydrationAttempted: false,
    manifestHydrationSucceeded: false,
    manifestSchemaBound: false,
    lastAction: "",
    lastFailure: null,
    visualPassClaimed: false
  };

  const state = {
    root: null,
    orbitStage: null,
    geometryMount: null,
    receiptOutput: null,
    transactionOrbit: null,
    lifecycleOrbit: null,
    centerGem: null,
    transactionPoints: [],
    lifecycleNodes: [],
    adapterSlots: [],
    manifestObservationNodes: [],
    focusedCoinPosition: "contract",
    primaryCoinPosition: "contract",
    selectedCoinPosition: "",
    selectedLifecycleNode: "",
    selectedAdapterSlot: "",
    currentState: STATES.TRANSACTION_ORBIT,
    transactionLayerDescended: false,
    lifecycleVisible: true,
    manifestSchemaBound: false,
    manifestHydrationEnabled: false,
    manifestHydrationAttempted: false,
    manifestHydrationSucceeded: false,
    manifestData: null,
    reducedMotion: false,
    orbit: {
      angle: 0,
      targetAngle: 0,
      innerAngle: 0,
      targetInnerAngle: 0,
      frame: 0,
      running: false,
      pointer: null,
      suppressClickUntil: 0
    },
    field: {
      canvas: null,
      context: null,
      stars: [],
      width: 0,
      height: 0,
      pixelRatio: 1,
      pointerX: 0.5,
      pointerY: 0.5,
      running: false,
      frame: 0
    }
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

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function wrapRadians(value) {
    let angle = finiteNumber(value, 0);
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }

  function normalizeCoinPosition(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return COIN_POSITIONS.includes(normalized) ? normalized : "";
  }

  function normalizeLifecycleNode(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return LIFECYCLE_NODES.includes(normalized) ? normalized : "";
  }

  function setState(nextState, action) {
    if (!Object.values(STATES).includes(nextState)) {
      emitArchcoinReceipt({
        status: "held",
        lastAction: action || "invalid-state",
        lastFailure: `INVALID_STATE:${String(nextState)}`
      });
      state.currentState = STATES.HELD;
      return false;
    }

    state.currentState = nextState;
    emitArchcoinReceipt({
      state: state.currentState,
      lastAction: action || `state:${nextState}`,
      lastFailure: null
    });
    return true;
  }

  function anchorAngleRadians() {
    return (ORBIT.primaryAnchorDegrees * Math.PI) / 180;
  }

  function baseAngleForIndex(index, count) {
    return anchorAngleRadians() + (Math.PI * 2 * index) / Math.max(1, count);
  }

  function baseAngleForCoinPosition(position) {
    const index = COIN_POSITIONS.indexOf(position);
    return baseAngleForIndex(Math.max(index, 0), COIN_POSITIONS.length);
  }

  function nearestCoinPositionForOrbitAngle(angle) {
    let best = COIN_POSITIONS[0];
    let bestDistance = Infinity;

    COIN_POSITIONS.forEach((position, index) => {
      const effective = wrapRadians(baseAngleForIndex(index, COIN_POSITIONS.length) + angle);
      const distance = Math.abs(wrapRadians(effective - anchorAngleRadians()));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = position;
      }
    });

    return best;
  }

  function settledAngleForCoinPosition(position) {
    return wrapRadians(anchorAngleRadians() - baseAngleForCoinPosition(position));
  }

  function makeRow(key, value) {
    const row = document.createElement("div");
    row.className = "receiptRow";
    row.style.display = "grid";
    row.style.gridTemplateColumns = "minmax(0,1fr) auto";
    row.style.gap = ".65rem";

    const k = document.createElement("span");
    k.className = "receiptKey";
    k.style.color = "rgba(230,238,255,.68)";
    k.style.fontSize = ".78rem";
    k.style.fontWeight = "800";
    k.style.letterSpacing = ".05em";
    k.style.textTransform = "uppercase";
    k.textContent = key;

    const v = document.createElement("strong");
    v.className = "receiptValue";
    v.style.color = "rgba(255,244,216,.96)";
    v.style.fontSize = ".82rem";
    v.style.textAlign = "right";
    v.style.lineHeight = "1.2";
    v.textContent = value;

    row.append(k, v);
    return row;
  }

  function getOrCreateTalkSurface() {
    if (!state.orbitStage) return null;

    let surface = qs("[data-archcoin-talk-surface]", state.orbitStage);
    if (surface) return surface;

    surface = document.createElement("div");
    surface.dataset.archcoinTalkSurface = "true";
    surface.style.position = "absolute";
    surface.style.left = "50%";
    surface.style.bottom = "1rem";
    surface.style.transform = "translateX(-50%)";
    surface.style.zIndex = "8";
    surface.style.width = "min(92%, 34rem)";
    surface.style.display = "grid";
    surface.style.gap = ".45rem";
    surface.style.padding = ".95rem 1rem";
    surface.style.border = "1px solid rgba(255,255,255,.12)";
    surface.style.borderRadius = "1rem";
    surface.style.background = "rgba(7,11,23,.78)";
    surface.style.backdropFilter = "blur(8px)";
    surface.style.boxShadow = "0 1rem 2.6rem rgba(0,0,0,.34)";

    const title = document.createElement("strong");
    title.id = "archcoin-talk-title";
    title.style.color = "rgba(255,244,216,.98)";
    title.style.fontSize = "1rem";
    title.style.lineHeight = "1.15";

    const copy = document.createElement("p");
    copy.id = "archcoin-talk-copy";
    copy.style.margin = "0";
    copy.style.color = "rgba(230,238,255,.82)";
    copy.style.fontSize = ".92rem";
    copy.style.lineHeight = "1.42";

    const rows = document.createElement("div");
    rows.id = "archcoin-talk-receipt";
    rows.style.display = "grid";
    rows.style.gap = ".3rem";

    surface.append(title, copy, rows);
    state.orbitStage.appendChild(surface);
    return surface;
  }

  function setTalk(title, copy, receiptItems) {
    const surface = getOrCreateTalkSurface();
    if (!surface) return;

    const titleNode = qs("#archcoin-talk-title", surface);
    const copyNode = qs("#archcoin-talk-copy", surface);
    const receiptNode = qs("#archcoin-talk-receipt", surface);

    if (titleNode) titleNode.textContent = title;
    if (copyNode) copyNode.textContent = copy;

    if (receiptNode) {
      receiptNode.replaceChildren();
      receiptItems.forEach(([key, value]) => receiptNode.appendChild(makeRow(key, value)));
    }
  }

  function syncTransactionSelectionPresentation() {
    state.transactionPoints.forEach((button) => {
      const coinPosition = normalizeCoinPosition(button.dataset.archcoinCoinPosition);
      const isFocused = coinPosition === state.focusedCoinPosition;
      const isSelected = coinPosition === state.selectedCoinPosition;

      button.dataset.focused = isFocused ? "true" : "false";
      button.dataset.selected = isSelected ? "true" : "false";
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");

      const core = qs(".orbit-gem-core", button);
      if (core) {
        core.style.filter = isSelected
          ? "brightness(1.22) saturate(1.10)"
          : isFocused
            ? "brightness(1.10)"
            : "";
      }
    });
  }

  function syncLifecyclePresentation() {
    state.lifecycleNodes.forEach((node) => {
      const key = normalizeLifecycleNode(node.dataset.archcoinValueLifecycleNode);
      const selected = key === state.selectedLifecycleNode;
      node.dataset.selected = selected ? "true" : "false";
      const core = qs(".orbit-gem-core", node);
      if (core) {
        core.style.filter = selected ? "brightness(1.16)" : "";
      }
    });
  }

  function syncAdapterPresentation() {
    state.adapterSlots.forEach((slot) => {
      const key = String(slot.dataset.archcoinAdapterSlot || "").trim().toLowerCase();
      const selected = key === state.selectedAdapterSlot;
      slot.dataset.selected = selected ? "true" : "false";
      slot.style.borderColor = selected ? "rgba(141,216,255,.48)" : "";
      slot.style.transform = selected ? "translateY(-3px)" : "";
    });
  }

  function focusCoinPosition(position, source = "focus") {
    const normalized = normalizeCoinPosition(position);
    if (!normalized) return false;

    state.focusedCoinPosition = normalized;
    state.primaryCoinPosition = normalized;
    syncTransactionSelectionPresentation();

    const content = POSITION_CONTENT[normalized];
    setTalk(content.title, content.copy, content.receipt);

    setState(STATES.FOUR_COIN_POSITION_FOCUSED, `${source}:${normalized}`);
    emitArchcoinReceipt({
      orbitFocus: normalized,
      primaryCoinPosition: normalized,
      lastAction: `${source}:${normalized}`,
      lastFailure: null
    });

    return true;
  }

  function selectCoinPosition(position, source = "select") {
    const normalized = normalizeCoinPosition(position);
    if (!normalized) return false;

    state.selectedCoinPosition = normalized;
    state.transactionLayerDescended = true;
    syncTransactionSelectionPresentation();

    const content = POSITION_CONTENT[normalized];
    setTalk(`${content.title} · Selected`, content.copy, content.receipt);

    setState(STATES.FOUR_COIN_POSITION_SELECTED, `${source}:${normalized}`);
    emitArchcoinReceipt({
      orbitFocus: state.focusedCoinPosition,
      primaryCoinPosition: state.primaryCoinPosition,
      selectedCoinPosition: normalized,
      transactionLayerDescended: true,
      lastAction: `${source}:${normalized}`,
      lastFailure: null
    });

    return true;
  }

  function returnToTransactionOrbit(source = "return") {
    state.selectedCoinPosition = "";
    state.transactionLayerDescended = false;
    syncTransactionSelectionPresentation();

    const focusTarget = state.primaryCoinPosition || "contract";
    setState(STATES.RETURNING_TO_TRANSACTION_ORBIT, `${source}:transaction-orbit-return`);
    focusCoinPosition(focusTarget, `${source}-focus`);

    emitArchcoinReceipt({
      selectedCoinPosition: "",
      transactionLayerDescended: false,
      lastAction: `${source}:transaction-orbit-return`,
      lastFailure: null
    });

    return true;
  }

  function selectLifecycleNode(nodeKey, source = "lifecycle") {
    const normalized = normalizeLifecycleNode(nodeKey);
    if (!normalized) return false;

    state.selectedLifecycleNode = normalized;
    state.lifecycleVisible = true;
    syncLifecyclePresentation();

    const content = LIFECYCLE_CONTENT[normalized];
    setTalk(`${content.title} · Secondary lifecycle`, content.copy, content.receipt);

    setState(STATES.VALUE_LIFECYCLE_VISIBLE, `${source}:${normalized}`);
    emitArchcoinReceipt({
      selectedLifecycleNode: normalized,
      lifecycleVisible: true,
      lastAction: `${source}:${normalized}`,
      lastFailure: null
    });

    return true;
  }

  function selectAdapterSlot(adapterKey, source = "adapter") {
    const normalized = String(adapterKey || "").trim().toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(ADAPTER_CONTENT, normalized)) return false;

    state.selectedAdapterSlot = normalized;
    syncAdapterPresentation();

    const content = ADAPTER_CONTENT[normalized];
    setTalk(`${content.title} · Adapter-aware read`, content.copy, content.receipt);

    emitArchcoinReceipt({
      selectedAdapterSlot: normalized,
      lastAction: `${source}:${normalized}`,
      lastFailure: null
    });

    return true;
  }

  function pointerDistance(pointer, clientX, clientY) {
    return Math.hypot(clientX - pointer.startX, clientY - pointer.startY);
  }

  function addPointerSample(pointer, clientX, clientY, time) {
    pointer.samples.push({
      x: clientX,
      y: clientY,
      time
    });

    const minimumTime = time - Math.max(ORBIT.sampleWindowMs * 2, 260);
    pointer.samples = pointer.samples
      .filter((sample) => sample.time >= minimumTime)
      .slice(-ORBIT.maximumSamples);
  }

  function gestureMetrics(pointer, endX, endY, endTime) {
    const dx = endX - pointer.startX;
    const dy = endY - pointer.startY;
    const distance = Math.hypot(dx, dy);
    const durationMs = Math.max(1, endTime - pointer.startTime);
    const averageVelocity = distance / durationMs;

    const recentSamples = pointer.samples.filter(
      (sample) => sample.time >= endTime - ORBIT.sampleWindowMs
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
    const directionalRatio =
      Math.max(absX, absY) / Math.max(1, Math.min(absX, absY));

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

  function isQuickReturnFlick(metrics) {
    return (
      metrics.durationMs <= ORBIT.flickMaximumDurationMs &&
      metrics.distance >= ORBIT.flickMinimumDistancePx &&
      metrics.averageVelocity >= ORBIT.flickMinimumAverageVelocityPxPerMs &&
      metrics.releaseVelocity >= ORBIT.flickMinimumReleaseVelocityPxPerMs &&
      metrics.directionalRatio >= ORBIT.flickMinimumDirectionalRatio &&
      metrics.pauseBeforeRelease <= ORBIT.flickMaximumPauseBeforeReleaseMs &&
      (1 - metrics.pathEfficiency) <= ORBIT.flickMaximumPathEfficiencyLoss
    );
  }

  function angleFromPointerDelta(pointer, clientX) {
    const width = Math.max(1, state.orbitStage.getBoundingClientRect().width);
    const dx = clientX - pointer.startX;
    return (dx / width) * ORBIT.dragRadiansPerViewport;
  }

  function handleOrbitPointerDown(event) {
    if (!state.orbitStage || state.orbit.pointer) return;
    if (event.button !== undefined && event.button !== 0) return;

    const buttonTarget = event.target.closest("[data-archcoin-coin-position]");
    const now = performance.now();

    state.orbit.pointer = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startTime: now,
      dragging: false,
      downCoinPosition: buttonTarget
        ? normalizeCoinPosition(buttonTarget.dataset.archcoinCoinPosition)
        : "",
      startAngle: state.orbit.angle,
      samples: [{ x: event.clientX, y: event.clientY, time: now }]
    };

    try {
      state.orbitStage.setPointerCapture(event.pointerId);
    } catch (_) {}
  }

  function handleOrbitPointerMove(event) {
    const pointer = state.orbit.pointer;
    if (!pointer || event.pointerId !== pointer.id) return;

    const now = performance.now();
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    addPointerSample(pointer, event.clientX, event.clientY, now);

    const distance = pointerDistance(pointer, event.clientX, event.clientY);

    if (!pointer.dragging && distance < ORBIT.dragDeadZonePx) {
      return;
    }

    if (!pointer.dragging) {
      pointer.dragging = true;
      state.orbit.suppressClickUntil = now + ORBIT.suppressClickMs;
      if (state.transactionOrbit) state.transactionOrbit.style.animationPlayState = "paused";
      if (state.lifecycleOrbit) state.lifecycleOrbit.style.animationPlayState = "paused";
    }

    event.preventDefault();

    const deltaAngle = angleFromPointerDelta(pointer, event.clientX);
    state.orbit.angle = wrapRadians(pointer.startAngle + deltaAngle);
    state.orbit.targetAngle = state.orbit.angle;

    const focused = nearestCoinPositionForOrbitAngle(state.orbit.angle);
    if (!state.selectedCoinPosition) {
      focusCoinPosition(focused, "drag-focus");
    } else {
      state.focusedCoinPosition = focused;
      state.primaryCoinPosition = focused;
      syncTransactionSelectionPresentation();
      emitArchcoinReceipt({
        orbitFocus: focused,
        primaryCoinPosition: focused,
        lastAction: `drag-focus:${focused}`,
        lastFailure: null
      });
    }
  }

  function releaseOrbitPointerCapture(event) {
    try {
      if (
        state.orbitStage &&
        state.orbitStage.hasPointerCapture &&
        state.orbitStage.hasPointerCapture(event.pointerId)
      ) {
        state.orbitStage.releasePointerCapture(event.pointerId);
      }
    } catch (_) {}
  }

  function finishOrbitDrag(pointer, event, metrics) {
    const nearest = nearestCoinPositionForOrbitAngle(state.orbit.angle);
    state.focusedCoinPosition = nearest;
    state.primaryCoinPosition = nearest;
    state.orbit.targetAngle = settledAngleForCoinPosition(nearest);

    if (state.selectedCoinPosition && isQuickReturnFlick(metrics)) {
      returnToTransactionOrbit("flick");
      emitArchcoinReceipt({
        orbitFocus: nearest,
        primaryCoinPosition: nearest,
        lastAction: `flick-return:${nearest}`,
        lastFailure: null
      });
      return;
    }

    focusCoinPosition(nearest, "settle");
    emitArchcoinReceipt({
      orbitFocus: nearest,
      primaryCoinPosition: nearest,
      lastAction: `settle:${nearest}`,
      lastFailure: null
    });

    event.preventDefault();
  }

  function finishOrbitTap(pointer, event, metrics) {
    if (
      metrics.distance <= ORBIT.maximumTapDistancePx &&
      pointer.downCoinPosition &&
      performance.now() >= state.orbit.suppressClickUntil
    ) {
      selectCoinPosition(pointer.downCoinPosition, "tap");
      event.preventDefault();
      return;
    }

    if (metrics.distance <= ORBIT.maximumTapDistancePx && state.selectedCoinPosition) {
      returnToTransactionOrbit("tap-background");
      event.preventDefault();
    }
  }

  function handleOrbitPointerUp(event) {
    const pointer = state.orbit.pointer;
    if (!pointer || event.pointerId !== pointer.id) return;

    const now = performance.now();
    addPointerSample(pointer, event.clientX, event.clientY, now);
    const metrics = gestureMetrics(pointer, event.clientX, event.clientY, now);

    releaseOrbitPointerCapture(event);
    state.orbit.pointer = null;

    if (pointer.dragging) {
      finishOrbitDrag(pointer, event, metrics);
      return;
    }

    finishOrbitTap(pointer, event, metrics);
  }

  function handleOrbitPointerCancel(event) {
    const pointer = state.orbit.pointer;
    if (!pointer || event.pointerId !== pointer.id) return;

    releaseOrbitPointerCapture(event);
    state.orbit.pointer = null;
    state.orbit.targetAngle = state.orbit.angle;

    emitArchcoinReceipt({
      lastAction: "pointer-cancelled",
      lastFailure: null
    });
  }

  function handleOrbitClickCapture(event) {
    if (performance.now() < state.orbit.suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  function pauseCssAnimations() {
    if (state.transactionOrbit) state.transactionOrbit.style.animation = "none";
    if (state.lifecycleOrbit) state.lifecycleOrbit.style.animation = "none";

    state.transactionPoints.forEach((point) => {
      const upright = qs(".orbit-upright", point);
      const core = qs(".orbit-gem-core", point);
      if (upright) upright.style.animation = "none";
      if (core) core.style.animation = "none";
    });

    state.lifecycleNodes.forEach((node) => {
      const upright = qs(".orbit-upright", node);
      const core = qs(".orbit-gem-core", node);
      if (upright) upright.style.animation = "none";
      if (core) core.style.animation = "none";
    });

    if (state.centerGem) {
      const core = qs(".center-gem-core", state.centerGem);
      if (core) core.style.animation = "none";
    }
  }

  function layoutOrbitElements() {
    if (!state.orbitStage) return;

    const rect = state.orbitStage.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const primaryRadius = Math.min(width, height) * ORBIT.primaryRadiusFactor;
    const secondaryRadius = Math.min(width, height) * ORBIT.secondaryRadiusFactor;

    state.transactionPoints.forEach((button, index) => {
      const position = normalizeCoinPosition(button.dataset.archcoinCoinPosition);
      const angle = baseAngleForIndex(index, COIN_POSITIONS.length) + state.orbit.angle;
      const depth = Math.sin(angle);
      const projectionX = Math.cos(angle) * primaryRadius;
      const projectionY = Math.sin(angle) * primaryRadius * 0.32;
      const isFocused = position === state.focusedCoinPosition;
      const isSelected = position === state.selectedCoinPosition;

      const scale =
        (isSelected
          ? ORBIT.selectedScaleFront
          : isFocused
            ? ORBIT.focusScaleFront
            : ORBIT.ordinaryScaleBase + ((depth + 1) * 0.5) * ORBIT.ordinaryScaleDepthLift);

      const brightness = 0.82 + ((depth + 1) * 0.5) * 0.30 + (isSelected ? 0.10 : 0);
      const translate =
        `translate3d(${(centerX + projectionX).toFixed(2)}px, ${(centerY + projectionY).toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(4)})`;

      button.style.position = "absolute";
      button.style.left = "0";
      button.style.top = "0";
      button.style.margin = "0";
      button.style.transform = translate;
      button.style.zIndex = String(40 + Math.round(((depth + 1) * 0.5) * 40) + (isSelected ? 12 : isFocused ? 8 : 0));

      const core = qs(".orbit-gem-core", button);
      if (core) {
        const floatY = state.reducedMotion ? 0 : Math.sin(performance.now() * 0.0014 + index * 0.8) * 6;
        core.style.transform = `translateY(${floatY.toFixed(2)}px)`;
        core.style.filter = `${core.style.filter || ""} brightness(${brightness.toFixed(3)})`.trim();
      }

      const upright = qs(".orbit-upright", button);
      if (upright) {
        upright.style.transform = `rotate(${(-state.orbit.angle).toFixed(4)}rad)`;
      }
    });

    state.lifecycleNodes.forEach((node, index) => {
      const key = normalizeLifecycleNode(node.dataset.archcoinValueLifecycleNode);
      const angle = baseAngleForIndex(index, LIFECYCLE_NODES.length) + state.orbit.innerAngle;
      const depth = Math.sin(angle);
      const projectionX = Math.cos(angle) * secondaryRadius;
      const projectionY = Math.sin(angle) * secondaryRadius * 0.42;
      const selected = key === state.selectedLifecycleNode;

      const scale =
        ORBIT.innerScaleBase + ((depth + 1) * 0.5) * ORBIT.innerScaleDepthLift + (selected ? 0.08 : 0);

      node.style.position = "absolute";
      node.style.left = "0";
      node.style.top = "0";
      node.style.margin = "0";
      node.style.transform =
        `translate3d(${(centerX + projectionX).toFixed(2)}px, ${(centerY + projectionY).toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(4)})`;
      node.style.zIndex = String(20 + Math.round(((depth + 1) * 0.5) * 20) + (selected ? 8 : 0));

      const core = qs(".orbit-gem-core", node);
      if (core) {
        const floatY = state.reducedMotion ? 0 : Math.sin(performance.now() * 0.0018 + index * 1.1) * 4;
        core.style.transform = `translateY(${floatY.toFixed(2)}px)`;
      }

      const upright = qs(".orbit-upright", node);
      if (upright) {
        upright.style.transform = `rotate(${(-state.orbit.innerAngle).toFixed(4)}rad)`;
      }
    });

    if (state.centerGem) {
      const core = qs(".center-gem-core", state.centerGem);
      if (core) {
        const glow = state.reducedMotion ? 0 : Math.sin(performance.now() * 0.0012) * 0.015;
        core.style.transform = `scale(${(1 + glow).toFixed(4)})`;
      }
    }
  }

  function animateOrbitFrame() {
    if (!state.orbit.running) return;

    const settleFactor = state.reducedMotion ? 1 : 0.12;
    state.orbit.angle = wrapRadians(
      state.orbit.angle + wrapRadians(state.orbit.targetAngle - state.orbit.angle) * settleFactor
    );

    const desiredInnerBase = wrapRadians(-state.orbit.angle * 0.62);
    state.orbit.targetInnerAngle = desiredInnerBase;
    state.orbit.innerAngle = wrapRadians(
      state.orbit.innerAngle + wrapRadians(state.orbit.targetInnerAngle - state.orbit.innerAngle) * (state.reducedMotion ? 1 : 0.10)
    );

    layoutOrbitElements();
    state.orbit.frame = window.requestAnimationFrame(animateOrbitFrame);
  }

  function bindTransactionControls() {
    state.transactionPoints.forEach((button) => {
      const position = normalizeCoinPosition(button.dataset.archcoinCoinPosition);
      if (!position) return;

      button.addEventListener("mouseenter", () => {
        if (state.selectedCoinPosition || state.orbit.pointer?.dragging) return;
        focusCoinPosition(position, "hover");
      });

      button.addEventListener("focus", () => {
        if (state.selectedCoinPosition || state.orbit.pointer?.dragging) return;
        focusCoinPosition(position, "focus");
      });
    });

    if (state.orbitStage) {
      state.orbitStage.style.touchAction = "none";
      state.orbitStage.style.overscrollBehavior = "contain";

      state.orbitStage.addEventListener("pointerdown", handleOrbitPointerDown, { passive: false });
      state.orbitStage.addEventListener("pointermove", handleOrbitPointerMove, { passive: false });
      state.orbitStage.addEventListener("pointerup", handleOrbitPointerUp, { passive: false });
      state.orbitStage.addEventListener("pointercancel", handleOrbitPointerCancel, { passive: false });
      state.orbitStage.addEventListener("click", handleOrbitClickCapture, true);
    }
  }

  function bootArchcoinTransactionOrbit() {
    state.transactionOrbit = qs(".transaction-orbit");
    state.lifecycleOrbit = qs(".lifecycle-orbit");
    state.centerGem = qs(".center-gem");
    state.transactionPoints = qsa("[data-archcoin-coin-position]", document);

    if (!state.transactionPoints.length || !state.orbitStage) {
      emitArchcoinReceipt({
        status: "held",
        lastAction: "bootArchcoinTransactionOrbit",
        lastFailure: "TRANSACTION_ORBIT_NODES_MISSING"
      });
      return false;
    }

    pauseCssAnimations();
    bindTransactionControls();

    state.orbit.angle = settledAngleForCoinPosition("contract");
    state.orbit.targetAngle = state.orbit.angle;
    state.orbit.innerAngle = -state.orbit.angle * 0.62;
    state.orbit.targetInnerAngle = state.orbit.innerAngle;
    state.orbit.running = true;

    focusCoinPosition("contract", "boot");
    layoutOrbitElements();
    state.orbit.frame = window.requestAnimationFrame(animateOrbitFrame);
    return true;
  }

  function bootArchcoinValueLifecycle() {
    state.lifecycleNodes = qsa("[data-archcoin-value-lifecycle-node]", document);
    if (!state.lifecycleNodes.length) {
      emitArchcoinReceipt({
        lastAction: "bootArchcoinValueLifecycle",
        lastFailure: null
      });
      return true;
    }

    state.lifecycleNodes.forEach((node) => {
      const lifecycleKey = normalizeLifecycleNode(node.dataset.archcoinValueLifecycleNode);
      if (!lifecycleKey) return;

      node.addEventListener("mouseenter", () => {
        if (state.selectedCoinPosition || state.orbit.pointer?.dragging) return;
        selectLifecycleNode(lifecycleKey, "hover");
      });

      node.addEventListener("focus", () => {
        if (state.selectedCoinPosition || state.orbit.pointer?.dragging) return;
        selectLifecycleNode(lifecycleKey, "focus");
      });
    });

    emitArchcoinReceipt({
      lastAction: "bootArchcoinValueLifecycle",
      lastFailure: null
    });

    return true;
  }

  function bootArchcoinAssetAdapters() {
    state.adapterSlots = qsa("[data-archcoin-adapter-slot]", document);
    if (!state.adapterSlots.length) {
      emitArchcoinReceipt({
        lastAction: "bootArchcoinAssetAdapters",
        lastFailure: null
      });
      return true;
    }

    state.adapterSlots.forEach((slot) => {
      const key = String(slot.dataset.archcoinAdapterSlot || "").trim().toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(ADAPTER_CONTENT, key)) return;

      slot.addEventListener("mouseenter", () => {
        if (state.orbit.pointer?.dragging) return;
        selectAdapterSlot(key, "hover");
      });

      slot.addEventListener("focusin", () => {
        if (state.orbit.pointer?.dragging) return;
        selectAdapterSlot(key, "focus");
      });
    });

    emitArchcoinReceipt({
      lastAction: "bootArchcoinAssetAdapters",
      lastFailure: null
    });

    return true;
  }

  function safeManifestHydrationAllowed() {
    return state.manifestSchemaBound && MANIFEST_SCHEMA.frozen === true && MANIFEST_SCHEMA.allowedKeys.length > 0;
  }

  function setObservationNodeValue(key, value) {
    state.manifestObservationNodes
      .filter((node) => String(node.dataset.archcoinObservation || "").trim() === key)
      .forEach((node) => {
        node.textContent = String(value);
      });
  }

  function hydrateKnownManifestKeys(data) {
    MANIFEST_SCHEMA.allowedKeys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(data, key)) return;
      setObservationNodeValue(key, data[key]);
    });
  }

  function bootArchcoinManifestHydration() {
    state.manifestObservationNodes = qsa("[data-archcoin-observation]", document);

    state.manifestHydrationEnabled = safeManifestHydrationAllowed();
    state.manifestSchemaBound = safeManifestHydrationAllowed();

    emitArchcoinReceipt({
      manifestHydrationEnabled: state.manifestHydrationEnabled,
      manifestSchemaBound: state.manifestSchemaBound,
      lastAction: "bootArchcoinManifestHydration",
      lastFailure: null
    });

    if (!state.manifestHydrationEnabled) {
      return true;
    }

    const manifestUrl = "./manifest.json";
    state.manifestHydrationAttempted = true;

    fetch(manifestUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`MANIFEST_FETCH_FAILED:${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const keys = Object.keys(data);
        const unknown = keys.filter((key) => !MANIFEST_SCHEMA.allowedKeys.includes(key));

        if (unknown.length) {
          throw new Error(`MANIFEST_UNKNOWN_KEYS:${unknown.join(",")}`);
        }

        hydrateKnownManifestKeys(data);
        state.manifestData = data;
        state.manifestHydrationSucceeded = true;

        emitArchcoinReceipt({
          manifestHydrationAttempted: true,
          manifestHydrationSucceeded: true,
          lastAction: "manifest-hydration-succeeded",
          lastFailure: null
        });
      })
      .catch((error) => {
        state.manifestHydrationSucceeded = false;
        emitArchcoinReceipt({
          manifestHydrationAttempted: true,
          manifestHydrationSucceeded: false,
          lastAction: "manifest-hydration-failed",
          lastFailure: error && error.message ? error.message : String(error)
        });
      });

    return true;
  }

  function buildStars() {
    const area = Math.max(1, state.field.width * state.field.height);
    const count = Math.min(96, Math.max(42, Math.floor(area / 18000)));

    state.field.stars = Array.from({ length: count }, () => ({
      x: Math.random() * state.field.width,
      y: Math.random() * state.field.height,
      z: 0.25 + Math.random() * 0.75,
      size: 0.55 + Math.random() * 1.75,
      drift: (Math.random() - 0.5) * 0.07,
      pulse: Math.random() * Math.PI * 2
    }));
  }

  function ensureFieldCanvas() {
    if (!state.geometryMount || state.field.canvas) return state.field.canvas;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.archcoinVisualField = "true";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";

    state.geometryMount.appendChild(canvas);

    state.field.canvas = canvas;
    state.field.context = canvas.getContext("2d");
    return canvas;
  }

  function resizeFieldCanvas() {
    if (!state.field.canvas || !state.field.context || !state.orbitStage) return;

    const rect = state.orbitStage.getBoundingClientRect();
    state.field.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    state.field.width = Math.max(1, rect.width);
    state.field.height = Math.max(1, rect.height);

    state.field.canvas.width = Math.floor(state.field.width * state.field.pixelRatio);
    state.field.canvas.height = Math.floor(state.field.height * state.field.pixelRatio);
    state.field.canvas.style.width = `${state.field.width}px`;
    state.field.canvas.style.height = `${state.field.height}px`;

    state.field.context.setTransform(state.field.pixelRatio, 0, 0, state.field.pixelRatio, 0, 0);
    buildStars();
  }

  function drawField() {
    const ctx = state.field.context;
    if (!ctx) return;

    ctx.clearRect(0, 0, state.field.width, state.field.height);

    const gx = (state.field.pointerX - 0.5) * 28;
    const gy = (state.field.pointerY - 0.5) * 28;

    for (const star of state.field.stars) {
      star.pulse += 0.01 * star.z;
      star.y += star.drift * star.z;

      if (star.y < -10) star.y = state.field.height + 10;
      if (star.y > state.field.height + 10) star.y = -10;

      const px = star.x + gx * star.z;
      const py = star.y + gy * star.z;
      const alpha = 0.16 + (Math.sin(star.pulse) * 0.5 + 0.5) * 0.28 * star.z;

      ctx.beginPath();
      ctx.fillStyle = `rgba(190,225,255,${alpha.toFixed(3)})`;
      ctx.arc(px, py, star.size * star.z, 0, Math.PI * 2);
      ctx.fill();
    }

    const grad = ctx.createRadialGradient(
      state.field.width * 0.5 + gx * 2,
      state.field.height * 0.36 + gy * 2,
      0,
      state.field.width * 0.5,
      state.field.height * 0.5,
      Math.max(state.field.width, state.field.height) * 0.48
    );

    grad.addColorStop(0, "rgba(243,200,111,0.050)");
    grad.addColorStop(0.45, "rgba(126,203,255,0.030)");
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, state.field.width, state.field.height);
  }

  function frameField() {
    if (!state.field.running) return;
    drawField();
    state.field.frame = window.requestAnimationFrame(frameField);
  }

  function bootArchcoinVisualField() {
    ensureFieldCanvas();
    if (!state.field.canvas || !state.field.context) {
      emitArchcoinReceipt({
        lastAction: "bootArchcoinVisualField",
        lastFailure: "VISUAL_FIELD_CONTEXT_UNAVAILABLE"
      });
      return false;
    }

    resizeFieldCanvas();

    state.field.running = true;
    state.field.frame = window.requestAnimationFrame(frameField);

    window.addEventListener(
      "pointermove",
      (event) => {
        state.field.pointerX = event.clientX / Math.max(window.innerWidth, 1);
        state.field.pointerY = event.clientY / Math.max(window.innerHeight, 1);
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      resizeFieldCanvas();
      layoutOrbitElements();
    }, { passive: true });

    emitArchcoinReceipt({
      lastAction: "bootArchcoinVisualField",
      lastFailure: null
    });

    return true;
  }

  function emitArchcoinReceipt(extra = {}) {
    Object.assign(
      RECEIPT,
      {
        status: state.currentState === STATES.HELD ? "held" : "available",
        state: state.currentState,
        orbitFocus: state.focusedCoinPosition,
        primaryCoinPosition: state.primaryCoinPosition,
        selectedCoinPosition: state.selectedCoinPosition,
        selectedLifecycleNode: state.selectedLifecycleNode,
        selectedAdapterSlot: state.selectedAdapterSlot,
        transactionLayerDescended: state.transactionLayerDescended,
        lifecycleVisible: state.lifecycleVisible,
        manifestHydrationEnabled: state.manifestHydrationEnabled,
        manifestHydrationAttempted: state.manifestHydrationAttempted,
        manifestHydrationSucceeded: state.manifestHydrationSucceeded,
        manifestSchemaBound: state.manifestSchemaBound,
        visualPassClaimed: false
      },
      extra
    );

    const serialized = JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.archcoinRuntimeReceipt = serialized;
      state.root.dataset.archcoinRuntimeStatus = RECEIPT.status;
      state.root.dataset.visualPassClaimed = "false";
      state.root.dataset.archcoinTransactionState = RECEIPT.state;
      state.root.dataset.archcoinOrbitFocus = RECEIPT.orbitFocus;
      state.root.dataset.archcoinSelectedCoinPosition = RECEIPT.selectedCoinPosition;
      state.root.dataset.archcoinSelectedLifecycleNode = RECEIPT.selectedLifecycleNode;
      state.root.dataset.archcoinSelectedAdapterSlot = RECEIPT.selectedAdapterSlot;
      state.root.dataset.archcoinTransactionLayerDescended = RECEIPT.transactionLayerDescended ? "true" : "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value = serialized;
      state.receiptOutput.textContent = serialized;
      state.receiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis.ARCHCOIN_RUNTIME_RECEIPT = Object.freeze({ ...RECEIPT });
  }

  function resolveDom() {
    state.root = document.documentElement;
    state.orbitStage = qs("#archcoin-orbit-stage");
    state.geometryMount = qs("#archcoin-geometry-mount");
    state.receiptOutput = qs("#archcoin-receipt-output");
    state.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function boot() {
    resolveDom();

    if (!state.orbitStage) {
      emitArchcoinReceipt({
        status: "held",
        lastAction: "boot",
        lastFailure: "ARCHCOIN_ORBIT_STAGE_NOT_FOUND"
      });
      return;
    }

    bootArchcoinTransactionOrbit();
    bootArchcoinValueLifecycle();
    bootArchcoinAssetAdapters();
    bootArchcoinManifestHydration();
    bootArchcoinVisualField();

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.selectedCoinPosition) {
        event.preventDefault();
        returnToTransactionOrbit("document-escape");
      }
    });

    state.root.dataset.archcoinRuntime = "v2-1-active";

    emitArchcoinReceipt({
      lastAction: "archcoin-runtime-booted",
      lastFailure: null
    });
  }

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  } catch (error) {
    emitArchcoinReceipt({
      status: "held",
      lastAction: "boot-failure",
      lastFailure: error && error.message ? error.message : String(error)
    });
    console.error("ARCHCOIN runtime failed. Visible-first page remains active.", error);
  }
})();
