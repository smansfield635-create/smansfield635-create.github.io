/* TARGET FILE: /showroom/index.build.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_DETERMINISTIC_HTML_BUILDER_TNT_v1 */

/*
  Build-time structural authority.

  Inputs:
  - /showroom/index.content.js

  Output:
  - /showroom/index.html

  Ownership:
  - Showroom manifest.
  - Complete browser-facing HTML structure.
  - IDs, classes, data-* hooks, ARIA relationships, mounts, dialogs,
    receipts, stylesheets, scripts, and dependency order.
  - Content contract validation.
  - HTML escaping and deterministic serialization.

  Prohibited:
  - Browser execution.
  - Runtime fetching.
  - Client-side template injection.
  - Runtime behavior.
  - Reassignment of controller, interaction, compositor, crystal,
    gauge, Window, Diamond, UI, or CSS authority.

  Usage:
    node /showroom/index.build.js

  Optional verification:
    node /showroom/index.build.js --check
*/

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const CONTENT = require("./index.content.js");

const BUILD = Object.freeze({
  id: "SHOWROOM_MIRRORLAND_DETERMINISTIC_HTML_BUILDER_TNT_v1",
  version: "1.0.0",

  htmlContract:
    "SHOWROOM_MIRRORLAND_OFFICIAL_GATE_GENERATED_HTML_TNT_v7",

  htmlVersion:
    "SHOWROOM-MIRRORLAND-OFFICIAL-GATE-7.0.0",

  contentContract:
    "SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1",

  outputFilename: "index.html",

  files: Object.freeze({
    content: "/showroom/index.content.js",
    build: "/showroom/index.build.js",
    output: "/showroom/index.html"
  })
});

const MANIFEST = Object.freeze({
  route: "/showroom/",
  page: "showroom",

  room: Object.freeze({
    id: "showroom",
    title: "The Showroom",
    welcome: "Welcome to Mirrorland",
    narrativeTitle: "The Door to Mirrorland",
    primarySubject: "mirrorland",
    primaryNarrative: "mirrorland"
  }),

  elara: Object.freeze({
    guide: "elara",
    homeroom: true,
    route: "/elara/index.html",
    prominent: true
  }),

  modules: Object.freeze({
    controller: "/showroom/index.controller.js",
    gauges: "/showroom/index.gauges.js",
    interactions: "/showroom/index.interactions.js",
    compositor: "/showroom/index.compositor.js",
    crystals: "/showroom/index.crystals.js",
    window: "/showroom/index.window.js",
    css: "/showroom/index.css"
  }),

  navigation: Object.freeze({
    model: "compact-unlabeled-constellation",
    primaryMode: "orbit",
    localFrontModel: "single-active-front",
    gaugeLayout: "compact-selector-shared-detail",
    instructionLayout:
      "summary-near-compass-nested-disclosure",
    routeConfirmationRequired: true,
    returnToOrbit: true,
    returnToCompass: true,
    orbitTarget: "#showroom-orbit",
    compassRoute: "/index.html"
  }),

  constellation: Object.freeze({
    largeStarShapeCount: 1,
    smallStarShapeCount: 1,
    totalStarShapeCount: 2,
    largeStarBehaviors: "route,cluster",
    smallStarBehaviors: "gauge,information",
    gaugeColorFamily: "cyan",
    informationColorFamily: "violet",
    visibleStarLabels: false,
    semanticStarLabels: true,
    fallbackStars: "semantic-controls",
    fallbackVisibleUntilReady: true
  }),

  stage: Object.freeze({
    separation: true,
    orbitIndependent: true,
    diamondIndependent: true,
    windowDiamondOnly: true
  }),

  compass: Object.freeze({
    fixedCenter: true,
    orbitalReference: true,
    pageLocalDecision: true,
    immediateNavigation: false,
    explicitReturnRequired: true,
    mainRoute: "/index.html",
    controlPurpose: "open-main-compass-return-dialog",
    rendererNavigationAuthority: false,
    controllerNavigationAuthority: true
  }),

  window: Object.freeze({
    independent: true,
    foreground: true,
    inFrontOfDiamond: true,
    compassOwned: false,
    crystalDepthParticipant: false,
    initialState: "closed"
  }),

  diamond: Object.freeze({
    generation: "G3",
    renderMode: "native-webgl",
    geometry: "/showroom/index.diamond.geometry.js",
    renderer: "/showroom/index.diamond.js",
    ui: "/showroom/index.ui.js",
    protectedCore: true,
    originalStageRestored: true,
    windowSiblingLayer: true
  }),

  geometry: Object.freeze({
    radialSectors: 16,
    structuralBands: 16,
    latticeSeats: 256,
    surfaceTriangles: 512,
    latticeConnections: 800,
    materialRegions: 14,
    publicViews: 2
  }),

  rendering: Object.freeze({
    nativeWebGL: true,
    webGLFallback: true,
    generatedImage: false,
    imported3DModel: false
  }),

  authorization: Object.freeze({
    visualPassClaimed: false,
    runtimePassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  })
});

const ROUTES = Object.freeze({
  object: "#object-gauges",
  structure: "#structure-gauges",
  interaction: "#interaction-gauges",
  systems: "#systems-gauges",
  platform: "#platform-tab",
  engineering: "#engineering-tab",
  evidence: "#evidence-tab",
  characters: "/characters/",
  mainCompass: "/index.html",
  elara: "/elara/index.html"
});

const INSTRUCTION_TARGETS = Object.freeze({
  constellation: "#showroom-orbit",
  window: "#object-gauges",
  diamond: "#showroom-diamond-controls",
  gaugesAndInformation: "#information-front",
  compass: "#showroom-orbit"
});

const OBJECT_GAUGE_STRUCTURE = Object.freeze({
  publicViews: Object.freeze({
    id: "public-views",
    family: "metric",
    value: "2",
    state: "fixed"
  }),

  geometryAuthority: Object.freeze({
    id: "geometry-authority",
    family: "metric",
    value: "1",
    state: "fixed"
  }),

  rendererState: Object.freeze({
    id: "renderer-state",
    family: "state",
    state: "implemented"
  }),

  windowState: Object.freeze({
    id: "window-state",
    family: "state",
    state: "closed"
  })
});

const STRUCTURE_GAUGE_STRUCTURE = Object.freeze({
  radialSectors: Object.freeze({
    id: "radial-sectors",
    value: "16"
  }),

  structuralBands: Object.freeze({
    id: "structural-bands",
    value: "16"
  }),

  addressableSeats: Object.freeze({
    id: "addressable-seats",
    value: "256"
  }),

  surfaceTriangles: Object.freeze({
    id: "surface-triangles",
    value: "512"
  }),

  latticeConnections: Object.freeze({
    id: "lattice-connections",
    value: "800"
  }),

  materialRegions: Object.freeze({
    id: "material-regions",
    value: "14"
  })
});

const INTERACTION_GAUGE_STRUCTURE = Object.freeze({
  pointer: Object.freeze({
    id: "pointer",
    state: "supported"
  }),

  touch: Object.freeze({
    id: "touch",
    state: "supported"
  }),

  pinchZoom: Object.freeze({
    id: "pinch-zoom",
    state: "supported"
  }),

  wheelZoom: Object.freeze({
    id: "wheel-zoom",
    state: "supported"
  }),

  keyboard: Object.freeze({
    id: "keyboard",
    state: "supported"
  }),

  inspection: Object.freeze({
    id: "inspection",
    state: "supported"
  }),

  reset: Object.freeze({
    id: "reset",
    state: "supported"
  }),

  reducedMotion: Object.freeze({
    id: "reduced-motion",
    state: "supported"
  }),

  responsive: Object.freeze({
    id: "responsive",
    state: "supported"
  }),

  fallback: Object.freeze({
    id: "fallback",
    state: "fallback"
  })
});

const SYSTEM_GAUGE_STRUCTURE = Object.freeze({
  narrativeEnvironment: Object.freeze({
    id: "narrative-environment",
    state: "implemented"
  }),

  characterPaths: Object.freeze({
    id: "character-paths",
    state: "available"
  }),

  frontierSciences: Object.freeze({
    id: "frontier-sciences",
    state: "planned"
  }),

  simulationSystems: Object.freeze({
    id: "simulation-systems",
    state: "planned"
  }),

  worldImpact: Object.freeze({
    id: "world-impact",
    state: "research"
  })
});

