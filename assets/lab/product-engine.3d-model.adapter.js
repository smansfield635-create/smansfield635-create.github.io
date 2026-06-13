// /assets/lab/product-engine.3d-model.adapter.js
// LAB_PRODUCT_ENGINE_GENERIC_3D_MODEL_ADAPTER_F34_F55_F89_F144_TNT_v1
// Full-file construction.
//
// Purpose:
// - Provide one reusable intake and handoff adapter for future three-dimensional models.
// - Normalize model manifests without owning model-specific geometry or rendering.
// - Convert each model family into deterministic F34 product records.
// - Coordinate the existing F34 -> F55 -> F89 -> F144 engine sequence.
// - Collect geometry, renderer, UI, shell, fallback, and runtime evidence receipts.
// - Register the G3 Showroom Diamond as the first canonical model.
//
// Owns:
// - generic 3D model manifest normalization
// - structural manifest validation
// - component dependency preparation
// - F34 product-definition preparation and registration
// - F55/F89/F144 handoff orchestration
// - model integration receipts and chain history
// - reusable model registry local to this adapter
//
// Does not own:
// - model-specific geometry
// - WebGL, Canvas, shaders, GPU buffers, animation, or camera runtime
// - DOM route shells or public UI controls
// - F34, F55, F89, or F144 authority slots
// - market judgment, North latch authority, or final visual acceptance
// - public superiority or comparison claims

