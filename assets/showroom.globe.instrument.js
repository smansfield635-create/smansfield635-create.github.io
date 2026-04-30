(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_OUR_UNIVERSE_VISUAL_FIELD_TNT_v1";
  const GENERATION = "GENERATION_4";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const DEFAULTS = Object.freeze({
    degreesPerSecond: 5.2,
    cloudDegreesPerSecond: 2.1,
    moonDegreesPerSecond: 0.85,
    phaseMs: 3200,
    bodyMs: 4200,
    homeLabel: "Earth Anchor · Our Universe"
  });

  const UNIVERSE_BODIES = Object.freeze([
    Object.freeze({ key: "SUN", name: "Sun", role: "central light and gravity anchor", className: "sun", order: 0 }),
    Object.freeze({ key: "MERCURY", name: "Mercury", role: "inner planet and first orbital marker", className: "mercury", order: 1 }),
    Object.freeze({ key: "VENUS", name: "Venus", role: "inner planet and pressure marker", className: "venus", order: 2 }),
    Object.freeze({ key: "EARTH", name: "Earth", role: "primary inspection anchor", className: "earth", order: 3 }),
    Object.freeze({ key: "MOON", name: "Moon", role: "Earth companion and first orbital proof", className: "moon", order: 4 }),
    Object.freeze({ key: "MARS", name: "Mars", role: "outer terrestrial marker", className: "mars", order: 5 }),
    Object.freeze({ key: "JUPITER", name: "Jupiter", role: "gas giant and mass-scale marker", className: "jupiter", order: 6 }),
    Object.freeze({ key: "SATURN", name: "Saturn", role: "ringed planet and boundary marker", className: "saturn", order: 7 }),
    Object.freeze({ key: "URANUS", name: "Uranus", role: "outer ice giant and tilted-axis marker", className: "uranus", order: 8 }),
    Object.freeze({ key: "NEPTUNE", name: "Neptune", role: "outer ice giant and far-orbit marker", className: "neptune", order: 9 })
  ]);

  const PHASES = Object.freeze([
    Object.freeze({
      key: "HOME",
      title: "Earth Anchor",
      state: "anchored",
      proof: "Earth remains the primary inspection anchor inside the larger Demo Universe.",
      consequence: "The inspection begins from Earth while preserving the full our-universe field."
    }),
    Object.freeze({
      key: "BOUNDARY",
      title: "Solar-System Boundary",
      state: "scaffolded",
      proof: "The Sun, Moon, and all planets are visible code-native entities.",
      consequence: "The route now reads as our universe, not an isolated Earth globe."
    }),
    Object.freeze({
      key: "MOTION",
      title: "Orbital Motion",
      state: "sequenced",
      proof: "The field shows orbital relationship around the Sun while Earth remains inspectable.",
      consequence: "Motion expresses solar-system relation, not decoration."
    }),
    Object.freeze({
      key: "REALM",
      title: "Realm Separation",
      state: "separated",
      proof: "The parent Showroom remains the proof shell while Demo Universe owns visual inspection.",
      consequence: "The universe model stays on the inspection route only."
    }),
    Object.freeze({
      key: "RECEIPT",
      title: "Receipt Field",
      state: "written",
      proof: "Every body and phase leaves readable evidence.",
      consequence: "The user can audit the universe model without hidden graphic dependency."
    }),
    Object.freeze({
      key: "NEXT",
      title: "Closeout Ready",
      state: "closed-ready",
      proof: "Generation 4 remains closed while expression is filled.",
      consequence: "Further work is visual refinement, not generation recovery."
    })
  ]);

  function createElement(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function setDataset(node, values) {
    Object.keys(values).forEach(function setKey(key) {
      node.dataset[key] = String(values[key]);
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function receiptLine(name, value) {
    const item = createElement("li", "showroom-globe-receipt");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function tag(text) {
    return createElement("span", "showroom-contract-tag", text);
  }

  function normalizeContract(contract) {
    return Object.assign(
      {
        mode: "standalone",
        realm: "demo-universe-our-universe-realm",
        route: "/showroom/globe/",
        routeRole: "standalone-demo-universe-inspection-surface",
        chamber: "STANDALONE_DEMO_UNIVERSE_OUR_UNIVERSE",
        homeLabel: DEFAULTS.homeLabel,
        speedMultiplier: 1
      },
      contract || {}
    );
  }

  function buildLandmass(className) {
    return createElement("span", "showroom-code-landmass " + className);
  }

  function buildCloud(className) {
    return createElement("span", "showroom-code-cloud " + className);
  }

  function buildBodyNode(body, index) {
    const item = createElement("li", "showroom-universe-body showroom-universe-body-" + body.className);
    setDataset(item, {
      body: body.key,
      index: index,
      active: index === 3 ? "true" : "false"
    });

    const marker = createElement("span", "showroom-universe-marker");
    const name = createElement("strong", "showroom-universe-body-name", body.name);
    const role = createElement("span", "showroom-universe-body-role", " — " + body.role);

    item.append(marker, name, role);
    return item;
  }

  function buildOrbitNode(body, orbitIndex) {
    const orbit = createElement("div", "showroom-orbit showroom-orbit-" + body.className);
    const planet = createElement("div", "showroom-planet-node showroom-planet-" + body.className);
    const label = createElement("span", "showroom-planet-label", body.name);

    setDataset(orbit, {
      body: body.key,
      orbit: orbitIndex
    });

    setDataset(planet, {
      body: body.key,
      active: body.key === "EARTH" ? "true" : "false"
    });

    planet.append(label);

    if (body.key === "EARTH") {
      const moonOrbit = createElement("span", "showroom-earth-moon-orbit");
      const moonDot = createElement("span", "showroom-earth-moon-dot");
      moonOrbit.append(moonDot);
      planet.append(moonOrbit);
    }

    if (body.key === "SATURN") {
      const ring = createElement("span", "showroom-saturn-ring");
      planet.append(ring);
    }

    orbit.append(planet);
    return orbit;
  }

  function buildSolarField() {
    const field = createElement("div", "showroom-solar-system-field");
    field.setAttribute("aria-label", "Code-generated solar-system field");

    const center = createElement("div", "showroom-solar-core");
    const sun = createElement("div", "showroom-solar-sun", "Sun");
    center.append(sun);

    const orbitBodies = UNIVERSE_BODIES.filter(function filterBody(body) {
      return body.key !== "SUN" && body.key !== "MOON";
    });

    orbitBodies.forEach(function addOrbit(body, index) {
      field.append(buildOrbitNode(body, index + 1));
    });

    field.append(center);
    return field;
  }

  function buildGlobeDom(contract) {
    const root = createElement("section", "showroom-globe-instrument showroom-gen4-closeout-globe showroom-demo-universe-instrument");
    root.setAttribute("aria-label", "Generation 4 Demo Universe visual field for our universe");

    setDataset(root, {
      generation: GENERATION,
      authority: AUTHORITY,
      instrumentType: "our-universe-visual-code-model",
      visibleGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      sun: "included",
      moon: "included",
      planets: "included",
      graphicDependency: "false",
      externalImageDependency: "false",
      generatedImageDependency: "false",
      gen4Closeout: "complete",
      finalCloseout: "true"
    });

    const stage = createElement("div", "showroom-code-globe-stage showroom-gen4-stage showroom-demo-universe-stage");
    stage.setAttribute("aria-label", "Generation 4 Demo Universe visual expression stage");

    const universeField = createElement("div", "showroom-universe-visual-field");
    const solarField = buildSolarField();

    const axisFrame = createElement("div", "showroom-code-axis-frame");
    const axis = createElement("div", "showroom-code-axis");

    const globe = createElement("div", "showroom-code-globe showroom-phase-bound-globe showroom-gen4-closed-globe");
    globe.setAttribute("role", "img");
    globe.setAttribute("aria-label", "Earth inspection anchor inside the visible solar-system field");

    const surfaceTrack = createElement("div", "showroom-code-surface-track");
    const surfaceA = createElement("div", "showroom-code-surface showroom-code-surface-a");
    const surfaceB = createElement("div", "showroom-code-surface showroom-code-surface-b");

    ["land-a", "land-b", "land-c", "land-d", "land-e", "land-f"].forEach(function addLand(name) {
      surfaceA.append(buildLandmass(name));
      surfaceB.append(buildLandmass(name));
    });

    surfaceTrack.append(surfaceA, surfaceB);

    const cloudLayerA = createElement("div", "showroom-code-cloud-layer showroom-code-cloud-layer-a");
    const cloudLayerB = createElement("div", "showroom-code-cloud-layer showroom-code-cloud-layer-b");

    ["cloud-a", "cloud-b", "cloud-c", "cloud-d"].forEach(function addCloud(name) {
      cloudLayerA.append(buildCloud(name));
      cloudLayerB.append(buildCloud(name));
    });

    const highlight = createElement("div", "showroom-code-highlight");
    const terminator = createElement("div", "showroom-code-terminator");
    const atmosphere = createElement("div", "showroom-code-atmosphere");
    const homePin = createElement("div", "showroom-code-home-pin");
    homePin.title = contract.homeLabel || DEFAULTS.homeLabel;

    const phaseBadge = createElement("div", "showroom-phase-badge");
    const phaseKey = createElement("strong", "", PHASES[0].key);
    const phaseState = createElement("span", "", PHASES[0].state);
    phaseBadge.append(phaseKey, phaseState);

    globe.append(surfaceTrack, cloudLayerA, cloudLayerB, highlight, terminator, atmosphere, homePin, phaseBadge);
    axisFrame.append(axis, globe);

    const earthLabel = createElement("div", "showroom-earth-inspection-label", "Earth inspection anchor");
    universeField.append(solarField, axisFrame, earthLabel);

    const phasePanel = createElement("article", "showroom-phase-panel");
    const phaseKicker = createElement("p", "showroom-narrative-kicker", "Generation 4 · Demo Universe");
    const phaseTitle = createElement("h2", "showroom-narrative-title", PHASES[0].title);
    const phaseProof = createElement("p", "showroom-narrative-proof", PHASES[0].proof);
    const phaseConsequence = createElement("p", "showroom-narrative-consequence", PHASES[0].consequence);

    const phaseRing = createElement("ol", "showroom-phase-ring");
    PHASES.forEach(function addPhase(phase, index) {
      const node = createElement("li", "showroom-phase-node", phase.key);
      setDataset(node, {
        phase: phase.key,
        active: index === 0 ? "true" : "false",
        complete: "false"
      });
      phaseRing.append(node);
    });

    const bodyList = createElement("ol", "showroom-universe-bodies");
    UNIVERSE_BODIES.forEach(function addBody(body, index) {
      bodyList.append(buildBodyNode(body, index));
    });

    phasePanel.append(phaseKicker, phaseTitle, phaseProof, phaseConsequence, phaseRing, bodyList);
    stage.append(universeField, phasePanel);

    const caption = createElement(
      "h2",
      "showroom-globe-caption",
      "GENERATION 4 · DEMO UNIVERSE · OUR UNIVERSE VISUAL FIELD"
    );

    const tags = createElement("div", "showroom-contract-tags");
    [
      "GEN 4",
      "visual=our-universe",
      "sun=included",
      "moon=included",
      "all-planets=included",
      "earth=anchor",
      "orbits=visible",
      "phase-bind=complete",
      "closeout=complete",
      "parent-globe=false"
    ].forEach(function addTag(text) {
      tags.append(tag(text));
    });

    const status = createElement("aside", "showroom-globe-status");
    status.append(
      createElement("h3", "", "Demo Universe receipts"),
      createElement(
        "p",
        "",
        "This layer preserves Generation 4 while filling the visual expression: central Sun, visible orbital field, all planets, Earth inspection anchor, and Moon relationship."
      )
    );

    const receipts = createElement("ul", "showroom-globe-receipts");
    [
      ["GENERATION", GENERATION],
      ["AUTHORITY", AUTHORITY],
      ["INSTRUMENT_TYPE", "our-universe-visual-code-model"],
      ["DEMO_UNIVERSE_SCOPE", "our-universe"],
      ["VISUAL_EXPRESSION", "solar-system-field"],
      ["ROUTE_REALM", contract.realm],
      ["ROUTE_ROLE", contract.routeRole],
      ["VISIBLE_GLOBE", "true"],
      ["EARTH_ROLE", "primary inspection anchor"],
      ["SUN", "included"],
      ["MOON", "included"],
      ["PLANETS", "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune"],
      ["ORBIT_FIELD", "visible"],
      ["PARENT_GLOBE_REQUIRED", "false"],
      ["PHASE_BIND", "complete"],
      ["PHASE_SEQUENCE", "HOME → BOUNDARY → MOTION → REALM → RECEIPT → NEXT"],
      ["CURRENT_PHASE", PHASES[0].key],
      ["GENERATION_4_CLOSEOUT", "complete"],
      ["GEN4_CLOSEOUT", "complete"],
      ["FINAL_CLOSEOUT", "true"],
      ["GEN_4_FINAL_PASS", "demo-universe-our-universe-visual-field"],
      ["NEXT_ALLOWED_GENERATION", "POST_GEN4_REFINEMENT_ONLY"]
    ].forEach(function addReceipt(pair) {
      receipts.append(receiptLine(pair[0], pair[1]));
    });

    status.append(receipts);
    root.append(stage, caption, tags, status);

    return {
      root,
      globe,
      surfaceTrack,
      cloudLayerA,
      cloudLayerB,
      phaseBadge,
      phaseKey,
      phaseState,
      phaseTitle,
      phaseProof,
      phaseConsequence,
      phaseRing,
      bodyList,
      solarField,
      receipts
    };
  }

  function createGlobe(options) {
    const opts = options || {};
    const mount = opts.mount;

    if (!mount || !(mount instanceof Element)) {
      throw new Error("ShowroomGlobeInstrument requires a valid mount element.");
    }

    const contract = normalizeContract(opts.contract);
    const runtime = opts.runtime || null;
    const speedMultiplier = clamp(Number(contract.speedMultiplier || 1), 0.2, 2.5);
    const globeSpeed = DEFAULTS.degreesPerSecond * speedMultiplier;
    const cloudSpeed = DEFAULTS.cloudDegreesPerSecond * speedMultiplier;
    const phaseMs = Number(opts.phaseMs || DEFAULTS.phaseMs);
    const bodyMs = Number(opts.bodyMs || DEFAULTS.bodyMs);

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount", "showroom-code-globe-mount", "showroom-gen4-mount");

    setDataset(mount, {
      generation: GENERATION,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      instrumentType: "our-universe-visual-code-model",
      visibleGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      gen4Closeout: "complete",
      finalCloseout: "true"
    });

    const dom = buildGlobeDom(contract);
    mount.append(dom.root);

    let active = true;
    let frame = 0;
    let phaseTimer = 0;
    let bodyTimer = 0;
    let previous = performance.now();
    let surfaceShift = 0;
    let cloudA = 0;
    let cloudB = 0;
    let phaseIndex = 0;
    let bodyIndex = 3;
    const localReceipts = [];

    function writeRuntimeReceipt(type, payload) {
      const receipt = {
        type: type,
        generation: GENERATION,
        authority: AUTHORITY,
        payload: payload || {},
        timestamp: new Date().toISOString()
      };

      localReceipts.push(receipt);
      if (localReceipts.length > 128) {
        localReceipts.splice(0, localReceipts.length - 128);
      }

      if (runtime && typeof runtime.writeReceipt === "function") {
        runtime.writeReceipt(type, payload || {});
      }

      if (runtime && typeof runtime.writePhaseReceipt === "function" && payload && payload.phase) {
        runtime.writePhaseReceipt(payload.phase, payload);
      }

      return receipt;
    }

    function setBody(index) {
      bodyIndex = index % UNIVERSE_BODIES.length;
      const body = UNIVERSE_BODIES[bodyIndex];

      Array.from(dom.bodyList.children).forEach(function update(node, nodeIndex) {
        node.dataset.active = nodeIndex === bodyIndex ? "true" : "false";
      });

      Array.from(dom.solarField.querySelectorAll(".showroom-planet-node")).forEach(function updatePlanet(node) {
        node.dataset.active = node.dataset.body === body.key ? "true" : "false";
      });

      dom.root.dataset.currentBody = body.key;
      mount.dataset.currentBody = body.key;

      const oldBodyReceipt = dom.receipts.querySelectorAll("[data-body-receipt='true']");
      oldBodyReceipt.forEach(function remove(node) {
        node.remove();
      });

      const line = receiptLine("ACTIVE_BODY", body.name + ": " + body.role);
      line.dataset.bodyReceipt = "true";
      dom.receipts.append(line);

      write
