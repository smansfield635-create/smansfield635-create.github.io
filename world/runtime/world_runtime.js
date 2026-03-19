// DESTINATION FILE: /world/runtime/world_runtime.js

import { createPlanetEngine } from "../planet_engine.js";
import { createRenderer } from "../render.js";
import { createControlSystem } from "../control.js";
import { createInstruments } from "/assets/instruments.js";

const MOTION_STORAGE_KEY = "ns_home_round_motion_v14";
const RUNTIME_STORAGE_KEY = "cte_runtime_v3";
const MARKER_PADDING = 18;
const MARKER_PASSES = 3;
const ORBIT_SPEED_ROUND = 0.00018;
const ORBIT_SPEED_OBSERVE = 0.00010;

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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeObject(value) {
  return value && typeof value === "object" ? value : {};
}

function getModeFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  return mode === "flat" || mode === "observe" ? mode : "round";
}

function buildModeHref(nextMode) {
  const q = new URLSearchParams(window.location.search);
  q.set("mode", nextMode);
  return `${window.location.pathname}?${q.toString()}`;
}

function withModeQuery(route, currentMode) {
  const glue = route.includes("?") ? "&" : "?";
  return `${route}${glue}mode=${currentMode}`;
}

function getRequiredNode(id) {
  const node = document.getElementById(id);
  if (!node) {
    throw new Error(`Missing required node: #${id}`);
  }
  return node;
}

function getOptionalNode(id) {
  return document.getElementById(id);
}

function getOverlayMap() {
  return Object.freeze({
    "north-products": getOptionalNode("marker-north"),
    "east-gauges": getOptionalNode("marker-east"),
    "south-laws": getOptionalNode("marker-south"),
    "west-explore": getOptionalNode("marker-west")
  });
}

function createAuthorityReceiptWriter() {
  const receipt = {
    shellSource: "/index.html",
    runtimeSource: "/world/runtime/world_runtime.js",
    truthSource: "/world/world_kernel.js",
    structureSource: "/world/planet_engine.js",
    projectionOwner: "/world/planet_surface_projector.js",
    renderSource: "/world/render.js",
    controlSource: "/world/control.js",
    inputOwner: "/world/control.js",
    orbitSource: "/world/planet_surface_projector.js",
    instrumentSource: "/assets/instruments.js",
    transitionSource: "—",
    receiptWriter: "/world/runtime/world_runtime.js",
    duplicateRuntime: false,
    duplicateRender: false,
    duplicateInput: false,
    duplicateProjection: false
  };

  function publish(patch = {}) {
    Object.assign(receipt, patch);
    window.__AUTHORITY_RECEIPT__ = Object.freeze({ ...receipt });
    return window.__AUTHORITY_RECEIPT__;
  }

  publish();
  return Object.freeze({
    publish
  });
}

