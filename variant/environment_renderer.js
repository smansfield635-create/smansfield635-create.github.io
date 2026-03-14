export function createEnvironmentRenderer() {
  function drawPolygon(ctx, polygon, projector) {
    if (!Array.isArray(polygon) || polygon.length < 3) return;

    const first = projector.point(polygon[0][0], polygon[0][1]);
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < polygon.length; i += 1) {
      const point = projector.point(polygon[i][0], polygon[i][1]);
      ctx.lineTo(point.x, point.y);
    }

    ctx.closePath();
  }

  function drawSky(ctx, environment) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#314765");
    sky.addColorStop(0.5, "#223755");
    sky.addColorStop(1, "#0b1628");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const mistAmount = Number.isFinite(environment?.mistAmount)
      ? environment.mistAmount
      : 0.0;

    ctx.fillStyle = `rgba(220,235,245,${0.10 + mistAmount * 0.12})`;
    ctx.fillRect(0, 0, width, height * 0.78);
  }

  function drawWaters(ctx, snapshot, projector) {
    const waters = Array.isArray(snapshot?.kernel?.waters)
      ? snapshot.kernel.waters
      : [];

    const outerOcean = waters[0];
    const harborBasin = waters[1];

    if (outerOcean) {
      drawPolygon(ctx, outerOcean, projector);
      ctx.fillStyle = "#1e4468";
      ctx.fill();
    }

    if (harborBasin) {
      drawPolygon(ctx, harborBasin, projector);
      ctx.fillStyle = "#2f668f";
      ctx.fill();

      drawPolygon(ctx, harborBasin, projector);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fill();
    }
  }

  return {
    draw(ctx, snapshot, projector) {
      if (!ctx || !snapshot || !projector) return;

      const environment =
        snapshot?.kernel?.environment && typeof snapshot.kernel.environment === "object"
          ? snapshot.kernel.environment
          : {};

      drawSky(ctx, environment);
      drawWaters(ctx, snapshot, projector);
    }
  };
}
