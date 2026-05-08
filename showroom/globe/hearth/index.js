<!-- /showroom/globe/hearth/index.html -->
<!doctype html>
<html
  lang="en"
  data-page="hearth-g3-boundary-alignment-route"
  data-route="/showroom/globe/hearth/"
  data-contract="HEARTH_G3_BOUNDARY_ALIGNMENT_ROUTE_HTML_TNT_v1"
  data-family-contract="HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1"
  data-generation="G3"
  data-hearth-route="true"
  data-hearth-standard="boundary-aligned-landmass-family"
  data-language-layer="globe"
  data-construction-layer="planet"
  data-general-regions="4"
  data-countries="16"
  data-summit-regions-per-general-region="9"
  data-total-summit-regions="36"
  data-old-g2-contract-retired="true"
  data-old-g3-4-terrain-retired="true"
  data-old-g3-7-hydration-retired="true"
  data-old-g3-9-canvas-retired="true"
  data-old-g3-10-chain-retired="true"
  data-round-blob-standard-retired="true"
  data-hydration-deferred="true"
  data-terrain-detail-deferred="true"
  data-mountains-deferred="true"
  data-climate-weather-clouds-deferred="true"
  data-generated-image="false"
  data-graphic-box="false"
>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>Diamond Gate Bridge · Hearth</title>
  <meta
    name="description"
    content="Hearth Generation 3 boundary-aligned landmass-family standard: four general regions, sixteen countries, and nine progressive Summit regions per general region. Globe remains route language. The constructed object is a planet."
  >

  <style>
    :root {
      --bg: #020711;
      --panel: rgba(7, 18, 33, 0.80);
      --panel2: rgba(8, 25, 43, 0.66);
      --line: rgba(135, 187, 221, 0.20);
      --text: rgba(232, 244, 252, 0.95);
      --muted: rgba(190, 214, 230, 0.72);
      --gold: rgba(236, 196, 102, 0.94);
      --green: rgba(112, 214, 174, 0.84);
    }

    * { box-sizing: border-box; }

    html,
    body {
      margin: 0;
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      touch-action: pan-y;
      -webkit-overflow-scrolling: touch;
      background:
        radial-gradient(circle at 50% 14%, rgba(39, 93, 134, 0.30), transparent 36rem),
        radial-gradient(circle at 50% 58%, rgba(42, 112, 160, 0.16), transparent 42rem),
        var(--bg);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    a { color: inherit; text-decoration: none; }

    .skip-link {
      position: absolute;
      left: 1rem;
      top: -4rem;
      z-index: 20;
      padding: 0.65rem 0.85rem;
      border-radius: 999px;
      background: var(--gold);
      color: #06111f;
      font-weight: 900;
      transition: top 160ms ease;
    }

    .skip-link:focus { top: 1rem; }

    .page {
      width: min(1120px, calc(100% - 28px));
      margin: 0 auto;
      padding: 18px 0 42px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0 18px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border: 1px solid rgba(236, 196, 102, 0.34);
      border-radius: 50%;
      color: var(--gold);
      background: rgba(236, 196, 102, 0.08);
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
    }

    nav a,
    .route-link {
      border: 1px solid rgba(135, 187, 221, 0.18);
      border-radius: 999px;
      padding: 8px 10px;
      color: var(--muted);
      background: rgba(5, 16, 30, 0.46);
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    nav a[aria-current="page"],
    .route-link.primary {
      color: #06111f;
      background: var(--gold);
      border-color: rgba(236, 196, 102, 0.70);
    }

    .hero {
      display: grid;
      gap: 18px;
      grid-template-columns: minmax(0, 1.05fr) minmax(310px, 0.95fr);
      align-items: center;
      padding: 22px;
      border: 1px solid rgba(135, 187, 221, 0.18);
      border-radius: 28px;
      background:
        linear-gradient(135deg, rgba(9, 21, 39, 0.88), rgba(8, 28, 50, 0.58)),
        rgba(3, 10, 20, 0.72);
      box-shadow: 0 22px 80px rgba(0, 0, 0, 0.35);
      overflow: hidden;
    }

    .eyebrow {
      margin: 0 0 10px;
      color: var(--gold);
      font-size: 0.78rem;
      font-weight: 900;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.4rem, 7vw, 5rem);
      line-height: 0.92;
      letter-spacing: -0.06em;
    }

    .lede {
      max-width: 66ch;
      margin: 16px 0 0;
      color: var(--muted);
      font-size: 1rem;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    .hearth-stage {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      min-height: 310px;
      border-radius: 32px;
      border: 1px solid rgba(135, 187, 221, 0.18);
      background:
        radial-gradient(circle at 50% 48%, rgba(54, 152, 220, 0.15), transparent 52%),
        linear-gradient(180deg, rgba(4, 13, 25, 0.72), rgba(2, 7, 15, 0.92));
      overflow: hidden;
      isolation: isolate;
      touch-action: pan-y;
    }

    #hearthCanvasMount {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      min-height: 300px;
      overflow: hidden;
      isolation: isolate;
      touch-action: pan-y;
    }

    #hearthCanvasMount canvas[data-hearth-canvas] {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
      touch-action: pan-y;
    }

    .audit-panel {
      margin-top: 18px;
      padding: 18px;
      border: 1px solid rgba(135, 187, 221, 0.16);
      border-radius: 24px;
      background: var(--panel2);
    }

    .audit-panel h2 {
      margin: 0 0 10px;
      font-size: 1rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .audit-panel p {
      margin: 0;
      color: var(--muted);
      line-height: 1.55;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-top: 18px;
    }

    .status-card {
      min-height: 92px;
      padding: 14px;
      border: 1px solid rgba(135, 187, 221, 0.16);
      border-radius: 20px;
      background: var(--panel);
    }

    .status-card strong {
      display: block;
      margin-bottom: 6px;
      color: var(--text);
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .status-card span {
      color: var(--muted);
      font-size: 0.86rem;
      line-height: 1.35;
    }

    .status-card[data-state="active"] strong { color: var(--green); }
    .status-card[data-state="closed"] strong { color: var(--gold); }

    @media (max-width: 820px) {
      .topbar { align-items: flex-start; flex-direction: column; }
      nav { justify-content: flex-start; }
      .hero { grid-template-columns: 1fr; padding: 16px; }
      .status-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>

<body data-hearth-route-ready="false">
  <a class="skip-link" href="#hearth-main">Skip to Hearth</a>

  <div class="page">
    <header class="topbar" aria-label="Hearth route header">
      <a class="brand" href="/">
        <span class="brand-mark">H</span>
        <span>Diamond Gate Bridge</span>
      </a>

      <nav aria-label="Primary navigation">
        <a href="/">Compass</a>
        <a href="/showroom/globe/">Globe Split</a>
        <a href="/showroom/globe/earth/">Earth</a>
        <a href="/showroom/globe/hearth/" aria-current="page">Hearth</a>
        <a href="/showroom/globe/audralia/">Audralia</a>
        <a href="/gauges/">Gauges</a>
      </nav>
    </header>

    <main id="hearth-main" class="hero">
      <section aria-labelledby="hearth-title">
        <p class="eyebrow">Hearth · Generation 3 Boundary Alignment</p>
        <h1 id="hearth-title">Hearth</h1>

        <p class="lede">
          Hearth is standardized under one G3 boundary-aligned landmass-family contract. The planet
          contains four independently sized general regions, sixteen countries, and nine progressive
          Summit regions per general region. Globe remains route language. The rendered object is a planet.
        </p>

        <div class="actions" aria-label="Hearth route actions">
          <a class="route-link primary" href="/showroom/globe/">Return to Globe Split</a>
          <a class="route-link" href="/showroom/globe/earth/">Inspect Earth</a>
          <a class="route-link" href="/showroom/globe/audralia/">Inspect Audralia</a>
          <a class="route-link" href="/gauges/">Run Gauges</a>
        </div>

        <section class="audit-panel" aria-label="Route audit summary">
          <h2>Route Status</h2>
          <p>
            Five-file lane standardized. Old G2, G3.4, G3.7, G3.9, and G3.10 contracts retired.
            Hydration, terrain detail, mountains, weather, climate, clouds, humidity, and atmospheric moisture remain closed.
          </p>
        </section>
      </section>

      <section class="hearth-stage" aria-label="Hearth planet stage">
        <div
          id="hearthCanvasMount"
          data-hearth-mount
          data-render="hearth"
          data-body="hearth"
          data-contract="HEARTH_G3_BOUNDARY_ALIGNMENT_ROUTE_HTML_TNT_v1"
          data-family-contract="HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1"
          data-generation="G3"
          data-hearth-standard="boundary-aligned-landmass-family"
          data-language-layer="globe"
          data-construction-layer="planet"
          data-general-regions="4"
          data-countries="16"
          data-summit-regions-per-general-region="9"
          data-hydration-deferred="true"
          data-terrain-detail-deferred="true"
          data-climate-weather-clouds-deferred="true"
          aria-label="Hearth G3 boundary-aligned landmass-family mount"
        ></div>
      </section>
    </main>

    <section class="status-grid" aria-label="Hearth G3 status">
      <article class="status-card" data-state="active">
        <strong>4 General Regions</strong>
        <span>Independently sized landmass-family regions.</span>
      </article>

      <article class="status-card" data-state="active">
        <strong>16 Countries</strong>
        <span>Four countries per general region.</span>
      </article>

      <article class="status-card" data-state="active">
        <strong>9 Summits</strong>
        <span>Progressive access ladder inside each region.</span>
      </article>

      <article class="status-card" data-state="closed">
        <strong>Deferred</strong>
        <span>Hydration, mountains, weather, climate, clouds, humidity.</span>
      </article>
    </section>
  </div>

  <script src="./index.js?v=hearth-g3-boundary-alignment-all-five-files-v1" defer></script>
</body>
</html>
