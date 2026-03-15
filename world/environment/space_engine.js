export function createSpaceEngine() {
  const classes = Object.freeze({
    stars: Object.freeze({ enabled: true, coverage: "256x256" }),
    nebula: Object.freeze({ enabled: true, coverage: "256x256" }),
    orbits: Object.freeze({ enabled: true, coverage: "256x256" }),
    bodies: Object.freeze({ enabled: true, coverage: "256x256" })
  });

  function drawBackdrop(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#020611");
    gradient.addColorStop(0.22, "#06101f");
    gradient.addColorStop(0.58, "#040813");
    gradient.addColorStop(1, "#010309");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawNebula(ctx, state) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const bands = [
      { x: 0.18, y: 0.16, rx: 0.34, ry: 0.12, rot: -0.38, c0: "rgba(74,124,255,0.20)", c1: "rgba(36,60,145,0)" },
      { x: 0.72, y: 0.14, rx: 0.28, ry: 0.10, rot: 0.14, c0: "rgba(118,96,255,0.16)", c1: "rgba(58,38,145,0)" },
      { x: 0.60, y: 0.34, rx: 0.24, ry: 0.08, rot: -0.08, c0: "rgba(78,140,255,0.10)", c1: "rgba(28,72,155,0)" }
    ];

    ctx.save();
    bands.forEach((band, index) => {
      const wobbleX = Math.sin(state.time * 0.00012 + index * 1.31) * width * 0.018;
      const wobbleY = Math.cos(state.time * 0.00010 + index * 1.07) * height * 0.014;
      const cx = width * band.x + wobbleX;
      const cy = height * band.y + wobbleY;
      const rx = width * band.rx;
      const ry = height * band.ry;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gradient.addColorStop(0, band.c0);
      gradient.addColorStop(0.48, "rgba(70,105,255,0.06)");
      gradient.addColorStop(1, band.c1);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, band.rot, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawStars(ctx, state) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const count = 180;

    for (let i = 0; i < count; i += 1) {
      const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * width;
      const y = (Math.cos(i * 51.3) * 0.5 + 0.5) * height;
      const twinkle = 0.28 + 0.72 * Math.sin(state.time * 0.001 + i * 0.73);
      const size = i % 19 === 0 ? 2.6 : i % 7 === 0 ? 2.0 : 1.45;

      ctx.globalAlpha = twinkle * (i % 19 === 0 ? 0.98 : 0.8);
      ctx.fillStyle = i % 13 === 0 ? "rgba(235,242,255,0.98)" : "#dfe8ff";
      ctx.fillRect(x, y, size, size);
    }

    ctx.globalAlpha = 1;
  }

  function drawOrbits(ctx, projector) {
    const { centerX, centerY, radius } = projector.state;

    ctx.save();
    ctx.strokeStyle = "rgba(120, 165, 255, 0.07)";
    ctx.lineWidth = 1;

    for (let i = 1; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * (1.18 + i * 0.13), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawBodies(ctx, state) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "rgba(215,230,255,0.45)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 6; i += 1) {
      const x = ((i + 1) / 7) * width + Math.sin(state.time * 0.00016 + i) * 14;
      const y = (0.10 + (i % 3) * 0.12) * height + Math.cos(state.time * 0.00011 + i) * 10;
      ctx.beginPath();
      ctx.moveTo(x - 7, y + 2.5);
      ctx.lineTo(x + 7, y - 2.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  function render(ctx, projector, runtime, state) {
    drawBackdrop(ctx);
    drawNebula(ctx, state);
    drawStars(ctx, state);
    drawOrbits(ctx, projector);
    drawBodies(ctx, state);
  }

  return Object.freeze({
    classes,
    render
  });
}
