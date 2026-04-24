(() => {
  "use strict";

  const STYLE_ID = "dgb-root-shared-earth-globe-consumer-v1";
  const SHARED_GLOBE_SRC = "/shared/earth_globe.js";

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
        width:230px;
        height:230px;
        border-radius:50%;
        display:grid;
        place-items:center;
        overflow:visible;
        color:transparent;
        font-size:0;
        background:transparent;
      }

      .home-core > .dgb-earth-globe {
        width:220px;
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
          width:212px;
          height:212px;
        }

        .home-core > .dgb-earth-globe {
          width:204px;
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

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (window.DGBEarthGlobe) {
        resolve();
        return;
      }

      const existing = document.querySelector(`script[data-dgb-loader="${src}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load " + src)), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src + "?v=shared-earth-globe-v1";
      script.defer = true;
      script.dataset.dgbLoader = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load " + src));
      document.head.appendChild(script);
    });
  }

  async function mountSharedEarthGlobe(root) {
    const core = root.querySelector(".home-core");
    if (!core) return;

    core.setAttribute("role", "img");
    core.setAttribute("aria-label", "Planet Earth");
    core.setAttribute("data-home-earth-core", "true");
    core.setAttribute("data-home-demo-universe-core", "shared-earth-globe");

    try {
      await loadScript(SHARED_GLOBE_SRC);

      if (!window.DGBEarthGlobe) {
        core.setAttribute("data-home-earth-load", "missing-shared-source");
        return;
      }

      window.DGBEarthGlobe.mount(core, {
        mode: "hero",
        ariaLabel: "Planet Earth with Africa and seven-continent read"
      });

      core.setAttribute("data-home-earth-load", "mounted");
    } catch (error) {
      core.setAttribute("data-home-earth-load", "failed");
      core.setAttribute("data-home-earth-error", String(error && error.message ? error.message : error));
    }
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
    root.setAttribute("data-home-shared-globe-source", SHARED_GLOBE_SRC);
  }

  function mount() {
    injectStyle();

    const root = document.getElementById("homePage");
    if (!root) return;

    markRootProof(root);
    mountSharedEarthGlobe(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
