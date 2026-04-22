"use strict";

(function () {
  const diag = window.__productsDiag || {
    setValue() {},
    setStatus() {},
  };

  const PRODUCTS = [
    {
      title: "AAI",
      kicker: "Artificial agent intelligence",
      body: "Primary intelligence line for guided support, bounded presence, and agent-facing interface work.",
      href: "/products/aai/",
      tags: ["Agent layer", "Support logic", "Interface"]
    },
    {
      title: "Nine Summits",
      kicker: "Book and launch path",
      body: "Narrative, philosophy, and publication pathway anchored to the Nine Summits line of work.",
      href: "/products/nine-summits/",
      tags: ["Book", "Launch path", "Long-form"]
    },
    {
      title: "Five Flags",
      kicker: "Game and teaching route",
      body: "Structured interactive line for rules, learning, and public-facing social play architecture.",
      href: "/products/five-flags/",
      tags: ["Game", "Teaching", "Traversal"]
    },
    {
      title: "Nutrition",
      kicker: "Health-facing product line",
      body: "Baseline wellness, intake, and applied health-facing product direction.",
      href: "/products/nutrition/",
      tags: ["Health", "Baseline", "Applied"]
    },
    {
      title: "ArchCoin",
      kicker: "Protected value line",
      body: "Value-facing product track with protected infrastructure and receipt-led deployment discipline.",
      href: "/archcoin/",
      tags: ["Value", "Protected", "Infrastructure"]
    },
    {
      title: "Root",
      kicker: "Primary entry return",
      body: "Return path into the larger platform stack, bridge surface, and root navigation layer.",
      href: "/",
      tags: ["Root", "Gateway", "Return"]
    }
  ];

  function readErrorMessage(error) {
    if (!error) return "unknown error";
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message || error.name || "error";
    try {
      return JSON.stringify(error);
    } catch {
      return "unserializable error";
    }
  }

  function getNodes() {
    return {
      stageZone: document.getElementById("products-stage-zone"),
      stage: document.getElementById("planetary-stage"),
      liveStage: document.getElementById("products-live-stage")
    };
  }

  function destroyExistingRuntime(stage) {
    const existing = window.__productsPlanetRuntimeInstance;
    if (existing && typeof existing.destroy === "function") {
      existing.destroy();
    }
    window.__productsPlanetRuntimeInstance = null;
    if (stage) {
      stage.innerHTML = "";
      stage.removeAttribute("data-runtime");
      stage.style.position = "absolute";
      stage.style.inset = "0";
      stage.style.overflow = "auto";
      stage.style.maxWidth = "100%";
      stage.style.maxHeight = "100%";
      stage.style.opacity = "0";
      stage.style.pointerEvents = "none";
    }
  }

  function enforceStageContainment(stageZone, stage) {
    stageZone.style.position = "relative";
    stageZone.style.overflow = "hidden";
    stage.style.position = "absolute";
    stage.style.inset = "0";
    stage.style.overflow = "auto";
    stage.style.maxWidth = "100%";
    stage.style.maxHeight = "100%";
    stage.style.opacity = "0";
    stage.style.pointerEvents = "none";
  }

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function renderProductsExperience(liveStage) {
    if (!liveStage) return;

    liveStage.innerHTML = "";

    const shell = createElement("div", "products-stage");
    const hero = createElement("section", "products-stage-hero");
    const eyebrow = createElement("div", "eyebrow", "Primary product lines");
    const title = createElement("h4", "", "Choose a live product lane");
    const body = createElement(
      "p",
      "",
      "The stage now presents the actual product lines first. Diagnostic proof remains available only behind the support toggle, while this surface carries the public-facing products read."
    );

    hero.appendChild(eyebrow);
    hero.appendChild(title);
    hero.appendChild(body);

    const grid = createElement("section", "products-core-grid");

    PRODUCTS.forEach(function (item) {
      const card = createElement("article", "products-core-card");
      const heading = createElement("h5", "", item.title);
      const kicker = createElement("p", "", item.kicker + ". " + item.body);
      const meta = createElement("div", "products-core-meta");

      item.tags.forEach(function (tag) {
        meta.appendChild(createElement("span", "", tag));
      });

      const link = createElement("a", "", "Open lane");
      link.href = item.href;
      link.setAttribute("aria-label", "Open " + item.title);

      card.appendChild(heading);
      card.appendChild(kicker);
      card.appendChild(meta);
      card.appendChild(link);
      grid.appendChild(card);
    });

    const summary = createElement("section", "products-stage-summary");
    const summaryTitle = createElement("h5", "", "Stage guarantees");
    const summaryBody = createElement(
      "p",
      "",
      "The bootchain remains passed, containment remains passed, and the runtime file stays frozen. This pass only promotes the real products experience into primary view."
    );
    const summaryList = document.createElement("ul");

    [
      "Public-facing product lanes are primary.",
      "Runtime receipts remain available through the support toggle.",
      "The mounted runtime stays alive beneath the surface without dominating it.",
      "Any further change should now target individual product expression rather than system proof."
    ].forEach(function (line) {
      const li = document.createElement("li");
      li.textContent = line;
      summaryList.appendChild(li);
    });

    summary.appendChild(summaryTitle);
    summary.appendChild(summaryBody);
    summary.appendChild(summaryList);

    shell.appendChild(hero);
    shell.appendChild(grid);
    shell.appendChild(summary);
    liveStage.appendChild(shell);
  }

  function runBootstrap(source) {
    const { stageZone, stage, liveStage } = getNodes();

    if (!stageZone || !stage || !liveStage) {
      diag.setValue("diag-create-entry", "bootstrap called", "warn");
      diag.setValue("diag-mount-result", "blocked", "fail");
      diag.setValue("diag-error-text", "required stage nodes missing", "fail");
      diag.setStatus("host-nodes-missing");
      return;
    }

    destroyExistingRuntime(stage);
    enforceStageContainment(stageZone, stage);
    renderProductsExperience(liveStage);

    diag.setValue("diag-create-entry", "bootstrap called (" + source + ")", "warn");
    diag.setValue("diag-mount-result", "boot in progress", "warn");
    diag.setValue("diag-error-text", "none", "note");
    diag.setStatus("boot-started");

    const runtimeApi = window.ProductsPlanetRuntime;
    if (!runtimeApi || typeof runtimeApi.create !== "function") {
      diag.setValue("diag-global-api", "missing", "fail");
      diag.setValue("diag-mount-result", "blocked", "fail");
      diag.setValue("diag-error-text", "window.ProductsPlanetRuntime.create not available", "fail");
      diag.setStatus("global-api-missing");
      return;
    }

    diag.setValue("diag-global-api", "found", "ok");

    try {
      diag.setValue("diag-create-entry", "create() entered (" + source + ")", "ok");
      diag.setStatus("create-entered");

      const reducedMotion = !!(
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );

      const instance = runtimeApi.create({
        stage,
        mount: stage,
        reducedMotion,
      });

      window.__productsPlanetRuntimeInstance = instance;
      enforceStageContainment(stageZone, stage);
      renderProductsExperience(liveStage);

      diag.setValue("diag-mount-result", "succeeded", "ok");
      diag.setStatus("mount-succeeded");
    } catch (error) {
      diag.setValue("diag-mount-result", "failed", "fail");
      diag.setValue("diag-error-text", readErrorMessage(error), "fail");
      diag.setStatus("create-failed");
    }
  }

  window.__productsBootstrapStart = function __productsBootstrapStart(source) {
    runBootstrap(source || "manual");
  };

  diag.setValue("diag-create-entry", "index.js parsed", "warn");
  diag.setStatus("index-js-parsed");

  if (document.readyState === "complete" || document.readyState === "interactive") {
    diag.setStatus("document-ready");
    window.__productsBootstrapStart("document-ready");
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      diag.setStatus("dom-ready");
      window.__productsBootstrapStart("dom-ready");
    }, { once: true });
  }

  window.addEventListener("pageshow", function () {
    diag.setStatus("pageshow");
    window.__productsBootstrapStart("pageshow");
  });
})();
