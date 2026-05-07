/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1 */
/* REVISION: AUDRALIA_RICH_PLANET_DETAIL_UPGRADE_v2 */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1";
const REVISION = "AUDRALIA_RICH_PLANET_DETAIL_UPGRADE_v2";
const VERSION = "2026-05-06.rich-planet-detail-upgrade-v2";
const COMPATIBILITY_CONTRACT = "AUDRALIA_CANVAS_AUTHORITY_MINIMAL_CANARY_TNT_v1";

const PLANET = Object.freeze({
  name: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  revision: REVISION,
  compatibility: COMPATIBILITY_CONTRACT,
  autoBoot: false,
  routeOwnsCall: true,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  lineage: "tectonics -> topology -> terrain -> canvas",
  runtimeTruthPath: "/assets/audralia/audralia.runtime.js",
  renderMode: "rich-procedural-planet-detail-upgrade",
  exposedLandRatioIntent: "earth-compatible-above-water-ratio",
  materialLanguage: ["diamond", "opal", "granite", "slate", "white-opal-sand", "black-diamond-sand"],
  landmasses: [
    {
      id: "western-mainland-arc",
      fill: "rgba(89, 117, 84, 0.97)",
      secondary: "rgba(122, 119, 88, 0.58)",
      high: "rgba(218, 220, 181, 0.58)",
      coast: "rgba(244, 221, 164, 0.50)",
      shadow: "rgba(36, 43, 35, 0.38)",
      points: [[-54,-158],[-48,-149],[-39,-140],[-29,-134],[-18,-132],[-8,-126],[1,-117],[11,-108],[20,-94],[25,-82],[23,-71],[15,-62],[3,-57],[-10,-60],[-23,-71],[-34,-90],[-44,-116],[-52,-139]]
    },
    {
      id: "eastern-attached-mainland",
      fill: "rgba(129, 116, 82, 0.97)",
      secondary: "rgba(99, 125, 100, 0.45)",
      high: "rgba(232, 203, 151, 0.55)",
      coast: "rgba(252, 233, 179, 0.47)",
      shadow: "rgba(44, 34, 27, 0.34)",
      points: [[-26,-68],[-14,-55],[-2,-44],[9,-31],[20,-17],[30,-2],[37,16],[35,34],[25,50],[11,58],[-5,54],[-18,42],[-26,23],[-31,-3],[-32,-31],[-30,-51]]
    },
    {
      id: "northern-rock-crown",
      fill: "rgba(176, 205, 211, 0.91)",
      secondary: "rgba(105, 126, 115, 0.36)",
      high: "rgba(248, 252, 255, 0.76)",
      coast: "rgba(221, 241, 248, 0.59)",
      shadow: "rgba(57, 80, 90, 0.28)",
      points: [[41,-154],[50,-132],[58,-105],[64,-76],[66,-48],[61,-20],[53,7],[44,26],[37,11],[34,-20],[35,-56],[37,-94]]
    },
    {
      id: "southern-weathered-mass",
      fill: "rgba(108, 125, 102, 0.97)",
      secondary: "rgba(141, 132, 94, 0.42)",
      high: "rgba(210, 229, 214, 0.50)",
      coast: "rgba(222, 240, 230, 0.51)",
      shadow: "rgba(28, 43, 34, 0.33)",
      points: [[-69,-50],[-62,-17],[-55,20],[-47,49],[-36,76],[-25,107],[-28,130],[-41,153],[-55,166],[-68,157],[-76,122],[-80,78],[-78,28]]
    },
    {
      id: "equatorial-ancient-chain",
      fill: "rgba(118, 100, 77, 0.96)",
      secondary: "rgba(102, 122, 97, 0.32)",
      high: "rgba(241, 213, 156, 0.54)",
      coast: "rgba(247, 224, 169, 0.45)",
      shadow: "rgba(42, 32, 25, 0.33)",
      points: [[-13,60],[-3,75],[9,94],[18,116],[19,137],[9,156],[-4,166],[-16,154],[-22,130],[-23,101],[-20,77]]
    },
    {
      id: "western-island-belt",
      fill: "rgba(128, 125, 91, 0.92)",
      secondary: "rgba(102, 125, 98, 0.30)",
      high: "rgba(232, 216, 166, 0.44)",
      coast: "rgba(248, 229, 178, 0.40)",
      shadow: "rgba(42, 40, 29, 0.28)",
      points: [[4,-171],[15,-164],[23,-150],[21,-138],[11,-131],[-2,-136],[-8,-151],[-5,-165]]
    },
    {
      id: "south-east-shelf-islands",
      fill: "rgba(100, 124, 98, 0.90)",
      secondary: "rgba(128, 116, 82, 0.30)",
      high: "rgba(207, 233, 210, 0.40)",
      coast: "rgba(232, 241, 207, 0.38)",
      shadow: "rgba(30, 46, 34, 0.27)",
      points: [[-42,92],[-34,106],[-29,122],[-34,138],[-49,134],[-56,116],[-53,100]]
    },
    {
      id: "far-east-reef-knife",
      fill: "rgba(126, 136, 91, 0.84)",
      secondary: "rgba(75, 118, 112, 0.28)",
      high: "rgba(233, 226, 170, 0.38)",
      coast: "rgba(226, 240, 198, 0.34)",
      shadow: "rgba(34, 43, 30, 0.25)",
      points: [[-48,146],[-36,154],[-20,164],[-7,176],[0,-174],[-17,-169],[-35,-160],[-51,-151]]
    }
  ],
  shelves: [
    [[-60,-164],[-49,-150],[-37,-141],[-20,-141],[2,-124],[26,-96],[28,-72],[8,-50],[-18,-54],[-42,-88],[-58,-126]],
    [[-30,-73],[-4,-52],[23,-20],[45,13],[40,50],[9,72],[-21,49],[-38,3],[-38,-43]],
    [[36,-162],[64,-128],[74,-70],[72,-8],[54,37],[31,11],[26,-45],[30,-106]],
    [[-81,-63],[-70,8],[-57,64],[-33,97],[-18,132],[-44,176],[-71,178],[-85,126],[-87,31]],
    [[-24,56],[2,75],[24,105],[23,145],[4,176],[-22,161],[-33,118]],
    [[-52,130],[-43,146],[-30,162],[-13,176],[4,-170],[-13,-161],[-33,-151],[-54,-139]]
  ],
  pressureLines: [
    [[-61,-142],[-48,-121],[-36,-94],[-25,-63],[-12,-32],[6,-5],[22,26]],
    [[40,-140],[52,-102],[57,-60],[53,-17],[43,19]],
    [[-68,98],[-53,119],[-36,139],[-18,158],[2,177]],
    [[-16,70],[-2,93],[7,117],[4,144],[-8,162]],
    [[-34,-129],[-12,-115],[10,-96],[29,-72]],
    [[28,-2],[17,25],[5,54],[-10,78],[-23,100]],
    [[-49,144],[-36,156],[-20,168],[-2,179],[18,-169]]
  ],
  basins: [
    [[-38,112],[-18,87],[4,74],[30,73],[55,88]],
    [[-62,-18],[-39,4],[-15,17],[13,23],[39,18]],
    [[10,-169],[-7,169],[-24,145],[-41,126]],
    [[35,76],[20,104],[3,132],[-16,154]],
    [[48,-78],[32,-52],[13,-32],[-9,-20],[-31,-16]]
  ],
  storms: [
    { lat: 18, lon: -32, radius: 0.105, speed: 0.0040 },
    { lat: -34, lon: 42, radius: 0.090, speed: -0.0032 },
    { lat: 52, lon: 128, radius: 0.078, speed: 0.0035 }
  ]
});

