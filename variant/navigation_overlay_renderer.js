import { createCompassRenderer } from "../assets/openworld_compass_renderer.js";

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

export function createNavigationOverlayRenderer() {
  const compass = createCompassRenderer();

  function drawWorld(ctx, runtime) {
    const {
      kernel,
      tick = 0,
      traversalMode = "foot",
      projection = null,
      selection = null,
      destination = null,
      player = null,
      renderScale = 1,
      surfaceProjector = null
    } = runtime ?? {};

    if (!kernel || !surfaceProjector) {
      throw new Error("navigation_overlay_renderer requires kernel and surfaceProjector");
    }

    const paths = [...(kernel.pathsById?.values?.() ?? [])];
    const regions = [...(kernel.regionsById?.values?.() ?? [])];
    const pulse = 0.5 + (0.5 * Math.sin(tick * 0.08));
    const px = 1 / renderScale;
    const projector = surfaceProjector;

    if (traversalMode === "foot") {
      for (const path of paths) {
        const isSelected =
          selection?.kind === "path" &&
          selection.pathId === path.pathId;

        const isDestinationPath =
          destination &&
          projection &&
          destination.kind === "region" &&
          path.fromRegionId === projection.regionId &&
          path.toRegionId === destination.regionId;

        drawProjectedPolyline(ctx, path.centerline, projector);
        ctx.strokeStyle = isSelected
          ? "rgba(255,244,220,0.98)"
          : isDestinationPath
            ? `rgba(255,230,176,${0.34 + (pulse * 0.26)})`
            : "rgba(246,238,224,0.18)";
        ctx.lineWidth = projector.lineWidth(
          (isSelected ? 7 : isDestinationPath ? 5 : 4) * px,
          path.centerline[0]?.[1] ?? 700
        );
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    } else {
      for (const edge of kernel.harborNavigationGraph?.navigationEdgesById?.values?.() ?? []) {
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
      const isActive = projection?.regionId === region.regionId;
      const isSelected =
        selection?.kind === "region" &&
        selection.regionId === region.regionId;
      const isDestination =
        destination?.kind === "region" &&
        destination.regionId === region.regionId;

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
      ctx.fillStyle = isActive
        ? "rgba(255,236,188,0.98)"
        : "rgba(232,240,248,0.72)";
      ctx.fill();

      ctx.fillStyle = "rgba(248,248,244,0.98)";
      ctx.font = `${Math.max(8, projector.radius(14, y) * px)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(region.displayName, p.x, p.y - projector.radius(54, y));
    }

    if (traversalMode === "boat") {
      for (const navNode of kernel.harborNavigationGraph?.navigationNodesById?.values?.() ?? []) {
        const isSelected =
          selection?.kind === "harbor_nav_node" &&
          selection.navNodeId === navNode.navNodeId;
        const isDestination =
          destination?.kind === "harbor_nav_node" &&
          destination.navNodeId === navNode.navNodeId;
        const isDockTransfer =
          selection?.kind === "dock_transfer" &&
          selection.dockId === navNode.navNodeId;

        if (isSelected || isDestination || isDockTransfer) {
          const p = projector.point(navNode.centerPoint[0], navNode.centerPoint[1]);
          ctx.beginPath();
          ctx.arc(
            p.x,
            p.y,
            projector.radius(20 + (pulse * 3), navNode.centerPoint[1]),
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = "rgba(214,248,255,0.72)";
          ctx.lineWidth = projector.lineWidth(2.5 * px, navNode.centerPoint[1]);
          ctx.stroke();
        }
      }
    }

    if (player) {
      const p = projector.point(player.x, player.y);
      ctx.beginPath();
      ctx.ellipse(
        p.x,
        p.y + projector.radius(2, player.y),
        projector.radius(11, player.y),
        projector.radius(13, player.y),
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = traversalMode === "boat"
        ? "rgba(120,220,255,0.98)"
        : "rgba(255,132,88,0.98)";
      ctx.fill();
      ctx.lineWidth = projector.lineWidth(2 * px, player.y);
      ctx.strokeStyle = "rgba(255,242,224,0.98)";
      ctx.stroke();
    }

    if (destination?.centerPoint) {
      const p = projector.point(destination.centerPoint[0], destination.centerPoint[1]);
      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        projector.radius(18 + (pulse * 4), destination.centerPoint[1]),
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(255,246,220,${0.24 + (pulse * 0.22)})`;
      ctx.lineWidth = projector.lineWidth(3 * px, destination.centerPoint[1]);
      ctx.stroke();
    }
  }

  function drawScreen(ctx, state, viewport) {
    compass.draw(ctx, state, viewport);
  }

  return Object.freeze({
    drawWorld,
    drawScreen
  });
}
