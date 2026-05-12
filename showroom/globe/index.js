// /showroom/index.js
// SHOWROOM_COVER_CRYSTALLIZED_256_FACE_DIAMOND_TNT_v1
// Full-file replacement.
//
// Purpose:
// - Render the Showroom cover diamond as a crystallized, real-diamond-like object.
// - Preserve the 256-face construct under the hood.
// - Preserve Fibonacci geometry as internal facet rhythm.
// - Remove the flat plate / wire-grid / visible node read.
// - Render by code only.
// - No generated image.
// - No GraphicBox.
// - No diagnostics on the public cover.
// - Keep runtime budget controlled on mobile.

const CONTRACT = "SHOWROOM_COVER_CRYSTALLIZED_256_FACE_DIAMOND_TNT_v1";
const PREVIOUS_CONTRACT = "SHOWROOM_COVER_256_FACE_ENCLOSED_DIAMOND_RUNTIME_TNT_v1";
const ROUTE = "/showroom/";

const TOTAL_FACES = 256;
const SECTORS = 32;
const RINGS = 9;
const FIBONACCI_SEQUENCE = Object.freeze([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);

const GENERATED_IMAGE = false;
const GRAPHIC_BOX = false;
const VISUAL_PASS_CLAIM = false;
const DIAGNOSTICS_VISIBLE = false;

const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const DPR = MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
const FRAME_MS = MOBILE ? 42 : 32;

const state = {
  canvas: null,
  context: null,
  host: null,
  stage: null,

  yaw: -24,
  pitch: -5,
  roll: 0,
  zoom: 1,

  dragging: false,
  pointerId: null,
  dragStartX: 0,
  dragStartY: 0,
  dragStartYaw: 0,
  dragStartPitch: 0,

  raf: 0,
  lastFrameAt: 0,
  active: true,
  booted: false
};

let geometry = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashUnit(index, salt = 0) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function fibonacciForFace(index) {
  const value = FIBONACCI_SEQUENCE[index % FIBONACCI_SEQUENCE.length];
  const next = FIBONACCI_SEQUENCE[(index + 1) % FIBONACCI_SEQUENCE.length];

  return {
    value,
    next,
    ratio: value / next,
    density: clamp(value / 233, 0.004, 1),
    phase: ((value % SECTORS) / SECTORS) * Math.PI * 2
  };
}

function ringProfile() {
  return [
    { y: -0.50, rx: 0.25, rz: 0.070, phase: 0.00 },
    { y: -0.42, rx: 0.47, rz: 0.120, phase: 0.18 },
    { y: -0.28, rx: 0.72, rz: 0.190, phase: 0.06 },
    { y: -0.08, rx: 1.00, rz: 0.270, phase: 0.14 },
    { y:  0.08, rx: 1.02, rz: 0.285, phase: 0.00 },
    { y:  0.28, rx: 0.72, rz: 0.205, phase: 0.16 },
    { y:  0.48, rx: 0.43, rz: 0.135, phase: 0.04 },
    { y:  0.66, rx: 0.18, rz: 0.060, phase: 0.12 },
    { y:  0.76, rx: 0.025, rz: 0.012, phase: 0.00 }
  ];
}

function buildGeometry() {
  if (geometry) return geometry;

  const rings = ringProfile();
  const vertices = [];

  for (let ring = 0; ring < RINGS; ring += 1) {
    const profile = rings[ring];

    for (let sector = 0; sector < SECTORS; sector += 1) {
      const fib = fibonacciForFace(ring * SECTORS + sector);
      const theta = (sector / SECTORS) * Math.PI * 2 + profile.phase + fib.phase * 0.018;
      const radiusPulse = 0.985 + Math.sin(theta * 4 + fib.value * 0.11) * 0.018;

      vertices.push({
        ring,
        sector,
        x: Math.cos(theta) * profile.rx * radiusPulse,
        y: profile.y,
        z: Math.sin(theta) * profile.rz * radiusPulse,
        fib
      });
    }
  }

  const faces = [];

  for (let ring = 0; ring < RINGS - 1; ring += 1) {
    for (let sector = 0; sector < SECTORS; sector += 1) {
      const nextSector = (sector + 1) % SECTORS;
      const index = ring * SECTORS + sector;

      faces.push({
        index,
        ring,
        sector,
        fib: fibonacciForFace(index),
        vertices: [
          vertices[ring * SECTORS + sector],
          vertices[ring * SECTORS + nextSector],
          vertices[(ring + 1) * SECTORS + nextSector],
          vertices[(ring + 1) * SECTORS + sector]
        ]
      });
    }
  }

  geometry = Object.freeze({
    vertices: Object.freeze(vertices),
    faces: Object.freeze(faces)
  });

  return geometry;
}

function findHost() {
  const explicit =
    document.querySelector("[data-showroom-diamond-mount]") ||
    document.querySelector("[data-256-diamond-mount]") ||
    document.getElementById("showroomDiamondMount") ||
    document.getElementById("diamondLatticeMount");

  if (explicit) return explicit;

  const existingCanvas =
    document.querySelector("[data-showroom-diamond-canvas]") ||
    document.querySelector("[data-256-diamond-canvas]") ||
    document.getElementById("showroomDiamondCanvas");

  if (existingCanvas?.parentElement) return existingCanvas.parentElement;

  const candidates = Array.from(document.querySelectorAll("section, article, div"));

  const diamondCandidate = candidates.find((node) => {
    const text = node.textContent || "";
    return (
      text.includes("256-Face") ||
      text.includes("256 faces") ||
      text.includes("Enclosed Diamond") ||
      text.includes("Fibonacci geometry")
    );
  });

  if (diamondCandidate) return diamondCandidate;

  return document.querySelector("main") || document.body;
}

function ensureStage(host) {
  let stage =
    host.querySelector("[data-showroom-crystal-diamond-stage]") ||
    host.querySelector("[data-showroom-diamond-stage]");

  if (!stage) {
    stage = document.createElement("div");
    stage.setAttribute("data-showroom-crystal-diamond-stage", "true");

    const firstCanvas = host.querySelector("canvas");
    const oldVisualBox =
      host.querySelector("[data-fibonacci-diamond-stage]") ||
      host.querySelector("[data-256-face-diamond]");

    if (firstCanvas?.parentElement) {
      firstCanvas.parentElement.replaceChildren(stage);
    } else if (oldVisualBox?.parentElement) {
      oldVisualBox.replaceWith(stage);
    } else {
      host.appendChild(stage);
    }
  }

  stage.dataset.contract = CONTRACT;
  stage.dataset.totalFaces = String(TOTAL_FACES);
  stage.dataset.fibonacciGeometry = "internal";
  stage.dataset.generatedImage = "false";
  stage.dataset.graphicBox = "false";
  stage.dataset.visibleDiagnostics = "false";

  return stage;
}

function ensureCanvas(stage) {
  let canvas =
    stage.querySelector("[data-showroom-crystal-diamond-canvas]") ||
    stage.querySelector("canvas");

  if (!canvas) {
    canvas = document.createElement("canvas");
    stage.replaceChildren(canvas);
  }

  canvas.setAttribute("data-showroom-crystal-diamond-canvas", "true");
  canvas.setAttribute("aria-label", "Crystallized 256-face rotating diamond");
  canvas.setAttribute("role", "img");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.touchAction = "none";
  canvas.style.transform = "none";

  return canvas;
}

function ensureStyle() {
  if (document.getElementById("showroom-crystallized-diamond-style-v1")) return;

  const style = document.createElement("style");
  style.id = "showroom-crystallized-diamond-style-v1";
  style.textContent = `
    [data-showroom-crystal-diamond-stage] {
      width: 100%;
      min-height: clamp(390px, 82vw, 760px);
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(142, 190, 255, 0.18);
      border-radius: 28px;
      background:
        radial-gradient(circle at 50% 54%, rgba(210, 235, 255, 0.12), transparent 19rem),
        radial-gradient(circle at 50% 44%, rgba(244, 191, 96, 0.10), transparent 21rem),
        linear-gradient(180deg, rgba(7, 13, 30, 1), rgba(2, 5, 12, 1));
      box-shadow:
        inset 0 0 54px rgba(143, 240, 195, 0.08),
        0 24px 70px rgba(0, 0, 0, 0.34);
      contain: layout paint style;
      touch-action: none;
    }

    [data-showroom-crystal-diamond-stage]::before {
      content: "CRYSTALLIZED 256-FACE DIAMOND";
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 2;
      min-height: 31px;
      display: inline-flex;
      align-items: center;
      padding: 7px 11px;
      border: 1px solid rgba(244, 191, 96, 0.34);
      border-radius: 999px;
      background: rgba(4, 9, 18, 0.72);
      color: #f4bf60;
      font: 900 0.74rem Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: 0.10em;
      pointer-events: none;
      backdrop-filter: blur(12px);
    }

    [data-showroom-crystal-diamond-canvas] {
      width: 100%;
      max-width: 980px;
      aspect-ratio: 1 / 1;
      touch-action: none;
      transform: none !important;
      contain: strict;
    }

    @media (max-width: 560px) {
      [data-showroom-crystal-diamond-stage] {
        min-height: clamp(360px, 88vw, 620px);
        border-radius: 20px;
      }

      [data-showroom-crystal-diamond-stage]::before {
        top: 12px;
        left: 12px;
        font-size: 0.66rem;
      }
    }
  `;

  document.head.appendChild(style);
}

function updateNearbyCopy(host) {
  const headings = Array.from(host.querySelectorAll("h1, h2, h3"));
  const targetHeading = headings.find((heading) => {
    const text = heading.textContent || "";
    return text.includes("256") || text.includes("Diamond") || text.includes("faces");
  });

  if (targetHeading) {
    targetHeading.textContent = "Crystallized 256-Face Diamond";
  }

  const paragraphs = Array.from(host.querySelectorAll("p"));
  const targetParagraph = paragraphs.find((paragraph) => {
    const text = paragraph.textContent || "";
    return text.includes("Fibonacci") || text.includes("256") || text.includes("diamond");
  });

  if (targetParagraph) {
    targetParagraph.textContent =
      "The visible object is one crystallized diamond. The 256 faces remain folded into the construct, while Fibonacci geometry controls the internal facet rhythm without exposing a zigzag or diagnostic overlay.";
  }
}

function sizeCanvas() {
  if (!state.canvas) return;

  const rect = state.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width || state.canvas.clientWidth || 720));
  const cssHeight = Math.max(320, Math.floor(rect.height || state.canvas.clientHeight || cssWidth));

  const width = Math.floor(cssWidth * DPR);
  const height = Math.floor(cssHeight * DPR);

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  state.context = state.canvas.getContext("2d", { alpha: false });
}

