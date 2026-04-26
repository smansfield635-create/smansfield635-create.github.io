/* TNT NEW FILE — /runtime/compass_cockpit_render.js
   COMPASS COCKPIT RENDER · PAGE-LEVEL VISUAL AUTHORITY B1

   RENDER_VERSION = "compass-cockpit-render-b1"
   PROTECTED_BASELINE = "Generation 2 Compass Cockpit Baseline"
   ROOT_BOOT_ID = "root-sun-asset-b1"
   COCKPIT_VERSION = "root-compass-cockpit-b1"

   PURPOSE:
     - Own Compass page visual rendering layer
     - Inject cockpit CSS, universe background, HUD styling, satellite sun material, and page layout
     - Preserve /index.html as protected contract shell
     - Preserve /index.js as cockpit operator
     - Preserve /world/control.js as venue geometry authority
     - Do not bind cockpit controls
     - Do not replace DGBIndexBoot or DGBCompassCockpit
*/

(function () {
  "use strict";

  var RENDER_VERSION = "compass-cockpit-render-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var COCKPIT_VERSION = "root-compass-cockpit-b1";
  var STYLE_ID = "compass-cockpit-render-style-b1";

  var RENDER_META = Object.freeze({
    name: "COMPASS_COCKPIT_RENDER",
    version: RENDER_VERSION,
    role: "page_level_visual_render_authority",
    contract: "COMPASS_COCKPIT_RENDER_CONTRACT_B1",
    status: "ACTIVE",
    deterministic: true
  });

  var CSS = `
    *{box-sizing:border-box}
    a{color:inherit;text-decoration:none}
    button{font:inherit}
    html,body{
      width:100%;
      min-height:100%;
      margin:0;
      color:#fff;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      background:#030712;
      overflow-x:hidden;
    }

    :root{
      color-scheme:dark;
      --ink:rgba(255,255,255,.96);
      --txt:rgba(255,255,255,.88);
      --mut:rgba(255,255,255,.72);
      --soft:rgba(255,255,255,.54);
      --line:rgba(255,255,255,.12);
      --gold:rgba(255,217,138,.94);
      --goldSoft:rgba(201,162,74,.16);
      --red:rgba(255,43,43,.12);
      --blue:rgba(83,119,255,.14);
      --panel:rgba(7,10,16,.66);
      --shadow:0 24px 90px rgba(0,0,0,.46);
      --shadow2:0 16px 48px rgba(0,0,0,.44);
      --max:1180px;

      --cockpit-scale:1;
      --cockpit-tilt:0deg;
      --cockpit-pan-x:0px;
      --cockpit-pan-y:0px;
      --hud-strength:.72;
      --axis-opacity:.08;
      --path-opacity:.12;
    }

    .universe-sky{
      position:fixed;
      inset:0;
      z-index:0;
      overflow:hidden;
      pointer-events:none;
      background:
        radial-gradient(circle at 7% 16%,rgba(255,255,255,.30) 0 1px,transparent 1.8px),
        radial-gradient(circle at 18% 73%,rgba(178,205,255,.18) 0 1px,transparent 1.9px),
        radial-gradient(circle at 31% 42%,rgba(255,230,180,.14) 0 1px,transparent 1.8px),
        radial-gradient(circle at 54% 18%,rgba(255,255,255,.18) 0 1px,transparent 1.9px),
        radial-gradient(circle at 72% 79%,rgba(178,205,255,.16) 0 1px,transparent 1.8px),
        radial-gradient(circle at 91% 34%,rgba(255,255,255,.22) 0 1px,transparent 1.9px),
        radial-gradient(ellipse at 18% 4%,rgba(67,95,180,.18),transparent 32rem),
        radial-gradient(ellipse at 82% 18%,rgba(201,162,74,.10),transparent 30rem),
        radial-gradient(ellipse at 46% 92%,rgba(255,43,43,.07),transparent 34rem),
        linear-gradient(180deg,#071225 0%,#030817 48%,#01030a 100%);
    }

    .nebula-plane,.milky-way-plane,.star-dust,.deep-star-cluster,.planet-depth,.orbital-dust,.solar-pressure-haze,.solar-wind-sheer,.cosmic-vignette{
      position:absolute;
      pointer-events:none;
      transition:opacity .32s ease,filter .32s ease,transform .32s ease;
    }

    .nebula-plane{
      inset:-24%;
      background:
        radial-gradient(ellipse at 12% 22%,rgba(84,119,255,.15),transparent 32%),
        radial-gradient(ellipse at 78% 19%,rgba(178,87,255,.08),transparent 30%),
        radial-gradient(ellipse at 64% 75%,rgba(255,218,142,.048),transparent 36%),
        radial-gradient(ellipse at 34% 65%,rgba(51,177,210,.060),transparent 44%);
      filter:blur(25px);
      opacity:.90;
      transform:rotate(-3deg);
    }

    .milky-way-plane{
      inset:-50%;
      transform:rotate(-32deg) translate3d(-8%,4%,0);
      background:
        linear-gradient(90deg,transparent 0%,transparent 26%,rgba(255,255,255,.010) 34%,rgba(129,168,255,.036) 43%,rgba(255,231,184,.024) 49%,rgba(128,168,255,.032) 56%,rgba(255,255,255,.010) 64%,transparent 75%,transparent 100%),
        radial-gradient(ellipse at 43% 48%,rgba(255,255,255,.060),transparent 31%),
        radial-gradient(ellipse at 54% 52%,rgba(168,202,255,.046),transparent 34%);
      opacity:.48;
      filter:blur(.45px);
    }

    .star-dust.one{
      inset:-12%;
      opacity:.36;
      background:
        radial-gradient(circle at 4% 9%,rgba(255,255,255,.34) 0 1px,transparent 1.8px),
        radial-gradient(circle at 23% 36%,rgba(176,204,255,.24) 0 1px,transparent 1.8px),
        radial-gradient(circle at 39% 18%,rgba(255,255,255,.28) 0 1px,transparent 1.8px),
        radial-gradient(circle at 59% 41%,rgba(255,255,255,.27) 0 1px,transparent 1.8px),
        radial-gradient(circle at 79% 12%,rgba(255,255,255,.30) 0 1px,transparent 1.8px),
        radial-gradient(circle at 92% 61%,rgba(176,204,255,.22) 0 1px,transparent 1.8px);
      animation:universeFloatOne 122s linear infinite;
    }

    .star-dust.two{
      inset:-14%;
      opacity:.28;
      background:
        radial-gradient(circle at 7% 61%,rgba(255,255,255,.24) 0 1px,transparent 1.7px),
        radial-gradient(circle at 26% 57%,rgba(255,232,184,.17) 0 1px,transparent 1.7px),
        radial-gradient(circle at 56% 23%,rgba(255,255,255,.24) 0 1px,transparent 1.7px),
        radial-gradient(circle at 87% 80%,rgba(176,204,255,.20) 0 1px,transparent 1.7px),
        radial-gradient(circle at 96% 39%,rgba(255,255,255,.24) 0 1px,transparent 1.7px);
      animation:universeFloatTwo 158s linear infinite;
    }

    .deep-star-cluster{
      inset:-8%;
      opacity:.20;
      background:
        radial-gradient(circle at 18% 48%,rgba(255,255,255,.18) 0 1px,transparent 1.6px),
        radial-gradient(circle at 20% 51%,rgba(255,255,255,.15) 0 1px,transparent 1.6px),
        radial-gradient(circle at 71% 29%,rgba(255,255,255,.17) 0 1px,transparent 1.6px),
        radial-gradient(circle at 73% 32%,rgba(255,230,184,.13) 0 1px,transparent 1.6px);
    }

    .planet-depth{
      border-radius:999px;
      opacity:.24;
      mix-blend-mode:screen;
      filter:blur(.45px);
    }

    .planet-one{
      width:clamp(150px,25vw,340px);
      aspect-ratio:1;
      left:max(-150px,-10vw);
      top:18%;
      background:
        radial-gradient(circle at 39% 31%,rgba(164,191,255,.16),transparent 17%),
        radial-gradient(circle at 52% 50%,rgba(42,74,151,.22),rgba(16,23,55,.10) 62%,transparent 72%);
    }

    .planet-two{
      width:clamp(86px,14vw,210px);
      aspect-ratio:1;
      right:max(-86px,-5.5vw);
      bottom:16%;
      opacity:.20;
      background:
        radial-gradient(circle at 42% 34%,rgba(255,227,162,.09),transparent 15%),
        radial-gradient(circle at 51% 52%,rgba(118,70,164,.20),rgba(22,26,66,.08) 64%,transparent 76%);
    }

    .orbital-dust.one{
      width:clamp(420px,82vw,1120px);
      aspect-ratio:2.55/1;
      left:50%;
      top:52%;
      transform:translate(-50%,-50%) rotate(-17deg);
      border-top:1px solid rgba(255,231,170,.034);
      border-bottom:1px solid rgba(122,158,255,.026);
      opacity:.20;
      border-radius:999px;
      background:
        radial-gradient(ellipse at 46% 50%,transparent 43%,rgba(255,255,255,.018) 46%,transparent 55%),
        radial-gradient(ellipse at 50% 50%,rgba(103,139,236,.024),transparent 68%);
    }

    .solar-pressure-haze{
      inset:-12%;
      opacity:.66;
      background:
        radial-gradient(ellipse at 53% 47%,rgba(255,204,116,.045),transparent 27%),
        radial-gradient(ellipse at 47% 56%,rgba(255,114,61,.030),transparent 37%),
        radial-gradient(ellipse at 50% 50%,transparent 41%,rgba(19,40,96,.14) 74%,transparent 100%);
      filter:blur(10px);
    }

    .solar-wind-sheer{
      inset:-18%;
      opacity:.18;
      transform:rotate(-9deg);
      background:
        linear-gradient(110deg,transparent 0%,rgba(255,255,255,.016) 21%,transparent 32%),
        linear-gradient(113deg,transparent 28%,rgba(126,164,255,.022) 42%,transparent 57%);
      filter:blur(1px);
      mix-blend-mode:screen;
    }

    .cosmic-vignette{
      inset:0;
      background:
        radial-gradient(circle at 50% 48%,transparent 0%,transparent 51%,rgba(0,0,0,.36) 100%),
        linear-gradient(90deg,rgba(0,0,0,.24),transparent 21%,transparent 79%,rgba(0,0,0,.24)),
        linear-gradient(180deg,rgba(0,0,0,.05),transparent 24%,transparent 76%,rgba(0,0,0,.38));
      opacity:.94;
    }

    .page{
      position:relative;
      z-index:1;
      width:min(100% - 28px,var(--max));
      margin:0 auto;
      padding:16px 0 24px;
      display:grid;
      gap:14px;
    }

    .siteTop,.cockpit-control-panel,.routeRail{
      border:1px solid var(--line);
      border-radius:24px;
      padding:12px;
      background:rgba(5,8,14,.58);
      box-shadow:var(--shadow2);
      backdrop-filter:blur(12px);
    }

    .navRow,.routeRail{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      align-items:center;
    }

    .navRow{justify-content:space-between}

    .brand{
      display:flex;
      align-items:center;
      gap:10px;
      font-weight:980;
      letter-spacing:.2px;
    }

    .mark{
      width:34px;
      height:34px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.20);
      background:
        radial-gradient(circle at 32% 26%,rgba(255,255,255,.95),transparent 22%),
        radial-gradient(circle,rgba(255,217,112,.88),rgba(255,130,34,.30) 58%,rgba(255,217,112,.08));
      box-shadow:0 0 26px rgba(201,162,74,.24);
    }

    .navLinks,.cockpit-control-group{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
    }

    .btn,.cockpit-control-panel button{
      min-height:42px;
      border:1px solid var(--line);
      border-radius:999px;
      background:
        radial-gradient(circle at 50% 50%,rgba(201,162,74,.08),transparent 58%),
        linear-gradient(145deg,rgba(14,17,24,.82),rgba(5,7,12,.92));
      color:var(--ink);
      font-weight:920;
      font-size:13px;
      letter-spacing:.3px;
      padding:10px 12px;
      cursor:pointer;
      position:relative;
      overflow:hidden;
      box-shadow:0 12px 34px rgba(0,0,0,.34);
      -webkit-tap-highlight-color:transparent;
    }

    .btn::after,.cockpit-control-panel button[aria-pressed="true"]::after{
      content:"";
      position:absolute;
      inset:-2px;
      border-radius:inherit;
      pointer-events:none;
      box-shadow:0 0 20px var(--goldSoft),inset 0 0 0 1px rgba(201,162,74,.10);
    }

    .btn.red,.cockpit-control-panel button[aria-pressed="true"]{
      border-color:rgba(201,162,74,.44);
      background:
        radial-gradient(circle at 50% 50%,rgba(201,162,74,.14),transparent 58%),
        linear-gradient(145deg,rgba(18,22,31,.86),rgba(8,10,16,.96));
    }

    .hero{
      display:grid;
      grid-template-columns:minmax(0,.82fr) minmax(340px,1.18fr);
      gap:clamp(18px,5vw,54px);
      align-items:center;
      border:1px solid var(--line);
      border-radius:30px;
      padding:clamp(18px,4vw,34px);
      background:
        radial-gradient(circle at 18% 18%,rgba(201,162,74,.10),transparent 36rem),
        radial-gradient(circle at 84% 20%,var(--blue),transparent 34rem),
        radial-gradient(circle at 56% 90%,var(--red),transparent 36rem),
        linear-gradient(150deg,rgba(12,16,24,.76),rgba(5,8,14,.92));
      box-shadow:var(--shadow);
      overflow:hidden;
    }

    .kicker{
      margin:0 0 8px;
      color:var(--gold);
      font-size:11px;
      font-weight:950;
      letter-spacing:3px;
      text-transform:uppercase;
    }

    h1{
      margin:0;
      color:var(--ink);
      font-size:clamp(2.75rem,8vw,6.35rem);
      line-height:.86;
      letter-spacing:-.075em;
    }

    .theme{
      margin:14px 0 0;
      color:var(--ink);
      font-size:clamp(1.35rem,4vw,2.8rem);
      line-height:.98;
      letter-spacing:-.055em;
      text-shadow:0 0 42px rgba(255,217,138,.24);
    }

    .lede{
      max-width:760px;
      margin:14px 0 0;
      color:var(--txt);
      font-size:clamp(1rem,2.2vw,1.18rem);
      line-height:1.55;
    }

    .stateRow{
      margin-top:14px;
      display:flex;
      flex-wrap:wrap;
      gap:10px;
    }

    .statePill{
      border:1px solid var(--line);
      border-radius:999px;
      padding:9px 12px;
      background:rgba(0,0,0,.18);
      color:var(--mut);
      font-weight:850;
    }

    .cockpit-bay{
      position:relative;
      min-height:min(76vh,760px);
      display:grid;
      place-items:center;
      perspective:1200px;
    }

    .cockpit-window{
      position:relative;
      width:100%;
      min-height:min(76vh,760px);
      border:1px solid rgba(255,255,255,.14);
      border-radius:34px;
      overflow:hidden;
      background:
        radial-gradient(circle at 50% 20%,rgba(255,255,255,.045),transparent 34%),
        linear-gradient(145deg,rgba(2,7,16,.18),rgba(0,0,0,.34));
      box-shadow:
        inset 0 0 0 1px rgba(201,162,74,.10),
        inset 0 0 90px rgba(0,0,0,.42),
        0 28px 90px rgba(0,0,0,.40);
      transform:
        translate3d(var(--cockpit-pan-x),var(--cockpit-pan-y),0)
        scale(var(--cockpit-scale))
        rotateZ(var(--cockpit-tilt));
      transition:transform .42s ease,border-color .32s ease;
      isolation:isolate;
    }

    .cockpit-window::before{
      content:"";
      position:absolute;
      inset:0;
      z-index:12;
      pointer-events:none;
      border-radius:34px;
      background:
        linear-gradient(90deg,rgba(255,255,255,.08),transparent 14%,transparent 86%,rgba(255,255,255,.06)),
        linear-gradient(180deg,rgba(255,255,255,.10),transparent 18%,transparent 78%,rgba(0,0,0,.24)),
        radial-gradient(ellipse at 50% 8%,rgba(255,255,255,.08),transparent 38%);
      opacity:.72;
      mix-blend-mode:screen;
    }

    .cockpit-window::after{
      content:"";
      position:absolute;
      inset:12px;
      z-index:13;
      pointer-events:none;
      border:1px solid rgba(255,255,255,.09);
      border-radius:26px;
      box-shadow:inset 0 0 0 1px rgba(201,162,74,.08),inset 0 0 42px rgba(201,162,74,.035);
    }

    .cockpit-axis-grid,.cockpit-path-grid,.cockpit-hud,.cockpit-strut{
      position:absolute;
      pointer-events:none;
    }

    .cockpit-axis-grid{
      inset:0;
      z-index:14;
      opacity:var(--axis-opacity);
      transition:opacity .32s ease;
      background:
        linear-gradient(90deg,transparent calc(50% - .5px),rgba(147,197,253,.42) 50%,transparent calc(50% + .5px)),
        linear-gradient(180deg,transparent calc(50% - .5px),rgba(147,197,253,.42) 50%,transparent calc(50% + .5px)),
        repeating-linear-gradient(90deg,rgba(147,197,253,.08) 0 1px,transparent 1px 54px),
        repeating-linear-gradient(180deg,rgba(147,197,253,.08) 0 1px,transparent 1px 54px);
    }

    .cockpit-path-grid{
      inset:0;
      z-index:14;
      opacity:var(--path-opacity);
      transition:opacity .32s ease;
      background:
        radial-gradient(ellipse at 50% 50%,transparent 0 35%,rgba(255,217,138,.18) 36%,transparent 37%),
        radial-gradient(ellipse at 50% 50%,transparent 0 50%,rgba(255,217,138,.12) 51%,transparent 52%),
        radial-gradient(ellipse at 50% 50%,transparent 0 66%,rgba(255,217,138,.09) 67%,transparent 68%);
      transform:rotate(-12deg);
    }

    .cockpit-hud{
      inset:0;
      z-index:15;
      opacity:var(--hud-strength);
      transition:opacity .32s ease;
    }

    .cockpit-hud::before{
      content:"";
      position:absolute;
      left:50%;
      top:50%;
      width:min(52vw,420px);
      aspect-ratio:1;
      transform:translate(-50%,-50%);
      border-radius:999px;
      border:1px solid rgba(201,162,74,.20);
      box-shadow:0 0 30px rgba(201,162,74,.08),inset 0 0 30px rgba(201,162,74,.05);
      background:
        radial-gradient(circle at 50% 50%,transparent 0 36%,rgba(201,162,74,.035) 37%,transparent 38%),
        radial-gradient(circle at 50% 50%,transparent 0 62%,rgba(255,255,255,.030) 63%,transparent 64%);
    }

    .cockpit-hud::after{
      content:"";
      position:absolute;
      left:50%;
      top:50%;
      width:min(58vw,500px);
      height:1px;
      transform:translate(-50%,-50%);
      background:linear-gradient(90deg,transparent,rgba(201,162,74,.26),transparent);
      box-shadow:0 0 20px rgba(201,162,74,.10);
    }

    .cockpit-strut{
      z-index:16;
      background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.18));
      opacity:.58;
    }

    .cockpit-strut.left{left:10%;top:-10%;width:1px;height:126%;transform:rotate(10deg)}
    .cockpit-strut.right{right:10%;top:-10%;width:1px;height:126%;transform:rotate(-10deg)}
    .cockpit-strut.bottom{left:8%;right:8%;bottom:18%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)}

    .sun-field{
      position:absolute;
      inset:0;
      z-index:2;
      display:grid;
      place-items:center;
      isolation:isolate;
      overflow:visible;
      transition:filter .32s ease;
    }

    .sun-field::before{
      content:"";
      position:absolute;
      width:min(100%,820px);
      aspect-ratio:1;
      border:1px solid rgba(255,248,231,.052);
      border-radius:999px;
      background:
        radial-gradient(circle at 50% 50%,rgba(255,222,138,.040),transparent 28%),
        radial-gradient(circle at 50% 50%,rgba(255,97,22,.022),transparent 62%),
        radial-gradient(circle at 50% 50%,transparent 68%,rgba(255,255,255,.014) 69%,transparent 70%);
      box-shadow:inset 0 0 80px rgba(255,217,138,.022),0 0 120px rgba(255,164,55,.030);
      opacity:.82;
      pointer-events:none;
    }

    .sun-field::after{
      content:"256M km × 256M km solar field";
      position:absolute;
      left:50%;
      bottom:clamp(18px,5vh,46px);
      transform:translateX(-50%);
      border:1px solid rgba(255,255,255,.10);
      border-radius:999px;
      padding:7px 10px;
      background:rgba(2,6,16,.50);
      color:rgba(255,248,231,.54);
      font-size:11px;
      font-weight:900;
      letter-spacing:1.3px;
      text-transform:uppercase;
      white-space:nowrap;
      backdrop-filter:blur(8px);
    }

    .sun-mount{
      position:relative;
      z-index:4;
      width:min(58vw,420px);
      aspect-ratio:1;
      display:grid;
      place-items:center;
      transition:transform .42s ease,filter .32s ease;
      border-radius:999px;
      filter:
        drop-shadow(0 0 18px rgba(255,178,54,.20))
        drop-shadow(0 0 58px rgba(255,122,28,.18))
        drop-shadow(0 0 138px rgba(255,204,96,.11));
    }

    .sun-mount::before{
      content:"";
      position:absolute;
      inset:-10%;
      z-index:0;
      border-radius:999px;
      pointer-events:none;
      background:
        radial-gradient(circle at 50% 50%,rgba(255,236,148,.18),transparent 51%),
        radial-gradient(circle at 50% 50%,rgba(255,111,28,.13),transparent 68%),
        radial-gradient(circle at 50% 50%,transparent 72%,rgba(255,198,80,.10) 77%,transparent 84%);
      filter:blur(4px);
      opacity:.95;
    }

    .sun-mount::after{
      content:"";
      position:absolute;
      inset:-1.25%;
      z-index:5;
      border-radius:999px;
      pointer-events:none;
      border:1px solid rgba(255,236,168,.12);
      box-shadow:
        inset 0 0 18px rgba(255,241,178,.06),
        0 0 24px rgba(255,214,125,.10);
      mix-blend-mode:screen;
    }

    .sun-fallback{
      position:absolute;
      inset:0;
      z-index:2;
      border-radius:999px;
      pointer-events:none;
      overflow:hidden;
      opacity:.99;
      visibility:visible;
      background:
        radial-gradient(circle at 44% 41%,rgba(255,255,225,.94) 0 2.5%,transparent 6%),
        radial-gradient(circle at 30% 34%,rgba(255,236,143,.44) 0 5%,transparent 11%),
        radial-gradient(circle at 68% 28%,rgba(255,226,115,.34) 0 3%,transparent 9%),
        radial-gradient(circle at 62% 63%,rgba(116,32,10,.30) 0 2.2%,transparent 4.4%),
        radial-gradient(circle at 38% 69%,rgba(90,21,8,.26) 0 1.8%,transparent 4.2%),
        radial-gradient(circle at 47% 50%,rgba(255,188,58,.96) 0 18%,rgba(242,119,30,.94) 38%,rgba(163,52,15,.94) 64%,rgba(64,17,8,.92) 100%),
        radial-gradient(circle at 50% 50%,rgba(255,221,113,.95),rgba(224,86,24,.95) 48%,rgba(88,22,10,.96) 77%,rgba(6,2,2,.98) 100%);
      box-shadow:
        inset 0 0 22px rgba(255,248,194,.30),
        inset 0 0 72px rgba(255,169,55,.22),
        inset 0 0 118px rgba(38,7,2,.72),
        0 0 28px rgba(255,145,34,.24),
        0 0 92px rgba(255,190,78,.16);
      background-blend-mode:
        screen,
        screen,
        screen,
        multiply,
        multiply,
        overlay,
        normal;
    }

    .sun-fallback::before{
      content:"";
      position:absolute;
      inset:-4%;
      border-radius:999px;
      pointer-events:none;
      background:
        repeating-radial-gradient(circle at 50% 50%,rgba(255,247,184,.065) 0 1.4px,rgba(158,47,15,.035) 1.6px 3.4px,transparent 3.8px 7.6px),
        repeating-conic-gradient(from 18deg,rgba(255,236,146,.105) 0deg 1.25deg,rgba(139,38,12,.050) 1.35deg 2.2deg,transparent 2.35deg 5.7deg),
        radial-gradient(circle at 50% 50%,transparent 0 58%,rgba(61,12,4,.34) 78%,rgba(2,1,1,.70) 100%);
      opacity:.86;
      mix-blend-mode:overlay;
      filter:contrast(1.12) saturate(1.15);
    }

    .sun-fallback::after{
      content:"";
      position:absolute;
      inset:-7%;
      border-radius:999px;
      pointer-events:none;
      background:
        radial-gradient(circle at 26% 30%,rgba(255,250,198,.18) 0 4%,transparent 10%),
        radial-gradient(circle at 72% 48%,rgba(255,238,153,.13) 0 3.4%,transparent 8.5%),
        radial-gradient(circle at 50% 50%,transparent 0 60%,rgba(255,198,70,.15) 66%,rgba(255,84,22,.13) 76%,transparent 86%),
        conic-gradient(from 28deg,transparent 0 18deg,rgba(255,236,146,.09) 24deg,transparent 37deg 82deg,rgba(255,186,74,.08) 96deg,transparent 112deg 181deg,rgba(255,238,160,.07) 198deg,transparent 216deg 360deg);
      opacity:.72;
      mix-blend-mode:screen;
      filter:blur(.35px) saturate(1.2);
    }

    .sun-mount[data-runtime-mounted="true"] .sun-fallback{
      opacity:.78;
      visibility:visible;
      mix-blend-mode:screen;
    }

    .sun-mount canvas,.sun-mount svg{
      position:relative;
      z-index:4;
      max-width:100%;
      max-height:100%;
      border-radius:999px;
      mix-blend-mode:screen;
      filter:saturate(1.16) contrast(1.05);
    }

    .cockpit-readout{
      position:absolute;
      z-index:18;
      left:18px;
      right:18px;
      bottom:18px;
      display:grid;
      grid-template-columns:1fr auto;
      gap:12px;
      align-items:end;
      pointer-events:none;
    }

    .cockpit-narrative{
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:12px 13px;
      background:rgba(2,6,16,.56);
      color:rgba(255,255,255,.82);
      line-height:1.42;
      font-size:13px;
      backdrop-filter:blur(10px);
      box-shadow:0 12px 34px rgba(0,0,0,.28);
    }

    .cockpit-mode-pill{
      justify-self:end;
      border:1px solid rgba(201,162,74,.24);
      border-radius:999px;
      padding:9px 11px;
      background:rgba(2,6,16,.56);
      color:var(--gold);
      font-size:11px;
      font-weight:950;
      letter-spacing:1.2px;
      text-transform:uppercase;
      white-space:nowrap;
      backdrop-filter:blur(10px);
    }

    .cockpit-control-panel{
      display:grid;
      gap:12px;
    }

    .cockpit-control-head{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:12px;
      flex-wrap:wrap;
    }

    .cockpit-control-title{
      display:grid;
      gap:4px;
    }

    .cockpit-control-title strong{
      color:var(--ink);
      font-size:1rem;
      letter-spacing:-.02em;
    }

    .cockpit-control-title span,.cockpit-control-state,.cockpit-control-status{
      color:var(--soft);
      font-size:12px;
      font-weight:850;
      letter-spacing:1.2px;
      text-transform:uppercase;
    }

    .cockpit-control-grid{
      display:grid;
      grid-template-columns:1.18fr 1fr;
      gap:12px;
    }

    .cockpit-control-panel button{text-transform:uppercase}

    .routeRail{justify-content:center}

    .routeRail a{
      min-height:42px;
      display:flex;
      align-items:center;
      justify-content:center;
      border:1px solid var(--line);
      border-radius:999px;
      background:rgba(0,0,0,.20);
      color:var(--ink);
      font-weight:900;
      font-size:12px;
      padding:0 14px;
    }

    .page[data-cockpit-view="cinematic"]{--cockpit-scale:1;--cockpit-tilt:0deg;--hud-strength:.70;--axis-opacity:.06;--path-opacity:.11}
    .page[data-cockpit-view="wide"]{--cockpit-scale:.92;--cockpit-tilt:-.7deg;--cockpit-pan-y:4px;--hud-strength:.62;--axis-opacity:.08;--path-opacity:.13}
    .page[data-cockpit-view="local"]{--cockpit-scale:1.035;--cockpit-tilt:.45deg;--hud-strength:.78;--axis-opacity:.07;--path-opacity:.10}
    .page[data-cockpit-view="local"] .sun-mount{transform:scale(1.08)}
    .page[data-cockpit-view="axis"]{--cockpit-scale:.98;--cockpit-tilt:0deg;--hud-strength:.88;--axis-opacity:.33;--path-opacity:.10}
    .page[data-cockpit-view="paths"]{--cockpit-scale:.96;--cockpit-tilt:-1.2deg;--hud-strength:.86;--axis-opacity:.16;--path-opacity:.38}
    .page[data-cockpit-view="galaxy"]{--cockpit-scale:.90;--cockpit-tilt:.8deg;--cockpit-pan-y:6px;--hud-strength:.58;--axis-opacity:.07;--path-opacity:.08}
    .page[data-cockpit-view="nebula"]{--cockpit-scale:.96;--cockpit-tilt:-.5deg;--hud-strength:.62;--axis-opacity:.05;--path-opacity:.09}
    .page[data-cockpit-view="control"]{--cockpit-scale:.99;--cockpit-tilt:0deg;--hud-strength:.98;--axis-opacity:.24;--path-opacity:.26}

    body[data-layer-planets="false"] .planet-depth{opacity:0}
    body[data-layer-nebula="false"] .nebula-plane{opacity:0}
    body[data-layer-milkyway="false"] .milky-way-plane{opacity:0}
    body[data-layer-solarwind="false"] .solar-wind-sheer{opacity:0}
    body[data-layer-paths="true"] .orbital-dust.one{opacity:.36}
    body[data-layer-axes="true"] .cockpit-axis-grid{opacity:.38}
    body[data-cockpit-view="galaxy"] .milky-way-plane{opacity:.72;filter:blur(.2px)}
    body[data-cockpit-view="nebula"] .nebula-plane{opacity:1;filter:blur(16px) saturate(1.22)}
    body[data-cockpit-view="wide"] .planet-depth{opacity:.30}
    body[data-cockpit-view="axis"] .cockpit-window{border-color:rgba(147,197,253,.22)}
    body[data-cockpit-view="paths"] .cockpit-window{border-color:rgba(255,217,138,.24)}
    body[data-cockpit-view="control"] .cockpit-window{border-color:rgba(255,255,255,.22)}

    @keyframes universeFloatOne{from{transform:translate3d(0,0,0)}to{transform:translate3d(-37px,24px,0)}}
    @keyframes universeFloatTwo{from{transform:translate3d(0,0,0)}to{transform:translate3d(43px,-31px,0)}}

    @media(max-width:980px){
      .hero{grid-template-columns:1fr}
      .cockpit-bay,.cockpit-window{min-height:620px}
      .sun-mount{width:min(72vw,420px)}
      .cockpit-control-grid{grid-template-columns:1fr}
    }

    @media(max-width:680px){
      .page{width:min(100% - 20px,var(--max));padding-top:10px}
      .navRow{align-items:flex-start}
      .navLinks{width:100%}
      .navLinks .btn{flex:1 1 calc(50% - 8px)}
      .hero{padding:18px}
      h1{font-size:clamp(2.5rem,14vw,4.6rem)}
      .theme{font-size:clamp(1.25rem,7vw,2.1rem)}
      .cockpit-bay,.cockpit-window{min-height:540px}
      .sun-field::after{bottom:80px;max-width:calc(100vw - 44px);overflow:hidden;text-overflow:ellipsis;font-size:10px}
      .sun-mount{width:min(76vw,330px)}
      .cockpit-readout{grid-template-columns:1fr;align-items:start}
      .cockpit-mode-pill{justify-self:start}
      .cockpit-control-group button{flex:1 1 calc(50% - 8px)}
      .routeRail a{flex:1 1 calc(50% - 8px)}
    }

    @media(prefers-reduced-motion:reduce){
      .star-dust.one,.star-dust.two{animation:none}
      .cockpit-window,.sun-field,.sun-mount,.nebula-plane,.milky-way-plane,.planet-depth,.orbital-dust,.solar-wind-sheer{transition:none}
    }
  `;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function injectStyle() {
    var existing = document.getElementById(STYLE_ID);
    var style;

    if (existing) {
      existing.textContent = CSS;
      return existing;
    }

    style = document.createElement("style");
    style.id = STYLE_ID;
    style.setAttribute("data-render-version", RENDER_VERSION);
    style.textContent = CSS;
    document.head.appendChild(style);

    return style;
  }

  function markRoot() {
    var root = document.getElementById("door-root") || $("[data-root-door]");

    if (!root) return null;

    root.setAttribute("data-compass-cockpit-render", RENDER_VERSION);
    root.setAttribute("data-render-authority", "page-level-visual");
    root.setAttribute("data-render-contract", "COMPASS_COCKPIT_RENDER_CONTRACT_B1");
    root.setAttribute("data-render-status", "ACTIVE");
    root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
    root.setAttribute("data-compass-cockpit", COCKPIT_VERSION);

    return root;
  }

  function ensureRenderLayers() {
    var body = document.body;
    var root = markRoot();
    var sky = $(".universe-sky");
    var mount = $("[data-dgb-sun-mount]");
    var fallback = $("[data-sun-fallback]");

    if (body) {
      body.setAttribute("data-render-runtime", RENDER_VERSION);
    }

    if (sky) {
      sky.setAttribute("data-render-layer", "universe-background");
      sky.setAttribute("data-render-version", RENDER_VERSION);
    }

    if (mount) {
      mount.setAttribute("data-render-layer", "satellite-sun");
      mount.setAttribute("data-sun-satellite-profile", "satellite-solar-surface-b1");
    }

    if (fallback) {
      fallback.setAttribute("data-render-layer", "satellite-sun-fallback");
    }

    return root;
  }

  function syncView() {
    var root = document.getElementById("door-root") || $("[data-root-door]");
    var bodyView = document.body ? document.body.getAttribute("data-cockpit-view") : "";
    var rootView = root ? root.getAttribute("data-cockpit-view") : "";
    var view = rootView || bodyView || "cinematic";

    if (root) {
      root.setAttribute("data-cockpit-view", view);
    }

    if (document.body) {
      document.body.setAttribute("data-cockpit-view", view);
    }
  }

  function getPublicState() {
    var root = document.getElementById("door-root") || $("[data-root-door]");
    var style = document.getElementById(STYLE_ID);

    return {
      meta: RENDER_META,
      version: RENDER_VERSION,
      rootBootId: ROOT_BOOT_ID,
      cockpitVersion: COCKPIT_VERSION,
      styleInjected: Boolean(style),
      rootPresent: Boolean(root),
      renderAuthority: root ? root.getAttribute("data-render-authority") : null,
      renderStatus: root ? root.getAttribute("data-render-status") : null,
      satelliteSunProfile: root ? root.getAttribute("data-sun-satellite-profile") || "satellite-solar-surface-b1" : "satellite-solar-surface-b1",
      ownsControlBinding: false,
      ownsVenueGeometry: false,
      ownsWorldLaw: false
    };
  }

  function expose() {
    window.DGBCompassCockpitRender = {
      meta: RENDER_META,
      version: RENDER_VERSION,
      injectStyle: injectStyle,
      markRoot: markRoot,
      ensureRenderLayers: ensureRenderLayers,
      syncView: syncView,
      getPublicState: getPublicState
    };
  }

  function boot() {
    injectStyle();
    ensureRenderLayers();
    syncView();
    expose();
  }

  injectStyle();
  expose();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener("dgb:cockpit:viewchange", function () {
    syncView();
    ensureRenderLayers();
  });
})();
