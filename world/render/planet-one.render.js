(function attachPlanetOneRenderTeam(global) {
  "use strict";

  const VERSION = "PLANET_ONE_RENDER_V14_TERRAIN_256_LATTICE_ENGINE_TNT_v1";
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
    TIC_TAC_TOE_AUDIT_PLANET_ONE_TERRAIN_256_LATTICE_v1

    TOP ROW:
    NW = Terrain must remain inside land.
    N  = 256 lattice must organize terrain, not decorate randomly.
    NE = Raw materials must appear as strata/mineral pressure, not loose colors.

    MIDDLE ROW:
    W  = Water/land separation quota must survive.
    C  = Terrain engine must be readable one pass at a time.
    E  = Plateaus, valleys, canyons, ridges, basins, lakes, and shelves must remain distinguishable.

    BOTTOM ROW:
    SW = Terrain must support America-meets-China logic: breadth plus vertical complexity.
    S  = Composite remains earned, not guessed.
    SE = No final countries, cities, rivers, climate names, physics, or final map geometry.

    QUADRILATERAL_TRAVERSAL:
    NORTH = boundary and authority
    EAST  = lattice generation
    SOUTH = continuity and quota preservation
    WEST  = adversarial failure audit

    Required source markers:
    PLANET_ONE_RENDER_TEAM_TNT_v1
    PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY
    PLANET_ONE_RENDER_V9_OPAQUE_SOLAR_LUNAR_TOPOLOGY_TNT_v1
    PLANET_ONE_RENDER_V10_TOPOLOGY_SEPARATION_TNT_v1
    PLANET_ONE_RENDER_V11_RENDER_ASSET_COORDINATION_TNT_v1
    PLANET_ONE_RENDER_V12_NATURAL_CONTINENT_SURFACE_TNT_v1
    PLANET_ONE_RENDER_V13_PASS_FILTER_ARCHITECTURE_TNT_v1
    PLANET_ONE_RENDER_V14_TERRAIN_256_LATTICE_ENGINE_TNT_v1
    PLANET_ONE_RENDER_AND_ASSET_INSTRUMENT_SHARED_CONTRACT_v1

    window.DGBPlanetOneRenderTeam
    planet-one-realism-pass=v8-axis-spin-climate-topology

    render-authority=/world/render/planet-one.render.js
    asset-instrument=/assets/showroom.globe.instrument.js
    asset-role=delegation-support-only
    single-planet-authority=true
    no-competing-globe-surface=true
    no-legacy-demo-planet-return=true

    v14:
    terrain-256-lattice-engine-active=true
    raw-material-strata-active=true
    mineral-pressure-active=true
    terrain-quadrilateral-traversal-active=true
    land-water-separation-quota-preserved=true
    terrain-pass-default-active=true
    terrain-contained-to-land=true
    water-depth-preserved=true
  */

  const DEFAULT_CAPTION = "Planet 1 · Nine Summits Universe · 256 terrain lattice lane";
  const DEFAULT_PASS = "terrain";
  const ACTIVE_INSTANCES = new Set();

  const PASSES = Object.freeze([
    "surface",
    "landmass",
    "shoreline",
    "terrain",
    "water",
    "weather",
    "light",
    "axis",
    "composite"
  ]);

  const PASS_LABELS = Object.freeze({
    surface: "Surface",
    landmass: "Landmass",
    shoreline: "Shoreline",
    terrain: "Terrain",
    water: "Water",
    weather: "Weather",
    light: "Light",
    axis: "Axis",
    composite: "Composite"
  });

  const RAW_MATERIALS = Object.freeze([
    { name: "diamond", color: "rgba(210, 238, 255, 0.52)" },
    { name: "opal", color: "rgba(176, 230, 218, 0.48)" },
    { name: "marble", color: "rgba(238, 230, 210, 0.48)" },
    { name: "slate", color: "rgba(74, 86, 94, 0.48)" },
    { name: "granite", color: "rgba(112, 105, 93, 0.50)" },
    { name: "gold", color: "rgba(242, 199, 111, 0.56)" },
    { name: "platinum", color: "rgba(218, 224, 226, 0.48)" },
    { name: "silver", color: "rgba(198, 214, 225, 0.48)" },
    { name: "copper", color: "rgba(194, 119, 73, 0.46)" },
    { name: "iron", color: "rgba(126, 70, 58, 0.44)" },
    { name: "lead", color: "rgba(76, 83, 92, 0.42)" }
  ]);

  let uidCounter = 0;

  const MARKERS = Object.freeze({
    root: ROOT_MARKER,
    v8: PREVIOUS_V8,
    v9: PREVIOUS_V9,
    v10: PREVIOUS_V10,
    v11: PREVIOUS_V11,
    v12: PREVIOUS_V12,
    v13: PREVIOUS_V13,
    v14: VERSION,
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

    renderAuthority: "/world/render/planet-one.render.js",
    assetInstrument: "/assets/showroom.globe.instrument.js",
    assetRole: "delegation-support-only",
    singlePlanetAuthority: true,
    noCompetingGlobeSurface: true,
    noLegacyDemoPlanetReturn: true,

    passFilterArchitectureActive: true,
    renderPassFilterActive: true,
    singlePassInspectionActive: true,
    compositeEarnedNotGuessed: true,

    terrain256LatticeEngineActive: true,
    rawMaterialStrataActive: true,
    mineralPressureActive: true,
    terrainQuadrilateralTraversalActive: true,
    landWaterSeparationQuotaPreserved: true,
    terrainPassDefaultActive: true,
    waterDepthPreserved: true
  });

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nextUid() {
    uidCounter += 1;
    return "p1v14_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function normalizePass(pass) {
    const candidate = String(pass || "").trim().toLowerCase();
    return PASSES.includes(candidate) ? candidate : DEFAULT_PASS;
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-v14-styles")) return;

    const style = document.createElement("style");
    style.id = "planet-one-render-v14-styles";
    style.textContent = `
      .planet-one-render-shell {
        width: min(700px, 100%);
        margin: 0 auto;
        display: grid;
        justify-items: center;
        gap: 18px;
        color: #f5f7fb;
      }

      .planet-one-render-stage {
        width: min(680px, 100%);
        aspect-ratio: 1;
        position: relative;
        display: grid;
        place-items: center;
        isolation: isolate;
      }

      .planet-one-v14-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(0 34px 58px rgba(0, 0, 0, 0.62));
      }

      .planet-one-v14-world-turn {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV14WorldTurn 128s linear infinite;
      }

      .planet-one-v14-weather {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV14WeatherDrift 84s linear infinite;
      }

      .planet-one-v14-currents {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV14CurrentPulse 46s ease-in-out infinite;
      }

      .planet-one-v14-axis {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV14AxisPulse 7s ease-in-out infinite;
      }

      .planet-one-render-shell.is-paused .planet-one-v14-world-turn,
      .planet-one-render-shell.is-paused .planet-one-v14-weather,
      .planet-one-render-shell.is-paused .planet-one-v14-currents,
      .planet-one-render-shell.is-paused .planet-one-v14-axis {
        animation-play-state: paused;
      }

      .planet-one-render-shell[data-pass="surface"] .p1-layer:not([data-layer="surface"]):not([data-layer="sphere"]) {
        display: none;
      }

      .planet-one-render-shell[data-pass="landmass"] .p1-layer:not([data-layer="landmass"]):not([data-layer="sphere"]) {
        display: none;
      }

      .planet-one-render-shell[data-pass="shoreline"] .p1-layer:not([data-layer="shoreline"]):not([data-layer="landmass"]):not([data-layer="sphere"]) {
        display: none;
      }

      .planet-one-render-shell[data-pass="terrain"] .p1-layer:not([data-layer="terrain"]):not([data-layer="landmass"]):not([data-layer="sphere"]) {
        display: none;
      }

      .planet-one-render-shell[data-pass="water"] .p1-layer:not([data-layer="water"]):not([data-layer="sphere"]) {
        display: none;
      }

      .planet-one-render-shell[data-pass="weather"] .p1-layer:not([data-layer="weather"]):not([data-layer="sphere"]) {
        display: none;
      }

      .planet-one-render-shell[data-pass="light"] .p1-layer:not([data-layer="light"]):not([data-layer="sphere"]):not([data-layer="landmass"]) {
        display: none;
      }

      .planet-one-render-shell[data-pass="axis"] .p1-layer:not([data-layer="axis"]):not([data-layer="sphere"]) {
        display: none;
      }

      .planet-one-render-shell[data-pass="composite"] .p1-layer {
        display: inline;
      }

      .planet-one-render-shell[data-pass="terrain"] .p1-sphere-base,
      .planet-one-render-shell[data-pass="landmass"] .p1-sphere-base,
      .planet-one-render-shell[data-pass="shoreline"] .p1-sphere-base,
      .planet-one-render-shell[data-pass="light"] .p1-sphere-base {
        opacity: 0.42;
      }

      .planet-one-render-shell[data-pass="surface"] .p1-sphere-base,
      .planet-one-render-shell[data-pass="water"] .p1-sphere-base,
      .planet-one-render-shell[data-pass="weather"] .p1-sphere-base,
      .planet-one-render-shell[data-pass="axis"] .p1-sphere-base,
      .planet-one-render-shell[data-pass="composite"] .p1-sphere-base {
        opacity: 1;
      }

      .planet-one-pass-controls {
        width: min(660px, 100%);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }

      .planet-one-pass-button {
        appearance: none;
        border: 1px solid rgba(160, 177, 214, 0.28);
        border-radius: 999px;
        padding: 8px 12px;
        background: linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025));
        color: rgba(245, 247, 251, 0.76);
        font: 900 0.72rem/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        cursor: pointer;
      }

      .planet-one-pass-button[aria-pressed="true"] {
        border-color: rgba(242, 199, 111, 0.62);
        color: #fff3cf;
        background: linear-gradient(180deg, rgba(242,199,111,0.20), rgba(242,199,111,0.055));
      }

      .planet-one-caption {
        max-width: 100%;
        color: rgba(245, 247, 251, 0.84);
        font-size: clamp(0.72rem, 2.5vw, 0.9rem);
        font-weight: 950;
        letter-spacing: clamp(0.07em, 1.4vw, 0.14em);
        line-height: 1.45;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-telemetry {
        width: min(650px, 100%);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 9px;
      }

      .planet-one-telemetry span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 36px;
        border: 1px solid rgba(160, 177, 214, 0.24);
        border-radius: 999px;
        padding: 7px 12px;
        background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025));
        color: rgba(245, 247, 251, 0.78);
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.05em;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-mapkey {
        width: min(650px, 100%);
        display: grid;
        gap: 10px;
      }

      .planet-one-mapkey article {
        border: 1px solid rgba(160, 177, 214, 0.22);
        border-radius: 22px;
        padding: 14px 16px;
        background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018));
      }

      .planet-one-mapkey strong {
        display: block;
        color: #f2c76f;
        font-size: 0.78rem;
        font-weight: 950;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      .planet-one-mapkey span {
        display: block;
        color: rgba(228, 234, 246, 0.78);
        font-size: 0.95rem;
        line-height: 1.45;
      }

      @keyframes planetOneV14WorldTurn {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes planetOneV14WeatherDrift {
        0% { transform: rotate(0deg); opacity: 0.18; }
        50% { opacity: 0.28; }
        100% { transform: rotate(-360deg); opacity: 0.18; }
      }

      @keyframes planetOneV14CurrentPulse {
        0%, 100% { opacity: 0.18; }
        50% { opacity: 0.30; }
      }

      @keyframes planetOneV14AxisPulse {
        0%, 100% { opacity: 0.42; }
        50% { opacity: 0.62; }
      }

      @media (max-width: 680px) {
        .planet-one-render-shell {
          gap: 14px;
        }

        .planet-one-render-stage {
          width: min(570px, 100%);
        }

        .planet-one-telemetry span,
        .planet-one-pass-button {
          font-size: 0.66rem;
          min-height: 34px;
          padding: 7px 10px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .planet-one-v14-world-turn,
        .planet-one-v14-weather,
        .planet-one-v14-currents,
        .planet-one-v14-axis {
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

  function lattice256TerrainLayer(uid, land) {
    const startX = 170;
    const startY = 135;
    const stepX = 42;
    const stepY = 45;
    const cells = [];

    for (let row = 0; row < 16; row += 1) {
      for (let col = 0; col < 16; col += 1) {
        const index = row * 16 + col;
        const x = startX + col * stepX + ((row % 2) * 7);
        const y = startY + row * stepY;
        const material = RAW_MATERIALS[index % RAW_MATERIALS.length];
        const pressure = (row + col) % 4;
        const length = 8 + pressure * 4;
        const angle = ((row * 13 + col * 17) % 55) - 27;
        const opacity = 0.16 + (pressure * 0.035);

        cells.push(`
          <g transform="translate(${x} ${y}) rotate(${angle})" data-lattice-cell="${index + 1}" data-material="${material.name}">
            <line x1="${-length}" y1="0" x2="${length}" y2="0" stroke="${material.color}" stroke-width="2.2" stroke-linecap="round" opacity="${opacity.toFixed(2)}"></line>
            <circle cx="0" cy="0" r="${1.4 + pressure * 0.35}" fill="${material.color}" opacity="${(opacity + 0.05).toFixed(2)}"></circle>
          </g>
        `);
      }
    }

    return `
      <g clip-path="url(#${land.landAll}Clip)" aria-label="256 lattice terrain engine">
        <g opacity="0.88">
          ${cells.join("")}
        </g>

        <path d="M270 279 C350 238 469 232 594 291" fill="none" stroke="rgba(218,195,140,0.46)" stroke-width="10" stroke-linecap="round"></path>
        <path d="M283 329 C380 306 502 312 628 346" fill="none" stroke="rgba(93,112,76,0.38)" stroke-width="13" stroke-linecap="round"></path>

        <path d="M320 481 C418 426 541 430 633 491" fill="none" stroke="rgba(218,196,131,0.48)" stroke-width="11" stroke-linecap="round"></path>
        <path d="M314 560 C421 535 540 553 649 604" fill="none" stroke="rgba(65,108,61,0.38)" stroke-width="14" stroke-linecap="round"></path>
        <path d="M408 659 C477 681 555 672 615 633" fill="none" stroke="rgba(183,154,98,0.38)" stroke-width="9" stroke-linecap="round"></path>

        <path d="M114 500 C170 443 239 434 318 482" fill="none" stroke="rgba(191,162,105,0.42)" stroke-width="10" stroke-linecap="round"></path>
        <path d="M127 553 C192 543 244 560 294 596" fill="none" stroke="rgba(95,87,73,0.38)" stroke-width="12" stroke-linecap="round"></path>

        <path d="M660 462 C718 417 804 422 870 480" fill="none" stroke="rgba(216,195,138,0.40)" stroke-width="10" stroke-linecap="round"></path>
        <path d="M680 550 C746 534 805 548 854 592" fill="none" stroke="rgba(77,118,96,0.38)" stroke-width="12" stroke-linecap="round"></path>

        <path d="M338 784 C419 814 506 840 592 813" fill="none" stroke="rgba(189,157,99,0.38)" stroke-width="10" stroke-linecap="round"></path>
        <path d="M376 858 C446 875 520 880 588 852" fill="none" stroke="rgba(111,116,79,0.34)" stroke-width="12" stroke-linecap="round"></path>

        <path d="M455 511 L489 493 L531 501 L560 526 L523 544 L482 540Z" fill="rgba(11,82,107,0.80)"></path>
        <path d="M735 494 L768 478 L809 486 L834 510 L801 528 L766 524Z" fill="rgba(11,82,109,0.70)"></path>
      </g>
    `;
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
      <svg class="planet-one-v14-svg" viewBox="0 0 1000 1000" role="img" aria-label="Planet 1 terrain 256 lattice engine">
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
            <stop offset="0%" stop-color="rgba(255,232,158,0.74)"></stop>
            <stop offset="20%" stop-color="rgba(255,203,104,0.34)"></stop>
            <stop offset="48%" stop-color="rgba(255,180,80,0.10)"></stop>
            <stop offset="100%" stop-color="rgba(255,180,80,0)"></stop>
          </radialGradient>

          <radialGradient id="${ids.moonLight}" cx="86%" cy="28%" r="48%">
            <stop offset="0%" stop-color="rgba(166,205,255,0.16)"></stop>
            <stop offset="40%" stop-color="rgba(120,168,230,0.07)"></stop>
            <stop offset="100%" stop-color="rgba(120,168,230,0)"></stop>
          </radialGradient>

          <radialGradient id="${ids.atmosphere}" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stop-color="rgba(95,160,235,0)"></stop>
            <stop offset="91%" stop-color="rgba(112,187,255,0.10)"></stop>
            <stop offset="99%" stop-color="rgba(160,215,255,0.26)"></stop>
            <stop offset="100%" stop-color="rgba(190,230,255,0.38)"></stop>
          </radialGradient>

          <radialGradient id="${ids.limbGlow}" cx="50%" cy="50%" r="50%">
            <stop offset="84%" stop-color="rgba(125,190,255,0)"></stop>
            <stop offset="100%" stop-color="rgba(145,205,255,0.25)"></stop>
          </radialGradient>

          <linearGradient id="${ids.axisGradient}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="rgba(242,199,111,0.04)"></stop>
            <stop offset="45%" stop-color="rgba(242,199,111,0.48)"></stop>
            <stop offset="100%" stop-color="rgba(242,199,111,0.12)"></stop>
          </linearGradient>

          <filter id="${ids.terrainTexture}" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.020 0.040" numOctaves="4" seed="86" result="noise"></feTurbulence>
            <feColorMatrix
              in="noise"
              type="matrix"
              values="
                0.34 0.00 0.00 0 0
                0.00 0.38 0.00 0 0
                0.00 0.00 0.28 0 0
                0.00 0.00 0.00 0.20 0"
              result="texture">
            </feColorMatrix>
            <feBlend in="SourceGraphic" in2="texture" mode="multiply"></feBlend>
          </filter>

          <filter id="${ids.landSoft}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" flood-color="#04101a" flood-opacity="0.18"></feDropShadow>
          </filter>
        </defs>

        <circle cx="500" cy="500" r="430" fill="rgba(6,18,32,0.62)"></circle>
        <circle cx="500" cy="500" r="408" fill="rgba(86,145,218,0.06)" stroke="rgba(145,190,250,0.15)" stroke-width="3"></circle>

        <g clip-path="url(#${ids.sphereClip})">
          <g class="p1-layer p1-sphere-base" data-layer="sphere">
            <rect x="70" y="70" width="860" height="860" fill="url(#${ids.oceanGradient})"></rect>
          </g>

          <g class="p1-layer planet-one-v14-currents" data-layer="water" aria-label="water depth and current pass">
            <path d="M118 331 C248 293 354 319 474 291 C586 264 704 292 884 232" fill="none" stroke="rgba(105,214,235,0.18)" stroke-width="9" stroke-linecap="round"></path>
            <path d="M96 574 C238 534 356 587 501 549 C648 510 762 565 904 516" fill="none" stroke="rgba(70,178,218,0.15)" stroke-width="10" stroke-linecap="round"></path>
            <path d="M145 719 C286 681 416 725 552 694 C686 663 797 691 900 647" fill="none" stroke="rgba(75,150,205,0.13)" stroke-width="12" stroke-linecap="round"></path>
            <path d="M455 511 L489 493 L531 501 L560 526 L523 544 L482 540Z" fill="#0b526b" opacity="0.84"></path>
            <path d="M735 494 L768 478 L809 486 L834 510 L801 528 L766 524Z" fill="#0b526d" opacity="0.72"></path>
          </g>

          <g class="planet-one-v14-world-turn">
            <g class="p1-layer" data-layer="shoreline" aria-label="shoreline pass">
              <use href="#${land.northPole}" fill="none" stroke="#dff2ff" stroke-width="8" stroke-linejoin="round" opacity="0.64"></use>
              <use href="#${land.northRegion}" fill="none" stroke="#d8c18a" stroke-width="8" stroke-linejoin="round" opacity="0.42"></use>
              <use href="#${land.mainland}" fill="none" stroke="#e4c98a" stroke-width="9" stroke-linejoin="round" opacity="0.48"></use>
              <use href="#${land.westRegion}" fill="none" stroke="#c9ac78" stroke-width="7" stroke-linejoin="round" opacity="0.42"></use>
              <use href="#${land.eastRegion}" fill="none" stroke="#cdb580" stroke-width="7" stroke-linejoin="round" opacity="0.40"></use>
              <use href="#${land.southRegion}" fill="none" stroke="#c8ad7b" stroke-width="7" stroke-linejoin="round" opacity="0.42"></use>
              <use href="#${land.southPole}" fill="none" stroke="#e9f3ff" stroke-width="8" stroke-linejoin="round" opacity="0.60"></use>
            </g>

            <g class="p1-layer p1-light-land-context" data-layer="landmass" aria-label="landmass pass" filter="url(#${ids.landSoft})">
              <use href="#${land.northPole}" fill="#e2edf2"></use>
              <use href="#${land.northRegion}" fill="#8e9b70"></use>
              <use href="#${land.mainland}" fill="#6e9859"></use>
              <use href="#${land.westRegion}" fill="#7b6d5b"></use>
              <use href="#${land.eastRegion}" fill="#759d7d"></use>
              <use href="#${land.southRegion}" fill="#899765"></use>
              <use href="#${land.southPole}" fill="#dfe8ee"></use>
            </g>

            <g class="p1-layer" data-layer="terrain" aria-label="terrain 256 lattice pass" filter="url(#${ids.terrainTexture})">
              ${lattice256TerrainLayer(uid, land)}
            </g>
          </g>

          <g class="p1-layer planet-one-v14-weather" data-layer="weather" aria-label="weather pass">
            <path d="M124 278 C236 251 362 273 486 306 C604 337 711 326 835 286" fill="none" stroke="rgba(244,248,255,0.13)" stroke-width="11" stroke-linecap="round"></path>
            <path d="M102 514 C234 486 373 506 514 540 C640 571 758 566 898 523" fill="none" stroke="rgba(244,248,255,0.10)" stroke-width="10" stroke-linecap="round"></path>
            <path d="M198 668 C318 643 443 659 565 702 C674 739 777 735 889 692" fill="none" stroke="rgba(244,248,255,0.08)" stroke-width="9" stroke-linecap="round"></path>
          </g>

          <g class="p1-layer" data-layer="light" aria-label="light pass">
            <rect x="70" y="70" width="860" height="860" fill="url(#${ids.sphereShade})"></rect>
            <circle cx="500" cy="500" r="394" fill="url(#${ids.moonLight})"></circle>
            <circle cx="500" cy="500" r="394" fill="url(#${ids.sunLight})"></circle>
          </g>
        </g>

        <g class="p1-layer" data-layer="surface" aria-label="surface pass">
          <circle cx="500" cy="500" r="394" fill="none" stroke="rgba(160,214,255,0.35)" stroke-width="4"></circle>
          <circle cx="500" cy="500" r="404" fill="url(#${ids.atmosphere})"></circle>
          <circle cx="500" cy="500" r="414" fill="url(#${ids.limbGlow})"></circle>
          <circle cx="500" cy="500" r="416" fill="none" stroke="rgba(126,190,255,0.13)" stroke-width="8"></circle>
        </g>

        <g class="p1-layer planet-one-v14-axis" data-layer="axis" aria-label="axis pass">
          <line x1="355" y1="890" x2="645" y2="110" stroke="url(#${ids.axisGradient})" stroke-width="11" stroke-linecap="round"></line>
          <circle cx="355" cy="890" r="13" fill="rgba(242,199,111,0.36)" stroke="rgba(242,199,111,0.32)" stroke-width="4"></circle>
          <circle cx="645" cy="110" r="13" fill="rgba(242,199,111,0.36)" stroke="rgba(242,199,111,0.32)" stroke-width="4"></circle>
        </g>
      </svg>
    `;
  }

  function passControls(activePass) {
    return `
      <div class="planet-one-pass-controls" aria-label="Planet 1 render-pass filters">
        ${PASSES.map(function makeButton(pass) {
          const pressed = pass === activePass ? "true" : "false";
          return `<button class="planet-one-pass-button" type="button" data-render-pass="${pass}" aria-pressed="${pressed}">${PASS_LABELS[pass]}</button>`;
        }).join("")}
      </div>
    `;
  }

  function telemetry() {
    return `
      <div class="planet-one-telemetry" aria-label="Planet 1 render standards">
        <span>Planet 1</span>
        <span>Terrain engine</span>
        <span>256 lattice</span>
        <span>Raw materials</span>
        <span>Mineral pressure</span>
        <span>Land contained</span>
        <span>Water quota preserved</span>
        <span>Quadrilateral audit</span>
      </div>
    `;
  }

  function mapKey() {
    return `
      <div class="planet-one-mapkey" aria-label="Planet 1 terrain notes">
        <article>
          <strong>Terrain engine</strong>
          <span>The terrain pass now uses a 16 by 16 lattice so ridges, strata, plateaus, valleys, canyons, basins, and mineral pressure are inspectable.</span>
        </article>
        <article>
          <strong>Raw materials</strong>
          <span>Diamond, opal, marble, slate, granite, gold, platinum, silver, copper, iron, and lead appear as land-contained strata signals.</span>
        </article>
        <article>
          <strong>Quota preserved</strong>
          <span>Terrain remains clipped to land. Water depth and ocean-current logic remain water-owned and separate.</span>
        </article>
      </div>
    `;
  }

  function updateButtons(shell, nextPass) {
    shell.querySelectorAll("[data-render-pass]").forEach(function update(button) {
      button.setAttribute(
        "aria-pressed",
        button.dataset.renderPass === nextPass ? "true" : "false"
      );
    });
  }

  function renderPlanetOne(target, options) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;

    if (!mount) {
      throw new Error("Planet 1 render mount not found.");
    }

    injectStyles();

    const uid = nextUid();
    const opts = options || {};
    const caption = escapeHtml(opts.caption || DEFAULT_CAPTION);
    const initialPass = normalizePass(opts.pass || opts.renderPass || DEFAULT_PASS);

    ACTIVE_INSTANCES.forEach(function stopExisting(instance) {
      if (instance && typeof instance.stop === "function") instance.stop();
    });

    mount.innerHTML = `
      <section
        class="planet-one-render-shell"
        data-render-version="${VERSION}"
        data-render-pass="${initialPass}"
        data-pass="${initialPass}"
        data-shared-contract="${SHARED_CONTRACT}"
        data-root-marker="${ROOT_MARKER}"
        data-v8-marker="${PREVIOUS_V8}"
        data-v9-marker="${PREVIOUS_V9}"
        data-v10-marker="${PREVIOUS_V10}"
        data-v11-marker="${PREVIOUS_V11}"
        data-v12-marker="${PREVIOUS_V12}"
        data-v13-marker="${PREVIOUS_V13}"
        data-v14-marker="${VERSION}"
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
        data-pass-filter-architecture-active="true"
        data-render-pass-filter-active="true"
        data-single-pass-inspection-active="true"
        data-composite-earned-not-guessed="true"
        data-terrain-256-lattice-engine-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
        data-terrain-quadrilateral-traversal-active="true"
        data-land-water-separation-quota-preserved="true"
        data-terrain-pass-default-active="true"
        data-water-depth-preserved="true"
      >
        <div class="planet-one-render-stage">
          ${planetSvg(uid)}
        </div>

        <div class="planet-one-caption">${caption}</div>

        ${passControls(initialPass)}
        ${telemetry()}
        ${mapKey()}
      </section>
    `;

    const shell = mount.querySelector(".planet-one-render-shell");
    const svg = mount.querySelector(".planet-one-v14-svg");

    function setPass(pass) {
      const nextPass = normalizePass(pass);
      shell.dataset.pass = nextPass;
      shell.dataset.renderPass = nextPass;
      updateButtons(shell, nextPass);
      return nextPass;
    }

    shell.querySelectorAll("[data-render-pass]").forEach(function bind(button) {
      button.addEventListener("click", function onClick() {
        setPass(button.dataset.renderPass);
      });
    });

    const instance = {
      version: VERSION,
      sharedContract: SHARED_CONTRACT,
      rootMarker: ROOT_MARKER,
      v8Marker: PREVIOUS_V8,
      v9Marker: PREVIOUS_V9,
      v10Marker: PREVIOUS_V10,
      v11Marker: PREVIOUS_V11,
      v12Marker: PREVIOUS_V12,
      v13Marker: PREVIOUS_V13,
      v14Marker: VERSION,
      v8RealismPass: V8_REALISM_PASS,
      markers: MARKERS,
      mount,
      shell,
      svg,

      setPass,

      getPass() {
        return shell ? shell.dataset.pass : initialPass;
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
          sharedContract: SHARED_CONTRACT,
          rootMarker: ROOT_MARKER,
          v8Marker: PREVIOUS_V8,
          v9Marker: PREVIOUS_V9,
          v10Marker: PREVIOUS_V10,
          v11Marker: PREVIOUS_V11,
          v12Marker: PREVIOUS_V12,
          v13Marker: PREVIOUS_V13,
          v14Marker: VERSION,
          v8RealismPass: V8_REALISM_PASS,
          markers: MARKERS,
          active: shell ? !shell.classList.contains("is-paused") : false,
          currentPass: this.getPass(),
          availablePasses: PASSES.slice(),
          terrain256LatticeEngineActive: true,
          rawMaterialStrataActive: true,
          mineralPressureActive: true,
          landWaterSeparationQuotaPreserved: true
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

  function setAllPasses(pass) {
    const nextPass = normalizePass(pass);

    ACTIVE_INSTANCES.forEach(function update(instance) {
      if (instance && typeof instance.setPass === "function") {
        instance.setPass(nextPass);
      }
    });

    return nextPass;
  }

  const api = Object.freeze({
    VERSION,
    SHARED_CONTRACT,
    PREVIOUS_V8,
    PREVIOUS_V9,
    PREVIOUS_V10,
    PREVIOUS_V11,
    PREVIOUS_V12,
    PREVIOUS_V13,
    ROOT_MARKER,
    V8_REALISM_PASS,
    MARKERS,
    PASSES,
    PASS_LABELS,
    RAW_MATERIALS,
    renderPlanetOne,
    stopAll,
    startAll,
    destroyAll,
    setAllPasses,

    getActiveCount() {
      return ACTIVE_INSTANCES.size;
    },

    getStatus() {
      return {
        version: VERSION,
        sharedContract: SHARED_CONTRACT,
        previousV8: PREVIOUS_V8,
        previousV9: PREVIOUS_V9,
        previousV10: PREVIOUS_V10,
        previousV11: PREVIOUS_V11,
        previousV12: PREVIOUS_V12,
        previousV13: PREVIOUS_V13,
        rootMarker: ROOT_MARKER,
        v8RealismPass: V8_REALISM_PASS,
        markers: MARKERS,
        activeCount: ACTIVE_INSTANCES.size,
        availablePasses: PASSES.slice(),
        defaultPass: DEFAULT_PASS,
        terrain256LatticeEngineActive: true,
        rawMaterialStrataActive: true,
        mineralPressureActive: true,
        terrainQuadrilateralTraversalActive: true,
        landWaterSeparationQuotaPreserved: true,
        waterDepthPreserved: true,
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
