DESTINATION: /products/index.html

<!doctype html>
<!-- TNT — /products/index.html
     PRODUCTS AUTHORITY — 3D PRODUCT CHAMBER HOST
     LOCKS:
       - HTML is host/layout only
       - runtime lives in /products/index.js
       - no inline onclick
       - no modal overlays
       - all product objects route
       - product set:
         1) On Your Side AI
         2) Baseline Nutrition Systems
         3) Education & Language Systems
         4) Five Flags / What's My Theme?
         5) ARK Coin
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
      --bg2:#0d1e38;
      --ink:rgba(255,255,255,.96);
      --mut:rgba(255,255,255,.80);
      --line:rgba(255,255,255,.14);
      --line2:rgba(255,255,255,.08);
      --gold:rgba(212,175,55,.54);
      --goldSoft:rgba(212,175,55,.16);
      --blueGlow:rgba(110,170,255,.22);
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

    body::before,
    body::after{
      pointer-events:none!important;
    }

    a{
      color:inherit;
      text-decoration:none;
    }

    #app-shell{
      position:fixed;
      inset:0;
      overflow:hidden;
      isolation:isolate;
      background:
        radial-gradient(circle at 50% 18%, rgba(120,180,255,.10), transparent 30%),
        radial-gradient(circle at 50% 80%, rgba(120,180,255,.08), transparent 34%),
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
      inset:-12%;
      background:
        radial-gradient(circle at 16% 26%, rgba(255,255,255,.98) 0 1.2px, transparent 2px),
        radial-gradient(circle at 28% 18%, rgba(255,255,255,.70) 0 1px, transparent 1.8px),
        radial-gradient(circle at 42% 24%, rgba(255,255,255,.88) 0 1.1px, transparent 1.9px),
        radial-gradient(circle at 58% 14%, rgba(255,255,255,.90) 0 1.2px, transparent 2px),
        radial-gradient(circle at 76% 20%, rgba(255,255,255,.75) 0 1px, transparent 1.8px),
        radial-gradient(circle at 84% 32%, rgba(255,255,255,.94) 0 1.2px, transparent 2px),
        radial-gradient(circle at 18% 62%, rgba(255,255,255,.80) 0 1px, transparent 1.8px),
        radial-gradient(circle at 34% 70%, rgba(255,255,255,.95) 0 1.1px, transparent 1.9px),
        radial-gradient(circle at 52% 74%, rgba(255,255,255,.78) 0 1px, transparent 1.8px),
        radial-gradient(circle at 66% 68%, rgba(255,255,255,.92) 0 1.2px, transparent 2px),
        radial-gradient(circle at 82% 72%, rgba(255,255,255,.80) 0 1px, transparent 1.8px);
      opacity:.62;
      animation:starDrift 28s linear infinite;
    }

    .env::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 50% 50%, rgba(90,140,230,.12), transparent 26%),
        linear-gradient(180deg, transparent 0%, rgba(255,255,255,.02) 50%, transparent 100%);
      opacity:.72;
      filter:blur(8px);
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
      flex-wrap:wrap;
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

    .hero{
      position:absolute;
      top:12%;
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
      max-width:900px;
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
    }

    .stage{
      position:absolute;
      inset:0;
      z-index:12;
      perspective:1400px;
      perspective-origin:50% 48%;
    }

    .orbit-guide{
      position:absolute;
      left:50%;
      top:61%;
      width:min(980px,86vw);
      height:min(530px,48vh);
      transform:translate(-50%,-50%);
      z-index:2;
      pointer-events:none;
      opacity:.26;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.08);
      box-shadow:
        0 0 0 1px rgba(255,255,255,.03) inset,
        0 0 80px rgba(110,170,255,.06);
    }

    .orbit-guide::before,
    .orbit-guide::after{
      content:"";
      position:absolute;
      inset:10%;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.06);
    }

    .orbit-guide::after{
      inset:22%;
      border-color:rgba(255,255,255,.05);
    }

    .product-stage{
      position:absolute;
      left:50%;
      top:61%;
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
      left:50%;
      top:50%;
      margin-left:-90px;
      margin-top:-90px;
      border:0;
      padding:0;
      background:transparent;
      color:inherit;
      cursor:pointer;
      pointer-events:auto;
      -webkit-tap-highlight-color:transparent;
      touch-action:manipulation;
      transform-style:preserve-3d;
    }

    .product-shadow{
      position:absolute;
      left:16%;
      right:16%;
      bottom:6%;
      height:18%;
      border-radius:999px;
      background:radial-gradient(circle at 50% 50%, rgba(0,0,0,.34), transparent 72%);
      filter:blur(10px);
      opacity:.84;
      pointer-events:none;
      transform:translateZ(-40px);
    }

    .product-body{
      position:absolute;
      inset:0;
      border-radius:28px;
      border:1px solid rgba(255,255,255,.18);
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,.16), transparent 24%),
        radial-gradient(circle at 78% 24%, rgba(212,175,55,.10), transparent 34%),
        linear-gradient(155deg, rgba(22,34,62,.96), rgba(9,14,28,.96));
      box-shadow:
        0 28px 64px rgba(0,0,0,.42),
        0 0 18px rgba(110,170,255,.12),
        inset 0 0 0 1px rgba(255,255,255,.04);
      overflow:hidden;
      transform-style:preserve-3d;
      transition:border-color .18s ease, box-shadow .18s ease, filter .18s ease;
    }

    .product-body::before{
      content:"";
      position:absolute;
      inset:10px;
      border-radius:20px;
      border:1px solid rgba(212,175,55,.42);
      pointer-events:none;
      opacity:.96;
    }

    .product-body::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        linear-gradient(90deg, transparent 0 16%, rgba(255,255,255,.05) 16% 17%, transparent 17% 50%, rgba(255,255,255,.04) 50% 51%, transparent 51% 84%, rgba(255,255,255,.05) 84% 85%, transparent 85% 100%),
        linear-gradient(180deg, transparent 0 16%, rgba(255,255,255,.05) 16% 17%, transparent 17% 50%, rgba(255,255,255,.04) 50% 51%, transparent 51% 84%, rgba(255,255,255,.05) 84% 85%, transparent 85% 100%);
      opacity:.30;
      mix-blend-mode:screen;
      pointer-events:none;
    }

    .product-face{
      position:absolute;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;
      text-align:center;
      padding:18px;
      z-index:2;
      pointer-events:none;
      text-shadow:0 8px 22px rgba(0,0,0,.55);
      transform:translateZ(24px);
    }

    .product-icon{
      width:68px;
      height:68px;
      border-radius:18px;
      border:1px solid rgba(255,255,255,.18);
      background:
        radial-gradient(circle at 30% 25%, rgba(255,255,255,.20), transparent 28%),
        linear-gradient(145deg, rgba(80,130,255,.22), rgba(255,255,255,.03));
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.04),
        0 14px 34px rgba(0,0,0,.30);
      margin-bottom:14px;
      position:relative;
      overflow:hidden;
    }

    .product-node[data-kind="coin"] .product-icon{
      border-radius:999px;
      background:
        radial-gradient(circle at 32% 28%, rgba(255,255,255,.22), transparent 24%),
        radial-gradient(circle at 50% 50%, rgba(212,175,55,.18), transparent 64%),
        linear-gradient(145deg, rgba(96,76,24,.78), rgba(42,32,10,.98));
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.05),
        inset 0 0 0 6px rgba(212,175,55,.18),
        0 14px 34px rgba(0,0,0,.30),
        0 0 24px rgba(212,175,55,.12);
    }

    .product-node[data-kind="game"] .product-icon{
      border-radius:16px;
      background:
        radial-gradient(circle at 30% 24%, rgba(255,255,255,.20), transparent 26%),
        linear-gradient(145deg, rgba(160,70,255,.24), rgba(20,10,44,.96));
    }

    .product-node[data-kind="nutrition"] .product-icon{
      border-radius:20px;
      background:
        radial-gradient(circle at 30% 24%, rgba(255,255,255,.20), transparent 26%),
        linear-gradient(145deg, rgba(56,180,120,.24), rgba(10,34,24,.96));
    }

    .product-node[data-kind="language"] .product-icon{
      border-radius:20px;
      background:
        radial-gradient(circle at 30% 24%, rgba(255,255,255,.20), transparent 26%),
        linear-gradient(145deg, rgba(70,150,255,.24), rgba(8,24,44,.96));
    }

    .product-node[data-kind="ai"] .product-icon{
      border-radius:20px;
      background:
        radial-gradient(circle at 30% 24%, rgba(255,255,255,.20), transparent 26%),
        linear-gradient(145deg, rgba(255,120,120,.18), rgba(20,24,44,.96));
    }

    .product-title{
      font-size:clamp(16px,1.45vw,24px);
      line-height:1.02;
      font-weight:950;
      letter-spacing:.05em;
      margin:0;
    }

    .product-sub{
      margin-top:9px;
      font-size:clamp(10px,.9vw,13px);
      line-height:1.18;
      font-weight:900;
      letter-spacing:.08em;
      color:rgba(255,255,255,.84);
      text-transform:uppercase;
    }

    .product-node.is-focus .product-body,
    .product-node:hover .product-body{
      border-color:rgba(212,175,55,.46);
      box-shadow:
        0 34px 76px rgba(0,0,0,.50),
        0 0 18px rgba(212,175,55,.14),
        0 0 20px rgba(110,170,255,.16);
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
      .hero{
        top:13%;
      }
      .product-stage{
        width:min(96vw,760px);
        height:min(560px,48vh);
      }
      .product-node{
        width:162px;
        height:162px;
        margin-left:-81px;
        margin-top:-81px;
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
      .product-stage{
        top:58%;
        width:min(98vw,540px);
        height:420px;
      }
      .product-node{
        width:140px;
        height:140px;
        margin-left:-70px;
        margin-top:-70px;
      }
      .product-icon{
        width:54px;
        height:54px;
        margin-bottom:10px;
      }
      .product-title{
        font-size:15px;
      }
      .product-sub{
        font-size:10px;
      }
      .mobile-dock{
        display:grid;
      }
      .focus-pill{
        bottom:calc(72px + var(--safe-bottom));
      }
    }

    @media (max-width:520px){
      .top-nav{
        gap:8px;
      }
      .nav-btn,
      .top-pill{
        min-height:40px;
        padding:9px 12px;
        font-size:12px;
      }
      .hero{
        top:15%;
      }
      .hero h1{
        font-size:40px;
      }
      .product-stage{
        top:58%;
        width:min(100vw,390px);
        height:340px;
      }
      .product-node{
        width:122px;
        height:122px;
        margin-left:-61px;
        margin-top:-61px;
      }
      .product-icon{
        width:44px;
        height:44px;
        margin-bottom:8px;
      }
      .product-title{
        font-size:13px;
      }
      .product-sub{
        margin-top:6px;
        font-size:9px;
      }
      .orbit-guide{
        width:min(94vw,360px);
        height:250px;
        top:58%;
      }
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
      <div class="top-pill" id="scenePill">3D PRODUCT CHAMBER</div>
    </div>

    <section class="hero" aria-label="Products hero">
      <h1 id="heroTitle">PRODUCTS</h1>
      <p id="heroTag">Select a live product or active build line. Rotating object field with direct product routing.</p>
    </section>

    <div class="focus-pill" id="focusPill">FOCUS: BASELINE NUTRITION</div>

    <section class="stage" aria-label="Products chamber">
      <div class="orbit-guide" aria-hidden="true"></div>

      <div class="product-stage" id="productStage">
        <button class="product-node is-focus" id="nodeNutrition" data-index="0" data-kind="nutrition" data-route="/products/nutrition/" aria-label="Baseline Nutrition Systems" type="button">
          <div class="product-shadow"></div>
          <div class="product-body"></div>
          <div class="product-face">
            <div class="product-icon" aria-hidden="true"></div>
            <div class="product-title" id="titleNutrition">BASELINE NUTRITION</div>
            <div class="product-sub" id="subNutrition">SYSTEMS</div>
          </div>
        </button>

        <button class="product-node" id="nodeAI" data-index="1" data-kind="ai" data-route="/products/on-your-side-ai/" aria-label="On Your Side AI" type="button">
          <div class="product-shadow"></div>
          <div class="product-body"></div>
          <div class="product-face">
            <div class="product-icon" aria-hidden="true"></div>
            <div class="product-title" id="titleAI">ON YOUR SIDE AI</div>
            <div class="product-sub" id="subAI">INTELLIGENCE</div>
          </div>
        </button>

        <button class="product-node" id="nodeLanguage" data-index="2" data-kind="language" data-route="/products/education/" aria-label="Education and Language Systems" type="button">
          <div class="product-shadow"></div>
          <div class="product-body"></div>
          <div class="product-face">
            <div class="product-icon" aria-hidden="true"></div>
            <div class="product-title" id="titleLanguage">EDUCATION &amp; LANGUAGE</div>
            <div class="product-sub" id="subLanguage">SYSTEMS</div>
          </div>
        </button>

        <button class="product-node" id="nodeGame" data-index="3" data-kind="game" data-route="/products/five-flags/" aria-label="Five Flags What's My Theme" type="button">
          <div class="product-shadow"></div>
          <div class="product-body"></div>
          <div class="product-face">
            <div class="product-icon" aria-hidden="true"></div>
            <div class="product-title" id="titleGame">FIVE FLAGS</div>
            <div class="product-sub" id="subGame">WHAT'S MY THEME?</div>
          </div>
        </button>

        <button class="product-node" id="nodeCoin" data-index="4" data-kind="coin" data-route="/products/ark-coin/" aria-label="ARK Coin" type="button">
          <div class="product-shadow"></div>
          <div class="product-body"></div>
          <div class="product-face">
            <div class="product-icon" aria-hidden="true"></div>
            <div class="product-title" id="titleCoin">ARK COIN</div>
            <div class="product-sub" id="subCoin">PRODUCT LINE</div>
          </div>
        </button>
      </div>
    </section>

    <div class="mobile-dock" aria-label="Mobile product navigation">
      <button class="dock-btn is-active" data-focus-index="0" type="button">Nutrition</button>
      <button class="dock-btn" data-focus-index="1" type="button">AI</button>
      <button class="dock-btn" data-focus-index="2" type="button">Education</button>
      <button class="dock-btn" data-focus-index="3" type="button">Five Flags</button>
      <button class="dock-btn" data-focus-index="4" type="button">ARK Coin</button>
    </div>
  </div>

  <script src="/products/index.js?v=1"></script>
</body>
</html>

DESTINATION: /products/index.js

(function () {
  "use strict";

  var qs = new URLSearchParams(window.location.search);
  var LS = window.localStorage;

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
      "Select a live product or active build line. Rotating object field with direct product routing.",
      "选择一个已存在的产品或正在建设中的产品线。旋转对象场，直接进入产品页面。",
      "Selecciona un producto activo o una línea en construcción. Campo de objetos rotantes con ruta directa."
    ),
    scenePill: pick("3D PRODUCT CHAMBER", "3D 产品舱", "CÁMARA DE PRODUCTOS 3D"),
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
        title: pick("ARK COIN", "ARK 币", "ARK COIN"),
        sub: pick("PRODUCT LINE", "产品线", "LÍNEA DE PRODUCTO"),
        route: "/products/ark-coin/"
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
  var stage = document.getElementById("productStage");
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

  var STATE = {
    raf: 0,
    rotation: 0,
    targetRotation: 0,
    focusedIndex: 0,
    pointerX: 0,
    pointerY: 0,
    reducedMotion: false,
    paused: false
  };

  var motionQuery = null;
  try {
    motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    STATE.reducedMotion = !!motionQuery.matches;
  } catch (e) {
    STATE.reducedMotion = false;
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
    if (dockButtons[4]) dockButtons[4].textContent = pick("ARK Coin", "ARK 币", "ARK Coin");
  }

  function setNodeText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
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
    STATE.targetRotation = safeIndex * ((Math.PI * 2) / COPY.products.length);

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

  function layoutProducts() {
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    var cx = w * 0.5;
    var cy = h * 0.56;
    var ringX = Math.min(w * 0.36, 360);
    var ringY = Math.min(h * 0.18, 120);
    var i;
    var node;
    var angleStep = (Math.PI * 2) / COPY.products.length;
    var angle;
    var x;
    var y;
    var depthZ;
    var depthNorm;
    var scale;
    var opacity;
    var rotateY;
    var rotateX;
    var widthBase;

    if (window.innerWidth < 720) {
      ringX = Math.min(w * 0.26, 140);
      ringY = Math.min(h * 0.10, 46);
    }

    for (i = 0; i < productNodes.length; i += 1) {
      node = productNodes[i];
      angle = (i * angleStep) - STATE.rotation;
      x = cx + Math.sin(angle) * ringX;
      y = cy + Math.cos(angle) * ringY * 0.72;
      depthZ = Math.cos(angle) * 220;
      depthNorm = (depthZ + 220) / 440;
      scale = 0.72 + (depthNorm * 0.42);
      opacity = 0.42 + (depthNorm * 0.58);
      rotateY = Math.sin(angle) * -28;
      rotateX = 10 - (depthNorm * 10);
      widthBase = parseFloat(node.offsetWidth || 180);

      node.style.left = x + "px";
      node.style.top = y + "px";
      node.style.marginLeft = (-widthBase / 2) + "px";
      node.style.marginTop = (-widthBase / 2) + "px";
      node.style.opacity = String(opacity);
      node.style.zIndex = String(20 + Math.round(depthNorm * 80));
      node.style.transform =
        "translate3d(0,0," + depthZ + "px) " +
        "rotateX(" + rotateX + "deg) " +
        "rotateY(" + rotateY + "deg) " +
        "scale(" + scale + ")";
    }
  }

  function animate() {
    if (!STATE.paused) {
      if (STATE.reducedMotion) {
        STATE.rotation = STATE.targetRotation;
      } else {
        STATE.targetRotation += 0.0026;
        STATE.rotation += (STATE.targetRotation - STATE.rotation) * 0.04;
      }
      layoutProducts();
    }
    STATE.raf = window.requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    if (window.innerWidth < 720) return;
    var rect = stage.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var ratio = rect.width ? (x / rect.width) : 0.5;
    STATE.pointerX = (ratio - 0.5) * 0.36;
  }

  function bindNodes() {
    var i;
    var node;
    var route;
    var index;

    for (i = 0; i < productNodes.length; i += 1) {
      node = productNodes[i];
      route = node.getAttribute("data-route") || "/products/";
      index = parseInt(node.getAttribute("data-index") || "0", 10);

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

  function bindStage() {
    stage.addEventListener("pointermove", handlePointerMove, { passive: true });

    stage.addEventListener("mouseenter", function () {
      STATE.paused = false;
    }, { passive: true });

    stage.addEventListener("mouseleave", function () {
      STATE.paused = false;
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      STATE.paused = document.hidden;
    }, false);

    window.addEventListener("resize", function () {
      layoutProducts();
    }, { passive: true });

    if (motionQuery) {
      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", function () {
          STATE.reducedMotion = !!motionQuery.matches;
        });
      } else if (typeof motionQuery.addListener === "function") {
        motionQuery.addListener(function () {
          STATE.reducedMotion = !!motionQuery.matches;
        });
      }
    }
  }

  function expose() {
    window.__PRODUCTS_CHAMBER__ = {
      getSummary: function () {
        return {
          focus: focus,
          focusedIndex: STATE.focusedIndex,
          reducedMotion: STATE.reducedMotion,
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
  bindStage();
  expose();
  setFocus(resolveFocusIndex(), false);
  layoutProducts();
  animate();
})();
