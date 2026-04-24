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
    { key: "GAUGES_HTML", path: "/gauges/index.html" },
    { key: "GAUGES_JS", path: "/gauges/index.js" }
  ];

  const liveOutput = document.getElementById("liveOutput");
  const stripStatus = document.getElementById("stripStatus");
  const stripAction = document.getElementById("stripAction");
  const routeGrid = document.getElementById("routeGrid");
  const matrix = document.getElementById("matrix");

  function safeSet(node, value) {
    if (node) node.textContent = value;
  }

  function writeMatrix() {
    if (!matrix) return;

    const alphabet =
      "01_ACK_ST_SCOPE_ROUTE_SOURCE_RUNTIME_VISIBLE_ACCEPTANCE_256_061_451_DGB_GEN2_DEMO_UNIVERSE_KERNEL_FEED_";

    let out = "";

    for (let i = 0; i < 5200; i += 1) {
      out += alphabet[(i * 17 + 11) % alphabet.length];
      if (i % 97 === 0) out += "\n";
    }

    matrix.textContent = out;
  }

  async function fetchText(path) {
    try {
      const response = await fetch(path + "?gauge=" + Date.now(), {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "text/html,text/javascript,text/plain,*/*"
        }
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

  function any(text, terms) {
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
    const gaugesJs = byKey.GAUGES_JS?.text || "";

    const checks = [
      {
        key: "ROOT_LITERAL_LOVE",
        pass: !rootHtml.includes(">LOVE<") && !rootHtml.includes("LOVE</div>"),
        fail: "Root HTML still contains literal LOVE object.",
        next: "REPLACE_/index.html_WITH_SECOND_GENERATION_ROOT"
      },
      {
        key: "ROOT_JS_OLD_CORE",
        pass: !any(rootJs, [
          "border-radius: 34px",
          "letter-spacing: .18em",
          "home-russian-doll"
        ]),
        fail: "Root JS still carries old .home-core / Generation 1 surface styling.",
        next: "REPLACE_/index.js_WITH_SECOND_GENERATION_ROOT_RUNTIME"
      },
      {
        key: "ROOT_GEN2_MARKER",
        pass:
          rootHtml.includes("second-generation-renewal") ||
          rootJs.includes("second-generation-renewal"),
        fail: "Root does not expose second-generation-renewal marker.",
        next: "ADD_GEN2_MARKER_TO_ROOT_HTML_AND_JS"
      },
      {
        key: "PRODUCTS_BRIDGE_PRESENT",
        pass:
          productsBridge.includes("products_runtime.js") ||
          productsBridge.includes("ProductsPlanetRuntime"),
        fail: "Products bridge does not clearly route to runtime.",
        next: "INSPECT_/products/index.js_BRIDGE"
      },
      {
        key: "PRODUCTS_RUNTIME_RECEIPT",
        pass:
          productsRuntime.includes("productsRuntimeMounted") &&
          productsRuntime.includes("data-products-runtime-root"),
        fail: "Products runtime lacks bridge receipt or runtime root marker.",
        next: "RENEW_/products/products_runtime.js_RECEIPT_CONTRACT"
      },
      {
        key: "PRODUCTS_FALLBACK",
        pass:
          !productsHtml.includes("Waiting for /products/index.js to load") ||
          productsRuntime.includes("productsRuntimeMounted"),
        fail: "Products shell fallback is still relevant; runtime proof must be verified.",
        next: "VERIFY_PRODUCTS_RUNTIME_MOUNT_ON_LIVE_PAGE"
      },
      {
        key: "LAWS_G1",
        pass:
          !lawsHtml.includes("G1 External Expression") &&
          !lawsHtml.includes("LAWS_G1_VISIBLE_THREE_LAYER_SURFACE"),
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
        pass:
          gaugesHtml.includes("Second Generation Renewal") &&
          gaugesHtml.includes("LIVE_FEED_DIAGNOSTIC_SURFACE"),
        fail: "Gauges page is not yet the second-generation live-feed diagnostic surface.",
        next: "DEPLOY_/gauges/index.html_SECOND_GENERATION_LIVE_FEED"
      },
      {
        key: "GAUGES_JS_PRESENT",
        pass:
          gaugesJs.includes("GAUGE_LIVE_FEED_V2") ||
          gaugesJs.includes("SECOND_GENERATION_RENEWAL"),
        fail: "Gauges JS is missing or not carrying the live-feed diagnostic runtime.",
        next: "DEPLOY_/gauges/index.js_LIVE_FEED_RUNTIME"
      }
    ];

    const failed = checks.filter((check) => !check.pass);
    const passed = checks.filter((check) => check.pass);

    return {
      stamp: new Date().toISOString(),
      priority: failed.length ? "BLOCKED" : "CLEAR",
      nextAction: failed.length ? failed[0].next : "NO_ACTION_REQUIRED",
      passed,
      failed,
      files: results
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderRoutes(diagnostic) {
    if (!routeGrid) return;

    routeGrid.innerHTML = diagnostic.files
      .map((file) => {
        const cls = file.ok ? "ok" : "block";
        const title = file.ok ? "reachable" : "blocked";

        return `
          <div class="cell ${cls}">
            <small>${escapeHtml(file.key)}</small>
            <strong>${escapeHtml(title)}</strong>
            <code>${escapeHtml(file.path)}<br>STATUS=${escapeHtml(file.status)} LENGTH=${escapeHtml(file.length)}</code>
          </div>
        `;
      })
      .join("");
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
    if (!diagnostic.failed.length) lines.push("  NONE");

    for (const item of diagnostic.failed) {
      lines.push("  {");
      lines.push("    CHECK=" + item.key);
      lines.push("    FINDING=" + item.fail);
      lines.push("    NEXT=" + item.next);
      lines.push("  }");
    }

    lines.push("]");
    lines.push("");

    lines.push("PASSED_CHECKS=[");
    if (!diagnostic.passed.length) lines.push("  NONE");
    for (const item of diagnostic.passed) lines.push("  " + item.key);
    lines.push("]");
    lines.push("");

    lines.push("FILE_PROBES=[");
    for (const file of diagnostic.files) {
      lines.push(
        "  " +
          file.key +
          " => " +
          file.path +
          " :: STATUS=" +
          file.status +
          " LENGTH=" +
          file.length
      );
    }
    lines.push("]");

    safeSet(liveOutput, lines.join("\n"));
    safeSet(stripStatus, "STATUS: " + diagnostic.priority);
    safeSet(stripAction, "NEXT_ACTION=" + diagnostic.nextAction);
  }

  async function run() {
    writeMatrix();

    safeSet(stripStatus, "STATUS: RUNNING");
    safeSet(stripAction, "NEXT_ACTION=FETCH_PUBLIC_SOURCE_FILES");
    safeSet(liveOutput, "GAUGE_BOOT=RUNNING\nFETCHING_PUBLIC_SOURCE_FILES=TRUE");

    const results = [];

    for (const file of FILES) {
      const fetched = await fetchText(file.path);
      results.push({ key: file.key, ...fetched });
    }

    const diagnostic = classify(results);

    renderRoutes(diagnostic);
    renderFeed(diagnostic);

    document.documentElement.setAttribute(
      "data-gauge-priority",
      diagnostic.priority.toLowerCase()
    );

    const root = document.getElementById("gaugeRoot");
    if (root) {
      root.setAttribute("data-next-action", diagnostic.nextAction);
      root.setAttribute("data-gauge-runtime", "mounted");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
