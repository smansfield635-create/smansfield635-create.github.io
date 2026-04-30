(function attachShowroomRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_RENDER_TRUE_GEN4_NARRATIVE_CODE_CONTRACT_CHAIN_CTG_v1";
  const GENERATION = "GENERATION_4";
  const GEN4_TYPE = "narrative-code";

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function dependencyReport() {
    return {
      runtime: Boolean(global.ShowroomRuntime),
      consumerAuthority: Boolean(global.ShowroomConsumerAuthority),
      globeInstrument: Boolean(global.ShowroomGlobeInstrument)
    };
  }

  function assertDependencies() {
    const report = dependencyReport();
    const missing = Object.keys(report).filter((key) => !report[key]);

    if (missing.length) {
      throw new Error(`Showroom render missing dependencies: ${missing.join(", ")}`);
    }

    return report;
  }

  function makeProofItem(title, body) {
    const item = createElement("li");
    const strong = createElement("strong", "", title);
    const span = createElement("span", "", body);
    item.append(strong, span);
    return item;
  }

  function makeReceiptItem(name, value) {
    const item = createElement("li", "");
    item.innerHTML = `<strong>${name}</strong><span>${String(value)}</span>`;
    return item;
  }

  function writeReceiptList(panel, contract, runtime) {
    const list = createElement("ul", "showroom-receipts");

    [
      ["SHOWROOM_CHAMBER", contract.chamber],
      ["GENERATION", GENERATION],
      ["GEN4_TYPE", GEN4_TYPE],
      ["ROUTE", contract.route],
      ["ACTIVE_REALM", contract.realm],
      ["ACTIVE_ROUTE_ROLE", contract.routeRole],
      ["DEMO_ROUTE_AVAILABLE", contract.demoRouteAvailable || "false"],
      ["CROSS_REALM_LINK_TYPE", contract.crossRealmLinkType],
      ["SHARED_INSTRUMENT_ROLE", contract.sharedInstrumentRole],
      ["SHARED_ACTIVE_REALM_IDENTITY", contract.sharedActiveRealmIdentity],
      ["GRAPHIC_DEPENDENCY", contract.graphicDependency],
      ["EXTERNAL_IMAGE_DEPENDENCY", contract.externalImageDependency],
      ["GENERATED_GRAPHIC_DEPENDENCY", contract.generatedGraphicDependency],
      ["IMAGE_DEPENDENCY", contract.imageDependency],
      ["SPEED_AUTHORITY", contract.speedAuthority],
      ["MOTION_AUTHORITY", contract.motionAuthority],
      ["BOUNDARY_AUTHORITY", contract.boundaryAuthority],
      ["VISUAL_EDGE_AUTHORITY", contract.visualEdgeAuthority],
      ["INSTRUMENT_AUTHORITY", contract.instrumentAuthority],
      ["RUNTIME_AUTHORITY", contract.runtimeAuthority],
      ["CSS_AUTHORITY", contract.cssAuthority],
      ["RENDER_AUTHORITY", contract.renderAuthority],
      ["HOME_ANCHOR", contract.homeAnchor],
      ["IDLE_AUTO_DRIFT", contract.idleAutoDrift],
      ["PLACEMENT_FIXED", contract.placementFixed],
      ["MOTION_ONLY_CONTROL", contract.motionOnlyControl],
      ["CENTER_LOCKED", contract.centerLocked],
      ["DECORATIVE_SHELL", contract.decorativeShell],
      ["RIM_SHELL", contract.rimShell],
      ["CAP_SHELL", contract.capShell],
      ["ATMOSPHERE_SHELL", contract.atmosphereShell],
      ["OUTER_GLOW_AUTHORITY", contract.outerGlowAuthority],
      ["NARRATIVE_SEQUENCE", contract.narrativeSequence.join(" → ")],
      ["CURRENT_TNT", contract.currentTNT],
      ["RENDER_TNT", VERSION]
    ].forEach(([name, value]) => list.append(makeReceiptItem(name, value)));

    panel.append(list);

    runtime.writeReceipt("true_gen4_narrative_code_receipts_written", {
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      route: contract.route,
      realm: contract.realm,
      receiptCount: list.children.length,
      graphicDependency: false,
      externalImageDependency: false
    });
  }

  function renderShowroomProofSurface(options) {
    assertDependencies();

    const opts = options || {};
    const root = opts.root || document.querySelector("[data-showroom-render-root]");
    const mode = opts.mode === "standalone" ? "standalone" : "parent";

    if (!root) {
      throw new Error("Showroom render root not found.");
    }

    const contract = global.ShowroomConsumerAuthority.getContract(mode);

    const runtime = global.ShowroomRuntime.createRuntime({
      realm: contract.realm,
      route: contract.route,
      routeRole: contract.routeRole
    });

    root.innerHTML = "";
    global.ShowroomConsumerAuthority.writeContractMarkers(root, contract);

    root.dataset.showroomRenderComplete = "false";
    root.dataset.showroomGeneration = GENERATION;
    root.dataset.showroomGen4Type = GEN4_TYPE;
    root.dataset.graphicDependency = "false";
    root.dataset.externalImageDependency = "false";
    root.dataset.currentLaw = "code-carries-narrative";
    root.dataset.currentTnt = contract.currentTNT;

    const grid = createElement("section", "showroom-proof-grid");
    grid.setAttribute("aria-label", "True Generation 4 narrative-code proof grid");

    const textPanel = createElement("article", "showroom-text-panel");
    const roomMarker = createElement(
      "p",
      "showroom-kicker",
      mode === "parent" ? "ROOM 05 / 16 · H5_SHOWROOM" : "STANDALONE · DEMO_UNIVERSE_EARTH"
    );

    const textTitle = createElement("h2", "", contract.headline);

    const textBody = createElement("p", "", contract.caption);

    const proofList = createElement("ul", "showroom-proof-list");

    [
      [
        "Realm proof",
        mode === "parent"
          ? "Parent Showroom remains the parent proof realm."
          : "Standalone inspection remains separate from the parent proof realm."
      ],
      [
        "Narrative-code proof",
        "Generation 4 is achieved by code that carries sequence, state, receipts, room identity, and readable consequence."
      ],
      [
        "Graphics hold",
        "Generated graphics, external imagery, decorative Earth skins, shells, rims, caps, and glow substitutes are not the authority layer."
      ],
      [
        "Boundary proof",
        "Boundary authority is assigned by state. The route reads the instrument’s phase and receipt chain instead of trusting a visual edge."
      ],
      [
        "Motion proof",
        "Motion is a proof cycle: HOME → BOUNDARY → MOTION → REALM → RECEIPT → NEXT."
      ],
      [
        "Receipt proof",
        "Every transition leaves a readable receipt so the owner can audit the behavior directly."
      ]
    ].forEach(([title, body]) => proofList.append(makeProofItem(title, body)));

    const actions = createElement("div", "showroom-actions");
    if (mode === "parent") {
      const demoLink = createElement("a", "showroom-button", "Inspect Demo Universe Earth");
      demoLink.href = "/showroom/globe/";
      actions.append(demoLink);
    } else {
      const parentLink = createElement("a", "showroom-button", "Return to Showroom");
      parentLink.href = "/showroom/";
      actions.append(parentLink);
    }

    textPanel.append(roomMarker, textTitle, textBody, proofList, actions);

    const globeShell = createElement("article", "showroom-globe-shell");
    const globeTitle = createElement("h2", "", "True Gen 4 narrative-code instrument");
    const globeMount = createElement("div", "showroom-globe-mount showroom-narrative-mount");
    globeMount.id = mode === "standalone" ? "demoUniverseEarthMount" : "showroomGlobeMount";
    globeMount.dataset.showroomGen4Type = GEN4_TYPE;
    globeMount.dataset.graphicDependency = "false";
    globeMount.dataset.externalImageDependency = "false";
    globeShell.append(globeTitle, globeMount);

    grid.append(textPanel, globeShell);

    const receiptPanel = createElement("section", "showroom-receipt-panel");
    const receiptTitle = createElement("h2", "", "Receipts");
    const receiptIntro = createElement(
      "p",
      "",
      "This receipt field verifies the route as a code-native narrative chamber. Gauges may measure this state, but owner visual acceptance remains separate from telemetry."
    );
    receiptPanel.append(receiptTitle, receiptIntro);

    root.append(grid, receiptPanel);

    const instrument = global.ShowroomGlobeInstrument.createGlobe({
      mount: globeMount,
      runtime,
      contract
    });

    writeReceiptList(receiptPanel, contract, runtime);

    runtime.writeReceipt("true_gen4_narrative_code_render_complete", {
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      route: contract.route,
      realm: contract.realm,
      instrumentVersion: instrument.version,
      renderVersion: VERSION,
      graphicDependency: false,
      externalImageDependency: false,
      currentTNT: contract.currentTNT
    });

    root.dataset.showroomRenderComplete = "true";
    root.dataset.showroomRenderVersion = VERSION;
    root.dataset.showroomInstrumentVersion = instrument.version;

    return {
      version: VERSION,
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      contract,
      runtime,
      globe: instrument,
      instrument
    };
  }

  global.ShowroomRender = Object.freeze({
    VERSION,
    GENERATION,
    GEN4_TYPE,
    renderShowroomProofSurface,
    dependencyReport
  });
})(window);
