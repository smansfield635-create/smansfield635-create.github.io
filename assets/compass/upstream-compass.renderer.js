/* /assets/compass/upstream-compass.renderer.js
   Shared Home Compass renderer authority.

   Dependency position:
   1. /products/archcoin/index.controller.js
   2. /assets/compass/upstream-compass.geometry.js
   3. /assets/compass/upstream-compass.renderer.js
   4. /products/archcoin/index.crystals.js
   5. /products/archcoin/index.html
   6. /assets/compass/upstream-compass.css
   7. /products/archcoin/index.css

   Governing boundaries:
   - The controller owns selection meaning, route law, restoration law, and
     shared lower-selection-chamber state.
   - Geometry owns physical form, mesh buffers, material identities, local
     presentation transforms, and fallback projection.
   - This renderer owns WebGL resources, lighting, transform interpolation,
     fallback-first promotion, and visual-state synchronization.
   - Crystals owns constellation and room-cluster scene execution.
   - HTML owns the semantic control.
   - CSS presents already-closed runtime state.

   Runtime law:
   - A Compass tap requests controller-owned Compass selection.
   - A Compass tap never performs immediate navigation.
   - requestCompassDecision is the primary semantic callback.
   - requestReturnToUpstream is compatibility-only.
   - The Compass receives no independent gesture-delta stream.
   - The Compass inherits constellation orientation only.
   - Active room-cluster orientation never rotates the Compass body.
   - The renderer composes constellation orientation with the selected local
     geometry presentation transform.
   - Geometry hit metadata remains declarative and does not create pointer
     authority.
   - Static fallback remains visible until one enhanced frame completes without
     a WebGL error.

   Final transform law:
   CONSTELLATION_ORIENTATION * COMPASS_LOCAL_PRESENTATION_TRANSFORM
*/

