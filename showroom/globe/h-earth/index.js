// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_SCENE_CORE_MECHANICS_REDUCTION_CACHE_SYNC_v1
// Purpose: synchronize conductor generation so /assets/world/environment/scene.js
// is loaded with H_EARTH_SCENE_CORE_MECHANICS_REDUCTION_TNT_v1.
// Parent Globe untouched. Visual modules untouched. Scene reduction proof only.

const CONTRACT = "H_EARTH_SCENE_CORE_MECHANICS_REDUCTION_CACHE_SYNC_v1";
const GENERATION = "H_EARTH_SCENE_CORE_MECHANICS_REDUCTION_TNT_v1";
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
    label: "Scene Core Mechanics",
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
  statusNode: null,
  receiptRoot: null,
  moduleResults: new Map(),
  importedModules: new Map(),
  mode: "booting",
  firstFailure: null,
  scene: null,
  receipt: null
};

function withGeneration(path) {
  return `${path}?v=${encodeURIComponent(GENERATION)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStatus(text) {
  if (state.statusNode) state.statusNode.textContent = text;
}

function markDocument(extra = {}) {
  const markers = {
    page: "h-earth-scene-core-mechanics-reduction",
    route: ROUTE,
    contract: CONTRACT,
    generation: GENERATION,
    parentBaseline: PARENT_BASELINE,
    parentMutation: "false",
    groundLevel: "true",
    reusableEnvironmentEngine: state.mode === "enhanced" ? "active" : "diagnostic",
    hexSubstrate: state.mode === "enhanced" ? "live" : "not-yet-live",
    shimmerProtocol: state.mode === "enhanced" ? "active" : "pending",
    sceneCoreReduction: "true",
    sceneOwnsOnly: "sky-water-ground",
    publicPresentation: "active",
    mode: state.mode,
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function createReceiptRoot() {
  const existing = document.querySelector("[data-ground-audit-receipt], [data-module-ledger]");

  if (existing) {
    existing.dataset.groundAuditReceipt = "true";
    delete existing.dataset.moduleLedger;
    state.receiptRoot = existing;
    return existing;
  }

  const root = document.createElement("section");
  root.dataset.groundAuditReceipt = "true";
  root.style.marginTop = "14px";
  root.style.padding = "12px 14px";
  root.style.border = "1px solid rgba(167,243,198,.22)";
  root.style.borderRadius = "18px";
  root.style.background = "rgba(5,38,34,.20)";
  root.style.color = "rgba(238,244,255,.86)";
  root.style.font = "800 12px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

  const anchor =
    document.querySelector("[data-render-status]") ||
    document.querySelector(".render-status") ||
    document.querySelector("#ground-world") ||
    document.body;

  if (anchor?.parentNode) anchor.parentNode.insertBefore(root, anchor.nextSibling);
  else document.body.appendChild(root);

  state.receiptRoot = root;
  return root;
}

function getLedgerCounts() {
  const results = [...state.moduleResults.values()];

  return {
    total: MODULES.length,
    passed: results.filter((item) => item.status === "pass").length,
    failed: results.filter((item) => item.status === "fail").length
  };
}

function renderReceipt() {
  const root = state.receiptRoot || createReceiptRoot();
  const counts = getLedgerCounts();
  const enhanced = state.mode === "enhanced";
  const failed = counts.failed > 0;

  const statusColor = enhanced ? "#a7f3c6" : failed ? "#ffb4a8" : "#f4cf83";
  const summaryText = enhanced
    ? "Ground engine active · Scene reduced to sky, water, and ground mechanics · Hex substrate live"
    : failed
      ? `Ground engine held · First blocked module: ${state.firstFailure?.path || "unknown"}`
      : "Ground engine proving scene-core reduction chain";

  const detailRows = MODULES.map((mod) => {
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
          <strong style="color:${color};">${escapeHtml(mod.label)}</strong>
          <span style="color:${color};text-transform:uppercase;">${escapeHtml(result.status)}</span>
        </div>
        <div style="color:rgba(238,244,255,.52);word-break:break-all;">${escapeHtml(withGeneration(mod.path))}</div>
        <div style="color:rgba(238,244,255,.56);margin-top:4px;">
          URL ${result.fetchOk ? "PASS" : "—"} · JS ${result.rawJavaScript ? "PASS" : "—"} · Import ${result.importOk ? "PASS" : "—"} · Exports ${result.exportOk ? "PASS" : "—"}
        </div>
        <div style="color:rgba(238,244,255,.48);margin-top:4px;">${escapeHtml(result.message || "")}</div>
      </div>
    `;
  }).join("");

  root.innerHTML = `
    <div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;">
      <div>
        <div style="color:${statusColor};font-weight:950;letter-spacing:.06em;text-transform:uppercase;">Live Ground Receipt</div>
        <div style="color:rgba(238,244,255,.72);margin-top:3px;">${escapeHtml(summaryText)}</div>
      </div>
      <div style="color:${statusColor};text-transform:uppercase;">${escapeHtml(state.mode)}</div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:10px;">
      <div><span style="color:rgba(238,244,255,.48);">Modules</span><br><strong>${counts.passed}/${counts.total}</strong></div>
      <div><span style="color:rgba(238,244,255,.48);">Hex</span><br><strong>${enhanced ? "LIVE" : "HELD"}</strong></div>
      <div><span style="color:rgba(238,244,255,.48);">Scene</span><br><strong>${enhanced ? "CORE" : "PENDING"}</strong></div>
      <div><span style="color:rgba(238,244,255,.48);">Owns</span><br><strong>SKY/WATER/GROUND</strong></div>
      <div><span style="color:rgba(238,244,255,.48);">Parent</span><br><strong>LOCKED</strong></div>
    </div>

    <details ${failed ? "open" : ""} style="margin-top:10px;">
      <summary style="cursor:pointer;color:rgba(244,207,131,.92);font-weight:950;">Audit details</summary>
      <div style="margin-top:8px;">${detailRows}</div>
    </details>
  `;
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
    missingExports: [],
    message: "pending"
  };

  state.moduleResults.set(mod.key, result);
  renderReceipt();

  try {
    const response = await fetch(url, { cache: "no-store" });
    result.fetchOk = response.ok;
    result.contentType = response.headers.get("content-type") || "";

    const text = await response.text();
    result.rawJavaScript = response.ok && isLikelyJavaScript(result.contentType, text);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!result.rawJavaScript) {
      throw new Error(`Not raw JavaScript. content-type=${result.contentType || "unknown"}`);
    }

    const imported = await import(url);
    result.importOk = true;

    result.missingExports = mod.requiredExports.filter((name) => !(name in imported));
    result.exportOk = result.missingExports.length === 0;

    if (!result.exportOk) throw new Error(`Missing exports: ${result.missingExports.join(", ")}`);

    result.status = "pass";
    result.message = "reachable, raw JavaScript, import succeeded, exports present";
    state.importedModules.set(mod.key, imported);
  } catch (error) {
    result.status = "fail";
    result.message = error?.message || "module proof failed";
    if (!state.firstFailure) state.firstFailure = result;
  }

  state.moduleResults.set(mod.key, result);
  renderReceipt();
  return result;
}

