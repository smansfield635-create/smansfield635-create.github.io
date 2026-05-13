// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_LIVE_AUTHORITY_GROUND_RENDER_BINDING_TNT_v3
// Owns: live H-Earth route authority and binding to the v2 high-definition Western Golden Shelf ground renderer.
// Purpose: stop the old symbolic fallback from controlling the visible canvas.
// Holds: final architecture, final Estate buildout, final Diamond Gate Bridge object, roads, and city.

const CONTRACT = "H_EARTH_LIVE_AUTHORITY_GROUND_RENDER_BINDING_TNT_v3";
const GROUND_RENDER_CACHE_KEY = "H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_DEFINITION_TNT_v2";

const STATUS = Object.freeze({
  contract: CONTRACT,
  target: "H-Earth",
  route: "/showroom/globe/h-earth/",
  liveAuthority: true,
  selectedRegion: "Western Golden Shelf",
  selectedRegionKey: "western-golden-shelf",
  manorGroundPlacementAuthorized: true,
  controlledManorPlacement: true,
  waterBehindManor: true,
  cameraFacing: "west-southwest",
  finalManorArchitectureAuthorized: false,
  estateFinalizationAuthorized: false,
  bridgeFinalizationAuthorized: false,
  roadPlacementAuthorized: false,
  cityPlacementAuthorized: false,
  finalArchitectureAuthorized: false
});

