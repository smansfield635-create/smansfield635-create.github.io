<!DOCTYPE html>
<html
  lang="en"
  data-page-id="showroom-globe-inspect"
  data-page="showroom-globe-inspect"
  data-generation="showroom-dedicated-globe-inspection-v1"
  data-estate="rich-manor-and-estate"
  data-manor-skin="active"
  data-house-field="true"
  data-gauges-truth="live-authority"
  data-construct-class="inspection"
  data-parent-route="/showroom/"
  data-render-controller="/showroom/globe/index.js"
  data-earth-canvas-spine="/assets/earth/earth_canvas.js"
  data-earth-material="/assets/earth/earth_material.css"
  data-earth-surface="/assets/earth/earth_surface_2048.jpg"
  data-earth-clouds="/assets/earth/earth_clouds_2048.jpg"
  data-earth-standard="centered-satellite-earth-no-external-rings"
>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />

  <title>Inspect Globe · Showroom · Diamond Gate Bridge</title>

  <meta
    name="description"
    content="Dedicated globe inspection page for the Showroom. Empty universe field, centered Earth canvas, and return path to Showroom."
  />

  <link rel="stylesheet" href="/assets/earth/earth_material.css?v=showroom-dedicated-globe-inspection-v1" />

  <style>
    :root {
      color-scheme: dark;
      --ink: #f4f7ff;
      --soft: rgba(244, 247, 255, .72);
      --muted: rgba(244, 247, 255, .52);
      --gold: #f2c76f;
      --line: rgba(244, 247, 255, .14);
      --line-gold: rgba(242, 199, 111, .44);
      --black: #02050a;
      --panel: rgba(2, 5, 10, .78);
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      min-height: 100%;
      background: var(--black);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow: hidden;
    }

    body {
      background:
        radial-gradient(circle at 50% 46%, rgba(78, 136, 220, .16), transparent 36%),
        radial-gradient(circle at 78% 22%, rgba(242, 199, 111, .08), transparent 26%),
        radial-gradient(circle at 24% 78%, rgba(90, 150, 255, .10), transparent 28%),
        linear-gradient(180deg, #00030a 0%, #020714 58%, #000208 100%);
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: .82;
      background-image:
        radial-gradient(circle, rgba(255,255,255,.86) 0 1px, transparent 1.35px),
        radial-gradient(circle, rgba(255,255,255,.34) 0 1px, transparent 1.8px),
        radial-gradient(circle, rgba(242,199,111,.30) 0 1px, transparent 1.7px);
      background-size: 84px 84px, 156px 156px, 234px 234px;
      background-position: 0 0, 42px 66px, 88px 130px;
    }

    body::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 48%, rgba(255,255,255,.04), transparent 30%),
        radial-gradient(circle at 50% 48%, transparent 0 36%, rgba(0,0,0,.38) 78%, rgba(0,0,0,.78) 100%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button,
    a {
      -webkit-tap-highlight-color: transparent;
    }

    a:focus-visible,
    button:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 4px;
    }

    .inspect-shell {
      position: relative;
      z-index: 2;
      width: 100vw;
      height: 100svh;
      min-height: 100svh;
      overflow: hidden;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .inspect-topbar {
      position: relative;
      z-index: 50;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: clamp(16px, 3vw, 30px);
      pointer-events: none;
    }

    .inspect-brand {
      display: grid;
      gap: 4px;
      pointer-events: auto;
    }

    .inspect-brand strong {
      color: var(--gold);
      font-size: clamp(.82rem, 2.8vw, 1.08rem);
      letter-spacing: .20em;
      line-height: 1.1;
      text-transform: uppercase;
    }

    .inspect-brand span {
      color: var(--soft);
      font-size: clamp(.9rem, 2.8vw, 1.18rem);
    }

    .return-link {
      pointer-events: auto;
      border: 1px solid var(--line-gold);
      border-radius: 999px;
      padding: 11px 15px;
      background: rgba(3, 7, 12, .72);
      color: var(--ink);
      backdrop-filter: blur(14px);
      box-shadow:
        0 18px 58px rgba(0,0,0,.40),
        inset 0 0 0 1px rgba(255,255,255,.045);
      font-weight: 800;
      white-space: nowrap;
    }

    .return-link:hover {
      background: rgba(242,199,111,.18);
    }

    .inspect-stage {
      position: relative;
      z-index: 10;
      width: 100vw;
      height: 100%;
      min-height: 0;
      display: grid;
      place-items: center;
      padding: 0 clamp(10px, 3vw, 32px) clamp(18px, 4vh, 36px);
    }

    #showroom-globe-mount {
      position: relative !important;
      z-index: 20 !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      display: grid !important;
      place-items: center !important;
      padding: 0 !important;
      margin: 0 !important;
      transform: none !important;
    }

    #showroom-globe-mount .showroom-earth-clearance {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      min-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    #showroom-globe-mount .showroom-earth-canvas-shell {
      width: 100% !important;
      height: 100% !important;
      display: grid !important;
      grid-template-rows: 1fr auto auto !important;
      align-items: center !important;
      justify-items: center !important;
      gap: clamp(10px, 2vh, 18px) !important;
      padding: 0 0 clamp(8px, 2vh, 18px) !important;
      margin: 0 !important;
    }

    #showroom-globe-mount .showroom-earth-visual-stack {
      width: 100% !important;
      height: 100% !important;
      display: grid !important;
      grid-template-rows: 1fr auto auto !important;
      align-items: center !important;
      justify-items: center !important;
      gap: clamp(10px, 2vh, 18px) !important;
      transform: none !important;
    }

    #showroom-globe-mount [data-dgb-earth-mount],
    #showroom-globe-mount .dgb-earth-stage {
      width: min(82vmin, 900px) !important;
      max-width: 94vw !important;
      margin: 0 auto !important;
      transform: none !important;
    }

    #showroom-globe-mount .dgb-earth-tilt,
    #showroom-globe-mount .dgb-earth-sphere {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      transform: none !important;
    }

    #showroom-globe-mount .dgb-earth-sphere {
      filter:
        drop-shadow(0 0 34px rgba(97, 153, 236, .34))
        drop-shadow(0 0 82px rgba(242, 199, 111, .10));
    }

    #showroom-globe-mount [data-dgb-earth-canvas] {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      max-width: 100% !important;
    }

    #showroom-globe-mount .dgb-earth-control-panel {
      width: min(560px, 88vw) !important;
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 10px !important;
      margin: 0 auto !important;
      opacity: .42;
      filter: grayscale(.55);
      transform: scale(.94);
      transition: opacity .18s ease, filter .18s ease, transform .18s ease;
    }

    #showroom-globe-mount .dgb-earth-control-panel:hover,
    #showroom-globe-mount .dgb-earth-control-panel:focus-within {
      opacity: .96;
      filter: none;
      transform: scale(1);
    }

    #showroom-globe-mount .dgb-earth-control-button,
    #showroom-globe-mount .dgb-earth-control-readout {
      min-height: clamp(44px, 6.8vh, 64px) !important;
      border: 1px solid rgba(255,255,255,.13) !important;
      border-radius: 999px !important;
      display: grid !important;
      place-items: center !important;
      background: rgba(0, 3, 9, .72) !important;
      color: rgba(255,255,255,.94) !important;
      font-size: clamp(.92rem, 3.4vw, 1.22rem) !important;
      font-weight: 850 !important;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.035),
        0 10px 32px rgba(0,0,0,.24) !important;
    }

    #showroom-globe-mount .dgb-earth-control-button {
      cursor: pointer;
    }

    #showroom-globe-mount .dgb-earth-control-button:hover {
      border-color: var(--line-gold) !important;
      background: rgba(242,199,111,.16) !important;
    }

    #showroom-globe-mount .dgb-earth-control-readout {
      grid-column: 1 / -1 !important;
      color: rgba(211, 215, 238, .86) !important;
      letter-spacing: .03em !important;
    }

    #showroom-globe-mount .dgb-earth-caption {
      width: min(760px, 90vw) !important;
      margin: 0 auto !important;
      color: rgba(255,255,255,.70) !important;
      font-size: clamp(.62rem, 2.5vw, .9rem) !important;
      font-weight: 900 !important;
      letter-spacing: .14em !important;
      line-height: 1.35 !important;
      text-align: center !important;
      text-transform: uppercase !important;
      opacity: .48;
    }

    .fallback-card {
      width: min(720px, calc(100vw - 34px));
      border: 1px solid var(--line-gold);
      border-radius: 28px;
      padding: 24px;
      background: var(--panel);
      box-shadow: 0 28px 90px rgba(0,0,0,.44);
    }

    .fallback-card h2 {
      margin: 0 0 12px;
      font-size: clamp(1.8rem, 5vw, 3.4rem);
      letter-spacing: -.05em;
    }

    .fallback-card p,
    .fallback-card .kicker {
      color: var(--soft);
      line-height: 1.45;
    }

    .audit-source,
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
      clip: rect(0 0 0 0) !important;
      clip-path: inset(50%) !important;
      white-space: nowrap !important;
      border: 0 !important;
      padding: 0 !important;
      margin: -1px !important;
    }

    @media (max-width: 760px) {
      .inspect-topbar {
        padding: 16px 18px;
      }

      .inspect-brand span {
        display: none;
      }

      .return-link {
        padding: 10px 13px;
        font-size: .92rem;
      }

      .inspect-stage {
        padding-bottom: 14px;
      }

      #showroom-globe-mount [data-dgb-earth-mount],
      #showroom-globe-mount .dgb-earth-stage {
        width: min(74vmin, 92vw) !important;
      }

      #showroom-globe-mount .dgb-earth-control-panel {
        width: min(440px, 86vw) !important;
      }
    }
  </style>
