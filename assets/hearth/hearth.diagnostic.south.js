// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATION_DUPLICATE_STANDARD_COLLAPSE_TNT_v11
// Full-file replacement.
// South packet-output handoff only.
// Purpose:
// - Preserve the public South diagnostic handoff contract.
// - Audit oversized diagnostic receipts.
// - Segregate receipt evidence into copyable sections.
// - Collapse duplicate standards into canonical reference blocks.
// - Produce a compact manifest for copying.
// - Preserve raw evidence by reference.
// - Support gauge screenshots by producing a gauge-aligned summary.
// Does not:
// - own truth
// - own North arbitration
// - own LabWest derivative map
// - own Canvas build authority
// - authorize repair
// - mutate production
// - restart runtime
// - draw Canvas
// - force a North receipt
// - claim ready / F13 / F21 / final visual pass
//

(function () {
  "use strict";

  var ROOT = typeof window !== "undefined" ? window : globalThis;
  var DOCUMENT = typeof document !== "undefined" ? document : null;

  var PUBLIC_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10";
  var PUBLIC_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_RECEIPT_v10";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATION_DUPLICATE_STANDARD_COLLAPSE_TNT_v11";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATION_DUPLICATE_STANDARD_COLLAPSE_RECEIPT_v11";

  var FILE = "/assets/hearth/hearth.diagnostic.south.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  var VERSION =
    "2026-06-08.hearth-diagnostic-south-receipt-segregation-duplicate-standard-collapse-v11";

  var ROLE = "SOUTH_PACKET_OUTPUT_HANDOFF";
  var PROFILE_CLASS = "RECEIPT_SEGREGATION_AND_PACKET_OUTPUT_CARRIER";
  var CYCLE_POSITION = "DIAGNOSTIC_TRACK_SOUTH_PACKET_OUTPUT_STAGE";
  var UPSTREAM_CONSTRUCT = "LABWEST_DERIVATIVE_CONSTRUCT";

  var NO_CLAIMS = {
    TRUTH_AUTHORITY: false,
    FINAL_ARBITRATION: false,
    REPAIR_AUTHORIZATION: false,
    GAUGE_VERDICT_REPLACEMENT: false,
    NORTH_GRAMMAR_AUTHORITY: false,
    WEST_DERIVATIVE_MAP_AUTHORITY: false,
    CANVAS_BUILD_AUTHORITY: false,
    CANVAS_PRODUCTION_REPAIR_AUTHORITY: false,
    FORCED_RECEIPT_RETURN: false,

    truthAuthorityClaimed: false,
    finalArbitrationClaimed: false,
    repairAuthorizationClaimed: false,
    gaugeVerdictReplacementClaimed: false,
    northGrammarAuthorityClaimed: false,
    westDerivativeMapAuthorityClaimed: false,
    canvasBuildAuthorityClaimed: false,
    canvasProductionRepairAuthorityClaimed: false,
    forcedReceiptReturnClaimed: false,

    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    canvasDrawingAuthorized: false,
    f13Claimed: false,
    f21Claimed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  };

  var CANONICAL_STANDARDS = {
    CANONICAL_NO_CLAIM_STANDARD: {
      id: "CANONICAL_NO_CLAIM_STANDARD",
      status: "ACTIVE",
      description:
        "No production mutation, no Hearth repair, no runtime restart, no Canvas release, no F13, no F21, no ready text, no visual pass.",
      fields: [
        "PRODUCTION_MUTATION_AUTHORIZED",
        "HEARTH_REPAIR_AUTHORIZED",
        "RUNTIME_RESTART_AUTHORIZED",
        "CANVAS_RELEASE_AUTHORIZED",
        "CANVAS_DRAWING_AUTHORIZED",
        "F13_CLAIMED",
        "F21_CLAIMED",
        "READY_TEXT_CLAIMED",
        "VISUAL_PASS_CLAIMED",
        "FINAL_VISUAL_PASS_CLAIMED",
        "GENERATED_IMAGE",
        "GRAPHIC_BOX",
        "WEBGL"
      ],
      canonicalValue: false
    },
    CANONICAL_ROUTE_METADATA_STANDARD: {
      id: "CANONICAL_ROUTE_METADATA_STANDARD",
      status: "ACTIVE",
      fields: [
        "TARGET_ROUTE",
        "DIAGNOSTIC_ROUTE",
        "ROUTE",
        "REPORT_PACKET",
        "CONTRACT",
        "RECEIPT",
        "PREVIOUS_CONTRACT",
        "BASELINE_CONTRACT",
        "VERSION"
      ]
    },
    CANONICAL_GAUGE_RECEIPT_LAW_STANDARD: {
      id: "CANONICAL_GAUGE_RECEIPT_LAW_STANDARD",
      status: "ACTIVE",
      fields: [
        "RECEIPTS_ARE_SPECIFIC_DIAGNOSTIC_EVIDENCE",
        "GAUGES_ARE_COLLECTIVE_DIAGNOSTIC_VARIANCE",
        "GAUGES_DO_NOT_REPLACE_RECEIPTS",
        "GAUGES_AUTHORIZE_REPAIR",
        "SCREENSHOT_SAFE_GAUGE_SURFACE_ACTIVE"
      ],
      laws: {
        RECEIPTS_ARE_SPECIFIC_DIAGNOSTIC_EVIDENCE: true,
        GAUGES_ARE_COLLECTIVE_DIAGNOSTIC_VARIANCE: true,
        GAUGES_DO_NOT_REPLACE_RECEIPTS: true,
        GAUGES_AUTHORIZE_REPAIR: false
      }
    },
    CANONICAL_SOUTH_BOUNDARY_STANDARD: {
      id: "CANONICAL_SOUTH_BOUNDARY_STANDARD",
      status: "ACTIVE",
      laws: {
        SOUTH_MAY_SEGREGATE_RECEIPTS: true,
        SOUTH_MAY_COLLAPSE_DUPLICATE_STANDARDS: true,
        SOUTH_MAY_PRODUCE_COPYABLE_MANIFEST: true,
        SOUTH_MAY_PRESERVE_RAW_EVIDENCE_BY_REFERENCE: true,
        SOUTH_MAY_NOT_CHANGE_DIAGNOSTIC_FACTS: true,
        SOUTH_MAY_NOT_FINAL_ARBITRATE: true,
        SOUTH_MAY_NOT_AUTHORIZE_REPAIR: true
      }
    }
  };

  var SECTION_DEFINITIONS = [
    {
      id: "CONTROL_GATE",
      title: "Control Gate / Receiver",
      match: [
        "CONTROL_GATE",
        "RECEIVER",
        "RUN_BUTTON",
        "ALIGNMENT_RUN",
        "ROUTE_RECEIVER"
      ]
    },
    {
      id: "LAB_NORTH_AND_LABWEST",
      title: "Lab North / LabWest Construct",
      match: [
        "LAB_NORTH",
        "LABWEST",
        "LAB_RUNTIME",
        "GRAMMAR",
        "DERIVATIVE_CONSTRUCT"
      ]
    },
    {
      id: "NORTH_DIAGNOSTIC_TRACK",
      title: "North Diagnostic Track",
      match: [
        "NORTH_RAIL",
        "NORTH_VERDICT",
        "NORTH_RUN",
        "DIAGNOSTIC_RAIL",
        "CHRONOLOGY"
      ]
    },
    {
      id: "SURFACE_TRUTH_CONTRACTS",
      title: "Surface Truth / Canvas Contract Definitions",
      match: [
        "SURFACE_TRUTH",
        "CANVAS_SURFACE",
        "CANVAS_TRUTH",
        "CANVAS_RECT",
        "CANVAS_PIXEL",
        "CANONICAL_MOUNT",
        "CANONICAL_CANVAS",
        "CONTRACT_DEFINITION"
      ]
    },
    {
      id: "PROBE_NETWORK",
      title: "Probe Network",
      match: [
        "PROBE",
        "PROBE_NETWORK",
        "PROBE_PRESENT",
        "PROBE_RECEIPT",
        "PROBE_MISSING"
      ]
    },
    {
      id: "CANVAS_CYCLE_BOUNDARY",
      title: "Canvas Cycle Boundary",
      match: [
        "CANVAS_CYCLE",
        "CHAPEL",
        "BISHOP",
        "PRIEST",
        "HEX_SURFACE",
        "CANVAS_HUB"
      ]
    },
    {
      id: "CONTAINER_COLLAPSE_RISK",
      title: "Container Collapse Risk",
      match: [
        "CONTAINER",
        "COLLAPSE",
        "BORROWED_CONTRACT",
        "SUBSTITUTION",
        "PARENT_CHILD",
        "SIBLING"
      ]
    },
    {
      id: "DUTY_LOAD_MALPRACTICE",
      title: "Duty Load / Diagnostic Malpractice",
      match: [
        "DUTY",
        "MALPRACTICE",
        "SELF_MEASUREMENT",
        "SELF_DUTY",
        "OVERLOAD"
      ]
    },
    {
      id: "CONSTRUCTION_READINESS",
      title: "Construction Readiness",
      match: [
        "CONSTRUCTION",
        "READINESS",
        "DERIVATIVE_MAP",
        "CANVAS_BUILD"
      ]
    },
    {
      id: "SPECIFIC_RECEIPTS",
      title: "Specific Receipt Field",
      match: [
        "specificReceipts",
        "SPECIFIC_RECEIPT",
        "RECEIPT_FIELD",
        "receiptPresent",
        "receiptStatus"
      ]
    },
    {
      id: "GAUGE_VARIANCE",
      title: "Collective Gauge Variance",
      match: [
        "gaugeVariance",
        "GAUGE_VARIANCE",
        "GAUGE",
        "VARIANCE",
        "SCORE"
      ]
    },
    {
      id: "ERRORS_AND_EXCEPTIONS",
      title: "Errors / Exceptions",
      match: [
        "ERROR",
        "EXCEPTION",
        "FAILED",
        "LOAD_FAILED",
        "UNAVAILABLE"
      ]
    }
  ];

  var state = {
    publishedAt: "",
    lastRunAt: "",
    runCount: 0,
    lastRawRef: "",
    lastSegregationPacket: null,
    lastCompactManifest: "",
    lastSegregatedIndex: null,
    rawStore: {}
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback) {
    if (value === undefined || value === null) return fallback || "";
    return String(value);
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) {
        var out = {};
        Object.keys(value).forEach(function (key) {
          out[key] = value[key];
        });
        return out;
      }
      return value;
    }
  }

  function readPath(path) {
    if (!path || typeof path !== "string") return null;
    var parts = path.split(".");
    var cursor = ROOT;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) {
        return null;
      }
      cursor = cursor[parts[i]];
    }

    return cursor || null;
  }

  function ensureNamespace(name) {
    if (!ROOT[name] || typeof ROOT[name] !== "object") ROOT[name] = {};
    return ROOT[name];
  }

  function stableHash(text) {
    var source = safeString(text);
    var hash = 2166136261;

    for (var i = 0; i < source.length; i += 1) {
      hash ^= source.charCodeAt(i);
      hash +=
        (hash << 1) +
        (hash << 4) +
        (hash << 7) +
        (hash << 8) +
        (hash << 24);
    }

    return ("00000000" + (hash >>> 0).toString(16)).slice(-8);
  }

  function bounded(value, limit) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit || 5000);
  }

  function parsePacketText(text) {
    var out = {};
    var lines = safeString(text).split(/\r?\n/);

    lines.forEach(function (line) {
      var index = line.indexOf("=");
      if (index <= 0) return;
      var key = line.slice(0, index).trim();
      var value = line.slice(index + 1).trim();
      if (!key) return;
      out[key] = value;
    });

    return out;
  }

  function normalizeInput(input) {
    if (typeof input === "string") {
      var parsed = parsePacketText(input);
      return {
        rawType: "TEXT",
        rawText: input,
        object: Object.keys(parsed).length ? parsed : { RAW_TEXT: input }
      };
    }

    if (isObject(input)) {
      return {
        rawType: "OBJECT",
        rawText: "",
        object: clone(input)
      };
    }

    return {
      rawType: "EMPTY",
      rawText: "",
      object: {}
    };
  }

  function getKnownReceiverPacket() {
    var receiver =
      readPath("HEARTH.diagnosticGaugeVarianceReceiver") ||
      readPath("HEARTH.diagnosticConstructAlignmentGaugeReceiver") ||
      readPath("HEARTH_DIAGNOSTIC_GAUGE_VARIANCE_RECEIVER") ||
      readPath("HEARTH_DIAGNOSTIC_ROUTE_RECEIVER") ||
      null;

    if (receiver && isFunction(receiver.getAlignmentPacket)) {
      try {
        var packet = receiver.getAlignmentPacket();
        if (isObject(packet) && Object.keys(packet).length) return packet;
      } catch (_) {}
    }

    var globalPacket =
      readPath("HEARTH_DIAGNOSTIC_ALIGNMENT_GAUGE_VARIANCE_PACKET") ||
      readPath("HEARTH_DIAGNOSTIC_ROUTE_RECEIVER_REPORT") ||
      null;

    if (isObject(globalPacket)) return globalPacket;

    var packetText =
      readPath("HEARTH_DIAGNOSTIC_ALIGNMENT_GAUGE_VARIANCE_PACKET_TEXT") ||
      readPath("HEARTH_DIAGNOSTIC_ROUTE_RECEIVER_PACKET_TEXT") ||
      "";

    if (typeof packetText === "string" && packetText.trim()) {
      return parsePacketText(packetText);
    }

    return {};
  }

  function defaultInput() {
    var known = getKnownReceiverPacket();
    if (isObject(known) && Object.keys(known).length) return known;

    return {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_SOUTH_EMPTY_INPUT_ALIGNMENT_PACKET_v1",
      CONTRACT: PUBLIC_CONTRACT,
      RECEIPT: PUBLIC_RECEIPT,
      INPUT_STATUS: "NO_UPSTREAM_PACKET_FOUND",
      SOUTH_SEGREGATION_STATUS: "ACTIVE_EMPTY_INPUT"
    };
  }

  function keyMatchesSection(key, value, section) {
    var joined = (safeString(key) + " " + safeString(value)).toUpperCase();

    for (var i = 0; i < section.match.length; i += 1) {
      if (joined.indexOf(String(section.match[i]).toUpperCase()) >= 0) return true;
    }

    return false;
  }

  function flattenObject(value, prefix, out, depth) {
    var maxDepth = 5;
    var currentDepth = depth || 0;

    if (currentDepth > maxDepth) {
      out[prefix || "VALUE"] = "[DEPTH_LIMIT]";
      return out;
    }

    if (Array.isArray(value)) {
      out[prefix || "ARRAY"] = "ARRAY_LENGTH_" + value.length;
      value.slice(0, 24).forEach(function (item, index) {
        if (isObject(item) || Array.isArray(item)) {
          flattenObject(item, (prefix || "ARRAY") + "." + index, out, currentDepth + 1);
        } else {
          out[(prefix || "ARRAY") + "." + index] = item;
        }
      });
      return out;
    }

    if (isObject(value)) {
      Object.keys(value).forEach(function (key) {
        var nextKey = prefix ? prefix + "." + key : key;
        var item = value[key];
        if (isObject(item) || Array.isArray(item)) {
          flattenObject(item, nextKey, out, currentDepth + 1);
        } else {
          out[nextKey] = item;
        }
      });
      return out;
    }

    out[prefix || "VALUE"] = value;
    return out;
  }

  function segregateFields(object) {
    var flat = flattenObject(object || {}, "", {}, 0);
    var sections = {};
    var unclassified = {};

    SECTION_DEFINITIONS.forEach(function (section) {
      sections[section.id] = {
        id: section.id,
        title: section.title,
        keyCount: 0,
        keys: [],
        sample: {}
      };
    });

    Object.keys(flat).forEach(function (key) {
      var value = flat[key];
      var placed = false;

      for (var i = 0; i < SECTION_DEFINITIONS.length; i += 1) {
        var section = SECTION_DEFINITIONS[i];
        if (keyMatchesSection(key, value, section)) {
          sections[section.id].keyCount += 1;
          sections[section.id].keys.push(key);
          if (Object.keys(sections[section.id].sample).length < 12) {
            sections[section.id].sample[key] = value;
          }
          placed = true;
          break;
        }
      }

      if (!placed) {
        unclassified[key] = value;
      }
    });

    sections.UNCLASSIFIED = {
      id: "UNCLASSIFIED",
      title: "Unclassified / Other",
      keyCount: Object.keys(unclassified).length,
      keys: Object.keys(unclassified),
      sample: Object.keys(unclassified).slice(0, 12).reduce(function (out, key) {
        out[key] = unclassified[key];
        return out;
      }, {})
    };

    return sections;
  }

  function collapseDuplicateStandards(object) {
    var flat = flattenObject(object || {}, "", {}, 0);
    var collapsed = {};
    var references = {};
    var duplicateCount = 0;

    Object.keys(CANONICAL_STANDARDS).forEach(function (standardId) {
      var standard = CANONICAL_STANDARDS[standardId];
      collapsed[standardId] = clone(standard);
      references[standardId] = [];
    });

    Object.keys(flat).forEach(function (key) {
      var upperKey = key.toUpperCase();
      var upperValue = safeString(flat[key]).toUpperCase();

      CANONICAL_STANDARDS.CANONICAL_NO_CLAIM_STANDARD.fields.forEach(function (field) {
        if (upperKey.indexOf(field) >= 0 || upperKey.indexOf(field.toLowerCase().toUpperCase()) >= 0) {
          references.CANONICAL_NO_CLAIM_STANDARD.push(key);
          duplicateCount += 1;
        }
      });

      CANONICAL_STANDARDS.CANONICAL_ROUTE_METADATA_STANDARD.fields.forEach(function (field) {
        if (upperKey === field || upperKey.endsWith("." + field) || upperKey.indexOf(field) >= 0) {
          references.CANONICAL_ROUTE_METADATA_STANDARD.push(key);
          duplicateCount += 1;
        }
      });

      CANONICAL_STANDARDS.CANONICAL_GAUGE_RECEIPT_LAW_STANDARD.fields.forEach(function (field) {
        if (upperKey.indexOf(field) >= 0 || upperValue.indexOf(field) >= 0) {
          references.CANONICAL_GAUGE_RECEIPT_LAW_STANDARD.push(key);
          duplicateCount += 1;
        }
      });

      if (
        upperKey.indexOf("SOUTH") >= 0 ||
        upperValue.indexOf("SOUTH_PACKET_OUTPUT") >= 0 ||
        upperValue.indexOf("RECEIPT_SEGREGATION") >= 0
      ) {
        references.CANONICAL_SOUTH_BOUNDARY_STANDARD.push(key);
        duplicateCount += 1;
      }
    });

    Object.keys(references).forEach(function (standardId) {
      references[standardId] = references[standardId].filter(function (value, index, array) {
        return array.indexOf(value) === index;
      });
    });

    return {
      DUPLICATE_STANDARDS_COLLAPSED: true,
      DUPLICATE_STANDARD_COLLAPSE_DOES_NOT_MEAN_EVIDENCE_DELETION: true,
      RAW_EVIDENCE_PRESERVED_BY_REFERENCE: true,
      COLLAPSED_STANDARD_COUNT: Object.keys(collapsed).length,
      COLLAPSED_FIELD_REFERENCE_COUNT: duplicateCount,
      canonicalStandards: collapsed,
      canonicalReferences: references
    };
  }

  function extractGaugeSummary(object) {
    var gauges = object && object.gaugeVariance && isObject(object.gaugeVariance)
      ? object.gaugeVariance
      : object && object.gaugeVariance && typeof object.gaugeVariance === "string"
        ? {}
        : {};

    var out = {
      CONTROL_GATE: "UNKNOWN",
      RECEIPT_FIELD_HEALTH: "UNKNOWN",
      LABWEST_CONSTRUCT: "UNKNOWN",
      NORTH_DIAGNOSTIC_TRACK: "UNKNOWN",
      SURFACE_TRUTH_CONTRACTS: "UNKNOWN",
      PROBE_NETWORK: "UNKNOWN",
      CANVAS_CYCLE_BOUNDARY: "UNKNOWN",
      CONTAINER_COLLAPSE_RISK: "UNKNOWN",
      DUTY_LOAD_MALPRACTICE: "UNKNOWN",
      CONSTRUCTION_READINESS: "UNKNOWN"
    };

    function readGauge(id, fallback) {
      var gauge = gauges[id];
      if (!gauge) return fallback || "UNKNOWN";
      return gauge.status || gauge.STATUS || fallback || "UNKNOWN";
    }

    out.CONTROL_GATE = readGauge("CONTROL_GATE", object.CONTROL_GATE_STATUS || "UNKNOWN");
    out.RECEIPT_FIELD_HEALTH = readGauge("RECEIPT_FIELD_HEALTH", object.SPECIFIC_RECEIPT_FIELD || "UNKNOWN");
    out.LABWEST_CONSTRUCT = readGauge("LABWEST_CONSTRUCT_ALIGNMENT", object.LABWEST_CONSTRUCT_PRESENT ? "PRESENT" : "UNKNOWN");
    out.NORTH_DIAGNOSTIC_TRACK = readGauge("NORTH_DIAGNOSTIC_TRACK", object.NORTH_RAIL_RECEIPT_PRESENT ? "PRESENT" : "UNKNOWN");
    out.SURFACE_TRUTH_CONTRACTS = readGauge("SURFACE_TRUTH_CONTRACTS", object.SURFACE_TRUTH_PROBE_RECEIPT_PRESENT ? "PRESENT" : "UNKNOWN");
    out.PROBE_NETWORK = readGauge("PROBE_NETWORK_VARIANCE", "UNKNOWN");
    out.CANVAS_CYCLE_BOUNDARY = readGauge("CANVAS_CYCLE_BOUNDARY", "UNKNOWN");
    out.CONTAINER_COLLAPSE_RISK = readGauge("CONTAINER_COLLAPSE_RISK", "UNKNOWN");
    out.DUTY_LOAD_MALPRACTICE = readGauge("DUTY_LOAD_MALPRACTICE", "UNKNOWN");
    out.CONSTRUCTION_READINESS = readGauge("CONSTRUCTION_READINESS", object.CONSTRUCTION_READINESS_STATUS || "UNKNOWN");

    return out;
  }

  function countReceiptField(object) {
    var specific = object && object.specificReceipts && isObject(object.specificReceipts)
      ? object.specificReceipts
      : {};

    var keys = Object.keys(specific);
    var present = 0;
    var receiptPresent = 0;
    var missing = 0;
    var noReceipt = 0;

    keys.forEach(function (key) {
      var record = specific[key];
      if (record && record.present) present += 1;
      else missing += 1;

      if (record && record.receiptPresent) receiptPresent += 1;
      else if (record && record.present) noReceipt += 1;
    });

    return {
      SPECIFIC_RECEIPT_RECORD_COUNT: keys.length,
      PARTICIPANT_PRESENT_COUNT: object.PARTICIPANT_PRESENT_COUNT || present,
      SPECIFIC_RECEIPT_PRESENT_COUNT: object.SPECIFIC_RECEIPT_PRESENT_COUNT || receiptPresent,
      PARTICIPANT_MISSING_COUNT: object.PARTICIPANT_MISSING_COUNT || missing,
      PRESENT_WITHOUT_RECEIPT_COUNT: object.PRESENT_WITHOUT_RECEIPT_COUNT || noReceipt
    };
  }

  function preserveRawEvidence(normalized) {
    var rawText = normalized.rawText || "";
    var objectText = "";

    try {
      objectText = JSON.stringify(normalized.object || {});
    } catch (_) {
      objectText = safeString(normalized.object);
    }

    var combined = rawText || objectText;
    var id = "RAW_RECEIPT_REF_" + stableHash(combined) + "_" + String(Date.now()).slice(-6);

    state.rawStore[id] = {
      id: id,
      storedAt: nowIso(),
      rawType: normalized.rawType,
      rawTextLength: rawText.length,
      objectKeyCount: Object.keys(normalized.object || {}).length,
      rawText: rawText,
      object: clone(normalized.object)
    };

    state.lastRawRef = id;
    return id;
  }

  function composeCompactManifest(object, rawRef, sections, duplicateReport) {
    var gauges = extractGaugeSummary(object);
    var receiptCounts = countReceiptField(object);

    var manifest = {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_COMPACT_MANIFEST_PACKET_v1",
      CONTRACT: PUBLIC_CONTRACT,
      RECEIPT: PUBLIC_RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      TARGET_ROUTE: object.TARGET_ROUTE || TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: object.DIAGNOSTIC_ROUTE || DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),

      SOUTH_SEGREGATION_STATUS: "ACTIVE",
      RECEIPTS_ARE_SPECIFIC_DIAGNOSTIC_EVIDENCE: true,
      GAUGES_ARE_COLLECTIVE_DIAGNOSTIC_VARIANCE: true,
      GAUGES_DO_NOT_REPLACE_RECEIPTS: true,
      SOUTH_DOES_NOT_AUTHORIZE_REPAIR: true,

      CONTROL_GATE: gauges.CONTROL_GATE,
      RECEIPT_FIELD_HEALTH: gauges.RECEIPT_FIELD_HEALTH,
      LABWEST_CONSTRUCT: gauges.LABWEST_CONSTRUCT,
      NORTH_DIAGNOSTIC_TRACK: gauges.NORTH_DIAGNOSTIC_TRACK,
      SURFACE_TRUTH_CONTRACTS: gauges.SURFACE_TRUTH_CONTRACTS,
      PROBE_NETWORK: gauges.PROBE_NETWORK,
      CANVAS_CYCLE_BOUNDARY: gauges.CANVAS_CYCLE_BOUNDARY,
      CONTAINER_COLLAPSE_RISK: gauges.CONTAINER_COLLAPSE_RISK,
      DUTY_LOAD_MALPRACTICE: gauges.DUTY_LOAD_MALPRACTICE,
      CONSTRUCTION_READINESS: gauges.CONSTRUCTION_READINESS,

      NORTH_VERDICT_AVAILABLE: object.NORTH_VERDICT_AVAILABLE || false,
      NORTH_RAIL_RECEIPT_PRESENT: object.NORTH_RAIL_RECEIPT_PRESENT || false,
      SURFACE_TRUTH_PROBE_RECEIPT_PRESENT: object.SURFACE_TRUTH_PROBE_RECEIPT_PRESENT || false,
      LABWEST_CONSTRUCT_RECEIPT_PRESENT: object.LABWEST_CONSTRUCT_RECEIPT_PRESENT || false,

      SPECIFIC_RECEIPT_PRESENT_COUNT: receiptCounts.SPECIFIC_RECEIPT_PRESENT_COUNT,
      PARTICIPANT_PRESENT_COUNT: receiptCounts.PARTICIPANT_PRESENT_COUNT,
      PARTICIPANT_MISSING_COUNT: receiptCounts.PARTICIPANT_MISSING_COUNT,
      PRESENT_WITHOUT_RECEIPT_COUNT: receiptCounts.PRESENT_WITHOUT_RECEIPT_COUNT,

      SEGREGATED_SECTION_COUNT: Object.keys(sections || {}).length,
      DUPLICATE_STANDARDS_COLLAPSED: duplicateReport.DUPLICATE_STANDARDS_COLLAPSED,
      COLLAPSED_STANDARD_COUNT: duplicateReport.COLLAPSED_STANDARD_COUNT,
      COLLAPSED_FIELD_REFERENCE_COUNT: duplicateReport.COLLAPSED_FIELD_REFERENCE_COUNT,
      RAW_RECEIPT_PRESERVED: true,
      RAW_RECEIPT_REF: rawRef,

      NEXT_DIAGNOSTIC_TARGET: FILE,
      NEXT_ACTION:
        "USE_SOUTH_COMPACT_MANIFEST_FOR_COPYING_AND_SEGREGATED_INDEX_FOR_RECEIPT_SCOPE"
    };

    return manifest;
  }

  function compactManifestText(manifest) {
    return Object.keys(manifest)
      .map(function (key) {
        return key + "=" + safeString(manifest[key]);
      })
      .join("\n");
  }

  function composeSegregatedIndex(sections) {
    var out = {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_SEGREGATED_RECEIPT_INDEX_v1",
      CONTRACT: PUBLIC_CONTRACT,
      RECEIPT: PUBLIC_RECEIPT,
      GENERATED_AT: nowIso(),
      sections: {}
    };

    Object.keys(sections || {}).forEach(function (key) {
      var section = sections[key];
      out.sections[key] = {
        id: section.id,
        title: section.title,
        keyCount: section.keyCount,
        keys: section.keys.slice(0, 80),
        sample: section.sample
      };
    });

    return out;
  }

  function segregateReceipt(input, options) {
    state.runCount += 1;
    state.lastRunAt = nowIso();

    var normalized = normalizeInput(input === undefined ? defaultInput() : input);
    var rawRef = preserveRawEvidence(normalized);
    var object = normalized.object || {};
    var sections = segregateFields(object);
    var duplicateReport = collapseDuplicateStandards(object);
    var manifest = composeCompactManifest(object, rawRef, sections, duplicateReport);
    var index = composeSegregatedIndex(sections);

    var packet = Object.assign(
      {
        PACKET_NAME:
          "HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATION_PACKET_v11",
        CONTRACT: PUBLIC_CONTRACT,
        RECEIPT: PUBLIC_RECEIPT,
        INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
        VERSION: VERSION,
        FILE: FILE,
        TARGET_ROUTE: TARGET_ROUTE,
        DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
        GENERATED_AT: state.lastRunAt,

        ROLE: ROLE,
        PROFILE_CLASS: PROFILE_CLASS,
        CYCLE_POSITION: CYCLE_POSITION,
        UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,

        SOUTH_RECEIPT_SEGREGATION_ACTIVE: true,
        SOUTH_DUPLICATE_STANDARD_COLLAPSE_ACTIVE: true,
        SOUTH_COPYABLE_COMPACT_MANIFEST_ACTIVE: true,
        RAW_EVIDENCE_PRESERVED_BY_REFERENCE: true,
        DUPLICATE_STANDARD_COLLAPSE_DOES_NOT_MEAN_EVIDENCE_DELETION: true,

        inputType: normalized.rawType,
        rawReceiptRef: rawRef,
        compactManifest: manifest,
        compactManifestText: compactManifestText(manifest),
        segregatedReceiptIndex: index,
        duplicateStandardCollapseReport: duplicateReport,

        defaultCopySurface: "COMPACT_MANIFEST",
        rawReceiptStoreRef: rawRef,
        rawReceiptStoreReadableThroughApiOnly: true
      },
      NO_CLAIMS
    );

    state.lastSegregationPacket = packet;
    state.lastCompactManifest = packet.compactManifestText;
    state.lastSegregatedIndex = index;

    return options && options.compactOnly ? clone(manifest) : clone(packet);
  }

  function getCompactManifest(input) {
    var packet = segregateReceipt(input === undefined ? defaultInput() : input);
    return clone(packet.compactManifest);
  }

  function getCompactManifestText(input) {
    if (input !== undefined) {
      return compactManifestText(getCompactManifest(input));
    }

    if (!state.lastCompactManifest) {
      segregateReceipt(defaultInput());
    }

    return state.lastCompactManifest;
  }

  function getSegregatedReceiptIndex(input) {
    if (input !== undefined) {
      return clone(segregateReceipt(input).segregatedReceiptIndex);
    }

    if (!state.lastSegregatedIndex) {
      segregateReceipt(defaultInput());
    }

    return clone(state.lastSegregatedIndex);
  }

  function getDuplicateStandardCollapseReport(input) {
    if (input !== undefined) {
      return clone(segregateReceipt(input).duplicateStandardCollapseReport);
    }

    if (!state.lastSegregationPacket) {
      segregateReceipt(defaultInput());
    }

    return clone(state.lastSegregationPacket.duplicateStandardCollapseReport);
  }

  function getRawEvidence(ref) {
    if (!ref) return null;
    return clone(state.rawStore[ref] || null);
  }

  function getLatestRawEvidence() {
    return state.lastRawRef ? getRawEvidence(state.lastRawRef) : null;
  }

  function composeReceiptLight() {
    return Object.assign(
      {
        PACKET_NAME:
          "HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATION_LIGHT_RECEIPT_v11",
        CONTRACT: PUBLIC_CONTRACT,
        RECEIPT: PUBLIC_RECEIPT,
        INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
        VERSION: VERSION,
        FILE: FILE,
        TARGET_ROUTE: TARGET_ROUTE,
        DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
        ROLE: ROLE,
        PROFILE_CLASS: PROFILE_CLASS,
        CYCLE_POSITION: CYCLE_POSITION,
        GENERATED_AT: nowIso(),

        SOUTH_RECEIPT_SEGREGATION_ACTIVE: true,
        SOUTH_DUPLICATE_STANDARD_COLLAPSE_ACTIVE: true,
        SOUTH_COPYABLE_COMPACT_MANIFEST_ACTIVE: true,
        SOUTH_RAW_EVIDENCE_REFERENCE_STORE_ACTIVE: true,

        RECEIPTS_ARE_SPECIFIC_DIAGNOSTIC_EVIDENCE: true,
        GAUGES_ARE_COLLECTIVE_DIAGNOSTIC_VARIANCE: true,
        GAUGES_DO_NOT_REPLACE_RECEIPTS: true,

        DEFAULT_COPY_SURFACE: "COMPACT_MANIFEST",
        FULL_RECEIPT_IS_NOT_DEFAULT_COPY_SURFACE: true,
        DUPLICATE_STANDARDS_COLLAPSED: true,
        RAW_EVIDENCE_PRESERVED_BY_REFERENCE: true,

        RAW_STORE_COUNT: Object.keys(state.rawStore).length,
        LAST_RAW_REF: state.lastRawRef || "NONE",
        LAST_RUN_AT: state.lastRunAt || "NEVER"
      },
      NO_CLAIMS
    );
  }

  function composeReceipt() {
    return Object.assign(
      {
        receiptLight: composeReceiptLight(),
        canonicalStandards: clone(CANONICAL_STANDARDS),
        sectionDefinitions: clone(SECTION_DEFINITIONS),
        lastCompactManifestText: state.lastCompactManifest || "COMPACT_MANIFEST=NOT_RUN",
        lastSegregatedReceiptIndex: clone(state.lastSegregatedIndex || {}),
        state: {
          publishedAt: state.publishedAt,
          lastRunAt: state.lastRunAt,
          runCount: state.runCount,
          rawStoreCount: Object.keys(state.rawStore).length,
          lastRawRef: state.lastRawRef || "NONE"
        }
      },
      composeReceiptLight()
    );
  }

  function getReceipt() {
    return composeReceipt();
  }

  function getReceiptLight() {
    return composeReceiptLight();
  }

  function getReport(input) {
    return segregateReceipt(input === undefined ? defaultInput() : input);
  }

  function getPacket(input) {
    return getReport(input);
  }

  function getPacketText(input) {
    return getCompactManifestText(input);
  }

  function getCompactSummary(input) {
    return getCompactManifestText(input);
  }

  function getState() {
    return clone({
      publishedAt: state.publishedAt,
      lastRunAt: state.lastRunAt,
      runCount: state.runCount,
      rawStoreCount: Object.keys(state.rawStore).length,
      lastRawRef: state.lastRawRef || "NONE",
      contract: PUBLIC_CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      role: ROLE,
      profileClass: PROFILE_CLASS
    });
  }

  function run(input) {
    return segregateReceipt(input === undefined ? defaultInput() : input);
  }

  function noOpLifecycle() {
    return getReceiptLight();
  }

  var API = {
    CONTRACT: PUBLIC_CONTRACT,
    RECEIPT: PUBLIC_RECEIPT,
    INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
    VERSION: VERSION,
    FILE: FILE,

    contract: PUBLIC_CONTRACT,
    receipt: PUBLIC_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,

    ROLE: ROLE,
    PROFILE_CLASS: PROFILE_CLASS,
    CYCLE_POSITION: CYCLE_POSITION,
    UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,

    boot: noOpLifecycle,
    init: noOpLifecycle,
    start: noOpLifecycle,
    refresh: getReceiptLight,
    mount: noOpLifecycle,

    run: run,
    inspect: run,
    probe: run,
    measure: run,

    segregateReceipt: segregateReceipt,
    collapseDuplicateStandards: function (input) {
      return collapseDuplicateStandards(normalizeInput(input === undefined ? defaultInput() : input).object);
    },
    segregateFields: function (input) {
      return segregateFields(normalizeInput(input === undefined ? defaultInput() : input).object);
    },

    getReceipt: getReceipt,
    getReceiptLight: getReceiptLight,
    composeReceipt: composeReceipt,
    composeReceiptLight: composeReceiptLight,
    getReport: getReport,
    getPacket: getPacket,
    getPacketText: getPacketText,
    getCompactSummary: getCompactSummary,
    getCompactManifest: getCompactManifest,
    getCompactManifestText: getCompactManifestText,
    getSegregatedReceiptIndex: getSegregatedReceiptIndex,
    getDuplicateStandardCollapseReport: getDuplicateStandardCollapseReport,
    getRawEvidence: getRawEvidence,
    getLatestRawEvidence: getLatestRawEvidence,
    getState: getState,

    CANONICAL_STANDARDS: clone(CANONICAL_STANDARDS),
    SECTION_DEFINITIONS: clone(SECTION_DEFINITIONS),

    SOUTH_MAY_SEGREGATE_RECEIPTS: true,
    SOUTH_MAY_COLLAPSE_DUPLICATE_STANDARDS: true,
    SOUTH_MAY_PRODUCE_COPYABLE_MANIFEST: true,
    SOUTH_MAY_PRESERVE_RAW_EVIDENCE_BY_REFERENCE: true,
    SOUTH_MAY_NOT_CHANGE_DIAGNOSTIC_FACTS: true,
    SOUTH_MAY_NOT_FINAL_ARBITRATE: true,
    SOUTH_MAY_NOT_AUTHORIZE_REPAIR: true,

    truthAuthorityClaimed: false,
    finalArbitrationClaimed: false,
    repairAuthorizationClaimed: false,
    gaugeVerdictReplacementClaimed: false,
    northGrammarAuthorityClaimed: false,
    westDerivativeMapAuthorityClaimed: false,
    canvasBuildAuthorityClaimed: false,
    canvasProductionRepairAuthorityClaimed: false,
    forcedReceiptReturnClaimed: false,

    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    canvasDrawingAuthorized: false,
    f13Claimed: false,
    f21Claimed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  };

  function publish() {
    var HEARTH = ensureNamespace("HEARTH");
    var DEXTER_LAB = ensureNamespace("DEXTER_LAB");

    state.publishedAt = nowIso();

    ROOT.HEARTH_DIAGNOSTIC_SOUTH = API;
    ROOT.HEARTH_DIAGNOSTIC_RAIL_SOUTH = API;
    ROOT.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATOR = API;
    ROOT.HEARTH_DIAGNOSTIC_SOUTH_DUPLICATE_STANDARD_COLLAPSE = API;

    HEARTH.diagnosticSouth = API;
    HEARTH.diagnosticRailSouth = API;
    HEARTH.diagnosticSouthReceiptSegregator = API;
    HEARTH.diagnosticSouthDuplicateStandardCollapse = API;
    HEARTH.SOUTH_PACKET_OUTPUT_HANDOFF = API;

    DEXTER_LAB.hearthDiagnosticSouth = API;
    DEXTER_LAB.hearthDiagnosticRailSouth = API;
    DEXTER_LAB.hearthDiagnosticSouthReceiptSegregator = API;

    ROOT.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = composeReceiptLight();
    ROOT.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATION_RECEIPT = composeReceiptLight();

    HEARTH.diagnosticSouthReceipt = composeReceiptLight();
    HEARTH.diagnosticSouthReceiptSegregationReceipt = composeReceiptLight();

    DEXTER_LAB.hearthDiagnosticSouthReceipt = composeReceiptLight();

    if (DOCUMENT && DOCUMENT.documentElement && DOCUMENT.documentElement.dataset) {
      try {
        DOCUMENT.documentElement.dataset.hearthDiagnosticSouthContract = PUBLIC_CONTRACT;
        DOCUMENT.documentElement.dataset.hearthDiagnosticSouthInternalRenewalContract =
          INTERNAL_RENEWAL_CONTRACT;
        DOCUMENT.documentElement.dataset.hearthDiagnosticSouthReceiptSegregationActive = "true";
        DOCUMENT.documentElement.dataset.hearthDiagnosticSouthDuplicateStandardCollapseActive = "true";
      } catch (_) {}
    }

    return API;
  }

  publish();
})();
