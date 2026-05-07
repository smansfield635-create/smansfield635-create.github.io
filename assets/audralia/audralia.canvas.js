/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_AUTHORITY_CANONICAL_EXPORT_TNT_v1 */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_AUTHORITY_CANONICAL_EXPORT_TNT_v1";
const VERSION = "2026-05-06.canvas-canonical-export";

const SURFACE_DATASET = Object.freeze({
  receipt: "AUDRALIA_CANVAS_SURFACE_DATASET_CANONICAL_v1",
  authority: "adopted-column-canvas-authority",
  autoBoot: false,
  routeOwnsCall: true,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  runtimeTruthPath: "/assets/audralia/audralia.runtime.js",
  topologyMode: "subterranean-and-sea-level-blueprint-consumed-by-canvas",
  lineage: "tectonics -> topology -> terrain -> canvas",
  landmasses: [
    {
      id: "western-mainland-arc",
      fill: "rgba(92, 120, 88, 0.95)",
      stroke: "rgba(242, 218, 158, 0.42)",
      points: [
        [-53, -156], [-43, -139], [-31, -126], [-15, -130],
        [-2, -116], [13, -103], [23, -83], [14, -63],
        [-5, -56], [-22, -68], [-35, -92], [-49, -121]
      ]
    },
    {
      id: "eastern-attached-mainland",
      fill: "rgba(133, 122, 89, 0.95)",
      stroke: "rgba(242, 218, 158, 0.38)",
      points: [
        [-19, -61], [-2, -40], [12, -22], [28, -7],
        [35, 16], [29, 43], [12, 56], [-8, 49],
        [-21, 30], [-25, 3], [-29, -29]
      ]
    },
    {
      id: "northern-rock-crown",
      fill: "rgba(194, 218, 222, 0.88)",
      stroke: "rgba(236, 247, 255, 0.58)",
      points: [
        [43, -148], [58, -112], [65, -66], [60, -18],
        [49, 22], [39, 0], [35, -42], [38, -91]
      ]
    },
    {
      id: "southern-weathered-mass",
      fill: "rgba(113, 126, 105, 0.94)",
      stroke: "rgba(218, 238, 229, 0.42)",
      points: [
        [-66, -42], [-58, 9], [-48, 54], [-35, 78],
        [-24, 113], [-38, 147], [-57, 171], [-72, 132],
        [-75, 53]
      ]
    },
    {
      id: "equatorial-ancient-chain",
      fill: "rgba(120, 105, 83, 0.94)",
      stroke: "rgba(235, 207, 149, 0.40)",
      points: [
        [-9, 67], [4, 82], [17, 105], [14, 139],
        [1, 162], [-13, 150], [-19, 115], [-18, 86]
      ]
    }
  ],
  shelves: [
    [[-58, -161], [-44, -144], [-30, -133], [-10, -139], [9, -118], [28, -88], [20, -57], [-4, -48], [-29, -61], [-43, -95], [-56, -126]],
    [[-24, -65], [2, -44], [24, -13], [42, 16], [34, 51], [6, 66], [-21, 42], [-34, 2], [-34, -38]],
    [[38, -158], [64, -122], [72, -66], [67, -4], [50, 35], [34, 8], [29, -45], [33, -103]],
    [[-76, -59], [-65, 11], [-53, 64], [-31, 92], [-21, 131], [-42, 169], [-67, 178], [-82, 124], [-83, 32]]
  ],
  pressureLines: [
    [[-61, -142], [-47, -120], [-35, -93], [-24, -62], [-11, -31], [7, -4], [22, 26]],
    [[41, -139], [53, -101], [57, -60], [53, -17], [43, 19]],
    [[-68, 98], [-52, 119], [-35, 139], [-17, 158], [3, 177]],
    [[-15, 72], [-1, 94], [7, 118], [4, 144], [-8, 162]],
    [[-33, -128], [-10, -114], [11, -95], [29, -72]]
  ],
  basinLines: [
    [[-38, 112], [-18, 87], [4, 74], [30, 73], [55, 88]],
    [[-62, -18], [-39, 4], [-15, 17], [13, 23], [39, 18]],
    [[10, -169], [-7, 169], [-24, 145], [-41, 126]]
  ]
});

let activeController = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeMount(target) {
  if (target instanceof HTMLElement) return target;

  if (target && target.mount instanceof HTMLElement) return target.mount;
  if (target && target.target instanceof HTMLElement) return target.target;
  if (target && target.container instanceof HTMLElement) return target.container;

  if (typeof target === "string") {
    const found = document.querySelector(target);
    if (found instanceof HTMLElement) return found;
  }

  const selectors = [
    "#audralia-canvas-mount",
    "[data-audralia-canvas-mount]",
    "#audralia-mount",
    "[data-audralia-mount]",
    "[data-audralia-render-mount]",
    "#audralia-main",
    "main"
  ];

  for (const selector of selectors) {
    const found = document.querySelector(selector);
    if (found instanceof HTMLElement) return found;
  }

  return document.body;
}

