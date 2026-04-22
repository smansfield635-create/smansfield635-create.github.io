(() => {
  "use strict";

  const SHOWROOM_META = Object.freeze({
    name: "PRODUCTS_SHOWROOM",
    version: "V3",
    contract: "PRODUCTS_SHOWROOM_V1",
    page: "products-showroom",
  });

  const PRODUCTS = Object.freeze({
    archcoin: {
      title: "ARCHCOIN",
      category: "Premium financial-intelligence asset",
      description:
        "A flagship value product built to hold identity, scarcity, and ownership with a sharper public presence.",
      capabilities: [
        "Premium value surface",
        "Private ownership signal",
        "Brand-defining asset layer",
      ],
      meta: "Signature asset · Private capital orientation",
      cta: "Explore ARCHCOIN",
      detailHeadline: "Built to read like an asset, not a feature.",
      detailCopy:
        "ARCHCOIN should feel substantial on arrival: premium, finite, and deliberate. It presents value with gravity and identity instead of reading like a hidden module inside a broader stack.",
      accent: "#f1d28d",
    },
    aai: {
      title: "AAI",
      category: "Artificial Agent Intelligence",
      description:
        "A flagship intelligence product shaped for elegant execution, usable agency, and refined operational presence.",
      capabilities: [
        "Agent intelligence layer",
        "Precision-built orchestration",
        "Elegant operational behavior",
      ],
      meta: "Flagship intelligence · Product-first expression",
      cta: "Explore AAI",
      detailHeadline: "Built to feel intelligent, polished, and real.",
      detailCopy:
        "AAI should present as a living product line for artificial agent intelligence: powerful, composed, and premium. It is not abstract intelligence talk. It is a product with form, presence, and purpose.",
      accent: "#8ff0c5",
    },
  });

  const PATHS = Object.freeze([
    {
      key: "archcoin",
      title: "ARCHCOIN",
      eyebrow: "Flagship path",
      copy:
        "Premium financial-intelligence asset with identity, scarcity, and ownership at the center.",
      accent: "#f1d28d",
      mode: "flagship",
    },
    {
      key: "aai",
      title: "AAI",
      eyebrow: "Flagship path",
      copy:
        "Artificial agent intelligence expressed as a polished product line for elegant execution and agency.",
      accent: "#8ff0c5",
      mode: "flagship",
    },
    {
      key: "baseline-nutrition-systems",
      title: "Baseline Nutrition Systems",
      eyebrow: "Product path",
      copy:
        "Nutritional foundation products organized around daily stability, clarity, and baseline support.",
      accent: "#9fc6ff",
      mode: "path",
    },
    {
      key: "five-flags-whats-my-scene",
      title: "Five Flags / What’s My Scene",
      eyebrow: "Product path",
      copy:
        "Scene-identification and interpretation products built to help people understand where they are and what opens next.",
      accent: "#ffca80",
      mode: "path",
    },
    {
      key: "esl-traversal-learning",
      title: "ESL Traversal Learning",
      eyebrow: "Product path",
      copy:
        "Traversal-based English learning products designed around movement, comprehension, and structured progression.",
      accent: "#d7e4ff",
      mode: "path",
    },
  ]);

  const state = {
    activeKey: "archcoin",
    revealObserver: null,
    raf: 0,
  };

  const ui = {
    host: null,
    cards: new Map(),
    details: new Map(),
    ctas: [],
    routeSection: null,
    routeGrid: null,
    routeCards: new Map(),
    closingTitle: null,
    closingCopy: null,
  };

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function assertShowroomContract(host) {
    if (!host) {
      throw new Error("Missing #products-host.");
    }

    const contract = host.getAttribute("data-showroom-contract");
    const page = host.getAttribute("data-page");

    if (contract !== SHOWROOM_META.contract) {
      throw new Error(`Showroom contract mismatch. Expected ${SHOWROOM_META.contract}.`);
    }

    if (page !== SHOWROOM_META.page) {
      throw new Error(`Showroom page mismatch. Expected ${SHOWROOM_META.page}.`);
    }
  }

  function createCapabilityRow(text, toneColor) {
    const row = document.createElement("div");
    row.className = "capability";

    const dot = document.createElement("span");
    dot.className = "capability-dot";
    dot.style.background = toneColor;
    dot.style.boxShadow = `0 0 0 4px ${toneColor}22`;

    const body = document.createElement("div");
    body.textContent = text;

    row.appendChild(dot);
    row.appendChild(body);
    return row;
  }

  function hydrateFlagshipCards() {
    qsa("[data-product-key]").forEach((card) => {
      const key = card.getAttribute("data-product-key");
      const product = PRODUCTS[key];
      if (!product) return;

      const title = qs('[data-field="title"]', card);
      const category = qs('[data-field="category"]', card);
      const description = qs('[data-field="description"]', card);
      const meta = qs('[data-field="meta"]', card);
      const capabilities = qs('[data-field="capabilities"]', card);
      const cta = qs("[data-cta-key]", card);

      if (title) title.textContent = product.title;
      if (category) category.textContent = product.category;
      if (description) description.textContent = product.description;
      if (meta) meta.textContent = product.meta;
      if (cta) cta.textContent = product.cta;

      if (capabilities) {
        capabilities.textContent = "";
        product.capabilities.forEach((item) => {
          capabilities.appendChild(createCapabilityRow(item, product.accent));
        });
      }

      ui.cards.set(key, card);
    });
  }

  function hideLegacyLowerSections() {
    const details = qs(".details");
    const supporting = qs(".supporting");

    if (details) {
      details.style.display = "none";
    }

    if (supporting) {
      supporting.style.display = "none";
    }
  }

  function buildRouteSection() {
    const flagship = qs(".flagship");
    if (!flagship || !flagship.parentNode) return;

    const section = document.createElement("section");
    section.className = "supporting reveal reveal-delay-4";
    section.setAttribute("aria-label", "Product paths");

    const kicker = document.createElement("p");
    kicker.className = "section-kicker";
    kicker.textContent = "Open a path";

    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = "Five product paths. Brief, clear, and ready to open.";

    const copy = document.createElement("p");
    copy.className = "section-copy";
    copy.textContent =
      "This chamber now acts as a premium filter. Each box gives a concise read and opens the next path without dragging the full Russian doll structure onto the main page.";

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit,minmax(240px,1fr))";
    grid.style.gap = "14px";

    PATHS.forEach((item) => {
      const card = document.createElement("article");
      card.className = "support-card";
      card.setAttribute("data-path-key", item.key);
      card.style.display = "grid";
      card.style.gap = "12px";
      card.style.alignContent = "start";
      card.style.borderColor = "rgba(173,212,255,.10)";
      card.style.transition = "transform 180ms ease,border-color 180ms ease,box-shadow 180ms ease";
      card.style.boxShadow = "0 10px 24px rgba(0,0,0,.14)";

      const eyebrow = document.createElement("div");
      eyebrow.textContent = item.eyebrow;
      eyebrow.style.color = item.accent;
      eyebrow.style.fontSize = ".72rem";
      eyebrow.style.fontWeight = "800";
      eyebrow.style.letterSpacing = ".12em";
      eyebrow.style.textTransform = "uppercase";

      const titleNode = document.createElement("h4");
      titleNode.className = "support-title";
      titleNode.textContent = item.title;

      const copyNode = document.createElement("p");
      copyNode.className = "support-copy";
      copyNode.textContent = item.copy;

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.gap = "10px";
      row.style.flexWrap = "wrap";

      const pill = document.createElement("div");
      pill.textContent = item.mode === "flagship" ? "Front and center" : "Filter path";
      pill.style.display = "inline-flex";
      pill.style.alignItems = "center";
      pill.style.padding = "9px 12px";
      pill.style.border = "1px solid rgba(173,212,255,.10)";
      pill.style.borderRadius = "999px";
      pill.style.background = "rgba(255,255,255,.035)";
      pill.style.color = item.accent;
      pill.style.fontSize = ".76rem";
      pill.style.fontWeight = "800";
      pill.style.letterSpacing = ".08em";
      pill.style.textTransform = "uppercase";
      pill.style.whiteSpace = "nowrap";

      const button = document.createElement("button");
      button.className = "cta-button";
      button.type = "button";
      button.textContent = "Open Path";
      button.setAttribute("data-route-key", item.key);
      button.style.marginLeft = "auto";

      row.appendChild(pill);
      row.appendChild(button);

      card.appendChild(eyebrow);
      card.appendChild(titleNode);
      card.appendChild(copyNode);
      card.appendChild(row);
      grid.appendChild(card);

      ui.routeCards.set(item.key, { card, button, item });
    });

    section.appendChild(kicker);
    section.appendChild(title);
    section.appendChild(copy);
    section.appendChild(grid);

    flagship.parentNode.insertBefore(section, flagship.nextSibling);

    ui.routeSection = section;
    ui.routeGrid = grid;
  }

  function refreshRouteSelection() {
    ui.routeCards.forEach(({ card, button, item }, key) => {
      const active = key === state.activeKey;
      card.style.transform = active ? "translateY(-2px)" : "translateY(0)";
      card.style.borderColor = active ? `${item.accent}55` : "rgba(173,212,255,.10)";
      card.style.boxShadow = active
        ? `0 18px 36px rgba(0,0,0,.24), 0 0 0 1px ${item.accent}22 inset`
        : "0 10px 24px rgba(0,0,0,.14)";
      button.style.borderColor = active ? `${item.accent}88` : "rgba(241,210,141,.26)";
    });
  }

  function setClosingCopy() {
    if (!ui.closingTitle || !ui.closingCopy) return;

    const active = PATHS.find((item) => item.key === state.activeKey) || PATHS[0];

    ui.closingTitle.textContent = `${active.title} is selected.`;
    ui.closingCopy.textContent =
      "The main chamber now filters and routes. The deeper Russian doll structure belongs inside the opened path, not on the showroom surface.";
  }

  function setActivePath(key) {
    state.activeKey = key;
    refreshRouteSelection();
    setClosingCopy();

    if (key === "archcoin" || key === "aai") {
      const card = ui.cards.get(key);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function wireCtas() {
    ui.ctas = qsa("[data-cta-key]").map((button) => {
      const key = button.getAttribute("data-cta-key");
      button.addEventListener("click", () => {
        setActivePath(key);
      });
      return { key, button };
    });

    ui.routeCards.forEach(({ button }, key) => {
      button.addEventListener("click", () => {
        setActivePath(key);
      });
    });
  }

  function captureClosingNodes() {
    const closing = qs(".closing");
    if (!closing) return;

    ui.closingTitle = qs(".section-title", closing);
    ui.closingCopy = qs(".closing-copy", closing);
  }

  function revealSections() {
    const elements = qsa(".reveal");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    state.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          state.revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => state.revealObserver.observe(el));
  }

  function attachMotion() {
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const coin = qs(".coin-hero");
    const aai = qs(".aai-mark");

    if (reduced) {
      return;
    }

    const tick = (time) => {
      const t = (time || 0) * 0.001;

      if (coin) {
        const spin = Math.sin(t * 0.92) * 5;
        coin.style.transform = `rotate(${spin}deg)`;
      }

      if (aai) {
        const spin = Math.sin(t * 0.74 + 0.8) * 7;
        aai.style.transform = `rotate(${45 + spin}deg)`;
      }

      state.raf = window.requestAnimationFrame(tick);
    };

    state.raf = window.requestAnimationFrame(tick);

    window.addEventListener(
      "pagehide",
      () => {
        if (state.revealObserver) {
          state.revealObserver.disconnect();
        }
        window.cancelAnimationFrame(state.raf);
      },
      { once: true }
    );
  }

  function bootstrap() {
    ui.host = byId("products-host");
    assertShowroomContract(ui.host);
    hydrateFlagshipCards();
    hideLegacyLowerSections();
    buildRouteSection();
    captureClosingNodes();
    wireCtas();
    revealSections();
    setActivePath("archcoin");
    attachMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