function fail(message) {
  throw new Error(`[${BUILD.id}] ${message}`);
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    fail(`${label} must be a plain object.`);
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label} must be an array.`);
  }
}

function assertString(value, label, options = {}) {
  const allowEmpty = options.allowEmpty === true;

  if (typeof value !== "string") {
    fail(`${label} must be a string.`);
  }

  if (!allowEmpty && value.trim() === "") {
    fail(`${label} must not be empty.`);
  }
}

function assertBoolean(value, label) {
  if (typeof value !== "boolean") {
    fail(`${label} must be a boolean.`);
  }
}

function assertExactKeys(value, expectedKeys, label) {
  assertPlainObject(value, label);

  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();

  const missing = expected.filter(
    (key) => !actual.includes(key)
  );

  const unknown = actual.filter(
    (key) => !expected.includes(key)
  );

  if (missing.length || unknown.length) {
    fail(
      `${label} key mismatch. Missing: ${
        missing.join(", ") || "none"
      }. Unknown: ${unknown.join(", ") || "none"}.`
    );
  }
}

function assertUniqueKeys(items, label) {
  const seen = new Set();

  items.forEach((item, index) => {
    assertPlainObject(item, `${label}[${index}]`);
    assertString(item.key, `${label}[${index}].key`);

    if (seen.has(item.key)) {
      fail(`${label} contains duplicate key "${item.key}".`);
    }

    seen.add(item.key);
  });
}

function assertOrderedKeys(items, expectedKeys, label) {
  assertArray(items, label);
  assertUniqueKeys(items, label);

  const actual = items.map((item) => item.key);

  if (
    actual.length !== expectedKeys.length ||
    actual.some((key, index) => key !== expectedKeys[index])
  ) {
    fail(
      `${label} order mismatch. Expected ${expectedKeys.join(
        ", "
      )}; received ${actual.join(", ")}.`
    );
  }
}

function validateParagraphArray(value, label) {
  assertArray(value, label);

  if (value.length === 0) {
    fail(`${label} must contain at least one paragraph.`);
  }

  value.forEach((paragraph, index) => {
    assertString(paragraph, `${label}[${index}]`);
  });
}

function validateContent() {
  assertExactKeys(
    CONTENT,
    [
      "identity",
      "document",
      "header",
      "threshold",
      "instructions",
      "orbit",
      "constellation",
      "fronts",
      "dialogs",
      "footer"
    ],
    "CONTENT"
  );

  assertExactKeys(
    CONTENT.identity,
    [
      "sourceId",
      "sourceVersion",
      "language",
      "roomName",
      "worldName",
      "narrativeTitle"
    ],
    "CONTENT.identity"
  );

  assertString(CONTENT.identity.sourceId, "CONTENT.identity.sourceId");
  assertString(
    CONTENT.identity.sourceVersion,
    "CONTENT.identity.sourceVersion"
  );

  if (CONTENT.identity.sourceId !== BUILD.contentContract) {
    fail(
      `Content contract mismatch. Expected "${BUILD.contentContract}", received "${CONTENT.identity.sourceId}".`
    );
  }

  assertExactKeys(
    CONTENT.document,
    ["title", "description", "skipLink"],
    "CONTENT.document"
  );

  Object.entries(CONTENT.document).forEach(([key, value]) => {
    assertString(value, `CONTENT.document.${key}`);
  });

  validateHeader();
  validateThreshold();
  validateInstructions();
  validateOrbit();
  validateConstellation();
  validateFronts();
  validateDialogs();
  validateFooter();
}

function validateHeader() {
  assertExactKeys(
    CONTENT.header,
    ["brand", "guide"],
    "CONTENT.header"
  );

  assertExactKeys(
    CONTENT.header.brand,
    ["mark", "parentTitle", "roomTitle", "returnLabel"],
    "CONTENT.header.brand"
  );

  Object.entries(CONTENT.header.brand).forEach(([key, value]) => {
    assertString(value, `CONTENT.header.brand.${key}`);
  });

  assertExactKeys(
    CONTENT.header.guide,
    [
      "primaryCharacterLabel",
      "fallbackMenuLabel",
      "fallbackNavigationLabel",
      "groups"
    ],
    "CONTENT.header.guide"
  );

  assertArray(
    CONTENT.header.guide.groups,
    "CONTENT.header.guide.groups"
  );

  if (CONTENT.header.guide.groups.length !== 3) {
    fail("CONTENT.header.guide.groups must contain exactly 3 groups.");
  }

  CONTENT.header.guide.groups.forEach((group, groupIndex) => {
    assertExactKeys(
      group,
      ["title", "links"],
      `CONTENT.header.guide.groups[${groupIndex}]`
    );

    assertString(
      group.title,
      `CONTENT.header.guide.groups[${groupIndex}].title`
    );

    assertArray(
      group.links,
      `CONTENT.header.guide.groups[${groupIndex}].links`
    );

    assertUniqueKeys(
      group.links,
      `CONTENT.header.guide.groups[${groupIndex}].links`
    );

    group.links.forEach((link, linkIndex) => {
      assertExactKeys(
        link,
        ["key", "label"],
        `CONTENT.header.guide.groups[${groupIndex}].links[${linkIndex}]`
      );

      if (!Object.hasOwn(ROUTES, link.key)) {
        fail(`Unknown fallback route key "${link.key}".`);
      }

      assertString(
        link.label,
        `CONTENT.header.guide.groups[${groupIndex}].links[${linkIndex}].label`
      );
    });
  });
}

function validateThreshold() {
  assertExactKeys(
    CONTENT.threshold,
    [
      "badge",
      "heading",
      "subtitle",
      "lead",
      "support",
      "thesis",
      "thesisLabel",
      "preface"
    ],
    "CONTENT.threshold"
  );

  [
    "badge",
    "heading",
    "subtitle",
    "lead",
    "support",
    "thesisLabel"
  ].forEach((key) => {
    assertString(
      CONTENT.threshold[key],
      `CONTENT.threshold.${key}`
    );
  });

  assertArray(CONTENT.threshold.thesis, "CONTENT.threshold.thesis");

  if (CONTENT.threshold.thesis.length !== 2) {
    fail("CONTENT.threshold.thesis must contain exactly 2 lines.");
  }

  CONTENT.threshold.thesis.forEach((line, index) => {
    assertString(line, `CONTENT.threshold.thesis[${index}]`);
  });

  assertExactKeys(
    CONTENT.threshold.preface,
    ["summary", "sections"],
    "CONTENT.threshold.preface"
  );

  assertOrderedKeys(
    CONTENT.threshold.preface.sections,
    [
      "mission",
      "timeline",
      "inhabitants",
      "exploration",
      "invitation"
    ],
    "CONTENT.threshold.preface.sections"
  );

  CONTENT.threshold.preface.sections.forEach((section, index) => {
    assertExactKeys(
      section,
      ["key", "index", "title", "paragraphs"],
      `CONTENT.threshold.preface.sections[${index}]`
    );

    assertString(
      section.index,
      `CONTENT.threshold.preface.sections[${index}].index`
    );

    assertString(
      section.title,
      `CONTENT.threshold.preface.sections[${index}].title`
    );

    validateParagraphArray(
      section.paragraphs,
      `CONTENT.threshold.preface.sections[${index}].paragraphs`
    );
  });
}

function validateInstructions() {
  assertExactKeys(
    CONTENT.instructions,
    [
      "badge",
      "heading",
      "summary",
      "introduction",
      "steps",
      "enterLabel"
    ],
    "CONTENT.instructions"
  );

  ["badge", "heading", "summary", "introduction", "enterLabel"].forEach(
    (key) => {
      assertString(
        CONTENT.instructions[key],
        `CONTENT.instructions.${key}`
      );
    }
  );

  assertOrderedKeys(
    CONTENT.instructions.steps,
    [
      "constellation",
      "window",
      "diamond",
      "gaugesAndInformation",
      "compass"
    ],
    "CONTENT.instructions.steps"
  );

  CONTENT.instructions.steps.forEach((step, index) => {
    assertExactKeys(
      step,
      [
        "key",
        "index",
        "title",
        "summary",
        "description",
        "actionLabel"
      ],
      `CONTENT.instructions.steps[${index}]`
    );

    Object.entries(step).forEach(([key, value]) => {
      assertString(
        value,
        `CONTENT.instructions.steps[${index}].${key}`
      );
    });

    if (!Object.hasOwn(INSTRUCTION_TARGETS, step.key)) {
      fail(`Unknown instruction target key "${step.key}".`);
    }
  });
}

function validateOrbit() {
  assertExactKeys(
    CONTENT.orbit,
    [
      "kicker",
      "heading",
      "guidance",
      "sceneLabel",
      "legend",
      "compass",
      "quickGuide",
      "fallback"
    ],
    "CONTENT.orbit"
  );

  ["kicker", "heading", "guidance", "sceneLabel", "fallback"].forEach(
    (key) => {
      assertString(CONTENT.orbit[key], `CONTENT.orbit.${key}`);
    }
  );

  assertExactKeys(
    CONTENT.orbit.legend,
    ["label", "gauge", "information"],
    "CONTENT.orbit.legend"
  );

  assertExactKeys(
    CONTENT.orbit.compass,
    [
      "label",
      "instruction",
      "controlLabel",
      "directions"
    ],
    "CONTENT.orbit.compass"
  );

  assertArray(
    CONTENT.orbit.compass.directions,
    "CONTENT.orbit.compass.directions"
  );

  if (CONTENT.orbit.compass.directions.join(",") !== "N,E,S,W") {
    fail(
      "CONTENT.orbit.compass.directions must remain N, E, S, W."
    );
  }

  assertExactKeys(
    CONTENT.orbit.quickGuide,
    [
      "eyebrow",
      "heading",
      "steps",
      "completeInstructionsLabel"
    ],
    "CONTENT.orbit.quickGuide"
  );

  assertArray(
    CONTENT.orbit.quickGuide.steps,
    "CONTENT.orbit.quickGuide.steps"
  );

  if (CONTENT.orbit.quickGuide.steps.length !== 5) {
    fail("CONTENT.orbit.quickGuide.steps must contain 5 items.");
  }
}

function validateConstellation() {
  assertExactKeys(
    CONTENT.constellation,
    [
      "primaryPathsLabel",
      "routes",
      "clusters",
      "destinations"
    ],
    "CONTENT.constellation"
  );

  assertExactKeys(
    CONTENT.constellation.routes,
    ["characters", "elara"],
    "CONTENT.constellation.routes"
  );

  Object.entries(CONTENT.constellation.routes).forEach(
    ([key, route]) => {
      assertExactKeys(
        route,
        ["label", "description", "activationLabel"],
        `CONTENT.constellation.routes.${key}`
      );
    }
  );

  assertExactKeys(
    CONTENT.constellation.clusters,
    ["gauges", "information"],
    "CONTENT.constellation.clusters"
  );

  Object.entries(CONTENT.constellation.clusters).forEach(
    ([key, cluster]) => {
      assertExactKeys(
        cluster,
        ["label", "activationLabel", "destinationsLabel"],
        `CONTENT.constellation.clusters.${key}`
      );
    }
  );

  assertExactKeys(
    CONTENT.constellation.destinations,
    [
      "objectGauges",
      "structureGauges",
      "interactionGauges",
      "systemsGauges",
      "platformInformation",
      "engineeringInformation",
      "evidenceInformation"
    ],
    "CONTENT.constellation.destinations"
  );
}

function validateFronts() {
  assertExactKeys(
    CONTENT.fronts,
    [
      "sharedNavigation",
      "object",
      "structure",
      "interaction",
      "systems",
      "information"
    ],
    "CONTENT.fronts"
  );

  assertExactKeys(
    CONTENT.fronts.sharedNavigation,
    ["returnToCompass", "returnToOrbit"],
    "CONTENT.fronts.sharedNavigation"
  );

  validateGaugeCollection(
    CONTENT.fronts.object.gauges,
    Object.keys(OBJECT_GAUGE_STRUCTURE),
    "CONTENT.fronts.object.gauges"
  );

  validateGaugeCollection(
    CONTENT.fronts.structure.gauges,
    Object.keys(STRUCTURE_GAUGE_STRUCTURE),
    "CONTENT.fronts.structure.gauges"
  );

  validateGaugeCollection(
    CONTENT.fronts.interaction.gauges,
    Object.keys(INTERACTION_GAUGE_STRUCTURE),
    "CONTENT.fronts.interaction.gauges"
  );

  validateGaugeCollection(
    CONTENT.fronts.systems.gauges,
    Object.keys(SYSTEM_GAUGE_STRUCTURE),
    "CONTENT.fronts.systems.gauges"
  );

  assertOrderedKeys(
    CONTENT.fronts.structure.composition.regions,
    ["crown", "girdle", "pavilion", "culet", "lattice"],
    "CONTENT.fronts.structure.composition.regions"
  );

  assertExactKeys(
    CONTENT.fronts.information.tabs,
    ["platform", "engineering", "evidence"],
    "CONTENT.fronts.information.tabs"
  );

  validateDisclosureCollection(
    CONTENT.fronts.information.platform.disclosures,
    "CONTENT.fronts.information.platform.disclosures"
  );

  validateDisclosureCollection(
    CONTENT.fronts.information.engineering.disclosures,
    "CONTENT.fronts.information.engineering.disclosures"
  );

  validateDisclosureCollection(
    CONTENT.fronts.information.evidence.disclosures,
    "CONTENT.fronts.information.evidence.disclosures"
  );
}

function validateGaugeCollection(gauges, expectedKeys, label) {
  assertOrderedKeys(gauges, expectedKeys, label);

  gauges.forEach((gauge, index) => {
    Object.entries(gauge).forEach(([key, value]) => {
      assertString(value, `${label}[${index}].${key}`);
    });
  });
}

function validateDisclosureCollection(disclosures, label) {
  assertArray(disclosures, label);
  assertUniqueKeys(disclosures, label);

  disclosures.forEach((disclosure, index) => {
    assertExactKeys(
      disclosure,
      ["key", "title", "description"],
      `${label}[${index}]`
    );

    assertString(
      disclosure.title,
      `${label}[${index}].title`
    );

    assertString(
      disclosure.description,
      `${label}[${index}].description`
    );
  });
}

function validateDialogs() {
  assertExactKeys(
    CONTENT.dialogs,
    ["route", "compass", "construction"],
    "CONTENT.dialogs"
  );

  assertExactKeys(
    CONTENT.dialogs.route,
    [
      "eyebrow",
      "defaultTitle",
      "defaultDescription",
      "closeLabel",
      "stayLabel",
      "continueLabel"
    ],
    "CONTENT.dialogs.route"
  );

  assertExactKeys(
    CONTENT.dialogs.compass,
    [
      "eyebrow",
      "title",
      "description",
      "closeLabel",
      "stayLabel",
      "returnLabel"
    ],
    "CONTENT.dialogs.compass"
  );

  assertExactKeys(
    CONTENT.dialogs.construction,
    [
      "eyebrow",
      "title",
      "closeLabel",
      "records",
      "disclosures",
      "returnLabel"
    ],
    "CONTENT.dialogs.construction"
  );

  assertArray(
    CONTENT.dialogs.construction.records,
    "CONTENT.dialogs.construction.records"
  );

  if (CONTENT.dialogs.construction.records.length !== 9) {
    fail(
      "CONTENT.dialogs.construction.records must contain exactly 9 records."
    );
  }

  validateDisclosureCollection(
    CONTENT.dialogs.construction.disclosures,
    "CONTENT.dialogs.construction.disclosures"
  );
}

function validateFooter() {
  assertExactKeys(
    CONTENT.footer,
    ["title", "description", "links", "navigationLabel"],
    "CONTENT.footer"
  );

  assertExactKeys(
    CONTENT.footer.links,
    ["elara", "mainCompass"],
    "CONTENT.footer.links"
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function text(value) {
  return escapeHtml(value);
}

function bool(value) {
  assertBoolean(value, "Manifest boolean");
  return value ? "true" : "false";
}

function indent(value, spaces) {
  const prefix = " ".repeat(spaces);

  return value
    .split("\n")
    .map((line) => (line ? `${prefix}${line}` : line))
    .join("\n");
}

function joinBlocks(blocks) {
  return blocks.filter(Boolean).join("\n\n");
}

function renderParagraphs(paragraphs, spaces = 0) {
  return indent(
    paragraphs
      .map(
        (paragraph) => `<p>
  ${text(paragraph)}
