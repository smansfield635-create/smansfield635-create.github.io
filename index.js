<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>Why the Metaverse Works | Under the Hood</title>
  <meta
    name="description"
    content="Why the metaverse works, what is actually under the hood, and how laws and CPU processing govern the platform. Includes direct frontier access."
  />
  <style>
    :root{
      --bg:#05070b;
      --bg2:#08101a;
      --bg3:#0d1623;
      --panel:#0b0f16;
      --panel2:#101722;
      --line:#1f2a36;
      --line2:rgba(127,255,212,.16);
      --text:#e8f6ff;
      --muted:rgba(232,246,255,.68);
      --muted2:rgba(232,246,255,.48);
      --accent:#7fffd4;
      --accent2:#6fe7ff;
      --warn:#ffd27a;
      --good:#7fffd4;
      --shadow:0 14px 40px rgba(0,0,0,.30);
      --shadow2:0 20px 70px rgba(0,0,0,.38);
      --safe-top:env(safe-area-inset-top,0px);
      --safe-right:env(safe-area-inset-right,0px);
      --safe-bottom:env(safe-area-inset-bottom,0px);
      --safe-left:env(safe-area-inset-left,0px);
      --maxw:1440px;
      --radius:16px;
      --radius2:22px;
    }

    *{box-sizing:border-box}
    html,body{
      margin:0;
      min-height:100%;
      background:
        radial-gradient(circle at 50% -10%, rgba(111,231,255,.08), transparent 28%),
        radial-gradient(circle at 12% 18%, rgba(127,255,212,.04), transparent 22%),
        linear-gradient(180deg,var(--bg3),var(--bg2) 36%,var(--bg));
      color:var(--text);
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
    }

    body{min-height:100vh;overflow-x:hidden}

    .hostGlow,
    .gridLines{
      position:fixed;
      inset:0;
      pointer-events:none;
      z-index:0;
    }

    .hostGlow{
      background:
        radial-gradient(circle at 50% 12%, rgba(127,255,212,.050), transparent 18%),
        radial-gradient(circle at 50% 48%, rgba(111,231,255,.028), transparent 22%),
        radial-gradient(circle at 50% 86%, rgba(255,210,122,.020), transparent 18%);
      filter:blur(10px);
    }

    .gridLines{
      background-image:
        linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
      background-size:40px 40px;
      mask-image:linear-gradient(180deg,rgba(0,0,0,.28),rgba(0,0,0,.10));
    }

    .wrap{
      position:relative;
      z-index:1;
      max-width:var(--maxw);
      margin:0 auto;
      padding:calc(16px + var(--safe-top)) calc(16px + var(--safe-right)) calc(28px + var(--safe-bottom)) calc(16px + var(--safe-left));
    }

    .topbar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:12px 14px;
      border:1px solid var(--line);
      border-radius:14px;
      background:
        linear-gradient(180deg,rgba(11,15,22,.96),rgba(16,23,34,.96)),
        radial-gradient(circle at 18% 18%, rgba(127,255,212,.05), transparent 26%);
      box-shadow:var(--shadow);
      margin-bottom:12px;
    }

    .brand{
      font-size:12px;
      font-weight:800;
      letter-spacing:.12em;
      text-transform:uppercase;
      color:var(--accent);
    }

    .stamp{
      font-size:11px;
      color:var(--muted);
      white-space:nowrap;
    }

    .hero{
      display:grid;
      grid-template-columns:minmax(0,1.15fr) minmax(340px,.85fr);
      gap:12px;
      margin-bottom:12px;
    }

    .heroCard,
    .statusCard,
    .layerCard,
    .linkCard,
    .footer{
      border:1px solid var(--line);
      border-radius:var(--radius2);
      background:
        linear-gradient(180deg,rgba(11,15,22,.96),rgba(16,23,34,.96)),
        radial-gradient(circle at 82% 18%, rgba(111,231,255,.05), transparent 24%);
      box-shadow:var(--shadow2);
    }

    .heroCard{
      padding:22px 20px 20px;
    }

    .eyebrow{
      display:inline-flex;
      align-items:center;
      gap:8px;
      min-height:34px;
      padding:8px 12px;
      border:1px solid var(--line2);
      border-radius:999px;
      background:rgba(255,255,255,.03);
      color:var(--accent);
      font-size:11px;
      letter-spacing:.12em;
      text-transform:uppercase;
      margin-bottom:14px;
    }

    h1{
      margin:0 0 14px;
      font-size:clamp(36px,5.4vw,74px);
      line-height:.96;
      letter-spacing:-.06em;
      max-width:12ch;
    }

    .heroText{
      margin:0;
      max-width:64ch;
      color:var(--muted);
      font-size:17px;
      line-height:1.72;
    }

    .chipRow{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-top:18px;
    }

    .chip{
      display:inline-flex;
      align-items:center;
      min-height:38px;
      padding:9px 14px;
      border:1px solid var(--line);
      border-radius:999px;
      background:rgba(255,255,255,.04);
      color:var(--muted);
      font-size:11px;
      letter-spacing:.10em;
      text-transform:uppercase;
    }

    .chip.strong{
      color:var(--text);
      border-color:rgba(127,255,212,.26);
      background:rgba(127,255,212,.08);
    }

    .statusCard{
      padding:18px;
      display:grid;
      gap:10px;
      align-content:start;
    }

    .statusTitle{
      font-size:12px;
      font-weight:800;
      letter-spacing:.12em;
      text-transform:uppercase;
      color:var(--accent);
      margin:0;
      padding-bottom:10px;
      border-bottom:1px solid var(--line);
    }

    .statusGrid{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }

    .stat{
      border:1px solid var(--line);
      border-radius:14px;
      padding:12px;
      background:
        linear-gradient(180deg,rgba(11,15,22,.98),rgba(16,23,34,.98)),
        radial-gradient(circle at 50% 0%, rgba(127,255,212,.04), transparent 48%);
      min-height:86px;
    }

    .statLabel{
      font-size:10px;
      letter-spacing:.10em;
      text-transform:uppercase;
      color:var(--muted);
      margin-bottom:8px;
    }

    .statValue{
      font-size:18px;
      font-weight:800;
      line-height:1.15;
      word-break:break-word;
    }

    .mainGrid{
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:12px;
      margin-bottom:12px;
    }

    .layerCard,
    .linkCard{
      padding:16px;
    }

    .panelTitle{
      margin:0 0 12px;
      font-size:12px;
      font-weight:800;
      letter-spacing:.12em;
      text-transform:uppercase;
      color:var(--accent);
      padding-bottom:10px;
      border-bottom:1px solid var(--line);
    }

    .panelText{
      margin:0;
      color:var(--muted);
      font-size:14px;
      line-height:1.7;
    }

    .rows{
      display:grid;
      gap:8px;
      margin-top:12px;
    }

    .row{
      display:grid;
      grid-template-columns:minmax(0,1fr) minmax(0,1fr);
      gap:12px;
      align-items:start;
    }

    .rk{
      color:var(--muted);
      font-size:12px;
      line-height:1.45;
    }

    .rv{
      color:var(--text);
      font-size:12px;
      line-height:1.45;
      text-align:right;
      word-break:break-word;
    }

    .actionRow{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-top:14px;
    }

    .action{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:42px;
      padding:10px 14px;
      border-radius:999px;
      border:1px solid var(--line);
      background:rgba(255,255,255,.04);
      color:var(--text);
      font-size:12px;
      font-weight:700;
      letter-spacing:.05em;
      text-transform:uppercase;
      text-decoration:none;
    }

    .action.strong{
      border-color:rgba(127,255,212,.26);
      background:rgba(127,255,212,.08);
    }

    .linkGrid{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:12px;
      margin-bottom:12px;
    }

    .footer{
      padding:12px 14px;
      color:var(--muted);
      font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      white-space:pre-wrap;
      word-break:break-word;
    }

    @media (max-width:1180px){
      .hero,
      .mainGrid,
      .linkGrid{
        grid-template-columns:1fr;
      }

      h1{max-width:none}
    }

    @media (max-width:760px){
      .topbar{flex-direction:column;align-items:flex-start}
      .statusGrid{grid-template-columns:1fr}
      .row{grid-template-columns:1fr}
      .rv{text-align:left}
    }
  </style>
