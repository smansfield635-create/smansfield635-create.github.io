(function attachPlanetOneRenderTeam(global) {
  "use strict";

  const VERSION = "PLANET_ONE_RENDER_V10_TOPOLOGY_SEPARATION_TNT_v1";
  const PREVIOUS_V9 = "PLANET_ONE_RENDER_V9_OPAQUE_SOLAR_LUNAR_TOPOLOGY_TNT_v1";
  const PREVIOUS_V8 = "PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY";
  const ROOT_MARKER = "PLANET_ONE_RENDER_TEAM_TNT_v1";
  const V8_REALISM_PASS = "planet-one-realism-pass=v8-axis-spin-climate-topology";

  /*
    PLANET_ONE_RENDER_TEAM_TNT_v1
    PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY
    PLANET_ONE_RENDER_V9_OPAQUE_SOLAR_LUNAR_TOPOLOGY_TNT_v1
    PLANET_ONE_RENDER_V10_TOPOLOGY_SEPARATION_TNT_v1

    window.DGBPlanetOneRenderTeam
    planet-one-realism-pass=v8-axis-spin-climate-topology

    v8 preserved:
    planet-one-render-active=true
    axis-spin-active=true
    climate-topology-active=true
    weather-circulation-active=true
    ocean-current-logic-active=true
    globe-demo-status-retired=true
    tree-demo-mode=true
    render-lanes-separated=true
    no-render-lane-collapse=true

    v9 preserved:
    opaque-globe-active=true
    sun-reflection-active=true
    moon-reflection-active=true
    expanded-topology-active=true
    solar-lunar-lighting-active=true
    terrain-depth-expanded=true
    atmosphere-retained=true
    axis-overlay-retained=true

    v10 added:
    topology-separation-active=true
    shape-first-active=true
    land-water-separation-active=true
    shoreline-discipline-active=true
    terrain-contained-to-land=true
    currents-contained-to-water=true
    weather-secondary-overlay=true
    lighting-illumination-only=true
    axis-overlay-only=true
    visual-soup-correction=true
  */

  const DEFAULT_CAPTION = "Planet 1 · Nine Summits Universe · topology-separated render lane";
  const ACTIVE_INSTANCES = new Set();

  let renderUid = 0;

  const MARKERS = Object.freeze({
    root: ROOT_MARKER,
    v8: PREVIOUS_V8,
    v9: PREVIOUS_V9,
    v10: VERSION,
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
    visualSoupCorrection: true
  });

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nextUid() {
    renderUid += 1;
    return "p1v10_" + renderUid + "_" + Math.random().toString(16).slice(2);
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-v10-styles")) return;

    const style = document.createElement("style");
    style.id = "planet-one-render-v10-styles";
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

      .planet-one-v10-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(0 34px 58px rgba(0, 0, 0, 0.62));
      }

      .planet-one-v10-world-turn {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV10WorldTurn 92s linear infinite;
      }

      .planet-one-v10-weather {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV10WeatherDrift 58s linear infinite;
      }

      .planet-one-v10-currents {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV10CurrentBreath 38s ease-in-out infinite;
      }

      .planet-one-v10-axis {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneV10AxisBreath 7s ease-in-out infinite;
      }

      .planet-one-render-shell.is-paused .planet-one-v10-world-turn,
      .planet-one-render-shell.is-paused .planet-one-v10-weather,
      .planet-one-render-shell.is-paused .planet-one-v10-currents,
      .planet-one-render-shell.is-paused .planet-one-v10-axis {
        animation-play-state: paused;
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

      @keyframes planetOneV10WorldTurn {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes planetOneV10WeatherDrift {
        0% { transform: rotate(0deg); opacity: 0.36; }
        50% { opacity: 0.48; }
        100% { transform: rotate(-360deg); opacity: 0.36; }
      }

      @keyframes planetOneV10CurrentBreath {
        0%, 100% { opacity: 0.26; }
        50% { opacity: 0.44; }
      }

      @keyframes planetOneV10AxisBreath {
        0%, 100% { opacity: 0.52; }
        50% { opacity: 0.72; }
      }

      @media (max-width: 680px) {
        .planet-one-render-shell {
          gap: 14px;
        }

        .planet-one-render-stage {
          width: min(570px, 100%);
        }

        .planet-one-telemetry span {
          font-size: 0.66rem;
          min-height: 34px;
          padding: 7px 10px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .planet-one-v10-world-turn,
        .planet-one-v10-weather,
        .planet-one-v10-currents,
        .planet-one-v10-axis {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function landDefs(uid) {
    const northPole = `${uid}_northPole`;
    const northRegion = `${uid}_northRegion`;
    const mainland = `${uid}_mainland`;
    const westRegion = `${uid}_westRegion`;
    const eastRegion = `${uid}_eastRegion`;
    const southRegion = `${uid}_southRegion`;
    const southPole = `${uid}_southPole`;

    return {
      northPole,
      northRegion,
      mainland,
      westRegion,
      eastRegion,
      southRegion,
      southPole,
      defs: `
        <path id="${northPole}" d="M407 113 C448 80 526 74 587 101 C630 120 649 155 624 180 C590 214 515 207 463 191 C414 176 377 146 407 113Z"></path>

        <path id="${northRegion}" d="M330 207 C383 166 467 158 541 181 C608 202 661 239 680 291 C701 350 650 389 586 381 C525 373 489 331 428 342 C370 353 319 397 263 367 C209 338 216 267 330 207Z"></path>

        <path id="${mainland}" d="M320 407 C399 358 498 365 573 407 C653 452 695 537 664 619 C629 711 521 742 427 711 C337 681 270 603 278 513 C282 464 292 424 320 407Z"></path>

        <path id="${westRegion}" d="M162 401 C226 350 306 360 347 421 C385 477 356 556 296 596 C234 638 145 630 104 575 C61 518 91 458 162 401Z"></path>

        <path id="${eastRegion}" d="M686 388 C751 352 831 366 878 429 C924 492 900 574 838 617 C778 658 690 638 652 582 C612 524 623 423 686 388Z"></path>

        <path id="${southRegion}" d="M339 732 C411 694 502 711 574 753 C629 786 646 842 604 880 C550 928 451 912 378 872 C307 833 281 763 339 732Z"></path>

        <path id="${southPole}" d="M398 882 C451 856 530 858 594 887 C627 902 633 926 604 947 C553 984 453 978 401 944 C371 924 366 899 398 882Z"></path>
      `
    };
  }

  function planetSvg(uid) {
    const ids = {
      sphereClip: `${uid}_sphereClip`,
      oceanGradient: `${uid}_oceanGradient`,
      sphereShade: `${uid}_sphereShade`,
      sunLight: `${uid}_sunLight`,
      moonLight: `${uid}_moonLight`,
      atmosphere: `${uid}_atmosphere`,
      limbGlow: `${uid}_limbGlow`,
      axisGradient: `${uid}_axisGradient`,
      terrainTexture: `${uid}_terrainTexture`,
      ridgeShadow: `${uid}_ridgeShadow`,
      landSoft: `${uid}_landSoft`
    };

    const lands = landDefs(uid);

    return `
      <svg class="planet-one-v10-svg" viewBox="0 0 1000 1000" role="img" aria-label="Topology-separated Planet 1 render with opaque globe, land, water, terrain, weather, solar light, lunar light, and axis overlay">
        <defs>
          <clipPath id="${ids.sphereClip}">
            <circle cx="500" cy="500" r="394"></circle>
          </clipPath>

          ${lands.defs}

          <clipPath id="${lands.northPole}Clip"><use href="#${lands.northPole}"></use></clipPath>
          <clipPath id="${lands.northRegion}Clip"><use href="#${lands.northRegion}"></use></clipPath>
          <clipPath id="${lands.mainland}Clip"><use href="#${lands.mainland}"></use></clipPath>
          <clipPath id="${lands.westRegion}Clip"><use href="#${lands.westRegion}"></use></clipPath>
          <clipPath id="${lands.eastRegion}Clip"><use href="#${lands.eastRegion}"></use></clipPath>
          <clipPath id="${lands.southRegion}Clip"><use href="#${lands.southRegion}"></use></clipPath>
          <clipPath id="${lands.southPole}Clip"><use href="#${lands.southPole}"></use></clipPath>

          <radialGradient id="${ids.oceanGradient}" cx="34%" cy="28%" r="78%">
            <stop offset="0%" stop-color="#1fa7d2"></stop>
            <stop offset="24%" stop-color="#167fa8"></stop>
            <stop offset="50%" stop-color="#0a466f"></stop>
            <stop offset="75%" stop-color="#061f38"></stop>
            <stop offset="100%" stop-color="#020814"></stop>
          </radialGradient>

          <radialGradient id="${ids.sphereShade}" cx="30%" cy="27%" r="78%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.14)"></stop>
            <stop offset="38%" stop-color="rgba(255,255,255,0.02)"></stop>
            <stop offset="68%" stop-color="rgba(0,0,0,0.28)"></stop>
            <stop offset="100%" stop-color="rgba(0,0,0,0.76)"></stop>
          </radialGradient>

          <radialGradient id="${ids.sunLight}" cx="22%" cy="35%" r="35%">
            <stop offset="0%" stop-color="rgba(255,237,174,0.92)"></stop>
            <stop offset="18%" stop-color="rgba(255,204,104,0.46)"></stop>
            <stop offset="44%" stop-color="rgba(255,180,80,0.16)"></stop>
            <stop offset="100%" stop-color="rgba(255,180,80,0)"></stop>
          </radialGradient>

          <radialGradient id="${ids.moonLight}" cx="86%" cy="28%" r="48%">
            <stop offset="0%" stop-color="rgba(166,205,255,0.22)"></stop>
            <stop offset="38%" stop-color="rgba(120,168,230,0.10)"></stop>
            <stop offset="100%" stop-color="rgba(120,168,230,0)"></stop>
          </radialGradient>

          <radialGradient id="${ids.atmosphere}" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stop-color="rgba(95,160,235,0)"></stop>
            <stop offset="88%" stop-color="rgba(112,187,255,0.15)"></stop>
            <stop offset="98%" stop-color="rgba(160,215,255,0.36)"></stop>
            <stop offset="100%" stop-color="rgba(190,230,255,0.54)"></stop>
          </radialGradient>

          <radialGradient id="${ids.limbGlow}" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stop-color="rgba(125,190,255,0)"></stop>
            <stop offset="100%" stop-color="rgba(145,205,255,0.34)"></stop>
          </radialGradient>

          <linearGradient id="${ids.axisGradient}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="rgba(242,199,111,0.06)"></stop>
            <stop offset="45%" stop-color="rgba(242,199,111,0.54)"></stop>
            <stop offset="100%" stop-color="rgba(242,199,111,0.15)"></stop>
          </linearGradient>

          <filter id="${ids.terrainTexture}" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.036" numOctaves="4" seed="72" result="noise"></feTurbulence>
            <feColorMatrix
              in="noise"
              type="matrix"
              values="
                0.38 0.00 0.00 0 0
                0.00 0.42 0.00 0 0
                0.00 0.00 0.30 0 0
                0.00 0.00 0.00 0.24 0"
              result="texture">
            </feColorMatrix>
            <feBlend in="SourceGraphic" in2="texture" mode="multiply"></feBlend>
          </filter>

          <filter id="${ids.ridgeShadow}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.2" flood-color="#04101a" flood-opacity="0.42"></feDropShadow>
          </filter>

          <filter id="${ids.landSoft}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-color="#04101a" flood-opacity="0.22"></feDropShadow>
          </filter>
        </defs>

        <circle cx="500" cy="500" r="430" fill="rgba(6,18,32,0.62)"></circle>
        <circle cx="500" cy="500" r="409" fill="rgba(86,145,218,0.08)" stroke="rgba(145,190,250,0.18)" stroke-width="3"></circle>

        <g clip-path="url(#${ids.sphereClip})">
          <rect x="70" y="70" width="860" height="860" fill="url(#${ids.oceanGradient})"></rect>

          <g class="planet-one-v10-currents" aria-label="Water-only current layer">
            <path d="M106 337 C226 292 332 324 454 296 C582 267 709 291 894 222" fill="none" stroke="rgba(105,214,235,0.22)" stroke-width="11" stroke-linecap="round"></path>
            <path d="M86 575 C225 528 347 590 500 549 C660 506 772 570 914 510" fill="none" stroke="rgba(70,178,218,0.18)" stroke-width="12" stroke-linecap="round"></path>
            <path d="M131 720 C276 675 407 730 548 694 C692 658 802 696 912 642" fill="none" stroke="rgba(75,150,205,0.15)" stroke-width="15" stroke-linecap="round"></path>
          </g>

          <g class="planet-one-v10-world-turn">
            <g aria-label="Shoreline discipline layer">
              <use href="#${lands.northPole}" fill="none" stroke="#e5f2ff" stroke-width="13" stroke-linejoin="round" opacity="0.72"></use>
              <use href="#${lands.northRegion}" fill="none" stroke="#dec68e" stroke-width="13" stroke-linejoin="round" opacity="0.46"></use>
              <use href="#${lands.mainland}" fill="none" stroke="#ecd49b" stroke-width="15" stroke-linejoin="round" opacity="0.58"></use>
              <use href="#${lands.westRegion}" fill="none" stroke="#d4bb85" stroke-width="12" stroke-linejoin="round" opacity="0.48"></use>
              <use href="#${lands.eastRegion}" fill="none" stroke="#d6c08c" stroke-width="12" stroke-linejoin="round" opacity="0.46"></use>
              <use href="#${lands.southRegion}" fill="none" stroke="#d4bd8d" stroke-width="12" stroke-linejoin="round" opacity="0.48"></use>
              <use href="#${lands.southPole}" fill="none" stroke="#e9f3ff" stroke-width="12" stroke-linejoin="round" opacity="0.72"></use>
            </g>

            <g aria-label="Shape-first landmass layer" filter="url(#${ids.landSoft})">
              <use href="#${lands.northPole}" fill="#e6f2fb"></use>
              <use href="#${lands.northRegion}" fill="#8f9d79"></use>
              <use href="#${lands.mainland}" fill="#6e9b5d"></use>
              <use href="#${lands.westRegion}" fill="#746d5f"></use>
              <use href="#${lands.eastRegion}" fill="#78a888"></use>
              <use href="#${lands.southRegion}" fill="#8c9d64"></use>
              <use href="#${lands.southPole}" fill="#e5edf4"></use>
            </g>

            <g aria-label="Contained land terrain layer" filter="url(#${ids.terrainTexture})">
              <g clip-path="url(#${lands.northRegion}Clip)">
                <rect x="220" y="150" width="500" height="260" fill="rgba(255,255,255,0.02)"></rect>
                <path d="M269 286 C360 236 466 234 593 294" fill="none" stroke="#e2d09b" stroke-width="13" stroke-linecap="round" opacity="0.48" filter="url(#${ids.ridgeShadow})"></path>
                <path d="M281 332 C376 304 499 312 631 348" fill="none" stroke="#5f764f" stroke-width="17" stroke-linecap="round" opacity="0.42"></path>
              </g>

              <g clip-path="url(#${lands.mainland}Clip)">
                <rect x="260" y="350" width="440" height="410" fill="rgba(255,255,255,0.02)"></rect>
                <path d="M320 482 C420 425 543 429 635 493" fill="none" stroke="#dfca90" stroke-width="14" stroke-linecap="round" opacity="0.50" filter="url(#${ids.ridgeShadow})"></path>
                <path d="M315 560 C420 535 540 552 650 606" fill="none" stroke="#3f6f3d" stroke-width="18" stroke-linecap="round" opacity="0.44"></path>
                <path d="M407 659 C475 681 555 673 617 632" fill="none" stroke="#c2a46b" stroke-width="12" stroke-linecap="round" opacity="0.42"></path>
                <path d="M450 510 C484 488 528 493 558 523 C523 546 482 546 450 510Z" fill="#0d5d76" opacity="0.88"></path>
              </g>

              <g clip-path="url(#${lands.westRegion}Clip)">
                <path d="M114 500 C169 440 240 432 320 482" fill="none" stroke="#c6a670" stroke-width="13" stroke-linecap="round" opacity="0.46" filter="url(#${ids.ridgeShadow})"></path>
                <path d="M127 553 C191 542 244 560 295 596" fill="none" stroke="#5e574b" stroke-width="16" stroke-linecap="round" opacity="0.44"></path>
              </g>

              <g clip-path="url(#${lands.eastRegion}Clip)">
                <path d="M658 462 C719 414 805 420 872 480" fill="none" stroke="#e2cb94" stroke-width="12" stroke-linecap="round" opacity="0.43" filter="url(#${ids.ridgeShadow})"></path>
                <path d="M679 550 C745 532 805 548 855 594" fill="none" stroke="#4c7f64" stroke-width="17" stroke-linecap="round" opacity="0.42"></path>
                <path d="M733 493 C767 473 813 482 836 510 C801 532 765 527 733 493Z" fill="#0b5a77" opacity="0.76"></path>
              </g>

              <g clip-path="url(#${lands.southRegion}Clip)">
                <path d="M338 784 C418 814 505 840 594 812" fill="none" stroke="#caa66b" stroke-width="13" stroke-linecap="round" opacity="0.42" filter="url(#${ids.ridgeShadow})"></path>
                <path d="M376 858 C445 875 520 881 589 852" fill="none" stroke="#6f744f" stroke-width="17" stroke-linecap="round" opacity="0.38"></path>
              </g>
            </g>
          </g>

          <g class="planet-one-v10-weather" aria-label="Weather secondary overlay">
            <path d="M118 278 C235 248 362 272 486 306 C604 338 714 324 842 282" fill="none" stroke="rgba(244,248,255,0.20)" stroke-width="16" stroke-linecap="round"></path>
            <path d="M94 514 C230 482 371 504 514 540 C642 573 762 566 902 522" fill="none" stroke="rgba(244,248,255,0.14)" stroke-width="15" stroke-linecap="round"></path>
            <path d="M192 667 C315 640 442 658 565 702 C676 740 780 735 894 690" fill="none" stroke="rgba(244,248,255,0.12)" stroke-width="13" stroke-linecap="round"></path>
          </g>

          <rect x="70" y="70" width="860" height="860" fill="url(#${ids.sphereShade})"></rect>
          <circle cx="500" cy="500" r="394" fill="url(#${ids.moonLight})"></circle>
          <circle cx="500" cy="500" r="394" fill="url(#${ids.sunLight})"></circle>
        </g>

        <circle cx="500" cy="500" r="394" fill="none" stroke="rgba(160,214,255,0.42)" stroke-width="5"></circle>
        <circle cx="500" cy="500" r="404" fill="url(#${ids.atmosphere})"></circle>
        <circle cx="500" cy="500" r="414" fill="url(#${ids.limbGlow})"></circle>
        <circle cx="500" cy="500" r="416" fill="none" stroke="rgba(126,190,255,0.18)" stroke-width="10"></circle>

        <g class="planet-one-v10-axis" aria-label="Axis overlay only">
          <line x1="355" y1="890" x2="645" y2="110" stroke="url(#${ids.axisGradient})" stroke-width="12" stroke-linecap="round"></line>
          <circle cx="355" cy="890" r="14" fill="rgba(242,199,111,0.42)" stroke="rgba(242,199,111,0.38)" stroke-width="5"></circle>
          <circle cx="645" cy="110" r="14" fill="rgba(242,199,111,0.42)" stroke="rgba(242,199,111,0.38)" stroke-width="5"></circle>
        </g>
      </svg>
    `;
  }

  function telemetry() {
    return `
      <div class="planet-one-telemetry" aria-label="Planet 1 render standards">
        <span>Planet 1</span>
        <span>Opaque globe</span>
        <span>Shape first</span>
        <span>Land / water separation</span>
        <span>Shoreline discipline</span>
        <span>Terrain inside land</span>
        <span>Currents inside water</span>
        <span>Weather secondary</span>
        <span>Sun reflection</span>
        <span>Moon reflection</span>
        <span>Axis overlay</span>
      </div>
    `;
  }

  function mapKey() {
    return `
      <div class="planet-one-mapkey" aria-label="Planet 1 render notes">
        <article>
          <strong>Shape first</strong>
          <span>Landmasses are drawn as readable bodies before texture, weather, or lighting appear.</span>
        </article>
        <article>
          <strong>Layer discipline</strong>
          <span>Shorelines hug land, terrain stays inside land, currents stay inside water, and weather stays secondary.</span>
        </article>
        <article>
          <strong>Light last</strong>
          <span>Solar and lunar light illuminate the globe without repainting the map or hiding topology.</span>
        </article>
      </div>
    `;
  }

  function renderPlanetOne(target, options) {
    const mount =
      typeof target === "string"
        ? document.querySelector(target)
        : target;

    if (!mount) {
      throw new Error("Planet 1 render mount not found.");
    }

    injectStyles();

    const uid = nextUid();
    const opts = options || {};
    const caption = escapeHtml(opts.caption || DEFAULT_CAPTION);

    ACTIVE_INSTANCES.forEach(function stopExisting(instance) {
      if (instance && typeof instance.stop === "function") {
        instance.stop();
      }
    });

    mount.innerHTML = `
      <section
        class="planet-one-render-shell"
        data-render-version="${VERSION}"
        data-root-marker="${ROOT_MARKER}"
        data-v8-marker="${PREVIOUS_V8}"
        data-v9-marker="${PREVIOUS_V9}"
        data-v10-marker="${VERSION}"
        data-planet-one-realism-pass="v8-axis-spin-climate-topology"
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
      >
        <div class="planet-one-render-stage">
          ${planetSvg(uid)}
        </div>

        <div class="planet-one-caption">${caption}</div>

        ${telemetry()}
        ${mapKey()}
      </section>
    `;

    const shell = mount.querySelector(".planet-one-render-shell");
    const svg = mount.querySelector(".planet-one-v10-svg");

    const instance = {
      version: VERSION,
      rootMarker: ROOT_MARKER,
      v8Marker: PREVIOUS_V8,
      v9Marker: PREVIOUS_V9,
      v10Marker: VERSION,
      v8RealismPass: V8_REALISM_PASS,
      markers: MARKERS,
      mount,
      shell,
      svg,
      start() {
        if (shell) shell.classList.remove("is-paused");
        if (svg && typeof svg.unpauseAnimations === "function") {
          svg.unpauseAnimations();
        }
        return true;
      },
      stop() {
        if (shell) shell.classList.add("is-paused");
        if (svg && typeof svg.pauseAnimations === "function") {
          svg.pauseAnimations();
        }
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
        if (mount && mount.contains(shell)) {
          mount.innerHTML = "";
        }
        return true;
      },
      getStatus() {
        return {
          version: VERSION,
          rootMarker: ROOT_MARKER,
          v8Marker: PREVIOUS_V8,
          v9Marker: PREVIOUS_V9,
          v10Marker: VERSION,
          v8RealismPass: V8_REALISM_PASS,
          markers: MARKERS,
          active: shell ? !shell.classList.contains("is-paused") : false,
          planetOneRealismPass: "v8-axis-spin-climate-topology",
          topologySeparationActive: true,
          shapeFirstActive: true,
          landWaterSeparationActive: true,
          shorelineDisciplineActive: true,
          terrainContainedToLand: true,
          currentsContainedToWater: true,
          weatherSecondaryOverlay: true,
          lightingIlluminationOnly: true,
          axisOverlayOnly: true,
          visualSoupCorrection: true
        };
      }
    };

    ACTIVE_INSTANCES.add(instance);
    instance.start();

    return instance;
  }

  function stopAll() {
    ACTIVE_INSTANCES.forEach(function stopInstance(instance) {
      if (instance && typeof instance.stop === "function") {
        instance.stop();
      }
    });
    return true;
  }

  function startAll() {
    ACTIVE_INSTANCES.forEach(function startInstance(instance) {
      if (instance && typeof instance.start === "function") {
        instance.start();
      }
    });
    return true;
  }

  function destroyAll() {
    Array.from(ACTIVE_INSTANCES).forEach(function destroyInstance(instance) {
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      }
    });
    ACTIVE_INSTANCES.clear();
    return true;
  }

  const api = Object.freeze({
    VERSION,
    PREVIOUS_V8,
    PREVIOUS_V9,
    ROOT_MARKER,
    V8_REALISM_PASS,
    MARKERS,
    renderPlanetOne,
    stopAll,
    startAll,
    destroyAll,
    getActiveCount() {
      return ACTIVE_INSTANCES.size;
    },
    getStatus() {
      return {
        version: VERSION,
        previousV8: PREVIOUS_V8,
        previousV9: PREVIOUS_V9,
        rootMarker: ROOT_MARKER,
        v8RealismPass: V8_REALISM_PASS,
        markers: MARKERS,
        activeCount: ACTIVE_INSTANCES.size,

        planetOneRenderActive: true,
        axisSpinActive: true,
        climateTopologyActive: true,
        weatherCirculationActive: true,
        oceanCurrentLogicActive: true,

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
        visualSoupCorrection: true
      };
    }
  });

  global.DGBPlanetOneRenderTeam = api;

  if (typeof window !== "undefined") {
    window.DGBPlanetOneRenderTeam = api;
  }
})(window);
