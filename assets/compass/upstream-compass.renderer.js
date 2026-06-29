/* /assets/compass/upstream-compass.renderer.js
   Shared fixed-center Home Compass renderer authority.

   Module:
   DGB_UPSTREAM_COMPASS_RENDERER
   3.0.1-fixed-center-runtime-corrections

   Dependency position:
   1. /products/archcoin/index.controller.js
   2. /assets/compass/upstream-compass.geometry.js
   3. /assets/compass/upstream-compass.renderer.js
   4. /products/archcoin/index.crystals.js
   5. /products/archcoin/index.html
   6. /assets/compass/upstream-compass.css
   7. /products/archcoin/index.css

   Governing boundaries:
   - The controller owns upstream-request meaning, navigation, route law,
     semantic activation meaning, and SYSTEM_HELD state.
   - Geometry owns the physical Compass form, CPU-side mesh buffers,
     material identities, fixed-center local posture, model bounds,
     quality profiles, and static fallback shape data.
   - This renderer owns WebGL resources, lighting, camera, local visual
     interpolation, fallback-first promotion, visual feedback, reduced-motion
     response, instance lifecycle, and renderer receipts.
   - Crystals owns ARCHCOIN constellation and room-cluster scene execution.
   - HTML owns the canonical semantic Compass control.
   - CSS presents already-closed runtime state.

   Fixed-center transform law:
   FIXED_CENTER_PLACEMENT
   * LOCAL_PRESENTATION_TRANSFORM
   * RENDERER_OWNED_VISUAL_FEEDBACK

   Prohibited:
   - constellation orientation;
   - cluster orientation;
   - navigation orientation;
   - parent quaternion inheritance;
   - controller-frame orientation reconstruction;
   - navigation settlement participation;
   - Compass decision states;
   - route or destination construction;
   - renderer-owned click activation;
   - renderer-owned navigation;
   - renderer-owned semantic selection;
   - renderer-authored semantic disabled state.

   Semantic-control law:
   - The renderer may observe hover, focus, and press for visual feedback.
   - The renderer does not bind click activation.
   - The renderer does not prevent semantic click propagation.
   - The renderer does not invoke controller navigation APIs.
   - The renderer does not set aria-disabled or native disabled state.

   Promotion and opacity law:
   - Static fallback is visible before enhanced rendering is proven.
   - WebGL canvas is promoted only after one error-free enhanced frame.
   - Canvas CSS opacity is binary promotion authority only.
   - Enhanced visual opacity is shader-owned through uVisualOpacity.
   - Fallback visual opacity is CSS-owned through currentOpacity.
   - Renderer failure returns presentation to the static fallback.

   Instance law:
   - At most one active renderer instance may own a Compass mount.
   - Canvas reuse is permitted only within an unowned mount.
   - Disposal releases the mount ownership record.
*/

