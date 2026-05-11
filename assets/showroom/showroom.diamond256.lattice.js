// /assets/showroom/showroom.diamond256.lattice.js
// SHOWROOM_256_FACE_FIBONACCI_DIAMOND_LATTICE_TNT_v2
// Full-file replacement.
//
// Purpose:
// - Replace the flat/plate-like showroom diamond with a true rotating 3D construct.
// - Preserve the 256 nodal construct as 16 rings × 16 nodes.
// - Remove the visible Fibonacci zigzag line from the design.
// - Retain Fibonacci influence structurally through ring-phase offsets and progression rhythm,
//   not as a drawn path.
// - Render a volumetric faceted diamond object suitable for the Showroom cover.
// - Keep parent mutation forbidden.
// - Keep generated image false.
// - Keep GraphicBox false.
// - Keep visual pass claim false.

const CONTRACT = "SHOWROOM_256_FACE_FIBONACCI_DIAMOND_LATTICE_TNT_v2";
const PREVIOUS_CONTRACT = "SHOWROOM_256_FACE_FIBONACCI_DIAMOND_LATTICE_TNT_v1";
const ASSET_PATH = "/assets/showroom/showroom.diamond256.lattice.js";

const TOTAL_NODES = 256;
const RINGS = 16;
const NODES_PER_RING = 16;

