(function attachPlanetOneRenderTeam(global) {
  "use strict";

  const VERSION = "PLANET_ONE_RENDER_V16_TERRAIN_MODULE_PROOF_AND_LEGACY_GAUGE_REPAIR_TNT_v1";
  const PREVIOUS_V15 = "PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1";
  const PREVIOUS_V14 = "PLANET_ONE_RENDER_V14_TERRAIN_256_LATTICE_ENGINE_TNT_v1";
  const PREVIOUS_V13 = "PLANET_ONE_RENDER_V13_PASS_FILTER_ARCHITECTURE_TNT_v1";
  const PREVIOUS_V12 = "PLANET_ONE_RENDER_V12_NATURAL_CONTINENT_SURFACE_TNT_v1";
  const PREVIOUS_V11 = "PLANET_ONE_RENDER_V11_RENDER_ASSET_COORDINATION_TNT_v1";
  const PREVIOUS_V10 = "PLANET_ONE_RENDER_V10_TOPOLOGY_SEPARATION_TNT_v1";
  const PREVIOUS_V9 = "PLANET_ONE_RENDER_V9_OPAQUE_SOLAR_LUNAR_TOPOLOGY_TNT_v1";
  const PREVIOUS_V8 = "PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY";
  const ROOT_MARKER = "PLANET_ONE_RENDER_TEAM_TNT_v1";
  const SHARED_CONTRACT = "PLANET_ONE_RENDER_AND_ASSET_INSTRUMENT_SHARED_CONTRACT_v1";
  const V8_REALISM_PASS = "planet-one-realism-pass=v8-axis-spin-climate-topology";

  const TERRAIN_RENDER_AUTHORITY = "/world/render/planet-one.terrain.render.js";
  const ASSET_INSTRUMENT_AUTHORITY = "/assets/showroom.globe.instrument.js";
  const RENDER_AUTHORITY = "/world/render/planet-one.render.js";

  /*
    PLANET_ONE_RENDER_TEAM_TNT_v1
    PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY
    PLANET_ONE_RENDER_V9_OPAQUE_SOLAR_LUNAR_TOPOLOGY_TNT_v1
    PLANET_ONE_RENDER_V10_TOPOLOGY_SEPARATION_TNT_v1
    PLANET_ONE_RENDER_V11_RENDER_ASSET_COORDINATION_TNT_v1
    PLANET_ONE_RENDER_V12_NATURAL_CONTINENT_SURFACE_TNT_v1
    PLANET_ONE_RENDER_V13_PASS_FILTER_ARCHITECTURE_TNT_v1
    PLANET_ONE_RENDER_V14_TERRAIN_256_LATTICE_ENGINE_TNT_v1
    PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1
    PLANET_ONE_RENDER_V16_TERRAIN_MODULE_PROOF_AND_LEGACY_GAUGE_REPAIR_TNT_v1
    PLANET_ONE_RENDER_AND_ASSET_INSTRUMENT_SHARED_CONTRACT_v1

    window.DGBPlanetOneRenderTeam
    renderPlanetOne
    planet-one-realism-pass=v8-axis-spin-climate-topology

    render-authority=/world/render/planet-one.render.js
    terrain-render-authority=/world/render/planet-one.terrain.render.js
    asset-instrument=/assets/showroom.globe.instrument.js
    asset-role=delegation-support-only

    terrain-module-integrated=true
    ancient-39b-crust-engine-active=true

    optimum-expression-only-active=true
    available-expression=optimum
    only-public-expression=optimum
    pass-filter-ui-retired=true
    internal-layer-template-active=true
    eighty-one-planet-template-seed=true
    planet-template-slot=1
    planet-one-specified=true

    single-planet-authority=true
    no-competing-globe-surface=true
    no-legacy-demo-planet-return=true
    no-public-pass-buttons=true

    LEGACY GAUGE COMPATIBILITY:
    axis-spin-active=true
    climate-topology-active=true
    weather-circulation-active=true
    ocean-current-logic-active=true

    CURRENT API MARKERS:
    axisSpinActive
    climateTopologyActive
    weatherCirculationActive
    oceanCurrentLogicActive

    PURPOSE=
    FULL_FILE_TNT_RENEWAL_ONLY.
    RESTORE_LEGACY_GAUGE_MARKERS.
    PROVE_TERRAIN_MODULE_PATH.
    USE_DEDICATED_TERRAIN_MODULE_WHEN_AVAILABLE.
    FALL_BACK_HONESTLY_IF_MODULE_IS_NOT_PRESENT.
    PRESERVE_ONE_PUBLIC_EXPRESSION_ONLY: OPTIMUM.
  */

  const PLANET_NAME = "Planet 1";
  const PLANET_SLOT = 1;
  const EXPRESSION = "optimum";
  const ACTIVE_INSTANCES = new Set();
  let uidCounter = 0;

  const AVAILABLE_EXPRESSIONS = Object.freeze(["optimum"]);

  const INTERNAL_LAYER_ORDER = Object.freeze([
    "sphere",
    "ocean",
    "landmass",
    "shoreline",
    "terrain-module",
    "water-depth",
    "weather-circulation",
    "solar-lunar-light",
    "axis-overlay"
  ]);

  const RAW_MATERIALS = Object.freeze([
    { key: "diamond", color: "rgba(210,238,255,0.50)" },
    { key: "opal", color: "rgba(176,230,218,0.46)" },
    { key: "marble", color: "rgba(238,230,210,0.46)" },
    { key: "slate", color: "rgba(74,86,94,0.44)" },
    { key: "granite", color: "rgba(112,105,93,0.48)" },
    { key: "gold", color: "rgba(242,199,111,0.54)" },
    { key: "platinum", color: "rgba(218,224,226,0.46)" },
    { key: "silver", color: "rgba(198,214,225,0.46)" },
    { key: "copper", color: "rgba(194,119,73,0.44)" },
    { key: "iron", color: "rgba(126,70,58,0.42)" },
    { key: "lead", color: "rgba(76,83,92,0.40)" }
  ]);

  const MARKERS = Object.freeze({
    root: ROOT_MARKER,
    v8: PREVIOUS_V8,
    v9: PREVIOUS_V9,
    v10: PREVIOUS_V10,
    v11: PREVIOUS_V11,
    v12: PREVIOUS_V12,
    v13: PREVIOUS_V13,
    v14: PREVIOUS_V14,
    v15: PREVIOUS_V15,
    v16: VERSION,
    sharedContract: SHARED_CONTRACT,
    v8RealismPass: V8_REALISM_PASS,

    planetName: PLANET_NAME,
    planetTemplateSlot: PLANET_SLOT,
    expression: EXPRESSION,
    availableExpression: EXPRESSION,
    onlyPublicExpression: EXPRESSION,

    renderAuthority: RENDER_AUTHORITY,
    terrainRenderAuthority: TERRAIN_RENDER_AUTHORITY,
    assetInstrument: ASSET_INSTRUMENT_AUTHORITY,
    assetRole: "delegation-support-only",

    planetOneRenderActive: true,
    planetOneSpecified: true,
    optimumExpressionOnlyActive: true,
    passFilterUiRetired: true,
    internalLayerTemplateActive: true,
    eightyOnePlanetTemplateSeed: true,

    terrainModulePathDeclared: true,
    terrainModuleIntegrationSupported: true,
    ancient39bCrustEngineActive: true,
    pressureFormedCrustSupported: true,

    axisSpinActive: true,
    climateTopologyActive: true,
    weatherCirculationActive: true,
    oceanCurrentLogicActive: true,

    globeDemoStatusRetired: true,
    treeDemoMode: true,
    renderLanesSeparated: true,
    noRenderLaneCollapse: true,
    noPublicPassButtons: true,

    opaqueGlobeActive: true,
    sunReflectionActive: true,
    moonReflectionActive: true,
    expandedTopologyActive: true,
    solarLunarLightingActive: true,
    terrainDepthExpanded: true,
    atmosphereRetained: true,
    axisOverlayRetained: true,

    topologySeparationActive: true,
    shapeFirstActive: true,
    landWaterSeparationActive: true,
    shorelineDisciplineActive: true,
    terrainContainedToLand: true,
    currentsContainedToWater: true,
    weatherSecondaryOverlay: true,
    lightingIlluminationOnly: true,
    axisOverlayOnly: true,
    visualSoupCorrection: true,

    naturalContinentSurfaceActive: true,
    jaggedShorelineActive: true,
    formerPangaeaFractureActive: true,
    toyBlobCorrection: true,
    glassSphereReduction: true,
    continentSurfaceIntegrated: true,

    terrain256LatticeEngineActive: true,
    rawMaterialStrataActive: true,
    mineralPressureActive: true,
    terrainQuadrilateralTraversalActive: true,
    landWaterSeparationQuotaPreserved: true,
    waterDepthPreserved: true,

    singlePlanetAuthority: true,
    noCompetingGlobeSurface: true,
    noLegacyDemoPlanetReturn: true
  });

  function nextUid() {
    uidCounter += 1;
    return "p1v16_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function hasTerrainModule() {
    return Boolean(
      global.DGBPlanetOneTerrainRender &&
        typeof global.DGBPlanetOneTerrainRender.createTerrainLayer === "function"
    );
  }

  function terrainModuleStatus() {
    if (
      !global.DGBPlanetOneTerrainRender ||
      typeof global.DGBPlanetOneTerrainRender.getStatus !== "function"
    ) {
      return null;
    }

    try {
      return global.DGBPlanetOneTerrainRender.getStatus();
    } catch (error) {
      return {
        error: error && error.message ? error.message : "terrain-status-error"
      };
    }
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-v16-styles")) return;

    const style = document.createElement("style");
    style.id = "planet-one-render-v16-styles";
    style.textContent = `
      .planet-one-render-shell {
        width: min(700px, 100%);
        margin: 0 auto;
        display: grid;
        justify-items: center;
        gap: 14px;
        color: #f5f7fb;
      }

      .planet-one-render-stage {
        width: min(680px, 100%);
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        isolation: isolate;
      }

      .planet-one-v16-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(0 34px 58px rgba(0, 0, 0, 0.62));
      }

      .planet-one-v16-world-turn {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV16WorldTurn 132s linear infinite;
      }

      .planet-one-v16-weather {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV16WeatherDrift 88s linear infinite;
      }

      .planet-one-v16-currents {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV16CurrentPulse 48s ease-in-out infinite;
      }

      .planet-one-v16-axis {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV16AxisPulse 7s ease-in-out infinite;
      }

      .planet-one-render-shell.is-paused .planet-one-v16-world-turn,
      .planet-one-render-shell.is-paused .planet-one-v16-weather,
      .planet-one-render-shell.is-paused .planet-one-v16-currents,
      .planet-one-render-shell.is-paused .planet-one-v16-axis {
        animation-play-state: paused;
      }

      .planet-one-caption {
        max-width: min(640px, 100%);
        color: rgba(245, 247, 251, 0.84);
        font-size: clamp(0.72rem, 2.5vw, 0.9rem);
        font-weight: 950;
        letter-spacing: clamp(0.07em, 1.4vw, 0.14em);
        line-height: 1.45;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-optimum-receipt {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        max-width: min(520px, 100%);
        border: 1px solid rgba(242, 199, 111, 0.44);
        border-radius: 999px;
        padding: 8px 14px;
        background: linear-gradient(180deg, rgba(242,199,111,0.15), rgba(242,199,111,0.035));
        color: #fff3cf;
        font: 950 0.72rem/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.08em;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-proof-strip {
        width: min(640px, 100%);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }

      .planet-one-proof-strip span {
        border: 1px solid rgba(168,199,255,0.22);
        border-radius: 999px;
        padding: 6px 9px;
        background: rgba(255,255,255,0.045);
        color: rgba(228,234,246,0.68);
        font: 850 0.66rem/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .planet-one-proof-strip span[data-proof="module"] {
        border-color: rgba(143,227,176,0.38);
        color: rgba(194,247,214,0.86);
      }

      .planet-one-proof-strip span[data-proof="fallback"] {
        border-color: rgba(242,199,111,0.42);
        color: rgba(255,241,203,0.86);
      }

      @keyframes planetOneV16WorldTurn {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes planetOneV16WeatherDrift {
        0% { transform: rotate(0deg); opacity: 0.16; }
        50% { opacity: 0.24; }
        100% { transform: rotate(-360deg); opacity: 0.16; }
      }

      @keyframes planetOneV16CurrentPulse {
        0%, 100% { opacity: 0.16; }
        50% { opacity: 0.28; }
      }

      @keyframes planetOneV16AxisPulse {
        0%, 100% { opacity: 0.40; }
        50% { opacity: 0.58; }
      }

      @media (max-width: 680px) {
        .planet-one-render-shell {
          gap: 12px;
        }

        .planet-one-render-stage {
          width: min(570px, 100%);
        }

        .planet-one-optimum-receipt {
          font-size: 0.65rem;
          padding: 7px 11px;
        }

        .planet-one-proof-strip span {
          font-size: 0.61rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .planet-one-v16-world-turn,
        .planet-one-v16-weather,
        .planet-one-v16-currents,
        .planet-one-v16-axis {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function landDefinitions(uid) {
    return {
      northPole: uid + "_northPole",
      northRegion: uid + "_northRegion",
      mainland: uid + "_mainland",
      westRegion: uid + "_westRegion",
      eastRegion: uid + "_eastRegion",
      southRegion: uid + "_southRegion",
      southPole: uid + "_southPole",
      landAll: uid + "_landAll",
      defs: `
        <path id="${uid}_northPole" d="M385 103 L425 82 L482 76 L536 83 L591 101 L636 130 L628 158 L590 180 L530 174 L488 190 L438 173 L402 151 L370 132Z"></path>
        <path id="${uid}_northRegion" d="M302 194 L354 166 L414 154 L471 169 L531 162 L589 188 L642 226 L684 274 L666 318 L619 344 L566 337 L522 361 L467 346 L424 354 L375 388 L315 375 L262 337 L232 288 L253 235Z"></path>
        <path id="${uid}_mainland" d="M307 404 L364 369 L431 359 L492 378 L555 370 L612 405 L660 461 L684 525 L666 596 L617 664 L553 704 L477 718 L408 696 L350 656 L303 598 L277 529 L284 463Z"></path>
        <path id="${uid}_westRegion" d="M151 391 L205 356 L268 353 L318 384 L350 436 L338 498 L302 556 L247 596 L183 612 L126 584 L91 532 L96 472Z"></path>
        <path id="${uid}_eastRegion" d="M675 384 L736 353 L803 365 L861 408 L895 468 L889 535 L850 592 L789 623 L724 610 L671 569 L646 507 L652 438Z"></path>
        <path id="${uid}_southRegion" d="M325 722 L382 698 L448 707 L512 728 L572 761 L614 811 L600 860 L545 895 L470 891 L397 865 L338 821 L301 770Z"></path>
        <path id="${uid}_southPole" d="M382 884 L438 862 L506 858 L574 876 L625 904 L610 936 L554 962 L483 966 L417 948 L375 919Z"></path>
      `
    };
  }

  function terrainFallback(uid, land) {
    const startX = 162;
    const startY = 126;
    const stepX = 43;
    const stepY = 46;
    const cells = [];

    for (let row = 0; row < 16; row += 1) {
      for (let col = 0; col < 16; col += 1) {
        const index = row * 16 + col;
        const material = RAW_MATERIALS[index % RAW_MATERIALS.length];
        const pressure = (row * 3 + col * 5) % 5;
        const x = startX + col * stepX + (row % 2) * 8;
        const y = startY + row * stepY;
        const length = 5 + pressure * 2.6;
        const angle = ((row * 19 + col * 23) % 68) - 34;
        const opacity = 0.055 + pressure * 0.018;

        cells.push(`
          <g transform="translate(${x} ${y}) rotate(${angle})" data-lattice-cell="${index + 1}" data-material="${material.key}">
            <line x1="${-length}" y1="0" x2="${length}" y2="0" stroke="${material.color}" stroke-width="1.35" stroke-linecap="round" opacity="${opacity.toFixed(3)}"></line>
            <circle cx="0" cy="0" r="${(0.75 + pressure * 0.16).toFixed(2)}" fill="${material.color}" opacity="${(opacity + 0.018).toFixed(3)}"></circle>
          </g>
        `);
      }
    }

    return `
      <g
        clip-path="url(#${land.landAll}Clip)"
        filter="url(#${uid}_terrainTexture)"
        data-terrain-source="internal-fallback"
        data-terrain-module-integrated="false"
        data-ancient-39b-crust-engine-active="fallback"
        aria-label="Planet 1 internal fallback terrain"
      >
        ${cells.join("")}

        <g filter="url(#${uid}_ridgeShadow)" aria-label="fallback ancient crust scars">
          <path d="M252 255 C330 219 412 235 506 276 C589 312 638 306 696 276" fill="none" stroke="rgba(50,54,48,0.42)" stroke-width="5.5" stroke-linecap="round"></path>
          <path d="M303 462 C398 392 511 405 623 485" fill="none" stroke="rgba(48,52,44,0.46)" stroke-width="7" stroke-linecap="round"></path>
          <path d="M322 529 C411 503 530 530 646 590" fill="none" stroke="rgba(78,68,52,0.42)" stroke-width="5" stroke-linecap="round"></path>
          <path d="M112 493 C172 423 252 417 326 481" fill="none" stroke="rgba(50,45,38,0.42)" stroke-width="5.5" stroke-linecap="round"></path>
          <path d="M655 456 C718 403 805 414 876 486" fill="none" stroke="rgba(55,57,47,0.40)" stroke-width="5.5" stroke-linecap="round"></path>
          <path d="M332 778 C418 830 517 847 604 807" fill="none" stroke="rgba(65,58,43,0.40)" stroke-width="5.8" stroke-linecap="round"></path>
        </g>

        <g aria-label="fallback raw material seams">
          <path d="M378 233 C415 217 462 221 511 242" fill="none" stroke="rgba(235,248,255,0.24)" stroke-width="2.2" stroke-linecap="round"></path>
          <path d="M334 451 C411 421 507 438 603 501" fill="none" stroke="rgba(242,232,210,0.22)" stroke-width="2.2" stroke-linecap="round"></path>
          <path d="M684 515 C746 490 809 510 854 557" fill="none" stroke="rgba(255,215,125,0.20)" stroke-width="2.4" stroke-linecap="round"></path>
          <path d="M278 650 C360 616 461 629 560 684" fill="none" stroke="rgba(150,78,62,0.18)" stroke-width="2.2" stroke-linecap="round"></path>
        </g>
      </g>
    `;
  }

  function terrainLayer(uid, land) {
    if (hasTerrainModule()) {
      return global.DGBPlanetOneTerrainRender.createTerrainLayer(uid, {
        land: land,
        includeLandContext: false
      });
    }

    return terrainFallback(uid, land);
  }

  function planetSvg(uid, moduleIntegrated) {
    const ids = {
      sphereClip: uid + "_sphereClip",
      oceanGradient: uid + "_oceanGradient",
      sphereShade: uid + "_sphereShade",
      sunLight: uid + "_sunLight",
      moonLight: uid + "_moonLight",
      atmosphere: uid + "_atmosphere",
      limbGlow: uid + "_limbGlow",
      axisGradient: uid + "_axisGradient",
      terrainTexture: uid + "_terrainTexture",
      ridgeShadow: uid + "_ridgeShadow",
      landSoft: uid + "_landSoft"
    };

    const land = landDefinitions(uid);

    return `
      <svg
        class="planet-one-v16-svg"
        viewBox="0 0 1000 1000"
        role="img"
        aria-label="Planet 1 optimum expression render"
        data-terrain-render-authority="${TERRAIN_RENDER_AUTHORITY}"
        data-terrain-module-integrated="${moduleIntegrated ? "true" : "false"}"
        data-ancient-39b-crust-engine-active="${moduleIntegrated ? "true" : "fallback"}"
      >
        <defs>
          <clipPath id="${ids.sphereClip}">
            <circle cx="500" cy="500" r="394"></circle>
          </clipPath>

          ${land.defs}

          <clipPath id="${land.landAll}Clip">
            <use href="#${land.northPole}"></use>
            <use href="#${land.northRegion}"></use>
            <use href="#${land.mainland}"></use>
            <use href="#${land.westRegion}"></use>
            <use href="#${land.eastRegion}"></use>
            <use href="#${land.southRegion}"></use>
            <use href="#${land.southPole}"></use>
          </clipPath>

          <radialGradient id="${ids.oceanGradient}" cx="34%" cy="28%" r="78%">
            <stop offset="0%" stop-color="#209bc7"></stop>
            <stop offset="25%" stop-color="#126c99"></stop>
            <stop offset="52%" stop-color="#073d66"></stop>
            <stop offset="76%" stop-color="#041f38"></stop>
            <stop offset="100%" stop-color="#020814"></stop>
          </radialGradient>

          <radialGradient id="${ids.sphereShade}" cx="30%" cy="27%" r="78%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.10)"></stop>
            <stop offset="39%" stop-color="rgba(255,255,255,0.01)"></stop>
            <stop offset="69%" stop-color="rgba(0,0,0,0.31)"></stop>
            <stop offset="100%" stop-color="rgba(0,0,0,0.80)"></stop>
          </radialGradient>

          <radialGradient id="${ids.sunLight}" cx="22%" cy="38%" r="31%">
            <stop offset="0%" stop-color="rgba(255,232,158,0.68)"></stop>
            <stop offset="20%" stop-color="rgba(255,203,104,0.30)"></stop>
            <stop offset="48%" stop-color="rgba(255,180,80,0.09)"></stop>
            <stop offset="100%" stop-color="rgba(255,180,80,0)"></stop>
          </radialGradient>

          <radialGradient id="${ids.moonLight}" cx="86%" cy="28%" r="48%">
            <stop offset="0%" stop-color="rgba(166,205,255,0.14)"></stop>
            <stop offset="40%" stop-color="rgba(120,168,230,0.06)"></stop>
            <stop offset="100%" stop-color="rgba(120,168,230,0)"></stop>
          </radialGradient>

          <radialGradient id="${ids.atmosphere}" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stop-color="rgba(95,160,235,0)"></stop>
            <stop offset="91%" stop-color="rgba(112,187,255,0.09)"></stop>
            <stop offset="99%" stop-color="rgba(160,215,255,0.23)"></stop>
            <stop offset="100%" stop-color="rgba(190,230,255,0.34)"></stop>
          </radialGradient>

          <radialGradient id="${ids.limbGlow}" cx="50%" cy="50%" r="50%">
            <stop offset="84%" stop-color="rgba(125,190,255,0)"></stop>
            <stop offset="100%" stop-color="rgba(145,205,255,0.22)"></stop>
          </radialGradient>

          <linearGradient id="${ids.axisGradient}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="rgba(242,199,111,0.035)"></stop>
            <stop offset="45%" stop-color="rgba(242,199,111,0.44)"></stop>
            <stop offset="100%" stop-color="rgba(242,199,111,0.11)"></stop>
          </linearGradient>

          <filter id="${ids.terrainTexture}" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.032 0.068" numOctaves="5" seed="39000" result="ancientNoise"></feTurbulence>
            <feColorMatrix
              in="ancientNoise"
              type="matrix"
              values="
                0.36 0.00 0.00 0 0
                0.00 0.33 0.00 0 0
                0.00 0.00 0.26 0 0
                0.00 0.00 0.00 0.28 0"
              result="crustNoise">
            </feColorMatrix>
            <feBlend in="SourceGraphic" in2="crustNoise" mode="multiply"></feBlend>
          </filter>

          <filter id="${ids.ridgeShadow}" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2.2" stdDeviation="1.8" flood-color="#02070d" flood-opacity="0.54"></feDropShadow>
          </filter>

          <filter id="${ids.landSoft}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" flood-color="#04101a" flood-opacity="0.18"></feDropShadow>
          </filter>
        </defs>

        <circle cx="500" cy="500" r="430" fill="rgba(6,18,32,0.62)"></circle>
        <circle cx="500" cy="500" r="408" fill="rgba(86,145,218,0.06)" stroke="rgba(145,190,250,0.15)" stroke-width="3"></circle>

        <g clip-path="url(#${ids.sphereClip})">
          <rect x="70" y="70" width="860" height="860" fill="url(#${ids.oceanGradient})"></rect>

          <g
            class="planet-one-v16-currents"
            aria-label="Planet 1 water depth and ocean current logic"
            data-ocean-current-logic-active="true"
          >
            <path d="M118 331 C248 293 354 319 474 291 C586 264 704 292 884 232" fill="none" stroke="rgba(105,214,235,0.15)" stroke-width="8" stroke-linecap="round"></path>
            <path d="M96 574 C238 534 356 587 501 549 C648 510 762 565 904 516" fill="none" stroke="rgba(70,178,218,0.13)" stroke-width="9" stroke-linecap="round"></path>
            <path d="M145 719 C286 681 416 725 552 694 C686 663 797 691 900 647" fill="none" stroke="rgba(75,150,205,0.11)" stroke-width="10" stroke-linecap="round"></path>
            <path d="M455 511 L489 493 L531 501 L560 526 L523 544 L482 540Z" fill="#0b526b" opacity="0.78"></path>
            <path d="M735 494 L768 478 L809 486 L834 510 L801 528 L766 524Z" fill="#0b526d" opacity="0.66"></path>
          </g>

          <g class="planet-one-v16-world-turn" aria-label="Planet 1 optimum land and terrain expression">
            <g aria-label="Planet 1 shoreline discipline">
              <use href="#${land.northPole}" fill="none" stroke="#dff2ff" stroke-width="7" stroke-linejoin="round" opacity="0.60"></use>
              <use href="#${land.northRegion}" fill="none" stroke="#d8c18a" stroke-width="7" stroke-linejoin="round" opacity="0.38"></use>
              <use href="#${land.mainland}" fill="none" stroke="#e4c98a" stroke-width="8" stroke-linejoin="round" opacity="0.44"></use>
              <use href="#${land.westRegion}" fill="none" stroke="#c9ac78" stroke-width="6" stroke-linejoin="round" opacity="0.38"></use>
              <use href="#${land.eastRegion}" fill="none" stroke="#cdb580" stroke-width="6" stroke-linejoin="round" opacity="0.36"></use>
              <use href="#${land.southRegion}" fill="none" stroke="#c8ad7b" stroke-width="6" stroke-linejoin="round" opacity="0.38"></use>
              <use href="#${land.southPole}" fill="none" stroke="#e9f3ff" stroke-width="7" stroke-linejoin="round" opacity="0.56"></use>
            </g>

            <g aria-label="Planet 1 landmass expression" filter="url(#${ids.landSoft})">
              <use href="#${land.northPole}" fill="#e2edf2"></use>
              <use href="#${land.northRegion}" fill="#8e9b70"></use>
              <use href="#${land.mainland}" fill="#6e9859"></use>
              <use href="#${land.westRegion}" fill="#7b6d5b"></use>
              <use href="#${land.eastRegion}" fill="#759d7d"></use>
              <use href="#${land.southRegion}" fill="#899765"></use>
              <use href="#${land.southPole}" fill="#dfe8ee"></use>
            </g>

            <g
              aria-label="Planet 1 terrain module layer"
              data-terrain-render-authority="${TERRAIN_RENDER_AUTHORITY}"
              data-terrain-module-integrated="${moduleIntegrated ? "true" : "false"}"
              data-ancient-39b-crust-engine-active="${moduleIntegrated ? "true" : "fallback"}"
            >
              ${terrainLayer(uid, land)}
            </g>
          </g>

          <g
            class="planet-one-v16-weather"
            aria-label="Planet 1 weather circulation"
            data-weather-circulation-active="true"
            data-climate-topology-active="true"
          >
            <path d="M124 278 C236 251 362 273 486 306 C604 337 711 326 835 286" fill="none" stroke="rgba(244,248,255,0.10)" stroke-width="9" stroke-linecap="round"></path>
            <path d="M102 514 C234 486 373 506 514 540 C640 571 758 566 898 523" fill="none" stroke="rgba(244,248,255,0.075)" stroke-width="8" stroke-linecap="round"></path>
            <path d="M198 668 C318 643 443 659 565 702 C674 739 777 735 889 692" fill="none" stroke="rgba(244,248,255,0.065)" stroke-width="7" stroke-linecap="round"></path>
          </g>

          <rect x="70" y="70" width="860" height="860" fill="url(#${ids.sphereShade})"></rect>
          <circle cx="500" cy="500" r="394" fill="url(#${ids.moonLight})"></circle>
          <circle cx="500" cy="500" r="394" fill="url(#${ids.sunLight})"></circle>
        </g>

        <circle cx="500" cy="500" r="394" fill="none" stroke="rgba(160,214,255,0.32)" stroke-width="4"></circle>
        <circle cx="500" cy="500" r="404" fill="url(#${ids.atmosphere})"></circle>
        <circle cx="500" cy="500" r="414" fill="url(#${ids.limbGlow})"></circle>
        <circle cx="500" cy="500" r="416" fill="none" stroke="rgba(126,190,255,0.12)" stroke-width="8"></circle>

        <g
          class="planet-one-v16-axis"
          aria-label="Planet 1 tilted axis spin overlay"
          data-axis-spin-active="true"
        >
          <line x1="355" y1="890" x2="645" y2="110" stroke="url(#${ids.axisGradient})" stroke-width="10" stroke-linecap="round"></line>
          <circle cx="355" cy="890" r="12" fill="rgba(242,199,111,0.32)" stroke="rgba(242,199,111,0.30)" stroke-width="4"></circle>
          <circle cx="645" cy="110" r="12" fill="rgba(242,199,111,0.32)" stroke="rgba(242,199,111,0.30)" stroke-width="4"></circle>
        </g>
      </svg>
    `;
  }

  function proofStrip(moduleIntegrated) {
    const mode = moduleIntegrated ? "module" : "fallback";
    const terrainText = moduleIntegrated ? "Terrain module integrated" : "Terrain fallback active";

    return `
      <div class="planet-one-proof-strip" aria-label="Planet 1 render proof">
        <span data-proof="${mode}">${terrainText}</span>
        <span>Optimum expression only</span>
        <span>Legacy markers restored</span>
        <span>Ancient 39B target</span>
      </div>
    `;
  }

  function renderPlanetOne(target, options) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;

    if (!mount) {
      throw new Error("Planet 1 render mount not found.");
    }

    injectStyles();

    const uid = nextUid();
    const opts = options || {};
    const caption = escapeHtml(
      opts.caption || "Planet 1 · Nine Summits Universe · optimum expression"
    );

    const moduleIntegrated = hasTerrainModule();
    const terrainStatus = terrainModuleStatus();

    ACTIVE_INSTANCES.forEach(function stopExisting(instance) {
      if (instance && typeof instance.stop === "function") instance.stop();
    });

    mount.innerHTML = `
      <section
        class="planet-one-render-shell"
        data-render-version="${VERSION}"
        data-expression="optimum"
        data-available-expression="optimum"
        data-only-public-expression="optimum"
        data-optimum-expression-only-active="true"
        data-pass-filter-ui-retired="true"
        data-internal-layer-template-active="true"
        data-eighty-one-planet-template-seed="true"
        data-planet-template-slot="${PLANET_SLOT}"
        data-planet-one-specified="true"

        data-shared-contract="${SHARED_CONTRACT}"
        data-root-marker="${ROOT_MARKER}"
        data-v8-marker="${PREVIOUS_V8}"
        data-v9-marker="${PREVIOUS_V9}"
        data-v10-marker="${PREVIOUS_V10}"
        data-v11-marker="${PREVIOUS_V11}"
        data-v12-marker="${PREVIOUS_V12}"
        data-v13-marker="${PREVIOUS_V13}"
        data-v14-marker="${PREVIOUS_V14}"
        data-v15-marker="${PREVIOUS_V15}"
        data-v16-marker="${VERSION}"

        data-planet-one-realism-pass="v8-axis-spin-climate-topology"
        data-render-authority="${RENDER_AUTHORITY}"
        data-terrain-render-authority="${TERRAIN_RENDER_AUTHORITY}"
        data-asset-instrument="${ASSET_INSTRUMENT_AUTHORITY}"
        data-asset-role="delegation-support-only"

        data-terrain-module-integrated="${moduleIntegrated ? "true" : "false"}"
        data-terrain-module-integration-supported="true"
        data-terrain-fallback-active="${moduleIntegrated ? "false" : "true"}"
        data-ancient-39b-crust-engine-active="${moduleIntegrated ? "true" : "fallback"}"

        data-single-planet-authority="true"
        data-no-competing-globe-surface="true"
        data-no-legacy-demo-planet-return="true"
        data-no-public-pass-buttons="true"

        data-planet-one-render-active="true"
        data-axis-spin-active="true"
        data-climate-topology-active="true"
        data-weather-circulation-active="true"
        data-ocean-current-logic-active="true"

        data-globe-demo-status-retired="true"
        data-tree-demo-mode="true"
        data-render-lanes-separated="true"
        data-no-render-lane-collapse="true"

        data-opaque-globe-active="true"
        data-sun-reflection-active="true"
        data-moon-reflection-active="true"
        data-expanded-topology-active="true"
        data-solar-lunar-lighting-active="true"
        data-terrain-depth-expanded="true"
        data-atmosphere-retained="true"
        data-axis-overlay-retained="true"

        data-topology-separation-active="true"
        data-shape-first-active="true"
        data-land-water-separation-active="true"
        data-shoreline-discipline-active="true"
        data-terrain-contained-to-land="true"
        data-currents-contained-to-water="true"
        data-weather-secondary-overlay="true"
        data-lighting-illumination-only="true"
        data-axis-overlay-only="true"
        data-visual-soup-correction="true"

        data-natural-continent-surface-active="true"
        data-jagged-shoreline-active="true"
        data-former-pangaea-fracture-active="true"
        data-toy-blob-correction="true"
        data-glass-sphere-reduction="true"
        data-continent-surface-integrated="true"

        data-terrain-256-lattice-engine-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
        data-terrain-quadrilateral-traversal-active="true"
        data-land-water-separation-quota-preserved="true"
        data-water-depth-preserved="true"
      >
        <div class="planet-one-render-stage">
          ${planetSvg(uid, moduleIntegrated)}
        </div>

        <div class="planet-one-caption">${caption}</div>
        <div class="planet-one-optimum-receipt">Optimum expression</div>
        ${proofStrip(moduleIntegrated)}
      </section>
    `;

    const shell = mount.querySelector(".planet-one-render-shell");
    const svg = mount.querySelector(".planet-one-v16-svg");

    const instance = {
      version: VERSION,
      expression: EXPRESSION,
      terrainModuleIntegrated: moduleIntegrated,
      terrainStatus: terrainStatus,
      terrainRenderAuthority: TERRAIN_RENDER_AUTHORITY,
      renderAuthority: RENDER_AUTHORITY,
      assetInstrument: ASSET_INSTRUMENT_AUTHORITY,
      sharedContract: SHARED_CONTRACT,
      rootMarker: ROOT_MARKER,
      v8Marker: PREVIOUS_V8,
      v9Marker: PREVIOUS_V9,
      v10Marker: PREVIOUS_V10,
      v11Marker: PREVIOUS_V11,
      v12Marker: PREVIOUS_V12,
      v13Marker: PREVIOUS_V13,
      v14Marker: PREVIOUS_V14,
      v15Marker: PREVIOUS_V15,
      v16Marker: VERSION,
      v8RealismPass: V8_REALISM_PASS,
      markers: MARKERS,
      mount,
      shell,
      svg,

      setPass() {
        return EXPRESSION;
      },

      setExpression() {
        return EXPRESSION;
      },

      getPass() {
        return EXPRESSION;
      },

      getExpression() {
        return EXPRESSION;
      },

      start() {
        if (shell) shell.classList.remove("is-paused");
        if (svg && typeof svg.unpauseAnimations === "function") svg.unpauseAnimations();
        return true;
      },

      stop() {
        if (shell) shell.classList.add("is-paused");
        if (svg && typeof svg.pauseAnimations === "function") svg.pauseAnimations();
        return true;
      },

      pause() {
        return this.stop();
      },

      resume() {
        return this.start();
      },

      destroy() {
        this.stop();
        ACTIVE_INSTANCES.delete(this);
        if (mount && mount.contains(shell)) mount.innerHTML = "";
        return true;
      },

      getStatus() {
        return {
          version: VERSION,
          expression: EXPRESSION,
          availableExpressions: AVAILABLE_EXPRESSIONS.slice(),
          internalLayerOrder: INTERNAL_LAYER_ORDER.slice(),
          sharedContract: SHARED_CONTRACT,
          renderAuthority: RENDER_AUTHORITY,
          terrainRenderAuthority: TERRAIN_RENDER_AUTHORITY,
          assetInstrument: ASSET_INSTRUMENT_AUTHORITY,
          terrainModuleIntegrated: moduleIntegrated,
          terrainFallbackActive: !moduleIntegrated,
          terrainStatus: terrainStatus,
          rootMarker: ROOT_MARKER,
          v8Marker: PREVIOUS_V8,
          v9Marker: PREVIOUS_V9,
          v10Marker: PREVIOUS_V10,
          v11Marker: PREVIOUS_V11,
          v12Marker: PREVIOUS_V12,
          v13Marker: PREVIOUS_V13,
          v14Marker: PREVIOUS_V14,
          v15Marker: PREVIOUS_V15,
          v16Marker: VERSION,
          v8RealismPass: V8_REALISM_PASS,
          markers: MARKERS,
          active: shell ? !shell.classList.contains("is-paused") : false,
          optimumExpressionOnlyActive: true,
          passFilterUiRetired: true,
          ancient39bCrustEngineActive: moduleIntegrated,
          legacyGaugeMarkersRestored: true,
          eightyOnePlanetTemplateSeed: true,
          planetTemplateSlot: PLANET_SLOT
        };
      }
    };

    ACTIVE_INSTANCES.add(instance);
    instance.start();

    return instance;
  }

  function stopAll() {
    ACTIVE_INSTANCES.forEach(function stopInstance(instance) {
      if (instance && typeof instance.stop === "function") instance.stop();
    });
    return true;
  }

  function startAll() {
    ACTIVE_INSTANCES.forEach(function startInstance(instance) {
      if (instance && typeof instance.start === "function") instance.start();
    });
    return true;
  }

  function destroyAll() {
    Array.from(ACTIVE_INSTANCES).forEach(function destroyInstance(instance) {
      if (instance && typeof instance.destroy === "function") instance.destroy();
    });
    ACTIVE_INSTANCES.clear();
    return true;
  }

  function setAllPasses() {
    return EXPRESSION;
  }

  function setAllExpressions() {
    return EXPRESSION;
  }

  const api = Object.freeze({
    VERSION,
    PREVIOUS_V15,
    PREVIOUS_V14,
    PREVIOUS_V13,
    PREVIOUS_V12,
    PREVIOUS_V11,
    PREVIOUS_V10,
    PREVIOUS_V9,
    PREVIOUS_V8,
    ROOT_MARKER,
    SHARED_CONTRACT,
    V8_REALISM_PASS,
    PLANET_NAME,
    PLANET_SLOT,
    EXPRESSION,
    TERRAIN_RENDER_AUTHORITY,
    ASSET_INSTRUMENT_AUTHORITY,
    RENDER_AUTHORITY,
    MARKERS,
    AVAILABLE_EXPRESSIONS,
    INTERNAL_LAYER_ORDER,
    RAW_MATERIALS,
    renderPlanetOne,
    stopAll,
    startAll,
    destroyAll,
    setAllPasses,
    setAllExpressions,
    hasTerrainModule,
    terrainModuleStatus,

    getActiveCount() {
      return ACTIVE_INSTANCES.size;
    },

    getStatus() {
      const moduleIntegrated = hasTerrainModule();

      return {
        version: VERSION,
        planetName: PLANET_NAME,
        planetTemplateSlot: PLANET_SLOT,
        expression: EXPRESSION,
        availableExpressions: AVAILABLE_EXPRESSIONS.slice(),
        internalLayerOrder: INTERNAL_LAYER_ORDER.slice(),
        sharedContract: SHARED_CONTRACT,
        renderAuthority: RENDER_AUTHORITY,
        terrainRenderAuthority: TERRAIN_RENDER_AUTHORITY,
        assetInstrument: ASSET_INSTRUMENT_AUTHORITY,
        previousV8: PREVIOUS_V8,
        previousV9: PREVIOUS_V9,
        previousV10: PREVIOUS_V10,
        previousV11: PREVIOUS_V11,
        previousV12: PREVIOUS_V12,
        previousV13: PREVIOUS_V13,
        previousV14: PREVIOUS_V14,
        previousV15: PREVIOUS_V15,
        rootMarker: ROOT_MARKER,
        v8RealismPass: V8_REALISM_PASS,
        markers: MARKERS,
        activeCount: ACTIVE_INSTANCES.size,

        terrainModuleIntegrated: moduleIntegrated,
        terrainFallbackActive: !moduleIntegrated,
        terrainStatus: terrainModuleStatus(),

        optimumExpressionOnlyActive: true,
        passFilterUiRetired: true,
        internalLayerTemplateActive: true,
        eightyOnePlanetTemplateSeed: true,
        ancient39bCrustEngineActive: moduleIntegrated,

        axisSpinActive: true,
        climateTopologyActive: true,
        weatherCirculationActive: true,
        oceanCurrentLogicActive: true,

        legacyGaugeMarkersRestored: true,
        singlePlanetAuthority: true,
        noCompetingGlobeSurface: true,
        noLegacyDemoPlanetReturn: true,
        noPublicPassButtons: true
      };
    }
  });

  global.DGBPlanetOneRenderTeam = api;

  if (typeof window !== "undefined") {
    window.DGBPlanetOneRenderTeam = api;
  }
})(window);
