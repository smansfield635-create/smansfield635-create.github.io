<script type="module">
import { createPlanetEngine } from "/world/planet_engine.js";
import { createTopologyEngine } from "/world/topology_engine.js";
import { createRenderer } from "/world/render.js";
import { createControlSystem } from "/world/control.js";
import { createInstruments } from "/assets/instruments.js";

const params = new URLSearchParams(location.search);
const currentMode =
  params.get("mode") === "flat" || params.get("mode") === "observe"
    ? params.get("mode")
    : "round";

const body = document.body;
const canvas = document.getElementById("world-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

const flatLayer = document.getElementById("flat-layer");
const universeLayer = document.getElementById("universe-layer");
const atmosphereLayer = document.getElementById("atmosphere-layer");
const heroLayer = document.getElementById("hero-layer");
const orbitalOverlay = document.getElementById("orbital-overlay");
const diagnosticsSummary = document.getElementById("diagnostics-summary");
const diagnosticsToggle = document.getElementById("diagnostics-toggle");
const debugPanel = document.getElementById("debug-panel");
const bootStatus = document.getElementById("boot-status");
const bootStatusCopy = document.getElementById("boot-status-copy");

const btnFlat = document.getElementById("btn-flat");
const btnRound = document.getElementById("btn-round");
const btnObserve = document.getElementById("btn-observe");

const overlayMap = Object.freeze({
  "north-products": document.getElementById("marker-north"),
  "east-gauges": document.getElementById("marker-east"),
  "south-laws": document.getElementById("marker-south"),
  "west-explore": document.getElementById("marker-west")
});

const MOTION_STORAGE_KEY = "ns_home_round_motion_v12";
const RUNTIME_STORAGE_KEY = "cte_runtime_v1";
const MARKER_PADDING = 18;
const MARKER_PASSES = 3;
const MARKER_OUTWARD_NUDGE = 8;

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
      spinOffsetRad: 0.20,
      spinMultiplier: 1.35,
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
      spinOffsetRad: 0.80,
      spinMultiplier: 1.25,
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
      spinOffsetRad: 1.10,
      spinMultiplier: 1.45,
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
      spinOffsetRad: 1.70,
      spinMultiplier: 1.30,
      sizePx: 20
    })
  ])
});

const planetEngine = createPlanetEngine();
const topologyEngine = createTopologyEngine();
const renderer = createRenderer();
const control = createControlSystem();
const instruments = createInstruments();

let planetField = null;
let topologyField = null;
let rafId = 0;
let lastFrameAt = performance.now();
let diagnosticsMode = "peek";
let isDragging = false;
let lastX = 0;
let lastY = 0;
let runtimeReady = false;

let lastRenderReceipt = Object.freeze({
  orbitalHits: Object.freeze([]),
  orbitalAudit: Object.freeze({ count: 0, frontVisibleCount: 0 }),
  audit: Object.freeze({})
});

let lastPlacementReceipt = Object.freeze({
  markerRequired: false,
  markerPlacementAdmissible: true,
  markerCollisionCount: 0,
  markerRepositionedCount: 0
});

let runtimeErrorMessage = "";

function emitRuntimeReceipt(patch = {}) {
  const base = {
    page: "/index.html",
    phase: runtimeReady ? "RUNNING" : "BOOT",
    mode: currentMode,
    bootPass: runtimeReady,
    renderPass: runtimeReady && !!planetField,
    markerPass: !!lastPlacementReceipt.markerPlacementAdmissible,
    diagnosticsMode,
    timestamp: new Date().toISOString(),
    error: runtimeErrorMessage,
    renderAudit: lastRenderReceipt?.audit || {},
    orbitalAudit: {
      ...(lastRenderReceipt?.orbitalAudit || {}),
      ...(lastPlacementReceipt || {})
    }
  };

  try {
    localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify({ ...base, ...patch }));
  } catch {
    return;
  }
}

function showBootStatus(message) {
  bootStatusCopy.textContent = message;
  bootStatus.classList.add("is-visible");
}

function clearBootStatus() {
  bootStatusCopy.textContent = "";
  bootStatus.classList.remove("is-visible");
}

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

function buildTopologyFieldOnce() {
  if (!topologyField && planetField) {
    topologyField = topologyEngine.buildTopologyField(planetField);
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
    orbitVelocity: Number.isFinite(orbitalState?.orbitAngularVelocity) ? orbitalState.orbitAngularVelocity : null,
    orbitPhase: Number.isFinite(orbitalState?.orbitPhase) ? orbitalState.orbitPhase : null,
    blockedDragOnStarCount: 0,
    starTapCount: 0,
    dtMs
  };
}

function isAdmissibleSample(sample) {
  return !!(
    sample &&
    sample.landMask === 1 &&
    typeof sample.subRegion === "string" &&
    sample.subRegion !== "NONE"
  );
}

