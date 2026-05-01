/*
  PLANET_ONE_HYDRATION_RENDER_V1_HYDRO_TERRAIN_MARRIAGE_TNT_v1
  TARGET=/world/render/planet-one.hydration.render.js

  REQUIRED GAUGE MARKERS:
  window.DGBPlanetOneHydrationRender
  createHydrationLayer
  hydration-engine-active=true
  hydro-terrain-marriage-active=true
  ocean-depth-field-active=true
  shoreline-wetness-active=true
  river-basin-system-active=true
  lake-catchment-system-active=true
  glacier-field-active=true
  terrain-water-adhesion-active=true

  ROLE:
  Hydration authority only.
  Owns ocean depth, shelves, shore wetness, rivers, lakes, glaciers, basins, and terrain-water adhesion.
  Does not own weather, light, axis, route boot, or main renderer composition.
*/

(function attachPlanetOneHydrationRender(global) {
  "use strict";

  const VERSION = "PLANET_ONE_HYDRATION_RENDER_V1_HYDRO_TERRAIN_MARRIAGE_TNT_v1";
  const PLANET = "Planet 1";
  const AUTHORITY = "/world/render/planet-one.hydration.render.js";
  const TERRAIN_AUTHORITY = "/world/render/planet-one.terrain.render.js";

  let uidCounter = 0;

  function nextUid() {
    uidCounter += 1;
    return "p1hydration_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function createDefaultLandPathDefs(uid) {
    return {
      northPole: uid + "_northPole",
      northRegion: uid + "_northRegion",
      mainland: uid + "_mainland",
      westRegion: uid + "_westRegion",
      eastRegion: uid + "_eastRegion",
      southRegion: uid + "_southRegion",
      southPole: uid + "_southPole",
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

  function createHydrationDefs(uid) {
    return `
      <filter id="${uid}_shoreBlur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.15"></feGaussianBlur>
      </filter>

      <filter id="${uid}_waterInset" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1.1" flood-color="#00131d" flood-opacity="0.55"></feDropShadow>
        <feDropShadow dx="0" dy="-0.6" stdDeviation="0.7" flood-color="#b7f4ff" flood-opacity="0.10"></feDropShadow>
      </filter>

      <radialGradient id="${uid}_lakeDepth" cx="38%" cy="32%" r="72%">
        <stop offset="0%" stop-color="rgba(114,225,239,0.64)"></stop>
        <stop offset="48%" stop-color="rgba(18,112,151,0.48)"></stop>
        <stop offset="100%" stop-color="rgba(4,34,56,0.74)"></stop>
      </radialGradient>

      <linearGradient id="${uid}_riverCut" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(146,232,242,0.54)"></stop>
        <stop offset="54%" stop-color="rgba(51,164,205,0.42)"></stop>
        <stop offset="100%" stop-color="rgba(8,72,104,0.50)"></stop>
      </linearGradient>

      <linearGradient id="${uid}_glacier" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(247,253,255,0.88)"></stop>
        <stop offset="52%" stop-color="rgba(186,222,240,0.62)"></stop>
        <stop offset="100%" stop-color="rgba(104,160,202,0.38)"></stop>
      </linearGradient>
    `;
  }

  function landStrokeGroup(land, color, width, opacity, label, filterId) {
    const filter = filterId ? ` filter="url(#${filterId})"` : "";
    return `
      <g aria-label="${label}" opacity="${opacity}"${filter}>
        <use href="#${land.northPole}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"></use>
        <use href="#${land.northRegion}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"></use>
        <use href="#${land.mainland}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"></use>
        <use href="#${land.westRegion}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"></use>
        <use href="#${land.eastRegion}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"></use>
        <use href="#${land.southRegion}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"></use>
        <use href="#${land.southPole}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"></use>
      </g>
    `;
  }

  function createHydrationLayer(uid, options) {
    const opts = options || {};
    const land = opts.land || createDefaultLandPathDefs(uid);
    const includeDefs = opts.includeDefs !== false;

    return `
      <g
        class="planet-one-hydration-layer"
        data-render-engine="${VERSION}"
        data-planet="${PLANET}"
        data-authority="${AUTHORITY}"
        data-terrain-authority="${TERRAIN_AUTHORITY}"

        data-hydration-engine-active="true"
        data-hydro-terrain-marriage-active="true"
        data-ocean-depth-field-active="true"
        data-shoreline-wetness-active="true"
        data-river-basin-system-active="true"
        data-lake-catchment-system-active="true"
        data-glacier-field-active="true"
        data-terrain-water-adhesion-active="true"

        data-no-weather-ownership="true"
        data-no-light-ownership="true"
        data-no-axis-ownership="true"
        data-no-route-boot-ownership="true"
        data-no-main-renderer-ownership="true"
        data-no-final-geography-closure="true"
        aria-label="Planet 1 hydration engine layer"
      >
        ${includeDefs ? `<defs>${createHydrationDefs(uid)}</defs>` : ""}

        <g data-ocean-depth-field-active="true" aria-label="ocean depth and continental shelf field">
          ${landStrokeGroup(land, "rgba(7,66,101,0.70)", 42, "0.22", "outer continental slope", uid + "_shoreBlur")}
          ${landStrokeGroup(land, "rgba(30,132,184,0.70)", 28, "0.31", "continental shelf", uid + "_shoreBlur")}
          ${landStrokeGroup(land, "rgba(132,224,231,0.72)", 15, "0.34", "shoreline wetness", uid + "_shoreBlur")}
          ${landStrokeGroup(land, "rgba(241,221,160,0.58)", 5, "0.34", "beach erosion transition", null)}
        </g>

        <g data-river-basin-system-active="true" aria-label="river basin system" filter="url(#${uid}_waterInset)">
          <path d="M420 202 C446 253 462 300 482 352 C504 409 522 455 552 514" fill="none" stroke="url(#${uid}_riverCut)" stroke-width="6.2" stroke-linecap="round"></path>
          <path d="M514 371 C489 412 466 449 454 503 C444 548 416 593 383 636" fill="none" stroke="url(#${uid}_riverCut)" stroke-width="5.2" stroke-linecap="round"></path>
          <path d="M315 401 C359 435 396 470 440 507 C478 539 521 567 582 602" fill="none" stroke="url(#${uid}_riverCut)" stroke-width="4.8" stroke-linecap="round"></path>
          <path d="M720 421 C756 458 781 501 802 552" fill="none" stroke="url(#${uid}_riverCut)" stroke-width="4.4" stroke-linecap="round"></path>
          <path d="M190 454 C226 493 252 540 278 584" fill="none" stroke="url(#${uid}_riverCut)" stroke-width="4.4" stroke-linecap="round"></path>
        </g>

        <g data-lake-catchment-system-active="true" aria-label="lake catchment system" filter="url(#${uid}_waterInset)">
          <path d="M455 511 L489 493 L531 501 L560 526 L523 544 L482 540Z" fill="url(#${uid}_lakeDepth)" opacity="0.88"></path>
          <path d="M735 494 L768 478 L809 486 L834 510 L801 528 L766 524Z" fill="url(#${uid}_lakeDepth)" opacity="0.74"></path>
          <path d="M396 602 C442 578 500 586 552 618 C520 650 462 655 410 632Z" fill="rgba(23,91,112,0.46)" opacity="0.66"></path>
          <path d="M252 518 C281 490 322 492 349 520 C319 548 279 547 252 518Z" fill="rgba(23,91,112,0.40)" opacity="0.58"></path>
        </g>

        <g data-glacier-field-active="true" aria-label="glacier field attached to cold terrain">
          <use href="#${land.northPole}" fill="url(#${uid}_glacier)" opacity="0.74"></use>
          <use href="#${land.southPole}" fill="url(#${uid}_glacier)" opacity="0.70"></use>
          <path d="M482 84 C520 80 562 86 602 106 C584 128 538 136 496 128 C466 122 447 108 482 84Z" fill="url(#${uid}_glacier)" opacity="0.60"></path>
          <path d="M420 886 C474 870 540 874 596 902 C556 928 482 932 421 910Z" fill="url(#${uid}_glacier)" opacity="0.54"></path>
        </g>
      </g>
    `;
  }

  function renderHydration(target) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;
    if (!mount) throw new Error("Planet 1 hydration render mount not found.");

    const uid = nextUid();
    const land = createDefaultLandPathDefs(uid);

    mount.innerHTML = `
      <svg viewBox="0 0 1000 1000" role="img" aria-label="Planet 1 hydration render">
        <defs>
          ${land.defs}
          <clipPath id="${uid}_sphereClip"><circle cx="500" cy="500" r="394"></circle></clipPath>
        </defs>
        <g clip-path="url(#${uid}_sphereClip)">
          ${createHydrationLayer(uid, { land, includeDefs: true })}
        </g>
      </svg>
    `;

    return {
      ok: true,
      version: VERSION,
      authority: AUTHORITY,
      mount
    };
  }

  function getStatus() {
    return {
      version: VERSION,
      planet: PLANET,
      authority: AUTHORITY,
      terrainAuthority: TERRAIN_AUTHORITY,
      hydrationEngineActive: true,
      hydroTerrainMarriageActive: true,
      oceanDepthFieldActive: true,
      shorelineWetnessActive: true,
      riverBasinSystemActive: true,
      lakeCatchmentSystemActive: true,
      glacierFieldActive: true,
      terrainWaterAdhesionActive: true
    };
  }

  const api = Object.freeze({
    VERSION,
    PLANET,
    AUTHORITY,
    TERRAIN_AUTHORITY,
    createDefaultLandPathDefs,
    createHydrationDefs,
    createHydrationLayer,
    renderHydration,
    getStatus
  });

  global.DGBPlanetOneHydrationRender = api;
  if (typeof window !== "undefined") window.DGBPlanetOneHydrationRender = api;
})(window);
