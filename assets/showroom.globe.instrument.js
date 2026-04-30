(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_TRUE_GEN4_NARRATIVE_CODE_TNT_v1";
  const GENERATION = "GENERATION_4";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const DEFAULTS = Object.freeze({
    tickMs: 2600,
    axisTilt: 23.5,
    homeLabel: "Home Anchor · Fort Worth",
    homeLatitude: 32.7555,
    homeLongitude: -97.3308
  });

  const PHASES = Object.freeze([
    Object.freeze({
      key: "HOME",
      title: "Home Anchor",
      short: "HOME",
      proof: "The instrument begins from home before it moves.",
      state: "anchored",
      consequence: "Motion cannot drift because origin is declared first."
    }),
    Object.freeze({
      key: "BOUNDARY",
      title: "Natural Boundary",
      short: "BOUNDARY",
      proof: "The object’s edge is defined by state, not by a decorative shell.",
      state: "organic",
      consequence: "No rim, cap, bowl, glow, or graphic skin is allowed to carry authority."
    }),
    Object.freeze({
      key: "MOTION",
      title: "Internal Motion",
      short: "MOTION",
      proof: "Motion is released inside the instrument and does not relocate the room.",
      state: "released",
      consequence: "The route stays stable while the proof cycle advances."
    }),
    Object.freeze({
      key: "REALM",
      title: "Realm Separation",
      short: "REALM",
      proof: "Parent Showroom and Demo Universe remain connected by navigation only.",
      state: "separated",
      consequence: "The shared instrument does not collapse route identity."
    }),
    Object.freeze({
      key: "RECEIPT",
      title: "Readable Receipt",
      short: "RECEIPT",
      proof: "Every phase leaves a readable consequence.",
      state: "written",
      consequence: "The user can inspect what the code is doing without a hidden graphic layer."
    }),
    Object.freeze({
      key: "NEXT",
      title: "Next State",
      short: "NEXT",
      proof: "The instrument returns to home and continues the proof cycle.",
      state: "ready",
      consequence: "Generation 4 becomes a repeatable narrative-code machine."
    })
  ]);

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function writeDataset(element, values) {
    Object.keys(values).forEach((key) => {
      element.dataset[key] = String(values[key]);
    });
  }

  function safeClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function makeTag(text) {
    return createElement("span", "showroom-contract-tag", text);
  }

  function makeReceiptLine(name, value) {
    const item = createElement("li", "showroom-globe-receipt");
    item.innerHTML = `<strong>${name}</strong><span>${value}</span>`;
    return item;
  }

  function normalizeContract(contract) {
    return Object.assign(
      {
        realm: "showroom-parent-proof-realm",
        routeRole: "showroom-proof-surface",
        route: "/showroom/",
        mode: "parent",
        homeLabel: DEFAULTS.homeLabel,
        axisTilt: DEFAULTS.axisTilt
      },
      contract || {}
    );
  }

  function buildNarrativeInstrumentDom(contract) {
    const root = createElement("section", "showroom-globe-instrument showroom-narrative-instrument");
    root.setAttribute("aria-label", "Generation 4 narrative-code instrument");

    writeDataset(root, {
      showroomInstrument: "active",
      generation: GENERATION,
      authority: AUTHORITY,
      instrumentType: "narrative-code",
      graphicDependency: "false",
      externalImageDependency: "false",
      decorativeShell: "false",
      boundary: "state-defined",
      motion: "phase-cycle",
      homeAnchor: "active"
    });

    const stage = createElement("div", "showroom-narrative-stage");
    stage.setAttribute("aria-live", "polite");

    const proofDial = createElement("div", "showroom-proof-dial");
    const dialCore = createElement("div", "showroom-proof-core");
    const phaseKey = createElement("div", "showroom-phase-key", "HOME");
    const phaseTitle = createElement("div", "showroom-phase-title", "Home Anchor");
    const phaseState = createElement("div", "showroom-phase-state", "anchored");

    dialCore.append(phaseKey, phaseTitle, phaseState);

    const ring = createElement("ol", "showroom-proof-ring");
    PHASES.forEach((phase, index) => {
      const item = createElement("li", "showroom-proof-node", phase.short);
      writeDataset(item, {
        phase: phase.key,
        index,
        active: index === 0 ? "true" : "false"
      });
      ring.append(item);
    });

    proofDial.append(dialCore, ring);

    const narrativePanel = createElement("article", "showroom-narrative-panel");
    const narrativeKicker = createElement("p", "showroom-narrative-kicker", "Current proof state");
    const narrativeTitle = createElement("h2", "showroom-narrative-title", PHASES[0].title);
    const narrativeProof = createElement("p", "showroom-narrative-proof", PHASES[0].proof);
    const narrativeConsequence = createElement("p", "showroom-narrative-consequence", PHASES[0].consequence);
    narrativePanel.append(narrativeKicker, narrativeTitle, narrativeProof, narrativeConsequence);

    stage.append(proofDial, narrativePanel);

    const caption = createElement(
      "h2",
      "showroom-globe-caption",
      "GENERATION 4 · SHOWROOM PROOF REALM · NARRATIVE CODE"
    );

    const tags = createElement("div", "showroom-contract-tags");
    [
      "GEN 4",
      "graphics=none",
      "instrument=narrative-code",
      "boundary=state-defined",
      "shell=absent",
      "rim=absent",
      "cap=absent",
      "home=anchored",
      "motion=phase-cycle",
      "receipts=readable",
      `axis=${contract.axisTilt || DEFAULTS.axisTilt}°`,
      `context=${contract.mode || "parent"}`
    ].forEach((text) => tags.append(makeTag(text)));

    const actions = createElement("div", "showroom-globe-actions");
    if (contract.mode !== "standalone") {
      const demoLink = createElement("a", "showroom-button", "Open Demo Universe Earth");
      demoLink.href = "/showroom/globe/";
      actions.append(demoLink);
    } else {
      const parentLink = createElement("a", "showroom-button", "Return to Showroom");
      parentLink.href = "/showroom/";
      actions.append(parentLink);
    }

    const receiptsPanel = createElement("aside", "showroom-globe-status");
    const receiptsTitle = createElement("h3", "", "Narrative-code receipts");
    const receiptsBody = createElement(
      "p",
      "",
      "This instrument does not depend on generated graphics or external imagery. It advances through readable proof states and writes receipts as the room’s behavior changes."
    );

    const receipts = createElement("ul", "showroom-globe-receipts");
    [
      ["GENERATION", GENERATION],
      ["AUTHORITY", AUTHORITY],
      ["REALM", contract.realm],
      ["ROUTE_ROLE", contract.routeRole],
      ["INSTRUMENT_TYPE", "narrative-code"],
      ["GRAPHIC_DEPENDENCY", "false"],
      ["EXTERNAL_IMAGE_DEPENDENCY", "false"],
      ["BOUNDARY_AUTHORITY", "state"],
      ["MOTION_AUTHORITY", "phase-cycle"],
      ["CURRENT_PHASE", PHASES[0].key]
    ].forEach(([name, value]) => receipts.append(makeReceiptLine(name, value)));

    receiptsPanel.append(receiptsTitle, receiptsBody, receipts);
    root.append(stage, caption, tags, actions, receiptsPanel);

    return {
      root,
      proofDial,
      dialCore,
      phaseKey,
      phaseTitle,
      phaseState,
      ring,
      narrativeTitle,
      narrativeProof,
      narrativeConsequence,
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
    const tickMs = Number(opts.tickMs || contract.tickMs || DEFAULTS.tickMs);

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount", "showroom-narrative-mount");

    writeDataset(mount, {
      generation: GENERATION,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      instrumentType: "narrative-code",
      graphicDependency: "false",
      naturalBoundary: "state-defined",
      shellRemoved: "true",
      rimRemoved: "true",
      capRemoved: "true",
      globeBoundary: "narrative-proof-cycle"
    });

    const dom = buildNarrativeInstrumentDom(contract);
    mount.append(dom.root);

    let active = true;
    let timer = 0;
    let currentIndex = 0;
    const localReceipts = [];

    function record(type, payload) {
      const receipt = {
        type,
        generation: GENERATION,
        authority: AUTHORITY,
        payload: payload || {},
        timestamp: new Date().toISOString()
      };

      localReceipts.push(receipt);
      if (localReceipts.length > 36) {
        localReceipts.splice(0, localReceipts.length - 36);
      }

      if (runtime && typeof runtime.writeReceipt === "function") {
        runtime.writeReceipt(type, receipt.payload);
      }

      return receipt;
    }

    function renderPhase(index) {
      const phase = PHASES[index];

      dom.phaseKey.textContent = phase.key;
      dom.phaseTitle.textContent = phase.title;
      dom.phaseState.textContent = phase.state;
      dom.narrativeTitle.textContent = phase.title;
      dom.narrativeProof.textContent = phase.proof;
      dom.narrativeConsequence.textContent = phase.consequence;

      Array.from(dom.ring.children).forEach((node, nodeIndex) => {
        node.dataset.active = nodeIndex === index ? "true" : "false";
        node.dataset.complete = nodeIndex < index ? "true" : "false";
      });

      dom.root.dataset.currentPhase = phase.key;
      dom.root.dataset.currentState = phase.state;

      const priorDynamic = dom.receipts.querySelectorAll("[data-dynamic-receipt='true']");
      priorDynamic.forEach((node) => node.remove());

      const dynamicReceipt = makeReceiptLine(
        `PHASE_${String(index + 1).padStart(2, "0")}`,
        `${phase.key}: ${phase.consequence}`
      );
      dynamicReceipt.dataset.dynamicReceipt = "true";
      dom.receipts.append(dynamicReceipt);

      record("narrative_phase_advanced", {
        phase: phase.key,
        title: phase.title,
        state: phase.state,
        consequence: phase.consequence,
        graphicDependency: false,
        externalImageDependency: false
      });
    }

    function advance() {
      if (!active) return;
      currentIndex = (currentIndex + 1) % PHASES.length;
      renderPhase(currentIndex);
      timer = global.setTimeout(advance, tickMs);
    }

    function start() {
      if (active && timer) return;
      active = true;
      record("narrative_instrument_started", {
        generation: GENERATION,
        authority: AUTHORITY,
        realm: contract.realm,
        routeRole: contract.routeRole,
        instrumentType: "narrative-code"
      });
      timer = global.setTimeout(advance, tickMs);
    }

    function stop() {
      active = false;
      if (timer) global.clearTimeout(timer);
      timer = 0;
      record("narrative_instrument_stopped", {
        phase: PHASES[currentIndex].key
      });
    }

    renderPhase(0);
    start();

    return {
      version: VERSION,
      generation: GENERATION,
      authority: AUTHORITY,
      contract: safeClone(contract),
      start,
      stop,
      next() {
        currentIndex = (currentIndex + 1) % PHASES.length;
        renderPhase(currentIndex);
      },
      destroy() {
        stop();
        mount.innerHTML = "";
        mount.dataset.instrumentLoaded = "false";
      },
      getStatus() {
        return {
          version: VERSION,
          generation: GENERATION,
          authority: AUTHORITY,
          active,
          currentPhase: PHASES[currentIndex].key,
          currentState: PHASES[currentIndex].state,
          instrumentType: "narrative-code",
          graphicDependency: false,
          externalImageDependency: false,
          shell: false,
          rim: false,
          cap: false,
          receipts: safeClone(localReceipts)
        };
      }
    };
  }

  global.ShowroomGlobeInstrument = Object.freeze({
    VERSION,
    GENERATION,
    AUTHORITY,
    DEFAULTS,
    PHASES,
    createGlobe
  });
})(window);
