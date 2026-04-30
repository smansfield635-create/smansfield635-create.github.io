(function () {
  "use strict";

  var VERSION = "SHOWROOM_GLOBE_INSTRUMENT_DEMO_PLANET_VISIBLE_TNT_v1";

  function injectStyles() {
    if (document.getElementById("dgb-showroom-globe-instrument-styles")) return;

    var style = document.createElement("style");
    style.id = "dgb-showroom-globe-instrument-styles";
    style.textContent = `
      .dgb-globe-shell {
        position: relative;
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 18px;
        width: 100%;
        min-height: 420px;
        padding: 18px;
        isolation: isolate;
      }

      .dgb-globe-orbit {
        position: relative;
        width: min(390px, 76vw);
        aspect-ratio: 1;
        border-radius: 50%;
        border: 1px solid rgba(242, 199, 111, 0.38);
        background:
          radial-gradient(circle at 32% 22%, rgba(255,255,255,0.32), transparent 18%),
          radial-gradient(circle at 52% 48%, rgba(40, 112, 176, 0.95), rgba(7, 16, 32, 0.98) 72%);
        box-shadow:
          inset -42px -36px 62px rgba(0, 0, 0, 0.58),
          inset 22px 18px 44px rgba(255, 255, 255, 0.10),
          0 0 0 12px rgba(255,255,255,0.025),
          0 36px 90px rgba(0, 0, 0, 0.72),
          0 0 86px rgba(145, 189, 255, 0.18);
        overflow: hidden;
      }

      .dgb-globe-map {
        position: absolute;
        inset: -4%;
        border-radius: 50%;
        background:
          radial-gradient(ellipse at 50% 10%, rgba(232,244,255,0.92) 0 7%, transparent 8%),
          radial-gradient(ellipse at 50% 24%, rgba(154,177,184,0.9) 0 12%, transparent 13%),
          radial-gradient(ellipse at 50% 50%, rgba(80,142,93,0.92) 0 18%, transparent 19%),
          radial-gradient(ellipse at 28% 51%, rgba(97,96,87,0.88) 0 13%, transparent 14%),
          radial-gradient(ellipse at 72% 51%, rgba(106,154,123,0.9) 0 13%, transparent 14%),
          radial-gradient(ellipse at 50% 72%, rgba(111,145,101,0.9) 0 13%, transparent 14%),
          radial-gradient(ellipse at 50% 91%, rgba(220,228,235,0.94) 0 7%, transparent 8%),
          linear-gradient(90deg, rgba(9,38,72,0.98), rgba(35,108,162,0.9), rgba(9,38,72,0.98));
        filter: saturate(1.12) contrast(1.06);
        animation: dgbGlobeDrift 18s ease-in-out infinite alternate;
      }

      .dgb-globe-grid {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 34px),
          repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 34px);
        mix-blend-mode: screen;
        opacity: 0.28;
      }

      .dgb-globe-light {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          radial-gradient(circle at 30% 22%, rgba(255,255,255,0.34), transparent 24%),
          linear-gradient(110deg, transparent 0 44%, rgba(0,0,0,0.2) 58%, rgba(0,0,0,0.62) 100%);
      }

      .dgb-globe-atmosphere {
        position: absolute;
        inset: -2%;
        border-radius: 50%;
        border: 2px solid rgba(145, 189, 255, 0.28);
        box-shadow:
          inset 0 0 32px rgba(145, 189, 255, 0.22),
          0 0 44px rgba(145, 189, 255, 0.24);
        pointer-events: none;
      }

      .dgb-globe-axis {
        position: absolute;
        top: 7%;
        bottom: 7%;
        left: 50%;
        width: 2px;
        transform: translateX(-50%) rotate(23.5deg);
        background: linear-gradient(180deg, transparent, rgba(242,199,111,0.75), transparent);
        box-shadow: 0 0 24px rgba(242,199,111,0.34);
        z-index: 5;
        pointer-events: none;
      }

      .dgb-globe-caption {
        position: relative;
        z-index: 4;
        max-width: 720px;
        text-align: center;
        color: rgba(244,247,255,0.84);
        font-size: 0.78rem;
        font-weight: 950;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .dgb-globe-telemetry {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
        max-width: 780px;
      }

      .dgb-globe-telemetry span {
        border: 1px solid rgba(168,199,255,0.16);
        border-radius: 999px;
        padding: 5px 8px;
        background: rgba(255,255,255,0.045);
        color: rgba(244,247,255,0.72);
        font-size: 0.68rem;
        font-weight: 850;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      @keyframes dgbGlobeDrift {
        from { transform: translateX(-2%) scale(1.04) rotate(-1deg); }
        to { transform: translateX(2%) scale(1.04) rotate(1deg); }
      }

      @media (prefers-reduced-motion: reduce) {
        .dgb-globe-map {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createElement(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function renderGlobe(mount, options) {
    if (!mount) {
      throw new Error("DGBShowroomGlobeInstrument.renderGlobe requires a mount element.");
    }

    injectStyles();

    var config = options || {};
    var caption = config.caption || "DEMO PLANET · NINE SUMMITS UNIVERSE · VISIBLE INSPECTION";

    mount.innerHTML = "";
    mount.dataset.instrumentVersion = VERSION;
    mount.dataset.renderStatus = "mounted";
    mount.dataset.visibleGlobe = "true";
    mount.dataset.demoPlanet = "nine-summits-universe";
    mount.dataset.mapType = "vertical-peeled-globe-projection";

    var shell = createElement("div", "dgb-globe-shell");
    var orbit = createElement("div", "dgb-globe-orbit");

    orbit.appendChild(createElement("div", "dgb-globe-map"));
    orbit.appendChild(createElement("div", "dgb-globe-grid"));
    orbit.appendChild(createElement("div", "dgb-globe-light"));
    orbit.appendChild(createElement("div", "dgb-globe-atmosphere"));
    orbit.appendChild(createElement("div", "dgb-globe-axis"));

    var captionNode = createElement("div", "dgb-globe-caption", caption);

    var telemetry = createElement("div", "dgb-globe-telemetry");
    [
      "PLANET 1",
      "7 LANDMASSES",
      "MAINLAND CENTER",
      "POLAR CAPS",
      "OCEAN WRAP SEAM",
      "COHERENCE ACCESS",
      "VISIBLE GLOBE=true"
    ].forEach(function (item) {
      telemetry.appendChild(createElement("span", "", item));
    });

    shell.appendChild(orbit);
    shell.appendChild(captionNode);
    shell.appendChild(telemetry);
    mount.appendChild(shell);

    return {
      ok: true,
      version: VERSION,
      visibleGlobe: true
    };
  }

  window.DGBShowroomGlobeInstrument = {
    version: VERSION,
    renderGlobe: renderGlobe
  };
})();
