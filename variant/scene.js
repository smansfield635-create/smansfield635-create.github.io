import { createBackgroundRenderer } from "../assets/openworld_background_renderer.js";
import { createEnvironmentRenderer } from "./environment_renderer.js";
import { createGroundRenderer } from "./ground_renderer.js";
import { createCompassRenderer } from "../assets/openworld_compass_renderer.js";
import { createInstruments } from "../assets/instruments.js";
import { loadWorldKernel } from "../world/world_kernel.js";
import { createPlanetSurfaceProjector } from "./planet_surface_projector.js";

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

function drawProjectedPolyline(ctx, points, projector) {
  if (!points || points.length < 2) return;

  const first = projector.point(points[0][0], points[0][1]);
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);

  for (let i = 1; i < points.length; i += 1) {
    const p = projector.point(points[i][0], points[i][1]);
    ctx.lineTo(p.x, p.y);
  }
}

function getSharedSurfaceProjector(renderState) {
  return renderState.surfaceProjector ?? createPlanetSurfaceProjector(renderState);
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
    renderMode: "styled",
    traversalMode: "foot",
    activeHarborInstanceId: null,
    player: {
      x: 544,
      y: 770,
      speed: 2.05
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
    renderScale: 1.72,
    worldBounds: {
      width: 1180,
      height: 1240
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

  function getWorldViewportOffset() {
    return {
      x: state.viewportOffset.x / state.renderScale,
      y: state.viewportOffset.y / state.renderScale
    };
  }

  function getHarborInstances() {
    return state.kernel.helpers.getHarborInstances?.() ?? [];
  }

  function getHarborInstance(harborInstanceId) {
    return state.kernel.helpers.getHarborInstance?.(harborInstanceId) ?? null;
  }

  function getHarborInstanceForRegion(regionId) {
    if (!regionId) return null;

    const direct = state.kernel.helpers.getHarborInstanceByRegion?.(regionId) ?? null;
    if (direct) return direct;

    for (const instance of getHarborInstances()) {
      if (instance.marketLinkRegionId === regionId) return instance;

      const transfers = instance.transferRules?.dockTransfers ?? [];
      for (const transfer of transfers) {
        if (transfer.landRegionId === regionId) return instance;
      }
    }

    return null;
  }

  function getActiveHarborInstance() {
    if (state.activeHarborInstanceId) {
      const active = getHarborInstance(state.activeHarborInstanceId);
      if (active) return active;
    }

    return getHarborInstanceForRegion(state.region?.regionId ?? null);
  }

  function getDockTransfersForInstance(instance) {
    if (!instance) return [];
    return state.kernel.helpers.getHarborDockTransfers?.(instance.harborInstanceId) ?? [];
  }

  function getHarborNavNode(navNodeId) {
    return state.kernel.helpers.getHarborNavNode?.(navNodeId) ?? null;
  }

  function getHarborNavNeighbors(navNodeId) {
    return state.kernel.helpers.getHarborNavNeighbors?.(navNodeId) ?? [];
  }

  function getCurrentBoatNodeId() {
    if (state.selection?.kind === "harbor_nav_node") return state.selection.navNodeId;
    if (state.selection?.kind === "dock_transfer") return state.selection.dockId;
    if (state.destination?.kind === "harbor_nav_node") return state.destination.navNodeId;
    if (state.destination?.kind === "dock_transfer") return state.destination.dockId;
    return null;
  }

  function isBoatNodeAllowed(instance, navNodeId) {
    if (!instance || !navNodeId) return false;

    const transfers = getDockTransfersForInstance(instance);
    for (const transfer of transfers) {
      if (transfer.dockId === navNodeId) return true;
    }

    const node = getHarborNavNode(navNodeId);
    return Boolean(node);
  }

  function canTravelBetweenBoatNodes(fromNodeId, toNodeId) {
    if (!fromNodeId || !toNodeId) return false;
    if (fromNodeId === toNodeId) return true;

    const neighbors = getHarborNavNeighbors(fromNodeId);
    return neighbors.some((node) => node?.navNodeId === toNodeId);
  }

  function setSelectionFromCurrentPosition() {
    if (state.traversalMode === "boat") {
      const instance = getActiveHarborInstance();
      if (!instance) return;

      let bestNode = null;
      let bestD2 = Infinity;

      for (const navNode of state.kernel.harborNavigationGraph.navigationNodesById.values()) {
        if (!isBoatNodeAllowed(instance, navNode.navNodeId)) continue;
        const d2 = distanceSq(state.player.x, state.player.y, navNode.centerPoint[0], navNode.centerPoint[1]);
        if (d2 < bestD2) {
          bestD2 = d2;
          bestNode = navNode;
        }
      }

      if (!bestNode) return;

      const transfer = getDockTransfersForInstance(instance).find((row) => row.dockId === bestNode.navNodeId) ?? null;
      if (transfer) {
        state.selection = {
          kind: "dock_transfer",
          dockId: bestNode.navNodeId,
          displayName: bestNode.displayName,
          harborInstanceId: instance.harborInstanceId,
          transferClass: transfer.transferClass
        };
      } else {
        state.selection = {
          kind: "harbor_nav_node",
          navNodeId: bestNode.navNodeId,
          displayName: bestNode.displayName,
          harborInstanceId: instance.harborInstanceId
        };
      }
      return;
    }

    if (state.region) {
      state.selection = {
        kind: "region",
        regionId: state.region.regionId,
        displayName: state.region.displayName
      };
    }
  }

  function resolveArrival(target) {
    if (!target) return;

    if (target.kind === "region") {
      state.selection = {
        kind: "region",
        regionId: target.regionId,
        displayName: target.displayName
      };
      return;
    }

    if (target.kind === "path") {
      state.selection = {
        kind: "path",
        pathId: target.pathId,
        displayName: target.displayName
      };
      return;
    }

    if (target.kind === "harbor_nav_node") {
      state.selection = {
        kind: "harbor_nav_node",
        navNodeId: target.navNodeId,
        displayName: target.displayName,
        harborInstanceId: target.harborInstanceId
      };
      return;
    }

    if (target.kind === "dock_transfer") {
      const transfer = target.transfer;
      if (!transfer) return;

      if (state.traversalMode !== transfer.modeIn) {
        state.selection = {
          kind: "dock_transfer",
          dockId: target.dockId,
          displayName: target.displayName,
          harborInstanceId: target.harborInstanceId,
          transferClass: transfer.transferClass
        };
        return;
      }

      state.traversalMode = transfer.modeOut;
      state.activeHarborInstanceId = target.harborInstanceId ?? state.activeHarborInstanceId ?? null;

      if (transfer.modeOut === "foot") {
        const landRegion = state.kernel.helpers.getRegion(transfer.landRegionId);
        if (landRegion) {
          state.player.x = landRegion.centerPoint[0];
          state.player.y = landRegion.centerPoint[1];
          state.selection = {
            kind: "region",
            regionId: landRegion.regionId,
            displayName: landRegion.displayName
          };
        }
      } else {
        state.selection = {
          kind: "dock_transfer",
          dockId: target.dockId,
          displayName: target.displayName,
          harborInstanceId: target.harborInstanceId,
          transferClass: transfer.transferClass
        };
      }
    }
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

    const followX = targetScreenX - ((state.player.x * state.renderScale) + baseX);
    const followY = targetScreenY - ((state.player.y * state.renderScale) + baseY);

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

    if (state.traversalMode === "foot") {
      if (state.keys.has("ArrowLeft") || state.keys.has("a") || state.keys.has("A")) dx -= 1;
      if (state.keys.has("ArrowRight") || state.keys.has("d") || state.keys.has("D")) dx += 1;
      if (state.keys.has("ArrowUp") || state.keys.has("w") || state.keys.has("W")) dy -= 1;
      if (state.keys.has("ArrowDown") || state.keys.has("s") || state.keys.has("S")) dy += 1;
    }

    if (state.destination) {
      const vx = state.destination.centerPoint[0] - state.player.x;
      const vy = state.destination.centerPoint[1] - state.player.y;
      const len = Math.hypot(vx, vy);

      if (len <= state.player.speed + 1) {
        state.player.x = state.destination.centerPoint[0];
        state.player.y = state.destination.centerPoint[1];
        const arrivedTarget = state.destination;
        state.destination = null;
        resolveArrival(arrivedTarget);
      } else {
        dx += vx / len;
        dy += vy / len;
      }
    }

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy) || 1;
      dx /= length;
      dy /= length;

      const speedMultiplier = state.traversalMode === "boat" ? 1.12 : 1;
      const northProgress = clamp((930 - state.player.y) / 930, 0, 1);
      const uphillFactor = state.traversalMode === "boat"
        ? 1
        : clamp(1 - (northProgress * 0.14), 0.82, 1);
      const lateralDrag = state.traversalMode === "boat"
        ? 1
        : clamp(1 - (Math.abs(dx) * northProgress * 0.06), 0.9, 1);

      state.player.x += dx * state.player.speed * speedMultiplier * uphillFactor * lateralDrag;
      state.player.y += dy * state.player.speed * speedMultiplier * uphillFactor;
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

    if (state.traversalMode === "foot") {
      const instance = getHarborInstanceForRegion(state.region?.regionId ?? null);
      state.activeHarborInstanceId = instance?.harborInstanceId ?? null;
    } else if (!state.activeHarborInstanceId) {
      const instance = getHarborInstanceForRegion(state.region?.regionId ?? null);
      if (instance) state.activeHarborInstanceId = instance.harborInstanceId;
    }
  }

  function updateOutputs() {
    const runtimePanel = instruments.buildRuntimePanel(state);
    outputs.region.textContent = runtimePanel.region;
    outputs.cell.textContent = runtimePanel.cell;
    outputs.sector.textContent = runtimePanel.sector;
    outputs.band.textContent = runtimePanel.band;
    outputs.encoding.textContent = `${runtimePanel.encoding} · ${state.traversalMode.toUpperCase()}`;
    outputs.byte.textContent = runtimePanel.byte;

    const selectionPanel = instruments.buildSelectionPanel(state);

    if (state.selection?.kind === "dock_transfer") {
      selectionPanel.selectedName = state.selection.displayName ?? "Dock Transfer";
      selectionPanel.selectedType = "Dock Transfer";
      selectionPanel.destination = state.destination?.displayName ?? "—";
      selectionPanel.hint = state.traversalMode === "foot"
        ? "Tap dock transfer to board"
        : "Tap dock transfer to disembark";
    }

    if (state.selection?.kind === "harbor_nav_node") {
      selectionPanel.selectedName = state.selection.displayName ?? "Harbor Node";
      selectionPanel.selectedType = "Harbor Nav Node";
      selectionPanel.destination = state.destination?.displayName ?? "—";
      selectionPanel.hint = "Tap adjacent harbor node to move by boat";
    }

    outputs.selectedName.textContent = selectionPanel.selectedName;
    outputs.selectedType.textContent = selectionPanel.selectedType;
    outputs.destination.textContent = selectionPanel.destination;
    outputs.selectionHint.textContent = `${selectionPanel.hint} · Mode: ${state.traversalMode.toUpperCase()} · View: ${state.renderMode.toUpperCase()} · Press G to toggle`;
  }

  function hitTestRegion(worldX, worldY) {
    const regions = [...state.kernel.regionsById.values()];
    let best = null;
    let bestD2 = Infinity;
    const radiusSq = 148 * 148;

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
    const toleranceSq = 64 * 64;

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

  function hitTestHarborInteraction(worldX, worldY) {
    const instance = getActiveHarborInstance();
    if (!instance) return null;

    let best = null;
    let bestD2 = Infinity;

    for (const transfer of getDockTransfersForInstance(instance)) {
      if (transfer.modeIn !== state.traversalMode) continue;

      const navNode = getHarborNavNode(transfer.dockId);
      if (!navNode) continue;

      const d2 = distanceSq(worldX, worldY, navNode.centerPoint[0], navNode.centerPoint[1]);
      if (d2 <= (34 * 34) && d2 < bestD2) {
        best = {
          kind: "dock_transfer",
          dockId: transfer.dockId,
          displayName: navNode.displayName,
          harborInstanceId: instance.harborInstanceId,
          transfer,
          centerPoint: navNode.centerPoint,
          regionId: transfer.landRegionId
        };
        bestD2 = d2;
      }
    }

    if (state.traversalMode === "boat") {
      for (const navNode of state.kernel.harborNavigationGraph.navigationNodesById.values()) {
        if (!isBoatNodeAllowed(instance, navNode.navNodeId)) continue;

        const d2 = distanceSq(worldX, worldY, navNode.centerPoint[0], navNode.centerPoint[1]);
        if (d2 <= (28 * 28) && d2 < bestD2) {
          best = {
            kind: "harbor_nav_node",
            navNodeId: navNode.navNodeId,
            displayName: navNode.displayName,
            harborInstanceId: instance.harborInstanceId,
            centerPoint: navNode.centerPoint
          };
          bestD2 = d2;
        }
      }
    }

    return best;
  }

  function worldPointFromClient(clientX, clientY) {
    const local = getCanvasPoint(canvas, clientX, clientY);
    const worldViewportOffset = getWorldViewportOffset();

    return {
      x: (local.x / state.renderScale) - worldViewportOffset.x,
      y: (local.y / state.renderScale) - worldViewportOffset.y
    };
  }

  function handleWorldTap(clientX, clientY) {
    const worldPoint = worldPointFromClient(clientX, clientY);

    const harborInteraction = hitTestHarborInteraction(worldPoint.x, worldPoint.y);
    if (harborInteraction) {
      if (harborInteraction.kind === "harbor_nav_node") {
        const currentNodeId = getCurrentBoatNodeId();
        if (currentNodeId && !canTravelBetweenBoatNodes(currentNodeId, harborInteraction.navNodeId)) {
          updateOutputs();
          return;
        }
      }

      state.selection = harborInteraction.kind === "dock_transfer"
        ? {
            kind: "dock_transfer",
            dockId: harborInteraction.dockId,
            displayName: harborInteraction.displayName,
            harborInstanceId: harborInteraction.harborInstanceId,
            transferClass: harborInteraction.transfer.transferClass
          }
        : {
            kind: "harbor_nav_node",
            navNodeId: harborInteraction.navNodeId,
            displayName: harborInteraction.displayName,
            harborInstanceId: harborInteraction.harborInstanceId
          };

      state.destination = harborInteraction;
      updateOutputs();
      return;
    }

    if (state.traversalMode === "boat") {
      updateOutputs();
      return;
    }

    const region = hitTestRegion(worldPoint.x, worldPoint.y);
    if (region) {
      state.selection = {
        kind: "region",
        regionId: region.regionId,
        displayName: region.displayName
      };
      state.destination = {
        kind: "region",
        regionId: region.regionId,
        displayName: region.displayName,
        centerPoint: region.centerPoint
      };
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

  function drawRoutesAndMarkers(viewportOffset, renderState) {
    const paths = [...state.kernel.pathsById.values()];
    const regions = [...state.kernel.regionsById.values()];
    const pulse = 0.5 + 0.5 * Math.sin(state.tick * 0.08);
    const px = 1 / state.renderScale;
    const projector = getSharedSurfaceProjector(renderState);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    if (state.traversalMode === "foot") {
      for (const path of paths) {
        const isSelected = state.selection?.kind === "path" && state.selection.pathId === path.pathId;
        const isDestinationPath = state.destination && state.projection && state.destination.kind === "region" && (
          path.fromRegionId === state.projection.regionId && path.toRegionId === state.destination.regionId
        );

        drawProjectedPolyline(ctx, path.centerline, projector);
        ctx.strokeStyle = isSelected
          ? "rgba(255,244,220,0.98)"
          : isDestinationPath
            ? `rgba(255,230,176,${0.34 + pulse * 0.26})`
            : "rgba(246,238,224,0.18)";
        ctx.lineWidth = projector.lineWidth((isSelected ? 7 : isDestinationPath ? 5 : 4) * px, path.centerline[0]?.[1] ?? 700);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    } else {
      for (const edge of state.kernel.harborNavigationGraph.navigationEdgesById.values()) {
        drawProjectedPolyline(ctx, edge.centerline, projector);
        ctx.strokeStyle = "rgba(210,244,255,0.20)";
        ctx.lineWidth = projector.lineWidth(3 * px, edge.centerline[0]?.[1] ?? 700);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    }

    for (const region of regions) {
      const [x, y] = region.centerPoint;
      const p = projector.point(x, y);
      const isActive = state.projection?.regionId === region.regionId;
      const isSelected = state.selection?.kind === "region" && state.selection.regionId === region.regionId;
      const isDestination = state.destination?.kind === "region" && state.destination.regionId === region.regionId;

      if (isActive || isSelected || isDestination) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, projector.radius(46 + (pulse * 4), y), 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? "rgba(255,245,224,0.92)"
          : isActive
            ? "rgba(255,230,186,0.74)"
            : "rgba(218,236,248,0.62)";
        ctx.lineWidth = projector.lineWidth(3 * px, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, projector.radius(9, y), 0, Math.PI * 2);
      ctx.fillStyle = isActive ? "rgba(255,236,188,0.98)" : "rgba(232,240,248,0.72)";
      ctx.fill();

      ctx.fillStyle = "rgba(248,248,244,0.98)";
      ctx.font = `${Math.max(8, projector.radius(14, y) * px)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(region.displayName, p.x, p.y - projector.radius(54, y));
    }

    if (state.traversalMode === "boat") {
      for (const navNode of state.kernel.harborNavigationGraph.navigationNodesById.values()) {
        const isSelected = state.selection?.kind === "harbor_nav_node" && state.selection.navNodeId === navNode.navNodeId;
        const isDestination = state.destination?.kind === "harbor_nav_node" && state.destination.navNodeId === navNode.navNodeId;
        const isDockTransfer = state.selection?.kind === "dock_transfer" && state.selection.dockId === navNode.navNodeId;

        if (isSelected || isDestination || isDockTransfer) {
          const p = projector.point(navNode.centerPoint[0], navNode.centerPoint[1]);
          ctx.beginPath();
          ctx.arc(p.x, p.y, projector.radius(20 + (pulse * 3), navNode.centerPoint[1]), 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(214,248,255,0.72)";
          ctx.lineWidth = projector.lineWidth(2.5 * px, navNode.centerPoint[1]);
          ctx.stroke();
        }
      }
    }

    {
      const p = projector.point(state.player.x, state.player.y);
      ctx.beginPath();
      ctx.ellipse(
        p.x,
        p.y + projector.radius(2, state.player.y),
        projector.radius(11, state.player.y),
        projector.radius(13, state.player.y),
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = state.traversalMode === "boat" ? "rgba(120,220,255,0.98)" : "rgba(255,132,88,0.98)";
      ctx.fill();
      ctx.lineWidth = projector.lineWidth(2 * px, state.player.y);
      ctx.strokeStyle = "rgba(255,242,224,0.98)";
      ctx.stroke();
    }

    if (state.destination) {
      const p = projector.point(state.destination.centerPoint[0], state.destination.centerPoint[1]);
      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        projector.radius(18 + (pulse * 4), state.destination.centerPoint[1]),
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(255,246,220,${0.24 + pulse * 0.22})`;
      ctx.lineWidth = projector.lineWidth(3 * px, state.destination.centerPoint[1]);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, state.width, state.height);
    background.draw(ctx, state.width, state.height, state.tick);

    const worldViewportOffset = getWorldViewportOffset();
    const renderState = {
      width: state.width,
      height: state.height,
      tick: state.tick,
      viewportOffset: worldViewportOffset,
      renderScale: state.renderScale,
      renderMode: state.renderMode,
      traversalMode: state.traversalMode,
      activeHarborInstanceId: state.activeHarborInstanceId,
      kernel: state.kernel,
      projection: state.projection,
      selection: state.selection,
      destination: state.destination,
      player: state.player,
      worldBounds: state.worldBounds
    };

    renderState.surfaceProjector = createPlanetSurfaceProjector(renderState);

    ctx.save();
    ctx.scale(state.renderScale, state.renderScale);

    environment.draw(ctx, renderState);
    ground.draw(ctx, renderState);
    drawRoutesAndMarkers(worldViewportOffset, renderState);

    ctx.restore();

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
    if (event.key === "g" || event.key === "G") {
      state.renderMode = state.renderMode === "styled" ? "truth" : "styled";
      updateOutputs();
      if (typeof event.preventDefault === "function") event.preventDefault();
      return;
    }

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
