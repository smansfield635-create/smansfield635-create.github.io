// /showroom/globe/index.js
// EARTH_G4_AUDRALIA_G1_DUAL_MOUNT_ROUTE_CONTROLLER_EXECUTION_RECEIPTS_TNT_v2
// Role: route controller only.
// Owns: mount selection, body separation, non-silent receipts, isolated import attempts.
// Does not own: Earth science, Audralia science, Sun, Moon, Gauges, Products, final visual pass.

const RECEIPT = "EARTH_G4_AUDRALIA_G1_DUAL_MOUNT_ROUTE_CONTROLLER_EXECUTION_RECEIPTS_TNT_v2";
const ROUTE = "/showroom/globe/";

const EARTH = Object.freeze({
  body: "Earth",
  generation: "G4",
  mountId: "earthRenderMount",
  receiptId: "earthRenderReceipt",
  authority: "EARTH_FILE_CHAIN",
  moduleCandidates: Object.freeze([
    "/assets/earth/earth.g4.render.js",
    "/assets/earth/earth.render.js",
    "/assets/earth/earth_canvas.js"
  ])
});

const AUDRALIA = Object.freeze({
  body: "Audralia",
  generation: "G1",
  mountId: "audraliaRenderMount",
  receiptId: "audraliaRenderReceipt",
  authority: "/assets/AdreliaPlanetRendered.js",
  moduleCandidates: Object.freeze([
    "/assets/AdreliaPlanetRendered.js"
  ])
});

function nowIso() {
  return new Date().toISOString();
}

function sanitizeText(value) {
  const bad = ["Aus", "tralia"].join("");
  const planetBad = ["Planet ", bad].join("");
  const compactBad = ["Planet", bad].join("");

  return String(value)
    .replaceAll(planetBad, "Audralia")
    .replaceAll(compactBad, "Audralia")
    .replaceAll(bad, "Audralia")
    .replaceAll(bad.toUpperCase(), "AUDRALIA")
    .replaceAll(bad.toLowerCase(), "audralia");
}

function writeReceipt(id, lines) {
  const node = document.getElementById(id);
  if (!node) return false;

  node.textContent = [
    RECEIPT,
    `TIME=${nowIso()}`,
    ...lines.map(sanitizeText)
  ].join("\n");

  node.dataset.routeControllerReceipt = RECEIPT;
  node.dataset.routeControllerExecuted = "true";

  return true;
}

function writeBothBootReceipts() {
  writeReceipt(EARTH.receiptId, [
    "BOOT_STARTED=true",
    "BODY=Earth",
    "GENERATION=G4",
    `MOUNT=#${EARTH.mountId}`,
    "ROUTE_CONTROLLER_EXECUTED=true",
    "IMPORT_ATTEMPTED=false",
    "BODY_ADOPTION_BLOCKED=true",
    "VISUAL_PASS=HELD"
  ]);

  writeReceipt(AUDRALIA.receiptId, [
    "BOOT_STARTED=true",
    "BODY=Audralia",
    "GENERATION=G1",
    `MOUNT=#${AUDRALIA.mountId}`,
    "ROUTE_CONTROLLER_EXECUTED=true",
    "IMPORT_ATTEMPTED=false",
    "BODY_ADOPTION_BLOCKED=true",
    "VISUAL_PASS=HELD"
  ]);
}

function assertRouteIdentity() {
  const pageText = document.documentElement.textContent || "";
  const bad = ["Aus", "tralia"].join("");

  const forbidden = [
    `Planet ${bad}`,
    `${bad} G1`,
    `${bad} terrain`,
    `${bad} globe`,
    `planet-${bad.toLowerCase()}`,
    `Planet${bad}`
  ];

  const drift = forbidden.find((token) => pageText.includes(token));

  if (drift) {
    writeReceipt(EARTH.receiptId, [
      "BOOT_BLOCKED=true",
      "NAMING_DRIFT_DETECTED=true",
      "ROUTE_CONTROLLER_EXECUTED=true",
      "VISUAL_PASS=HELD"
    ]);

    writeReceipt(AUDRALIA.receiptId, [
      "BOOT_BLOCKED=true",
      "NAMING_DRIFT_DETECTED=true",
      "ROUTE_CONTROLLER_EXECUTED=true",
      "VISUAL_PASS=HELD"
    ]);

    throw new Error("NAMING_DRIFT_DETECTED");
  }

  return true;
}

