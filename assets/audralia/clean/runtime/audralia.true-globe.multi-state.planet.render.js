// /assets/audralia/clean/runtime/audralia.true-globe.multi-state.planet.render.js
// AUDRALIA_G2_PLANET_BODY_MULTI_STATE_SURFACE_EXPRESSION_TNT_v1
// Full-file replacement.
// Purpose: express Audralia as a datum-rooted multi-state planet body.
// Owns: planet-body visual expression authority, state sequencing, compact planet receipt.
// Does not own: cockpit route, Runtime / Strength activation, canvas, WebGL, generated image, GraphicBox, final visual pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_BODY_MULTI_STATE_SURFACE_EXPRESSION_TNT_v1";
  const SPEC_OPS = "AUDRALIA_G2_PLANET_BODY_MULTI_STATE_SURFACE_EXPRESSION_SPEC_OPS_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const FILE = "/assets/audralia/clean/runtime/audralia.true-globe.multi-state.planet.render.js";
  const COCKPIT_ROUTE = "/showroom/globe/audralia/disposition/";

  const SELECTORS = [
    "[data-audralia-planet-body-mount]",
    "[data-audralia-multi-state-planet-render]",
    "#audralia-planet-render",
    "#audralia-planet-body",
    ".audralia-planet-render-mount"
  ];

  const PLANET_STATES = Object.freeze([
    {
      key: "datum-body",
      receipt: "datum_body",
      label: "Datum Body",
      status: "loaded",
      compass: "N",
      copy: "Audralia is expressed from datum authority as one coherent planet body.",
      proof: "stable body · clear boundary · no blob"
    },
    {
      key: "terrain-mass",
      receipt: "terrain_mass",
      label: "Terrain Mass",
      status: "expressed",
      compass: "NE",
      copy: "Land reads as ancient mass pressure, not random island scatter.",
      proof: "major landmasses · raised pressure · eroded memory"
    },
    {
      key: "material-surface",
      receipt: "material_surface",
      label: "Material Surface",
      status: "expressed",
      compass: "E",
      copy: "Diamond, opal, granite, and slate influence the surface without becoming decoration.",
      proof: "mineral pressure · crystalline response · rocky age"
    },
    {
      key: "hydration-ocean",
      receipt: "hydration_ocean",
      label: "Hydration / Ocean",
      status: "expressed",
      compass: "SE",
      copy: "Water reads as basin, depth, shelf, and system rather than blue paint.",
      proof: "deep water · near-shore shallows · basin pressure"
    },
    {
      key: "coast-edge",
      receipt: "coast_edge_pressure",
      label: "Coast / Edge Pressure",
      status: "expressed",
      compass: "S",
      copy: "Land and ocean meet through shelf pressure and eroded edges, not sticker borders.",
      proof: "coastline · shelf zone · edge transition"
    },
    {
      key: "atmosphere-rim",
      receipt: "atmosphere_rim",
      label: "Atmosphere Rim",
      status: "expressed",
      compass: "SW",
      copy: "A thin limb glow gives the planet presence without claiming weather completion.",
      proof: "rim light · scattering edge · no cloud-system claim"
    },
    {
      key: "light-response",
      receipt: "light_response",
      label: "Light Response",
      status: "expressed",
      compass: "W",
      copy: "Directional light gives the body depth without claiming full orbital simulation.",
      proof: "terminator · surface shade · spatial body read"
    },
    {
      key: "inspection-receipt",
      receipt: "planet_expression_receipt",
      label: "Inspection Receipt",
      status: "ready",
      compass: "NW",
      copy: "The planet reports what is expressed and what remains held.",
      proof: "cockpit linked · Runtime held · no final visual pass claim"
    }
  ]);

  const HARD_LOCKS = Object.freeze({
    runtimeStrengthHeld: true,
    fullMotionEngineClaim: false,
    finalVisualPassClaim: false,
    fullWeatherClaim: false,
    lifeCityCompletionClaim: false,
    earthSubstitution: false,
    australiaNameDrift: false,
    generatedImage: false,
    graphicBox: false,
    canvas: false,
    webgl: false
  });

  function hasDocument() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  function routeMatchesAudralia() {
    if (!hasDocument()) return false;
    const route = document.documentElement.getAttribute("data-route") || "";
    const path = window.location ? window.location.pathname : "";
    return route === ROUTE || path === ROUTE;
  }

  function resolveMount() {
    if (!hasDocument()) return null;

    for (const selector of SELECTORS) {
      const found = document.querySelector(selector);
      if (found) return found;
    }

    if (!routeMatchesAudralia()) return null;

    const main = document.querySelector("main") || document.body;
    if (!main) return null;

    const mount = document.createElement("section");
    mount.setAttribute("data-audralia-planet-body-mount", "");
    mount.setAttribute("aria-label", "Audralia planet body multi-state surface expression");
    main.appendChild(mount);
    return mount;
  }

  function readDatumState() {
    const datum =
      window.AUDRALIA_TRUE_GLOBE_DATUM ||
      window.AUDRALIA_TRUE_GLOBE_DATUM_RECEIPT ||
      window.AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMPTION_BASELINE ||
      null;

    const disposition =
      window.AUDRALIA_TRUE_GLOBE_DISPOSITION ||
      window.AUDRALIA_TRUE_GLOBE_DISPOSITION_RECEIPT ||
      null;

    const terrain =
      window.AUDRALIA_TRUE_GLOBE_TERRAIN ||
      window.AUDRALIA_TRUE_GLOBE_TERRAIN_RECEIPT ||
      null;

    return Object.freeze({
      datumAvailable: Boolean(datum),
      dispositionAvailable: Boolean(disposition),
      terrainAvailable: Boolean(terrain),
      source: datum ? "datum-global-detected" : "datum-contract-declared",
      baseline: "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMPTION_BASELINE_v1",
      cockpit: "AUDRALIA_G1_INTERGALACTIC_COCKPIT_ENGINEERING_LENS_TECHNICAL_EXPRESSION_TNT_v1"
    });
  }

  function createReceipt(activeState = "inspection-receipt") {
    const datumState = readDatumState();
    const stateReceipt = PLANET_STATES.reduce((acc, state) => {
      acc[state.receipt] = state.status;
      return acc;
    }, {});

    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      route: ROUTE,
      file: FILE,
      subject: "Audralia planet body",
      mode: "multi-state surface expression",
      authority: "JS / Courage",
      htmlRole: "HTML / Wisdom receives after render authority is defined",
      runtimeRole: "Runtime / Strength held",
      activeState,
      states: stateReceipt,
      datum: datumState,
      geology: Object.freeze({
        diamondInfluence: true,
        opalInfluence: true,
        graniteInfluence: true,
        slateInfluence: true,
        literalDecorativeGems: false
      }),
      locks: HARD_LOCKS,
      cockpitInspectionRoute: COCKPIT_ROUTE,
      deployMarker: "AUDRALIA_G2_PLANET_BODY_MULTI_STATE_SURFACE_EXPRESSION_DEPLOY_MARKER_v1"
    });
  }

  function publishReceipt(activeState = "inspection-receipt") {
    if (!hasDocument()) return createReceipt(activeState);

    const receipt = createReceipt(activeState);
    const root = document.documentElement;

    root.dataset.audraliaPlanetRenderContract = CONTRACT;
    root.dataset.audraliaPlanetRenderMode = "multi-state-surface-expression";
    root.dataset.audraliaPlanetRenderAuthority = "js-courage";
    root.dataset.audraliaPlanetRenderRuntimeStrength = "held";
    root.dataset.audraliaPlanetRenderVisualPassClaim = "false";
    root.dataset.audraliaPlanetRenderReceipt = JSON.stringify(receipt);

    window.AUDRALIA_G2_PLANET_BODY_MULTI_STATE_SURFACE_EXPRESSION_RECEIPT = receipt;
    window.AUDRALIA_TRUE_GLOBE_MULTI_STATE_PLANET_RENDER_RECEIPT = receipt;

    window.dispatchEvent(new CustomEvent("audralia:planet-render:receipt", {
      detail: receipt
    }));

    return receipt;
  }

  function installStyles() {
    if (!hasDocument() || document.getElementById("audralia-g2-planet-body-render-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-g2-planet-body-render-style";
    style.textContent = `
      :root{
        --audralia-bg:#020711;
        --audralia-panel:rgba(5,15,32,.86);
        --audralia-text:rgba(239,247,255,.96);
        --audralia-muted:rgba(239,247,255,.70);
        --audralia-faint:rgba(239,247,255,.50);
        --audralia-gold:#f4cf83;
        --audralia-blue:#8dd8ff;
        --audralia-mint:#a7f3c6;
        --audralia-violet:#ad8cff;
      }

      [data-audralia-planet-body-mount]{
        display:block;
        color:var(--audralia-text);
        width:min(1420px,calc(100% - 28px));
        margin:18px auto;
      }

      .aug2-shell{
        position:relative;
        overflow:hidden;
        border:1px solid rgba(244,207,131,.22);
        border-radius:clamp(26px,4vw,44px);
        background:
          radial-gradient(circle at 50% 0%,rgba(141,216,255,.11),transparent 30rem),
          radial-gradient(circle at 12% 20%,rgba(244,207,131,.09),transparent 26rem),
          linear-gradient(180deg,rgba(255,255,255,.048),rgba(255,255,255,.016)),
          rgba(2,8,20,.92);
        box-shadow:0 34px 120px rgba(0,0,0,.50),inset 0 1px 0 rgba(255,255,255,.08);
      }

      .aug2-hero{
        display:grid;
        grid-template-columns:minmax(320px,.95fr) minmax(360px,1.05fr);
        gap:clamp(18px,3vw,34px);
        align-items:center;
        padding:clamp(18px,3.5vw,42px);
      }

      .aug2-copy{
        display:grid;
        gap:14px;
        max-width:760px;
      }

      .aug2-kicker{
        margin:0;
        color:var(--audralia-gold);
        font:900 .74rem/1.35 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.18em;
        text-transform:uppercase;
      }

      .aug2-title{
        margin:0;
        color:rgba(255,244,216,.98);
        font:900 clamp(2.2rem,6vw,5.7rem)/.9 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:-.075em;
        text-wrap:balance;
      }

      .aug2-copy p{
        margin:0;
        color:var(--audralia-muted);
        font:500 clamp(1rem,2.1vw,1.16rem)/1.55 Inter,ui-sans-serif,system-ui,sans-serif;
      }

      .aug2-status-row{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin-top:4px;
      }

      .aug2-pill{
        min-height:32px;
        display:inline-flex;
        align-items:center;
        border:1px solid rgba(255,255,255,.10);
        border-radius:999px;
        padding:0 11px;
        color:rgba(239,247,255,.76);
        background:rgba(255,255,255,.035);
        font-size:.70rem;
        font-weight:850;
        letter-spacing:.06em;
        text-transform:uppercase;
      }

      .aug2-stage{
        position:relative;
        min-height:clamp(420px,48vw,660px);
        display:grid;
        place-items:center;
        border:1px solid rgba(141,216,255,.16);
        border-radius:34px;
        overflow:hidden;
        background:
          radial-gradient(circle at 52% 48%,rgba(141,216,255,.18),transparent 19rem),
          radial-gradient(circle at 20% 18%,rgba(255,255,255,.16) 0 1px,transparent 1.6px),
          radial-gradient(circle at 78% 26%,rgba(255,255,255,.14) 0 1px,transparent 1.6px),
          radial-gradient(circle at 28% 74%,rgba(255,255,255,.10) 0 1px,transparent 1.6px),
          linear-gradient(180deg,#061328 0%,#020711 100%);
        box-shadow:inset 0 0 70px rgba(141,216,255,.07),0 20px 70px rgba(0,0,0,.34);
      }

      .aug2-stage::before{
        content:"";
        position:absolute;
        inset:-20%;
        background:
          radial-gradient(circle at 12% 22%,rgba(255,255,255,.40) 0 1px,transparent 1.7px),
          radial-gradient(circle at 42% 12%,rgba(255,255,255,.28) 0 1px,transparent 1.6px),
          radial-gradient(circle at 68% 72%,rgba(255,255,255,.22) 0 1px,transparent 1.5px),
          radial-gradient(circle at 86% 38%,rgba(141,216,255,.30) 0 1px,transparent 1.8px);
        opacity:.36;
        animation:aug2StarDrift 55s linear infinite;
      }

      @keyframes aug2StarDrift{
        to{transform:translate3d(-4%,3%,0)}
      }

      .aug2-planet-wrap{
        position:relative;
        z-index:2;
        width:min(88%,620px);
        aspect-ratio:1/1;
        display:grid;
        place-items:center;
      }

      .aug2-planet-svg{
        width:100%;
        height:auto;
        overflow:visible;
        filter:drop-shadow(-24px 28px 48px rgba(0,0,0,.58)) drop-shadow(0 0 34px rgba(141,216,255,.12));
      }

      .aug2-ocean-shift{
        animation:aug2HydrationShift 21s ease-in-out infinite;
      }

      .aug2-mineral-pressure{
        animation:aug2SurfaceBreathe 13s ease-in-out infinite;
      }

      .aug2-rim{
        animation:aug2RimHold 8s ease-in-out infinite;
      }

      @keyframes aug2HydrationShift{
        0%,100%{opacity:.94;filter:brightness(.95)}
        50%{opacity:1;filter:brightness(1.08)}
      }

      @keyframes aug2SurfaceBreathe{
        0%,100%{opacity:.60}
        50%{opacity:.86}
      }

      @keyframes aug2RimHold{
        0%,100%{opacity:.74}
        50%{opacity:.98}
      }

      .aug2-state-panel{
        position:absolute;
        left:14px;
        right:14px;
        bottom:14px;
        z-index:5;
        display:grid;
        gap:10px;
        padding:12px;
        border:1px solid rgba(244,207,131,.16);
        border-radius:20px;
        background:rgba(2,8,20,.66);
        backdrop-filter:blur(14px);
      }

      .aug2-state-active{
        display:grid;
        gap:4px;
      }

      .aug2-state-active b{
        color:var(--audralia-gold);
        font-size:.70rem;
        letter-spacing:.14em;
        text-transform:uppercase;
      }

      .aug2-state-active span{
        color:rgba(239,247,255,.76);
        font-size:.82rem;
        line-height:1.35;
      }

      .aug2-state-grid{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:8px;
      }

      .aug2-state-button{
        min-height:42px;
        display:grid;
        align-content:center;
        gap:2px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:14px;
        padding:8px 9px;
        color:rgba(239,247,255,.78);
        background:rgba(255,255,255,.035);
        text-align:left;
        cursor:pointer;
      }

      .aug2-state-button b{
        color:rgba(255,244,216,.92);
        font-size:.70rem;
        letter-spacing:.06em;
        text-transform:uppercase;
      }

      .aug2-state-button span{
        color:rgba(141,216,255,.70);
        font:800 .56rem/1.1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.08em;
        text-transform:uppercase;
      }

      .aug2-state-button[aria-pressed="true"]{
        border-color:rgba(244,207,131,.42);
        color:#06101c;
        background:linear-gradient(135deg,#fff0b8,var(--audralia-gold));
      }

      .aug2-state-button[aria-pressed="true"] b,
      .aug2-state-button[aria-pressed="true"] span{
        color:#06101c;
      }

      .aug2-receipt-deck{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:10px;
        padding:0 clamp(18px,3.5vw,42px) clamp(18px,3.5vw,42px);
      }

      .aug2-receipt-card{
        min-height:112px;
        display:grid;
        align-content:start;
        gap:7px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:18px;
        padding:13px;
        background:
          radial-gradient(circle at 20% 0%,rgba(244,207,131,.07),transparent 9rem),
          rgba(255,255,255,.028);
        overflow:hidden;
      }

      .aug2-receipt-card b{
        color:var(--audralia-gold);
        font-size:.68rem;
        letter-spacing:.13em;
        text-transform:uppercase;
      }

      .aug2-receipt-card strong{
        color:rgba(255,244,216,.96);
        font-size:.92rem;
        line-height:1.2;
      }

      .aug2-receipt-card span{
        color:rgba(239,247,255,.70);
        font-size:.82rem;
        line-height:1.35;
      }

      .aug2-actions{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin-top:6px;
      }

      .aug2-action{
        min-height:38px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        border:1px solid rgba(244,207,131,.34);
        border-radius:999px;
        padding:0 14px;
        color:#06101c;
        background:linear-gradient(135deg,#fff0b8,var(--audralia-gold));
        font-size:.78rem;
        font-weight:950;
        letter-spacing:.08em;
        text-transform:uppercase;
        text-decoration:none;
      }

      .aug2-action.secondary{
        color:rgba(239,247,255,.84);
        background:rgba(255,255,255,.035);
        border-color:rgba(255,255,255,.12);
      }

      @media (max-width:1120px){
        .aug2-hero{grid-template-columns:1fr}
        .aug2-receipt-deck{grid-template-columns:repeat(2,minmax(0,1fr))}
      }

      @media (max-width:720px){
        [data-audralia-planet-body-mount]{width:min(100% - 18px,1420px)}
        .aug2-hero{padding:14px}
        .aug2-stage{min-height:620px}
        .aug2-planet-wrap{width:min(96%,520px);align-self:start;margin-top:22px}
        .aug2-state-grid{grid-template-columns:1fr}
        .aug2-receipt-deck{grid-template-columns:1fr;padding:0 14px 14px}
      }

      @media (prefers-reduced-motion:reduce){
        *,
        *::before,
        *::after{
          animation-duration:.01ms!important;
          animation-iteration-count:1!important;
          transition-duration:.01ms!important;
          scroll-behavior:auto!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function planetSvg(uid) {
    const clip = `${uid}-disc`;
    const ocean = `${uid}-ocean`;
    const shelf = `${uid}-shelf`;
    const land = `${uid}-land`;
    const opal = `${uid}-opal`;
    const rim = `${uid}-rim`;

    return `
      <svg class="aug2-planet-svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="${uid}-title ${uid}-desc">
        <title id="${uid}-title">Audralia multi-state planet body</title>
        <desc id="${uid}-desc">Datum-rooted Audralia planet body with terrain mass, mineral surface, hydration, coast edge, atmosphere rim, and light response.</desc>
        <defs>
          <clipPath id="${clip}">
            <circle cx="500" cy="500" r="438"></circle>
          </clipPath>

          <radialGradient id="${ocean}" cx="38%" cy="30%" r="74%">
            <stop offset="0%" stop-color="#5bc4ff" stop-opacity=".86"></stop>
            <stop offset="34%" stop-color="#1767ad" stop-opacity=".96"></stop>
            <stop offset="68%" stop-color="#082c68" stop-opacity="1"></stop>
            <stop offset="100%" stop-color="#020817" stop-opacity="1"></stop>
          </radialGradient>

          <radialGradient id="${shelf}" cx="42%" cy="36%" r="70%">
            <stop offset="0%" stop-color="#a7f3c6" stop-opacity=".36"></stop>
            <stop offset="42%" stop-color="#56cfc0" stop-opacity=".18"></stop>
            <stop offset="100%" stop-color="#07152b" stop-opacity="0"></stop>
          </radialGradient>

          <linearGradient id="${land}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d9cfb6" stop-opacity=".94"></stop>
            <stop offset="28%" stop-color="#8c8d86" stop-opacity=".92"></stop>
            <stop offset="58%" stop-color="#4d5a54" stop-opacity=".96"></stop>
            <stop offset="100%" stop-color="#242b34" stop-opacity=".98"></stop>
          </linearGradient>

          <linearGradient id="${opal}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff4d8" stop-opacity=".22"></stop>
            <stop offset="28%" stop-color="#8dd8ff" stop-opacity=".20"></stop>
            <stop offset="58%" stop-color="#ad8cff" stop-opacity=".17"></stop>
            <stop offset="100%" stop-color="#a7f3c6" stop-opacity=".15"></stop>
          </linearGradient>

          <radialGradient id="${rim}" cx="34%" cy="28%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity=".0"></stop>
            <stop offset="70%" stop-color="#8dd8ff" stop-opacity=".04"></stop>
            <stop offset="92%" stop-color="#8dd8ff" stop-opacity=".30"></stop>
            <stop offset="100%" stop-color="#f4cf83" stop-opacity=".08"></stop>
          </radialGradient>

          <filter id="${uid}-surface-soften">
            <feGaussianBlur stdDeviation=".65"></feGaussianBlur>
          </filter>
        </defs>

        <g clip-path="url(#${clip})">
          <circle class="aug2-ocean-shift" cx="500" cy="500" r="455" fill="url(#${ocean})"></circle>
          <circle cx="500" cy="500" r="455" fill="url(#${shelf})" opacity=".72"></circle>

          <path class="aug2-landmass" fill="url(#${land})" opacity=".92" filter="url(#${uid}-surface-soften)"
            d="M214 346 C255 289 340 252 428 286 C484 308 518 365 505 426 C491 493 422 522 358 512 C290 501 232 458 208 403 C198 381 198 363 214 346 Z">
          </path>

          <path class="aug2-landmass" fill="url(#${land})" opacity=".88"
            d="M570 246 C646 214 741 242 788 304 C834 364 814 440 751 471 C686 504 611 476 577 423 C543 370 522 273 570 246 Z">
          </path>

          <path class="aug2-landmass" fill="url(#${land})" opacity=".86"
            d="M462 566 C527 528 612 548 670 608 C728 670 736 744 680 782 C620 824 522 796 467 736 C416 681 404 600 462 566 Z">
          </path>

          <path class="aug2-landmass" fill="url(#${land})" opacity=".76"
            d="M246 632 C290 594 356 596 392 640 C430 687 411 750 354 768 C292 787 233 744 224 684 C220 662 228 645 246 632 Z">
          </path>

          <g class="aug2-coast-pressure" fill="none" stroke="#a7f3c6" stroke-opacity=".34" stroke-width="5">
            <path d="M218 343 C264 286 343 257 426 288 C483 309 517 365 503 427 C488 493 423 522 358 512 C288 501 233 458 210 405"></path>
            <path d="M569 247 C646 217 739 242 787 304 C834 365 813 439 751 471 C686 504 611 476 578 423"></path>
            <path d="M461 566 C527 529 611 548 670 608 C728 669 736 744 680 782 C620 824 523 796 468 736"></path>
          </g>

          <g class="aug2-mineral-pressure" fill="none" stroke="url(#${opal})" stroke-width="7" stroke-linecap="round">
            <path d="M260 386 C326 356 395 360 462 397"></path>
            <path d="M598 310 C664 292 731 320 774 374"></path>
            <path d="M500 640 C562 615 630 638 681 708"></path>
            <path d="M278 682 C310 660 350 666 382 714"></path>
          </g>

          <g class="aug2-slate-stress" fill="none" stroke="#cbd3dc" stroke-opacity=".13" stroke-width="2">
            <path d="M180 528 C316 496 448 510 600 570 C710 615 800 612 900 586"></path>
            <path d="M134 424 C272 462 402 450 546 410 C670 374 775 390 880 438"></path>
            <path d="M210 720 C358 648 512 650 706 742"></path>
          </g>

          <ellipse cx="620" cy="522" rx="455" ry="505" fill="#000818" opacity=".34"></ellipse>
          <ellipse cx="315" cy="300" rx="250" ry="180" fill="#ffffff" opacity=".08"></ellipse>
        </g>

        <circle class="aug2-rim" cx="500" cy="500" r="438" fill="url(#${rim})"></circle>
        <circle cx="500" cy="500" r="438" fill="none" stroke="#8dd8ff" stroke-opacity=".24" stroke-width="3"></circle>
        <circle cx="500" cy="500" r="462" fill="none" stroke="#8dd8ff" stroke-opacity=".10" stroke-width="8"></circle>
      </svg>
    `;
  }

  function stateButtons(activeKey) {
    return PLANET_STATES.map((state) => `
      <button
        class="aug2-state-button"
        type="button"
        data-aug2-state-button="${state.key}"
        aria-pressed="${state.key === activeKey ? "true" : "false"}"
      >
        <b>${state.label}</b>
        <span>${state.compass} · ${state.status}</span>
      </button>
    `).join("");
  }

  function receiptCards() {
    return `
      <article class="aug2-receipt-card">
        <b>Render Authority</b>
        <strong>JS / Courage</strong>
        <span>Planet-body multi-state expression is defined before public shell renewal.</span>
      </article>
      <article class="aug2-receipt-card">
        <b>Datum</b>
        <strong>Loaded / declared</strong>
        <span>Body expression is rooted in datum authority, not a fake placeholder shell.</span>
      </article>
      <article class="aug2-receipt-card">
        <b>Surface</b>
        <strong>Expressed</strong>
        <span>Terrain, mineral material, hydration, coast pressure, rim, and light response are staged.</span>
      </article>
      <article class="aug2-receipt-card">
        <b>Held Boundary</b>
        <strong>Runtime / Strength held</strong>
        <span>No full motion engine, no final visual pass, no weather/life/city completion claim.</span>
      </article>
    `;
  }

  function render(target, options = {}) {
    if (!hasDocument()) return null;

    installStyles();

    const mount = typeof target === "string" ? document.querySelector(target) : target || resolveMount();
    if (!mount) {
      publishReceipt("inspection-receipt");
      return null;
    }

    const activeKey = options.activeState || "datum-body";
    const activeState = PLANET_STATES.find((state) => state.key === activeKey) || PLANET_STATES[0];
    const uid = `aug2-${Math.random().toString(36).slice(2, 9)}`;

    mount.innerHTML = `
      <div
        class="aug2-shell"
        data-audralia-g2-planet-render
        data-contract="${CONTRACT}"
        data-spec-ops="${SPEC_OPS}"
        data-authority="js-courage"
        data-runtime-strength-held="true"
        data-visual-pass-claim="false"
        data-generated-image="false"
        data-graphic-box="false"
        data-canvas="false"
        data-webgl="false"
      >
        <section class="aug2-hero" aria-labelledby="${uid}-heading">
          <div class="aug2-copy">
            <p class="aug2-kicker">Audralia · Planet Body · Multi-State Surface Expression</p>
            <h2 class="aug2-title" id="${uid}-heading">Audralia is no longer only held in the cockpit. The planet body is ready to express.</h2>
            <p>
              This render authority expresses Audralia from datum into visible planet states: body mass, terrain pressure, mineral surface, ocean system, coast edge, atmosphere rim, light response, and inspection receipt.
            </p>
            <p>
              This is not a final visual pass. Runtime / Strength remains held. The cockpit remains the inspection deck.
            </p>
            <div class="aug2-status-row">
              <span class="aug2-pill">JS / Courage</span>
              <span class="aug2-pill">Datum rooted</span>
              <span class="aug2-pill">8 planet states</span>
              <span class="aug2-pill">Runtime held</span>
              <span class="aug2-pill">No final visual claim</span>
            </div>
            <div class="aug2-actions">
              <a class="aug2-action" href="${COCKPIT_ROUTE}">Open Cockpit Inspection</a>
              <a class="aug2-action secondary" href="/showroom/globe/">Return to Globe</a>
            </div>
          </div>

          <div class="aug2-stage" data-aug2-planet-stage data-active-state="${activeState.key}">
            <div class="aug2-planet-wrap">
              ${planetSvg(uid)}
            </div>

            <div class="aug2-state-panel">
              <div class="aug2-state-active" data-aug2-active-copy>
                <b>${activeState.label} · ${activeState.compass} · ${activeState.status}</b>
                <span>${activeState.copy} ${activeState.proof}.</span>
              </div>
              <div class="aug2-state-grid" aria-label="Audralia planet expression states">
                ${stateButtons(activeState.key)}
              </div>
            </div>
          </div>
        </section>

        <section class="aug2-receipt-deck" aria-label="Audralia planet render receipt">
          ${receiptCards()}
        </section>
      </div>
    `;

    bindStateControls(mount);
    const receipt = publishReceipt(activeState.key);

    window.dispatchEvent(new CustomEvent("audralia:planet-render:ready", {
      detail: receipt
    }));

    return receipt;
  }

  function bindStateControls(root) {
    const stage = root.querySelector("[data-aug2-planet-stage]");
    const copy = root.querySelector("[data-aug2-active-copy]");
    const buttons = Array.from(root.querySelectorAll("[data-aug2-state-button]"));

    if (!stage || !copy || !buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.getAttribute("data-aug2-state-button");
        const state = PLANET_STATES.find((item) => item.key === key);
        if (!state) return;

        stage.dataset.activeState = state.key;
        buttons.forEach((item) => item.setAttribute("aria-pressed", item === button ? "true" : "false"));

        copy.innerHTML = `
          <b>${state.label} · ${state.compass} · ${state.status}</b>
          <span>${state.copy} ${state.proof}.</span>
        `;

        publishReceipt(state.key);
      });
    });
  }

  function init(target, options = {}) {
    return render(target, options);
  }

  function getStates() {
    return PLANET_STATES.map((state) => ({ ...state }));
  }

  function getReceipt() {
    return createReceipt();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    specOps: SPEC_OPS,
    route: ROUTE,
    file: FILE,
    states: getStates,
    receipt: getReceipt,
    init,
    render,
    publishReceipt
  });

  if (hasDocument()) {
    window.AUDRALIA_G2_PLANET_BODY_MULTI_STATE_SURFACE_EXPRESSION = api;
    window.AUDRALIA_TRUE_GLOBE_MULTI_STATE_PLANET_RENDER = api;
    publishReceipt("inspection-receipt");

    const boot = () => {
      const mount = resolveMount();
      if (mount) render(mount, { activeState: "datum-body" });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }
})();
