import { createBackgroundRenderer } from "../assets/openworld_background_renderer.js";
import { createEnvironmentRenderer } from "./environment_renderer.js";
import { createGroundRenderer } from "./ground_renderer.js";
import { createCompassRenderer } from "../assets/openworld_compass_renderer.js";
import { createInstruments } from "../assets/instruments.js";
import { loadWorldKernel } from "../world/world_kernel.js";

function distanceSq(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
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

export async function createScene(canvas, outputs) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");

  const background = createBackgroundRenderer();
  const environment = createEnvironmentRenderer();
  const ground = createGroundRenderer();
  const compass = createCompassRenderer();
  const instruments = createInstruments();

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    tick: 0,
    kernel: await loadWorldKernel(),
    keys: new Set(),
    player: {
      x: 540,
      y: 626,
      speed: 2.1
    },
    projection: null,
    region: null,
    encoding: null,
    selection: null,
    destination: null,
    camera: {
      x: 0,
      y: 0
    },
    viewportOffset: {
      x: 0,
      y: 0
    },
    worldBounds: {
      width: 1100,
      height: 980
    },
    touch: {
      activeId: null,
      startClientX: 0,
      startClientY: 0,
      lastClientX: 0,
      lastClientY: 0,
      moved: false
    }
  };

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
    const baseX = (state.width - state.worldBounds.width) * 0.5;
    const baseY = (state.height - state.worldBounds.height) * 0.5;

    const forwardBiasX = 0;
    const forwardBiasY = 168;

    const targetScreenX = state.width * 0.50;
    const targetScreenY = state.height * 0.77;

    const followX = targetScreenX - (state.player.x + baseX + forwardBiasX);
    const followY = targetScreenY - (state.player.y + baseY + forwardBiasY);

    const lerpX = forceSnap ? 1 : 0.10;
    const lerpY = forceSnap ? 1 : 0.08;

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

    if (state.destination) {
      const vx = state.destination.centerPoint[0] - state.player.x;
      const vy = state.destination.centerPoint[1] - state.player.y;
      const len = Math.hypot(vx, vy);

      if (len <= state.player.speed + 1) {
        state.player.x = state.destination.centerPoint[0];
        state.player.y = state.destination.centerPoint[1];
        state.destination = null;
      } else {
        dx += vx / len;
        dy += vy / len;
      }
    }

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy) || 1;
      dx /= length;
      dy /= length;

      const slopeFactor = clamp(1 - ((state.player.y - 240) / 1100) * 0.08, 0.88, 1.02);
      state.player.x += dx * state.player.speed * slopeFactor;
      state.player.y += dy * state.player.speed * slopeFactor;
    }

    state.player.x = clamp(state.player.x, 176, 918);
    state.player.y = clamp(state.player.y, 84, 904);
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

  function updateOutputs() {
    const runtimePanel = instruments.buildRuntimePanel(state);
    outputs.region.textContent = runtimePanel.region;
    outputs.cell.textContent = runtimePanel.cell;
    outputs.sector.textContent = runtimePanel.sector;
    outputs.band.textContent = runtimePanel.band;
    outputs.encoding.textContent = runtimePanel.encoding;
    outputs.byte.textContent = runtimePanel.byte;

    const selectionPanel = instruments.buildSelectionPanel(state);
    outputs.selectedName.textContent = selectionPanel.selectedName;
    outputs.selectedType.textContent = selectionPanel.selectedType;
    outputs.destination.textContent = selectionPanel.destination;
    outputs.selectionHint.textContent = selectionPanel.hint;
  }

  function hitTestRegion(worldX, worldY) {
    const regions = [...state.kernel.regionsById.values()];
    let best = null;
    let bestD2 = Infinity;
    const radiusSq = 136 * 136;

    for (const region of regions) {
      const [x, y] = region.centerPoint;
      const d2 = distanceSq(worldX, worldY, x, y);
      if (d2 <= radiusSq && d2 < bestD2) {
        best = region;
        bestD2 = d2;
      }
    }

    return best;
  }

  function hitTestPath(worldX, worldY) {
    const paths = [...state.kernel.pathsById.values()];
    let best = null;
    let bestD2 = Infinity;
    const toleranceSq = 60 * 60;

    for (const path of paths) {
      const pts = path.centerline;
      for (let i = 0; i < pts.length - 1; i += 1) {
        const [ax, ay] = pts[i];
        const [bx, by] = pts[i + 1];
        const d2 = pointToSegmentDistanceSq(worldX, worldY, ax, ay, bx, by);
        if (d2 <= toleranceSq && d2 < bestD2) {
          best = path;
          bestD2 = d2;
        }
      }
    }

    return best;
  }

  function worldPointFromClient(clientX, clientY) {
    const local = getCanvasPoint(canvas, clientX, clientY);
    return {
      x: local.x - state.viewportOffset.x,
      y: local.y - state.viewportOffset.y
    };
  }

  function handleWorldTap(clientX, clientY) {
    const worldPoint = worldPointFromClient(clientX, clientY);

    const region = hitTestRegion(worldPoint.x, worldPoint.y);
    if (region) {
      state.selection = {
        kind: "region",
        regionId: region.regionId,
        displayName: region.displayName
      };
      state.destination = region;
      updateOutputs();
      return;
    }

    const path = hitTestPath(worldPoint.x, worldPoint.y);
    if (path) {
      state.selection = {
        kind: "path",
        pathId: path.pathId,
        displayName: path.displayName
      };
      state.destination = null;
      updateOutputs();
      return;
    }

    state.selection = null;
    state.destination = null;
    updateOutputs();
  }

  function drawRoutesAndMarkers() {
    const paths = [...state.kernel.pathsById.values()];
    const regions = [...state.kernel.regionsById.values()];
    const pulse = 0.5 + 0.5 * Math.sin(state.tick * 0.08);

    ctx.save();
    ctx.translate(state.viewportOffset.x, state.viewportOffset.y);

    for (const path of paths) {
      const isSelected = state.selection?.kind === "path" && state.selection.pathId === path.pathId;
      const isDestinationPath = state.destination && state.projection && (
        path.fromRegionId === state.projection.regionId && path.toRegionId === state.destination.regionId
      );

      ctx.beginPath();
      path.centerline.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = isSelected
        ? "rgba(255,244,220,0.98)"
        : isDestinationPath
          ? `rgba(255,230,176,${0.34 + pulse * 0.26})`
          : "rgba(246,238,224,0.18)";
      ctx.lineWidth = isSelected ? 7 : isDestinationPath ? 5 : 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    for (const region of regions) {
      const [x, y] = region.centerPoint;
      const isActive = state.projection?.regionId === region.regionId;
      const isSelected = state.selection?.kind === "region" && state.selection.regionId === region.regionId;
      const isDestination = state.destination?.regionId === region.regionId;

      if (isActive || isSelected || isDestination) {
        ctx.beginPath();
        ctx.arc(x, y, 46 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? "rgba(255,245,224,0.92)"
          : isActive
            ? "rgba(255,230,186,0.74)"
            : "rgba(218,236,248,0.62)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? "rgba(255,236,188,0.98)" : "rgba(232,240,248,0.72)";
      ctx.fill();

      ctx.fillStyle = "rgba(248,248,244,0.98)";
      ctx.font = "600 14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(region.displayName, x, y - 54);
    }

    ctx.beginPath();
    ctx.ellipse(state.player.x, state.player.y + 2, 11, 13, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,132,88,0.98)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,242,224,0.98)";
    ctx.stroke();

    if (state.destination) {
      ctx.beginPath();
      ctx.arc(state.destination.centerPoint[0], state.destination.centerPoint[1], 18 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,246,220,${0.24 + pulse * 0.22})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, state.width, state.height);
    background.draw(ctx, state.width, state.height, state.tick);

    const renderState = {
      width: state.width,
      height: state.height,
      tick: state.tick,
      viewportOffset: state.viewportOffset,
      kernel: state.kernel,
      projection: state.projection,
      selection: state.selection,
      destination: state.destination,
      player: state.player
    };

    environment.draw(ctx, renderState);
    ground.draw(ctx, renderState);
    drawRoutesAndMarkers();
    compass.draw(ctx, state, { width: state.width, height: state.height });
  }

  function step() {
    state.tick += 1;
    updatePlayer();
    updateViewportOffset();
    projectState();
    updateOutputs();
    drawFrame();
    requestAnimationFrame(step);
  }

  function onKeyDown(event) {
    state.keys.add(event.key);
  }

  function onKeyUp(event) {
    state.keys.delete(event.key);
  }

  function onPointerUp(event) {
    if (event.pointerType === "mouse") {
      handleWorldTap(event.clientX, event.clientY);
      return;
    }

    if (event.pointerType === "touch" || event.pointerType === "pen") {
      handleWorldTap(event.clientX, event.clientY);
      if (typeof event.preventDefault === "function") event.preventDefault();
    }
  }

  function onTouchStart(event) {
    const touch = event.changedTouches?.[0];
    if (!touch) return;

    state.touch.activeId = touch.identifier;
    state.touch.startClientX = touch.clientX;
    state.touch.startClientY = touch.clientY;
    state.touch.lastClientX = touch.clientX;
    state.touch.lastClientY = touch.clientY;
    state.touch.moved = false;

    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  function onTouchMove(event) {
    const touches = [...(event.changedTouches ?? [])];
    const touch = touches.find((item) => item.identifier === state.touch.activeId) ?? touches[0];
    if (!touch) return;

    state.touch.lastClientX = touch.clientX;
    state.touch.lastClientY = touch.clientY;

    const dx = touch.clientX - state.touch.startClientX;
    const dy = touch.clientY - state.touch.startClientY;
    if ((dx * dx) + (dy * dy) > (12 * 12)) {
      state.touch.moved = true;
    }

    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  function onTouchEnd(event) {
    const touches = [...(event.changedTouches ?? [])];
    const touch = touches.find((item) => item.identifier === state.touch.activeId) ?? touches[0];
    if (!touch) return;

    if (!state.touch.moved) {
      handleWorldTap(touch.clientX, touch.clientY);
    }

    state.touch.activeId = null;
    state.touch.moved = false;

    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  function onTouchCancel(event) {
    state.touch.activeId = null;
    state.touch.moved = false;
    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  resize();
  projectState();
  updateOutputs();

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  canvas.addEventListener("pointerup", onPointerUp, { passive: false });
  canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd, { passive: false });
  canvas.addEventListener("touchcancel", onTouchCancel, { passive: false });

  return Object.freeze({
    start() {
      requestAnimationFrame(step);
    }
  });
}
