function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildEllipsePolygon(cx, cy, rx, ry, rotation, segments) {
  const points = [];
  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const ex = Math.cos(t) * rx;
    const ey = Math.sin(t) * ry;

    const px = cx + (ex * Math.cos(rotation)) - (ey * Math.sin(rotation));
    const py = cy + (ex * Math.sin(rotation)) + (ey * Math.cos(rotation));
    points.push([px / 1000, py / 520]);
  }
  return points;
}

export function buildHarborSandbarArc() {
  const count = 4;
  const startX = 650;
  const startY = 385;
  const endX = 860;
  const endY = 330;

  const bars = [];

  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : i / (count - 1);

    const cx = lerp(startX, endX, t);
    const cy = lerp(startY, endY, t) - (Math.sin(t * Math.PI) * 24);

    const width = lerp(42, 24, t);
    const height = lerp(12, 8, t);
    const rotation = lerp(-0.18, 0.22, t);
    const segments = clamp(Math.round(width / 4), 12, 20);

    bars.push({
      id: `sandbar_${i + 1}`,
      polygon: buildEllipsePolygon(cx, cy, width, height, rotation, segments),
      center: [cx / 1000, cy / 520]
    });
  }

  return bars;
}
