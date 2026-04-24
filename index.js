(() => {
  "use strict";

  const STYLE_ID = "dgb-second-generation-root-proof-v2-demo-universe-upgrade";

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
        --violet:#b9a8ff;
        --shadow:0 24px 80px rgba(0,0,0,.50);
        --max:1120px;
      }

      * { box-sizing:border-box; }

      html { min-height:100%; scroll-behavior:smooth; }

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

      a { color:inherit; text-decoration:none; }

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
        min-height:420px;
        position:relative;
        border-radius:30px;
        border:1px solid rgba(170,198,255,.18);
        background:
          radial-gradient(circle at 50% 45%,rgba(239,210,154,.14),transparent 24%),
          radial-gradient(circle at 50% 54%,rgba(142,197,255,.15),transparent 34%),
          linear-gradient(180deg,rgba(7,17,36,.98),rgba(2,7,16,.99));
        overflow:hidden;
        display:grid;
        place-items:center;
        isolation:isolate;
      }

      .home-door::before {
        content:"";
        position:absolute;
        inset:10%;
        border-radius:999px 999px 32px 32px;
        border:1px solid rgba(210,223,255,.18);
        box-shadow:inset 0 0 42px rgba(126,164,255,.12);
      }

      .home-orbit {
        position:absolute;
        width:68%;
        height:68%;
        border-radius:50%;
        border:1px solid rgba(239,210,154,.26);
        opacity:.78;
        filter:drop-shadow(0 0 16px rgba(239,210,154,.12));
      }

      .home-orbit.one {
        transform:rotate(43deg) scaleX(.38);
        animation:orbitOne 18s linear infinite;
      }

      .home-orbit.two {
        transform:rotate(-43deg) scaleX(.38);
        border-color:rgba(142,197,255,.28);
        animation:orbitTwo 21s linear infinite reverse;
      }

      .home-core {
        position:relative;
        z-index:3;
        width:172px;
        height:172px;
        border-radius:50%;
        display:block;
        overflow:hidden;
        border:1px solid rgba(226,240,255,.56);
        color:transparent;
        font-size:0;
        background:
          radial-gradient(circle at 33% 23%,rgba(255,255,255,.74),transparent 9%),
          radial-gradient(circle at 42% 35%,rgba(184,220,255,.32),transparent 29%),
          radial-gradient(circle at 61% 66%,rgba(239,210,154,.18),transparent 31%),
          radial-gradient(circle at 50% 52%,rgba(102,240,209,.12),transparent 43%),
          linear-gradient(135deg,#0f5c9d 0%,#0a2d6d 45%,#040b22 100%);
        box-shadow:
          inset -30px -28px 44px rgba(0,0,0,.56),
          inset 16px 12px 28px rgba(255,255,255,.22),
          0 0 44px rgba(142,197,255,.44),
          0 0 124px rgba(239,210,154,.22);
        animation:demoUniverseFloat 7s ease-in-out infinite;
      }

      .demo-globe-shell {
        position:absolute;
        inset:0;
        border-radius:inherit;
        background:
          radial-gradient(circle at 50% 50%,rgba(255,255,255,.10),transparent 30%),
          radial-gradient(circle at 53% 52%,transparent 0 39%,rgba(255,255,255,.10) 40%,transparent 42%),
          linear-gradient(90deg,rgba(255,255,255,.18),transparent 38%,rgba(0,0,0,.36) 100%);
        pointer-events:none;
      }

      .demo-globe-field {
        position:absolute;
        border-radius:999px;
        filter:blur(.15px) drop-shadow(0 1px 2px rgba(0,0,0,.34));
        opacity:.91;
        pointer-events:none;
      }

      .field-a {
        left:18%;
        top:27%;
        width:38%;
        height:20%;
        background:linear-gradient(135deg,var(--green),rgba(102,240,209,.44));
        transform:rotate(-13deg);
      }

      .field-b {
        right:17%;
        top:30%;
        width:36%;
        height:24%;
        background:linear-gradient(135deg,var(--gold),rgba(239,210,154,.42));
        transform:rotate(22deg);
      }

      .field-c {
        left:34%;
        bottom:22%;
        width:25%;
        height:36%;
        background:linear-gradient(135deg,#72e0a8,rgba(146,231,186,.38));
        transform:rotate(7deg);
      }

      .field-d {
        right:20%;
        bottom:20%;
        width:34%;
        height:24%;
        background:linear-gradient(135deg,rgba(239,210,154,.84),rgba(239,210,154,.36));
        transform:rotate(-8deg);
      }

      .demo-globe-ring,
      .demo-globe-axis,
      .demo-globe-grid,
      .demo-globe-core {
        position:absolute;
        pointer-events:none;
      }

      .demo-globe-ring {
        inset:14%;
        border-radius:50%;
        border:1px solid rgba(255,255,255,.20);
        box-shadow:
          inset 0 0 22px rgba(142,197,255,.18),
          0 0 20px rgba(239,210,154,.12);
      }

      .demo-globe-axis {
        left:50%;
        top:50%;
        width:78%;
        height:78%;
        border-radius:50%;
        border:1px solid rgba(102,240,209,.18);
        transform:translate(-50%,-50%) rotate(64deg) scaleX(.32);
        box-shadow:0 0 18px rgba(102,240,209,.10);
      }

      .demo-globe-grid {
        inset:23%;
        border-radius:50%;
        border-top:1px solid rgba(255,255,255,.14);
        border-bottom:1px solid rgba(255,255,255,.10);
        transform:rotate(-18deg);
      }

      .demo-globe-core {
        left:50%;
        top:50%;
        width:34px;
        height:34px;
        transform:translate(-50%,-50%) rotate(45deg);
        border:1px solid rgba(239,210,154,.62);
        border-radius:8px;
        background:
          radial-gradient(circle at 50% 50%,rgba(255,255,255,.82),rgba(239,210,154,.30) 38%,transparent 70%);
        box-shadow:
          0 0 16px rgba(239,210,154,.44),
          0 0 34px rgba(142,197,255,.20);
        opacity:.92;
      }

      .home-core::before {
        content:"";
        position:absolute;
        inset:7%;
        border-radius:inherit;
        background:
          radial-gradient(circle at 28% 36%,rgba(255,255,255,.34) 0 4%,transparent 5%),
          radial-gradient(circle at 70% 38%,rgba(239,210,154,.44) 0 3%,transparent 4%),
          radial-gradient(circle at 60% 74%,rgba(102,240,209,.38) 0 3%,transparent 4%),
          radial-gradient(circle at 38% 68%,rgba(142,197,255,.30) 0 3%,transparent 4%);
        opacity:.88;
        pointer-events:none;
        z-index:2;
      }

      .home-core::after {
        content:"";
        position:absolute;
        inset:-2px;
        border-radius:inherit;
        background:
          radial-gradient(ellipse at 30% 48%,rgba(255,255,255,.58) 0 7%,transparent 8%),
          radial-gradient(ellipse at 56% 26%,rgba(255,255,255,.44) 0 8%,transparent 9%),
          radial-gradient(ellipse at 67% 48%,rgba(255,255,255,.34) 0 7%,transparent 8%),
          radial-gradient(ellipse at 50% 72%,rgba(255,255,255,.28) 0 10%,transparent 11%),
          radial-gradient(circle at 30% 25%,rgba(255,255,255,.36),transparent 18%);
        mix-blend-mode:screen;
        opacity:.72;
        pointer-events:none;
        z-index:5;
      }

      .home-caption {
        position:absolute;
        left:50%;
        bottom:24px;
        transform:translateX(-50%);
        z-index:4;
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

      .doll summary::-webkit-details-marker { display:none; }

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

      .home-footer a { color:#d6e2ff; }

      @keyframes orbitOne {
        from { transform:rotate(43deg) scaleX(.38); }
        to { transform:rotate(403deg) scaleX(.38); }
      }

      @keyframes orbitTwo {
        from { transform:rotate(-43deg) scaleX(.38); }
        to { transform:rotate(317deg) scaleX(.38); }
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
          min-height:390px;
        }

        .home-core {
          width:154px;
          height:154px;
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

  function normalizeDemoUniverseCore(root) {
    const core = root.querySelector(".home-core");
    if (!core) return;

    core.textContent = "";
    core.setAttribute("role", "img");
    core.setAttribute("aria-label", "Demo Universe globe");
    core.setAttribute("data-home-demo-universe-core", "true");

    const fragments = [
      ["span", "demo-globe-shell"],
      ["span", "demo-globe-field field-a"],
      ["span", "demo-globe-field field-b"],
      ["span", "demo-globe-field field-c"],
      ["span", "demo-globe-field field-d"],
      ["span", "demo-globe-ring"],
      ["span", "demo-globe-axis"],
      ["span", "demo-globe-grid"],
      ["span", "demo-globe-core"]
    ];

    for (const [tag, className] of fragments) {
      const firstClass = className.split(" ")[0];
      if (core.querySelector("." + firstClass)) continue;

      const node = document.createElement(tag);
      node.className = className;
      node.setAttribute("aria-hidden", "true");
      core.appendChild(node);
    }
  }

  function markRootProof(root) {
    root.setAttribute("data-home-state", "second-generation-renewal");
    root.setAttribute("data-home-priority", "nine-summits-demo-universe-upper-room");
    root.setAttribute("data-home-js-owner", "index.js");
    root.setAttribute("data-home-runtime", "mounted");
    root.setAttribute("data-home-demo-universe-runtime", "mounted");
    root.setAttribute("data-home-root-proof", "true");
    root.setAttribute("data-home-not-gauges", "true");
    root.setAttribute("data-home-not-earth", "true");
    root.setAttribute("data-home-demo-universe-quality", "second-generation-upgraded");
  }

  function mount() {
    injectStyle();

    const root = document.getElementById("homePage");
    if (!root) return;

    markRootProof(root);
    normalizeDemoUniverseCore(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