function createCanvas(mount, label) {
  mount.replaceChildren();

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  canvas.className = "globe-render-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", `${label} globe render canvas`);
  canvas.dataset.body = label.toLowerCase();
  canvas.dataset.renderCanvas = "true";
  canvas.dataset.routeControllerReceipt = RECEIPT;

  mount.appendChild(canvas);
  return canvas;
}

function drawHeldCanvas(canvas, label, reason) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.36;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(cx - r * 0.18, cy - r * 0.22, r * 0.08, cx, cy, r * 1.24);
  bg.addColorStop(0, "rgba(255,255,255,0.18)");
  bg.addColorStop(0.7, "rgba(42,52,76,0.62)");
  bg.addColorStop(1, "rgba(10,16,28,0.94)");

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255,255,255,0.34)";
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
    reason
  });
}

async function importFirstAvailable(candidates) {
  const failures = [];

  for (const candidate of candidates) {
    try {
      const module = await import(`${candidate}?v=${encodeURIComponent(RECEIPT)}-${Date.now()}`);
      return Object.freeze({
        ok: true,
        path: candidate,
        module
      });
    } catch (error) {
      failures.push({
        path: candidate,
        error: String(error && error.message ? error.message : error)
      });
    }
  }

  return Object.freeze({
    ok: false,
    path: null,
    module: null,
    failures
  });
}

function getApi(module) {
  if (!module) return null;
  return module.default || module;
}

function summarizeStatus(api, bodyConfig) {
  if (!api || typeof api.getStatus !== "function") {
    return Object.freeze({
      statusAvailable: false,
      body: bodyConfig.body,
      generation: bodyConfig.generation
    });
  }

  try {
    const status = api.getStatus() || {};

    return Object.freeze({
      statusAvailable: true,
      body: bodyConfig.body,
      generation: bodyConfig.generation,
      ok: status.ok !== false,
      status: sanitizeText(status.status || "available"),
      receipt: sanitizeText(status.receipt || status.tnt || "available"),
      parentAuthority: sanitizeText(status.parentAuthority || bodyConfig.authority),
      visualPassClaimed: status.visualPassClaimed === true || status.visualPass === "PASS"
    });
  } catch (error) {
    return Object.freeze({
      statusAvailable: false,
      body: bodyConfig.body,
      generation: bodyConfig.generation,
      errored: true,
      error: sanitizeText(error && error.message ? error.message : error)
    });
  }
}

async function renderWithApi(canvas, api, bodyConfig) {
  if (!api) {
    return drawHeldCanvas(canvas, bodyConfig.body, "AUTHORITY_NOT_AVAILABLE");
  }

  if (typeof api.renderSurface === "function") {
    const profile =
      typeof api.createProfile === "function"
        ? api.createProfile({ body: bodyConfig.body, generation: bodyConfig.generation })
        : undefined;

    const texture =
      typeof api.buildTexture === "function"
        ? api.buildTexture(profile)
        : undefined;

    const output = api.renderSurface(canvas, {
      profile,
      texture,
      body: bodyConfig.body,
      generation: bodyConfig.generation,
      route: ROUTE,
      mountId: bodyConfig.mountId
    });

    return Object.freeze({
      rendered: true,
      method: "renderSurface",
      output
    });
  }

  if (typeof api.render === "function") {
    const output = api.render(canvas, {
      body: bodyConfig.body,
      generation: bodyConfig.generation,
      route: ROUTE,
      mountId: bodyConfig.mountId
    });

    return Object.freeze({
      rendered: true,
      method: "render",
      output
    });
  }

  if (typeof api.renderPlanet === "function") {
    const output = api.renderPlanet(canvas, {
      body: bodyConfig.body,
      generation: bodyConfig.generation,
      route: ROUTE,
      mountId: bodyConfig.mountId
    });

    return Object.freeze({
      rendered: true,
      method: "renderPlanet",
      output
    });
  }

  if (typeof api.buildTexture === "function") {
    const texture = api.buildTexture({
      body: bodyConfig.body,
      generation: bodyConfig.generation,
      route: ROUTE,
      mountId: bodyConfig.mountId
    });

    if (texture instanceof HTMLCanvasElement) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(texture, 0, 0, canvas.width, canvas.height);

      return Object.freeze({
        rendered: true,
        method: "buildTextureCanvas",
        output: {
          textureCanvas: true
        }
      });
    }
  }

  return drawHeldCanvas(canvas, bodyConfig.body, "RENDER_API_NOT_READY");
}

