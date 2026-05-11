// /gauges/h-earth/index.js
// GAUGES_H_EARTH_PARENT_CHAIN_SURFACE_READ_DIAGNOSTIC_JS_TNT_v3
// Full-file replacement.
// Read-only H-Earth diagnostics.
//
// Owns:
// - diagnostics only
// - route/source fetch checks
// - parent-chain module import checks
// - terrain/surface instance checks
// - held future-work reporting
//
// Does not own:
// - route mutation
// - asset mutation
// - canvas paint
// - controls
// - visual pass claim
// - parent truth

const CONTRACT = "GAUGES_H_EARTH_PARENT_CHAIN_SURFACE_READ_DIAGNOSTIC_JS_TNT_v3";
const RECEIPT = "GAUGES_H_EARTH_PARENT_CHAIN_SURFACE_READ_DIAGNOSTIC_RECEIPT_v3";
const VERSION = "2026-05-11.gauges-h-earth-parent-chain-surface-read-diagnostic-v3";

const CACHE_KEY = `gauges-h-earth-v3-${Date.now()}`;

const EXPECTED = Object.freeze({
  hEarthHtml: "H_EARTH_G1_SURFACE_ACTIVE_READ_ROUTE_SHELL_TNT_v4",
  hEarthDoorway: "H_EARTH_G1_SURFACE_ACTIVE_READ_ROUTE_DOORWAY_TNT_v4",
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1",
  surfaceCompletion: "H_EARTH_G1_SURFACE_MATERIAL_COMPLETION_TNT_v2"
});

const MODULES = Object.freeze([
  {
    key: "kernel",
    path: "/assets/h-earth/h-earth.kernel.js",
    exportName: "createHEarthKernel",
    expectedContract: EXPECTED.kernel
  },
  {
    key: "lattice256",
    path: "/assets/h-earth/h-earth.lattice256.js",
    exportName: "createHEarthLattice256",
    expectedContract: EXPECTED.lattice256
  },
  {
    key: "landmap",
    path: "/assets/h-earth/h-earth.landmap.js",
    exportName: "createHEarthLandmap",
    expectedContract: EXPECTED.landmap
  },
  {
    key: "terrain",
    path: "/assets/h-earth/h-earth.terrain.js",
    exportName: "createHEarthTerrain",
    expectedContract: EXPECTED.terrain
  },
  {
    key: "surface",
    path: "/assets/h-earth/h-earth.surface.js",
    exportName: "createHEarthSurface",
    expectedContract: EXPECTED.surface
  }
]);

const CHECKS = [];

function $(id) {
  return document.getElementById(id);
}

function asPercent(pass, total) {
  if (!total) return "0%";
  return `${Math.round((pass / total) * 100)}%`;
}

