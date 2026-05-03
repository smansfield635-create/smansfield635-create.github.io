<!doctype html>
<!-- TNT — /explore/frontier/vision/index.html
     STATUS: FRONTIER VISION · G1 OPTIMAL · DUAL HORIZON HOST SHELL
     PURPOSE:
       - Keep Vision as the single room
       - Merge former remote-read logic into Vision as Distant Future
       - Add Not-So-Distant Future as the actionable/near horizon
       - Preserve split structure/runtime architecture
       - Keep /explore/frontier/vision/index.js as runtime owner
       - Preserve cosmic host shell
       - Correct white-screen host background failure
       - Preserve canonical carry: gd_lang/gd_style/gd_time/gd_depth only
       - Lane remains URL-only
-->

<html
  lang="en"
  data-route="/explore/frontier/vision/"
  data-page="frontier-vision"
  data-version="G1-OPTIMAL"
  data-contract="VISION_G1_OPTIMAL_DUAL_HORIZON_HOST_TNT_v1"
  data-status="active"
  data-parent="/explore/frontier/"
  data-baseline="AUDRALIA_MANOR_CURRENT"
  data-expression="dual-horizon-vision-host-with-russian-doll-underlay"
  data-runtime-owner="/explore/frontier/vision/index.js"
  data-heavy-runtime-loaded="vision-host-only"
  data-visual-pass-claimed="false"
