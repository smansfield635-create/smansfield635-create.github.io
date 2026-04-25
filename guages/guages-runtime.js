/* TNT — /gauges/gauges-runtime.js
   GAUGES · SUN MATERIAL RUNTIME v1
   SCOPE=SUN_ONLY
   PURPOSE=Upgrade existing Sun from flat gradient to coded material body.
   KEEP=layout, orbit system, scale model, controls, projection
   FORBIDDEN=GraphicBox, image generation, static image
*/

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function injectSunMaterialStyles() {
    var prior = document.getElementById("gauges-sun-material-runtime-style");
    if (prior) prior.remove();

    var style = document.createElement("style");
    style.id = "gauges-sun-material-runtime-style";

    style.textContent = `
      .solar-sun,
      .body.sun {
        overflow: visible !important;
        isolation: isolate !important;
        background:
          radial-gradient(circle at 62% 36%,
            #fffbd2 0%,
            #fff1a8 7%,
            #ffd24c 22%,
            #ff9a1f 46%,
            #f45a12 68%,
            #8f1806 100%) !important;
        box-shadow:
          0 0 36px rgba(255,235,150,.95),
          0 0 96px rgba(255,132,32,.78),
          0 0 190px rgba(255,70,18,.44),
          0 0 290px rgba(255,48,10,.22) !important;
      }

      .solar-sun::before,
      .body.sun::before {
        content: "";
        position: absolute;
        inset: -26%;
        border-radius: 50%;
        pointer-events: none;
        background:
          radial-gradient(circle at 52% 48%,
            rgba(255,238,150,.46),
            rgba(255,126,34,.22) 42%,
            transparent 70%),
          radial-gradient(circle at 40% 56%,
            rgba(255,80,16,.24),
            transparent 54%);
        filter: blur(12px);
        z-index: -2;
      }

      .solar-sun::after,
      .body.sun::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
        z-index: 4;
        opacity: .72;
        mix-blend-mode: screen;
        background:
          repeating-radial-gradient(circle at 47% 50%,
            rgba(255,255,255,.10) 0 2px,
            rgba(255,206,82,.06) 2px 9px,
            transparent 9px 17px),
          radial-gradient(circle at 34% 32%,
            rgba(255,255,255,.38),
            transparent 12%),
          radial-gradient(circle at 58% 64%,
            rgba(255,105,20,.20),
            transparent 28%),
          linear-gradient(110deg,
            rgba(255,255,255,.16),
            transparent 34%,
            rgba(120,20,0,.22) 78%);
      }

      .sun-material-layer {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
      }

      .sun-material-granulation {
        z-index: 2;
        opacity: .34;
        mix-blend-mode: overlay;
        background:
          radial-gradient(circle at 24% 32%, rgba(255,255,255,.20) 0 2%, transparent 3%),
          radial-gradient(circle at 38% 58%, rgba(255,255,255,.16) 0 2%, transparent 3%),
          radial-gradient(circle at 66% 44%, rgba(255,210,80,.20) 0 2%, transparent 3%),
          radial-gradient(circle at 72% 70%, rgba(255,95,20,.16) 0 3%, transparent 4%),
          repeating-radial-gradient(circle at 50% 50%,
            rgba(255,255,255,.08) 0 1px,
            transparent 1px 8px);
        filter: blur(.2px);
      }

      .sun-material-turbulence {
        z-index: 3;
        opacity: .42;
        mix-blend-mode: screen;
        background:
          conic-gradient(from 18deg at 52% 50%,
            rgba(255,255,255,.10),
            rgba(255,193,60,.18),
            rgba(255,88,16,.12),
            transparent 34%,
            rgba(255,234,120,.18),
            rgba(255,80,12,.12),
            rgba(255,255,255,.08)),
          repeating-conic-gradient(from 0deg at 50% 50%,
            rgba(255,255,255,.06) 0deg 3deg,
            transparent 3deg 9deg);
        animation: sunMaterialTurn 42s linear infinite;
      }

      .sun-material-limb {
        z-index: 5;
        opacity: .90;
        background:
          radial-gradient(circle at 42% 38%,
            transparent 0%,
            transparent 48%,
            rgba(255,140,26,.22) 64%,
            rgba(96,12,2,.52) 100%);
        mix-blend-mode: multiply;
      }

      .sun-material-corona {
        position: absolute;
        inset: -18%;
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        opacity: .72;
        background:
          radial-gradient(circle at 50% 50%,
            rgba(255,226,120,.34),
            rgba(255,120,32,.18) 46%,
            transparent 72%),
          conic-gradient(from 0deg at 50% 50%,
            transparent,
            rgba(255,180,80,.16),
            transparent 18%,
            rgba(255,90,18,.14),
            transparent 38%,
            rgba(255,225,130,.13),
            transparent 62%,
            rgba(255,90,20,.12),
            transparent);
        filter: blur(7px);
        animation: sunCoronaPulse 7s ease-in-out infinite;
      }

      @keyframes sunMaterialTurn {
        0% { transform: rotate(0deg) scale(1.01); }
        100% { transform: rotate(360deg) scale(1.01); }
      }

      @keyframes sunCoronaPulse {
        0%, 100% { opacity: .58; transform: scale(1); }
        50% { opacity: .86; transform: scale(1.035); }
      }

      @media (prefers-reduced-motion: reduce) {
        .sun-material-turbulence,
        .sun-material-corona {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function addSunLayers() {
    var suns = document.querySelectorAll(".solar-sun, .body.sun");

    suns.forEach(function (sun) {
      if (sun.dataset.sunMaterialRuntime === "active") return;
      sun.dataset.sunMaterialRuntime = "active";

      var corona = document.createElement("span");
      corona.className = "sun-material-corona";

      var granulation = document.createElement("span");
      granulation.className = "sun-material-layer sun-material-granulation";

      var turbulence = document.createElement("span");
      turbulence.className = "sun-material-layer sun-material-turbulence";

      var limb = document.createElement("span");
      limb.className = "sun-material-layer sun-material-limb";

      sun.appendChild(corona);
      sun.appendChild(granulation);
      sun.appendChild(turbulence);
      sun.appendChild(limb);
    });
  }

  function boot() {
    injectSunMaterialStyles();
    addSunLayers();

    var observer = new MutationObserver(function () {
      addSunLayers();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.DGBGaugesSunMaterialRuntime = Object.freeze({
      version: "GAUGES_SUN_MATERIAL_RUNTIME_v1",
      scope: "SUN_ONLY",
      forbidden: ["GraphicBox", "image_generation", "static_image"],
      rule: "Upgrade material detail without changing layout, orbit system, scale model, controls, or projection."
    });
  }

  ready(boot);
})();
