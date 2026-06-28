/* /assets/compass/upstream-compass.renderer.js

   Universal upstream Compass shared renderer implementation candidate.

   Purpose:
   - consume DGB_UPSTREAM_COMPASS_GEOMETRY as the single geometry authority;
   - mount one fixed-center UGC-04 Compass visual instance into a page-owned mount;
   - preserve fixed-center projection with independent bounded axial response;
   - synchronize the visual instance with a page-owned semantic control;
   - preserve progressive fallback, reduced motion, and controller-authorized held presentation;
   - remain page-agnostic and estate-agnostic.

   Candidate:
   UGC-04
   HYBRID_DOUBLE_RING_NORTH_NEEDLE_FOUR_POINT_ROSE

   Physical model:
   FIXED_CENTER_HUB

   Semantic model:
   UPSTREAM_RETURN_CONTROL

   Architectural rule:
   THE PAGE KNOWS ABOUT THE SHARED UNIVERSAL COMPASS.
   THE SHARED UNIVERSAL COMPASS DOES NOT KNOW THE ESTATE.

   Authorization boundary:

   SHARED_IMPLEMENTATION_CANDIDATE
   !=
   PRODUCTION_AUTHORIZATION

   Not authorized:
   - deployment;
   - public release;
   - final filename freeze;
   - production page integration by default;
   - visual-pass claims.
*/

