import { createBackgroundRenderer } from "./background_renderer.js";
import { createCompassRenderer } from "./compass_renderer.js";
import { createInstruments } from "../assets/instruments.js";
import { loadWorldKernel } from "../world/world_kernel.js";

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
    encoding: null
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
    const panel = instruments.buildRuntimePanel(state);
    outputs.region.textContent = panel.region;
    outputs.cell.textContent = panel.cell;
    outputs.sector.textContent = panel.sector;
    outputs.band.textContent = panel.band;
    outputs.encoding.textContent = panel.encoding;
    outputs.byte.textContent = panel.byte;
  }

  function drawWorld() {
    const regions = [...state.kernel.regionsById.values()];
    const paths = [...state.kernel.pathsById.values()];
    const offsetX = (state.width - 1080) * 0.5;
    const offsetY = (state.height - 640) * 0.5;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    ctx.strokeStyle = "rgba(160,190,255,0.22)";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const path of paths) {
      ctx.beginPath();
      path.centerline.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    for (const region of regions) {
      const [x, y] = region.centerPoint;
      const isActive = state.projection?.regionId === region.regionId;

      ctx.beginPath();
      ctx.arc(x, y, 42, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? "rgba(255,212,152,0.36)" : "rgba(74,116,168,0.20)";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isActive ? "rgba(255,228,184,0.96)" : "rgba(210,226,255,0.26)";
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
      ctx.arc(cell.centerPoint[0], cell.centerPoint[1], active ? 10 : 7, 0, Math.PI * 2);
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

  resize();
  projectState();
  updateOutputs();

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return Object.freeze({
    start() {
      requestAnimationFrame(step);
    }
  });
}
