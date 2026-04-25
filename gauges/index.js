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

  const EARTH_STYLE_ID = "dgb-gauges-earth-projection-realism-pass-v1";

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
        border: 1px solid rgba(240,215,156,.22) !important;
        transform: translate(-50%,-50%) rotate(42deg) scaleX(.34) !important;
        pointer-events: none !important;
        z-index: 1 !important;
        opacity: .72 !important;
      }

      .orb::after {
        border-color: rgba(137,200,255,.25) !important;
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
        border: 1px solid rgba(218,239,255,.84);
        background:
          radial-gradient(circle at 50% 50%, #0b63b5 0%, #073f86 48%, #031b42 100%);
        box-shadow:
          inset -50px -40px 70px rgba(0,0,0,.66),
          inset 22px 17px 38px rgba(255,255,255,.24),
          0 0 60px rgba(142,197,255,.56),
          0 0 150px rgba(239,210,154,.20);
      }

      .earth-proof-globe__texture {
        position: absolute;
        inset: -1.5%;
        z-index: 2;
        border-radius: 50%;
        background-image: var(--earth-texture-url);
        background-repeat: no-repeat;
        background-size: 245% 124%;
        background-position: 58% 46%;
        filter: saturate(1.16) contrast(1.14) brightness(.96);
        transform: scale(1.08);
      }

      .earth-proof-globe__texture::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background:
          radial-gradient(circle at 31% 22%, rgba(255,255,255,.30), transparent 13%),
          radial-gradient(circle at 42% 36%, rgba(255,255,255,.13), transparent 24%),
          linear-gradient(90deg, rgba(255,255,255,.10), transparent 42%, rgba(0,0,0,.34) 100%);
        mix-blend-mode: screen;
      }

      .earth-proof-globe__texture::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background:
          radial-gradient(circle at 78% 72%, rgba(0,0,0,.48), transparent 40%),
          radial-gradient(circle at 96% 50%, rgba(0,0,0,.48), transparent 28%),
          radial-gradient(circle at 3% 50%, rgba(255,255,255,.08), transparent 24%),
          linear-gradient(105deg, transparent 0 57%, rgba(0,0,0,.28) 76%, rgba(0,0,0,.54) 100%);
      }

      .earth-proof-globe__projection-mask {
        position: absolute;
        inset: 0;
        z-index: 3;
        border-radius: 50%;
        pointer-events: none;
        background:
          radial-gradient(circle at 50% 50%, transparent 0 61%, rgba(0,0,0,.16) 72%, rgba(0,0,0,.54) 100%),
          linear-gradient(90deg, rgba(0,0,0,.10), transparent 20%, transparent 78%, rgba(0,0,0,.35));
        mix-blend-mode: multiply;
      }

      .earth-proof-globe__cloud-layer {
        position: absolute;
        inset: -2%;
        z-index: 4;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(1.8px);
        opacity: .62;
        background:
          radial-gradient(ellipse at 30% 30%, rgba(255,255,255,.34) 0 8%, transparent 18%),
          radial-gradient(ellipse at 58% 25%, rgba(255,255,255,.26) 0 6%, transparent 18%),
          radial-gradient(ellipse at 69% 63%, rgba(255,255,255,.24) 0 7%, transparent 21%),
          radial-gradient(ellipse at 36% 70%, rgba(255,255,255,.18) 0 8%, transparent 21%),
          repeating-linear-gradient(18deg, transparent 0 25px, rgba(255,255,255,.10) 26px 30px, transparent 31px 60px);
        mask-image: radial-gradient(circle at 50% 50%, black 0 66%, rgba(0,0,0,.55) 78%, transparent 100%);
      }

      .earth-proof-globe__cloud-layer::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          linear-gradient(15deg, transparent 0 24%, rgba(255,255,255,.16) 28%, transparent 36%),
          linear-gradient(-12deg, transparent 0 46%, rgba(255,255,255,.13) 50%, transparent 59%),
          linear-gradient(22deg, transparent 0 66%, rgba(255,255,255,.12) 70%, transparent 78%);
        opacity: .84;
      }

      .earth-proof-globe__cloud-layer::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          radial-gradient(ellipse at 43% 48%, rgba(255,255,255,.18) 0 7%, transparent 18%),
          radial-gradient(ellipse at 66% 42%, rgba(255,255,255,.14) 0 8%, transparent 20%),
          radial-gradient(ellipse at 25% 58%, rgba(255,255,255,.12) 0 9%, transparent 22%);
        opacity: .78;
      }

      .earth-proof-globe__grid {
        position: absolute;
        inset: 0;
        z-index: 5;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
        opacity: .48;
      }

      .earth-proof-globe__grid-line {
        fill: none;
        stroke: rgba(255,255,255,.14);
        stroke-width: .58;
      }

      .earth-proof-globe__boundary-layer {
        position: absolute;
        inset: 0;
        z-index: 6;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
        opacity: .34;
        filter: blur(.18px);
      }

      .earth-proof-globe__coast-line {
        fill: none;
        stroke: rgba(255,255,255,.44);
        stroke-width: .72;
        vector-effect: non-scaling-stroke;
      }

      .earth-proof-globe__country-line {
        fill: none;
        stroke: rgba(245,242,220,.28);
        stroke-width: .42;
        vector-effect: non-scaling-stroke;
      }

      .earth-proof-globe__rim {
        position: absolute;
        inset: -1px;
        z-index: 8;
        border-radius: 50%;
        pointer-events: none;
        box-shadow:
          inset 0 0 18px rgba(255,255,255,.20),
          inset 0 0 48px rgba(100,180,255,.18),
          0 0 26px rgba(120,205,255,.48),
          0 0 66px rgba(120,205,255,.22);
      }

      .earth-proof-globe__atmosphere {
        position: absolute;
        inset: -4%;
        z-index: 1;
        border-radius: 50%;
        pointer-events: none;
        background:
          radial-gradient(circle at 50% 50%, rgba(120,205,255,.18), transparent 63%);
        filter: blur(10px);
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
        <clipPath id="earthProjectionGridClipDgbV1">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>

      <g clip-path="url(#earthProjectionGridClipDgbV1)">
        <path class="earth-proof-globe__grid-line" d="M12 120 H228"></path>
        <path class="earth-proof-globe__grid-line" d="M120 12 V228"></path>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="108" ry="34"></ellipse>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="108" ry="66"></ellipse>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="82" ry="108"></ellipse>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="45" ry="108"></ellipse>
        <ellipse class="earth-proof-globe__grid-line" cx="120" cy="120" rx="18" ry="108"></ellipse>
      </g>
    `;

    return svg;
  }

  function createBoundarySvg() {
    const svg = createSvgElement("earth-proof-globe__boundary-layer");

    svg.innerHTML = `
      <defs>
        <clipPath id="earthProjectionBoundaryClipDgbV1">
          <circle cx="120" cy="120" r="107"></circle>
        </clipPath>
      </defs>

      <g clip-path="url(#earthProjectionBoundaryClipDgbV1)">
        <path class="earth-proof-globe__coast-line" d="M40 72 C56 54 83 49 106 56 C127 63 135 78 149 87 C163 96 180 97 198 110 C214 123 221 143 218 163"></path>
        <path class="earth-proof-globe__coast-line" d="M74 123 C88 109 104 106 118 114 C134 123 143 140 145 158 C147 180 135 198 120 204 C104 195 91 180 84 158 C80 144 78 132 74 123 Z"></path>
        <path class="earth-proof-globe__coast-line" d="M120 80 C138 64 168 62 195 75 C217 86 229 104 234 124"></path>
        <path class="earth-proof-globe__coast-line" d="M159 157 C180 152 204 162 216 181 C201 206 173 213 149 193"></path>
        <path class="earth-proof-globe__coast-line" d="M23 94 C45 84 64 87 78 102"></path>
        <path class="earth-proof-globe__coast-line" d="M45 182 C67 199 96 208 124 207"></path>

        <path class="earth-proof-globe__country-line" d="M99 113 C112 120 127 121 143 116"></path>
        <path class="earth-proof-globe__country-line" d="M92 133 C108 137 124 137 144 133"></path>
        <path class="earth-proof-globe__country-line" d="M92 151 C109 154 128 153 147 148"></path>
        <path class="earth-proof-globe__country-line" d="M100 172 C116 173 132 170 145 164"></path>
        <path class="earth-proof-globe__country-line" d="M113 110 C111 130 110 152 113 183"></path>
        <path class="earth-proof-globe__country-line" d="M128 112 C126 132 127 153 134 176"></path>
        <path class="earth-proof-globe__country-line" d="M143 119 C142 139 144 155 153 169"></path>

        <path class="earth-proof-globe__country-line" d="M82 69 C96 75 111 77 126 73"></path>
        <path class="earth-proof-globe__country-line" d="M91 83 C105 89 119 90 135 84"></path>
        <path class="earth-proof-globe__country-line" d="M105 60 C106 74 106 87 103 99"></path>
        <path class="earth-proof-globe__country-line" d="M121 62 C120 76 122 89 129 100"></path>

        <path class="earth-proof-globe__country-line" d="M142 82 C161 89 181 90 202 84"></path>
        <path class="earth-proof-globe__country-line" d="M151 101 C171 106 193 107 214 100"></path>
        <path class="earth-proof-globe__country-line" d="M164 119 C183 123 203 124 222 118"></path>
        <path class="earth-proof-globe__country-line" d="M160 83 C158 103 159 124 166 145"></path>
        <path class="earth-proof-globe__country-line" d="M184 86 C181 108 181 130 187 151"></path>
        <path class="earth-proof-globe__country-line" d="M206 96 C203 118 204 139 213 158"></path>

        <path class="earth-proof-globe__country-line" d="M139 96 C150 106 157 118 158 134"></path>
        <path class="earth-proof-globe__country-line" d="M151 138 C162 151 174 160 189 165"></path>
        <path class="earth-proof-globe__country-line" d="M184 153 C198 161 211 169 223 182"></path>
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
    globe.setAttribute("aria-label", "Real Earth projection proof globe with natural clouds, wrapped continents, and subtle country overlay");
    globe.setAttribute("data-gauges-earth-proof-globe", "true");
    globe.setAttribute("data-earth-texture-source", "NASA Blue Marble");
    globe.setAttribute("data-projection-realism-pass", "true");
    globe.setAttribute("data-cloud-layer", "soft-atmospheric");
    globe.setAttribute("data-continent-wrap", "texture-primary");

    globe.style.setProperty("--earth-texture-url", `url("${EARTH_TEXTURE_URL}")`);

    const atmosphere = document.createElement("span");
    atmosphere.className = "earth-proof-globe__atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");

    const texture = document.createElement("span");
    texture.className = "earth-proof-globe__texture";
    texture.setAttribute("aria-hidden", "true");

    const projectionMask = document.createElement("span");
    projectionMask.className = "earth-proof-globe__projection-mask";
    projectionMask.setAttribute("aria-hidden", "true");

    const cloudLayer = document.createElement("span");
    cloudLayer.className = "earth-proof-globe__cloud-layer";
    cloudLayer.setAttribute("aria-hidden", "true");

    const rim = document.createElement("span");
    rim.className = "earth-proof-globe__rim";
    rim.setAttribute("aria-hidden", "true");

    const tag = document.createElement("span");
    tag.className = "earth-proof-globe__tag";
    tag.textContent = "Earth Projection · Texture Primary";

    globe.append(
      atmosphere,
      texture,
      projectionMask,
      createGridSvg(),
      createBoundarySvg(),
      cloudLayer,
      rim,
      tag
    );

    orb.replaceChildren(globe);

    orb.setAttribute("data-gauges-earth-proof-mounted", "true");
    orb.setAttribute("data-gauges-earth-proof-type", "projection-realism-pass");
  }

  function writeMatrix() {
    if (!matrix) return;

    const alphabet = "01_ACK_ST_SCOPE_ROUTE_SOURCE_RUNTIME_VISIBLE_ACCEPTANCE_256_DGB_GEN2_REAL_EARTH_TEXTURE_PROJECTION_REALISM_NATURAL_CLOUDS_CONTINENT_WRAP_";
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
        key: "GAUGES_EARTH_PROJECTION_REALISM_PASS",
        pass:
          gaugesJs.includes("dgb-gauges-earth-projection-realism-pass-v1") &&
          gaugesJs.includes("data-projection-realism-pass") &&
          gaugesJs.includes("Earth Projection · Texture Primary"),
        fail: "Gauges Earth globe has not received the projection realism pass.",
        next: "INSTALL_PROJECTION_REALISM_PASS_IN_/gauges/index.js"
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
    lines.push("EARTH_STANDARD=PROJECTION_REALISM_TEXTURE_PRIMARY");
    lines.push("TEXTURE_SOURCE=NASA_BLUE_MARBLE_PUBLIC_SOURCE");
    lines.push("CLOUD_STANDARD=SOFT_ATMOSPHERIC_BANDS");
    lines.push("CONTINENT_STANDARD=TEXTURE_WRAP_PRIMARY");
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
      "GAUGE_BOOT=RUNNING\nFETCHING_PUBLIC_SOURCE_FILES=TRUE\nGAUGES_EARTH_PROOF=ACTIVE\nEARTH_STANDARD=PROJECTION_REALISM_TEXTURE_PRIMARY"
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
      root.setAttribute("data-gauges-earth-proof", "projection-realism-pass");
      root.setAttribute("data-earth-standard", "texture-primary-soft-clouds-continent-wrap");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