function getDeterministicFallbackSample(field) {
  if (!field?.samples?.length || !field.samples[0]?.length) return null;

  const height = field.samples.length;
  const width = field.samples[0].length;
  const centerY = Math.floor(height * 0.5);
  const centerX = Math.floor(width * 0.5);
  const maxRadius = Math.max(width, height);

  for (let r = 0; r <= maxRadius; r += 1) {
    const minY = Math.max(0, centerY - r);
    const maxY = Math.min(height - 1, centerY + r);
    const minX = Math.max(0, centerX - r);
    const maxX = Math.min(width - 1, centerX + r);

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const onRing = y === minY || y === maxY || x === minX || x === maxX;
        if (!onRing) continue;

        const candidate = field.samples[y][x];
        if (isAdmissibleSample(candidate)) return candidate;
      }
    }
  }

  return field.samples[centerY]?.[centerX] || field.samples[0]?.[0] || null;
}

function getAdmissibleSample(field, projectionSummary) {
  if (!field?.samples?.length || !field.samples[0]?.length) return null;

  const height = field.samples.length;
  const width = field.samples[0].length;

  const rawX = Number.isInteger(projectionSummary?.sampleX) ? projectionSummary.sampleX : 0;
  const rawY = Number.isInteger(projectionSummary?.sampleY) ? projectionSummary.sampleY : 0;

  const x = Math.max(0, Math.min(width - 1, rawX));
  const y = Math.max(0, Math.min(height - 1, rawY));

  const primary = field.samples[y]?.[x] || null;
  if (isAdmissibleSample(primary)) return primary;

  const MAX_RADIUS = 6;

  for (let r = 1; r <= MAX_RADIUS; r += 1) {
    const minY = Math.max(0, y - r);
    const maxY = Math.min(height - 1, y + r);
    const minX = Math.max(0, x - r);
    const maxX = Math.min(width - 1, x + r);

    for (let ny = minY; ny <= maxY; ny += 1) {
      for (let nx = minX; nx <= maxX; nx += 1) {
        const onRing = ny === minY || ny === maxY || nx === minX || nx === maxX;
        if (!onRing) continue;

        const candidate = field.samples[ny][nx];
        if (isAdmissibleSample(candidate)) return candidate;
      }
    }
  }

  return getDeterministicFallbackSample(field);
}

function buildRuntimePacket(dtMs) {
  const projectionSummary = safeProjectionSummary();
  const sample = getAdmissibleSample(planetField, projectionSummary);

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
      orbitSource: "render.js"
    },
    transitionState: {
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
      ...(lastRenderReceipt?.orbitalAudit || {}),
      ...(lastPlacementReceipt || {})
    },
    progress: {},
    unlocks: {},
    verification: {
      pass: runtimeReady && !!planetField && (runtimeErrorMessage === ""),
      reasons: runtimeErrorMessage ? [runtimeErrorMessage] : []
    },
    failure: {
      phase: runtimeErrorMessage ? "BOOT" : "",
      message: runtimeErrorMessage
    }
  });
}

function updateDiagnostics(dtMs) {
  if (!runtimeReady) {
    diagnosticsSummary.innerHTML = `
      <div class="diagnostic-bar__group">
        <span class="diagnostic-pill"><span class="diagnostic-pill__label">Phase</span><span class="diagnostic-pill__value">BOOT</span></span>
        <span class="diagnostic-pill"><span class="diagnostic-pill__label">Mode</span><span class="diagnostic-pill__value">${currentMode.toUpperCase()}</span></span>
        <span class="diagnostic-pill"><span class="diagnostic-pill__label">Runtime</span><span class="diagnostic-pill__value">WAIT</span></span>
      </div>
    `.trim();

    debugPanel.innerHTML = `
      <section class="panel-section">
        <h3 class="panel-title">Runtime</h3>
        Compass shell active. World runtime has not completed boot.
      </section>
    `;
    return;
  }

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
    angle: Math.atan2(dy, dx),
    radialDistance: Math.sqrt((dx * dx) + (dy * dy))
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

  if (distance >= minDistance) return false;

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
      if ((dx * dx) + (dy * dy) < minDistance * minDistance) count += 1;
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
      markerRequired: false,
      markerPlacementAdmissible: true,
      markerCollisionCount: 0,
      markerRepositionedCount: 0
    });
    hideAllMarkers();
    return;
  }

  const rawHits = Array.isArray(lastRenderReceipt?.orbitalHits)
    ? lastRenderReceipt.orbitalHits
    : [];

  hideAllMarkers();

  const placement = solveMarkerPlacement(rawHits);
  lastPlacementReceipt = placement;

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
    observeMode: isObserveMode(),
    starfieldSuppressed: isObserveMode()
  });
}

function buildOrbitalConfig() {
  if (!isRoundVisualMode() || isObserveMode()) return null;

  const orbitalState =
    typeof control.getOrbitalState === "function"
      ? control.getOrbitalState()
      : {};

  return Object.freeze({
    phase: Number.isFinite(orbitalState?.orbitPhase) ? orbitalState.orbitPhase : 0,
    objects: orbitalSystem.objects,
    altitudeFactor: 0.42
  });
}

