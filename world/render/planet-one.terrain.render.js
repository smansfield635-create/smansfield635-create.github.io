/*
  PLANET_ONE_TERRAIN_RENDER_V5_RELIEF_ADHESION_CRUST_REALISM_TNT_v1
  TARGET=/world/render/planet-one.terrain.render.js

  PRESERVED MARKERS:
  PLANET_ONE_TERRAIN_RENDER_V4_HYDRO_TERRAIN_MARRIAGE_PAIR_TNT_v1
  PLANET_ONE_TERRAIN_RENDER_V3_VISUAL_39B_CRUST_REALISM_TNT_v1
  PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1

  REQUIRED GAUGE MARKERS:
  PLANET_ONE_TERRAIN_RENDER_V4_HYDRO_TERRAIN_MARRIAGE_PAIR_TNT_v1
  PLANET_ONE_TERRAIN_RENDER_V5_RELIEF_ADHESION_CRUST_REALISM_TNT_v1
  window.DGBPlanetOneTerrainRender
  createTerrainLayer
  hydration-engine-paired=true
  hydro-terrain-marriage-active=true
  terrain-water-adhesion-active=true
  shoreline-marriage-active=true
  mountains-canyons-rivers-lakes-glaciers-ready=true
  terrain-contained-to-land=true
  land-water-separation-quota-preserved=true
  world-body-terrain-expression-active=true
  no-lily-pad-terrain=true

  ROLE:
  Terrain authority only.
  Pairs with hydration when available.
  Does not own route boot, weather, light, axis, or main-renderer composition.

  V5 PURPOSE:
  Stop flat lily-pad land read.
  Increase world-body crust relief.
  Add mountain belts, plateau pressure, canyon cuts, river grooves,
  lake basins, glacier grounding, mineral strata, shoreline adhesion,
  and terrain-water edge blending.
*/

