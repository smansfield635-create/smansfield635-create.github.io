(() => {
  "use strict";

  const SHOWROOM_META = Object.freeze({
    name: "PRODUCTS_SHOWROOM",
    version: "V1",
    contract: "PRODUCTS_SHOWROOM_V1",
    page: "products-showroom",
  });

  const PRODUCTS = Object.freeze({
    archcoin: {
      title: "ARCHCOIN",
      category: "Premium financial-intelligence asset",
      description:
        "A flagship value product designed to carry identity, scarcity, and ownership with a sharper public presence.",
      capabilities: [
        "Premium value surface",
        "Private ownership signal",
        "Brand-defining asset layer",
      ],
      meta: "Signature asset · Private capital orientation",
      cta: "Explore ARCHCOIN",
      detailHeadline: "Built to read like an asset, not a feature.",
      detailCopy:
        "ARCHCOIN should feel substantial on arrival: premium, finite, and deliberate. It presents value with gravity and identity instead of reading like a module hidden inside a broader stack.",
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
    },
  });

  const SUPPORTING_PRODUCTS = Object.freeze([
    {
      title: "Runtime Surfaces",
      copy:
        "Public-facing product delivery built to feel smooth, premium, and ready for release.",
    },
    {
      title: "Instrumentation",
      copy:
        "Evidence and verification layers that support product quality behind the scenes without owning the page.",
    },
  ]);

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

  function createCapabilityRow(text, toneClass) {
    const row = document.createElement("div");
    row.className = "capability";

    const dot = document.createElement("span");
    dot.className = "capability-dot";
    if (toneClass) {
      dot.classList.add(toneClass);
    }

    const body = document.createElement("div");
    body.textContent = text;

    row.appendChild(dot);
    row.appendChild(body);
    return row;
  }

  function createSupportCard(item) {
    const card = document.createElement("article");
    card.className = "support-card";

    const title = document.createElement("h4");
    title.className = "support-title";
    title.textContent = item.title;

    const copy = document.createElement("p");
    copy.className = "support-copy";
    copy.textContent = item.copy;

    card.appendChild(title);
    card.appendChild(copy);
    return card;
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
          capabilities.appendChild(createCapabilityRow(item));
        });
      }
    });
  }

  function hydrateDetails() {
    qsa("[data-detail-key]").forEach((card) => {
      const key = card.getAttribute("data-detail-key");
      const product = PRODUCTS[key];
      if (!product) return;

      const headline = qs('[data-field="headline"]', card);
      const copy = qs('[data-field="copy"]', card);

      if (headline) headline.textContent = product.detailHeadline;
      if (copy) copy.textContent = product.detailCopy;
    });
  }

  function hydrateSupportingProducts() {
    const grid = byId("support-grid");
    if (!grid) return;

    grid.textContent = "";
    SUPPORTING_PRODUCTS.forEach((item) => {
      grid.appendChild(createSupportCard(item));
    });
  }

  function wireCtas() {
    qsa("[data-cta-key]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.getAttribute("data-cta-key");
        const product = PRODUCTS[key];
        if (!product) return;

        window.alert(`${product.title}\n\n${product.category}\n\n${product.description}`);
      });
    });
  }

  function revealSections() {
    const elements = qsa(".reveal");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function attachMotion() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const coin = qs(".coin-hero");
    const aai = qs(".aai-mark");

    let raf = 0;

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

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    window.addEventListener(
      "pagehide",
      () => {
        window.cancelAnimationFrame(raf);
      },
      { once: true }
    );
  }

  function bootstrap() {
    const host = byId("products-host");
    assertShowroomContract(host);
    hydrateFlagshipCards();
    hydrateDetails();
    hydrateSupportingProducts();
    wireCtas();
    revealSections();
    attachMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
