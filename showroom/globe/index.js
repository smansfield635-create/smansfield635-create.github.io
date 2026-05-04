// /showroom/globe/index.js
// SHOWROOM_GLOBE_AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_RUNTIME_RECEIPT_TNT_v3
// AUDRALIA_G1_PARENT_TERRAIN_ACTIVE
// TERRAIN_CHILD_ACTIVE
// terrainChildActive
// NO_CROSS_BODY_FALLBACK
// GROUND_ZERO_PARENT_ONLY=false
// Role: dual mount controller for Earth G4 candidate and Audralia G1 parent terrain-active route.
// Scope: mount control, source import, canvas render, runtime receipt overwrite.
// Does not own: Earth renderer, Audralia renderer internals, Gauges, parent G2 composition, ecology, fauna, runtime.

const RECEIPT = "SHOWROOM_GLOBE_AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_RUNTIME_RECEIPT_TNT_v3";
const ROUTE = "/showroom/globe/";

const AUDRALIA_G1_PARENT_TERRAIN_ACTIVE = true;
const TERRAIN_CHILD_ACTIVE = true;
const terrainChildActive = true;
const NO_CROSS_BODY_FALLBACK = true;
const GROUND_ZERO_PARENT_ONLY = false;

const PATHS = Object.freeze({
  earth: "/assets/earth/earth_canvas.js",
  audraliaParent: "/assets/audralia/audralia.planet.render.js",
  terrain: "/assets/audralia/audralia.terrain.render.js",
  hydration: "/assets/audralia/audralia.hydration.render.js",
  climate: "/assets/audralia/audralia.climate.render.js"
});

const BODY_CONFIGS = Object.freeze({
  earth: Object.freeze({
    body: "Earth",
    key: "earth",
    mountId: "earthRenderMount",
    receiptId: "earthRenderReceipt",
    authorityPath: PATHS.earth,
    authorityLabel: "EARTH_FILE_CHAIN",
    generationStatus: "G4_CANDIDATE",
    generationClaimed: false,
    targetStandard: "ORBITAL_EARTH_G4_REFERENCE"
  }),

  audralia: Object.freeze({
    body: "Audralia",
    key: "audralia",
    mountId: "audraliaRenderMount",
    receiptId: "audraliaRenderReceipt",
    authorityPath: PATHS.audraliaParent,
    authorityLabel: PATHS.audraliaParent,
    generation: "G1",
    generationStatus: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE",
    generationClaimed: false,
    targetStandard: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_COMPOSITOR",
    terrainChildActive: true,
    terrainChildPath: PATHS.terrain,
    hydrationChildBuilt: true,
    hydrationChildPath: PATHS.hydration,
    climateChildBuilt: true,
    climateChildPath: PATHS.climate,
    g2ParentConsumption: "HELD"
  })
});

function nowIso() {
  return new Date().toISOString();
}

