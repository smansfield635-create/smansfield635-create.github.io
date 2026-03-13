import { getPlanetBodyGeometry } from "../variant/planet_surface_projector.js";

export function createBackgroundRenderer() {

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function getPhase(runtime) {
    return runtime?.phase?.globalPhase ?? "CALM";
  }

  function getIntensity(runtime) {
    const v = runtime?.phase?.intensity;
    return Number.isFinite(v) ? clamp(v, 0, 1) : 0.2;
  }

  function drawSky(ctx, width, height, phase) {

    const sky = ctx.createLinearGradient(0, 0, 0, height);

    if (phase === "CLEAR_WINDOW") {
      sky.addColorStop(0, "#0a224a");
      sky.addColorStop(0.3, "#1c5caa");
      sky.addColorStop(0.6, "#60baec");
      sky.addColorStop(1, "#cef0ff");
    }
    else if (phase === "LOCKDOWN") {
      sky.addColorStop(0, "#0c162a");
      sky.addColorStop(0.4, "#1a3662");
      sky.addColorStop(0.7, "#527eaa");
      sky.addColorStop(1, "#9ab8d2");
    }
    else if (phase === "SEVERE") {
      sky.addColorStop(0, "#0a1c3a");
      sky.addColorStop(0.35, "#18467e");
      sky.addColorStop(0.7, "#5892c6");
      sky.addColorStop(1, "#b0d2e8");
    }
    else {
      sky.addColorStop(0, "#0a224a");
      sky.addColorStop(0.35, "#1a569a");
      sky.addColorStop(0.7, "#4aa6e0");
      sky.addColorStop(1, "#bce4fa");
    }

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawPlanet(ctx, planet, phase, intensity) {

    const gradient = ctx.createRadialGradient(
      planet.centerX,
      planet.centerY - planet.radius * 0.4,
      planet.radius * 0.2,
      planet.centerX,
      planet.centerY,
      planet.radius
    );

    if (phase === "CLEAR_WINDOW") {
      gradient.addColorStop(0, `rgba(70,132,186,${0.5 + intensity * 0.1})`);
      gradient.addColorStop(0.4, `rgba(42,96,152,${0.7 + intensity * 0.1})`);
      gradient.addColorStop(1, `rgba(8,24,48,0.95)`);
    }
    else if (phase === "LOCKDOWN") {
      gradient.addColorStop(0, `rgba(62,96,142,0.4)`);
      gradient.addColorStop(0.4, `rgba(34,64,108,0.6)`);
      gradient.addColorStop(1, `rgba(6,16,32,0.95)`);
    }
    else {
      gradient.addColorStop(0, `rgba(74,126,176,0.5)`);
      gradient.addColorStop(0.4, `rgba(42,88,138,0.7)`);
      gradient.addColorStop(1, `rgba(8,20,40,0.95)`);
    }

    ctx.beginPath();
    ctx.arc(planet.centerX, planet.centerY, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function drawAtmosphere(ctx, planet, phase, intensity) {

    const limb = ctx.createRadialGradient(
      planet.centerX,
      planet.centerY,
      planet.radius * 0.9,
      planet.centerX,
      planet.centerY,
      planet.radius * 1.1
    );

    const alpha = 0.12 + intensity * 0.05;

    limb.addColorStop(0, "rgba(0,0,0,0)");
    limb.addColorStop(0.75, `rgba(190,220,255,${alpha})`);
    limb.addColorStop(1, "rgba(200,230,255,0)");

    ctx.beginPath();
    ctx.arc(planet.centerX, planet.centerY, planet.radius * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = limb;
    ctx.fill();
  }

  function drawHorizonGlow(ctx, width, planet) {

    const glow = ctx.createLinearGradient(
      0,
      planet.horizonY - 100,
      0,
      planet.horizonY + 300
    );

    glow.addColorStop(0, "rgba(255,240,210,0.08)");
    glow.addColorStop(0.4, "rgba(200,230,255,0.06)");
    glow.addColorStop(1, "rgba(20,60,120,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, planet.horizonY - 120, width, 420);
  }

  function draw(ctx, runtime) {

    const width = runtime.width;
    const height = runtime.height;

    const phase = getPhase(runtime);
    const intensity = getIntensity(runtime);

    const planet = getPlanetBodyGeometry(runtime);

    ctx.save();

    drawSky(ctx, width, height, phase);
    drawPlanet(ctx, planet, phase, intensity);
    drawAtmosphere(ctx, planet, phase, intensity);
    drawHorizonGlow(ctx, width, planet);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
