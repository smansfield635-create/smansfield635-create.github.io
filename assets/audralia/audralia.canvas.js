/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9 */
/*
  Result:
  - Renews the Audralia adopted canvas authority only.
  - Preserves the route shell, HTML shell, runtime file, Gauges file, topology, terrain, hydration, oceans, and deep-ocean files.
  - Keeps rendering runtime-backed and fail-open.
  - Reduces green-gray haze washout.
  - Restores stronger ocean depth, coastline, shelf, land, mineral, ice, and terrain separation.
  - Preserves mobile interaction safety: canvas is noninteractive, selectable text outside the canvas remains available, animation is throttled.
  - No GraphicBox.
  - No image generation.
  - No visual pass claim.
*/

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9";
const COMPATIBILITY_CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8";
const ROUTE_EXPECTED = "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1";
const RUNTIME_EXPECTED = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";
const VERSION = "2026-05-07.canvas-runtime-backed-orthographic-realism-v9";

const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const FRAME_RATE_TARGET = 24;
const FRAME_INTERVAL = 1000 / FRAME_RATE_TARGET;

let activeController = null;

const PLANET = Object.freeze({
  name: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  compatibilityContract: COMPATIBILITY_CONTRACT,
  routeExpected: ROUTE_EXPECTED,
  runtimeExpected: RUNTIME_EXPECTED,
  version: VERSION,
  autoBoot: false,
  routeOwnsCall: true,
  canvasOwns: Object.freeze([
    "canvas_creation",
    "orthographic_projection",
    "runtime_sample_consumption",
    "fail_open_first_paint",
    "visible_texture_expression",
    "mobile_safe_animation",
    "pixel_proof_status"
  ]),
  canvasDoesNotOwn: Object.freeze([
    "html_shell",
    "route_shell",
    "runtime_truth",
    "topology_authority",
    "terrain_authority",
    "hydration_authority",
    "ocean_authority",
    "deep_ocean_authority",
    "gauges_scoring",
    "graphic_box",
    "image_generation",
    "visual_pass_claim"
  ]),
  renderMode: "runtime-backed-orthographic-realism-v9",
  visualTarget: "clearer 4k realism: lower haze, sharper coastlines, stronger ocean depth, restored land-water-material separation",
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

const PALETTE = Object.freeze({
  void: [2, 7, 19, 255],
  space: [2, 6, 16, 255],

  oceanDeep: [3, 20, 58, 255],
  oceanMid: [9, 59, 112, 255],
  oceanBlue: [18, 100, 168, 255],
  oceanHighlight: [56, 159, 205, 255],

  shelf: [53, 174, 188, 255],
  shelfBright: [92, 211, 205, 255],
  coastFoam: [212, 229, 202, 255],

  lowland: [84, 125, 88, 255],
  upland: [126, 122, 82, 255],
  highland: [171, 154, 102, 255],
  mineralGold: [198, 167, 84, 255],
  granite: [157, 148, 128, 255],
  slate: [75, 88, 96, 255],
  opal: [168, 220, 205, 255],
  diamond: [232, 244, 249, 255],

  ice: [229, 246, 252, 255],
  iceShadow: [153, 197, 215, 255],

  atmosphere: [91, 176, 218, 255],
  rim: [130, 207, 248, 255],
  labelGold: [244, 226, 178, 255]
});

const FALLBACK_MASSES = Object.freeze([
  {
    id: "western-mainland",
    lon: -106,
    lat: -18,
    rx: 54,
    ry: 28,
    height: 0.78,
    mineral: 0.62,
    green: 0.52
  },
  {
    id: "eastern-mainland",
    lon: -18,
    lat: 6,
    rx: 42,
    ry: 32,
    height: 0.72,
    mineral: 0.54,
    green: 0.46
  },
  {
    id: "southern-mass",
    lon: 78,
    lat: -55,
    rx: 48,
    ry: 22,
    height: 0.62,
    mineral: 0.58,
    green: 0.50
  },
  {
    id: "equatorial-chain",
    lon: 123,
    lat: -8,
    rx: 34,
    ry: 19,
    height: 0.70,
    mineral: 0.70,
    green: 0.38
  },
  {
    id: "north-polar-crown",
    lon: -74,
    lat: 66,
    rx: 52,
    ry: 17,
    height: 0.44,
    mineral: 0.35,
    green: 0.28
  },
  {
    id: "far-east-reef",
    lon: 165,
    lat: -28,
    rx: 30,
    ry: 11,
    height: 0.36,
    mineral: 0.48,
    green: 0.44
  }
]);

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function mixColor(a, b, t) {
  const amount = clamp01(t);
  return [
    Math.round(mix(a[0], b[0], amount)),
    Math.round(mix(a[1], b[1], amount)),
    Math.round(mix(a[2], b[2], amount)),
    255
  ];
}

function multiplyColor(color, shade) {
  return [
    clamp(Math.round(color[0] * shade), 0, 255),
    clamp(Math.round(color[1] * shade), 0, 255),
    clamp(Math.round(color[2] * shade), 0, 255),
    color[3] === undefined ? 255 : color[3]
  ];
}

function lighten(color, amount) {
  return mixColor(color, [255, 255, 255, 255], amount);
}

function darken(color, amount) {
  return mixColor(color, [0, 0, 0, 255], amount);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function normalizeLongitudeDegrees(lon) {
  let value = Number(lon) || 0;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function longitudeDistanceDegrees(a, b) {
  const direct = Math.abs(normalizeLongitudeDegrees(a - b));
  return Math.min(direct, 360 - direct);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
}

function valueNoise(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  function h(dx, dy, dz) {
    return hash3(ix + dx, iy + dy, iz + dz);
  }

  const x00 = mix(h(0, 0, 0), h(1, 0, 0), ux);
  const x10 = mix(h(0, 1, 0), h(1, 1, 0), ux);
  const x01 = mix(h(0, 0, 1), h(1, 0, 1), ux);
  const x11 = mix(h(0, 1, 1), h(1, 1, 1), ux);

  return mix(mix(x00, x10, uy), mix(x01, x11, uy), uz);
}

function fbm3(x, y, z, octaves = 5) {
  let total = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    total += valueNoise(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2.05;
  }

  return total / Math.max(0.000001, normalizer);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function latLonToVector(lat, lon) {
  const cosLat = Math.cos(lat);
  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function vectorToLatLon(x, y, z, rotation) {
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);

  const xr = x * cosRot - z * sinRot;
  const zr = x * sinRot + z * cosRot;

  const lat = Math.asin(clamp(y, -1, 1));
  const lon = Math.atan2(xr, zr);

  return { lat, lon };
}

function normalizeRuntimeSurface(raw, lat, lon, u, v) {
  const visualSurfaceClass = String(
    raw?.visualSurfaceClass ||
    raw?.surfaceClass ||
    raw?.className ||
    raw?.type ||
    ""
  );

  const ice = Boolean(
    raw?.ice ||
    raw?.glacier ||
    visualSurfaceClass.includes("ice") ||
    visualSurfaceClass.includes("snow")
  );

  const water = Boolean(
    raw?.liquidWater ||
    raw?.water ||
    raw?.ocean ||
    raw?.shelf ||
    visualSurfaceClass.includes("water") ||
    visualSurfaceClass.includes("ocean") ||
    visualSurfaceClass.includes("shelf")
  );

  const shelf = Boolean(
    raw?.shelf ||
    visualSurfaceClass.includes("shelf")
  );

  const ocean = Boolean(
    raw?.ocean ||
    visualSurfaceClass.includes("ocean")
  );

  const land = Boolean(
    raw?.land ||
    raw?.visibleLand ||
    raw?.exposedTerrainLand ||
    raw?.solidSurfaceLand ||
    visualSurfaceClass.includes("land") ||
    visualSurfaceClass.includes("terrain")
  ) && !water && !ice;

  const solidSurfaceLand = Boolean(raw?.solidSurfaceLand || land || ice) && !water;
  const depth = water ? clamp01(Number(raw?.depth ?? raw?.oceanDepth ?? raw?.routeSafeDepth ?? 0.48)) : 0;
  const elevation = solidSurfaceLand ? clamp01(Number(raw?.elevation ?? raw?.maxElevation ?? raw?.terrainRelief ?? 0.22)) : 0;
  const relief = solidSurfaceLand ? clamp01(Number(raw?.terrainRelief ?? raw?.terrainReliefIndex ?? elevation)) : 0;
  const mineral = clamp01(Number(raw?.mineralIndex ?? raw?.diamondSignal ?? raw?.opalSignal ?? 0.32));
  const coast = clamp01(Number(raw?.coastlineIndex ?? raw?.coastalFeather ?? raw?.coastWaterMask ?? (shelf ? 0.65 : 0)));
  const turquoise = clamp01(Number(raw?.turquoiseIndex ?? raw?.turquoise ?? raw?.visibleTurquoiseIndex ?? (shelf ? 0.64 : 0.12)));
  const mountain = clamp01(Number(raw?.mountainIndex ?? elevation));
  const cliff = clamp01(Number(raw?.coastalCliffIndex ?? raw?.cliff ?? 0));
  const deep = clamp01(Number(raw?.deepOceanBlend ?? raw?.organicDeepOceanPresence ?? raw?.routeSafeDepth ?? depth));

  return {
    raw,
    ok: true,
    lat,
    lon,
    u,
    v,
    visualSurfaceClass,
    water,
    land,
    solidSurfaceLand,
    ice,
    shelf,
    ocean,
    depth,
    elevation,
    relief,
    mineral,
    coast,
    turquoise,
    mountain,
    cliff,
    deep,
    fallback: Boolean(raw?.fallback || raw?.fallbackSample || raw?.isFallback)
  };
}

function fallbackMassInfluence(latDeg, lonDeg, mass) {
  const dx = longitudeDistanceDegrees(lonDeg, mass.lon) / mass.rx;
  const dy = Math.abs(latDeg - mass.lat) / mass.ry;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const noise = fbm3(
    Math.sin((lonDeg + mass.lon) * Math.PI / 180) * 4 + mass.height,
    Math.sin((latDeg + mass.lat) * Math.PI / 180) * 4 - mass.green,
    mass.mineral * 9,
    4
  );

  return smoothstep(1.05, 0.32, distance + (noise - 0.5) * 0.22);
}

function fallbackSurface(lat, lon, u, v) {
  const latDeg = lat * 180 / Math.PI;
  const lonDeg = normalizeLongitudeDegrees(lon * 180 / Math.PI);

  let landScore = -0.42;
  let mineral = 0.18;
  let green = 0.24;
  let massStrength = 0;

  for (const mass of FALLBACK_MASSES) {
    const influence = fallbackMassInfluence(latDeg, lonDeg, mass);
    landScore += influence * mass.height;
    mineral += influence * mass.mineral * 0.22;
    green += influence * mass.green * 0.18;
    massStrength = Math.max(massStrength, influence);
  }

  const shapeNoise = fbm3(
    Math.cos(lat) * Math.sin(lon) * 3.8,
    Math.sin(lat) * 3.8,
    Math.cos(lat) * Math.cos(lon) * 3.8,
    5
  );

  const detailNoise = fbm3(
    Math.cos(lat) * Math.sin(lon) * 17.2,
    Math.sin(lat) * 17.2,
    Math.cos(lat) * Math.cos(lon) * 17.2,
    4
  );

  landScore += (shapeNoise - 0.5) * 0.18 * Math.max(0.3, massStrength);

  const polar = Math.abs(latDeg) > 72;
  const ice = polar && (latDeg > 0 || landScore > -0.26);
  const land = landScore > 0.03 && !ice;
  const shelf = !land && !ice && landScore > -0.18;
  const water = !land && !ice;
  const depth = water ? clamp01(Math.abs(landScore) * 1.2 + (1 - detailNoise) * 0.22) : 0;
  const elevation = land ? clamp01(landScore * 0.86 + detailNoise * 0.18) : ice ? 0.32 : 0;

  return {
    ok: true,
    lat,
    lon,
    u,
    v,
    visualSurfaceClass: ice
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface",
    water,
    liquidWater: water,
    ocean: water && !shelf,
    shelf,
    land,
    exposedTerrainLand: land,
    visibleLand: land,
    solidSurfaceLand: land || ice,
    ice,
    glacier: ice,
    depth,
    oceanDepth: depth,
    elevation,
    maxElevation: elevation,
    terrainRelief: elevation,
    terrainReliefIndex: elevation,
    mineralIndex: clamp01(mineral),
    turquoiseIndex: shelf ? 0.72 : water ? 0.22 : 0.08,
    coastlineIndex: shelf ? 0.58 : land && landScore < 0.16 ? 0.42 : 0,
    mountainIndex: land ? clamp01(elevation * 0.82 + detailNoise * 0.24) : 0,
    coastalCliffIndex: land && landScore < 0.16 ? 0.34 : 0,
    deepOceanBlend: water ? clamp01(depth * 0.8) : 0,
    fallback: false,
    fallbackSample: false
  };
}

function surfaceToColor(sample, normal, lighting) {
  const micro = fbm3(
    normal.x * 21.5 + 1.7,
    normal.y * 21.5 - 4.3,
    normal.z * 21.5 + 8.1,
    4
  );

  const grain = fbm3(
    normal.x * 56.0 - 3.1,
    normal.y * 56.0 + 9.2,
    normal.z * 56.0 - 6.4,
    3
  );

  let color;

  if (sample.ice) {
    color = mixColor(PALETTE.iceShadow, PALETTE.ice, 0.58 + micro * 0.30);
    color = lighten(color, clamp01(sample.elevation * 0.18 + lighting.highlight * 0.1));
  } else if (sample.water) {
    const depth = clamp01(sample.depth);
    const deepBlend = clamp01(sample.deep || depth);
    const shelf = clamp01(sample.turquoise);

    color = mixColor(PALETTE.oceanBlue, PALETTE.oceanDeep, clamp01(depth * 0.92 + deepBlend * 0.28));
    color = mixColor(color, PALETTE.oceanMid, clamp01(0.18 + micro * 0.12));
    color = mixColor(color, PALETTE.shelf, clamp01(shelf * 0.58));
    color = mixColor(color, PALETTE.shelfBright, clamp01(sample.shelf ? 0.24 + shelf * 0.18 : shelf * 0.08));

    const current = Math.sin((normal.x * 18.0) + (normal.z * 9.0) + micro * 4.0) * 0.5 + 0.5;
    color = lighten(color, current * 0.035 + lighting.highlight * 0.04);
  } else {
    const relief = clamp01(sample.relief || sample.elevation);
    const mineral = clamp01(sample.mineral);
    const coast = clamp01(sample.coast);
    const mountain = clamp01(sample.mountain);

    color = mixColor(PALETTE.lowland, PALETTE.upland, clamp01(relief * 0.55 + mineral * 0.16));
    color = mixColor(color, PALETTE.highland, clamp01(mountain * 0.32));
    color = mixColor(color, PALETTE.granite, clamp01(mineral * 0.22 + grain * 0.08));
    color = mixColor(color, PALETTE.slate, clamp01(sample.cliff * 0.18 + (1 - lighting.light) * 0.05));
    color = mixColor(color, PALETTE.mineralGold, clamp01(mineral * 0.18 + relief * 0.07));
    color = mixColor(color, PALETTE.opal, clamp01(coast * 0.18));
    color = mixColor(color, PALETTE.coastFoam, clamp01(coast * 0.16));

    const pitting = (grain - 0.5) * 0.08 + (micro - 0.5) * 0.06;
    color = multiplyColor(color, 1 + pitting);
  }

  const finalShade = clamp(0.42 + lighting.light * 0.72 + lighting.rim * 0.18 - lighting.edge * 0.18, 0.36, 1.22);
  color = multiplyColor(color, finalShade);

  if (lighting.highlight > 0) {
    color = lighten(color, lighting.highlight * 0.10);
  }

  return color;
}

function sampleRuntime(runtime, lat, lon, u, v) {
  const sampler =
    runtime?.sampleSurface ||
    runtime?.sampleAudraliaSurface ||
    runtime?.sampleRuntimeState ||
    runtime?.sampleAudraliaPlanetState ||
    runtime?.sampleAudraliaRuntime ||
    runtime?.buildRuntimeField ||
    null;

  if (typeof sampler !== "function") {
    return normalizeRuntimeSurface(fallbackSurface(lat, lon, u, v), lat, lon, u, v);
  }

  try {
    const raw = sampler({ lat, lon, u, v }, lon, u, v);
    if (raw && typeof raw === "object") {
      return normalizeRuntimeSurface(raw, lat, lon, u, v);
    }
  } catch (_) {}

  return normalizeRuntimeSurface(fallbackSurface(lat, lon, u, v), lat, lon, u, v);
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
    "#audraliaRenderMount",
    "#audralia-mount",
    "[data-audralia-mount]",
    "[data-audralia-render-mount]",
    "#audralia-main",
    "main"
  ];

  for (const selector of selectors) {
    const selected = document.querySelector(selector);
    if (selected) return selected;
  }

  return document.body;
}

function setRouteStatus(message, status = null) {
  const selectors = [
    "#audralia-route-status",
    "[data-audralia-route-status]",
    "#audralia-status",
    "[data-route-status]"
  ];

  const detail = status
    ? [
        `Route ${ROUTE_EXPECTED}`,
        `Canvas ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Runtime ${RUNTIME_EXPECTED}`,
        "GraphicBox false",
        "Image generation false",
        "Visual pass claimed false"
      ].join(" · ")
    : "";

  for (const selector of selectors) {
    const node = document.querySelector(selector);

    if (node) {
      node.textContent = detail ? `${message}\n${detail}` : message;
      node.setAttribute("data-audralia-canvas-loaded", "true");
      node.setAttribute("data-audralia-canvas-receipt", RECEIPT);
      node.setAttribute("data-audralia-canvas-contract", CONTRACT);
      node.setAttribute("data-audralia-runtime-contract", RUNTIME_EXPECTED);
      node.setAttribute("data-graphic-box", "false");
      node.setAttribute("data-image-generation", "false");
      node.setAttribute("data-visual-pass-claimed", "false");
      return;
    }
  }
}

function removeResidue() {
  const badText = new Set([
    "Loading Audralia",
    "Audralia canvas authority import failed.",
    "Audralia canvas authority import failed. missing ) after argument list",
    "Canvas authority imported · no render export found",
    "Audralia canvas authority imported, but no render export was found.",
    "Audralia doorway is loading the current adopted canvas authority."
  ]);

  const nodes = document.querySelectorAll("p, div, span, li, h2, h3");

  for (const node of nodes) {
    const text = (node.textContent || "").trim();

    if (node.children.length === 0 && badText.has(text)) {
      node.remove();
    }
  }
}

function clearOwnedNodes(mount) {
  const nodes = mount.querySelectorAll("[data-audralia-canvas-authority='true']");
  for (const node of nodes) node.remove();
}

function createCanvasNodes(mount) {
  clearOwnedNodes(mount);
  removeResidue();

  const shell = document.createElement("section");
  shell.setAttribute("data-audralia-canvas-authority", "true");
  shell.setAttribute("data-audralia-receipt", RECEIPT);
  shell.setAttribute("data-audralia-contract", CONTRACT);
  shell.setAttribute("data-audralia-version", VERSION);
  shell.setAttribute("data-graphic-box", "false");
  shell.setAttribute("data-image-generation", "false");
  shell.setAttribute("data-visual-pass-claimed", "false");
  shell.style.width = "min(100%, 960px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.setAttribute("data-audralia-canvas-frame", "runtime-backed-orthographic-realism-v9");
  frame.style.width = "min(92vw, 820px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(18, 35, 60, 0.98), rgba(2, 7, 19, 1) 72%)";
  frame.style.boxShadow = "0 30px 96px rgba(0, 0, 0, 0.52), inset 0 0 88px rgba(136, 195, 255, 0.08)";
  frame.style.userSelect = "auto";
  frame.style.webkitUserSelect = "auto";
  frame.style.touchAction = "pan-y";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("aria-label", "Audralia runtime-backed orthographic realism canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.pointerEvents = "none";
  canvas.style.userSelect = "none";
  canvas.style.webkitUserSelect = "none";
  canvas.style.touchAction = "none";

  const proof = document.createElement("p");
  proof.setAttribute("data-audralia-canvas-proof", "true");
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245, 233, 199, 0.88)";
  proof.style.font = "700 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";
  proof.style.overflowWrap = "anywhere";

  const statusCard = document.createElement("div");
  statusCard.setAttribute("data-audralia-canvas-status-card", "true");
  statusCard.style.marginTop = "14px";
  statusCard.style.width = "min(92vw, 820px)";
  statusCard.style.border = "1px solid rgba(180, 206, 255, 0.14)";
  statusCard.style.borderRadius = "18px";
  statusCard.style.padding = "14px 16px";
  statusCard.style.background = "rgba(5, 10, 23, 0.60)";
  statusCard.style.color = "rgba(221, 230, 246, 0.84)";
  statusCard.style.font = "700 0.84rem/1.45 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  statusCard.style.overflowWrap = "anywhere";
  statusCard.textContent = [
    `Route ${ROUTE_EXPECTED}`,
    `Canvas ${CONTRACT}`,
    `Receipt ${RECEIPT}`,
    `Runtime ${RUNTIME_EXPECTED}`,
    "Retired " + COMPATIBILITY_CONTRACT,
    "GraphicBox false",
    "Image generation false",
    "Visual pass claimed false"
  ].join(" · ");

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  shell.appendChild(statusCard);
  mount.prepend(shell);

  return { shell, frame, canvas, proof, statusCard };
}

function setupCanvas(canvas, frame) {
  const rect = frame.getBoundingClientRect();
  const fallback = Math.min(window.innerWidth || 760, 820);
  const cssSize = Math.max(320, Math.floor(Math.min(rect.width || fallback, rect.height || fallback)));
  const ratio = clamp(window.devicePixelRatio || 1, 1, 1.75);

  canvas.width = Math.floor(cssSize * ratio);
  canvas.height = Math.floor(cssSize * ratio);
  canvas.setAttribute("data-pixel-ratio", String(ratio));
  canvas.setAttribute("data-css-size", String(cssSize));

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
    willReadFrequently: true
  });

  if (!ctx) {
    throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  return { ctx, size: cssSize, ratio };
}

async function importRuntime() {
  try {
    const module = await import(`${RUNTIME_PATH}?canvas=${encodeURIComponent(CONTRACT)}&v=${encodeURIComponent(VERSION)}`);

    let runtime = module;

    if (typeof module.createAudraliaRuntime === "function") {
      runtime = module.createAudraliaRuntime();
    } else if (typeof module.createAudraliaRuntimeAsync === "function") {
      runtime = await module.createAudraliaRuntimeAsync();
    } else if (typeof module.default === "function") {
      runtime = module.default();
    } else if (module.default && typeof module.default === "object") {
      runtime = module.default;
    }

    return {
      ok: true,
      module,
      runtime,
      error: "",
      receipt:
        module.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
        runtime?.receipt ||
        window.AUDRALIA_RUNTIME_RECEIPT ||
        RUNTIME_EXPECTED
    };
  } catch (error) {
    return {
      ok: false,
      module: null,
      runtime: null,
      error: String(error?.message || error || "runtime import failed"),
      receipt: "RUNTIME_IMPORT_FAIL_OPEN"
    };
  }
}

function buildTexture(runtimePack, width = 384, height = 192) {
  const texture = {
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4),
    stats: {
      samples: width * height,
      water: 0,
      land: 0,
      ice: 0,
      shelf: 0,
      fallback: 0,
      maxDepth: 0,
      maxElevation: 0,
      maxTurquoise: 0,
      runtimeBacked: Boolean(runtimePack.ok && runtimePack.runtime)
    }
  };

  for (let y = 0; y < height; y += 1) {
    const v = (y + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;

    for (let x = 0; x < width; x += 1) {
      const u = (x + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const vector = latLonToVector(lat, lon);
      const sample = sampleRuntime(runtimePack.runtime, lat, lon, u, v);

      const lightProbe = {
        light: 0.86,
        rim: 0.1,
        edge: 0,
        highlight: 0
      };

      const color = surfaceToColor(sample, vector, lightProbe);
      const index = (y * width + x) * 4;

      texture.data[index] = color[0];
      texture.data[index + 1] = color[1];
      texture.data[index + 2] = color[2];
      texture.data[index + 3] = 255;

      if (sample.water) texture.stats.water += 1;
      if (sample.land || sample.solidSurfaceLand) texture.stats.land += 1;
      if (sample.ice) texture.stats.ice += 1;
      if (sample.shelf) texture.stats.shelf += 1;
      if (sample.fallback) texture.stats.fallback += 1;
      texture.stats.maxDepth = Math.max(texture.stats.maxDepth, sample.depth);
      texture.stats.maxElevation = Math.max(texture.stats.maxElevation, sample.elevation);
      texture.stats.maxTurquoise = Math.max(texture.stats.maxTurquoise, sample.turquoise);
    }
  }

  texture.stats.waterRatio = texture.stats.water / texture.stats.samples;
  texture.stats.landRatio = texture.stats.land / texture.stats.samples;
  texture.stats.iceRatio = texture.stats.ice / texture.stats.samples;
  texture.stats.shelfRatio = texture.stats.shelf / texture.stats.samples;
  texture.stats.fallbackRatio = texture.stats.fallback / texture.stats.samples;

  return texture;
}

function sampleTexture(texture, u, v) {
  const x = Math.floor(wrap01(u) * (texture.width - 1));
  const y = Math.floor(clamp01(v) * (texture.height - 1));
  const index = (y * texture.width + x) * 4;

  return [
    texture.data[index],
    texture.data[index + 1],
    texture.data[index + 2],
    texture.data[index + 3]
  ];
}

function drawStarField(ctx, size, time) {
  ctx.save();
  ctx.fillStyle = "rgb(2, 7, 19)";
  ctx.fillRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(
    size * 0.50,
    size * 0.44,
    size * 0.08,
    size * 0.50,
    size * 0.50,
    size * 0.72
  );
  glow.addColorStop(0, "rgba(42, 79, 124, 0.18)");
  glow.addColorStop(0.48, "rgba(8, 24, 52, 0.18)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 120; index += 1) {
    const sx = fract(Math.sin(index * 917.17) * 10000);
    const sy = fract(Math.sin(index * 421.91) * 10000);
    const x = sx * size;
    const y = sy * size;
    const pulse = 0.22 + 0.50 * Math.abs(Math.sin(time * 0.0007 + index));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 9 === 0 ? "rgba(245, 221, 166, 0.78)" : "rgba(185, 216, 255, 0.64)";
    ctx.beginPath();
    ctx.arc(x, y, index % 17 === 0 ? 1.22 : 0.66, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawOrbitalRings(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.345;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.08 + Math.sin(time * 0.00016) * 0.05);

  for (let index = 0; index < 4; index += 1) {
    ctx.beginPath();
    ctx.ellipse(
      0,
      radius * 0.04,
      radius * (1.08 + index * 0.045),
      radius * (0.145 + index * 0.017),
      0,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = index % 2 === 0 ? "rgba(240, 211, 138, 0.08)" : "rgba(127, 194, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function renderPlanetImageData(state, time) {
  const size = state.size;
  const radius = size * 0.352;
  const cx = size / 2;
  const cy = size / 2;
  const rotation = (time * 0.000055 + state.rotationSeed) % (Math.PI * 2);
  const image = state.ctx.createImageData(size, size);
  const data = image.data;
  const light = {
    x: -0.47,
    y: -0.38,
    z: 0.79
  };

  let opaque = 0;
  let water = 0;
  let solid = 0;
  let turquoise = 0;
  let gold = 0;

  for (let py = 0; py < size; py += 1) {
    const ny = (py + 0.5 - cy) / radius;

    for (let px = 0; px < size; px += 1) {
      const nx = (px + 0.5 - cx) / radius;
      const r2 = nx * nx + ny * ny;
      const index = (py * size + px) * 4;

      if (r2 > 1) {
        data[index] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 0;
        continue;
      }

      const z = Math.sqrt(Math.max(0, 1 - r2));
      const rotated = vectorToLatLon(nx, -ny, z, rotation);
      const u = wrap01(rotated.lon / (Math.PI * 2) + 0.5);
      const v = clamp01(0.5 - rotated.lat / Math.PI);

      const lat = rotated.lat;
      const lon = rotated.lon;
      const normal = latLonToVector(lat, lon);
      const surface = sampleRuntime(state.runtimePack.runtime, lat, lon, u, v);

      let color = sampleTexture(state.texture, u, v);

      const runtimeColor = surfaceToColor(surface, normal, {
        light: 0.86,
        rim: 0,
        edge: 0,
        highlight: 0
      });

      color = mixColor(color, runtimeColor, 0.46);

      const lightDot = clamp(normal.x * light.x + normal.y * light.y + normal.z * light.z, -1, 1);
      const directional = clamp01(0.34 + lightDot * 0.66);
      const edge = smoothstep(0.58, 1.0, Math.sqrt(r2));
      const rim = smoothstep(0.72, 1.0, Math.sqrt(r2));
      const highlight = smoothstep(0.82, 0.995, 1 - Math.sqrt((nx + 0.34) * (nx + 0.34) + (ny + 0.36) * (ny + 0.36)));
      const shadow = smoothstep(0.16, 0.98, nx * 0.46 + ny * 0.18 + 0.35);

      let shade = 0.48 + directional * 0.62;
      shade -= edge * 0.22;
      shade -= shadow * 0.16;
      shade += highlight * 0.12;

      color = multiplyColor(color, clamp(shade, 0.34, 1.18));

      const atmosphericEdge = rim * 0.30;
      color = mixColor(color, PALETTE.rim, atmosphericEdge);

      if (surface.water) {
        water += 1;
        const waterSpark = fbm3(normal.x * 42 + 2, normal.y * 42 - 7, normal.z * 42 + time * 0.00004, 3);
        color = lighten(color, waterSpark * 0.026);
        if (surface.turquoise > 0.33) turquoise += 1;
      }

      if (surface.land || surface.solidSurfaceLand || surface.ice) {
        solid += 1;
      }

      if (surface.mineral > 0.58 && (surface.land || surface.solidSurfaceLand)) {
        const mineralSignal = clamp01((surface.mineral - 0.58) * 1.8);
        color = mixColor(color, PALETTE.mineralGold, mineralSignal * 0.13);
        if (mineralSignal > 0.15) gold += 1;
      }

      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = 255;
      opaque += 1;
    }
  }

  state.pixelStats = {
    opaque,
    total: size * size,
    opaqueRatio: opaque / (size * size),
    water,
    solid,
    turquoise,
    gold,
    waterRatio: water / Math.max(1, opaque),
    solidRatio: solid / Math.max(1, opaque),
    turquoiseRatio: turquoise / Math.max(1, opaque),
    goldRatio: gold / Math.max(1, opaque)
  };

  return image;
}

function drawAtmosphere(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.352;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + size * 0.004, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(121, 203, 247, 0.36)";
  ctx.lineWidth = Math.max(2, size * 0.008);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + size * 0.015, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(97, 178, 230, 0.10)";
  ctx.lineWidth = Math.max(4, size * 0.018);
  ctx.stroke();

  const glass = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.36,
    radius * 0.04,
    cx,
    cy,
    radius * 1.14
  );

  glass.addColorStop(0, "rgba(255, 255, 255, 0.105)");
  glass.addColorStop(0.28, "rgba(255, 255, 255, 0.030)");
  glass.addColorStop(0.58, "rgba(255, 255, 255, 0.000)");
  glass.addColorStop(0.83, "rgba(0, 0, 0, 0.12)");
  glass.addColorStop(1, "rgba(0, 0, 0, 0.46)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = glass;
  ctx.fill();

  const polarSoftening = ctx.createLinearGradient(0, cy - radius, 0, cy - radius * 0.70);
  polarSoftening.addColorStop(0, "rgba(238, 248, 255, 0.16)");
  polarSoftening.addColorStop(1, "rgba(238, 248, 255, 0)");
  ctx.fillStyle = polarSoftening;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 0.40);

  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.13 + Math.sin(time * 0.001) * 0.018;
  ctx.strokeStyle = "rgba(190, 232, 255, 0.42)";
  ctx.lineWidth = 0.9;

  ctx.beginPath();
  for (let band = 0; band < 8; band += 1) {
    const y = cy - radius * 0.58 + band * radius * 0.16;
    const half = Math.sqrt(Math.max(0, radius * radius - (y - cy) * (y - cy)));
    ctx.moveTo(cx - half, y);
    ctx.lineTo(cx + half, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawLabels(ctx, size) {
  ctx.save();

  ctx.fillStyle = "rgba(244, 226, 178, 0.92)";
  ctx.font = "800 " + Math.max(13, size * 0.027) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AUDRALIA", size / 2, size * 0.846);

  ctx.fillStyle = "rgba(188, 208, 226, 0.72)";
  ctx.font = "650 " + Math.max(10, size * 0.015) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("RUNTIME-BACKED ORTHOGRAPHIC · REALISM V9", size / 2, size * 0.884);

  ctx.restore();
}

function samplePixelProof(ctx, size, pixelStats) {
  try {
    const center = ctx.getImageData(Math.floor(size / 2), Math.floor(size / 2), 1, 1).data;

    return {
      r: center[0],
      g: center[1],
      b: center[2],
      a: center[3],
      notBlank: center[3] > 0 && center[0] + center[1] + center[2] > 12,
      pixelStats: pixelStats || null
    };
  } catch (error) {
    return {
      notBlank: null,
      error: String(error?.message || error || "pixel proof unavailable"),
      pixelStats: pixelStats || null
    };
  }
}

function publishStatus(state, extra = {}) {
  const status = {
    loaded: true,
    ok: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    routeExpected: ROUTE_EXPECTED,
    runtimeExpected: RUNTIME_EXPECTED,
    version: VERSION,
    canonicalExport: "mountAudraliaCanvas",
    renderMode: PLANET.renderMode,
    runtimeBacked: Boolean(state.runtimePack && state.runtimePack.ok),
    runtimeReceipt: state.runtimePack?.receipt || "",
    runtimeImportError: state.runtimePack?.error || "",
    failOpen: Boolean(state.runtimePack && !state.runtimePack.ok),
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount),
    animated: !state.reducedMotion,
    frameCount: state.frameCount,
    textureStats: state.texture?.stats || null,
    pixelProof: state.pixelProof || null,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    ...extra
  };

  if (typeof window !== "undefined") {
    window.__AUDRALIA_CANVAS_STATUS__ = status;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = status;
    window.AUDRALIA_CANVAS_AUTHORITY_RECEIPT = RECEIPT;
    window.AUDRALIA_CANVAS_AUTHORITY_CONTRACT = CONTRACT;

    try {
      window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: status }));
    } catch (_) {}
  }

  if (state.canvas) {
    state.canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    state.canvas.dataset.audraliaCanvasContract = CONTRACT;
    state.canvas.dataset.audraliaRuntimeContract = RUNTIME_EXPECTED;
    state.canvas.dataset.audraliaRuntimeBacked = String(Boolean(status.runtimeBacked));
    state.canvas.dataset.audraliaFailOpen = String(Boolean(status.failOpen));
    state.canvas.dataset.graphicBox = "false";
    state.canvas.dataset.imageGeneration = "false";
    state.canvas.dataset.visualPassClaimed = "false";
  }

  return status;
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;

  drawStarField(ctx, size, time);
  drawOrbitalRings(ctx, size, time);

  const image = renderPlanetImageData(state, time);
  ctx.putImageData(image, 0, 0);

  drawAtmosphere(ctx, size, time);
  drawLabels(ctx, size);

  state.frameCount += 1;

  if (state.frameCount === 2 || state.frameCount % 120 === 0) {
    state.pixelProof = samplePixelProof(ctx, size, state.pixelStats);
    publishStatus(state);
  }
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") {
    activeController.stop();
  }

  activeController = null;
}

async function startCanvas(target, options = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();

  const mount = resolveMount(target);
  const nodes = createCanvasNodes(mount);
  const setup = setupCanvas(nodes.canvas, nodes.frame);

  const reducedMotion =
    Boolean(options.reducedMotion) ||
    Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    proof: nodes.proof,
    statusCard: nodes.statusCard,
    ctx: setup.ctx,
    size: setup.size,
    ratio: setup.ratio,
    mount,
    options,
    frameCount: 0,
    pixelProof: null,
    pixelStats: null,
    stopped: false,
    rafId: null,
    resizeTimer: null,
    lastFrameTime: 0,
    rotationSeed: Number(options.rotationSeed) || 0.18,
    runtimePack: {
      ok: false,
      runtime: null,
      module: null,
      error: "runtime pending",
      receipt: "RUNTIME_PENDING"
    },
    texture: buildTexture({ ok: false, runtime: null }, 384, 192),
    reducedMotion
  };

  activeController = state;

  setRouteStatus("Audralia adopted canvas authority loaded.", true);
  publishStatus(state, { bootPhase: "fail-open-first-paint" });

  renderFrame(state, performance.now());

  importRuntime().then((runtimePack) => {
    if (state.stopped) return;

    state.runtimePack = runtimePack;
    state.texture = buildTexture(runtimePack, 384, 192);
    state.pixelProof = null;

    renderFrame(state, performance.now());
    publishStatus(state, { bootPhase: runtimePack.ok ? "runtime-backed" : "fail-open-runtime-unavailable" });
  });

  function animate(frameTime) {
    if (state.stopped) return;

    if (frameTime - state.lastFrameTime >= FRAME_INTERVAL) {
      state.lastFrameTime = frameTime;
      renderFrame(state, frameTime || performance.now());
    }

    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      if (state.stopped) return;

      const next = setupCanvas(state.canvas, state.frame);
      state.ctx = next.ctx;
      state.size = next.size;
      state.ratio = next.ratio;
      state.pixelProof = null;

      renderFrame(state, performance.now());
      publishStatus(state, { bootPhase: "resized" });
    }, 160);
  }

  state.stop = function stop() {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    window.clearTimeout(state.resizeTimer);
    window.removeEventListener("resize", resize);
    window.removeEventListener("orientationchange", resize);
  };

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("orientationchange", resize, { passive: true });

  if (!reducedMotion) {
    state.rafId = window.requestAnimationFrame(animate);
  } else {
    publishStatus(state, { reducedMotion: true });
  }

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
    ok: false,
    receipt: RECEIPT,
    contract: CONTRACT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    routeExpected: ROUTE_EXPECTED,
    runtimeExpected: RUNTIME_EXPECTED,
    version: VERSION,
    canonicalExport: "mountAudraliaCanvas",
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

export function getAudraliaSurfaceDataset() {
  return PLANET;
}

export function getAudraliaCanvasDataset() {
  return PLANET;
}

export function stopAudraliaCanvas() {
  stopActiveController();

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    version: VERSION,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

const api = Object.freeze({
  RECEIPT,
  CONTRACT,
  COMPATIBILITY_CONTRACT,
  ROUTE_EXPECTED,
  RUNTIME_EXPECTED,
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
  getAudraliaCanvasDataset,
  stopAudraliaCanvas
});

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
  window.AUDRALIA_CANVAS_AUTHORITY_RECEIPT = RECEIPT;
  window.AUDRALIA_CANVAS_AUTHORITY_CONTRACT = CONTRACT;
}

export default api;
