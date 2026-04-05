DESTINATION: /world/render.js
// /world/render.js
// MODE: WORLD RENDER CONTRACT RENEWAL
// STATUS: FILTER-FIRST | PACKET-PRODUCER | RUNTIME-SAFE | NON-DRIFT
// OWNER: SEAN
//
// PURPOSE:
// - replace proof override with real render contract
// - produce a lawful render packet from runtime/control/scene inputs
// - act as a filter layer so universe / stars / planets can be defined cleanly downstream
// - remain observation/packet oriented, not canvas-drawing authority
// - preserve backward compatibility with meta/constants/render exports

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeNumber(value, fallback = null) {
  return Number.isFinite(value) ? value : fallback;
}

function normalizeBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function stableRound(value, places = 6) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function firstNonEmptyString(values, fallback = "") {
  for (let i = 0; i < values.length; i += 1) {
    const next = normalizeString(values[i], "");
    if (next.length > 0) return next;
  }
  return fallback;
}

function firstFiniteNumber(values, fallback = null) {
  for (let i = 0; i < values.length; i += 1) {
    if (Number.isFinite(values[i])) return values[i];
  }
  return fallback;
}

function createHash(input) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRng(seedValue) {
  let seed = seedValue >>> 0;
  return function rand() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

const WORLD_RENDER = Object.freeze({
  meta: Object.freeze({
    name: "world/render",
    version: "G2-FILTER-FIRST",
    contract: "WORLD_RENDER_FILTER_CONTRACT_G2",
    role: "visible_packet_producer",
    deterministic: true,
    sourceOfTruth: false,
    mutatesState: false,
    platformOwned: true
  }),

  constants: Object.freeze({
    PRIMARY_SYSTEM_TARGET: 9,
    DEFAULT_PROJECTION_KIND: "macro-universe-flat",
    DEFAULT_SCENE_CLASS: "MACRO_UNIVERSE",
    DEFAULT_FILTER_TARGET: "UNIVERSE",
    DEFAULT_FILTER_MODE: "UNIVERSE_FIRST",
    DEFAULT_WORLD_GRID: 256,
    DEFAULT_BACKGROUND_DENSITY: 0.62,
    DEFAULT_PRIMARY_PROMINENCE: 0.84,
    DEFAULT_GALAXY_BAND_STRENGTH: 0.76
  })
});

function normalizeProjectionKind(input = {}) {
  const candidate = firstNonEmptyString(
    [
      input.renderState?.projection?.selectedProjection?.kind,
      input.runtimeState?.projectionState,
      input.controlState?.lensMode,
      input.sceneState?.projectionKind
    ],
    "flat"
  ).toLowerCase();

  if (candidate === "globe") return "globe";
  if (candidate === "tree") return "tree";
  if (candidate === "macro-universe-flat") return "macro-universe-flat";
  return "flat";
}

function normalizeSceneClass(input = {}) {
  const candidate = firstNonEmptyString(
    [
      input.sceneState?.sceneClass,
      input.runtimeState?.sceneClass,
      input.renderState?.sceneClass
    ],
    WORLD_RENDER.constants.DEFAULT_SCENE_CLASS
  ).toUpperCase();

  if (candidate === "MACRO_UNIVERSE") return "MACRO_UNIVERSE";
  if (candidate === "STAR_FIELD") return "STAR_FIELD";
  if (candidate === "PLANET_FIELD") return "PLANET_FIELD";
  if (candidate === "LOCAL_PLANET") return "LOCAL_PLANET";
  return WORLD_RENDER.constants.DEFAULT_SCENE_CLASS;
}

function normalizeFilterTarget(input = {}) {
  const candidate = firstNonEmptyString(
    [
      input.sceneState?.filterTarget,
      input.runtimeState?.filterTarget,
      input.renderState?.filterTarget
    ],
    WORLD_RENDER.constants.DEFAULT_FILTER_TARGET
  ).toUpperCase();

  if (candidate === "UNIVERSE") return "UNIVERSE";
  if (candidate === "STARS") return "STARS";
  if (candidate === "PLANETS") return "PLANETS";
  if (candidate === "ALL") return "ALL";
  return WORLD_RENDER.constants.DEFAULT_FILTER_TARGET;
}

function normalizeFilterMode(input = {}) {
  const candidate = firstNonEmptyString(
    [
      input.sceneState?.filterMode,
      input.runtimeState?.filterMode,
      input.renderState?.filterMode
    ],
    WORLD_RENDER.constants.DEFAULT_FILTER_MODE
  ).toUpperCase();

  if (
    candidate === "UNIVERSE_FIRST" ||
    candidate === "STARS_FIRST" ||
    candidate === "PLANETS_FIRST" ||
    candidate === "BALANCED"
  ) {
    return candidate;
  }

  return WORLD_RENDER.constants.DEFAULT_FILTER_MODE;
}

function normalizePrimarySystemTarget(input = {}) {
  return clamp(
    Math.round(
      firstFiniteNumber(
        [
          input.sceneState?.primarySystemTarget,
          input.runtimeState?.primarySystemCount,
          input.renderState?.primarySystemCount
        ],
        WORLD_RENDER.constants.PRIMARY_SYSTEM_TARGET
      )
    ),
    1,
    64
  );
}

function buildSeedSignature(input = {}) {
  const runtimeState = normalizeObject(input.runtimeState);
  const sceneState = normalizeObject(input.sceneState);
  const controlState = normalizeObject(input.controlState);

  const width = firstFiniteNumber(
    [sceneState.width, runtimeState.width, controlState.width],
    WORLD_RENDER.constants.DEFAULT_WORLD_GRID
  );
  const height = firstFiniteNumber(
    [sceneState.height, runtimeState.height, controlState.height],
    WORLD_RENDER.constants.DEFAULT_WORLD_GRID
  );

  const mode = firstNonEmptyString(
    [sceneState.mode, runtimeState.mode, controlState.mode],
    "round"
  );

  const scope = firstNonEmptyString(
    [controlState.activeScope, runtimeState.activeScope, sceneState.activeScope],
    "GLOBAL"
  );

  const sceneClass = normalizeSceneClass(input);
  const filterTarget = normalizeFilterTarget(input);
  const filterMode = normalizeFilterMode(input);
  const primarySystemTarget = normalizePrimarySystemTarget(input);

  return Object.freeze({
    width,
    height,
    mode,
    scope,
    sceneClass,
    filterTarget,
    filterMode,
    primarySystemTarget,
    signature: `${width}x${height}|${mode}|${scope}|${sceneClass}|${filterTarget}|${filterMode}|${primarySystemTarget}`
  });
}

function buildFilterState(input = {}) {
  const target = normalizeFilterTarget(input);
  const mode = normalizeFilterMode(input);

  return deepFreeze({
    target,
    mode,
    universeEnabled: target === "UNIVERSE" || target === "ALL",
    starsEnabled: target === "STARS" || target === "ALL" || target === "UNIVERSE",
    planetsEnabled: target === "PLANETS" || target === "ALL",
    stageOrder:
      mode === "STARS_FIRST"
        ? ["STARS", "UNIVERSE", "PLANETS"]
        : mode === "PLANETS_FIRST"
          ? ["PLANETS", "STARS", "UNIVERSE"]
          : mode === "BALANCED"
            ? ["UNIVERSE", "STARS", "PLANETS"]
            : ["UNIVERSE", "STARS", "PLANETS"]
  });
}

function buildPrimarySystems(seedSignature, input = {}) {
  const count = seedSignature.primarySystemTarget;
  const seed = createHash(`primary:${seedSignature.signature}`);
  const rand = createRng(seed);
  const systems = [];

  for (let i = 0; i < count; i += 1) {
    const ageBias = count === 1 ? 0 : i / (count - 1);
    const code =
      i === 0 ? "N" :
      i === 1 ? "NE" :
      i === 2 ? "E" :
      i === 3 ? "SE" :
      i === 4 ? "S" :
      i === 5 ? "SW" :
      i === 6 ? "W" :
      i === 7 ? "NW" :
      i === 8 ? "C" :
      `P${i + 1}`;

    systems.push(
      deepFreeze({
        id: `system-${i + 1}`,
        code,
        dominantWeight: stableRound(lerp(1.0, 0.56, ageBias), 4),
        coreRadius: stableRound(lerp(1.0, 0.62, ageBias), 4),
        haloRadius: stableRound(lerp(1.0, 0.58, ageBias), 4),
        temperatureClass:
          i < 3 ? "WARM" :
          i < 6 ? "COOL" :
          "AGED",
        phaseOffset: stableRound(rand() * Math.PI * 2, 6)
      })
    );
  }

  return deepFreeze(systems);
}

function buildUniverseMetrics(seedSignature, input = {}, filterState) {
  const primaryProminence = stableRound(
    firstFiniteNumber(
      [
        input.sceneState?.primaryProminence,
        input.renderState?.primaryProminence,
        WORLD_RENDER.constants.DEFAULT_PRIMARY_PROMINENCE
      ],
      WORLD_RENDER.constants.DEFAULT_PRIMARY_PROMINENCE
    ),
    3
  );

  const galaxyBandStrength = stableRound(
    firstFiniteNumber(
      [
        input.sceneState?.galaxyBandStrength,
        input.renderState?.galaxyBandStrength,
        WORLD_RENDER.constants.DEFAULT_GALAXY_BAND_STRENGTH
      ],
      WORLD_RENDER.constants.DEFAULT_GALAXY_BAND_STRENGTH
    ),
    3
  );

  const backgroundDensity = stableRound(
    firstFiniteNumber(
      [
        input.sceneState?.backgroundDensity,
        input.renderState?.backgroundDensity,
        WORLD_RENDER.constants.DEFAULT_BACKGROUND_DENSITY
      ],
      WORLD_RENDER.constants.DEFAULT_BACKGROUND_DENSITY
    ),
    3
  );

  return deepFreeze({
    sceneClass: seedSignature.sceneClass,
    filterTarget: filterState.target,
    filterMode: filterState.mode,
    primarySystemCount: seedSignature.primarySystemTarget,
    primaryProminence,
    galaxyBandState: galaxyBandStrength >= 0.66 ? "STRONG" : galaxyBandStrength >= 0.40 ? "MEDIUM" : "WEAK",
    galaxyBandStrength,
    backgroundDensity,
    universeVisible: filterState.universeEnabled,
    starsVisible: filterState.starsEnabled,
    planetsVisible: filterState.planetsEnabled
  });
}

function buildProjectionPacket(seedSignature, input = {}) {
  const kind = normalizeProjectionKind(input);

  return deepFreeze({
    selectedProjection: deepFreeze({
      kind: kind === "flat" ? WORLD_RENDER.constants.DEFAULT_PROJECTION_KIND : kind,
      x: stableRound(seedSignature.width * 0.5, 3),
      y: stableRound(seedSignature.height * 0.5, 3),
      width: seedSignature.width,
      height: seedSignature.height,
      root: 0,
      leaf: seedSignature.primarySystemTarget,
      longitude: null,
      latitude: null
    })
  });
}

function buildRuntimePacket(seedSignature, input = {}, universeMetrics) {
  const runtimeState = normalizeObject(input.runtimeState);
  const controlState = normalizeObject(input.controlState);

  return deepFreeze({
    projectionState: normalizeProjectionKind(input) === "globe" ? "globe" : "flat",
    sceneClass: universeMetrics.sceneClass,
    universeMode: universeMetrics.filterMode,
    filterTarget: universeMetrics.filterTarget,
    primarySystemCount: universeMetrics.primarySystemCount,
    primaryProminence: universeMetrics.primaryProminence,
    galaxyBandState: universeMetrics.galaxyBandState,
    activeScope: firstNonEmptyString(
      [controlState.activeScope, runtimeState.activeScope],
      "GLOBAL"
    ),
    region: deepFreeze({
      label: firstNonEmptyString(
        [runtimeState.region?.label, "MACRO_UNIVERSE"]
      )
    }),
    node: deepFreeze({
      label: firstNonEmptyString(
        [runtimeState.node?.label, "UNIVERSE_RENDER"]
      )
    }),
    boundary: deepFreeze({
      classification: firstNonEmptyString(
        [runtimeState.boundary?.classification, "OPEN"]
      ).toUpperCase(),
      label: firstNonEmptyString(
        [runtimeState.boundary?.label, "OPEN"]
      )
    }),
    terrainClass: universeMetrics.sceneClass,
    biomeType: universeMetrics.filterTarget,
    denseIndex: deepFreeze({
      x: Math.round(seedSignature.width * 0.5),
      y: Math.round(seedSignature.height * 0.5)
    }),
    index: deepFreeze({
      i: 0,
      j: 0
    }),
    traversalStatus: deepFreeze({
      action: "FILTERED_RENDER"
    }),
    receipt: deepFreeze({
      timestamp: firstNonEmptyString(
        [runtimeState.receipt?.timestamp, "RENDERED"]
      )
    }),
    jsStamp: firstNonEmptyString(
      [input.sceneState?.jsStamp, input.renderState?.jsStamp],
      "—"
    ),
    htmlStamp: firstNonEmptyString(
      [input.sceneState?.htmlStamp, input.renderState?.htmlStamp],
      "—"
    ),
    canvasAuthority: firstNonEmptyString(
      [input.sceneState?.canvasAuthority, "CANVAS_FIRST"]
    ).toUpperCase(),
    canvasActive: normalizeBoolean(
      firstFiniteNumber([], null),
      true
    ),
    cssFallbackActive: normalizeBoolean(
      input.sceneState?.cssFallbackActive,
      false
    )
  });
}

function buildVisiblePacket(universeMetrics) {
  return deepFreeze({
    colorOutput: deepFreeze({
      hue: universeMetrics.filterTarget === "PLANETS" ? 0.12 : 0.60,
      saturation: universeMetrics.filterTarget === "PLANETS" ? 0.42 : 0.82,
      value: universeMetrics.primaryProminence
    }),
    emphasis: deepFreeze({
      boundary: universeMetrics.galaxyBandState,
      terrain: universeMetrics.sceneClass,
      biome: universeMetrics.filterTarget
    })
  });
}

function buildDiagnostics(seedSignature, filterState, primarySystems, universeMetrics) {
  return deepFreeze({
    filterState,
    primarySystems,
    scene: deepFreeze({
      signature: seedSignature.signature,
      width: seedSignature.width,
      height: seedSignature.height,
      mode: seedSignature.mode,
      scope: seedSignature.scope
    }),
    metrics: universeMetrics
  });
}

export function render(input = {}) {
  const normalizedInput = normalizeObject(input);
  const seedSignature = buildSeedSignature(normalizedInput);
  const filterState = buildFilterState(normalizedInput);
  const primarySystems = buildPrimarySystems(seedSignature, normalizedInput);
  const universeMetrics = buildUniverseMetrics(seedSignature, normalizedInput, filterState);

  const packet = deepFreeze({
    meta: WORLD_RENDER.meta,
    constants: WORLD_RENDER.constants,
    runtime: buildRuntimePacket(seedSignature, normalizedInput, universeMetrics),
    visible: buildVisiblePacket(universeMetrics),
    projection: buildProjectionPacket(seedSignature, normalizedInput),
    filters: filterState,
    scene: deepFreeze({
      class: universeMetrics.sceneClass,
      target: universeMetrics.filterTarget,
      mode: universeMetrics.filterMode,
      primarySystems
    }),
    diagnostics: buildDiagnostics(seedSignature, filterState, primarySystems, universeMetrics)
  });

  return packet;
}

export const meta = WORLD_RENDER.meta;
export const constants = WORLD_RENDER.constants;
export default Object.freeze({
  meta,
  constants,
  render
});
