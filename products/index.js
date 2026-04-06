DESTINATION: /products/index.html

<!doctype html>
<!-- TNT — /products/index.html
     PRODUCTS AUTHORITY — 3D COMPASS-DIAMOND PRODUCT CHAMBER HOST
     LOCKS:
       - host/layout only
       - runtime authority lives in /products/index.js
       - no inline onclick
       - no modal overlays
       - all product objects route
       - product set:
         1) On Your Side AI
         2) Baseline Nutrition Systems
         3) Education & Language Systems
         4) Five Flags / What's My Theme?
         5) ARCHCOIN
-->

<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <title>Nine Summits — Products</title>

  <link rel="stylesheet" href="/assets/ui.css"/>
  <link rel="stylesheet" href="/assets/branch.css"/>

  <style>
    :root{
      --bg0:#030712;
      --bg1:#081225;
      --bg2:#0f1f39;
      --ink:rgba(255,255,255,.96);
      --mut:rgba(255,255,255,.80);
      --line:rgba(255,255,255,.14);
      --gold:rgba(212,175,55,.54);
      --gold2:rgba(233,214,154,.34);
      --panel:rgba(5,11,24,.48);
      --panel2:rgba(5,11,24,.66);
      --shadowA:0 30px 90px rgba(0,0,0,.52);
      --shadowB:0 18px 54px rgba(0,0,0,.44);
      --safe-top:env(safe-area-inset-top,0px);
      --safe-right:env(safe-area-inset-right,0px);
      --safe-bottom:env(safe-area-inset-bottom,0px);
      --safe-left:env(safe-area-inset-left,0px);
    }

    *{box-sizing:border-box}
    html,body{
      margin:0;
      width:100%;
      height:100%;
      overflow:hidden;
      background:var(--bg0);
      color:var(--ink);
      font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    }
    a{color:inherit;text-decoration:none}
    body::before,body::after{pointer-events:none!important}

    #app-shell{
      position:fixed;
      inset:0;
      overflow:hidden;
      isolation:isolate;
      background:
        radial-gradient(circle at 50% 18%, rgba(120,180,255,.10), transparent 30%),
        radial-gradient(circle at 50% 76%, rgba(110,160,255,.08), transparent 34%),
        linear-gradient(180deg, var(--bg2) 0%, var(--bg1) 48%, var(--bg0) 100%);
    }

    .env{
      position:absolute;
      inset:0;
      z-index:1;
      pointer-events:none;
      overflow:hidden;
    }

    .env::before{
      content:"";
      position:absolute;
      inset:-10%;
      background:
        radial-gradient(circle at 12% 22%, rgba(255,255,255,.98) 0 1.2px, transparent 2px),
        radial-gradient(circle at 20% 44%, rgba(255,255,255,.78) 0 1px, transparent 1.8px),
        radial-gradient(circle at 28% 18%, rgba(255,255,255,.74) 0 1px, transparent 1.8px),
        radial-gradient(circle at 36% 30%, rgba(255,255,255,.90) 0 1.1px, transparent 1.9px),
        radial-gradient(circle at 44% 14%, rgba(255,255,255,.84) 0 1px, transparent 1.8px),
        radial-gradient(circle at 58% 22%, rgba(255,255,255,.96) 0 1.2px, transparent 2px),
        radial-gradient(circle at 68% 16%, rgba(255,255,255,.74) 0 1px, transparent 1.8px),
        radial-gradient(circle at 76% 34%, rgba(255,255,255,.88) 0 1.1px, transparent 1.9px),
        radial-gradient(circle at 84% 20%, rgba(255,255,255,.82) 0 1px, transparent 1.8px),
        radial-gradient(circle at 90% 48%, rgba(255,255,255,.94) 0 1.2px, transparent 2px),
        radial-gradient(circle at 18% 72%, rgba(255,255,255,.78) 0 1px, transparent 1.8px),
        radial-gradient(circle at 36% 78%, rgba(255,255,255,.95) 0 1.1px, transparent 1.9px),
        radial-gradient(circle at 54% 74%, rgba(255,255,255,.80) 0 1px, transparent 1.8px),
        radial-gradient(circle at 70% 70%, rgba(255,255,255,.90) 0 1.1px, transparent 1.9px),
        radial-gradient(circle at 86% 76%, rgba(255,255,255,.82) 0 1px, transparent 1.8px);
      opacity:.62;
      animation:starDrift 30s linear infinite;
    }

    .env::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 50% 50%, rgba(90,140,230,.08), transparent 28%),
        linear-gradient(180deg, transparent 0%, rgba(255,255,255,.018) 50%, transparent 100%);
      filter:blur(6px);
      opacity:.72;
    }

    .top-nav{
      position:fixed;
      left:16px;
      top:calc(16px + var(--safe-top));
      z-index:30;
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .top-right{
      position:fixed;
      right:16px;
      top:calc(16px + var(--safe-top));
      z-index:30;
      display:flex;
      gap:10px;
      justify-content:flex-end;
      align-items:center;
    }

    .nav-btn,
    .top-pill{
      min-height:42px;
      padding:10px 14px;
      border-radius:14px;
      border:1px solid rgba(255,255,255,.15);
      background:
        radial-gradient(circle at 50% 120%, rgba(212,175,55,.12), transparent 64%),
        radial-gradient(circle at 18% 18%, rgba(255,255,255,.12), transparent 40%),
        linear-gradient(145deg, rgba(10,12,20,.44), rgba(4,6,10,.62));
      color:#fff;
      font-weight:900;
      font-size:13px;
      letter-spacing:.05em;
      backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
      box-shadow:var(--shadowB);
      position:relative;
      overflow:hidden;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      -webkit-tap-highlight-color:transparent;
      touch-action:manipulation;
      transition:border-color .18s ease, box-shadow .18s ease, transform .18s ease;
    }

    .nav-btn::after,
    .top-pill::after{
      content:"";
      position:absolute;
      left:10px;
      right:10px;
      bottom:-12px;
      height:26px;
      background:radial-gradient(circle at 50% 0%, rgba(212,175,55,.24), transparent 72%);
      opacity:.56;
      pointer-events:none;
    }

    .nav-btn:hover,
    .top-pill:hover{
      border-color:rgba(212,175,55,.34);
      box-shadow:var(--shadowB),0 0 16px rgba(212,175,55,.12);
      transform:translateY(-1px);
    }

    .nav-btn.active{
      border-color:rgba(212,175,55,.40);
    }

    .hero{
      position:absolute;
      top:11%;
      left:50%;
      transform:translateX(-50%);
      width:min(94vw,1040px);
      text-align:center;
      z-index:10;
      pointer-events:none;
    }

    .hero h1{
      margin:0;
      font-size:clamp(42px,6.4vw,88px);
      font-weight:950;
      letter-spacing:.05em;
      line-height:.92;
      text-shadow:0 10px 38px rgba(0,0,0,.58);
    }

    .hero p{
      margin:12px auto 0;
      max-width:920px;
      font-size:clamp(15px,1.8vw,21px);
      line-height:1.5;
      color:rgba(255,255,255,.88);
      text-shadow:0 8px 24px rgba(0,0,0,.40);
    }

    .focus-pill{
      position:fixed;
      right:16px;
      bottom:calc(16px + var(--safe-bottom));
      z-index:30;
      min-height:42px;
      padding:10px 14px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.15);
      background:
        radial-gradient(circle at 50% 120%, rgba(212,175,55,.12), transparent 64%),
        rgba(0,0,0,.34);
      color:#fff;
      font-weight:900;
      font-size:13px;
      letter-spacing:.05em;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
      box-shadow:var(--shadowB);
      max-width:min(72vw,420px);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .stage{
      position:absolute;
      inset:0;
      z-index:12;
      perspective:1600px;
      perspective-origin:50% 50%;
    }

    .chamber{
      position:absolute;
      left:50%;
      top:60%;
      width:min(1080px,92vw);
      height:min(620px,58vh);
      transform:translate(-50%,-50%);
      z-index:4;
      transform-style:preserve-3d;
      pointer-events:none;
    }

    .product-node{
      position:absolute;
      width:180px;
      height:180px;
      border:0;
      padding:0;
      background:transparent;
      color:inherit;
      cursor:pointer;
      pointer-events:auto;
      -webkit-tap-highlight-color:transparent;
      touch-action:manipulation;
      transform-style:preserve-3d;
      transition:filter .18s ease;
    }

    .product-shadow{
      position:absolute;
      left:12%;
      right:12%;
      bottom:2%;
      height:16%;
      border-radius:999px;
      background:radial-gradient(circle at 50% 50%, rgba(0,0,0,.34), transparent 72%);
      filter:blur(10px);
      opacity:.86;
      transform:translateZ(-44px);
      pointer-events:none;
    }

    .compass{
      position:absolute;
      inset:0;
      transform-style:preserve-3d;
    }

    .compass-ring{
      position:absolute;
      inset:8px;
      transform:rotate(45deg) translateZ(0);
      border-radius:26px;
      border:1.5px solid rgba(255,255,255,.20);
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,.14), transparent 24%),
        radial-gradient(circle at 78% 22%, rgba(212,175,55,.10), transparent 34%),
        linear-gradient(155deg, rgba(25,38,72,.96), rgba(9,14,28,.96));
      box-shadow:
        0 28px 64px rgba(0,0,0,.42),
        inset 0 0 0 1px rgba(255,255,255,.04),
        0 0 18px rgba(110,170,255,.10);
      overflow:hidden;
    }

    .compass-ring::before{
      content:"";
      position:absolute;
      inset:10px;
      border-radius:18px;
      border:1px solid rgba(212,175,55,.42);
      pointer-events:none;
    }

    .compass-ring::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        linear-gradient(90deg, transparent 0 16%, rgba(255,255,255,.05) 16% 17%, transparent 17% 50%, rgba(255,255,255,.04) 50% 51%, transparent 51% 84%, rgba(255,255,255,.05) 84% 85%, transparent 85% 100%),
        linear-gradient(180deg, transparent 0 16%, rgba(255,255,255,.05) 16% 17%, transparent 17% 50%, rgba(255,255,255,.04) 50% 51%, transparent 51% 84%, rgba(255,255,255,.05) 84% 85%, transparent 85% 100%);
      opacity:.28;
      mix-blend-mode:screen;
      pointer-events:none;
    }

    .compass-core{
      position:absolute;
      inset:30px;
      transform:rotate(45deg) translateZ(18px);
      border-radius:18px;
      border:1px solid rgba(255,255,255,.12);
      background:
        radial-gradient(circle at 50% 50%, rgba(255,255,255,.05), transparent 54%),
        linear-gradient(145deg, rgba(20,28,62,.14), rgba(8,10,22,.04));
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.03),
        0 8px 22px rgba(0,0,0,.22);
      opacity:.80;
    }

    .compass-axis-h,
    .compass-axis-v{
      position:absolute;
      left:50%;
      top:50%;
      background:rgba(255,255,255,.16);
      border-radius:999px;
      transform:translate(-50%,-50%) translateZ(22px);
      pointer-events:none;
    }

    .compass-axis-h{
      width:58%;
      height:1px;
    }

    .compass-axis-v{
      width:1px;
      height:58%;
    }

    .cardinal{
      position:absolute;
      font-size:10px;
      font-weight:900;
      letter-spacing:.14em;
      color:rgba(248,239,214,.84);
      text-shadow:0 4px 10px rgba(0,0,0,.36);
      pointer-events:none;
      transform:translateZ(26px);
    }

    .cardinal.n{left:50%;top:20px;transform:translateX(-50%) translateZ(26px)}
    .cardinal.e{right:16px;top:50%;transform:translateY(-50%) translateZ(26px)}
    .cardinal.s{left:50%;bottom:16px;transform:translateX(-50%) translateZ(26px)}
    .cardinal.w{left:18px;top:50%;transform:translateY(-50%) translateZ(26px)}

    .face-label{
      position:absolute;
      left:50%;
      top:50%;
      width:78%;
      text-align:center;
      transform:translate(-50%,-50%) translateZ(30px);
      text-shadow:0 8px 22px rgba(0,0,0,.55);
      pointer-events:none;
    }

    .product-title{
      margin:0;
      font-size:clamp(15px,1.35vw,23px);
      line-height:1.02;
      font-weight:950;
      letter-spacing:.05em;
    }

    .product-sub{
      margin-top:8px;
      font-size:clamp(10px,.85vw,13px);
      line-height:1.16;
      font-weight:900;
      letter-spacing:.09em;
      color:rgba(255,255,255,.84);
      text-transform:uppercase;
    }

    .product-node[data-kind="coin"] .compass-ring{
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,.16), transparent 24%),
        radial-gradient(circle at 50% 50%, rgba(212,175,55,.12), transparent 52%),
        linear-gradient(155deg, rgba(58,44,14,.94), rgba(16,12,6,.98));
      box-shadow:
        0 28px 64px rgba(0,0,0,.42),
        inset 0 0 0 1px rgba(255,255,255,.03),
        0 0 22px rgba(212,175,55,.10);
    }

    .product-node[data-kind="nutrition"] .compass-ring{
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,.14), transparent 24%),
        radial-gradient(circle at 78% 22%, rgba(120,220,160,.08), transparent 34%),
        linear-gradient(155deg, rgba(22,50,52,.94), rgba(7,18,18,.98));
    }

    .product-node[data-kind="ai"] .compass-ring{
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,.14), transparent 24%),
        radial-gradient(circle at 78% 22%, rgba(255,120,120,.08), transparent 34%),
        linear-gradient(155deg, rgba(36,34,68,.94), rgba(10,10,22,.98));
    }

    .product-node[data-kind="language"] .compass-ring{
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,.14), transparent 24%),
        radial-gradient(circle at 78% 22%, rgba(90,180,255,.10), transparent 34%),
        linear-gradient(155deg, rgba(20,40,72,.94), rgba(8,14,28,.98));
    }

    .product-node[data-kind="game"] .compass-ring{
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,.14), transparent 24%),
        radial-gradient(circle at 78% 22%, rgba(160,110,255,.10), transparent 34%),
        linear-gradient(155deg, rgba(42,26,78,.94), rgba(12,8,28,.98));
    }

    .product-node.is-focus .compass-ring,
    .product-node:hover .compass-ring{
      border-color:rgba(233,214,154,.44);
      box-shadow:
        0 34px 76px rgba(0,0,0,.50),
        0 0 18px rgba(212,175,55,.14),
        0 0 20px rgba(110,170,255,.12);
      filter:saturate(1.08);
    }

    .mobile-dock{
      position:fixed;
      left:12px;
      right:12px;
      bottom:calc(12px + var(--safe-bottom));
      z-index:28;
      display:none;
      grid-template-columns:repeat(5,1fr);
      gap:8px;
    }

    .dock-btn{
      min-height:48px;
      padding:8px 10px;
      border-radius:14px;
      border:1px solid rgba(255,255,255,.14);
      background:linear-gradient(145deg, rgba(10,12,20,.54), rgba(4,6,10,.70));
      color:#fff;
      font-weight:900;
      font-size:10px;
      line-height:1.12;
      letter-spacing:.05em;
      text-transform:uppercase;
      backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
      box-shadow:var(--shadowB);
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      touch-action:manipulation;
      -webkit-tap-highlight-color:transparent;
    }

    .dock-btn.is-active{
      border-color:rgba(212,175,55,.44);
      box-shadow:var(--shadowB),0 0 16px rgba(212,175,55,.10);
    }

    @keyframes starDrift{
      from{transform:translate3d(-1.2%,-.8%,0)}
      to{transform:translate3d(1.2%,.8%,0)}
    }

    @media (max-width:980px){
      .hero{top:12%}
      .chamber{
        width:min(96vw,760px);
        height:min(560px,48vh);
      }
      .product-node{
        width:162px;
        height:162px;
      }
    }

    @media (max-width:720px){
      .top-right{
        top:auto;
        bottom:calc(76px + var(--safe-bottom));
        right:16px;
      }
      .hero{
        top:14%;
        width:min(94vw,640px);
      }
      .hero p{
        font-size:15px;
        max-width:520px;
      }
      .chamber{
        top:59%;
        width:min(98vw,540px);
        height:420px;
      }
      .product-node{
        width:136px;
        height:136px;
      }
      .compass-core{inset:24px}
      .mobile-dock{display:grid}
      .focus-pill{
        bottom:calc(72px + var(--safe-bottom));
      }
      .cardinal{font-size:9px}
      .product-title{font-size:14px}
      .product-sub{font-size:9px}
    }

    @media (max-width:520px){
      .top-nav{gap:8px}
      .nav-btn,.top-pill{
        min-height:40px;
        padding:9px 12px;
        font-size:12px;
      }
      .hero{top:15%}
      .hero h1{font-size:40px}
      .chamber{
        top:58%;
        width:min(100vw,390px);
        height:336px;
      }
      .product-node{
        width:114px;
        height:114px;
      }
      .compass-core{inset:20px}
      .cardinal{font-size:8px}
      .product-title{font-size:12px}
      .product-sub{margin-top:6px;font-size:8px}
    }
  </style>
