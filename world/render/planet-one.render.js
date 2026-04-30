(function attachPlanetOneRenderTeam(global) {
  "use strict";

  const VERSION = "PLANET_ONE_RENDER_V9_OPAQUE_SOLAR_LUNAR_TOPOLOGY_TNT_v1";
  const PREVIOUS_V8 = "PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY";
  const ROOT_MARKER = "PLANET_ONE_RENDER_TEAM_TNT_v1";
  const V8_REALISM_PASS = "planet-one-realism-pass=v8-axis-spin-climate-topology";

  /*
    PLANET_ONE_RENDER_TEAM_TNT_v1
    PLANET_ONE_RENDER_TEAM_TNT_v8_AXIS_SPIN_CLIMATE_TOPOLOGY
    PLANET_ONE_RENDER_V9_OPAQUE_SOLAR_LUNAR_TOPOLOGY_TNT_v1

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

    v9 added:
    opaque-globe-active=true
    sun-reflection-active=true
    moon-reflection-active=true
    expanded-topology-active=true
    solar-lunar-lighting-active=true
    terrain-depth-expanded=true
    atmosphere-retained=true
    axis-overlay-retained=true
  */

  const DEFAULT_CAPTION = "Planet 1 · Nine Summits Universe · globe render lane";
  const ACTIVE_INSTANCES = new Set();

  const MARKERS = Object.freeze({
    root: ROOT_MARKER,
    v8: PREVIOUS_V8,
    v9: VERSION,
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
    axisOverlayRetained: true
  });

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-v9-styles")) return;

    const style = document.createElement("style");
    style.id = "planet-one-render-v9-styles";
    style.textContent = `
      .planet-one-render-shell {
        width: min(680px, 100%);
        margin: 0 auto;
        display: grid;
        justify-items: center;
        gap: 18px;
        color: #f5f7fb;
      }

      .planet-one-render-stage {
        width: min(660px, 100%);
        aspect-ratio: 1;
        position: relative;
        display: grid;
        place-items: center;
        isolation: isolate;
      }

      .planet-one-v9-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(0 34px 54px rgba(0, 0, 0, 0.58));
      }

      .planet-one-v9-surface {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneSurfaceDrift 44s linear infinite;
      }

      .planet-one-v9-clouds {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneCloudDrift 70s linear infinite;
      }

      .planet-one-v9-currents {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneCurrentDrift 32s linear infinite;
      }

      .planet-one-v9-axis {
        transform-box: fill-box;
        transform-origin: 500px 500px;
        animation: planetOneAxisBreath 7s ease-in-out infinite;
      }

      .planet-one-render-shell.is-paused .planet-one-v9-surface,
      .planet-one-render-shell.is-paused .planet-one-v9-clouds,
      .planet-one-render-shell.is-paused .planet-one-v9-currents,
      .planet-one-render-shell.is-paused .planet-one-v9-axis {
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
        width: min(620px, 100%);
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
        font-size: 0.74rem;
        font-weight: 900;
        letter-spacing: 0.05em;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-mapkey {
        width: min(620px, 100%);
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

      @keyframes planetOneSurfaceDrift {
        0% { transform: translateX(0); }
        100% { transform: translateX(-210px); }
      }

      @keyframes planetOneCloudDrift {
        0% { transform: translateX(0); opacity: 0.46; }
        50% { opacity: 0.66; }
        100% { transform: translateX(150px); opacity: 0.46; }
      }

      @keyframes planetOneCurrentDrift {
        0% { transform: translateX(0); opacity: 0.30; }
        50% { opacity: 0.48; }
        100% { transform: translateX(-120px); opacity: 0.30; }
      }

      @keyframes planetOneAxisBreath {
        0%, 100% { opacity: 0.58; }
        50% { opacity: 0.74; }
      }

      @media (max-width: 680px) {
        .planet-one-render-shell {
          gap: 14px;
        }

        .planet-one-render-stage {
          width: min(560px, 100%);
        }

        .planet-one-telemetry span {
          font-size: 0.68rem;
          min-height: 34px;
          padding: 7px 10px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .planet-one-v9-surface,
        .planet-one-v9-clouds,
        .planet-one-v9-currents,
        .planet-one-v9-axis {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function planetSvg() {
    return `
      <svg class="planet-one-v9-svg" viewBox="0 0 1000 1000" role="img" aria-label="Opaque Planet 1 render with solar and lunar lighting">
        <defs>
          <clipPath id="planetOneSphereClip">
            <circle cx="500" cy="500" r="394"></circle>
          </clipPath>

          <radialGradient id="planetOneOceanGradient" cx="34%" cy="30%" r="76%">
            <stop offset="0%" stop-color="#1fa9d6"></stop>
            <stop offset="22%" stop-color="#157fa8"></stop>
            <stop offset="48%" stop-color="#0b4266"></stop>
            <stop offset="74%" stop-color="#071f35"></stop>
            <stop offset="100%" stop-color="#020b15"></stop>
          </radialGradient>

          <radialGradient id="planetOneBodyShade" cx="31%" cy="28%" r="78%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.18)"></stop>
            <stop offset="38%" stop-color="rgba(255,255,255,0.03)"></stop>
            <stop offset="68%" stop-color="rgba(0,0,0,0.22)"></stop>
            <stop offset="100%" stop-color="rgba(0,0,0,0.70)"></stop>
          </radialGradient>

          <radialGradient id="planetOneSunReflection" cx="19%" cy="39%" r="34%">
            <stop offset="0%" stop-color="rgba(255,235,168,0.96)"></stop>
            <stop offset="16%" stop-color="rgba(255,204,104,0.55)"></stop>
            <stop offset="42%" stop-color="rgba(255,176,74,0.18)"></stop>
            <stop offset="100%" stop-color="rgba(255,176,74,0)"></stop>
          </radialGradient>

          <radialGradient id="planetOneMoonReflection" cx="86%" cy="28%" r="42%">
            <stop offset="0%" stop-color="rgba(165,205,255,0.28)"></stop>
            <stop offset="35%" stop-color="rgba(125,175,235,0.12)"></stop>
            <stop offset="100%" stop-color="rgba(125,175,235,0)"></stop>
          </radialGradient>

          <radialGradient id="planetOneAtmosphere" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stop-color="rgba(95,160,235,0)"></stop>
            <stop offset="88%" stop-color="rgba(112,187,255,0.18)"></stop>
            <stop offset="98%" stop-color="rgba(160,215,255,0.42)"></stop>
            <stop offset="100%" stop-color="rgba(190,230,255,0.62)"></stop>
          </radialGradient>

          <linearGradient id="planetOneAxisGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="rgba(242,199,111,0.10)"></stop>
            <stop offset="45%" stop-color="rgba(242,199,111,0.58)"></stop>
            <stop offset="100%" stop-color="rgba(242,199,111,0.20)"></stop>
          </linearGradient>

          <filter id="planetOneTerrainTexture" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="5" seed="41" result="noise"></feTurbulence>
            <feColorMatrix
              in="noise"
              type="matrix"
              values="
                0.42 0.00 0.00 0 0
                0.00 0.48 0.00 0 0
                0.00 0.00 0.34 0 0
                0.00 0.00 0.00 0.30 0"
              result="texture">
            </feColorMatrix>
            <feBlend in="SourceGraphic" in2="texture" mode="multiply"></feBlend>
          </filter>

          <filter id="planetOneRidgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#04101a" flood-opacity="0.38"></feDropShadow>
          </filter>

          <filter id="planetOneSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur"></feGaussianBlur>
            <feMerge>
              <feMergeNode in="blur"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>

        <circle cx="500" cy="500" r="428" fill="rgba(8,20,34,0.54)"></circle>
        <circle cx="500" cy="500" r="407" fill="rgba(92,148,222,0.10)" stroke="rgba(145,190,250,0.20)" stroke-width="3"></circle>

        <g clip-path="url(#planetOneSphereClip)">
          <rect x="70" y="70" width="860" height="860" fill="url(#planetOneOceanGradient)"></rect>

          <g class="planet-one-v9-currents">
            <path d="M94 338 C218 286 330 327 453 296 C582 263 716 287 900 216" fill="none" stroke="rgba(110,215,235,0.25)" stroke-width="13"></path>
            <path d="M70 575 C220 526 340 590 500 548 C660 506 770 568 930 505" fill="none" stroke="rgba(66,184,220,0.20)" stroke-width="15"></path>
            <path d="M120 718 C270 672 402 730 548 694 C694 658 803 695 930 640" fill="none" stroke="rgba(70,150,205,0.18)" stroke-width="20"></path>
          </g>

          <g class="planet-one-v9-surface" filter="url(#planetOneTerrainTexture)">
            <g opacity="1">
              <path d="M48 195 C95 150 172 128 250 146 C310 160 348 128 421 139 C510 151 596 171 648 220 C703 272 690 324 632 342 C571 361 511 337 455 365 C396 394 366 458 296 464 C217 471 164 421 106 426 C50 431 13 466 -42 444 C-102 420 -92 333 -42 290 C-5 258 9 231 48 195Z" fill="#c9b36d"></path>

              <path d="M96 210 C182 172 263 181 335 197 C415 216 500 208 580 252 C633 281 650 312 616 329 C550 360 480 313 414 353 C348 392 310 423 234 410 C160 397 103 360 42 379 C10 389 -31 389 -48 354 C-71 307 -20 253 96 210Z" fill="#6da162"></path>

              <path d="M-20 477 C82 441 168 483 259 465 C343 448 421 385 510 410 C603 437 658 510 747 484 C830 460 894 405 964 430 C1030 454 1058 546 1006 610 C960 667 852 658 775 684 C683 716 625 777 522 765 C421 753 359 690 267 698 C180 706 104 760 23 727 C-56 694 -105 596 -70 540 C-51 509 -45 486 -20 477Z" fill="#b99a58"></path>

              <path d="M20 500 C118 458 229 503 312 484 C390 466 452 430 535 449 C606 466 648 531 725 522 C794 514 865 455 941 477 C999 494 1022 562 982 608 C922 677 808 628 730 672 C645 720 566 730 471 709 C393 692 338 640 250 650 C162 660 88 700 25 668 C-52 628 -61 539 20 500Z" fill="#527f45"></path>

              <path d="M176 742 C259 704 360 736 426 776 C496 819 584 800 653 842 C714 879 702 929 635 950 C558 975 476 946 408 913 C330 875 249 884 175 850 C116 823 118 771 176 742Z" fill="#a87f4d"></path>

              <path d="M716 228 C782 190 874 190 945 224 C1000 250 1017 313 975 351 C938 384 868 361 825 391 C774 425 701 425 677 376 C650 322 655 263 716 228Z" fill="#7e9256"></path>

              <path d="M755 671 C823 630 904 651 940 702 C981 762 926 824 849 805 C783 789 703 765 705 718 C706 700 729 686 755 671Z" fill="#836948"></path>

              <path d="M116 295 C172 282 221 304 257 341 C205 351 151 344 106 325Z" fill="#0b5f80"></path>
              <path d="M244 570 C286 543 344 548 384 579 C337 603 291 608 244 570Z" fill="#0b5f80"></path>
              <path d="M653 414 C713 372 790 377 840 430 C780 470 709 469 653 414Z" fill="#063c5e"></path>
              <path d="M616 820 C660 796 707 809 742 840 C695 862 653 857 616 820Z" fill="#082d46"></path>
            </g>

            <g opacity="0.98" filter="url(#planetOneRidgeShadow)">
              <path d="M126 236 C232 198 350 214 474 257" fill="none" stroke="#e0d29b" stroke-width="15" stroke-linecap="round" opacity="0.48"></path>
              <path d="M288 438 C384 397 475 391 568 432" fill="none" stroke="#d8c184" stroke-width="11" stroke-linecap="round" opacity="0.44"></path>
              <path d="M103 542 C204 512 318 530 420 593" fill="none" stroke="#e6c98e" stroke-width="12" stroke-linecap="round" opacity="0.42"></path>
              <path d="M520 587 C625 610 704 591 798 543" fill="none" stroke="#d0b071" stroke-width="10" stroke-linecap="round" opacity="0.38"></path>
              <path d="M260 786 C360 815 478 856 602 845" fill="none" stroke="#caa66b" stroke-width="12" stroke-linecap="round" opacity="0.36"></path>
            </g>

            <g opacity="0.78">
              <path d="M86 426 C166 401 255 424 315 456" fill="none" stroke="#ead79f" stroke-width="9" opacity="0.44"></path>
              <path d="M19 474 C95 458 179 479 239 500" fill="none" stroke="#ead79f" stroke-width="7" opacity="0.38"></path>
              <path d="M624 341 C704 298 803 301 909 340" fill="none" stroke="#dec98d" stroke-width="8" opacity="0.33"></path>
              <path d="M730 684 C804 659 872 674 933 714" fill="none" stroke="#c7a36a" stroke-width="7" opacity="0.31"></path>
            </g>
          </g>

          <g class="planet-one-v9-clouds">
            <path d="M102 282 C220 244 360 268 474 299 C580 328 680 319 824 278" fill="none" stroke="rgba(244,248,255,0.26)" stroke-width="22" stroke-linecap="round"></path>
            <path d="M64 512 C210 474 365 499 514 538 C657 576 768 566 930 517" fill="none" stroke="rgba(244,248,255,0.18)" stroke-width="20" stroke-linecap="round"></path>
            <path d="M188 662 C315 633 441 652 566 700 C672 741 789 733 910 688" fill="none" stroke="rgba(244,248,255,0.15)" stroke-width="18" stroke-linecap="round"></path>
          </g>

          <rect x="70" y="70" width="860" height="860" fill="url(#planetOneBodyShade)"></rect>
          <circle cx="500" cy="500" r="394" fill="url(#planetOneMoonReflection)"></circle>
          <circle cx="500" cy="500" r="394" fill="url(#planetOneSunReflection)" filter="url(#planetOneSoftGlow)"></circle>

          <path d="M112 500 C250 452 392 451 512 489 C639 529 744 526 888 480" fill="none" stroke="rgba(147,205,255,0.22)" stroke-width="6"></path>
          <path d="M118 570 C268 526 384 555 512 583 C655 615 760 600 884 556" fill="none" stroke="rgba(105,173,235,0.16)" stroke-width="5"></path>
        </g>

        <circle cx="500" cy="500" r="394" fill="none" stroke="rgba(160,214,255,0.44)" stroke-width="5"></circle>
        <circle cx="500" cy="500" r="404" fill="url(#planetOneAtmosphere)"></circle>
        <circle cx="500" cy="500" r="414" fill="none" stroke="rgba(126,190,255,0.20)" stroke-width="10"></circle>

        <g class="planet-one-v9-axis">
          <line x1="355" y1="890" x2="645" y2="110" stroke="url(#planetOneAxisGradient)" stroke-width="13" stroke-linecap="round"></line>
          <circle cx="355" cy="890" r="15" fill="rgba(242,199,111,0.48)" stroke="rgba(242,199,111,0.42)" stroke-width="5"></circle>
          <circle cx="645" cy="110" r="15" fill="rgba(242,199,111,0.48)" stroke="rgba(242,199,111,0.42)" stroke-width="5"></circle>
        </g>
      </svg>
    `;
  }

  function telemetry() {
    return `
      <div class="planet-one-telemetry" aria-label="Planet 1 render standards">
        <span>Planet 1</span>
        <span>Opaque globe</span>
        <span>Sun reflection</span>
        <span>Moon reflection</span>
        <span>Axis spin</span>
        <span>Climate topology</span>
        <span>Weather circulation</span>
        <span>Ocean currents</span>
        <span>Expanded topology</span>
        <span>Pangaea fracture</span>
        <span>Tree demo mode</span>
      </div>
    `;
  }

  function mapKey() {
    return `
      <div class="planet-one-mapkey" aria-label="Planet 1 render notes">
        <article>
          <strong>Opaque world body</strong>
          <span>The globe now reads as a solid planet. Atmosphere and lighting add depth without turning the surface transparent.</span>
        </article>
        <article>
          <strong>Solar and lunar light</strong>
          <span>Warm sun reflection leads the day side. Cool lunar relief gives the far side shape without overpowering the sun.</span>
        </article>
        <article>
          <strong>Expanded topology</strong>
          <span>Ocean basins, coastal shelves, beach rings, ridges, plateaus, valleys, and fractured land memory are integrated into the surface.</span>
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
        data-v9-marker="${VERSION}"
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
      >
        <div class="planet-one-render-stage">
          ${planetSvg()}
        </div>

        <div class="planet-one-caption">${caption}</div>

        ${telemetry()}
        ${mapKey()}
      </section>
    `;

    const shell = mount.querySelector(".planet-one-render-shell");
    const svg = mount.querySelector(".planet-one-v9-svg");

    const instance = {
      version: VERSION,
      rootMarker: ROOT_MARKER,
      v8Marker: PREVIOUS_V8,
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
          v8RealismPass: V8_REALISM_PASS,
          markers: MARKERS,
          active: shell ? !shell.classList.contains("is-paused") : false,
          planetOneRealismPass: "v8-axis-spin-climate-topology",
          opaqueGlobeActive: true,
          sunReflectionActive: true,
          moonReflectionActive: true,
          expandedTopologyActive: true,
          solarLunarLightingActive: true,
          terrainDepthExpanded: true,
          atmosphereRetained: true,
          axisOverlayRetained: true
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
        axisOverlayRetained: true
      };
    }
  });

  global.DGBPlanetOneRenderTeam = api;

  if (typeof window !== "undefined") {
    window.DGBPlanetOneRenderTeam = api;
  }
})(window);
