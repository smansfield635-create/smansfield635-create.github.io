<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>Products | Diamond Gate Bridge</title>
  <meta
    name="description"
    content="Flagship products chamber inside the house. ARCHCOIN, AAI, Baseline Nutrition Systems, Five Flags: What's My Scene, and ESL Traversal Learning."
  />
  <style>
    :root{
      color-scheme:dark;
      --bg0:#05070d;
      --bg1:#0a1220;
      --bg2:#101b31;
      --ink:#f4f7ff;
      --mut:rgba(244,247,255,.78);
      --soft:rgba(244,247,255,.56);
      --gold:#f2d391;
      --gold2:#ffe8bc;
      --blue:#87b8ff;
      --blue2:#bdd7ff;
      --line:rgba(255,255,255,.10);
      --lineStrong:rgba(242,211,145,.24);
      --panelTop:rgba(8,12,22,.88);
      --panelBottom:rgba(6,8,16,.97);
      --shadow:0 24px 80px rgba(0,0,0,.52);
      --safe-top:env(safe-area-inset-top,0px);
      --safe-right:env(safe-area-inset-right,0px);
      --safe-bottom:env(safe-area-inset-bottom,0px);
      --safe-left:env(safe-area-inset-left,0px);
      --sidebar-w:272px;
      --header-h:74px;
      --content-radius:28px;
    }

    *{box-sizing:border-box}

    html,body{
      margin:0;
      min-height:100%;
      background:
        radial-gradient(circle at 50% 10%, rgba(120,168,255,.08), transparent 22%),
        radial-gradient(circle at 50% 90%, rgba(255,196,96,.06), transparent 28%),
        linear-gradient(180deg,var(--bg2) 0%,var(--bg1) 46%,var(--bg0) 100%);
      color:var(--ink);
      font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    }

    body{
      overflow-x:hidden;
      overflow-y:auto;
      -webkit-overflow-scrolling:touch;
    }

    a{color:inherit;text-decoration:none}
    button{font:inherit}

    .page{
      position:relative;
      min-height:100vh;
      overflow:hidden;
      isolation:isolate;
    }

    .houseGlow{
      position:absolute;
      inset:0;
      pointer-events:none;
      z-index:1;
      background:
        radial-gradient(circle at 10% 58%, rgba(255,170,86,.12), transparent 18%),
        radial-gradient(circle at 14% 42%, rgba(255,218,155,.05), transparent 12%),
        radial-gradient(circle at 88% 78%, rgba(255,184,96,.07), transparent 14%);
      filter:blur(6px);
    }

    .shell{
      position:relative;
      z-index:2;
      min-height:100vh;
      display:grid;
      grid-template-columns:var(--sidebar-w) 1fr;
    }

    .sidebar{
      position:sticky;
      top:0;
      height:100vh;
      padding:
        calc(16px + var(--safe-top))
        12px
        calc(16px + var(--safe-bottom))
        calc(12px + var(--safe-left));
      background:linear-gradient(180deg, rgba(4,8,18,.96), rgba(5,9,19,.88));
      border-right:1px solid rgba(255,255,255,.06);
      backdrop-filter:blur(12px);
    }

    .sidebarCard{
      height:100%;
      border:1px solid var(--line);
      border-radius:24px;
      background:linear-gradient(180deg, rgba(5,10,20,.96), rgba(6,10,18,.82));
      box-shadow:var(--shadow);
      display:flex;
      flex-direction:column;
      overflow:hidden;
      position:relative;
    }

    .sidebarCard::before,
    .topbar::before,
    .hero::before,
    .productsSection::before,
    .footerBand::before,
    .card::before{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.03);
      border-radius:inherit;
    }

    .brandBlock{
      padding:22px 18px 18px;
      border-bottom:1px solid rgba(255,255,255,.06);
      display:flex;
      align-items:center;
      gap:14px;
    }

    .brandMark{
      width:40px;
      height:40px;
      border-radius:12px;
      transform:rotate(45deg);
      border:1px solid rgba(113,162,255,.28);
      background:linear-gradient(180deg, rgba(9,31,72,.96), rgba(4,14,36,.92));
      flex:0 0 auto;
      box-shadow:0 0 24px rgba(41,95,196,.18);
    }

    .brandTitle{
      margin:0 0 4px;
      font-size:1rem;
      font-weight:800;
      letter-spacing:.08em;
      text-transform:uppercase;
    }

    .brandSub{
      margin:0;
      color:var(--soft);
      font-size:.86rem;
      line-height:1.35;
    }

    .navBlock{
      padding:12px 10px 10px;
      display:grid;
      gap:8px;
    }

    .navItem{
      display:flex;
      align-items:center;
      gap:14px;
      padding:14px 14px;
      border-radius:18px;
      border:1px solid transparent;
      color:var(--mut);
      transition:background .18s ease,border-color .18s ease,transform .18s ease,color .18s ease;
      position:relative;
      overflow:hidden;
    }

    .navItem:hover{
      transform:translateX(2px);
      background:rgba(255,255,255,.03);
      border-color:rgba(255,255,255,.06);
      color:var(--ink);
    }

    .navItem.isActive{
      border-color:rgba(242,211,145,.18);
      background:linear-gradient(180deg, rgba(242,211,145,.08), rgba(255,255,255,.02));
      color:var(--gold2);
    }

    .navIcon{
      width:24px;
      height:24px;
      display:grid;
      place-items:center;
      color:inherit;
      flex:0 0 auto;
    }

    .navText strong{
      display:block;
      font-size:.92rem;
      letter-spacing:.05em;
      text-transform:uppercase;
      font-weight:800;
    }

    .navText span{
      display:block;
      margin-top:4px;
      font-size:.8rem;
      color:var(--soft);
      line-height:1.35;
    }

    .sidebarFooter{
      margin-top:auto;
      padding:14px;
    }

    .sidebarFooterCard{
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      padding:16px 14px;
      background:linear-gradient(180deg, rgba(8,13,24,.82), rgba(7,10,18,.92));
    }

    .sidebarFooterCard p{
      margin:0;
      color:var(--mut);
      font-size:.85rem;
      line-height:1.6;
    }

    .sidebarFooterCard small{
      display:block;
      margin-top:14px;
      color:var(--soft);
      font-size:.78rem;
    }

    .main{
      min-width:0;
      padding:
        calc(16px + var(--safe-top))
        calc(16px + var(--safe-right))
        calc(24px + var(--safe-bottom))
        0;
      position:relative;
    }

    .content{
      min-height:calc(100vh - 32px);
      border-radius:var(--content-radius);
      overflow:hidden;
      position:relative;
      background:
        radial-gradient(circle at 10% 55%, rgba(255,165,86,.10), transparent 18%),
        radial-gradient(circle at 90% 78%, rgba(255,184,96,.06), transparent 12%),
        linear-gradient(180deg, rgba(7,10,18,.94), rgba(5,7,14,.98));
      box-shadow:var(--shadow);
    }

    .topbar{
      min-height:var(--header-h);
      border:1px solid rgba(255,255,255,.08);
      border-radius:var(--content-radius) var(--content-radius) 0 0;
      border-bottom:none;
      padding:16px 20px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:14px;
      position:relative;
      background:linear-gradient(180deg, rgba(5,8,15,.86), rgba(5,8,15,.62));
      backdrop-filter:blur(10px);
      z-index:3;
    }

    .topbarRight{
      display:flex;
      gap:10px;
      flex-wrap:wrap;
      align-items:center;
      margin-left:auto;
    }

    .pill{
      min-height:40px;
      padding:0 14px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.10);
      background:rgba(255,255,255,.04);
      color:var(--mut);
      font-size:.82rem;
      font-weight:800;
      letter-spacing:.05em;
      text-transform:uppercase;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:8px;
    }

    .pill.isPrivate{
      color:var(--gold2);
      border-color:rgba(242,211,145,.16);
      background:linear-gradient(180deg, rgba(242,211,145,.08), rgba(255,255,255,.02));
    }

    .viewport{
      position:relative;
      padding:28px 26px 22px;
      min-height:calc(100vh - 32px - var(--header-h));
    }

    .interiorEdgeLeft,
    .interiorEdgeRight{
      position:absolute;
      top:0;
      bottom:0;
      width:16%;
      pointer-events:none;
      z-index:1;
    }

    .interiorEdgeLeft{
      left:0;
      background:
        radial-gradient(circle at 12% 62%, rgba(255,170,86,.18), transparent 26%),
        linear-gradient(90deg, rgba(18,10,8,.74), rgba(18,10,8,.18) 60%, transparent);
    }

    .interiorEdgeRight{
      right:0;
      background:
        radial-gradient(circle at 86% 80%, rgba(255,170,86,.10), transparent 18%),
        linear-gradient(270deg, rgba(14,10,8,.60), rgba(14,10,8,.14) 60%, transparent);
    }

    .hero{
      position:relative;
      z-index:2;
      padding:8px 6px 0;
      max-width:840px;
    }

    .eyebrow{
      margin:0 0 10px;
      color:var(--gold);
      font-size:.85rem;
      font-weight:900;
      letter-spacing:.18em;
      text-transform:uppercase;
    }

    .headline{
      margin:0;
      max-width:760px;
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(3rem,6vw,5.3rem);
      line-height:.95;
      letter-spacing:-.03em;
      text-wrap:balance;
    }

    .subcopy{
      margin:18px 0 0;
      max-width:620px;
      font-size:1.13rem;
      line-height:1.65;
      color:var(--mut);
    }

    .productsSection{
      position:relative;
      z-index:2;
      margin-top:34px;
      border:1px solid rgba(255,255,255,.08);
      border-radius:28px;
      background:linear-gradient(180deg, rgba(6,9,18,.34), rgba(6,9,18,.18));
      backdrop-filter:blur(4px);
      padding:20px 18px 18px;
      min-height:430px;
    }

    .cards{
      display:grid;
      grid-template-columns:1.15fr 1.15fr .82fr .82fr .82fr;
      gap:14px;
      align-items:stretch;
    }

    .card{
      position:relative;
      border:1px solid rgba(255,255,255,.12);
      border-radius:24px;
      overflow:hidden;
      background:linear-gradient(180deg, rgba(8,12,22,.92), rgba(6,9,17,.98));
      box-shadow:0 18px 48px rgba(0,0,0,.34);
      min-height:368px;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      padding:18px;
      isolation:isolate;
    }

    .card.isFlagship{min-height:380px}
    .card.secondary{min-height:336px}

    .card.archcoin{
      border-color:rgba(242,211,145,.22);
    }

    .card.aai{
      border-color:rgba(135,184,255,.22);
    }

    .cardWindow{
      position:absolute;
      inset:0;
      border-radius:inherit;
      overflow:hidden;
      z-index:0;
      pointer-events:none;
    }

    .cardWindowScene{
      position:absolute;
      inset:0;
      overflow:hidden;
    }

    .cardWindowGlass{
      position:absolute;
      inset:0;
      background:
        linear-gradient(100deg, rgba(255,255,255,.08), transparent 24%, transparent 62%, rgba(255,255,255,.04)),
        radial-gradient(circle at 50% 24%, rgba(210,226,255,.04), transparent 22%);
      mix-blend-mode:screen;
      opacity:.55;
    }

    .cardWindowFrame{
      position:absolute;
      inset:0;
      border-radius:inherit;
      box-shadow:
        inset 0 0 0 2px rgba(10,14,24,.92),
        inset 0 0 0 10px rgba(18,14,12,.56),
        inset 0 0 0 11px rgba(255,255,255,.04);
    }

    .cardWindowMullionV,
    .cardWindowMullionH{
      position:absolute;
      background:rgba(10,14,24,.88);
      opacity:.96;
    }

    .cardWindowMullionV{
      top:0;
      bottom:0;
      width:6px;
      left:50%;
      transform:translateX(-50%);
      box-shadow:0 0 0 1px rgba(255,255,255,.03);
    }

    .cardWindowMullionH{
      left:0;
      right:0;
      height:6px;
      top:50%;
      transform:translateY(-50%);
      box-shadow:0 0 0 1px rgba(255,255,255,.03);
    }

    .cardWindowLightning{
      position:absolute;
      inset:0;
      opacity:.42;
      transition:opacity .18s ease;
      filter:drop-shadow(0 0 8px rgba(220,234,255,.26)) drop-shadow(0 0 18px rgba(159,190,255,.14));
    }

    .page.flash .cardWindowLightning{
      opacity:.92;
    }

    .page.flash .cardWindowScene{
      filter:brightness(1.16) saturate(1.08);
    }

    .page.flash .card{
      box-shadow:
        0 18px 48px rgba(0,0,0,.34),
        inset 0 0 32px rgba(212,228,255,.06);
    }

    .windowSpill{
      position:absolute;
      inset:0;
      z-index:1;
      pointer-events:none;
      opacity:.14;
      transition:opacity .18s ease;
      background:
        linear-gradient(180deg, rgba(214,228,255,.08), transparent 28%, transparent 72%, rgba(255,188,96,.04)),
        radial-gradient(circle at 50% 18%, rgba(214,228,255,.08), transparent 26%);
      mix-blend-mode:screen;
    }

    .page.flash .windowSpill{
      opacity:.34;
    }

    .cardContent{
      position:relative;
      z-index:2;
      display:flex;
      flex-direction:column;
      min-height:100%;
    }

    .coinMedallion{
      width:92px;
      height:92px;
      border-radius:999px;
      display:grid;
      place-items:center;
      margin-bottom:14px;
      border:1px solid rgba(255,255,255,.14);
      background:
        radial-gradient(circle at 34% 30%, rgba(255,255,255,.08), transparent 18%),
        linear-gradient(180deg, rgba(15,22,40,.96), rgba(7,11,18,.92));
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.04), 0 0 0 1px rgba(255,255,255,.02);
      overflow:hidden;
      position:relative;
      z-index:2;
    }

    .coinMedallion.gold{
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.04),
        0 0 0 1px rgba(242,211,145,.12),
        0 0 26px rgba(242,211,145,.10);
    }

    .coinMedallion.blue{
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.04),
        0 0 0 1px rgba(135,184,255,.12),
        0 0 26px rgba(135,184,255,.12);
    }

    .coinGlyph{
      width:54px;
      height:54px;
      display:block;
    }

    .tag{
      margin:0 0 12px;
      font-size:.82rem;
      font-weight:900;
      letter-spacing:.18em;
      text-transform:uppercase;
      color:var(--gold);
      position:relative;
      z-index:2;
    }

    .title{
      margin:0 0 12px;
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(2.05rem,3vw,2.6rem);
      line-height:.96;
      letter-spacing:-.02em;
      text-wrap:balance;
      position:relative;
      z-index:2;
      text-shadow:0 2px 12px rgba(0,0,0,.38);
    }

    .card.secondary .title{
      font-size:clamp(1.7rem,2.2vw,2.2rem);
    }

    .desc{
      margin:0;
      color:var(--mut);
      font-size:1rem;
      line-height:1.65;
      max-width:none;
      position:relative;
      z-index:2;
      text-shadow:0 1px 10px rgba(0,0,0,.28);
    }

    .miniIcon{
      width:58px;
      height:58px;
      margin-bottom:12px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.12);
      display:grid;
      place-items:center;
      color:var(--soft);
      background:rgba(255,255,255,.02);
      position:relative;
      z-index:2;
    }

    .ctaBar{
      margin-top:18px;
      position:relative;
      z-index:2;
    }

    .cardBtn{
      width:100%;
      min-height:46px;
      border-radius:14px;
      border:1px solid rgba(255,255,255,.12);
      background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
      color:var(--ink);
      font-size:.92rem;
      font-weight:800;
      letter-spacing:.02em;
      display:inline-flex;
      align-items:center;
      justify-content:space-between;
      padding:0 14px;
      cursor:pointer;
      transition:transform .16s ease,border-color .16s ease,background .16s ease;
      backdrop-filter:blur(2px);
    }

    .cardBtn:hover{
      transform:translateY(-1px);
      border-color:rgba(255,255,255,.18);
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
    }

    .emptyState{
      display:none;
      min-height:390px;
      align-items:center;
      justify-content:center;
      text-align:center;
      padding:24px;
      color:var(--mut);
      font-size:1rem;
      line-height:1.7;
      border:1px dashed rgba(255,255,255,.12);
      border-radius:22px;
    }

    .footerBand{
      position:relative;
      z-index:2;
      margin-top:16px;
      padding:16px 18px;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      min-height:70px;
      border-radius:20px;
      background:linear-gradient(180deg, rgba(4,8,18,.88), rgba(3,6,12,.96));
    }

    .footerBand p{
      margin:0;
      color:var(--mut);
      font-size:1rem;
      line-height:1.5;
      max-width:none;
    }

    .mobileNav{display:none}

    @media (max-width:1200px){
      .cards{
        grid-template-columns:1fr 1fr 1fr;
      }
      .card.archcoin,
      .card.aai{
        min-height:360px;
      }
    }

    @media (max-width:980px){
      :root{--sidebar-w:0px}
      .shell{grid-template-columns:1fr}
      .sidebar{display:none}
      .main{padding-left:calc(16px + var(--safe-left))}
      .mobileNav{
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        margin-bottom:14px;
      }
      .mobileNav a{
        min-height:38px;
        padding:0 12px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(255,255,255,.04);
        color:var(--mut);
        font-size:.8rem;
        font-weight:800;
        letter-spacing:.05em;
        text-transform:uppercase;
        display:inline-flex;
        align-items:center;
        justify-content:center;
      }
    }

    @media (max-width:860px){
      .cards{grid-template-columns:1fr}
      .viewport{padding:18px 16px 18px}
      .topbar{padding:14px 14px}
      .headline{font-size:clamp(2.3rem,11vw,4rem)}
      .interiorEdgeLeft,
      .interiorEdgeRight{display:none}
      .productsSection{min-height:auto}
      .emptyState{min-height:220px}
    }

    @media (prefers-reduced-motion:reduce){
      .cardBtn,
      .navItem,
      .nav a,
      .cardWindowLightning,
      .windowSpill,
      .cardWindowScene{
        transition:none !important;
      }
    }
  </style>
