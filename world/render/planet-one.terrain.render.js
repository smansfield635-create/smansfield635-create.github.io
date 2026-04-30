(function attachPlanetOneTerrainRender(global) {
  "use strict";

  const VERSION = "PLANET_ONE_TERRAIN_RENDER_V3_VISUAL_39B_CRUST_REALISM_TNT_v1";
  const PREVIOUS_VERSION = "PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1";
  const ROOT_VERSION = "PLANET_ONE_TERRAIN_RENDER_V1_256_LATTICE_TNT_v1";

  const PLANET = "Planet 1";
  const AGE_TARGET = "39-billion-years";
  const AUTHORITY = "/world/render/planet-one.terrain.render.js";
  const PRIMARY_RENDERER = "/world/render/planet-one.render.js";

  /*
    LINEAR_TRAVERSAL_PATH=
    PRE_WRITE
    PRE_BUILD
    PRE_GAME
    BUILD
    POST_GAME
    POST_BUILD
    POST_WRITE
    CANONICAL_RESULT

    PRE_WRITE=
    The boot chain passed. The problem is now terrain visual realism.

    PRE_BUILD=
    Preserve V2 API and all passed source markers.

    PRE_GAME=
    Reduce cartoon softness without closing geography.

    BUILD=
    PLANET_ONE_TERRAIN_RENDER_V3_VISUAL_39B_CRUST_REALISM_TNT_v1

    POST_GAME=
    Gauges should move from V2_LOCKED / NEXT to V3_PRESENT or visual review.

    POST_BUILD=
    Inspect Planet 1 visually.

    POST_WRITE=
    Bind V3 as a forward terrain-expression frame, not final geography.

    CANONICAL_RESULT=
    Planet 1 advances from source-proven terrain to stronger visible ancient crust realism.

    REQUIRED MARKERS:
    PLANET_ONE_TERRAIN_RENDER_V1_256_LATTICE_TNT_v1
    PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1
    PLANET_ONE_TERRAIN_RENDER_V3_VISUAL_39B_CRUST_REALISM_TNT_v1

    window.DGBPlanetOneTerrainRender
    createTerrainLayer
    renderTerrain
    getStatus

    terrain-engine-planet=Planet 1
    planet-one-terrain-render-active=true
    planet-one-specified=true

    ancient-39b-crust-engine-active=true
    visual-39b-crust-realism-active=true
    pressure-formed-crust-active=true
    raw-material-strata-active=true
    mineral-pressure-active=true
    tectonic-scar-network-active=true
    deep-geologic-scar-system-active=true
    embedded-mineral-vein-system-active=true
    erosion-wear-field-active=true
    fractured-plateau-memory-active=true
    cartoon-softness-reduction-active=true
    ancient-crust-depth-pass=true

    terrain-256-lattice-engine-active=true
    terrain-contained-to-land=true
    land-water-separation-quota-preserved=true
    water-depth-owned-by-water-pass=true

    HARD RULES:
    TERRAIN_ONLY
    NO_WATER_DEPTH_OWNERSHIP
    NO_OCEAN_CURRENT_OWNERSHIP
    NO_WEATHER_OWNERSHIP
    NO_LIGHTING_OWNERSHIP
    NO_AXIS_OWNERSHIP
    NO_ROUTE_BOOT_OWNERSHIP
    NO_ASSET_LOADING_OWNERSHIP
    NO_MAIN_RENDERER_OWNERSHIP
    NO_FINAL_COUNTRIES
    NO_FINAL_CITIES
    NO_FINAL_RIVERS
    NO_FINAL_CLIMATE_NAMES
    NO_FINAL_PHYSICS
    NO_FINAL_MAP_GEOMETRY
  */

  const RAW_MATERIALS = Object.freeze([
    { key: "diamond", label: "Diamond", vein: "rgba(235,248,255,0.46)", crust: "rgba(210,238,255,0.30)" },
    { key: "opal", label: "Opal", vein: "rgba(160,230,210,0.42)", crust: "rgba(176,230,218,0.28)" },
    { key: "marble", label: "Marble", vein: "rgba(242,232,210,0.40)", crust: "rgba(238,230,210,0.25)" },
    { key: "slate", label: "Slate", vein: "rgba(102,116,126,0.40)", crust: "rgba(74,86,94,0.34)" },
    { key: "granite", label: "Granite", vein: "rgba(138,128,112,0.40)", crust: "rgba(112,105,93,0.34)" },
    { key: "gold", label: "Gold", vein: "rgba(255,215,125,0.46)", crust: "rgba(242,199,111,0.30)" },
    { key: "platinum", label: "Platinum", vein: "rgba(226,232,235,0.42)", crust: "rgba(218,224,226,0.25)" },
    { key: "silver", label: "Silver", vein: "rgba(210,224,232,0.42)", crust: "rgba(198,214,225,0.25)" },
    { key: "copper", label: "Copper", vein: "rgba(205,130,82,0.44)", crust: "rgba(194,119,73,0.28)" },
    { key: "iron", label: "Iron", vein: "rgba(150,78,62,0.44)", crust: "rgba(126,70,58,0.30)" },
    { key: "lead", label: "Lead", vein: "rgba(88,96,108,0.42)", crust: "rgba(76,83,92,0.30)" }
  ]);

  const MARKERS = Object.freeze({
    version: VERSION,
    previousVersion: PREVIOUS_VERSION,
    rootVersion: ROOT_VERSION,
    planet: PLANET,
    ageTarget: AGE_TARGET,
    authority: AUTHORITY,
    primaryRenderer: PRIMARY_RENDERER,

    planetOneTerrainRenderActive: true,
    planetOneSpecified: true,
    terrainEnginePlanet: PLANET,

    terrain256LatticeEngineActive: true,
    ancient39bCrustEngineActive: true,
    visual39bCrustRealismActive: true,
    pressureFormedCrustActive: true,
    rawMaterialStrataActive: true,
    mineralPressureActive: true,
    tectonicScarNetworkActive: true,
    deepGeologicScarSystemActive: true,
    embeddedMineralVeinSystemActive: true,
    erosionWearFieldActive: true,
    fracturedPlateauMemoryActive: true,
    cartoonSoftnessReductionActive: true,
    ancientCrustDepthPass: true,

    terrainContainedToLand: true,
    landWaterSeparationQuotaPreserved: true,
    waterDepthOwnedByWaterPass: true,

    noCartoonSurfaceRead: true,
    noFinalCountries: true,
    noFinalCities: true,
    noFinalRivers: true,
    noFinalClimateNames: true,
    noFinalPhysics: true,
    noFinalMapGeometry: true
  });

  let uidCounter = 0;

  function nextUid() {
    uidCounter += 1;
    return "p1terrainv3_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function injectStyles() {
    if (document.getElementById("planet-one-terrain-render-v3-styles")) return;

    const style = document.createElement("style");
    style.id = "planet-one-terrain-render-v3-styles";
    style.textContent = `
      .planet-one-terrain-shell {
        width: min(700px, 100%);
        margin: 0 auto;
        display: grid;
        justify-items: center;
        gap: 16px;
        color: #f5f7fb;
      }

      .planet-one-terrain-stage {
        width: min(680px, 100%);
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        isolation: isolate;
      }

      .planet-one-terrain-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(0 34px 64px rgba(0, 0, 0, 0.68));
      }

      .planet-one-terrain-caption {
        color: rgba(245, 247, 251, 0.84);
        font-size: clamp(0.72rem, 2.5vw, 0.9rem);
        font-weight: 950;
        letter-spacing: clamp(0.07em, 1.4vw, 0.14em);
        line-height: 1.45;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-terrain-tags {
        width: min(650px, 100%);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }

      .planet-one-terrain-tags span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 34px;
        border: 1px solid rgba(160, 177, 214, 0.24);
        border-radius: 999px;
        padding: 7px 11px;
        background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025));
        color: rgba(245, 247, 251, 0.78);
        font-size: 0.70rem;
        font-weight: 900;
        letter-spacing: 0.05em;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-terrain-notes {
        width: min(650px, 100%);
        display: grid;
        gap: 10px;
      }

      .planet-one-terrain-notes article {
        border: 1px solid rgba(160, 177, 214, 0.22);
        border-radius: 20px;
        padding: 13px 15px;
        background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018));
      }

      .planet-one-terrain-notes strong {
        display: block;
        color: #f2c76f;
        font-size: 0.76rem;
        font-weight: 950;
        letter-spacing: 0.13em;
        text-transform: uppercase;
        margin-bottom: 5px;
      }

      .planet-one-terrain-notes span {
        display: block;
        color: rgba(228, 234, 246, 0.78);
        font-size: 0.94rem;
        line-height: 1.45;
      }

      @media (max-width: 680px) {
        .planet-one-terrain-stage {
          width: min(570px, 100%);
        }

        .planet-one-terrain-tags span {
          font-size: 0.64rem;
          min-height: 32px;
          padding: 6px 9px;
        }
      }
    `;

    document.head.appendChild(style);
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
      <filter id="${uid}_v3AncientCrustTexture" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045 0.092" numOctaves="6" seed="39003" result="oldNoise"></feTurbulence>
        <feColorMatrix
          in="oldNoise"
          type="matrix"
          values="
            0.42 0.00 0.00 0 0
            0.00 0.36 0.00 0 0
            0.00 0.00 0.28 0 0
            0.00 0.00 0.00 0.38 0"
          result="crustNoise">
        </feColorMatrix>
        <feBlend in="SourceGraphic" in2="crustNoise" mode="multiply"></feBlend>
      </filter>

      <filter id="${uid}_v3DeepScarShadow" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="-0.8" dy="1.4" stdDeviation="1.1" flood-color="#000000" flood-opacity="0.55"></feDropShadow>
        <feDropShadow dx="1.2" dy="-0.8" stdDeviation="0.8" flood-color="#f1cf86" flood-opacity="0.08"></feDropShadow>
      </filter>

      <filter id="${uid}_v3CrustLift" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="0" dy="-1.2" stdDeviation="1.2" flood-color="#e7c981" flood-opacity="0.12"></feDropShadow>
        <feDropShadow dx="0" dy="3.2" stdDeviation="2.6" flood-color="#01050a" flood-opacity="0.38"></feDropShadow>
      </filter>

      <filter id="${uid}_v3MineralInset" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="0" dy="1.1" stdDeviation="0.7" flood-color="#01050a" flood-opacity="0.44"></feDropShadow>
      </filter>
    `;
  }

  function createLandContext(land) {
    return `
      <g aria-label="Planet 1 subdued land context" opacity="0.26">
        <use href="#${land.northPole}" fill="#d8e4e8"></use>
        <use href="#${land.northRegion}" fill="#727b5e"></use>
        <use href="#${land.mainland}" fill="#5d7449"></use>
        <use href="#${land.westRegion}" fill="#625747"></use>
        <use href="#${land.eastRegion}" fill="#5e7664"></use>
        <use href="#${land.southRegion}" fill="#6d7852"></use>
        <use href="#${land.southPole}" fill="#d8e1e7"></use>
      </g>
    `;
  }

  function createSubdued256Lattice() {
    const startX = 158;
    const startY = 120;
    const stepX = 43;
    const stepY = 46;
    const cells = [];

    for (let row = 0; row < 16; row += 1) {
      for (let col = 0; col < 16; col += 1) {
        const index = row * 16 + col;
        const material = RAW_MATERIALS[index % RAW_MATERIALS.length];
        const pressure = (row * 7 + col * 11) % 6;
        const x = startX + col * stepX + ((row % 2) * 8);
        const y = startY + row * stepY;
        const length = 4.5 + pressure * 2.1;
        const angle = ((row * 23 + col * 29) % 84) - 42;
        const opacity = 0.032 + pressure * 0.011;

        cells.push(`
          <g transform="translate(${x} ${y}) rotate(${angle})" data-lattice-cell="${index + 1}" data-material="${material.key}" data-planet="${PLANET}">
            <line x1="${-length}" y1="0" x2="${length}" y2="0" stroke="${material.vein}" stroke-width="1.15" stroke-linecap="round" opacity="${opacity.toFixed(3)}"></line>
            <circle cx="0" cy="0" r="${(0.55 + pressure * 0.11).toFixed(2)}" fill="${material.crust}" opacity="${(opacity + 0.012).toFixed(3)}"></circle>
          </g>
        `);
      }
    }

    return cells.join("");
  }

  function createDeepGeologicScars(uid) {
    return `
      <g aria-label="deep geologic scar system" filter="url(#${uid}_v3DeepScarShadow)">
        <path d="M244 249 C323 206 420 223 511 270 C591 312 641 303 704 270" fill="none" stroke="rgba(26,29,25,0.58)" stroke-width="7.6" stroke-linecap="round"></path>
        <path d="M282 335 C370 294 470 307 559 356 C616 387 657 382 690 360" fill="none" stroke="rgba(77,63,43,0.52)" stroke-width="5.2" stroke-linecap="round"></path>
        <path d="M304 465 C394 383 524 395 638 489" fill="none" stroke="rgba(20,24,21,0.64)" stroke-width="9.4" stroke-linecap="round"></path>
        <path d="M318 532 C412 496 543 527 655 594" fill="none" stroke="rgba(52,43,32,0.56)" stroke-width="6.4" stroke-linecap="round"></path>
        <path d="M391 650 C470 701 559 686 634 626" fill="none" stroke="rgba(30,31,24,0.55)" stroke-width="6.8" stroke-linecap="round"></path>
        <path d="M107 492 C166 408 258 410 334 482" fill="none" stroke="rgba(28,25,21,0.58)" stroke-width="7.0" stroke-linecap="round"></path>
        <path d="M659 455 C723 392 818 406 883 488" fill="none" stroke="rgba(34,35,29,0.56)" stroke-width="7.0" stroke-linecap="round"></path>
        <path d="M328 781 C417 842 522 855 612 807" fill="none" stroke="rgba(35,31,24,0.58)" stroke-width="7.4" stroke-linecap="round"></path>
      </g>
    `;
  }

  function createFracturedPlateauMemory(uid) {
    return `
      <g aria-label="fractured plateau memory" filter="url(#${uid}_v3CrustLift)">
        <path d="M260 289 C349 252 481 263 635 330" fill="none" stroke="rgba(205,184,126,0.24)" stroke-width="18" stroke-linecap="round"></path>
        <path d="M299 472 C414 425 540 443 670 524" fill="none" stroke="rgba(203,174,112,0.22)" stroke-width="20" stroke-linecap="round"></path>
        <path d="M302 605 C414 571 543 604 641 665" fill="none" stroke="rgba(109,82,55,0.32)" stroke-width="17" stroke-linecap="round"></path>
        <path d="M137 568 C203 535 263 551 316 599" fill="none" stroke="rgba(112,83,56,0.30)" stroke-width="16" stroke-linecap="round"></path>
        <path d="M670 563 C745 538 817 557 866 606" fill="none" stroke="rgba(78,92,66,0.30)" stroke-width="16" stroke-linecap="round"></path>
        <path d="M342 812 C431 854 531 857 610 815" fill="none" stroke="rgba(143,111,73,0.28)" stroke-width="16" stroke-linecap="round"></path>
      </g>
    `;
  }

  function createEmbeddedMineralVeins(uid) {
    const seams = [
      ["diamond", "M364 231 C409 207 470 214 529 247"],
      ["opal", "M432 289 C493 274 561 298 619 335"],
      ["marble", "M323 449 C409 409 516 431 619 505"],
      ["slate", "M350 575 C434 550 545 579 644 642"],
      ["granite", "M139 543 C203 504 266 522 318 574"],
      ["gold", "M676 515 C744 483 819 507 865 566"],
      ["platinum", "M377 846 C450 878 536 879 599 838"],
      ["silver", "M394 139 C467 108 553 114 620 158"],
      ["copper", "M257 315 C323 275 415 285 501 337"],
      ["iron", "M269 653 C358 609 474 625 578 690"],
      ["lead", "M112 476 C180 439 267 453 342 521"],
      ["diamond", "M398 492 C448 458 524 462 585 515"],
      ["gold", "M418 690 C487 726 565 714 631 660"],
      ["copper", "M705 434 C769 412 829 439 873 498"],
      ["slate", "M330 742 C397 779 486 793 571 770"]
    ];

    return `
      <g aria-label="embedded mineral vein system" filter="url(#${uid}_v3MineralInset)">
        ${seams.map(function drawSeam(item, index) {
          const material = RAW_MATERIALS.find(function find(candidate) {
            return candidate.key === item[0];
          }) || RAW_MATERIALS[index % RAW_MATERIALS.length];

          const width = index % 4 === 0 ? "3.1" : index % 3 === 0 ? "2.5" : "1.85";
          const opacity = index % 4 === 0 ? "0.28" : index % 3 === 0 ? "0.22" : "0.17";

          return `
            <path
              d="${item[1]}"
              fill="none"
              stroke="${material.vein}"
              stroke-width="${width}"
              stroke-linecap="round"
              opacity="${opacity}"
              data-material="${material.key}"
            ></path>
          `;
        }).join("")}
      </g>
    `;
  }

  function createErosionWearField() {
    return `
      <g aria-label="erosion wear field">
        <path d="M252 362 C335 345 422 359 508 397 C585 431 644 433 704 407" fill="none" stroke="rgba(235,212,150,0.115)" stroke-width="3.2" stroke-linecap="round"></path>
        <path d="M289 387 C379 370 466 389 557 428 C615 453 663 450 709 424" fill="none" stroke="rgba(45,38,28,0.20)" stroke-width="2.4" stroke-linecap="round"></path>
        <path d="M296 438 C383 412 486 428 590 481 C641 507 673 505 701 486" fill="none" stroke="rgba(239,219,161,0.105)" stroke-width="3.4" stroke-linecap="round"></path>
        <path d="M305 505 C396 482 505 505 621 571" fill="none" stroke="rgba(34,30,24,0.20)" stroke-width="2.5" stroke-linecap="round"></path>
        <path d="M330 622 C410 604 502 628 599 684" fill="none" stroke="rgba(230,199,133,0.105)" stroke-width="3.4" stroke-linecap="round"></path>
        <path d="M146 504 C196 487 256 501 312 543" fill="none" stroke="rgba(230,199,133,0.10)" stroke-width="3.1" stroke-linecap="round"></path>
        <path d="M676 506 C743 480 815 499 867 545" fill="none" stroke="rgba(230,199,133,0.10)" stroke-width="3.1" stroke-linecap="round"></path>
      </g>
    `;
  }

  function createAncientBasinsAndCuts() {
    return `
      <g aria-label="ancient basin pressure and canyon cuts">
        <path d="M450 506 L490 486 L536 497 L568 529 L526 551 L479 544Z" fill="rgba(10,38,44,0.66)" stroke="rgba(2,10,14,0.52)" stroke-width="3.4"></path>
        <path d="M731 493 L768 472 L814 483 L842 512 L805 535 L763 529Z" fill="rgba(12,42,48,0.60)" stroke="rgba(2,10,14,0.48)" stroke-width="3.2"></path>
        <path d="M390 604 C438 574 506 582 561 621 C525 656 459 660 405 634Z" fill="rgba(42,48,37,0.34)" stroke="rgba(12,16,13,0.42)" stroke-width="2.8"></path>
        <path d="M252 518 C281 488 324 490 350 521 C319 550 278 548 252 518Z" fill="rgba(40,46,38,0.32)" stroke="rgba(12,16,13,0.40)" stroke-width="2.6"></path>
        <path d="M402 370 C443 348 498 356 542 387 C512 411 458 416 412 394Z" fill="rgba(47,42,34,0.28)" stroke="rgba(12,11,10,0.34)" stroke-width="2.4"></path>
      </g>
    `;
  }

  function createOldCrustNoiseDots() {
    const dots = [
      [346, 259, 3.2], [488, 278, 2.6], [612, 326, 3.6],
      [372, 462, 3.8], [536, 455, 2.8], [608, 539, 3.4],
      [205, 507, 3.4], [262, 575, 2.7], [719, 493, 3.3],
      [820, 574, 2.8], [423, 781, 3.1], [548, 812, 2.8],
      [462, 642, 2.4], [584, 684, 2.7], [444, 160, 2.5],
      [555, 148, 2.9], [413, 333, 2.2], [512, 362, 2.4]
    ];

    return `
      <g aria-label="old crust pressure pits">
        ${dots.map(function dot(item, index) {
          const material = RAW_MATERIALS[index % RAW_MATERIALS.length];
          return `<circle cx="${item[0]}" cy="${item[1]}" r="${item[2]}" fill="${material.crust}" opacity="0.16"></circle>`;
        }).join("")}
      </g>
    `;
  }

  function createTerrainLayer(uid, options) {
    const opts = options || {};
    const land = opts.land || createLandPathDefs(uid);
    const includeLandContext = opts.includeLandContext !== false;

    return `
      <g
        class="planet-one-terrain-layer"
        data-render-engine="${VERSION}"
        data-previous-render-engine="${PREVIOUS_VERSION}"
        data-root-render-engine="${ROOT_VERSION}"
        data-planet="${PLANET}"
        data-terrain-engine-planet="${PLANET}"
        data-age-target="${AGE_TARGET}"
        data-planet-one-terrain-render-active="true"
        data-planet-one-specified="true"

        data-ancient-39b-crust-engine-active="true"
        data-visual-39b-crust-realism-active="true"
        data-pressure-formed-crust-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
        data-tectonic-scar-network-active="true"
        data-deep-geologic-scar-system-active="true"
        data-embedded-mineral-vein-system-active="true"
        data-erosion-wear-field-active="true"
        data-fractured-plateau-memory-active="true"
        data-cartoon-softness-reduction-active="true"
        data-ancient-crust-depth-pass="true"

        data-terrain-256-lattice-engine-active="true"
        data-terrain-contained-to-land="true"
        data-land-water-separation-quota-preserved="true"
        data-water-depth-owned-by-water-pass="true"

        data-no-final-geography-closure="true"
        aria-label="Planet 1 visual 39 billion year crust realism terrain layer"
      >
        <defs>
          ${createTerrainDefs(uid)}
        </defs>

        ${includeLandContext ? createLandContext(land) : ""}

        <g clip-path="url(#${land.landAll}Clip)" filter="url(#${uid}_v3AncientCrustTexture)" aria-label="Planet 1 V3 land-contained ancient crust">
          <g opacity="0.72" aria-label="subdued 256 lattice material memory">
            ${createSubdued256Lattice()}
          </g>

          ${createFracturedPlateauMemory(uid)}
          ${createDeepGeologicScars(uid)}
          ${createEmbeddedMineralVeins(uid)}
          ${createErosionWearField()}
          ${createAncientBasinsAndCuts()}
          ${createOldCrustNoiseDots()}
        </g>
      </g>
    `;
  }

  function createStandaloneSvg(uid) {
    const land = createLandPathDefs(uid);

    return `
      <svg class="planet-one-terrain-svg" viewBox="0 0 1000 1000" role="img" aria-label="Planet 1 V3 visual 39B terrain render">
        <defs>
          <clipPath id="${uid}_sphereClip">
            <circle cx="500" cy="500" r="394"></circle>
          </clipPath>

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
          <rect x="70" y="70" width="860" height="860" fill="url(#${uid}_oceanContext)" opacity="0.32"></rect>
          ${createTerrainLayer(uid, { land: land, includeLandContext: true })}
        </g>

        <circle cx="500" cy="500" r="394" fill="none" stroke="rgba(160,214,255,0.24)" stroke-width="4"></circle>
      </svg>
    `;
  }

  function createTags() {
    return `
      <div class="planet-one-terrain-tags" aria-label="Planet 1 V3 terrain render standards">
        <span>Planet 1</span>
        <span>V3 visual realism</span>
        <span>39B crust</span>
        <span>Deep scars</span>
        <span>Mineral veins</span>
        <span>Erosion field</span>
        <span>Plateau fracture</span>
        <span>Land-contained</span>
      </div>
    `;
  }

  function createNotes() {
    return `
      <div class="planet-one-terrain-notes" aria-label="Planet 1 V3 terrain notes">
        <article>
          <strong>Visual 39B crust realism</strong>
          <span>This terrain render strengthens the visible age read: deeper scars, heavier crust, embedded mineral seams, erosion wear, and fractured plateau memory.</span>
        </article>
        <article>
          <strong>Materials embedded, not decorated</strong>
          <span>Diamond, opal, marble, slate, granite, gold, platinum, silver, copper, iron, and lead remain geological signals inside the crust.</span>
        </article>
        <article>
          <strong>Boundary preserved</strong>
          <span>Terrain stays clipped to land. Water depth, ocean currents, weather, lighting, route boot, and axis remain outside this file.</span>
        </article>
      </div>
    `;
  }

  function renderTerrain(target, options) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;

    if (!mount) {
      throw new Error("Planet 1 terrain render mount not found.");
    }

    injectStyles();

    const uid = nextUid();
    const opts = options || {};
    const caption = escapeHtml(opts.caption || "Planet 1 · V3 visual 39B crust realism");

    mount.innerHTML = `
      <section
        class="planet-one-terrain-shell"
        data-render-version="${VERSION}"
        data-previous-render-version="${PREVIOUS_VERSION}"
        data-root-render-version="${ROOT_VERSION}"
        data-planet="${PLANET}"
        data-terrain-engine-planet="${PLANET}"
        data-age-target="${AGE_TARGET}"
        data-authority="${AUTHORITY}"
        data-primary-renderer="${PRIMARY_RENDERER}"

        data-planet-one-terrain-render-active="true"
        data-planet-one-specified="true"

        data-ancient-39b-crust-engine-active="true"
        data-visual-39b-crust-realism-active="true"
        data-pressure-formed-crust-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
        data-tectonic-scar-network-active="true"
        data-deep-geologic-scar-system-active="true"
        data-embedded-mineral-vein-system-active="true"
        data-erosion-wear-field-active="true"
        data-fractured-plateau-memory-active="true"
        data-cartoon-softness-reduction-active="true"
        data-ancient-crust-depth-pass="true"

        data-terrain-256-lattice-engine-active="true"
        data-terrain-contained-to-land="true"
        data-land-water-separation-quota-preserved="true"
        data-water-depth-owned-by-water-pass="true"
        data-no-final-geography-closure="true"
      >
        <div class="planet-one-terrain-stage">
          ${createStandaloneSvg(uid)}
        </div>

        <div class="planet-one-terrain-caption">${caption}</div>
        ${createTags()}
        ${createNotes()}
      </section>
    `;

    const shell = mount.querySelector(".planet-one-terrain-shell");

    return {
      ok: true,
      version: VERSION,
      previousVersion: PREVIOUS_VERSION,
      rootVersion: ROOT_VERSION,
      planet: PLANET,
      ageTarget: AGE_TARGET,
      authority: AUTHORITY,
      primaryRenderer: PRIMARY_RENDERER,
      mount,
      shell,
      markers: MARKERS,

      getStatus() {
        return {
          ok: true,
          version: VERSION,
          previousVersion: PREVIOUS_VERSION,
          rootVersion: ROOT_VERSION,
          planet: PLANET,
          ageTarget: AGE_TARGET,
          authority: AUTHORITY,
          markers: MARKERS
        };
      },

      destroy() {
        if (mount && mount.contains(shell)) {
          mount.innerHTML = "";
        }
        return true;
      }
    };
  }

  function getStatus() {
    return {
      version: VERSION,
      previousVersion: PREVIOUS_VERSION,
      rootVersion: ROOT_VERSION,
      planet: PLANET,
      ageTarget: AGE_TARGET,
      authority: AUTHORITY,
      primaryRenderer: PRIMARY_RENDERER,
      rawMaterials: RAW_MATERIALS.map(function mapMaterial(material) {
        return material.key;
      }),
      markers: MARKERS
    };
  }

  const api = Object.freeze({
    VERSION,
    PREVIOUS_VERSION,
    ROOT_VERSION,
    PLANET,
    AGE_TARGET,
    AUTHORITY,
    PRIMARY_RENDERER,
    RAW_MATERIALS,
    MARKERS,
    createLandPathDefs,
    createClipDefs,
    createTerrainDefs,
    createTerrainLayer,
    createStandaloneSvg,
    renderTerrain,
    getStatus
  });

  global.DGBPlanetOneTerrainRender = api;

  if (typeof window !== "undefined") {
    window.DGBPlanetOneTerrainRender = api;
  }
})(window);
