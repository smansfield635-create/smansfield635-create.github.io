/*
  /showroom/consumer.authority.js
  GENERATION_4_CONSUMER_AUTHORITY_CONTROL_LAYER_TNT_v1

  Purpose:
  - Create the Consumer Authority Control Layer as a shared Gen 4 contract.
  - Give parent boot, parent render bridge, and demo boot one authority source.
  - Close consumer-writer drift without touching speed constants, runtime, route HTML identity, CSS shell, or Gauges logic.

  Owns:
  - consumer receipt contract
  - mount receipt contract
  - caption contract
  - realm-consumption rules
  - speed-authority declarations
  - Gen 4 axis / vertical-control / disk-removed receipts

  Does not own:
  - actual globe speed constants
  - surface/cloud motion
  - runtime loop
  - CSS shell
  - route HTML identity
  - Gauges scoring
*/

(function () {
  "use strict";

  const VERSION = "generation-4-consumer-authority-control-layer-v1";

  const PATHS = Object.freeze({
    speedAuthority: "/assets/showroom.globe.instrument.js",
    runtime: "/showroom/runtime.js",
    parentRoute: "/showroom/",
    demoRoute: "/showroom/globe/",
    parentBoot: "/showroom/index.js",
    parentRender: "/showroom/showroom.render.js",
    demoBoot: "/showroom/globe/index.js"
  });

  const EXPECTED = Object.freeze({
    instrumentVersion: "showroom-generation-4-speed-authority-calibration-v1",
    runtimeVersion: "showroom-generation-3-runtime-status-contract-cleanup-v1",
    parentConsumerVersion: "showroom-generation-4-parent-consumer-authority-v1",
    parentRenderVersion: "showroom-generation-4-parent-render-authority-v1",
    demoConsumerVersion: "demo-universe-earth-generation-4-consumer-authority-v1"
  });

  const CONTEXTS = Object.freeze({
    parent: "parent",
    demo: "standalone"
  });

  const REALMS = Object.freeze({
    parent: "showroom-parent-proof-realm",
    demo: "demo-universe-earth-demo-realm"
  });

  const ROLES = Object.freeze({
    parent: "showroom-proof-surface",
    demo: "demo-universe-earth"
  });

  const CAPTIONS = Object.freeze({
    parent: "GENERATION 4 · SHOWROOM PROOF REALM · SPEED CALIBRATED",
    demo: "GENERATION 4 · DEMO REALM · SPEED CALIBRATED"
  });

  const CONTROL = Object.freeze({
    speedAuthority: PATHS.speedAuthority,
    instrumentSpeedAuthority: "true",
    runtimeSpeedAuthority: "false",
    cssAnimationAuthority: "false",
    renderBridgeSpeedAuthority: "false",
    sharedInstrumentRole: "rendering-and-control-service-only",
    sharedActiveRealmIdentity: "false",
    crossRealmLinkType: "navigation-only",
    generation4DiskRotation: "removed",
    generation4HorizontalFriction: "calibrated",
    generation4VerticalControl: "visible-latitude-disposition",
    generation4AxisDisposition: "23.5-degree-axis-frame",
    generation4MotionModel: "calibrated-longitude-latitude-zoom-light-anchor",
    generation4SphericalRead: "active"
  });

  const LEGACY_DATA_KEYS = Object.freeze([
    "generation2ActiveGlobe",
    "generation2BaselineGraphics",
    "generation2StandaloneGlobe",
    "generation3AxisRotationDepth",
    "generation3VisualClarityRefinement",
    "generation3VisualTruth",
    "showroomGeneration3ParentRenderCongruence",
    "demoUniverseEarthBoot"
  ]);

  function normalizeContext(context) {
    if (context === CONTEXTS.demo || context === "demo" || context === "standalone") {
      return CONTEXTS.demo;
    }

    return CONTEXTS.parent;
  }

  function detectContext() {
    return window.location.pathname.indexOf("/showroom/globe") === 0
      ? CONTEXTS.demo
      : CONTEXTS.parent;
  }

  function contextLabel(context) {
    return normalizeContext(context) === CONTEXTS.demo ? "demo" : "parent";
  }

  function getRealm(context) {
    return normalizeContext(context) === CONTEXTS.demo ? REALMS.demo : REALMS.parent;
  }

  function getRole(context) {
    return normalizeContext(context) === CONTEXTS.demo ? ROLES.demo : ROLES.parent;
  }

  function getCaption(context) {
    return normalizeContext(context) === CONTEXTS.demo ? CAPTIONS.demo : CAPTIONS.parent;
  }

  function setDataset(node, values) {
    if (!node) return;

    Object.entries(values || {}).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];

      if (value === null || value === undefined) return;

      node.dataset[key] = String(value);
    });
  }

  function removeLegacyDataset(node) {
    if (!node || !node.dataset) return;

    LEGACY_DATA_KEYS.forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
        delete node.dataset[key];
      }
    });
  }

  function consumerContract(context, extra) {
    const normalized = normalizeContext(context);
    const isDemo = normalized === CONTEXTS.demo;

    const base = {
      consumerAuthorityLayer: VERSION,
      consumerAuthorityContext: normalized,
      activeRealm: getRealm(normalized),
      activeRouteRole: getRole(normalized),

      speedAuthority: CONTROL.speedAuthority,
      instrumentSpeedAuthority: CONTROL.instrumentSpeedAuthority,
      runtimeSpeedAuthority: CONTROL.runtimeSpeedAuthority,
      cssAnimationAuthority: CONTROL.cssAnimationAuthority,
      renderBridgeSpeedAuthority: CONTROL.renderBridgeSpeedAuthority,

      sharedInstrumentRole: CONTROL.sharedInstrumentRole,
      sharedActiveRealmIdentity: CONTROL.sharedActiveRealmIdentity,
      crossRealmLinkType: CONTROL.crossRealmLinkType,

      consumedInstrumentVersion: EXPECTED.instrumentVersion,
      consumedRuntimeVersion: EXPECTED.runtimeVersion,

      generation1RingScaffold: "removed",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",
      generation3RealmSeparation: "active",

      generation4ConsumerAuthority: "active",
      generation4Closure: "consumer-authority-control-layer-active",
      generation4MotionModel: CONTROL.generation4MotionModel,
      generation4DiskRotation: CONTROL.generation4DiskRotation,
      generation4SphericalRead: CONTROL.generation4SphericalRead,
      generation4HorizontalFriction: CONTROL.generation4HorizontalFriction,
      generation4VerticalControl: CONTROL.generation4VerticalControl,
      generation4AxisDisposition: CONTROL.generation4AxisDisposition,

      captionContract: getCaption(normalized),
      mountReceiptContract: "generation-4-consumer-authority-receipts",
      driftClosureRole: "consumer-writer-alignment"
    };

    if (isDemo) {
      return Object.assign(base, {
        demoConsumerAuthority: EXPECTED.demoConsumerVersion,
        demoRealm: REALMS.demo,
        standaloneRole: ROLES.demo,
        showroomGlobeRoute: PATHS.demoRoute,
        parentRouteAvailable: PATHS.parentRoute,
        parentRoleAvailable: "navigation-only",
        contextReceiptMode: "demo-realm-isolated"
      }, extra || {});
    }

    return Object.assign(base, {
      parentConsumerAuthority: EXPECTED.parentConsumerVersion,
      parentRenderAuthority: EXPECTED.parentRenderVersion,
      parentRealm: REALMS.parent,
      parentRole: ROLES.parent,
      showroomParentRoute: PATHS.parentRoute,
      demoRouteAvailable: PATHS.demoRoute,
      demoRoleAvailable: "navigation-only",
      contextReceiptMode: "parent-realm-isolated"
    }, extra || {});
  }

  function findMount(root) {
    const scope = root || document;

    return (
      scope.getElementById && scope.getElementById("showroom-globe-mount")
    ) || scope.querySelector("#showroom-globe-mount");
  }

  function findRoot() {
    return document.getElementById("showroom-root");
  }

  function findMain(context) {
    return normalizeContext(context) === CONTEXTS.demo
      ? document.getElementById("globe-main")
      : document.getElementById("showroom-main");
  }

  function writeReceipts(nodes, context, extra) {
    const contract = consumerContract(context, extra);

    [].concat(nodes || []).forEach(function (node) {
      if (!node) return;
      removeLegacyDataset(node);
      setDataset(node, contract);
    });

    return contract;
  }

  function normalizeCaption(root, context, override) {
    const scope = root || document;
    const caption =
      scope.querySelector(".showroom-generation-3-caption") ||
      scope.querySelector(".showroom-generation-2-caption") ||
      document.querySelector(".showroom-generation-3-caption") ||
      document.querySelector(".showroom-generation-2-caption");

    const text = override || getCaption(context);

    if (caption) {
      caption.textContent = text;
      caption.dataset.captionContract = "generation-4-consumer-authority";
      caption.dataset.captionStatus = "generation-4-speed-authority-calibrated";
      caption.dataset.consumerAuthorityLayer = VERSION;
    }

    return text;
  }

  function normalizeTelemetry(root, context) {
    const scope = root || document;
    const telemetry =
      scope.querySelector(".showroom-generation-3-telemetry") ||
      document.querySelector(".showroom-generation-3-telemetry");

    if (!telemetry) return false;

    telemetry.dataset.consumerAuthorityLayer = VERSION;
    telemetry.dataset.speedAuthority = PATHS.speedAuthority;
    telemetry.dataset.generation4ConsumerAuthority = "active";
    telemetry.dataset.context = normalizeContext(context);

    return true;
  }

  function applyToCurrentPage(context, extra) {
    const normalized = normalizeContext(context || detectContext());
    const root = findRoot();
    const main = findMain(normalized);
    const mount = findMount(document);

    const contract = writeReceipts([root, main, mount], normalized, extra);
    const caption = normalizeCaption(mount || root || document, normalized);
    const telemetryApplied = normalizeTelemetry(mount || root || document, normalized);

    return {
      ok: true,
      version: VERSION,
      context: normalized,
      realm: getRealm(normalized),
      role: getRole(normalized),
      caption: caption,
      telemetryApplied: telemetryApplied,
      nodes: {
        root: Boolean(root),
        main: Boolean(main),
        mount: Boolean(mount)
      },
      contract: contract
    };
  }

  function applyParent(extra) {
    return applyToCurrentPage(CONTEXTS.parent, Object.assign({
      parentConsumerAuthority: EXPECTED.parentConsumerVersion,
      parentRenderAuthority: EXPECTED.parentRenderVersion
    }, extra || {}));
  }

  function applyDemo(extra) {
    return applyToCurrentPage(CONTEXTS.demo, Object.assign({
      demoConsumerAuthority: EXPECTED.demoConsumerVersion
    }, extra || {}));
  }

  function applyByContext(context, extra) {
    return normalizeContext(context) === CONTEXTS.demo
      ? applyDemo(extra)
      : applyParent(extra);
  }

  function instrumentAvailable() {
    return Boolean(
      window.DGBShowroomGlobeInstrument &&
      typeof window.DGBShowroomGlobeInstrument.renderGlobe === "function"
    );
  }

  function runtimeAvailable() {
    return Boolean(window.DGBShowroomRuntime);
  }

  function verify() {
    const context = detectContext();
    const root = findRoot();
    const main = findMain(context);
    const mount = findMount(document);

    return {
      version: VERSION,
      context: context,
      expectedInstrumentVersion: EXPECTED.instrumentVersion,
      liveInstrumentVersion:
        window.DGBShowroomGlobeInstrument && window.DGBShowroomGlobeInstrument.version
          ? window.DGBShowroomGlobeInstrument.version
          : "missing",
      expectedRuntimeVersion: EXPECTED.runtimeVersion,
      liveRuntimeVersion:
        window.DGBShowroomRuntime && window.DGBShowroomRuntime.version
          ? window.DGBShowroomRuntime.version
          : "missing",
      instrumentAvailable: instrumentAvailable(),
      runtimeAvailable: runtimeAvailable(),
      nodes: {
        root: Boolean(root),
        main: Boolean(main),
        mount: Boolean(mount)
      },
      speedAuthority: PATHS.speedAuthority,
      instrumentSpeedAuthority: true,
      runtimeSpeedAuthority: false,
      cssAnimationAuthority: false,
      renderBridgeSpeedAuthority: false,
      generation4ConsumerAuthority: "active",
      driftClosureRole: "consumer-writer-alignment"
    };
  }

  function renderWithAuthority(mount, options) {
    const config = options || {};
    const context = normalizeContext(config.context || detectContext());
    const instrument = window.DGBShowroomGlobeInstrument;

    if (!mount) {
      throw new Error("Consumer Authority Control Layer requires a mount node.");
    }

    writeReceipts([findRoot(), findMain(context), mount], context, {
      renderRequestedBy: VERSION
    });

    if (!instrument || typeof instrument.renderGlobe !== "function") {
      mount.dataset.consumerAuthorityError = "instrument-missing";
      return mount;
    }

    instrument.renderGlobe(mount, {
      context: context,
      caption: config.caption || getCaption(context)
    });

    writeReceipts([findRoot(), findMain(context), mount], context, {
      renderCompletedBy: VERSION
    });

    normalizeCaption(mount, context, config.caption);
    normalizeTelemetry(mount, context);

    return mount;
  }

  function startRuntimeIfAvailable() {
    if (window.DGBShowroomRuntime && typeof window.DGBShowroomRuntime.start === "function") {
      window.DGBShowroomRuntime.start();
      return true;
    }

    return false;
  }

  window.DGBShowroomConsumerAuthority = Object.freeze({
    version: VERSION,
    paths: PATHS,
    expected: EXPECTED,
    contexts: CONTEXTS,
    realms: REALMS,
    roles: ROLES,
    captions: CAPTIONS,
    control: CONTROL,

    normalizeContext: normalizeContext,
    detectContext: detectContext,
    contextLabel: contextLabel,
    getRealm: getRealm,
    getRole: getRole,
    getCaption: getCaption,

    consumerContract: consumerContract,
    writeReceipts: writeReceipts,
    normalizeCaption: normalizeCaption,
    normalizeTelemetry: normalizeTelemetry,

    applyToCurrentPage: applyToCurrentPage,
    applyParent: applyParent,
    applyDemo: applyDemo,
    applyByContext: applyByContext,

    renderWithAuthority: renderWithAuthority,
    startRuntimeIfAvailable: startRuntimeIfAvailable,
    verify: verify
  });
})();
