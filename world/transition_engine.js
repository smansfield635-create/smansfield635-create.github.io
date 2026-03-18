<script type="module">
import { createPlanetEngine } from "/world/planet_engine.js";
import { createRenderer } from "/world/render.js";
import { createControlSystem } from "/world/control.js";
import { createTransitionEngine } from "/world/transition_engine.js";
import { createInstruments } from "/assets/instruments.js";

const params = new URLSearchParams(location.search);
const initialModeParam = params.get("mode");

let currentMode =
  initialModeParam === "flat" || initialModeParam === "observe"
    ? initialModeParam
    : "round";

const body = document.body;
const canvas = document.getElementById("world-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

const flatLayer = document.getElementById("flat-layer");
const universeLayer = document.getElementById("universe-layer");
const atmosphereLayer = document.getElementById("atmosphere-layer");
const heroLayer = document.getElementById("hero-layer");
const diagnosticsSummary = document.getElementById("diagnostics-summary");
const diagnosticsToggle = document.getElementById("diagnostics-toggle");
const debugPanel = document.getElementById("debug-panel");

const btnFlat = document.getElementById("btn-flat");
const btnRound = document.getElementById("btn-round");
const btnObserve = document.getElementById("btn-observe");
const btnZoomIn = document.getElementById("btn-zoom-in");
const btnZoomOut = document.getElementById("btn-zoom-out");

const overlayMap = Object.freeze({
  "north-products": document.getElementById("marker-north"),
  "east-gauges": document.getElementById("marker-east"),
  "south-laws": document.getElementById("marker-south"),
  "west-explore": document.getElementById("marker-west")
});

const planetEngine = createPlanetEngine();
const renderer = createRenderer();
const control = createControlSystem();
const transition = createTransitionEngine();
const instruments = createInstruments();

const MOTION_STORAGE_KEY = "ns_home_round_motion_v9";
const MARKER_PADDING = 18;
const MARKER_PASSES = 3;
const MARKER_OUTWARD_NUDGE = 8;
const activePointers = new Map();

let planetField = null;
let rafId = 0;
let lastFrameAt = performance.now();
let diagnosticsMode = "peek";
let dragPointerId = null;
let lastX = 0;
let lastY = 0;
let pinchStartDistance = 0;
let pinchStartZoom = 1;

let runtimeState = {
  phase: "HOME",
  progress: {},
  unlocks: {},
  completion: {},
  authorityReceipt: { pass: true },
  validatedReceipts: {}
};

let lastRenderReceipt = Object.freeze({
  audit: Object.freeze({})
});

let lastPlacementReceipt = Object.freeze({
  resolvedHits: Object.freeze([]),
  markerRequired: false,
  markerPlacementAdmissible: true,
  markerCollisionCount: 0,
  markerRepositionedCount: 0
});

const orbitalSystem = Object.freeze({
  objects: Object.freeze([
    Object.freeze({
      id: "north-products",
      label: "PRODUCTS",
      route: "/products/",
      code: "N",
      uiLabel: "PRODUCTS",
      baseLatDeg: 0,
      baseLonDeg: 0,
      bearingOffsetDeg: -90,
      sizePx: 20
    }),
    Object.freeze({
      id: "south-laws",
      label: "LAWS",
      route: "/laws/",
      code: "S",
      uiLabel: "LAWS",
      baseLatDeg: 0,
      baseLonDeg: 0,
      bearingOffsetDeg: 90,
      sizePx: 20
    }),
    Object.freeze({
      id: "east-gauges",
      label: "GAUGES",
      route: "/gauges/",
      code: "E",
      uiLabel: "GAUGES",
      baseLatDeg: 0,
      baseLonDeg: 0,
      bearingOffsetDeg: 0,
      sizePx: 20
    }),
    Object.freeze({
      id: "west-explore",
      label: "EXPLORE",
      route: "/explore/",
      code: "W",
      uiLabel: "EXPLORE",
      baseLatDeg: 0,
      baseLonDeg: 0,
      bearingOffsetDeg: 180,
      sizePx: 20
    })
  ])
});

function isFlatMode() {
  return currentMode === "flat";
}

function isObserveMode() {
  return currentMode === "observe";
}

function isRoundVisualMode() {
  return currentMode === "round" || currentMode === "observe";
}

function markerModeRequired() {
  return currentMode === "round";
}

function orbitVelocityForMode() {
  if (currentMode === "observe") return 0.00010;
  if (currentMode === "round") return 0.00018;
  return 0;
}

function zoomPolicyForMode() {
  if (currentMode === "observe") {
    return Object.freeze({
      min: 1.04,
      max: 1.34,
      initial: 1.24
    });
  }

  if (currentMode === "round") {
    return Object.freeze({
      min: 0.86,
      max: 1.52,
      initial: 1
    });
  }

  return Object.freeze({
    min: 1,
    max: 1,
    initial: 1
  });
}

function buildModeHref(nextMode) {
  const q = new URLSearchParams(location.search);
  q.set("mode", nextMode);
  return `${location.pathname}?${q.toString()}`;
}

function withModeQuery(route) {
  const glue = route.includes("?") ? "&" : "?";
  return `${route}${glue}mode=${currentMode}`;
}

function resizeWorld() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  control.resize(width, height);
}

