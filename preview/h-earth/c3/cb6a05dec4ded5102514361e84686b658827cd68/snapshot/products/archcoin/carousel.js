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

  const wrapIndex = index => (index + PLANE_IDS.length) % PLANE_IDS.length;

  const inferDirection = (fromIndex, toIndex) => {
    const forward = wrapIndex(toIndex - fromIndex);
    const backward = wrapIndex(fromIndex - toIndex);
    if (forward === 0) return 0;
    return forward <= backward ? 1 : -1;
  };

  const spatialOffset = (planeIndex, activeIndex, direction) => {
    const forward = wrapIndex(planeIndex - activeIndex);
    if (forward === 0) return 0;
    if (forward === 1) return 1;
    if (forward === PLANE_IDS.length - 1) return -1;
    return direction < 0 ? -2 : 2;
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

    const validStructure = tabs.length === PLANE_IDS.length
      && planes.length === PLANE_IDS.length
      && PLANE_IDS.every((id, index) => (
        tabs[index].getAttribute("aria-controls") === `plane-${id}`
        && planes[index].id === `plane-${id}`
        && planes[index].dataset.carouselPlane === id
      ));

    if (!validStructure) return;

    const render = (index, options = {}) => {
      const nextIndex = wrapIndex(index);
      const direction = options.direction ?? inferDirection(activeIndex, nextIndex);
      activeIndex = nextIndex;
      const id = PLANE_IDS[activeIndex];

      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeIndex;
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
      });

      planes.forEach((plane, planeIndex) => {
        const active = planeIndex === activeIndex;
        const offset = spatialOffset(planeIndex, activeIndex, direction);
        plane.hidden = false;
        plane.dataset.spatialOffset = String(offset);
        plane.dataset.spatialRole = active
          ? "active"
          : Math.abs(offset) === 1 ? "neighbor" : "far";
        plane.setAttribute("aria-hidden", active ? "false" : "true");
        plane.toggleAttribute("inert", !active);
      });

      if (ordinal) ordinal.textContent = `${String(activeIndex + 1).padStart(2, "0")} / 04 · ${id}`;
      root.dataset.activePlane = id;
      root.dataset.carouselDirection = direction < 0 ? "backward" : direction > 0 ? "forward" : "settled";

      if (options.history === "push") {
        history.pushState({ archcoinPlane: id }, "", `#${id}`);
      } else if (options.history === "replace") {
        history.replaceState({ archcoinPlane: id }, "", `#${id}`);
      }

      if (options.focusTab) tabs[activeIndex].focus({ preventScroll: true });
    };

    const goToId = (id, options = {}) => {
      const targetIndex = PLANE_IDS.indexOf(normalizePlane(id));
      render(targetIndex, { ...options, direction: inferDirection(activeIndex, targetIndex) });
    };
    const go = (delta, options = { history: "push" }) => (
      render(activeIndex + delta, { ...options, direction: Math.sign(delta) })
    );

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => render(index, {
        history: "push",
        direction: inferDirection(activeIndex, index)
      }));
    });

    root.addEventListener("keydown", event => {
      let target = null;
      if (event.key === "ArrowLeft") target = activeIndex - 1;
      if (event.key === "ArrowRight") target = activeIndex + 1;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = PLANE_IDS.length - 1;
      if (target === null) return;
      event.preventDefault();
      render(target, {
        history: "push",
        focusTab: true,
        direction: event.key === "ArrowLeft"
          ? -1
          : event.key === "ArrowRight" ? 1 : inferDirection(activeIndex, wrapIndex(target))
      });
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
    requestAnimationFrame(() => {
      root.dataset.carouselInteractive = "true";
    });
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