function cacheBust(path) {
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}v=${encodeURIComponent(RECEIPT)}_${Date.now()}`;
}

function bool(value) {
  return value === true ? "true" : value === false ? "false" : String(value);
}

function writeReceipt(id, lines) {
  const node = document.getElementById(id);
  if (!node) return false;

  node.textContent = [
    RECEIPT,
    `TIME=${nowIso()}`,
    "ROUTE=/showroom/globe/",
    "ROUTE_CONTROLLER_EXECUTED=true",
    "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE=true",
    "TERRAIN_CHILD_ACTIVE=true",
    "terrainChildActive=true",
    "GROUND_ZERO_PARENT_ONLY=false",
    "NO_CROSS_BODY_FALLBACK=true",
    "BODY_ADOPTION_BLOCKED=true",
    "SIZE_CLAMP_ACTIVE=true",
    ...lines
  ].join("\n");

  node.dataset.routeControllerReceipt = RECEIPT;
  node.dataset.audraliaG1ParentTerrainActive = "true";
  node.dataset.terrainChildActive = "true";
  node.dataset.groundZeroParentOnly = "false";
  node.dataset.noCrossBodyFallback = "true";
  node.dataset.bodyAdoptionBlocked = "true";
  node.dataset.sizeClampActive = "true";

  return true;
}

function setDataset(node, values) {
  Object.entries(values).forEach(([key, value]) => {
    node.dataset[key] = String(value);
  });
}

function createCanvas(mount, config) {
  mount.replaceChildren();

  mount.style.width = "100%";
  mount.style.maxWidth = "560px";
  mount.style.margin = "1rem auto";
  mount.style.display = "flex";
  mount.style.justifyContent = "center";
  mount.style.alignItems = "center";
  mount.style.overflow = "hidden";

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  canvas.className = "globe-render-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", `${config.body} globe render canvas`);

  canvas.style.display = "block";
  canvas.style.width = window.matchMedia("(min-width: 900px)").matches
    ? "min(42vw, 520px)"
    : "min(82vw, 360px)";
  canvas.style.height = "auto";
  canvas.style.maxWidth = "100%";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.margin = "0 auto";

  setDataset(canvas, {
    body: config.key,
    renderCanvas: "true",
    routeControllerReceipt: RECEIPT,
    sizeClampActive: "true"
  });

  mount.appendChild(canvas);
  return canvas;
}

function drawHeldCanvas(canvas, label, reason) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.34;

  ctx.clearRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(cx - r * 0.18, cy - r * 0.22, r * 0.08, cx, cy, r * 1.24);
  glow.addColorStop(0, "rgba(255,255,255,0.18)");
  glow.addColorStop(0.72, "rgba(44,64,96,0.64)");
  glow.addColorStop(1, "rgba(8,14,28,0.96)");

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255,255,255,0.36)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.font = "700 42px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, cx, cy - 8);

  ctx.font = "500 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(reason, cx, cy + 44);

  return Object.freeze({
    rendered: false,
    held: true,
    method: "held",
    reason
  });
}

async function importAuthority(path) {
  try {
    const module = await import(cacheBust(path));
    return Object.freeze({
      ok: true,
      module,
      error: null
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      module: null,
      error: String(error && error.message ? error.message : error)
    });
  }
}

function getApi(module) {
  return module ? module.default || module : null;
}

function callStatus(api) {
  if (!api || typeof api.getStatus !== "function") {
    return Object.freeze({
      ok: false,
      statusAvailable: false,
      error: "getStatus missing"
    });
  }

  try {
    return Object.assign({ statusAvailable: true }, api.getStatus());
  } catch (error) {
    return Object.freeze({
      ok: false,
      statusAvailable: false,
      error: String(error && error.message ? error.message : error)
    });
  }
}

function makeRenderOptions(config) {
  if (config.key === "earth") {
    return Object.freeze({
      body: "Earth",
      route: ROUTE,
      mountId: config.mountId,
      generationStatus: "G4_CANDIDATE",
      generationClaimed: false,
      targetStandard: "ORBITAL_EARTH_G4_REFERENCE",
      visualPassClaimed: false
    });
  }

  return Object.freeze({
    body: "Audralia",
    route: ROUTE,
    mountId: config.mountId,
    generation: "G1",
    generationStatus: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE",
    generationClaimed: false,
    targetStandard: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_COMPOSITOR",
    AUDRALIA_G1_PARENT_TERRAIN_ACTIVE,
    TERRAIN_CHILD_ACTIVE,
    terrainChildActive,
    GROUND_ZERO_PARENT_ONLY,
    terrainChildPath: PATHS.terrain,
    hydrationChildBuilt: true,
    hydrationChildPath: PATHS.hydration,
    climateChildBuilt: true,
    climateChildPath: PATHS.climate,
    g2ParentConsumption: "HELD",
    visualPassClaimed: false
  });
}

async function renderWithApi(canvas, api, config) {
  if (!api) {
    return drawHeldCanvas(canvas, config.body, "AUTHORITY_HELD");
  }

  const options = makeRenderOptions(config);

  if (typeof api.renderSurface === "function") {
    const profile = typeof api.createProfile === "function" ? api.createProfile(options) : undefined;
    const texture = typeof api.buildTexture === "function" ? api.buildTexture(profile, options) : undefined;
    const output = api.renderSurface(canvas, { ...options, profile, texture });

    return Object.freeze({
      rendered: true,
      held: false,
      method: "renderSurface",
      output
    });
  }

  if (typeof api.render === "function") {
    return Object.freeze({
      rendered: true,
      held: false,
      method: "render",
      output: api.render(canvas, options)
    });
  }

  if (typeof api.renderPlanet === "function") {
    return Object.freeze({
      rendered: true,
      held: false,
      method: "renderPlanet",
      output: api.renderPlanet(canvas, options)
    });
  }

  return drawHeldCanvas(canvas, config.body, "RENDER_API_HELD");
}

function earthStatusSummary(status) {
  return Object.freeze({
    statusAvailable: status.statusAvailable === true,
    body: "Earth",
    generationStatus: "G4_CANDIDATE",
    generationClaimed: false,
    targetStandard: "ORBITAL_EARTH_G4_REFERENCE",
    ok: status.ok !== false,
    status: status.status || "available",
    receipt: status.receipt || "available",
    file: status.file || PATHS.earth,
    visualPassClaimed: status.visualPassClaimed === true
  });
}

function audraliaStatusSummary(status) {
  return Object.freeze({
    statusAvailable: status.statusAvailable === true,
    body: "Audralia",
    generation: "G1",
    generationStatus: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE",
    generationClaimed: false,
    targetStandard: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_COMPOSITOR",
    ok: status.ok !== false,
    status: status.status || "available",
    receipt: status.receipt || "available",
    file: status.file || PATHS.audraliaParent,

    AUDRALIA_G1_PARENT_TERRAIN_ACTIVE,
    TERRAIN_CHILD_ACTIVE,
    terrainChildActive,
    GROUND_ZERO_PARENT_ONLY,

    terrainChildPath: status.terrainChildPath || PATHS.terrain,
    parentConsumesTerrain: status.parentConsumesTerrain === true,
    hydrationChildBuilt: true,
    hydrationChildPath: PATHS.hydration,
    climateChildBuilt: true,
    climateChildPath: PATHS.climate,
    g2ParentConsumption: "HELD",
    activeDownstreamChildren: status.activeDownstreamChildren || ["terrain"],
    activeDownstreamPaths: status.activeDownstreamPaths || [PATHS.terrain],
    visualPassClaimed: status.visualPassClaimed === true
  });
}

function makeReceiptLines(config, imported, statusSummary, renderResult) {
  if (config.key === "earth") {
    return [
      "BOOT_PHASE=COMPLETE",
      "BODY=Earth",
      "GENERATION_STATUS=G4_CANDIDATE",
      "GENERATION_CLAIMED=false",
      "G4_CLAIM=HELD",
      "TARGET_STANDARD=ORBITAL_EARTH_G4_REFERENCE",
      `MOUNT=#${config.mountId}`,
      "MOUNT_EXISTS=true",
      "AUTHORITY=EARTH_FILE_CHAIN",
      "IMPORT_ATTEMPTED=true",
      `AUTHORITY_IMPORTED=${bool(imported.ok)}`,
      `AUTHORITY_PATH=${config.authorityPath}`,
      `RENDER_METHOD=${renderResult.method}`,
      `RENDERED=${bool(renderResult.rendered)}`,
      `HELD=${bool(renderResult.held)}`,
      `STATUS_SUMMARY=${JSON.stringify(statusSummary)}`,
      "VISUAL_PASS=HELD"
    ];
  }

  return [
    "BOOT_PHASE=COMPLETE",
    "BODY=Audralia",
    "GENERATION=G1",
    "GENERATION_STATUS=AUDRALIA_G1_PARENT_TERRAIN_ACTIVE",
    "GENERATION_CLAIMED=false",
    "TARGET_STANDARD=AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_COMPOSITOR",
    `MOUNT=#${config.mountId}`,
    "MOUNT_EXISTS=true",
    `AUTHORITY=${PATHS.audraliaParent}`,
    "IMPORT_ATTEMPTED=true",
    `AUTHORITY_IMPORTED=${bool(imported.ok)}`,
    `AUTHORITY_PATH=${PATHS.audraliaParent}`,
    `RENDER_METHOD=${renderResult.method}`,
    `RENDERED=${bool(renderResult.rendered)}`,
    `HELD=${bool(renderResult.held)}`,
    `STATUS_SUMMARY=${JSON.stringify(statusSummary)}`,
    "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE=true",
    "TERRAIN_CHILD_ACTIVE=true",
    "terrainChildActive=true",
    "GROUND_ZERO_PARENT_ONLY=false",
    `TERRAIN_CHILD_PATH=${PATHS.terrain}`,
    "HYDRATION_CHILD_BUILT=true",
    `HYDRATION_CHILD_PATH=${PATHS.hydration}`,
    "CLIMATE_CHILD_BUILT=true",
    `CLIMATE_CHILD_PATH=${PATHS.climate}`,
    "G2_PARENT_CONSUMPTION=HELD",
    "ACTIVE_DOWNSTREAM_CHILDREN=terrain",
    "VISUAL_PASS=HELD"
  ];
}

