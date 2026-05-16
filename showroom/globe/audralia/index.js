<!doctype html>
<html
  lang="en"
  data-route="/showroom/globe/audralia/"
  data-page="audralia-living-canvas"
  data-contract="AUDRALIA_ROUTE_SHELL_V3_LOADER_BUMP_TNT_v3"
  data-previous-contract="AUDRALIA_ROUTE_SHELL_CANONICAL_LOADER_BUMP_TNT_v2"
  data-role="showroom-globe-child-route"
  data-world="Audralia"
  data-canonical-spelling="A_U_D_R_A_L_I_A"
  data-parent-route="/showroom/globe/"
  data-route-loader="/showroom/globe/audralia/index.js"
  data-route-loader-contract="AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3"
  data-canvas-contract="AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3"
  data-landmap-contract="AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1"
  data-climate-contract="AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2"
  data-generated-image="false"
  data-graphic-box="false"
  data-heavy-runtime-loaded="false"
  data-streaming="false"
  data-visual-pass-claimed="false"
>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">

  <title>Audralia · The Living Canvas · Diamond Gate Bridge</title>
  <meta
    name="description"
    content="Audralia is the living canvas route for the Diamond Gate Bridge Globe question: a possible future that can be seen, understood, and considered before it is lost."
  >

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
      --green-line:rgba(158,240,191,.26);
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
      min-height:clamp(22rem,42vw,33rem);
      display:grid;
      align-content:center;
      gap:1rem;
      padding:clamp(1.45rem,5vw,3.4rem);
      margin-top:.6rem;
      isolation:isolate;
    }

    .hero::before {
      content:"";
      position:absolute;
      right:clamp(1rem,6vw,5.5rem);
      top:50%;
      z-index:0;
      width:clamp(9rem,25vw,18rem);
      height:clamp(9rem,25vw,18rem);
      border:1px solid rgba(158,240,191,.16);
      border-radius:999px;
      transform:translateY(-50%);
      background:
        radial-gradient(circle at 44% 36%,rgba(158,240,191,.14),transparent 38%),
        radial-gradient(circle at 56% 66%,rgba(36,120,255,.16),transparent 62%),
        linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.01));
      animation:anchorPulse 8s ease-in-out infinite;
      pointer-events:none;
      opacity:.52;
    }

    @keyframes anchorPulse {
      0%,100% { opacity:.38; filter:brightness(.95); }
      50% { opacity:.62; filter:brightness(1.1); }
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
      font-size:clamp(3rem,9vw,6.8rem);
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
      border-color:rgba(243,200,111,.9);
      color:#060811;
      background:linear-gradient(135deg,#fff2a8,#f3c86f);
      box-shadow:0 .8rem 1.8rem rgba(243,200,111,.13);
    }

    .section {
      margin-top:1.15rem;
      padding:clamp(1rem,3vw,1.45rem);
      display:grid;
      gap:1.05rem;
    }

    .route-loader-notice {
      display:block;
      width:fit-content;
      max-width:100%;
      padding:.72rem .9rem;
      border:1px solid rgba(243,200,111,.44);
      border-radius:999px;
      color:rgba(255,232,168,.98);
      background:rgba(40,26,4,.74);
      font-size:.74rem;
      font-weight:950;
      letter-spacing:.06em;
      text-transform:uppercase;
    }

    .status-card {
      border:1px solid var(--green-line);
      border-radius:1.35rem;
      padding:1rem 1.1rem;
      color:rgba(206,255,228,.94);
      background:
        radial-gradient(circle at 12% 0%,rgba(158,240,191,.10),transparent 60%),
        rgba(2,20,22,.72);
      font-weight:850;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
      overflow-wrap:anywhere;
    }

    .stage {
      position:relative;
      min-height:clamp(24rem,68vw,46rem);
      border:1px solid rgba(243,200,111,.22);
      border-radius:clamp(1.35rem,5vw,2.35rem);
      overflow:hidden;
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
      display:grid;
      place-items:center;
      padding:1rem;
      color:rgba(230,238,255,.70);
      text-align:center;
      font-weight:850;
      pointer-events:none;
    }

    [data-audralia-canvas-mount="true"] {
      position:absolute;
      inset:0;
      z-index:2;
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
      .topbar {
        grid-template-columns:1fr;
        align-items:start;
      }

      .nav { justify-content:flex-start; }
    }

    @media (max-width:720px) {
      .shell { width:min(100% - 22px,var(--max)); }
      h1 { font-size:clamp(3rem,17vw,5rem); }

      .hero {
        min-height:27rem;
        padding:1rem;
      }

      .actions { display:grid; }
      .button { width:100%; }
      .cards { grid-template-columns:1fr; }
      .stage { min-height:23rem; }
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
      <a class="brand" href="/">
        <span class="brand-mark" aria-hidden="true"><span>AU</span></span>
        <span class="brand-copy">
          <span>Diamond Gate Bridge</span>
          <strong>Audralia</strong>
        </span>
      </a>

      <nav class="nav" aria-label="Primary navigation">
        <a href="/">Compass</a>
        <a href="/door/">Door</a>
        <a href="/home/">Home</a>
        <a href="/explore/">Manor</a>
        <a href="/nine-summits/">Nine Summits</a>
        <a href="/products/">Products</a>
        <a href="/showroom/">Showroom</a>
        <a href="/showroom/globe/">Globe</a>
        <a href="/showroom/globe/audralia/" aria-current="page">Audralia</a>
        <a href="/showroom/globe/earth/">Earth</a>
        <a href="/showroom/globe/h-earth/">H-Earth</a>
        <a href="/gauges/">Gauges</a>
      </nav>
    </header>

    <main id="audralia-main">
      <section class="panel hero" aria-labelledby="page-title">
        <div class="kicker">Audralia · The Living Canvas</div>
        <h1 id="page-title">A possible future should be visible before it is lost.</h1>

        <p class="lead">
          Audralia is the constructed living-world route. It uses the 256 nodal lattice, Nine Summits province fields, Earth-legacy landforms, climate detail, and a consumer-only canvas to show a future world without turning the canvas into the authority.
        </p>

        <div class="principle">
          Audralia answers the Globe question as a living canvas: a possible future that can be seen, understood, and considered before it is lost.
        </div>

        <div class="actions">
          <a class="button gold" href="/showroom/globe/audralia/#audralia-stage">Inspect Audralia</a>
          <a class="button" href="/showroom/globe/">Return to Globe</a>
          <a class="button" href="/gauges/">Read Gauges</a>
        </div>
      </section>

      <section class="panel section" aria-labelledby="chain-title">
        <div class="kicker">Route chain status</div>
        <h2 id="chain-title">The route shell now verifies the newer Audralia chain.</h2>

        <div
          id="audraliaRouteLoaderNotice"
          class="route-loader-notice"
          data-audralia-route-loader-notice="true"
          aria-live="polite"
        >
          Route shell v3 live · waiting for climate-v2 status alignment loader.
        </div>

        <div class="status-card" id="audraliaRouteStatus" data-audralia-route-status="true">
          If this message remains, /showroom/globe/audralia/index.js did not load with AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3.
        </div>

        <div
          id="audralia-stage"
          class="stage"
          data-audralia-stage="true"
          aria-label="Audralia living canvas stage"
        >
          <div class="stage-fallback" data-stage-fallback="true">
            Audralia canvas mount awaiting canonical loader v3.
          </div>
          <div
            id="audraliaCanvasMount"
            data-audralia-canvas-mount="true"
            aria-label="Audralia canvas mount"
          ></div>
        </div>
      </section>

      <section class="panel section" aria-labelledby="standards-title">
        <div class="kicker">Current standards</div>
        <h2 id="standards-title">Canvas consumes. Landmap and climate author the world.</h2>

        <div class="cards">
          <article class="card">
            <b>Footprint</b>
            <strong>Landmap owns land and sea.</strong>
            <span>The route expects the 30-billion-year Earth-legacy organic landform contract to provide continent, shelf, beach, and nodal geometry truth.</span>
          </article>

          <article class="card">
            <b>Climate</b>
            <strong>Climate owns environment detail.</strong>
            <span>The route expects rainforest, wetland, savanna, dry basin, forest, alpine, snow, beach, and restoration-zone detail from the climate layer.</span>
          </article>

          <article class="card">
            <b>Canvas</b>
            <strong>Canvas stays consumer-only.</strong>
            <span>The canvas may display the living world, atmosphere, shimmer, and inspection readout. It may not invent footprint, climate, or surface truth.</span>
          </article>
        </div>
      </section>

      <template id="route-receipt" data-route-receipt>
AUDRALIA_ROUTE_SHELL_V3_LOADER_BUMP_TNT_v3
previous=AUDRALIA_ROUTE_SHELL_CANONICAL_LOADER_BUMP_TNT_v2
route=/showroom/globe/audralia/
page=audralia
role=showroom_globe_child_route
world=Audralia
canonical_spelling=A_U_D_R_A_L_I_A
route_loader=/showroom/globe/audralia/index.js
route_loader_contract=AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3
canvas_mount=#audraliaCanvasMount
canvas_contract=AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3
landmap_contract=AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1
climate_contract=AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2
route_expectation=canonical_loader_v3_retires_false_climate_stale_status
retired_false_status=Climate Detail loaded stale AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2
expected_status=Audralia route mounted canonical chain active
expected_chain=Lattice 256 active,Organic Landmap active,Climate Detail active,Beach Authority active,Groundcover active,Land Surface active,Visible Notice Canvas active
route_owns=route_shell,public_copy,canvas_mount,route_loader_notice,chain_status_panel,cache_key_bump
route_does_not_own=land_footprint,climate_authority,surface_truth,canvas_authority,runtime_motion,gauges_logic
receipt_visibility=hidden_template_only
generated_image=false
graphic_box=false
streaming=false
visual_pass_claimed=false
      </template>
    </main>

    <footer>
      AUDRALIA_ROUTE_SHELL_V3_LOADER_BUMP_TNT_v3 · Audralia · The Living Canvas.
    </footer>
  </div>

  <script
    src="/showroom/globe/audralia/index.js?v=AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3"
    data-audralia-loader-script="AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3"
    defer
  ></script>
</body>
</html>