</p>`
      )
      .join("\n\n"),
    spaces
  );
}

function renderDocumentAttributes() {
  return [
    `lang="${text(CONTENT.identity.language)}"`,
    `data-route="${MANIFEST.route}"`,
    `data-page="${MANIFEST.page}"`,
    `data-version="${BUILD.htmlVersion}"`,
    `data-contract="${BUILD.htmlContract}"`,
    `data-house-room="${MANIFEST.room.id}"`,
    `data-house-room-title="${text(MANIFEST.room.title)}"`,
    `data-room-welcome="${text(MANIFEST.room.welcome)}"`,
    `data-room-narrative-title="${text(
      MANIFEST.room.narrativeTitle
    )}"`,
    `data-primary-subject="${MANIFEST.room.primarySubject}"`,
    `data-primary-narrative="${MANIFEST.room.primaryNarrative}"`,
    `data-homeroom-guide="${MANIFEST.elara.guide}"`,
    `data-elara-homeroom="${bool(MANIFEST.elara.homeroom)}"`,
    `data-elara-route="${MANIFEST.elara.route}"`,
    `data-talk-to-elara-prominent="${bool(
      MANIFEST.elara.prominent
    )}"`,
    `data-showroom-root-contract="mirrorland-official-gate-constellation-gauge-information"`,
    `data-showroom-controller="${MANIFEST.modules.controller}"`,
    `data-showroom-gauges="${MANIFEST.modules.gauges}"`,
    `data-showroom-interactions="${MANIFEST.modules.interactions}"`,
    `data-showroom-compositor="${MANIFEST.modules.compositor}"`,
    `data-showroom-crystals="${MANIFEST.modules.crystals}"`,
    `data-showroom-window="${MANIFEST.modules.window}"`,
    `data-showroom-css="${MANIFEST.modules.css}"`,
    `data-showroom-navigation-model="${MANIFEST.navigation.model}"`,
    `data-showroom-primary-mode="${MANIFEST.navigation.primaryMode}"`,
    `data-showroom-local-front-model="${MANIFEST.navigation.localFrontModel}"`,
    `data-showroom-gauge-layout="${MANIFEST.navigation.gaugeLayout}"`,
    `data-showroom-instruction-layout="${MANIFEST.navigation.instructionLayout}"`,
    `data-showroom-large-star-shape-count="${MANIFEST.constellation.largeStarShapeCount}"`,
    `data-showroom-small-star-shape-count="${MANIFEST.constellation.smallStarShapeCount}"`,
    `data-showroom-total-star-shape-count="${MANIFEST.constellation.totalStarShapeCount}"`,
    `data-showroom-large-star-behaviors="${MANIFEST.constellation.largeStarBehaviors}"`,
    `data-showroom-small-star-behaviors="${MANIFEST.constellation.smallStarBehaviors}"`,
    `data-showroom-gauge-color-family="${MANIFEST.constellation.gaugeColorFamily}"`,
    `data-showroom-information-color-family="${MANIFEST.constellation.informationColorFamily}"`,
    `data-showroom-visible-star-labels="${bool(
      MANIFEST.constellation.visibleStarLabels
    )}"`,
    `data-showroom-semantic-star-labels="${bool(
      MANIFEST.constellation.semanticStarLabels
    )}"`,
    `data-showroom-fallback-stars="${MANIFEST.constellation.fallbackStars}"`,
    `data-showroom-fallback-stars-visible-until-crystals-ready="${bool(
      MANIFEST.constellation.fallbackVisibleUntilReady
    )}"`,
    `data-showroom-crystals-ready="false"`,
    `data-showroom-route-confirmation-required="${bool(
      MANIFEST.navigation.routeConfirmationRequired
    )}"`,
    `data-showroom-return-to-orbit="${bool(
      MANIFEST.navigation.returnToOrbit
    )}"`,
    `data-showroom-return-to-compass="${bool(
      MANIFEST.navigation.returnToCompass
    )}"`,
    `data-showroom-orbit-target="${MANIFEST.navigation.orbitTarget}"`,
    `data-showroom-compass-route="${MANIFEST.navigation.compassRoute}"`,
    `data-showroom-stage-separation="${bool(
      MANIFEST.stage.separation
    )}"`,
    `data-showroom-orbit-stage-independent="${bool(
      MANIFEST.stage.orbitIndependent
    )}"`,
    `data-showroom-diamond-stage-independent="${bool(
      MANIFEST.stage.diamondIndependent
    )}"`,
    `data-showroom-window-stage-diamond-only="${bool(
      MANIFEST.stage.windowDiamondOnly
    )}"`,
    `data-compass-fixed-center="${bool(
      MANIFEST.compass.fixedCenter
    )}"`,
    `data-compass-orbital-reference="${bool(
      MANIFEST.compass.orbitalReference
    )}"`,
    `data-compass-page-local-decision="${bool(
      MANIFEST.compass.pageLocalDecision
    )}"`,
    `data-compass-immediate-navigation="${bool(
      MANIFEST.compass.immediateNavigation
    )}"`,
    `data-compass-explicit-return-required="${bool(
      MANIFEST.compass.explicitReturnRequired
    )}"`,
    `data-compass-main-route="${MANIFEST.compass.mainRoute}"`,
    `data-compass-control-purpose="${MANIFEST.compass.controlPurpose}"`,
    `data-compass-renderer-navigation-authority="${bool(
      MANIFEST.compass.rendererNavigationAuthority
    )}"`,
    `data-compass-controller-navigation-authority="${bool(
      MANIFEST.compass.controllerNavigationAuthority
    )}"`,
    `data-mirrorland-window-independent="${bool(
      MANIFEST.window.independent
    )}"`,
    `data-mirrorland-window-foreground="${bool(
      MANIFEST.window.foreground
    )}"`,
    `data-mirrorland-window-in-front-of-diamond="${bool(
      MANIFEST.window.inFrontOfDiamond
    )}"`,
    `data-mirrorland-window-compass-owned="${bool(
      MANIFEST.window.compassOwned
    )}"`,
    `data-mirrorland-window-crystal-depth-participant="${bool(
      MANIFEST.window.crystalDepthParticipant
    )}"`,
    `data-mirrorland-window-state="${MANIFEST.window.initialState}"`,
    `data-diamond-generation="${MANIFEST.diamond.generation}"`,
    `data-diamond-render-mode="${MANIFEST.diamond.renderMode}"`,
    `data-diamond-geometry="${MANIFEST.diamond.geometry}"`,
    `data-diamond-renderer="${MANIFEST.diamond.renderer}"`,
    `data-diamond-ui="${MANIFEST.diamond.ui}"`,
    `data-diamond-protected-core="${bool(
      MANIFEST.diamond.protectedCore
    )}"`,
    `data-diamond-original-stage-restored="${bool(
      MANIFEST.diamond.originalStageRestored
    )}"`,
    `data-diamond-window-sibling-layer="${bool(
      MANIFEST.diamond.windowSiblingLayer
    )}"`,
    `data-native-webgl="${bool(MANIFEST.rendering.nativeWebGL)}"`,
    `data-webgl-fallback="${bool(
      MANIFEST.rendering.webGLFallback
    )}"`,
    `data-radial-sectors="${MANIFEST.geometry.radialSectors}"`,
    `data-structural-bands="${MANIFEST.geometry.structuralBands}"`,
    `data-lattice-seats="${MANIFEST.geometry.latticeSeats}"`,
    `data-surface-triangles="${MANIFEST.geometry.surfaceTriangles}"`,
    `data-lattice-connections="${MANIFEST.geometry.latticeConnections}"`,
    `data-material-regions="${MANIFEST.geometry.materialRegions}"`,
    `data-public-views="${MANIFEST.geometry.publicViews}"`,
    `data-generated-image="${bool(
      MANIFEST.rendering.generatedImage
    )}"`,
    `data-imported-3d-model="${bool(
      MANIFEST.rendering.imported3DModel
    )}"`,
    `data-visual-pass-claimed="${bool(
      MANIFEST.authorization.visualPassClaimed
    )}"`,
    `data-runtime-pass-claimed="${bool(
      MANIFEST.authorization.runtimePassClaimed
    )}"`,
    `data-production-authorized="${bool(
      MANIFEST.authorization.productionAuthorized
    )}"`,
    `data-deployment-authorized="${bool(
      MANIFEST.authorization.deploymentAuthorized
    )}"`
  ].join("\n  ");
}

