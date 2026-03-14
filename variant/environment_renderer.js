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

export function createEnvironmentRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const body = projector.getBody();
      const environment = snapshot.kernel.environment ?? {};
      const mistAmount = typeof environment.mistAmount === "number" ? environment.mistAmount : 0.36;
      const waters = Array.isArray(snapshot.kernel.waters) ? snapshot.kernel.waters : [];
      const outerOcean = waters[0] ?? null;
      const harborBasin = waters[1] ?? null;

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#06101d");
      sky.addColorStop(0.18, "#112842");
      sky.addColorStop(0.42, "#29507b");
      sky.addColorStop(0.68, "#5b8fbe");
      sky.addColorStop(1, "#c7ecff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const stars = [
        [0.14, 0.12, 1.0],
        [0.22, 0.20, 0.8],
        [0.35, 0.10, 0.9],
        [0.48, 0.18, 0.7],
        [0.66, 0.13, 1.0],
        [0.79, 0.22, 0.8],
        [0.86, 0.09, 0.9]
      ];

      ctx.save();
      for (const [sx, sy, sr] of stars) {
        ctx.fillStyle = "rgba(255,255,255,0.42)";
        ctx.beginPath();
        ctx.arc(width * sx, height * sy, sr * Math.max(1, width / 900), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      const atmosphere = ctx.createRadialGradient(
        body.centerX,
        body.horizonY + (body.radius * 0.08),
        body.radius * 0.72,
        body.centerX,
        body.horizonY + (body.radius * 0.08),
        body.radius * 1.08
      );
      atmosphere.addColorStop(0, "rgba(255,255,255,0)");
      atmosphere.addColorStop(0.52, `rgba(150,220,255,${0.18 + (mistAmount * 0.10)})`);
      atmosphere.addColorStop(0.78, `rgba(110,188,255,${0.22 + (mistAmount * 0.12)})`);
      atmosphere.addColorStop(1, "rgba(110,188,255,0)");
      ctx.fillStyle = atmosphere;
      ctx.fillRect(
        body.centerX - (body.radius * 1.14),
        body.horizonY - (body.radius * 0.26),
        body.radius * 2.28,
        body.radius * 1.40
      );

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const globeOcean = ctx.createLinearGradient(0, body.horizonY, 0, body.centerY + body.radius);
      globeOcean.addColorStop(0, "#7fd7ff");
      globeOcean.addColorStop(0.24, "#59bff0");
      globeOcean.addColorStop(0.56, "#2a85c4");
      globeOcean.addColorStop(1, "#0d3b6c");
      ctx.fillStyle = globeOcean;
      ctx.fillRect(body.centerX - body.radius, body.horizonY, body.radius * 2, body.radius * 1.2);

      const globeShadow = ctx.createRadialGradient(
        body.centerX,
        body.centerY - (body.radius * 0.20),
        body.radius * 0.14,
        body.centerX,
        body.centerY,
        body.radius * 1.05
      );
      globeShadow.addColorStop(0, "rgba(255,255,255,0.16)");
      globeShadow.addColorStop(0.36, "rgba(160,228,255,0.08)");
      globeShadow.addColorStop(0.72, "rgba(18,76,128,0.12)");
      globeShadow.addColorStop(1, "rgba(4,26,54,0.20)");
      ctx.fillStyle = globeShadow;
      ctx.fillRect(body.centerX - body.radius, body.horizonY, body.radius * 2, body.radius * 1.3);

      if (outerOcean) {
        drawPolygonPath(ctx, outerOcean, projector);
        ctx.fillStyle = "rgba(155,232,255,0.14)";
        ctx.fill();
      }

      if (harborBasin) {
        drawPolygonPath(ctx, harborBasin, projector);
        ctx.fillStyle = "rgba(214,247,255,0.56)";
        ctx.fill();

        drawPolygonPath(ctx, harborBasin, projector);
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = projector.lineWidth(1.8, 0.73);
        ctx.stroke();
      }

      ctx.restore();

      const horizonGlow = ctx.createLinearGradient(0, body.horizonY - 10, 0, body.horizonY + (body.radius * 0.16));
      horizonGlow.addColorStop(0, "rgba(255,255,255,0)");
      horizonGlow.addColorStop(0.34, "rgba(246,255,255,0.28)");
      horizonGlow.addColorStop(0.70, "rgba(194,242,255,0.16)");
      horizonGlow.addColorStop(1, "rgba(194,242,255,0)");
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, body.horizonY - 10, width, body.radius * 0.18);

      const veil = ctx.createLinearGradient(0, height * 0.16, 0, height);
      veil.addColorStop(0, "rgba(255,255,255,0.02)");
      veil.addColorStop(0.52, `rgba(228,247,255,${0.05 + (mistAmount * 0.08)})`);
      veil.addColorStop(1, "rgba(196,228,244,0.08)");
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, width, height);
    }
  };
}