function setRouteStatus(message) {
  const selectors = [
    "#audralia-route-status",
    "[data-audralia-route-status]",
    "#audralia-status",
    "[data-route-status]"
  ];

  for (const selector of selectors) {
    const target = document.querySelector(selector);
    if (target instanceof HTMLElement) {
      target.textContent = message;
      target.dataset.audraliaCanvasLoaded = "true";
      target.dataset.audraliaCanvasReceipt = RECEIPT;
      return;
    }
  }
}

function removeResidue() {
  const badText = new Set([
    "Loading Audralia",
    "Canvas authority imported · no render export found",
    "Audralia canvas authority imported, but no render export was found.",
    "Audralia doorway is loading the current adopted canvas authority."
  ]);

  const nodes = Array.from(document.querySelectorAll("p, div, span, li, h2, h3"));

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;
    if (node.children.length > 0) continue;

    const text = (node.textContent || "").trim();
    if (badText.has(text)) node.remove();
  }
}

function removeOwnedNodes(mount) {
  const owned = mount.querySelectorAll("[data-audralia-canvas-authority='true']");
  owned.forEach((node) => node.remove());
}

function createShell(mount) {
  removeOwnedNodes(mount);
  removeResidue();

  const shell = document.createElement("section");
  shell.dataset.audraliaCanvasAuthority = "true";
  shell.dataset.audraliaReceipt = RECEIPT;
  shell.dataset.audraliaContract = CONTRACT;
  shell.style.width = "min(100%, 920px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.position = "relative";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.dataset.audraliaCanvasFrame = "contained-square";
  frame.style.width = "min(92vw, 760px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "28px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.28)";
  frame.style.background = "radial-gradient(circle at 50% 42%, rgba(29,55,83,0.32), rgba(3,8,18,0.96) 62%, rgba(1,3,10,1))";
  frame.style.boxShadow = "0 28px 90px rgba(0,0,0,0.48), inset 0 0 70px rgba(147,198,255,0.08)";

  const canvas = document.createElement("canvas");
  canvas.dataset.audraliaCanvas = "true";
  canvas.setAttribute("aria-label", "Audralia animated constructed-world canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.dataset.audraliaCanvasProof = "true";
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245,233,199,0.86)";
  proof.style.font = "700 0.74rem/1.35 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame) {
  const rect = frame.getBoundingClientRect();
  const fallbackSize = Math.min(window.innerWidth || 720, 760);
  const cssSize = Math.max(320, Math.floor(Math.min(rect.width || fallbackSize, rect.height || fallbackSize)));
  const ratio = clamp(window.devicePixelRatio || 1, 1, 2.5);

  canvas.width = Math.floor(cssSize * ratio);
  canvas.height = Math.floor(cssSize * ratio);
  canvas.dataset.pixelRatio = String(ratio);

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) throw new Error("Audralia canvas context unavailable.");

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  return { ctx, size: cssSize, ratio };
}

function project(latDeg, lonDeg, rotationDeg, size) {
  const lat = latDeg * Math.PI / 180;
  const lon = (lonDeg + rotationDeg) * Math.PI / 180;
  const tilt = -8 * Math.PI / 180;
  const cosLat = Math.cos(lat);

  const x = cosLat * Math.sin(lon);
  const y = Math.sin(lat) * Math.cos(tilt) - cosLat * Math.cos(lon) * Math.sin(tilt);
  const z = Math.sin(lat) * Math.sin(tilt) + cosLat * Math.cos(lon) * Math.cos(tilt);
  const radius = size * 0.337;

  return {
    x: size / 2 + x * radius,
    y: size / 2 - y * radius,
    z,
    visible: z > -0.035
  };
}

function drawProjectedPath(ctx, path, rotation, size, options = {}) {
  const points = path.map(([lat, lon]) => project(lat, lon, rotation, size));
  const visible = points.filter((point) => point.visible);

  if (visible.length < 2) return false;

  ctx.save();
  ctx.beginPath();

  let started = false;

  for (const point of points) {
    if (!point.visible) continue;

    if (!started) {
      ctx.moveTo(point.x, point.y);
      started = true;
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }

  if (options.close) ctx.closePath();

  if (options.fill) {
    ctx.fillStyle = options.fill;
    ctx.fill();
  }

  if (options.stroke) {
    ctx.strokeStyle = options.stroke;
    ctx.lineWidth = options.lineWidth || 1;
    ctx.globalAlpha = options.alpha ?? 1;
    ctx.stroke();
  }

  ctx.restore();
  return true;
}

function radial(ctx, x0, y0, r0, x1, y1, r1, stops) {
  const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  stops.forEach(([offset, color]) => gradient.addColorStop
