const SHOWROOM_GLOBE_GATEWAY_STATE = Object.freeze({
  contract: "SHOWROOM_GLOBE_GATEWAY_RESTORATION_TNT_v1",
  route: "/showroom/globe/",
  role: "globe-system-gateway",
  gatewayAuthority: true,
  earthRecord: false,
  hEarthRecord: false,
  audraliaRecord: false,
  childRoutes: Object.freeze([
    "/showroom/globe/earth/",
    "/showroom/globe/h-earth/",
    "/showroom/globe/audralia/"
  ]),
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false
});

function markGatewayRoute() {
  document.documentElement.dataset.globeGatewayStatus = "restored";
  document.documentElement.dataset.globeGatewayAuthority = "true";
  document.documentElement.dataset.earthRecord = "false";
  document.documentElement.dataset.hEarthRecord = "false";
  document.documentElement.dataset.audraliaRecord = "false";

  document.body.dataset.globeGatewayStatus = "restored";
  document.body.dataset.globeGatewayAuthority = "true";
  document.body.dataset.earthRecord = "false";
  document.body.dataset.hEarthRecord = "false";
  document.body.dataset.audraliaRecord = "false";
}

function protectGatewayIdentity() {
  const title = document.querySelector("title");
  if (title && !/Globe Showcase/i.test(title.textContent || "")) {
    title.textContent = "Globe Showcase · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "This is the entrance to the showroom globe pages.";
  }
}

function initShowroomGlobeGateway() {
  markGatewayRoute();
  protectGatewayIdentity();

  window.DGBShowroomGlobeGateway = Object.freeze({
    ...SHOWROOM_GLOBE_GATEWAY_STATE,
    status() {
      return Object.freeze({
        ...SHOWROOM_GLOBE_GATEWAY_STATE,
        ready: true,
        entranceRestored: true,
        earthStandingInGateway: false
      });
    }
  });

  return window.DGBShowroomGlobeGateway;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShowroomGlobeGateway, { once: true });
} else {
  initShowroomGlobeGateway();
}

export { SHOWROOM_GLOBE_GATEWAY_STATE, initShowroomGlobeGateway };
export default SHOWROOM_GLOBE_GATEWAY_STATE;
