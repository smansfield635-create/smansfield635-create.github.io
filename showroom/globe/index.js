// /showroom/globe/index.js
const ROUTE_STATE = Object.freeze({
  route: "/showroom/globe/",
  role: "selector",
  earthRoute: "/showroom/globe/earth/",
  audraliaRoute: "/showroom/globe/audralia/",
  publicReceiptRendering: false,
  importsRenderBodies: false,
  mutatesRenderAssets: false
});

function bootSelectorRoute() {
  document.documentElement.dataset.globeRoute = "selector";
  document.documentElement.dataset.publicReceipts = "hidden";

  const routeCards = Array.from(document.querySelectorAll(".body-card"));
  for (const card of routeCards) {
    card.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const href = card.getAttribute("href");
      if (href) window.location.href = href;
    });
  }

  window.ShowroomGlobeSelector = ROUTE_STATE;
}

bootSelectorRoute();
