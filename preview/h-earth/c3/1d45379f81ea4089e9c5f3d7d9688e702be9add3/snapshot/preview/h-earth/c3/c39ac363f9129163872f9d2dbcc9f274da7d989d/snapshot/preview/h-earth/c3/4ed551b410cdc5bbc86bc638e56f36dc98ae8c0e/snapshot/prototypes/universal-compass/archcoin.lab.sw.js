/* /prototypes/universal-compass/archcoin.lab.sw.js
   Prototype-scoped ARCHCOIN calibration router · Round 4 Stages 4A/4B.
   Production ARCHCOIN files are never modified or served from these files.
*/
"use strict";

const BUILD = "ARCHCOIN_CALIBRATION_ROUND4_STAGE4AB_v3";
const LOCAL_ROOT = "/prototypes/universal-compass/";
const ROUTES = Object.freeze({
  "/assets/compass/upstream-compass.css": `${LOCAL_ROOT}archcoin.upstream-compass.css?build=${BUILD}`,
  "/assets/compass/upstream-compass.geometry.js": `${LOCAL_ROOT}archcoin.upstream-compass.geometry.js?build=${BUILD}`,
  "/assets/compass/upstream-compass.renderer.js": `${LOCAL_ROOT}archcoin.upstream-compass.renderer.js?build=${BUILD}`,
  "/products/archcoin/index.css": `${LOCAL_ROOT}archcoin.index.css?build=${BUILD}`,
  "/products/archcoin/index.controller.js": `${LOCAL_ROOT}archcoin.index.controller.js?build=${BUILD}`,
  "/products/archcoin/index.compositor.js": `${LOCAL_ROOT}archcoin.index.compositor.js?build=${BUILD}`,
  "/products/archcoin/index.crystals.js": `${LOCAL_ROOT}archcoin.crystals.round4.js?build=${BUILD}`,
  "/products/archcoin/index.interactions.js": `${LOCAL_ROOT}archcoin.interactions.round4.js?build=${BUILD}`
});

self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);
  const localPath = ROUTES[requestUrl.pathname];
  if (!localPath) return;
  event.respondWith(
    fetch(new Request(new URL(localPath, self.location.origin), {
      method: "GET",
      headers: event.request.headers,
      mode: "same-origin",
      credentials: "same-origin",
      cache: "no-store",
      redirect: "follow"
    }))
  );
});