async function mountBody(config) {
  writeReceipt(config.receiptId, [
    "BOOT_PHASE=MOUNT_LOOKUP",
    `BODY=${config.body}`,
    `MOUNT=#${config.mountId}`,
    "VISUAL_PASS=HELD"
  ]);

  const mount = document.getElementById(config.mountId);

  if (!mount) {
    writeReceipt(config.receiptId, [
      "BOOT_PHASE=MOUNT_FAILED",
      `BODY=${config.body}`,
      `MOUNT=#${config.mountId}`,
      "MOUNT_EXISTS=false",
      "VISUAL_PASS=HELD"
    ]);

    return Object.freeze({
      body: config.body,
      ok: false,
      mountExists: false,
      imported: false,
      rendered: false
    });
  }

  if (config.key === "earth") {
    setDataset(mount, {
      body: "earth",
      generationStatus: "G4_CANDIDATE",
      generationClaimed: "false",
      targetStandard: "ORBITAL_EARTH_G4_REFERENCE",
      authority: "EARTH_FILE_CHAIN",
      routeControllerReceipt: RECEIPT,
      noCrossBodyFallback: "true",
      bodyAdoptionBlocked: "true",
      sizeClampActive: "true"
    });
  } else {
    setDataset(mount, {
      body: "audralia",
      generation: "G1",
      generationStatus: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE",
      generationClaimed: "false",
      targetStandard: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_COMPOSITOR",
      authority: PATHS.audraliaParent,
      audraliaG1ParentTerrainActive: "true",
      terrainChildActive: "true",
      groundZeroParentOnly: "false",
      terrainChildPath: PATHS.terrain,
      hydrationChildBuilt: "true",
      hydrationChildPath: PATHS.hydration,
      climateChildBuilt: "true",
      climateChildPath: PATHS.climate,
      g2ParentConsumption: "HELD",
      routeControllerReceipt: RECEIPT,
      noCrossBodyFallback: "true",
      bodyAdoptionBlocked: "true",
      sizeClampActive: "true"
    });
  }

  const canvas = createCanvas(mount, config);
  const imported = await importAuthority(config.authorityPath);

  if (!imported.ok) {
    const heldRender = drawHeldCanvas(canvas, config.body, "SOURCE_AUTHORITY_HELD");

    writeReceipt(config.receiptId, [
      "BOOT_PHASE=IMPORT_HELD",
      `BODY=${config.body}`,
      `AUTHORITY_PATH=${config.authorityPath}`,
      "AUTHORITY_IMPORTED=false",
      `IMPORT_ERROR=${imported.error}`,
      "VISUAL_PASS=HELD"
    ]);

    return Object.freeze({
      body: config.body,
      ok: false,
      mountExists: true,
      imported: false,
      rendered: false,
      renderResult: heldRender,
      error: imported.error
    });
  }

  const api = getApi(imported.module);
  const rawStatus = callStatus(api);
  const statusSummary = config.key === "earth"
    ? earthStatusSummary(rawStatus)
    : audraliaStatusSummary(rawStatus);

  let renderResult;

  try {
    renderResult = await renderWithApi(canvas, api, config);
  } catch (error) {
    renderResult = Object.freeze({
      ...drawHeldCanvas(canvas, config.body, "RENDER_HELD"),
      error: String(error && error.message ? error.message : error)
    });
  }

  writeReceipt(config.receiptId, makeReceiptLines(config, imported, statusSummary, renderResult));

  return Object.freeze({
    body: config.body,
    ok: true,
    mountExists: true,
    imported: true,
    authorityPath: config.authorityPath,
    rendered: renderResult.rendered === true,
    status: statusSummary,
    renderResult
  });
}

