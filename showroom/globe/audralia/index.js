<!doctype html>
<html
  lang="en"
  data-route="/showroom/globe/audralia/"
  data-page="audralia-satellite-globe-access"
  data-contract="AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_SURFACE_TNT_v7"
  data-previous-contract="AUDRALIA_RESTORE_EXISTING_SATELLITE_GLOBE_SURFACE_TNT_v6"
  data-role="showroom-globe-child-route"
  data-world="Audralia"
  data-canonical-spelling="A_U_D_R_A_L_I_A"
  data-parent-route="/showroom/globe/"
  data-public-path="possibility"
  data-view-model="satellite-orbital-existing-globe-access-contained"
  data-route-loader="/showroom/globe/audralia/index.js"
  data-route-loader-contract="AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7"
  data-canvas-contract="AUDRALIA_EXISTING_GLOBE_BOXED_ASSET_CONSUMER_TNT_v7"
  data-generated-image="false"
  data-graphic-box="false"
  data-procedural-world-fallback="false"
  data-heavy-runtime-loaded="false"
  data-streaming="false"
  data-visual-pass-claimed="false"
>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">

  <title>Audralia · Satellite Globe Access · Diamond Gate Bridge</title>
  <meta
    name="description"
    content="Audralia is the possibility path inside the Showroom Globe: satellite access into the existing Audralia globe asset chain."
  >
  <link rel="canonical" href="https://diamondgatebridge.com/showroom/globe/audralia/">
  <meta name="theme-color" content="#02040b">

  <style>
    :root {
      color-scheme: dark;
      --bg:#02040b;
      --ink:#fff4d8;
      --muted:rgba(230,238,255,.78);
      --faint:rgba(230,238,255,.52);
      --gold:#f3c86f;
      --green:#9ef0bf;
      --blue:#8dd8ff;
      --panel:rgba(9,15,31,.88);
      --line:rgba(184,205,255,.18);
      --shadow:0 32px 110px rgba(0,0,0,.48);
      --max:1180px;
    }

    * { box-sizing:border-box; }

    html {
      min-width:320px;
      min-height:100%;
      background:var(--bg);
      scroll-behavior:smooth;
      overflow-x:hidden;
    }

    body {
      margin:0;
      min-width:320px;
      min-height:100vh;
      color:var(--ink);
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      line-height:1.5;
      overflow-x:hidden;
      background:
        radial-gradient(circle at 50% -8%,rgba(158,240,191,.16),transparent 28rem),
        radial-gradient(circle at 12% 18%,rgba(36,120,255,.15),transparent 28rem),
        radial-gradient(circle at 88% 30%,rgba(243,200,111,.10),transparent 28rem),
        radial-gradient(circle at 50% 78%,rgba(141,216,255,.10),transparent 34rem),
        linear-gradient(180deg,#07101a 0%,#030713 58%,#010207 100%);
      -webkit-font-smoothing:antialiased;
      text-rendering:geometricPrecision;
    }

    body::before {
      content:"";
      position:fixed;
      inset:0;
      z-index:0;
      pointer-events:none;
      background-image:
        radial-gradient(circle,rgba(255,255,255,.16) 0 1px,transparent 1.5px),
        linear-gradient(rgba(143,240,195,.035) 1px,transparent 1px),
        linear-gradient(90deg,rgba(141,216,255,.032) 1px,transparent 1px);
      background-size:220px 260px,54px 54px,54px 54px;
      opacity:.20;
      mask-image:linear-gradient(180deg,rgba(0,0,0,.92),rgba(0,0,0,.52) 64%,rgba(0,0,0,.24));
    }

    a { color:inherit; text-decoration:none; }

    a:focus-visible,
    button:focus-visible,
    [tabindex]:focus-visible {
      outline:2px solid var(--gold);
      outline-offset:4px;
    }

    .skip {
      position:absolute;
      left:-999px;
      top:8px;
      z-index:50;
      padding:.75rem 1rem;
      border-radius:999px;
      color:#05070d;
      background:var(--gold);
      font-weight:950;
    }

    .skip:focus { left:8px; }

    .shell {
      position:relative;
      z-index:2;
      width:min(var(--max),calc(100% - 28px));
      margin:0 auto;
      padding:max(22px,env(safe-area-inset-top)) 0 max(46px,env(safe-area-inset-bottom));
    }

    .topbar {
      display:grid;
      grid-template-columns:auto 1fr;
      align-items:center;
      gap:18px;
      padding:12px 0 18px;
    }

    .brand {
      display:grid;
      grid-template-columns:auto 1fr;
      align-items:center;
      gap:.9rem;
      min-width:260px;
    }

    .brand-mark {
      width:4.2rem;
      height:4.2rem;
      display:grid;
      place-items:center;
      border:1px solid rgba(158,240,191,.42);
      border-radius:1.15rem;
      transform:rotate(45deg);
      background:
        linear-gradient(35deg,transparent 0 20%,rgba(255,255,255,.28) 21% 23%,transparent 24%),
        conic-gradient(from 45deg at 50% 50%,rgba(255,255,255,.22),rgba(158,240,191,.23),rgba(36,120,255,.18),rgba(243,200,111,.13),rgba(255,255,255,.22)),
        radial-gradient(circle at 48% 22%,rgba(255,255,255,.30),transparent 42%),
        linear-gradient(145deg,rgba(26,83,61,.95),rgba(5,8,20,.98));
      box-shadow:
        0 0 2rem rgba(158,240,191,.18),
        0 1.2rem 2.8rem rgba(0,0,0,.46),
        inset 0 1px 0 rgba(255,255,255,.16);
    }

    .brand-mark span {
      transform:rotate(-45deg);
      font-weight:950;
      letter-spacing:.04em;
      color:rgba(255,244,216,.98);
      text-shadow:0 2px 10px rgba(0,0,0,.85);
    }

    .brand-copy {
      display:grid;
      gap:.18rem;
    }

    .brand-copy strong {
      font-size:clamp(1.08rem,3vw,1.7rem);
      line-height:1;
      letter-spacing:-.045em;
    }

    .brand-copy span {
      color:var(--muted);
      font-size:.74rem;
      font-weight:950;
      letter-spacing:.14em;
      text-transform:uppercase;
    }

    .nav {
      display:flex;
      flex-wrap:wrap;
      justify-content:flex-end;
      gap:.48rem;
    }

    .nav a {
      min-height:2.25rem;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      border:1px solid rgba(255,255,255,.13);
      border-radius:999px;
      padding:.5rem .74rem;
      color:rgba(241,246,255,.84);
      background:rgba(255,255,255,.035);
      font-size:.68rem;
      font-weight:950;
      letter-spacing:.055em;
      text-transform:uppercase;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
    }

    .nav a[aria-current="page"] {
      border-color:rgba(158,240,191,.82);
      color:#06101c;
      background:linear-gradient(135deg,#c8ffd8,#8eeab2);
    }

    .panel {
      border:1px solid var(--line);
      border-radius:clamp(1.35rem,5vw,2.35rem);
      background:
        radial-gradient(circle at 14% 0%,rgba(158,240,191,.08),transparent 28rem),
        radial-gradient(circle at 86% 18%,rgba(36,120,255,.10),transparent 28rem),
        linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.022)),
        var(--panel);
      box-shadow:var(--shadow),inset 0 1px 0 rgba(255,255,255,.08);
      overflow:hidden;
    }

    .hero {
      position:relative;
      min-height:clamp(23rem,42vw,34rem);
      display:grid;
      align-content:center;
      gap:1rem;
      padding:clamp(1.45rem,5vw,3.4rem);
      margin-top:.6rem;
      isolation:isolate;
    }

    .kicker {
      width:fit-content;
      display:inline-flex;
      align-items:center;
      gap:.58rem;
      padding:.58rem .95rem;
      border:1px solid rgba(255,255,255,.14);
      border-radius:999px;
      color:rgba(230,238,255,.86);
      background:rgba(255,255,255,.04);
      font-size:.72rem;
      font-weight:950;
      letter-spacing:.14em;
      text-transform:uppercase;
      position:relative;
      z-index:2;
    }

    .kicker::before {
      content:"";
      width:.72rem;
      height:.72rem;
      border-radius:.18rem;
      transform:rotate(45deg);
      background:linear-gradient(135deg,#c8ffd8,var(--green));
      box-shadow:0 0 1.1rem rgba(158,240,191,.44);
    }

    h1 {
      margin:0;
      max-width:1000px;
      font-size:clamp(3.1rem,9vw,6.9rem);
      line-height:.86;
      letter-spacing:-.102em;
      text-wrap:balance;
      position:relative;
      z-index:2;
    }

    h2 {
      margin:0;
      color:var(--gold);
      font-size:clamp(1.45rem,4.7vw,2.65rem);
      line-height:.98;
      letter-spacing:-.07em;
      text-wrap:balance;
      position:relative;
      z-index:2;
    }

    .subtitle {
      max-width:900px;
      color:var(--green);
      font-size:clamp(1.25rem,4vw,2.3rem);
      line-height:1;
      letter-spacing:-.05em;
      font-weight:950;
      text-wrap:balance;
      position:relative;
      z-index:2;
    }

    p {
      margin:0;
      color:var(--muted);
      font-size:clamp(.98rem,2.7vw,1.16rem);
      line-height:1.55;
    }

    .lead {
      max-width:930px;
      position:relative;
      z-index:2;
    }

    .principle {
      max-width:980px;
      padding:1rem 1.1rem;
      border:1px solid rgba(158,240,191,.26);
      border-radius:1.2rem;
      color:rgba(206,255,228,.96);
      background:rgba(28,80,58,.16);
      font-weight:900;
      position:relative;
      z-index:2;
    }

    .actions {
      display:flex;
      flex-wrap:wrap;
      gap:.62rem;
      margin-top:.2rem;
      position:relative;
      z-index:2;
    }

    .button {
      min-height:2.65rem;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      border:1px solid rgba(255,255,255,.15);
      border-radius:999px;
      padding:.65rem 1rem;
      background:rgba(255,255,255,.045);
      color:rgba(241,246,255,.88);
      font-size:.76rem;
      font-weight:950;
      letter-spacing:.055em;
      text-transform:uppercase;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.07);
      transition:transform .18s ease,border-color .18s ease,background .18s ease;
    }

    .button:hover,
    .button:focus-visible {
      transform:translateY(-2px);
      border-color:rgba(158,240,191,.62);
      outline:none;
    }

    .button.gold {
      border-color:rgba(158,240,191,.9);
      color:#06101c;
      background:linear-gradient(135deg,#c8ffd8,#8eeab2);
      box-shadow:0 .8rem 1.8rem rgba(158,240,191,.13);
    }

    .section {
      margin-top:1.15rem;
      padding:clamp(1rem,3vw,1.45rem);
      display:grid;
      gap:1.05rem;
    }

    .stage {
      position:relative;
      width:100%;
      height:clamp(24rem,68vw,46rem);
      max-height:74vh;
      border:1px solid rgba(243,200,111,.22);
      border-radius:clamp(1.35rem,5vw,2.35rem);
      overflow:hidden!important;
      contain:layout paint size;
      isolation:isolate;
      background:
        radial-gradient(circle at 50% 50%,rgba(36,120,255,.14),transparent 44%),
        radial-gradient(circle at 50% 50%,rgba(158,240,191,.08),transparent 60%),
        linear-gradient(180deg,rgba(1,5,16,.78),rgba(2,6,16,.96));
      box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 1.2rem 4rem rgba(0,0,0,.30);
    }

    .stage-fallback {
      position:absolute;
      inset:0;
      z-index:1;
      display:grid;
      place-items:center;
      padding:1rem;
      color:rgba(230,238,255,.72);
      text-align:center;
      font-weight:850;
      pointer-events:none;
    }

    [data-audralia-canvas-mount="true"] {
      position:absolute!important;
      inset:0!important;
      z-index:2!important;
      width:100%!important;
      height:100%!important;
      max-width:100%!important;
      max-height:100%!important;
      overflow:hidden!important;
      contain:layout paint size!important;
      transform:none!important;
      transform-origin:center center!important;
      border-radius:inherit;
    }

    [data-audralia-canvas-mount="true"] > *,
    [data-audralia-canvas-mount="true"] canvas,
    [data-audralia-canvas-mount="true"] svg,
    [data-audralia-canvas-mount="true"] video {
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      max-width:100%!important;
      max-height:100%!important;
      min-width:0!important;
      min-height:0!important;
      margin:0!important;
      display:block!important;
      overflow:hidden!important;
      object-fit:contain!important;
      transform-origin:center center!important;
      box-sizing:border-box!important;
    }

    body > canvas[data-audralia-visible-canvas],
    body > canvas[data-audralia-globe],
    body > canvas[data-audralia-satellite],
    body > [data-audralia-mounted="true"] {
      display:none!important;
    }

    .stage[data-loader-state="mounted"] .stage-fallback {
      opacity:0;
      visibility:hidden;
    }

    .stage[data-loader-state="fallback"] .stage-fallback {
      color:rgba(255,244,216,.84);
    }

    .public-status {
      display:flex;
      flex-wrap:wrap;
      gap:.5rem;
      align-items:center;
      justify-content:center;
      color:rgba(206,255,228,.92);
      font-size:.74rem;
      font-weight:950;
      letter-spacing:.08em;
      text-transform:uppercase;
    }

    .public-status span {
      display:inline-flex;
      min-height:2rem;
      align-items:center;
      border:1px solid rgba(158,240,191,.24);
      border-radius:999px;
      padding:.38rem .7rem;
      background:rgba(28,80,58,.13);
    }

    .cards {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:.85rem;
    }

    .card {
      display:grid;
      gap:.6rem;
      min-height:100%;
      padding:1rem;
      border:1px solid rgba(255,255,255,.12);
      border-radius:1.2rem;
      background:
        radial-gradient(circle at 20% 0%,rgba(158,240,191,.08),transparent 60%),
        rgba(255,255,255,.035);
    }

    .card b {
      color:var(--green);
      font-size:.68rem;
      letter-spacing:.12em;
      text-transform:uppercase;
    }

    .card strong {
      color:rgba(255,244,216,.98);
      font-size:1.15rem;
      line-height:1.1;
    }

    .card span {
      color:var(--muted);
      font-size:.94rem;
      line-height:1.42;
    }

    .micro-links{
      display:flex;
      flex-wrap:wrap;
      gap:.54rem;
    }

    .micro-links a{
      min-height:2.35rem;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      border:1px solid rgba(255,255,255,.13);
      border-radius:999px;
      padding:.55rem .78rem;
      color:rgba(241,246,255,.84);
      background:rgba(255,255,255,.035);
      font-size:.68rem;
      font-weight:950;
      letter-spacing:.055em;
      text-transform:uppercase;
    }

    .micro-links a.primary{
      border-color:rgba(158,240,191,.62);
      color:#06101c;
      background:linear-gradient(135deg,#c8ffd8,#8eeab2);
    }

    .route-receipt,
    [data-route-receipt],
    [data-contract-receipt],
    [data-debug-receipt],
    .receipt {
      display:none!important;
      visibility:hidden!important;
      overflow:hidden!important;
      width:0!important;
      height:0!important;
      max-width:0!important;
      max-height:0!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      opacity:0!important;
      pointer-events:none!important;
      position:absolute!important;
      inset:auto!important;
      clip-path:inset(50%)!important;
      white-space:nowrap!important;
    }

    footer {
      padding:1.35rem 0 .5rem;
      color:var(--faint);
      text-align:center;
      font-size:.76rem;
    }

    @media (max-width:980px) {
      .topbar { grid-template-columns:1fr; align-items:start; }
      .nav { justify-content:flex-start; }
    }

    @media (max-width:720px) {
      .shell { width:min(100% - 22px,var(--max)); }
      h1 { font-size:clamp(3rem,17vw,5rem); }
      .hero { min-height:27rem; padding:1rem; }
      .actions { display:grid; }
      .button { width:100%; }
      .cards { grid-template-columns:1fr; }
      .stage {
        height:clamp(23rem,92vw,34rem);
        max-height:68vh;
      }
    }

    @media (prefers-reduced-motion:reduce) {
      *,
      *::before,
      *::after {
        scroll-behavior:auto!important;
        animation-duration:.01ms!important;
        animation-iteration-count:1!important;
        transition-duration:.01ms!important;
      }
    }
  </style>
</head>

<body>
  <a class="skip" href="/showroom/globe/audralia/#audralia-main">Skip to Audralia</a>

  <div class="shell">
    <header class="topbar" aria-label="Audralia header">
      <a class="brand" href="/showroom/globe/audralia/">
        <span class="brand-mark" aria-hidden="true"><span>AU</span></span>
        <span class="brand-copy">
          <span>Diamond Gate Bridge</span>
          <strong>Audralia</strong>
        </span>
      </a>

      <nav class="nav" aria-label="Primary navigation">
        <a href="/">Compass</a>
        <a href="/showroom/">Showroom</a>
        <a href="/showroom/globe/">Globe</a>
        <a href="/showroom/globe/earth/">ZIONTS</a>
        <a href="/showroom/globe/h-earth/">H-Earth</a>
        <a href="/showroom/globe/audralia/" aria-current="page">Audralia</a>
        <a href="/gauges/">Gauges</a>
      </nav>
    </header>

    <main id="audralia-main">
      <section class="panel hero" aria-labelledby="page-title">
        <div class="kicker">Audralia · The Possibility Path</div>

        <h1 id="page-title">Possibility is not fantasy.</h1>

        <div class="subtitle">Satellite access to the existing Audralia globe.</div>

        <p class="lead">
          A future worth reaching should be visible before it is lost.
        </p>

        <div class="principle">
          This route restores the developed Audralia globe and locks it back inside the inspection box.
        </div>

        <div class="actions">
          <a class="button gold" href="/showroom/globe/audralia/#audralia-stage">Inspect Audralia</a>
          <a class="button" href="/showroom/globe/">Return to Globe</a>
          <a class="button" href="/showroom/globe/earth/">Face Consequence</a>
          <a class="button" href="/showroom/globe/h-earth/">Open Survival</a>
        </div>
      </section>

      <section class="panel section" aria-labelledby="stage-title">
        <div class="kicker">Satellite globe access</div>
        <h2 id="stage-title">The globe belongs inside this box.</h2>

        <div
          class="stage"
          id="audralia-stage"
          data-audralia-stage="true"
          data-loader-state="pending"
          aria-label="Audralia boxed satellite globe stage"
        >
          <div class="stage-fallback" data-stage-fallback="true">
            Connecting to the existing Audralia globe. No procedural substitute will be painted.
          </div>

          <div
            id="audraliaCanvasMount"
            data-audralia-canvas-mount="true"
            aria-label="Audralia boxed satellite globe canvas mount"
          ></div>
        </div>

        <div class="public-status" aria-live="polite">
          <span id="audraliaRouteLoaderNotice" data-audralia-route-loader-notice="true">Boxed globe bridge preparing</span>
          <span id="audraliaRouteStatus" data-audralia-route-status="true">Existing asset chain pending</span>
        </div>
      </section>

      <section class="panel section" aria-labelledby="standards-title">
        <div class="kicker">Possibility conditions</div>
        <h2 id="standards-title">A living future still needs lawful structure.</h2>

        <div class="cards">
          <article class="card">
            <b>Existing globe</b>
            <strong>The developed Audralia planet is the source.</strong>
            <span>The route attaches to the existing globe assets rather than generating a new land, water, or sky scene.</span>
          </article>

          <article class="card">
            <b>Containment</b>
            <strong>The globe remains inside the inspection box.</strong>
            <span>The stage clips, contains, and adopts the mounted asset so it cannot spill across the page.</span>
          </article>

          <article class="card">
            <b>Canvas</b>
            <strong>The page displays the world.</strong>
            <span>The canvas may consume the asset chain and mount controls; it may not author the planet.</span>
          </article>
        </div>

        <div class="micro-links" aria-label="Return path links">
          <a class="primary" href="/showroom/globe/">Return to Globe</a>
          <a href="/showroom/globe/earth/">ZIONTS</a>
          <a href="/showroom/globe/h-earth/">H-Earth</a>
          <a href="/gauges/">Gauges</a>
        </div>
      </section>

      <template id="route-receipt" data-route-receipt>
AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_SURFACE_TNT_v7
previous=AUDRALIA_RESTORE_EXISTING_SATELLITE_GLOBE_SURFACE_TNT_v6
route=/showroom/globe/audralia/
page=audralia
role=showroom_globe_child_route
public_path=possibility
view_model=satellite_orbital_existing_globe_access_contained
world=Audralia
canonical_spelling=A_U_D_R_A_L_I_A
parent_route=/showroom/globe/
route_loader=/showroom/globe/audralia/index.js
route_loader_contract=AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7
canvas_mount=#audraliaCanvasMount
canvas_contract=AUDRALIA_EXISTING_GLOBE_BOXED_ASSET_CONSUMER_TNT_v7
restore_goal=restore_the_existing_Audralia_globe_built_in_assets_inside_stage_box
containment=true
stage_overflow_hidden=true
asset_adoption=true
satellite_access=true
existing_globe_required=true
asset_chain_required=true
procedural_world_fallback=false
generated_image=false
graphic_box=false
streaming=false
visual_pass_claimed=false
route_owns=route_shell,public_copy,canvas_mount,public_status,cache_key_bump,containment_box
route_does_not_own=land_footprint,climate_authority,surface_truth,gauges_logic,planet_generation,procedural_landscape
receipt_visibility=hidden_template_only
      </template>
    </main>

    <footer>
      Audralia · The Possibility Path · Existing satellite globe access.
    </footer>
  </div>

  <script>
    window.DGB_AUDRALIA_ROUTE_KEY = "AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7";
  </script>
  <script
    src="/showroom/globe/audralia/index.js?v=AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7"
    data-audralia-loader-script="AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7"
    defer
  ></script>
</body>
</html>
