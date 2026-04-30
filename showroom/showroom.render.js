(function attachShowroomRender(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_RENDER_VISUAL_DASHBOARD_TNT_v1";
  const GENERATION = "GENERATION_4";

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

  function setData(node, map) {
    Object.keys(map).forEach(function setKey(key) {
      node.dataset[key] = String(map[key]);
    });
  }

  function card(label, value, tone) {
    const node = el("article", "showroom-gauge-card " + (tone || "pass"));
    node.append(el("span", "showroom-gauge-label", label), el("strong", "showroom-gauge-value", value));
    return node;
  }

  function hiddenReceipt(name, value) {
    const item = el("li");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function createRuntime(contract) {
    if (global.ShowroomRuntime && typeof global.ShowroomRuntime.createRuntime === "function") {
      try {
        return global.ShowroomRuntime.createRuntime(contract);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  function writeRuntime(runtime, type, payload) {
    if (runtime && typeof runtime.writeReceipt === "function") {
      runtime.writeReceipt(type, payload || {});
    }
  }

  function buildHiddenReceipts(contract, instrument) {
    const panel = el("section", "showroom-hidden-receipts");
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");

    const list = el("ul");
    [
      ["SHOWROOM_CHAMBER", contract.chamber],
      ["GENERATION", GENERATION],
      ["DEMO_UNIVERSE_SCOPE", contract.mode === "standalone" ? "our-universe" : "inspection-route-only"],
      ["VISUAL_EXPRESSION", contract.mode === "standalone" ? "solar-system-field" : "inspection-route-only"],
      ["ORBIT_FIELD", contract.mode === "standalone" ? "visible" : "inspection-route-only"],
      ["GENERATION_4_CLOSEOUT", contract.mode === "standalone" ? "complete" : "parent-shell-only"],
      ["GEN4_CLOSEOUT", contract.mode === "standalone" ? "complete" : "parent-shell-only"],
      ["FINAL_CLOSEOUT", contract.mode === "standalone" ? "true" : "not-parent-route"],
      ["GEN_4_FINAL_PASS", contract.mode === "standalone" ? "demo-universe-our-universe-visual-field" : "parent-shell-pass"],
      ["VISIBLE_CODE_GLOBE", contract.mode === "standalone" ? "true" : "false"],
      ["PARENT_GLOBE_REQUIRED", "false"],
      ["ROUTE", contract.route],
      ["ACTIVE_REALM", contract.realm],
      ["ACTIVE_ROUTE_ROLE", contract.routeRole],
      ["SUN", contract.mode === "standalone" ? "included" : "routed"],
      ["MOON", contract.mode === "standalone" ? "included" : "routed"],
      ["PLANETS", "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune"],
      ["EARTH_ROLE", "primary inspection anchor"],
      ["PHASE_BIND", contract.mode === "standalone" ? "complete" : "inspection-route-only"],
      ["PHASE_SEQUENCE", "HOME → BOUNDARY → MOTION → REALM → RECEIPT → NEXT"],
      ["NEXT_ALLOWED_GENERATION", "POST_GEN4_REFINEMENT_ONLY"],
      ["RENDER_TNT", VERSION],
      ["INSTRUMENT_VERSION", instrument && instrument.version ? instrument.version : "not-mounted"]
    ].forEach(function add(pair) {
      list.append(hiddenReceipt(pair[0], pair[1]));
    });

    panel.append(list);
    return panel;
  }

  function getContract(mode) {
    if (mode === "standalone") {
      return {
        mode: "standalone",
        route: "/showroom/globe/",
        realm: "demo-universe-our-universe-realm",
        routeRole: "standalone-demo-universe-inspection-surface",
        chamber: "STANDALONE_DEMO_UNIVERSE_OUR_UNIVERSE"
      };
    }

    return {
      mode: "parent",
      route: "/showroom/",
      realm: "showroom-parent-proof-realm",
      routeRole: "showroom-proof-surface",
      chamber: "ROOM_05_OF_16_H5_SHOWROOM"
    };
  }

  function renderParent(root, contract, runtime) {
    const panel = el("section", "showroom-parent-dashboard");
    panel.append(
      el("h2", "", "Showroom"),
      el("p", "", "Parent proof realm. Demo Universe remains inspection-only.")
    );

    const gauges = el("div", "showroom-gauge-grid");
    gauges.append(
      card("Gen 4", "PASS"),
      card("Parent", "Shell"),
      card("Globe", "Inspection only"),
      card("Demo Universe", "Routed")
    );

    panel.append(gauges);
    root.append(panel, buildHiddenReceipts(contract, null));

    writeRuntime(runtime, "showroom_parent_dashboard_rendered", {
      generation: GENERATION,
      route: contract.route,
      parentGlobeRequired: false
    });

    return null;
  }

  function renderStandalone(root, contract, runtime) {
    const dashboard = el("section", "showroom-dashboard");

    const visual = el("article", "showroom-visual-card");
    const mount = el("div", "showroom-globe-mount showroom-code-globe-mount");
    mount.id = "demoUniverseVisualMount";

    setData(mount, {
      generation: GENERATION,
      visibleCodeGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
      gen4Closeout: "complete",
      finalCloseout: "true"
    });

    visual.append(mount);

    const gauges = el("aside", "showroom-dashboard-gauges");
    gauges.append(
      el("h2", "", "Status"),
      card("Gen 4", "PASS"),
      card("Scope", "Our Universe"),
      card("Sun", "Included"),
      card("Moon", "Included"),
      card("Planets", "8/8"),
      card("Earth", "Anchor"),
      card("Orbit Field", "Visible"),
      card("Receipts", "Hidden")
    );

    dashboard.append(visual, gauges);
    root.append(dashboard);

    let instrument = null;

    if (global.ShowroomGlobeInstrument && typeof global.ShowroomGlobeInstrument.createGlobe === "function") {
      instrument = global.ShowroomGlobeInstrument.createGlobe({
        mount: mount,
        runtime: runtime,
        contract: contract
      });
    } else {
      mount.append(card("Instrument", "HOLD", "hold"));
    }

    root.append(buildHiddenReceipts(contract, instrument));

    writeRuntime(runtime, "demo_universe_visual_dashboard_rendered", {
      generation: GENERATION,
      route: contract.route,
      scope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
      bodies: BODY_NAMES,
      gen4Closeout: "complete",
      finalCloseout: true
    });

    return instrument;
  }

  function renderShowroomProofSurface(options) {
    const opts = options || {};
    const root = opts.root || document.querySelector("[data-showroom-render-root]");
    const mode = opts.mode === "standalone" ? "standalone" : "parent";

    if (!root) throw new Error("Showroom render root not found.");

    const contract = getContract(mode);
    const runtime = createRuntime(contract);

    clear(root);

    setData(root, {
      showroomRenderComplete: "false",
      showroomRenderVersion: VERSION,
      showroomGeneration: GENERATION,
      showroomMode: mode,
      showroomRoute: contract.route,
      showroomRealm: contract.realm,
      parentGlobeRequired: "false",
      demoUniverseScope: mode === "standalone" ? "our-universe" : "inspection-route-only",
      visualExpression: mode === "standalone" ? "solar-system-field" : "inspection-route-only",
      orbitField: mode === "standalone" ? "visible" : "inspection-route-only"
    });

    const instrument = mode === "standalone"
      ? renderStandalone(root, contract, runtime)
      : renderParent(root, contract, runtime);

    root.dataset.showroomRenderComplete = "true";
    root.dataset.showroomInstrumentVersion = instrument && instrument.version ? instrument.version : "not-mounted";

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
})(window, document);
