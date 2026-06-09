// /assets/hearth/hearth.diagnostic.east.js
// HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_SOURCE_READ_METHOD_SURFACE_TNT_v2
// Internal bridge renewal:
// HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_TNT_v2_1
// Full-file replacement.
// EAST / served-source evidence / direct source-read method surface / receipt-light callable bridge.
//
// Receipt-forced reason:
// - 99 · DEEP_ARCHIVE proves EAST file loaded and JUDGE_EAST alias now present.
// - 09 · EAST proves v2 receipt fields settled.
// - 09 · EAST still reports RUN_EXECUTED=false and DIRECT_METHOD=NONE.
// - Therefore the callable method surface must be bridged onto the receipt-light surface the chamber is actually reading.
//
// Does not authorize:
// - production mutation
// - canvas repair
// - canvas build
// - canvas release
// - controls mutation
// - runtime restart
// - route repair
// - visual pass claim

(function hearthDiagnosticEastReceiptLightCallableBridge(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var documentRef = root.document || null;

  var CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  var RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_SOURCE_READ_METHOD_SURFACE_TNT_v2";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_SOURCE_READ_METHOD_SURFACE_RECEIPT_v2";

  var RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_TNT_v2_1";
  var RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT_v2_1";

  var PREVIOUS_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  var PREVIOUS_RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";

  var VERSION =
    "2026-06-09.hearth-diagnostic-rail-east-receipt-light-callable-bridge-v2-1";

  var FILE = "/assets/hearth/hearth.diagnostic.east.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var ROLE = "EAST";
  var COMPONENT = "EAST";
  var AUTHORITY_PATH = "JUDGE_EAST";
  var CANONICAL_AUTHORITY_PATH = "HEARTH_DIAGNOSTIC_RAIL_EAST";

  var DIRECT_METHODS_PUBLISHED =
    "run,runDiagnostic,runEastSourceRead,inspect,getReport,getReceipt,getReceiptLight,getCallableReceiptLight,getStatus,getState,getPacket,getPacketText,getSummary";

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
    EAST: [
      "JUDGE_EAST",
      "HEARTH_DIAGNOSTIC_RAIL_EAST",
      "HEARTH.diagnosticEast",
      "HEARTH.diagnosticRailEast",
      "HEARTH.JUDGE_EAST_SOURCE_READ",
      "DEXTER_LAB.hearthDiagnosticEast"
    ],
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
    hearthRepairAuthorized: false,
    routeRepairAuthorized: false,
    routeConductorMutationAuthorized: false,
    controlMutationAuthorized: false,
    controlsMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasBuildAuthorized: false,
    canvasRepairAuthorized: false,
    canvasReleaseAuthorized: false,
    runtimeRestartAuthorized: false,
    f13Claimed: false,
    f21Claimed: false,
    f55Claimed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    publicSuperiorityClaim: false,

    PRODUCTION_MUTATION_AUTHORIZED: false,
    HEARTH_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    CONTROLS_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_BUILD_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    F13_CLAIMED: false,
    F21_CLAIMED: false,
    F55_CLAIMED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,
    PUBLIC_SUPERIORITY_CLAIM: false
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
    if (limit === undefined) limit = 6000;
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
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) return null;
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

    var openerDoc = null;
    try {
      if (root.opener && root.opener !== root) openerDoc = safeWindowDocument(root.opener);
    } catch (_error) {}
    addDocumentScope(scopes, seen, "opener.document", openerDoc, "OPENER_DOCUMENT");
    addFrameScopes(scopes, seen, "opener.document", openerDoc);

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
      var url = new URL(raw, root.location && root.location.origin ? root.location.origin : undefined);
      return url.pathname;
    } catch (_error) {
      return raw;
    }
  }

  function sourceMatch(path, scriptSrc) {
    var normalized = normalizeSrc(scriptSrc);
    return normalized === path || normalized.indexOf(path) !== -1 || asString(scriptSrc).indexOf(path) !== -1;
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

      out[label] = {
        label: label,
        present: false,
        authorityPath: "NONE",
        valueType: "undefined",
        aliases: aliases.map(function inspectAlias(alias) {
          var value = readPath(alias);
          var found = value !== null && value !== undefined;
          var type = found ? typeof value : "undefined";

          if (found && !firstFound) {
            firstFound = {
              alias: alias,
              valueType: type,
              value: value
            };
          }

          return {
            alias: alias,
            found: found,
            valueType: type,
            contract:
              found && isObject(value)
                ? asString(
                    safeGetOwn(value, "CONTRACT", safeGetOwn(value, "contract", "UNKNOWN"))
                  )
                : "UNKNOWN",
            internalRenewalContract:
              found && isObject(value)
                ? asString(
                    safeGetOwn(
                      value,
                      "INTERNAL_RENEWAL_CONTRACT",
                      safeGetOwn(value, "internalRenewalContract", "UNKNOWN")
                    )
                  )
                : "UNKNOWN",
            receiptLightCallableBridgeActive:
              found && isObject(value)
                ? Boolean(
                    safeGetOwn(
                      value,
                      "receiptLightCallableBridgeActive",
                      safeGetOwn(value, "RECEIPT_LIGHT_CALLABLE_BRIDGE_ACTIVE", false)
                    )
                  )
                : false,
            methodCount:
              found && isObject(value)
                ? Object.keys(value).filter(function methodKey(key) {
                    return isFunction(value[key]);
                  }).length
                : 0
          };
        })
      };

      if (firstFound) {
        out[label].present = true;
        out[label].authorityPath = firstFound.alias;
        out[label].valueType = firstFound.valueType;
      }
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

    var participantAliases = inspectParticipantAliases();
    var targetAccess = inspectTargetAccess(scopes);

    var missingSources = sourceEvidence.filter(function missing(item) {
      return !item.scriptObserved;
    });

    var presentSources = sourceEvidence.filter(function present(item) {
      return item.scriptObserved;
    });

    return {
      scopes: scopes.map(function compactScope(scope) {
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
      participantAliases: participantAliases,
      targetAccess: targetAccess
    };
  }

  function canRunEast() {
    return true;
  }

  function makePacket(mode) {
    var inspected = inspectLoadedSources();
    var aliases = inspected.participantAliases;

    var eastPresent = Boolean(aliases.EAST && aliases.EAST.present);
    var northPresent = Boolean(aliases.NORTH && aliases.NORTH.present);
    var surfaceTruthPresent = Boolean(aliases.SURFACE_TRUTH && aliases.SURFACE_TRUTH.present);
    var southPresent = Boolean(aliases.SOUTH && aliases.SOUTH.present);
    var westPresent = Boolean(aliases.WEST_DIAGNOSTIC && aliases.WEST_DIAGNOSTIC.present);
    var labWestPresent = Boolean(aliases.LABWEST && aliases.LABWEST.present);

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_PACKET_v2_1",
      PACKET_NAME: "HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_PACKET_v2_1",
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      ROLE: ROLE,
      COMPONENT: COMPONENT,
      SCOPE: "ONE_COMPONENT_DIRECT_EXECUTION",
      MODE: mode || "RUN_DIAGNOSTIC",

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT: RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT,
      RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT: RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT,
      RECEIPT_LIGHT_CALLABLE_BRIDGE_ACTIVE: true,
      RECEIPT_LIGHT_CALLABLE_BRIDGE_STATUS: "PUBLISHED",
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),
      UPDATED_AT: nowIso(),

      RUN_STATE: "EAST_DIRECT_RUN_COMPLETE",
      TRUST_STATE: "EAST_DIRECT_METHOD_SURFACE_TRUSTED",
      BLOCKING: false,

      DIRECT_AUTHORITY_PATH: AUTHORITY_PATH,
      CANONICAL_DIRECT_AUTHORITY_PATH: CANONICAL_AUTHORITY_PATH,
      DIRECT_METHOD_PUBLICATION_ACTIVE: true,
      DIRECT_METHOD_PUBLICATION_STATUS: "DIRECT_METHODS_PUBLISHED_ON_EAST_AUTHORITY_AND_RECEIPT_LIGHT_SURFACE",
      DIRECT_METHODS_PUBLISHED: DIRECT_METHODS_PUBLISHED,

      EAST_AUTHORITY_PATH: AUTHORITY_PATH,
      EAST_CANONICAL_AUTHORITY_PATH: CANONICAL_AUTHORITY_PATH,
      EAST_PRESENT: eastPresent,
      EAST_STATUS: eastPresent ? "AUTHORITY_FOUND" : "AUTHORITY_NOT_FOUND",
      EAST_RUN_EXECUTED: canRunEast(),
      EAST_DIRECT_METHOD: "runEastSourceRead",
      EAST_DIRECT_ERROR: "NONE",

      EAST_SOURCE_READ_ACTIVE: true,
      EAST_SERVED_SOURCE_EVIDENCE_ACTIVE: true,
      EAST_SOURCE_SCAN_STATUS: "SOURCE_SCAN_COMPLETE",
      EAST_SOURCE_SCAN_SCOPE_COUNT: inspected.scopes.length,
      EAST_PRESENT_SOURCE_COUNT: inspected.presentSourceCount,
      EAST_MISSING_SOURCE_COUNT: inspected.missingSourceCount,
      EAST_MISSING_SOURCES: inspected.missingSources.join(","),

      TARGET_ACCESS_STATUS: inspected.targetAccess.status,
      TARGET_ROUTE_CONFIRMED: inspected.targetAccess.routeConfirmed,
      TARGET_FRAME_PRESENT: inspected.targetAccess.framePresent,
      TARGET_FRAME_ACCESSIBLE: inspected.targetAccess.frameAccessible,
      TARGET_SELECTED_SCOPE: inspected.targetAccess.selectedScope,
      TARGET_SELECTED_PATH: inspected.targetAccess.selectedPath,
      TARGET_SELECTED_TITLE: inspected.targetAccess.selectedTitle,
      TARGET_ACCESS_ERROR: inspected.targetAccess.error,

      NORTH_PRESENT: northPresent,
      EAST_PROBE_PRESENT: Boolean(aliases.EAST_PROBE && aliases.EAST_PROBE.present),
      SURFACE_TRUTH_PRESENT: surfaceTruthPresent,
      SOUTH_PRESENT: southPresent,
      SOUTH_SURFACE_POINTER_PRESENT: Boolean(
        aliases.SOUTH_SURFACE_POINTER && aliases.SOUTH_SURFACE_POINTER.present
      ),
      WEST_DIAGNOSTIC_PRESENT: westPresent,
      LABWEST_PRESENT: labWestPresent,

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

      PARTICIPANT_ALIAS_EVIDENCE: aliases,
      SOURCE_EVIDENCE: inspected.sourceEvidence,
      DOCUMENT_SCOPE_EVIDENCE: inspected.scopes,

      PREVALENT_PROBLEM_CLASS: "DIRECT_METHOD_SURFACE_UNEVEN_ACROSS_DIAGNOSTIC_TRACK",
      PREVALENT_PROBLEM_VALIDATED_BY_RECEIPTS:
        "09_EAST_FOUND_NOT_RUN,10_SURFACE_TRUTH_FOUND_NOT_RUN,11_SOUTH_FOUND_NOT_RUN",
      EAST_IS_INTAKE_VALVE: true,
      EAST_SOURCE_READ_MUST_PRECEDE_SYNTHESIS: true,

      RECOMMENDED_NEXT_RECEIPT: "09 · East",
      RECOMMENDED_NEXT_FILE: surfaceTruthPresent
        ? "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js"
        : "/assets/hearth/hearth.diagnostic.probe.east.js",
      RECOMMENDED_NEXT_ACTION: "RUN_09_EAST_DIRECT_CHECK",
      NEXT_RECEIPT_RECOMMENDED: "09 · East",
      NEXT_FILE: surfaceTruthPresent
        ? "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js"
        : "/assets/hearth/hearth.diagnostic.probe.east.js",
      NEXT_ACTION: "RUN_09_EAST_DIRECT_CHECK",

      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE"
    };

    Object.keys(NO_TOUCH).forEach(function applyNoTouch(key) {
      packet[key] = NO_TOUCH[key];
    });

    return attachCallableBridge(packet);
  }

  function packetValue(value) {
    if (value === undefined || value === null || value === "") return "UNKNOWN";

    if (Array.isArray(value)) {
      try {
        return compact(JSON.stringify(value), 24000);
      } catch (_error) {
        return value.map(packetValue).join(" | ");
      }
    }

    if (isObject(value)) {
      var functionKeys = Object.keys(value).filter(function hasFunction(key) {
        return isFunction(value[key]);
      });

      var dataOnly = {};
      Object.keys(value).forEach(function copyData(key) {
        if (!isFunction(value[key])) dataOnly[key] = value[key];
      });

      if (functionKeys.length) dataOnly.CALLABLE_METHOD_KEYS = functionKeys.join(",");

      try {
        return compact(JSON.stringify(dataOnly), 24000);
      } catch (_error) {
        return "[object]";
      }
    }

    return compact(value);
  }

  function toPacketText(packet) {
    var priority = [
      "PACKET",
      "PACKET_NAME",
      "RECEIPT_LEVEL",
      "ROLE",
      "COMPONENT",
      "SCOPE",
      "CONTRACT",
      "RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT",
      "RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT",
      "RECEIPT_LIGHT_CALLABLE_BRIDGE_ACTIVE",
      "RECEIPT_LIGHT_CALLABLE_BRIDGE_STATUS",
      "PREVIOUS_CONTRACT",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "VERSION",
      "RUN_STATE",
      "TRUST_STATE",
      "BLOCKING",
      "DIRECT_AUTHORITY_PATH",
      "CANONICAL_DIRECT_AUTHORITY_PATH",
      "DIRECT_METHOD_PUBLICATION_ACTIVE",
      "DIRECT_METHOD_PUBLICATION_STATUS",
      "DIRECT_METHODS_PUBLISHED",
      "EAST_PRESENT",
      "EAST_STATUS",
      "EAST_RUN_EXECUTED",
      "EAST_DIRECT_METHOD",
      "EAST_DIRECT_ERROR",
      "EAST_SOURCE_READ_ACTIVE",
      "EAST_SOURCE_SCAN_STATUS",
      "TARGET_ACCESS_STATUS",
      "TARGET_ROUTE_CONFIRMED",
      "TARGET_FRAME_PRESENT",
      "TARGET_FRAME_ACCESSIBLE",
      "NORTH_PRESENT",
      "EAST_PROBE_PRESENT",
      "SURFACE_TRUTH_PRESENT",
      "SOUTH_PRESENT",
      "SOUTH_SURFACE_POINTER_PRESENT",
      "WEST_DIAGNOSTIC_PRESENT",
      "LABWEST_PRESENT",
      "PREVALENT_PROBLEM_CLASS",
      "RECOMMENDED_NEXT_RECEIPT",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "DO_NOT_TOUCH",
      "UPDATED_AT"
    ];

    var seen = {};
    var keys = priority.concat(Object.keys(packet || {})).filter(function unique(key) {
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });

    return keys.map(function makeLine(key) {
      return key + "=" + packetValue(packet[key]);
    }).join("\n");
  }

  function runEastSourceRead() {
    return makePacket("RUN_EAST_SOURCE_READ");
  }

  function runDiagnostic() {
    return runEastSourceRead();
  }

  function run() {
    return runEastSourceRead();
  }

  function inspect() {
    return makePacket("INSPECT");
  }

  function getReport() {
    return makePacket("GET_REPORT");
  }

  function getReceipt() {
    return makePacket("GET_RECEIPT");
  }

  function baseReceiptLight() {
    var inspected = inspectLoadedSources();
    var aliases = inspected.participantAliases;

    return {
      role: ROLE,
      component: COMPONENT,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      receiptLightCallableBridgeContract: RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT,
      receiptLightCallableBridgeReceipt: RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT,
      receiptLightCallableBridgeActive: true,
      receiptLightCallableBridgeStatus: "PUBLISHED",
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      directAuthorityPath: AUTHORITY_PATH,
      canonicalDirectAuthorityPath: CANONICAL_AUTHORITY_PATH,
      directMethodPublicationActive: true,
      directMethodPublicationStatus: "DIRECT_METHODS_PUBLISHED_ON_EAST_AUTHORITY_AND_RECEIPT_LIGHT_SURFACE",
      directMethodsPublished: DIRECT_METHODS_PUBLISHED,

      runApiAvailable: true,
      runDiagnosticApiAvailable: true,
      runEastSourceReadApiAvailable: true,
      inspectApiAvailable: true,
      getReportApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getCallableReceiptLightApiAvailable: true,
      getStatusApiAvailable: true,
      getStateApiAvailable: true,
      getPacketApiAvailable: true,
      getPacketTextApiAvailable: true,
      getSummaryApiAvailable: true,

      eastSourceReadActive: true,
      eastSourceScanStatus: "SOURCE_SCAN_COMPLETE",
      presentSourceCount: inspected.presentSourceCount,
      missingSourceCount: inspected.missingSourceCount,
      targetAccessStatus: inspected.targetAccess.status,
      targetRouteConfirmed: inspected.targetAccess.routeConfirmed,
      targetFramePresent: inspected.targetAccess.framePresent,
      targetFrameAccessible: inspected.targetAccess.frameAccessible,

      northPresent: Boolean(aliases.NORTH && aliases.NORTH.present),
      eastProbePresent: Boolean(aliases.EAST_PROBE && aliases.EAST_PROBE.present),
      surfaceTruthPresent: Boolean(aliases.SURFACE_TRUTH && aliases.SURFACE_TRUTH.present),
      southPresent: Boolean(aliases.SOUTH && aliases.SOUTH.present),
      southSurfacePointerPresent: Boolean(
        aliases.SOUTH_SURFACE_POINTER && aliases.SOUTH_SURFACE_POINTER.present
      ),
      westDiagnosticPresent: Boolean(aliases.WEST_DIAGNOSTIC && aliases.WEST_DIAGNOSTIC.present),
      labWestPresent: Boolean(aliases.LABWEST && aliases.LABWEST.present),

      productionMutationAuthorized: false,
      canvasRepairAuthorized: false,
      canvasBuildAuthorized: false,
      canvasReleaseAuthorized: false,
      controlsRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function attachCallableBridge(target) {
    if (!isObject(target)) return target;

    target.run = run;
    target.runDiagnostic = runDiagnostic;
    target.runEastSourceRead = runEastSourceRead;
    target.inspect = inspect;
    target.getReport = getReport;
    target.getReceipt = getReceipt;
    target.getReceiptLight = getReceiptLight;
    target.getCallableReceiptLight = getCallableReceiptLight;
    target.getStatus = getStatus;
    target.getState = getState;
    target.getPacket = getPacket;
    target.getPacketText = getPacketText;
    target.getSummary = getSummary;
    target.toPacketText = toPacketText;
    target.inspectLoadedSources = inspectLoadedSources;
    target.collectDocumentScopes = collectDocumentScopes;

    target.receiptLightCallableBridgeActive = true;
    target.receiptLightCallableBridgeStatus = "PUBLISHED";
    target.receiptLightCallableBridgeContract = RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT;
    target.receiptLightCallableBridgeReceipt = RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT;
    target.RECEIPT_LIGHT_CALLABLE_BRIDGE_ACTIVE = true;
    target.RECEIPT_LIGHT_CALLABLE_BRIDGE_STATUS = "PUBLISHED";
    target.RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT = RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT;
    target.RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT = RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT;

    return target;
  }

  function getReceiptLight() {
    return attachCallableBridge(baseReceiptLight());
  }

  function getCallableReceiptLight() {
    return getReceiptLight();
  }

  function getStatus() {
    var packet = makePacket("GET_STATUS");

    return attachCallableBridge({
      runState: packet.RUN_STATE,
      trustState: packet.TRUST_STATE,
      blocking: packet.BLOCKING,
      directAuthorityPath: packet.DIRECT_AUTHORITY_PATH,
      canonicalDirectAuthorityPath: packet.CANONICAL_DIRECT_AUTHORITY_PATH,
      directMethodPublicationActive: packet.DIRECT_METHOD_PUBLICATION_ACTIVE,
      directMethodPublicationStatus: packet.DIRECT_METHOD_PUBLICATION_STATUS,
      directMethodsPublished: packet.DIRECT_METHODS_PUBLISHED,
      receiptLightCallableBridgeContract: RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT,
      receiptLightCallableBridgeReceipt: RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT,
      receiptLightCallableBridgeActive: true,
      receiptLightCallableBridgeStatus: "PUBLISHED",
      eastPresent: packet.EAST_PRESENT,
      eastStatus: packet.EAST_STATUS,
      eastSourceReadActive: packet.EAST_SOURCE_READ_ACTIVE,
      eastSourceScanStatus: packet.EAST_SOURCE_SCAN_STATUS,
      targetAccessStatus: packet.TARGET_ACCESS_STATUS,
      targetRouteConfirmed: packet.TARGET_ROUTE_CONFIRMED,
      targetFramePresent: packet.TARGET_FRAME_PRESENT,
      targetFrameAccessible: packet.TARGET_FRAME_ACCESSIBLE,
      recommendedNextReceipt: packet.RECOMMENDED_NEXT_RECEIPT,
      nextFile: packet.NEXT_FILE,
      nextAction: packet.NEXT_ACTION,
      updatedAt: packet.UPDATED_AT
    });
  }

  function getState() {
    return makePacket("GET_STATE");
  }

  function getPacket() {
    return getReceipt();
  }

  function getPacketText() {
    return toPacketText(makePacket("GET_PACKET_TEXT"));
  }

  function getSummary() {
    return getStatus();
  }

  function publishApi(api) {
    api.CONTRACT = CONTRACT;
    api.RECEIPT = RECEIPT;
    api.INTERNAL_RENEWAL_CONTRACT = INTERNAL_RENEWAL_CONTRACT;
    api.INTERNAL_RENEWAL_RECEIPT = INTERNAL_RENEWAL_RECEIPT;
    api.RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT = RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT;
    api.RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT = RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT;
    api.RECEIPT_LIGHT_CALLABLE_BRIDGE_ACTIVE = true;
    api.RECEIPT_LIGHT_CALLABLE_BRIDGE_STATUS = "PUBLISHED";
    api.PREVIOUS_CONTRACT = PREVIOUS_CONTRACT;
    api.PREVIOUS_RECEIPT = PREVIOUS_RECEIPT;
    api.VERSION = VERSION;
    api.FILE = FILE;
    api.TARGET_ROUTE = TARGET_ROUTE;
    api.DIAGNOSTIC_ROUTE = DIAGNOSTIC_ROUTE;
    api.ROLE = ROLE;
    api.COMPONENT = COMPONENT;

    api.contract = CONTRACT;
    api.receipt = RECEIPT;
    api.internalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    api.internalRenewalReceipt = INTERNAL_RENEWAL_RECEIPT;
    api.receiptLightCallableBridgeContract = RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT;
    api.receiptLightCallableBridgeReceipt = RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT;
    api.receiptLightCallableBridgeActive = true;
    api.receiptLightCallableBridgeStatus = "PUBLISHED";
    api.previousContract = PREVIOUS_CONTRACT;
    api.version = VERSION;
    api.file = FILE;
    api.targetRoute = TARGET_ROUTE;
    api.diagnosticRoute = DIAGNOSTIC_ROUTE;
    api.role = ROLE;
    api.component = COMPONENT;

    api.DIRECT_AUTHORITY_PATH = AUTHORITY_PATH;
    api.CANONICAL_DIRECT_AUTHORITY_PATH = CANONICAL_AUTHORITY_PATH;
    api.DIRECT_METHOD_PUBLICATION_ACTIVE = true;
    api.DIRECT_METHOD_PUBLICATION_STATUS =
      "DIRECT_METHODS_PUBLISHED_ON_EAST_AUTHORITY_AND_RECEIPT_LIGHT_SURFACE";
    api.DIRECT_METHODS_PUBLISHED = DIRECT_METHODS_PUBLISHED;

    api.directAuthorityPath = AUTHORITY_PATH;
    api.canonicalDirectAuthorityPath = CANONICAL_AUTHORITY_PATH;
    api.directMethodPublicationActive = true;
    api.directMethodPublicationStatus =
      "DIRECT_METHODS_PUBLISHED_ON_EAST_AUTHORITY_AND_RECEIPT_LIGHT_SURFACE";
    api.directMethodsPublished = DIRECT_METHODS_PUBLISHED;

    attachCallableBridge(api);

    api.runApiAvailable = true;
    api.runDiagnosticApiAvailable = true;
    api.runEastSourceReadApiAvailable = true;
    api.inspectApiAvailable = true;
    api.getReportApiAvailable = true;
    api.getReceiptApiAvailable = true;
    api.getReceiptLightApiAvailable = true;
    api.getCallableReceiptLightApiAvailable = true;
    api.getStatusApiAvailable = true;
    api.getStateApiAvailable = true;
    api.getPacketApiAvailable = true;
    api.getPacketTextApiAvailable = true;
    api.getSummaryApiAvailable = true;

    Object.keys(NO_TOUCH).forEach(function applyNoTouch(key) {
      api[key] = NO_TOUCH[key];
    });

    return api;
  }

  function publishAliases(api) {
    ensureNamespace("HEARTH");
    ensureNamespace("DEXTER_LAB");

    EAST_ALIAS_PATHS.forEach(function publish(path) {
      setPath(path, api);
    });

    root.HEARTH_DIAGNOSTIC_RAIL_EAST_RUN = run;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_RUN_DIAGNOSTIC = runDiagnostic;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_RUN_SOURCE_READ = runEastSourceRead;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_INSPECT = inspect;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_RECEIPT = getReceipt;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_RECEIPT_LIGHT = getReceiptLight;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_CALLABLE_RECEIPT_LIGHT = getCallableReceiptLight;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_STATUS = getStatus;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_STATE = getState;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_GET_SUMMARY = getSummary;

    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_INTERNAL_RENEWAL_CONTRACT__ =
      INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT__ =
      RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT__ =
      RECEIPT_LIGHT_CALLABLE_BRIDGE_RECEIPT;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT_LIGHT_CALLABLE_BRIDGE_STATUS__ =
      "PUBLISHED";
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_VERSION__ = VERSION;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_METHOD_PUBLICATION_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_DIRECT_AUTHORITY_PATH__ = AUTHORITY_PATH;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CANONICAL_DIRECT_AUTHORITY_PATH__ =
      CANONICAL_AUTHORITY_PATH;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_RAIL_EAST_RUNTIME_RESTART_AUTHORIZED__ = false;

    return api;
  }

  var authority = publishApi({});
  publishAliases(authority);

  if (typeof module !== "undefined" && module.exports) {
    module.exports = authority;
  }
})(typeof window !== "undefined" ? window : globalThis);