>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Diamond Gate Bridge · Frontier · Vision G1 Optimal</title>
  <meta name="description" content="Vision G1 Optimal shows the future in two distances: the not-so-distant future that can be planned now, and the distant future that requires confidence labels."/>

  <link rel="stylesheet" href="/assets/ui.css"/>
  <link rel="stylesheet" href="/assets/branch.css"/>

  <style>
    :root{
      --D0:148px;
      --D1:108px;
      --D2:92px;
      --D3:82px;

      --Z0:38px;
      --Z1:34px;
      --Z2:30px;
      --Z3:28px;

      --padTop:204px;

      --ink:rgba(255,255,255,.96);
      --mut:rgba(255,255,255,.78);

      --onyx0:rgba(4,6,10,.98);
      --onyx1:rgba(10,12,18,.94);
      --onyx2:rgba(18,22,30,.84);

      --crimson:rgba(120,0,22,.42);
      --festival:rgba(255,43,43,.20);
      --opalV:rgba(90,40,120,.15);

      --gold:rgba(201,162,74,.58);
      --goldGlow:rgba(201,162,74,.24);
      --goldLine:rgba(201,162,74,.18);

      --shadowDeep:0 44px 140px rgba(0,0,0,.82);
      --shadowC:0 18px 60px rgba(0,0,0,.55);
    }

    *{box-sizing:border-box}
    a{color:inherit;text-decoration:none}

    html,
    body{
      margin:0;
      min-height:100%;
      color:#fff;
      background:
        radial-gradient(circle at 50% 44%, rgba(201,162,74,.12), transparent 28rem),
        radial-gradient(circle at 50% 52%, rgba(40,70,150,.16), transparent 42rem),
        linear-gradient(180deg,#02040a 0%,#040711 48%,#010208 100%);
      font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      overflow:hidden;
    }

    body::before,
    body::after{
      pointer-events:none !important;
    }

    .top{
      position:fixed;
      top:16px;
      left:0;
      right:0;
      z-index:240;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:0 16px;
      pointer-events:none;
    }

    .top__group{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      white-space:nowrap;
      pointer-events:auto;
    }

    .horizonPanel{
      position:fixed;
      top:82px;
      left:50%;
      z-index:235;
      width:min(680px,92vw);
      transform:translateX(-50%);
      padding:12px;
      border:1px solid rgba(201,162,74,.20);
      border-radius:24px;
      background:
        radial-gradient(circle at 30% 0%, rgba(201,162,74,.14), transparent 55%),
        radial-gradient(circle at 80% 20%, rgba(90,120,255,.10), transparent 58%),
        rgba(4,7,14,.76);
      box-shadow:0 22px 70px rgba(0,0,0,.44), inset 0 1px 0 rgba(255,255,255,.08);
      backdrop-filter:blur(10px);
    }

    .horizonPanel__title{
      margin:0 0 8px;
      color:rgba(255,255,255,.82);
      font-size:11px;
      font-weight:900;
      letter-spacing:2.2px;
      text-transform:uppercase;
    }

    .horizonTabs{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-bottom:10px;
    }

    .horizonBtn{
      appearance:none;
      border:1px solid rgba(255,255,255,.14);
      border-radius:999px;
      padding:9px 12px;
      cursor:pointer;
      color:rgba(255,255,255,.88);
      background:rgba(255,255,255,.045);
      font-size:12px;
      font-weight:900;
      letter-spacing:.8px;
      text-transform:uppercase;
    }

    .horizonBtn[aria-pressed="true"]{
      color:#080a10;
      border-color:rgba(255,228,150,.86);
      background:linear-gradient(135deg, rgba(255,240,170,.96), rgba(201,162,74,.92));
    }

    .horizonReadout{
      display:grid;
      gap:4px;
    }

    .horizonReadout strong{
      color:rgba(255,244,210,.96);
      font-size:16px;
      line-height:1.05;
      letter-spacing:-.02em;
    }

    .horizonReadout p{
      margin:0;
      color:rgba(235,240,255,.78);
      font-size:13px;
      line-height:1.42;
    }

    .stage{
      position:relative;
      width:min(980px,95vw);
      height:min(980px,82vh);
      margin:var(--padTop) auto 0;
      pointer-events:none;
      perspective:1200px;
      perspective-origin:50% 44%;
      transform-style:preserve-3d;
      overflow:hidden;
      background:
        radial-gradient(circle at 50% 50%, rgba(255,225,150,.10), transparent 19rem),
        radial-gradient(circle at 50% 50%, rgba(40,80,170,.14), transparent 34rem),
        radial-gradient(circle at 50% 50%, rgba(0,0,0,.22), transparent 52rem);
      border-radius:999px;
    }

    .stage::before{
      content:"";
      position:absolute;
      inset:8% 10% 14%;
      z-index:0;
      pointer-events:none;
      border-radius:999px;
      background:
        radial-gradient(circle at 50% 52%, rgba(255,43,43,.07), transparent 26%),
        radial-gradient(circle at 50% 50%, rgba(201,162,74,.06), transparent 42%),
        radial-gradient(circle at 50% 50%, rgba(30,60,140,.10), transparent 76%);
      filter:blur(52px);
      opacity:.58;
      animation:stagePulse 10s ease-in-out infinite;
    }

    .starfield{
      position:absolute;
      inset:0;
      z-index:0;
      pointer-events:none;
      overflow:hidden;
    }

    .star{
      position:absolute;
      border-radius:999px;
      background:rgba(255,255,255,.82);
      box-shadow:0 0 6px rgba(255,255,255,.22);
      animation:starTwinkle linear infinite;
      will-change:opacity;
    }

    .coreGlow{
      position:absolute;
      left:50%;
      top:50%;
      z-index:3;
      width:300px;
      height:300px;
      border-radius:999px;
      transform:translate(-50%,-50%);
      pointer-events:none;
      background:
        radial-gradient(circle at 50% 50%, rgba(255,226,150,.48) 0%, rgba(255,198,90,.22) 20%, rgba(255,180,70,.07) 42%, rgba(255,180,70,0) 74%);
      filter:blur(18px);
      animation:coreGlowPulse 7.4s ease-in-out infinite;
    }

    .orbitBand{
      display:none;
    }

    .planetNode{
      --face:var(--D3);
      --depth:var(--Z3);
      --round:28px;
      --shadowY:calc(var(--face) * .48);

      position:absolute;
      left:50%;
      top:50%;
      z-index:8;
      width:calc(var(--face) + (var(--depth) * 2));
      height:calc(var(--face) + (var(--depth) * 2));
      pointer-events:auto;
      cursor:pointer;
      touch-action:manipulation;
      -webkit-tap-highlight-color:transparent;
      transform:translate(-50%,-50%);
      transform-style:preserve-3d;
      filter:drop-shadow(0 16px 36px rgba(0,0,0,.34));
    }

    .planetNode--l1{ --face:var(--D1); --depth:var(--Z1); --round:30px; }
    .planetNode--l2{ --face:var(--D2); --depth:var(--Z2); --round:28px; }
    .planetNode--l3{ --face:var(--D3); --depth:var(--Z3); --round:26px; }
    .planetNode--core{ --face:var(--D0); --depth:var(--Z0); --round:32px; }

    .planetShadow{
      position:absolute;
      left:50%;
      top:50%;
      width:calc(var(--face) * .98);
      height:calc(var(--face) * .28);
      pointer-events:none;
      transform:translate(-50%, var(--shadowY)) rotate(-8deg);
      border-radius:999px;
      background:
        radial-gradient(circle at 50% 50%, rgba(0,0,0,.48) 0%, rgba(0,0,0,.24) 42%, rgba(0,0,0,.08) 72%, rgba(0,0,0,0) 100%);
      filter:blur(10px);
      opacity:.84;
    }

    .planetCube{
      position:absolute;
      left:50%;
      top:50%;
      width:var(--face);
      height:var(--face);
      transform-style:preserve-3d;
      transform:translate(-50%,-50%) rotateZ(45deg) rotateX(58deg) rotateY(-30deg);
      transition:filter .18s ease;
      will-change:transform;
    }

    .planetNode:hover .planetCube,
    .planetNode:focus .planetCube,
    .planetNode:focus-within .planetCube{
      filter:brightness(1.04) saturate(1.05);
    }

    .face{
      position:absolute;
      overflow:hidden;
      border:1px solid rgba(255,255,255,.14);
      backface-visibility:hidden;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.14),
        inset 0 -22px 42px rgba(0,0,0,.34);
    }

    .face::before{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background:
        linear-gradient(180deg, rgba(255,255,255,.10), transparent 30%, transparent 72%, rgba(0,0,0,.10)),
        repeating-linear-gradient(45deg, rgba(201,162,74,.06) 0 1px, transparent 1px 18px),
        repeating-linear-gradient(-45deg, rgba(201,162,74,.05) 0 1px, transparent 1px 18px);
      opacity:.72;
    }

    .face::after{
      content:"";
      position:absolute;
      top:-16%;
      left:-34%;
      width:58%;
      height:148%;
      pointer-events:none;
      opacity:.34;
      transform:rotate(10deg);
      background:linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.04) 24%, rgba(255,255,255,.18) 50%, rgba(255,255,255,.04) 72%, rgba(255,255,255,0) 100%);
      filter:blur(2px);
      animation:faceSweep 9s linear infinite;
      animation-delay:var(--phase,0s);
    }

    .face--front,
    .face--back{
      left:50%;
      top:50%;
      width:var(--face);
      height:var(--face);
      margin-left:calc(var(--face) / -2);
      margin-top:calc(var(--face) / -2);
      border-radius:var(--round);
    }

    .face--front{
      transform:translateZ(calc(var(--depth) / 2));
      background:
        radial-gradient(circle at 24% 22%, rgba(255,255,255,.24), transparent 36%),
        radial-gradient(circle at 76% 26%, var(--festival), transparent 56%),
        radial-gradient(circle at 74% 82%, var(--opalV), transparent 64%),
        radial-gradient(circle at 26% 82%, var(--crimson), transparent 68%),
        linear-gradient(155deg, var(--onyx2), var(--onyx0));
      box-shadow:
        0 0 24px rgba(255,43,43,.10),
        inset 0 2px 0 rgba(255,255,255,.16),
        inset 0 -42px 82px rgba(0,0,0,.72);
    }

    .planetNode--core .face--front{
      background:
        radial-gradient(circle at 24% 22%, rgba(255,255,255,.18), transparent 34%),
        radial-gradient(circle at 76% 26%, rgba(255,220,130,.12), transparent 58%),
        radial-gradient(circle at 74% 82%, rgba(201,162,74,.12), transparent 64%),
        radial-gradient(circle at 26% 82%, rgba(255,120,60,.10), transparent 66%),
        linear-gradient(155deg, rgba(74,58,24,.42), rgba(18,12,8,.40));
      box-shadow:
        0 0 14px rgba(255,220,130,.08),
        inset 0 1px 0 rgba(255,255,255,.14),
        inset 0 -26px 58px rgba(0,0,0,.28);
      border-color:rgba(255,240,200,.08);
    }

    .face--back{
      transform:rotateY(180deg) translateZ(calc(var(--depth) / 2));
      background:
        radial-gradient(circle at 50% 50%, rgba(201,162,74,.04), transparent 56%),
        linear-gradient(155deg, rgba(16,18,24,.88), rgba(4,6,10,.98));
      opacity:.88;
    }

    .face--left,
    .face--right{
      top:50%;
      left:50%;
      width:var(--depth);
      height:calc(var(--face) * .96);
      margin-left:calc(var(--depth) / -2);
      margin-top:calc((var(--face) * .96) / -2);
      border-radius:18px;
    }

    .face--left{
      transform:rotateY(-90deg) translateZ(calc(var(--face) / 2));
      background:
        linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,.14)),
        linear-gradient(155deg, rgba(110,22,28,.46), rgba(14,18,26,.94));
    }

    .planetNode--core .face--left{
      background:
        linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,.10)),
        linear-gradient(155deg, rgba(132,96,34,.34), rgba(28,16,10,.52));
    }

    .face--right{
      transform:rotateY(90deg) translateZ(calc(var(--face) / 2));
      background:
        linear-gradient(180deg, rgba(255,255,255,.16), rgba(0,0,0,.08)),
        linear-gradient(155deg, rgba(184,146,92,.54), rgba(16,18,24,.90));
    }

    .planetNode--core .face--right{
      background:
        linear-gradient(180deg, rgba(255,255,255,.18), rgba(0,0,0,.06)),
        linear-gradient(155deg, rgba(218,180,108,.34), rgba(32,22,12,.52));
    }

    .face--top,
    .face--bottom{
      left:50%;
      top:50%;
      width:calc(var(--face) * .96);
      height:var(--depth);
      margin-left:calc((var(--face) * .96) / -2);
      margin-top:calc(var(--depth) / -2);
      border-radius:18px;
    }

    .face--top{
      transform:rotateX(90deg) translateZ(calc(var(--face) / 2));
      background:
        linear-gradient(180deg, rgba(255,255,255,.20), rgba(0,0,0,.04)),
        linear-gradient(155deg, rgba(116,86,52,.64), rgba(34,28,22,.88));
    }

    .planetNode--core .face--top{
      background:
        linear-gradient(180deg, rgba(255,255,255,.18), rgba(0,0,0,.02)),
        linear-gradient(155deg, rgba(230,196,126,.30), rgba(80,54,22,.48));
    }

    .face--bottom{
      transform:rotateX(-90deg) translateZ(calc(var(--face) / 2));
      background:
        linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.24)),
        linear-gradient(155deg, rgba(12,14,18,.92), rgba(4,6,10,.98));
      opacity:.96;
    }

    .skeleton{
      position:absolute;
      left:50%;
      top:50%;
      width:var(--face);
      height:var(--face);
      margin-left:calc(var(--face) / -2);
      margin-top:calc(var(--face) / -2);
      pointer-events:none;
      transform-style:preserve-3d;
    }

    .skeleton__plane{
      position:absolute;
      inset:0;
      border-radius:var(--round);
      border:1px solid transparent;
      box-shadow:inset 0 0 0 1px rgba(201,162,74,.18);
      backface-visibility:hidden;
    }

    .planetNode--core .skeleton__plane{
      box-shadow:inset 0 0 0 1px rgba(255,224,146,.10);
    }

    .skeleton__plane--front{
      transform:translateZ(calc(var(--depth) / 2 + 1px));
    }

    .skeleton__plane--back{
      transform:rotateY(180deg) translateZ(calc(var(--depth) / 2 + 1px));
      opacity:.30;
    }

    .skeleton__edge{
      position:absolute;
      left:50%;
      top:50%;
      width:2px;
      height:calc(var(--face) * 1.04);
      margin-left:-1px;
      margin-top:calc((var(--face) * 1.04) / -2);
      background:linear-gradient(180deg, rgba(201,162,74,.04), rgba(201,162,74,.42), rgba(201,162,74,.04));
      border-radius:999px;
      transform-origin:center center;
      opacity:.84;
      filter:drop-shadow(0 0 6px rgba(201,162,74,.18));
    }

    .planetNode--core .skeleton__edge{
      background:linear-gradient(180deg, rgba(255,224,146,.04), rgba(255,224,146,.18), rgba(255,224,146,.04));
      filter:drop-shadow(0 0 4px rgba(255,224,146,.10));
      opacity:.54;
    }

    .skeleton__edge--v{ transform:translateZ(calc(var(--depth) / 2 + 2px)); }
    .skeleton__edge--d1{ transform:translateZ(calc(var(--depth) / 2 + 2px)) rotate(45deg); }
    .skeleton__edge--d2{ transform:translateZ(calc(var(--depth) / 2 + 2px)) rotate(-45deg); }

    .skeleton__spine{
      position:absolute;
      left:50%;
      top:50%;
      width:2px;
      height:calc(var(--depth) + 10px);
      margin-left:-1px;
      margin-top:calc((var(--depth) + 10px) / -2);
      background:linear-gradient(180deg, rgba(201,162,74,.16), rgba(255,255,255,.28), rgba(201,162,74,.16));
      transform:translateZ(0) rotateX(90deg);
      border-radius:999px;
      opacity:.72;
      filter:drop-shadow(0 0 4px rgba(201,162,74,.14));
    }

    .planetNode--core .skeleton__spine{
      opacity:.44;
      filter:drop-shadow(0 0 3px rgba(255,224,146,.08));
    }

    .planetLabel{
      position:absolute;
      left:50%;
      top:50%;
      z-index:20;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      width:var(--face);
      height:var(--face);
      pointer-events:none;
      transform:translate(-50%,-50%);
      text-align:center;
      text-shadow:0 0 18px rgba(0,0,0,.42), 0 1px 0 rgba(255,255,255,.04);
    }

    .planetLabel::before{
      content:"";
      position:absolute;
      inset:12% 10% auto;
      height:28%;
      border-radius:999px;
      opacity:.74;
      background:linear-gradient(to bottom, rgba(255,255,255,.18), rgba(255,255,255,0));
      transform:rotate(-12deg);
      filter:blur(.3px);
      pointer-events:none;
    }

    .planetLabel::after{
      content:"";
      position:absolute;
      inset:16% 14%;
      border-radius:20px;
      opacity:.16;
      background:
        radial-gradient(circle at 50% 64%, rgba(255,43,43,.34), transparent 52%),
        radial-gradient(circle at 50% 42%, rgba(201,162,74,.16), transparent 58%);
      filter:blur(10px);
      animation:innerGlow 8s ease-in-out infinite;
      animation-delay:var(--phase,0s);
      pointer-events:none;
    }

    .planetNode--core .planetLabel::after{
      opacity:.18;
      background:
        radial-gradient(circle at 50% 64%, rgba(255,170,80,.18), transparent 52%),
        radial-gradient(circle at 50% 42%, rgba(255,224,146,.14), transparent 58%);
    }

    .planetWord{
      position:relative;
      z-index:2;
      font-size:11.5px;
      font-weight:980;
      line-height:1.05;
      letter-spacing:.55px;
      color:var(--ink);
    }

    .planetCode{
      position:relative;
      z-index:2;
      margin-top:5px;
      font-size:9px;
      letter-spacing:1.1px;
      color:rgba(255,255,255,.84);
      opacity:.82;
    }

    .planetNode--core .planetWord{ font-size:15px; }
    .planetNode--core .planetCode{ font-size:10px; }
    .planetNode--l1 .planetWord{ font-size:13px; }
    .planetNode--l2 .planetWord{ font-size:12px; }

    .control{
      position:relative;
      display:grid;
      place-items:center;
      width:46px;
      height:46px;
      overflow:hidden;
      border:1px solid rgba(255,255,255,.14);
      border-radius:14px;
      cursor:pointer;
      pointer-events:auto;
      touch-action:manipulation;
      -webkit-tap-highlight-color:transparent;
      transform:rotate(45deg);
      background:
        radial-gradient(circle at 50% 120%, rgba(201,162,74,.16), transparent 64%),
        linear-gradient(145deg, rgba(10,12,16,.78), rgba(6,8,10,.90));
      box-shadow:var(--shadowC);
      transition:box-shadow .16s ease,border-color .16s ease,filter .16s ease;
      animation:controlAmbient 8.6s ease-in-out infinite;
    }

    .control::before{
      content:"";
      position:absolute;
      inset:0;
      border-radius:inherit;
      opacity:.34;
      pointer-events:none;
      box-shadow:inset 0 0 0 1px rgba(201,162,74,.18);
      background:
        linear-gradient(180deg, rgba(255,255,255,.08), transparent 42%),
        radial-gradient(circle at 78% 24%, rgba(255,43,43,.10), transparent 46%);
    }

    .control::after{
      content:"";
      position:absolute;
      left:10px;
      right:10px;
      bottom:-12px;
      height:26px;
      opacity:.55;
      pointer-events:none;
      background:radial-gradient(circle at 50% 0%, rgba(201,162,74,.30), transparent 72%);
    }

    .control:hover{
      border-color:rgba(201,162,74,.34);
      box-shadow:var(--shadowC), 0 0 0 2px rgba(201,162,74,.14), 0 0 26px rgba(201,162,74,.16);
      filter:brightness(1.03);
    }

    .control.is-on{
      border-color:rgba(255,43,43,.26);
      box-shadow:var(--shadowC), 0 0 16px rgba(255,43,43,.12), 0 0 26px rgba(201,162,74,.08);
    }

    .control__label{
      font-size:12px;
      font-weight:980;
      letter-spacing:.4px;
      color:var(--ink);
      user-select:none;
      transform:rotate(-45deg);
      text-shadow:0 0 12px rgba(0,0,0,.34);
    }

    .corner{
      position:fixed;
      bottom:max(18px, env(safe-area-inset-bottom));
      z-index:240;
      pointer-events:none;
    }

    .corner--left{left:18px}
    .corner--right{right:18px}
    .corner .control{ pointer-events:auto; }

    .corner__text{
      margin-top:10px;
      font-size:11px;
      letter-spacing:.4px;
      text-align:center;
      color:rgba(255,255,255,.72);
      text-shadow:0 0 12px rgba(0,0,0,.38);
    }

    .sourceReceipt{
      position:absolute;
      width:1px;
      height:1px;
      overflow:hidden;
      clip:rect(0 0 0 0);
      clip-path:inset(50%);
      white-space:nowrap;
    }

    @keyframes stagePulse{
      0%,100%{opacity:.68;filter:blur(52px)}
      50%{opacity:.80;filter:blur(58px)}
    }

    @keyframes starTwinkle{
      0%,100%{opacity:.24}
      50%{opacity:.92}
    }

    @keyframes coreGlowPulse{
      0%,100%{opacity:.86;transform:translate(-50%,-50%) scale(1)}
      50%{opacity:1;transform:translate(-50%,-50%) scale(1.04)}
    }

    @keyframes faceSweep{
      0%{left:-34%;opacity:.10}
      18%{opacity:.18}
      52%{opacity:.34}
      80%{opacity:.12}
      100%{left:88%;opacity:.06}
    }

    @keyframes innerGlow{
      0%,100%{opacity:.10}
      50%{opacity:.18}
    }

    @keyframes controlAmbient{
      0%,100%{filter:saturate(1) brightness(1)}
      50%{filter:saturate(1.04) brightness(1.02)}
    }

    @media (prefers-reduced-motion: reduce){
      .stage::before,
      .star,
      .face::after,
      .planetLabel::after,
      .control,
      .coreGlow{
        animation:none !important;
      }
    }

    @media (max-width:640px){
      :root{
        --D0:146px;
        --D1:108px;
        --D2:88px;
        --D3:78px;
        --Z0:36px;
        --Z1:32px;
        --Z2:28px;
        --Z3:26px;
        --padTop:226px;
      }

      .horizonPanel{
        top:78px;
      }

      .planetWord{font-size:11.25px}
      .coreGlow{width:260px;height:260px}
    }

    @media (max-width:420px){
      :root{
        --D0:138px;
        --D1:104px;
        --D2:86px;
        --D3:76px;
        --Z0:34px;
        --Z1:30px;
        --Z2:26px;
        --Z3:24px;
      }

      .horizonReadout strong{font-size:15px}
      .horizonReadout p{font-size:12px}
      .planetWord{font-size:11px}
      .coreGlow{width:240px;height:240px}
    }
  </style>
