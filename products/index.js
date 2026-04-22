(() => {
  "use strict";

  const SHOWROOM_META = Object.freeze({
    name: "PRODUCTS_SHOWROOM",
    version: "V4",
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
      mode: "Front and center",
    },
    {
      key: "aai",
      title: "AAI",
      eyebrow: "Flagship path",
      copy:
        "Artificial agent intelligence expressed as a polished product line for elegant execution and agency.",
      accent: "#8ff0c5",
      mode: "Front and center",
    },
    {
      key: "baseline-nutrition-systems",
      title: "Baseline Nutrition Systems",
      eyebrow: "Product path",
      copy:
        "Nutritional foundation products organized around daily stability, clarity, and baseline support.",
      accent: "#9fc6ff",
      mode: "Filter path",
    },
    {
      key: "five-flags-whats-my-scene",
      title: "Five Flags / What’s My Scene",
      eyebrow: "Product path",
      copy:
        "Scene-identification products built to help people understand where they are and what opens next.",
      accent: "#ffca80",
      mode: "Filter path",
    },
    {
      key: "esl-traversal-learning",
      title: "ESL Traversal Learning",
      eyebrow: "Product path",
      copy:
        "Traversal-based English learning products designed around movement, comprehension, and structured progression.",
      accent: "#d7e4ff",
      mode: "Filter path",
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
    ctas: [],
    pathsGrid: null,
    pathCards: new Map(),
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
    dot.className = "capabilityDot";
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

  function buildPathCards() {
    ui.pathsGrid = byId("paths-grid");
    if (!ui.pathsGrid) {
      throw new Error("Missing #paths-grid.");
    }

    ui.pathsGrid.textContent = "";

    PATHS.forEach((item) => {
      const card = document.createElement("article");
      card.className = "pathCard";
      card.setAttribute("data-path-key", item.key);

      const eyebrow = document.createElement("div");
      eyebrow.className = "pathEyebrow";
      eyebrow.textContent = item.eyebrow;
      eyebrow.style.color = item.accent;

      const title = document.createElement("h4");
      title.className = "pathTitle";
      title.textContent = item.title;

      const copy = document.createElement("p");
      copy.className = "pathCopy";
      copy.textContent = item.copy;

      const row = document.createElement("div");
      row.className = "pathRow";

      const pill = document.createElement("div");
      pill.className = "pathPill";
      pill.textContent = item.mode;
      pill.style.color = item.accent;

      const button = document.createElement("button");
      button.className = "pathButton";
      button.type = "button";
      button.textContent = "Open Path";
      button.setAttribute("data-route-key", item.key);

      row.appendChild(pill);
      row.appendChild(button);

      card.appendChild(eyebrow);
      card.appendChild(title);
      card.appendChild(copy);
      card.appendChild(row);

      ui.pathsGrid.appendChild(card);
      ui.pathCards.set(item.key, { card, button, item });
    });
  }

  function refreshFlagshipSelection() {
    ui.cards.forEach((card, key) => {
      const active = key === state.activeKey;
      card.style.borderColor = active
        ? "rgba(241,210,141,.24)"
        : "rgba(173,212,255,.14)";
      card.style.boxShadow = active
        ? "0 28px 66px rgba(0,0,0,.48)"
        : "0 24px 60px rgba(0,0,0,.42)";
    });
  }

  function refreshPathSelection() {
    ui.pathCards.forEach(({ card, button, item }, key) => {
      const active = key === state.activeKey;
      card.style.transform = active ? "translateY(-2px)" : "translateY(0)";
      card.style.borderColor = active ? `${item.accent}55` : "rgba(173,212,255,.10)";
      card.style.boxShadow = active
        ? `0 18px 36px rgba(0,0,0,.24), 0 0 0 1px ${item.accent}22 inset`
        : "0 10px 24px rgba(0,0,0,.14)";
      button.style.borderColor = active ? `${item.accent}88` : "rgba(241,210,141,.26)";
    });
  }

  function refreshClosingCopy() {
    if (!ui.closingTitle || !ui.closingCopy) return;

    const active = PATHS.find((item) => item.key === state.activeKey) || PATHS[0];
    ui.closingTitle.textContent = `${active.title} is selected.`;
    ui.closingCopy.textContent =
      "The main chamber now filters and routes. The deeper Russian doll structure belongs inside the opened path, not on the showroom surface.";
  }

  function setActivePath(key) {
    state.activeKey = key;
    refreshFlagshipSelection();
    refreshPathSelection();
    refreshClosingCopy();
  }

  function wireCtas() {
    ui.ctas = qsa("[data-cta-key]").map((button) => {
      const key = button.getAttribute("data-cta-key");
      button.addEventListener("click", () => {
        setActivePath(key);
        const card = ui.cards.get(key);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
      return { key, button };
    });

    ui.pathCards.forEach(({ button }, key) => {
      button.addEventListener("click", () => {
        setActivePath(key);
      });
    });
  }

  function captureClosingNodes() {
    ui.closingTitle = byId("closing-title");
    ui.closingCopy = byId("closing-copy");
  }

  function revealSections() {
    const elements = qsa(".reveal");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add("isVisible"));
      return;
    }

    state.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("isVisible");
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

    const coin = qs(".coinHero");
    const aai = qs(".aaiMark");

    if (reduced) return;

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
    buildPathCards();
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