function buildPlanetFieldOnce() {
  if (!planetField) {
    planetField = planetEngine.buildPlanetField({});
  }
}

function restoreMotionState() {
  if (!isRoundVisualMode()) return;
  try {
    const raw = sessionStorage.getItem(MOTION_STORAGE_KEY);
    if (!raw) return;
    control.restoreMotionState(JSON.parse(raw));
  } catch {
    return;
  }
}

function persistMotionState() {
  if (!isRoundVisualMode()) return;
  try {
    sessionStorage.setItem(MOTION_STORAGE_KEY, JSON.stringify(control.getMotionState()));
  } catch {
    return;
  }
}

function safeProjectionSummary() {
  if (typeof control.getProjectionSummary === "function") {
    const summary = control.getProjectionSummary();
    return summary && typeof summary === "object" ? summary : {};
  }
  return {};
}

function safeMotionReceipt(dtMs) {
  const motionState =
    typeof control.getMotionState === "function"
      ? control.getMotionState()
      : {};
  const orbitalState =
    typeof control.getOrbitalState === "function"
      ? control.getOrbitalState()
      : {};

  return {
    motionRunning: isRoundVisualMode(),
    rafActive: rafId !== 0,
    pageVisible: document.visibilityState === "visible",
    pageRestored: true,
    yawVelocity: Number.isFinite(motionState?.yawVelocity) ? motionState.yawVelocity : null,
    pitchVelocity: Number.isFinite(motionState?.pitchVelocity) ? motionState.pitchVelocity : null,
    orbitVelocity: orbitVelocityForMode(),
    orbitPhase: Number.isFinite(orbitalState?.orbitPhase) ? orbitalState.orbitPhase : null,
    blockedDragOnStarCount: 0,
    starTapCount: 0,
    dtMs
  };
}

function buildPlanetValidatorPacket() {
  if (!planetField?.summary) return {};

  const summary = planetField.summary;
  const completeness = planetField.completeness || {};
  const completenessValues = Object.values(completeness);
  const completenessRatio = completenessValues.length
    ? completenessValues.filter((value) => value === true).length / completenessValues.length
    : 1;

  return Object.freeze({
    engineId: "planet",
    lobeId: 0,
    stateIndexDepth: 128,
    bufferClass: 65536,
    hash: [
      "planet",
      summary.sampleCount ?? 0,
      summary.landCount ?? 0,
      summary.waterCount ?? 0,
      summary.continentCount ?? 0
    ].join(":"),
    stale: false,
    dependencies: {},
    completeness: completenessRatio
  });
}

function updateTransitionState() {
  const packet = buildPlanetValidatorPacket();
  runtimeState = transition.update(runtimeState, {
    proposed: isFlatMode() ? "FLAT_HOME" : isObserveMode() ? "OBSERVE_HOME" : "ROUND_HOME",
    family: "HOME_MODE",
    fromRoute: location.pathname,
    toRoute: location.pathname,
    fromMode: currentMode,
    toMode: currentMode,
    explicitUserAction: true,
    reason: "runtime_tick",
    packet
  });
}

