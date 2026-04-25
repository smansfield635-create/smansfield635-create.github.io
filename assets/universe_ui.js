/* ==========================================================================
   DGB Universe UI · Second Generation Renewal
   Shared runtime for reusable globe boxes, route diamonds, and UI instruments.
   ========================================================================== */

(() => {
  "use strict";

  const DGB_UI = {
    generation: "second-generation-renewal",
    runtime: "assets-universe-ui",
    globe: "shared-real-earth-box",
    mounted: false
  };

  const EARTH_TEXTURE =
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg";

  const STYLE_ID = "dgb-universe-ui-runtime-style";

  const runtimeCSS = `
    :root {
      --dgb-earth-texture:url("${EARTH_TEXTURE}");
      --dgb-earth-spin:64s;
    }

    [data-dgb-globe="earth"] {
      --globe-size:min(380px,74vw);
      --globe-glow:rgba(142,197,255,.28);
      --globe-ring:rgba(142,197,255,.18);
      --globe-accent:rgba(239,210,154,.50);
      position:relative;
      width:var(--globe-size);
      aspect-ratio:1 / 1;
      isolation:isolate;
      display:block;
      filter:
        drop-shadow(0 0 34px var(--globe-glow))
        drop-shadow(0 0 74px rgba(147,239,189,.08));
    }

    [data-dgb-globe-size="hero"] {
      --globe-size:min(270px,34vw);
    }

    [data-dgb-globe-size="panel"] {
      --globe-size:min(380px,74vw);
    }

    [data-dgb-globe-size="small"] {
      --globe-size:min(180px,42vw);
    }

    [data-dgb-globe-theme="gold"] {
      --globe-glow:rgba(239,210,154,.24);
      --globe-ring:rgba(239,210,154,.20);
      --globe-accent:rgba(239,210,154,.58);
    }

    [data-dgb-globe-theme="green"] {
      --globe-glow:rgba(147,239,189,.22);
      --globe-ring:rgba(147,239,189,.18);
      --globe-accent:rgba(147,239,189,.54);
    }

    [data-dgb-globe-theme="purple"] {
      --globe-glow:rgba(200,156,255,.24);
      --globe-ring:rgba(200,156,255,.20);
      --globe-accent:rgba(200,156,255,.54);
    }

    [data-dgb-globe-theme="blue"] {
      --globe-glow:rgba(142,197,255,.28);
      --globe-ring:rgba(142,197,255,.18);
      --globe-accent:rgba(239,210,154,.50);
    }

    [data-dgb-globe="earth"] .dgb-globe-box__tilt {
      position:absolute;
      inset:0;
      transform:rotate(-23.5deg);
      transform-origin:50% 50%;
    }

    [data-dgb-globe="earth"] .dgb-globe-box__tilt::before {
      content:"";
      position:absolute;
      left:50%;
      top:-8%;
      width:2px;
      height:116%;
      transform:translateX(-50%);
      background:linear-gradient(180deg,transparent,var(--globe-accent),transparent);
      box-shadow:0 0 18px rgba(239,210,154,.24);
      z-index:8;
    }

    [data-dgb-globe="earth"] .dgb-globe-box__earth {
      position:absolute;
      inset:0;
      border-radius:50%;
      overflow:hidden;
      background:
        radial-gradient(circle at 33% 24%,rgba(255,255,255,.30),transparent 12%),
        radial-gradient(circle at 75% 72%,rgba(0,0,0,.42),transparent 34%),
        #081d45;
      box-shadow:
        inset -42px -18px 54px rgba(0,0,0,.58),
        inset 20px 10px 36px rgba(255,255,255,.10),
        0 0 0 1px rgba(170,198,255,.22),
        0 0 62px var(--globe-glow);
    }

    [data-dgb-globe="earth"] .dgb-globe-box__map {
      position:absolute;
      inset:-2%;
      border-radius:50%;
      background-image:var(--dgb-earth-texture);
      background-size:220% 100%;
      background-position:220% 50%;
      background-repeat:repeat-x;
      filter:saturate(1.22) contrast(1.08) brightness(.92);
      transform:scale(1.02);
      animation:dgbUniverseEarthTextureDriftCorrect var(--dgb-earth-spin) linear infinite;
      z-index:1;
    }

    [data-dgb-globe="earth"] .dgb-globe-box__map::before {
      content:"";
      position:absolute;
      inset:0;
      border-radius:50%;
      background:
        repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0 1px,transparent 1px 22px),
        repeating-linear-gradient(0deg,rgba(255,255,255,.045) 0 1px,transparent 1px 24px);
      mix-blend-mode:screen;
      opacity:.42;
      pointer-events:none;
    }

    [data-dgb-globe="earth"] .dgb-globe-box__map::after {
      content:"";
      position:absolute;
      inset:0;
      border-radius:50%;
      background:
        radial-gradient(circle at 28% 22%,rgba(255,255,255,.28),transparent 14%),
        linear-gradient(90deg,rgba(255,255,255,.16),transparent 34%,rgba(0,0,0,.28) 76%,rgba(0,0,0,.58));
      pointer-events:none;
    }

    [data-dgb-globe="earth"] .dgb-globe-box__clouds {
      position:absolute;
      inset:-1%;
      border-radius:50%;
      background:
        radial-gradient(ellipse at 28% 28%,rgba(255,255,255,.22),transparent 10%),
        radial-gradient(ellipse at 54% 42%,rgba(255,255,255,.16),transparent 12%),
        radial-gradient(ellipse at 72% 64%,rgba(255,255,255,.16),transparent 14%),
        radial-gradient(ellipse at 38% 72%,rgba(255,255,255,.13),transparent 13%);
      mix-blend-mode:screen;
      opacity:.60;
      animation:dgbUniverseCloudDriftCorrect 72s linear infinite;
      pointer-events:none;
      z-index:3;
    }

    [data-dgb-globe="earth"] .dgb-globe-box__atmosphere {
      position:absolute;
      inset:-5%;
      border-radius:50%;
      border:1px solid rgba(142,197,255,.30);
      background:radial-gradient(circle at 50% 50%,transparent 62%,rgba(142,197,255,.18) 74%,transparent 78%);
      animation:dgbUniverseAtmospherePulse 6s ease-in-out infinite;
      pointer-events:none;
      z-index:4;
    }

    [data-dgb-globe="earth"] .dgb-globe-box__label {
      position:absolute;
      left:50%;
      bottom:-42px;
      transform:translateX(-50%) rotate(23.5deg);
      min-width:260px;
      text-align:center;
      color:#dfe8ff;
      font-size:.78rem;
      font-weight:850;
      letter-spacing:.12em;
      text-transform:uppercase;
      z-index:9;
    }

    .dgb-globe-stage {
      min-height:clamp(410px,58vw,650px);
      display:grid;
      place-items:center;
      position:relative;
      overflow:hidden;
      border:1px solid rgba(142,197,255,.18);
      border-radius:28px;
      background:
        radial-gradient(circle at 50% 42%,rgba(142,197,255,.12),transparent 26%),
        radial-gradient(circle at 50% 52%,rgba(239,210,154,.08),transparent 52%),
        rgba(255,255,255,.025);
    }

    .dgb-globe-stage::before {
      content:"";
      position:absolute;
      width:min(720px,94vw);
      height:min(300px,42vw);
      left:50%;
      top:54%;
      transform:translate(-50%,-50%) rotate(-9deg);
      border:1px solid rgba(142,197,255,.18);
      border-radius:50%;
      box-shadow:
        0 0 42px rgba(142,197,255,.08),
        inset 0 0 42px rgba(239,210,154,.04);
    }

    .dgb-globe-stage::after {
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background:
        radial-gradient(circle at 50% 36%,rgba(255,255,255,.07),transparent 16%),
        linear-gradient(180deg,transparent,rgba(2,6,16,.38));
    }

    @keyframes dgbUniverseEarthTextureDriftCorrect {
      0% { background-position:220% 50%; }
      100% { background-position:0% 50%; }
    }

    @keyframes dgbUniverseCloudDriftCorrect {
      0% { transform:translateX(8%) rotate(360deg); }
      100% { transform:translateX(-8%) rotate(0deg); }
    }

    @keyframes dgbUniverseAtmospherePulse {
      0%,100% { opacity:.62; transform:scale(1); }
      50% { opacity:.95; transform:scale(1.018); }
    }

    @media (max-width:640px) {
      [data-dgb-globe="earth"] {
        --globe-size:min(300px,76vw);
      }

      [data-dgb-globe-size="hero"] {
        --globe-size:126px;
      }

      .dgb-globe-stage {
        min-height:420px;
      }
    }

    @media (max-width:360px) {
      [data-dgb-globe="earth"] {
        --globe-size:min(270px,74vw);
      }

      [data-dgb-globe-size="hero"] {
        --globe-size:112px;
      }
    }

    @media (prefers-reduced-motion:reduce) {
      [data-dgb-globe="earth"] *,
      [data-dgb-globe="earth"] *::before,
      [data-dgb-globe="earth"] *::after {
        animation:none !important;
        transition:none !important;
      }
    }
  `;

  function installRuntimeStyle() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = runtimeCSS;
  }

  function clearGlobe(globe) {
    Array.from(globe.children).forEach((child) => {
      if (!child.hasAttribute("data-dgb-globe-preserve")) {
        child.remove();
      }
    });
  }

  function buildGlobe(globe) {
    const labelText =
      globe.getAttribute("data-dgb-globe-label") ||
      "Earth standard · tilted axis · live gauge";

    clearGlobe(globe);

    const tilt = document.createElement("div");
    tilt.className = "dgb-globe-box__tilt";

    const earth = document.createElement("div");
    earth.className = "dgb-globe-box__earth";

    const map = document.createElement("div");
    map.className = "dgb-globe-box__map";

    const clouds = document.createElement("div");
    clouds.className = "dgb-globe-box__clouds";

    const atmosphere = document.createElement("div");
    atmosphere.className = "dgb-globe-box__atmosphere";

    const label = document.createElement("div");
    label.className = "dgb-globe-box__label";
    label.textContent = labelText;

    earth.append(map, clouds);
    tilt.append(earth, atmosphere, label);
    globe.append(tilt);

    globe.dataset.dgbGlobeMounted = "true";
    globe.dataset.dgbGlobeRuntime = "assets-universe-ui";
  }

  function mountGlobes() {
    document.querySelectorAll('[data-dgb-globe="earth"]').forEach((globe) => {
      buildGlobe(globe);
    });
  }

  function bindGlobeStages() {
    document.querySelectorAll("[data-dgb-globe-stage]").forEach((stage) => {
      stage.classList.add("dgb-globe-stage");

      if (!stage.querySelector('[data-dgb-globe="earth"]')) {
        const globe = document.createElement("div");
        globe.setAttribute("data-dgb-globe", "earth");
        globe.setAttribute("data-dgb-globe-size", stage.getAttribute("data-dgb-globe-size") || "panel");
        globe.setAttribute("data-dgb-globe-theme", stage.getAttribute("data-dgb-globe-theme") || "blue");
        globe.setAttribute(
          "data-dgb-globe-label",
          stage.getAttribute("data-dgb-globe-label") || "Earth standard · tilted axis · live gauge"
        );
        stage.append(globe);
      }
    });
  }

  function markRuntime() {
    document.documentElement.dataset.dgbUniverseUi = "active";
    document.documentElement.dataset.dgbUniverseGlobe = "shared-real-earth";
    document.documentElement.dataset.dgbUniverseGeneration = DGB_UI.generation;
  }

  function mount() {
    installRuntimeStyle();
    bindGlobeStages();
    mountGlobes();
    markRuntime();
    DGB_UI.mounted = true;
  }

  function observe() {
    const observer = new MutationObserver(() => {
      bindGlobeStages();

      document.querySelectorAll('[data-dgb-globe="earth"]').forEach((globe) => {
        if (globe.dataset.dgbGlobeMounted !== "true") {
          buildGlobe(globe);
        }
      });
    });

    observer.observe(document.documentElement, {
      childList:true,
      subtree:true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        mount();
        observe();
      },
      { once:true }
    );
  } else {
    mount();
    observe();
  }
})();
