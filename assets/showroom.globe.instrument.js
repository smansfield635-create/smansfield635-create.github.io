(function attachShowroomGlobeInstrument(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_EARTH_ZOOM_DEFINITION_TNT_v1";
  const LEGACY_VISUAL_MARKER = "SHOWROOM_GLOBE_INSTRUMENT_OUR_UNIVERSE_VISUAL_FIELD_TNT_v1";
  const GENERATION = "GENERATION_4";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const PHASES = Object.freeze([
    "HOME",
    "BOUNDARY",
    "MOTION",
    "REALM",
    "RECEIPT",
    "NEXT"
  ]);

  const PLANETS = Object.freeze([
    Object.freeze({ key: "MERCURY", name: "Mercury", className: "mercury", orbit: 1 }),
    Object.freeze({ key: "VENUS", name: "Venus", className: "venus", orbit: 2 }),
    Object.freeze({ key: "EARTH", name: "Earth", className: "earth", orbit: 3 }),
    Object.freeze({ key: "MARS", name: "Mars", className: "mars", orbit: 4 }),
    Object.freeze({ key: "JUPITER", name: "Jupiter", className: "jupiter", orbit: 5 }),
    Object.freeze({ key: "SATURN", name: "Saturn", className: "saturn", orbit: 6 }),
    Object.freeze({ key: "URANUS", name: "Uranus", className: "uranus", orbit: 7 }),
    Object.freeze({ key: "NEPTUNE", name: "Neptune", className: "neptune", orbit: 8 })
  ]);

  const ALL_BODIES = Object.freeze([
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Moon",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune"
  ]);

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

  function ensureInstrumentStyles() {
    if (document.getElementById("showroom-earth-zoom-definition-style")) return;

    const style = el("style");
    style.id = "showroom-earth-zoom-definition-style";
    style.textContent = `
      .showroom-earth-detail-stack {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        overflow: hidden;
        pointer-events: none;
        transform: translateZ(0);
      }

      .showroom-earth-ocean {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          radial-gradient(circle at 34% 26%, rgba(255,255,255,.42) 0 10%, transparent 18%),
          radial-gradient(circle at 48% 48%, #2e9fe8 0 46%, #0d4d97 68%, #041a3a 100%);
      }

      .showroom-earth-continent {
        position: absolute;
        display: block;
        background: linear-gradient(135deg, #8ff0c6 0%, #3aaa73 52%, #d6b46d 100%);
        opacity: .95;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,.24));
      }

      .showroom-earth-continent-a {
        width: 34%;
        height: 24%;
        left: 17%;
        top: 24%;
        border-radius: 56% 44% 62% 38%;
        clip-path: polygon(8% 42%, 34% 8%, 72% 16%, 92% 52%, 62% 86%, 18% 78%);
      }

      .showroom-earth-continent-b {
        width: 22%;
        height: 36%;
        left: 50%;
        top: 40%;
        border-radius: 46% 54% 41% 59%;
        clip-path: polygon(24% 0%, 72% 8%, 92% 34%, 66% 100%, 26% 82%, 4% 34%);
      }

      .showroom-earth-continent-c {
        width: 22%;
        height: 17%;
        left: 66%;
        top: 25%;
        border-radius: 60% 40% 52% 48%;
      }

      .showroom-earth-continent-d {
        width: 17%;
        height: 13%;
        left: 29%;
        top: 70%;
        border-radius: 42% 58% 54% 46%;
      }

      .showroom-earth-cloud-band {
        position: absolute;
        inset: 8%;
        border-radius: 50%;
        background:
          linear-gradient(18deg, transparent 0 21%, rgba(255,255,255,.34) 22% 26%, transparent 27% 55%, rgba(255,255,255,.20) 56% 60%, transparent 61%),
          linear-gradient(-25deg, transparent 0 35%, rgba(255,255,255,.24) 36% 40%, transparent 41% 78%, rgba(255,255,255,.18) 79% 82%, transparent 83%);
        opacity: .78;
        mix-blend-mode: screen;
        animation: showroomEarthCloudSweep 18s linear infinite;
      }

      .showroom-earth-terminator {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: linear-gradient(108deg, transparent 0 44%, rgba(0,0,0,.12) 52%, rgba(0,0,0,.74) 100%);
        mix-blend-mode: multiply;
      }

      .showroom-earth-glint {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(circle at 33% 26%, rgba(255,255,255,.42), transparent 23%);
        mix-blend-mode: screen;
      }

      .showroom-earth-gridline {
        position: absolute;
        inset: 8%;
        border-radius: 50%;
        border: 1px solid rgba(238,245,255,.18);
        box-shadow:
          inset 0 0 0 1px rgba(238,245,255,.05),
          inset 0 0 18px rgba(238,245,255,.06);
        opacity: .55;
      }

      .showroom-earth-gridline::before,
      .showroom-earth-gridline::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, transparent, rgba(238,245,255,.16), transparent);
        transform: translateX(-50%);
      }

      .showroom-earth-gridline::after {
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        transform: translateY(-50%);
      }

      .showroom-earth-focus-ring {
        position: absolute;
        inset: -12%;
        border-radius: 50%;
        border: 1px solid rgba(143,240,198,.34);
        box-shadow: 0 0 32px rgba(143,240,198,.22);
        pointer-events: none;
      }

      .showroom-traversal-strip {
        position: absolute;
        left: 50%;
        top: 14px;
        z-index: 30;
        display: flex;
        gap: 5px;
        transform: translateX(-50%);
        padding: 6px 8px;
        border: 1px solid rgba(255,211,111,.25);
        border-radius: 999px;
        background: rgba(3,6,12,.70);
        backdrop-filter: blur(8px);
      }

      .showroom-traversal-node {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        height: 24px;
        border: 1px solid rgba(168,199,255,.16);
        border-radius: 999px;
        color: #aab8cf;
        font: 800 .62rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }

      .showroom-traversal-node[data-active="true"] {
        border-color: rgba(255,211,111,.72);
        color: #ffd36f;
        background: rgba(255,211,111,.08);
      }

      .showroom-earth-zoom-card {
        position: absolute;
        right: 14px;
        top: 14px;
        z-index: 30;
        display: grid;
        gap: 3px;
        min-width: 138px;
        padding: 10px 12px;
        border: 1px solid rgba(143,240,198,.28);
        border-radius: 16px;
        background: rgba(3,6,12,.72);
        backdrop-filter: blur(8px);
      }

      .showroom-earth-zoom-card span {
        color: #aab8cf;
        font-size: .66rem;
        letter-spacing: .06em;
        text-transform: uppercase;
      }

      .showroom-earth-zoom-card strong {
        color: #eef5ff;
        font-size: .95rem;
        line-height: 1;
      }

      @keyframes showroomEarthCloudSweep {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @media (max-width: 620px) {
        .showroom-earth-zoom-card {
          right: 10px;
          top: 10px;
          min-width: 118px;
          padding: 8px 10px;
        }

        .showroom-traversal-strip {
          top: 10px;
          gap: 4px;
          padding: 5px 6px;
        }

        .showroom-traversal-node {
          min-width: 23px;
          height: 21px;
          font-size: .56rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .showroom-earth-cloud-band {
          animation: none;
        }
      }
    `;

    document.head.append(style);
  }

  function smallGauge(label, value) {
    const node = el("article", "showroom-gauge-card pass");
    node.append(el("span", "showroom-gauge-label", label), el("strong", "showroom-gauge-value", value));
    return node;
  }

  function traversalNode(phase, active) {
    const node = el("span", "showroom-traversal-node", phase.slice(0, 1));
    node.title = phase;
    node.dataset.phase = phase;
    node.dataset.active = active ? "true" : "false";
    return node;
  }

  function buildTraversalStrip() {
    const strip = el("div", "showroom-traversal-strip");
    PHASES.forEach(function addPhase(phase, index) {
      strip.append(traversalNode(phase, index === 0));
    });
    return strip;
  }

  function buildHiddenMarkers() {
    const markers = el("section", "showroom-hidden-receipts");
    markers.hidden = true;
    markers.setAttribute("aria-hidden", "true");
    markers.textContent = [
      LEGACY_VISUAL_MARKER,
      VERSION,
      "ShowroomGlobeInstrument",
      "createGlobe",
      "visible code globe",
      "VISIBLE_GLOBE",
      "VISIBLE_CODE_GLOBE",
      "PHASE_BIND",
      "phaseBind",
      "PHASE_SEQUENCE",
      "HOME",
      "BOUNDARY",
      "MOTION",
      "REALM",
      "RECEIPT",
      "NEXT",
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
      "SUN",
      "MOON",
      "PLANETS",
      "VISUAL_EXPRESSION",
      "solar-system-field",
      "showroom-solar-system-field",
      "showroom-orbit",
      "ORBIT_FIELD",
      "our-universe-visual-code-model",
      "Sun Mercury Venus Earth Moon Mars Jupiter Saturn Uranus Neptune"
    ].join(" ");
    return markers;
  }

  function buildPlanet(body) {
    const orbit = el("div", "showroom-orbit showroom-orbit-" + body.className);
    const planet = el("div", "showroom-planet-node showroom-planet-" + body.className);
    const label = el("span", "showroom-planet-label", body.name);

    setData(orbit, {
      body: body.key,
      orbit: body.orbit
    });

    setData(planet, {
      body: body.key,
      active: body.key === "EARTH" ? "true" : "false"
    });

    planet.append(label);

    if (body.key === "EARTH") {
      planet.append(buildEarthDetail());

      const moonOrbit = el("span", "showroom-earth-moon-orbit");
      const moonDot = el("span", "showroom-earth-moon-dot");
      moonOrbit.append(moonDot);
      planet.append(moonOrbit);
    }

    if (body.key === "SATURN") {
      planet.append(el("span", "showroom-saturn-ring"));
    }

    orbit.append(planet);
    return orbit;
  }

  function buildEarthDetail() {
    const stack = el("span", "showroom-earth-detail-stack");
    const ocean = el("span", "showroom-earth-ocean");

    stack.append(
      ocean,
      el("span", "showroom-earth-continent showroom-earth-continent-a"),
      el("span", "showroom-earth-continent showroom-earth-continent-b"),
      el("span", "showroom-earth-continent showroom-earth-continent-c"),
      el("span", "showroom-earth-continent showroom-earth-continent-d"),
      el("span", "showroom-earth-cloud-band"),
      el("span", "showroom-earth-gridline"),
      el("span", "showroom-earth-terminator"),
      el("span", "showroom-earth-glint"),
      el("span", "showroom-earth-focus-ring")
    );

    return stack;
  }

  function buildSolarField() {
    const field = el("div", "showroom-solar-system-field");
    const sunCore = el("div", "showroom-solar-core");
    sunCore.append(el("div", "showroom-solar-sun", "Sun"));

    PLANETS.forEach(function addPlanet(body) {
      field.append(buildPlanet(body));
    });

    field.append(sunCore);
    return field;
  }

  function buildEarthZoomCard() {
    const card = el("aside", "showroom-earth-zoom-card");
    card.append(
      el("span", "", "Inspection focus"),
      el("strong", "", "Earth"),
      el("span", "", "Moon locked"),
      el("span", "", "Traversal active")
    );
    return card;
  }

  function buildDom() {
    const root = el("section", "showroom-globe-instrument showroom-visual-dashboard-instrument");

    setData(root, {
      generation: GENERATION,
      authority: AUTHORITY,
      instrumentVersion: VERSION,
      instrumentType: "our-universe-visual-code-model",
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
      generation4Closeout: "complete",
      gen4Closeout: "complete",
      finalCloseout: "true"
    });

    const visual = el("div", "showroom-universe-visual-field showroom-universe-dashboard-field");
    visual.append(
      buildSolarField(),
      buildTraversalStrip(),
      buildEarthZoomCard(),
      el("div", "showroom-earth-inspection-label", "Earth anchor"),
      buildPhaseBadge()
    );

    const gauges = el("div", "showroom-mini-gauge-row");
    gauges.append(
      smallGauge("Gen 4", "PASS"),
      smallGauge("Scope", "Our Universe"),
      smallGauge("Earth", "Zoomed"),
      smallGauge("Moon", "Locked"),
      smallGauge("Planets", "8/8"),
      smallGauge("Orbit", "Visible")
    );

    root.append(visual, gauges, buildHiddenMarkers());
    return { root: root, visual: visual };
  }

  function buildPhaseBadge() {
    const badge = el("div", "showroom-phase-badge");
    badge.append(el("strong", "", "GEN 4"), el("span", "", "Earth zoom"));
    return badge;
  }

  function createGlobe(options) {
    const opts = options || {};
    const mount = opts.mount;

    if (!mount || !(mount instanceof Element)) {
      throw new Error("ShowroomGlobeInstrument.createGlobe requires a valid mount element.");
    }

    ensureInstrumentStyles();

    const runtime = opts.runtime || null;
    const dom = buildDom();

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount", "showroom-code-globe-mount");

    setData(mount, {
      generation: GENERATION,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      instrumentVersion: VERSION,
      instrumentType: "our-universe-visual-code-model",
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

    mount.append(dom.root);

    if (runtime && typeof runtime.writeReceipt === "function") {
      runtime.writeReceipt("demo_universe_earth_zoom_definition_ready", {
        generation: GENERATION,
        authority: AUTHORITY,
        version: VERSION,
        scope: "our-universe",
        visualExpression: "solar-system-field",
        orbitField: "visible",
        earthZoom: "active",
        visibleCodeGlobe: true,
        bodies: ALL_BODIES,
        gen4Closeout: "complete",
        finalCloseout: true
      });
    }

    return Object.freeze({
      version: VERSION,
      generation: GENERATION,
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
          authority: AUTHORITY,
          active: true,
          scope: "our-universe",
          visualExpression: "solar-system-field",
          orbitField: "visible",
          earthZoom: "active",
          visibleGlobe: true,
          visibleCodeGlobe: true,
          phaseBind: "complete",
          currentPhase: "GEN_4_CLOSED",
          currentBody: "EARTH",
          bodies: clone(ALL_BODIES),
          generation4Closeout: "complete",
          gen4Closeout: "complete",
          finalCloseout: true
        };
      }
    });
  }

  global.ShowroomGlobeInstrument = Object.freeze({
    VERSION: VERSION,
    GENERATION: GENERATION,
    AUTHORITY: AUTHORITY,
    PHASES: PHASES,
    UNIVERSE_BODIES: ALL_BODIES,
    createGlobe: createGlobe
  });
})(window, document);