const FIBONACCI_SEQUENCE = Object.freeze([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);

const RING_PROFILE = Object.freeze([
  { y:  1.08, r: 0.30 }, // top table / crown
  { y:  0.96, r: 0.44 },
  { y:  0.82, r: 0.58 },
  { y:  0.68, r: 0.72 },
  { y:  0.52, r: 0.86 },
  { y:  0.36, r: 0.98 },
  { y:  0.18, r: 1.08 },
  { y:  0.02, r: 1.16 }, // girdle-like maximum
  { y: -0.08, r: 1.10 },
  { y: -0.24, r: 0.96 },
  { y: -0.40, r: 0.80 },
  { y: -0.56, r: 0.64 },
  { y: -0.72, r: 0.48 },
  { y: -0.86, r: 0.30 },
  { y: -0.98, r: 0.16 },
  { y: -1.10, r: 0.04 }  // culet / bottom point
]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function rotatePoint(point, yaw, pitch, roll) {
  let { x, y, z } = point;

  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  let rx = x * cosY - z * sinY;
  let rz = x * sinY + z * cosY;
  x = rx;
  z = rz;

  const cosX = Math.cos(pitch);
  const sinX = Math.sin(pitch);
  let ry = y * cosX - z * sinX;
  rz = y * sinX + z * cosX;
  y = ry;
  z = rz;

  const cosZ = Math.cos(roll);
  const sinZ = Math.sin(roll);
  rx = x * cosZ - y * sinZ;
  ry = x * sinZ + y * cosZ;
  x = rx;
  y = ry;

  return { x, y, z };
}

function projectPoint(point, width, height, cameraDistance, fov) {
  const depth = cameraDistance - point.z;
  const scale = fov / Math.max(depth, 0.001);

  return {
    x: width * 0.5 + point.x * scale,
    y: height * 0.5 + point.y * scale,
    z: point.z,
    scale
  };
}

function createNodeField() {
  const nodes = [];
  const step = (Math.PI * 2) / NODES_PER_RING;

  for (let ringIndex = 0; ringIndex < RINGS; ringIndex += 1) {
    const profile = RING_PROFILE[ringIndex];
    const fib = FIBONACCI_SEQUENCE[ringIndex % FIBONACCI_SEQUENCE.length];
    const offset = ((fib % NODES_PER_RING) / NODES_PER_RING) * Math.PI * 2 * 0.25;

    for (let nodeIndex = 0; nodeIndex < NODES_PER_RING; nodeIndex += 1) {
      const angle = nodeIndex * step + offset;
      const ringWeight = ringIndex / (RINGS - 1);

      nodes.push({
        id: ringIndex * NODES_PER_RING + nodeIndex,
        ringIndex,
        nodeIndex,
        phase: fib,
        x: Math.cos(angle) * profile.r,
        y: profile.y,
        z: Math.sin(angle) * profile.r,
        weight: ringWeight
      });
    }
  }

  return nodes;
}

function createFacetIndex() {
  const triangles = [];

  for (let ring = 0; ring < RINGS - 1; ring += 1) {
    for (let node = 0; node < NODES_PER_RING; node += 1) {
      const current = ring * NODES_PER_RING + node;
      const next = ring * NODES_PER_RING + ((node + 1) % NODES_PER_RING);
      const lower = (ring + 1) * NODES_PER_RING + node;
      const lowerNext = (ring + 1) * NODES_PER_RING + ((node + 1) % NODES_PER_RING);

      triangles.push([current, lower, next]);
      triangles.push([next, lower, lowerNext]);
    }
  }

  return triangles;
}

function createEdgeIndex() {
  const edges = [];

  for (let ring = 0; ring < RINGS; ring += 1) {
    for (let node = 0; node < NODES_PER_RING; node += 1) {
      const current = ring * NODES_PER_RING + node;
      const next = ring * NODES_PER_RING + ((node + 1) % NODES_PER_RING);
      edges.push([current, next]);

      if (ring < RINGS - 1) {
        const lower = (ring + 1) * NODES_PER_RING + node;
        edges.push([current, lower]);
      }
    }
  }

  return edges;
}

function createStars(count = 64, seed = 451) {
  const stars = [];
  let value = seed;

  for (let i = 0; i < count; i += 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const x = (value % 10000) / 10000;
    value = (value * 1664525 + 1013904223) >>> 0;
    const y = (value % 10000) / 10000;
    value = (value * 1664525 + 1013904223) >>> 0;
    const s = 0.8 + ((value % 1000) / 1000) * 1.8;
    value = (value * 1664525 + 1013904223) >>> 0;
    const a = 0.20 + ((value % 1000) / 1000) * 0.55;
    stars.push({ x, y, s, a });
  }

  return stars;
}

function createShowroomDiamondLattice({
  mountSelector = "[data-showroom-diamond256-mount]"
} = {}) {
  const mount = document.querySelector(mountSelector);
  if (!mount) return null;

  mount.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "256-face three-dimensional diamond construct");
  canvas.setAttribute("role", "img");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.borderRadius = "24px";
  canvas.style.background = "transparent";

  mount.appendChild(canvas);

  const context = canvas.getContext("2d", { alpha: true });
  const nodes = createNodeField();
  const facets = createFacetIndex();
  const edges = createEdgeIndex();
  const stars = createStars();

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    yaw: 0.0,
    pitch: -0.18,
    roll: 0.0,
    animationId: 0,
    lastTime: 0
  };

  function resize() {
    const rect = mount.getBoundingClientRect();
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    state.width = Math.max(320, Math.floor(rect.width || 960));
    state.height = Math.max(320, Math.floor(rect.height || Math.min(state.width * 0.72, 720)));

    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function drawBackground() {
    const g = context.createRadialGradient(
      state.width * 0.5,
      state.height * 0.44,
      state.width * 0.04,
      state.width * 0.5,
      state.height * 0.50,
      state.width * 0.52
    );
    g.addColorStop(0, "rgba(255,255,255,0.16)");
    g.addColorStop(0.16, "rgba(198,224,255,0.12)");
    g.addColorStop(0.48, "rgba(54,94,180,0.10)");
    g.addColorStop(0.78, "rgba(10,24,54,0.20)");
    g.addColorStop(1, "rgba(0,0,0,0.0)");

    context.fillStyle = g;
    context.fillRect(0, 0, state.width, state.height);

    for (const star of stars) {
      context.beginPath();
      context.fillStyle = `rgba(255,245,220,${star.a})`;
      context.arc(star.x * state.width, star.y * state.height, star.s, 0, Math.PI * 2);
      context.fill();
    }
  }

  function renderFrame(time) {
    if (!state.lastTime) state.lastTime = time;
    const delta = Math.min(32, time - state.lastTime);
    state.lastTime = time;

    state.yaw += delta * 0.00038;
    state.roll += delta * 0.00006;

    context.clearRect(0, 0, state.width, state.height);
    drawBackground();

    const scale = Math.min(state.width, state.height) * 0.24;
    const cameraDistance = 6.2;
    const fov = scale * 3.2;

    const light = normalize({ x: -0.4, y: -0.8, z: 1.2 });

    const transformed = nodes.map((node) => {
      const rotated = rotatePoint(
        {
          x: node.x * 1.12,
          y: node.y * 1.10,
          z: node.z * 1.12
        },
        state.yaw,
        state.pitch,
        state.roll
      );

      const projected = projectPoint(rotated, state.width, state.height, cameraDistance, fov);

      return {
        ...node,
        rx: rotated.x,
        ry: rotated.y,
        rz: rotated.z,
        sx: projected.x,
        sy: projected.y,
        depth: rotated.z
      };
    });

    const sortedFacets = facets
      .map((facet) => {
        const a = transformed[facet[0]];
        const b = transformed[facet[1]];
        const c = transformed[facet[2]];
        const avgZ = (a.depth + b.depth + c.depth) / 3;

        const ab = subtract({ x: b.rx, y: b.ry, z: b.rz }, { x: a.rx, y: a.ry, z: a.rz });
        const ac = subtract({ x: c.rx, y: c.ry, z: c.rz }, { x: a.rx, y: a.ry, z: a.rz });
        const normal = normalize(cross(ab, ac));
        const brightness = clamp(dot(normal, light) * 0.65 + 0.55, 0.12, 0.98);

        return { a, b, c, avgZ, brightness };
      })
      .sort((left, right) => left.avgZ - right.avgZ);

    for (const facet of sortedFacets) {
      const { a, b, c, brightness } = facet;

      const cool = Math.round(185 + brightness * 52);
      const warm = Math.round(200 + brightness * 34);
      const alpha = 0.11 + brightness * 0.16;

      context.beginPath();
      context.moveTo(a.sx, a.sy);
      context.lineTo(b.sx, b.sy);
      context.lineTo(c.sx, c.sy);
      context.closePath();

      context.fillStyle = `rgba(${cool},${warm},255,${alpha})`;
      context.fill();

      context.strokeStyle = `rgba(255,232,176,${0.06 + brightness * 0.10})`;
      context.lineWidth = 0.8;
      context.stroke();
    }

    context.save();
    context.strokeStyle = "rgba(255,210,110,0.22)";
    context.lineWidth = 1.05;

    for (const edge of edges) {
      const a = transformed[edge[0]];
      const b = transformed[edge[1]];
      const visibility = clamp(((a.depth + b.depth) * 0.5 + 2.4) / 4.8, 0.10, 0.92);

      context.globalAlpha = 0.14 + visibility * 0.22;
      context.beginPath();
      context.moveTo(a.sx, a.sy);
      context.lineTo(b.sx, b.sy);
      context.stroke();
    }
    context.restore();

    for (const node of transformed) {
      const size = clamp(1.0 + (node.depth + 2.2) * 0.45, 1.2, 4.8);
      const glow = 0.16 + clamp((node.depth + 2.2) / 5.0, 0.0, 1.0) * 0.38;

      context.beginPath();
      context.fillStyle = `rgba(255,205,95,${glow})`;
      context.arc(node.sx, node.sy, size + 1.2, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = "rgba(255,239,190,0.92)";
      context.arc(node.sx, node.sy, size * 0.58, 0, Math.PI * 2);
      context.fill();
    }

    context.save();
    context.textAlign = "center";
    context.fillStyle = "rgba(248,234,208,0.96)";
    context.font = "700 24px Inter, system-ui, sans-serif";
    context.fillText("256-Face Diamond Construct", state.width * 0.5, 38);
    context.fillStyle = "rgba(186,194,207,0.86)";
    context.font = "500 13px Inter, system-ui, sans-serif";
    context.fillText("Fibonacci progression folded into the fixed 16 × 16 nodal construct", state.width * 0.5, 58);
    context.restore();

    state.animationId = window.requestAnimationFrame(renderFrame);
  }

  function start() {
    resize();
    state.animationId = window.requestAnimationFrame(renderFrame);
  }

  function destroy() {
    if (state.animationId) {
      window.cancelAnimationFrame(state.animationId);
      state.animationId = 0;
    }
    window.removeEventListener("resize", resize);
  }

  window.addEventListener("resize", resize);

  mount.dataset.contract = CONTRACT;
  mount.dataset.previousContract = PREVIOUS_CONTRACT;
  mount.dataset.totalNodes = String(TOTAL_NODES);
  mount.dataset.rings = String(RINGS);
  mount.dataset.nodesPerRing = String(NODES_PER_RING);
  mount.dataset.fibonacciVisualPath = "false";
  mount.dataset.diamondMode = "three-dimensional-construct";
  mount.dataset.parentMutationAuthorized = "false";
  mount.dataset.generatedImage = "false";
  mount.dataset.graphicBox = "false";
  mount.dataset.visualPassClaim = "false";

  start();

  return {
    contract: CONTRACT,
    assetPath: ASSET_PATH,
    totalNodes: TOTAL_NODES,
    rings: RINGS,
    nodesPerRing: NODES_PER_RING,
    destroy
  };
}

const handoff = createShowroomDiamondLattice();

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  ASSET_PATH,
  TOTAL_NODES,
  RINGS,
  NODES_PER_RING,
  createShowroomDiamondLattice
};

export default {
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  assetPath: ASSET_PATH,
  totalNodes: TOTAL_NODES,
  rings: RINGS,
  nodesPerRing: NODES_PER_RING,
  handoff
};
