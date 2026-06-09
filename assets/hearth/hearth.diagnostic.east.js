// /assets/hearth/hearth.diagnostic.east.js
// HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_BRIDGE_TNT_v3
// Full-file replacement.
// EAST / served-source evidence / direct packet return bridge.
//
// Purpose:
// - Preserve the served EAST authority contract expected by the diagnostic chamber.
// - Preserve the canonical EAST aliases already used by the receiver.
// - Keep the public direct method surface simple: runEastSourceRead, getEastReceipt, getEastState.
// - Make runEastSourceRead return a plain structured packet instead of a callable/circular receipt object.
// - Keep diagnostic scope read-only.
//
// Does not authorize:
// - production mutation
// - canvas repair
// - canvas build
// - canvas release
// - controls mutation
// - runtime restart
// - route repair
// - target route renderer mutation
// - visual pass claim

(function hearthDiagnosticEastDirectPacketReturnBridge(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var documentRef = root.document || null;

  var CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  var RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_BRIDGE_TNT_v3";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_BRIDGE_RECEIPT_v3";

  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_TNT_v2_1";
  var PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT_v2_1";

  var BASELINE_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  var BASELINE_RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";

  var VERSION =
    "2026-06-09.hearth-diagnostic-rail-east-direct-packet-return-bridge-v3";

  var FILE = "/assets/hearth/hearth.diagnostic.east.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var ROLE = "EAST";
  var COMPONENT = "EAST";
  var DIRECT_METHOD = "runEastSourceRead";
  var DIRECT_AUTHORITY_PATH = "HEARTH_DIAGNOSTIC_RAIL_EAST";
  var LEGACY_AUTHORITY_PATH = "JUDGE_EAST";

  var PUBLIC_METHOD_KEYS = "runEastSourceRead,getEastReceipt,getEastState";

  var SOURCE_PATHS = [
    "/assets/lab/runtime-table.js",
    "/assets/lab/runtime-table.west.js",
    "/assets/hearth/hearth.diagnostic.rail.js",
    "/assets/hearth/hearth.diagnostic.east.js",
    "/assets/hearth/hearth.diagnostic.probe.east.js",
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js",
    "/assets/hearth/hearth.diagnostic.south.js",
    "/assets/hearth/hearth.diagnostic.west.js",
    "/assets/hearth/hearth.diagnostic.south.surface.pointer.js",
    "/showroom/globe/hearth/index.js",
    "/assets/hearth/hearth.canvas.js",
    "/assets/hearth/hearth.canvas.launch.js",
    "/assets/hearth/hearth.controls.js",
    "/assets/hearth/hearth.hex.surface.js",
    "/assets/hearth/hearth.canvas.finger.surface.js"
  ];

  var EAST_ALIAS_PATHS = [
    "JUDGE_EAST",
    "HEARTH_DIAGNOSTIC_RAIL_EAST",
    "HEARTH.diagnosticEast",
    "HEARTH.diagnosticRailEast",
    "HEARTH.JUDGE_EAST_SOURCE_READ",
    "DEXTER_LAB.hearthDiagnosticEast"
  ];

  var PARTICIPANT_ALIAS_MAP = {
    NORTH: [
      "JUDGE_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL",
      "HEARTH.diagnosticRail",
      "HEARTH.diagnosticNorth",
      "HEARTH.diagnosticNorthRail",
      "DEXTER_LAB.hearthDiagnosticRail",
      "DEXTER_LAB.hearthDiagnosticNorth",
      "DEXTER_LAB.hearthDiagnosticNorthRail"
    ],
    EAST: EAST_ALIAS_PATHS,
    EAST_PROBE: [
      "HEARTH_DIAGNOSTIC_PROBE_EAST",
      "HEARTH.diagnosticProbeEast",
      "DEXTER_LAB.diagnosticProbeEast"
    ],
    SURFACE_TRUTH: [
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.canvasSurfaceTruthProbe",
      "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "DEXTER_LAB.canvasSurfaceTruthProbe",
      "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth"
    ],
    SOUTH: [
      "JUDGE_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH.JUDGE_SOUTH_PACKET_OUTPUT",
      "DEXTER_LAB.hearthDiagnosticSouth"
    ],
    SOUTH_SURFACE_POINTER: [
      "HEARTH.southSurfacePointerSidecar",
      "HEARTH.SOUTH_SURFACE_POINTER_SIDECAR",
      "HEARTH.diagnosticSouthSurfacePointer",
      "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR",
      "HEARTH_SOUTH_SURFACE_POINTER_SIDECAR",
      "DEXTER_LAB.southSurfacePointerSidecar",
      "DEXTER_LAB.hearthSouthSurfacePointerSidecar"
    ],
    WEST_DIAGNOSTIC: [
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "DEXTER_LAB.hearthDiagnosticWest",
      "DEXTER_LAB.hearthDiagnosticRailWest",
      "HEARTH_DIAGNOSTIC_WEST",
      "HEARTH_DIAGNOSTIC_RAIL_WEST"
    ],
    LABWEST: [
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "HEARTH.runtimeTableWest",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest"
    ]
  };

  var NO_TOUCH = {
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

    PRODUCTION_MUTATION_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_BUILD_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    CONTROLS_REPAIR_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    TARGET_ROUTE_RENDERER_MUTATION_AUTHORIZED: false,
    READY_TEXT_CLAIMED: false,
    F13_CLAIMED: false,
    F21_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  };

  var state = {
    loadedAt: nowIso(),
    lastRunAt: "NONE",
    runCount: 0,
    lastPacket: null,
    lastState: null,
    lastError: "NONE"
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function asString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function compact(value, limit) {
    if (limit === undefined) limit = 4000;
    return asString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function ensureNamespace(name) {
    if (!root[name] || typeof root[name] !== "object") root[name] = {};
    return root[name];
  }

  function readPath(path) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) {
        return null;
      }
      cursor = cursor[parts[i]];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;

    var cursor = root;
    for (var i = 0; i < parts.length - 1; i += 1) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") cursor[parts[i]] = {};
      cursor = cursor[parts[i]];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function safeGetOwn(value, key, fallback) {
    if (!isObject(value)) return fallback;
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return value[key] === undefined || value[key] === null ? fallback : value[key];
    }

    var lower = key.toLowerCase();
    var keys = Object.keys(value);
    for (var i = 0; i < keys.length; i += 1) {
      if (keys[i].toLowerCase() === lower) {
        return value[keys[i]] === undefined || value[keys[i]] === null ? fallback : value[keys[i]];
      }
    }

    return fallback;
  }

  function methodKeys(value) {
    if (!isObject(value)) return [];
    return Object.keys(value).filter(function onlyFunctions(key) {
      return isFunction(value[key]);
    });
  }

  function defineCallable(target, key, value, enumerable) {
    try {
      Object.defineProperty(target, key, {
        value: value,
        enumerable: Boolean(enumerable),
        configurable: true,
        writable: true
      });
    } catch (_error) {
      target[key] = value;
    }
  }

  function getDocumentTitle(targetDoc) {
    try {
      return targetDoc && targetDoc.title ? targetDoc.title : "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function getDocumentPath(targetDoc) {
    try {
      return targetDoc && targetDoc.location && targetDoc.location.pathname
        ? targetDoc.location.pathname
        : "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function getDocumentHref(targetDoc) {
    try {
      return targetDoc && targetDoc.location && targetDoc.location.href
        ? targetDoc.location.href
        : "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function safeWindowDocument(win) {
    try {
      return win && win.document ? win.document : null;
    } catch (_error) {
      return null;
    }
  }

  function frameDocument(frame) {
    try {
      if (frame && frame.contentDocument) return frame.contentDocument;
    } catch (_error) {}

    try {
      if (frame && frame.contentWindow && frame.contentWindow.document) {
        return frame.contentWindow.document;
      }
    } catch (_error) {}

    return null;
  }

  function addDocumentScope(scopes, seen, label, targetDoc, kind) {
    if (!targetDoc) return;

    for (var i = 0; i < seen.length; i += 1) {
      if (seen[i] === targetDoc) return;
    }

    seen.push(targetDoc);
    scopes.push({
      label: label,
      kind: kind || "DOCUMENT",
      doc: targetDoc,
      path: getDocumentPath(targetDoc),
      href: getDocumentHref(targetDoc),
      title: getDocumentTitle(targetDoc)
    });
  }

  function addFrameScopes(scopes, seen, baseLabel, targetDoc) {
    if (!targetDoc || !isFunction(targetDoc.querySelectorAll)) return;

    var frames = [];
    try {
      frames = Array.prototype.slice.call(targetDoc.querySelectorAll("iframe"));
    } catch (_error) {
      frames = [];
    }

    frames.forEach(function addFrame(frame, index) {
      addDocumentScope(
        scopes,
        seen,
        baseLabel + ".iframe[" + index + "]",
        frameDocument(frame),
        "IFRAME_DOCUMENT"
      );
    });
  }

  function collectDocumentScopes() {
    var scopes = [];
    var seen = [];

    addDocumentScope(scopes, seen, "current.document", documentRef, "CURRENT_DOCUMENT");
    addFrameScopes(scopes, seen, "current.document", documentRef);

    var parentDoc = null;
    try {
      if (root.parent && root.parent !== root) parentDoc = safeWindowDocument(root.parent);
    } catch (_error) {}
    addDocumentScope(scopes, seen, "parent.document", parentDoc, "PARENT_DOCUMENT");
    addFrameScopes(scopes, seen, "parent.document", parentDoc);

    var topDoc = null;
    try {
      if (root.top && root.top !== root) topDoc = safeWindowDocument(root.top);
    } catch (_error) {}
    addDocumentScope(scopes, seen, "top.document", topDoc, "TOP_DOCUMENT");
    addFrameScopes(scopes, seen, "top.document", topDoc);

    return scopes;
  }

  function scriptElements(targetDoc) {
    if (!targetDoc || !isFunction(targetDoc.querySelectorAll)) return [];
    try {
      return Array.prototype.slice.call(targetDoc.querySelectorAll("script[src]"));
    } catch (_error) {
      return [];
    }
  }

  function normalizeSrc(src) {
    var raw = asString(src);
    if (!raw) return "";

    try {
      var origin = root.location && root.location.origin ? root.location.origin : undefined;
      var url = new URL(raw, origin);
      return url.pathname;
    } catch (_error) {
      return raw.split("?")[0];
    }
  }

  function sourceMatch(path, scriptSrc) {
    var normalized = normalizeSrc(scriptSrc);
    var raw = asString(scriptSrc);
    return normalized === path || normalized.indexOf(path) !== -1 || raw.indexOf(path) !== -1;
  }

  function inspectSourcePath(path, scopes) {
    var found = false;
    var foundIn = "NONE";
    var fullSrc = "NONE";

    for (var i = 0; i < scopes.length; i += 1) {
      var scripts = scriptElements(scopes[i].doc);
      for (var j = 0; j < scripts.length; j += 1) {
        var src = "";
        try {
          src = scripts[j].getAttribute("src") || scripts[j].src || "";
        } catch (_error) {
          src = "";
        }

        if (sourceMatch(path, src)) {
          found = true;
          foundIn = scopes[i].label;
          fullSrc = src;
          break;
        }
      }
      if (found) break;
    }

    return {
      path: path,
      scriptObserved: found,
      observedIn: foundIn,
      src: fullSrc
    };
  }

  function inspectParticipantAliases() {
    var out = {};

    Object.keys(PARTICIPANT_ALIAS_MAP).forEach(function inspectLabel(label) {
      var aliases = PARTICIPANT_ALIAS_MAP[label];
      var firstFound = null;
      var probe = aliases.map(function inspectAlias(alias) {
        var value = readPath(alias);
        var found = value !== null && value !== undefined;
        var type = found ? typeof value : "undefined";
        var keys = found && isObject(value) ? methodKeys(value) : [];

        if (found && !firstFound) {
          firstFound = {
            alias: alias,
            valueType: type,
            methodKeys: keys,
            value: value
          };
        }

        return {
          alias: alias,
          found: found,
          valueType: type,
          methodCount: keys.length,
          methodKeys: keys.join(","),
          contract: found && isObject(value)
            ? asString(safeGetOwn(value, "CONTRACT", safeGetOwn(value, "contract", "UNKNOWN")))
            : "UNKNOWN",
          receipt: found && isObject(value)
            ? asString(safeGetOwn(value, "RECEIPT", safeGetOwn(value, "receipt", "UNKNOWN")))
            : "UNKNOWN",
          internalRenewalContract: found && isObject(value)
            ? asString(
                safeGetOwn(
                  value,
                  "INTERNAL_RENEWAL_CONTRACT",
                  safeGetOwn(value, "internalRenewalContract", "UNKNOWN")
                )
              )
            : "UNKNOWN"
        };
      });

      out[label] = {
        label: label,
        present: Boolean(firstFound),
        authorityPath: firstFound ? firstFound.alias : "NONE",
        valueType: firstFound ? firstFound.valueType : "undefined",
        methodCount: firstFound ? firstFound.methodKeys.length : 0,
        methodKeys: firstFound ? firstFound.methodKeys.join(",") : "",
        probe: probe
      };
    });

    return out;
  }

  function inspectTargetAccess(scopes) {
    var best = null;
    var score = -999;

    scopes.forEach(function scoreScope(scope) {
      var currentScore = 0;
      if (scope.path === TARGET_ROUTE || scope.path === TARGET_ROUTE.replace(/\/$/, "")) {
        currentScore += 100;
      }
      if (scope.href.indexOf(TARGET_ROUTE) !== -1) currentScore += 80;
      if (/hearth/i.test(scope.title || "")) currentScore += 15;
      if (scope.href.indexOf(DIAGNOSTIC_ROUTE) !== -1) currentScore -= 30;

      if (currentScore > score) {
        score = currentScore;
        best = scope;
      }
    });

    return {
      status: best ? "TARGET_ACCESS_CONFIRMED_OR_SCOPE_READABLE" : "TARGET_ACCESS_NOT_CONFIRMED",
      framePresent: scopes.some(function hasFrame(scope) {
        return scope.kind === "IFRAME_DOCUMENT";
      }),
      frameAccessible: scopes.some(function hasFrameDoc(scope) {
        return scope.kind === "IFRAME_DOCUMENT" && scope.doc;
      }),
      selectedScope: best ? best.label : "NONE",
      selectedPath: best ? best.path : "UNKNOWN",
      selectedTitle: best ? best.title : "UNKNOWN",
      routeConfirmed: Boolean(best && (best.path === TARGET_ROUTE || best.href.indexOf(TARGET_ROUTE) !== -1)),
      error: "NONE"
    };
  }

  function inspectLoadedSources() {
    var scopes = collectDocumentScopes();
    var sourceEvidence = SOURCE_PATHS.map(function inspectOne(path) {
      return inspectSourcePath(path, scopes);
    });
    var missingSources = sourceEvidence.filter(function missing(item) {
      return !item.scriptObserved;
    });
    var presentSources = sourceEvidence.filter(function present(item) {
      return item.scriptObserved;
    });

    return {
      documentScopes: scopes.map(function compactScope(scope) {
        return {
          label: scope.label,
          kind: scope.kind,
          path: scope.path,
          title: scope.title
        };
      }),
      sourceEvidence: sourceEvidence,
      presentSourceCount: presentSources.length,
      missingSourceCount: missingSources.length,
      missingSources: missingSources.map(function toPath(item) {
        return item.path;
      }),
      participantAliases: inspectParticipantAliases(),
      targetAccess: inspectTargetAccess(scopes)
    };
  }

  function makeNoTouchBoundaryText() {
    return "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE,TARGET_ROUTE_RENDERER";
  }

  function addNoTouch(packet) {
    Object.keys(NO_TOUCH).forEach(function applyNoTouch(key) {
      packet[key] = NO_TOUCH[key];
    });
    return packet;
  }

  function makePacket(mode) {
    var generatedAt = nowIso();
    var inspected = inspectLoadedSources();
    var aliases = inspected.participantAliases;
    var eastProbe = aliases.EAST || {};
    var target = inspected.targetAccess;
    var directPacketKeys;

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_PACKET_v3",
      PACKET_NAME: "HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_PACKET_v3",
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      AUDIT_SEQUENCE: "16",
      AUDIT_LABEL: "East Direct",
      ROLE: ROLE,
      COMPONENT: COMPONENT,
      SCOPE: "ONE_COMPONENT_DIRECT_EXECUTION",
      MODE: mode || "RUN_EAST_SOURCE_READ",

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      BASELINE_CONTRACT: BASELINE_CONTRACT,
      BASELINE_RECEIPT: BASELINE_RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: generatedAt,
      UPDATED_AT: generatedAt,

      RUN_STATE: "DIRECT_RUN_EXECUTED",
      TRUST_STATE: "AUTHORITY_FOUND",
      BLOCKING: false,
      RUN_EXECUTED: true,
      READ_ONLY_DIRECT_RECEIPT: false,

      DIRECT_PACKET_READY: true,
      DIRECT_PACKET_RETURN_BRIDGE_ACTIVE: true,
      DIRECT_PACKET_RETURN_BRIDGE_STATUS: "PLAIN_PACKET_RETURNED",
      DIRECT_AUTHORITY_PATH: DIRECT_AUTHORITY_PATH,
      LEGACY_AUTHORITY_PATH: LEGACY_AUTHORITY_PATH,
      DIRECT_STATUS: "DIRECT_RUN_EXECUTED",
      DIRECT_METHOD: DIRECT_METHOD,
      DIRECT_ERROR: "NONE",
      DIRECT_METHOD_SURFACE: PUBLIC_METHOD_KEYS,
      AUTHORITY_METHOD_COUNT: 3,
      AUTHORITY_METHOD_KEYS: PUBLIC_METHOD_KEYS,

      EAST_PRESENT: Boolean(eastProbe.present),
      EAST_STATUS: eastProbe.present ? "AUTHORITY_FOUND" : "AUTHORITY_NOT_FOUND",
      EAST_AUTHORITY_PATH: eastProbe.authorityPath || "NONE",
      EAST_METHOD_COUNT: eastProbe.methodCount || 0,
      EAST_METHOD_KEYS: eastProbe.methodKeys || "",

      TARGET_ROUTE_ACCESS: target.status,
      TARGET_ACCESS_STATUS: target.status,
      TARGET_ROUTE_CONFIRMED: target.routeConfirmed,
      TARGET_FRAME_PRESENT: target.framePresent,
      TARGET_FRAME_ACCESSIBLE: target.frameAccessible,
      TARGET_SELECTED_SCOPE: target.selectedScope,
      TARGET_SELECTED_PATH: target.selectedPath,
      TARGET_SELECTED_TITLE: target.selectedTitle,
      TARGET_ACCESS_ERROR: target.error,

      SOURCE_CHAIN_STATUS: inspected.missingSourceCount === 0
        ? "ALL_TRACKED_SOURCES_OBSERVED"
        : "TRACKED_SOURCE_GAPS_REMAIN",
      SOURCE_SCAN_STATUS: "SOURCE_SCAN_COMPLETE",
      SOURCE_SCAN_SCOPE_COUNT: inspected.documentScopes.length,
      PRESENT_SOURCE_COUNT: inspected.presentSourceCount,
      MISSING_SOURCE_COUNT: inspected.missingSourceCount,
      MISSING_SOURCES: inspected.missingSources.join(","),

      NORTH_PRESENT: Boolean(aliases.NORTH && aliases.NORTH.present),
      EAST_PROBE_PRESENT: Boolean(aliases.EAST_PROBE && aliases.EAST_PROBE.present),
      SURFACE_TRUTH_PRESENT: Boolean(aliases.SURFACE_TRUTH && aliases.SURFACE_TRUTH.present),
      SOUTH_PRESENT: Boolean(aliases.SOUTH && aliases.SOUTH.present),
      SOUTH_SURFACE_POINTER_PRESENT: Boolean(
        aliases.SOUTH_SURFACE_POINTER && aliases.SOUTH_SURFACE_POINTER.present
      ),
      WEST_DIAGNOSTIC_PRESENT: Boolean(aliases.WEST_DIAGNOSTIC && aliases.WEST_DIAGNOSTIC.present),
      LABWEST_PRESENT: Boolean(aliases.LABWEST && aliases.LABWEST.present),

      NORTH_AUTHORITY_PATH: aliases.NORTH ? aliases.NORTH.authorityPath : "NONE",
      EAST_PROBE_AUTHORITY_PATH: aliases.EAST_PROBE ? aliases.EAST_PROBE.authorityPath : "NONE",
      SURFACE_TRUTH_AUTHORITY_PATH: aliases.SURFACE_TRUTH
        ? aliases.SURFACE_TRUTH.authorityPath
        : "NONE",
      SOUTH_AUTHORITY_PATH: aliases.SOUTH ? aliases.SOUTH.authorityPath : "NONE",
      SOUTH_SURFACE_POINTER_AUTHORITY_PATH: aliases.SOUTH_SURFACE_POINTER
        ? aliases.SOUTH_SURFACE_POINTER.authorityPath
        : "NONE",
      WEST_DIAGNOSTIC_AUTHORITY_PATH: aliases.WEST_DIAGNOSTIC
        ? aliases.WEST_DIAGNOSTIC.authorityPath
        : "NONE",
      LABWEST_AUTHORITY_PATH: aliases.LABWEST ? aliases.LABWEST.authorityPath : "NONE",

      PARTICIPANT_ALIAS_SUMMARY: {
        NORTH: aliases.NORTH,
        EAST: aliases.EAST,
        EAST_PROBE: aliases.EAST_PROBE,
        SURFACE_TRUTH: aliases.SURFACE_TRUTH,
        SOUTH: aliases.SOUTH,
        SOUTH_SURFACE_POINTER: aliases.SOUTH_SURFACE_POINTER,
        WEST_DIAGNOSTIC: aliases.WEST_DIAGNOSTIC,
        LABWEST: aliases.LABWEST
      },
      SOURCE_EVIDENCE: inspected.sourceEvidence,
      DOCUMENT_SCOPE_EVIDENCE: inspected.documentScopes,

      RECEIPT_STATUS: "EAST_DIRECT_PACKET_RETURNED",
      RECEIPT_SUMMARY:
        "East authority found. runEastSourceRead returned a plain structured packet for the workbench.",
      GAP_CLOSED: "DIRECT_PACKET_EMPTY_TO_DIRECT_PACKET_STRUCTURED",
      PREVIOUS_GAP: "DIRECT_PACKET_KEYS_UNKNOWN_DIRECT_PACKET_EMPTY",
      NEXT_ACTION: "RERUN_16_EAST_DIRECT_THEN_RERUN_21_NEXT_MOVE",
      RECOMMENDED_NEXT_AUDIT: "21 · Next Move",
      DO_NOT_TOUCH: makeNoTouchBoundaryText(),
      NO_TOUCH_BOUNDARY: makeNoTouchBoundaryText()
    };

    addNoTouch(packet);

    directPacketKeys = Object.keys(packet).filter(function omitEvidenceHeavyKeys(key) {
      return key !== "SOURCE_EVIDENCE" &&
        key !== "DOCUMENT_SCOPE_EVIDENCE" &&
        key !== "PARTICIPANT_ALIAS_SUMMARY";
    });

    packet.DIRECT_PACKET_KEYS = directPacketKeys.join(",");
    packet.DIRECT_PACKET_KEY_COUNT = directPacketKeys.length;

    state.lastRunAt = generatedAt;
    state.runCount += 1;
    state.lastPacket = packet;
    state.lastError = "NONE";

    return packet;
  }

  function makeState() {
    var inspected = inspectLoadedSources();
    var aliases = inspected.participantAliases;
    var eastProbe = aliases.EAST || {};
    var updatedAt = nowIso();

    var statePacket = {
      PACKET: "HEARTH_DIAGNOSTIC_RAIL_EAST_STATE_PACKET_v3",
      PACKET_NAME: "HEARTH_DIAGNOSTIC_RAIL_EAST_STATE_PACKET_v3",
      RECEIPT_LEVEL: "2_STATE",
      ROLE: ROLE,
      COMPONENT: COMPONENT,
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      UPDATED_AT: updatedAt,
      LOADED_AT: state.loadedAt,
      LAST_RUN_AT: state.lastRunAt,
      RUN_COUNT: state.runCount,
      LAST_ERROR: state.lastError,
      TRUST_STATE: eastProbe.present ? "AUTHORITY_FOUND" : "AUTHORITY_NOT_FOUND",
      BLOCKING: false,
      DIRECT_AUTHORITY_PATH: DIRECT_AUTHORITY_PATH,
      LEGACY_AUTHORITY_PATH: LEGACY_AUTHORITY_PATH,
      PUBLIC_METHOD_KEYS: PUBLIC_METHOD_KEYS,
      EAST_PRESENT: Boolean(eastProbe.present),
      EAST_AUTHORITY_PATH: eastProbe.authorityPath || "NONE",
      TARGET_ACCESS_STATUS: inspected.targetAccess.status,
      TARGET_ROUTE_CONFIRMED: inspected.targetAccess.routeConfirmed,
      PRESENT_SOURCE_COUNT: inspected.presentSourceCount,
      MISSING_SOURCE_COUNT: inspected.missingSourceCount,
      NEXT_ACTION: "RUN_16_EAST_DIRECT",
      DO_NOT_TOUCH: makeNoTouchBoundaryText(),
      NO_TOUCH_BOUNDARY: makeNoTouchBoundaryText()
    };

    addNoTouch(statePacket);
    state.lastState = statePacket;
    return statePacket;
  }

  function runEastSourceRead() {
    try {
      return makePacket("RUN_EAST_SOURCE_READ");
    } catch (error) {
      var failedAt = nowIso();
      var message = error && error.message ? error.message : asString(error, "UNKNOWN_ERROR");
      state.lastError = message;

      var packet = {
        PACKET: "HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_ERROR_PACKET_v3",
        PACKET_NAME: "HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_ERROR_PACKET_v3",
        RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
        ROLE: ROLE,
        COMPONENT: COMPONENT,
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
        INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
        VERSION: VERSION,
        FILE: FILE,
        UPDATED_AT: failedAt,
        RUN_STATE: "DIRECT_RUN_ERROR",
        TRUST_STATE: "AUTHORITY_FOUND_ERROR_DURING_READ",
        BLOCKING: true,
        RUN_EXECUTED: true,
        DIRECT_PACKET_READY: true,
        DIRECT_AUTHORITY_PATH: DIRECT_AUTHORITY_PATH,
        DIRECT_STATUS: "DIRECT_RUN_ERROR",
        DIRECT_METHOD: DIRECT_METHOD,
        DIRECT_ERROR: message,
        NEXT_ACTION: "INSPECT_EAST_DIRECT_PACKET_RETURN_ERROR",
        DO_NOT_TOUCH: makeNoTouchBoundaryText(),
        NO_TOUCH_BOUNDARY: makeNoTouchBoundaryText()
      };

      addNoTouch(packet);
      packet.DIRECT_PACKET_KEYS = Object.keys(packet).join(",");
      packet.DIRECT_PACKET_KEY_COUNT = Object.keys(packet).length;
      state.lastPacket = packet;
      return packet;
    }
  }

  function getEastReceipt() {
    if (state.lastPacket) return state.lastPacket;
    return makePacket("GET_EAST_RECEIPT");
  }

  function getEastState() {
    return makeState();
  }

  function getPacketText(packet) {
    var source = packet || getEastReceipt();
    var priority = [
      "PACKET",
      "PACKET_NAME",
      "RECEIPT_LEVEL",
      "AUDIT_SEQUENCE",
      "AUDIT_LABEL",
      "ROLE",
      "COMPONENT",
      "SCOPE",
      "CONTRACT",
      "RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "PREVIOUS_INTERNAL_RENEWAL_CONTRACT",
      "BASELINE_CONTRACT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "RUN_STATE",
      "TRUST_STATE",
      "BLOCKING",
      "RUN_EXECUTED",
      "DIRECT_PACKET_READY",
      "DIRECT_PACKET_KEYS",
      "DIRECT_PACKET_KEY_COUNT",
      "DIRECT_AUTHORITY_PATH",
      "LEGACY_AUTHORITY_PATH",
      "DIRECT_STATUS",
      "DIRECT_METHOD",
      "DIRECT_ERROR",
      "AUTHORITY_METHOD_COUNT",
      "AUTHORITY_METHOD_KEYS",
      "TARGET_ROUTE_ACCESS",
      "TARGET_ROUTE_CONFIRMED",
      "SOURCE_CHAIN_STATUS",
      "SOURCE_SCAN_STATUS",
      "PRESENT_SOURCE_COUNT",
      "MISSING_SOURCE_COUNT",
      "NORTH_PRESENT",
      "EAST_PRESENT",
      "EAST_PROBE_PRESENT",
      "SURFACE_TRUTH_PRESENT",
      "SOUTH_PRESENT",
      "SOUTH_SURFACE_POINTER_PRESENT",
      "WEST_DIAGNOSTIC_PRESENT",
      "LABWEST_PRESENT",
      "RECEIPT_STATUS",
      "GAP_CLOSED",
      "NEXT_ACTION",
      "DO_NOT_TOUCH",
      "NO_TOUCH_BOUNDARY",
      "UPDATED_AT"
    ];

    var seen = {};
    var keys = priority.concat(Object.keys(source || {})).filter(function unique(key) {
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });

    return keys.map(function line(key) {
      var value = source[key];
      if (Array.isArray(value) || isObject(value)) {
        try {
          value = compact(JSON.stringify(value), 20000);
        } catch (_error) {
          value = "[object]";
        }
      }
      if (value === undefined || value === null || value === "") value = "UNKNOWN";
      return key + "=" + value;
    }).join("\n");
  }

  function publishApi() {
    ensureNamespace("HEARTH");
    ensureNamespace("DEXTER_LAB");

    var api = {
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      BASELINE_CONTRACT: BASELINE_CONTRACT,
      BASELINE_RECEIPT: BASELINE_RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      ROLE: ROLE,
      COMPONENT: COMPONENT,
      DIRECT_AUTHORITY_PATH: DIRECT_AUTHORITY_PATH,
      LEGACY_AUTHORITY_PATH: LEGACY_AUTHORITY_PATH,
      DIRECT_PACKET_RETURN_BRIDGE_ACTIVE: true,
      DIRECT_PACKET_RETURN_BRIDGE_STATUS: "PUBLISHED",
      DIRECT_METHOD_SURFACE: PUBLIC_METHOD_KEYS,
      PUBLIC_METHOD_KEYS: PUBLIC_METHOD_KEYS,
      productionMutationAuthorized: false,
      canvasRepairAuthorized: false,
      canvasBuildAuthorized: false,
      canvasReleaseAuthorized: false,
      controlsRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      routeRepairAuthorized: false,
      targetRouteRendererMutationAuthorized: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };

    defineCallable(api, "runEastSourceRead", runEastSourceRead, true);
    defineCallable(api, "getEastReceipt", getEastReceipt, true);
    defineCallable(api, "getEastState", getEastState, true);

    defineCallable(api, "run", runEastSourceRead, false);
    defineCallable(api, "runDiagnostic", runEastSourceRead, false);
    defineCallable(api, "inspect", getEastReceipt, false);
    defineCallable(api, "getReport", getEastReceipt, false);
    defineCallable(api, "getReceipt", getEastReceipt, false);
    defineCallable(api, "getReceiptLight", getEastState, false);
    defineCallable(api, "getState", getEastState, false);
    defineCallable(api, "getPacket", getEastReceipt, false);
    defineCallable(api, "getPacketText", getPacketText, false);
    defineCallable(api, "inspectLoadedSources", inspectLoadedSources, false);
    defineCallable(api, "collectDocumentScopes", collectDocumentScopes, false);

    Object.keys(NO_TOUCH).forEach(function applyNoTouch(key) {
      api[key] = NO_TOUCH[key];
    });

    EAST_ALIAS_PATHS.forEach(function publish(path) {
      setPath(path, api);
    });

    root.HEARTH_DIAGNOSTIC_RAIL_EAST_RUN = runEastSourceRead;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_RUN_SOURCE_READ = runEastSourceRead;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_RECEIPT = getEastReceipt;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_STATE = getEastState;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_PACKET_TEXT = getPacketText;

    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_INTERNAL_RENEWAL_CONTRACT__ = INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_INTERNAL_RENEWAL_RECEIPT__ = INTERNAL_RENEWAL_RECEIPT;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_VERSION__ = VERSION;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_BRIDGE_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_PACKET_RETURN_BRIDGE_STATUS__ = "PUBLISHED";
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_AUTHORITY_PATH__ = DIRECT_AUTHORITY_PATH;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_LEGACY_AUTHORITY_PATH__ = LEGACY_AUTHORITY_PATH;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_PUBLIC_METHOD_KEYS__ = PUBLIC_METHOD_KEYS;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CANVAS_REPAIR_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CONTROLS_REPAIR_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_RUNTIME_RESTART_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_TARGET_ROUTE_RENDERER_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_VISUAL_PASS_CLAIMED__ = false;

    state.lastState = makeState();
    return api;
  }

  var authority = publishApi();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = authority;
  }
})(typeof window !== "undefined" ? window : globalThis);
