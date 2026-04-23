(() => {
  "use strict";

  const PRODUCTS_PAGE_META = Object.freeze({
    name: "PRODUCTS_WINDOW_STORM_CHAMBER",
    version: "V4",
    role: "presentation_and_navigation_only",
    contract: "PRODUCTS_WINDOW_STORM_CHAMBER_V4",
    status: "ACTIVE",
    deterministic: true
  });

  const PRODUCTS = Object.freeze([
    {
      key: "archcoin",
      tier: "flagship",
      title: "ARCHCOIN",
      label: "Flagship",
      description: "The intelligence asset layer for a new financial era.",
      button: "Explore ARCHCOIN",
      href: "/products/archcoin/",
      theme: "gold",
      icon: "archcoin"
    },
    {
      key: "aai",
      tier: "flagship",
      title: "AAI",
      label: "Flagship",
      description: "Applied AI systems that think, learn, and execute.",
      button: "Explore AAI",
      href: "/products/aai/",
      theme: "blue",
      icon: "aai"
    },
    {
      key: "nutrition",
      tier: "path",
      title: "Baseline Nutrition Systems",
      label: "Product Path",
      description: "Nutrition intelligence for a stronger human foundation.",
      button: "Explore Path",
      href: "/products/nutrition/",
      theme: "neutral",
      icon: "leaf"
    },
    {
      key: "five-flags",
      tier: "path",
      title: "Five Flags: What’s My Scene",
      label: "Product Path",
      description: "Identity. Alignment. Purpose. Wave by wave.",
      button: "Explore Path",
      href: "/products/five-flags/",
      theme: "neutral",
      icon: "flag"
    },
    {
      key: "esl",
      tier: "path",
      title: "ESL Traversal Learning",
      label: "Product Path",
      description: "Language mastery that opens every door.",
      button: "Explore Path",
      href: "/products/education/",
      theme: "neutral",
      icon: "book"
    }
  ]);

  const PRODUCT_WINDOW_VIEWS = Object.freeze({
    archcoin: {
      skyTop: "#0c1630",
      skyMid: "#16294d",
      skyBottom: "#0a111f",
      glowA: "rgba(255,228,162,.18)",
      glowB: "rgba(126,156,255,.18)",
      horizonGlow: "rgba(255,191,112,.22)",
      rainOpacity: 0.26,
      rainAngle: 103,
      lightningPaths: [
        "M66 4 57 28 72 26 49 66 58 43 45 45 66 4Z",
        "M78 12 70 34 82 33 63 58 71 43 59 44 78 12Z"
      ],
      lightningScale: 1.02,
      trunkX: 50,
      trunkHeight: 35,
      canopyScale: 1.06,
      canopyColorA: "#d9ba76",
      canopyColorB: "#7f6840",
      leafType: "gold",
      cityOpacity: 0.34,
      mullionV: true,
      mullionH: false
    },
    aai: {
      skyTop: "#091426",
      skyMid: "#132444",
      skyBottom: "#08111d",
      glowA: "rgba(157,198,255,.18)",
      glowB: "rgba(201,225,255,.12)",
      horizonGlow: "rgba(116,154,255,.14)",
      rainOpacity: 0.22,
      rainAngle: 102,
      lightningPaths: [
        "M54 6 47 24 58 23 42 52 49 37 38 38 54 6Z",
        "M72 18 66 33 75 32 62 52 67 41 58 42 72 18Z"
      ],
      lightningScale: 0.9,
      trunkX: 52,
      trunkHeight: 33,
      canopyScale: 0.92,
      canopyColorA: "#b6d6ff",
      canopyColorB: "#5679ab",
      leafType: "blue",
      cityOpacity: 0.28,
      mullionV: true,
      mullionH: false
    },
    nutrition: {
      skyTop: "#101723",
      skyMid: "#213244",
      skyBottom: "#0f171f",
      glowA: "rgba(184,221,140,.12)",
      glowB: "rgba(109,154,95,.10)",
      horizonGlow: "rgba(187,168,112,.12)",
      rainOpacity: 0.16,
      rainAngle: 101,
      lightningPaths: [
        "M61 10 54 28 64 27 49 55 55 40 45 41 61 10Z"
      ],
      lightningScale: 0.76,
      trunkX: 48,
      trunkHeight: 40,
      canopyScale: 1.08,
      canopyColorA: "#9ec77d",
      canopyColorB: "#4f7646",
      leafType: "green",
      cityOpacity: 0.16,
      mullionV: false,
      mullionH: false
    },
    "five-flags": {
      skyTop: "#0e1322",
      skyMid: "#1d283f",
      skyBottom: "#09101a",
      glowA: "rgba(255,188,118,.12)",
      glowB: "rgba(168,126,255,.10)",
      horizonGlow: "rgba(212,111,72,.12)",
      rainOpacity: 0.18,
      rainAngle: 105,
      lightningPaths: [
        "M70 8 62 29 75 28 57 58 64 43 52 44 70 8Z"
      ],
      lightningScale: 0.84,
      trunkX: 58,
      trunkHeight: 34,
      canopyScale: 0.92,
      canopyColorA: "#d28b67",
      canopyColorB: "#7d4b37",
      leafType: "copper",
      cityOpacity: 0.2,
      mullionV: false,
      mullionH: false
    },
    esl: {
      skyTop: "#0c1422",
      skyMid: "#1b2942",
      skyBottom: "#081019",
      glowA: "rgba(189,211,255,.10)",
      glowB: "rgba(255,214,132,.08)",
      horizonGlow: "rgba(255,188,118,.10)",
      rainOpacity: 0.14,
      rainAngle: 100,
      lightningPaths: [
        "M48 10 42 24 51 24 39 45 44 33 35 34 48 10Z"
      ],
      lightningScale: 0.7,
      trunkX: 42,
      trunkHeight: 32,
      canopyScale: 0.82,
      canopyColorA: "#b6c8de",
      canopyColorB: "#65768d",
      leafType: "silver",
      cityOpacity: 0.14,
      mullionV: false,
      mullionH: false
    }
  });

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function createIcon(kind, theme) {
    if (kind === "archcoin" || kind === "aai") {
      const medallion = createEl("div", `coinMedallion ${theme}`);
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 64 64");
      svg.setAttribute("class", "coinGlyph");
      svg.setAttribute("aria-hidden", "true");

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "32");
      circle.setAttribute("cy", "32");
      circle.setAttribute("r", "25");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.86)" : "rgba(189,215,255,.88)");
      circle.setAttribute("stroke-width", "1.8");

      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("d", "M18 44 32 16 46 44");
      path1.setAttribute("fill", "none");
      path1.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.96)" : "rgba(189,215,255,.96)");
      path1.setAttribute("stroke-width", "3.2");
      path1.setAttribute("stroke-linecap", "round");
      path1.setAttribute("stroke-linejoin", "round");

      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path2.setAttribute("d", "M23 34h18");
      path2.setAttribute("fill", "none");
      path2.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.96)" : "rgba(189,215,255,.96)");
      path2.setAttribute("stroke-width", "3.2");
      path2.setAttribute("stroke-linecap", "round");

      svg.append(circle, path1, path2);
      medallion.appendChild(svg);
      return medallion;
    }

    const box = createEl("div", "miniIcon");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    if (kind === "leaf") {
      svg.innerHTML = '<path d="M18 3c-5.5 0-10 4.5-10 10v8"/><path d="M18 3c0 8-4 12-10 12"/><path d="M8 13c-2.8 0-5-2.2-5-5 2.8 0 5 2.2 5 5Z"/>';
    } else if (kind === "flag") {
      svg.innerHTML = '<path d="M6 21V4"/><path d="M6 5c2-1 4-1 6 0s4 1 6 0v8c-2 1-4 1-6 0s-4-1-6 0"/>';
    } else if (kind === "book") {
      svg.innerHTML = '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5a1.5 1.5 0 0 0-1.5-1.5H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M8 4v14"/>';
    }

    box.appendChild(svg);
    return box;
  }

  function buildCityline(opacity) {
    return `
      <div style="position:absolute;left:0;right:0;bottom:0;height:24%;opacity:${opacity};background:linear-gradient(180deg,transparent 0%, rgba(5,9,16,.18) 24%, rgba(5,9,16,.92) 100%);">
        <svg viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;display:block;">
          <rect x="0" y="180" width="1200" height="40" fill="#060b14"/>
          <rect x="80" y="120" width="42" height="60" fill="#0c1628"/>
          <rect x="132" y="86" width="58" height="94" fill="#0e1a2f"/>
          <rect x="204" y="102" width="34" height="78" fill="#0d172b"/>
          <rect x="258" y="132" width="52" height="48" fill="#0c1628"/>
          <rect x="334" y="72" width="64" height="108" fill="#11203a"/>
          <rect x="420" y="94" width="40" height="86" fill="#0d172b"/>
          <rect x="484" y="128" width="36" height="52" fill="#0b1527"/>
          <rect x="548" y="82" width="72" height="98" fill="#10203a"/>
          <rect x="646" y="110" width="40" height="70" fill="#0c172a"/>
          <rect x="706" y="76" width="64" height="104" fill="#10203a"/>
          <rect x="788" y="124" width="36" height="56" fill="#0b1527"/>
          <rect x="850" y="92" width="46" height="88" fill="#0d182c"/>
          <rect x="918" y="70" width="72" height="110" fill="#11203a"/>
          <rect x="1016" y="116" width="34" height="64" fill="#0c1628"/>
          <rect x="1074" y="96" width="58" height="84" fill="#0e1a2f"/>
          <rect x="1140" y="132" width="32" height="48" fill="#0b1527"/>
        </svg>
      </div>
    `;
  }

  function buildLightning(paths, scale) {
    const markup = paths
      .map((d) => `<path d="${d}" fill="rgba(237,243,255,.98)"></path>`)
      .join("");

    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="cardWindowLightning" style="transform:scale(${scale});transform-origin:center center;">
        ${markup}
      </svg>
    `;
  }

  function buildLeaves(type, colorA, colorB, canopyScale) {
    const baseSets = {
      gold: [
        [56,124,68,68],[18,118,62,62],[100,118,62,62],[38,154,54,54],[92,154,54,54],[66,172,48,48]
      ],
      blue: [
        [58,126,64,64],[24,122,56,56],[102,122,56,56],[44,156,50,50],[92,156,50,50],[68,176,42,42]
      ],
      green: [
        [54,120,74,74],[14,116,66,66],[106,116,66,66],[34,156,60,60],[96,156,60,60],[66,182,52,52]
      ],
      copper: [
        [60,128,62,62],[24,124,56,56],[104,124,56,56],[44,156,50,50],[96,156,50,50],[70,176,42,42]
      ],
      silver: [
        [60,128,58,58],[28,124,50,50],[102,124,50,50],[48,156,44,44],[94,156,44,44],[72,176,38,38]
      ]
    };

    return (baseSets[type] || baseSets.gold)
      .map(([x, y, w, h]) => {
        const sw = Math.round(w * canopyScale);
        const sh = Math.round(h * canopyScale);
        return `
          <div style="
            position:absolute;
            left:${x}px;
            bottom:${y}px;
            width:${sw}px;
            height:${sh}px;
            border-radius:999px;
            background:
              radial-gradient(circle at 40% 40%, rgba(255,255,255,.26), transparent 16%),
              radial-gradient(circle at 50% 50%, ${colorA}, ${colorB});
            box-shadow:0 0 18px rgba(255,255,255,.06);
          "></div>
        `;
      })
      .join("");
  }

  function buildStormWindow(productKey) {
    const view = PRODUCT_WINDOW_VIEWS[productKey] || PRODUCT_WINDOW_VIEWS.archcoin;

    return `
      <div class="cardWindow">
        <div class="cardWindowScene" style="
          background:
            radial-gradient(circle at 18% 18%, ${view.glowA}, transparent 28%),
            radial-gradient(circle at 82% 22%, ${view.glowB}, transparent 30%),
            linear-gradient(180deg, ${view.skyTop} 0%, ${view.skyMid} 48%, ${view.skyBottom} 100%);
        ">
          <div style="
            position:absolute;
            inset:-8%;
            opacity:${view.rainOpacity};
            background:
              repeating-linear-gradient(
                ${view.rainAngle}deg,
                rgba(255,255,255,0) 0 14px,
                rgba(194,214,255,.10) 14px 16px,
                rgba(255,255,255,0) 16px 30px
              );
          "></div>

          <div style="
            position:absolute;
            inset:0;
            background:
              radial-gradient(circle at 50% 100%, ${view.horizonGlow}, transparent 32%),
              linear-gradient(180deg, rgba(5,9,16,0) 0%, rgba(5,9,16,.24) 30%, rgba(5,9,16,.82) 100%);
          "></div>

          ${buildCityline(view.cityOpacity)}

          <div style="
            position:absolute;
            left:${view.trunkX}%;
            bottom:0;
            width:156px;
            height:210px;
            transform:translateX(-50%);
          ">
            <div style="
              position:absolute;
              left:50%;
              bottom:0;
              width:14px;
              height:${view.trunkHeight}%;
              transform:translateX(-50%);
              background:linear-gradient(180deg,#62503f,#342a22);
              border-radius:10px;
            "></div>

            <div style="
              position:absolute;
              width:10px;
              height:86px;
              left:60px;
              bottom:66px;
              transform:rotate(-34deg);
              transform-origin:bottom center;
              border-radius:999px;
              background:linear-gradient(180deg,#6e5948,#342a22);
            "></div>

            <div style="
              position:absolute;
              width:10px;
              height:90px;
              left:86px;
              bottom:68px;
              transform:rotate(30deg);
              transform-origin:bottom center;
              border-radius:999px;
              background:linear-gradient(180deg,#6e5948,#342a22);
            "></div>

            <div style="
              position:absolute;
              width:8px;
              height:58px;
              left:48px;
              bottom:106px;
              transform:rotate(-56deg);
              transform-origin:bottom center;
              border-radius:999px;
              background:linear-gradient(180deg,#6e5948,#342a22);
            "></div>

            <div style="
              position:absolute;
              width:8px;
              height:60px;
              left:98px;
              bottom:108px;
              transform:rotate(56deg);
              transform-origin:bottom center;
              border-radius:999px;
              background:linear-gradient(180deg,#6e5948,#342a22);
            "></div>

            ${buildLeaves(view.leafType, view.canopyColorA, view.canopyColorB, view.canopyScale)}
          </div>

          ${buildLightning(view.lightningPaths, view.lightningScale)}
        </div>

        <div class="windowSpill"></div>

        <div class="cardWindowGlass"></div>
        ${view.mullionV ? '<div class="cardWindowMullionV"></div>' : ''}
        ${view.mullionH ? '<div class="cardWindowMullionH"></div>' : ''}
        <div class="cardWindowFrame"></div>
      </div>
    `;
  }

  function buildCard(product) {
    const classes = [
      "card",
      product.tier === "flagship" ? "isFlagship" : "secondary"
    ];

    if (product.key === "archcoin") classes.push("archcoin");
    if (product.key === "aai") classes.push("aai");

    const card = createEl("article", classes.join(" "));
    card.insertAdjacentHTML("afterbegin", buildStormWindow(product.key));

    const content = createEl("div", "cardContent");
    content.appendChild(createIcon(product.icon, product.theme));

    const tag = createEl("p", "tag", product.label);
    content.appendChild(tag);

    const title = createEl("h2", "title", product.title);
    content.appendChild(title);

    const desc = createEl("p", "desc", product.description);
    content.appendChild(desc);

    const ctaBar = createEl("div", "ctaBar");
    const link = createEl("a", "cardBtn");
    link.href = product.href;
    link.setAttribute("data-product-path", product.key);
    link.innerHTML = `<span>${product.button}</span><span aria-hidden="true">→</span>`;
    ctaBar.appendChild(link);

    content.appendChild(ctaBar);
    card.appendChild(content);
    return card;
  }

  function renderProducts() {
    const grid = qs("#productsGrid");
    const emptyState = qs("#productsEmptyState");
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    PRODUCTS.forEach((product) => fragment.appendChild(buildCard(product)));
    grid.replaceChildren(fragment);

    if (emptyState) {
      emptyState.style.display = PRODUCTS.length ? "none" : "flex";
    }
  }

  function bindLightning() {
    const page = qs("#productsPage");
    if (!page) return;

    let flashTimeout = null;

    function triggerFlash() {
      page.classList.add("flash");
      window.clearTimeout(flashTimeout);
      flashTimeout = window.setTimeout(() => {
        page.classList.remove("flash");
      }, 240);
    }

    triggerFlash();
    window.setInterval(triggerFlash, 4200);
  }

  function init() {
    renderProducts();
    bindLightning();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
