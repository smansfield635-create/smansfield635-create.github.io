// /assets/engine/dgb.engine.contract.js
// DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// Full-file replacement.

(function installDGBEngineContract(global) {
  "use strict";

  var root =
    global ||
    (typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
        ? globalThis
        : this);

  var CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  var HYBRID_AUTHORITY =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_HYBRID_AUTHORITY_TNT_v1";

  var FILE = "/assets/engine/dgb.engine.contract.js";
  var VERSION = "1.0.0";

  var MODEL_SCHEMA = "DGB_MODEL_PACKAGE_v1";
  var SPEC_SCHEMA = "DGB_ENGINE_SPEC_v1";
  var OPS_SCHEMA = "DGB_ENGINE_OPS_v1";
  var COMPARISON_SCHEMA = "DGB_SPEC_OPS_COMPARISON_v1";
  var RECEIPT_SCHEMA = "DGB_ENGINE_RECEIPT_v1";
  var AUTHORITY_RECEIPT_SCHEMA =
    "DGB_ENGINE_AUTHORITY_RECEIPT_v1";
  var VALIDATION_SCHEMA =
    "DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_v1";

  function freeze(value) {
    if (!value || typeof value !== "object") return value;
    Object.keys(value).forEach(function each(key) {
      freeze(value[key]);
    });
    try {
      Object.freeze(value);
    } catch (_error) {}
    return value;
  }

  function makeEnum(values) {
    var output = Object.create(null);
    values.forEach(function each(value) {
      output[value] = value;
    });
    return freeze(output);
  }

  var ENUM = freeze({
    SOURCE_STATUS: makeEnum([
      "CURRENT",
      "LEGACY",
      "SUPERSEDED",
      "CONFLICTING",
      "UNKNOWN"
    ]),
    ALIGNMENT_STATUS: makeEnum([
      "ALIGNED",
      "PARTIAL",
      "CONFLICT",
      "HOLD",
      "UNKNOWN"
    ]),
    AUTHORITY_CLASS: makeEnum([
      "CANONICAL",
      "GOVERNING",
      "SUPPORTING",
      "REFERENCE",
      "LEGACY",
      "UNKNOWN"
    ]),
    DISPOSITION: makeEnum([
      "PRESERVE",
      "RENEW",
      "EXTRACT",
      "RETIRE",
      "HOLD"
    ]),
    STATE: makeEnum([
      "DECLARED",
      "LOADED",
      "VALIDATED",
      "CREATED",
      "MOUNTED",
      "INITIALIZED",
      "UPLOADED",
      "SUBMITTED",
      "PRESENTED",
      "VISIBLE",
      "INTERACTIVE",
      "VERIFIED",
      "READY",
      "PAUSED",
      "HELD",
      "DEGRADED",
      "FALLBACK",
      "CONTEXT_LOST",
      "RECOVERING",
      "ERROR",
      "DESTROYED"
    ]),
    COMPARISON_STATUS: makeEnum([
      "PASS",
      "PARTIAL_PASS",
      "HOLD",
      "FAIL",
      "CONFLICT",
      "DEGRADED",
      "UNVERIFIED"
    ]),
    BACKEND: makeEnum([
      "WEBGPU",
      "WEBGL2",
      "CANVAS2D",
      "SVG",
      "HTML",
      "NONE"
    ]),
    MODEL_CLASS: makeEnum([
      "OBJECT",
      "PLANET",
      "WORLD",
      "ESTATE",
      "ROOM",
      "MAP",
      "DIAGRAM",
      "ARTIFACT",
      "DOORWAY",
      "CUSTOM"
    ]),
    INTERACTION_MODE: makeEnum([
      "NONE",
      "DIRECT",
      "EXTERNAL_DOM",
      "HYBRID"
    ]),
    FALLBACK_TYPE: makeEnum([
      "CANVAS2D",
      "SVG",
      "HTML",
      "NONE"
    ])
  });

  var FIBONACCI = freeze([13, 21, 34, 55, 89, 144, 233]);

  var REQUIREMENT = freeze({
    FILE_LOADED: "fileLoaded",
    CONTRACT_MATCHED: "contractMatched",
    MODEL_VALIDATED: "modelValidated",
    INSTANCE_CREATED: "instanceCreated",
    MOUNT_PRESENT: "mountPresent",
    SURFACE_NONZERO: "surfaceNonzero",
    BACKEND_INITIALIZED: "backendInitialized",
    RESOURCES_UPLOADED: "resourcesUploaded",
    FIRST_FRAME_SUBMITTED: "firstFrameSubmitted",
    FIRST_FRAME_PRESENTED: "firstFramePresented",
    VISIBLE_PIXEL_OBSERVED: "visiblePixelObserved",
    INTERACTION_OBSERVED: "interactionObserved",
    FALLBACK_AVAILABLE: "fallbackAvailable",
    CONTEXT_RECOVERY_AVAILABLE: "contextRecoveryAvailable",
    DISPOSAL_OBSERVED: "disposalObserved",
    NO_BLOCKING_ERROR: "noBlockingError"
  });

  var FORBIDDEN = freeze({
    GLOBAL_SINGLETON_DEPENDENCY: "globalSingletonDependency",
    ROUTE_SPECIFIC_ENGINE_DUPLICATION:
      "routeSpecificEngineDuplication",
    MODEL_OWNS_SHARED_RENDERING: "modelOwnsSharedRendering",
    PRODUCT_ENGINE_IN_FRAME_LOOP: "productEngineInFrameLoop",
    SPEC_COPIED_TO_OPS: "specCopiedToOps",
    SILENT_CONTEXT_LOSS: "silentContextLoss",
    SILENT_RESOURCE_LEAK: "silentResourceLeak",
    SILENT_BUFFER_MUTATION: "silentBufferMutation"
  });

  var STATE_ORDER = freeze({
    DECLARED: 0,
    LOADED: 1,
    VALIDATED: 2,
    CREATED: 3,
    MOUNTED: 4,
    INITIALIZED: 5,
    UPLOADED: 6,
    SUBMITTED: 7,
    PRESENTED: 8,
    VISIBLE: 9,
    INTERACTIVE: 10,
    VERIFIED: 11,
    READY: 11,
    PAUSED: 11,
    FALLBACK: 5,
    HELD: 0,
    DEGRADED: 0,
    CONTEXT_LOST: 0,
    RECOVERING: 0,
    ERROR: 0,
    DESTROYED: 12
  });

  var REQUIREMENT_STATE = freeze({
    fileLoaded: "LOADED",
    contractMatched: "LOADED",
    modelValidated: "VALIDATED",
    instanceCreated: "CREATED",
    mountPresent: "MOUNTED",
    surfaceNonzero: "MOUNTED",
    backendInitialized: "INITIALIZED",
    resourcesUploaded: "UPLOADED",
    firstFrameSubmitted: "SUBMITTED",
    firstFramePresented: "PRESENTED",
    visiblePixelObserved: "VISIBLE",
    interactionObserved: "INTERACTIVE",
    fallbackAvailable: "INITIALIZED",
    contextRecoveryAvailable: "INITIALIZED",
    disposalObserved: "DESTROYED",
    noBlockingError: "DECLARED"
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(Object(object), key);
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isPlainObject(value) {
    if (!isObject(value) || Array.isArray(value)) return false;
    var prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function hasArrayBuffer() {
    return typeof ArrayBuffer !== "undefined";
  }

  function isTypedArray(value) {
    return Boolean(
      value &&
      hasArrayBuffer() &&
      ArrayBuffer.isView &&
      ArrayBuffer.isView(value) &&
      !(typeof DataView !== "undefined" && value instanceof DataView)
    );
  }

  function stringValue(value, fallback) {
    return typeof value === "string" && value.trim()
      ? value.trim()
      : fallback;
  }

  function boolValue(value, fallback) {
    return typeof value === "boolean" ? value : Boolean(fallback);
  }

  function intValue(value, fallback) {
    var parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : fallback;
  }

  function enumValue(enumeration, value, fallback) {
    var normalized =
      typeof value === "string" ? value.trim().toUpperCase() : "";
    return hasOwn(enumeration, normalized)
      ? enumeration[normalized]
      : fallback;
  }

  function uniqueStrings(values) {
    var output = [];
    var seen = Object.create(null);

    (Array.isArray(values) ? values : []).forEach(function each(value) {
      if (typeof value !== "string") return;
      var normalized = value.trim();
      if (!normalized || seen[normalized]) return;
      seen[normalized] = true;
      output.push(normalized);
    });

    return output;
  }

  function clone(value, seen) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "bigint" ||
      typeof value === "function"
    ) {
      return value;
    }

    if (value instanceof Date) {
      return new Date(value.getTime());
    }

    if (isTypedArray(value)) {
      try {
        return new value.constructor(value);
      } catch (_error) {
        return value;
      }
    }

    if (hasArrayBuffer() && value instanceof ArrayBuffer && value.slice) {
      try {
        return value.slice(0);
      } catch (_error2) {
        return value;
      }
    }

    var memory = seen || [];

    if (memory.indexOf(value) !== -1) {
      return "[Circular]";
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function map(entry) {
        return clone(entry, memory.slice());
      });
    }

    var output = {};

    Object.keys(value).forEach(function each(key) {
      output[key] = clone(value[key], memory.slice());
    });

    return output;
  }

  function plain(value, seen) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "bigint") return value.toString();

    if (typeof value === "function") {
      return {
        type: "Function",
        name: value.name || "anonymous"
      };
    }

    if (value instanceof Date) return value.toISOString();

    if (isTypedArray(value)) {
      return {
        type:
          value.constructor && value.constructor.name
            ? value.constructor.name
            : "TypedArray",
        length: value.length || 0,
        byteLength: value.byteLength || 0
      };
    }

    if (hasArrayBuffer() && value instanceof ArrayBuffer) {
      return {
        type: "ArrayBuffer",
        byteLength: value.byteLength || 0
      };
    }

    var memory = seen || [];

    if (memory.indexOf(value) !== -1) return "[Circular]";
    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function map(entry) {
        return plain(entry, memory.slice());
      });
    }

    var output = {};

    Object.keys(value).forEach(function each(key) {
      output[key] = plain(value[key], memory.slice());
    });

    return output;
  }

  function stablePrepare(value, seen) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "bigint") return value.toString();
    if (typeof value === "function") return "[Function]";

    if (value instanceof Date) return value.toISOString();

    if (isTypedArray(value)) {
      return {
        type:
          value.constructor && value.constructor.name
            ? value.constructor.name
            : "TypedArray",
        values: Array.prototype.slice.call(value)
      };
    }

    if (hasArrayBuffer() && value instanceof ArrayBuffer) {
      return {
        type: "ArrayBuffer",
        byteLength: value.byteLength || 0
      };
    }

    var memory = seen || [];

    if (memory.indexOf(value) !== -1) return "[Circular]";
    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function map(entry) {
        return stablePrepare(entry, memory.slice());
      });
    }

    var output = {};

    Object.keys(value)
      .sort()
      .forEach(function each(key) {
        output[key] = stablePrepare(value[key], memory.slice());
      });

    return output;
  }

  function stableStringify(value, spacing) {
    return JSON.stringify(stablePrepare(value), null, spacing || 0);
  }

  function hash(value) {
    var text = stableStringify(value);
    var result = 0x811c9dc5;

    for (var index = 0; index < text.length; index += 1) {
      result ^= text.charCodeAt(index);
      result = Math.imul(result, 0x01000193) >>> 0;
    }

    return "fnv1a32-" + ("00000000" + result.toString(16)).slice(-8);
  }

  function collector(scope) {
    var checks = [];
    var failures = [];
    var warnings = [];

    function add(id, passed, expected, actual, detail, severity) {
      var entry = {
        id: scope + ":" + id,
        passed: Boolean(passed),
        severity: severity || "error",
        expected: plain(expected),
        actual: plain(actual),
        detail: detail || ""
      };

      checks.push(entry);

      if (!entry.passed) {
        if (entry.severity === "warning") warnings.push(entry);
        else failures.push(entry);
      }

      return entry;
    }

    function result(extra) {
      return freeze(
        Object.assign(
          {
            scope: scope,
            passed: failures.length === 0,
            checkCount: checks.length,
            passCount: checks.filter(function filter(check) {
              return check.passed;
            }).length,
            warningCount: warnings.length,
            failCount: failures.length,
            checks: clone(checks),
            warnings: clone(warnings),
            failures: clone(failures)
          },
          extra || {}
        )
      );
    }

    return {
      add: add,
      result: result
    };
  }

  function previousGate(currentGate) {
    var index = FIBONACCI.indexOf(Number(currentGate));
    return index > 0 ? FIBONACCI[index - 1] : 0;
  }

  function nextGate(currentGate) {
    var index = FIBONACCI.indexOf(Number(currentGate));
    return index >= 0 && index < FIBONACCI.length - 1
      ? FIBONACCI[index + 1]
      : Number(currentGate) || 13;
  }

  function normalizeNews(input) {
    var source = isPlainObject(input) ? input : {};

    return freeze({
      sourceStatus: enumValue(
        ENUM.SOURCE_STATUS,
        source.sourceStatus,
        ENUM.SOURCE_STATUS.CURRENT
      ),
      alignmentStatus: enumValue(
        ENUM.ALIGNMENT_STATUS,
        source.alignmentStatus,
        ENUM.ALIGNMENT_STATUS.ALIGNED
      ),
      authorityClass: enumValue(
        ENUM.AUTHORITY_CLASS,
        source.authorityClass,
        ENUM.AUTHORITY_CLASS.SUPPORTING
      ),
      disposition: enumValue(
        ENUM.DISPOSITION,
        source.disposition,
        ENUM.DISPOSITION.PRESERVE
      ),
      source: stringValue(source.source, ""),
      notes: uniqueStrings(source.notes)
    });
  }

  function normalizeFibonacci(input) {
    var source = isPlainObject(input) ? input : {};
    var proposed = intValue(source.currentGate || source.gate, 13);
    var currentGate = FIBONACCI.indexOf(proposed) !== -1 ? proposed : 13;

    return freeze({
      gate: currentGate,
      currentGate: currentGate,
      prerequisiteGate: intValue(
        source.prerequisiteGate,
        previousGate(currentGate)
      ),
      nextGate: intValue(source.nextGate, nextGate(currentGate)),
      synchronized: boolValue(source.synchronized, true),
      evidence: uniqueStrings(source.evidence)
    });
  }

  function normalizeOwnership(input) {
    var source = isPlainObject(input) ? input : {};

    return freeze({
      ownsGeometry: boolValue(source.ownsGeometry, true),
      ownsRendering: boolValue(source.ownsRendering, false),
      ownsInput: boolValue(source.ownsInput, false),
      ownsFallback: boolValue(source.ownsFallback, false),
      ownsDiagnostics: boolValue(source.ownsDiagnostics, false),
      ownsFinalVerdict: boolValue(source.ownsFinalVerdict, false),
      usesRendering: boolValue(source.usesRendering, true),
      usesInput: boolValue(source.usesInput, false),
      usesFallback: boolValue(source.usesFallback, true),
      usesDiagnostics: boolValue(source.usesDiagnostics, true)
    });
  }

  function normalizeSpec(input) {
    var source = isPlainObject(input) ? input : {};
    var backend = isPlainObject(source.backend) ? source.backend : {};

    return freeze({
      schema: source.schema || SPEC_SCHEMA,
      required: isPlainObject(source.required)
        ? clone(source.required)
        : {},
      optional: isPlainObject(source.optional)
        ? clone(source.optional)
        : {},
      forbidden: isPlainObject(source.forbidden)
        ? clone(source.forbidden)
        : {},
      backend: {
        preferred: (Array.isArray(backend.preferred)
          ? backend.preferred
          : ["WEBGPU", "WEBGL2"]
        ).map(function map(value) {
          return enumValue(ENUM.BACKEND, value, ENUM.BACKEND.NONE);
        }),
        requiredAny: (Array.isArray(backend.requiredAny)
          ? backend.requiredAny
          : ["WEBGL2"]
        ).map(function map(value) {
          return enumValue(ENUM.BACKEND, value, ENUM.BACKEND.NONE);
        }),
        fallback: (Array.isArray(backend.fallback)
          ? backend.fallback
          : ["CANVAS2D", "SVG", "HTML"]
        ).map(function map(value) {
          return enumValue(ENUM.BACKEND, value, ENUM.BACKEND.NONE);
        })
      },
      capabilities: isPlainObject(source.capabilities)
        ? clone(source.capabilities)
        : {},
      metadata: isPlainObject(source.metadata)
        ? clone(source.metadata)
        : {}
    });
  }

  function normalizeOps(input) {
    var source = isPlainObject(input) ? input : {};

    return freeze({
      schema: source.schema || OPS_SCHEMA,
      loaded: boolValue(source.loaded, false),
      initialized: boolValue(source.initialized, false),
      observed: isPlainObject(source.observed)
        ? clone(source.observed)
        : {},
      backend: enumValue(
        ENUM.BACKEND,
        source.backend,
        ENUM.BACKEND.NONE
      ),
      state: enumValue(
        ENUM.STATE,
        source.state,
        ENUM.STATE.DECLARED
      ),
      errors: Array.isArray(source.errors) ? clone(source.errors) : [],
      warnings: Array.isArray(source.warnings)
        ? clone(source.warnings)
        : [],
      metrics: isPlainObject(source.metrics)
        ? clone(source.metrics)
        : {},
      timestamps: isPlainObject(source.timestamps)
        ? clone(source.timestamps)
        : {},
      metadata: isPlainObject(source.metadata)
        ? clone(source.metadata)
        : {}
    });
  }

  function normalizeAttribute(name, input) {
    var source = isTypedArray(input)
      ? { data: input }
      : isPlainObject(input)
        ? input
        : {};

    var semantic = stringValue(source.semantic, String(name || "CUSTOM"))
      .toUpperCase();

    return freeze({
      semantic: semantic,
      data: source.data || null,
      size: Math.max(1, Math.min(4, intValue(source.size, 3))),
      normalized: boolValue(source.normalized, false),
      stride: Math.max(0, intValue(source.stride, 0)),
      offset: Math.max(0, intValue(source.offset, 0)),
      divisor: Math.max(0, intValue(source.divisor, 0)),
      custody: stringValue(source.custody, "BORROWED_READ_ONLY"),
      metadata: isPlainObject(source.metadata) ? clone(source.metadata) : {}
    });
  }

  function normalizeMesh(input, index) {
    var source = isPlainObject(input) ? input : {};
    var attributes = {};

    if (isPlainObject(source.attributes)) {
      Object.keys(source.attributes).forEach(function each(key) {
        attributes[String(key).toUpperCase()] =
          normalizeAttribute(key, source.attributes[key]);
      });
    }

    return freeze({
      id: stringValue(source.id, "mesh-" + index),
      label: stringValue(source.label, ""),
      primitive: stringValue(source.primitive, "TRIANGLES").toUpperCase(),
      indexed:
        typeof source.indexed === "boolean"
          ? source.indexed
          : isTypedArray(source.indices),
      attributes: attributes,
      indices: source.indices || null,
      vertexCount: Math.max(0, intValue(source.vertexCount, 0)),
      indexCount: Math.max(0, intValue(source.indexCount, 0)),
      instanceCount: Math.max(1, intValue(source.instanceCount, 1)),
      materialId: stringValue(source.materialId, ""),
      shaderId: stringValue(source.shaderId, ""),
      visible: boolValue(source.visible, true),
      selectable: boolValue(source.selectable, false),
      bounds: isPlainObject(source.bounds) ? clone(source.bounds) : {},
      metadata: isPlainObject(source.metadata) ? clone(source.metadata) : {}
    });
  }

  function normalizeModelPackage(input) {
    var source = isPlainObject(input) ? input : {};
    var identity = isPlainObject(source.identity) ? source.identity : {};
    var geometry = isPlainObject(source.geometry) ? source.geometry : {};
    var modelId = stringValue(
      identity.modelId || source.modelId || source.id,
      ""
    );

    var normalized = {
      schema: MODEL_SCHEMA,
      identity: {
        modelId: modelId,
        modelClass: enumValue(
          ENUM.MODEL_CLASS,
          identity.modelClass || source.modelClass,
          ENUM.MODEL_CLASS.CUSTOM
        ),
        contract: stringValue(identity.contract || source.contract, ""),
        version: stringValue(identity.version || source.version, "0.0.0"),
        label: stringValue(identity.label || source.label, modelId),
        route: stringValue(identity.route || source.route, "")
      },
      ownership: normalizeOwnership(source.ownership),
      news: normalizeNews(source.news),
      fibonacci: normalizeFibonacci(source.fibonacci),
      spec: normalizeSpec(source.spec),
      geometry: {
        meshes: Array.isArray(geometry.meshes)
          ? geometry.meshes.map(normalizeMesh)
          : [],
        bounds: isPlainObject(geometry.bounds) ? clone(geometry.bounds) : {},
        anchors: isPlainObject(geometry.anchors) ? clone(geometry.anchors) : {},
        geometryHash: stringValue(geometry.geometryHash, ""),
        factory:
          typeof geometry.factory === "function"
            ? geometry.factory
            : typeof geometry.createGeometry === "function"
              ? geometry.createGeometry
              : null,
        provider: geometry.provider || null,
        deferred: boolValue(geometry.deferred, false),
        bufferCustody: stringValue(
          geometry.bufferCustody,
          "BORROWED_READ_ONLY"
        ),
        metadata: isPlainObject(geometry.metadata)
          ? clone(geometry.metadata)
          : {}
      },
      materials: Array.isArray(source.materials)
        ? clone(source.materials)
        : [],
      shaders: Array.isArray(source.shaders) ? clone(source.shaders) : [],
      passes: Array.isArray(source.passes) ? clone(source.passes) : [],
      camera: isPlainObject(source.camera) ? clone(source.camera) : {},
      lights: Array.isArray(source.lights) ? clone(source.lights) : [],
      animation: isPlainObject(source.animation)
        ? clone(source.animation)
        : { mode: "NONE" },
      interaction: isPlainObject(source.interaction)
        ? Object.assign(clone(source.interaction), {
            mode: enumValue(
              ENUM.INTERACTION_MODE,
              source.interaction.mode,
              ENUM.INTERACTION_MODE.NONE
            )
          })
        : { mode: "NONE" },
      fallback: isPlainObject(source.fallback)
        ? Object.assign(clone(source.fallback), {
            type: enumValue(
              ENUM.FALLBACK_TYPE,
              source.fallback.type,
              ENUM.FALLBACK_TYPE.NONE
            )
          })
        : { type: "NONE" },
      diagnostics: isPlainObject(source.diagnostics)
        ? clone(source.diagnostics)
        : {},
      metadata: isPlainObject(source.metadata) ? clone(source.metadata) : {}
    };

    normalized.packageHash = hash(
      Object.assign({}, normalized, { packageHash: undefined })
    );

    return freeze(normalized);
  }

  function validateAttribute(name, input) {
    var attribute = normalizeAttribute(name, input);
    var audit = collector("attribute:" + attribute.semantic);

    audit.add(
      "typed-array",
      isTypedArray(attribute.data),
      "TypedArray",
      attribute.data && attribute.data.constructor
        ? attribute.data.constructor.name
        : typeof attribute.data,
      "Attribute data must be a typed array."
    );

    audit.add(
      "size",
      Number.isInteger(attribute.size) &&
        attribute.size >= 1 &&
        attribute.size <= 4,
      "integer 1..4",
      attribute.size,
      "Attribute size must be between one and four."
    );

    if (isTypedArray(attribute.data)) {
      audit.add(
        "length-divisible",
        attribute.data.length % attribute.size === 0,
        "length divisible by size",
        attribute.data.length,
        "Attribute length must align with declared size."
      );
    }

    return audit.result({
      normalized: attribute,
      elementCount: isTypedArray(attribute.data)
        ? Math.floor(attribute.data.length / attribute.size)
        : 0
    });
  }

  function validateMesh(input) {
    var mesh = normalizeMesh(input, 0);
    var audit = collector("mesh:" + mesh.id);
    var vertexCount = mesh.vertexCount;

    audit.add("id", Boolean(mesh.id), "non-empty", mesh.id, "Mesh requires ID.");

    audit.add(
      "position",
      hasOwn(mesh.attributes, "POSITION"),
      true,
      hasOwn(mesh.attributes, "POSITION"),
      "Renderable mesh requires POSITION."
    );

    Object.keys(mesh.attributes).forEach(function each(name) {
      var result = validateAttribute(name, mesh.attributes[name]);
      if (name === "POSITION" && result.elementCount > vertexCount) {
        vertexCount = result.elementCount;
      }

      audit.add(
        "attribute-" + name,
        result.passed,
        true,
        result.passed,
        "Attribute must validate."
      );
    });

    audit.add(
      "vertex-count",
      vertexCount > 0,
      "> 0",
      vertexCount,
      "Mesh requires vertices."
    );

    return audit.result({
      normalized: freeze(Object.assign({}, mesh, { vertexCount: vertexCount }))
    });
  }

  function validateSpec(input) {
    var spec = normalizeSpec(input);
    var audit = collector("spec");

    audit.add(
      "backend-required",
      spec.backend.requiredAny.length > 0 &&
        spec.backend.requiredAny.indexOf("NONE") === -1,
      "at least one executable backend",
      spec.backend.requiredAny,
      "SPEC requires at least one executable backend."
    );

    return audit.result({ normalized: spec });
  }

  function validateOps(input) {
    var ops = normalizeOps(input);
    var audit = collector("ops");

    audit.add(
      "observed-object",
      isPlainObject(ops.observed),
      true,
      isPlainObject(ops.observed),
      "OPS.observed must be an object."
    );

    return audit.result({ normalized: ops });
  }

  function validateModelPackage(input) {
    var model = normalizeModelPackage(input);
    var audit = collector("model:" + (model.identity.modelId || "unknown"));

    audit.add(
      "schema",
      isPlainObject(input) && input.schema === MODEL_SCHEMA,
      MODEL_SCHEMA,
      isPlainObject(input) ? input.schema : undefined,
      "Model package must explicitly declare DGB_MODEL_PACKAGE_v1."
    );

    audit.add(
      "model-id",
      Boolean(model.identity.modelId),
      "non-empty string",
      model.identity.modelId,
      "Model package requires modelId."
    );

    audit.add(
      "contract",
      Boolean(model.identity.contract),
      "non-empty string",
      model.identity.contract,
      "Model package requires contract."
    );

    audit.add(
      "news-admissible",
      model.news.sourceStatus !== "CONFLICTING" &&
        model.news.alignmentStatus !== "CONFLICT" &&
        model.news.alignmentStatus !== "HOLD",
      "non-conflicting NEWS",
      model.news,
      "Conflicting or held source cannot enter executable admission."
    );

    audit.add(
      "fibonacci-synchronized",
      model.fibonacci.synchronized === true,
      true,
      model.fibonacci.synchronized,
      "Model must declare synchronized Fibonacci state."
    );

    audit.add(
      "geometry-source",
      model.geometry.meshes.length > 0 ||
        typeof model.geometry.factory === "function" ||
        Boolean(model.geometry.provider) ||
        model.geometry.deferred,
      "mesh, factory, provider, or deferred",
      {
        meshes: model.geometry.meshes.length,
        factory: typeof model.geometry.factory === "function",
        provider: Boolean(model.geometry.provider),
        deferred: model.geometry.deferred
      },
      "Model package must identify a geometry source."
    );

    model.geometry.meshes.forEach(function each(mesh) {
      var result = validateMesh(mesh);
      audit.add(
        "mesh-" + mesh.id,
        result.passed,
        true,
        result.passed,
        "Mesh must validate."
      );
    });

    audit.add(
      "passes",
      model.passes.length > 0 || model.geometry.deferred,
      "> 0 or deferred",
      model.passes.length,
      "Executable model should declare render passes.",
      model.geometry.deferred ? "warning" : "error"
    );

    audit.add(
      "no-renderer-ownership",
      model.ownership.ownsRendering === false,
      false,
      model.ownership.ownsRendering,
      "Model may not own shared renderer."
    );

    audit.add(
      "no-final-verdict-ownership",
      model.ownership.ownsFinalVerdict === false,
      false,
      model.ownership.ownsFinalVerdict,
      "Model may not own final verdict."
    );

    return audit.result({
      normalized: model,
      modelHash: model.packageHash
    });
  }

  function flattenLeaves(value, prefix, output) {
    var target = output || [];
    var path = prefix || "";

    var operator =
      isPlainObject(value) &&
      ["equals", "oneOf", "present", "absent", "minimum", "maximum", "includes", "test"]
        .some(function some(key) {
          return hasOwn(value, key);
        });

    if (isPlainObject(value) && !operator) {
      var keys = Object.keys(value);
      if (!keys.length) target.push([path, value]);
      keys.forEach(function each(key) {
        flattenLeaves(value[key], path ? path + "." + key : key, target);
      });
      return target;
    }

    target.push([path, value]);
    return target;
  }

  function getPath(object, path) {
    if (!path) return object;

    return String(path)
      .split(".")
      .reduce(function reduce(current, key) {
        return current === null || current === undefined
          ? undefined
          : current[key];
      }, object);
  }

  function evaluateRequirement(expected, actual) {
    if (isPlainObject(expected)) {
      if (typeof expected.test === "function") {
        try {
          return Boolean(expected.test(actual));
        } catch (_error) {
          return false;
        }
      }

      if (hasOwn(expected, "present")) {
        return expected.present
          ? actual !== undefined && actual !== null
          : actual === undefined || actual === null;
      }

      if (hasOwn(expected, "absent")) {
        return expected.absent
          ? actual === undefined || actual === null || actual === false
          : true;
      }

      if (hasOwn(expected, "equals")) return Object.is(actual, expected.equals);

      if (Array.isArray(expected.oneOf)) {
        return expected.oneOf.some(function some(value) {
          return Object.is(value, actual);
        });
      }

      if (hasOwn(expected, "minimum")) {
        return typeof actual === "number" && actual >= expected.minimum;
      }

      if (hasOwn(expected, "maximum")) {
        return typeof actual === "number" && actual <= expected.maximum;
      }

      if (hasOwn(expected, "includes")) {
        return Array.isArray(actual) && actual.indexOf(expected.includes) !== -1;
      }

      return true;
    }

    if (expected === true) return actual === true;
    if (expected === false) return actual === false;

    if (Array.isArray(expected)) {
      return expected.some(function some(value) {
        return Object.is(value, actual);
      });
    }

    return Object.is(expected, actual);
  }

  function reachedRequirementState(path, state) {
    var rootPath = String(path || "").split(".")[0];
    var required = REQUIREMENT_STATE[rootPath];

    if (!required) return false;

    return (STATE_ORDER[state] || 0) >= (STATE_ORDER[required] || 0);
  }

  function compareSpecAndOps(specInput, opsInput) {
    var spec = normalizeSpec(specInput);
    var ops = normalizeOps(opsInput);

    var actual = Object.assign(
      {
        loaded: ops.loaded,
        initialized: ops.initialized,
        backend: ops.backend,
        state: ops.state,
        errors: ops.errors,
        warnings: ops.warnings,
        metrics: ops.metrics,
        timestamps: ops.timestamps,
        metadata: ops.metadata,
        observed: ops.observed
      },
      ops.observed
    );

    var passed = [];
    var held = [];
    var failed = [];
    var conflicts = [];

    flattenLeaves(spec.required).forEach(function each(pair) {
      var path = pair[0];
      var expected = pair[1];
      var observed = getPath(actual, path);
      var entry = {
        path: path,
        expected: plain(expected),
        observed: plain(observed),
        category: "required"
      };

      if (evaluateRequirement(expected, observed)) {
        passed.push(entry);
      } else if (
        observed === undefined ||
        observed === null ||
        (expected === true &&
          observed === false &&
          !reachedRequirementState(path, ops.state))
      ) {
        held.push(entry);
      } else {
        failed.push(entry);
      }
    });

    flattenLeaves(spec.forbidden).forEach(function each(pair) {
      var path = pair[0];
      var expected = pair[1];
      var observed = getPath(actual, path);
      var entry = {
        path: path,
        expected: plain(expected),
        observed: plain(observed),
        category: "forbidden"
      };

      if (evaluateRequirement(expected, observed)) conflicts.push(entry);
      else passed.push(entry);
    });

    var backendEntry = {
      path: "backend",
      expected: clone(spec.backend.requiredAny),
      observed: ops.backend,
      category: "backend"
    };

    if (spec.backend.requiredAny.indexOf(ops.backend) !== -1) {
      passed.push(backendEntry);
    } else if (ops.backend === "NONE") {
      held.push(backendEntry);
    } else {
      failed.push(backendEntry);
    }

    var status = "PASS";

    if (conflicts.length) status = "CONFLICT";
    else if (failed.length) status = "FAIL";
    else if (held.length) status = passed.length ? "PARTIAL_PASS" : "HOLD";
    else if (ops.errors.length) status = "DEGRADED";

    return freeze({
      schema: COMPARISON_SCHEMA,
      status: status,
      passed: clone(passed),
      held: clone(held),
      failed: clone(failed),
      conflicts: clone(conflicts),
      passCount: passed.length,
      heldCount: held.length,
      failCount: failed.length,
      conflictCount: conflicts.length,
      ready: status === "PASS" && ops.errors.length === 0
    });
  }

  function createDeclaredOps(overrides) {
    var source = isPlainObject(overrides) ? overrides : {};
    var observed = Object.assign(
      {
        fileLoaded: false,
        contractMatched: false,
        modelValidated: false,
        instanceCreated: false,
        mountPresent: false,
        surfaceNonzero: false,
        backendInitialized: false,
        resourcesUploaded: false,
        firstFrameSubmitted: false,
        firstFramePresented: false,
        visiblePixelObserved: false,
        interactionObserved: false,
        fallbackAvailable: false,
        contextRecoveryAvailable: false,
        disposalObserved: false,
        noBlockingError: true
      },
      isPlainObject(source.observed) ? source.observed : {}
    );

    return normalizeOps(
      Object.assign({}, source, {
        loaded: boolValue(source.loaded, false),
        initialized: boolValue(source.initialized, false),
        backend: source.backend || "NONE",
        state: source.state || "DECLARED",
        observed: observed
      })
    );
  }

  function createInstanceSpec(options) {
    var source = isPlainObject(options) ? options : {};
    var interactionMode = enumValue(
      ENUM.INTERACTION_MODE,
      source.interactionMode,
      "NONE"
    );

    var requiresInteraction =
      typeof source.requiresInteraction === "boolean"
        ? source.requiresInteraction
        : interactionMode !== "NONE";

    var requiresFallback =
      typeof source.requiresFallback === "boolean"
        ? source.requiresFallback
        : true;

    var requiredBackend = Array.isArray(source.requiredBackend)
      ? source.requiredBackend
      : ["WEBGL2"];

    var required = Object.assign(
      {
        fileLoaded: true,
        contractMatched: true,
        modelValidated: true,
        instanceCreated: true,
        mountPresent: true,
        surfaceNonzero: true,
        backendInitialized: true,
        resourcesUploaded: true,
        firstFrameSubmitted: true,
        firstFramePresented: true,
        visiblePixelObserved: true,
        noBlockingError: true
      },
      requiresInteraction ? { interactionObserved: true } : {},
      requiresFallback ? { fallbackAvailable: true } : {},
      isPlainObject(source.required) ? source.required : {}
    );

    var forbidden = Object.assign(
      {
        globalSingletonDependency: true,
        routeSpecificEngineDuplication: true,
        modelOwnsSharedRendering: true,
        productEngineInFrameLoop: true,
        specCopiedToOps: true,
        silentContextLoss: true,
        silentResourceLeak: true,
        silentBufferMutation: true
      },
      isPlainObject(source.forbidden) ? source.forbidden : {}
    );

    return freeze({
      schema: SPEC_SCHEMA,
      required: required,
      optional: Object.assign(
        {
          contextRecoveryAvailable: true,
          disposalObserved: true
        },
        isPlainObject(source.optional) ? source.optional : {}
      ),
      forbidden: forbidden,
      backend: {
        preferred: (Array.isArray(source.preferredBackend)
          ? source.preferredBackend
          : ["WEBGPU", "WEBGL2"]
        ).map(function map(value) {
          return enumValue(ENUM.BACKEND, value, "NONE");
        }),
        requiredAny: requiredBackend.map(function map(value) {
          return enumValue(ENUM.BACKEND, value, "NONE");
        }),
        fallback: (Array.isArray(source.fallbackBackend)
          ? source.fallbackBackend
          : ["CANVAS2D", "SVG", "HTML"]
        ).map(function map(value) {
          return enumValue(ENUM.BACKEND, value, "NONE");
        })
      },
      capabilities: isPlainObject(source.capabilities)
        ? clone(source.capabilities)
        : {},
      metadata: Object.assign(
        {
          interactionMode: interactionMode,
          requiresInteraction: requiresInteraction,
          requiresFallback: requiresFallback
        },
        isPlainObject(source.metadata) ? clone(source.metadata) : {}
      )
    });
  }

  function deriveReceiptState(comparison, ops) {
    if (ops.state === "DESTROYED") {
      return { state: "DESTROYED", status: "DESTROYED", ready: false };
    }

    if (ops.state === "CONTEXT_LOST") {
      return { state: "CONTEXT_LOST", status: "CONTEXT_LOST", ready: false };
    }

    if (comparison.status === "CONFLICT") {
      return { state: "HELD", status: "CONFLICT", ready: false };
    }

    if (comparison.status === "FAIL") {
      return {
        state: ops.errors.length ? "ERROR" : "DEGRADED",
        status: ops.errors.length ? "ERROR" : "DEGRADED",
        ready: false
      };
    }

    if (
      comparison.status === "HOLD" ||
      comparison.status === "PARTIAL_PASS"
    ) {
      return { state: "HELD", status: "HELD", ready: false };
    }

    if (comparison.ready) {
      return { state: "VERIFIED", status: "READY", ready: true };
    }

    return { state: ops.state, status: "UNVERIFIED", ready: false };
  }

  function composeReceipt(input) {
    var source = isPlainObject(input) ? input : {};
    var news = normalizeNews(source.news);
    var fibonacci = normalizeFibonacci(source.fibonacci);
    var spec = normalizeSpec(source.spec);
    var ops = normalizeOps(source.ops);
    var comparison = source.comparison
      ? clone(source.comparison)
      : compareSpecAndOps(spec, ops);
    var derived = deriveReceiptState(comparison, ops);
    var composedAt = stringValue(source.composedAt, nowIso());

    var core = {
      schema: RECEIPT_SCHEMA,
      contract: CONTRACT,
      authority: CONTRACT,
      hybridAuthority: HYBRID_AUTHORITY,
      identity: isPlainObject(source.identity) ? clone(source.identity) : {},
      news: news,
      fibonacci: fibonacci,
      specHash: hash(spec),
      opsHash: hash(ops),
      comparisonHash: hash(comparison),
      state: derived.state,
      status: derived.status,
      ready: derived.ready,
      comparison: comparison,
      ops: plain(ops),
      metadata: isPlainObject(source.metadata) ? clone(source.metadata) : {},
      composedAt: composedAt
    };

    return freeze(
      Object.assign({}, core, {
        receiptHash: hash(Object.assign({}, core, { composedAt: undefined }))
      })
    );
  }

  function assertModelPackage(input) {
    var result = validateModelPackage(input);

    if (!result.passed) {
      var error = new Error(
        "[" +
          CONTRACT +
          "] Model package validation failed: " +
          result.failures
            .map(function map(entry) {
              return entry.id;
            })
            .join(", ")
      );

      error.name = "DGBModelPackageValidationError";
      error.validation = result;
      throw error;
    }

    return result.normalized;
  }

  function selfValidate() {
    var audit = collector("authority");
    var declared = createDeclaredOps();
    var spec = createInstanceSpec({ interactionMode: "NONE" });

    audit.add(
      "model-schema",
      MODEL_SCHEMA === "DGB_MODEL_PACKAGE_v1",
      "DGB_MODEL_PACKAGE_v1",
      MODEL_SCHEMA,
      "Model schema must remain locked."
    );

    audit.add(
      "fibonacci-order",
      FIBONACCI.every(function every(value, index) {
        return index === 0 || value > FIBONACCI[index - 1];
      }),
      true,
      FIBONACCI,
      "Fibonacci gates must be strictly increasing."
    );

    audit.add(
      "declared-not-ready",
      declared.state === "DECLARED" &&
        declared.observed.visiblePixelObserved === false,
      true,
      declared,
      "Declared OPS may not imply readiness."
    );

    audit.add(
      "visible-proof-required",
      spec.required.visiblePixelObserved === true,
      true,
      spec.required.visiblePixelObserved,
      "Standard readiness requires visible-pixel proof."
    );

    audit.add(
      "spec-ops-separated",
      hash(spec) !== hash(declared),
      true,
      hash(spec) !== hash(declared),
      "SPEC and OPS must remain distinct records."
    );

    return audit.result({ schema: VALIDATION_SCHEMA });
  }

  var AUTHORITY_VALIDATION = selfValidate();

  var AUTHORITY_RECEIPT = freeze({
    schema: AUTHORITY_RECEIPT_SCHEMA,
    contract: CONTRACT,
    authorityContract: CONTRACT,
    hybridAuthority: HYBRID_AUTHORITY,
    version: VERSION,
    file: FILE,
    modelSchema: MODEL_SCHEMA,
    specSchema: SPEC_SCHEMA,
    opsSchema: OPS_SCHEMA,
    receiptSchema: RECEIPT_SCHEMA,
    status: AUTHORITY_VALIDATION.passed ? "READY" : "INVALID",
    ready: AUTHORITY_VALIDATION.passed,
    authorityReady: AUTHORITY_VALIDATION.passed,
    fibonacciGate: 13,
    nextFibonacciGate: 21,
    fibonacci: {
      gate: 13,
      currentGate: 13,
      nextGate: 21
    },
    ownsDOM: false,
    ownsCanvas: false,
    ownsWebGL: false,
    ownsWebGPU: false,
    ownsShaders: false,
    ownsBuffers: false,
    ownsInput: false,
    ownsModelGeometry: false,
    ownsFinalVerdict: false,
    validationPassCount: AUTHORITY_VALIDATION.passCount,
    validationFailCount: AUTHORITY_VALIDATION.failCount,
    generatedAt: nowIso(),
    contractHash: hash({
      contract: CONTRACT,
      version: VERSION,
      schemas: {
        model: MODEL_SCHEMA,
        spec: SPEC_SCHEMA,
        ops: OPS_SCHEMA,
        receipt: RECEIPT_SCHEMA
      },
      fibonacci: FIBONACCI,
      requirements: REQUIREMENT,
      forbidden: FORBIDDEN
    })
  });

  function getAuthorityReceipt() {
    return clone(AUTHORITY_RECEIPT);
  }

  function getAuthorityValidation() {
    return clone(AUTHORITY_VALIDATION);
  }

  var API = freeze({
    contract: CONTRACT,
    hybridAuthority: HYBRID_AUTHORITY,
    version: VERSION,
    file: FILE,

    schemas: freeze({
      MODEL: MODEL_SCHEMA,
      SPEC: SPEC_SCHEMA,
      OPS: OPS_SCHEMA,
      COMPARISON: COMPARISON_SCHEMA,
      RECEIPT: RECEIPT_SCHEMA,
      AUTHORITY_RECEIPT: AUTHORITY_RECEIPT_SCHEMA
    }),

    enums: freeze({
      ENUM: ENUM,
      FIBONACCI: FIBONACCI,
      REQUIREMENT: REQUIREMENT,
      FORBIDDEN: FORBIDDEN
    }),

    clone: clone,
    plain: plain,
    deepFreeze: freeze,
    stableStringify: stableStringify,
    hash: hash,

    normalizeNews: normalizeNews,
    normalizeFibonacci: normalizeFibonacci,
    normalizeOwnership: normalizeOwnership,
    normalizeAttribute: normalizeAttribute,
    normalizeMesh: normalizeMesh,
    normalizeSpec: normalizeSpec,
    normalizeOps: normalizeOps,
    normalizeModelPackage: normalizeModelPackage,

    validateAttribute: validateAttribute,
    validateMesh: validateMesh,
    validateSpec: validateSpec,
    validateOps: validateOps,
    validateModelPackage: validateModelPackage,
    assertModelPackage: assertModelPackage,

    compareSpecAndOps: compareSpecAndOps,
    composeReceipt: composeReceipt,
    createDeclaredOps: createDeclaredOps,
    createInstanceSpec: createInstanceSpec,

    previousFibonacciGate: previousGate,
    nextFibonacciGate: nextGate,

    getAuthorityReceipt: getAuthorityReceipt,
    getAuthorityValidation: getAuthorityValidation
  });

  function install() {
    var canonical = root.DGB_ENGINE_CONTRACT || null;
    var compat = root.DGBEngineContract || null;

    if (canonical && compat && canonical !== compat) {
      root.__DGB_ENGINE_CONTRACT_INSTALLATION_CONFLICT__ = freeze({
        schema: "DGB_ENGINE_CONTRACT_INSTALLATION_CONFLICT_v1",
        code: "GLOBAL_ALIAS_CONFLICT",
        expectedContract: CONTRACT,
        replacementPerformed: false,
        generatedAt: nowIso()
      });
      return false;
    }

    var existing = canonical || compat;

    if (existing) {
      if (existing.contract !== CONTRACT) {
        root.__DGB_ENGINE_CONTRACT_INSTALLATION_CONFLICT__ = freeze({
          schema: "DGB_ENGINE_CONTRACT_INSTALLATION_CONFLICT_v1",
          code: "CONTRACT_CONFLICT",
          expectedContract: CONTRACT,
          existingContract: existing.contract || null,
          replacementPerformed: false,
          generatedAt: nowIso()
        });
        return false;
      }

      root.DGB_ENGINE_CONTRACT = existing;
      root.DGBEngineContract = existing;

      if (typeof module !== "undefined" && module.exports) {
        module.exports = existing;
      }

      return true;
    }

    root.DGB_ENGINE_CONTRACT = API;
    root.DGBEngineContract = API;
    root.DGB_ENGINE_CONTRACT_RECEIPT = getAuthorityReceipt();
    root.__DGB_ENGINE_CONTRACT_LOADED__ = true;
    root.__DGB_ENGINE_CONTRACT_VERSION__ = VERSION;
    root.__DGB_ENGINE_CONTRACT_MODEL_SCHEMA__ = MODEL_SCHEMA;

    if (typeof module !== "undefined" && module.exports) {
      module.exports = API;
    }

    return true;
  }

  if (!AUTHORITY_VALIDATION.passed) {
    root.__DGB_ENGINE_CONTRACT_AUTHORITY_INVALID__ =
      AUTHORITY_VALIDATION;

    throw new Error(
      "[" +
        CONTRACT +
        "] Authority self-validation failed: " +
        AUTHORITY_VALIDATION.failures
          .map(function map(entry) {
            return entry.id;
          })
          .join(", ")
    );
  }

  install();
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