function renderHead() {
  return `<head>
  <meta charset="utf-8">

  <meta
    name="viewport"
    content="width=device-width,initial-scale=1,viewport-fit=cover"
  >

  <title>
    ${text(CONTENT.document.title)}
  </title>

  <meta
    name="description"
    content="${text(CONTENT.document.description)}"
  >

  <meta
    name="showroom-build-contract"
    content="${BUILD.id}"
  >

  <meta
    name="showroom-content-contract"
    content="${CONTENT.identity.sourceId}"
  >

  <link
    rel="stylesheet"
    href="/assets/manor-blueprint/manor.blueprint.css?v=MANOR_BLUEPRINT_CARDINAL_ROOM_MAP_VISUAL_CSS_TNT_v1"
    data-mirrorland-blueprint-marker="true"
    data-blueprint-page-scoped="true"
  >

  <link
    rel="stylesheet"
    href="/assets/compass/compass.css"
    data-showroom-compass-css="true"
  >

  <link
    rel="stylesheet"
    href="/showroom/index.css?v=SHOWROOM_MIRRORLAND_OFFICIAL_GATE_COMPACT_INSTRUCTIONS_AND_GAUGES_CSS_TNT_v5"
    data-showroom-page-css="true"
    data-showroom-page-css-contract="SHOWROOM_MIRRORLAND_OFFICIAL_GATE_COMPACT_INSTRUCTIONS_AND_GAUGES_CSS_TNT_v5"
  >
</head>`;
}

function renderFallbackMenu() {
  const groups = CONTENT.header.guide.groups
    .map((group) => {
      const links = group.links
        .map(
          (link) => `<a href="${ROUTES[link.key]}">
  ${text(link.label)}
</a>`
        )
        .join("\n\n");

      return `<div class="fallback-navigation__group">
  <strong>${text(group.title)}</strong>

${indent(links, 2)}
</div>`;
    })
    .join("\n\n");

  return `<details class="route-menu">
  <summary>
    ${text(CONTENT.header.guide.fallbackMenuLabel)}
  </summary>

  <div class="route-menu-panel">
    <nav
      class="fallback-navigation"
      aria-label="${text(
        CONTENT.header.guide.fallbackNavigationLabel
      )}"
      data-showroom-fallback-navigation
    >
${indent(groups, 6)}
    </nav>
  </div>
</details>`;
}

function renderHeader() {
  return `<header
  class="topbar showroom-topbar"
  aria-label="Showroom header"
>
  <a
    class="brand"
    href="/index.html"
    aria-label="${text(CONTENT.header.brand.returnLabel)}"
  >
    <span
      class="brand-mark"
      aria-hidden="true"
    >
      <span>${text(CONTENT.header.brand.mark)}</span>
    </span>

    <span class="brand-copy">
      <span>${text(CONTENT.header.brand.parentTitle)}</span>
      <strong>${text(CONTENT.header.brand.roomTitle)}</strong>
    </span>
  </a>

  <nav
    class="nav showroom-nav"
    aria-label="Showroom guidance and fallback navigation"
  >
    <div class="elara-quick-path">
      <elara-room-entry
        href="/elara/index.html"
        label="${text(
          CONTENT.header.guide.primaryCharacterLabel
        )}"
      >
        <a
          class="elara-primary-link"
          href="/elara/index.html"
        >
          ${text(CONTENT.header.guide.primaryCharacterLabel)}
        </a>
      </elara-room-entry>
    </div>

${indent(renderFallbackMenu(), 4)}
  </nav>
</header>`;
}

function renderThreshold() {
  const prefaceSections = CONTENT.threshold.preface.sections
    .map(
      (section) => `<section aria-labelledby="mirrorland-preface-${text(
        section.key
      )}">
  <span class="mirrorland-preface__index">
    ${text(section.index)}
  </span>

  <h2 id="mirrorland-preface-${text(section.key)}">
    ${text(section.title)}
  </h2>

${renderParagraphs(section.paragraphs, 2)}
</section>`
    )
    .join("\n\n");

  return `<section
  id="arrival"
  class="showroom-threshold panel chamber-arrival"
  aria-labelledby="page-title"
  data-showroom-threshold-introduction
  data-showroom-official-gate
>
  <div class="showroom-threshold__copy">
    <div class="showroom-gate-badge">
      ${text(CONTENT.threshold.badge)}
    </div>

    <h1 id="page-title">
      ${text(CONTENT.threshold.heading)}
    </h1>

    <p class="door-subtitle">
      ${text(CONTENT.threshold.subtitle)}
    </p>

    <p class="showroom-threshold__lead">
      ${text(CONTENT.threshold.lead)}
    </p>

    <p class="showroom-threshold__support">
      ${text(CONTENT.threshold.support)}
    </p>

    <div
      class="thesis-field mirrorland-thesis"
      aria-label="${text(CONTENT.threshold.thesisLabel)}"
    >
      <strong>
        ${text(CONTENT.threshold.thesis[0])}<br>
        ${text(CONTENT.threshold.thesis[1])}
      </strong>
    </div>

    <details
      id="mirrorland-preface"
      class="architectural-drop mirrorland-preface"
      data-showroom-mirrorland-preface
    >
      <summary>
        ${text(CONTENT.threshold.preface.summary)}
      </summary>

      <div class="drop-content mirrorland-preface__content">
${indent(prefaceSections, 8)}
      </div>
    </details>
  </div>
</section>`;
}

function renderInstructions() {
  const steps = CONTENT.instructions.steps
    .map(
      (step) => `<details
  class="showroom-instruction"
  data-showroom-instruction
>
  <summary>
    <span>${text(step.index)}</span>
    <strong>${text(step.title)}</strong>
    <small>${text(step.summary)}</small>
  </summary>

  <div>
    <p>
      ${text(step.description)}
    </p>

    <a href="${INSTRUCTION_TARGETS[step.key]}">
      ${text(step.actionLabel)}
    </a>
  </div>
</details>`
    )
    .join("\n\n");

  return `<section
  id="showroom-instructions"
  class="showroom-instructions panel chamber-platform"
  aria-labelledby="showroom-instructions-title"
  data-showroom-instructions
>
  <details
    id="showroom-instructions-disclosure"
    class="showroom-instructions__disclosure"
    data-showroom-instructions-disclosure
  >
    <summary class="showroom-instructions__summary">
      <span class="showroom-instructions__badge">
        ${text(CONTENT.instructions.badge)}
      </span>

      <span class="showroom-instructions__summary-copy">
        <strong id="showroom-instructions-title">
          ${text(CONTENT.instructions.heading)}
        </strong>

        <small>
          ${text(CONTENT.instructions.summary)}
        </small>
      </span>
    </summary>

    <div class="showroom-instructions__body">
      <p class="showroom-instructions__introduction">
        ${text(CONTENT.instructions.introduction)}
      </p>

      <div
        class="showroom-instructions__steps"
        data-showroom-instruction-steps
      >
${indent(steps, 8)}
      </div>

      <a
        class="button button-gold showroom-instructions__enter"
        href="#showroom-orbit"
      >
        ${text(CONTENT.instructions.enterLabel)}
      </a>
    </div>
  </details>
</section>`;
}

function renderPrimaryStars() {
  const routes = CONTENT.constellation.routes;
  const clusters = CONTENT.constellation.clusters;

  return `<div
  class="showroom-primary-stars"
  data-showroom-primary-stars
  data-showroom-fallback-star-layer
  data-showroom-fallback-star-visibility="visible"
  aria-label="${text(
    CONTENT.constellation.primaryPathsLabel
  )}"
>
  ${renderRouteStar({
    objectId: "characters-route",
    routeId: "characters",
    route: "/characters/",
    content: routes.characters
  })}

  ${renderRouteStar({
    objectId: "elara-route",
    routeId: "elara",
    route: "/elara/index.html",
    content: routes.elara
  })}

  ${renderClusterStar({
    objectId: "gauge-cluster",
    clusterId: "gauges",
    controls: "showroom-cluster-gauges",
    content: clusters.gauges
  })}

  ${renderClusterStar({
    objectId: "information-cluster",
    clusterId: "information",
    controls: "showroom-cluster-information",
    content: clusters.information
  })}
</div>`;
}

function renderRouteStar({
  objectId,
  routeId,
  route,
  content
}) {
  return `<button
    class="showroom-star showroom-star--large"
    type="button"
    data-showroom-object
    data-showroom-semantic-star
    data-showroom-fallback-star
    data-showroom-object-id="${objectId}"
    data-showroom-object-size="large"
    data-showroom-object-shape="cardinal-star"
    data-showroom-object-behavior="route"
    data-showroom-route-id="${routeId}"
    data-showroom-route-label="${text(content.label)}"
    data-showroom-route="${route}"
    data-showroom-route-description="${text(content.description)}"
    aria-label="${text(content.activationLabel)}"
    aria-haspopup="dialog"
    aria-controls="showroom-route-dialog"
  >
    <span class="sr-only">
      ${text(content.label)}
    </span>
  </button>`;
}

function renderClusterStar({
  objectId,
  clusterId,
  controls,
  content
}) {
  return `<button
    class="showroom-star showroom-star--large"
    type="button"
    data-showroom-object
    data-showroom-semantic-star
    data-showroom-fallback-star
    data-showroom-object-id="${objectId}"
    data-showroom-object-size="large"
    data-showroom-object-shape="cardinal-star"
    data-showroom-object-behavior="cluster"
    data-showroom-cluster-id="${clusterId}"
    aria-label="${text(content.activationLabel)}"
    aria-expanded="false"
    aria-controls="${controls}"
  >
    <span class="sr-only">
      ${text(content.label)}
    </span>
  </button>`;
}

