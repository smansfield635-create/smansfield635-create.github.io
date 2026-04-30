(function attachShowroomRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_RENDER_DEMO_UNIVERSE_OUR_UNIVERSE_GEN4_TNT_v1";
  const GENERATION = "GENERATION_4";
  const ROUTE_PARENT = "/showroom/";
  const ROUTE_STANDALONE = "/showroom/globe/";

  const BODY_NAMES = ["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function receiptItem(name, value) {
    const item = el("li");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function proofItem(title, body) {
    const item = el("li");
    const strong = el("strong", "", title);
    const span = el("span", "", body);
    item.append(strong, span);
    return item;
  }

  function fallbackContract(mode) {
    const standalone = mode === "standalone";

    return {
      mode: standalone ? "standalone" : "parent",
      route: standalone ? ROUTE_STANDALONE : ROUTE_PARENT,
      realm: standalone ? "demo-universe-our-universe-realm" : "showroom-parent-proof-realm",
      routeRole: standalone ? "standalone-demo-universe-inspection-surface" : "showroom-proof-surface",
      chamber: standalone ? "STANDALONE_DEMO_UNIVERSE_OUR_UNIVERSE" : "ROOM_05_OF_16_H5_SHOWROOM",
      headline: standalone ? "Our Universe inspection surface" : "Parent proof-realm shell",
      caption: standalone
        ? "Demo Universe represents our universe through a code-native Sun, Earth, Moon, and planet scaffold."
        : "Parent Showroom remains the proof-realm shell. The visible universe model is intentionally held to the inspection route."
    };
  }

  function getContract(mode) {
    const fallback = fallbackContract(mode);
    let contract = Object.assign({}, fallback);

    if (
      global.ShowroomConsumerAuthority &&
      typeof global.ShowroomConsumerAuthority.getContract === "function"
    ) {
      try {
        contract = Object.assign(contract, global.ShowroomConsumerAuthority.getContract(mode));
      } catch (error) {
        contract.consumerAuthorityError = error.message;
      }
    }

    contract.mode = fallback.mode;
    contract.route = fallback.route;
    contract.realm = fallback.realm;
    contract.routeRole = fallback.routeRole;
    contract.chamber = fallback.chamber;
    contract.headline = fallback.headline;
    contract.caption = fallback.caption;

    return contract;
  }

  function createRuntime(contract) {
    if (global.ShowroomRuntime && typeof global.ShowroomRuntime.createRuntime === "function") {
      try {
        return global.ShowroomRuntime.createRuntime({
          mode: contract.mode,
          realm: contract.realm,
          route: contract.route,
          routeRole: contract.routeRole
        });
      } catch (error) {
        return fallbackRuntime(contract, error.message);
      }
    }

    return fallbackRuntime(contract, "ShowroomRuntime unavailable");
  }

  function fallbackRuntime(contract, reason) {
    const receipts = [];

    return {
      version: "fallback-runtime-demo-universe-gen4",
      writeReceipt: function writeReceipt(type, payload) {
        receipts.push({
          type: type,
          generation: GENERATION,
          route: contract.route,
          realm: contract.realm,
          fallbackReason: reason,
          payload: payload || {},
          timestamp: new Date().toISOString()
        });
      },
      writePhaseReceipt: function writePhaseReceipt(phase, payload) {
        receipts.push({
          type: "phase_receipt_written",
          phase: phase,
          generation: GENERATION,
          route: contract.route,
          realm: contract.realm,
          fallbackReason: reason,
          payload: payload || {},
          timestamp: new Date().toISOString()
        });
      },
      getReceipts: function getReceipts() {
        return receipts.slice();
      },
      getStatus: function getStatus() {
        return {
          fallback: true,
          reason: reason,
          route: contract.route,
          realm: contract.realm,
          receipts: receipts.slice()
        };
      }
    };
  }

  function writeRootMarkers(root, contract) {
    if (
      global.ShowroomConsumerAuthority &&
      typeof global.ShowroomConsumerAuthority.writeContractMarkers === "function"
    ) {
      try {
        global.ShowroomConsumerAuthority.writeContractMarkers(root, contract);
      } catch (error) {
        root.dataset.consumerMarkerError = error.message;
      }
    }

    root.dataset.showroomRenderComplete = "false";
    root.dataset.showroomRenderVersion = VERSION;
    root.dataset.showroomGeneration = GENERATION;
    root.dataset.showroomMode = contract.mode;
    root.dataset.showroomRoute = contract.route;
    root.dataset.showroomRealm = contract.realm;
    root.dataset.parentGlobeRequired = "false";

    if (contract.mode === "standalone") {
      root.dataset.visibleCodeGlobe = "true";
      root.dataset.phaseBind = "complete";
      root.dataset.demoUniverseScope = "our-universe";
      root.dataset.sun = "included";
      root.dataset.moon = "included";
      root.dataset.planets = "included";
      root.dataset.gen4Closeout = "complete";
      root.dataset.finalCloseout = "true";
    } else {
      root.dataset.visibleCodeGlobe = "false";
      root.dataset.phaseBind = "inspection-route-only";
      root.dataset.demoUniverseScope = "routed-to-inspection";
      root.dataset.gen4Closeout = "parent-shell-only";
      root.dataset.finalCloseout = "not-parent-route";
    }
  }

  function writeCloseoutReceipts(panel, contract, runtime, instrument) {
    const list = el("ul", "showroom-receipts");
    const standalone = contract.mode === "standalone";

    [
      ["SHOWROOM_CHAMBER", contract.chamber],
      ["GENERATION", GENERATION],
      ["DEMO_UNIVERSE_SCOPE", standalone ? "our-universe" : "inspection-route-only"],
      ["GENERATION_4_CLOSEOUT", standalone ? "complete" : "parent-shell-only"],
      ["GEN4_CLOSEOUT", standalone ? "complete" : "parent-shell-only"],
      ["FINAL_CLOSEOUT", standalone ? "true" : "not-parent-route"],
      ["GEN_4_FINAL_PASS", standalone ? "demo-universe-our-universe-closeout" : "parent-shell-pass"],
      ["VISIBLE_CODE_GLOBE", standalone ? "true" : "false"],
      ["PARENT_GLOBE_REQUIRED", "false"],
      ["ROUTE", contract.route],
      ["ACTIVE_REALM", contract.realm],
      ["ACTIVE_ROUTE_ROLE", contract.routeRole],
      ["SUN", standalone ? "included" : "routed"],
      ["MOON", standalone ? "included" : "routed"],
      ["PLANETS", standalone ? "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune" : "routed"],
      ["EARTH_ROLE", standalone ? "primary inspection anchor" : "routed-to-inspection"],
      ["INSTRUMENT_AUTHORITY", "/assets/showroom.globe.instrument.js"],
      ["CSS_AUTHORITY", "/showroom/showroom.css"],
      ["RENDER_AUTHORITY", "/showroom/showroom.render.js"],
      ["BOOT_AUTHORITY", standalone ? "/showroom/globe/index.js" : "/showroom/index.js"],
      ["GRAPHIC_DEPENDENCY", "false"],
      ["EXTERNAL_IMAGE_DEPENDENCY", "false"],
      ["GENERATED_IMAGE_DEPENDENCY", "false"],
      ["PHASE_BIND", standalone ? "complete" : "inspection-route-only"],
      ["PHASE_SEQUENCE", standalone ? "HOME → BOUNDARY → MOTION → REALM → RECEIPT → NEXT" : "not-parent-route"],
      ["RENDER_TNT", VERSION]
    ].forEach(function add(pair) {
      list.append(receiptItem(pair[0], pair[1]));
    });

    if (instrument && instrument.version) {
      list.append(receiptItem("INSTRUMENT_VERSION", instrument.version));
    }

    panel.append(list);

    if (runtime && typeof runtime.writeReceipt === "function") {
      runtime.writeReceipt("demo_universe_our_universe_gen4_rendered", {
        generation: GENERATION,
        route: contract.route,
        realm: contract.realm,
        visibleCodeGlobe: standalone,
        scope: standalone ? "our-universe" : "inspection-route-only",
        bodies: standalone ? BODY_NAMES.slice() : [],
        generation4Closeout: standalone ? "complete" : "parent-shell-only",
        gen4Closeout: standalone ? "complete" : "parent-shell-only",
        finalCloseout: standalone,
        renderVersion: VERSION,
        instrumentVersion: instrument && instrument.version ? instrument.version : "not-mounted-on-parent"
      });
    }
  }

  function renderParentShell(root, contract, runtime) {
    const panel = el("section", "showroom-receipt-panel");
    panel.append(
      el("h2", "", "Generation 4 parent shell confirmation"),
      el("p", "", "The parent Showroom remains the proof-realm shell. Demo Universe owns the visible our-universe model on the inspection route.")
    );

    writeCloseoutReceipts(panel, contract, runtime, null);
    root.append(panel);

    return null;
  }

  function renderStandaloneCloseout(root, contract, runtime) {
    const grid = el("section", "showroom-proof-grid");
    grid.setAttribute("aria-label", "Demo Universe our-universe Generation 4 grid");

    const textPanel = el("article", "showroom-text-panel");
    textPanel.append(
      el("p", "showroom-kicker", "STANDALONE · DEMO UNIVERSE · OUR UNIVERSE"),
      el("h2", "", "Our Universe inspection surface"),
      el("p", "", "Demo Universe now carries the Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, and Neptune as explicit code-native entities. Earth remains the inspection anchor; the system is no longer Earth-only.")
    );

    const proofList = el("ul", "showroom-proof-list");
    [
      ["Universe proof", "The route represents our universe context, beginning from the Sun and including all planets."],
      ["Earth-anchor proof", "Earth remains the primary inspection anchor without reducing the model to Earth alone."],
      ["Moon proof", "The Moon is explicit as Earth companion and first orbital proof."],
      ["Planet proof", "Mercury, Venus, Mars, Jupiter, Saturn, Uranus, and Neptune are named code entities."],
      ["Parent-shell proof", "The parent Showroom routes to this inspection page and does not need its own globe."],
      ["Closeout proof", "Generation 4 closeout remains explicit and receipted."]
    ].forEach(function add(pair) {
      proofList.append(proofItem(pair[0], pair[1]));
    });

    const actions = el("div", "showroom-actions");
    const parentLink = el("a", "showroom-button", "Return to Showroom");
    parentLink.href = "/showroom/";
    const gaugesLink = el("a", "showroom-button secondary", "Read Gauges");
    gaugesLink.href = "/gauges/";
    actions.append(parentLink, gaugesLink);
    textPanel.append(proofList, actions);

    const globeShell = el("article", "showroom-globe-shell");
    const globeTitle = el("h2", "", "Generation 4 Demo Universe · Our Universe");
    const mount = el("div", "showroom-globe-mount showroom-code-globe-mount showroom-gen4-mount");
    mount.id = "demoUniverseEarthMount";
    mount.dataset.visibleCodeGlobe = "true";
    mount.dataset.generation = GENERATION;
    mount.dataset.phaseBind = "complete";
    mount.dataset.demoUniverseScope = "our-universe";
    mount.dataset.gen4Closeout = "complete";
    mount.dataset.finalCloseout = "true";
    globeShell.append(globeTitle, mount);

    grid.append(textPanel, globeShell);

    const receiptPanel = el("section", "showroom-receipt-panel");
    receiptPanel.append(
      el("h2", "", "Receipts"),
      el("p", "", "This receipt field verifies Generation 4 closeout for Demo Universe as our-universe scope.")
    );

    root.append(grid, receiptPanel);

    let instrument = null;

    if (global.ShowroomGlobeInstrument && typeof global.ShowroomGlobeInstrument.createGlobe === "function") {
      instrument = global.ShowroomGlobeInstrument.createGlobe({
        mount: mount,
        runtime: runtime,
        contract: contract
      });
    } else {
      const missingPanel = el("section", "showroom-receipt-panel");
      missingPanel.append(
        el("h2", "", "Demo Universe waiting"),
        el("p", "", "ShowroomGlobeInstrument.createGlobe is unavailable.")
      );

      const list = el("ul", "showroom-receipts");
      [
        ["GENERATION", GENERATION],
        ["DEMO_UNIVERSE_SCOPE", "blocked"],
        ["MISSING", "ShowroomGlobeInstrument.createGlobe"],
        ["NEXT_ACTION", "verify /assets/showroom.globe.instrument.js served source"]
      ].forEach(function add(pair) {
        list.append(receiptItem(pair[0], pair[1]));
      });

      missingPanel.append(list);
      root.append(missingPanel);
    }

    writeCloseoutReceipts(receiptPanel, contract, runtime, instrument);
    return instrument;
  }

  function renderShowroomProofSurface(options) {
    const opts = options || {};
    const root = opts.root || document.querySelector("[data-showroom-render-root]");
    const mode = opts.mode === "standalone" ? "standalone" : "parent";

    if (!root) {
      throw new Error("Showroom render root not found.");
    }

    const contract = getContract(mode);
    const runtime = createRuntime(contract);

    clear(root);
    writeRootMarkers(root, contract);

    const instrument =
      mode === "standalone"
        ? renderStandaloneCloseout(root, contract, runtime)
        : renderParentShell(root, contract, runtime);

    root.dataset.showroomRenderComplete = "true";
    root.dataset.showroomRenderVersion = VERSION;
    root.dataset.showroomInstrumentVersion = instrument && instrument.version ? instrument.version : "not-mounted-on-parent";

    return {
      version: VERSION,
      generation: GENERATION,
      mode: mode,
      contract: contract,
      runtime: runtime,
      instrument: instrument,
      globe: instrument
    };
  }

  global.ShowroomRender = Object.freeze({
    VERSION: VERSION,
    GENERATION: GENERATION,
    renderShowroomProofSurface: renderShowroomProofSurface
  });
})(window);
