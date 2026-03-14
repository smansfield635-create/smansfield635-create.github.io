function drawPolygonPath(ctx, polygon, projector) {
  const projected = projector.poly(polygon);
  if (!projected.length) return projected;

  ctx.beginPath();
  ctx.moveTo(projected[0].x, projected[0].y);
  for (let i = 1; i < projected.length; i += 1) {
    ctx.lineTo(projected[i].x, projected[i].y);
  }
  ctx.closePath();
  return projected;
}

function centroid(points) {
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  return [x / points.length, y / points.length];
}

function drawLandLayer(ctx, polygon, projector, fillStyle, strokeStyle, lineWidthValue, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  drawPolygonPath(ctx, polygon, projector);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  if (strokeStyle) {
    drawPolygonPath(ctx, polygon, projector);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = projector.lineWidth(lineWidthValue, centroid(polygon)[1]);
    ctx.stroke();
  }
  ctx.restore();
}

function drawVillageCluster(ctx, marker, projector) {
  const center = projector.point(marker.point[0], marker.point[1]);
  const scale = projector.scaleAt(marker.point[0], marker.point[1]);
  const base = Math.max(9, 13 * scale);

  ctx.save();
  ctx.translate(center.x, center.y);

  ctx.fillStyle = "rgba(255,236,210,0.34)";
  ctx.beginPath();
  ctx.arc(0, 0, base * 2.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,223,178,0.62)";
  ctx.lineWidth = Math.max(1.25, base * 0.10);
  ctx.beginPath();
  ctx.arc(0, 0, base * 1.55, 0, Math.PI * 2);
  ctx.stroke();

  const blocks = [
    { x: -base * 1.25, y: -base * 0.48, w: base * 1.00, h: base * 0.78, c: "#e1b277" },
    { x: -base * 0.10, y: -base * 0.72, w: base * 1.18, h: base * 0.92, c: "#d59a5d" },
    { x: base * 1.05, y: -base * 0.28, w: base * 0.86, h: base * 0.70, c: "#c88956" }
  ];

  for (const block of blocks) {
    ctx.fillStyle = block.c;
    ctx.fillRect(block.x, block.y, block.w, block.h);
  }

  ctx.fillStyle = "#f6cc89";
  ctx.beginPath();
  ctx.arc(0, 0, base * 0.52, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLabel(ctx, text, point, projector) {
  const projected = projector.point(point[0], point[1]);
  const scale = projector.scaleAt(point[0], point[1]);

  ctx.save();
  ctx.font = `${Math.max(12, Math.round(15 * scale))}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,247,232,0.90)";
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 8;
  ctx.fillText(text, projected.x, projected.y);
  ctx.restore();
}

export function createGroundRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const terrain = Array.isArray(snapshot.kernel.terrainPolygons) ? snapshot.kernel.terrainPolygons : [];
      const substrate = Array.isArray(snapshot.kernel.substratePolygons) ? snapshot.kernel.substratePolygons : [];
      const coastlines = Array.isArray(snapshot.kernel.coastlines) ? snapshot.kernel.coastlines : [];
      const markers = Array.isArray(snapshot.kernel.markers) ? snapshot.kernel.markers : [];
      const regions = Array.isArray(snapshot.kernel.regions) ? snapshot.kernel.regions : [];

      const peninsula = terrain[0] ?? null;
      const inlandRise = substrate[0] ?? terrain[1] ?? null;
      const exploration = regions.find((row) => row.id === "exploration_basin")?.polygon ?? terrain[2] ?? null;
      const village = markers.find((row) => row.id === "harbor_village_anchor") ?? null;

      if (exploration) {
        drawLandLayer(
          ctx,
          exploration,
          projector,
          "rgba(224,233,214,0.34)",
          "rgba(245,244,220,0.16)",
          1.8,
          0.95
        );
      }

      if (inlandRise) {
        drawLandLayer(
          ctx,
          inlandRise,
          projector,
          "rgba(212,203,185,0.52)",
          "rgba(251,239,204,0.28)",
          2.2,
          1
        );
      }

      if (peninsula) {
        drawLandLayer(
          ctx,
          peninsula,
          projector,
          "#efc98e",
          "rgba(255,233,188,0.72)",
          2.8,
          1
        );
      }

      for (const coastline of coastlines) {
        drawPolygonPath(ctx, coastline, projector);
        ctx.strokeStyle = "rgba(255,242,208,0.82)";
        ctx.lineWidth = projector.lineWidth(2.2, centroid(coastline)[1]);
        ctx.stroke();

        drawPolygonPath(ctx, coastline, projector);
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = projector.lineWidth(5.2, centroid(coastline)[1]);
        ctx.stroke();
      }

      if (village) {
        drawVillageCluster(ctx, village, projector);
        drawLabel(ctx, "Harbor Village", [village.point[0] + 0.03, village.point[1] - 0.045], projector);
      }

      const explorationRegion = regions.find((row) => row.id === "exploration_basin");
      if (explorationRegion) {
        drawLabel(ctx, "Exploration Basin", [explorationRegion.center[0] + 0.08, explorationRegion.center[1] - 0.03], projector);
      }
    }
  };
}
