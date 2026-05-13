const EARTH_ROUTE_IDENTITY_RENEWAL = Object.freeze({
  contract: "EARTH_ROUTE_IDENTITY_RENEWAL_TNT_v1",
  route: "/showroom/globe/earth/",
  body: "Earth",
  role: "real-world-reference-body",
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false
});

function markEarthRouteReady() {
  document.documentElement.dataset.earthRouteStatus = "identity-renewed";
  document.documentElement.dataset.earthReferenceBody = "true";
  document.documentElement.dataset.privateEngineAwake = "false";
  document.body.dataset.earthRouteStatus = "identity-renewed";
  document.body.dataset.earthReferenceBody = "true";
  document.body.dataset.privateEngineAwake = "false";
}

function protectVisibleIdentity() {
  const title = document.querySelector("title");
  if (title && !/\bEarth\b/.test(title.textContent || "")) {
    title.textContent = "Earth · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && !/\bEarth\b/.test(h1.textContent || "")) {
    h1.textContent = "Earth is the real-world reference body.";
  }
}

function initEarthRoute() {
  markEarthRouteReady();
  protectVisibleIdentity();

  window.DGBEarthRoute = Object.freeze({
    ...EARTH_ROUTE_IDENTITY_RENEWAL,
    status() {
      return Object.freeze({
        ...EARTH_ROUTE_IDENTITY_RENEWAL,
        ready: true,
        identity: "Earth",
        reference: "NASA Blue Marble",
        constructedWorld: false
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEarthRoute, { once: true });
} else {
  initEarthRoute();
}

export { EARTH_ROUTE_IDENTITY_RENEWAL, initEarthRoute };
export default EARTH_ROUTE_IDENTITY_RENEWAL;
