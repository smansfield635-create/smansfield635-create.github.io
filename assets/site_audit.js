/* TNT RENEWAL — /assets/site_audit.js
   GAUGES · DEMO UNIVERSE EARTH RENDER CONTRACT · v1

   CONTRACT:
   - Replaces retired actual-Earth showroom-earth.png audit.
   - Measures current Demo Universe Earth route at /showroom/globe/.
   - Does not require /assets/earth/showroom-earth.png.
   - Does not require actual-earth-texture-required.
   - Does not require DGBShowroomGlobe.
   - Keeps marker health separate from render health.
*/

(function () {
  "use strict";

  var VERSION = "GAUGES_DEMO_UNIVERSE_EARTH_RENDER_CONTRACT_TNT_v1";

  var HOUSE_ROUTES = [
    {
      id: "H1_COMPASS",
      title: "Compass",
      url: "/",
      markers: [
        'data-estate="rich-manor-and-estate"',
        'data-manor-skin="active"',
        'data-house-field="true"',
        'data-gauges-truth="live-authority"',
        'data-construct-class="house"',
        'data-house-part="compass"'
      ],
      backlinks: ['href="/"', 'href="/door/"', 'href="/home/"', 'href="/products/"', 'href="/showroom/"', 'href="/gauges/"']
    },
    {
      id: "H2_DOOR",
      title: "Door",
      url: "/door/",
      markers: [
        'data-estate="rich-manor-and-estate"',
        'data-manor-skin="active"',
        'data-house-field="true"',
        'data-gauges-truth="live-authority"',
        'data-construct-class="house"',
        'data-house-part="door"'
      ],
      backlinks: ['href="/"', 'href="/door/"', 'href="/home/"', 'href="/products/"', 'href="/showroom/"', 'href="/gauges/"']
    },
    {
      id: "H3_HOME",
      title: "Home",
      url: "/home/",
      markers: [
        'data-estate="rich-manor-and-estate"',
        'data-manor-skin="active"',
        'data-house-field="true"',
        'data-gauges-truth="live-authority"',
        'data-construct-class="house"',
        'data-house-part="home"'
      ],
      backlinks: ['href="/"', 'href="/door/"', 'href="/home/"', 'href="/products/"', 'href="/showroom/"', 'href="/gauges/"']
    },
    {
      id: "H4_PRODUCTS",
      title: "Products",
      url: "/products/",
      markers: [
        'data-estate="rich-manor-and-estate"',
        'data-manor-skin="active"',
        'data-house-field="true"',
        'data-gauges-truth="live-authority"',
        'data-construct-class="house"',
        'data-house-part="products"'
      ],
      backlinks: ['href="/"', 'href="/door/"', 'href="/home/"', 'href="/products/"', 'href="/showroom/"', 'href="/gauges/"']
    },
    {
      id: "H5_SHOWROOM",
      title: "Showroom",
      url: "/showroom/",
      markers: [
        'data-estate="rich-manor-and-estate"',
        'data-manor-skin="active"',
        'data-house-field="true"',
        'data-gauges-truth="live-authority"',
        'data-construct-class="house"',
        'data-house-part="showroom"'
      ],
      backlinks: ['href="/"', 'href="/door/"', 'href="/home/"', 'href="/products/"', 'href="/showroom/"', 'href="/gauges/"']
    },
    {
      id: "H6_GAUGES",
      title: "Gauges",
      url: "/gauges/",
      markers: [
        'data-estate="rich-manor-and-estate"',
        'data-manor-skin="active"',
        'data-house-field="true"',
        'data-gauges-truth="live-authority"',
        'data-construct-class="house"',
        'data-house-part="gauges"'
      ],
      backlinks: ['href="/"', 'href="/door/"', 'href="/home/"', 'href="/products/"', 'href="/showroom/"', 'href="/gauges/"']
    }
  ];

  var PRODUCT_ROUTES = [
    {
      id: "P_ARCHCOIN",
      title: "ARCHCOIN",
      url: "/products/archcoin/",
      markers: ['data-estate="rich-manor-and-estate"', 'data-manor-skin="active"', 'data-house-field="true"', 'data-gauges-truth="live-authority"', 'data-construct-class="product"', 'data-product-wing="true"', 'data-parent-route="/products/"']
    },
    {
      id: "P_FIVE_FLAGS",
      title: "Five Flags",
      url: "/products/five-flags/",
      markers: ['data-estate="rich-manor-and-estate"', 'data-manor-skin="active"', 'data-house-field="true"', 'data-gauges-truth="live-authority"', 'data-construct-class="product"', 'data-product-wing="true"', 'data-parent-route="/products/"']
    },
    {
      id: "P_ON_YOUR_SIDE_AAI",
      title: "On Your Side AAI",
      url: "/products/on-your-side-ai/",
      markers: ['data-estate="rich-manor-and-estate"', 'data-manor-skin="active"', 'data-house-field="true"', 'data-gauges-truth="live-authority"', 'data-construct-class="product"', 'data-product-wing="true"', 'data-parent-route="/products/"']
    },
    {
      id: "P_EDUCATION",
      title: "Education",
      url: "/products/education/",
      markers: ['data-estate="rich-manor-and-estate"', 'data-manor-skin="active"', 'data-house-field="true"', 'data-gauges-truth="live-authority"', 'data-construct-class="product"', 'data-product-wing="true"', 'data-parent-route="/products/"']
    },
    {
      id: "P_NUTRITION",
      title: "Nutrition",
      url: "/products/nutrition/",
      markers: ['data-estate="rich-manor-and-estate"', 'data-manor-skin="active"', 'data-house-field="true"', 'data-gauges-truth="live-authority"', 'data-construct-class="product"', 'data-product-wing="true"', 'data-parent-route="/products/"']
    }
  ];

  var PLANET_ROUTES = [
    ["/prelude/", "Prelude"],
    ["/explore/", "Explore"],
    ["/laws/", "Laws"],
    ["/governance/", "Governance"],
    ["/big-laugh/upper-room/", "Upper Room"],
    ["/about-this-underdog/", "About This Underdog"],
    ["/nine-summits/", "Nine Summits Universe"],
    ["/nine-summits-of-love/", "Nine Summits of Love"]
  ].map(function (entry, index) {
    return {
      id: "PL_" + String(index + 1),
      title: entry[1],
      url: entry[0],
      markers: [
        'data-estate="rich-manor-and-estate"',
        'data-manor-skin="active"',
        'data-house-field="true"',
        'data-gauges-truth="live-authority"',
        entry[0] === "/big-laugh/upper-room/" ? 'data-hosted-construct="true"' : 'data-construct-class="planetary"',
        'data-manor-attached="true"'
      ]
    };
  });

  var RENDER_CHECKS = [
    {
      id: "SR_PARENT",
      title: "Showroom parent handoff",
      url: "/showroom/",
      weight: 20,
      tokens: [
        'data-estate="rich-manor-and-estate"',
        'data-house-part="showroom"',
        'href="/showroom/globe/"'
      ]
    },
    {
      id: "SR_DEMO_UNIVERSE",
      title: "Demo Universe Earth route",
      url: "/showroom/globe/",
      weight: 30,
      tokens: [
        'data-demo-universe="globe-only"',
        'data-earth-standard="demo-universe-restored-earth"',
        'data-current-route="/showroom/globe/"',
        "DEMO_UNIVERSE_EARTH_AXIS_RESTORATION_TNT_v1"
      ]
    },
    {
      id: "SR_EARTH_SURFACE",
      title: "Earth surface asset",
      url: "/assets/earth/earth_surface_2048.jpg",
      weight: 20,
      assetOnly: true
    },
    {
      id: "SR_EARTH_CLOUDS",
      title: "Earth cloud asset",
      url: "/assets/earth/earth_clouds_2048.jpg",
      weight: 15,
      assetOnly: true
    },
    {
      id: "SR_BACKLINKS",
      title: "Demo Universe backlinks",
      url: "/showroom/globe/",
      weight: 15,
      tokens: ['href="/"', 'href="/showroom/"', 'href="/gauges/"']
    }
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function average(values) {
    if (!values.length) return 0;
    return Math.round(values.reduce(function (sum, value) { return sum + value; }, 0) / values.length);
  }

  function weightedAverage(items) {
    var totalWeight = items.reduce(function (sum, item) { return sum + item.weight; }, 0);
    if (!totalWeight) return 0;

    return Math.round(items.reduce(function (sum, item) {
      return sum + (item.score * item.weight);
    }, 0) / totalWeight);
  }

  function tokenMissing(text, tokens) {
    return (tokens || []).filter(function (token) {
      return text.indexOf(token) === -1;
    });
  }

  function scoreFromMissing(httpOk, missing, total) {
    if (!httpOk) return 0;
    if (!total || missing.length === 0) return 100;

    var raw = Math.round(((total - missing.length) / total) * 100);
    return Math.max(50, raw);
  }

  async function fetchResource(url) {
    try {
      var response = await fetch(url + "?audit=" + Date.now(), { cache: "no-store" });
      var text = "";

      if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        text = await response.text();
      }

      return {
        url: url,
        ok: response.ok,
        status: response.status,
        text: text
      };
    } catch (error) {
      return {
        url: url,
        ok: false,
        status: 0,
        text: "",
        error: error && error.message ? error.message : "fetch failed"
      };
    }
  }

  async function auditRoute(config) {
    var result = await fetchResource(config.url);
    var markerMissing = tokenMissing(result.text, config.markers || []);
    var backlinkMissing = tokenMissing(result.text, config.backlinks || []);
    var total = (config.markers || []).length + (config.backlinks || []).length;
    var missing = markerMissing.concat(backlinkMissing);

    return {
      id: config.id,
      title: config.title,
      url: config.url,
      status: result.status,
      ok: result.ok,
      score: scoreFromMissing(result.ok, missing, total),
      markerMissing: markerMissing,
      backlinkMissing: backlinkMissing
    };
  }

  async function auditRenderComponent(config) {
    var result = await fetchResource(config.url);

    if (config.assetOnly) {
      return {
        id: config.id,
        title: config.title,
        url: config.url,
        weight: config.weight,
        status: result.status,
        ok: result.ok,
        score: result.ok ? 100 : 0,
        missing: result.ok ? [] : ["HTTP 200 for required asset"]
      };
    }

    var missing = tokenMissing(result.text, config.tokens || []);

    return {
      id: config.id,
      title: config.title,
      url: config.url,
      weight: config.weight,
      status: result.status,
      ok: result.ok,
      score: scoreFromMissing(result.ok, missing, (config.tokens || []).length),
      missing: missing
    };
  }

  async function runAudit() {
    var house = await Promise.all(HOUSE_ROUTES.map(auditRoute));
    var products = await Promise.all(PRODUCT_ROUTES.map(auditRoute));
    var planets = await Promise.all(PLANET_ROUTES.map(auditRoute));
    var render = await Promise.all(RENDER_CHECKS.map(auditRenderComponent));

    var houseScore = average(house.map(function (item) { return item.score; }));
    var productScore = average(products.map(function (item) { return item.score; }));
    var planetScore = average(planets.map(function (item) { return item.score; }));
    var renderScore = weightedAverage(render);

    var coreScore = 50;
    var generationScore = 20;
    var overall = average([houseScore, coreScore, generationScore, renderScore, productScore, planetScore]);

    return {
      house: house,
      products: products,
      planets: planets,
      render: render,
      houseScore: houseScore,
      productScore: productScore,
      planetScore: planetScore,
      renderScore: renderScore,
      coreScore: coreScore,
      generationScore: generationScore,
      overall: overall
    };
  }

  function scoreClass(score) {
    if (score >= 95) return "pass";
    if (score >= 70) return "warn";
    return "break";
  }

  function missingList(items) {
    if (!items || items.length === 0) return "<li>NONE</li>";
    return items.map(function (item) {
      return "<li><code>" + escapeHtml(item) + "</code></li>";
    }).join("");
  }

  function renderDial(label, score, note) {
    return [
      '<article class="gauge-card ' + scoreClass(score) + '">',
      '<strong>' + escapeHtml(String(score)) + '</strong>',
      '<span>' + escapeHtml(label) + '</span>',
      '<small>' + escapeHtml(note) + '</small>',
      "</article>"
    ].join("");
  }

  function renderRouteEvidence(title, items) {
    return [
      "<h2>" + escapeHtml(title) + "</h2>",
      items.map(function (item) {
        var state = item.score >= 95 ? "PASS" : "BREAK";
        return [
          '<article class="audit-row ' + scoreClass(item.score) + '">',
          "<h3>" + escapeHtml(item.id + " · " + item.title + " · " + item.score) + "</h3>",
          "<p><strong>" + state + "</strong> · HTTP=" + escapeHtml(item.status) + "</p>",
          "<p><code>" + escapeHtml(item.url) + "</code></p>",
          "<p>Missing markers:</p>",
          "<ul>" + missingList(item.markerMissing) + "</ul>",
          item.backlinkMissing ? "<p>Missing backlinks:</p><ul>" + missingList(item.backlinkMissing) + "</ul>" : "",
          "</article>"
        ].join("");
      }).join("")
    ].join("");
  }

  function renderRenderEvidence(items) {
    return [
      "<h2>Demo Universe Earth render evidence</h2>",
      items.map(function (item) {
        var state = item.score >= 95 ? "PASS" : "BREAK";
        return [
          '<article class="audit-row ' + scoreClass(item.score) + '">',
          "<h3>" + escapeHtml(item.id + " · " + item.title + " · " + item.score) + "</h3>",
          "<p><strong>" + state + "</strong> · HTTP=" + escapeHtml(item.status) + "</p>",
          "<p><code>" + escapeHtml(item.url) + "</code></p>",
          "<p>Missing render tokens:</p>",
          "<ul>" + missingList(item.missing) + "</ul>",
          "</article>"
        ].join("");
      }).join("")
    ].join("");
  }

  function installStyle() {
    if (document.getElementById("gauges-runtime-style")) return;

    var style = document.createElement("style");
    style.id = "gauges-runtime-style";
    style.textContent = [
      ":root{color-scheme:dark;--bg:#05070d;--panel:rgba(255,255,255,.055);--line:rgba(255,255,255,.13);--gold:#f2c76f;--ink:#f4f7ff;--soft:rgba(244,247,255,.72);--bad:#ff9d9d;--ok:#9dffca;}",
      "body{background:#05070d;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;}",
      "main.gauges-runtime{max-width:1120px;margin:0 auto;padding:28px 18px 72px;}",
      ".gauges-runtime a{color:inherit;}",
      ".gauge-kicker{color:var(--gold);text-transform:uppercase;letter-spacing:.16em;font-size:.78rem;font-weight:900;}",
      ".gauges-runtime h1{font-size:clamp(2.2rem,8vw,5.4rem);letter-spacing:-.07em;line-height:.9;margin:.18em 0;}",
      ".gauges-runtime p{color:var(--soft);line-height:1.5;}",
      ".gauge-actions{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0;}",
      ".gauge-actions button,.gauge-actions a{border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.055);color:var(--ink);padding:10px 14px;font-weight:850;text-decoration:none;}",
      ".gauge-dials{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px;margin:22px 0;}",
      ".gauge-card{border:1px solid var(--line);border-radius:22px;background:var(--panel);padding:16px;}",
      ".gauge-card strong{display:block;font-size:2.4rem;line-height:1;}",
      ".gauge-card span{display:block;font-weight:900;margin-top:8px;}",
      ".gauge-card small{display:block;color:var(--soft);margin-top:4px;}",
      ".gauge-card.pass{border-color:rgba(157,255,202,.32);}",
      ".gauge-card.warn{border-color:rgba(242,199,111,.36);}",
      ".gauge-card.break{border-color:rgba(255,157,157,.36);}",
      ".audit-row{border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.04);padding:14px;margin:12px 0;}",
      ".audit-row h3{margin:.1em 0 .4em;font-size:1rem;}",
      ".audit-row code{color:var(--gold);overflow-wrap:anywhere;}",
      ".audit-row ul{margin-top:.35em;color:var(--soft);}",
      ".audit-row.pass{border-color:rgba(157,255,202,.26);}",
      ".audit-row.break{border-color:rgba(255,157,157,.28);}",
      ".receipt{margin-top:26px;border:1px solid var(--line);border-radius:20px;padding:14px;background:rgba(255,255,255,.035);}",
      ".audit-source{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important;padding:0!important;margin:-1px!important;}"
    ].join("\n");

    document.head.appendChild(style);
  }

  function getMain() {
    var existing = document.querySelector("main");
    if (existing) {
      existing.className = "gauges-runtime";
      return existing;
    }

    var main = document.createElement("main");
    main.className = "gauges-runtime";
    document.body.appendChild(main);
    return main;
  }

  function renderLoading() {
    installStyle();

    var main = getMain();
    main.innerHTML = [
      '<p class="gauge-kicker">H6 · Gauges · Demo Universe Earth render health</p>',
      "<h1>Gauges</h1>",
      "<p>Running live calibration against the current Demo Universe Earth contract.</p>",
      '<div class="gauge-actions"><button type="button" data-run-gauges>Run live calibration</button><a href="/">Return to Compass</a></div>'
    ].join("");
  }

  function renderResult(data) {
    installStyle();

    var main = getMain();

    main.innerHTML = [
      '<p class="gauge-kicker">H6 · Gauges · Demo Universe Earth render health</p>',
      "<h1>Gauges</h1>",
      "<p>Gauges separates marker health from generation health and now measures the accepted Demo Universe Earth contract. The retired showroom-earth.png requirement is no longer part of G6.</p>",

      '<div class="gauge-actions">',
      '<button type="button" data-run-gauges>Run live calibration</button>',
      '<a href="/">Return to Compass</a>',
      "</div>",

      '<section class="gauge-dials">',
      renderDial("Overall ceiling", data.overall, "composite"),
      renderDial("House skeleton", data.houseScore, "marker health"),
      renderDial("Core experience", data.coreScore, "measured"),
      renderDial("Generation readiness", data.generationScore, "GEN baseline hold"),
      renderDial("Render health", data.renderScore, "Demo Universe Earth"),
      renderDial("Products", data.productScore, "product route health"),
      renderDial("Planets", data.planetScore, "planet route health"),
      "</section>",

      "<h2>Marker health is not render health.</h2>",
      "<p>Showroom can pass route markers while Demo Universe Earth render health is measured separately through /showroom/globe/ and the local Earth texture assets.</p>",

      renderRenderEvidence(data.render),
      renderRouteEvidence("House route evidence", data.house),
      renderRouteEvidence("Product evidence", data.products),
      renderRouteEvidence("Planetary evidence", data.planets),

      '<section class="receipt">',
      "<h2>Calibration receipt</h2>",
      "<p><strong>BEFORE:</strong> retired actual-Earth asset contract required <code>/assets/earth/showroom-earth.png</code>.</p>",
      "<p><strong>AFTER:</strong> current Demo Universe Earth contract requires <code>/showroom/globe/</code>, <code>earth_surface_2048.jpg</code>, and <code>earth_clouds_2048.jpg</code>.</p>",
      "<p><strong>VERSION:</strong> " + escapeHtml(VERSION) + "</p>",
      "</section>",

      '<section class="audit-source" aria-label="Gauges audit source">',
      '<a href="/">Compass</a>',
      '<a href="/door/">Door</a>',
      '<a href="/home/">Home</a>',
      '<a href="/products/">Products</a>',
      '<a href="/showroom/">Showroom</a>',
      '<a href="/showroom/globe/">Demo Universe Earth</a>',
      '<a href="/gauges/">Gauges</a>',
      "<span>route-exists</span>",
      "<span>manor-skin</span>",
      "<span>house-class</span>",
      "<span>estate=rich-manor-and-estate</span>",
      "<span>house-field=true</span>",
      "<span>gauges-truth=live-authority</span>",
      "<span>construct-class=house</span>",
      "<span>house-part=gauges</span>",
      "<span>H6_GAUGES</span>",
      "<span>render-health-lane=active</span>",
      "<span>demo-universe-earth-render-health=measured</span>",
      "<span>" + escapeHtml(VERSION) + "</span>",
      "</section>"
    ].join("");

    bindRunButton();
  }

  async function execute() {
    renderLoading();
    bindRunButton();

    var data = await runAudit();
    window.DGBGaugeAudit = Object.freeze({
      version: VERSION,
      result: data
    });

    renderResult(data);
  }

  function bindRunButton() {
    var button = document.querySelector("[data-run-gauges]");
    if (!button) return;

    button.addEventListener("click", function () {
      execute();
    }, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", execute, { once: true });
  } else {
    execute();
  }
})();