function safeError(error) {
  if (!error) return "unknown error";
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function cacheUrl(path) {
  return `${path}?v=${encodeURIComponent(CACHE_KEY)}`;
}

function addCheck(status, title, detail, meta = {}) {
  CHECKS.push({
    status,
    title,
    detail,
    meta
  });
}

function renderChecks() {
  const target = $("checks");
  if (!target) return;

  target.replaceChildren(
    ...CHECKS.map((check) => {
      const card = document.createElement("article");
      card.className = "check-card";
      card.dataset.status = check.status;

      const body = document.createElement("div");

      const title = document.createElement("h3");
      title.textContent = check.title;

      const detail = document.createElement("p");
      detail.textContent = check.detail;

      body.append(title, detail);

      const status = document.createElement("span");
      status.className = `status ${check.status}`;
      status.textContent = check.status;

      card.append(body, status);
      return card;
    })
  );

  const total = CHECKS.length;
  const pass = CHECKS.filter((check) => check.status === "pass").length;
  const hold = CHECKS.filter((check) => check.status === "hold").length;
  const fail = CHECKS.filter((check) => check.status === "fail").length;

  $("totalCount").textContent = String(total);
  $("passCount").textContent = String(pass);
  $("holdCount").textContent = String(hold);
  $("failCount").textContent = String(fail);
  $("readiness").textContent = asPercent(pass, total);
}

function codeLine(text) {
  const code = document.createElement("code");
  code.textContent = text;
  return code;
}

function renderReceipt(context = {}) {
  const target = $("receipt");
  if (!target) return;

  const total = CHECKS.length;
  const pass = CHECKS.filter((check) => check.status === "pass").length;
  const hold = CHECKS.filter((check) => check.status === "hold").length;
  const fail = CHECKS.filter((check) => check.status === "fail").length;

  const lines = [
    `${CONTRACT} · Read-only H-Earth parent-chain and surface diagnostics`,
    `Receipt ${RECEIPT}`,
    `Version ${VERSION}`,
    `Total ${total}`,
    `Passed ${pass}`,
    `Held ${hold}`,
    `Failed ${fail}`,
    `Readiness ${asPercent(pass, total)}`,
    `Critical interpretation: ${fail === 0 ? "H-Earth parent-chain diagnostics are aligned or intentionally held." : "One or more H-Earth diagnostics failed."}`,
    `Read-only true`,
    `Generated image false`,
    `GraphicBox false`,
    `Visual pass claimed false`,
    `Parent mutation authorized false`
  ];

  if (context.landmap?.summary) {
    lines.push(`Land ratio ${context.landmap.summary.landRatio}`);
    lines.push(`Ocean ratio ${context.landmap.summary.oceanRatio}`);
  }

  if (context.terrain?.summary) {
    lines.push(`Terrain aspects ${context.terrain.summary.populatedTerrainAspectCount}/${context.terrain.summary.terrainAspectCount}`);
    lines.push(`Full aspect disposition ${String(context.terrain.summary.fullAspectDisposition)}`);
  }

  if (context.surface?.summary) {
    lines.push(`Surface material classes ${context.surface.summary.materialClassCount}/${context.surface.summary.requiredMaterialClassCount}`);
    lines.push(`Material coverage complete ${String(context.surface.summary.materialCoverageComplete)}`);
    lines.push(`Every cell assigned surface ${String(context.surface.summary.everyCellAssignedSurface)}`);
    lines.push(`Surface parent ready ${String(context.surface.summary.surfaceParentReady)}`);
    lines.push(`Downstream canvas may read surface ${String(context.surface.summary.downstreamCanvasMayReadSurface)}`);
    lines.push(`Canvas paint authorized ${String(context.surface.summary.canvasPaintAuthorized)}`);
    lines.push(`Controls authorized ${String(context.surface.summary.controlsAuthorized)}`);
  }

  lines.push("Checks:");
  for (const check of CHECKS) {
    lines.push(`${check.status.toUpperCase()} · ${check.title} · ${check.detail}`);
  }

  target.replaceChildren(...lines.map(codeLine));
}

async function fetchText(path) {
  const response = await fetch(cacheUrl(path), {
    cache: "no-store",
    credentials: "same-origin"
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    text
  };
}

async function checkFetchContains(title, path, marker) {
  try {
    const result = await fetchText(path);

    if (!result.ok) {
      addCheck("fail", title, `${path} · HTTP ${result.status}`);
      return result;
    }

    if (!result.text.includes(marker)) {
      addCheck("fail", title, `${path} · missing marker ${marker}`);
      return result;
    }

    addCheck("pass", title, `${path} · Expected source marker found.`);
    return result;
  } catch (error) {
    addCheck("fail", title, `${path} · ${safeError(error)}`);
    return null;
  }
}

async function importModule(entry) {
  try {
    const imported = await import(cacheUrl(entry.path));

    if (!imported || typeof imported[entry.exportName] !== "function") {
      addCheck("fail", `Asset · ${entry.key} export`, `${entry.path} · missing ${entry.exportName}`);
      return null;
    }

    const actual = imported.CONTRACT || "contract-not-exported";

    if (actual !== entry.expectedContract) {
      addCheck("fail", `Asset · ${entry.key} contract`, `${entry.path} · expected ${entry.expectedContract}, actual ${actual}`);
      return null;
    }

    addCheck("pass", `Asset · ${entry.key} loaded`, `${entry.path} · ${actual}`);
    return imported;
  } catch (error) {
    addCheck("fail", `Asset · ${entry.key} import`, `${entry.path} · ${safeError(error)}`);
    return null;
  }
}

async function importParentChain() {
  const modules = {};

  for (const entry of MODULES) {
    modules[entry.key] = await importModule(entry);
  }

  return modules;
}

function createParentInstances(modules) {
  if (!modules.kernel || !modules.lattice256 || !modules.landmap || !modules.terrain || !modules.surface) {
    return null;
  }

  try {
    const kernel = modules.kernel.createHEarthKernel({
      gaugeContract: CONTRACT,
      readOnly: true
    });

    const lattice256 = modules.lattice256.createHEarthLattice256({ kernel });
    const landmap = modules.landmap.createHEarthLandmap({ kernel, lattice256 });
    const terrain = modules.terrain.createHEarthTerrain({ kernel, lattice256, landmap });
    const surface = modules.surface.createHEarthSurface({ kernel, lattice256, landmap, terrain });

    addCheck("pass", "Instance · parent chain created", "kernel → lattice256 → landmap → terrain → surface instantiated read-only.");

    return { kernel, lattice256, landmap, terrain, surface };
  } catch (error) {
    addCheck("fail", "Instance · parent chain creation", safeError(error));
    return null;
  }
}

function checkParentData(instances) {
  if (!instances) return;

  const { lattice256, landmap, terrain, surface } = instances;

  if (lattice256?.cells?.length === 256) {
    addCheck("pass", "Lattice · 256 cells", "lattice256.cells.length equals 256.");
  } else {
    addCheck("fail", "Lattice · 256 cells", `Expected 256, actual ${lattice256?.cells?.length ?? "missing"}.`);
  }

  const landRatio = landmap?.summary?.landRatio;
  const oceanRatio = landmap?.summary?.oceanRatio;

  if (landRatio === 0.3594 && oceanRatio === 0.6406) {
    addCheck("pass", "Landmap · balance", `LAND_RATIO ${landRatio}; OCEAN_RATIO ${oceanRatio}.`);
  } else {
    addCheck("fail", "Landmap · balance", `Expected 0.3594 / 0.6406, actual ${landRatio} / ${oceanRatio}.`);
  }

  if (terrain?.summary?.everyCellAssignedTerrain === true) {
    addCheck("pass", "Terrain · every cell assigned", "EVERY_CELL_ASSIGNED_TERRAIN true.");
  } else {
    addCheck("fail", "Terrain · every cell assigned", "EVERY_CELL_ASSIGNED_TERRAIN not true.");
  }

  const terrainAspects = `${terrain?.summary?.populatedTerrainAspectCount}/${terrain?.summary?.terrainAspectCount}`;
  if (terrainAspects === "29/29" && terrain?.summary?.fullAspectDisposition === true) {
    addCheck("pass", "Terrain · full aspect disposition", "TERRAIN_ASPECTS 29/29; FULL_ASPECT_DISPOSITION true.");
  } else {
    addCheck("fail", "Terrain · full aspect disposition", `Expected 29/29 true, actual ${terrainAspects} ${String(terrain?.summary?.fullAspectDisposition)}.`);
  }

  if (surface?.summary?.everyCellAssignedSurface === true) {
    addCheck("pass", "Surface · every cell assigned", "EVERY_CELL_ASSIGNED_SURFACE true.");
  } else {
    addCheck("fail", "Surface · every cell assigned", "EVERY_CELL_ASSIGNED_SURFACE not true.");
  }

  const surfaceMaterials = `${surface?.summary?.materialClassCount}/${surface?.summary?.requiredMaterialClassCount}`;
  if (surfaceMaterials === "29/29" && surface?.summary?.materialCoverageComplete === true) {
    addCheck("pass", "Surface · material completion", "SURFACE_MATERIAL_CLASSES 29/29; MATERIAL_COVERAGE_COMPLETE true.");
  } else {
    addCheck("fail", "Surface · material completion", `Expected 29/29 true, actual ${surfaceMaterials} ${String(surface?.summary?.materialCoverageComplete)}.`);
  }

  if (surface?.summary?.surfaceParentReady === true) {
    addCheck("pass", "Surface · parent ready", "SURFACE_PARENT_READY true.");
  } else {
    addCheck("fail", "Surface · parent ready", "SURFACE_PARENT_READY not true.");
  }

  if (surface?.summary?.downstreamCanvasMayReadSurface === true) {
    addCheck("pass", "Surface · canvas may read", "DOWNSTREAM_CANVAS_MAY_READ_SURFACE true.");
  } else {
    addCheck("fail", "Surface · canvas may read", "DOWNSTREAM_CANVAS_MAY_READ_SURFACE not true.");
  }

  if (surface?.summary?.canvasPaintAuthorized === false) {
    addCheck("pass", "Safety · canvas paint unauthorized", "CANVAS_PAINT_AUTHORIZED false.");
  } else {
    addCheck("fail", "Safety · canvas paint unauthorized", "CANVAS_PAINT_AUTHORIZED is not false.");
  }

  if (surface?.summary?.controlsAuthorized === false) {
    addCheck("pass", "Safety · controls unauthorized", "CONTROLS_AUTHORIZED false.");
  } else {
    addCheck("fail", "Safety · controls unauthorized", "CONTROLS_AUTHORIZED is not false.");
  }
}

async function checkRoutesAndSources() {
  await checkFetchContains("Route · H-Earth private room reachable", "/showroom/globe/h-earth/", EXPECTED.hEarthHtml);
  await checkFetchContains("Route · Globe Showcase reachable", "/showroom/globe/", "h-earth");
  await checkFetchContains("Route · H-Earth doorway v4 active", "/showroom/globe/h-earth/index.js", EXPECTED.hEarthDoorway);
  await checkFetchContains("Safety · visual pass remains false", "/showroom/globe/h-earth/index.html", 'data-visual-pass-claim="false"');
  await checkFetchContains("Safety · parent mutation forbidden", "/showroom/globe/h-earth/index.html", 'data-mutation-earth="forbidden"');
  await checkFetchContains("Surface · material completion source marker", "/assets/h-earth/h-earth.surface.js", EXPECTED.surfaceCompletion);
}

function checkHeldFutureWork() {
  addCheck("hold", "Held · Canvas visible composition", "/assets/h-earth/h-earth.canvas.js · Held until surface parent read is accepted for canvas consumption.");
  addCheck("hold", "Held · Controls motion/input", "/assets/h-earth/h-earth.controls.js · Held until canvas exists and exposes a lawful mount return.");
  addCheck("hold", "Held · Ground level remains held", "/assets/h-earth/h-earth/ground/ · Ground-level mode remains held until orbital/aerial inspection is coherent.");
  addCheck("hold", "Held · Estate placement remains held", "/assets/h-earth/h-earth/estate/ · Estate placement remains held until ground-level mode is authorized.");
}

async function runAudit() {
  CHECKS.length = 0;
  renderChecks();
  renderReceipt();

  addCheck("pass", "Gauge · read-only mode", "Diagnostics only; no route, source, canvas, controls, or parent truth mutation.");
  await checkRoutesAndSources();

  const modules = await importParentChain();
  const instances = createParentInstances(modules);
  checkParentData(instances);
  checkHeldFutureWork();

  renderChecks();
  renderReceipt(instances || {});
}

function boot() {
  const button = $("runAuditButton");
  if (button) button.addEventListener("click", runAudit);

  runAudit();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  RECEIPT,
  VERSION,
  EXPECTED,
  MODULES
};
