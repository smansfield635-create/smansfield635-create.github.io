<!doctype html>
<html
  lang="en"
  data-page="zionts-public-child-route"
  data-route="/showroom/globe/earth/"
  data-contract="ZIONTS_PUBLIC_CHILD_ROUTE_ALIGNMENT_TNT_v2"
  data-public-body="ZIONTS"
  data-route-history="earth-reference"
  data-ground-engine="false"
  data-parent="/showroom/globe/"
>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>ZIONTS · Diamond Gate Bridge</title>
  <meta
    name="description"
    content="ZIONTS public child route. This path retains Earth-reference route history while presenting ZIONTS as the public body name."
  >

  <style>
    :root {
      --bg:#030812;
      --bg2:#071225;
      --line:rgba(244,207,131,.22);
      --line2:rgba(255,255,255,.12);
      --text:rgba(238,244,255,.94);
      --muted:rgba(238,244,255,.66);
      --faint:rgba(238,244,255,.46);
      --gold:#f4cf83;
      --mint:#a7f3c6;
      color-scheme:dark;
    }

    * { box-sizing:border-box; }

    html, body {
      min-height:100%;
      margin:0;
      background:
        linear-gradient(90deg, rgba(244,207,131,.045) 1px, transparent 1px),
        linear-gradient(180deg, rgba(244,207,131,.025) 1px, transparent 1px),
        radial-gradient(circle at 50% -8%, rgba(78,119,171,.25), transparent 38%),
        radial-gradient(circle at 12% 18%, rgba(244,207,131,.11), transparent 30%),
        linear-gradient(180deg, var(--bg2), var(--bg) 54%, #02050b);
      background-size:58px 58px,58px 58px,auto,auto,auto;
      color:var(--text);
      font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    a { color:inherit; }

    .page {
      width:min(1180px, calc(100% - 28px));
      margin:0 auto;
      padding:22px 0 58px;
    }

    .topbar {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      padding:12px 0 22px;
    }

    .brand {
      color:var(--gold);
      text-decoration:none;
      font-weight:950;
      text-transform:uppercase;
      letter-spacing:.02em;
    }

    .nav, .actions {
      display:flex;
      flex-wrap:wrap;
      gap:8px;
    }

    .nav a, .button {
      min-height:38px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      border:1px solid var(--line2);
      border-radius:999px;
      padding:0 13px;
      color:rgba(238,244,255,.84);
      text-decoration:none;
      background:rgba(255,255,255,.04);
      font-size:.82rem;
      font-weight:850;
    }

    .nav a[aria-current="page"],
    .button.primary {
      color:#06101c;
      background:linear-gradient(135deg, var(--mint), #78d8ac);
      border-color:rgba(167,243,198,.64);
    }

    .button.gold {
      color:#150d03;
      background:linear-gradient(135deg, #fff0b8, var(--gold) 48%, #c48a38);
    }

    .hero, .panel, .card {
      border:1px solid var(--line);
      border-radius:34px;
      background:
        radial-gradient(circle at 76% 28%, rgba(139,200,255,.12), transparent 32%),
        linear-gradient(180deg, rgba(8,17,34,.95), rgba(4,9,20,.96));
      box-shadow:0 24px 70px rgba(0,0,0,.28);
      overflow:hidden;
    }

    .hero { padding:clamp(24px,5vw,46px); }
    .panel { padding:clamp(18px,3vw,28px); margin-top:16px; }

    .eyebrow {
      margin:0 0 14px;
      color:var(--gold);
      font:900 .78rem/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing:.22em;
      text-transform:uppercase;
    }

    h1, h2, h3 {
      margin:0;
      color:var(--gold);
      line-height:1.05;
    }

    h1 {
      max-width:980px;
      font-size:clamp(2.7rem,8vw,5.7rem);
      line-height:.93;
      letter-spacing:-.075em;
    }

    h2 {
      font-size:clamp(1.55rem,4.5vw,2.4rem);
      letter-spacing:-.045em;
    }

    .lede, p {
      color:var(--muted);
      line-height:1.55;
    }

    .lede {
      max-width:900px;
      margin:22px 0 0;
      font-size:clamp(1.02rem,2.5vw,1.28rem);
    }

    .actions { margin-top:26px; }

    .notice {
      margin-top:16px;
      padding:18px;
      border:1px solid rgba(167,243,198,.20);
      border-radius:24px;
      background:rgba(5,38,34,.24);
      color:var(--mint);
      font-weight:900;
      line-height:1.5;
    }

    .route-grid {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:14px;
      margin-top:16px;
    }

    .card {
      padding:18px;
      background:rgba(255,255,255,.055);
      box-shadow:none;
    }

    .card span {
      display:block;
      color:var(--faint);
      font-size:.74rem;
      font-weight:850;
      text-transform:uppercase;
      letter-spacing:.08em;
      margin-bottom:6px;
    }

    .card strong {
      display:block;
      color:var(--gold);
      overflow-wrap:anywhere;
    }

    .footer {
      margin-top:20px;
      padding:20px 0 0;
      color:var(--faint);
      font-size:.82rem;
      text-align:center;
    }

    @media (max-width:900px) {
      .topbar { align-items:flex-start; flex-direction:column; }
      .route-grid { grid-template-columns:1fr; }
    }

    @media (max-width:560px) {
      .page { width:min(100% - 18px,1180px); }
      .hero, .panel { border-radius:24px; }
    }
  </style>
</head>

<body>
  <div class="page">
    <header class="topbar">
      <a class="brand" href="/showroom/">◆ Diamond Gate Bridge</a>
      <nav class="nav">
        <a href="/">Compass</a>
        <a href="/showroom/">Showroom</a>
        <a href="/showroom/globe/">Globe</a>
        <a href="/showroom/globe/earth/" aria-current="page">ZIONTS</a>
        <a href="/showroom/globe/h-earth/">H-Earth</a>
        <a href="/showroom/globe/audralia/">Audralia</a>
        <a href="/gauges/">Triple G</a>
      </nav>
    </header>

    <main id="main">
      <section class="hero">
        <p class="eyebrow">ZIONTS · Public Child Route</p>
        <h1>ZIONTS is the public body name for this child route.</h1>
        <p class="lede">
          This route keeps its Earth-reference path history, but the public selector body is ZIONTS. The shared cinematic planetary view remains on the locked Globe parent.
        </p>

        <div class="actions">
          <a class="button primary" href="/showroom/globe/">Return to Globe Selector</a>
          <a class="button gold" href="/showroom/globe/h-earth/">Open H-Earth</a>
          <a class="button" href="/showroom/globe/audralia/">Open Audralia</a>
        </div>

        <div class="notice">
          Naming boundary closed: `/showroom/globe/earth/` is route history. ZIONTS is the public child body label.
        </div>
      </section>

      <section class="panel">
        <p class="eyebrow">Route boundary</p>
        <h2>Reference history preserved; public identity aligned.</h2>

        <div class="route-grid">
          <article class="card"><span>Route</span><strong>/showroom/globe/earth/</strong></article>
          <article class="card"><span>Public body</span><strong>ZIONTS</strong></article>
          <article class="card"><span>Route history</span><strong>Earth reference path</strong></article>
          <article class="card"><span>Shared visual scale</span><strong>/showroom/globe/</strong></article>
          <article class="card"><span>Ground engine</span><strong>Not authorized here</strong></article>
          <article class="card"><span>Hearth content</span><strong>Forbidden here</strong></article>
        </div>
      </section>
    </main>

    <footer class="footer">Diamond Gate Bridge · ZIONTS child route aligned.</footer>
  </div>

  <script>
    window.DGB_ZIONTS_ROUTE_KEY = "ZIONTS_PUBLIC_CHILD_ROUTE_ALIGNMENT_TNT_v2";
  </script>
  <script type="module" src="/showroom/globe/earth/index.js?v=ZIONTS_PUBLIC_CHILD_ROUTE_ALIGNMENT_TNT_v2"></script>
</body>
</html>
