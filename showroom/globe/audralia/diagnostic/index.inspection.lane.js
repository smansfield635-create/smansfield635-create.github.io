// /showroom/globe/audralia/diagnostic/index.inspection.lane.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v2
// Full-file replacement.
// Passive diagnostic inspection-lane authority only.
// No canonical diagnostic-state ownership. No rendering ownership. No DOM event ownership.
// No participant execution. No mutation. No report construction. No readiness claim.

(function installAudraliaDiagnosticInspectionLane(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root && root.document ? root.document : null;

  var CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v1";
  var VERSION = "2.0.0";
  var FILE = "/showroom/globe/audralia/diagnostic/index.inspection.lane.js";

  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_RECEIPT_v2";
  var INSPECTION_SCHEMA = "AUDRALIA_BOUNDED_DIAGNOSTIC_INSPECTION_v2";
  var LANE_SCHEMA = "AUDRALIA_BOUNDED_DIAGNOSTIC_EVIDENCE_LANE_v2";
  var ERROR_SCHEMA = "AUDRALIA_BOUNDED_DIAGNOSTIC_INSPECTION_ERROR_v2";

  var LIMITS = Object.freeze({
    maxDepth: 7,
    maxNodes: 256,
    maxKeys: 89,
    maxArray: 89,
    maxString: 4096,
    maxTotalString: 32768,
    maxPathSegments: 32,
    maxParticipants: 89,
    maxAliases: 34,
    maxMethods: 34,
    maxStatusMatches: 34,
    maxErrors: 89
  });

  var NO_CLAIMS = deepFreeze({
    canonicalStateOwned: false,
    reportAuthorityOwned: false,
    readInterpretationOwned: false,
    renderingOwned: false,
    controlsOwned: false,
    eventOwnershipClaimed: false,
    participantExecutionAuthorized: false,
    conductorExecutionAuthorized: false,
    directExecutionAuthorized: false,
    cycleExecutionAuthorized: false,
    productionMutationAuthorized: false,
    runtimeRepairAuthorized: false,
    rendererRepairAuthorized: false,
    canvasRepairAuthorized: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    runtimePassClaimed: false,
    rendererPassClaimed: false,
    cyclePassClaimed: false,
    f21Claimed: false,
    webGL: false,
    webGPU: false,
    generatedImage: false,
    graphicBox: false
  });

  var installedAt = nowIso();
  var actionCount = 0;
  var lastAction = null;

  var CONTROL_FAMILY_DEFAULTS = Object.freeze({
    bridgeAliases: Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE",
      "AUDRALIA.diagnosticControlBridge"
    ]),
    controlsAliases: Object.freeze([
      "AUDRALIA_DROP_WITH_READ_CONTROL_PANEL",
      "AUDRALIA.dropWithReadControlPanel"
    ]),
    interpreterAliases: Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE",
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY",
      "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
      "AUDRALIA.diagnosticEngine",
      "AUDRALIA.dropWithReadDiagnosticObservatory",
      "AUDRALIA.diagnosticRouteController"
    ]),
    railAliases: Object.freeze([
      "AUDRALIA_DIAGNOSTIC_RAIL",
      "AUDRALIA.diagnosticRail"
    ]),
    receiptAliases: Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE_RECEIPT",
      "AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT",
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_RECEIPT",
      "AUDRALIA_DIAGNOSTIC_RAIL_RECEIPT"
    ])
  });

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function nowMs() {
    try {
      return root.performance && typeof root.performance.now === "function"
        ? root.performance.now()
        : Date.now();
    } catch (_error) {
      return Date.now();
    }
  }

  function isObjectLike(value) {
    return Boolean(value && (typeof value === "object" || typeof value === "function"));
  }

  function deepFreeze(value, seen) {
    if (!isObjectLike(value)) return value;
    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);
    try {
      Object.getOwnPropertyNames(value).forEach(function freezeKey(key) {
        try { deepFreeze(value[key], memory); } catch (_error) {}
      });
      Object.freeze(value);
    } catch (_error) {}
    return value;
  }

  function trimString(value, max) {
    var limit = typeof max === "number" ? max : LIMITS.maxString;
    var text = String(value === null || value === undefined ? "" : value);
    return text.length <= limit ? text : text.slice(0, limit) + "…";
  }

  function clone(value, ctx) {
    var context = ctx || { seen: [], totalString: 0, truncated: false, omitted: 0 };
    if (value === null || value === undefined) return value;
    if (typeof value === "boolean" || typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "bigint") return String(value);
    if (typeof value === "string") {
      var remaining = Math.max(0, LIMITS.maxTotalString - context.totalString);
      var out = trimString(value, Math.min(LIMITS.maxString, remaining));
      context.totalString += out.length;
      if (out.length < value.length) context.truncated = true;
      return out;
    }
    if (typeof value === "function") return { type: "Function", name: value.name || "anonymous" };
    if (!isObjectLike(value)) return null;
    if (context.seen.indexOf(value) !== -1) return "[Circular]";
    context.seen.push(value);

    if (isHost(value)) return summarizeHostObject(value);

    var output = Array.isArray(value) ? [] : {};
    var keys;
    try { keys = Array.isArray(value) ? value.map(function (_, i) { return String(i); }) : Object.keys(value); }
    catch (_error) { return { unreadable: true, reason: "OBJECT_KEYS_THROW" }; }

    var limit = Math.min(keys.length, Array.isArray(value) ? LIMITS.maxArray : LIMITS.maxKeys);
    for (var i = 0; i < limit; i += 1) {
      var key = keys[i];
      var read = safeReadProperty(value, key, { allowAccessor: false, searchPrototype: false });
      if (!read.ok) output[key] = { unreadable: true, reason: "PROPERTY_READ_THROW", error: read.error };
      else if (read.blockedAccessor) output[key] = { unreadable: true, reason: "ACCESSOR_BLOCKED" };
      else output[key] = clone(read.value, context);
    }
    if (keys.length > limit) {
      context.truncated = true;
      context.omitted += keys.length - limit;
    }
    return output;
  }

  function frozenClone(value) {
    return deepFreeze(clone(value));
  }

  function makeError(action, error, detail, path, property) {
    return deepFreeze({
      schema: ERROR_SCHEMA,
      action: action || "UNKNOWN",
      path: path || null,
      property: property || null,
      message: trimString(error && error.message ? error.message : error, 2048),
      stack: error && error.stack ? trimString(error.stack, 8192) : null,
      detail: detail === undefined ? null : trimString(typeof detail === "string" ? detail : safeJson(detail), 4096),
      occurredAt: nowIso(),
      noClaims: NO_CLAIMS
    });
  }

  function safeJson(value) {
    try { return JSON.stringify(clone(value), null, 2); } catch (_error) { return String(value); }
  }

  function descriptorOf(object, key, options) {
    var config = options || {};
    var cursor = object;
    var depth = 0;
    var maxDepth = typeof config.maxPrototypeDepth === "number" ? config.maxPrototypeDepth : 4;
    var searchPrototype = config.searchPrototype !== false;

    while (cursor !== null && cursor !== undefined && depth <= maxDepth) {
      try {
        var descriptor = Object.getOwnPropertyDescriptor(Object(cursor), key);
        if (descriptor) return { ok: true, present: true, descriptor: descriptor, owner: cursor, depth: depth };
      } catch (error) {
        return { ok: false, present: false, error: makeError("descriptorOf", error, null, null, key), depth: depth };
      }
      if (!searchPrototype) break;
      try { cursor = Object.getPrototypeOf(cursor); } catch (error2) {
        return { ok: false, present: false, error: makeError("descriptorOf.prototype", error2, null, null, key), depth: depth };
      }
      depth += 1;
    }
    return { ok: true, present: false, descriptor: null, owner: null, depth: depth };
  }

  function safeReadProperty(object, key, options) {
    if (object === null || object === undefined) {
      return { ok: true, present: false, value: null, blockedAccessor: false, error: null };
    }

    var config = options || {};
    var descriptor = descriptorOf(object, key, config);
    if (!descriptor.ok) return { ok: false, present: false, value: null, blockedAccessor: false, error: descriptor.error };
    if (!descriptor.present) return { ok: true, present: false, value: null, blockedAccessor: false, error: null };

    if (Object.prototype.hasOwnProperty.call(descriptor.descriptor, "value")) {
      return { ok: true, present: true, value: descriptor.descriptor.value, blockedAccessor: false, error: null };
    }

    if (config.allowAccessor !== true) {
      return { ok: true, present: true, value: null, blockedAccessor: true, error: null };
    }

    try {
      return {
        ok: true,
        present: true,
        value: typeof descriptor.descriptor.get === "function" ? descriptor.descriptor.get.call(object) : undefined,
        blockedAccessor: false,
        error: null
      };
    } catch (error3) {
      return { ok: false, present: true, value: null, blockedAccessor: false, error: makeError("safeReadProperty.accessor", error3, null, null, key) };
    }
  }

  function safeReadHostProperty(object, key) {
    try {
      return { ok: true, present: object !== null && object !== undefined, value: object ? object[key] : null, error: null };
    } catch (error) {
      return { ok: false, present: true, value: null, error: makeError("safeReadHostProperty", error, null, null, key) };
    }
  }

  function safeReadPath(path, base, options) {
    var parts = Array.isArray(path) ? path.slice() : String(path || "").split(".").filter(Boolean);
    if (parts.length > LIMITS.maxPathSegments) {
      return { ok: false, present: false, value: null, blockedAccessor: false, error: makeError("safeReadPath", new Error("MAX_PATH_SEGMENTS_EXCEEDED"), { path: path }) };
    }

    var cursor = base || root;
    for (var i = 0; i < parts.length; i += 1) {
      var read = safeReadProperty(cursor, parts[i], options || { allowAccessor: false, searchPrototype: true });
      if (!read.ok) return { ok: false, present: false, value: null, blockedAccessor: false, failedSegment: parts[i], error: read.error };
      if (!read.present) return { ok: true, present: false, value: null, blockedAccessor: false, failedSegment: parts[i], error: null };
      if (read.blockedAccessor) return { ok: true, present: true, value: null, blockedAccessor: true, failedSegment: parts[i], error: null };
      cursor = read.value;
    }

    return { ok: true, present: true, value: cursor, blockedAccessor: false, failedSegment: null, error: null };
  }

  function resolveAlias(aliases, base) {
    var list = Array.isArray(aliases) ? aliases.slice(0, LIMITS.maxAliases) : [];
    for (var i = 0; i < list.length; i += 1) {
      var result = safeReadPath(list[i], base || root, { allowAccessor: false, searchPrototype: true });
      if (result.ok && result.present && !result.blockedAccessor) return { found: true, alias: list[i], value: result.value, blockedAccessor: false, error: null };
      if (result.blockedAccessor) return { found: false, alias: list[i], value: null, blockedAccessor: true, error: null };
      if (!result.ok) return { found: false, alias: list[i], value: null, blockedAccessor: false, error: result.error };
    }
    return { found: false, alias: null, value: null, blockedAccessor: false, error: null };
  }

  function readPrimitiveField(object, keys) {
    for (var i = 0; i < keys.length; i += 1) {
      var read = safeReadProperty(object, keys[i], { allowAccessor: false, searchPrototype: true });
      if (!read.ok) return { found: false, field: keys[i], value: null, blockedAccessor: false, error: read.error };
      if (read.present) {
        if (read.blockedAccessor) return { found: true, field: keys[i], value: null, blockedAccessor: true, error: null };
        if (read.value === null || read.value === undefined || ["string", "number", "boolean"].indexOf(typeof read.value) !== -1) {
          return { found: true, field: keys[i], value: read.value, blockedAccessor: false, error: null };
        }
      }
    }
    return { found: false, field: null, value: null, blockedAccessor: false, error: null };
  }

  function firstPresentField(object, keys) {
    for (var i = 0; i < keys.length; i += 1) {
      var read = safeReadProperty(object, keys[i], { allowAccessor: false, searchPrototype: true });
      if (!read.ok) return { found: false, field: keys[i], value: null, blockedAccessor: false, error: read.error };
      if (read.present) return { found: true, field: keys[i], value: read.blockedAccessor ? null : read.value, blockedAccessor: Boolean(read.blockedAccessor), error: null };
    }
    return { found: false, field: null, value: null, blockedAccessor: false, error: null };
  }

  function tag(value) {
    try { return Object.prototype.toString.call(value); } catch (_error) { return "[object Unknown]"; }
  }

  function isHost(value) {
    if (!isObjectLike(value)) return false;
    var t = tag(value);
    if (/\[object (Window|global|Document|HTMLDocument|Element|HTMLElement|HTMLCanvasElement|Location|Navigator)\]/.test(t)) return true;
    try { if (root.Element && value instanceof root.Element) return true; } catch (_error) {}
    try { if (root.Document && value instanceof root.Document) return true; } catch (_error2) {}
    return false;
  }

  function summarizeHostObject(value) {
    var t = tag(value);
    if (/\[object (Window|global)\]/.test(t)) {
      var loc = safeReadHostProperty(value, "location");
      return {
        hostObject: true,
        kind: "Window",
        href: loc.ok && loc.value ? trimString(loc.value.href, 2048) : null,
        pathname: loc.ok && loc.value ? trimString(loc.value.pathname, 1024) : null,
        documentPresent: Boolean(safeReadHostProperty(value, "document").value)
      };
    }

    if (/\[object (Document|HTMLDocument)\]/.test(t) || value.nodeType === 9) {
      return {
        hostObject: true,
        kind: "Document",
        readyState: safeReadHostProperty(value, "readyState").value || null,
        title: trimString(safeReadHostProperty(value, "title").value || "", 1024)
      };
    }

    if (value.nodeType === 1) {
      var rect = null;
      try {
        if (typeof value.getBoundingClientRect === "function") {
          var r = value.getBoundingClientRect();
          rect = { width: Number(r.width || 0), height: Number(r.height || 0), nonzero: Number(r.width || 0) > 0 && Number(r.height || 0) > 0 };
        }
      } catch (_error) {}
      return {
        hostObject: true,
        kind: "Element",
        tagName: value.tagName || null,
        id: value.id || null,
        hidden: Boolean(value.hidden),
        connected: Boolean(value.isConnected),
        rect: rect
      };
    }

    return { hostObject: true, kind: t.replace(/^\[object |\]$/g, "") };
  }

  function summarizeExternal(value) {
    var started = nowMs();
    var context = { seen: [], totalString: 0, truncated: false, omitted: 0 };
    var summary = clone(value, context);
    return deepFreeze({
      schema: INSPECTION_SCHEMA,
      status: context.truncated ? "AVAILABLE" : "PASS",
      summary: summary,
      metrics: {
        durationMs: Math.max(0, nowMs() - started),
        truncated: context.truncated,
        omittedCount: context.omitted,
        totalStringBudget: context.totalString
      },
      noClaims: NO_CLAIMS
    });
  }

  function findStatuses(value, requestedStatuses) {
    var targets = (requestedStatuses || []).map(function (s) { return String(s || "").toUpperCase(); });
    var matches = [];
    var seen = [];

    function walk(node, path, depth) {
      if (!isObjectLike(node) || isHost(node) || depth > LIMITS.maxDepth || matches.length >= LIMITS.maxStatusMatches) return;
      if (seen.indexOf(node) !== -1) return;
      seen.push(node);

      var statusRead = readPrimitiveField(node, ["status", "STATUS"]);
      if (statusRead.found && !statusRead.blockedAccessor) {
        var normalized = String(statusRead.value || "").toUpperCase();
        if (targets.indexOf(normalized) !== -1) matches.push({ path: path || "root", status: normalized, summary: summarizeExternal(node).summary });
      }

      var keys;
      try { keys = Object.keys(node).slice(0, LIMITS.maxKeys); } catch (_error) { return; }
      keys.forEach(function (key) {
        var read = safeReadProperty(node, key, { allowAccessor: false, searchPrototype: false });
        if (read.ok && read.present && !read.blockedAccessor) walk(read.value, path ? path + "." + key : key, depth + 1);
      });
    }

    walk(value, "", 0);
    return deepFreeze({ schema: INSPECTION_SCHEMA, status: "PASS", matches: matches, noClaims: NO_CLAIMS });
  }

  function inspectCallableMethods(value, methods) {
    var available = [];
    var blocked = [];
    var errors = [];
    (methods || []).slice(0, LIMITS.maxMethods).forEach(function (method) {
      var read = safeReadProperty(value, method, { allowAccessor: false, searchPrototype: true });
      if (!read.ok) errors.push(read.error);
      else if (read.blockedAccessor) blocked.push(method);
      else if (read.present && typeof read.value === "function") available.push(method);
    });
    return { availableMethods: available, blockedMethods: blocked, errors: errors };
  }

  function inspectParticipantRecord(entry) {
    var aliases = Array.isArray(entry && entry.aliases) ? entry.aliases.slice(0, LIMITS.maxAliases) : [];
    var methods = Array.isArray(entry && entry.methods) ? entry.methods.slice(0, LIMITS.maxMethods) : [];
    var resolution = resolveAlias(aliases, root);
    var callable = inspectCallableMethods(resolution.value, methods);
    var contract = readPrimitiveField(resolution.value, ["CONTRACT", "contract"]);
    var version = readPrimitiveField(resolution.value, ["VERSION", "version"]);

    var required = Boolean(entry && entry.required);
    var status = "UNKNOWN";
    if (resolution.error || callable.errors.length) status = "ERROR";
    else if (!resolution.found) status = required ? "MISSING" : "UNKNOWN";
    else if (!callable.availableMethods.length && typeof resolution.value !== "function") status = required ? "HELD" : "AVAILABLE";
    else status = "PASS";

    return deepFreeze({
      schema: "AUDRALIA_BOUNDED_PARTICIPANT_METADATA_INSPECTION_v2",
      role: trimString(entry && entry.role, 256),
      label: trimString(entry && entry.label, 512),
      required: required,
      auxiliary: Boolean(entry && entry.auxiliary),
      aliases: aliases,
      resolvedAlias: resolution.alias,
      available: resolution.found,
      callable: Boolean(callable.availableMethods.length || typeof resolution.value === "function"),
      callableMethods: callable.availableMethods,
      blockedMethods: callable.blockedMethods,
      contract: contract.found && !contract.blockedAccessor ? contract.value : null,
      version: version.found && !version.blockedAccessor ? version.value : null,
      status: status,
      errors: [].concat(resolution.error ? [resolution.error] : []).concat(callable.errors),
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    });
  }

  function inspectParticipants(manifest) {
    var started = nowMs();
    var entries = Array.isArray(manifest) ? manifest.slice(0, LIMITS.maxParticipants) : [];
    var records = entries.map(inspectParticipantRecord);
    var required = records.filter(function (r) { return r.required; });
    var held = required.filter(function (r) { return !(r.available && r.callable); });
    var errors = records.filter(function (r) { return r.status === "ERROR"; }).length;
    var status = errors ? "ERROR" : held.length ? "HELD" : records.length ? "PASS" : "MISSING";

    var result = deepFreeze({
      schema: "AUDRALIA_BOUNDED_PARTICIPANT_METADATA_INSPECTION_v2",
      status: status,
      records: records,
      counts: {
        manifestCount: Array.isArray(manifest) ? manifest.length : 0,
        inspectedCount: records.length,
        requiredCount: required.length,
        heldRequiredCount: held.length,
        errorCount: errors
      },
      metrics: { durationMs: Math.max(0, nowMs() - started), truncated: Array.isArray(manifest) && manifest.length > LIMITS.maxParticipants },
      noClaims: NO_CLAIMS
    });

    recordAction("inspectParticipants", { status: result.status, inspectedCount: records.length });
    return result;
  }

  function inspectTargetFrame(frameId, targetRoute) {
    var started = nowMs();
    var id = trimString(frameId || "audraliaDiagnosticTargetFrame", 512);
    var route = trimString(targetRoute || "/showroom/globe/audralia/", 2048);
    var errors = [];
    var frame = null;

    try { frame = doc ? doc.getElementById(id) : null; }
    catch (error) { errors.push(makeError("inspectTargetFrame.getElementById", error, { frameId: id })); }

    var frameSummary = frame ? summarizeHostObject(frame) : null;
    var frameDocument = null;
    var pathname = null;
    var sameOrigin = false;

    if (frame) {
      var docRead = safeReadHostProperty(frame, "contentDocument");
      if (docRead.ok && docRead.value) {
        frameDocument = docRead.value;
        sameOrigin = true;
      } else if (docRead.error) {
        errors.push(docRead.error);
      }

      if (frameDocument) {
        try { pathname = frameDocument.defaultView && frameDocument.defaultView.location ? frameDocument.defaultView.location.pathname : null; }
        catch (error2) { errors.push(makeError("inspectTargetFrame.pathname", error2)); }
      }
    }

    var result = deepFreeze({
      schema: "AUDRALIA_BOUNDED_TARGET_FRAME_INSPECTION_v2",
      status: errors.length ? "AVAILABLE" : frame ? "PASS" : "MISSING",
      frameId: id,
      expectedRoute: route,
      framePresent: Boolean(frame),
      sameOrigin: sameOrigin,
      documentPresent: Boolean(frameDocument),
      pathname: pathname,
      routeMatch: Boolean(pathname && (pathname === route || pathname === route.replace(/\/$/, ""))),
      frameSummary: frameSummary,
      errors: errors,
      metrics: { durationMs: Math.max(0, nowMs() - started) },
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    });

    recordAction("inspectTargetFrame", { status: result.status, framePresent: result.framePresent });
    return result;
  }

  function inspectRuntime(targetWindow, options) {
    var started = nowMs();
    var config = options || {};
    var source = targetWindow || root;
    var aliases = config.runtimeAliases || ["AUDRALIA_RUNTIME", "AUDRALIA.runtime", "AUDRALIA_ENGINE", "AUDRALIA.engine", "AUDRALIA_CANVAS", "AUDRALIA.canvas"];
    var selectors = config.mountSelectors || ["#audraliaCanvasMount", "#audraliaMount", "#globeMount", "canvas"];
    var runtimeResolution = resolveAlias(aliases, source);
    var runtime = runtimeResolution.value;

    var targetDocument = doc;
    if (targetWindow) {
      var targetDocRead = safeReadHostProperty(targetWindow, "document");
      targetDocument = targetDocRead.ok ? targetDocRead.value : null;
    }

    var mount = null;
    var mountSelector = null;
    if (targetDocument && typeof targetDocument.querySelector === "function") {
      for (var i = 0; i < selectors.length; i += 1) {
        try { mount = targetDocument.querySelector(selectors[i]); } catch (_error) {}
        if (mount) { mountSelector = selectors[i]; break; }
      }
    }

    var contract = readPrimitiveField(runtime, ["CONTRACT", "contract"]);
    var statusField = readPrimitiveField(runtime, ["STATUS", "status"]);
    var mounted = readPrimitiveField(runtime, ["mounted", "isMounted"]);
    var firstFrame = readPrimitiveField(runtime, ["firstFrame", "firstFrameRendered", "frameReady"]);
    var visiblePixel = readPrimitiveField(runtime, ["visiblePixel", "pixelVisible", "hasVisiblePixel"]);
    var receiptField = firstPresentField(runtime, ["RECEIPT", "receipt"]);

    var errors = []
      .concat(runtimeResolution.error ? [runtimeResolution.error] : [])
      .concat(contract.error ? [contract.error] : [])
      .concat(statusField.error ? [statusField.error] : [])
      .concat(mounted.error ? [mounted.error] : [])
      .concat(firstFrame.error ? [firstFrame.error] : [])
      .concat(visiblePixel.error ? [visiblePixel.error] : []);

    var result = deepFreeze({
      schema: "AUDRALIA_BOUNDED_RUNTIME_METADATA_INSPECTION_v2",
      status: errors.length ? "AVAILABLE" : runtimeResolution.found && mount ? "PASS" : runtimeResolution.found || mount ? "AVAILABLE" : "MISSING",
      runtimeAlias: runtimeResolution.alias,
      runtimeFound: runtimeResolution.found,
      runtimeContract: contract.found && !contract.blockedAccessor ? contract.value : null,
      runtimeStatus: statusField.found && !statusField.blockedAccessor ? statusField.value : null,
      runtimeMounted: mounted.found && !mounted.blockedAccessor ? mounted.value : null,
      mountFound: Boolean(mount),
      mountSelector: mountSelector,
      mountSummary: mount ? summarizeHostObject(mount) : null,
      stageRectNonzero: mount ? Boolean((summarizeHostObject(mount).rect || {}).nonzero) : null,
      firstFrame: firstFrame.found && !firstFrame.blockedAccessor ? firstFrame.value : null,
      visiblePixel: visiblePixel.found && !visiblePixel.blockedAccessor ? visiblePixel.value : null,
      passiveReceiptFieldPresent: Boolean(receiptField.found),
      passiveReceiptField: receiptField.field,
      errors: errors,
      metrics: { durationMs: Math.max(0, nowMs() - started) },
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    });

    recordAction("inspectRuntime", { status: result.status, runtimeFound: result.runtimeFound, mountFound: result.mountFound });
    return result;
  }

  function normalizeCollection(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.slice(0, LIMITS.maxArray).map(function (item) { return summarizeExternal(item).summary; });
    if (isObjectLike(value)) {
      var out = [];
      try {
        Object.keys(value).slice(0, LIMITS.maxArray).forEach(function (key) {
          out.push({ key: key, value: summarizeExternal(value[key]).summary });
        });
      } catch (_error) {}
      return out;
    }
    return [];
  }

  function inspectRegistry(registry) {
    var started = nowMs();
    var sections = {
      governingContracts: firstPresentField(registry, ["governingContracts", "contracts", "authorities"]),
      assignedEngines: firstPresentField(registry, ["assignedEngines", "assigned", "subjects"]),
      selectableEngines: firstPresentField(registry, ["selectableEngines", "selectable", "options"]),
      reservedSlots: firstPresentField(registry, ["reservedSlots", "reserved", "slots"])
    };

    var result = {
      schema: "AUDRALIA_BOUNDED_REGISTRY_INSPECTION_v2",
      status: "MISSING",
      found: Boolean(registry),
      governingContracts: [],
      assignedEngines: [],
      selectableEngines: [],
      reservedSlots: [],
      counts: {},
      errors: [],
      metrics: { durationMs: 0 },
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    };

    Object.keys(sections).forEach(function (name) {
      if (sections[name].error) result.errors.push(sections[name].error);
      if (sections[name].found && !sections[name].blockedAccessor) result[name] = normalizeCollection(sections[name].value);
    });

    result.counts = {
      governingContracts: result.governingContracts.length,
      assignedEngines: result.assignedEngines.length,
      selectableEngines: result.selectableEngines.length,
      reservedSlots: result.reservedSlots.length
    };
    result.counts.total = result.counts.governingContracts + result.counts.assignedEngines + result.counts.selectableEngines + result.counts.reservedSlots;
    result.status = result.errors.length ? "AVAILABLE" : result.counts.total ? "PASS" : result.found ? "AVAILABLE" : "MISSING";
    result.metrics.durationMs = Math.max(0, nowMs() - started);

    recordAction("inspectRegistry", { status: result.status, total: result.counts.total });
    return deepFreeze(result);
  }

  function inspectEngineFamily(targetWindow) {
    var started = nowMs();
    var source = targetWindow || root;
    var governing = resolveAlias(["DGB_ENGINE_CONTRACT", "DGB.engineContract"], source);
    var runtime = resolveAlias(["DGB_ENGINE", "DGB.engine"], source);
    var registry = resolveAlias(["DGB_ENGINE_SUBJECTS", "DGB.engineSubjects", "DGB_ENGINE_REGISTRY", "DGB.engineRegistry"], source);
    var registryInspection = inspectRegistry(registry.value);

    var foundCount = [governing.found, runtime.found, registry.found].filter(Boolean).length;
    var errors = [].concat(governing.error ? [governing.error] : []).concat(runtime.error ? [runtime.error] : []).concat(registry.error ? [registry.error] : []);

    var result = deepFreeze({
      schema: "AUDRALIA_BOUNDED_ENGINE_FAMILY_INSPECTION_v2",
      status: errors.length ? "AVAILABLE" : foundCount === 3 ? "PASS" : foundCount ? "AVAILABLE" : "MISSING",
      governingContractFound: governing.found,
      governingContractAlias: governing.alias,
      runtimeEngineFound: runtime.found,
      runtimeEngineAlias: runtime.alias,
      registryFound: registry.found,
      registryAlias: registry.alias,
      registry: registryInspection,
      foundCount: foundCount,
      errors: errors,
      metrics: { durationMs: Math.max(0, nowMs() - started) },
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    });

    recordAction("inspectEngineFamily", { status: result.status, foundCount: foundCount });
    return result;
  }

  function inspectPassiveField(fieldRecord, kind) {
    var started = nowMs();
    var result = {
      schema: INSPECTION_SCHEMA,
      kind: kind || "field",
      status: "MISSING",
      found: false,
      field: fieldRecord && fieldRecord.field ? fieldRecord.field : null,
      summary: null,
      packetKeys: [],
      statusMatches: [],
      recommendedOwner: null,
      recommendedFile: null,
      recommendedAction: null,
      errors: [],
      metrics: { durationMs: 0 },
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    };

    if (!fieldRecord) return deepFreeze(result);
    if (fieldRecord.error) {
      result.status = "ERROR";
      result.errors.push(fieldRecord.error);
      return deepFreeze(result);
    }
    if (!fieldRecord.found || fieldRecord.blockedAccessor) {
      result.status = fieldRecord.blockedAccessor ? "HELD" : "MISSING";
      return deepFreeze(result);
    }

    result.found = true;
    result.summary = summarizeExternal(fieldRecord.value).summary;
    result.statusMatches = findStatuses(fieldRecord.value, ["HELD", "MISSING", "ERROR", "FAILED", "FAIL"]).matches;

    try {
      if (isObjectLike(fieldRecord.value)) result.packetKeys = Object.keys(fieldRecord.value).slice(0, LIMITS.maxKeys);
    } catch (error) {
      result.errors.push(makeError("inspectPassiveField.keys", error));
    }

    result.recommendedOwner = readPrimitiveField(fieldRecord.value, ["recommendedOwner", "owner"]).value;
    result.recommendedFile = readPrimitiveField(fieldRecord.value, ["recommendedFile", "file"]).value;
    result.recommendedAction = readPrimitiveField(fieldRecord.value, ["recommendedAction", "action"]).value;

    result.status = result.errors.length ? "AVAILABLE" : result.statusMatches.length ? "HELD" : "PASS";
    result.metrics.durationMs = Math.max(0, nowMs() - started);

    recordAction("inspectPassiveField", { kind: result.kind, status: result.status, field: result.field });
    return deepFreeze(result);
  }

  function inspectSurfaceMetadata(participantRecord) {
    var aliases = participantRecord && Array.isArray(participantRecord.aliases)
      ? participantRecord.aliases
      : participantRecord && participantRecord.resolvedAlias
        ? [participantRecord.resolvedAlias]
        : [];

    var resolution = resolveAlias(aliases, root);
    var value = resolution.value;
    var methods = participantRecord && Array.isArray(participantRecord.methods) ? participantRecord.methods : ["inspect", "probe", "run", "execute"];
    var callable = inspectCallableMethods(value, methods);
    var contract = readPrimitiveField(value, ["CONTRACT", "contract"]);
    var receipt = inspectPassiveField(firstPresentField(value, ["RECEIPT", "receipt"]), "receipt");
    var packet = inspectPassiveField(firstPresentField(value, ["PACKET", "packet"]), "packet");

    var forbiddenCallable = inspectCallableMethods(value, ["run", "execute", "runNineCycle", "registerStation", "register"]);

    var status = !resolution.found ? "MISSING" : receipt.status === "HELD" || packet.status === "HELD" ? "HELD" : "PASS";

    var result = deepFreeze({
      schema: "AUDRALIA_BOUNDED_SURFACE_TRUTH_INSPECTION_v2",
      status: status,
      authorityFound: resolution.found,
      authorityAlias: resolution.alias,
      contract: contract.found && !contract.blockedAccessor ? contract.value : null,
      callable: Boolean(callable.availableMethods.length || typeof value === "function"),
      callableMethods: callable.availableMethods,
      forbiddenCallableMethodsObserved: forbiddenCallable.availableMethods,
      receipt: receipt,
      packet: packet,
      errors: [].concat(resolution.error ? [resolution.error] : []).concat(callable.errors),
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    });

    recordAction("inspectSurfaceMetadata", { status: result.status, authorityFound: result.authorityFound });
    return result;
  }

  function inspectControlFamily(options) {
    var config = options || {};
    var bridge = resolveAlias(config.bridgeAliases || CONTROL_FAMILY_DEFAULTS.bridgeAliases, root);
    var controls = resolveAlias(config.controlsAliases || CONTROL_FAMILY_DEFAULTS.controlsAliases, root);
    var interpreter = resolveAlias(config.interpreterAliases || CONTROL_FAMILY_DEFAULTS.interpreterAliases, root);
    var rail = resolveAlias(config.railAliases || CONTROL_FAMILY_DEFAULTS.railAliases, root);

    var participants = [
      { role: "CONTROL_BRIDGE", required: true, aliases: config.bridgeAliases || CONTROL_FAMILY_DEFAULTS.bridgeAliases, methods: ["verifyRelationships", "getState", "getReceipt"] },
      { role: "CONTROLS", required: true, aliases: config.controlsAliases || CONTROL_FAMILY_DEFAULTS.controlsAliases, methods: ["getReceipt"] },
      { role: "INTERPRETER", required: true, aliases: config.interpreterAliases || CONTROL_FAMILY_DEFAULTS.interpreterAliases, methods: ["getReceipt"] },
      { role: "RAIL_TERMINAL_SYNTHESIS", required: true, aliases: config.railAliases || CONTROL_FAMILY_DEFAULTS.railAliases, methods: ["executeCycleStation", "getDefinitionReceipt"] }
    ];

    var participantInspection = inspectParticipants(participants);

    var result = deepFreeze({
      schema: "AUDRALIA_BOUNDED_CONTROL_FAMILY_INSPECTION_v2",
      status: participantInspection.status,
      bridgeFound: bridge.found,
      controlsFound: controls.found,
      interpreterFound: interpreter.found,
      railFound: rail.found,
      participants: participantInspection,
      contracts: {
        bridge: readPrimitiveField(bridge.value, ["CONTRACT", "contract"]).value,
        controls: readPrimitiveField(controls.value, ["CONTRACT", "contract"]).value,
        interpreter: readPrimitiveField(interpreter.value, ["CONTRACT", "contract"]).value,
        rail: readPrimitiveField(rail.value, ["CONTRACT", "contract"]).value
      },
      noExecutionPerformed: true,
      noClaims: NO_CLAIMS,
      observedAt: nowIso()
    });

    recordAction("inspectControlFamily", { status: result.status });
    return result;
  }

  function makeLane(laneId, status, summary, evidence, absence, direction, data, metrics, errors) {
    return deepFreeze({
      schema: LANE_SCHEMA,
      laneId: trimString(laneId || "unknownLane", 256),
      status: status || "UNKNOWN",
      summary: trimString(summary || "", LIMITS.maxString),
      evidence: Array.isArray(evidence) ? evidence.slice(0, 128).map(String) : [],
      absence: Array.isArray(absence) ? absence.slice(0, 128).map(String) : [],
      direction: Array.isArray(direction) ? direction.slice(0, 64).map(String) : [],
      data: data === undefined ? null : clone(data),
      metrics: clone(metrics || {}),
      errors: clone(errors || []),
      createdAt: nowIso(),
      noClaims: NO_CLAIMS
    });
  }

  function laneFromInspection(laneId, inspection) {
    var status = inspection && inspection.status ? inspection.status : "UNKNOWN";
    var laneStatus = status === "PASS" ? "COMPLETE" : status === "AVAILABLE" ? "AVAILABLE" : status === "HELD" ? "HELD" : status === "MISSING" ? "MISSING" : status === "ERROR" ? "ERROR" : "UNKNOWN";
    return makeLane(
      laneId,
      laneStatus,
      "Inspection lane " + laneId + " completed with status " + laneStatus + ".",
      laneStatus === "COMPLETE" || laneStatus === "AVAILABLE" ? ["Bounded inspection record produced."] : [],
      laneStatus === "COMPLETE" ? [] : ["Complete bounded evidence was not established."],
      laneStatus === "COMPLETE" ? [] : ["Review normalized inspection data for held, missing, or error condition."],
      inspection,
      inspection && inspection.metrics ? inspection.metrics : {},
      inspection && inspection.errors ? inspection.errors : []
    );
  }

  function runLane(laneId, inspector, interpreter) {
    var started = nowMs();
    try {
      if (typeof inspector !== "function") throw new Error("INSPECTOR_NOT_CALLABLE");
      var inspection = inspector();
      if (inspection && typeof inspection.then === "function") {
        return makeLane(laneId, "HELD", "Async inspection result was not accepted.", [], ["ASYNC_EVIDENCE_NOT_ACCEPTED"], ["Provide synchronous passive metadata."], null, { durationMs: Math.max(0, nowMs() - started) }, []);
      }
      var lane = typeof interpreter === "function" ? interpreter(frozenClone(inspection)) : laneFromInspection(laneId, inspection);
      if (!lane || lane.schema !== LANE_SCHEMA) lane = laneFromInspection(laneId, inspection);
      recordAction("runLane", { laneId: laneId, status: lane.status });
      return lane;
    } catch (error) {
      var err = makeError("runLane", error, { laneId: laneId });
      return makeLane(laneId, "ERROR", "The bounded inspector encountered an exception.", [], [err.message], ["Inspect the normalized error without mutating target."], null, { durationMs: Math.max(0, nowMs() - started) }, [err]);
    }
  }

  function inspectInitializationSafe(options) {
    var config = options || {};
    var lanes = [];

    lanes.push(runLane("participants", function () { return inspectParticipants(config.participantManifest || []); }));
    lanes.push(runLane("targetFrame", function () { return inspectTargetFrame(config.frameId, config.targetRoute); }));
    lanes.push(runLane("runtimeMetadata", function () { return inspectRuntime(config.targetWindow || null, config); }));
    lanes.push(runLane("engineFamily", function () { return inspectEngineFamily(config.targetWindow || null); }));
    lanes.push(runLane("controlFamily", function () { return inspectControlFamily(config); }));

    var hasError = lanes.some(function (lane) { return lane.status === "ERROR"; });
    var hasAvailable = lanes.some(function (lane) { return lane.status === "COMPLETE" || lane.status === "AVAILABLE"; });

    var result = deepFreeze({
      schema: INSPECTION_SCHEMA,
      status: hasError ? (hasAvailable ? "AVAILABLE" : "ERROR") : hasAvailable ? "AVAILABLE" : "MISSING",
      lanes: lanes,
      participants: lanes[0].data,
      target: lanes[1].data,
      runtime: lanes[2].data,
      engineFamily: lanes[3].data,
      controlFamily: lanes[4].data,
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    });

    recordAction("inspectInitializationSafe", { status: result.status, laneCount: lanes.length });
    return result;
  }

  function recordAction(action, detail) {
    actionCount += 1;
    lastAction = deepFreeze({
      action: action,
      actionNumber: actionCount,
      detail: clone(detail || {}),
      occurredAt: nowIso()
    });
    publishReceipt();
    return frozenClone(lastAction);
  }

  function getLimits() {
    return frozenClone(LIMITS);
  }

  function getReceipt() {
    return frozenClone(root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT || null);
  }

  function getDefinitionReceipt() {
    return deepFreeze({
      schema: RECEIPT_SCHEMA,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status: "READY",
      installedAt: installedAt,
      role: "Passive bounded diagnostic inspection lane. Supplies guarded reads, host-object summaries, participant inspection, target-frame inspection, runtime metadata, engine-family inspection, control-family inspection, registry inspection, passive receipt/packet inspection, and lane normalization.",
      exactInterface: [
        "safeReadProperty",
        "safeReadPath",
        "summarizeExternal",
        "inspectParticipants",
        "inspectTargetFrame",
        "inspectRuntime",
        "inspectEngineFamily",
        "inspectRegistry",
        "inspectSurfaceMetadata",
        "inspectControlFamily",
        "inspectInitializationSafe",
        "runLane",
        "makeLane",
        "getReceipt",
        "getDefinitionReceipt"
      ],
      noClaims: NO_CLAIMS
    });
  }

  function publishReceipt() {
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT = deepFreeze({
      schema: RECEIPT_SCHEMA,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status: "READY",
      installedAt: installedAt,
      publishedAt: nowIso(),
      actionCount: actionCount,
      lastAction: frozenClone(lastAction),
      limits: LIMITS,
      newsAlignment: { sourceDiscovery: "EAST", containment: "EAST", boundedInspection: "WEST" },
      fibonacciAuthority: { sourceDiscovery: "F3", normalization: "F5", runtimeInspection: "F13" },
      noClaims: NO_CLAIMS
    });
  }

  function publishApi() {
    var api = Object.freeze({
      CONTRACT: CONTRACT,
      contract: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      version: VERSION,
      FILE: FILE,
      file: FILE,
      STATUS: "READY",
      status: "READY",

      safeReadProperty: safeReadProperty,
      safeReadPath: safeReadPath,
      summarizeExternal: summarizeExternal,
      summarizeHostObject: summarizeHostObject,
      findStatuses: findStatuses,

      inspectParticipants: inspectParticipants,
      inspectParticipant: inspectParticipantRecord,
      inspectTargetFrame: inspectTargetFrame,
      inspectRuntime: inspectRuntime,
      inspectEngineFamily: inspectEngineFamily,
      inspectRegistry: inspectRegistry,
      inspectSurfaceMetadata: inspectSurfaceMetadata,
      inspectPassiveField: inspectPassiveField,
      inspectControlFamily: inspectControlFamily,

      runLane: runLane,
      makeLane: makeLane,
      inspectInitializationSafe: inspectInitializationSafe,

      getLimits: getLimits,
      getReceipt: getReceipt,
      getDefinitionReceipt: getDefinitionReceipt,

      noClaims: NO_CLAIMS
    });

    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE = api;
    root.AUDRALIA = root.AUDRALIA && typeof root.AUDRALIA === "object" ? root.AUDRALIA : {};
    root.AUDRALIA.diagnosticInspectionLane = api;

    root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_CONTRACT__ = CONTRACT;
    root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_VERSION__ = VERSION;

    return api;
  }

  if (
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE &&
    (
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE.CONTRACT === CONTRACT ||
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE.contract === CONTRACT
    )
  ) {
    return;
  }

  try {
    publishReceipt();
    publishApi();
    recordAction("initialize", { contract: CONTRACT, previousContract: PREVIOUS_CONTRACT });
  } catch (error) {
    root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR__ = deepFreeze({
      schema: ERROR_SCHEMA,
      contract: CONTRACT,
      file: FILE,
      error: makeError("initialize", error),
      occurredAt: nowIso(),
      noClaims: NO_CLAIMS
    });
    throw error;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
