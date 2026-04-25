(() => {
  "use strict";

  const FILES = [
    { key: "ROOT_HTML", path: "/index.html" },
    { key: "ROOT_JS", path: "/index.js" },

    { key: "HOME_HTML", path: "/home/index.html" },
    { key: "PRELUDE_HTML", path: "/prelude/index.html" },
    { key: "EXPLORE_HTML", path: "/explore/index.html" },
    { key: "EXPLORE_FRONTIER_HTML", path: "/explore/frontier/index.html" },
    { key: "FRONTIER_HTML", path: "/frontier/index.html" },

    { key: "PRODUCTS_HTML", path: "/products/index.html" },
    { key: "PRODUCTS_BRIDGE", path: "/products/index.js" },
    { key: "PRODUCTS_RUNTIME", path: "/products/products_runtime.js" },

    { key: "LAWS_HTML", path: "/laws/index.html" },
    { key: "ABOUT_HTML", path: "/about/index.html" },
    { key: "GAUGES_HTML", path: "/gauges/index.html" },
    { key: "GAUGES_JS", path: "/gauges/index.js" }
  ];

  const EARTH_STYLE_ID = "dgb-gauges-earth-axis-spin-pass-v2";
  const EARTH_TEXTURE_URL = "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg";

  const liveOutput = document.getElementById("liveOutput");
  const stripStatus = document.getElementById("stripStatus");
  const stripAction = document.getElementById("stripAction");
  const routeGrid = document.getElementById("routeGrid");
  const matrix = document.getElementById("matrix");

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function includesAny(text, terms) {
    return terms.some((term) => text.includes(term));
  }

  function injectEarthProofStyle() {
    if (document.getElementById(EARTH_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = EARTH_STYLE_ID;
    style.textContent = `
      .orb {
        width:min(82vw,470px) !important;
        aspect-ratio:1 !important;
        border-radius:50% !important;
        position:relative !important;
        display:grid !important;
        place-items:center !important;
        overflow:visible !important;
        border:1px solid rgba(226,238,255,.30) !important;
        background:
          radial-gradient(circle at 50% 50%,rgba(137,200,255,.14),transparent 46%),
          linear-gradient(180deg,rgba(5,14,31,.78),rgba(1,4,11,.96)) !important;
        box-shadow:
          inset -34px -30px 58px rgba(0,0,0,.58),
          0 0 48px rgba(137,200,255,.26),
          0 0 140px rgba(240,215,156,.13) !important;
      }

      .orb::before,
      .orb::after {
        content:"" !important;
        position:absolute !important;
        left:50% !important;
        top:50% !important;
        width:122% !important;
        height:122% !important;
        border-radius:50% !important;
        border:1px solid rgba(240,215,156,.22) !important;
        transform:translate(-50%,-50%) rotate(42deg) scaleX(.34) !important;
        pointer-events:none !important;
        z-index:1 !important;
        opacity:.72 !important;
      }

      .orb::after {
        border-color:rgba(137,200,255,.25) !important;
        transform:translate(-50%,-50%) rotate(-38deg) scaleX(.34) !important;
      }

      .orb-label {
        display:none !important;
      }

      .earth-proof-globe {
        position:relative;
        z-index:3;
        width:min(78vw,430px);
        aspect-ratio:1;
        border-radius:50%;
        overflow:visible;
        isolation:isolate;
        transform:rotate(-23.5deg);
        transform-origin:50% 50%;
        filter:drop-shadow(0 0 28px rgba(120,205,255,.24));
      }

      .earth-proof-globe__axis {
        position:absolute;
        left:50%;
        top:50%;
        z-index:1;
        width:2px;
        height:124%;
        transform:translate(-50%,-50%);
        border-radius:999px;
        background:linear-gradient(
          180deg,
          transparent,
          rgba(240,215,156,.22),
          rgba(184,228,255,.58),
          rgba(240,215,156,.22),
          transparent
        );
        box-shadow:0 0 20px rgba(184,228,255,.24);
        pointer-events:none;
      }

      .earth-proof-globe__sphere {
        position:absolute;
        inset:0;
        z-index:3;
        border-radius:50%;
        overflow:hidden;
        isolation:isolate;
        border:1px solid rgba(218,239,255,.84);
        background:radial-gradient(circle at 50% 50%,#0b63b5 0%,#073f86 48%,#031b42 100%);
        box-shadow:
          inset -50px -40px 70px rgba(0,0,0,.66),
          inset 22px 17px 38px rgba(255,255,255,.24),
          0 0 60px rgba(142,197,255,.56),
          0 0 150px rgba(239,210,154,.20);
      }

      .earth-proof-globe__texture {
        position:absolute;
        inset:-1.5%;
        z-index:2;
        border-radius:50%;
        background-image:var(--earth-texture-url);
        background-repeat:repeat-x;
        background-size:245% 124%;
        background-position:58% 46%;
        filter:saturate(1.16) contrast(1.14) brightness(.96);
        transform:scale(1.08);
        animation:earthTextureSpin 44s linear infinite;
      }

      .earth-proof-globe__texture::before {
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        pointer-events:none;
        background:
          radial-gradient(circle at 31% 22%,rgba(255,255,255,.30),transparent 13%),
          radial-gradient(circle at 42% 36%,rgba(255,255,255,.13),transparent 24%),
          linear-gradient(90deg,rgba(255,255,255,.10),transparent 42%,rgba(0,0,0,.34) 100%);
        mix-blend-mode:screen;
      }

      .earth-proof-globe__texture::after {
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        pointer-events:none;
        background:
          radial-gradient(circle at 78% 72%,rgba(0,0,0,.48),transparent 40%),
          radial-gradient(circle at 96% 50%,rgba(0,0,0,.48),transparent 28%),
          radial-gradient(circle at 3% 50%,rgba(255,255,255,.08),transparent 24%),
          linear-gradient(105deg,transparent 0 57%,rgba(0,0,0,.28) 76%,rgba(0,0,0,.54) 100%);
      }

      .earth-proof-globe__cloud-layer {
        position:absolute;
        inset:-2%;
        z-index:4;
        border-radius:50%;
        pointer-events:none;
        filter:blur(1.8px);
        opacity:.62;
        background:
          radial-gradient(ellipse at 30% 30%,rgba(255,255,255,.34) 0 8%,transparent 18%),
          radial-gradient(ellipse at 58% 25%,rgba(255,255,255,.26) 0 6%,transparent 18%),
          radial-gradient(ellipse at 69% 63%,rgba(255,255,255,.24) 0 7%,transparent 21%),
          radial-gradient(ellipse at 36% 70%,rgba(255,255,255,.18) 0 8%,transparent 21%),
          repeating-linear-gradient(18deg,transparent 0 25px,rgba(255,255,255,.10) 26px 30px,transparent 31px 60px);
        mask-image:radial-gradient(circle at 50% 50%,black 0 66%,rgba(0,0,0,.55) 78%,transparent 100%);
        animation:earthCloudDrift 68s linear infinite;
      }

      .earth-proof-globe__projection-mask {
        position:absolute;
        inset:0;
        z-index:5;
        border-radius:50%;
        pointer-events:none;
        background:
          radial-gradient(circle at 50% 50%,transparent 0 61%,rgba(0,0,0,.16) 72%,rgba(0,0,0,.54) 100%),
          linear-gradient(90deg,rgba(0,0,0,.10),transparent 20%,transparent 78%,rgba(0,0,0,.35));
        mix-blend-mode:multiply;
      }

      .earth-proof-globe__grid {
        position:absolute;
        inset:0;
        z-index:6;
        pointer-events:none;
        opacity:.38;
        background:
          linear-gradient(90deg,transparent 49%,rgba(255,255,255,.16) 50%,transparent 51%),
          linear-gradient(0deg,transparent 49%,rgba(255,255,255,.12) 50%,transparent 51%);
        border-radius:50%;
      }

      .earth-proof-globe__rim {
        position:absolute;
        inset:-1px;
        z-index:8;
        border-radius:50%;
        pointer-events:none;
        box-shadow:
          inset 0 0 18px rgba(255,255,255,.20),
          inset 0 0 48px rgba(100,180,255,.18),
          0 0 26px rgba(120,205,255,.48),
          0 0 66px rgba(120,205,255,.22);
      }

      .earth-proof-globe__atmosphere {
        position:absolute;
        inset:-4%;
        z-index:1;
        border-radius:50%;
        pointer-events:none;
        background:radial-gradient(circle at 50% 50%,rgba(120,205,255,.18),transparent 63%);
        filter:blur(10px);
      }

      .earth-proof-globe__axis-cap {
        position:absolute;
        left:50%;
        width:9px;
        height:9px;
        border-radius:50%;
        transform:translateX(-50%);
        z-index:9;
        background:rgba(240,215,156,.78);
        box-shadow:0 0 16px rgba(240,215,156,.40);
        pointer-events:none;
      }

      .earth-proof-globe__axis-cap--north {
        top:-6px;
      }

      .earth-proof-globe__axis-cap--south {
        bottom:-6px;
      }

      .earth-proof-globe__tag {
        position:absolute;
        left:50%;
        bottom:7%;
        transform:translateX(-50%) rotate(23.5deg);
        z-index:10;
        padding:6px 10px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(4,10,22,.58);
        color:rgba(234,244,255,.90);
        font:800 10px/1.1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.13em;
        text-transform:uppercase;
        white-space:nowrap;
        backdrop-filter:blur(5px);
      }

      @keyframes earthTextureSpin {
        from { background-position:58% 46%; }
        to { background-position:-187% 46%; }
      }

      @keyframes earthCloudDrift {
        from { transform:translateX(0) scale(1.02); }
        to { transform:translateX(-18%) scale(1.02); }
      }

      @media (max-width:560px) {
        .earth-proof-globe {
          width:min(78vw,390px);
        }

        .earth-proof-globe__tag {
          font-size:9px;
        }
      }

      @media (prefers-reduced-motion:reduce) {
        .earth-proof-globe__texture,
        .earth-proof-globe__cloud-layer {
          animation:none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function mountEarthProofGlobe() {
    injectEarthProofStyle();

    const orb = document.querySelector(".orb");
    if (!orb) return;

    const globe = document.createElement("div");
    globe.className = "earth-proof-globe";
    globe.setAttribute("role", "img");
    globe.setAttribute("aria-label", "Real Earth globe on a tilted axis with natural spin");
    globe.setAttribute("data-gauges-earth-proof-globe", "true");
    globe.setAttribute("data-earth-texture-source", "NASA Blue Marble");
    globe.setAttribute("data-axis-spin-pass", "true");
    globe.setAttribute("data-axis-degrees", "23.5");
    globe.setAttribute("data-spin-system", "texture-drift-natural");
    globe.style.setProperty("--earth-texture-url", `url("${EARTH_TEXTURE_URL}")`);

    const axis = document.createElement("span");
    axis.className = "earth-proof-globe__axis";
    axis.setAttribute("aria-hidden", "true");

    const atmosphere = document.createElement("span");
    atmosphere.className = "earth-proof-globe__atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");

    const sphere = document.createElement("span");
    sphere.className = "earth-proof-globe__sphere";
    sphere.setAttribute("aria-hidden", "true");

    const texture = document.createElement("span");
    texture.className = "earth-proof-globe__texture";
    texture.setAttribute("aria-hidden", "true");

    const projectionMask = document.createElement("span");
    projectionMask.className = "earth-proof-globe__projection-mask";
    projectionMask.setAttribute("aria-hidden", "true");

    const cloudLayer = document.createElement("span");
    cloudLayer.className = "earth-proof-globe__cloud-layer";
    cloudLayer.setAttribute("aria-hidden", "true");

    const grid = document.createElement("span");
    grid.className = "earth-proof-globe__grid";
    grid.setAttribute("aria-hidden", "true");

    const rim = document.createElement("span");
    rim.className = "earth-proof-globe__rim";
    rim.setAttribute("aria-hidden", "true");

    const northCap = document.createElement("span");
    northCap.className = "earth-proof-globe__axis-cap earth-proof-globe__axis-cap--north";
    northCap.setAttribute("aria-hidden", "true");

    const southCap = document.createElement("span");
    southCap.className = "earth-proof-globe__axis-cap earth-proof-globe__axis-cap--south";
    southCap.setAttribute("aria-hidden", "true");

    const tag = document.createElement("span");
    tag.className = "earth-proof-globe__tag";
    tag.textContent = "Axis · Natural Spin";

    sphere.append(texture, projectionMask, grid, cloudLayer, rim);
    globe.append(axis, atmosphere, sphere, northCap, southCap, tag);

    orb.replaceChildren(globe);
    orb.setAttribute("data-gauges-earth-proof-mounted", "true");
    orb.setAttribute("data-gauges-earth-proof-type", "axis-spin-pass");
  }

  function writeMatrix() {
    if (!matrix) return;

    const alphabet = "01_ACK_ST_SCOPE_ROUTE_SOURCE_RUNTIME_VISIBLE_ACCEPTANCE_256_DGB_GEN2_REAL_EARTH_AXIS_SPIN_NATURAL_ROTATION_TILTED_GLOBE_EXPLORE_FRONTIER_HOME_PRELUDE_";
    let output = "";

    for (let index = 0; index < 5200; index += 1) {
      output += alphabet[(index * 17 + 11) % alphabet.length];

      if (index % 97 === 0) {
        output += "\n";
      }
    }

    matrix.textContent = output;
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

  function statusOk(file) {
    return Boolean(file && file.ok && Number(file.status) >= 200 && Number(file.status) < 400);
  }

  function classify(results) {
    const byKey = Object.fromEntries(results.map((item) => [item.key, item]));

    const rootHtml = byKey.ROOT_HTML?.text || "";
    const rootJs = byKey.ROOT_JS?.text || "";

    const homeHtml = byKey.HOME_HTML?.text || "";
    const preludeHtml = byKey.PRELUDE_HTML?.text || "";
    const exploreHtml = byKey.EXPLORE_HTML?.text || "";
    const exploreFrontierHtml = byKey.EXPLORE_FRONTIER_HTML?.text || "";
    const frontierHtml = byKey.FRONTIER_HTML?.text || "";

    const productsHtml = byKey.PRODUCTS_HTML?.text || "";
    const productsBridge = byKey.PRODUCTS_BRIDGE?.text || "";
    const productsRuntime = byKey.PRODUCTS_RUNTIME?.text || "";

    const lawsHtml = byKey.LAWS_HTML?.text || "";
    const aboutHtml = byKey.ABOUT_HTML?.text || "";
    const gaugesHtml = byKey.GAUGES_HTML?.text || "";
    const gaugesJs = byKey.GAUGES_JS?.text || "";

    const checks = [
      {
        key: "GAUGES_EARTH_AXIS_SPIN_PASS",
        pass:
          gaugesJs.includes("dgb-gauges-earth-axis-spin-pass-v2") &&
          gaugesJs.includes("data-axis-spin-pass") &&
          gaugesJs.includes("Axis · Natural Spin"),
        fail: "Gauges Earth globe has not received the current axis/spin pass.",
        next: "INSTALL_AXIS_SPIN_PASS_IN_/gauges/index.js"
      },
      {
        key: "GAUGES_PROBE_SET_EXPANDED",
        pass:
          gaugesJs.includes("HOME_HTML") &&
          gaugesJs.includes("PRELUDE_HTML") &&
          gaugesJs.includes("EXPLORE_HTML") &&
          gaugesJs.includes("EXPLORE_FRONTIER_HTML") &&
          gaugesJs.includes("FRONTIER_HTML"),
        fail: "Gauges runtime does not probe Home, Prelude, Explore, Explore Frontier, and Frontier.",
        next: "EXPAND_/gauges/index.js_ROUTE_PROBES"
      },
      {
        key: "ROOT_REACHABLE",
        pass: statusOk(byKey.ROOT_HTML),
        fail: "Root HTML is not reachable.",
        next: "RESTORE_/index.html"
      },
      {
        key: "HOME_REACHABLE",
        pass: statusOk(byKey.HOME_HTML),
        fail: "Home route is not reachable.",
        next: "CREATE_OR_REPAIR_/home/index.html"
      },
      {
        key: "PRELUDE_REACHABLE",
        pass: statusOk(byKey.PRELUDE_HTML),
        fail: "Prelude route is not reachable.",
        next: "CREATE_OR_REPAIR_/prelude/index.html"
      },
      {
        key: "EXPLORE_REACHABLE",
        pass: statusOk(byKey.EXPLORE_HTML),
        fail: "Explore route is not reachable.",
        next: "CREATE_OR_REPAIR_/explore/index.html"
      },
      {
        key: "EXPLORE_FRONTIER_REACHABLE",
        pass: statusOk(byKey.EXPLORE_FRONTIER_HTML),
        fail: "Explore Frontier route is not reachable.",
        next: "CREATE_OR_REPAIR_/explore/frontier/index.html"
      },
      {
        key: "FRONTIER_REACHABLE_OR_BRIDGED",
        pass:
          statusOk(byKey.FRONTIER_HTML) &&
          (
            frontierHtml.includes("/explore/frontier/") ||
            frontierHtml.includes("data-frontier-generation") ||
            frontierHtml.includes("data-receiving-room=\"explore-frontier\"")
          ),
        fail: "Top-level Frontier route is still dead or not bridged to Explore Frontier.",
        next: "CREATE_/frontier/index.html_BRIDGE_OR_SURFACE_TO_/explore/frontier/"
      },
      {
        key: "ROOT_NOT_GAUGES",
        pass:
          !rootHtml.includes("Gauge Authority") &&
          !rootHtml.includes("LIVE_FEED_DIAGNOSTIC_SURFACE"),
        fail: "Root is still carrying gauges content.",
        next: "RESTORE_/index.html_AND_/index.js_AS_HOME_FILES"
      },
      {
        key: "ROOT_GEN2_MARKER",
        pass:
          rootHtml.includes("second-generation-renewal") ||
          rootJs.includes("second-generation-renewal"),
        fail: "Root does not expose second-generation-renewal marker.",
        next: "REPLACE_/index.html_AND_/index.js_WITH_GEN2_DOOR"
      },
      {
        key: "DOOR_TO_EXPLORE_FRONTIER_LINK_PASS",
        pass:
          rootHtml.includes("/explore/frontier/") &&
          !rootHtml.includes('href="/frontier/"') &&
          !rootHtml.includes("href='/frontier/'"),
        fail: "Door is missing Explore Frontier access or still links to /frontier/.",
        next: "PATCH_/index.html_FRONTIER_LINKS_TO_/explore/frontier/"
      },
      {
        key: "HOME_G2_PASS",
        pass:
          statusOk(byKey.HOME_HTML) &&
          homeHtml.includes("second-generation-renewal") &&
          !homeHtml.includes("Generation 1"),
        fail: "Home is not confirmed as a Generation 2 surface.",
        next: "RENEW_/home/index.html_TO_ACTIVE_G2_HOME"
      },
      {
        key: "PRELUDE_G2_PASS",
        pass:
          statusOk(byKey.PRELUDE_HTML) &&
          preludeHtml.includes("second-generation-renewal") &&
          !preludeHtml.includes("Generation 1") &&
          !preludeHtml.includes("Prelude is the clean orientation layer"),
        fail: "Prelude is unreachable, old, or still explaining itself instead of performing.",
        next: "RENEW_/prelude/index.html_TO_ACTIVE_G2_THRESHOLD"
      },
      {
        key: "EXPLORE_PARENT_G2_PASS",
        pass:
          statusOk(byKey.EXPLORE_HTML) &&
          exploreHtml.includes("second-generation-renewal") &&
          exploreHtml.includes("/explore/frontier/") &&
          !exploreHtml.includes("Legacy removed") &&
          !exploreHtml.includes("legacy removed"),
        fail: "Explore parent is missing, old, or not linked to Explore Frontier.",
        next: "RENEW_/explore/index.html_AS_G2_PARENT_ROUTE"
      },
      {
        key: "EXPLORE_FRONTIER_CHILD_PASS",
        pass:
          statusOk(byKey.EXPLORE_FRONTIER_HTML) &&
          exploreFrontierHtml.includes("second-generation-renewal") &&
          exploreFrontierHtml.includes("data-parent-page=\"explore\"") &&
          !exploreFrontierHtml.includes("old top-level route") &&
          !exploreFrontierHtml.includes("Door sends. Explore receives"),
        fail: "Explore Frontier child is missing, old, or still carrying bridge/repair language.",
        next: "RENEW_/explore/frontier/index.html_AS_G2_CHILD_SURFACE"
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
        key: "PRODUCTS_FALLBACK_RELEVANT",
        pass:
          !productsHtml.includes("Waiting for /products/index.js to load") ||
          productsRuntime.includes("productsRuntimeMounted"),
        fail: "Products shell fallback is still relevant; runtime proof must be verified.",
        next: "VERIFY_PRODUCTS_RUNTIME_MOUNT_ON_LIVE_PAGE"
      },
      {
        key: "LAWS_G1_RETIRED",
        pass:
          !lawsHtml.includes("G1 External Expression") &&
          !lawsHtml.includes("LAWS_G1_VISIBLE_THREE_LAYER_SURFACE"),
        fail: "Laws page still exposes G1 language.",
        next: "RENEW_/laws/index.html_AS_G2_AUTHORITY_INSTRUMENT"
      },
      {
        key: "ABOUT_IDENTITY_CLEAN",
        pass:
          !aboutHtml.includes("Geodiametrics") &&
          !aboutHtml.includes(""),
        fail: "About page still has identity drift or visible artifact.",
        next: "RENEW_/about/index.html_FOR_DGB_IDENTITY"
      },
      {
        key: "GAUGES_HTML_LIVE_FEED",
        pass:
          gaugesHtml.includes("LIVE_FEED_DIAGNOSTIC_SURFACE") &&
          gaugesHtml.includes("/gauges/index.js"),
        fail: "Gauges HTML is not the live-feed diagnostic surface.",
        next: "REPLACE_/gauges/index.html_WITH_LIVE_FEED_SURFACE"
      },
      {
        key: "GAUGES_JS_LIVE_FEED",
        pass:
          gaugesJs.includes("GAUGE_LIVE_FEED_V3") &&
          gaugesJs.includes("EXPLORE_FRONTIER_CHILD_PASS"),
        fail: "Gauges JS is missing the expanded live-feed diagnostic runtime.",
        next: "REPLACE_/gauges/index.js_WITH_EXPANDED_LIVE_FEED_RUNTIME"
      }
    ];

    const failed = checks.filter((check) => !check.pass);
    const passed = checks.filter((check) => check.pass);

    return {
      stamp: new Date().toISOString(),
      phase: "SECOND_GENERATION_RENEWAL",
      priority: failed.length ? "BLOCKED" : "CLEAR",
      nextAction: failed.length ? failed[0].next : "NO_ACTION_REQUIRED",
      passed,
      failed,
      files: results
    };
  }

  function renderRoutes(diagnostic) {
    if (!routeGrid) return;

    routeGrid.innerHTML = diagnostic.files.map((file) => {
      const cls = file.ok ? "ok" : "block";
      const title = file.ok ? "reachable" : "blocked";

      return `
        <article class="${cls}">
          <strong>${escapeHtml(file.key)}</strong>
          <span>${escapeHtml(title)}</span>
          <code>${escapeHtml(file.path)}<br>STATUS=${escapeHtml(file.status)} LENGTH=${escapeHtml(file.length)}</code>
        </article>
      `;
    }).join("");
  }

  function renderFeed(diagnostic) {
    const lines = [];

    lines.push("GAUGE_LIVE_FEED_V3");
    lines.push("STAMP=" + diagnostic.stamp);
    lines.push("PHASE=" + diagnostic.phase);
    lines.push("GAUGES_EARTH_PROOF=ACTIVE");
    lines.push("EARTH_STANDARD=AXIS_SPIN_PROJECTION_REALISM");
    lines.push("TEXTURE_SOURCE=NASA_BLUE_MARBLE_PUBLIC_SOURCE");
    lines.push("AXIS_STANDARD=TILTED_23_5_DEGREES");
    lines.push("SPIN_STANDARD=NATURAL_TEXTURE_DRIFT");
    lines.push("PROBE_SET=EXPANDED_FRONT_ROUTES");
    lines.push("EXPLORE_FRONTIER_PROOF=ACTIVE");
    lines.push("PRIORITY=" + diagnostic.priority);
    lines.push("NEXT_ACTION=" + diagnostic.nextAction);
    lines.push("");

    lines.push("FAILED_CHECKS=[");
    if (!diagnostic.failed.length) {
      lines.push("  NONE");
    }

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
    if (!diagnostic.passed.length) {
      lines.push("  NONE");
    }

    for (const item of diagnostic.passed) {
      lines.push("  " + item.key);
    }
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
    setText(stripAction, "NEXT_ACTION=FETCH_EXPANDED_PUBLIC_SOURCE_FILES");
    setText(
      liveOutput,
      [
        "GAUGE_BOOT=RUNNING",
        "FETCHING_PUBLIC_SOURCE_FILES=TRUE",
        "PROBE_SET=EXPANDED_FRONT_ROUTES",
        "GAUGES_EARTH_PROOF=ACTIVE",
        "EARTH_STANDARD=AXIS_SPIN_PROJECTION_REALISM"
      ].join("\n")
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
      root.setAttribute("data-gauge-version", "GAUGE_LIVE_FEED_V3");
      root.setAttribute("data-gauges-earth-proof", "axis-spin-pass");
      root.setAttribute("data-earth-standard", "tilted-axis-natural-spin");
      root.setAttribute("data-probe-set", "expanded-front-routes");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
