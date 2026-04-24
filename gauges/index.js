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

  const EARTH_STYLE_ID = "dgb-gauges-earth-proof-globe-v1";

  const liveOutput = document.getElementById("liveOutput");
  const stripStatus = document.getElementById("stripStatus");
  const stripAction = document.getElementById("stripAction");
  const routeGrid = document.getElementById("routeGrid");
  const matrix = document.getElementById("matrix");

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function injectEarthProofStyle() {
    if (document.getElementById(EARTH_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = EARTH_STYLE_ID;
    style.textContent = `
      .orb {
        width: min(78vw, 430px) !important;
        aspect-ratio: 1 !important;
        border-radius: 50% !important;
        position: relative !important;
        display: grid !important;
        place-items: center !important;
        overflow: visible !important;
        border: 1px solid rgba(226,238,255,.30) !important;
        background:
          radial-gradient(circle at 50% 50%, rgba(137,200,255,.12), transparent 46%),
          linear-gradient(180deg, rgba(5,14,31,.78), rgba(1,4,11,.96)) !important;
        box-shadow:
          inset -34px -30px 58px rgba(0,0,0,.58),
          0 0 48px rgba(137,200,255,.26),
          0 0 140px rgba(240,215,156,.13) !important;
      }

      .orb::before,
      .orb::after {
        content: "" !important;
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        width: 118% !important;
        height: 118% !important;
        border-radius: 50% !important;
        border: 1px solid rgba(240,215,156,.24) !important;
        transform: translate(-50%,-50%) rotate(42deg) scaleX(.34) !important;
        pointer-events: none !important;
        z-index: 1 !important;
        opacity: .82 !important;
      }

      .orb::after {
        border-color: rgba(137,200,255,.26) !important;
        transform: translate(-50%,-50%) rotate(-38deg) scaleX(.34) !important;
      }

      .orb-label {
        display: none !important;
      }

      .earth-proof-globe {
        position: relative;
        z-index: 3;
        width: min(72vw, 390px);
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        isolation: isolate;
        background:
          radial-gradient(circle at 31% 22%, rgba(255,255,255,.78), transparent 9%),
          radial-gradient(circle at 40% 35%, rgba(195,226,255,.34), transparent 25%),
          radial-gradient(circle at 52% 50%, rgba(39,137,219,.48), transparent 52%),
          linear-gradient(135deg, #0e68b5 0%, #0a3f86 45%, #04162f 100%);
        border: 1px solid rgba(218,239,255,.78);
        box-shadow:
          inset -42px -36px 62px rgba(0,0,0,.64),
          inset 22px 17px 36px rgba(255,255,255,.27),
          0 0 54px rgba(142,197,255,.54),
          0 0 138px rgba(239,210,154,.22);
      }

      .earth-proof-globe__svg {
        position: absolute;
        inset: 0;
        z-index: 3;
        width: 100%;
        height: 100%;
        display: block;
      }

      .earth-proof-globe__ocean {
        fill: #0b61ad;
      }

      .earth-proof-globe__deep-ocean {
        fill: #052a61;
        opacity: .46;
      }

      .earth-proof-globe__continent {
        fill: #48a96d;
        stroke: rgba(255,255,255,.22);
        stroke-width: .9;
      }

      .earth-proof-globe__continent-warm {
        fill: #b8a266;
        stroke: rgba(255,255,255,.20);
        stroke-width: .85;
      }

      .earth-proof-globe__africa {
        fill: #4fb06b;
        stroke: rgba(255,255,255,.28);
        stroke-width: 1.05;
      }

      .earth-proof-globe__ice {
        fill: rgba(241,248,255,.86);
        stroke: rgba(255,255,255,.24);
        stroke-width: .6;
      }

      .earth-proof-globe__cloud {
        fill: rgba(255,255,255,.60);
      }

      .earth-proof-globe__grid {
        fill: none;
        stroke: rgba(255,255,255,.16);
        stroke-width: .65;
      }

      .earth-proof-globe__rim {
        fill: none;
        stroke: rgba(184,228,255,.78);
        stroke-width: 2.2;
      }

      .earth-proof-globe__shadow {
        position: absolute;
        inset: 0;
        z-index: 5;
        border-radius: 50%;
        pointer-events: none;
        background:
          radial-gradient(circle at 34% 25%, rgba(255,255,255,.30), transparent 15%),
          radial-gradient(circle at 77% 73%, rgba(0,0,0,.42), transparent 38%),
          linear-gradient(90deg, rgba(255,255,255,.10), transparent 40%, rgba(0,0,0,.30) 100%);
        mix-blend-mode: screen;
      }

      .earth-proof-globe__terminator {
        position: absolute;
        inset: 0;
        z-index: 6;
        border-radius: 50%;
        pointer-events: none;
        background: linear-gradient(105deg, transparent 0 57%, rgba(0,0,0,.32) 78%, rgba(0,0,0,.52) 100%);
      }

      .earth-proof-globe__atmosphere {
        position: absolute;
        inset: -1px;
        z-index: 7;
        border-radius: 50%;
        pointer-events: none;
        box-shadow:
          inset 0 0 18px rgba(255,255,255,.20),
          0 0 24px rgba(120,205,255,.44),
          0 0 60px rgba(120,205,255,.20);
      }

      .earth-proof-globe__tag {
        position: absolute;
        left: 50%;
        bottom: 7%;
        transform: translateX(-50%);
        z-index: 10;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(4,10,22,.46);
        color: rgba(234,244,255,.86);
        font: 800 10px/1.1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        letter-spacing: .13em;
        text-transform: uppercase;
        white-space: nowrap;
        backdrop-filter: blur(5px);
      }

      @media (max-width: 560px) {
        .earth-proof-globe {
          width: min(74vw, 360px);
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createEarthProofSvg() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");

    svg.setAttribute("class", "earth-proof-globe__svg");
    svg.setAttribute("viewBox", "0 0 240 240");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    svg.innerHTML = `
      <defs>
        <clipPath id="earthProofClipDgbV1">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>

      <circle class="earth-proof-globe__ocean" cx="120" cy="120" r="108"></circle>
      <circle class="earth-proof-globe__deep-ocean" cx="151" cy="143" r="94"></circle>

      <g clip-path="url(#earthProofClipDgbV1)">
        <path class="earth-proof-globe__grid" d="M12 120 H228"></path>
        <path class="earth-proof-globe__grid" d="M120 12 V228"></path>
        <ellipse class="earth-proof-globe__grid" cx="120" cy="120" rx="108" ry="38"></ellipse>
        <ellipse class="earth-proof-globe__grid" cx="120" cy="120" rx="108" ry="70"></ellipse>
        <ellipse class="earth-proof-globe__grid" cx="120" cy="120" rx="72" ry="108"></ellipse>
        <ellipse class="earth-proof-globe__grid" cx="120" cy="120" rx="36" ry="108"></ellipse>

        <!-- North America -->
        <path class="earth-proof-globe__continent" d="M31 53 C48 31 83 30 104 45 C119 56 118 73 101 81 C89 87 80 94 68 96 C48 99 29 84 27 67 C26 62 28 57 31 53 Z"></path>

        <!-- South America -->
        <path class="earth-proof-globe__continent" d="M75 98 C94 96 109 112 106 136 C104 154 95 178 78 196 C67 185 56 164 58 141 C60 120 65 104 75 98 Z"></path>

        <!-- Europe -->
        <path class="earth-proof-globe__continent-warm" d="M111 46 C124 35 146 35 158 46 C151 59 132 66 118 59 C109 55 106 50 111 46 Z"></path>

        <!-- Africa: intentionally central and recognizable -->
        <path class="earth-proof-globe__africa" d="M125 82 C145 76 166 88 176 109 C185 128 179 151 164 169 C154 182 141 193 130 190 C119 187 118 171 112 157 C105 140 98 127 102 109 C105 95 113 86 125 82 Z"></path>

        <!-- Asia -->
        <path class="earth-proof-globe__continent-warm" d="M151 50 C178 39 210 54 225 80 C233 95 223 111 205 110 C187 109 178 96 164 91 C148 85 140 69 151 50 Z"></path>
        <path class="earth-proof-globe__continent-warm" d="M171 107 C196 103 219 120 223 146 C226 169 205 186 181 181 C163 177 153 158 157 139 C160 123 162 112 171 107 Z"></path>

        <!-- Australia -->
        <path class="earth-proof-globe__continent" d="M181 181 C203 176 225 188 232 207 C212 227 178 225 160 205 C163 193 171 185 181 181 Z"></path>

        <!-- Antarctica -->
        <path class="earth-proof-globe__ice" d="M27 211 C70 197 146 198 211 212 C169 236 74 237 27 211 Z"></path>

        <!-- Arctic cap -->
        <path class="earth-proof-globe__ice" d="M35 27 C70 11 162 10 202 27 C158 38 81 38 35 27 Z"></path>

        <!-- Clouds -->
        <path class="earth-proof-globe__cloud" d="M24 79 C55 66 83 70 107 84 C79 92 49 92 24 79 Z"></path>
        <path class="earth-proof-globe__cloud" d="M87 38 C122 27 161 31 193 50 C156 55 119 53 87 38 Z"></path>
        <path class="earth-proof-globe__cloud" d="M103 159 C136 146 177 153 209 173 C169 178 132 176 103 159 Z"></path>
        <path class="earth-proof-globe__cloud" d="M39 125 C69 115 94 121 116 136 C84 141 59 139 39 125 Z"></path>
        <path class="earth-proof-globe__cloud" d="M135 67 C160 60 185 65 207 79 C177 86 154 83 135 67 Z"></path>
      </g>

      <circle class="earth-proof-globe__rim" cx="120" cy="120" r="108"></circle>
    `;

    return svg;
  }

  function mountEarthProofGlobe() {
    injectEarthProofStyle();

    const orb = document.querySelector(".orb");
    if (!orb) return;

    const globe = document.createElement("div");
    globe.className = "earth-proof-globe";
    globe.setAttribute("role", "img");
    globe.setAttribute("aria-label", "Planet Earth proof globe with Africa and seven continents");
    globe.setAttribute("data-gauges-earth-proof-globe", "true");
    globe.setAttribute("data-africa-visible", "true");
    globe.setAttribute("data-seven-continent-read", "true");

    const shadow = document.createElement("span");
    shadow.className = "earth-proof-globe__shadow";
    shadow.setAttribute("aria-hidden", "true");

    const terminator = document.createElement("span");
    terminator.className = "earth-proof-globe__terminator";
    terminator.setAttribute("aria-hidden", "true");

    const atmosphere = document.createElement("span");
    atmosphere.className = "earth-proof-globe__atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");

    const tag = document.createElement("span");
    tag.className = "earth-proof-globe__tag";
    tag.textContent = "Africa · Seven Continents";

    globe.append(createEarthProofSvg(), shadow, terminator, atmosphere, tag);
    orb.replaceChildren(globe);

    orb.setAttribute("data-gauges-earth-proof-mounted", "true");
  }

  function writeMatrix() {
    if (!matrix) return;

    const alphabet = "01_ACK_ST_SCOPE_ROUTE_SOURCE_RUNTIME_VISIBLE_ACCEPTANCE_256_DGB_GEN2_EARTH_AFRICA_SEVEN_CONTINENTS_GLOBE_PROOF_";
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
        headers: { Accept: "text/html,text/javascript,text/plain,*/*" }
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
        key: "GAUGES_EARTH_PROOF_GLOBE",
        pass:
          gaugesJs.includes("earth-proof-globe") &&
          gaugesJs.includes("Africa · Seven Continents") &&
          gaugesJs.includes("data-seven-continent-read"),
        fail: "Gauges Earth proof globe is not installed.",
        next: "INSTALL_EARTH_PROOF_GLOBE_IN_/gauges/index.js"
      },
      {
        key: "ROOT_NOT_GAUGES",
        pass: !rootHtml.includes("Gauge Authority") && !rootHtml.includes("LIVE_FEED_DIAGNOSTIC_SURFACE"),
        fail: "Root is still carrying gauges content.",
        next: "RESTORE_/index.html_AND_/index.js_AS_HOME_FILES"
      },
      {
        key: "ROOT_GEN2_MARKER",
        pass: rootHtml.includes("second-generation-renewal") || rootJs.includes("second-generation-renewal"),
        fail: "Root does not expose second-generation-renewal marker.",
        next: "REPLACE_/index.html_AND_/index.js_WITH_GEN2_HOME"
      },
      {
        key: "ROOT_LITERAL_LOVE",
        pass: !rootHtml.includes(">LOVE<") && !rootHtml.includes("LOVE</div>"),
        fail: "Root HTML still contains literal LOVE object.",
        next: "REPLACE_/index.html_WITH_SECOND_GENERATION_HOME"
      },
      {
        key: "ROOT_JS_OLD_CORE",
        pass: !any(rootJs, ["border-radius: 34px", "letter-spacing: .18em", "home-russian-doll"]),
        fail: "Root JS still carries old .home-core / Generation 1 styling.",
        next: "REPLACE_/index.js_WITH_SECOND_GENERATION_HOME_RUNTIME"
      },
      {
        key: "GAUGES_HTML_LIVE_FEED",
        pass: gaugesHtml.includes("LIVE_FEED_DIAGNOSTIC_SURFACE") && gaugesHtml.includes("/gauges/index.js"),
        fail: "Gauges HTML is not the live-feed diagnostic surface.",
        next: "REPLACE_/gauges/index.html_WITH_LIVE_FEED_SURFACE"
      },
      {
        key: "GAUGES_JS_LIVE_FEED",
        pass: gaugesJs.includes("GAUGE_LIVE_FEED_V2") && gaugesJs.includes("ROOT_NOT_GAUGES"),
        fail: "Gauges JS is missing the live-feed diagnostic runtime.",
        next: "REPLACE_/gauges/index.js_WITH_LIVE_FEED_RUNTIME"
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
        key: "PRODUCTS_FALLBACK_RELEVANT",
        pass: !productsHtml.includes("Waiting for /products/index.js to load") || productsRuntime.includes("productsRuntimeMounted"),
        fail: "Products shell fallback is still relevant; runtime proof must be verified.",
        next: "VERIFY_PRODUCTS_RUNTIME_MOUNT_ON_LIVE_PAGE"
      },
      {
        key: "LAWS_G1_RETIRED",
        pass: !lawsHtml.includes("G1 External Expression") && !lawsHtml.includes("LAWS_G1_VISIBLE_THREE_LAYER_SURFACE"),
        fail: "Laws page still exposes G1 language.",
        next: "RENEW_/laws/index.html_AS_G2_AUTHORITY_INSTRUMENT"
      },
      {
        key: "ABOUT_IDENTITY_CLEAN",
        pass: !aboutHtml.includes("Geodiametrics") && !aboutHtml.includes(""),
        fail: "About page still has identity drift or visible artifact.",
        next: "RENEW_/about/index.html_FOR_DGB_IDENTITY"
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

    routeGrid.innerHTML = diagnostic.files.map((file) => {
      const cls = file.ok ? "ok" : "block";
      const title = file.ok ? "reachable" : "blocked";

      return `
        <div class="cell ${cls}">
          <small>${escapeHtml(file.key)}</small>
          <strong>${escapeHtml(title)}</strong>
          <code>${escapeHtml(file.path)}<br>STATUS=${escapeHtml(file.status)} LENGTH=${escapeHtml(file.length)}</code>
        </div>
      `;
    }).join("");
  }

  function renderFeed(diagnostic) {
    const lines = [];

    lines.push("GAUGE_LIVE_FEED_V2");
    lines.push("STAMP=" + diagnostic.stamp);
    lines.push("PHASE=SECOND_GENERATION_RENEWAL");
    lines.push("GAUGES_EARTH_PROOF=ACTIVE");
    lines.push("EARTH_STANDARD=AFRICA_VISIBLE_PLUS_SEVEN_CONTINENT_READ");
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
      lines.push("  " + file.key + " => " + file.path + " :: STATUS=" + file.status + " LENGTH=" + file.length);
    }
    lines.push("]");

    setText(liveOutput, lines.join("\n"));
    setText(stripStatus, "STATUS: " + diagnostic.priority);
    setText(stripAction, "NEXT_ACTION=" + diagnostic.nextAction);
  }

  async function run() {
    writeMatrix();
    mountEarthProofGlobe();

    setText(stripStatus, "STATUS: RUNNING");
    setText(stripAction, "NEXT_ACTION=FETCH_PUBLIC_SOURCE_FILES");
    setText(liveOutput, "GAUGE_BOOT=RUNNING\nFETCHING_PUBLIC_SOURCE_FILES=TRUE\nGAUGES_EARTH_PROOF=ACTIVE");

    const results = [];

    for (const file of FILES) {
      const fetched = await fetchText(file.path);
      results.push({ key: file.key, ...fetched });
    }

    const diagnostic = classify(results);

    renderRoutes(diagnostic);
    renderFeed(diagnostic);

    document.documentElement.setAttribute("data-gauge-priority", diagnostic.priority.toLowerCase());

    const root = document.getElementById("gaugeRoot");
    if (root) {
      root.setAttribute("data-next-action", diagnostic.nextAction);
      root.setAttribute("data-gauge-runtime", "mounted");
      root.setAttribute("data-gauges-earth-proof", "active");
      root.setAttribute("data-earth-standard", "africa-visible-seven-continent-read");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
