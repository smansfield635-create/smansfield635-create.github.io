// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_HEX_MODULE_LEDGER_CONDUCTOR_RENEWAL_v1
// Target: /showroom/globe/h-earth/index.js
// Scope: diagnostic conductor + module ledger + synchronized cache proof only.
// No parent Globe edits. No visual expansion. No new art logic.

const CONTRACT = "H_EARTH_HEX_MODULE_LEDGER_CONDUCTOR_RENEWAL_v1";
const GENERATION = "H_EARTH_HEX_MODULE_LEDGER_CONDUCTOR_RENEWAL_v1";
const ROUTE = "/showroom/globe/h-earth/";
const PARENT_BASELINE = "/showroom/globe/";

const MODULES = Object.freeze([
  {
    key: "profile",
    label: "Shared Profile",
    path: "/assets/world/environment/profile.js",
    requiredExports: ["createEnvironmentProfile", "resolveEnvironmentCell"]
  },
  {
    key: "hexfield",
    label: "Hexfield Substrate",
    path: "/assets/world/environment/hexfield.js",
    requiredExports: ["createHexField"]
  },
  {
    key: "climate",
    label: "Climate",
    path: "/assets/world/environment/climate.js",
    requiredExports: ["drawClimateLayer", "drawBirdsAndAir", "drawAtmosphereComposite"]
  },
  {
    key: "water",
    label: "Water / Shimmer Protocol",
    path: "/assets/world/environment/water.js",
    requiredExports: ["drawWaterLayer", "drawFoamAndTideEdge", "SHIMMER_PROTOCOL"]
  },
  {
    key: "terrain",
    label: "Terrain",
    path: "/assets/world/environment/terrain.js",
    requiredExports: ["drawDistantTerrainLayer", "drawShorelineTerrainLayer", "drawGroundTerrainLayer"]
  },
  {
    key: "foliage",
    label: "Foliage",
    path: "/assets/world/environment/foliage.js",
    requiredExports: ["drawFoliageLayer"]
  },
  {
    key: "structure",
    label: "Structure",
    path: "/assets/world/environment/structure.js",
    requiredExports: ["drawStructureLayer"]
  },
  {
    key: "scene",
    label: "Scene Compositor",
    path: "/assets/world/environment/scene.js",
    requiredExports: ["createGroundEnvironmentScene"]
  },
  {
    key: "hEarthProfile",
    label: "H-Earth Profile",
    path: "/assets/h-earth/h-earth.environment.profile.js",
    requiredExports: ["getHEarthWesternGoldenShelfProfile"]
  }
]);

const state = {
  canvas: null,
  ctx: null,
  ledgerRoot: null,
  statusNode: null,
  fallbackRaf: 0,
  startedAt: performance.now(),
  mode: "booting",
  moduleResults: new Map(),
  importedModules: new Map(),
  scene: null,
  receipt: null,
  firstFailure: null
};

function withGeneration(path) {
  return `${path}?v=${encodeURIComponent(GENERATION)}`;
}

function setStatus(text) {
  if (state.statusNode) state.statusNode.textContent = text;
}

