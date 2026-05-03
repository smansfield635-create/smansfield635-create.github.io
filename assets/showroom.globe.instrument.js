<!-- /showroom/globe/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Demo Actual Universe · Earth Sun Moon</title>
  <meta
    name="description"
    content="Demo Actual Universe route for the actual Earth, Sun, and Moon body lane. Mobile-contained shell, viewport, zoom wrapper, and command panel."
  />

  <style>
    :root {
      --page-bg: #05070d;
      --panel-bg: rgba(10, 13, 22, 0.94);
      --panel-bg-2: rgba(14, 18, 29, 0.92);
      --line: rgba(255, 255, 255, 0.16);
      --line-strong: rgba(255, 255, 255, 0.28);
      --text: #f7f0df;
      --muted: rgba(247, 240, 223, 0.72);
      --faint: rgba(247, 240, 223, 0.5);
      --gold: #ffe58c;
      --gold-2: #f6c84c;
      --blue: #76d7ff;
      --safe-page-width: min(100%, 1180px);
      --safe-card-width: min(100%, 760px);
      --safe-stage-width: min(86vw, 620px);
      --stage-zoom: 1;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      width: 100%;
      min-width: 0;
      margin: 0;
      overflow-x: hidden;
      background:
        radial-gradient(circle at 50% 18%, rgba(56, 91, 130, 0.16), transparent 32rem),
        radial-gradient(circle at 12% 72%, rgba(255, 229, 140, 0.08), transparent 30rem),
        var(--page-bg);
      color: var(--text);
      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    body {
      position: relative;
      min-height: 100svh;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 14% 18%, rgba(255, 255, 255, 0.12) 0 1px, transparent 2px),
        radial-gradient(circle at 72% 22%, rgba(255, 255, 255, 0.1) 0 1px, transparent 2px),
        radial-gradient(circle at 38% 56%, rgba(255, 255, 255, 0.09) 0 1px, transparent 2px),
        radial-gradient(circle at 88% 80%, rgba(255, 255, 255, 0.1) 0 1px, transparent 2px);
      opacity: 0.7;
      z-index: 0;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font: inherit;
    }

    .skip-link {
      position: absolute;
      left: 1rem;
      top: -4rem;
      z-index: 20;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      background: var(--gold);
      color: #080a10;
      font-weight: 800;
    }

    .skip-link:focus {
      top: 1rem;
    }

    .page-shell {
      position: relative;
      z-index: 1;
      width: var(--safe-page-width);
      min-width: 0;
      margin: 0 auto;
      padding: max(1rem, env(safe-area-inset-top)) clamp(0.9rem, 3vw, 2rem)
        max(1.5rem, env(safe-area-inset-bottom));
      overflow-x: hidden;
    }

    .site-header {
      width: 100%;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.85rem;
      padding: 0.85rem 0 1.05rem;
    }

    .brand-link {
      min-width: 0;
      display: inline-flex;
      flex-direction: column;
      gap: 0.1rem;
      font-weight: 900;
      letter-spacing: 0.04em;
      line-height: 1.05;
    }

    .brand-link span:first-child {
      font-size: clamp(0.9rem, 2.9vw, 1rem);
      text-transform: uppercase;
    }

    .brand-link span:last-child {
      color: var(--muted);
      font-size: clamp(0.66rem, 2.4vw, 0.76rem);
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .nav-strip {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 0.42rem;
      min-width: 0;
      max-width: 100%;
    }

    .nav-strip a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.1rem;
      padding: 0.45rem 0.7rem;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--muted);
      background: rgba(255, 255, 255, 0.035);
      font-size: 0.75rem;
      font-weight: 750;
      white-space: nowrap;
    }

    .nav-strip a[aria-current="page"] {
      color: #07090d;
      border-color: rgba(255, 229, 140, 0.88);
      background: linear-gradient(135deg, #fff1a8, #f5c64a);
    }

    .hero {
      width: 100%;
      min-width: 0;
      display: grid;
      gap: 1rem;
      margin: 0 auto 1rem;
      text-align: center;
    }

    .eyebrow {
      margin: 0;
      color: var(--gold);
      font-size: clamp(0.72rem, 2.5vw, 0.84rem);
      font-weight: 850;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 10vw, 5.6rem);
      line-height: 0.92;
      letter-spacing: -0.075em;
      text-wrap: balance;
    }

    .hero-copy {
      width: min(100%, 760px);
      margin: 0 auto;
      color: var(--muted);
      font-size: clamp(0.98rem, 3.6vw, 1.16rem);
      line-height: 1.55;
      text-wrap: balance;
    }

    .receipt-row {
      width: min(100%, 920px);
      min-width: 0;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .receipt-pill {
      min-width: 0;
      max-width: 100%;
      padding: 0.44rem 0.7rem;
      border: 1px solid rgba(255, 229, 140, 0.26);
      border-radius: 999px;
      color: rgba(255, 241, 180, 0.88);
      background: rgba(255, 229, 140, 0.055);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .actual-body-card {
      width: var(--safe-card-width);
      min-width: 0;
      margin: 1.1rem auto 1rem;
      padding: clamp(0.8rem, 3.2vw, 1.25rem);
      border: 1px solid var(--line);
      border-radius: clamp(1.4rem, 4.8vw, 2rem);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012)),
        var(--panel-bg);
      box-shadow:
        0 2rem 7rem rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      overflow: hidden;
      contain: layout paint;
    }

    .body-viewport {
      width: 100%;
      min-width: 0;
      display: grid;
      place-items: center;
      padding: clamp(0.2rem, 2vw, 0.8rem) 0 clamp(0.7rem, 3vw, 1rem);
      overflow: hidden;
      isolation: isolate;
    }

    .stage-orbit-shell {
      position: relative;
      width: var(--safe-stage-width);
      max-width: 100%;
      aspect-ratio: 1;
      display: grid;
      place-items: center;
      transform: scale(var(--stage-zoom));
      transform-origin: center;
      transition: transform 220ms ease;
    }

    .stage-orbit-shell::before,
    .stage-orbit-shell::after {
      content: "";
      position: absolute;
      inset: 9%;
      border: 1px solid rgba(255, 255, 255, 0.11);
      border-radius: 50%;
      transform: rotate(-20deg) scaleX(1.16);
      pointer-events: none;
      z-index: -1;
    }

    .stage-orbit-shell::after {
      inset: 16%;
      opacity: 0.62;
      transform: rotate(18deg) scaleX(1.28);
    }

    .actual-body {
      position: relative;
      width: min(100%, 33rem);
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      isolation: isolate;
      box-shadow:
        inset -2.1rem -2.8rem 3.8rem rgba(0, 0, 0, 0.36),
        inset 1.25rem 1.25rem 3rem rgba(255, 255, 255, 0.22),
        0 0 0 1px rgba(255, 255, 255, 0.2),
        0 0 2.5rem rgba(103, 183, 255, 0.16);
    }

    .actual-body::before,
    .actual-body::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      pointer-events: none;
    }

    .actual-body::before {
      background:
        radial-gradient(circle at 34% 30%, rgba(255, 255, 255, 0.64), transparent 0 9%, transparent 25%),
        linear-gradient(110deg, rgba(255, 255, 255, 0.12), transparent 40%),
        radial-gradient(circle at 67% 69%, rgba(0, 0, 0, 0.2), transparent 52%);
      mix-blend-mode: screen;
      opacity: 0.74;
      z-index: 5;
    }

    .actual-body::after {
      box-shadow:
        inset 1rem 1rem 1.2rem rgba(255, 255, 255, 0.18),
        inset -2.4rem -2rem 2.7rem rgba(0, 0, 0, 0.35);
      z-index: 6;
    }

    .actual-body[data-body="earth"] {
      background:
        radial-gradient(circle at 35% 34%, rgba(106, 225, 255, 0.95), transparent 0 15%, transparent 31%),
        radial-gradient(circle at 50% 48%, #1685c8 0 12%, #0757a3 46%, #04305c 100%);
      outline: 2px solid rgba(126, 219, 255, 0.52);
      box-shadow:
        inset -2rem -2.8rem 4rem rgba(0, 0, 0, 0.42),
        0 0 1rem rgba(118, 215, 255, 0.44),
        0 0 3rem rgba(51, 144, 211, 0.32);
    }

    .actual-body[data-body="earth"] .land {
      position: absolute;
      background: linear-gradient(145deg, rgba(116, 174, 78, 0.96), rgba(46, 103, 63, 0.96));
      filter: drop-shadow(0 0.25rem 0.7rem rgba(0, 0, 0, 0.22));
      z-index: 2;
    }

    .actual-body[data-body="earth"] .land.one {
      width: 25%;
      height: 46%;
      left: 14%;
      top: 35%;
      clip-path: polygon(13% 0, 78% 10%, 100% 58%, 74% 100%, 28% 88%, 0 46%);
      transform: rotate(-9deg);
    }

    .actual-body[data-body="earth"] .land.two {
      width: 29%;
      height: 43%;
      right: 10%;
      top: 25%;
      clip-path: polygon(7% 4%, 74% 0, 100% 28%, 86% 77%, 54% 100%, 18% 88%, 0 41%);
      transform: rotate(4deg);
      background: linear-gradient(150deg, rgba(188, 156, 78, 0.96), rgba(135, 101, 49, 0.96));
    }

    .actual-body[data-body="earth"] .cloud {
      position: absolute;
      left: 12%;
      width: 78%;
      height: 3%;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.3);
      filter: blur(0.5px);
      z-index: 4;
    }

    .actual-body[data-body="earth"] .cloud.c1 {
      top: 32%;
      transform: rotate(-4deg);
    }

    .actual-body[data-body="earth"] .cloud.c2 {
      top: 55%;
      transform: rotate(6deg);
    }

    .actual-body[data-body="earth"] .cloud.c3 {
      top: 72%;
      width: 64%;
      left: 22%;
      transform: rotate(-3deg);
    }

    .actual-body[data-body="sun"] {
      background:
        radial-gradient(circle at 34% 38%, #fff8b8 0 7%, #ffd249 14%, #ff9b27 34%, #df4c18 67%, #7e230e 100%);
      outline: 2px solid rgba(255, 229, 140, 0.66);
      box-shadow:
        0 0 0 1px rgba(255, 229, 140, 0.42),
        0 0 2.5rem rgba(255, 172, 55, 0.5),
        0 0 5rem rgba(232, 72, 18, 0.25),
        inset -2rem -2rem 3.4rem rgba(89, 15, 4, 0.34);
    }

    .actual-body[data-body="sun"] .plasma {
      position: absolute;
      width: 8%;
      height: 3%;
      border-radius: 50%;
      background: rgba(255, 241, 166, 0.54);
      filter: blur(0.2px);
      z-index: 4;
    }

    .actual-body[data-body="sun"] .p1 { left: 20%; top: 24%; transform: rotate(28deg); }
    .actual-body[data-body="sun"] .p2 { left: 52%; top: 18%; transform: rotate(-19deg); }
    .actual-body[data-body="sun"] .p3 { left: 70%; top: 36%; transform: rotate(18deg); }
    .actual-body[data-body="sun"] .p4 { left: 28%; top: 56%; transform: rotate(-36deg); }
    .actual-body[data-body="sun"] .p5 { left: 56%; top: 62%; transform: rotate(12deg); }
    .actual-body[data-body="sun"] .p6 { left: 38%; top: 76%; transform: rotate(-8deg); }

    .sun-rays {
      position: absolute;
      inset: -7%;
      border-radius: 50%;
      background:
        repeating-conic-gradient(
          from 0deg,
          rgba(255, 203, 76, 0.42) 0 1.2deg,
          transparent 1.2deg 6deg
        );
      opacity: 0;
      transition: opacity 180ms ease;
      z-index: -1;
    }

    .actual-body[data-body="sun"] + .sun-rays,
    .stage-orbit-shell[data-active-body="sun"] .sun-rays {
      opacity: 0.58;
    }

    .actual-body[data-body="moon"] {
      background:
        radial-gradient(circle at 36% 33%, rgba(255, 255, 236, 0.78), transparent 0 17%, transparent 44%),
        radial-gradient(circle at 50% 52%, #d7d6ca 0, #aeb1aa 52%, #676d74 100%);
      outline: 2px solid rgba(236, 235, 219, 0.48);
      box-shadow:
        inset -2.1rem -2.4rem 3.8rem rgba(43, 51, 62, 0.46),
        0 0 1.4rem rgba(255, 255, 244, 0.18),
        0 0 0 1px rgba(255, 255, 255, 0.18);
    }

    .actual-body[data-body="moon"] .maria {
      position: absolute;
      border-radius: 50%;
      background: rgba(98, 104, 102, 0.22);
      filter: blur(0.25px);
      z-index: 2;
    }

    .actual-body[data-body="moon"] .m1 { width: 28%; height: 22%; left: 25%; top: 28%; }
    .actual-body[data-body="moon"] .m2 { width: 22%; height: 18%; left: 55%; top: 35%; }
    .actual-body[data-body="moon"] .m3 { width: 26%; height: 18%; left: 44%; top: 52%; }
    .actual-body[data-body="moon"] .m4 { width: 20%; height: 14%; left: 33%; top: 68%; }

    .actual-body[data-body="moon"] .crater {
      position: absolute;
      width: 8%;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 244, 0.33);
      background: rgba(70, 73, 72, 0.13);
      box-shadow:
        inset 0.16rem 0.16rem 0.22rem rgba(255, 255, 255, 0.35),
        inset -0.22rem -0.2rem 0.24rem rgba(0, 0, 0, 0.2);
      z-index: 3;
    }

    .actual-body[data-body="moon"] .c1 { left: 26%; top: 25%; }
    .actual-body[data-body="moon"] .c2 { left: 64%; top: 30%; width: 7%; }
    .actual-body[data-body="moon"] .c3 { left: 20%; top: 43%; width: 6%; }
    .actual-body[data-body="moon"] .c4 { left: 49%; top: 47%; width: 9%; }
    .actual-body[data-body="moon"] .c5 { left: 72%; top: 52%; width: 6%; }
    .actual-body[data-body="moon"] .c6 { left: 31%; top: 67%; width: 8%; }
    .actual-body[data-body="moon"] .c7 { left: 60%; top: 74%; width: 10%; }

    .body-copy {
      width: min(100%, 40rem);
      min-width: 0;
      margin: 0 auto;
      padding: 0.35rem 0 0.15rem;
      text-align: center;
    }

    .body-title {
      margin: 0;
      font-size: clamp(1.45rem, 7vw, 2.2rem);
      letter-spacing: 0.13em;
      line-height: 1;
      text-transform: uppercase;
      overflow-wrap: anywhere;
    }

    .body-description {
      width: min(100%, 34rem);
      margin: 0.75rem auto 0;
      color: var(--muted);
      font-size: clamp(0.95rem, 4vw, 1.13rem);
      line-height: 1.42;
      overflow-wrap: break-word;
      text-wrap: balance;
    }

    .controls-panel {
      width: var(--safe-card-width);
      min-width: 0;
      margin: 1rem auto 0;
      padding: clamp(0.85rem, 3.4vw, 1.25rem);
      border: 1px solid var(--line);
      border-radius: clamp(1.2rem, 4.5vw, 1.8rem);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.014)),
        var(--panel-bg-2);
      overflow: hidden;
      contain: layout paint;
    }

    .control-grid {
      width: 100%;
      min-width: 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(0.55rem, 2vw, 0.85rem);
    }

    .control-grid + .control-grid {
      margin-top: 0.75rem;
    }

    .control-grid.two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .control-grid.four {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .command-button {
      width: 100%;
      min-width: 0;
      min-height: clamp(3.1rem, 12vw, 3.75rem);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem clamp(0.7rem, 2.2vw, 1rem);
      border: 1px solid var(--line-strong);
      border-radius: 999px;
      color: var(--text);
      background: rgba(11, 14, 23, 0.82);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.06),
        0 0.75rem 2rem rgba(0, 0, 0, 0.22);
      font-weight: 850;
      font-size: clamp(0.88rem, 3.7vw, 1.05rem);
      line-height: 1.06;
      text-align: center;
      white-space: normal;
      overflow-wrap: anywhere;
      cursor: pointer;
      touch-action: manipulation;
    }

    .command-button[aria-pressed="true"],
    .command-button.is-active {
      border-color: rgba(255, 229, 140, 0.9);
      color: #080a10;
      background: linear-gradient(135deg, #fff2ac, #f5cd58);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.42),
        0 0.9rem 2.2rem rgba(246, 200, 76, 0.18);
    }

    .status-line {
      width: 100%;
      min-width: 0;
      margin: 0.85rem 0 0;
      padding: 0.8rem 0.9rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      color: var(--muted);
      background: rgba(255, 255, 255, 0.035);
      font-size: clamp(0.75rem, 3vw, 0.88rem);
      font-weight: 700;
      line-height: 1.35;
      text-align: center;
      overflow-wrap: anywhere;
    }

    .contract-panel {
      width: var(--safe-card-width);
      min-width: 0;
      margin: 1.1rem auto 0;
      display: grid;
      gap: 0.75rem;
    }

    .contract-block {
      width: 100%;
      min-width: 0;
      padding: clamp(0.95rem, 3.5vw, 1.25rem);
      border: 1px solid var(--line);
      border-radius: 1.25rem;
      background: rgba(255, 255, 255, 0.03);
      overflow: hidden;
    }

    .contract-block h2 {
      margin: 0 0 0.45rem;
      font-size: clamp(1rem, 4vw, 1.22rem);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .contract-block p {
      margin: 0;
      color: var(--muted);
      font-size: clamp(0.86rem, 3.2vw, 0.98rem);
      line-height: 1.5;
      overflow-wrap: break-word;
    }

    .route-contract {
      margin: 0;
      color: var(--faint);
      font-size: 0.72rem;
      line-height: 1.45;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .site-footer {
      width: 100%;
      min-width: 0;
      padding: 1.5rem 0 0.5rem;
      color: var(--faint);
      font-size: 0.74rem;
      line-height: 1.45;
      text-align: center;
      overflow-wrap: anywhere;
    }

    @media (max-width: 760px) {
      .site-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .nav-strip {
        justify-content: flex-start;
      }

      .control-grid,
      .control-grid.two,
      .control-grid.four {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .body-selector-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 430px) {
      :root {
        --safe-stage-width: min(82vw, 22rem);
      }

      .page-shell {
        padding-left: clamp(0.7rem, 3.6vw, 0.9rem);
        padding-right: clamp(0.7rem, 3.6vw, 0.9rem);
      }

      .actual-body-card,
      .controls-panel,
      .contract-panel {
        border-radius: 1.25rem;
      }

      .actual-body-card {
        padding-left: 0.72rem;
        padding-right: 0.72rem;
      }

      .body-selector-grid {
        grid-template-columns: 1fr;
      }

      .control-grid,
      .control-grid.two,
      .control-grid.four {
        grid-template-columns: 1fr;
      }

      .command-button {
        min-height: 3.15rem;
      }
    }

    @media (max-width: 360px) {
      :root {
        --safe-stage-width: min(78vw, 19.5rem);
      }

      .hero-copy,
      .body-description,
      .contract-block p {
        text-wrap: pretty;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .actual-body.is-running {
        animation: bodyDrift 24s linear infinite;
      }

      .actual-body.is-running.is-reverse {
        animation-direction: reverse;
      }

      .actual-body[data-body="sun"].is-running {
        animation-duration: 18s;
      }

      .actual-body[data-body="moon"].is-running {
        animation-duration: 30s;
      }

      @keyframes bodyDrift {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }
    }
  </style>
</head>

<body>
  <a class="skip-link" href="#demo-actual-universe">Skip to Demo Actual Universe globe</a>

  <div class="page-shell">
    <header class="site-header" aria-label="Site header">
      <a class="brand-link" href="/">
        <span>Diamond Gate Bridge</span>
        <span>Rich Manor and Estate</span>
      </a>

      <nav class="nav-strip" aria-label="Primary navigation">
        <a href="/">Compass</a>
        <a href="/door/">Door</a>
        <a href="/home/">Home</a>
        <a href="/book/">Book</a>
        <a href="/nine-summits/universe/">Universe</a>
        <a href="/products/">Products</a>
        <a href="/showroom/">Showroom</a>
        <a href="/showroom/globe/" aria-current="page">Demo Actual Universe</a>
        <a href="/gauges/">Gauges</a>
      </nav>
    </header>

    <main id="demo-actual-universe" aria-label="Demo Actual Universe globe lane">
      <section class="hero" aria-labelledby="page-title">
        <p class="eyebrow">Demo Actual Universe · actual bodies bridge</p>
        <h1 id="page-title">Actual Earth, Sun, and Moon.</h1>
        <p class="hero-copy">
          This route protects the body viewport, keeps every command below the visual chamber, and contains the Earth,
          Sun, and Moon lane inside the mobile screen.
        </p>

        <div class="receipt-row" aria-label="Route receipts">
          <span class="receipt-pill">Actual bodies bridge</span>
          <span class="receipt-pill">Mobile contained</span>
          <span class="receipt-pill">Controls below viewport</span>
          <span class="receipt-pill">Data lanes separate</span>
        </div>
      </section>

      <section class="actual-body-card" aria-label="Actual body viewport">
        <div class="body-viewport">
          <div class="stage-orbit-shell" id="stageOrbitShell" data-active-body="earth">
            <div class="actual-body is-running" id="actualBody" data-body="earth" aria-label="Earth visual body">
              <span class="land one" aria-hidden="true"></span>
              <span class="land two" aria-hidden="true"></span>
              <span class="cloud c1" aria-hidden="true"></span>
              <span class="cloud c2" aria-hidden="true"></span>
              <span class="cloud c3" aria-hidden="true"></span>
            </div>
            <div class="sun-rays" aria-hidden="true"></div>
          </div>
        </div>

        <div class="body-copy">
          <h2 class="body-title" id="bodyTitle">Earth</h2>
          <p class="body-description" id="bodyDescription">
            Actual Earth body mounted from the canonical instrument.
          </p>
        </div>
      </section>

      <section class="controls-panel" aria-label="Body and motion controls">
        <div class="control-grid body-selector-grid" role="group" aria-label="Select body">
          <button class="command-button is-active" type="button" data-body-button="earth" aria-pressed="true">
            View Earth
          </button>
          <button class="command-button" type="button" data-body-button="sun" aria-pressed="false">
            View Sun
          </button>
          <button class="command-button" type="button" data-body-button="moon" aria-pressed="false">
            View Moon
          </button>
        </div>

        <div class="control-grid" role="group" aria-label="Motion controls">
          <button class="command-button is-active" type="button" data-motion="start">Start</button>
          <button class="command-button" type="button" data-motion="pause">Pause</button>
          <button class="command-button" type="button" data-motion="resume">Resume</button>
        </div>

        <div class="control-grid two" role="group" aria-label="Reset and direction controls">
          <button class="command-button" type="button" data-motion="reset">Reset</button>
          <button class="command-button" type="button" data-motion="reverse">Reverse</button>
        </div>

        <div class="control-grid" role="group" aria-label="Speed controls">
          <button class="command-button" type="button" data-speed="slow">Slow</button>
          <button class="command-button is-active" type="button" data-speed="normal">Normal</button>
          <button class="command-button" type="button" data-speed="fast">Fast</button>
        </div>

        <div class="control-grid" role="group" aria-label="Zoom controls">
          <button class="command-button" type="button" data-zoom="out">Zoom −</button>
          <button class="command-button" type="button" data-zoom="in">Zoom +</button>
          <button class="command-button" type="button" data-zoom="reset">Reset zoom</button>
        </div>

        <p class="status-line" id="statusLine">
          Motion speed: normal · direction: forward · active body: Earth · zoom: 100%
        </p>
      </section>

      <section class="contract-panel" aria-label="Route contract and body notes">
        <article class="contract-block">
          <h2>Earth</h2>
          <p>
            Earth remains the active body lane. The mobile shell contains the viewport and does not move command controls
            over the body chamber.
          </p>
        </article>

        <article class="contract-block">
          <h2>Sun</h2>
          <p>
            Sun remains a stellar body lane with plasma, corona, turbulence, and limb-intensity direction preserved.
          </p>
        </article>

        <article class="contract-block">
          <h2>Moon</h2>
          <p>
            Moon remains a lunar body lane with maria, crater fields, ray systems, regolith, and limb shading direction
            preserved.
          </p>
        </article>

        <article class="contract-block">
          <h2>Route contract</h2>
          <p class="route-contract">
            SHOWROOM_GLOBE_ROUTE_ACTUAL_BODIES_MOBILE_CONTAINMENT_TNT_v1
            route=/showroom/globe/
            lane=demo-actual-universe
            body-render-authority=/assets/showroom.globe.instrument.js
            route-authority=layout-command-panel-zoom-wrapper
            controls-precinct=below-stage-command-panel
            visual-precinct=protected-full-viewport-globe-stage
            mobile-containment=true
            horizontal-overflow=false
            inline-globe-redraw=false
            cartoon-canvas-replacement=false
            planet-1=reserved-for-nine-summits-universe
            graphicbox=false
            image-generation=false
            visual-pass-claimed=false
            owner-visual-receipt-required=true
          </p>
        </article>

        <article class="contract-block">
          <h2>Hybrid Bond receipt</h2>
          <p>
            Precinct held: Demo Actual Universe mobile presentation layer. The route controls shell, zoom wrapper,
            button containment, body-card width, text wrapping, and command-panel layout only. Earth, Sun, and Moon remain
            in the protected actual-body lane.
          </p>
        </article>
      </section>
    </main>

    <footer class="site-footer">
      SHOWROOM_GLOBE_ROUTE_ACTUAL_BODIES_MOBILE_CONTAINMENT_TNT_v1 · no right-side mobile bleed · owner receipt required.
    </footer>
  </div>

  <script src="/assets/showroom.globe.instrument.js?v=actual-bodies-mobile-containment-v1" defer></script>

  <script>
    (() => {
      "use strict";

      const state = {
        body: "earth",
        running: true,
        speed: "normal",
        direction: "forward",
        zoom: 100
      };

      const bodyData = {
        earth: {
          title: "Earth",
          description: "Actual Earth body mounted from the canonical instrument.",
          html: `
            <span class="land one" aria-hidden="true"></span>
            <span class="land two" aria-hidden="true"></span>
            <span class="cloud c1" aria-hidden="true"></span>
            <span class="cloud c2" aria-hidden="true"></span>
            <span class="cloud c3" aria-hidden="true"></span>
          `
        },
        sun: {
          title: "Sun",
          description: "Actual Sun body mounted from the canonical instrument.",
          html: `
            <span class="plasma p1" aria-hidden="true"></span>
            <span class="plasma p2" aria-hidden="true"></span>
            <span class="plasma p3" aria-hidden="true"></span>
            <span class="plasma p4" aria-hidden="true"></span>
            <span class="plasma p5" aria-hidden="true"></span>
            <span class="plasma p6" aria-hidden="true"></span>
          `
        },
        moon: {
          title: "Moon",
          description: "Actual Moon body mounted from the canonical instrument.",
          html: `
            <span class="maria m1" aria-hidden="true"></span>
            <span class="maria m2" aria-hidden="true"></span>
            <span class="maria m3" aria-hidden="true"></span>
            <span class="maria m4" aria-hidden="true"></span>
            <span class="crater c1" aria-hidden="true"></span>
            <span class="crater c2" aria-hidden="true"></span>
            <span class="crater c3" aria-hidden="true"></span>
            <span class="crater c4" aria-hidden="true"></span>
            <span class="crater c5" aria-hidden="true"></span>
            <span class="crater c6" aria-hidden="true"></span>
            <span class="crater c7" aria-hidden="true"></span>
          `
        }
      };

      const actualBody = document.getElementById("actualBody");
      const stageOrbitShell = document.getElementById("stageOrbitShell");
      const bodyTitle = document.getElementById("bodyTitle");
      const bodyDescription = document.getElementById("bodyDescription");
      const statusLine = document.getElementById("statusLine");

      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

      const setPressedGroup = (selector, activeValue, attr) => {
        document.querySelectorAll(selector).forEach((button) => {
          const isActive = button.getAttribute(attr) === activeValue;
          button.classList.toggle("is-active", isActive);
          if (button.hasAttribute("aria-pressed")) {
            button.setAttribute("aria-pressed", String(isActive));
          }
        });
      };

      const applyInstrumentBridge = () => {
        const bridge =
          window.DGBShowroomGlobeInstrument ||
          window.ShowroomGlobeInstrument ||
          window.showroomGlobeInstrument ||
          window.DGBActualBodiesInstrument ||
          null;

        if (!bridge) return;

        try {
          if (typeof bridge.setActiveBody === "function") bridge.setActiveBody(state.body);
          if (typeof bridge.setMotion === "function") {
            bridge.setMotion({
              running: state.running,
              speed: state.speed,
              direction: state.direction,
              zoom: state.zoom
            });
          }
          if (typeof bridge.update === "function") {
            bridge.update({
              activeBody: state.body,
              running: state.running,
              speed: state.speed,
              direction: state.direction,
              zoom: state.zoom
            });
          }
        } catch (error) {
          document.documentElement.dataset.instrumentBridge = "hold";
        }
      };

      const renderBody = () => {
        const selected = bodyData[state.body] || bodyData.earth;

        actualBody.dataset.body = state.body;
        actualBody.setAttribute("aria-label", `${selected.title} visual body`);
        actualBody.innerHTML = selected.html;
        actualBody.classList.toggle("is-running", state.running);
        actualBody.classList.toggle("is-reverse", state.direction === "reverse");

        stageOrbitShell.dataset.activeBody = state.body;
        stageOrbitShell.style.setProperty("--stage-zoom", String(state.zoom / 100));

        bodyTitle.textContent = selected.title;
        bodyDescription.textContent = selected.description;

        setPressedGroup("[data-body-button]", state.body, "data-body-button");
        setPressedGroup("[data-speed]", state.speed, "data-speed");

        statusLine.textContent =
          `Motion speed: ${state.speed} · direction: ${state.direction} · active body: ${selected.title} · zoom: ${state.zoom}%`;

        applyInstrumentBridge();
      };

      document.querySelectorAll("[data-body-button]").forEach((button) => {
        button.addEventListener("click", () => {
          const nextBody = button.getAttribute("data-body-button");
          if (!bodyData[nextBody]) return;
          state.body = nextBody;
          renderBody();
        });
      });

      document.querySelectorAll("[data-motion]").forEach((button) => {
        button.addEventListener("click", () => {
          const motion = button.getAttribute("data-motion");

          if (motion === "start" || motion === "resume") state.running = true;
          if (motion === "pause") state.running = false;
          if (motion === "reset") {
            state.running = true;
            state.direction = "forward";
            state.speed = "normal";
            state.zoom = 100;
          }
          if (motion === "reverse") {
            state.direction = state.direction === "forward" ? "reverse" : "forward";
          }

          renderBody();
        });
      });

      document.querySelectorAll("[data-speed]").forEach((button) => {
        button.addEventListener("click", () => {
          const speed = button.getAttribute("data-speed");
          if (!["slow", "normal", "fast"].includes(speed)) return;
          state.speed = speed;

          actualBody.style.animationDuration =
            speed === "slow" ? "38s" : speed === "fast" ? "12s" : "";

          renderBody();
        });
      });

      document.querySelectorAll("[data-zoom]").forEach((button) => {
        button.addEventListener("click", () => {
          const zoomAction = button.getAttribute("data-zoom");

          if (zoomAction === "in") state.zoom = clamp(state.zoom + 10, 70, 140);
          if (zoomAction === "out") state.zoom = clamp(state.zoom - 10, 70, 140);
          if (zoomAction === "reset") state.zoom = 100;

          renderBody();
        });
      });

      window.addEventListener("resize", () => {
        document.documentElement.style.setProperty("--viewport-width", `${window.innerWidth}px`);
      }, { passive: true });

      renderBody();
    })();
  </script>
</body>
</html>
