// /assets/engine/dgb.engine.contract.js
// DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1
// New-file construction.
//
// Purpose:
// - Define the machine-readable contract for the shared DGB Interactive Runtime Engine.
// - Define DGB_MODEL_PACKAGE_v1, N.E.W.S. alignment, Fibonacci gates,
//   SPEC, OPS, comparison, receipt, model, mesh, render-pass, fallback,
//   ownership, lifecycle, and validation contracts.
// - Prevent declaration-only readiness and model-specific renderer ownership.
//
// Owns:
// - schemas, enums, normalization, structural validation, comparison,
//   deterministic hashing, authority receipts, and contract helpers.
//
// Does not own:
// - DOM, Canvas, WebGL, WebGPU, shaders, GPU buffers, rendering, input,
//   route integration, model-specific geometry, Hearth verdicts, or North verdicts.

(function installDGBEngineContract(root) {
  "use strict";

  const CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  const HYBRID_AUTHORITY =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_HYBRID_AUTHORITY_TNT_v1";

  const FILE =
    "/assets/engine/dgb.engine.contract.js";

  const VERSION =
    "1.0.0";

  const SCHEMA =
    Object.freeze({
      MODEL:
        "DGB_MODEL_PACKAGE_v1",

      SPEC:
        "DGB_ENGINE_SPEC_v1",

      OPS:
        "DGB_ENGINE_OPS_v1",

      COMPARISON:
        "DGB_SPEC_OPS_COMPARISON_v1",

      RECEIPT:
        "DGB_ENGINE_RECEIPT_v1",

      INSTANCE_SPEC:
        "DGB_ENGINE_INSTANCE_SPEC_v1"
    });

  function makeEnum(values) {
    return Object.freeze(
      values.reduce(
        (
          output,
          value
        ) => {
          output[value] =
            value;

          return output;
        },
        Object.create(null)
      )
    );
  }

  const ENUM =
    Object.freeze({
      NEWS_SOURCE_STATUS:
        makeEnum([
          "CURRENT",
          "LEGACY",
          "SUPERSEDED",
          "CONFLICTING",
          "UNKNOWN"
        ]),

      NEWS_ALIGNMENT_STATUS:
        makeEnum([
          "ALIGNED",
          "PARTIAL",
          "CONFLICT",
          "HOLD",
          "UNKNOWN"
        ]),

      NEWS_AUTHORITY_CLASS:
        makeEnum([
          "CANONICAL",
          "GOVERNING",
          "SUPPORTING",
          "REFERENCE",
          "LEGACY",
          "UNKNOWN"
        ]),

      NEWS_DISPOSITION:
        makeEnum([
          "PRESERVE",
          "RENEW",
          "EXTRACT",
          "RETIRE",
          "HOLD"
        ]),

      INSTANCE_STATE:
        makeEnum([
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
          "ERROR",
          "DESTROYED"
        ]),

      COMPARISON_STATUS:
        makeEnum([
          "PASS",
          "PARTIAL_PASS",
          "HOLD",
          "FAIL",
          "CONFLICT",
          "DEGRADED",
          "UNVERIFIED"
        ]),

      BACKEND:
        makeEnum([
          "WEBGPU",
          "WEBGL2",
          "CANVAS2D",
          "SVG",
          "HTML",
          "NONE"
        ]),

      PRIMITIVE:
        makeEnum([
          "TRIANGLES",
          "LINES",
          "POINTS"
        ]),

      INDEX_FORMAT:
        makeEnum([
          "UINT16",
          "UINT32",
          "NONE"
        ]),

      BUFFER_USAGE:
        makeEnum([
          "STATIC",
          "DYNAMIC",
          "STREAM"
        ]),

      BUFFER_CUSTODY:
        makeEnum([
          "BORROWED_READ_ONLY",
          "COPIED_BY_ENGINE",
          "TRANSFERRED_TO_ENGINE"
        ]),

      ATTRIBUTE_COMPONENT_TYPE:
        makeEnum([
          "FLOAT32",
          "UINT8",
          "INT8",
          "UINT16",
          "INT16",
          "UINT32",
          "INT32"
        ]),

      BLEND_MODE:
        makeEnum([
          "OPAQUE",
          "ALPHA",
          "ADDITIVE",
          "PREMULTIPLIED_ALPHA",
          "MULTIPLY",
          "CUSTOM"
        ]),

      CULL_MODE:
        makeEnum([
          "NONE",
          "BACK",
          "FRONT"
        ]),

      FRONT_FACE:
        makeEnum([
          "CCW",
          "CW"
        ]),

      DEPTH_COMPARE:
        makeEnum([
          "NEVER",
          "LESS",
          "LEQUAL",
          "EQUAL",
          "GEQUAL",
          "GREATER",
          "NOTEQUAL",
          "ALWAYS"
        ]),

      FALLBACK_TYPE:
        makeEnum([
          "CANVAS2D",
          "SVG",
          "HTML",
          "NONE"
        ]),

      INTERACTION_MODE:
        makeEnum([
          "NONE",
          "DIRECT",
          "EXTERNAL_DOM",
          "HYBRID"
        ]),

      ANIMATION_MODE:
        makeEnum([
          "NONE",
          "AXIS_ROTATION",
          "ORBIT",
          "TIMELINE",
          "CUSTOM"
        ]),

      MODEL_CLASS:
        makeEnum([
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
        ])
    });

  const FIBONACCI_GATE =
    Object.freeze({
      F13:
        13,

      F21:
        21,

      F34:
        34,

      F55:
        55,

      F89:
        89,

      F144:
        144,

      F233:
        233
    });

  const FIBONACCI_SEQUENCE =
    Object.freeze([
      FIBONACCI_GATE.F13,
      FIBONACCI_GATE.F21,
      FIBONACCI_GATE.F34,
      FIBONACCI_GATE.F55,
      FIBONACCI_GATE.F89,
      FIBONACCI_GATE.F144,
      FIBONACCI_GATE.F233
    ]);

  const REQUIREMENT =
    Object.freeze({
      FILE_LOADED:
        "fileLoaded",

      CONTRACT_MATCHED:
        "contractMatched",

      MODEL_VALIDATED:
        "modelValidated",

      INSTANCE_CREATED:
        "instanceCreated",

      MOUNT_PRESENT:
        "mountPresent",

      SURFACE_NONZERO:
        "surfaceNonzero",

      BACKEND_INITIALIZED:
        "backendInitialized",

      RESOURCES_UPLOADED:
        "resourcesUploaded",

      FIRST_FRAME_SUBMITTED:
        "firstFrameSubmitted",

      FIRST_FRAME_PRESENTED:
        "firstFramePresented",

      VISIBLE_PIXEL_OBSERVED:
        "visiblePixelObserved",

      INTERACTION_OBSERVED:
        "interactionObserved",

      FALLBACK_AVAILABLE:
        "fallbackAvailable",

      CONTEXT_RECOVERY_AVAILABLE:
        "contextRecoveryAvailable",

      DISPOSAL_OBSERVED:
        "disposalObserved",

      NO_BLOCKING_ERROR:
        "noBlockingError"
    });

  const FORBIDDEN =
    Object.freeze({
      GLOBAL_SINGLETON_DEPENDENCY:
        "globalSingletonDependency",

      ROUTE_SPECIFIC_ENGINE_DUPLICATION:
        "routeSpecificEngineDuplication",

      MODEL_OWNS_SHARED_RENDERING:
        "modelOwnsSharedRendering",

      PRODUCT_ENGINE_IN_FRAME_LOOP:
        "productEngineInFrameLoop",

      SPEC_COPIED_TO_OPS:
        "specCopiedToOps",

      SILENT_CONTEXT_LOSS:
        "silentContextLoss",

      SILENT_RESOURCE_LEAK:
        "silentResourceLeak",

      SILENT_BUFFER_MUTATION:
        "silentBufferMutation"
    });

  const DEFAULT =
    Object.freeze({
      NEWS:
        Object.freeze({
          sourceStatus:
            ENUM
              .NEWS_SOURCE_STATUS
              .CURRENT,

          alignmentStatus:
            ENUM
              .NEWS_ALIGNMENT_STATUS
              .ALIGNED,

          authorityClass:
            ENUM
              .NEWS_AUTHORITY_CLASS
              .SUPPORTING,

          disposition:
            ENUM
              .NEWS_DISPOSITION
              .PRESERVE,

          source:
            "",

          notes:
            Object.freeze([])
        }),

      FIBONACCI:
        Object.freeze({
          currentGate:
            FIBONACCI_GATE.F13,

          prerequisiteGate:
            0,

          nextGate:
            FIBONACCI_GATE.F21,

          synchronized:
            true,

          evidence:
            Object.freeze([])
        }),

      OWNERSHIP:
        Object.freeze({
          ownsGeometry:
            true,

          ownsRendering:
            false,

          ownsInput:
            false,

          ownsFallback:
            false,

          ownsDiagnostics:
            false,

          ownsFinalVerdict:
            false,

          usesRendering:
            true,

          usesInput:
            false,

          usesFallback:
            true,

          usesDiagnostics:
            true
        }),

      RENDER_STATE:
        Object.freeze({
          depthTest:
            true,

          depthWrite:
            true,

          depthCompare:
            ENUM
              .DEPTH_COMPARE
              .LEQUAL,

          blend:
            ENUM
              .BLEND_MODE
              .OPAQUE,

          cullMode:
            ENUM
              .CULL_MODE
              .BACK,

          frontFace:
            ENUM
              .FRONT_FACE
              .CCW,

          colorWrite:
            Object.freeze([
              true,
              true,
              true,
              true
            ])
        })
    });

  const STATE_ORDER =
    Object.freeze({
      DECLARED:
        0,

      LOADED:
        1,

      VALIDATED:
        2,

      CREATED:
        3,

      MOUNTED:
        4,

      INITIALIZED:
        5,

      UPLOADED:
        6,

      SUBMITTED:
        7,

      PRESENTED:
        8,

      VISIBLE:
        9,

      INTERACTIVE:
        10,

      VERIFIED:
        11,

      READY:
        11,

      PAUSED:
        11,

      FALLBACK:
        5,

      HELD:
        0,

      DEGRADED:
        0,

      CONTEXT_LOST:
        0,

      ERROR:
        0,

      DESTROYED:
        12
    });

  const REQUIREMENT_MINIMUM_STATE =
    Object.freeze({
      [REQUIREMENT.FILE_LOADED]:
        ENUM
          .INSTANCE_STATE
          .LOADED,

      [REQUIREMENT.CONTRACT_MATCHED]:
        ENUM
          .INSTANCE_STATE
          .LOADED,

      [REQUIREMENT.MODEL_VALIDATED]:
        ENUM
          .INSTANCE_STATE
          .VALIDATED,

      [REQUIREMENT.INSTANCE_CREATED]:
        ENUM
          .INSTANCE_STATE
          .CREATED,

      [REQUIREMENT.MOUNT_PRESENT]:
        ENUM
          .INSTANCE_STATE
          .MOUNTED,

      [REQUIREMENT.SURFACE_NONZERO]:
        ENUM
          .INSTANCE_STATE
          .MOUNTED,

      [REQUIREMENT.BACKEND_INITIALIZED]:
        ENUM
          .INSTANCE_STATE
          .INITIALIZED,

      [REQUIREMENT.RESOURCES_UPLOADED]:
        ENUM
          .INSTANCE_STATE
          .UPLOADED,

      [REQUIREMENT.FIRST_FRAME_SUBMITTED]:
        ENUM
          .INSTANCE_STATE
          .SUBMITTED,

      [REQUIREMENT.FIRST_FRAME_PRESENTED]:
        ENUM
          .INSTANCE_STATE
          .PRESENTED,

      [REQUIREMENT.VISIBLE_PIXEL_OBSERVED]:
        ENUM
          .INSTANCE_STATE
          .VISIBLE,

      [REQUIREMENT.INTERACTION_OBSERVED]:
        ENUM
          .INSTANCE_STATE
          .INTERACTIVE,

      [REQUIREMENT.FALLBACK_AVAILABLE]:
        ENUM
          .INSTANCE_STATE
          .INITIALIZED,

      [REQUIREMENT.CONTEXT_RECOVERY_AVAILABLE]:
        ENUM
          .INSTANCE_STATE
          .INITIALIZED,

      [REQUIREMENT.DISPOSAL_OBSERVED]:
        ENUM
          .INSTANCE_STATE
          .DESTROYED,

      [REQUIREMENT.NO_BLOCKING_ERROR]:
        ENUM
          .INSTANCE_STATE
          .DECLARED
    });

  const ATTRIBUTE_SIZE_HINT =
    Object.freeze({
      POSITION:
        3,

      NORMAL:
        3,

      TANGENT:
        4,

      COLOR:
        4,

      UV:
        2,

      TEXCOORD_0:
        2,

      MATERIAL:
        1,

      MATERIAL_REGION:
        1,

      SURFACE:
        1,

      SURFACE_CLASS:
        1,

      FACET_ID:
        1,

      OBJECT_ID:
        1,

      POINT_SIZE:
        1
    });

  const TYPED_ARRAY_COMPONENT =
    new Map([
      [
        Float32Array,
        ENUM
          .ATTRIBUTE_COMPONENT_TYPE
          .FLOAT32
      ],

      [
        Uint8Array,
        ENUM
          .ATTRIBUTE_COMPONENT_TYPE
          .UINT8
      ],

      [
        Int8Array,
        ENUM
          .ATTRIBUTE_COMPONENT_TYPE
          .INT8
      ],

      [
        Uint16Array,
        ENUM
          .ATTRIBUTE_COMPONENT_TYPE
          .UINT16
      ],

      [
        Int16Array,
        ENUM
          .ATTRIBUTE_COMPONENT_TYPE
          .INT16
      ],

      [
        Uint32Array,
        ENUM
          .ATTRIBUTE_COMPONENT_TYPE
          .UINT32
      ],

      [
        Int32Array,
        ENUM
          .ATTRIBUTE_COMPONENT_TYPE
          .INT32
      ]
    ]);

  function hasOwn(
    object,
    key
  ) {
    return Object
      .prototype
      .hasOwnProperty
      .call(
        object,
        key
      );
  }

  function isObject(value) {
    return (
      value !==
      null &&

      typeof value ===
      "object"
    );
  }

  function isPlainObject(value) {
    if (!isObject(value)) {
      return false;
    }

    const prototype =
      Object.getPrototypeOf(
        value
      );

    return (
      prototype ===
      Object.prototype ||

      prototype ===
      null
    );
  }

  function isTypedArray(value) {
    return (
      ArrayBuffer.isView(
        value
      ) &&

      !(
        value instanceof
        DataView
      )
    );
  }

  function finiteNumber(value) {
    return (
      typeof value ===
      "number" &&

      Number.isFinite(
        value
      )
    );
  }

  function stringValue(
    value,
    fallback
  ) {
    return (
      typeof value ===
        "string" &&

      value.trim()
    )
      ? value.trim()
      : fallback;
  }

  function integerValue(
    value,
    fallback
  ) {
    const parsed =
      Number(value);

    return Number.isInteger(
      parsed
    )
      ? parsed
      : fallback;
  }

  function numberValue(
    value,
    fallback
  ) {
    const parsed =
      Number(value);

    return Number.isFinite(
      parsed
    )
      ? parsed
      : fallback;
  }

  function booleanValue(
    value,
    fallback
  ) {
    return (
      typeof value ===
      "boolean"
    )
      ? value
      : Boolean(
          fallback
        );
  }

  function enumValue(
    enumeration,
    value,
    fallback
  ) {
    const normalized =
      typeof value ===
      "string"
        ? value
            .trim()
            .toUpperCase()
        : "";

    return hasOwn(
      enumeration,
      normalized
    )
      ? enumeration[
          normalized
        ]
      : fallback;
  }

  function uniqueStrings(values) {
    const output = [];
    const seen =
      new Set();

    for (
      const value of
      Array.isArray(values)
        ? values
        : []
    ) {
      if (
        typeof value !==
        "string"
      ) {
        continue;
      }

      const normalized =
        value.trim();

      if (
        !normalized ||
        seen.has(normalized)
      ) {
        continue;
      }

      seen.add(
        normalized
      );

      output.push(
        normalized
      );
    }

    return output;
  }

  function clone(
    value,
    seen
  ) {
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

    if (
      value instanceof
      Date
    ) {
      return new Date(
        value.getTime()
      );
    }

    if (
      isTypedArray(
        value
      )
    ) {
      return new value.constructor(
        value
      );
    }

    if (
      value instanceof
      ArrayBuffer
    ) {
      return value.slice(0);
    }

    const memory =
      seen ||
      new WeakMap();

    if (
      memory.has(
        value
      )
    ) {
      return memory.get(
        value
      );
    }

    if (
      Array.isArray(
        value
      )
    ) {
      const output = [];

      memory.set(
        value,
        output
      );

      for (
        const entry of
        value
      ) {
        output.push(
          clone(
            entry,
            memory
          )
        );
      }

      return output;
    }

    const output = {};

    memory.set(
      value,
      output
    );

    for (
      const key of
      Object.keys(value)
    ) {
      output[key] =
        clone(
          value[key],
          memory
        );
    }

    return output;
  }

  function deepFreeze(
    value,
    seen
  ) {
    if (
      !isObject(value) ||
      isTypedArray(value) ||
      value instanceof
        ArrayBuffer
    ) {
      return value;
    }

    const memory =
      seen ||
      new WeakSet();

    if (
      memory.has(
        value
      )
    ) {
      return value;
    }

    memory.add(
      value
    );

    for (
      const key of
      Object.keys(value)
    ) {
      deepFreeze(
        value[key],
        memory
      );
    }

    return Object.freeze(
      value
    );
  }

  function plain(
    value,
    seen
  ) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (
      typeof value ===
      "bigint"
    ) {
      return value.toString();
    }

    if (
      typeof value ===
      "function"
    ) {
      return {
        type:
          "Function",

        name:
          value.name ||
          "anonymous"
      };
    }

    if (
      value instanceof
      Date
    ) {
      return value.toISOString();
    }

    if (
      isTypedArray(
        value
      )
    ) {
      return {
        type:
          value
            .constructor
            .name,

        length:
          value.length,

        byteLength:
          value.byteLength
      };
    }

    if (
      value instanceof
      ArrayBuffer
    ) {
      return {
        type:
          "ArrayBuffer",

        byteLength:
          value.byteLength
      };
    }

    const memory =
      seen ||
      new WeakSet();

    if (
      memory.has(
        value
      )
    ) {
      return "[Circular]";
    }

    memory.add(
      value
    );

    if (
      Array.isArray(
        value
      )
    ) {
      return value.map(
        entry =>
          plain(
            entry,
            memory
          )
      );
    }

    const output = {};

    for (
      const key of
      Object.keys(value)
    ) {
      output[key] =
        plain(
          value[key],
          memory
        );
    }

    return output;
  }

  function stablePrepare(
    value,
    seen
  ) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (
      typeof value ===
      "bigint"
    ) {
      return value.toString();
    }

    if (
      typeof value ===
      "function"
    ) {
      return (
        `[Function:${
          value.name ||
          "anonymous"
        }]`
      );
    }

    if (
      value instanceof
      Date
    ) {
      return value.toISOString();
    }

    if (
      isTypedArray(
        value
      )
    ) {
      return {
        __typedArray:
          value
            .constructor
            .name,

        length:
          value.length,

        values:
          Array.from(
            value
          )
      };
    }

    if (
      value instanceof
      ArrayBuffer
    ) {
      return {
        __arrayBuffer:
          value.byteLength
      };
    }

    const memory =
      seen ||
      new WeakSet();

    if (
      memory.has(
        value
      )
    ) {
      return "[Circular]";
    }

    memory.add(
      value
    );

    if (
      Array.isArray(
        value
      )
    ) {
      return value.map(
        entry =>
          stablePrepare(
            entry,
            memory
          )
      );
    }

    const output = {};

    for (
      const key of
      Object
        .keys(value)
        .sort()
    ) {
      output[key] =
        stablePrepare(
          value[key],
          memory
        );
    }

    return output;
  }

  function stableStringify(
    value,
    spacing
  ) {
    return JSON.stringify(
      stablePrepare(
        value
      ),
      null,
      spacing ||
      0
    );
  }

  function hash(value) {
    const text =
      stableStringify(
        value
      );

    let result =
      0x811c9dc5;

    for (
      let index = 0;
      index <
      text.length;
      index += 1
    ) {
      result ^=
        text.charCodeAt(
          index
        );

      result =
        Math.imul(
          result,
          0x01000193
        ) >>>
        0;
    }

    return (
      `fnv1a32-${
        result
          .toString(16)
          .padStart(
            8,
            "0"
          )
      }`
    );
  }

  function collector(scope) {
    const checks = [];
    const failures = [];
    const warnings = [];

    function add(
      id,
      passed,
      expected,
      actual,
      detail,
      severity
    ) {
      const entry = {
        id:
          `${scope}:${id}`,

        passed:
          Boolean(
            passed
          ),

        severity:
          severity ||
          "error",

        expected:
          plain(
            expected
          ),

        actual:
          plain(
            actual
          ),

        detail:
          detail ||
          ""
      };

      checks.push(
        entry
      );

      if (!entry.passed) {
        if (
          entry.severity ===
          "warning"
        ) {
          warnings.push(
            entry
          );
        } else {
          failures.push(
            entry
          );
        }
      }

      return entry;
    }

    function result(extra) {
      return deepFreeze({
        scope,

        passed:
          failures.length ===
          0,

        checkCount:
          checks.length,

        passCount:
          checks.filter(
            check =>
              check.passed
          ).length,

        warningCount:
          warnings.length,

        failCount:
          failures.length,

        checks:
          clone(
            checks
          ),

        warnings:
          clone(
            warnings
          ),

        failures:
          clone(
            failures
          ),

        ...(
          extra ||
          {}
        )
      });
    }

    return {
      add,
      result
    };
  }

  function previousGate(
    currentGate
  ) {
    const index =
      FIBONACCI_SEQUENCE.indexOf(
        currentGate
      );

    return (
      index >
      0
    )
      ? FIBONACCI_SEQUENCE[
          index -
          1
        ]
      : 0;
  }

  function nextGate(
    currentGate
  ) {
    const index =
      FIBONACCI_SEQUENCE.indexOf(
        currentGate
      );

    return (
      index >=
        0 &&

      index <
        FIBONACCI_SEQUENCE.length -
        1
    )
      ? FIBONACCI_SEQUENCE[
          index +
          1
        ]
      : currentGate;
  }

  function normalizeNews(input) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    return deepFreeze({
      sourceStatus:
        enumValue(
          ENUM
            .NEWS_SOURCE_STATUS,

          source
            .sourceStatus,

          DEFAULT
            .NEWS
            .sourceStatus
        ),

      alignmentStatus:
        enumValue(
          ENUM
            .NEWS_ALIGNMENT_STATUS,

          source
            .alignmentStatus,

          DEFAULT
            .NEWS
            .alignmentStatus
        ),

      authorityClass:
        enumValue(
          ENUM
            .NEWS_AUTHORITY_CLASS,

          source
            .authorityClass,

          DEFAULT
            .NEWS
            .authorityClass
        ),

      disposition:
        enumValue(
          ENUM
            .NEWS_DISPOSITION,

          source
            .disposition,

          DEFAULT
            .NEWS
            .disposition
        ),

      source:
        stringValue(
          source.source,
          ""
        ),

      notes:
        uniqueStrings(
          source.notes
        )
    });
  }

  function normalizeFibonacci(input) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    const proposed =
      integerValue(
        source.currentGate,
        DEFAULT
          .FIBONACCI
          .currentGate
      );

    const currentGate =
      FIBONACCI_SEQUENCE.includes(
        proposed
      )
        ? proposed
        : DEFAULT
            .FIBONACCI
            .currentGate;

    return deepFreeze({
      currentGate,

      prerequisiteGate:
        integerValue(
          source
            .prerequisiteGate,

          previousGate(
            currentGate
          )
        ),

      nextGate:
        integerValue(
          source.nextGate,

          nextGate(
            currentGate
          )
        ),

      synchronized:
        booleanValue(
          source
            .synchronized,

          true
        ),

      evidence:
        uniqueStrings(
          source.evidence
        )
    });
  }

  function normalizeOwnership(input) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    const output = {};

    for (
      const [
        key,
        fallback
      ] of
      Object.entries(
        DEFAULT.OWNERSHIP
      )
    ) {
      output[key] =
        booleanValue(
          source[key],
          fallback
        );
    }

    return deepFreeze(
      output
    );
  }

  function componentType(data) {
    return isTypedArray(
      data
    )
      ? TYPED_ARRAY_COMPONENT.get(
          data.constructor
        ) ||
        null
      : null;
  }

  function normalizeAttribute(
    name,
    input
  ) {
    const source =
      isTypedArray(input)
        ? {
            data:
              input
          }
        : isPlainObject(input)
          ? input
          : {};

    const semantic =
      stringValue(
        source.semantic,
        String(
          name ||
          "CUSTOM"
        )
      ).toUpperCase();

    const data =
      source.data ||
      null;

    return {
      semantic,

      data,

      size:
        Math.max(
          1,

          Math.min(
            4,

            integerValue(
              source.size,
              ATTRIBUTE_SIZE_HINT[
                semantic
              ] ||
              1
            )
          )
        ),

      componentType:
        enumValue(
          ENUM
            .ATTRIBUTE_COMPONENT_TYPE,

          source
            .componentType,

          componentType(
            data
          ) ||
          ENUM
            .ATTRIBUTE_COMPONENT_TYPE
            .FLOAT32
        ),

      normalized:
        booleanValue(
          source.normalized,
          false
        ),

      stride:
        Math.max(
          0,

          integerValue(
            source.stride,
            0
          )
        ),

      offset:
        Math.max(
          0,

          integerValue(
            source.offset,
            0
          )
        ),

      divisor:
        Math.max(
          0,

          integerValue(
            source.divisor,
            0
          )
        ),

      custody:
        enumValue(
          ENUM
            .BUFFER_CUSTODY,

          source.custody,

          ENUM
            .BUFFER_CUSTODY
            .BORROWED_READ_ONLY
        ),

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    };
  }

  function normalizeRenderState(input) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    const colorWrite =
      Array.isArray(
        source.colorWrite
      ) &&
      source
        .colorWrite
        .length ===
        4
        ? source
            .colorWrite
            .map(
              Boolean
            )
        : DEFAULT
            .RENDER_STATE
            .colorWrite
            .slice();

    return {
      depthTest:
        booleanValue(
          source.depthTest,
          DEFAULT
            .RENDER_STATE
            .depthTest
        ),

      depthWrite:
        booleanValue(
          source.depthWrite,
          DEFAULT
            .RENDER_STATE
            .depthWrite
        ),

      depthCompare:
        enumValue(
          ENUM
            .DEPTH_COMPARE,

          source
            .depthCompare,

          DEFAULT
            .RENDER_STATE
            .depthCompare
        ),

      blend:
        enumValue(
          ENUM.BLEND_MODE,
          source.blend,
          DEFAULT
            .RENDER_STATE
            .blend
        ),

      cullMode:
        enumValue(
          ENUM.CULL_MODE,
          source.cullMode,
          DEFAULT
            .RENDER_STATE
            .cullMode
        ),

      frontFace:
        enumValue(
          ENUM.FRONT_FACE,
          source.frontFace,
          DEFAULT
            .RENDER_STATE
            .frontFace
        ),

      colorWrite,

      customBlend:
        isPlainObject(
          source.customBlend
        )
          ? clone(
              source.customBlend
            )
          : null
    };
  }

  function normalizeMesh(
    input,
    index
  ) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    const attributes = {};

    if (
      isPlainObject(
        source.attributes
      )
    ) {
      for (
        const [
          name,
          attribute
        ] of
        Object.entries(
          source.attributes
        )
      ) {
        attributes[
          String(name)
            .toUpperCase()
        ] =
          normalizeAttribute(
            name,
            attribute
          );
      }
    }

    const indices =
      source.indices ||
      null;

    const indexed =
      typeof source.indexed ===
      "boolean"
        ? source.indexed
        : isTypedArray(
            indices
          );

    return {
      id:
        stringValue(
          source.id,
          `mesh-${index}`
        ),

      label:
        stringValue(
          source.label,
          ""
        ),

      primitive:
        enumValue(
          ENUM.PRIMITIVE,
          source.primitive,
          ENUM
            .PRIMITIVE
            .TRIANGLES
        ),

      indexed,

      attributes,

      indices,

      indexFormat:
        indexed
          ? indices instanceof
              Uint32Array
            ? ENUM
                .INDEX_FORMAT
                .UINT32
            : ENUM
                .INDEX_FORMAT
                .UINT16
          : ENUM
              .INDEX_FORMAT
              .NONE,

      vertexCount:
        Math.max(
          0,

          integerValue(
            source.vertexCount,
            0
          )
        ),

      indexCount:
        Math.max(
          0,

          integerValue(
            source.indexCount,
            0
          )
        ),

      instanceCount:
        Math.max(
          1,

          integerValue(
            source.instanceCount,
            1
          )
        ),

      usage:
        enumValue(
          ENUM.BUFFER_USAGE,
          source.usage,
          ENUM
            .BUFFER_USAGE
            .STATIC
        ),

      materialId:
        stringValue(
          source.materialId,
          ""
        ),

      shaderId:
        stringValue(
          source.shaderId,
          ""
        ),

      transparent:
        booleanValue(
          source.transparent,
          false
        ),

      visible:
        booleanValue(
          source.visible,
          true
        ),

      selectable:
        booleanValue(
          source.selectable,
          false
        ),

      renderState:
        normalizeRenderState(
          source.renderState
        ),

      bounds:
        isPlainObject(
          source.bounds
        )
          ? clone(
              source.bounds
            )
          : {},

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    };
  }

  function normalizeMaterial(
    input,
    index
  ) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    return {
      id:
        stringValue(
          source.id,
          `material-${index}`
        ),

      label:
        stringValue(
          source.label,
          ""
        ),

      family:
        stringValue(
          source.family,
          "GENERIC"
        ),

      shaderId:
        stringValue(
          source.shaderId,
          ""
        ),

      parameters:
        isPlainObject(
          source.parameters
        )
          ? clone(
              source.parameters
            )
          : {},

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    };
  }

  function normalizeShader(
    input,
    index
  ) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    return {
      id:
        stringValue(
          source.id,
          `shader-${index}`
        ),

      label:
        stringValue(
          source.label,
          ""
        ),

      family:
        stringValue(
          source.family,
          "GENERIC"
        ),

      backend:
        source.backend
          ? enumValue(
              ENUM.BACKEND,
              source.backend,
              ENUM
                .BACKEND
                .WEBGL2
            )
          : null,

      vertex:
        source.vertex ||
        null,

      fragment:
        source.fragment ||
        null,

      compute:
        source.compute ||
        null,

      entryPoints:
        isPlainObject(
          source.entryPoints
        )
          ? clone(
              source.entryPoints
            )
          : {},

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    };
  }

  function normalizePass(
    input,
    index
  ) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    return {
      id:
        stringValue(
          source.id,
          `pass-${index}`
        ),

      label:
        stringValue(
          source.label,
          ""
        ),

      order:
        numberValue(
          source.order,
          index
        ),

      enabled:
        booleanValue(
          source.enabled,
          true
        ),

      meshIds:
        uniqueStrings(
          source.meshIds
        ),

      materialIds:
        uniqueStrings(
          source.materialIds
        ),

      shaderId:
        stringValue(
          source.shaderId,
          ""
        ),

      primitive:
        source.primitive
          ? enumValue(
              ENUM.PRIMITIVE,
              source.primitive,
              ENUM
                .PRIMITIVE
                .TRIANGLES
            )
          : null,

      state:
        normalizeRenderState(
          source.state ||
          source.renderState
        ),

      repeat:
        Math.max(
          1,

          integerValue(
            source.repeat,
            1
          )
        ),

      dynamic:
        booleanValue(
          source.dynamic,
          false
        ),

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    };
  }

  function normalizeSpec(input) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    const backendSource =
      isPlainObject(
        source.backend
      )
        ? source.backend
        : {};

    return deepFreeze({
      schema:
        SCHEMA.SPEC,

      required:
        isPlainObject(
          source.required
        )
          ? clone(
              source.required
            )
          : {},

      optional:
        isPlainObject(
          source.optional
        )
          ? clone(
              source.optional
            )
          : {},

      forbidden:
        isPlainObject(
          source.forbidden
        )
          ? clone(
              source.forbidden
            )
          : {},

      backend: {
        preferred:
          Array.isArray(
            backendSource.preferred
          )
            ? backendSource
                .preferred
                .map(
                  value =>
                    enumValue(
                      ENUM.BACKEND,
                      value,
                      ENUM
                        .BACKEND
                        .NONE
                    )
                )
            : [
                ENUM
                  .BACKEND
                  .WEBGPU,

                ENUM
                  .BACKEND
                  .WEBGL2
              ],

        requiredAny:
          Array.isArray(
            backendSource.requiredAny
          )
            ? backendSource
                .requiredAny
                .map(
                  value =>
                    enumValue(
                      ENUM.BACKEND,
                      value,
                      ENUM
                        .BACKEND
                        .NONE
                    )
                )
            : [
                ENUM
                  .BACKEND
                  .WEBGL2
              ],

        fallback:
          Array.isArray(
            backendSource.fallback
          )
            ? backendSource
                .fallback
                .map(
                  value =>
                    enumValue(
                      ENUM.BACKEND,
                      value,
                      ENUM
                        .BACKEND
                        .NONE
                    )
                )
            : [
                ENUM
                  .BACKEND
                  .CANVAS2D,

                ENUM
                  .BACKEND
                  .SVG,

                ENUM
                  .BACKEND
                  .HTML
              ]
      },

      capabilities:
        isPlainObject(
          source.capabilities
        )
          ? clone(
              source.capabilities
            )
          : {},

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    });
  }

  function normalizeOps(input) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    return deepFreeze({
      schema:
        SCHEMA.OPS,

      loaded:
        booleanValue(
          source.loaded,
          false
        ),

      initialized:
        booleanValue(
          source.initialized,
          false
        ),

      observed:
        isPlainObject(
          source.observed
        )
          ? clone(
              source.observed
            )
          : {},

      backend:
        enumValue(
          ENUM.BACKEND,
          source.backend,
          ENUM
            .BACKEND
            .NONE
        ),

      state:
        enumValue(
          ENUM.INSTANCE_STATE,
          source.state,
          ENUM
            .INSTANCE_STATE
            .DECLARED
        ),

      errors:
        Array.isArray(
          source.errors
        )
          ? clone(
              source.errors
            )
          : [],

      warnings:
        Array.isArray(
          source.warnings
        )
          ? clone(
              source.warnings
            )
          : [],

      metrics:
        isPlainObject(
          source.metrics
        )
          ? clone(
              source.metrics
            )
          : {},

      timestamps:
        isPlainObject(
          source.timestamps
        )
          ? clone(
              source.timestamps
            )
          : {},

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    });
  }

  function normalizeGeometry(input) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    return {
      meshes:
        Array.isArray(
          source.meshes
        )
          ? source
              .meshes
              .map(
                normalizeMesh
              )
          : [],

      bounds:
        isPlainObject(
          source.bounds
        )
          ? clone(
              source.bounds
            )
          : {},

      anchors:
        isPlainObject(
          source.anchors
        )
          ? clone(
              source.anchors
            )
          : {},

      validation:
        isPlainObject(
          source.validation
        )
          ? clone(
              source.validation
            )
          : {},

      geometryHash:
        stringValue(
          source.geometryHash,
          ""
        ),

      factory:
        typeof source.factory ===
        "function"
          ? source.factory
          : typeof source
                .createGeometry ===
              "function"
            ? source
                .createGeometry
            : null,

      provider:
        source.provider ||
        null,

      deferred:
        booleanValue(
          source.deferred,
          false
        ),

      bufferCustody:
        enumValue(
          ENUM
            .BUFFER_CUSTODY,

          source
            .bufferCustody,

          ENUM
            .BUFFER_CUSTODY
            .BORROWED_READ_ONLY
        ),

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    };
  }

  function normalizeModelPackage(input) {
    const source =
      isPlainObject(input)
        ? input
        : {};

    const identitySource =
      isPlainObject(
        source.identity
      )
        ? source.identity
        : {};

    const modelId =
      stringValue(
        identitySource.modelId ||
        source.modelId ||
        source.id,

        ""
      );

    const normalized = {
      schema:
        SCHEMA.MODEL,

      identity: {
        modelId,

        modelClass:
          enumValue(
            ENUM.MODEL_CLASS,

            identitySource
              .modelClass ||
            source.modelClass,

            ENUM
              .MODEL_CLASS
              .CUSTOM
          ),

        contract:
          stringValue(
            identitySource
              .contract ||
            source.contract,

            ""
          ),

        version:
          stringValue(
            identitySource
              .version ||
            source.version,

            "0.0.0"
          ),

        label:
          stringValue(
            identitySource.label ||
            source.label,

            modelId
          ),

        route:
          stringValue(
            identitySource.route ||
            source.route,

            ""
          )
      },

      ownership:
        normalizeOwnership(
          source.ownership
        ),

      news:
        normalizeNews(
          source.news
        ),

      fibonacci:
        normalizeFibonacci(
          source.fibonacci
        ),

      spec:
        normalizeSpec(
          source.spec
        ),

      geometry:
        normalizeGeometry(
          source.geometry
        ),

      materials:
        Array.isArray(
          source.materials
        )
          ? source
              .materials
              .map(
                normalizeMaterial
              )
          : [],

      shaders:
        Array.isArray(
          source.shaders
        )
          ? source
              .shaders
              .map(
                normalizeShader
              )
          : [],

      passes:
        Array.isArray(
          source.passes
        )
          ? source
              .passes
              .map(
                normalizePass
              )
          : [],

      camera:
        isPlainObject(
          source.camera
        )
          ? clone(
              source.camera
            )
          : {},

      lights:
        Array.isArray(
          source.lights
        )
          ? clone(
              source.lights
            )
          : [],

      animation:
        isPlainObject(
          source.animation
        )
          ? {
              ...clone(
                source.animation
              ),

              mode:
                enumValue(
                  ENUM
                    .ANIMATION_MODE,

                  source
                    .animation
                    .mode,

                  ENUM
                    .ANIMATION_MODE
                    .NONE
                )
            }
          : {
              mode:
                ENUM
                  .ANIMATION_MODE
                  .NONE
            },

      interaction:
        isPlainObject(
          source.interaction
        )
          ? {
              ...clone(
                source.interaction
              ),

              mode:
                enumValue(
                  ENUM
                    .INTERACTION_MODE,

                  source
                    .interaction
                    .mode,

                  ENUM
                    .INTERACTION_MODE
                    .NONE
                )
            }
          : {
              mode:
                ENUM
                  .INTERACTION_MODE
                  .NONE
            },

      fallback:
        isPlainObject(
          source.fallback
        )
          ? {
              ...clone(
                source.fallback
              ),

              type:
                enumValue(
                  ENUM
                    .FALLBACK_TYPE,

                  source
                    .fallback
                    .type,

                  ENUM
                    .FALLBACK_TYPE
                    .NONE
                )
            }
          : {
              type:
                ENUM
                  .FALLBACK_TYPE
                  .NONE
            },

      diagnostics:
        isPlainObject(
          source.diagnostics
        )
          ? clone(
              source.diagnostics
            )
          : {},

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {}
    };

    normalized.packageHash =
      hash({
        ...normalized,

        packageHash:
          undefined
      });

    return deepFreeze(
      normalized
    );
  }

  function validateAttribute(
    name,
    input
  ) {
    const attribute =
      normalizeAttribute(
        name,
        input
      );

    const audit =
      collector(
        `attribute:${
          attribute.semantic
        }`
      );

    audit.add(
      "typed-array",

      isTypedArray(
        attribute.data
      ),

      "TypedArray",

      attribute.data &&
      attribute
        .data
        .constructor
        ? attribute
            .data
            .constructor
            .name
        : typeof attribute.data,

      "Renderable attributes must use typed arrays."
    );

    audit.add(
      "component-type",

      Boolean(
        componentType(
          attribute.data
        )
      ),

      Object.values(
        ENUM
          .ATTRIBUTE_COMPONENT_TYPE
      ),

      componentType(
        attribute.data
      ),

      "Attribute component type must be supported."
    );

    audit.add(
      "size",

      Number.isInteger(
        attribute.size
      ) &&
      attribute.size >=
        1 &&
      attribute.size <=
        4,

      "integer 1..4",

      attribute.size,

      "Attribute size must be between one and four."
    );

    if (
      isTypedArray(
        attribute.data
      )
    ) {
      audit.add(
        "length-divisible",

        attribute
          .data
          .length %
          attribute.size ===
          0,

        `length divisible by ${
          attribute.size
        }`,

        attribute
          .data
          .length,

        "Attribute length must align with its component size."
      );

      if (
        attribute.data instanceof
        Float32Array
      ) {
        let finite =
          true;

        for (
          let index = 0;
          index <
          attribute
            .data
            .length;
          index += 1
        ) {
          if (
            !Number.isFinite(
              attribute
                .data[
                index
              ]
            )
          ) {
            finite =
              false;

            break;
          }
        }

        audit.add(
          "finite-values",

          finite,

          true,

          finite,

          "Floating-point attributes may not contain NaN or Infinity."
        );
      }
    }

    return audit.result({
      normalized:
        deepFreeze(
          attribute
        ),

      elementCount:
        isTypedArray(
          attribute.data
        )
          ? Math.floor(
              attribute
                .data
                .length /
              attribute.size
            )
          : 0
    });
  }

  function primitiveDivisor(
    primitive
  ) {
    if (
      primitive ===
      ENUM
        .PRIMITIVE
        .TRIANGLES
    ) {
      return 3;
    }

    if (
      primitive ===
      ENUM
        .PRIMITIVE
        .LINES
    ) {
      return 2;
    }

    return 1;
  }

  function validateMesh(input) {
    const mesh =
      normalizeMesh(
        input,
        0
      );

    const audit =
      collector(
        `mesh:${mesh.id}`
      );

    const attributeResults = {};

    audit.add(
      "id",

      Boolean(
        mesh.id
      ),

      "non-empty string",

      mesh.id,

      "Every mesh requires a stable ID."
    );

    audit.add(
      "position",

      hasOwn(
        mesh.attributes,
        "POSITION"
      ),

      true,

      hasOwn(
        mesh.attributes,
        "POSITION"
      ),

      "Every renderable mesh requires a POSITION attribute."
    );

    for (
      const [
        name,
        attribute
      ] of
      Object.entries(
        mesh.attributes
      )
    ) {
      const result =
        validateAttribute(
          name,
          attribute
        );

      attributeResults[
        name
      ] =
        result;

      audit.add(
        `attribute-${name}`,

        result.passed,

        true,

        result.passed,

        `Attribute ${name} must validate.`
      );
    }

    const inferredVertexCount =
      attributeResults
        .POSITION
        ? attributeResults
            .POSITION
            .elementCount
        : 0;

    const vertexCount =
      mesh.vertexCount ||
      inferredVertexCount;

    audit.add(
      "vertex-count",

      vertexCount >
      0,

      "> 0",

      vertexCount,

      "Mesh requires at least one vertex."
    );

    for (
      const [
        name,
        result
      ] of
      Object.entries(
        attributeResults
      )
    ) {
      if (
        result.elementCount ===
        0
      ) {
        continue;
      }

      const expected =
        result
          .normalized
          .divisor >
        0
          ? mesh.instanceCount
          : vertexCount;

      audit.add(
        `attribute-count-${name}`,

        result.elementCount >=
          expected,

        `>= ${expected}`,

        result.elementCount,

        "Attribute count must cover its vertex or instance domain."
      );
    }

    const divisor =
      primitiveDivisor(
        mesh.primitive
      );

    if (mesh.indexed) {
      audit.add(
        "index-type",

        mesh.indices instanceof
          Uint16Array ||

        mesh.indices instanceof
          Uint32Array,

        "Uint16Array or Uint32Array",

        mesh.indices &&
        mesh
          .indices
          .constructor
          ? mesh
              .indices
              .constructor
              .name
          : typeof mesh.indices,

        "Indexed meshes require unsigned integer indices."
      );

      const indexCount =
        mesh.indexCount ||
        (
          isTypedArray(
            mesh.indices
          )
            ? mesh
                .indices
                .length
            : 0
        );

      audit.add(
        "index-count",

        indexCount >
        0,

        "> 0",

        indexCount,

        "Indexed mesh requires indices."
      );

      audit.add(
        "index-divisibility",

        indexCount %
          divisor ===
          0,

        `divisible by ${divisor}`,

        indexCount,

        "Index count must align with primitive topology."
      );

      if (
        isTypedArray(
          mesh.indices
        ) &&
        vertexCount >
        0
      ) {
        let maximum =
          0;

        for (
          let index = 0;
          index <
          mesh
            .indices
            .length;
          index += 1
        ) {
          maximum =
            Math.max(
              maximum,
              mesh
                .indices[
                index
              ]
            );
        }

        audit.add(
          "index-range",

          maximum <
          vertexCount,

          `< ${vertexCount}`,

          maximum,

          "Every index must resolve to an available vertex."
        );
      }
    } else {
      audit.add(
        "vertex-divisibility",

        vertexCount %
          divisor ===
          0,

        `divisible by ${divisor}`,

        vertexCount,

        "Non-indexed vertex count must align with primitive topology."
      );
    }

    return audit.result({
      normalized:
        deepFreeze({
          ...mesh,

          vertexCount,

          indexCount:
            mesh.indexCount ||
            (
              isTypedArray(
                mesh.indices
              )
                ? mesh
                    .indices
                    .length
                : 0
            )
        }),

      attributeResults
    });
  }

  function validateRenderPass(
    input,
    context
  ) {
    const pass =
      normalizePass(
        input,
        0
      );

    const source =
      isPlainObject(
        context
      )
        ? context
        : {};

    const meshIds =
      new Set(
        Array.isArray(
          source.meshes
        )
          ? source
              .meshes
              .map(
                item =>
                  item.id
              )
          : []
      );

    const materialIds =
      new Set(
        Array.isArray(
          source.materials
        )
          ? source
              .materials
              .map(
                item =>
                  item.id
              )
          : []
      );

    const shaderIds =
      new Set(
        Array.isArray(
          source.shaders
        )
          ? source
              .shaders
              .map(
                item =>
                  item.id
              )
          : []
      );

    const audit =
      collector(
        `pass:${pass.id}`
      );

    audit.add(
      "id",

      Boolean(
        pass.id
      ),

      "non-empty string",

      pass.id,

      "Every pass requires a stable ID."
    );

    audit.add(
      "order",

      finiteNumber(
        pass.order
      ),

      "finite number",

      pass.order,

      "Pass order must be finite."
    );

    audit.add(
      "mesh-selection",

      pass.meshIds.length >
      0,

      "> 0 mesh IDs",

      pass.meshIds.length,

      "Every pass must select at least one mesh."
    );

    for (
      const meshId of
      pass.meshIds
    ) {
      audit.add(
        `mesh-${meshId}`,

        meshIds.size ===
          0 ||

        meshIds.has(
          meshId
        ),

        true,

        meshIds.has(
          meshId
        ),

        `Unknown mesh reference: ${meshId}.`
      );
    }

    for (
      const materialId of
      pass.materialIds
    ) {
      audit.add(
        `material-${materialId}`,

        materialIds.size ===
          0 ||

        materialIds.has(
          materialId
        ),

        true,

        materialIds.has(
          materialId
        ),

        `Unknown material reference: ${materialId}.`
      );
    }

    if (pass.shaderId) {
      audit.add(
        `shader-${pass.shaderId}`,

        shaderIds.size ===
          0 ||

        shaderIds.has(
          pass.shaderId
        ),

        true,

        shaderIds.has(
          pass.shaderId
        ),

        `Unknown shader reference: ${pass.shaderId}.`
      );
    }

    return audit.result({
      normalized:
        deepFreeze(
          pass
        )
    });
  }

  function validateSpec(input) {
    const spec =
      normalizeSpec(
        input
      );

    const audit =
      collector(
        "spec"
      );

    audit.add(
      "required",

      isPlainObject(
        spec.required
      ),

      true,

      isPlainObject(
        spec.required
      ),

      "SPEC.required must be an object."
    );

    audit.add(
      "optional",

      isPlainObject(
        spec.optional
      ),

      true,

      isPlainObject(
        spec.optional
      ),

      "SPEC.optional must be an object."
    );

    audit.add(
      "forbidden",

      isPlainObject(
        spec.forbidden
      ),

      true,

      isPlainObject(
        spec.forbidden
      ),

      "SPEC.forbidden must be an object."
    );

    audit.add(
      "backend-required",

      spec
        .backend
        .requiredAny
        .length >
        0 &&

      !spec
        .backend
        .requiredAny
        .includes(
          ENUM
            .BACKEND
            .NONE
        ),

      "at least one executable backend",

      spec
        .backend
        .requiredAny,

      "Required backend set may not be empty or NONE."
    );

    return audit.result({
      normalized:
        spec
    });
  }

  function validateOps(input) {
    const ops =
      normalizeOps(
        input
      );

    const audit =
      collector(
        "ops"
      );

    audit.add(
      "observed",

      isPlainObject(
        ops.observed
      ),

      true,

      isPlainObject(
        ops.observed
      ),

      "OPS.observed must be an object."
    );

    audit.add(
      "errors",

      Array.isArray(
        ops.errors
      ),

      true,

      Array.isArray(
        ops.errors
      ),

      "OPS.errors must be an array."
    );

    audit.add(
      "warnings",

      Array.isArray(
        ops.warnings
      ),

      true,

      Array.isArray(
        ops.warnings
      ),

      "OPS.warnings must be an array."
    );

    return audit.result({
      normalized:
        ops
    });
  }

  function finiteVector(
    value,
    size
  ) {
    return (
      (
        Array.isArray(
          value
        ) ||
        isTypedArray(
          value
        )
      ) &&

      value.length ===
        size &&

      Array
        .from(value)
        .every(
          finiteNumber
        )
    );
  }

  function validateBounds(
    bounds,
    audit
  ) {
    if (
      !isPlainObject(
        bounds
      ) ||
      Object
        .keys(bounds)
        .length ===
        0
    ) {
      audit.add(
        "bounds",

        false,

        true,

        false,

        "Bounds are recommended for framing, visibility, and rejection.",

        "warning"
      );

      return;
    }

    if (
      hasOwn(
        bounds,
        "minimum"
      )
    ) {
      audit.add(
        "bounds-minimum",

        finiteVector(
          bounds.minimum,
          3
        ),

        "finite vec3",

        bounds.minimum,

        "Bounds.minimum must be finite vec3."
      );
    }

    if (
      hasOwn(
        bounds,
        "maximum"
      )
    ) {
      audit.add(
        "bounds-maximum",

        finiteVector(
          bounds.maximum,
          3
        ),

        "finite vec3",

        bounds.maximum,

        "Bounds.maximum must be finite vec3."
      );
    }

    if (
      hasOwn(
        bounds,
        "center"
      )
    ) {
      audit.add(
        "bounds-center",

        finiteVector(
          bounds.center,
          3
        ),

        "finite vec3",

        bounds.center,

        "Bounds.center must be finite vec3."
      );
    }

    if (
      hasOwn(
        bounds,
        "radius"
      )
    ) {
      audit.add(
        "bounds-radius",

        finiteNumber(
          bounds.radius
        ) &&
        bounds.radius >=
          0,

        "finite number >= 0",

        bounds.radius,

        "Bounds.radius must be finite and nonnegative."
      );
    }
  }

  function validateModelPackage(input) {
    const model =
      normalizeModelPackage(
        input
      );

    const audit =
      collector(
        `model:${
          model
            .identity
            .modelId ||
          "unknown"
        }`
      );

    audit.add(
      "schema",

      isPlainObject(
        input
      ) &&
      input.schema ===
        SCHEMA.MODEL,

      SCHEMA.MODEL,

      isPlainObject(
        input
      )
        ? input.schema
        : undefined,

      "Model package must explicitly declare DGB_MODEL_PACKAGE_v1."
    );

    audit.add(
      "model-id",

      Boolean(
        model
          .identity
          .modelId
      ),

      "non-empty string",

      model
        .identity
        .modelId,

      "Model package requires modelId."
    );

    audit.add(
      "contract",

      Boolean(
        model
          .identity
          .contract
      ),

      "non-empty string",

      model
        .identity
        .contract,

      "Model package requires contract."
    );

    audit.add(
      "news-alignment",

      model
        .news
        .sourceStatus !==
        ENUM
          .NEWS_SOURCE_STATUS
          .CONFLICTING &&

      model
        .news
        .alignmentStatus !==
        ENUM
          .NEWS_ALIGNMENT_STATUS
          .CONFLICT &&

      model
        .news
        .alignmentStatus !==
        ENUM
          .NEWS_ALIGNMENT_STATUS
          .HOLD,

      "non-conflicting source",

      model.news,

      "Conflicting or held source may not enter executable admission."
    );

    audit.add(
      "fibonacci-synchronized",

      model
        .fibonacci
        .synchronized ===
        true,

      true,

      model
        .fibonacci
        .synchronized,

      "Model must declare synchronized construction state."
    );

    audit.add(
      "geometry-source",

      model
        .geometry
        .meshes
        .length >
        0 ||

      typeof model
        .geometry
        .factory ===
        "function" ||

      Boolean(
        model
          .geometry
          .provider
      ) ||

      model
        .geometry
        .deferred,

      "meshes, factory, provider, or deferred geometry",

      {
        meshCount:
          model
            .geometry
            .meshes
            .length,

        factory:
          typeof model
            .geometry
            .factory ===
          "function",

        provider:
          Boolean(
            model
              .geometry
              .provider
          ),

        deferred:
          model
            .geometry
            .deferred
      },

      "Model package must identify its geometry source."
    );

    const meshIds =
      new Set();

    const meshResults = [];

    for (
      const mesh of
      model
        .geometry
        .meshes
    ) {
      const result =
        validateMesh(
          mesh
        );

      meshResults.push(
        result
      );

      audit.add(
        `mesh-${mesh.id}`,

        result.passed,

        true,

        result.passed,

        `Mesh ${mesh.id} must validate.`
      );

      audit.add(
        `mesh-id-${mesh.id}`,

        !meshIds.has(
          mesh.id
        ),

        true,

        !meshIds.has(
          mesh.id
        ),

        `Mesh ID ${mesh.id} must be unique.`
      );

      meshIds.add(
        mesh.id
      );
    }

    const materialIds =
      new Set();

    for (
      const material of
      model.materials
    ) {
      audit.add(
        `material-id-${material.id}`,

        Boolean(
          material.id
        ) &&

        !materialIds.has(
          material.id
        ),

        "unique non-empty string",

        material.id,

        "Material IDs must be unique."
      );

      materialIds.add(
        material.id
      );
    }

    const shaderIds =
      new Set();

    for (
      const shader of
      model.shaders
    ) {
      audit.add(
        `shader-id-${shader.id}`,

        Boolean(
          shader.id
        ) &&

        !shaderIds.has(
          shader.id
        ),

        "unique non-empty string",

        shader.id,

        "Shader IDs must be unique."
      );

      shaderIds.add(
        shader.id
      );
    }

    const passIds =
      new Set();

    const passResults = [];

    for (
      const pass of
      model.passes
    ) {
      const result =
        validateRenderPass(
          pass,
          {
            meshes:
              model
                .geometry
                .meshes,

            materials:
              model.materials,

            shaders:
              model.shaders
          }
        );

      passResults.push(
        result
      );

      audit.add(
        `pass-${pass.id}`,

        result.passed,

        true,

        result.passed,

        `Pass ${pass.id} must validate.`
      );

      audit.add(
        `pass-id-${pass.id}`,

        !passIds.has(
          pass.id
        ),

        true,

        !passIds.has(
          pass.id
        ),

        `Pass ID ${pass.id} must be unique.`
      );

      passIds.add(
        pass.id
      );
    }

    audit.add(
      "passes",

      model
        .passes
        .length >
        0 ||

      model
        .geometry
        .deferred,

      "> 0 or deferred",

      model
        .passes
        .length,

      "Executable models should declare ordered render passes.",

      model
        .geometry
        .deferred
        ? "warning"
        : "error"
    );

    validateBounds(
      model
        .geometry
        .bounds,

      audit
    );

    const specResult =
      validateSpec(
        model.spec
      );

    audit.add(
      "spec",

      specResult.passed,

      true,

      specResult.passed,

      "Model SPEC must validate."
    );

    audit.add(
      "no-final-verdict-ownership",

      model
        .ownership
        .ownsFinalVerdict ===
        false,

      false,

      model
        .ownership
        .ownsFinalVerdict,

      "Model may not own Hearth or North final verdict."
    );

    audit.add(
      "no-shared-renderer-ownership",

      model
        .ownership
        .ownsRendering ===
        false,

      false,

      model
        .ownership
        .ownsRendering,

      "Migrated model may not carry shared renderer ownership."
    );

    audit.add(
      "geometry-hash",

      Boolean(
        model
          .geometry
          .geometryHash
      ) ||

      model
        .geometry
        .deferred,

      true,

      Boolean(
        model
          .geometry
          .geometryHash
      ),

      "Deterministic geometry should publish geometryHash.",

      "warning"
    );

    return audit.result({
      normalized:
        model,

      modelHash:
        model.packageHash,

      meshResults,

      passResults,

      specResult
    });
  }

  function flattenLeaves(
    value,
    prefix,
    output
  ) {
    const target =
      output ||
      [];

    const path =
      prefix ||
      "";

    const operatorObject =
      isPlainObject(
        value
      ) &&

      [
        "equals",
        "oneOf",
        "present",
        "absent",
        "minimum",
        "maximum",
        "includes",
        "test"
      ].some(
        key =>
          hasOwn(
            value,
            key
          )
      );

    if (
      isPlainObject(
        value
      ) &&
      !operatorObject
    ) {
      const keys =
        Object.keys(
          value
        );

      if (
        keys.length ===
        0
      ) {
        target.push([
          path,
          value
        ]);
      } else {
        for (
          const key of
          keys
        ) {
          flattenLeaves(
            value[key],

            path
              ? `${path}.${key}`
              : key,

            target
          );
        }
      }

      return target;
    }

    target.push([
      path,
      value
    ]);

    return target;
  }

  function getPath(
    object,
    path
  ) {
    if (!path) {
      return object;
    }

    return path
      .split(".")
      .reduce(
        (
          current,
          key
        ) => {
          return (
            current ===
              null ||

            current ===
              undefined
          )
            ? undefined
            : current[key];
        },

        object
      );
  }

  function evaluateRequirement(
    expected,
    actual
  ) {
    if (
      isPlainObject(
        expected
      )
    ) {
      if (
        typeof expected.test ===
        "function"
      ) {
        try {
          return Boolean(
            expected.test(
              actual
            )
          );
        } catch (_error) {
          return false;
        }
      }

      if (
        hasOwn(
          expected,
          "present"
        )
      ) {
        return expected.present
          ? actual !==
              undefined &&
            actual !==
              null
          : actual ===
              undefined ||
            actual ===
              null;
      }

      if (
        hasOwn(
          expected,
          "absent"
        )
      ) {
        return expected.absent
          ? actual ===
              undefined ||
            actual ===
              null ||
            actual ===
              false
          : true;
      }

      if (
        hasOwn(
          expected,
          "equals"
        )
      ) {
        return Object.is(
          actual,
          expected.equals
        );
      }

      if (
        Array.isArray(
          expected.oneOf
        )
      ) {
        return expected
          .oneOf
          .some(
            value =>
              Object.is(
                value,
                actual
              )
          );
      }

      if (
        hasOwn(
          expected,
          "minimum"
        ) &&
        (
          !finiteNumber(
            actual
          ) ||

          actual <
          expected.minimum
        )
      ) {
        return false;
      }

      if (
        hasOwn(
          expected,
          "maximum"
        ) &&
        (
          !finiteNumber(
            actual
          ) ||

          actual >
          expected.maximum
        )
      ) {
        return false;
      }

      if (
        hasOwn(
          expected,
          "includes"
        )
      ) {
        return (
          Array.isArray(
            actual
          ) &&

          actual.includes(
            expected.includes
          )
        );
      }

      return true;
    }

    if (
      expected ===
      true
    ) {
      return actual ===
        true;
    }

    if (
      expected ===
      false
    ) {
      return actual ===
        false;
    }

    if (
      Array.isArray(
        expected
      )
    ) {
      return expected.some(
        value =>
          Object.is(
            value,
            actual
          )
      );
    }

    return Object.is(
      expected,
      actual
    );
  }

  function reachedRequirementState(
    path,
    state
  ) {
    const rootPath =
      String(
        path ||
        ""
      )
        .split(".")[0];

    const requiredState =
      REQUIREMENT_MINIMUM_STATE[
        rootPath
      ];

    return requiredState
      ? (
          STATE_ORDER[state] ||
          0
        ) >=
        (
          STATE_ORDER[
            requiredState
          ] ||
          0
        )
      : false;
  }

  function compareSpecAndOps(
    specInput,
    opsInput
  ) {
    const spec =
      normalizeSpec(
        specInput
      );

    const ops =
      normalizeOps(
        opsInput
      );

    const actual = {
      loaded:
        ops.loaded,

      initialized:
        ops.initialized,

      backend:
        ops.backend,

      state:
        ops.state,

      errors:
        ops.errors,

      warnings:
        ops.warnings,

      metrics:
        ops.metrics,

      timestamps:
        ops.timestamps,

      metadata:
        ops.metadata,

      observed:
        ops.observed,

      ...ops.observed
    };

    const passed = [];
    const held = [];
    const failed = [];
    const conflicts = [];

    for (
      const [
        path,
        expected
      ] of
      flattenLeaves(
        spec.required
      )
    ) {
      const observed =
        getPath(
          actual,
          path
        );

      const entry = {
        path,

        expected:
          plain(
            expected
          ),

        observed:
          plain(
            observed
          ),

        category:
          "required"
      };

      if (
        evaluateRequirement(
          expected,
          observed
        )
      ) {
        passed.push(
          entry
        );
      } else if (
        observed ===
          undefined ||

        observed ===
          null ||

        (
          expected ===
            true &&

          observed ===
            false &&

          !reachedRequirementState(
            path,
            ops.state
          )
        )
      ) {
        held.push(
          entry
        );
      } else {
        failed.push(
          entry
        );
      }
    }

    for (
      const [
        path,
        expected
      ] of
      flattenLeaves(
        spec.forbidden
      )
    ) {
      const observed =
        getPath(
          actual,
          path
        );

      const entry = {
        path,

        expected:
          plain(
            expected
          ),

        observed:
          plain(
            observed
          ),

        category:
          "forbidden"
      };

      if (
        evaluateRequirement(
          expected,
          observed
        )
      ) {
        conflicts.push(
          entry
        );
      } else {
        passed.push(
          entry
        );
      }
    }

    const backendEntry = {
      path:
        "backend",

      expected:
        clone(
          spec
            .backend
            .requiredAny
        ),

      observed:
        ops.backend,

      category:
        "backend"
    };

    if (
      spec
        .backend
        .requiredAny
        .includes(
          ops.backend
        )
    ) {
      passed.push(
        backendEntry
      );
    } else if (
      ops.backend ===
      ENUM
        .BACKEND
        .NONE
    ) {
      held.push(
        backendEntry
      );
    } else {
      failed.push(
        backendEntry
      );
    }

    let status =
      ENUM
        .COMPARISON_STATUS
        .PASS;

    if (
      conflicts.length >
      0
    ) {
      status =
        ENUM
          .COMPARISON_STATUS
          .CONFLICT;
    } else if (
      failed.length >
      0
    ) {
      status =
        ENUM
          .COMPARISON_STATUS
          .FAIL;
    } else if (
      held.length >
      0
    ) {
      status =
        passed.length >
        0
          ? ENUM
              .COMPARISON_STATUS
              .PARTIAL_PASS
          : ENUM
              .COMPARISON_STATUS
              .HOLD;
    } else if (
      ops.errors.length >
      0
    ) {
      status =
        ENUM
          .COMPARISON_STATUS
          .DEGRADED;
    }

    return deepFreeze({
      schema:
        SCHEMA.COMPARISON,

      status,

      passed:
        clone(
          passed
        ),

      held:
        clone(
          held
        ),

      failed:
        clone(
          failed
        ),

      conflicts:
        clone(
          conflicts
        ),

      passCount:
        passed.length,

      heldCount:
        held.length,

      failCount:
        failed.length,

      conflictCount:
        conflicts.length,

      ready:
        status ===
          ENUM
            .COMPARISON_STATUS
            .PASS &&

        ops.errors.length ===
          0
    });
  }

  function createDeclaredOps(overrides) {
    const source =
      isPlainObject(
        overrides
      )
        ? overrides
        : {};

    return normalizeOps({
      ...source,

      loaded:
        booleanValue(
          source.loaded,
          false
        ),

      initialized:
        booleanValue(
          source.initialized,
          false
        ),

      state:
        source.state ||
        ENUM
          .INSTANCE_STATE
          .DECLARED,

      backend:
        source.backend ||
        ENUM
          .BACKEND
          .NONE,

      observed: {
        [REQUIREMENT.FILE_LOADED]:
          false,

        [REQUIREMENT.CONTRACT_MATCHED]:
          false,

        [REQUIREMENT.MODEL_VALIDATED]:
          false,

        [REQUIREMENT.INSTANCE_CREATED]:
          false,

        [REQUIREMENT.MOUNT_PRESENT]:
          false,

        [REQUIREMENT.SURFACE_NONZERO]:
          false,

        [REQUIREMENT.BACKEND_INITIALIZED]:
          false,

        [REQUIREMENT.RESOURCES_UPLOADED]:
          false,

        [REQUIREMENT.FIRST_FRAME_SUBMITTED]:
          false,

        [REQUIREMENT.FIRST_FRAME_PRESENTED]:
          false,

        [REQUIREMENT.VISIBLE_PIXEL_OBSERVED]:
          false,

        [REQUIREMENT.INTERACTION_OBSERVED]:
          false,

        [REQUIREMENT.FALLBACK_AVAILABLE]:
          false,

        [REQUIREMENT.CONTEXT_RECOVERY_AVAILABLE]:
          false,

        [REQUIREMENT.DISPOSAL_OBSERVED]:
          false,

        [REQUIREMENT.NO_BLOCKING_ERROR]:
          true,

        ...(
          isPlainObject(
            source.observed
          )
            ? source.observed
            : {}
        )
      }
    });
  }

  function createInstanceSpec(options) {
    const source =
      isPlainObject(
        options
      )
        ? options
        : {};

    const interactionMode =
      enumValue(
        ENUM
          .INTERACTION_MODE,

        source
          .interactionMode,

        ENUM
          .INTERACTION_MODE
          .NONE
      );

    const requiresInteraction =
      typeof source
        .requiresInteraction ===
      "boolean"
        ? source
            .requiresInteraction
        : interactionMode !==
          ENUM
            .INTERACTION_MODE
            .NONE;

    const requiresFallback =
      typeof source
        .requiresFallback ===
      "boolean"
        ? source
            .requiresFallback
        : true;

    const requiredBackend =
      Array.isArray(
        source.requiredBackend
      )
        ? source.requiredBackend
        : [
            ENUM
              .BACKEND
              .WEBGL2
          ];

    return deepFreeze({
      schema:
        SCHEMA
          .INSTANCE_SPEC,

      required: {
        [REQUIREMENT.FILE_LOADED]:
          true,

        [REQUIREMENT.CONTRACT_MATCHED]:
          true,

        [REQUIREMENT.MODEL_VALIDATED]:
          true,

        [REQUIREMENT.INSTANCE_CREATED]:
          true,

        [REQUIREMENT.MOUNT_PRESENT]:
          true,

        [REQUIREMENT.SURFACE_NONZERO]:
          true,

        [REQUIREMENT.BACKEND_INITIALIZED]:
          true,

        [REQUIREMENT.RESOURCES_UPLOADED]:
          true,

        [REQUIREMENT.FIRST_FRAME_SUBMITTED]:
          true,

        [REQUIREMENT.FIRST_FRAME_PRESENTED]:
          true,

        [REQUIREMENT.VISIBLE_PIXEL_OBSERVED]:
          true,

        [REQUIREMENT.NO_BLOCKING_ERROR]:
          true,

        ...(
          requiresInteraction
            ? {
                [REQUIREMENT.INTERACTION_OBSERVED]:
                  true
              }
            : {}
        ),

        ...(
          requiresFallback
            ? {
                [REQUIREMENT.FALLBACK_AVAILABLE]:
                  true
              }
            : {}
        ),

        ...(
          isPlainObject(
            source.required
          )
            ? source.required
            : {}
        )
      },

      optional: {
        [REQUIREMENT.CONTEXT_RECOVERY_AVAILABLE]:
          true,

        [REQUIREMENT.DISPOSAL_OBSERVED]:
          true,

        ...(
          isPlainObject(
            source.optional
          )
            ? source.optional
            : {}
        )
      },

      forbidden: {
        [FORBIDDEN.GLOBAL_SINGLETON_DEPENDENCY]:
          true,

        [FORBIDDEN.ROUTE_SPECIFIC_ENGINE_DUPLICATION]:
          true,

        [FORBIDDEN.MODEL_OWNS_SHARED_RENDERING]:
          true,

        [FORBIDDEN.PRODUCT_ENGINE_IN_FRAME_LOOP]:
          true,

        [FORBIDDEN.SPEC_COPIED_TO_OPS]:
          true,

        [FORBIDDEN.SILENT_CONTEXT_LOSS]:
          true,

        [FORBIDDEN.SILENT_RESOURCE_LEAK]:
          true,

        [FORBIDDEN.SILENT_BUFFER_MUTATION]:
          true,

        ...(
          isPlainObject(
            source.forbidden
          )
            ? source.forbidden
            : {}
        )
      },

      backend: {
        preferred:
          Array.isArray(
            source.preferredBackend
          )
            ? source
                .preferredBackend
                .map(
                  value =>
                    enumValue(
                      ENUM.BACKEND,
                      value,
                      ENUM
                        .BACKEND
                        .NONE
                    )
                )
            : [
                ENUM
                  .BACKEND
                  .WEBGPU,

                ENUM
                  .BACKEND
                  .WEBGL2
              ],

        requiredAny:
          requiredBackend.map(
            value =>
              enumValue(
                ENUM.BACKEND,
                value,
                ENUM
                  .BACKEND
                  .NONE
              )
          ),

        fallback:
          Array.isArray(
            source.fallbackBackend
          )
            ? source
                .fallbackBackend
                .map(
                  value =>
                    enumValue(
                      ENUM.BACKEND,
                      value,
                      ENUM
                        .BACKEND
                        .NONE
                    )
                )
            : [
                ENUM
                  .BACKEND
                  .CANVAS2D,

                ENUM
                  .BACKEND
                  .SVG,

                ENUM
                  .BACKEND
                  .HTML
              ]
      },

      capabilities:
        isPlainObject(
          source.capabilities
        )
          ? clone(
              source.capabilities
            )
          : {},

      metadata: {
        interactionMode,

        requiresInteraction,

        requiresFallback,

        ...(
          isPlainObject(
            source.metadata
          )
            ? clone(
                source.metadata
              )
            : {}
        )
      }
    });
  }

  function deriveReceiptState(
    comparison,
    ops
  ) {
    if (
      ops.state ===
      ENUM
        .INSTANCE_STATE
        .DESTROYED
    ) {
      return {
        state:
          ENUM
            .INSTANCE_STATE
            .DESTROYED,

        status:
          "DESTROYED",

        ready:
          false
      };
    }

    if (
      ops.state ===
      ENUM
        .INSTANCE_STATE
        .CONTEXT_LOST
    ) {
      return {
        state:
          ENUM
            .INSTANCE_STATE
            .CONTEXT_LOST,

        status:
          "CONTEXT_LOST",

        ready:
          false
      };
    }

    if (
      comparison.status ===
      ENUM
        .COMPARISON_STATUS
        .CONFLICT
    ) {
      return {
        state:
          ENUM
            .INSTANCE_STATE
            .HELD,

        status:
          "CONFLICT",

        ready:
          false
      };
    }

    if (
      comparison.status ===
      ENUM
        .COMPARISON_STATUS
        .FAIL
    ) {
      return {
        state:
          ops.errors.length >
          0
            ? ENUM
                .INSTANCE_STATE
                .ERROR
            : ENUM
                .INSTANCE_STATE
                .DEGRADED,

        status:
          ops.errors.length >
          0
            ? "ERROR"
            : "DEGRADED",

        ready:
          false
      };
    }

    if (
      comparison.status ===
        ENUM
          .COMPARISON_STATUS
          .HOLD ||

      comparison.status ===
        ENUM
          .COMPARISON_STATUS
          .PARTIAL_PASS
    ) {
      return {
        state:
          ENUM
            .INSTANCE_STATE
            .HELD,

        status:
          "HELD",

        ready:
          false
      };
    }

    if (
      comparison.ready
    ) {
      return {
        state:
          ENUM
            .INSTANCE_STATE
            .VERIFIED,

        status:
          "READY",

        ready:
          true
      };
    }

    return {
      state:
        ops.state,

      status:
        "UNVERIFIED",

      ready:
        false
    };
  }

  function composeReceipt(input) {
    const source =
      isPlainObject(
        input
      )
        ? input
        : {};

    const news =
      normalizeNews(
        source.news
      );

    const fibonacci =
      normalizeFibonacci(
        source.fibonacci
      );

    const spec =
      normalizeSpec(
        source.spec
      );

    const ops =
      normalizeOps(
        source.ops
      );

    const comparison =
      source.comparison
        ? clone(
            source.comparison
          )
        : compareSpecAndOps(
            spec,
            ops
          );

    const derived =
      deriveReceiptState(
        comparison,
        ops
      );

    const composedAt =
      stringValue(
        source.composedAt,
        new Date()
          .toISOString()
      );

    const core = {
      schema:
        SCHEMA.RECEIPT,

      authority:
        CONTRACT,

      hybridAuthority:
        HYBRID_AUTHORITY,

      identity:
        isPlainObject(
          source.identity
        )
          ? clone(
              source.identity
            )
          : {},

      news,

      fibonacci,

      specHash:
        hash(
          spec
        ),

      opsHash:
        hash(
          ops
        ),

      comparisonHash:
        hash(
          comparison
        ),

      state:
        derived.state,

      status:
        derived.status,

      ready:
        derived.ready,

      comparison,

      ops:
        plain(
          ops
        ),

      metadata:
        isPlainObject(
          source.metadata
        )
          ? clone(
              source.metadata
            )
          : {},

      composedAt
    };

    return deepFreeze({
      ...core,

      receiptHash:
        hash({
          ...core,

          composedAt:
            undefined
        })
    });
  }

  function assertModelPackage(input) {
    const result =
      validateModelPackage(
        input
      );

    if (!result.passed) {
      const error =
        new Error(
          `[${CONTRACT}] Model package validation failed: ` +
          result
            .failures
            .map(
              entry =>
                entry.id
            )
            .join(", ")
        );

      error.name =
        "DGBModelPackageValidationError";

      error.validation =
        result;

      throw error;
    }

    return result.normalized;
  }

  function selfValidate() {
    const audit =
      collector(
        "authority"
      );

    audit.add(
      "model-schema",

      SCHEMA.MODEL ===
      "DGB_MODEL_PACKAGE_v1",

      "DGB_MODEL_PACKAGE_v1",

      SCHEMA.MODEL,

      "Model schema must remain locked."
    );

    audit.add(
      "fibonacci-order",

      FIBONACCI_SEQUENCE.every(
        (
          value,
          index
        ) =>
          index ===
            0 ||

          value >
          FIBONACCI_SEQUENCE[
            index -
            1
          ]
      ),

      true,

      FIBONACCI_SEQUENCE,

      "Fibonacci gates must remain strictly increasing."
    );

    audit.add(
      "webgl2-baseline",

      ENUM
        .BACKEND
        .WEBGL2 ===
        "WEBGL2",

      "WEBGL2",

      ENUM
        .BACKEND
        .WEBGL2,

      "WebGL 2 remains first verified GPU baseline."
    );

    audit.add(
      "no-final-verdict",

      DEFAULT
        .OWNERSHIP
        .ownsFinalVerdict ===
        false,

      false,

      DEFAULT
        .OWNERSHIP
        .ownsFinalVerdict,

      "Models may not own final verdict."
    );

    const declared =
      createDeclaredOps();

    audit.add(
      "declared-not-ready",

      declared.state ===
        ENUM
          .INSTANCE_STATE
          .DECLARED &&

      declared
        .observed
        .visiblePixelObserved ===
        false,

      true,

      declared,

      "Declared OPS may not imply readiness."
    );

    const spec =
      createInstanceSpec({
        interactionMode:
          ENUM
            .INTERACTION_MODE
            .NONE
      });

    audit.add(
      "visible-proof-required",

      spec
        .required
        .visiblePixelObserved ===
        true,

      true,

      spec
        .required
        .visiblePixelObserved,

      "Standard readiness requires visible-pixel proof."
    );

    audit.add(
      "spec-ops-separated",

      hash(
        spec
      ) !==
      hash(
        declared
      ),

      true,

      hash(
        spec
      ) !==
      hash(
        declared
      ),

      "SPEC and OPS must remain distinct records."
    );

    return audit.result();
  }

  const AUTHORITY_VALIDATION =
    selfValidate();

  const AUTHORITY_RECEIPT =
    deepFreeze({
      schema:
        SCHEMA.RECEIPT,

      contract:
        CONTRACT,

      hybridAuthority:
        HYBRID_AUTHORITY,

      version:
        VERSION,

      file:
        FILE,

      modelSchema:
        SCHEMA.MODEL,

      specSchema:
        SCHEMA.SPEC,

      opsSchema:
        SCHEMA.OPS,

      receiptSchema:
        SCHEMA.RECEIPT,

      status:
        AUTHORITY_VALIDATION
          .passed
          ? "READY"
          : "INVALID",

      ready:
        AUTHORITY_VALIDATION
          .passed,

      fibonacciGate:
        FIBONACCI_GATE.F13,

      nextFibonacciGate:
        FIBONACCI_GATE.F21,

      ownsDOM:
        false,

      ownsCanvas:
        false,

      ownsWebGL:
        false,

      ownsWebGPU:
        false,

      ownsShaders:
        false,

      ownsBuffers:
        false,

      ownsInput:
        false,

      ownsModelGeometry:
        false,

      ownsFinalVerdict:
        false,

      validationPassCount:
        AUTHORITY_VALIDATION
          .passCount,

      validationFailCount:
        AUTHORITY_VALIDATION
          .failCount,

      contractHash:
        hash({
          contract:
            CONTRACT,

          hybridAuthority:
            HYBRID_AUTHORITY,

          version:
            VERSION,

          schemas:
            SCHEMA,

          fibonacci:
            FIBONACCI_SEQUENCE,

          backends:
            Object.values(
              ENUM.BACKEND
            ),

          primitives:
            Object.values(
              ENUM.PRIMITIVE
            ),

          states:
            Object.values(
              ENUM
                .INSTANCE_STATE
            )
        })
    });

  function getAuthorityReceipt() {
    return clone(
      AUTHORITY_RECEIPT
    );
  }

  function getAuthorityValidation() {
    return clone(
      AUTHORITY_VALIDATION
    );
  }

  const API =
    deepFreeze({
      contract:
        CONTRACT,

      hybridAuthority:
        HYBRID_AUTHORITY,

      version:
        VERSION,

      file:
        FILE,

      schemas:
        SCHEMA,

      enums:
        deepFreeze({
          ...ENUM,

          FIBONACCI_GATE,

          REQUIREMENT,

          FORBIDDEN
        }),

      defaults:
        DEFAULT,

      clone,

      plain,

      deepFreeze,

      stableStringify,

      hash,

      normalizeNews,

      normalizeFibonacci,

      normalizeOwnership,

      normalizeAttribute,

      normalizeRenderState,

      normalizeMesh,

      normalizeRenderPass:
        normalizePass,

      normalizeSpec,

      normalizeOps,

      normalizeModelPackage,

      validateAttribute,

      validateMesh,

      validateRenderPass,

      validateSpec,

      validateOps,

      validateModelPackage,

      assertModelPackage,

      compareSpecAndOps,

      composeReceipt,

      createDeclaredOps,

      createInstanceSpec,

      previousFibonacciGate:
        previousGate,

      nextFibonacciGate:
        nextGate,

      getAuthorityReceipt,

      getAuthorityValidation
    });

  root.DGBEngineContract =
    API;

  root.DGB_ENGINE_CONTRACT =
    API;

  root.DGB_ENGINE_CONTRACT_RECEIPT =
    AUTHORITY_RECEIPT;

  root.__DGB_ENGINE_CONTRACT_LOADED__ =
    true;

  root.__DGB_ENGINE_CONTRACT_VERSION__ =
    VERSION;

  root.__DGB_ENGINE_CONTRACT_MODEL_SCHEMA__ =
    SCHEMA.MODEL;

  if (
    !AUTHORITY_VALIDATION
      .passed
  ) {
    throw new Error(
      `[${CONTRACT}] Authority self-validation failed: ` +
      AUTHORITY_VALIDATION
        .failures
        .map(
          entry =>
            entry.id
        )
        .join(", ")
    );
  }

  if (
    typeof module !==
      "undefined" &&

    module.exports
  ) {
    module.exports =
      API;
  }
})(
  typeof window !==
  "undefined"
    ? window
    : globalThis
);