</head>

<body>
  <div id="app-shell">
    <div class="env" aria-hidden="true"></div>

    <nav class="top-nav" aria-label="Primary">
      <a class="nav-btn" id="navCompass" href="/index.html" data-route="/index.html">COMPASS</a>
      <a class="nav-btn active" id="navProducts" href="/products/" data-route="/products/">PRODUCTS</a>
      <a class="nav-btn" id="navExplore" href="/explore/" data-route="/explore/">EXPLORE</a>
      <a class="nav-btn" id="navGauges" href="/gauges/" data-route="/gauges/">GAUGES</a>
    </nav>

    <div class="top-right" aria-label="Products meta">
      <div class="top-pill" id="scenePill">3D COMPASS CHAMBER</div>
    </div>

    <section class="hero" aria-label="Products hero">
      <h1 id="heroTitle">PRODUCTS</h1>
      <p id="heroTag">Five separate spinning compass-diamond product buttons with direct routing and mobile-safe separation.</p>
    </section>

    <div class="focus-pill" id="focusPill">FOCUS: BASELINE NUTRITION</div>

    <section class="stage" aria-label="Products chamber">
      <div class="chamber" id="productChamber">

        <button class="product-node is-focus" id="nodeNutrition" data-index="0" data-kind="nutrition" data-route="/products/nutrition/" aria-label="Baseline Nutrition Systems" type="button">
          <div class="product-shadow"></div>
          <div class="compass">
            <div class="compass-ring"></div>
            <div class="compass-core"></div>
            <div class="compass-axis-h"></div>
            <div class="compass-axis-v"></div>
            <div class="cardinal n">N</div>
            <div class="cardinal e">E</div>
            <div class="cardinal s">S</div>
            <div class="cardinal w">W</div>
            <div class="face-label">
              <div class="product-title" id="titleNutrition">BASELINE NUTRITION</div>
              <div class="product-sub" id="subNutrition">SYSTEMS</div>
            </div>
          </div>
        </button>

        <button class="product-node" id="nodeAI" data-index="1" data-kind="ai" data-route="/products/on-your-side-ai/" aria-label="On Your Side AI" type="button">
          <div class="product-shadow"></div>
          <div class="compass">
            <div class="compass-ring"></div>
            <div class="compass-core"></div>
            <div class="compass-axis-h"></div>
            <div class="compass-axis-v"></div>
            <div class="cardinal n">N</div>
            <div class="cardinal e">E</div>
            <div class="cardinal s">S</div>
            <div class="cardinal w">W</div>
            <div class="face-label">
              <div class="product-title" id="titleAI">ON YOUR SIDE AI</div>
              <div class="product-sub" id="subAI">INTELLIGENCE</div>
            </div>
          </div>
        </button>

        <button class="product-node" id="nodeLanguage" data-index="2" data-kind="language" data-route="/products/education/" aria-label="Education and Language Systems" type="button">
          <div class="product-shadow"></div>
          <div class="compass">
            <div class="compass-ring"></div>
            <div class="compass-core"></div>
            <div class="compass-axis-h"></div>
            <div class="compass-axis-v"></div>
            <div class="cardinal n">N</div>
            <div class="cardinal e">E</div>
            <div class="cardinal s">S</div>
            <div class="cardinal w">W</div>
            <div class="face-label">
              <div class="product-title" id="titleLanguage">EDUCATION &amp; LANGUAGE</div>
              <div class="product-sub" id="subLanguage">SYSTEMS</div>
            </div>
          </div>
        </button>

        <button class="product-node" id="nodeGame" data-index="3" data-kind="game" data-route="/products/five-flags/" aria-label="Five Flags What's My Theme" type="button">
          <div class="product-shadow"></div>
          <div class="compass">
            <div class="compass-ring"></div>
            <div class="compass-core"></div>
            <div class="compass-axis-h"></div>
            <div class="compass-axis-v"></div>
            <div class="cardinal n">N</div>
            <div class="cardinal e">E</div>
            <div class="cardinal s">S</div>
            <div class="cardinal w">W</div>
            <div class="face-label">
              <div class="product-title" id="titleGame">FIVE FLAGS</div>
              <div class="product-sub" id="subGame">WHAT'S MY THEME?</div>
            </div>
          </div>
        </button>

        <button class="product-node" id="nodeCoin" data-index="4" data-kind="coin" data-route="/products/archcoin/" aria-label="ARCHCOIN" type="button">
          <div class="product-shadow"></div>
          <div class="compass">
            <div class="compass-ring"></div>
            <div class="compass-core"></div>
            <div class="compass-axis-h"></div>
            <div class="compass-axis-v"></div>
            <div class="cardinal n">N</div>
            <div class="cardinal e">E</div>
            <div class="cardinal s">S</div>
            <div class="cardinal w">W</div>
            <div class="face-label">
              <div class="product-title" id="titleCoin">ARCHCOIN</div>
              <div class="product-sub" id="subCoin">PRODUCT LINE</div>
            </div>
          </div>
        </button>

      </div>
    </section>

    <div class="mobile-dock" aria-label="Mobile product navigation">
      <button class="dock-btn is-active" data-focus-index="0" type="button">Nutrition</button>
      <button class="dock-btn" data-focus-index="1" type="button">AI</button>
      <button class="dock-btn" data-focus-index="2" type="button">Education</button>
      <button class="dock-btn" data-focus-index="3" type="button">Five Flags</button>
      <button class="dock-btn" data-focus-index="4" type="button">ARCHCOIN</button>
    </div>
  </div>

  <script src="/products/index.js?v=2"></script>
