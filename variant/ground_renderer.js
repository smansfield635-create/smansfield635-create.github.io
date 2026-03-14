function drawPolygon(ctx, polygon, projector) {
  const first = projector.point(polygon[0][0], polygon[0][1]);
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < polygon.length; i += 1) {
    const p = projector.point(polygon[i][0], polygon[i][1]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
}

function drawVillageCluster(ctx, marker, projector) {
  const center = projector.point(marker.point[0], marker.point[1]);
  const base = projector.radius(16);

  ctx.save();
  ctx.translate(center.x, center.y);

  const blocks = [
    { x: -base * 0.9, y: 0, w: base * 0.8, h: base * 0.8 },
    { x: 0, y: -base * 0.15, w: base * 0.95, h: base * 0.95 },
    { x: base * 0.95, y: base * 0.05, w: base * 0.72, h: base * 0.72 }
  ];

  ctx.fillStyle = "#d9c39a";
  for (const block of blocks) {
    ctx.fillRect(block.x, block.y, block.w, block.h);
  }

  ctx.fillStyle = "rgba(255,225,165,0.40)";
  ctx.fillRect(-base * 0.25, -base * 0.55, base * 1.0, base * 0.35);

  ctx.restore();
}

export function createGroundRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const terrain = snapshot.kernel.terrainPolygons;
      const substrate = snapshot.kernel.substratePolygons;
      const coastlines = snapshot.kernel.coastlines;
      const village = snapshot.kernel.markers.find((row) => row.id === "harbor_village_anchor");

      if (terrain[0]) {
        drawPolygon(ctx, terrain[0], projector);
        ctx.fillStyle = "#55764b";
        ctx.fill();
      }

      if (substrate[0]) {
        drawPolygon(ctx, substrate[0], projector);
        ctx.fillStyle = "rgba(70,95,64,0.42)";
        ctx.fill();
      }

      if (terrain[2]) {
        drawPolygon(ctx, terrain[2], projector);
        ctx.fillStyle = "rgba(116,142,96,0.32)";
        ctx.fill();
      }

      for (const coastline of coastlines) {
        drawPolygon(ctx, coastline, projector);
        ctx.strokeStyle = "#dfcfab";
        ctx.lineWidth = Math.max(2, projector.radius(2.8));
        ctx.stroke();
      }

      if (village) {
        drawVillageCluster(ctx, village, projector);
      }
    }
  };
}
