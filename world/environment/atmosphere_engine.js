import { WORLD_KERNEL } from "../world_kernel.js";

export function createAtmosphereEngine() {
  const classes = Object.freeze({
    wind: Object.freeze({ enabled: true, coverage: "256x256" }),
    atmospheric_discharge: Object.freeze({ enabled: true, coverage: "256x256" }),
    moisture: Object.freeze({ enabled: true, coverage: "256x256" }),
    temperature: Object.freeze({ enabled: true, coverage: "256x256" })
  });

  function renderOuter(ctx, projector) {
    const { centerX, centerY, radius } = projector.state;

    ctx.save();
    const shadow = ctx.createRadialGradient(
      centerX + radius * 0.24,
      centerY + radius * 0.18,
      radius * 0.06,
      centerX + radius * 0.22,
      centerY + radius * 0.18,
      radius * 1.06
    );
    shadow.addColorStop(0, "rgba(0,0,0,0)");
    shadow.addColorStop(0.44, "rgba(0,0,0,0.04)");
    shadow.addColorStop(0.70, "rgba(0,0,0,0.15)");
    shadow.addColorStop(1, "rgba(0,0,0,0.30)");
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.03, 0, Math.PI * 2);
    ctx.fillStyle = shadow;
    ctx.fill();
    ctx.restore();

    ctx.save();
    const outerGlow = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.96,
      centerX,
      centerY,
      radius * 1.30
    );
    outerGlow.addColorStop(0, "rgba(110,180,255,0)");
    outerGlow.addColorStop(0.58, "rgba(84,146,255,0.03)");
    outerGlow.addColorStop(0.80, "rgba(72,125,255,0.10)");
    outerGlow.addColorStop(1, "rgba(44,92,210,0)");
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.30, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow;
    ctx.fill();
    ctx.restore();

    const thickness = radius * WORLD_KERNEL.constants.atmosphereThicknessFactor;
    const shell = ctx.createRadialGradient(
      centerX,
      centerY - radius * 0.06,
      radius * 0.98,
      centerX,
      centerY - radius * 0.08,
      radius + thickness * 2.7
    );
    shell.addColorStop(0, "rgba(75,145,255,0)");
    shell.addColorStop(0.72, "rgba(84,168,255,0.03)");
    shell.addColorStop(0.84, "rgba(112,216,255,0.22)");
    shell.addColorStop(0.92, "rgba(160,235,255,0.22)");
    shell.addColorStop(1, "rgba(75,145,255,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + thickness * 2.7, 0, Math.PI * 2);
    ctx.fillStyle = shell;
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.16;
    const upperAccent = ctx.createRadialGradient(
      centerX,
      centerY - radius * 0.44,
      radius * 0.04,
      centerX,
      centerY - radius * 0.44,
      radius * 0.42
    );
    upperAccent.addColorStop(0, "rgba(205,240,255,0.36)");
    upperAccent.addColorStop(0.55, "rgba(120,220,255,0.10)");
    upperAccent.addColorStop(1, "rgba(120,220,255,0)");
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - radius * 0.46, radius * 0.42, radius * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = upperAccent;
    ctx.fill();
    ctx.restore();
  }

  function renderInner(ctx, projector, runtime, state) {
    const { centerX, centerY, radius } = projector.state;

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = "rgba(220,245,255,0.58)";
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - radius * 0.72, radius * 0.28, radius * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 4; i += 1) {
      const arcRadius = radius * (0.44 + i * 0.08);
      const start = 0.14 * Math.PI + Math.sin(state.time * 0.0007 + i * 0.8) * 0.05;
      const end = 0.70 * Math.PI + Math.cos(state.time * 0.00055 + i * 0.6) * 0.04;
      ctx.beginPath();
      ctx.arc(centerX, centerY - radius * 0.22, arcRadius, start, end);
      ctx.strokeStyle = "rgba(225,238,255,0.84)";
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }
    ctx.restore();

    const cloudBodies = [
      { x: -0.10, y: -0.22, rx: 0.22, ry: 0.06, rot: -0.10 },
      { x: 0.12, y: -0.08, rx: 0.28, ry: 0.07, rot: 0.04 },
      { x: 0.04, y: 0.08, rx: 0.18, ry: 0.055, rot: -0.06 }
    ];

    ctx.save();
    ctx.globalAlpha = 0.07;
    cloudBodies.forEach((body, index) => {
      const wobbleX = Math.sin(state.time * 0.00018 + index) * radius * 0.018;
      const wobbleY = Math.cos(state.time * 0.00015 + index) * radius * 0.010;
      ctx.beginPath();
      ctx.ellipse(
        centerX + radius * body.x + wobbleX,
        centerY + radius * body.y + wobbleY,
        radius * body.rx,
        radius * body.ry,
        body.rot,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(240,248,255,0.72)";
      ctx.fill();
    });
    ctx.restore();

    const sheen = ctx.createRadialGradient(
      centerX - radius * 0.30,
      centerY - radius * 0.26,
      radius * 0.03,
      centerX,
      centerY,
      radius
    );
    sheen.addColorStop(0, "rgba(255,255,255,0.08)");
    sheen.addColorStop(0.14, "rgba(255,255,255,0.04)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = sheen;
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.18;
    const terminator = ctx.createLinearGradient(
      centerX - radius,
      centerY - radius * 0.14,
      centerX + radius,
      centerY + radius * 0.12
    );
    terminator.addColorStop(0, "rgba(0,0,0,0)");
    terminator.addColorStop(0.30, "rgba(0,0,0,0.14)");
    terminator.addColorStop(0.42, "rgba(150,225,255,0.14)");
    terminator.addColorStop(0.54, "rgba(255,255,255,0.025)");
    terminator.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.996, 0, Math.PI * 2);
    ctx.fillStyle = terminator;
    ctx.fill();
    ctx.restore();
  }

  function renderOutline(ctx, projector) {
    const { centerX, centerY, radius } = projector.state;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1.35;
    ctx.stroke();
  }

  return Object.freeze({
    classes,
    renderOuter,
    renderInner,
    renderOutline
  });
}
