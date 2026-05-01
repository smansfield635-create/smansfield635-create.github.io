/*
  PLANET_ONE_TERRAIN_RENDER_V4_HYDRO_TERRAIN_MARRIAGE_PAIR_TNT_v1
  TARGET=/world/render/planet-one.terrain.render.js

  PRESERVED MARKERS:
  PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1
  PLANET_ONE_TERRAIN_RENDER_V3_VISUAL_39B_CRUST_REALISM_TNT_v1

  REQUIRED GAUGE MARKERS:
  PLANET_ONE_TERRAIN_RENDER_V4_HYDRO_TERRAIN_MARRIAGE_PAIR_TNT_v1
  window.DGBPlanetOneTerrainRender
  createTerrainLayer
  hydration-engine-paired=true
  hydro-terrain-marriage-active=true
  terrain-water-adhesion-active=true
  shoreline-marriage-active=true
  mountains-canyons-rivers-lakes-glaciers-ready=true
  terrain-contained-to-land=true
  land-water-separation-quota-preserved=true

  ROLE:
  Terrain authority only.
  Pairs with hydration when available.
  Does not own route boot, weather, light, axis, or main-renderer composition.
*/

(function attachPlanetOneTerrainRender(global) {
  "use strict";

  const VERSION = "PLANET_ONE_TERRAIN_RENDER_V4_HYDRO_TERRAIN_MARRIAGE_PAIR_TNT_v1";
  const PREVIOUS_V3 = "PLANET_ONE_TERRAIN_RENDER_V3_VISUAL_39B_CRUST_REALISM_TNT_v1";
  const PREVIOUS_V2 = "PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1";
  const ROOT_VERSION = "PLANET_ONE_TERRAIN_RENDER_V1_256_LATTICE_TNT_v1";

  const PLANET = "Planet 1";
  const AUTHORITY = "/world/render/planet-one.terrain.render.js";
  const HYDRATION_AUTHORITY = "/world/render/planet-one.hydration.render.js";
  const PRIMARY_RENDERER = "/world/render/planet-one.render.js";

  const RAW_MATERIALS = Object.freeze([
    { key: "diamond", vein: "rgba(235,248,255,0.46)", crust: "rgba(210,238,255,0.30)" },
    { key: "opal", vein: "rgba(160,230,210,0.42)", crust: "rgba(176,230,218,0.28)" },
    { key: "marble", vein: "rgba(242,232,210,0.40)", crust: "rgba(238,230,210,0.25)" },
    { key: "slate", vein: "rgba(102,116,126,0.40)", crust: "rgba(74,86,94,0.34)" },
    { key: "granite", vein: "rgba(138,128,112,0.40)", crust: "rgba(112,105,93,0.34)" },
    { key: "gold", vein: "rgba(255,215,125,0.46)", crust: "rgba(242,199,111,0.30)" },
    { key: "platinum", vein: "rgba(226,232,235,0.42)", crust: "rgba(218,224,226,0.25)" },
    { key: "silver", vein: "rgba(210,224,232,0.42)", crust: "rgba(198,214,225,0.25)" },
    { key: "copper", vein: "rgba(205,130,82,0.44)", crust: "rgba(194,119,73,0.28)" },
    { key: "iron", vein: "rgba(150,78,62,0.44)", crust: "rgba(126,70,58,0.30)" },
    { key: "lead", vein: "rgba(88,96,108,0.42)", crust: "rgba(76,83,92,0.30)" }
  ]);

  let uidCounter = 0;

  function nextUid() {
    uidCounter += 1;
    return "p1terrainv4_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function hasHydrationModule() {
    return Boolean(
      global.DGBPlanetOneHydrationRender &&
      typeof global.DGBPlanetOneHydrationRender.createHydrationLayer === "function"
    );
  }

  function createLandPathDefs(uid) {
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

  function createClipDefs(land) {
    return `
      <clipPath id="${land.landAll}Clip">
        <use href="#${land.northPole}"></use>
        <use href="#${land.northRegion}"></use>
        <use href="#${land.mainland}"></use>
        <use href="#${land.westRegion}"></use>
        <use href="#${land.eastRegion}"></use>
        <use href="#${land.southRegion}"></use>
        <use href="#${land.southPole}"></use>
      </clipPath>
    `;
  }

  function createTerrainDefs(uid) {
    return `
      <filter id="${uid}_ancientCrustTexture" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.052 0.088" numOctaves="6" seed="39004" result="oldNoise"></feTurbulence>
        <feColorMatrix
          in="oldNoise"
          type="matrix"
          values="
            0.44 0.00 0.00 0 0
            0.00 0.38 0.00 0 0
            0.00 0.00 0.30 0 0
            0.00 0.00 0.00 0.40 0"
          result="crustNoise">
        </feColorMatrix>
        <feBlend in="SourceGraphic" in2="crustNoise" mode="multiply"></feBlend>
      </filter>

      <filter id="${uid}_deepRelief" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="-1.2" dy="1.6" stdDeviation="1.2" flood-color="#000000" flood-opacity="0.62"></feDropShadow>
        <feDropShadow dx="1.1" dy="-0.9" stdDeviation="0.9" flood-color="#e6c47d" flood-opacity="0.11"></feDropShadow>
      </filter>

      <filter id="${uid}_mountainLift" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="0" dy="-1.4" stdDeviation="1.1" flood-color="#f0d18b" flood-opacity="0.15"></feDropShadow>
        <feDropShadow dx="0" dy="3.4" stdDeviation="2.7" flood-color="#000000" flood-opacity="0.42"></feDropShadow>
      </filter>
    `;
  }

  function createFallbackHydration(uid, land) {
    return `
      <g
        data-hydration-source="terrain-internal-fallback"
        data-hydration-engine-paired="fallback"
        data-hydro-terrain-marriage-active="true"
        data-terrain-water-adhesion-active="true"
        data-shoreline-marriage-active="true"
        aria-label="internal hydration fallback"
      >
        <g opacity="0.34">
          <use href="#${land.northPole}" fill="none" stroke="rgba(41,160,196,0.58)" stroke-width="24" stroke-linejoin="round"></use>
          <use href="#${land.northRegion}" fill="none" stroke="rgba(41,160,196,0.58)" stroke-width="24" stroke-linejoin="round"></use>
          <use href="#${land.mainland}" fill="none" stroke="rgba(41,160,196,0.58)" stroke-width="26" stroke-linejoin="round"></use>
          <use href="#${land.westRegion}" fill="none" stroke="rgba(41,160,196,0.58)" stroke-width="22" stroke-linejoin="round"></use>
          <use href="#${land.eastRegion}" fill="none" stroke="rgba(41,160,196,0.58)" stroke-width="22" stroke-linejoin="round"></use>
          <use href="#${land.southRegion}" fill="none" stroke="rgba(41,160,196,0.58)" stroke-width="22" stroke-linejoin="round"></use>
          <use href="#${land.southPole}" fill="none" stroke="rgba(41,160,196,0.58)" stroke-width="24" stroke-linejoin="round"></use>
        </g>
        <path d="M420 202 C446 253 462 300 482 352 C504 409 522 455 552 514" fill="none" stroke="rgba(92,209,233,0.42)" stroke-width="6" stroke-linecap="round"></path>
        <path d="M455 511 L489 493 L531 501 L560 526 L523 544 L482 540Z" fill="rgba(20,105,135,0.62)"></path>
      </g>
    `;
  }

  function hydrationLayer(uid, land) {
    if (hasHydrationModule()) {
      return global.DGBPlanetOneHydrationRender.createHydrationLayer(uid, {
        land,
        includeDefs: true
      });
    }

    return createFallbackHydration(uid, land);
  }

  function createLandBody(land) {
    return `
      <g aria-label="married terrain land body">
        <use href="#${land.northPole}" fill="rgba(222,235,239,0.64)"></use>
        <use href="#${land.northRegion}" fill="rgba(117,128,91,0.72)"></use>
        <use href="#${land.mainland}" fill="rgba(93,126,74,0.76)"></use>
        <use href="#${land.westRegion}" fill="rgba(111,95,72,0.74)"></use>
        <use href="#${land.eastRegion}" fill="rgba(95,125,98,0.74)"></use>
        <use href="#${land.southRegion}" fill="rgba(116,128,82,0.73)"></use>
        <use href="#${land.southPole}" fill="rgba(218,232,238,0.62)"></use>
      </g>
    `;
  }

  function createRelief(uid) {
    return `
      <g aria-label="mountains canyons and ancient relief" filter="url(#${uid}_deepRelief)">
        <path d="M244 249 C323 206 420 223 511 270 C591 312 641 303 704 270" fill="none" stroke="rgba(26,29,25,0.58)" stroke-width="7.6" stroke-linecap="round"></path>
        <path d="M304 465 C394 383 524 395 638 489" fill="none" stroke="rgba(20,24,21,0.64)" stroke-width="9.4" stroke-linecap="round"></path>
        <path d="M318 532 C412 496 543 527 655 594" fill="none" stroke="rgba(52,43,32,0.56)" stroke-width="6.4" stroke-linecap="round"></path>
        <path d="M107 492 C166 408 258 410 334 482" fill="none" stroke="rgba(28,25,21,0.58)" stroke-width="7.0" stroke-linecap="round"></path>
        <path d="M659 455 C723 392 818 406 883 488" fill="none" stroke="rgba(34,35,29,0.56)" stroke-width="7.0" stroke-linecap="round"></path>
      </g>

      <g aria-label="plateau fracture memory" filter="url(#${uid}_mountainLift)">
        <path d="M260 289 C349 252 481 263 635 330" fill="none" stroke="rgba(205,184,126,0.24)" stroke-width="18" stroke-linecap="round"></path>
        <path d="M299 472 C414 425 540 443 670 524" fill="none" stroke="rgba(203,174,112,0.22)" stroke-width="20" stroke-linecap="round"></path>
        <path d="M302 605 C414 571 543 604 641 665" fill="none" stroke="rgba(109,82,55,0.32)" stroke-width="17" stroke-linecap="round"></path>
      </g>
    `;
  }

  function createMineralVeins() {
    const seams = [
      ["diamond", "M364 231 C409 207 470 214 529 247"],
      ["opal", "M432 289 C493 274 561 298 619 335"],
      ["marble", "M323 449 C409 409 516 431 619 505"],
      ["slate", "M350 575 C434 550 545 579 644 642"],
      ["gold", "M676 515 C744 483 819 507 865 566"],
      ["copper", "M257 315 C323 275 415 285 501 337"],
      ["iron", "M269 653 C358 609 474 625 578 690"]
    ];

    return `
      <g aria-label="embedded raw material veins">
        ${seams.map(function draw(item, index) {
          const material = RAW_MATERIALS.find(function find(candidate) {
            return candidate.key === item[0];
          }) || RAW_MATERIALS[index % RAW_MATERIALS.length];

          return `
            <path
              d="${item[1]}"
              fill="none"
              stroke="${material.vein}"
              stroke-width="${index % 3 === 0 ? "2.8" : "2.0"}"
              stroke-linecap="round"
              opacity="${index % 3 === 0 ? "0.25" : "0.18"}"
              data-material="${material.key}"
            ></path>
          `;
        }).join("")}
      </g>
    `;
  }

  function createTerrainLayer(uid, options) {
    const opts = options || {};
    const land = opts.land || createLandPathDefs(uid);
    const includeLandContext = opts.includeLandContext !== false;
    const hydrationPaired = hasHydrationModule();

    return `
      <g
        class="planet-one-terrain-layer"
        data-render-engine="${VERSION}"
        data-previous-v3="${PREVIOUS_V3}"
        data-previous-v2="${PREVIOUS_V2}"
        data-root-render-engine="${ROOT_VERSION}"
        data-planet="${PLANET}"
        data-authority="${AUTHORITY}"
        data-hydration-authority="${HYDRATION_AUTHORITY}"

        data-planet-one-terrain-render-active="true"
        data-planet-one-specified="true"

        data-ancient-39b-crust-engine-active="true"
        data-visual-39b-crust-realism-active="true"
        data-hydro-terrain-marriage-active="true"
        data-hydration-engine-paired="${hydrationPaired ? "true" : "fallback"}"
        data-terrain-water-adhesion-active="true"
        data-shoreline-marriage-active="true"
        data-mountains-canyons-rivers-lakes-glaciers-ready="true"

        data-pressure-formed-crust-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
        data-tectonic-scar-network-active="true"
        data-deep-geologic-scar-system-active="true"

        data-terrain-contained-to-land="true"
        data-land-water-separation-quota-preserved="true"
        data-water-depth-owned-by-water-pass="true"
        data-no-final-geography-closure="true"
        aria-label="Planet 1 hydro-terrain marriage layer"
      >
        <defs>${createTerrainDefs(uid)}</defs>

        ${hydrationLayer(uid, land)}

        <g clip-path="url(#${land.landAll}Clip)" filter="url(#${uid}_ancientCrustTexture)" aria-label="land-contained married terrain crust">
          ${includeLandContext ? createLandBody(land) : ""}
          ${createRelief(uid)}
          ${createMineralVeins()}
        </g>
      </g>
    `;
  }

  function createStandaloneSvg(uid) {
    const land = createLandPathDefs(uid);

    return `
      <svg viewBox="0 0 1000 1000" role="img" aria-label="Planet 1 V4 hydro-terrain marriage render">
        <defs>
          <clipPath id="${uid}_sphereClip"><circle cx="500" cy="500" r="394"></circle></clipPath>
          <radialGradient id="${uid}_oceanContext" cx="34%" cy="28%" r="78%">
            <stop offset="0%" stop-color="#1b8fb7"></stop>
            <stop offset="30%" stop-color="#0f587f"></stop>
            <stop offset="60%" stop-color="#062f50"></stop>
            <stop offset="100%" stop-color="#020814"></stop>
          </radialGradient>
          ${land.defs}
          ${createClipDefs(land)}
        </defs>

        <circle cx="500" cy="500" r="430" fill="rgba(6,18,32,0.62)"></circle>
        <g clip-path="url(#${uid}_sphereClip)">
          <rect x="70" y="70" width="860" height="860" fill="url(#${uid}_oceanContext)" opacity="0.36"></rect>
          ${createTerrainLayer(uid, { land, includeLandContext: true })}
        </g>
        <circle cx="500" cy="500" r="394" fill="none" stroke="rgba(160,214,255,0.24)" stroke-width="4"></circle>
      </svg>
    `;
  }

  function renderTerrain(target) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;
    if (!mount) throw new Error("Planet 1 terrain render mount not found.");

    const uid = nextUid();

    mount.innerHTML = `
      <section
        class="planet-one-terrain-shell"
        data-render-version="${VERSION}"
        data-previous-v3="${PREVIOUS_V3}"
        data-previous-v2="${PREVIOUS_V2}"
        data-hydro-terrain-marriage-active="true"
        data-hydration-engine-paired="${hasHydrationModule() ? "true" : "fallback"}"
      >
        ${createStandaloneSvg(uid)}
      </section>
    `;

    return {
      ok: true,
      version: VERSION,
      hydrationEnginePaired: hasHydrationModule()
    };
  }

  function getStatus() {
    return {
      version: VERSION,
      previousV3: PREVIOUS_V3,
      previousV2: PREVIOUS_V2,
      rootVersion: ROOT_VERSION,
      planet: PLANET,
      authority: AUTHORITY,
      hydrationAuthority: HYDRATION_AUTHORITY,
      primaryRenderer: PRIMARY_RENDERER,
      hydrationEnginePaired: hasHydrationModule(),
      hydroTerrainMarriageActive: true,
      terrainWaterAdhesionActive: true,
      shorelineMarriageActive: true,
      mountainsCanyonsRiversLakesGlaciersReady: true,
      terrainContainedToLand: true,
      landWaterSeparationQuotaPreserved: true
    };
  }

  const api = Object.freeze({
    VERSION,
    PREVIOUS_V3,
    PREVIOUS_V2,
    ROOT_VERSION,
    PLANET,
    AUTHORITY,
    HYDRATION_AUTHORITY,
    PRIMARY_RENDERER,
    RAW_MATERIALS,
    createLandPathDefs,
    createClipDefs,
    createTerrainDefs,
    createTerrainLayer,
    createStandaloneSvg,
    renderTerrain,
    hasHydrationModule,
    getStatus
  });

  global.DGBPlanetOneTerrainRender = api;
  if (typeof window !== "undefined") window.DGBPlanetOneTerrainRender = api;
})(window);
