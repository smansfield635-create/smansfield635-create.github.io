(() => {
  "use strict";

  const PRODUCTS_PAGE_META = Object.freeze({
    name: "PRODUCTS_WINDOW_STORM_CHAMBER",
    version: "V6",
    role: "presentation_and_navigation_only",
    contract: "PRODUCTS_WINDOW_STORM_CHAMBER_V6",
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
      skyTop: "#0a1224",
      skyMid: "#142544",
      skyBottom: "#090f1b",
      fog: "rgba(173,195,232,.14)",
      glowA: "rgba(232,192,116,.12)",
      glowB: "rgba(123,151,224,.14)",
      horizonGlow: "rgba(232,181,104,.10)",
      rainOpacity: 0.16,
      rainAngle: 103,
      lightningPaths: [
        "M68 6 60 28 73 27 53 61 61 42 49 43 68 6Z"
      ],
      lightningScale: 0.92,
      lightningOpacity: 0.34,
      treeTintA: "#cfb37a",
      treeTintB: "#705a3e",
      treeOpacity: 0.18,
      treeBlur: 3.2,
      treeScale: 0.72,
      treeBottom: -16,
      treeX: 50,
      cityOpacity: 0.08,
      geometryOpacity: 0.20,
      geometryStroke: "rgba(214,183,118,.30)",
      mullionV: true
    },
    aai: {
      skyTop: "#091220",
      skyMid: "#11213d",
      skyBottom: "#070d17",
      fog: "rgba(173,199,237,.16)",
      glowA: "rgba(184,213,255,.10)",
      glowB: "rgba(110,142,216,.12)",
      horizonGlow: "rgba(129,154,214,.08)",
      rainOpacity: 0.14,
      rainAngle: 102,
      lightningPaths: [
        "M56 8 49 24 59 24 45 49 51 36 41 37 56 8Z",
        "M73 18 67 31 76 31 64 49 69 39 60 39 73 18Z"
      ],
      lightningScale: 0.82,
      lightningOpacity: 0.28,
      treeTintA: "#b9d0ef",
      treeTintB: "#5e769b",
      treeOpacity: 0.16,
      treeBlur: 3.4,
      treeScale: 0.68,
      treeBottom: -18,
      treeX: 52,
      cityOpacity: 0.06,
      geometryOpacity: 0.18,
      geometryStroke: "rgba(183,210,255,.26)",
      mullionV: true
    },
    nutrition: {
      skyTop: "#0d1621",
      skyMid: "#1a2b36",
      skyBottom: "#0b1218",
      fog: "rgba(189,210,182,.12)",
      glowA: "rgba(155,190,129,.10)",
      glowB: "rgba(215,189,123,.08)",
      horizonGlow: "rgba(182,166,106,.08)",
      rainOpacity: 0.08,
      rainAngle: 101,
      lightningPaths: [
        "M60 11 54 25 63 25 50 44 55 34 46 35 60 11Z"
      ],
      lightningScale: 0.76,
      lightningOpacity: 0.16,
      treeTintA: "#9cbc84",
      treeTintB: "#536c48",
      treeOpacity: 0.15,
      treeBlur: 3.8,
      treeScale: 0.66,
      treeBottom: -18,
      treeX: 48,
      cityOpacity: 0.04,
      geometryOpacity: 0.14,
      geometryStroke: "rgba(185,205,146,.20)",
      mullionV: false
    },
    "five-flags": {
      skyTop: "#111320",
      skyMid: "#201f34",
      skyBottom: "#0c0e17",
      fog: "rgba(202,178,171,.10)",
      glowA: "rgba(201,145,110,.10)",
      glowB: "rgba(150,123,206,.08)",
      horizonGlow: "rgba(193,126,88,.08)",
      rainOpacity: 0.10,
      rainAngle: 105,
      lightningPaths: [
        "M67 9 60 28 72 27 56 54 62 41 51 42 67 9Z"
      ],
      lightningScale: 0.80,
      lightningOpacity: 0.20,
      treeTintA: "#bf8869",
      treeTintB: "#714b3d",
      treeOpacity: 0.15,
      treeBlur: 3.6,
      treeScale: 0.68,
      treeBottom: -18,
      treeX: 58,
      cityOpacity: 0.04,
      geometryOpacity: 0.16,
      geometryStroke: "rgba(208,155,126,.22)",
      mullionV: false
    },
    esl: {
      skyTop: "#0c1420",
      skyMid: "#172435",
      skyBottom: "#081019",
      fog: "rgba(196,204,214,.10)",
      glowA: "rgba(171,192,222,.08)",
      glowB: "rgba(227,196,138,.06)",
      horizonGlow: "rgba(170,166,154,.07)",
      rainOpacity: 0.07,
      rainAngle: 100,
      lightningPaths: [
        "M50 12 44 24 52 24 41 41 46 33 38 33 50 12Z"
      ],
      lightningScale: 0.68,
      lightningOpacity: 0.14,
      treeTintA: "#b0bdcb",
      treeTintB: "#63717f",
      treeOpacity: 0.13,
      treeBlur: 4.0,
      treeScale: 0.62,
      treeBottom: -20,
      treeX: 42,
      cityOpacity: 0.03,
      geometryOpacity: 0.14,
      geometryStroke: "rgba(201,213,228,.20)",
      mullionV: false
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
      medallion.style.width = "92px";
      medallion.style.height = "92px";
      medallion.style.borderRadius = "999px";
      medallion.style.display = "grid";
      medallion.style.placeItems = "center";
      medallion.style.marginBottom = "14px";
      medallion.style.border = "1px solid rgba(255,255,255,.14)";
      medallion.style.background =
        "radial-gradient(circle at 34% 30%, rgba(255,255,255,.08), transparent 18%), linear-gradient(180deg, rgba(15,22,40,.96), rgba(7,11,18,.92))";
      medallion.style.boxShadow =
        theme === "gold"
          ? "inset 0 0 0 1px rgba(255,255,255,.04),0 0 0 1px rgba(242,211,145,.12),0 0 26px rgba(242,211,145,.10)"
          : "inset 0 0 0 1px rgba(255,255,255,.04),0 0 0 1px rgba(135,184,255,.12),0 0 26px rgba(135,184,255,.12)";
      medallion.style.overflow = "hidden";
      medallion.style.position = "relative";
      medallion.style.zIndex = "2";

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 64 64");
      svg.setAttribute("width", "54");
      svg.setAttribute("height", "54");
      svg.setAttribute("aria-hidden", "true");

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "32");
      circle.setAttribute("cy", "32");
      circle.setAttribute("r", "25");
      circle.setAttribute("fill", "none");
      circle.setAttribute(
        "stroke",
        kind === "archcoin" ? "rgba(242,211,145,.86)" : "rgba(189,215,255,.88)"
      );
      circle.setAttribute("stroke-width", "1.8");

      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("d", "M18 44 32 16 46 44");
      path1.setAttribute("fill", "none");
      path1.setAttribute(
        "stroke",
        kind === "archcoin" ? "rgba(242,211,145,.96)" : "rgba(189,215,255,.96)"
      );
      path1.setAttribute("stroke-width", "3.2");
      path1.setAttribute("stroke-linecap", "round");
      path1.setAttribute("stroke-linejoin", "round");

      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path2.setAttribute("d", "M23 34h18");
      path2.setAttribute("fill", "none");
      path2.setAttribute(
        "stroke",
        kind === "archcoin" ? "rgba(242,211,145,.96)" : "rgba(189,215,255,.96)"
      );
      path2.setAttribute("stroke-width", "3.2");
      path2.setAttribute("stroke-linecap", "round");

      svg.append(circle, path1, path2);
      medallion.appendChild(svg);
      return medallion;
    }

    const box = createEl("div", "miniIcon");
    box.style.width = "58px";
    box.style.height = "58px";
    box.style.marginBottom = "12px";
    box.style.borderRadius = "999px";
    box.style.border = "1px solid rgba(255,255,255,.12)";
    box.style.display = "grid";
    box.style.placeItems = "center";
    box.style.color = "rgba(244,247,255,.56)";
    box.style.background = "rgba(255,255,255,.02)";
    box.style.position = "relative";
    box.style.zIndex = "2";

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
      svg.innerHTML =
        '<path d="M18 3c-5.5 0-10 4.5-10 10v8"/><path d="M18 3c0 8-4 12-10 12"/><path d="M8 13c-2.8 0-5-2.2-5-5 2.8 0 5 2.2 5 5Z"/>';
    } else if (kind === "flag") {
      svg.innerHTML =
        '<path d="M6 21V4"/><path d="M6 5c2-1 4-1 6 0s4 1 6 0v8c-2 1-4 1-6 0s-4-1-6 0"/>';
    } else if (kind === "book") {
      svg.innerHTML =
        '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5a1.5 1.5 0 0 0-1.5-1.5H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M8 4v14"/>';
    }

    box.appendChild(svg);
    return box;
  }

  function buildCityline(opacity) {
    return `
      <div style="position:absolute;left:0;right:0;bottom:0;height:22%;opacity:${opacity};background:linear-gradient(180deg,transparent 0%, rgba(5,9,16,.14) 26%, rgba(5,9,16,.84) 100%);">
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

  function buildGeometry(view) {
    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"
        style="position:absolute;inset:0;opacity:${view.geometryOpacity};pointer-events:none;">
        <g fill="none" stroke="${view.geometryStroke}" stroke-width=".28">
          <path d="M50 8 L81 26 L81 62 L50 82 L19 62 L19 26 Z"/>
          <path d="M50 14 L74 28 L74 58 L50 72 L26 58 L26 28 Z"/>
          <circle cx="50" cy="44" r="12"/>
          <circle cx="50" cy="44" r="22"/>
          <path d="M50 8 V92"/>
          <path d="M14 44 H86"/>
          <path d="M30 24 L70 64"/>
          <path d="M70 24 L30 64"/>
          <circle cx="50" cy="44" r="2.1"/>
          <circle cx="50" cy="86" r="6"/>
        </g>
      </svg>
    `;
  }

  function buildLightning(paths, scale, opacity) {
    const markup = paths
      .map((d) => `<path d="${d}" fill="rgba(237,243,255,${opacity})"></path>`)
      .join("");

    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
        style="position:absolute;inset:0;opacity:0;transform:scale(${scale});transform-origin:center center;pointer-events:none;filter:drop-shadow(0 0 8px rgba(220,234,255,.16)) drop-shadow(0 0 14px rgba(159,190,255,.08));"
        class="cardWindowLightning">
        ${markup}
      </svg>
    `;
  }

  function buildLeafCloud(view) {
    const nodes = [];
    const base = [
      [0, 0, 36, 28],
      [-18, 8, 24, 20],
      [18, 10, 24, 20],
      [-8, -10, 22, 18],
      [12, -8, 20, 16],
      [6, 18, 18, 14]
    ];

    for (const [x, y, w, h] of base) {
      nodes.push(`
        <div style="
          position:absolute;
          left:50%;
          top:36%;
          transform:translate(${x}px, ${y}px);
          width:${Math.round(w * view.treeScale)}px;
          height:${Math.round(h * view.treeScale)}px;
          border-radius:999px;
          background:
            radial-gradient(circle at 40% 40%, rgba(255,255,255,.10), transparent 18%),
            linear-gradient(180deg, ${view.treeTintA}, ${view.treeTintB});
          opacity:.82;
        "></div>
      `);
    }

    return nodes.join("");
  }

  function buildTree(view) {
    return `
      <div style="
        position:absolute;
        left:${view.treeX}%;
        bottom:${view.treeBottom}px;
        width:160px;
        height:220px;
        transform:translateX(-50%) scale(${view.treeScale});
        transform-origin:bottom center;
        opacity:${view.treeOpacity};
        filter:blur(${view.treeBlur}px);
      ">
        <div style="
          position:absolute;
          left:50%;
          bottom:12px;
          width:8px;
          height:82px;
          transform:translateX(-50%);
          background:linear-gradient(180deg, ${view.treeTintA}, ${view.treeTintB});
          border-radius:10px;
        "></div>

        <div style="
          position:absolute;
          left:50%;
          bottom:74px;
          width:6px;
          height:54px;
          transform:translateX(-50%);
          background:linear-gradient(180deg, ${view.treeTintA}, ${view.treeTintB});
          border-radius:10px;
        "></div>

        <div style="
          position:absolute;
          left:50%;
          bottom:72px;
          width:5px;
          height:48px;
          transform:translateX(-26px) rotate(-34deg);
          transform-origin:bottom center;
          background:linear-gradient(180deg, ${view.treeTintA}, ${view.treeTintB});
          border-radius:10px;
        "></div>

        <div style="
          position:absolute;
          left:50%;
          bottom:72px;
          width:5px;
          height:50px;
          transform:translateX(21px) rotate(30deg);
          transform-origin:bottom center;
          background:linear-gradient(180deg, ${view.treeTintA}, ${view.treeTintB});
          border-radius:10px;
        "></div>

        <div style="
          position:absolute;
          left:50%;
          bottom:0;
          width:64px;
          height:26px;
          transform:translateX(-50%);
          background:
            radial-gradient(circle at 50% 50%, rgba(255,255,255,.05), transparent 56%),
            linear-gradient(180deg, rgba(0,0,0,0), ${view.treeTintB});
          border-radius:50%;
          opacity:.65;
        "></div>

        ${buildLeafCloud(view)}
      </div>
    `;
  }

  function buildStormWindow(productKey) {
    const view = PRODUCT_WINDOW_VIEWS[productKey] || PRODUCT_WINDOW_VIEWS.archcoin;

    return `
      <div class="cardWindow" style="position:absolute;inset:0;border-radius:inherit;overflow:hidden;z-index:0;pointer-events:none;">
        <div class="cardWindowScene" style="
          position:absolute;
          inset:0;
          overflow:hidden;
          background:
            radial-gradient(circle at 18% 18%, ${view.glowA}, transparent 28%),
            radial-gradient(circle at 82% 22%, ${view.glowB}, transparent 30%),
            radial-gradient(circle at 50% 45%, ${view.fog}, transparent 32%),
            linear-gradient(180deg, ${view.skyTop} 0%, ${view.skyMid} 52%, ${view.skyBottom} 100%);
          transition:filter .18s ease;
        ">
          <div style="
            position:absolute;
            inset:-8%;
            opacity:${view.rainOpacity};
            background:
              repeating-linear-gradient(
                ${view.rainAngle}deg,
                rgba(255,255,255,0) 0 14px,
                rgba(194,214,255,.08) 14px 16px,
                rgba(255,255,255,0) 16px 30px
              );
          "></div>

          <div style="
            position:absolute;
            inset:0;
            background:
              radial-gradient(circle at 50% 100%, ${view.horizonGlow}, transparent 34%),
              linear-gradient(180deg, rgba(5,9,16,0) 0%, rgba(5,9,16,.18) 34%, rgba(5,9,16,.72) 100%);
          "></div>

          ${buildCityline(view.cityOpacity)}
          ${buildGeometry(view)}
          ${buildTree(view)}
          ${buildLightning(view.lightningPaths, view.lightningScale, view.lightningOpacity)}
        </div>

        <div class="windowSpill" style="
          position:absolute;
          inset:0;
          z-index:1;
          pointer-events:none;
          opacity:.10;
          transition:opacity .18s ease;
          background:
            linear-gradient(180deg, rgba(214,228,255,.05), transparent 28%, transparent 72%, rgba(255,188,96,.03)),
            radial-gradient(circle at 50% 18%, rgba(214,228,255,.04), transparent 26%);
          mix-blend-mode:screen;
        "></div>

        <div class="cardWindowGlass" style="
          position:absolute;
          inset:0;
          background:
            linear-gradient(100deg, rgba(255,255,255,.06), transparent 24%, transparent 62%, rgba(255,255,255,.03)),
            radial-gradient(circle at 50% 24%, rgba(210,226,255,.03), transparent 22%);
          mix-blend-mode:screen;
          opacity:.50;
        "></div>

        ${
          view.mullionV
            ? `<div style="
                position:absolute;
                top:0;bottom:0;left:50%;
                width:6px;
                transform:translateX(-50%);
                background:rgba(10,14,24,.88);
                opacity:.96;
                box-shadow:0 0 0 1px rgba(255,255,255,.03);
              "></div>`
            : ""
        }

        <div style="
          position:absolute;
          inset:0;
          border-radius:inherit;
          box-shadow:
            inset 0 0 0 2px rgba(10,14,24,.92),
            inset 0 0 0 10px rgba(18,14,12,.56),
            inset 0 0 0 11px rgba(255,255,255,.04);
        "></div>
      </div>
    `;
  }

  function buildCard(product) {
    const classes = ["card", product.tier === "flagship" ? "isFlagship" : "secondary"];
    if (product.key === "archcoin") classes.push("archcoin");
    if (product.key === "aai") classes.push("aai");

    const card = createEl("article", classes.join(" "));
    card.style.position = "relative";
    card.style.border = "1px solid rgba(255,255,255,.12)";
    card.style.borderRadius = "24px";
    card.style.overflow = "hidden";
    card.style.background = "linear-gradient(180deg, rgba(8,12,22,.92), rgba(6,9,17,.98))";
    card.style.boxShadow = "0 18px 48px rgba(0,0,0,.34)";
    card.style.minHeight = product.tier === "flagship" ? "380px" : "336px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "space-between";
    card.style.padding = "18px";
    card.style.isolation = "isolate";

    if (product.key === "archcoin") {
      card.style.borderColor = "rgba(242,211,145,.22)";
    }
    if (product.key === "aai") {
      card.style.borderColor = "rgba(135,184,255,.22)";
    }

    card.insertAdjacentHTML("afterbegin", buildStormWindow(product.key));

    const content = createEl("div");
    content.style.position = "relative";
    content.style.zIndex = "2";
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.minHeight = "100%";

    content.appendChild(createIcon(product.icon, product.theme));

    const tag = createEl("p", "", product.label);
    tag.style.margin = "0 0 12px";
    tag.style.fontSize = ".82rem";
    tag.style.fontWeight = "900";
    tag.style.letterSpacing = ".18em";
    tag.style.textTransform = "uppercase";
    tag.style.color = "rgba(242,211,145,1)";
    content.appendChild(tag);

    const title = createEl("h2", "", product.title);
    title.style.margin = "0 0 12px";
    title.style.fontFamily = 'Georgia,"Times New Roman",serif';
    title.style.fontSize = product.tier === "flagship" ? "clamp(2.05rem,3vw,2.6rem)" : "clamp(1.7rem,2.2vw,2.2rem)";
    title.style.lineHeight = ".96";
    title.style.letterSpacing = "-.02em";
    title.style.textWrap = "balance";
    title.style.textShadow = "0 2px 12px rgba(0,0,0,.38)";
    content.appendChild(title);

    const desc = createEl("p", "", product.description);
    desc.style.margin = "0";
    desc.style.color = "rgba(244,247,255,.78)";
    desc.style.fontSize = "1rem";
    desc.style.lineHeight = "1.65";
    desc.style.textShadow = "0 1px 10px rgba(0,0,0,.28)";
    content.appendChild(desc);

    const ctaBar = createEl("div");
    ctaBar.style.marginTop = "18px";
    ctaBar.style.position = "relative";
    ctaBar.style.zIndex = "2";

    const link = createEl("a");
    link.href = product.href;
    link.setAttribute("data-product-path", product.key);
    link.style.width = "100%";
    link.style.minHeight = "46px";
    link.style.borderRadius = "14px";
    link.style.border = "1px solid rgba(255,255,255,.12)";
    link.style.background = "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01))";
    link.style.color = "rgba(244,247,255,1)";
    link.style.fontSize = ".92rem";
    link.style.fontWeight = "800";
    link.style.letterSpacing = ".02em";
    link.style.display = "inline-flex";
    link.style.alignItems = "center";
    link.style.justifyContent = "space-between";
    link.style.padding = "0 14px";
    link.style.backdropFilter = "blur(2px)";
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
      const scenes = document.querySelectorAll(".cardWindowScene");
      const bolts = document.querySelectorAll(".cardWindowLightning");
      const spills = document.querySelectorAll(".windowSpill");
      const cards = document.querySelectorAll(".card");

      scenes.forEach((node) => {
        node.style.filter = "brightness(1.10) saturate(1.04)";
      });
      bolts.forEach((node) => {
        node.style.opacity = "1";
      });
      spills.forEach((node) => {
        node.style.opacity = ".22";
      });
      cards.forEach((node) => {
        node.style.boxShadow = "0 18px 48px rgba(0,0,0,.34), inset 0 0 22px rgba(212,228,255,.04)";
      });

      window.clearTimeout(flashTimeout);
      flashTimeout = window.setTimeout(() => {
        page.classList.remove("flash");
        scenes.forEach((node) => {
          node.style.filter = "";
        });
        bolts.forEach((node) => {
          node.style.opacity = "0";
        });
        spills.forEach((node) => {
          node.style.opacity = ".10";
        });
        cards.forEach((node) => {
          node.style.boxShadow = "0 18px 48px rgba(0,0,0,.34)";
        });
      }, 220);
    }

    window.setTimeout(triggerFlash, 500);
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
