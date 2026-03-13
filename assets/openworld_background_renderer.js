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

  function getPlanetGeometry(runtime, width, height) {
    const northProgress = getNorthProgress(runtime);
    const eastProgress = getEastProgress(runtime);

    const centerX =
      lerp(width * 0.34, width * 0.22, northProgress) +
      ((eastProgress - 0.5) * width * 0.08);

    const centerY = lerp(height * 1.42, height * 1.10, northProgress);

    const radius = lerp(width * 1.18, width * 0.92, northProgress);
    const visibleLift = lerp(height * 0.10, height * 0.22, northProgress);

    const horizonY = centerY - radius + visibleLift;

    return {
      centerX,
      centerY,
      radius,
      horizonY,
      northProgress,
      eastProgress
    };
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

  function drawPlanetBody(ctx, width, height, runtime, planet) {
    const phase = getPhaseLabel(runtime);

    const body = ctx.createRadialGradient(
      planet.centerX,
      planet.centerY - (planet.radius * 0.42),
      planet.radius * 0.16,
      planet.centerX,
      planet.centerY,
      planet.radius
    );

    if (phase === "CLEAR_WINDOW") {
      body.addColorStop(0, "rgba(70,132,186,0.58)");
      body.addColorStop(0.34, "rgba(42,96,152,0.74)");
      body.addColorStop(0.68, "rgba(22,58,104,0.88)");
      body.addColorStop(1, "rgba(8,24,48,0.96)");
    } else if (phase === "LOCKDOWN") {
      body.addColorStop(0, "rgba(62,96,142,0.42)");
      body.addColorStop(0.34, "rgba(34,64,108,0.62)");
      body.addColorStop(0.68, "rgba(18,38,72,0.82)");
      body.addColorStop(1, "rgba(6,16,32,0.94)");
    } else if (phase === "SEVERE") {
      body.addColorStop(0, "rgba(68,114,164,0.48)");
      body.addColorStop(0.34, "rgba(38,76,124,0.66)");
      body.addColorStop(0.68, "rgba(18,42,82,0.84)");
      body.addColorStop(1, "rgba(6,18,36,0.95)");
    } else {
      body.addColorStop(0, "rgba(74,126,176,0.50)");
      body.addColorStop(0.34, "rgba(42,88,138,0.70)");
      body.addColorStop(0.68, "rgba(20,50,92,0.86)");
      body.addColorStop(1, "rgba(8,20,40,0.95)");
    }

    ctx.beginPath();
    ctx.arc(planet.centerX, planet.centerY, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill();
  }

  function drawAtmosphericLimb(ctx, width, height, runtime, planet) {
    const phase = getPhaseLabel(runtime);
    const intensity = getPhaseIntensity(runtime);

    const limb = ctx.createRadialGradient(
      planet.centerX,
      planet.centerY,
      planet.radius * 0.88,
      planet.centerX,
      planet.centerY,
      planet.radius * 1.08
    );

    if (phase === "CLEAR_WINDOW") {
      limb.addColorStop(0, "rgba(170,220,255,0)");
      limb.addColorStop(0.72, `rgba(176,224,255,${(0.08 + (intensity * 0.03)).toFixed(3)})`);
      limb.addColorStop(0.88, `rgba(214,240,255,${(0.16 + (intensity * 0.05)).toFixed(3)})`);
      limb.addColorStop(1, "rgba(214,240,255,0)");
    } else if (phase === "LOCKDOWN") {
      limb.addColorStop(0, "rgba(166,204,236,0)");
      limb.addColorStop(0.72, `rgba(144,182,220,${(0.06 + (intensity * 0.03)).toFixed(3)})`);
      limb.addColorStop(0.88, `rgba(194,220,246,${(0.11 + (intensity * 0.04)).toFixed(3)})`);
      limb.addColorStop(1, "rgba(194,220,246,0)");
    } else {
      limb.addColorStop(0, "rgba(166,210,244,0)");
      limb.addColorStop(0.72, `rgba(148,196,232,${(0.07 + (intensity * 0.03)).toFixed(3)})`);
      limb.addColorStop(0.88, `rgba(204,230,250,${(0.13 + (intensity * 0.04)).toFixed(3)})`);
      limb.addColorStop(1, "rgba(204,230,250,0)");
    }

    ctx.beginPath();
    ctx.arc(planet.centerX, planet.centerY, planet.radius * 1.10, 0, Math.PI * 2);
    ctx.fillStyle = limb;
    ctx.fill();
  }

  function drawPlanetHorizonGlow(ctx, width, height, runtime, planet) {
    const phase = getPhaseLabel(runtime);
    const intensity = getPhaseIntensity(runtime);

    const glowHeight = height * 0.34;
    const glow = ctx.createLinearGradient(
      0,
      planet.horizonY - glowHeight * 0.35,
      0,
      planet.horizonY + glowHeight
    );

    if (phase === "CLEAR_WINDOW") {
      glow.addColorStop(0, `rgba(255,244,220,${(0.05 + (intensity * 0.03)).toFixed(3)})`);
      glow.addColorStop(0.28, `rgba(202,232,255,${(0.08 + (intensity * 0.03)).toFixed(3)})`);
      glow.addColorStop(0.72, "rgba(88,156,216,0.03)");
      glow.addColorStop(1, "rgba(30,72,120,0)");
    } else if (phase === "LOCKDOWN") {
      glow.addColorStop(0, `rgba(224,236,248,${(0.03 + (intensity * 0.02)).toFixed(3)})`);
      glow.addColorStop(0.28, `rgba(168,198,228,${(0.05 + (intensity * 0.02)).toFixed(3)})`);
      glow.addColorStop(0.72, "rgba(74,112,154,0.03)");
      glow.addColorStop(1, "rgba(24,44,72,0)");
    } else {
      glow.addColorStop(0, `rgba(232,240,250,${(0.04 + (intensity * 0.02)).toFixed(3)})`);
      glow.addColorStop(0.28, `rgba(176,208,236,${(0.06 + (intensity * 0.02)).toFixed(3)})`);
      glow.addColorStop(0.72, "rgba(84,132,184,0.03)");
      glow.addColorStop(1, "rgba(28,56,92,0)");
    }

    ctx.fillStyle = glow;
    ctx.fillRect(0, planet.horizonY - glowHeight * 0.35, width, glowHeight * 1.35);
  }

  function drawUpperGlow(ctx, width, height, runtime, planet) {
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
      Math.min(height * 0.24, planet.horizonY * 0.55),
      20,
      width * 0.54,
      Math.min(height * 0.24, planet.horizonY * 0.55),
      width * 0.64
    );

    glow.addColorStop(0, `rgba(240,248,255,${glowAlpha.toFixed(3)})`);
    glow.addColorStop(1, "rgba(180,220,255,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  function drawDistanceWash(ctx, width, height, runtime, planet) {
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

    const lowerBodyWash = ctx.createLinearGradient(0, planet.horizonY, 0, height);
    lowerBodyWash.addColorStop(0, "rgba(210,230,250,0.00)");
    lowerBodyWash.addColorStop(0.55, "rgba(46,84,130,0.04)");
    lowerBodyWash.addColorStop(1, "rgba(10,20,34,0.12)");
    ctx.fillStyle = lowerBodyWash;
    ctx.fillRect(0, Math.max(0, planet.horizonY), width, height - Math.max(0, planet.horizonY));
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

    const planet = getPlanetGeometry(runtime, width, height);

    ctx.save();

    drawSky(ctx, width, height, runtime);
    drawPlanetBody(ctx, width, height, runtime, planet);
    drawAtmosphericLimb(ctx, width, height, runtime, planet);
    drawPlanetHorizonGlow(ctx, width, height, runtime, planet);
    drawUpperGlow(ctx, width, height, runtime, planet);
    drawDistanceWash(ctx, width, height, runtime, planet);
    drawCornerVignette(ctx, width, height, runtime);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
