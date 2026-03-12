export function createBackgroundRenderer() {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + ((b - a) * t);
  }

  function getPhaseLabel(runtime) {
    return runtime?.phase?.globalPhase ?? "CALM";
  }

  function getPhaseIntensity(runtime) {
    const value = runtime?.phase?.intensity;
    return Number.isFinite(value) ? clamp(value, 0, 1) : 0.2;
  }

  function getNorthProgress(runtime) {
    const py = runtime?.player?.y;
    if (!Number.isFinite(py)) return 0.18;
    return clamp((930 - py) / 930, 0, 1);
  }

  function getEastProgress(runtime) {
    const px = runtime?.player?.x;
    if (!Number.isFinite(px)) return 0.5;
    return clamp((px - 150) / (960 - 150), 0, 1);
  }

  function getWorldCurve(runtime, width, height) {
    const northProgress = getNorthProgress(runtime);
    const eastProgress = getEastProgress(runtime);
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);

    const horizonBaseY = lerp(height * 0.66, height * 0.54, northProgress);
    const lateralTilt = lerp(-height * 0.025, height * 0.025, eastProgress);

    const phaseLift =
      phaseLabel === "LOCKDOWN"
        ? height * 0.010
        : phaseLabel === "SEVERE"
          ? height * 0.006
          : phaseLabel === "CLEAR_WINDOW"
            ? -height * 0.006
            : 0;

    const centerY = horizonBaseY + phaseLift;
    const edgeLift = lerp(height * 0.040, height * 0.085, northProgress) + (phaseIntensity * height * 0.010);

    const leftY = centerY + edgeLift - lateralTilt;
    const rightY = centerY + (edgeLift * 0.92) + lateralTilt;

    const bandThickness =
      lerp(height * 0.055, height * 0.090, northProgress) +
      (phaseIntensity * height * 0.008);

    const oceanCenterY =
      centerY + lerp(height * 0.62, height * 0.78, northProgress);

    const oceanRadiusX =
      lerp(width * 1.08, width * 1.24, northProgress);

    const oceanRadiusY =
      lerp(height * 0.66, height * 0.88, northProgress);

    return {
      centerY,
      leftY,
      rightY,
      edgeLift,
      bandThickness,
      oceanCenterY,
      oceanRadiusX,
      oceanRadiusY
    };
  }

  function buildHorizonCurve(ctx, width, curve) {
    ctx.beginPath();
    ctx.moveTo(0, curve.leftY);
    ctx.bezierCurveTo(
      width * 0.22,
      curve.leftY - (curve.edgeLift * 0.82),
      width * 0.38,
      curve.centerY - (curve.edgeLift * 0.34),
      width * 0.5,
      curve.centerY
    );
    ctx.bezierCurveTo(
      width * 0.66,
      curve.centerY - (curve.edgeLift * 0.24),
      width * 0.82,
      curve.rightY - (curve.edgeLift * 0.10),
      width,
      curve.rightY
    );
  }

  function buildSkyMask(ctx, width, height, curve) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, curve.rightY);
    ctx.bezierCurveTo(
      width * 0.82,
      curve.rightY - (curve.edgeLift * 0.10),
      width * 0.66,
      curve.centerY - (curve.edgeLift * 0.24),
      width * 0.5,
      curve.centerY
    );
    ctx.bezierCurveTo(
      width * 0.38,
      curve.centerY - (curve.edgeLift * 0.34),
      width * 0.22,
      curve.leftY - (curve.edgeLift * 0.82),
      0,
      curve.leftY
    );
    ctx.closePath();
  }

  function buildOceanMask(ctx, width, height, curve) {
    ctx.beginPath();
    ctx.moveTo(0, curve.leftY);
    ctx.bezierCurveTo(
      width * 0.22,
      curve.leftY - (curve.edgeLift * 0.82),
      width * 0.38,
      curve.centerY - (curve.edgeLift * 0.34),
      width * 0.5,
      curve.centerY
    );
    ctx.bezierCurveTo(
      width * 0.66,
      curve.centerY - (curve.edgeLift * 0.24),
      width * 0.82,
      curve.rightY - (curve.edgeLift * 0.10),
      width,
      curve.rightY
    );
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
  }

  function fillSkyField(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);

    const sky = ctx.createLinearGradient(0, 0, 0, curve.centerY + (curve.bandThickness * 0.70));

    if (phaseLabel === "CLEAR_WINDOW") {
      sky.addColorStop(0, "rgba(10,34,76,1)");
      sky.addColorStop(0.18, "rgba(28,92,170,1)");
      sky.addColorStop(0.52, "rgba(92,188,240,1)");
      sky.addColorStop(1, "rgba(196,240,255,1)");
    } else if (phaseLabel === "LOCKDOWN") {
      sky.addColorStop(0, "rgba(14,24,44,1)");
      sky.addColorStop(0.22, "rgba(24,50,88,1)");
      sky.addColorStop(0.56, "rgba(68,116,166,1)");
      sky.addColorStop(1, "rgba(144,190,224,1)");
    } else if (phaseLabel === "SEVERE") {
      sky.addColorStop(0, "rgba(12,28,58,1)");
      sky.addColorStop(0.22, "rgba(24,68,128,1)");
      sky.addColorStop(0.56, "rgba(70,148,212,1)");
      sky.addColorStop(1, "rgba(162,220,246,1)");
    } else {
      sky.addColorStop(0, "rgba(10,34,74,1)");
      sky.addColorStop(0.20, "rgba(24,82,148,1)");
      sky.addColorStop(0.56, "rgba(58,160,224,1)");
      sky.addColorStop(1, "rgba(158,226,248,1)");
    }

    ctx.save();
    buildSkyMask(ctx, width, height, curve);
    ctx.clip();
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, curve.rightY + (curve.bandThickness * 2.0));
    ctx.restore();

    const upperGlow = ctx.createRadialGradient(
      width * 0.58,
      curve.centerY * 0.34,
      16,
      width * 0.58,
      curve.centerY * 0.34,
      Math.max(width, height) * 0.42
    );

    if (phaseLabel === "CLEAR_WINDOW") {
      upperGlow.addColorStop(0, "rgba(255,244,218,0.16)");
      upperGlow.addColorStop(0.34, "rgba(212,236,255,0.10)");
      upperGlow.addColorStop(1, "rgba(212,236,255,0)");
    } else if (phaseLabel === "LOCKDOWN") {
      upperGlow.addColorStop(0, `rgba(228,238,255,${0.06 + (phaseIntensity * 0.05)})`);
      upperGlow.addColorStop(0.34, "rgba(164,190,226,0.06)");
      upperGlow.addColorStop(1, "rgba(164,190,226,0)");
    } else {
      upperGlow.addColorStop(0, "rgba(208,236,255,0.10)");
      upperGlow.addColorStop(0.34, "rgba(146,202,240,0.06)");
      upperGlow.addColorStop(1, "rgba(146,202,240,0)");
    }

    ctx.save();
    buildSkyMask(ctx, width, height, curve);
    ctx.clip();
    ctx.fillStyle = upperGlow;
    ctx.fillRect(0, 0, width, curve.rightY + (curve.bandThickness * 2.0));
    ctx.restore();
  }

  function fillCurvedOceanMass(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);

    ctx.save();
    buildOceanMask(ctx, width, height, curve);
    ctx.clip();

    ctx.beginPath();
    ctx.ellipse(
      width * 0.5,
      curve.oceanCenterY,
      curve.oceanRadiusX,
      curve.oceanRadiusY,
      0,
      Math.PI,
      0,
      true
    );
    ctx.closePath();

    const ocean = ctx.createLinearGradient(0, curve.centerY - (curve.bandThickness * 0.15), 0, height);

    if (phaseLabel === "CLEAR_WINDOW") {
      ocean.addColorStop(0, "rgba(22,136,194,1)");
      ocean.addColorStop(0.28, "rgba(18,118,178,1)");
      ocean.addColorStop(0.62, "rgba(12,94,150,1)");
      ocean.addColorStop(1, "rgba(10,68,122,1)");
    } else if (phaseLabel === "LOCKDOWN") {
      ocean.addColorStop(0, "rgba(28,116,164,1)");
      ocean.addColorStop(0.28, "rgba(18,92,136,1)");
      ocean.addColorStop(0.62, "rgba(12,66,108,1)");
      ocean.addColorStop(1, "rgba(8,42,82,1)");
    } else if (phaseLabel === "SEVERE") {
      ocean.addColorStop(0, "rgba(24,126,180,1)");
      ocean.addColorStop(0.28, "rgba(18,100,150,1)");
      ocean.addColorStop(0.62, "rgba(12,78,126,1)");
      ocean.addColorStop(1, "rgba(8,54,98,1)");
    } else {
      ocean.addColorStop(0, "rgba(42,146,188,1)");
      ocean.addColorStop(0.28, "rgba(28,116,166,1)");
      ocean.addColorStop(0.62, "rgba(18,88,138,1)");
      ocean.addColorStop(1, "rgba(12,68,114,1)");
    }

    ctx.fillStyle = ocean;
    ctx.fill();

    const westDepth = ctx.createRadialGradient(
      width * 0.18,
      curve.oceanCenterY - (curve.oceanRadiusY * 0.14),
      12,
      width * 0.18,
      curve.oceanCenterY - (curve.oceanRadiusY * 0.14),
      width * 0.62
    );
    westDepth.addColorStop(0, `rgba(6,36,74,${0.30 + (phaseIntensity * 0.06)})`);
    westDepth.addColorStop(0.52, `rgba(8,48,88,${0.14 + (phaseIntensity * 0.04)})`);
    westDepth.addColorStop(1, "rgba(8,48,88,0)");
    ctx.fillStyle = westDepth;
    ctx.fillRect(0, curve.centerY - (curve.bandThickness * 2), width, height);

    const eastDepth = ctx.createRadialGradient(
      width * 0.84,
      curve.oceanCenterY - (curve.oceanRadiusY * 0.26),
      12,
      width * 0.84,
      curve.oceanCenterY - (curve.oceanRadiusY * 0.26),
      width * 0.46
    );
    eastDepth.addColorStop(0, `rgba(8,42,82,${0.24 + (phaseIntensity * 0.06)})`);
    eastDepth.addColorStop(0.56, `rgba(8,42,82,${0.10 + (phaseIntensity * 0.04)})`);
    eastDepth.addColorStop(1, "rgba(8,42,82,0)");
    ctx.fillStyle = eastDepth;
    ctx.fillRect(0, curve.centerY - (curve.bandThickness * 2), width, height);

    const surfaceLift = ctx.createLinearGradient(
      0,
      curve.centerY - (curve.bandThickness * 0.18),
      0,
      curve.oceanCenterY + (curve.oceanRadiusY * 0.36)
    );
    surfaceLift.addColorStop(0, "rgba(224,244,248,0.026)");
    surfaceLift.addColorStop(0.24, "rgba(224,244,248,0.012)");
    surfaceLift.addColorStop(1, "rgba(224,244,248,0)");
    ctx.fillStyle = surfaceLift;
    ctx.fillRect(0, curve.centerY - (curve.bandThickness * 2), width, height);

    ctx.restore();
  }

  function drawHorizonBand(ctx, width, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);

    ctx.save();
    buildHorizonCurve(ctx, width, curve);
    ctx.lineWidth = curve.bandThickness;
    ctx.lineCap = "round";
    ctx.strokeStyle =
      phaseLabel === "CLEAR_WINDOW"
        ? "rgba(255,240,210,0.16)"
        : phaseLabel === "LOCKDOWN"
          ? `rgba(194,214,236,${0.10 + (phaseIntensity * 0.04)})`
          : `rgba(220,236,248,${0.10 + (phaseIntensity * 0.03)})`;
    ctx.stroke();

    buildHorizonCurve(ctx, width, curve);
    ctx.lineWidth = Math.max(2, curve.bandThickness * 0.16);
    ctx.strokeStyle =
      phaseLabel === "CLEAR_WINDOW"
        ? "rgba(255,248,232,0.22)"
        : "rgba(244,248,252,0.15)";
    ctx.stroke();
    ctx.restore();
  }

  function drawHorizonBloom(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);

    const bloom = ctx.createLinearGradient(
      0,
      curve.centerY - (curve.bandThickness * 0.70),
      0,
      curve.centerY + (curve.bandThickness * 1.30)
    );

    if (phaseLabel === "CLEAR_WINDOW") {
      bloom.addColorStop(0, "rgba(255,244,220,0.06)");
      bloom.addColorStop(0.45, "rgba(180,220,238,0.04)");
      bloom.addColorStop(1, "rgba(22,68,112,0)");
    } else {
      bloom.addColorStop(0, "rgba(236,246,255,0.04)");
      bloom.addColorStop(0.45, "rgba(154,204,228,0.03)");
      bloom.addColorStop(1, "rgba(22,68,112,0)");
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, curve.leftY - (curve.bandThickness * 0.48));
    ctx.bezierCurveTo(
      width * 0.22,
      curve.leftY - (curve.edgeLift * 1.10),
      width * 0.38,
      curve.centerY - (curve.edgeLift * 0.58),
      width * 0.5,
      curve.centerY - (curve.bandThickness * 0.28)
    );
    ctx.bezierCurveTo(
      width * 0.66,
      curve.centerY - (curve.edgeLift * 0.40),
      width * 0.82,
      curve.rightY - (curve.edgeLift * 0.08),
      width,
      curve.rightY + (curve.bandThickness * 0.20)
    );
    ctx.lineTo(width, curve.rightY + (curve.bandThickness * 1.30));
    ctx.lineTo(0, curve.leftY + (curve.bandThickness * 1.30));
    ctx.closePath();
    ctx.fillStyle = bloom;
    ctx.fill();
    ctx.restore();
  }

  function drawPlanetFalloff(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);

    const falloff = ctx.createLinearGradient(0, 0, 0, height);

    if (phaseLabel === "LOCKDOWN") {
      falloff.addColorStop(0, "rgba(255,255,255,0.06)");
      falloff.addColorStop(0.24, "rgba(255,255,255,0.03)");
      falloff.addColorStop(0.62, "rgba(0,0,0,0.00)");
      falloff.addColorStop(1, "rgba(0,0,0,0.12)");
    } else {
      falloff.addColorStop(0, "rgba(255,255,255,0.04)");
      falloff.addColorStop(0.26, "rgba(255,255,255,0.02)");
      falloff.addColorStop(0.62, "rgba(0,0,0,0.00)");
      falloff.addColorStop(1, "rgba(0,0,0,0.08)");
    }

    ctx.save();
    buildOceanMask(ctx, width, height, curve);
    ctx.clip();
    ctx.fillStyle = falloff;
    ctx.fillRect(0, curve.centerY - (curve.bandThickness * 2), width, height);
    ctx.restore();
  }

  function draw(ctx, runtimeOrWidth, maybeHeight) {
    const runtime =
      typeof runtimeOrWidth === "object" && runtimeOrWidth !== null
        ? runtimeOrWidth
        : { width: runtimeOrWidth, height: maybeHeight, phase: null, player: null };

    const width = runtime.width;
    const height = runtime.height;
    if (!Number.isFinite(width) || !Number.isFinite(height)) return;

    const curve = getWorldCurve(runtime, width, height);

    ctx.save();
    fillSkyField(ctx, width, height, runtime, curve);
    fillCurvedOceanMass(ctx, width, height, runtime, curve);
    drawHorizonBand(ctx, width, runtime, curve);
    drawHorizonBloom(ctx, width, height, runtime, curve);
    drawPlanetFalloff(ctx, width, height, runtime, curve);
    ctx.restore();
  }

  return Object.freeze({ draw });
}
