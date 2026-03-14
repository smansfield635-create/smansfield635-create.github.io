function drawPolygonPath(ctx, polygon, projector) {
  const projected = projector.poly(polygon).filter((p) => p.visible);
  if (projected.length < 3) return projected;

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
  if (!projected.visible) return;

  const scale = projector.scaleAt(point[0], point[1]);

  ctx.save();
  ctx.font = `${Math.max(12, Math.round(14 * scale))}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,246,228,0.94)";
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 8;
  ctx.fillText(text, projected.x, projected.y);
  ctx.restore();
}

function drawVillageCluster(ctx, marker, projector) {
  const center = projector.point(marker.point[0], marker.point[1]);
  if (!center.visible) return;

  const scale = projector.scaleAt(marker.point[0], marker.point[1]);
  const base = Math.max(8, 11 * scale);

  ctx.save();
  ctx.translate(center.x, center.y);

  ctx.fillStyle = "rgba(255,235,206,0.18)";
  ctx.beginPath();
  ctx.arc(0, 0, base * 2.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(248,220,170,0.54)";
  ctx.lineWidth = Math.max(1.1, base * 0.08);
  ctx.beginPath();
  ctx.arc(0, 0, base * 1.45, 0, Math.PI * 2);
  ctx.stroke();

  const blocks = [
    { x: -base * 1.12, y: -base * 0.42, w: base * 0.90, h: base * 0.68, c: "#deb27a" },
    { x: -base * 0.02, y: -base * 0.62, w: base * 1.06, h: base * 0.84, c: "#d49359" },
    { x: base * 0.96, y: -base * 0.20, w: base * 0.78, h: base * 0.62, c: "#ca8852" }
  ];

  for (const block of blocks) {
    ctx.fillStyle = block.c;
    ctx.fillRect(block.x, block.y, block.w, block.h);
  }

  ctx.fillStyle = "#f8cb84";
  ctx.beginPath();
  ctx.arc(0, 0, base * 0.44, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function clipGlobe(ctx, projector) {
  const body = projector.body;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
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

      ctx.save();
      clipGlobe(ctx, projector);

      if (exploration) {
        drawPolygonPath(ctx, exploration, projector);
        ctx.fillStyle = "rgba(210,226,194,0.18)";
        ctx.fill();

        drawPolygonPath(ctx, exploration, projector);
        ctx.strokeStyle = "rgba(245,241,214,0.14)";
        ctx.lineWidth = projector.lineWidth(1.4);
        ctx.stroke();
      }

      if (inlandRise) {
        drawPolygonPath(ctx, inlandRise, projector);
        ctx.fillStyle = "rgba(172,182,130,0.28)";
        ctx.fill();

        drawPolygonPath(ctx, inlandRise, projector);
        ctx.strokeStyle = "rgba(255,230,176,0.16)";
        ctx.lineWidth = projector.lineWidth(1.6);
        ctx.stroke();
      }

      if (peninsula) {
        drawPolygonPath(ctx, peninsula, projector);
        ctx.fillStyle = "rgba(120,142,84,0.58)";
        ctx.fill();

        drawPolygonPath(ctx, peninsula, projector);
        ctx.strokeStyle = "rgba(255,209,142,0.86)";
        ctx.lineWidth = projector.lineWidth(1.8);
        ctx.stroke();

        drawPolygonPath(ctx, peninsula, projector);
        ctx.strokeStyle = "rgba(255,248,216,0.10)";
        ctx.lineWidth = projector.lineWidth(4.4);
        ctx.stroke();
      }

      for (const coastline of coastlines) {
        drawPolygonPath(ctx, coastline, projector);
        ctx.strokeStyle = "rgba(255,236,184,0.42)";
        ctx.lineWidth = projector.lineWidth(1.1);
        ctx.stroke();
      }

      ctx.restore();

      if (village) {
        drawVillageCluster(ctx, village, projector);
        drawLabel(ctx, "Harbor Village", [village.point[0] + 0.025, village.point[1] - 0.03], projector);
      }

      if (explorationRegion) {
        drawLabel(ctx, "Exploration Basin", [explorationRegion.center[0] + 0.08, explorationRegion.center[1] - 0.02], projector);
      }
    }
  };
}
