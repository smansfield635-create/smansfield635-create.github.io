// PRODUCT_GEOMETRY_ENGINE_v1
// OWNER: SEAN
// MODE: 256-DENSITY · MOBILE-FIRST · NO DRIFT
// PURPOSE:
// - render floating diamond field (products)
// - stable text layer, rotating geometry layer
// - supports tap / slide / swipe integration (external)
// - deterministic, bounded, efficient

export function createProductGeometryEngine() {

  // =============================
  // CONFIG
  // =============================
  const MAX_VISIBLE = 4;         // initial nodes
  const MAX_UNLOCKED = 16;       // full layer
  const ROTATION_SPEED = 0.0008; // base rotation
  const FLOAT_SPEED = 0.0012;
  const DEPTH_SCALE = 0.35;

  // =============================
  // STATE
  // =============================
  let nodes = [];
  let unlockedLevel = 1; // progression system
  let width = 0;
  let height = 0;

  // =============================
  // INIT NODES (256 GRID LOGIC)
  // =============================
  function buildNodes(productList) {
    nodes = [];

    const count = productList.length;

    for (let i = 0; i < count; i++) {

      const angle = (i / count) * Math.PI * 2;

      nodes.push({
        id: productList[i].id,
        label: productList[i].label,

        // polar → cartesian
        baseAngle: angle,
        radius: 0.28 + (i % 4) * 0.08,

        // dynamic state
        rotation: 0,
        floatOffset: Math.random() * Math.PI * 2,

        // position
        x: 0,
        y: 0,
        z: (i % 4) * DEPTH_SCALE,

        visible: i < MAX_VISIBLE
      });
    }
  }

  // =============================
  // RESIZE
  // =============================
  function resize(w, h) {
    width = w;
    height = h;
  }

  // =============================
  // UPDATE LOOP
  // =============================
  function update(time) {

    for (let i = 0; i < nodes.length; i++) {

      const n = nodes[i];

      if (!n.visible) continue;

      // rotation (clockwise / counterclockwise split)
      const dir = (i % 2 === 0) ? 1 : -1;
      n.rotation += ROTATION_SPEED * dir * time;

      // floating motion
      n.floatOffset += FLOAT_SPEED * time;

      const floatY = Math.sin(n.floatOffset) * 12;
      const floatX = Math.cos(n.floatOffset * 0.6) * 8;

      // radial placement
      const cx = width * 0.5;
      const cy = height * 0.5;

      const r = Math.min(width, height) * n.radius;

      n.x = cx + Math.cos(n.baseAngle) * r + floatX;
      n.y = cy + Math.sin(n.baseAngle) * r + floatY;
    }
  }

  // =============================
  // DRAW DIAMOND
  // =============================
  function drawDiamond(ctx, x, y, size, rotation, depth) {

    ctx.save();

    // depth scaling
    const scale = 1 + depth * 0.25;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.rotate(rotation);

    // gradient fill (4K feel)
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

    // inner glow
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // =============================
  // DRAW LABEL (STABLE TEXT)
  // =============================
  function drawLabel(ctx, x, y, text) {

    ctx.save();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 13px system-ui";
    ctx.textAlign = "center";

    ctx.fillText(text, x, y + 28);

    ctx.restore();
  }

  // =============================
  // RENDER
  // =============================
  function render(ctx) {

    for (let i = 0; i < nodes.length; i++) {

      const n = nodes[i];
      if (!n.visible) continue;

      const size = 18 + (n.z * 12);

      // rotating geometry
      drawDiamond(ctx, n.x, n.y, size, n.rotation, n.z);

      // stable label (no rotation)
      drawLabel(ctx, n.x, n.y, n.label);
    }
  }

  // =============================
  // HIT TEST (FOR TAP)
  // =============================
  function hitTest(x, y) {

    for (let i = nodes.length - 1; i >= 0; i--) {

      const n = nodes[i];
      if (!n.visible) continue;

      const dx = x - n.x;
      const dy = y - n.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 30) {
        return n;
      }
    }

    return null;
  }

  // =============================
  // PROGRESSION (UNLOCK MORE NODES)
  // =============================
  function unlockNextLayer() {

    unlockedLevel++;

    const target = Math.min(MAX_VISIBLE * unlockedLevel, MAX_UNLOCKED);

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].visible = i < target;
    }
  }

  // =============================
  // PUBLIC API
  // =============================
  return {
    buildNodes,
    resize,
    update,
    render,
    hitTest,
    unlockNextLayer
  };
}
