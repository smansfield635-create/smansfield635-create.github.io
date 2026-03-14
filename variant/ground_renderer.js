function drawPolygon(context, points) {
  if (points.length < 3) {
    return;
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index].x, points[index].y);
  }
  context.closePath();
}

export function createGroundRenderer() {
  return {
    render({ context, projector, worldPayload }) {
      const terrainPolygons = worldPayload.terrainPolygons || [];
      const substratePolygons = worldPayload.substratePolygons || [];
      const coastlines = worldPayload.coastlines || [];

      let visible = false;

      context.save();

      for (const substrate of substratePolygons) {
        const points = projector.projectPoints(substrate.points || []);
        if (points.length < 3) {
          continue;
        }

        drawPolygon(context, points);
        context.fillStyle = "#486c47";
        context.fill();
        visible = true;
      }

      for (const terrain of terrainPolygons) {
        const points = projector.projectPoints(terrain.points || []);
        if (points.length < 3) {
          continue;
        }

        drawPolygon(context, points);
        context.fillStyle = "#618654";
        context.fill();
        visible = true;
      }

      for (const coastline of coastlines) {
        const points = projector.projectPoints(coastline.points || []);
        if (points.length < 2) {
          continue;
        }

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let index = 1; index < points.length; index += 1) {
          context.lineTo(points[index].x, points[index].y);
        }
        context.strokeStyle = "#e8e0bb";
        context.lineWidth = 3;
        context.stroke();
        visible = true;
      }

      context.restore();

      return {
        visible,
      };
    },
  };
}
