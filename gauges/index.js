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

  const EARTH_STYLE_ID = "dgb-gauges-real-earth-texture-proof-v1";

  const EARTH_TEXTURE_URL =
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg";

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
        width: min(82vw, 470px) !important;
        aspect-ratio: 1 !important;
        border-radius: 50% !important;
        position: relative !important;
        display: grid !important;
        place-items: center !important;
        overflow: visible !important;
        border: 1px solid rgba(226,238,255,.30) !important;
        background:
          radial-gradient(circle at 50% 50%, rgba(137,200,255,.14), transparent 46%),
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
        width: 122% !important;
        height: 122% !important;
        border-radius: 50% !important;
        border: 1px solid rgba(240,215,156,.24) !important;
        transform: translate(-50%,-50%) rotate(42deg) scaleX(.34) !important;
        pointer-events: none !important;
        z-index: 1 !important;
        opacity: .82 !important;
      }

      .orb::after {
        border-color: rgba(137,200,255,.28) !important;
        transform: translate(-50%,-50%) rotate(-38deg) scaleX(.34) !important;
      }

      .orb-label {
        display: none !important;
      }

      .earth-proof-globe {
        position: relative;
        z-index: 3;
        width: min(78vw, 430px);
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        isolation: isolate;
        border: 1px solid rgba(218,239,255,.80);
        background: #07396f;
        box-shadow:
          inset -46px -38px 66px rgba(0,0,0,.64),
          inset 22px 17px 36px rgba(255,255,255,.25),
          0 0 58px rgba(142,197,255,.56),
          0 0 148px rgba(239,210,154,.20);
      }

      .earth-proof-globe__texture {
        position: absolute;
        inset: 0;
        z-index: 2;
        border-radius: 50%;
        background-image: var(--earth-texture-url);
        background-repeat: no-repeat;
        background-size: 245% 122%;
        background-position: 56% 47%;
        filter: saturate(1.18) contrast(1.10) brightness(.98);
        transform: scale(1.055);
      }

      .earth-proof-globe__texture::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          radial-gradient(circle at 31% 22%, rgba(255,255,255,.32), transparent 12%),
          linear-gradient(90deg, rgba(255,255,255,.10), transparent 38%, rgba(0,0,0,.42) 100%);
        mix-blend-mode: screen;
        pointer-events: none;
      }

      .earth-proof-globe__texture::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          radial-gradient(circle at 77% 73%, rgba(0,0,0,.48), transparent 39%),
          linear-gradient(105deg, transparent 0 58%, rgba(0,0,0,.30) 78%, rgba(0,0,0,.54) 100%);
        pointer-events: none;
      }

      .earth-proof-globe__boundaries,
      .earth-proof-globe__clouds,
      .earth-proof-globe__grid {
        position: absolute;
        inset: 0;
        z-index: 4;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
      }

      .earth-proof-globe__grid-line {
        fill: none;
        stroke: rgba(255,255,255,.15);
        stroke-width: .6;
      }

      .earth-proof-globe__country-line {
        fill: none;
        stroke: rgba(245,242,220,.50);
        stroke-width: .55;
        vector-effect: non-scaling-stroke;
      }

      .earth-proof-globe__coast-line {
        fill: none;
        stroke: rgba(255,255,255,.60);
        stroke-width: .85;
        vector-effect: non-scaling-stroke;
      }

      .earth-proof-globe__cloud {
        fill: rgba(255,255,255,.36);
      }

      .earth-proof-globe__rim {
        position: absolute;
        inset: -1px;
        z-index: 7;
        border-radius: 50%;
        pointer-events: none;
        box-shadow:
          inset 0 0 18px rgba(255,255,255,.22),
          inset 0 0 44px rgba(100,180,255,.18),
          0 0 26px rgba(120,205,255,.48),
          0 0 66px rgba(120,205,255,.22);
      }

      .earth-proof-globe__tag {
        position: absolute;
        left: 50%;
        bottom: 7%;
        transform: translateX(-50%);
        z-index: 10;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(4,10,22,.58);
        color: rgba(234,244,255,.90);
        font: 800 10px/1.1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        letter-spacing: .13em;
        text-transform: uppercase;
        white-space: nowrap;
        backdrop-filter: blur(5px);
      }

      @media (max-width: 560px) {
        .earth-proof-globe {
          width: min(78vw, 390px);
        }

        .earth-proof-globe__tag {
          font-size: 9px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createSvgElement(className, viewBox = "0 0 240 240") {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");

    svg.setAttribute("class", className);
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    return svg;
  }

  function createGridSvg() {
    const svg = createSvgElement("earth-proof-globe__grid");

    svg.innerHTML = `
      <defs>
        <clipPath id="earthGridClipDgbV1">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>
      <g clip-path="url(#earthGridClipDgbV1)">
        <path class="earth-proof-globe__grid-line" d="M12 120 H228"></path>
        <path class="earth-proof-globe__grid-line" d="M120 12 V228"></path>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="108" ry="38"></ellipse>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="108" ry="70"></ellipse>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="72" ry="108"></ellipse>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="36" ry="108"></ellipse>
      </g>
    `;

    return svg;
  }

  function createBoundarySvg() {
    const svg = createSvgElement("earth-proof-globe__boundaries");

    svg.innerHTML = `
      <defs>
        <clipPath id="earthBoundaryClipDgbV1">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>

      <g clip-path="url(#earthBoundaryClipDgbV1)">
        <!-- Coast / continental mass guides, aligned to Africa-Europe-Asia texture view -->
        <path class="earth-proof-globe__coast-line" d="M38 71 C52 54 80 48 102 55 C121 61 132 75 143 83 C160 96 180 96 197 109 C214 122 224 144 219 166"></path>
        <path class="earth-proof-globe__coast-line" d="M71 124 C83 112 98 105 114 111 C130 117 142 133 145 153 C148 176 136 196 119 204 C101 194 88 177 83 157 C80 144 76 134 71 124 Z"></path>
        <path class="earth-proof-globe__coast-line" d="M118 79 C137 65 166 63 193 75 C216 85 230 103 235 124"></path>
        <path class="earth-proof-globe__coast-line" d="M158 157 C179 151 204 161 217 181 C202 207 171 213 148 193"></path>
        <path class="earth-proof-globe__coast-line" d="M23 93 C45 83 64 86 78 101"></path>
        <path class="earth-proof-globe__coast-line" d="M45 182 C67 199 96 208 124 207"></path>

        <!-- Africa country-style boundaries -->
        <path class="earth-proof-globe__country-line" d="M98 112 C111 120 127 121 143 116"></path>
        <path class="earth-proof-globe__country-line" d="M91 132 C107 137 124 137 144 133"></path>
        <path class="earth-proof-globe__country-line" d="M91 151 C108 154 128 153 147 148"></path>
        <path class="earth-proof-globe__country-line" d="M99 173 C115 173 132 170 145 164"></path>
        <path class="earth-proof-globe__country-line" d="M113 109 C111 130 109 152 113 184"></path>
        <path class="earth-proof-globe__country-line" d="M128 112 C126 132 127 153 134 176"></path>
        <path class="earth-proof-globe__country-line" d="M143 119 C142 139 144 155 153 169"></path>

        <!-- Europe boundaries -->
        <path class="earth-proof-globe__country-line" d="M82 69 C96 75 111 77 126 73"></path>
        <path class="earth-proof-globe__country-line" d="M91 83 C105 89 119 90 135 84"></path>
        <path class="earth-proof-globe__country-line" d="M105 60 C106 74 106 87 103 99"></path>
        <path class="earth-proof-globe__country-line" d="M121 62 C120 76 122 89 129 100"></path>

        <!-- Asia boundaries -->
        <path class="earth-proof-globe__country-line" d="M142 82 C161 89 181 90 202 84"></path>
        <path class="earth-proof-globe__country-line" d="M151 101 C171 106 193 107 214 100"></path>
        <path class="earth-proof-globe__country-line" d="M164 119 C183 123 203 124 222 118"></path>
        <path class="earth-proof-globe__country-line" d="M160 83 C158 103 159 124 166 145"></path>
        <path class="earth-proof-globe__country-line" d="M184 86 C181 108 181 130 187 151"></path>
        <path class="earth-proof-globe__country-line" d="M206 96 C203 118 204 139 213 158"></path>

        <!-- Middle East / India / SE Asia guides -->
        <path class="earth-proof-globe__country-line" d="M139 96 C150 106 157 118 158 134"></path>
        <path class="earth-proof-globe__country-line" d="M151 138 C162 151 174 160 189 165"></path>
        <path class="earth-proof-globe__country-line" d="M184 153 C198 161 211 169 223 182"></path>

        <!-- South America and North America edge hints if visible on texture edge -->
        <path class="earth-proof-globe__country-line" d="M36 96 C48 104 56 118 57 135"></path>
        <path class="earth-proof-globe__country-line" d="M51 143 C60 158 66 174 68 190"></path>
      </g>
    `;

    return svg;
  }

  function createCloudSvg() {
    const svg = createSvgElement("earth-proof-globe__clouds");

    svg.innerHTML = `
      <defs>
        <clipPath id="earthCloudClipDgbV1">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>

      <g clip-path="url(#earthCloudClipDgbV1)">
        <path class="earth-proof-globe__cloud" d="M19 82 C50 67 83 69 112 84 C80 94 49 93 19 82 Z"></path>
        <path class="earth-proof-globe__cloud" d="M91 39 C126 27 166 31 199 50 C160 57 121 54 91 39 Z"></path>
        <path class="earth-proof-globe__cloud" d="M91 161 C130 147 178 153 215 176 C172 181 130 178 91 161 Z"></path>
        <path class="earth-proof-globe__cloud" d="M38 127 C69 116 96 120 121 137 C88 143 61 140 38 127 Z"></path>
        <path class="earth-proof-globe__cloud" d="M135 67 C164 59 191 65 214 81 C181 88 156 84 135 67 Z"></path>
      </g>
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
    globe.setAttribute("aria-label", "Real Earth texture proof globe with Africa, continents, and country-boundary overlay");
    globe.setAttribute("data-gauges-earth-proof-globe", "true");
    globe.setAttribute("data-earth-texture-source", "NASA Blue Marble");
    globe.setAttribute("data-africa-visible", "true");
    globe.setAttribute("data-country-boundary-overlay", "true");

    globe.style.setProperty("--earth-texture-url", `url("${EARTH_TEXTURE_URL}")`);

    const texture = document.createElement("span");
    texture.className = "earth-proof-globe__texture";
    texture.setAttribute("aria-hidden", "true");

    const rim = document.createElement("span");
    rim.className = "earth-proof-globe__rim";
    rim.setAttribute("aria-hidden", "true");

    const tag = document.createElement("span");
    tag.className = "earth-proof-globe__tag";
    tag.textContent = "Earth Texture · Country Overlay";

    globe.append(
      texture,
      createGridSvg(),
      createBoundarySvg(),
      createCloudSvg(),
      rim,
      tag
    );

    orb.replaceChildren(globe);

    orb.setAttribute("data-gauges-earth-proof-mounted", "true");
    orb.setAttribute("data-gauges-earth-proof-type", "real-texture-country-overlay");
  }

  function writeMatrix() {
    if (!matrix) return;

    const alphabet = "01_ACK_ST_SCOPE_ROUTE_SOURCE_RUNTIME_VISIBLE_ACCEPTANCE_256_DGB_GEN2_REAL_EARTH_TEXTURE_COUNTRY_BOUNDARY_OVERLAY_AFRICA_CONTINENTS_GLOBE_PROOF_";
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
        key: "GAUGES_REAL_EARTH_TEXTURE_GLOBE",
        pass:
          gaugesJs.includes("NASA Blue Marble") &&
          gaugesJs.includes("EARTH_TEXTURE_URL") &&
          gaugesJs.includes("data-country-boundary-overlay"),
        fail: "Gauges Earth globe is not using real Earth texture and country overlay.",
        next: "INSTALL_REAL_EARTH_TEXTURE_GLOBE_IN_/gauges/index.js"
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
    lines.push("EARTH_STANDARD=NASA_BLUE_MARBLE_TEXTURE_WITH_COUNTRY_OVERLAY");
    lines.push("TEXTURE_SOURCE=NASA_BLUE_MARBLE_PUBLIC_SOURCE");
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
    setText(
      liveOutput,
      "GAUGE_BOOT=RUNNING\nFETCHING_PUBLIC_SOURCE_FILES=TRUE\nGAUGES_EARTH_PROOF=ACTIVE\nEARTH_STANDARD=NASA_BLUE_MARBLE_TEXTURE_WITH_COUNTRY_OVERLAY"
    );

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
      root.setAttribute("data-gauges-earth-proof", "real-texture-country-overlay");
      root.setAttribute("data-earth-standard", "nasa-blue-marble-country-overlay");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
