(() => {
  "use strict";

  const CONTRACT = "FRONTIER_EXPLORE_THREE_FILE_SPLIT_AUDRALIA_PLAYGROUND_COMPASS_DROPDOWN_TNT_v1";
  const ROUTE = "/explore/frontier/";

  document.documentElement.dataset.frontierSplitContract = CONTRACT;
  document.documentElement.dataset.frontierCssExternal = "true";
  document.documentElement.dataset.frontierJsExternal = "true";
  document.documentElement.dataset.animationOwnership = "css";
  document.documentElement.dataset.jsOwnsAnimation = "false";
  document.documentElement.dataset.frontierAudraliaPlaygroundContext = "active";
  document.documentElement.dataset.frontierCompassDropdown = "active";

  window.FRONTIER_EXPLORE_SPLIT_RECEIPT = {
    contract: CONTRACT,
    previousContract: "FRONTIER_EXPLORER_INDEX_DROPDOWN_LEGACY_ALIGNMENT_ANIMATION_PRESERVATION_TNT_v1",
    route: ROUTE,
    files: {
      html: "/explore/frontier/index.html",
      css: "/explore/frontier/frontier.css",
      js: "/explore/frontier/frontier.js"
    },
    cssLoadedIntent: true,
    jsLoadedIntent: true,
    animationOwnership: "css",
    jsOwnsAnimation: false,
    dropdownBehavior: "native-details-summary",
    compassAlignedDropdown: true,
    audraliaPlaygroundContext: true,
    frontierRole: "applied-science-playground",
    audraliaRole: "living-world-context-and-test-field",
    canvas: false,
    webgl: false,
    generatedImage: false,
    graphicBox: false,
    particleEngine: false,
    heavyRuntime: false,
    requestAnimationFrame: false,
    localStorage: false,
    cookies: false,
    externalDependency: false
  };
})();
