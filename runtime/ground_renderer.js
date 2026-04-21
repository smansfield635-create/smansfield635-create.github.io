const META = Object.freeze({
  name: "GROUND_RENDERER",
  version: "G1_EXTERNAL_BASELINE",
  role: "ground_and_house_renderer",
  contract: "GROUND_RENDERER_CONTRACT_G1",
  status: "ACTIVE",
  deterministic: true
});

function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function drawPolygon(ctx, points, close = true) {
  if (!ctx || !Array.isArray(points) || points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  if (close) ctx.closePath();
}

function projectPolygon(projection, polygon = []) {
  return polygon.map((point) => projection.project(point));
}

function drawNode(ctx, projection, node, options = {}) {
  if (!ctx || !projection || !node) return;

  const p = projection.project(node);
  const radius = Math.max(
    Number.isFinite(options.minRadius) ? options.minRadius : 2,
    projection.projectRadius(Number.isFinite(node.radius) ? node.radius : 3)
  );

  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = options.fillStyle || "rgba(255,255,255,0.9)";
  ctx.fill();

  if (options.strokeStyle) {
    ctx.strokeStyle = options.strokeStyle;
    ctx.lineWidth = options.lineWidth || 1;
    ctx.stroke();
  }

  if (options.label && node.label) {
    ctx.fillStyle = options.labelStyle || "rgba(235,245,255,0.88)";
    ctx.font = options.font || "11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText(node.label, p.x, p.y - radius - 10);
  }
}

export function renderGroundLayer(ctx, snapshot, projection) {
  if (!ctx || !snapshot || !projection) return;

  const worldProjection =
    snapshot.projection && typeof snapshot.projection === "object" ? snapshot.projection : {};

  const waters = Array.isArray(worldProjection.waters) ? worldProjection.waters : [];
  const regions = Array.isArray(worldProjection.regions) ? worldProjection.regions : [];
  const gridLines = Array.isArray(worldProjection.gridLines) ? worldProjection.gridLines : [];
  const paths = Array.isArray(worldProjection.paths) ? worldProjection.paths : [];
  const rooms = Array.isArray(worldProjection.rooms) ? worldProjection.rooms : [];
  const house = worldProjection.house || null;

  const renderPacket =
    snapshot.renderPacket && typeof snapshot.renderPacket === "object"
      ? snapshot.renderPacket
      : {};

  const visible = renderPacket.visible || {};
  const depth = clamp01(Number(visible.depthOutput || 0.5));
  const luminance = clamp01(Number(visible.luminanceOutput || 0.5));
  const motionDelta = clamp01(Number(((visible.motionOutput || {}).delta) || 0));

  const frameRadius = Number(
    (projection && projection.scale && projection.scale > 0
      ? Math.min(projection.width, projection.height) * 0.34 / projection.scale
      : 136)
  );

  ctx.save();

  const shellRadius = Math.max(24, projection.projectRadius(frameRadius));

  const shell = ctx.createRadialGradient(
    projection.cx,
    projection.cy,
    shellRadius * 0.12,
    projection.cx,
    projection.cy,
    shellRadius
  );
  shell.addColorStop(0, "rgba(23,36,56,0.98)");
  shell.addColorStop(0.58, "rgba(10,20,32,0.96)");
  shell.addColorStop(1, "rgba(4,8,14,0.98)");

  ctx.beginPath();
  ctx.arc(projection.cx, projection.cy, shellRadius, 0, Math.PI * 2);
  ctx.fillStyle = shell;
  ctx.fill();

  waters.forEach((water) => {
    const polygon = projectPolygon(projection, water.polygon || []);
    drawPolygon(ctx, polygon, true);
    ctx.fillStyle = "rgba(34,96,150," + (0.18 + depth * 0.10).toFixed(3) + ")";
    ctx.fill();
    ctx.strokeStyle = "rgba(124,202,255," + (0.20 + luminance * 0.12).toFixed(3) + ")";
    ctx.lineWidth = 1.25;
    ctx.stroke();
  });

  regions.forEach((region, index) => {
    const polygon = projectPolygon(projection, region.polygon || []);
    drawPolygon(ctx, polygon, true);

    if (index === 0) {
      ctx.fillStyle = "rgba(44,62,46," + (0.34 + depth * 0.10).toFixed(3) + ")";
    } else {
      ctx.fillStyle = "rgba(68,84,72," + (0.26 + luminance * 0.08).toFixed(3) + ")";
    }

    ctx.fill();
    ctx.strokeStyle = "rgba(205,228,214,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(255,255,255," + (0.05 + motionDelta * 0.10).toFixed(3) + ")";
  ctx.lineWidth = 1;

  gridLines.forEach((line) => {
    const a = projection.project(line.a || {});
    const b = projection.project(line.b || {});
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  paths.forEach((path) => {
    const points = Array.isArray(path.points) ? path.points.map((point) => projection.project(point)) : [];
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.strokeStyle =
      path.type === "spine"
        ? "rgba(255,226,155,0.44)"
        : "rgba(196,224,255,0.24)";
    ctx.lineWidth = path.type === "spine" ? 2.2 : 1.2;
    ctx.stroke();
  });

  if (house) {
    drawNode(ctx, projection, house, {
      minRadius: 6,
      fillStyle: "rgba(246,240,214,0.92)",
      strokeStyle: "rgba(255,255,255,0.42)",
      lineWidth: 1.4,
      label: true
    });
  }

  rooms.forEach((room) => {
    drawNode(ctx, projection, room, {
      minRadius: 4,
      fillStyle: room.entry ? "rgba(255,230,170,0.86)" : "rgba(220,236,255,0.76)",
      strokeStyle: "rgba(255,255,255,0.18)",
      lineWidth: 1,
      label: true
    });
  });

  const rim = ctx.createRadialGradient(
    projection.cx,
    projection.cy,
    shellRadius * 0.72,
    projection.cx,
    projection.cy,
    shellRadius * 1.02
  );
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(0.72, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(163,219,255,0.18)");

  ctx.beginPath();
  ctx.arc(projection.cx, projection.cy, shellRadius, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();

  ctx.restore();
}

const GROUND_RENDERER_API = Object.freeze({
  meta: META,
  renderGroundLayer
});

if (typeof window !== "undefined") {
  window.groundRenderer = GROUND_RENDERER_API;
  window.GroundRenderer = GROUND_RENDERER_API;
  window.__GROUND_RENDERER_DISABLED__ = false;
}

export default GROUND_RENDERER_API;
