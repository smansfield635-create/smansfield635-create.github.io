// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_LIVE_AUTHORITY_LIVE_WORLD_BINDING_TNT_v5
// Owns: live H-Earth route authority and binding to live procedural Western Golden Shelf world render.
// No PNG. No static picture. No primitive symbolic fallback.

const CONTRACT = "H_EARTH_LIVE_AUTHORITY_LIVE_WORLD_BINDING_TNT_v5";
const GROUND_RENDER_CACHE_KEY = "H_EARTH_WESTERN_GOLDEN_SHELF_LIVE_WORLD_RENDER_TNT_v5";

function installStyle() {
  let style = document.getElementById("h-earth-live-authority-style");

  if (!style) {
    style = document.createElement("style");
    style.id = "h-earth-live-authority-style";
    document.head.appendChild(style);
  }

  style.textContent = `
    html, body {
      min-height: 100%;
      margin: 0;
      background: linear-gradient(180deg, #061020, #030812 54%, #02050b) !important;
      color: rgba(238,244,255,.94) !important;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    }

    * { box-sizing: border-box; }

    .page {
      width: min(1180px, calc(100% - 28px));
      margin: 0 auto;
      padding: 22px 0 58px;
    }

    .topbar, .nav, .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }

    .topbar {
      justify-content: space-between;
      padding: 12px 0 22px;
    }

    .brand, .nav a, .button {
      color: inherit;
      text-decoration: none;
      font-weight: 850;
    }

    .brand {
      color: #f4cf83;
      text-transform: uppercase;
      letter-spacing: .02em;
    }

    .nav a, .button {
      min-height: 38px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 999px;
      padding: 0 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,.04);
      font-size: .82rem;
    }

    .nav a[aria-current="page"], .button.primary {
      color: #06101c;
      background: linear-gradient(135deg, #a7f3c6, #78d8ac);
    }

    .button.gold {
      color: #150d03;
      background: linear-gradient(135deg, #fff0b8, #f4cf83 48%, #c48a38);
    }

    .hero, .panel, .card, .standard-card {
      border: 1px solid rgba(244,207,131,.22);
      border-radius: 34px;
      background:
        radial-gradient(circle at 76% 28%, rgba(139,200,255,.12), transparent 32%),
        linear-gradient(180deg, rgba(8,17,34,.95), rgba(4,9,20,.96));
      box-shadow: 0 24px 70px rgba(0,0,0,.28);
      overflow: hidden;
    }

    .hero { padding: clamp(24px, 5vw, 46px); }
    .panel { padding: clamp(18px, 3vw, 28px); margin-top: 16px; }

    h1, h2, h3 {
      color: #f4cf83;
      margin: 0;
      line-height: 1.05;
    }

    h1 {
      max-width: 980px;
      font-size: clamp(2.1rem, 7vw, 5rem);
      line-height: .94;
      letter-spacing: -.07em;
    }

    h2 {
      font-size: clamp(1.45rem, 4vw, 2.15rem);
      letter-spacing: -.045em;
    }

    .eyebrow {
      margin: 0 0 14px;
      color: #f4cf83;
      font: 900 .78rem/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: .22em;
      text-transform: uppercase;
    }

    .lede, p {
      color: rgba(238,244,255,.66);
      line-height: 1.55;
    }

    .lede {
      max-width: 900px;
      margin: 22px 0 0;
      font-size: clamp(1.02rem, 2.5vw, 1.28rem);
    }

    .actions { margin-top: 26px; }

    .transition, .gate-panel, .placement-unlock {
      margin-top: 16px;
      padding: 18px;
      border: 1px solid rgba(167,243,198,.20);
      border-radius: 24px;
      background: rgba(5,38,34,.24);
      color: #a7f3c6;
      font-weight: 900;
      line-height: 1.5;
    }

    .summary, .standard-grid, .placement-list {
      display: grid;
      gap: 14px;
    }

    .summary {
      grid-template-columns: repeat(4, minmax(0,1fr));
      margin: 16px 0;
    }

    .standard-grid {
      grid-template-columns: repeat(3, minmax(0,1fr));
      margin-top: 16px;
    }

    .summary div, .card, .standard-card, .placement-list div {
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 18px;
      padding: 14px;
      background: rgba(255,255,255,.055);
    }

    .summary strong, .placement-list strong {
      display: block;
      color: #f4cf83;
      font-size: 1.05rem;
      margin-top: 6px;
      overflow-wrap: anywhere;
    }

    .summary strong {
      font-size: 1.18rem;
      margin-top: 0;
    }

    .summary span, .placement-list span {
      display: block;
      color: rgba(238,244,255,.46);
      font-size: .74rem;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: .08em;
    }

    .ground-placement-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.45fr) minmax(260px, .55fr);
      gap: 16px;
      margin-top: 16px;
    }

    .manor-ground-viewport {
      width: 100%;
      min-height: clamp(540px, 96vw, 880px);
      border: 1px solid rgba(244,207,131,.20);
      border-radius: 26px;
      overflow: hidden;
      background: #06101d;
      box-shadow: 0 30px 90px rgba(0,0,0,.36);
    }

    .manor-ground-viewport canvas {
      display: block;
      width: 100%;
      height: clamp(540px, 96vw, 880px);
    }

    .gate-label {
      display: inline-flex;
      border-radius: 999px;
      color: #06101c;
      background: #f4cf83;
      font: 950 .78rem/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: .08em;
      padding: 7px 10px;
      margin-bottom: 8px;
    }

    .footer {
      margin-top: 20px;
      padding: 20px 0 0;
      color: rgba(238,244,255,.46);
      font-size: .82rem;
      text-align: center;
    }

    @media (max-width: 900px) {
      .topbar { align-items: flex-start; flex-direction: column; }
      .ground-placement-grid { grid-template-columns: 1fr; }
      .summary { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .standard-grid { grid-template-columns: 1fr; }
    }
  `;
}

