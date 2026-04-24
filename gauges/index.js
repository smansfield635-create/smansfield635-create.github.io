<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Gauges · Second Generation Live Feed</title>
  <meta
    name="description"
    content="Diamond Gate Bridge second-generation diagnostic gauges: live route, source, runtime, and next-action feed."
  />

  <style>
    :root {
      --bg: #01040b;
      --panel: rgba(4, 10, 22, 0.94);
      --panel-2: rgba(8, 16, 32, 0.92);
      --line: rgba(147, 183, 255, 0.18);
      --line-strong: rgba(226, 238, 255, 0.42);
      --text: #eaf2ff;
      --muted: #8fa2c8;
      --gold: #f0d79c;
      --green: #82f0b2;
      --red: #ff6f89;
      --blue: #89c8ff;
      --violet: #c4b4ff;
      --shadow: 0 24px 90px rgba(0, 0, 0, 0.58);
      --max: 1220px;
    }

    * {
      box-sizing: border-box;
    }

    html {
      min-height: 100%;
      background: var(--bg);
      scroll-behavior: smooth;
    }

    body {
      min-height: 100%;
      margin: 0;
      color: var(--text);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      background:
        radial-gradient(circle at 50% 6%, rgba(137, 200, 255, 0.18), transparent 24%),
        radial-gradient(circle at 18% 30%, rgba(240, 215, 156, 0.09), transparent 28%),
        linear-gradient(180deg, #01040b 0%, #061022 58%, #01040b 100%);
      overflow-x: hidden;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.28;
      background:
        linear-gradient(90deg, rgba(137, 200, 255, 0.08) 1px, transparent 1px),
        linear-gradient(180deg, rgba(137, 200, 255, 0.045) 1px, transparent 1px);
      background-size: 31px 31px;
      mask-image: radial-gradient(circle at 50% 30%, black, transparent 78%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .gauge-root {
      width: min(var(--max), calc(100vw - 20px));
      margin: 0 auto;
      padding: 14px 0 28px;
      position: relative;
      z-index: 1;
    }

    .bar,
    .console,
    .panel,
    .feed,
    .route,
    .cell {
      border: 1px solid var(--line);
      background:
        radial-gradient(circle at 50% 0%, rgba(137, 200, 255, 0.11), transparent 38%),
        linear-gradient(180deg, var(--panel-2), var(--panel));
      box-shadow: var(--shadow);
    }

    .bar {
      min-height: 72px;
      margin-bottom: 12px;
      border-radius: 24px;
      padding: 12px;
      display: grid;
      gap: 10px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .mark {
      width: 46px;
      height: 46px;
      flex: none;
      display: grid;
      place-items: center;
      border: 1px solid rgba(240, 215, 156, 0.26);
      border-radius: 15px;
      background:
        radial-gradient(circle at 50% 32%, rgba(240, 215, 156, 0.28), transparent 45%),
        rgba(255, 255, 255, 0.035);
      color: var(--gold);
      font-weight: 950;
      letter-spacing: 0.06em;
    }

    .kicker {
      display: block;
      margin: 0 0 5px;
      color: #b8c8ef;
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .title {
      display: block;
      margin: 0;
      color: #fff;
      font-size: 1rem;
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    .nav {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .nav a,
    .btn {
      min-height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 0 12px;
      background: rgba(255, 255, 255, 0.035);
      color: #dce8ff;
      font-size: 0.75rem;
      font-weight: 850;
      text-align: center;
    }

    .nav a:focus-visible,
    .btn:focus-visible {
      outline: 2px solid rgba(240, 215, 156, 0.7);
      outline-offset: 3px;
    }

    .console {
      border-radius: 28px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .machine-window {
      min-height: 470px;
      position: relative;
      overflow: hidden;
      isolation: isolate;
      background:
        radial-gradient(circle at 50% 48%, rgba(240, 215, 156, 0.08), transparent 20%),
        radial-gradient(circle at 50% 52%, rgba(137, 200, 255, 0.13), transparent 32%),
        linear-gradient(180deg, rgba(2, 7, 16, 0.98), rgba(0, 2, 8, 0.99));
    }

    .machine-window::before {
      content: "";
      position: absolute;
      inset: 4%;
      border: 1px solid rgba(226, 238, 255, 0.11);
      border-radius: 30px;
      box-shadow: inset 0 0 55px rgba(137, 200, 255, 0.11);
      pointer-events: none;
      z-index: 3;
    }

    .unreadable-matrix {
      position: absolute;
      inset: -18%;
      z-index: 1;
      color: rgba(137, 200, 255, 0.18);
      font-size: clamp(8px, 1.3vw, 13px);
      line-height: 0.92;
      letter-spacing: 0.18em;
      white-space: pre-wrap;
      word-break: break-all;
      transform: rotate(-7deg);
      filter: blur(0.15px);
      opacity: 0.78;
      user-select: text;
    }

    .matrix-mask {
      position: absolute;
      inset: 0;
      z-index: 2;
      background:
        radial-gradient(circle at 50% 50%, transparent 0 32%, rgba(1, 4, 11, 0.52) 58%, rgba(1, 4, 11, 0.94) 100%),
        linear-gradient(180deg, transparent, rgba(1, 4, 11, 0.34));
      pointer-events: none;
    }

    .core-readout {
      position: relative;
      z-index: 4;
      min-height: 470px;
      display: grid;
      place-items: center;
      padding: 20px;
    }

    .core-orb {
      width: min(66vw, 350px);
      aspect-ratio: 1;
      border-radius: 50%;
      position: relative;
      display: grid;
      place-items: center;
      border: 1px solid rgba(226, 238, 255, 0.26);
      background:
        radial-gradient(circle at 36% 26%, rgba(255, 255, 255, 0.26), transparent 12%),
        radial-gradient(circle at 50% 50%, rgba(137, 200, 255, 0.20), transparent 31%),
        linear-gradient(135deg, rgba(15, 73, 130, 0.58), rgba(3, 12, 34, 0.94));
      box-shadow:
        inset -34px -30px 58px rgba(0, 0, 0, 0.58),
        0 0 48px rgba(137, 200, 255, 0.26),
        0 0 140px rgba(240, 215, 156, 0.13);
    }

    .core-orb::before,
    .core-orb::after {
      content: "";
      position: absolute;
      inset: 12%;
      border-radius: 50%;
      border: 1px solid rgba(240, 215, 156, 0.20);
      transform: rotate(45deg) scaleX(0.38);
    }

    .core-orb::after {
      transform: rotate(-45deg) scaleX(0.38);
      border-color: rgba(137, 200, 255, 0.22);
    }

    .core-label {
      position: relative;
      z-index: 2;
      display: grid;
      gap: 8px;
      text-align: center;
      padding: 20px;
    }

    .core-label strong {
      color: #fff;
      font-size: clamp(1rem, 4vw, 1.7rem);
      letter-spacing: 0.20em;
      text-transform: uppercase;
    }

    .core-label span {
      color: var(--muted);
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .live-strip {
      position: absolute;
      left: 50%;
      bottom: 24px;
      z-index: 5;
      width: min(92%, 820px);
      transform: translateX(-50%);
      border: 1px solid rgba(226, 238, 255, 0.18);
      border-radius: 999px;
      background: rgba(4, 10, 22, 0.86);
      padding: 11px 14px;
      display: grid;
      gap: 4px;
      text-align: center;
      backdrop-filter: blur(10px);
    }

    .live-strip strong {
      color: #fff;
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    .live-strip code {
      color: var(--gold);
      font-size: 0.68rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .grid {
      display: grid;
      gap: 12px;
    }

    .feed {
      border-radius: 24px;
      padding: 14px;
      overflow: hidden;
    }

    .feed h2,
    .panel h2 {
      margin: 0 0 10px;
      color: #fff;
      font-size: clamp(1.2rem, 5vw, 2rem);
      line-height: 1;
      letter-spacing: -0.04em;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .feed p,
    .panel p {
      margin: 0;
      color: var(--muted);
      line-height: 1.55;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .live-output {
      margin: 14px 0 0;
      min-height: 260px;
      max-height: 520px;
      overflow: auto;
      border: 1px solid rgba(226, 238, 255, 0.14);
      border-radius: 18px;
      padding: 12px;
      background: rgba(0, 0, 0, 0.28);
      color: #dce8ff;
      font-size: 0.78rem;
      line-height: 1.45;
      white-space: pre-wrap;
    }

    .route {
      border-radius: 24px;
      padding: 14px;
    }

    .route-grid {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }

    .cell {
      border-radius: 16px;
      padding: 12px;
      min-height: 86px;
    }

    .cell small {
      display: block;
      margin-bottom: 7px;
      color: #91a6cf;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.66rem;
      font-weight: 850;
    }

    .cell strong {
      display: block;
      color: #fff;
      margin-bottom: 7px;
      font-size: 0.95rem;
    }

    .cell code {
      display: block;
      color: var(--muted);
      font-size: 0.72rem;
      line-height: 1.35;
      word-break: break-word;
    }

    .ok {
      border-color: rgba(130, 240, 178, 0.28);
    }

    .warn {
      border-color: rgba(240, 215, 156, 0.34);
    }

    .block {
      border-color: rgba(255, 111, 137, 0.34);
    }

    .footer {
      padding: 14px 4px 0;
      color: #91a6cf;
      font-size: 0.78rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 10px;
    }

    @media (min-width: 860px) {
      .bar {
        grid-template-columns: 1fr auto;
        align-items: center;
      }

      .nav {
        grid-template-columns: repeat(5, auto);
      }

      .grid {
        grid-template-columns: 1.1fr 0.9fr;
      }

      .route-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 560px) {
      .gauge-root {
        width: min(100vw - 12px, var(--max));
        padding-top: 10px;
      }

      .bar,
      .feed,
      .route {
        border-radius: 20px;
      }

      .machine-window,
      .core-readout {
        min-height: 430px;
      }

      .core-orb {
        width: min(72vw, 280px);
      }

      .live-strip {
        border-radius: 20px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        animation: none !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
</head>

<body>
  <main id="gaugeRoot" class="gauge-root" data-gauge-generation="second-generation-renewal">
    <header class="bar">
      <a class="brand" href="/" aria-label="Diamond Gate Bridge root">
        <span class="mark" aria-hidden="true">DG</span>
        <span>
          <span class="kicker">Gauge Authority · Second Generation Renewal</span>
          <span class="title">Live Feed Instrument Surface</span>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
        <a href="/">Door</a>
        <a href="/products/">Products</a>
        <a href="/laws/">Laws</a>
        <a href="/about/">About</a>
        <a href="/gauges/">Gauges</a>
      </nav>
    </header>

    <section class="console" aria-label="Machine diagnostic console">
      <div class="machine-window">
        <pre id="matrix" class="unreadable-matrix" aria-hidden="true"></pre>
        <div class="matrix-mask" aria-hidden="true"></div>

        <div class="core-readout">
          <div class="core-orb" aria-hidden="true">
            <div class="core-label">
              <strong>LIVE FEED</strong>
              <span>machine surface / human summary below</span>
            </div>
          </div>
        </div>

        <div class="live-strip" aria-live="polite">
          <strong id="stripStatus">STATUS: BOOTING</strong>
          <code id="stripAction">NEXT_ACTION=RUN_DIAGNOSTIC_FEED</code>
        </div>
      </div>
    </section>

    <section class="grid">
      <article class="feed">
        <h2>Readable live feed.</h2>
        <p>
          The top surface is intentionally machine-dense. This panel is the operator feed. After deployment it inspects live public files and states the next required move.
        </p>
        <pre id="liveOutput" class="live-output">BOOT_STATE=WAITING_FOR_DIAGNOSTICS</pre>
      </article>

      <aside class="route">
        <h2>Route probes.</h2>
        <p>Each cell is generated from live route/source inspection.</p>

        <div id="routeGrid" class="route-grid">
          <div class="cell warn">
            <small>BOOT</small>
            <strong>Diagnostics pending</strong>
            <code>AWAITING_CLIENT_RUNTIME</code>
          </div>
        </div>
      </aside>
    </section>

    <footer class="footer">
      <span>Diamond Gate Bridge · Gauges · Second Generation Renewal</span>
      <span>MODE=LIVE_FEED_DIAGNOSTIC_SURFACE</span>
    </footer>
  </main>

  <script>
    (() => {
      "use strict";

      const FILES = [
        { key: "ROOT_HTML", path: "/index.html" },
        { key: "ROOT_JS", path: "/index.js" },
        { key: "PRODUCTS_HTML", path: "/products/index.html" },
        { key: "PRODUCTS_BRIDGE", path: "/products/index.js" },
        { key: "PRODUCTS_RUNTIME", path: "/products/products_runtime.js" },
        { key: "LAWS_HTML", path: "/laws/index.html" },
        { key: "ABOUT_HTML", path: "/about/index.html" },
        { key: "GAUGES_HTML", path: "/gauges/index.html" }
      ];

      const liveOutput = document.getElementById("liveOutput");
      const stripStatus = document.getElementById("stripStatus");
      const stripAction = document.getElementById("stripAction");
      const routeGrid = document.getElementById("routeGrid");
      const matrix = document.getElementById("matrix");

      function writeMatrix() {
        const alphabet = "01_ACK_ST_SCOPE_ROUTE_SOURCE_RUNTIME_VISIBLE_ACCEPTANCE_256_061_451_DGB_GEN2_DEMO_UNIVERSE_KERNEL_FEED_";
        let out = "";

        for (let i = 0; i < 5200; i += 1) {
          const ch = alphabet[(i * 17 + 11) % alphabet.length];
          out += ch;
          if (i % 97 === 0) out += "\n";
        }

        matrix.textContent = out;
      }

      function nowStamp() {
        return new Date().toISOString();
      }

      async function fetchText(path) {
        const url = path + (path.includes("?") ? "&" : "?") + "gauge=" + Date.now();

        try {
          const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: { "Accept": "text/html,text/javascript,text/plain,*/*" }
          });

          const text = await response.text();

          return {
            path,
            ok: response.ok,
            status: response.status,
            length: text.length,
            text
          };
        } catch (error) {
          return {
            path,
            ok: false,
            status: "FETCH_ERROR",
            length: 0,
            text: "",
            error: String(error && error.message ? error.message : error)
          };
        }
      }

      function includesAny(text, terms) {
        return terms.some((term) => text.includes(term));
      }

      function classify(results) {
        const byKey = Object.fromEntries(results.map((item) => [item.key, item]));

        const rootHtml = byKey.ROOT_HTML?.text || "";
        const rootJs = byKey.ROOT_JS?.text || "";
        const productsHtml = byKey.PRODUCTS_HTML?.text || "";
        const productsBridge = byKey.PRODUCTS_BRIDGE?.text || "";
        const productsRuntime = byKey.PRODUCTS_RUNTIME?.text || "";
        const lawsHtml = byKey.LAWS_HTML?.text || "";
        const aboutHtml = byKey.ABOUT_HTML?.text || "";
        const gaugesHtml = byKey.GAUGES_HTML?.text || "";

        const checks = [
          {
            key: "ROOT_LITERAL_LOVE",
            pass: !rootHtml.includes(">LOVE<") && !rootHtml.includes("LOVE</div>"),
            fail: "Root HTML still contains literal LOVE object.",
            next: "REPLACE_/index.html_WITH_SECOND_GENERATION_ROOT"
          },
          {
            key: "ROOT_JS_OLD_CORE",
            pass: !includesAny(rootJs, ["border-radius: 34px", "letter-spacing: .18em", "home-russian-doll"]),
            fail: "Root JS still carries old .home-core / Generation 1 surface styling.",
            next: "REPLACE_/index.js_WITH_SECOND_GENERATION_ROOT_RUNTIME"
          },
          {
            key: "ROOT_GEN2_MARKER",
            pass: rootHtml.includes("second-generation-renewal") || rootJs.includes("second-generation-renewal"),
            fail: "Root does not expose second-generation-renewal marker.",
            next: "ADD_GEN2_MARKER_TO_ROOT_HTML_AND_JS"
          },
          {
            key: "PRODUCTS_BRIDGE_PRESENT",
            pass: productsBridge.includes("products_runtime.js") || productsBridge.includes("ProductsPlanetRuntime"),
            fail: "Products bridge does not clearly route to runtime.",
            next: "INSPECT_/products/index.js_BRIDGE"
          },
          {
            key: "PRODUCTS_RUNTIME_RECEIPT",
            pass: productsRuntime.includes("productsRuntimeMounted") && productsRuntime.includes("data-products-runtime-root"),
            fail: "Products runtime lacks bridge receipt or runtime root marker.",
            next: "RENEW_/products/products_runtime.js_RECEIPT_CONTRACT"
          },
          {
            key: "PRODUCTS_FALLBACK",
            pass: !productsHtml.includes("Waiting for /products/index.js to load") || productsRuntime.includes("productsRuntimeMounted"),
            fail: "Products shell fallback is still relevant; runtime proof must be verified.",
            next: "VERIFY_PRODUCTS_RUNTIME_MOUNT_ON_LIVE_PAGE"
          },
          {
            key: "LAWS_G1",
            pass: !lawsHtml.includes("G1 External Expression") && !lawsHtml.includes("LAWS_G1_VISIBLE_THREE_LAYER_SURFACE"),
            fail: "Laws page still exposes G1 language.",
            next: "RENEW_/laws/index.html_AS_G2_AUTHORITY_INSTRUMENT"
          },
          {
            key: "ABOUT_IDENTITY",
            pass: !aboutHtml.includes("Geodiametrics") && !aboutHtml.includes(""),
            fail: "About page still has identity drift or visible artifact.",
            next: "RENEW_/about/index.html_FOR_DGB_IDENTITY"
          },
          {
            key: "GAUGES_GEN2_LIVE",
            pass: gaugesHtml.includes("Second Generation Renewal") && gaugesHtml.includes("LIVE_FEED_DIAGNOSTIC_SURFACE"),
            fail: "Gauges page is not yet this live-feed diagnostic surface.",
            next: "DEPLOY_THIS_/gauges/index.html_FILE"
          }
        ];

        const failed = checks.filter((check) => !check.pass);
        const passed = checks.filter((check) => check.pass);

        let nextAction = "NO_ACTION_REQUIRED";
        let priority = "CLEAR";

        if (failed.length > 0) {
          priority = "BLOCKED";
          nextAction = failed[0].next;
        }

        return {
          stamp: nowStamp(),
          priority,
          nextAction,
          passed,
          failed,
          files: results
        };
      }

      function renderRoutes(diagnostic) {
        routeGrid.innerHTML = "";

        const rows = diagnostic.files.map((file) => {
          const statusClass = file.ok ? "ok" : "block";
          const title = file.ok ? "reachable" : "blocked";
          const detail = "STATUS=" + file.status + " LENGTH=" + file.length;

          return `
            <div class="cell ${statusClass}">
              <small>${escapeHtml(file.key)}</small>
              <strong>${escapeHtml(title)}</strong>
              <code>${escapeHtml(file.path)}<br>${escapeHtml(detail)}</code>
            </div>
          `;
        });

        routeGrid.innerHTML = rows.join("");
      }

      function renderFeed(diagnostic) {
        const lines = [];

        lines.push("GAUGE_LIVE_FEED_V2");
        lines.push("STAMP=" + diagnostic.stamp);
        lines.push("PHASE=SECOND_GENERATION_RENEWAL");
        lines.push("PRIORITY=" + diagnostic.priority);
        lines.push("NEXT_ACTION=" + diagnostic.nextAction);
        lines.push("");

        lines.push("FAILED_CHECKS=[");
        if (diagnostic.failed.length === 0) {
          lines.push("  NONE");
        } else {
          for (const item of diagnostic.failed) {
            lines.push("  {");
            lines.push("    CHECK=" + item.key);
            lines.push("    FINDING=" + item.fail);
            lines.push("    NEXT=" + item.next);
            lines.push("  }");
          }
        }
        lines.push("]");
        lines.push("");

        lines.push("PASSED_CHECKS=[");
        if (diagnostic.passed.length === 0) {
          lines.push("  NONE");
        } else {
          for (const item of diagnostic.passed) {
            lines.push("  " + item.key);
          }
        }
        lines.push("]");
        lines.push("");

        lines.push("FILE_PROBES=[");
        for (const file of diagnostic.files) {
          lines.push("  " + file.key + " => " + file.path + " :: STATUS=" + file.status + " LENGTH=" + file.length);
        }
        lines.push("]");

        liveOutput.textContent = lines.join("\n");
        stripStatus.textContent = "STATUS: " + diagnostic.priority;
        stripAction.textContent = "NEXT_ACTION=" + diagnostic.nextAction;
      }

      function escapeHtml(value) {
        return String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      async function run() {
        writeMatrix();

        stripStatus.textContent = "STATUS: RUNNING";
        stripAction.textContent = "NEXT_ACTION=FETCH_PUBLIC_SOURCE_FILES";
        liveOutput.textContent = "GAUGE_BOOT=RUNNING\nFETCHING_PUBLIC_SOURCE_FILES=TRUE";

        const results = [];

        for (const file of FILES) {
          const fetched = await fetchText(file.path);
          results.push({ key: file.key, ...fetched });
        }

        const diagnostic = classify(results);

        renderRoutes(diagnostic);
        renderFeed(diagnostic);

        document.documentElement.setAttribute("data-gauge-priority", diagnostic.priority.toLowerCase());
        document.getElementById("gaugeRoot").setAttribute("data-next-action", diagnostic.nextAction);
      }

      run();
    })();
  </script>
</body>
</html>
