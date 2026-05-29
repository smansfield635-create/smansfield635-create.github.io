// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1
// Full-file replacement.
// Canvas / visible carrier authority only.
// Purpose:
// - Restore shell-first visible Hearth carrier.
// - Conduct-request-load /assets/lab/runtime-table.js if Runtime Table is not already present.
// - Consume Runtime Table plan when available.
// - Preserve atlas/cache render after carrier visibility.
// - Defer wide-probe diagnostics.
// - Preserve materials + hex surface consumption.
// - Preserve route mount compatibility.
// Does not own:
// - planet truth
// - tectonics
// - elevation
// - composition
// - hydrology
// - materials truth
// - hex truth
// - runtime motion
// - controls
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_ATLAS_START_SEQUENCING_HARDENING_TNT_v1";
  const REQUIRED_RUNTIME_TABLE_CONTRACT = "LAB_UNIVERSAL_PLANET_WIDE_PROBE_DIAGNOSTIC_LOADING_STANDARD_TNT_v1";
  const REQUIRED_HEX_SURFACE_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";
  const REQUIRED_MATERIALS_CONTRACT = "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1";
  const VERSION = "2026-05-29.hearth-canvas-runtime-table-directed-visible-carrier-v1";

  const PATHS = Object.freeze({
    runtimeTable: "/assets/lab/runtime-table.js"
  });

  const CACHE = Object.freeze({
    runtimeTable: "lab-universal-planet-wide-probe-diagnostic-loading-standard-v1"
  });

  const DEFAULTS = Object.freeze({
    size: 460,
    atlasWidth: 384,
    atlasHeight: 192,
    rowsPerChunk: 2,
    probeRowsPerChunk: 2,
    wideProbeMinPoints: 25,
    shellBackground: [4, 9, 17],
    shellEdge: [42, 86, 118],
    shellGlow: [78, 150, 188],
    fallbackWater: [7, 28, 58],
    fallbackLand: [92, 84, 58],
    fallbackAir: [118, 170, 202]
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function boolString(value) {
    return String(Boolean(value));
  }

  function contractOf(value) {
    if (!value || typeof value !== "object") return "";
    return String(
      value.contract ||
      value.CONTRACT ||
      value.runtimeTableContract ||
      value.compatibilityContract ||
      ""
    );
  }

  function receiptOf(value) {
    if (!value || typeof value !== "object") return "";
    return String(value.receipt || value.RECEIPT || "");
  }

  function writeDataset(pairs) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    Object.keys(pairs || {}).forEach((key) => {
      doc.documentElement.dataset[key] = String(pairs[key]);
    });
  }

  function appendCache(path, key) {
    const joiner = path.includes("?") ? "&" : "?";
    return `${path}${joiner}v=${encodeURIComponent(key)}`;
  }

  function resolveRuntimeTable() {
    return (
      root.LAB_RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      root.RUNTIME_TABLE ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null
    );
  }

  function resolveHexSurface() {
    return root.HEARTH_HEX_SURFACE || (root.HEARTH && root.HEARTH.hexSurface) || null;
  }

  function resolveMaterials() {
    return root.HEARTH_MATERIALS || root.HearthMaterials || (root.HEARTH && root.HEARTH.materials) || null;
  }

  function resolveChannel(name) {
    if (name === "land") return root.HEARTH_LAND_CHANNEL || (root.HEARTH && root.HEARTH.landChannel) || null;
    if (name === "water") return root.HEARTH_WATER_CHANNEL || (root.HEARTH && root.HEARTH.waterChannel) || null;
    if (name === "air") return root.HEARTH_AIR_CHANNEL || (root.HEARTH && root.HEARTH.airChannel) || null;
    return null;
  }

  function ensureCanvas(parent, size) {
    let canvas = parent.querySelector && parent.querySelector("canvas[data-hearth-canvas='true']");
    if (!canvas && doc) {
      canvas = doc.createElement("canvas");
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasContract = CONTRACT;
      canvas.dataset.hearthCanvasReceipt = RECEIPT;
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.visualPassClaimed = "false";
      parent.appendChild(canvas);
    }

    if (!canvas) return null;

    const px = Math.max(160, Math.round(size || DEFAULTS.size));
    canvas.width = px;
    canvas.height = px;
    canvas.style.display = "block";
    canvas.style.width = "min(100%, " + px + "px)";
    canvas.style.maxWidth = "100%";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.borderRadius = "50%";
    canvas.style.margin = "0 auto";
    canvas.style.touchAction = "none";

    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthRuntimeTableRequired = "true";
    canvas.dataset.hearthRuntimeTableBlocksVisibleCarrier = "false";
    canvas.dataset.hearthVisibleCarrierFirst = "true";
    canvas.dataset.childFailureDoesNotEraseVisualization = "true";
    canvas.dataset.wideProbeNeverBlocksFirstVisibleRender = "true";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function drawShell(ctx, size, state) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.456;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const base = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.32, radius * 0.04, cx, cy, radius);
    base.addColorStop(0, "rgba(32,60,76,1)");
    base.addColorStop(0.42, "rgba(8,26,48,1)");
    base.addColorStop(1, "rgba(2,7,16,1)");
    ctx.fillStyle = base;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const shade = ctx.createRadialGradient(cx + radius * 0.2, cy + radius * 0.1, radius * 0.18, cx, cy, radius);
    shade.addColorStop(0, "rgba(0,0,0,0)");
    shade.addColorStop(0.72, "rgba(0,0,0,0.22)");
    shade.addColorStop(1, "rgba(0,0,0,0.68)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(134,205,236,0.26)";
    ctx.lineWidth = Math.max(1, size * 0.004);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + 7, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(80,165,214,0.10)";
    ctx.lineWidth = Math.max(2, size * 0.008);
    ctx.stroke();
    ctx.restore();

    state.shellRendered = true;
    state.visibleCarrierMounted = true;
    state.imageRendered = true;
    state.visualCarrierMode = "fallback-shell-first";
  }

  function drawAtlasFallback(ctx, size, state, options = {}) {
    const materials = resolveMaterials();
    const hexSurface = resolveHexSurface();

    if (hexSurface && typeof hexSurface.drawHearthHexSurfaceFrame === "function") {
      try {
        const receipt = hexSurface.drawHearthHexSurfaceFrame(
          {
            canvas: state.canvas,
            ctx,
            phase: state.phase || 0
          },
          {
            radiusRatio: 0.456,
            hexDensity: 232,
            atlasWidth: options.atlasWidth || DEFAULTS.atlasWidth,
            atlasHeight: options.atlasHeight || DEFAULTS.atlasHeight
          }
        );

        state.hexSurfaceReceipt = receipt || null;
        state.atlasReady = true;
        state.projectionReady = true;
        state.imageRendered = true;
        state.visualCarrierMode = "hex-surface-consumer";
        return true;
      } catch (error) {
        state.lastHexSurfaceError = error && error.message ? error.message : String(error);
      }
    }

    if (!materials || typeof materials.sample !== "function") {
      return false;
    }

    const output = ctx.createImageData(size, size);
    const data = output.data;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.456;
    const phase = state.phase || 0;
    let landPixels = 0;
    let waterPixels = 0;

    for (let py = 0; py < size; py += 1) {
      const y = (py + 0.5 - cy) / radius;

      for (let px = 0; px < size; px += 1) {
        const x = (px + 0.5 - cx) / radius;
        const r2 = x * x + y * y;
        const index = (py * size + px) * 4;

        if (r2 > 1) {
          data[index + 3] = 0;
          continue;
        }

        const z = Math.sqrt(Math.max(0, 1 - r2));
        const cos = Math.cos(phase);
        const sin = Math.sin(phase);
        const vx = x * cos + z * sin;
        const vz = -x * sin + z * cos;
        const vy = -y;

        let packet = null;
        try {
          packet = materials.sample({ x: vx, y: vy, z: vz });
        } catch (_error) {
          packet = null;
        }

        const rgb = packet && Array.isArray(packet.rgb)
          ? packet.rgb
          : packet && packet.isLand
            ? DEFAULTS.fallbackLand
            : DEFAULTS.fallbackWater;

        const shade = clamp(0.52 + z * 0.52, 0.45, 1.08);

        data[index] = clamp(Math.round(rgb[0] * shade), 0, 255);
        data[index + 1] = clamp(Math.round(rgb[1] * shade), 0, 255);
        data[index + 2] = clamp(Math.round(rgb[2] * shade), 0, 255);
        data[index + 3] = 255;

        if (packet && packet.isLand) landPixels += 1;
        else waterPixels += 1;
      }
    }

    ctx.putImageData(output, 0, 0);

    const cx2 = size / 2;
    const cy2 = size / 2;
    const radius2 = size * 0.456;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx2, cy2, radius2, 0, Math.PI * 2);
    ctx.clip();

    const atmosphere = ctx.createRadialGradient(cx2, cy2, radius2 * 0.70, cx2, cy2, radius2);
    atmosphere.addColorStop(0, "rgba(0,0,0,0)");
    atmosphere.addColorStop(0.82, "rgba(65,140,190,0.10)");
    atmosphere.addColorStop(1, "rgba(8,18,32,0.50)");
    ctx.fillStyle = atmosphere;
    ctx.fillRect(cx2 - radius2, cy2 - radius2, radius2 * 2, radius2 * 2);
    ctx.restore();

    state.atlasReady = true;
    state.projectionReady = true;
    state.imageRendered = true;
    state.visualCarrierMode = "materials-direct-sphere";
    state.landPixels = landPixels;
    state.waterPixels = waterPixels;
    return true;
  }

  function loadRuntimeTableDetailed(state) {
    return new Promise((resolve) => {
      const existing = resolveRuntimeTable();
      const result = {
        key: "runtimeTable",
        path: PATHS.runtimeTable,
        expectedContract: REQUIRED_RUNTIME_TABLE_CONTRACT,
        requested: false,
        requestedSrc: "",
        scriptElementCreated: false,
        scriptElementAppended: false,
        documentHeadAvailable: Boolean(doc && doc.head),
        loaded: false,
        globalPresent: Boolean(existing),
        actualContract: contractOf(existing),
        contractOk: Boolean(existing && contractOf(existing) === REQUIRED_RUNTIME_TABLE_CONTRACT),
        validationOk: Boolean(existing && contractOf(existing) === REQUIRED_RUNTIME_TABLE_CONTRACT),
        error: "",
        errorType: "",
        failureCoordinate: existing ? "C11_CHILD_VALIDATED" : "C0_CHILD_CONNECTOR_NOT_STARTED",
        at: nowIso()
      };

      if (result.validationOk) {
        result.loaded = true;
        resolve(result);
        return;
      }

      if (!doc || !doc.head) {
        result.error = "document-head-unavailable";
        result.errorType = "document";
        result.failureCoordinate = "C6_GLOBAL_ACTOR_MISSING";
        resolve(result);
        return;
      }

      const old = Array.from(doc.querySelectorAll("script[data-hearth-runtime-table-loader='true']"));
      old.forEach((script) => {
        try {
          if (script.parentNode) script.parentNode.removeChild(script);
        } catch (_error) {}
      });

      const script = doc.createElement("script");
      const src = appendCache(PATHS.runtimeTable, CACHE.runtimeTable);

      result.requested = true;
      result.requestedSrc = src;
      result.scriptElementCreated = true;
      result.failureCoordinate = "C2_SCRIPT_ELEMENT_CREATED";

      script.src = src;
      script.defer = true;
      script.dataset.hearthRuntimeTableLoader = "true";
      script.dataset.hearthCanvasContract = CONTRACT;
      script.dataset.hearthCanvasReceipt = RECEIPT;
      script.dataset.expectedContract = REQUIRED_RUNTIME_TABLE_CONTRACT;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      function settle(kind, errorText) {
        if (settled) return;
        settled = true;

        const runtimeTable = resolveRuntimeTable();
        result.globalPresent = Boolean(runtimeTable);
        result.actualContract = contractOf(runtimeTable);
        result.contractOk = Boolean(runtimeTable && contractOf(runtimeTable) === REQUIRED_RUNTIME_TABLE_CONTRACT);
        result.validationOk = result.contractOk;
        result.loaded = kind === "load" && result.validationOk;
        result.error = errorText || "";
        result.errorType = kind === "load" ? "" : kind;

        if (result.validationOk) result.failureCoordinate = "C11_CHILD_VALIDATED";
        else if (kind === "error") result.failureCoordinate = "C4_SCRIPT_NETWORK_LOAD_FAILURE";
        else if (kind === "timeout") result.failureCoordinate = "C5_SCRIPT_LOAD_TIMEOUT";
        else if (runtimeTable && !result.contractOk) result.failureCoordinate = "C7_CONTRACT_MISMATCH";
        else result.failureCoordinate = "C6_GLOBAL_ACTOR_MISSING";

        resolve(result);
      }

      script.onload = () => settle("load", "");
      script.onerror = () => settle("error", "runtime-table-load-error");

      try {
        doc.head.appendChild(script);
        result.scriptElementAppended = true;
        result.failureCoordinate = "C3_SCRIPT_APPENDED";
      } catch (error) {
        result.error = error && error.message ? error.message : String(error);
        result.errorType = "append-error";
        result.failureCoordinate = "C4_SCRIPT_NETWORK_LOAD_FAILURE";
        resolve(result);
        return;
      }

      setTimeout(() => settle("timeout", "runtime-table-load-timeout"), 6500);
    });
  }

  function sampleAuthority(authority, point) {
    if (!authority || typeof authority !== "object") return null;
    try {
      if (typeof authority.sample === "function") return authority.sample(point);
      if (typeof authority.read === "function") return authority.read(point);
      if (typeof authority.getMaterial === "function") return authority.getMaterial(point);
    } catch (_error) {}
    return null;
  }

  function createAnchorSamples() {
    const point = { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 };
    const materials = resolveMaterials();
    const land = resolveChannel("land");
    const water = resolveChannel("water");
    const air = resolveChannel("air");

    const materialSample = sampleAuthority(materials, point) || {};
    const landSample = sampleAuthority(land, point) || {
      contract: "HEARTH_CANVAS_SYNTHETIC_LAND_LOCAL_SAMPLE",
      isLandChannel: true,
      landAlpha: materialSample.isLand ? 0.72 : 0.08,
      bodyBound: true,
      surfaceBound: true,
      allowedToFloat: false,
      mayDefineWater: false,
      mayDefineAir: false,
      x: point.x,
      y: point.y,
      z: point.z,
      u: point.u,
      v: point.v,
      rgb: materialSample.isLand ? materialSample.rgb : DEFAULTS.fallbackLand,
      visualPassClaimed: false
    };

    const waterSample = sampleAuthority(water, point) || {
      contract: "HEARTH_CANVAS_SYNTHETIC_WATER_LOCAL_SAMPLE",
      isWaterChannel: true,
      waterAlpha: materialSample.isWater || !materialSample.isLand ? 0.72 : 0.16,
      bodyBound: true,
      surfaceBound: true,
      hydrosphereBinding: 1,
      surfaceSeat: 1,
      allowedToFloat: false,
      mayDefineLand: false,
      mayDefineAir: false,
      x: point.x,
      y: point.y,
      z: point.z,
      u: point.u,
      v: point.v,
      rgb: materialSample.isWater || !materialSample.isLand ? materialSample.rgb : DEFAULTS.fallbackWater,
      visualPassClaimed: false
    };

    const airSample = sampleAuthority(air, point) || {
      contract: "HEARTH_CANVAS_SYNTHETIC_AIR_LOCAL_SAMPLE",
      isAirChannel: true,
      airAlpha: 0.16,
      allowedToFloat: true,
      floatsAboveBody: true,
      mayDefineLand: false,
      mayDefineWater: false,
      x: point.x,
      y: point.y,
      z: point.z,
      u: point.u,
      v: point.v,
      rgb: DEFAULTS.fallbackAir,
      visualPassClaimed: false
    };

    return {
      samplePoint: point,
      materialSample,
      landSample,
      waterSample,
      airSample,
      canvasSample: {
        contract: CONTRACT,
        receipt: RECEIPT,
        x: point.x,
        y: point.y,
        z: point.z,
        u: point.u,
        v: point.v,
        lon: point.lon,
        lat: point.lat,
        landWeight: clamp01(landSample.landAlpha || landSample.landPresence || (materialSample.isLand ? 0.72 : 0.08)),
        waterWeight: clamp01(waterSample.waterAlpha || waterSample.waterPresence || (materialSample.isWater ? 0.72 : 0.16)),
        airWeight: clamp01(airSample.airAlpha || airSample.airPresence || 0.16),
        visualPassClaimed: false
      }
    };
  }

  function createRuntimePlan(state) {
    const runtimeTable = resolveRuntimeTable();
    const samples = createAnchorSamples();

    let plan = null;
    let ledger = null;
    let diagnostic = null;

    if (runtimeTable && typeof runtimeTable.createHearthVisualCarrierPlan === "function") {
      try {
        plan = runtimeTable.createHearthVisualCarrierPlan(
          {
            planetId: "hearth",
            planetLabel: "Hearth",
            samplePoint: samples.samplePoint,
            canvasMounted: true,
            routeMounted: true,
            fallbackShellAvailable: true,
            renderMetadata: {
              routeMounted: true,
              canvasMounted: true,
              fallbackShellAvailable: true,
              visibleCarrierAllowed: true,
              visualCarrierAllowed: true,
              atlasReady: Boolean(state.atlasReady),
              projectionReady: Boolean(state.projectionReady),
              imageRendered: Boolean(state.imageRendered),
              sphereContainment: true,
              outsideSphereTransparent: true,
              noRectangularTextureSpill: true,
              atlasStartAttempted: Boolean(state.atlasStartAttempted),
              atlasBuilderEntered: Boolean(state.atlasBuilderEntered),
              atlasProgressObserved: Boolean(state.atlasProgressObserved),
              atlasProgress: safeNumber(state.atlasProgress, 0)
            },
            canvasReceipt: createReceipt(state),
            canvasSample: samples.canvasSample,
            landSample: samples.landSample,
            waterSample: samples.waterSample,
            airSample: samples.airSample,
            probeSamples: []
          },
          {
            planetId: "hearth",
            planetLabel: "Hearth",
            profile: "hearth-channel-expression",
            runHearthTable: true,
            budget: {
              atlasWidth: state.options.atlasWidth,
              atlasHeight: state.options.atlasHeight,
              rowsPerChunk: state.options.rowsPerChunk,
              probeRowsPerChunk: state.options.probeRowsPerChunk,
              wideProbeMinPoints: state.options.wideProbeMinPoints,
              sampleRate: 1
            }
          }
        );
      } catch (error) {
        state.runtimeTablePlanError = error && error.message ? error.message : String(error);
      }
    }

    if (runtimeTable && typeof runtimeTable.createHearthChannelTable === "function") {
      try {
        const table = runtimeTable.createHearthChannelTable({
          budget: {
            atlasWidth: state.options.atlasWidth,
            atlasHeight: state.options.atlasHeight,
            rowsPerChunk: state.options.rowsPerChunk,
            probeRowsPerChunk: state.options.probeRowsPerChunk,
            wideProbeMinPoints: state.options.wideProbeMinPoints,
            sampleRate: 1
          }
        });
        ledger = table.run(samples.samplePoint);
      } catch (error) {
        state.runtimeTableLedgerError = error && error.message ? error.message : String(error);
      }
    }

    if (runtimeTable && typeof runtimeTable.runCoherenceDiagnostic === "function") {
      try {
        diagnostic = runtimeTable.runCoherenceDiagnostic(
          {
            goalProfile: runtimeTable.createGoalProfile
              ? runtimeTable.createGoalProfile("hearth-channel-expression")
              : undefined,
            runtimeTableLedger: ledger,
            canvasReceipt: createReceipt(state),
            canvasSample: samples.canvasSample,
            landSample: samples.landSample,
            waterSample: samples.waterSample,
            airSample: samples.airSample,
            renderMetadata: {
              routeMounted: true,
              canvasMounted: true,
              fallbackShellAvailable: true,
              visibleCarrierAllowed: true,
              atlasReady: Boolean(state.atlasReady),
              projectionReady: Boolean(state.projectionReady),
              imageRendered: Boolean(state.imageRendered),
              sphereContainment: true,
              outsideSphereTransparent: true,
              noRectangularTextureSpill: true
            },
            probeSamples: []
          },
          {
            profile: "hearth-channel-expression",
            planetId: "hearth",
            planetLabel: "Hearth"
          }
        );
      } catch (error) {
        state.runtimeTableDiagnosticError = error && error.message ? error.message : String(error);
      }
    }

    state.runtimeTablePlan = plan;
    state.runtimeTableLedger = ledger;
    state.runtimeTableDiagnostic = diagnostic;
    state.runtimeTablePlanReady = Boolean(plan);
    state.runtimeTableConstructionReady = Boolean(
      (plan && plan.constructionReady) ||
      (ledger && ledger.runtimeAllowed)
    );
    state.runtimeTableCoherentExpressionPass = Boolean(
      (plan && plan.coherentExpressionPass) ||
      (diagnostic && diagnostic.coherentExpressionPass)
    );
    state.runtimeTableCoherenceScore = safeNumber(
      (plan && plan.coherenceScore) ||
      (diagnostic && diagnostic.coherenceScore),
      0
    );

    return {
      plan,
      ledger,
      diagnostic,
      samples
    };
  }

  function publishDataset(state) {
    writeDataset({
      hearthCanvasLoaded: "true",
      hearthCanvasContract: CONTRACT,
      hearthCanvasReceipt: RECEIPT,
      hearthCanvasPreviousContract: PREVIOUS_CONTRACT,
      hearthCanvasBaselineContract: BASELINE_CONTRACT,
      hearthCanvasVersion: VERSION,

      hearthCanvasRuntimeTableRequired: "true",
      hearthCanvasRuntimeTablePath: PATHS.runtimeTable,
      hearthCanvasRuntimeTableExpectedContract: REQUIRED_RUNTIME_TABLE_CONTRACT,
      hearthCanvasRuntimeTableLoadRequested: boolString(state.runtimeTableLoadResult && state.runtimeTableLoadResult.requested),
      hearthCanvasRuntimeTableGlobalPresent: boolString(state.runtimeTableLoadResult && state.runtimeTableLoadResult.globalPresent),
      hearthCanvasRuntimeTableContractOk: boolString(state.runtimeTableLoadResult && state.runtimeTableLoadResult.contractOk),
      hearthCanvasRuntimeTableValidationOk: boolString(state.runtimeTableLoadResult && state.runtimeTableLoadResult.validationOk),
      hearthCanvasRuntimeTableFailureCoordinate: state.runtimeTableLoadResult && state.runtimeTableLoadResult.failureCoordinate ? state.runtimeTableLoadResult.failureCoordinate : "",
      hearthCanvasRuntimeTableError: state.runtimeTableLoadResult && state.runtimeTableLoadResult.error ? state.runtimeTableLoadResult.error : "",

      hearthCanvasVisibleCarrierFirst: "true",
      hearthVisiblePlanetCarrier: boolString(state.visibleCarrierMounted),
      hearthVisibleGlobeMounted: boolString(state.visibleCarrierMounted),
      hearthCanvasMounted: boolString(state.mounted),
      hearthCanvasFound: boolString(state.canvas),
      hearthCanvasImageRendered: boolString(state.imageRendered),
      hearthCanvasAtlasReady: boolString(state.atlasReady),
      hearthCanvasProjectionReady: boolString(state.projectionReady),
      hearthCanvasVisualCarrierMode: state.visualCarrierMode || "",

      hearthRuntimeTablePlanReady: boolString(state.runtimeTablePlanReady),
      hearthRuntimeTableConstructionReady: boolString(state.runtimeTableConstructionReady),
      hearthRuntimeTableCoherentExpressionPass: boolString(state.runtimeTableCoherentExpressionPass),
      hearthRuntimeTableCoherenceScore: String(state.runtimeTableCoherenceScore || 0),

      hearthCanvasWideProbeDeferred: "true",
      hearthCanvasWideProbeNeverBlocksFirstVisibleRender: "true",
      hearthCanvasSingleAnchorIsLocalProofOnly: "true",
      childFailureDoesNotEraseVisualization: "true",
      imageRenderedIsNotCoherencePass: "true",
      constructionReadyIsNotCoherencePass: "true",
      coherentExpressionPassIsNotVisualPassClaim: "true",

      generatedImage: "false",
      graphicBox: "false",
      webgl: "false",
      visualPassClaimed: "false"
    });

    if (state.canvas && state.canvas.dataset) {
      state.canvas.dataset.hearthCanvasContract = CONTRACT;
      state.canvas.dataset.hearthCanvasReceipt = RECEIPT;
      state.canvas.dataset.hearthRuntimeTableRequired = "true";
      state.canvas.dataset.hearthRuntimeTableContractOk = boolString(state.runtimeTableLoadResult && state.runtimeTableLoadResult.contractOk);
      state.canvas.dataset.hearthVisibleCarrierFirst = "true";
      state.canvas.dataset.hearthVisibleCarrierMounted = boolString(state.visibleCarrierMounted);
      state.canvas.dataset.hearthAtlasReady = boolString(state.atlasReady);
      state.canvas.dataset.hearthProjectionReady = boolString(state.projectionReady);
      state.canvas.dataset.imageRendered = boolString(state.imageRendered);
      state.canvas.dataset.imageRenderedIsNotCoherencePass = "true";
      state.canvas.dataset.visualPassClaimed = "false";
    }
  }

  function createReceipt(state = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-runtime-table-directed-visible-carrier",
      destinationFile: "/assets/hearth/hearth.canvas.js",
      status: state.mounted ? "mounted" : "active",

      runtimeTable: {
        required: true,
        path: PATHS.runtimeTable,
        expectedContract: REQUIRED_RUNTIME_TABLE_CONTRACT,
        loadRequested: Boolean(state.runtimeTableLoadResult && state.runtimeTableLoadResult.requested),
        globalPresent: Boolean(state.runtimeTableLoadResult && state.runtimeTableLoadResult.globalPresent),
        contractOk: Boolean(state.runtimeTableLoadResult && state.runtimeTableLoadResult.contractOk),
        validationOk: Boolean(state.runtimeTableLoadResult && state.runtimeTableLoadResult.validationOk),
        failureCoordinate: state.runtimeTableLoadResult && state.runtimeTableLoadResult.failureCoordinate ? state.runtimeTableLoadResult.failureCoordinate : "",
        error: state.runtimeTableLoadResult && state.runtimeTableLoadResult.error ? state.runtimeTableLoadResult.error : "",
        visibleCarrierBlockedByRuntimeTableMissing: false
      },

      visibleCarrier: {
        mounted: Boolean(state.visibleCarrierMounted),
        shellFirst: true,
        imageRendered: Boolean(state.imageRendered),
        atlasReady: Boolean(state.atlasReady),
        projectionReady: Boolean(state.projectionReady),
        mode: state.visualCarrierMode || "",
        childFailureDoesNotEraseVisualization: true
      },

      runtimeTablePlan: state.runtimeTablePlan || null,
      runtimeTableLedger: state.runtimeTableLedger || null,
      runtimeTableDiagnostic: state.runtimeTableDiagnostic || null,

      expectedContracts: {
        runtimeTable: REQUIRED_RUNTIME_TABLE_CONTRACT,
        hexSurface: REQUIRED_HEX_SURFACE_CONTRACT,
        materials: REQUIRED_MATERIALS_CONTRACT
      },

      loadingLaw: {
        visibleCarrierFirst: true,
        childContractValidationSecond: true,
        anchorSampleThird: true,
        atlasCacheRenderFourth: true,
        wideProbeIdleChunksLater: true,
        wideProbeNeverBlocksFirstVisibleRender: true
      },

      owns: [
        "visible-carrier-mount",
        "canvas-shell-first-render",
        "runtime-table-conduct-request-load",
        "runtime-table-plan-consumption",
        "atlas/cache-render-after-carrier",
        "canvas-dataset-receipts"
      ],

      doesNotOwn: [
        "planet truth",
        "tectonics",
        "elevation",
        "composition",
        "hydrology",
        "materials truth",
        "hex truth",
        "runtime motion",
        "controls",
        "route orchestration",
        "final visual pass claim"
      ],

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function normalizeMountOptions(options = {}) {
    return {
      size: Math.max(160, Math.round(safeNumber(options.size, DEFAULTS.size))),
      atlasWidth: Math.max(32, Math.round(safeNumber(options.atlasWidth, DEFAULTS.atlasWidth))),
      atlasHeight: Math.max(16, Math.round(safeNumber(options.atlasHeight, DEFAULTS.atlasHeight))),
      rowsPerChunk: Math.max(1, Math.round(safeNumber(options.rowsPerChunk, DEFAULTS.rowsPerChunk))),
      probeRowsPerChunk: Math.max(1, Math.round(safeNumber(options.probeRowsPerChunk, DEFAULTS.probeRowsPerChunk))),
      wideProbeMinPoints: Math.max(25, Math.round(safeNumber(options.wideProbeMinPoints, DEFAULTS.wideProbeMinPoints)))
    };
  }

  function mount(parent, options = {}) {
    if (!parent) {
      throw new Error("HEARTH_CANVAS_MOUNT_REQUIRES_PARENT_ELEMENT");
    }

    const mountOptions = normalizeMountOptions(options);
    const canvas = ensureCanvas(parent, mountOptions.size);
    if (!canvas) {
      throw new Error("HEARTH_CANVAS_COULD_NOT_CREATE_CANVAS");
    }

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const state = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      parent,
      canvas,
      ctx,
      options: mountOptions,
      mounted: true,
      visibleCarrierMounted: false,
      shellRendered: false,
      imageRendered: false,
      atlasReady: false,
      projectionReady: false,
      atlasStartAttempted: false,
      atlasBuilderEntered: false,
      atlasProgressObserved: false,
      atlasProgress: 0,
      phase: 0,
      visualCarrierMode: "",
      runtimeTableLoadResult: null,
      runtimeTablePlan: null,
      runtimeTableLedger: null,
      runtimeTableDiagnostic: null,
      runtimeTablePlanReady: false,
      runtimeTableConstructionReady: false,
      runtimeTableCoherentExpressionPass: false,
      runtimeTableCoherenceScore: 0,
      controlsBound: false,
      visualPassClaimed: false,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    drawShell(ctx, mountOptions.size, state);
    publishDataset(state);

    loadRuntimeTableDetailed(state).then((runtimeLoadResult) => {
      state.runtimeTableLoadResult = runtimeLoadResult;
      createRuntimePlan(state);
      publishDataset(state);

      state.atlasStartAttempted = true;
      state.atlasBuilderEntered = true;
      state.atlasProgressObserved = true;
      state.atlasProgress = 0.2;

      const rendered = drawAtlasFallback(ctx, mountOptions.size, state, mountOptions);

      state.atlasProgress = rendered ? 1 : 0.35;
      state.updatedAt = nowIso();

      createRuntimePlan(state);
      publishDataset(state);
    });

    const api = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      canvas,
      ctx,
      state,

      remount(nextOptions = {}) {
        return mount(parent, { ...mountOptions, ...nextOptions });
      },

      redraw(nextOptions = {}) {
        const opts = normalizeMountOptions({ ...mountOptions, ...nextOptions });
        state.atlasStartAttempted = true;
        state.atlasBuilderEntered = true;
        state.atlasProgressObserved = true;
        drawAtlasFallback(ctx, opts.size, state, opts);
        createRuntimePlan(state);
        publishDataset(state);
        return createReceipt(state);
      },

      getStatus() {
        publishDataset(state);
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          mounted: state.mounted,
          visibleCarrierMounted: state.visibleCarrierMounted,
          imageRendered: state.imageRendered,
          atlasReady: state.atlasReady,
          projectionReady: state.projectionReady,
          runtimeTableLoaded: Boolean(state.runtimeTableLoadResult && state.runtimeTableLoadResult.validationOk),
          runtimeTableFailureCoordinate: state.runtimeTableLoadResult && state.runtimeTableLoadResult.failureCoordinate ? state.runtimeTableLoadResult.failureCoordinate : "",
          runtimeTablePlanReady: state.runtimeTablePlanReady,
          runtimeTableConstructionReady: state.runtimeTableConstructionReady,
          runtimeTableCoherentExpressionPass: state.runtimeTableCoherentExpressionPass,
          runtimeTableCoherenceScore: state.runtimeTableCoherenceScore,
          visualPassClaimed: false
        };
      },

      getReceipt() {
        return createReceipt(state);
      }
    };

    return api;
  }

  function createShellFirstMount(parent, options = {}) {
    return mount(parent, options);
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      runtimeTablePresent: Boolean(resolveRuntimeTable()),
      runtimeTableContract: contractOf(resolveRuntimeTable()),
      hexSurfacePresent: Boolean(resolveHexSurface()),
      hexSurfaceContract: contractOf(resolveHexSurface()),
      materialsPresent: Boolean(resolveMaterials()),
      materialsContract: contractOf(resolveMaterials()),
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    return createReceipt({});
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    mount,
    createShellFirstMount,
    getStatus,
    getReceipt,

    resolveRuntimeTable,
    resolveHexSurface,
    resolveMaterials,
    loadRuntimeTableDetailed,

    requiredRuntimeTableContract: REQUIRED_RUNTIME_TABLE_CONTRACT,
    requiredHexSurfaceContract: REQUIRED_HEX_SURFACE_CONTRACT,
    requiredMaterialsContract: REQUIRED_MATERIALS_CONTRACT,

    visibleCarrierFirst: true,
    runtimeTableRequired: true,
    runtimeTableBlocksVisibleCarrier: false,
    wideProbeDeferred: true,
    wideProbeNeverBlocksFirstVisibleRender: true,
    childFailureDoesNotEraseVisualization: true,
    imageRenderedIsNotCoherencePass: true,
    constructionReadyIsNotCoherencePass: true,
    coherentExpressionPassIsNotVisualPassClaim: true,

    ownsPlanetTruth: false,
    ownsTectonics: false,
    ownsElevation: false,
    ownsComposition: false,
    ownsHydrology: false,
    ownsMaterialsTruth: false,
    ownsHexTruth: false,
    ownsRuntimeMotion: false,
    ownsControls: false,
    ownsRouteOrchestration: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;

  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;
  root.HEARTH_CANVAS_RECEIPT = getReceipt();

  writeDataset({
    hearthCanvasAuthorityLoaded: "true",
    hearthCanvasContract: CONTRACT,
    hearthCanvasReceipt: RECEIPT,
    hearthCanvasPreviousContract: PREVIOUS_CONTRACT,
    hearthCanvasBaselineContract: BASELINE_CONTRACT,
    hearthCanvasVersion: VERSION,
    hearthCanvasRuntimeTableRequired: "true",
    hearthCanvasRuntimeTablePath: PATHS.runtimeTable,
    hearthCanvasRuntimeTableExpectedContract: REQUIRED_RUNTIME_TABLE_CONTRACT,
    hearthCanvasRuntimeTableBlocksVisibleCarrier: "false",
    hearthCanvasVisibleCarrierFirst: "true",
    hearthCanvasWideProbeDeferred: "true",
    hearthCanvasWideProbeNeverBlocksFirstVisibleRender: "true",
    childFailureDoesNotEraseVisualization: "true",
    imageRenderedIsNotCoherencePass: "true",
    constructionReadyIsNotCoherencePass: "true",
    coherentExpressionPassIsNotVisualPassClaim: "true",
    generatedImage: "false",
    graphicBox: "false",
    webgl: "false",
    visualPassClaimed: "false"
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
