function drawPolygon(ctx, polygon, projector) {
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

function polygonBounds(projected) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of projected) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

export function createEnvironmentRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const environment = snapshot.kernel.environment ?? {};
      const mistAmount = typeof environment.mistAmount === "number" ? environment.mistAmount : 0.34;
      const waters = Array.isArray(snapshot.kernel.waters) ? snapshot.kernel.waters : [];
      const outerOcean = waters[0] ?? null;
      const harborBasin = waters[1] ?? null;

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#6cb8f0");
      sky.addColorStop(0.42, "#8fd4fb");
      sky.addColorStop(0.72, "#a8e2ff");
      sky.addColorStop(1, "#d7f3ff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const upperGlow = ctx.createRadialGradient(
        width * 0.54,
        height * 0.16,
        width * 0.05,
        width * 0.54,
        height * 0.16,
        width * 0.42
      );
      upperGlow.addColorStop(0, "rgba(255,214,178,0.18)");
      upperGlow.addColorStop(0.32, "rgba(255,214,178,0.08)");
      upperGlow.addColorStop(1, "rgba(255,214,178,0)");
      ctx.fillStyle = upperGlow;
      ctx.fillRect(0, 0, width, height * 0.62);

      const horizonBand = ctx.createLinearGradient(0, height * 0.52, 0, height * 0.88);
      horizonBand.addColorStop(0, "rgba(220,248,255,0.00)");
      horizonBand.addColorStop(0.28, `rgba(226,250,255,${0.16 + (mistAmount * 0.10)})`);
      horizonBand.addColorStop(0.64, `rgba(188,234,248,${0.14 + (mistAmount * 0.08)})`);
      horizonBand.addColorStop(1, "rgba(126,190,220,0)");
      ctx.fillStyle = horizonBand;
      ctx.fillRect(0, height * 0.46, width, height * 0.42);

      if (outerOcean) {
        const outerProjected = drawPolygon(ctx, outerOcean, projector);
        ctx.fillStyle = "#54b4ea";
        ctx.fill();

        const oceanBounds = polygonBounds(outerProjected);
        const oceanGlow = ctx.createLinearGradient(0, oceanBounds.minY, 0, oceanBounds.maxY);
        oceanGlow.addColorStop(0, "rgba(185,244,255,0.18)");
        oceanGlow.addColorStop(0.34, "rgba(126,212,242,0.12)");
        oceanGlow.addColorStop(1, "rgba(54,142,198,0.06)");
        ctx.save();
        drawPolygon(ctx, outerOcean, projector);
        ctx.clip();
        ctx.fillStyle = oceanGlow;
        ctx.fillRect(oceanBounds.minX, oceanBounds.minY, oceanBounds.width, oceanBounds.height);
        ctx.restore();
      }

      if (harborBasin) {
        const basinProjected = drawPolygon(ctx, harborBasin, projector);
        ctx.fillStyle = "#7bd8f5";
        ctx.fill();

        const basinBounds = polygonBounds(basinProjected);
        const basinGlow = ctx.createRadialGradient(
          (basinBounds.minX + basinBounds.maxX) * 0.5,
          basinBounds.minY + (basinBounds.height * 0.30),
          basinBounds.width * 0.04,
          (basinBounds.minX + basinBounds.maxX) * 0.5,
          basinBounds.minY + (basinBounds.height * 0.30),
          Math.max(basinBounds.width, basinBounds.height) * 0.75
        );
        basinGlow.addColorStop(0, "rgba(255,255,255,0.26)");
        basinGlow.addColorStop(0.34, "rgba(220,250,255,0.14)");
        basinGlow.addColorStop(1, "rgba(220,250,255,0)");
        ctx.save();
        drawPolygon(ctx, harborBasin, projector);
        ctx.clip();
        ctx.fillStyle = basinGlow;
        ctx.fillRect(basinBounds.minX, basinBounds.minY, basinBounds.width, basinBounds.height);
        ctx.restore();
      }

      const depthVeil = ctx.createLinearGradient(0, height * 0.24, 0, height * 0.92);
      depthVeil.addColorStop(0, `rgba(255,255,255,${0.02 + mistAmount * 0.05})`);
      depthVeil.addColorStop(0.40, `rgba(218,244,252,${0.05 + mistAmount * 0.08})`);
      depthVeil.addColorStop(0.74, `rgba(196,228,244,${0.08 + mistAmount * 0.08})`);
      depthVeil.addColorStop(1, "rgba(180,216,238,0.03)");
      ctx.fillStyle = depthVeil;
      ctx.fillRect(0, 0, width, height);

      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.56,
        width * 0.18,
        width * 0.5,
        height * 0.56,
        width * 0.74
      );
      vignette.addColorStop(0, "rgba(255,255,255,0)");
      vignette.addColorStop(1, "rgba(32,86,128,0.12)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    }
  };
}
