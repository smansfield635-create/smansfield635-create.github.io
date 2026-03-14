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

export function createEnvironmentRenderer() {
  return {
    render({ context, projector, worldPayload, viewport }) {
      const width = viewport.pixelWidth;
      const height = viewport.pixelHeight;
      const environment = worldPayload.environment || {};
      const waters = worldPayload.waters || [];

      const skyGradient = context.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, "#183350");
      skyGradient.addColorStop(0.55, "#3d6889");
      skyGradient.addColorStop(1, "#7c96a8");

      context.save();

      context.fillStyle = skyGradient;
      context.fillRect(0, 0, width, height);

      const visibility = Number.isFinite(environment.visibility)
        ? environment.visibility
        : 1;
      const humidityFogLoad = Number.isFinite(environment.humidityFogLoad)
        ? environment.humidityFogLoad
        : 0.2;

      const hazeAlpha = Math.max(
        0,
        Math.min(0.35, humidityFogLoad * 0.25 + (1 - visibility) * 0.15),
      );

      if (hazeAlpha > 0) {
        context.fillStyle = `rgba(224,235,245,${hazeAlpha.toFixed(3)})`;
        context.fillRect(0, 0, width, height);
      }

      for (const water of waters) {
        const points = projector.projectPoints(water.points || []);
        if (points.length < 3) {
          continue;
        }

        drawPolygon(context, points);
        context.fillStyle = "#2c5f90";
        context.fill();
      }

      context.restore();

      return {
        visible: true,
      };
    },
  };
}
