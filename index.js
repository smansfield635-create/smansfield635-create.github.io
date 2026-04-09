<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>Why the Metaverse Works | Under the Hood | CPU Processing</title>
  <meta
    name="description"
    content="A visible three-layer laws page: why the metaverse works, what is actually under the hood, and laws with CPU processing, plus direct frontier access."
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
      --maxw:1460px;
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
      grid-template-columns:minmax(0,1.08fr) minmax(360px,.92fr);
      gap:12px;
      margin-bottom:12px;
    }

    .heroCard,
    .statusCard,
    .layerHero,
    .layerPanel,
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

    .layerHero{
      position:relative;
      overflow:hidden;
      padding:20px;
      margin-bottom:12px;
    }

    .layerHero::before{
      content:"";
      position:absolute;
      inset:-20% auto auto 50%;
      width:520px;
      height:520px;
      transform:translateX(-50%);
      border-radius:50%;
      background:
        radial-gradient(circle at 50% 50%, rgba(127,255,212,.08), transparent 48%),
        radial-gradient(circle at 50% 50%, rgba(111,231,255,.05), transparent 64%);
      pointer-events:none;
      filter:blur(12px);
    }

    .layerHeroInner{
      position:relative;
      z-index:1;
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:12px;
      align-items:stretch;
    }

    .layerCard{
      position:relative;
      border:1px solid rgba(255,255,255,.08);
      border-radius:20px;
      min-height:360px;
      padding:16px;
      background:
        linear-gradient(180deg,rgba(9,14,22,.88),rgba(12,18,28,.92)),
        radial-gradient(circle at 50% 0%, rgba(127,255,212,.05), transparent 46%);
      overflow:hidden;
      transform-style:preserve-3d;
    }

    .layerCard::after{
      content:"";
      position:absolute;
      inset:auto -10% -18% -10%;
      height:120px;
      background:radial-gradient(circle at 50% 50%, rgba(127,255,212,.08), transparent 62%);
      filter:blur(18px);
      pointer-events:none;
    }

    .layerNumber{
      position:absolute;
      top:12px;
      right:12px;
      min-width:34px;
      min-height:34px;
      display:grid;
      place-items:center;
      border-radius:999px;
      border:1px solid rgba(127,255,212,.22);
      background:rgba(127,255,212,.08);
      color:var(--text);
      font-size:12px;
      font-weight:800;
      letter-spacing:.08em;
    }

    .layerLabel{
      font-size:11px;
      letter-spacing:.12em;
      text-transform:uppercase;
      color:var(--accent);
      margin-bottom:10px;
    }

    .layerTitle{
      margin:0 0 12px;
      font-size:28px;
      line-height:1.02;
      letter-spacing:-.04em;
      max-width:12ch;
    }

    .layerText{
      margin:0;
      color:var(--muted);
      font-size:14px;
      line-height:1.72;
      max-width:42ch;
    }

    .artWrap{
      position:relative;
      width:100%;
      height:142px;
      margin:16px 0 14px;
      perspective:900px;
    }

    .artStack{
      position:absolute;
      inset:0;
      display:grid;
      place-items:center;
      transform-style:preserve-3d;
    }

    .slab{
      position:absolute;
      border:1px solid rgba(255,255,255,.10);
      border-radius:20px;
      background:
        linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02)),
        radial-gradient(circle at 50% 10%, rgba(127,255,212,.08), transparent 48%);
      box-shadow:0 18px 30px rgba(0,0,0,.22);
    }

    .slab.flat.a{width:210px;height:92px;transform:rotateX(68deg) translateZ(0)}
    .slab.flat.b{width:176px;height:74px;transform:rotateX(68deg) translateZ(24px)}
    .ring{
      position:absolute;
      width:148px;height:148px;
      border-radius:50%;
      border:1px solid rgba(111,231,255,.22);
      transform:rotateX(66deg) rotateZ(18deg);
      box-shadow:0 0 24px rgba(111,231,255,.08);
    }
    .sphere{
      position:absolute;
      width:108px;height:108px;
      border-radius:50%;
      background:
        radial-gradient(circle at 34% 28%, rgba(255,255,255,.22), transparent 18%),
        radial-gradient(circle at 50% 50%, rgba(111,231,255,.18), rgba(127,255,212,.06) 58%, rgba(0,0,0,.10) 100%);
      border:1px solid rgba(255,255,255,.10);
      box-shadow:0 18px 30px rgba(0,0,0,.22), inset 0 0 24px rgba(111,231,255,.08);
      transform:translateZ(8px);
    }
    .pillar{
      position:absolute;
      width:18px;
      height:94px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.10);
      background:
        linear-gradient(180deg, rgba(127,255,212,.24), rgba(111,231,255,.08), rgba(255,255,255,.02));
      box-shadow:0 12px 26px rgba(0,0,0,.18);
    }
    .pillar.p1{transform:translateX(-44px) rotateZ(-10deg)}
    .pillar.p2{transform:translateX(0) rotateZ(0deg)}
    .pillar.p3{transform:translateX(44px) rotateZ(10deg)}
    .beam{
      position:absolute;
      width:184px;
      height:14px;
      border-radius:999px;
      border:1px solid rgba(127,255,212,.16);
      background:linear-gradient(90deg, rgba(127,255,212,.10), rgba(111,231,255,.22), rgba(127,255,212,.10));
      box-shadow:0 0 18px rgba(111,231,255,.08);
      transform:translateY(-10px);
    }
    .chipBlock{
      position:absolute;
      width:172px;
      height:104px;
      border-radius:18px;
      border:1px solid rgba(255,255,255,.10);
      background:
        linear-gradient(180deg,rgba(11,15,22,.96),rgba(16,23,34,.98)),
        radial-gradient(circle at 50% 10%, rgba(127,255,212,.06), transparent 48%);
      box-shadow:0 18px 30px rgba(0,0,0,.22);
      transform:rotateX(62deg);
    }
    .trace{
      position:absolute;
      border-radius:999px;
      background:linear-gradient(90deg, rgba(111,231,255,.10), rgba(127,255,212,.34), rgba(111,231,255,.10));
      box-shadow:0 0 12px rgba(127,255,212,.10);
    }
    .trace.t1{width:120px;height:3px;transform:translateY(-24px)}
    .trace.t2{width:86px;height:3px;transform:translateY(0)}
    .trace.t3{width:132px;height:3px;transform:translateY(24px)}
    .trace.v1{width:3px;height:70px;transform:translateX(-42px)}
    .trace.v2{width:3px;height:70px;transform:translateX(42px)}

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

    .layerPanel{
      padding:16px;
      margin-bottom:12px;
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

    .detailGrid{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:12px;
      margin-top:12px;
    }

    .detailCard{
      border:1px solid rgba(255,255,255,.08);
      border-radius:16px;
      padding:14px;
      background:rgba(255,255,255,.03);
    }

    .detailTitle{
      margin:0 0 8px;
      font-size:11px;
      letter-spacing:.12em;
      text-transform:uppercase;
      color:var(--accent);
    }

    .detailText{
      margin:0;
      color:var(--muted);
      font-size:13px;
      line-height:1.66;
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

    .footer{
      padding:12px 14px;
      color:var(--muted);
      font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      white-space:pre-wrap;
      word-break:break-word;
    }

    @media (max-width:1180px){
      .hero,
      .layerHeroInner,
      .detailGrid{
        grid-template-columns:1fr;
      }

      h1{max-width:none}
      .layerTitle{max-width:none}
    }

    @media (max-width:760px){
      .topbar{flex-direction:column;align-items:flex-start}
      .statusGrid{grid-template-columns:1fr}
      .row{grid-template-columns:1fr}
      .rv{text-align:left}
      .artWrap{height:120px}
      .slab.flat.a{width:170px;height:78px}
      .slab.flat.b{width:146px;height:62px}
      .ring{width:122px;height:122px}
      .sphere{width:92px;height:92px}
      .chipBlock{width:150px;height:94px}
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
        <div class="eyebrow">Visible three-layer laws surface</div>
        <h1>See the laws, the extensions, and the processing layer.</h1>
        <p class="heroText">
          The laws page now visibly presents all three layers instead of merely naming them. It revolves around governing law first, then the extensions beneath it, then the CPU processing layer that turns lawful structure into visible execution.
        </p>
        <div class="chipRow">
          <div class="chip strong">Layer 1 Visible</div>
          <div class="chip strong">Layer 2 Visible</div>
          <div class="chip strong">Layer 3 Visible</div>
          <div class="chip">Frontier Connected</div>
        </div>
      </article>

      <aside class="statusCard">
        <h2 class="statusTitle">Capability Read</h2>
        <div class="statusGrid">
          <div class="stat">
            <div class="statLabel">Laws</div>
            <div class="statValue">Visible</div>
          </div>
          <div class="stat">
            <div class="statLabel">Extensions</div>
            <div class="statValue">Visible</div>
          </div>
          <div class="stat">
            <div class="statLabel">CPU Processing</div>
            <div class="statValue">Visible</div>
          </div>
          <div class="stat">
            <div class="statLabel">Frontier</div>
            <div class="statValue">Direct Access</div>
          </div>
        </div>
      </aside>
    </section>

    <section class="layerHero">
      <div class="layerHeroInner">
        <article class="layerCard">
          <div class="layerNumber">1</div>
          <div class="layerLabel">Layer 1</div>
          <h2 class="layerTitle">Why the Metaverse Works</h2>
          <p class="layerText">
            The metaverse works when the world descends from governed structure instead of visual noise carrying the burden. Law gives the world admissibility. Host geometry gives it stability. Only then can signal, motion, and extension appear without collapse.
          </p>
          <div class="artWrap" aria-hidden="true">
            <div class="artStack">
              <div class="slab flat a"></div>
              <div class="slab flat b"></div>
              <div class="ring"></div>
              <div class="sphere"></div>
            </div>
          </div>
          <div class="rows">
            <div class="row"><div class="rk">Host Law</div><div class="rv">Structure before effects</div></div>
            <div class="row"><div class="rk">Public Entry</div><div class="rv">House first</div></div>
            <div class="row"><div class="rk">Metaverse Burden</div><div class="rv">Not required on first contact</div></div>
          </div>
        </article>

        <article class="layerCard">
          <div class="layerNumber">2</div>
          <div class="layerLabel">Layer 2</div>
          <h2 class="layerTitle">What’s Actually Under the Hood</h2>
          <p class="layerText">
            Under the hood is the sealed interior: template, engine, routing logic, inheritance law, and the code-of-life platform structure. This layer shows that the metaverse is not magic. It is governed extension standing on an already-built machine.
          </p>
          <div class="artWrap" aria-hidden="true">
            <div class="artStack">
              <div class="beam"></div>
              <div class="pillar p1"></div>
              <div class="pillar p2"></div>
              <div class="pillar p3"></div>
            </div>
          </div>
          <div class="rows">
            <div class="row"><div class="rk">Interior Status</div><div class="rv">Sealed</div></div>
            <div class="row"><div class="rk">Template Status</div><div class="rv">Canonically bound</div></div>
            <div class="row"><div class="rk">Active Domain</div><div class="rv">Frame-outward only</div></div>
          </div>
        </article>

        <article class="layerCard">
          <div class="layerNumber">3</div>
          <div class="layerLabel">Layer 3</div>
          <h2 class="layerTitle">Laws and CPU Processing</h2>
          <p class="layerText">
            Laws define what is admissible. CPU processing defines how those laws are sequenced, evaluated, and expressed. This is where rules become timing, inheritance becomes execution, and external behavior becomes measurable instead of theatrical.
          </p>
          <div class="artWrap" aria-hidden="true">
            <div class="artStack">
              <div class="chipBlock"></div>
              <div class="trace t1"></div>
              <div class="trace t2"></div>
              <div class="trace t3"></div>
              <div class="trace v1"></div>
              <div class="trace v2"></div>
            </div>
          </div>
          <div class="rows">
            <div class="row"><div class="rk">Law</div><div class="rv">Admissibility / inheritance / bounds</div></div>
            <div class="row"><div class="rk">CPU</div><div class="rv">Sequence / evaluation / execution</div></div>
            <div class="row"><div class="rk">Failure Mode</div><div class="rv">Processing without lawful structure</div></div>
          </div>
        </article>
      </div>
    </section>

    <section class="layerPanel">
      <h2 class="panelTitle">Extensions and Connected Surfaces</h2>
      <p class="panelText">
        The laws page is still about the laws, but now the extensions are explicit. The page shows what the laws support, what the sealed interior means, how CPU processing externalizes that law, and where the frontier sits in relation to all of it.
      </p>

      <div class="detailGrid">
        <article class="detailCard">
          <h3 class="detailTitle">Core Invariants</h3>
          <p class="detailText">The invariant layer that tells the system what it must remain in order to stay lawful.</p>
          <div class="actionRow">
            <a class="action" href="/laws/core-invariants/">Open</a>
          </div>
        </article>

        <article class="detailCard">
          <h3 class="detailTitle">Fusion Readiness</h3>
          <p class="detailText">The readiness layer that tells the system when higher-order convergence becomes lawful.</p>
          <div class="actionRow">
            <a class="action" href="/laws/fusion-readiness/">Open</a>
          </div>
        </article>

        <article class="detailCard">
          <h3 class="detailTitle">Industrial Posture</h3>
          <p class="detailText">The posture layer for scale, seriousness, deployment discipline, and non-toy execution.</p>
          <div class="actionRow">
            <a class="action" href="/laws/industrial-posture/">Open</a>
          </div>
        </article>

        <article class="detailCard">
          <h3 class="detailTitle">Frontier</h3>
          <p class="detailText">The direct bridge to the frontier catalog so the boundary of current capability remains visible.</p>
          <div class="actionRow">
            <a class="action strong" href="/explore/frontier/">Open Frontier</a>
          </div>
        </article>
      </div>
    </section>

    <div class="footer">BUILD=LAWS_G1_VISIBLE_THREE_LAYER_SURFACE | ROLE=WHY_METAVERSE_WORKS_UNDER_THE_HOOD_CPU_PROCESSING | LAYERS=3_VISIBLE | FRONTIER=/explore/frontier/ | STATUS=ACTIVE</div>
  </main>
</body>
</html>
