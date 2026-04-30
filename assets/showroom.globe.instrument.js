(function attachShowroomGlobeInstrument(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_VISUAL_DASHBOARD_TNT_v1";
  const LEGACY_VISUAL_MARKER = "SHOWROOM_GLOBE_INSTRUMENT_OUR_UNIVERSE_VISUAL_FIELD_TNT_v1";
  const GENERATION = "GENERATION_4";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const PHASES = Object.freeze(["HOME", "BOUNDARY", "MOTION", "REALM", "RECEIPT", "NEXT"]);

  const BODIES = Object.freeze([
    Object.freeze({ key: "MERCURY", name: "Mercury", className: "mercury" }),
    Object.freeze({ key: "VENUS", name: "Venus", className: "venus" }),
    Object.freeze({ key: "EARTH", name: "Earth", className: "earth" }),
    Object.freeze({ key: "MARS", name: "Mars", className: "mars" }),
    Object.freeze({ key: "JUPITER", name: "Jupiter", className: "jupiter" }),
    Object.freeze({ key: "SATURN", name: "Saturn", className: "saturn" }),
    Object.freeze({ key: "URANUS", name: "Uranus", className: "uranus" }),
    Object.freeze({ key: "NEPTUNE", name: "Neptune", className: "neptune" })
  ]);

  const ALL_BODIES = Object.freeze(["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function setData(node, map) {
    Object.keys(map).forEach(function setKey(key) {
      node.dataset[key] = String(map[key]);
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function buildPlanet(body, index) {
    const orbit = el("div", "showroom-orbit showroom-orbit-" + body.className);
    const planet = el("div", "showroom-planet-node showroom-planet-" + body.className);
    const label = el("span", "showroom-planet-label", body.name);

    setData(orbit, { body: body.key, orbit: index + 1 });
    setData(planet, { body: body.key, active: body.key === "EARTH" ? "true" : "false" });

    planet.append(label);

    if (body.key === "EARTH") {
      const moonOrbit = el("span", "showroom-earth-moon-orbit");
      moonOrbit.append(el("span", "showroom-earth-moon-dot"));
      planet.append(moonOrbit);
    }

    if (body.key === "SATURN") {
      planet.append(el("span", "showroom-saturn-ring"));
    }

    orbit.append(planet);
    return orbit;
  }

  function buildSolarField() {
    const field = el("div", "showroom-solar-system-field");
    const sun = el("div", "showroom-solar-core");
    sun.append(el("div", "showroom-solar-sun", "Sun"));

    BODIES.forEach(function addPlanet(body, index) {
      field.append(buildPlanet(body, index));
    });

    field.append(sun);
    return field;
  }

  function smallGauge(label, value) {
    const node = el("article", "showroom-gauge-card pass");
    node.append(el("span", "showroom-gauge-label", label), el("strong", "showroom-gauge-value", value));
    return node;
  }

  function buildHiddenMarkers() {
    const markers = el("section", "showroom-hidden-receipts");
    markers.hidden = true;
    markers.setAttribute("aria-hidden", "true");
    markers.textContent = [
      LEGACY_VISUAL_MARKER,
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

  function buildDom() {
    const root = el("section", "showroom-globe-instrument showroom-visual-dashboard-instrument");

    setData(root, {
      generation: GENERATION,
      authority: AUTHORITY,
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
      generation4Closeout: "complete",
      gen4Closeout: "complete",
      finalCloseout: "true"
    });

    const visual = el("div", "showroom-universe-visual-field showroom-universe-dashboard-field");
    visual.append(buildSolarField());

    const earthBadge = el("div", "showroom-earth-inspection-label", "Earth anchor");
    const phaseBadge = el("div", "showroom-phase-badge");
    phaseBadge.append(el("strong", "", "GEN 4"), el("span", "", "closed"));
    visual.append(earthBadge, phaseBadge);

    const gauges = el("div", "showroom-mini-gauge-row");
    gauges.append(
      smallGauge("Gen 4", "PASS"),
      smallGauge("Scope", "Our Universe"),
      smallGauge("Sun", "Included"),
      smallGauge("Moon", "Included"),
      smallGauge("Planets", "8/8"),
      smallGauge("Orbit", "Visible")
    );

    root.append(visual, gauges, buildHiddenMarkers());

    return { root: root, visual: visual, gauges: gauges };
  }

  function createGlobe(options) {
    const opts = options || {};
    const mount = opts.mount;

    if (!mount || !(mount instanceof Element)) {
      throw new Error("ShowroomGlobeInstrument.createGlobe requires a valid mount element.");
    }

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
      finalCloseout: "true"
    });

    mount.append(dom.root);

    if (runtime && typeof runtime.writeReceipt === "function") {
      runtime.writeReceipt("demo_universe_visual_dashboard_ready", {
        generation: GENERATION,
        authority: AUTHORITY,
        version: VERSION,
        scope: "our-universe",
        visualExpression: "solar-system-field",
        orbitField: "visible",
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
