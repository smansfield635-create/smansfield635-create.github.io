// TNT — /world/product_geometry.js
// OWNER: SEAN
// MODE: MOBILE-FIRST · DETERMINISTIC · NO DRIFT
// PURPOSE:
// - render floating product diamond field
// - stable label layer, moving geometry layer
// - deterministic bounded motion
// - safe downstream utility, no kernel/world contract dependency

export function createProductGeometryEngine() {
  const MAX_VISIBLE = 4;
  const MAX_UNLOCKED = 16;
  const BASE_ROTATION_SPEED = 0.0008;
  const BASE_FLOAT_SPEED = 0.0012;
  const DEPTH_SCALE = 0.35;
  const HIT_RADIUS_PX = 30;

  let nodes = [];
  let unlockedLevel = 1;
  let width = 0;
  let height = 0;
  let lastTime = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function normalizeLabel(value, fallback) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
  }

  function normalizeId(value, fallback) {
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return fallback;
  }

  function normalizedVisibleTarget() {
    return Math.min(MAX_VISIBLE * unlockedLevel, Math.min(nodes.length, MAX_UNLOCKED));
  }

  function deterministicPhase(index) {
    return (index * 1.61803398875) % (Math.PI * 2);
  }

  function deterministicDepth(index) {
    return (index % 4) * DEPTH_SCALE;
  }

  function deterministicRadius(index) {
    return 0.28 + (index % 4) * 0.08;
  }

  function deterministicDirection(index) {
    return index % 2 === 0 ? 1 : -1;
  }

  function buildNodes(productList = []) {
    const source = Array.isArray(productList) ? productList : [];
    const count = source.length;

    nodes = source.map((item, index) => {
      const angle = count > 0 ? (index / count) * Math.PI * 2 : 0;

      return {
        id: normalizeId(item?.id, `product-${index}`),
        label: normalizeLabel(item?.label, `PRODUCT ${index + 1}`),
        baseAngle: angle,
        radius: deterministicRadius(index),
        rotation: 0,
        floatPhase: deterministicPhase(index),
        depth: deterministicDepth(index),
        x: 0,
        y: 0,
        visible: index < MAX_VISIBLE,
        direction: deterministicDirection(index)
      };
    });

    unlockedLevel = 1;
    lastTime = null;
  }

  function resize(w, h) {
    width = isFiniteNumber(w) ? Math.max(0, w) : 0;
    height = isFiniteNumber(h) ? Math.max(0, h) : 0;
  }

  function update(timeMs = 0) {
    const safeTime = isFiniteNumber(timeMs) ? timeMs : 0;

    if (lastTime === null) {
      lastTime = safeTime;
    }

    const deltaMs = clamp(safeTime - lastTime, 0, 33.3333);
    lastTime = safeTime;

    const cx = width * 0.5;
    const cy = height * 0.5;
    const baseSpan = Math.min(width, height);

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (!node.visible) continue;

      node.rotation += BASE_ROTATION_SPEED * node.direction * deltaMs;
      node.floatPhase += BASE_FLOAT_SPEED * deltaMs;

      const floatY = Math.sin(node.floatPhase) * 12;
      const floatX = Math.cos(node.floatPhase * 0.6) * 8;

      const r = baseSpan * node.radius;

      node.x = cx + Math.cos(node.baseAngle) * r + floatX;
      node.y = cy + Math.sin(node.baseAngle) * r + floatY;
    }
  }

  function drawDiamond(ctx, x, y, size, rotation, depth) {
    ctx.save();

    const scale = 1 + depth * 0.25;
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(rotation);

    const grad = ctx.createLinearGradient(-size, -size, size, size);
    grad.addColorStop(0, "rgba(255,43,43,0.9)");
    grad.addColorStop(0.5, "rgba(201,162,74,0.9)");
    grad.addColorStop(1, "rgba(120,0,22,0.9)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  function drawLabel(ctx, x, y, text) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 13px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y + 28);
    ctx.restore();
  }

  function render(ctx) {
    if (!ctx) return;

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (!node.visible) continue;

      const size = 18 + node.depth * 12;
      drawDiamond(ctx, node.x, node.y, size, node.rotation, node.depth);
      drawLabel(ctx, node.x, node.y, node.label);
    }
  }

  function hitTest(x, y) {
    const px = isFiniteNumber(x) ? x : 0;
    const py = isFiniteNumber(y) ? y : 0;

    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const node = nodes[i];
      if (!node.visible) continue;

      const dx = px - node.x;
      const dy = py - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < HIT_RADIUS_PX) {
        return node;
      }
    }

    return null;
  }

  function unlockNextLayer() {
    unlockedLevel += 1;
    const target = normalizedVisibleTarget();

    for (let i = 0; i < nodes.length; i += 1) {
      nodes[i].visible = i < target;
    }
  }

  function getSnapshot() {
    return Object.freeze({
      width,
      height,
      unlockedLevel,
      visibleCount: nodes.reduce((total, node) => total + (node.visible ? 1 : 0), 0),
      totalCount: nodes.length
    });
  }

  return Object.freeze({
    buildNodes,
    resize,
    update,
    render,
    hitTest,
    unlockNextLayer,
    getSnapshot
  });
}