export function createWorldRuntime() {
  const state = {
    currentMode: getModeFromLocation(),
    planetEngine: null,
    renderer: null,
    control: null,
    instruments: null,
    canvas: null,
    ctx: null,
    appShell: null,
    runtimeRoot: null,
    flatLayer: null,
    universeLayer: null,
    atmosphereLayer: null,
    heroLayer: null,
    heroPanel: null,
    orbitalOverlay: null,
    diagnosticsShell: null,
    diagnosticsSummary: null,
    diagnosticsToggle: null,
    debugPanel: null,
    bootStatus: null,
    bootStatusCopy: null,
    modeCluster: null,
    homePill: null,
    btnFlat: null,
    btnRound: null,
    btnObserve: null,
    overlayMap: null,
    authorityReceipt: null,
    planetField: null,
    rafId: 0,
    lastFrameAt: performance.now(),
    diagnosticsMode: "peek",
    isDragging: false,
    lastX: 0,
    lastY: 0,
    runtimeReady: false,
    runtimeErrorMessage: "",
    lastCurrentSample: null,
    lastRenderReceipt: Object.freeze({
      orbitalHits: Object.freeze([]),
      orbitalAudit: Object.freeze({
        count: 0,
        frontVisibleCount: 0,
        emittedCount: 0,
        rejectedBackfaceCount: 0,
        rejectedWeakVisibilityCount: 0
      }),
      audit: Object.freeze({})
    }),
    lastProgressionReceipt: Object.freeze({
      progressionDtMs: 0,
      progressionAuthorized: false,
      progressionApplied: false,
      progressionStep: 0,
      progressionPass: false
    }),
    lastEmissionReceipt: Object.freeze({
      emissionOrbitalCount: 0,
      emissionFrontVisible: 0,
      emissionEmitted: 0,
      emissionSuppressed: 0,
      emissionPass: false
    }),
    lastIntakeReceipt: Object.freeze({
      intakeReceived: 0,
      intakeStaged: 0,
      intakeDiscarded: 0,
      intakePass: false,
      stagedHits: Object.freeze([])
    }),
    lastPlacementReceipt: Object.freeze({
      markerRequired: false,
      markerPlacementAdmissible: true,
      markerCollisionCount: 0,
      markerRepositionedCount: 0,
      placementPlaceable: 0,
      placementPlaced: 0,
      placementReservedReject: 0,
      placementViewportReject: 0,
      placementPass: true,
      resolvedHits: Object.freeze([])
    })
  };

  function isFlatMode() {
    return state.currentMode === "flat";
  }

  function isObserveMode() {
    return state.currentMode === "observe";
  }

  function isRoundVisualMode() {
    return state.currentMode === "round" || state.currentMode === "observe";
  }

  function markerModeRequired() {
    return state.currentMode === "round";
  }

  function orbitSpeedForMode() {
    if (state.currentMode === "observe") return ORBIT_SPEED_OBSERVE;
    if (state.currentMode === "round") return ORBIT_SPEED_ROUND;
    return 0;
  }

  function showBootStatus(message) {
    if (!state.bootStatus || !state.bootStatusCopy) return;
    state.bootStatusCopy.textContent = message;
    state.bootStatus.classList.add("is-visible");
  }

  function clearBootStatus() {
    if (!state.bootStatus || !state.bootStatusCopy) return;
    state.bootStatusCopy.textContent = "";
    state.bootStatus.classList.remove("is-visible");
  }

  function emitRuntimeReceipt(patch = {}) {
    const base = {
      page: "/index.html",
      phase: state.runtimeReady ? "RUNNING" : "BOOT",
      mode: state.currentMode,
      bootPass: state.runtimeReady,
      renderPass: state.runtimeReady && !!state.planetField,
      markerPass: !!state.lastPlacementReceipt.markerPlacementAdmissible,
      diagnosticsMode: state.diagnosticsMode,
      timestamp: new Date().toISOString(),
      error: state.runtimeErrorMessage,
      progressionReceipt: state.lastProgressionReceipt,
      emissionReceipt: state.lastEmissionReceipt,
      intakeReceipt: {
        intakeReceived: state.lastIntakeReceipt.intakeReceived,
        intakeStaged: state.lastIntakeReceipt.intakeStaged,
        intakeDiscarded: state.lastIntakeReceipt.intakeDiscarded,
        intakePass: state.lastIntakeReceipt.intakePass
      },
      placementReceipt: {
        markerRequired: state.lastPlacementReceipt.markerRequired,
        markerPlacementAdmissible: state.lastPlacementReceipt.markerPlacementAdmissible,
        markerCollisionCount: state.lastPlacementReceipt.markerCollisionCount,
        markerRepositionedCount: state.lastPlacementReceipt.markerRepositionedCount,
        placementPlaceable: state.lastPlacementReceipt.placementPlaceable,
        placementPlaced: state.lastPlacementReceipt.placementPlaced,
        placementReservedReject: state.lastPlacementReceipt.placementReservedReject,
        placementViewportReject: state.lastPlacementReceipt.placementViewportReject,
        placementPass: state.lastPlacementReceipt.placementPass
      },
      renderAudit: state.lastRenderReceipt?.audit || {},
      orbitalAudit: {
        ...(state.lastRenderReceipt?.orbitalAudit || {}),
        markerRequired: state.lastPlacementReceipt.markerRequired,
        markerPlacementAdmissible: state.lastPlacementReceipt.markerPlacementAdmissible,
        markerCollisionCount: state.lastPlacementReceipt.markerCollisionCount,
        markerRepositionedCount: state.lastPlacementReceipt.markerRepositionedCount
      }
    };

    try {
      localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify({ ...base, ...patch }));
    } catch {
      return;
    }
  }

  function resizeWorld() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    state.canvas.width = width;
    state.canvas.height = height;
    state.control.resize(width, height);
  }

  function buildPlanetFieldOnce() {
    if (!state.planetField) {
      state.planetField = state.planetEngine.buildPlanetField({});
    }
  }

  function restoreMotionState() {
    if (!isRoundVisualMode()) return;
    try {
      const raw = sessionStorage.getItem(MOTION_STORAGE_KEY);
      if (!raw) return;
      state.control.restoreMotionState(JSON.parse(raw));
    } catch {
      return;
    }
  }

  function persistMotionState() {
    if (!isRoundVisualMode()) return;
    try {
      sessionStorage.setItem(MOTION_STORAGE_KEY, JSON.stringify(state.control.getMotionState()));
    } catch {
      return;
    }
  }

  function safeProjectionSummary() {
    if (typeof state.control.getProjectionSummary === "function") {
      const summary = state.control.getProjectionSummary();
      return summary && typeof summary === "object" ? summary : {};
    }
    return {};
  }

  function safeMotionReceipt(dtMs) {
    const motionState =
      typeof state.control.getMotionState === "function"
        ? state.control.getMotionState()
        : {};
    const orbitalState =
      typeof state.control.getOrbitalState === "function"
        ? state.control.getOrbitalState()
        : {};

    return {
      motionRunning: isRoundVisualMode(),
      rafActive: state.rafId !== 0,
      pageVisible: document.visibilityState === "visible",
      pageRestored: true,
      yawVelocity: Number.isFinite(motionState?.yawVelocity) ? motionState.yawVelocity : null,
      pitchVelocity: Number.isFinite(motionState?.pitchVelocity) ? motionState.pitchVelocity : null,
      orbitVelocity: state.lastProgressionReceipt.progressionApplied ? state.lastProgressionReceipt.progressionStep : null,
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

  function buildProgressionReceipt(dtMs) {
    const progressionAuthorized = state.runtimeReady && isRoundVisualMode();
    const progressionStep = progressionAuthorized ? orbitSpeedForMode() : 0;
    const progressionApplied =
      progressionAuthorized &&
      progressionStep > 0 &&
      typeof state.control.advanceOrbit === "function";

    if (progressionApplied) {
      state.control.advanceOrbit(dtMs, progressionStep);
    }

    state.lastProgressionReceipt = Object.freeze({
      progressionDtMs: Number.isFinite(dtMs) ? dtMs : 0,
      progressionAuthorized,
      progressionApplied,
      progressionStep,
      progressionPass: progressionAuthorized ? progressionApplied : true
    });
  }

  function buildEmissionReceipt(rawHits, orbitalAudit) {
    const emissionOrbitalCount = Number.isFinite(orbitalAudit?.count) ? orbitalAudit.count : 0;
    const emissionFrontVisible = Number.isFinite(orbitalAudit?.frontVisibleCount) ? orbitalAudit.frontVisibleCount : 0;
    const emissionEmitted = Number.isFinite(orbitalAudit?.emittedCount)
      ? orbitalAudit.emittedCount
      : (Array.isArray(rawHits) ? rawHits.length : 0);

    state.lastEmissionReceipt = Object.freeze({
      emissionOrbitalCount,
      emissionFrontVisible,
      emissionEmitted,
      emissionSuppressed: Math.max(0, emissionOrbitalCount - emissionEmitted),
      emissionPass: emissionOrbitalCount > 0 && emissionEmitted > 0
    });
  }

  function buildOrbitalHandshake() {
    return Object.freeze({
      ...state.lastProgressionReceipt,
      ...state.lastEmissionReceipt,
      intakeReceived: state.lastIntakeReceipt.intakeReceived,
      intakeStaged: state.lastIntakeReceipt.intakeStaged,
      intakeDiscarded: state.lastIntakeReceipt.intakeDiscarded,
      intakePass: state.lastIntakeReceipt.intakePass,
      placementPlaceable: state.lastPlacementReceipt.placementPlaceable,
      placementPlaced: state.lastPlacementReceipt.placementPlaced,
      placementReservedReject: state.lastPlacementReceipt.placementReservedReject,
      placementViewportReject: state.lastPlacementReceipt.placementViewportReject,
      placementPass: state.lastPlacementReceipt.placementPass
    });
  }

  function buildRuntimePacket(dtMs) {
    const projectionSummary = safeProjectionSummary();
    const currentSample = getAdmissibleSample(state.planetField, projectionSummary);
    const previousSample = state.lastCurrentSample || currentSample;

    const instrument = state.instruments.buildInstrumentReceipt({
      currentSample,
      previousSample,
      tickIndex: 0,
      motionState: safeMotionReceipt(dtMs),
      authorityState: {
        shellSource: "/index.html",
        runtimeSource: "/world/runtime/world_runtime.js",
        truthSource: "/world/world_kernel.js",
        structureSource: "/world/planet_engine.js",
        projectionOwner: "/world/planet_surface_projector.js",
        renderSource: "/world/render.js",
        controlSource: "/world/control.js",
        inputOwner: "/world/control.js",
        orbitSource: "/world/planet_surface_projector.js",
        instrumentSource: "/assets/instruments.js",
        receiptWriter: "/world/runtime/world_runtime.js"
      },
      transitionState: {
        proposed: isFlatMode() ? "FLAT_HOME" : isObserveMode() ? "OBSERVE_HOME" : "ROUND_HOME",
        admissible: true,
        accepted: true,
        blockedReason: "",
        family: "HOME_MODE"
      }
    });

    const runtime = Object.freeze({
      phase: "HOME",
      fps: dtMs > 0 ? 1000 / dtMs : 0,
      dtMs,
      elapsedMs: performance.now(),
      instrument,
      control: {
        projectionSummary,
        motionState: typeof state.control.getMotionState === "function" ? state.control.getMotionState() : {},
        orbitalState: typeof state.control.getOrbitalState === "function" ? state.control.getOrbitalState() : {}
      },
      planetField: state.planetField,
      renderAudit: state.lastRenderReceipt?.audit || {},
      orbitalAudit: {
        ...(state.lastRenderReceipt?.orbitalAudit || {}),
        markerRequired: state.lastPlacementReceipt.markerRequired,
        markerPlacementAdmissible: state.lastPlacementReceipt.markerPlacementAdmissible,
        markerCollisionCount: state.lastPlacementReceipt.markerCollisionCount,
        markerRepositionedCount: state.lastPlacementReceipt.markerRepositionedCount
      },
      orbitalHandshake: buildOrbitalHandshake(),
      progress: {},
      unlocks: {},
      verification: {
        pass: state.runtimeReady && !!state.planetField && state.runtimeErrorMessage === "",
        reasons: state.runtimeErrorMessage ? [state.runtimeErrorMessage] : []
      },
      failure: {
        phase: state.runtimeErrorMessage ? "BOOT" : "",
        message: state.runtimeErrorMessage
      }
    });

    state.lastCurrentSample = currentSample;
    return runtime;
  }

  function updateDiagnostics(runtime) {
    if (!state.diagnosticsSummary || !state.debugPanel) return;

    if (!state.runtimeReady || !runtime) {
      state.diagnosticsSummary.innerHTML = `
        <div class="diagnostic-bar__group">
          <span class="diagnostic-pill"><span class="diagnostic-pill__label">Phase</span><span class="diagnostic-pill__value">BOOT</span></span>
          <span class="diagnostic-pill"><span class="diagnostic-pill__label">Mode</span><span class="diagnostic-pill__value">${state.currentMode.toUpperCase()}</span></span>
          <span class="diagnostic-pill"><span class="diagnostic-pill__label">Runtime</span><span class="diagnostic-pill__value">WAIT</span></span>
        </div>
      `.trim();

      state.debugPanel.innerHTML = `
        <section class="panel-section">
          <h3 class="panel-title">Runtime</h3>
          Canonical runtime spine active. World boot has not completed.
        </section>
      `;
      return;
    }

    state.diagnosticsSummary.innerHTML = state.instruments.renderCompactBarHTML(runtime);
    state.debugPanel.innerHTML = state.instruments.renderPanelHTML(runtime);
  }

  function hideAllMarkers() {
    for (const key of Object.keys(state.overlayMap)) {
      const node = state.overlayMap[key];
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

  function circleIntersectsRect(hit, rect) {
    const nearestX = Math.max(rect.left, Math.min(hit.x, rect.right));
    const nearestY = Math.max(rect.top, Math.min(hit.y, rect.bottom));
    const dx = hit.x - nearestX;
    const dy = hit.y - nearestY;
    return (dx * dx) + (dy * dy) <= (hit.radius * hit.radius);
  }

  function getReservedRects() {
    const rects = [];

    const heroRect = state.heroPanel?.getBoundingClientRect();
    if (heroRect && heroRect.width > 0 && heroRect.height > 0) {
      rects.push({
        left: heroRect.left - 12,
        top: heroRect.top - 8,
        right: heroRect.right + 12,
        bottom: heroRect.bottom + 8
      });
    }

    const modeRect = state.modeCluster?.getBoundingClientRect();
    if (modeRect && modeRect.width > 0 && modeRect.height > 0) {
      rects.push({
        left: modeRect.left - 10,
        top: modeRect.top - 10,
        right: modeRect.right + 10,
        bottom: modeRect.bottom + 10
      });
    }

    const homeRect = state.homePill?.getBoundingClientRect();
    if (homeRect && homeRect.width > 0 && homeRect.height > 0) {
      rects.push({
        left: homeRect.left - 10,
        top: homeRect.top - 10,
        right: homeRect.right + 10,
        bottom: homeRect.bottom + 10
      });
    }

    const diagnosticsRect = state.diagnosticsShell?.getBoundingClientRect();
    if (diagnosticsRect && diagnosticsRect.width > 0 && diagnosticsRect.height > 0) {
      rects.push({
        left: diagnosticsRect.left - 10,
        top: diagnosticsRect.top - 10,
        right: diagnosticsRect.right + 10,
        bottom: diagnosticsRect.bottom + 10
      });
    }

    return rects;
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

  function stageOrbitalCandidates(rawHits, gateAllowed) {
    const received = Array.isArray(rawHits) ? rawHits : [];

    const staged = gateAllowed
      ? received
          .filter((hit) => hit && Number.isFinite(hit.x) && Number.isFinite(hit.y))
          .filter((hit) => hit.frontFacing === true)
          .map((hit) => Object.freeze({
            id: hit.id,
            label: hit.label,
            route: hit.route,
            x: hit.x,
            y: hit.y,
            radius: Number.isFinite(hit.radius) ? hit.radius : 42
          }))
      : [];

    state.lastIntakeReceipt = Object.freeze({
      intakeReceived: received.length,
      intakeStaged: staged.length,
      intakeDiscarded: Math.max(0, received.length - staged.length),
      intakePass: received.length > 0 ? staged.length > 0 : !gateAllowed,
      stagedHits: Object.freeze(staged)
    });
  }

  function solveMarkerPlacement(stagedHits) {
    const required = markerModeRequired();

    if (!required) {
      state.lastPlacementReceipt = Object.freeze({
        markerRequired: false,
        markerPlacementAdmissible: true,
        markerCollisionCount: 0,
        markerRepositionedCount: 0,
        placementPlaceable: 0,
        placementPlaced: 0,
        placementReservedReject: 0,
        placementViewportReject: 0,
        placementPass: true,
        resolvedHits: Object.freeze([])
      });
      return;
    }

    const center = getViewportCenter();
    const reservedRects = getReservedRects();

    const frontHits = stagedHits
      .filter((hit) => Number.isFinite(hit?.x) && Number.isFinite(hit?.y))
      .map((hit) => cloneHit(hit, center))
      .sort((a, b) => a.angle - b.angle);

    if (!frontHits.length) {
      state.lastPlacementReceipt = Object.freeze({
        markerRequired: true,
        markerPlacementAdmissible: false,
        markerCollisionCount: 0,
        markerRepositionedCount: 0,
        placementPlaceable: 0,
        placementPlaced: 0,
        placementReservedReject: 0,
        placementViewportReject: 0,
        placementPass: false,
        resolvedHits: Object.freeze([])
      });
      return;
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

    const finalCollisionCount = countCollisions(frontHits);

    let placementReservedReject = 0;
    let placementViewportReject = 0;

    const placeable = frontHits.filter((hit) => {
      const inViewport =
        hit.x - hit.radius >= 0 &&
        hit.x + hit.radius <= window.innerWidth &&
        hit.y - hit.radius >= 0 &&
        hit.y + hit.radius <= window.innerHeight;

      if (!inViewport) {
        placementViewportReject += 1;
        return false;
      }

      const overlapsReserved = reservedRects.some((rect) => circleIntersectsRect(hit, rect));
      if (overlapsReserved) {
        placementReservedReject += 1;
        return false;
      }

      return true;
    });

    const viewportPass = validateMarkersInViewport(placeable);
    const placementPass = placeable.length > 0 && finalCollisionCount === 0 && viewportPass;

    state.lastPlacementReceipt = Object.freeze({
      markerRequired: true,
      markerPlacementAdmissible: placementPass,
      markerCollisionCount: finalCollisionCount,
      markerRepositionedCount: repositionedCount,
      placementPlaceable: frontHits.length,
      placementPlaced: placeable.length,
      placementReservedReject,
      placementViewportReject,
      placementPass,
      resolvedHits: Object.freeze(placeable.map((hit) => Object.freeze({
        id: hit.id,
        label: hit.label,
        route: hit.route,
        x: hit.x,
        y: hit.y,
        radius: hit.radius
      })))
    });
  }

  function syncOverlayMarkers(runtime) {
    if (!isRoundVisualMode() || isObserveMode()) {
      state.lastIntakeReceipt = Object.freeze({
        intakeReceived: 0,
        intakeStaged: 0,
        intakeDiscarded: 0,
        intakePass: false,
        stagedHits: Object.freeze([])
      });
      state.lastPlacementReceipt = Object.freeze({
        markerRequired: false,
        markerPlacementAdmissible: true,
        markerCollisionCount: 0,
        markerRepositionedCount: 0,
        placementPlaceable: 0,
        placementPlaced: 0,
        placementReservedReject: 0,
        placementViewportReject: 0,
        placementPass: true,
        resolvedHits: Object.freeze([])
      });
      hideAllMarkers();
      return;
    }

    const rawHits = Array.isArray(state.lastRenderReceipt?.orbitalHits)
      ? state.lastRenderReceipt.orbitalHits
      : [];

    const gateAllowed =
      runtime?.instrument?.gate === "PASS" &&
      runtime?.instrument?.world?.stabilityClass !== "COLLAPSE";

    stageOrbitalCandidates(rawHits, gateAllowed);
    solveMarkerPlacement(state.lastIntakeReceipt.stagedHits);

    hideAllMarkers();

    for (const hit of state.lastPlacementReceipt.resolvedHits) {
      const marker = state.overlayMap[hit.id];
      if (!marker) continue;
      marker.hidden = false;
      marker.style.left = `${hit.x}px`;
      marker.style.top = `${hit.y}px`;
    }
  }

  function buildViewState() {
    const cameraState =
      typeof state.control.getCameraState === "function"
        ? state.control.getCameraState()
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
      typeof state.control.getOrbitalState === "function"
        ? state.control.getOrbitalState()
        : {};

    return Object.freeze({
      phase: Number.isFinite(orbitalState?.orbitPhase) ? orbitalState.orbitPhase : 0,
      objects: orbitalSystem.objects,
      altitudeFactor: 0.42
    });
  }

  function renderSurface(dtMs) {
    if (!state.planetField) return;

    state.lastRenderReceipt = state.renderer.renderPlanet({
      ctx: state.ctx,
      planetField: state.planetField,
      projectPoint: (latDeg, lonDeg, radiusOffsetPx = 0) =>
        state.control.projectSphere(latDeg, lonDeg, radiusOffsetPx),
      viewState: buildViewState(),
      orbitalSystem: buildOrbitalConfig()
    });

    buildEmissionReceipt(state.lastRenderReceipt.orbitalHits, state.lastRenderReceipt.orbitalAudit);

    let runtime = buildRuntimePacket(dtMs);
    syncOverlayMarkers(runtime);
    runtime = buildRuntimePacket(dtMs);

    updateDiagnostics(runtime);
    emitRuntimeReceipt({
      phase: "RUNNING",
      renderPass: true,
      markerPass: !!state.lastPlacementReceipt.markerPlacementAdmissible
    });
  }

  function frame(now) {
    const dtMs = now - state.lastFrameAt;
    state.lastFrameAt = now;

    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    if (isRoundVisualMode()) {
      state.control.stepInertia(dtMs);
    }

    buildProgressionReceipt(dtMs);
    renderSurface(dtMs);
    state.rafId = requestAnimationFrame(frame);
  }

  function syncModeButtons() {
    if (state.btnFlat) state.btnFlat.classList.toggle("is-active", state.currentMode === "flat");
    if (state.btnRound) state.btnRound.classList.toggle("is-active", state.currentMode === "round");
    if (state.btnObserve) state.btnObserve.classList.toggle("is-active", state.currentMode === "observe");
  }

  function setModePresentation() {
    document.body.setAttribute("data-mode", state.currentMode);
    syncModeButtons();

    if (state.flatLayer) {
      if (isFlatMode()) {
        state.flatLayer.style.display = "flex";
      } else {
        state.flatLayer.style.display = "none";
      }
    }

    if (isFlatMode()) {
      state.canvas.style.filter = "blur(8px) brightness(.64)";
      if (state.orbitalOverlay) state.orbitalOverlay.style.opacity = "0";
      if (state.universeLayer) state.universeLayer.style.filter = "none";
      if (state.atmosphereLayer) state.atmosphereLayer.style.filter = "none";
      if (state.heroLayer) state.heroLayer.style.transform = "none";
      hideAllMarkers();
    } else if (isObserveMode()) {
      state.canvas.style.filter = "none";
      if (state.orbitalOverlay) state.orbitalOverlay.style.opacity = "0";
      if (state.universeLayer) state.universeLayer.style.filter = "blur(.25px)";
      if (state.atmosphereLayer) state.atmosphereLayer.style.filter = "none";
      if (state.heroLayer) state.heroLayer.style.transform = "translateY(-4px)";
      hideAllMarkers();
    } else {
      state.canvas.style.filter = "none";
      if (state.orbitalOverlay) state.orbitalOverlay.style.opacity = "1";
      if (state.universeLayer) state.universeLayer.style.filter = "none";
      if (state.atmosphereLayer) state.atmosphereLayer.style.filter = "none";
      if (state.heroLayer) state.heroLayer.style.transform = "none";
    }
  }

  function setDiagnosticsMode(nextMode) {
    state.diagnosticsMode = nextMode === "full" ? "full" : "peek";
    document.body.setAttribute("data-diagnostics", state.diagnosticsMode);

    if (state.diagnosticsToggle) {
      state.diagnosticsToggle.textContent =
        state.diagnosticsMode === "full" ? "HIDE DIAGNOSTICS" : "DIAGNOSTICS";
    }

    emitRuntimeReceipt();
  }

  function navigateToMode(nextMode) {
    persistMotionState();
    window.location.href = buildModeHref(nextMode);
  }

  function bindOverlayRoutes() {
    orbitalSystem.objects.forEach((obj) => {
      const marker = state.overlayMap[obj.id];
      if (!marker) return;

      marker.addEventListener("click", () => {
        persistMotionState();
        window.location.href = withModeQuery(obj.route, state.currentMode);
      });
    });
  }

  function bindEvents() {
    if (state.diagnosticsToggle) {
      state.diagnosticsToggle.addEventListener("click", () => {
        setDiagnosticsMode(state.diagnosticsMode === "full" ? "peek" : "full");
        renderSurface(16.7);
      });
    }

    if (state.btnFlat) {
      state.btnFlat.addEventListener("click", () => {
        if (state.currentMode === "flat") return;
        navigateToMode("flat");
      });
    }

    if (state.btnRound) {
      state.btnRound.addEventListener("click", () => {
        if (state.currentMode === "round") return;
        navigateToMode("round");
      });
    }

    if (state.btnObserve) {
      state.btnObserve.addEventListener("click", () => {
        if (state.currentMode === "observe") return;
        navigateToMode("observe");
      });
    }

    if (isRoundVisualMode()) {
      state.canvas.addEventListener("pointerdown", (event) => {
        state.isDragging = true;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
      }, { passive: true });

      window.addEventListener("pointermove", (event) => {
        if (!state.isDragging) return;

        const dx = event.clientX - state.lastX;
        const dy = event.clientY - state.lastY;

        state.lastX = event.clientX;
        state.lastY = event.clientY;

        state.control.applyDrag(dx, dy);
      }, { passive: true });

      window.addEventListener("pointerup", () => {
        state.isDragging = false;
      }, { passive: true });

      window.addEventListener("pointercancel", () => {
        state.isDragging = false;
      }, { passive: true });
    }

    document.querySelectorAll(".flat-card").forEach((card) => {
      card.addEventListener("click", () => {
        const route = card.dataset.route || "/home/";
        persistMotionState();
        window.location.href = withModeQuery(route, state.currentMode);
      });
    });

    window.addEventListener("resize", () => {
      resizeWorld();
      state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
      renderSurface(16.7);
    }, { passive: true });

    window.addEventListener("pagehide", () => {
      persistMotionState();

      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
    }, { passive: true });

    window.addEventListener("pageshow", () => {
      state.currentMode = getModeFromLocation();
      state.control.setPresentationMode(state.currentMode);

      if (isRoundVisualMode()) {
        restoreMotionState();
      }

      setModePresentation();

      if (!state.rafId && isRoundVisualMode()) {
        state.lastFrameAt = performance.now();
        state.rafId = requestAnimationFrame(frame);
      }
    }, { passive: true });
  }

  function bindNodes() {
    state.appShell = getRequiredNode("app-shell");
    state.canvas = getRequiredNode("world-canvas");
    state.ctx = state.canvas.getContext("2d", { alpha: true });
    if (!state.ctx) {
      throw new Error("Canvas 2D context unavailable");
    }

    state.runtimeRoot = getOptionalNode("runtime-root");
    state.flatLayer = getOptionalNode("flat-layer");
    state.universeLayer = getOptionalNode("universe-layer");
    state.atmosphereLayer = getOptionalNode("atmosphere-layer");
    state.heroLayer = getOptionalNode("hero-layer");
    state.heroPanel = getOptionalNode("hero-panel");
    state.orbitalOverlay = getOptionalNode("orbital-overlay");
    state.diagnosticsShell = getOptionalNode("diagnostics-shell");
    state.diagnosticsSummary = getOptionalNode("diagnostics-summary");
    state.diagnosticsToggle = getOptionalNode("diagnostics-toggle");
    state.debugPanel = getOptionalNode("debug-panel");
    state.bootStatus = getOptionalNode("boot-status");
    state.bootStatusCopy = getOptionalNode("boot-status-copy");
    state.modeCluster = getOptionalNode("mode-cluster");
    state.homePill = getOptionalNode("home-pill");
    state.btnFlat = getOptionalNode("btn-flat");
    state.btnRound = getOptionalNode("btn-round");
    state.btnObserve = getOptionalNode("btn-observe");
    state.overlayMap = getOverlayMap();
  }

  function buildSystems() {
    state.planetEngine = createPlanetEngine();
    state.renderer = createRenderer();
    state.control = createControlSystem();
    state.instruments = createInstruments();
  }

  function start() {
    try {
      bindNodes();
      buildSystems();

      state.authorityReceipt = createAuthorityReceiptWriter();
      state.authorityReceipt.publish({
        duplicateRuntime: window.__WORLD_RUNTIME_ACTIVE__ === true
      });

      if (window.__WORLD_RUNTIME_ACTIVE__ === true) {
        throw new Error("Duplicate runtime detected");
      }
      window.__WORLD_RUNTIME_ACTIVE__ = true;

      emitRuntimeReceipt({
        phase: "BOOT_START",
        bootPass: false,
        renderPass: false,
        markerPass: false
      });

      resizeWorld();
      buildPlanetFieldOnce();
      state.control.setPresentationMode(state.currentMode);

      if (isRoundVisualMode()) {
        restoreMotionState();
      }

      bindOverlayRoutes();
      setModePresentation();
      setDiagnosticsMode("peek");
      bindEvents();

      state.runtimeReady = true;
      state.runtimeErrorMessage = "";
      clearBootStatus();

      buildProgressionReceipt(16.7);
      renderSurface(16.7);

      if (isRoundVisualMode() && !state.rafId) {
        state.lastFrameAt = performance.now();
        state.rafId = requestAnimationFrame(frame);
      }

      emitRuntimeReceipt({
        phase: "BOOT_OK",
        bootPass: true,
        renderPass: true,
        markerPass: true
      });
    } catch (error) {
      state.runtimeReady = false;
      state.runtimeErrorMessage = error instanceof Error ? `${error.name}: ${error.message}` : String(error);

      showBootStatus(`World runtime failed to boot.\n\n${state.runtimeErrorMessage}\n\nStatic navigation remains active.`);
      updateDiagnostics(null);
      emitRuntimeReceipt({
        phase: "BOOT_FAIL",
        bootPass: false,
        renderPass: false,
        markerPass: false,
        error: state.runtimeErrorMessage
      });

      if (state.authorityReceipt) {
        state.authorityReceipt.publish({
          duplicateRuntime: /Duplicate runtime/.test(state.runtimeErrorMessage)
        });
      }
    }
  }

  return Object.freeze({
    start
  });
}

const WORLD_RUNTIME = createWorldRuntime();
WORLD_RUNTIME.start();

export default WORLD_RUNTIME;
