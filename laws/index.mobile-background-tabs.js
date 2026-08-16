/* Laws Rolodex responsive continuity bootstrap + true destination carousel. */
(() => {
  "use strict";
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

  load("/laws/index.mobile-background-tabs.core.js?v=LAWS_ROOT_ROLODEX_RESPONSIVE_CONTINUITY_V4_FROZEN", "data-laws-responsive-core")
    .then(() => load("/laws/index.destination-carousel.js?v=LAWS_DESTINATION_CAROUSEL_RUNTIME_V2_20260816B", "data-laws-destination-carousel-runtime"))
    .catch(error => {
      document.documentElement.dataset.lawsDestinationCarouselRuntime = "load-failed";
      console.error("Laws destination carousel bootstrap failed", error);
    });
})();
