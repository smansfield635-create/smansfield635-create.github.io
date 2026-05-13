const EARTH_ROUTE_STATE = Object.freeze({
  contract: "GLOBE_VISUAL_SCALE_AUTHORITY_CONSOLIDATION_TNT_v1",
  route: "/showroom/globe/earth/",
  body: "Earth",
  role: "real-world-reference-body-record",
  visualScaleAuthority: "/showroom/globe/",
  duplicatePlanetStage: false,
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false
});

function markEarthRouteReady() {
  document.documentElement.dataset.earthRouteStatus = "scale-consolidated";
  document.documentElement.dataset.earthReferenceBody = "true";
  document.documentElement.dataset.visualScaleAuthority = "/showroom/globe/";
  document.documentElement.dataset.duplicatePlanetStage = "false";
  document.documentElement.dataset.privateEngineAwake = "false";

  document.body.dataset.earthRouteStatus = "scale-consolidated";
  document.body.dataset.earthReferenceBody = "true";
  document.body.dataset.visualScaleAuthority = "/showroom/globe/";
  document.body.dataset.duplicatePlanetStage = "false";
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
    ...EARTH_ROUTE_STATE,
    status() {
      return Object.freeze({
        ...EARTH_ROUTE_STATE,
        ready: true,
        identity: "Earth",
        reference: "NASA Blue Marble",
        constructedWorld: false,
        sharedVisualScaleLivesAt: "/showroom/globe/"
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEarthRoute, { once: true });
} else {
  initEarthRoute();
}

export { EARTH_ROUTE_STATE, initEarthRoute };
export default EARTH_ROUTE_STATE;