(function attachPlanetOneTerrainRender(global) {
  "use strict";

  const VERSION = "PLANET_ONE_TERRAIN_RENDER_V5_RELIEF_ADHESION_CRUST_REALISM_TNT_v1";
  const PREVIOUS_V4 = "PLANET_ONE_TERRAIN_RENDER_V4_HYDRO_TERRAIN_MARRIAGE_PAIR_TNT_v1";
  const PREVIOUS_V3 = "PLANET_ONE_TERRAIN_RENDER_V3_VISUAL_39B_CRUST_REALISM_TNT_v1";
  const PREVIOUS_V2 = "PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1";
  const ROOT_VERSION = "PLANET_ONE_TERRAIN_RENDER_V1_256_LATTICE_TNT_v1";

  const PLANET = "Planet 1";
  const AUTHORITY = "/world/render/planet-one.terrain.render.js";
  const HYDRATION_AUTHORITY = "/world/render/planet-one.hydration.render.js";
  const PRIMARY_RENDERER = "/world/render/planet-one.render.js";

  const REQUIRED_MARKERS = Object.freeze([
    VERSION,
    PREVIOUS_V4,
    PREVIOUS_V3,
    PREVIOUS_V2,
    "window.DGBPlanetOneTerrainRender",
    "createTerrainLayer",
    "hydration-engine-paired=true",
    "hydro-terrain-marriage-active=true",
    "terrain-water-adhesion-active=true",
    "shoreline-marriage-active=true",
    "mountains-canyons-rivers-lakes-glaciers-ready=true",
    "terrain-contained-to-land=true",
    "land-water-separation-quota-preserved=true",
    "world-body-terrain-expression-active=true",
    "no-lily-pad-terrain=true"
  ]);

  const RAW_MATERIALS = Object.freeze([
    { key: "diamond", vein: "rgba(235,248,255,0.58)", crust: "rgba(210,238,255,0.34)" },
    { key: "opal", vein: "rgba(160,230,210,0.50)", crust: "rgba(176,230,218,0.31)" },
    { key: "marble", vein: "rgba(242,232,210,0.50)", crust: "rgba(238,230,210,0.30)" },
    { key: "slate", vein: "rgba(102,116,126,0.48)", crust: "rgba(74,86,94,0.40)" },
    { key: "granite", vein: "rgba(138,128,112,0.48)", crust: "rgba(112,105,93,0.40)" },
    { key: "gold", vein: "rgba(255,215,125,0.58)", crust: "rgba(242,199,111,0.36)" },
    { key: "platinum", vein: "rgba(226,232,235,0.52)", crust: "rgba(218,224,226,0.31)" },
    { key: "silver", vein: "rgba(210,224,232,0.52)", crust: "rgba(198,214,225,0.31)" },
    { key: "copper", vein: "rgba(205,130,82,0.54)", crust: "rgba(194,119,73,0.34)" },
    { key: "iron", vein: "rgba(150,78,62,0.54)", crust: "rgba(126,70,58,0.36)" },
    { key: "lead", vein: "rgba(88,96,108,0.50)", crust: "rgba(76,83,92,0.34)" }
  ]);

  let uidCounter = 0;

  function nextUid() {
    uidCounter += 1;
    return "p1terrainv5_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function hasHydrationModule() {
    return Boolean(
      global.DGBPlanetOneHydrationRender &&
      typeof global.DGBPlanetOneHydrationRender.createHydrationLayer === "function"
    );
  }

  function safeValue(value, fallback) {
    return value == null ? fallback : value;
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
        <path id="${uid}_northPole" d="M374 105 L421 80 L488 74 L548 82 L603 103 L647 133 L638 164 L596 185 L534 178 L489 195 L433 177 L394 154 L362 130Z"></path>

        <path id="${uid}_northRegion" d="M297 195 L351 163 L414 151 L474 167 L535 159 L596 187 L650 229 L691 278 L672 324 L622 351 L568 343 L522 370 L466 352 L422 361 L372 395 L310 380 L256 340 L226 288 L249 233Z"></path>

        <path id="${uid}_mainland" d="M302 405 L361 366 L431 354 L494 375 L559 365 L618 403 L669 463 L691 529 L672 604 L621 672 L555 713 L476 729 L405 704 L345 660 L297 599 L270 528 L279 461Z"></path>

        <path id="${uid}_westRegion" d="M146 391 L202 352 L268 349 L322 382 L356 437 L344 502 L304 562 L247 603 L180 619 L120 588 L84 532 L90 469Z"></path>

        <path id="${uid}_eastRegion" d="M673 382 L737 349 L807 361 L867 407 L904 469 L898 539 L856 599 L791 631 L722 615 L667 571 L640 507 L647 436Z"></path>

        <path id="${uid}_southRegion" d="M318 721 L380 694 L449 704 L515 727 L578 762 L621 814 L606 865 L548 904 L470 900 L394 871 L334 824 L295 769Z"></path>

        <path id="${uid}_southPole" d="M374 887 L436 860 L509 856 L580 875 L633 907 L617 943 L557 969 L481 973 L411 953 L367 921Z"></path>
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

      <clipPath id="${land.northRegion}Clip"><use href="#${land.northRegion}"></use></clipPath>
      <clipPath id="${land.mainland}Clip"><use href="#${land.mainland}"></use></clipPath>
      <clipPath id="${land.westRegion}Clip"><use href="#${land.westRegion}"></use></clipPath>
      <clipPath id="${land.eastRegion}Clip"><use href="#${land.eastRegion}"></use></clipPath>
      <clipPath id="${land.southRegion}Clip"><use href="#${land.southRegion}"></use></clipPath>
    `;
  }

  function createTerrainDefs(uid) {
    return `
      <radialGradient id="${uid}_northRelief" cx="38%" cy="24%" r="82%">
        <stop offset="0%" stop-color="rgba(176,186,123,0.96)"></stop>
        <stop offset="38%" stop-color="rgba(93,121,83,0.88)"></stop>
        <stop offset="72%" stop-color="rgba(54,76,61,0.88)"></stop>
        <stop offset="100%" stop-color="rgba(25,35,31,0.92)"></stop>
      </radialGradient>

      <radialGradient id="${uid}_mainlandRelief" cx="36%" cy="25%" r="90%">
        <stop offset="0%" stop-color="rgba(161,178,103,0.94)"></stop>
        <stop offset="30%" stop-color="rgba(95,134,80,0.90)"></stop>
        <stop offset="62%" stop-color="rgba(58,91,70,0.90)"></stop>
        <stop offset="100%" stop-color="rgba(28,39,33,0.95)"></stop>
      </radialGradient>

      <radialGradient id="${uid}_dryRelief" cx="35%" cy="27%" r="82%">
        <stop offset="0%" stop-color="rgba(169,140,91,0.94)"></stop>
        <stop offset="44%" stop-color="rgba(109,91,66,0.88)"></stop>
        <stop offset="100%" stop-color="rgba(42,36,31,0.92)"></stop>
      </radialGradient>

      <radialGradient id="${uid}_iceRelief" cx="34%" cy="22%" r="82%">
        <stop offset="0%" stop-color="rgba(248,255,255,0.86)"></stop>
        <stop offset="46%" stop-color="rgba(202,229,234,0.70)"></stop>
        <stop offset="100%" stop-color="rgba(111,142,157,0.58)"></stop>
      </radialGradient>

      <filter id="${uid}_ancientCrustTexture" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.048 0.091" numOctaves="7" seed="39005" result="oldNoise"></feTurbulence>
        <feColorMatrix
          in="oldNoise"
          type="matrix"
          values="
            0.50 0.00 0.00 0 0
            0.00 0.42 0.00 0 0
            0.00 0.00 0.34 0 0
            0.00 0.00 0.00 0.50 0"
          result="crustNoise">
        </feColorMatrix>
        <feBlend in="SourceGraphic" in2="crustNoise" mode="multiply"></feBlend>
      </filter>

      <filter id="${uid}_deepRelief" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="-1.7" dy="-1.2" stdDeviation="1.1" flood-color="#f2d58e" flood-opacity="0.13"></feDropShadow>
        <feDropShadow dx="2.2" dy="3.7" stdDeviation="2.8" flood-color="#000000" flood-opacity="0.55"></feDropShadow>
      </filter>

      <filter id="${uid}_mountainLift" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="-0.8" dy="-2.1" stdDeviation="1.0" flood-color="#fff0b8" flood-opacity="0.18"></feDropShadow>
        <feDropShadow dx="1.8" dy="4.6" stdDeviation="3.4" flood-color="#000000" flood-opacity="0.50"></feDropShadow>
      </filter>

      <filter id="${uid}_canyonCut" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0.6" dy="1.4" stdDeviation="1.0" flood-color="#000000" flood-opacity="0.68"></feDropShadow>
        <feDropShadow dx="-0.4" dy="-0.7" stdDeviation="0.7" flood-color="#d28b5f" flood-opacity="0.16"></feDropShadow>
      </filter>

      <filter id="${uid}_shoreAdhesionGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#4ad2d8" flood-opacity="0.32"></feDropShadow>
        <feDropShadow dx="0" dy="0" stdDeviation="8.2" flood-color="#1d8090" flood-opacity="0.16"></feDropShadow>
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
        <g opacity="0.36" filter="url(#${uid}_shoreAdhesionGlow)">
          <use href="#${land.northPole}" fill="none" stroke="rgba(41,166,203,0.70)" stroke-width="24" stroke-linejoin="round"></use>
          <use href="#${land.northRegion}" fill="none" stroke="rgba(41,166,203,0.70)" stroke-width="26" stroke-linejoin="round"></use>
          <use href="#${land.mainland}" fill="none" stroke="rgba(41,166,203,0.70)" stroke-width="28" stroke-linejoin="round"></use>
          <use href="#${land.westRegion}" fill="none" stroke="rgba(41,166,203,0.70)" stroke-width="24" stroke-linejoin="round"></use>
          <use href="#${land.eastRegion}" fill="none" stroke="rgba(41,166,203,0.70)" stroke-width="24" stroke-linejoin="round"></use>
          <use href="#${land.southRegion}" fill="none" stroke="rgba(41,166,203,0.70)" stroke-width="24" stroke-linejoin="round"></use>
          <use href="#${land.southPole}" fill="none" stroke="rgba(41,166,203,0.70)" stroke-width="25" stroke-linejoin="round"></use>
        </g>

        <g opacity="0.42">
          <path d="M421 203 C446 255 462 303 485 356 C508 412 526 462 555 520" fill="none" stroke="rgba(95,222,242,0.58)" stroke-width="5.8" stroke-linecap="round"></path>
          <path d="M376 397 C415 432 454 461 503 485 C548 507 593 535 635 576" fill="none" stroke="rgba(95,222,242,0.42)" stroke-width="4.7" stroke-linecap="round"></path>
          <path d="M241 404 C274 451 304 491 333 550" fill="none" stroke="rgba(95,222,242,0.40)" stroke-width="4.2" stroke-linecap="round"></path>
          <path d="M752 404 C723 448 702 492 681 548" fill="none" stroke="rgba(95,222,242,0.38)" stroke-width="4.2" stroke-linecap="round"></path>
        </g>

        <g opacity="0.62">
          <path d="M452 512 L490 491 L535 501 L566 529 L526 550 L481 543Z" fill="rgba(27,118,151,0.72)"></path>
          <path d="M383 610 L420 593 L459 601 L481 627 L445 645 L405 638Z" fill="rgba(27,118,151,0.46)"></path>
          <path d="M720 520 L755 505 L792 514 L813 540 L779 557 L742 548Z" fill="rgba(27,118,151,0.46)"></path>
        </g>
      </g>
    `;
  }

  function hydrationLayer(uid, land) {
    if (hasHydrationModule()) {
      try {
        return global.DGBPlanetOneHydrationRender.createHydrationLayer(uid, {
          land: land,
          includeDefs: true,
          terrainAdhesion: true,
          shorelineMarriage: true
        });
      } catch (error) {
        return createFallbackHydration(uid, land);
      }
    }

    return createFallbackHydration(uid, land);
  }

  function createLandBody(uid, land) {
    return `
      <g aria-label="married terrain land body" filter="url(#${uid}_ancientCrustTexture)">
        <use href="#${land.northPole}" fill="url(#${uid}_iceRelief)"></use>
        <use href="#${land.northRegion}" fill="url(#${uid}_northRelief)"></use>
        <use href="#${land.mainland}" fill="url(#${uid}_mainlandRelief)"></use>
        <use href="#${land.westRegion}" fill="url(#${uid}_dryRelief)"></use>
        <use href="#${land.eastRegion}" fill="url(#${uid}_northRelief)"></use>
        <use href="#${land.southRegion}" fill="url(#${uid}_mainlandRelief)"></use>
        <use href="#${land.southPole}" fill="url(#${uid}_iceRelief)"></use>
      </g>
    `;
  }

  function createShoreAdhesion(uid, land) {
    return `
      <g
        aria-label="shoreline adhesion bands"
        data-shoreline-marriage-active="true"
        data-terrain-water-adhesion-active="true"
        filter="url(#${uid}_shoreAdhesionGlow)"
      >
        <use href="#${land.northPole}" fill="none" stroke="rgba(92,220,225,0.34)" stroke-width="17" stroke-linejoin="round"></use>
        <use href="#${land.northRegion}" fill="none" stroke="rgba(92,220,225,0.34)" stroke-width="18" stroke-linejoin="round"></use>
        <use href="#${land.mainland}" fill="none" stroke="rgba(92,220,225,0.34)" stroke-width="20" stroke-linejoin="round"></use>
        <use href="#${land.westRegion}" fill="none" stroke="rgba(92,220,225,0.32)" stroke-width="17" stroke-linejoin="round"></use>
        <use href="#${land.eastRegion}" fill="none" stroke="rgba(92,220,225,0.32)" stroke-width="17" stroke-linejoin="round"></use>
        <use href="#${land.southRegion}" fill="none" stroke="rgba(92,220,225,0.32)" stroke-width="17" stroke-linejoin="round"></use>
        <use href="#${land.southPole}" fill="none" stroke="rgba(92,220,225,0.34)" stroke-width="17" stroke-linejoin="round"></use>

        <use href="#${land.northRegion}" fill="none" stroke="rgba(225,255,247,0.20)" stroke-width="4" stroke-linejoin="round"></use>
        <use href="#${land.mainland}" fill="none" stroke="rgba(225,255,247,0.21)" stroke-width="4.6" stroke-linejoin="round"></use>
        <use href="#${land.eastRegion}" fill="none" stroke="rgba(225,255,247,0.18)" stroke-width="3.8" stroke-linejoin="round"></use>
        <use href="#${land.westRegion}" fill="none" stroke="rgba(225,255,247,0.18)" stroke-width="3.8" stroke-linejoin="round"></use>
      </g>
    `;
  }

  function createRelief(uid) {
    return `
      <g aria-label="mountain belts and plateau pressure" filter="url(#${uid}_mountainLift)">
        <path d="M247 248 C326 202 421 219 515 269 C597 313 647 302 710 268" fill="none" stroke="rgba(20,24,22,0.74)" stroke-width="10.5" stroke-linecap="round"></path>
        <path d="M264 257 C343 227 423 237 508 283 C583 323 638 316 697 291" fill="none" stroke="rgba(225,194,116,0.22)" stroke-width="4.2" stroke-linecap="round"></path>

        <path d="M306 462 C395 382 526 392 641 490" fill="none" stroke="rgba(18,23,20,0.78)" stroke-width="13.0" stroke-linecap="round"></path>
        <path d="M321 474 C417 427 531 443 659 526" fill="none" stroke="rgba(220,182,112,0.24)" stroke-width="5.6" stroke-linecap="round"></path>

        <path d="M316 535 C412 496 544 526 660 594" fill="none" stroke="rgba(44,33,26,0.68)" stroke-width="9.4" stroke-linecap="round"></path>
        <path d="M103 492 C164 404 259 406 339 483" fill="none" stroke="rgba(25,25,22,0.68)" stroke-width="9.0" stroke-linecap="round"></path>
        <path d="M657 454 C724 389 821 402 890 488" fill="none" stroke="rgba(27,31,26,0.68)" stroke-width="9.0" stroke-linecap="round"></path>

        <path d="M352 724 C421 746 492 765 574 827" fill="none" stroke="rgba(30,31,24,0.58)" stroke-width="8.2" stroke-linecap="round"></path>
      </g>

      <g aria-label="secondary ridge mesh" opacity="0.62">
        <path d="M292 322 C364 298 456 308 548 361" fill="none" stroke="rgba(246,221,143,0.20)" stroke-width="3" stroke-linecap="round"></path>
        <path d="M365 419 C437 395 526 407 602 460" fill="none" stroke="rgba(246,221,143,0.17)" stroke-width="2.8" stroke-linecap="round"></path>
        <path d="M388 604 C468 586 553 610 630 659" fill="none" stroke="rgba(246,221,143,0.16)" stroke-width="2.7" stroke-linecap="round"></path>
        <path d="M700 464 C753 439 824 465 871 525" fill="none" stroke="rgba(246,221,143,0.15)" stroke-width="2.6" stroke-linecap="round"></path>
        <path d="M139 510 C187 462 260 460 320 522" fill="none" stroke="rgba(246,221,143,0.15)" stroke-width="2.6" stroke-linecap="round"></path>
      </g>
    `;
  }

  function createCanyonCuts(uid) {
    return `
      <g aria-label="canyon cuts and basin incisions" filter="url(#${uid}_canyonCut)">
        <path d="M305 270 C348 333 389 382 448 437 C502 488 543 544 590 620" fill="none" stroke="rgba(65,36,28,0.72)" stroke-width="8.4" stroke-linecap="round"></path>
        <path d="M319 280 C365 341 407 391 463 444 C514 493 554 551 601 624" fill="none" stroke="rgba(205,119,72,0.22)" stroke-width="2.8" stroke-linecap="round"></path>

        <path d="M502 380 C470 433 449 486 428 553 C414 599 394 644 366 694" fill="none" stroke="rgba(61,34,28,0.60)" stroke-width="7.2" stroke-linecap="round"></path>
        <path d="M737 396 C709 453 692 510 669 572" fill="none" stroke="rgba(61,34,28,0.54)" stroke-width="6.4" stroke-linecap="round"></path>
        <path d="M249 391 C279 452 306 516 335 585" fill="none" stroke="rgba(61,34,28,0.54)" stroke-width="6.2" stroke-linecap="round"></path>
      </g>
    `;
  }

  function createHydroTerrainCuts() {
    return `
      <g
        aria-label="rivers lakes glaciers and basin catchments"
        data-mountains-canyons-rivers-lakes-glaciers-ready="true"
        data-hydro-terrain-marriage-active="true"
      >
        <g opacity="0.64">
          <path d="M421 204 C447 256 462 304 486 357 C510 414 529 463 557 521" fill="none" stroke="rgba(92,223,241,0.58)" stroke-width="4.2" stroke-linecap="round"></path>
          <path d="M375 397 C416 433 455 461 504 485 C549 508 594 536 636 577" fill="none" stroke="rgba(92,223,241,0.45)" stroke-width="3.8" stroke-linecap="round"></path>
          <path d="M241 404 C276 453 305 492 335 550" fill="none" stroke="rgba(92,223,241,0.42)" stroke-width="3.4" stroke-linecap="round"></path>
          <path d="M752 404 C724 448 702 493 681 548" fill="none" stroke="rgba(92,223,241,0.40)" stroke-width="3.4" stroke-linecap="round"></path>
          <path d="M387 721 C432 759 492 786 552 842" fill="none" stroke="rgba(92,223,241,0.34)" stroke-width="3.2" stroke-linecap="round"></path>
        </g>

        <g opacity="0.72">
          <path d="M452 512 L490 491 L535 501 L566 529 L526 550 L481 543Z" fill="rgba(24,113,147,0.76)"></path>
          <path d="M383 610 L420 593 L459 601 L481 627 L445 645 L405 638Z" fill="rgba(24,113,147,0.52)"></path>
          <path d="M720 520 L755 505 L792 514 L813 540 L779 557 L742 548Z" fill="rgba(24,113,147,0.50)"></path>
          <path d="M498 333 L526 320 L558 329 L574 351 L543 363 L513 356Z" fill="rgba(24,113,147,0.42)"></path>
        </g>

        <g opacity="0.72">
          <path d="M424 83 C489 68 570 75 633 126 C574 142 507 140 438 118Z" fill="rgba(228,247,250,0.58)"></path>
          <path d="M379 890 C451 860 548 862 623 908 C557 927 466 929 399 912Z" fill="rgba(228,247,250,0.54)"></path>
        </g>
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
      ["iron", "M269 653 C358 609 474 625 578 690"],
      ["lead", "M391 752 C458 751 530 780 587 838"],
      ["platinum", "M336 338 C390 329 470 346 541 389"],
      ["silver", "M190 486 C238 453 304 464 346 526"]
    ];

    return `
      <g aria-label="embedded raw material veins" data-raw-material-strata-active="true">
        ${seams.map(function draw(item, index) {
          const material = RAW_MATERIALS.find(function find(candidate) {
            return candidate.key === item[0];
          }) || RAW_MATERIALS[index % RAW_MATERIALS.length];

          return `
            <path
              d="${item[1]}"
              fill="none"
              stroke="${material.vein}"
              stroke-width="${index % 3 === 0 ? "3.0" : "2.1"}"
              stroke-linecap="round"
              opacity="${index % 3 === 0 ? "0.34" : "0.24"}"
              data-material="${material.key}"
            ></path>
          `;
        }).join("")}
      </g>
    `;
  }

  function createMicroRelief() {
    const dots = [];
    let i;

    for (i = 0; i < 92; i += 1) {
      const x = 130 + ((i * 83) % 760);
      const y = 120 + ((i * 137) % 760);
      const r = 1.2 + ((i * 7) % 6) * 0.23;
      const opacity = 0.055 + ((i * 11) % 7) * 0.012;

      dots.push(`
        <circle
          cx="${x}"
          cy="${y}"
          r="${r.toFixed(2)}"
          fill="rgba(255,245,197,${opacity.toFixed(3)})"
        ></circle>
      `);
    }

    return `
      <g
        clip-path="url(#__LAND_ALL_CLIP__)"
        aria-label="non-flat micro relief grain"
        opacity="0.95"
      >
        ${dots.join("")}
      </g>
    `;
  }

  function createTerrainLayer(uid, options) {
    const opts = options || {};
    const land = opts.land || createLandPathDefs(uid);
    const includeLandContext = opts.includeLandContext !== false;
    const hydrationPaired = hasHydrationModule();
    const microRelief = createMicroRelief().replace(/__LAND_ALL_CLIP__/g, `${land.landAll}Clip`);

    return `
      <g
        class="planet-one-terrain-layer"
        data-render-engine="${VERSION}"
        data-previous-v4="${PREVIOUS_V4}"
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

        data-world-body-terrain-expression-active="true"
        data-no-lily-pad-terrain="true"
        data-relief-adhesion-crust-realism-active="true"

        data-terrain-contained-to-land="true"
        data-land-water-separation-quota-preserved="true"
        data-water-depth-owned-by-water-pass="true"
        data-no-final-geography-closure="true"
        aria-label="Planet 1 hydro-terrain marriage relief layer"
      >
        <defs>
          ${createTerrainDefs(uid)}
        </defs>

        ${hydrationLayer(uid, land)}
        ${createShoreAdhesion(uid, land)}

        <g clip-path="url(#${land.landAll}Clip)" aria-label="land-contained married terrain crust">
          ${includeLandContext ? createLandBody(uid, land) : ""}
          ${microRelief}
          ${createMineralVeins()}
          ${createRelief(uid)}
          ${createCanyonCuts(uid)}
          ${createHydroTerrainCuts()}
        </g>
      </g>
    `;
  }

  function createStandaloneSvg(uid) {
    const land = createLandPathDefs(uid);

    return `
      <svg viewBox="0 0 1000 1000" role="img" aria-label="Planet 1 V5 relief adhesion crust realism render">
        <defs>
          <clipPath id="${uid}_sphereClip"><circle cx="500" cy="500" r="394"></circle></clipPath>
          <radialGradient id="${uid}_oceanContext" cx="34%" cy="28%" r="78%">
            <stop offset="0%" stop-color="#1d99c1"></stop>
            <stop offset="30%" stop-color="#105c84"></stop>
            <stop offset="60%" stop-color="#06304f"></stop>
            <stop offset="100%" stop-color="#020814"></stop>
          </radialGradient>
          ${land.defs}
          ${createClipDefs(land)}
        </defs>

        <circle cx="500" cy="500" r="430" fill="rgba(6,18,32,0.64)"></circle>
        <g clip-path="url(#${uid}_sphereClip)">
          <rect x="70" y="70" width="860" height="860" fill="url(#${uid}_oceanContext)" opacity="0.40"></rect>
          ${createTerrainLayer(uid, { land: land, includeLandContext: true })}
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
        data-previous-v4="${PREVIOUS_V4}"
        data-previous-v3="${PREVIOUS_V3}"
        data-previous-v2="${PREVIOUS_V2}"
        data-hydro-terrain-marriage-active="true"
        data-hydration-engine-paired="${hasHydrationModule() ? "true" : "fallback"}"
        data-world-body-terrain-expression-active="true"
        data-no-lily-pad-terrain="true"
      >
        ${createStandaloneSvg(uid)}
      </section>
    `;

    return {
      ok: true,
      version: VERSION,
      previousV4: PREVIOUS_V4,
      hydrationEnginePaired: hasHydrationModule(),
      worldBodyTerrainExpressionActive: true,
      noLilyPadTerrain: true
    };
  }

  function getStatus() {
    return {
      version: VERSION,
      previousV4: PREVIOUS_V4,
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
      landWaterSeparationQuotaPreserved: true,
      worldBodyTerrainExpressionActive: true,
      noLilyPadTerrain: true,
      reliefAdhesionCrustRealismActive: true,
      requiredMarkers: REQUIRED_MARKERS.slice()
    };
  }

  const api = Object.freeze({
    VERSION,
    PREVIOUS_V4,
    PREVIOUS_V3,
    PREVIOUS_V2,
    ROOT_VERSION,
    PLANET,
    AUTHORITY,
    HYDRATION_AUTHORITY,
    PRIMARY_RENDERER,
    RAW_MATERIALS,
    REQUIRED_MARKERS,
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
