// /assets/audralia/clean/runtime/audralia.planet-body.expression.render.js
// AUDRALIA_G2_PLANET_BODY_ALTERNATE_ROUTE_TNT_v1
// Full-file creation.
// Purpose: route-local Audralia planet-body expression render.
// Owns: /showroom/globe/audralia/planet/ visual planet expression only.
// Does not own: /showroom/globe/audralia/, cockpit route, Runtime / Strength, final visual pass, generated image, GraphicBox, canvas, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_BODY_ALTERNATE_ROUTE_TNT_v1";
  const SPEC_OPS = "AUDRALIA_G2_PLANET_BODY_ALTERNATE_ROUTE_SPEC_OPS_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const FILE = "/assets/audralia/clean/runtime/audralia.planet-body.expression.render.js";
  const PARENT_ROUTE = "/showroom/globe/audralia/";
  const COCKPIT_ROUTE = "/showroom/globe/audralia/disposition/";

  const STATES = Object.freeze([
    {
      key: "datum-body",
      label: "Datum Body",
      compass: "North",
      status: "loaded",
      text: "Audralia begins as one coherent body. The planet is expressed from datum authority, not from a diagnostic placeholder.",
      proof: "stable boundary · one body mass · no parent-route overwrite"
    },
    {
      key: "terrain-mass",
      label: "Terrain Mass",
      compass: "Northeast",
      status: "expressed",
      text: "Land rises as ancient pressure and eroded mass. The shape reads as planetary geology, not scattered island noise.",
      proof: "major land pressure · erosion memory · non-blob formation"
    },
    {
      key: "material-surface",
      label: "Material Surface",
      compass: "East",
      status: "expressed",
      text: "Diamond, opal, granite, and slate influence the surface read without turning the planet into decorative gems.",
      proof: "mineral pressure · ancient rock · restrained crystalline response"
    },
    {
      key: "hydration-ocean",
      label: "Hydration / Ocean",
      compass: "Southeast",
      status: "expressed",
      text: "Water appears as basin, depth, shelf, and system rather than blue paint.",
      proof: "deep ocean · shelf shallows · water-body relation"
    },
    {
      key: "coast-edge",
      label: "Coast / Edge Pressure",
      compass: "South",
      status: "expressed",
      text: "Land and water meet through shelf pressure, coast erosion, and edge transition.",
      proof: "coastal pressure · shelf edge · no sticker border"
    },
    {
      key: "atmosphere-rim",
      label: "Atmosphere Rim",
      compass: "Southwest",
      status: "expressed",
      text: "A thin limb glow gives the planet presence without claiming weather completion.",
      proof: "rim light · atmosphere presence · no cloud-system claim"
    },
    {
      key: "light-response",
      label: "Light Response",
      compass: "West",
      status: "expressed",
      text: "Directional light gives Audralia spatial depth without claiming full orbital simulation.",
      proof: "terminator · depth read · restrained illumination"
    },
    {
      key: "inspection-receipt",
      label: "Inspection Receipt",
      compass: "Northwest",
      status: "ready",
      text: "The planet expression reports what is visible here and what remains held elsewhere.",
      proof: "cockpit linked · parent preserved · Runtime held"
    }
  ]);

  const LOCKS = Object.freeze({
    parentAudraliaRouteUntouched: true,
    cockpitRouteUntouched: true,
    runtimeStrengthHeld: true,
    finalVisualPassClaim: false,
    generatedImage: false,
    graphicBox: false,
    canvas: false,
    webgl: false,
    earthSubstitution: false,
    australiaNameDrift: false,
    weatherCompletionClaim: false,
    lifeCityCompletionClaim: false
  });

  function hasDocument() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  function isPlanetRoute() {
    if (!hasDocument()) return false;
    const rootRoute = document.documentElement.getAttribute("data-route") || "";
    const path = window.location ? window.location.pathname : "";
    return rootRoute === ROUTE || path === ROUTE;
  }

  function resolveMount() {
    if (!hasDocument() || !isPlanetRoute()) return null;
    return document.querySelector("[data-audralia-planet-expression-mount]");
  }

  function receipt(activeState = "datum-body") {
    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      route: ROUTE,
      file: FILE,
      subject: "Audralia planet-body expression",
      activeState,
      routeLaw: "branch-not-replace",
      parentRoute: PARENT_ROUTE,
      cockpitRoute: COCKPIT_ROUTE,
      authority: "JS / Courage route-local planet expression",
      htmlRole: "HTML / Wisdom planet-expression chamber",
      runtimeRole: "Runtime / Strength held",
      states: STATES.map((state) => ({
        key: state.key,
        label: state.label,
        compass: state.compass,
        status: state.status
      })),
      locks: LOCKS,
      deployMarker: "AUDRALIA_G2_PLANET_BODY_ALTERNATE_ROUTE_DEPLOY_MARKER_v1"
    });
  }

  function publish(activeState = "datum-body") {
    const report = receipt(activeState);

    if (hasDocument()) {
      document.documentElement.dataset.audraliaPlanetAlternateRouteContract = CONTRACT;
      document.documentElement.dataset.audraliaPlanetAlternateRoute = ROUTE;
      document.documentElement.dataset.audraliaPlanetAlternateRouteActiveState = activeState;
      document.documentElement.dataset.audraliaPlanetAlternateRouteReceipt = JSON.stringify(report);
      document.documentElement.dataset.runtimeStrengthHeld = "true";
      document.documentElement.dataset.finalVisualPassClaim = "false";

      window.AUDRALIA_G2_PLANET_BODY_ALTERNATE_ROUTE_RECEIPT = report;

      window.dispatchEvent(new CustomEvent("audralia:planet-alternate-route:receipt", {
        detail: report
      }));
    }

    return report;
  }

  function installStyles() {
    if (!hasDocument() || document.getElementById("audralia-planet-body-expression-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-planet-body-expression-style";
    style.textContent = `
      [data-audralia-planet-expression-mount]{
        display:block;
        width:100%;
        min-height:min(780px,92vh);
      }

      .auplanet-shell{
        position:relative;
        min-height:min(780px,92vh);
        overflow:hidden;
        border:1px solid rgba(244,207,131,.18);
        border-radius:32px;
        background:
          radial-gradient(circle at 50% 44%,rgba(141,216,255,.16),transparent 28rem),
          radial-gradient(circle at 50% 82%,rgba(244,207,131,.08),transparent 30rem),
          linear-gradient(180deg,rgba(4,11,24,.94),rgba(1,5,13,.98));
        box-shadow:inset 0 0 80px rgba(141,216,255,.06),0 28px 90px rgba(0,0,0,.42);
      }

      .auplanet-shell::before{
        content:"";
        position:absolute;
        inset:-20%;
        pointer-events:none;
        background:
          radial-gradient(circle at 12% 22%,rgba(255,255,255,.38) 0 1px,transparent 1.7px),
          radial-gradient(circle at 32% 68%,rgba(255,255,255,.25) 0 1px,transparent 1.5px),
          radial-gradient(circle at 54% 14%,rgba(255,255,255,.30) 0 1px,transparent 1.6px),
          radial-gradient(circle at 74% 74%,rgba(255,255,255,.22) 0 1px,transparent 1.4px),
          radial-gradient(circle at 88% 36%,rgba(141,216,255,.30) 0 1px,transparent 1.7px);
        opacity:.38;
        animation:auplanetStarDrift 55s linear infinite;
      }

      @keyframes auplanetStarDrift{
        to{transform:translate3d(-4%,3%,0)}
      }

      .auplanet-inner{
        position:relative;
        z-index:2;
        min-height:min(780px,92vh);
        display:grid;
        grid-template-columns:minmax(280px,.48fr) minmax(340px,.52fr);
        gap:clamp(18px,3vw,34px);
        align-items:center;
        padding:clamp(18px,4vw,46px);
      }

      .auplanet-copy{
        display:grid;
        gap:14px;
        max-width:620px;
      }

      .auplanet-kicker{
        margin:0;
        color:#f4cf83;
        font:900 .74rem/1.35 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.18em;
        text-transform:uppercase;
      }

      .auplanet-title{
        margin:0;
        color:rgba(255,244,216,.98);
        font:950 clamp(2.25rem,5.8vw,5.4rem)/.9 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:-.075em;
        text-wrap:balance;
      }

      .auplanet-copy p{
        margin:0;
        color:rgba(239,247,255,.72);
        font:500 clamp(1rem,2.1vw,1.16rem)/1.55 Inter,ui-sans-serif,system-ui,sans-serif;
      }

      .auplanet-actions{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin-top:4px;
      }

      .auplanet-action{
        min-height:38px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        border:1px solid rgba(244,207,131,.36);
        border-radius:999px;
        padding:0 14px;
        color:#06101c;
        background:linear-gradient(135deg,#fff0b8,#f4cf83);
        font-size:.78rem;
        font-weight:950;
        letter-spacing:.08em;
        text-transform:uppercase;
        text-decoration:none;
      }

      .auplanet-action.secondary{
        color:rgba(239,247,255,.84);
        background:rgba(255,255,255,.035);
        border-color:rgba(255,255,255,.12);
      }

      .auplanet-stage{
        position:relative;
        min-height:clamp(430px,52vw,690px);
        display:grid;
        place-items:center;
      }

      .auplanet-body{
        position:relative;
        width:min(92%,620px);
        aspect-ratio:1/1;
        display:grid;
        place-items:center;
      }

      .auplanet-svg{
        width:100%;
        height:auto;
        overflow:visible;
        filter:
          drop-shadow(-26px 30px 50px rgba(0,0,0,.62))
          drop-shadow(0 0 42px rgba(141,216,255,.14));
      }

      .auplanet-ocean{
        animation:auplanetOceanHold 21s ease-in-out infinite;
      }

      .auplanet-mineral{
        animation:auplanetMineralHold 13s ease-in-out infinite;
      }

      .auplanet-rim{
        animation:auplanetRimHold 8s ease-in-out infinite;
      }

      @keyframes auplanetOceanHold{
        0%,100%{opacity:.94;filter:brightness(.96)}
        50%{opacity:1;filter:brightness(1.08)}
      }

      @keyframes auplanetMineralHold{
        0%,100%{opacity:.52}
        50%{opacity:.82}
      }

      @keyframes auplanetRimHold{
        0%,100%{opacity:.72}
        50%{opacity:1}
      }

      .auplanet-state-dock{
        position:absolute;
        left:clamp(12px,2vw,20px);
        right:clamp(12px,2vw,20px);
        bottom:clamp(12px,2vw,20px);
        z-index:5;
        display:grid;
        gap:10px;
        border:1px solid rgba(244,207,131,.16);
        border-radius:22px;
        padding:12px;
        background:rgba(2,8,20,.70);
        backdrop-filter:blur(14px);
      }

      .auplanet-active{
        display:grid;
        gap:4px;
      }

      .auplanet-active b{
        color:#f4cf83;
        font:900 .68rem/1.2 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.14em;
        text-transform:uppercase;
      }

      .auplanet-active span{
        color:rgba(239,247,255,.76);
        font-size:.82rem;
        line-height:1.35;
      }

      .auplanet-state-grid{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:8px;
      }

      .auplanet-state-button{
        min-height:44px;
        display:grid;
        align-content:center;
        gap:2px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:14px;
        padding:8px;
        color:rgba(239,247,255,.78);
        background:rgba(255,255,255,.035);
        text-align:left;
        cursor:pointer;
      }

      .auplanet-state-button b{
        color:rgba(255,244,216,.92);
        font-size:.68rem;
        letter-spacing:.06em;
        text-transform:uppercase;
      }

      .auplanet-state-button span{
        color:rgba(141,216,255,.72);
        font:850 .55rem/1.1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.08em;
        text-transform:uppercase;
      }

      .auplanet-state-button[aria-pressed="true"]{
        border-color:rgba(244,207,131,.42);
        color:#06101c;
        background:linear-gradient(135deg,#fff0b8,#f4cf83);
      }

      .auplanet-state-button[aria-pressed="true"] b,
      .auplanet-state-button[aria-pressed="true"] span{
        color:#06101c;
      }

      .auplanet-receipt-row{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:10px;
      }

      .auplanet-receipt{
        min-height:92px;
        display:grid;
        align-content:start;
        gap:6px;
        border:1px solid rgba(255,255,255,.09);
        border-radius:16px;
        padding:12px;
        background:rgba(255,255,255,.028);
      }

      .auplanet-receipt b{
        color:#f4cf83;
        font-size:.64rem;
        letter-spacing:.13em;
        text-transform:uppercase;
      }

      .auplanet-receipt span{
        color:rgba(239,247,255,.70);
        font-size:.80rem;
        line-height:1.32;
      }

      @media (max-width:1080px){
        .auplanet-inner{
          grid-template-columns:1fr;
        }

        .auplanet-receipt-row{
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
      }

      @media (max-width:700px){
        .auplanet-shell,
        .auplanet-state-dock{
          border-radius:22px;
        }

        .auplanet-inner{
          padding:14px;
        }

        .auplanet-stage{
          min-height:660px;
        }

        .auplanet-body{
          width:min(98%,520px);
          align-self:start;
          margin-top:8px;
        }

        .auplanet-state-grid,
        .auplanet-receipt-row{
          grid-template-columns:1fr;
        }
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
    const mineral = `${uid}-mineral`;
    const rim = `${uid}-rim`;

    return `
      <svg class="auplanet-svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="${uid}-title ${uid}-desc">
        <title id="${uid}-title">Audralia planet-body expression</title>
        <desc id="${uid}-desc">Audralia expressed as an ancient water-bearing mineral planet with land pressure, ocean basins, coast edges, atmosphere rim, and directional light.</desc>
        <defs>
          <clipPath id="${clip}">
            <circle cx="500" cy="500" r="438"></circle>
          </clipPath>

          <radialGradient id="${ocean}" cx="36%" cy="30%" r="76%">
            <stop offset="0%" stop-color="#66d3ff" stop-opacity=".90"></stop>
            <stop offset="30%" stop-color="#1d72b9" stop-opacity=".97"></stop>
            <stop offset="68%" stop-color="#082b64" stop-opacity="1"></stop>
            <stop offset="100%" stop-color="#020817" stop-opacity="1"></stop>
          </radialGradient>

          <radialGradient id="${shelf}" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stop-color="#a7f3c6" stop-opacity=".34"></stop>
            <stop offset="42%" stop-color="#56cfc0" stop-opacity=".16"></stop>
            <stop offset="100%" stop-color="#07152b" stop-opacity="0"></stop>
          </radialGradient>

          <linearGradient id="${land}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d8d1bd" stop-opacity=".95"></stop>
            <stop offset="28%" stop-color="#8f938d" stop-opacity=".93"></stop>
            <stop offset="58%" stop-color="#4c5b54" stop-opacity=".96"></stop>
            <stop offset="100%" stop-color="#242b35" stop-opacity=".98"></stop>
          </linearGradient>

          <linearGradient id="${mineral}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff4d8" stop-opacity=".24"></stop>
            <stop offset="26%" stop-color="#8dd8ff" stop-opacity=".20"></stop>
            <stop offset="56%" stop-color="#ad8cff" stop-opacity=".17"></stop>
            <stop offset="100%" stop-color="#a7f3c6" stop-opacity=".16"></stop>
          </linearGradient>

          <radialGradient id="${rim}" cx="34%" cy="28%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0"></stop>
            <stop offset="70%" stop-color="#8dd8ff" stop-opacity=".04"></stop>
            <stop offset="92%" stop-color="#8dd8ff" stop-opacity=".30"></stop>
            <stop offset="100%" stop-color="#f4cf83" stop-opacity=".08"></stop>
          </radialGradient>
        </defs>

        <g clip-path="url(#${clip})">
          <circle class="auplanet-ocean" cx="500" cy="500" r="455" fill="url(#${ocean})"></circle>
          <circle cx="500" cy="500" r="455" fill="url(#${shelf})" opacity=".72"></circle>

          <path fill="url(#${land})" opacity=".92"
            d="M212 344 C258 286 342 252 428 286 C485 309 518 365 504 428 C490 494 422 522 358 512 C288 501 232 458 209 404 C198 380 198 362 212 344 Z"></path>

          <path fill="url(#${land})" opacity=".88"
            d="M570 246 C646 214 742 242 788 305 C834 365 814 440 751 471 C686 504 611 476 577 423 C542 370 522 273 570 246 Z"></path>

          <path fill="url(#${land})" opacity=".86"
            d="M462 566 C527 528 612 548 670 608 C728 670 736 744 680 782 C620 824 522 796 467 736 C416 681 404 600 462 566 Z"></path>

          <path fill="url(#${land})" opacity=".76"
            d="M246 632 C290 594 356 596 392 640 C430 687 411 750 354 768 C292 787 233 744 224 684 C220 662 228 645 246 632 Z"></path>

          <g fill="none" stroke="#a7f3c6" stroke-opacity=".34" stroke-width="5">
            <path d="M218 343 C264 286 343 257 426 288 C483 309 517 365 503 427 C488 493 423 522 358 512 C288 501 233 458 210 405"></path>
            <path d="M569 247 C646 217 739 242 787 304 C834 365 813 439 751 471 C686 504 611 476 578 423"></path>
            <path d="M461 566 C527 529 611 548 670 608 C728 669 736 744 680 782 C620 824 523 796 468 736"></path>
          </g>

          <g class="auplanet-mineral" fill="none" stroke="url(#${mineral})" stroke-width="7" stroke-linecap="round">
            <path d="M260 386 C326 356 395 360 462 397"></path>
            <path d="M598 310 C664 292 731 320 774 374"></path>
            <path d="M500 640 C562 615 630 638 681 708"></path>
            <path d="M278 682 C310 660 350 666 382 714"></path>
          </g>

          <g fill="none" stroke="#cbd3dc" stroke-opacity=".13" stroke-width="2">
            <path d="M180 528 C316 496 448 510 600 570 C710 615 800 612 900 586"></path>
            <path d="M134 424 C272 462 402 450 546 410 C670 374 775 390 880 438"></path>
            <path d="M210 720 C358 648 512 650 706 742"></path>
          </g>

          <ellipse cx="620" cy="522" rx="455" ry="505" fill="#000818" opacity=".34"></ellipse>
          <ellipse cx="315" cy="300" rx="250" ry="180" fill="#ffffff" opacity=".08"></ellipse>
        </g>

        <circle class="auplanet-rim" cx="500" cy="500" r="438" fill="url(#${rim})"></circle>
        <circle cx="500" cy="500" r="438" fill="none" stroke="#8dd8ff" stroke-opacity=".24" stroke-width="3"></circle>
        <circle cx="500" cy="500" r="462" fill="none" stroke="#8dd8ff" stroke-opacity=".10" stroke-width="8"></circle>
      </svg>
    `;
  }

  function stateButtons(activeKey) {
    return STATES.map((state) => `
      <button class="auplanet-state-button" type="button" data-auplanet-state="${state.key}" aria-pressed="${state.key === activeKey ? "true" : "false"}">
        <b>${state.label}</b>
        <span>${state.compass} · ${state.status}</span>
      </button>
    `).join("");
  }

  function render(mount, options = {}) {
    if (!hasDocument()) return null;
    installStyles();

    const target = mount || resolveMount();
    if (!target) return publish("route-not-mounted");

    const activeKey = options.activeState || "datum-body";
    const active = STATES.find((state) => state.key === activeKey) || STATES[0];
    const uid = `auplanet-${Math.random().toString(36).slice(2, 9)}`;

    target.innerHTML = `
      <section class="auplanet-shell" data-contract="${CONTRACT}" data-route-local="true">
        <div class="auplanet-inner">
          <div class="auplanet-copy">
            <p class="auplanet-kicker">Audralia · Planet Body · Alternate Route</p>
            <h2 class="auplanet-title">Audralia begins expressing as a planet body.</h2>
            <p>
              This is the planet-expression chamber. The restored parent route remains the observable globe and diagnostic carrier. The cockpit remains the inspection deck.
            </p>
            <p>
              This route shows Audralia through body mass, terrain pressure, mineral surface, ocean system, coast edge, atmosphere rim, light response, and inspection receipt.
            </p>
            <div class="auplanet-actions">
              <a class="auplanet-action" href="${PARENT_ROUTE}">Return to Diagnostic Carrier</a>
              <a class="auplanet-action secondary" href="${COCKPIT_ROUTE}">Open Cockpit Inspection</a>
            </div>
            <div class="auplanet-receipt-row">
              <article class="auplanet-receipt"><b>Route Law</b><span>Branch, not replace.</span></article>
              <article class="auplanet-receipt"><b>Runtime</b><span>Strength held.</span></article>
              <article class="auplanet-receipt"><b>Visual Claim</b><span>No final pass claimed.</span></article>
              <article class="auplanet-receipt"><b>Parent</b><span>Diagnostic carrier preserved.</span></article>
            </div>
          </div>

          <div class="auplanet-stage" data-auplanet-stage data-active-state="${active.key}">
            <div class="auplanet-body">
              ${planetSvg(uid)}
            </div>

            <div class="auplanet-state-dock">
              <div class="auplanet-active" data-auplanet-active-copy>
                <b>${active.label} · ${active.compass} · ${active.status}</b>
                <span>${active.text} ${active.proof}.</span>
              </div>
              <div class="auplanet-state-grid" aria-label="Audralia planet expression states">
                ${stateButtons(active.key)}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    bindControls(target);
    return publish(active.key);
  }

  function bindControls(root) {
    const copy = root.querySelector("[data-auplanet-active-copy]");
    const buttons = Array.from(root.querySelectorAll("[data-auplanet-state]"));
    const stage = root.querySelector("[data-auplanet-stage]");

    if (!copy || !buttons.length || !stage) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.getAttribute("data-auplanet-state");
        const state = STATES.find((item) => item.key === key);
        if (!state) return;

        stage.dataset.activeState = state.key;

        buttons.forEach((item) => {
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });

        copy.innerHTML = `
          <b>${state.label} · ${state.compass} · ${state.status}</b>
          <span>${state.text} ${state.proof}.</span>
        `;

        publish(state.key);
      });
    });
  }

  const api = Object.freeze({
    contract: CONTRACT,
    route: ROUTE,
    file: FILE,
    states: () => STATES.map((state) => ({ ...state })),
    receipt,
    publish,
    render
  });

  if (hasDocument()) {
    window.AUDRALIA_G2_PLANET_BODY_ALTERNATE_ROUTE = api;
    publish("boot");

    const boot = () => {
      const mount = resolveMount();
      if (mount) render(mount);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }
})();
