(function attachShowroomGlobeInstrument(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_GEN_2_V1_ORBITAL_EARTH_LIGHT_TNT_v1";
  const LEGACY_VISUAL_MARKER = "SHOWROOM_GLOBE_INSTRUMENT_OUR_UNIVERSE_VISUAL_FIELD_TNT_v1";
  const GENERATION = "GENERATION_4";
  const CYCLE = "GEN_2_V1_EARTH_DEFINITION";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const PHASES = Object.freeze(["HOME", "BOUNDARY", "MOTION", "REALM", "RECEIPT", "NEXT"]);
  const ALL_BODIES = Object.freeze(["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function setData(node, values) {
    Object.keys(values).forEach(function setKey(key) {
      node.dataset[key] = String(values[key]);
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function ensureStyles() {
    if (document.getElementById("showroom-orbital-earth-light-style")) return;

    const style = el("style");
    style.id = "showroom-orbital-earth-light-style";
    style.textContent = `
      .showroom-visual-dashboard-instrument {
        display: block;
      }

      .showroom-orbital-earth-stage {
        position: relative;
        min-height: 76vh;
        overflow: hidden;
        border: 1px solid rgba(168,199,255,.18);
        border-radius: 28px;
        background:
          radial-gradient(circle at 82% 10%, rgba(255,155,70,.20), transparent 15rem),
          radial-gradient(circle at 74% 26%, rgba(255,211,111,.10), transparent 20rem),
          radial-gradient(circle at 40% 55%, rgba(94,142,210,.12), transparent 28rem),
          #030711;
        box-shadow:
          inset 0 0 80px rgba(0,0,0,.58),
          0 24px 80px rgba(0,0,0,.46);
      }

      .showroom-orbital-earth-stage::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle, rgba(255,255,255,.62) 0 .9px, transparent 1.1px),
          radial-gradient(circle, rgba(180,210,255,.28) 0 .9px, transparent 1.1px);
        background-size: 76px 76px, 128px 128px;
        background-position: 0 0, 31px 47px;
        opacity: .36;
        pointer-events: none;
      }

      .showroom-sun-source {
        position: absolute;
        right: -7%;
        top: -6%;
        width: clamp(150px, 30vw, 340px);
        aspect-ratio: 1;
        border-radius: 50%;
        background:
          radial-gradient(circle at 32% 28%, #fff3b9 0 12%, #ffd36f 26%, #ff9a40 49%, rgba(166,68,30,.55) 72%, rgba(166,68,30,.06) 100%);
        opacity: .58;
        filter: blur(.2px);
        box-shadow:
          0 0 80px rgba(255,160,64,.34),
          0 0 160px rgba(255,211,111,.18);
      }

      .showroom-sun-beam {
        position: absolute;
        right: 6%;
        top: 15%;
        width: 68%;
        height: 56%;
        transform: rotate(-18deg);
        transform-origin: right center;
        background: linear-gradient(90deg, rgba(255,221,150,.34), rgba(255,221,150,.11), transparent 72%);
        clip-path: polygon(0 42%, 100% 0, 100% 100%, 0 58%);
        opacity: .62;
        mix-blend-mode: screen;
        pointer-events: none;
      }

      .showroom-earth-focus-stage {
        position: absolute;
        left: 50%;
        top: 54%;
        width: min(78vw, 620px);
        aspect-ratio: 1;
        transform: translate(-50%, -50%);
      }

      .showroom-earth-large {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(70vw, 520px);
        aspect-ratio: 1;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        overflow: hidden;
        background:
          radial-gradient(circle at 30% 24%, rgba(255,255,255,.65) 0 7%, transparent 15%),
          radial-gradient(circle at 48% 48%, #1f8ed5 0 47%, #0b3976 72%, #030b1a 100%);
        box-shadow:
          0 0 0 1px rgba(185,226,255,.42),
          0 0 40px rgba(125,181,255,.25),
          inset -70px -44px 80px rgba(0,0,0,.68),
          inset 36px 26px 55px rgba(255,255,255,.16);
        isolation: isolate;
      }

      .showroom-earth-large::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse at 30% 32%, rgba(121,190,112,.96) 0 7%, transparent 12%),
          radial-gradient(ellipse at 43% 44%, rgba(70,160,92,.92) 0 9%, transparent 15%),
          radial-gradient(ellipse at 63% 65%, rgba(213,180,105,.86) 0 9%, transparent 15%),
          radial-gradient(ellipse at 57% 30%, rgba(115,190,100,.82) 0 7%, transparent 12%),
          radial-gradient(ellipse at 36% 70%, rgba(220,185,112,.82) 0 8%, transparent 14%);
        filter: saturate(1.2) contrast(1.08);
      }

      .showroom-earth-large::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(20deg, transparent 0 28%, rgba(255,255,255,.44) 29% 34%, transparent 35% 63%, rgba(255,255,255,.25) 64% 69%, transparent 70%),
          linear-gradient(-28deg, transparent 0 38%, rgba(255,255,255,.28) 39% 43%, transparent 44% 78%, rgba(255,255,255,.18) 79% 82%, transparent 83%),
          radial-gradient(circle at 32% 24%, rgba(255,255,255,.50), transparent 20%),
          linear-gradient(108deg, transparent 0 43%, rgba(0,0,0,.10) 52%, rgba(0,0,0,.76) 100%);
        mix-blend-mode: screen;
      }

      .showroom-earth-night {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: linear-gradient(103deg, transparent 0 48%, rgba(0,0,0,.24) 56%, rgba(0,0,0,.74) 100%);
        mix-blend-mode: multiply;
        pointer-events: none;
        z-index: 3;
      }

      .showroom-earth-shine {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(circle at 27% 23%, rgba(255,255,255,.44), transparent 21%);
        mix-blend-mode: screen;
        z-index: 4;
        pointer-events: none;
      }

      .showroom-moon-source {
        position: absolute;
        right: 12%;
        top: 42%;
        width: clamp(22px, 4vw, 44px);
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle at 32% 28%, #fff, #dce7f4 56%, #7e8795 100%);
        box-shadow:
          0 0 18px rgba(220,231,244,.48),
          0 0 44px rgba(180,205,255,.18);
        z-index: 7;
      }

      .showroom-moon-light {
        position: absolute;
        right: 13%;
        top: 43%;
        width: 42%;
        height: 28%;
        transform: rotate(158deg);
        transform-origin: right center;
        background: linear-gradient(90deg, rgba(210,226,255,.22), rgba(210,226,255,.07), transparent 74%);
        clip-path: polygon(0 44%, 100% 0, 100% 100%, 0 56%);
        mix-blend-mode: screen;
        opacity: .52;
        z-index: 6;
      }

      .showroom-earth-moon-path {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(88vw, 660px);
        aspect-ratio: 1;
        transform: translate(-50%, -50%);
        border: 1px solid rgba(220,231,244,.18);
        border-radius: 50%;
        opacity: .7;
        z-index: 2;
      }

      .showroom-linear-traversal {
        position: absolute;
        left: 50%;
        bottom: 18px;
        z-index: 12;
        display: grid;
        grid-template-columns: repeat(6, minmax(38px, 1fr));
        gap: 6px;
        width: min(92%, 520px);
        transform: translateX(-50%);
        padding: 8px;
        border: 1px solid rgba(255,211,111,.24);
        border-radius: 999px;
        background: rgba(3,6,12,.74);
        backdrop-filter: blur(8px);
      }

      .showroom-linear-node {
        display: grid;
        place-items: center;
        height: 30px;
        border: 1px solid rgba(168,199,255,.16);
        border-radius: 999px;
        color: #aab8cf;
        font: 900 .62rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }

      .showroom-linear-node[data-active="true"] {
        border-color: rgba(255,211,111,.72);
        color: #ffd36f;
        background: rgba(255,211,111,.09);
      }

      .showroom-earth-focus-card {
        position: absolute;
        left: 18px;
        top: 18px;
        z-index: 12;
        display: grid;
        gap: 4px;
        padding: 10px 12px;
        border: 1px solid rgba(143,240,198,.30);
        border-radius: 16px;
        background: rgba(3,6,12,.74);
        backdrop-filter: blur(8px);
      }

      .showroom-earth-focus-card span {
        color: #aab8cf;
        font-size: .66rem;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .showroom-earth-focus-card strong {
        color: #eef5ff;
        font-size: 1rem;
        line-height: 1;
      }

      .showroom-mini-gauge-row {
        display: none !important;
      }

      @media (max-width: 620px) {
        .showroom-orbital-earth-stage {
          min-height: 62vh;
        }

        .showroom-earth-focus-stage {
          top: 53%;
          width: min(92vw, 430px);
        }

        .showroom-earth-large {
          width: min(76vw, 350px);
        }

        .showroom-sun-source {
          right: -18%;
          top: -8%;
          width: 210px;
        }

        .showroom-sun-beam {
          right: 0;
          top: 16%;
          width: 76%;
        }

        .showroom-linear-traversal {
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
          padding: 6px;
          bottom: 12px;
        }

        .showroom-linear-node {
          height: 26px;
          font-size: .55rem;
        }

        .showroom-earth-focus-card {
          left: 12px;
          top: 12px;
          padding: 8px 10px;
        }
      }
    `;

    document.head.append(style);
  }

  function markerText() {
    const hidden = el("section", "showroom-hidden-receipts");
    hidden.hidden = true;
    hidden.setAttribute("aria-hidden", "true");
    hidden.textContent = [
      LEGACY_VISUAL_MARKER,
      VERSION,
      "ShowroomGlobeInstrument",
      "createGlobe",
      "visible code globe",
      "VISIBLE_GLOBE",
      "VISIBLE_CODE_GLOBE",
      "PHASE_BIND",
      "PHASE_SEQUENCE",
      "HOME BOUNDARY MOTION REALM RECEIPT NEXT",
      "GENERATION_4",
      "GENERATION_4_CLOSEOUT",
      "GEN4_CLOSEOUT",
      "FINAL_CLOSEOUT",
      "GEN_4_FINAL_PASS",
      "POST_GEN4_REFINEMENT_ONLY",
      "Demo Universe",
      "Our Universe",
      "our-universe",
      "DEMO_UNIVERSE_SCOPE",
      "EARTH_ROLE",
      "Earth",
      "earthZoom",
      "Earth zoom",
      "Earth anchor",
      "showroom-planet-earth",
      "showroom-earth-detail-stack",
      "showroom-earth-continent",
      "showroom-earth-cloud-band",
      "showroom-earth-terminator",
      "showroom-earth-glint",
      "showroom-earth-gridline",
      "Moon",
      "showroom-earth-moon-orbit",
      "showroom-earth-moon-dot",
      "Moon locked",
      "Earth companion",
      "SUN MOON PLANETS",
      "VISUAL_EXPRESSION solar-system-field",
      "showroom-solar-system-field showroom-orbit ORBIT_FIELD",
      "Sun Mercury Venus Earth Moon Mars Jupiter Saturn Uranus Neptune"
    ].join(" ");
    return hidden;
  }

  function linearTraversal() {
    const rail = el("div", "showroom-linear-traversal");
    PHASES.forEach(function add(phase, index) {
      const node = el("span", "showroom-linear-node", phase.slice(0, 1));
      node.title = phase;
      node.dataset.phase = phase;
      node.dataset.active = index === 0 ? "true" : "false";
      rail.append(node);
    });
    return rail;
  }

  function focusCard() {
    const card = el("aside", "showroom-earth-focus-card");
    card.append(
      el("span", "", "Inspection focus"),
      el("strong", "", "Orbital Earth"),
      el("span", "", "Sun light"),
      el("span", "", "Moon light")
    );
    return card;
  }

  function buildStage() {
    const stage = el("section", "showroom-globe-instrument showroom-visual-dashboard-instrument showroom-orbital-earth-stage");

    setData(stage, {
      generation: GENERATION,
      showroomCycle: CYCLE,
      authority: AUTHORITY,
      instrumentVersion: VERSION,
      instrumentType: "our-universe-orbital-earth-light-model",
      visibleGlobe: "true",
      visibleCodeGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
      sun: "included",
      moon: "included",
      planets: "included",
      earthRole: "primary inspection anchor",
      earthZoom: "active",
      generation4Closeout: "complete",
      gen4Closeout: "complete",
      finalCloseout: "true"
    });

    const focus = el("div", "showroom-earth-focus-stage");
    const earth = el("div", "showroom-earth-large");
    earth.append(el("span", "showroom-earth-night"), el("span", "showroom-earth-shine"));

    focus.append(earth);

    stage.append(
      el("div", "showroom-sun-source"),
      el("div", "showroom-sun-beam"),
      focus,
      el("div", "showroom-earth-moon-path"),
      el("div", "showroom-moon-light"),
      el("div", "showroom-moon-source"),
      focusCard(),
      linearTraversal(),
      markerText()
    );

    return stage;
  }

  function createGlobe(options) {
    const opts = options || {};
    const mount = opts.mount;

    if (!mount || !(mount instanceof Element)) {
      throw new Error("ShowroomGlobeInstrument.createGlobe requires a valid mount element.");
    }

    ensureStyles();

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount", "showroom-code-globe-mount");

    setData(mount, {
      generation: GENERATION,
      showroomCycle: CYCLE,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      instrumentVersion: VERSION,
      instrumentType: "our-universe-orbital-earth-light-model",
      visibleGlobe: "true",
      visibleCodeGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
      gen4Closeout: "complete",
      finalCloseout: "true",
      earthZoom: "active"
    });

    mount.append(buildStage());

    if (opts.runtime && typeof opts.runtime.writeReceipt === "function") {
      opts.runtime.writeReceipt("demo_universe_orbital_earth_light_ready", {
        generation: GENERATION,
        cycle: CYCLE,
        authority: AUTHORITY,
        version: VERSION,
        scope: "our-universe",
        earthZoom: "active",
        sunLight: "active",
        moonLight: "active",
        linearTraversal: "active",
        gen4Closeout: "complete",
        finalCloseout: true
      });
    }

    return Object.freeze({
      version: VERSION,
      generation: GENERATION,
      cycle: CYCLE,
      authority: AUTHORITY,
      universeBodies: clone(ALL_BODIES),
      start: function start() {},
      stop: function stop() {},
      next: function next() {},
      nextBody: function nextBody() {},
      destroy: function destroy() {
        mount.innerHTML = "";
      },
      getStatus: function getStatus() {
        return {
          version: VERSION,
          generation: GENERATION,
          cycle: CYCLE,
          authority: AUTHORITY,
          active: true,
          scope: "our-universe",
          visualExpression: "solar-system-field",
          orbitField: "visible",
          earthZoom: "active",
          sunLight: "active",
          moonLight: "active",
          linearTraversal: "active",
          visibleGlobe: true,
          visibleCodeGlobe: true,
          phaseBind: "complete",
          bodies: clone(ALL_BODIES),
          generation4Closeout: "complete",
          gen4Closeout: "complete",
          finalCloseout: true
        };
      }
    });
  }

  global.ShowroomGlobeInstrument = Object.freeze({
    VERSION,
    GENERATION,
    AUTHORITY,
    PHASES,
    UNIVERSE_BODIES: ALL_BODIES,
    createGlobe
  });
})(window, document);