</head>
<body>
  <div class="page" id="productsPage">
    <div class="houseGlow" aria-hidden="true"></div>

    <div class="shell">
      <aside class="sidebar">
        <div class="sidebarCard">
          <div class="brandBlock">
            <div class="brandMark" aria-hidden="true"></div>
            <div>
              <p class="brandTitle">Diamond Gate Bridge</p>
              <p class="brandSub">Flagship products chamber</p>
            </div>
          </div>

          <nav class="navBlock" aria-label="Products sidebar">
            <a class="navItem isActive" href="/products/">
              <span class="navIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 7h16M4 12h16M4 17h16"/>
                </svg>
              </span>
              <span class="navText">
                <strong>Products</strong>
              </span>
            </a>

            <a class="navItem" href="/home/">
              <span class="navIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>
                </svg>
              </span>
              <span class="navText">
                <strong>House</strong>
                <span>Premium intelligence</span>
              </span>
            </a>

            <a class="navItem" href="/products/archcoin/">
              <span class="navIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="8"/><path d="M8.5 15.5 12 8l3.5 7.5"/><path d="M9.7 13.2h4.6"/>
                </svg>
              </span>
              <span class="navText">
                <strong>ARCHCOIN</strong>
                <span>Flagship value product</span>
              </span>
            </a>

            <a class="navItem" href="/products/aai/">
              <span class="navIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="8"/><path d="M8.5 15.5 12 8l3.5 7.5"/><path d="M9.7 13.2h4.6"/>
                </svg>
              </span>
              <span class="navText">
                <strong>AAI</strong>
                <span>Artificial agent intelligence</span>
              </span>
            </a>

            <a class="navItem" href="/contact/">
              <span class="navIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>
                </svg>
              </span>
              <span class="navText">
                <strong>Contact</strong>
              </span>
            </a>
          </nav>

          <div class="sidebarFooter">
            <div class="sidebarFooterCard">
              <p>Private value. Intelligent execution. Refined release.</p>
              <small>© Diamond Gate Bridge</small>
            </div>
          </div>
        </div>
      </aside>

      <main class="main">
        <div class="mobileNav" aria-label="Mobile navigation">
          <a href="/home/">House</a>
          <a href="/products/">Products</a>
          <a href="/laws/">Laws</a>
          <a href="/contact/">Contact</a>
        </div>

        <div class="content">
          <header class="topbar">
            <div></div>
            <div class="topbarRight">
              <div class="pill isPrivate">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>
                </svg>
                Private Chamber
              </div>
            </div>
          </header>

          <div class="viewport">
            <div class="interiorEdgeLeft"></div>
            <div class="interiorEdgeRight"></div>

            <section class="hero">
              <p class="eyebrow">Products</p>
              <h1 class="headline">Products built for the next intelligence economy.</h1>
              <p class="subcopy">
                Inside the house, the chamber is calm and controlled. Outside the glass, the storm carries force, lightning, and motion. ARCHCOIN and AAI lead the chamber, with three more product paths visible and ready to open.
              </p>
            </section>

            <section class="productsSection" aria-label="Product cards">
              <div class="cards" id="productsGrid"></div>
              <div class="emptyState" id="productsEmptyState">
                <div>
                  <strong style="display:block;margin-bottom:10px;color:var(--ink);font-size:1.05rem;letter-spacing:.04em;text-transform:uppercase;">
                    Products chamber loading
                  </strong>
                  <span>
                    If the cards do not appear, the paired <code>/products/index.js</code> file was not fully deployed.
                  </span>
                </div>
              </div>
            </section>

            <footer class="footerBand">
              <p>Five product paths. One private house. Built for sovereignty, scale, and lasting impact.</p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  </div>

  <script src="/products/index.js"></script>
</body>
</html>
