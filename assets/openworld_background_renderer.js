export function createBackgroundRenderer() {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getPhaseLabel(runtime) {
    return runtime?.phase?.globalPhase ?? "CALM";
  }

  function getPhaseIntensity(runtime) {
    const value = runtime?.phase?.intensity;
    return Number.isFinite(value) ? clamp(value, 0, 1) : 0.2;
  }

  function drawSky(ctx, width, height, runtime) {
    const phase = getPhaseLabel(runtime);

    const sky = ctx.createLinearGradient(0, 0, 0, height);

    if (phase === "CLEAR_WINDOW") {
      sky.addColorStop(0, "rgba(10,34,74,1)");
      sky.addColorStop(0.28, "rgba(28,92,170,1)");
      sky.addColorStop(0.62, "rgba(96,186,236,1)");
      sky.addColorStop(1, "rgba(206,240,255,1)");
    } else if (phase === "LOCKDOWN") {
      sky.addColorStop(0, "rgba(12,22,42,1)");
      sky.addColorStop(0.34, "rgba(26,54,98,1)");
      sky.addColorStop(0.68, "rgba(82,126,170,1)");
      sky.addColorStop(1, "rgba(154,184,210,1)");
    } else if (phase === "SEVERE") {
      sky.addColorStop(0, "rgba(10,28,58,1)");
      sky.addColorStop(0.34, "rgba(24,70,126,1)");
      sky.addColorStop(0.68, "rgba(88,146,198,1)");
      sky.addColorStop(1, "rgba(176,210,232,1)");
    } else {
      sky.addColorStop(0, "rgba(10,34,74,1)");
      sky.addColorStop(0.34, "rgba(26,86,154,1)");
      sky.addColorStop(0.68, "rgba(74,166,224,1)");
      sky.addColorStop(1, "rgba(188,228,250,1)");
    }

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawUpperGlow(ctx, width, height, runtime) {
    const phase = getPhaseLabel(runtime);
    const intensity = getPhaseIntensity(runtime);

    const glowAlpha =
      phase === "CLEAR_WINDOW"
        ? 0.14 + (intensity * 0.04)
        : phase === "LOCKDOWN"
          ? 0.07 + (intensity * 0.03)
          : 0.10 + (intensity * 0.03);

    const glow = ctx.createRadialGradient(
      width * 0.54,
      height * 0.22,
      20,
      width * 0.54,
      height * 0.22,
      width * 0.64
    );

    glow.addColorStop(0, `rgba(240,248,255,${glowAlpha.toFixed(3)})`);
    glow.addColorStop(1, "rgba(180,220,255,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  function drawDistanceWash(ctx, width, height, runtime) {
    const phase = getPhaseLabel(runtime);

    const wash = ctx.createLinearGradient(0, 0, 0, height);

    if (phase === "CLEAR_WINDOW") {
      wash.addColorStop(0, "rgba(255,248,228,0.05)");
      wash.addColorStop(0.45, "rgba(220,238,255,0.03)");
      wash.addColorStop(1, "rgba(16,34,58,0.10)");
    } else if (phase === "LOCKDOWN") {
      wash.addColorStop(0, "rgba(255,255,255,0.03)");
      wash.addColorStop(0.45, "rgba(180,210,236,0.03)");
      wash.addColorStop(1, "rgba(10,20,34,0.16)");
    } else {
      wash.addColorStop(0, "rgba(255,255,255,0.02)");
      wash.addColorStop(0.45, "rgba(188,220,242,0.02)");
      wash.addColorStop(1, "rgba(12,26,44,0.12)");
    }

    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);
  }

  function drawCornerVignette(ctx, width, height, runtime) {
    const phase = getPhaseLabel(runtime);

    const alpha =
      phase === "LOCKDOWN"
        ? 0.18
        : phase === "SEVERE"
          ? 0.14
          : 0.10;

    const vignette = ctx.createRadialGradient(
      width * 0.58,
      height * 0.48,
      width * 0.18,
      width * 0.58,
      height * 0.48,
      width * 0.82
    );

    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, `rgba(8,16,28,${alpha.toFixed(3)})`);

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  function draw(ctx, runtimeOrWidth, maybeHeight) {
    const runtime =
      typeof runtimeOrWidth === "object"
        ? runtimeOrWidth
        : { width: runtimeOrWidth, height: maybeHeight };

    const width = runtime.width;
    const height = runtime.height;

    if (!Number.isFinite(width) || !Number.isFinite(height)) return;

    ctx.save();

    drawSky(ctx, width, height, runtime);
    drawUpperGlow(ctx, width, height, runtime);
    drawDistanceWash(ctx, width, height, runtime);
    drawCornerVignette(ctx, width, height, runtime);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
