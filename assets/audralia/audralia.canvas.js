/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_AUTHORITY_SINGLE_CALLER_NO_AUTOBOOT_TNT_v1 */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_AUTHORITY_SINGLE_CALLER_NO_AUTOBOOT_TNT_v1";
const VERSION = "2026-05-06.single-caller-canvas-authority";

const SURFACE_DATASET = Object.freeze({
  receipt: "AUDRALIA_SUBTERRANEAN_TOPOLOGY_CANVAS_DATASET_v2",
  authority: "canvas-render-authority",
  autoBoot: false,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  topologyMode: "subterranean-blueprint-only",
  runtimeTruthPath: "/assets/audralia/audralia.runtime.js",
  exposedLandRatioTarget: "earth-like-above-water-ratio",
  lineage: "tectonics -> topology -> terrain",
  layers: [
    "deep-ocean-basin",
    "continental-shelf",
    "coastal-threshold",
    "exposed-weathered-rock",
    "glacier-and-ice-reserve",
    "subterranean-pressure-lines"
  ],
  landmasses: [
    {
      id: "western-mainland-arc",
      material: "granite-slate-diamond-pressure",
      points: [
        [-53, -156], [-43, -139], [-31, -126], [-15, -130],
        [-2, -116], [13, -103], [23, -83], [14, -63],
        [-5, -56], [-22, -68], [-35, -92], [-49, -121]
      ]
    },
    {
      id: "eastern-attached-mainland",
      material: "opal-granite-coastal-shelf",
      points: [
        [-19, -61], [-2, -40], [12, -22], [28, -7],
        [35, 16], [29, 43], [12, 56], [-8, 49],
        [-21, 30], [-25, 3], [-29, -29]
      ]
    },
    {
      id: "northern-rock-crown",
      material: "slate-ice-pressure",
      points: [
        [43, -148], [58, -112], [65, -66], [60, -18],
        [49, 22], [39, 0], [35, -42], [38, -91]
      ]
    },
    {
      id: "southern-weathered-mass",
      material: "diamond-opal-wet-edge",
      points: [
        [-66, -42], [-58, 9], [-48, 54], [-35, 78],
        [-24, 113], [-38, 147], [-57, 171], [-72, 132],
        [-75, 53]
      ]
    },
    {
      id: "equatorial-ancient-chain",
      material: "eroded-mountain-memory",
      points: [
        [-9, 67], [4, 82], [17, 105], [14, 139],
        [1, 162], [-13, 150], [-19, 115], [-18, 86]
      ]
    }
  ],
  shelves: [
    [
      [-58, -161], [-44, -144], [-30, -133], [-10, -139],
      [9, -118], [28, -88], [20, -57], [-4, -48],
      [-29, -61], [-43, -95], [-56, -126]
    ],
    [
      [-24, -65], [2, -44], [24, -13], [42, 16],
      [34, 51], [6, 66], [-21, 42], [-34, 2],
      [-34, -38]
    ],
    [
      [38, -158], [64, -122], [72, -66], [67, -4],
      [50, 35], [34, 8], [29, -45], [33, -103]
    ],
    [
      [-76, -59], [-65, 11], [-53, 64], [-31, 92],
      [-21, 131], [-42, 169], [-67, 178], [-82, 124],
      [-83, 32]
    ]
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

function getRuntimeSurfaceState() {
  const runtime =
    window.__AUDRALIA_RUNTIME_STATUS__ ||
    window.__AUDRALIA_RUNTIME_TRUTH__ ||
    window.DGBAudraliaRuntimeStatus ||
    null;

  return runtime && typeof runtime === "object" ? runtime : null;
}

function normalizeMount(target) {
  if (target instanceof HTMLElement) return target;

  if (target && target.mount instanceof HTMLElement) {
    return target.mount;
  }

  if (typeof target === "string") {
    const selected = document.querySelector(target);
    if (selected instanceof HTMLElement) return selected;
  }

  const fallbackSelectors = [
    "#audralia-canvas-mount",
    "[data-audralia-canvas-mount]",
    "#audralia-mount",
    "[data-audralia-mount]",
    "[data-audralia-render-mount]",
    "#audralia-main"
  ];

  for (const selector of fallbackSelectors) {
    const found = document.querySelector(selector);
    if (found instanceof HTMLElement) return found;
  }

  return document.body;
}

function removePreviousCanvasAuthority(mount) {
  const previous = mount.querySelectorAll("[data-audralia-canvas-authority='true']");
  previous.forEach((node) => node.remove());
}

function createCanvasShell(mount) {
  removePreviousCanvasAuthority(mount);

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
  frame.style.background = "radial-gradient(circle at 50% 42%, rgba(29, 55, 83, 0.32), rgba(3, 8, 18, 0.96) 62%, rgba(1, 3, 10, 1))";
  frame.style.boxShadow = "0 28px 90px rgba(0,0,0,0.48), inset 0 0 70px rgba(147,198,255,0.08)";

  const canvas = document.createElement("canvas");
  canvas.dataset.audraliaCanvas = "true";
  canvas.setAttribute("aria-label", "Audralia constructed-world animated canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.dataset.audraliaCanvasProof = "true";
  proof.textContent = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245,233,199,0.86)";
  proof.style.font = "700 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
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

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true
  });

  if (!ctx) {
    throw new Error("Audralia canvas context unavailable.");
  }

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
  const visibleCount = points.filter((point) => point.visible).length;

  if (visibleCount < 2) return false;

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

function createRadial(ctx, x0, y0, r0, x1, y1, r1, stops) {
  const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  return gradient;
}

function clipGlobe(ctx, size) {
  const radius = size * 0.337;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
  ctx.clip();
}

function drawStarField(ctx, size, time) {
  ctx.save();
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 96; i += 1) {
    const sx = Math.sin(i * 918.17) * 10000;
    const sy = Math.sin(i * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y = (sy - Math.floor(sy)) * size;
    const pulse = 0.32 + 0.46 * Math.abs(Math.sin(time * 0.0012 + i));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = i % 7 === 0 ? "rgba(245,221,166,0.82)" : "rgba(185,216,255,0.68)";
    ctx.beginPath();
    ctx.arc(x, y, i % 11 === 0 ? 1.25 : 0.72, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawOceanBase(ctx, size, time) {
  const radius = size * 0.337;
  const cx = size / 2;
  const cy = size / 2;

  ctx.save();
  clipGlobe(ctx, size);

  ctx.fillStyle = createRadial(ctx, cx - radius * 0.32, cy - radius * 0.38, radius * 0.05, cx, cy, radius * 1.12, [
    [0, "rgba(145,214,255,0.98)"],
    [0.22, "rgba(42,129,191,0.98)"],
    [0.54, "rgba(9,58,112,0.99)"],
    [1, "rgba(1,16,43,1)"]
  ]);

  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.28;

  for (let i = 0; i < 12; i += 1) {
    const y = cy - radius + (i / 11) * radius * 2;
    const waveShift = Math.sin(time * 0.001 + i * 1.7) * radius * 0.05;

    ctx.strokeStyle = i % 3 === 0 ? "rgba(178,231,255,0.30)" : "rgba(20,95,158,0.32)";
    ctx.lineWidth = i % 3 === 0 ? 1.2 : 0.7;
    ctx.beginPath();

    for (let x = cx - radius; x <= cx + radius; x += 8) {
      const local = Math.sin((x + waveShift) * 0.032 + i) * radius * 0.012;
      const px = x;
      const py = y + local;

      if (x === cx - radius) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawShelves(ctx, rotation, size) {
  SURFACE_DATASET.shelves.forEach((path, index) => {
    drawProjectedPath(ctx, path, rotation, size, {
      close: true,
      fill: index % 2 === 0 ? "rgba(106,182,207,0.30)" : "rgba(173,221,222,0.22)",
      stroke: "rgba(226,238,213,0.25)",
      lineWidth: 1.15,
      alpha: 0.88
    });
  });
}

function drawLand(ctx, rotation, size) {
  SURFACE_DATASET.landmasses.forEach((mass, index) => {
    drawProjectedPath(ctx, mass.points, rotation, size, {
      close: true,
      fill: index % 2 === 0 ? "rgba(94,114,88,0.94)" : "rgba(132,119,88,0.94)",
      stroke: "rgba(248,224,168,0.36)",
      lineWidth: 1.45,
      alpha: 0.98
    });

    const ridgePath = mass.points.filter((_, pointIndex) => pointIndex % 2 === 0);

    drawProjectedPath(ctx, ridgePath, rotation, size, {
      close: false,
      stroke: index % 2 === 0 ? "rgba(229,234,220,0.33)" : "rgba(45,37,28,0.28)",
      lineWidth: 0.9,
      alpha: 0.72
    });
  });
}

function drawIceAndGlaciers(ctx, rotation, size) {
  const north = [[67, -174], [75, -119], [78, -51], [71, 18], [63, 67], [58, 17], [60, -58], [61, -126]];
  const south = [[-79, -164], [-70, -91], [-67, -22], [-71, 48], [-78, 124], [-84, 171], [-86, 52]];

  [north, south].forEach((path) => {
    drawProjectedPath(ctx, path, rotation, size, {
      close: true,
      fill: "rgba(232,245,255,0.75)",
      stroke: "rgba(166,223,255,0.48)",
      lineWidth: 1.1,
      alpha: 0.86
    });
  });
}

function drawSubterraneanTopology(ctx, rotation, size) {
  SURFACE_DATASET.pressureLines.forEach((path, index) => {
    drawProjectedPath(ctx, path, rotation, size, {
      close: false,
      stroke: index % 2 === 0 ? "rgba(238,205,125,0.38)" : "rgba(177,222,255,0.32)",
      lineWidth: 1.2,
      alpha: 0.74
    });
  });

  SURFACE_DATASET.basinLines.forEach((path) => {
    drawProjectedPath(ctx, path, rotation, size, {
      close: false,
      stroke: "rgba(24,34,67,0.44)",
      lineWidth: 2.2,
      alpha: 0.72
    });
  });
}

function drawAtmosphere(ctx, size, time) {
  const radius = size * 0.337;
  const cx = size / 2;
  const cy = size / 2;
  const pulse = 0.45 + Math.sin(time * 0.0013) * 0.06;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(159,214,255,${pulse})`;
  ctx.lineWidth = size * 0.012;
  ctx.stroke();

  ctx.strokeStyle = "rgba(246,215,143,0.22)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy,
      radius * (0.84 + i * 0.025),
      radius * (0.13 + i * 0.018),
      Math.sin(time * 0.00025 + i) * 0.3,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  const shade = createRadial(ctx, cx - radius * 0.4, cy - radius * 0.42, radius * 0.05, cx + radius * 0.18, cy + radius * 0.16, radius * 1.16, [
    [0, "rgba(255,255,255,0.10)"],
    [0.56, "rgba(255,255,255,0.02)"],
    [0.78, "rgba(0,0,0,0.14)"],
    [1, "rgba(0,0,0,0.62)"]
  ]);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = shade;
  ctx.fill();

  ctx.restore();
}

function drawCanvasLabel(ctx, size) {
  ctx.save();

  ctx.fillStyle = "rgba(244,226,178,0.88)";
  ctx.font = `700 ${Math.max(13, size * 0.027)}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.865);

  ctx.fillStyle = "rgba(174,204,225,0.62)";
  ctx.font = `500 ${Math.max(10, size * 0.016)}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillText("CANVAS AUTHORITY · SINGLE CALLER", size / 2, size * 0.895);

  ctx.restore();
}

function samplePixelProof(ctx, size) {
  try {
    const sample = ctx.getImageData(Math.floor(size / 2), Math.floor(size / 2), 1, 1).data;

    return {
      r: sample[0],
      g: sample[1],
      b: sample[2],
      a: sample[3],
      notBlank: sample[3] > 0 && (sample[0] + sample[1] + sample[2]) > 12
    };
  } catch (error) {
    return {
      notBlank: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function publishStatus(state) {
  const status = {
    loaded: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    autoBoot: false,
    singleCallerRequired: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount),
    animated: true,
    frameCount: state.frameCount,
    pixelProof: state.pixelProof || null,
    runtimeSurfaceState: getRuntimeSurfaceState(),
    surface: SURFACE_DATASET
  };

  window.__AUDRALIA_CANVAS_STATUS__ = status;
  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = status;
  window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: status }));

  return status;
}

function renderFrame(state, time) {
  const { ctx, size } = state;
  const rotation = ((time * 0.006) % 360) - 180;

  ctx.clearRect(0, 0, size, size);

  drawStarField(ctx, size, time);
  drawOceanBase(ctx, size, time);

  ctx.save();
  clipGlobe(ctx, size);
  drawShelves(ctx, rotation, size);
  drawLand(ctx, rotation, size);
  drawIceAndGlaciers(ctx, rotation, size);
  drawSubterraneanTopology(ctx, rotation, size);
  ctx.restore();

  drawAtmosphere(ctx, size, time);
  drawCanvasLabel(ctx, size);

  state.frameCount += 1;

  if (state.frameCount === 4 || state.frameCount % 120 === 0) {
    state.pixelProof = samplePixelProof(ctx, size);
    publishStatus(state);
  }
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") {
    activeController.stop();
  }

  activeController = null;
}

export function mountAudraliaCanvas(target, options = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  stopActiveController();

  const mount = normalizeMount(target);
  const nodes = createCanvasShell(mount);
  const canvasSetup = setupCanvas(nodes.canvas, nodes.frame);

  const state = {
    ...nodes,
    ...canvasSetup,
    mount,
    options,
    frameCount: 0,
    pixelProof: null,
    stopped: false,
    resizeTimer: null,
    rafId: null
  };

  function animate(time) {
    if (state.stopped) return;

    renderFrame(state, time || performance.now());
    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);

    state.resizeTimer = window.setTimeout(() => {
      const resized = setupCanvas(state.canvas, state.frame);
      state.ctx = resized.ctx;
      state.size = resized.size;
      state.ratio = resized.ratio;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 120);
  }

  state.stop = function stop() {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    window.removeEventListener("resize", resize);
  };

  window.addEventListener("resize", resize, { passive: true });

  activeController = state;
  publishStatus(state);
  animate(performance.now());

  return state;
}

export function renderAudraliaCanvas(target, options = {}) {
  return mountAudraliaCanvas(target, options);
}

export function bootAudraliaCanvas(target, options = {}) {
  return mountAudraliaCanvas(target, options);
}

export function createAudraliaCanvas(target, options = {}) {
  return mountAudraliaCanvas(target, options);
}

export function initAudraliaCanvas(target, options = {}) {
  return mountAudraliaCanvas(target, options);
}

export function getAudraliaCanvasStatus() {
  return window.__AUDRALIA_CANVAS_STATUS__ || {
    loaded: false,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    autoBoot: false,
    singleCallerRequired: true
  };
}

export function getAudraliaSurfaceDataset() {
  return SURFACE_DATASET;
}

export function stopAudraliaCanvas() {
  stopActiveController();

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION
  };
}

const api = {
  RECEIPT,
  CONTRACT,
  VERSION,
  SURFACE_DATASET,
  mountAudraliaCanvas,
  renderAudraliaCanvas,
  bootAudraliaCanvas,
  createAudraliaCanvas,
  initAudraliaCanvas,
  getAudraliaCanvasStatus,
  getAudraliaSurfaceDataset,
  stopAudraliaCanvas
};

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
}

export default api;