function buildRuntimePacket(dtMs) {
  const projectionSummary = safeProjectionSummary();
  const sample =
    planetField?.samples?.[projectionSummary.sampleY]?.[projectionSummary.sampleX] ||
    planetField?.samples?.[128]?.[128] ||
    null;

  const instrument = instruments.buildInstrumentReceipt({
    currentSample: sample,
    previousSample: sample,
    tickIndex: 0,
    motionState: safeMotionReceipt(dtMs),
    authorityState: {
      motionOwner: "control.js",
      projectionOwner: "control.js",
      inputOwner: "index.html",
      renderSource: "render.js",
      orbitSource: "index.html",
      transitionSource: "transition_engine.js",
      validatorSource: "validator_engine.js"
    },
    transitionState: runtimeState.transition || {
      proposed: isFlatMode() ? "FLAT_HOME" : isObserveMode() ? "OBSERVE_HOME" : "ROUND_HOME",
      admissible: true,
      accepted: true,
      blockedReason: "",
      family: "HOME_MODE"
    }
  });

  return Object.freeze({
    phase: "HOME",
    fps: dtMs > 0 ? 1000 / dtMs : 0,
    dtMs,
    elapsedMs: performance.now(),
    instrument,
    control: {
      projectionSummary,
      motionState: typeof control.getMotionState === "function" ? control.getMotionState() : {},
      orbitalState: typeof control.getOrbitalState === "function" ? control.getOrbitalState() : {}
    },
    planetField,
    renderAudit: lastRenderReceipt?.audit || {},
    orbitalAudit: {
      count: orbitalSystem.objects.length,
      frontVisibleCount: Array.isArray(lastPlacementReceipt?.resolvedHits)
        ? lastPlacementReceipt.resolvedHits.length
        : 0,
      ...(lastPlacementReceipt || {})
    },
    progress: runtimeState.progress || {},
    unlocks: runtimeState.unlocks || {},
    completion: runtimeState.completion || {},
    transition: runtimeState.transition || {},
    validator: runtimeState.validator || {},
    validatedReceipts: runtimeState.validatedReceipts || {},
    verification: {
      pass: true,
      reasons: []
    },
    failure: {
      phase: "",
      message: ""
    }
  });
}

function updateDiagnostics(dtMs) {
  const runtime = buildRuntimePacket(dtMs);
  diagnosticsSummary.innerHTML = instruments.renderCompactBarHTML(runtime);
  debugPanel.innerHTML = instruments.renderPanelHTML(runtime);
}

function hideAllMarkers() {
  for (const key of Object.keys(overlayMap)) {
    const node = overlayMap[key];
    if (node) node.hidden = true;
  }
}

function getViewportCenter() {
  return Object.freeze({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5
  });
}

function cloneHit(hit, center) {
  const radius = Number.isFinite(hit?.radius) ? hit.radius : 42;
  const dx = hit.x - center.x;
  const dy = hit.y - center.y;
  return {
    id: hit.id,
    label: hit.label,
    route: hit.route,
    x: hit.x,
    y: hit.y,
    radius,
    angle: Math.atan2(dy, dx)
  };
}

function normalizeAngle(value) {
  const twoPi = Math.PI * 2;
  let angle = value;
  while (angle <= -Math.PI) angle += twoPi;
  while (angle > Math.PI) angle -= twoPi;
  return angle;
}

function computeMarkerVector(hit, center) {
  const dx = hit.x - center.x;
  const dy = hit.y - center.y;
  const length = Math.sqrt((dx * dx) + (dy * dy));

  if (length > 0.0001) {
    return Object.freeze({
      ux: dx / length,
      uy: dy / length
    });
  }

  return Object.freeze({
    ux: Math.cos(hit.angle),
    uy: Math.sin(hit.angle)
  });
}

function applyOutwardSeparation(a, b, center) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.sqrt((dx * dx) + (dy * dy));
  const minDistance = a.radius + b.radius + MARKER_PADDING;

  if (distance >= minDistance) {
    return false;
  }

  const overlap = minDistance - Math.max(distance, 0.0001);
  const va = computeMarkerVector(a, center);
  const vb = computeMarkerVector(b, center);

  a.x -= va.ux * (overlap * 0.5);
  a.y -= va.uy * (overlap * 0.5);
  b.x += vb.ux * (overlap * 0.5);
  b.y += vb.uy * (overlap * 0.5);

  return true;
}

function minimalViewportClamp(hit) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const margin = hit.radius + 4;

  hit.x = Math.max(margin, Math.min(width - margin, hit.x));
  hit.y = Math.max(margin, Math.min(height - margin, hit.y));
}

