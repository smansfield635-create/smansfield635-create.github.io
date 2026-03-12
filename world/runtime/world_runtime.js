import { createBackgroundRenderer } from "../../assets/openworld_background_renderer.js";
import { createEnvironmentRenderer } from "../../variant/environment_renderer.js";
import { createGroundRenderer } from "../../variant/ground_renderer.js";
import { createCompassRenderer } from "../../assets/openworld_compass_renderer.js";
import { createInstruments } from "../../assets/instruments.js";
import { loadWorldKernel } from "../world_kernel.js";
import { createPlanetGeometryEngine } from "../planet_geometry.js";
import { createWorldPhaseEngine } from "../../variant/world_phase_engine.js";

function distanceSq(ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  return (dx * dx) + (dy * dy);
}

function pointToSegmentDistanceSq(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = (abx * abx) + (aby * aby);

  if (abLenSq === 0) return distanceSq(px, py, ax, ay);

  let t = ((apx * abx) + (apy * aby)) / abLenSq;
  t = Math.max(0, Math.min(1, t));

  const cx = ax + (abx * t);
  const cy = ay + (aby * t);
  return distanceSq(px, py, cx, cy);
}

function getCanvasPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function sub3(a, b) {
  return [
    (a?.[0] ?? 0) - (b?.[0] ?? 0),
    (a?.[1] ?? 0) - (b?.[1] ?? 0),
    (a?.[2] ?? 0) - (b?.[2] ?? 0)
  ];
}

function length3(v) {
  return Math.hypot(v?.[0] ?? 0, v?.[1] ?? 0, v?.[2] ?? 0);
}

function getPhasePanelString(phase) {
  const globalPhase = typeof phase?.globalPhase === "string" ? phase.globalPhase : "CALM";
  const intensity = Number.isFinite(phase?.intensity) ? phase.intensity.toFixed(2) : "0.20";
  const cyclePosition = Number.isFinite(phase?.cyclePosition) ? String(phase.cyclePosition) : "0";
  const nextShiftTick = Number.isFinite(phase?.nextShiftTick) ? String(Math.round(phase.nextShiftTick)) : "0";

  return `${globalPhase} · I:${intensity} · C:${cyclePosition} · N:${nextShiftTick}`;
}