async function mountBody(bodyConfig) {
  writeReceipt(bodyConfig.receiptId, [
    "BOOT_PHASE=MOUNT_LOOKUP",
    `BODY=${bodyConfig.body}`,
    `GENERATION=${bodyConfig.generation}`,
    `MOUNT=#${bodyConfig.mountId}`,
    "ROUTE_CONTROLLER_EXECUTED=true",
    "BODY_ADOPTION_BLOCKED=true",
    "VISUAL_PASS=HELD"
  ]);

  const mount = document.getElementById(bodyConfig.mountId);

  if (!mount) {
    writeReceipt(bodyConfig.receiptId, [
      "BOOT_PHASE=MOUNT_FAILED",
      `BODY=${bodyConfig.body}`,
      `GENERATION=${bodyConfig.generation}`,
      `MOUNT=#${bodyConfig.mountId}`,
      "MOUNT_EXISTS=false",
      "IMPORT_ATTEMPTED=false",
      "ROUTE_CONTROLLER_EXECUTED=true",
      "BODY_ADOPTION_BLOCKED=true",
      "VISUAL_PASS=HELD"
    ]);

    return Object.freeze({
      body: bodyConfig.body,
      ok: false,
      mountExists: false,
      imported: false,
      rendered: false
    });
  }

  mount.dataset.body = bodyConfig.body.toLowerCase();
  mount.dataset.generation = bodyConfig.generation;
  mount.dataset.routeControllerReceipt = RECEIPT;
  mount.dataset.authority = bodyConfig.authority;
  mount.dataset.bodyAdoptionBlocked = "true";

  const canvas = createCanvas(mount, bodyConfig.body);

  writeReceipt(bodyConfig.receiptId, [
    "BOOT_PHASE=IMPORT_STARTED",
    `BODY=${bodyConfig.body}`,
    `GENERATION=${bodyConfig.generation}`,
    `MOUNT=#${bodyConfig.mountId}`,
    "MOUNT_EXISTS=true",
    `AUTHORITY=${bodyConfig.authority}`,
    "IMPORT_ATTEMPTED=true",
    "AUTHORITY_IMPORTED=false",
    "ROUTE_CONTROLLER_EXECUTED=true",
    "BODY_ADOPTION_BLOCKED=true",
    "VISUAL_PASS=HELD"
  ]);

  const imported = await importFirstAvailable(bodyConfig.moduleCandidates);

  if (!imported.ok) {
    drawHeldCanvas(canvas, bodyConfig.body, "SOURCE_AUTHORITY_HELD");

    writeReceipt(bodyConfig.receiptId, [
      "BOOT_PHASE=IMPORT_FAILED",
      `BODY=${bodyConfig.body}`,
      `GENERATION=${bodyConfig.generation}`,
      `MOUNT=#${bodyConfig.mountId}`,
      "MOUNT_EXISTS=true",
      `AUTHORITY=${bodyConfig.authority}`,
      "IMPORT_ATTEMPTED=true",
      "AUTHORITY_IMPORTED=false",
      `IMPORT_FAILURE_COUNT=${imported.failures.length}`,
      "ROUTE_CONTROLLER_EXECUTED=true",
      "BODY_ADOPTION_BLOCKED=true",
      "NO_CROSS_BODY_FALLBACK=true",
      "VISUAL_PASS=HELD"
    ]);

    return Object.freeze({
      body: bodyConfig.body,
      ok: false,
      mountExists: true,
      imported: false,
      rendered: false,
      failures: imported.failures
    });
  }

  const api = getApi(imported.module);
  const status = summarizeStatus(api, bodyConfig);

  writeReceipt(bodyConfig.receiptId, [
    "BOOT_PHASE=IMPORT_SUCCEEDED_RENDER_STARTED",
    `BODY=${bodyConfig.body}`,
    `GENERATION=${bodyConfig.generation}`,
    `MOUNT=#${bodyConfig.mountId}`,
    "MOUNT_EXISTS=true",
    `AUTHORITY=${bodyConfig.authority}`,
    "IMPORT_ATTEMPTED=true",
    "AUTHORITY_IMPORTED=true",
    `AUTHORITY_PATH=${imported.path}`,
    `STATUS_SUMMARY=${JSON.stringify(status)}`,
    "ROUTE_CONTROLLER_EXECUTED=true",
    "BODY_ADOPTION_BLOCKED=true",
    "NO_CROSS_BODY_FALLBACK=true",
    "VISUAL_PASS=HELD"
  ]);

  let renderResult;

  try {
    renderResult = await renderWithApi(canvas, api, bodyConfig);
  } catch (error) {
    renderResult = drawHeldCanvas(canvas, bodyConfig.body, "RENDER_ERROR_HELD");
    renderResult = Object.freeze({
      ...renderResult,
      error: sanitizeText(error && error.message ? error.message : error)
    });
  }

  writeReceipt(bodyConfig.receiptId, [
    "BOOT_PHASE=COMPLETE",
    `BODY=${bodyConfig.body}`,
    `GENERATION=${bodyConfig.generation}`,
    `MOUNT=#${bodyConfig.mountId}`,
    "MOUNT_EXISTS=true",
    `AUTHORITY=${bodyConfig.authority}`,
    "IMPORT_ATTEMPTED=true",
    "AUTHORITY_IMPORTED=true",
    `AUTHORITY_PATH=${imported.path}`,
    `RENDER_METHOD=${renderResult.method || "held"}`,
    `RENDERED=${renderResult.rendered === true}`,
    `HELD=${renderResult.held === true}`,
    `STATUS_SUMMARY=${JSON.stringify(status)}`,
    "ROUTE_CONTROLLER_EXECUTED=true",
    "BODY_ADOPTION_BLOCKED=true",
    "NO_CROSS_BODY_FALLBACK=true",
    "VISUAL_PASS=HELD"
  ]);

  return Object.freeze({
    body: bodyConfig.body,
    ok: true,
    mountExists: true,
    imported: true,
    authorityPath: imported.path,
    rendered: renderResult.rendered === true,
    renderResult,
    status
  });
}

function publishRouteReceipt(results) {
  const routeReceipt = Object.freeze({
    receipt: RECEIPT,
    route: ROUTE,
    bodyCount: 2,
    bodies: Object.freeze(["Earth", "Audralia"]),
    earth: results.earth,
    audralia: results.audralia,
    dualMountContract: true,
    bodyAdoptionBlocked: true,
    noCrossBodyFallback: true,
    routeControllerExecuted: true,
    visualPassClaimed: false,
    executedAt: nowIso()
  });

  window.DGB_SHOWROOM_GLOBE_ROUTE_CONTROLLER = routeReceipt;

  try {
    window.dispatchEvent(
      new CustomEvent("dgb:showroom-globe:dual-mount-ready", {
        detail: routeReceipt
      })
    );
  } catch (_) {}

  return routeReceipt;
}

async function boot() {
  writeBothBootReceipts();
  assertRouteIdentity();

  const earth = await mountBody(EARTH);
  const audralia = await mountBody(AUDRALIA);

  publishRouteReceipt({ earth, audralia });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