(function installGeneric3DModelAdapter(root, doc) {
  "use strict";

  const CONTRACT =
    "LAB_PRODUCT_ENGINE_GENERIC_3D_MODEL_ADAPTER_F34_F55_F89_F144_TNT_v1";

  const RECEIPT =
    "LAB_PRODUCT_ENGINE_GENERIC_3D_MODEL_ADAPTER_F34_F55_F89_F144_RECEIPT_v1";

  const VERSION = "1.0.0";
  const FILE = "/assets/lab/product-engine.3d-model.adapter.js";
  const PROJECT_ID = "diamond-gate-bridge";

  const ENGINE_FILES = Object.freeze({
    f34: "/assets/lab/product-engine.js",
    f55: "/assets/lab/product-engine.ue5-expression.js",
    f89: "/assets/lab/product-engine.registry.js",
    f144: "/assets/lab/product-engine.market.js"
  });

  const ENGINE_SEQUENCE = Object.freeze([
    "F34_PRODUCT",
    "F55_EXPRESSION",
    "F89_REGISTRY",
    "F144_MARKET",
    "F233_RETURN"
  ]);

  const COMPONENT_ROLES = Object.freeze({
    GEOMETRY: "geometry",
    RENDERER: "renderer",
    UI: "ui",
    SHELL: "shell",
    FALLBACK: "fallback",
    DOCUMENTATION: "documentation",
    DIAGNOSTIC: "diagnostic"
  });

  const DEFAULT_PRODUCT_TYPES = Object.freeze({
    geometry: "product-framework",
    renderer: "canvas-expression",
    ui: "support-engine",
    shell: "product-framework",
    fallback: "product-framework",
    documentation: "documentation",
    diagnostic: "diagnostic-evidence"
  });

  const DEFAULT_PRIORITIES = Object.freeze({
    geometry: 100,
    renderer: 98,
    shell: 96,
    ui: 94,
    fallback: 82,
    documentation: 78,
    diagnostic: 84
  });

  const MODEL_CLASSES = Object.freeze([
    "artifact",
    "building",
    "character",
    "computational-gem",
    "equipment",
    "environment",
    "furniture",
    "infrastructure",
    "planet",
    "room",
    "sculpture",
    "vehicle",
    "world-object",
    "other"
  ]);

  const STATUS = Object.freeze({
    READY: "READY",
    DEGRADED: "DEGRADED",
    HELD: "HELD",
    BLOCKED: "BLOCKED",
    ERROR: "ERROR",
    UNAVAILABLE: "UNAVAILABLE",
    REGISTERED: "REGISTERED",
    LOCAL_ONLY: "LOCAL_ONLY"
  });

  const state = {
    createdAt: nowIso(),
    updatedAt: "",

    models: new Map(),
    validations: new Map(),
    evidence: new Map(),
    registrations: new Map(),
    chainRuns: new Map(),
    errors: [],
    events: [],

    adapterF34Registered: false,
    adapterF34Product: null,
    canonicalDiamondSeeded: false,
    autoRegistrationAttempts: 0,

    lastEngineStatus: null,
    lastReceipt: null,
    lastAdapterPacket: null,

    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,
    benchmarkRequiredBeforePublicClaim: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function isObject(value) {
    return Boolean(
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    );
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed || fallback;
    }

    if (value === null || value === undefined) {
      return fallback;
    }

    return String(value).trim() || fallback;
  }

  function safeBool(value, fallback = false) {
    return typeof value === "boolean"
      ? value
      : fallback;
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(
        maximum,
        safeNumber(value, minimum)
      )
    );
  }

  function uniqueStrings(values) {
    const output = [];
    const seen = new Set();

    for (const value of Array.isArray(values) ? values : []) {
      const text = safeString(value);

      if (!text || seen.has(text)) {
        continue;
      }

      seen.add(text);
      output.push(text);
    }

    return output;
  }

  function clonePlain(value) {
    if (value === undefined) {
      return undefined;
    }

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) {
        return value.map(clonePlain);
      }

      if (isObject(value)) {
        const copy = {};

        for (const [key, item] of Object.entries(value)) {
          if (typeof item !== "function") {
            copy[key] = clonePlain(item);
          }
        }

        return copy;
      }

      return value;
    }
  }

  function makeId(value, fallback = "model") {
    const source = safeString(value, fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return source || fallback;
  }

  function startsWithSlash(value) {
    return safeString(value).startsWith("/");
  }

  function stableSortObject(value) {
    if (Array.isArray(value)) {
      return value.map(stableSortObject);
    }

    if (!isObject(value)) {
      return value;
    }

    const output = {};

    for (const key of Object.keys(value).sort()) {
      output[key] = stableSortObject(value[key]);
    }

    return output;
  }

  function stableStringify(value) {
    return JSON.stringify(
      stableSortObject(value)
    );
  }

  function fnv1a(text) {
    let hash = 0x811c9dc5;

    for (
      let index = 0;
      index < text.length;
      index += 1
    ) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(
        hash,
        0x01000193
      ) >>> 0;
    }

    return `fnv1a32-${hash
      .toString(16)
      .padStart(8, "0")}`;
  }

  function recordEvent(type, detail = {}) {
    const event = Object.freeze({
      type: safeString(
        type,
        "ADAPTER_EVENT"
      ),

      detail: clonePlain(detail),

      time: nowIso()
    });

    state.events.push(event);

    if (state.events.length > 256) {
      state.events.splice(
        0,
        state.events.length - 256
      );
    }

    state.updatedAt = event.time;

    return clonePlain(event);
  }

  function recordError(scope, error, modelId = "") {
    const entry = Object.freeze({
      scope: safeString(
        scope,
        "ADAPTER_ERROR"
      ),

      modelId:
        safeString(modelId),

      message:
        error &&
        error.message
          ? error.message
          : safeString(
              error,
              "Unknown adapter error"
            ),

      time:
        nowIso()
    });

    state.errors.push(entry);

    if (state.errors.length > 128) {
      state.errors.splice(
        0,
        state.errors.length - 128
      );
    }

    recordEvent(
      "GENERIC_3D_MODEL_ADAPTER_ERROR",
      entry
    );

    updateDataset();

    return clonePlain(entry);
  }

  function getPath(path) {
    const parts = safeString(path)
      .split(".")
      .filter(Boolean);

    let cursor = root;

    for (const part of parts) {
      if (
        !cursor ||
        !(part in cursor)
      ) {
        return undefined;
      }

      cursor = cursor[part];
    }

    return cursor;
  }

  function firstGlobal(paths) {
    for (const path of paths) {
      const value = getPath(path);

      if (value) {
        return value;
      }
    }

    return null;
  }

  function dispatch(name, detail) {
    if (
      !root ||
      !isFunction(root.dispatchEvent)
    ) {
      return false;
    }

    try {
      if (
        typeof root.CustomEvent ===
        "function"
      ) {
        root.dispatchEvent(
          new root.CustomEvent(
            name,
            {
              detail:
                clonePlain(detail)
            }
          )
        );

        return true;
      }
    } catch (_error) {}

    return false;
  }

  function setDataset(name, value) {
    if (
      !doc ||
      !doc.documentElement
    ) {
      return;
    }

    const text = String(value);

    try {
      doc.documentElement.dataset[name] =
        text;

      if (doc.body) {
        doc.body.dataset[name] =
          text;
      }
    } catch (_error) {}
  }

  function normalizeVector3(value, fallback) {
    const source =
      Array.isArray(value)
        ? value
        : fallback;

    if (
      !Array.isArray(source) ||
      source.length !== 3
    ) {
      return [0, 0, 0];
    }

    return source.map(
      (item, index) =>
        safeNumber(
          item,
          Array.isArray(fallback)
            ? fallback[index]
            : 0
        )
    );
  }

  function normalizeBounds(value = {}) {
    const source =
      isObject(value)
        ? value
        : {};

    return {
      minimum:
        normalizeVector3(
          source.minimum,
          [0, 0, 0]
        ),

      maximum:
        normalizeVector3(
          source.maximum,
          [0, 0, 0]
        ),

      center:
        normalizeVector3(
          source.center,
          [0, 0, 0]
        ),

      radius:
        Math.max(
          0,
          safeNumber(
            source.radius,
            0
          )
        )
    };
  }

  function normalizeMetrics(value = {}) {
    const source =
      isObject(value)
        ? value
        : {};

    return {
      vertexCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.vertexCount,
              0
            )
          )
        ),

      triangleCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.triangleCount,
              0
            )
          )
        ),

      nodeCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.nodeCount,
              0
            )
          )
        ),

      edgeCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.edgeCount,
              0
            )
          )
        ),

      materialCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.materialCount,
              0
            )
          )
        ),

      animationCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.animationCount,
              0
            )
          )
        ),

      radialCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.radialCount,
              0
            )
          )
        ),

      bandCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.bandCount,
              0
            )
          )
        ),

      seatCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.seatCount,
              0
            )
          )
        ),

      textureCount:
        Math.max(
          0,
          Math.round(
            safeNumber(
              source.textureCount,
              0
            )
          )
        ),

      bounds:
        normalizeBounds(
          source.bounds
        )
    };
  }

  function normalizeCapabilityMap(value = {}) {
    const source =
      isObject(value)
        ? value
        : {};

    return {
      nativeWebGL:
        safeBool(
          source.nativeWebGL,
          false
        ),

      webGL2Optional:
        safeBool(
          source.webGL2Optional,
          false
        ),

      canvasFallback:
        safeBool(
          source.canvasFallback,
          false
        ),

      staticFallback:
        safeBool(
          source.staticFallback,
          true
        ),

      objectView:
        safeBool(
          source.objectView,
          true
        ),

      latticeView:
        safeBool(
          source.latticeView,
          false
        ),

      dragRotation:
        safeBool(
          source.dragRotation,
          true
        ),

      touchRotation:
        safeBool(
          source.touchRotation,
          true
        ),

      pinchZoom:
        safeBool(
          source.pinchZoom,
          true
        ),

      wheelZoom:
        safeBool(
          source.wheelZoom,
          true
        ),

      facetPicking:
        safeBool(
          source.facetPicking,
          false
        ),

      nodePicking:
        safeBool(
          source.nodePicking,
          false
        ),

      keyboardControls:
        safeBool(
          source.keyboardControls,
          false
        ),

      reducedMotion:
        safeBool(
          source.reducedMotion,
          true
        ),

      contextLossRecovery:
        safeBool(
          source.contextLossRecovery,
          true
        ),

      responsive:
        safeBool(
          source.responsive,
          true
        ),

      deterministicGeometry:
        safeBool(
          source.deterministicGeometry,
          true
        ),

      external3DLibrary:
        safeBool(
          source.external3DLibrary,
          false
        ),

      generatedImage:
        false,

      graphicBox:
        false
    };
  }

  function normalizeRuntimeSource(value = {}) {
    const source =
      isObject(value)
        ? value
        : {};

    return {
      globals:
        uniqueStrings(
          source.globals ||
          source.globalNames ||
          []
        ),

      receiptGlobals:
        uniqueStrings(
          source.receiptGlobals ||
          []
        ),

      readyFields:
        uniqueStrings(
          source.readyFields ||
          [
            "ready",
            "initialized",
            "geometryReady",
            "rendererReady"
          ]
        ),

      statusMethod:
        safeString(
          source.statusMethod,
          "status"
        ),

      receiptMethod:
        safeString(
          source.receiptMethod,
          "getReceipt"
        )
    };
  }

  function normalizeReadiness(value = {}, defaults = {}) {
    const source =
      isObject(value)
        ? value
        : {};

    const fallback =
      isObject(defaults)
        ? defaults
        : {};

    return {
      receiptReady:
        safeBool(
          source.receiptReady,
          safeBool(
            fallback.receiptReady,
            false
          )
        ),

      platformReady:
        safeBool(
          source.platformReady,
          safeBool(
            fallback.platformReady,
            false
          )
        ),

      engineeringReady:
        safeBool(
          source.engineeringReady,
          safeBool(
            fallback.engineeringReady,
            false
          )
        ),

      productReady:
        safeBool(
          source.productReady,
          safeBool(
            fallback.productReady,
            false
          )
        ),

      expressionReady:
        safeBool(
          source.expressionReady,
          safeBool(
            fallback.expressionReady,
            false
          )
        ),

      registryReady:
        safeBool(
          source.registryReady,
          safeBool(
            fallback.registryReady,
            false
          )
        ),

      marketReady:
        false,

      documentationReady:
        safeBool(
          source.documentationReady,
          safeBool(
            fallback.documentationReady,
            false
          )
        ),

      evidenceReady:
        safeBool(
          source.evidenceReady,
          safeBool(
            fallback.evidenceReady,
            false
          )
        ),

      riskBoundaryReady:
        safeBool(
          source.riskBoundaryReady,
          safeBool(
            fallback.riskBoundaryReady,
            true
          )
        ),

      publicReady:
        safeBool(
          source.publicReady,
          safeBool(
            fallback.publicReady,
            false
          )
        ),

      finalVisualPassClaimed:
        false,

      benchmarkComplete:
        safeBool(
          source.benchmarkComplete,
          false
        )
    };
  }

  function normalizeComponent(role, value, modelId) {
    if (
      value === false ||
      value === null
    ) {
      return null;
    }

    const source =
      typeof value === "string"
        ? {
            file: value
          }
        : isObject(value)
          ? value
          : {};

    const normalizedRole =
      safeString(
        role,
        "component"
      );

    const required =
      normalizedRole ===
      COMPONENT_ROLES.GEOMETRY ||
      normalizedRole ===
      COMPONENT_ROLES.RENDERER;

    const defaultDependencies = [];

    if (
      normalizedRole ===
      COMPONENT_ROLES.RENDERER
    ) {
      defaultDependencies.push(
        "geometry"
      );
    } else if (
      normalizedRole ===
      COMPONENT_ROLES.UI
    ) {
      defaultDependencies.push(
        "renderer"
      );
    } else if (
      normalizedRole ===
      COMPONENT_ROLES.SHELL
    ) {
      defaultDependencies.push(
        "geometry",
        "renderer",
        "ui"
      );
    } else if (
      normalizedRole ===
      COMPONENT_ROLES.FALLBACK
    ) {
      defaultDependencies.push(
        "geometry"
      );
    } else if (
      normalizedRole ===
      COMPONENT_ROLES.DIAGNOSTIC
    ) {
      defaultDependencies.push(
        "geometry",
        "renderer"
      );
    }

    const enabled =
      safeBool(
        source.enabled,
        Boolean(
          source.file ||
          source.route ||
          required
        )
      );

    const constructionReady =
      safeBool(
        source.constructionReady,
        false
      );

    const readiness =
      normalizeReadiness(
        source.readiness,
        {
          receiptReady:
            Boolean(
              source.contract ||
              source.receipt
            ),

          platformReady:
            constructionReady,

          engineeringReady:
            constructionReady,

          productReady:
            constructionReady,

          expressionReady:
            constructionReady,

          registryReady:
            false,

          documentationReady:
            constructionReady,

          evidenceReady:
            false,

          riskBoundaryReady:
            true,

          publicReady:
            false
        }
      );

    return {
      role:
        normalizedRole,

      id:
        makeId(
          source.id ||
          `${modelId}-${normalizedRole}`,

          `${modelId}-${normalizedRole}`
        ),

      name:
        safeString(
          source.name ||
          source.label,

          `${modelId} ${normalizedRole}`
        ),

      label:
        safeString(
          source.label ||
          source.name,

          `${modelId} ${normalizedRole}`
        ),

      file:
        safeString(
          source.file ||
          source.sourceFile
        ),

      route:
        safeString(
          source.route
        ),

      contract:
        safeString(
          source.contract ||
          source.sourceContract
        ),

      receipt:
        safeString(
          source.receipt ||
          source.sourceReceipt
        ),

      productType:
        safeString(
          source.productType ||
          source.type,

          DEFAULT_PRODUCT_TYPES[
            normalizedRole
          ] ||
          "product-framework"
        ),

      priority:
        clamp(
          source.priority,
          0,
          100
        ) ||
        DEFAULT_PRIORITIES[
          normalizedRole
        ] ||
        50,

      dependencies:
        uniqueStrings(
          Array.isArray(
            source.dependencies
          )
            ? source.dependencies
            : defaultDependencies
        ),

      tags:
        uniqueStrings([
          "3d-model",
          normalizedRole,
          ...(
            Array.isArray(
              source.tags
            )
              ? source.tags
              : []
          )
        ]),

      enabled,

      required:
        safeBool(
          source.required,
          required
        ),

      constructionReady,

      runtime:
        normalizeRuntimeSource(
          source.runtime
        ),

      readiness,

      metadata:
        clonePlain(
          source.metadata ||
          {}
        )
    };
  }

  function normalizeManifest(definition = {}) {
    const source =
      isObject(definition)
        ? definition
        : {};

    const id =
      makeId(
        source.id ||
        source.modelId ||
        source.name,

        `model-${
          state.models.size + 1
        }`
      );

    const filesSource =
      isObject(source.files)
        ? source.files
        : {};

    const contractsSource =
      isObject(source.contracts)
        ? source.contracts
        : {};

    const receiptsSource =
      isObject(source.receipts)
        ? source.receipts
        : {};

    const runtimesSource =
      isObject(source.runtime)
        ? source.runtime
        : {};

    const componentReadiness =
      isObject(
        source.componentReadiness
      )
        ? source.componentReadiness
        : {};

    const componentDefinition =
      role => {
        const direct =
          filesSource[role];

        const isDirectObject =
          isObject(direct);

        return {
          ...(
            isDirectObject
              ? direct
              : {}
          ),

          file:
            safeString(
              isDirectObject
                ? direct.file
                : direct,

              safeString(
                source[
                  `${role}File`
                ]
              )
            ),

          route:
            safeString(
              isDirectObject
                ? direct.route
                : "",

              safeString(
                source.route
              )
            ),

          contract:
            safeString(
              isDirectObject
                ? direct.contract
                : "",

              safeString(
                contractsSource[role] ||
                source[
                  `${role}Contract`
                ]
              )
            ),

          receipt:
            safeString(
              isDirectObject
                ? direct.receipt
                : "",

              safeString(
                receiptsSource[role] ||
                source[
                  `${role}Receipt`
                ]
              )
            ),

          constructionReady:
            safeBool(
              isDirectObject
                ? direct.constructionReady
                : undefined,

              safeBool(
                source.constructionReady,
                false
              )
            ),

          runtime: {
            ...(
              isDirectObject &&
              isObject(
                direct.runtime
              )
                ? direct.runtime
                : {}
            ),

            ...(
              isObject(
                runtimesSource[role]
              )
                ? runtimesSource[role]
                : {}
            )
          },

          readiness: {
            ...(
              isDirectObject &&
              isObject(
                direct.readiness
              )
                ? direct.readiness
                : {}
            ),

            ...(
              isObject(
                componentReadiness[
                  role
                ]
              )
                ? componentReadiness[
                    role
                  ]
                : {}
            )
          },

          tags:
            uniqueStrings([
              ...(
                isDirectObject &&
                Array.isArray(
                  direct.tags
                )
                  ? direct.tags
                  : []
              ),

              ...(
                Array.isArray(
                  source.tags
                )
                  ? source.tags
                  : []
              )
            ])
        };
      };

    const components = {};

    for (
      const role of
      Object.values(
        COMPONENT_ROLES
      )
    ) {
      const candidate =
        componentDefinition(role);

      const hasDefinition =
        Boolean(
          candidate.file ||
          candidate.contract ||
          candidate.receipt ||
          role ===
          COMPONENT_ROLES.GEOMETRY ||
          role ===
          COMPONENT_ROLES.RENDERER
        );

      if (!hasDefinition) {
        components[role] = null;
        continue;
      }

      components[role] =
        normalizeComponent(
          role,
          candidate,
          id
        );
    }

    const modelClassInput =
      safeString(
        source.modelClass ||
        source.class,

        "world-object"
      );

    const modelClass =
      MODEL_CLASSES.includes(
        modelClassInput
      )
        ? modelClassInput
        : "other";

    const normalized = {
      id,

      modelId:
        id,

      projectId:
        makeId(
          source.projectId ||
          source.project ||
          PROJECT_ID,

          PROJECT_ID
        ),

      name:
        safeString(
          source.name ||
          source.label,

          id
        ),

      label:
        safeString(
          source.label ||
          source.name,

          id
        ),

      description:
        safeString(
          source.description
        ),

      purpose:
        safeString(
          source.purpose
        ),

      route:
        safeString(
          source.route
        ),

      generation:
        safeString(
          source.generation,
          "G1"
        ),

      modelClass,

      coordinateSystem:
        safeString(
          source.coordinateSystem,
          "right-handed-y-up"
        ),

      units:
        safeString(
          source.units,
          "normalized-world-units"
        ),

      tags:
        uniqueStrings([
          "3d-model",
          modelClass,
          ...(
            Array.isArray(
              source.tags
            )
              ? source.tags
              : []
          )
        ]),

      components,

      metrics:
        normalizeMetrics(
          source.metrics
        ),

      capabilities:
        normalizeCapabilityMap(
          source.capabilities
        ),

      materials:
        Array.isArray(
          source.materials
        )
          ? clonePlain(
              source.materials
            )
          : [],

      cameras:
        Array.isArray(
          source.cameras
        )
          ? clonePlain(
              source.cameras
            )
          : [],

      lights:
        Array.isArray(
          source.lights
        )
          ? clonePlain(
              source.lights
            )
          : [],

      modes:
        Array.isArray(
          source.modes
        )
          ? clonePlain(
              source.modes
            )
          : [],

      interactions:
        Array.isArray(
          source.interactions
        )
          ? uniqueStrings(
              source.interactions
            )
          : [],

      dependencies:
        uniqueStrings(
          source.dependencies ||
          []
        ),

      readiness:
        normalizeReadiness(
          source.readiness,
          {
            receiptReady:
              safeBool(
                source.constructionReady,
                false
              ),

            platformReady:
              safeBool(
                source.constructionReady,
                false
              ),

            engineeringReady:
              safeBool(
                source.constructionReady,
                false
              ),

            productReady:
              safeBool(
                source.constructionReady,
                false
              ),

            expressionReady:
              safeBool(
                source.constructionReady,
                false
              ),

            registryReady:
              false,

            documentationReady:
              safeBool(
                source.constructionReady,
                false
              ),

            evidenceReady:
              false,

            riskBoundaryReady:
              true,

            publicReady:
              false
          }
        ),

      evidenceRequirements:
        uniqueStrings(
          source.evidenceRequirements ||
          [
            "geometry-validation",
            "renderer-initialization",
            "route-resolution",
            "interaction-validation",
            "responsive-validation",
            "fallback-validation",
            "visual-review"
          ]
        ),

      riskBoundaries:
        uniqueStrings(
          source.riskBoundaries ||
          [
            "no-public-superiority-claim-without-benchmark",
            "no-final-visual-pass-claim-without-review",
            "no-runtime-ready-claim-without-runtime-receipt"
          ]
        ),

      publicSuperiorityClaim:
        false,

      publicComparisonClaimAllowed:
        false,

      benchmarkRequiredBeforePublicClaim:
        true,

      generatedImage:
        false,

      graphicBox:
        false,

      webGL:
        false,

      visualPassClaimed:
        false,

      metadata:
        clonePlain(
          source.metadata ||
          {}
        )
    };

    normalized.manifestHash =
      fnv1a(
        stableStringify({
          ...normalized,
          manifestHash:
            undefined
        })
      );

    return normalized;
  }

  function createValidationCheck(
    id,
    pass,
    expected,
    actual,
    detail
  ) {
    return {
      id,

      pass:
        Boolean(pass),

      expected,

      actual,

      detail
    };
  }

  function validateManifest(definition = {}) {
    const manifest =
      definition &&
      definition.manifestHash
        ? clonePlain(
            definition
          )
        : normalizeManifest(
            definition
          );

    const checks = [];

    checks.push(
      createValidationCheck(
        "model-id",
        Boolean(
          manifest.id
        ),
        "non-empty model id",
        manifest.id,
        "Every model requires a stable ID."
      )
    );

    checks.push(
      createValidationCheck(
        "model-name",
        Boolean(
          manifest.name
        ),
        "non-empty model name",
        manifest.name,
        "Every model requires a readable name."
      )
    );

    checks.push(
      createValidationCheck(
        "route-format",
        !manifest.route ||
        startsWithSlash(
          manifest.route
        ),
        "empty or absolute route",
        manifest.route,
        "Model routes must begin with /."
      )
    );

    checks.push(
      createValidationCheck(
        "geometry-component",
        Boolean(
          manifest.components.geometry
        ),
        true,
        Boolean(
          manifest.components.geometry
        ),
        "Every 3D model requires a geometry authority component."
      )
    );

    checks.push(
      createValidationCheck(
        "renderer-component",
        Boolean(
          manifest.components.renderer
        ),
        true,
        Boolean(
          manifest.components.renderer
        ),
        "Every 3D model requires a renderer component."
      )
    );

    for (
      const [
        role,
        component
      ] of
      Object.entries(
        manifest.components
      )
    ) {
      if (
        !component ||
        !component.enabled
      ) {
        continue;
      }

      checks.push(
        createValidationCheck(
          `${role}-file-format`,
          Boolean(
            component.file &&
            startsWithSlash(
              component.file
            )
          ),
          "absolute repository file path",
          component.file,
          `${role} must identify an absolute repository file path.`
        )
      );

      checks.push(
        createValidationCheck(
          `${role}-contract`,
          Boolean(
            component.contract
          ),
          "non-empty contract",
          component.contract,
          `${role} requires a contract for F34/F55/F89 traceability.`
        )
      );

      checks.push(
        createValidationCheck(
          `${role}-product-id`,
          Boolean(
            component.id
          ),
          "non-empty component product id",
          component.id,
          `${role} requires a stable F34 product ID.`
        )
      );
    }

    const enabledComponents =
      Object.values(
        manifest.components
      )
        .filter(
          component =>
            component &&
            component.enabled
        );

    const componentIds =
      enabledComponents.map(
        component =>
          component.id
      );

    const uniqueComponentIds =
      new Set(
        componentIds
      );

    checks.push(
      createValidationCheck(
        "unique-component-ids",
        uniqueComponentIds.size ===
        componentIds.length,
        componentIds.length,
        uniqueComponentIds.size,
        "Component product IDs must be unique within the model family."
      )
    );

    const availableRoles =
      new Set(
        enabledComponents.map(
          component =>
            component.role
        )
      );

    const dependenciesResolvable =
      enabledComponents.every(
        component =>
          component.dependencies.every(
            dependency =>
              availableRoles.has(
                dependency
              ) ||
              componentIds.includes(
                makeId(
                  dependency
                )
              ) ||
              manifest.dependencies.includes(
                dependency
              )
          )
      );

    checks.push(
      createValidationCheck(
        "component-dependencies-resolvable",
        dependenciesResolvable,
        true,
        dependenciesResolvable,
        "Role dependencies must resolve inside the model family or the declared external dependency list."
      )
    );

    const metricsNonNegative =
      Object.entries(
        manifest.metrics
      )
        .filter(
          ([key]) =>
            key !== "bounds"
        )
        .every(
          ([, value]) =>
            Number.isFinite(
              value
            ) &&
            value >= 0
        );

    checks.push(
      createValidationCheck(
        "metrics-non-negative",
        metricsNonNegative,
        true,
        metricsNonNegative,
        "Published geometry metrics must be finite and non-negative."
      )
    );

    checks.push(
      createValidationCheck(
        "forbidden-public-superiority-claim",
        manifest.publicSuperiorityClaim ===
        false,
        false,
        manifest.publicSuperiorityClaim,
        "The adapter never authorizes a public superiority claim."
      )
    );

    checks.push(
      createValidationCheck(
        "forbidden-final-visual-pass-claim",
        manifest.visualPassClaimed ===
        false,
        false,
        manifest.visualPassClaimed,
        "Final visual acceptance remains outside adapter authority."
      )
    );

    const failed =
      checks.filter(
        check =>
          !check.pass
      );

    return {
      contract:
        CONTRACT,

      modelId:
        manifest.id,

      manifestHash:
        manifest.manifestHash,

      passed:
        failed.length === 0,

      status:
        failed.length === 0
          ? STATUS.READY
          : STATUS.BLOCKED,

      checkCount:
        checks.length,

      passCount:
        checks.length -
        failed.length,

      failCount:
        failed.length,

      checks,

      failed,

      validatedAt:
        nowIso()
    };
  }

  function registerModel(definition = {}, options = {}) {
    const manifest =
      normalizeManifest(
        definition
      );

    const validation =
      validateManifest(
        manifest
      );

    state.models.set(
      manifest.id,
      manifest
    );

    state.validations.set(
      manifest.id,
      validation
    );

    const existingEvidence =
      state.evidence.get(
        manifest.id
      );

    if (!existingEvidence) {
      state.evidence.set(
        manifest.id,
        createEmptyEvidence(
          manifest.id
        )
      );
    }

    recordEvent(
      "GENERIC_3D_MODEL_MANIFEST_REGISTERED",
      {
        modelId:
          manifest.id,

        manifestHash:
          manifest.manifestHash,

        validationStatus:
          validation.status,

        validationPassCount:
          validation.passCount,

        validationFailCount:
          validation.failCount
      }
    );

    publishGlobals();

    if (
      options.registerWithF34 ===
      true
    ) {
      registerModelWithF34(
        manifest.id,
        options
      );
    }

    return {
      registered:
        true,

      model:
        clonePlain(
          manifest
        ),

      validation:
        clonePlain(
          validation
        ),

      localOnly:
        options.registerWithF34 !==
        true
    };
  }

  function unregisterModel(modelId) {
    const id =
      makeId(
        modelId,
        ""
      );

    if (
      !id ||
      !state.models.has(id)
    ) {
      return {
        removed:
          false,

        reason:
          "MODEL_NOT_FOUND",

        modelId:
          id
      };
    }

    state.models.delete(id);
    state.validations.delete(id);
    state.evidence.delete(id);
    state.registrations.delete(id);
    state.chainRuns.delete(id);

    recordEvent(
      "GENERIC_3D_MODEL_MANIFEST_REMOVED",
      {
        modelId:
          id,

        note:
          "F34 has no unregister operation; previously registered external engine records are not deleted by this local removal."
      }
    );

    publishGlobals();

    return {
      removed:
        true,

      modelId:
        id,

      externalEngineRecordsRemoved:
        false
    };
  }

  function getModel(modelId) {
    const id =
      makeId(
        modelId,
        ""
      );

    const model =
      state.models.get(id);

    return model
      ? clonePlain(model)
      : null;
  }

  function listModels() {
    return Array.from(
      state.models.values()
    ).map(
      clonePlain
    );
  }

  function getValidation(modelId) {
    const id =
      makeId(
        modelId,
        ""
      );

    const validation =
      state.validations.get(id);

    return validation
      ? clonePlain(
          validation
        )
      : null;
  }

  function createEmptyEvidence(modelId) {
    return {
      contract:
        CONTRACT,

      modelId,

      collectedAt:
        null,

      runtimeObserved:
        false,

      requiredComponentCount:
        0,

      observedComponentCount:
        0,

      readyComponentCount:
        0,

      components:
        {},

      geometryValidationObserved:
        false,

      rendererReadyObserved:
        false,

      uiReadyObserved:
        false,

      routeShellRuntimeObserved:
        false,

      allRequiredRuntimeReady:
        false,

      visualReviewAccepted:
        false,

      benchmarkComplete:
        false,

      marketReady:
        false,

      publicSuperiorityClaim:
        false,

      visualPassClaimed:
        false
    };
  }

  function readAuthoritySnapshot(authority, runtimeSource) {
    if (!authority) {
      return null;
    }

    const result = {
      authorityObserved:
        true,

      contract:
        safeString(
          authority.contract
        ),

      status:
        null,

      receipt:
        null,

      ready:
        false
    };

    try {
      const statusMethod =
        safeString(
          runtimeSource.statusMethod,
          "status"
        );

      if (
        statusMethod &&
        isFunction(
          authority[
            statusMethod
          ]
        )
      ) {
        result.status =
          clonePlain(
            authority[
              statusMethod
            ]()
          );
      } else if (
        isObject(
          authority.state
        )
      ) {
        result.status =
          clonePlain(
            authority.state
          );
      }
    } catch (error) {
      result.statusError =
        error.message ||
        String(error);
    }

    try {
      const receiptMethod =
        safeString(
          runtimeSource.receiptMethod,
          "getReceipt"
        );

      if (
        receiptMethod &&
        isFunction(
          authority[
            receiptMethod
          ]
        )
      ) {
        result.receipt =
          clonePlain(
            authority[
              receiptMethod
            ]()
          );
      } else if (
        authority.receipt
      ) {
        result.receipt =
          clonePlain(
            authority.receipt
          );
      }
    } catch (error) {
      result.receiptError =
        error.message ||
        String(error);
    }

    const readyFields =
      runtimeSource.readyFields ||
      [];

    const candidates = [
      result.status,
      result.receipt,
      authority
    ].filter(Boolean);

    result.ready =
      candidates.some(
        candidate => {
          if (
            !isObject(
              candidate
            )
          ) {
            return false;
          }

          if (
            safeString(
              candidate.status
            ).toUpperCase() ===
            STATUS.READY
          ) {
            return true;
          }

          return readyFields.some(
            field =>
              candidate[field] ===
              true
          );
        }
      );

    return result;
  }

  function collectRuntimeEvidence(modelId, options = {}) {
    const id =
      makeId(
        modelId,
        ""
      );

    const manifest =
      state.models.get(id);

    if (!manifest) {
      return {
        collected:
          false,

        reason:
          "MODEL_NOT_FOUND",

        modelId:
          id
      };
    }

    const evidence =
      createEmptyEvidence(id);

    evidence.collectedAt =
      nowIso();

    for (
      const [
        role,
        component
      ] of
      Object.entries(
        manifest.components
      )
    ) {
      if (
        !component ||
        !component.enabled
      ) {
        continue;
      }

      if (component.required) {
        evidence.requiredComponentCount +=
          1;
      }

      let authority = null;
      let authorityPath = "";

      for (
        const path of
        component.runtime.globals
      ) {
        const candidate =
          getPath(path);

        if (candidate) {
          authority =
            candidate;

          authorityPath =
            path;

          break;
        }
      }

      let receiptGlobal = null;
      let receiptGlobalPath = "";

      for (
        const path of
        component.runtime.receiptGlobals
      ) {
        const candidate =
          getPath(path);

        if (candidate) {
          receiptGlobal =
            clonePlain(
              candidate
            );

          receiptGlobalPath =
            path;

          break;
        }
      }

      const snapshot =
        readAuthoritySnapshot(
          authority,
          component.runtime
        );

      const observed =
        Boolean(
          authority ||
          receiptGlobal
        );

      const ready =
        Boolean(
          (
            snapshot &&
            snapshot.ready
          ) ||
          (
            isObject(
              receiptGlobal
            ) &&
            safeString(
              receiptGlobal.status
            ).toUpperCase() ===
            STATUS.READY
          )
        );

      if (observed) {
        evidence.observedComponentCount +=
          1;
      }

      if (ready) {
        evidence.readyComponentCount +=
          1;
      }

      evidence.components[role] = {
        role,

        componentId:
          component.id,

        required:
          component.required,

        observed,

        ready,

        authorityPath,

        receiptGlobalPath,

        authoritySnapshot:
          snapshot,

        receiptGlobal
      };
    }

    evidence.runtimeObserved =
      evidence.observedComponentCount >
      0;

    const geometryEvidence =
      evidence.components.geometry;

    const rendererEvidence =
      evidence.components.renderer;

    const uiEvidence =
      evidence.components.ui;

    const shellEvidence =
      evidence.components.shell;

    evidence.geometryValidationObserved =
      Boolean(
        geometryEvidence &&
        geometryEvidence.ready
      );

    evidence.rendererReadyObserved =
      Boolean(
        rendererEvidence &&
        rendererEvidence.ready
      );

    evidence.uiReadyObserved =
      Boolean(
        !manifest.components.ui ||
        (
          uiEvidence &&
          uiEvidence.ready
        )
      );

    evidence.routeShellRuntimeObserved =
      Boolean(
        !manifest.components.shell ||
        (
          shellEvidence &&
          shellEvidence.observed
        )
      );

    const requiredComponents =
      Object.values(
        evidence.components
      )
        .filter(
          component =>
            component.required
        );

    evidence.allRequiredRuntimeReady =
      requiredComponents.length >
      0 &&
      requiredComponents.every(
        component =>
          component.ready
      );

    evidence.visualReviewAccepted =
      safeBool(
        options.visualReviewAccepted,
        false
      );

    evidence.benchmarkComplete =
      safeBool(
        options.benchmarkComplete,
        false
      );

    evidence.marketReady =
      false;

    evidence.publicSuperiorityClaim =
      false;

    evidence.visualPassClaimed =
      false;

    state.evidence.set(
      id,
      evidence
    );

    recordEvent(
      "GENERIC_3D_MODEL_RUNTIME_EVIDENCE_COLLECTED",
      {
        modelId:
          id,

        observedComponentCount:
          evidence.observedComponentCount,

        readyComponentCount:
          evidence.readyComponentCount,

        allRequiredRuntimeReady:
          evidence.allRequiredRuntimeReady,

        visualReviewAccepted:
          evidence.visualReviewAccepted
      }
    );

    publishGlobals();

    return {
      collected:
        true,

      evidence:
        clonePlain(
          evidence
        )
    };
  }

  function getEvidence(modelId) {
    const id =
      makeId(
        modelId,
        ""
      );

    const evidence =
      state.evidence.get(id);

    return evidence
      ? clonePlain(
          evidence
        )
      : null;
  }

  function resolveDependencyIds(manifest, component) {
    const components =
      manifest.components;

    const idsByRole = {};

    for (
      const [
        role,
        item
      ] of
      Object.entries(
        components
      )
    ) {
      if (
        item &&
        item.enabled
      ) {
        idsByRole[role] =
          item.id;
      }
    }

    const output = [];

    for (
      const dependency of
      component.dependencies
    ) {
      const resolved =
        idsByRole[dependency] ||
        dependency;

      if (
        resolved &&
        !output.includes(
          resolved
        )
      ) {
        output.push(
          resolved
        );
      }
    }

    for (
      const dependency of
      manifest.dependencies
    ) {
      if (
        dependency &&
        !output.includes(
          dependency
        )
      ) {
        output.push(
          dependency
        );
      }
    }

    return output;
  }

  function buildProductDefinitions(modelId) {
    const id =
      makeId(
        modelId,
        ""
      );

    const manifest =
      state.models.get(id);

    if (!manifest) {
      return [];
    }

    const evidence =
      state.evidence.get(id) ||
      createEmptyEvidence(id);

    const products = [];

    for (
      const component of
      Object.values(
        manifest.components
      )
    ) {
      if (
        !component ||
        !component.enabled
      ) {
        continue;
      }

      const componentEvidence =
        evidence.components[
          component.role
        ] ||
        {};

      const runtimeReady =
        componentEvidence.ready ===
        true;

      const constructionReady =
        component.constructionReady ===
        true;

      products.push({
        id:
          component.id,

        productId:
          component.id,

        projectId:
          manifest.projectId,

        type:
          component.productType,

        name:
          component.name,

        label:
          component.label,

        file:
          component.file,

        route:
          component.route ||
          manifest.route,

        contract:
          component.contract,

        receipt:
          component.receipt ||
          `${component.contract}_RECEIPT`,

        priority:
          component.priority,

        dependencies:
          resolveDependencyIds(
            manifest,
            component
          ),

        tags:
          uniqueStrings([
            ...manifest.tags,
            ...component.tags,
            `model:${manifest.id}`,
            `generation:${manifest.generation}`,
            `class:${manifest.modelClass}`
          ]),

        receiptReady:
          component.readiness.receiptReady ||
          Boolean(
            component.contract
          ),

        platformReady:
          component.readiness.platformReady ||
          constructionReady,

        engineeringReady:
          component.readiness.engineeringReady ||
          constructionReady,

        productReady:
          component.readiness.productReady ||
          constructionReady,

        expressionReady:
          component.readiness.expressionReady ||
          constructionReady,

        registryReady:
          component.readiness.registryReady,

        marketReady:
          false,

        documentationReady:
          component.readiness.documentationReady ||
          constructionReady,

        evidenceReady:
          component.readiness.evidenceReady ||
          runtimeReady,

        riskBoundaryReady:
          component.readiness.riskBoundaryReady,

        internalOnly:
          true,

        publicReady:
          false,

        publicSuperiorityClaim:
          false,

        publicComparisonClaimAllowed:
          false,

        generatedImage:
          false,

        graphicBox:
          false,

        webGL:
          false,

        visualPassClaimed:
          false
      });
    }

    return products;
  }

  function getEngineAuthorities() {
    const f34 =
      firstGlobal([
        "LAB_PRODUCT_ENGINE",
        "LAB_PRODUCT_ENGINE_F34",
        "PRODUCT_ENGINE",
        "PRODUCT_ENGINE_F34",
        "PRODUCT_ENGINE_CLERK",
        "PRODUCT_ENGINE_AUTHORITY_SLOT",
        "DEXTER_LAB.productEngine",
        "DEXTER_LAB.productEngineF34",
        "HEARTH.productEngine",
        "HEARTH.productEngineF34"
      ]);

    const f55 =
      firstGlobal([
        "LAB_PRODUCT_ENGINE_UE5_EXPRESSION",
        "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55",
        "PRODUCT_ENGINE_UE5_EXPRESSION",
        "UE5_EXPRESSION_CONDUCTOR",
        "UE5_EXPRESSION_F55_CONDUCTOR",
        "EXPRESSION_CLERK",
        "DEXTER_LAB.productEngineUE5Expression",
        "DEXTER_LAB.productEngineUE5ExpressionF55",
        "HEARTH.productEngineUE5Expression",
        "HEARTH.productEngineUE5ExpressionF55"
      ]);

    const f89 =
      firstGlobal([
        "LAB_PRODUCT_ENGINE_REGISTRY",
        "LAB_PRODUCT_ENGINE_REGISTRY_F89",
        "PRODUCT_ENGINE_REGISTRY",
        "PROJECT_REGISTRY_CONDUCTOR",
        "PROJECT_REGISTRY_F89_CONDUCTOR",
        "REGISTRY_CLERK",
        "DEXTER_LAB.productEngineRegistry",
        "DEXTER_LAB.productEngineRegistryF89",
        "HEARTH.productEngineRegistry",
        "HEARTH.productEngineRegistryF89"
      ]);

    const f144 =
      firstGlobal([
        "LAB_PRODUCT_ENGINE_MARKET",
        "LAB_PRODUCT_ENGINE_MARKET_F144",
        "PRODUCT_ENGINE_MARKET",
        "MARKET_F144_READINESS_CONDUCTOR",
        "MARKET_READINESS_CONDUCTOR",
        "MARKET_CLERK",
        "DEXTER_LAB.productEngineMarket",
        "DEXTER_LAB.productEngineMarketF144",
        "HEARTH.productEngineMarket",
        "HEARTH.productEngineMarketF144"
      ]);

    const status = {
      f34: {
        available:
          Boolean(f34),

        contract:
          f34
            ? safeString(
                f34.contract
              )
            : "",

        file:
          f34
            ? safeString(
                f34.file,
                ENGINE_FILES.f34
              )
            : ENGINE_FILES.f34
      },

      f55: {
        available:
          Boolean(f55),

        contract:
          f55
            ? safeString(
                f55.contract
              )
            : "",

        file:
          f55
            ? safeString(
                f55.file,
                ENGINE_FILES.f55
              )
            : ENGINE_FILES.f55
      },

      f89: {
        available:
          Boolean(f89),

        contract:
          f89
            ? safeString(
                f89.contract
              )
            : "",

        file:
          f89
            ? safeString(
                f89.file,
                ENGINE_FILES.f89
              )
            : ENGINE_FILES.f89
      },

      f144: {
        available:
          Boolean(f144),

        contract:
          f144
            ? safeString(
                f144.contract
              )
            : "",

        file:
          f144
            ? safeString(
                f144.file,
                ENGINE_FILES.f144
              )
            : ENGINE_FILES.f144
      }
    };

    status.complete =
      Boolean(
        f34 &&
        f55 &&
        f89 &&
        f144
      );

    state.lastEngineStatus =
      clonePlain(status);

    return {
      authorities: {
        f34,
        f55,
        f89,
        f144
      },

      status
    };
  }

  function registerAdapterWithF34(options = {}) {
    const engineSet =
      getEngineAuthorities();

    const f34 =
      engineSet.authorities.f34;

    if (
      !f34 ||
      !isFunction(
        f34.registerProduct
      )
    ) {
      return {
        registered:
          false,

        status:
          STATUS.UNAVAILABLE,

        reason:
          "F34_REGISTER_PRODUCT_UNAVAILABLE",

        recommendedFile:
          ENGINE_FILES.f34
      };
    }

    try {
      const productTypes =
        isObject(
          f34.PRODUCT_TYPES
        )
          ? f34.PRODUCT_TYPES
          : DEFAULT_PRODUCT_TYPES;

      const product =
        f34.registerProduct(
          {
            id:
              "product-engine-generic-3d-model-adapter",

            type:
              productTypes.SUPPORT_ENGINE ||
              "support-engine",

            name:
              "Generic 3D Model Product Engine Adapter",

            label:
              "Generic 3D Model Adapter",

            file:
              FILE,

            route:
              "/assets/lab/",

            contract:
              CONTRACT,

            receipt:
              RECEIPT,

            projectId:
              PROJECT_ID,

            priority:
              97,

            dependencies: [
              "product-engine-support-stack",
              "ue5-expression-scene-graph",
              "project-registry-conductor",
              "market-readiness-conductor"
            ],

            tags: [
              "3d-model",
              "adapter",
              "f34",
              "f55",
              "f89",
              "f144",
              "reusable",
              "model-agnostic"
            ],

            receiptReady:
              true,

            platformReady:
              true,

            engineeringReady:
              true,

            productReady:
              true,

            expressionReady:
              true,

            registryReady:
              false,

            marketReady:
              false,

            documentationReady:
              true,

            evidenceReady:
              true,

            riskBoundaryReady:
              true,

            internalOnly:
              true,

            publicReady:
              false,

            publicSuperiorityClaim:
              false,

            publicComparisonClaimAllowed:
              false,

            generatedImage:
              false,

            graphicBox:
              false,

            webGL:
              false,

            visualPassClaimed:
              false
          },

          {
            silent:
              options.silent ===
              true
          }
        );

      state.adapterF34Registered =
        true;

      state.adapterF34Product =
        clonePlain(
          product
        );

      recordEvent(
        "GENERIC_3D_MODEL_ADAPTER_REGISTERED_WITH_F34",
        {
          productId:
            product.id,

          status:
            product.status,

          readinessScore:
            product.readinessScore
        }
      );

      publishGlobals();

      return {
        registered:
          true,

        status:
          product.status ||
          STATUS.REGISTERED,

        product:
          clonePlain(
            product
          )
      };
    } catch (error) {
      recordError(
        "REGISTER_ADAPTER_WITH_F34_FAILED",
        error
      );

      return {
        registered:
          false,

        status:
          STATUS.ERROR,

        reason:
          "REGISTER_ADAPTER_WITH_F34_FAILED",

        error:
          error.message ||
          String(error)
      };
    }
  }

  function registerModelWithF34(modelId, options = {}) {
    const id =
      makeId(
        modelId,
        ""
      );

    const manifest =
      state.models.get(id);

    const validation =
      state.validations.get(id);

    if (!manifest) {
      return {
        registered:
          false,

        status:
          STATUS.BLOCKED,

        reason:
          "MODEL_NOT_FOUND",

        modelId:
          id
      };
    }

    if (
      !validation ||
      !validation.passed
    ) {
      return {
        registered:
          false,

        status:
          STATUS.BLOCKED,

        reason:
          "MODEL_MANIFEST_VALIDATION_FAILED",

        modelId:
          id,

        validation:
          clonePlain(
            validation
          )
      };
    }

    const adapterRegistration =
      registerAdapterWithF34({
        silent:
          true
      });

    const engineSet =
      getEngineAuthorities();

    const f34 =
      engineSet.authorities.f34;

    if (
      !f34 ||
      !isFunction(
        f34.registerProduct
      )
    ) {
      const held = {
        contract:
          CONTRACT,

        modelId:
          id,

        registered:
          false,

        status:
          STATUS.UNAVAILABLE,

        reason:
          "F34_REGISTER_PRODUCT_UNAVAILABLE",

        adapterRegistration,

        products:
          [],

        registeredAt:
          nowIso()
      };

      state.registrations.set(
        id,
        held
      );

      publishGlobals();

      return clonePlain(
        held
      );
    }

    const definitions =
      buildProductDefinitions(
        id
      );

    const registeredProducts = [];
    const failedProducts = [];

    for (
      const definition of
      definitions
    ) {
      try {
        const product =
          f34.registerProduct(
            definition,
            {
              silent:
                options.silent ===
                true
            }
          );

        registeredProducts.push(
          product
        );
      } catch (error) {
        failedProducts.push({
          productId:
            definition.id,

          message:
            error.message ||
            String(error)
        });

        recordError(
          "REGISTER_MODEL_COMPONENT_WITH_F34_FAILED",
          error,
          id
        );
      }
    }

    let graph = null;

    try {
      if (
        isFunction(
          f34.buildProductGraph
        )
      ) {
        graph =
          f34.buildProductGraph({
            silent:
              true
          });
      }
    } catch (error) {
      recordError(
        "BUILD_F34_PRODUCT_GRAPH_FAILED",
        error,
        id
      );
    }

    const registration = {
      contract:
        CONTRACT,

      modelId:
        id,

      registered:
        failedProducts.length ===
        0,

      status:
        failedProducts.length ===
        0
          ? STATUS.REGISTERED
          : registeredProducts.length
            ? STATUS.DEGRADED
            : STATUS.ERROR,

      adapterRegistration,

      productDefinitionCount:
        definitions.length,

      registeredProductCount:
        registeredProducts.length,

      failedProductCount:
        failedProducts.length,

      products:
        clonePlain(
          registeredProducts
        ),

      failures:
        clonePlain(
          failedProducts
        ),

      productGraph:
        clonePlain(
          graph
        ),

      registeredAt:
        nowIso(),

      publicSuperiorityClaim:
        false,

      visualPassClaimed:
        false
    };

    state.registrations.set(
      id,
      registration
    );

    recordEvent(
      "GENERIC_3D_MODEL_F34_REGISTRATION_COMPLETED",
      {
        modelId:
          id,

        status:
          registration.status,

        registeredProductCount:
          registration.registeredProductCount,

        failedProductCount:
          registration.failedProductCount
      }
    );

    publishGlobals();

    return clonePlain(
      registration
    );
  }

  function registerAllWithF34(options = {}) {
    const results = [];

    for (
      const manifest of
      state.models.values()
    ) {
      results.push(
        registerModelWithF34(
          manifest.id,
          options
        )
      );
    }

    return {
      contract:
        CONTRACT,

      modelCount:
        state.models.size,

      results,

      completedAt:
        nowIso()
    };
  }

  function getRegistration(modelId) {
    const id =
      makeId(
        modelId,
        ""
      );

    const registration =
      state.registrations.get(id);

    return registration
      ? clonePlain(
          registration
        )
      : null;
  }

  function composeModelPacket(modelId, extra = {}) {
    const id =
      makeId(
        modelId,
        ""
      );

    const manifest =
      state.models.get(id);

    if (!manifest) {
      return null;
    }

    const validation =
      state.validations.get(id);

    const evidence =
      state.evidence.get(id) ||
      createEmptyEvidence(id);

    const registration =
      state.registrations.get(id) ||
      null;

    const chainRun =
      state.chainRuns.get(id) ||
      null;

    return {
      contract:
        CONTRACT,

      receipt:
        RECEIPT,

      packetType:
        "GENERIC_3D_MODEL_ADAPTER_MODEL_PACKET",

      modelId:
        id,

      manifestHash:
        manifest.manifestHash,

      manifest:
        clonePlain(
          manifest
        ),

      validation:
        clonePlain(
          validation
        ),

      runtimeEvidence:
        clonePlain(
          evidence
        ),

      productDefinitions:
        buildProductDefinitions(
          id
        ),

      f34Registration:
        clonePlain(
          registration
        ),

      latestChainRun:
        clonePlain(
          chainRun
        ),

      engineSequence:
        ENGINE_SEQUENCE.slice(),

      engineFiles:
        clonePlain(
          ENGINE_FILES
        ),

      extra:
        clonePlain(
          extra
        ),

      publicSuperiorityClaim:
        false,

      publicComparisonClaimAllowed:
        false,

      benchmarkRequiredBeforePublicClaim:
        true,

      generatedImage:
        false,

      graphicBox:
        false,

      webGL:
        false,

      visualPassClaimed:
        false,

      composedAt:
        nowIso()
    };
  }

  function composeAdapterPacket(extra = {}) {
    const models =
      listModels();

    const validations = {};
    const evidence = {};
    const registrations = {};
    const chainRuns = {};

    for (
      const model of
      models
    ) {
      validations[model.id] =
        getValidation(
          model.id
        );

      evidence[model.id] =
        getEvidence(
          model.id
        );

      registrations[model.id] =
        getRegistration(
          model.id
        );

      chainRuns[model.id] =
        getChainRun(
          model.id
        );
    }

    const packet = {
      contract:
        CONTRACT,

      receipt:
        RECEIPT,

      packetType:
        "GENERIC_3D_MODEL_ADAPTER_PACKET",

      sourceFile:
        FILE,

      projectId:
        PROJECT_ID,

      modelCount:
        models.length,

      models,

      validations,

      evidence,

      registrations,

      chainRuns,

      engineSequence:
        ENGINE_SEQUENCE.slice(),

      engineFiles:
        clonePlain(
          ENGINE_FILES
        ),

      engineStatus:
        getEngineAuthorities().status,

      adapterF34Registered:
        state.adapterF34Registered,

      adapterF34Product:
        clonePlain(
          state.adapterF34Product
        ),

      extra:
        clonePlain(
          extra
        ),

      publicSuperiorityClaim:
        false,

      publicComparisonClaimAllowed:
        false,

      benchmarkRequiredBeforePublicClaim:
        true,

      generatedImage:
        false,

      graphicBox:
        false,

      webGL:
        false,

      visualPassClaimed:
        false,

      composedAt:
        nowIso()
    };

    packet.adapterHash =
      fnv1a(
        stableStringify({
          contract:
            packet.contract,

          modelCount:
            packet.modelCount,

          modelHashes:
            models.map(
              model =>
                model.manifestHash
            ),

          engineSequence:
            packet.engineSequence
        })
      );

    state.lastAdapterPacket =
      clonePlain(
        packet
      );

    return packet;
  }

  function invokeStep(
    target,
    method,
    args,
    failureReason
  ) {
    if (
      !target ||
      !isFunction(
        target[method]
      )
    ) {
      return {
        invoked:
          false,

        accepted:
          false,

        status:
          STATUS.UNAVAILABLE,

        reason:
          failureReason ||
          `${method.toUpperCase()}_UNAVAILABLE`
      };
    }

    try {
      const response =
        target[method](
          ...(
            Array.isArray(args)
              ? args
              : []
          )
        );

      const accepted =
        Boolean(
          !response ||
          (
            response.accepted !==
            false &&
            response.submitted !==
            false
          )
        );

      return {
        invoked:
          true,

        accepted,

        status:
          accepted
            ? STATUS.READY
            : STATUS.HELD,

        response:
          clonePlain(
            response
          )
      };
    } catch (error) {
      return {
        invoked:
          true,

        accepted:
          false,

        status:
          STATUS.ERROR,

        reason:
          failureReason ||
          `${method.toUpperCase()}_FAILED`,

        error:
          error.message ||
          String(error)
      };
    }
  }

  function runEngineChain(modelId, options = {}) {
    const id =
      makeId(
        modelId,
        ""
      );

    const manifest =
      state.models.get(id);

    const validation =
      state.validations.get(id);

    if (!manifest) {
      return {
        completed:
          false,

        status:
          STATUS.BLOCKED,

        reason:
          "MODEL_NOT_FOUND",

        modelId:
          id
      };
    }

    if (
      !validation ||
      !validation.passed
    ) {
      return {
        completed:
          false,

        status:
          STATUS.BLOCKED,

        reason:
          "MODEL_MANIFEST_VALIDATION_FAILED",

        modelId:
          id,

        validation:
          clonePlain(
            validation
          )
      };
    }

    if (
      options.collectRuntimeEvidence ===
      true
    ) {
      collectRuntimeEvidence(
        id,
        options.runtimeEvidence ||
        {}
      );
    }

    const registration =
      registerModelWithF34(
        id,
        {
          silent:
            true
        }
      );

    const engineSet =
      getEngineAuthorities();

    const {
      f34,
      f55,
      f89,
      f144
    } =
      engineSet.authorities;

    const run = {
      contract:
        CONTRACT,

      receipt:
        RECEIPT,

      packetType:
        "GENERIC_3D_MODEL_ENGINE_CHAIN_RUN",

      runId:
        `${id}-${Date.now()}`,

      modelId:
        id,

      manifestHash:
        manifest.manifestHash,

      startedAt:
        nowIso(),

      completedAt:
        null,

      engineStatus:
        clonePlain(
          engineSet.status
        ),

      registration:
        clonePlain(
          registration
        ),

      steps:
        {},

      packets:
        {},

      completed:
        false,

      status:
        STATUS.HELD,

      firstFailedStage:
        null,

      recommendedNextFile:
        null,

      northSubmissionRequested:
        options.submitToNorth ===
        true,

      northSubmissionPerformed:
        false,

      publicSuperiorityClaim:
        false,

      visualPassClaimed:
        false
    };

    if (
      !registration.registered &&
      registration.status !==
      STATUS.DEGRADED
    ) {
      run.firstFailedStage =
        "F34_REGISTRATION";

      run.recommendedNextFile =
        ENGINE_FILES.f34;

      run.status =
        registration.status ||
        STATUS.HELD;

      run.completedAt =
        nowIso();

      state.chainRuns.set(
        id,
        run
      );

      publishGlobals();

      return clonePlain(
        run
      );
    }

    if (
      !f34 ||
      !isFunction(
        f34.composeF34ReleasePacket
      )
    ) {
      run.firstFailedStage =
        "F34_PRODUCT";

      run.recommendedNextFile =
        ENGINE_FILES.f34;

      run.status =
        STATUS.UNAVAILABLE;

      run.completedAt =
        nowIso();

      state.chainRuns.set(
        id,
        run
      );

      publishGlobals();

      return clonePlain(
        run
      );
    }

    const modelPacket =
      composeModelPacket(
        id,
        {
          chainRunId:
            run.runId
        }
      );

    try {
      if (
        isFunction(
          f34.buildProductGraph
        )
      ) {
        run.steps.f34Build =
          invokeStep(
            f34,
            "buildProductGraph",
            [
              {
                silent:
                  true
              }
            ],
            "F34_PRODUCT_GRAPH_BUILD_FAILED"
          );
      }

      run.packets.f34 =
        clonePlain(
          f34.composeF34ReleasePacket({
            adapterContract:
              CONTRACT,

            adapterReceipt:
              RECEIPT,

            modelPacket
          })
        );

      run.steps.f34ToF55 =
        f55
          ? invokeStep(
              f55,
              "acceptF34Release",
              [
                run.packets.f34
              ],
              "F55_ACCEPT_F34_RELEASE_FAILED"
            )
          : invokeStep(
              f34,
              "submitF34ReleaseToUE5Expression",
              [
                {
                  adapterContract:
                    CONTRACT,

                  modelPacket
                }
              ],
              "F34_SUBMIT_TO_F55_FAILED"
            );

      if (
        !run.steps.f34ToF55.accepted
      ) {
        run.firstFailedStage =
          "F55_EXPRESSION";

        run.recommendedNextFile =
          ENGINE_FILES.f55;

        run.status =
          run.steps.f34ToF55.status;

        throw new Error(
          run.steps.f34ToF55.reason ||
          "F55 expression handoff held"
        );
      }

      if (
        !f55 ||
        !isFunction(
          f55.composeF55ReleasePacket
        )
      ) {
        run.firstFailedStage =
          "F55_EXPRESSION";

        run.recommendedNextFile =
          ENGINE_FILES.f55;

        run.status =
          STATUS.UNAVAILABLE;

        throw new Error(
          "F55 expression authority unavailable"
        );
      }

      if (
        isFunction(
          f55.buildSceneGraph
        )
      ) {
        run.steps.f55Build =
          invokeStep(
            f55,
            "buildSceneGraph",
            [
              run.packets.f34,
              {
                silent:
                  true
              }
            ],
            "F55_SCENE_GRAPH_BUILD_FAILED"
          );
      }

      run.packets.f55 =
        clonePlain(
          f55.composeF55ReleasePacket({
            adapterContract:
              CONTRACT,

            modelPacket
          })
        );

      run.steps.f55ToF89 =
        f89
          ? invokeStep(
              f89,
              "acceptF55ExpressionRelease",
              [
                run.packets.f55
              ],
              "F89_ACCEPT_F55_RELEASE_FAILED"
            )
          : invokeStep(
              f55,
              "submitF55ReleaseToRegistry",
              [
                {
                  adapterContract:
                    CONTRACT,

                  modelPacket
                }
              ],
              "F55_SUBMIT_TO_F89_FAILED"
            );

      if (
        !run.steps.f55ToF89.accepted
      ) {
        run.firstFailedStage =
          "F89_REGISTRY";

        run.recommendedNextFile =
          ENGINE_FILES.f89;

        run.status =
          run.steps.f55ToF89.status;

        throw new Error(
          run.steps.f55ToF89.reason ||
          "F89 registry handoff held"
        );
      }

      if (
        !f89 ||
        !isFunction(
          f89.composeF89ReleasePacket
        )
      ) {
        run.firstFailedStage =
          "F89_REGISTRY";

        run.recommendedNextFile =
          ENGINE_FILES.f89;

        run.status =
          STATUS.UNAVAILABLE;

        throw new Error(
          "F89 registry authority unavailable"
        );
      }

      if (
        isFunction(
          f89.buildRegistryGraph
        )
      ) {
        run.steps.f89Build =
          invokeStep(
            f89,
            "buildRegistryGraph",
            [
              run.packets.f55,
              {
                silent:
                  true
              }
            ],
            "F89_REGISTRY_GRAPH_BUILD_FAILED"
          );
      }

      run.packets.f89 =
        clonePlain(
          f89.composeF89ReleasePacket({
            adapterContract:
              CONTRACT,

            modelPacket
          })
        );

      run.steps.f89ToF144 =
        f144
          ? invokeStep(
              f144,
              "acceptF89RegistryRelease",
              [
                run.packets.f89
              ],
              "F144_ACCEPT_F89_RELEASE_FAILED"
            )
          : invokeStep(
              f89,
              "submitF89ReleaseToMarket",
              [
                {
                  adapterContract:
                    CONTRACT,

                  modelPacket
                }
              ],
              "F89_SUBMIT_TO_F144_FAILED"
            );

      if (
        !run.steps.f89ToF144.accepted
      ) {
        run.firstFailedStage =
          "F144_MARKET";

        run.recommendedNextFile =
          ENGINE_FILES.f144;

        run.status =
          run.steps.f89ToF144.status;

        throw new Error(
          run.steps.f89ToF144.reason ||
          "F144 market handoff held"
        );
      }

      if (
        !f144 ||
        !isFunction(
          f144.composeF233DownstreamReturnPacket
        )
      ) {
        run.firstFailedStage =
          "F144_MARKET";

        run.recommendedNextFile =
          ENGINE_FILES.f144;

        run.status =
          STATUS.UNAVAILABLE;

        throw new Error(
          "F144 market authority unavailable"
        );
      }

      if (
        isFunction(
          f144.buildMarketReadiness
        )
      ) {
        run.steps.f144Build =
          invokeStep(
            f144,
            "buildMarketReadiness",
            [
              run.packets.f89,
              {
                silent:
                  true
              }
            ],
            "F144_MARKET_READINESS_BUILD_FAILED"
          );
      }

      if (
        isFunction(
          f144.composeF144MarketReadinessPacket
        )
      ) {
        run.packets.f144 =
          clonePlain(
            f144.composeF144MarketReadinessPacket({
              adapterContract:
                CONTRACT,

              modelPacket
            })
          );
      }

      run.packets.f233 =
        clonePlain(
          f144.composeF233DownstreamReturnPacket({
            adapterContract:
              CONTRACT,

            modelPacket
          })
        );

      if (
        options.submitToNorth ===
        true
      ) {
        if (
          isFunction(
            f144.submitF233ReturnToNorth
          )
        ) {
          run.steps.f233ToNorth =
            invokeStep(
              f144,
              "submitF233ReturnToNorth",
              [
                {
                  adapterContract:
                    CONTRACT,

                  modelPacket
                }
              ],
              "F233_RETURN_TO_NORTH_FAILED"
            );
        } else if (
          isFunction(
            f144.submitF144PacketToNorth
          )
        ) {
          run.steps.f233ToNorth =
            invokeStep(
              f144,
              "submitF144PacketToNorth",
              [
                {
                  adapterContract:
                    CONTRACT,

                  modelPacket
                }
              ],
              "F144_PACKET_TO_NORTH_FAILED"
            );
        } else {
          run.steps.f233ToNorth = {
            invoked:
              false,

            accepted:
              false,

            status:
              STATUS.UNAVAILABLE,

            reason:
              "NORTH_SUBMISSION_METHOD_UNAVAILABLE"
          };
        }

        run.northSubmissionPerformed =
          Boolean(
            run.steps.f233ToNorth &&
            run.steps.f233ToNorth.invoked
          );
      }

      run.completed =
        true;

      run.status =
        STATUS.READY;

      run.firstFailedStage =
        null;

      run.recommendedNextFile =
        options.submitToNorth ===
        true
          ? null
          : "NORTH_RUNTIME_OPTIONAL_SUBMISSION_HELD";
    } catch (error) {
      if (!run.firstFailedStage) {
        run.firstFailedStage =
          "ENGINE_CHAIN";

        run.status =
          STATUS.ERROR;
      }

      run.error =
        error.message ||
        String(error);

      recordError(
        "RUN_GENERIC_3D_MODEL_ENGINE_CHAIN_FAILED",
        error,
        id
      );
    }

    run.completedAt =
      nowIso();

    state.chainRuns.set(
      id,
      run
    );

    recordEvent(
      "GENERIC_3D_MODEL_ENGINE_CHAIN_COMPLETED",
      {
        modelId:
          id,

        runId:
          run.runId,

        completed:
          run.completed,

        status:
          run.status,

        firstFailedStage:
          run.firstFailedStage,

        recommendedNextFile:
          run.recommendedNextFile
      }
    );

    publishGlobals();

    return clonePlain(
      run
    );
  }

  function runAllEngineChains(options = {}) {
    const results = [];

    for (
      const manifest of
      state.models.values()
    ) {
      results.push(
        runEngineChain(
          manifest.id,
          options
        )
      );
    }

    return {
      contract:
        CONTRACT,

      modelCount:
        state.models.size,

      completedCount:
        results.filter(
          result =>
            result.completed
        ).length,

      results,

      completedAt:
        nowIso()
    };
  }

  function getChainRun(modelId) {
    const id =
      makeId(
        modelId,
        ""
      );

    const run =
      state.chainRuns.get(id);

    return run
      ? clonePlain(
          run
        )
      : null;
  }

  function getStatus() {
    const engineSet =
      getEngineAuthorities();

    const models =
      listModels();

    const validModelCount =
      models.filter(
        model => {
          const validation =
            state.validations.get(
              model.id
            );

          return Boolean(
            validation &&
            validation.passed
          );
        }
      ).length;

    const registeredModelCount =
      models.filter(
        model => {
          const registration =
            state.registrations.get(
              model.id
            );

          return Boolean(
            registration &&
            (
              registration.registered ||
              registration.status ===
              STATUS.DEGRADED
            )
          );
        }
      ).length;

    const completedChainCount =
      models.filter(
        model => {
          const run =
            state.chainRuns.get(
              model.id
            );

          return Boolean(
            run &&
            run.completed
          );
        }
      ).length;

    return {
      contract:
        CONTRACT,

      receipt:
        RECEIPT,

      version:
        VERSION,

      file:
        FILE,

      projectId:
        PROJECT_ID,

      createdAt:
        state.createdAt,

      updatedAt:
        state.updatedAt ||
        state.createdAt,

      modelCount:
        models.length,

      validModelCount,

      invalidModelCount:
        models.length -
        validModelCount,

      registeredModelCount,

      completedChainCount,

      adapterF34Registered:
        state.adapterF34Registered,

      canonicalDiamondSeeded:
        state.canonicalDiamondSeeded,

      engineStatus:
        clonePlain(
          engineSet.status
        ),

      engineSequence:
        ENGINE_SEQUENCE.slice(),

      errorCount:
        state.errors.length,

      eventCount:
        state.events.length,

      publicSuperiorityClaim:
        false,

      publicComparisonClaimAllowed:
        false,

      benchmarkRequiredBeforePublicClaim:
        true,

      generatedImage:
        false,

      graphicBox:
        false,

      webGL:
        false,

      visualPassClaimed:
        false
    };
  }

  function getReceiptLight() {
    const status =
      getStatus();

    return {
      contract:
        CONTRACT,

      receipt:
        RECEIPT,

      version:
        VERSION,

      file:
        FILE,

      status:
        status.errorCount > 0
          ? STATUS.DEGRADED
          : (
              status.validModelCount ===
              status.modelCount &&
              status.modelCount >
              0
            )
            ? STATUS.READY
            : STATUS.HELD,

      modelCount:
        status.modelCount,

      validModelCount:
        status.validModelCount,

      registeredModelCount:
        status.registeredModelCount,

      completedChainCount:
        status.completedChainCount,

      adapterF34Registered:
        status.adapterF34Registered,

      engineStackComplete:
        status.engineStatus.complete,

      publicSuperiorityClaim:
        false,

      visualPassClaimed:
        false
    };
  }

  function getReceipt() {
    const receipt = {
      ...getReceiptLight(),

      statusDetail:
        getStatus(),

      models:
        listModels(),

      validations:
        Object.fromEntries(
          Array.from(
            state.validations.entries()
          ).map(
            ([id, value]) => [
              id,
              clonePlain(value)
            ]
          )
        ),

      evidence:
        Object.fromEntries(
          Array.from(
            state.evidence.entries()
          ).map(
            ([id, value]) => [
              id,
              clonePlain(value)
            ]
          )
        ),

      registrations:
        Object.fromEntries(
          Array.from(
            state.registrations.entries()
          ).map(
            ([id, value]) => [
              id,
              clonePlain(value)
            ]
          )
        ),

      chainRuns:
        Object.fromEntries(
          Array.from(
            state.chainRuns.entries()
          ).map(
            ([id, value]) => [
              id,
              clonePlain(value)
            ]
          )
        ),

      errors:
        state.errors.map(
          clonePlain
        ),

      recentEvents:
        state.events
          .slice(-32)
          .map(
            clonePlain
          ),

      composedAt:
        nowIso()
    };

    state.lastReceipt =
      clonePlain(
        receipt
      );

    return receipt;
  }

  function getReceiptText() {
    return JSON.stringify(
      getReceipt(),
      null,
      2
    );
  }

  function updateDataset() {
    const status =
      getStatus();

    setDataset(
      "generic3DModelAdapterContract",
      CONTRACT
    );

    setDataset(
      "generic3DModelAdapterReceipt",
      RECEIPT
    );

    setDataset(
      "generic3DModelAdapterActive",
      "true"
    );

    setDataset(
      "generic3DModelAdapterModelCount",
      status.modelCount
    );

    setDataset(
      "generic3DModelAdapterValidModelCount",
      status.validModelCount
    );

    setDataset(
      "generic3DModelAdapterRegisteredModelCount",
      status.registeredModelCount
    );

    setDataset(
      "generic3DModelAdapterCompletedChainCount",
      status.completedChainCount
    );

    setDataset(
      "generic3DModelAdapterF34Available",
      status.engineStatus.f34.available
    );

    setDataset(
      "generic3DModelAdapterF55Available",
      status.engineStatus.f55.available
    );

    setDataset(
      "generic3DModelAdapterF89Available",
      status.engineStatus.f89.available
    );

    setDataset(
      "generic3DModelAdapterF144Available",
      status.engineStatus.f144.available
    );

    setDataset(
      "generic3DModelAdapterEngineStackComplete",
      status.engineStatus.complete
    );

    setDataset(
      "generic3DModelAdapterPublicSuperiorityClaim",
      "false"
    );

    setDataset(
      "generic3DModelAdapterVisualPassClaimed",
      "false"
    );

    setDataset(
      "generatedImage",
      "false"
    );

    setDataset(
      "graphicBox",
      "false"
    );
  }

  function publishGlobals() {
    root.DEXTER_LAB =
      root.DEXTER_LAB ||
      {};

    root.HEARTH =
      root.HEARTH ||
      {};

    root.LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER =
      api;

    root.LAB_PRODUCT_ENGINE_GENERIC_3D_MODEL_ADAPTER =
      api;

    root.PRODUCT_ENGINE_3D_MODEL_ADAPTER =
      api;

    root.GENERIC_3D_MODEL_ADAPTER =
      api;

    root.DGB_3D_MODEL_ADAPTER =
      api;

    root.DEXTER_LAB.productEngine3DModelAdapter =
      api;

    root.DEXTER_LAB.generic3DModelAdapter =
      api;

    root.HEARTH.productEngine3DModelAdapter =
      api;

    root.HEARTH.generic3DModelAdapter =
      api;

    const light =
      getReceiptLight();

    root.LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER_RECEIPT =
      light;

    root.LAB_PRODUCT_ENGINE_GENERIC_3D_MODEL_ADAPTER_RECEIPT =
      light;

    root.PRODUCT_ENGINE_3D_MODEL_ADAPTER_RECEIPT =
      light;

    root.GENERIC_3D_MODEL_ADAPTER_RECEIPT =
      light;

    root.DEXTER_LAB.productEngine3DModelAdapterReceipt =
      light;

    root.HEARTH.productEngine3DModelAdapterReceipt =
      light;

    root.__LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER_LOADED__ =
      true;

    root.__LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER_CONTRACT__ =
      CONTRACT;

    root.__LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER_RECEIPT__ =
      RECEIPT;

    root.__LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER_MODEL_AGNOSTIC__ =
      true;

    root.__LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER_WEBGL__ =
      false;

    root.__LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER_PUBLIC_SUPERIORITY_CLAIM__ =
      false;

    root.__LAB_PRODUCT_ENGINE_3D_MODEL_ADAPTER_VISUAL_PASS_CLAIMED__ =
      false;

    updateDataset();

    dispatch(
      "generic-3d-model-adapter-state",
      light
    );

    return light;
  }

  const SHOWROOM_DIAMOND_G3_MANIFEST =
    Object.freeze({
      id:
        "showroom-diamond-g3",

      projectId:
        PROJECT_ID,

      name:
        "G3 Diamond Gate Bridge Computational Gem",

      label:
        "Showroom Diamond G3",

      description:
        "A purpose-built three-dimensional computational gem with a gold crown, cyan-white bridge girdle, sapphire pavilion, and internal 16 by 16 lattice.",

      purpose:
        "Serve as the interactive object at the Door to Mirrorland and the first canonical model registered through the generic 3D model adapter.",

      route:
        "/showroom/",

      generation:
        "G3",

      modelClass:
        "computational-gem",

      coordinateSystem:
        "right-handed-y-up",

      units:
        "normalized-world-units",

      constructionReady:
        true,

      tags: [
        "showroom",
        "diamond",
        "mirrorland-door",
        "16-radial",
        "16-band",
        "256-seat",
        "native-webgl",
        "object-view",
        "lattice-view"
      ],

      files: {
        geometry: {
          id:
            "showroom-diamond-g3-geometry-authority",

          name:
            "Showroom Diamond G3 Geometry Authority",

          file:
            "/showroom/index.diamond.geometry.js",

          route:
            "/showroom/",

          contract:
            "SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1",

          receipt:
            "SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_RECEIPT_v1",

          productType:
            "product-framework",

          priority:
            100,

          constructionReady:
            true,

          runtime: {
            globals: [
              "DGBShowroomDiamondGeometryG3"
            ],

            receiptGlobals:
              [],

            readyFields: [
              "passed",
              "ready",
              "geometryAuthority"
            ]
          },

          tags: [
            "geometry-authority",
            "deterministic-geometry",
            "512-triangles",
            "800-lattice-edges"
          ]
        },

        renderer: {
          id:
            "showroom-diamond-g3-native-webgl-renderer",

          name:
            "Showroom Diamond G3 Native WebGL Renderer",

          file:
            "/showroom/index.diamond.js",

          route:
            "/showroom/",

          contract:
            "SHOWROOM_DIAMOND_G3_NATIVE_WEBGL_OBJECT_LATTICE_RENDERER_TNT_v1",

          receipt:
            "SHOWROOM_DIAMOND_G3_NATIVE_WEBGL_OBJECT_LATTICE_RENDERER_RECEIPT_v1",

          productType:
            "canvas-expression",

          priority:
            98,

          constructionReady:
            true,

          dependencies: [
            "geometry"
          ],

          runtime: {
            globals: [
              "DGBShowroomDiamondG3",
              "DGBShowroomDiamondG2"
            ],

            receiptGlobals: [
              "SHOWROOM_DIAMOND_G3_RENDERER_RECEIPT"
            ],

            readyFields: [
              "ready",
              "initialized",
              "webglReady",
              "geometryReady"
            ]
          },

          tags: [
            "renderer",
            "native-webgl",
            "object-view",
            "lattice-view",
            "facet-picking"
          ]
        },

        ui: {
          id:
            "showroom-diamond-g3-ui-controller",

          name:
            "Showroom Diamond G3 UI Controller",

          file:
            "/showroom/index.ui.js",

          route:
            "/showroom/",

          contract:
            "SHOWROOM_DIAMOND_G3_OBJECT_LATTICE_UI_CONTROLLER_TNT_v1",

          receipt:
            "SHOWROOM_DIAMOND_G3_OBJECT_LATTICE_UI_CONTROLLER_RECEIPT_v1",

          productType:
            "support-engine",

          priority:
            94,

          constructionReady:
            true,

          dependencies: [
            "renderer"
          ],

          runtime: {
            globals: [
              "DGBShowroomDiamondUIG3"
            ],

            receiptGlobals: [
              "SHOWROOM_DIAMOND_G3_UI_RECEIPT"
            ],

            readyFields: [
              "rendererReady",
              "initialized",
              "ready"
            ]
          },

          tags: [
            "ui-controller",
            "accessibility",
            "keyboard-controls",
            "object-lattice-controls"
          ]
        },

        shell: {
          id:
            "showroom-diamond-g3-route-shell",

          name:
            "Showroom Diamond G3 Route Shell",

          file:
            "/showroom/index.html",

          route:
            "/showroom/",

          contract:
            "SHOWROOM_DIAMOND_G3_TRUE_3D_OBJECT_LATTICE_HTML_TNT_v1",

          receipt:
            "SHOWROOM_DIAMOND_G3_TRUE_3D_OBJECT_LATTICE_HTML_RECEIPT_v1",

          productType:
            "product-framework",

          priority:
            96,

          constructionReady:
            true,

          dependencies: [
            "geometry",
            "renderer",
            "ui"
          ],

          runtime: {
            globals:
              [],

            receiptGlobals:
              [],

            readyFields:
              []
          },

          tags: [
            "route-shell",
            "mirrorland-door",
            "map-portal-context",
            "webgl-stage"
          ]
        }
      },

      metrics: {
        vertexCount:
          1536,

        triangleCount:
          512,

        nodeCount:
          256,

        edgeCount:
          800,

        materialCount:
          14,

        animationCount:
          0,

        radialCount:
          16,

        bandCount:
          16,

        seatCount:
          256,

        textureCount:
          0,

        bounds: {
          minimum: [
            -1.06,
            -1.145,
            -1.06
          ],

          maximum: [
            1.06,
            0.74,
            1.06
          ],

          center: [
            0,
            -0.2025,
            0
          ],

          radius:
            1.50
        }
      },

      capabilities: {
        nativeWebGL:
          true,

        webGL2Optional:
          true,

        canvasFallback:
          false,

        staticFallback:
          true,

        objectView:
          true,

        latticeView:
          true,

        dragRotation:
          true,

        touchRotation:
          true,

        pinchZoom:
          true,

        wheelZoom:
          true,

        facetPicking:
          true,

        nodePicking:
          false,

        keyboardControls:
          true,

        reducedMotion:
          true,

        contextLossRecovery:
          true,

        responsive:
          true,

        deterministicGeometry:
          true,

        external3DLibrary:
          false
      },

      materials: [
        "CHAMPAGNE_TABLE",
        "GOLD_CROWN_LIGHT",
        "GOLD_CROWN",
        "DEEP_GOLD_CROWN",
        "BRIDGE_GIRDLE",
        "BRIDGE_GIRDLE_EMISSIVE",
        "SAPPHIRE_LIGHT",
        "SAPPHIRE",
        "COBALT",
        "MIDNIGHT_SAPPHIRE",
        "CULET",
        "INTERNAL_LATTICE_GOLD",
        "INTERNAL_LATTICE_CYAN",
        "ACTIVE_FACET"
      ],

      cameras: [
        {
          id:
            "showroom-diamond-g3-primary-camera",

          fieldOfViewDegrees:
            32,

          distanceMinimum:
            2.75,

          distanceMaximum:
            5.40,

          target: [
            0,
            -0.12,
            0
          ]
        }
      ],

      lights: [
        "warm-key",
        "cool-fill",
        "rear-rim",
        "camera-fill",
        "girdle-emission"
      ],

      modes: [
        {
          id:
            "object",

          public:
            true,

          shellOpacity: [
            0.94,
            1.0
          ],

          latticeVisible:
            false
        },

        {
          id:
            "lattice",

          public:
            true,

          shellOpacity: [
            0.18,
            0.30
          ],

          latticeVisible:
            true
        },

        {
          id:
            "full-proof",

          public:
            false,

          latticeVisible:
            true
        }
      ],

      interactions: [
        "drag-rotate",
        "touch-rotate",
        "pinch-zoom",
        "wheel-zoom",
        "idle-rotation",
        "reset",
        "facet-inspection"
      ],

      readiness: {
        receiptReady:
          true,

        platformReady:
          true,

        engineeringReady:
          true,

        productReady:
          true,

        expressionReady:
          true,

        registryReady:
          false,

        marketReady:
          false,

        documentationReady:
          true,

        evidenceReady:
          false,

        riskBoundaryReady:
          true,

        publicReady:
          false,

        finalVisualPassClaimed:
          false,

        benchmarkComplete:
          false
      },

      evidenceRequirements: [
        "geometry-validation",
        "512-surface-triangle-validation",
        "256-seat-validation",
        "800-lattice-edge-validation",
        "native-webgl-initialization",
        "object-view-validation",
        "lattice-view-validation",
        "pointer-touch-zoom-validation",
        "context-loss-fallback-validation",
        "mobile-layout-validation",
        "desktop-layout-validation",
        "visual-review"
      ],

      riskBoundaries: [
        "no-public-superiority-claim-without-benchmark",
        "no-final-visual-pass-claim-before-live-review",
        "no-market-ready-claim-before-f144-evidence",
        "no-runtime-ready-claim-before-route-test",
        "adapter-does-not-own-rendering"
      ]
    });

  function seedCanonicalModels(options = {}) {
    if (
      !state.models.has(
        "showroom-diamond-g3"
      )
    ) {
      registerModel(
        SHOWROOM_DIAMOND_G3_MANIFEST,
        {
          registerWithF34:
            false
        }
      );
    }

    state.canonicalDiamondSeeded =
      true;

    if (
      options.registerWithF34 ===
      true
    ) {
      return registerModelWithF34(
        "showroom-diamond-g3",
        {
          silent:
            true
        }
      );
    }

    publishGlobals();

    return {
      seeded:
        true,

      modelId:
        "showroom-diamond-g3",

      registeredWithF34:
        false
    };
  }

  function attemptAutomaticF34Registration(attempt = 0) {
    state.autoRegistrationAttempts =
      attempt;

    if (
      state.adapterF34Registered
    ) {
      return;
    }

    const engines =
      getEngineAuthorities();

    if (
      engines.authorities.f34 &&
      isFunction(
        engines.authorities.f34.registerProduct
      )
    ) {
      registerAdapterWithF34({
        silent:
          true
      });

      registerModelWithF34(
        "showroom-diamond-g3",
        {
          silent:
            true
        }
      );

      return;
    }

    if (
      attempt >= 60 ||
      !isFunction(
        root.setTimeout
      )
    ) {
      publishGlobals();
      return;
    }

    root.setTimeout(
      () =>
        attemptAutomaticF34Registration(
          attempt + 1
        ),
      100
    );
  }

  const api = {
    contract:
      CONTRACT,

    receipt:
      RECEIPT,

    version:
      VERSION,

    file:
      FILE,

    projectId:
      PROJECT_ID,

    ENGINE_FILES,

    ENGINE_SEQUENCE,

    COMPONENT_ROLES,

    MODEL_CLASSES,

    STATUS,

    normalizeManifest,

    validateManifest,

    registerModel,

    unregisterModel,

    getModel,

    listModels,

    getValidation,

    collectRuntimeEvidence,

    getEvidence,

    buildProductDefinitions,

    getEngineAuthorities,

    registerAdapterWithF34,

    registerModelWithF34,

    registerAllWithF34,

    getRegistration,

    composeModelPacket,

    composeAdapterPacket,

    runEngineChain,

    runAllEngineChains,

    getChainRun,

    seedCanonicalModels,

    getStatus,

    status:
      getStatus,

    getReceiptLight,

    getReceipt,

    getReceiptText,

    publishGlobals,

    updateDataset,

    modelAgnostic:
      true,

    reusableAcross3DModels:
      true,

    showroomDiamondFirstCanonicalModel:
      true,

    ownsManifestNormalization:
      true,

    ownsManifestValidation:
      true,

    ownsF34ProductPreparation:
      true,

    ownsEngineChainOrchestration:
      true,

    ownsIntegrationReceipts:
      true,

    ownsModelSpecificGeometry:
      false,

    ownsRendering:
      false,

    ownsWebGL:
      false,

    ownsCanvas:
      false,

    ownsShaders:
      false,

    ownsGPUResources:
      false,

    ownsPublicUI:
      false,

    ownsRouteShells:
      false,

    ownsF34Authority:
      false,

    ownsF55Authority:
      false,

    ownsF89Authority:
      false,

    ownsF144Authority:
      false,

    ownsNorthLatch:
      false,

    ownsMarketJudgment:
      false,

    ownsFinalVisualPassClaim:
      false,

    ownsPublicSuperiorityClaim:
      false,

    publicSuperiorityClaim:
      false,

    publicComparisonClaimAllowed:
      false,

    benchmarkRequiredBeforePublicClaim:
      true,

    generatedImage:
      false,

    graphicBox:
      false,

    webGL:
      false,

    visualPassClaimed:
      false,

    SHOWROOM_DIAMOND_G3_MANIFEST,

    get state() {
      return state;
    }
  };

  state.updatedAt =
    state.createdAt;

  seedCanonicalModels({
    registerWithF34:
      false
  });

  recordEvent(
    "GENERIC_3D_MODEL_ADAPTER_LOADED",
    {
      file:
        FILE,

      contract:
        CONTRACT,

      modelAgnostic:
        true,

      canonicalModel:
        "showroom-diamond-g3",

      engineSequence:
        ENGINE_SEQUENCE
    }
  );

  publishGlobals();

  attemptAutomaticF34Registration(
    0
  );

  if (
    typeof module !==
    "undefined" &&
    module.exports
  ) {
    module.exports =
      api;
  }
})(
  typeof window !==
  "undefined"
    ? window
    : globalThis,

  typeof document !==
  "undefined"
    ? document
    : null
);