export async function createScene(canvas, outputs) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");

  const background = createBackgroundRenderer();
  const environment = createEnvironmentRenderer();
  const ground = createGroundRenderer();
  const compass = createCompassRenderer();
  const instruments = createInstruments();

  const worldBounds = Object.freeze({
    width: 1180,
    height: 1240
  });

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    tick: 0,
    kernel: await loadWorldKernel(),
    phase: {
      globalPhase: "CALM",
      intensity: 0.2,
      cyclePosition: 0,
      nextShiftTick: 0
    },
    phaseEngine: createWorldPhaseEngine(12345),
    planetGeometryEngine: createPlanetGeometryEngine({
      worldBounds,
      planetRadius: 1600,
      atmosphereThickness: 140,
      waterOffset: -18,
      longitudeSpanDeg: 84,
      latitudeSpanDeg: 62,
      longitudeCenterDeg: 0,
      latitudeCenterDeg: 0,
      defaultCameraAltitude: 260,
      defaultCameraHeadingDeg: -28
    }),
    planetaryGeometry: null,
    atmosphericLimbState: null,
    keys: new Set(),
    renderMode: "styled",

    player: {
      x: 544,
      y: 770,
      speed: 2.05,
      mode: "FOOT"
    },

    projection: null,
    region: null,
    encoding: null,
    selection: null,
    destination: null,

    camera: { x: 0, y: 0 },
    viewportOffset: { x: 0, y: 0 },

    renderScale: 1.72,

    worldBounds,

    touch: {
      activeId: null,
      startClientX: 0,
      startClientY: 0,
      lastClientX: 0,
      lastClientY: 0,
      moved: false
    }
  };

  function detectDockTransfer() {
    const harborGraph = state.kernel.harborNavigationGraph;
    if (!harborGraph) return;

    const nodes = [...harborGraph.navigationNodesById.values()];

    for (const node of nodes) {
      if (node.nodeClass !== "mooring") continue;

      const dx = state.player.x - node.centerPoint[0];
      const dy = state.player.y - node.centerPoint[1];
      const distSq = (dx * dx) + (dy * dy);

      if (distSq < 40 * 40) {
        state.player.mode = state.player.mode === "FOOT" ? "BOAT" : "FOOT";
      }
    }
  }

  function getWorldViewportOffset() {
    return {
      x: state.viewportOffset.x / state.renderScale,
      y: state.viewportOffset.y / state.renderScale
    };
  }

  function resize() {
    state.dpr = Math.max(1, window.devicePixelRatio || 1);
    state.width = window.innerWidth;
    state.height = window.innerHeight;

    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);

    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(state.dpr, state.dpr);

    updateViewportOffset(true);
  }

  function updateViewportOffset(forceSnap = false) {
    const scaledWorldWidth = state.worldBounds.width * state.renderScale;
    const scaledWorldHeight = state.worldBounds.height * state.renderScale;

    const baseX = (state.width - scaledWorldWidth) * 0.5;
    const baseY = (state.height - scaledWorldHeight) * 0.5;

    const targetScreenX = state.width * 0.50;
    const targetScreenY = state.height * 0.88;

    const northProgress = clamp((930 - state.player.y) / 930, 0, 1);

    const dynamicForwardBiasY = (160 + (northProgress * 54)) * state.renderScale;
    const dynamicForwardBiasX = (northProgress * 10) * state.renderScale;

    const followX = targetScreenX - ((state.player.x * state.renderScale) + baseX + dynamicForwardBiasX);
    const followY = targetScreenY - ((state.player.y * state.renderScale) + baseY + dynamicForwardBiasY);

    const lerpX = forceSnap ? 1 : 0.11;
    const lerpY = forceSnap ? 1 : 0.09;

    state.camera.x = lerp(state.camera.x, followX, lerpX);
    state.camera.y = lerp(state.camera.y, followY, lerpY);

    state.viewportOffset.x = baseX + state.camera.x;
    state.viewportOffset.y = baseY + state.camera.y;
  }

  function updatePlayer() {
    let dx = 0;
    let dy = 0;

    if (state.keys.has("ArrowLeft") || state.keys.has("a") || state.keys.has("A")) dx -= 1;
    if (state.keys.has("ArrowRight") || state.keys.has("d") || state.keys.has("D")) dx += 1;
    if (state.keys.has("ArrowUp") || state.keys.has("w") || state.keys.has("W")) dy -= 1;
    if (state.keys.has("ArrowDown") || state.keys.has("s") || state.keys.has("S")) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy) || 1;
      dx /= length;
      dy /= length;

      state.player.x += dx * state.player.speed;
      state.player.y += dy * state.player.speed;
    }

    state.player.x = clamp(state.player.x, 150, 960);
    state.player.y = clamp(state.player.y, 54, 1140);
  }

  function projectState() {
    state.projection = state.kernel.helpers.projectWorldPositionToCell({
      x: state.player.x,
      y: state.player.y,
      previousCellId: state.projection?.cellId ?? null
    });

    state.region = state.kernel.helpers.getRegion(state.projection.regionId);
    state.encoding = state.kernel.helpers.getEncoding(state.projection.stateEncodingId);
  }

  function updatePhase() {
    const phaseRuntime = {
      tick: state.tick,
      projection: state.projection,
      region: state.region,
      kernel: state.kernel,
      phase: state.phase
    };

    state.phaseEngine.update(phaseRuntime);

    state.phase = {
      globalPhase: typeof phaseRuntime.phase?.globalPhase === "string"
        ? phaseRuntime.phase.globalPhase
        : "CALM",
      intensity: Number.isFinite(phaseRuntime.phase?.intensity)
        ? phaseRuntime.phase.intensity
        : 0.2,
      cyclePosition: Number.isFinite(phaseRuntime.phase?.cyclePosition)
        ? phaseRuntime.phase.cyclePosition
        : 0,
      nextShiftTick: Number.isFinite(phaseRuntime.phase?.nextShiftTick)
        ? phaseRuntime.phase.nextShiftTick
        : 0
    };
  }

  function updatePlanetaryGeometry() {
    const eastProgress = clamp((state.player.x - 150) / (960 - 150), 0, 1);
    const northProgress = clamp((930 - state.player.y) / 930, 0, 1);

    const headingDeg = lerp(-36, 20, eastProgress);
    const altitude = lerp(300, 238, northProgress);

    const cameraInput = {
      worldPoint: {
        x: state.player.x,
        y: state.player.y
      },
      altitude,
      headingDeg
    };

    const planetaryGeometry = state.planetGeometryEngine.getPlanetaryGeometry(cameraInput);
    const camera = state.planetGeometryEngine.createCamera(cameraInput);
    const cameraRadialVector = sub3(camera.cameraPosition, planetaryGeometry.planetCenter);
    const cameraDistanceFromCenter = length3(cameraRadialVector);
    const limbVisibilityActive = cameraDistanceFromCenter > planetaryGeometry.planetRadius;

    state.planetaryGeometry = planetaryGeometry;
    state.atmosphericLimbState = Object.freeze({
      cameraRadialVector,
      cameraDistanceFromCenter,
      cameraLocalUp: camera.cameraLocalUp,
      horizonAngle: planetaryGeometry.horizonAngle,
      visibleLimbDirection: planetaryGeometry.visibleLimbDirection,
      limbVisibilityActive,
      atmosphereEdgeStrength: clamp(
        (cameraDistanceFromCenter - planetaryGeometry.planetRadius) /
          Math.max(1, planetaryGeometry.atmosphereThickness),
        0,
        1
      )
    });
  }

  function updateOutputs() {
    const runtimePanel = instruments.buildRuntimePanel(state);

    outputs.region.textContent = runtimePanel.region;
    outputs.cell.textContent = runtimePanel.cell;
    outputs.sector.textContent = runtimePanel.sector;
    outputs.band.textContent = runtimePanel.band;

    outputs.encoding.textContent =
      `${runtimePanel.encoding} · ${state.player.mode} · ${getPhasePanelString(state.phase)}`;

    outputs.byte.textContent = runtimePanel.byte;

    const selectionPanel = instruments.buildSelectionPanel(state);

    outputs.selectedName.textContent = selectionPanel.selectedName;
    outputs.selectedType.textContent = selectionPanel.selectedType;
    outputs.destination.textContent = selectionPanel.destination;

    outputs.selectionHint.textContent =
      `${selectionPanel.hint} · Mode: ${state.player.mode} · View: ${state.renderMode.toUpperCase()} · Phase: ${state.phase.globalPhase} · Press G to toggle`;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, state.width, state.height);

    const runtime = {
      width: state.width,
      height: state.height,
      tick: state.tick,
      kernel: state.kernel,
      phase: state.phase,
      renderMode: state.renderMode,
      viewportOffset: state.viewportOffset,
      worldViewportOffset: getWorldViewportOffset(),
      projection: state.projection,
      region: state.region,
      encoding: state.encoding,
      selection: state.selection,
      destination: state.destination,
      player: state.player,
      planetaryGeometry: state.planetaryGeometry,
      atmosphericLimbState: state.atmosphericLimbState,
      activeHarborInstanceId:
        state.kernel.helpers.getHarborInstanceByRegion(state.projection?.regionId ?? "")?.harborInstanceId ?? null
    };

    background.draw(ctx, runtime);
    environment.draw(ctx, runtime);
    ground.draw(ctx, runtime);
    compass.draw(ctx, runtime);
  }

  function step() {
    state.tick += 1;

    updatePlayer();
    detectDockTransfer();
    updateViewportOffset();
    projectState();
    updatePhase();
    updatePlanetaryGeometry();
    updateOutputs();
    drawFrame();

    requestAnimationFrame(step);
  }

  resize();
  projectState();
  updatePhase();
  updatePlanetaryGeometry();
  updateOutputs();

  window.addEventListener("resize", resize, { passive: true });

  return Object.freeze({
    start() {
      requestAnimationFrame(step);
    }
  });
}
