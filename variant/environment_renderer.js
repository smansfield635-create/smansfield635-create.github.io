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

export function createEnvironmentRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const environment = snapshot.kernel.environment;

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#314765");
      sky.addColorStop(0.50, "#223755");
      sky.addColorStop(1, "#0b1628");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = `rgba(220,235,245,${0.10 + environment.mistAmount * 0.12})`;
      ctx.fillRect(0, 0, width, height * 0.78);

      const waters = snapshot.kernel.waters;
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
      }

      if (harborBasin) {
        drawPolygon(ctx, harborBasin, projector);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fill();
      }
    }
  };
}
