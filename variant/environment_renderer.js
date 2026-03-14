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

export function createEnvironmentRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const body = projector.getBody();
      const environment = snapshot.kernel.environment ?? {};
      const mistAmount = typeof environment.mistAmount === "number" ? environment.mistAmount : 0.36;
      const waters = Array.isArray(snapshot.kernel.waters) ? snapshot.kernel.waters : [];
      const harborBasin = waters[1] ?? null;

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#b8d8ef");
      sky.addColorStop(0.38, "#c9e6f8");
      sky.addColorStop(0.72, "#d9f2ff");
      sky.addColorStop(1, "#eefbff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const atmosphere = ctx.createRadialGradient(
        body.centerX,
        body.topY + (body.radius * 0.12),
        body.radius * 0.68,
        body.centerX,
        body.topY + (body.radius * 0.12),
        body.radius * 1.02
      );
      atmosphere.addColorStop(0, `rgba(255,255,255,${0.00})`);
      atmosphere.addColorStop(0.52, `rgba(214,244,255,${0.18 + (mistAmount * 0.10)})`);
      atmosphere.addColorStop(0.78, `rgba(170,224,246,${0.22 + (mistAmount * 0.12)})`);
      atmosphere.addColorStop(1, "rgba(170,224,246,0.00)");
      ctx.fillStyle = atmosphere;
      ctx.fillRect(
        body.centerX - (body.radius * 1.08),
        body.topY - (body.radius * 0.30),
        body.radius * 2.16,
        body.radius * 1.22
      );

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
      ctx.clip();

      const globeOcean = ctx.createLinearGradient(0, body.topY, 0, body.centerY + body.radius);
      globeOcean.addColorStop(0, "#7fd4f2");
      globeOcean.addColorStop(0.34, "#64c4ec");
      globeOcean.addColorStop(0.72, "#48abde");
      globeOcean.addColorStop(1, "#2b7fba");
      ctx.fillStyle = globeOcean;
      ctx.fillRect(body.centerX - body.radius, body.topY, body.radius * 2, body.radius * 2);

      const globeDepth = ctx.createRadialGradient(
        body.centerX,
        body.topY + (body.radius * 0.36),
        body.radius * 0.10,
        body.centerX,
        body.centerY,
        body.radius * 1.04
      );
      globeDepth.addColorStop(0, "rgba(255,255,255,0.18)");
      globeDepth.addColorStop(0.40, "rgba(194,238,255,0.10)");
      globeDepth.addColorStop(0.78, "rgba(28,94,140,0.06)");
      globeDepth.addColorStop(1, "rgba(12,44,78,0.14)");
      ctx.fillStyle = globeDepth;
      ctx.fillRect(body.centerX - body.radius, body.topY, body.radius * 2, body.radius * 2);

      if (harborBasin) {
        drawPolygonPath(ctx, harborBasin, projector);
        ctx.fillStyle = "rgba(170,238,252,0.68)";
        ctx.fill();

        drawPolygonPath(ctx, harborBasin, projector);
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = projector.lineWidth(2.0, 0.73);
        ctx.stroke();
      }

      ctx.restore();

      const horizonGlow = ctx.createLinearGradient(0, body.topY - 8, 0, body.topY + (body.radius * 0.18));
      horizonGlow.addColorStop(0, "rgba(255,255,255,0)");
      horizonGlow.addColorStop(0.40, `rgba(246,255,255,${0.18 + (mistAmount * 0.08)})`);
      horizonGlow.addColorStop(1, "rgba(246,255,255,0)");
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, body.topY - 8, width, body.radius * 0.22);

      const skyMist = ctx.createLinearGradient(0, height * 0.24, 0, height * 0.92);
      skyMist.addColorStop(0, `rgba(255,255,255,${0.02 + (mistAmount * 0.04)})`);
      skyMist.addColorStop(0.54, `rgba(228,247,255,${0.05 + (mistAmount * 0.06)})`);
      skyMist.addColorStop(1, "rgba(194,228,244,0.06)");
      ctx.fillStyle = skyMist;
      ctx.fillRect(0, 0, width, height);
    }
  };
}