function countCollisions(hits) {
  let count = 0;
  for (let i = 0; i < hits.length; i += 1) {
    for (let j = i + 1; j < hits.length; j += 1) {
      const a = hits[i];
      const b = hits[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const minDistance = a.radius + b.radius + MARKER_PADDING;
      if ((dx * dx) + (dy * dy) < minDistance * minDistance) {
        count += 1;
      }
    }
  }
  return count;
}

function validateMarkersInViewport(hits) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  for (const hit of hits) {
    if (hit.x - hit.radius < 0) return false;
    if (hit.x + hit.radius > width) return false;
    if (hit.y - hit.radius < 0) return false;
    if (hit.y + hit.radius > height) return false;
  }

  return true;
}

function getRawOrbitalHits() {
  if (!markerModeRequired()) return [];

  const orbitalState = control.getOrbitalState();
  const phase = Number.isFinite(orbitalState?.orbitPhase) ? orbitalState.orbitPhase : 0;
  const altitudePx = control.getCameraState().radius * 0.42;

  return orbitalSystem.objects.map((object) => {
    const lonDeg = object.baseLonDeg + object.bearingOffsetDeg + ((phase * 180) / Math.PI);
    const point = control.projectSphere(object.baseLatDeg, lonDeg, altitudePx);
    const edgeVisibility = Math.max(0, Math.min(1, (point.z + 0.08) / 0.30));
    const frontFacing = point.z >= 0;
    const scale = 0.82 + edgeVisibility * 0.34;
    const opacity = frontFacing
      ? 0.42 + edgeVisibility * 0.58
      : edgeVisibility * 0.34;

    return Object.freeze({
      id: object.id,
      label: object.label,
      route: object.route,
      x: point.x,
      y: point.y,
      radius: object.sizePx * scale * 0.72,
      frontFacing,
      opacity
    });
  }).filter((hit) => hit.frontFacing && hit.opacity > 0.22);
}

function solveMarkerPlacement(rawHits) {
  const required = markerModeRequired();

  if (!required) {
    return Object.freeze({
      resolvedHits: Object.freeze([]),
      markerRequired: false,
      markerPlacementAdmissible: true,
      markerCollisionCount: 0,
      markerRepositionedCount: 0
    });
  }

  const center = getViewportCenter();
  const frontHits = rawHits
    .filter((hit) => Number.isFinite(hit?.x) && Number.isFinite(hit?.y))
    .map((hit) => cloneHit(hit, center))
    .sort((a, b) => a.angle - b.angle);

  if (!frontHits.length) {
    return Object.freeze({
      resolvedHits: Object.freeze([]),
      markerRequired: true,
      markerPlacementAdmissible: false,
      markerCollisionCount: 0,
      markerRepositionedCount: 0
    });
  }

  let repositionedCount = 0;

  for (let pass = 0; pass < MARKER_PASSES; pass += 1) {
    let moved = false;

    for (let i = 0; i < frontHits.length; i += 1) {
      const a = frontHits[i];
      const b = frontHits[(i + 1) % frontHits.length];

      if (frontHits.length > 2) {
        const delta = normalizeAngle(b.angle - a.angle);
        if (delta <= 0) continue;
      }

      const changed = applyOutwardSeparation(a, b, center);
      if (changed) {
        moved = true;
        repositionedCount += 2;
      }
    }

    if (!moved) break;
  }

  for (const hit of frontHits) {
    minimalViewportClamp(hit);
  }

  const stillColliding = countCollisions(frontHits);

  if (stillColliding > 0) {
    for (const hit of frontHits) {
      const vector = computeMarkerVector(hit, center);
      hit.x += vector.ux * MARKER_OUTWARD_NUDGE;
      hit.y += vector.uy * MARKER_OUTWARD_NUDGE;
      minimalViewportClamp(hit);
    }
  }

  const finalCollisionCount = countCollisions(frontHits);
  const inViewport = validateMarkersInViewport(frontHits);

  return Object.freeze({
    resolvedHits: Object.freeze(frontHits.map((hit) => Object.freeze({
      id: hit.id,
      label: hit.label,
      route: hit.route,
      x: hit.x,
      y: hit.y,
      radius: hit.radius
    }))),
    markerRequired: true,
    markerPlacementAdmissible: finalCollisionCount === 0 && inViewport,
    markerCollisionCount: finalCollisionCount,
    markerRepositionedCount: repositionedCount
  });
}

