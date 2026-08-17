/* TARGET FILE: /showroom/index.planet.js */
/* COMPLETE REPLACEMENT */
/* GROUP_F_AUDRALIA_PLANETARY_OBJECT_RENEWAL */
/* SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1 */
/* AUDRALIA_GEOMETRY_AUTHORITY_MINIATURE_3D_RENDERER_v1 */
/*
  Purpose:
  - Render the Showroom center planet from the canonical Audralia geometry
    authority as a compact real WebGL 3D object.
  - Preserve the Showroom center object as the Main Compass return selector.
  - Keep the planet visual decorative and non-navigational.
  - Provide the baseline planet module surface contract for downstream HTML/CSS.

  Source geometry authority:
  - /assets/audralia/audralia.planet.js
  - window.DGBAudraliaPlanetGeometry
  - AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1

  Showroom authority:
  - This file exposes window.SHOWROOM_PLANET.
  - The visible planet is decorative.
  - Click / tap authority remains [data-showroom-compass-control].
  - Route authority remains the Showroom controller.
  - The semantic outcome remains Main Compass return selection.

  Does not own:
  - semantic navigation;
  - route decisions;
  - controller state;
  - compositor state;
  - crystal geometry or drawing;
  - pointer or gesture interpretation;
  - Compass adapter, renderer, or geometry;
  - Audralia geometry mutation.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1";

  const MODEL =
    "AUDRALIA_GEOMETRY_AUTHORITY_MINIATURE_3D_RENDERER_v1";

  const AUDRALIA_GEOMETRY_CONTRACT =
    "AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1";

  const OWNER =
    "/showroom/index.planet.js";

  const GLOBAL_NAME =
    "SHOWROOM_PLANET";

  const AUDRALIA_GEOMETRY_GLOBAL =
    "DGBAudraliaPlanetGeometry";

  const EVENTS = Object.freeze({
    ready:
      "SHOWROOM_PLANET_READY",

    failure:
      "SHOWROOM_PLANET_FAILURE",

    disposed:
      "SHOWROOM_PLANET_DISPOSED",

    receipt:
      "SHOWROOM_PLANET_RECEIPT"
  });

  const STATES = Object.freeze({
    mounted:
      "mounted",

    ready:
      "ready",

    waiting:
      "waiting-for-audralia-geometry",

    fallback:
      "fallback",

    paused:
      "paused",

    failed:
      "failed",

    unmounted:
      "unmounted",

    disposed:
      "disposed"
  });

  const ATTRIBUTES = Object.freeze({
    root:
      "data-showroom-planet-root",

    model:
      "data-showroom-planet-model",

    sourceContract:
      "data-showroom-planet-source-contract",

    state:
      "data-showroom-planet-state",

    reducedMotion:
      "data-showroom-planet-reduced-motion",

    decorative:
      "data-showroom-planet-decorative",

    audralia:
      "data-showroom-planet-audralia",

    layer:
      "data-showroom-planet-layer",

    surfaceRole:
      "data-showroom-planet-surface-role",

    renderer:
      "data-showroom-planet-renderer",

    clickAuthority:
      "data-showroom-planet-click-authority",

    navigationAuthority:
      "data-showroom-planet-navigation-authority",

    semanticActivationAuthority:
      "data-showroom-planet-semantic-activation-authority"
  });

  const CLASS_NAMES = Object.freeze({
    root:
      "showroom-planet-root",

    glow:
      "showroom-planet-glow",

    orbitLine:
      "showroom-planet-orbit-line",

    shell:
      "showroom-planet-shell",

    body:
      "showroom-planet-body",

    canvas:
      "showroom-planet-canvas",

    atmosphere:
      "showroom-planet-atmosphere",

    rim:
      "showroom-planet-rim",

    terminator:
      "showroom-planet-terminator",

    shadow:
      "showroom-planet-shadow",

    axis:
      "showroom-planet-axis",

    meridian:
      "showroom-planet-meridian",

    fulcrum:
      "showroom-planet-fulcrum",

    fallback:
      "showroom-planet-fallback"
  });

  const DEFAULTS = Object.freeze({
    terrainLevel:
      4,

    oceanLevel:
      3,

    cloudLevel:
      3,

    atmosphereLevel:
      2,

    maximumDevicePixelRatio:
      2,

    baseCanvasCssPixels:
      256,

    geometryWaitMs:
      2600,

    geometryPollMs:
      80,

    rotationDurationMs:
      76000,

    cloudDurationMs:
      112000,

    pulseDurationMs:
      14000,

    receiptAttribute:
      "data-showroom-planet-receipt",

    reducedMotionQuery:
      "(prefers-reduced-motion: reduce)"
  });

  const MATERIAL_HINT = Object.freeze({
    DEEP_OCEAN:
      0,

    OPEN_OCEAN:
      1,

    SHELF:
      2,

    COAST:
      3,

    BEACH:
      4,

    LOWLAND:
      5,

    FOREST:
      6,

    ARID:
      7,

    UPLAND:
      8,

    ROCK:
      9,

    SNOW:
      10,

    LAKE:
      11,

    INLAND_SEA:
      12
  });

  const WATER_CLASS = Object.freeze({
    NONE:
      0,

    DEEP_OCEAN:
      1,

    OPEN_OCEAN:
      2,

    SHELF_WATER:
      3,

    COASTAL_WATER:
      4,

    INLAND_SEA:
      5,

    LAKE:
      6,

    CHANNEL:
      7,

    RIVER_PATH:
      8
  });

  const COLORS = Object.freeze({
    deepOcean:
      [0.028, 0.09, 0.23],

    openOcean:
      [0.055, 0.24, 0.44],

    shelf:
      [0.11, 0.48, 0.58],

    coastal:
      [0.21, 0.6, 0.63],

    inlandSea:
      [0.12, 0.39, 0.51],

    lake:
      [0.18, 0.52, 0.63],

    beach:
      [0.68, 0.59, 0.38],

    coast:
      [0.5, 0.47, 0.32],

    lowland:
      [0.21, 0.45, 0.29],

    forest:
      [0.11, 0.33, 0.26],

    arid:
      [0.52, 0.44, 0.31],

    upland:
      [0.31, 0.43, 0.34],

    rock:
      [0.41, 0.41, 0.43],

    snow:
      [0.82, 0.88, 0.86],

    cloud:
      [0.9, 0.96, 0.97],

    atmosphere:
      [0.42, 0.85, 1.0]
  });

  const state = {
    target:
      null,

    root:
      null,

    shell:
      null,

    body:
      null,

    canvas:
      null,

    gl:
      null,

    fallback:
      null,

    receiptTarget:
      null,

    geometryAuthority:
      null,

    geometryPacket:
      null,

    terrainMesh:
      null,

    cloudMesh:
      null,

    renderer:
      null,

    lastGeometryHash:
      "",

    mounted:
      false,

    ready:
      false,

    failed:
      false,

    disposed:
      false,

    paused:
      false,

    fallbackMode:
      false,

    waitingForGeometry:
      false,

    reducedMotion:
      false,

    reducedMotionMedia:
      null,

    reducedMotionListener:
      null,

    resizeObserver:
      null,

    resizeListener:
      null,

    frameId:
      0,

    geometryWaitTimer:
      0,

    animationStartedAt:
      0,

    pauseReason:
      "",

    lastReceipt:
      null,

    counters: {
      mounts:
        0,

      unmounts:
        0,

      ready:
        0,

      failures:
        0,

      fallbacks:
        0,

      pauses:
        0,

      resumes:
        0,

      disposals:
        0,

      receipts:
        0,

      geometryAttempts:
        0,

      geometryAccepted:
        0,

      geometryUnavailable:
        0,

      webglContexts:
        0,

      webglFailures:
        0,

      renderFrames:
        0,

      renderSkips:
        0,

      canvasResizes:
        0
    }
  };

  const VERTEX_SHADER_SOURCE = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;

uniform mat4 uProjection;
uniform float uYaw;
uniform float uPitch;
uniform float uScale;
uniform float uDistance;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vWorld;

vec3 rotatePoint(vec3 point) {
  float cy = cos(uYaw);
  float sy = sin(uYaw);
  float cp = cos(uPitch);
  float sp = sin(uPitch);

  vec3 yawed = vec3(
    point.x * cy + point.z * sy,
    point.y,
    -point.x * sy + point.z * cy
  );

  return vec3(
    yawed.x,
    yawed.y * cp - yawed.z * sp,
    yawed.y * sp + yawed.z * cp
  );
}

void main() {
  vec3 world = rotatePoint(aPosition * uScale);
  vec3 normal = normalize(rotatePoint(aNormal));

  world.z = world.z - uDistance;

  vNormal = normal;
  vColor = aColor;
  vWorld = world;

  gl_Position = uProjection * vec4(world, 1.0);
}
`;

  const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

uniform int uMode;
uniform float uAlpha;
uniform float uPulse;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vWorld;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 light = normalize(vec3(-0.18, 0.28, 0.94));
  vec3 view = normalize(vec3(0.0, 0.0, 1.0));

  float diffuse = max(dot(normal, light), 0.0);
  float facing = max(dot(normal, view), 0.0);
  float rim = pow(1.0 - facing, 2.3);

  if (uMode == 1) {
    float alpha = (0.035 + rim * 0.22 + uPulse * 0.018) * uAlpha;
    vec3 color = vec3(0.42, 0.85, 1.0) * (0.78 + rim * 0.28);
    gl_FragColor = vec4(color, alpha);
    return;
  }

  if (uMode == 2) {
    float alpha = (0.035 + diffuse * 0.095 + rim * 0.045) * uAlpha;
    vec3 color = mix(vColor, vec3(1.0), 0.16 + diffuse * 0.12);
    gl_FragColor = vec4(color, alpha);
    return;
  }

  vec3 night = vec3(0.012, 0.025, 0.078);
  vec3 coolDay = vec3(0.74, 0.88, 0.9);
  vec3 lit = vColor * (0.42 + diffuse * 0.7);
  lit = mix(lit, coolDay, pow(diffuse, 2.2) * 0.075);
  lit = mix(lit, vec3(0.5, 0.88, 1.0), rim * 0.085);
  lit = mix(night, lit, 0.94);

  gl_FragColor = vec4(lit, uAlpha);
}
`;

  function normalize(value) {
    return String(
      value == null
        ? ""
        : value
    ).trim();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return (
      typeof Element !== "undefined" &&
      value instanceof Element
    );
  }

  function isCanvas(value) {
    return (
      typeof HTMLCanvasElement !== "undefined" &&
      value instanceof HTMLCanvasElement
    );
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    const numeric =
      Number(value);

    if (!Number.isFinite(numeric)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(
        maximum,
        numeric
      )
    );
  }

  function resolveLevel(
    value,
    fallback
  ) {
    if (
      value == null ||
      value === ""
    ) {
      return fallback;
    }

    return clamp(
      value,
      0,
      6
    );
  }

  function freezePlain(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (ArrayBuffer.isView(value)) {
      return Object.freeze(
        Array.from(value)
      );
    }

    if (Array.isArray(value)) {
      return Object.freeze(
        value.map(freezePlain)
      );
    }

    const output = {};

    for (
      const [
        key,
        entry
      ] of Object.entries(value)
    ) {
      if (typeof entry !== "function") {
        output[key] =
          freezePlain(entry);
      }
    }

    return Object.freeze(output);
  }

  function currentStateName() {
    if (state.disposed) {
      return STATES.disposed;
    }

    if (state.failed) {
      return STATES.failed;
    }

    if (!state.mounted) {
      return STATES.unmounted;
    }

    if (state.paused) {
      return STATES.paused;
    }

    if (state.fallbackMode) {
      return STATES.fallback;
    }

    if (state.waitingForGeometry) {
      return STATES.waiting;
    }

    if (state.ready) {
      return STATES.ready;
    }

    return STATES.mounted;
  }

  function createReceipt(
    event,
    detail = {}
  ) {
    return freezePlain({
      contract:
        CONTRACT,

      model:
        MODEL,

      owner:
        OWNER,

      sourceAuthority:
        "/assets/audralia/audralia.planet.js",

      sourceGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      sourceContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      event,

      timestamp:
        nowIso(),

      state:
        currentStateName(),

      mounted:
        state.mounted,

      ready:
        state.ready,

      failed:
        state.failed,

      disposed:
        state.disposed,

      paused:
        state.paused,

      fallbackMode:
        state.fallbackMode,

      waitingForGeometry:
        state.waitingForGeometry,

      reducedMotion:
        state.reducedMotion,

      targetAvailable:
        Boolean(state.target),

      rootAvailable:
        Boolean(state.root),

      canvasAvailable:
        Boolean(state.canvas),

      webGLAvailable:
        Boolean(state.gl),

      geometryAuthorityAvailable:
        Boolean(state.geometryAuthority),

      geometryPacketAvailable:
        Boolean(state.geometryPacket),

      terrainMeshAvailable:
        Boolean(state.terrainMesh),

      cloudMeshAvailable:
        Boolean(state.cloudMesh),

      geometryHash:
        state.lastGeometryHash ||
        "",

      visualIdentity:
        "mini-audralia",

      rendererMode:
        "webgl-3d",

      navigationMeaning:
        "main-compass-return-selection",

      clickAuthority:
        false,

      clickAuthorityOwner:
        "[data-showroom-compass-control]",

      semanticActivationOwned:
        false,

      navigationAuthority:
        false,

      routeAuthority:
        false,

      controllerDependency:
        false,

      compositorDependency:
        false,

      crystalsDependency:
        false,

      interactionsDependency:
        false,

      gestureDependency:
        false,

      compassAdapterDependency:
        false,

      compassRendererDependency:
        false,

      compassGeometryDependency:
        false,

      audraliaGeometryMutated:
        false,

      decorative:
        true,

      autoMount:
        false,

      webGL:
        Boolean(state.gl),

      canvas2dRenderer:
        false,

      generatedImage:
        false,

      visualPassClaimed:
        false,

      productionAuthorization:
        false,

      deploymentAuthorization:
        false,

      counters: {
        ...state.counters
      },

      ...detail
    });
  }

  function dispatch(
    eventName,
    detail = {}
  ) {
    const payload =
      createReceipt(
        eventName,
        detail
      );

    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function publishReceipt(
    event,
    detail = {}
  ) {
    const payload =
      createReceipt(
        event,
        detail
      );

    state.lastReceipt =
      payload;

    state.counters.receipts +=
      1;

    if (
      state.receiptTarget &&
      isElement(state.receiptTarget)
    ) {
      const serialized =
        JSON.stringify(payload);

      if (
        "value" in
        state.receiptTarget
      ) {
        state.receiptTarget.value =
          serialized;
      }

      state.receiptTarget.textContent =
        serialized;
    }

    window.dispatchEvent(
      new CustomEvent(
        EVENTS.receipt,
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function createLayer(
    className,
    layerName,
    options = {}
  ) {
    const element =
      document.createElement(
        options.tagName ||
        "span"
      );

    element.className =
      className;

    element.setAttribute(
      ATTRIBUTES.layer,
      layerName
    );

    element.setAttribute(
      "aria-hidden",
      "true"
    );

    if (options.surfaceRole) {
      element.setAttribute(
        ATTRIBUTES.surfaceRole,
        options.surfaceRole
      );
    }

    if (options.text != null) {
      element.textContent =
        String(options.text);
    }

    return element;
  }

  function applyAbsoluteFill(element) {
    element.style.position =
      "absolute";

    element.style.inset =
      "0";

    element.style.width =
      "100%";

    element.style.height =
      "100%";

    element.style.pointerEvents =
      "none";
  }

  function createPlanetDom() {
    const root =
      document.createElement("div");

    root.className =
      CLASS_NAMES.root;

    root.setAttribute(
      ATTRIBUTES.root,
      "true"
    );

    root.setAttribute(
      ATTRIBUTES.model,
      MODEL
    );

    root.setAttribute(
      ATTRIBUTES.sourceContract,
      AUDRALIA_GEOMETRY_CONTRACT
    );

    root.setAttribute(
      ATTRIBUTES.state,
      STATES.mounted
    );

    root.setAttribute(
      ATTRIBUTES.reducedMotion,
      state.reducedMotion
        ? "true"
        : "false"
    );

    root.setAttribute(
      ATTRIBUTES.decorative,
      "true"
    );

    root.setAttribute(
      ATTRIBUTES.audralia,
      "true"
    );

    root.setAttribute(
      ATTRIBUTES.renderer,
      "webgl-3d"
    );

    root.setAttribute(
      ATTRIBUTES.clickAuthority,
      "false"
    );

    root.setAttribute(
      ATTRIBUTES.navigationAuthority,
      "false"
    );

    root.setAttribute(
      ATTRIBUTES.semanticActivationAuthority,
      "false"
    );

    root.setAttribute(
      "aria-hidden",
      "true"
    );

    root.setAttribute(
      "role",
      "presentation"
    );

    root.style.setProperty(
      "--showroom-planet-turn",
      "0deg"
    );

    root.style.setProperty(
      "--showroom-planet-cloud-turn",
      "0deg"
    );

    root.style.setProperty(
      "--showroom-planet-pulse",
      "0"
    );

    const glow =
      createLayer(
        CLASS_NAMES.glow,
        "glow",
        {
          surfaceRole:
            "decorative-glow"
        }
      );

    const orbitLine =
      createLayer(
        CLASS_NAMES.orbitLine,
        "orbit-line",
        {
          surfaceRole:
            "decorative-orbit-line"
        }
      );

    const shell =
      createLayer(
        CLASS_NAMES.shell,
        "shell",
        {
          surfaceRole:
            "render-shell"
        }
      );

    const body =
      createLayer(
        CLASS_NAMES.body,
        "body",
        {
          surfaceRole:
            "audralia-render-body"
        }
      );

    const canvas =
      document.createElement("canvas");

    canvas.className =
      CLASS_NAMES.canvas;

    canvas.setAttribute(
      ATTRIBUTES.layer,
      "audralia-webgl-3d-renderer"
    );

    canvas.setAttribute(
      ATTRIBUTES.surfaceRole,
      "audralia-authority-rendered-3d-surface"
    );

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.style.display =
      "block";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.pointerEvents =
      "none";

    canvas.style.borderRadius =
      "50%";

    canvas.style.position =
      "relative";

    canvas.style.zIndex =
      "2";

    const atmosphere =
      createLayer(
        CLASS_NAMES.atmosphere,
        "atmosphere",
        {
          surfaceRole:
            "css-atmospheric-augmentation"
        }
      );

    const rim =
      createLayer(
        CLASS_NAMES.rim,
        "rim",
        {
          surfaceRole:
            "css-atmospheric-rim"
        }
      );

    const terminator =
      createLayer(
        CLASS_NAMES.terminator,
        "terminator",
        {
          surfaceRole:
            "css-terminator-overlay"
        }
      );

    const shadow =
      createLayer(
        CLASS_NAMES.shadow,
        "shadow",
        {
          surfaceRole:
            "css-shadow-limb"
        }
      );

    const meridian =
      createLayer(
        CLASS_NAMES.meridian,
        "meridian",
        {
          surfaceRole:
            "css-meridian"
        }
      );

    const fulcrum =
      createLayer(
        CLASS_NAMES.fulcrum,
        "fulcrum",
        {
          surfaceRole:
            "css-fulcrum"
        }
      );

    const axis =
      createLayer(
        CLASS_NAMES.axis,
        "axis",
        {
          surfaceRole:
            "css-axis"
        }
      );

    const fallback =
      createLayer(
        CLASS_NAMES.fallback,
        "fallback",
        {
          surfaceRole:
            "static-fallback",
          text:
            ""
        }
      );

    applyAbsoluteFill(body);
    applyAbsoluteFill(atmosphere);
    applyAbsoluteFill(rim);
    applyAbsoluteFill(terminator);
    applyAbsoluteFill(shadow);
    applyAbsoluteFill(meridian);
    applyAbsoluteFill(fulcrum);
    applyAbsoluteFill(axis);
    applyAbsoluteFill(fallback);

    body.appendChild(
      canvas
    );

    body.appendChild(
      rim
    );

    body.appendChild(
      terminator
    );

    body.appendChild(
      shadow
    );

    body.appendChild(
      meridian
    );

    body.appendChild(
      fulcrum
    );

    shell.appendChild(
      body
    );

    shell.appendChild(
      axis
    );

    root.appendChild(
      glow
    );

    root.appendChild(
      orbitLine
    );

    root.appendChild(
      shell
    );

    root.appendChild(
      atmosphere
    );

    root.appendChild(
      fallback
    );

    state.shell =
      shell;

    state.body =
      body;

    state.canvas =
      canvas;

    state.fallback =
      fallback;

    return root;
  }

  function resolveReceiptTarget(options) {
    if (
      options &&
      isElement(options.receiptTarget)
    ) {
      return options.receiptTarget;
    }

    if (
      options &&
      typeof options.receiptSelector === "string" &&
      options.receiptSelector.trim()
    ) {
      try {
        const found =
          document.querySelector(
            options.receiptSelector
          );

        return isElement(found)
          ? found
          : null;
      } catch {
        return null;
      }
    }

    if (
      state.target &&
      typeof state.target.querySelector ===
        "function"
    ) {
      try {
        const local =
          state.target.querySelector(
            `[${DEFAULTS.receiptAttribute}]`
          );

        return isElement(local)
          ? local
          : null;
      } catch {
        return null;
      }
    }

    return null;
  }

  function setRootProperty(
    name,
    value
  ) {
    if (!state.root) {
      return;
    }

    state.root.style.setProperty(
      name,
      value
    );
  }

  function applyStateAttribute() {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      ATTRIBUTES.state,
      currentStateName()
    );
  }

  function applyReducedMotionAttribute() {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      ATTRIBUTES.reducedMotion,
      state.reducedMotion
        ? "true"
        : "false"
    );
  }

  function setFallbackText(text) {
    if (!state.fallback) {
      return;
    }

    state.fallback.textContent =
      normalize(text);
  }

  function getAuthorityContract(authority) {
    if (!authority) {
      return "";
    }

    if (
      typeof authority.contract ===
      "string"
    ) {
      return authority.contract;
    }

    if (
      authority.status &&
      typeof authority.status.contract ===
      "string"
    ) {
      return authority.status.contract;
    }

    if (
      typeof authority.getStatus ===
      "function"
    ) {
      try {
        const status =
          authority.getStatus();

        if (
          status &&
          typeof status.contract ===
          "string"
        ) {
          return status.contract;
        }
      } catch {
        return "";
      }
    }

    if (
      typeof authority.getReceiptLight ===
      "function"
    ) {
      try {
        const receipt =
          authority.getReceiptLight();

        if (
          receipt &&
          typeof receipt.contract ===
          "string"
        ) {
          return receipt.contract;
        }
      } catch {
        return "";
      }
    }

    if (
      typeof window.__AUDRALIA_PLANET_GEOMETRY_CONTRACT__ ===
      "string"
    ) {
      return window.__AUDRALIA_PLANET_GEOMETRY_CONTRACT__;
    }

    return "";
  }

  function resolveGeometryAuthority() {
    const authority =
      window[AUDRALIA_GEOMETRY_GLOBAL];

    if (
      !authority ||
      typeof authority !== "object"
    ) {
      return null;
    }

    if (
      getAuthorityContract(authority) !==
      AUDRALIA_GEOMETRY_CONTRACT
    ) {
      return null;
    }

    if (
      typeof authority.createGeometry !==
      "function"
    ) {
      return null;
    }

    return authority;
  }

  function acceptGeometryAuthority(authority) {
    state.geometryAuthority =
      authority;

    return true;
  }

  function createGeometryPacket(options = {}) {
    const authority =
      state.geometryAuthority ||
      resolveGeometryAuthority();

    if (!authority) {
      return null;
    }

    acceptGeometryAuthority(
      authority
    );

    state.counters.geometryAttempts +=
      1;

    const packet =
      authority.createGeometry({
        terrainLevel:
          resolveLevel(
            options.terrainLevel,
            DEFAULTS.terrainLevel
          ),

        oceanLevel:
          resolveLevel(
            options.oceanLevel,
            DEFAULTS.oceanLevel
          ),

        cloudLevel:
          resolveLevel(
            options.cloudLevel,
            DEFAULTS.cloudLevel
          ),

        atmosphereLevel:
          resolveLevel(
            options.atmosphereLevel,
            DEFAULTS.atmosphereLevel
          ),

        includeHydrology:
          false,

        deepValidation:
          false
      });

    if (
      !packet ||
      !packet.terrain ||
      !packet.terrain.positions ||
      !packet.terrain.indices
    ) {
      throw new Error(
        "The Audralia geometry packet is invalid."
      );
    }

    state.geometryPacket =
      packet;

    state.terrainMesh =
      packet.terrain;

    state.cloudMesh =
      packet.clouds ||
      null;

    state.lastGeometryHash =
      normalize(
        packet.geometryHash ||
        packet.terrain.geometryHash ||
        ""
      );

    state.counters.geometryAccepted +=
      1;

    return packet;
  }

  function clearGeometryWaitTimer() {
    if (state.geometryWaitTimer) {
      clearTimeout(
        state.geometryWaitTimer
      );
    }

    state.geometryWaitTimer =
      0;
  }

  function waitForGeometryAuthority(
    startedAt,
    options
  ) {
    if (
      state.disposed ||
      !state.mounted ||
      state.failed
    ) {
      return;
    }

    const authority =
      resolveGeometryAuthority();

    if (authority) {
      try {
        acceptGeometryAuthority(
          authority
        );

        createGeometryPacket(
          options
        );

        state.waitingForGeometry =
          false;

        state.fallbackMode =
          false;

        buildRenderer();

        markReady(
          "audralia-geometry-authority-available"
        );

        return;
      } catch (error) {
        fail(
          "audralia-geometry-packet-failed",
          error
        );

        return;
      }
    }

    const elapsed =
      performance.now() -
      startedAt;

    if (
      elapsed >=
      DEFAULTS.geometryWaitMs
    ) {
      state.counters.geometryUnavailable +=
        1;

      enterFallbackMode(
        "audralia-geometry-authority-unavailable"
      );

      return;
    }

    state.geometryWaitTimer =
      setTimeout(
        () => {
          waitForGeometryAuthority(
            startedAt,
            options
          );
        },
        DEFAULTS.geometryPollMs
      );
  }

  function initializeGeometry(options = {}) {
    const authority =
      resolveGeometryAuthority();

    if (authority) {
      acceptGeometryAuthority(
        authority
      );

      createGeometryPacket(
        options
      );

      return true;
    }

    state.waitingForGeometry =
      true;

    applyStateAttribute();

    publishReceipt(
      "waiting-for-audralia-geometry-authority",
      {
        nonterminal:
          true,

        requiredScript:
          "/assets/audralia/audralia.planet.js",

        requiredGlobal:
          AUDRALIA_GEOMETRY_GLOBAL,

        requiredContract:
          AUDRALIA_GEOMETRY_CONTRACT
      }
    );

    waitForGeometryAuthority(
      performance.now(),
      options
    );

    return false;
  }

  function bindReducedMotion() {
    if (
      typeof window.matchMedia !==
      "function"
    ) {
      state.reducedMotion =
        false;

      return;
    }

    const media =
      window.matchMedia(
        DEFAULTS.reducedMotionQuery
      );

    state.reducedMotionMedia =
      media;

    state.reducedMotion =
      Boolean(media.matches);

    state.reducedMotionListener =
      event => {
        setReducedMotion(
          Boolean(
            event &&
            event.matches
          ),
          "media-query"
        );
      };

    if (
      typeof media.addEventListener ===
      "function"
    ) {
      media.addEventListener(
        "change",
        state.reducedMotionListener
      );
    } else if (
      typeof media.addListener ===
      "function"
    ) {
      media.addListener(
        state.reducedMotionListener
      );
    }
  }

  function unbindReducedMotion() {
    const media =
      state.reducedMotionMedia;

    const listener =
      state.reducedMotionListener;

    if (
      media &&
      listener
    ) {
      try {
        if (
          typeof media.removeEventListener ===
          "function"
        ) {
          media.removeEventListener(
            "change",
            listener
          );
        } else if (
          typeof media.removeListener ===
            "function"
        ) {
          media.removeListener(
            listener
          );
        }
      } catch {
        /* Best-effort listener cleanup. */
      }
    }

    state.reducedMotionMedia =
      null;

    state.reducedMotionListener =
      null;
  }

  function bindResize() {
    unbindResize();

    if (
      state.body &&
      typeof ResizeObserver !==
      "undefined"
    ) {
      state.resizeObserver =
        new ResizeObserver(() => {
          renderStatic();
        });

      state.resizeObserver.observe(
        state.body
      );
    }

    state.resizeListener =
      () => {
        renderStatic();
      };

    window.addEventListener(
      "resize",
      state.resizeListener,
      {
        passive:
          true
      }
    );
  }

  function unbindResize() {
    if (state.resizeObserver) {
      try {
        state.resizeObserver.disconnect();
      } catch {
        /* Best-effort observer cleanup. */
      }
    }

    state.resizeObserver =
      null;

    if (state.resizeListener) {
      try {
        window.removeEventListener(
          "resize",
          state.resizeListener
        );
      } catch {
        /* Best-effort listener cleanup. */
      }
    }

    state.resizeListener =
      null;
  }

  function createWebGLContext(canvas) {
    const attributes = {
      alpha:
        true,

      antialias:
        true,

      depth:
        true,

      stencil:
        false,

      premultipliedAlpha:
        true,

      preserveDrawingBuffer:
        false,

      powerPreference:
        "low-power"
    };

    const gl =
      canvas.getContext(
        "webgl",
        attributes
      ) ||
      canvas.getContext(
        "experimental-webgl",
        attributes
      );

    if (!gl) {
      state.counters.webglFailures +=
        1;

      return null;
    }

    state.counters.webglContexts +=
      1;

    return gl;
  }

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

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
        gl.getShaderInfoLog(shader) ||
        "Shader compilation failed.";

      gl.deleteShader(shader);

      throw new Error(message);
    }

    return shader;
  }

  function createProgram(
    gl,
    vertexSource,
    fragmentSource
  ) {
    const vertexShader =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexSource
      );

    const fragmentShader =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentSource
      );

    const program =
      gl.createProgram();

    gl.attachShader(
      program,
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(
      vertexShader
    );

    gl.deleteShader(
      fragmentShader
    );

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const message =
        gl.getProgramInfoLog(program) ||
        "Program linking failed.";

      gl.deleteProgram(program);

      throw new Error(message);
    }

    return program;
  }

  function materialColor(
    materialHint,
    waterClass
  ) {
    if (
      waterClass === WATER_CLASS.DEEP_OCEAN
    ) {
      return COLORS.deepOcean;
    }

    if (
      waterClass === WATER_CLASS.OPEN_OCEAN
    ) {
      return COLORS.openOcean;
    }

    if (
      waterClass === WATER_CLASS.SHELF_WATER
    ) {
      return COLORS.shelf;
    }

    if (
      waterClass === WATER_CLASS.COASTAL_WATER
    ) {
      return COLORS.coastal;
    }

    if (
      waterClass === WATER_CLASS.LAKE
    ) {
      return COLORS.lake;
    }

    if (
      waterClass === WATER_CLASS.INLAND_SEA
    ) {
      return COLORS.inlandSea;
    }

    switch (materialHint) {
      case MATERIAL_HINT.BEACH:
        return COLORS.beach;

      case MATERIAL_HINT.COAST:
        return COLORS.coast;

      case MATERIAL_HINT.FOREST:
        return COLORS.forest;

      case MATERIAL_HINT.ARID:
        return COLORS.arid;

      case MATERIAL_HINT.UPLAND:
        return COLORS.upland;

      case MATERIAL_HINT.ROCK:
        return COLORS.rock;

      case MATERIAL_HINT.SNOW:
        return COLORS.snow;

      case MATERIAL_HINT.LAKE:
        return COLORS.lake;

      case MATERIAL_HINT.INLAND_SEA:
        return COLORS.inlandSea;

      case MATERIAL_HINT.LOWLAND:
      default:
        return COLORS.lowland;
    }
  }

  function createNormalsFromPositions(positions) {
    const normals =
      new Float32Array(
        positions.length
      );

    for (
      let index = 0;
      index < positions.length;
      index += 3
    ) {
      const x =
        positions[index];

      const y =
        positions[index + 1];

      const z =
        positions[index + 2];

      const length =
        Math.hypot(
          x,
          y,
          z
        ) || 1;

      normals[index] =
        x / length;

      normals[index + 1] =
        y / length;

      normals[index + 2] =
        z / length;
    }

    return normals;
  }

  function createColorsForMesh(mesh) {
    const positions =
      mesh.positions;

    const vertexCount =
      mesh.vertexCount ||
      Math.floor(
        positions.length /
        3
      );

    const colors =
      new Float32Array(
        vertexCount * 3
      );

    const materialHints =
      mesh.materialHints ||
      null;

    const waterClasses =
      mesh.waterClasses ||
      null;

    for (
      let index = 0;
      index < vertexCount;
      index += 1
    ) {
      const materialHint =
        materialHints
          ? Math.round(
              materialHints[index]
            )
          : MATERIAL_HINT.LOWLAND;

      const waterClass =
        waterClasses
          ? Math.round(
              waterClasses[index]
            )
          : WATER_CLASS.NONE;

      const color =
        materialColor(
          materialHint,
          waterClass
        );

      const offset =
        index * 3;

      colors[offset] =
        color[0];

      colors[offset + 1] =
        color[1];

      colors[offset + 2] =
        color[2];
    }

    return colors;
  }

  function createCloudColors(mesh) {
    const positions =
      mesh.positions;

    const vertexCount =
      mesh.vertexCount ||
      Math.floor(
        positions.length /
        3
      );

    const colors =
      new Float32Array(
        vertexCount * 3
      );

    for (
      let index = 0;
      index < vertexCount;
      index += 1
    ) {
      const offset =
        index * 3;

      colors[offset] =
        COLORS.cloud[0];

      colors[offset + 1] =
        COLORS.cloud[1];

      colors[offset + 2] =
        COLORS.cloud[2];
    }

    return colors;
  }

  function normalizeIndexArray(indices) {
    let maximum =
      0;

    for (
      let index = 0;
      index < indices.length;
      index += 1
    ) {
      if (indices[index] > maximum) {
        maximum =
          indices[index];
      }
    }

    if (maximum <= 65535) {
      return {
        array:
          indices instanceof Uint16Array
            ? indices
            : new Uint16Array(indices),

        type:
          "uint16"
      };
    }

    return {
      array:
        indices instanceof Uint32Array
          ? indices
          : new Uint32Array(indices),

      type:
        "uint32"
    };
  }

  function createMeshBuffer(
    gl,
    mesh,
    options = {}
  ) {
    if (
      !mesh ||
      !mesh.positions ||
      !mesh.indices
    ) {
      return null;
    }

    const positions =
      mesh.positions instanceof Float32Array
        ? mesh.positions
        : new Float32Array(mesh.positions);

    const normalsSource =
      mesh.normals ||
      null;

    const normals =
      normalsSource
        ? (
            normalsSource instanceof Float32Array
              ? normalsSource
              : new Float32Array(normalsSource)
          )
        : createNormalsFromPositions(
            positions
          );

    const colors =
      options.cloud
        ? createCloudColors(mesh)
        : createColorsForMesh(mesh);

    const indexData =
      normalizeIndexArray(
        mesh.indices
      );

    if (
      indexData.type === "uint32" &&
      !gl.getExtension("OES_element_index_uint")
    ) {
      throw new Error(
        "The miniature planet mesh requires 32-bit indices, but this WebGL context does not support them."
      );
    }

    const positionBuffer =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      positionBuffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      positions,
      gl.STATIC_DRAW
    );

    const normalBuffer =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      normalBuffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      normals,
      gl.STATIC_DRAW
    );

    const colorBuffer =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      colorBuffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      colors,
      gl.STATIC_DRAW
    );

    const indexBuffer =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      indexBuffer
    );

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      indexData.array,
      gl.STATIC_DRAW
    );

    return {
      positionBuffer,
      normalBuffer,
      colorBuffer,
      indexBuffer,

      indexType:
        indexData.type === "uint32"
          ? gl.UNSIGNED_INT
          : gl.UNSIGNED_SHORT,

      indexCount:
        indexData.array.length,

      vertexCount:
        mesh.vertexCount ||
        Math.floor(
          positions.length /
          3
        ),

      triangleCount:
        mesh.triangleCount ||
        Math.floor(
          indexData.array.length /
          3
        )
    };
  }

  function deleteMeshBuffer(
    gl,
    buffer
  ) {
    if (
      !gl ||
      !buffer
    ) {
      return;
    }

    [
      buffer.positionBuffer,
      buffer.normalBuffer,
      buffer.colorBuffer,
      buffer.indexBuffer
    ].forEach(entry => {
      if (entry) {
        try {
          gl.deleteBuffer(entry);
        } catch {
          /* Best-effort buffer cleanup. */
        }
      }
    });
  }

  function makePerspective(
    fovY,
    aspect,
    near,
    far
  ) {
    const f =
      1 /
      Math.tan(
        fovY / 2
      );

    const range =
      1 /
      (near - far);

    return new Float32Array([
      f / aspect,
      0,
      0,
      0,

      0,
      f,
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
    ]);
  }

  function buildRenderer() {
    if (
      !state.canvas ||
      !state.terrainMesh
    ) {
      return false;
    }

    const gl =
      state.gl ||
      createWebGLContext(
        state.canvas
      );

    if (!gl) {
      throw new Error(
        "WebGL is unavailable for the miniature Audralia planet."
      );
    }

    state.gl =
      gl;

    const program =
      createProgram(
        gl,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE
      );

    const renderer = {
      program,

      attributes: {
        position:
          gl.getAttribLocation(
            program,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            program,
            "aNormal"
          ),

        color:
          gl.getAttribLocation(
            program,
            "aColor"
          )
      },

      uniforms: {
        projection:
          gl.getUniformLocation(
            program,
            "uProjection"
          ),

        yaw:
          gl.getUniformLocation(
            program,
            "uYaw"
          ),

        pitch:
          gl.getUniformLocation(
            program,
            "uPitch"
          ),

        scale:
          gl.getUniformLocation(
            program,
            "uScale"
          ),

        distance:
          gl.getUniformLocation(
            program,
            "uDistance"
          ),

        mode:
          gl.getUniformLocation(
            program,
            "uMode"
          ),

        alpha:
          gl.getUniformLocation(
            program,
            "uAlpha"
          ),

        pulse:
          gl.getUniformLocation(
            program,
            "uPulse"
          )
      },

      terrain:
        createMeshBuffer(
          gl,
          state.terrainMesh
        ),

      cloud:
        state.cloudMesh
          ? createMeshBuffer(
              gl,
              state.cloudMesh,
              {
                cloud:
                  true
              }
            )
          : null
    };

    if (!renderer.terrain) {
      throw new Error(
        "The Audralia terrain mesh could not be converted into WebGL buffers."
      );
    }

    state.renderer =
      renderer;

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

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.clearColor(
      0,
      0,
      0,
      0
    );

    return true;
  }

  function destroyRenderer() {
    const gl =
      state.gl;

    const renderer =
      state.renderer;

    if (
      gl &&
      renderer
    ) {
      deleteMeshBuffer(
        gl,
        renderer.terrain
      );

      deleteMeshBuffer(
        gl,
        renderer.cloud
      );

      if (renderer.program) {
        try {
          gl.deleteProgram(
            renderer.program
          );
        } catch {
          /* Best-effort program cleanup. */
        }
      }
    }

    state.renderer =
      null;
  }

  function ensureCanvasSize() {
    if (
      !state.canvas ||
      !state.gl
    ) {
      return false;
    }

    const rect =
      state.canvas.getBoundingClientRect();

    const cssSize =
      Math.max(
        96,
        Math.round(
          Math.max(
            rect.width,
            rect.height,
            DEFAULTS.baseCanvasCssPixels
          )
        )
      );

    const devicePixelRatio =
      clamp(
        window.devicePixelRatio || 1,
        1,
        DEFAULTS.maximumDevicePixelRatio
      );

    const pixelSize =
      Math.max(
        96,
        Math.round(
          cssSize *
          devicePixelRatio
        )
      );

    if (
      state.canvas.width !== pixelSize ||
      state.canvas.height !== pixelSize
    ) {
      state.canvas.width =
        pixelSize;

      state.canvas.height =
        pixelSize;

      state.gl.viewport(
        0,
        0,
        pixelSize,
        pixelSize
      );

      state.counters.canvasResizes +=
        1;

      return true;
    }

    return false;
  }

  function bindMesh(
    gl,
    renderer,
    mesh
  ) {
    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      mesh.positionBuffer
    );

    gl.enableVertexAttribArray(
      renderer.attributes.position
    );

    gl.vertexAttribPointer(
      renderer.attributes.position,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      mesh.normalBuffer
    );

    gl.enableVertexAttribArray(
      renderer.attributes.normal
    );

    gl.vertexAttribPointer(
      renderer.attributes.normal,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      mesh.colorBuffer
    );

    gl.enableVertexAttribArray(
      renderer.attributes.color
    );

    gl.vertexAttribPointer(
      renderer.attributes.color,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      mesh.indexBuffer
    );
  }

  function drawMesh(
    gl,
    renderer,
    mesh,
    mode,
    alpha,
    scale,
    yaw,
    pitch,
    pulse
  ) {
    if (!mesh) {
      return;
    }

    bindMesh(
      gl,
      renderer,
      mesh
    );

    gl.uniform1i(
      renderer.uniforms.mode,
      mode
    );

    gl.uniform1f(
      renderer.uniforms.alpha,
      alpha
    );

    gl.uniform1f(
      renderer.uniforms.scale,
      scale
    );

    gl.uniform1f(
      renderer.uniforms.yaw,
      yaw
    );

    gl.uniform1f(
      renderer.uniforms.pitch,
      pitch
    );

    gl.uniform1f(
      renderer.uniforms.distance,
      3.15
    );

    gl.uniform1f(
      renderer.uniforms.pulse,
      pulse
    );

    gl.drawElements(
      gl.TRIANGLES,
      mesh.indexCount,
      mesh.indexType,
      0
    );
  }

  function renderFrame(
    turn,
    cloudTurn,
    pulse
  ) {
    const gl =
      state.gl;

    const renderer =
      state.renderer;

    if (
      !gl ||
      !renderer ||
      !renderer.terrain
    ) {
      state.counters.renderSkips +=
        1;

      return false;
    }

    ensureCanvasSize();

    const size =
      state.canvas.width;

    const projection =
      makePerspective(
        Math.PI / 3.16,
        1,
        0.1,
        20
      );

    const yaw =
      turn *
      Math.PI *
      2;

    const pitch =
      -0.24;

    const cloudYaw =
      cloudTurn *
      Math.PI *
      2;

    gl.useProgram(
      renderer.program
    );

    gl.viewport(
      0,
      0,
      size,
      size
    );

    gl.uniformMatrix4fv(
      renderer.uniforms.projection,
      false,
      projection
    );

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    gl.depthMask(
      true
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.enable(
      gl.CULL_FACE
    );

    drawMesh(
      gl,
      renderer,
      renderer.terrain,
      0,
      1,
      1,
      yaw,
      pitch,
      pulse
    );

    if (renderer.cloud) {
      gl.depthMask(
        false
      );

      drawMesh(
        gl,
        renderer,
        renderer.cloud,
        2,
        0.36,
        1.018,
        cloudYaw,
        pitch,
        pulse
      );

      gl.depthMask(
        true
      );
    }

    gl.depthMask(
      false
    );

    gl.disable(
      gl.CULL_FACE
    );

    drawMesh(
      gl,
      renderer,
      renderer.terrain,
      1,
      1,
      1.043,
      yaw,
      pitch,
      pulse
    );

    gl.enable(
      gl.CULL_FACE
    );

    gl.depthMask(
      true
    );

    state.counters.renderFrames +=
      1;

    return true;
  }

  function renderStatic() {
    if (
      state.fallbackMode ||
      !state.renderer
    ) {
      return false;
    }

    return renderFrame(
      0.08,
      0.18,
      0
    );
  }

  function animationAllowed() {
    return Boolean(
      state.mounted &&
      state.ready &&
      !state.disposed &&
      !state.failed &&
      !state.paused &&
      !state.reducedMotion &&
      state.root &&
      state.canvas &&
      state.gl &&
      state.renderer
    );
  }

  function animationStep(timestamp) {
    state.frameId =
      0;

    if (!animationAllowed()) {
      return;
    }

    if (!state.animationStartedAt) {
      state.animationStartedAt =
        timestamp;
    }

    const elapsed =
      timestamp -
      state.animationStartedAt;

    const turn =
      (
        elapsed %
        DEFAULTS.rotationDurationMs
      ) /
      DEFAULTS.rotationDurationMs;

    const cloudTurn =
      (
        elapsed %
        DEFAULTS.cloudDurationMs
      ) /
      DEFAULTS.cloudDurationMs;

    const pulse =
      (
        elapsed %
        DEFAULTS.pulseDurationMs
      ) /
      DEFAULTS.pulseDurationMs;

    setRootProperty(
      "--showroom-planet-turn",
      `${turn * 360}deg`
    );

    setRootProperty(
      "--showroom-planet-cloud-turn",
      `${cloudTurn * 360}deg`
    );

    setRootProperty(
      "--showroom-planet-pulse",
      String(pulse)
    );

    renderFrame(
      turn,
      cloudTurn,
      pulse
    );

    state.frameId =
      window.requestAnimationFrame(
        animationStep
      );
  }

  function cancelAnimation() {
    if (state.frameId) {
      window.cancelAnimationFrame(
        state.frameId
      );
    }

    state.frameId =
      0;
  }

  function startAnimation() {
    cancelAnimation();

    if (!animationAllowed()) {
      renderStatic();

      return false;
    }

    state.animationStartedAt =
      0;

    state.frameId =
      window.requestAnimationFrame(
        animationStep
      );

    return true;
  }

  function stopAnimation() {
    cancelAnimation();

    setRootProperty(
      "--showroom-planet-turn",
      "0deg"
    );

    setRootProperty(
      "--showroom-planet-cloud-turn",
      "0deg"
    );

    setRootProperty(
      "--showroom-planet-pulse",
      "0"
    );

    renderStatic();
  }

  function enterFallbackMode(reason) {
    state.waitingForGeometry =
      false;

    state.fallbackMode =
      true;

    state.ready =
      false;

    state.failed =
      true;

    state.counters.fallbacks +=
      1;

    setFallbackText("");

    applyStateAttribute();
    applyReducedMotionAttribute();

    publishReceipt(
      "fallback",
      {
        reason:
          normalize(reason) ||
          "fallback",

        sourceGeometryUsed:
          false,

        rendererMode:
          "none",

        audraliaGeometryAuthorityRequired:
          true,

        semanticActivation:
          "none",

        clickAuthority:
          false,

        clickAuthorityOwner:
          "[data-showroom-compass-control]",

        navigationMeaning:
          "main-compass-return-selection",

        webGL:
          false,

        canvas2dRenderer:
          false
      }
    );

    dispatch(
      EVENTS.failure,
      {
        reason:
          "fallback",

        fallback:
          true,

        sourceGeometryUsed:
          false
      }
    );

    return true;
  }

  function fail(
    reason,
    error = null
  ) {
    state.failed =
      true;

    state.ready =
      false;

    state.paused =
      false;

    state.waitingForGeometry =
      false;

    stopAnimation();

    applyStateAttribute();

    state.counters.failures +=
      1;

    const errorPayload =
      error
        ? {
            name:
              error instanceof Error
                ? error.name
                : "Error",

            message:
              error instanceof Error
                ? error.message
                : String(error)
          }
        : null;

    publishReceipt(
      "failure",
      {
        reason:
          normalize(reason) ||
          "planet-failure",

        error:
          errorPayload
      }
    );

    dispatch(
      EVENTS.failure,
      {
        reason:
          normalize(reason) ||
          "planet-failure",

        error:
          errorPayload
      }
    );

    return false;
  }

  function markReady(reason) {
    state.ready =
      true;

    state.failed =
      false;

    state.paused =
      false;

    state.fallbackMode =
      false;

    state.waitingForGeometry =
      false;

    setFallbackText("");

    applyStateAttribute();
    applyReducedMotionAttribute();

    state.counters.ready +=
      1;

    renderStatic();

    publishReceipt(
      "ready",
      {
        reason:
          normalize(reason) ||
          "mounted",

        sourceGeometryUsed:
          Boolean(state.geometryPacket),

        sourceGeometryContract:
          AUDRALIA_GEOMETRY_CONTRACT,

        sourceGeometryHash:
          state.lastGeometryHash,

        terrainLevel:
          state.terrainMesh
            ? state.terrainMesh.level
            : null,

        terrainVertexCount:
          state.renderer &&
          state.renderer.terrain
            ? state.renderer.terrain.vertexCount
            : null,

        terrainTriangleCount:
          state.renderer &&
          state.renderer.terrain
            ? state.renderer.terrain.triangleCount
            : null,

        cloudMeshAvailable:
          Boolean(state.cloudMesh),

        staticFallbackAvailable:
          false,

        animationAllowed:
          animationAllowed(),

        visualIdentity:
          "mini-audralia",

        rendererMode:
          "webgl-3d",

        navigationMeaning:
          "main-compass-return-selection",

        clickAuthority:
          false,

        clickAuthorityOwner:
          "[data-showroom-compass-control]",

        semanticActivation:
          "none",

        webGL:
          true,

        canvas2dRenderer:
          false
      }
    );

    dispatch(
      EVENTS.ready,
      {
        reason:
          normalize(reason) ||
          "mounted",

        sourceGeometryUsed:
          Boolean(state.geometryPacket),

        visualIdentity:
          "mini-audralia",

        rendererMode:
          "webgl-3d",

        navigationMeaning:
          "main-compass-return-selection"
      }
    );

    startAnimation();

    return true;
  }

  function mount(
    target,
    options = {}
  ) {
    if (state.disposed) {
      return false;
    }

    if (!isElement(target)) {
      fail(
        "invalid-mount-target"
      );

      return false;
    }

    if (state.mounted) {
      unmount(
        "remount"
      );
    }

    try {
      bindReducedMotion();

      state.target =
        target;

      state.receiptTarget =
        resolveReceiptTarget(
          options
        );

      const root =
        createPlanetDom();

      state.root =
        root;

      state.target.appendChild(
        root
      );

      if (!isCanvas(state.canvas)) {
        throw new Error(
          "The mini Audralia planet requires a canvas host."
        );
      }

      state.gl =
        createWebGLContext(
          state.canvas
        );

      if (!state.gl) {
        throw new Error(
          "The mini Audralia planet requires WebGL."
        );
      }

      state.mounted =
        true;

      state.ready =
        false;

      state.failed =
        false;

      state.paused =
        false;

      state.fallbackMode =
        false;

      state.waitingForGeometry =
        false;

      state.pauseReason =
        "";

      state.counters.mounts +=
        1;

      bindResize();
      applyStateAttribute();
      applyReducedMotionAttribute();

      publishReceipt(
        "mounted",
        {
          targetAccepted:
            true,

          decorative:
            true,

          semanticActivation:
            "none",

          htmlIntegrationOwned:
            false,

          cssIntegrationOwned:
            false,

          visualIdentity:
            "mini-audralia",

          rendererMode:
            "webgl-3d",

          navigationMeaning:
            "main-compass-return-selection",

          clickAuthority:
            false,

          clickAuthorityOwner:
            "[data-showroom-compass-control]",

          audraliaGeometryAuthorityRequired:
            true,

          audraliaGeometryAuthorityGlobal:
            AUDRALIA_GEOMETRY_GLOBAL,

          audraliaGeometryAuthorityContract:
            AUDRALIA_GEOMETRY_CONTRACT,

          canvas2dRenderer:
            false,

          webGL:
            true
        }
      );

      const geometryReady =
        initializeGeometry(
          options
        );

      if (geometryReady) {
        buildRenderer();

        return markReady(
          "mounted-with-audralia-geometry-authority"
        );
      }

      return true;
    } catch (error) {
      return fail(
        "mount-failed",
        error
      );
    }
  }

  function unmount(
    reason = "api"
  ) {
    if (!state.mounted) {
      return true;
    }

    clearGeometryWaitTimer();
    stopAnimation();
    destroyRenderer();
    unbindResize();

    const root =
      state.root;

    if (
      root &&
      root.parentNode
    ) {
      try {
        root.parentNode.removeChild(
          root
        );
      } catch {
        /* Best-effort DOM cleanup. */
      }
    }

    unbindReducedMotion();

    state.target =
      null;

    state.root =
      null;

    state.shell =
      null;

    state.body =
      null;

    state.canvas =
      null;

    state.gl =
      null;

    state.fallback =
      null;

    state.receiptTarget =
      null;

    state.geometryPacket =
      null;

    state.terrainMesh =
      null;

    state.cloudMesh =
      null;

    state.lastGeometryHash =
      "";

    state.mounted =
      false;

    state.ready =
      false;

    state.failed =
      false;

    state.paused =
      false;

    state.fallbackMode =
      false;

    state.waitingForGeometry =
      false;

    state.pauseReason =
      "";

    state.animationStartedAt =
      0;

    state.counters.unmounts +=
      1;

    publishReceipt(
      "unmounted",
      {
        reason:
          normalize(reason) ||
          "api",

        localDomRemoved:
          true
      }
    );

    return true;
  }

  function setReducedMotion(
    value,
    reason = "api"
  ) {
    if (state.disposed) {
      return false;
    }

    state.reducedMotion =
      Boolean(value);

    applyReducedMotionAttribute();

    if (state.reducedMotion) {
      stopAnimation();
    } else {
      startAnimation();
    }

    publishReceipt(
      "reduced-motion-updated",
      {
        reason:
          normalize(reason) ||
          "api",

        reducedMotion:
          state.reducedMotion
      }
    );

    return true;
  }

  function pause(
    reason = "api"
  ) {
    if (
      state.disposed ||
      !state.mounted
    ) {
      return false;
    }

    state.paused =
      true;

    state.pauseReason =
      normalize(reason) ||
      "api";

    stopAnimation();
    applyStateAttribute();

    state.counters.pauses +=
      1;

    publishReceipt(
      "paused",
      {
        reason:
          state.pauseReason
      }
    );

    return true;
  }

  function resume(
    reason = "api"
  ) {
    if (
      state.disposed ||
      !state.mounted ||
      state.failed
    ) {
      return false;
    }

    state.paused =
      false;

    state.pauseReason =
      "";

    applyStateAttribute();

    state.counters.resumes +=
      1;

    publishReceipt(
      "resumed",
      {
        reason:
          normalize(reason) ||
          "api",

        animationAllowed:
          animationAllowed()
      }
    );

    startAnimation();

    return true;
  }

  function dispose(
    reason = "api"
  ) {
    if (state.disposed) {
      return true;
    }

    unmount(
      `dispose:${
        normalize(reason) ||
        "api"
      }`
    );

    clearGeometryWaitTimer();
    unbindReducedMotion();
    unbindResize();
    cancelAnimation();

    state.disposed =
      true;

    state.ready =
      false;

    state.failed =
      false;

    state.paused =
      false;

    state.fallbackMode =
      false;

    state.waitingForGeometry =
      false;

    state.pauseReason =
      "";

    state.geometryAuthority =
      null;

    state.counters.disposals +=
      1;

    publishReceipt(
      "disposed",
      {
        reason:
          normalize(reason) ||
          "api",

        localDomRemoved:
          true,

        listenersRemoved:
          true,

        geometryAuthorityMutated:
          false,

        controllerStateMutated:
          false,

        compositorStateMutated:
          false,

        crystalsStateMutated:
          false,

        interactionsStateMutated:
          false,

        compassStateMutated:
          false
      }
    );

    dispatch(
      EVENTS.disposed,
      {
        reason:
          normalize(reason) ||
          "api",

        disposed:
          true
      }
    );

    return true;
  }

  function getState() {
    return createReceipt(
      "state-requested",
      {
        visualIdentity:
          "mini-audralia",

        rendererMode:
          "webgl-3d",

        navigationMeaning:
          "main-compass-return-selection",

        sourceGeometryContract:
          AUDRALIA_GEOMETRY_CONTRACT,

        sourceGeometryHash:
          state.lastGeometryHash,

        terrainLevel:
          state.terrainMesh
            ? state.terrainMesh.level
            : null,

        terrainVertexCount:
          state.renderer &&
          state.renderer.terrain
            ? state.renderer.terrain.vertexCount
            : null,

        terrainTriangleCount:
          state.renderer &&
          state.renderer.terrain
            ? state.renderer.terrain.triangleCount
            : null,

        cloudMeshAvailable:
          Boolean(state.cloudMesh),

        emittedDomSurfaces: [
          ".showroom-planet-root",
          ".showroom-planet-glow",
          ".showroom-planet-orbit-line",
          ".showroom-planet-shell",
          ".showroom-planet-body",
          ".showroom-planet-canvas",
          ".showroom-planet-atmosphere",
          ".showroom-planet-rim",
          ".showroom-planet-terminator",
          ".showroom-planet-shadow",
          ".showroom-planet-meridian",
          ".showroom-planet-fulcrum",
          ".showroom-planet-axis",
          ".showroom-planet-fallback",
          '[data-showroom-planet-reduced-motion="true"]'
        ],

        lastReceipt:
          state.lastReceipt
            ? {
                event:
                  state.lastReceipt.event,

                timestamp:
                  state.lastReceipt.timestamp,

                state:
                  state.lastReceipt.state
              }
            : null,

        pauseReason:
          state.pauseReason ||
          null
      }
    );
  }

  const api =
    Object.freeze({
      contract:
        CONTRACT,

      model:
        MODEL,

      owner:
        OWNER,

      sourceAuthorityGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      sourceAuthorityContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      visualIdentity:
        "mini-audralia",

      rendererMode:
        "webgl-3d",

      navigationMeaning:
        "main-compass-return-selection",

      getState,

      mount,

      unmount,

      dispose,

      setReducedMotion,

      pause,

      resume
    });

  Object.defineProperty(
    window,
    GLOBAL_NAME,
    {
      configurable:
        true,

      enumerable:
        false,

      writable:
        false,

      value:
        api
    }
  );

  publishReceipt(
    "module-loaded",
    {
      global:
        GLOBAL_NAME,

      autoMount:
        false,

      requiresExternalMountTarget:
        true,

      semanticActivation:
        "none",

      decorative:
        true,

      visualIdentity:
        "mini-audralia",

      rendererMode:
        "webgl-3d",

      navigationMeaning:
        "main-compass-return-selection",

      clickAuthority:
        false,

      clickAuthorityOwner:
        "[data-showroom-compass-control]",

      requiredGeometryAuthority:
        "/assets/audralia/audralia.planet.js",

      requiredGeometryGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      requiredGeometryContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      emittedDomSurfaces: [
        ".showroom-planet-root",
        ".showroom-planet-glow",
        ".showroom-planet-orbit-line",
        ".showroom-planet-shell",
        ".showroom-planet-body",
        ".showroom-planet-canvas",
        ".showroom-planet-atmosphere",
        ".showroom-planet-rim",
        ".showroom-planet-terminator",
        ".showroom-planet-shadow",
        ".showroom-planet-meridian",
        ".showroom-planet-fulcrum",
        ".showroom-planet-axis",
        ".showroom-planet-fallback",
        '[data-showroom-planet-reduced-motion="true"]'
      ],

      canvas2dRenderer:
        false,

      webGL:
        true,

      navigationAuthority:
        false,

      productionAuthorization:
        false,

      deploymentAuthorization:
        false
    }
  );
})();