</head>
<body>
  <div class="hostGlow" aria-hidden="true"></div>
  <div class="gridLines" aria-hidden="true"></div>

  <main class="wrap">
    <div class="topbar">
      <div class="brand">Why the Metaverse Works</div>
      <div class="stamp">LAWS · CPU PROCESSING · G1 EXTERNAL EXPRESSION</div>
    </div>

    <section class="hero">
      <article class="heroCard">
        <div class="eyebrow">Laws + under the hood</div>
        <h1>Why the metaverse works and what is actually under the hood.</h1>
        <p class="heroText">
          This page no longer reads as a generic laws index. It now explains why the metaverse works publicly, exposes what is actually under the hood without reopening sealed calibration, and shows how laws and CPU processing govern the visible system.
        </p>
        <div class="chipRow">
          <div class="chip strong">Why It Works</div>
          <div class="chip">Under The Hood</div>
          <div class="chip">Laws + CPU</div>
          <div class="chip">Frontier Connected</div>
        </div>
      </article>

      <aside class="statusCard">
        <h2 class="statusTitle">Page Role</h2>
        <div class="statusGrid">
          <div class="stat">
            <div class="statLabel">Public Layer</div>
            <div class="statValue">Why The Metaverse Works</div>
          </div>
          <div class="stat">
            <div class="statLabel">Interior Layer</div>
            <div class="statValue">Under The Hood</div>
          </div>
          <div class="stat">
            <div class="statLabel">Operational Layer</div>
            <div class="statValue">Laws + CPU Processing</div>
          </div>
          <div class="stat">
            <div class="statLabel">Frontier Link</div>
            <div class="statValue">Explore Frontier</div>
          </div>
        </div>
      </aside>
    </section>

    <section class="mainGrid">
      <article class="layerCard">
        <h2 class="panelTitle">Layer 1 — Why the Metaverse Works</h2>
        <p class="panelText">
          The metaverse works when the visible world descends from governed structure instead of spectacle carrying the burden. Stable host law, lawful inheritance, and structured traversal make the world intelligible before any extension layer tries to impress the viewer.
        </p>
        <div class="rows">
          <div class="row"><div class="rk">Host Law</div><div class="rv">Structure before effects</div></div>
          <div class="row"><div class="rk">Public Entry</div><div class="rv">House first</div></div>
          <div class="row"><div class="rk">Metaverse Burden</div><div class="rv">Not required on first contact</div></div>
          <div class="row"><div class="rk">Signal</div><div class="rv">Subordinate to geometry</div></div>
        </div>
      </article>

      <article class="layerCard">
        <h2 class="panelTitle">Layer 2 — What’s Actually Under the Hood</h2>
        <p class="panelText">
          Under the hood, the project is now treated as sealed for ordinary campaign work. The engine, fuel system, injection, transmission, brakes, and the rest of the calibrative interior are complete for this line. This page explains that interior without reopening it.
        </p>
        <div class="rows">
          <div class="row"><div class="rk">Interior Status</div><div class="rv">Sealed</div></div>
          <div class="row"><div class="rk">Template Status</div><div class="rv">Canonically bound</div></div>
          <div class="row"><div class="rk">Science Status</div><div class="rv">Open within template</div></div>
          <div class="row"><div class="rk">Active Work Domain</div><div class="rv">Frame-outward only</div></div>
        </div>
      </article>

      <article class="layerCard">
        <h2 class="panelTitle">Layer 3 — Laws and CPU Processing</h2>
        <p class="panelText">
          Laws govern what the system is allowed to do. CPU processing governs how the system performs that law in time. This layer is where rule, sequence, inheritance, and visible execution meet without confusing computation for authority.
        </p>
        <div class="rows">
          <div class="row"><div class="rk">Law</div><div class="rv">Admissibility / inheritance / bounds</div></div>
          <div class="row"><div class="rk">CPU</div><div class="rv">Sequence / evaluation / execution</div></div>
          <div class="row"><div class="rk">Result</div><div class="rv">Governed outward behavior</div></div>
          <div class="row"><div class="rk">Failure Mode</div><div class="rv">Processing without lawful structure</div></div>
        </div>
      </article>
    </section>

    <section class="linkGrid">
      <article class="linkCard">
        <h2 class="panelTitle">Core Invariants</h2>
        <p class="panelText">Read the invariant layer without turning this page back into a generic directory.</p>
        <div class="actionRow">
          <a class="action" href="/laws/core-invariants/">Open</a>
        </div>
      </article>

      <article class="linkCard">
        <h2 class="panelTitle">Fusion Readiness</h2>
        <p class="panelText">See what becomes lawful only when structural readiness is satisfied.</p>
        <div class="actionRow">
          <a class="action" href="/laws/fusion-readiness/">Open</a>
        </div>
      </article>

      <article class="linkCard">
        <h2 class="panelTitle">Industrial Posture</h2>
        <p class="panelText">Review the posture layer that governs scale, deployment, and seriousness.</p>
        <div class="actionRow">
          <a class="action" href="/laws/industrial-posture/">Open</a>
        </div>
      </article>

      <article class="linkCard">
        <h2 class="panelTitle">Frontier</h2>
        <p class="panelText">Move directly into the current frontier catalog path from this laws and CPU surface.</p>
        <div class="actionRow">
          <a class="action strong" href="/explore/frontier/">Open Frontier</a>
        </div>
      </article>
    </section>

    <div class="footer">BUILD=LAWS_G1_EXTERNAL_EXPRESSION | ROLE=WHY_METAVERSE_WORKS_UNDER_THE_HOOD_CPU_PROCESSING | FRONTIER=/explore/frontier/ | STATUS=ACTIVE</div>
  </main>
</body>
</html>
