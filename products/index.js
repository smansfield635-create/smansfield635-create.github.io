(() => {
  "use strict";

  const PRODUCTS_PAGE_META = Object.freeze({
    name: "PRODUCTS_STORM_CHAMBER",
    version: "V2",
    role: "presentation_and_navigation_only",
    contract: "PRODUCTS_STORM_CHAMBER_V2",
    status: "ACTIVE",
    deterministic: true
  });

  const PRODUCTS = Object.freeze([
    {
      key: "archcoin",
      tier: "flagship",
      title: "ARCHCOIN",
      label: "Flagship",
      description:
        "The intelligence asset layer for a new financial era.",
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
      description:
        "Applied AI systems that think, learn, and execute.",
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
      description:
        "Nutrition intelligence for a stronger human foundation.",
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
      description:
        "Identity. Alignment. Purpose. Wave by wave.",
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
      description:
        "Language mastery that opens every door.",
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

  function buildCard(product) {
    const card = createEl(
      "article",
      [
        "card",
        product.tier === "flagship" ? "isFlagship" : "secondary",
        product.key === "archcoin" ? "archcoin" : "",
        product.key === "aai" ? "aai" : ""
      ].filter(Boolean).join(" ")
    );

    card.appendChild(createIcon(product.icon, product.theme));

    const tag = createEl("p", "tag", product.label);
    card.appendChild(tag);

    const title = createEl("h2", "title", product.title);
    card.appendChild(title);

    const desc = createEl("p", "desc", product.description);
    card.appendChild(desc);

    const ctaBar = createEl("div", "ctaBar");
    const link = createEl("a", "cardBtn");
    link.href = product.href;
    link.setAttribute("data-product-path", product.key);
    link.innerHTML = `<span>${product.button}</span><span aria-hidden="true">→</span>`;
    ctaBar.appendChild(link);
    card.appendChild(ctaBar);

    return card;
  }

  function renderProducts() {
    const grid = qs("#productsGrid");
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    PRODUCTS.forEach((product) => fragment.appendChild(buildCard(product)));
    grid.replaceChildren(fragment);
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
      }, 850);
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