const CSS = `
  :root {
    --h-bg: #030812;
    --h-bg2: #061020;
    --h-panel: rgba(7,15,31,.94);
    --h-panel2: rgba(11,23,44,.82);
    --h-soft: rgba(255,255,255,.055);
    --h-line: rgba(244,207,131,.22);
    --h-line2: rgba(255,255,255,.12);
    --h-text: rgba(238,244,255,.94);
    --h-muted: rgba(238,244,255,.66);
    --h-faint: rgba(238,244,255,.46);
    --h-gold: #f4cf83;
    --h-mint: #a7f3c6;
    --h-blue: #9db7ff;
    --h-danger: #ff9f9f;
    color-scheme: dark;
  }

  * { box-sizing: border-box; }

  html,
  body {
    min-height: 100%;
    margin: 0;
    background:
      radial-gradient(circle at 50% -8%, rgba(78,119,171,.26), transparent 38%),
      radial-gradient(circle at 12% 18%, rgba(244,207,131,.12), transparent 30%),
      radial-gradient(circle at 84% 30%, rgba(167,243,198,.09), transparent 34%),
      linear-gradient(180deg, var(--h-bg2), var(--h-bg) 54%, #02050b) !important;
    color: var(--h-text) !important;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    letter-spacing: -.015em;
  }

  body {
    background:
      linear-gradient(90deg, rgba(244,207,131,.08) 1px, transparent 1px),
      linear-gradient(180deg, rgba(244,207,131,.035) 1px, transparent 1px),
      linear-gradient(180deg, var(--h-bg2), var(--h-bg) 54%, #02050b) !important;
    background-size: 58px 58px, 58px 58px, auto !important;
  }

  a { color: inherit; }

  .page {
    width: min(1180px, calc(100% - 28px));
    margin: 0 auto;
    padding: 22px 0 58px;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0 22px;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--h-gold);
    text-decoration: none;
    font-weight: 950;
    letter-spacing: .02em;
    text-transform: uppercase;
  }

  .brand-mark {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 1px solid rgba(244,207,131,.46);
    border-radius: 10px;
    background: rgba(244,207,131,.08);
  }

  .nav,
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .nav { justify-content: flex-end; }

  .nav a,
  .button {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--h-line2);
    border-radius: 999px;
    padding: 0 13px;
    color: rgba(238,244,255,.84);
    text-decoration: none;
    background: rgba(255,255,255,.04);
    font-size: .82rem;
    font-weight: 850;
    letter-spacing: .02em;
  }

  .nav a[aria-current="page"],
  .button.primary {
    color: #06101c;
    background: linear-gradient(135deg, var(--h-mint), #78d8ac);
    border-color: rgba(167,243,198,.64);
  }

  .button.gold {
    color: #150d03;
    background: linear-gradient(135deg, #fff0b8, var(--h-gold) 48%, #c48a38);
    border-color: rgba(244,207,131,.74);
  }

  .hero,
  .panel,
  .card,
  .standard-card {
    border: 1px solid var(--h-line);
    background:
      radial-gradient(circle at 76% 28%, rgba(139,200,255,.12), transparent 32%),
      linear-gradient(180deg, rgba(8,17,34,.95), rgba(4,9,20,.96));
    box-shadow: 0 24px 70px rgba(0,0,0,.28);
  }

  .hero,
  .panel {
    border-radius: 34px;
    overflow: hidden;
  }

  .hero { padding: clamp(24px, 5vw, 46px); }
  .panel { padding: clamp(18px, 3vw, 28px); margin-top: 16px; }

  h1,
  h2,
  h3 {
    color: var(--h-gold);
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
    color: var(--h-gold);
    font: 900 .78rem/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: .22em;
    text-transform: uppercase;
  }

  .eyebrow.compact {
    margin-bottom: 8px;
    font-size: .70rem;
    letter-spacing: .18em;
  }

  .lede,
  p,
  li {
    color: var(--h-muted);
    line-height: 1.55;
  }

  .lede {
    max-width: 900px;
    margin: 22px 0 0;
    font-size: clamp(1.02rem, 2.5vw, 1.28rem);
  }

  .actions { margin-top: 26px; }

  .transition,
  .gate-panel,
  .placement-unlock {
    margin-top: 16px;
    padding: 18px;
    border: 1px solid rgba(167,243,198,.20);
    border-radius: 24px;
    background: rgba(5,38,34,.24);
    color: var(--h-mint);
    font-weight: 900;
    line-height: 1.5;
  }

  .gate-panel,
  .placement-unlock {
    border-color: rgba(244,207,131,.26);
    color: var(--h-text);
  }

  .summary,
  .standard-grid,
  .placement-list {
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

  .summary div,
  .card,
  .standard-card,
  .placement-list div {
    border: 1px solid var(--h-line2);
    border-radius: 18px;
    padding: 14px;
    background: var(--h-soft);
    box-shadow: none;
  }

  .standard-card {
    border-radius: 24px;
    padding: 18px;
    background: var(--h-panel2);
  }

  .summary strong,
  .placement-list strong {
    display: block;
    color: var(--h-text);
    font-size: 1.05rem;
    line-height: 1.3;
    margin-top: 6px;
    overflow-wrap: anywhere;
  }

  .summary strong {
    color: var(--h-gold);
    font-size: 1.18rem;
    margin-top: 0;
  }

  .summary span,
  .placement-list span {
    display: block;
    color: var(--h-faint);
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
    min-height: clamp(440px, 68vw, 640px);
    border: 1px solid rgba(244,207,131,.20);
    border-radius: 26px;
    overflow: hidden;
    background: #06101d;
    box-shadow: 0 30px 90px rgba(0,0,0,.36);
  }

  .manor-ground-viewport canvas {
    display: block;
    width: 100%;
    height: clamp(440px, 68vw, 640px);
  }

  .gate-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    color: #06101c;
    background: var(--h-gold);
    font: 950 .78rem/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: .08em;
    padding: 7px 10px;
    margin-bottom: 8px;
  }

  .footer {
    margin-top: 20px;
    padding: 20px 0 0;
    color: var(--h-faint);
    font-size: .82rem;
    text-align: center;
  }

  @media (max-width: 900px) {
    .topbar { align-items: flex-start; flex-direction: column; }
    .nav { justify-content: flex-start; }
    .ground-placement-grid { grid-template-columns: 1fr; }
    .summary { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .standard-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 560px) {
    .page { width: min(100% - 18px, 1180px); }
    .hero, .panel { border-radius: 24px; }
    .manor-ground-viewport canvas { height: 460px; }
  }
`;

function setDocumentAuthority() {
  document.documentElement.className = "dgb-h-earth-live-authority";
  document.body.className = "dgb-h-earth-live-authority";

  const markers = {
    page: "h-earth-live-authority-ground-render-binding",
    route: "/showroom/globe/h-earth/",
    contract: CONTRACT,
    target: "h-earth",
    liveAuthority: "true",
    selectedRegion: "western-golden-shelf",
    westernGoldenShelfSelected: "true",
    manorGroundPlacementAuthorized: "true",
    controlledManorPlacement: "true",
    waterBehindManor: "true",
    cameraFacing: "west-southwest",
    groundRenderBinding: "true",
    groundRenderCacheKey: GROUND_RENDER_CACHE_KEY,
    finalArchitectureAuthorized: "false",
    globeSelectorMutated: "false",
    mapFlattening: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    document.body.dataset[key] = value;
  });

  document.title = "Western Golden Shelf · Manor Ground Placement";
}

