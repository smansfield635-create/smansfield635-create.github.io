import { createBackgroundRenderer } from "./background_renderer.js";
import { createCompassRenderer } from "./compass_renderer.js";
import { createInstruments } from "../assets/instruments.js";
import { loadWorldKernel } from "../world/world_kernel.js";

function distanceSq(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function pointToSegmentDistanceSq(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = abx * abx + aby * aby;

  if (abLenSq === 0) return distanceSq(px, py, ax, ay);

  let t = (apx * abx + apy * aby) / abLenSq;
  t = Math.max(0, Math.min(1, t));

  const cx = ax + abx * t;
  const cy = ay + aby * t;
  return distanceSq(px, py, cx, cy);
}

export async function createScene(canvas, outputs) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");

  const background = createBackgroundRenderer();
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
      x: 180,
      y: 460,
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
    interaction: {
      lastPointerDown: null
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
    updateViewportOffset();
  }

  function updateViewportOffset() {
    const baseX = (state.width - 1080) * 0.5;
    const baseY = (state.height - 640) * 0.5;

    const followX = state.width * 0.5 - (state.player.x + baseX);
    const followY = state.height * 0.62 - (state.player.y + baseY);

    state.camera.x += (followX - state.camera.x) * 0.08;
    state.camera.y += (followY - state.camera.y) * 0.08;

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
      state.player.x += dx * state.player.speed;
      state.player.y += dy * state.player.speed;
    }

    state.player.x = Math.max(60, Math.min(1020, state.player.x));
    state.player.y = Math.max(100, Math.min(560, state.player.y));
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
    const radiusSq = 72 * 72;

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
    const toleranceSq = 30 * 30;

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
    const rect = canvas.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    return {
      x: localX - state.viewportOffset.x,
      y: localY - state.viewportOffset.y
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
      updateOutputs();
      return;
    }

    state.selection = null;
    updateOutputs();
  }

  function drawAmbientMotes(offset) {
    const t = state.tick * 0.02;
    for (let i = 0; i < 7; i += 1) {
      const x = offset.x + 120 + i * 130 + Math.sin(t + i) * 12;
      const y = offset.y + 110 + Math.cos(t * 0.8 + i) * 18;
      const r = 2 + ((i + state.tick) % 3) * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,214,160,0.18)";
      ctx.fill();
    }
  }

  function drawWorld() {
    const regions = [...state.kernel.regionsById.values()];
    const paths = [...state.kernel.pathsById.values()];
    const offset = state.viewportOffset;

    drawAmbientMotes(offset);

    ctx.save();
    ctx.translate(offset.x, offset.y);

    const pulse = 0.5 + 0.5 * Math.sin(state.tick * 0.08);

    for (const path of paths) {
      const isSelected = state.selection?.kind === "path" && state.selection.pathId === path.pathId;
      const isDestinationPath = state.destination && (
        path.fromRegionId === state.region.regionId && path.toRegionId === state.destination.regionId
      );

      ctx.beginPath();
      path.centerline.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = isSelected
        ? "rgba(255,236,188,0.92)"
        : isDestinationPath
          ? `rgba(255,220,160,${0.46 + pulse * 0.32})`
          : "rgba(160,190,255,0.22)";
      ctx.lineWidth = isSelected ? 20 : isDestinationPath ? 18 : 16;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      if (isSelected || isDestinationPath) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        for (let i = 0; i < path.centerline.length; i += 1) {
          const [x, y] = path.centerline[i];
          const rr = isSelected ? 5 : 4 + pulse * 2;
          ctx.beginPath();
          ctx.arc(x, y, rr, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,244,220,0.86)";
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (const region of regions) {
      const [x, y] = region.centerPoint;
      const isActive = state.projection?.regionId === region.regionId;
      const isSelected = state.selection?.kind === "region" && state.selection.regionId === region.regionId;
      const isDestination = state.destination?.regionId === region.regionId;

      const ringPulse = isActive ? 6 + pulse * 7 : isDestination ? 4 + pulse * 6 : 0;
      if (ringPulse > 0) {
        ctx.beginPath();
        ctx.arc(x, y, 48 + ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = isActive
          ? `rgba(255,222,168,${0.18 + pulse * 0.22})`
          : `rgba(185,225,255,${0.14 + pulse * 0.18})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, 42, 0, Math.PI * 2);
      ctx.fillStyle = isSelected
        ? "rgba(255,222,168,0.42)"
        : isActive
          ? "rgba(255,212,152,0.36)"
          : "rgba(74,116,168,0.20)";
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.strokeStyle = isSelected
        ? "rgba(255,244,214,0.96)"
        : isActive
          ? "rgba(255,228,184,0.96)"
          : "rgba(210,226,255,0.26)";
      ctx.stroke();

      ctx.fillStyle = "rgba(245,249,255,0.96)";
      ctx.font = "600 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(region.displayName, x, y - 52);
    }

    for (const cell of state.kernel.diamondCellsById.values()) {
      const active = state.projection?.cellId === cell.diamondCellId;
      ctx.beginPath();
      ctx.arc(cell.centerPoint[0], cell.centerPoint[1], active ? 10 + pulse * 1.8 : 7, 0, Math.PI * 2);
      ctx.fillStyle = active ? "rgba(255,236,188,0.96)" : "rgba(220,230,255,0.36)";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,126,86,0.98)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,240,220,0.96)";
    ctx.stroke();

    if (state.destination) {
      ctx.beginPath();
      ctx.arc(state.destination.centerPoint[0], state.destination.centerPoint[1], 16 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,246,220,${0.28 + pulse * 0.24})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, state.width, state.height);
    background.draw(ctx, state.width, state.height, state.tick);
    drawWorld();
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

  function onPointerDown(event) {
    state.interaction.lastPointerDown = {
      x: event.clientX,
      y: event.clientY
    };
  }

  function onPointerUp(event) {
    handleWorldTap(event.clientX, event.clientY);
  }

  function onClick(event) {
    handleWorldTap(event.clientX, event.clientY);
  }

  function onTouchEnd(event) {
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    handleWorldTap(touch.clientX, touch.clientY);
    event.preventDefault();
  }

  resize();
  projectState();
  updateOutputs();

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("touchend", onTouchEnd, { passive: false });

  return Object.freeze({
    start() {
      requestAnimationFrame(step);
    }
  });
}
