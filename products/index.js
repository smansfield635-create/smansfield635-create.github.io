<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Products | Diamond Gate Bridge</title>
  <meta
    name="description"
    content="Cinematic G1 orbital gateway for Diamond Gate Bridge products. Structured motion, coherent navigation, and direct access to live product lanes."
  />
  <meta name="theme-color" content="#050816" />
  <style>
    :root {
      --bg-0: #050816;
      --bg-1: #0a1026;
      --bg-2: #101935;
      --surface: rgba(255, 255, 255, 0.06);
      --surface-strong: rgba(255, 255, 255, 0.1);
      --line: rgba(255, 255, 255, 0.12);
      --text: #f5f7ff;
      --muted: rgba(245, 247, 255, 0.7);
      --soft: rgba(245, 247, 255, 0.5);
      --glow: rgba(124, 166, 255, 0.38);
      --glow-2: rgba(117, 255, 221, 0.22);
      --card-shadow: 0 20px 60px rgba(0, 0, 0, 0.38);
      --max: 1280px;
      --radius-xl: 28px;
      --radius-lg: 22px;
      --radius-md: 16px;
      --nav-h: 74px;
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 20% 15%, rgba(124, 166, 255, 0.16), transparent 22%),
        radial-gradient(circle at 80% 20%, rgba(117, 255, 221, 0.12), transparent 20%),
        radial-gradient(circle at 50% 80%, rgba(85, 111, 255, 0.16), transparent 28%),
        linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 45%, #060913 100%);
      overflow-x: hidden;
    }

    body::before,
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    body::before {
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
      opacity: 0.35;
    }

    body::after {
      background:
        radial-gradient(circle at center, rgba(124,166,255,0.1), transparent 35%);
      filter: blur(40px);
      opacity: 0.7;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .page {
      position: relative;
      z-index: 1;
    }

    .shell {
      width: min(calc(100% - 32px), var(--max));
      margin: 0 auto;
    }

    .topbar-wrap {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(18px);
      background: linear-gradient(180deg, rgba(5, 8, 22, 0.86), rgba(5, 8, 22, 0.58));
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .topbar {
      min-height: var(--nav-h);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 14px 0;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .brand-mark {
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      border-radius: 2px;
      background: linear-gradient(135deg, #d8e5ff, #78a7ff 55%, #67ffd9);
      box-shadow: 0 0 22px rgba(120, 167, 255, 0.7);
      flex: 0 0 auto;
    }

    .brand-copy {
      min-width: 0;
    }

    .eyebrow {
      font-size: 0.72rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--soft);
      margin: 0 0 4px;
    }

    .brand-title {
      font-size: 0.98rem;
      line-height: 1.15;
      font-weight: 700;
      margin: 0;
      white-space: nowrap;
    }

    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-end;
    }

    .nav a {
      padding: 10px 14px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 999px;
      color: var(--muted);
      background: rgba(255,255,255,0.03);
      transition: 160ms ease;
      font-size: 0.92rem;
    }

    .nav a:hover,
    .nav a:focus-visible {
      color: var(--text);
      border-color: rgba(255,255,255,0.22);
      background: rgba(255,255,255,0.08);
      transform: translateY(-1px);
      outline: none;
    }

    .nav a[aria-current="page"] {
      color: var(--text);
      background: linear-gradient(180deg, rgba(124,166,255,0.18), rgba(255,255,255,0.08));
      border-color: rgba(124,166,255,0.42);
      box-shadow: 0 0 0 1px rgba(124,166,255,0.18) inset;
    }

    .hero {
      padding: 52px 0 28px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
      gap: 26px;
      align-items: stretch;
    }

    .hero-copy,
    .hero-stage {
      position: relative;
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)),
        rgba(255,255,255,0.02);
      box-shadow: var(--card-shadow);
      overflow: hidden;
    }

    .hero-copy {
      padding: 34px;
    }

    .hero-copy::before,
    .hero-stage::before {
      content: "";
      position: absolute;
      inset: auto auto 0 0;
      width: 45%;
      height: 45%;
      background: radial-gradient(circle, rgba(124,166,255,0.2), transparent 70%);
      pointer-events: none;
    }

    .hero h1 {
      margin: 0 0 14px;
      font-size: clamp(2.2rem, 4vw, 4.5rem);
      line-height: 0.94;
      letter-spacing: -0.04em;
      max-width: 12ch;
    }

    .hero-lead {
      margin: 0;
      color: var(--muted);
      font-size: 1.06rem;
      line-height: 1.68;
      max-width: 62ch;
    }

    .hero-points {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 24px 0 0;
      padding: 0;
      list-style: none;
    }

    .hero-points li {
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.04);
      border-radius: 999px;
      padding: 10px 14px;
      color: var(--text);
      font-size: 0.92rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 48px;
      padding: 0 18px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.05);
      color: var(--text);
      font-weight: 600;
      transition: 160ms ease;
      cursor: pointer;
    }

    .button:hover,
    .button:focus-visible {
      transform: translateY(-1px);
      border-color: rgba(255,255,255,0.24);
      background: rgba(255,255,255,0.09);
      outline: none;
    }

    .button-primary {
      background: linear-gradient(135deg, rgba(124,166,255,0.22), rgba(103,255,217,0.16));
      border-color: rgba(124,166,255,0.42);
      box-shadow: 0 12px 36px rgba(38, 68, 145, 0.28);
    }

    .hero-stage {
      min-height: 520px;
      padding: 14px;
      display: grid;
      place-items: center;
    }

    .stage-frame {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 490px;
      border-radius: calc(var(--radius-xl) - 8px);
      overflow: hidden;
      background:
        radial-gradient(circle at center, rgba(124,166,255,0.1), transparent 35%),
        radial-gradient(circle at center, rgba(117,255,221,0.08), transparent 55%),
        linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
      border: 1px solid rgba(255,255,255,0.08);
    }

    .stage-center {
      position: absolute;
      inset: 50% auto auto 50%;
      width: 180px;
      height: 180px;
      transform: translate(-50%, -50%);
      display: grid;
      place-items: center;
      border-radius: 50%;
      background:
        radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22), rgba(124,166,255,0.12) 45%, rgba(5,8,22,0.9) 74%);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow:
        0 0 0 18px rgba(255,255,255,0.02),
        0 0 48px rgba(124,166,255,0.26);
      text-align: center;
      padding: 20px;
    }

    .stage-center strong {
      display: block;
      font-size: 1.05rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .stage-center span {
      color: var(--muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .orbit {
      --duration: 24s;
      --size: 410px;
      position: absolute;
      top: 50%;
      left: 50%;
      width: var(--size);
      height: var(--size);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 1px dashed rgba(255,255,255,0.08);
      animation: spin var(--duration) linear infinite;
      will-change: transform;
    }

    .orbit.orbit-b {
      --size: 560px;
      --duration: 34s;
      border-color: rgba(124,166,255,0.12);
      transform: translate(-50%, -50%) rotate(26deg);
    }

    .orbit.orbit-c {
      --size: 700px;
      --duration: 42s;
      border-color: rgba(117,255,221,0.09);
      transform: translate(-50%, -50%) rotate(-16deg);
    }

    .lane-token {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 170px;
      padding: 14px 14px 13px;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.12);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04)),
        rgba(8, 13, 32, 0.78);
      transform-origin: 0 0;
      box-shadow: 0 16px 40px rgba(0,0,0,0.28);
      backdrop-filter: blur(16px);
    }

    .lane-token strong {
      display: block;
      font-size: 0.95rem;
      margin-bottom: 5px;
    }

    .lane-token span {
      display: block;
      font-size: 0.8rem;
      line-height: 1.45;
      color: var(--muted);
    }

    .lane-token small {
      display: block;
      margin-top: 8px;
      color: var(--soft);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 0.65rem;
    }

    .stage-read {
      position: absolute;
      right: 16px;
      bottom: 16px;
      display: grid;
      gap: 8px;
      width: min(320px, calc(100% - 32px));
    }

    .read-chip {
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      background: rgba(5,8,22,0.68);
      backdrop-filter: blur(14px);
      padding: 12px 14px;
      color: var(--muted);
      font-size: 0.82rem;
    }

    .section {
      padding: 26px 0;
    }

    .section-card {
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
      box-shadow: var(--card-shadow);
      overflow: hidden;
    }

    .section-head {
      padding: 28px 28px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .section-head h2 {
      margin: 0 0 10px;
      font-size: clamp(1.45rem, 2vw, 2rem);
      letter-spacing: -0.03em;
    }

    .section-head p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
      max-width: 70ch;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      padding: 22px 28px 28px;
    }

    .stat {
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      border-radius: var(--radius-md);
      padding: 18px;
    }

    .stat .label {
      display: block;
      color: var(--soft);
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      margin-bottom: 10px;
    }

    .stat strong {
      display: block;
      font-size: 1.04rem;
      margin-bottom: 6px;
    }

    .stat span {
      display: block;
      color: var(--muted);
      line-height: 1.55;
      font-size: 0.92rem;
    }

    .catalog {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      padding: 0 0 8px;
    }

    .lane-card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 240px;
      margin: 0 0 0;
      padding: 22px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 22px;
      background:
        radial-gradient(circle at top right, rgba(124,166,255,0.15), transparent 35%),
        linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.03));
      overflow: hidden;
      transition: 180ms ease;
    }

    .lane-card:hover,
    .lane-card:focus-within {
      transform: translateY(-3px);
      border-color: rgba(255,255,255,0.18);
      background:
        radial-gradient(circle at top right, rgba(124,166,255,0.2), transparent 38%),
        linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.04));
    }

    .lane-card::after {
      content: "";
      position: absolute;
      inset: auto -20% -35% auto;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(117,255,221,0.12), transparent 70%);
      pointer-events: none;
    }

    .lane-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 18px;
    }

    .lane-kicker {
      font-size: 0.74rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--soft);
      margin: 0 0 8px;
    }

    .lane-card h3 {
      margin: 0;
      font-size: 1.2rem;
      letter-spacing: -0.02em;
    }

    .lane-badge {
      flex: 0 0 auto;
      padding: 8px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      font-size: 0.74rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .lane-card p {
      margin: 0;
      color: var(--muted);
      line-height: 1.68;
      flex: 1 1 auto;
    }

    .lane-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    .lane-path {
      color: var(--soft);
      font-size: 0.84rem;
      overflow-wrap: anywhere;
    }

    .lane-open {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text);
      font-weight: 600;
    }

    .lane-open::after {
      content: "→";
      transition: transform 160ms ease;
    }

    .lane-card:hover .lane-open::after,
    .lane-card:focus-within .lane-open::after {
      transform: translateX(2px);
    }

    .catalog-wrap {
      padding: 24px 28px 28px;
    }

    .contract {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 16px;
      padding: 0 28px 28px;
    }

    .contract-panel {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 22px;
      background: rgba(255,255,255,0.03);
      padding: 22px;
    }

    .contract-panel h3 {
      margin: 0 0 12px;
      font-size: 1.08rem;
    }

    .contract-panel p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }

    .contract-list {
      margin: 14px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 10px;
    }

    .contract-list li {
      color: var(--muted);
      line-height: 1.55;
      padding-left: 18px;
      position: relative;
    }

    .contract-list li::before {
      content: "";
      position: absolute;
      top: 0.7em;
      left: 0;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: linear-gradient(135deg, #78a7ff, #67ffd9);
      box-shadow: 0 0 12px rgba(120,167,255,0.5);
    }

    .receipt {
      margin: 26px 0 60px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-xl);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)),
        rgba(255,255,255,0.02);
      box-shadow: var(--card-shadow);
      overflow: hidden;
    }

    .receipt-head {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      flex-wrap: wrap;
      gap: 10px 14px;
      align-items: center;
      justify-content: space-between;
    }

    .receipt-head strong {
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-size: 0.82rem;
    }

    .receipt-body {
      padding: 20px 24px 24px;
      color: var(--muted);
      line-height: 1.75;
      overflow-wrap: anywhere;
      font-size: 0.95rem;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes spin {
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    @media (max-width: 1120px) {
      .hero-grid,
      .contract {
        grid-template-columns: 1fr;
      }

      .catalog {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .hero-stage {
        min-height: 620px;
      }
    }

    @media (max-width: 760px) {
      .shell {
        width: min(calc(100% - 22px), var(--max));
      }

      .topbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .nav {
        justify-content: flex-start;
      }

      .hero {
        padding-top: 28px;
      }

      .hero-copy,
      .section-head,
      .catalog-wrap,
      .contract,
      .stats,
      .receipt-head,
      .receipt-body {
        padding-left: 18px;
        padding-right: 18px;
      }

      .hero-copy {
        padding-top: 24px;
        padding-bottom: 24px;
      }

      .catalog,
      .stats {
        grid-template-columns: 1fr;
      }

      .hero-stage {
        min-height: 560px;
        padding: 10px;
      }

      .stage-frame {
        min-height: 540px;
      }

      .stage-center {
        width: 144px;
        height: 144px;
      }

      .orbit {
        --size: 320px;
      }

      .orbit.orbit-b {
        --size: 438px;
      }

      .orbit.orbit-c {
        --size: 520px;
      }

      .lane-token {
        width: 146px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }

      .orbit {
        animation: none !important;
      }

      .lane-card:hover,
      .lane-card:focus-within,
      .button:hover,
      .button:focus-visible,
      .nav a:hover,
      .nav a:focus-visible {
        transform: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="topbar-wrap">
      <div class="shell topbar">
        <a class="brand" href="/" aria-label="Diamond Gate Bridge home">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-copy">
            <p class="eyebrow">Cinematic G1 · Orbital Gateway</p>
            <p class="brand-title">Diamond Gate Bridge — Products</p>
          </span>
        </a>

        <nav class="nav" aria-label="Primary">
          <a href="/home/">Home</a>
          <a href="/explore/">Explore</a>
          <a href="/gauges/">Gauges</a>
          <a href="/platform/">Platform</a>
          <a href="/products/" aria-current="page">Products</a>
        </nav>
      </div>
    </div>

    <header class="hero">
      <div class="shell hero-grid">
        <section class="hero-copy" aria-labelledby="products-title">
          <p class="eyebrow">Extravagant motion, coherent structure</p>
          <h1 id="products-title">The animated products gateway.</h1>
          <p class="hero-lead">
            The products root is the cinematic surface on the site: a living field with orbital
            product lanes, depth motion, and direct access to real product routes. The spectacle
            stays subordinate to navigation, so the page remains a coherent gateway instead of a
            visual dead end.
          </p>

          <ul class="hero-points" aria-label="Page qualities">
            <li>3D Motion Field</li>
            <li>Orbital Routing</li>
            <li>Real Product Links</li>
            <li>Reduced-Motion Safe</li>
          </ul>

          <div class="hero-actions">
            <a class="button button-primary" href="#catalog">Open product lanes</a>
            <a class="button" href="/explore/">Return to Explore</a>
          </div>
        </section>

        <section class="hero-stage" aria-labelledby="motion-stage-title">
          <div class="stage-frame" id="motion-stage