function renderChildStar({
  className,
  objectId,
  behavior,
  frontId,
  informationTab,
  content
}) {
  const informationAttribute = informationTab
    ? `\n    data-showroom-information-tab="${informationTab}"`
    : "";

  return `<button
    class="showroom-star showroom-star--small ${className}"
    type="button"
    data-showroom-object
    data-showroom-semantic-star
    data-showroom-fallback-star
    data-showroom-object-id="${objectId}"
    data-showroom-object-size="small"
    data-showroom-object-shape="child-star"
    data-showroom-object-behavior="${behavior}"
    data-showroom-front-id="${frontId}"${informationAttribute}
    aria-label="${text(content.activationLabel)}"
    aria-controls="${frontId}"
  >
    <span class="sr-only">
      ${text(content.label)}
    </span>
  </button>`;
}

function renderStarClusters() {
  const destination = CONTENT.constellation.destinations;
  const clusters = CONTENT.constellation.clusters;

  const gaugeStars = [
    renderChildStar({
      className: "showroom-star--gauge",
      objectId: "object-gauge-star",
      behavior: "gauge",
      frontId: "object-gauges",
      content: destination.objectGauges
    }),

    renderChildStar({
      className: "showroom-star--gauge",
      objectId: "structure-gauge-star",
      behavior: "gauge",
      frontId: "structure-gauges",
      content: destination.structureGauges
    }),

    renderChildStar({
      className: "showroom-star--gauge",
      objectId: "interaction-gauge-star",
      behavior: "gauge",
      frontId: "interaction-gauges",
      content: destination.interactionGauges
    }),

    renderChildStar({
      className: "showroom-star--gauge",
      objectId: "systems-gauge-star",
      behavior: "gauge",
      frontId: "systems-gauges",
      content: destination.systemsGauges
    })
  ].join("\n\n");

  const informationStars = [
    renderChildStar({
      className: "showroom-star--information",
      objectId: "platform-information-star",
      behavior: "information",
      frontId: "information-front",
      informationTab: "platform",
      content: destination.platformInformation
    }),

    renderChildStar({
      className: "showroom-star--information",
      objectId: "engineering-information-star",
      behavior: "information",
      frontId: "information-front",
      informationTab: "engineering",
      content: destination.engineeringInformation
    }),

    renderChildStar({
      className: "showroom-star--information",
      objectId: "evidence-information-star",
      behavior: "information",
      frontId: "information-front",
      informationTab: "evidence",
      content: destination.evidenceInformation
    })
  ].join("\n\n");

  return `<div
  id="showroom-cluster-gauges"
  class="showroom-star-cluster showroom-star-cluster--gauges"
  data-showroom-cluster
  data-showroom-fallback-star-layer
  data-showroom-cluster-id="gauges"
  data-showroom-cluster-state="collapsed"
  data-showroom-fallback-star-visibility="visible"
  aria-label="${text(clusters.gauges.destinationsLabel)}"
  hidden
>
${indent(gaugeStars, 2)}
</div>

<div
  id="showroom-cluster-information"
  class="showroom-star-cluster showroom-star-cluster--information"
  data-showroom-cluster
  data-showroom-fallback-star-layer
  data-showroom-cluster-id="information"
  data-showroom-cluster-state="collapsed"
  data-showroom-fallback-star-visibility="visible"
  aria-label="${text(
    clusters.information.destinationsLabel
  )}"
  hidden
>
${indent(informationStars, 2)}
</div>`;
}

function renderOrbit() {
  const directions = CONTENT.orbit.compass.directions
    .map((direction) => `<span>${text(direction)}</span>`)
    .join("\n");

  const quickSteps = CONTENT.orbit.quickGuide.steps
    .map(
      (step) => `<li>
  ${text(step)}
</li>`
    )
    .join("\n\n");

  return `<section
  id="showroom-orbit"
  class="showroom-orbit panel"
  aria-labelledby="showroom-orbit-title"
  data-showroom-orbit-scene
  data-showroom-scene
>
  <header class="showroom-orbit__heading">
    <div>
      <div class="kicker">
        ${text(CONTENT.orbit.kicker)}
      </div>

      <h2 id="showroom-orbit-title">
        ${text(CONTENT.orbit.heading)}
      </h2>
    </div>

    <p data-showroom-guidance>
      ${text(CONTENT.orbit.guidance)}
    </p>
  </header>

  <div
    class="showroom-orbit__legend"
    aria-label="${text(CONTENT.orbit.legend.label)}"
  >
    <span data-showroom-legend-kind="gauge">
      <i aria-hidden="true"></i>
      ${text(CONTENT.orbit.legend.gauge)}
    </span>

    <span data-showroom-legend-kind="information">
      <i aria-hidden="true"></i>
      ${text(CONTENT.orbit.legend.information)}
    </span>
  </div>

  <div
    class="showroom-orbit__field"
    data-showroom-orbit-field
    data-showroom-scene-field
    aria-label="${text(CONTENT.orbit.sceneLabel)}"
  >
    <div
      class="showroom-cosmic-field"
      aria-hidden="true"
      data-showroom-cosmic-field
    ></div>

    <div
      class="showroom-compass-layer"
      data-showroom-compass-layer
    >
      <div
        class="showroom-compass-mount"
        data-upstream-compass-mount
        data-compass-root
        data-compass-scene
        data-compass-fixed-center="true"
        data-compass-visual-only="true"
        data-compass-navigation-authority="false"
        aria-hidden="true"
      ></div>

      <button
        class="showroom-compass-control"
        type="button"
        data-upstream-compass-control
        data-showroom-compass-control
        data-showroom-controller-action="open-compass-return-dialog"
        data-showroom-interaction-target="compass"
        data-showroom-object-behavior="compass-return"
        data-fixed-center="true"
        data-interaction-enabled="true"
        data-immediate-navigation="false"
        data-return-route="/index.html"
        aria-label="${text(
          CONTENT.orbit.compass.controlLabel
        )}"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="showroom-compass-dialog"
      >
        <span
          class="showroom-compass-control__mark"
          aria-hidden="true"
        >
${indent(directions, 10)}
        </span>

        <span class="showroom-compass-control__label">
          ${text(CONTENT.orbit.compass.label)}
        </span>

        <span class="showroom-compass-control__instruction">
          ${text(CONTENT.orbit.compass.instruction)}
        </span>
      </button>
    </div>

    <aside
      class="showroom-orbit-guide"
      data-showroom-orbit-guide
      aria-labelledby="showroom-orbit-guide-title"
    >
      <span class="showroom-orbit-guide__eyebrow">
        ${text(CONTENT.orbit.quickGuide.eyebrow)}
      </span>

      <h3 id="showroom-orbit-guide-title">
        ${text(CONTENT.orbit.quickGuide.heading)}
      </h3>

      <ol>
${indent(quickSteps, 8)}
      </ol>

      <a
        href="#showroom-instructions"
        data-showroom-open-instructions
        aria-controls="showroom-instructions-disclosure"
        aria-expanded="false"
      >
        ${text(
          CONTENT.orbit.quickGuide.completeInstructionsLabel
        )}
      </a>
    </aside>

${indent(renderPrimaryStars(), 4)}

${indent(renderStarClusters(), 4)}

    <div
      class="showroom-orbit__fallback"
      data-showroom-orbit-fallback
    >
      <p>
        ${text(CONTENT.orbit.fallback)}
      </p>
    </div>
  </div>
</section>`;
}

function renderGaugeButtons({
  gauges,
  structure,
  className,
  family,
  mode
}) {
  return gauges
    .map((gauge, index) => {
      const config = structure[gauge.key];
      const expanded = index === 0 ? "true" : "false";
      const detailId = `gauge-detail-${config.id}`;

      if (mode === "status") {
        return `<button
  class="${className}"
  type="button"
  data-showroom-gauge
  data-gauge-id="${config.id}"
  data-gauge-family="state"
  data-gauge-state="${config.state}"
  aria-expanded="${expanded}"
  aria-controls="${detailId}"
>
  <span>${text(gauge.label)}</span>
  <strong>${text(gauge.state)}</strong>
</button>`;
      }

      if (mode === "capability") {
        return `<button
  class="${className}"
  type="button"
  data-showroom-gauge
  data-gauge-id="${config.id}"
  data-gauge-family="capability"
  data-gauge-state="${config.state}"
  aria-expanded="${expanded}"
  aria-controls="${detailId}"
>
  <strong>${text(gauge.primary)}</strong>
  <span>${text(gauge.label)}</span>
</button>`;
      }

      const displayValue =
        config.value !== undefined
          ? `\n  data-gauge-value="${config.value}"\n  data-gauge-display-value="${config.value}"`
          : "";

      return `<button
  class="${className}"
  type="button"
  data-showroom-gauge
  data-gauge-id="${config.id}"
  data-gauge-family="${config.family || family}"${displayValue}
  data-gauge-state="${config.state || "fixed"}"
  aria-expanded="${expanded}"
  aria-controls="${detailId}"
>
  <strong>${text(gauge.primary)}</strong>
  <span>${text(gauge.label)}</span>
  <small>${text(gauge.summary)}</small>
</button>`;
    })
    .join("\n\n");
}

function renderGaugeDetails({ gauges, structure }) {
  return gauges
    .map((gauge, index) => {
      const config = structure[gauge.key];

      return `<article
  id="gauge-detail-${config.id}"
  class="showroom-gauge-detail"
  data-showroom-gauge-detail
  data-gauge-detail-id="${config.id}"${
        index === 0 ? "" : "\n  hidden"
      }
>
  <h3>
    ${text(gauge.detailTitle)}
  </h3>

  <p>
    ${text(gauge.detail)}
  </p>
</article>`;
    })
    .join("\n\n");
}

function renderFrontNavigation(label) {
  return `<nav
  class="showroom-front-navigation"
  aria-label="${text(label)}"
>
  <a
    class="button"
    href="/index.html"
  >
    ${text(
      CONTENT.fronts.sharedNavigation.returnToCompass
    )}
  </a>

  <a
    class="button button-gold"
    href="#showroom-orbit"
    data-showroom-return-to-orbit
  >
    ${text(CONTENT.fronts.sharedNavigation.returnToOrbit)}
  </a>
</nav>`;
}

