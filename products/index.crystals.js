/* /products/index.crystals.js
   PRODUCTS
   Primary Products star and six-product cluster renderer.

   New-file construction scope:
   - Consume DGB_PRODUCTS_CONTROLLER exactly.
   - Publish DGB_PRODUCTS_CRYSTALS and DGB_PRODUCTS_CRYSTALS_RECEIPT.
   - Render only one primary Products star in PRIMARY_ENTRY and one six-product
     spherical cluster in CLUSTER_OPEN / PRODUCT_SELECTED.
   - Preserve spherical behavior, quaternion-backed orientation, pointer drag,
     pointer capture, preview during drag, settle on release, quick-flick return
     to constellation, click suppression, reduced motion, context loss handling,
     semantic sync, and intentional empty bounded void.
   - Exclude Meet Sean, Nine Summits as runtime stars, ARCHCOIN four-wing
     topology, Mirrorland, Hearth, Jeeves, decorative environmental systems,
     background stars, and orbit-line scenery.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "PRODUCTS_CRYSTALS_COMPASS_RENDERER_ANCHOR_v1",
    sourceContractId:
      "DGB_COMPASS_CRYSTALS_SPHERICAL_CONSTELLATION_AND_CLUSTER_REBUILD_v3",
    continuationAnchorId:
      "ARCHCOIN_CRYSTALS_COMPASS_RENDERER_ANCHOR_v1",
    file: "/products/index.crystals.js",
    releaseId: "products-crystals-compass-renderer-anchor-v1",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const CONTROLLER_SYMBOL = "DGB_PRODUCTS_CONTROLLER";
  const RENDERER_SYMBOL = "DGB_PRODUCTS_CRYSTALS";
  const RECEIPT_SYMBOL = "DGB_PRODUCTS_CRYSTALS_RECEIPT";
  const FAILURE_EVENT = "PRODUCTS_CRYSTALS_RENDER_FAILURE";

  const NODE_TYPES = Object.freeze({
    PRIMARY: "primary",
    PRODUCT: "product"
  });

  const STATES = Object.freeze({
    PRIMARY_ENTRY: "PRIMARY_ENTRY",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    PRODUCT_SELECTED: "PRODUCT_SELECTED",
    HELD: "HELD"
  });

  const POINTER_TERRITORIES = Object.freeze({
    BLOCKED_CONTROL: "BLOCKED_CONTROL",
    RENDERED_PRIMARY: "RENDERED_PRIMARY",
    RENDERED_PRODUCT: "RENDERED_PRODUCT",
    EMPTY_SCENE: "EMPTY_SCENE",
    OUTSIDE_SCENE: "OUTSIDE_SCENE"
  });

  const GESTURE_TYPES = Object.freeze({
    POINTER_DOWN: "pointerdown",
    TAP: "tap",
    EMPTY_TAP: "empty-tap",
    ORBIT_DRAG: "orbit-drag",
    ORBIT_SETTLE: "orbit-settle",
    CLUSTER_DRAG: "cluster-drag",
    CLUSTER_SETTLE: "cluster-settle",
    CLUSTER_FLICK_RETURN: "cluster-flick-return",
    AMBIGUOUS: "ambiguous",
    CANCELLED: "cancelled",
    BLOCKED: "blocked"
  });

  const GESTURE = Object.freeze({
    dragDeadZonePx: 6,
    maximumTapDistancePx: 12,
    minimumDragDistancePx: 8,
    radiansPerViewport: Math.PI * 1.12,
    settleSpeed: 7.2,
    suppressClickMs: 520,
    sampleWindowMs: 140,
    maximumSamples: 18,
    flickMaximumDurationMs: 260,
    flickMinimumDistancePx: 52,
    flickMinimumAverageVelocityPxPerMs: 0.55,
    flickMinimumReleaseVelocityPxPerMs: 0.72,
    flickMinimumDirectionalRatio: 1.28,
    flickMaximumPauseBeforeReleaseMs: 90,
    flickMaximumPathEfficiencyLoss: 0.22
  });

  const SPHERE = Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "UNIT_QUATERNION",

    primaryField: Object.freeze({
      horizontalRadius: 0,
      verticalRadius: 0,
      depthRadius: 0,
      primaryAnchor: Object.freeze([0, 0.80, 0.60]),
      vector: Object.freeze([0, 1, 0])
    }),

    cluster: Object.freeze({
      horizontalRadius: 1.34,
      verticalRadius: 1.12,
      depthRadius: 1.06,
      primaryAnchor: Object.freeze([0, 0.70, 0.714]),
      latitudeAmplitude: 0.50,
      latitudeFrequency: 1.67
    })
  });

  const PRODUCTS = Object.freeze([
    Object.freeze({
      id: "archcoin",
      label: "ARCHCOIN",
      shortLabel: "TRACE",
      route: "/products/archcoin/",
      color: Object.freeze([0.79, 0.84, 1.0])
    }),
    Object.freeze({
      id: "five-flags",
      label: "FIVE FLAGS",
      shortLabel: "SIGNALS",
      route: "/products/five-flags/",
      color: Object.freeze([0.50, 0.90, 0.96])
    }),
    Object.freeze({
      id: "aai",
      label: "AAI",
      shortLabel: "SUPPORT",
      route: "/products/on-your-side-ai/",
      color: Object.freeze([0.72, 0.86, 1.0])
    }),
    Object.freeze({
      id: "education",
      label: "EDUCATION",
      shortLabel: "LEARNING",
      route: "/products/education/",
      color: Object.freeze([0.88, 0.76, 1.0])
    }),
    Object.freeze({
      id: "nutrition",
      label: "NUTRITION",
      shortLabel: "BASELINE",
      route: "/products/nutrition/",
      color: Object.freeze([1.0, 0.76, 0.46])
    }),
    Object.freeze({
      id: "book",
      label: "BOOK",
      shortLabel: "LONG FORM",
      route: "/nine-summits-of-love/",
      color: Object.freeze([0.98, 0.60, 0.44])
    })
  ]);

  const PRODUCT_MAP = new Map(PRODUCTS.map(product => [product.id, product]));

  const PRIMARY_ENTRY = Object.freeze({
    id: "products",
    label: "PRODUCTS",
    shortLabel: "OPEN SIX PRODUCTS",
    color: Object.freeze([0.90, 0.84, 0.72])
  });

  const MATERIALS = Object.freeze({
    PRIMARY_IDLE: Object.freeze({
      specular: 1.26,
      rim: 1.02,
      emissive: 0.17,
      alpha: 0.95,
      sparkle: 0.18,
      halo: 0.68,
      contrast: 1.16
    }),
    PRIMARY_FOCUSED: Object.freeze({
      specular: 1.42,
      rim: 1.16,
      emissive: 0.21,
      alpha: 0.97,
      sparkle: 0.24,
      halo: 0.98,
      contrast: 1.22
    }),
    PRODUCT_IDLE: Object.freeze({
      specular: 1.02,
      rim: 0.88,
      emissive: 0.12,
      alpha: 0.88,
      sparkle: 0.14,
      halo: 0.44,
      contrast: 1.08
    }),
    PRODUCT_PRIMARY: Object.freeze({
      specular: 1.18,
      rim: 1.02,
      emissive: 0.16,
      alpha: 0.92,
      sparkle: 0.18,
      halo: 0.62,
      contrast: 1.14
    }),
    PRODUCT_SELECTED: Object.freeze({
      specular: 1.26,
      rim: 1.10,
      emissive: 0.18,
      alpha: 0.94,
      sparkle: 0.22,
      halo: 0.78,
      contrast: 1.18
    })
  });

  const QUALITY = Object.freeze({
    normalDevicePixelRatioCap: 2,
    lowPowerDevicePixelRatioCap: 1.5,
    mobileAspectThreshold: 0.82,
    bloomDisableWidthPx: 420,
    primarySegments: 8,
    productSegments: 6,
    primaryScale: 1.20,
    focusedPrimaryScale: 1.34,
    productScale: 0.86,
    primaryProductScale: 1.10,
    selectedProductScale: 1.16,
    maxYaw: 0.20,
    maxPitch: 0.13
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    sourceContractId: CONTRACT.sourceContractId,
    continuationAnchorId: CONTRACT.continuationAnchorId,
    status: "pending",
    rendererInitialized: false,
    registryPrimaryCount: 0,
    registryProductCount: 0,
    sphericalPrimaryFieldEnabled: true,
    sphericalProductClusterEnabled: true,
    coordinateSystem: SPHERE.coordinateSystem,
    orientationRepresentation: SPHERE.orientationRepresentation,
    primaryEntryId: PRIMARY_ENTRY.id,
    visualPrimaryProductId: "",
    selectedProductId: "",
    gestureActive: false,
    lastPointerTerritory: "",
    lastGestureType: "",
    lastGestureDistance: 0,
    lastGestureDurationMs: 0,
    lastAverageVelocityPxPerMs: 0,
    lastReleaseVelocityPxPerMs: 0,
    glError: "not-checked",
    visualPassClaimed: false
  };

  const state = {
    root: null,
    scene: null,
    mount: null,
    semanticLayer: null,
    receiptOutput: null,
    canvas: null,
    gl: null,
    program: null,
    attribs: null,
    uniforms: null,
    meshes: new Map(),
    registry: new Map(),
    width: 1,
    height: 1,
    cssWidth: 1,
    cssHeight: 1,
    pixelRatio: 1,
    frame: null,
    orbitQuaternion: [0, 0, 0, 1],
    orbitTargetQuaternion: [0, 0, 0, 1],
    clusterQuaternion: [0, 0, 0, 1],
    clusterTargetQuaternion: [0, 0, 0, 1],
    visualPrimaryProductId: "",
    camera: {
      eye: [0, 0.72, 6.35],
      target: [0, 0, 0],
      nextEye: [0, 0.72, 6.35],
      nextTarget: [0, 0, 0]
    },
    time: 0,
    lastTime: 0,
    raf: 0,
    running: false,
    reducedMotion: false,
    pointer: null,
    suppressClickUntil: 0,
    semanticPointerBlockedUntil: 0
  };

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uNormalMatrix;
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    void main() {
      vec3 pos = aPosition;

      if (uHaloPass > 0.5) {
        pos += normalize(aNormal) * uHaloExpansion;
      }

      vec4 world = uModel * vec4(pos, 1.0);
      vec4 view = uView * world;

      vNormal = normalize(uNormalMatrix * aNormal);
      vColor = aColor;
      vViewPosition = view.xyz;
      vWorldPosition = world.xyz;
      vHaloPass = uHaloPass;

      gl_Position = uProjection * view;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    uniform float uTime;
    uniform float uProminence;
    uniform float uSpecular;
    uniform float uRim;
    uniform float uEmissive;
    uniform float uAlpha;
    uniform float uSparkle;
    uniform float uTwinkle;
    uniform float uContrast;
    uniform float uHaloStrength;
    uniform float uSaturation;

    uniform vec3 uKeyLight;
    uniform vec3 uFillLight;
    uniform vec3 uRimLight;
    uniform vec3 uAmbientColor;

    float hash31(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    }

    void main() {
      vec3 n = normalize(vNormal);
      vec3 viewDir = normalize(-vViewPosition);

      vec3 sourceBase = max(vColor, vec3(0.02));
      float luminance = dot(sourceBase, vec3(0.2126, 0.7152, 0.0722));
      vec3 base = mix(vec3(luminance), sourceBase, clamp(uSaturation, 0.0, 1.0));

      float facingToCamera = dot(n, viewDir);
      float rearSuppression = smoothstep(-0.18, 0.34, facingToCamera);
      float sideRim = pow(1.0 - abs(facingToCamera), 2.4);

      float key = max(dot(n, normalize(-uKeyLight)), 0.0);
      float fill = max(dot(n, normalize(-uFillLight)), 0.0);
      float rear = max(dot(n, normalize(-uRimLight)), 0.0);

      float fresnel = pow(1.0 - max(facingToCamera, 0.0), 2.05);

      float facing = pow(
        max(dot(reflect(normalize(uKeyLight), n), viewDir), 0.0),
        28.0
      );

      float facetBand = pow(
        abs(dot(n, normalize(vec3(0.45, 0.72, 0.53)))),
        5.0
      );

      float sparkleSeed = hash31(floor((n + vWorldPosition) * 18.0));
      float sparklePhase = sin(uTime * 1.85 + sparkleSeed * 6.28318);
      float sparkle = smoothstep(0.74, 1.0, facing + facetBand * 0.34) *
        (0.76 + sparklePhase * 0.24) *
        uSparkle *
        rearSuppression;

      float twinkle = 1.0 + sin(uTime * 0.70 + sparkleSeed * 6.28318) * 0.045 * uTwinkle;

      if (vHaloPass > 0.5) {
        vec3 haloColor = base *
          (0.70 + fresnel * 1.18 + sideRim * 0.42 + rear * 0.24) *
          uHaloStrength *
          twinkle;

        float haloAlpha = clamp(
          (0.040 + fresnel * 0.18 + sideRim * 0.08) *
          uProminence *
          uHaloStrength,
          0.0,
          0.34
        );

        gl_FragColor = vec4(haloColor, haloAlpha);
        return;
      }

      float diffuse = 0.24 + key * 0.82 + fill * 0.30 + rear * 0.14;
      diffuse = mix(
        diffuse,
        pow(diffuse, 0.68),
        clamp(uContrast - 1.0, 0.0, 0.7)
      );

      vec3 lit = base * diffuse * twinkle;
      vec3 spec = vec3(1.0, 0.96, 0.82) * facing * uSpecular * rearSuppression;
      vec3 rim = base * (fresnel * 0.72 + sideRim * 0.38) * uRim;
      vec3 coolRim = vec3(0.68, 0.86, 1.0) *
        (fresnel * 0.22 + sideRim * 0.14) *
        uRim;
      vec3 emissive = base * uEmissive;
      vec3 spark = vec3(1.0, 0.96, 0.78) * sparkle;

      float rearDim = mix(0.62, 1.0, rearSuppression);

      vec3 color = (
        (lit + spec + rim + coolRim + emissive + spark) *
        uProminence +
        uAmbientColor * base * 0.20
      ) * rearDim;

      float alpha = clamp(
        uAlpha * (0.70 + uProminence * 0.30 + fresnel * 0.08),
        0.12,
        1.0
      );

      gl_FragColor = vec4(color, alpha);
    }
  `;

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeProductId(value) {
    const id = String(value || "").trim().toLowerCase();
    return PRODUCT_MAP.has(id) ? id : "";
  }

  function cssEscape(value) {
    const text = String(value || "");
    if (globalThis.CSS && typeof globalThis.CSS.escape === "function") {
      return globalThis.CSS.escape(text);
    }
    return text.replace(/["\\]/g, "\\$&");
  }

  function emitReceipt(extra = {}) {
    Object.assign(RECEIPT, {
      status: RECEIPT.status || "available",
      sphericalPrimaryFieldEnabled: true,
      sphericalProductClusterEnabled: true,
      coordinateSystem: SPHERE.coordinateSystem,
      orientationRepresentation: SPHERE.orientationRepresentation,
      primaryEntryId: PRIMARY_ENTRY.id,
      visualPrimaryProductId: state.visualPrimaryProductId || "",
      selectedProductId:
        state.frame && state.frame.selectedProductId
          ? state.frame.selectedProductId
          : "",
      gestureActive: Boolean(state.pointer && state.pointer.dragging),
      visualPassClaimed: false
    }, extra);

    const serialized = JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.productsCrystalsReceipt = serialized;
      state.root.dataset.productsCrystalsStatus = RECEIPT.status;
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.canvas) {
      state.canvas.dataset.productsCrystalsReceipt = serialized;
      state.canvas.dataset.visualPassClaimed = "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value = serialized;
      state.receiptOutput.textContent = serialized;
      state.receiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis[RECEIPT_SYMBOL] = Object.freeze({
      ...RECEIPT
    });
  }

  function emitFailure(reason) {
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    emitReceipt({
      status: "held",
      rendererInitialized: false,
      glError: String(reason || "UNKNOWN_ERROR")
    });

    globalThis.dispatchEvent(
      new CustomEvent(FAILURE_EVENT, {
        detail: Object.freeze({
          reason: String(reason || "UNKNOWN_ERROR")
        })
      })
    );
  }

  function vectorLength(vector) {
    return Math.hypot(vector[0], vector[1], vector[2]);
  }

  function normalizeVector(vector, fallback = [0, 0, 1]) {
    const length = vectorLength(vector);

    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }

    return [vector[0] / length, vector[1] / length, vector[2] / length];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function quaternionNormalize(value, fallback = [0, 0, 0, 1]) {
    const source =
      Array.isArray(value) || ArrayBuffer.isView(value) ? Array.from(value) : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
    ];

    const length = Math.hypot(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    );

    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }

    return quaternion.map(component => component / length);
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
    return quaternionNormalize(quaternionMultiplyRaw(a, b));
  }

  function quaternionConjugate(quaternion) {
    return [-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3]];
  }

  function quaternionFromAxisAngle(axis, angle) {
    const normalizedAxis = normalizeVector(axis);
    const half = angle * 0.5;
    const sine = Math.sin(half);

    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
  }

  function quaternionRotateVector(quaternion, vector) {
    const q = quaternionNormalize(quaternion);
    const pure = [vector[0], vector[1], vector[2], 0];
    const rotated = quaternionMultiplyRaw(
      quaternionMultiplyRaw(q, pure),
      quaternionConjugate(q)
    );

    return [rotated[0], rotated[1], rotated[2]];
  }

  function quaternionFromUnitVectors(fromVector, toVector) {
    const from = normalizeVector(fromVector);
    const to = normalizeVector(toVector);
    const cosine = clamp(dot(from, to), -1, 1);

    if (cosine > 0.999999) {
      return [0, 0, 0, 1];
    }

    if (cosine < -0.999999) {
      let axis = cross([1, 0, 0], from);

      if (vectorLength(axis) < 1e-6) {
        axis = cross([0, 1, 0], from);
      }

      return quaternionFromAxisAngle(normalizeVector(axis), Math.PI);
    }

    const axis = cross(from, to);
    return quaternionNormalize([axis[0], axis[1], axis[2], 1 + cosine]);
  }

  function quaternionSlerp(fromValue, toValue, amount) {
    const from = quaternionNormalize(fromValue);
    let to = quaternionNormalize(toValue);

    let cosine =
      from[0] * to[0] +
      from[1] * to[1] +
      from[2] * to[2] +
      from[3] * to[3];

    if (cosine < 0) {
      to = [-to[0], -to[1], -to[2], -to[3]];
      cosine = -cosine;
    }

    if (cosine > 0.9995) {
      return quaternionNormalize([
        from[0] + (to[0] - from[0]) * amount,
        from[1] + (to[1] - from[1]) * amount,
        from[2] + (to[2] - from[2]) * amount,
        from[3] + (to[3] - from[3]) * amount
      ]);
    }

    const theta = Math.acos(clamp(cosine, -1, 1));
    const sineTheta = Math.sin(theta);
    const weightFrom = Math.sin((1 - amount) * theta) / sineTheta;
    const weightTo = Math.sin(amount * theta) / sineTheta;

    return quaternionNormalize([
      from[0] * weightFrom + to[0] * weightTo,
      from[1] * weightFrom + to[1] * weightTo,
      from[2] * weightFrom + to[2] * weightTo,
      from[3] * weightFrom + to[3] * weightTo
    ]);
  }

  function orientationQuaternion(orientation, fallback) {
    if (
      orientation &&
      (Array.isArray(orientation.quaternion) ||
        ArrayBuffer.isView(orientation.quaternion))
    ) {
      return quaternionNormalize(orientation.quaternion, fallback);
    }

    return quaternionNormalize(fallback);
  }

  function orbitQuaternionFromFrame(frame) {
    if (frame && frame.orbitOrientation) {
      return orientationQuaternion(frame.orbitOrientation, state.orbitTargetQuaternion);
    }

    const serialized = state.root && state.root.dataset ? state.root.dataset.orbitQuaternion : "";

    if (serialized) {
      try {
        return quaternionNormalize(
          JSON.parse(serialized),
          state.orbitTargetQuaternion
        );
      } catch (_) {}
    }

    return state.orbitTargetQuaternion.slice();
  }

  function clusterQuaternionFromFrame(frame) {
    if (frame && frame.cluster && frame.cluster.orientation) {
      return orientationQuaternion(frame.cluster.orientation, state.clusterTargetQuaternion);
    }

    const serialized = state.root && state.root.dataset ? state.root.dataset.clusterQuaternion : "";

    if (serialized) {
      try {
        return quaternionNormalize(
          JSON.parse(serialized),
          state.clusterTargetQuaternion
        );
      } catch (_) {}
    }

    return state.clusterTargetQuaternion.slice();
  }

  function getControllerFrame() {
    const api = globalThis[CONTROLLER_SYMBOL];

    if (api && typeof api.getFrameState === "function") {
      return api.getFrameState();
    }

    const dataset = state.root && state.root.dataset ? state.root.dataset : {};

    let orbitQuaternion = state.orbitTargetQuaternion.slice();
    if (dataset.orbitQuaternion) {
      try {
        orbitQuaternion = quaternionNormalize(JSON.parse(dataset.orbitQuaternion));
      } catch (_) {}
    }

    let clusterQuaternion = state.clusterTargetQuaternion.slice();
    if (dataset.clusterQuaternion) {
      try {
        clusterQuaternion = quaternionNormalize(JSON.parse(dataset.clusterQuaternion));
      } catch (_) {}
    }

    return Object.freeze({
      state: dataset.productsState || STATES.PRIMARY_ENTRY,
      orbitFocus: dataset.orbitFocus || PRIMARY_ENTRY.id,
      orbitPreviewFocus: dataset.orbitPreviewFocus || PRIMARY_ENTRY.id,
      orbitPhase: dataset.orbitPhase || "COMMITTED",
      orbitGestureActive: dataset.orbitGestureActive === "true",
      orbitOrientation: Object.freeze({
        quaternion: Object.freeze(orbitQuaternion),
        primaryId: PRIMARY_ENTRY.id
      }),
      activeClusterId: dataset.productsActiveCluster || "",
      cluster: dataset.productsActiveCluster
        ? Object.freeze({
            id: dataset.productsActiveCluster,
            productIds: Object.freeze(PRODUCTS.map(product => product.id)),
            primaryProduct: dataset.clusterPrimaryProduct || PRODUCTS[0].id,
            previewPrimaryProduct:
              dataset.clusterPreviewPrimaryProduct || dataset.clusterPrimaryProduct || PRODUCTS[0].id,
            phase: dataset.clusterPhase || "COMMITTED",
            gestureActive: dataset.clusterGestureActive === "true",
            revision: Number(dataset.clusterRevision || 0),
            orientation: Object.freeze({
              quaternion: Object.freeze(clusterQuaternion),
              primaryId:
                dataset.clusterPreviewPrimaryProduct ||
                dataset.clusterPrimaryProduct ||
                PRODUCTS[0].id
            })
          })
        : null,
      selectedProductId: dataset.productsSelectedId || "",
      selectedRoute: dataset.productsSelectedRoute || "",
      reducedMotion: dataset.reducedMotion === "true"
    });
  }

  function createCanvas() {
    const existing = qs("canvas[data-products-crystals-canvas]", state.mount);

    if (existing) {
      return existing;
    }

    const canvas = document.createElement("canvas");
    canvas.dataset.productsCrystalsCanvas = "true";
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";

    state.mount.prepend(canvas);
    return canvas;
  }

  function getGL(canvas) {
    return canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      depth: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false
    });
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader) || "UNKNOWN_SHADER_ERROR";
      gl.deleteShader(shader);
      throw new Error(info);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program) || "UNKNOWN_PROGRAM_LINK_ERROR";
      gl.deleteProgram(program);
      throw new Error(info);
    }

    return program;
  }

  function identity4() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  function multiply4(a, b) {
    const output = new Array(16).fill(0);

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        for (let index = 0; index < 4; index += 1) {
          output[column * 4 + row] +=
            a[index * 4 + row] * b[column * 4 + index];
        }
      }
    }

    return output;
  }

  function translate4(x, y, z) {
    const matrix = identity4();
    matrix[12] = x;
    matrix[13] = y;
    matrix[14] = z;
    return matrix;
  }

  function scale4(x, y, z) {
    const matrix = identity4();
    matrix[0] = x;
    matrix[5] = y;
    matrix[10] = z;
    return matrix;
  }

  function rotateX4(angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);

    return [
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateY4(angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);

    return [
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateZ4(angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);

    return [
      cosine, sine, 0, 0,
      -sine, cosine, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function perspective4(fieldOfView, aspect, near, far) {
    const factor = 1 / Math.tan(fieldOfView / 2);
    const range = 1 / (near - far);

    return [
      factor / aspect, 0, 0, 0,
      0, factor, 0, 0,
      0, 0, (far + near) * range, -1,
      0, 0, 2 * far * near * range, 0
    ];
  }

  function lookAt4(eye, center, up) {
    const z = normalizeVector(subtract(eye, center));
    const x = normalizeVector(cross(up, z));
    const y = cross(z, x);

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
    ];
  }

  function normalMatrix3(model) {
    return [
      model[0], model[1], model[2],
      model[4], model[5], model[6],
      model[8], model[9], model[10]
    ];
  }

  function transformPoint4(matrix, point) {
    return [
      matrix[0] * point[0] + matrix[4] * point[1] + matrix[8] * point[2] + matrix[12] * point[3],
      matrix[1] * point[0] + matrix[5] * point[1] + matrix[9] * point[2] + matrix[13] * point[3],
      matrix[2] * point[0] + matrix[6] * point[1] + matrix[10] * point[2] + matrix[14] * point[3],
      matrix[3] * point[0] + matrix[7] * point[1] + matrix[11] * point[2] + matrix[15] * point[3]
    ];
  }

  function createBuffer(gl, target, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);
    return buffer;
  }

  function createDiamondStarMesh(options = {}) {
    const points = options.points || 8;
    const radius = options.radius || 0.62;
    const inner = options.inner || radius * 0.46;
    const depth = options.depth || 0.42;
    const crown = options.crown || 0.22;
    const color = options.color || PRIMARY_ENTRY.color;
    const warmth = options.warmth || 0;

    const vertices = [];
    const faces = [];

    function add(point) {
      vertices.push(point);
      return vertices.length - 1;
    }

    function face(a, b, c) {
      faces.push([a, b, c]);
    }

    const frontApex = add([0, 0, depth]);
    const rearApex = add([0, 0, -depth]);
    const frontCrown = add([0, 0, depth + crown]);
    const rearCrown = add([0, 0, -depth - crown * 0.72]);

    const outer = [];
    const innerRing = [];
    const frontBevel = [];
    const rearBevel = [];

    for (let index = 0; index < points * 2; index += 1) {
      const isPoint = index % 2 === 0;
      const angle = (Math.PI * 2 * index) / (points * 2) - Math.PI / 2;
      const activeRadius = isPoint ? radius : inner;
      const yScale = 0.78;
      const ridge = isPoint ? 0.05 : -0.02;

      outer.push(add([
        Math.cos(angle) * activeRadius,
        Math.sin(angle) * activeRadius * yScale,
        ridge
      ]));

      innerRing.push(add([
        Math.cos(angle) * activeRadius * 0.38,
        Math.sin(angle) * activeRadius * yScale * 0.38,
        depth * 0.14
      ]));

      frontBevel.push(add([
        Math.cos(angle) * activeRadius * 0.72,
        Math.sin(angle) * activeRadius * yScale * 0.72,
        depth * 0.52
      ]));

      rearBevel.push(add([
        Math.cos(angle) * activeRadius * 0.68,
        Math.sin(angle) * activeRadius * yScale * 0.68,
        -depth * 0.48
      ]));
    }

    const count = outer.length;

    for (let index = 0; index < count; index += 1) {
      const next = (index + 1) % count;

      face(frontApex, innerRing[index], innerRing[next]);
      face(frontCrown, frontBevel[next], frontBevel[index]);
      face(frontBevel[index], outer[index], outer[next]);
      face(frontBevel[index], outer[next], frontBevel[next]);
      face(innerRing[index], frontBevel[index], frontBevel[next]);
      face(innerRing[index], frontBevel[next], innerRing[next]);

      face(rearApex, rearBevel[next], rearBevel[index]);
      face(rearCrown, rearBevel[index], rearBevel[next]);
      face(rearBevel[index], outer[next], outer[index]);
      face(rearBevel[index], rearBevel[next], outer[next]);
    }

    const positions = [];
    const normals = [];
    const colors = [];

    faces.forEach((triangle, faceIndex) => {
      const a = vertices[triangle[0]];
      const b = vertices[triangle[1]];
      const c = vertices[triangle[2]];
      const normal = normalizeVector(cross(subtract(b, a), subtract(c, a)));
      const lift = 0.84 + (faceIndex % 7) * 0.034;
      const sparkleLift = faceIndex % 5 === 0 ? 0.13 : 0;

      [a, b, c].forEach(point => {
        positions.push(point[0], point[1], point[2]);
        normals.push(normal[0], normal[1], normal[2]);
        colors.push(
          Math.min(color[0] * lift + warmth * 0.06 + sparkleLift, 1),
          Math.min(color[1] * lift + warmth * 0.04 + sparkleLift, 1),
          Math.min(color[2] * lift + warmth * 0.02 + sparkleLift, 1)
        );
      });
    });

    return Object.freeze({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      vertexCount: positions.length / 3
    });
  }

  function buildGpuMesh(gl, mesh) {
    return Object.freeze({
      vertexCount: mesh.vertexCount,
      position: createBuffer(gl, gl.ARRAY_BUFFER, mesh.positions),
      normal: createBuffer(gl, gl.ARRAY_BUFFER, mesh.normals),
      color: createBuffer(gl, gl.ARRAY_BUFFER, mesh.colors)
    });
  }

  function buildMeshes(gl) {
    const meshes = new Map();

    meshes.set(
      "primary",
      buildGpuMesh(gl, createDiamondStarMesh({
        points: QUALITY.primarySegments,
        radius: 0.76,
        inner: 0.32,
        depth: 0.44,
        crown: 0.22,
        color: PRIMARY_ENTRY.color,
        warmth: 0.06
      }))
    );

    PRODUCTS.forEach(product => {
      const warm = product.id === "nutrition" || product.id === "book";
      meshes.set(
        `product-${product.id}`,
        buildGpuMesh(gl, createDiamondStarMesh({
          points: QUALITY.productSegments,
          radius: 0.44,
          inner: 0.20,
          depth: 0.25,
          crown: 0.10,
          color: product.color,
          warmth: warm ? 0.08 : 0.02
        }))
      );
    });

    return meshes;
  }

  function clusterBaseVector(index, count) {
    const safeCount = Math.max(1, count);
    const longitude = (Math.PI * 2 * index) / safeCount - Math.PI / 2;
    const latitude =
      Math.sin((index + 0.5) * SPHERE.cluster.latitudeFrequency) *
      SPHERE.cluster.latitudeAmplitude;
    const cosineLatitude = Math.cos(latitude);

    return normalizeVector([
      Math.cos(longitude) * cosineLatitude,
      Math.sin(latitude),
      Math.sin(longitude) * cosineLatitude
    ]);
  }

  function makeNode({
    id,
    type,
    label,
    short,
    color,
    productIndex = 0,
    productCount = 0,
    meshKey,
    material,
    phase = 0
  }) {
    return {
      id,
      type,
      label,
      short,
      color,
      productIndex,
      productCount,
      meshKey,
      baseMaterial: material,
      material,
      phase,
      visible: true,
      sphereVector:
        type === NODE_TYPES.PRIMARY
          ? SPHERE.primaryField.vector.slice()
          : clusterBaseVector(productIndex, productCount),
      depthScore: 0,
      primaryScore: 0,
      transform: {
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        sx: 1,
        sy: 1,
        sz: 1,
        prominence: 1,
        halo: 0,
        rotationSpeed: 0.12,
        float: 0
      },
      target: {
        x: 0,
        y: 0,
        z: -1,
        sx: 0.5,
        sy: 0.5,
        sz: 0.5,
        prominence: 0,
        halo: 0,
        rotationSpeed: 0.06,
        float: 0
      }
    };
  }

  function buildRegistry() {
    const registry = new Map();

    const primarySemantic = qs('[data-products-primary-entry]', state.root);

    if (!primarySemantic) {
      throw new Error("PRODUCTS_PRIMARY_ENTRY_SEMANTIC_NOT_FOUND");
    }

    registry.set(PRIMARY_ENTRY.id, makeNode({
      id: PRIMARY_ENTRY.id,
      type: NODE_TYPES.PRIMARY,
      label: PRIMARY_ENTRY.label,
      short: PRIMARY_ENTRY.shortLabel,
      color: PRIMARY_ENTRY.color,
      meshKey: "primary",
      material: "PRIMARY_IDLE",
      phase: 0.22
    }));

    PRODUCTS.forEach((product, index) => {
      const semantic = qs(
        `[data-products-product][data-product-id="${cssEscape(product.id)}"]`,
        state.root
      );

      if (!semantic) {
        throw new Error(`PRODUCTS_PRODUCT_SEMANTIC_NOT_FOUND:${product.id}`);
      }

      registry.set(product.id, makeNode({
        id: product.id,
        type: NODE_TYPES.PRODUCT,
        label: product.label,
        short: product.shortLabel,
        color: product.color,
        productIndex: index,
        productCount: PRODUCTS.length,
        meshKey: `product-${product.id}`,
        material: "PRODUCT_IDLE",
        phase: index * 0.47 + 0.28
      }));
    });

    const primaryCount = Array.from(registry.values()).filter(
      node => node.type === NODE_TYPES.PRIMARY
    ).length;

    const productCount = Array.from(registry.values()).filter(
      node => node.type === NODE_TYPES.PRODUCT
    ).length;

    if (primaryCount !== 1) {
      throw new Error(`PRODUCTS_PRIMARY_COUNT_INVALID:${primaryCount}`);
    }

    if (productCount !== 6) {
      throw new Error(`PRODUCTS_PRODUCT_COUNT_INVALID:${productCount}`);
    }

    emitReceipt({
      registryPrimaryCount: primaryCount,
      registryProductCount: productCount
    });

    return registry;
  }

  function primaryAnchorVector() {
    return normalizeVector(SPHERE.primaryField.primaryAnchor);
  }

  function clusterAnchorVector() {
    return normalizeVector(SPHERE.cluster.primaryAnchor);
  }

  function rotatedPrimaryUnitVector(quaternion = state.orbitQuaternion) {
    return normalizeVector(
      quaternionRotateVector(quaternion, SPHERE.primaryField.vector)
    );
  }

  function rotatedProductUnitVector(node, quaternion) {
    return normalizeVector(quaternionRotateVector(quaternion, node.sphereVector));
  }

  function nearestPrimaryProduct(quaternion = state.clusterQuaternion) {
    const anchor = clusterAnchorVector();
    let bestProductId = PRODUCTS[0].id;
    let bestScore = -Infinity;

    PRODUCTS.forEach(product => {
      const node = state.registry.get(product.id);
      if (!node) {
        return;
      }

      const vector = rotatedProductUnitVector(node, quaternion);
      const score = dot(vector, anchor);

      if (score > bestScore) {
        bestScore = score;
        bestProductId = product.id;
      }
    });

    return bestProductId;
  }

  function settledClusterQuaternion(productId, currentQuaternion) {
    const node = state.registry.get(productId);

    if (!node || node.type !== NODE_TYPES.PRODUCT) {
      return currentQuaternion.slice();
    }

    const currentVector = rotatedProductUnitVector(node, currentQuaternion);
    const alignment = quaternionFromUnitVectors(currentVector, clusterAnchorVector());

    return quaternionNormalize(quaternionMultiply(alignment, currentQuaternion));
  }

  function sphericalPrimaryPosition() {
    const unit = rotatedPrimaryUnitVector();
    return {
      unit,
      x: unit[0] * 0.24,
      y: unit[1] * 0.48,
      z: unit[2] * 0.24,
      depth: (unit[2] + 1) / 2,
      primary: clamp((dot(unit, primaryAnchorVector()) + 1) / 2, 0, 1)
    };
  }

  function sphericalProductPosition(node, quaternion) {
    const unit = rotatedProductUnitVector(node, quaternion);

    return {
      unit,
      x: unit[0] * SPHERE.cluster.horizontalRadius,
      y: unit[1] * SPHERE.cluster.verticalRadius,
      z: unit[2] * SPHERE.cluster.depthRadius,
      depth: (unit[2] + 1) / 2,
      primary: clamp((dot(unit, clusterAnchorVector()) + 1) / 2, 0, 1)
    };
  }

  function setTarget(node, values) {
    Object.assign(node.target, values);
  }

  function withUniformScale(values, scale) {
    values.sx = scale;
    values.sy = scale;
    values.sz = scale;
    return values;
  }

  function syncQuaternionTargets(deltaTime) {
    const frameOrbitQuaternion = orbitQuaternionFromFrame(state.frame);

    if (state.pointer && state.pointer.dragging && state.pointer.gestureScope === "orbit") {
      state.orbitTargetQuaternion = state.pointer.currentQuaternion.slice();
      state.orbitQuaternion = state.pointer.currentQuaternion.slice();
    } else {
      state.orbitTargetQuaternion = frameOrbitQuaternion;

      if (state.reducedMotion) {
        state.orbitQuaternion = frameOrbitQuaternion.slice();
      } else {
        state.orbitQuaternion = quaternionSlerp(
          state.orbitQuaternion,
          state.orbitTargetQuaternion,
          Math.min(1, deltaTime * GESTURE.settleSpeed)
        );
      }
    }

    const frameClusterQuaternion = clusterQuaternionFromFrame(state.frame);

    if (state.pointer && state.pointer.dragging && state.pointer.gestureScope === "cluster") {
      state.clusterTargetQuaternion = state.pointer.currentQuaternion.slice();
      state.clusterQuaternion = state.pointer.currentQuaternion.slice();
    } else {
      state.clusterTargetQuaternion = frameClusterQuaternion;

      if (state.reducedMotion) {
        state.clusterQuaternion = frameClusterQuaternion.slice();
      } else {
        state.clusterQuaternion = quaternionSlerp(
          state.clusterQuaternion,
          state.clusterTargetQuaternion,
          Math.min(1, deltaTime * GESTURE.settleSpeed)
        );
      }
    }
  }

  function updateTargets() {
    const frame = state.frame;
    const stateMode = frame.state;

    state.registry.forEach(node => {
      node.visible = false;
      node.material = node.baseMaterial;
      node.depthScore = 0;
      node.primaryScore = 0;

      setTarget(node, {
        x: 0,
        y: 0,
        z: -1,
        sx: 0.5,
        sy: 0.5,
        sz: 0.5,
        prominence: 0,
        halo: 0,
        rotationSpeed: 0.06,
        float: 0
      });
    });

    if (stateMode === STATES.PRIMARY_ENTRY) {
      const primaryNode = state.registry.get(PRIMARY_ENTRY.id);
      const sphere = sphericalPrimaryPosition();

      primaryNode.visible = true;
      primaryNode.depthScore = sphere.depth;
      primaryNode.primaryScore = sphere.primary;
      primaryNode.material = "PRIMARY_FOCUSED";

      const depthScale = 0.84 + sphere.depth * 0.24;
      const ordinaryScale = QUALITY.focusedPrimaryScale * depthScale;
      const prominence = 0.52 + sphere.depth * 0.28 + sphere.primary * 0.28;
      const halo = 0.46 + sphere.depth * 0.34 + sphere.primary * 0.40;

      setTarget(
        primaryNode,
        withUniformScale(
          {
            x: sphere.x,
            y: sphere.y,
            z: sphere.z,
            prominence: clamp(prominence, 0.18, 1.16),
            halo: clamp(halo, 0, 1.28),
            rotationSpeed: 0.14,
            float: 0.010
          },
          ordinaryScale
        )
      );

      state.camera.nextEye = [
        0,
        0.68,
        state.cssWidth / Math.max(1, state.cssHeight) < QUALITY.mobileAspectThreshold
          ? 6.95
          : 5.85
      ];

      state.camera.nextTarget = [0, 0.10, 0.03];
      state.visualPrimaryProductId = "";
      return;
    }

    const primaryProductId = nearestPrimaryProduct(state.clusterQuaternion);
    state.visualPrimaryProductId = primaryProductId;

    PRODUCTS.forEach(product => {
      const node = state.registry.get(product.id);
      const sphere = sphericalProductPosition(node, state.clusterQuaternion);
      const selected = frame.selectedProductId === product.id;
      const primary = primaryProductId === product.id;
      const committedPrimary =
        frame.cluster &&
        frame.cluster.primaryProduct === product.id;

      node.visible = true;
      node.depthScore = sphere.depth;
      node.primaryScore = sphere.primary;
      node.material = selected
        ? "PRODUCT_SELECTED"
        : primary
          ? "PRODUCT_PRIMARY"
          : committedPrimary
            ? "PRODUCT_PRIMARY"
            : "PRODUCT_IDLE";

      const depthScale = 0.70 + sphere.depth * 0.38;
      const primaryLift = primary ? 1.14 : 1;
      const selectedLift = selected ? 1.08 : 1;

      const ordinaryScale =
        (selected
          ? QUALITY.selectedProductScale
          : primary
            ? QUALITY.primaryProductScale
            : QUALITY.productScale) *
        depthScale *
        primaryLift *
        selectedLift;

      const prominence =
        0.30 +
        sphere.depth * 0.48 +
        sphere.primary * 0.28 +
        (selected ? 0.08 : 0);

      const halo =
        0.20 +
        sphere.depth * 0.30 +
        sphere.primary * 0.44 +
        (selected ? 0.18 : 0);

      const rotationSpeed =
        primary || selected ? 0.13 : 0.07 + sphere.depth * 0.04;

      const float =
        primary || selected ? 0.012 : 0.004 + sphere.depth * 0.004;

      setTarget(
        node,
        withUniformScale(
          {
            x: sphere.x,
            y: sphere.y - 0.06,
            z: sphere.z + 0.18,
            prominence: clamp(prominence, 0.10, 1.14),
            halo: clamp(halo, 0, 1.12),
            rotationSpeed,
            float
          },
          ordinaryScale
        )
      );
    });

    state.camera.nextEye = [
      0,
      0.58,
      state.cssWidth / Math.max(1, state.cssHeight) < QUALITY.mobileAspectThreshold
        ? 7.30
        : 5.86
    ];

    state.camera.nextTarget = [0, 0.02, 0.06];
  }

  function lerp(a, b, amount) {
    return a + (b - a) * amount;
  }

  function updateTransforms(deltaTime) {
    const speed = state.reducedMotion ? 1 : Math.min(1, deltaTime * 6.2);

    state.registry.forEach(node => {
      const current = node.transform;
      const target = node.target;

      [
        "x",
        "y",
        "z",
        "sx",
        "sy",
        "sz",
        "prominence",
        "halo",
        "rotationSpeed",
        "float"
      ].forEach(key => {
        current[key] = lerp(current[key], target[key], speed);
      });

      if (state.reducedMotion) {
        current.rx = 0;
        current.ry = 0;
        current.rz = 0;
        return;
      }

      current.rz += deltaTime * current.rotationSpeed;
      current.ry =
        Math.sin(state.time * 0.42 + node.phase) *
        QUALITY.maxYaw *
        Math.max(0.35, current.prominence);

      current.rx =
        Math.sin(state.time * 0.31 + node.phase * 0.73) *
        QUALITY.maxPitch *
        Math.max(0.35, current.prominence);
    });

    for (let index = 0; index < 3; index += 1) {
      state.camera.eye[index] = lerp(
        state.camera.eye[index],
        state.camera.nextEye[index],
        speed
      );

      state.camera.target[index] = lerp(
        state.camera.target[index],
        state.camera.nextTarget[index],
        speed
      );
    }
  }

  function modelMatrix(node, haloPass) {
    const transform = node.transform;

    const floatY = state.reducedMotion
      ? 0
      : Math.sin(state.time * 0.95 + node.productIndex * 0.72 + node.phase) *
        transform.float;

    const haloScale = haloPass ? 1 + transform.halo * 0.10 : 1;

    return multiply4(
      translate4(transform.x, transform.y + floatY, transform.z),
      multiply4(
        rotateZ4(transform.rz),
        multiply4(
          rotateY4(transform.ry),
          multiply4(
            rotateX4(transform.rx),
            scale4(
              transform.sx * haloScale,
              transform.sy * haloScale,
              transform.sz * haloScale
            )
          )
        )
      )
    );
  }

  function projectNode(node) {
    if (!state.view || !state.projection) {
      return null;
    }

    const model = modelMatrix(node, false);
    const mvp = multiply4(state.projection, multiply4(state.view, model));
    const clip = transformPoint4(mvp, [0, 0, 0, 1]);

    if (!clip[3]) {
      return null;
    }

    const x = clip[0] / clip[3];
    const y = clip[1] / clip[3];

    if (x < -1.30 || x > 1.30 || y < -1.30 || y > 1.30) {
      return null;
    }

    return {
      x: ((x + 1) / 2) * state.cssWidth,
      y: ((1 - y) / 2) * state.cssHeight
    };
  }

  function semanticElementForNode(node) {
    if (node.type === NODE_TYPES.PRIMARY) {
      return qs('[data-products-primary-entry]', state.semanticLayer);
    }

    if (node.type === NODE_TYPES.PRODUCT) {
      return qs(
        `[data-products-product][data-product-id="${cssEscape(node.id)}"]`,
        state.semanticLayer
      );
    }

    return null;
  }

  function syncPrimarySemanticNode(node, element, screen) {
    const primaryLabel = element.querySelector("span:first-child");
    const secondaryLabel = element.querySelector("span:last-child");

    if (primaryLabel) {
      primaryLabel.textContent = node.label;
    }

    if (secondaryLabel) {
      secondaryLabel.textContent = node.short;
    }

    const depth = clamp(node.depthScore, 0, 1);
    const scale = 0.72 + depth * 0.16;
    const opacity = clamp(0.34 + depth * 0.42, 0.16, 1);

    element.dataset.selected = "false";
    element.dataset.primary = "true";
    element.dataset.depth = depth.toFixed(4);
    element.setAttribute("aria-current", "true");

    element.style.left = `${screen.x}px`;
    element.style.top = `${screen.y}px`;
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.transform = `translate(-50%, -50%) scale(${scale})`;
    element.style.opacity = String(opacity);
    element.style.pointerEvents = node.transform.prominence >= 0.12 ? "auto" : "none";
    element.setAttribute("aria-hidden", node.transform.prominence >= 0.12 ? "false" : "true");
    element.tabIndex = node.transform.prominence >= 0.12 ? 0 : -1;
    element.style.zIndex = String(24 + Math.round(depth * 80));
  }

  function syncProductSemanticNode(node, element, screen) {
    const primaryLabel = element.querySelector("span:first-child");
    const secondaryLabel = element.querySelector("span:last-child");

    if (primaryLabel) {
      primaryLabel.textContent = node.label;
    }

    if (secondaryLabel) {
      secondaryLabel.textContent = node.short;
    }

    const primary = node.id === state.visualPrimaryProductId;
    const selected = state.frame.selectedProductId === node.id;
    const depth = clamp(node.depthScore, 0, 1);
    const scale = 0.60 + depth * 0.18 + (primary ? 0.14 : 0);
    const opacity = clamp(0.18 + depth * 0.54 + (primary ? 0.18 : 0), 0.10, 1);

    element.dataset.selected = selected ? "true" : "false";
    element.dataset.primary = primary ? "true" : "false";
    element.dataset.depth = depth.toFixed(4);

    if (selected || primary) {
      element.setAttribute("aria-current", "true");
    } else {
      element.removeAttribute("aria-current");
    }

    element.style.left = `${screen.x}px`;
    element.style.top = `${screen.y}px`;
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.transform = `translate(-50%, -50%) scale(${scale})`;
    element.style.opacity = String(opacity);

    const interactive = node.transform.prominence >= 0.12;

    element.style.pointerEvents = interactive ? "auto" : "none";
    element.setAttribute("aria-hidden", interactive ? "false" : "true");
    element.tabIndex = interactive ? 0 : -1;
    element.style.zIndex = String(
      10 + Math.round(depth * 80) + (primary ? 20 : 0)
    );
  }

  function hideSemanticNode(element) {
    element.style.opacity = "0";
    element.style.pointerEvents = "none";
    element.setAttribute("aria-hidden", "true");
    element.tabIndex = -1;
  }

  function syncSemanticNode(node) {
    const element = semanticElementForNode(node);

    if (!element) {
      return;
    }

    const screen =
      node.visible && node.transform.prominence >= 0.08 ? projectNode(node) : null;

    if (!screen) {
      hideSemanticNode(element);
      return;
    }

    if (node.type === NODE_TYPES.PRIMARY) {
      syncPrimarySemanticNode(node, element, screen);
      return;
    }

    syncProductSemanticNode(node, element, screen);
  }

  function syncSemanticObjects() {
    state.registry.forEach(syncSemanticNode);
  }

  function resize() {
    const rect = state.canvas.getBoundingClientRect();

    const lowPower =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    const cap = lowPower
      ? QUALITY.lowPowerDevicePixelRatioCap
      : QUALITY.normalDevicePixelRatioCap;

    const pixelRatio = Math.min(globalThis.devicePixelRatio || 1, cap);

    const width = Math.max(1, Math.floor(rect.width * pixelRatio));
    const height = Math.max(1, Math.floor(rect.height * pixelRatio));

    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.cssWidth = Math.max(1, rect.width);
    state.cssHeight = Math.max(1, rect.height);
    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;

    state.gl.viewport(0, 0, width, height);
  }

  function bindAttrib(gl, buffer, location, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  function applyMaterial(materialName, prominence, haloStrength) {
    const gl = state.gl;
    const material = MATERIALS[materialName] || MATERIALS.PRODUCT_IDLE;
    const bloomDisabled = state.cssWidth <= QUALITY.bloomDisableWidthPx;

    gl.uniform1f(state.uniforms.twinkle, state.reducedMotion ? 0 : 1);
    gl.uniform1f(state.uniforms.sparkle, state.reducedMotion ? 0 : material.sparkle);
    gl.uniform1f(state.uniforms.prominence, prominence);
    gl.uniform1f(state.uniforms.specular, material.specular);
    gl.uniform1f(state.uniforms.rim, material.rim);
    gl.uniform1f(state.uniforms.emissive, material.emissive);
    gl.uniform1f(state.uniforms.alpha, material.alpha);
    gl.uniform1f(state.uniforms.contrast, material.contrast);
    gl.uniform1f(
      state.uniforms.haloStrength,
      bloomDisabled ? 0 : material.halo * haloStrength
    );
    gl.uniform1f(state.uniforms.saturation, 1);
  }

  function drawNode(node, haloPass) {
    if (!node.visible || node.transform.prominence < 0.04) {
      return 0;
    }

    const mesh = state.meshes.get(node.meshKey);

    if (!mesh) {
      return 0;
    }

    const gl = state.gl;

    bindAttrib(gl, mesh.position, state.attribs.position, 3);
    bindAttrib(gl, mesh.normal, state.attribs.normal, 3);
    bindAttrib(gl, mesh.color, state.attribs.color, 3);

    const model = modelMatrix(node, haloPass);

    gl.uniformMatrix4fv(state.uniforms.model, false, new Float32Array(model));
    gl.uniformMatrix4fv(state.uniforms.view, false, new Float32Array(state.view));
    gl.uniformMatrix4fv(
      state.uniforms.projection,
      false,
      new Float32Array(state.projection)
    );
    gl.uniformMatrix3fv(
      state.uniforms.normalMatrix,
      false,
      new Float32Array(normalMatrix3(model))
    );
    gl.uniform1f(state.uniforms.time, state.time);
    gl.uniform1f(state.uniforms.haloPass, haloPass ? 1 : 0);
    gl.uniform1f(state.uniforms.haloExpansion, 0.075);

    applyMaterial(node.material, node.transform.prominence, node.transform.halo);

    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);

    return 1;
  }

  function pointerDistance(pointer, clientX, clientY) {
    return Math.hypot(clientX - pointer.startX, clientY - pointer.startY);
  }

  function addPointerSample(pointer, clientX, clientY, time) {
    pointer.samples.push({ x: clientX, y: clientY, time });

    const minimumTime = time - Math.max(GESTURE.sampleWindowMs * 2, 260);

    pointer.samples = pointer.samples
      .filter(sample => sample.time >= minimumTime)
      .slice(-GESTURE.maximumSamples);
  }

  function gestureMetrics(pointer, endX, endY, endTime) {
    const dx = endX - pointer.startX;
    const dy = endY - pointer.startY;
    const distance = Math.hypot(dx, dy);
    const durationMs = Math.max(1, endTime - pointer.startTime);
    const averageVelocity = distance / durationMs;

    const recentSamples = pointer.samples.filter(
      sample => sample.time >= endTime - GESTURE.sampleWindowMs
    );

    const releaseStart = recentSamples.length
      ? recentSamples[0]
      : { x: pointer.startX, y: pointer.startY, time: pointer.startTime };

    const releaseDistance = Math.hypot(endX - releaseStart.x, endY - releaseStart.y);
    const releaseDuration = Math.max(1, endTime - releaseStart.time);
    const releaseVelocity = releaseDistance / releaseDuration;

    let pathLength = 0;
    let previous = { x: pointer.startX, y: pointer.startY };

    pointer.samples.forEach(sample => {
      pathLength += Math.hypot(sample.x - previous.x, sample.y - previous.y);
      previous = sample;
    });

    pathLength += Math.hypot(endX - previous.x, endY - previous.y);

    const pathEfficiency = pathLength > 0 ? distance / pathLength : 1;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const directionalRatio =
      Math.max(absX, absY) / Math.max(1, Math.min(absX, absY));

    const lastSample = pointer.samples.length
      ? pointer.samples[pointer.samples.length - 1]
      : null;

    const pauseBeforeRelease = lastSample
      ? Math.max(0, endTime - lastSample.time)
      : durationMs;

    return {
      dx,
      dy,
      distance,
      durationMs,
      averageVelocity,
      releaseVelocity,
      pathLength,
      pathEfficiency,
      directionalRatio,
      pauseBeforeRelease
    };
  }

  function isQuickClusterFlick(metrics) {
    return (
      metrics.durationMs <= GESTURE.flickMaximumDurationMs &&
      metrics.distance >= GESTURE.flickMinimumDistancePx &&
      metrics.averageVelocity >= GESTURE.flickMinimumAverageVelocityPxPerMs &&
      metrics.releaseVelocity >= GESTURE.flickMinimumReleaseVelocityPxPerMs &&
      metrics.directionalRatio >= GESTURE.flickMinimumDirectionalRatio &&
      metrics.pauseBeforeRelease <= GESTURE.flickMaximumPauseBeforeReleaseMs &&
      1 - metrics.pathEfficiency <= GESTURE.flickMaximumPathEfficiencyLoss
    );
  }

  function findHitAtClientPoint(clientX, clientY, allowedTypes = null) {
    const rect = state.scene.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const baseRadius = Math.max(42, Math.min(82, rect.width * 0.092));

    let best = null;
    let bestScore = Infinity;

    state.registry.forEach(node => {
      if (allowedTypes && !allowedTypes.includes(node.type)) {
        return;
      }

      if (!node.visible || node.transform.prominence < 0.10) {
        return;
      }

      const screen = projectNode(node);

      if (!screen) {
        return;
      }

      const depthBonus = node.depthScore * 16;
      const radius = baseRadius + depthBonus;
      const distance = Math.hypot(x - screen.x, y - screen.y);

      if (distance > radius) {
        return;
      }

      const depthPenalty = (1 - node.depthScore) * 12;
      const score = distance + depthPenalty;

      if (score < bestScore) {
        best = node;
        bestScore = score;
      }
    });

    return best;
  }

  function blockedSemanticControl(target) {
    if (!target || !target.closest) {
      return null;
    }

    return target.closest([
      "[data-products-enter]",
      "[data-products-return-to-orbit]",
      "[data-products-return-to-constellation]",
      "[data-products-preview-panel] a",
      "[data-products-preview-panel] button",
      "summary",
      "input",
      "textarea",
      "select"
    ].join(", "));
  }

  function classifyPointerTerritory(event) {
    const rect = state.scene.getBoundingClientRect();

    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      return {
        territory: POINTER_TERRITORIES.OUTSIDE_SCENE,
        nodeId: ""
      };
    }

    if (blockedSemanticControl(event.target)) {
      return {
        territory: POINTER_TERRITORIES.BLOCKED_CONTROL,
        nodeId: ""
      };
    }

    const semanticPrimary =
      event.target && event.target.closest
        ? event.target.closest("[data-products-primary-entry]")
        : null;

    if (semanticPrimary) {
      return {
        territory: POINTER_TERRITORIES.RENDERED_PRIMARY,
        nodeId: PRIMARY_ENTRY.id
      };
    }

    const semanticProduct =
      event.target && event.target.closest
        ? event.target.closest("[data-products-product]")
        : null;

    if (semanticProduct) {
      return {
        territory: POINTER_TERRITORIES.RENDERED_PRODUCT,
        nodeId: normalizeProductId(
          semanticProduct.dataset.productId ||
            semanticProduct.dataset.destinationId ||
            ""
        )
      };
    }

    const primaryHit = findHitAtClientPoint(event.clientX, event.clientY, [
      NODE_TYPES.PRIMARY
    ]);

    if (primaryHit) {
      return {
        territory: POINTER_TERRITORIES.RENDERED_PRIMARY,
        nodeId: primaryHit.id
      };
    }

    const productHit = findHitAtClientPoint(event.clientX, event.clientY, [
      NODE_TYPES.PRODUCT
    ]);

    if (productHit) {
      return {
        territory: POINTER_TERRITORIES.RENDERED_PRODUCT,
        nodeId: productHit.id
      };
    }

    return {
      territory: POINTER_TERRITORIES.EMPTY_SCENE,
      nodeId: ""
    };
  }

  function requestControllerOrbitBegin(pointer) {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.beginOrbitGesture === "function" &&
      api.beginOrbitGesture({
        quaternion: pointer.startQuaternion,
        primaryProductsId: PRIMARY_ENTRY.id,
        source: "products-crystals-pointer"
      }) !== false
    );
  }

  function requestControllerOrbitPreview(quaternion) {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.requestOrbitPreview === "function" &&
      api.requestOrbitPreview({
        quaternion,
        primaryProductsId: PRIMARY_ENTRY.id,
        source: "products-crystals-drag"
      }) !== false
    );
  }

  function requestControllerOrbitCommit(quaternion) {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.requestOrbitCommit === "function" &&
      api.requestOrbitCommit({
        quaternion,
        primaryProductsId: PRIMARY_ENTRY.id,
        source: "products-crystals-release-snap"
      }) !== false
    );
  }

  function requestControllerOrbitCancel(reason) {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.requestOrbitCancel === "function" &&
      api.requestOrbitCancel(reason) !== false
    );
  }

  function requestControllerClusterBegin(pointer) {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.beginClusterGesture === "function" &&
      api.beginClusterGesture({
        quaternion: pointer.startQuaternion,
        primaryProductId: state.visualPrimaryProductId || PRODUCTS[0].id,
        source: "products-crystals-cluster-pointer"
      }) !== false
    );
  }

  function requestControllerClusterPreview(quaternion, primaryProductId) {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.requestClusterPreview === "function" &&
      api.requestClusterPreview({
        quaternion,
        primaryProductId,
        source: "products-crystals-cluster-drag"
      }) !== false
    );
  }

  function requestControllerClusterCommit(quaternion, primaryProductId) {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.requestClusterCommit === "function" &&
      api.requestClusterCommit({
        quaternion,
        primaryProductId,
        source: "products-crystals-cluster-release-snap"
      }) !== false
    );
  }

  function requestControllerClusterCancel(reason) {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.requestClusterCancel === "function" &&
      api.requestClusterCancel(reason) !== false
    );
  }

  function requestControllerReturnToConstellation() {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.requestReturnToConstellation === "function" &&
      api.requestReturnToConstellation({
        source: "cluster-flick",
        scrollToScene: true
      }) !== false
    );
  }

  function requestNodeSelection(node, territory) {
    const api = globalThis[CONTROLLER_SYMBOL];
    let available = false;

    if (
      node.type === NODE_TYPES.PRIMARY &&
      api &&
      typeof api.requestPrimaryProductsSelection === "function"
    ) {
      available = api.requestPrimaryProductsSelection() !== false;
    }

    if (
      node.type === NODE_TYPES.PRODUCT &&
      api &&
      typeof api.requestProductSelection === "function"
    ) {
      available = api.requestProductSelection(node.id) !== false;
    }

    emitReceipt({
      status: available ? "available" : "held",
      lastPointerTerritory: territory,
      lastGestureType: GESTURE_TYPES.TAP,
      glError: available ? "NO_ERROR" : "CONTROLLER_SELECTION_API_UNAVAILABLE"
    });

    return available;
  }

  function dragQuaternionFromPointer(pointer, clientX, clientY) {
    const width = Math.max(1, state.cssWidth);
    const height = Math.max(1, state.cssHeight);

    const dx = clientX - pointer.startX;
    const dy = clientY - pointer.startY;

    const yaw = (dx / width) * GESTURE.radiansPerViewport;
    const pitch = (dy / height) * GESTURE.radiansPerViewport;

    const yawQuaternion = quaternionFromAxisAngle([0, 1, 0], yaw);
    const pitchQuaternion = quaternionFromAxisAngle([1, 0, 0], pitch);

    return quaternionNormalize(
      quaternionMultiply(
        pitchQuaternion,
        quaternionMultiply(yawQuaternion, pointer.startQuaternion)
      )
    );
  }

  function handlePointerDown(event) {
    if (state.pointer) {
      return;
    }

    const classification = classifyPointerTerritory(event);

    if (
      classification.territory === POINTER_TERRITORIES.OUTSIDE_SCENE ||
      classification.territory === POINTER_TERRITORIES.BLOCKED_CONTROL
    ) {
      emitReceipt({
        lastPointerTerritory: classification.territory,
        lastGestureType: GESTURE_TYPES.BLOCKED
      });
      return;
    }

    const frameState = state.frame ? state.frame.state : "";
    const gestureScope =
      frameState === STATES.PRIMARY_ENTRY
        ? "orbit"
        : frameState === STATES.CLUSTER_OPEN || frameState === STATES.PRODUCT_SELECTED
          ? "cluster"
          : "";

    if (!gestureScope) {
      return;
    }

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch (_) {}

    const startQuaternion =
      gestureScope === "orbit"
        ? state.orbitQuaternion.slice()
        : state.clusterQuaternion.slice();

    const now = performance.now();

    state.pointer = {
      id: event.pointerId,
      pointerType: event.pointerType || "unknown",
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startTime: now,
      territory: classification.territory,
      nodeId: classification.nodeId,
      gestureScope,
      dragging: false,
      controllerGestureBegan: false,
      startQuaternion,
      currentQuaternion: startQuaternion.slice(),
      samples: [{
        x: event.clientX,
        y: event.clientY,
        time: now
      }]
    };

    emitReceipt({
      lastPointerTerritory: classification.territory,
      lastGestureType: GESTURE_TYPES.POINTER_DOWN
    });
  }

  function handlePointerMove(event) {
    const pointer = state.pointer;

    if (!pointer || event.pointerId !== pointer.id) {
      return;
    }

    const now = performance.now();

    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;

    addPointerSample(pointer, event.clientX, event.clientY, now);

    const distance = pointerDistance(pointer, event.clientX, event.clientY);

    if (!pointer.dragging && distance < GESTURE.dragDeadZonePx) {
      return;
    }

    if (!pointer.dragging) {
      pointer.dragging = true;

      pointer.controllerGestureBegan =
        pointer.gestureScope === "orbit"
          ? requestControllerOrbitBegin(pointer)
          : requestControllerClusterBegin(pointer);

      state.scene.dataset.productsDragging = "true";
      state.root.dataset.productsDragging = "true";
      state.root.dataset.productsGestureScope = pointer.gestureScope;
    }

    event.preventDefault();

    pointer.currentQuaternion = dragQuaternionFromPointer(
      pointer,
      event.clientX,
      event.clientY
    );

    if (pointer.gestureScope === "orbit") {
      state.orbitQuaternion = pointer.currentQuaternion.slice();
      state.orbitTargetQuaternion = pointer.currentQuaternion.slice();

      requestControllerOrbitPreview(pointer.currentQuaternion);

      emitReceipt({
        status: "available",
        lastPointerTerritory: pointer.territory,
        lastGestureType: GESTURE_TYPES.ORBIT_DRAG,
        lastGestureDistance: distance,
        primaryEntryId: PRIMARY_ENTRY.id,
        gestureActive: true,
        glError: "NO_ERROR"
      });

      return;
    }

    state.clusterQuaternion = pointer.currentQuaternion.slice();
    state.clusterTargetQuaternion = pointer.currentQuaternion.slice();

    const primaryProductId = nearestPrimaryProduct(pointer.currentQuaternion);
    state.visualPrimaryProductId = primaryProductId;

    requestControllerClusterPreview(
      pointer.currentQuaternion,
      primaryProductId
    );

    emitReceipt({
      status: "available",
      lastPointerTerritory: pointer.territory,
      lastGestureType: GESTURE_TYPES.CLUSTER_DRAG,
      lastGestureDistance: distance,
      visualPrimaryProductId: primaryProductId,
      gestureActive: true,
      glError: "NO_ERROR"
    });
  }

  function releasePointerCapture(event) {
    try {
      if (
        event.currentTarget.hasPointerCapture &&
        event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (_) {}
  }

  function finishOrbitDrag(pointer, event, metrics) {
    const currentQuaternion = pointer.currentQuaternion.slice();

    state.orbitTargetQuaternion = currentQuaternion.slice();

    if (state.reducedMotion) {
      state.orbitQuaternion = currentQuaternion.slice();
    }

    const committed = requestControllerOrbitCommit(currentQuaternion);

    state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;
    state.semanticPointerBlockedUntil = state.suppressClickUntil;

    event.preventDefault();

    emitReceipt({
      status: committed ? "available" : "held",
      lastPointerTerritory: pointer.territory,
      lastGestureType: GESTURE_TYPES.ORBIT_SETTLE,
      lastGestureDistance: metrics.distance,
      lastGestureDurationMs: metrics.durationMs,
      lastAverageVelocityPxPerMs: metrics.averageVelocity,
      lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
      primaryEntryId: PRIMARY_ENTRY.id,
      gestureActive: false,
      glError: committed ? "NO_ERROR" : "CONTROLLER_ORBIT_COMMIT_UNAVAILABLE"
    });
  }

  function finishClusterDrag(pointer, event, metrics) {
    if (isQuickClusterFlick(metrics)) {
      requestControllerClusterCancel("cluster-flick-return");

      const returned = requestControllerReturnToConstellation();

      state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;
      state.semanticPointerBlockedUntil = state.suppressClickUntil;

      event.preventDefault();

      emitReceipt({
        status: returned ? "available" : "held",
        lastPointerTerritory: pointer.territory,
        lastGestureType: GESTURE_TYPES.CLUSTER_FLICK_RETURN,
        lastGestureDistance: metrics.distance,
        lastGestureDurationMs: metrics.durationMs,
        lastAverageVelocityPxPerMs: metrics.averageVelocity,
        lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
        gestureActive: false,
        glError: returned ? "NO_ERROR" : "CONTROLLER_RETURN_TO_CONSTELLATION_UNAVAILABLE"
      });

      return;
    }

    const currentQuaternion = pointer.currentQuaternion.slice();
    const primaryProductId = nearestPrimaryProduct(currentQuaternion);
    const settledQuaternion = settledClusterQuaternion(
      primaryProductId,
      currentQuaternion
    );

    state.clusterTargetQuaternion = settledQuaternion.slice();

    if (state.reducedMotion) {
      state.clusterQuaternion = settledQuaternion.slice();
    }

    state.visualPrimaryProductId = primaryProductId;

    const committed = requestControllerClusterCommit(
      settledQuaternion,
      primaryProductId
    );

    state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;
    state.semanticPointerBlockedUntil = state.suppressClickUntil;

    event.preventDefault();

    emitReceipt({
      status: committed ? "available" : "held",
      lastPointerTerritory: pointer.territory,
      lastGestureType: GESTURE_TYPES.CLUSTER_SETTLE,
      lastGestureDistance: metrics.distance,
      lastGestureDurationMs: metrics.durationMs,
      lastAverageVelocityPxPerMs: metrics.averageVelocity,
      lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
      visualPrimaryProductId: primaryProductId,
      gestureActive: false,
      glError: committed ? "NO_ERROR" : "CONTROLLER_CLUSTER_COMMIT_UNAVAILABLE"
    });
  }

  function finishTap(pointer, event, metrics) {
    let node = pointer.nodeId ? state.registry.get(pointer.nodeId) : null;

    if (!node) {
      node = findHitAtClientPoint(event.clientX, event.clientY);
    }

    if (!node) {
      emitReceipt({
        lastPointerTerritory: pointer.territory,
        lastGestureType: GESTURE_TYPES.EMPTY_TAP,
        lastGestureDistance: metrics.distance,
        lastGestureDurationMs: metrics.durationMs
      });
      return;
    }

    const frameState = state.frame ? state.frame.state : "";

    if (node.type === NODE_TYPES.PRIMARY && frameState !== STATES.PRIMARY_ENTRY) {
      return;
    }

    if (
      node.type === NODE_TYPES.PRODUCT &&
      frameState !== STATES.CLUSTER_OPEN &&
      frameState !== STATES.PRODUCT_SELECTED
    ) {
      return;
    }

    state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;
    state.semanticPointerBlockedUntil = state.suppressClickUntil;

    event.preventDefault();
    requestNodeSelection(node, pointer.territory);
  }

  function clearGestureDatasets() {
    state.scene.dataset.productsDragging = "false";
    state.root.dataset.productsDragging = "false";
    state.root.dataset.productsGestureScope = "";
  }

  function handlePointerUp(event) {
    const pointer = state.pointer;

    if (!pointer || event.pointerId !== pointer.id) {
      return;
    }

    const now = performance.now();

    addPointerSample(pointer, event.clientX, event.clientY, now);

    const metrics = gestureMetrics(pointer, event.clientX, event.clientY, now);

    state.pointer = null;

    releasePointerCapture(event);
    clearGestureDatasets();

    if (pointer.dragging && pointer.gestureScope === "orbit") {
      finishOrbitDrag(pointer, event, metrics);
      return;
    }

    if (pointer.dragging && pointer.gestureScope === "cluster") {
      finishClusterDrag(pointer, event, metrics);
      return;
    }

    if (metrics.distance <= GESTURE.maximumTapDistancePx) {
      finishTap(pointer, event, metrics);
      return;
    }

    if (pointer.controllerGestureBegan) {
      if (pointer.gestureScope === "orbit") {
        requestControllerOrbitCancel("ambiguous-release");
      } else {
        requestControllerClusterCancel("ambiguous-release");
      }
    }

    emitReceipt({
      lastPointerTerritory: pointer.territory,
      lastGestureType: GESTURE_TYPES.AMBIGUOUS,
      lastGestureDistance: metrics.distance,
      lastGestureDurationMs: metrics.durationMs,
      lastAverageVelocityPxPerMs: metrics.averageVelocity,
      lastReleaseVelocityPxPerMs: metrics.releaseVelocity,
      gestureActive: false
    });
  }

  function handlePointerCancel(event) {
    const pointer = state.pointer;

    if (!pointer || event.pointerId !== pointer.id) {
      return;
    }

    state.pointer = null;

    releasePointerCapture(event);

    if (pointer.controllerGestureBegan) {
      if (pointer.gestureScope === "orbit") {
        requestControllerOrbitCancel("pointer-cancel");
      } else {
        requestControllerClusterCancel("pointer-cancel");
      }
    }

    if (pointer.gestureScope === "orbit") {
      state.orbitTargetQuaternion = pointer.startQuaternion.slice();
    } else {
      state.clusterTargetQuaternion = pointer.startQuaternion.slice();
    }

    clearGestureDatasets();

    emitReceipt({
      lastPointerTerritory: pointer.territory,
      lastGestureType: GESTURE_TYPES.CANCELLED,
      gestureActive: false
    });
  }

  function handleSceneClickCapture(event) {
    if (performance.now() < state.suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  function bindPointerBridge() {
    state.scene.style.touchAction = "none";
    state.scene.style.overscrollBehavior = "contain";
    state.scene.style.webkitUserSelect = "none";
    state.scene.style.userSelect = "none";

    state.scene.dataset.productsDragging = "false";
    state.root.dataset.productsDragging = "false";
    state.root.dataset.productsGestureScope = "";

    state.scene.addEventListener("pointerdown", handlePointerDown, { passive: false });
    state.scene.addEventListener("pointermove", handlePointerMove, { passive: false });
    state.scene.addEventListener("pointerup", handlePointerUp, { passive: false });
    state.scene.addEventListener("pointercancel", handlePointerCancel, { passive: false });
    state.scene.addEventListener("click", handleSceneClickCapture, true);
  }

  function sortNodesForDraw(nodes) {
    return nodes.sort((a, b) => a.transform.z - b.transform.z);
  }

  function render(now) {
    if (!state.running) {
      return;
    }

    const seconds = now * 0.001;
    const deltaTime = state.lastTime ? Math.min(0.05, seconds - state.lastTime) : 0.016;

    state.lastTime = seconds;
    state.time = seconds;
    state.frame = getControllerFrame();
    state.reducedMotion = Boolean(state.frame.reducedMotion);

    resize();
    syncQuaternionTargets(deltaTime);
    updateTargets();
    updateTransforms(deltaTime);

    const aspect = state.width / Math.max(1, state.height);

    state.view = lookAt4(state.camera.eye, state.camera.target, [0, 1, 0]);
    state.projection = perspective4(
      Math.PI / (aspect < QUALITY.mobileAspectThreshold ? 4.45 : 4.85),
      aspect,
      0.1,
      60
    );

    const gl = state.gl;

    gl.clearColor(0.015, 0.018, 0.034, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    syncSemanticObjects();

    gl.useProgram(state.program);

    gl.uniform3f(state.uniforms.keyLight, -0.42, -0.82, -0.68);
    gl.uniform3f(state.uniforms.fillLight, 0.72, -0.24, -0.54);
    gl.uniform3f(state.uniforms.rimLight, 0.08, 0.46, 1);
    gl.uniform3f(state.uniforms.ambientColor, 0.10, 0.12, 0.18);

    let drawCalls = 0;
    const bloomDisabled = state.cssWidth <= QUALITY.bloomDisableWidthPx;
    const drawNodes = sortNodesForDraw(Array.from(state.registry.values()));

    if (!bloomDisabled) {
      gl.depthMask(false);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      drawNodes.forEach(node => {
        drawCalls += drawNode(node, true);
      });
    }

    gl.depthMask(true);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    drawNodes.forEach(node => {
      drawCalls += drawNode(node, false);
    });

    const error = gl.getError();

    emitReceipt({
      status: error === gl.NO_ERROR ? "available" : "held",
      rendererInitialized: true,
      registryPrimaryCount: 1,
      registryProductCount: 6,
      primaryEntryId: PRIMARY_ENTRY.id,
      visualPrimaryProductId: state.visualPrimaryProductId,
      selectedProductId: state.frame.selectedProductId || "",
      gestureActive: Boolean(state.pointer && state.pointer.dragging),
      glError: error === gl.NO_ERROR ? "NO_ERROR" : String(error),
      drawCallsLastFrame: drawCalls
    });

    state.raf = requestAnimationFrame(render);
  }

  function disposeResources() {
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    if (state.pointer && state.pointer.controllerGestureBegan) {
      if (state.pointer.gestureScope === "orbit") {
        requestControllerOrbitCancel("renderer-dispose");
      } else {
        requestControllerClusterCancel("renderer-dispose");
      }
    }

    state.pointer = null;

    if (state.gl) {
      state.meshes.forEach(mesh => {
        state.gl.deleteBuffer(mesh.position);
        state.gl.deleteBuffer(mesh.normal);
        state.gl.deleteBuffer(mesh.color);
      });

      if (state.program) {
        state.gl.deleteProgram(state.program);
      }
    }

    state.meshes.clear();
    state.registry.clear();

    emitReceipt({
      status: "disposed",
      rendererInitialized: false,
      gestureActive: false
    });
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener("webglcontextlost", event => {
      event.preventDefault();
      emitFailure("WEBGL_CONTEXT_LOST");
    });

    state.canvas.addEventListener("webglcontextrestored", () => {
      emitReceipt({
        status: "held",
        rendererInitialized: false,
        glError: "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED"
      });
    });
  }

  function resolveDom() {
    state.root = qs('[data-page-id="products"]');

    if (!state.root) {
      throw new Error("PRODUCTS_ROOT_NOT_FOUND");
    }

    state.scene = qs("[data-products-scene]", state.root);

    if (!state.scene) {
      throw new Error("PRODUCTS_SCENE_NOT_FOUND");
    }

    state.mount = qs("[data-products-scene]", state.root);

    if (!state.mount) {
      throw new Error("PRODUCTS_RENDER_MOUNT_NOT_FOUND");
    }

    state.semanticLayer = qs("[data-products-semantic]", state.root);

    if (!state.semanticLayer) {
      throw new Error("PRODUCTS_SEMANTIC_LAYER_NOT_FOUND");
    }

    state.receiptOutput = qs("[data-products-crystals-receipt]", state.root);
  }

  function exposeApi() {
    globalThis[RENDERER_SYMBOL] = Object.freeze({
      contract: CONTRACT,
      sphere: SPHERE,
      gesture: GESTURE,

      receipt: () =>
        Object.freeze({
          ...RECEIPT
        }),

      getOrientation: () =>
        Object.freeze({
          orbit: Object.freeze({
            quaternion: Object.freeze(state.orbitQuaternion.slice()),
            targetQuaternion: Object.freeze(state.orbitTargetQuaternion.slice()),
            primaryEntryId: PRIMARY_ENTRY.id
          }),
          cluster: Object.freeze({
            quaternion: Object.freeze(state.clusterQuaternion.slice()),
            targetQuaternion: Object.freeze(state.clusterTargetQuaternion.slice()),
            visualPrimaryProductId: state.visualPrimaryProductId
          }),
          gestureActive: Boolean(state.pointer && state.pointer.dragging)
        }),

      stop: () => {
        state.running = false;

        if (state.raf) {
          cancelAnimationFrame(state.raf);
          state.raf = 0;
        }

        emitReceipt({
          status: "stopped"
        });
      },

      start: () => {
        if (!state.running && state.gl && state.program) {
          state.running = true;
          state.lastTime = 0;
          state.raf = requestAnimationFrame(render);

          emitReceipt({
            status: "available"
          });
        }
      },

      dispose: disposeResources
    });
  }

  function initializeOrientations() {
    state.frame = getControllerFrame();

    const orbitQuaternion = orbitQuaternionFromFrame(state.frame);
    state.orbitQuaternion = orbitQuaternion.slice();
    state.orbitTargetQuaternion = orbitQuaternion.slice();

    const clusterQuaternion = clusterQuaternionFromFrame(state.frame);
    state.clusterQuaternion = clusterQuaternion.slice();
    state.clusterTargetQuaternion = clusterQuaternion.slice();

    state.visualPrimaryProductId =
      state.frame.cluster && state.frame.cluster.primaryProduct
        ? state.frame.cluster.primaryProduct
        : nearestPrimaryProduct(clusterQuaternion);
  }

  function init() {
    try {
      resolveDom();
      exposeApi();

      state.canvas = createCanvas();

      const gl = getGL(state.canvas);

      if (!gl) {
        throw new Error("WEBGL_CONTEXT_UNAVAILABLE");
      }

      state.gl = gl;

      bindContextLifecycle();

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.CULL_FACE);

      state.program = createProgram(gl);

      state.attribs = Object.freeze({
        position: gl.getAttribLocation(state.program, "aPosition"),
        normal: gl.getAttribLocation(state.program, "aNormal"),
        color: gl.getAttribLocation(state.program, "aColor")
      });

      state.uniforms = Object.freeze({
        model: gl.getUniformLocation(state.program, "uModel"),
        view: gl.getUniformLocation(state.program, "uView"),
        projection: gl.getUniformLocation(state.program, "uProjection"),
        normalMatrix: gl.getUniformLocation(state.program, "uNormalMatrix"),
        time: gl.getUniformLocation(state.program, "uTime"),
        prominence: gl.getUniformLocation(state.program, "uProminence"),
        specular: gl.getUniformLocation(state.program, "uSpecular"),
        rim: gl.getUniformLocation(state.program, "uRim"),
        emissive: gl.getUniformLocation(state.program, "uEmissive"),
        alpha: gl.getUniformLocation(state.program, "uAlpha"),
        sparkle: gl.getUniformLocation(state.program, "uSparkle"),
        twinkle: gl.getUniformLocation(state.program, "uTwinkle"),
        contrast: gl.getUniformLocation(state.program, "uContrast"),
        haloStrength: gl.getUniformLocation(state.program, "uHaloStrength"),
        saturation: gl.getUniformLocation(state.program, "uSaturation"),
        haloPass: gl.getUniformLocation(state.program, "uHaloPass"),
        haloExpansion: gl.getUniformLocation(state.program, "uHaloExpansion"),
        keyLight: gl.getUniformLocation(state.program, "uKeyLight"),
        fillLight: gl.getUniformLocation(state.program, "uFillLight"),
        rimLight: gl.getUniformLocation(state.program, "uRimLight"),
        ambientColor: gl.getUniformLocation(state.program, "uAmbientColor")
      });

      state.meshes = buildMeshes(gl);
      state.registry = buildRegistry();
      initializeOrientations();
      bindPointerBridge();

      state.running = true;

      state.root.dataset.sphericalPrimaryFieldEnabled = "true";
      state.root.dataset.sphericalProductClusterEnabled = "true";
      state.root.dataset.productsCoordinateSystem = SPHERE.coordinateSystem;
      state.root.dataset.productsOrientationRepresentation = SPHERE.orientationRepresentation;

      emitReceipt({
        status: "available",
        rendererInitialized: true,
        registryPrimaryCount: 1,
        registryProductCount: 6,
        primaryEntryId: PRIMARY_ENTRY.id,
        visualPrimaryProductId: state.visualPrimaryProductId,
        gestureActive: false,
        glError: "NO_ERROR"
      });

      state.raf = requestAnimationFrame(render);
    } catch (error) {
      emitFailure(
        `PRODUCTS_CRYSTALS_INIT_FAILURE:${
          error && error.message ? error.message : String(error)
        }`
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
