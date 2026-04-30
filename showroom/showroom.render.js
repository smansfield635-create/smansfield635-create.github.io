(function attachShowroomRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_RENDER_GENERATION_2_RENDER_MOUNT_ACTIVATION_CTG_v1";
  const GENERATION = "GENERATION_2";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function fallbackContract(mode) {
    const standalone = mode === "standalone";

    return {
      mode: standalone ? "standalone" : "parent",
      route: standalone ? "/showroom/globe/" : "/showroom/",
      realm: standalone ? "demo-universe-earth-inspection-realm" : "showroom-parent-proof-realm",
      routeRole: standalone ? "standalone-earth-inspection-surface" : "showroom-proof-surface",
      chamber: standalone ? "STANDALONE_DEMO_UNIVERSE_EARTH" : "ROOM_05_OF_16_H5_SHOWROOM",
      headline: standalone ? "Standalone code-globe inspection surface" : "Earth-centered public proof surface",
      caption: standalone
        ? "Inspect Demo Universe mounts the same Generation 2 code-generated globe without taking parent Showroom identity."
        : "The accepted Showroom shell now mounts the restored Generation 2 code-generated globe below the parent proof contract."
    };
  }

  function getContract(mode) {
    let contract = fallbackContract(mode);

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

    contract.mode = mode === "standalone" ? "standalone" : "parent";
    contract.route = contract.mode === "standalone" ? "/showroom/globe/" : "/showroom/";
    contract.realm = contract.realm || fallbackContract(mode).realm;
    contract.routeRole = contract.routeRole || fallbackContract(mode).routeRole;
    contract.chamber = contract.chamber || fallbackContract(mode).chamber;
    contract.headline = fallbackContract(mode).headline;
    contract.caption = fallbackContract(mode).caption;

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
        return createFallbackRuntime(contract, error.message);
      }
    }

    return createFallbackRuntime(contract, "ShowroomRuntime unavailable");
  }

  function createFallbackRuntime(contract, reason) {
    const receipts = [];

    return {
      version: "fallback-runtime-for-generation-2-mount",
      writeReceipt(type, payload) {
        receipts.push({
          type,
          payload: payload || {},
          generation: GENERATION,
          route: contract.route,
          realm: contract.realm,
          fallbackReason: reason,
          timestamp: new Date().toISOString()
        });
      },
      getReceipts() {
        return receipts.slice();
      },
      getStatus() {
        return {
          fallback: true,
          reason,
          route: contract.route,
          realm: contract.realm,
          receipts: receipts.slice()
        };
      }
    };
  }

  function proofItem(title, body) {
    const item = el("li");
    const strong = el("strong", "", title);
    const span = el("span", "", body);
    item.append(strong, span);
    return item;
  }

  function receiptItem(name, value) {
    const item = el("li");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
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
    root.dataset.visibleCodeGlobe = "pending";
    root.dataset.generation2MountActivation = "active";
    root.dataset.nextAllowedGeneration = "GENERATION_3_PHASE_BIND_AFTER_VISUAL_CONFIRMATION";
  }

  function writeReceipts(panel, contract, runtime, instrument) {
    const list = el("ul", "showroom-receipts");

    [
      ["SHOWROOM_CHAMBER", contract.chamber],
      ["RESTORED_GENERATION", GENERATION],
      ["MOUNT_ACTIVATION", "active"],
      ["VISIBLE_CODE_GLOBE", instrument ? "true" : "false"],
      ["ROUTE", contract.route],
      ["ACTIVE_REALM", contract.realm],
      ["ACTIVE_ROUTE_ROLE", contract.routeRole],
      ["INSTRUMENT_AUTHORITY", "/assets/showroom.globe.instrument.js"],
      ["CSS_AUTHORITY", "/showroom/showroom.css"],
      ["RENDER_AUTHORITY", "/showroom/showroom.render.js"],
      ["BOOT_AUTHORITY", contract.mode === "standalone" ? "/showroom/globe/index.js" : "/showroom/index.js"],
      ["GRAPHIC_DEPENDENCY", "false"],
      ["EXTERNAL_IMAGE_DEPENDENCY", "false"],
      ["GENERATED_IMAGE_DEPENDENCY", "false"],
      ["GEN3_PHASE_BIND", "held"],
      ["GEN4_CLOSEOUT", "held"],
      ["NEXT_ALLOWED_GENERATION", "GENERATION_3_PHASE_BIND_AFTER_VISUAL_CONFIRMATION"],
      ["RENDER_TNT", VERSION]
    ].forEach(function add(pair) {
      list.append(receiptItem(pair[0], pair[1]));
    });

    if (instrument && instrument.version) {
      list.append(receiptItem("INSTRUMENT_VERSION", instrument.version));
    }

    panel.append(list);

    if (runtime && typeof runtime.writeReceipt === "function") {
      runtime.writeReceipt("generation_2_render_mount_activated", {
        generation: GENERATION,
        route: contract.route,
        realm: contract.realm,
        visibleCodeGlobe: Boolean(instrument),
        renderVersion: VERSION,
        instrumentVersion: instrument && instrument.version ? instrument.version : "missing"
      });
    }
  }

  function renderMissingInstrument(mount, runtime, contract) {
    const fallback = el("section", "showroom-globe-instrument showroom-gen2-code-globe");
    fallback.dataset.generation = GENERATION;
    fallback.dataset.visibleCodeGlobe = "false";
    fallback.dataset.instrumentMissing = "true";

    const stage = el("div", "showroom-code-globe-stage");
    const message = el("article", "showroom-globe-status");
    message.append(
      el("h3", "", "Generation 2 mount reached the globe slot"),
      el(
        "p",
        "",
        "The lower render mounted successfully, but /assets/showroom.globe.instrument.js did not expose ShowroomGlobeInstrument.createGlobe at runtime."
      )
    );

    const receipts = el("ul", "showroom-globe-receipts");
    [
      ["GENERATION", GENERATION],
      ["MOUNT_REACHED", "true"],
      ["VISIBLE_CODE_GLOBE", "false"],
      ["MISSING", "ShowroomGlobeInstrument.createGlobe"],
      ["NEXT_ACTION", "verify /assets/showroom.globe.instrument.js served source"]
    ].forEach(function add(pair) {
      receipts.append(receiptItem(pair[0], pair[1]));
    });

    message.append(receipts);
    stage.append(message);
    fallback.append(stage);
    mount.append(fallback);

    if (runtime && typeof runtime.writeReceipt === "function") {
      runtime.writeReceipt("generation_2_mount_reached_but_instrument_missing", {
        generation: GENERATION,
        route: contract.route,
        realm: contract.realm
      });
    }

    return null;
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

    const grid = el("section", "showroom-proof-grid");
    grid.setAttribute("aria-label", "Generation 2 render mount activation grid");

    const textPanel = el("article", "showroom-text-panel");
    textPanel.append(
      el("p", "showroom-kicker", mode === "standalone" ? "STANDALONE · INSPECT DEMO UNIVERSE" : "ROOM 05 / 16 · H5_SHOWROOM"),
      el("h2", "", contract.headline),
      el("p", "", contract.caption)
    );

    const proofList = el("ul", "showroom-proof-list");
    [
      ["Generation 2 proof", "The lower render layer is now responsible for mounting the visible code-generated globe."],
      ["No-image proof", "The globe remains code-generated: no external image, generated art, or texture dependency is required."],
      ["Mount proof", "This file populates the render root below the accepted shell instead of changing the hero."],
      ["Route proof", mode === "standalone"
        ? "Inspect Demo Universe uses the same globe system without becoming the parent Showroom."
        : "Parent Showroom uses the same globe system while preserving route identity."],
      ["Hold proof", "This stops at Generation 2. Phase binding and Gen 4 closeout remain held."]
    ].forEach(function add(pair) {
      proofList.append(proofItem(pair[0], pair[1]));
    });

    const actions = el("div", "showroom-actions");
    const primary = el("a", "showroom-button", mode === "standalone" ? "Return to Showroom" : "Inspect Demo Universe Earth");
    primary.href = mode === "standalone" ? "/showroom/" : "/showroom/globe/";
    actions.append(primary);

    textPanel.append(proofList, actions);

    const globeShell = el("article", "showroom-globe-shell");
    const globeTitle = el("h2", "", "Generation 2 code-generated globe");
    const mount = el("div", "showroom-globe-mount showroom-code-globe-mount");
    mount.id = mode === "standalone" ? "demoUniverseEarthMount" : "showroomGlobeMount";
    mount.dataset.visibleCodeGlobe = "pending";
    mount.dataset.generation = GENERATION;
    globeShell.append(globeTitle, mount);

    grid.append(textPanel, globeShell);

    const receiptPanel = el("section", "showroom-receipt-panel");
    receiptPanel.append(
      el("h2", "", "Receipts"),
      el("p", "", "This receipt field verifies Generation 2 render mount activation only. It does not claim Gen 3 phase binding or Gen 4 closeout.")
    );

    root.append(grid, receiptPanel);

    let instrument = null;

    if (
      global.ShowroomGlobeInstrument &&
      typeof global.ShowroomGlobeInstrument.createGlobe === "function"
    ) {
      instrument = global.ShowroomGlobeInstrument.createGlobe({
        mount,
        runtime,
        contract
      });
      mount.dataset.visibleCodeGlobe = "true";
      root.dataset.visibleCodeGlobe = "true";
    } else {
      instrument = renderMissingInstrument(mount, runtime, contract);
      mount.dataset.visibleCodeGlobe = "false";
      root.dataset.visibleCodeGlobe = "false";
    }

    writeReceipts(receiptPanel, contract, runtime, instrument);

    root.dataset.showroomRenderComplete = "true";
    root.dataset.showroomRenderVersion = VERSION;

    return {
      version: VERSION,
      generation: GENERATION,
      mode,
      contract,
      runtime,
      instrument,
      globe: instrument
    };
  }

  global.ShowroomRender = Object.freeze({
    VERSION,
    GENERATION,
    renderShowroomProofSurface
  });
})(window);