function renderObjectFront() {
  const front = CONTENT.fronts.object;

  const buttons = renderGaugeButtons({
    gauges: front.gauges,
    structure: OBJECT_GAUGE_STRUCTURE,
    className: "showroom-gauge showroom-gauge--compact",
    family: "metric",
    mode: "metric"
  });

  const details = renderGaugeDetails({
    gauges: front.gauges,
    structure: OBJECT_GAUGE_STRUCTURE
  });

  return `<section
  id="object-gauges"
  class="panel showroom-front showroom-gauge-front chamber-exhibit"
  data-showroom-front
  data-showroom-front-kind="gauge"
  data-showroom-gauge-set="object"
  data-showroom-front-state="fallback"
  aria-labelledby="object-gauges-title"
>
  <header class="showroom-front__heading">
    <div>
      <div class="kicker">
        ${text(front.kicker)}
      </div>

      <h2 id="object-gauges-title">
        ${text(front.heading)}
      </h2>

      <p>
        ${text(front.introduction)}
      </p>
    </div>
  </header>

  <div
    class="showroom-gauge-dashboard showroom-gauge-dashboard--compact"
    data-showroom-gauge-dashboard
    data-gauge-dashboard-id="object"
    data-gauge-dashboard-state="ready"
  >
    <div
      class="showroom-gauge-selector showroom-gauge-selector--metrics"
      role="group"
      aria-label="${text(front.selectorLabel)}"
    >
${indent(buttons, 6)}
    </div>

    <div
      class="showroom-gauge-details showroom-gauge-details--shared"
      data-showroom-gauge-details
      aria-live="polite"
    >
${indent(details, 6)}
    </div>
  </div>

${indent(renderDiamondStage(), 2)}

${indent(renderFrontNavigation(front.navigationLabel), 2)}
</section>`;
}

function renderDiamondStage() {
  const diamond = CONTENT.fronts.object.diamond;

  return `<div class="diamond-layout">
  <div class="diamond-view-column">
    <div
      class="showroom-reveal-scene"
      data-showroom-reveal-scene
      data-showroom-window-state="closed"
    >
      <div
        class="showroom-diamond-layer"
        data-showroom-diamond-layer
      >
        <div class="diamond-exhibit-frame">
          <div class="diamond-viewport-card">
            <div
              class="diamond-stage"
              data-showroom-diamond-stage
              data-diamond-object-stage="true"
              data-diamond-generation="G3"
              data-diamond-render-mode="native-webgl"
              data-object-thesis="computational-gem-at-the-mirrorland-door"
              data-globe-inspired="true"
              data-gem-governed="true"
              data-radial-sectors="16"
              data-structural-bands="16"
              data-lattice-seats="256"
              data-surface-triangles="512"
              data-lattice-connections="800"
              data-webgl-state="loading"
              data-showroom-diamond-pointer-enabled="true"
              role="group"
              tabindex="0"
              aria-label="${text(diamond.stageLabel)}"
            >
              <canvas
                data-showroom-diamond-canvas
                aria-hidden="true"
              ></canvas>

              <div
                class="diamond-fallback"
                data-showroom-diamond-fallback
                role="status"
                aria-live="polite"
                hidden
              >
                <div class="diamond-fallback-card">
                  <span
                    class="diamond-fallback-object"
                    aria-hidden="true"
                  ></span>

                  <strong>
                    ${text(diamond.fallback.title)}
                  </strong>

                  <p>
                    ${text(diamond.fallback.description)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="showroom-window-layer"
        data-showroom-window-layer
      >
        <div
          class="showroom-window-mount"
          data-showroom-window-mount
          data-showroom-mirrorland-window-mount
          aria-hidden="true"
        ></div>

        <button
          class="showroom-window-control"
          type="button"
          data-showroom-window-control
          data-showroom-mirrorland-window-control
          aria-controls="showroom-diamond-controls"
          aria-expanded="false"
          aria-label="${text(
            diamond.window.closedControlLabel
          )}"
        >
          <span
            class="showroom-window-control__eyebrow"
            aria-hidden="true"
          >
            ${text(diamond.window.eyebrow)}
          </span>

          <span
            class="showroom-window-control__label"
            data-showroom-window-label
          >
            ${text(diamond.window.closedLabel)}
          </span>
        </button>
      </div>
    </div>

    <div
      id="showroom-diamond-controls"
      class="showroom-diamond-controls"
      data-showroom-diamond-controls
    >
      <details
        class="object-control-tray"
        open
      >
        <summary>
          ${text(diamond.controls.traySummary)}
        </summary>

        <div class="object-control-body">
          <div
            class="two-view-buttons"
            aria-label="${text(
              diamond.controls.viewGroupLabel
            )}"
          >
            <button
              type="button"
              data-diamond-lens="crystal"
              data-diamond-dimension="object"
              aria-pressed="true"
              data-active
            >
              ${text(diamond.controls.objectView)}
            </button>

            <button
              type="button"
              data-diamond-lens="lattice"
              aria-pressed="false"
            >
              ${text(diamond.controls.latticeView)}
            </button>
          </div>

          <div
            class="technical-control-bridge"
            aria-hidden="true"
            data-technical-control-options-hidden="true"
          >
            <button
              type="button"
              data-diamond-dimension="memory"
              aria-pressed="false"
              tabindex="-1"
            >
              ${text(
                diamond.controls.technicalViews.worldMemory
              )}
            </button>

            <button
              type="button"
              data-diamond-dimension="behind"
              aria-pressed="false"
              tabindex="-1"
            >
              ${text(
                diamond.controls.technicalViews.latticeBehind
              )}
            </button>

            <button
              type="button"
              data-diamond-dimension="through"
              aria-pressed="false"
              tabindex="-1"
            >
              ${text(
                diamond.controls.technicalViews.latticeThrough
              )}
            </button>

            <button
              type="button"
              data-diamond-dimension="full"
              aria-pressed="false"
              tabindex="-1"
            >
              ${text(
                diamond.controls.technicalViews.fullProof
              )}
            </button>
          </div>

          <div class="status-strip">
            <span data-showroom-diamond-status>
              ${text(diamond.controls.loadingStatus)}
            </span>

            <div class="actions">
              <button
                class="button"
                type="button"
                data-showroom-diamond-inspect
              >
                ${text(diamond.controls.inspectLabel)}
              </button>

              <button
                class="button"
                type="button"
                data-showroom-diamond-reset
              >
                ${text(diamond.controls.resetLabel)}
              </button>
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>
</div>`;
}

function renderStructureFront() {
  const front = CONTENT.fronts.structure;

  const buttons = renderGaugeButtons({
    gauges: front.gauges,
    structure: Object.fromEntries(
      Object.entries(STRUCTURE_GAUGE_STRUCTURE).map(
        ([key, value]) => [
          key,
          {
            ...value,
            family: "metric",
            state: "fixed"
          }
        ]
      )
    ),
    className: "showroom-gauge showroom-gauge--compact",
    family: "metric",
    mode: "metric"
  });

  const details = renderGaugeDetails({
    gauges: front.gauges,
    structure: STRUCTURE_GAUGE_STRUCTURE
  });

  return `<section
  id="structure-gauges"
  class="panel showroom-front showroom-gauge-front chamber-mathematics"
  data-showroom-front
  data-showroom-front-kind="gauge"
  data-showroom-gauge-set="structure"
  data-showroom-front-state="fallback"
  aria-labelledby="structure-gauges-title"
>
  <header class="showroom-front__heading">
    <div>
      <div class="kicker">
        ${text(front.kicker)}
      </div>

      <h2 id="structure-gauges-title">
        ${text(front.heading)}
      </h2>

      <p>
        ${text(front.introduction)}
      </p>
    </div>
  </header>

  <div
    class="showroom-gauge-dashboard showroom-gauge-dashboard--compact"
    data-showroom-gauge-dashboard
    data-gauge-dashboard-id="structure"
    data-gauge-dashboard-state="ready"
  >
    <div
      class="showroom-gauge-selector showroom-gauge-selector--metrics"
      role="group"
      aria-label="${text(front.selectorLabel)}"
    >
${indent(buttons, 6)}
    </div>

    <div
      class="showroom-gauge-details showroom-gauge-details--shared"
      data-showroom-gauge-details
      aria-live="polite"
    >
${indent(details, 6)}
    </div>

${indent(renderCompositionGauge(), 4)}
  </div>

${indent(renderFrontNavigation(front.navigationLabel), 2)}
</section>`;
}

function renderCompositionGauge() {
  const composition = CONTENT.fronts.structure.composition;

  const regions = composition.regions
    .map(
      (region, index) => `<button
  type="button"
  role="listitem"
  data-showroom-composition-region
  data-region-id="${region.key}"
  aria-pressed="${index === 0 ? "true" : "false"}"
>
  <span>${text(region.index)}</span>
  <strong>${text(region.title)}</strong>
  <small>${text(region.description)}</small>
</button>`
    )
    .join("\n\n");

  const first = composition.regions[0];

  return `<div
  class="showroom-composition-gauge showroom-composition-gauge--compact"
  data-showroom-composition-gauge
  aria-labelledby="diamond-anatomy-title"
>
  <header>
    <span>
      ${text(composition.eyebrow)}
    </span>

    <h3 id="diamond-anatomy-title">
      ${text(composition.heading)}
    </h3>
  </header>

  <div
    class="showroom-composition-rail"
    role="list"
    aria-label="${text(composition.railLabel)}"
  >
${indent(regions, 4)}
  </div>

  <div
    class="showroom-composition-detail"
    data-showroom-composition-detail
    aria-live="polite"
  >
    <span data-showroom-composition-detail-index>
      ${text(first.index)}
    </span>

    <strong data-showroom-composition-detail-title>
      ${text(first.title)}
    </strong>

    <p data-showroom-composition-detail-description>
      ${text(first.description)}
    </p>
  </div>
</div>`;
}

function renderInteractionFront() {
  const front = CONTENT.fronts.interaction;

  const buttons = renderGaugeButtons({
    gauges: front.gauges,
    structure: INTERACTION_GAUGE_STRUCTURE,
    className:
      "showroom-gauge showroom-gauge--capability-compact",
    mode: "capability"
  });

  const details = renderGaugeDetails({
    gauges: front.gauges,
    structure: INTERACTION_GAUGE_STRUCTURE
  });

  return renderSimpleGaugeFront({
    id: "interaction-gauges",
    className: "chamber-platform",
    gaugeSet: "interaction",
    titleId: "interaction-gauges-title",
    front,
    dashboardId: "interaction",
    selectorClass:
      "showroom-gauge-selector showroom-gauge-selector--capabilities",
    selectorExtra: "data-showroom-capability-grid",
    buttons,
    details
  });
}

function renderSystemsFront() {
  const front = CONTENT.fronts.systems;

  const buttons = renderGaugeButtons({
    gauges: front.gauges,
    structure: SYSTEM_GAUGE_STRUCTURE,
    className: "showroom-gauge showroom-gauge--status-row",
    mode: "status"
  });

  const details = renderGaugeDetails({
    gauges: front.gauges,
    structure: SYSTEM_GAUGE_STRUCTURE
  });

  return renderSimpleGaugeFront({
    id: "systems-gauges",
    className: "chamber-surface",
    gaugeSet: "systems",
    titleId: "systems-gauges-title",
    front,
    dashboardId: "systems",
    selectorClass:
      "showroom-gauge-selector showroom-gauge-selector--status",
    selectorExtra: "",
    buttons,
    details
  });
}

