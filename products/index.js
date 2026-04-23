(() => {
  "use strict";

  const PRODUCTS_PAGE_META = Object.freeze({
    name: "PRODUCTS_WINDOW_STORM_CHAMBER",
    version: "V8",
    role: "presentation_and_navigation_only",
    contract: "PRODUCTS_WINDOW_STORM_CHAMBER_V8",
    status: "ACTIVE",
    deterministic: true
  });

  const GRAPHICS_SCRIPT_SRC = "/products/products_graphics.js";

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

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function ensureGraphicsScript() {
    return new Promise((resolve, reject) => {
      if (window.ProductsGraphics && typeof window.ProductsGraphics.renderScene === "function") {
        resolve(window.ProductsGraphics);
        return;
      }

      const existing = document.querySelector(`script[src="${GRAPHICS_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.ProductsGraphics), { once: true });
        existing.addEventListener("error", () => reject(new Error("Graphics script failed to load.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = GRAPHICS_SCRIPT_SRC;
      script.defer = true;
      script.onload = () => resolve(window.ProductsGraphics);
      script.onerror = () => reject(new Error("Graphics script failed to load."));
      document.head.appendChild(script);
    });
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

  function buildWindowWrapper(productKey) {
    const sceneMarkup =
      window.ProductsGraphics && typeof window.ProductsGraphics.renderScene === "function"
        ? window.ProductsGraphics.renderScene(productKey)
        : "";

    return `
      <div class="cardWindow" style="position:absolute;inset:0;border-radius:inherit;overflow:hidden;z-index:0;pointer-events:none;">
        <div class="cardWindowScene" style="position:absolute;inset:0;overflow:hidden;transition:filter .18s ease;">
          ${sceneMarkup}
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
    const card = createEl("article", "card");
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

    card.insertAdjacentHTML("afterbegin", buildWindowWrapper(product.key));

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
      const flashes = document.querySelectorAll(".pg-lightning");
      const spills = document.querySelectorAll(".windowSpill");
      const cards = document.querySelectorAll(".card");

      scenes.forEach((node) => {
        node.style.filter = "brightness(1.08) saturate(1.03)";
      });

      flashes.forEach((node) => {
        node.style.opacity = "1";
      });

      spills.forEach((node) => {
        node.style.opacity = ".20";
      });

      cards.forEach((node) => {
        node.style.boxShadow = "0 18px 48px rgba(0,0,0,.34), inset 0 0 18px rgba(212,228,255,.04)";
      });

      window.clearTimeout(flashTimeout);
      flashTimeout = window.setTimeout(() => {
        page.classList.remove("flash");

        scenes.forEach((node) => {
          node.style.filter = "";
        });

        flashes.forEach((node) => {
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

  async function init() {
    try {
      await ensureGraphicsScript();
    } catch (error) {
      console.error(error);
    }

    renderProducts();
    bindLightning();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