function markDocument(extra = {}) {
  const markers = {
    page: "h-earth-hex-module-ledger-conductor",
    route: ROUTE,
    contract: CONTRACT,
    generation: GENERATION,
    parentBaseline: PARENT_BASELINE,
    parentMutation: "false",
    groundLevel: "true",
    reusableEnvironmentEngine: "diagnostic",
    hexSubstrate: state.mode === "enhanced" ? "live" : "not-yet-live",
    shimmerProtocol: state.mode === "enhanced" ? "active" : "pending",
    fallbackDemoted: "true",
    visualExpansion: "false",
    mode: state.mode,
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function createLedgerRoot() {
  const existing = document.querySelector("[data-module-ledger]");
  if (existing) {
    state.ledgerRoot = existing;
    return existing;
  }

  const root = document.createElement("section");
  root.dataset.moduleLedger = "true";
  root.style.marginTop = "14px";
  root.style.padding = "14px";
  root.style.border = "1px solid rgba(244,207,131,.22)";
  root.style.borderRadius = "18px";
  root.style.background = "rgba(255,255,255,.045)";
  root.style.color = "rgba(238,244,255,.86)";
  root.style.font = "800 12px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

  const anchor =
    document.querySelector("[data-render-status]") ||
    document.querySelector(".render-status") ||
    document.querySelector("#ground-world") ||
    document.body;

  if (anchor && anchor.parentNode) {
    anchor.parentNode.insertBefore(root, anchor.nextSibling);
  } else {
    document.body.appendChild(root);
  }

  state.ledgerRoot = root;
  return root;
}

function renderLedger() {
  const root = state.ledgerRoot || createLedgerRoot();

  const rows = MODULES.map((mod) => {
    const result = state.moduleResults.get(mod.key) || {
      status: "pending",
      fetchOk: false,
      rawJavaScript: false,
      importOk: false,
      exportOk: false,
      message: "pending"
    };

    const color =
      result.status === "pass" ? "#a7f3c6" :
      result.status === "fail" ? "#ffb4a8" :
      "#f4cf83";

    return `
      <div style="border-top:1px solid rgba(255,255,255,.10);padding:8px 0;">
        <div style="display:flex;gap:8px;justify-content:space-between;align-items:flex-start;">
          <strong style="color:${color};">${mod.label}</strong>
          <span style="color:${color};text-transform:uppercase;">${escapeHtml(result.status)}</span>
        </div>
        <div style="color:rgba(238,244,255,.62);word-break:break-all;">${escapeHtml(withGeneration(mod.path))}</div>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:6px;">
          <span>URL: ${result.fetchOk ? "PASS" : "—"}</span>
          <span>JS: ${result.rawJavaScript ? "PASS" : "—"}</span>
          <span>Import: ${result.importOk ? "PASS" : "—"}</span>
          <span>Exports: ${result.exportOk ? "PASS" : "—"}</span>
        </div>
        <div style="color:rgba(238,244,255,.56);margin-top:4px;">${escapeHtml(result.message || "")}</div>
      </div>
    `;
  }).join("");

  root.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="color:#f4cf83;font-weight:950;letter-spacing:.06em;text-transform:uppercase;">Hex Module Ledger</div>
        <div style="color:rgba(238,244,255,.58);">Generation: ${escapeHtml(GENERATION)}</div>
      </div>
      <div style="color:${state.mode === "enhanced" ? "#a7f3c6" : "#f4cf83"};text-transform:uppercase;">
        ${escapeHtml(state.mode)}
      </div>
    </div>
    ${rows}
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isLikelyJavaScript(contentType, text) {
  const type = String(contentType || "").toLowerCase();
  const body = String(text || "").trim().toLowerCase();

  if (body.startsWith("<!doctype html") || body.startsWith("<html") || body.includes("<body")) return false;
  if (type.includes("javascript") || type.includes("ecmascript") || type.includes("text/plain")) return true;

  return (
    body.includes("export ") ||
    body.includes("const ") ||
    body.includes("function ") ||
    body.includes("import ")
  );
}

async function proveModule(mod) {
  const url = withGeneration(mod.path);
  const result = {
    key: mod.key,
    label: mod.label,
    path: mod.path,
    url,
    generation: GENERATION,
    status: "pending",
    fetchOk: false,
    rawJavaScript: false,
    importOk: false,
    exportOk: false,
    contentType: "",
    requiredExports: [...mod.requiredExports],
    missingExports: [],
    message: "pending"
  };

  state.moduleResults.set(mod.key, result);
  renderLedger();

  try {
    const response = await fetch(url, { cache: "no-store" });
    result.fetchOk = response.ok;
    result.contentType = response.headers.get("content-type") || "";

    const text = await response.text();
    result.rawJavaScript = response.ok && isLikelyJavaScript(result.contentType, text);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (!result.rawJavaScript) {
      throw new Error(`Not raw JavaScript. content-type=${result.contentType || "unknown"}`);
    }

    const imported = await import(url);
    result.importOk = true;

    result.missingExports = mod.requiredExports.filter((name) => !(name in imported));
    result.exportOk = result.missingExports.length === 0;

    if (!result.exportOk) {
      throw new Error(`Missing exports: ${result.missingExports.join(", ")}`);
    }

    result.status = "pass";
    result.message = "reachable, raw JavaScript, import succeeded, exports present";
    state.importedModules.set(mod.key, imported);
  } catch (error) {
    result.status = "fail";
    result.message = error?.message || "module proof failed";

    if (!state.firstFailure) state.firstFailure = result;
  }

  state.moduleResults.set(mod.key, result);
  renderLedger();
  return result;
}

async function runModuleLedger() {
  setStatus("Module ledger running. Proving reusable engine files.");
  markDocument({ moduleLedger: "running" });

  for (const mod of MODULES) {
    const result = await proveModule(mod);
    if (result.status === "fail") {
      setStatus(`Diagnostic fallback active. First failed module: ${mod.path} — ${result.message}`);
      markDocument({
        moduleLedger: "failed",
        firstFailedModule: mod.path,
        firstFailedMessage: result.message
      });
      return false;
    }
  }

  setStatus("Module ledger passed. Attaching live hex substrate.");
  markDocument({ moduleLedger: "passed" });
  return true;
}

function resizeCanvas() {
  const box = state.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
  const width = Math.max(720, Math.floor((box.width || 900) * dpr));
  const height = Math.max(880, Math.floor((box.height || 1000) * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  return { width, height };
}

function drawDiagnosticFallback(time = performance.now()) {
  if (!state.ctx || !state.canvas || state.mode === "enhanced") return;

  const { width: w, height: h } = resizeCanvas();
  const t = (time - state.startedAt) / 1000;
  const ctx = state.ctx;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "rgb(29,47,62)");
  bg.addColorStop(0.42, "rgb(52,72,72)");
  bg.addColorStop(0.58, "rgb(43,66,64)");
  bg.addColorStop(1, "rgb(20,31,28)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(244,207,131,.12)";
  ctx.fillRect(0, h * 0.36, w, h * 0.20);

  ctx.fillStyle = "rgba(32,92,118,.52)";
  ctx.fillRect(0, h * 0.38, w, h * 0.17);

  ctx.fillStyle = "rgba(74,96,58,.52)";
  ctx.fillRect(0, h * 0.55, w, h * 0.45);

  ctx.strokeStyle = "rgba(255,238,187,.20)";
  ctx.lineWidth = Math.max(1, w * 0.001);
  for (let i = 0; i < 18; i += 1) {
    const y = h * (0.40 + i * 0.007);
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(t + i) * 2);
    ctx.lineTo(w, y + Math.cos(t + i) * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(0,0,0,.46)";
  ctx.fillRect(w * 0.08, h * 0.08, w * 0.84, h * 0.145);

  ctx.fillStyle = "rgba(255,236,185,.96)";
  ctx.font = `900 ${Math.max(16, w * 0.028)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.fillText("DIAGNOSTIC FALLBACK — NOT BASELINE", w * 0.50, h * 0.145);

  ctx.fillStyle = "rgba(238,244,255,.74)";
  ctx.font = `800 ${Math.max(12, w * 0.017)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.fillText("Module ledger is controlling. Visual expansion is held.", w * 0.50, h * 0.185);

  state.receipt = Object.freeze({
    contract: CONTRACT,
    generation: GENERATION,
    route: ROUTE,
    parentBaseline: PARENT_BASELINE,
    parentMutation: false,
    mode: state.mode,
    rendered: true,
    fallbackDemoted: true,
    visualExpansion: false,
    firstFailure: state.firstFailure,
    modules: Object.fromEntries(state.moduleResults)
  });

  state.fallbackRaf = requestAnimationFrame(drawDiagnosticFallback);
}

function startDiagnosticFallback() {
  state.mode = "diagnostic-fallback";
  setStatus("Diagnostic fallback active. Module ledger running.");
  markDocument({
    rendered: "true",
    mode: state.mode,
    fallbackDemoted: "true",
    visualExpansion: "false"
  });

  cancelAnimationFrame(state.fallbackRaf);
  state.fallbackRaf = requestAnimationFrame(drawDiagnosticFallback);
}

async function attachEnhancedScene() {
  const sceneModule = state.importedModules.get("scene");
  const profileModule = state.importedModules.get("hEarthProfile");

  const profile = profileModule.getHEarthWesternGoldenShelfProfile();
  const scene = sceneModule.createGroundEnvironmentScene(state.canvas, profile, {
    targetFrameMs: 50,
    maxDpr: 1.75,
    minWidth: 960,
    minHeight: 1180
  });

  cancelAnimationFrame(state.fallbackRaf);

  state.scene = scene.start();
  state.mode = "enhanced";

  setStatus("Reusable ground environment engine active. Hex substrate live. Shimmer Protocol active.");
  markDocument({
    rendered: "true",
    mode: state.mode,
    moduleLedger: "passed",
    hexSubstrate: "live",
    shimmerProtocol: "active",
    sceneEngine: "active"
  });

  state.receipt = Object.freeze({
    contract: CONTRACT,
    generation: GENERATION,
    route: ROUTE,
    parentBaseline: PARENT_BASELINE,
    parentMutation: false,
    mode: state.mode,
    rendered: true,
    fallbackDemoted: true,
    visualExpansion: false,
    moduleLedger: Object.fromEntries(state.moduleResults),
    scene: state.scene.status()
  });

  renderLedger();
}

async function init() {
  state.statusNode = document.querySelector("[data-render-status]");
  state.canvas = document.querySelector("[data-h-earth-ground-canvas]");

  markDocument({ boot: "started" });
  createLedgerRoot();
  renderLedger();

  if (!state.canvas) {
    state.mode = "failed";
    setStatus("Ground canvas missing. Module ledger cannot attach.");
    markDocument({ rendered: "false", error: "ground-canvas-missing" });
    renderLedger();
    return;
  }

  state.ctx = state.canvas.getContext("2d", { alpha: false });

  if (!state.ctx) {
    state.mode = "failed";
    setStatus("Ground canvas 2D context unavailable.");
    markDocument({ rendered: "false", error: "canvas-2d-context-unavailable" });
    renderLedger();
    return;
  }

  startDiagnosticFallback();

  const ledgerPassed = await runModuleLedger();

  if (ledgerPassed) {
    try {
      await attachEnhancedScene();
    } catch (error) {
      state.mode = "diagnostic-fallback";
      const message = error?.message || "enhanced scene attach failed";
      setStatus(`Diagnostic fallback active. Enhanced attach failed: ${message}`);
      markDocument({
        rendered: "true",
        mode: state.mode,
        moduleLedger: "passed",
        sceneEngine: "attach-failed",
        attachError: message
      });
    }
  }

  window.DGBHEarthGround = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        generation: GENERATION,
        route: ROUTE,
        parentBaseline: PARENT_BASELINE,
        parentMutation: false,
        mode: state.mode,
        fallbackDemoted: true,
        visualExpansion: false,
        hexSubstrate: state.mode === "enhanced" ? "live" : "not-yet-live",
        shimmerProtocol: state.mode === "enhanced",
        firstFailure: state.firstFailure,
        moduleLedger: Object.fromEntries(state.moduleResults),
        scene: state.scene?.status?.() || null,
        receipt: state.receipt
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;