</body>
</html>

DESTINATION: /products/index.js

(function () {
  "use strict";

  var qs = new URLSearchParams(window.location.search);
  var LS = window.localStorage;

  function safeGet(key) {
    try {
      return LS.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      LS.setItem(key, value);
    } catch (e) {}
  }

  var lang = qs.get("lang") || safeGet("gd_lang") || "en";
  var style = qs.get("style") || safeGet("gd_style") || "informal";
  var time = qs.get("time") || safeGet("gd_time") || "now";
  var depth = qs.get("depth") || safeGet("gd_depth") || "1";
  var lane = qs.get("lane") || "";
  var focus = qs.get("focus") || "nutrition";

  if (lang !== "en" && lang !== "zh" && lang !== "es") lang = "en";
  if (style !== "informal" && style !== "formal") style = "informal";
  if (time !== "origin" && time !== "now" && time !== "post") time = "now";

  var d = parseInt(depth, 10);
  if (!isFinite(d)) d = 1;
  if (d < 1) d = 1;
  if (d > 9) d = 9;
  depth = String(d);

  if (lane !== "platform" && lane !== "engineering") lane = "";

  safeSet("gd_lang", lang);
  safeSet("gd_style", style);
  safeSet("gd_time", time);
  safeSet("gd_depth", depth);

  document.documentElement.lang = lang === "zh" ? "zh" : (lang === "es" ? "es" : "en");

  function pick(en, zh, es) {
    if (lang === "zh") return zh;
    if (lang === "es") return es;
    return en;
  }

  function buildQuery(extra) {
    var p = new URLSearchParams();
    p.set("lang", extra && extra.lang ? extra.lang : lang);
    p.set("style", extra && extra.style ? extra.style : style);
    p.set("time", extra && extra.time ? extra.time : time);
    p.set("depth", extra && extra.depth ? String(extra.depth) : depth);

    var resolvedLane = extra && extra.lane ? extra.lane : lane;
    if (resolvedLane === "platform" || resolvedLane === "engineering") {
      p.set("lane", resolvedLane);
    }

    var resolvedFocus = extra && extra.focus ? extra.focus : focus;
    if (resolvedFocus) {
      p.set("focus", resolvedFocus);
    }

    return "?" + p.toString();
  }

  function withState(route, extra) {
    var glue = route.indexOf("?") >= 0 ? "&" : "?";
    return route + glue + buildQuery(extra).slice(1);
  }

  function navigateTo(path, extra) {
    window.location.href = withState(path, extra || null);
  }

  function wireRoutes() {
    var nodes = document.querySelectorAll("[data-route]");
    var i;
    var el;
    var route;

    for (i = 0; i < nodes.length; i += 1) {
      el = nodes[i];
      route = el.getAttribute("data-route") || "";
      if (!route) continue;
      if (el.tagName === "A") {
        el.setAttribute("href", withState(route));
      }
    }
  }

  var COPY = {
    heroTitle: pick("PRODUCTS", "产品", "PRODUCTOS"),
    heroTag: pick(
      "Five separate spinning compass-diamond product buttons with direct routing and mobile-safe separation.",
      "五个独立旋转的指南针菱形产品按钮，支持直接跳转，并保持移动端安全间距。",
      "Cinco botones de producto tipo brújula-diamante con giro controlado, ruta directa y separación segura en móvil."
    ),
    scenePill: pick("3D COMPASS CHAMBER", "3D 指南针舱", "CÁMARA BRÚJULA 3D"),
    navCompass: pick("COMPASS", "指南针", "BRÚJULA"),
    navProducts: pick("PRODUCTS", "产品", "PRODUCTOS"),
    navExplore: pick("EXPLORE", "探索", "EXPLORAR"),
    navGauges: pick("GAUGES", "量规", "MEDIDORES"),
    focusPrefix: pick("FOCUS:", "聚焦：", "FOCO:"),
    products: [
      {
        key: "nutrition",
        title: pick("BASELINE NUTRITION", "基线营养", "NUTRICIÓN BASELINE"),
        sub: pick("SYSTEMS", "系统", "SISTEMAS"),
        route: "/products/nutrition/"
      },
      {
        key: "ai",
        title: pick("ON YOUR SIDE AI", "站你这边 AI", "ON YOUR SIDE AI"),
        sub: pick("INTELLIGENCE", "智能", "INTELIGENCIA"),
        route: "/products/on-your-side-ai/"
      },
      {
        key: "language",
        title: pick("EDUCATION & LANGUAGE", "教育与语言", "EDUCACIÓN Y LENGUAJE"),
        sub: pick("SYSTEMS", "系统", "SISTEMAS"),
        route: "/products/education/"
      },
      {
        key: "game",
        title: pick("FIVE FLAGS", "五旗", "FIVE FLAGS"),
        sub: pick("WHAT'S MY THEME?", "我的主题是什么？", "¿CUÁL ES MI TEMA?"),
        route: "/products/five-flags/"
      },
      {
        key: "coin",
        title: pick("ARCHCOIN", "ARCHCOIN", "ARCHCOIN"),
        sub: pick("PRODUCT LINE", "产品线", "LÍNEA DE PRODUCTO"),
        route: "/products/archcoin/"
      }
    ]
  };

  var heroTitle = document.getElementById("heroTitle");
  var heroTag = document.getElementById("heroTag");
  var scenePill = document.getElementById("scenePill");
  var navCompass = document.getElementById("navCompass");
  var navProducts = document.getElementById("navProducts");
  var navExplore = document.getElementById("navExplore");
  var navGauges = document.getElementById("navGauges");
  var focusPill = document.getElementById("focusPill");
  var chamber = document.getElementById("productChamber");
  var productNodes = Array.prototype.slice.call(document.querySelectorAll(".product-node"));
  var dockButtons = Array.prototype.slice.call(document.querySelectorAll(".dock-btn"));

  heroTitle.textContent = COPY.heroTitle;
  heroTag.textContent = COPY.heroTag;
  scenePill.textContent = COPY.scenePill;
  navCompass.textContent = COPY.navCompass;
  navProducts.textContent = COPY.navProducts;
  navExplore.textContent = COPY.navExplore;
  navGauges.textContent = COPY.navGauges;

  wireRoutes();

  function setNodeText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function syncCopy() {
    setNodeText("titleNutrition", COPY.products[0].title);
    setNodeText("subNutrition", COPY.products[0].sub);
    setNodeText("titleAI", COPY.products[1].title);
    setNodeText("subAI", COPY.products[1].sub);
    setNodeText("titleLanguage", COPY.products[2].title);
    setNodeText("subLanguage", COPY.products[2].sub);
    setNodeText("titleGame", COPY.products[3].title);
    setNodeText("subGame", COPY.products[3].sub);
    setNodeText("titleCoin", COPY.products[4].title);
    setNodeText("subCoin", COPY.products[4].sub);

    if (dockButtons[0]) dockButtons[0].textContent = pick("Nutrition", "营养", "Nutrición");
    if (dockButtons[1]) dockButtons[1].textContent = pick("AI", "AI", "AI");
    if (dockButtons[2]) dockButtons[2].textContent = pick("Education", "教育", "Educación");
    if (dockButtons[3]) dockButtons[3].textContent = pick("Five Flags", "五旗", "Five Flags");
    if (dockButtons[4]) dockButtons[4].textContent = COPY.products[4].title;
  }

  var STATE = {
    raf: 0,
    focusedIndex: 0,
    reducedMotion: false,
    paused: false,
    mobile: false,
    time: 0,
    baseAnchorsDesktop: [
      { x: 0.50, y: 0.58, z: 80,  scale: 1.10 },  /* center nutrition */
      { x: 0.23, y: 0.29, z: 30,  scale: 0.94 },  /* upper-left ai */
      { x: 0.77, y: 0.29, z: 30,  scale: 0.94 },  /* upper-right archcoin */
      { x: 0.25, y: 0.80, z: 16,  scale: 0.90 },  /* lower-left language */
      { x: 0.75, y: 0.80, z: 16,  scale: 0.90 }   /* lower-right game */
    ],
    baseAnchorsMobile: [
      { x: 0.50, y: 0.56, z: 76,  scale: 1.08 },
      { x: 0.24, y: 0.31, z: 24,  scale: 0.90 },
      { x: 0.76, y: 0.31, z: 24,  scale: 0.90 },
      { x: 0.26, y: 0.77, z: 12,  scale: 0.86 },
      { x: 0.74, y: 0.77, z: 12,  scale: 0.86 }
    ]
  };

  try {
    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    STATE.reducedMotion = !!motionQuery.matches;
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", function () {
        STATE.reducedMotion = !!motionQuery.matches;
      });
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(function () {
        STATE.reducedMotion = !!motionQuery.matches;
      });
    }
  } catch (e) {
    STATE.reducedMotion = false;
  }

  function resolveFocusIndex() {
    var i;
    for (i = 0; i < COPY.products.length; i += 1) {
      if (COPY.products[i].key === focus) return i;
    }
    return 0;
  }

  function setFocus(index, updateUrl) {
    var i;
    var safeIndex = index;
    if (safeIndex < 0) safeIndex = 0;
    if (safeIndex >= COPY.products.length) safeIndex = COPY.products.length - 1;

    STATE.focusedIndex = safeIndex;
    focus = COPY.products[safeIndex].key;

    for (i = 0; i < productNodes.length; i += 1) {
      productNodes[i].classList.toggle("is-focus", i === safeIndex);
    }

    for (i = 0; i < dockButtons.length; i += 1) {
      dockButtons[i].classList.toggle("is-active", i === safeIndex);
    }

    focusPill.textContent = COPY.focusPrefix + " " + COPY.products[safeIndex].title;

    if (updateUrl) {
      window.history.replaceState({}, "", window.location.pathname + buildQuery({ focus: focus }));
    }
  }

  function getAnchors() {
    return STATE.mobile ? STATE.baseAnchorsMobile : STATE.baseAnchorsDesktop;
  }

  function layoutProducts() {
    var anchors = getAnchors();
    var rect = chamber.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var i;
    var node;
    var anchor;
    var x;
    var y;
    var z;
    var scale;
    var spinY;
    var tiltX;
    var sway;
    var glow;
    var compass;
    var shadow;
    var focusLift;

    for (i = 0; i < productNodes.length; i += 1) {
      node = productNodes[i];
      anchor = anchors[i];

      x = w * anchor.x;
      y = h * anchor.y;
      z = anchor.z;
      scale = anchor.scale;

      sway = STATE.reducedMotion ? 0 : Math.sin((STATE.time * 0.0012) + (i * 0.9)) * 6;
      spinY = STATE.reducedMotion ? 0 : ((STATE.time * 0.028) + (i * 23)) % 360;
      tiltX = STATE.reducedMotion ? -10 : (-10 + Math.cos((STATE.time * 0.0014) + (i * 1.1)) * 4);
      focusLift = i === STATE.focusedIndex ? 10 : 0;
      glow = i === STATE.focusedIndex ? 1.06 : 1;

      node.style.left = x + "px";
      node.style.top = (y + sway - focusLift) + "px";
      node.style.marginLeft = (-node.offsetWidth / 2) + "px";
      node.style.marginTop = (-node.offsetHeight / 2) + "px";
      node.style.zIndex = String(20 + Math.round(z));
      node.style.transform =
        "translate3d(0,0," + z + "px) " +
        "scale(" + scale + ")";

      compass = node.querySelector(".compass");
      if (compass) {
        compass.style.transform =
          "rotateX(" + tiltX + "deg) " +
          "rotateY(" + spinY + "deg) " +
          "scale(" + glow + ")";
      }

      shadow = node.querySelector(".product-shadow");
      if (shadow) {
        shadow.style.opacity = i === STATE.focusedIndex ? "0.92" : "0.76";
        shadow.style.transform = "translateZ(-44px) scale(" + (0.96 + (scale - 0.85) * 0.24) + ")";
      }
    }
  }

  function animate(ts) {
    if (!STATE.paused) {
      STATE.time = ts || 0;
      layoutProducts();
    }
    STATE.raf = window.requestAnimationFrame(animate);
  }

  function bindNodes() {
    var i;
    var node;
    var index;
    var route;

    for (i = 0; i < productNodes.length; i += 1) {
      node = productNodes[i];
      index = parseInt(node.getAttribute("data-index") || "0", 10);
      route = node.getAttribute("data-route") || "/products/";

      (function (boundNode, boundIndex, boundRoute) {
        boundNode.addEventListener("mouseenter", function () {
          setFocus(boundIndex, true);
        }, { passive: true });

        boundNode.addEventListener("focus", function () {
          setFocus(boundIndex, true);
        }, { passive: true });

        boundNode.addEventListener("click", function () {
          navigateTo(boundRoute, { focus: COPY.products[boundIndex].key });
        }, { passive: true });
      })(node, index, route);
    }
  }

  function bindDock() {
    var i;
    for (i = 0; i < dockButtons.length; i += 1) {
      (function (boundIndex) {
        dockButtons[boundIndex].addEventListener("click", function () {
          setFocus(boundIndex, true);
        }, { passive: true });
      })(i);
    }
  }

  function updateResponsiveState() {
    STATE.mobile = window.innerWidth < 720;
    layoutProducts();
  }

  function bindSystem() {
    window.addEventListener("resize", updateResponsiveState, { passive: true });

    document.addEventListener("visibilitychange", function () {
      STATE.paused = !!document.hidden;
    }, false);
  }

  function expose() {
    window.__PRODUCTS_COMPASS_CHAMBER__ = {
      getSummary: function () {
        return {
          focus: focus,
          focusedIndex: STATE.focusedIndex,
          reducedMotion: STATE.reducedMotion,
          mobile: STATE.mobile,
          products: COPY.products
        };
      },
      setFocusByKey: function (key) {
        var i;
        for (i = 0; i < COPY.products.length; i += 1) {
          if (COPY.products[i].key === key) {
            setFocus(i, true);
            return true;
          }
        }
        return false;
      }
    };
  }

  syncCopy();
  bindNodes();
  bindDock();
  bindSystem();
  expose();
  setFocus(resolveFocusIndex(), false);
  updateResponsiveState();
  animate(0);
})();
