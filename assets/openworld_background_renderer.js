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

  function getHorizonGeometry(runtime, width, height) {
    const northProgress = getNorthProgress(runtime);
    const eastProgress = getEastProgress(runtime);
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);

    const baseMidY = lerp(height * 0.64, height * 0.50, northProgress);
    const lateralTilt = lerp(-height * 0.04, height * 0.04, eastProgress);
    const phaseLift =
      phaseLabel === "LOCKDOWN"
        ? height * 0.010
        : phaseLabel === "SEVERE"
          ? height * 0.006
          : phaseLabel === "CLEAR_WINDOW"
            ? -height * 0.006
            : 0;

    const leftY = baseMidY + (height * 0.035) - lateralTilt + phaseLift;
    const centerY = baseMidY - (height * 0.018) + phaseLift;
    const rightY = baseMidY - (height * 0.030) + lateralTilt + phaseLift;

    const bandThickness =
      lerp(height * 0.070, height * 0.105, northProgress) +
      (phaseIntensity * height * 0.008);

    return {
      leftY,
      centerY,
      rightY,
      bandThickness
    };
  }

  function buildHorizonCurve(ctx, width, curve) {
    ctx.beginPath();
    ctx.moveTo(0, curve.leftY);
    ctx.bezierCurveTo(
      width * 0.22,
      curve.leftY - curve.bandThickness * 0.55,
      width * 0.68,
      curve.centerY - curve.bandThickness * 0.30,
      width * 0.5,
      curve.centerY
    );
    ctx.bezierCurveTo(
      width * 0.76,
      curve.centerY - curve.bandThickness * 0.18,
      width * 0.90,
      curve.rightY + curve.bandThickness * 0.10,
      width,
      curve.rightY
    );
  }

  function fillAboveHorizon(ctx, width, height, curve, fillStyle) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, curve.rightY);
    ctx.bezierCurveTo(
      width * 0.90,
      curve.rightY + curve.bandThickness * 0.10,
      width * 0.76,
      curve.centerY - curve.bandThickness * 0.18,
      width * 0.5,
      curve.centerY
    );
    ctx.bezierCurveTo(
      width * 0.68,
      curve.centerY - curve.bandThickness * 0.30,
      width * 0.22,
      curve.leftY - curve.bandThickness * 0.55,
      0,
      curve.leftY
    );
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
  }

  function fillBelowHorizon(ctx, width, height, curve, fillStyle) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, curve.leftY);
    ctx.bezierCurveTo(
      width * 0.22,
      curve.leftY - curve.bandThickness * 0.55,
      width * 0.68,
      curve.centerY - curve.bandThickness * 0.30,
      width * 0.5,
      curve.centerY
    );
    ctx.bezierCurveTo(
      width * 0.76,
      curve.centerY - curve.bandThickness * 0.18,
      width * 0.90,
      curve.rightY + curve.bandThickness * 0.10,
      width,
      curve.rightY
    );
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
  }

  function drawSkyField(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);

    const sky = ctx.createLinearGradient(0, 0, 0, curve.centerY + (curve.bandThickness * 0.75));

    if (phaseLabel === "CLEAR_WINDOW") {
      sky.addColorStop(0, "rgba(12,34,74,1)");
      sky.addColorStop(0.20, "rgba(30,88,164,1)");
      sky.addColorStop(0.56, "rgba(98,188,242,1)");
      sky.addColorStop(1, "rgba(194,238,255,1)");
    } else if (phaseLabel === "LOCKDOWN") {
      sky.addColorStop(0, "rgba(16,26,48,1)");
      sky.addColorStop(0.24, "rgba(26,54,94,1)");
      sky.addColorStop(0.60, "rgba(68,120,172,1)");
      sky.addColorStop(1, "rgba(148,194,228,1)");
    } else if (phaseLabel === "SEVERE") {
      sky.addColorStop(0, "rgba(12,30,60,1)");
      sky.addColorStop(0.24, "rgba(24,70,130,1)");
      sky.addColorStop(0.60, "rgba(66,148,212,1)");
      sky.addColorStop(1, "rgba(160,218,244,1)");
    } else {
      sky.addColorStop(0, "rgba(10,34,74,1)");
      sky.addColorStop(0.22, "rgba(24,82,148,1)");
      sky.addColorStop(0.58, "rgba(58,160,224,1)");
      sky.addColorStop(1, "rgba(156,224,248,1)");
    }

    fillAboveHorizon(ctx, width, height, curve, sky);

    const upperGlow = ctx.createRadialGradient(
      width * 0.56,
      curve.centerY * 0.34,
      16,
      width * 0.56,
      curve.centerY * 0.34,
      Math.max(width, height) * 0.42
    );

    if (phaseLabel === "CLEAR_WINDOW") {
      upperGlow.addColorStop(0, "rgba(255,244,218,0.16)");
      upperGlow.addColorStop(0.34, "rgba(210,236,255,0.10)");
      upperGlow.addColorStop(1, "rgba(210,236,255,0)");
    } else if (phaseLabel === "LOCKDOWN") {
      upperGlow.addColorStop(0, `rgba(228,238,255,${0.06 + (phaseIntensity * 0.05)})`);
      upperGlow.addColorStop(0.34, "rgba(164,190,226,0.06)");
      upperGlow.addColorStop(1, "rgba(164,190,226,0)");
    } else {
      upperGlow.addColorStop(0, "rgba(208,236,255,0.10)");
      upperGlow.addColorStop(0.34, "rgba(146,202,240,0.06)");
      upperGlow.addColorStop(1, "rgba(146,202,240,0)");
    }

    fillAboveHorizon(ctx, width, height, curve, upperGlow);
  }

  function drawOceanField(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);
    const northProgress = getNorthProgress(runtime);

    const ocean = ctx.createLinearGradient(0, curve.centerY - (curve.bandThickness * 0.10), width, height);

    if (phaseLabel === "CLEAR_WINDOW") {
      ocean.addColorStop(0, "rgba(24,136,194,1)");
      ocean.addColorStop(0.34, "rgba(20,116,176,1)");
      ocean.addColorStop(0.68, "rgba(14,92,148,1)");
      ocean.addColorStop(1, "rgba(10,66,118,1)");
    } else if (phaseLabel === "LOCKDOWN") {
      ocean.addColorStop(0, "rgba(28,118,164,1)");
      ocean.addColorStop(0.34, "rgba(18,92,136,1)");
      ocean.addColorStop(0.68, "rgba(12,66,108,1)");
      ocean.addColorStop(1, "rgba(8,44,84,1)");
    } else if (phaseLabel === "SEVERE") {
      ocean.addColorStop(0, "rgba(24,126,180,1)");
      ocean.addColorStop(0.34, "rgba(18,100,150,1)");
      ocean.addColorStop(0.68, "rgba(12,78,126,1)");
      ocean.addColorStop(1, "rgba(8,54,98,1)");
    } else {
      ocean.addColorStop(0, "rgba(44,146,188,1)");
      ocean.addColorStop(0.34, "rgba(28,116,166,1)");
      ocean.addColorStop(0.68, "rgba(18,88,138,1)");
      ocean.addColorStop(1, "rgba(12,68,114,1)");
    }

    fillBelowHorizon(ctx, width, height, curve, ocean);

    const westDepth = ctx.createRadialGradient(
      width * 0.14,
      lerp(height * 0.76, height * 0.68, northProgress),
      12,
      width * 0.14,
      lerp(height * 0.76, height * 0.68, northProgress),
      width * 0.58
    );
    westDepth.addColorStop(0, `rgba(6,36,74,${0.32 + (phaseIntensity * 0.06)})`);
    westDepth.addColorStop(0.52, `rgba(8,48,88,${0.14 + (phaseIntensity * 0.04)})`);
    westDepth.addColorStop(1, "rgba(8,48,88,0)");
    fillBelowHorizon(ctx, width, height, curve, westDepth);

    const eastDepth = ctx.createRadialGradient(
      width * 0.88,
      lerp(height * 0.54, height * 0.58, northProgress),
      10,
      width * 0.88,
      lerp(height * 0.54, height * 0.58, northProgress),
      width * 0.44
    );
    eastDepth.addColorStop(0, `rgba(8,42,82,${0.24 + (phaseIntensity * 0.06)})`);
    eastDepth.addColorStop(0.56, `rgba(8,42,82,${0.10 + (phaseIntensity * 0.04)})`);
    eastDepth.addColorStop(1, "rgba(8,42,82,0)");
    fillBelowHorizon(ctx, width, height, curve, eastDepth);

    const surfaceLift = ctx.createLinearGradient(0, curve.centerY - (curve.bandThickness * 0.20), 0, height);
    surfaceLift.addColorStop(0, "rgba(224,244,248,0.022)");
    surfaceLift.addColorStop(0.24, "rgba(224,244,248,0.012)");
    surfaceLift.addColorStop(1, "rgba(224,244,248,0)");
    fillBelowHorizon(ctx, width, height, curve, surfaceLift);
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
      curve.centerY - (curve.bandThickness * 0.65),
      0,
      curve.centerY + (curve.bandThickness * 1.25)
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
    ctx.moveTo(0, curve.leftY - curve.bandThickness * 0.50);
    ctx.bezierCurveTo(
      width * 0.22,
      curve.leftY - curve.bandThickness * 0.95,
      width * 0.68,
      curve.centerY - curve.bandThickness * 0.65,
      width * 0.5,
      curve.centerY - curve.bandThickness * 0.30
    );
    ctx.bezierCurveTo(
      width * 0.76,
      curve.centerY - curve.bandThickness * 0.12,
      width * 0.90,
      curve.rightY + curve.bandThickness * 0.04,
      width,
      curve.rightY + curve.bandThickness * 0.22
    );
    ctx.lineTo(width, curve.rightY + curve.bandThickness * 1.25);
    ctx.lineTo(0, curve.leftY + curve.bandThickness * 1.25);
    ctx.closePath();
    ctx.fillStyle = bloom;
    ctx.fill();
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

    const curve = getHorizonGeometry(runtime, width, height);

    ctx.save();
    drawSkyField(ctx, width, height, runtime, curve);
    drawOceanField(ctx, width, height, runtime, curve);
    drawHorizonBand(ctx, width, runtime, curve);
    drawHorizonBloom(ctx, width, height, runtime, curve);
    ctx.restore();
  }

  return Object.freeze({ draw });
}
