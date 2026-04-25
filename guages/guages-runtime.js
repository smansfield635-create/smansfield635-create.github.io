/* TNT — GAUGES SUN MATERIAL (BOUND TO #universeScene)
   PURPOSE=Attach sun material to runtime-generated Sun inside #universeScene
   KEEP=ALL EXISTING SYSTEMS
*/

(function () {
  "use strict";

  function inject() {
    if (document.getElementById("dg-sun-style")) return;

    const style = document.createElement("style");
    style.id = "dg-sun-style";

    style.textContent = `
      .dg-sun {
        position: relative !important;
        isolation: isolate;
        overflow: visible;
      }

      .dg-sun::before {
        content: "";
        position: absolute;
        inset: -28%;
        border-radius: 50%;
        background:
          radial-gradient(circle,
            rgba(255,220,120,.45),
            rgba(255,120,40,.2),
            transparent 70%);
        filter: blur(14px);
        z-index: -1;
      }

      .dg-sun::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          repeating-radial-gradient(circle,
            rgba(255,255,255,.06) 0 2px,
            transparent 2px 10px),
          radial-gradient(circle at 35% 30%,
            rgba(255,255,255,.25),
            transparent 15%);
        mix-blend-mode: screen;
        opacity: .7;
      }

      .dg-sun-layer {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
      }

      .dg-sun-turbulence {
        background:
          conic-gradient(from 0deg,
            rgba(255,255,255,.08),
            rgba(255,200,80,.18),
            rgba(255,90,20,.12),
            transparent 40%);
        mix-blend-mode: screen;
        animation: dgSunSpin 38s linear infinite;
      }

      .dg-sun-limb {
        background:
          radial-gradient(circle,
            transparent 50%,
            rgba(0,0,0,.85) 100%);
        mix-blend-mode: multiply;
      }

      @keyframes dgSunSpin {
        to { transform: rotate(360deg); }
      }
    `;

    document.head.appendChild(style);
  }

  function findSun(scene) {
    // Heuristic: largest glowing body near left side
    const candidates = [...scene.children];

    return candidates
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 40 && rect.height > 40;
      })
      .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
  }

  function attachSunMaterial(sun) {
    if (!sun || sun.dataset.dgSun === "1") return;

    sun.dataset.dgSun = "1";
    sun.classList.add("dg-sun");

    const turbulence = document.createElement("div");
    turbulence.className = "dg-sun-layer dg-sun-turbulence";

    const limb = document.createElement("div");
    limb.className = "dg-sun-layer dg-sun-limb";

    sun.appendChild(turbulence);
    sun.appendChild(limb);
  }

  function boot() {
    inject();

    const scene = document.getElementById("universeScene");
    if (!scene) return;

    function apply() {
      const sun = findSun(scene);
      attachSunMaterial(sun);
    }

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(scene, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

})();