let activeController = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resolveMount(target) {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) return target;
  if (target && typeof HTMLElement !== "undefined" && target.mount instanceof HTMLElement) return target.mount;
  if (target && typeof HTMLElement !== "undefined" && target.target instanceof HTMLElement) return target.target;
  if (target && typeof HTMLElement !== "undefined" && target.container instanceof HTMLElement) return target.container;

  if (typeof target === "string") {
    const selected = document.querySelector(target);
    if (selected) return selected;
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

  for (let index = 0; index < selectors.length; index += 1) {
    const selected = document.querySelector(selectors[index]);
    if (selected) return selected;
  }

  return document.body;
}

function setRouteStatus(message) {
  const selectors = ["#audralia-route-status", "[data-audralia-route-status]", "#audralia-status", "[data-route-status]"];

  for (let index = 0; index < selectors.length; index += 1) {
    const node = document.querySelector(selectors[index]);

    if (node) {
      node.textContent = message;
      node.setAttribute("data-audralia-canvas-loaded", "true");
      node.setAttribute("data-audralia-canvas-receipt", RECEIPT);
      return;
    }
  }
}

function removeResidue() {
  const badText = {
    "Loading Audralia": true,
    "Audralia canvas authority import failed.": true,
    "Audralia canvas authority import failed. missing ) after argument list": true,
    "Canvas authority imported · no render export found": true,
    "Audralia canvas authority imported, but no render export was found.": true,
    "Audralia doorway is loading the current adopted canvas authority.": true
  };

  const nodes = document.querySelectorAll("p, div, span, li, h2, h3");

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    const text = (node.textContent || "").trim();

    if (node.children.length === 0 && badText[text]) {
      node.remove();
    }
  }
}

