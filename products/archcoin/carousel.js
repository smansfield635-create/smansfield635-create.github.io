(() => {
  "use strict";

  const PLANE_IDS = Object.freeze([
    "overview",
    "engineering",
    "platform",
    "governance"
  ]);

  const normalizePlane = value => {
    const candidate = String(value || "")
      .replace(/^#/, "")
      .trim()
      .toLowerCase();
    return PLANE_IDS.includes(candidate) ? candidate : "overview";
  };

  const mount = root => {
    const tabs = [...root.querySelectorAll("[data-carousel-tab]")];
    const planes = [...root.querySelectorAll("[data-carousel-plane]")];
    const viewport = root.querySelector("[data-carousel-viewport]");
    const previous = root.querySelector("[data-carousel-previous]");
    const next = root.querySelector("[data-carousel-next]");
    const ordinal = root.querySelector("[data-carousel-ordinal]");
    let activeIndex = 0;
    let pointerStart = null;

    if (tabs.length !== PLANE_IDS.length || planes.length !== PLANE_IDS.length) return;

    const render = (index, options = {}) => {
      activeIndex = (index + PLANE_IDS.length) % PLANE_IDS.length;
      const id = PLANE_IDS[activeIndex];

      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeIndex;
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
      });

      planes.forEach((plane, planeIndex) => {
        const active = planeIndex === activeIndex;
        plane.hidden = !active;
        plane.setAttribute("aria-hidden", active ? "false" : "true");
        plane.toggleAttribute("inert", !active);
      });

      if (ordinal) ordinal.textContent = `${String(activeIndex + 1).padStart(2, "0")} / 04 · ${id}`;
      root.dataset.activePlane = id;

      if (options.history === "push") {
        history.pushState({ archcoinPlane: id }, "", `#${id}`);
      } else if (options.history === "replace") {
        history.replaceState({ archcoinPlane: id }, "", `#${id}`);
      }

      if (options.focusTab) tabs[activeIndex].focus({ preventScroll: true });
    };

    const goToId = (id, options) => render(PLANE_IDS.indexOf(normalizePlane(id)), options);
    const go = (delta, options = { history: "push" }) => render(activeIndex + delta, options);

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => render(index, { history: "push" }));
    });

    root.addEventListener("keydown", event => {
      let target = null;
      if (event.key === "ArrowLeft") target = activeIndex - 1;
      if (event.key === "ArrowRight") target = activeIndex + 1;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = PLANE_IDS.length - 1;
      if (target === null) return;
      event.preventDefault();
      render(target, { history: "push", focusTab: true });
    });

    previous?.addEventListener("click", () => go(-1));
    next?.addEventListener("click", () => go(1));

    viewport?.addEventListener("pointerdown", event => {
      if (event.target.closest("a, button")) return;
      pointerStart = { x: event.clientX, id: event.pointerId };
      viewport.setPointerCapture?.(event.pointerId);
    }, { passive: true });

    viewport?.addEventListener("pointerup", event => {
      if (!pointerStart || pointerStart.id !== event.pointerId) return;
      const delta = event.clientX - pointerStart.x;
      pointerStart = null;
      if (Math.abs(delta) >= 44) go(delta < 0 ? 1 : -1);
    }, { passive: true });

    viewport?.addEventListener("pointercancel", () => {
      pointerStart = null;
    }, { passive: true });

    const syncFromLocation = () => goToId(location.hash, { history: "replace" });
    addEventListener("hashchange", syncFromLocation);
    addEventListener("popstate", syncFromLocation);
    syncFromLocation();

    root.dataset.carouselReady = "true";
    globalThis.__ARCHCOIN_CAROUSEL_PRESENTATION__ = Object.freeze({
      contract: "SITE_CONTINUITY_V3_ONE_STAGE_TABS_SWIPE_KEYBOARD",
      domain: document.body.dataset.domain || "",
      planes: [...PLANE_IDS],
      currentPlane: () => PLANE_IDS[activeIndex]
    });
  };

  const start = () => document.querySelectorAll("[data-archcoin-carousel]").forEach(mount);
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", start, { once: true })
    : start();
})();
