/* TNT — GAUGES RUNTIME MINIMAL VERIFIED */

(function () {
  "use strict";

  const scene = document.getElementById("universeScene");
  if (!scene) return;

  scene.innerHTML = "";

  const sun = document.createElement("div");
  sun.style.position = "absolute";
  sun.style.left = "7%";
  sun.style.top = "50%";
  sun.style.width = "300px";
  sun.style.height = "300px";
  sun.style.borderRadius = "50%";
  sun.style.transform = "translate(-50%, -50%)";
  sun.style.background =
    "radial-gradient(circle, #fff4b0 0%, #ff9a1f 50%, #d13b00 100%)";
  sun.style.boxShadow =
    "0 0 40px rgba(255,200,100,.9), 0 0 120px rgba(255,80,20,.5)";

  scene.appendChild(sun);

})();