async function runModuleProof() {
  setStatus("Proving scene-core mechanics reduction.");
  markDocument({ moduleProof: "running" });

  for (const mod of MODULES) {
    const result = await proveModule(mod);

    if (result.status === "fail") {
      setStatus(`Ground engine held. First blocked module: ${mod.path} — ${result.message}`);
      markDocument({
        moduleProof: "failed",
        firstBlockedModule: mod.path,
        firstBlockedMessage: result.message
      });
      return false;
    }
  }

  setStatus("Module proof passed. Attaching reduced scene core.");
  markDocument({ moduleProof: "passed" });
  return true;
}

async function attachScene() {
  const sceneModule = state.importedModules.get("scene");
  const profileModule = state.importedModules.get("hEarthProfile");

  const profile = profileModule.getHEarthWesternGoldenShelfProfile();
  const scene = sceneModule.createGroundEnvironmentScene(state.canvas, profile, {
    targetFrameMs: 50,
    maxDpr: 1.75,
    minWidth: 960,
    minHeight: 1180
  });

  state.scene = scene.start();
  state.mode = "enhanced";

  setStatus("Reusable ground environment engine active. Scene reduced to sky, water, and ground mechanics. Hex substrate live.");
  markDocument({
    rendered: "true",
    mode: state.mode,
    moduleProof: "passed",
    hexSubstrate: "live",
    shimmerProtocol: "active",
    sceneCoreReduction: "active",
    sceneOwnsOnly: "sky-water-ground",
    publicPresentation: "active"
  });

  state.receipt = Object.freeze({
    contract: CONTRACT,
    generation: GENERATION,
    route: ROUTE,
    parentBaseline: PARENT_BASELINE,
    parentMutation: false,
    mode: state.mode,
    rendered: true,
    sceneCoreReduction: true,
    sceneOwnsOnly: ["sky", "water", "ground", "composition", "receipt"],
    delegatedToOtherFiles: ["structure", "foliage", "terrain-detail", "wildlife", "advanced-climate", "advanced-water"],
    moduleProof: Object.fromEntries(state.moduleResults),
    scene: state.scene.status()
  });

  renderReceipt();
}

async function init() {
  state.statusNode = document.querySelector("[data-render-status]");
  state.canvas = document.querySelector("[data-h-earth-ground-canvas]");

  markDocument({ boot: "started" });
  createReceiptRoot();
  renderReceipt();

  if (!state.canvas) {
    state.mode = "failed";
    setStatus("Ground canvas missing. Public expression cannot attach.");
    markDocument({ rendered: "false", error: "ground-canvas-missing" });
    renderReceipt();
    return;
  }

  const proofPassed = await runModuleProof();

  if (!proofPassed) return;

  try {
    await attachScene();
  } catch (error) {
    state.mode = "diagnostic-fallback";
    const message = error?.message || "scene attach failed";
    setStatus(`Ground proof passed. Scene attach held: ${message}`);
    markDocument({
      rendered: "false",
      mode: state.mode,
      moduleProof: "passed",
      sceneEngine: "attach-held",
      attachError: message
    });
    renderReceipt();
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
        publicPresentation: true,
        sceneCoreReduction: state.mode === "enhanced",
        sceneOwnsOnly: ["sky", "water", "ground"],
        hexSubstrate: state.mode === "enhanced" ? "live" : "not-yet-live",
        shimmerProtocol: state.mode === "enhanced",
        firstFailure: state.firstFailure,
        moduleProof: Object.fromEntries(state.moduleResults),
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