function rotatePoint(point, yawDeg, pitchDeg, rollDeg) {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const roll = (rollDeg * Math.PI) / 180;

  let x = point.x;
  let y = point.y;
  let z = point.z;

  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  x = x1;
  z = z1;

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const y1 = y * cosP - z * sinP;
  const z2 = y * sinP + z * cosP;
  y = y1;
  z = z2;

  const cosR = Math.cos(roll);
  const sinR = Math.sin(roll);
  const x2 = x * cosR - y * sinR;
  const y2 = x * sinR + y * cosR;

  return { x: x2, y: y2, z };
}

function project(point, width, height, scale) {
  const focal = 3.2;
  const perspective = focal / (focal - point.z);

  return {
    x: width * 0.5 + point.x * scale * perspective,
    y: height * 0.52 + point.y * scale * perspective,
    z: point.z,
    perspective
  };
}

function polygonBounds(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return { minX, minY, maxX, maxY };
}

function drawBackground(context, width, height) {
  const gradient = context.createRadialGradient(
    width * 0.50,
    height * 0.48,
    width * 0.05,
    width * 0.50,
    height * 0.52,
    width * 0.78
  );

  gradient.addColorStop(0, "#111d35");
  gradient.addColorStop(0.45, "#071226");
  gradient.addColorStop(1, "#01030a");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = MOBILE ? 0.28 : 0.42;

  const starCount = MOBILE ? 54 : 92;
  for (let i = 0; i < starCount; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const radius = 0.55 + ((i * 7) % 11) / 20;

    context.beginPath();
    context.fillStyle = i % 11 === 0 ? "rgba(244,191,96,0.58)" : "rgba(225,238,255,0.50)";
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawCaustic(context, width, height, scale) {
  context.save();

  const cx = width * 0.5;
  const cy = height * 0.78;
  const radius = scale * 0.58;

  const glow = context.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius);
  glow.addColorStop(0, "rgba(225,248,255,0.24)");
  glow.addColorStop(0.28, "rgba(244,191,96,0.13)");
  glow.addColorStop(1, "rgba(244,191,96,0)");

  context.fillStyle = glow;
  context.beginPath();
  context.ellipse(cx, cy, radius * 1.15, radius * 0.16, 0, 0, Math.PI * 2);
  context.fill();

  context.restore();
}

function facetLight(face, projected) {
  const center = projected.reduce(
    (sum, point) => ({
      x: sum.x + point.x / projected.length,
      y: sum.y + point.y / projected.length,
      z: sum.z + point.z / projected.length
    }),
    { x: 0, y: 0, z: 0 }
  );

  const bandBias = 1 - Math.abs(face.ring - 3.5) / 5;
  const fib = face.fib;

  return clamp(
    0.34 +
      center.z * 0.40 +
      bandBias * 0.16 +
      Math.sin(face.sector * 0.92 + fib.phase + state.yaw * 0.04) * 0.15 +
      fib.density * 0.08,
    0.08,
    1.18
  );
}

function drawFacet(context, face, points, light) {
  if (points.length < 3) return;

  const bounds = polygonBounds(points);
  const fib = face.fib;

  const alpha = clamp(0.22 + light * 0.42 + fib.density * 0.08, 0.16, 0.82);
  const warm = clamp(0.08 + fib.ratio * 0.12, 0.06, 0.20);
  const icy = clamp(0.30 + light * 0.34, 0.20, 0.72);

  const gradient = context.createLinearGradient(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
  gradient.addColorStop(0, `rgba(255,255,255,${clamp(0.10 + light * 0.30, 0.08, 0.42)})`);
  gradient.addColorStop(0.34, `rgba(185,226,255,${icy})`);
  gradient.addColorStop(0.68, `rgba(126,151,205,${clamp(0.15 + light * 0.16, 0.10, 0.32)})`);
  gradient.addColorStop(1, `rgba(244,191,96,${warm})`);

  context.save();
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i += 1) {
    context.lineTo(points[i].x, points[i].y);
  }

  context.closePath();
  context.fillStyle = gradient;
  context.globalAlpha = alpha;
  context.fill();

  context.globalAlpha = clamp(0.10 + light * 0.22, 0.10, 0.34);
  context.strokeStyle = light > 0.70 ? "rgba(255,255,255,0.72)" : "rgba(202,224,255,0.36)";
  context.lineWidth = light > 0.76 ? 1.1 * DPR : 0.55 * DPR;
  context.stroke();

  context.restore();
}

function drawInternalRefractions(context, faces) {
  context.save();
  context.globalCompositeOperation = "lighter";
  context.lineCap = "round";

  const stride = MOBILE ? 10 : 6;

  for (let i = 0; i < faces.length; i += stride) {
    const item = faces[i];
    const points = item.points;
    if (!points || points.length < 4) continue;
    if (item.depth < -0.12) continue;

    const a = points[0];
    const b = points[2];
    const c = points[1];
    const d = points[3];

    const light = item.light;
    const alpha = clamp(0.04 + light * 0.16, 0.03, 0.22);

    context.strokeStyle = `rgba(255,255,255,${alpha})`;
    context.lineWidth = Math.max(0.8, 0.95 * DPR);

    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();

    if (!MOBILE && i % 12 === 0) {
      context.strokeStyle = `rgba(244,191,96,${alpha * 0.75})`;
      context.beginPath();
      context.moveTo(c.x, c.y);
      context.lineTo(d.x, d.y);
      context.stroke();
    }
  }

  context.restore();
}

function drawOuterCutLines(context, ringsProjected) {
  context.save();
  context.globalCompositeOperation = "lighter";
  context.lineCap = "round";

  const importantRings = [0, 3, 4, 8];

  for (const ring of importantRings) {
    const points = ringsProjected.get(ring);
    if (!points) continue;

    context.beginPath();

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      if (i === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    }

    context.closePath();
    context.strokeStyle = ring === 0 || ring === 8 ? "rgba(255,245,195,0.70)" : "rgba(226,244,255,0.44)";
    context.lineWidth = ring === 3 || ring === 4 ? Math.max(1.2, 1.35 * DPR) : Math.max(0.9, 0.95 * DPR);
    context.stroke();
  }

  context.restore();
}

function drawSparkle(context, x, y, size, alpha, warm = false) {
  context.save();
  context.globalCompositeOperation = "lighter";
  context.strokeStyle = warm ? `rgba(244,191,96,${alpha})` : `rgba(255,255,255,${alpha})`;
  context.lineWidth = Math.max(0.8, DPR * 0.9);
  context.lineCap = "round";

  context.beginPath();
  context.moveTo(x - size, y);
  context.lineTo(x + size, y);
  context.moveTo(x, y - size);
  context.lineTo(x, y + size);
  context.stroke();

  context.beginPath();
  context.arc(x, y, size * 0.18, 0, Math.PI * 2);
  context.fillStyle = warm ? `rgba(244,191,96,${alpha})` : `rgba(255,255,255,${alpha})`;
  context.fill();

  context.restore();
}

function drawSparkles(context, projectedVertices, time) {
  context.save();

  const stride = MOBILE ? 23 : 17;

  for (let i = 0; i < projectedVertices.length; i += stride) {
    const vertex = projectedVertices[i];
    if (vertex.z < -0.05) continue;

    const pulse = 0.5 + Math.sin(time * 0.004 + i * 0.73) * 0.5;
    const alpha = clamp(0.18 + pulse * 0.55 + vertex.z * 0.25, 0.12, 0.88);
    const size = (MOBILE ? 3.6 : 4.8) * DPR * (0.75 + pulse * 0.62);

    drawSparkle(context, vertex.x, vertex.y, size, alpha, i % 3 === 0);
  }

  context.restore();
}

function drawTopGlint(context, width, height, scale, time) {
  const pulse = 0.5 + Math.sin(time * 0.003) * 0.5;
  const x = width * 0.50 + Math.sin(state.yaw * 0.03) * scale * 0.05;
  const y = height * 0.31 + Math.cos(state.yaw * 0.025) * scale * 0.02;

  drawSparkle(context, x, y, scale * 0.045 * (0.75 + pulse * 0.30), 0.68 + pulse * 0.24, true);
}

function render(time = 0) {
  if (!state.context || !state.canvas) return;

  const canvas = state.canvas;
  const context = state.context;
  const width = canvas.width;
  const height = canvas.height;
  const scale = Math.min(width, height) * 0.34 * state.zoom;
  const model = buildGeometry();

  drawBackground(context, width, height);
  drawCaustic(context, width, height, scale);

  const projectedVertices = model.vertices.map((vertex) => {
    const rotated = rotatePoint(vertex, state.yaw, state.pitch, state.roll);

    return {
      ...project(rotated, width, height, scale),
      source: vertex,
      ring: vertex.ring,
      sector: vertex.sector
    };
  });

  const ringsProjected = new Map();

  for (const vertex of projectedVertices) {
    if (!ringsProjected.has(vertex.ring)) ringsProjected.set(vertex.ring, []);
    ringsProjected.get(vertex.ring).push(vertex);
  }

  const projectedFaces = model.faces.map((face) => {
    const points = face.vertices.map((vertex) => {
      const index = vertex.ring * SECTORS + vertex.sector;
      return projectedVertices[index];
    });

    const depth = points.reduce((sum, point) => sum + point.z, 0) / points.length;
    const light = facetLight(face, points);

    return { face, points, depth, light };
  });

  projectedFaces.sort((a, b) => a.depth - b.depth);

  context.save();

  for (const item of projectedFaces) {
    drawFacet(context, item.face, item.points, item.light);
  }

  drawInternalRefractions(context, projectedFaces);
  drawOuterCutLines(context, ringsProjected);
  drawSparkles(context, projectedVertices, time);
  drawTopGlint(context, width, height, scale, time);

  context.restore();

  stampDocument();
}

function requestFrame(time = 0) {
  if (!state.active) return;

  const elapsed = time - state.lastFrameAt;

  if (elapsed >= FRAME_MS) {
    state.lastFrameAt = time;

    if (!state.dragging && !REDUCED_MOTION) {
      state.yaw += MOBILE ? 0.28 : 0.42;
      state.roll = Math.sin(time * 0.00042) * 3.5;
    }

    render(time);
  }

  state.raf = window.requestAnimationFrame(requestFrame);
}

function wireInteraction() {
  const canvas = state.canvas;
  if (!canvas || canvas.dataset.crystallizedDiamondInteractionBound === "true") return;

  canvas.dataset.crystallizedDiamondInteractionBound = "true";

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.dragStartYaw = state.yaw;
    state.dragStartPitch = state.pitch;
    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.dragStartX;
    const dy = event.clientY - state.dragStartY;

    state.yaw = state.dragStartYaw + dx * 0.38;
    state.pitch = clamp(state.dragStartPitch - dy * 0.22, -32, 26);

    render(performance.now());
    event.preventDefault();
  }, { passive: false });

  const finish = (event) => {
    if (event.pointerId !== state.pointerId) return;

    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  canvas.addEventListener("pointerup", finish, { passive: false });
  canvas.addEventListener("pointercancel", finish, { passive: false });

  canvas.addEventListener("wheel", (event) => {
    state.zoom = clamp(state.zoom + (event.deltaY < 0 ? 0.045 : -0.045), 0.88, 1.18);
    render(performance.now());
    event.preventDefault();
  }, { passive: false });
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.showroomDiamondReceipt = CONTRACT;
  root.dataset.showroomDiamondPreviousReceipt = PREVIOUS_CONTRACT;
  root.dataset.showroomDiamondRoute = ROUTE;
  root.dataset.showroomDiamondCrystallized = "true";
  root.dataset.showroomDiamondFaces = String(TOTAL_FACES);
  root.dataset.showroomDiamondVisibleNodes = "false";
  root.dataset.showroomDiamondFibonacciGeometry = "internal";
  root.dataset.showroomDiamondFibonacciSequence = FIBONACCI_SEQUENCE.join(",");
  root.dataset.showroomDiamondRenderedByCode = "true";
  root.dataset.generatedImage = String(GENERATED_IMAGE);
  root.dataset.graphicBox = String(GRAPHIC_BOX);
  root.dataset.visualPassClaim = String(VISUAL_PASS_CLAIM);
  root.dataset.visibleDiagnostics = String(DIAGNOSTICS_VISIBLE);
  root.dataset.runtimeBudget = MOBILE ? "mobile-capped" : "desktop-capped";
  root.dataset.dprCap = String(DPR);
}

function getShowroomDiamondStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    route: ROUTE,
    crystallized: true,
    totalFaces: TOTAL_FACES,
    rings: RINGS,
    sectors: SECTORS,
    visibleNodes: false,
    fibonacciGeometry: "internal",
    fibonacciSequence: [...FIBONACCI_SEQUENCE],
    generatedImage: GENERATED_IMAGE,
    graphicBox: GRAPHIC_BOX,
    visualPassClaim: VISUAL_PASS_CLAIM,
    diagnosticsVisible: DIAGNOSTICS_VISIBLE,
    mobile: MOBILE,
    dprCap: DPR,
    yaw: state.yaw,
    pitch: state.pitch,
    zoom: state.zoom,
    booted: state.booted
  };
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    render,
    status: getShowroomDiamondStatus,
    getStatus: getShowroomDiamondStatus,
    getShowroomDiamondStatus
  };

  window.DGBShowroomDiamond = api;
  window.ShowroomDiamond = api;
  window.SHOWROOM_DIAMOND_RECEIPT = CONTRACT;
}

function boot() {
  ensureStyle();

  const host = findHost();
  const stage = ensureStage(host);
  const canvas = ensureCanvas(stage);

  state.host = host;
  state.stage = stage;
  state.canvas = canvas;

  updateNearbyCopy(host);
  sizeCanvas();
  wireInteraction();
  exposeApi();
  stampDocument();

  state.booted = true;

  render(performance.now());

  if (state.raf) window.cancelAnimationFrame(state.raf);
  state.raf = window.requestAnimationFrame(requestFrame);
}

window.addEventListener("resize", () => {
  window.clearTimeout(window.__showroomDiamondResizeTimer);
  window.__showroomDiamondResizeTimer = window.setTimeout(() => {
    sizeCanvas();
    render(performance.now());
  }, 180);
}, { passive: true });

document.addEventListener("visibilitychange", () => {
  state.active = document.visibilityState !== "hidden";

  if (!state.active && state.raf) {
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  if (state.active && !state.raf) {
    state.lastFrameAt = 0;
    state.raf = window.requestAnimationFrame(requestFrame);
  }
}, { passive: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  ROUTE,
  TOTAL_FACES,
  SECTORS,
  RINGS,
  FIBONACCI_SEQUENCE,
  GENERATED_IMAGE,
  GRAPHIC_BOX,
  VISUAL_PASS_CLAIM,
  render,
  getShowroomDiamondStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  render,
  status: getShowroomDiamondStatus,
  getStatus: getShowroomDiamondStatus,
  getShowroomDiamondStatus
};