function installStyle() {
  let style = document.getElementById("h-earth-live-authority-style");

  if (!style) {
    style = document.createElement("style");
    style.id = "h-earth-live-authority-style";
    style.dataset.contract = CONTRACT;
    document.head.appendChild(style);
  }

  style.textContent = CSS;
}

function canonicalBody() {
  return `
    <div class="page">
      <header class="topbar" aria-label="Diamond Gate Bridge navigation">
        <a class="brand" href="/showroom/">
          <span class="brand-mark" aria-hidden="true">◆</span>
          <span>Diamond Gate Bridge</span>
        </a>

        <nav class="nav" aria-label="Primary">
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
          <p class="eyebrow">Western Golden Shelf · Ground Definition Binding</p>
          <h1>The Manor is now placed on the shelf. Water remains behind it.</h1>
          <p class="lede">
            The live authority path now binds directly to the high-definition Western Golden Shelf ground renderer. The camera remains on the landward eastern shelf looking west-southwest, with the waterline behind the Manor. Final architecture, Estate finalization, roads, city systems, and the final Diamond Gate Bridge object remain held.
          </p>

          <div class="actions">
            <a class="button primary" href="#manor-ground-render">View Ground Render</a>
            <a class="button gold" href="/showroom/globe/">Return to Globe Selector</a>
            <a class="button" href="/showroom/">Return to Showroom</a>
          </div>

          <div class="transition">
            H-Earth orbital baseline → Western Golden Shelf candidate → controlled Manor ground placement → high-definition ground expression → later Estate / Bridge finalization.
          </div>

          <div class="summary">
            <div><strong>V2 BOUND</strong><span>Ground definition renderer</span></div>
            <div><strong>WATER BEHIND</strong><span>View contract</span></div>
            <div><strong>WEST-SOUTHWEST</strong><span>Camera facing</span></div>
            <div><strong>HOLD</strong><span>Final architecture</span></div>
          </div>

          <div class="gate-panel">
            <span class="gate-label">GROUND RENDER BINDING ACTIVE</span>
            <p>
              The old symbolic fallback is no longer allowed to control the image. This script attempts the v2 ground render first and uses a higher-definition internal fallback only if the module cannot load.
            </p>
          </div>
        </section>

        <section id="manor-ground-render" class="panel" aria-label="Western Golden Shelf Manor ground render">
          <p class="eyebrow compact">Ground-level render · definition pass</p>
          <h2>Landward shelf view toward the western waterline</h2>

          <div class="ground-placement-grid">
            <div class="manor-ground-viewport">
              <canvas data-manor-ground-canvas aria-label="High-definition Western Golden Shelf Manor ground placement"></canvas>
            </div>

            <article class="card">
              <h3>Placement authority</h3>
              <p>The existing Rich Manor definition is mounted onto Western Golden Shelf. The render must increase physical definition without redefining room count, acreage, vault, or internal structure.</p>

              <div class="placement-list">
                <div><span>Target</span><strong>Western Golden Shelf, H-Earth</strong></div>
                <div><span>Camera</span><strong>Landward / eastern highland side</strong></div>
                <div><span>Facing</span><strong>West-southwest</strong></div>
                <div><span>Water relationship</span><strong>Water behind the Manor</strong></div>
                <div><span>Renderer</span><strong>Ground definition v2</strong></div>
                <div><span>Fallback</span><strong>High-definition internal fallback only</strong></div>
                <div><span>Vault</span><strong>Preserved below ground</strong></div>
                <div><span>Final architecture</span><strong>HOLD</strong></div>
              </div>
            </article>
          </div>

          <div class="placement-unlock">
            <p>
              Controlled Manor ground placement is authorized. Ground development around and within the Manor zone may proceed after this definition pass is visually accepted.
            </p>
          </div>
        </section>

        <section class="panel" aria-label="Placement split">
          <p class="eyebrow compact">Placement split</p>
          <h2>Definition is active; final buildout remains held</h2>

          <div class="standard-grid">
            <article class="standard-card">
              <h3>Authorized</h3>
              <p>Controlled Manor ground placement and improved physical definition on Western Golden Shelf.</p>
            </article>

            <article class="standard-card">
              <h3>Next development</h3>
              <p>Ground around and within the Manor zone: terraces, courtyards, paths, drainage, gardens, and protected edge logic.</p>
            </article>

            <article class="standard-card">
              <h3>Still held</h3>
              <p>Final architecture, final Estate buildout, roads, city systems, and final Diamond Gate Bridge object.</p>
            </article>
          </div>
        </section>
      </main>

      <footer class="footer">
        Diamond Gate Bridge · H-Earth · Western Golden Shelf Ground Render Binding.
      </footer>
    </div>
  `;
}

