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

function drawLabel(ctx, text, point, projector) {
  const projected = projector.point(point[0], point[1]);
  const scale = projector.scaleAt(point[0], point[1]);

  ctx.save();
  ctx.font = `${Math.max(12, Math.round(14 * scale))}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,246,228,0.92)";
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 6;
  ctx.fillText(text, projected.x, projected.y);
  ctx.restore();
}

function drawVillageCluster(ctx, marker, projector) {
  const center = projector.point(marker.point[0], marker.point[1]);
  const scale = projector.scaleAt(marker.point[0], marker.point[1]);
  const base = Math.max(9, 12 * scale);

  ctx.save();
  ctx.translate(center.x, center.y);

  ctx.fillStyle = "rgba(255,235,206,0.30)";
  ctx.beginPath();
  ctx.arc(0, 0, base * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(248,220,170,0.60)";
  ctx.lineWidth = Math.max(1.2, base * 0.09);
  ctx.beginPath();
  ctx.arc(0, 0, base * 1.45, 0, Math.PI * 2);
  ctx.stroke();

  const blocks = [
    { x: -base * 1.22, y: -base * 0.44, w: base * 0.96, h: base * 0.74, c: "#dfb37b" },
    { x: -base * 0.06, y: -base * 0.66, w: base * 1.16, h: base * 0.90, c: "#d4945a" },
    { x: base * 1.02, y: -base * 0.24, w: base * 0.82, h: base * 0.68, c: "#c98753" }
  ];

  for (const block of blocks) {
    ctx.fillStyle = block.c;
    ctx.fillRect(block.x, block.y, block.w, block.h);
  }

  ctx.fillStyle = "#f7cb85";
  ctx.beginPath();
  ctx.arc(0, 0, base * 0.48, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function createGroundRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const terrain = Array.isArray(snapshot.kernel.terrainPolygons) ? snapshot.kernel.terrainPolygons : [];
      const substrate = Array.isArray(snapshot.kernel.substratePolygons) ? snapshot.kernel.substratePolygons : [];
      const coastlines = Array.isArray(snapshot.kernel.coastlines) ? snapshot.kernel.coastlines : [];
      const regions = Array.isArray(snapshot.kernel.regions) ? snapshot.kernel.regions : [];
      const markers = Array.isArray(snapshot.kernel.markers) ? snapshot.kernel.markers : [];

      const peninsula = terrain[0] ?? null;
      const inlandRise = substrate[0] ?? terrain[1] ?? null;
      const explorationRegion = regions.find((row) => row.id === "exploration_basin") ?? null;
      const exploration = explorationRegion?.polygon ?? terrain[2] ?? null;
      const village = markers.find((row) => row.id === "harbor_village_anchor") ?? null;

      if (exploration) {
        drawPolygonPath(ctx, exploration, projector);
        ctx.fillStyle = "rgba(226,236,214,0.24)";
        ctx.fill();

        drawPolygonPath(ctx, exploration, projector);
        ctx.strokeStyle = "rgba(252,248,224,0.14)";
        ctx.lineWidth = projector.lineWidth(1.7, centroid(exploration)[1]);
        ctx.stroke();
      }

      if (inlandRise) {
        drawPolygonPath(ctx, inlandRise, projector);
        ctx.fillStyle = "rgba(212,206,188,0.42)";
        ctx.fill();

        drawPolygonPath(ctx, inlandRise, projector);
        ctx.strokeStyle = "rgba(255,238,202,0.22)";
        ctx.lineWidth = projector.lineWidth(2.0, centroid(inlandRise)[1]);
        ctx.stroke();
      }

      if (peninsula) {
        drawPolygonPath(ctx, peninsula, projector);
        ctx.fillStyle = "#efca8e";
        ctx.fill();

        drawPolygonPath(ctx, peninsula, projector);
        ctx.strokeStyle = "rgba(255,238,194,0.74)";
        ctx.lineWidth = projector.lineWidth(2.4, centroid(peninsula)[1]);
        ctx.stroke();

        drawPolygonPath(ctx, peninsula, projector);
        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.lineWidth = projector.lineWidth(5.0, centroid(peninsula)[1]);
        ctx.stroke();
      }

      for (const coastline of coastlines) {
        drawPolygonPath(ctx, coastline, projector);
        ctx.strokeStyle = "rgba(255,247,220,0.90)";
        ctx.lineWidth = projector.lineWidth(1.7, centroid(coastline)[1]);
        ctx.stroke();
      }

      if (village) {
        drawVillageCluster(ctx, village, projector);
        drawLabel(ctx, "Harbor Village", [village.point[0] + 0.02, village.point[1] - 0.03], projector);
      }

      if (explorationRegion) {
        drawLabel(ctx, "Exploration Basin", [explorationRegion.center[0] + 0.08, explorationRegion.center[1] - 0.02], projector);
      }
    }
  };
}
