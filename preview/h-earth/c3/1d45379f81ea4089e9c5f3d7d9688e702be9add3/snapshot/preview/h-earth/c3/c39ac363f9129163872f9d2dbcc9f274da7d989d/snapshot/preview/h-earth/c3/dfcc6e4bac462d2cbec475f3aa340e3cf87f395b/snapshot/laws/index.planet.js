/* TARGET FILE: /laws/index.planet.js */
/* COMPLETE REPLACEMENT */
/* DGB_LAWS_PLANET_WORLD_PARTICIPANT_v1 */
/* LAWS_PLANET_WORLD_PASS_PARTICIPANT_TNT_v1 */

/*
  Contract:
  LAWS_PLANET_WORLD_PASS_PARTICIPANT_TNT_v1

  Module:
  DGB_LAWS_PLANET_WORLD_PARTICIPANT
  1.0.0-laws-world-pass-participant

  Purpose:
  - Provide a separately governed Laws center-planet world participant.
  - Consume the canonical Audralia geometry authority.
  - Adapt Audralia terrain/cloud geometry into WebGL buffers for the
    Laws shared world render pass.
  - Provide a non-registry center-world planet node for
    /laws/index.crystals.js to admit into compositor.renderComposite().
  - Preserve independent planet rotation state.
  - Publish Laws-specific receipts without mounting a DOM shell,
    creating an overlay canvas, or running an independent renderer loop.

  Source geometry authority:
  - /assets/audralia/audralia.planet.js
  - window.DGBAudraliaPlanetGeometry
  - AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1

  Laws authority:
  - This file exposes window.DGB_LAWS_PLANET_WORLD_PARTICIPANT.
  - The planet is authored separately from crystals.
  - The planet is rendered only when consumed by the Laws shared
    world render pass.
  - Click / tap authority remains [data-upstream-compass-control].
  - Route authority remains the Laws controller.
  - The semantic outcome remains Main Compass return selection.

  Does not own:
  - DOM mounting;
  - overlay canvas creation;
  - independent requestAnimationFrame loop;
  - rear/front canvas clearing;
  - Laws controller state;
  - Laws compositor camera, projection, depth, or layer construction;
  - Laws crystal registry construction;
  - category or law count;
  - pointer or gesture interpretation;
  - semantic navigation;
  - route decisions;
  - Laws evidence status;
  - Audralia geometry mutation.
*/

