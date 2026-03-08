import { createBackgroundRenderer } from "./background_renderer.js";
import { createEnvironmentRenderer } from "./environment_renderer.js";
import { createGroundRenderer } from "./ground_renderer.js";
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

function getCanvasPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

export async function createScene(canvas, outputs) {

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  const background = createBackgroundRenderer();
  const environment = createEnvironmentRenderer();
  const ground = createGroundRenderer();
  const compass = createCompassRenderer();
  const instruments = createInstruments();

  const kernel = await loadWorldKernel();

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    tick: 0,

    kernel,

    player: {
      x: 540,
      y: 560,
      speed: 2.2
    },

    projection: null,
    region: null,
    encoding: null,

    selection: null,
    destination: null,

    keys: new Set(),

    camera: { x: 0, y: 0 },
    viewportOffset: { x: 0, y: 0 },

    worldBounds: {
      width: 1080,
      height: 640
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

    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(state.dpr, state.dpr);

    updateViewportOffset();
  }

  function updateViewportOffset() {

    const baseX = (state.width - state.worldBounds.width) * 0.5;
    const baseY = (state.height - state.worldBounds.height) * 0.5;

    const followX = state.width * 0.5 - (state.player.x + baseX);
    const followY = state.height * 0.68 - (state.player.y + baseY);

    state.camera.x += (followX - state.camera.x) * 0.08;
    state.camera.y += (followY - state.camera.y) * 0.08;

    state.viewportOffset.x = baseX + state.camera.x;
    state.viewportOffset.y = baseY + state.camera.y;
  }

  function updatePlayer() {

    let dx = 0;
    let dy = 0;

    if (state.keys.has("ArrowLeft") || state.keys.has("a")) dx -= 1;
    if (state.keys.has("ArrowRight") || state.keys.has("d")) dx += 1;
    if (state.keys.has("ArrowUp") || state.keys.has("w")) dy -= 1;
    if (state.keys.has("ArrowDown") || state.keys.has("s")) dy += 1;

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

    state.player.x = Math.max(40, Math.min(1040, state.player.x));
    state.player.y = Math.max(60, Math.min(600, state.player.y));
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

    const radiusSq = 110 * 110;

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

    state.selection = null;
    state.destination = null;

    updateOutputs();
  }

  function drawFrame() {

    ctx.clearRect(0,0,state.width,state.height);

    background.draw(ctx, state.width, state.height, state.tick);

    environment.draw(ctx,{
      width:state.width,
      height:state.height,
      tick:state.tick,
      viewportOffset:state.viewportOffset,
      kernel:state.kernel,
      projection:state.projection,
      selection:state.selection,
      destination:state.destination
    });

    ground.draw(ctx,{
      width:state.width,
      height:state.height,
      tick:state.tick,
      viewportOffset:state.viewportOffset,
      kernel:state.kernel,
      projection:state.projection,
      selection:state.selection,
      destination:state.destination
    });

    compass.draw(ctx,state,{width:state.width,height:state.height});
  }

  function step() {

    state.tick++;

    updatePlayer();
    updateViewportOffset();
    projectState();
    updateOutputs();

    drawFrame();

    requestAnimationFrame(step);
  }

  function onKeyDown(e){ state.keys.add(e.key); }
  function onKeyUp(e){ state.keys.delete(e.key); }

  function onPointerUp(e){
    handleWorldTap(e.clientX,e.clientY);
  }

  resize();
  projectState();
  updateOutputs();

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  canvas.addEventListener("pointerup", onPointerUp);

  return Object.freeze({
    start(){
      requestAnimationFrame(step);
    }
  });
}
