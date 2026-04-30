(function attachShowroomConsumerAuthority(global) {
  "use strict";

  const VERSION = "SHOWROOM_CONSUMER_AUTHORITY_TRUE_GEN4_NARRATIVE_CODE_CTG_v1";
  const GENERATION = "GENERATION_4";
  const GEN4_TYPE = "narrative-code";

  const COMMON = Object.freeze({
    generation: GENERATION,
    gen4Type: GEN4_TYPE,
    graphicDependency: false,
    externalImageDependency: false,
    imageDependency: false,
    generatedGraphicDependency: false,
    speedAuthority: "phase-authority:/assets/showroom.globe.instrument.js",
    motionAuthority: "proof-cycle",
    boundaryAuthority: "state",
    visualEdgeAuthority: "receipt-and-state",
    runtimeAuthority: "/showroom/runtime.js",
    instrumentAuthority: "/assets/showroom.globe.instrument.js",
    consumerAuthority: "/showroom/consumer.authority.js",
    cssAuthority: "/showroom/showroom.css",
    renderAuthority: "/showroom/showroom.render.js",
    homeAnchor: "active",
    idleAutoDrift: "locked",
    placementFixed: true,
    motionOnlyControl: true,
    centerLocked: true,
    decorativeShell: false,
    rimShell: false,
    capShell: false,
    atmosphereShell: false,
    outerGlowAuthority: false,
    narrativeSequence: ["HOME", "BOUNDARY", "MOTION", "REALM", "RECEIPT", "NEXT"],
    currentTNT: "TRUE_GEN4_NARRATIVE_CODE_CONTRACT_CHAIN_CTG_v1"
  });

  const CONTRACTS = Object.freeze({
    parent: Object.freeze(Object.assign({}, COMMON, {
      realm: "showroom-parent-proof-realm",
      route: "/showroom/",
      routeRole: "showroom-proof-surface",
      mode: "parent",
      pageTitle: "Showroom",
      headline: "Earth-centered public proof surface",
      chamber: "ROOM_05_OF_16_H5_SHOWROOM",
      caption:
        "The Showroom route consumes the True Generation 4 narrative-code instrument. The code carries sequence, state, receipts, room identity, and readable consequence without relying on graphics.",
      demoRouteAvailable: "/showroom/globe/",
      crossRealmLinkType: "navigation-only",
      sharedInstrumentRole: "proof-state-engine",
      sharedActiveRealmIdentity: false
    })),
    standalone: Object.freeze(Object.assign({}, COMMON, {
      realm: "demo-universe-earth-inspection-realm",
      route: "/showroom/globe/",
      routeRole: "standalone-earth-inspection-surface",
      mode: "standalone",
      pageTitle: "Demo Universe Earth",
      headline: "Standalone narrative-code inspection surface",
      chamber: "STANDALONE_DEMO_UNIVERSE_EARTH",
      caption:
        "The standalone route consumes the same True Generation 4 narrative-code instrument without becoming the parent Showroom identity.",
      demoRouteAvailable: false,
      crossRealmLinkType: "navigation-only",
      sharedInstrumentRole: "proof-state-engine",
      sharedActiveRealmIdentity: false
    }))
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getContract(mode) {
    const key = mode === "standalone" ? "standalone" : "parent";
    return clone(CONTRACTS[key]);
  }

  function verifyDependencies() {
    const report = {
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      runtimeAvailable: Boolean(global.ShowroomRuntime),
      instrumentAvailable: Boolean(global.ShowroomGlobeInstrument),
      renderAvailable: Boolean(global.ShowroomRender),
      contractAuthority: "/showroom/consumer.authority.js"
    };

    report.status =
      report.runtimeAvailable && report.instrumentAvailable
        ? "ready"
        : "waiting-for-script-order";

    return report;
  }

  function writeContractMarkers(target, contract) {
    if (!target || !(target instanceof Element)) return;

    target.dataset.showroomGeneration = contract.generation;
    target.dataset.showroomGen4Type = contract.gen4Type;
    target.dataset.showroomRealm = contract.realm;
    target.dataset.showroomRoute = contract.route;
    target.dataset.showroomRouteRole = contract.routeRole;
    target.dataset.showroomChamber = contract.chamber;
    target.dataset.showroomSpeedAuthority = contract.speedAuthority;
    target.dataset.showroomMotionAuthority = contract.motionAuthority;
    target.dataset.showroomBoundaryAuthority = contract.boundaryAuthority;
    target.dataset.showroomRuntimeAuthority = contract.runtimeAuthority;
    target.dataset.showroomInstrumentAuthority = contract.instrumentAuthority;
    target.dataset.showroomCssAuthority = contract.cssAuthority;
    target.dataset.showroomRenderAuthority = contract.renderAuthority;
    target.dataset.sharedActiveRealmIdentity = String(contract.sharedActiveRealmIdentity);
    target.dataset.graphicDependency = String(contract.graphicDependency);
    target.dataset.externalImageDependency = String(contract.externalImageDependency);
    target.dataset.generatedGraphicDependency = String(contract.generatedGraphicDependency);
    target.dataset.homeAnchor = contract.homeAnchor;
    target.dataset.centerLocked = String(contract.centerLocked);
    target.dataset.currentTnt = contract.currentTNT;
  }

  global.ShowroomConsumerAuthority = Object.freeze({
    VERSION,
    GENERATION,
    GEN4_TYPE,
    getContract,
    verifyDependencies,
    writeContractMarkers
  });
})(window);
