(function(){
  "use strict";

  if (window.__DGB_VARIANT_BOOTED__) return;
  window.__DGB_VARIANT_BOOTED__ = true;

  const script = document.createElement("script");
  script.src = "/variant/scene.js";
  script.defer = true;
  document.body.appendChild(script);
})();
