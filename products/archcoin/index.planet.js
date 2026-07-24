/* /products/archcoin/index.planet.js
   ARCHCOIN accepted Audralia center-world host.
*/
(() => {
  "use strict";

  const SOURCE_URL = "./index.planet.source.js";

  function loadSourceSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    if (request.status < 200 || request.status >= 300) {
      throw new Error(`ARCHCOIN_PLANET_SOURCE_LOAD_FAILED:${request.status}`);
    }
    return request.responseText;
  }

  let source = loadSourceSynchronously(SOURCE_URL);
  source = source
    .replaceAll("/* /prototypes/universal-compass/archcoin.globe.laws.round4.js", "/* /products/archcoin/index.planet.source.js")
    .replaceAll("ARCHCOIN calibration lab · Round 4.", "ARCHCOIN accepted production center world.")
    .replaceAll("ARCHCOIN_CALIBRATION_ROUND4_LAWS_GLOBE_v1", "ARCHCOIN_PRODUCTION_CENTER_WORLD_v1")
    .replaceAll("DGB_ARCHCOIN_ROUND4_LAWS_GLOBE_RECEIPT", "DGB_ARCHCOIN_CENTER_WORLD_RECEIPT")
    .replaceAll("DGB_ARCHCOIN_ROUND4_LAWS_GLOBE_READY", "DGB_ARCHCOIN_CENTER_WORLD_READY")
    .replaceAll("DGB_ARCHCOIN_ROUND4_LAWS_GLOBE", "DGB_ARCHCOIN_CENTER_WORLD")
    .replaceAll("archcoinRound4", "archcoinCenterWorld")
    .replaceAll("ROUND4_", "ARCHCOIN_");

  source += "\n//# sourceURL=/products/archcoin/index.planet.accepted.js";
  (0, eval)(source);
})();
