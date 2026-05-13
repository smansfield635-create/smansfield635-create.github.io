// /showroom/globe/earth/index.js
// TNT FULL-FILE REPLACEMENT
// ZIONTS_PUBLIC_CHILD_ROUTE_ALIGNMENT_TNT_v2
// Owns: ZIONTS public child route at the historical Earth-reference path.
// No ground engine. No Hearth. No Audralia mutation. No parent mutation.

const CONTRACT = "ZIONTS_PUBLIC_CHILD_ROUTE_ALIGNMENT_TNT_v2";

function markDocument() {
  const markers = {
    page: "zionts-public-child-route",
    route: "/showroom/globe/earth/",
    contract: CONTRACT,
    publicBody: "ZIONTS",
    routeHistory: "earth-reference",
    parent: "/showroom/globe/",
    groundEngine: "false",
    hearthContent: "false",
    audraliaIdentity: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function init() {
  markDocument();

  window.DGBZiontsRoute = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/earth/",
        publicBody: "ZIONTS",
        routeHistory: "earth-reference",
        sharedVisualScale: "/showroom/globe/",
        groundEngine: false,
        hearthContent: false,
        parentMutation: false
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once:true });
} else {
  init();
}

export default init;
