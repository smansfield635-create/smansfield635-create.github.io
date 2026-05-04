// /showroom/globe/index.js
const SHOWROOM_GLOBE_SELECTOR_STATE = Object.freeze({
  protocol: "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2",
  route: "/showroom/globe/",
  role: "selector",
  earthRoute: "/showroom/globe/earth/",
  audraliaRoute: "/showroom/globe/audralia/",
  earthAuthority: "NASA_BLUE_MARBLE_REFERENCE",
  earthPendingAllowed: false,
  publicReceiptRendering: false,
  importsRenderBodies: false,
  mutatesRenderAssets: false,
  visualPassClaimed: false
});

function replaceEarthPendingLanguage() {
  const earthCard = document.querySelector('a[href="/showroom/globe/earth/"]');

  if (!earthCard) return;

  earthCard.dataset.body = "Earth";
  earthCard.dataset.authority = "NASA_BLUE_MARBLE_REFERENCE";
  earthCard.dataset.pending = "false";

  const tags = Array.from(earthCard.querySelectorAll(".tag"));

  if (tags[0]) tags[0].textContent = "NASA reference";
  if (tags[1]) tags[1].textContent = "Blue Marble";

  const heading = earthCard.querySelector("h2");
  if (heading) heading.textContent = "Earth";

  const paragraph = earthCard.querySelector("p");
  if (paragraph) {
    paragraph.textContent =
      "Inspect Earth through the NASA Blue Marble reference route. No pending globe substitution.";
  }
}

function bootShowroomGlobeSelector() {
  document.documentElement.dataset.ticTacToeDynamicProtocol = "v2";
  document.documentElement.dataset.globeRoute = "selector";
  document.documentElement.dataset.publicReceipts = "hidden";
  document.documentElement.dataset.selectorRouteScript = "executed";
  document.documentElement.dataset.selectorPairProof = "html-js-paired";
  document.documentElement.dataset.earthAuthority = "NASA_BLUE_MARBLE_REFERENCE";

  replaceEarthPendingLanguage();

  const routeCards = Array.from(document.querySelectorAll(".body-card"));

  for (const card of routeCards) {
    card.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();

      const href = card.getAttribute("href");
      if (href) window.location.href = href;
    });
  }

  window.ShowroomGlobeSelector = SHOWROOM_GLOBE_SELECTOR_STATE;
}

bootShowroomGlobeSelector();
