<!DOCTYPE html>
<html lang="en" data-product-generation="archcoin-b10-vault-chamber-upgrade">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>ARCHCOIN · Vault Chamber · Diamond Gate Bridge</title>
  <meta
    name="description"
    content="ARCHCOIN is the Vault Chamber inside Diamond Gate Bridge: a four-part transaction template for contract authority, inbound value, outbound obligation, and growth allocation."
  />

  <style>
    :root{
      color-scheme:dark;
      --bg:#020713;
      --panel:rgba(7,15,31,.82);
      --panel2:rgba(5,10,22,.94);
      --line:rgba(255,255,255,.13);
      --line2:rgba(127,255,212,.24);
      --text:#f4f8ff;
      --muted:#aebdd8;
      --soft:rgba(174,189,216,.74);
      --gold:#f1d28d;
      --accent:#7fffd4;
      --blue:#7ecbff;
      --red:#ff7582;
      --shadow:0 24px 86px rgba(0,0,0,.52);
      --max:1240px;
      --safe-top:env(safe-area-inset-top,0px);
      --safe-right:env(safe-area-inset-right,0px);
      --safe-bottom:env(safe-area-inset-bottom,0px);
      --safe-left:env(safe-area-inset-left,0px);
    }

    *{box-sizing:border-box}

    html,body{
      margin:0;
      min-height:100%;
      background:
        radial-gradient(circle at 50% 8%,rgba(126,203,255,.16),transparent 30%),
        radial-gradient(circle at 14% 26%,rgba(127,255,212,.10),transparent 34%),
        radial-gradient(circle at 86% 18%,rgba(241,210,141,.10),transparent 30%),
        linear-gradient(180deg,#020713 0%,#07162d 48%,#02040c 100%);
      color:var(--text);
      font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      overflow-x:hidden;
    }

    body{
      min-height:100svh;
      isolation:isolate;
    }

    a{color:inherit;text-decoration:none}

    #fieldCanvas{
      position:fixed;
      inset:0;
      width:100vw;
      height:100vh;
      pointer-events:none;
      z-index:0;
      opacity:.9;
    }

    .page{
      position:relative;
      z-index:1;
      width:min(var(--max),calc(100vw - 24px));
      min-height:100svh;
      margin:0 auto;
      padding:
        calc(16px + var(--safe-top))
        calc(0px + var(--safe-right))
        calc(28px + var(--safe-bottom))
        calc(0px + var(--safe-left));
      display:grid;
      gap:14px;
    }

    .topbar,
    .stage,
    .routeStrip{
      border:1px solid var(--line);
      background:
        radial-gradient(circle at 50% 0%,rgba(127,255,212,.10),transparent 44%),
        linear-gradient(180deg,var(--panel),var(--panel2));
      box-shadow:var(--shadow);
      backdrop-filter:blur(12px);
      -webkit-backdrop-filter:blur(12px);
    }

    .topbar{
      border-radius:999px;
      padding:14px 18px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      flex-wrap:wrap;
    }

    .brand{
      display:flex;
      align-items:center;
      gap:12px;
      min-width:0;
    }

    .brandMark{
      width:44px;
      height:44px;
      border-radius:14px;
      transform:rotate(45deg);
      border:1px solid rgba(241,210,141,.30);
      background:
        radial-gradient(circle at 50% 50%,rgba(127,255,212,.16),transparent 45%),
        linear-gradient(180deg,rgba(18,36,78,.96),rgba(10,22,48,.88));
      box-shadow:0 12px 28px rgba(0,0,0,.24),0 0 28px rgba(127,255,212,.08);
      flex:0 0 auto;
    }

    .brandTitle{
      margin:0 0 3px;
      color:#fff;
      font-size:.96rem;
      font-weight:950;
      letter-spacing:.08em;
      text-transform:uppercase;
    }

    .brandSubtitle{
      margin:0;
      color:var(--muted);
      font-size:.82rem;
      line-height:1.32;
    }

    .actions{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
    }

    .action,
    .routeCard{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:40px;
      padding:10px 14px;
      border:1px solid rgba(255,255,255,.11);
      border-radius:999px;
      background:rgba(255,255,255,.05);
      color:var(--text);
      font-size:12px;
      font-weight:850;
      letter-spacing:.05em;
      text-transform:uppercase;
      text-align:center;
    }

    .action.primary,
    .routeCard.primary{
      border-color:rgba(127,255,212,.30);
      background:rgba(127,255,212,.10);
      color:#ecfff9;
    }

    .stage{
      border-radius:32px;
      padding:clamp(18px,3vw,30px);
      display:grid;
      grid-template-columns:minmax(0,.92fr) minmax(340px,1.08fr);
      gap:18px;
      align-items:stretch;
      overflow:hidden;
      position:relative;
    }

    .stage::before{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background:
        radial-gradient(circle at 73% 50%,rgba(127,255,212,.09),transparent 30rem),
        radial-gradient(circle at 26% 14%,rgba(241,210,141,.07),transparent 22rem),
        linear-gradient(115deg,rgba(255,255,255,.026),transparent 42%,rgba(126,203,255,.036));
    }

    .copy,
    .vaultRoom{
      position:relative;
      z-index:1;
    }

    .copy{
      display:grid;
      gap:14px;
      align-content:center;
    }

    .eyebrow{
      display:inline-flex;
      width:max-content;
      max-width:100%;
      align-items:center;
      gap:8px;
      min-height:34px;
      padding:8px 12px;
      border:1px solid var(--line2);
      border-radius:999px;
      background:rgba(255,255,255,.04);
      color:var(--accent);
      font-size:11px;
      letter-spacing:.12em;
      text-transform:uppercase;
      font-weight:900;
    }

    .eyebrow::before{
      content:"";
      width:8px;
      height:8px;
      border-radius:2px;
      transform:rotate(45deg);
      background:var(--accent);
      box-shadow:0 0 18px rgba(127,255,212,.42);
    }

    h1{
      margin:0;
      max-width:11ch;
      color:#fff;
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(44px,7vw,88px);
      line-height:.86;
      letter-spacing:-.07em;
    }

    .lede{
      margin:0;
      max-width:18ch;
      color:var(--text);
      font-size:clamp(1.18rem,2.4vw,2rem);
      line-height:1.1;
      font-weight:900;
      letter-spacing:-.04em;
    }

    .bodyText{
      margin:0;
      max-width:64ch;
      color:var(--muted);
      font-size:16px;
      line-height:1.65;
    }

    .controlGrid{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:8px;
    }

    .control{
      min-height:54px;
      border:1px solid rgba(255,255,255,.11);
      border-radius:18px;
      background:rgba(255,255,255,.05);
      color:var(--text);
      font-weight:950;
      letter-spacing:.04em;
      cursor:pointer;
      transition:transform .16s ease,border-color .16s ease,background .16s ease;
    }

    .control:hover,
    .control:focus-visible{
      transform:translateY(-2px);
      outline:none;
      border-color:rgba(127,255,212,.30);
    }

    .control[data-active="true"]{
      border-color:rgba(127,255,212,.38);
      background:
        radial-gradient(circle at 50% 0%,rgba(127,255,212,.14),transparent 70%),
        rgba(127,255,212,.06);
      color:#ecfff9;
    }

    .talkCard,
    .receipt{
      border:1px solid rgba(255,255,255,.10);
      border-radius:22px;
      background:rgba(0,0,0,.18);
      padding:14px;
      display:grid;
      gap:10px;
    }

    .talkCard h2{
      margin:0;
      color:var(--gold);
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(1.45rem,3.2vw,2.7rem);
      line-height:.96;
      letter-spacing:-.055em;
    }

    .talkCard p{
      margin:0;
      color:var(--muted);
      line-height:1.62;
    }

    .receiptTitle{
      margin:0;
      color:var(--accent);
      font-size:.70rem;
      letter-spacing:.13em;
      text-transform:uppercase;
      font-weight:950;
    }

    .receiptRows{
      display:grid;
      gap:8px;
    }

    .receiptRow{
      display:grid;
      grid-template-columns:minmax(0,.80fr) minmax(0,1.20fr);
      gap:10px;
      align-items:start;
    }

    .receiptKey{
      color:var(--muted);
      font-size:.76rem;
      line-height:1.35;
    }

    .receiptValue{
      color:var(--text);
      font-size:.76rem;
      line-height:1.35;
      text-align:right;
      font-weight:850;
    }

    .vaultRoom{
      min-height:620px;
      border:1px solid rgba(255,255,255,.09);
      border-radius:30px;
      overflow:hidden;
      display:grid;
      place-items:center;
      background:
        radial-gradient(ellipse at 50% 10%,rgba(126,203,255,.08),transparent 22%),
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.12),rgba(127,255,212,.045) 30%,rgba(0,0,0,0) 58%),
        radial-gradient(circle at 50% 58%,rgba(241,210,141,.055),transparent 72%),
        linear-gradient(180deg,rgba(2,6,14,.58),rgba(2,4,10,.94));
    }

    .vault{
      width:min(78vw,530px);
      aspect-ratio:1;
      border-radius:50%;
      border:18px solid rgba(145,173,205,.13);
      background:
        radial-gradient(circle at 50% 50%,rgba(127,255,212,.10),transparent 27%),
        repeating-conic-gradient(from 0deg,rgba(255,255,255,.052) 0deg 4deg,transparent 4deg 16deg),
        conic-gradient(from 45deg,rgba(127,255,212,.09),rgba(126,203,255,.04),rgba(241,210,141,.08),rgba(126,203,255,.04),rgba(127,255,212,.09));
      box-shadow:
        inset 0 0 48px rgba(0,0,0,.36),
        inset 0 0 96px rgba(255,255,255,.045),
        0 30px 70px rgba(0,0,0,.44),
        0 0 80px rgba(127,255,212,.08);
      display:grid;
      place-items:center;
      position:relative;
    }

    .vault::before{
      content:"";
      position:absolute;
      width:150px;
      height:150px;
      border-radius:50%;
      background:
        radial-gradient(circle at 50% 18%,rgba(255,255,255,.45),transparent 13%),
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.38),rgba(127,255,212,.14) 48%,rgba(0,0,0,.21) 100%);
      box-shadow:
        0 24px 42px rgba(0,0,0,.34),
        inset 0 0 44px rgba(126,203,255,.18),
        0 0 96px rgba(127,255,212,.18);
    }

    .vault::after{
      content:"";
      position:absolute;
      inset:17%;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.10);
      background:
        repeating-conic-gradient(from 0deg,transparent 0deg 20deg,rgba(255,255,255,.08) 20deg 22deg,transparent 22deg 40deg);
      opacity:.74;
      animation:vaultTurn 32s linear infinite;
    }

    .vaultLabel{
      position:relative;
      z-index:2;
      color:#fff;
      font-size:12px;
      line-height:1.18;
      letter-spacing:.08em;
      text-transform:uppercase;
      font-weight:950;
      text-align:center;
      text-shadow:0 2px 12px rgba(0,0,0,.68);
    }

    .gardens{
      position:absolute;
      inset:9%;
      z-index:3;
    }

    .garden{
      position:absolute;
      width:130px;
      min-height:60px;
      border:1px solid rgba(255,255,255,.12);
      border-radius:18px;
      background:rgba(3,9,18,.72);
      display:grid;
      place-items:center;
      text-align:center;
      padding:8px;
      color:var(--muted);
      font-size:.70rem;
      line-height:1.14;
      font-weight:850;
      text-transform:uppercase;
      letter-spacing:.05em;
      cursor:pointer;
      transition:transform .16s ease,border-color .16s ease,background .16s ease;
    }

    .garden:hover,
    .garden:focus-visible{
      outline:none;
      border-color:rgba(241,210,141,.44);
    }

    .garden[data-active="true"]{
      border-color:rgba(241,210,141,.52);
      background:
        radial-gradient(circle at 50% 0%,rgba(241,210,141,.18),transparent 70%),
        rgba(3,9,18,.84);
      color:#fff3d2;
    }

    .garden strong{
      color:var(--text);
      display:block;
      margin-bottom:2px;
    }

    .garden.north{left:50%;top:0;transform:translateX(-50%)}
    .garden.east{right:0;top:50%;transform:translateY(-50%)}
    .garden.south{left:50%;bottom:0;transform:translateX(-50%)}
    .garden.west{left:0;top:50%;transform:translateY(-50%)}

    .routeStrip{
      border-radius:24px;
      padding:12px;
      display:grid;
      grid-template-columns:repeat(6,minmax(0,1fr));
      gap:10px;
    }

    .runtimeNote{
      color:var(--soft);
      text-align:center;
      font-size:.76rem;
      line-height:1.3;
      padding:2px 8px;
    }

    @keyframes vaultTurn{
      from{transform:rotate(0deg)}
      to{transform:rotate(360deg)}
    }

    @media(max-width:980px){
      .stage{grid-template-columns:1fr}
      .vaultRoom{min-height:540px}
      .routeStrip{grid-template-columns:repeat(3,minmax(0,1fr))}
    }

    @media(max-width:640px){
      .page{
        width:min(100vw - 12px,var(--max));
        padding-top:10px;
      }

      .topbar{
        border-radius:24px;
      }

      .stage{
        border-radius:24px;
        padding:16px;
      }

      .actions{
        width:100%;
      }

      .action{
        flex:1 1 140px;
      }

      .controlGrid{
        grid-template-columns:repeat(2,minmax(0,1fr));
      }

      .vaultRoom{
        min-height:430px;
      }

      .vault{
        width:min(84vw,330px);
        border-width:13px;
      }

      .vault::before{
        width:118px;
        height:118px;
      }

      .garden{
        width:94px;
        min-height:48px;
        border-radius:14px;
        font-size:.58rem;
      }

      .receiptRow{
        grid-template-columns:1fr;
      }

      .receiptValue{
        text-align:left;
      }

      .routeStrip{
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
    }

    @media(prefers-reduced-motion:reduce){
      *,
      *::before,
      *::after{
        animation:none !important;
        transition:none !important;
        scroll-behavior:auto !important;
      }
    }
  </style>
</head>

<body>
  <canvas id="fieldCanvas" aria-hidden="true"></canvas>

  <main class="page" data-product="archcoin" data-runtime="archcoin-b10-visible-first">
    <header class="topbar">
      <a class="brand" href="/products/archcoin/" aria-label="ARCHCOIN Vault Chamber">
        <span class="brandMark" aria-hidden="true"></span>
        <span>
          <p class="brandTitle">Richie’s Manor · Vault Chamber</p>
          <p class="brandSubtitle">ARCHCOIN · Four-part transaction template</p>
        </span>
      </a>

      <nav class="actions" aria-label="ARCHCOIN primary routes">
        <a class="action primary" href="/products/">Products Source</a>
        <a class="action" href="/products/archcoin/">Vault</a>
        <a class="action" href="/gauges/">Gauges</a>
        <a class="action" href="/">Compass</a>
      </nav>
    </header>

    <section class="stage" aria-label="ARCHCOIN Vault Chamber">
      <section class="copy" aria-labelledby="archcoinTitle">
        <span class="eyebrow">ARCHCOIN · Vault Chamber</span>
        <h1 id="archcoinTitle">The Vault receives the stream.</h1>
        <p class="lede">This is not a coin pitch. It is a map for how value moves.</p>
        <p class="bodyText">
          Products is the source chamber. ARCHCOIN is the receiving Vault. The four gardens show the four parts of a transaction without turning the page into a dashboard: contract authority, inbound value, outbound obligation, and growth allocation.
        </p>

        <div class="controlGrid" aria-label="ARCHCOIN layer controls">
          <button class="control" type="button" data-layer="source" data-active="true">Source</button>
          <button class="control" type="button" data-layer="vault">Vault</button>
          <button class="control" type="button" data-layer="gardens">Gardens</button>
          <button class="control" type="button" data-layer="boundary">Boundary</button>
        </div>

        <section class="talkCard" aria-live="polite">
          <h2 id="talkTitle">The water starts in Products.</h2>
          <p id="talkCopy">
            Products is the parent source chamber. ARCHCOIN does not create the whole river. It receives the protected-value stream from Products and gives that stream a vault structure.
          </p>
        </section>

        <section class="receipt" aria-label="ARCHCOIN receipt">
          <h2 class="receiptTitle">Vault receipt</h2>
          <div class="receiptRows" id="receiptRows">
            <div class="receiptRow"><span class="receiptKey">Layer</span><strong class="receiptValue">Source</strong></div>
            <div class="receiptRow"><span class="receiptKey">Origin</span><strong class="receiptValue">Products Chamber</strong></div>
            <div class="receiptRow"><span class="receiptKey">Movement</span><strong class="receiptValue">Source stream enters the Vault</strong></div>
          </div>
        </section>
      </section>

      <aside class="vaultRoom" aria-label="ARCHCOIN four-garden vault model">
        <div class="vault">
          <div class="gardens">
            <button class="garden north" type="button" data-garden="North" data-active="true"><span><strong>N · North Coin</strong>Contract Authority</span></button>
            <button class="garden east" type="button" data-garden="East"><span><strong>E · East Coin</strong>Inbound Value</span></button>
            <button class="garden south" type="button" data-garden="South"><span><strong>S · South Coin</strong>Outbound Obligation</span></button>
            <button class="garden west" type="button" data-garden="West"><span><strong>W · West Coin</strong>Growth / Allocation</span></button>
          </div>
          <div class="vaultLabel">Receiving<br>Vault<br>Core</div>
        </div>
      </aside>
    </section>

    <nav class="routeStrip" aria-label="ARCHCOIN route strip">
      <a class="routeCard primary" href="/products/">Products Source</a>
      <a class="routeCard" href="/products/archcoin/">Vault Chamber</a>
      <a class="routeCard" href="/products/on-your-side-ai/">On Your Side AI</a>
      <a class="routeCard" href="/big-laugh/upper-room/">Upper Room</a>
      <a class="routeCard" href="/showroom/">Showroom</a>
      <a class="routeCard" href="/">Compass</a>
    </nav>

    <div class="runtimeNote">
      ARCHCOIN_B10=VISIBLE_FIRST · RUNTIME_ENHANCEMENT=/products/archcoin/index.js · CANONICAL_DESTINATION=/products/archcoin/
    </div>
  </main>

  <script src="./index.js?v=archcoin-b10-vault-chamber-upgrade" defer></script>
</body>
</html>
