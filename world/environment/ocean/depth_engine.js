export function createOceanDepthEngine() {
  function render(ctx, projector) {
    const { centerX, centerY, radius } = projector.state;

    const globeGradient = ctx.createRadialGradient(
      centerX - radius * 0.30,
      centerY - radius * 0.26,
      radius * 0.05,
      centerX + radius * 0.08,
      centerY + radius * 0.08,
      radius * 1.02
    );
    globeGradient.addColorStop(0, "#3fb9ff");
    globeGradient.addColorStop(0.12, "#1690ff");
    globeGradient.addColorStop(0.26, "#0e62ca");
    globeGradient.addColorStop(0.44, "#083f94");
    globeGradient.addColorStop(0.68, "#04214d");
    globeGradient.addColorStop(1, "#010812");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = globeGradient;
    ctx.fill();

    const night = ctx.createLinearGradient(
      centerX - radius,
      centerY - radius * 0.12,
      centerX + radius * 0.90,
      centerY + radius * 0.16
    );
    night.addColorStop(0, "rgba(0,0,0,0.28)");
    night.addColorStop(0.30, "rgba(0,0,0,0.18)");
    night.addColorStop(0.58, "rgba(0,0,0,0.05)");
    night.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
    ctx.fillStyle = night;
    ctx.fill();

    const oceanTone = ctx.createRadialGradient(
      centerX - radius * 0.12,
      centerY - radius * 0.14,
      radius * 0.03,
      centerX,
      centerY,
      radius
    );
    oceanTone.addColorStop(0, "rgba(122,232,255,0.08)");
    oceanTone.addColorStop(0.20, "rgba(66,190,255,0.05)");
    oceanTone.addColorStop(0.46, "rgba(20,118,214,0.03)");
    oceanTone.addColorStop(1, "rgba(4,34,90,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.988, 0, Math.PI * 2);
    ctx.fillStyle = oceanTone;
    ctx.fill();
  }

  return Object.freeze({
    render
  });
}
