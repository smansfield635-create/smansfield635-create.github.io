(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_GENERATION_3_PHASE_BIND_TNT_v1";
  const GENERATION = "GENERATION_3";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const DEFAULTS = Object.freeze({
    degreesPerSecond: 5.2,
    cloudDegreesPerSecond: 2.1,
    moonDegreesPerSecond: 0.85,
    phaseMs: 3200,
    homeLabel: "Home Anchor · Fort Worth"
  });

  const PHASES = Object.freeze([
    Object.freeze({
      key: "HOME",
      title: "Home Anchor",
      state: "anchored",
      proof: "The inspection globe begins from home before motion is interpreted.",
      consequence: "Origin is established before the phase sequence advances."
    }),
    Object.freeze({
      key: "BOUNDARY",
      title: "Boundary",
      state: "state-defined",
      proof: "The visible sphere remains code-generated while its meaning is carried by state.",
      consequence: "The globe’s edge is visible, but authority belongs to the phase receipt."
    }),
    Object.freeze({
      key: "MOTION",
      title: "Motion",
      state: "cycling",
      proof: "The globe rotates as a visible instrument while the phase layer explains why it moves.",
      consequence: "Motion is no longer decoration; it is mapped to the proof cycle."
    }),
    Object.freeze({
      key: "REALM",
      title: "Realm",
      state: "separated",
      proof: "Inspect Demo Universe remains standalone and does not become the parent Showroom.",
      consequence: "The globe can be inspected without collapsing route identity."
    }),
    Object.freeze({
      key: "RECEIPT",
      title: "Receipt",
      state: "written",
      proof: "The active phase leaves readable evidence.",
      consequence: "The user can audit what state the globe is carrying."
    }),
    Object.freeze({
      key: "NEXT",
      title: "Next",
      state: "ready",
      proof: "The phase cycle returns to readiness without claiming Generation 4.",
      consequence: "Generation 3 is phase-bound and ready for later closeout."
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
        realm: "demo-universe-earth-inspection-realm",
        route: "/showroom/globe/",
        routeRole: "standalone-earth-inspection-surface",
        chamber: "STANDALONE_DEMO_UNIVERSE_EARTH",
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

  function buildGlobeDom(contract) {
    const root = createElement("section", "showroom-globe-instrument showroom-gen3-phase-globe");
    root.setAttribute("aria-label", "Generation 3 phase-bound code globe instrument");

    setDataset(root, {
      generation: GENERATION,
      authority: AUTHORITY,
      instrumentType: "phase-bound-code-globe",
      visibleGlobe: "true",
      phaseBind: "active",
      graphicDependency: "false",
      externalImageDependency: "false",
      generatedImageDependency: "false",
      gen4Closeout: "held"
    });

    const stage = createElement("div", "showroom-code-globe-stage showroom-gen3-stage");
    stage.setAttribute("aria-label", "Phase-bound code globe stage");

    const lightField = createElement("div", "showroom-code-light-field");
    const sun = createElement("div", "showroom-code-sun", "☀");
    const moonTrack = createElement("div", "showroom-code-moon-track");
    const moon = createElement("div", "showroom-code-moon", "◐");
    moonTrack.append(moon);
    lightField.append(sun, moonTrack);

    const axisFrame = createElement("div", "showroom-code-axis-frame");
    const axis = createElement("div", "showroom-code-axis");

    const globe = createElement("div", "showroom-code-globe showroom-phase-bound-globe");
    globe.setAttribute("role", "img");
    globe.setAttribute("aria-label", "Generation 3 phase-bound visible code globe");

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

    const phasePanel = createElement("article", "showroom-phase-panel");
    const phaseKicker = createElement("p", "showroom-narrative-kicker", "Generation 3 phase bind");
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

    phasePanel.append(phaseKicker, phaseTitle, phaseProof, phaseConsequence, phaseRing);
    stage.append(lightField, axisFrame, phasePanel);

    const caption = createElement(
      "h2",
      "showroom-globe-caption",
      "GENERATION 3 · PHASE-BIND CODE GLOBE"
    );

    const tags = createElement("div", "showroom-contract-tags");
    [
      "GEN 3",
      "globe=visible",
      "phase-bind=active",
      "HOME",
      "BOUNDARY",
      "MOTION",
      "REALM",
      "RECEIPT",
      "NEXT",
      "gen4=held"
    ].forEach(function addTag(text) {
      tags.append(tag(text));
    });

    const status = createElement("aside", "showroom-globe-status");
    status.append(
      createElement("h3", "", "Generation 3 phase-bind receipts"),
      createElement(
        "p",
        "",
        "This layer binds the phase sequence onto the visible code-generated globe. It does not claim Generation 4 closeout."
      )
    );

    const receipts = createElement("ul", "showroom-globe-receipts");
    [
      ["GENERATION", GENERATION],
      ["AUTHORITY", AUTHORITY],
      ["INSTRUMENT_TYPE", "phase-bound-code-globe"],
      ["ROUTE_REALM", contract.realm],
      ["ROUTE_ROLE", contract.routeRole],
      ["VISIBLE_GLOBE", "true"],
      ["PHASE_BIND", "active"],
      ["PHASE_SEQUENCE", "HOME → BOUNDARY → MOTION → REALM → RECEIPT → NEXT"],
      ["CURRENT_PHASE", PHASES[0].key],
      ["GEN4_CLOSEOUT", "held"],
      ["NEXT_ALLOWED_GENERATION", "GENERATION_4_CLOSEOUT_AFTER_CONFIRMATION"]
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
      moonTrack,
      phaseBadge,
      phaseKey,
      phaseState,
      phaseTitle,
      phaseProof,
      phaseConsequence,
      phaseRing,
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
    const moonSpeed = DEFAULTS.moonDegreesPerSecond * speedMultiplier;
    const phaseMs = Number(opts.phaseMs || DEFAULTS.phaseMs);

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount", "showroom-code-globe-mount", "showroom-gen3-mount");

    setDataset(mount, {
      generation: GENERATION,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      instrumentType: "phase-bound-code-globe",
      visibleGlobe: "true",
      phaseBind: "active",
      gen4Closeout: "held"
    });

    const dom = buildGlobeDom(contract);
    mount.append(dom.root);

    let active = true;
    let frame = 0;
    let timer = 0;
    let previous = performance.now();
    let surfaceShift = 0;
    let cloudA = 0;
    let cloudB = 0;
    let moon = contract.mode === "standalone" ? 124 : 34;
    let phaseIndex = 0;
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
      if (localReceipts.length > 72) {
        localReceipts.splice(0, localReceipts.length - 72);
      }

      if (runtime && typeof runtime.writeReceipt === "function") {
        runtime.writeReceipt(type, payload || {});
      }

      if (runtime && typeof runtime.writePhaseReceipt === "function" && payload && payload.phase) {
        runtime.writePhaseReceipt(payload.phase, payload);
      }

      return receipt;
    }

    function setPhase(index) {
      phaseIndex = index % PHASES.length;
      const phase = PHASES[phaseIndex];

      dom.phaseKey.textContent = phase.key;
      dom.phaseState.textContent = phase.state;
      dom.phaseTitle.textContent = phase.title;
      dom.phaseProof.textContent = phase.proof;
      dom.phaseConsequence.textContent = phase.consequence;

      Array.from(dom.phaseRing.children).forEach(function update(node, nodeIndex) {
        node.dataset.active = nodeIndex === phaseIndex ? "true" : "false";
        node.dataset.complete = nodeIndex < phaseIndex ? "true" : "false";
      });

      dom.root.dataset.currentPhase = phase.key;
      dom.root.dataset.currentState = phase.state;
      mount.dataset.currentPhase = phase.key;
      mount.dataset.currentState = phase.state;

      const oldDynamic = dom.receipts.querySelectorAll("[data-dynamic-receipt='true']");
      oldDynamic.forEach(function remove(node) {
        node.remove();
      });

      const line = receiptLine("PHASE_" + String(phaseIndex + 1).padStart(2, "0"), phase.key + ": " + phase.consequence);
      line.dataset.dynamicReceipt = "true";
      dom.receipts.append(line);

      writeRuntimeReceipt("generation_3_phase_bound", {
        phase: phase.key,
        state: phase.state,
        proof: phase.proof,
        consequence: phase.consequence,
        route: contract.route,
        realm: contract.realm,
        gen4Closeout: "held"
      });
    }

    function advancePhase() {
      if (!active) return;
      setPhase((phaseIndex + 1) % PHASES.length);
      timer = global.setTimeout(advancePhase, phaseMs);
    }

    function tick(now) {
      if (!active) return;

      const delta = Math.max(0, (now - previous) / 1000);
      previous = now;

      surfaceShift = (surfaceShift + globeSpeed * delta) % 100;
      cloudA = (cloudA + cloudSpeed * delta) % 360;
      cloudB = (cloudB - cloudSpeed * 0.72 * delta) % 360;
      moon = (moon + moonSpeed * delta) % 360;

      dom.surfaceTrack.style.transform = "translate3d(-" + surfaceShift.toFixed(3) + "%, 0, 0)";
      dom.cloudLayerA.style.transform = "rotate(" + cloudA.toFixed(3) + "deg)";
      dom.cloudLayerB.style.transform = "rotate(" + cloudB.toFixed(3) + "deg)";
      dom.moonTrack.style.transform = "rotate(" + moon.toFixed(3) + "deg)";

      frame = global.requestAnimationFrame(tick);
    }

    function start() {
      if (active && frame) return;

      active = true;
      previous = performance.now();

      writeRuntimeReceipt("generation_3_phase_globe_started", {
        generation: GENERATION,
        authority: AUTHORITY,
        route: contract.route,
        realm: contract.realm,
        visibleGlobe: true,
        phaseBind: "active",
        gen4Closeout: "held"
      });

      frame = global.requestAnimationFrame(tick);
      timer = global.setTimeout(advancePhase, phaseMs);
    }

    function stop() {
      active = false;
      if (frame) global.cancelAnimationFrame(frame);
      if (timer) global.clearTimeout(timer);
      frame = 0;
      timer = 0;

      writeRuntimeReceipt("generation_3_phase_globe_stopped", {
        generation: GENERATION,
        authority: AUTHORITY,
        currentPhase: PHASES[phaseIndex].key
      });
    }

    setPhase(0);
    start();

    return {
      version: VERSION,
      generation: GENERATION,
      authority: AUTHORITY,
      contract: clone(contract),
      start: start,
      stop: stop,
      next: function next() {
        setPhase((phaseIndex + 1) % PHASES.length);
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
          visibleGlobe: true,
          phaseBind: "active",
          currentPhase: PHASES[phaseIndex].key,
          gen4Closeout: "held",
          receipts: clone(localReceipts)
        };
      }
    };
  }

  global.ShowroomGlobeInstrument = Object.freeze({
    VERSION: VERSION,
    GENERATION: GENERATION,
    AUTHORITY: AUTHORITY,
    PHASES: PHASES,
    createGlobe: createGlobe
  });
})(window);
