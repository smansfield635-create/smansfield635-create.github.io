(function attachShowroomRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_RENDER_GENERATION_2_CODE_GLOBE_RESTORATION_TNT_v1";
  const GENERATION = "GENERATION_2";

  function createElement(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function fallbackRuntime(config) {
    const receipts = [];

    return {
      version: "fallback-runtime",
      writeReceipt: function writeReceipt(type, payload) {
        receipts.push({
          type: type,
          payload: payload || {},
          timestamp: new Date().toISOString()
        });
      },
      getReceipts: function getReceipts() {
        return receipts.slice();
      },
      getStatus: function getStatus() {
        return {
          config: config || {},
          receipts: receipts.slice()
        };
      }
    };
  }

  function createRuntime(contract) {
    if (global.ShowroomRuntime && typeof global.ShowroomRuntime.createRuntime === "function") {
      return global.ShowroomRuntime.createRuntime({
        mode: contract.mode,
        realm: contract.realm,
        route: contract.route,
        routeRole: contract.routeRole
      });
    }

    return fallbackRuntime(contract);
  }

  function fallbackContract(mode) {
    const isStandalone = mode === "standalone";

    return {
      mode: isStandalone ? "standalone" : "parent",
      realm: isStandalone ? "demo-universe-earth-inspection-realm" : "showroom-parent-proof-realm",
      route: isStandalone ? "/showroom/globe/" : "/showroom/",
      routeRole: isStandalone ? "standalone-earth-inspection-surface" : "showroom-proof-surface",
      chamber: isStandalone ? "STANDALONE_DEMO_UNIVERSE_EARTH" : "ROOM_05_OF_16_H5_SHOWROOM",
      headline: isStandalone ? "Standalone code-globe inspection surface" : "Earth-centered public proof surface",
      caption: isStandalone
        ? "Inspect Demo Universe consumes the restored Generation 2 code-generated globe without taking parent Showroom identity."
        : "The Showroom consumes the restored Generation 2 code-generated globe while preserving the True Generation 4 narrative-code direction for later phases."
    };
  }

  function normalizeContract(raw, mode) {
    const fallback = fallbackContract(mode);
    const contract = Object.assign({}, fallback, raw || {});

    contract.mode = mode === "standalone" ? "standalone" : "parent";
    contract.realm = contract.realm || fallback.realm;
    contract.route = contract.route || fallback.route;
    contract.routeRole = contract.routeRole || fallback.routeRole;
    contract.chamber = contract.chamber || fallback.chamber;
    contract.headline = contract.headline || fallback.headline;
    contract.caption = contract.caption || fallback.caption;

    return contract;
  }

  function getContract(mode) {
    if (
      global.ShowroomConsumerAuthority &&
      typeof global.ShowroomConsumerAuthority.getContract === "function"
    ) {
      return normalizeContract(global.ShowroomConsumerAuthority.getContract(mode), mode);
    }

    return normalizeContract(null, mode);
  }

  function writeMarkers(root, contract) {
    if (
      global.ShowroomConsumerAuthority &&
      typeof global.ShowroomConsumerAuthority.writeContractMarkers === "function"
    ) {
      global.ShowroomConsumerAuthority.writeContractMarkers(root, contract);
    }

    root.dataset.showroomGeneration = GENERATION;
    root.dataset.showroomRestorationGeneration = "GENERATION_2";
    root.dataset.showroomMode = contract.mode;
    root.dataset.showroomRealm = contract.realm;
    root.dataset.showroomRoute = contract.route;
    root.dataset.visibleCodeGlobe = "true";
    root.dataset.externalImageDependency = "false";
    root.dataset.generatedImageDependency = "false";
    root.dataset.nextAllowedGeneration = "GENERATION_3_PHASE_BIND";
  }

  function makeProofItem(title, body) {
    const item = createElement("li");
    const strong = createElement("strong", "", title);
    const span = createElement("span", "", body);
    item.append(strong, span);
    return item;
  }

  function makeReceipt(name, value) {
    const item = createElement("li");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function writeReceipts(panel, contract, runtime, instrument) {
    const list = createElement("ul", "showroom-receipts");

    [
      ["SHOWROOM_CHAMBER", contract.chamber],
      ["RESTORED_GENERATION", GENERATION],
      ["VISIBLE_CODE_GLOBE", "true"],
      ["ROUTE", contract.route],
      ["ACTIVE_REALM", contract.realm],
      ["ACTIVE_ROUTE_ROLE", contract.routeRole],
      ["INSTRUMENT_TYPE", "code-generated-globe"],
      ["GRAPHIC_DEPENDENCY", "false"],
      ["EXTERNAL_IMAGE_DEPENDENCY", "false"],
      ["GENERATED_IMAGE_DEPENDENCY", "false"],
      ["SHELL", "absent"],
      ["RIM", "absent"],
      ["CAP", "absent"],
      ["BOWL", "absent"],
      ["INSTRUMENT_AUTHORITY", "/assets/showroom.globe.instrument.js"],
      ["CSS_AUTHORITY", "/showroom/showroom.css"],
      ["RENDER_AUTHORITY", "/showroom/showroom.render.js"],
      ["INSTRUMENT_VERSION", instrument.version],
      ["RENDER_TNT", VERSION],
      ["NEXT_ALLOWED_GENERATION", "GENERATION_3_PHASE_BIND"]
    ].forEach(function addReceipt(pair) {
      list.append(makeReceipt(pair[0], pair[1]));
    });

    panel.append(list);

    if (runtime && typeof runtime.writeReceipt === "function") {
      runtime.writeReceipt("generation_2_code_globe_rendered", {
        restoredGeneration: GENERATION,
        visibleCodeGlobe: true,
        route: contract.route,
        realm: contract.realm,
        instrumentVersion: instrument.version,
        renderVersion: VERSION,
        nextAllowedGeneration: "GENERATION_3_PHASE_BIND"
      });
    }
  }

  function renderShowroomProofSurface(options) {
    const opts = options || {};
    const root = opts.root || document.querySelector("[data-showroom-render-root]");
    const mode = opts.mode === "standalone" ? "standalone" : "parent";

    if (!root) {
      throw new Error("Showroom render root not found.");
    }

    if (!global.ShowroomGlobeInstrument || typeof global.ShowroomGlobeInstrument.createGlobe !== "function") {
      throw new Error("Showroom globe instrument is not available.");
    }

    const contract = getContract(mode);
    const runtime = createRuntime(contract);

    clear(root);
    writeMarkers(root, contract);

    root.dataset.showroomRenderComplete = "false";
    root.dataset.showroomRenderVersion = VERSION;

    const grid = createElement("section", "showroom-proof-grid");
    grid.setAttribute("aria-label", "Generation 2 code-generated globe restoration grid");

    const textPanel = createElement("article", "showroom-text-panel");

    textPanel.append(
      createElement("p", "showroom-kicker", mode === "standalone" ? "STANDALONE · INSPECT DEMO UNIVERSE" : "ROOM 05 / 16 · H5_SHOWROOM"),
      createElement("h2", "", contract.headline),
      createElement("p", "", contract.caption)
    );

    const proofList = createElement("ul", "showroom-proof-list");

    [
      [
        "Generation 2 proof",
        "The visible globe is restored as a code-generated object."
      ],
      [
        "No-image proof",
        "The globe does not require external images, generated art, or asset textures."
      ],
      [
        "Shape proof",
        "The object is constrained as a sphere without lower shell, rim, cap, bowl, or clipped-disk behavior."
      ],
      [
        "Route proof",
        mode === "standalone"
          ? "Inspect Demo Universe uses the same globe system without becoming the parent Showroom."
          : "Parent Showroom uses the same globe system while preserving route identity."
      ],
      [
        "Hold proof",
        "This layer stops at Generation 2. Phase binding is held for Generation 3."
      ]
    ].forEach(function addProof(pair) {
      proofList.append(makeProofItem(pair[0], pair[1]));
    });

    textPanel.append(proofList);

    const actionRow = createElement("div", "showroom-actions");
    const routeLink = createElement(
      "a",
      "showroom-button",
      mode === "standalone" ? "Return to Showroom" : "Inspect Demo Universe Earth"
    );
    routeLink.href = mode === "standalone" ? "/showroom/" : "/showroom/globe/";
    actionRow.append(routeLink);
    textPanel.append(actionRow);

    const globeShell = createElement("article", "showroom-globe-shell");
    const globeTitle = createElement("h2", "", "Generation 2 code-generated globe");
    const mount = createElement("div", "showroom-globe-mount showroom-code-globe-mount");
    mount.id = mode === "standalone" ? "demoUniverseEarthMount" : "showroomGlobeMount";
    mount.dataset.visibleCodeGlobe = "true";
    mount.dataset.externalImageDependency = "false";
    globeShell.append(globeTitle, mount);

    grid.append(textPanel, globeShell);

    const receiptPanel = createElement("section", "showroom-receipt-panel");
    receiptPanel.append(
      createElement("h2", "", "Receipts"),
      createElement(
        "p",
        "",
        "This receipt field verifies Generation 2 only: a visible code-generated globe restored on the parent Showroom and Inspect Demo Universe routes."
      )
    );

    root.append(grid, receiptPanel);

    const instrument = global.ShowroomGlobeInstrument.createGlobe({
      mount: mount,
      runtime: runtime,
      contract: contract
    });

    writeReceipts(receiptPanel, contract, runtime, instrument);

    root.dataset.showroomRenderComplete = "true";
    root.dataset.showroomInstrumentVersion = instrument.version;

    return {
      version: VERSION,
      generation: GENERATION,
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