function renderSimpleGaugeFront({
  id,
  className,
  gaugeSet,
  titleId,
  front,
  dashboardId,
  selectorClass,
  selectorExtra,
  buttons,
  details
}) {
  const extra = selectorExtra
    ? `\n      ${selectorExtra}`
    : "";

  return `<section
  id="${id}"
  class="panel showroom-front showroom-gauge-front ${className}"
  data-showroom-front
  data-showroom-front-kind="gauge"
  data-showroom-gauge-set="${gaugeSet}"
  data-showroom-front-state="fallback"
  aria-labelledby="${titleId}"
>
  <header class="showroom-front__heading">
    <div>
      <div class="kicker">
        ${text(front.kicker)}
      </div>

      <h2 id="${titleId}">
        ${text(front.heading)}
      </h2>

      <p>
        ${text(front.introduction)}
      </p>
    </div>
  </header>

  <div
    class="showroom-gauge-dashboard showroom-gauge-dashboard--compact"
    data-showroom-gauge-dashboard
    data-gauge-dashboard-id="${dashboardId}"
    data-gauge-dashboard-state="ready"
  >
    <div
      class="${selectorClass}"${extra}
      role="group"
      aria-label="${text(front.selectorLabel)}"
    >
${indent(buttons, 6)}
    </div>

    <div
      class="showroom-gauge-details showroom-gauge-details--shared"
      data-showroom-gauge-details
      aria-live="polite"
    >
${indent(details, 6)}
    </div>
  </div>

${indent(renderFrontNavigation(front.navigationLabel), 2)}
</section>`;
}

function renderDisclosures(disclosures) {
  return disclosures
    .map(
      (item) => `<details class="architectural-drop">
  <summary>
    ${text(item.title)}
  </summary>

  <div class="drop-content">
    <p>
      ${text(item.description)}
    </p>
  </div>
</details>`
    )
    .join("\n\n");
}

function renderInformationFront() {
  const front = CONTENT.fronts.information;
  const tabs = front.tabs;

  return `<section
  id="information-front"
  class="panel showroom-front showroom-information-front chamber-construction"
  data-showroom-front
  data-showroom-front-kind="information"
  data-showroom-front-state="fallback"
  data-showroom-information-front
  aria-labelledby="information-front-title"
>
  <header class="showroom-front__heading">
    <div>
      <div class="kicker">
        ${text(front.kicker)}
      </div>

      <h2 id="information-front-title">
        ${text(front.heading)}
      </h2>

      <p>
        ${text(front.introduction)}
      </p>
    </div>
  </header>

  <div
    class="showroom-information-tabs"
    data-showroom-information-tabs
  >
    <div
      class="showroom-information-tablist"
      role="tablist"
      aria-label="${text(front.tabListLabel)}"
    >
      ${renderInformationTab({
        id: "platform-tab",
        key: "platform",
        panel: "platform-panel",
        label: tabs.platform,
        selected: true
      })}

      ${renderInformationTab({
        id: "engineering-tab",
        key: "engineering",
        panel: "engineering-panel",
        label: tabs.engineering,
        selected: false
      })}

      ${renderInformationTab({
        id: "evidence-tab",
        key: "evidence",
        panel: "evidence-panel",
        label: tabs.evidence,
        selected: false
      })}
    </div>

${indent(renderPlatformPanel(), 4)}

${indent(renderEngineeringPanel(), 4)}

${indent(renderEvidencePanel(), 4)}
  </div>

${indent(renderFrontNavigation(front.navigationLabel), 2)}
</section>`;
}

function renderInformationTab({
  id,
  key,
  panel,
  label,
  selected
}) {
  return `<button
  id="${id}"
  type="button"
  role="tab"
  data-showroom-information-tab
  data-information-tab-id="${key}"
  aria-selected="${selected ? "true" : "false"}"
  aria-controls="${panel}"
  tabindex="${selected ? "0" : "-1"}"
>
  ${text(label)}
</button>`;
}

function renderInformationSummary(title, description) {
  return `<div class="showroom-information-summary">
  <strong>
    ${text(title)}
  </strong>

  <p>
    ${text(description)}
  </p>
</div>`;
}

function renderPlatformPanel() {
  const panel = CONTENT.fronts.information.platform;

  return `<div
  id="platform-panel"
  class="showroom-information-panel"
  role="tabpanel"
  data-showroom-information-panel
  data-information-panel-id="platform"
  aria-labelledby="platform-tab"
>
${indent(
  renderInformationSummary(panel.summaryTitle, panel.summary),
  2
)}

  <div class="drop-grid">
${indent(renderDisclosures(panel.disclosures), 4)}
  </div>
</div>`;
}

function renderEngineeringPanel() {
  const panel = CONTENT.fronts.information.engineering;

  return `<div
  id="engineering-panel"
  class="showroom-information-panel"
  role="tabpanel"
  data-showroom-information-panel
  data-information-panel-id="engineering"
  aria-labelledby="engineering-tab"
  hidden
>
${indent(
  renderInformationSummary(panel.summaryTitle, panel.summary),
  2
)}

  <div class="drop-grid">
${indent(renderDisclosures(panel.disclosures), 4)}
  </div>

  <div class="construction-access">
    <div>
      <strong>
        ${text(panel.constructionRecord.title)}
      </strong>

      <p>
        ${text(panel.constructionRecord.description)}
      </p>
    </div>

    <button
      class="button button-gold"
      type="button"
      data-open-construction-record
      aria-haspopup="dialog"
      aria-controls="construction-record-dialog"
    >
      ${text(panel.constructionRecord.actionLabel)}
    </button>
  </div>
</div>`;
}

function renderEvidencePanel() {
  const panel = CONTENT.fronts.information.evidence;

  const statuses = panel.statuses
    .map((status) => {
      const state =
        status.state === "Implemented"
          ? "implemented"
          : status.state === "Not Claimed"
            ? "not-claimed"
            : "not-authorized";

      return `<article data-evidence-state="${state}">
  <span>${text(status.label)}</span>
  <strong>${text(status.state)}</strong>
</article>`;
    })
    .join("\n\n");

  return `<div
  id="evidence-panel"
  class="showroom-information-panel"
  role="tabpanel"
  data-showroom-information-panel
  data-information-panel-id="evidence"
  aria-labelledby="evidence-tab"
  hidden
>
${indent(
  renderInformationSummary(panel.summaryTitle, panel.summary),
  2
)}

  <div
    class="showroom-evidence-statuses"
    aria-label="${text(panel.statusLabel)}"
  >
${indent(statuses, 4)}
  </div>

  <div class="drop-grid">
${indent(renderDisclosures(panel.disclosures), 4)}
  </div>
</div>`;
}

function renderFrontHost() {
  return `<div
  class="showroom-front-host"
  data-showroom-front-host
  aria-live="polite"
>
${indent(
  joinBlocks([
    renderObjectFront(),
    renderStructureFront(),
    renderInteractionFront(),
    renderSystemsFront(),
    renderInformationFront()
  ]),
  2
)}
</div>`;
}

function renderFooter() {
  return `<footer class="showroom-footer">
  <div>
    <strong>
      ${text(CONTENT.footer.title)}
    </strong>

    <span>
      ${text(CONTENT.footer.description)}
    </span>
  </div>

  <nav aria-label="${text(CONTENT.footer.navigationLabel)}">
    <a href="/elara/index.html">
      ${text(CONTENT.footer.links.elara)}
    </a>

    <a href="/index.html">
      ${text(CONTENT.footer.links.mainCompass)}
    </a>
  </nav>
</footer>`;
}

function renderReceipts() {
  return [
    "controller",
    "controller-validation",
    "gauges",
    "interactions",
    "compositor",
    "crystals",
    "window"
  ]
    .map((key) => {
      const attribute =
        key === "controller-validation"
          ? "data-showroom-controller-validation"
          : `data-showroom-${key}-receipt`;

      return `<output
  ${attribute}
  hidden
></output>`;
    })
    .join("\n\n");
}

function renderRoot() {
  return `<div
  class="shell showroom-shell"
  data-showroom-root
  data-showroom-state="orbit"
  data-showroom-presentation-mode="orbit"
  data-showroom-active-cluster=""
  data-showroom-active-front=""
  data-showroom-active-gauge-set=""
  data-showroom-active-information-tab=""
  data-showroom-route-dialog-open="false"
  data-showroom-compass-dialog-open="false"
  data-showroom-window-state="closed"
  data-showroom-diamond-interactive="false"
  data-showroom-crystals-ready="false"
  data-showroom-held="false"
>
${indent(renderHeader(), 2)}

  <main id="main">
${indent(
  joinBlocks([
    renderThreshold(),
    renderInstructions(),
    renderOrbit(),
    renderFrontHost()
  ]),
  4
)}
  </main>

${indent(renderFooter(), 2)}

${indent(renderReceipts(), 2)}
</div>`;
}

function renderRouteDialog() {
  const dialog = CONTENT.dialogs.route;

  return `<dialog
  id="showroom-route-dialog"
  class="showroom-route-dialog"
  data-showroom-route-dialog
  aria-labelledby="showroom-route-dialog-title"
  aria-describedby="showroom-route-dialog-description"
>
  <div class="dialog-shell">
    <div class="dialog-header">
      <div class="dialog-title">
        <span>
          ${text(dialog.eyebrow)}
        </span>

        <h2
          id="showroom-route-dialog-title"
          data-showroom-route-dialog-title
        >
          ${text(dialog.defaultTitle)}
        </h2>
      </div>

      <button
        class="dialog-close"
        type="button"
        data-showroom-route-close
        aria-label="${text(dialog.closeLabel)}"
      >
        ×
      </button>
    </div>

    <p
      id="showroom-route-dialog-description"
      data-showroom-route-dialog-description
    >
      ${text(dialog.defaultDescription)}
    </p>

    <div class="showroom-route-dialog__choices">
      <button
        class="button button-gold"
        type="button"
        data-showroom-route-stay
      >
        ${text(dialog.stayLabel)}
      </button>

      <a
        class="button"
        href="/index.html"
        data-showroom-route-continue
      >
        ${text(dialog.continueLabel)}
      </a>
    </div>
  </div>
</dialog>`;
}

