/* Laws responsive continuity + runtime-owned shared-ring carousel + destination stage bootstrap. */
(() => {
  "use strict";
  const installRolodexScrollCustody = () => {
    const proto = globalThis.Element?.prototype;
    if (!proto || typeof proto.scrollIntoView !== "function" || proto.__dgbLawsRolodexScrollCustody) return;
    const nativeScrollIntoView = proto.scrollIntoView;
    const horizontalOnlyScrollIntoView = function (...args) {
      const card = this?.matches?.(".laws-rolodex-card") && this.closest?.("[data-laws-root-rolodex-section]") ? this : null;
      if (!card) return nativeScrollIntoView.apply(this, args);
      const viewport = card.closest(".laws-rolodex-viewport");
      if (!viewport) return;
      const viewportRect = viewport.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const targetLeft = Math.max(0, viewport.scrollLeft + (cardRect.left + cardRect.width / 2) - (viewportRect.left + viewportRect.width / 2));
      const options = args[0];
      const behavior = options && typeof options === "object" && options.behavior === "smooth" ? "smooth" : "auto";
      viewport.scrollTo({ left: targetLeft, behavior });
      document.documentElement.dataset.lawsRolodexScrollCustody = "horizontal-only";
    };
    Object.defineProperty(horizontalOnlyScrollIntoView, "name", { value: "scrollIntoView" });
    Object.defineProperty(proto, "scrollIntoView", { configurable: true, writable: true, value: horizontalOnlyScrollIntoView });
    Object.defineProperty(proto, "__dgbLawsRolodexScrollCustody", { configurable: true, value: Object.freeze({ nativeScrollIntoView, scope: "laws-root-rolodex-cards", verticalDocumentScroll: false }) });
    document.documentElement.dataset.lawsRolodexScrollCustody = "horizontal-only";
  };
  installRolodexScrollCustody();

  const loadStyle = (href, marker) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[${marker}]`);
    if (existing) {
      if (existing.sheet) resolve();
      else {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      }
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute(marker, "true");
    link.onload = resolve;
    link.onerror = reject;
    document.head.append(link);
  });

  const load = (src, marker) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[${marker}]`)) { resolve(); return; }
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.setAttribute(marker, "true");
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  loadStyle("/laws/index.destination-carousel.css?v=LAWS_DESTINATION_CAROUSEL_PRODUCT_GEOMETRY_20260816G&visual=20260816H_PERSISTENT_VIEWER_FACING_RING", "data-laws-destination-carousel-css")
    .then(() => load("/laws/index.mobile-background-tabs.core.js?v=LAWS_ROOT_ROLODEX_RESPONSIVE_CONTINUITY_V5_ORBIT_CUSTODY", "data-laws-responsive-core"))
    .then(() => load("/laws/index.destination-carousel.js?v=LAWS_DESTINATION_CAROUSEL_RUNTIME_V11_DIRECTION_ONLY_ATOMIC_20260816E&ux=20260816G_RUNTIME_OWNED_RING_TRAVERSAL&visual=20260816H_PERSISTENT_VIEWER_FACING_RING", "data-laws-destination-carousel-runtime"))
    .then(() => load("/laws/index.destination-stage.js?v=LAWS_DESTINATION_STAGE_V1_20260816A", "data-laws-destination-stage-runtime"))
    .then(() => {
      document.documentElement.dataset.lawsDestinationCarouselCss = "active";
      document.documentElement.dataset.lawsDestinationCarouselVisual = "20260816H_PERSISTENT_VIEWER_FACING_RING";
    })
    .catch(error => {
      document.documentElement.dataset.lawsDestinationCarouselRuntime = "load-failed";
      document.documentElement.dataset.lawsDestinationCarouselCss = "load-failed";
      document.documentElement.dataset.lawsDestinationStage = "load-failed";
      console.error("Laws destination stage bootstrap failed", error);
    });
})();
