// /assets/hearth/hearth.canvas.js
// HEARTH_WATER_CHANNEL_CACHE_KEY_AND_LOAD_PROOF_CANVAS_TNT_v4_4
// Full-file replacement.
// Canvas / mount / Runtime Table consumer / Triple G diagnostic consumer / loader-proof receipt authority only.
// Purpose:
// - Preserve shell-first nonblocking mount.
// - Preserve immediate thumb / pointer drag.
// - Preserve Runtime Table v2 compatibility and v1 fallback.
// - Preserve Triple G coherent-expression diagnostic consumption.
// - Preserve hidden / compact / expanded diagnostic receipt modes.
// - Preserve copyable plain-text diagnostic receipt export.
// - Add per-channel cache keys.
// - Add water channel loader proof by exact coordinate.
// - Prove whether water fails at request, load, global export, sample, coordinate, flags, Runtime Table, canvas multiplex, Triple G, or export.
// - Keep Construction Ready, Image Rendered, and Coherent Expression separate.
// - Decide no channel truth.
// Does not own:
// - Runtime Table canonical standard
// - Triple G diagnostic canonical standard
// - water truth
// - land truth
// - air truth
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology classification
// - material palette authority
// - ocean authority generation
// - route orchestration
// - runtime motion authority
// - external controls authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_WATER_CHANNEL_CACHE_KEY_AND_LOAD_PROOF_CANVAS_TNT_v4_4";
  const RECEIPT = "HEARTH_WATER_CHANNEL_CACHE_KEY_AND_LOAD_PROOF_CANVAS_RECEIPT_v4_4";
  const PREVIOUS_CONTRACT = "HEARTH_TRIPLE_G_RECEIPT_VISIBILITY_AND_COPY_EXPORT_CANVAS_TNT_v4_3";
  const VERSION = "2026-05-29.hearth-water-channel-cache-key-load-proof-canvas-v4-4";

  const LAB_RUNTIME_TABLE_PATH = "/assets/lab/runtime-table.js";
  const LAB_RUNTIME_TABLE_CONTRACT_V1 = "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1";
  const LAB_RUNTIME_TABLE_CONTRACT_V2 = "LAB_RUNTIME_TABLE_AND_TRIPLE_G_COHERENCE_DIAGNOSTIC_STANDARD_TNT_v2";
  const LAB_RUNTIME_TABLE_CONTRACT = LAB_RUNTIME_TABLE_CONTRACT_V2;
  const LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS = Object.freeze([
    LAB_RUNTIME_TABLE_CONTRACT_V2,
    LAB_RUNTIME_TABLE_CONTRACT_V1
  ]);

  const LAND_CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const WATER_CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const AIR_CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";

  const RECEIPT_MODES = Object.freeze({
    HIDDEN: "hidden",
    COMPACT: "compact",
    EXPANDED: "expanded"
  });

  const CHANNEL_CACHE_KEYS = Object.freeze({
    land: "hearth-land-channel-active-v1",
    water: "hearth-water-channel-load-export-v1",
    air: "hearth-air-channel-active-v1"
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

  const SHARED_RUNTIME_TABLE_SAMPLE_POINT = Object.freeze({
    u: 0.5,
    v: 0.5,
    x: 0,
    y: 0,
    z: 1
  });

  const CHANNEL_FILES = Object.freeze([
    {
      key: "land",
      label: "Land channel",
      path: "/assets/hearth/hearth.land.channel.js",
      contract: LAND_CONTRACT,
      globalName: "HEARTH_LAND_CHANNEL"
    },
    {
      key: "water",
      label: "Water channel",
      path: "/assets/hearth/hearth.water.channel.js",
      contract: WATER_CONTRACT,
      globalName: "HEARTH_WATER_CHANNEL"
    },
    {
      key: "air",
      label: "Air channel",
      path: "/assets/hearth/hearth.air.channel.js",
      contract: AIR_CONTRACT,
      globalName: "HEARTH_AIR_CHANNEL"
    }
  ]);

  const ALLOWED_HANDOFFS = Object.freeze([
    "FULL_PASS",
    "OPTIMIZED_PASS",
    "DEGRADED_PASS",
    "FALLBACK_PASS"
  ]);

  const COLORS = Object.freeze({
    shellDark: [5, 9, 19],
    shellMid: [16, 31, 48],
    shellLight: [62, 84, 92],
    land: [92, 86, 58],
    water: [8, 35, 86],
    air: [150, 190, 210],
    rim: [174, 216, 236],
    atmosphere: [20, 32, 48],
    shadow: [2, 5, 12],
    transparent: [0, 0, 0]
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function mixNumber(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      clamp(Math.round(mixNumber(a[0], b[0], k)), 0, 255),
      clamp(Math.round(mixNumber(a[1], b[1], k)), 0, 255),
      clamp(Math.round(mixNumber(a[2], b[2], k)), 0, 255)
    ];
  }

  function scaleColor(rgb, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(rgb[0] * s), 0, 255),
      clamp(Math.round(rgb[1] * s), 0, 255),
      clamp(Math.round(rgb[2] * s), 0, 255)
    ];
  }

  function normalize3(p) {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function vectorToLonLat(p) {
    const n = normalize3(p);
    return {
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
    };
  }

  function lonToU(lon) {
    return wrap01((Number(lon) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - Number(lat)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp(Number(v), 0, 1) * 180;
  }

  function rotateY(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: p.x * c + p.z * s,
      y: p.y,
      z: -p.x * s + p.z * c
    };
  }

  function rotateX(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: p.x,
      y: p.y * c - p.z * s,
      z: p.y * s + p.z * c
    };
  }

  function rotateForView(p, rotationLon, rotationLat) {
    return normalize3(rotateY(rotateX(p, rotationLat), rotationLon));
  }

  function spherePixelToVector(x, y, width, height) {
    const size = Math.min(width, height);
    const cx = (width - 1) / 2;
    const cy = (height - 1) / 2;
    const radius = size * 0.5 * 0.985;

    const dx = (x - cx) / radius;
    const dy = (y - cy) / radius;
    const rr = dx * dx + dy * dy;

    if (rr > 1) {
      return {
        inside: false,
        edgeAlpha: 0,
        radial: Math.sqrt(rr),
        vector: { x: 0, y: 0, z: 1 }
      };
    }

    const radial = Math.sqrt(rr);
    const z = Math.sqrt(Math.max(0, 1 - rr));

    return {
      inside: true,
      edgeAlpha: clamp01((1 - radial) / 0.025),
      radial,
      vector: normalize3({
        x: dx,
        y: -dy,
        z
      })
    };
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        return lonLatToVector(uToLon(p.u), vToLat(p.v));
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        return lonLatToVector(Number(p.lon), Number(p.lat));
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        return lonLatToVector(Number(p.longitude), Number(p.latitude));
      }

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        return normalize3(p);
      }
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(Number(args[0]), Number(args[1]));
    return lonLatToVector(0, 0);
  }

  function colorField(source, keys, fallback) {
    for (const key of keys) {
      const value = source && source[key];

      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((v) => Number.isFinite(Number(v)))
      ) {
        return [
          clamp(Math.round(Number(value[0])), 0, 255),
          clamp(Math.round(Number(value[1])), 0, 255),
          clamp(Math.round(Number(value[2])), 0, 255)
        ];
      }
    }

    return fallback.slice();
  }

  function numberField(source, key, fallback = 0) {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function boolField(source, key, fallback = false) {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stringifyForReceipt(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (_error) {
      return String(value);
    }
  }

  function datasetToObject(element) {
    const output = {};
    if (!element || !element.dataset) return output;

    Object.keys(element.dataset).forEach((key) => {
      output[key] = element.dataset[key];
    });

    return output;
  }

  function getDocumentRootDataset() {
    return root.document && root.document.documentElement
      ? datasetToObject(root.document.documentElement)
      : {};
  }

  function getRuntimeTableApi() {
    return (
      root.LAB_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null
    );
  }

  function runtimeTableContractAccepted(api) {
    return Boolean(api && LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.includes(api.contract));
  }

  function runtimeTableV2Available(api = getRuntimeTableApi()) {
    return Boolean(
      api &&
        api.contract === LAB_RUNTIME_TABLE_CONTRACT_V2 &&
        typeof api.runCoherenceDiagnostic === "function" &&
        typeof api.createHearthCoherenceDiagnostic === "function" &&
        typeof api.createGoalProfile === "function" &&
        api.COHERENCE_STATUS &&
        api.COHERENCE_CHECKS
    );
  }

  function getLandChannel() {
    return root.HEARTH_LAND_CHANNEL || root.HearthLandChannel || (root.HEARTH && root.HEARTH.landChannel) || null;
  }

  function getWaterChannel() {
    return root.HEARTH_WATER_CHANNEL || root.HearthWaterChannel || (root.HEARTH && root.HEARTH.waterChannel) || null;
  }

  function getAirChannel() {
    return root.HEARTH_AIR_CHANNEL || root.HearthAirChannel || (root.HEARTH && root.HEARTH.airChannel) || null;
  }

  function getChannelGlobal(item) {
    if (!item || !item.globalName) return null;
    return root[item.globalName] || null;
  }

  function getHandoffAllowed(handoff) {
    return ALLOWED_HANDOFFS.includes(String(handoff || ""));
  }

  function getPerChannelCacheKey(channelKey, options = {}) {
    if (options.perChannelCacheKeys && options.perChannelCacheKeys[channelKey]) {
      return String(options.perChannelCacheKeys[channelKey]);
    }

    const optionKey = `${channelKey}ChannelCacheKey`;

    if (options[optionKey]) {
      return String(options[optionKey]);
    }

    return CHANNEL_CACHE_KEYS[channelKey] || options.channelCacheKey || `hearth-channel-${channelKey}-v4-4`;
  }

  function buildScriptSrc(src, cacheKey) {
    const joiner = src.includes("?") ? "&" : "?";
    return `${src}${joiner}v=${encodeURIComponent(cacheKey || VERSION)}`;
  }

  function loadScriptOnce(src, marker, validate, cacheKey) {
    return new Promise((resolve) => {
      const requestedSrc = buildScriptSrc(src, cacheKey);

      if (typeof validate === "function" && validate()) {
        resolve({
          requested: true,
          loaded: true,
          alreadyPresent: true,
          src,
          requestedSrc,
          cacheKey,
          error: ""
        });
        return;
      }

      if (!root.document || !root.document.head) {
        resolve({
          requested: false,
          loaded: false,
          src,
          requestedSrc,
          cacheKey,
          error: "document unavailable"
        });
        return;
      }

      const existing = root.document.querySelector(`script[data-hearth-loader-marker="${marker}"]`);

      if (existing && typeof validate === "function" && !validate()) {
        existing.remove();
      } else if (existing) {
        existing.addEventListener("load", () => {
          resolve({
            requested: true,
            loaded: Boolean(validate && validate()),
            existing: true,
            src,
            requestedSrc: existing.src || requestedSrc,
            cacheKey,
            error: ""
          });
        }, { once: true });

        existing.addEventListener("error", () => {
          resolve({
            requested: true,
            loaded: false,
            existing: true,
            src,
            requestedSrc: existing.src || requestedSrc,
            cacheKey,
            error: "load-error"
          });
        }, { once: true });

        setTimeout(() => {
          resolve({
            requested: true,
            loaded: Boolean(validate && validate()),
            existing: true,
            timeoutCheck: true,
            src,
            requestedSrc: existing.src || requestedSrc,
            cacheKey,
            error: Boolean(validate && validate()) ? "" : "existing-script-validation-failed"
          });
        }, 160);

        return;
      }

      const script = root.document.createElement("script");
      script.src = requestedSrc;
      script.defer = true;
      script.dataset.hearthLoaderMarker = marker;
      script.dataset.hearthCanvasContract = CONTRACT;
      script.dataset.hearthCanvasReceipt = RECEIPT;
      script.dataset.hearthScriptCacheKey = cacheKey || "";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      script.onload = () => {
        resolve({
          requested: true,
          loaded: Boolean(validate && validate()),
          src,
          requestedSrc,
          cacheKey,
          error: Boolean(validate && validate()) ? "" : "loaded-but-validation-failed"
        });
      };

      script.onerror = () => {
        resolve({
          requested: true,
          loaded: false,
          src,
          requestedSrc,
          cacheKey,
          error: "load-error"
        });
      };

      root.document.head.appendChild(script);
    });
  }

  function loadChannelScriptWithProof(item, options = {}) {
    const cacheKey = getPerChannelCacheKey(item.key, options);
    const marker = `hearth-${item.key}-channel`;
    const scriptPath = item.path;
    const expectedContract = item.contract;

    const validate = () => {
      const channel = getChannelGlobal(item);
      return Boolean(channel && channel.contract === expectedContract);
    };

    return loadScriptOnce(scriptPath, marker, validate, cacheKey).then((result) => {
      const globalObject = getChannelGlobal(item);
      const actualContract = globalObject && globalObject.contract ? String(globalObject.contract) : "";
      const globalPresent = Boolean(globalObject);
      const contractOk = actualContract === expectedContract;

      return {
        key: item.key,
        label: item.label,
        path: item.path,
        scriptPath,
        scriptCacheKey: cacheKey,
        requestedSrc: result.requestedSrc || buildScriptSrc(scriptPath, cacheKey),
        expectedContract,
        actualContract,
        requested: Boolean(result.requested),
        loaded: Boolean(result.loaded),
        alreadyPresent: Boolean(result.alreadyPresent),
        existing: Boolean(result.existing),
        timeoutCheck: Boolean(result.timeoutCheck),
        error: result.error || "",
        globalName: item.globalName,
        globalPresent,
        contractOk,
        validationOk: Boolean(globalPresent && contractOk),
        at: nowIso()
      };
    });
  }

  function finiteCoordinatePacket(packet) {
    return Boolean(
      packet &&
        Number.isFinite(Number(packet.u)) &&
        Number.isFinite(Number(packet.v)) &&
        Number.isFinite(Number(packet.x)) &&
        Number.isFinite(Number(packet.y)) &&
        Number.isFinite(Number(packet.z))
    );
  }

  function probeWaterChannel() {
    const water = getWaterChannel();
    const proof = {
      waterExpectedContract: WATER_CONTRACT,
      waterGlobalPresent: Boolean(water),
      waterActualContract: water && water.contract ? String(water.contract) : "",
      waterSampleProbeOk: false,
      waterSampleProbeContract: "",
      waterSampleProbeCoordinatesOk: false,
      waterSampleProbeFlagsOk: false,
      waterSampleProbeError: "",
      waterSampleProbeValue: null,
      at: nowIso()
    };

    if (!water) {
      proof.waterSampleProbeError = "HEARTH_WATER_CHANNEL global missing.";
      return proof;
    }

    if (typeof water.sample !== "function") {
      proof.waterSampleProbeError = "HEARTH_WATER_CHANNEL.sample is not a function.";
      return proof;
    }

    try {
      const samplePacket = water.sample(SHARED_RUNTIME_TABLE_SAMPLE_POINT);
      proof.waterSampleProbeValue = samplePacket || null;
      proof.waterSampleProbeOk = Boolean(samplePacket && typeof samplePacket === "object");
      proof.waterSampleProbeContract = samplePacket && samplePacket.contract ? String(samplePacket.contract) : "";
      proof.waterSampleProbeCoordinatesOk = finiteCoordinatePacket(samplePacket);
      proof.waterSampleProbeFlagsOk = Boolean(
        samplePacket &&
          samplePacket.isWaterChannel === true &&
          samplePacket.allowedToFloat === false &&
          samplePacket.bodyBound === true &&
          samplePacket.surfaceBound === true
      );

      if (!proof.waterSampleProbeOk) {
        proof.waterSampleProbeError = "sample returned no object packet.";
      } else if (proof.waterSampleProbeContract !== WATER_CONTRACT) {
        proof.waterSampleProbeError = `sample contract mismatch: ${proof.waterSampleProbeContract || "missing"}`;
      } else if (!proof.waterSampleProbeCoordinatesOk) {
        proof.waterSampleProbeError = "sample missing finite u/v/x/y/z coordinates.";
      } else if (!proof.waterSampleProbeFlagsOk) {
        proof.waterSampleProbeError = "sample water authority flags invalid.";
      }
    } catch (error) {
      proof.waterSampleProbeError = error && error.message ? error.message : String(error);
    }

    return proof;
  }

  function updateChannelLoadProof(api, channelResults = []) {
    if (!api || !api.state) return;

    const state = api.state;
    const canvas = api.canvas || null;
    const byKey = {};

    channelResults.forEach((result) => {
      if (result && result.key) byKey[result.key] = result;
    });

    const land = byKey.land || null;
    const water = byKey.water || null;
    const air = byKey.air || null;
    const waterProof = probeWaterChannel();

    state.channelLoadResults = channelResults.slice();
    state.landLoadResult = land;
    state.waterLoadResult = water;
    state.airLoadResult = air;

    state.waterScriptRequested = Boolean(water && water.requested);
    state.waterScriptLoaded = Boolean(water && water.loaded);
    state.waterScriptPath = water ? water.scriptPath : "/assets/hearth/hearth.water.channel.js";
    state.waterScriptCacheKey = water ? water.scriptCacheKey : CHANNEL_CACHE_KEYS.water;
    state.waterScriptError = water && water.error ? water.error : "";

    state.waterGlobalPresent = waterProof.waterGlobalPresent;
    state.waterActualContract = waterProof.waterActualContract;
    state.waterExpectedContract = waterProof.waterExpectedContract;

    state.waterSampleProbeOk = waterProof.waterSampleProbeOk;
    state.waterSampleProbeContract = waterProof.waterSampleProbeContract;
    state.waterSampleProbeCoordinatesOk = waterProof.waterSampleProbeCoordinatesOk;
    state.waterSampleProbeFlagsOk = waterProof.waterSampleProbeFlagsOk;
    state.waterSampleProbeError = waterProof.waterSampleProbeError;
    state.waterSampleProbeValue = waterProof.waterSampleProbeValue;

    state.channelLoadProofReady = true;

    if (canvas) {
      canvas.dataset.hearthChannelLoadProofReady = "true";
      canvas.dataset.hearthWaterScriptRequested = String(state.waterScriptRequested);
      canvas.dataset.hearthWaterScriptLoaded = String(state.waterScriptLoaded);
      canvas.dataset.hearthWaterScriptPath = state.waterScriptPath || "";
      canvas.dataset.hearthWaterScriptCacheKey = state.waterScriptCacheKey || "";
      canvas.dataset.hearthWaterScriptError = state.waterScriptError || "";
      canvas.dataset.hearthWaterGlobalPresent = String(state.waterGlobalPresent);
      canvas.dataset.hearthWaterActualContract = state.waterActualContract || "";
      canvas.dataset.hearthWaterExpectedContract = state.waterExpectedContract || WATER_CONTRACT;
      canvas.dataset.hearthWaterSampleProbeOk = String(state.waterSampleProbeOk);
      canvas.dataset.hearthWaterSampleProbeContract = state.waterSampleProbeContract || "";
      canvas.dataset.hearthWaterSampleProbeCoordinatesOk = String(state.waterSampleProbeCoordinatesOk);
      canvas.dataset.hearthWaterSampleProbeFlagsOk = String(state.waterSampleProbeFlagsOk);
      canvas.dataset.hearthWaterSampleProbeError = state.waterSampleProbeError || "";
    }

    if (root.document && root.document.documentElement) {
      root.document.documentElement.dataset.hearthChannelLoadProofReady = "true";
      root.document.documentElement.dataset.hearthWaterScriptRequested = String(state.waterScriptRequested);
      root.document.documentElement.dataset.hearthWaterScriptLoaded = String(state.waterScriptLoaded);
      root.document.documentElement.dataset.hearthWaterScriptPath = state.waterScriptPath || "";
      root.document.documentElement.dataset.hearthWaterScriptCacheKey = state.waterScriptCacheKey || "";
      root.document.documentElement.dataset.hearthWaterScriptError = state.waterScriptError || "";
      root.document.documentElement.dataset.hearthWaterGlobalPresent = String(state.waterGlobalPresent);
      root.document.documentElement.dataset.hearthWaterActualContract = state.waterActualContract || "";
      root.document.documentElement.dataset.hearthWaterExpectedContract = state.waterExpectedContract || WATER_CONTRACT;
      root.document.documentElement.dataset.hearthWaterSampleProbeOk = String(state.waterSampleProbeOk);
      root.document.documentElement.dataset.hearthWaterSampleProbeContract = state.waterSampleProbeContract || "";
      root.document.documentElement.dataset.hearthWaterSampleProbeCoordinatesOk = String(state.waterSampleProbeCoordinatesOk);
      root.document.documentElement.dataset.hearthWaterSampleProbeFlagsOk = String(state.waterSampleProbeFlagsOk);
      root.document.documentElement.dataset.hearthWaterSampleProbeError = state.waterSampleProbeError || "";
    }
  }

  function formatChannelLoadProof(api) {
    const state = api && api.state ? api.state : {};
    const lines = [];

    if (!state.channelLoadProofReady) return lines;

    if (state.waterScriptLoaded && state.waterGlobalPresent && state.waterSampleProbeOk && state.waterSampleProbeCoordinatesOk && state.waterSampleProbeFlagsOk) {
      lines.push(`Water loader: valid · ${state.waterActualContract || "contract-present"}`);
      return lines;
    }

    if (!state.waterScriptRequested) {
      lines.push("Water loader: script was not requested.");
      return lines;
    }

    if (!state.waterScriptLoaded) {
      lines.push(`Water loader: script did not validate/load · ${state.waterScriptError || "unknown error"}`);
      return lines;
    }

    if (!state.waterGlobalPresent) {
      lines.push("Water loader: script loaded but HEARTH_WATER_CHANNEL global is missing.");
      return lines;
    }

    if (state.waterActualContract !== WATER_CONTRACT) {
      lines.push(`Water loader: wrong contract · ${state.waterActualContract || "missing"}`);
      return lines;
    }

    if (!state.waterSampleProbeOk) {
      lines.push(`Water loader: sample failed · ${state.waterSampleProbeError || "unknown sample error"}`);
      return lines;
    }

    if (!state.waterSampleProbeCoordinatesOk) {
      lines.push("Water loader: sample coordinates invalid.");
    }

    if (!state.waterSampleProbeFlagsOk) {
      lines.push("Water loader: sample flags invalid.");
    }

    return lines;
  }

  function callChannel(authority, args, p) {
    if (!authority) return null;

    const ll = vectorToLonLat(p);
    const fallbackArg = {
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      x: p.x,
      y: p.y,
      z: p.z,
      lon: ll.lon,
      lat: ll.lat
    };

    const methods = ["sample", "read"];

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const result = authority[method].apply(authority, args);
        if (result && typeof result === "object") return result;
      } catch (_error) {
        try {
          const result = authority[method].call(authority, fallbackArg);
          if (result && typeof result === "object") return result;
        } catch (_error2) {}
      }
    }

    return null;
  }

  function fallbackLand(p) {
    const ll = vectorToLonLat(p);
    const landShape = clamp01(0.42 + Math.sin((ll.lon + 35) * DEG) * 0.18 + Math.cos(ll.lat * DEG * 2) * 0.10);
    const landAlpha = landShape > 0.48 ? 0.42 : 0.05;

    return {
      channel: "land",
      channelClass: landAlpha > 0.2 ? "fallback-body-bound-land" : "fallback-low-land",
      rgb: mixColor(COLORS.land, COLORS.shellMid, 1 - landAlpha),
      color: mixColor(COLORS.land, COLORS.shellMid, 1 - landAlpha),
      alpha: landAlpha,
      landAlpha,
      landPresence: landAlpha,
      bodyBinding: landAlpha,
      surfaceAttachment: landAlpha,
      atmosphericRejection: landAlpha,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      isLandChannel: true,
      contract: "FALLBACK_LAND_CHANNEL"
    };
  }

  function fallbackWater(p) {
    const waterShape = clamp01(0.36 + (p.z < 0.16 ? 0.36 : 0) + Math.cos(p.x * 7) * 0.06);
    const waterAlpha = p.z < 0.24 ? clamp01(waterShape * 0.52) : 0.03;

    return {
      channel: "water",
      channelClass: waterAlpha > 0.2 ? "fallback-surface-water" : "fallback-low-water",
      rgb: mixColor(COLORS.water, COLORS.shellDark, 1 - waterAlpha),
      color: mixColor(COLORS.water, COLORS.shellDark, 1 - waterAlpha),
      alpha: waterAlpha,
      waterAlpha,
      waterPresence: waterAlpha,
      hydrosphereBinding: waterAlpha,
      surfaceSeat: waterAlpha,
      depthBinding: waterAlpha * 0.8,
      atmosphericRejection: waterAlpha,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      isWaterChannel: true,
      contract: "FALLBACK_WATER_CHANNEL"
    };
  }

  function fallbackAir(p) {
    const limb = clamp01(1 - Math.abs(p.z));
    const airAlpha = clamp01(limb * 0.12);

    return {
      channel: "air",
      channelClass: "fallback-rim-air",
      rgb: COLORS.air.slice(),
      color: COLORS.air.slice(),
      alpha: airAlpha,
      airAlpha,
      airPresence: airAlpha,
      atmosphereSeparation: airAlpha,
      humidity: 0.16,
      airPressure: 0.52,
      barometricPressure: 0.52,
      barometricGradient: 0.08,
      rimHaze: limb,
      limbAtmosphere: limb,
      floatsAboveBody: true,
      allowedToFloat: true,
      bodyBound: false,
      surfaceBound: false,
      mayDefineLand: false,
      mayDefineWater: false,
      isAirChannel: true,
      contract: "FALLBACK_AIR_CHANNEL"
    };
  }

  function coordinateDefaults(p) {
    const ll = vectorToLonLat(p);

    return {
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      lon: ll.lon,
      lat: ll.lat,
      x: p.x,
      y: p.y,
      z: p.z
    };
  }

  function normalizeLand(raw, p) {
    const fallback = fallbackLand(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "landRgb"], fallback.rgb);
    const coords = coordinateDefaults(p);

    return {
      ...fallback,
      ...source,
      ...coords,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "landAlpha", fallback.alpha))),
      landAlpha: clamp01(numberField(source, "landAlpha", numberField(source, "landPresence", fallback.landAlpha))),
      bodyBinding: clamp01(numberField(source, "bodyBinding", boolField(source, "bodyBound", true) ? 1 : fallback.bodyBinding)),
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", boolField(source, "surfaceBound", true) ? 1 : fallback.surfaceAttachment)),
      atmosphericRejection: clamp01(numberField(source, "atmosphericRejection", fallback.atmosphericRejection)),
      bodyBound: boolField(source, "bodyBound", true),
      surfaceBound: boolField(source, "surfaceBound", true),
      floatsAboveBody: false,
      allowedToFloat: false,
      isLandChannel: true,
      contract: source.contract || source.sourceContract || fallback.contract
    };
  }

  function normalizeWater(raw, p) {
    const fallback = fallbackWater(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "waterRgb", "oceanRgb"], fallback.rgb);
    const coords = coordinateDefaults(p);

    return {
      ...fallback,
      ...source,
      ...coords,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "waterAlpha", fallback.alpha))),
      waterAlpha: clamp01(numberField(source, "waterAlpha", numberField(source, "waterPresence", fallback.waterAlpha))),
      hydrosphereBinding: clamp01(numberField(source, "hydrosphereBinding", boolField(source, "bodyBound", true) ? 1 : fallback.hydrosphereBinding)),
      surfaceSeat: clamp01(numberField(source, "surfaceSeat", boolField(source, "surfaceBound", true) ? 1 : fallback.surfaceSeat)),
      depthBinding: clamp01(numberField(source, "depthBinding", fallback.depthBinding)),
      atmosphericRejection: clamp01(numberField(source, "atmosphericRejection", fallback.atmosphericRejection)),
      bodyBound: boolField(source, "bodyBound", true),
      surfaceBound: boolField(source, "surfaceBound", true),
      floatsAboveBody: false,
      allowedToFloat: false,
      isWaterChannel: true,
      contract: source.contract || source.sourceContract || fallback.contract
    };
  }

  function normalizeAir(raw, p) {
    const fallback = fallbackAir(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "airRgb", "atmosphereRgb"], fallback.rgb);
    const coords = coordinateDefaults(p);

    return {
      ...fallback,
      ...source,
      ...coords,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "airAlpha", fallback.alpha))),
      airAlpha: clamp01(numberField(source, "airAlpha", numberField(source, "airPresence", fallback.airAlpha))),
      atmosphereSeparation: clamp01(numberField(source, "atmosphereSeparation", fallback.atmosphereSeparation)),
      humidity: clamp01(numberField(source, "humidity", fallback.humidity)),
      airPressure: clamp01(numberField(source, "airPressure", fallback.airPressure)),
      barometricPressure: clamp01(numberField(source, "barometricPressure", fallback.barometricPressure)),
      barometricGradient: clamp01(numberField(source, "barometricGradient", fallback.barometricGradient)),
      rimHaze: clamp01(numberField(source, "rimHaze", fallback.rimHaze)),
      limbAtmosphere: clamp01(numberField(source, "limbAtmosphere", fallback.limbAtmosphere)),
      floatsAboveBody: true,
      allowedToFloat: true,
      bodyBound: false,
      surfaceBound: false,
      mayDefineLand: false,
      mayDefineWater: false,
      isAirChannel: true,
      contract: source.contract || source.sourceContract || fallback.contract
    };
  }

  function composeChannels(land, water, air, p) {
    let rgb = COLORS.shellMid.slice();

    const landWeight = clamp01(land.landAlpha * (0.72 + land.bodyBinding * 0.24 + land.surfaceAttachment * 0.12));
    const waterWeight = clamp01(water.waterAlpha * (0.68 + water.hydrosphereBinding * 0.22 + water.depthBinding * 0.12));
    const airWeight = clamp01(air.airAlpha * (0.28 + air.atmosphereSeparation * 0.18 + air.rimHaze * 0.12));

    if (landWeight > 0.01) rgb = mixColor(rgb, land.rgb, landWeight);
    if (waterWeight > 0.01) rgb = mixColor(rgb, water.rgb, waterWeight);
    if (airWeight > 0.01) rgb = mixColor(rgb, air.rgb, airWeight);

    const light = normalize3({ x: -0.34, y: 0.42, z: 0.83 });
    const illumination = clamp01(0.66 + dot3(p, light) * 0.30);
    const bodyLock = clamp01(
      land.bodyBinding * 0.34 +
        land.surfaceAttachment * 0.20 +
        water.hydrosphereBinding * 0.26 +
        water.surfaceSeat * 0.12 +
        0.08
    );

    rgb = scaleColor(rgb, clamp01(0.76 + illumination * 0.22 + bodyLock * 0.08));

    return {
      rgb,
      alpha: clamp01(0.96 + airWeight * 0.04),
      landWeight,
      waterWeight,
      airWeight,
      bodyLock
    };
  }

  function multiplexSample(...args) {
    const p = parseInput(...args);
    const coords = coordinateDefaults(p);

    const land = normalizeLand(callChannel(getLandChannel(), args, p), p);
    const water = normalizeWater(callChannel(getWaterChannel(), args, p), p);
    const air = normalizeAir(callChannel(getAirChannel(), args, p), p);
    const composed = composeChannels(land, water, air, p);
    const runtimeApi = getRuntimeTableApi();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "hearth-water-channel-cache-key-load-proof-canvas",
      ...coords,

      runtimeTableConsumed: Boolean(runtimeApi),
      runtimeTableContract: runtimeApi && runtimeApi.contract ? runtimeApi.contract : "",
      preferredRuntimeTableContract: LAB_RUNTIME_TABLE_CONTRACT_V2,
      runtimeTableAcceptedContracts: LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.slice(),
      runtimeTableCanonicalOwner: "Dexter Lab",
      tripleGDiagnosticAvailable: runtimeTableV2Available(),
      channelMultiplexReady: Boolean(getLandChannel() && getWaterChannel() && getAirChannel()),
      semiconductorOutlet: true,
      canvasDecidesNothing: true,

      rgb: composed.rgb,
      color: composed.rgb,
      alpha: composed.alpha,

      land,
      water,
      air,

      landChannelLoaded: Boolean(getLandChannel()),
      waterChannelLoaded: Boolean(getWaterChannel()),
      airChannelLoaded: Boolean(getAirChannel()),

      landWeight: composed.landWeight,
      waterWeight: composed.waterWeight,
      airWeight: composed.airWeight,
      bodyLock: composed.bodyLock,

      compositeOrder: "planet-body-shell → land-channel → water-channel → air-channel → rim-lighting",
      constructionReadyIsNotCoherencePass: true,
      imageRenderedIsNotCoherencePass: true,
      landFloatsAboveBody: false,
      waterFloatsAboveBody: false,
      airFloatsAboveBody: true,

      ownsRuntimeTableStandard: false,
      ownsTripleGDiagnosticStandard: false,
      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsAirTruth: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const sample = (...args) => multiplexSample(...args);
  const read = (...args) => multiplexSample(...args);
  const compose = (...args) => multiplexSample(...args);
  const composeSample = (...args) => multiplexSample(...args);
  const composePixel = (...args) => multiplexSample(...args);
  const getPixel = (...args) => multiplexSample(...args);
  const getColor = (...args) => multiplexSample(...args).rgb;

  function createShellCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth shell canvas requires document.createElement.");
    }

    const requestedSize = Number.isFinite(Number(options.size))
      ? Math.round(Number(options.size))
      : Number.isFinite(Number(options.width))
        ? Math.round(Number(options.width))
        : 420;

    const size = clamp(requestedSize, 240, options.allowLargeTexture === true ? 720 : 520);
    const canvas = root.document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;
    canvas.className = options.className || "hearth-canvas-texture hearth-canvas-contained-sphere hearth-canvas-water-loader-proof-v4-4";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.cursor = "grab";

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthCanvasShellFirst = "true";
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.hearthCanvasDecidesNothing = "true";
    canvas.dataset.hearthRuntimeTablePrewired = "true";
    canvas.dataset.hearthTripleGCoherencePrewired = "true";
    canvas.dataset.hearthRuntimeTableContract = LAB_RUNTIME_TABLE_CONTRACT;
    canvas.dataset.hearthRuntimeTableAcceptedContracts = LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.join(",");
    canvas.dataset.hearthRuntimeTableLoaded = "false";
    canvas.dataset.hearthRuntimeTableRuntimeAllowed = "false";
    canvas.dataset.hearthRuntimeTableSet = "false";
    canvas.dataset.hearthRuntimeTableLedgerReady = "false";
    canvas.dataset.hearthRuntimeTableHandoff = "PENDING";
    canvas.dataset.hearthTripleGDiagnosticAvailable = "false";
    canvas.dataset.hearthTripleGDiagnosticContract = "";
    canvas.dataset.hearthTripleGCoherenceChecked = "false";
    canvas.dataset.hearthTripleGCoherenceStatus = "PENDING";
    canvas.dataset.hearthTripleGCoherenceScore = "0";
    canvas.dataset.hearthTripleGCoherentExpressionPass = "false";
    canvas.dataset.hearthTripleGFailedCheckpoints = "";
    canvas.dataset.hearthTripleGRenewalTargets = "";
    canvas.dataset.hearthConstructionReadyIsNotCoherencePass = "true";
    canvas.dataset.hearthImageRenderedIsNotCoherencePass = "true";
    canvas.dataset.hearthCanvasImageRendered = "false";
    canvas.dataset.hearthCanvasChannelMultiplexReady = "false";
    canvas.dataset.hearthCanvasInteractiveShellMounted = "true";
    canvas.dataset.hearthCanvasCachedAtlasProjection = "pending";
    canvas.dataset.hearthCanvasInteractiveProjection = "true";
    canvas.dataset.hearthCanvasControlsBound = "false";
    canvas.dataset.hearthCanvasAtlasReady = "false";
    canvas.dataset.hearthCanvasAtlasBuilding = "false";
    canvas.dataset.hearthCanvasAtlasProgress = "0";
    canvas.dataset.hearthCanvasSphereContainment = "true";
    canvas.dataset.hearthCanvasNoRectangularTextureSpill = "true";
    canvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    canvas.dataset.hearthReceiptMode = RECEIPT_MODES.COMPACT;
    canvas.dataset.hearthReceiptVisible = "true";
    canvas.dataset.hearthReceiptExpanded = "false";
    canvas.dataset.hearthDiagnosticExportAvailable = "false";
    canvas.dataset.hearthDiagnosticExportCopied = "false";
    canvas.dataset.hearthDiagnosticExportLength = "0";
    canvas.dataset.hearthDiagnosticExportError = "";

    canvas.dataset.hearthChannelLoadProofReady = "false";
    canvas.dataset.hearthWaterScriptRequested = "false";
    canvas.dataset.hearthWaterScriptLoaded = "false";
    canvas.dataset.hearthWaterScriptPath = "/assets/hearth/hearth.water.channel.js";
    canvas.dataset.hearthWaterScriptCacheKey = CHANNEL_CACHE_KEYS.water;
    canvas.dataset.hearthWaterScriptError = "";
    canvas.dataset.hearthWaterGlobalPresent = "false";
    canvas.dataset.hearthWaterActualContract = "";
    canvas.dataset.hearthWaterExpectedContract = WATER_CONTRACT;
    canvas.dataset.hearthWaterSampleProbeOk = "false";
    canvas.dataset.hearthWaterSampleProbeContract = "";
    canvas.dataset.hearthWaterSampleProbeCoordinatesOk = "false";
    canvas.dataset.hearthWaterSampleProbeFlagsOk = "false";
    canvas.dataset.hearthWaterSampleProbeError = "";

    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function createLoadingPanel() {
    const panel = root.document.createElement("aside");

    panel.dataset.hearthRuntimeLoadingPanel = "true";
    panel.dataset.hearthFormationPanel = "true";
    panel.dataset.hearthTripleGCoherencePanel = "true";
    panel.dataset.hearthReceiptPanel = "true";
    panel.dataset.hearthChannelLoadProofPanel = "true";
    panel.style.position = "absolute";
    panel.style.left = "50%";
    panel.style.bottom = "14px";
    panel.style.transform = "translateX(-50%)";
    panel.style.width = "min(92%, 560px)";
    panel.style.maxHeight = "58%";
    panel.style.overflow = "auto";
    panel.style.padding = "12px 14px";
    panel.style.border = "1px solid rgba(174,216,236,.22)";
    panel.style.borderRadius = "16px";
    panel.style.background = "linear-gradient(180deg, rgba(5,9,19,.84), rgba(2,5,12,.76))";
    panel.style.backdropFilter = "blur(10px)";
    panel.style.boxShadow = "0 18px 50px rgba(0,0,0,.36)";
    panel.style.color = "rgba(238,246,255,.90)";
    panel.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    panel.style.fontSize = "11px";
    panel.style.lineHeight = "1.35";
    panel.style.pointerEvents = "auto";
    panel.style.zIndex = "4";

    return panel;
  }

  function syncReceiptDataset(api) {
    if (!api || !api.state) return;

    const state = api.state;
    const canvas = api.canvas || null;
    const mode = state.receiptMode || RECEIPT_MODES.COMPACT;

    state.receiptVisible = mode !== RECEIPT_MODES.HIDDEN;
    state.receiptExpanded = mode === RECEIPT_MODES.EXPANDED;

    if (canvas) {
      canvas.dataset.hearthReceiptMode = mode;
      canvas.dataset.hearthReceiptVisible = String(state.receiptVisible);
      canvas.dataset.hearthReceiptExpanded = String(state.receiptExpanded);
      canvas.dataset.hearthDiagnosticExportAvailable = String(Boolean(state.diagnosticExportAvailable));
      canvas.dataset.hearthDiagnosticExportCopied = String(Boolean(state.diagnosticExportCopied));
      canvas.dataset.hearthDiagnosticExportLength = String(state.diagnosticExportLength || 0);
      canvas.dataset.hearthDiagnosticExportError = state.diagnosticExportError || "";
    }

    if (root.document && root.document.documentElement) {
      root.document.documentElement.dataset.hearthReceiptMode = mode;
      root.document.documentElement.dataset.hearthReceiptVisible = String(state.receiptVisible);
      root.document.documentElement.dataset.hearthReceiptExpanded = String(state.receiptExpanded);
      root.document.documentElement.dataset.hearthDiagnosticExportAvailable = String(Boolean(state.diagnosticExportAvailable));
      root.document.documentElement.dataset.hearthDiagnosticExportCopied = String(Boolean(state.diagnosticExportCopied));
      root.document.documentElement.dataset.hearthDiagnosticExportLength = String(state.diagnosticExportLength || 0);
      root.document.documentElement.dataset.hearthDiagnosticExportError = state.diagnosticExportError || "";
    }
  }

  function setReceiptMode(api, mode) {
    if (!api || !api.state) return null;

    const allowed = Object.values(RECEIPT_MODES);
    api.state.receiptMode = allowed.includes(mode) ? mode : RECEIPT_MODES.COMPACT;
    api.state.receiptUserInteracted = true;

    syncReceiptDataset(api);
    renderLoadingPanel(api.loadingPanel, api.state, api);

    return api.state.receiptMode;
  }

  function toggleReceiptVisibility(api) {
    if (!api || !api.state) return null;
    return setReceiptMode(
      api,
      api.state.receiptMode === RECEIPT_MODES.HIDDEN ? RECEIPT_MODES.COMPACT : RECEIPT_MODES.HIDDEN
    );
  }

  function toggleReceiptExpansion(api) {
    if (!api || !api.state) return null;
    return setReceiptMode(
      api,
      api.state.receiptMode === RECEIPT_MODES.EXPANDED ? RECEIPT_MODES.COMPACT : RECEIPT_MODES.EXPANDED
    );
  }

  function getCoherenceReceipt(api) {
    const state = api && api.state ? api.state : {};

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "hearth-canvas-coherence-consumer-receipt",
      tripleGDiagnosticAvailable: runtimeTableV2Available(),
      tripleGDiagnosticContract: runtimeTableV2Available() ? LAB_RUNTIME_TABLE_CONTRACT_V2 : "",
      coherentExpressionChecked: Boolean(state.coherenceChecked),
      coherentExpressionPass: Boolean(state.coherentExpressionPass),
      coherenceStatus: state.coherenceStatus || "PENDING",
      coherenceScore: Number.isFinite(Number(state.coherenceScore)) ? Number(state.coherenceScore) : 0,
      failedCheckpoints: Array.isArray(state.failedCheckpoints) ? state.failedCheckpoints.slice() : [],
      renewalTargets: Array.isArray(state.renewalTargets) ? state.renewalTargets.slice() : [],
      constructionReady: Boolean(state.runtimeAllowed),
      imageRendered: Boolean(state.imageRendered),
      constructionReadyIsNotCoherencePass: true,
      imageRenderedIsNotCoherencePass: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function buildDiagnosticExport(api) {
    const state = api && api.state ? api.state : {};
    const coherenceReport = state.coherenceReport || api.coherenceReport || null;
    const canvas = api && api.canvas ? api.canvas : null;
    const records = state.runtimeTableLedger && Array.isArray(state.runtimeTableLedger.records)
      ? state.runtimeTableLedger.records
      : [];

    const exportPacket = {
      header: "HEARTH_DIAGNOSTIC_RECEIPT_EXPORT",
      timestamp: nowIso(),
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      previousCanvasContract: PREVIOUS_CONTRACT,
      labRuntimeTableContract: state.labRuntimeTableContract || (getRuntimeTableApi() && getRuntimeTableApi().contract) || "",
      preferredLabRuntimeTableContract: LAB_RUNTIME_TABLE_CONTRACT_V2,
      acceptedLabRuntimeTableContracts: LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.slice(),
      runtimeHandoff: state.runtimeHandoff || "",
      constructionReady: Boolean(state.runtimeAllowed),
      imageRendered: Boolean(state.imageRendered),
      coherentExpressionPass: Boolean(state.coherentExpressionPass),
      coherenceStatus: state.coherenceStatus || "PENDING",
      coherenceScore: Number.isFinite(Number(state.coherenceScore)) ? Number(state.coherenceScore) : 0,
      failedCheckpoints: Array.isArray(state.failedCheckpoints) ? state.failedCheckpoints.slice() : [],
      warningCheckpoints: coherenceReport && Array.isArray(coherenceReport.warningCheckpoints) ? coherenceReport.warningCheckpoints.slice() : [],
      renewalTargets: Array.isArray(state.renewalTargets) ? state.renewalTargets.slice() : [],
      nextStrategy: coherenceReport && Array.isArray(coherenceReport.nextStrategy) ? coherenceReport.nextStrategy.slice() : [],
      landChannelContract: LAND_CONTRACT,
      waterChannelContract: WATER_CONTRACT,
      airChannelContract: AIR_CONTRACT,

      channelLoadResults: state.channelLoadResults || [],
      landLoadResult: state.landLoadResult || null,
      waterLoadResult: state.waterLoadResult || null,
      airLoadResult: state.airLoadResult || null,
      waterScriptRequested: Boolean(state.waterScriptRequested),
      waterScriptLoaded: Boolean(state.waterScriptLoaded),
      waterScriptPath: state.waterScriptPath || "/assets/hearth/hearth.water.channel.js",
      waterScriptCacheKey: state.waterScriptCacheKey || CHANNEL_CACHE_KEYS.water,
      waterScriptError: state.waterScriptError || "",
      waterGlobalPresent: Boolean(state.waterGlobalPresent),
      waterActualContract: state.waterActualContract || "",
      waterExpectedContract: state.waterExpectedContract || WATER_CONTRACT,
      waterSampleProbeOk: Boolean(state.waterSampleProbeOk),
      waterSampleProbeContract: state.waterSampleProbeContract || "",
      waterSampleProbeCoordinatesOk: Boolean(state.waterSampleProbeCoordinatesOk),
      waterSampleProbeFlagsOk: Boolean(state.waterSampleProbeFlagsOk),
      waterSampleProbeError: state.waterSampleProbeError || "",
      waterSampleProbeValue: state.waterSampleProbeValue || null,

      runtimeTableRecords: records.map((record) => ({
        key: record.key,
        name: record.name,
        status: record.status,
        rawStatus: record.rawStatus,
        contractOk: record.contractOk,
        expectedContract: record.expectedContract,
        actualContract: record.actualContract,
        sampleOk: record.sampleOk,
        coordinatesOk: record.coordinatesOk,
        issues: Array.isArray(record.issues) ? record.issues : []
      })),
      tripleGCheckpointReceipts: coherenceReport && Array.isArray(coherenceReport.checkpoints) ? coherenceReport.checkpoints : [],
      renderMetadata: {
        atlasReady: Boolean(state.atlasReady || api.atlasReady),
        atlasBuilding: Boolean(state.atlasBuilding || api.atlasBuilding),
        atlasProgress: Number.isFinite(Number(state.atlasProgress)) ? Number(state.atlasProgress) : 0,
        projectionReady: Boolean(state.atlasReady || api.cachedAtlasProjection),
        sphereContainment: true,
        outsideSphereTransparent: true,
        noRectangularTextureSpill: true,
        imageRendered: Boolean(state.imageRendered),
        visualPassClaimed: false
      },
      canvasDataset: datasetToObject(canvas),
      documentRootDataset: getDocumentRootDataset(),
      visualPassClaimed: false,
      strategicSummary: {
        constructionReady: Boolean(state.runtimeAllowed) ? "pass" : "fail",
        imageRendered: Boolean(state.imageRendered) ? "pass" : "fail",
        coherentExpression: Boolean(state.coherentExpressionPass) ? "pass" : (state.coherenceStatus || "pending"),
        waterFailureCoordinate: getWaterFailureCoordinate(state),
        recommendedNextRenewalTarget: Array.isArray(state.renewalTargets) && state.renewalTargets.length ? state.renewalTargets[0] : ""
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };

    const lines = [
      "HEARTH_DIAGNOSTIC_RECEIPT_EXPORT",
      "",
      `timestamp=${exportPacket.timestamp}`,
      `canvasContract=${exportPacket.canvasContract}`,
      `canvasReceipt=${exportPacket.canvasReceipt}`,
      `previousCanvasContract=${exportPacket.previousCanvasContract}`,
      `labRuntimeTableContract=${exportPacket.labRuntimeTableContract}`,
      `preferredLabRuntimeTableContract=${exportPacket.preferredLabRuntimeTableContract}`,
      `acceptedLabRuntimeTableContracts=${exportPacket.acceptedLabRuntimeTableContracts.join(",")}`,
      `runtimeHandoff=${exportPacket.runtimeHandoff}`,
      `constructionReady=${exportPacket.constructionReady}`,
      `imageRendered=${exportPacket.imageRendered}`,
      `coherentExpressionPass=${exportPacket.coherentExpressionPass}`,
      `coherenceStatus=${exportPacket.coherenceStatus}`,
      `coherenceScore=${exportPacket.coherenceScore}`,
      `failedCheckpoints=${exportPacket.failedCheckpoints.join(",")}`,
      `warningCheckpoints=${exportPacket.warningCheckpoints.join(",")}`,
      `renewalTargets=${exportPacket.renewalTargets.join(",")}`,
      `nextStrategy=${exportPacket.nextStrategy.join(" | ")}`,
      `landChannelContract=${exportPacket.landChannelContract}`,
      `waterChannelContract=${exportPacket.waterChannelContract}`,
      `airChannelContract=${exportPacket.airChannelContract}`,
      "",
      "WATER_LOADER_COORDINATE_PROOF",
      `channelLoadProofReady=${Boolean(state.channelLoadProofReady)}`,
      `waterScriptRequested=${exportPacket.waterScriptRequested}`,
      `waterScriptLoaded=${exportPacket.waterScriptLoaded}`,
      `waterScriptPath=${exportPacket.waterScriptPath}`,
      `waterScriptCacheKey=${exportPacket.waterScriptCacheKey}`,
      `waterScriptError=${exportPacket.waterScriptError}`,
      `waterGlobalPresent=${exportPacket.waterGlobalPresent}`,
      `waterActualContract=${exportPacket.waterActualContract}`,
      `waterExpectedContract=${exportPacket.waterExpectedContract}`,
      `waterSampleProbeOk=${exportPacket.waterSampleProbeOk}`,
      `waterSampleProbeContract=${exportPacket.waterSampleProbeContract}`,
      `waterSampleProbeCoordinatesOk=${exportPacket.waterSampleProbeCoordinatesOk}`,
      `waterSampleProbeFlagsOk=${exportPacket.waterSampleProbeFlagsOk}`,
      `waterSampleProbeError=${exportPacket.waterSampleProbeError}`,
      `waterFailureCoordinate=${exportPacket.strategicSummary.waterFailureCoordinate}`,
      "",
      `visualPassClaimed=${exportPacket.visualPassClaimed}`,
      "",
      "STRATEGIC_SUMMARY",
      stringifyForReceipt(exportPacket.strategicSummary),
      "",
      "CHANNEL_LOAD_RESULTS",
      stringifyForReceipt(exportPacket.channelLoadResults),
      "",
      "LAND_LOAD_RESULT",
      stringifyForReceipt(exportPacket.landLoadResult),
      "",
      "WATER_LOAD_RESULT",
      stringifyForReceipt(exportPacket.waterLoadResult),
      "",
      "AIR_LOAD_RESULT",
      stringifyForReceipt(exportPacket.airLoadResult),
      "",
      "WATER_SAMPLE_PROBE_VALUE",
      stringifyForReceipt(exportPacket.waterSampleProbeValue),
      "",
      "RUNTIME_TABLE_RECORDS",
      stringifyForReceipt(exportPacket.runtimeTableRecords),
      "",
      "TRIPLE_G_CHECKPOINT_RECEIPTS",
      stringifyForReceipt(exportPacket.tripleGCheckpointReceipts),
      "",
      "RENDER_METADATA",
      stringifyForReceipt(exportPacket.renderMetadata),
      "",
      "CANVAS_DATASET",
      stringifyForReceipt(exportPacket.canvasDataset),
      "",
      "DOCUMENT_ROOT_DATASET",
      stringifyForReceipt(exportPacket.documentRootDataset)
    ];

    const text = lines.join("\n");

    if (api && api.state) {
      api.state.latestDiagnosticExport = text;
      api.state.diagnosticExportAvailable = true;
      api.state.diagnosticExportLength = text.length;
      api.state.diagnosticExportError = "";
      syncReceiptDataset(api);
    }

    return text;
  }

  function getWaterFailureCoordinate(state = {}) {
    if (!state.waterScriptRequested) return "Coordinate 0 — File request not made";
    if (!state.waterScriptLoaded) return "Coordinate 1 — Script load/deployment/cache validation";
    if (!state.waterGlobalPresent) return "Coordinate 2 — Global export missing";
    if (state.waterActualContract !== WATER_CONTRACT) return "Coordinate 2 — Global export contract mismatch";
    if (!state.waterSampleProbeOk) return "Coordinate 3 — Direct sample probe failed";
    if (!state.waterSampleProbeCoordinatesOk) return "Coordinate 3 — Direct sample coordinates invalid";
    if (!state.waterSampleProbeFlagsOk) return "Coordinate 3 — Direct sample authority flags invalid";

    const records = state.runtimeTableLedger && Array.isArray(state.runtimeTableLedger.records)
      ? state.runtimeTableLedger.records
      : [];
    const waterRecord = records.find((record) => record && record.key === "water");

    if (waterRecord && waterRecord.status !== "READY") {
      return "Coordinate 4 — Runtime Table registration/global lookup";
    }

    if (!state.channelMultiplexReady) {
      return "Coordinate 5 — Canvas multiplex readiness";
    }

    if (state.coherenceChecked && !state.coherentExpressionPass) {
      return "Coordinate 6 — True coherence calibration";
    }

    return "No water-loader failure coordinate detected";
  }

  function getDiagnosticExport(api) {
    if (!api || !api.state) return "";
    return api.state.latestDiagnosticExport || buildDiagnosticExport(api);
  }

  function copyTextFallback(text) {
    if (!root.document || typeof root.document.createElement !== "function") {
      return false;
    }

    const textarea = root.document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "readonly");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    root.document.body.appendChild(textarea);
    textarea.select();

    let copied = false;

    try {
      copied = root.document.execCommand("copy");
    } catch (_error) {
      copied = false;
    }

    if (textarea.parentNode) textarea.parentNode.removeChild(textarea);
    return copied;
  }

  async function copyDiagnosticExport(api) {
    if (!api || !api.state) return false;

    const text = buildDiagnosticExport(api);
    let copied = false;
    let errorMessage = "";

    try {
      if (root.navigator && root.navigator.clipboard && typeof root.navigator.clipboard.writeText === "function") {
        await root.navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (error) {
      errorMessage = error && error.message ? error.message : String(error);
      copied = false;
    }

    if (!copied) {
      copied = copyTextFallback(text);
    }

    api.state.diagnosticExportCopied = copied;
    api.state.diagnosticExportError = copied ? "" : (errorMessage || "Copy unavailable. Expanded receipt remains selectable for manual copy.");
    api.state.diagnosticExportAvailable = true;
    api.state.diagnosticExportLength = text.length;

    if (!copied) {
      api.state.receiptMode = RECEIPT_MODES.EXPANDED;
    }

    syncReceiptDataset(api);
    renderLoadingPanel(api.loadingPanel, api.state, api);

    return copied;
  }

  function renderReceiptControls(api) {
    const state = api && api.state ? api.state : {};
    const mode = state.receiptMode || RECEIPT_MODES.COMPACT;
    const visibleLabel = mode === RECEIPT_MODES.HIDDEN ? "Show Receipt" : "Hide Receipt";
    const expandLabel = mode === RECEIPT_MODES.EXPANDED ? "Collapse Receipt" : "Expand Receipt";
    const copyLabel = state.diagnosticExportCopied ? "Receipt Copied" : "Copy Diagnostic Receipt";

    const buttonStyle = [
      "appearance:none",
      "border:1px solid rgba(174,216,236,.24)",
      "background:rgba(174,216,236,.08)",
      "color:rgba(238,246,255,.90)",
      "border-radius:999px",
      "padding:5px 8px",
      "font:inherit",
      "font-size:10px",
      "line-height:1",
      "cursor:pointer",
      "pointer-events:auto"
    ].join(";");

    return [
      "<div data-hearth-receipt-controls=\"true\" style=\"display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 8px 0;pointer-events:auto;\">",
      `<button type="button" data-hearth-receipt-action="toggle-visibility" style="${buttonStyle}">${escapeHtml(visibleLabel)}</button>`,
      mode === RECEIPT_MODES.HIDDEN ? "" : `<button type="button" data-hearth-receipt-action="toggle-expanded" style="${buttonStyle}">${escapeHtml(expandLabel)}</button>`,
      mode === RECEIPT_MODES.HIDDEN ? "" : `<button type="button" data-hearth-receipt-action="copy" style="${buttonStyle}">${escapeHtml(copyLabel)}</button>`,
      "</div>"
    ].join("");
  }

  function renderExpandedReceipt(api) {
    const exportText = buildDiagnosticExport(api);
    const state = api && api.state ? api.state : {};
    const error = state.diagnosticExportError
      ? `<div style="color:rgba(255,210,180,.92);margin:6px 0;">${escapeHtml(state.diagnosticExportError)}</div>`
      : "";

    return [
      error,
      "<pre data-hearth-expanded-receipt=\"true\" style=\"",
      "white-space:pre-wrap;",
      "word-break:break-word;",
      "max-height:260px;",
      "overflow:auto;",
      "margin:8px 0 0 0;",
      "padding:10px;",
      "border:1px solid rgba(174,216,236,.16);",
      "border-radius:12px;",
      "background:rgba(0,0,0,.28);",
      "color:rgba(238,246,255,.86);",
      "font-size:10px;",
      "line-height:1.35;",
      "user-select:text;",
      "pointer-events:auto;",
      "\">",
      escapeHtml(exportText),
      "</pre>"
    ].join("");
  }

  function attachReceiptControlHandlers(panel, api) {
    if (!panel || !api) return;

    panel.querySelectorAll("[data-hearth-receipt-action]").forEach((button) => {
      button.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
      }, { passive: true });

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = button.dataset.hearthReceiptAction;

        if (action === "toggle-visibility") {
          toggleReceiptVisibility(api);
          return;
        }

        if (action === "toggle-expanded") {
          toggleReceiptExpansion(api);
          return;
        }

        if (action === "copy") {
          copyDiagnosticExport(api);
        }
      });
    });
  }

  function statusBadge(value) {
    const raw = String(value || "pending").toLowerCase();

    if (raw.includes("reject") || raw.includes("block") || raw.includes("fail")) return "✕";
    if (raw.includes("ready") || raw.includes("complete") || raw.includes("pass") || raw.includes("rendered") || raw.includes("valid")) return "✓";
    if (raw.includes("fallback") || raw.includes("degraded") || raw.includes("optimized") || raw.includes("warning")) return "◐";
    if (raw.includes("loading") || raw.includes("building") || raw.includes("validating") || raw.includes("running")) return "•";
    return "○";
  }

  function formatPercent(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0%";
    return `${Math.round(clamp01(n) * 100)}%`;
  }

  function formatRuntimeTableIssues(ledger) {
    if (!ledger || !Array.isArray(ledger.records)) return [];

    const lines = [];

    ledger.records.forEach((record) => {
      if (!record || !Array.isArray(record.issues) || !record.issues.length) return;

      record.issues.forEach((issue) => {
        lines.push(`${record.name || record.key}: ${issue.code || "ISSUE"} — ${issue.message || "No detail supplied."}`);
      });
    });

    return lines;
  }

  function formatCoherenceIssues(report) {
    if (!report || !Array.isArray(report.checkpoints)) return [];

    const lines = [];

    report.checkpoints.forEach((checkpoint) => {
      if (!checkpoint || checkpoint.status === "PASS") return;

      const target = Array.isArray(checkpoint.renewalTarget) && checkpoint.renewalTarget.length
        ? ` → ${checkpoint.renewalTarget.slice(0, 2).join(", ")}`
        : "";

      lines.push(`${checkpoint.id || "CHECK"}: ${checkpoint.status || "UNKNOWN"}${target}`);
    });

    return lines;
  }

  function renderLoadingPanel(panel, state, api = null) {
    if (!panel || !state) return;

    const mode = state.receiptMode || RECEIPT_MODES.COMPACT;
    syncReceiptDataset(api);

    if (mode === RECEIPT_MODES.HIDDEN) {
      panel.style.width = "auto";
      panel.style.maxHeight = "none";
      panel.style.overflow = "visible";
      panel.style.padding = "8px 10px";
      panel.innerHTML = [
        "<div style=\"display:flex;align-items:center;gap:8px;pointer-events:auto;\">",
        "<strong style=\"font-size:10px;letter-spacing:.08em;text-transform:uppercase;opacity:.82;\">Receipt</strong>",
        renderReceiptControls(api),
        "</div>"
      ].join("");

      attachReceiptControlHandlers(panel, api);
      return;
    }

    panel.style.width = "min(92%, 560px)";
    panel.style.maxHeight = "58%";
    panel.style.overflow = "auto";
    panel.style.padding = "12px 14px";

    const stages = state.loadingStages || {};
    const handoff = state.runtimeTableLedger && state.runtimeTableLedger.handoff
      ? state.runtimeTableLedger.handoff
      : state.runtimeHandoff || "PENDING";

    const runtimeIssues = formatRuntimeTableIssues(state.runtimeTableLedger);
    const coherenceIssues = formatCoherenceIssues(state.coherenceReport);
    const channelProofLines = formatChannelLoadProof(api);
    const issueLines = channelProofLines.concat(runtimeIssues).concat(coherenceIssues);

    const issueHtml = issueLines.length
      ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(174,216,236,.14);color:rgba(255,210,180,.92);">${issueLines.slice(0, 9).map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>`
      : "";

    const coherenceScore = Number.isFinite(Number(state.coherenceScore)) ? Number(state.coherenceScore) : 0;
    const coherenceStatus = state.coherenceStatus || "pending";
    const coherentExpression = state.coherentExpressionPass ? "pass" : state.coherenceChecked ? coherenceStatus : "pending";
    const waterLoaderStatus = state.channelLoadProofReady
      ? state.waterSampleProbeOk && state.waterSampleProbeCoordinatesOk && state.waterSampleProbeFlagsOk
        ? "valid"
        : getWaterFailureCoordinate(state)
      : "pending";

    const statusRows = [
      ["Shell mounted", stages.shellMounted || "pending"],
      ["Touch bound", stages.touchBound || "pending"],
      ["Lab Runtime Table", stages.runtimeTable || "pending"],
      ["Land channel", stages.land || "pending"],
      ["Water loader", waterLoaderStatus],
      ["Water channel", stages.water || "pending"],
      ["Air channel", stages.air || "pending"],
      ["Runtime validation", stages.validation || "pending"],
      ["Construction Ready", state.runtimeAllowed ? "pass" : stages.construction || "pending"],
      ["Handoff", handoff],
      ["Atlas", stages.atlas || "pending"],
      ["Image Rendered", state.imageRendered ? "rendered" : "pending"],
      ["Triple G", stages.coherence || "pending"],
      ["Coherent Expression", coherentExpression]
    ];

    const rowsHtml = statusRows.map(([label, value]) => {
      const text = String(value || "pending");
      return [
        "<div style=\"display:grid;grid-template-columns:22px 1fr auto;gap:7px;align-items:center;padding:2px 0;\">",
        `<span style="opacity:.78;">${statusBadge(text)}</span>`,
        `<span style="opacity:.86;">${escapeHtml(label)}</span>`,
        `<span style="opacity:.72;text-transform:uppercase;letter-spacing:.08em;font-size:9px;text-align:right;">${escapeHtml(text)}</span>`,
        "</div>"
      ].join("");
    }).join("");

    const copiedNotice = state.diagnosticExportCopied
      ? "<div style=\"margin-top:6px;color:rgba(184,236,205,.92);\">Diagnostic receipt copied.</div>"
      : "";

    panel.innerHTML = [
      "<div style=\"display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:6px;\">",
      "<strong style=\"font-size:12px;letter-spacing:.08em;text-transform:uppercase;\">Hearth Diagnostic Receipt</strong>",
      `<span style="font-size:10px;opacity:.70;">Atlas ${escapeHtml(formatPercent(state.atlasProgress || 0))} · Coherence ${escapeHtml(String(coherenceScore))}</span>`,
      "</div>",
      renderReceiptControls(api),
      "<div style=\"height:4px;border-radius:999px;background:rgba(174,216,236,.12);overflow:hidden;margin-bottom:9px;\">",
      `<div style="height:100%;width:${escapeHtml(formatPercent(state.atlasProgress || 0))};background:rgba(174,216,236,.72);border-radius:999px;"></div>`,
      "</div>",
      rowsHtml,
      issueHtml,
      copiedNotice,
      mode === RECEIPT_MODES.EXPANDED ? renderExpandedReceipt(api) : ""
    ].join("");

    attachReceiptControlHandlers(panel, api);
  }

  function updateLoadingStatus(api, patch = {}) {
    if (!api || !api.state) return;

    const state = api.state;

    if (patch.stages && typeof patch.stages === "object") {
      state.loadingStages = {
        ...state.loadingStages,
        ...patch.stages
      };
    }

    if (patch.runtimeTableLedger) state.runtimeTableLedger = patch.runtimeTableLedger;
    if (patch.runtimeHandoff) state.runtimeHandoff = patch.runtimeHandoff;
    if (typeof patch.runtimeAllowed === "boolean") state.runtimeAllowed = patch.runtimeAllowed;
    if (typeof patch.imageRendered === "boolean") state.imageRendered = patch.imageRendered;
    if (Number.isFinite(Number(patch.atlasProgress))) state.atlasProgress = clamp01(patch.atlasProgress);
    if (patch.error) state.error = patch.error;

    if (api.canvas) {
      api.canvas.dataset.hearthRuntimeTableHandoff = state.runtimeHandoff || "PENDING";
      api.canvas.dataset.hearthRuntimeTableRuntimeAllowed = String(Boolean(state.runtimeAllowed));
      api.canvas.dataset.hearthRuntimeTableSet = String(Boolean(state.runtimeAllowed));
      api.canvas.dataset.hearthRuntimeTableLedgerReady = String(Boolean(state.runtimeTableLedger));
      api.canvas.dataset.hearthCanvasAtlasProgress = String(state.atlasProgress || 0);
      api.canvas.dataset.hearthCanvasImageRendered = String(Boolean(state.imageRendered));
      if (state.error) api.canvas.dataset.hearthRuntimeTableError = state.error;
    }

    syncReceiptDataset(api);
    renderLoadingPanel(api.loadingPanel, state, api);
  }

  function updateCoherenceStatus(api, report) {
    if (!api || !api.state) return;

    const state = api.state;
    const canvas = api.canvas;

    state.coherenceReport = report || null;
    state.coherenceChecked = Boolean(report);
    state.coherenceStatus = report && report.coherenceStatus ? report.coherenceStatus : "UNAVAILABLE";
    state.coherenceScore = report && Number.isFinite(Number(report.coherenceScore)) ? Number(report.coherenceScore) : 0;
    state.coherentExpressionPass = Boolean(report && report.coherentExpressionPass);
    state.failedCheckpoints = report && Array.isArray(report.failedCheckpoints) ? report.failedCheckpoints.slice() : [];
    state.renewalTargets = report && Array.isArray(report.renewalTargets) ? report.renewalTargets.slice() : [];
    state.diagnosticExportAvailable = Boolean(report);

    api.coherenceReport = report || null;
    api.coherenceChecked = state.coherenceChecked;
    api.coherenceStatus = state.coherenceStatus;
    api.coherenceScore = state.coherenceScore;
    api.coherentExpressionPass = state.coherentExpressionPass;
    api.failedCheckpoints = state.failedCheckpoints.slice();
    api.renewalTargets = state.renewalTargets.slice();

    if (canvas) {
      canvas.dataset.hearthTripleGDiagnosticAvailable = String(runtimeTableV2Available());
      canvas.dataset.hearthTripleGDiagnosticContract = runtimeTableV2Available() ? LAB_RUNTIME_TABLE_CONTRACT_V2 : "";
      canvas.dataset.hearthTripleGCoherenceChecked = String(state.coherenceChecked);
      canvas.dataset.hearthTripleGCoherenceStatus = state.coherenceStatus;
      canvas.dataset.hearthTripleGCoherenceScore = String(state.coherenceScore);
      canvas.dataset.hearthTripleGCoherentExpressionPass = String(state.coherentExpressionPass);
      canvas.dataset.hearthTripleGFailedCheckpoints = state.failedCheckpoints.join(",");
      canvas.dataset.hearthTripleGRenewalTargets = state.renewalTargets.join(",");
      canvas.dataset.visualPassClaimed = "false";
    }

    if (report) buildDiagnosticExport(api);

    if (state.coherentExpressionPass && !state.receiptUserInteracted) {
      state.receiptMode = RECEIPT_MODES.HIDDEN;
    } else if (!state.coherentExpressionPass && state.receiptMode === RECEIPT_MODES.HIDDEN && !state.receiptUserInteracted) {
      state.receiptMode = RECEIPT_MODES.COMPACT;
    }

    updateLoadingStatus(api, {
      stages: {
        coherence: state.coherenceChecked
          ? state.coherentExpressionPass
            ? "pass"
            : String(state.coherenceStatus || "fail").toLowerCase()
          : "unavailable"
      }
    });
  }

  function drawFallbackShell(canvas, state = {}) {
    if (!canvas || typeof canvas.getContext !== "function") return null;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const r = size * 0.47;
    const pulse = Math.sin((Number(state.frames) || 0) * 0.06) * 0.5 + 0.5;

    ctx.clearRect(0, 0, width, height);

    const shell = ctx.createRadialGradient(
      cx - r * 0.28,
      cy - r * 0.34,
      r * 0.05,
      cx,
      cy,
      r
    );

    shell.addColorStop(0, "rgba(88, 118, 130, 0.96)");
    shell.addColorStop(0.42, "rgba(28, 52, 70, 0.98)");
    shell.addColorStop(0.78, "rgba(8, 17, 34, 0.99)");
    shell.addColorStop(1, "rgba(1, 4, 12, 1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.clip();
    ctx.fillStyle = shell;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const shade = ctx.createRadialGradient(
      cx - r * 0.25,
      cy - r * 0.32,
      r * 0.10,
      cx + r * 0.18,
      cy + r * 0.14,
      r * 1.08
    );

    shade.addColorStop(0, "rgba(255,255,255,0.10)");
    shade.addColorStop(0.44, "rgba(255,255,255,0.00)");
    shade.addColorStop(0.78, "rgba(0,0,0,0.24)");
    shade.addColorStop(1, "rgba(0,0,0,0.52)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.strokeStyle = `rgba(172, 219, 240, ${0.22 + pulse * 0.10})`;
    ctx.lineWidth = Math.max(1, size * 0.005);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.018, 0, TWO_PI);
    ctx.strokeStyle = `rgba(174,216,236, ${0.10 + pulse * 0.06})`;
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    canvas.dataset.hearthCanvasFallbackShellPainted = "true";
    canvas.dataset.hearthCanvasNeutralLoadingShell = "true";
    canvas.dataset.hearthCanvasFrames = String(Number(canvas.dataset.hearthCanvasFrames || 0) + 1);

    return canvas;
  }

  function sampleAtlasNearest(atlas, u, v) {
    const x = clamp(Math.round(wrap01(u) * (atlas.width - 1)), 0, atlas.width - 1);
    const y = clamp(Math.round(clamp(v, 0, 1) * (atlas.height - 1)), 0, atlas.height - 1);
    const i = (y * atlas.width + x) * 4;

    return [
      atlas.data[i],
      atlas.data[i + 1],
      atlas.data[i + 2],
      atlas.data[i + 3]
    ];
  }

  function renderSphereFromAtlas(targetCanvas, atlas, state = {}, options = {}) {
    if (!targetCanvas || !atlas || !atlas.data) return targetCanvas;

    const ctx = targetCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = targetCanvas.width;
    const height = targetCanvas.height;
    const image = ctx.createImageData(width, height);
    const data = image.data;

    const rotationLon = Number.isFinite(Number(state.rotationLon)) ? Number(state.rotationLon) : 0;
    const rotationLat = Number.isFinite(Number(state.rotationLat)) ? Number(state.rotationLat) : 0;
    const light = normalize3({ x: -0.34, y: 0.42, z: 0.83 });
    const useSoftLighting = options.softProjectionLighting !== false;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const sphere = spherePixelToVector(x, y, width, height);
        const i = (y * width + x) * 4;

        if (!sphere.inside) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        const world = rotateForView(sphere.vector, rotationLon, rotationLat);
        const ll = vectorToLonLat(world);
        const color = sampleAtlasNearest(atlas, lonToU(ll.lon), latToV(ll.lat));

        let r = color[0];
        let g = color[1];
        let b = color[2];

        if (useSoftLighting) {
          const illumination = clamp01(0.64 + dot3(sphere.vector, light) * 0.30);
          const edgeShade = clamp01(1 - sphere.radial * 0.13);
          const shade = clamp01(illumination * edgeShade);
          r = clamp(Math.round(r * shade), 0, 255);
          g = clamp(Math.round(g * shade), 0, 255);
          b = clamp(Math.round(b * shade), 0, 255);

          const limbAtmosphere = clamp01(sphere.radial * 0.05);
          const mixed = mixColor([r, g, b], COLORS.atmosphere, limbAtmosphere);
          r = mixed[0];
          g = mixed[1];
          b = mixed[2];
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = Math.round(clamp01(color[3] / 255) * 255 * sphere.edgeAlpha);
      }
    }

    ctx.putImageData(image, 0, 0);
    targetCanvas.dataset.hearthCanvasRenderedFromCachedAtlas = "true";
    targetCanvas.dataset.hearthCanvasInteractiveProjection = "true";
    targetCanvas.dataset.hearthCanvasAtlasReady = "true";
    targetCanvas.dataset.hearthCanvasImageRendered = "true";
    targetCanvas.dataset.hearthCanvasFrames = String(Number(targetCanvas.dataset.hearthCanvasFrames || 0) + 1);
    targetCanvas.dataset.visualPassClaimed = "false";

    return targetCanvas;
  }

  function scheduleWork(fn) {
    if (root.requestIdleCallback) {
      root.requestIdleCallback(fn, { timeout: 80 });
      return;
    }

    if (root.requestAnimationFrame) {
      root.requestAnimationFrame(fn);
      return;
    }

    setTimeout(fn, 0);
  }

  function ensureRuntimeTable(options = {}) {
    return loadScriptOnce(
      LAB_RUNTIME_TABLE_PATH,
      "lab-runtime-table",
      () => {
        const api = getRuntimeTableApi();

        return Boolean(
          api &&
            runtimeTableContractAccepted(api) &&
            typeof api.createHearthChannelTable === "function"
        );
      },
      options.runtimeTableCacheKey || "lab-runtime-table-v2"
    ).then((result) => ({
      ...result,
      api: getRuntimeTableApi(),
      contract: getRuntimeTableApi() && getRuntimeTableApi().contract,
      v2Available: runtimeTableV2Available()
    }));
  }

  function ensureChannelScripts(options = {}) {
    return Promise.all(CHANNEL_FILES.map((item) => loadChannelScriptWithProof(item, options)));
  }

  function createHearthRuntimeTable() {
    const api = getRuntimeTableApi();

    if (
      !api ||
      !runtimeTableContractAccepted(api) ||
      typeof api.createHearthChannelTable !== "function"
    ) {
      return null;
    }

    try {
      return api.createHearthChannelTable({
        id: "hearth-lab-runtime-table-consumer",
        budget: {
          atlasWidth: 384,
          atlasHeight: 192,
          rowsPerChunk: 2,
          sampleRate: 1
        }
      });
    } catch (_error) {
      return null;
    }
  }

  function runRuntimeTable(table) {
    if (!table || typeof table.run !== "function") {
      return {
        contract: LAB_RUNTIME_TABLE_CONTRACT,
        handoff: "BLOCKING",
        runtimeAllowed: false,
        tableSet: false,
        records: [],
        issues: [
          {
            code: "RUNTIME_TABLE_UNAVAILABLE",
            message: "Lab Runtime Table instance could not be created.",
            severity: "BLOCKING"
          }
        ]
      };
    }

    try {
      return table.run(SHARED_RUNTIME_TABLE_SAMPLE_POINT);
    } catch (error) {
      return {
        contract: LAB_RUNTIME_TABLE_CONTRACT,
        handoff: "BLOCKING",
        runtimeAllowed: false,
        tableSet: false,
        records: [],
        issues: [
          {
            code: "RUNTIME_TABLE_RUN_ERROR",
            message: error && error.message ? error.message : String(error),
            severity: "BLOCKING"
          }
        ]
      };
    }
  }

  function buildCoherenceInput(api) {
    const state = api && api.state ? api.state : {};
    const canvasSample = multiplexSample(SHARED_RUNTIME_TABLE_SAMPLE_POINT);
    const lab = getRuntimeTableApi();

    return {
      runtimeTableLedger: state.runtimeTableLedger || api.runtimeTableLedger || null,
      canvasReceipt: getReceipt(),
      canvasSample,
      landSample: canvasSample.land,
      waterSample: canvasSample.water,
      airSample: canvasSample.air,
      renderMetadata: {
        atlasReady: Boolean(state.atlasReady || api.atlasReady),
        projectionReady: Boolean(state.atlasReady || api.cachedAtlasProjection),
        sphereContainment: true,
        outsideSphereTransparent: true,
        noRectangularTextureSpill: true,
        imageRendered: Boolean(state.imageRendered),
        handoff: state.runtimeHandoff || api.runtimeHandoff || "",
        runtimeAllowed: Boolean(state.runtimeAllowed || api.runtimeAllowed),
        canvasContract: CONTRACT,
        visualPassClaimed: false
      },
      imageRendered: Boolean(state.imageRendered),
      goalProfile: runtimeTableV2Available(lab) && lab.createGoalProfile
        ? lab.createGoalProfile("hearth-channel-expression", {
          expectedContracts: {
            canvas: CONTRACT
          }
        })
        : undefined,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function runTripleGDiagnostic(api) {
    const lab = getRuntimeTableApi();

    if (!runtimeTableV2Available(lab)) {
      const unavailable = {
        contract: LAB_RUNTIME_TABLE_CONTRACT,
        receipt: "HEARTH_TRIPLE_G_DIAGNOSTIC_UNAVAILABLE_RECEIPT",
        authority: "hearth-canvas-triple-g-consumer",
        goalProfileId: "hearth-channel-expression",
        constructionReady: Boolean(api && api.state && api.state.runtimeAllowed),
        imageRendered: Boolean(api && api.state && api.state.imageRendered),
        coherentExpressionPass: false,
        coherenceScore: 0,
        coherenceStatus: "UNAVAILABLE",
        runtimeTableHandoff: api && api.state ? api.state.runtimeHandoff : "",
        checkpoints: [],
        failedCheckpoints: [],
        warningCheckpoints: [],
        renewalTargets: ["lab-runtime-table-v2-cache-refresh"],
        nextStrategy: ["Load LAB_RUNTIME_TABLE_AND_TRIPLE_G_COHERENCE_DIAGNOSTIC_STANDARD_TNT_v2 before running coherence diagnostics."],
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      };

      updateCoherenceStatus(api, unavailable);
      return unavailable;
    }

    try {
      const report = lab.runCoherenceDiagnostic(buildCoherenceInput(api), {
        profile: "hearth-channel-expression"
      });

      updateCoherenceStatus(api, report);
      return report;
    } catch (error) {
      const report = {
        contract: LAB_RUNTIME_TABLE_CONTRACT_V2,
        receipt: "HEARTH_TRIPLE_G_DIAGNOSTIC_RUN_ERROR_RECEIPT",
        authority: "hearth-canvas-triple-g-consumer",
        goalProfileId: "hearth-channel-expression",
        constructionReady: Boolean(api && api.state && api.state.runtimeAllowed),
        imageRendered: Boolean(api && api.state && api.state.imageRendered),
        coherentExpressionPass: false,
        coherenceScore: 0,
        coherenceStatus: "BLOCKING",
        runtimeTableHandoff: api && api.state ? api.state.runtimeHandoff : "",
        checkpoints: [],
        failedCheckpoints: ["TRIPLE_G_RUN_ERROR"],
        warningCheckpoints: [],
        renewalTargets: ["canvas-coherence-input-shape", "lab-triple-g-diagnostic-consumption"],
        nextStrategy: [error && error.message ? error.message : String(error)],
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      };

      updateCoherenceStatus(api, report);
      return report;
    }
  }

  function createAtlasTextureCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas atlas creation requires document.createElement.");
    }

    const width = clamp(
      Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 384,
      32,
      options.allowLargeTexture === true ? 1536 : 512
    );

    const height = clamp(
      Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 192,
      16,
      options.allowLargeTexture === true ? 768 : 256
    );

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthRuntimeTablePrewired = "true";
    canvas.dataset.hearthTripleGCoherencePrewired = "true";
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.hearthCanvasRawAtlasDisplayForbidden = "true";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = height <= 1 ? 0 : y / (height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = width <= 1 ? 0 : x / (width - 1);
        const px = multiplexSample({ u, v });
        const i = (y * width + x) * 4;

        data[i] = px.rgb[0];
        data[i + 1] = px.rgb[1];
        data[i + 2] = px.rgb[2];
        data[i + 3] = Math.round(clamp01(px.alpha) * 255);
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas;
  }

  function getAtlasData(atlasCanvas) {
    const ctx = atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = ctx.getImageData(0, 0, atlasCanvas.width, atlasCanvas.height);

    return {
      canvas: atlasCanvas,
      width: atlasCanvas.width,
      height: atlasCanvas.height,
      data: image.data
    };
  }

  function buildAtlasAsync(options = {}, handlers = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      const error = new Error("Hearth async atlas creation requires document.createElement.");
      if (typeof handlers.onError === "function") handlers.onError(error);
      return { cancel() {} };
    }

    const width = clamp(
      Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 384,
      32,
      options.allowLargeTexture === true ? 1024 : 512
    );

    const height = clamp(
      Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 192,
      16,
      options.allowLargeTexture === true ? 512 : 256
    );

    const rowsPerChunk = clamp(
      Number.isFinite(Number(options.rowsPerChunk)) ? Math.round(Number(options.rowsPerChunk)) : 2,
      1,
      8
    );

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasAsyncAtlas = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthRuntimeTablePrewired = "true";
    canvas.dataset.hearthTripleGCoherencePrewired = "true";
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let y = 0;
    let cancelled = false;

    const controller = {
      canvas,
      width,
      height,
      cancel() {
        cancelled = true;
      }
    };

    const processChunk = () => {
      if (cancelled) return;

      try {
        const endY = Math.min(height, y + rowsPerChunk);

        for (; y < endY; y += 1) {
          const v = height <= 1 ? 0 : y / (height - 1);

          for (let x = 0; x < width; x += 1) {
            const u = width <= 1 ? 0 : x / (width - 1);
            const px = multiplexSample({ u, v });
            const i = (y * width + x) * 4;

            data[i] = px.rgb[0];
            data[i + 1] = px.rgb[1];
            data[i + 2] = px.rgb[2];
            data[i + 3] = Math.round(clamp01(px.alpha) * 255);
          }
        }

        const progress = clamp01(y / height);

        if (typeof handlers.onProgress === "function") {
          handlers.onProgress(progress, { y, width, height, rowsPerChunk });
        }

        if (y >= height) {
          ctx.putImageData(image, 0, 0);

          const readCtx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
          const atlasImage = readCtx.getImageData(0, 0, width, height);

          const atlas = {
            canvas,
            width,
            height,
            data: atlasImage.data
          };

          if (typeof handlers.onComplete === "function") handlers.onComplete(atlas);
          return;
        }

        scheduleWork(processChunk);
      } catch (error) {
        if (typeof handlers.onError === "function") handlers.onError(error);
      }
    };

    scheduleWork(processChunk);
    return controller;
  }

  function createSphereTextureCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas texture creation requires document.createElement.");
    }

    const atlasCanvas = createAtlasTextureCanvas({
      width: options.atlasWidth || 384,
      height: options.atlasHeight || 192,
      allowLargeTexture: options.allowLargeTexture === true
    });

    const atlas = getAtlasData(atlasCanvas);

    const requestedWidth = Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 420;
    const requestedHeight = Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : requestedWidth;

    const width = clamp(requestedWidth, 32, options.allowLargeTexture === true ? 1024 : 520);
    const height = clamp(requestedHeight, 32, options.allowLargeTexture === true ? 1024 : 520);

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthRuntimeTablePrewired = "true";
    canvas.dataset.hearthTripleGCoherencePrewired = "true";
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.hearthCanvasSphereContainment = "true";
    canvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    canvas.dataset.hearthCanvasCachedAtlasProjection = "true";
    canvas.dataset.visualPassClaimed = "false";

    renderSphereFromAtlas(
      canvas,
      atlas,
      {
        rotationLon: Number.isFinite(Number(options.rotationLon)) ? Number(options.rotationLon) : 0,
        rotationLat: Number.isFinite(Number(options.rotationLat)) ? Number(options.rotationLat) : 0
      },
      options
    );

    return canvas;
  }

  function createTextureCanvas(options = {}) {
    if (options && options.atlas === true) return createAtlasTextureCanvas(options);
    return createSphereTextureCanvas(options);
  }

  const createCanvas = (options = {}) => createTextureCanvas(options);
  const createPlanetTexture = (options = {}) => createTextureCanvas(options);
  const createTexture = (options = {}) => createTextureCanvas(options);
  const buildTexture = (options = {}) => createTextureCanvas(options);
  const getTextureCanvas = (options = {}) => createTextureCanvas(options);

  function paintToCanvas(targetCanvas, options = {}) {
    if (!targetCanvas || typeof targetCanvas.getContext !== "function") return null;

    const texture = createSphereTextureCanvas({
      width: options.width || targetCanvas.width || 420,
      height: options.height || targetCanvas.height || targetCanvas.width || 420,
      atlasWidth: options.atlasWidth || 384,
      atlasHeight: options.atlasHeight || 192,
      allowLargeTexture: options.allowLargeTexture === true
    });

    const ctx = targetCanvas.getContext("2d");
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.drawImage(texture, 0, 0, targetCanvas.width, targetCanvas.height);

    targetCanvas.dataset.hearthCanvasPainted = "true";
    targetCanvas.dataset.hearthCanvasContract = CONTRACT;
    targetCanvas.dataset.hearthRuntimeTablePrewired = "true";
    targetCanvas.dataset.hearthTripleGCoherencePrewired = "true";
    targetCanvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    targetCanvas.dataset.hearthCanvasSphereContainment = "true";
    targetCanvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    targetCanvas.dataset.hearthCanvasCachedAtlasProjection = "true";
    targetCanvas.dataset.visualPassClaimed = "false";

    return targetCanvas;
  }

  const renderToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const drawToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const render = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const paint = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);

  function bindPointerDrag(canvas, api) {
    const state = api.state;

    const handlePointerDown = (event) => {
      if (state.destroyed) return;

      state.dragging = true;
      state.pointerId = event.pointerId;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      canvas.style.cursor = "grabbing";
      canvas.dataset.hearthCanvasDragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (_error) {}
      }

      if (event.cancelable) event.preventDefault();
    };

    const handlePointerMove = (event) => {
      if (state.destroyed || !state.dragging) return;
      if (state.pointerId !== null && event.pointerId !== state.pointerId) return;

      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;

      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      state.rotationLon -= dx * 0.010;
      state.rotationLat += dy * 0.008;
      state.rotationLat = clamp(state.rotationLat, -Math.PI * 0.42, Math.PI * 0.42);

      canvas.dataset.hearthCanvasRotationLon = String(state.rotationLon);
      canvas.dataset.hearthCanvasRotationLat = String(state.rotationLat);

      api.requestRedraw();

      if (event.cancelable) event.preventDefault();
    };

    const endDrag = (event) => {
      if (state.destroyed) return;
      if (state.pointerId !== null && event && event.pointerId !== state.pointerId) return;

      state.dragging = false;
      canvas.style.cursor = "grab";
      canvas.dataset.hearthCanvasDragging = "false";

      if (event && canvas.releasePointerCapture && event.pointerId !== undefined) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_error) {}
      }

      state.pointerId = null;
      if (event && event.cancelable) event.preventDefault();
    };

    canvas.addEventListener("pointerdown", handlePointerDown, { passive: false });
    canvas.addEventListener("pointermove", handlePointerMove, { passive: false });
    canvas.addEventListener("pointerup", endDrag, { passive: false });
    canvas.addEventListener("pointercancel", endDrag, { passive: false });
    canvas.addEventListener("lostpointercapture", endDrag, { passive: false });

    canvas.dataset.hearthCanvasControlsBound = "true";
    state.controlsBound = true;

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("lostpointercapture", endDrag);
      canvas.dataset.hearthCanvasControlsBound = "false";
      state.controlsBound = false;
    };
  }

  function createShellFirstMount(target, options = {}) {
    if (!root.document) return null;

    const element =
      typeof target === "string"
        ? root.document.querySelector(target)
        : target && target.nodeType === 1
          ? target
          : null;

    if (!element) return null;

    element.querySelectorAll("[data-hearth-canvas-frame], [data-hearth-runtime-loading-panel], [data-hearth-canvas-texture], canvas.hearth-canvas-texture").forEach((node) => {
      node.remove();
    });

    const originalPosition = root.getComputedStyle ? root.getComputedStyle(element).position : "";
    if (!originalPosition || originalPosition === "static") {
      element.style.position = "relative";
    }

    const frame = root.document.createElement("div");
    frame.dataset.hearthCanvasFrame = "true";
    frame.dataset.hearthRuntimeTablePrewired = "true";
    frame.dataset.hearthTripleGCoherencePrewired = "true";
    frame.dataset.hearthReceiptExportReady = "true";
    frame.dataset.hearthChannelLoadProofReady = "true";
    frame.style.position = "relative";
    frame.style.display = "grid";
    frame.style.placeItems = "center";
    frame.style.width = "100%";
    frame.style.minHeight = "260px";
    frame.style.overflow = "hidden";

    const canvas = createShellCanvas(options);
    const loadingPanel = createLoadingPanel();

    frame.appendChild(canvas);
    frame.appendChild(loadingPanel);
    element.appendChild(frame);

    const state = {
      rotationLon: Number.isFinite(Number(options.rotationLon)) ? Number(options.rotationLon) : 0,
      rotationLat: Number.isFinite(Number(options.rotationLat)) ? Number(options.rotationLat) : 0,
      dragging: false,
      pointerId: null,
      lastPointerX: 0,
      lastPointerY: 0,
      frames: 0,
      atlasReady: false,
      atlasBuilding: false,
      atlasProgress: 0,
      fallbackActive: true,
      destroyed: false,
      redrawPending: false,
      controlsBound: false,
      atlas: null,
      atlasController: null,
      runtimeTableLoaded: false,
      runtimeTableInstance: null,
      runtimeTableLedger: null,
      runtimeAllowed: false,
      runtimeHandoff: "PENDING",
      labRuntimeTableContract: "",
      tripleGDiagnosticAvailable: false,
      coherenceReport: null,
      coherenceChecked: false,
      coherenceStatus: "PENDING",
      coherenceScore: 0,
      coherentExpressionPass: false,
      failedCheckpoints: [],
      renewalTargets: [],
      imageRendered: false,
      receiptMode: RECEIPT_MODES.COMPACT,
      receiptVisible: true,
      receiptExpanded: false,
      receiptUserInteracted: false,
      diagnosticExportAvailable: false,
      diagnosticExportCopied: false,
      diagnosticExportError: "",
      diagnosticExportLength: 0,
      latestDiagnosticExport: "",

      channelLoadProofReady: false,
      channelLoadResults: [],
      landLoadResult: null,
      waterLoadResult: null,
      airLoadResult: null,
      waterScriptRequested: false,
      waterScriptLoaded: false,
      waterScriptPath: "/assets/hearth/hearth.water.channel.js",
      waterScriptCacheKey: CHANNEL_CACHE_KEYS.water,
      waterScriptError: "",
      waterGlobalPresent: false,
      waterActualContract: "",
      waterExpectedContract: WATER_CONTRACT,
      waterSampleProbeOk: false,
      waterSampleProbeContract: "",
      waterSampleProbeCoordinatesOk: false,
      waterSampleProbeFlagsOk: false,
      waterSampleProbeError: "",
      waterSampleProbeValue: null,

      landChannelLoaded: Boolean(getLandChannel()),
      waterChannelLoaded: Boolean(getWaterChannel()),
      airChannelLoaded: Boolean(getAirChannel()),
      channelMultiplexReady: false,
      error: "",
      loadingStages: {
        shellMounted: "ready",
        touchBound: "pending",
        runtimeTable: "pending",
        land: "pending",
        water: "pending",
        air: "pending",
        validation: "pending",
        construction: "pending",
        atlas: "pending",
        projection: "pending",
        handoff: "pending",
        coherence: "pending"
      }
    };

    const api = {
      canvas,
      frame,
      loadingPanel,
      node: element,
      state,
      mounted: true,
      canvasFound: true,
      controlsBound: false,
      interactiveShellMounted: true,
      cachedAtlasProjection: false,
      atlasReady: false,
      atlasBuilding: false,
      runtimeTableConsumed: false,
      runtimeTableContract: LAB_RUNTIME_TABLE_CONTRACT,
      runtimeTableAcceptedContracts: LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.slice(),
      runtimeTableCanonicalOwner: "Dexter Lab",
      hearthRuntimeTableInstance: false,
      runtimeAllowed: false,
      runtimeHandoff: "PENDING",
      tripleGDiagnosticConsumed: false,
      coherenceDiagnosticAvailable: false,
      coherenceChecked: false,
      coherenceStatus: "PENDING",
      coherenceScore: 0,
      coherentExpressionPass: false,
      failedCheckpoints: [],
      renewalTargets: [],
      coherenceReport: null,
      imageRendered: false,
      channelMultiplexReady: false,
      semiconductorOutlet: true,
      canvasDecidesNothing: true,
      constructionReadyIsNotCoherencePass: true,
      imageRenderedIsNotCoherencePass: true,
      receiptModes: RECEIPT_MODES,
      contract: CONTRACT,
      receipt: RECEIPT,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      redraw() {
        if (state.destroyed) return canvas;

        state.redrawPending = false;

        if (state.atlasReady && state.atlas) {
          renderSphereFromAtlas(canvas, state.atlas, state, options);
          state.fallbackActive = false;
        } else {
          drawFallbackShell(canvas, state);
          state.fallbackActive = true;
        }

        state.frames += 1;
        canvas.dataset.hearthCanvasFrames = String(state.frames);
        return canvas;
      },
      requestRedraw() {
        if (state.destroyed || state.redrawPending) return;
        state.redrawPending = true;

        if (root.requestAnimationFrame) {
          root.requestAnimationFrame(() => api.redraw());
        } else {
          setTimeout(() => api.redraw(), 16);
        }
      },
      destroy() {
        state.destroyed = true;

        if (state.atlasController && typeof state.atlasController.cancel === "function") {
          state.atlasController.cancel();
        }

        if (typeof api.unbindControls === "function") api.unbindControls();

        if (frame.parentNode) {
          frame.parentNode.removeChild(frame);
        }
      },
      unbindControls: null
    };

    api.unbindControls = bindPointerDrag(canvas, api);
    api.controlsBound = true;
    state.controlsBound = true;

    syncReceiptDataset(api);
    drawFallbackShell(canvas, state);

    updateLoadingStatus(api, {
      stages: {
        shellMounted: "ready",
        touchBound: "ready",
        runtimeTable: "loading"
      }
    });

    if (typeof options.onStatus === "function") {
      options.onStatus("mounted-runtime-table-shell-first", {
        mounted: true,
        canvasFound: true,
        controlsBound: true,
        interactiveShellMounted: true,
        runtimeTablePrewired: true,
        runtimeTableContract: LAB_RUNTIME_TABLE_CONTRACT,
        runtimeTableAcceptedContracts: LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.slice(),
        tripleGCoherencePrewired: true,
        receiptExportReady: true,
        channelLoadProofReady: true,
        receiptMode: state.receiptMode,
        semiconductorOutlet: true,
        canvasDecidesNothing: true,
        channelMultiplexReady: false,
        atlasReady: false,
        atlasBuilding: false,
        imageRendered: false,
        coherenceChecked: false,
        frames: state.frames,
        contract: CONTRACT,
        receipt: RECEIPT
      });
    }

    const startRuntimeTableSequence = () => {
      if (state.destroyed) return;

      ensureRuntimeTable(options).then(() => {
        if (state.destroyed) return;

        const runtimeApi = getRuntimeTableApi();
        const runtimeReady = Boolean(
          runtimeApi &&
            runtimeTableContractAccepted(runtimeApi) &&
            typeof runtimeApi.createHearthChannelTable === "function"
        );

        state.runtimeTableLoaded = runtimeReady;
        state.labRuntimeTableContract = runtimeApi && runtimeApi.contract ? runtimeApi.contract : "";
        state.tripleGDiagnosticAvailable = runtimeTableV2Available(runtimeApi);

        api.runtimeTableConsumed = runtimeReady;
        api.runtimeTableContract = state.labRuntimeTableContract || LAB_RUNTIME_TABLE_CONTRACT;
        api.tripleGDiagnosticConsumed = state.tripleGDiagnosticAvailable;
        api.coherenceDiagnosticAvailable = state.tripleGDiagnosticAvailable;

        canvas.dataset.hearthRuntimeTableLoaded = String(runtimeReady);
        canvas.dataset.hearthRuntimeTableContract = state.labRuntimeTableContract || "";
        canvas.dataset.hearthRuntimeTableAcceptedContracts = LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.join(",");
        canvas.dataset.hearthCanvasConsumesLabRuntimeTable = "true";
        canvas.dataset.hearthTripleGDiagnosticAvailable = String(state.tripleGDiagnosticAvailable);
        canvas.dataset.hearthTripleGDiagnosticContract = state.tripleGDiagnosticAvailable ? LAB_RUNTIME_TABLE_CONTRACT_V2 : "";

        updateLoadingStatus(api, {
          stages: {
            runtimeTable: runtimeReady ? "ready" : "blocking",
            land: "loading",
            water: "loading",
            air: "loading"
          },
          error: runtimeReady ? "" : "Lab Runtime Table could not be loaded."
        });

        if (!runtimeReady) {
          state.runtimeHandoff = "BLOCKING";
          state.runtimeAllowed = false;

          updateLoadingStatus(api, {
            runtimeHandoff: "BLOCKING",
            runtimeAllowed: false,
            stages: {
              validation: "blocking",
              construction: "blocked",
              atlas: "blocked",
              projection: "blocked",
              coherence: "blocked"
            }
          });

          return;
        }

        ensureChannelScripts(options).then((channelResults) => {
          if (state.destroyed) return;

          updateChannelLoadProof(api, channelResults);

          state.landChannelLoaded = Boolean(getLandChannel());
          state.waterChannelLoaded = Boolean(getWaterChannel());
          state.airChannelLoaded = Boolean(getAirChannel());
          state.channelMultiplexReady = state.landChannelLoaded && state.waterChannelLoaded && state.airChannelLoaded;

          api.channelMultiplexReady = state.channelMultiplexReady;

          canvas.dataset.hearthLandChannelLoaded = String(state.landChannelLoaded);
          canvas.dataset.hearthWaterChannelLoaded = String(state.waterChannelLoaded);
          canvas.dataset.hearthAirChannelLoaded = String(state.airChannelLoaded);
          canvas.dataset.hearthCanvasChannelMultiplexReady = String(state.channelMultiplexReady);

          updateLoadingStatus(api, {
            stages: {
              land: state.landChannelLoaded ? "ready" : "fallback",
              water: state.waterChannelLoaded ? "ready" : "fallback",
              air: state.airChannelLoaded ? "ready" : "fallback",
              validation: "validating"
            }
          });

          const runtimeTable = createHearthRuntimeTable();
          state.runtimeTableInstance = runtimeTable;
          api.hearthRuntimeTableInstance = Boolean(runtimeTable);

          const ledger = runRuntimeTable(runtimeTable);
          const handoff = ledger && ledger.handoff ? ledger.handoff : "BLOCKING";
          const runtimeAllowed = Boolean(ledger && ledger.runtimeAllowed && getHandoffAllowed(handoff));

          state.runtimeTableLedger = ledger;
          state.runtimeHandoff = handoff;
          state.runtimeAllowed = runtimeAllowed;

          api.runtimeAllowed = runtimeAllowed;
          api.runtimeHandoff = handoff;
          api.runtimeTableLedger = ledger;

          canvas.dataset.hearthRuntimeTableHandoff = handoff;
          canvas.dataset.hearthRuntimeTableRuntimeAllowed = String(runtimeAllowed);
          canvas.dataset.hearthRuntimeTableSet = String(runtimeAllowed);
          canvas.dataset.hearthRuntimeTableLedgerReady = "true";

          updateLoadingStatus(api, {
            runtimeTableLedger: ledger,
            runtimeHandoff: handoff,
            runtimeAllowed,
            stages: {
              validation: runtimeAllowed ? "ready" : String(handoff).toLowerCase(),
              construction: runtimeAllowed ? "pass" : String(handoff).toLowerCase(),
              atlas: runtimeAllowed ? "building" : "blocked",
              projection: runtimeAllowed ? "pending" : "blocked",
              coherence: runtimeAllowed ? "pending" : "blocked"
            }
          });

          if (typeof options.onStatus === "function") {
            options.onStatus("runtime-table-resolved", {
              mounted: true,
              canvasFound: true,
              controlsBound: true,
              runtimeTableConsumed: true,
              runtimeTableContract: state.labRuntimeTableContract,
              runtimeTableAcceptedContracts: LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.slice(),
              tripleGDiagnosticAvailable: state.tripleGDiagnosticAvailable,
              hearthRuntimeTableInstance: Boolean(runtimeTable),
              runtimeAllowed,
              handoff,
              ledger,
              channelLoadResults: state.channelLoadResults,
              waterLoadProof: {
                waterScriptRequested: state.waterScriptRequested,
                waterScriptLoaded: state.waterScriptLoaded,
                waterGlobalPresent: state.waterGlobalPresent,
                waterActualContract: state.waterActualContract,
                waterExpectedContract: state.waterExpectedContract,
                waterSampleProbeOk: state.waterSampleProbeOk,
                waterSampleProbeCoordinatesOk: state.waterSampleProbeCoordinatesOk,
                waterSampleProbeFlagsOk: state.waterSampleProbeFlagsOk,
                waterSampleProbeError: state.waterSampleProbeError,
                waterFailureCoordinate: getWaterFailureCoordinate(state)
              },
              receiptMode: state.receiptMode,
              semiconductorOutlet: true,
              canvasDecidesNothing: true,
              constructionReadyIsNotCoherencePass: true,
              imageRenderedIsNotCoherencePass: true,
              contract: CONTRACT,
              receipt: RECEIPT
            });
          }

          if (!runtimeAllowed) {
            drawFallbackShell(canvas, state);
            return;
          }

          state.atlasBuilding = true;
          api.atlasBuilding = true;
          canvas.dataset.hearthCanvasAtlasBuilding = "true";

          state.atlasController = buildAtlasAsync(
            {
              width: options.atlasWidth || 384,
              height: options.atlasHeight || 192,
              rowsPerChunk: options.rowsPerChunk || 2,
              allowLargeTexture: options.allowLargeTexture === true
            },
            {
              onProgress(progress) {
                if (state.destroyed) return;

                state.atlasProgress = progress;
                canvas.dataset.hearthCanvasAtlasProgress = String(progress);

                updateLoadingStatus(api, {
                  atlasProgress: progress,
                  stages: {
                    atlas: "building"
                  }
                });

                if (typeof options.onStatus === "function" && progress > 0 && progress < 1) {
                  options.onStatus("atlas-progress", {
                    mounted: true,
                    canvasFound: true,
                    controlsBound: true,
                    runtimeTableConsumed: true,
                    runtimeAllowed: true,
                    handoff,
                    semiconductorOutlet: true,
                    canvasDecidesNothing: true,
                    channelMultiplexReady: state.channelMultiplexReady,
                    atlasReady: false,
                    atlasBuilding: true,
                    atlasProgress: progress,
                    imageRendered: false,
                    coherenceChecked: false,
                    receiptMode: state.receiptMode,
                    frames: state.frames,
                    contract: CONTRACT,
                    receipt: RECEIPT
                  });
                }
              },
              onComplete(atlas) {
                if (state.destroyed) return;

                state.atlas = atlas;
                state.atlasReady = true;
                state.atlasBuilding = false;
                state.atlasProgress = 1;
                state.fallbackActive = false;
                state.imageRendered = true;

                api.atlasReady = true;
                api.atlasBuilding = false;
                api.cachedAtlasProjection = true;
                api.imageRendered = true;

                canvas.dataset.hearthCanvasAtlasReady = "true";
                canvas.dataset.hearthCanvasAtlasBuilding = "false";
                canvas.dataset.hearthCanvasAtlasProgress = "1";
                canvas.dataset.hearthCanvasCachedAtlasProjection = "true";
                canvas.dataset.hearthCanvasImageRendered = "true";
                canvas.dataset.visualPassClaimed = "false";

                api.requestRedraw();

                updateLoadingStatus(api, {
                  atlasProgress: 1,
                  imageRendered: true,
                  stages: {
                    atlas: "ready",
                    projection: "ready",
                    handoff: "complete",
                    coherence: state.tripleGDiagnosticAvailable ? "running" : "unavailable"
                  }
                });

                const coherenceReport = runTripleGDiagnostic(api);
                buildDiagnosticExport(api);

                if (typeof options.onStatus === "function") {
                  options.onStatus("triple-g-coherence-diagnostic-complete", {
                    mounted: true,
                    canvasFound: true,
                    controlsBound: true,
                    runtimeTableConsumed: true,
                    runtimeAllowed: true,
                    handoff,
                    imageRendered: true,
                    coherenceChecked: Boolean(coherenceReport),
                    coherentExpressionPass: Boolean(coherenceReport && coherenceReport.coherentExpressionPass),
                    coherenceStatus: coherenceReport && coherenceReport.coherenceStatus,
                    coherenceScore: coherenceReport && coherenceReport.coherenceScore,
                    failedCheckpoints: coherenceReport && coherenceReport.failedCheckpoints,
                    renewalTargets: coherenceReport && coherenceReport.renewalTargets,
                    waterFailureCoordinate: getWaterFailureCoordinate(state),
                    diagnosticExportAvailable: state.diagnosticExportAvailable,
                    diagnosticExportLength: state.diagnosticExportLength,
                    receiptMode: state.receiptMode,
                    contract: CONTRACT,
                    receipt: RECEIPT
                  });

                  options.onStatus("runtime-table-handoff-complete", {
                    mounted: true,
                    canvasFound: true,
                    controlsBound: true,
                    runtimeTableConsumed: true,
                    runtimeAllowed: true,
                    handoff,
                    atlasReady: true,
                    atlasBuilding: false,
                    atlasProgress: 1,
                    imageRendered: true,
                    coherentExpressionPass: state.coherentExpressionPass,
                    coherenceStatus: state.coherenceStatus,
                    coherenceScore: state.coherenceScore,
                    waterFailureCoordinate: getWaterFailureCoordinate(state),
                    receiptMode: state.receiptMode,
                    diagnosticExportAvailable: state.diagnosticExportAvailable,
                    frames: state.frames,
                    contract: CONTRACT,
                    receipt: RECEIPT
                  });
                }
              },
              onError(error) {
                if (state.destroyed) return;

                state.atlasBuilding = false;
                state.atlasReady = false;
                state.imageRendered = false;
                state.fallbackActive = true;

                api.atlasBuilding = false;
                api.atlasReady = false;
                api.imageRendered = false;

                canvas.dataset.hearthCanvasAtlasBuilding = "false";
                canvas.dataset.hearthCanvasAtlasReady = "false";
                canvas.dataset.hearthCanvasImageRendered = "false";
                canvas.dataset.hearthCanvasAtlasError = error && error.message ? error.message : String(error);

                drawFallbackShell(canvas, state);

                updateLoadingStatus(api, {
                  error: error && error.message ? error.message : String(error),
                  imageRendered: false,
                  stages: {
                    atlas: "fallback",
                    projection: "fallback",
                    coherence: "blocked"
                  }
                });

                if (typeof options.onStatus === "function") {
                  options.onStatus("atlas-error-fallback-held", {
                    mounted: true,
                    canvasFound: true,
                    controlsBound: true,
                    runtimeTableConsumed: true,
                    runtimeAllowed,
                    handoff,
                    atlasReady: false,
                    atlasBuilding: false,
                    imageRendered: false,
                    error: error && error.message ? error.message : String(error),
                    receiptMode: state.receiptMode,
                    frames: state.frames,
                    contract: CONTRACT,
                    receipt: RECEIPT
                  });
                }
              }
            }
          );
        });
      });
    };

    setTimeout(startRuntimeTableSequence, 0);

    return api;
  }

  const mount = (target, options = {}) => createShellFirstMount(target, options);

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "hearth-water-channel-cache-key-and-load-proof-canvas",
      status: "active",
      primaryTarget: "/assets/hearth/hearth.canvas.js",
      role: "Hearth canvas loader proof, Runtime Table consumer, Triple G diagnostic consumer, receipt export surface",
      runtimeTableConsumed: true,
      runtimeTableContract: LAB_RUNTIME_TABLE_CONTRACT,
      preferredLabRuntimeTableContract: LAB_RUNTIME_TABLE_CONTRACT_V2,
      previousLabRuntimeTableContract: LAB_RUNTIME_TABLE_CONTRACT_V1,
      labRuntimeTableAcceptedContracts: LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.slice(),
      runtimeTableCanonicalOwner: "Dexter Lab",
      runtimeTableCanonicalPath: LAB_RUNTIME_TABLE_PATH,
      hearthRuntimeTableInstance: true,
      tripleGDiagnosticConsumed: true,
      coherenceDiagnosticAvailable: runtimeTableV2Available(),
      perChannelCacheKeys: {
        land: CHANNEL_CACHE_KEYS.land,
        water: CHANNEL_CACHE_KEYS.water,
        air: CHANNEL_CACHE_KEYS.air
      },
      waterLoadProofCoordinates: [
        "Coordinate 0 — File request",
        "Coordinate 1 — Script load",
        "Coordinate 2 — Global export",
        "Coordinate 3 — Direct sample probe",
        "Coordinate 4 — Runtime Table validation",
        "Coordinate 5 — Canvas multiplex readiness",
        "Coordinate 6 — Triple G receipt",
        "Coordinate 7 — Diagnostic export"
      ],
      receiptModes: Object.values(RECEIPT_MODES),
      receiptVisibilityToggle: true,
      receiptExpansionToggle: true,
      diagnosticCopyExport: true,
      diagnosticExportFormat: "plain-text",
      diagnosticExportHeader: "HEARTH_DIAGNOSTIC_RECEIPT_EXPORT",
      constructionReadyIsNotCoherencePass: true,
      imageRenderedIsNotCoherencePass: true,
      canvasDecidesNothing: true,
      semiconductorOutlet: true,
      shellFirstMount: true,
      nonBlockingMount: true,
      asyncRuntimeTableLoad: true,
      asyncChannelLoad: true,
      asyncAtlasBuild: true,
      chunkedAtlasBuild: true,
      fallbackShellImmediate: true,
      touchDragBoundImmediately: true,
      pointerDragBoundImmediately: true,
      mountReturnsApiObject: true,
      childChannels: [
        "/assets/hearth/hearth.land.channel.js",
        "/assets/hearth/hearth.water.channel.js",
        "/assets/hearth/hearth.air.channel.js"
      ],
      childContracts: {
        land: LAND_CONTRACT,
        water: WATER_CONTRACT,
        air: AIR_CONTRACT
      },
      allowedHandoffs: ALLOWED_HANDOFFS.slice(),
      compositeOrder: [
        "planet-body-shell",
        "land-channel",
        "water-channel",
        "air-channel",
        "rim-lighting"
      ],
      law: [
        "Runtime Table and Triple G standards belong to Dexter Lab",
        "water truth belongs to the water child",
        "canvas proves whether water is reachable",
        "canvas consumes Runtime Table",
        "canvas consumes Triple G diagnostic",
        "canvas displays and exports receipt",
        "canvas decides no channel truth",
        "image rendered is not coherent expression pass",
        "construction ready is not coherent expression pass",
        "receipt visibility is a UI concern only"
      ],
      owns: [
        "visible-canvas-shell",
        "neutral-loading-shell",
        "instrumented-formation-panel",
        "receipt-visibility-toggle",
        "receipt-expanded-view",
        "diagnostic-export-generation",
        "diagnostic-copy-action",
        "per-channel-cache-key-loading",
        "water-script-load-proof",
        "water-global-export-proof",
        "water-direct-sample-proof",
        "water-coordinate-proof",
        "water-authority-flag-proof",
        "fallback-shell-drawing",
        "pointer-touch-drag-binding",
        "rotation-state",
        "redraw-scheduling",
        "async-runtime-table-loading",
        "async-channel-loading",
        "runtime-table-consumption",
        "triple-g-diagnostic-consumption",
        "async-atlas-build",
        "cached-atlas-projection",
        "channel-multiplexing",
        "semiconductor-outlet-composition",
        "spherical-alpha-containment-for-visible-canvas-output",
        "coherence-report-exposure"
      ],
      doesNotOwn: [
        "Runtime Table canonical standard",
        "Triple G diagnostic canonical standard",
        "water-truth",
        "land-truth",
        "air-truth",
        "tectonic-cause",
        "elevation-generation",
        "composition-classification",
        "hydrology-classification",
        "material-palette-authority",
        "ocean-authority-generation",
        "route-orchestration",
        "runtime-motion-authority",
        "external-controls-authority",
        "final-visual-pass-claim"
      ],
      failSoftRules: [
        "mount-visible-shell-before-runtime-table-load",
        "bind-controls-before-runtime-table-load",
        "return-api-before-runtime-table-load",
        "accept-lab-runtime-table-v2",
        "accept-lab-runtime-table-v1-as-fallback",
        "use-explicit-water-cache-key",
        "run-water-direct-probe-before-runtime-table",
        "include-water-loader-proof-in-export",
        "run-triple-g-diagnostic-after-image-render-when-v2-available",
        "if-coherence-fails-keep-receipt-available",
        "receipt-may-hide-with-user-toggle",
        "expanded-receipt-must-be-selectable",
        "copy-export-must-be-plain-text",
        "no-blank-planet",
        "no-map-portal-freeze",
        "no-raw-rectangle-fallback"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    sample,
    read,
    compose,
    composeSample,
    composePixel,
    getPixel,
    getColor,

    createShellCanvas,
    drawFallbackShell,
    bindPointerDrag,
    buildAtlasAsync,
    createShellFirstMount,

    createTextureCanvas,
    createSphereTextureCanvas,
    createAtlasTextureCanvas,
    createCanvas,
    createPlanetTexture,
    createTexture,
    buildTexture,
    getTextureCanvas,

    renderSphereFromAtlas,
    paintToCanvas,
    renderToCanvas,
    drawToCanvas,
    render,
    paint,
    mount,

    ensureRuntimeTable,
    ensureChannelScripts,
    createHearthRuntimeTable,
    runRuntimeTable,
    runTripleGDiagnostic,
    buildCoherenceInput,
    updateCoherenceStatus,
    updateLoadingStatus,
    renderLoadingPanel,
    formatRuntimeTableIssues,
    formatCoherenceIssues,
    getCoherenceReceipt,
    getReceipt,

    getPerChannelCacheKey,
    loadChannelScriptWithProof,
    probeWaterChannel,
    updateChannelLoadProof,
    formatChannelLoadProof,

    setReceiptMode,
    toggleReceiptVisibility,
    toggleReceiptExpansion,
    buildDiagnosticExport,
    copyDiagnosticExport,
    getDiagnosticExport,
    renderReceiptControls,
    renderExpandedReceipt,
    syncReceiptDataset,

    supportsTrueShellFirstMount: true,
    supportsNonBlockingMount: true,
    supportsAsyncRuntimeTableLoad: true,
    supportsLabRuntimeTableConsumption: true,
    supportsLabRuntimeTableV2: true,
    supportsLabRuntimeTableV1Fallback: true,
    supportsTripleGCoherenceDiagnosticConsumption: true,
    supportsConstructionReadyImageRenderedCoherentExpressionSplit: true,
    supportsReceiptVisibilityToggle: true,
    supportsReceiptExpansionToggle: true,
    supportsDiagnosticCopyExport: true,
    supportsPlainTextDiagnosticExport: true,
    supportsPerChannelCacheKeys: true,
    supportsWaterChannelLoadProof: true,
    supportsWaterDirectProbe: true,
    supportsWaterFailureCoordinate: true,
    supportsAsyncAtlasBuild: true,
    supportsChunkedAtlasBuild: true,
    supportsImmediateFallbackShell: true,
    supportsImmediateTouchDrag: true,
    supportsImmediatePointerDrag: true,
    supportsChannelMultiplex: true,
    supportsSemiconductorOutlet: true,

    receiptModes: RECEIPT_MODES,
    channelCacheKeys: CHANNEL_CACHE_KEYS,

    runtimeTableConsumed: true,
    runtimeTableContract: LAB_RUNTIME_TABLE_CONTRACT,
    preferredLabRuntimeTableContract: LAB_RUNTIME_TABLE_CONTRACT_V2,
    previousLabRuntimeTableContract: LAB_RUNTIME_TABLE_CONTRACT_V1,
    labRuntimeTableAcceptedContracts: LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.slice(),
    runtimeTableCanonicalOwner: "Dexter Lab",
    runtimeTableCanonicalPath: LAB_RUNTIME_TABLE_PATH,
    hearthRuntimeTableInstance: true,

    tripleGDiagnosticConsumed: true,
    coherenceDiagnosticAvailable: false,
    coherenceChecked: false,
    coherenceStatus: "PENDING",
    coherenceScore: 0,
    coherentExpressionPass: false,
    failedCheckpoints: [],
    renewalTargets: [],

    constructionReadyIsNotCoherencePass: true,
    imageRenderedIsNotCoherencePass: true,
    semiconductorOutlet: true,
    canvasDecidesNothing: true,
    consumesLandChannel: true,
    consumesWaterChannel: true,
    consumesAirChannel: true,

    landChannelContract: LAND_CONTRACT,
    waterChannelContract: WATER_CONTRACT,
    airChannelContract: AIR_CONTRACT,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;

  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;
  root.HEARTH_CANVAS_RECEIPT = getReceipt();
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;

  root.HEARTH_CANVAS_TRUE_SHELL_FIRST = true;
  root.HEARTH_CANVAS_NONBLOCKING_MOUNT = true;
  root.HEARTH_CANVAS_ASYNC_ATLAS_BUILD = true;
  root.HEARTH_CANVAS_SUPPORTS_TOUCH_DRAG = true;
  root.HEARTH_CANVAS_SUPPORTS_POINTER_DRAG = true;
  root.HEARTH_CANVAS_CHANNEL_MULTIPLEX = true;
  root.HEARTH_CANVAS_SEMICONDUCTOR_OUTLET = true;
  root.HEARTH_CANVAS_DECIDES_NOTHING = true;
  root.HEARTH_CANVAS_CONSUMES_LAB_RUNTIME_TABLE = true;
  root.HEARTH_CANVAS_CONSUMES_LAB_TRIPLE_G_DIAGNOSTIC = true;
  root.HEARTH_CANVAS_RUNTIME_TABLE_CONTRACT = LAB_RUNTIME_TABLE_CONTRACT;
  root.HEARTH_CANVAS_RUNTIME_TABLE_ACCEPTED_CONTRACTS = LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.slice();
  root.HEARTH_CANVAS_RECEIPT_MODES = RECEIPT_MODES;
  root.HEARTH_CANVAS_CHANNEL_CACHE_KEYS = CHANNEL_CACHE_KEYS;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    root.document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasTrueShellFirst = "true";
    root.document.documentElement.dataset.hearthCanvasNonBlockingMount = "true";
    root.document.documentElement.dataset.hearthCanvasAsyncAtlasBuild = "true";
    root.document.documentElement.dataset.hearthCanvasSupportsTouchDrag = "true";
    root.document.documentElement.dataset.hearthCanvasSupportsPointerDrag = "true";
    root.document.documentElement.dataset.hearthCanvasMountReturnsApiObject = "true";
    root.document.documentElement.dataset.hearthCanvasChannelMultiplex = "true";
    root.document.documentElement.dataset.hearthCanvasSemiconductorOutlet = "true";
    root.document.documentElement.dataset.hearthCanvasDecidesNothing = "true";
    root.document.documentElement.dataset.hearthRuntimeTablePrewired = "true";
    root.document.documentElement.dataset.hearthRuntimeTableContract = LAB_RUNTIME_TABLE_CONTRACT;
    root.document.documentElement.dataset.hearthRuntimeTableAcceptedContracts = LAB_RUNTIME_TABLE_ACCEPTED_CONTRACTS.join(",");
    root.document.documentElement.dataset.hearthRuntimeTableCanonicalOwner = "Dexter Lab";
    root.document.documentElement.dataset.hearthCanvasConsumesLabRuntimeTable = "true";
    root.document.documentElement.dataset.hearthCanvasConsumesLabTripleGDiagnostic = "true";
    root.document.documentElement.dataset.hearthTripleGDiagnosticAvailable = String(runtimeTableV2Available());
    root.document.documentElement.dataset.hearthTripleGDiagnosticContract = LAB_RUNTIME_TABLE_CONTRACT_V2;
    root.document.documentElement.dataset.hearthTripleGCoherenceChecked = "false";
    root.document.documentElement.dataset.hearthTripleGCoherentExpressionPass = "false";
    root.document.documentElement.dataset.constructionReadyIsNotCoherencePass = "true";
    root.document.documentElement.dataset.imageRenderedIsNotCoherencePass = "true";
    root.document.documentElement.dataset.hearthReceiptMode = RECEIPT_MODES.COMPACT;
    root.document.documentElement.dataset.hearthReceiptVisible = "true";
    root.document.documentElement.dataset.hearthReceiptExpanded = "false";
    root.document.documentElement.dataset.hearthDiagnosticExportAvailable = "false";
    root.document.documentElement.dataset.hearthDiagnosticExportCopied = "false";
    root.document.documentElement.dataset.hearthDiagnosticExportLength = "0";
    root.document.documentElement.dataset.hearthDiagnosticExportError = "";
    root.document.documentElement.dataset.hearthChannelLoadProofReady = "false";
    root.document.documentElement.dataset.hearthWaterScriptRequested = "false";
    root.document.documentElement.dataset.hearthWaterScriptLoaded = "false";
    root.document.documentElement.dataset.hearthWaterScriptPath = "/assets/hearth/hearth.water.channel.js";
    root.document.documentElement.dataset.hearthWaterScriptCacheKey = CHANNEL_CACHE_KEYS.water;
    root.document.documentElement.dataset.hearthWaterScriptError = "";
    root.document.documentElement.dataset.hearthWaterGlobalPresent = "false";
    root.document.documentElement.dataset.hearthWaterActualContract = "";
    root.document.documentElement.dataset.hearthWaterExpectedContract = WATER_CONTRACT;
    root.document.documentElement.dataset.hearthWaterSampleProbeOk = "false";
    root.document.documentElement.dataset.hearthWaterSampleProbeContract = "";
    root.document.documentElement.dataset.hearthWaterSampleProbeCoordinatesOk = "false";
    root.document.documentElement.dataset.hearthWaterSampleProbeFlagsOk = "false";
    root.document.documentElement.dataset.hearthWaterSampleProbeError = "";
    root.document.documentElement.dataset.hearthCanvasLandChannelContract = LAND_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasWaterChannelContract = WATER_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasAirChannelContract = AIR_CONTRACT;
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.routeMutation = "false";
    root.document.documentElement.dataset.runtimeMutation = "false";
    root.document.documentElement.dataset.controlsMutation = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