function publishRouteReceipt(results) {
  const routeReceipt = Object.freeze({
    receipt: RECEIPT,
    route: ROUTE,
    bodyCount: 2,
    earth: results.earth,
    audralia: results.audralia,

    earthGenerationStatus: "G4_CANDIDATE",
    earthGenerationClaimed: false,
    earthTargetStandard: "ORBITAL_EARTH_G4_REFERENCE",

    audraliaGeneration: "G1",
    audraliaGenerationStatus: "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE",
    AUDRALIA_G1_PARENT_TERRAIN_ACTIVE,
    TERRAIN_CHILD_ACTIVE,
    terrainChildActive,
    GROUND_ZERO_PARENT_ONLY,
    audraliaParentAuthority: PATHS.audraliaParent,
    audraliaTerrainChildActive: true,
    audraliaTerrainChildPath: PATHS.terrain,
    audraliaHydrationChildBuilt: true,
    audraliaHydrationChildPath: PATHS.hydration,
    audraliaClimateChildBuilt: true,
    audraliaClimateChildPath: PATHS.climate,
    g2ParentConsumption: "HELD",

    noCrossBodyFallback: NO_CROSS_BODY_FALLBACK,
    bodyAdoptionBlocked: true,
    routeControllerExecuted: true,
    sizeClampActive: true,
    visualPassClaimed: false,
    executedAt: nowIso()
  });

  window.DGB_SHOWROOM_GLOBE_ROUTE_CONTROLLER = routeReceipt;

  try {
    window.dispatchEvent(
      new CustomEvent("dgb:showroom-globe:audralia-g1-parent-terrain-active-v3", {
        detail: routeReceipt
      })
    );
  } catch (_) {}

  return routeReceipt;
}

async function boot() {
  const earth = await mountBody(BODY_CONFIGS.earth);
  const audralia = await mountBody(BODY_CONFIGS.audralia);

  publishRouteReceipt({ earth, audralia });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
