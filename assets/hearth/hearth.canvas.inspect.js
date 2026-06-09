// /assets/hearth/hearth.canvas.inspect.js
// HEARTH_CANVAS_CHAPEL_1_PRIEST_POINTER_INSPECT_TNT_v1
// Full-file replacement.
// Inspect-only. No mutation. No rendering ownership.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_CHAPEL_1_PRIEST_POINTER_INSPECT_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_CHAPEL_1_PRIEST_POINTER_INSPECT_RECEIPT_v1";
  const VERSION = "2026-06-09.hearth-canvas-chapel-1-priest-pointer-inspect-v1";

  const FILE = "/assets/hearth/hearth.canvas.inspect.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,

    role: "CHAPEL_1_PRIEST_POINTER_FINGER",
    chapel: "CANVAS_CHAPEL",
    inspectOnly: true,
    mayMutate: false,
    mayRender: false,
    mayRepair: false,
    mayReleaseF13: false,
    mayLatchF21: false,

    lastReport: null,
    createdAt: nowIso(),
    updatedAt: ""
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function safeBool(value) {
    return value === true;
  }

  function readPath(path) {
    const parts = String(path || "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function methodCount(value) {
    if (!value || typeof value !== "object") return 0;
    return Object.keys(value).filter((key) => typeof value[key] === "function").length;
  }

  function methodKeys(value) {
    if (!value || typeof value !== "object") return [];
    return Object.keys(value).filter((key) => typeof value[key] === "function");
  }

  function query(selector) {
    if (!doc || !doc.querySelector) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function all(selector) {
    if (!doc || !doc.querySelectorAll) return [];
    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function rectOf(node) {
    if (!node || typeof node.getBoundingClientRect !== "function") {
      return {
        present: false,
        width: 0,
        height: 0,
        nonzero: false
      };
    }

    const rect = node.getBoundingClientRect();

    return {
      present: true,
      left: Number(rect.left) || 0,
      top: Number(rect.top) || 0,
      width: Number(rect.width) || 0,
      height: Number(rect.height) || 0,
      nonzero: Boolean(rect.width > 0 && rect.height > 0)
    };
  }

  function inspectTargetDocument() {
    return {
      documentPresent: Boolean(doc),
      locationPath: root.location && root.location.pathname ? root.location.pathname : "",
      targetRoute: TARGET_ROUTE,
      routeMatch: Boolean(root.location && root.location.pathname === TARGET_ROUTE),
      title: doc && doc.title ? doc.title : "",
      readyState: doc && doc.readyState ? doc.readyState : ""
    };
  }

  function inspectCanvasShell() {
    const stage = query("#hearthGlobeStage");
    const mount = query("#hearthGlobeMount");
    const canvases = mount ? Array.from(mount.querySelectorAll("canvas")) : all("canvas");
    const canvas = canvases[0] || null;

    const stageRect = rectOf(stage);
    const mountRect = rectOf(mount);
    const canvasRect = rectOf(canvas);

    return {
      stagePresent: Boolean(stage),
      mountPresent: Boolean(mount),
      canvasPresent: Boolean(canvas),
      canvasCount: canvases.length,
      oneCanvas: canvases.length === 1,
      stageRect,
      mountRect,
      canvasRect,
      stageNonzero: stageRect.nonzero,
      mountNonzero: mountRect.nonzero,
      canvasRectNonzero: canvasRect.nonzero,
      canvasWidth: canvas ? Number(canvas.width) || 0 : 0,
      canvasHeight: canvas ? Number(canvas.height) || 0 : 0,
      canvasBackingStoreNonzero: Boolean(canvas && canvas.width > 0 && canvas.height > 0),
      context2dAvailable: Boolean(canvas && typeof canvas.getContext === "function" && canvas.getContext("2d")),
      shellReadable: Boolean(stage && mount && canvas),
      shellDisplayReady: Boolean(stageRect.nonzero && mountRect.nonzero && canvasRect.nonzero)
    };
  }

  function inspectControllerGlobals() {
    const candidates = [
      "HEARTH_SHOWROOM_CONTROLLER",
      "HEARTH_GLOBE_CONTROLLER",
      "HEARTH_CANVAS_CONTROLLER",
      "HEARTH.showroomController",
      "HEARTH.globeController",
      "HEARTH.canvasController",
      "DEXTER_LAB.hearthShowroomController"
    ];

    const found = candidates.map((alias) => {
      const value = readPath(alias);
      return {
        alias,
        found: Boolean(value),
        valueType: value ? typeof value : "undefined",
        methodCount: methodCount(value),
        methodKeys: methodKeys(value).join(",")
      };
    });

    return {
      controllerPresent: found.some((item) => item.found),
      controllerCandidates: found
    };
  }

  function inspectDiagnosticSlots() {
    const slots = [
      "[data-hearth-diagnostic-route]",
      "[data-hearth-diagnostic-carrier]",
      "[data-hearth-diagnostic-lens]",
      "[data-hearth-diagnostic-canvas]",
      "[data-hearth-diagnostic-loop]",
      "[data-hearth-diagnostic-scope]",
      "[data-hearth-diagnostic-surface-truth]",
      "[data-hearth-diagnostic-target-access]",
      "[data-hearth-diagnostic-downstream]"
    ];

    const checked = slots.map((selector) => ({
      selector,
      found: Boolean(query(selector))
    }));

    return {
      diagnosticSlotCount: checked.length,
      diagnosticSlotsFound: checked.filter((item) => item.found).length,
      allDiagnosticSlotsFound: checked.every((item) => item.found),
      diagnosticSlots: checked
    };
  }

  function inspectLatticeSpectrum() {
    const spectrumRoot = query(".hearth-spectrum-16x16") || query(".spectrum-16x16") || query("[data-hearth-spectrum]");
    const cells = spectrumRoot
      ? Array.from(spectrumRoot.querySelectorAll("[data-spectrum-cell], [data-hearth-spectrum-cell], button, span"))
      : [];

    return {
      spectrumRootPresent: Boolean(spectrumRoot),
      spectrumCellCount: cells.length,
      spectrum256Present: cells.length === 256,
      spectrumAtLeastVisible: cells.length > 0
    };
  }

  function inspectSurfaceTruthProbe() {
    const probe = readPath("HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH") ||
      readPath("HEARTH.canvasSurfaceTruthProbe") ||
      readPath("HEARTH.diagnosticProbeCanvasSurfaceTruth") ||
      readPath("DEXTER_LAB.canvasSurfaceTruthProbe");

    return {
      surfaceTruthProbePresent: Boolean(probe),
      valueType: probe ? typeof probe : "undefined",
      methodCount: methodCount(probe),
      methodKeys: methodKeys(probe).join(",")
    };
  }

  function makeConclusion(parts) {
    const shell = parts.canvasShell;
    const slots = parts.diagnosticSlots;
    const spectrum = parts.latticeSpectrum;
    const probe = parts.surfaceTruthProbe;

    const pass = Boolean(
      shell.shellReadable &&
      shell.shellDisplayReady &&
      shell.oneCanvas &&
      slots.allDiagnosticSlotsFound &&
      spectrum.spectrum256Present &&
      probe.surfaceTruthProbePresent
    );

    let firstFailed = "NONE";

    if (!shell.stagePresent) firstFailed = "MISSING_HEARTH_GLOBE_STAGE";
    else if (!shell.mountPresent) firstFailed = "MISSING_HEARTH_GLOBE_MOUNT";
    else if (!shell.canvasPresent) firstFailed = "MISSING_CANVAS";
    else if (!shell.oneCanvas) firstFailed = "CANVAS_COUNT_NOT_ONE";
    else if (!shell.stageNonzero) firstFailed = "STAGE_RECT_ZERO";
    else if (!shell.mountNonzero) firstFailed = "MOUNT_RECT_ZERO";
    else if (!shell.canvasRectNonzero) firstFailed = "CANVAS_RECT_ZERO";
    else if (!slots.allDiagnosticSlotsFound) firstFailed = "DIAGNOSTIC_SLOTS_INCOMPLETE";
    else if (!spectrum.spectrum256Present) firstFailed = "LOCAL_256_SPECTRUM_INCOMPLETE";
    else if (!probe.surfaceTruthProbePresent) firstFailed = "SURFACE_TRUTH_PROBE_MISSING";

    return {
      inspectPass: pass,
      blocking: !pass,
      firstFailed,
      recommendedNextFile: pass
        ? "/assets/hearth/hearth.canvas.chapel.js"
        : "/showroom/globe/hearth/index.js",
      recommendedNextAction: pass
        ? "CRAFT_CANVAS_CHAPEL_BISHOP_CONSTRUCT"
        : "RENEW_HEARTH_SHOWROOM_SHELL_AND_STAGE_ALIGNMENT",
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };
  }

  function inspect() {
    const parts = {
      targetDocument: inspectTargetDocument(),
      canvasShell: inspectCanvasShell(),
      controllerGlobals: inspectControllerGlobals(),
      diagnosticSlots: inspectDiagnosticSlots(),
      latticeSpectrum: inspectLatticeSpectrum(),
      surfaceTruthProbe: inspectSurfaceTruthProbe()
    };

    const conclusion = makeConclusion(parts);

    const report = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,

      component: "HEARTH_CANVAS_CHAPEL_1_PRIEST_POINTER_INSPECT",
      role: state.role,
      chapel: state.chapel,
      inspectOnly: true,

      ...parts,
      conclusion,

      productionMutationAuthorized: false,
      canvasRepairAuthorized: false,
      canvasBuildAuthorized: false,
      canvasReleaseAuthorized: false,
      controlsRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      routeRepairAuthorized: false,
      targetRouteRendererMutationAuthorized: false,
      readyTextClaimed: false,
      f13Claimed: false,
      f21Claimed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      inspectedAt: nowIso()
    };

    state.lastReport = report;
    state.updatedAt = report.inspectedAt;
    publishGlobals();

    return report;
  }

  function run() {
    return inspect();
  }

  function getReport() {
    return state.lastReport || inspect();
  }

  function getReceiptLight() {
    const report = state.lastReport || inspect();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      component: "HEARTH_CANVAS_CHAPEL_1_PRIEST_POINTER_INSPECT",
      role: state.role,
      chapel: state.chapel,
      inspectOnly: true,
      inspectPass: safeBool(report.conclusion && report.conclusion.inspectPass),
      blocking: safeBool(report.conclusion && report.conclusion.blocking),
      firstFailed: report.conclusion ? report.conclusion.firstFailed : "UNKNOWN",
      recommendedNextFile: report.conclusion ? report.conclusion.recommendedNextFile : "",
      recommendedNextAction: report.conclusion ? report.conclusion.recommendedNextAction : "",
      mayMutate: false,
      mayRender: false,
      mayRepair: false,
      mayReleaseF13: false,
      mayLatchF21: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      report: getReport(),
      owns: [
        "canvas chapel priest pointer inspection",
        "Hearth showroom shell reading",
        "canvas rect reading",
        "one-canvas verification",
        "diagnostic slot reading",
        "local 256 spectrum reading",
        "surface-truth probe presence reading"
      ],
      doesNotOwn: [
        "canvas rendering",
        "canvas repair",
        "route repair",
        "controls restart",
        "runtime restart",
        "F13 release",
        "F21 latch",
        "visual pass claim",
        "generated image",
        "GraphicBox",
        "WebGL"
      ]
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_CHAPEL_1_PRIEST_POINTER_INSPECT_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `targetRoute=${r.targetRoute}`,
      "",
      `component=${r.component}`,
      `role=${r.role}`,
      `chapel=${r.chapel}`,
      `inspectOnly=${r.inspectOnly}`,
      "",
      `inspectPass=${r.inspectPass}`,
      `blocking=${r.blocking}`,
      `firstFailed=${r.firstFailed}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextAction=${r.recommendedNextAction}`,
      "",
      `mayMutate=${r.mayMutate}`,
      `mayRender=${r.mayRender}`,
      `mayRepair=${r.mayRepair}`,
      `mayReleaseF13=${r.mayReleaseF13}`,
      `mayLatchF21=${r.mayLatchF21}`,
      "",
      `visualPassClaimed=${r.visualPassClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_CANVAS_CHAPEL_1_PRIEST_POINTER_INSPECT = api;
    root.HEARTH_CANVAS_INSPECT = api;
    root.HEARTH_CANVAS_PRIEST_INSPECT = api;

    root.HEARTH.canvasInspect = api;
    root.HEARTH.canvasPriestInspect = api;
    root.HEARTH.chapel1PriestInspect = api;

    root.DEXTER_LAB.hearthCanvasInspect = api;
    root.DEXTER_LAB.hearthCanvasPriestInspect = api;

    root.HEARTH_CANVAS_CHAPEL_1_PRIEST_POINTER_INSPECT_RECEIPT = getReceiptLight();

    try {
      if (doc && doc.documentElement && doc.documentElement.dataset) {
        doc.documentElement.dataset.hearthCanvasInspectLoaded = "true";
        doc.documentElement.dataset.hearthCanvasInspectContract = CONTRACT;
        doc.documentElement.dataset.hearthCanvasInspectReceipt = RECEIPT;
        doc.documentElement.dataset.hearthCanvasInspectOnly = "true";
        doc.documentElement.dataset.hearthCanvasInspectMayMutate = "false";
        doc.documentElement.dataset.hearthCanvasInspectMayRender = "false";
        doc.documentElement.dataset.hearthCanvasInspectVisualPassClaimed = "false";
      }
    } catch (_error) {}
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,

    inspect,
    run,
    runDiagnostic: run,
    read: getReport,
    getReport,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    publishGlobals,

    inspectOnly: true,
    mayMutate: false,
    mayRender: false,
    mayRepair: false,
    mayReleaseF13: false,
    mayLatchF21: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    get state() {
      return state;
    }
  };

  publishGlobals();

  if (doc && doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", () => {
      inspect();
    }, { once: true });
  } else {
    inspect();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
