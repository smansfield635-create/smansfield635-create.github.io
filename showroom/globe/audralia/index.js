// /showroom/globe/audralia/index.js
// AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_TNT_v1
// Version: 1.1.0
// Full-file replacement.
// Previous contract: AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_TNT_v1
// Previous version: 1.0.0
// Renewal class: ADDITIVE_RUNTIME_EVIDENCE_RENEWAL
// Visible runtime behavior, rendering, geometry, controls, and compatibility preserved.
// Architecture-neutral runtime evidence only.
// No synthetic F13 evidence or unsupported readiness claims.

(function installAudraliaPlanetRuntime(root, doc) {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_TNT_v1";
  const RECEIPT = "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_RECEIPT_v1";
  const FILE = "/showroom/globe/audralia/index.js";
  const VERSION = "1.1.0";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_TNT_v1";
  const PREVIOUS_VERSION = "1.0.0";
  const RENEWAL_CLASS = "ADDITIVE_RUNTIME_EVIDENCE_RENEWAL";
  const RUNTIME_GLOBAL_NAME = "DGBAudraliaPlanetRuntime";
  const MODEL_ID = "audralia-planet-3d-g1";
  const PRIMARY_RENDERER_BACKEND = "webgl";

  const STAGE_ID = "audraliaGlobeStage";
  const MOUNT_ID = "audraliaGlobeMount";
  const MAX_DPR = 2;
  const MIN_DISTANCE = 2.35;
  const MAX_DISTANCE = 5.4;
  const DEFAULT_DISTANCE = 3.15;
  const DEFAULT_YAW = 0.58;
  const DEFAULT_PITCH = -0.18;
  const AXIAL_TILT = -0.19;
  const IDLE_DELAY = 2600;
  const AUTO_MOUNT_LIMIT = 160;

  /*
   * Evidence-state law:
   *
   * `state` describes how the value became admissible.
   * Boolean falsity is carried by `value: false`; it is not a separate state.
   *
   * OBSERVED + false means false was directly observed.
   * DECLARED + false means the implementation declares the condition absent
   * by architecture.
   * DERIVED + false means false was obtained through a bounded derivation.
   * UNAVAILABLE and NOT_APPLICABLE carry value null.
   */
  const EVIDENCE_STATE = Object.freeze({
    OBSERVED: "OBSERVED",
    DECLARED: "DECLARED",
    DERIVED: "DERIVED",
    UNAVAILABLE: "UNAVAILABLE",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    CONFLICT: "CONFLICT",
    UNKNOWN: "UNKNOWN"
  });

  const EVIDENCE_KIND = Object.freeze({
    RUNTIME_DECLARATION: "RUNTIME_DECLARATION",
    DIRECT_RUNTIME_OBSERVATION: "DIRECT_RUNTIME_OBSERVATION",
    DIRECT_GPU_OBSERVATION: "DIRECT_GPU_OBSERVATION",
    DIRECT_DOM_OBSERVATION: "DIRECT_DOM_OBSERVATION",
    DIRECT_RENDER_OBSERVATION: "DIRECT_RENDER_OBSERVATION",
    BOUNDED_DERIVATION: "BOUNDED_DERIVATION",
    DELEGATED_GEOMETRY_EVIDENCE: "DELEGATED_GEOMETRY_EVIDENCE"
  });

  const COLORS = Object.freeze([
    [0.018, 0.075, 0.190],
    [0.026, 0.170, 0.340],
    [0.055, 0.310, 0.480],
    [0.580, 0.660, 0.570],
    [0.820, 0.720, 0.480],
    [0.200, 0.460, 0.240],
    [0.075, 0.300, 0.160],
    [0.550, 0.410, 0.210],
    [0.260, 0.390, 0.220],
    [0.340, 0.310, 0.300],
    [0.900, 0.940, 0.970],
    [0.075, 0.350, 0.480],
    [0.045, 0.230, 0.420]
  ]);

  const state = {
    installedAt: iso(),
    updatedAt: "",

    stage: null,
    mount: null,
    canvas: null,
    fallbackCanvas: null,
    fallbackContext: null,

    gl: null,
    geometryAuthority: null,
    geometryPacket: null,

    programs: {},
    meshes: {},

    width: 0,
    height: 0,
    pixelWidth: 0,
    pixelHeight: 0,
    dpr: 1,

    mounted: false,
    initializing: false,
    running: false,
    destroyed: false,
    paused: false,
    reducedMotion: false,
    hidden: false,

    contextLost: false,
    contextRestoreCount: 0,

    fallbackActive: false,
    fallbackReason: "",

    stageRectNonzero: false,
    terrainLevel: null,

    yaw: DEFAULT_YAW,
    pitch: DEFAULT_PITCH,
    distance: DEFAULT_DISTANCE,

    cloudsVisible: true,
    atmosphereVisible: true,
    autoRotate: true,

    pointers: new Map(),
    dragId: null,
    pinchDistance: 0,
    interacting: false,

    lastInteractionAt: 0,

    frameId: 0,
    lastFrameAt: 0,
    frameCount: 0,
    drawCount: 0,

    firstFrameDrawn: false,
    firstVisiblePixelObserved: false,
    firstFrameAt: null,

    lastFrameDurationMs: 0,
    averageFrameDurationMs: 0,
    frameAccumulator: 0,
    frameSamples: 0,

    needsRender: true,

    resizeObserver: null,
    listeners: [],
    buttons: [],

    autoMountAttempts: 0,
    autoMountTimer: 0,

    errors: [],
    shaderErrors: [],
    events: [],

    lastReceipt: null,

    shaderCompileAttemptCount: 0,
    shaderCompileSuccessCount: 0,
    shaderCompileFailureCount: 0,

    programLinkAttemptCount: 0,
    programLinkSuccessCount: 0,
    programLinkFailureCount: 0,

    renderInvocationCount: 0,
    renderSubmissionCount: 0,

    firstRenderSubmissionObserved: false,

    webGLFrameMatricesConstructed: false,
    webGLViewProjectionExecuted: false,
    fallbackViewTransformExecuted: false,
    fallbackWorldRendered: false,

    lastFrameMatricesAt: null,
    lastViewProjectionExecutionAt: null,
    lastFallbackViewTransformAt: null,
    lastFallbackWorldRenderAt: null,

    lastRenderInvocationAt: null,
    lastRenderSubmissionAt: null,
    lastDrawAt: null,
    lastVisiblePresentationAt: null,

    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  };

  function iso() {
    return new Date().toISOString();
  }

  function fn(value) {
    return typeof value === "function";
  }

  function number(value, fallback = 0) {
    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(
        maximum,
        number(value, minimum)
      )
    );
  }

  function plain(value) {
    if (value === undefined) {
      return undefined;
    }

    if (ArrayBuffer.isView(value)) {
      return {
        type: value.constructor.name,
        length: value.length
      };
    }

    try {
      return JSON.parse(
        JSON.stringify(value)
      );
    } catch (_error) {
      return String(value);
    }
  }

  function freezeOwned(value, seen = new Set()) {
    if (
      value === null ||
      (
        typeof value !== "object" &&
        typeof value !== "function"
      ) ||
      seen.has(value)
    ) {
      return value;
    }

    seen.add(value);

    let names = [];

    try {
      names = Object.getOwnPropertyNames(value);
    } catch (_error) {
      names = [];
    }

    for (const name of names) {
      try {
        freezeOwned(value[name], seen);
      } catch (_error) {}
    }

    try {
      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function evidenceRecord(
    value,
    evidenceState,
    evidenceKind,
    source,
    options = {}
  ) {
    const record = {
      value,
      state: evidenceState,
      evidenceKind,
      source,
      owner:
        options.owner ||
        RUNTIME_GLOBAL_NAME,
      observedAt:
        options.observedAt ||
        null,
      derivedFrom:
        Array.isArray(options.derivedFrom)
          ? options.derivedFrom.slice()
          : [],
      confidence:
        options.confidence ||
        "HIGH",
      reason:
        options.reason ||
        null
    };

    return freezeOwned(record);
  }

  function declaredEvidence(
    value,
    source,
    options = {}
  ) {
    return evidenceRecord(
      value,
      EVIDENCE_STATE.DECLARED,
      EVIDENCE_KIND.RUNTIME_DECLARATION,
      source,
      options
    );
  }

  function declaredFalseEvidence(
    source,
    reason,
    options = {}
  ) {
    return declaredEvidence(
      false,
      source,
      {
        ...options,
        reason
      }
    );
  }

  function observedEvidence(
    value,
    source,
    observedAt,
    options = {}
  ) {
    return evidenceRecord(
      value,
      EVIDENCE_STATE.OBSERVED,
      options.evidenceKind ||
        EVIDENCE_KIND.DIRECT_RUNTIME_OBSERVATION,
      source,
      {
        ...options,
        observedAt:
          observedAt ||
          state.updatedAt ||
          state.installedAt
      }
    );
  }

  function derivedEvidence(
    value,
    source,
    derivedFrom,
    options = {}
  ) {
    return evidenceRecord(
      value,
      EVIDENCE_STATE.DERIVED,
      EVIDENCE_KIND.BOUNDED_DERIVATION,
      source,
      {
        ...options,
        derivedFrom
      }
    );
  }

  function unavailableEvidence(
    source,
    reason,
    options = {}
  ) {
    return evidenceRecord(
      null,
      EVIDENCE_STATE.UNAVAILABLE,
      options.evidenceKind ||
        EVIDENCE_KIND.DIRECT_RUNTIME_OBSERVATION,
      source,
      {
        ...options,
        confidence:
          options.confidence ||
          "HIGH",
        reason
      }
    );
  }

  function notApplicableEvidence(
    source,
    reason,
    options = {}
  ) {
    return evidenceRecord(
      null,
      EVIDENCE_STATE.NOT_APPLICABLE,
      options.evidenceKind ||
        EVIDENCE_KIND.RUNTIME_DECLARATION,
      source,
      {
        ...options,
        reason
      }
    );
  }

  function event(type, detail = {}) {
    const entry = {
      type,
      detail: plain(detail),
      time: iso()
    };

    state.events.push(entry);

    if (state.events.length > 192) {
      state.events.splice(
        0,
        state.events.length - 192
      );
    }

    state.updatedAt = entry.time;

    return entry;
  }

  function fail(scope, error) {
    const entry = {
      scope,
      message:
        error && error.message
          ? error.message
          : String(error),
      time: iso()
    };

    state.errors.push(entry);

    if (state.errors.length > 96) {
      state.errors.splice(
        0,
        state.errors.length - 96
      );
    }

    event(
      "AUDRALIA_PLANET_RUNTIME_ERROR",
      entry
    );

    publish();

    return entry;
  }

  function shaderFail(stage, message) {
    const entry = {
      stage,
      message: String(message),
      time: iso()
    };

    state.shaderErrors.push(entry);

    if (state.shaderErrors.length > 24) {
      state.shaderErrors.splice(
        0,
        state.shaderErrors.length - 24
      );
    }

    event(
      "AUDRALIA_PLANET_SHADER_ERROR",
      entry
    );

    return entry;
  }

  function emit(name, detail) {
    if (
      !root ||
      !fn(root.dispatchEvent) ||
      typeof root.CustomEvent !== "function"
    ) {
      return false;
    }

    try {
      root.dispatchEvent(
        new root.CustomEvent(
          name,
          {
            detail: plain(detail)
          }
        )
      );

      return true;
    } catch (_error) {
      return false;
    }
  }

  function listen(
    target,
    type,
    handler,
    options
  ) {
    if (
      !target ||
      !fn(target.addEventListener)
    ) {
      return false;
    }

    target.addEventListener(
      type,
      handler,
      options
    );

    state.listeners.push({
      target,
      type,
      handler,
      options
    });

    return true;
  }

  function unlistenAll() {
    for (const item of state.listeners) {
      try {
        item.target.removeEventListener(
          item.type,
          item.handler,
          item.options
        );
      } catch (_error) {}
    }

    state.listeners.length = 0;

    for (const item of state.buttons) {
      try {
        item.element.removeEventListener(
          "click",
          item.handler
        );
      } catch (_error) {}
    }

    state.buttons.length = 0;
  }

  function dataset(
    target,
    key,
    value
  ) {
    if (
      target &&
      target.dataset
    ) {
      try {
        target.dataset[key] =
          String(value);
      } catch (_error) {}
    }
  }

  function m4Identity() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  function m4Multiply(a, b) {
    const output =
      new Float32Array(16);

    for (
      let column = 0;
      column < 4;
      column += 1
    ) {
      for (
        let row = 0;
        row < 4;
        row += 1
      ) {
        output[
          column * 4 + row
        ] =
          a[row] *
          b[column * 4] +

          a[4 + row] *
          b[column * 4 + 1] +

          a[8 + row] *
          b[column * 4 + 2] +

          a[12 + row] *
          b[column * 4 + 3];
      }
    }

    return output;
  }

  function m4Perspective(
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const f =
      1 /
      Math.tan(
        fieldOfView / 2
      );

    const inverse =
      1 /
      (
        near - far
      );

    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0,
      (near + far) * inverse,
      -1,
      0, 0,
      near * far * inverse * 2,
      0
    ]);
  }

  function m4Translate(
    x,
    y,
    z
  ) {
    const output =
      m4Identity();

    output[12] = x;
    output[13] = y;
    output[14] = z;

    return output;
  }

  function m4RotateX(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return new Float32Array([
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ]);
  }

  function m4RotateY(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return new Float32Array([
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
    ]);
  }

  function m4RotateZ(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return new Float32Array([
      cosine, sine, 0, 0,
      -sine, cosine, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  function m3Rotation(matrix) {
    return new Float32Array([
      matrix[0],
      matrix[1],
      matrix[2],

      matrix[4],
      matrix[5],
      matrix[6],

      matrix[8],
      matrix[9],
      matrix[10]
    ]);
  }

  function transform(
    matrix,
    point
  ) {
    return [
      matrix[0] *
      point[0] +

      matrix[4] *
      point[1] +

      matrix[8] *
      point[2],

      matrix[1] *
      point[0] +

      matrix[5] *
      point[1] +

      matrix[9] *
      point[2],

      matrix[2] *
      point[0] +

      matrix[6] *
      point[1] +

      matrix[10] *
      point[2]
    ];
  }

  function modelMatrix() {
    return m4Multiply(
      m4RotateZ(
        AXIAL_TILT
      ),

      m4Multiply(
        m4RotateX(
          state.pitch
        ),

        m4RotateY(
          state.yaw
        )
      )
    );
  }

  function resolveElements(
    options = {}
  ) {
    if (!doc) {
      return {
        stage: null,
        mount: null
      };
    }

    const stage =
      options.stage ||

      doc.getElementById(
        options.stageId ||
        STAGE_ID
      ) ||

      doc.querySelector(
        "[data-audralia-globe-stage]"
      ) ||

      doc.querySelector(
        "[data-audralia-planet-stage]"
      );

    const mount =
      options.mount ||

      doc.getElementById(
        options.mountId ||
        MOUNT_ID
      ) ||

      doc.querySelector(
        "[data-audralia-globe-mount]"
      ) ||

      doc.querySelector(
        "[data-audralia-planet-mount]"
      ) ||

      stage;

    return {
      stage:
        stage ||
        mount ||
        null,

      mount:
        mount ||
        stage ||
        null
    };
  }

  function geometryAuthority() {
    let authority = null;

    try {
      authority =
        root &&
        root.DGBAudraliaPlanetGeometry;
    } catch (_error) {
      authority = null;
    }

    return (
      authority &&
      fn(
        authority.createGeometry
      ) &&
      fn(
        authority.createTerrainMesh
      )
    )
      ? authority
      : null;
  }

  function terrainLevel(
    options = {}
  ) {
    if (
      Number.isFinite(
        Number(
          options.terrainLevel
        )
      )
    ) {
      return clamp(
        Math.floor(
          Number(
            options.terrainLevel
          )
        ),
        0,
        6
      );
    }

    const narrow =
      root &&
      fn(root.matchMedia)
        ? root.matchMedia(
            "(max-width: 760px)"
          ).matches
        : false;

    const coarse =
      root &&
      fn(root.matchMedia)
        ? root.matchMedia(
            "(pointer: coarse)"
          ).matches
        : false;

    const memory =
      root &&
      root.navigator
        ? number(
            root.navigator.deviceMemory,
            4
          )
        : 4;

    return (
      narrow ||
      coarse ||
      memory < 4 ||
      state.reducedMotion
    )
      ? 5
      : 6;
  }

  function makeCanvas(fallback) {
    if (
      !doc ||
      !state.mount
    ) {
      return null;
    }

    const attribute =
      fallback
        ? "data-audralia-planet-fallback-canvas"
        : "data-audralia-planet-runtime-canvas";

    let canvas =
      state.mount.querySelector(
        `canvas[${attribute}]`
      );

    if (!canvas) {
      canvas =
        doc.createElement(
          "canvas"
        );

      canvas.setAttribute(
        attribute,
        "true"
      );

      canvas.setAttribute(
        "aria-label",

        fallback
          ? "Fallback rendering of Audralia"
          : "Interactive three-dimensional model of Audralia"
      );

      canvas.setAttribute(
        "role",
        "img"
      );

      state.mount.appendChild(
        canvas
      );
    }

    canvas.tabIndex = 0;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.outline = "none";

    if (fallback) {
      state.fallbackCanvas =
        canvas;

      state.fallbackContext =
        canvas.getContext(
          "2d",
          {
            alpha: true
          }
        );
    } else {
      state.canvas =
        canvas;
    }

    return canvas;
  }

  function webgl(canvas) {
    if (
      !canvas ||
      !fn(canvas.getContext)
    ) {
      return null;
    }

    try {
      return (
        canvas.getContext(
          "webgl",
          {
            alpha: true,
            antialias: true,
            depth: true,
            stencil: false,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false
          }
        ) ||

        canvas.getContext(
          "experimental-webgl"
        )
      );
    } catch (_error) {
      return null;
    }
  }

  function compile(
    gl,
    type,
    source,
    label
  ) {
    state.shaderCompileAttemptCount += 1;

    const shader =
      gl.createShader(
        type
      );

    if (!shader) {
      state.shaderCompileFailureCount += 1;

      throw new Error(
        `Unable to create ${label} shader.`
      );
    }

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(
      shader
    );

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const message =
        gl.getShaderInfoLog(
          shader
        ) ||

        `${label} shader failed.`;

      state.shaderCompileFailureCount += 1;

      shaderFail(
        label,
        message
      );

      gl.deleteShader(
        shader
      );

      throw new Error(
        message
      );
    }

    state.shaderCompileSuccessCount += 1;

    event(
      "AUDRALIA_PLANET_SHADER_COMPILED",
      {
        label
      }
    );

    return shader;
  }

  function program(
    gl,
    vertexSource,
    fragmentSource,
    label
  ) {
    const vertex =
      compile(
        gl,
        gl.VERTEX_SHADER,
        vertexSource,
        `${label}:vertex`
      );

    const fragment =
      compile(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentSource,
        `${label}:fragment`
      );

    state.programLinkAttemptCount += 1;

    const linked =
      gl.createProgram();

    if (!linked) {
      state.programLinkFailureCount += 1;

      throw new Error(
        `Unable to create ${label} program.`
      );
    }

    gl.attachShader(
      linked,
      vertex
    );

    gl.attachShader(
      linked,
      fragment
    );

    gl.linkProgram(
      linked
    );

    gl.deleteShader(
      vertex
    );

    gl.deleteShader(
      fragment
    );

    if (
      !gl.getProgramParameter(
        linked,
        gl.LINK_STATUS
      )
    ) {
      const message =
        gl.getProgramInfoLog(
          linked
        ) ||

        `${label} link failed.`;

      state.programLinkFailureCount += 1;

      shaderFail(
        label,
        message
      );

      gl.deleteProgram(
        linked
      );

      throw new Error(
        message
      );
    }

    state.programLinkSuccessCount += 1;

    event(
      "AUDRALIA_PLANET_PROGRAM_LINKED",
      {
        label
      }
    );

    return linked;
  }

  function createPrograms(gl) {
    const terrainVertex = `
      precision highp float;

      attribute vec3 a_position;
      attribute vec3 a_normal;
      attribute vec3 a_color;

      uniform mat4 u_model;
      uniform mat4 u_viewProjection;
      uniform mat3 u_normalMatrix;

      varying vec3 v_world;
      varying vec3 v_normal;
      varying vec3 v_color;

      void main(void) {
        vec4 world =
          u_model *
          vec4(
            a_position,
            1.0
          );

        v_world =
          world.xyz;

        v_normal =
          normalize(
            u_normalMatrix *
            a_normal
          );

        v_color =
          a_color;

        gl_Position =
          u_viewProjection *
          world;
      }
    `;

    const terrainFragment = `
      precision highp float;

      varying vec3 v_world;
      varying vec3 v_normal;
      varying vec3 v_color;

      uniform vec3 u_camera;
      uniform vec3 u_light;
      uniform vec3 u_fill;

      void main(void) {
        vec3 normal =
          normalize(
            v_normal
          );

        vec3 viewDirection =
          normalize(
            u_camera -
            v_world
          );

        vec3 lightDirection =
          normalize(
            -u_light
          );

        vec3 fillDirection =
          normalize(
            -u_fill
          );

        float key =
          max(
            dot(
              normal,
              lightDirection
            ),
            0.0
          );

        float fill =
          max(
            dot(
              normal,
              fillDirection
            ),
            0.0
          );

        float hemisphere =
          normal.y *
          0.5 +
          0.5;

        float rim =
          pow(
            1.0 -
            max(
              dot(
                normal,
                viewDirection
              ),
              0.0
            ),
            2.7
          );

        float specular =
          pow(
            max(
              dot(
                reflect(
                  -lightDirection,
                  normal
                ),
                viewDirection
              ),
              0.0
            ),
            36.0
          );

        vec3 color =
          v_color *
          mix(
            0.16,
            0.27,
            hemisphere
          ) +

          v_color *
          key *
          vec3(
            1.00,
            0.96,
            0.88
          ) *
          0.86 +

          v_color *
          fill *
          vec3(
            0.30,
            0.54,
            0.78
          ) *
          0.23 +

          vec3(
            0.44,
            0.58,
            0.72
          ) *
          specular *
          0.24 +

          vec3(
            0.06,
            0.16,
            0.24
          ) *
          rim *
          0.22;

        gl_FragColor =
          vec4(
            pow(
              max(
                color,
                vec3(0.0)
              ),
              vec3(0.92)
            ),
            1.0
          );
      }
    `;

    const shellVertex = `
      precision highp float;

      attribute vec3 a_position;
      attribute vec3 a_normal;

      uniform mat4 u_model;
      uniform mat4 u_viewProjection;
      uniform mat3 u_normalMatrix;

      varying vec3 v_world;
      varying vec3 v_normal;
      varying vec3 v_local;

      void main(void) {
        vec4 world =
          u_model *
          vec4(
            a_position,
            1.0
          );

        v_world =
          world.xyz;

        v_normal =
          normalize(
            u_normalMatrix *
            a_normal
          );

        v_local =
          normalize(
            a_position
          );

        gl_Position =
          u_viewProjection *
          world;
      }
    `;

    const shellFragment = `
      precision highp float;

      varying vec3 v_world;
      varying vec3 v_normal;
      varying vec3 v_local;

      uniform vec3 u_camera;
      uniform vec3 u_light;
      uniform vec3 u_base;
      uniform vec3 u_secondary;

      uniform float u_alpha;
      uniform float u_kind;
      uniform float u_time;

      float clouds(vec3 direction) {
        vec3 point =
          direction *
          8.0;

        float a =
          sin(
            point.x *
            1.7 +

            point.y *
            0.8 +

            u_time *
            0.00008
          );

        float b =
          sin(
            point.y *
            2.4 -

            point.z *
            1.3 -

            u_time *
            0.00005
          );

        float c =
          sin(
            point.z *
            3.2 +

            point.x *
            0.9 +

            u_time *
            0.00003
          );

        return smoothstep(
          0.15,
          0.68,

          a *
          0.34 +

          b *
          0.31 +

          c *
          0.27 +

          0.18
        );
      }

      void main(void) {
        vec3 normal =
          normalize(
            v_normal
          );

        vec3 viewDirection =
          normalize(
            u_camera -
            v_world
          );

        vec3 lightDirection =
          normalize(
            -u_light
          );

        float diffuse =
          max(
            dot(
              normal,
              lightDirection
            ),
            0.0
          );

        float facing =
          max(
            dot(
              normal,
              viewDirection
            ),
            0.0
          );

        float rim =
          pow(
            1.0 -
            facing,
            3.0
          );

        vec3 color =
          u_base;

        float alpha =
          u_alpha;

        if (
          u_kind <
          0.5
        ) {
          float fresnel =
            pow(
              1.0 -
              facing,
              3.2
            );

          float specular =
            pow(
              max(
                dot(
                  reflect(
                    -lightDirection,
                    normal
                  ),
                  viewDirection
                ),
                0.0
              ),
              72.0
            );

          color =
            mix(
              u_base,
              u_secondary,

              fresnel *
              0.72 +

              specular *
              0.42
            );

          color +=
            vec3(
              0.04,
              0.12,
              0.20
            ) *
            diffuse;

          alpha *=
            0.66 +
            fresnel *
            0.34;
        } else if (
          u_kind <
          1.5
        ) {
          alpha *=
            clouds(
              normalize(
                v_local
              )
            );

          color =
            mix(
              u_base,
              u_secondary,
              diffuse *
              0.55
            ) *
            (
              0.42 +
              diffuse *
              0.58
            );

          if (
            alpha <
            0.025
          ) {
            discard;
          }
        } else {
          alpha *=
            pow(
              1.0 -
              facing,
              3.8
            );

          color =
            mix(
              u_base,
              u_secondary,
              rim
            );

          if (
            alpha <
            0.012
          ) {
            discard;
          }
        }

        gl_FragColor =
          vec4(
            color,
            alpha
          );
      }
    `;

    const terrain =
      program(
        gl,
        terrainVertex,
        terrainFragment,
        "terrain"
      );

    const shell =
      program(
        gl,
        shellVertex,
        shellFragment,
        "shell"
      );

    return {
      terrain: {
        program:
          terrain,

        a: {
          position:
            gl.getAttribLocation(
              terrain,
              "a_position"
            ),

          normal:
            gl.getAttribLocation(
              terrain,
              "a_normal"
            ),

          color:
            gl.getAttribLocation(
              terrain,
              "a_color"
            )
        },

        u: {
          model:
            gl.getUniformLocation(
              terrain,
              "u_model"
            ),

          viewProjection:
            gl.getUniformLocation(
              terrain,
              "u_viewProjection"
            ),

          normalMatrix:
            gl.getUniformLocation(
              terrain,
              "u_normalMatrix"
            ),

          camera:
            gl.getUniformLocation(
              terrain,
              "u_camera"
            ),

          light:
            gl.getUniformLocation(
              terrain,
              "u_light"
            ),

          fill:
            gl.getUniformLocation(
              terrain,
              "u_fill"
            )
        }
      },

      shell: {
        program:
          shell,

        a: {
          position:
            gl.getAttribLocation(
              shell,
              "a_position"
            ),

          normal:
            gl.getAttribLocation(
              shell,
              "a_normal"
            )
        },

        u: {
          model:
            gl.getUniformLocation(
              shell,
              "u_model"
            ),

          viewProjection:
            gl.getUniformLocation(
              shell,
              "u_viewProjection"
            ),

          normalMatrix:
            gl.getUniformLocation(
              shell,
              "u_normalMatrix"
            ),

          camera:
            gl.getUniformLocation(
              shell,
              "u_camera"
            ),

          light:
            gl.getUniformLocation(
              shell,
              "u_light"
            ),

          base:
            gl.getUniformLocation(
              shell,
              "u_base"
            ),

          secondary:
            gl.getUniformLocation(
              shell,
              "u_secondary"
            ),

          alpha:
            gl.getUniformLocation(
              shell,
              "u_alpha"
            ),

          kind:
            gl.getUniformLocation(
              shell,
              "u_kind"
            ),

          time:
            gl.getUniformLocation(
              shell,
              "u_time"
            )
        }
      }
    };
  }

  function arrayBuffer(
    gl,
    data
  ) {
    const buffer =
      gl.createBuffer();

    if (!buffer) {
      throw new Error(
        "Unable to allocate array buffer."
      );
    }

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      data,
      gl.STATIC_DRAW
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      null
    );

    return buffer;
  }

  function elementBuffer(
    gl,
    data
  ) {
    const buffer =
      gl.createBuffer();

    if (!buffer) {
      throw new Error(
        "Unable to allocate element buffer."
      );
    }

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      buffer
    );

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      data,
      gl.STATIC_DRAW
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      null
    );

    return buffer;
  }

  function indexType(
    gl,
    indices
  ) {
    if (
      !(
        indices instanceof
        Uint32Array
      )
    ) {
      return gl.UNSIGNED_SHORT;
    }

    const extension =
      gl.getExtension(
        "OES_element_index_uint"
      );

    if (!extension) {
      throw new Error(
        "Uint32 indices require OES_element_index_uint."
      );
    }

    return gl.UNSIGNED_INT;
  }

  function colorArray(terrain) {
    const output =
      new Float32Array(
        terrain.vertexCount *
        3
      );

    for (
      let index = 0;
      index <
      terrain.vertexCount;
      index += 1
    ) {
      const base =
        COLORS[
          terrain.materialHints[
            index
          ]
        ] ||
        COLORS[5];

      const elevation =
        terrain.elevations[
          index
        ];

      const moisture =
        terrain.moistures[
          index
        ];

      const temperature =
        terrain.temperatures[
          index
        ];

      const brightness =
        1 +

        clamp(
          elevation * 3.5,
          -0.09,
          0.16
        ) +

        clamp(
          moisture * 0.05,
          -0.03,
          0.04
        ) +

        clamp(
          temperature * 0.018,
          -0.02,
          0.02
        );

      output[
        index * 3
      ] =
        clamp(
          base[0] *
          brightness,
          0,
          1
        );

      output[
        index * 3 + 1
      ] =
        clamp(
          base[1] *
          brightness,
          0,
          1
        );

      output[
        index * 3 + 2
      ] =
        clamp(
          base[2] *
          brightness,
          0,
          1
        );
    }

    return output;
  }

  function terrainGPU(
    gl,
    terrain
  ) {
    return {
      indexCount:
        terrain.indices.length,

      indexType:
        indexType(
          gl,
          terrain.indices
        ),

      position:
        arrayBuffer(
          gl,
          terrain.positions
        ),

      normal:
        arrayBuffer(
          gl,
          terrain.normals
        ),

      color:
        arrayBuffer(
          gl,
          colorArray(
            terrain
          )
        ),

      index:
        elementBuffer(
          gl,
          terrain.indices
        ),

      geometryHash:
        terrain.geometryHash
    };
  }

  function shellGPU(
    gl,
    shell
  ) {
    return {
      indexCount:
        shell.indices.length,

      indexType:
        indexType(
          gl,
          shell.indices
        ),

      position:
        arrayBuffer(
          gl,
          shell.positions
        ),

      normal:
        arrayBuffer(
          gl,
          shell.normals
        ),

      index:
        elementBuffer(
          gl,
          shell.indices
        ),

      geometryHash:
        shell.geometryHash
    };
  }

  function deleteMesh(
    gl,
    mesh
  ) {
    if (
      !gl ||
      !mesh
    ) {
      return;
    }

    for (
      const key of [
        "position",
        "normal",
        "color",
        "index"
      ]
    ) {
      if (mesh[key]) {
        try {
          gl.deleteBuffer(
            mesh[key]
          );
        } catch (_error) {}
      }
    }
  }

  function releaseGPU() {
    if (!state.gl) {
      state.meshes = {};
      state.programs = {};
      return;
    }

    for (
      const mesh of
      Object.values(
        state.meshes
      )
    ) {
      deleteMesh(
        state.gl,
        mesh
      );
    }

    for (
      const info of
      Object.values(
        state.programs
      )
    ) {
      if (
        info &&
        info.program
      ) {
        try {
          state.gl.deleteProgram(
            info.program
          );
        } catch (_error) {}
      }
    }

    state.meshes = {};
    state.programs = {};
  }

  function geometry(
    level,
    deepValidation
  ) {
    state.geometryAuthority =
      state.geometryAuthority ||
      geometryAuthority();

    if (
      !state.geometryAuthority
    ) {
      throw new Error(
        "DGBAudraliaPlanetGeometry is unavailable."
      );
    }

    const packet =
      state.geometryAuthority
        .createGeometry({
          terrainLevel:
            level,

          oceanLevel:
            5,

          cloudLevel:
            5,

          atmosphereLevel:
            4,

          includeHydrology:
            true,

          deepValidation:
            deepValidation ===
            true
        });

    if (
      !packet ||
      !packet.validation ||
      packet.validation.passed !==
      true
    ) {
      throw new Error(
        "Audralia geometry validation did not pass."
      );
    }

    state.geometryPacket =
      packet;

    state.terrainLevel =
      level;

    return packet;
  }

  function buildGPU() {
    const gl =
      state.gl;

    const packet =
      state.geometryPacket;

    if (
      !gl ||
      !packet
    ) {
      throw new Error(
        "WebGL and geometry are required before GPU construction."
      );
    }

    releaseGPU();

    state.programs =
      createPrograms(
        gl
      );

    state.meshes = {
      terrain:
        terrainGPU(
          gl,
          packet.terrain
        ),

      ocean:
        shellGPU(
          gl,
          packet.ocean
        ),

      clouds:
        shellGPU(
          gl,
          packet.clouds
        ),

      atmosphere:
        shellGPU(
          gl,
          packet.atmosphere
        )
    };

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthFunc(
      gl.LEQUAL
    );

    gl.enable(
      gl.CULL_FACE
    );

    gl.cullFace(
      gl.BACK
    );

    gl.frontFace(
      gl.CCW
    );

    gl.clearDepth(1);

    gl.clearColor(
      0.006,
      0.012,
      0.032,
      1
    );

    event(
      "AUDRALIA_PLANET_GPU_READY",
      {
        terrainLevel:
          state.terrainLevel,

        geometryHash:
          packet.geometryHash,

        terrainVertices:
          packet
            .terrain
            .vertexCount,

        terrainTriangles:
          packet
            .terrain
            .triangleCount
      }
    );
  }

  function sizeCanvas(
    canvas,
    context
  ) {
    if (
      !canvas ||
      !state.mount
    ) {
      return false;
    }

    const rect =
      state.mount
        .getBoundingClientRect();

    state.width =
      Math.max(
        0,
        Math.floor(
          rect.width
        )
      );

    state.height =
      Math.max(
        0,
        Math.floor(
          rect.height
        )
      );

    state.stageRectNonzero =
      state.width > 0 &&
      state.height > 0;

    if (
      !state.stageRectNonzero
    ) {
      return false;
    }

    state.dpr =
      clamp(
        number(
          root &&
          root.devicePixelRatio,
          1
        ),
        1,
        MAX_DPR
      );

    state.pixelWidth =
      Math.max(
        1,
        Math.floor(
          state.width *
          state.dpr
        )
      );

    state.pixelHeight =
      Math.max(
        1,
        Math.floor(
          state.height *
          state.dpr
        )
      );

    if (
      canvas.width !==
      state.pixelWidth ||

      canvas.height !==
      state.pixelHeight
    ) {
      canvas.width =
        state.pixelWidth;

      canvas.height =
        state.pixelHeight;
    }

    if (
      context &&
      fn(context.setTransform)
    ) {
      context.setTransform(
        state.dpr,
        0,
        0,
        state.dpr,
        0,
        0
      );
    }

    return true;
  }

  function resize() {
    if (state.canvas) {
      sizeCanvas(
        state.canvas,
        null
      );
    }

    if (
      state.fallbackCanvas
    ) {
      sizeCanvas(
        state.fallbackCanvas,
        state.fallbackContext
      );
    }

    if (
      state.gl &&
      state.stageRectNonzero
    ) {
      state.gl.viewport(
        0,
        0,
        state.pixelWidth,
        state.pixelHeight
      );
    }

    state.needsRender =
      true;

    if (
      state.fallbackActive
    ) {
      drawFallback();
    }

    publishData();

    return state.stageRectNonzero;
  }

  function setupResize() {
    if (!state.mount) {
      return;
    }

    if (
      root &&
      typeof root.ResizeObserver ===
      "function"
    ) {
      state.resizeObserver =
        new root.ResizeObserver(
          resize
        );

      state.resizeObserver.observe(
        state.mount
      );
    } else {
      listen(
        root,
        "resize",
        resize,
        {
          passive: true
        }
      );
    }
  }

  function bindAttribute(
    gl,
    location,
    buffer,
    size
  ) {
    if (
      location < 0 ||
      !buffer
    ) {
      return;
    }

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.enableVertexAttribArray(
      location
    );

    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function frameMatrices() {
    const aspect =
      state.pixelHeight > 0
        ? state.pixelWidth /
          state.pixelHeight
        : 1;

    const projection =
      m4Perspective(
        32 *
        Math.PI /
        180,

        Math.max(
          0.01,
          aspect
        ),

        0.1,
        20
      );

    const view =
      m4Translate(
        0,
        0,
        -state.distance
      );

    const model =
      modelMatrix();

    state.webGLFrameMatricesConstructed =
      true;

    state.lastFrameMatricesAt =
      iso();

    return {
      model,

      normal:
        m3Rotation(
          model
        ),

      viewProjection:
        m4Multiply(
          projection,
          view
        ),

      camera:
        new Float32Array([
          0,
          0,
          state.distance
        ])
    };
  }

  /*
   * Counters and timestamps are retained for every draw.
   * A diagnostic event is emitted only for the first observed submission.
   */
  function recordDraw(name) {
    const at = iso();
    const firstSubmission =
      state.renderSubmissionCount === 0;

    state.drawCount += 1;
    state.renderSubmissionCount += 1;
    state.lastDrawAt = at;
    state.lastRenderSubmissionAt = at;

    if (firstSubmission) {
      state.firstRenderSubmissionObserved =
        true;

      event(
        "AUDRALIA_PLANET_FIRST_RENDER_SUBMISSION_OBSERVED",
        {
          mesh: name,
          drawCount:
            state.drawCount,
          renderSubmissionCount:
            state.renderSubmissionCount
        }
      );
    }
  }

  function drawTerrain(
    gl,
    matrices
  ) {
    const info =
      state.programs.terrain;

    const mesh =
      state.meshes.terrain;

    gl.useProgram(
      info.program
    );

    bindAttribute(
      gl,
      info.a.position,
      mesh.position,
      3
    );

    bindAttribute(
      gl,
      info.a.normal,
      mesh.normal,
      3
    );

    bindAttribute(
      gl,
      info.a.color,
      mesh.color,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      mesh.index
    );

    gl.uniformMatrix4fv(
      info.u.model,
      false,
      matrices.model
    );

    gl.uniformMatrix4fv(
      info.u.viewProjection,
      false,
      matrices.viewProjection
    );

    gl.uniformMatrix3fv(
      info.u.normalMatrix,
      false,
      matrices.normal
    );

    gl.uniform3fv(
      info.u.camera,
      matrices.camera
    );

    gl.uniform3f(
      info.u.light,
      -0.62,
      -0.34,
      -0.70
    );

    gl.uniform3f(
      info.u.fill,
      0.60,
      0.12,
      0.78
    );

    gl.disable(
      gl.BLEND
    );

    gl.depthMask(
      true
    );

    gl.cullFace(
      gl.BACK
    );

    gl.drawElements(
      gl.TRIANGLES,
      mesh.indexCount,
      mesh.indexType,
      0
    );

    recordDraw("terrain");
  }

  function drawShell(
    gl,
    matrices,
    time,
    name
  ) {
    const info =
      state.programs.shell;

    const mesh =
      state.meshes[name];

    let kind = 0;

    let base = [
      0.02,
      0.20,
      0.42
    ];

    let secondary = [
      0.10,
      0.58,
      0.82
    ];

    let alpha = 0.78;

    if (
      name ===
      "clouds"
    ) {
      kind = 1;

      base = [
        0.74,
        0.84,
        0.92
      ];

      secondary = [
        1,
        1,
        1
      ];

      alpha = 0.60;
    } else if (
      name ===
      "atmosphere"
    ) {
      kind = 2;

      base = [
        0.06,
        0.22,
        0.52
      ];

      secondary = [
        0.18,
        0.64,
        0.96
      ];

      alpha = 0.82;
    }

    gl.useProgram(
      info.program
    );

    bindAttribute(
      gl,
      info.a.position,
      mesh.position,
      3
    );

    bindAttribute(
      gl,
      info.a.normal,
      mesh.normal,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      mesh.index
    );

    gl.uniformMatrix4fv(
      info.u.model,
      false,
      matrices.model
    );

    gl.uniformMatrix4fv(
      info.u.viewProjection,
      false,
      matrices.viewProjection
    );

    gl.uniformMatrix3fv(
      info.u.normalMatrix,
      false,
      matrices.normal
    );

    gl.uniform3fv(
      info.u.camera,
      matrices.camera
    );

    gl.uniform3f(
      info.u.light,
      -0.62,
      -0.34,
      -0.70
    );

    gl.uniform3fv(
      info.u.base,
      base
    );

    gl.uniform3fv(
      info.u.secondary,
      secondary
    );

    gl.uniform1f(
      info.u.alpha,
      alpha
    );

    gl.uniform1f(
      info.u.kind,
      kind
    );

    gl.uniform1f(
      info.u.time,
      time
    );

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.depthMask(
      false
    );

    gl.cullFace(
      name ===
      "atmosphere"
        ? gl.FRONT
        : gl.BACK
    );

    gl.drawElements(
      gl.TRIANGLES,
      mesh.indexCount,
      mesh.indexType,
      0
    );

    recordDraw(name);

    gl.cullFace(
      gl.BACK
    );

    gl.depthMask(
      true
    );

    gl.disable(
      gl.BLEND
    );
  }

  function visiblePixel() {
    if (
      state.firstVisiblePixelObserved ||
      !state.gl ||
      !state.stageRectNonzero
    ) {
      return state.firstVisiblePixelObserved;
    }

    try {
      const pixel =
        new Uint8Array(4);

      state.gl.readPixels(
        Math.floor(
          state.pixelWidth *
          0.5
        ),

        Math.floor(
          state.pixelHeight *
          0.5
        ),

        1,
        1,

        state.gl.RGBA,
        state.gl.UNSIGNED_BYTE,

        pixel
      );

      const difference =
        Math.abs(
          pixel[0] - 2
        ) +

        Math.abs(
          pixel[1] - 3
        ) +

        Math.abs(
          pixel[2] - 8
        );

      if (
        pixel[3] > 0 &&
        difference > 12
      ) {
        state.firstVisiblePixelObserved =
          true;

        state.lastVisiblePresentationAt =
          iso();

        event(
          "AUDRALIA_PLANET_VISIBLE_PIXEL_OBSERVED",
          {
            pixel:
              Array.from(
                pixel
              ),

            frameCount:
              state.frameCount
          }
        );
      }
    } catch (error) {
      fail(
        "VISIBLE_PIXEL_CHECK_FAILED",
        error
      );
    }

    return state.firstVisiblePixelObserved;
  }

  function drawWebGL(time) {
    if (
      !state.gl ||
      state.contextLost ||
      !state.geometryPacket ||
      !state.stageRectNonzero
    ) {
      return false;
    }

    const gl =
      state.gl;

    const matrices =
      frameMatrices();

    state.renderInvocationCount += 1;
    state.lastRenderInvocationAt = iso();

    gl.viewport(
      0,
      0,
      state.pixelWidth,
      state.pixelHeight
    );

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    if (
      state.atmosphereVisible
    ) {
      drawShell(
        gl,
        matrices,
        time,
        "atmosphere"
      );
    }

    drawTerrain(
      gl,
      matrices
    );

    drawShell(
      gl,
      matrices,
      time,
      "ocean"
    );

    if (
      state.cloudsVisible
    ) {
      drawShell(
        gl,
        matrices,
        time,
        "clouds"
      );
    }

    state.webGLViewProjectionExecuted =
      true;

    state.lastViewProjectionExecutionAt =
      iso();

    if (
      !state.firstFrameDrawn
    ) {
      state.firstFrameDrawn =
        true;

      state.firstFrameAt =
        iso();

      event(
        "AUDRALIA_PLANET_FIRST_FRAME_DRAWN",
        {
          terrainLevel:
            state.terrainLevel,

          pixelWidth:
            state.pixelWidth,

          pixelHeight:
            state.pixelHeight
        }
      );
    }

    visiblePixel();

    return true;
  }

  function fallbackColor(hint) {
    const color =
      COLORS[hint] ||
      COLORS[5];

    return color.map(
      value =>
        Math.round(
          clamp(
            value,
            0,
            1
          ) *
          255
        )
    );
  }

  function drawFallback() {
    const canvas =
      state.fallbackCanvas;

    const context =
      state.fallbackContext;

    if (
      !canvas ||
      !context ||
      !state.stageRectNonzero
    ) {
      return false;
    }

    state.renderInvocationCount += 1;
    state.lastRenderInvocationAt = iso();

    const width =
      state.width;

    const height =
      state.height;

    const centerX =
      width * 0.5;

    const centerY =
      height * 0.5;

    const radius =
      Math.max(
        1,

        Math.min(
          width,
          height
        ) *
        0.37
      );

    context.clearRect(
      0,
      0,
      width,
      height
    );

    const background =
      context.createRadialGradient(
        centerX,
        centerY,
        0,

        centerX,
        centerY,

        Math.max(
          width,
          height
        ) *
        0.72
      );

    background.addColorStop(
      0,
      "rgba(8,24,54,0.84)"
    );

    background.addColorStop(
      1,
      "rgba(2,5,15,0.98)"
    );

    context.fillStyle =
      background;

    context.fillRect(
      0,
      0,
      width,
      height
    );

    const ocean =
      context.createRadialGradient(
        centerX -
        radius *
        0.30,

        centerY -
        radius *
        0.34,

        radius *
        0.08,

        centerX,
        centerY,
        radius
      );

    ocean.addColorStop(
      0,
      "rgba(28,112,176,1)"
    );

    ocean.addColorStop(
      0.58,
      "rgba(8,62,118,1)"
    );

    ocean.addColorStop(
      1,
      "rgba(2,20,58,1)"
    );

    context.save();

    context.beginPath();

    context.arc(
      centerX,
      centerY,
      radius,
      0,
      Math.PI * 2
    );

    context.clip();

    context.fillStyle =
      ocean;

    context.fillRect(
      centerX - radius,
      centerY - radius,
      radius * 2,
      radius * 2
    );

    let fallbackGeometryAdmitted =
      false;

    try {
      const authority =
        state.geometryAuthority ||
        geometryAuthority();

      const terrain =
        authority &&
        authority.createTerrainMesh(
          4
        );

      if (terrain) {
        fallbackGeometryAdmitted =
          true;

        const model =
          modelMatrix();

        state.fallbackViewTransformExecuted =
          true;

        state.lastFallbackViewTransformAt =
          iso();

        const points = [];

        for (
          let index = 0;
          index <
          terrain.vertexCount;
          index += 1
        ) {
          if (
            !terrain.landMasks[
              index
            ]
          ) {
            continue;
          }

          const offset =
            index * 3;

          const point =
            transform(
              model,
              [
                terrain.positions[
                  offset
                ],

                terrain.positions[
                  offset + 1
                ],

                terrain.positions[
                  offset + 2
                ]
              ]
            );

          if (
            point[2] <= 0
          ) {
            continue;
          }

          points.push({
            x:
              centerX +
              point[0] *
              radius,

            y:
              centerY -
              point[1] *
              radius,

            z:
              point[2],

            hint:
              terrain.materialHints[
                index
              ]
          });
        }

        points.sort(
          (
            a,
            b
          ) =>
            a.z -
            b.z
        );

        for (
          const point of
          points
        ) {
          const color =
            fallbackColor(
              point.hint
            );

          const light =
            clamp(
              0.44 +
              point.z *
              0.55,
              0.35,
              1
            );

          context.fillStyle =
            `rgb(${Math.round(
              color[0] *
              light
            )},${Math.round(
              color[1] *
              light
            )},${Math.round(
              color[2] *
              light
            )})`;

          const size =
            Math.max(
              1.2,
              radius *
              0.012
            );

          context.fillRect(
            point.x -
            size *
            0.5,

            point.y -
            size *
            0.5,

            size,
            size
          );
        }
      }
    } catch (error) {
      fail(
        "FALLBACK_DRAW_FAILED",
        error
      );
    }

    context.restore();

    const rim =
      context.createRadialGradient(
        centerX,
        centerY,
        radius * 0.82,

        centerX,
        centerY,
        radius * 1.08
      );

    rim.addColorStop(
      0,
      "rgba(50,150,232,0)"
    );

    rim.addColorStop(
      0.78,
      "rgba(64,180,255,0.12)"
    );

    rim.addColorStop(
      1,
      "rgba(92,200,255,0)"
    );

    context.fillStyle =
      rim;

    context.beginPath();

    context.arc(
      centerX,
      centerY,
      radius * 1.08,
      0,
      Math.PI * 2
    );

    context.fill();

    const firstSubmission =
      state.renderSubmissionCount === 0;

    state.renderSubmissionCount += 1;
    state.lastRenderSubmissionAt = iso();
    state.lastDrawAt = state.lastRenderSubmissionAt;

    if (firstSubmission) {
      state.firstRenderSubmissionObserved =
        true;

      event(
        "AUDRALIA_PLANET_FIRST_RENDER_SUBMISSION_OBSERVED",
        {
          rendererBackend:
            "canvas2d-fallback",
          renderSubmissionCount:
            state.renderSubmissionCount
        }
      );
    }

    if (
      fallbackGeometryAdmitted
    ) {
      state.fallbackWorldRendered =
        true;

      state.lastFallbackWorldRenderAt =
        state.lastRenderSubmissionAt;
    }

    if (
      !state.firstFrameDrawn
    ) {
      state.firstFrameDrawn =
        true;

      state.firstFrameAt =
        iso();
    }

    state.firstVisiblePixelObserved =
      true;

    state.lastVisiblePresentationAt =
      state.lastVisiblePresentationAt ||
      iso();

    return true;
  }

  function markInteraction() {
    state.lastInteractionAt =
      root &&
      root.performance
        ? root.performance.now()
        : Date.now();

    state.needsRender =
      true;
  }

  function pointerDistance() {
    const points =
      Array.from(
        state.pointers.values()
      );

    return (
      points.length < 2
    )
      ? 0
      : Math.hypot(
          points[0].x -
          points[1].x,

          points[0].y -
          points[1].y
        );
  }

  function pointerDown(
    eventObject
  ) {
    const canvas =
      eventObject &&
      eventObject.currentTarget;

    if (
      !canvas ||
      state.destroyed
    ) {
      return;
    }

    state.pointers.set(
      eventObject.pointerId,
      {
        x:
          eventObject.clientX,

        y:
          eventObject.clientY
      }
    );

    state.dragId =
      eventObject.pointerId;

    state.pinchDistance =
      pointerDistance();

    state.interacting =
      true;

    try {
      canvas.setPointerCapture(
        eventObject.pointerId
      );
    } catch (_error) {}

    markInteraction();
  }

  function pointerMove(
    eventObject
  ) {
    if (
      !state.pointers.has(
        eventObject.pointerId
      )
    ) {
      return;
    }

    const previous =
      state.pointers.get(
        eventObject.pointerId
      );

    state.pointers.set(
      eventObject.pointerId,
      {
        x:
          eventObject.clientX,

        y:
          eventObject.clientY
      }
    );

    if (
      state.pointers.size >=
      2
    ) {
      const next =
        pointerDistance();

      if (
        state.pinchDistance > 0 &&
        next > 0
      ) {
        state.distance =
          clamp(
            state.distance -
            (
              next -
              state.pinchDistance
            ) *
            0.006,

            MIN_DISTANCE,
            MAX_DISTANCE
          );
      }

      state.pinchDistance =
        next;

      markInteraction();

      return;
    }

    if (
      state.dragId ===
      eventObject.pointerId
    ) {
      state.yaw +=
        (
          eventObject.clientX -
          previous.x
        ) *
        0.0075;

      state.pitch =
        clamp(
          state.pitch +
          (
            eventObject.clientY -
            previous.y
          ) *
          0.0065,

          -1.16,
          1.16
        );

      markInteraction();
    }
  }

  function pointerEnd(
    eventObject
  ) {
    const canvas =
      eventObject &&
      eventObject.currentTarget;

    state.pointers.delete(
      eventObject.pointerId
    );

    if (
      state.dragId ===
      eventObject.pointerId
    ) {
      state.dragId =
        null;
    }

    state.interacting =
      state.pointers.size >
      0;

    state.pinchDistance =
      pointerDistance();

    try {
      if (
        canvas &&
        fn(
          canvas.hasPointerCapture
        ) &&
        canvas.hasPointerCapture(
          eventObject.pointerId
        )
      ) {
        canvas.releasePointerCapture(
          eventObject.pointerId
        );
      }
    } catch (_error) {}

    markInteraction();
  }

  function wheel(
    eventObject
  ) {
    if (
      eventObject &&
      fn(
        eventObject.preventDefault
      )
    ) {
      eventObject.preventDefault();
    }

    state.distance =
      clamp(
        state.distance +
        clamp(
          eventObject.deltaY,
          -160,
          160
        ) *
        0.0045,

        MIN_DISTANCE,
        MAX_DISTANCE
      );

    markInteraction();
  }

  function resetView() {
    state.yaw =
      DEFAULT_YAW;

    state.pitch =
      DEFAULT_PITCH;

    state.distance =
      DEFAULT_DISTANCE;

    markInteraction();

    event(
      "AUDRALIA_PLANET_VIEW_RESET",
      {}
    );

    return viewState();
  }

  function togglePause(force) {
    state.paused =
      typeof force ===
      "boolean"
        ? force
        : !state.paused;

    state.needsRender =
      true;

    updateButtons();

    event(
      "AUDRALIA_PLANET_PAUSE_CHANGED",
      {
        paused:
          state.paused
      }
    );

    publish();

    return state.paused;
  }

  function toggleClouds(force) {
    state.cloudsVisible =
      typeof force ===
      "boolean"
        ? force
        : !state.cloudsVisible;

    state.needsRender =
      true;

    updateButtons();

    event(
      "AUDRALIA_PLANET_CLOUDS_CHANGED",
      {
        visible:
          state.cloudsVisible
      }
    );

    publish();

    return state.cloudsVisible;
  }

  function toggleAtmosphere(
    force
  ) {
    state.atmosphereVisible =
      typeof force ===
      "boolean"
        ? force
        : !state.atmosphereVisible;

    state.needsRender =
      true;

    updateButtons();

    event(
      "AUDRALIA_PLANET_ATMOSPHERE_CHANGED",
      {
        visible:
          state.atmosphereVisible
      }
    );

    publish();

    return state.atmosphereVisible;
  }

  function keyDown(
    eventObject
  ) {
    let handled =
      true;

    switch (
      eventObject.key
    ) {
      case "ArrowLeft":
        state.yaw -=
          0.08;
        break;

      case "ArrowRight":
        state.yaw +=
          0.08;
        break;

      case "ArrowUp":
        state.pitch =
          clamp(
            state.pitch -
            0.07,
            -1.16,
            1.16
          );
        break;

      case "ArrowDown":
        state.pitch =
          clamp(
            state.pitch +
            0.07,
            -1.16,
            1.16
          );
        break;

      case "+":
      case "=":
        state.distance =
          clamp(
            state.distance -
            0.18,
            MIN_DISTANCE,
            MAX_DISTANCE
          );
        break;

      case "-":
      case "_":
        state.distance =
          clamp(
            state.distance +
            0.18,
            MIN_DISTANCE,
            MAX_DISTANCE
          );
        break;

      case "0":
      case "Home":
        resetView();
        break;

      case " ":
        togglePause();
        break;

      case "c":
      case "C":
        toggleClouds();
        break;

      case "a":
      case "A":
        toggleAtmosphere();
        break;

      default:
        handled =
          false;
        break;
    }

    if (handled) {
      eventObject.preventDefault();
      markInteraction();
    }
  }

  function bindControls(canvas) {
    listen(
      canvas,
      "pointerdown",
      pointerDown,
      false
    );

    listen(
      canvas,
      "pointermove",
      pointerMove,
      false
    );

    listen(
      canvas,
      "pointerup",
      pointerEnd,
      false
    );

    listen(
      canvas,
      "pointercancel",
      pointerEnd,
      false
    );

    listen(
      canvas,
      "lostpointercapture",
      pointerEnd,
      false
    );

    listen(
      canvas,
      "wheel",
      wheel,
      {
        passive: false
      }
    );

    listen(
      canvas,
      "dblclick",

      eventObject => {
        eventObject.preventDefault();
        resetView();
      },

      false
    );

    listen(
      canvas,
      "keydown",
      keyDown,
      false
    );
  }

  function bindButton(
    action,
    handler
  ) {
    if (!doc) {
      return;
    }

    const capitalized =
      action.charAt(0)
        .toUpperCase() +
      action.slice(1);

    const elements =
      new Set([
        ...doc.querySelectorAll(
          `[data-audralia-action="${action}"]`
        ),

        ...doc.querySelectorAll(
          `#audralia${capitalized}Button`
        )
      ]);

    for (
      const element of
      elements
    ) {
      const wrapped =
        eventObject => {
          eventObject.preventDefault();
          handler();
        };

      element.addEventListener(
        "click",
        wrapped
      );

      state.buttons.push({
        element,
        action,
        handler: wrapped
      });
    }
  }

  function bindButtons() {
    bindButton(
      "reset",
      resetView
    );

    bindButton(
      "pause",
      togglePause
    );

    bindButton(
      "clouds",
      toggleClouds
    );

    bindButton(
      "atmosphere",
      toggleAtmosphere
    );

    updateButtons();
  }

  function updateButtons() {
    for (
      const item of
      state.buttons
    ) {
      let active =
        false;

      if (
        item.action ===
        "pause"
      ) {
        active =
          state.paused;
      } else if (
        item.action ===
        "clouds"
      ) {
        active =
          state.cloudsVisible;
      } else if (
        item.action ===
        "atmosphere"
      ) {
        active =
          state.atmosphereVisible;
      }

      item.element.setAttribute(
        "aria-pressed",
        active
          ? "true"
          : "false"
      );

      dataset(
        item.element,
        "active",
        active
      );
    }
  }

  function setupReducedMotion() {
    if (
      !root ||
      !fn(root.matchMedia)
    ) {
      return;
    }

    const query =
      root.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    state.reducedMotion =
      Boolean(
        query.matches
      );

    const handler =
      eventObject => {
        state.reducedMotion =
          Boolean(
            eventObject.matches
          );

        state.needsRender =
          true;

        publish();
      };

    if (
      fn(
        query.addEventListener
      )
    ) {
      listen(
        query,
        "change",
        handler,
        false
      );
    }
  }

  function setupVisibility() {
    if (!doc) {
      return;
    }

    listen(
      doc,
      "visibilitychange",
      () => {
        state.hidden =
          Boolean(
            doc.hidden
          );

        if (
          state.hidden
        ) {
          stopLoop();
        } else if (
          state.mounted &&
          !state.destroyed
        ) {
          state.lastFrameAt =
            0;

          state.needsRender =
            true;

          startLoop();
        }

        publish();
      },
      false
    );
  }

  function updateFrame(delta) {
    if (
      Number.isFinite(
        delta
      ) &&
      delta >= 0 &&
      delta <= 1000
    ) {
      state.lastFrameDurationMs =
        delta;

      state.frameAccumulator +=
        delta;

      state.frameSamples +=
        1;

      state.averageFrameDurationMs =
        state.frameAccumulator /
        Math.max(
          1,
          state.frameSamples
        );

      if (
        state.frameSamples >
        120
      ) {
        state.frameAccumulator *=
          0.5;

        state.frameSamples =
          60;
      }
    }
  }

  function frame(time) {
    state.frameId = 0;

    if (
      state.destroyed ||
      state.hidden ||
      !state.mounted
    ) {
      return;
    }

    const previous =
      state.lastFrameAt ||
      time;

    const delta =
      clamp(
        time -
        previous,
        0,
        80
      );

    state.lastFrameAt =
      time;

    if (
      !state.paused &&
      !state.reducedMotion &&
      !state.interacting &&
      state.autoRotate &&
      time -
      state.lastInteractionAt >
      IDLE_DELAY
    ) {
      state.yaw +=
        delta *
        0.000065;

      state.needsRender =
        true;
    }

    if (
      state.needsRender ||
      !state.firstFrameDrawn ||
      !state.paused
    ) {
      if (
        state.fallbackActive
      ) {
        drawFallback();
      } else {
        drawWebGL(
          time
        );
      }

      state.frameCount +=
        1;

      state.needsRender =
        false;

      updateFrame(
        delta
      );
    }

    if (
      !state.destroyed &&
      !state.hidden
    ) {
      state.frameId =
        root.requestAnimationFrame(
          frame
        );
    }
  }

  function startLoop() {
    if (
      !root ||
      !fn(
        root.requestAnimationFrame
      ) ||
      state.frameId ||
      state.destroyed ||
      state.hidden
    ) {
      return false;
    }

    state.running =
      true;

    state.frameId =
      root.requestAnimationFrame(
        frame
      );

    return true;
  }

  function stopLoop() {
    if (
      state.frameId &&
      root &&
      fn(
        root.cancelAnimationFrame
      )
    ) {
      root.cancelAnimationFrame(
        state.frameId
      );
    }

    state.frameId =
      0;
  }

  function contextLost(
    eventObject
  ) {
    eventObject.preventDefault();

    state.contextLost =
      true;

    state.running =
      false;

    stopLoop();

    event(
      "AUDRALIA_PLANET_WEBGL_CONTEXT_LOST",
      {
        frameCount:
          state.frameCount
      }
    );

    publish();
  }

  function contextRestored() {
    state.contextLost =
      false;

    state.contextRestoreCount +=
      1;

    try {
      state.gl =
        webgl(
          state.canvas
        );

      if (!state.gl) {
        throw new Error(
          "WebGL context restoration returned no context."
        );
      }

      buildGPU();
      resize();

      state.needsRender =
        true;

      startLoop();

      event(
        "AUDRALIA_PLANET_WEBGL_CONTEXT_RESTORED",
        {
          contextRestoreCount:
            state.contextRestoreCount
        }
      );
    } catch (error) {
      fail(
        "CONTEXT_RESTORE_FAILED",
        error
      );

      activateFallback(
        "context-restore-failed"
      );
    }

    publish();
  }

  function activateFallback(reason) {
    state.fallbackActive =
      true;

    state.fallbackReason =
      String(
        reason ||
        "webgl-unavailable"
      );

    if (state.canvas) {
      state.canvas.style.display =
        "none";
    }

    const fallback =
      makeCanvas(
        true
      );

    bindControls(
      fallback
    );

    resize();
    drawFallback();

    state.running =
      true;

    event(
      "AUDRALIA_PLANET_FALLBACK_ACTIVATED",
      {
        reason:
          state.fallbackReason
      }
    );

    startLoop();
    publish();

    return true;
  }

  function mount(options = {}) {
    if (
      state.destroyed
    ) {
      return {
        mounted: false,
        reason: "RUNTIME_DESTROYED"
      };
    }

    if (
      state.mounted
    ) {
      resize();

      return {
        mounted: true,
        reused: true,
        status: getStatus()
      };
    }

    if (
      state.initializing
    ) {
      return {
        mounted: false,
        reason: "INITIALIZATION_IN_PROGRESS"
      };
    }

    state.initializing =
      true;

    try {
      setupReducedMotion();
      setupVisibility();

      const resolved =
        resolveElements(
          options
        );

      state.stage =
        resolved.stage;

      state.mount =
        resolved.mount;

      if (!state.mount) {
        throw new Error(
          "Audralia globe mount was not found."
        );
      }

      state.geometryAuthority =
        geometryAuthority();

      if (
        !state.geometryAuthority
      ) {
        throw new Error(
          "Audralia geometry authority was not found."
        );
      }

      const canvas =
        makeCanvas(
          false
        );

      setupResize();
      resize();
      bindControls(canvas);
      bindButtons();

      state.gl =
        webgl(canvas);

      state.terrainLevel =
        terrainLevel(
          options
        );

      geometry(
        state.terrainLevel,
        options.deepValidation ===
        true
      );

      if (!state.gl) {
        state.mounted =
          true;

        state.initializing =
          false;

        return activateFallback(
          "webgl-unavailable"
        );
      }

      listen(
        canvas,
        "webglcontextlost",
        contextLost,
        false
      );

      listen(
        canvas,
        "webglcontextrestored",
        contextRestored,
        false
      );

      buildGPU();

      state.mounted =
        true;

      state.initializing =
        false;

      state.running =
        true;

      state.fallbackActive =
        false;

      state.lastInteractionAt =
        root &&
        root.performance
          ? root.performance.now()
          : Date.now();

      state.needsRender =
        true;

      resize();
      startLoop();

      event(
        "AUDRALIA_PLANET_RUNTIME_MOUNTED",
        {
          stageId:
            state.stage &&
            state.stage.id
              ? state.stage.id
              : "",

          mountId:
            state.mount &&
            state.mount.id
              ? state.mount.id
              : "",

          terrainLevel:
            state.terrainLevel,

          geometryHash:
            state
              .geometryPacket
              .geometryHash
        }
      );

      publish();

      return {
        mounted: true,
        reused: false,
        status: getStatus()
      };
    } catch (error) {
      state.initializing =
        false;

      fail(
        "AUDRALIA_PLANET_RUNTIME_MOUNT_FAILED",
        error
      );

      if (
        state.mount &&
        state.geometryAuthority
      ) {
        state.mounted =
          true;

        activateFallback(
          error.message ||
          "runtime-mount-failed"
        );

        return {
          mounted: true,
          fallback: true,

          reason:
            error.message ||
            String(error),

          status:
            getStatus()
        };
      }

      return {
        mounted: false,
        fallback: false,

        reason:
          error.message ||
          String(error),

        status:
          getStatus()
      };
    }
  }

  function autoMount(
    attempt = 0
  ) {
    state.autoMountAttempts =
      attempt;

    if (
      state.mounted ||
      state.destroyed
    ) {
      return;
    }

    const resolved =
      resolveElements({});

    if (
      resolved.mount &&
      geometryAuthority()
    ) {
      mount({
        stage:
          resolved.stage,

        mount:
          resolved.mount
      });

      return;
    }

    if (
      attempt >=
      AUTO_MOUNT_LIMIT ||

      !root ||

      !fn(
        root.setTimeout
      )
    ) {
      event(
        "AUDRALIA_PLANET_AUTO_MOUNT_HELD",
        {
          attempt,

          mountPresent:
            Boolean(
              resolved.mount
            ),

          geometryAuthorityPresent:
            Boolean(
              geometryAuthority()
            )
        }
      );

      publish();

      return;
    }

    state.autoMountTimer =
      root.setTimeout(
        () =>
          autoMount(
            attempt + 1
          ),
        50
      );
  }

  function destroy() {
    state.destroyed =
      true;

    state.running =
      false;

    state.mounted =
      false;

    stopLoop();

    if (
      state.autoMountTimer &&
      root &&
      fn(
        root.clearTimeout
      )
    ) {
      root.clearTimeout(
        state.autoMountTimer
      );

      state.autoMountTimer =
        0;
    }

    if (
      state.resizeObserver
    ) {
      try {
        state.resizeObserver.disconnect();
      } catch (_error) {}

      state.resizeObserver =
        null;
    }

    unlistenAll();
    releaseGPU();

    state.gl =
      null;

    for (
      const canvas of [
        state.canvas,
        state.fallbackCanvas
      ]
    ) {
      if (
        canvas &&
        canvas.parentNode
      ) {
        canvas.parentNode.removeChild(
          canvas
        );
      }
    }

    state.canvas =
      null;

    state.fallbackCanvas =
      null;

    state.fallbackContext =
      null;

    state.pointers.clear();

    event(
      "AUDRALIA_PLANET_RUNTIME_DESTROYED",
      {}
    );

    publish();

    return true;
  }

  function viewState() {
    return {
      yaw:
        state.yaw,

      pitch:
        state.pitch,

      distance:
        state.distance,

      axialTilt:
        AXIAL_TILT,

      paused:
        state.paused,

      autoRotate:
        state.autoRotate,

      cloudsVisible:
        state.cloudsVisible,

      atmosphereVisible:
        state.atmosphereVisible
    };
  }

  function activeRendererBackend() {
    if (
      state.fallbackActive
    ) {
      return "canvas2d-fallback";
    }

    if (
      state.gl &&
      !state.contextLost
    ) {
      return "webgl";
    }

    return "unavailable";
  }

  function webGLEvidenceAvailable() {
    return activeRendererBackend() ===
      "webgl";
  }

  function programsPresent() {
    return Boolean(
      state.programs &&
      state.programs.terrain &&
      state.programs.terrain.program &&
      state.programs.shell &&
      state.programs.shell.program
    );
  }

  function meshesPresent() {
    return Boolean(
      state.meshes &&
      state.meshes.terrain &&
      state.meshes.ocean &&
      state.meshes.clouds &&
      state.meshes.atmosphere
    );
  }

  function architectureEvidence() {
    const composedAt = iso();
    const activeBackend =
      activeRendererBackend();
    const webGLActive =
      activeBackend === "webgl";
    const fallbackActive =
      activeBackend ===
      "canvas2d-fallback";

    const geometryReady =
      Boolean(
        state.geometryPacket &&
        state.geometryPacket.validation &&
        state.geometryPacket.validation.passed === true
      );

    const shaderProgramsCompiled =
      state.shaderCompileAttemptCount > 0 &&
      state.shaderCompileFailureCount === 0 &&
      state.shaderCompileSuccessCount ===
        state.shaderCompileAttemptCount;

    const shaderProgramsLinked =
      state.programLinkAttemptCount > 0 &&
      state.programLinkFailureCount === 0 &&
      state.programLinkSuccessCount ===
        state.programLinkAttemptCount;

    const webGLPipelineOperational =
      webGLActive &&
      geometryReady &&
      programsPresent() &&
      meshesPresent() &&
      shaderProgramsCompiled &&
      shaderProgramsLinked &&
      !state.contextLost;

    const drawObserved =
      state.drawCount > 0;

    const renderInvocationObserved =
      state.renderInvocationCount > 0;

    const renderSubmissionObserved =
      state.renderSubmissionCount > 0;

    const visiblePresentationObserved =
      state.firstFrameDrawn &&
      state.firstVisiblePixelObserved;

    const contextRetained =
      webGLActive &&
      !state.contextLost;

    const webGLWorldPresent =
      webGLActive &&
      geometryReady &&
      meshesPresent();

    const fallbackWorldPresent =
      fallbackActive &&
      state.fallbackWorldRendered &&
      state.firstFrameDrawn &&
      state.firstVisiblePixelObserved;

    const architectureNeutralWorldPresent =
      webGLWorldPresent ||
      fallbackWorldPresent;

    const worldEvidenceSource =
      webGLWorldPresent
        ? "WEBGL_GEOMETRY_AND_GPU_MESHES"
        : fallbackWorldPresent
          ? "FALLBACK_GEOMETRY_AND_CANVAS_RENDERING"
          : "UNAVAILABLE";

    const identity = {
      runtimeGlobalName:
        declaredEvidence(
          RUNTIME_GLOBAL_NAME,
          "runtime-header-and-publication"
        ),

      primaryRendererBackend:
        declaredEvidence(
          PRIMARY_RENDERER_BACKEND,
          "runtime-design"
        ),

      activeRendererBackend:
        activeBackend === "unavailable"
          ? unavailableEvidence(
              "active-runtime-mode",
              "No active renderer backend has been admitted."
            )
          : observedEvidence(
              activeBackend,
              activeBackend === "webgl"
                ? "canvas.getContext(webgl)"
                : "fallback-canvas-context",
              state.updatedAt,
              {
                evidenceKind:
                  activeBackend === "webgl"
                    ? EVIDENCE_KIND.DIRECT_GPU_OBSERVATION
                    : EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION
              }
            ),

      modelId:
        declaredEvidence(
          MODEL_ID,
          "runtime-header"
        ),

      runtimeContract:
        declaredEvidence(
          CONTRACT,
          "runtime-header"
        ),

      runtimeReceiptSchema:
        declaredEvidence(
          RECEIPT,
          "runtime-header"
        ),

      runtimeVersion:
        declaredEvidence(
          VERSION,
          "runtime-header"
        ),

      runtimeFile:
        declaredEvidence(
          FILE,
          "runtime-header"
        ),

      previousContract:
        declaredEvidence(
          PREVIOUS_CONTRACT,
          "runtime-header"
        ),

      previousVersion:
        declaredEvidence(
          PREVIOUS_VERSION,
          "runtime-header"
        ),

      renewalClass:
        declaredEvidence(
          RENEWAL_CLASS,
          "runtime-header"
        )
    };

    const world = {
      sceneObjectPresent:
        declaredFalseEvidence(
          "runtime-architecture",
          "This implementation does not use a named scene object."
        ),

      renderableWorldPresent:
        architectureNeutralWorldPresent
          ? observedEvidence(
              true,
              worldEvidenceSource,
              webGLWorldPresent
                ? state.lastRenderSubmissionAt
                : state.lastFallbackWorldRenderAt,
              {
                evidenceKind:
                  EVIDENCE_KIND.DELEGATED_GEOMETRY_EVIDENCE,
                derivedFrom:
                  webGLWorldPresent
                    ? [
                        "geometryPacket.validation.passed",
                        "state.meshes",
                        "activeRendererBackend:webgl"
                      ]
                    : [
                        "fallback geometry",
                        "fallback canvas rendering",
                        "visible presentation"
                      ]
              }
            )
          : unavailableEvidence(
              "runtime-world-representation",
              "No active backend has completed an admitted world representation."
            ),

      equivalentSceneRepresentationPresent:
        architectureNeutralWorldPresent
          ? derivedEvidence(
              true,
              "runtime-world-representation",
              [
                "renderableWorldPresent",
                worldEvidenceSource
              ],
              {
                reason:
                  "The runtime presents an Audralia world without a named scene object."
              }
            )
          : unavailableEvidence(
              "runtime-world-representation",
              "Equivalent scene representation has not been established."
            ),

      activeWorldEvidenceSource:
        architectureNeutralWorldPresent
          ? observedEvidence(
              worldEvidenceSource,
              "runtime-world-representation",
              webGLWorldPresent
                ? state.lastRenderSubmissionAt
                : state.lastFallbackWorldRenderAt
            )
          : unavailableEvidence(
              "runtime-world-representation",
              "No backend-specific world source is active."
            )
    };

    const webGLProjectionActive =
      webGLActive &&
      state.webGLFrameMatricesConstructed &&
      state.webGLViewProjectionExecuted;

    const fallbackViewActive =
      fallbackActive &&
      state.fallbackViewTransformExecuted;

    const view = {
      cameraObjectPresent:
        declaredFalseEvidence(
          "runtime-architecture",
          "This implementation uses matrices and camera-position uniforms rather than a named camera object."
        ),

      projectionActive:
        webGLActive
          ? state.webGLFrameMatricesConstructed &&
            state.webGLViewProjectionExecuted
            ? observedEvidence(
                true,
                "frameMatrices-and-WebGL-uniform-execution",
                state.lastViewProjectionExecutionAt,
                {
                  evidenceKind:
                    EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION,
                  derivedFrom: [
                    "webGLFrameMatricesConstructed",
                    "webGLViewProjectionExecuted"
                  ]
                }
              )
            : unavailableEvidence(
                "frameMatrices-and-WebGL-uniform-execution",
                "The WebGL projection path has not executed."
              )
          : fallbackActive
            ? notApplicableEvidence(
                "WebGL-perspective-projection",
                "The fallback renderer does not use the WebGL perspective-matrix path."
              )
            : unavailableEvidence(
                "runtime-projection",
                "No active projection path has been admitted."
              ),

      viewTransformActive:
        webGLActive
          ? webGLProjectionActive
            ? observedEvidence(
                true,
                "WebGL-model-view-projection-path",
                state.lastViewProjectionExecutionAt,
                {
                  evidenceKind:
                    EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION
                }
              )
            : unavailableEvidence(
                "WebGL-model-view-projection-path",
                "The WebGL view path has not executed."
              )
          : fallbackActive
            ? fallbackViewActive
              ? observedEvidence(
                  true,
                  "fallback-modelMatrix-and-transform",
                  state.lastFallbackViewTransformAt,
                  {
                    evidenceKind:
                      EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION
                  }
                )
              : unavailableEvidence(
                  "fallback-modelMatrix-and-transform",
                  "The fallback view-transform path has not executed."
                )
            : unavailableEvidence(
                "runtime-view-transform",
                "No active view-transform path has been admitted."
              ),

      equivalentViewAuthorityPresent:
        webGLProjectionActive ||
        fallbackViewActive
          ? derivedEvidence(
              true,
              "runtime-view-authority",
              webGLProjectionActive
                ? [
                    "webGLFrameMatricesConstructed",
                    "webGLViewProjectionExecuted",
                    "camera uniform participation"
                  ]
                : [
                    "fallbackViewTransformExecuted",
                    "modelMatrix",
                    "transform"
                  ],
              {
                reason:
                  "The active backend executes view behavior without a named camera object."
              }
            )
          : unavailableEvidence(
              "runtime-view-authority",
              "No executed view authority has been admitted."
            ),

      activeViewEvidenceSource:
        webGLProjectionActive
          ? observedEvidence(
              "WEBGL_MODEL_VIEW_PROJECTION",
              "runtime-view-authority",
              state.lastViewProjectionExecutionAt
            )
          : fallbackViewActive
            ? observedEvidence(
                "FALLBACK_MODEL_TRANSFORM",
                "runtime-view-authority",
                state.lastFallbackViewTransformAt
              )
            : unavailableEvidence(
                "runtime-view-authority",
                "No backend-specific view source is active."
              )
    };

    const renderState = {
      materialObjectPresent:
        declaredFalseEvidence(
          "runtime-architecture",
          "This implementation does not use named material objects."
        ),

      shaderStatePresent:
        programsPresent()
          ? observedEvidence(
              true,
              "state.programs",
              state.updatedAt,
              {
                evidenceKind:
                  EVIDENCE_KIND.DIRECT_GPU_OBSERVATION
              }
            )
          : webGLActive
            ? unavailableEvidence(
                "state.programs",
                "WebGL exists but shader programs are not yet admitted."
              )
            : notApplicableEvidence(
                "state.programs",
                "WebGL shader state does not apply while fallback rendering is active."
              ),

      uniformStatePresent:
        programsPresent() &&
        state.webGLViewProjectionExecuted
          ? observedEvidence(
              true,
              "program uniform locations and draw uniform writes",
              state.lastViewProjectionExecutionAt,
              {
                evidenceKind:
                  EVIDENCE_KIND.DIRECT_GPU_OBSERVATION
              }
            )
          : webGLActive
            ? unavailableEvidence(
                "program-uniform-state",
                "Uniform-state execution has not been observed."
              )
            : notApplicableEvidence(
                "program-uniform-state",
                "WebGL uniform state does not apply to the active fallback renderer."
              ),

      proceduralRenderStatePresent:
        renderInvocationObserved
          ? observedEvidence(
              true,
              fallbackActive
                ? "Canvas2D gradients colors clipping and transformed terrain points"
                : "shader colors lighting blend depth and culling state",
              state.lastRenderInvocationAt,
              {
                evidenceKind:
                  webGLActive
                    ? EVIDENCE_KIND.DIRECT_GPU_OBSERVATION
                    : EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION
              }
            )
          : unavailableEvidence(
              "runtime-render-state",
              "Procedural render-state participation has not executed."
            )
    };

    const pipeline = {
      shaderProgramCompiled:
        webGLActive
          ? state.shaderCompileAttemptCount > 0
            ? observedEvidence(
                shaderProgramsCompiled,
                "WebGL COMPILE_STATUS",
                state.updatedAt,
                {
                  evidenceKind:
                    EVIDENCE_KIND.DIRECT_GPU_OBSERVATION,
                  derivedFrom: [
                    "shaderCompileAttemptCount",
                    "shaderCompileSuccessCount",
                    "shaderCompileFailureCount"
                  ],
                  reason:
                    shaderProgramsCompiled
                      ? null
                      : "One or more shader compilation attempts failed."
                }
              )
            : unavailableEvidence(
                "WebGL COMPILE_STATUS",
                "Shader compilation has not been attempted."
              )
          : notApplicableEvidence(
              "WebGL COMPILE_STATUS",
              "WebGL shader compilation does not apply while fallback rendering is active."
            ),

      shaderProgramLinked:
        webGLActive
          ? state.programLinkAttemptCount > 0
            ? observedEvidence(
                shaderProgramsLinked,
                "WebGL LINK_STATUS",
                state.updatedAt,
                {
                  evidenceKind:
                    EVIDENCE_KIND.DIRECT_GPU_OBSERVATION,
                  derivedFrom: [
                    "programLinkAttemptCount",
                    "programLinkSuccessCount",
                    "programLinkFailureCount"
                  ],
                  reason:
                    shaderProgramsLinked
                      ? null
                      : "One or more program link attempts failed."
                }
              )
            : unavailableEvidence(
                "WebGL LINK_STATUS",
                "Program linking has not been attempted."
              )
          : notApplicableEvidence(
              "WebGL LINK_STATUS",
              "WebGL program linking does not apply while fallback rendering is active."
            ),

      pipelineOperational:
        webGLActive
          ? derivedEvidence(
              webGLPipelineOperational,
              "webgl-runtime-pipeline",
              [
                "geometryReady",
                "programsPresent",
                "meshesPresent",
                "shaderProgramCompiled",
                "shaderProgramLinked",
                "contextLost"
              ],
              {
                reason:
                  webGLPipelineOperational
                    ? null
                    : "The complete WebGL execution path has not been admitted."
              }
            )
          : fallbackActive
            ? notApplicableEvidence(
                "webgl-runtime-pipeline",
                "The WebGL pipeline is not the active rendering path."
              )
            : unavailableEvidence(
                "webgl-runtime-pipeline",
                "No active rendering pipeline has been admitted."
              )
    };

    const submission = {
      drawCallRecorded:
        drawObserved
          ? observedEvidence(
              true,
              "gl.drawElements",
              state.lastDrawAt,
              {
                evidenceKind:
                  EVIDENCE_KIND.DIRECT_GPU_OBSERVATION,
                derivedFrom: [
                  "drawCount"
                ]
              }
            )
          : fallbackActive
            ? notApplicableEvidence(
                "gl.drawElements",
                "WebGL draw calls do not apply to the active fallback renderer."
              )
            : unavailableEvidence(
                "gl.drawElements",
                "No WebGL draw call has been recorded."
              ),

      renderInvocationRecorded:
        renderInvocationObserved
          ? observedEvidence(
              true,
              "drawWebGL-or-drawFallback",
              state.lastRenderInvocationAt,
              {
                evidenceKind:
                  EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION,
                derivedFrom: [
                  "renderInvocationCount"
                ]
              }
            )
          : unavailableEvidence(
              "drawWebGL-or-drawFallback",
              "No render invocation has been recorded."
            ),

      renderSubmissionObserved:
        renderSubmissionObserved
          ? observedEvidence(
              true,
              fallbackActive
                ? "fallback-canvas-render-completion"
                : "gl.drawElements",
              state.lastRenderSubmissionAt,
              {
                evidenceKind:
                  fallbackActive
                    ? EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION
                    : EVIDENCE_KIND.DIRECT_GPU_OBSERVATION,
                derivedFrom: [
                  "renderSubmissionCount"
                ]
              }
            )
          : unavailableEvidence(
              "render-submission",
              "No render submission has been observed."
            ),

      firstRenderSubmissionObserved:
        state.firstRenderSubmissionObserved
          ? observedEvidence(
              true,
              "first-render-submission-transition",
              state.lastRenderSubmissionAt
            )
          : unavailableEvidence(
              "first-render-submission-transition",
              "The first render submission has not been observed."
            )
    };

    const presentation = {
      frameDrawn:
        state.firstFrameDrawn
          ? observedEvidence(
              true,
              "firstFrameDrawn",
              state.firstFrameAt,
              {
                evidenceKind:
                  EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION
              }
            )
          : unavailableEvidence(
              "firstFrameDrawn",
              "No completed frame has been recorded."
            ),

      visiblePresentationObserved:
        visiblePresentationObserved
          ? derivedEvidence(
              true,
              "visible-presentation",
              [
                "firstFrameDrawn",
                "firstVisiblePixelObserved"
              ],
              {
                observedAt:
                  state.lastVisiblePresentationAt,
                reason:
                  "Visible presentation requires both a completed frame and visible-pixel evidence."
              }
            )
          : unavailableEvidence(
              "visible-presentation",
              "Visible presentation has not been fully observed."
            ),

      visiblePixelObserved:
        state.firstVisiblePixelObserved
          ? observedEvidence(
              true,
              fallbackActive
                ? "fallback-canvas-draw"
                : "WebGL readPixels",
              state.lastVisiblePresentationAt,
              {
                evidenceKind:
                  fallbackActive
                    ? EVIDENCE_KIND.DIRECT_RENDER_OBSERVATION
                    : EVIDENCE_KIND.DIRECT_GPU_OBSERVATION
              }
            )
          : unavailableEvidence(
              fallbackActive
                ? "fallback-canvas-draw"
                : "WebGL readPixels",
              "No visible-pixel observation has been admitted."
            )
    };

    const backendState = {
      shaderErrorCount:
        observedEvidence(
          state.shaderErrors.length,
          "state.shaderErrors",
          state.updatedAt
        ),

      runtimeErrorCount:
        observedEvidence(
          state.errors.length,
          "state.errors",
          state.updatedAt
        ),

      contextRetained:
        state.gl
          ? observedEvidence(
              contextRetained,
              "webglcontextlost-state",
              state.updatedAt,
              {
                evidenceKind:
                  EVIDENCE_KIND.DIRECT_GPU_OBSERVATION,
                reason:
                  contextRetained
                    ? null
                    : "The WebGL context is currently lost or inactive."
              }
            )
          : fallbackActive
            ? notApplicableEvidence(
                "webglcontextlost-state",
                "WebGL context retention does not apply to the active fallback renderer."
              )
            : unavailableEvidence(
                "webglcontextlost-state",
                "No WebGL context has been admitted."
              ),

      fallbackActive:
        observedEvidence(
          state.fallbackActive,
          "state.fallbackActive",
          state.updatedAt,
          {
            evidenceKind:
              EVIDENCE_KIND.DIRECT_RUNTIME_OBSERVATION
          }
        )
    };

    const provenance = {
      runtimeOwner:
        RUNTIME_GLOBAL_NAME,

      geometryOwner:
        "DGBAudraliaPlanetGeometry",

      geometryEvidenceDelegated:
        true,

      rendererEvidenceOwned:
        true,

      namedSceneObjectDeclaredAbsent:
        true,

      namedCameraObjectDeclaredAbsent:
        true,

      namedMaterialObjectDeclaredAbsent:
        true,

      syntheticF13AliasesPublished:
        false,

      unavailableConvertedToFalse:
        false,

      falseEvidenceStateUsed:
        false,

      primaryRendererBackend:
        PRIMARY_RENDERER_BACKEND,

      activeRendererBackend:
        activeBackend,

      composedAt
    };

    return freezeOwned({
      schema:
        "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_ARCHITECTURE_EVIDENCE_v1",
      composedAt,
      identity,
      world,
      view,
      renderState,
      pipeline,
      submission,
      presentation,
      backendState,
      provenance
    });
  }

  function getStatus() {
    const geometryReceipt =
      state.geometryAuthority &&
      fn(
        state
          .geometryAuthority
          .getReceiptLight
      )
        ? state
            .geometryAuthority
            .getReceiptLight()
        : null;

    const evidence =
      architectureEvidence();

    return {
      contract:
        CONTRACT,

      receipt:
        RECEIPT,

      version:
        VERSION,

      file:
        FILE,

      modelId:
        MODEL_ID,

      runtimeGlobalName:
        RUNTIME_GLOBAL_NAME,

      rendererBackend:
        activeRendererBackend(),

      primaryRendererBackend:
        PRIMARY_RENDERER_BACKEND,

      activeRendererBackend:
        activeRendererBackend(),

      previousContract:
        PREVIOUS_CONTRACT,

      previousVersion:
        PREVIOUS_VERSION,

      renewalClass:
        RENEWAL_CLASS,

      installedAt:
        state.installedAt,

      updatedAt:
        state.updatedAt ||
        state.installedAt,

      mode:
        state.fallbackActive
          ? "fallback"
          : state.gl
            ? "webgl"
            : "held",

      mounted:
        state.mounted,

      initializing:
        state.initializing,

      running:
        state.running,

      paused:
        state.paused,

      destroyed:
        state.destroyed,

      reducedMotion:
        state.reducedMotion,

      stagePresent:
        Boolean(
          state.stage
        ),

      mountPresent:
        Boolean(
          state.mount
        ),

      canvasPresent:
        Boolean(
          state.canvas
        ),

      fallbackCanvasPresent:
        Boolean(
          state.fallbackCanvas
        ),

      stageRectNonzero:
        state.stageRectNonzero,

      width:
        state.width,

      height:
        state.height,

      pixelWidth:
        state.pixelWidth,

      pixelHeight:
        state.pixelHeight,

      devicePixelRatio:
        state.dpr,

      webGL:
        Boolean(
          state.gl &&
          !state.fallbackActive
        ),

      contextLost:
        state.contextLost,

      contextRestoreCount:
        state.contextRestoreCount,

      geometryAuthorityPresent:
        Boolean(
          state.geometryAuthority
        ),

      geometryReady:
        Boolean(
          state.geometryPacket &&
          state
            .geometryPacket
            .validation &&
          state
            .geometryPacket
            .validation
            .passed
        ),

      geometryHash:
        state.geometryPacket
          ? state
              .geometryPacket
              .geometryHash
          : "",

      geometryReceipt:
        plain(
          geometryReceipt
        ),

      terrainLevel:
        state.terrainLevel,

      firstFrameDrawn:
        state.firstFrameDrawn,

      firstVisiblePixelObserved:
        state.firstVisiblePixelObserved,

      firstFrameAt:
        state.firstFrameAt,

      frameCount:
        state.frameCount,

      drawCount:
        state.drawCount,

      renderInvocationCount:
        state.renderInvocationCount,

      renderSubmissionCount:
        state.renderSubmissionCount,

      firstRenderSubmissionObserved:
        state.firstRenderSubmissionObserved,

      shaderCompileAttemptCount:
        state.shaderCompileAttemptCount,

      shaderCompileSuccessCount:
        state.shaderCompileSuccessCount,

      shaderCompileFailureCount:
        state.shaderCompileFailureCount,

      programLinkAttemptCount:
        state.programLinkAttemptCount,

      programLinkSuccessCount:
        state.programLinkSuccessCount,

      programLinkFailureCount:
        state.programLinkFailureCount,

      webGLFrameMatricesConstructed:
        state.webGLFrameMatricesConstructed,

      webGLViewProjectionExecuted:
        state.webGLViewProjectionExecuted,

      fallbackViewTransformExecuted:
        state.fallbackViewTransformExecuted,

      fallbackWorldRendered:
        state.fallbackWorldRendered,

      lastFrameMatricesAt:
        state.lastFrameMatricesAt,

      lastViewProjectionExecutionAt:
        state.lastViewProjectionExecutionAt,

      lastFallbackViewTransformAt:
        state.lastFallbackViewTransformAt,

      lastFallbackWorldRenderAt:
        state.lastFallbackWorldRenderAt,

      lastRenderInvocationAt:
        state.lastRenderInvocationAt,

      lastRenderSubmissionAt:
        state.lastRenderSubmissionAt,

      lastDrawAt:
        state.lastDrawAt,

      lastVisiblePresentationAt:
        state.lastVisiblePresentationAt,

      lastFrameDurationMs:
        state.lastFrameDurationMs,

      averageFrameDurationMs:
        state.averageFrameDurationMs,

      fallbackActive:
        state.fallbackActive,

      fallbackReason:
        state.fallbackReason,

      shaderErrorCount:
        state.shaderErrors.length,

      errorCount:
        state.errors.length,

      eventCount:
        state.events.length,

      autoMountAttempts:
        state.autoMountAttempts,

      architectureEvidence:
        evidence,

      publicSuperiorityClaim:
        false,

      publicComparisonClaimAllowed:
        false,

      generatedImage:
        false,

      graphicBox:
        false,

      visualPassClaimed:
        false
    };
  }

  function receiptLight(
    suppliedStatus = null
  ) {
    const status =
      suppliedStatus ||
      getStatus();

    let receiptStatus =
      "HELD";

    if (
      !status.mountPresent ||
      !status.geometryAuthorityPresent
    ) {
      receiptStatus =
        "BLOCKED";
    } else if (
      status.errorCount > 0 &&
      !status.firstFrameDrawn
    ) {
      receiptStatus =
        "DEGRADED";
    } else if (
      status.mounted &&
      status.stageRectNonzero &&
      status.geometryReady &&
      status.firstFrameDrawn &&
      status.firstVisiblePixelObserved
    ) {
      receiptStatus =
        "READY";
    }

    return {
      contract:
        CONTRACT,

      receipt:
        RECEIPT,

      version:
        VERSION,

      file:
        FILE,

      modelId:
        MODEL_ID,

      runtimeGlobalName:
        RUNTIME_GLOBAL_NAME,

      rendererBackend:
        status.activeRendererBackend,

      primaryRendererBackend:
        status.primaryRendererBackend,

      activeRendererBackend:
        status.activeRendererBackend,

      previousContract:
        PREVIOUS_CONTRACT,

      previousVersion:
        PREVIOUS_VERSION,

      renewalClass:
        RENEWAL_CLASS,

      status:
        receiptStatus,

      ready:
        receiptStatus ===
        "READY",

      mode:
        status.mode,

      mounted:
        status.mounted,

      running:
        status.running,

      stageRectNonzero:
        status.stageRectNonzero,

      geometryReady:
        status.geometryReady,

      webGL:
        status.webGL,

      fallbackActive:
        status.fallbackActive,

      firstFrameDrawn:
        status.firstFrameDrawn,

      firstVisiblePixelObserved:
        status.firstVisiblePixelObserved,

      terrainLevel:
        status.terrainLevel,

      geometryHash:
        status.geometryHash,

      contextLost:
        status.contextLost,

      contextRestoreCount:
        status.contextRestoreCount,

      shaderCompileAttemptCount:
        status.shaderCompileAttemptCount,

      shaderCompileSuccessCount:
        status.shaderCompileSuccessCount,

      shaderCompileFailureCount:
        status.shaderCompileFailureCount,

      programLinkAttemptCount:
        status.programLinkAttemptCount,

      programLinkSuccessCount:
        status.programLinkSuccessCount,

      programLinkFailureCount:
        status.programLinkFailureCount,

      renderInvocationCount:
        status.renderInvocationCount,

      renderSubmissionCount:
        status.renderSubmissionCount,

      firstRenderSubmissionObserved:
        status.firstRenderSubmissionObserved,

      drawCount:
        status.drawCount,

      shaderErrorCount:
        status.shaderErrorCount,

      errorCount:
        status.errorCount,

      architectureEvidence:
        status.architectureEvidence,

      publicSuperiorityClaim:
        false,

      visualPassClaimed:
        false
    };
  }

  function getReceipt() {
    const status =
      getStatus();

    const light =
      receiptLight(
        status
      );

    const receipt = {
      ...light,

      statusDetail:
        status,

      viewState:
        viewState(),

      geometryMetrics:
        state.geometryPacket
          ? plain(
              state
                .geometryPacket
                .metrics
            )
          : null,

      geometryValidation:
        state.geometryPacket
          ? plain(
              state
                .geometryPacket
                .validation
            )
          : null,

      evidenceProvenance:
        status
          .architectureEvidence
          .provenance,

      shaderErrors:
        state.shaderErrors.map(
          plain
        ),

      errors:
        state.errors.map(
          plain
        ),

      recentEvents:
        state.events
          .slice(-40)
          .map(
            plain
          ),

      composedAt:
        iso()
    };

    state.lastReceipt =
      plain(
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

  function publishData(
    suppliedStatus = null
  ) {
    if (!doc) {
      return;
    }

    const status =
      suppliedStatus ||
      getStatus();

    const targets = [
      doc.documentElement,
      doc.body,
      state.stage,
      state.mount
    ].filter(
      Boolean
    );

    for (
      const target of
      targets
    ) {
      dataset(
        target,
        "audraliaPlanetRuntimeContract",
        CONTRACT
      );

      dataset(
        target,
        "audraliaPlanetRuntimeReceipt",
        RECEIPT
      );

      dataset(
        target,
        "audraliaPlanetRuntimeVersion",
        VERSION
      );

      dataset(
        target,
        "audraliaPlanetRuntimeGlobalName",
        RUNTIME_GLOBAL_NAME
      );

      dataset(
        target,
        "audraliaPlanetPrimaryRendererBackend",
        PRIMARY_RENDERER_BACKEND
      );

      dataset(
        target,
        "audraliaPlanetActiveRendererBackend",
        status.activeRendererBackend
      );

      dataset(
        target,
        "audraliaPlanetRendererBackend",
        status.rendererBackend
      );

      dataset(
        target,
        "audraliaPlanetRuntimeMode",
        status.mode
      );

      dataset(
        target,
        "audraliaPlanetRuntimeMounted",
        status.mounted
      );

      dataset(
        target,
        "audraliaPlanetRuntimeRunning",
        status.running
      );

      dataset(
        target,
        "audraliaPlanetRuntimeStageRectNonzero",
        status.stageRectNonzero
      );

      dataset(
        target,
        "audraliaPlanetRuntimeGeometryReady",
        status.geometryReady
      );

      dataset(
        target,
        "audraliaPlanetRuntimeWebGL",
        status.webGL
      );

      dataset(
        target,
        "audraliaPlanetRuntimeFirstFrame",
        status.firstFrameDrawn
      );

      dataset(
        target,
        "audraliaPlanetRuntimeVisiblePixel",
        status.firstVisiblePixelObserved
      );

      dataset(
        target,
        "audraliaPlanetRuntimeRenderInvocationCount",
        status.renderInvocationCount
      );

      dataset(
        target,
        "audraliaPlanetRuntimeRenderSubmissionCount",
        status.renderSubmissionCount
      );

      dataset(
        target,
        "audraliaPlanetRuntimeDrawCount",
        status.drawCount
      );

      dataset(
        target,
        "audraliaPlanetRuntimeShaderCompileSuccessCount",
        status.shaderCompileSuccessCount
      );

      dataset(
        target,
        "audraliaPlanetRuntimeProgramLinkSuccessCount",
        status.programLinkSuccessCount
      );

      dataset(
        target,
        "audraliaPlanetRuntimeTerrainLevel",
        status.terrainLevel ||
        ""
      );

      dataset(
        target,
        "audraliaPlanetRuntimeContextLost",
        status.contextLost
      );

      dataset(
        target,
        "audraliaPlanetRuntimeErrorCount",
        status.errorCount
      );

      dataset(
        target,
        "audraliaPlanetRuntimeVisualPassClaimed",
        "false"
      );
    }
  }

  function publish() {
    const status =
      getStatus();

    const lightReceipt =
      receiptLight(
        status
      );

    root.DGBAudraliaPlanetRuntime =
      api;

    root.DGBAudraliaPlanetRenderer =
      api;

    root.DGBAudraliaPlanetRoute =
      api;

    root.AUDRALIA_PLANET_RUNTIME_RECEIPT =
      lightReceipt;

    root.AUDRALIA_PLANET_ROUTE_RECEIPT =
      lightReceipt;

    root.mountAudraliaPlanet =
      mount;

    root.mountAudraliaCanvas =
      mount;

    root.__AUDRALIA_PLANET_RUNTIME_LOADED__ =
      true;

    root.__AUDRALIA_PLANET_RUNTIME_CONTRACT__ =
      CONTRACT;

    root.__AUDRALIA_PLANET_RUNTIME_RECEIPT__ =
      RECEIPT;

    root.__AUDRALIA_PLANET_RUNTIME_WEBGL__ =
      Boolean(
        state.gl &&
        !state.fallbackActive
      );

    root.__AUDRALIA_PLANET_RUNTIME_FALLBACK__ =
      state.fallbackActive;

    root.__AUDRALIA_PLANET_RUNTIME_FIRST_FRAME__ =
      state.firstFrameDrawn;

    root.__AUDRALIA_PLANET_RUNTIME_VISIBLE_PIXEL__ =
      state.firstVisiblePixelObserved;

    root.__AUDRALIA_PLANET_RUNTIME_VISUAL_PASS_CLAIMED__ =
      false;

    publishData(
      status
    );

    emit(
      "audralia-planet-runtime-state",
      lightReceipt
    );

    return lightReceipt;
  }

  const api = {
    contract:
      CONTRACT,

    receipt:
      RECEIPT,

    version:
      VERSION,

    previousContract:
      PREVIOUS_CONTRACT,

    previousVersion:
      PREVIOUS_VERSION,

    renewalClass:
      RENEWAL_CLASS,

    file:
      FILE,

    modelId:
      MODEL_ID,

    runtimeGlobalName:
      RUNTIME_GLOBAL_NAME,

    primaryRendererBackend:
      PRIMARY_RENDERER_BACKEND,

    get rendererBackend() {
      return activeRendererBackend();
    },

    get activeRendererBackend() {
      return activeRendererBackend();
    },

    mount,
    autoMount,
    resize,
    destroy,
    resetView,
    togglePause,
    toggleClouds,
    toggleAtmosphere,

    getViewState:
      viewState,

    getArchitectureEvidence:
      architectureEvidence,

    getStatus,

    status:
      getStatus,

    getReceiptLight:
      receiptLight,

    getReceipt,
    getReceiptText,

    publishGlobals:
      publish,

    nativeWebGL:
      true,

    canvasFallback:
      true,

    deterministicGeometryConsumer:
      true,

    ownsGeometry:
      false,

    ownsTopology:
      false,

    ownsHydrology:
      false,

    ownsTerrainClassification:
      false,

    ownsRendering:
      true,

    ownsCamera:
      true,

    ownsLighting:
      true,

    ownsControls:
      true,

    ownsFallback:
      true,

    ownsRuntimeEvidence:
      true,

    ownsFinalVisualPassClaim:
      false,

    namedSceneObjectUsed:
      false,

    namedCameraObjectUsed:
      false,

    namedMaterialObjectUsed:
      false,

    syntheticF13AliasesPublished:
      false,

    publicSuperiorityClaim:
      false,

    publicComparisonClaimAllowed:
      false,

    generatedImage:
      false,

    graphicBox:
      false,

    visualPassClaimed:
      false,

    get state() {
      return state;
    }
  };

  event(
    "AUDRALIA_PLANET_RUNTIME_LOADED",
    {
      file:
        FILE,

      contract:
        CONTRACT,

      version:
        VERSION,

      previousVersion:
        PREVIOUS_VERSION,

      modelId:
        MODEL_ID,

      runtimeGlobalName:
        RUNTIME_GLOBAL_NAME,

      primaryRendererBackend:
        PRIMARY_RENDERER_BACKEND,

      geometryAuthorityPresent:
        Boolean(
          geometryAuthority()
        ),

      stageId:
        STAGE_ID,

      mountId:
        MOUNT_ID
    }
  );

  publish();

  if (doc) {
    if (
      doc.readyState ===
      "loading"
    ) {
      listen(
        doc,
        "DOMContentLoaded",
        () =>
          autoMount(0),
        {
          once: true
        }
      );
    } else {
      autoMount(0);
    }
  }

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