const DGB_UPSTREAM_COMPASS_RENDERER = (() => {
  "use strict";

  const MODULE_ID =
    "DGB_UPSTREAM_COMPASS_RENDERER";

  const RECEIPT_SYMBOL =
    "DGB_UPSTREAM_COMPASS_RENDERER_RECEIPT";

  const FAILURE_EVENT =
    "DGB_UPSTREAM_COMPASS_RENDERER_FAILURE";

  const HELD_VARIANTS = Object.freeze({
    ENHANCED:
      "ENHANCED",

    STATIC_FALLBACK:
      "STATIC_FALLBACK"
  });

  const QUALITY = Object.freeze({
    normalDevicePixelRatioCap:
      2,

    lowPowerDevicePixelRatioCap:
      1.5,

    bloomDisableWidthPx:
      420,

    mobileAspectThreshold:
      0.82,

    defaultFieldOfViewRadians:
      Math.PI / 4.9,

    mobileFieldOfViewRadians:
      Math.PI / 4.45,

    settleSpeed:
      8.2,

    hoverScale:
      1.04,

    haloExpansion:
      0.055,

    minimumMotionResponseRatio:
      -0.28,

    maximumMotionResponseRatio:
      0.28,

    canonicalBaselineMotionResponseRatio:
      -0.18,

    maximumAxialDisplacementRadians:
      0.32,

    releaseSettleSeconds:
      0.22,

    minimumCssSceneSize:
      1
  });

  const MATERIALS = Object.freeze({
    OUTER_RING:
      Object.freeze({
        alpha:
          0.96,
        emissive:
          0.08,
        specular:
          1.12,
        rim:
          0.72
      }),

    INNER_RING:
      Object.freeze({
        alpha:
          0.92,
        emissive:
          0.04,
        specular:
          0.96,
        rim:
          0.58
      }),

    PRINCIPAL_DIRECTION:
      Object.freeze({
        alpha:
          0.95,
        emissive:
          0.05,
        specular:
          1.00,
        rim:
          0.62
      }),

    NORTH_NEEDLE:
      Object.freeze({
        alpha:
          0.98,
        emissive:
          0.10,
        specular:
          1.18,
        rim:
          0.82
      }),

    CENTRAL_HUB:
      Object.freeze({
        alpha:
          0.98,
        emissive:
          0.04,
        specular:
          0.90,
        rim:
          0.54
      })
  });

  const RECEIPT = {
    moduleId:
      MODULE_ID,

    status:
      "pending",

    rendererInitialized:
      false,

    geometryAuthority:
      "DGB_UPSTREAM_COMPASS_GEOMETRY",

    mountedInstanceCount:
      0,

    lastInstanceId:
      "",

    lastFailure:
      "",

    lastHeldVariant:
      "",

    lastReducedMotion:
      false,

    lastMountPageNodeId:
      "",

    lastParentRoute:
      "",

    fixedCenterHub:
      true,

    localQuaternionInherited:
      false,

    localSettlementParticipation:
      false,

    productionAuthorized:
      false,

    repositoryIntegrationAuthorized:
      false,

    finalFilenameFreezeAuthorized:
      false,

    visualPassClaimed:
      false
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
    uniform mat3 uNormalMatrix;
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vHaloPass;

    void main() {
      vec3 pos = aPosition;

      if (uHaloPass > 0.5) {
        pos += normalize(aNormal) * uHaloExpansion;
      }

      vec4 world = uModel * vec4(pos, 1.0);
      vec4 view = uView * world;

      vNormal = normalize(uNormalMatrix * aNormal);
      vViewPosition = view.xyz;
      vHaloPass = uHaloPass;

      gl_Position = uProjection * view;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vHaloPass;

    uniform vec3 uBaseColor;
    uniform vec3 uAmbientColor;
    uniform vec3 uKeyLight;
    uniform vec3 uFillLight;
    uniform vec3 uRimLight;
    uniform float uAlpha;
    uniform float uEmissive;
    uniform float uSpecular;
    uniform float uRim;
    uniform float uHaloStrength;

    void main() {
      vec3 n = normalize(vNormal);
      vec3 viewDir = normalize(-vViewPosition);

      float key = max(dot(n, normalize(-uKeyLight)), 0.0);
      float fill = max(dot(n, normalize(-uFillLight)), 0.0);
      float rear = max(dot(n, normalize(-uRimLight)), 0.0);
      float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.0);
      float spec = pow(
        max(dot(reflect(normalize(uKeyLight), n), viewDir), 0.0),
        24.0
      );

      if (vHaloPass > 0.5) {
        vec3 haloColor =
          uBaseColor *
          (0.55 + fresnel * 1.12 + rear * 0.18) *
          uHaloStrength;

        float haloAlpha =
          clamp(
            (0.035 + fresnel * 0.16) * uHaloStrength,
            0.0,
            0.34
          );

        gl_FragColor =
          vec4(haloColor, haloAlpha);

        return;
      }

      float diffuse =
        0.20 +
        key * 0.82 +
        fill * 0.28 +
        rear * 0.10;

      vec3 color =
        uBaseColor * diffuse +
        uBaseColor * uEmissive +
        vec3(1.0, 0.96, 0.86) * spec * uSpecular +
        uBaseColor * fresnel * uRim * 0.72 +
        uAmbientColor * uBaseColor * 0.22;

      gl_FragColor =
        vec4(color, uAlpha);
    }
  `;

  function invariant(condition, code, details = null) {
    if (!condition) {
      const error =
        new Error(code);

      error.code =
        code;

      error.details =
        details;

      throw error;
    }
  }

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function finiteNumber(value, fallback = 0) {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function shallowFreezeRecord(record) {
    return Object.freeze({
      ...record
    });
  }

  function normalizeArray3(value, fallback) {
    if (
      Array.isArray(value) &&
      value.length === 3
    ) {
      return [
        finiteNumber(value[0], fallback[0]),
        finiteNumber(value[1], fallback[1]),
        finiteNumber(value[2], fallback[2])
      ];
    }

    return fallback.slice();
  }

  function normalizeQuaternion(value) {
    const source =
      Array.isArray(value) &&
      value.length === 4
        ? value
        : [0, 0, 0, 1];

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
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
      length <= 1e-12
    ) {
      return [0, 0, 0, 1];
    }

    return quaternion.map(
      (component) =>
        component / length
    );
  }

  function quaternionMultiplyRaw(a, b) {
    return [
      a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
      a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
      a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
      a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
    ];
  }

  function quaternionMultiply(a, b) {
    return normalizeQuaternion(
      quaternionMultiplyRaw(a, b)
    );
  }

  function quaternionSlerp(a, b, amount) {
    let from =
      normalizeQuaternion(a);

    let to =
      normalizeQuaternion(b);

    let cosine =
      from[0] * to[0] +
      from[1] * to[1] +
      from[2] * to[2] +
      from[3] * to[3];

    if (cosine < 0) {
      to = [
        -to[0],
        -to[1],
        -to[2],
        -to[3]
      ];

      cosine =
        -cosine;
    }

    if (cosine > 0.9995) {
      return normalizeQuaternion([
        from[0] + (to[0] - from[0]) * amount,
        from[1] + (to[1] - from[1]) * amount,
        from[2] + (to[2] - from[2]) * amount,
        from[3] + (to[3] - from[3]) * amount
      ]);
    }

    const theta =
      Math.acos(
        clamp(cosine, -1, 1)
      );

    const sineTheta =
      Math.sin(theta);

    const weightFrom =
      Math.sin((1 - amount) * theta) /
      sineTheta;

    const weightTo =
      Math.sin(amount * theta) /
      sineTheta;

    return normalizeQuaternion([
      from[0] * weightFrom + to[0] * weightTo,
      from[1] * weightFrom + to[1] * weightTo,
      from[2] * weightFrom + to[2] * weightTo,
      from[3] * weightFrom + to[3] * weightTo
    ]);
  }

  function quaternionFromAxisAngle(axis, angle) {
    const half =
      angle * 0.5;

    const sine =
      Math.sin(half);

    return normalizeQuaternion([
      axis[0] * sine,
      axis[1] * sine,
      axis[2] * sine,
      Math.cos(half)
    ]);
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

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        for (let index = 0; index < 4; index += 1) {
          output[column * 4 + row] +=
            a[index * 4 + row] *
            b[column * 4 + index];
        }
      }
    }

    return output;
  }

  function translate4(x, y, z) {
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

  function scale4(x, y, z) {
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

  function rotateZ4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      cosine, sine, 0, 0,
      -sine, cosine, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function perspective4(fieldOfView, aspect, near, far) {
    const factor =
      1 / Math.tan(fieldOfView / 2);

    const range =
      1 / (near - far);

    return [
      factor / aspect, 0, 0, 0,
      0, factor, 0, 0,
      0, 0, (far + near) * range, -1,
      0, 0, 2 * far * near * range, 0
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
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function normalize3(vector, fallback = [0, 0, 1]) {
    const length =
      Math.hypot(
        vector[0],
        vector[1],
        vector[2]
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-12
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function lookAt4(eye, center, up) {
    const z =
      normalize3(
        subtract3(eye, center)
      );

    const x =
      normalize3(
        cross3(up, z),
        [1, 0, 0]
      );

    const y =
      cross3(z, x);

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot3(x, eye), -dot3(y, eye), -dot3(z, eye), 1
    ];
  }

  function normalMatrix3(model) {
    return [
      model[0], model[1], model[2],
      model[4], model[5], model[6],
      model[8], model[9], model[10]
    ];
  }

  function compileShader(gl, type, source) {
    const shader =
      gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const info =
        gl.getShaderInfoLog(shader) ||
        "SHADER_COMPILE_FAILURE";

      gl.deleteShader(shader);

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

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const info =
        gl.getProgramInfoLog(program) ||
        "PROGRAM_LINK_FAILURE";

      gl.deleteProgram(program);

      const error =
        new Error(info);

      error.code =
        "PROGRAM_LINK_FAILURE";

      throw error;
    }

    return program;
  }

  function createBuffer(gl, target, data) {
    const buffer =
      gl.createBuffer();

    invariant(
      buffer,
      "WEBGL_BUFFER_CREATION_FAILED",
      {
        target
      }
    );

    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);

    return buffer;
  }

  function bindAttrib(gl, buffer, location, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function emitFailure(reason, details = null) {
    RECEIPT.status =
      "held";
    RECEIPT.lastFailure =
      String(reason || "UNKNOWN_FAILURE");

    globalThis[RECEIPT_SYMBOL] =
      Object.freeze({
        ...RECEIPT
      });

    globalThis.dispatchEvent(
      new CustomEvent(
        FAILURE_EVENT,
        {
          detail:
            Object.freeze({
              reason:
                String(reason || "UNKNOWN_FAILURE"),
              details
            })
        }
      )
    );
  }

  function publishReceipt(extra = {}) {
    Object.assign(
      RECEIPT,
      {
        moduleId:
          MODULE_ID,
        mountedInstanceCount:
          INSTANCES.size,
        fixedCenterHub:
          true,
        localQuaternionInherited:
          false,
        localSettlementParticipation:
          false,
        productionAuthorized:
          false,
        repositoryIntegrationAuthorized:
          false,
        finalFilenameFreezeAuthorized:
          false,
        visualPassClaimed:
          false
      },
      extra
    );

    globalThis[RECEIPT_SYMBOL] =
      Object.freeze({
        ...RECEIPT
      });
  }

  function resolveGeometryAuthority() {
    const geometry =
      globalThis.DGB_UPSTREAM_COMPASS_GEOMETRY;

    invariant(
      geometry &&
      typeof geometry === "object",
      "GEOMETRY_AUTHORITY_NOT_FOUND"
    );

    invariant(
      geometry.moduleId ===
        "DGB_UPSTREAM_COMPASS_GEOMETRY",
      "GEOMETRY_AUTHORITY_ID_MISMATCH"
    );

    invariant(
      typeof geometry.buildModel === "function",
      "GEOMETRY_BUILD_MODEL_SURFACE_REQUIRED"
    );

    invariant(
      typeof geometry.buildStaticSvgFallback === "function",
      "GEOMETRY_STATIC_SVG_SURFACE_REQUIRED"
    );

    return geometry;
  }

  function createCanvas(mount) {
    const canvas =
      document.createElement("canvas");

    canvas.dataset.upstreamCompassCanvas =
      "true";
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

    mount.prepend(canvas);

    return canvas;
  }

  function getGL(canvas) {
    return (
      canvas.getContext("webgl", {
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
      }) || null
    );
  }

  function resolveQualityProfileId(pageContext) {
    const id =
      String(
        pageContext.qualityProfileId ||
        "desktop"
      );

    if (
      id === "desktop" ||
      id === "mobile" ||
      id === "lowPower"
    ) {
      return id;
    }

    return "desktop";
  }

  function normalizeHeldState(input) {
    if (input === true) {
      return Object.freeze({
        active:
          true,
        variant:
          HELD_VARIANTS.STATIC_FALLBACK
      });
    }

    if (input === false || input == null) {
      return Object.freeze({
        active:
          false,
        variant:
          HELD_VARIANTS.ENHANCED
      });
    }

    if (typeof input === "object") {
      return Object.freeze({
        active:
          input.active === true,
        variant:
          input.variant === HELD_VARIANTS.STATIC_FALLBACK
            ? HELD_VARIANTS.STATIC_FALLBACK
            : HELD_VARIANTS.ENHANCED
      });
    }

    return Object.freeze({
      active:
        false,
      variant:
        HELD_VARIANTS.ENHANCED
    });
  }

  function normalizeContext(pageContext) {
    invariant(
      pageContext &&
      typeof pageContext === "object",
      "PAGE_CONTEXT_REQUIRED"
    );

    const root =
      pageContext.root;

    const scene =
      pageContext.scene;

    const mount =
      pageContext.mount ||
      qs("[data-upstream-compass-mount]", root);

    const control =
      pageContext.semanticControl ||
      qs("[data-upstream-compass-control]", mount);

    const fallback =
      pageContext.fallback ||
      qs("[data-upstream-compass-fallback]", mount);

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
      control instanceof Element,
      "UPSTREAM_COMPASS_SEMANTIC_CONTROL_REQUIRED"
    );

    invariant(
      fallback instanceof Element,
      "UPSTREAM_COMPASS_FALLBACK_REQUIRED"
    );

    const pageNodeId =
      String(
        pageContext.pageNodeId ||
        mount.getAttribute("data-upstream-compass-page-node") ||
        ""
      ).trim();

    const parentNodeId =
      String(
        pageContext.parentNodeId ||
        mount.getAttribute("data-upstream-compass-parent-node") ||
        ""
      ).trim();

    const parentRoute =
      String(
        pageContext.parentRoute ||
        mount.getAttribute("data-upstream-compass-parent-route") ||
        control.getAttribute("href") ||
        ""
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
      parentRoute.startsWith("/"),
      "PARENT_ROUTE_REQUIRED"
    );

    if (control.tagName === "A") {
      const controlHref =
        String(
          control.getAttribute("href") || ""
        ).trim();

      invariant(
        controlHref === parentRoute,
        "HTML_AND_CONTROLLER_PARENT_ROUTE_MUST_AGREE",
        {
          controlHref,
          parentRoute
        }
      );
    }

    const requestReturnToUpstream =
      typeof pageContext.requestReturnToUpstream === "function"
        ? pageContext.requestReturnToUpstream
        : () => {
            if (control.tagName === "A") {
              globalThis.location.assign(parentRoute);
              return true;
            }

            return false;
          };

    const getHeldState =
      typeof pageContext.getHeldState === "function"
        ? pageContext.getHeldState
        : null;

    const getReducedMotion =
      typeof pageContext.getReducedMotion === "function"
        ? pageContext.getReducedMotion
        : null;

    const subscribeGestureDelta =
      typeof pageContext.subscribeGestureDelta === "function"
        ? pageContext.subscribeGestureDelta
        : null;

    const subscribeGestureRelease =
      typeof pageContext.subscribeGestureRelease === "function"
        ? pageContext.subscribeGestureRelease
        : null;

    const subscribeReducedMotion =
      typeof pageContext.subscribeReducedMotion === "function"
        ? pageContext.subscribeReducedMotion
        : null;

    const subscribeHeldState =
      typeof pageContext.subscribeHeldState === "function"
        ? pageContext.subscribeHeldState
        : null;

    const controller =
      pageContext.controller || null;

    const motionResponseRatio =
      clamp(
        finiteNumber(
          pageContext.motionResponseRatio,
          QUALITY.canonicalBaselineMotionResponseRatio
        ),
        QUALITY.minimumMotionResponseRatio,
        QUALITY.maximumMotionResponseRatio
      );

    return Object.freeze({
      root,
      scene,
      mount,
      semanticControl:
        control,
      fallback,
      pageNodeId,
      parentNodeId,
      parentRoute,
      requestReturnToUpstream,
      getHeldState,
      getReducedMotion,
      subscribeGestureDelta,
      subscribeGestureRelease,
      subscribeReducedMotion,
      subscribeHeldState,
      controller,
      motionResponseRatio,
      qualityProfileId:
        resolveQualityProfileId(pageContext),
      initialHeldState:
        normalizeHeldState(
          pageContext.heldState
        ),
      initialReducedMotion:
        pageContext.reducedMotion === true
    });
  }

  function replaceFallbackContent(instance) {
    const fallbackSurface =
      instance.geometry.buildStaticSvgFallback({
        title:
          "Return to Master Compass",
        className:
          "ugc04-static-fallback",
        includeTitle:
          true,
        includeIntercardinalTicks:
          false,
        ariaHidden:
          true,
        focusable:
          false
      });

    instance.fallbackSurface =
      fallbackSurface;

    instance.context.fallback.innerHTML =
      fallbackSurface.svgString;

    instance.context.fallback.dataset.upstreamCompassFallbackInjected =
      "true";
  }

  function restoreStaticFallback(instance) {
    if (
      instance.context &&
      instance.context.fallback
    ) {
      instance.context.fallback.hidden =
        false;
      instance.context.fallback.style.display =
        "";
      instance.context.fallback.dataset.upstreamCompassFallbackVisible =
        "true";
    }
  }

  function createInstance(context) {
    const geometry =
      resolveGeometryAuthority();

    const model =
      geometry.buildModel({
        quality:
          context.qualityProfileId,
        includeIntercardinalTicks:
          false
      });

    const instanceId =
      `ugc04-instance-${++instanceCounter}`;

    const canvas =
      createCanvas(context.mount);

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
      time:
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
      reducedMotion:
        context.initialReducedMotion,
      heldState:
        context.initialHeldState,
      fixedPosition:
        normalizeArray3(
          model.rootTransform.defaultPosition,
          [0, 0, 0]
        ),
      scale:
        normalizeArray3(
          model.rootTransform.defaultScale,
          [1, 1, 1]
        ),
      quaternion:
        normalizeQuaternion(
          model.rootTransform.defaultQuaternion
        ),
      axialAngle:
        0,
      targetAxialAngle:
        0,
      settleActive:
        false,
      hoverActive:
        false,
      destroyed:
        false,
      unsubscribers:
        [],
      onSemanticControlClick:
        null,
      renderFailureEmitted:
        false
    };

    return instance;
  }

  function safeEmitInstanceFailure(instance, reason, details = null) {
    if (instance.renderFailureEmitted) {
      return;
    }

    instance.renderFailureEmitted =
      true;

    publishReceipt({
      status:
        "held",
      lastFailure:
        String(reason || "UNKNOWN_FAILURE"),
      lastInstanceId:
        instance.id,
      lastMountPageNodeId:
        instance.context.pageNodeId,
      lastParentRoute:
        instance.context.parentRoute,
      rendererInitialized:
        false
    });

    emitFailure(reason, details);
  }

  function compileProgramSurfaces(instance) {
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
        normalMatrix:
          gl.getUniformLocation(
            instance.program,
            "uNormalMatrix"
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
        keyLight:
          gl.getUniformLocation(
            instance.program,
            "uKeyLight"
          ),
        fillLight:
          gl.getUniformLocation(
            instance.program,
            "uFillLight"
          ),
        rimLight:
          gl.getUniformLocation(
            instance.program,
            "uRimLight"
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

  function createGpuMeshRecord(gl, mesh) {
    const material =
      MATERIALS[mesh.materialKey] ||
      MATERIALS.PRINCIPAL_DIRECTION;

    return Object.freeze({
      componentId:
        mesh.componentId,
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
        mesh.indices instanceof Uint32Array
          ? gl.UNSIGNED_INT
          : gl.UNSIGNED_SHORT
    });
  }

  function buildGpuMeshes(instance) {
    const gl =
      instance.gl;

    const isWebGL2 =
      typeof WebGL2RenderingContext !== "undefined" &&
      gl instanceof WebGL2RenderingContext;

    if (
      instance.model.meshes.some(
        (mesh) =>
          mesh.indices instanceof Uint32Array
      ) &&
      !isWebGL2
    ) {
      const extension =
        gl.getExtension("OES_element_index_uint");

      invariant(
        extension,
        "UINT32_ELEMENT_INDEX_EXTENSION_REQUIRED"
      );
    }

    return instance.model.meshes.map(
      (mesh) =>
        createGpuMeshRecord(gl, mesh)
    );
  }

  function initializeGL(instance) {
    const gl =
      getGL(instance.canvas);

    invariant(
      gl,
      "WEBGL_CONTEXT_UNAVAILABLE"
    );

    instance.gl =
      gl;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );
    gl.disable(gl.CULL_FACE);

    compileProgramSurfaces(instance);

    instance.gpuMeshes =
      buildGpuMeshes(instance);

    instance.canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();

        instance.running =
          false;

        restoreStaticFallback(instance);

        instance.canvas.style.opacity =
          "0";

        safeEmitInstanceFailure(
          instance,
          "WEBGL_CONTEXT_LOST"
        );
      }
    );

    instance.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        restoreStaticFallback(instance);
        instance.canvas.style.opacity =
          "0";

        safeEmitInstanceFailure(
          instance,
          "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED"
        );
      }
    );
  }

  function setReducedMotion(instance, active) {
    instance.reducedMotion =
      active === true;

    if (instance.reducedMotion) {
      instance.axialAngle =
        0;
      instance.targetAxialAngle =
        0;
      instance.settleActive =
        false;
    }
  }

  function setHeldState(instance, heldInput) {
    instance.heldState =
      normalizeHeldState(heldInput);
  }

  function subscribeContextSignals(instance) {
    const context =
      instance.context;

    if (typeof context.subscribeGestureDelta === "function") {
      const unsubscribe =
        context.subscribeGestureDelta(
          (deltaThetaGesture) => {
            if (instance.destroyed) {
              return;
            }

            if (instance.reducedMotion) {
              instance.targetAxialAngle =
                0;
              instance.axialAngle =
                0;
              instance.settleActive =
                false;
              return;
            }

            const delta =
              finiteNumber(deltaThetaGesture, 0);

            const phiNext =
              clamp(
                instance.targetAxialAngle +
                  context.motionResponseRatio * delta,
                -QUALITY.maximumAxialDisplacementRadians,
                QUALITY.maximumAxialDisplacementRadians
              );

            instance.targetAxialAngle =
              phiNext;
            instance.settleActive =
              false;
          }
        );

      if (typeof unsubscribe === "function") {
        instance.unsubscribers.push(unsubscribe);
      }
    }

    if (typeof context.subscribeGestureRelease === "function") {
      const unsubscribe =
        context.subscribeGestureRelease(
          () => {
            if (instance.destroyed) {
              return;
            }

            if (instance.reducedMotion) {
              instance.axialAngle =
                0;
              instance.targetAxialAngle =
                0;
              instance.settleActive =
                false;
              return;
            }

            instance.settleActive =
              true;
          }
        );

      if (typeof unsubscribe === "function") {
        instance.unsubscribers.push(unsubscribe);
      }
    }

    if (typeof context.subscribeReducedMotion === "function") {
      const unsubscribe =
        context.subscribeReducedMotion(
          (value) => {
            if (instance.destroyed) {
              return;
            }

            setReducedMotion(
              instance,
              value === true
            );
          }
        );

      if (typeof unsubscribe === "function") {
        instance.unsubscribers.push(unsubscribe);
      }
    }

    if (typeof context.subscribeHeldState === "function") {
      const unsubscribe =
        context.subscribeHeldState(
          (held) => {
            if (instance.destroyed) {
              return;
            }

            setHeldState(instance, held);
            applyHeldPresentation(instance);
          }
        );

      if (typeof unsubscribe === "function") {
        instance.unsubscribers.push(unsubscribe);
      }
    }

    instance.onSemanticControlClick =
      (event) => {
        event.preventDefault();

        if (
          instance.context &&
          typeof instance.context.requestReturnToUpstream === "function"
        ) {
          instance.context.requestReturnToUpstream();
        }
      };

    instance.context.semanticControl.addEventListener(
      "click",
      instance.onSemanticControlClick
    );
  }

  function unbindSubscriptions(instance) {
    while (instance.unsubscribers.length > 0) {
      const unsubscribe =
        instance.unsubscribers.pop();

      try {
        unsubscribe();
      } catch (_) {}
    }
  }

  function destroyGpuResources(instance) {
    const gl =
      instance.gl;

    if (!gl) {
      return;
    }

    instance.gpuMeshes.forEach(
      (gpuMesh) => {
        if (gpuMesh.position) {
          gl.deleteBuffer(gpuMesh.position);
        }

        if (gpuMesh.normal) {
          gl.deleteBuffer(gpuMesh.normal);
        }

        if (gpuMesh.index) {
          gl.deleteBuffer(gpuMesh.index);
        }
      }
    );

    instance.gpuMeshes =
      [];

    if (instance.program) {
      gl.deleteProgram(instance.program);
      instance.program =
        null;
    }
  }

  function destroyInstance(instance) {
    if (!instance || instance.destroyed) {
      return;
    }

    instance.destroyed =
      true;
    instance.running =
      false;

    if (instance.raf) {
      cancelAnimationFrame(instance.raf);
      instance.raf =
        0;
    }

    unbindSubscriptions(instance);

    if (
      instance.onSemanticControlClick &&
      instance.context &&
      instance.context.semanticControl
    ) {
      instance.context.semanticControl.removeEventListener(
        "click",
        instance.onSemanticControlClick
      );
      instance.onSemanticControlClick =
        null;
    }

    destroyGpuResources(instance);

    if (
      instance.canvas &&
      instance.canvas.parentNode
    ) {
      instance.canvas.parentNode.removeChild(
        instance.canvas
      );
    }

    restoreStaticFallback(instance);

    INSTANCES.delete(instance.id);

    publishReceipt({
      status:
        INSTANCES.size > 0
          ? "available"
          : "disposed",
      mountedInstanceCount:
        INSTANCES.size,
      lastInstanceId:
        instance.id
    });
  }

  function resize(instance) {
    const rect =
      instance.canvas.getBoundingClientRect();

    const lowPower =
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 4;

    const cap =
      lowPower
        ? QUALITY.lowPowerDevicePixelRatioCap
        : QUALITY.normalDevicePixelRatioCap;

    const pixelRatio =
      Math.min(
        globalThis.devicePixelRatio || 1,
        cap
      );

    const width =
      Math.max(
        1,
        Math.floor(rect.width * pixelRatio)
      );

    const height =
      Math.max(
        1,
        Math.floor(rect.height * pixelRatio)
      );

    if (
      instance.canvas.width !== width ||
      instance.canvas.height !== height
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

  function applyHeldPresentation(instance) {
    const held =
      instance.heldState;
    const fallback =
      instance.context.fallback;

    if (
      held.active &&
      held.variant === HELD_VARIANTS.STATIC_FALLBACK
    ) {
      instance.canvas.style.opacity =
        "0";
      fallback.hidden =
        false;
      fallback.style.display =
        "";
      fallback.dataset.upstreamCompassFallbackVisible =
        "true";
      return;
    }

    fallback.hidden =
      true;
    fallback.style.display =
      "none";
    fallback.dataset.upstreamCompassFallbackVisible =
      "false";

    if (
      instance.gl &&
      !instance.renderFailureEmitted
    ) {
      instance.canvas.style.opacity =
        "1";
    }
  }

  function applyMaterial(instance, material, baseColor, haloPass) {
    const gl =
      instance.gl;

    gl.uniform3f(
      instance.uniforms.baseColor,
      baseColor[0],
      baseColor[1],
      baseColor[2]
    );

    gl.uniform3f(
      instance.uniforms.ambientColor,
      0.10,
      0.12,
      0.16
    );

    gl.uniform3f(
      instance.uniforms.keyLight,
      -0.38,
      -0.86,
      -0.60
    );

    gl.uniform3f(
      instance.uniforms.fillLight,
      0.70,
      -0.22,
      -0.46
    );

    gl.uniform3f(
      instance.uniforms.rimLight,
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

    gl.uniform1f(
      instance.uniforms.haloStrength,
      haloPass
        ? (instance.cssWidth <= QUALITY.bloomDisableWidthPx ? 0 : 0.86)
        : 0
    );
  }

  function componentBaseColor(materialKey) {
    switch (materialKey) {
      case "OUTER_RING":
        return [0.78, 0.80, 0.84];

      case "INNER_RING":
        return [0.46, 0.50, 0.56];

      case "NORTH_NEEDLE":
        return [0.90, 0.88, 0.78];

      case "CENTRAL_HUB":
        return [0.30, 0.34, 0.40];

      default:
        return [0.62, 0.66, 0.72];
    }
  }

  function drawGpuMesh(instance, gpuMesh, modelMatrix, haloPass) {
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

    gl.uniformMatrix4fv(
      instance.uniforms.model,
      false,
      new Float32Array(modelMatrix)
    );

    gl.uniformMatrix4fv(
      instance.uniforms.view,
      false,
      new Float32Array(instance.view)
    );

    gl.uniformMatrix4fv(
      instance.uniforms.projection,
      false,
      new Float32Array(instance.projection)
    );

    gl.uniformMatrix3fv(
      instance.uniforms.normalMatrix,
      false,
      new Float32Array(
        normalMatrix3(modelMatrix)
      )
    );

    gl.uniform1f(
      instance.uniforms.haloPass,
      haloPass ? 1 : 0
    );

    gl.uniform1f(
      instance.uniforms.haloExpansion,
      QUALITY.haloExpansion
    );

    applyMaterial(
      instance,
      gpuMesh.material,
      componentBaseColor(gpuMesh.material === MATERIALS.OUTER_RING ? "OUTER_RING" :
        gpuMesh.material === MATERIALS.INNER_RING ? "INNER_RING" :
        gpuMesh.material === MATERIALS.NORTH_NEEDLE ? "NORTH_NEEDLE" :
        gpuMesh.material === MATERIALS.CENTRAL_HUB ? "CENTRAL_HUB" :
        "PRINCIPAL_DIRECTION"
      ),
      haloPass
    );

    gl.drawElements(
      gl.TRIANGLES,
      gpuMesh.indexCount,
      gpuMesh.indexType,
      0
    );
  }

  function currentModelMatrix(instance) {
    const hoverScale =
      instance.hoverActive &&
      !instance.reducedMotion
        ? QUALITY.hoverScale
        : 1;

    const scale =
      [
        instance.scale[0] * hoverScale,
        instance.scale[1] * hoverScale,
        instance.scale[2] * hoverScale
      ];

    const axialQuaternion =
      quaternionFromAxisAngle(
        [0, 0, 1],
        instance.axialAngle
      );

    const effectiveQuaternion =
      quaternionMultiply(
        instance.quaternion,
        axialQuaternion
      );

    const x =
      effectiveQuaternion[0];
    const y =
      effectiveQuaternion[1];
    const z =
      effectiveQuaternion[2];
    const w =
      effectiveQuaternion[3];

    const rotation = [
      1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w), 0,
      2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w), 0,
      2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y), 0,
      0, 0, 0, 1
    ];

    return multiply4(
      translate4(
        instance.fixedPosition[0],
        instance.fixedPosition[1],
        instance.fixedPosition[2]
      ),
      multiply4(
        rotation,
        scale4(
          scale[0],
          scale[1],
          scale[2]
        )
      )
    );
  }

  function updateMotion(instance, deltaSeconds) {
    if (instance.reducedMotion) {
      instance.axialAngle =
        0;
      instance.targetAxialAngle =
        0;
      instance.settleActive =
        false;
      return;
    }

    if (instance.settleActive) {
      const settleAmount =
        clamp(
          deltaSeconds / QUALITY.releaseSettleSeconds,
          0,
          1
        );

      instance.targetAxialAngle =
        0;

      instance.axialAngle =
        instance.axialAngle +
        (instance.targetAxialAngle - instance.axialAngle) *
          Math.min(1, settleAmount * QUALITY.settleSpeed);

      if (
        Math.abs(instance.axialAngle) < 1e-4
      ) {
        instance.axialAngle =
          0;
        instance.targetAxialAngle =
          0;
        instance.settleActive =
          false;
      }

      return;
    }

    instance.axialAngle =
      instance.axialAngle +
      (instance.targetAxialAngle - instance.axialAngle) *
        Math.min(1, deltaSeconds * QUALITY.settleSpeed);
  }

  function renderFrame(instance, timeMs) {
    if (
      !instance.running ||
      instance.destroyed
    ) {
      return;
    }

    const seconds =
      timeMs * 0.001;

    const deltaSeconds =
      instance.lastTime
        ? Math.min(0.05, seconds - instance.lastTime)
        : 0.016;

    instance.lastTime =
      seconds;
    instance.time =
      seconds;

    if (typeof instance.context.getReducedMotion === "function") {
      setReducedMotion(
        instance,
        instance.context.getReducedMotion() === true
      );
    }

    if (typeof instance.context.getHeldState === "function") {
      setHeldState(
        instance,
        instance.context.getHeldState()
      );
    }

    applyHeldPresentation(instance);
    resize(instance);
    updateMotion(instance, deltaSeconds);

    const aspect =
      instance.width / Math.max(1, instance.height);

    instance.view =
      lookAt4(
        [0, 0, 5.4],
        [0, 0, 0],
        [0, 1, 0]
      );

    instance.projection =
      perspective4(
        aspect < QUALITY.mobileAspectThreshold
          ? QUALITY.mobileFieldOfViewRadians
          : QUALITY.defaultFieldOfViewRadians,
        aspect,
        0.1,
        40
      );

    const gl =
      instance.gl;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    if (instance.heldState.active) {
      instance.raf =
        requestAnimationFrame(
          (nextTime) =>
            renderFrame(instance, nextTime)
        );
      return;
    }

    gl.useProgram(instance.program);

    const modelMatrix =
      currentModelMatrix(instance);

    if (
      instance.cssWidth > QUALITY.bloomDisableWidthPx
    ) {
      gl.depthMask(false);
      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE
      );

      instance.gpuMeshes.forEach(
        (gpuMesh) => {
          drawGpuMesh(
            instance,
            gpuMesh,
            modelMatrix,
            true
          );
        }
      );

      gl.depthMask(true);
      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );
    }

    instance.gpuMeshes.forEach(
      (gpuMesh) => {
        drawGpuMesh(
          instance,
          gpuMesh,
          modelMatrix,
          false
        );
      }
    );

    const error =
      gl.getError();

    if (error !== gl.NO_ERROR) {
      restoreStaticFallback(instance);
      instance.canvas.style.opacity =
        "0";

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

    publishReceipt({
      status:
        "available",
      rendererInitialized:
        true,
      lastInstanceId:
        instance.id,
      lastHeldVariant:
        instance.heldState.variant,
      lastReducedMotion:
        instance.reducedMotion,
      lastMountPageNodeId:
        instance.context.pageNodeId,
      lastParentRoute:
        instance.context.parentRoute
    });

    instance.raf =
      requestAnimationFrame(
        (nextTime) =>
          renderFrame(instance, nextTime)
      );
  }

  function start(instanceId) {
    const instance =
      INSTANCES.get(instanceId);

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    if (instance.running) {
      return true;
    }

    instance.running =
      true;
    instance.lastTime =
      0;
    instance.raf =
      requestAnimationFrame(
        (timeMs) =>
          renderFrame(instance, timeMs)
      );

    return true;
  }

  function stop(instanceId) {
    const instance =
      INSTANCES.get(instanceId);

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    instance.running =
      false;

    if (instance.raf) {
      cancelAnimationFrame(instance.raf);
      instance.raf =
        0;
    }

    return true;
  }

  function syncHeldState(instanceId, heldState) {
    const instance =
      INSTANCES.get(instanceId);

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    setHeldState(
      instance,
      heldState
    );
    applyHeldPresentation(instance);

    return true;
  }

  function syncReducedMotion(instanceId, active) {
    const instance =
      INSTANCES.get(instanceId);

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    setReducedMotion(
      instance,
      active === true
    );

    return true;
  }

  function setHover(instanceId, active) {
    const instance =
      INSTANCES.get(instanceId);

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    instance.hoverActive =
      active === true;

    return true;
  }

  function mount(pageContext) {
    const context =
      normalizeContext(pageContext);

    const instance =
      createInstance(context);

    try {
      replaceFallbackContent(instance);
      initializeGL(instance);
      subscribeContextSignals(instance);
      applyHeldPresentation(instance);

      INSTANCES.set(
        instance.id,
        instance
      );

      start(instance.id);

      publishReceipt({
        status:
          "available",
        rendererInitialized:
          true,
        lastInstanceId:
          instance.id,
        lastMountPageNodeId:
          context.pageNodeId,
        lastParentRoute:
          context.parentRoute,
        lastHeldVariant:
          instance.heldState.variant,
        lastReducedMotion:
          instance.reducedMotion
      });

      return Object.freeze({
        instanceId:
          instance.id,

        destroy: () => {
          destroyInstance(instance);
          return true;
        },

        stop: () =>
          stop(instance.id),

        start: () =>
          start(instance.id),

        syncHeldState: (heldState) =>
          syncHeldState(
            instance.id,
            heldState
          ),

        syncReducedMotion: (active) =>
          syncReducedMotion(
            instance.id,
            active
          ),

        setHover: (active) =>
          setHover(
            instance.id,
            active
          )
      });
    } catch (error) {
      restoreStaticFallback(instance);
      unbindSubscriptions(instance);

      if (
        instance.onSemanticControlClick &&
        instance.context &&
        instance.context.semanticControl
      ) {
        instance.context.semanticControl.removeEventListener(
          "click",
          instance.onSemanticControlClick
        );
        instance.onSemanticControlClick =
          null;
      }

      destroyGpuResources(instance);

      if (
        instance.canvas &&
        instance.canvas.parentNode
      ) {
        instance.canvas.parentNode.removeChild(
          instance.canvas
        );
      }

      safeEmitInstanceFailure(
        instance,
        error && error.code
          ? error.code
          : error && error.message
            ? error.message
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

  function getInstanceState(instanceId) {
    const instance =
      INSTANCES.get(instanceId);

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    return Object.freeze({
      instanceId:
        instance.id,
      pageNodeId:
        instance.context.pageNodeId,
      parentNodeId:
        instance.context.parentNodeId,
      parentRoute:
        instance.context.parentRoute,
      reducedMotion:
        instance.reducedMotion,
      heldState:
        instance.heldState,
      axialAngle:
        instance.axialAngle,
      targetAxialAngle:
        instance.targetAxialAngle,
      fixedPosition:
        instance.fixedPosition.slice(),
      running:
        instance.running,
      destroyed:
        instance.destroyed
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
    rendererInitialized:
      false
  });

  return Object.freeze({
    moduleId:
      MODULE_ID,

    geometryAuthority:
      "DGB_UPSTREAM_COMPASS_GEOMETRY",

    mount,

    start,

    stop,

    syncHeldState,

    syncReducedMotion,

    setHover,

    getInstanceState,

    receipt:
      getReceipt
  });
})();

if (typeof globalThis !== "undefined") {
  globalThis.DGB_UPSTREAM_COMPASS_RENDERER =
    DGB_UPSTREAM_COMPASS_RENDERER;
}

if (
  typeof module !== "undefined" &&
  module.exports
) {
  module.exports =
    DGB_UPSTREAM_COMPASS_RENDERER;
}
