/* TNT — /gauges/gauges-runtime.js
   GAUGES DEDICATED RUNTIME v1
   PURPOSE=Render Gauges universe separately from /gauges/index.js
   OWNER=/gauges/gauges-runtime.js
*/

(function () {
  "use strict";

  const scene = document.getElementById("universeScene");
  const caption = document.getElementById("sceneCaption");
  const info = document.getElementById("physicsInfo");

  if (!scene) return;

  function injectStyles() {
    if (document.getElementById("gauges-dedicated-runtime-style")) return;

    const style = document.createElement("style");
    style.id = "gauges-dedicated-runtime-style";
    style.textContent = `
      .universe-scene {
        position: relative;
        min-height: 520px;
        overflow: visible;
        isolation: isolate;
      }

      .gauge-sun {
        position: absolute;
        left: 7%;
        top: 50%;
        width: 430px;
        height: 430px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background:
          radial-gradient(circle at 62% 36%,
            #fffbd2 0%,
            #fff1a8 7%,
            #ffd24c 22%,
            #ff9a1f 46%,
            #f45a12 68%,
            #8f1806 100%);
        box-shadow:
          0 0 36px rgba(255,235,150,.95),
          0 0 96px rgba(255,132,32,.78),
          0 0 190px rgba(255,70,18,.44);
        z-index: 2;
        overflow: visible;
      }

      .gauge-sun::before {
        content: "";
        position: absolute;
        inset: -28%;
        border-radius: 50%;
        background:
          radial-gradient(circle at 52% 48%, rgba(255,238,150,.46), rgba(255,126,34,.22) 42%, transparent 70%),
          radial-gradient(circle at 40% 56%, rgba(255,80,16,.24), transparent 54%);
        filter: blur(14px);
        z-index: -1;
      }

      .gauge-sun::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          repeating-radial-gradient(circle at 47% 50%, rgba(255,255,255,.10) 0 2px, rgba(255,206,82,.06) 2px 9px, transparent 9px 17px),
          conic-gradient(from 18deg at 52% 50%, rgba(255,255,255,.10), rgba(255,193,60,.18), rgba(255,88,16,.12), transparent 34%, rgba(255,234,120,.18));
        mix-blend-mode: screen;
        opacity: .72;
      }

      .gauge-orbit {
        position: absolute;
        left: 7%;
        top: 50%;
        border-radius: 50%;
        border: 2px solid rgba(220,232,255,.20);
        transform: translate(-50%, -50%) rotate(-13deg);
        pointer-events: none;
        z-index: 1;
      }

      .gauge-planet {
        position: absolute;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
        z-index: 4;
        background: radial-gradient(circle at 32% 28%, var(--hi), var(--mid) 48%, var(--low) 100%);
        box-shadow:
          inset -10px -4px 18px rgba(0,0,0,.64),
          inset 7px 5px 16px rgba(255,255,255,.14),
          0 0 20px var(--glow);
      }

      .gauge-planet::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          radial-gradient(circle at 29% 28%, transparent 0 24%, rgba(0,0,0,.10) 42%, rgba(0,0,0,.68) 78%, rgba(0,0,0,.92) 100%);
        mix-blend-mode: multiply;
      }

      .gauge-label {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        color: rgba(232,240,255,.94);
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .08em;
        text-transform: uppercase;
        white-space: nowrap;
        text-shadow: 0 1px 0 rgba(0,0,0,.9), 0 0 12px rgba(0,0,0,.9);
      }

      @media (max-width: 640px) {
        .universe-scene { min-height: 520px; }
        .gauge-sun {
          width: 420px;
          height: 420px;
          transform: translate(-58%, -50%);
        }
      }
    `;
    document.head.appendChild(style);
  }

  const bodies = [
    { name: "Mercury", au: 0.387, size: 18, hi: "#d6c6a9", mid: "#8c826f", low: "#2d2a25", glow: "rgba(220,210,188,.18)", phase: .06 },
    { name: "Venus", au: 0.723, size: 24, hi: "#ffe4a3", mid: "#c88435", low: "#42210d", glow: "rgba(239,210,154,.24)", phase: .19 },
    { name: "Earth", au: 1, size: 26, hi: "#d9fbff", mid: "#187bc2", low: "#041738", glow: "rgba(142,197,255,.44)", phase: .34 },
    { name: "Mars", au: 1.524, size: 21, hi: "#ffb083", mid: "#b94b28", low: "#36120d", glow: "rgba(255,98,98,.22)", phase: .47 },
    { name: "Jupiter", au: 5.203, size: 58, hi: "#fff0c8", mid: "#b88758", low: "#422819", glow: "rgba(239,210,154,.30)", phase: .60 },
    { name: "Saturn", au: 9.537, size: 52, hi: "#fff0bd", mid: "#b99b61", low: "#3c2f1a", glow: "rgba(239,210,154,.28)", phase: .72 },
    { name: "Uranus", au: 19.191, size: 40, hi: "#d6ffff", mid: "#62b8c5", low: "#103848", glow: "rgba(142,197,255,.26)", phase: .84 },
    { name: "Neptune", au: 30.07, size: 40, hi: "#b7ceff", mid: "#3b5fd0", low: "#101a4c", glow: "rgba(142,197,255,.24)", phase: .94 }
  ];

  function distance(au) {
    const t = Math.log(1 + au) / Math.log(1 + 30.07);
    return 124 + t * 520;
  }

  function position(body) {
    const d = distance(body.au);
    const angle = body.phase * Math.PI * 2;
    const rawX = Math.cos(angle) * d;
    const rawY = Math.sin(angle) * d * .44;
    const tilt = -13 * Math.PI / 180;

    return {
      x: rawX * Math.cos(tilt) - rawY * Math.sin(tilt),
      y: rawX * Math.sin(tilt) + rawY * Math.cos(tilt),
      d
    };
  }

  function render() {
    scene.innerHTML = "";

    const sun = document.createElement("div");
    sun.className = "gauge-sun";
    scene.appendChild(sun);

    bodies.forEach((body) => {
      const p = position(body);

      const orbit = document.createElement("div");
      orbit.className = "gauge-orbit";
      orbit.style.width = `${p.d * 2}px`;
      orbit.style.height = `${p.d * 2 * .44}px`;
      scene.appendChild(orbit);

      const planet = document.createElement("div");
      planet.className = "gauge-planet";
      planet.style.width = `${body.size}px`;
      planet.style.height = `${body.size}px`;
      planet.style.left = `calc(7% + ${p.x}px)`;
      planet.style.top = `calc(50% + ${p.y}px)`;
      planet.style.setProperty("--hi", body.hi);
      planet.style.setProperty("--mid", body.mid);
      planet.style.setProperty("--low", body.low);
      planet.style.setProperty("--glow", body.glow);

      const label = document.createElement("span");
      label.className = "gauge-label";
      label.textContent = body.name;
      planet.appendChild(label);

      scene.appendChild(planet);
    });

    if (caption) caption.textContent = "Solar view · dedicated Gauges runtime · physics-derived / display-compressed";
    if (info) {
      info.innerHTML = "<strong>Gauges Runtime Active</strong><span>/gauges/gauges-runtime.js owns the celestial render. Host and page controller remain separate.</span>";
    }
  }

  injectStyles();
  render();

  window.DGBGaugesRuntime = Object.freeze({
    version: "GAUGES_DEDICATED_RUNTIME_v1",
    owner: "/gauges/gauges-runtime.js"
  });
})();