function renderSurface(dtMs) {
  if (!planetField) return;

  lastRenderReceipt = renderer.renderPlanet({
    ctx,
    planetField,
    topologyField,
    projectPoint: (latDeg, lonDeg, radiusOffsetPx = 0) =>
      control.projectSphere(latDeg, lonDeg, radiusOffsetPx),
    viewState: buildViewState(),
    orbitalSystem: buildOrbitalConfig()
  });

  syncOverlayMarkers();
  updateDiagnostics(dtMs);
  emitRuntimeReceipt({
    phase: "RUNNING",
    renderPass: true,
    markerPass: !!lastPlacementReceipt.markerPlacementAdmissible
  });
}

function frame(now) {
  const dtMs = now - lastFrameAt;
  lastFrameAt = now;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isRoundVisualMode()) {
    control.stepInertia(dtMs);
  }

  renderSurface(dtMs);
  rafId = requestAnimationFrame(frame);
}

function syncModeButtons() {
  btnFlat.classList.toggle("is-active", currentMode === "flat");
  btnRound.classList.toggle("is-active", currentMode === "round");
  btnObserve.classList.toggle("is-active", currentMode === "observe");
}

function setModePresentation() {
  body.setAttribute("data-mode", currentMode);
  syncModeButtons();

  if (isFlatMode()) {
    flatLayer.style.display = "flex";
    canvas.style.filter = "blur(8px) brightness(.64)";
    orbitalOverlay.style.opacity = "0";
    universeLayer.style.filter = "none";
    atmosphereLayer.style.filter = "none";
    heroLayer.style.transform = "none";
    hideAllMarkers();
  } else if (isObserveMode()) {
    flatLayer.style.display = "none";
    canvas.style.filter = "none";
    orbitalOverlay.style.opacity = "0";
    universeLayer.style.filter = "blur(.25px)";
    atmosphereLayer.style.filter = "none";
    heroLayer.style.transform = "translateY(-4px)";
    hideAllMarkers();
  } else {
    flatLayer.style.display = "none";
    canvas.style.filter = "none";
    orbitalOverlay.style.opacity = "1";
    universeLayer.style.filter = "none";
    atmosphereLayer.style.filter = "none";
    heroLayer.style.transform = "none";
  }
}

function setDiagnosticsMode(nextMode) {
  diagnosticsMode = nextMode === "full" ? "full" : "peek";
  body.setAttribute("data-diagnostics", diagnosticsMode);
  diagnosticsToggle.textContent = diagnosticsMode === "full" ? "HIDE DIAGNOSTICS" : "DIAGNOSTICS";
  emitRuntimeReceipt();
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

  if (isRoundVisualMode()) {
    canvas.addEventListener("pointerdown", (event) => {
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    }, { passive: true });

    window.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      lastX = event.clientX;
      lastY = event.clientY;

      control.applyDrag(dx, dy);
    }, { passive: true });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    }, { passive: true });

    window.addEventListener("pointercancel", () => {
      isDragging = false;
    }, { passive: true });
  }

  document.querySelectorAll(".flat-card").forEach((card) => {
    card.addEventListener("click", () => {
      const route = card.dataset.route || "/home/";
      persistMotionState();
      location.href = withModeQuery(route);
    });
  });

  window.addEventListener("resize", () => {
    resizeWorld();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    control.setPresentationMode(currentMode);

    if (isRoundVisualMode()) {
      restoreMotionState();
    }

    if (!rafId && isRoundVisualMode()) {
      lastFrameAt = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }, { passive: true });
}

function start() {
  try {
    emitRuntimeReceipt({ phase: "BOOT_START", bootPass: false, renderPass: false, markerPass: false });

    resizeWorld();
    buildPlanetFieldOnce();
    buildTopologyFieldOnce();
    control.setPresentationMode(currentMode);

    if (isRoundVisualMode()) {
      restoreMotionState();
    }

    bindOverlayRoutes();
    setModePresentation();
    setDiagnosticsMode("peek");
    bindEvents();

    runtimeReady = true;
    runtimeErrorMessage = "";
    clearBootStatus();

    renderSurface(16.7);

    if (isRoundVisualMode() && !rafId) {
      lastFrameAt = performance.now();
      rafId = requestAnimationFrame(frame);
    }

    emitRuntimeReceipt({ phase: "BOOT_OK", bootPass: true, renderPass: true, markerPass: true });
  } catch (error) {
    runtimeReady = false;
    runtimeErrorMessage = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    showBootStatus(`World runtime failed to boot.\n\n${runtimeErrorMessage}\n\nStatic navigation remains active.`);
    updateDiagnostics(0);
    emitRuntimeReceipt({
      phase: "BOOT_FAIL",
      bootPass: false,
      renderPass: false,
      markerPass: false,
      error: runtimeErrorMessage
    });
  }
}

start();
</script>