const DGB_UPSTREAM_COMPASS_RENDERER = (() => {
  "use strict";

  const MODULE = Object.freeze({
    id:
      "DGB_UPSTREAM_COMPASS_RENDERER",

    version:
      "3.0.1-fixed-center-runtime-corrections",

    file:
      "/assets/compass/upstream-compass.renderer.js"
  });

  const GEOMETRY_AUTHORITY = Object.freeze({
    moduleId:
      "DGB_UPSTREAM_COMPASS_GEOMETRY",

    requiredModuleVersion:
      "3.0.0-fixed-center-independent-sibling",

    requiredObjectClass:
      "HOME_COMPASS_FIXED_CENTER_INSTRUMENT",

    requiredPhysicalProjection:
      "FIXED_CENTER_INDEPENDENT_SIBLING"
  });

  const RECEIPT_SYMBOL =
    "DGB_UPSTREAM_COMPASS_RENDERER_RECEIPT";

  const FAILURE_EVENT =
    "DGB_UPSTREAM_COMPASS_RENDERER_FAILURE";

  const RENDERER_STATUS = Object.freeze({
    INITIALIZING:
      "initializing",

    AVAILABLE:
      "available",

    STOPPED:
      "stopped",

    FALLBACK:
      "fallback",

    FAILED:
      "failed",

    DISPOSED:
      "disposed"
  });

  const QUALITY = Object.freeze({
    normalDevicePixelRatioCap:
      2,

    lowPowerDevicePixelRatioCap:
      1.5,

    lowPowerHardwareConcurrencyThreshold:
      4,

    bloomDisableWidthPx:
      420,

    mobileAspectThreshold:
      0.82,

    defaultFieldOfViewRadians:
      Math.PI / 4.9,

    mobileFieldOfViewRadians:
      Math.PI / 4.45,

    cameraDistance:
      5.4,

    interpolationSpeed:
      9.5,

    hoverScale:
      1.025,

    focusScale:
      1.035,

    pressedScale:
      0.985,

    heldScale:
      0.995,

    disabledScale:
      0.99,

    hiddenScale:
      0.975,

    normalOpacity:
      1,

    heldOpacity:
      0.72,

    disabledOpacity:
      0.58,

    hiddenOpacity:
      0,

    haloExpansion:
      0.045,

    minimumCssSceneSize:
      1,

    maximumDeltaSeconds:
      0.05,

    quaternionEpsilon:
      1e-7,

    vectorEpsilon:
      1e-6
  });

  const MATERIALS = Object.freeze({
    OUTER_HOUSING: Object.freeze({
      baseColor:
        Object.freeze([
          0.76,
          0.79,
          0.84
        ]),

      alpha:
        0.98,

      emissive:
        0.025,

      specular:
        1.18,

      rim:
        0.72,

      halo:
        0.58
    }),

    OUTER_BEZEL: Object.freeze({
      baseColor:
        Object.freeze([
          0.55,
          0.60,
          0.68
        ]),

      alpha:
        0.97,

      emissive:
        0.035,

      specular:
        1.08,

      rim:
        0.68,

      halo:
        0.52
    }),

    INNER_BEZEL: Object.freeze({
      baseColor:
        Object.freeze([
          0.40,
          0.46,
          0.54
        ]),

      alpha:
        0.96,

      emissive:
        0.025,

      specular:
        0.98,

      rim:
        0.60,

      halo:
        0.42
    }),

    DIAL_BED: Object.freeze({
      baseColor:
        Object.freeze([
          0.12,
          0.15,
          0.21
        ]),

      alpha:
        0.98,

      emissive:
        0.015,

      specular:
        0.56,

      rim:
        0.34,

      halo:
        0.16
    }),

    PRINCIPAL_DIRECTION: Object.freeze({
      baseColor:
        Object.freeze([
          0.58,
          0.63,
          0.70
        ]),

      alpha:
        0.97,

      emissive:
        0.03,

      specular:
        1.02,

      rim:
        0.62,

      halo:
        0.42
    }),

    PRINCIPAL_DIRECTION_FACET: Object.freeze({
      baseColor:
        Object.freeze([
          0.74,
          0.77,
          0.80
        ]),

      alpha:
        0.98,

      emissive:
        0.045,

      specular:
        1.16,

      rim:
        0.70,

      halo:
        0.50
    }),

    NORTH_NEEDLE: Object.freeze({
      baseColor:
        Object.freeze([
          0.86,
          0.82,
          0.68
        ]),

      alpha:
        0.99,

      emissive:
        0.075,

      specular:
        1.24,

      rim:
        0.82,

      halo:
        0.76
    }),

    NORTH_NEEDLE_FACET: Object.freeze({
      baseColor:
        Object.freeze([
          0.98,
          0.92,
          0.73
        ]),

      alpha:
        1,

      emissive:
        0.12,

      specular:
        1.34,

      rim:
        0.90,

      halo:
        0.90
    }),

    HUB_BASE: Object.freeze({
      baseColor:
        Object.freeze([
          0.28,
          0.33,
          0.40
        ]),

      alpha:
        0.99,

      emissive:
        0.025,

      specular:
        0.96,

      rim:
        0.58,

      halo:
        0.34
    }),

    HUB_CROWN: Object.freeze({
      baseColor:
        Object.freeze([
          0.48,
          0.53,
          0.60
        ]),

      alpha:
        0.99,

      emissive:
        0.04,

      specular:
        1.14,

      rim:
        0.70,

      halo:
        0.52
    }),

    HUB_JEWEL: Object.freeze({
      baseColor:
        Object.freeze([
          0.88,
          0.84,
          0.70
        ]),

      alpha:
        1,

      emissive:
        0.11,

      specular:
        1.30,

      rim:
        0.88,

      halo:
        0.84
    }),

    INTERCARDINAL_TICK: Object.freeze({
      baseColor:
        Object.freeze([
          0.63,
          0.67,
          0.73
        ]),

      alpha:
        0.96,

      emissive:
        0.025,

      specular:
        0.90,

      rim:
        0.56,

      halo:
        0.34
    })
  });

  const DEFAULT_MATERIAL =
    MATERIALS.PRINCIPAL_DIRECTION;

  const RECEIPT = {
    moduleId:
      MODULE.id,

    moduleVersion:
      MODULE.version,

    status:
      "available",

    geometryAuthority:
      GEOMETRY_AUTHORITY.moduleId,

    geometryRequiredVersion:
      GEOMETRY_AUTHORITY.requiredModuleVersion,

    mountedInstanceCount:
      0,

    lastInstanceId:
      "",

    lastFailure:
      "",

    lastRendererStatus:
      "",

    lastQualityProfileId:
      "",

    lastReducedMotion:
      false,

    lastVisible:
      true,

    lastInteractionEnabled:
      true,

    lastHeld:
      false,

    firstEnhancedFrameCompleted:
      false,

    fixedCenter:
      true,

    parentOrientationInherited:
      false,

    navigationOrientationApplied:
      false,

    constellationOrientationApplied:
      false,

    clusterOrientationApplied:
      false,

    participatesInNavigationSettlement:
      false,

    publishesQuaternion:
      false,

    rendererOwnsActivation:
      false,

    rendererOwnsNavigation:
      false,

    rendererOwnsSelection:
      false,

    rendererOwnsSemanticDisabledState:
      false,

    fallbackPromotionOwnedByRenderer:
      true,

    semanticControlOwnedByHtml:
      true,

    oneInstancePerMount:
      true,

    enhancedOpacityAuthority:
      "SHADER",

    fallbackOpacityAuthority:
      "CSS",

    canvasPromotionOpacity:
      "BINARY",

    canvasPointerEvents:
      "none",

    visualPassClaimed:
      false
  };

  const INSTANCES =
    new Map();

  const INSTANCE_BY_MOUNT =
    new WeakMap();

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
        position +=
          normalize(aNormal) *
          uHaloExpansion;
      }

      vec4 worldPosition =
        uModel *
        vec4(position, 1.0);

      vec4 viewPosition =
        uView *
        worldPosition;

      vViewNormal =
        normalize(
          uViewNormalMatrix *
          aNormal
        );

      vViewPosition =
        viewPosition.xyz;

      vHaloPass =
        uHaloPass;

      gl_Position =
        uProjection *
        viewPosition;
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
    uniform float uVisualOpacity;
    uniform float uFeedbackBrightness;

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
        max(
          dot(
            normal,
            keyDirection
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

      float rear =
        max(
          dot(
            normal,
            rimDirection
          ),
          0.0
        );

      float fresnel =
        pow(
          1.0 -
          max(
            dot(
              normal,
              viewDirection
            ),
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
            dot(
              normal,
              halfDirection
            ),
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
          uHaloStrength *
          uFeedbackBrightness;

        float haloAlpha =
          clamp(
            (
              0.025 +
              fresnel * 0.18
            ) *
            uHaloStrength *
            uVisualOpacity,
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
        (
          uBaseColor *
          diffuse +

          uBaseColor *
          uEmissive +

          vec3(
            1.0,
            0.97,
            0.88
          ) *
          specular *
          uSpecular +

          uBaseColor *
          fresnel *
          uRim *
          0.72 +

          uAmbientColor *
          uBaseColor *
          0.22
        ) *
        uFeedbackBrightness;

      gl_FragColor =
        vec4(
          color,
          uAlpha *
          uVisualOpacity
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
        component /
        length
    );
  }

  function quaternionDot(
    a,
    b
  ) {
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

    if (
      cosine >
      0.9995
    ) {
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
        (
          1 -
          t
        ) *
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

  function interpolateNumber(
    current,
    target,
    amount
  ) {
    return (
      current +
      (
        target -
        current
      ) *
      clamp(
        amount,
        0,
        1
      )
    );
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(
    a,
    b
  ) {
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

    matrix[12] =
      x;

    matrix[13] =
      y;

    matrix[14] =
      z;

    return matrix;
  }

  function scale4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[0] =
      x;

    matrix[5] =
      y;

    matrix[10] =
      z;

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
        fieldOfView /
        2
      );

    const range =
      1 /
      (
        near -
        far
      );

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
      (
        far +
        near
      ) *
      range,
      -1,

      0,
      0,
      2 *
      far *
      near *
      range,
      0
    ];
  }

  function subtract3(
    a,
    b
  ) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function dot3(
    a,
    b
  ) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function cross3(
    a,
    b
  ) {
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
      1 /
      determinant;

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

        geometryAuthority:
          GEOMETRY_AUTHORITY.moduleId,

        geometryRequiredVersion:
          GEOMETRY_AUTHORITY.requiredModuleVersion,

        mountedInstanceCount:
          INSTANCES.size,

        fixedCenter:
          true,

        parentOrientationInherited:
          false,

        navigationOrientationApplied:
          false,

        constellationOrientationApplied:
          false,

        clusterOrientationApplied:
          false,

        participatesInNavigationSettlement:
          false,

        publishesQuaternion:
          false,

        rendererOwnsActivation:
          false,

        rendererOwnsNavigation:
          false,

        rendererOwnsSelection:
          false,

        rendererOwnsSemanticDisabledState:
          false,

        fallbackPromotionOwnedByRenderer:
          true,

        semanticControlOwnedByHtml:
          true,

        oneInstancePerMount:
          true,

        enhancedOpacityAuthority:
          "SHADER",

        fallbackOpacityAuthority:
          "CSS",

        canvasPromotionOpacity:
          "BINARY",

        canvasPointerEvents:
          "none",

        visualPassClaimed:
          false
      },
      extra
    );

    if (
      typeof globalThis !==
      "undefined"
    ) {
      globalThis[
        RECEIPT_SYMBOL
      ] =
        Object.freeze({
          ...RECEIPT
        });
    }
  }

  function emitFailure(
    reason,
    details = null
  ) {
    const normalizedReason =
      String(
        reason ||
        "UNKNOWN_RENDERER_FAILURE"
      );

    publishReceipt({
      status:
        "failed",

      lastFailure:
        normalizedReason,

      lastRendererStatus:
        RENDERER_STATUS.FAILED
    });

    if (
      typeof globalThis !==
        "undefined" &&
      typeof globalThis
        .dispatchEvent ===
        "function" &&
      typeof CustomEvent ===
        "function"
    ) {
      globalThis.dispatchEvent(
        new CustomEvent(
          FAILURE_EVENT,
          {
            detail:
              Object.freeze({
                reason:
                  normalizedReason,

                details
              })
          }
        )
      );
    }
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
        GEOMETRY_AUTHORITY.moduleId,
      "GEOMETRY_AUTHORITY_ID_MISMATCH"
    );

    invariant(
      geometry.moduleVersion ===
        GEOMETRY_AUTHORITY
          .requiredModuleVersion,
      "GEOMETRY_AUTHORITY_VERSION_MISMATCH",
      {
        expected:
          GEOMETRY_AUTHORITY
            .requiredModuleVersion,

        actual:
          geometry.moduleVersion
      }
    );

    invariant(
      typeof geometry.buildModel ===
        "function",
      "GEOMETRY_BUILD_MODEL_SURFACE_REQUIRED"
    );

    invariant(
      typeof geometry.validateModel ===
        "function",
      "GEOMETRY_VALIDATE_MODEL_SURFACE_REQUIRED"
    );

    invariant(
      typeof geometry
        .buildStaticSvgFallback ===
        "function",
      "GEOMETRY_STATIC_SVG_SURFACE_REQUIRED"
    );

    return geometry;
  }

  function validateGeometryModel(
    geometry,
    model
  ) {
    geometry.validateModel(
      model
    );

    invariant(
      model &&
      model.objectIdentity,
      "GEOMETRY_OBJECT_IDENTITY_REQUIRED"
    );

    invariant(
      model.objectIdentity.objectClass ===
        GEOMETRY_AUTHORITY
          .requiredObjectClass,
      "GEOMETRY_OBJECT_CLASS_INVALID"
    );

    invariant(
      model.objectIdentity.physicalProjection ===
        GEOMETRY_AUTHORITY
          .requiredPhysicalProjection,
      "GEOMETRY_PHYSICAL_PROJECTION_INVALID"
    );

    invariant(
      model.objectIdentity
        .inheritsNavigationOrientation ===
        false,
      "GEOMETRY_NAVIGATION_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      model.objectIdentity
        .inheritsConstellationOrientation ===
        false,
      "GEOMETRY_CONSTELLATION_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      model.objectIdentity
        .inheritsClusterOrientation ===
        false,
      "GEOMETRY_CLUSTER_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      model.objectIdentity
        .participatesInNavigationSettlement ===
        false,
      "GEOMETRY_NAVIGATION_SETTLEMENT_PARTICIPATION_FORBIDDEN"
    );

    invariant(
      model.objectIdentity
        .publishesQuaternion ===
        false,
      "GEOMETRY_QUATERNION_PUBLICATION_FORBIDDEN"
    );

    invariant(
      model.rootTransform &&
      model.rootTransform
        .placementMode ===
        "FIXED_CENTER",
      "GEOMETRY_FIXED_CENTER_PLACEMENT_REQUIRED"
    );

    invariant(
      model.rootTransform
        .parentOrientationMode ===
        "NONE",
      "GEOMETRY_PARENT_ORIENTATION_MODE_INVALID"
    );

    invariant(
      model.rootTransform
        .localTransformOrder ===
        "FIXED_CENTER_PLACEMENT * LOCAL_PRESENTATION_TRANSFORM",
      "GEOMETRY_LOCAL_TRANSFORM_ORDER_INVALID"
    );

    invariant(
      model.presentationTransforms &&
      model.presentationTransforms
        .fixedCenter,
      "GEOMETRY_FIXED_CENTER_TRANSFORM_REQUIRED"
    );

    invariant(
      !Object.prototype
        .hasOwnProperty
        .call(
          model.presentationTransforms,
          "decisionApproach"
        ),
      "GEOMETRY_DECISION_APPROACH_TRANSFORM_FORBIDDEN"
    );

    return true;
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

    return Object.freeze({
      visible:
        source.visible !==
        false,

      interactionEnabled:
        source.interactionEnabled !==
        false,

      held:
        source.held ===
        true,

      reducedMotion:
        source.reducedMotion ===
        true,

      hoverActive:
        source.hoverActive ===
        true,

      focusActive:
        source.focusActive ===
        true,

      pressed:
        source.pressed ===
        true,

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
      pageContext.root ||
      document;

    const mount =
      pageContext.mount ||
      qs(
        "[data-upstream-compass-mount]",
        root
      );

    invariant(
      mount instanceof Element,
      "UPSTREAM_COMPASS_MOUNT_REQUIRED"
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
      semanticControl instanceof
        Element,
      "UPSTREAM_COMPASS_SEMANTIC_CONTROL_REQUIRED"
    );

    invariant(
      fallback instanceof Element,
      "UPSTREAM_COMPASS_FALLBACK_REQUIRED"
    );

    return Object.freeze({
      root:
        root instanceof Element ||
        root === document
          ? root
          : document,

      mount,

      semanticControl,

      fallback,

      qualityProfileId:
        resolveQualityProfileId(
          pageContext
        ),

      getPresentationState:
        typeof pageContext
          .getPresentationState ===
          "function"
          ? pageContext
              .getPresentationState
          : typeof pageContext
              .getCompassPresentationState ===
              "function"
            ? pageContext
                .getCompassPresentationState
            : null,

      subscribePresentationState:
        typeof pageContext
          .subscribePresentationState ===
          "function"
          ? pageContext
              .subscribePresentationState
          : typeof pageContext
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
          : null
    });
  }

  function createCanvas(mount) {
    const existing =
      qs(
        "canvas[data-upstream-compass-canvas]",
        mount
      );

    if (existing) {
      existing.dataset
        .upstreamCompassCanvasVisible =
        "false";

      existing.setAttribute(
        "aria-hidden",
        "true"
      );

      existing.setAttribute(
        "role",
        "presentation"
      );

      existing.style.pointerEvents =
        "none";

      existing.style.opacity =
        "0";

      existing.style.visibility =
        "hidden";

      return existing;
    }

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

    canvas.style.visibility =
      "hidden";

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
          alpha:
            true,

          antialias:
            true,

          depth:
            true,

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

    instance.context
      .mount
      .dataset
      .upstreamCompassRendererStatus =
      instance.rendererStatus;
  }

  function setCanvasVisible(
    instance,
    visible
  ) {
    const active =
      visible ===
      true;

    instance.canvas.dataset
      .upstreamCompassCanvasVisible =
      active
        ? "true"
        : "false";

    /*
     * Binary promotion only.
     *
     * Enhanced visual opacity is applied once in the fragment shader through
     * uVisualOpacity. Applying currentOpacity here would multiply enhanced
     * opacity a second time.
     */
    instance.canvas.style.opacity =
      active
        ? "1"
        : "0";

    instance.canvas.style.visibility =
      active
        ? "visible"
        : "hidden";
  }

  function setFallbackVisible(
    instance,
    visible
  ) {
    const active =
      visible ===
      true;

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

    /*
     * The static fallback has no fragment shader. CSS opacity is therefore
     * its single visual-opacity authority.
     */
    fallback.style.opacity =
      active
        ? String(
            instance.currentOpacity
          )
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
      .upstreamCompassFixedCenter =
      "true";

    mount.dataset
      .upstreamCompassVisible =
      instance.presentationState
        .visible
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassInteractionEnabled =
      instance.presentationState
        .interactionEnabled
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassHeld =
      instance.presentationState
        .held
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassReducedMotion =
      instance.reducedMotion
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassHoverActive =
      instance.hoverActive
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassFocusActive =
      instance.focusActive
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassPressed =
      instance.pressed
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassFirstEnhancedFrame =
      instance.firstEnhancedFrameCompleted
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassInheritsParentOrientation =
      "false";

    mount.dataset
      .upstreamCompassNavigationOrientationApplied =
      "false";

    mount.dataset
      .upstreamCompassConstellationOrientationApplied =
      "false";

    mount.dataset
      .upstreamCompassClusterOrientationApplied =
      "false";

    mount.dataset
      .upstreamCompassParticipatesInNavigationSettlement =
      "false";

    mount.dataset
      .upstreamCompassRendererOwnsActivation =
      "false";

    mount.dataset
      .upstreamCompassRendererOwnsSemanticDisabledState =
      "false";

    mount.dataset
      .upstreamCompassRendererFailure =
      instance.presentationState
        .rendererFailure ||
      (
        instance.renderFailureEmitted
          ? instance.lastFailure
          : ""
      );

    mount.dataset
      .upstreamCompassEnhancedOpacityAuthority =
      "shader";

    mount.dataset
      .upstreamCompassFallbackOpacityAuthority =
      "css";

    mount.dataset
      .upstreamCompassCanvasPromotionOpacity =
      "binary";

    mount.dataset
      .visualPassClaimed =
      "false";

    /*
     * The renderer intentionally does not write aria-disabled, disabled,
     * tabindex, href, role, or activation behavior on the canonical semantic
     * control. Controller/HTML synchronization owns semantic state.
     */
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
      !instance.presentationState
        .visible
    ) {
      setCanvasVisible(
        instance,
        false
      );

      setFallbackVisible(
        instance,
        false
      );

      return;
    }

    if (
      instance.renderFailureEmitted ||
      instance.rendererStatus ===
        RENDERER_STATUS.FAILED ||
      instance.presentationState
        .rendererFailure
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
      instance.firstEnhancedFrameCompleted &&
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
      fallbackSurface.svgString;

    instance.context
      .fallback
      .dataset
      .upstreamCompassFallbackInjected =
      "true";
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

  function visualScaleTarget(
    instance
  ) {
    if (
      !instance.presentationState
        .visible
    ) {
      return QUALITY.hiddenScale;
    }

    if (
      instance.presentationState
        .held
    ) {
      return QUALITY.heldScale;
    }

    if (
      !instance.presentationState
        .interactionEnabled
    ) {
      return QUALITY.disabledScale;
    }

    if (
      instance.pressed
    ) {
      return QUALITY.pressedScale;
    }

    if (
      instance.focusActive &&
      !instance.reducedMotion
    ) {
      return QUALITY.focusScale;
    }

    if (
      instance.hoverActive &&
      !instance.reducedMotion
    ) {
      return QUALITY.hoverScale;
    }

    return 1;
  }

  function visualOpacityTarget(
    instance
  ) {
    if (
      !instance.presentationState
        .visible
    ) {
      return QUALITY.hiddenOpacity;
    }

    if (
      instance.presentationState
        .held
    ) {
      return QUALITY.heldOpacity;
    }

    if (
      !instance.presentationState
        .interactionEnabled
    ) {
      return QUALITY.disabledOpacity;
    }

    return QUALITY.normalOpacity;
  }

  function visualBrightnessTarget(
    instance
  ) {
    if (
      instance.presentationState
        .held ||
      !instance.presentationState
        .interactionEnabled
    ) {
      return 0.84;
    }

    if (
      instance.pressed
    ) {
      return 0.96;
    }

    if (
      instance.focusActive
    ) {
      return 1.08;
    }

    if (
      instance.hoverActive
    ) {
      return 1.05;
    }

    return 1;
  }

  function synchronizeVisualTargets(
    instance
  ) {
    instance.targetFeedbackScale =
      visualScaleTarget(
        instance
      );

    instance.targetOpacity =
      visualOpacityTarget(
        instance
      );

    instance.targetBrightness =
      visualBrightnessTarget(
        instance
      );
  }

  function presentationOwnsReducedMotion(
    instance
  ) {
    return (
      !instance.context
        .getReducedMotion &&
      !instance.context
        .subscribeReducedMotion
    );
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

    const normalized =
      normalizePresentationState(
        value
      );

    instance.presentationState =
      normalized;

    instance.hoverActive =
      normalized.hoverActive ||
      instance.semanticHoverActive;

    instance.focusActive =
      normalized.focusActive ||
      instance.semanticFocusActive;

    instance.pressed =
      normalized.pressed ||
      instance.semanticPressed;

    /*
     * A dedicated reduced-motion getter or subscription is authoritative when
     * supplied. Otherwise the presentation state owns reduced motion in both
     * directions, so true can return to false.
     */
    if (
      presentationOwnsReducedMotion(
        instance
      )
    ) {
      instance.reducedMotion =
        normalized.reducedMotion;
    }

    synchronizeVisualTargets(
      instance
    );

    if (
      instance.reducedMotion
    ) {
      instance.feedbackScale =
        instance.targetFeedbackScale;

      instance.currentOpacity =
        instance.targetOpacity;

      instance.currentBrightness =
        instance.targetBrightness;
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
      active ===
      true;

    synchronizeVisualTargets(
      instance
    );

    if (
      instance.reducedMotion
    ) {
      instance.localPosition =
        instance.targetLocalPosition
          .slice();

      instance.localQuaternion =
        instance.targetLocalQuaternion
          .slice();

      instance.localScale =
        instance.targetLocalScale
          .slice();

      instance.feedbackScale =
        instance.targetFeedbackScale;

      instance.currentOpacity =
        instance.targetOpacity;

      instance.currentBrightness =
        instance.targetBrightness;
    }

    publishMountState(
      instance
    );
  }

  function readInitialPresentation(
    context
  ) {
    let state =
      normalizePresentationState(
        null
      );

    if (
      context.getPresentationState
    ) {
      try {
        state =
          normalizePresentationState(
            context
              .getPresentationState()
          );
      } catch (_) {}
    }

    return state;
  }

  function readInitialReducedMotion(
    context,
    presentationState
  ) {
    if (
      context.getReducedMotion
    ) {
      try {
        return (
          context
            .getReducedMotion() ===
          true
        );
      } catch (_) {}
    }

    return presentationState
      .reducedMotion;
  }

  function createInstance(
    context
  ) {
    const geometry =
      resolveGeometryAuthority();

    const model =
      geometry.buildModel({
        qualityProfileId:
          context.qualityProfileId
      });

    validateGeometryModel(
      geometry,
      model
    );

    const fixedCenterTransform =
      normalizeLocalTransform(
        model.presentationTransforms
          .fixedCenter
      );

    const presentationState =
      readInitialPresentation(
        context
      );

    const reducedMotion =
      readInitialReducedMotion(
        context,
        presentationState
      );

    const instanceId =
      `home-compass-instance-${++instanceCounter}`;

    const canvas =
      createCanvas(
        context.mount
      );

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

      presentationState,

      reducedMotion,

      localPosition:
        fixedCenterTransform
          .position
          .slice(),

      targetLocalPosition:
        fixedCenterTransform
          .position
          .slice(),

      localQuaternion:
        fixedCenterTransform
          .quaternion
          .slice(),

      targetLocalQuaternion:
        fixedCenterTransform
          .quaternion
          .slice(),

      localScale:
        fixedCenterTransform
          .scale
          .slice(),

      targetLocalScale:
        fixedCenterTransform
          .scale
          .slice(),

      semanticHoverActive:
        false,

      semanticFocusActive:
        false,

      semanticPressed:
        false,

      hoverActive:
        presentationState
          .hoverActive,

      focusActive:
        presentationState
          .focusActive,

      pressed:
        presentationState
          .pressed,

      feedbackScale:
        1,

      targetFeedbackScale:
        1,

      currentOpacity:
        presentationState
          .visible
          ? 1
          : 0,

      targetOpacity:
        presentationState
          .visible
          ? 1
          : 0,

      currentBrightness:
        1,

      targetBrightness:
        1,

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

      semanticListeners:
        [],

      renderFailureEmitted:
        false,

      lastFailure:
        "",

      firstEnhancedFrameCompleted:
        false,

      rendererStatus:
        RENDERER_STATUS
          .INITIALIZING
    };

    synchronizeVisualTargets(
      instance
    );

    if (
      reducedMotion
    ) {
      instance.feedbackScale =
        instance.targetFeedbackScale;

      instance.currentOpacity =
        instance.targetOpacity;

      instance.currentBrightness =
        instance.targetBrightness;
    }

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
      instance.renderFailureEmitted
    ) {
      return;
    }

    const normalizedReason =
      String(
        reason ||
        "UNKNOWN_RENDER_FAILURE"
      );

    instance.renderFailureEmitted =
      true;

    instance.lastFailure =
      normalizedReason;

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
        normalizedReason,

      lastInstanceId:
        instance.id,

      lastRendererStatus:
        RENDERER_STATUS.FAILED,

      lastQualityProfileId:
        instance.model
          .qualityProfile
          .id,

      lastReducedMotion:
        instance.reducedMotion,

      lastVisible:
        instance.presentationState
          .visible,

      lastInteractionEnabled:
        instance.presentationState
          .interactionEnabled,

      lastHeld:
        instance.presentationState
          .held,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted
    });

    emitFailure(
      normalizedReason,
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
          ),

        visualOpacity:
          gl.getUniformLocation(
            instance.program,
            "uVisualOpacity"
          ),

        feedbackBrightness:
          gl.getUniformLocation(
            instance.program,
            "uFeedbackBrightness"
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

    const onContextLost =
      event => {
        event.preventDefault();

        safeEmitInstanceFailure(
          instance,
          "WEBGL_CONTEXT_LOST"
        );
      };

    const onContextRestored =
      () => {
        safeEmitInstanceFailure(
          instance,
          "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED"
        );
      };

    instance.canvas
      .addEventListener(
        "webglcontextlost",
        onContextLost
      );

    instance.canvas
      .addEventListener(
        "webglcontextrestored",
        onContextRestored
      );

    instance.semanticListeners.push(
      Object.freeze({
        target:
          instance.canvas,

        type:
          "webglcontextlost",

        listener:
          onContextLost,

        options:
          false
      }),

      Object.freeze({
        target:
          instance.canvas,

        type:
          "webglcontextrestored",

        listener:
          onContextRestored,

        options:
          false
      })
    );
  }

  function updateSemanticVisualState(
    instance
  ) {
    instance.hoverActive =
      instance.semanticHoverActive ||
      instance.presentationState
        .hoverActive;

    instance.focusActive =
      instance.semanticFocusActive ||
      instance.presentationState
        .focusActive;

    instance.pressed =
      instance.semanticPressed ||
      instance.presentationState
        .pressed;

    synchronizeVisualTargets(
      instance
    );

    publishMountState(
      instance
    );
  }

  function addTrackedListener(
    instance,
    target,
    type,
    listener,
    options = false
  ) {
    target.addEventListener(
      type,
      listener,
      options
    );

    instance.semanticListeners.push(
      Object.freeze({
        target,
        type,
        listener,
        options
      })
    );
  }

  function bindSemanticVisualFeedback(
    instance
  ) {
    const control =
      instance.context
        .semanticControl;

    const onPointerEnter =
      () => {
        instance.semanticHoverActive =
          true;

        updateSemanticVisualState(
          instance
        );
      };

    const onPointerLeave =
      () => {
        instance.semanticHoverActive =
          false;

        instance.semanticPressed =
          false;

        updateSemanticVisualState(
          instance
        );
      };

    const onPointerDown =
      event => {
        if (
          event.isPrimary ===
            false ||
          !instance.presentationState
            .interactionEnabled ||
          instance.presentationState
            .held
        ) {
          return;
        }

        instance.semanticPressed =
          true;

        updateSemanticVisualState(
          instance
        );
      };

    const onPointerUp =
      () => {
        instance.semanticPressed =
          false;

        updateSemanticVisualState(
          instance
        );
      };

    const onPointerCancel =
      () => {
        instance.semanticPressed =
          false;

        updateSemanticVisualState(
          instance
        );
      };

    const onFocusIn =
      () => {
        instance.semanticFocusActive =
          true;

        updateSemanticVisualState(
          instance
        );
      };

    const onFocusOut =
      () => {
        instance.semanticFocusActive =
          false;

        instance.semanticPressed =
          false;

        updateSemanticVisualState(
          instance
        );
      };

    const onKeyDown =
      event => {
        if (
          (
            event.key ===
              "Enter" ||
            event.key ===
              " "
          ) &&
          instance.presentationState
            .interactionEnabled &&
          !instance.presentationState
            .held
        ) {
          instance.semanticPressed =
            true;

          updateSemanticVisualState(
            instance
          );
        }
      };

    const onKeyUp =
      event => {
        if (
          event.key ===
            "Enter" ||
          event.key ===
            " "
        ) {
          instance.semanticPressed =
            false;

          updateSemanticVisualState(
            instance
          );
        }
      };

    addTrackedListener(
      instance,
      control,
      "pointerenter",
      onPointerEnter
    );

    addTrackedListener(
      instance,
      control,
      "pointerleave",
      onPointerLeave
    );

    addTrackedListener(
      instance,
      control,
      "pointerdown",
      onPointerDown
    );

    addTrackedListener(
      instance,
      control,
      "pointerup",
      onPointerUp
    );

    addTrackedListener(
      instance,
      control,
      "pointercancel",
      onPointerCancel
    );

    addTrackedListener(
      instance,
      control,
      "focusin",
      onFocusIn
    );

    addTrackedListener(
      instance,
      control,
      "focusout",
      onFocusOut
    );

    addTrackedListener(
      instance,
      control,
      "keydown",
      onKeyDown
    );

    addTrackedListener(
      instance,
      control,
      "keyup",
      onKeyUp
    );
  }

  function subscribeContextSignals(
    instance
  ) {
    const context =
      instance.context;

    if (
      context.subscribePresentationState
    ) {
      const unsubscribe =
        context
          .subscribePresentationState(
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
        instance.unsubscribers.push(
          unsubscribe
        );
      }
    }

    if (
      context.subscribeReducedMotion
    ) {
      const unsubscribe =
        context
          .subscribeReducedMotion(
            value => {
              setReducedMotion(
                instance,
                value ===
                  true
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
        instance.unsubscribers.push(
          unsubscribe
        );
      }
    }

    bindSemanticVisualFeedback(
      instance
    );
  }

  function unbindSubscriptions(
    instance
  ) {
    while (
      instance.unsubscribers.length >
      0
    ) {
      const unsubscribe =
        instance.unsubscribers.pop();

      try {
        unsubscribe();
      } catch (_) {}
    }

    while (
      instance.semanticListeners.length >
      0
    ) {
      const record =
        instance.semanticListeners.pop();

      try {
        record.target
          .removeEventListener(
            record.type,
            record.listener,
            record.options
          );
      } catch (_) {}
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

  function releaseMountOwnership(
    instance
  ) {
    if (
      INSTANCE_BY_MOUNT.get(
        instance.context.mount
      ) ===
      instance
    ) {
      INSTANCE_BY_MOUNT.delete(
        instance.context.mount
      );
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
      instance.canvas.parentNode
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

    releaseMountOwnership(
      instance
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

      lastQualityProfileId:
        instance.model
          .qualityProfile
          .id,

      lastReducedMotion:
        instance.reducedMotion,

      lastVisible:
        instance.presentationState
          .visible,

      lastInteractionEnabled:
        instance.presentationState
          .interactionEnabled,

      lastHeld:
        instance.presentationState
          .held,

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
        globalThis.devicePixelRatio ||
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
        QUALITY.minimumCssSceneSize,
        rect.width
      );

    instance.cssHeight =
      Math.max(
        QUALITY.minimumCssSceneSize,
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

  function updateExternalSnapshots(
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
        .getPresentationState
    ) {
      try {
        syncPresentationState(
          instance,
          instance.context
            .getPresentationState()
        );
      } catch (_) {}
    }
  }

  function updateTransforms(
    instance,
    deltaSeconds
  ) {
    synchronizeVisualTargets(
      instance
    );

    if (
      instance.reducedMotion
    ) {
      instance.localPosition =
        instance.targetLocalPosition
          .slice();

      instance.localQuaternion =
        instance.targetLocalQuaternion
          .slice();

      instance.localScale =
        instance.targetLocalScale
          .slice();

      instance.feedbackScale =
        instance.targetFeedbackScale;

      instance.currentOpacity =
        instance.targetOpacity;

      instance.currentBrightness =
        instance.targetBrightness;

      return;
    }

    const amount =
      1 -
      Math.exp(
        -QUALITY.interpolationSpeed *
        deltaSeconds
      );

    instance.localPosition =
      interpolateArray3(
        instance.localPosition,
        instance.targetLocalPosition,
        amount
      );

    instance.localQuaternion =
      quaternionSlerp(
        instance.localQuaternion,
        instance.targetLocalQuaternion,
        amount
      );

    instance.localScale =
      interpolateArray3(
        instance.localScale,
        instance.targetLocalScale,
        amount
      );

    instance.feedbackScale =
      interpolateNumber(
        instance.feedbackScale,
        instance.targetFeedbackScale,
        amount
      );

    instance.currentOpacity =
      interpolateNumber(
        instance.currentOpacity,
        instance.targetOpacity,
        amount
      );

    instance.currentBrightness =
      interpolateNumber(
        instance.currentBrightness,
        instance.targetBrightness,
        amount
      );
  }

  function currentModelMatrix(
    instance
  ) {
    const localTranslation =
      translate4(
        instance.localPosition[0],
        instance.localPosition[1],
        instance.localPosition[2]
      );

    const localRotation =
      quaternionToMatrix4(
        instance.localQuaternion
      );

    const localScale =
      scale4(
        instance.localScale[0] *
          instance.feedbackScale,

        instance.localScale[1] *
          instance.feedbackScale,

        instance.localScale[2] *
          instance.feedbackScale
      );

    /*
     * Fixed-center law:
     *
     * FIXED_CENTER_PLACEMENT
     *   *
     * LOCAL_PRESENTATION_TRANSFORM
     *   *
     * RENDERER_OWNED_VISUAL_FEEDBACK
     *
     * No controller, orbit, constellation, cluster, crystals, parent,
     * navigation, or settlement quaternion participates.
     */
    return multiply4(
      localTranslation,
      multiply4(
        localRotation,
        localScale
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
      instance.uniforms.baseColor,

      material.baseColor[0],
      material.baseColor[1],
      material.baseColor[2]
    );

    gl.uniform3f(
      instance.uniforms.ambientColor,
      0.10,
      0.12,
      0.16
    );

    gl.uniform3f(
      instance.uniforms.keyLightView,
      -0.38,
      -0.86,
      -0.60
    );

    gl.uniform3f(
      instance.uniforms.fillLightView,
      0.70,
      -0.22,
      -0.46
    );

    gl.uniform3f(
      instance.uniforms.rimLightView,
      0.10,
      0.45,
      1.0
    );

    gl.uniform1f(
      instance.uniforms.alpha,
      material.alpha
    );

    gl.uniform1f(
      instance.uniforms.emissive,
      material.emissive
    );

    gl.uniform1f(
      instance.uniforms.specular,
      material.specular
    );

    gl.uniform1f(
      instance.uniforms.rim,
      material.rim
    );

    const haloStrength =
      haloPass &&
      instance.cssWidth >
        QUALITY.bloomDisableWidthPx
        ? material.halo
        : 0;

    gl.uniform1f(
      instance.uniforms.haloStrength,
      haloStrength
    );

    gl.uniform1f(
      instance.uniforms.visualOpacity,
      clamp(
        instance.currentOpacity,
        0,
        1
      )
    );

    gl.uniform1f(
      instance.uniforms.feedbackBrightness,
      clamp(
        instance.currentBrightness,
        0,
        2
      )
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
      instance.attribs.position,
      3
    );

    bindAttrib(
      gl,
      gpuMesh.normal,
      instance.attribs.normal,
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
      instance.uniforms.model,
      false,
      new Float32Array(
        modelMatrix
      )
    );

    gl.uniformMatrix4fv(
      instance.uniforms.view,
      false,
      new Float32Array(
        instance.view
      )
    );

    gl.uniformMatrix4fv(
      instance.uniforms.projection,
      false,
      new Float32Array(
        instance.projection
      )
    );

    gl.uniformMatrix3fv(
      instance.uniforms.viewNormalMatrix,
      false,
      new Float32Array(
        normalMatrix
      )
    );

    gl.uniform1f(
      instance.uniforms.haloPass,
      haloPass
        ? 1
        : 0
    );

    gl.uniform1f(
      instance.uniforms.haloExpansion,
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
      instance.firstEnhancedFrameCompleted
    ) {
      return;
    }

    instance.firstEnhancedFrameCompleted =
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
            QUALITY.maximumDeltaSeconds,
            Math.max(
              0,
              seconds -
              instance.lastTime
            )
          )
        : 0.016;

    instance.lastTime =
      seconds;

    updateExternalSnapshots(
      instance
    );

    resize(
      instance
    );

    updateTransforms(
      instance,
      deltaSeconds
    );

    applyPresentationVisibility(
      instance
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
          QUALITY.mobileAspectThreshold
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
      !instance.presentationState
        .visible ||
      instance.presentationState
        .rendererFailure ||
      instance.renderFailureEmitted
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
      QUALITY.bloomDisableWidthPx
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

      lastRendererStatus:
        instance.rendererStatus,

      lastQualityProfileId:
        instance.model
          .qualityProfile
          .id,

      lastReducedMotion:
        instance.reducedMotion,

      lastVisible:
        instance.presentationState
          .visible,

      lastInteractionEnabled:
        instance.presentationState
          .interactionEnabled,

      lastHeld:
        instance.presentationState
          .held,

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

    invariant(
      !instance.destroyed,
      "INSTANCE_DISPOSED"
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

    if (
      instance.rendererStatus ===
        RENDERER_STATUS.STOPPED
    ) {
      setMountRendererStatus(
        instance,
        instance.firstEnhancedFrameCompleted
          ? RENDERER_STATUS.AVAILABLE
          : RENDERER_STATUS.INITIALIZING
      );
    }

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

    setMountRendererStatus(
      instance,
      RENDERER_STATUS.STOPPED
    );

    publishReceipt({
      status:
        "stopped",

      lastInstanceId:
        instance.id,

      lastRendererStatus:
        RENDERER_STATUS.STOPPED
    });

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
      active ===
        true
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

    instance.presentationState =
      normalizePresentationState({
        ...instance.presentationState,

        hoverActive:
          active ===
          true
      });

    updateSemanticVisualState(
      instance
    );

    return true;
  }

  function setFocus(
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

    instance.presentationState =
      normalizePresentationState({
        ...instance.presentationState,

        focusActive:
          active ===
          true
      });

    updateSemanticVisualState(
      instance
    );

    return true;
  }

  function setPressed(
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

    instance.presentationState =
      normalizePresentationState({
        ...instance.presentationState,

        pressed:
          active ===
          true
      });

    updateSemanticVisualState(
      instance
    );

    return true;
  }

  function mount(
    pageContext
  ) {
    const context =
      normalizeContext(
        pageContext
      );

    invariant(
      !INSTANCE_BY_MOUNT.has(
        context.mount
      ),
      "UPSTREAM_COMPASS_MOUNT_ALREADY_ACTIVE"
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
        RENDERER_STATUS.INITIALIZING
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

      INSTANCE_BY_MOUNT.set(
        context.mount,
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

        lastRendererStatus:
          RENDERER_STATUS.INITIALIZING,

        lastQualityProfileId:
          instance.model
            .qualityProfile
            .id,

        lastReducedMotion:
          instance.reducedMotion,

        lastVisible:
          instance.presentationState
            .visible,

        lastInteractionEnabled:
          instance.presentationState
            .interactionEnabled,

        lastHeld:
          instance.presentationState
            .held,

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

        setHover:
          active =>
            setHover(
              instance.id,
              active
            ),

        setFocus:
          active =>
            setFocus(
              instance.id,
              active
            ),

        setPressed:
          active =>
            setPressed(
              instance.id,
              active
            ),

        getState: () =>
          getInstanceState(
            instance.id
          )
      });
    } catch (error) {
      INSTANCES.delete(
        instance.id
      );

      releaseMountOwnership(
        instance
      );

      unbindSubscriptions(
        instance
      );

      destroyGpuResources(
        instance
      );

      if (
        instance.canvas &&
        instance.canvas.parentNode
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
          : "MOUNT_INITIALIZATION_FAILURE"
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

      geometryModuleId:
        instance.geometry
          .moduleId,

      geometryModuleVersion:
        instance.geometry
          .moduleVersion,

      modelId:
        instance.model
          .modelId,

      qualityProfileId:
        instance.model
          .qualityProfile
          .id,

      presentationState:
        instance.presentationState,

      reducedMotion:
        instance.reducedMotion,

      reducedMotionAuthority:
        presentationOwnsReducedMotion(
          instance
        )
          ? "PRESENTATION_STATE"
          : "DEDICATED_REDUCED_MOTION_SURFACE",

      localPosition:
        Object.freeze(
          instance.localPosition
            .slice()
        ),

      localQuaternion:
        Object.freeze(
          instance.localQuaternion
            .slice()
        ),

      localScale:
        Object.freeze(
          instance.localScale
            .slice()
        ),

      feedbackScale:
        instance.feedbackScale,

      visualOpacity:
        instance.currentOpacity,

      visualBrightness:
        instance.currentBrightness,

      hoverActive:
        instance.hoverActive,

      focusActive:
        instance.focusActive,

      pressed:
        instance.pressed,

      running:
        instance.running,

      destroyed:
        instance.destroyed,

      rendererStatus:
        instance.rendererStatus,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted,

      renderFailureEmitted:
        instance
          .renderFailureEmitted,

      rendererFailure:
        instance.lastFailure,

      mountExclusivelyOwned:
        INSTANCE_BY_MOUNT.get(
          instance.context.mount
        ) ===
        instance,

      fixedCenter:
        true,

      parentOrientationInherited:
        false,

      navigationOrientationApplied:
        false,

      constellationOrientationApplied:
        false,

      clusterOrientationApplied:
        false,

      participatesInNavigationSettlement:
        false,

      publishesQuaternion:
        false,

      rendererOwnsActivation:
        false,

      rendererOwnsNavigation:
        false,

      rendererOwnsSelection:
        false,

      rendererOwnsSemanticDisabledState:
        false,

      fallbackPromotionOwnedByRenderer:
        true,

      semanticControlOwnedByHtml:
        true,

      enhancedOpacityAuthority:
        "SHADER",

      fallbackOpacityAuthority:
        "CSS",

      canvasPromotionOpacity:
        "BINARY"
    });
  }

  function getReceipt() {
    return Object.freeze({
      ...RECEIPT
    });
  }

  function disposeAll() {
    const instances =
      Array.from(
        INSTANCES.values()
      );

    instances.forEach(
      destroyInstance
    );

    return true;
  }

  function runContractValidation() {
    const geometry =
      resolveGeometryAuthority();

    const model =
      geometry.buildModel({
        qualityProfileId:
          "lowPower"
      });

    validateGeometryModel(
      geometry,
      model
    );

    return Object.freeze({
      receiptSchema:
        "DGB_UPSTREAM_COMPASS_RENDERER_FIXED_CENTER_CONTRACT_VALIDATION_v2",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      geometryModuleId:
        geometry.moduleId,

      geometryModuleVersion:
        geometry.moduleVersion,

      requiredGeometryModuleVersion:
        GEOMETRY_AUTHORITY
          .requiredModuleVersion,

      pass:
        true,

      fixedCenter:
        true,

      parentOrientationInherited:
        false,

      navigationOrientationApplied:
        false,

      constellationOrientationApplied:
        false,

      clusterOrientationApplied:
        false,

      participatesInNavigationSettlement:
        false,

      publishesQuaternion:
        false,

      decisionApproachPresent:
        false,

      rendererOwnsActivation:
        false,

      rendererOwnsNavigation:
        false,

      rendererOwnsSelection:
        false,

      rendererOwnsSemanticDisabledState:
        false,

      semanticControlOwnedByHtml:
        true,

      fallbackPromotionOwnedByRenderer:
        true,

      oneInstancePerMount:
        true,

      enhancedOpacityAuthority:
        "SHADER",

      fallbackOpacityAuthority:
        "CSS",

      canvasPromotionOpacity:
        "BINARY",

      reducedMotionReversibleWithoutDedicatedSurface:
        true,

      modelMatrixLaw:
        "FIXED_CENTER_PLACEMENT * LOCAL_PRESENTATION_TRANSFORM * RENDERER_OWNED_VISUAL_FEEDBACK"
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
      GEOMETRY_AUTHORITY,

    rendererStatus:
      RENDERER_STATUS,

    mount,

    start,

    stop,

    syncReducedMotion,

    syncPresentationState:
      syncPresentation,

    setHover,

    setFocus,

    setPressed,

    getInstanceState,

    disposeAll,

    runContractValidation,

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

/*
AUDRALIA_ARCHCOIN_SHARED_HOME_COMPASS_RENDERER_RENEWAL_RESULT_v2

Artifact:
/assets/compass/upstream-compass.renderer.js

Module:
DGB_UPSTREAM_COMPASS_RENDERER
3.0.1-fixed-center-runtime-corrections

Controller anchor:
DGB_ARCHCOIN_CONTROLLER
6.0.0-controller-foundation-renewal

Geometry anchor:
DGB_UPSTREAM_COMPASS_GEOMETRY
3.0.0-fixed-center-independent-sibling

Disposition:
FIXED_CENTER_RENDERER_ARCHITECTURE_PASS_WITH_BOUNDED_RUNTIME_CORRECTIONS_APPLIED

Applied correction 1:
- Canvas CSS opacity is binary.
- Active enhanced canvas opacity is exactly 1.
- Inactive enhanced canvas opacity is exactly 0.
- uVisualOpacity is the single enhanced visual-opacity authority.
- Static fallback continues using currentOpacity through CSS.
- Enhanced and fallback held opacity no longer diverge through compounded opacity.

Applied correction 2:
- Presentation-owned reduced motion is bidirectional.
- Presentation reducedMotion true may return to false.
- Dedicated getReducedMotion or subscribeReducedMotion surfaces remain
  authoritative when supplied.
- Presentation state controls reduced motion only when neither dedicated
  reduced-motion surface exists.

Applied correction 3:
- INSTANCE_BY_MOUNT WeakMap added.
- A second active instance on the same mount is rejected with:
  UPSTREAM_COMPASS_MOUNT_ALREADY_ACTIVE
- Mount ownership is registered only after successful initialization and
  instance registration.
- Disposal releases mount ownership only when the mapping still points to the
  disposing instance.
- Canvas reuse is bounded by exclusive mount ownership.

Applied correction 4:
- Renderer-authored aria-disabled mutation removed.
- Renderer does not write native disabled state.
- Renderer publishes interactionEnabled and held visual facts only on the
  mount datasets.
- Controller and HTML synchronization retain semantic-state authority.

Metadata correction:
- minimumModuleVersion renamed to requiredModuleVersion.
- Exact geometry version equality remains intentional for this dependency-
  locked implementation pass.

Retained:
- WebGL context creation
- shader compilation
- program linking
- GPU buffer construction
- indexed drawing
- Uint32 index extension support
- material segmentation
- lighting
- halo pass
- resize and device-pixel-ratio control
- local matrix mathematics
- local quaternion normalization and interpolation
- geometry.buildModel consumption
- geometry.validateModel enforcement
- static fallback injection
- fallback-first enhanced promotion
- reduced-motion handling
- instance registry
- start and stop control
- disposal
- context-loss reporting
- observational semantic hover, focus, and press feedback
- semantic-control separation from canvas

Absent:
- parent orientation
- navigation orientation
- constellation orientation
- cluster orientation
- frame orientation consumption
- Compass decision state
- route construction
- destination construction
- semantic click activation
- preventDefault or stopPropagation on activation
- renderer-owned semantic disabled state
- public orientation mutation

Fixed-center receipt facts:
- fixedCenter = true
- parentOrientationInherited = false
- navigationOrientationApplied = false
- constellationOrientationApplied = false
- clusterOrientationApplied = false
- participatesInNavigationSettlement = false
- publishesQuaternion = false
- rendererOwnsActivation = false
- rendererOwnsNavigation = false
- rendererOwnsSelection = false
- rendererOwnsSemanticDisabledState = false
- fallbackPromotionOwnedByRenderer = true
- semanticControlOwnedByHtml = true
- oneInstancePerMount = true
- enhancedOpacityAuthority = SHADER
- fallbackOpacityAuthority = CSS
- canvasPromotionOpacity = BINARY

Runtime execution:
NOT PERFORMED

Visual acceptance:
PENDING PAGE INTEGRATION

Production authorization:
FALSE

Deployment authorization:
FALSE
*/