function syncOverlayMarkers() {
  if (!isRoundVisualMode() || isObserveMode()) {
    lastPlacementReceipt = Object.freeze({
      resolvedHits: Object.freeze([]),
      markerRequired: false,
      markerPlacementAdmissible: true,
      markerCollisionCount: 0,
      markerRepositionedCount: 0
    });
    hideAllMarkers();
    return;
  }

  const placement = solveMarkerPlacement(getRawOrbitalHits());
  lastPlacementReceipt = placement;

  hideAllMarkers();

  for (const hit of placement.resolvedHits) {
    const marker = overlayMap[hit.id];
    if (!marker) continue;

    marker.hidden = false;
    marker.style.left = `${hit.x}px`;
    marker.style.top = `${hit.y}px`;
  }
}

function buildViewState() {
  const cameraState =
    typeof control.getCameraState === "function"
      ? control.getCameraState()
      : {};

  return Object.freeze({
    ...cameraState,
    observeMode: isObserveMode()
  });
}

function renderSurface(dtMs) {
  if (!planetField) return;

  lastRenderReceipt = renderer.renderPlanet({
    ctx,
    planetField,
    projectPoint: (latDeg, lonDeg, radiusOffsetPx = 0) =>
      control.projectSphere(latDeg, lonDeg, radiusOffsetPx),
    viewState: buildViewState()
  });

  updateTransitionState();
  syncOverlayMarkers();
  updateDiagnostics(dtMs);
}

function frame(now) {
  const dtMs = now - lastFrameAt;
  lastFrameAt = now;

  if (isRoundVisualMode()) {
    control.stepInertia(dtMs);
    control.advanceOrbit(dtMs, orbitVelocityForMode());
  }

  renderSurface(dtMs);
  rafId = requestAnimationFrame(frame);
}

function syncModeButtons() {
  btnFlat.classList.toggle("is-active", currentMode === "flat");
  btnRound.classList.toggle("is-active", currentMode === "round");
  btnObserve.classList.toggle("is-active", currentMode === "observe");
}

function applyModePolicy() {
  control.setPresentationMode(currentMode);

  const zoom = zoomPolicyForMode();
  control.setZoomBounds(zoom.min, zoom.max);

  if (currentMode === "flat") {
    control.setZoomAbsolute(1);
    control.setOrientation({
      zoomCurrent: 1,
      zoomTarget: 1
    });
  } else {
    const motion = control.getMotionState();
    if (!Number.isFinite(motion.zoomCurrent) || motion.zoomCurrent < zoom.min || motion.zoomCurrent > zoom.max) {
      control.setZoomAbsolute(zoom.initial);
      control.setOrientation({
        zoomCurrent: zoom.initial,
        zoomTarget: zoom.initial
      });
    }
  }
}

function setModePresentation() {
  body.setAttribute("data-mode", currentMode);
  syncModeButtons();
  applyModePolicy();

  if (isFlatMode()) {
    flatLayer.style.display = "flex";
    canvas.style.filter = "blur(8px) brightness(.64)";
    universeLayer.style.filter = "none";
    atmosphereLayer.style.filter = "none";
    heroLayer.style.transform = "none";
    hideAllMarkers();
  } else if (isObserveMode()) {
    flatLayer.style.display = "none";
    canvas.style.filter = "none";
    universeLayer.style.filter = "blur(.25px)";
    atmosphereLayer.style.filter = "none";
    heroLayer.style.transform = "translateY(-4px)";
    hideAllMarkers();
  } else {
    flatLayer.style.display = "none";
    canvas.style.filter = "none";
    universeLayer.style.filter = "none";
    atmosphereLayer.style.filter = "none";
    heroLayer.style.transform = "none";
  }
}

function setDiagnosticsMode(nextMode) {
  diagnosticsMode = nextMode === "full" ? "full" : "peek";
  body.setAttribute("data-diagnostics", diagnosticsMode);
  diagnosticsToggle.textContent = diagnosticsMode === "full" ? "HIDE DIAGNOSTICS" : "DIAGNOSTICS";
}

function navigateToMode(nextMode) {
  persistMotionState();
  location.href = buildModeHref(nextMode);
}

function bindOverlayRoutes() {
  orbitalSystem.objects.forEach((obj) => {
    const marker = overlayMap[obj.id];
    if (!marker) return;

    marker.addEventListener("click", () => {
      persistMotionState();
      location.href = withModeQuery(obj.route);
    });
  });
}

function pointerDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function resetPinchState() {
  pinchStartDistance = 0;
  pinchStartZoom = control.getMotionState().zoomCurrent;
}

function bindCanvasInteractions() {
  if (!isRoundVisualMode()) return;

  canvas.addEventListener("wheel", (event) => {
    if (!isRoundVisualMode() || isFlatMode()) return;
    event.preventDefault();
    control.adjustZoomBy(-event.deltaY * 0.0015);
  }, { passive: false });

  canvas.addEventListener("pointerdown", (event) => {
    activePointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    if (activePointers.size === 1) {
      dragPointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
    }

    if (activePointers.size === 2) {
      dragPointerId = null;
      const points = Array.from(activePointers.values());
      pinchStartDistance = pointerDistance(points[0], points[1]);
      pinchStartZoom = control.getMotionState().zoomCurrent;
    }
  }, { passive: true });

  window.addEventListener("pointermove", (event) => {
    if (!activePointers.has(event.pointerId)) return;

    activePointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    if (activePointers.size === 2) {
      const points = Array.from(activePointers.values());
      const currentDistance = pointerDistance(points[0], points[1]);

      if (pinchStartDistance > 0.0001) {
        control.setZoomAbsolute(pinchStartZoom * (currentDistance / pinchStartDistance));
      }
      return;
    }

    if (dragPointerId !== event.pointerId) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    lastX = event.clientX;
    lastY = event.clientY;

    control.applyDrag(dx, dy);
  }, { passive: true });

  function endPointer(pointerId) {
    activePointers.delete(pointerId);

    if (activePointers.size < 2) {
      resetPinchState();
    }

    if (dragPointerId === pointerId) {
      dragPointerId = null;
    }

    if (activePointers.size === 1) {
      const [id, point] = Array.from(activePointers.entries())[0];
      dragPointerId = id;
      lastX = point.x;
      lastY = point.y;
    }
  }

  window.addEventListener("pointerup", (event) => {
    endPointer(event.pointerId);
  }, { passive: true });

  window.addEventListener("pointercancel", (event) => {
    endPointer(event.pointerId);
  }, { passive: true });
}

function bindEvents() {
  diagnosticsToggle.addEventListener("click", () => {
    setDiagnosticsMode(diagnosticsMode === "full" ? "peek" : "full");
    syncOverlayMarkers();
  });

  btnFlat.addEventListener("click", () => {
    if (currentMode === "flat") return;
    navigateToMode("flat");
  });

  btnRound.addEventListener("click", () => {
    if (currentMode === "round") return;
    navigateToMode("round");
  });

  btnObserve.addEventListener("click", () => {
    if (currentMode === "observe") return;
    navigateToMode("observe");
  });

  btnZoomIn.addEventListener("click", () => {
    if (!isRoundVisualMode()) return;
    control.adjustZoomBy(0.10);
  }, { passive: true });

  btnZoomOut.addEventListener("click", () => {
    if (!isRoundVisualMode()) return;
    control.adjustZoomBy(-0.10);
  }, { passive: true });

  bindCanvasInteractions();

  document.querySelectorAll(".flat-card").forEach((card) => {
    card.addEventListener("click", () => {
      const route = card.dataset.route || "/home/";
      persistMotionState();
      location.href = withModeQuery(route);
    });
  });

  window.addEventListener("resize", () => {
    resizeWorld();
    renderSurface(16.7);
  }, { passive: true });

  window.addEventListener("pagehide", () => {
    persistMotionState();

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }, { passive: true });

  window.addEventListener("pageshow", () => {
    applyModePolicy();

    if (isRoundVisualMode()) {
      restoreMotionState();
      applyModePolicy();
    }

    if (!rafId && isRoundVisualMode()) {
      lastFrameAt = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }, { passive: true });
}

function start() {
  resizeWorld();
  buildPlanetFieldOnce();
  applyModePolicy();

  if (isRoundVisualMode()) {
    restoreMotionState();
    applyModePolicy();
  }

  bindOverlayRoutes();
  setModePresentation();
  setDiagnosticsMode("peek");
  bindEvents();
  renderSurface(16.7);

  if (isRoundVisualMode() && !rafId) {
    lastFrameAt = performance.now();
    rafId = requestAnimationFrame(frame);
  }
}

start();
</script>
