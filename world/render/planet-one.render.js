(function attachPlanetOneRenderTeam(global) {
  "use strict";

  const VERSION = "PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1";
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
    PLANET_ONE_RENDER_AND_ASSET_INSTRUMENT_SHARED_CONTRACT_v1

    window.DGBPlanetOneRenderTeam
    planet-one-realism-pass=v8-axis-spin-climate-topology

    render-authority=/world/render/planet-one.render.js
    asset-instrument=/assets/showroom.globe.instrument.js
    asset-role=delegation-support-only
    single-planet-authority=true
    no-competing-globe-surface=true
    no-legacy-demo-planet-return=true

    v15:
    optimum-expression-only-active=true
    pass-filter-ui-retired=true
    available-expression=optimum
    only-public-expression=optimum
    internal-layer-template-active=true
    eighty-one-planet-template-seed=true
    planet-template-slot=1
    planet-one-specified=true
  */

  const PLANET_NAME = "Planet 1";
  const PLANET_SLOT = 1;
  const AVAILABLE_EXPRESSIONS = Object.freeze(["optimum"]);
  const INTERNAL_LAYER_ORDER = Object.freeze([
    "sphere",
    "ocean",
    "landmass",
    "shoreline",
    "terrain",
    "water-depth",
    "weather",
    "light",
    "axis"
  ]);

  const RAW_MATERIALS = Object.freeze([
    { key: "diamond", color: "rgba(210, 238, 255, 0.50)" },
    { key: "opal", color: "rgba(176, 230, 218, 0.46)" },
    { key: "marble", color: "rgba(238, 230, 210, 0.46)" },
    { key: "slate", color: "rgba(74, 86, 94, 0.44)" },
    { key: "granite", color: "rgba(112, 105, 93, 0.48)" },
    { key: "gold", color: "rgba(242, 199, 111, 0.54)" },
    { key: "platinum", color: "rgba(218, 224, 226, 0.46)" },
    { key: "silver", color: "rgba(198, 214, 225, 0.46)" },
    { key: "copper", color: "rgba(194, 119, 73, 0.44)" },
    { key: "iron", color: "rgba(126, 70, 58, 0.42)" },
    { key: "lead", color: "rgba(76, 83, 92, 0.40)" }
  ]);

  const ACTIVE_INSTANCES = new Set();
  let uidCounter = 0;

  const MARKERS = Object.freeze({
    root: ROOT_MARKER,
    v8: PREVIOUS_V8,
    v9: PREVIOUS_V9,
    v10: PREVIOUS_V10,
    v11: PREVIOUS_V11,
    v12: PREVIOUS_V12,
    v13: PREVIOUS_V13,
    v14: PREVIOUS_V14,
    v15: VERSION,
    sharedContract: SHARED_CONTRACT,
    v8RealismPass: V8_REALISM_PASS,

    planetOneRenderActive: true,
    axisSpinActive: true,
    climateTopologyActive: true,
    weatherCirculationActive: true,
    oceanCurrentLogicActive: true,

    globeDemoStatusRetired: true,
    treeDemoMode: true,
    renderLanesSeparated: true,
    noRenderLaneCollapse: true,

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

    passFilterArchitectureActive: true,
    renderPassFilterActive: false,
    passFilterUiRetired: true,
    singlePassInspectionActive: false,
    compositeEarnedNotGuessed: true,

    terrain256LatticeEngineActive: true,
    rawMaterialStrataActive: true,
    mineralPressureActive: true,
    terrainQuadrilateralTraversalActive: true,
    landWaterSeparationQuotaPreserved: true,
    waterDepthPreserved: true,

    optimumExpressionOnlyActive: true,
    onlyPublicExpression: "optimum",
    availableExpression: "optimum",
    internalLayerTemplateActive: true,
    eightyOnePlanetTemplateSeed: true,
    planetTemplateSlot: PLANET_SLOT,
    planetOneSpecified: true,

    renderAuthority: "/world/render/planet-one.render.js",
    assetInstrument: "/assets/showroom.globe.instrument.js",
    assetRole: "delegation-support-only",
    singlePlanetAuthority: true,
    noCompetingGlobeSurface: true,
    noLegacyDemoPlanetReturn: true
  });

  function nextUid() {
    uidCounter += 1;
    return "p1v15_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-v15-styles")) return;

    const style = document.createElement("style");
    style.id = "planet-one-render-v15-styles";
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

      .planet-one-v15-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(0 34px 58px rgba(0, 0, 0, 0.62));
      }

      .planet-one-v15-world-turn {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV15WorldTurn 132s linear infinite;
      }

      .planet-one-v15-weather {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV15WeatherDrift 88s linear infinite;
      }

      .planet-one-v15-currents {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV15CurrentPulse 48s ease-in-out infinite;
      }

      .planet-one-v15-axis {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV15AxisPulse 7s ease-in-out infinite;
      }

      .planet-one-render-shell.is-paused .planet-one-v15-world-turn,
      .planet-one-render-shell.is-paused .planet-one-v15-weather,
      .planet-one-render-shell.is-paused .planet-one-v15-currents,
      .planet-one-render-shell.is-paused .planet-one-v15-axis {
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
        max-width: min(420px, 100%);
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

      @keyframes planetOneV15WorldTurn {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes planetOneV15WeatherDrift {
        0% { transform: rotate(0deg); opacity: 0.16; }
        50% { opacity: 0.24; }
        100% { transform: rotate(-360deg); opacity: 0.16; }
      }

      @keyframes planetOneV15CurrentPulse {
        0%, 100% { opacity: 0.16; }
        50% { opacity: 0.28; }
      }

      @keyframes planetOneV15AxisPulse {
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
      }

      @media (prefers-reduced-motion: reduce) {
        .planet-one-v15-world-turn,
        .planet-one-v15-weather,
        .planet-one-v15-currents,
        .planet-one-v15-axis {
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
    const startX = 170;
    const startY = 135;
    const stepX = 42;
    const stepY = 45;
    const cells = [];

    for (let row = 0; row < 16; row += 1) {
      for (let col = 0; col < 16; col += 1) {
        const index = row * 16 + col;
        const material = RAW_MATERIALS[index % RAW_MATERIALS.length];
        const pressure = (row + col) % 4;
        const x = startX + col * stepX + (row % 2) * 7;
        const y = startY + row * stepY;
        const length = 7 + pressure * 3;
        const angle = ((row * 13 + col * 17) % 55) - 27;
        const opacity = 0.12 + pressure * 0.03;

        cells.push(`
          <g transform="translate(${x} ${y}) rotate(${angle})" data-lattice-cell="${index + 1}" data-material="${material.key}">
            <line x1="${-length}" y1="0" x2="${length}" y2="0" stroke="${material.color}" stroke-width="2" stroke-linecap="round" opacity="${opacity.toFixed(2)}"></line>
            <circle cx="0" cy="0" r="${(1.1 + pressure * 0.25).toFixed(2)}" fill="${material.color}" opacity="${(opacity + 0.04).toFixed(2)}"></circle>
          </g>
        `);
      }
    }

    return `
      <g clip-path="url(#${land.landAll}Clip)" filter="url(#${uid}_terrainTexture)" aria-label="Planet 1 fallback terrain lattice">
        ${cells.join("")}

        <path d="M270 279 C350 238 469 232 594 291" fill="none" stroke="rgba(218,195,140,0.44)" stroke-width="9" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
        <path d="M283 329 C380 306 502 312 628 346" fill="none" stroke="rgba(93,112,76,0.34)" stroke-width="12" stroke-linecap="round"></path>
        <path d="M320 481 C418 426 541 430 633 491" fill="none" stroke="rgba(218,196,131,0.46)" stroke-width="10" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
        <path d="M314 560 C421 535 540 553 649 604" fill="none" stroke="rgba(65,108,61,0.34)" stroke-width="13" stroke-linecap="round"></path>
        <path d="M408 659 C477 681 555 672 615 633" fill="none" stroke="rgba(183,154,98,0.34)" stroke-width="8" stroke-linecap="round"></path>
        <path d="M114 500 C170 443 239 434 318 482" fill="none" stroke="rgba(191,162,105,0.38)" stroke-width="9" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
        <path d="M660 462 C718 417 804 422 870 480" fill="none" stroke="rgba(216,195,138,0.36)" stroke-width="9" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
        <path d="M338 784 C419 814 506 840 592 813" fill="none" stroke="rgba(189,157,99,0.34)" stroke-width="9" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
      </g>
    `;
  }

  function terrainLayer(uid, land) {
    if (
      global.DGBPlanetOneTerrainRender &&
      typeof global.DGBPlanetOneTerrainRender.createTerrainLayer === "function"
    ) {
      return global.DGBPlanetOneTerrainRender.createTerrainLayer(uid, {
        land: land,
        includeLandContext: false
      });
    }

    return terrainFallback(uid, land);
  }

  function planetSvg(uid) {
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
      <svg class="planet-one-v15-svg" viewBox="0 0 1000 1000" role="img" aria-label="Planet 1 optimum expression render">
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

          <filter id="${ids.terrainTexture}" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.044" numOctaves="4" seed="256" result="noise"></feTurbulence>
            <feColorMatrix
              in="noise"
              type="matrix"
              values="
                0.32 0.00 0.00 0 0
                0.00 0.38 0.00 0 0
                0.00 0.00 0.28 0 0
                0.00 0.00 0.00 0.20 0"
              result="texture">
            </feColorMatrix>
            <feBlend in="SourceGraphic" in2="texture" mode="multiply"></feBlend>
          </filter>

          <filter id="${ids.ridgeShadow}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.1" flood-color="#04101a" flood-opacity="0.40"></feDropShadow>
          </filter>

          <filter id="${ids.landSoft}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" flood-color="#04101a" flood-opacity="0.18"></feDropShadow>
          </filter>
        </defs>

        <circle cx="500" cy="500" r="430" fill="rgba(6,18,32,0.62)"></circle>
        <circle cx="500" cy="500" r="408" fill="rgba(86,145,218,0.06)" stroke="rgba(145,190,250,0.15)" stroke-width="3"></circle>

        <g clip-path="url(#${ids.sphereClip})">
          <rect x="70" y="70" width="860" height="860" fill="url(#${ids.oceanGradient})"></rect>

          <g class="planet-one-v15-currents" aria-label="Planet 1 water depth and current layer">
            <path d="M118 331 C248 293 354 319 474 291 C586 264 704 292 884 232" fill="none" stroke="rgba(105,214,235,0.15)" stroke-width="8" stroke-linecap="round"></path>
            <path d="M96 574 C238 534 356 587 501 549 C648 510 762 565 904 516" fill="none" stroke="rgba(70,178,218,0.13)" stroke-width="9" stroke-linecap="round"></path>
            <path d="M145 719 C286 681 416 725 552 694 C686 663 797 691 900 647" fill="none" stroke="rgba(75,150,205,0.11)" stroke-width="10" stroke-linecap="round"></path>
            <path d="M455 511 L489 493 L531 501 L560 526 L523 544 L482 540Z" fill="#0b526b" opacity="0.78"></path>
            <path d="M735 494 L768 478 L809 486 L834 510 L801 528 L766 524Z" fill="#0b526d" opacity="0.66"></path>
          </g>

          <g class="planet-one-v15-world-turn" aria-label="Planet 1 optimum land and terrain expression">
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

            <g aria-label="Planet 1 terrain module layer">
              ${terrainLayer(uid, land)}
            </g>
          </g>

          <g class="planet-one-v15-weather" aria-label="Planet 1 secondary weather layer">
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

        <g class="planet-one-v15-axis" aria-label="Planet 1 axis overlay">
          <line x1="355" y1="890" x2="645" y2="110" stroke="url(#${ids.axisGradient})" stroke-width="10" stroke-linecap="round"></line>
          <circle cx="355" cy="890" r="12" fill="rgba(242,199,111,0.32)" stroke="rgba(242,199,111,0.30)" stroke-width="4"></circle>
          <circle cx="645" cy="110" r="12" fill="rgba(242,199,111,0.32)" stroke="rgba(242,199,111,0.30)" stroke-width="4"></circle>
        </g>
      </svg>
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
        data-v15-marker="${VERSION}"
        data-planet-one-realism-pass="v8-axis-spin-climate-topology"
        data-render-authority="/world/render/planet-one.render.js"
        data-asset-instrument="/assets/showroom.globe.instrument.js"
        data-asset-role="delegation-support-only"
        data-single-planet-authority="true"
        data-no-competing-globe-surface="true"
        data-no-legacy-demo-planet-return="true"
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
          ${planetSvg(uid)}
        </div>

        <div class="planet-one-caption">${caption}</div>
        <div class="planet-one-optimum-receipt">Optimum expression</div>
      </section>
    `;

    const shell = mount.querySelector(".planet-one-render-shell");
    const svg = mount.querySelector(".planet-one-v15-svg");

    const instance = {
      version: VERSION,
      expression: "optimum",
      sharedContract: SHARED_CONTRACT,
      rootMarker: ROOT_MARKER,
      v8Marker: PREVIOUS_V8,
      v9Marker: PREVIOUS_V9,
      v10Marker: PREVIOUS_V10,
      v11Marker: PREVIOUS_V11,
      v12Marker: PREVIOUS_V12,
      v13Marker: PREVIOUS_V13,
      v14Marker: PREVIOUS_V14,
      v15Marker: VERSION,
      v8RealismPass: V8_REALISM_PASS,
      markers: MARKERS,
      mount,
      shell,
      svg,

      setPass() {
        return "optimum";
      },

      setExpression() {
        return "optimum";
      },

      getPass() {
        return "optimum";
      },

      getExpression() {
        return "optimum";
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
          expression: "optimum",
          availableExpressions: AVAILABLE_EXPRESSIONS.slice(),
          internalLayerOrder: INTERNAL_LAYER_ORDER.slice(),
          sharedContract: SHARED_CONTRACT,
          rootMarker: ROOT_MARKER,
          v8Marker: PREVIOUS_V8,
          v9Marker: PREVIOUS_V9,
          v10Marker: PREVIOUS_V10,
          v11Marker: PREVIOUS_V11,
          v12Marker: PREVIOUS_V12,
          v13Marker: PREVIOUS_V13,
          v14Marker: PREVIOUS_V14,
          v15Marker: VERSION,
          v8RealismPass: V8_REALISM_PASS,
          markers: MARKERS,
          active: shell ? !shell.classList.contains("is-paused") : false,
          optimumExpressionOnlyActive: true,
          passFilterUiRetired: true,
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
    return "optimum";
  }

  function setAllExpressions() {
    return "optimum";
  }

  const api = Object.freeze({
    VERSION,
    PLANET_NAME,
    PLANET_SLOT,
    SHARED_CONTRACT,
    PREVIOUS_V8,
    PREVIOUS_V9,
    PREVIOUS_V10,
    PREVIOUS_V11,
    PREVIOUS_V12,
    PREVIOUS_V13,
    PREVIOUS_V14,
    ROOT_MARKER,
    V8_REALISM_PASS,
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

    getActiveCount() {
      return ACTIVE_INSTANCES.size;
    },

    getStatus() {
      return {
        version: VERSION,
        planetName: PLANET_NAME,
        planetTemplateSlot: PLANET_SLOT,
        expression: "optimum",
        availableExpressions: AVAILABLE_EXPRESSIONS.slice(),
        internalLayerOrder: INTERNAL_LAYER_ORDER.slice(),
        sharedContract: SHARED_CONTRACT,
        previousV8: PREVIOUS_V8,
        previousV9: PREVIOUS_V9,
        previousV10: PREVIOUS_V10,
        previousV11: PREVIOUS_V11,
        previousV12: PREVIOUS_V12,
        previousV13: PREVIOUS_V13,
        previousV14: PREVIOUS_V14,
        rootMarker: ROOT_MARKER,
        v8RealismPass: V8_REALISM_PASS,
        markers: MARKERS,
        activeCount: ACTIVE_INSTANCES.size,
        optimumExpressionOnlyActive: true,
        passFilterUiRetired: true,
        internalLayerTemplateActive: true,
        eightyOnePlanetTemplateSeed: true,
        singlePlanetAuthority: true,
        noCompetingGlobeSurface: true,
        noLegacyDemoPlanetReturn: true
      };
    }
  });

  global.DGBPlanetOneRenderTeam = api;

  if (typeof window !== "undefined") {
    window.DGBPlanetOneRenderTeam = api;
  }
})(window);