const DGB_UPSTREAM_COMPASS_RENDERER = (() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_UPSTREAM_COMPASS_RENDERER",
    version: "2.0.1-constellation-parent-correction",
    file: "/assets/compass/upstream-compass.renderer.js"
  });

  const GEOMETRY_AUTHORITY_ID =
    "DGB_UPSTREAM_COMPASS_GEOMETRY";

  const RECEIPT_SYMBOL =
    "DGB_UPSTREAM_COMPASS_RENDERER_RECEIPT";

  const FAILURE_EVENT =
    "DGB_UPSTREAM_COMPASS_RENDERER_FAILURE";

  const RENDERER_STATUS = Object.freeze({
    INITIALIZING: "initializing",
    AVAILABLE: "available",
    FALLBACK: "fallback",
    FAILED: "failed",
    DISPOSED: "disposed"
  });

  const PRESENTATION_MODES = Object.freeze({
    EMBEDDED: "EMBEDDED",
    DECISION_APPROACH: "DECISION_APPROACH",
    FAILURE_FALLBACK: "FAILURE_FALLBACK"
  });

  const PARENT_ORIENTATION_SOURCES = Object.freeze({
    EXPLICIT_CONTEXT: "EXPLICIT_CONTEXT",
    FRAME_DECLARED: "FRAME_DECLARED",
    FRAME_ORBIT: "FRAME_ORBIT",
    IDENTITY: "IDENTITY"
  });

  const QUALITY = Object.freeze({
    normalDevicePixelRatioCap: 2,
    lowPowerDevicePixelRatioCap: 1.5,
    lowPowerHardwareConcurrencyThreshold: 4,
    bloomDisableWidthPx: 420,
    mobileAspectThreshold: 0.82,
    defaultFieldOfViewRadians: Math.PI / 4.9,
    mobileFieldOfViewRadians: Math.PI / 4.45,
    cameraDistance: 5.4,
    interpolationSpeed: 9.5,
    parentInterpolationSpeed: 12,
    hoverScale: 1.025,
    haloExpansion: 0.045,
    minimumCssSceneSize: 1,
    maximumDeltaSeconds: 0.05,
    quaternionEpsilon: 1e-7,
    vectorEpsilon: 1e-6
  });

  const MATERIALS = Object.freeze({
    OUTER_HOUSING: Object.freeze({
      baseColor: Object.freeze([0.76, 0.79, 0.84]),
      alpha: 0.98,
      emissive: 0.025,
      specular: 1.18,
      rim: 0.72,
      halo: 0.58
    }),

    OUTER_BEZEL: Object.freeze({
      baseColor: Object.freeze([0.55, 0.60, 0.68]),
      alpha: 0.97,
      emissive: 0.035,
      specular: 1.08,
      rim: 0.68,
      halo: 0.52
    }),

    INNER_BEZEL: Object.freeze({
      baseColor: Object.freeze([0.40, 0.46, 0.54]),
      alpha: 0.96,
      emissive: 0.025,
      specular: 0.98,
      rim: 0.60,
      halo: 0.42
    }),

    DIAL_BED: Object.freeze({
      baseColor: Object.freeze([0.12, 0.15, 0.21]),
      alpha: 0.98,
      emissive: 0.015,
      specular: 0.56,
      rim: 0.34,
      halo: 0.16
    }),

    PRINCIPAL_DIRECTION: Object.freeze({
      baseColor: Object.freeze([0.58, 0.63, 0.70]),
      alpha: 0.97,
      emissive: 0.03,
      specular: 1.02,
      rim: 0.62,
      halo: 0.42
    }),

    PRINCIPAL_DIRECTION_FACET: Object.freeze({
      baseColor: Object.freeze([0.74, 0.77, 0.80]),
      alpha: 0.98,
      emissive: 0.045,
      specular: 1.16,
      rim: 0.70,
      halo: 0.50
    }),

    NORTH_NEEDLE: Object.freeze({
      baseColor: Object.freeze([0.86, 0.82, 0.68]),
      alpha: 0.99,
      emissive: 0.075,
      specular: 1.24,
      rim: 0.82,
      halo: 0.76
    }),

    NORTH_NEEDLE_FACET: Object.freeze({
      baseColor: Object.freeze([0.98, 0.92, 0.73]),
      alpha: 1,
      emissive: 0.12,
      specular: 1.34,
      rim: 0.90,
      halo: 0.90
    }),

    HUB_BASE: Object.freeze({
      baseColor: Object.freeze([0.28, 0.33, 0.40]),
      alpha: 0.99,
      emissive: 0.025,
      specular: 0.96,
      rim: 0.58,
      halo: 0.34
    }),

    HUB_CROWN: Object.freeze({
      baseColor: Object.freeze([0.48, 0.53, 0.60]),
      alpha: 0.99,
      emissive: 0.04,
      specular: 1.14,
      rim: 0.70,
      halo: 0.52
    }),

    HUB_JEWEL: Object.freeze({
      baseColor: Object.freeze([0.88, 0.84, 0.70]),
      alpha: 1,
      emissive: 0.11,
      specular: 1.30,
      rim: 0.88,
      halo: 0.84
    }),

    INTERCARDINAL_TICK: Object.freeze({
      baseColor: Object.freeze([0.63, 0.67, 0.73]),
      alpha: 0.96,
      emissive: 0.025,
      specular: 0.90,
      rim: 0.56,
      halo: 0.34
    })
  });

  const DEFAULT_MATERIAL =
    MATERIALS.PRINCIPAL_DIRECTION;

  const RECEIPT = {
    moduleId: MODULE.id,
    moduleVersion: MODULE.version,
    status: "pending",
    geometryAuthority: GEOMETRY_AUTHORITY_ID,
    mountedInstanceCount: 0,
    lastInstanceId: "",
    lastFailure: "",
    lastMountPageNodeId: "",
    lastParentRoute: "",
    lastRendererStatus: "",
    lastPresentationMode: "",
    lastParentOrientationSource: "",
    lastReducedMotion: false,
    firstEnhancedFrameCompleted: false,
    parentOrientationInherited: true,
    constellationOrientationOnly: true,
    clusterOrientationApplied: false,
    independentGestureAuthority: false,
    nativeNavigationFallthrough: false
  };

  const INSTANCES =
    new Map();

  let instanceCounter =
    0;

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uViewNormalMatrix;
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vViewNormal;
    varying vec3 vViewPosition;
    varying float vHaloPass;

    void main() {
      vec3 position = aPosition;

      if (uHaloPass > 0.5) {
        position += normalize(aNormal) * uHaloExpansion;
      }

      vec4 worldPosition =
        uModel * vec4(position, 1.0);

      vec4 viewPosition =
        uView * worldPosition;

      vViewNormal =
        normalize(uViewNormalMatrix * aNormal);

      vViewPosition =
        viewPosition.xyz;

      vHaloPass =
        uHaloPass;

      gl_Position =
        uProjection * viewPosition;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vViewNormal;
    varying vec3 vViewPosition;
    varying float vHaloPass;

    uniform vec3 uBaseColor;
    uniform vec3 uAmbientColor;
    uniform vec3 uKeyLightView;
    uniform vec3 uFillLightView;
    uniform vec3 uRimLightView;
    uniform float uAlpha;
    uniform float uEmissive;
    uniform float uSpecular;
    uniform float uRim;
    uniform float uHaloStrength;

    void main() {
      vec3 normal =
        normalize(vViewNormal);

      vec3 viewDirection =
        normalize(-vViewPosition);

      vec3 keyDirection =
        normalize(-uKeyLightView);

      vec3 fillDirection =
        normalize(-uFillLightView);

      vec3 rimDirection =
        normalize(-uRimLightView);

      float key =
        max(dot(normal, keyDirection), 0.0);

      float fill =
        max(dot(normal, fillDirection), 0.0);

      float rear =
        max(dot(normal, rimDirection), 0.0);

      float fresnel =
        pow(
          1.0 -
          max(
            dot(normal, viewDirection),
            0.0
          ),
          2.0
        );

      vec3 halfDirection =
        normalize(
          keyDirection +
          viewDirection
        );

      float specular =
        pow(
          max(
            dot(normal, halfDirection),
            0.0
          ),
          28.0
        );

      if (vHaloPass > 0.5) {
        vec3 haloColor =
          uBaseColor *
          (
            0.42 +
            fresnel * 1.22 +
            rear * 0.22
          ) *
          uHaloStrength;

        float haloAlpha =
          clamp(
            (
              0.025 +
              fresnel * 0.18
            ) *
            uHaloStrength,
            0.0,
            0.30
          );

        gl_FragColor =
          vec4(
            haloColor,
            haloAlpha
          );

        return;
      }

      float diffuse =
        0.18 +
        key * 0.84 +
        fill * 0.30 +
        rear * 0.11;

      vec3 color =
        uBaseColor * diffuse +
        uBaseColor * uEmissive +
        vec3(1.0, 0.97, 0.88) *
          specular *
          uSpecular +
        uBaseColor *
          fresnel *
          uRim *
          0.72 +
        uAmbientColor *
          uBaseColor *
          0.22;

      gl_FragColor =
        vec4(
          color,
          uAlpha
        );
    }
  `;

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error =
      new Error(code);

    error.code =
      code;

    error.details =
      details;

    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(
      selector
    );
  }

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.max(
      minimum,
      Math.min(
        maximum,
        value
      )
    );
  }

  function normalizeArray3(
    value,
    fallback
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 3) {
      return fallback.slice();
    }

    return [
      finiteNumber(
        source[0],
        fallback[0]
      ),

      finiteNumber(
        source[1],
        fallback[1]
      ),

      finiteNumber(
        source[2],
        fallback[2]
      )
    ];
  }

  function normalizeQuaternion(
    value,
    fallback = [0, 0, 0, 1]
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(
        source[0],
        fallback[0]
      ),

      finiteNumber(
        source[1],
        fallback[1]
      ),

      finiteNumber(
        source[2],
        fallback[2]
      ),

      finiteNumber(
        source[3],
        fallback[3]
      )
    ];

    const length =
      Math.hypot(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3]
      );

    if (
      !Number.isFinite(length) ||
      length <=
        QUALITY.quaternionEpsilon
    ) {
      return fallback.slice();
    }

    return quaternion.map(
      component =>
        component / length
    );
  }

  function quaternionDot(a, b) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2] +
      a[3] * b[3]
    );
  }

  function quaternionSlerp(
    a,
    b,
    amount
  ) {
    const start =
      normalizeQuaternion(a);

    let end =
      normalizeQuaternion(b);

    let cosine =
      quaternionDot(
        start,
        end
      );

    if (cosine < 0) {
      end =
        end.map(
          component =>
            -component
        );

      cosine =
        -cosine;
    }

    const t =
      clamp(
        amount,
        0,
        1
      );

    if (cosine > 0.9995) {
      return normalizeQuaternion([
        start[0] +
          (
            end[0] -
            start[0]
          ) *
          t,

        start[1] +
          (
            end[1] -
            start[1]
          ) *
          t,

        start[2] +
          (
            end[2] -
            start[2]
          ) *
          t,

        start[3] +
          (
            end[3] -
            start[3]
          ) *
          t
      ]);
    }

    const theta =
      Math.acos(
        clamp(
          cosine,
          -1,
          1
        )
      );

    const sine =
      Math.sin(theta);

    if (
      Math.abs(sine) <=
      QUALITY.quaternionEpsilon
    ) {
      return start;
    }

    const startWeight =
      Math.sin(
        (1 - t) *
        theta
      ) /
      sine;

    const endWeight =
      Math.sin(
        t *
        theta
      ) /
      sine;

    return normalizeQuaternion([
      start[0] *
        startWeight +
      end[0] *
        endWeight,

      start[1] *
        startWeight +
      end[1] *
        endWeight,

      start[2] *
        startWeight +
      end[2] *
        endWeight,

      start[3] *
        startWeight +
      end[3] *
        endWeight
    ]);
  }

  function interpolateArray3(
    current,
    target,
    amount
  ) {
    const t =
      clamp(
        amount,
        0,
        1
      );

    return [
      current[0] +
        (
          target[0] -
          current[0]
        ) *
        t,

      current[1] +
        (
          target[1] -
          current[1]
        ) *
        t,

      current[2] +
        (
          target[2] -
          current[2]
        ) *
        t
    ];
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(a, b) {
    const output =
      new Array(16).fill(0);

    for (
      let row = 0;
      row < 4;
      row += 1
    ) {
      for (
        let column = 0;
        column < 4;
        column += 1
      ) {
        for (
          let index = 0;
          index < 4;
          index += 1
        ) {
          output[
            column * 4 +
            row
          ] +=
            a[
              index * 4 +
              row
            ] *
            b[
              column * 4 +
              index
            ];
        }
      }
    }

    return output;
  }

  function translate4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[12] = x;
    matrix[13] = y;
    matrix[14] = z;

    return matrix;
  }

  function scale4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[0] = x;
    matrix[5] = y;
    matrix[10] = z;

    return matrix;
  }

  function quaternionToMatrix4(
    value
  ) {
    const [
      x,
      y,
      z,
      w
    ] =
      normalizeQuaternion(value);

    return [
      1 - 2 * (y * y + z * z),
      2 * (x * y + z * w),
      2 * (x * z - y * w),
      0,

      2 * (x * y - z * w),
      1 - 2 * (x * x + z * z),
      2 * (y * z + x * w),
      0,

      2 * (x * z + y * w),
      2 * (y * z - x * w),
      1 - 2 * (x * x + y * y),
      0,

      0,
      0,
      0,
      1
    ];
  }

  function perspective4(
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const factor =
      1 /
      Math.tan(
        fieldOfView / 2
      );

    const range =
      1 /
      (near - far);

    return [
      factor / aspect,
      0,
      0,
      0,

      0,
      factor,
      0,
      0,

      0,
      0,
      (far + near) * range,
      -1,

      0,
      0,
      2 * far * near * range,
      0
    ];
  }

  function subtract3(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function dot3(a, b) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function cross3(a, b) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function normalize3(
    vector,
    fallback = [0, 0, 1]
  ) {
    const length =
      Math.hypot(
        vector[0],
        vector[1],
        vector[2]
      );

    if (
      !Number.isFinite(length) ||
      length <=
        QUALITY.vectorEpsilon
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function lookAt4(
    eye,
    center,
    up
  ) {
    const z =
      normalize3(
        subtract3(
          eye,
          center
        )
      );

    const x =
      normalize3(
        cross3(
          up,
          z
        ),
        [1, 0, 0]
      );

    const y =
      cross3(
        z,
        x
      );

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot3(x, eye),
      -dot3(y, eye),
      -dot3(z, eye),
      1
    ];
  }

  function inverseTransposeNormalMatrix3(
    modelView
  ) {
    const a00 =
      modelView[0];

    const a01 =
      modelView[4];

    const a02 =
      modelView[8];

    const a10 =
      modelView[1];

    const a11 =
      modelView[5];

    const a12 =
      modelView[9];

    const a20 =
      modelView[2];

    const a21 =
      modelView[6];

    const a22 =
      modelView[10];

    const b01 =
      a22 * a11 -
      a12 * a21;

    const b11 =
      -a22 * a10 +
      a12 * a20;

    const b21 =
      a21 * a10 -
      a11 * a20;

    let determinant =
      a00 * b01 +
      a01 * b11 +
      a02 * b21;

    if (
      !Number.isFinite(
        determinant
      ) ||
      Math.abs(
        determinant
      ) <=
        QUALITY.vectorEpsilon
    ) {
      return [
        a00, a10, a20,
        a01, a11, a21,
        a02, a12, a22
      ];
    }

    determinant =
      1 / determinant;

    const inverse = [
      b01 * determinant,

      (
        -a22 * a01 +
        a02 * a21
      ) *
      determinant,

      (
        a12 * a01 -
        a02 * a11
      ) *
      determinant,

      b11 * determinant,

      (
        a22 * a00 -
        a02 * a20
      ) *
      determinant,

      (
        -a12 * a00 +
        a02 * a10
      ) *
      determinant,

      b21 * determinant,

      (
        -a21 * a00 +
        a01 * a20
      ) *
      determinant,

      (
        a11 * a00 -
        a01 * a10
      ) *
      determinant
    ];

    return [
      inverse[0],
      inverse[3],
      inverse[6],

      inverse[1],
      inverse[4],
      inverse[7],

      inverse[2],
      inverse[5],
      inverse[8]
    ];
  }

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

    invariant(
      shader,
      "SHADER_CREATION_FAILURE"
    );

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
      const info =
        gl.getShaderInfoLog(
          shader
        ) ||
        "SHADER_COMPILE_FAILURE";

      gl.deleteShader(
        shader
      );

      const error =
        new Error(info);

      error.code =
        "SHADER_COMPILE_FAILURE";

      throw error;
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragment =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );

    const program =
      gl.createProgram();

    invariant(
      program,
      "PROGRAM_CREATION_FAILURE"
    );

    gl.attachShader(
      program,
      vertex
    );

    gl.attachShader(
      program,
      fragment
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(
      vertex
    );

    gl.deleteShader(
      fragment
    );

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const info =
        gl.getProgramInfoLog(
          program
        ) ||
        "PROGRAM_LINK_FAILURE";

      gl.deleteProgram(
        program
      );

      const error =
        new Error(info);

      error.code =
        "PROGRAM_LINK_FAILURE";

      throw error;
    }

    return program;
  }

  function createBuffer(
    gl,
    target,
    data
  ) {
    const buffer =
      gl.createBuffer();

    invariant(
      buffer,
      "WEBGL_BUFFER_CREATION_FAILED",
      {
        target
      }
    );

    gl.bindBuffer(
      target,
      buffer
    );

    gl.bufferData(
      target,
      data,
      gl.STATIC_DRAW
    );

    return buffer;
  }

  function bindAttrib(
    gl,
    buffer,
    location,
    size
  ) {
    invariant(
      location >= 0,
      "WEBGL_ATTRIBUTE_LOCATION_INVALID",
      {
        location
      }
    );

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

  function publishReceipt(
    extra = {}
  ) {
    Object.assign(
      RECEIPT,
      {
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        mountedInstanceCount:
          INSTANCES.size,

        parentOrientationInherited:
          true,

        constellationOrientationOnly:
          true,

        clusterOrientationApplied:
          false,

        independentGestureAuthority:
          false,

        nativeNavigationFallthrough:
          false
      },
      extra
    );

    globalThis[
      RECEIPT_SYMBOL
    ] =
      Object.freeze({
        ...RECEIPT
      });
  }

  function emitFailure(
    reason,
    details = null
  ) {
    publishReceipt({
      status:
        "failed",

      lastFailure:
        String(
          reason ||
          "UNKNOWN_RENDERER_FAILURE"
        )
    });

    globalThis.dispatchEvent(
      new CustomEvent(
        FAILURE_EVENT,
        {
          detail:
            Object.freeze({
              reason:
                String(
                  reason ||
                  "UNKNOWN_RENDERER_FAILURE"
                ),

              details
            })
        }
      )
    );
  }

  function resolveGeometryAuthority() {
    const geometry =
      globalThis
        .DGB_UPSTREAM_COMPASS_GEOMETRY;

    invariant(
      geometry &&
      typeof geometry ===
        "object",
      "GEOMETRY_AUTHORITY_NOT_FOUND"
    );

    invariant(
      geometry.moduleId ===
        GEOMETRY_AUTHORITY_ID,
      "GEOMETRY_AUTHORITY_ID_MISMATCH"
    );

    invariant(
      typeof geometry.buildModel ===
        "function",
      "GEOMETRY_BUILD_MODEL_SURFACE_REQUIRED"
    );

    invariant(
      typeof geometry
        .buildStaticSvgFallback ===
        "function",
      "GEOMETRY_STATIC_SVG_SURFACE_REQUIRED"
    );

    return geometry;
  }

  function resolveQualityProfileId(
    pageContext
  ) {
    const requested =
      String(
        pageContext
          .qualityProfileId ||
        "desktop"
      );

    if (
      requested ===
        "desktop" ||
      requested ===
        "mobile" ||
      requested ===
        "lowPower"
    ) {
      return requested;
    }

    return "desktop";
  }

  function normalizePresentationState(
    input
  ) {
    const source =
      input &&
      typeof input ===
        "object"
        ? input
        : {};

    const mode =
      Object.values(
        PRESENTATION_MODES
      ).includes(
        source.mode
      )
        ? source.mode
        : PRESENTATION_MODES
            .EMBEDDED;

    return Object.freeze({
      mode,

      selected:
        source.selected ===
          true ||
        source.decisionOpen ===
          true,

      decisionOpen:
        source.decisionOpen ===
        true,

      cameraLowered:
        source.cameraLowered ===
        true,

      interactionEnabled:
        source.interactionEnabled !==
        false,

      reducedMotion:
        source.reducedMotion ===
        true,

      destinationType:
        String(
          source.destinationType ||
          "home-compass"
        ),

      destinationId:
        String(
          source.destinationId ||
          "home-compass"
        ),

      route:
        String(
          source.route ||
          "/index.html"
        ),

      rendererStatus:
        String(
          source.rendererStatus ||
          ""
        ),

      rendererFailure:
        String(
          source.rendererFailure ||
          ""
        )
    });
  }

  function normalizeContext(
    pageContext
  ) {
    invariant(
      pageContext &&
      typeof pageContext ===
        "object",
      "PAGE_CONTEXT_REQUIRED"
    );

    const root =
      pageContext.root;

    const scene =
      pageContext.scene;

    const mount =
      pageContext.mount ||
      qs(
        "[data-upstream-compass-mount]",
        root
      );

    const semanticControl =
      pageContext
        .semanticControl ||
      qs(
        "[data-upstream-compass-control]",
        mount
      );

    const fallback =
      pageContext.fallback ||
      qs(
        "[data-upstream-compass-fallback]",
        mount
      );

    invariant(
      root instanceof Element,
      "PAGE_CONTEXT_ROOT_REQUIRED"
    );

    invariant(
      scene instanceof Element,
      "PAGE_CONTEXT_SCENE_REQUIRED"
    );

    invariant(
      mount instanceof Element,
      "UPSTREAM_COMPASS_MOUNT_REQUIRED"
    );

    invariant(
      semanticControl instanceof
        Element,
      "UPSTREAM_COMPASS_SEMANTIC_CONTROL_REQUIRED"
    );

    invariant(
      fallback instanceof Element,
      "UPSTREAM_COMPASS_FALLBACK_REQUIRED"
    );

    const pageNodeId =
      String(
        pageContext.pageNodeId ||
        mount.getAttribute(
          "data-upstream-compass-page-node"
        ) ||
        ""
      ).trim();

    const parentNodeId =
      String(
        pageContext.parentNodeId ||
        mount.getAttribute(
          "data-upstream-compass-parent-node"
        ) ||
        "home-compass"
      ).trim();

    const parentRoute =
      String(
        pageContext.parentRoute ||
        mount.getAttribute(
          "data-upstream-compass-parent-route"
        ) ||
        "/index.html"
      ).trim();

    invariant(
      pageNodeId.length > 0,
      "PAGE_NODE_ID_REQUIRED"
    );

    invariant(
      parentNodeId.length > 0,
      "PARENT_NODE_ID_REQUIRED"
    );

    invariant(
      parentRoute.startsWith(
        "/"
      ),
      "PARENT_ROUTE_REQUIRED"
    );

    const declaredHref =
      semanticControl.tagName ===
        "A"
        ? String(
            semanticControl
              .getAttribute(
                "href"
              ) ||
            ""
          ).trim()
        : "";

    const routeParity =
      !declaredHref ||
      declaredHref ===
        parentRoute;

    mount.dataset
      .upstreamCompassRouteParity =
      routeParity
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassDeclaredHref =
      declaredHref;

    mount.dataset
      .upstreamCompassAuthoritativeRoute =
      parentRoute;

    const requestCompassDecision =
      typeof pageContext
        .requestCompassDecision ===
        "function"
        ? pageContext
            .requestCompassDecision
        : typeof pageContext
            .requestReturnToUpstream ===
            "function"
          ? pageContext
              .requestReturnToUpstream
          : null;

    invariant(
      typeof requestCompassDecision ===
        "function",
      "REQUEST_COMPASS_DECISION_SURFACE_REQUIRED"
    );

    return Object.freeze({
      root,
      scene,
      mount,
      semanticControl,
      fallback,
      pageNodeId,
      parentNodeId,
      parentRoute,
      declaredHref,
      routeParity,

      controller:
        pageContext.controller ||
        null,

      requestCompassDecision,

      requestReturnToUpstream:
        typeof pageContext
          .requestReturnToUpstream ===
          "function"
          ? pageContext
              .requestReturnToUpstream
          : null,

      getFrameState:
        typeof pageContext
          .getFrameState ===
          "function"
          ? pageContext
              .getFrameState
          : null,

      subscribeFrameState:
        typeof pageContext
          .subscribeFrameState ===
          "function"
          ? pageContext
              .subscribeFrameState
          : null,

      getParentOrientationState:
        typeof pageContext
          .getParentOrientationState ===
          "function"
          ? pageContext
              .getParentOrientationState
          : null,

      subscribeParentOrientationState:
        typeof pageContext
          .subscribeParentOrientationState ===
          "function"
          ? pageContext
              .subscribeParentOrientationState
          : null,

      getCompassPresentationState:
        typeof pageContext
          .getCompassPresentationState ===
          "function"
          ? pageContext
              .getCompassPresentationState
          : null,

      subscribeCompassPresentationState:
        typeof pageContext
          .subscribeCompassPresentationState ===
          "function"
          ? pageContext
              .subscribeCompassPresentationState
          : null,

      getReducedMotion:
        typeof pageContext
          .getReducedMotion ===
          "function"
          ? pageContext
              .getReducedMotion
          : null,

      subscribeReducedMotion:
        typeof pageContext
          .subscribeReducedMotion ===
          "function"
          ? pageContext
              .subscribeReducedMotion
          : null,

      qualityProfileId:
        resolveQualityProfileId(
          pageContext
        )
    });
  }

  function createCanvas(mount) {
    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.dataset
      .upstreamCompassCanvas =
      "true";

    canvas.dataset
      .upstreamCompassCanvasVisible =
      "false";

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "role",
      "presentation"
    );

    canvas.style.position =
      "absolute";

    canvas.style.left =
      "50%";

    canvas.style.top =
      "50%";

    canvas.style.transform =
      "translate(-50%, -50%)";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.display =
      "block";

    canvas.style.pointerEvents =
      "none";

    canvas.style.opacity =
      "0";

    mount.prepend(
      canvas
    );

    return canvas;
  }

  function getGL(canvas) {
    return (
      canvas.getContext(
        "webgl",
        {
          alpha: true,
          antialias: true,
          depth: true,
          premultipliedAlpha:
            true,
          preserveDrawingBuffer:
            false
        }
      ) ||
      null
    );
  }

  function setMountRendererStatus(
    instance,
    status
  ) {
    instance.rendererStatus =
      String(
        status ||
        RENDERER_STATUS
          .INITIALIZING
      );

    instance.context.mount
      .dataset
      .upstreamCompassRendererStatus =
      instance.rendererStatus;
  }

  function setCanvasVisible(
    instance,
    visible
  ) {
    const active =
      visible === true;

    instance.canvas.dataset
      .upstreamCompassCanvasVisible =
      active
        ? "true"
        : "false";

    instance.canvas.style.opacity =
      active
        ? "1"
        : "0";
  }

  function setFallbackVisible(
    instance,
    visible
  ) {
    const active =
      visible === true;

    const fallback =
      instance.context
        .fallback;

    fallback.dataset
      .upstreamCompassFallbackVisible =
      active
        ? "true"
        : "false";

    fallback.hidden =
      !active;

    fallback.style.display =
      active
        ? ""
        : "none";

    fallback.style.opacity =
      active
        ? "1"
        : "0";

    fallback.style.visibility =
      active
        ? "visible"
        : "hidden";
  }

  function publishMountState(
    instance
  ) {
    const mount =
      instance.context.mount;

    mount.dataset
      .upstreamCompassPresentationMode =
      instance
        .presentationState
        .mode;

    mount.dataset
      .upstreamCompassSelected =
      instance
        .presentationState
        .selected
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassDecisionOpen =
      instance
        .presentationState
        .decisionOpen
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassInteractionEnabled =
      instance
        .presentationState
        .interactionEnabled
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassReducedMotion =
      instance.reducedMotion
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassFirstEnhancedFrame =
      instance
        .firstEnhancedFrameCompleted
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassParentOrientationSource =
      instance
        .parentOrientationSource;

    mount.dataset
      .upstreamCompassInheritsParentOrientation =
      "true";

    mount.dataset
      .upstreamCompassConstellationOrientationOnly =
      "true";

    mount.dataset
      .upstreamCompassClusterOrientationApplied =
      "false";

    mount.dataset
      .upstreamCompassIndependentGestureAuthority =
      "false";
  }

  function applyPresentationVisibility(
    instance
  ) {
    publishMountState(
      instance
    );

    if (
      instance.destroyed ||
      instance.rendererStatus ===
        RENDERER_STATUS.DISPOSED
    ) {
      setCanvasVisible(
        instance,
        false
      );

      setFallbackVisible(
        instance,
        true
      );

      return;
    }

    if (
      instance
        .renderFailureEmitted ||
      instance.rendererStatus ===
        RENDERER_STATUS.FAILED ||
      instance
        .presentationState
        .mode ===
        PRESENTATION_MODES
          .FAILURE_FALLBACK
    ) {
      setCanvasVisible(
        instance,
        false
      );

      setFallbackVisible(
        instance,
        true
      );

      return;
    }

    if (
      instance
        .firstEnhancedFrameCompleted &&
      instance.gl
    ) {
      setCanvasVisible(
        instance,
        true
      );

      setFallbackVisible(
        instance,
        false
      );

      return;
    }

    setCanvasVisible(
      instance,
      false
    );

    setFallbackVisible(
      instance,
      true
    );
  }

  function replaceFallbackContent(
    instance
  ) {
    const fallbackSurface =
      instance.geometry
        .buildStaticSvgFallback({
          title:
            "Home Compass",

          className:
            "dgb-upstream-compass-static-fallback",

          includeTitle:
            true,

          includeIntercardinalTicks:
            instance.model
              .includeIntercardinalTicks,

          ariaHidden:
            true,

          focusable:
            false
        });

    instance.fallbackSurface =
      fallbackSurface;

    instance.context
      .fallback
      .innerHTML =
      fallbackSurface
        .svgString;

    instance.context
      .fallback
      .dataset
      .upstreamCompassFallbackInjected =
      "true";
  }

  function presentationTransformForMode(
    model,
    mode
  ) {
    if (
      mode ===
      PRESENTATION_MODES
        .DECISION_APPROACH
    ) {
      return model
        .presentationTransforms
        .decisionApproach;
    }

    return model
      .presentationTransforms
      .embedded;
  }

  function normalizeLocalTransform(
    transform
  ) {
    return Object.freeze({
      position:
        normalizeArray3(
          transform &&
          transform.position,
          [0, 0, 0]
        ),

      quaternion:
        normalizeQuaternion(
          transform &&
          transform.quaternion
        ),

      scale:
        normalizeArray3(
          transform &&
          transform.scale,
          [1, 1, 1]
        )
    });
  }

  /*
   * Compass parent orientation resolution.
   *
   * Permitted:
   * - explicitly finalized parent orientation supplied by the page context;
   * - explicitly declared parent orientation supplied by the controller frame;
   * - controller frame orbit/constellation orientation;
   * - identity fallback.
   *
   * Forbidden:
   * - frame.cluster.orientation;
   * - active room-cluster quaternion;
   * - orbit * cluster composition;
   * - any local Compass gesture delta.
   */
  function resolveFrameParentOrientation(
    frame
  ) {
    if (
      !frame ||
      typeof frame !==
        "object"
    ) {
      return Object.freeze({
        quaternion:
          [0, 0, 0, 1],

        source:
          PARENT_ORIENTATION_SOURCES
            .IDENTITY
      });
    }

    if (
      Array.isArray(
        frame
          .parentOrientationQuaternion
      ) ||
      ArrayBuffer.isView(
        frame
          .parentOrientationQuaternion
      )
    ) {
      return Object.freeze({
        quaternion:
          normalizeQuaternion(
            frame
              .parentOrientationQuaternion
          ),

        source:
          PARENT_ORIENTATION_SOURCES
            .FRAME_DECLARED
      });
    }

    if (
      frame.parentOrientation &&
      (
        Array.isArray(
          frame
            .parentOrientation
            .quaternion
        ) ||
        ArrayBuffer.isView(
          frame
            .parentOrientation
            .quaternion
        )
      )
    ) {
      return Object.freeze({
        quaternion:
          normalizeQuaternion(
            frame
              .parentOrientation
              .quaternion
          ),

        source:
          PARENT_ORIENTATION_SOURCES
            .FRAME_DECLARED
      });
    }

    if (
      frame.orbitOrientation &&
      (
        Array.isArray(
          frame
            .orbitOrientation
            .quaternion
        ) ||
        ArrayBuffer.isView(
          frame
            .orbitOrientation
            .quaternion
        )
      )
    ) {
      return Object.freeze({
        quaternion:
          normalizeQuaternion(
            frame
              .orbitOrientation
              .quaternion
          ),

        source:
          PARENT_ORIENTATION_SOURCES
            .FRAME_ORBIT
      });
    }

    return Object.freeze({
      quaternion:
        [0, 0, 0, 1],

      source:
        PARENT_ORIENTATION_SOURCES
          .IDENTITY
    });
  }

  function resolveExplicitParentOrientation(
    input
  ) {
    if (
      Array.isArray(input) ||
      ArrayBuffer.isView(input)
    ) {
      return Object.freeze({
        quaternion:
          normalizeQuaternion(
            input
          ),

        source:
          PARENT_ORIENTATION_SOURCES
            .EXPLICIT_CONTEXT
      });
    }

    if (
      input &&
      (
        Array.isArray(
          input.quaternion
        ) ||
        ArrayBuffer.isView(
          input.quaternion
        )
      )
    ) {
      return Object.freeze({
        quaternion:
          normalizeQuaternion(
            input.quaternion
          ),

        source:
          PARENT_ORIENTATION_SOURCES
            .EXPLICIT_CONTEXT
      });
    }

    return null;
  }

  function syncFrameState(
    instance,
    frame
  ) {
    if (
      instance.destroyed
    ) {
      return false;
    }

    instance.frameState =
      frame &&
      typeof frame ===
        "object"
        ? frame
        : null;

    const resolved =
      resolveFrameParentOrientation(
        instance.frameState
      );

    instance
      .targetParentQuaternion =
      resolved.quaternion;

    instance
      .parentOrientationSource =
      resolved.source;

    publishMountState(
      instance
    );

    return true;
  }

  function syncExplicitParentOrientation(
    instance,
    value
  ) {
    if (
      instance.destroyed
    ) {
      return false;
    }

    const resolved =
      resolveExplicitParentOrientation(
        value
      );

    if (!resolved) {
      return false;
    }

    instance
      .targetParentQuaternion =
      resolved.quaternion;

    instance
      .parentOrientationSource =
      resolved.source;

    publishMountState(
      instance
    );

    return true;
  }

  function syncPresentationState(
    instance,
    value
  ) {
    if (
      instance.destroyed
    ) {
      return false;
    }

    instance.presentationState =
      normalizePresentationState(
        value
      );

    const target =
      normalizeLocalTransform(
        presentationTransformForMode(
          instance.model,
          instance
            .presentationState
            .mode
        )
      );

    instance
      .targetLocalPosition =
      target.position;

    instance
      .targetLocalQuaternion =
      target.quaternion;

    instance
      .targetLocalScale =
      target.scale;

    if (
      instance
        .presentationState
        .reducedMotion
    ) {
      instance.reducedMotion =
        true;
    }

    if (
      instance.reducedMotion
    ) {
      instance.localPosition =
        target.position.slice();

      instance.localQuaternion =
        target.quaternion.slice();

      instance.localScale =
        target.scale.slice();
    }

    applyPresentationVisibility(
      instance
    );

    return true;
  }

  function setReducedMotion(
    instance,
    active
  ) {
    instance.reducedMotion =
      active === true;

    if (
      instance.reducedMotion
    ) {
      instance.parentQuaternion =
        instance
          .targetParentQuaternion
          .slice();

      instance.localPosition =
        instance
          .targetLocalPosition
          .slice();

      instance.localQuaternion =
        instance
          .targetLocalQuaternion
          .slice();

      instance.localScale =
        instance
          .targetLocalScale
          .slice();
    }

    publishMountState(
      instance
    );
  }

  function createInstance(
    context
  ) {
    const geometry =
      resolveGeometryAuthority();

    const model =
      geometry.buildModel({
        quality:
          context
            .qualityProfileId
      });

    if (
      typeof geometry
        .validateModel ===
        "function"
    ) {
      geometry.validateModel(
        model
      );
    }

    invariant(
      model.rootTransform &&
      model.rootTransform
        .parentOrientationMode ===
        "INHERIT",
      "GEOMETRY_PARENT_ORIENTATION_MODE_INVALID"
    );

    invariant(
      model
        .presentationTransforms &&
      model
        .presentationTransforms
        .embedded &&
      model
        .presentationTransforms
        .decisionApproach,
      "GEOMETRY_PRESENTATION_TRANSFORMS_REQUIRED"
    );

    const instanceId =
      `home-compass-instance-${++instanceCounter}`;

    const canvas =
      createCanvas(
        context.mount
      );

    let initialPresentation =
      normalizePresentationState(
        null
      );

    if (
      context
        .getCompassPresentationState
    ) {
      try {
        initialPresentation =
          normalizePresentationState(
            context
              .getCompassPresentationState()
          );
      } catch (_) {}
    }

    const initialLocal =
      normalizeLocalTransform(
        presentationTransformForMode(
          model,
          initialPresentation
            .mode
        )
      );

    let initialFrame =
      null;

    if (
      context.getFrameState
    ) {
      try {
        initialFrame =
          context
            .getFrameState();
      } catch (_) {}
    }

    let initialParent =
      resolveFrameParentOrientation(
        initialFrame
      );

    if (
      context
        .getParentOrientationState
    ) {
      try {
        const explicit =
          resolveExplicitParentOrientation(
            context
              .getParentOrientationState()
          );

        if (explicit) {
          initialParent =
            explicit;
        }
      } catch (_) {}
    }

    let reducedMotion =
      initialPresentation
        .reducedMotion;

    if (
      context.getReducedMotion
    ) {
      try {
        reducedMotion =
          context
            .getReducedMotion() ===
          true;
      } catch (_) {}
    }

    const instance = {
      id:
        instanceId,

      geometry,
      model,
      context,
      canvas,

      gl:
        null,

      program:
        null,

      attribs:
        null,

      uniforms:
        null,

      gpuMeshes:
        [],

      running:
        false,

      raf:
        0,

      lastTime:
        0,

      cssWidth:
        1,

      cssHeight:
        1,

      width:
        1,

      height:
        1,

      pixelRatio:
        1,

      frameState:
        initialFrame,

      presentationState:
        initialPresentation,

      reducedMotion,

      parentQuaternion:
        initialParent
          .quaternion
          .slice(),

      targetParentQuaternion:
        initialParent
          .quaternion
          .slice(),

      parentOrientationSource:
        initialParent
          .source,

      localPosition:
        initialLocal
          .position
          .slice(),

      targetLocalPosition:
        initialLocal
          .position
          .slice(),

      localQuaternion:
        initialLocal
          .quaternion
          .slice(),

      targetLocalQuaternion:
        initialLocal
          .quaternion
          .slice(),

      localScale:
        initialLocal
          .scale
          .slice(),

      targetLocalScale:
        initialLocal
          .scale
          .slice(),

      hoverActive:
        false,

      view:
        identity4(),

      projection:
        identity4(),

      fallbackSurface:
        null,

      destroyed:
        false,

      unsubscribers:
        [],

      onSemanticControlClick:
        null,

      renderFailureEmitted:
        false,

      firstEnhancedFrameCompleted:
        false,

      rendererStatus:
        RENDERER_STATUS
          .INITIALIZING
    };

    setMountRendererStatus(
      instance,
      RENDERER_STATUS
        .INITIALIZING
    );

    applyPresentationVisibility(
      instance
    );

    return instance;
  }

  function safeEmitInstanceFailure(
    instance,
    reason,
    details = null
  ) {
    if (
      instance
        .renderFailureEmitted
    ) {
      return;
    }

    instance
      .renderFailureEmitted =
      true;

    setMountRendererStatus(
      instance,
      RENDERER_STATUS.FAILED
    );

    applyPresentationVisibility(
      instance
    );

    publishReceipt({
      status:
        "failed",

      lastFailure:
        String(
          reason ||
          "UNKNOWN_RENDER_FAILURE"
        ),

      lastInstanceId:
        instance.id,

      lastMountPageNodeId:
        instance.context
          .pageNodeId,

      lastParentRoute:
        instance.context
          .parentRoute,

      lastRendererStatus:
        RENDERER_STATUS.FAILED,

      lastPresentationMode:
        instance
          .presentationState
          .mode,

      lastParentOrientationSource:
        instance
          .parentOrientationSource,

      lastReducedMotion:
        instance
          .reducedMotion,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted
    });

    emitFailure(
      reason,
      details
    );
  }

  function compileProgramSurfaces(
    instance
  ) {
    const gl =
      instance.gl;

    instance.program =
      createProgram(gl);

    instance.attribs =
      Object.freeze({
        position:
          gl.getAttribLocation(
            instance.program,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            instance.program,
            "aNormal"
          )
      });

    instance.uniforms =
      Object.freeze({
        model:
          gl.getUniformLocation(
            instance.program,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            instance.program,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            instance.program,
            "uProjection"
          ),

        viewNormalMatrix:
          gl.getUniformLocation(
            instance.program,
            "uViewNormalMatrix"
          ),

        haloPass:
          gl.getUniformLocation(
            instance.program,
            "uHaloPass"
          ),

        haloExpansion:
          gl.getUniformLocation(
            instance.program,
            "uHaloExpansion"
          ),

        baseColor:
          gl.getUniformLocation(
            instance.program,
            "uBaseColor"
          ),

        ambientColor:
          gl.getUniformLocation(
            instance.program,
            "uAmbientColor"
          ),

        keyLightView:
          gl.getUniformLocation(
            instance.program,
            "uKeyLightView"
          ),

        fillLightView:
          gl.getUniformLocation(
            instance.program,
            "uFillLightView"
          ),

        rimLightView:
          gl.getUniformLocation(
            instance.program,
            "uRimLightView"
          ),

        alpha:
          gl.getUniformLocation(
            instance.program,
            "uAlpha"
          ),

        emissive:
          gl.getUniformLocation(
            instance.program,
            "uEmissive"
          ),

        specular:
          gl.getUniformLocation(
            instance.program,
            "uSpecular"
          ),

        rim:
          gl.getUniformLocation(
            instance.program,
            "uRim"
          ),

        haloStrength:
          gl.getUniformLocation(
            instance.program,
            "uHaloStrength"
          )
      });
  }

  function createGpuMeshRecord(
    gl,
    mesh
  ) {
    const material =
      MATERIALS[
        mesh.materialKey
      ] ||
      DEFAULT_MATERIAL;

    return Object.freeze({
      componentId:
        mesh.componentId,

      materialKey:
        mesh.materialKey,

      material,

      indexCount:
        mesh.indices.length,

      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.positions
        ),

      normal:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.normals
        ),

      index:
        createBuffer(
          gl,
          gl.ELEMENT_ARRAY_BUFFER,
          mesh.indices
        ),

      indexType:
        mesh.indices instanceof
          Uint32Array
          ? gl.UNSIGNED_INT
          : gl.UNSIGNED_SHORT
    });
  }

  function buildGpuMeshes(
    instance
  ) {
    const gl =
      instance.gl;

    const isWebGL2 =
      typeof WebGL2RenderingContext !==
        "undefined" &&
      gl instanceof
        WebGL2RenderingContext;

    const needsUint32 =
      instance.model
        .meshes
        .some(
          mesh =>
            mesh.indices instanceof
            Uint32Array
        );

    if (
      needsUint32 &&
      !isWebGL2
    ) {
      const extension =
        gl.getExtension(
          "OES_element_index_uint"
        );

      invariant(
        extension,
        "UINT32_ELEMENT_INDEX_EXTENSION_REQUIRED"
      );
    }

    return instance.model
      .meshes
      .map(
        mesh =>
          createGpuMeshRecord(
            gl,
            mesh
          )
      );
  }

  function initializeGL(
    instance
  ) {
    const gl =
      getGL(
        instance.canvas
      );

    invariant(
      gl,
      "WEBGL_CONTEXT_UNAVAILABLE"
    );

    instance.gl =
      gl;

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthFunc(
      gl.LEQUAL
    );

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.disable(
      gl.CULL_FACE
    );

    compileProgramSurfaces(
      instance
    );

    instance.gpuMeshes =
      buildGpuMeshes(
        instance
      );

    instance.canvas
      .addEventListener(
        "webglcontextlost",
        event => {
          event.preventDefault();

          instance.running =
            false;

          safeEmitInstanceFailure(
            instance,
            "WEBGL_CONTEXT_LOST"
          );
        }
      );

    instance.canvas
      .addEventListener(
        "webglcontextrestored",
        () => {
          safeEmitInstanceFailure(
            instance,
            "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED"
          );
        }
      );
  }

  function bindSemanticControl(
    instance
  ) {
    instance
      .onSemanticControlClick =
      event => {
        event.preventDefault();
        event.stopPropagation();

        if (
          instance.destroyed ||
          !instance
            .presentationState
            .interactionEnabled
        ) {
          return;
        }

        try {
          instance.context
            .requestCompassDecision({
              source:
                "upstream-compass-control",

              pageNodeId:
                instance.context
                  .pageNodeId,

              parentNodeId:
                instance.context
                  .parentNodeId,

              parentRoute:
                instance.context
                  .parentRoute,

              destinationType:
                "home-compass",

              destinationId:
                "home-compass"
            });
        } catch (error) {
          instance.context
            .mount
            .dataset
            .upstreamCompassSemanticRequestFailure =
            error &&
            (
              error.code ||
              error.message
            )
              ? String(
                  error.code ||
                  error.message
                )
              : "UNKNOWN_SEMANTIC_REQUEST_FAILURE";
        }
      };

    instance.context
      .semanticControl
      .addEventListener(
        "click",
        instance
          .onSemanticControlClick
      );
  }

  function subscribeContextSignals(
    instance
  ) {
    const context =
      instance.context;

    if (
      context.subscribeFrameState
    ) {
      const unsubscribe =
        context
          .subscribeFrameState(
            frame => {
              syncFrameState(
                instance,
                frame
              );
            }
          );

      if (
        typeof unsubscribe ===
        "function"
      ) {
        instance
          .unsubscribers
          .push(
            unsubscribe
          );
      }
    }

    if (
      context
        .subscribeParentOrientationState
    ) {
      const unsubscribe =
        context
          .subscribeParentOrientationState(
            value => {
              syncExplicitParentOrientation(
                instance,
                value
              );
            }
          );

      if (
        typeof unsubscribe ===
        "function"
      ) {
        instance
          .unsubscribers
          .push(
            unsubscribe
          );
      }
    }

    if (
      context
        .subscribeCompassPresentationState
    ) {
      const unsubscribe =
        context
          .subscribeCompassPresentationState(
            value => {
              syncPresentationState(
                instance,
                value
              );
            }
          );

      if (
        typeof unsubscribe ===
        "function"
      ) {
        instance
          .unsubscribers
          .push(
            unsubscribe
          );
      }
    }

    if (
      context
        .subscribeReducedMotion
    ) {
      const unsubscribe =
        context
          .subscribeReducedMotion(
            value => {
              setReducedMotion(
                instance,
                value === true
              );

              applyPresentationVisibility(
                instance
              );
            }
          );

      if (
        typeof unsubscribe ===
        "function"
      ) {
        instance
          .unsubscribers
          .push(
            unsubscribe
          );
      }
    }

    bindSemanticControl(
      instance
    );
  }

  function unbindSubscriptions(
    instance
  ) {
    while (
      instance
        .unsubscribers
        .length >
      0
    ) {
      const unsubscribe =
        instance
          .unsubscribers
          .pop();

      try {
        unsubscribe();
      } catch (_) {}
    }

    if (
      instance
        .onSemanticControlClick &&
      instance.context &&
      instance.context
        .semanticControl
    ) {
      instance.context
        .semanticControl
        .removeEventListener(
          "click",
          instance
            .onSemanticControlClick
        );

      instance
        .onSemanticControlClick =
        null;
    }
  }

  function destroyGpuResources(
    instance
  ) {
    const gl =
      instance.gl;

    if (!gl) {
      return;
    }

    for (
      const gpuMesh
      of instance.gpuMeshes
    ) {
      if (
        gpuMesh.position
      ) {
        gl.deleteBuffer(
          gpuMesh.position
        );
      }

      if (
        gpuMesh.normal
      ) {
        gl.deleteBuffer(
          gpuMesh.normal
        );
      }

      if (
        gpuMesh.index
      ) {
        gl.deleteBuffer(
          gpuMesh.index
        );
      }
    }

    instance.gpuMeshes =
      [];

    if (
      instance.program
    ) {
      gl.deleteProgram(
        instance.program
      );

      instance.program =
        null;
    }
  }

  function destroyInstance(
    instance
  ) {
    if (
      !instance ||
      instance.destroyed
    ) {
      return;
    }

    instance.destroyed =
      true;

    instance.running =
      false;

    if (
      instance.raf
    ) {
      cancelAnimationFrame(
        instance.raf
      );

      instance.raf =
        0;
    }

    unbindSubscriptions(
      instance
    );

    destroyGpuResources(
      instance
    );

    if (
      instance.canvas &&
      instance.canvas
        .parentNode
    ) {
      instance.canvas
        .parentNode
        .removeChild(
          instance.canvas
        );
    }

    setMountRendererStatus(
      instance,
      RENDERER_STATUS.DISPOSED
    );

    setCanvasVisible(
      instance,
      false
    );

    setFallbackVisible(
      instance,
      true
    );

    INSTANCES.delete(
      instance.id
    );

    publishReceipt({
      status:
        INSTANCES.size > 0
          ? "available"
          : "disposed",

      mountedInstanceCount:
        INSTANCES.size,

      lastInstanceId:
        instance.id,

      lastRendererStatus:
        RENDERER_STATUS.DISPOSED,

      lastPresentationMode:
        instance
          .presentationState
          .mode,

      lastParentOrientationSource:
        instance
          .parentOrientationSource,

      lastReducedMotion:
        instance
          .reducedMotion,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted
    });
  }

  function resize(
    instance
  ) {
    const rect =
      instance.canvas
        .getBoundingClientRect();

    const lowPower =
      navigator
        .hardwareConcurrency &&
      navigator
        .hardwareConcurrency <=
        QUALITY
          .lowPowerHardwareConcurrencyThreshold;

    const cap =
      lowPower
        ? QUALITY
            .lowPowerDevicePixelRatioCap
        : QUALITY
            .normalDevicePixelRatioCap;

    const pixelRatio =
      Math.min(
        globalThis
          .devicePixelRatio ||
        1,
        cap
      );

    const width =
      Math.max(
        1,
        Math.floor(
          rect.width *
          pixelRatio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height *
          pixelRatio
        )
      );

    if (
      instance.canvas.width !==
        width ||
      instance.canvas.height !==
        height
    ) {
      instance.canvas.width =
        width;

      instance.canvas.height =
        height;
    }

    instance.cssWidth =
      Math.max(
        QUALITY
          .minimumCssSceneSize,
        rect.width
      );

    instance.cssHeight =
      Math.max(
        QUALITY
          .minimumCssSceneSize,
        rect.height
      );

    instance.width =
      width;

    instance.height =
      height;

    instance.pixelRatio =
      pixelRatio;

    instance.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function updateControllerSnapshots(
    instance
  ) {
    if (
      instance.context
        .getReducedMotion
    ) {
      try {
        setReducedMotion(
          instance,
          instance.context
            .getReducedMotion() ===
            true
        );
      } catch (_) {}
    }

    if (
      instance.context
        .getCompassPresentationState
    ) {
      try {
        syncPresentationState(
          instance,
          instance.context
            .getCompassPresentationState()
        );
      } catch (_) {}
    }

    if (
      instance.context
        .getParentOrientationState
    ) {
      try {
        const resolved =
          resolveExplicitParentOrientation(
            instance.context
              .getParentOrientationState()
          );

        if (resolved) {
          instance
            .targetParentQuaternion =
            resolved.quaternion;

          instance
            .parentOrientationSource =
            resolved.source;
        }
      } catch (_) {}
    } else if (
      instance.context
        .getFrameState
    ) {
      try {
        syncFrameState(
          instance,
          instance.context
            .getFrameState()
        );
      } catch (_) {}
    }
  }

  function updateTransforms(
    instance,
    deltaSeconds
  ) {
    if (
      instance.reducedMotion
    ) {
      instance.parentQuaternion =
        instance
          .targetParentQuaternion
          .slice();

      instance.localPosition =
        instance
          .targetLocalPosition
          .slice();

      instance.localQuaternion =
        instance
          .targetLocalQuaternion
          .slice();

      instance.localScale =
        instance
          .targetLocalScale
          .slice();

      return;
    }

    const localAmount =
      1 -
      Math.exp(
        -QUALITY
          .interpolationSpeed *
        deltaSeconds
      );

    const parentAmount =
      1 -
      Math.exp(
        -QUALITY
          .parentInterpolationSpeed *
        deltaSeconds
      );

    instance.parentQuaternion =
      quaternionSlerp(
        instance.parentQuaternion,
        instance
          .targetParentQuaternion,
        parentAmount
      );

    instance.localPosition =
      interpolateArray3(
        instance.localPosition,
        instance
          .targetLocalPosition,
        localAmount
      );

    instance.localQuaternion =
      quaternionSlerp(
        instance.localQuaternion,
        instance
          .targetLocalQuaternion,
        localAmount
      );

    instance.localScale =
      interpolateArray3(
        instance.localScale,
        instance
          .targetLocalScale,
        localAmount
      );
  }

  function currentModelMatrix(
    instance
  ) {
    const hoverScale =
      instance.hoverActive &&
      !instance.reducedMotion
        ? QUALITY
            .hoverScale
        : 1;

    const constellationRotation =
      quaternionToMatrix4(
        instance
          .parentQuaternion
      );

    const localTranslation =
      translate4(
        instance
          .localPosition[0],

        instance
          .localPosition[1],

        instance
          .localPosition[2]
      );

    const localRotation =
      quaternionToMatrix4(
        instance
          .localQuaternion
      );

    const localScale =
      scale4(
        instance
          .localScale[0] *
          hoverScale,

        instance
          .localScale[1] *
          hoverScale,

        instance
          .localScale[2] *
          hoverScale
      );

    /*
     * Required chain:
     *
     * constellation orientation
     *   *
     * Compass local position
     *   *
     * Compass local presentation quaternion
     *   *
     * Compass local scale
     *
     * No cluster quaternion participates.
     */
    return multiply4(
      constellationRotation,
      multiply4(
        localTranslation,
        multiply4(
          localRotation,
          localScale
        )
      )
    );
  }

  function applyMaterial(
    instance,
    material,
    haloPass
  ) {
    const gl =
      instance.gl;

    gl.uniform3f(
      instance.uniforms
        .baseColor,

      material
        .baseColor[0],

      material
        .baseColor[1],

      material
        .baseColor[2]
    );

    gl.uniform3f(
      instance.uniforms
        .ambientColor,
      0.10,
      0.12,
      0.16
    );

    gl.uniform3f(
      instance.uniforms
        .keyLightView,
      -0.38,
      -0.86,
      -0.60
    );

    gl.uniform3f(
      instance.uniforms
        .fillLightView,
      0.70,
      -0.22,
      -0.46
    );

    gl.uniform3f(
      instance.uniforms
        .rimLightView,
      0.10,
      0.45,
      1.0
    );

    gl.uniform1f(
      instance.uniforms
        .alpha,
      material.alpha
    );

    gl.uniform1f(
      instance.uniforms
        .emissive,
      material.emissive
    );

    gl.uniform1f(
      instance.uniforms
        .specular,
      material.specular
    );

    gl.uniform1f(
      instance.uniforms
        .rim,
      material.rim
    );

    const haloStrength =
      haloPass &&
      instance.cssWidth >
        QUALITY
          .bloomDisableWidthPx
        ? material.halo
        : 0;

    gl.uniform1f(
      instance.uniforms
        .haloStrength,
      haloStrength
    );
  }

  function drawGpuMesh(
    instance,
    gpuMesh,
    modelMatrix,
    haloPass
  ) {
    const gl =
      instance.gl;

    bindAttrib(
      gl,
      gpuMesh.position,
      instance.attribs
        .position,
      3
    );

    bindAttrib(
      gl,
      gpuMesh.normal,
      instance.attribs
        .normal,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      gpuMesh.index
    );

    const modelView =
      multiply4(
        instance.view,
        modelMatrix
      );

    const normalMatrix =
      inverseTransposeNormalMatrix3(
        modelView
      );

    gl.uniformMatrix4fv(
      instance.uniforms
        .model,
      false,
      new Float32Array(
        modelMatrix
      )
    );

    gl.uniformMatrix4fv(
      instance.uniforms
        .view,
      false,
      new Float32Array(
        instance.view
      )
    );

    gl.uniformMatrix4fv(
      instance.uniforms
        .projection,
      false,
      new Float32Array(
        instance.projection
      )
    );

    gl.uniformMatrix3fv(
      instance.uniforms
        .viewNormalMatrix,
      false,
      new Float32Array(
        normalMatrix
      )
    );

    gl.uniform1f(
      instance.uniforms
        .haloPass,
      haloPass
        ? 1
        : 0
    );

    gl.uniform1f(
      instance.uniforms
        .haloExpansion,
      QUALITY.haloExpansion
    );

    applyMaterial(
      instance,
      gpuMesh.material,
      haloPass
    );

    gl.drawElements(
      gl.TRIANGLES,
      gpuMesh.indexCount,
      gpuMesh.indexType,
      0
    );
  }

  function commitFirstEnhancedFrame(
    instance
  ) {
    if (
      instance
        .firstEnhancedFrameCompleted
    ) {
      return;
    }

    instance
      .firstEnhancedFrameCompleted =
      true;

    setMountRendererStatus(
      instance,
      RENDERER_STATUS.AVAILABLE
    );

    applyPresentationVisibility(
      instance
    );
  }

  function renderFrame(
    instance,
    timeMs
  ) {
    if (
      !instance.running ||
      instance.destroyed
    ) {
      return;
    }

    const seconds =
      timeMs *
      0.001;

    const deltaSeconds =
      instance.lastTime
        ? Math.min(
            QUALITY
              .maximumDeltaSeconds,
            Math.max(
              0,
              seconds -
              instance.lastTime
            )
          )
        : 0.016;

    instance.lastTime =
      seconds;

    updateControllerSnapshots(
      instance
    );

    applyPresentationVisibility(
      instance
    );

    resize(
      instance
    );

    updateTransforms(
      instance,
      deltaSeconds
    );

    const aspect =
      instance.width /
      Math.max(
        1,
        instance.height
      );

    instance.view =
      lookAt4(
        [
          0,
          0,
          QUALITY.cameraDistance
        ],
        [0, 0, 0],
        [0, 1, 0]
      );

    instance.projection =
      perspective4(
        aspect <
          QUALITY
            .mobileAspectThreshold
          ? QUALITY
              .mobileFieldOfViewRadians
          : QUALITY
              .defaultFieldOfViewRadians,

        aspect,
        0.1,
        40
      );

    const gl =
      instance.gl;

    gl.clearColor(
      0,
      0,
      0,
      0
    );

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    if (
      instance
        .presentationState
        .mode ===
        PRESENTATION_MODES
          .FAILURE_FALLBACK
    ) {
      instance.raf =
        requestAnimationFrame(
          nextTime =>
            renderFrame(
              instance,
              nextTime
            )
        );

      return;
    }

    gl.useProgram(
      instance.program
    );

    const modelMatrix =
      currentModelMatrix(
        instance
      );

    if (
      instance.cssWidth >
      QUALITY
        .bloomDisableWidthPx
    ) {
      gl.depthMask(
        false
      );

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE
      );

      for (
        const gpuMesh
        of instance.gpuMeshes
      ) {
        drawGpuMesh(
          instance,
          gpuMesh,
          modelMatrix,
          true
        );
      }

      gl.depthMask(
        true
      );

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );
    }

    for (
      const gpuMesh
      of instance.gpuMeshes
    ) {
      drawGpuMesh(
        instance,
        gpuMesh,
        modelMatrix,
        false
      );
    }

    const error =
      gl.getError();

    if (
      error !==
      gl.NO_ERROR
    ) {
      safeEmitInstanceFailure(
        instance,
        "WEBGL_RENDER_FAILURE",
        {
          error
        }
      );

      instance.running =
        false;

      return;
    }

    commitFirstEnhancedFrame(
      instance
    );

    publishReceipt({
      status:
        "available",

      lastFailure:
        "",

      lastInstanceId:
        instance.id,

      lastMountPageNodeId:
        instance.context
          .pageNodeId,

      lastParentRoute:
        instance.context
          .parentRoute,

      lastRendererStatus:
        instance
          .rendererStatus,

      lastPresentationMode:
        instance
          .presentationState
          .mode,

      lastParentOrientationSource:
        instance
          .parentOrientationSource,

      lastReducedMotion:
        instance
          .reducedMotion,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted
    });

    instance.raf =
      requestAnimationFrame(
        nextTime =>
          renderFrame(
            instance,
            nextTime
          )
      );
  }

  function start(
    instanceId
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    if (
      instance.running
    ) {
      return true;
    }

    instance.running =
      true;

    instance.lastTime =
      0;

    instance.raf =
      requestAnimationFrame(
        timeMs =>
          renderFrame(
            instance,
            timeMs
          )
      );

    return true;
  }

  function stop(
    instanceId
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    instance.running =
      false;

    if (
      instance.raf
    ) {
      cancelAnimationFrame(
        instance.raf
      );

      instance.raf =
        0;
    }

    return true;
  }

  function syncReducedMotion(
    instanceId,
    active
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    setReducedMotion(
      instance,
      active === true
    );

    applyPresentationVisibility(
      instance
    );

    return true;
  }

  function syncPresentation(
    instanceId,
    presentationState
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    return syncPresentationState(
      instance,
      presentationState
    );
  }

  function syncFrame(
    instanceId,
    frameState
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    return syncFrameState(
      instance,
      frameState
    );
  }

  function syncParentOrientation(
    instanceId,
    orientationState
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    return syncExplicitParentOrientation(
      instance,
      orientationState
    );
  }

  function setHover(
    instanceId,
    active
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    instance.hoverActive =
      active === true;

    return true;
  }

  function mount(
    pageContext
  ) {
    const context =
      normalizeContext(
        pageContext
      );

    const instance =
      createInstance(
        context
      );

    try {
      replaceFallbackContent(
        instance
      );

      setMountRendererStatus(
        instance,
        RENDERER_STATUS
          .INITIALIZING
      );

      applyPresentationVisibility(
        instance
      );

      initializeGL(
        instance
      );

      subscribeContextSignals(
        instance
      );

      INSTANCES.set(
        instance.id,
        instance
      );

      start(
        instance.id
      );

      publishReceipt({
        status:
          "initializing",

        lastFailure:
          "",

        lastInstanceId:
          instance.id,

        lastMountPageNodeId:
          context.pageNodeId,

        lastParentRoute:
          context.parentRoute,

        lastRendererStatus:
          RENDERER_STATUS
            .INITIALIZING,

        lastPresentationMode:
          instance
            .presentationState
            .mode,

        lastParentOrientationSource:
          instance
            .parentOrientationSource,

        lastReducedMotion:
          instance
            .reducedMotion,

        firstEnhancedFrameCompleted:
          false
      });

      return Object.freeze({
        instanceId:
          instance.id,

        destroy: () => {
          destroyInstance(
            instance
          );

          return true;
        },

        start: () =>
          start(
            instance.id
          ),

        stop: () =>
          stop(
            instance.id
          ),

        syncReducedMotion:
          active =>
            syncReducedMotion(
              instance.id,
              active
            ),

        syncPresentationState:
          presentationState =>
            syncPresentation(
              instance.id,
              presentationState
            ),

        syncFrameState:
          frameState =>
            syncFrame(
              instance.id,
              frameState
            ),

        syncParentOrientationState:
          orientationState =>
            syncParentOrientation(
              instance.id,
              orientationState
            ),

        setHover:
          active =>
            setHover(
              instance.id,
              active
            )
      });
    } catch (error) {
      unbindSubscriptions(
        instance
      );

      destroyGpuResources(
        instance
      );

      if (
        instance.canvas &&
        instance.canvas
          .parentNode
      ) {
        instance.canvas
          .parentNode
          .removeChild(
            instance.canvas
          );
      }

      safeEmitInstanceFailure(
        instance,
        error &&
        (
          error.code ||
          error.message
        )
          ? String(
              error.code ||
              error.message
            )
          : "MOUNT_INITIALIZATION_FAILURE",
        {
          pageNodeId:
            context.pageNodeId,

          parentRoute:
            context.parentRoute
        }
      );

      throw error;
    }
  }

  function getInstanceState(
    instanceId
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    return Object.freeze({
      instanceId:
        instance.id,

      pageNodeId:
        instance.context
          .pageNodeId,

      parentNodeId:
        instance.context
          .parentNodeId,

      parentRoute:
        instance.context
          .parentRoute,

      declaredHref:
        instance.context
          .declaredHref,

      routeParity:
        instance.context
          .routeParity,

      qualityProfileId:
        instance.model
          .qualityProfile
          .id,

      presentationState:
        instance
          .presentationState,

      reducedMotion:
        instance
          .reducedMotion,

      parentOrientationSource:
        instance
          .parentOrientationSource,

      parentQuaternion:
        Object.freeze(
          instance
            .parentQuaternion
            .slice()
        ),

      targetParentQuaternion:
        Object.freeze(
          instance
            .targetParentQuaternion
            .slice()
        ),

      localPosition:
        Object.freeze(
          instance
            .localPosition
            .slice()
        ),

      localQuaternion:
        Object.freeze(
          instance
            .localQuaternion
            .slice()
        ),

      localScale:
        Object.freeze(
          instance
            .localScale
            .slice()
        ),

      running:
        instance.running,

      destroyed:
        instance.destroyed,

      rendererStatus:
        instance
          .rendererStatus,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted,

      renderFailureEmitted:
        instance
          .renderFailureEmitted,

      parentOrientationInherited:
        true,

      constellationOrientationOnly:
        true,

      clusterOrientationApplied:
        false,

      independentGestureAuthority:
        false,

      nativeNavigationFallthrough:
        false
    });
  }

  function getReceipt() {
    return Object.freeze({
      ...RECEIPT
    });
  }

  publishReceipt({
    status:
      "available",

    lastRendererStatus:
      "",

    firstEnhancedFrameCompleted:
      false
  });

  return Object.freeze({
    moduleId:
      MODULE.id,

    moduleVersion:
      MODULE.version,

    geometryAuthority:
      GEOMETRY_AUTHORITY_ID,

    presentationModes:
      PRESENTATION_MODES,

    parentOrientationSources:
      PARENT_ORIENTATION_SOURCES,

    mount,

    start,

    stop,

    syncReducedMotion,

    syncPresentationState:
      syncPresentation,

    syncFrameState:
      syncFrame,

    syncParentOrientationState:
      syncParentOrientation,

    setHover,

    getInstanceState,

    receipt:
      getReceipt
  });
})();

if (
  typeof globalThis !==
  "undefined"
) {
  globalThis
    .DGB_UPSTREAM_COMPASS_RENDERER =
    DGB_UPSTREAM_COMPASS_RENDERER;
}

if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    DGB_UPSTREAM_COMPASS_RENDERER;
}
