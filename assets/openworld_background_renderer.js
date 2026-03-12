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

  function getWorldCurve(runtime, width, height) {
    const northProgress = getNorthProgress(runtime);
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);

    const crestY = lerp(height * 0.74, height * 0.36, northProgress);
    const sag = lerp(height * 0.06, height * 0.16, northProgress);

    const severeOffset =
      phaseLabel === "LOCKDOWN"
        ? height * 0.02
        : phaseLabel === "SEVERE"
          ? height * 0.012
          : 0;

    return {
      leftY: crestY + sag + severeOffset,
      centerY: crestY - severeOffset,
      rightY: crestY + (sag * 0.88) + severeOffset,
      bandThickness: lerp(height * 0.11, height * 0.18, northProgress) + (phaseIntensity * height * 0.01),
      northProgress
    };
  }

  function buildHorizonPath(ctx, width, curve) {
    ctx.beginPath();
    ctx.moveTo(0, curve.leftY);
    ctx.quadraticCurveTo(width * 0.25, curve.centerY + (curve.leftY - curve.centerY) * 0.34, width * 0.5, curve.centerY);
    ctx.quadraticCurveTo(width * 0.75, curve.centerY + (curve.rightY - curve.centerY) * 0.30, width, curve.rightY);
  }

  function fillAboveHorizon(ctx, width, height, curve, fillStyle) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, curve.rightY);
    ctx.quadraticCurveTo(width * 0.75, curve.centerY + (curve.rightY - curve.centerY) * 0.30, width * 0.5, curve.centerY);
    ctx.quadraticCurveTo(width * 0.25, curve.centerY + (curve.leftY - curve.centerY) * 0.34, 0, curve.leftY);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
  }

  function fillBelowHorizon(ctx, width, height, curve, fillStyle) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, curve.leftY);
    ctx.quadraticCurveTo(width * 0.25, curve.centerY + (curve.leftY - curve.centerY) * 0.34, width * 0.5, curve.centerY);
    ctx.quadraticCurveTo(width * 0.75, curve.centerY + (curve.rightY - curve.centerY) * 0.30, width, curve.rightY);
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

    const sky = ctx.createLinearGradient(0, 0, 0, curve.centerY + (curve.bandThickness * 0.8));

    if (phaseLabel === "CLEAR_WINDOW") {
      sky.addColorStop(0, "rgba(10,28,68,1)");
      sky.addColorStop(0.22, "rgba(24,74,148,1)");
      sky.addColorStop(0.56, "rgba(74,170,236,1)");
      sky.addColorStop(1, "rgba(170,232,255,1)");
    } else if (phaseLabel === "LOCKDOWN") {
      sky.addColorStop(0, "rgba(16,26,48,1)");
      sky.addColorStop(0.28, "rgba(28,54,92,1)");
      sky.addColorStop(0.62, "rgba(56,104,154,1)");
      sky.addColorStop(1, "rgba(112,166,210,1)");
    } else if (phaseLabel === "SEVERE") {
      sky.addColorStop(0, "rgba(14,32,58,1)");
      sky.addColorStop(0.28, "rgba(24,64,118,1)");
      sky.addColorStop(0.62, "rgba(54,130,194,1)");
      sky.addColorStop(1, "rgba(132,204,236,1)");
    } else {
      sky.addColorStop(0, "rgba(10,34,74,1)");
      sky.addColorStop(0.24, "rgba(20,78,142,1)");
      sky.addColorStop(0.58, "rgba(42,148,214,1)");
      sky.addColorStop(1, "rgba(134,214,246,1)");
    }

    fillAboveHorizon(ctx, width, height, curve, sky);

    const upperGlow = ctx.createRadialGradient(
      width * 0.52,
      curve.centerY * 0.24,
      12,
      width * 0.52,
      curve.centerY * 0.24,
      Math.max(width, height) * 0.46
    );

    if (phaseLabel === "CLEAR_WINDOW") {
      upperGlow.addColorStop(0, "rgba(255,246,220,0.16)");
      upperGlow.addColorStop(0.32, "rgba(194,228,255,0.10)");
      upperGlow.addColorStop(1, "rgba(194,228,255,0)");
    } else if (phaseLabel === "LOCKDOWN") {
      upperGlow.addColorStop(0, `rgba(228,238,255,${0.06 + (phaseIntensity * 0.05)})`);
      upperGlow.addColorStop(0.32, "rgba(154,184,224,0.06)");
      upperGlow.addColorStop(1, "rgba(154,184,224,0)");
    } else {
      upperGlow.addColorStop(0, "rgba(210,236,255,0.10)");
      upperGlow.addColorStop(0.32, "rgba(144,198,238,0.06)");
      upperGlow.addColorStop(1, "rgba(144,198,238,0)");
    }

    fillAboveHorizon(ctx, width, height, curve, upperGlow);
  }

  function drawOceanMass(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);
    const northProgress = curve.northProgress;

    const ocean = ctx.createLinearGradient(0, curve.centerY - (curve.bandThickness * 0.15), width, height);

    if (phaseLabel === "CLEAR_WINDOW") {
      ocean.addColorStop(0, "rgba(22,126,188,1)");
      ocean.addColorStop(0.34, "rgba(18,108,170,1)");
      ocean.addColorStop(0.68, "rgba(12,86,142,1)");
      ocean.addColorStop(1, "rgba(8,62,114,1)");
    } else if (phaseLabel === "LOCKDOWN") {
      ocean.addColorStop(0, "rgba(30,112,160,1)");
      ocean.addColorStop(0.34, "rgba(20,88,132,1)");
      ocean.addColorStop(0.68, "rgba(12,64,104,1)");
      ocean.addColorStop(1, "rgba(8,42,82,1)");
    } else if (phaseLabel === "SEVERE") {
      ocean.addColorStop(0, "rgba(26,120,176,1)");
      ocean.addColorStop(0.34, "rgba(18,94,144,1)");
      ocean.addColorStop(0.68, "rgba(12,72,118,1)");
      ocean.addColorStop(1, "rgba(8,48,92,1)");
    } else {
      ocean.addColorStop(0, "rgba(44,146,188,1)");
      ocean.addColorStop(0.34, "rgba(28,116,166,1)");
      ocean.addColorStop(0.68, "rgba(18,88,138,1)");
      ocean.addColorStop(1, "rgba(12,68,114,1)");
    }

    fillBelowHorizon(ctx, width, height, curve, ocean);

    const westDepth = ctx.createRadialGradient(
      width * 0.14,
      lerp(height * 0.74, height * 0.66, northProgress),
      12,
      width * 0.14,
      lerp(height * 0.74, height * 0.66, northProgress),
      width * 0.58
    );
    westDepth.addColorStop(0, `rgba(6,36,74,${0.34 + (phaseIntensity * 0.06)})`);
    westDepth.addColorStop(0.52, `rgba(8,48,88,${0.14 + (phaseIntensity * 0.04)})`);
    westDepth.addColorStop(1, "rgba(8,48,88,0)");
    fillBelowHorizon(ctx, width, height, curve, westDepth);

    const eastDepth = ctx.createRadialGradient(
      width * 0.88,
      lerp(height * 0.52, height * 0.56, northProgress),
      10,
      width * 0.88,
      lerp(height * 0.52, height * 0.56, northProgress),
      width * 0.44
    );
    eastDepth.addColorStop(0, `rgba(8,42,82,${0.26 + (phaseIntensity * 0.06)})`);
    eastDepth.addColorStop(0.56, `rgba(8,42,82,${0.10 + (phaseIntensity * 0.04)})`);
    eastDepth.addColorStop(1, "rgba(8,42,82,0)");
    fillBelowHorizon(ctx, width, height, curve, eastDepth);

    const coastalLift = ctx.createLinearGradient(0, curve.centerY - (curve.bandThickness * 0.35), 0, height);
    coastalLift.addColorStop(0, "rgba(224,244,248,0.020)");
    coastalLift.addColorStop(0.28, "rgba(224,244,248,0.012)");
    coastalLift.addColorStop(1, "rgba(224,244,248,0)");
    fillBelowHorizon(ctx, width, height, curve, coastalLift);
  }

  function drawHorizonBand(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);

    ctx.save();
    buildHorizonPath(ctx, width, curve);
    ctx.lineWidth = curve.bandThickness;
    ctx.lineCap = "round";
    ctx.strokeStyle =
      phaseLabel === "CLEAR_WINDOW"
        ? "rgba(255,240,210,0.18)"
        : phaseLabel === "LOCKDOWN"
          ? `rgba(196,214,236,${0.10 + (phaseIntensity * 0.04)})`
          : `rgba(220,236,248,${0.11 + (phaseIntensity * 0.03)})`;
    ctx.stroke();

    buildHorizonPath(ctx, width, curve);
    ctx.lineWidth = Math.max(2, curve.bandThickness * 0.16);
    ctx.strokeStyle =
      phaseLabel === "CLEAR_WINDOW"
        ? "rgba(255,248,232,0.24)"
        : "rgba(244,248,252,0.16)";
    ctx.stroke();
    ctx.restore();
  }

  function drawWorldCurvatureMask(ctx, width, height, runtime, curve) {
    const phaseLabel = getPhaseLabel(runtime);

    const mask = ctx.createLinearGradient(0, curve.centerY - (curve.bandThickness * 0.6), 0, curve.centerY + (curve.bandThickness * 1.6));
    if (phaseLabel === "CLEAR_WINDOW") {
      mask.addColorStop(0, "rgba(255,244,220,0.06)");
      mask.addColorStop(0.45, "rgba(180,220,238,0.04)");
      mask.addColorStop(1, "rgba(22,68,112,0)");
    } else {
      mask.addColorStop(0, "rgba(236,246,255,0.04)");
      mask.addColorStop(0.45, "rgba(154,204,228,0.03)");
      mask.addColorStop(1, "rgba(22,68,112,0)");
    }

    ctx.save();
    buildHorizonPath(ctx, width, curve);
    ctx.lineTo(width, curve.rightY + curve.bandThickness * 1.6);
    ctx.lineTo(0, curve.leftY + curve.bandThickness * 1.6);
    ctx.closePath();
    ctx.fillStyle = mask;
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

    const curve = getWorldCurve(runtime, width, height);

    ctx.save();
    drawSkyField(ctx, width, height, runtime, curve);
    drawOceanMass(ctx, width, height, runtime, curve);
    drawHorizonBand(ctx, width, height, runtime, curve);
    drawWorldCurvatureMask(ctx, width, height, runtime, curve);
    ctx.restore();
  }

  return Object.freeze({ draw });
}
