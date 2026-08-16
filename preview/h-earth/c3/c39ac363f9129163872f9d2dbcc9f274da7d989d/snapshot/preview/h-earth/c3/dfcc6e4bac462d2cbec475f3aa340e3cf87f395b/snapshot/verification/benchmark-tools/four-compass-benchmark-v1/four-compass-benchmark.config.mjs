const deepFreeze = value => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
};

export const TOOL_ID = "METAVERSE_FOUR_COMPASS_BENCHMARK_TOOL_v1";
export const ORIGIN = process.env.FOUR_COMPASS_ORIGIN || "https://smansfield635-create.github.io";

export const PROFILES = deepFreeze({
  DESKTOP: {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false
  },
  MOBILE: {
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  }
});

export const COMPASS_CORPUS = deepFreeze({
  MAIN_COMPASS: {
    lane: "FOUR_COMPASS_CORPUS",
    route: "/",
    posture: "POSITIVE_REFERENCE",
    root: "main[data-compass-root]",
    scene: "[data-compass-scene]",
    gestureSurface: "canvas[data-compass-crystals-canvas='true']",
    cardinal: "button[data-compass-cardinal][data-cardinal-id='east']",
    child: "button[data-compass-room-proxy][data-room-id='east-1']",
    returnControl: "[data-compass-return-to-orbit]",
    panel: "[data-compass-panel]",
    stateAttr: "data-compass-mode"
  },
  ARCHCOIN_COMPASS: {
    lane: "FOUR_COMPASS_CORPUS",
    route: "/products/archcoin/",
    posture: "POSITIVE_REFERENCE",
    root: "main[data-archcoin-root]",
    scene: "[data-archcoin-scene]",
    gestureSurface: "canvas[data-archcoin-crystals-canvas='front']",
    cardinal: "button[data-archcoin-coin][data-cardinal-id='north']",
    child: "a[data-archcoin-room][data-room-id='contract-overview']",
    returnControl: "[data-archcoin-return-to-orbit]",
    panel: "[data-archcoin-panel]",
    stateAttr: "data-archcoin-controller-state"
  },
  SHOWROOM_COMPASS: {
    lane: "FOUR_COMPASS_CORPUS",
    route: "/showroom/",
    posture: "POSITIVE_REFERENCE",
    root: "div[data-showroom-root]",
    scene: "[data-showroom-scene]",
    gestureSurface: "[data-showroom-scene]",
    cardinal: "button[data-showroom-cardinal-control][data-showroom-cardinal-id='north']",
    child: "button[data-showroom-child-control][data-showroom-child-id='north-1']",
    returnControl: "[data-showroom-controller-return-to-orbit]",
    panel: "[data-showroom-front-host], [data-showroom-panel]",
    stateAttr: "data-showroom-controller-state"
  },
  LAWS_COMPASS: {
    lane: "FOUR_COMPASS_CORPUS",
    route: "/laws/",
    posture: "POSITIVE_REFERENCE",
    root: "div[data-laws-root]",
    scene: "[data-laws-scene]",
    gestureSurface: "canvas[data-laws-crystals-canvas='front']",
    cardinal: "button[data-laws-category-control][data-laws-cluster-id='flow']",
    child: "button[data-laws-law-control][data-route='/laws/categories/flow/signals/']",
    returnControl: "[data-laws-return-to-orbit]",
    categoryLabel: "[data-laws-projected-category-label][data-primary='true']",
    childLabel: "[data-laws-projected-law-label][data-primary='true']",
    method: "[data-laws-first-method]",
    panel: "[data-laws-panel], [data-laws-front-host]",
    stateAttr: "data-laws-controller-state"
  }
});

export const AUXILIARY_CONTROLS = deepFreeze({
  WEBSITE_HOME_RECEIVER_CONTROL: {
    lane: "AUXILIARY_CONTROL",
    route: "/home/",
    posture: "POSITIVE_NON_COMPASS_SHELL_REFERENCE",
    compassAuthority: false,
    root: "html[data-page='home-value-profile']",
    scene: "#value-profile",
    gestureSurface: null,
    cardinal: "button.profile-tab[data-profile='rules']",
    child: "[data-profile-panel='rules'] details summary, [data-profile='rules']",
    returnControl: "a[href='/']",
    panel: "[data-profile-panel='rules'], [data-profile-content='rules']",
    disclosure: "[data-profile-panel='rules'] details summary, details.receiver-chamber summary",
    stateAttr: "data-compass-behavior"
  }
});

export const OUTPUTS = deepFreeze({
  compassReceipt: "four-compass-benchmark-tool-baseline.json",
  auxiliaryReceipt: "website-home-receiver-control-baseline.json",
  compassScreenshotRoot: "four-compass-benchmark-tool-screenshots",
  auxiliaryScreenshotRoot: "website-home-receiver-control-screenshots",
  compassSmokeReceipt: "four-compass-benchmark-tool-smoke.json",
  auxiliarySmokeReceipt: "website-home-receiver-control-smoke.json",
  compassSmokeScreenshotRoot: "four-compass-benchmark-tool-smoke-screenshots",
  auxiliarySmokeScreenshotRoot: "website-home-receiver-control-smoke-screenshots",
  workflowArtifact: "metaverse-benchmark-four-compass-tool-evidence",
  smokeArtifact: "metaverse-benchmark-four-compass-tool-smoke-evidence"
});

export function validateAuthorityConfig() {
  const compassIds = Object.keys(COMPASS_CORPUS);
  const auxiliaryIds = Object.keys(AUXILIARY_CONTROLS);
  const allIds = [...compassIds, ...auxiliaryIds];
  const uniqueRoutes = new Set([
    ...Object.values(COMPASS_CORPUS).map(entry => entry.route),
    ...Object.values(AUXILIARY_CONTROLS).map(entry => entry.route)
  ]);
  const assertions = {
    compassCountExact: compassIds.length === 4,
    canonicalCompassIdsExact: JSON.stringify(compassIds) === JSON.stringify([
      "MAIN_COMPASS",
      "ARCHCOIN_COMPASS",
      "SHOWROOM_COMPASS",
      "LAWS_COMPASS"
    ]),
    auxiliaryControlCountExact: auxiliaryIds.length === 1,
    auxiliaryControlIdExact: auxiliaryIds[0] === "WEBSITE_HOME_RECEIVER_CONTROL",
    identitiesUnique: new Set(allIds).size === allIds.length,
    routesUnique: uniqueRoutes.size === 5,
    compassLaneExact: Object.values(COMPASS_CORPUS).every(entry => entry.lane === "FOUR_COMPASS_CORPUS"),
    auxiliaryLaneExact: Object.values(AUXILIARY_CONTROLS).every(entry =>
      entry.lane === "AUXILIARY_CONTROL" && entry.compassAuthority === false
    )
  };
  const failures = Object.entries(assertions).filter(([, pass]) => !pass).map(([id]) => id);
  return Object.freeze({ assertions: Object.freeze(assertions), failures: Object.freeze(failures) });
}

// Exact-head browser regression trigger for the mobile grouped-Rolodex candidate.
