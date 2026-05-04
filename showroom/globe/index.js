// /showroom/globe/index.js
const SHOWROOM_GLOBE_SELECTOR_STATE = Object.freeze({
  protocol: "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2",
  route: "/showroom/globe/",
  role: "selector",
  earthRoute: "/showroom/globe/earth/",
  audraliaRoute: "/showroom/globe/audralia/",
  publicReceiptRendering: false,
  importsRenderBodies: false,
  mutatesRenderAssets: false,
  visualPassClaimed: false
});

function bootShowroomGlobeSelector() {
  document.documentElement.dataset.ticTacToeDynamicProtocol = "v2";
  document.documentElement.dataset.globeRoute = "selector";
  document.documentElement.dataset.publicReceipts = "hidden";
  document.documentElement.dataset.selectorRouteScript = "executed";
  document.documentElement.dataset.selectorPairProof = "html-js-paired";

  const routeCards = Array.from(document.querySelectorAll(".body-card"));

  for (const card of routeCards) {
    card.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();

      const href = card.getAttribute("href");
      if (href) {
        window.location.href = href;
      }
    });
  }

  window.ShowroomGlobeSelector = SHOWROOM_GLOBE_SELECTOR_STATE;
}

bootShowroomGlobeSelector();
