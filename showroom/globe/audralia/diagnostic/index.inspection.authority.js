// /showroom/globe/audralia/diagnostic/index.inspection.authority.js
(function installAudraliaDiagnosticAuthority(root) {
  "use strict";

  var FILE = "/showroom/globe/audralia/diagnostic/index.inspection.authority.js";
  var CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_CHILD_TNT_v1";
  var VERSION = "1.0.0";
  var OPERATION = "F066 installAuthorityChild";

  var API_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY";
  var STATE_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_STATE";
  var RECEIPT_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_RECEIPT";
  var LOADED_FLAG = "__AUDRALIA_DIAGNOSTIC_AUTHORITY_LOADED__";

  var OBSOLETE_LOADED_FLAG = "AUDRALIA_DIAGNOSTIC_AUTHORITY_LOADED";
  var PROHIBITED_EVIDENCE_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_EVIDENCE";

  var STATE_SCHEMA = "AUDRALIA_DIAGNOSTIC_AUTHORITY_STATE_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_AUTHORITY_RECEIPT_v1";
  var RESULT_SCHEMA = "AUDRALIA_DIAGNOSTIC_AUTHORITY_INSTALL_RESULT_SCHEMA_v1";

  var ENGINE_CONTRACT = "DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2";
  var ENGINE_VERSION = "2.0.0";
  var ENGINE_FILE = "/assets/engine/dgb.engine.subjects.js";
  var ENGINE_RECEIPT_SCHEMA = "DGB_ENGINE_REGISTRY_RECEIPT_v2";
  var ENGINE_AUTHORITY_ID = "DGB_INTERACTIVE_RUNTIME_ENGINE_GOVERNING_CONTRACT";
  var ENGINE_ID = "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE";

  var DIAGNOSTIC_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_CHILD_TNT_v1";
  var DIAGNOSTIC_VERSION = "1.0.0";
  var DIAGNOSTIC_FILE = "/showroom/globe/audralia/diagnostic/index.inspection.registry.js";
  var DIAGNOSTIC_STATE_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_STATE_v1";
  var DIAGNOSTIC_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RECEIPT_v1";

  var RESULT = freezeOwned({
    INSTALLED_WITH_CORRESPONDENCE_HELD: "INSTALLED_WITH_CORRESPONDENCE_HELD",
    MATCHING_INSTALLATION_PRESERVED: "MATCHING_INSTALLATION_PRESERVED",
    HELD_PENDING_SOURCE: "HELD_PENDING_SOURCE",
    HELD_PENDING_CORRESPONDENCE: "HELD_PENDING_CORRESPONDENCE",
    CONFLICTING_INSTALLATION_PRESERVED: "CONFLICTING_INSTALLATION_PRESERVED",
    VERSION_CONFLICT_HELD: "VERSION_CONFLICT_HELD",
    VALIDATION_FAILED: "VALIDATION_FAILED",
    SOURCE_IDENTITY_MISMATCH: "SOURCE_IDENTITY_MISMATCH",
    PUBLICATION_FAILED_ROLLBACK_COMPLETED: "PUBLICATION_FAILED_ROLLBACK_COMPLETED",
    ROLLBACK_PARTIAL: "ROLLBACK_PARTIAL",
    ROLLBACK_FAILED: "ROLLBACK_FAILED",
    NOT_APPLICABLE: "NOT_APPLICABLE"
  });

  var ROLLBACK = freezeOwned({
    NOT_REQUIRED: "NOT_REQUIRED",
    ROLLBACK_COMPLETED: "ROLLBACK_COMPLETED",
    ROLLBACK_PARTIAL: "ROLLBACK_PARTIAL",
    ROLLBACK_FAILED: "ROLLBACK_FAILED",
    ROLLBACK_UNKNOWN: "ROLLBACK_UNKNOWN"
  });

  var PUBLIC_SYMBOLS = [
    API_SYMBOL,
    STATE_SYMBOL,
    RECEIPT_SYMBOL,
    LOADED_FLAG
  ];

  var API_KEYS = [
    "contract", "version", "file", "operation",
    "installAuthorityChild", "getState", "getReceipt", "getStatus"
  ];

  var STATE_KEYS = [
    "schema", "contract", "version", "file", "operation",
    "fileStatus", "installationStatus", "validationStatus",
    "correspondenceStatus", "readinessStatus", "releaseStatus",
    "conflictStatus", "rollbackStatus", "publicationStatus",
    "loaded", "installed", "ready", "released",
    "publicationConfirmed", "matchingInstallationPreserved",
    "conflictingInstallationPreserved", "versionConflict",
    "manualReviewRequired", "holds", "errors", "sourceStatus"
  ];

  var RECEIPT_KEYS = [
    "schema", "contract", "version", "file", "operation",
    "result", "committed", "installationId", "publicSymbols",
    "sourceSummary", "correspondenceSummary", "publicationStatus",
    "publicationConfirmed", "rollbackStatus", "readinessStatus",
    "releaseStatus", "evidenceSummary", "immutability"
  ];

  var RESULT_KEYS = [
    "schema", "contract", "version", "file", "operation",
    "result", "reason", "ok", "installed", "committed",
    "held", "conflict", "ready", "released", "state", "receipt",
    "evidenceSummary", "errors", "rollbackStatus",
    "matchingInstallationPreserved", "conflictingInstallationPreserved",
    "versionConflict", "manualReviewRequired"
  ];

  var ERROR_KEYS = ["code", "message", "phase"];
  var EVIDENCE_KEYS = [
    "localSourcesValid", "localCandidateValid", "existingInstallationStatus",
    "publicationConfirmed", "g3_006Status", "ready", "released",
    "fibonacciClaimed", "newsClaimed", "diagnostic256CoordinateClaimed"
  ];
  var SOURCE_STATUS_KEYS = ["engineSubjectRegistry", "diagnosticRegistry", "g3_006", "externalRelease"];
  var SOURCE_SUMMARY_KEYS = ["engineSubjectRegistry", "diagnosticRegistry"];
  var SOURCE_SUMMARY_CHILD_KEYS = ["status", "contract", "version", "receiptValid"];
  var CORRESPONDENCE_KEYS = ["g3_006Status", "g3_006Valid", "g3_006Reason"];

  var committedApi = null;
  var committedState = null;
  var committedReceipt = null;

  function isObjectLike(value) {
    return value !== null && (typeof value === "object" || typeof value === "function");
  }

  function isPlainObject(value) {
    if (!value || Object.prototype.toString.call(value) !== "[object Object]") return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  function boundedString(value) {
    var text;
    try { text = String(value); } catch (_error) { text = "[unstringifiable]"; }
    return text.length > 240 ? text.slice(0, 240) : text;
  }

  function freezeOwned(value, seen) {
    if (!isObjectLike(value)) return value;
    seen = seen || [];
    if (seen.indexOf(value) !== -1) return value;
    seen.push(value);
    Object.getOwnPropertyNames(value).forEach(function (key) {
      try { freezeOwned(value[key], seen); } catch (_error) {}
    });
    try { Object.freeze(value); } catch (_error2) {}
    return value;
  }

  function readProperty(object, key) {
    try {
      if (!isObjectLike(object)) return { ok: false, present: false, value: undefined, error: null };
      var descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (!descriptor) return { ok: true, present: false, value: undefined, descriptor: null, error: null };
      if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) {
        return { ok: false, present: true, value: undefined, descriptor: descriptor, error: new Error("Accessor not invoked: " + key) };
      }
      return { ok: true, present: true, value: descriptor.value, descriptor: descriptor, error: null };
    } catch (error) {
      return { ok: false, present: false, value: undefined, descriptor: null, error: error };
    }
  }

  function safeCall(object, methodName) {
    var read = readProperty(object, methodName);
    if (!read.ok) return { ok: false, code: "METHOD_READ_FAILED", value: null };
    if (!read.present || typeof read.value !== "function") return { ok: false, code: "METHOD_MISSING", value: null };
    try { return { ok: true, code: null, value: read.value.call(object) }; }
    catch (_error) { return { ok: false, code: "METHOD_THROW", value: null }; }
  }

  function makeError(code, message, phase) {
    var record = {
      code: boundedString(code || "ERROR"),
      message: boundedString(message || "Bounded failure."),
      phase: boundedString(phase || "CANDIDATE_VALIDATION")
    };
    return freezeOwned(record);
  }

  function hasExactOwnKeyOrder(value, keys) {
    if (!isObjectLike(value)) return false;
    var names;
    try { names = Object.getOwnPropertyNames(value); } catch (_error) { return false; }
    if (names.length !== keys.length) return false;
    for (var i = 0; i < keys.length; i += 1) {
      if (names[i] !== keys[i]) return false;
    }
    try {
      if (Object.getOwnPropertySymbols(value).length !== 0) return false;
    } catch (_error2) { return false; }
    return true;
  }

  function hasCanonicalDataDescriptor(object, key, value) {
    var descriptor;
    try { descriptor = Object.getOwnPropertyDescriptor(object, key); } catch (_error) { return false; }
    return Boolean(
      descriptor &&
      Object.prototype.hasOwnProperty.call(descriptor, "value") &&
      descriptor.value === value &&
      descriptor.writable === false &&
      descriptor.enumerable === false &&
      descriptor.configurable === true
    );
  }

  function isDataDescriptor(descriptor) {
    return Boolean(descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value"));
  }

  function isAccessorDescriptor(descriptor) {
    return Boolean(descriptor && !Object.prototype.hasOwnProperty.call(descriptor, "value"));
  }

  function descriptorsEquivalent(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (isDataDescriptor(a) !== isDataDescriptor(b)) return false;
    if (isAccessorDescriptor(a) !== isAccessorDescriptor(b)) return false;
    if (a.enumerable !== b.enumerable || a.configurable !== b.configurable) return false;
    if (isDataDescriptor(a)) return a.value === b.value && a.writable === b.writable;
    return a.get === b.get && a.set === b.set;
  }

  function captureDescriptor(symbol) {
    try {
      return {
        symbol: symbol,
        existed: Object.prototype.hasOwnProperty.call(root, symbol),
        descriptor: Object.getOwnPropertyDescriptor(root, symbol) || null
      };
    } catch (error) {
      return { symbol: symbol, existed: false, descriptor: null, indeterminate: true, error: error };
    }
  }

  function restoreDescriptor(record) {
    try {
      if (record.existed) {
        Object.defineProperty(root, record.symbol, record.descriptor);
      } else {
        delete root[record.symbol];
      }
    } catch (_error) {}

    try {
      var current = Object.getOwnPropertyDescriptor(root, record.symbol) || null;
      if (!record.existed) return !current;
      return descriptorsEquivalent(record.descriptor, current);
    } catch (_error2) {
      return null;
    }
  }

  function publish(symbol, value) {
    Object.defineProperty(root, symbol, {
      value: value,
      enumerable: false,
      writable: false,
      configurable: true
    });
    if (!hasCanonicalDataDescriptor(root, symbol, value)) {
      throw new Error("Publication confirmation failed: " + symbol);
    }
  }

  function scalar(value) {
    if (typeof value === "string") return value;
    if (value === true) return "true";
    if (value === false) return "false";
    if (value === null) return "null";
    if (typeof value === "undefined") return "undefined";
    return String(value);
  }

  function canonicalPublicSymbolsText(symbols) {
    return symbols.join(",");
  }

  function buildInstallationString(core) {
    return "contract=" + scalar(core.contract) +
      "|version=" + scalar(core.version) +
      "|file=" + scalar(core.file) +
      "|operation=" + scalar(core.operation) +
      "|result=" + scalar(core.result) +
      "|committed=" + scalar(core.committed) +
      "|publicSymbols=" + canonicalPublicSymbolsText(core.publicSymbols) +
      "|engine.status=" + scalar(core.engine.status) +
      "|engine.contract=" + scalar(core.engine.contract) +
      "|engine.version=" + scalar(core.engine.version) +
      "|engine.receiptValid=" + scalar(core.engine.receiptValid) +
      "|diagnostic.status=" + scalar(core.diagnostic.status) +
      "|diagnostic.contract=" + scalar(core.diagnostic.contract) +
      "|diagnostic.version=" + scalar(core.diagnostic.version) +
      "|diagnostic.receiptValid=" + scalar(core.diagnostic.receiptValid);
  }

  function fnv1a32LowHigh(text) {
    var hash = 0x811c9dc5;
    for (var i = 0; i < text.length; i += 1) {
      var unit = text.charCodeAt(i);
      hash ^= unit & 0xff;
      hash = Math.imul(hash, 0x01000193) >>> 0;
      hash ^= (unit >>> 8) & 0xff;
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return ("00000000" + hash.toString(16)).slice(-8);
  }

  function buildInstallationId(core) {
    return "AUDRALIA-AUTH-F066-" + fnv1a32LowHigh(buildInstallationString(core));
  }

  function validInstallationId(id, core) {
    return typeof id === "string" &&
      /^AUDRALIA-AUTH-F066-[0-9a-f]{8}$/.test(id) &&
      id === buildInstallationId(core);
  }

  function buildSourceStatus() {
    return freezeOwned({
      engineSubjectRegistry: "PRESENT_VALID",
      diagnosticRegistry: "PRESENT_VALID",
      g3_006: "ABSENT",
      externalRelease: "ABSENT"
    });
  }

  function buildEvidenceSummary(existingStatus, sourcesValid, candidateValid, publicationConfirmed, ready, released) {
    return freezeOwned({
      localSourcesValid: sourcesValid === true,
      localCandidateValid: candidateValid === true,
      existingInstallationStatus: existingStatus || "NONE",
      publicationConfirmed: publicationConfirmed === true,
      g3_006Status: "ABSENT",
      ready: ready === true,
      released: released === true,
      fibonacciClaimed: false,
      newsClaimed: false,
      diagnostic256CoordinateClaimed: false
    });
  }

  function buildSourceSummary() {
    return freezeOwned({
      engineSubjectRegistry: freezeOwned({
        status: "PRESENT_VALID",
        contract: ENGINE_CONTRACT,
        version: ENGINE_VERSION,
        receiptValid: true
      }),
      diagnosticRegistry: freezeOwned({
        status: "PRESENT_VALID",
        contract: DIAGNOSTIC_CONTRACT,
        version: DIAGNOSTIC_VERSION,
        receiptValid: true
      })
    });
  }

  function buildCorrespondenceSummary() {
    return freezeOwned({
      g3_006Status: "ABSENT",
      g3_006Valid: false,
      g3_006Reason: "NO_ADMITTED_G3_006_SOURCE"
    });
  }

  function buildIdentityCore(sourceSummary, publicSymbols) {
    return {
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      result: RESULT.INSTALLED_WITH_CORRESPONDENCE_HELD,
      committed: true,
      publicSymbols: publicSymbols,
      engine: sourceSummary.engineSubjectRegistry,
      diagnostic: sourceSummary.diagnosticRegistry
    };
  }

  function buildState() {
    return freezeOwned({
      schema: STATE_SCHEMA,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      fileStatus: "LOADED",
      installationStatus: "INSTALLED",
      validationStatus: "VALID",
      correspondenceStatus: "ABSENT",
      readinessStatus: "HELD",
      releaseStatus: "NOT_RELEASED",
      conflictStatus: "NONE",
      rollbackStatus: "NOT_REQUIRED",
      publicationStatus: "CONFIRMED",
      loaded: true,
      installed: true,
      ready: false,
      released: false,
      publicationConfirmed: true,
      matchingInstallationPreserved: false,
      conflictingInstallationPreserved: false,
      versionConflict: false,
      manualReviewRequired: false,
      holds: freezeOwned([]),
      errors: freezeOwned([]),
      sourceStatus: buildSourceStatus()
    });
  }

  function buildReceipt() {
    var publicSymbols = freezeOwned(PUBLIC_SYMBOLS.slice());
    var sourceSummary = buildSourceSummary();
    var correspondenceSummary = buildCorrespondenceSummary();
    var evidenceSummary = buildEvidenceSummary("NONE", true, true, true, false, false);
    var core = buildIdentityCore(sourceSummary, publicSymbols);
    var installationId = buildInstallationId(core);

    return freezeOwned({
      schema: RECEIPT_SCHEMA,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      result: RESULT.INSTALLED_WITH_CORRESPONDENCE_HELD,
      committed: true,
      installationId: installationId,
      publicSymbols: publicSymbols,
      sourceSummary: sourceSummary,
      correspondenceSummary: correspondenceSummary,
      publicationStatus: "CONFIRMED",
      publicationConfirmed: true,
      rollbackStatus: "NOT_REQUIRED",
      readinessStatus: "HELD",
      releaseStatus: "NOT_RELEASED",
      evidenceSummary: evidenceSummary,
      immutability: "DEEP_FROZEN"
    });
  }

  function committedTruth() {
    var has = Boolean(committedState && committedReceipt);
    return {
      installed: has && committedState.installed === true,
      committed: has && committedReceipt.committed === true,
      ready: has && committedState.ready === true,
      released: has && committedState.released === true,
      state: has ? committedState : null,
      receipt: has ? committedReceipt : null,
      publicationConfirmed: has && committedState.publicationConfirmed === true
    };
  }

  function resultOk(code) {
    return code === RESULT.INSTALLED_WITH_CORRESPONDENCE_HELD ||
      code === RESULT.MATCHING_INSTALLATION_PRESERVED;
  }

  function buildResult(code, reason, evidenceSummary, errors, rollbackStatus, flags, stateRef, receiptRef) {
    var truth = committedTruth();
    var state = typeof stateRef !== "undefined" ? stateRef : truth.state;
    var receipt = typeof receiptRef !== "undefined" ? receiptRef : truth.receipt;
    var installed = state ? state.installed === true : truth.installed;
    var committed = receipt ? receipt.committed === true : truth.committed;

    var record = {
      schema: RESULT_SCHEMA,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      result: code,
      reason: reason || null,
      ok: resultOk(code),
      installed: installed,
      committed: committed,
      held: Boolean(flags && flags.held),
      conflict: Boolean(flags && flags.conflict),
      ready: state ? state.ready === true : truth.ready,
      released: state ? state.released === true : truth.released,
      state: state || null,
      receipt: receipt || null,
      evidenceSummary: evidenceSummary || buildEvidenceSummary("NONE", false, false, false, false, false),
      errors: freezeOwned((errors || []).slice()),
      rollbackStatus: rollbackStatus || ROLLBACK.NOT_REQUIRED,
      matchingInstallationPreserved: Boolean(flags && flags.matchingInstallationPreserved),
      conflictingInstallationPreserved: Boolean(flags && flags.conflictingInstallationPreserved),
      versionConflict: Boolean(flags && flags.versionConflict),
      manualReviewRequired: Boolean(flags && flags.manualReviewRequired)
    };

    return freezeOwned(record);
  }

  function optionFailure(code, message, reason) {
    return buildResult(
      RESULT.VALIDATION_FAILED,
      reason,
      buildEvidenceSummary("NONE", false, false, false, false, false),
      [makeError(code, message, "CANDIDATE_CONSTRUCTION")],
      ROLLBACK.NOT_REQUIRED,
      { held: true },
      undefined,
      undefined
    );
  }

  function normalizeOptions(options) {
    if (typeof options === "undefined") return { ok: true, reason: null };
    if (!isPlainObject(options)) return { ok: false, result: optionFailure("OPTIONS_INVALID", "Options must be a plain object.", "SOURCE_INVALID") };

    var keys = Object.getOwnPropertyNames(options);
    for (var i = 0; i < keys.length; i += 1) {
      if (keys[i] !== "reason") {
        return { ok: false, result: optionFailure("UNKNOWN_OPTION_KEY", "Unknown option key.", "UNKNOWN_OPTION_KEY") };
      }
    }

    var reason = options.reason;
    if (typeof reason !== "undefined" && reason !== null && typeof reason !== "string") {
      return { ok: false, result: optionFailure("REASON_INVALID", "reason must be string or null.", "SOURCE_INVALID") };
    }

    return { ok: true, reason: typeof reason === "string" ? boundedString(reason) : null };
  }

  function confirmAuthorityState(state) {
    return hasExactOwnKeyOrder(state, STATE_KEYS) &&
      state.schema === STATE_SCHEMA &&
      state.contract === CONTRACT &&
      state.version === VERSION &&
      state.file === FILE &&
      state.operation === OPERATION &&
      state.fileStatus === "LOADED" &&
      state.installationStatus === "INSTALLED" &&
      state.validationStatus === "VALID" &&
      state.correspondenceStatus === "ABSENT" &&
      state.readinessStatus === "HELD" &&
      state.releaseStatus === "NOT_RELEASED" &&
      state.conflictStatus === "NONE" &&
      state.rollbackStatus === "NOT_REQUIRED" &&
      state.publicationStatus === "CONFIRMED" &&
      state.loaded === true &&
      state.installed === true &&
      state.ready === false &&
      state.released === false &&
      state.publicationConfirmed === true &&
      state.matchingInstallationPreserved === false &&
      state.conflictingInstallationPreserved === false &&
      state.versionConflict === false &&
      state.manualReviewRequired === false &&
      Array.isArray(state.holds) &&
      state.holds.length === 0 &&
      Array.isArray(state.errors) &&
      state.errors.length === 0 &&
      hasExactOwnKeyOrder(state.sourceStatus, SOURCE_STATUS_KEYS) &&
      state.sourceStatus.engineSubjectRegistry === "PRESENT_VALID" &&
      state.sourceStatus.diagnosticRegistry === "PRESENT_VALID" &&
      state.sourceStatus.g3_006 === "ABSENT" &&
      state.sourceStatus.externalRelease === "ABSENT" &&
      Object.isFrozen(state) &&
      Object.isFrozen(state.holds) &&
      Object.isFrozen(state.errors) &&
      Object.isFrozen(state.sourceStatus);
  }

  function confirmSourceSummaryChild(value, contract, version) {
    return hasExactOwnKeyOrder(value, SOURCE_SUMMARY_CHILD_KEYS) &&
      value.status === "PRESENT_VALID" &&
      value.contract === contract &&
      value.version === version &&
      value.receiptValid === true &&
      Object.isFrozen(value);
  }

  function confirmEvidenceSummary(value, expectedStatus) {
    return hasExactOwnKeyOrder(value, EVIDENCE_KEYS) &&
      value.localSourcesValid === true &&
      value.localCandidateValid === true &&
      value.existingInstallationStatus === expectedStatus &&
      value.publicationConfirmed === true &&
      value.g3_006Status === "ABSENT" &&
      value.ready === false &&
      value.released === false &&
      value.fibonacciClaimed === false &&
      value.newsClaimed === false &&
      value.diagnostic256CoordinateClaimed === false &&
      Object.isFrozen(value);
  }

  function confirmAuthorityReceipt(receipt) {
    if (!hasExactOwnKeyOrder(receipt, RECEIPT_KEYS)) return false;
    if (Object.prototype.hasOwnProperty.call(receipt, "loaded")) return false;
    if (receipt.schema !== RECEIPT_SCHEMA || receipt.contract !== CONTRACT || receipt.version !== VERSION || receipt.file !== FILE || receipt.operation !== OPERATION) return false;
    if (receipt.result !== RESULT.INSTALLED_WITH_CORRESPONDENCE_HELD || receipt.committed !== true) return false;
    if (!Array.isArray(receipt.publicSymbols) || receipt.publicSymbols.length !== 4) return false;
    for (var i = 0; i < PUBLIC_SYMBOLS.length; i += 1) {
      if (receipt.publicSymbols[i] !== PUBLIC_SYMBOLS[i]) return false;
    }
    if (!hasExactOwnKeyOrder(receipt.sourceSummary, SOURCE_SUMMARY_KEYS)) return false;
    if (!confirmSourceSummaryChild(receipt.sourceSummary.engineSubjectRegistry, ENGINE_CONTRACT, ENGINE_VERSION)) return false;
    if (!confirmSourceSummaryChild(receipt.sourceSummary.diagnosticRegistry, DIAGNOSTIC_CONTRACT, DIAGNOSTIC_VERSION)) return false;
    if (!hasExactOwnKeyOrder(receipt.correspondenceSummary, CORRESPONDENCE_KEYS)) return false;
    if (receipt.correspondenceSummary.g3_006Status !== "ABSENT" || receipt.correspondenceSummary.g3_006Valid !== false || receipt.correspondenceSummary.g3_006Reason !== "NO_ADMITTED_G3_006_SOURCE") return false;
    if (receipt.publicationStatus !== "CONFIRMED" || receipt.publicationConfirmed !== true || receipt.rollbackStatus !== "NOT_REQUIRED") return false;
    if (receipt.readinessStatus !== "HELD" || receipt.releaseStatus !== "NOT_RELEASED" || receipt.immutability !== "DEEP_FROZEN") return false;
    if (!confirmEvidenceSummary(receipt.evidenceSummary, "NONE")) return false;

    var core = buildIdentityCore(receipt.sourceSummary, receipt.publicSymbols);
    if (!validInstallationId(receipt.installationId, core)) return false;
    if (receipt.installationId !== "AUDRALIA-AUTH-F066-16f1564a") return false;

    return Object.isFrozen(receipt) &&
      Object.isFrozen(receipt.publicSymbols) &&
      Object.isFrozen(receipt.sourceSummary) &&
      Object.isFrozen(receipt.correspondenceSummary) &&
      Object.isFrozen(receipt.evidenceSummary);
  }

  function buildStatusProjection() {
    var loaded = Boolean(root[LOADED_FLAG] === true && committedState && committedState.loaded === true);
    var result = committedReceipt ? committedReceipt.result : null;
    return freezeOwned({
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      installationStatus: committedState ? committedState.installationStatus : null,
      validationStatus: committedState ? committedState.validationStatus : null,
      correspondenceStatus: committedState ? committedState.correspondenceStatus : null,
      readinessStatus: committedState ? committedState.readinessStatus : null,
      releaseStatus: committedState ? committedState.releaseStatus : null,
      rollbackStatus: committedState ? committedState.rollbackStatus : null,
      loaded: loaded,
      installed: committedState ? committedState.installed === true : false,
      ready: committedState ? committedState.ready === true : false,
      released: committedState ? committedState.released === true : false,
      publicationConfirmed: committedState ? committedState.publicationConfirmed === true : false,
      result: result
    });
  }

  function buildApi() {
    var api = {};
    Object.defineProperties(api, {
      contract: { value: CONTRACT, enumerable: true, writable: false, configurable: false },
      version: { value: VERSION, enumerable: true, writable: false, configurable: false },
      file: { value: FILE, enumerable: true, writable: false, configurable: false },
      operation: { value: OPERATION, enumerable: true, writable: false, configurable: false },
      installAuthorityChild: { value: installAuthorityChild, enumerable: true, writable: false, configurable: false },
      getState: { value: function getState() { return committedState; }, enumerable: true, writable: false, configurable: false },
      getReceipt: { value: function getReceipt() { return committedReceipt; }, enumerable: true, writable: false, configurable: false },
      getStatus: { value: buildStatusProjection, enumerable: true, writable: false, configurable: false }
    });
    return freezeOwned(api);
  }

  function confirmApi(api, state, receipt) {
    if (!hasExactOwnKeyOrder(api, API_KEYS) || !Object.isFrozen(api)) return false;
    if (api.contract !== CONTRACT || api.version !== VERSION || api.file !== FILE || api.operation !== OPERATION) return false;
    if (typeof api.installAuthorityChild !== "function" || typeof api.getState !== "function" || typeof api.getReceipt !== "function" || typeof api.getStatus !== "function") return false;
    if (api.getState() !== state || api.getReceipt() !== receipt) return false;
    var status;
    try { status = api.getStatus(); } catch (_error) { return false; }
    return Boolean(
      status &&
      status.contract === CONTRACT &&
      status.version === VERSION &&
      status.file === FILE &&
      status.operation === OPERATION &&
      status.installationStatus === "INSTALLED" &&
      status.validationStatus === "VALID" &&
      status.correspondenceStatus === "ABSENT" &&
      status.readinessStatus === "HELD" &&
      status.releaseStatus === "NOT_RELEASED" &&
      status.rollbackStatus === "NOT_REQUIRED" &&
      status.loaded === true &&
      status.installed === true &&
      status.ready === false &&
      status.released === false &&
      status.publicationConfirmed === true &&
      status.result === RESULT.INSTALLED_WITH_CORRESPONDENCE_HELD &&
      Object.isFrozen(status)
    );
  }

  function prohibitedStatus() {
    var obsolete = readProperty(root, OBSOLETE_LOADED_FLAG);
    var evidence = readProperty(root, PROHIBITED_EVIDENCE_SYMBOL);
    var namespace = readProperty(root, "AUDRALIA");
    var namespaceClaim = false;

    if (namespace.ok && namespace.present && isObjectLike(namespace.value)) {
      var read = readProperty(namespace.value, "diagnosticAuthority");
      namespaceClaim = Boolean(read.present);
    }

    return {
      obsoletePresent: obsolete.present === true,
      evidencePresent: evidence.present === true,
      namespaceClaim: namespaceClaim
    };
  }

  function safeReadIdentity(record) {
    return {
      contract: readProperty(record, "contract"),
      version: readProperty(record, "version"),
      file: readProperty(record, "file"),
      operation: readProperty(record, "operation")
    };
  }

  function readableIdentity(identity) {
    return identity.contract.ok && identity.version.ok && identity.file.ok && identity.operation.ok;
  }

  function identityValues(identity) {
    return {
      contract: identity.contract.present ? identity.contract.value : null,
      version: identity.version.present ? identity.version.value : null,
      file: identity.file.present ? identity.file.value : null,
      operation: identity.operation.present ? identity.operation.value : null
    };
  }

  function inspectExistingInstallation() {
    var apiDescriptor = Object.getOwnPropertyDescriptor(root, API_SYMBOL) || null;
    var stateDescriptor = Object.getOwnPropertyDescriptor(root, STATE_SYMBOL) || null;
    var receiptDescriptor = Object.getOwnPropertyDescriptor(root, RECEIPT_SYMBOL) || null;
    var loadedDescriptor = Object.getOwnPropertyDescriptor(root, LOADED_FLAG) || null;
    var prohibited = prohibitedStatus();

    var presentCount = [apiDescriptor, stateDescriptor, receiptDescriptor, loadedDescriptor].filter(Boolean).length;

    if (presentCount === 0) {
      return prohibited.obsoletePresent || prohibited.evidencePresent || prohibited.namespaceClaim
        ? { classification: "PARTIAL_OR_CORRUPT", state: null, receipt: null }
        : { classification: "ABSENT", state: null, receipt: null };
    }

    if (!apiDescriptor || !stateDescriptor || !receiptDescriptor || !loadedDescriptor) {
      return { classification: "PARTIAL_OR_CORRUPT", state: null, receipt: null };
    }

    if (!isDataDescriptor(apiDescriptor) || !isDataDescriptor(stateDescriptor) || !isDataDescriptor(receiptDescriptor) || !isDataDescriptor(loadedDescriptor)) {
      return { classification: "PARTIAL_OR_CORRUPT", state: null, receipt: null };
    }

    var api = apiDescriptor.value;
    var state = stateDescriptor.value;
    var receipt = receiptDescriptor.value;

    var apiId = safeReadIdentity(api);
    var stateId = safeReadIdentity(state);
    var receiptId = safeReadIdentity(receipt);

    if (!readableIdentity(apiId) || !readableIdentity(stateId) || !readableIdentity(receiptId)) {
      return { classification: "PARTIAL_OR_CORRUPT", state: state, receipt: receipt };
    }

    var ids = [identityValues(apiId), identityValues(stateId), identityValues(receiptId)];
    var fields = ["contract", "file", "operation"];

    for (var i = 0; i < fields.length; i += 1) {
      if (ids[0][fields[i]] !== ids[1][fields[i]] || ids[0][fields[i]] !== ids[2][fields[i]]) {
        return { classification: "CONFLICTING", state: state, receipt: receipt };
      }
    }

    var sameLineage = ids[0].contract === CONTRACT && ids[0].file === FILE && ids[0].operation === OPERATION;

    if (!sameLineage) {
      return { classification: "CONFLICTING", state: state, receipt: receipt };
    }

    if (ids[0].version !== ids[1].version || ids[0].version !== ids[2].version) {
      return { classification: "CONFLICTING", state: state, receipt: receipt };
    }

    if (ids[0].version !== VERSION) {
      return { classification: "VERSION_CONFLICT", state: state, receipt: receipt };
    }

    if (prohibited.obsoletePresent || prohibited.evidencePresent || prohibited.namespaceClaim) {
      return { classification: "PARTIAL_OR_CORRUPT", state: state, receipt: receipt };
    }

    if (exactMatchingProof(api, state, receipt, apiDescriptor, stateDescriptor, receiptDescriptor, loadedDescriptor)) {
      committedApi = api;
      committedState = state;
      committedReceipt = receipt;
      return { classification: "MATCHING", state: state, receipt: receipt };
    }

    return { classification: "PARTIAL_OR_CORRUPT", state: state, receipt: receipt };
  }

  function exactMatchingProof(api, state, receipt, apiD, stateD, receiptD, loadedD) {
    if (!apiD || !stateD || !receiptD || !loadedD) return false;
    if (!isDataDescriptor(apiD) || !isDataDescriptor(stateD) || !isDataDescriptor(receiptD) || !isDataDescriptor(loadedD)) return false;
    if (apiD.value !== api || stateD.value !== state || receiptD.value !== receipt || loadedD.value !== true) return false;
    if (apiD.writable || stateD.writable || receiptD.writable || loadedD.writable) return false;
    if (apiD.enumerable || stateD.enumerable || receiptD.enumerable || loadedD.enumerable) return false;
    if (!apiD.configurable || !stateD.configurable || !receiptD.configurable || !loadedD.configurable) return false;

    var priorApi = committedApi;
    var priorState = committedState;
    var priorReceipt = committedReceipt;
    committedApi = api;
    committedState = state;
    committedReceipt = receipt;

    var passed = confirmApi(api, state, receipt) &&
      confirmAuthorityState(state) &&
      confirmAuthorityReceipt(receipt);

    committedApi = priorApi;
    committedState = priorState;
    committedReceipt = priorReceipt;

    return passed;
  }

  function validateEngineRegistry() {
    var primary = readProperty(root, "DGB_ENGINE_SUBJECT_REGISTRY");
    var alias = readProperty(root, "DGBEngineSubjectRegistry");
    if ((!primary.present || !primary.ok) && (!alias.present || !alias.ok)) {
      return { ok: false, code: RESULT.HELD_PENDING_SOURCE, phase: "SOURCE_READ", message: "Engine subject registry unavailable." };
    }

    if (primary.present && alias.present && primary.value !== alias.value) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Engine registry aliases conflict." };
    }

    var api = primary.present ? primary.value : alias.value;
    if (!isObjectLike(api)) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Engine registry is not object-like." };
    }

    if (api.CONTRACT !== ENGINE_CONTRACT || api.VERSION !== ENGINE_VERSION || api.FILE !== ENGINE_FILE || api.RECEIPT_SCHEMA !== ENGINE_RECEIPT_SCHEMA) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Engine registry identity mismatch." };
    }

    var receiptCall = safeCall(api, "getRegistryReceipt");
    if (!receiptCall.ok || !isObjectLike(receiptCall.value)) {
      return { ok: false, code: RESULT.HELD_PENDING_SOURCE, phase: "SOURCE_READ", message: "Engine registry receipt unavailable." };
    }

    if (receiptCall.value.contract !== ENGINE_CONTRACT || receiptCall.value.version !== ENGINE_VERSION || receiptCall.value.file !== ENGINE_FILE) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Engine registry receipt identity mismatch." };
    }

    var authority = typeof api.getAuthority === "function" ? api.getAuthority(ENGINE_AUTHORITY_ID) : null;
    var engine = typeof api.getEngine === "function" ? api.getEngine(ENGINE_ID) : null;

    if (!isObjectLike(authority) || !isObjectLike(engine)) {
      return { ok: false, code: RESULT.VALIDATION_FAILED, phase: "SOURCE_VALIDATION", message: "Required engine authority or engine record missing." };
    }

    return { ok: true, api: api, receipt: receiptCall.value };
  }

  var DIAG_STATE_SCALARS = [
    "schema", "contract", "version", "file", "authority", "initialized", "sequence",
    "diagnosticSourceStatus", "diagnosticSourceReason",
    "upstreamStatusCopiedAsEvidence", "sourceBoundariesObserved", "sourceBoundariesPreserved",
    "systemReadinessEvaluated", "systemReadinessClaimed", "upstreamMutationPerformed",
    "observerAttached", "observationRequested", "runtimeExecutionPerformed",
    "backgroundActivityInstalled", "f21Claimed", "projectionHash", "createdAt"
  ];

  var DIAG_PROJECTION_NUMBERS = [
    "authorityRecordCount", "engineRecordCount", "assignedEngineRecordCount",
    "selectableEngineRecordCount", "reservedSlotRecordCount",
    "unclassifiedEngineRecordCount", "relationshipCount",
    "conflictCount", "holdCount", "absenceCount", "errorCount"
  ];

  var DIAG_STATE_ARRAYS = [
    "authorityRecords", "engineRecords", "assignedEngineRecords", "selectableEngineRecords",
    "reservedSlotRecords", "unclassifiedEngineRecords", "relationships",
    "conflicts", "holds", "absence", "errors",
    "upstreamStatusProvenance", "boundaryCorrespondence"
  ];

  var DIAG_RECEIPT_SCALARS = [
    "schema", "contract", "version", "file", "authority", "sequence",
    "diagnosticSourceStatus", "diagnosticSourceReason", "sourceAlias",
    "primarySourceObserved", "compatibilitySourceObserved",
    "sourceReferenceCorrespondence", "sourceReferenceConflict",
    "expectedSourceContract", "observedSourceContract", "sourceContractCorrespondence",
    "expectedSourceVersion", "observedSourceVersion", "sourceVersionCorrespondence",
    "expectedSourceFile", "observedSourceFile", "sourceFileCorrespondence",
    "expectedRegistrySchema", "observedRegistrySchema", "registrySchemaCorrespondence",
    "sourceReceiptPresent", "sourceReceiptSchema", "sourceReceiptSchemaCorrespondence",
    "sourceRegistryHash", "authorityRecordCount", "engineRecordCount",
    "assignedEngineRecordCount", "selectableEngineRecordCount", "reservedSlotRecordCount",
    "unclassifiedEngineRecordCount", "relationshipCount", "declaredSlotCount",
    "projectedSlotCount", "countCorrespondence", "relationshipCorrespondence",
    "sourceBoundariesObserved", "sourceBoundariesPreserved", "upstreamStatusCopiedAsEvidence",
    "diagnosticStatusDerivedSeparately", "systemReadinessEvaluated", "systemReadinessClaimed",
    "upstreamMutationPerformed", "observerAttached", "observationRequested",
    "runtimeExecutionPerformed", "backgroundActivityInstalled", "f21Claimed",
    "conflictCount", "holdCount", "absenceCount", "errorCount", "projectionHash", "createdAt"
  ];

  function fieldsStrictlyCorrespond(a, b, fields) {
    for (var i = 0; i < fields.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(a, fields[i]) || !Object.prototype.hasOwnProperty.call(b, fields[i])) return false;
      if (a[fields[i]] !== b[fields[i]]) return false;
    }
    return true;
  }

  function validateDiagnosticRegistry() {
    var apiRead = readProperty(root, "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY");
    var stateRead = readProperty(root, "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_STATE");
    var receiptRead = readProperty(root, "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RECEIPT");

    if (!apiRead.ok || !stateRead.ok || !receiptRead.ok || !apiRead.present || !stateRead.present || !receiptRead.present) {
      return { ok: false, code: RESULT.HELD_PENDING_SOURCE, phase: "SOURCE_READ", message: "Diagnostic registry surface absent or unreadable." };
    }

    var api = apiRead.value;
    var state = stateRead.value;
    var receipt = receiptRead.value;

    if (!isObjectLike(api) || !isObjectLike(state) || !isObjectLike(receipt)) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Diagnostic registry surface is not object-like." };
    }

    if (api.contract !== DIAGNOSTIC_CONTRACT || api.version !== DIAGNOSTIC_VERSION || api.file !== DIAGNOSTIC_FILE) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Diagnostic registry API identity mismatch." };
    }

    if (state.schema !== DIAGNOSTIC_STATE_SCHEMA || state.contract !== DIAGNOSTIC_CONTRACT || state.version !== DIAGNOSTIC_VERSION || state.file !== DIAGNOSTIC_FILE) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Diagnostic registry state identity mismatch." };
    }

    if (receipt.schema !== DIAGNOSTIC_RECEIPT_SCHEMA || receipt.contract !== DIAGNOSTIC_CONTRACT || receipt.version !== DIAGNOSTIC_VERSION || receipt.file !== DIAGNOSTIC_FILE) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Diagnostic registry receipt identity mismatch." };
    }

    if (typeof api.getState !== "function" || typeof api.getReceipt !== "function") {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "SOURCE_VALIDATION", message: "Diagnostic getter missing." };
    }

    var getterState;
    var getterReceipt;
    try {
      getterState = api.getState();
      getterReceipt = api.getReceipt();
    } catch (_error) {
      return { ok: false, code: RESULT.HELD_PENDING_SOURCE, phase: "SOURCE_READ", message: "Diagnostic getter threw." };
    }

    if (!isObjectLike(getterState) || !isObjectLike(getterReceipt)) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "CLONE_CORRESPONDENCE", message: "Diagnostic getter clone invalid." };
    }

    if (!Object.isFrozen(getterState) || !Object.isFrozen(getterReceipt)) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "CLONE_CORRESPONDENCE", message: "Diagnostic getter clone not frozen." };
    }

    if (!fieldsStrictlyCorrespond(state, getterState, DIAG_STATE_SCALARS)) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "CLONE_CORRESPONDENCE", message: "Diagnostic state clone mismatch." };
    }

    if (!isObjectLike(state.projectionSummary) || !isObjectLike(getterState.projectionSummary)) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "CLONE_CORRESPONDENCE", message: "Diagnostic projection summary invalid." };
    }

    for (var i = 0; i < DIAG_PROJECTION_NUMBERS.length; i += 1) {
      var key = DIAG_PROJECTION_NUMBERS[i];
      if (typeof state.projectionSummary[key] !== "number" || typeof getterState.projectionSummary[key] !== "number" || state.projectionSummary[key] !== getterState.projectionSummary[key]) {
        return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "CLONE_CORRESPONDENCE", message: "Diagnostic projection number mismatch." };
      }
    }

    for (i = 0; i < DIAG_STATE_ARRAYS.length; i += 1) {
      key = DIAG_STATE_ARRAYS[i];
      if (!Array.isArray(state[key]) || !Array.isArray(getterState[key]) || state[key].length !== getterState[key].length) {
        return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "CLONE_CORRESPONDENCE", message: "Diagnostic state array mismatch." };
      }
    }

    if (!fieldsStrictlyCorrespond(receipt, getterReceipt, DIAG_RECEIPT_SCALARS)) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "CLONE_CORRESPONDENCE", message: "Diagnostic receipt clone mismatch." };
    }

    if (receipt.errorCount === 0 && (receipt.lastError !== null || getterReceipt.lastError !== null)) {
      return { ok: false, code: RESULT.SOURCE_IDENTITY_MISMATCH, phase: "CLONE_CORRESPONDENCE", message: "Diagnostic lastError mismatch." };
    }

    var clean = state.initialized === true &&
      state.diagnosticSourceStatus === "AVAILABLE" &&
      receipt.diagnosticSourceStatus === "AVAILABLE" &&
      state.diagnosticSourceStatus === receipt.diagnosticSourceStatus &&
      state.diagnosticSourceReason === receipt.diagnosticSourceReason &&
      receipt.sourceReferenceConflict === false &&
      receipt.sourceContractCorrespondence === true &&
      receipt.sourceVersionCorrespondence === true &&
      receipt.sourceFileCorrespondence === true &&
      receipt.registrySchemaCorrespondence === true &&
      receipt.sourceReceiptPresent === true &&
      receipt.sourceReceiptSchemaCorrespondence === true &&
      receipt.countCorrespondence === true &&
      receipt.relationshipCorrespondence === true &&
      receipt.sourceBoundariesObserved === true &&
      receipt.sourceBoundariesPreserved === true &&
      receipt.systemReadinessEvaluated === false &&
      receipt.systemReadinessClaimed === false &&
      receipt.upstreamMutationPerformed === false &&
      receipt.observerAttached === false &&
      receipt.observationRequested === false &&
      receipt.runtimeExecutionPerformed === false &&
      receipt.backgroundActivityInstalled === false &&
      receipt.f21Claimed === false &&
      receipt.conflictCount === 0 &&
      receipt.holdCount === 0 &&
      receipt.absenceCount === 0 &&
      receipt.errorCount === 0 &&
      state.projectionSummary.conflictCount === 0 &&
      state.projectionSummary.holdCount === 0 &&
      state.projectionSummary.absenceCount === 0 &&
      state.projectionSummary.errorCount === 0 &&
      state.conflicts.length === 0 &&
      state.holds.length === 0 &&
      state.absence.length === 0 &&
      state.errors.length === 0;

    if (!clean) {
      return { ok: false, code: RESULT.VALIDATION_FAILED, phase: "SOURCE_VALIDATION", message: "Diagnostic registry is not semantically available." };
    }

    return { ok: true, api: api, state: state, receipt: receipt };
  }

  function validateCandidate(api, state, receipt) {
    if (!confirmAuthorityState(state)) return false;
    if (!confirmAuthorityReceipt(receipt)) return false;
    var priorApi = committedApi;
    var priorState = committedState;
    var priorReceipt = committedReceipt;
    committedApi = api;
    committedState = state;
    committedReceipt = receipt;
    var ok = confirmApi(api, state, receipt);
    committedApi = priorApi;
    committedState = priorState;
    committedReceipt = priorReceipt;
    return ok;
  }

  function rollback(snapshot) {
    var order = [snapshot.loaded, snapshot.receipt, snapshot.state, snapshot.api];
    var verified = 0;
    var failed = 0;
    var unknown = 0;

    for (var i = 0; i < order.length; i += 1) {
      var result = restoreDescriptor(order[i]);
      if (result === true) verified += 1;
      else if (result === false) failed += 1;
      else unknown += 1;
    }

    committedApi = snapshot.committedApi;
    committedState = snapshot.committedState;
    committedReceipt = snapshot.committedReceipt;

    var internals = committedApi === snapshot.committedApi &&
      committedState === snapshot.committedState &&
      committedReceipt === snapshot.committedReceipt;

    if (!internals) unknown += 1;

    if (unknown > 0) return ROLLBACK.ROLLBACK_UNKNOWN;
    if (verified === 4 && failed === 0) return ROLLBACK.ROLLBACK_COMPLETED;
    if (verified > 0 && failed > 0) return ROLLBACK.ROLLBACK_PARTIAL;
    return ROLLBACK.ROLLBACK_FAILED;
  }

  function rollbackCode(status) {
    if (status === ROLLBACK.ROLLBACK_COMPLETED) return RESULT.PUBLICATION_FAILED_ROLLBACK_COMPLETED;
    if (status === ROLLBACK.ROLLBACK_PARTIAL) return RESULT.ROLLBACK_PARTIAL;
    return RESULT.ROLLBACK_FAILED;
  }

  function performPublication(api, state, receipt) {
    var snapshot = {
      api: captureDescriptor(API_SYMBOL),
      state: captureDescriptor(STATE_SYMBOL),
      receipt: captureDescriptor(RECEIPT_SYMBOL),
      loaded: captureDescriptor(LOADED_FLAG),
      committedApi: committedApi,
      committedState: committedState,
      committedReceipt: committedReceipt
    };

    try {
      publish(API_SYMBOL, api);
      publish(STATE_SYMBOL, state);
      publish(RECEIPT_SYMBOL, receipt);
      publish(LOADED_FLAG, true);

      committedApi = api;
      committedState = state;
      committedReceipt = receipt;

      if (!confirmPublication(api, state, receipt)) {
        throw new Error("Final publication confirmation failed.");
      }

      return buildResult(
        RESULT.INSTALLED_WITH_CORRESPONDENCE_HELD,
        "NO_ADMITTED_G3_006_SOURCE",
        buildEvidenceSummary("ABSENT", true, true, true, false, false),
        [],
        ROLLBACK.NOT_REQUIRED,
        { held: true },
        state,
        receipt
      );
    } catch (error) {
      var rb = rollback(snapshot);
      var code = rollbackCode(rb);
      var reason = rb === ROLLBACK.ROLLBACK_UNKNOWN ? "ROLLBACK_VERIFICATION_INDETERMINATE" : "PUBLICATION_FAILED";
      return buildResult(
        code,
        reason,
        buildEvidenceSummary("ABSENT", true, false, false, false, false),
        [makeError("PUBLICATION_FAILED", boundedString(error && error.message), "PUBLICATION_CONFIRMATION")],
        rb,
        { held: true, manualReviewRequired: rb !== ROLLBACK.ROLLBACK_COMPLETED },
        undefined,
        undefined
      );
    }
  }

  function confirmPublication(api, state, receipt) {
    return hasCanonicalDataDescriptor(root, API_SYMBOL, api) &&
      hasCanonicalDataDescriptor(root, STATE_SYMBOL, state) &&
      hasCanonicalDataDescriptor(root, RECEIPT_SYMBOL, receipt) &&
      hasCanonicalDataDescriptor(root, LOADED_FLAG, true) &&
      !Object.prototype.hasOwnProperty.call(root, OBSOLETE_LOADED_FLAG) &&
      !Object.prototype.hasOwnProperty.call(root, PROHIBITED_EVIDENCE_SYMBOL) &&
      confirmApi(api, state, receipt) &&
      confirmAuthorityState(state) &&
      confirmAuthorityReceipt(receipt);
  }

  function classifyResult(classification, state, receipt) {
    if (classification === "MATCHING") {
      return buildResult(
        RESULT.MATCHING_INSTALLATION_PRESERVED,
        null,
        buildEvidenceSummary("MATCHING", false, true, true, state && state.ready === true, state && state.released === true),
        [],
        state && state.rollbackStatus ? state.rollbackStatus : ROLLBACK.NOT_REQUIRED,
        { matchingInstallationPreserved: true, held: state ? state.readinessStatus === "HELD" : false },
        state,
        receipt
      );
    }

    if (classification === "CONFLICTING") {
      return buildResult(
        RESULT.CONFLICTING_INSTALLATION_PRESERVED,
        "INSTALLATION_CONFLICT",
        buildEvidenceSummary("CONFLICTING", false, false, false, false, false),
        [],
        ROLLBACK.NOT_REQUIRED,
        { conflict: true, conflictingInstallationPreserved: true },
        state || undefined,
        receipt || undefined
      );
    }

    if (classification === "VERSION_CONFLICT") {
      return buildResult(
        RESULT.VERSION_CONFLICT_HELD,
        "VERSION_CONFLICT",
        buildEvidenceSummary("VERSION_CONFLICT", false, false, false, false, false),
        [],
        ROLLBACK.NOT_REQUIRED,
        { conflict: true, held: true, versionConflict: true },
        state || undefined,
        receipt || undefined
      );
    }

    if (classification === "PARTIAL_OR_CORRUPT") {
      return buildResult(
        RESULT.VALIDATION_FAILED,
        "SOURCE_INVALID",
        buildEvidenceSummary("PARTIAL_OR_CORRUPT", false, false, false, false, false),
        [makeError("PARTIAL_OR_CORRUPT_INSTALLATION", "Existing authority installation is partial or corrupt.", "EXISTING_INSTALLATION")],
        ROLLBACK.NOT_REQUIRED,
        { held: true },
        state || undefined,
        receipt || undefined
      );
    }

    return null;
  }

  function installAuthorityChild(options) {
    try {
      var normalized = normalizeOptions(options);
      if (!normalized.ok) return normalized.result;

      var existing = inspectExistingInstallation();
      if (existing.classification !== "ABSENT") {
        return classifyResult(existing.classification, existing.state, existing.receipt);
      }

      var engine = validateEngineRegistry();
      if (!engine.ok) {
        return buildResult(engine.code, engine.code === RESULT.HELD_PENDING_SOURCE ? null : "SOURCE_INVALID", buildEvidenceSummary("ABSENT", false, false, false, false, false), [makeError(engine.code, engine.message, engine.phase)], ROLLBACK.NOT_REQUIRED, { held: engine.code === RESULT.HELD_PENDING_SOURCE }, undefined, undefined);
      }

      var diagnostic = validateDiagnosticRegistry();
      if (!diagnostic.ok) {
        return buildResult(diagnostic.code, diagnostic.code === RESULT.HELD_PENDING_SOURCE ? null : "SOURCE_INVALID", buildEvidenceSummary("ABSENT", false, false, false, false, false), [makeError(diagnostic.code, diagnostic.message, diagnostic.phase)], ROLLBACK.NOT_REQUIRED, { held: diagnostic.code === RESULT.HELD_PENDING_SOURCE }, undefined, undefined);
      }

      var state = buildState();
      var receipt = buildReceipt();
      var api = buildApi();

      if (!validateCandidate(api, state, receipt)) {
        return buildResult(
          RESULT.VALIDATION_FAILED,
          "SOURCE_INVALID",
          buildEvidenceSummary("ABSENT", true, false, false, false, false),
          [makeError("CANDIDATE_INVALID", "Authority candidate failed validation.", "CANDIDATE_VALIDATION")],
          ROLLBACK.NOT_REQUIRED,
          { held: true },
          undefined,
          undefined
        );
      }

      return performPublication(api, state, receipt);
    } catch (error) {
      return buildResult(
        RESULT.VALIDATION_FAILED,
        "SOURCE_INVALID",
        buildEvidenceSummary("NONE", false, false, false, false, false),
        [makeError("GUARDED_FAILURE", boundedString(error && error.message), "CANDIDATE_VALIDATION")],
        ROLLBACK.NOT_REQUIRED,
        { held: true },
        undefined,
        undefined
      );
    }
  }

  try {
    installAuthorityChild({ reason: "INITIAL_FILE_LOAD" });
  } catch (_quietLoadError) {
    committedApi = committedApi || null;
    committedState = committedState || null;
    committedReceipt = committedReceipt || null;
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : typeof self !== "undefined"
        ? self
        : this
);
