(() => {
  "use strict";

  const STYLE_ID = "dgb-root-earth-read-v6-force-visible-change";

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
        width:222px;
        height:222px;
        border-radius:50%;
        display:grid;
        place-items:center;
        overflow:hidden;
        border:1px solid rgba(226,240,255,.78);
        background:#0b58a8;
        box-shadow:
          inset -40px -34px 58px rgba(0,0,0,.58),
          inset 22px 16px 34px rgba(255,255,255,.25),
          0 0 52px rgba(142,197,255,.54),
          0 0 142px rgba(239,210,154,.24);
        animation:demoUniverseFloat 7s ease-in-out infinite;
      }

      .home-core::before {
        content:"";
        position:absolute;
        inset:0;
        z-index:4;
        border-radius:50%;
        background:
          radial-gradient(circle at 31% 23%,rgba(255,255,255,.68),transparent 10%),
          linear-gradient(90deg,rgba(255,255,255,.16),transparent 38%,rgba(0,0,0,.34) 100%);
        pointer-events:none;
        mix-blend-mode:screen;
      }

      .home-core::after {
        content:"";
        position:absolute;
        inset:-1px;
        z-index:5;
        border-radius:50%;
        background:
          radial-gradient(circle at 35% 24%,rgba(255,255,255,.34),transparent 16%),
          radial-gradient(circle at 78% 74%,rgba(0,0,0,.32),transparent 36%);
        pointer-events:none;
      }

      .earth-svg {
        position:absolute;
        inset:0;
        z-index:3;
        width:100%;
        height:100%;
        display:block;
      }

      .earth-ocean {
        fill:#0b63b5;
      }

      .earth-ocean-deep {
        fill:#06386f;
        opacity:.44;
      }

      .earth-land {
        fill:#3fb56b;
        stroke:rgba(255,255,255,.18);
        stroke-width:.8;
      }

      .earth-land-warm {
        fill:#b9a76a;
        stroke:rgba(255,255,255,.16);
        stroke-width:.7;
      }

      .earth-cloud {
        fill:rgba(255,255,255,.72);
      }

      .earth-grid {
        fill:none;
        stroke:rgba(255,255,255,.18);
        stroke-width:.7;
      }

      .earth-atmosphere {
        fill:none;
        stroke:rgba(181,226,255,.72);
        stroke-width:2.2;
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

      @keyframes demoUniverseFloat {
        0%,100% { transform:translateY(0) scale(.98); }
        50% { transform:translateY(-6px) scale(1.03); }
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
          width:196px;
          height:196px;
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

  function buildEarthSvg() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");

    svg.setAttribute("class", "earth-svg");
    svg.setAttribute("viewBox", "0 0 240 240");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    svg.innerHTML = `
      <defs>
        <clipPath id="earthClipDgbV6">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>

      <circle class="earth-ocean" cx="120" cy="120" r="108"></circle>
      <circle class="earth-ocean-deep" cx="146" cy="144" r="90"></circle>

      <g clip-path="url(#earthClipDgbV6)">
        <path class="earth-grid" d="M12 120 H228"></path>
        <path class="earth-grid" d="M120 12 V228"></path>
        <ellipse class="earth-grid" cx="120" cy="120" rx="74" ry="108"></ellipse>
        <ellipse class="earth-grid" cx="120" cy="120" rx="108" ry="44"></ellipse>
        <ellipse class="earth-grid" cx="120" cy="120" rx="108" ry="76"></ellipse>

        <path class="earth-land" d="M39 58 C54 35 91 30 108 49 C119 62 107 78 88 79 C75 80 72 97 55 95 C35 92 25 76 39 58 Z"></path>
        <path class="earth-land" d="M78 100 C97 96 113 113 106 137 C101 154 92 177 75 190 C66 174 55 157 57 137 C59 119 63 106 78 100 Z"></path>
        <path class="earth-land-warm" d="M127 43 C151 27 185 35 202 58 C217 80 201 102 177 96 C158 91 155 73 134 71 C119 70 116 51 127 43 Z"></path>
        <path class="earth-land-warm" d="M137 103 C160 92 198 107 207 134 C217 165 185 185 157 176 C136 169 121 149 124 127 C125 115 128 108 137 103 Z"></path>
        <path class="earth-land" d="M176 187 C194 179 214 187 226 204 C206 222 177 222 161 205 C163 196 167 191 176 187 Z"></path>
        <path class="earth-land" d="M20 148 C34 139 49 144 54 158 C61 177 39 185 25 172 C17 164 14 154 20 148 Z"></path>

        <path class="earth-cloud" d="M25 82 C49 69 77 71 100 84 C73 90 48 91 25 82 Z"></path>
        <path class="earth-cloud" d="M93 35 C125 24 162 30 190 47 C157 52 121 51 93 35 Z"></path>
        <path class="earth-cloud" d="M103 158 C136 146 174 153 205 173 C166 177 132 176 103 158 Z"></path>
        <path class="earth-cloud" d="M39 125 C68 116 91 121 112 136 C82 140 58 139 39 125 Z"></path>
      </g>

      <circle class="earth-atmosphere" cx="120" cy="120" r="108"></circle>
    `;

    return svg;
  }

  function normalizeEarthCore(root) {
    const core = root.querySelector(".home-core");
    if (!core) return;

    core.replaceChildren(buildEarthSvg());

    core.setAttribute("role", "img");
    core.setAttribute("aria-label", "Planet Earth");
    core.setAttribute("data-home-earth-core", "true");
    core.setAttribute("data-home-demo-universe-core", "earth-read-v6");
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
    root.setAttribute("data-home-visual-change", "earth-svg-v6-force-visible");
  }

  function mount() {
    injectStyle();

    const root = document.getElementById("homePage");
    if (!root) return;

    markRootProof(root);
    normalizeEarthCore(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
