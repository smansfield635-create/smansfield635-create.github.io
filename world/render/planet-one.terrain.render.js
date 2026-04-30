(function attachPlanetOneTerrainRender(global) {
  "use strict";

  const VERSION = "PLANET_ONE_TERRAIN_RENDER_V1_256_LATTICE_TNT_v1";
  const PLANET = "Planet 1";
  const AUTHORITY = "/world/render/planet-one.terrain.render.js";
  const PRIMARY_RENDERER = "/world/render/planet-one.render.js";

  /*
    PLANET_ONE_TERRAIN_RENDER_V1_256_LATTICE_TNT_v1

    PURPOSE=
    CREATE_DEDICATED_PLANET_1_TERRAIN_RENDER
    EXPRESS_TERRAIN_AS_ITS_OWN_RENDER_ENGINE
    PRESERVE_LAND_WATER_SEPARATION_QUOTA
    PRESERVE_RAW_MATERIAL_STRATA
    PRESERVE_256_LATTICE_GEOMETRY
    PREPARE_FOR_PRIMARY_RENDERER_INTEGRATION

    PLANET_SPECIFICATION=
    terrain-engine-planet=Planet 1
    planet-one-terrain-render-active=true

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
    raw-material-strata-active=true
    mineral-pressure-active=true
    terrain-contained-to-land=true
    land-water-separation-quota-preserved=true
    water-depth-owned-by-water-pass=true
    planet-one-specified=true
  */

  const RAW_MATERIALS = Object.freeze([
    { key: "diamond", label: "Diamond", color: "rgba(210, 238, 255, 0.56)" },
    { key: "opal", label: "Opal", color: "rgba(176, 230, 218, 0.52)" },
    { key: "marble", label: "Marble", color: "rgba(238, 230, 210, 0.52)" },
    { key: "slate", label: "Slate", color: "rgba(74, 86, 94, 0.50)" },
    { key: "granite", label: "Granite", color: "rgba(112, 105, 93, 0.54)" },
    { key: "gold", label: "Gold", color: "rgba(242, 199, 111, 0.60)" },
    { key: "platinum", label: "Platinum", color: "rgba(218, 224, 226, 0.52)" },
    { key: "silver", label: "Silver", color: "rgba(198, 214, 225, 0.52)" },
    { key: "copper", label: "Copper", color: "rgba(194, 119, 73, 0.50)" },
    { key: "iron", label: "Iron", color: "rgba(126, 70, 58, 0.48)" },
    { key: "lead", label: "Lead", color: "rgba(76, 83, 92, 0.46)" }
  ]);

  const MARKERS = Object.freeze({
    version: VERSION,
    planet: PLANET,
    authority: AUTHORITY,
    primaryRenderer: PRIMARY_RENDERER,

    planetOneTerrainRenderActive: true,
    planetOneSpecified: true,
    terrainEnginePlanet: PLANET,

    terrain256LatticeEngineActive: true,
    rawMaterialStrataActive: true,
    mineralPressureActive: true,
    terrainContainedToLand: true,
    landWaterSeparationQuotaPreserved: true,
    waterDepthOwnedByWaterPass: true,

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
    return "p1terrain_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function injectStyles() {
    if (document.getElementById("planet-one-terrain-render-styles")) return;

    const style = document.createElement("style");
    style.id = "planet-one-terrain-render-styles";
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
        filter: drop-shadow(0 28px 52px rgba(0, 0, 0, 0.58));
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

  function createTerrainFilters(uid) {
    return `
      <filter id="${uid}_terrainTexture" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022 0.044" numOctaves="4" seed="256" result="noise"></feTurbulence>
        <feColorMatrix
          in="noise"
          type="matrix"
          values="
            0.32 0.00 0.00 0 0
            0.00 0.38 0.00 0 0
            0.00 0.00 0.28 0 0
            0.00 0.00 0.00 0.22 0"
          result="texture">
        </feColorMatrix>
        <feBlend in="SourceGraphic" in2="texture" mode="multiply"></feBlend>
      </filter>

      <filter id="${uid}_ridgeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.1" flood-color="#04101a" flood-opacity="0.42"></feDropShadow>
      </filter>
    `;
  }

  function createLandContext(land) {
    return `
      <g aria-label="Planet 1 land context" opacity="0.46">
        <use href="#${land.northPole}" fill="#e2edf2"></use>
        <use href="#${land.northRegion}" fill="#8e9b70"></use>
        <use href="#${land.mainland}" fill="#6e9859"></use>
        <use href="#${land.westRegion}" fill="#7b6d5b"></use>
        <use href="#${land.eastRegion}" fill="#759d7d"></use>
        <use href="#${land.southRegion}" fill="#899765"></use>
        <use href="#${land.southPole}" fill="#dfe8ee"></use>
      </g>
    `;
  }

  function createLatticeCells() {
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
        const opacity = 0.16 + pressure * 0.035;

        cells.push(`
          <g transform="translate(${x} ${y}) rotate(${angle})" data-lattice-cell="${index + 1}" data-material="${material.key}" data-planet="${PLANET}">
            <line x1="${-length}" y1="0" x2="${length}" y2="0" stroke="${material.color}" stroke-width="2.2" stroke-linecap="round" opacity="${opacity.toFixed(2)}"></line>
            <circle cx="0" cy="0" r="${(1.4 + pressure * 0.35).toFixed(2)}" fill="${material.color}" opacity="${(opacity + 0.05).toFixed(2)}"></circle>
          </g>
        `);
      }
    }

    return cells.join("");
  }

  function createTerrainLayer(uid, options) {
    const opts = options || {};
    const land = opts.land || createLandPathDefs(uid);
    const includeLandContext = opts.includeLandContext !== false;

    return `
      <g
        class="planet-one-terrain-layer"
        data-render-engine="${VERSION}"
        data-planet="${PLANET}"
        data-terrain-engine-planet="${PLANET}"
        data-planet-one-terrain-render-active="true"
        data-terrain-256-lattice-engine-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
        data-terrain-contained-to-land="true"
        data-land-water-separation-quota-preserved="true"
        data-water-depth-owned-by-water-pass="true"
        aria-label="Planet 1 terrain render layer"
      >
        ${includeLandContext ? createLandContext(land) : ""}

        <g clip-path="url(#${land.landAll}Clip)" filter="url(#${uid}_terrainTexture)" aria-label="Planet 1 256 lattice terrain clipped to land">
          <g opacity="0.88">
            ${createLatticeCells()}
          </g>

          <g aria-label="America-meets-China terrain pressure">
            <path d="M270 279 C350 238 469 232 594 291" fill="none" stroke="rgba(218,195,140,0.48)" stroke-width="10" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
            <path d="M283 329 C380 306 502 312 628 346" fill="none" stroke="rgba(93,112,76,0.40)" stroke-width="13" stroke-linecap="round"></path>

            <path d="M320 481 C418 426 541 430 633 491" fill="none" stroke="rgba(218,196,131,0.50)" stroke-width="11" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
            <path d="M314 560 C421 535 540 553 649 604" fill="none" stroke="rgba(65,108,61,0.40)" stroke-width="14" stroke-linecap="round"></path>
            <path d="M408 659 C477 681 555 672 615 633" fill="none" stroke="rgba(183,154,98,0.40)" stroke-width="9" stroke-linecap="round"></path>

            <path d="M114 500 C170 443 239 434 318 482" fill="none" stroke="rgba(191,162,105,0.44)" stroke-width="10" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
            <path d="M127 553 C192 543 244 560 294 596" fill="none" stroke="rgba(95,87,73,0.40)" stroke-width="12" stroke-linecap="round"></path>

            <path d="M660 462 C718 417 804 422 870 480" fill="none" stroke="rgba(216,195,138,0.42)" stroke-width="10" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
            <path d="M680 550 C746 534 805 548 854 592" fill="none" stroke="rgba(77,118,96,0.40)" stroke-width="12" stroke-linecap="round"></path>

            <path d="M338 784 C419 814 506 840 592 813" fill="none" stroke="rgba(189,157,99,0.40)" stroke-width="10" stroke-linecap="round" filter="url(#${uid}_ridgeShadow)"></path>
            <path d="M376 858 C446 875 520 880 588 852" fill="none" stroke="rgba(111,116,79,0.36)" stroke-width="12" stroke-linecap="round"></path>
          </g>

          <g aria-label="Planet 1 basins and lake pockets">
            <path d="M455 511 L489 493 L531 501 L560 526 L523 544 L482 540Z" fill="rgba(11,82,107,0.80)"></path>
            <path d="M735 494 L768 478 L809 486 L834 510 L801 528 L766 524Z" fill="rgba(11,82,109,0.70)"></path>
          </g>
        </g>
      </g>
    `;
  }

  function createStandaloneSvg(uid) {
    const land = createLandPathDefs(uid);

    return `
      <svg class="planet-one-terrain-svg" viewBox="0 0 1000 1000" role="img" aria-label="Planet 1 dedicated terrain render">
        <defs>
          <clipPath id="${uid}_sphereClip">
            <circle cx="500" cy="500" r="394"></circle>
          </clipPath>

          <radialGradient id="${uid}_oceanContext" cx="34%" cy="28%" r="78%">
            <stop offset="0%" stop-color="#209bc7"></stop>
            <stop offset="25%" stop-color="#126c99"></stop>
            <stop offset="52%" stop-color="#073d66"></stop>
            <stop offset="76%" stop-color="#041f38"></stop>
            <stop offset="100%" stop-color="#020814"></stop>
          </radialGradient>

          ${land.defs}
          ${createClipDefs(land)}
          ${createTerrainFilters(uid)}
        </defs>

        <circle cx="500" cy="500" r="430" fill="rgba(6,18,32,0.62)"></circle>

        <g clip-path="url(#${uid}_sphereClip)">
          <rect x="70" y="70" width="860" height="860" fill="url(#${uid}_oceanContext)" opacity="0.42"></rect>
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
        <span>Terrain render</span>
        <span>256 lattice</span>
        <span>Raw materials</span>
        <span>Mineral pressure</span>
        <span>Land-contained</span>
        <span>Water quota preserved</span>
        <span>No final geography closure</span>
      </div>
    `;
  }

  function createNotes() {
    return `
      <div class="planet-one-terrain-notes" aria-label="Planet 1 terrain notes">
        <article>
          <strong>Planet 1 terrain only</strong>
          <span>This file renders terrain for Planet 1. It does not own water depth, weather, lighting, axis, countries, cities, or final geography.</span>
        </article>
        <article>
          <strong>256 lattice</strong>
          <span>The terrain field uses a 16 by 16 lattice so ridges, strata, plateaus, valleys, canyons, basins, and mineral pressure can be inspected.</span>
        </article>
        <article>
          <strong>Raw materials</strong>
          <span>Diamond, opal, marble, slate, granite, gold, platinum, silver, copper, iron, and lead are expressed as land-contained strata signals.</span>
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
    const caption = escapeHtml(opts.caption || "Planet 1 · Dedicated terrain render · 256 lattice");

    mount.innerHTML = `
      <section
        class="planet-one-terrain-shell"
        data-render-version="${VERSION}"
        data-planet="${PLANET}"
        data-terrain-engine-planet="${PLANET}"
        data-authority="${AUTHORITY}"
        data-primary-renderer="${PRIMARY_RENDERER}"
        data-planet-one-terrain-render-active="true"
        data-planet-one-specified="true"
        data-terrain-256-lattice-engine-active="true"
        data-raw-material-strata-active="true"
        data-mineral-pressure-active="true"
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
      planet: PLANET,
      authority: AUTHORITY,
      primaryRenderer: PRIMARY_RENDERER,
      mount,
      shell,
      markers: MARKERS,
      getStatus() {
        return {
          ok: true,
          version: VERSION,
          planet: PLANET,
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
      planet: PLANET,
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
    PLANET,
    AUTHORITY,
    PRIMARY_RENDERER,
    RAW_MATERIALS,
    MARKERS,
    createLandPathDefs,
    createClipDefs,
    createTerrainFilters,
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
