// /showroom/globe/index.js
// EARTH_G4_AUDRALIA_G1_DUAL_MOUNT_ROUTE_CONTROLLER_TNT_v1
// Role: route controller only.
// Owns: mount selection, body separation, non-silent receipts.
// Does not own: Earth science, Audralia science, Sun, Moon, Gauges, Products, final visual pass.

const RECEIPT = "EARTH_G4_AUDRALIA_G1_DUAL_MOUNT_ROUTE_CONTROLLER_TNT_v1";
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

function writeReceipt(id, lines) {
  const node = document.getElementById(id);
  if (!node) return;

  node.textContent = [
    RECEIPT,
    `TIME=${nowIso()}`,
    ...lines
  ].join("\n");
}

function assertRouteIdentity() {
  const pageText = document.documentElement.textContent || "";
  const forbidden = [
    "Planet Aus",
    "Aus terrain",
    "Aus globe",
    "Aus G1",
    "planet-aus",
    "PlanetAus"
  ];

  const drift = forbidden.find((token) => pageText.includes(token));

  if (drift) {
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

  const bg = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.3);
  bg.addColorStop(0, "rgba(255,255,255,0.12)");
  bg.addColorStop(1, "rgba(20,28,46,0.82)");

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 38px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, cx, cy - 4);

  ctx.font = "500 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(reason, cx, cy + 42);

  return {
    rendered: false,
    held: true,
    reason
  };
}

async function importFirstAvailable(candidates) {
  const failures = [];

  for (const candidate of candidates) {
    try {
      const module = await import(`${candidate}?v=${encodeURIComponent(RECEIPT)}-${Date.now()}`);
      return {
        ok: true,
        path: candidate,
        module
      };
    } catch (error) {
      failures.push({
        path: candidate,
        error: String(error && error.message ? error.message : error)
      });
    }
  }

  return {
    ok: false,
    path: null,
    module: null,
    failures
  };
}

function getApi(module) {
  if (!module) return null;
  return module.default || module;
}

function callStatus(api) {
  if (!api) return null;

  if (typeof api.getStatus === "function") {
    try {
      return api.getStatus();
    } catch (error) {
      return {
        ok: false,
        error: String(error && error.message ? error.message : error)
      };
    }
  }

  return null;
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
      generation: bodyConfig.generation
    });

    return {
      rendered: true,
      method: "renderSurface",
      output
    };
  }

  if (typeof api.render === "function") {
    const output = api.render(canvas, {
      body: bodyConfig.body,
      generation: bodyConfig.generation
    });

    return {
      rendered: true,
      method: "render",
      output
    };
  }

  if (typeof api.renderPlanet === "function") {
    const output = api.renderPlanet(canvas, {
      body: bodyConfig.body,
      generation: bodyConfig.generation
    });

    return {
      rendered: true,
      method: "renderPlanet",
      output
    };
  }

  if (typeof api.buildTexture === "function") {
    const texture = api.buildTexture({
      body: bodyConfig.body,
      generation: bodyConfig.generation
    });

    if (texture instanceof HTMLCanvasElement) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(texture, 0, 0, canvas.width, canvas.height);

      return {
        rendered: true,
        method: "buildTextureCanvas",
        output: {
          textureCanvas: true
        }
      };
    }
  }

  return drawHeldCanvas(canvas, bodyConfig.body, "RENDER_API_NOT_READY");
}

async function mountBody(bodyConfig) {
  const mount = document.getElementById(bodyConfig.mountId);

  if (!mount) {
    writeReceipt(bodyConfig.receiptId, [
      `BODY=${bodyConfig.body}`,
      `GENERATION=${bodyConfig.generation}`,
      `MOUNT=${bodyConfig.mountId}`,
      "MOUNT_EXISTS=false",
      "ROUTE_CONTROLLER_EXECUTED=true",
      "VISUAL_PASS=HELD"
    ]);

    return {
      body: bodyConfig.body,
      ok: false,
      mountExists: false
    };
  }

  mount.dataset.body = bodyConfig.body.toLowerCase();
  mount.dataset.generation = bodyConfig.generation;
  mount.dataset.routeControllerReceipt = RECEIPT;
  mount.dataset.authority = bodyConfig.authority;

  const canvas = createCanvas(mount, bodyConfig.body);
  const imported = await importFirstAvailable(bodyConfig.moduleCandidates);

  if (!imported.ok) {
    drawHeldCanvas(canvas, bodyConfig.body, "SOURCE_AUTHORITY_HELD");

    writeReceipt(bodyConfig.receiptId, [
      `BODY=${bodyConfig.body}`,
      `GENERATION=${bodyConfig.generation}`,
      `MOUNT=#${bodyConfig.mountId}`,
      "MOUNT_EXISTS=true",
      `AUTHORITY=${bodyConfig.authority}`,
      "AUTHORITY_IMPORTED=false",
      "ROUTE_CONTROLLER_EXECUTED=true",
      "BODY_ADOPTION_BLOCKED=true",
      "VISUAL_PASS=HELD"
    ]);

    return {
      body: bodyConfig.body,
      ok: false,
      mountExists: true,
      imported: false,
      failures: imported.failures
    };
  }

  const api = getApi(imported.module);
  const status = callStatus(api);
  const renderResult = await renderWithApi(canvas, api, bodyConfig);

  writeReceipt(bodyConfig.receiptId, [
    `BODY=${bodyConfig.body}`,
    `GENERATION=${bodyConfig.generation}`,
    `MOUNT=#${bodyConfig.mountId}`,
    "MOUNT_EXISTS=true",
    `AUTHORITY=${bodyConfig.authority}`,
    `AUTHORITY_IMPORTED=true`,
    `AUTHORITY_PATH=${imported.path}`,
    `RENDER_METHOD=${renderResult.method || "held"}`,
    `RENDERED=${renderResult.rendered === true}`,
    `STATUS=${status ? JSON.stringify(status) : "none"}`,
    "ROUTE_CONTROLLER_EXECUTED=true",
    "BODY_ADOPTION_BLOCKED=true",
    "VISUAL_PASS=HELD"
  ]);

  return {
    body: bodyConfig.body,
    ok: true,
    mountExists: true,
    imported: true,
    authorityPath: imported.path,
    renderResult,
    status
  };
}

function publishRouteReceipt(results) {
  window.DGB_SHOWROOM_GLOBE_ROUTE_CONTROLLER = Object.freeze({
    receipt: RECEIPT,
    route: ROUTE,
    bodyCount: 2,
    bodies: Object.freeze(["Earth", "Audralia"]),
    earth: results.earth,
    audralia: results.audralia,
    dualMountContract: true,
    bodyAdoptionBlocked: true,
    visualPassClaimed: false,
    executedAt: nowIso()
  });

  try {
    window.dispatchEvent(
      new CustomEvent("dgb:showroom-globe:dual-mount-ready", {
        detail: window.DGB_SHOWROOM_GLOBE_ROUTE_CONTROLLER
      })
    );
  } catch (_) {}
}

async function boot() {
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