function clearOwnedNodes(mount) {
  const nodes = mount.querySelectorAll("[data-audralia-canvas-authority='true']");

  for (let index = 0; index < nodes.length; index += 1) {
    nodes[index].remove();
  }
}

function createCanvas(mount) {
  clearOwnedNodes(mount);
  removeResidue();

  const shell = document.createElement("section");
  shell.setAttribute("data-audralia-canvas-authority", "true");
  shell.setAttribute("data-audralia-receipt", RECEIPT);
  shell.setAttribute("data-audralia-contract", CONTRACT);
  shell.setAttribute("data-audralia-revision", REVISION);
  shell.style.width = "min(100%, 960px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.setAttribute("data-audralia-canvas-frame", "rich-planet-contained-square-v2");
  frame.style.width = "min(92vw, 820px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(23, 54, 86, 0.98), rgba(2, 7, 19, 1) 70%)";
  frame.style.boxShadow = "0 30px 96px rgba(0, 0, 0, 0.52), inset 0 0 88px rgba(136, 195, 255, 0.09)";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("aria-label", "Audralia rich procedural planet canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.setAttribute("data-audralia-canvas-proof", "true");
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245, 233, 199, 0.88)";
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
  const fallback = Math.min(window.innerWidth || 760, 820);
  const size = Math.max(320, Math.floor(Math.min(rect.width || fallback, rect.height || fallback)));
  const ratio = clamp(window.devicePixelRatio || 1, 1, 2.25);

  canvas.width = Math.floor(size * ratio);
  canvas.height = Math.floor(size * ratio);
  canvas.setAttribute("data-pixel-ratio", String(ratio));

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

  if (!ctx) {
    throw new Error("Audralia canvas context unavailable.");
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  return { ctx, size, ratio };
}

function normalizeLongitude(lon) {
  let value = lon;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function hash01(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

function project(latDeg, lonDeg, rotationDeg, size) {
  const lat = latDeg * Math.PI / 180;
  const lon = normalizeLongitude(lonDeg + rotationDeg) * Math.PI / 180;
  const tilt = -8.5 * Math.PI / 180;
  const cosLat = Math.cos(lat);
  const x0 = cosLat * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = cosLat * Math.cos(lon);
  const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
  const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
  const radius = size * 0.348;

  return {
    x: size / 2 + x0 * radius,
    y: size / 2 - y * radius,
    z,
    radius,
    visible: z > -0.035
  };
}

function radial(ctx, x0, y0, r0, x1, y1, r1, stops) {
  const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);

  for (let index = 0; index < stops.length; index += 1) {
    gradient.addColorStop(stops[index][0], stops[index][1]);
  }

  return gradient;
}

function clipGlobe(ctx, size) {
  const radius = size * 0.348;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
  ctx.clip();
}

function drawProjectedPath(ctx, path, rotation, size, options) {
  const projected = [];

  for (let index = 0; index < path.length; index += 1) {
    projected.push(project(path[index][0], path[index][1], rotation, size));
  }

  const visibleCount = projected.filter(function (point) { return point.visible; }).length;
  if (visibleCount < 2) return false;

  ctx.save();
  ctx.beginPath();

  let started = false;

  for (let index = 0; index < projected.length; index += 1) {
    const point = projected[index];

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
    ctx.globalAlpha = options.alpha === undefined ? 1 : options.alpha;
    ctx.strokeStyle = options.stroke;
    ctx.lineWidth = options.lineWidth || 1;
    ctx.stroke();
  }

  ctx.restore();
  return true;
}

function drawStarField(ctx, size, time) {
  ctx.save();
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 150; index += 1) {
    const sx = Math.sin(index * 917.17) * 10000;
    const sy = Math.sin(index * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y = (sy - Math.floor(sy)) * size;
    const pulse = 0.24 + 0.56 * Math.abs(Math.sin(time * 0.001 + index));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 7 === 0 ? "rgba(245, 221, 166, 0.86)" : "rgba(185, 216, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(x, y, index % 13 === 0 ? 1.35 : 0.72, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawOrbitalGlow(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.348;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time * 0.00022) * 0.12);

  for (let index = 0; index < 5; index += 1) {
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * (1.08 + index * 0.052), radius * (0.16 + index * 0.022), 0, 0, Math.PI * 2);
    ctx.strokeStyle = index % 2 === 0 ? "rgba(240, 211, 138, 0.10)" : "rgba(127, 194, 255, 0.10)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawOceanBase(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.348;

  ctx.save();
  clipGlobe(ctx, size);

  const ocean = radial(ctx, cx - radius * 0.40, cy - radius * 0.46, radius * 0.04, cx, cy, radius * 1.24, [
    [0, "rgba(169, 234, 255, 1)"],
    [0.17, "rgba(58, 154, 210, 1)"],
    [0.42, "rgba(13, 89, 158, 1)"],
    [0.72, "rgba(4, 37, 91, 1)"],
    [1, "rgba(1, 13, 40, 1)"]
  ]);

  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.globalAlpha = 0.25;

  for (let band = 0; band < 18; band += 1) {
    const y = cy - radius + (band / 17) * radius * 2;
    const phase = time * 0.001 + band * 1.31;

    ctx.strokeStyle = band % 3 === 0 ? "rgba(190, 238, 255, 0.34)" : "rgba(24, 100, 165, 0.30)";
    ctx.lineWidth = band % 3 === 0 ? 1.1 : 0.7;
    ctx.beginPath();

    for (let x = cx - radius; x <= cx + radius; x += 7) {
      const wave = Math.sin(x * 0.026 + phase) * radius * 0.009;
      const ripple = Math.cos(x * 0.053 - phase) * radius * 0.004;
      const yy = y + wave + ripple;

      if (x === cx - radius) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawShelves(ctx, rotation, size) {
  for (let index = 0; index < PLANET.shelves.length; index += 1) {
    drawProjectedPath(ctx, PLANET.shelves[index], rotation, size, {
      close: true,
      fill: index % 2 === 0 ? "rgba(117, 205, 216, 0.31)" : "rgba(182, 232, 228, 0.23)",
      stroke: "rgba(226, 238, 213, 0.22)",
      lineWidth: 1.15,
      alpha: 0.92
    });
  }
}

function drawTerrainTexture(ctx, mass, rotation, size, time, massIndex) {
  const centroid = mass.points.reduce(function (acc, point) {
    acc.lat += point[0];
    acc.lon += point[1];
    return acc;
  }, { lat: 0, lon: 0 });

  centroid.lat /= mass.points.length;
  centroid.lon /= mass.points.length;

  for (let index = 0; index < 18; index += 1) {
    const seed = (massIndex + 1) * 100 + index;
    const lat = centroid.lat + (hash01(seed) - 0.5) * 28;
    const lon = centroid.lon + (hash01(seed + 7) - 0.5) * 42;
    const point = project(lat, lon, rotation, size);

    if (!point.visible) continue;

    const scale = size * (0.006 + hash01(seed + 14) * 0.009);

    ctx.save();
    ctx.globalAlpha = 0.18 + hash01(seed + 30) * 0.18;
    ctx.fillStyle = index % 3 === 0 ? mass.high : mass.secondary;
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, scale * 2.2, scale, time * 0.00018 + seed, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawLand(ctx, rotation, size, time) {
  for (let index = 0; index < PLANET.landmasses.length; index += 1) {
    const mass = PLANET.landmasses[index];

    drawProjectedPath(ctx, mass.points, rotation, size, {
      close: true,
      fill: mass.shadow,
      stroke: "rgba(10, 14, 18, 0.24)",
      lineWidth: 2.4,
      alpha: 0.55
    });

    drawProjectedPath(ctx, mass.points, rotation, size, {
      close: true,
      fill: mass.fill,
      stroke: mass.coast,
      lineWidth: 1.55,
      alpha: 0.99
    });

    drawTerrainTexture(ctx, mass, rotation, size, time, index);

    const ridge = [];
    for (let j = 0; j < mass.points.length; j += 2) ridge.push(mass.points[j]);

    drawProjectedPath(ctx, ridge, rotation + Math.sin(time * 0.00012 + index) * 1.2, size, {
      close: false,
      stroke: mass.high,
      lineWidth: 0.95,
      alpha: 0.78
    });
  }
}

function drawIce(ctx, rotation, size) {
  const north = [[67,-174],[75,-119],[78,-51],[71,18],[63,67],[58,17],[60,-58],[61,-126]];
  const south = [[-79,-164],[-70,-91],[-67,-22],[-71,48],[-78,124],[-84,171],[-86,52]];

  drawProjectedPath(ctx, north, rotation, size, {
    close: true,
    fill: "rgba(236, 248, 255, 0.78)",
    stroke: "rgba(174, 227, 255, 0.54)",
    lineWidth: 1.1,
    alpha: 0.9
  });

  drawProjectedPath(ctx, south, rotation, size, {
    close: true,
    fill: "rgba(226, 244, 251, 0.72)",
    stroke: "rgba(174, 227, 255, 0.48)",
    lineWidth: 1.1,
    alpha: 0.9
  });
}

function drawTopology(ctx, rotation, size) {
  for (let index = 0; index < PLANET.pressureLines.length; index += 1) {
    drawProjectedPath(ctx, PLANET.pressureLines[index], rotation, size, {
      close: false,
      stroke: index % 2 === 0 ? "rgba(238, 205, 125, 0.42)" : "rgba(177, 222, 255, 0.34)",
      lineWidth: 1.14,
      alpha: 0.74
    });
  }

  for (let index = 0; index < PLANET.basins.length; index += 1) {
    drawProjectedPath(ctx, PLANET.basins[index], rotation, size, {
      close: false,
      stroke: "rgba(13, 25, 64, 0.48)",
      lineWidth: 2.2,
      alpha: 0.72
    });
  }
}

function drawClouds(ctx, rotation, size, time) {
  const radius = size * 0.348;

  ctx.save();
  clipGlobe(ctx, size);
  ctx.globalAlpha = 0.36;
  ctx.strokeStyle = "rgba(245, 250, 255, 0.55)";
  ctx.lineWidth = 1.35;

  for (let band = 0; band < 10; band += 1) {
    const lat = -49 + band * 10.8;
    const offset = rotation * 0.7 + time * 0.006 + band * 31;

    ctx.beginPath();

    let started = false;

    for (let lon = -180; lon <= 180; lon += 9) {
      const wavyLat = lat + Math.sin((lon + offset) * Math.PI / 58) * 2.8;
      const point = project(wavyLat, lon, rotation + time * 0.002, size);

      if (!point.visible) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(point.x, point.y);
        started = true;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    ctx.stroke();
  }

  for (let index = 0; index < PLANET.storms.length; index += 1) {
    const storm = PLANET.storms[index];
    const point = project(storm.lat, storm.lon, rotation + time * storm.speed, size);

    if (!point.visible) continue;

    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(time * 0.001 + index);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
    ctx.lineWidth = 1;

    for (let loop = 0; loop < 3; loop += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * storm.radius * (loop + 1), 0.3 * loop, Math.PI * 1.75 + loop * 0.4);
      ctx.stroke();
    }

    ctx.restore();
  }

  ctx.restore();
}

function drawAtmosphere(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.348;
  const pulse = 0.46 + Math.sin(time * 0.0013) * 0.06;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(159, 214, 255, " + pulse.toFixed(3) + ")";
  ctx.lineWidth = size * 0.012;
  ctx.stroke();

  const shade = radial(ctx, cx - radius * 0.42, cy - radius * 0.46, radius * 0.05, cx + radius * 0.18, cy + radius * 0.16, radius * 1.18, [
    [0, "rgba(255, 255, 255, 0.13)"],
    [0.52, "rgba(255, 255, 255, 0.018)"],
    [0.76, "rgba(0, 0, 0, 0.17)"],
    [1, "rgba(0, 0, 0, 0.68)"]
  ]);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = shade;
  ctx.fill();

  ctx.restore();
}

function drawDiagnostics(ctx, size) {
  ctx.save();
  ctx.fillStyle = "rgba(244, 226, 178, 0.90)";
  ctx.font = "700 " + Math.max(13, size * 0.027) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.864);

  ctx.fillStyle = "rgba(174, 204, 225, 0.70)";
  ctx.font = "500 " + Math.max(10, size * 0.015) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("RICH PLANET CANVAS · DETAIL UPGRADE", size / 2, size * 0.895);
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
      notBlank: sample[3] > 0 && sample[0] + sample[1] + sample[2] > 12
    };
  } catch (error) {
    return { notBlank: null, error: error instanceof Error ? error.message : String(error) };
  }
}

function publishStatus(state) {
  const status = {
    loaded: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    revision: REVISION,
    version: VERSION,
    compatibility: COMPATIBILITY_CONTRACT,
    autoBoot: false,
    routeOwnsCall: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    canonicalExport: "mountAudraliaCanvas",
    renderMode: PLANET.renderMode,
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount),
    animated: true,
    frameCount: state.frameCount,
    pixelProof: state.pixelProof || null
  };

  window.__AUDRALIA_CANVAS_STATUS__ = status;
  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = status;
  window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: status }));

  return status;
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;
  const rotation = ((time * 0.006) % 360) - 180;

  ctx.clearRect(0, 0, size, size);

  drawStarField(ctx, size, time);
  drawOrbitalGlow(ctx, size, time);
  drawOceanBase(ctx, size, time);

  ctx.save();
  clipGlobe(ctx, size);
  drawShelves(ctx, rotation, size);
  drawLand(ctx, rotation, size, time);
  drawIce(ctx, rotation, size);
  drawTopology(ctx, rotation, size);
  drawClouds(ctx, rotation, size, time);
  ctx.restore();

  drawAtmosphere(ctx, size, time);
  drawDiagnostics(ctx, size);

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

function startCanvas(target, options) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();

  const mount = resolveMount(target);
  const nodes = createCanvas(mount);
  const setup = setupCanvas(nodes.canvas, nodes.frame);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    proof: nodes.proof,
    ctx: setup.ctx,
    size: setup.size,
    ratio: setup.ratio,
    mount,
    options: options || {},
    frameCount: 0,
    pixelProof: null,
    stopped: false,
    rafId: null,
    resizeTimer: null
  };

  function animate(frameTime) {
    if (state.stopped) return;
    renderFrame(state, frameTime || performance.now());
    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(function () {
      const next = setupCanvas(state.canvas, state.frame);
      state.ctx = next.ctx;
      state.size = next.size;
      state.ratio = next.ratio;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 120);
  }

  state.stop = function () {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    window.removeEventListener("resize", resize);
  };

  window.addEventListener("resize", resize, { passive: true });

  activeController = state;

  setRouteStatus("Audralia adopted canvas authority loaded.");
  publishStatus(state);
  animate(performance.now());

  return state;
}

export function mountAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function bootAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function createAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function initAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function mountAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function render(target, options) {
  return startCanvas(target, options || {});
}

export function mount(target, options) {
  return startCanvas(target, options || {});
}

export function init(target, options) {
  return startCanvas(target, options || {});
}

export function getAudraliaCanvasStatus() {
  return window.__AUDRALIA_CANVAS_STATUS__ || {
    loaded: false,
    receipt: RECEIPT,
    contract: CONTRACT,
    revision: REVISION,
    version: VERSION,
    canonicalExport: "mountAudraliaCanvas"
  };
}

export function getAudraliaSurfaceDataset() {
  return PLANET;
}

export function stopAudraliaCanvas() {
  stopActiveController();

  return { stopped: true, receipt: RECEIPT, contract: CONTRACT, revision: REVISION, version: VERSION };
}

const api = {
  RECEIPT,
  CONTRACT,
  REVISION,
  VERSION,
  PLANET,
  mountAudraliaCanvas,
  renderAudraliaCanvas,
  bootAudraliaCanvas,
  createAudraliaCanvas,
  initAudraliaCanvas,
  renderAudralia,
  mountAudralia,
  render,
  mount,
  init,
  getAudraliaCanvasStatus,
  getAudraliaSurfaceDataset,
  stopAudraliaCanvas
};

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
}

export default api;
