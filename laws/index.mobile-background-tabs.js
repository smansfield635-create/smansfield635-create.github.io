/* Laws responsive continuity + destination carousel + dedicated destination stage bootstrap. */
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
  const loadStyle = (href, marker) => {
    if (document.querySelector(`link[${marker}]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute(marker, "true");
    document.head.append(link);
  };

  load("/laws/index.mobile-background-tabs.core.js?v=LAWS_ROOT_ROLODEX_RESPONSIVE_CONTINUITY_V4_FROZEN", "data-laws-responsive-core")
    .then(() => load("/laws/index.destination-carousel.js?v=LAWS_DESTINATION_CAROUSEL_RUNTIME_V3_20260816A", "data-laws-destination-carousel-runtime"))
    .then(() => load("/laws/index.destination-stage.js?v=LAWS_DESTINATION_STAGE_V1_20260816A", "data-laws-destination-stage-runtime"))
    .then(() => loadStyle("/laws/index.destination-stage-anchor.css?v=LAWS_DESTINATION_STAGE_ANCHOR_CORRECTION_V1_20260816A", "data-laws-destination-stage-anchor-css"))
    .catch(error => {
      document.documentElement.dataset.lawsDestinationCarouselRuntime = "load-failed";
      document.documentElement.dataset.lawsDestinationStage = "load-failed";
      console.error("Laws destination stage bootstrap failed", error);
    });
})();
