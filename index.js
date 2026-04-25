(() => {
  "use strict";

  const STYLE_ID = "dgb-root-home-axis-spin-earth-v1";

  const EARTH_TEXTURE_URL =
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --bg:#020610;
        --panel:rgba(7,14,28,.92);
        --line:rgba(170,198,255,.18);
        --line-strong:rgba(224,238,255,.34);
        --text:#eef4ff;
        --muted:#aab8d8;
        --soft:#d7e2ff;
        --gold:#efd29a;
        --blue:#8ec5ff;
        --green:#92e7ba;
        --teal:#66f0d1;
        --shadow:0 24px 80px rgba(0,0,0,.50);
        --max:1120px;
      }

      * {
        box-sizing:border-box;
      }

      html {
        min-height:100%;
        scroll-behavior:smooth;
      }

      body {
        min-height:100%;
        margin:0;
        color:var(--text);
        font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        background:
          radial-gradient(circle at 50% 8%,rgba(114,151,255,.18),transparent 24%),
          radial-gradient(circle at 18% 28%,rgba(239,210,154,.10),transparent 28%),
          linear-gradient(180deg,#020610 0%,#071225 52%,#020610 100%);
        overflow-x:hidden;
      }

      body::before {
        content:"";
        position:fixed;
        inset:0;
        pointer-events:none;
        opacity:.20;
        background:
          linear-gradient(90deg,rgba(164,188,255,.07) 1px,transparent 1px),
          linear-gradient(180deg,rgba(164,188,255,.04) 1px,transparent 1px);
        background-size:52px 52px;
        mask-image:radial-gradient(circle at 50% 32%,black,transparent 78%);
      }

      a {
        color:inherit;
        text-decoration:none;
      }

      .home-page {
        width:min(100vw - 20px,var(--max));
        margin:0 auto;
        padding:14px 0 30px;
        position:relative;
        z-index:1;
      }

      .home-topbar,
      .home-hero,
      .home-section,
      .home-attraction-window,
      .doll,
      .support-grid a {
        border:1px solid var(--line);
        background:
          radial-gradient(circle at 50% 0%,rgba(142,197,255,.10),transparent 42%),
          linear-gradient(180deg,var(--panel),rgba(3,9,20,.92));
        box-shadow:var(--shadow);
      }

      .home-topbar {
        min-height:76px;
        margin-bottom:14px;
        padding:14px;
        border-radius:28px;
        display:grid;
        gap:12px;
      }

      .home-brand {
        display:flex;
        align-items:center;
        gap:12px;
      }

      .home-mark {
        width:48px;
        height:48px;
        border-radius:16px;
        display:grid;
        place-items:center;
        border:1px solid var(--line);
        background:
          radial-gradient(circle at 50% 28%,rgba(239,210,154,.24),transparent 42%),
          linear-gradient(180deg,rgba(26,43,78,.9),rgba(10,18,32,.97));
        font-weight:900;
        letter-spacing:.08em;
      }

      .home-kicker {
        display:block;
        margin:0 0 4px;
        color:#c8d7ff;
        font-size:.72rem;
        text-transform:uppercase;
        letter-spacing:.16em;
      }

      .home-title {
        display:block;
        margin:0;
        font-weight:850;
        font-size:1.05rem;
      }

      .home-nav {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:8px;
      }

      .home-nav a,
      .home-button,
      .doll-body a {
        min-height:44px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:0 14px;
        border:1px solid var(--line);
        border-radius:999px;
        background:rgba(255,255,255,.035);
        color:var(--soft);
        font-weight:850;
        text-align:center;
      }

      .home-nav a:focus-visible,
      .home-button:focus-visible,
      .doll summary:focus-visible,
      .doll-body a:focus-visible,
      .support-grid a:focus-visible {
        outline:2px solid rgba(239,210,154,.62);
        outline-offset:3px;
      }

      .home-hero {
        padding:18px;
        margin-bottom:14px;
        border-radius:32px;
        display:grid;
        gap:16px;
        overflow:hidden;
      }

      .home-pill {
        display:inline-flex;
        align-items:center;
        gap:10px;
        padding:8px 12px;
        border-radius:999px;
        border:1px solid var(--line);
        background:rgba(255,255,255,.035);
        color:#d8e3ff;
        text-transform:uppercase;
        letter-spacing:.14em;
        font-size:.70rem;
        margin-bottom:12px;
      }

      .home-pill::before {
        content:"";
        width:9px;
        height:9px;
        border-radius:2px;
        transform:rotate(45deg);
        background:var(--gold);
        box-shadow:0 0 18px rgba(239,210,154,.50);
      }

      h1 {
        margin:0;
        max-width:11ch;
        font-size:clamp(2.5rem,12vw,5.4rem);
        line-height:.9;
        letter-spacing:-.07em;
        color:#fff;
      }

      h2 {
        margin:12px 0;
        color:var(--gold);
        font-size:clamp(1.55rem,7vw,2.9rem);
        line-height:.98;
        letter-spacing:-.04em;
        font-weight:900;
      }

      .home-section h2 {
        margin:0 0 10px;
        color:#fff;
        font-size:clamp(1.65rem,8vw,2.7rem);
        line-height:1;
      }

      p {
        margin:0;
        color:var(--muted);
        line-height:1.62;
        font-size:1rem;
      }

      .home-copy p {
        margin-top:14px;
        max-width:68ch;
        font-size:clamp(1rem,1.45vw,1.14rem);
      }

      .home-actions {
        display:grid;
        gap:8px;
        margin-top:18px;
      }

      .home-button.primary {
        border-color:rgba(239,210,154,.38);
        background:
          linear-gradient(180deg,rgba(239,210,154,.24),rgba(239,210,154,.07)),
          rgba(255,255,255,.035);
        color:#fff8ea;
      }

      .home-attraction-window {
        border-radius:32px;
        padding:clamp(14px,3vw,22px);
      }

      .home-door {
        min-height:460px;
        position:relative;
        border-radius:30px;
        border:1px solid rgba(170,198,255,.18);
        background:
          radial-gradient(circle at 50% 42%,rgba(102,240,209,.10),transparent 18%),
          radial-gradient(circle at 50% 48%,rgba(239,210,154,.16),transparent 25%),
          radial-gradient(circle at 50% 56%,rgba(142,197,255,.20),transparent 38%),
          linear-gradient(180deg,rgba(7,17,36,.98),rgba(2,7,16,.99));
        overflow:hidden;
        display:grid;
        place-items:center;
        isolation:isolate;
      }

      .home-door::before {
        content:"";
        position:absolute;
        inset:8%;
        border-radius:999px 999px 34px 34px;
        border:1px solid rgba(210,223,255,.22);
        box-shadow:
          inset 0 0 52px rgba(126,164,255,.16),
          0 0 40px rgba(102,240,209,.06);
        pointer-events:none;
      }

      .home-door::after {
        content:"";
        position:absolute;
        left:50%;
        top:69%;
        width:230px;
        height:54px;
        transform:translateX(-50%);
        border-radius:50%;
        background:
          radial-gradient(ellipse at 50% 50%,rgba(102,240,209,.28),transparent 42%),
          radial-gradient(ellipse at 50% 50%,rgba(239,210,154,.20),transparent 64%);
        border:1px solid rgba(239,210,154,.16);
        box-shadow:
          0 0 34px rgba(102,240,209,.18),
          inset 0 0 20px rgba(142,197,255,.18);
        z-index:1;
        pointer-events:none;
      }

      .home-orbit {
        position:absolute;
        width:82%;
        height:82%;
        border-radius:50%;
        border:1px solid rgba(239,210,154,.36);
        opacity:.88;
        filter:
          drop-shadow(0 0 16px rgba(239,210,154,.20))
          drop-shadow(0 0 24px rgba(142,197,255,.10));
        z-index:4;
        pointer-events:none;
      }

      .home-orbit.one {
        transform:rotate(43deg) scaleX(.35);
        animation:orbitOne 18s linear infinite;
      }

      .home-orbit.two {
        transform:rotate(-43deg) scaleX(.35);
        border-color:rgba(142,197,255,.42);
        animation:orbitTwo 21s linear infinite reverse;
      }

      .home-core {
        position:relative;
        z-index:5;
        width:232px;
        height:232px;
        border-radius:50%;
        display:grid;
        place-items:center;
        overflow:visible;
        color:transparent;
        font-size:0;
        background:transparent;
      }

      .earth-home-globe {
        position:relative;
        z-index:3;
        width:220px;
        height:220px;
        border-radius:50%;
        overflow:visible;
        isolation:isolate;
        transform:rotate(-23.5deg);
        transform-origin:50% 50%;
        filter:drop-shadow(0 0 28px rgba(120,205,255,.24));
      }

      .earth-home-globe__axis {
        position:absolute;
        left:50%;
        top:50%;
        z-index:1;
        width:2px;
        height:124%;
        transform:translate(-50%,-50%);
        border-radius:999px;
        background:linear-gradient(
          180deg,
          transparent,
          rgba(240,215,156,.22),
          rgba(184,228,255,.58),
          rgba(240,215,156,.22),
          transparent
        );
        box-shadow:0 0 20px rgba(184,228,255,.24);
        pointer-events:none;
      }

      .earth-home-globe__sphere {
        position:absolute;
        inset:0;
        z-index:3;
        border-radius:50%;
        overflow:hidden;
        isolation:isolate;
        border:1px solid rgba(218,239,255,.84);
        background:
          radial-gradient(circle at 50% 50%,#0b63b5 0%,#073f86 48%,#031b42 100%);
        box-shadow:
          inset -50px -40px 70px rgba(0,0,0,.66),
          inset 22px 17px 38px rgba(255,255,255,.24),
          0 0 60px rgba(142,197,255,.56),
          0 0 150px rgba(239,210,154,.20);
      }

      .earth-home-globe__texture {
        position:absolute;
        inset:-1.5%;
        z-index:2;
        border-radius:50%;
        background-image:var(--earth-texture-url);
        background-repeat:repeat-x;
        background-size:245% 124%;
        background-position:58% 46%;
        filter:saturate(1.16) contrast(1.14) brightness(.96);
        transform:scale(1.08);
        animation:earthHomeTextureSpin 44s linear infinite;
      }

      .earth-home-globe__texture::before {
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        pointer-events:none;
        background:
          radial-gradient(circle at 31% 22%,rgba(255,255,255,.30),transparent 13%),
          radial-gradient(circle at 42% 36%,rgba(255,255,255,.13),transparent 24%),
          linear-gradient(90deg,rgba(255,255,255,.10),transparent 42%,rgba(0,0,0,.34) 100%);
        mix-blend-mode:screen;
      }

      .earth-home-globe__texture::after {
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        pointer-events:none;
        background:
          radial-gradient(circle at 78% 72%,rgba(0,0,0,.48),transparent 40%),
          radial-gradient(circle at 96% 50%,rgba(0,0,0,.48),transparent 28%),
          radial-gradient(circle at 3% 50%,rgba(255,255,255,.08),transparent 24%),
          linear-gradient(105deg,transparent 0 57%,rgba(0,0,0,.28) 76%,rgba(0,0,0,.54) 100%);
      }

      .earth-home-globe__projection-mask {
        position:absolute;
        inset:0;
        z-index:3;
        border-radius:50%;
        pointer-events:none;
        background:
          radial-gradient(circle at 50% 50%,transparent 0 61%,rgba(0,0,0,.16) 72%,rgba(0,0,0,.54) 100%),
          linear-gradient(90deg,rgba(0,0,0,.10),transparent 20%,transparent 78%,rgba(0,0,0,.35));
        mix-blend-mode:multiply;
      }

      .earth-home-globe__cloud-layer {
        position:absolute;
        inset:-2%;
        z-index:4;
        border-radius:50%;
        pointer-events:none;
        filter:blur(1.8px);
        opacity:.62;
        background:
          radial-gradient(ellipse at 30% 30%,rgba(255,255,255,.34) 0 8%,transparent 18%),
          radial-gradient(ellipse at 58% 25%,rgba(255,255,255,.26) 0 6%,transparent 18%),
          radial-gradient(ellipse at 69% 63%,rgba(255,255,255,.24) 0 7%,transparent 21%),
          radial-gradient(ellipse at 36% 70%,rgba(255,255,255,.18) 0 8%,transparent 21%),
          repeating-linear-gradient(18deg,transparent 0 25px,rgba(255,255,255,.10) 26px 30px,transparent 31px 60px);
        mask-image:radial-gradient(circle at 50% 50%,black 0 66%,rgba(0,0,0,.55) 78%,transparent 100%);
        animation:earthHomeCloudDrift 68s linear infinite;
      }

      .earth-home-globe__cloud-layer::before {
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        background:
          linear-gradient(15deg,transparent 0 24%,rgba(255,255,255,.16) 28%,transparent 36%),
          linear-gradient(-12deg,transparent 0 46%,rgba(255,255,255,.13) 50%,transparent 59%),
          linear-gradient(22deg,transparent 0 66%,rgba(255,255,255,.12) 70%,transparent 78%);
        opacity:.84;
      }

      .earth-home-globe__grid {
        position:absolute;
        inset:0;
        z-index:5;
        width:100%;
        height:100%;
        display:block;
        pointer-events:none;
        opacity:.38;
      }

      .earth-home-globe__grid-line {
        fill:none;
        stroke:rgba(255,255,255,.14);
        stroke-width:.58;
      }

      .earth-home-globe__rim {
        position:absolute;
        inset:-1px;
        z-index:8;
        border-radius:50%;
        pointer-events:none;
        box-shadow:
          inset 0 0 18px rgba(255,255,255,.20),
          inset 0 0 48px rgba(100,180,255,.18),
          0 0 26px rgba(120,205,255,.48),
          0 0 66px rgba(120,205,255,.22);
      }

      .earth-home-globe__atmosphere {
        position:absolute;
        inset:-4%;
        z-index:1;
        border-radius:50%;
        pointer-events:none;
        background:
          radial-gradient(circle at 50% 50%,rgba(120,205,255,.18),transparent 63%);
        filter:blur(10px);
      }

      .earth-home-globe__axis-cap {
        position:absolute;
        left:50%;
        width:8px;
        height:8px;
        border-radius:50%;
        transform:translateX(-50%);
        z-index:9;
        background:rgba(240,215,156,.78);
        box-shadow:0 0 16px rgba(240,215,156,.40);
        pointer-events:none;
      }

      .earth-home-globe__axis-cap--north {
        top:-5px;
      }

      .earth-home-globe__axis-cap--south {
        bottom:-5px;
      }

      .home-caption {
        position:absolute;
        left:50%;
        bottom:24px;
        transform:translateX(-50%);
        z-index:9;
        width:min(92%,620px);
        padding:14px 16px;
        border-radius:999px;
        border:1px solid rgba(164,188,255,.24);
        background:rgba(5,12,26,.84);
        text-align:center;
        color:#dce7ff;
        text-transform:uppercase;
        letter-spacing:.10em;
        font-size:.68rem;
        line-height:1.45;
        backdrop-filter:blur(10px);
      }

      .home-caption strong {
        display:block;
        color:#fff;
        margin-bottom:4px;
      }

      .home-section {
        margin-top:14px;
        border-radius:30px;
        padding:18px;
      }

      .doll-stack {
        display:grid;
        gap:12px;
        margin-top:16px;
      }

      .doll {
        border-radius:24px;
        overflow:hidden;
      }

      .doll summary {
        list-style:none;
        cursor:pointer;
        padding:16px;
        display:grid;
        grid-template-columns:auto 1fr;
        gap:12px;
        align-items:center;
      }

      .doll summary::-webkit-details-marker {
        display:none;
      }

      .number {
        width:42px;
        height:42px;
        border-radius:14px;
        display:grid;
        place-items:center;
        color:var(--gold);
        background:rgba(239,210,154,.08);
        border:1px solid rgba(239,210,154,.18);
        font-weight:950;
      }

      .doll small,
      .support-grid small {
        display:block;
        color:#90a3ce;
        text-transform:uppercase;
        letter-spacing:.12em;
        margin-bottom:6px;
        font-weight:850;
        font-size:.68rem;
      }

      .doll strong,
      .support-grid strong {
        display:block;
        color:#fff;
        font-size:1.12rem;
        line-height:1.1;
      }

      .doll-body {
        padding:0 16px 16px 70px;
      }

      .doll-body a {
        margin-top:12px;
        width:fit-content;
        min-width:132px;
        color:#fff8ea;
        border-color:rgba(239,210,154,.28);
        background:rgba(239,210,154,.08);
      }

      .support-grid {
        display:grid;
        gap:10px;
        margin-top:16px;
      }

      .support-grid a {
        border-radius:22px;
        padding:16px;
        min-height:116px;
      }

      .home-footer {
        display:grid;
        gap:12px;
        margin-top:14px;
        padding:16px 4px 0;
        color:#9db0d4;
        font-size:.86rem;
      }

      .home-footer span:last-child {
        display:flex;
        flex-wrap:wrap;
        gap:10px;
      }

      .home-footer a {
        color:#d6e2ff;
      }

      @keyframes orbitOne {
        from { transform:rotate(43deg) scaleX(.35); }
        to { transform:rotate(403deg) scaleX(.35); }
      }

      @keyframes orbitTwo {
        from { transform:rotate(-43deg) scaleX(.35); }
        to { transform:rotate(317deg) scaleX(.35); }
      }

      @keyframes earthHomeTextureSpin {
        from { background-position:58% 46%; }
        to { background-position:-187% 46%; }
      }

      @keyframes earthHomeCloudDrift {
        from { transform:translateX(0) scale(1.02); }
        to { transform:translateX(-18%) scale(1.02); }
      }

      @media (min-width:820px) {
        .home-topbar {
          grid-template-columns:1fr auto;
          align-items:center;
        }

        .home-nav {
          grid-template-columns:repeat(5,auto);
        }

        .home-hero {
          grid-template-columns:minmax(0,1fr) minmax(320px,.78fr);
          align-items:center;
        }

        .home-actions {
          grid-template-columns:repeat(3,auto);
          justify-content:start;
        }

        .support-grid {
          grid-template-columns:repeat(4,minmax(0,1fr));
        }

        .home-footer {
          grid-template-columns:1fr auto;
          align-items:center;
        }
      }

      @media (max-width:520px) {
        .home-page {
          width:min(100vw - 12px,var(--max));
          padding-top:10px;
        }

        .home-topbar,
        .home-hero,
        .home-section {
          padding:14px;
          border-radius:24px;
        }

        .home-nav {
          grid-template-columns:1fr;
        }

        .home-door {
          min-height:430px;
        }

        .home-core {
          width:218px;
          height:218px;
        }

        .earth-home-globe {
          width:204px;
          height:204px;
        }

        .home-caption {
          font-size:.58rem;
        }

        .doll-body {
          padding-left:16px;
        }
      }

      @media (prefers-reduced-motion:reduce) {
        * {
          animation:none !important;
          scroll-behavior:auto !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createSvgElement(className, viewBox = "0 0 240 240") {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");

    svg.setAttribute("class", className);
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    return svg;
  }

  function createGridSvg() {
    const svg = createSvgElement("earth-home-globe__grid");

    svg.innerHTML = `
      <defs>
        <clipPath id="earthHomeAxisSpinGridClipDgbV1">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>

      <g clip-path="url(#earthHomeAxisSpinGridClipDgbV1)">
        <path class="earth-home-globe__grid-line" d="M12 120 H228"></path>
        <path class="earth-home-globe__grid-line" d="M120 12 V228"></path>
        <ellipse class="earth-home-globe__grid-line" cx="120" cy="120" rx="108" ry="34"></ellipse>
        <ellipse class="earth-home-globe__grid-line" cx="120" cy="120" rx="108" ry="66"></ellipse>
        <ellipse class="earth-home-globe__grid-line" cx="120" cy="120" rx="82" ry="108"></ellipse>
        <ellipse class="earth-home-globe__grid-line" cx="120" cy="120" rx="45" ry="108"></ellipse>
        <ellipse class="earth-home-globe__grid-line" cx="120" cy="120" rx="18" ry="108"></ellipse>
      </g>
    `;

    return svg;
  }

  function createHomeEarthGlobe() {
    const globe = document.createElement("div");
    globe.className = "earth-home-globe";
    globe.setAttribute("role", "img");
    globe.setAttribute("aria-label", "Planet Earth Demo Universe on a tilted axis with natural spin");
    globe.setAttribute("data-home-earth-globe", "axis-spin-pass");
    globe.setAttribute("data-earth-texture-source", "NASA Blue Marble");
    globe.setAttribute("data-axis-degrees", "23.5");
    globe.setAttribute("data-spin-system", "texture-drift-natural");

    globe.style.setProperty("--earth-texture-url", `url("${EARTH_TEXTURE_URL}")`);

    const axis = document.createElement("span");
    axis.className = "earth-home-globe__axis";
    axis.setAttribute("aria-hidden", "true");

    const atmosphere = document.createElement("span");
    atmosphere.className = "earth-home-globe__atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");

    const sphere = document.createElement("span");
    sphere.className = "earth-home-globe__sphere";
    sphere.setAttribute("aria-hidden", "true");

    const texture = document.createElement("span");
    texture.className = "earth-home-globe__texture";
    texture.setAttribute("aria-hidden", "true");

    const projectionMask = document.createElement("span");
    projectionMask.className = "earth-home-globe__projection-mask";
    projectionMask.setAttribute("aria-hidden", "true");

    const cloudLayer = document.createElement("span");
    cloudLayer.className = "earth-home-globe__cloud-layer";
    cloudLayer.setAttribute("aria-hidden", "true");

    const rim = document.createElement("span");
    rim.className = "earth-home-globe__rim";
    rim.setAttribute("aria-hidden", "true");

    const northCap = document.createElement("span");
    northCap.className = "earth-home-globe__axis-cap earth-home-globe__axis-cap--north";
    northCap.setAttribute("aria-hidden", "true");

    const southCap = document.createElement("span");
    southCap.className = "earth-home-globe__axis-cap earth-home-globe__axis-cap--south";
    southCap.setAttribute("aria-hidden", "true");

    sphere.append(
      texture,
      projectionMask,
      createGridSvg(),
      cloudLayer,
      rim
    );

    globe.append(
      axis,
      atmosphere,
      sphere,
      northCap,
      southCap
    );

    return globe;
  }

  function mountHomeEarthGlobe(root) {
    const core = root.querySelector(".home-core");
    if (!core) return;

    core.replaceChildren(createHomeEarthGlobe());

    core.setAttribute("role", "img");
    core.setAttribute("aria-label", "Planet Earth Demo Universe");
    core.setAttribute("data-home-earth-core", "true");
    core.setAttribute("data-home-demo-universe-core", "axis-spin-earth");
  }

  function markRootProof(root) {
    root.setAttribute("data-home-state", "second-generation-renewal");
    root.setAttribute("data-home-priority", "nine-summits-earth-demo-universe-upper-room");
    root.setAttribute("data-home-js-owner", "index.js");
    root.setAttribute("data-home-runtime", "mounted");
    root.setAttribute("data-home-demo-universe-runtime", "mounted");
    root.setAttribute("data-home-root-proof", "true");
    root.setAttribute("data-home-not-gauges", "true");
    root.setAttribute("data-home-earth-read", "true");
    root.setAttribute("data-home-earth-standard", "axis-spin-projection-realism");
    root.setAttribute("data-root-script-version", "home-axis-spin-earth-v1");
  }

  function mount() {
    injectStyle();

    const root = document.getElementById("homePage");
    if (!root) return;

    markRootProof(root);
    mountHomeEarthGlobe(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
