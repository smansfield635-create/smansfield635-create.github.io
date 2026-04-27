<!doctype html>
<!-- TNT RENEWAL — /products/archcoin/index.html
     ARCHCOIN · FOUR-COIN VAULT TEMPLATE SHELL · B3

     RESULT:
       - Makes ARCHCOIN read as the Vault Chamber financial-template page.
       - Removes ordinary single-coin framing.
       - Provides the shell expected by /products/archcoin/index.js.
       - Adds four-coin transaction-template fallback copy.
       - Preserves canvas field and local safe boot.
       - No generated image.
       - No external image.
       - No graphic box.
-->

<html lang="en" data-page="archcoin-vault-chamber" data-generation="archcoin-four-coin-template-b3">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <title>ARCHCOIN · Four-Coin Vault Template · Diamond Gate Bridge</title>
  <meta
    name="description"
    content="ARCHCOIN — the Vault Chamber four-coin financial transaction template inside Richie's Manor."
  />

  <style>
    :root{
      color-scheme:dark;
      --bg0:#020612;
      --bg1:#071427;
      --panel:rgba(9,18,40,.82);
      --panel2:rgba(10,20,46,.56);
      --line:rgba(173,212,255,.14);
      --line2:rgba(241,210,141,.22);
      --text:#edf5ff;
      --muted:#9fb2d2;
      --muted2:rgba(159,178,210,.70);
      --accent:#7fffd4;
      --gold:#f1d28d;
      --shadow:0 24px 60px rgba(0,0,0,.42);
      --shadow2:0 24px 70px rgba(0,0,0,.46);
      --radiusXl:30px;
      --max:1180px;
    }

    *{box-sizing:border-box}

    html,body{
      margin:0;
      min-height:100%;
      width:100%;
      background:
        radial-gradient(circle at 16% 0%,rgba(58,103,188,.16),transparent 26%),
        radial-gradient(circle at 84% 4%,rgba(241,210,141,.08),transparent 18%),
        linear-gradient(180deg,var(--bg1),var(--bg0));
      color:var(--text);
      font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      overflow-x:hidden;
    }

    a{color:inherit;text-decoration:none}

    #fieldCanvas{
      position:fixed;
      inset:0;
      width:100vw;
      height:100vh;
      z-index:0;
      pointer-events:none;
    }

    .page{
      position:relative;
      z-index:1;
      max-width:var(--max);
      margin:0 auto;
      padding:20px 18px 56px;
    }

    .safe-fallback{
      position:relative;
      z-index:1;
      border:1px solid var(--line);
      border-radius:var(--radiusXl);
      background:linear-gradient(180deg,var(--panel),var(--panel2));
      box-shadow:var(--shadow);
      padding:24px;
      display:grid;
      gap:16px;
    }

    .safe-fallback h1{
      margin:0;
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(2.5rem,7vw,5rem);
      line-height:.92;
    }

    .safe-fallback p{
      margin:0;
      color:var(--muted);
      line-height:1.7;
      max-width:820px;
    }

    .fallback-grid{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:12px;
    }

    .fallback-card{
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:14px;
      background:rgba(255,255,255,.035);
    }

    .fallback-card strong{
      display:block;
      color:var(--gold);
      margin-bottom:8px;
    }

    .fallback-card span{
      display:block;
      color:var(--muted);
      line-height:1.45;
      font-size:.92rem;
    }

    @media(max-width:900px){
      .fallback-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    }

    @media(max-width:620px){
      .fallback-grid{grid-template-columns:1fr}
    }

    @media(prefers-reduced-motion:reduce){
      #fieldCanvas{display:none}
    }
  </style>
</head>

<body
  data-location-frame="richies-manor-and-estate"
  data-house-layer="vault"
  data-vault-chamber="archcoin"
  data-product-route="/products/archcoin/"
  data-archcoin-read="four-coin-financial-transaction-template"
>
  <canvas id="fieldCanvas" aria-hidden="true"></canvas>

  <div id="app" class="page">
    <main class="safe-fallback">
      <h1>ARCHCOIN · Vault Chamber</h1>
      <p>
        ARCHCOIN is not a normal single coin. It is a four-coin financial transaction template for reading, routing, and binding value movement.
      </p>

      <div class="fallback-grid" aria-label="ARCHCOIN four-coin template">
        <div class="fallback-card">
          <strong>North Coin</strong>
          <span>Contract authority.</span>
        </div>
        <div class="fallback-card">
          <strong>East Coin</strong>
          <span>Inbound value / accounts receivable.</span>
        </div>
        <div class="fallback-card">
          <strong>South Coin</strong>
          <span>Outbound obligation / accounts payable.</span>
        </div>
        <div class="fallback-card">
          <strong>West Coin</strong>
          <span>Growth, marketing allocation, or GYP value flow.</span>
        </div>
      </div>

      <p>
        The full local vault interface is loading.
      </p>
    </main>
  </div>

  <noscript>
    <main class="page">
      <section class="safe-fallback">
        <h1>ARCHCOIN · Four-Coin Vault Template</h1>
        <p>
          JavaScript is off. ARCHCOIN remains the Vault Chamber route at /products/archcoin/.
        </p>
      </section>
    </main>
  </noscript>

  <script src="/products/archcoin/index.js" defer></script>
</body>
</html>