function setDocumentAuthority() {
  document.documentElement.className = "dgb-h-earth-live-world";
  document.body.className = "dgb-h-earth-live-world";

  const markers = {
    page: "h-earth-live-world-render",
    route: "/showroom/globe/h-earth/",
    contract: CONTRACT,
    selectedRegion: "western-golden-shelf",
    manorGroundPlacementAuthorized: "true",
    waterBehindManor: "true",
    cameraFacing: "west-southwest",
    renderer: "live-procedural-4k-world",
    staticImageDependency: "false",
    pngDependency: "false",
    finalArchitectureAuthorized: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    document.body.dataset[key] = value;
  });

  document.title = "Western Golden Shelf · Live World Ground Render";
}

function canonicalBody() {
  return `
    <div class="page">
      <header class="topbar">
        <a class="brand" href="/showroom/">◆ Diamond Gate Bridge</a>
        <nav class="nav">
          <a href="/">Compass</a>
          <a href="/showroom/">Showroom</a>
          <a href="/showroom/globe/">Globe</a>
          <a href="/showroom/globe/earth/">ZIONTS</a>
          <a href="/showroom/globe/h-earth/" aria-current="page">H-Earth</a>
          <a href="/showroom/globe/audralia/">Audralia</a>
          <a href="/gauges/">Triple G</a>
        </nav>
      </header>

      <main id="main">
        <section class="hero">
          <p class="eyebrow">Western Golden Shelf · Live World Render</p>
          <h1>The Manor is now placed on a living shelf. Water moves behind it.</h1>
          <p class="lede">
            This is no longer a static image or a diagram. The Western Golden Shelf is rendered as a live procedural environment with ocean motion, wind-reactive vegetation, atmospheric shimmer, wildlife movement, golden-hour light, and the Manor physically placed on the shelf.
          </p>

          <div class="actions">
            <a class="button primary" href="#manor-ground-render">View Live World</a>
            <a class="button gold" href="/showroom/globe/">Return to Globe Selector</a>
            <a class="button" href="/showroom/">Return to Showroom</a>
          </div>

          <div class="transition">
            Visual baseline preserved as direction. Static PNG rejected. Live world renderer active.
          </div>

          <div class="summary">
            <div><strong>LIVE WORLD</strong><span>Render class</span></div>
            <div><strong>NO PNG</strong><span>Static dependency</span></div>
            <div><strong>WIND + WATER</strong><span>Motion layer</span></div>
            <div><strong>HOLD</strong><span>Final architecture</span></div>
          </div>

          <div class="gate-panel">
            <span class="gate-label">LIVE ENVIRONMENT ACTIVE</span>
            <p>The accepted image remains the compass. The renderer is the engine. The world must breathe.</p>
          </div>
        </section>

        <section id="manor-ground-render" class="panel">
          <p class="eyebrow">Ground-level render · living environment</p>
          <h2>Inland shelf view toward the western waterline</h2>

          <div class="ground-placement-grid">
            <div class="manor-ground-viewport">
              <canvas data-manor-ground-canvas aria-label="Live procedural Western Golden Shelf Manor world"></canvas>
            </div>

            <article class="card">
              <h3>Live render authority</h3>
              <p>The renderer now generates a live world instead of displaying a static image.</p>
              <div class="placement-list">
                <div><span>Renderer