function takeLiveAuthority() {
  setDocumentAuthority();
  installStyle();

  const h1 = document.querySelector("h1");
  const correctH1 = h1 && /The Manor is now placed on the shelf/i.test(h1.textContent || "");
  const hasCanvas = Boolean(document.querySelector("[data-manor-ground-canvas]"));
  const bound = document.documentElement.dataset.contract === CONTRACT;

  if (!correctH1 || !hasCanvas || !bound) {
    document.body.innerHTML = canonicalBody();
    setDocumentAuthority();
    installStyle();
  }
}

function seeded(index, salt = 0) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function drawInternalHighDefinitionGround(canvas, time = performance.now() / 1000) {
  if (!canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;

  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = Math.max(320, Math.floor((box.width || 900) * dpr));
  const h = Math.max(440, Math.floor((box.height || 620) * dpr));

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  ctx.clearRect(0, 0, w, h);

  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.76);
  sky.addColorStop(0, "rgba(4,10,25,1)");
  sky.addColorStop(0.30, "rgba(20,35,60,1)");
  sky.addColorStop(0.58, "rgba(72,68,66,1)");
  sky.addColorStop(0.82, "rgba(126,92,55,1)");
  sky.addColorStop(1, "rgba(165,116,64,1)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w * 0.64, h * 0.28, 0, w * 0.64, h * 0.31, w * 0.58);
  glow.addColorStop(0, "rgba(255,230,166,.38)");
  glow.addColorStop(0.22, "rgba(244,207,131,.18)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(8,18,24,.78)";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.47);
  for (let i = 0; i <= 38; i += 1) {
    const x = (i / 38) * w;
    const y = h * 0.47 - Math.sin(i * 0.62) * h * 0.030 - Math.sin(i * 1.53 + 0.8) * h * 0.020 - seeded(i, 22) * h * 0.018;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h * 0.58);
  ctx.lineTo(0, h * 0.58);
  ctx.closePath();
  ctx.fill();

  const waterTop = h * 0.455;
  const waterBottom = h * 0.660;
  const water = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
  water.addColorStop(0, "rgba(72,132,138,.94)");
  water.addColorStop(0.22, "rgba(48,106,122,.92)");
  water.addColorStop(0.58, "rgba(24,73,102,.90)");
  water.addColorStop(1, "rgba(9,35,62,.86)");
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.moveTo(0, waterTop);
  for (let i = 0; i <= 54; i += 1) {
    const x = (i / 54) * w;
    const y = waterTop + Math.sin(i * 0.42 + time * 0.48) * h * 0.004 + Math.sin(i * 1.52 + time * 0.22) * h * 0.0024;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, waterBottom);
  ctx.lineTo(0, waterBottom);
  ctx.closePath();
  ctx.fill();

  const reflection = ctx.createRadialGradient(w * 0.635, h * 0.50, 0, w * 0.635, h * 0.55, w * 0.36);
  reflection.addColorStop(0, "rgba(255,231,160,.26)");
  reflection.addColorStop(0.22, "rgba(244,207,131,.13)");
  reflection.addColorStop(0.58, "rgba(244,207,131,.045)");
  reflection.addColorStop(1, "rgba(244,207,131,0)");
  ctx.fillStyle = reflection;
  ctx.fillRect(0, waterTop, w, waterBottom - waterTop);

  ctx.strokeStyle = "rgba(244,207,131,.34)";
  ctx.lineWidth = Math.max(1, w * 0.0011);
  for (let j = 0; j < 15; j += 1) {
    const y = h * (0.505 + j * 0.010);
    ctx.globalAlpha = Math.max(0.028, 0.135 - j * 0.007);
    ctx.beginPath();
    for (let i = 0; i <= 44; i += 1) {
      const x = (i / 44) * w;
      const wave = Math.sin(i * 1.15 + j * 0.70 + time * 0.92) * h * 0.0026;
      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const shoreY = h * 0.626;
  const wet = ctx.createLinearGradient(0, shoreY - h * 0.035, 0, shoreY + h * 0.045);
  wet.addColorStop(0, "rgba(111,151,132,.12)");
  wet.addColorStop(0.40, "rgba(218,178,104,.36)");
  wet.addColorStop(0.72, "rgba(137,104,62,.22)");
  wet.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = wet;
  ctx.beginPath();
  ctx.moveTo(0, shoreY - h * 0.020);
  for (let i = 0; i <= 42; i += 1) {
    const x = (i / 42) * w;
    const y = shoreY + Math.sin(i * 0.78 + time * 0.32) * h * 0.005 + Math.sin(i * 1.9) * h * 0.003;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, shoreY + h * 0.055);
  ctx.lineTo(0, shoreY + h * 0.052);
  ctx.closePath();
  ctx.fill();

  const land = ctx.createLinearGradient(0, h * 0.595, 0, h);
  land.addColorStop(0, "rgba(151,124,68,.98)");
  land.addColorStop(0.20, "rgba(108,102,62,.98)");
  land.addColorStop(0.47, "rgba(64,85,59,.99)");
  land.addColorStop(0.76, "rgba(30,43,34,1)");
  land.addColorStop(1, "rgba(10,17,17,1)");
  ctx.fillStyle = land;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.595);
  for (let i = 0; i <= 46; i += 1) {
    const x = (i / 46) * w;
    const y = h * 0.595 + Math.sin(i * 0.62) * h * 0.009 + Math.sin(i * 1.41 + 0.3) * h * 0.006 + (i / 46 - 0.5) * h * 0.026;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  for (let j = 0; j < 18; j += 1) {
    const y = h * (0.645 + j * 0.020);
    ctx.strokeStyle = `rgba(244,207,131,${0.065 - j * 0.0017})`;
    ctx.lineWidth = Math.max(1, w * 0.0009);
    ctx.beginPath();
    for (let i = 0; i <= 28; i += 1) {
      const x = (i / 28) * w;
      const yy = y + Math.sin(i * 1.12 + j * 0.6) * h * 0.004 + Math.sin(i * 2.5) * h * 0.0018;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  const cx = w * 0.50;
  const cy = h * 0.704;
  const rx = w * 0.300;
  const ry = h * 0.060;

  ctx.fillStyle = "rgba(167,243,198,.055)";
  ctx.strokeStyle = "rgba(167,243,198,.58)";
  ctx.lineWidth = Math.max(1.5, w * 0.002);
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, -0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  drawInternalManor(ctx, w, h);
  drawInternalVegetation(ctx, w, h, time);
  drawInternalPath(ctx, w, h);

  const haze = ctx.createLinearGradient(0, h * 0.50, 0, h * 0.69);
  haze.addColorStop(0, "rgba(238,244,255,.045)");
  haze.addColorStop(0.56, "rgba(244,207,131,.050)");
  haze.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.49, w, h * 0.20);

  const vignette = ctx.createRadialGradient(w * 0.50, h * 0.58, h * 0.10, w * 0.50, h * 0.58, w * 0.86);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.72, "rgba(0,0,0,.04)");
  vignette.addColorStop(1, "rgba(0,0,0,.34)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  return Object.freeze({
    contract: CONTRACT,
    renderer: "internal-high-definition-fallback",
    rendered: true,
    waterBehindManor: true,
    cameraFacing: "west-southwest"
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawInternalManor(ctx, w, h) {
  const cx = w * 0.50;
  const baseY = h * 0.674;
  const width = w * 0.365;
  const height = h * 0.230;
  const bodyTop = baseY - height * 0.58;
  const bodyH = height * 0.52;

  const contact = ctx.createRadialGradient(cx, baseY + h * 0.020, 0, cx, baseY + h * 0.035, width * 0.82);
  contact.addColorStop(0, "rgba(0,0,0,.48)");
  contact.addColorStop(0.58, "rgba(0,0,0,.24)");
  contact.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = contact;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.035, width * 0.80, h * 0.050, 0, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createLinearGradient(cx - width * 0.54, bodyTop, cx + width * 0.54, baseY);
  body.addColorStop(0, "rgba(54,43,34,.98)");
  body.addColorStop(0.26, "rgba(126,98,63,.99)");
  body.addColorStop(0.48, "rgba(176,138,78,.99)");
  body.addColorStop(0.74, "rgba(99,76,54,.99)");
  body.addColorStop(1, "rgba(34,28,27,.99)");

  ctx.fillStyle = body;
  ctx.strokeStyle = "rgba(244,207,131,.52)";
  ctx.lineWidth = Math.max(1.4, w * 0.0016);

  function rect(x, y, rw, rh, radius = Math.max(2, w * 0.004)) {
    roundedRect(ctx, x, y, rw, rh, radius);
    ctx.fill();
    ctx.stroke();
  }

  rect(cx - width * 0.37, bodyTop + bodyH * 0.16, width * 0.74, bodyH * 0.84);
  rect(cx - width * 0.17, bodyTop - bodyH * 0.075, width * 0.34, bodyH * 1.08);
  rect(cx - width * 0.535, bodyTop + bodyH * 0.31, width * 0.20, bodyH * 0.66);
  rect(cx + width * 0.335, bodyTop + bodyH * 0.31, width * 0.20, bodyH * 0.66);

  ctx.fillStyle = "rgba(23,20,23,1)";
  ctx.strokeStyle = "rgba(244,207,131,.42)";

  function roof(points, fill = "rgba(23,20,23,1)") {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  roof([[cx - width * 0.43, bodyTop + bodyH * 0.18], [cx, bodyTop - height * 0.215], [cx + width * 0.43, bodyTop + bodyH * 0.18]]);
  roof([[cx - width * 0.205, bodyTop - bodyH * 0.05], [cx, bodyTop - height * 0.300], [cx + width * 0.205, bodyTop - bodyH * 0.05]], "rgba(18,18,22,1)");
  roof([[cx - width * 0.585, bodyTop + bodyH * 0.31], [cx - width * 0.435, bodyTop + bodyH * 0.08], [cx - width * 0.285, bodyTop + bodyH * 0.31]]);
  roof([[cx + width * 0.285, bodyTop + bodyH * 0.31], [cx + width * 0.435, bodyTop + bodyH * 0.08], [cx + width * 0.585, bodyTop + bodyH * 0.31]]);

  ctx.strokeStyle = "rgba(255,240,184,.22)";
  ctx.lineWidth = Math.max(1, w * 0.0008);
  for (let i = -4; i <= 4; i += 1) {
    const x = cx + i * width * 0.086;
    ctx.beginPath();
    ctx.moveTo(x, bodyTop + bodyH * 0.18);
    ctx.lineTo(x, baseY - bodyH * 0.03);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(244,207,131,.76)";
  ctx.strokeStyle = "rgba(255,240,184,.34)";
  ctx.lineWidth = Math.max(0.7, w * 0.0007);

  for (let floor = 0; floor < 4; floor += 1) {
    const y = bodyTop + bodyH * (0.23 + floor * 0.18);

    for (let i = -4; i <= 4; i += 1) {
      if (Math.abs(i) === 4 && floor < 1) continue;
      if (i === 0 && floor > 1) continue;

      const x = cx + i * width * 0.070;
      const ww = width * 0.025;
      const wh = bodyH * 0.072;

      roundedRect(ctx, x - ww / 2, y, ww, wh, 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.fillStyle = "rgba(13,10,12,.94)";
  roundedRect(ctx, cx - width * 0.040, baseY - bodyH * 0.255, width * 0.080, bodyH * 0.255, 4);
  ctx.fill();

  const rim = ctx.createLinearGradient(cx - width * 0.5, bodyTop, cx + width * 0.52, bodyTop);
  rim.addColorStop(0, "rgba(244,207,131,0)");
  rim.addColorStop(0.62, "rgba(255,231,170,.12)");
  rim.addColorStop(1, "rgba(255,231,170,.30)");
  ctx.fillStyle = rim;
  roundedRect(ctx, cx - width * 0.54, bodyTop - height * 0.06, width * 1.08, height * 0.68, 8);
  ctx.fill();
}

function drawInternalVegetation(ctx, w, h, time) {
  for (let i = 0; i < 76; i += 1) {
    const x = seeded(i, 120) * w;
    const y = h * (0.61 + seeded(i, 121) * 0.36);
    const scale = h * (0.007 + seeded(i, 122) * 0.015);
    const sway = Math.sin(time * 0.42 + i) * scale * 0.13;
    const near = y > h * 0.76;

    ctx.fillStyle = i % 6 === 0
      ? `rgba(162,176,102,${near ? 0.28 : 0.18})`
      : `rgba(64,128,78,${near ? 0.30 : 0.20})`;

    ctx.beginPath();
    ctx.ellipse(x + sway, y, scale * (near ? 2.4 : 1.8), scale * 0.76, seeded(i, 123) * 0.6, 0, Math.PI * 2);
    ctx.fill();

    if (i % 9 === 0) {
      ctx.strokeStyle = "rgba(29,56,42,.38)";
      ctx.lineWidth = Math.max(1, w * 0.0008);
      ctx.beginPath();
      ctx.moveTo(x, y + scale);
      ctx.lineTo(x + sway * 0.6, y - scale * 2.1);
      ctx.stroke();

      ctx.fillStyle = "rgba(73,142,88,.28)";
      ctx.beginPath();
      ctx.ellipse(x + sway * 1.2, y - scale * 2.1, scale * 1.4, scale * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawInternalPath(ctx, w, h) {
  const path = ctx.createLinearGradient(w * 0.48, h * 0.70, w * 0.50, h);
  path.addColorStop(0, "rgba(244,207,131,.14)");
  path.addColorStop(0.50, "rgba(122,94,50,.22)");
  path.addColorStop(1, "rgba(244,207,131,.055)");

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.465, h * 0.700);
  ctx.bezierCurveTo(w * 0.420, h * 0.800, w * 0.360, h * 0.905, w * 0.260, h);
  ctx.lineTo(w * 0.740, h);
  ctx.bezierCurveTo(w * 0.635, h * 0.905, w * 0.570, h * 0.800, w * 0.535, h * 0.700);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(244,207,131,.16)";
  ctx.lineWidth = Math.max(1, w * 0.001);
  ctx.beginPath();
  ctx.moveTo(w * 0.465, h * 0.700);
  ctx.bezierCurveTo(w * 0.420, h * 0.800, w * 0.360, h * 0.905, w * 0.260, h);
  ctx.moveTo(w * 0.535, h * 0.700);
  ctx.bezierCurveTo(w * 0.570, h * 0.800, w * 0.635, h * 0.905, w * 0.740, h);
  ctx.stroke();
}

async function startGroundRender() {
  const canvas = document.querySelector("[data-manor-ground-canvas]");
  if (!canvas) return null;

  try {
    const mod = await import(`/assets/h-earth/h-earth.western-golden-shelf.ground.render.js?v=${GROUND_RENDER_CACHE_KEY}`);

    if (mod?.createWesternGoldenShelfGroundRenderer) {
      return mod.createWesternGoldenShelfGroundRenderer(canvas, {
        dpr: Math.min(window.devicePixelRatio || 1, 1.5)
      }).start();
    }
  } catch (_error) {
    // Internal high-definition fallback takes over below.
  }

  let raf = 0;
  let lastReceipt = null;

  function draw(time) {
    lastReceipt = drawInternalHighDefinitionGround(canvas, time / 1000);
    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  return Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        renderer: "internal-high-definition-fallback",
        running: Boolean(raf),
        lastReceipt,
        waterBehindManor: true,
        cameraFacing: "west-southwest"
      });
    }
  });
}

async function init() {
  takeLiveAuthority();
  const groundRenderer = await startGroundRender();

  window.DGBHEarthGroundScout = Object.freeze({
    status() {
      return Object.freeze({
        ...STATUS,
        groundRenderBinding: true,
        groundRenderCacheKey: GROUND_RENDER_CACHE_KEY,
        groundRendererStatus: groundRenderer?.status?.() || null,
        liveAuthorityStyleMounted: Boolean(document.getElementById("h-earth-live-authority-style")),
        h1: document.querySelector("h1")?.textContent || "",
        expectedH1: "The Manor is now placed on the shelf. Water remains behind it."
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;
