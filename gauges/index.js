/* ==========================================================================
   Gauges · Generation 2 Runtime
   TARGET=/gauges/index.js
   PURPOSE=restore real Earth globe runtime and preserve diamond route controls
   ========================================================================== */

(() => {
  "use strict";

  const STATE = {
    page: "gauges",
    generation: "second-generation-renewal",
    runtime: "real-earth-globe-restore",
    mounted: false
  };

  const STYLE_ID = "gauges-real-earth-runtime-style";
  const EARTH_TEXTURE =
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg";

  const runtimeCSS = `
    :root {
      --gauges-earth-texture:url("${EARTH_TEXTURE}");
      --gauges-earth-spin:64s;
      --gauges-diamond-spin:26s;
      --gauges-diamond-float:7s;
    }

    [data-page="gauges"] .earth,
    [data-page="gauges"] .earth::before,
    [data-page="gauges"] .earth::after,
    [data-page="gauges"] .earth-map,
    [data-page="gauges"] .earth-clouds,
    [data-page="gauges"] .earth-atmosphere {
      box-sizing:border-box;
    }

    [data-page="gauges"] .earth {
      position:absolute !important;
      inset:0 !important;
      border-radius:50% !important;
      overflow:hidden !important;
      background:#081d45 !important;
      box-shadow:
        inset -42px -18px 54px rgba(0,0,0,.58),
        inset 20px 10px 36px rgba(255,255,255,.10),
        0 0 0 1px rgba(170,198,255,.22),
        0 0 62px rgba(142,197,255,.24) !important;
    }

    [data-page="gauges"] .earth::before,
    [data-page="gauges"] .earth::after {
      content:none !important;
      display:none !important;
      background:none !important;
    }

    [data-page="gauges"] .earth-map {
      position:absolute !important;
      inset:-2% !important;
      border-radius:50% !important;
      background-image:var(--gauges-earth-texture) !important;
      background-size:220% 100% !important;
      background-position:0% 50% !important;
      background-repeat:repeat-x !important;
      filter:saturate(1.22) contrast(1.08) brightness(.92) !important;
      transform:scale(1.02) !important;
      animation:gaugesEarthTextureDrift var(--gauges-earth-spin) linear infinite !important;
      z-index:1 !important;
    }

    [data-page="gauges"] .earth-map::before {
      content:"" !important;
      position:absolute !important;
      inset:0 !important;
      border-radius:50% !important;
      background:
        repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0 1px,transparent 1px 22px),
        repeating-linear-gradient(0deg,rgba(255,255,255,.045) 0 1px,transparent 1px 24px) !important;
      mix-blend-mode:screen !important;
      opacity:.42 !important;
      pointer-events:none !important;
    }

    [data-page="gauges"] .earth-map::after {
      content:"" !important;
      position:absolute !important;
      inset:0 !important;
      border-radius:50% !important;
      background:
        radial-gradient(circle at 28% 22%,rgba(255,255,255,.28),transparent 14%),
        linear-gradient(90deg,rgba(255,255,255,.16),transparent 34%,rgba(0,0,0,.28) 76%,rgba(0,0,0,.58)) !important;
      pointer-events:none !important;
    }

    [data-page="gauges"] .earth-clouds {
      position:absolute !important;
      inset:-1% !important;
      border-radius:50% !important;
      background:
        radial-gradient(ellipse at 28% 28%,rgba(255,255,255,.22),transparent 10%),
        radial-gradient(ellipse at 54% 42%,rgba(255,255,255,.16),transparent 12%),
        radial-gradient(ellipse at 72% 64%,rgba(255,255,255,.16),transparent 14%),
        radial-gradient(ellipse at 38% 72%,rgba(255,255,255,.13),transparent 13%) !important;
      mix-blend-mode:screen !important;
      opacity:.60 !important;
      animation:gaugesCloudDrift 72s linear infinite !important;
      pointer-events:none !important;
      z-index:3 !important;
    }

    [data-page="gauges"] .earth-atmosphere {
      position:absolute !important;
      inset:-5% !important;
      border-radius:50% !important;
      border:1px solid rgba(142,197,255,.30) !important;
      background:radial-gradient(circle at 50% 50%,transparent 62%,rgba(142,197,255,.18) 74%,transparent 78%) !important;
      animation:gaugesAtmospherePulse 6s ease-in-out infinite !important;
      pointer-events:none !important;
      z-index:4 !important;
    }

    [data-page="gauges"] .earth-wrap {
      position:relative !important;
      aspect-ratio:1 / 1 !important;
      transform:rotate(-23.5deg) !important;
      filter:
        drop-shadow(0 0 34px rgba(142,197,255,.28))
        drop-shadow(0 0 74px rgba(147,239,189,.08)) !important;
    }

    [data-page="gauges"] .earth-wrap::before {
      content:"" !important;
      position:absolute !important;
      left:50% !important;
      top:-8% !important;
      width:2px !important;
      height:116% !important;
      transform:translateX(-50%) !important;
      background:linear-gradient(180deg,transparent,rgba(239,210,154,.50),transparent) !important;
      box-shadow:0 0 18px rgba(239,210,154,.24) !important;
      z-index:8 !important;
    }

    [data-page="gauges"] .hero-globe .earth-wrap {
      width:100% !important;
      height:100% !important;
    }

    [data-page="gauges"] .globe-stage .earth-wrap {
      width:min(380px,74vw) !important;
    }

    [data-page="gauges"] .route-card {
      position:relative !important;
      isolation:isolate !important;
      width:min(100%,150px) !important;
      aspect-ratio:1 / 1 !important;
      display:grid !important;
      place-items:center !important;
      padding:0 !important;
      border:0 !important;
      border-radius:0 !important;
      background:transparent !important;
      box-shadow:none !important;
      text-align:center !important;
      transform-style:preserve-3d !important;
      transition:transform 420ms ease, filter 420ms ease !important;
    }

    [data-page="gauges"] .route-card::before {
      content:"" !important;
      position:absolute !important;
      inset:10% !important;
      clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%) !important;
      border:1px solid rgba(170,198,255,.24) !important;
      background:
        radial-gradient(circle at 50% 50%,rgba(142,197,255,.22),transparent 34%),
        radial-gradient(circle at 50% 72%,rgba(239,210,154,.12),transparent 34%),
        linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.018)),
        linear-gradient(180deg,rgba(10,20,42,.96),rgba(7,14,28,.92)) !important;
      box-shadow:
        0 0 34px rgba(142,197,255,.18),
        inset 0 0 30px rgba(255,255,255,.035) !important;
      z-index:0 !important;
      animation:
        gaugesDiamondFloat var(--gauges-diamond-float) ease-in-out infinite,
        gaugesDiamondPulse 5.8s ease-in-out infinite !important;
      pointer-events:none !important;
    }

    [data-page="gauges"] .route-card::after {
      content:"" !important;
      position:absolute !important;
      inset:24% !important;
      clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%) !important;
      border:1px solid rgba(255,255,255,.08) !important;
      background:
        radial-gradient(circle at 38% 28%,rgba(255,255,255,.13),transparent 24%),
        linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,0)) !important;
      opacity:.72 !important;
      z-index:1 !important;
      animation:gaugesInnerDiamondSpin var(--gauges-diamond-spin) linear infinite !important;
      pointer-events:none !important;
    }

    @keyframes gaugesEarthTextureDrift {
      0% { background-position:0% 50%; }
      100% { background-position:220% 50%; }
    }

    @keyframes gaugesCloudDrift {
      0% { transform:translateX(-8%) rotate(0deg); }
      100% { transform:translateX(8%) rotate(360deg); }
    }

    @keyframes gaugesAtmospherePulse {
      0%,100% { opacity:.62; transform:scale(1); }
      50% { opacity:.95; transform:scale(1.018); }
    }

    @keyframes gaugesDiamondFloat {
      0%,100% { transform:translateY(0) rotate(0deg); }
      50% { transform:translateY(-5px) rotate(1.5deg); }
    }

    @keyframes gaugesDiamondPulse {
      0%,100% { opacity:.96; filter:brightness(1); }
      50% { opacity:1; filter:brightness(1.14); }
    }

    @keyframes gaugesInnerDiamondSpin {
      0% { transform:rotate(0deg) scale(.96); }
      100% { transform:rotate(360deg) scale(.96); }
    }

    @media (max-width:640px) {
      [data-page="gauges"] .globe-stage .earth-wrap {
        width:min(300px,76vw) !important;
      }

      [data-page="gauges"] .route-card {
        width:min(100%,132px) !important;
      }
    }

    @media (max-width:360px) {
      [data-page="gauges"] .globe-stage .earth-wrap {
        width:min(270px,74vw) !important;
      }

      [data-page="gauges"] .route-card {
        width:min(100%,122px) !important;
      }
    }

    @media (prefers-reduced-motion:reduce) {
      [data-page="gauges"] *,
      [data-page="gauges"] *::before,
      [data-page="gauges"] *::after {
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

  function buildEarthNode() {
    const earth = document.createElement("div");
    earth.className = "earth";

    const map = document.createElement("div");
    map.className = "earth-map";

    const clouds = document.createElement("div");
    clouds.className = "earth-clouds";

    earth.append(map, clouds);

    const atmosphere = document.createElement("div");
    atmosphere.className = "earth-atmosphere";

    return { earth, atmosphere };
  }

  function restoreGlobeShell(wrap) {
    if (!wrap) return;

    const label = wrap.querySelector(".earth-label");

    wrap.querySelectorAll(".earth, .earth-map, .earth-clouds, .earth-atmosphere").forEach((node) => {
      node.remove();
    });

    const { earth, atmosphere } = buildEarthNode();

    wrap.prepend(earth);
    earth.after(atmosphere);

    if (label) wrap.append(label);
  }

  function ensureHeroGlobe() {
    const hero = document.querySelector('[data-page="gauges"] .hero');
    if (!hero) return;

    let heroGlobe = hero.querySelector(".hero-globe");

    if (!heroGlobe) {
      heroGlobe = document.createElement("div");
      heroGlobe.className = "hero-globe";
      heroGlobe.setAttribute("aria-hidden", "true");
      hero.prepend(heroGlobe);
    }

    let wrap = heroGlobe.querySelector(".earth-wrap");

    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "earth-wrap";
      heroGlobe.append(wrap);
    }

    restoreGlobeShell(wrap);
  }

  function ensureStageGlobe() {
    const stage = document.querySelector('[data-page="gauges"] .globe-stage');
    if (!stage) return;

    let wrap = stage.querySelector(".earth-wrap");

    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "earth-wrap";
      stage.append(wrap);
    }

    let label = wrap.querySelector(".earth-label");

    if (!label) {
      label = document.createElement("div");
      label.className = "earth-label";
      label.textContent = "Earth standard · tilted axis · live gauge";
      wrap.append(label);
    }

    restoreGlobeShell(wrap);
  }

  function removeFakeBlobGlobeResidue() {
    document
      .querySelectorAll('[data-page="gauges"] .gauge-orb, [data-page="gauges"] .fake-earth, [data-page="gauges"] .blob-earth')
      .forEach((node) => node.remove());
  }

  function markDiamondRoutes() {
    document.querySelectorAll('[data-page="gauges"] .route-card').forEach((card, index) => {
      card.dataset.gaugeDiamond = "active";
      card.style.setProperty("--gauges-diamond-spin", `${24 + index * 1.2}s`);
      card.style.setProperty("--gauges-diamond-float", `${6.4 + (index % 4) * 0.5}s`);
    });
  }

  function mount() {
    installRuntimeStyle();
    removeFakeBlobGlobeResidue();
    ensureHeroGlobe();
    ensureStageGlobe();
    markDiamondRoutes();

    document.documentElement.dataset.gaugesRuntime = STATE.runtime;
    document.documentElement.dataset.gaugesGlobe = "real-earth-texture";
    document.documentElement.dataset.gaugesGeneration = STATE.generation;

    STATE.mounted = true;
  }

  function guardedMount() {
    mount();

    const root = document.querySelector('[data-page="gauges"]');
    if (!root) return;

    const observer = new MutationObserver(() => {
      if (!STATE.mounted) return;
      removeFakeBlobGlobeResidue();
      ensureHeroGlobe();
      ensureStageGlobe();
      markDiamondRoutes();
    });

    observer.observe(root, {
      childList:true,
      subtree:true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", guardedMount, { once:true });
  } else {
    guardedMount();
  }
})();