</head>

<body>
  <main
    class="inspect-shell"
    data-page-id="showroom-globe-inspect"
    data-page="showroom-globe-inspect"
    data-estate="rich-manor-and-estate"
    data-manor-skin="active"
    data-house-field="true"
    data-gauges-truth="live-authority"
    data-construct-class="inspection"
    data-parent-route="/showroom/"
  >
    <header class="inspect-topbar">
      <a class="inspect-brand" href="/showroom/" aria-label="Return to Showroom">
        <strong>Diamond Gate Bridge</strong>
        <span>Inspect Globe · Empty Universe Field</span>
      </a>

      <a class="return-link" href="/showroom/">Return to Showroom</a>
    </header>

    <section class="inspect-stage" aria-label="Globe inspection field">
      <div
        id="showroom-globe-mount"
        class="showroom-globe-mount showroom-globe-inspection-mount"
        aria-live="polite"
        data-render-root="showroom-globe"
        data-render-status="waiting"
        data-render-controller="/showroom/globe/index.js"
        data-earth-canvas-spine="/assets/earth/earth_canvas.js"
        data-earth-material="/assets/earth/earth_material.css"
        data-earth-surface="/assets/earth/earth_surface_2048.jpg"
        data-earth-clouds="/assets/earth/earth_clouds_2048.jpg"
        data-earth-standard="centered-satellite-earth-no-external-rings"
        data-demo-universe="globe-only"
        data-estate-land-placement="mirror-universe-only"
        data-showroom-globe-placement="dedicated-inspection-page"
      >
        <noscript>
          <article class="fallback-card">
            <p class="kicker">Globe inspection fallback</p>
            <h2>Orbital Earth</h2>
            <p>JavaScript is required for the Earth canvas inspection page.</p>
          </article>
        </noscript>
      </div>
    </section>

    <section class="audit-source" aria-label="Showroom globe inspection audit source">
      <a href="/showroom/">Showroom</a>
      <a href="/">Compass</a>
      <a href="/gauges/">Gauges</a>
      <span>route-exists</span>
      <span>estate=rich-manor-and-estate</span>
      <span>manor-skin=active</span>
      <span>house-field=true</span>
      <span>gauges-truth=live-authority</span>
      <span>construct-class=inspection</span>
      <span>parent-route=/showroom/</span>
      <span>render-controller=/showroom/globe/index.js</span>
      <span>earth-canvas-spine=/assets/earth/earth_canvas.js</span>
      <span>earth-material=/assets/earth/earth_material.css</span>
      <span>earth-surface=/assets/earth/earth_surface_2048.jpg</span>
      <span>earth-clouds=/assets/earth/earth_clouds_2048.jpg</span>
      <span>earth-standard=centered-satellite-earth-no-external-rings</span>
      <span>SHOWROOM_DEDICATED_INSPECT_GLOBE_PAGE_TNT_v1</span>
    </section>
  </main>

  <script src="/assets/earth/earth_canvas.js?v=showroom-dedicated-globe-inspection-v1" defer></script>
  <script src="/showroom/globe/index.js?v=showroom-dedicated-globe-inspection-v1" defer></script>
</body>
</html>