(() => {
  "use strict";

  const MODULE_ID =
    "DGB_LAWS_PLANET_WORLD_PARTICIPANT";

  const MODULE_VERSION =
    "1.0.0-laws-world-pass-participant";

  const CONTRACT =
    "LAWS_PLANET_WORLD_PASS_PARTICIPANT_TNT_v1";

  const OWNER =
    "/laws/index.planet.js";

  const GLOBAL_NAME =
    "DGB_LAWS_PLANET_WORLD_PARTICIPANT";

  const LEGACY_GLOBAL_NAME =
    "LAWS_CENTER_PLANET";

  const AUDRALIA_GEOMETRY_GLOBAL =
    "DGBAudraliaPlanetGeometry";

  const AUDRALIA_GEOMETRY_CONTRACT =
    "AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1";

  const PLANET_NODE_TYPE =
    "compass-planet";

  const PLANET_NODE_ID =
    "main-compass-planet";

  const SELECTORS = Object.freeze({
    root:
      "[data-laws-root]",

    receipt:
      "[data-laws-planet-receipt]",

    compassControl:
      "[data-upstream-compass-control]"
  });

  const EVENTS = Object.freeze({
    ready:
      "DGB_LAWS_PLANET_WORLD_PARTICIPANT_READY",

    receipt:
      "DGB_LAWS_PLANET_WORLD_PARTICIPANT_RECEIPT",

    failure:
      "DGB_LAWS_PLANET_WORLD_PARTICIPANT_FAILURE",

    disposed:
      "DGB_LAWS_PLANET_WORLD_PARTICIPANT_DISPOSED"
  });

  const STATES = Object.freeze({
    moduleLoaded:
      "module-loaded",

    waiting:
      "waiting-for-audralia-geometry",

    geometryReady:
      "geometry-ready",

    rendererReady:
      "renderer-ready",

    available:
      "available",

    failed:
      "failed",

    disposed:
      "disposed"
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

    includeHydrology:
      false,

    deepValidation:
      false,

    worldCenter:
      Object.freeze([
        0,
        0,
        0
      ]),

    worldScale:
      0.46,

    cloudScale:
      0.468,

    atmosphereScale:
      0.486,

    pitch:
      -0.24,

    rotationDurationSeconds:
      76,

    cloudDurationSeconds:
      112,

    pulseDurationSeconds:
      14,

    geometryRetryMs:
      120,

    maximumGeometryAttempts:
      20
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
      Object.freeze([
        0.028,
        0.09,
        0.23
      ]),

    openOcean:
      Object.freeze([
        0.055,
        0.24,
        0.44
      ]),

    shelf:
      Object.freeze([
        0.11,
        0.48,
        0.58
      ]),

    coastal:
      Object.freeze([
        0.21,
        0.6,
        0.63
      ]),

    inlandSea:
      Object.freeze([
        0.12,
        0.39,
        0.51
      ]),

    lake:
      Object.freeze([
        0.18,
        0.52,
        0.63
      ]),

    beach:
      Object.freeze([
        0.68,
        0.59,
        0.38
      ]),

    coast:
      Object.freeze([
        0.5,
        0.47,
        0.32
      ]),

    lowland:
      Object.freeze([
        0.21,
        0.45,
        0.29
      ]),

    forest:
      Object.freeze([
        0.11,
        0.33,
        0.26
      ]),

    arid:
      Object.freeze([
        0.52,
        0.44,
        0.31
      ]),

    upland:
      Object.freeze([
        0.31,
        0.43,
        0.34
      ]),

    rock:
      Object.freeze([
        0.41,
        0.41,
        0.43
      ]),

    snow:
      Object.freeze([
        0.82,
        0.88,
        0.86
      ]),

    cloud:
      Object.freeze([
        0.9,
        0.96,
        0.97
      ]),

    atmosphere:
      Object.freeze([
        0.42,
        0.85,
        1.0
      ])
  });

  const VERTEX_SHADER_SOURCE = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uViewNormalMatrix;

varying vec3 vViewNormal;
varying vec3 vColor;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition =
    uModel *
    vec4(aPosition, 1.0);

  vec4 viewPosition =
    uView *
    worldPosition;

  vViewNormal =
    normalize(
      uViewNormalMatrix *
      aNormal
    );

  vColor =
    aColor;

  vViewPosition =
    viewPosition.xyz;

  vWorldPosition =
    worldPosition.xyz;

  gl_Position =
    uProjection *
    viewPosition;
}
`;

  const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

uniform int uMode;
uniform float uAlpha;
uniform float uPulse;

varying vec3 vViewNormal;
varying vec3 vColor;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

void main() {
  vec3 normal =
    normalize(vViewNormal);

  vec3 viewDirection =
    normalize(-vViewPosition);

  vec3 lightDirection =
    normalize(vec3(-0.18, 0.28, 0.94));

  float diffuse =
    max(
      dot(normal, lightDirection),
      0.0
    );

  float facing =
    max(
      dot(normal, viewDirection),
      0.0
    );

  float rim =
    pow(
      1.0 - facing,
      2.3
    );

  if (uMode == 1) {
    float alpha =
      (
        0.035 +
        rim * 0.22 +
        uPulse * 0.018
      ) *
      uAlpha;

    vec3 color =
      vec3(0.42, 0.85, 1.0) *
      (
        0.78 +
        rim * 0.28
      );

    gl_FragColor =
      vec4(
        color,
        alpha
      );

    return;
  }

  if (uMode == 2) {
    float alpha =
      (
        0.035 +
        diffuse * 0.095 +
        rim * 0.045
      ) *
      uAlpha;

    vec3 color =
      mix(
        vColor,
        vec3(1.0),
        0.16 + diffuse * 0.12
      );

    gl_FragColor =
      vec4(
        color,
        alpha
      );

    return;
  }

  vec3 night =
    vec3(0.012, 0.025, 0.078);

  vec3 coolDay =
    vec3(0.74, 0.88, 0.9);

  vec3 lit =
    vColor *
    (
      0.42 +
      diffuse * 0.7
    );

  lit =
    mix(
      lit,
      coolDay,
      pow(diffuse, 2.2) * 0.075
    );

  lit =
    mix(
      lit,
      vec3(0.5, 0.88, 1.0),
      rim * 0.085
    );

  lit =
    mix(
      night,
      lit,
      0.94
    );

  gl_FragColor =
    vec4(
      lit,
      uAlpha
    );
}
`;

  const state = {
    status:
      STATES.moduleLoaded,

    root:
      null,

    receiptTarget:
      null,

    compassControl:
      null,

    geometryAuthority:
      null,

    geometryPacket:
      null,

    terrainMesh:
      null,

    cloudMesh:
      null,

    lastGeometryHash:
      "",

    geometryAttempts:
      0,

    rendererRecords:
      new WeakMap(),

    node:
      null,

    ready:
      false,

    failed:
      false,

    disposed:
      false,

    reducedMotion:
      false,

    rotation:
      0,

    cloudRotation:
      0,

    pulse:
      0,

    lastUpdateTime:
      0,

    lastError:
      "",

    counters: {
      moduleLoads:
        0,

      receipts:
        0,

      geometryAttempts:
        0,

      geometryAccepted:
        0,

      geometryUnavailable:
        0,

      rendererPreparations:
        0,

      rendererReady:
        0,

      rendererFailures:
        0,

      drawCalls:
        0,

      drawSkips:
        0,

      updates:
        0,

      failures:
        0,

      disposals:
        0
    }
  };

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
        finiteNumber(value, minimum)
      )
    );
  }

  function isElement(value) {
    return (
      typeof Element !== "undefined" &&
      value instanceof Element
    );
  }

  function qs(
    selector,
    root = document
  ) {
    try {
      return root.querySelector(selector);
    } catch {
      return null;
    }
  }

  function resolveDom() {
    state.root =
      qs(SELECTORS.root);

    state.receiptTarget =
      state.root
        ? qs(
            SELECTORS.receipt,
            state.root
          )
        : qs(
            SELECTORS.receipt
          );

    state.compassControl =
      state.root
        ? qs(
            SELECTORS.compassControl,
            state.root
          )
        : qs(
            SELECTORS.compassControl
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

    Object.entries(value)
      .forEach(
        ([key, entry]) => {
          if (
            typeof entry !==
            "function"
          ) {
            output[key] =
              freezePlain(entry);
          }
        }
      );

    return Object.freeze(output);
  }

  function setRootStatus() {
    if (!state.root) {
      return;
    }

    state.root.dataset
      .lawsPlanetParticipant =
      "true";

    state.root.dataset
      .lawsPlanetParticipantModule =
      MODULE_ID;

    state.root.dataset
      .lawsPlanetParticipantVersion =
      MODULE_VERSION;

    state.root.dataset
      .lawsPlanetParticipantContract =
      CONTRACT;

    state.root.dataset
      .lawsPlanetParticipantStatus =
      state.status;

    state.root.dataset
      .lawsPlanetParticipantVisualRole =
      "center-world-compass-body";

    state.root.dataset
      .lawsPlanetParticipantDomMount =
      "false";

    state.root.dataset
      .lawsPlanetParticipantOverlayCanvas =
      "false";

    state.root.dataset
      .lawsPlanetParticipantIndependentRenderLoop =
      "false";

    state.root.dataset
      .lawsPlanetParticipantSharedWorldPassRequired =
      "true";

    state.root.dataset
      .lawsPlanetParticipantRouteAuthority =
      "false";

    state.root.dataset
      .lawsPlanetParticipantControllerAuthority =
      "false";

    state.root.dataset
      .lawsPlanetParticipantLawRegistryMember =
      "false";

    state.root.dataset
      .lawsPlanetParticipantCategoryRegistryMember =
      "false";
  }

  function currentStateName() {
    if (state.disposed) {
      return STATES.disposed;
    }

    if (state.failed) {
      return STATES.failed;
    }

    if (
      state.ready &&
      state.geometryPacket
    ) {
      return STATES.available;
    }

    if (state.geometryPacket) {
      return STATES.geometryReady;
    }

    if (state.geometryAttempts > 0) {
      return STATES.waiting;
    }

    return state.status ||
      STATES.moduleLoaded;
  }

  function createReceipt(
    event,
    detail = {}
  ) {
    return freezePlain({
      contract:
        CONTRACT,

      moduleId:
        MODULE_ID,

      moduleVersion:
        MODULE_VERSION,

      owner:
        OWNER,

      event:
        event,

      timestamp:
        nowIso(),

      state:
        currentStateName(),

      sourceAuthority:
        "/assets/audralia/audralia.planet.js",

      sourceGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      sourceContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      geometryAuthorityAvailable:
        Boolean(state.geometryAuthority),

      geometryPacketAvailable:
        Boolean(state.geometryPacket),

      terrainMeshAvailable:
        Boolean(state.terrainMesh),

      cloudMeshAvailable:
        Boolean(state.cloudMesh),

      geometryHash:
        state.lastGeometryHash,

      nodeAvailable:
        Boolean(state.node),

      nodeId:
        PLANET_NODE_ID,

      nodeType:
        PLANET_NODE_TYPE,

      registryRole:
        "compass-center",

      visualIdentity:
        "mini-audralia",

      visualRole:
        "center-world-compass-body",

      rendererMode:
        "laws-shared-world-pass-participant",

      finalPixelAuthority:
        "laws-shared-world-render-pass",

      domMount:
        false,

      overlayCanvas:
        false,

      independentRenderLoop:
        false,

      emittedDomSurfaces:
        [],

      showroomRendererDependency:
        false,

      showroomRendererMutated:
        false,

      navigationMeaning:
        "main-compass-return-selection",

      compassControlSelector:
        SELECTORS.compassControl,

      compassControlAvailable:
        Boolean(state.compassControl),

      clickAuthority:
        false,

      clickAuthorityOwner:
        "[data-upstream-compass-control]",

      semanticActivationOwned:
        false,

      navigationAuthority:
        false,

      routeAuthority:
        false,

      controllerAuthority:
        false,

      controllerStateMutated:
        false,

      compositorAuthority:
        false,

      compositorStateMutated:
        false,

      crystalsAuthority:
        false,

      crystalsStateMutated:
        false,

      sharedWorldPassRequired:
        true,

      lawRegistryMember:
        false,

      categoryRegistryMember:
        false,

      lawsRegistryMutated:
        false,

      lawCountMutated:
        false,

      categoryCountMutated:
        false,

      lawContentAuthority:
        false,

      evidenceAuthority:
        false,

      empiricalClaimAuthority:
        false,

      audraliaGeometryMutated:
        false,

      visualPassClaimed:
        false,

      runtimeExecutionClaimed:
        false,

      productionAuthorization:
        false,

      deploymentAuthorization:
        false,

      ready:
        state.ready,

      failed:
        state.failed,

      disposed:
        state.disposed,

      reducedMotion:
        state.reducedMotion,

      lastError:
        state.lastError,

      counters:
        {
          ...state.counters
        },

      ...detail
    });
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

    globalThis
      .DGB_LAWS_PLANET_WORLD_PARTICIPANT_RECEIPT =
      payload;

    globalThis.dispatchEvent(
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

  function emitFailure(
    reason,
    detail = {}
  ) {
    state.failed =
      true;

    state.ready =
      false;

    state.status =
      STATES.failed;

    state.lastError =
      normalize(reason) ||
      "planet-world-participant-failure";

    state.counters.failures +=
      1;

    setRootStatus();

    const payload =
      publishReceipt(
        "failure",
        {
          reason:
            state.lastError,

          ...detail
        }
      );

    globalThis.dispatchEvent(
      new CustomEvent(
        EVENTS.failure,
        {
          detail:
            payload
        }
      )
    );

    return false;
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
      typeof globalThis
        .__AUDRALIA_PLANET_GEOMETRY_CONTRACT__ ===
        "string"
    ) {
      return globalThis
        .__AUDRALIA_PLANET_GEOMETRY_CONTRACT__;
    }

    return "";
  }

  function resolveGeometryAuthority() {
    const authority =
      globalThis[
        AUDRALIA_GEOMETRY_GLOBAL
      ];

    if (
      !authority ||
      typeof authority !==
        "object"
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
      typeof authority
        .createGeometry !==
        "function"
    ) {
      return null;
    }

    return authority;
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

  function createGeometryPacket(
    options = {}
  ) {
    if (state.disposed) {
      return null;
    }

    const authority =
      state.geometryAuthority ||
      resolveGeometryAuthority();

    state.geometryAttempts +=
      1;

    state.counters.geometryAttempts +=
      1;

    if (!authority) {
      state.counters.geometryUnavailable +=
        1;

      state.status =
        STATES.waiting;

      setRootStatus();

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

      return null;
    }

    state.geometryAuthority =
      authority;

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
          Boolean(
            options.includeHydrology ??
            DEFAULTS.includeHydrology
          ),

        deepValidation:
          Boolean(
            options.deepValidation ??
            DEFAULTS.deepValidation
          )
      });

    if (
      !packet ||
      !packet.terrain ||
      !packet.terrain.positions ||
      !packet.terrain.indices
    ) {
      emitFailure(
        "audralia-geometry-packet-invalid"
      );

      return null;
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

    state.status =
      STATES.geometryReady;

    state.counters.geometryAccepted +=
      1;

    setRootStatus();

    publishReceipt(
      "audralia-geometry-accepted",
      {
        sourceGeometryUsed:
          true,

        sourceGeometryContract:
          AUDRALIA_GEOMETRY_CONTRACT,

        sourceGeometryHash:
          state.lastGeometryHash,

        terrainLevel:
          state.terrainMesh
            ? state.terrainMesh.level
            : null,

        terrainVertexCount:
          state.terrainMesh
            ? state.terrainMesh.vertexCount ||
              Math.floor(
                state.terrainMesh.positions.length /
                  3
              )
            : null,

        terrainTriangleCount:
          state.terrainMesh
            ? state.terrainMesh.triangleCount ||
              Math.floor(
                state.terrainMesh.indices.length /
                  3
              )
            : null,

        cloudMeshAvailable:
          Boolean(state.cloudMesh)
      }
    );

    return packet;
  }

  function materialColor(
    materialHint,
    waterClass
  ) {
    if (
      waterClass ===
      WATER_CLASS.DEEP_OCEAN
    ) {
      return COLORS.deepOcean;
    }

    if (
      waterClass ===
      WATER_CLASS.OPEN_OCEAN
    ) {
      return COLORS.openOcean;
    }

    if (
      waterClass ===
      WATER_CLASS.SHELF_WATER
    ) {
      return COLORS.shelf;
    }

    if (
      waterClass ===
      WATER_CLASS.COASTAL_WATER
    ) {
      return COLORS.coastal;
    }

    if (
      waterClass ===
      WATER_CLASS.LAKE
    ) {
      return COLORS.lake;
    }

    if (
      waterClass ===
      WATER_CLASS.INLAND_SEA
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

  function createNormalsFromPositions(
    positions
  ) {
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
        ) ||
        1;

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

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

    if (!shader) {
      throw new Error(
        "Planet shader creation failed."
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
        gl.getShaderInfoLog(shader) ||
        "Planet shader compilation failed.";

      gl.deleteShader(shader);

      throw new Error(message);
    }

    return shader;
  }

  function createProgram(
    gl
  ) {
    const vertexShader =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        VERTEX_SHADER_SOURCE
      );

    const fragmentShader =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        FRAGMENT_SHADER_SOURCE
      );

    const program =
      gl.createProgram();

    if (!program) {
      throw new Error(
        "Planet program creation failed."
      );
    }

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
        "Planet program linking failed.";

      gl.deleteProgram(program);

      throw new Error(message);
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

    if (!buffer) {
      throw new Error(
        "Planet buffer creation failed."
      );
    }

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
      !gl.getExtension(
        "OES_element_index_uint"
      )
    ) {
      throw new Error(
        "The Laws planet mesh requires 32-bit indices, but this WebGL context does not support them."
      );
    }

    return {
      positionBuffer:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          positions
        ),

      normalBuffer:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          normals
        ),

      colorBuffer:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          colors
        ),

      indexBuffer:
        createBuffer(
          gl,
          gl.ELEMENT_ARRAY_BUFFER,
          indexData.array
        ),

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
    ].forEach(
      entry => {
        if (entry) {
          try {
            gl.deleteBuffer(entry);
          } catch {
            /* Best-effort cleanup. */
          }
        }
      }
    );
  }

  function bindAttrib(
    gl,
    buffer,
    location,
    size
  ) {
    if (location < 0) {
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
      new Array(16)
        .fill(0);

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

  function rotateX4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateY4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
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
      !Number.isFinite(determinant) ||
      Math.abs(determinant) <=
        1e-7
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
      inverse[0], inverse[3], inverse[6],
      inverse[1], inverse[4], inverse[7],
      inverse[2], inverse[5], inverse[8]
    ];
  }

  function modelMatrixForNode(
    node,
    options = {}
  ) {
    const transform =
      node.transform ||
      {};

    const center =
      [
        finiteNumber(
          transform.x,
          0
        ),

        finiteNumber(
          transform.y,
          0
        ),

        finiteNumber(
          transform.z,
          0
        )
      ];

    const scale =
      finiteNumber(
        options.scale,
        transform.sx ||
          DEFAULTS.worldScale
      );

    const yaw =
      finiteNumber(
        options.yaw,
        state.rotation *
          Math.PI *
          2
      );

    const pitch =
      finiteNumber(
        options.pitch,
        DEFAULTS.pitch
      );

    return multiply4(
      translate4(
        center[0],
        center[1],
        center[2]
      ),
      multiply4(
        rotateY4(yaw),
        multiply4(
          rotateX4(pitch),
          scale4(
            scale,
            scale,
            scale
          )
        )
      )
    );
  }

  function createNode() {
    const center =
      DEFAULTS.worldCenter;

    return {
      id:
        PLANET_NODE_ID,

      type:
        PLANET_NODE_TYPE,

      kind:
        PLANET_NODE_TYPE,

      label:
        "Main Compass Planet",

      registryRole:
        "compass-center",

      visualRole:
        "center-world-compass-body",

      semanticElement:
        state.compassControl ||
        null,

      lawRegistryMember:
        false,

      categoryRegistryMember:
        false,

      routeAuthority:
        false,

      controllerAuthority:
        false,

      navigationAuthority:
        false,

      lawContentAuthority:
        false,

      evidenceAuthority:
        false,

      visible:
        Boolean(
          state.geometryPacket &&
          !state.disposed &&
          !state.failed
        ),

      depthLayer:
        "REAR",

      previousDepthLayer:
        "REAR",

      viewDepth:
        -Infinity,

      depthOffsetFromCompassPlane:
        -Infinity,

      depthScore:
        0.5,

      primaryScore:
        1,

      projectedScreen:
        null,

      material:
        "PLANET",

      meshKey:
        "planet-main-compass",

      transform:
        {
          x:
            center[0],

          y:
            center[1],

          z:
            center[2],

          rx:
            DEFAULTS.pitch,

          ry:
            state.rotation *
            Math.PI *
            2,

          rz:
            0,

          sx:
            DEFAULTS.worldScale,

          sy:
            DEFAULTS.worldScale,

          sz:
            DEFAULTS.worldScale,

          prominence:
            1,

          halo:
            0.72,

          rotationSpeed:
            0,

          float:
            0
        },

      target:
        {
          x:
            center[0],

          y:
            center[1],

          z:
            center[2],

          sx:
            DEFAULTS.worldScale,

          sy:
            DEFAULTS.worldScale,

          sz:
            DEFAULTS.worldScale,

          prominence:
            1,

          halo:
            0.72,

          rotationSpeed:
            0,

          float:
            0
        }
    };
  }

  function ensureNode() {
    if (!state.node) {
      state.node =
        createNode();
    }

    state.node.visible =
      Boolean(
        state.geometryPacket &&
        !state.disposed &&
        !state.failed
      );

    state.node.semanticElement =
      state.compassControl ||
      null;

    state.node.transform.ry =
      state.rotation *
      Math.PI *
      2;

    state.node.transform.rx =
      DEFAULTS.pitch;

    return state.node;
  }

  function ensureGeometry(
    options = {}
  ) {
    if (state.geometryPacket) {
      return state.geometryPacket;
    }

    return createGeometryPacket(
      options
    );
  }

  function prepareRenderer(
    hostRenderer,
    options = {}
  ) {
    if (
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    if (
      !hostRenderer ||
      !hostRenderer.gl
    ) {
      state.counters.rendererFailures +=
        1;

      return emitFailure(
        "planet-host-renderer-invalid"
      );
    }

    const existing =
      state.rendererRecords.get(
        hostRenderer
      );

    if (existing) {
      return existing;
    }

    const packet =
      ensureGeometry(
        options
      );

    if (!packet) {
      return null;
    }

    try {
      const gl =
        hostRenderer.gl;

      const program =
        createProgram(
          gl
        );

      const record = {
        hostRenderer,

        gl,

        program,

        attributes:
          {
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

        uniforms:
          {
            model:
              gl.getUniformLocation(
                program,
                "uModel"
              ),

            view:
              gl.getUniformLocation(
                program,
                "uView"
              ),

            projection:
              gl.getUniformLocation(
                program,
                "uProjection"
              ),

            viewNormalMatrix:
              gl.getUniformLocation(
                program,
                "uViewNormalMatrix"
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

      if (!record.terrain) {
        throw new Error(
          "The Laws planet terrain mesh could not be prepared."
        );
      }

      state.rendererRecords.set(
        hostRenderer,
        record
      );

      state.ready =
        true;

      state.status =
        STATES.rendererReady;

      state.counters.rendererPreparations +=
        1;

      state.counters.rendererReady +=
        1;

      setRootStatus();

      publishReceipt(
        "renderer-prepared",
        {
          hostRendererId:
            hostRenderer.id ||
            "",

          terrainVertexCount:
            record.terrain.vertexCount,

          terrainTriangleCount:
            record.terrain.triangleCount,

          cloudMeshAvailable:
            Boolean(record.cloud),

          sharedWorldPassRequired:
            true,

          independentRenderLoop:
            false
        }
      );

      globalThis.dispatchEvent(
        new CustomEvent(
          EVENTS.ready,
          {
            detail:
              receipt()
          }
        )
      );

      return record;
    } catch (error) {
      state.counters.rendererFailures +=
        1;

      return emitFailure(
        "planet-renderer-preparation-failed",
        {
          error:
            error instanceof Error
              ? {
                  name:
                    error.name,

                  message:
                    error.message
                }
              : {
                  name:
                    "Error",

                  message:
                    String(error)
                }
        }
      );
    }
  }

  function bindMesh(
    gl,
    record,
    mesh
  ) {
    bindAttrib(
      gl,
      mesh.positionBuffer,
      record.attributes.position,
      3
    );

    bindAttrib(
      gl,
      mesh.normalBuffer,
      record.attributes.normal,
      3
    );

    bindAttrib(
      gl,
      mesh.colorBuffer,
      record.attributes.color,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      mesh.indexBuffer
    );
  }

  function drawMesh(
    record,
    node,
    mesh,
    options = {}
  ) {
    if (!mesh) {
      return 0;
    }

    const gl =
      record.gl;

    const view =
      options.viewMatrix;

    const projection =
      options.projectionMatrix;

    if (
      !Array.isArray(view) ||
      !Array.isArray(projection)
    ) {
      state.counters.drawSkips +=
        1;

      return 0;
    }

    const model =
      modelMatrixForNode(
        node,
        {
          scale:
            options.scale,

          yaw:
            options.yaw,

          pitch:
            options.pitch
        }
      );

    const modelView =
      multiply4(
        view,
        model
      );

    const normalMatrix =
      inverseTransposeNormalMatrix3(
        modelView
      );

    gl.useProgram(
      record.program
    );

    bindMesh(
      gl,
      record,
      mesh
    );

    gl.uniformMatrix4fv(
      record.uniforms.model,
      false,
      new Float32Array(model)
    );

    gl.uniformMatrix4fv(
      record.uniforms.view,
      false,
      new Float32Array(view)
    );

    gl.uniformMatrix4fv(
      record.uniforms.projection,
      false,
      new Float32Array(projection)
    );

    gl.uniformMatrix3fv(
      record.uniforms.viewNormalMatrix,
      false,
      new Float32Array(normalMatrix)
    );

    gl.uniform1i(
      record.uniforms.mode,
      options.mode || 0
    );

    gl.uniform1f(
      record.uniforms.alpha,
      options.alpha == null
        ? 1
        : finiteNumber(
            options.alpha,
            1
          )
    );

    gl.uniform1f(
      record.uniforms.pulse,
      state.pulse
    );

    gl.drawElements(
      gl.TRIANGLES,
      mesh.indexCount,
      mesh.indexType,
      0
    );

    return 1;
  }

  function draw(options = {}) {
    if (
      state.disposed ||
      state.failed
    ) {
      state.counters.drawSkips +=
        1;

      return 0;
    }

    const hostRenderer =
      options.renderer;

    const node =
      options.node ||
      state.node ||
      ensureNode();

    if (
      !hostRenderer ||
      !node ||
      node.type !== PLANET_NODE_TYPE
    ) {
      state.counters.drawSkips +=
        1;

      return 0;
    }

    const record =
      prepareRenderer(
        hostRenderer,
        options
      );

    if (!record) {
      state.counters.drawSkips +=
        1;

      return 0;
    }

    const gl =
      record.gl;

    const wasCullFace =
      gl.isEnabled(gl.CULL_FACE);

    const wasDepthTest =
      gl.isEnabled(gl.DEPTH_TEST);

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthFunc(
      gl.LEQUAL
    );

    gl.enable(
      gl.BLEND
    );

    const haloPass =
      Boolean(
        options.haloPass
      );

    let drawCalls =
      0;

    if (haloPass) {
      const previousDepthMask =
        true;

      gl.depthMask(
        false
      );

      gl.disable(
        gl.CULL_FACE
      );

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE
      );

      drawCalls +=
        drawMesh(
          record,
          node,
          record.terrain,
          {
            viewMatrix:
              options.viewMatrix,

            projectionMatrix:
              options.projectionMatrix,

            mode:
              1,

            alpha:
              0.78,

            scale:
              DEFAULTS.atmosphereScale,

            yaw:
              state.rotation *
              Math.PI *
              2,

            pitch:
              DEFAULTS.pitch
          }
        );

      gl.depthMask(
        previousDepthMask
      );
    } else {
      gl.depthMask(
        true
      );

      gl.enable(
        gl.CULL_FACE
      );

      gl.cullFace(
        gl.BACK
      );

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );

      drawCalls +=
        drawMesh(
          record,
          node,
          record.terrain,
          {
            viewMatrix:
              options.viewMatrix,

            projectionMatrix:
              options.projectionMatrix,

            mode:
              0,

            alpha:
              1,

            scale:
              DEFAULTS.worldScale,

            yaw:
              state.rotation *
              Math.PI *
              2,

            pitch:
              DEFAULTS.pitch
          }
        );

      if (record.cloud) {
        gl.depthMask(
          false
        );

        drawCalls +=
          drawMesh(
            record,
            node,
            record.cloud,
            {
              viewMatrix:
                options.viewMatrix,

              projectionMatrix:
                options.projectionMatrix,

              mode:
                2,

              alpha:
                0.36,

              scale:
                DEFAULTS.cloudScale,

              yaw:
                state.cloudRotation *
                Math.PI *
                2,

              pitch:
                DEFAULTS.pitch
            }
          );

        gl.depthMask(
          true
        );
      }
    }

    if (wasCullFace) {
      gl.enable(
        gl.CULL_FACE
      );
    } else {
      gl.disable(
        gl.CULL_FACE
      );
    }

    if (wasDepthTest) {
      gl.enable(
        gl.DEPTH_TEST
      );
    } else {
      gl.disable(
        gl.DEPTH_TEST
      );
    }

    state.counters.drawCalls +=
      drawCalls;

    return drawCalls;
  }

  function update(options = {}) {
    if (
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    state.reducedMotion =
      Boolean(
        options.reducedMotion ||
        (
          options.frame &&
          options.frame.reducedMotion
        )
      );

    const time =
      Number.isFinite(
        options.time
      )
        ? options.time
        : Number.isFinite(
            options.nowSeconds
          )
          ? options.nowSeconds
          : performance.now() *
            0.001;

    const deltaSeconds =
      Number.isFinite(
        options.deltaSeconds
      )
        ? Math.max(
            0,
            options.deltaSeconds
          )
        : state.lastUpdateTime
          ? Math.max(
              0,
              time -
              state.lastUpdateTime
            )
          : 0.016;

    state.lastUpdateTime =
      time;

    if (!state.reducedMotion) {
      state.rotation =
        (
          time %
          DEFAULTS.rotationDurationSeconds
        ) /
        DEFAULTS.rotationDurationSeconds;

      state.cloudRotation =
        (
          time %
          DEFAULTS.cloudDurationSeconds
        ) /
        DEFAULTS.cloudDurationSeconds;

      state.pulse =
        (
          time %
          DEFAULTS.pulseDurationSeconds
        ) /
        DEFAULTS.pulseDurationSeconds;
    } else {
      state.rotation =
        0.08;

      state.cloudRotation =
        0.18;

      state.pulse =
        0;
    }

    ensureGeometry(
      options
    );

    ensureNode();

    state.counters.updates +=
      1;

    return true;
  }

  function getNode(options = {}) {
    if (
      state.disposed ||
      state.failed
    ) {
      return null;
    }

    resolveDom();

    update(options);

    if (!state.geometryPacket) {
      return null;
    }

    const node =
      ensureNode();

    return node.visible
      ? node
      : null;
  }

  function getWorldCenter(node) {
    const activeNode =
      node ||
      state.node ||
      ensureNode();

    if (
      !activeNode ||
      !activeNode.transform
    ) {
      return DEFAULTS.worldCenter.slice();
    }

    return [
      finiteNumber(
        activeNode.transform.x,
        0
      ),

      finiteNumber(
        activeNode.transform.y,
        0
      ),

      finiteNumber(
        activeNode.transform.z,
        0
      )
    ];
  }

  function isPlanetNode(node) {
    return Boolean(
      node &&
      node.type === PLANET_NODE_TYPE &&
      node.id === PLANET_NODE_ID
    );
  }

  function dispose(reason = "api") {
    if (state.disposed) {
      return true;
    }

    state.rendererRecords =
      new WeakMap();

    state.disposed =
      true;

    state.ready =
      false;

    state.failed =
      false;

    state.status =
      STATES.disposed;

    state.node =
      null;

    state.geometryPacket =
      null;

    state.terrainMesh =
      null;

    state.cloudMesh =
      null;

    state.lastGeometryHash =
      "";

    state.counters.disposals +=
      1;

    setRootStatus();

    const payload =
      publishReceipt(
        "disposed",
        {
          reason:
            normalize(reason) ||
            "api",

          domRemoved:
            false,

          overlayCanvasRemoved:
            false,

          independentRenderLoopCancelled:
            false,

          geometryAuthorityMutated:
            false
        }
      );

    globalThis.dispatchEvent(
      new CustomEvent(
        EVENTS.disposed,
        {
          detail:
            payload
        }
      )
    );

    return true;
  }

  function receipt() {
    return publishReceipt(
      "receipt-requested"
    );
  }

  function initialize() {
    state.counters.moduleLoads +=
      1;

    resolveDom();

    ensureGeometry();

    ensureNode();

    state.status =
      state.geometryPacket
        ? STATES.geometryReady
        : STATES.waiting;

    setRootStatus();

    publishReceipt(
      "module-loaded",
      {
        global:
          GLOBAL_NAME,

        legacyGlobal:
          LEGACY_GLOBAL_NAME,

        participantOnly:
          true,

        domBridge:
          false,

        autoMount:
          false,

        requiresExternalMountTarget:
          false,

        requiresSharedWorldPass:
          true,

        requiredGeometryAuthority:
          "/assets/audralia/audralia.planet.js",

        requiredGeometryGlobal:
          AUDRALIA_GEOMETRY_GLOBAL,

        requiredGeometryContract:
          AUDRALIA_GEOMETRY_CONTRACT,

        exposedNodeType:
          PLANET_NODE_TYPE,

        exposedNodeId:
          PLANET_NODE_ID,

        visualIdentity:
          "mini-audralia",

        visualRole:
          "center-world-compass-body",

        rendererMode:
          "laws-shared-world-pass-participant",

        navigationMeaning:
          "main-compass-return-selection",

        clickAuthority:
          false,

        clickAuthorityOwner:
          "[data-upstream-compass-control]",

        lawRegistryMember:
          false,

        categoryRegistryMember:
          false,

        productionAuthorization:
          false,

        deploymentAuthorization:
          false
      }
    );
  }

  const api =
    Object.freeze({
      moduleId:
        MODULE_ID,

      moduleVersion:
        MODULE_VERSION,

      contract:
        CONTRACT,

      owner:
        OWNER,

      sourceAuthorityGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      sourceAuthorityContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      nodeType:
        PLANET_NODE_TYPE,

      nodeId:
        PLANET_NODE_ID,

      visualIdentity:
        "mini-audralia",

      visualRole:
        "center-world-compass-body",

      rendererMode:
        "laws-shared-world-pass-participant",

      navigationMeaning:
        "main-compass-return-selection",

      domMount:
        false,

      overlayCanvas:
        false,

      independentRenderLoop:
        false,

      routeAuthority:
        false,

      controllerAuthority:
        false,

      lawRegistryMember:
        false,

      categoryRegistryMember:
        false,

      getNode,
      getWorldCenter,
      isPlanetNode,
      prepareRenderer,
      draw,
      update,
      receipt,
      dispose
    });

  Object.defineProperty(
    globalThis,
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

  Object.defineProperty(
    globalThis,
    LEGACY_GLOBAL_NAME,
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

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once:
          true
      }
    );
  } else {
    initialize();
  }
})();
