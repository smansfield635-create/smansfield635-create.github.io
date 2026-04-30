(function attachPlanetOneTerrainRender(global) {
  "use strict";

  const VERSION = "PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1";
  const PREVIOUS_VERSION = "PLANET_ONE_TERRAIN_RENDER_V1_256_LATTICE_TNT_v1";
  const PLANET = "Planet 1";
  const AUTHORITY = "/world/render/planet-one.terrain.render.js";
  const PRIMARY_RENDERER = "/world/render/planet-one.render.js";
  const AGE_TARGET = "39-billion-years";

  /*
    PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1

    PURPOSE=
    RENEW_PLANET_1_TERRAIN_FROM_CARTOON_LATTICE_TO_ANCIENT_CRUST_ENGINE
    PRESERVE_256_LATTICE_GEOMETRY_UNDER_THE_HOOD
    EXPRESS_39_BILLION_YEAR_GEOLOGICAL_WEIGHT
    PRESERVE_RAW_MATERIAL_STRATA
    PRESERVE_LAND_WATER_SEPARATION_QUOTA
    FEED_THE_OPTIMUM_EXPRESSION_RENDERER

    PLANET_SPECIFICATION=
    terrain-engine-planet=Planet 1
    planet-one-terrain-render-active=true
    ancient-39b-crust-engine-active=true

    HARD RULES=
    TERRAIN_ONLY
    NO_WATER_DEPTH_OWNERSHIP
    NO_OCEAN_CURRENT_OWNERSHIP
    NO_WEATHER_OWNERSHIP
    NO_LIGHTING_OWNERSHIP
    NO_AXIS_OWNERSHIP
    NO_FINAL_COUNTRIES
    NO_FINAL_CITIES
    NO_FINAL_RIVERS
    NO_FINAL_CLIMATE_NAMES
    NO_FINAL_PHYSICS
    NO_FINAL_MAP_GEOMETRY

    CONTRACT MARKERS=
    terrain-256-lattice-engine-active=true
    ancient-39b-crust-engine-active=true
    pressure-formed-crust-active=true
    raw-material-strata-active=true
    mineral-pressure-active=true
    tectonic-scar-network-active=true
    erosion-and-fracture-active=true
    terrain-contained-to-land=true
    land-water-separation-quota-preserved=true
    water-depth-owned-by-water-pass=true
    planet-one-specified=true
  */

  const RAW_MATERIALS = Object.freeze([
    { key: "diamond", label: "Diamond", color: "rgba(210,238,255,0.42)", vein: "rgba(235,248,255,0.46)" },
    { key: "opal", label: "Opal", color: "rgba(176,230,218,0.38)", vein: "rgba(160,230,210,0.40)" },
    { key: "marble", label: "Marble", color: "rgba(238,230,210,0.38)", vein: "rgba(242,232,210,0.42)" },
    { key: "slate", label: "Slate", color: "rgba(74,86,94,0.42)", vein: "rgba(102,116,126,0.36)" },
    { key: "granite", label: "Granite", color: "rgba(112,105,93,0.44)", vein: "rgba(138,128,112,0.38)" },
    { key: "gold", label: "Gold", color: "rgba(242,199,111,0.42)", vein: "rgba(255,215,125,0.44)" },
    { key: "platinum", label: "Platinum", color: "rgba(218,224,226,0.38)", vein: "rgba(226,232,235,0.40)" },
    { key: "silver", label: "Silver", color: "rgba(198,214,225,0.38)", vein: "rgba(210,224,232,0.40)" },
    { key: "copper", label: "Copper", color: "rgba(194,119,73,0.40)", vein: "rgba(205,130,82,0.42)" },
    { key: "iron", label: "Iron", color: "rgba(126,70,58,0.42)", vein: "rgba(150,78,62,0.40)" },
    { key: "lead", label: "Lead", color: "rgba(76,83,92,0.38)", vein: "rgba(88,96,108,0.38)" }
  ]);

  const MARKERS = Object.freeze({
    version: VERSION,
    previousVersion: PREVIOUS_VERSION,
    planet: PLANET,
    ageTarget: AGE_TARGET,
    authority: AUTHORITY,
    primaryRenderer: PRIMARY_RENDERER,

    planetOneTerrainRenderActive: true,
    planetOneSpecified: true,
    terrainEnginePlanet: PLANET,

    terrain256LatticeEngineActive: true,
    ancient39bCrustEngineActive: true,
    pressureFormedCrustActive: true,
    rawMaterialStrataActive: true,
    mineralPressureActive: true,
    tectonicScarNetworkActive: true,
    erosionAndFractureActive: true,
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
    return "p1terrainv2_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function injectStyles() {
    if (document.getElementById("planet-one-terrain-render-v2-styles")) return;

    const style = document.createElement("style");
    style.id = "planet-one-terrain-render-v2-styles";
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
        filter: drop-shadow(0 30px 56px rgba(0, 0, 0, 0.62));
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

      <clipPath id="${land.northRegion}Clip"><use href="#${land.northRegion}"></use></clipPath>
      <clipPath id="${land.mainland}Clip"><use href="#${land.mainland}"></use></clipPath>
      <clipPath id="${land.westRegion}Clip"><use href="#${land.westRegion}"></use></clipPath>
      <clipPath id="${land.eastRegion}Clip"><use href="#${land.eastRegion}"></use></clipPath>
      <clipPath id="${land.southRegion}Clip"><use href="#${land.southRegion}"></use></clipPath>
    `;
  }

  function createTerrainDefs(uid) {
    return `
      <filter id="${uid}_ancientCrustTexture" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.032 0.068" numOctaves="5" seed="39000" result="ancientNoise"></feTurbulence>
        <feColorMatrix
          in="ancientNoise"
          type="matrix"
          values="
            0.36 0.00 0.00 0 0
            0.00 0.33 0.00 0 0
            0.00 0.00 0.26 0 0
            0.00 0.00 0.00 0.30 0"
          result="crustNoise">
        </feColorMatrix>
        <feBlend in="SourceGraphic" in2="crustNoise" mode="multiply"></feBlend>
      </filter>

      <filter id="${uid}_deepScarShadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="2.2" stdDeviation="1.8" flood-color="#02070d" flood-opacity="0.54"></feDropShadow>
      </filter>

      <filter id="${uid}_subtleCrustLift" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="-1" stdDeviation="1.1" flood-color="#f0d18b" flood-opacity="0.12"></feDropShadow>
        <feDropShadow dx="0" dy="2.4" stdDeviation="2.4" flood-color="#02070d" flood-opacity="0.30"></feDropShadow>
      </filter>
    `;
  }

  function createLandContext(land) {
    return `
      <g aria-label="Planet 1 subdued land context" opacity="0.34">
        <use href="#${land.northPole}" fill="#d8e4e8"></use>
        <use href="#${land.northRegion}" fill="#7d8664"></use>
        <use href="#${land.mainland}" fill="#637f4d"></use>
        <use href="#${land.westRegion}" fill="#6a5e50"></use>
        <use href="#${land.eastRegion}" fill="#647f6a"></use>
        <use href="#${land.southRegion}" fill="#747f57"></use>
        <use href="#${land.southPole}" fill="#d8e1e7"></use>
      </g>
    `;
  }

  function createLatticeCells() {
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
        const x = startX + col * stepX + ((row % 2) * 8);
        const y = startY + row * stepY;
        const length = 5 + pressure * 2.6;
        const angle = ((row * 19 + col * 23) % 68) - 34;
        const opacity = 0.055 + pressure * 0.018;

        cells.push(`
          <g transform="translate(${x} ${y}) rotate(${angle})" data-lattice-cell="${index + 1}" data-material="${material.key}" data-planet="${PLANET}">
            <line x1="${-length}" y1="0" x2="${length}" y2="0" stroke="${material.vein}" stroke-width="1.35" stroke-linecap="round" opacity="${opacity.toFixed(3)}"></line>
            <circle cx="0" cy="0" r="${(0.75 + pressure * 0.16).toFixed(2)}" fill="${material.color}" opacity="${(opacity + 0.018).toFixed(3)}"></circle>
          </g>
        `);
      }
    }

    return cells.join("");
  }

  function createScarNetwork(uid) {
    return `
      <g aria-label="39 billion year tectonic scar network" filter="url(#${uid}_deepScarShadow)">
        <path d="M252 255 C330 219 412 235 506 276 C589 312 638 306 696 276" fill="none" stroke="rgba(50,54,48,0.44)" stroke-width="5.8" stroke-linecap="round"></path>
        <path d="M290 334 C374 305 463 320 544 360 C604 389 644 385 677 365" fill="none" stroke="rgba(196,174,118,0.25)" stroke-width="3.1" stroke-linecap="round"></path>

        <path d="M303 462 C398 392 511 405 623 485" fill="none" stroke="rgba(48,52,44,0.48)" stroke-width="7.2" stroke-linecap="round"></path>
        <path d="M322 529 C411 503 530 530 646 590" fill="none" stroke="rgba(78,68,52,0.45)" stroke-width="5.4" stroke-linecap="round"></path>
        <path d="M387 646 C468 688 552 681 624 629" fill="none" stroke="rgba(193,158,98,0.22)" stroke-width="3.5" stroke-linecap="round"></path>

        <path d="M112 493 C172 423 252 417 326 481" fill="none" stroke="rgba(50,45,38,0.46)" stroke-width="5.8" stroke-linecap="round"></path>
        <path d="M655 456 C718 403 805 414 876 486" fill="none" stroke="rgba(55,57,47,0.42)" stroke-width="5.8" stroke-linecap="round"></path>

        <path d="M332 778 C418 830 517 847 604 807" fill="none" stroke="rgba(65,58,43,0.43)" stroke-width="6.1" stroke-linecap="round"></path>
      </g>
    `;
  }

  function createMineralSeams(uid) {
    const seams = [
      ["diamond", "M378 233 C415 217 462 221 511 242"],
      ["opal", "M434 294 C489 284 548 300 604 330"],
      ["marble", "M334 451 C411 421 507 438 603 501"],
      ["slate", "M358 575 C435 560 535 582 628 636"],
      ["granite", "M148 544 C203 514 257 527 305 568"],
      ["gold", "M684 515 C746 490 809 510 854 557"],
      ["platinum", "M384 846 C452 871 529 871 587 839"],
      ["silver", "M405 139 C473 116 547 120 607 154"],
      ["copper", "M266 312 C326 282 405 287 484 329"],
      ["iron", "M278 650 C360 616 461 629 560 684"],
      ["lead", "M118 478 C181 450 256 459 329 514"]
    ];

    return `
      <g aria-label="embedded raw material seams">
        ${seams.map(function mapSeam(item, index) {
          const material = RAW_MATERIALS.find(function findMaterial(candidate) {
            return candidate.key === item[0];
          }) || RAW_MATERIALS[index % RAW_MATERIALS.length];

          return `
            <path
              d="${item[1]}"
              fill="none"
              stroke="${material.vein}"
              stroke-width="${index % 3 === 0 ? "2.8" : "2.1"}"
              stroke-linecap="round"
              opacity="${index % 3 === 0 ? "0.24" : "0.18"}"
              data-material="${material.key}"
            ></path>
          `;
        }).join("")}
      </g>
    `;
  }

  function createErosionBands() {
    return `
      <g aria-label="ancient erosion and plateau wear">
        <path d="M272 292 C360 264 491 276 631 329" fill="none" stroke="rgba(218,203,150,0.22)" stroke-width="15" stroke-linecap="round"></path>
        <path d="M309 471 C421 434 535 450 658 520" fill="none" stroke="rgba(214,190,128,0.20)" stroke-width="16" stroke-linecap="round"></path>
        <path d="M309 600 C415 575 531 600 632 658" fill="none" stroke="rgba(119,96,64,0.26)" stroke-width="14" stroke-linecap="round"></path>
        <path d="M145 567 C205 540 256 552 306 594" fill="none" stroke="rgba(116,92,64,0.26)" stroke-width="13" stroke-linecap="round"></path>
        <path d="M674 562 C742 544 808 557 858 598" fill="none" stroke="rgba(90,104,76,0.25)" stroke-width="13" stroke-linecap="round"></path>
        <path d="M348 813 C431 846 520 850 600 818" fill="none" stroke="rgba(150,122,78,0.24)" stroke-width="13" stroke-linecap="round"></path>
      </g>
    `;
  }

  function createAncientCanyonBasins() {
    return `
      <g aria-label="ancient canyon and basin cuts">
        <path d="M455 511 L489 493 L531 501 L560 526 L523 544 L482 540Z" fill="rgba(16,58,66,0.58)" stroke="rgba(10,26,34,0.42)" stroke-width="3"></path>
        <path d="M735 494 L768 478 L809 486 L834 510 L801 528 L766 524Z" fill="rgba(18,57,65,0.52)" stroke="rgba(10,26,34,0.38)" stroke-width="3"></path>
        <path d="M395 602 C441 579 499 586 552 619 C520 650 463 655 410 632Z" fill="rgba(54,64,50,0.24)" stroke="rgba(23,30,24,0.32)" stroke-width="2.4"></path>
        <path d="M257 518 C282 493 320 494 343 520 C317 543 281 542 257 518Z" fill="rgba(48,56,48,0.24)" stroke="rgba(22,28,24,0.30)" stroke-width="2.2"></path>
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
        data-planet="${PLANET}"
        data-terrain-engine-planet="${PLANET}"
        data-age-target="${AGE_TARGET}"
        data-planet-one-terrain-render-active="true"
        data-ancient-39b-crust-engine-active="true"
        data-terrain-256-lattice-engine-active="true"
        data-pressure-formed-crust-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
        data-tectonic-scar-network-active="true"
        data-erosion-and-fracture-active="true"
        data-terrain-contained-to-land="true"
        data-land-water-separation-quota-preserved="true"
        data-water-depth-owned-by-water-pass="true"
        data-no-cartoon-surface-read="true"
        aria-label="Planet 1 ancient 39 billion year terrain crust layer"
      >
        <defs>
          ${createTerrainDefs(uid)}
        </defs>

        ${includeLandContext ? createLandContext(land) : ""}

        <g clip-path="url(#${land.landAll}Clip)" filter="url(#${uid}_ancientCrustTexture)" aria-label="Planet 1 ancient crust clipped to land">
          <g opacity="0.78" aria-label="subdued 256 lattice mineral field">
            ${createLatticeCells()}
          </g>

          <g filter="url(#${uid}_subtleCrustLift)" aria-label="pressure-formed crust">
            ${createErosionBands()}
            ${createScarNetwork(uid)}
            ${createMineralSeams(uid)}
            ${createAncientCanyonBasins()}
          </g>
        </g>
      </g>
    `;
  }

  function createStandaloneSvg(uid) {
    const land = createLandPathDefs(uid);

    return `
      <svg class="planet-one-terrain-svg" viewBox="0 0 1000 1000" role="img" aria-label="Planet 1 dedicated ancient terrain render">
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
          <rect x="70" y="70" width="860" height="860" fill="url(#${uid}_oceanContext)" opacity="0.34"></rect>
          ${createTerrainLayer(uid, { land: land, includeLandContext: true })}
        </g>

        <circle cx="500" cy="500" r="394" fill="none" stroke="rgba(160,214,255,0.24)" stroke-width="4"></circle>
      </svg>
    `;
  }

  function createTags() {
    return `
      <div class="planet-one-terrain-tags" aria-label="Planet 1 terrain render standards">
        <span>Planet 1</span>
        <span>39B crust</span>
        <span>Pressure formed</span>
        <span>256 lattice</span>
        <span>Raw materials</span>
        <span>Tectonic scars</span>
        <span>Land-contained</span>
        <span>Water quota preserved</span>
      </div>
    `;
  }

  function createNotes() {
    return `
      <div class="planet-one-terrain-notes" aria-label="Planet 1 terrain notes">
        <article>
          <strong>Ancient crust engine</strong>
          <span>This terrain render is for Planet 1 and targets a 39-billion-year-old crust read: scarred, pressure-formed, eroded, and mineral-rich.</span>
        </article>
        <article>
          <strong>Raw material strata</strong>
          <span>Diamond, opal, marble, slate, granite, gold, platinum, silver, copper, iron, and lead are expressed as embedded seams and crust pressure, not cartoon colors.</span>
        </article>
        <article>
          <strong>Boundary preserved</strong>
          <span>Terrain remains clipped to land. Water depth, ocean currents, weather, lighting, and axis remain owned by their own render layers.</span>
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
    const caption = escapeHtml(opts.caption || "Planet 1 · Ancient 39B terrain crust engine");

    mount.innerHTML = `
      <section
        class="planet-one-terrain-shell"
        data-render-version="${VERSION}"
        data-previous-render-version="${PREVIOUS_VERSION}"
        data-planet="${PLANET}"
        data-terrain-engine-planet="${PLANET}"
        data-age-target="${AGE_TARGET}"
        data-authority="${AUTHORITY}"
        data-primary-renderer="${PRIMARY_RENDERER}"
        data-planet-one-terrain-render-active="true"
        data-planet-one-specified="true"
        data-ancient-39b-crust-engine-active="true"
        data-terrain-256-lattice-engine-active="true"
        data-pressure-formed-crust-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
        data-tectonic-scar-network-active="true"
        data-erosion-and-fracture-active="true"
        data-terrain-contained-to-land="true"
        data-land-water-separation-quota-preserved="true"
        data-water-depth-owned-by-water-pass="true"
        data-no-cartoon-surface-read="true"
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
