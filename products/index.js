(() => {
  "use strict";

  const SHOWROOM_META = Object.freeze({
    name: "PRODUCTS_SHOWROOM",
    version: "V2",
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

  const SOLAR_SYSTEM = Object.freeze([
    {
      key: "archcoin",
      label: "ARCHCOIN",
      orbit: "inner",
      size: 18,
      angle: 0.15,
      speed: 0.00055,
      color: "#f1d28d",
      glow: "rgba(241,210,141,0.36)",
    },
    {
      key: "aai",
      label: "AAI",
      orbit: "inner",
      size: 16,
      angle: 3.2,
      speed: 0.00072,
      color: "#8ff0c5",
      glow: "rgba(143,240,197,0.34)",
    },
    {
      key: "runtime",
      label: "Runtime",
      orbit: "mid",
      size: 12,
      angle: 1.2,
      speed: 0.00038,
      color: "#9fc6ff",
      glow: "rgba(159,198,255,0.28)",
    },
    {
      key: "instrumentation",
      label: "Instrumentation",
      orbit: "mid",
      size: 11,
      angle: 4.35,
      speed: 0.00034,
      color: "#ffca80",
      glow: "rgba(255,202,128,0.24)",
    },
    {
      key: "release",
      label: "Release",
      orbit: "outer",
      size: 10,
      angle: 2.15,
      speed: 0.00022,
      color: "#d7e4ff",
      glow: "rgba(215,228,255,0.22)",
    },
  ]);

  const state = {
    activeKey: "archcoin",
    revealObserver: null,
    raf: 0,
  };

  const ui = {
    host: null,
    supportGrid: null,
    cards: new Map(),
    details: new Map(),
    ctas: [],
    solarSection: null,
    solarStage: null,
    solarTitle: null,
    solarCopy: null,
    solarLabel: null,
    solarNodes: [],
    sun: null,
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
          capabilities.appendChild(createCapabilityRow(item, product.accent));
        });
      }

      card.dataset.active = key === state.activeKey ? "true" : "false";
      ui.cards.set(key, card);
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

      ui.details.set(key, card);
    });
  }

  function hydrateSupportingProducts() {
    ui.supportGrid = byId("support-grid");
    if (!ui.supportGrid) return;

    ui.supportGrid.textContent = "";
    SUPPORTING_PRODUCTS.forEach((item) => {
      ui.supportGrid.appendChild(createSupportCard(item));
    });
  }

  function buildSolarSystemSection() {
    const supporting = qs(".supporting");
    if (!supporting || !supporting.parentNode) return;

    const section = document.createElement("section");
    section.className = "supporting reveal reveal-delay-4";
    section.setAttribute("aria-label", "Solar system");

    const kicker = document.createElement("p");
    kicker.className = "section-kicker";
    kicker.textContent = "Core structure";

    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = "The sun is the core. The system orbits around it.";

    const copy = document.createElement("p");
    copy.className = "section-copy";
    copy.textContent =
      "ARCHCOIN and AAI now sit inside a larger product field. The center holds the governing visual truth. Supporting bodies orbit it in ordered motion.";

    const stage = document.createElement("div");
    stage.setAttribute("id", "products-solar-stage");

    const style = stage.style;
    style.position = "relative";
    style.minHeight = "520px";
    style.border = "1px solid rgba(173,212,255,.10)";
    style.borderRadius = "28px";
    style.background =
      "radial-gradient(circle at 50% 50%, rgba(58,103,188,.10), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.015))";
    style.overflow = "hidden";
    style.boxShadow = "inset 0 0 44px rgba(255,255,255,.02)";

    const label = document.createElement("div");
    label.setAttribute("id", "products-solar-label");
    label.textContent = "ARCHCOIN";
    label.style.position = "absolute";
    label.style.left = "20px";
    label.style.bottom = "18px";
    label.style.padding = "10px 14px";
    label.style.borderRadius = "999px";
    label.style.border = "1px solid rgba(173,212,255,.10)";
    label.style.background = "rgba(9,18,40,.68)";
    label.style.color = "#edf5ff";
    label.style.fontSize = ".84rem";
    label.style.fontWeight = "800";
    label.style.letterSpacing = ".12em";
    label.style.textTransform = "uppercase";
    label.style.backdropFilter = "blur(8px)";

    const info = document.createElement("div");
    info.style.position = "absolute";
    info.style.right = "20px";
    info.style.top = "18px";
    info.style.width = "min(320px, calc(100% - 40px))";
    info.style.padding = "16px";
    info.style.borderRadius = "20px";
    info.style.border = "1px solid rgba(173,212,255,.10)";
    info.style.background = "rgba(9,18,40,.62)";
    info.style.backdropFilter = "blur(8px)";
    info.style.boxShadow = "0 12px 30px rgba(0,0,0,.20)";

    const infoTitle = document.createElement("div");
    infoTitle.setAttribute("id", "products-solar-title");
    infoTitle.textContent = "ARCHCOIN";
    infoTitle.style.marginBottom = "8px";
    infoTitle.style.fontFamily = 'Georgia, "Times New Roman", serif';
    infoTitle.style.fontSize = "1.4rem";
    infoTitle.style.lineHeight = "1.05";
    infoTitle.style.color = "#f1d28d";

    const infoCopy = document.createElement("p");
    infoCopy.setAttribute("id", "products-solar-copy");
    infoCopy.textContent =
      "Flagship value surface with gravity, identity, and premium public presence.";
    infoCopy.style.margin = "0";
    infoCopy.style.color = "#9fb2d2";
    infoCopy.style.fontSize = ".92rem";
    infoCopy.style.lineHeight = "1.62";

    info.appendChild(infoTitle);
    info.appendChild(infoCopy);
    stage.appendChild(info);
    stage.appendChild(label);

    section.appendChild(kicker);
    section.appendChild(title);
    section.appendChild(copy);
    section.appendChild(stage);

    supporting.parentNode.insertBefore(section, supporting);

    ui.solarSection = section;
    ui.solarStage = stage;
    ui.solarTitle = infoTitle;
    ui.solarCopy = infoCopy;
    ui.solarLabel = label;
  }

  function buildSolarNodes() {
    if (!ui.solarStage) return;

    const centerGlow = document.createElement("div");
    centerGlow.style.position = "absolute";
    centerGlow.style.left = "50%";
    centerGlow.style.top = "50%";
    centerGlow.style.width = "320px";
    centerGlow.style.height = "320px";
    centerGlow.style.transform = "translate(-50%, -50%)";
    centerGlow.style.borderRadius = "999px";
    centerGlow.style.background =
      "radial-gradient(circle, rgba(241,210,141,.20) 0%, rgba(241,210,141,.06) 34%, transparent 70%)";
    centerGlow.style.filter = "blur(8px)";
    centerGlow.style.pointerEvents = "none";
    ui.solarStage.appendChild(centerGlow);

    const sun = document.createElement("div");
    sun.setAttribute("aria-hidden", "true");
    sun.style.position = "absolute";
    sun.style.left = "50%";
    sun.style.top = "50%";
    sun.style.width = "132px";
    sun.style.height = "132px";
    sun.style.transform = "translate(-50%, -50%)";
    sun.style.borderRadius = "999px";
    sun.style.background =
      "radial-gradient(circle at 30% 28%, rgba(255,245,214,.96), transparent 18%), linear-gradient(145deg, #f7e3a8, #d5a84f 56%, #9e6f1d)";
    sun.style.border = "1px solid rgba(255,232,170,.42)";
    sun.style.boxShadow =
      "0 20px 52px rgba(0,0,0,.42), inset 0 0 32px rgba(255,255,255,.14)";
    ui.solarStage.appendChild(sun);
    ui.sun = sun;

    const innerSun = document.createElement("div");
    innerSun.style.position = "absolute";
    innerSun.style.inset = "12px";
    innerSun.style.borderRadius = "999px";
    innerSun.style.border = "1px solid rgba(255,247,220,.28)";
    innerSun.style.display = "grid";
    innerSun.style.placeItems = "center";
    innerSun.style.color = "#1e1505";
    innerSun.style.fontFamily = 'Georgia, "Times New Roman", serif';
    innerSun.style.fontSize = "1.18rem";
    innerSun.style.fontWeight = "700";
    innerSun.style.letterSpacing = ".04em";
    innerSun.textContent = "SUN";
    sun.appendChild(innerSun);

    const orbitConfig = {
      inner: { rx: 118, ry: 72, border: "rgba(241,210,141,.12)" },
      mid: { rx: 176, ry: 112, border: "rgba(159,198,255,.10)" },
      outer: { rx: 236, ry: 154, border: "rgba(215,228,255,.08)" },
    };

    Object.values(orbitConfig).forEach((orbit) => {
      const ring = document.createElement("div");
      ring.setAttribute("aria-hidden", "true");
      ring.style.position = "absolute";
      ring.style.left = "50%";
      ring.style.top = "50%";
      ring.style.width = `${orbit.rx * 2}px`;
      ring.style.height = `${orbit.ry * 2}px`;
      ring.style.transform = "translate(-50%, -50%)";
      ring.style.borderRadius = "999px";
      ring.style.border = `1px solid ${orbit.border}`;
      ring.style.pointerEvents = "none";
      ui.solarStage.appendChild(ring);
    });

    ui.solarNodes = SOLAR_SYSTEM.map((item) => {
      const node = document.createElement("button");
      node.type = "button";
      node.textContent = "";
      node.setAttribute("aria-label", item.label);
      node.style.position = "absolute";
      node.style.left = "50%";
      node.style.top = "50%";
      node.style.width = `${item.size * 2}px`;
      node.style.height = `${item.size * 2}px`;
      node.style.marginLeft = `${-item.size}px`;
      node.style.marginTop = `${-item.size}px`;
      node.style.borderRadius = "999px";
      node.style.border = `1px solid ${item.glow}`;
      node.style.background = `radial-gradient(circle at 30% 28%, rgba(255,255,255,.42), transparent 22%), ${item.color}`;
      node.style.boxShadow = `0 0 0 6px ${item.glow.replace("0.36", "0.10").replace("0.34", "0.10").replace("0.28", "0.08").replace("0.24", "0.06").replace("0.22", "0.05")}`;
      node.style.cursor = "pointer";
      node.style.zIndex = item.orbit === "inner" ? "3" : "2";

      node.addEventListener("click", () => setActiveProduct(item.key));
      ui.solarStage.appendChild(node);

      return { ...item, node };
    });
  }

  function setSolarCopy(key) {
    if (!ui.solarTitle || !ui.solarCopy || !ui.solarLabel) return;

    if (key === "archcoin") {
      ui.solarTitle.textContent = "ARCHCOIN";
      ui.solarCopy.textContent =
        "Flagship value surface with gravity, identity, and premium public presence.";
      ui.solarLabel.textContent = "ARCHCOIN";
      return;
    }

    if (key === "aai") {
      ui.solarTitle.textContent = "AAI";
      ui.solarCopy.textContent =
        "Flagship intelligence layer for elegant agency, orchestration, and usable execution.";
      ui.solarLabel.textContent = "AAI";
      return;
    }

    ui.solarTitle.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    ui.solarCopy.textContent =
      "Supporting product body positioned in orbit around the central core.";
    ui.solarLabel.textContent = key;
  }

  function setActiveProduct(key) {
    state.activeKey = key === "aai" ? "aai" : key === "archcoin" ? "archcoin" : state.activeKey;

    ui.cards.forEach((card, productKey) => {
      const active = productKey === state.activeKey;
      card.style.borderColor = active
        ? "rgba(241,210,141,.24)"
        : "rgba(173,212,255,.14)";
      card.style.boxShadow = active
        ? "0 28px 66px rgba(0,0,0,.48)"
        : "0 24px 60px rgba(0,0,0,.42)";
    });

    ui.details.forEach((card, productKey) => {
      const active = productKey === state.activeKey;
      card.style.borderColor = active
        ? "rgba(241,210,141,.20)"
        : "rgba(173,212,255,.14)";
    });

    ui.ctas.forEach(({ key, button }) => {
      button.style.borderColor =
        key === state.activeKey
          ? "rgba(241,210,141,.42)"
          : "rgba(241,210,141,.26)";
    });

    setSolarCopy(state.activeKey);
  }

  function wireCtas() {
    ui.ctas = qsa("[data-cta-key]").map((button) => {
      const key = button.getAttribute("data-cta-key");
      button.addEventListener("click", () => {
        setActiveProduct(key);
        const card = ui.cards.get(key);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
      return { key, button };
    });
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

      if (ui.sun) {
        const sunScale = 1 + Math.sin(t * 1.3) * 0.02;
        ui.sun.style.transform = `translate(-50%, -50%) scale(${sunScale})`;
      }

      ui.solarNodes.forEach((item) => {
        const orbitMap = {
          inner: { rx: 118, ry: 72 },
          mid: { rx: 176, ry: 112 },
          outer: { rx: 236, ry: 154 },
        };
        const orbit = orbitMap[item.orbit];
        const angle = t * (item.speed * 1000) + item.angle;
        const x = Math.cos(angle) * orbit.rx;
        const y = Math.sin(angle) * orbit.ry;
        const active = item.key === state.activeKey;

        item.node.style.transform = `translate(${x}px, ${y}px) scale(${active ? 1.12 : 1})`;
        item.node.style.boxShadow = active
          ? `0 0 0 8px ${item.glow.replace("0.36", "0.14").replace("0.34", "0.14").replace("0.28", "0.12").replace("0.24", "0.10").replace("0.22", "0.09")}`
          : `0 0 0 6px ${item.glow.replace("0.36", "0.10").replace("0.34", "0.10").replace("0.28", "0.08").replace("0.24", "0.06").replace("0.22", "0.05")}`;
      });

      state.raf = window.requestAnimationFrame(tick);
    };

    if (reduced) {
      ui.solarNodes.forEach((item) => {
        item.node.style.transform = "translate(0px, 0px)";
      });
      return;
    }

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
    hydrateDetails();
    hydrateSupportingProducts();
    buildSolarSystemSection();
    buildSolarNodes();
    wireCtas();
    revealSections();
    setActiveProduct("archcoin");
    attachMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