function renderCompassDialog() {
  const dialog = CONTENT.dialogs.compass;

  return `<dialog
  id="showroom-compass-dialog"
  class="showroom-compass-dialog"
  data-showroom-compass-dialog
  data-showroom-controller-surface="compass-return-dialog"
  data-showroom-dialog-state="closed"
  aria-labelledby="showroom-compass-dialog-title"
  aria-describedby="showroom-compass-dialog-description"
>
  <div class="dialog-shell">
    <div class="dialog-header">
      <div class="dialog-title">
        <span>
          ${text(dialog.eyebrow)}
        </span>

        <h2 id="showroom-compass-dialog-title">
          ${text(dialog.title)}
        </h2>
      </div>

      <button
        class="dialog-close"
        type="button"
        data-showroom-compass-close
        data-showroom-controller-action="close-compass-return-dialog"
        aria-label="${text(dialog.closeLabel)}"
      >
        ×
      </button>
    </div>

    <p id="showroom-compass-dialog-description">
      ${text(dialog.description)}
    </p>

    <div class="showroom-compass-dialog__choices">
      <button
        class="button button-gold"
        type="button"
        data-showroom-compass-stay
        data-showroom-controller-action="stay-in-showroom"
      >
        ${text(dialog.stayLabel)}
      </button>

      <a
        class="button"
        href="/index.html"
        data-showroom-compass-return
        data-showroom-controller-action="return-to-main-compass"
        data-showroom-hard-navigation="true"
      >
        ${text(dialog.returnLabel)}
      </a>
    </div>
  </div>
</dialog>`;
}

function renderConstructionDialog() {
  const dialog = CONTENT.dialogs.construction;

  const records = dialog.records
    .map(
      (record) => `<article class="construction-record">
  <strong>${text(record.value)}</strong>
  <span>${text(record.label)}</span>
</article>`
    )
    .join("\n\n");

  return `<dialog
  id="construction-record-dialog"
  aria-labelledby="construction-dialog-title"
>
  <div class="dialog-shell">
    <div class="dialog-header">
      <div class="dialog-title">
        <span>
          ${text(dialog.eyebrow)}
        </span>

        <h2 id="construction-dialog-title">
          ${text(dialog.title)}
        </h2>
      </div>

      <button
        class="dialog-close"
        type="button"
        data-close-construction-record
        aria-label="${text(dialog.closeLabel)}"
      >
        ×
      </button>
    </div>

    <div class="construction-grid">
${indent(records, 6)}
    </div>

    <div class="construction-details">
${indent(renderDisclosures(dialog.disclosures), 6)}
    </div>

    <div class="actions">
      <button
        class="button button-gold"
        type="button"
        data-close-construction-record
      >
        ${text(dialog.returnLabel)}
      </button>
    </div>
  </div>
</dialog>`;
}

function renderScripts() {
  return `<script
  src="/showroom/index.controller.js?v=SHOWROOM_MIRRORLAND_FOCAL_CONTROLLER_TNT_v4"
  defer
  data-showroom-child="controller"
></script>

<script
  src="/showroom/index.gauges.js?v=SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2"
  defer
  data-showroom-child="gauges"
></script>

<script
  src="/assets/compass/compass.geometry.js"
  defer
  data-showroom-compass-child="geometry"
></script>

<script
  src="/assets/compass/compass.renderer.js"
  defer
  data-showroom-compass-child="renderer"
></script>

<script
  src="/showroom/index.diamond.geometry.js?v=SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1"
  defer
  data-showroom-diamond-g3-child="geometry"
></script>

<script
  src="/showroom/index.diamond.js?v=SHOWROOM_DIAMOND_G3_NATIVE_WEBGL_OBJECT_LATTICE_RENDERER_TNT_v1"
  defer
  data-showroom-diamond-g3-child="renderer"
></script>

<script
  src="/showroom/index.compositor.js?v=SHOWROOM_COMPASS_CENTERED_DEPTH_COMPOSITOR_TNT_v1"
  defer
  data-showroom-child="compositor"
></script>

<script
  src="/showroom/index.crystals.js?v=SHOWROOM_MIRRORLAND_CONSTELLATION_CRYSTALS_TNT_v3"
  defer
  data-showroom-child="crystals"
></script>

<script
  src="/showroom/index.window.js?v=SHOWROOM_MIRRORLAND_FOREGROUND_WINDOW_TNT_v1"
  defer
  data-showroom-child="window"
></script>

<script
  src="/showroom/index.interactions.js?v=SHOWROOM_CONSTELLATION_POINTER_GESTURE_INTERPRETER_TNT_v2"
  defer
  data-showroom-child="interactions"
></script>

<script
  src="/showroom/index.ui.js?v=SHOWROOM_DIAMOND_G3_OBJECT_LATTICE_UI_CONTROLLER_TNT_v1"
  defer
  data-showroom-diamond-g3-child="ui"
></script>

<script
  src="/assets/manor-blueprint/manor.blueprint.registry.js?v=MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_REGISTRY_TNT_v1"
  defer
  data-mirrorland-blueprint-marker="true"
  data-blueprint-page-scoped="true"
></script>

<script
  src="/assets/manor-blueprint/manor.blueprint.js?v=MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_RUNTIME_TNT_v1"
  defer
  data-mirrorland-blueprint-marker="true"
  data-blueprint-page-scoped="true"
></script>

<script
  src="/assets/elara/elara.room-entry.js?v=ELARA_ROOM_ENTRY_ISOLATED_HARD_NAVIGATION_ASSET_TNT_v1"
  defer
  data-elara-room-entry-asset="true"
></script>`;
}

function renderHtml() {
  validateContent();

  const body = joinBlocks([
    `<a
  class="skip"
  href="#main"
>
  ${text(CONTENT.document.skipLink)}
</a>`,

    renderRoot(),
    renderRouteDialog(),
    renderCompassDialog(),
    renderConstructionDialog(),
    renderScripts()
  ]);

  return `<!-- TARGET FILE: /showroom/index.html -->
<!-- GENERATED FILE: DO NOT HAND-EDIT -->
<!-- GENERATED BY: ${BUILD.id} -->
<!-- CONTENT SOURCE: ${CONTENT.identity.sourceId} -->
<!-- ${BUILD.htmlContract} -->
<!doctype html>
<html
  ${renderDocumentAttributes()}
>
${renderHead()}

<body>
${indent(body, 2)}
</body>
</html>
`;
}

function verifyGeneratedHtml(html) {
  const requiredFragments = [
    `data-contract="${BUILD.htmlContract}"`,
    `id="showroom-instructions-disclosure"`,
    `data-showroom-open-instructions`,
    `data-showroom-orbit-field`,
    `data-showroom-compass-control`,
    `data-showroom-front-host`,
    `data-showroom-diamond-stage`,
    `data-showroom-window-control`,
    `data-showroom-route-dialog`,
    `data-showroom-compass-dialog`,
    `id="construction-record-dialog"`,
    `data-showroom-controller-receipt`,
    `index.controller.js?v=SHOWROOM_MIRRORLAND_FOCAL_CONTROLLER_TNT_v4`,
    `index.compositor.js?v=SHOWROOM_COMPASS_CENTERED_DEPTH_COMPOSITOR_TNT_v1`,
    `index.crystals.js?v=SHOWROOM_MIRRORLAND_CONSTELLATION_CRYSTALS_TNT_v3`,
    `index.interactions.js?v=SHOWROOM_CONSTELLATION_POINTER_GESTURE_INTERPRETER_TNT_v2`
  ];

  requiredFragments.forEach((fragment) => {
    if (!html.includes(fragment)) {
      fail(`Generated HTML is missing required fragment: ${fragment}`);
    }
  });

  const forbiddenFragments = [
    "<script src=\"/showroom/index.content.js",
    "<script src=\"/showroom/index.build.js",
    "fetch(\"/showroom/index.content",
    "innerHTML ="
  ];

  forbiddenFragments.forEach((fragment) => {
    if (html.includes(fragment)) {
      fail(`Generated HTML contains forbidden fragment: ${fragment}`);
    }
  });

  const dependencyOrder = [
    "index.controller.js",
    "index.gauges.js",
    "compass.geometry.js",
    "compass.renderer.js",
    "index.diamond.geometry.js",
    "index.diamond.js",
    "index.compositor.js",
    "index.crystals.js",
    "index.window.js",
    "index.interactions.js",
    "index.ui.js",
    "manor.blueprint.registry.js",
    "manor.blueprint.js",
    "elara.room-entry.js"
  ];

  let previousIndex = -1;

  dependencyOrder.forEach((filename) => {
    const currentIndex = html.indexOf(filename);

    if (currentIndex === -1) {
      fail(`Generated HTML is missing dependency "${filename}".`);
    }

    if (currentIndex <= previousIndex) {
      fail(
        `Dependency order drift detected at "${filename}".`
      );
    }

    previousIndex = currentIndex;
  });

  const requiredUniqueIds = [
    "main",
    "arrival",
    "page-title",
    "mirrorland-preface",
    "showroom-instructions",
    "showroom-instructions-disclosure",
    "showroom-orbit",
    "showroom-orbit-title",
    "showroom-cluster-gauges",
    "showroom-cluster-information",
    "object-gauges",
    "structure-gauges",
    "interaction-gauges",
    "systems-gauges",
    "information-front",
    "showroom-route-dialog",
    "showroom-compass-dialog",
    "construction-record-dialog"
  ];

  requiredUniqueIds.forEach((id) => {
    const expression = new RegExp(
      `\\bid="${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
      "g"
    );

    const matches = html.match(expression) || [];

    if (matches.length !== 1) {
      fail(
        `Expected exactly one id="${id}", found ${matches.length}.`
      );
    }
  });
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n?/g, "\n");
}

function build() {
  const outputPath = path.join(
    __dirname,
    BUILD.outputFilename
  );

  const generated = normalizeLineEndings(renderHtml());

  verifyGeneratedHtml(generated);

  const checkOnly = process.argv.includes("--check");

  if (checkOnly) {
    if (!fs.existsSync(outputPath)) {
      fail(
        `Cannot check ${outputPath}; the generated file does not exist.`
      );
    }

    const existing = normalizeLineEndings(
      fs.readFileSync(outputPath, "utf8")
    );

    if (existing !== generated) {
      fail(
        `${BUILD.outputFilename} is out of date. Run "node /showroom/index.build.js".`
      );
    }

    process.stdout.write(
      `${BUILD.outputFilename} matches ${BUILD.id} and ${CONTENT.identity.sourceId}.\n`
    );

    return;
  }

  fs.writeFileSync(outputPath, generated, {
    encoding: "utf8",
    flag: "w"
  });

  process.stdout.write(
    `Generated ${outputPath}\n` +
      `Build: ${BUILD.id}\n` +
      `Content: ${CONTENT.identity.sourceId}\n` +
      `HTML: ${BUILD.htmlContract}\n`
  );
}

try {
  build();
} catch (error) {
  const message =
    error instanceof Error
      ? error.stack || error.message
      : String(error);

  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
