(() => {
  "use strict";

  const SHOWROOM_META = Object.freeze({
    name: "PRODUCTS_SHOWROOM",
    version: "V7",
    contract: "PRODUCTS_SHOWROOM_V1",
    page: "products-showroom",
  });

  const ROUTES = Object.freeze({
    archcoin: "/archcoin/",
    aai: "/aai/",
    "baseline-nutrition-systems": "/nutrition/",
    "five-flags-whats-my-scene": "/five-flags/",
    "esl-traversal-learning": "/education/",
  });

  const PATHS = Object.freeze([
    {
      key: "archcoin",
      title: "ARCHCOIN",
      summary:
        "The main chamber now filters and routes. The deeper Russian doll structure belongs inside the opened ARCHCOIN path, not on the showroom surface.",
      accent: "#f1d28d",
    },
    {
      key: "aai",
      title: "AAI",
      summary:
        "The main chamber now filters and routes. The deeper Russian doll structure belongs inside the opened AAI path, not on the showroom surface.",
      accent: "#8ff0c5",
    },
    {
      key: "baseline-nutrition-systems",
      title: "Baseline Nutrition Systems",
      summary:
        "This path is now visible as part of the filter layer and routes into the nutrition surface.",
      accent: "#9fc6ff",
    },
    {
      key: "five-flags-whats-my-scene",
      title: "Five Flags / What’s My Scene",
      summary:
        "This path is now visible as part of the filter layer and routes into the five-flags surface.",
      accent: "#ffca80",
    },
    {
      key: "esl-traversal-learning",
      title: "ESL Traversal Learning",
      summary:
        "This path is now visible as part of the filter layer and routes into the education surface.",
      accent: "#d7e4ff",
    },
  ]);

  const state = {
    activeKey: "archcoin",
    raf: 0,
  };

  const ui = {
    host: null,
    closingTitle: null,
    closingCopy: null,
    flagshipCards: new Map(),
    pathCards: new Map(),
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

  function captureNodes() {
    ui.closingTitle = byId("closing-title");
    ui.closingCopy = byId("closing-copy");

    qsa("[data-product-key]").forEach((node) => {
      ui.flagshipCards.set(node.getAttribute("data-product-key"), node);
    });

    qsa("[data-path-key]").forEach((node) => {
      ui.pathCards.set(node.getAttribute("data-path-key"), node);
    });
  }

  function refreshSelection() {
    ui.flagshipCards.forEach((card, key) => {
      const active = key === state.activeKey;
      card.style.borderColor = active
        ? "rgba(241,210,141,.24)"
        : "rgba(173,212,255,.14)";
      card.style.boxShadow = active
        ? "0 28px 66px rgba(0,0,0,.48)"
        : "0 24px 60px rgba(0,0,0,.42)";
    });

    ui.pathCards.forEach((card, key) => {
      const path = PATHS.find((item) => item.key === key);
      const active = key === state.activeKey;
      if (!path) return;

      card.style.borderColor = active ? `${path.accent}66` : "rgba(173,212,255,.10)";
      card.style.boxShadow = active
        ? `0 18px 36px rgba(0,0,0,.24), 0 0 0 1px ${path.accent}22 inset`
        : "0 10px 24px rgba(0,0,0,.14)";
      card.style.transform = active ? "translateY(-2px)" : "translateY(0)";
    });
  }

  function refreshClosing() {
    const path = PATHS.find((item) => item.key === state.activeKey) || PATHS[0];
    if (!ui.closingTitle || !ui.closingCopy) return;

    ui.closingTitle.textContent = `${path.title} is selected.`;
    ui.closingCopy.textContent = path.summary;
  }

  function setActive(key) {
    state.activeKey = key;
    refreshSelection();
    refreshClosing();
  }

  function goToRoute(key) {
    const href = ROUTES[key];
    if (!href) return;
    window.location.assign(href);
  }

  function wireButtons() {
    qsa("[data-route-key]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const key = button.getAttribute("data-route-key");
        if (!ROUTES[key]) return;
        setActive(key);
        goToRoute(key);
      });
    });

    qsa("[data-cta-key]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const key = button.getAttribute("data-cta-key");
        if (!ROUTES[key]) return;
        setActive(key);
        goToRoute(key);
      });
    });
  }

  function attachMotion() {
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

    const coin = qs(".coinHero");
    const aai = qs(".aaiMark");

    const tick = (time) => {
      const t = (time || 0) * 0.001;

      if (coin) {
        coin.style.transform = `rotate(${Math.sin(t * 0.92) * 5}deg)`;
      }

      if (aai) {
        aai.style.transform = `rotate(${45 + Math.sin(t * 0.74 + 0.8) * 7}deg)`;
      }

      state.raf = window.requestAnimationFrame(tick);
    };

    state.raf = window.requestAnimationFrame(tick);

    window.addEventListener(
      "pagehide",
      () => {
        window.cancelAnimationFrame(state.raf);
      },
      { once: true }
    );
  }

  function bootstrap() {
    ui.host = byId("products-host");
    assertShowroomContract(ui.host);
    captureNodes();
    wireButtons();
    setActive("archcoin");
    attachMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