</head>

<body>
  <header class="top" aria-label="Top controls">
    <div class="top__group" aria-label="Language">
      <div class="control is-on" id="langEN" role="button" tabindex="0" aria-label="English"><span class="control__label">EN</span></div>
      <div class="control" id="langZH" role="button" tabindex="0" aria-label="Chinese"><span class="control__label">中文</span></div>
      <div class="control" id="langES" role="button" tabindex="0" aria-label="Spanish"><span class="control__label">ES</span></div>
    </div>

    <div class="top__group" aria-label="Lane">
      <div class="control is-on" id="lanePlatform" role="button" tabindex="0" aria-label="Platform lane"><span class="control__label">P</span></div>
      <div class="control" id="laneEngineering" role="button" tabindex="0" aria-label="Engineering lane"><span class="control__label">E</span></div>
    </div>
  </header>

  <section class="horizonPanel" aria-label="Vision horizon controls">
    <p class="horizonPanel__title">Vision · Dual Horizon</p>
    <div class="horizonTabs" role="group" aria-label="Vision horizon selector">
      <button class="horizonBtn" id="horizonNear" type="button" aria-pressed="true">Not-So-Distant Future</button>
      <button class="horizonBtn" id="horizonFar" type="button" aria-pressed="false">Distant Future</button>
    </div>
    <div class="horizonReadout" aria-live="polite">
      <strong id="horizonTitle">Close enough to plan, build, test, and verify.</strong>
      <p id="horizonCopy">This horizon names the future that is near enough to act on now: visible next moves, current planning, practical inspection, and proof return.</p>
    </div>
  </section>

  <main class="stage" id="stage" aria-label="Vision">
    <div class="starfield" id="starfield" aria-hidden="true"></div>
    <div class="coreGlow" aria-hidden="true"></div>
  </main>

  <div class="corner corner--left" aria-label="Exit">
    <div class="control" id="btnExit" role="button" tabindex="0" aria-label="Exit to Door"><span class="control__label">⟲</span></div>
    <div class="corner__text" id="lblExit">EXIT</div>
  </div>

  <div class="corner corner--right" aria-label="Hub Jump">
    <div class="control" id="btnHub" role="button" tabindex="0" aria-label="Hub Jump to Compass"><span class="control__label">◆</span></div>
    <div class="corner__text" id="lblHub">HUB</div>
  </div>

  <section class="sourceReceipt" aria-label="Vision source receipt">
    VISION_G1_OPTIMAL_DUAL_HORIZON_HOST_TNT_v1
    STATUS=ACTIVE
    VISIBLE_TITLE=Vision · G1 Optimal
    PUBLIC_PROOF_MARKER=Dual Horizon Vision Host · G1 Optimal active
    PAGE=/explore/frontier/vision/index.html
    ROUTE=/explore/frontier/vision/
    PARENT=/explore/frontier/
    BASELINE=AUDRALIA_MANOR_CURRENT
    EXPRESSION=Dual_Horizon_Vision_Host_With_Russian_Doll_Underlay
    HORIZON_1=Not-So-Distant_Future
    HORIZON_1_ROLE=near_horizon,actionable_sightline,visible_planning,current_next_moves,plan_build_test_verify
    HORIZON_2=Distant_Future
    HORIZON_2_ROLE=remote_horizon,long_range_signal,inference_boundary,unknowns,confidence_labels,confirmation_steps
    HIERARCHY=Compass→Door→Home→Manor→Frontier→Vision→Laws→Gauges
    ROLE=frontier_sightline_lane
    OWNS=visual_systems,sightline_planning,future_facing_design,inspection_field,foreground_host_shell,dual_horizon_reading
    DOES_NOT_OWN=separate_remote_room_identity,law_authority,gauges_scoring,product_identity,route_mutation,generation_pass_claim
    RUNTIME_OWNER=/explore/frontier/vision/index.js
    SPLIT_ARCHITECTURE=host_shell_preserved,runtime_external
    CANONICAL_CARRY=gd_lang,gd_style,gd_time,gd_depth
    LANE=URL_ONLY
    PRIOR_LANGUAGE_HANDLING=prior_remote_route_framing_archival_only
    HEAVY_RUNTIME_LOADED=false
    RENDER_FILES_TOUCHED=false
    GAUGES_LOGIC_TOUCHED=false
    VISUAL_PASS_CLAIMED=false
  </section>

  <script>
    (() => {
      "use strict";

      const near = document.getElementById("horizonNear");
      const far = document.getElementById("horizonFar");
      const title = document.getElementById("horizonTitle");
      const copy = document.getElementById("horizonCopy");

      const states = {
        near: {
          title: "Close enough to plan, build, test, and verify.",
          copy: "This horizon names the future that is near enough to act on now: visible next moves, current planning, practical inspection, and proof return."
        },
        far: {
          title: "Far enough to require confidence labels.",
          copy: "This horizon names the distant future: long-range signal, inference boundary, unknowns, confidence labels, confirmation steps, and repeat checks."
        }
      };

      function setHorizon(mode) {
        const isFar = mode === "far";
        near.setAttribute("aria-pressed", isFar ? "false" : "true");
        far.setAttribute("aria-pressed", isFar ? "true" : "false");
        title.textContent = isFar ? states.far.title : states.near.title;
        copy.textContent = isFar ? states.far.copy : states.near.copy;
      }

      near.addEventListener("click", () => setHorizon("near"));
      far.addEventListener("click", () => setHorizon("far"));

      if (window.location.hash === "#distant-future") {
        setHorizon("far");
      } else {
        setHorizon("near");
      }
    })();
  </script>

  <script src="/explore/frontier/vision/index.js"></script>
</body>
</html>
