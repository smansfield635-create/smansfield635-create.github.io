// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_LIVE_ROUTE_AUTHORITY_TAKEOVER_TNT_v2
// Owns: live route source authority takeover for /showroom/globe/h-earth/.
// Purpose: if stale HTML is still being served but this JS loads, rebuild the route into the canonical Manor ground-placement page.
// Does not own: final architecture, final Estate buildout, final bridge object, roads, or city.

const CONTRACT = "H_EARTH_LIVE_ROUTE_AUTHORITY_TAKEOVER_TNT_v2";

const FALLBACK_STATUS = Object.freeze({
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
  .metric,
  .proof-card,
  .zone-card,
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
  .metric-grid,
  .proof-grid,
  .zone-grid,
  .standard-grid,
  .placement-list {
    display: grid;
    gap: 14px;
  }

  .summary {
    grid-template-columns: repeat(4, minmax(0,1fr));
    margin: 16px 0;
  }

  .metric-grid {
    grid-template-columns: repeat(3, minmax(0,1fr));
    margin: 14px 0;
  }

  .proof-grid,
  .zone-grid,
  .standard-grid {
    grid-template-columns: repeat(3, minmax(0,1fr));
    margin-top: 16px;
  }

  .summary div,
  .metric,
  .card,
  .proof-card,
  .zone-card,
  .standard-card,
  .placement-list div {
    border-color: var(--h-line2);
    border-radius: 18px;
    padding: 14px;
    background: var(--h-soft);
    box-shadow: none;
  }

  .proof-card,
  .zone-card,
  .standard-card {
    border-radius: 24px;
    padding: 18px;
    background: var(--h-panel2);
  }

  .summary strong,
  .metric strong,
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
  .metric span,
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
    min-height: clamp(420px, 64vw, 590px);
    border: 1px solid rgba(244,207,131,.20);
    border-radius: 26px;
    overflow: hidden;
    background: #06101d;
    box-shadow: 0 30px 90px rgba(0,0,0,.36);
  }

  .manor-ground-viewport canvas {
    display: block;
    width: 100%;
    height: clamp(420px, 64vw, 590px);
  }

  .gate-label,
  .grade-pill {
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
    .proof-grid, .zone-grid, .standard-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 560px) {
    .page { width: min(100% - 18px, 1180px); }
    .hero, .panel { border-radius: 24px; }
    .metric-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .manor-ground-viewport canvas { height: 430px; }
  }
`;

function setDocumentAuthority() {
  document.documentElement.className = "dgb-h-earth-live-authority";
  document.body.className = "dgb-h-earth-live-authority";

  const markers = {
    page: "h-earth-live-route-authority-takeover",
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
    groundRenderActive: "true",
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
          <p class="eyebrow">Western Golden Shelf · Live Route Authority</p>
          <h1>The Manor is now placed on the shelf. Water remains behind it.</h1>
          <p class="lede">
            This route is now under live source authority. The already-defined Rich Manor is mounted onto the Western Golden Shelf ground plane. The camera is on the landward eastern shelf looking west-southwest, with the waterline behind the Manor. Final architecture, Estate finalization, roads, city systems, and the final Diamond Gate Bridge object remain held.
          </p>

          <div class="actions">
            <a class="button primary" href="#manor-ground-render">View Ground Render</a>
            <a class="button gold" href="/showroom/globe/">Return to Globe Selector</a>
            <a class="button" href="/showroom/">Return to Showroom</a>
          </div>

          <div class="transition">
            H-Earth orbital baseline → Western Golden Shelf candidate → controlled Manor ground placement → develop the ground around and within → later Estate / Bridge finalization.
          </div>

          <div class="summary">
            <div><strong>AUTHORIZED</strong><span>Manor ground placement</span></div>
            <div><strong>WATER BEHIND</strong><span>View contract</span></div>
            <div><strong>WEST-SOUTHWEST</strong><span>Camera facing</span></div>
            <div><strong>HOLD</strong><span>Final architecture</span></div>
          </div>

          <div class="gate-panel">
            <span class="gate-label">LIVE ROUTE AUTHORITY ACTIVE</span>
            <p>
              The page shell is being asserted by /showroom/globe/h-earth/index.js. If an older HTML file tries to serve this route, this script takes authority and restores the Manor ground-placement expression.
            </p>
          </div>
        </section>

        <section id="manor-ground-render" class="panel" aria-label="Western Golden Shelf Manor ground render">
          <p class="eyebrow compact">Ground-level render · water behind Manor</p>
          <h2>Landward shelf view toward the western waterline</h2>

          <div class="ground-placement-grid">
            <div class="manor-ground-viewport">
              <canvas data-manor-ground-canvas aria-label="Code-rendered Western Golden Shelf Manor ground placement"></canvas>
            </div>

            <article class="card">
              <h3>Placement authority</h3>
              <p>The existing Rich Manor definition is mounted onto Western Golden Shelf. This live authority pass does not redefine room count, acreage, vault, or internal structure.</p>

              <div class="placement-list">
                <div><span>Target</span><strong>Western Golden Shelf, H-Earth</strong></div>
                <div><span>Camera</span><strong>Landward / eastern highland side</strong></div>
                <div><span>Facing</span><strong>West-southwest</strong></div>
                <div><span>Water relationship</span><strong>Water behind the Manor</strong></div>
                <div><span>Estate acres</span><strong>256</strong></div>
                <div><span>Floors</span><strong>4</strong></div>
                <div><span>Vault</span><strong>Preserved below ground</strong></div>
                <div><span>Final architecture</span><strong>HOLD</strong></div>
              </div>
            </article>
          </div>

          <div class="placement-unlock">
            <p>
              Controlled Manor ground placement is authorized. Ground development around and within the Manor zone may proceed after this view is visually accepted.
            </p>
          </div>
        </section>

        <section class="panel" aria-label="Placement split">
          <p class="eyebrow compact">Placement split</p>
          <h2>What is unlocked and what remains held</h2>

          <div class="standard-grid">
            <article class="standard-card">
              <h3>Authorized</h3>
              <p>Controlled Manor ground placement on Western Golden Shelf with water behind the Manor.</p>
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
        Diamond Gate Bridge · H-Earth · Western Golden Shelf Live Route Authority Takeover.
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

  if (!correctH1 || !hasCanvas || document.documentElement.dataset.contract !== CONTRACT) {
    document.body.innerHTML = canonicalBody();
    setDocumentAuthority();
    installStyle();
  }
}

function drawFallbackGround(canvas, time = performance.now() / 1000) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = Math.max(320, Math.floor((box.width || 900) * dpr));
  const h = Math.max(420, Math.floor((box.height || 560) * dpr));

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  ctx.clearRect(0, 0, w, h);

  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.64);
  sky.addColorStop(0, "rgba(5,12,28,1)");
  sky.addColorStop(0.42, "rgba(28,44,68,1)");
  sky.addColorStop(0.78, "rgba(116,86,56,1)");
  sky.addColorStop(1, "rgba(156,112,66,1)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w * 0.63, h * 0.28, 0, w * 0.63, h * 0.30, w * 0.52);
  glow.addColorStop(0, "rgba(255,224,146,.32)");
  glow.addColorStop(0.22, "rgba(244,207,131,.16)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(11,22,27,.72)";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.47);
  for (let i = 0; i <= 24; i += 1) {
    const x = (i / 24) * w;
    const y = h * 0.47 - Math.sin(i * 0.8) * h * 0.035 - Math.sin(i * 1.9) * h * 0.018;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h * 0.58);
  ctx.lineTo(0, h * 0.58);
  ctx.closePath();
  ctx.fill();

  const waterTop = h * 0.455;
  const waterBottom = h * 0.655;
  const water = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
  water.addColorStop(0, "rgba(54,115,126,.92)");
  water.addColorStop(0.42, "rgba(30,83,104,.88)");
  water.addColorStop(1, "rgba(12,38,62,.82)");
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.moveTo(0, waterTop);
  for (let i = 0; i <= 40; i += 1) {
    const x = (i / 40) * w;
    const y = waterTop + Math.sin(i * 0.55 + time * 0.52) * h * 0.005;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, waterBottom);
  ctx.lineTo(0, waterBottom);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(244,207,131,.28)";
  ctx.lineWidth = Math.max(1, w * 0.0012);
  for (let j = 0; j < 8; j += 1) {
    const y = h * (0.51 + j * 0.018);
    ctx.beginPath();
    for (let i = 0; i <= 32; i += 1) {
      const x = (i / 32) * w;
      const wave = Math.sin(i * 1.4 + j * 0.7 + time * 0.9) * h * 0.003;
      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  const land = ctx.createLinearGradient(0, h * 0.60, 0, h);
  land.addColorStop(0, "rgba(146,122,68,.96)");
  land.addColorStop(0.42, "rgba(72,88,60,.97)");
  land.addColorStop(1, "rgba(11,18,18,1)");
  ctx.fillStyle = land;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.60);
  for (let i = 0; i <= 30; i += 1) {
    const x = (i / 30) * w;
    const y = h * 0.60 + Math.sin(i * 0.9) * h * 0.012 + (i / 30 - 0.5) * h * 0.026;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  const cx = w * 0.50;
  const baseY = h * 0.672;
  const width = w * 0.34;
  const height = h * 0.205;

  ctx.fillStyle = "rgba(0,0,0,.42)";
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.035, width * 0.74, h * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();

  const bodyTop = baseY - height * 0.58;
  const bodyH = height * 0.52;
  const body = ctx.createLinearGradient(cx - width * 0.5, bodyTop, cx + width * 0.5, baseY);
  body.addColorStop(0, "rgba(70,55,40,.98)");
  body.addColorStop(0.40, "rgba(162,129,76,.98)");
  body.addColorStop(0.72, "rgba(104,80,54,.98)");
  body.addColorStop(1, "rgba(39,31,28,.98)");

  ctx.fillStyle = body;
  ctx.strokeStyle = "rgba(244,207,131,.46)";
  ctx.lineWidth = Math.max(1.4, w * 0.0016);

  function rect(x, y, rw, rh) {
    ctx.beginPath();
    ctx.roundRect(x, y, rw, rh, Math.max(2, w * 0.004));
    ctx.fill();
    ctx.stroke();
  }

  rect(cx - width * 0.36, bodyTop + bodyH * 0.16, width * 0.72, bodyH * 0.82);
  rect(cx - width * 0.16, bodyTop - bodyH * 0.06, width * 0.32, bodyH * 1.05);
  rect(cx - width * 0.50, bodyTop + bodyH * 0.31, width * 0.18, bodyH * 0.64);
  rect(cx + width * 0.32, bodyTop + bodyH * 0.31, width * 0.18, bodyH * 0.64);

  ctx.fillStyle = "rgba(27,22,24,1)";
  function roof(points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  roof([[cx - width * 0.41, bodyTop + bodyH * 0.18], [cx, bodyTop - height * 0.20], [cx + width * 0.41, bodyTop + bodyH * 0.18]]);
  roof([[cx - width * 0.19, bodyTop - bodyH * 0.04], [cx, bodyTop - height * 0.28], [cx + width * 0.19, bodyTop - bodyH * 0.04]]);
  roof([[cx - width * 0.55, bodyTop + bodyH * 0.31], [cx - width * 0.41, bodyTop + bodyH * 0.09], [cx - width * 0.27, bodyTop + bodyH * 0.31]]);
  roof([[cx + width * 0.27, bodyTop + bodyH * 0.31], [cx + width * 0.41, bodyTop + bodyH * 0.09], [cx + width * 0.55, bodyTop + bodyH * 0.31]]);

  ctx.fillStyle = "rgba(244,207,131,.72)";
  for (let floor = 0; floor < 4; floor += 1) {
    const y = bodyTop + bodyH * (0.25 + floor * 0.18);
    for (let i = -3; i <= 3; i += 1) {
      if (i === 0 && floor > 1) continue;
      const x = cx + i * width * 0.085;
      ctx.beginPath();
      ctx.roundRect(x - width * 0.016, y, width * 0.032, bodyH * 0.075, 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(238,244,255,.76)";
  ctx.font = `${Math.max(11, w * 0.013)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText("RICH MANOR · EXISTING SPEC PLACED", cx - width * 0.34, baseY + h * 0.058);
  ctx.fillStyle = "rgba(167,243,198,.70)";
  ctx.fillText("water behind · vault preserved below ground", cx - width * 0.32, baseY + h * 0.083);
}

async function startGroundRender() {
  const canvas = document.querySelector("[data-manor-ground-canvas]");
  if (!canvas) return null;

  try {
    const mod = await import("/assets/h-earth/h-earth.western-golden-shelf.ground.render.js?v=H_EARTH_LIVE_ROUTE_AUTHORITY_TAKEOVER_TNT_v2");

    if (mod?.createWesternGoldenShelfGroundRenderer) {
      return mod.createWesternGoldenShelfGroundRenderer(canvas, {
        dpr: Math.min(window.devicePixelRatio || 1, 1.5)
      }).start();
    }
  } catch (_error) {
    // Fallback renderer remains valid for source-authority recovery.
  }

  let raf = 0;

  function draw(time) {
    drawFallbackGround(canvas, time / 1000);
    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  return Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        fallbackGroundRenderer: true,
        running: Boolean(raf),
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
        ...FALLBACK_STATUS,
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
