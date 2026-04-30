(function attachShowroomGlobeInstrument(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_POST_GEN4_GLOBAL_RESTORE_TNT_v1";
  const GENERATION = "GENERATION_4";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

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

  const DEFAULTS = Object.freeze({
    globeDegreesPerSecond: 5.2,
    cloudDegreesPerSecond: 2.1,
    phaseMs: 3200,
    bodyMs: 4200,
    homeLabel: "Earth Anchor · Our Universe"
  });

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

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function receiptLine(name, value) {
    const item = createElement("li", "showroom-globe-receipt");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function contractTag(text) {
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

  function buildBodyNode(body, index) {
    const item = createElement("li", "showroom-universe-body showroom-universe-body-" + body.className);

    setDataset(item, {
      body: body.key,
      index: index,
      active: body.key === "EARTH" ? "true" : "false"
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
      planet.append(createElement("span", "showroom-saturn-ring"));
    }

    orbit.append(planet);
    return orbit;
  }

  function buildSolarSystemField() {
    const field = createElement("div", "showroom-solar-system-field");
    field.setAttribute("aria-label", "Code-generated solar-system field");

    const center = createElement("div", "showroom-solar-core");
    const sun = createElement("div", "showroom-solar-sun", "Sun");
    center.append(sun);

    UNIVERSE_BODIES.filter(function onlyPlanets(body) {
      return body.key !== "SUN" && body.key !== "MOON";
    }).forEach(function addOrbit(body, index) {
      field.append(buildOrbitNode(body, index + 1));
    });

    field.append(center);
    return field;
  }

  function buildEarthGlobe(contract) {
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

    return {
      axisFrame: axisFrame,
      globe: globe,
      surfaceTrack: surfaceTrack,
      cloudLayerA: cloudLayerA,
      cloudLayerB: cloudLayerB,
      phaseBadge: phaseBadge,
      phaseKey: phaseKey,
      phaseState: phaseState
    };
  }

  function buildPhasePanel() {
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

    return {
      phasePanel: phasePanel,
      phaseTitle: phaseTitle,
      phaseProof: phaseProof,
      phaseConsequence: phaseConsequence,
      phaseRing: phaseRing,
      bodyList: bodyList
    };
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
      orbitField: "visible",
      sun: "included",
      moon: "included",
      planets: "included",
      graphicDependency: "false",
      externalImageDependency: "false",
      generatedImageDependency: "false",
      generation4Closeout: "complete",
      gen4Closeout: "complete",
      finalCloseout: "true"
    });

    const stage = createElement("div", "showroom-code-globe-stage showroom-gen4-stage showroom-demo-universe-stage");
    stage.setAttribute("aria-label", "Generation 4 Demo Universe visual expression stage");

    const universeField = createElement("div", "showroom-universe-visual-field");
    const solarField = buildSolarSystemField();
    const earth = buildEarthGlobe(contract);
    const earthLabel = createElement("div", "showroom-earth-inspection-label", "Earth inspection anchor");

    universeField.append(solarField, earth.axisFrame, earthLabel);

    const phase = buildPhasePanel();

    stage.append(universeField, phase.phasePanel);

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
      tags.append(contractTag(text));
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
      ["INSTRUMENT_VERSION", VERSION],
      ["INSTRUMENT_TYPE", "our-universe-visual-code-model"],
      ["DEMO_UNIVERSE_SCOPE", "our-universe"],
      ["VISUAL_EXPRESSION", "solar-system-field"],
      ["ORBIT_FIELD", "visible"],
      ["ROUTE_REALM", contract.realm],
      ["ROUTE_ROLE", contract.routeRole],
      ["VISIBLE_GLOBE", "true"],
      ["EARTH_ROLE", "primary inspection anchor"],
      ["SUN", "included"],
      ["MOON", "included"],
      ["PLANETS", "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune"],
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
      root: root,
      stage: stage,
      universeField: universeField,
      solarField: solarField,
      earth: earth,
      phase: phase,
      receipts: receipts
    };
  }

  function createGlobe(options) {
    const opts = options || {};
    const mount = opts.mount;

    if (!mount || !(mount instanceof Element)) {
      throw new Error("ShowroomGlobeInstrument.createGlobe requires a valid mount element.");
    }

    const contract = normalizeContract(opts.contract);
    const runtime = opts.runtime || null;
    const speedMultiplier = clamp(Number(contract.speedMultiplier || 1), 0.2, 2.5);
    const globeSpeed = DEFAULTS.globeDegreesPerSecond * speedMultiplier;
    const cloudSpeed = DEFAULTS.cloudDegreesPerSecond * speedMultiplier;
    const phaseMs = Number(opts.phaseMs || DEFAULTS.phaseMs);
    const bodyMs = Number(opts.bodyMs || DEFAULTS.bodyMs);

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount", "showroom-code-globe-mount", "showroom-gen4-mount");

    setDataset(mount, {
      generation: GENERATION,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      instrumentVersion: VERSION,
      instrumentType: "our-universe-visual-code-model",
      visibleGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
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
        version: VERSION,
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

      Array.from(dom.phase.bodyList.children).forEach(function updateBodyList(node, nodeIndex) {
        node.dataset.active = nodeIndex === bodyIndex ? "true" : "false";
      });

      Array.from(dom.solarField.querySelectorAll(".showroom-planet-node")).forEach(function updatePlanet(node) {
        node.dataset.active = node.dataset.body === body.key ? "true" : "false";
      });

      dom.root.dataset.currentBody = body.key;
      mount.dataset.currentBody = body.key;

      Array.from(dom.receipts.querySelectorAll("[data-body-receipt='true']")).forEach(function remove(node) {
        node.remove();
      });

      const line = receiptLine("ACTIVE_BODY", body.name + ": " + body.role);
      line.dataset.bodyReceipt = "true";
      dom.receipts.append(line);

      writeRuntimeReceipt("demo_universe_body_selected", {
        body: body.key,
        name: body.name,
        role: body.role,
        order: body.order,
        route: contract.route,
        realm: contract.realm,
        scope: "our-universe",
        visualExpression: "solar-system-field"
      });
    }

    function setPhase(index) {
      phaseIndex = index % PHASES.length;
      const phase = PHASES[phaseIndex];

      dom.earth.phaseKey.textContent = phase.key;
      dom.earth.phaseState.textContent = phase.state;
      dom.phase.phaseTitle.textContent = phase.title;
      dom.phase.phaseProof.textContent = phase.proof;
      dom.phase.phaseConsequence.textContent = phase.consequence;

      Array.from(dom.phase.phaseRing.children).forEach(function updatePhase(node, nodeIndex) {
        node.dataset.active = nodeIndex === phaseIndex ? "true" : "false";
        node.dataset.complete = nodeIndex <= phaseIndex ? "true" : "false";
      });

      dom.root.dataset.currentPhase = phase.key;
      dom.root.dataset.currentState = phase.state;
      mount.dataset.currentPhase = phase.key;
      mount.dataset.currentState = phase.state;

      Array.from(dom.receipts.querySelectorAll("[data-dynamic-receipt='true']")).forEach(function remove(node) {
        node.remove();
      });

      const line = receiptLine("PHASE_" + String(phaseIndex + 1).padStart(2, "0"), phase.key + ": " + phase.consequence);
      line.dataset.dynamicReceipt = "true";
      dom.receipts.append(line);

      writeRuntimeReceipt("demo_universe_visual_field_phase", {
        phase: phase.key,
        state: phase.state,
        proof: phase.proof,
        consequence: phase.consequence,
        route: contract.route,
        realm: contract.realm,
        scope: "our-universe",
        visualExpression: "solar-system-field",
        gen4Closeout: "complete",
        finalCloseout: true
      });
    }

    function advancePhase() {
      if (!active) return;
      setPhase((phaseIndex + 1) % PHASES.length);
      phaseTimer = global.setTimeout(advancePhase, phaseMs);
    }

    function advanceBody() {
      if (!active) return;
      setBody((bodyIndex + 1) % UNIVERSE_BODIES.length);
      bodyTimer = global.setTimeout(advanceBody, bodyMs);
    }

    function tick(now) {
      if (!active) return;

      const delta = Math.max(0, (now - previous) / 1000);
      previous = now;

      surfaceShift = (surfaceShift + globeSpeed * delta) % 100;
      cloudA = (cloudA + cloudSpeed * delta) % 360;
      cloudB = (cloudB - cloudSpeed * 0.72 * delta) % 360;

      dom.earth.surfaceTrack.style.transform = "translate3d(-" + surfaceShift.toFixed(3) + "%, 0, 0)";
      dom.earth.cloudLayerA.style.transform = "rotate(" + cloudA.toFixed(3) + "deg)";
      dom.earth.cloudLayerB.style.transform = "rotate(" + cloudB.toFixed(3) + "deg)";

      frame = global.requestAnimationFrame(tick);
    }

    function start() {
      if (active && frame) return;

      active = true;
      previous = performance.now();

      writeRuntimeReceipt("showroom_globe_instrument_global_restored", {
        generation: GENERATION,
        authority: AUTHORITY,
        version: VERSION,
        route: contract.route,
        realm: contract.realm,
        scope: "our-universe",
        visualExpression: "solar-system-field",
        orbitField: "visible",
        included: UNIVERSE_BODIES.map(function mapBody(body) {
          return body.name;
        }),
        visibleGlobe: true,
        phaseBind: "complete",
        gen4Closeout: "complete",
        finalCloseout: true,
        parentGlobeRequired: false
      });

      frame = global.requestAnimationFrame(tick);
      phaseTimer = global.setTimeout(advancePhase, phaseMs);
      bodyTimer = global.setTimeout(advanceBody, bodyMs);
    }

    function stop() {
      active = false;
      if (frame) global.cancelAnimationFrame(frame);
      if (phaseTimer) global.clearTimeout(phaseTimer);
      if (bodyTimer) global.clearTimeout(bodyTimer);
      frame = 0;
      phaseTimer = 0;
      bodyTimer = 0;

      writeRuntimeReceipt("showroom_globe_instrument_global_stopped", {
        generation: GENERATION,
        authority: AUTHORITY,
        version: VERSION,
        currentPhase: PHASES[phaseIndex].key,
        currentBody: UNIVERSE_BODIES[bodyIndex].key,
        gen4Closeout: "complete"
      });
    }

    setPhase(0);
    setBody(3);
    start();

    return Object.freeze({
      version: VERSION,
      generation: GENERATION,
      authority: AUTHORITY,
      universeBodies: clone(UNIVERSE_BODIES),
      contract: clone(contract),
      start: start,
      stop: stop,
      next: function next() {
        setPhase((phaseIndex + 1) % PHASES.length);
      },
      nextBody: function nextBody() {
        setBody((bodyIndex + 1) % UNIVERSE_BODIES.length);
      },
      destroy: function destroy() {
        stop();
        mount.innerHTML = "";
        mount.dataset.instrumentLoaded = "false";
      },
      getStatus: function getStatus() {
        return {
          version: VERSION,
          generation: GENERATION,
          authority: AUTHORITY,
          active: active,
          scope: "our-universe",
          visualExpression: "solar-system-field",
          orbitField: "visible",
          visibleGlobe: true,
          phaseBind: "complete",
          currentPhase: PHASES[phaseIndex].key,
          currentBody: UNIVERSE_BODIES[bodyIndex].key,
          bodies: clone(UNIVERSE_BODIES),
          gen4Closeout: "complete",
          finalCloseout: true,
          receipts: clone(localReceipts)
        };
      }
    });
  }

  global.ShowroomGlobeInstrument = Object.freeze({
    VERSION: VERSION,
    GENERATION: GENERATION,
    AUTHORITY: AUTHORITY,
    PHASES: PHASES,
    UNIVERSE_BODIES: UNIVERSE_BODIES,
    DEFAULTS: DEFAULTS,
    createGlobe: createGlobe
  });

  global.dispatchEvent(
    new CustomEvent("showroom:globe-instrument-ready", {
      detail: {
        version: VERSION,
        generation: GENERATION,
        authority: AUTHORITY,
        createGlobeAvailable: typeof global.ShowroomGlobeInstrument.createGlobe === "function",
        scope: "our-universe",
        visualExpression: "solar-system-field"
      }
    })
  );
})(window, document);
