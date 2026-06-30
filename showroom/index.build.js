/* TARGET FILE: /showroom/index.build.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_STRUCTURAL_ASSEMBLER_TNT_v2 */

/*
  Browser-side structural assembler.

  Responsibility:
  - Consume /showroom/index.content.js.
  - Bind authored text into existing HTML slots.
  - Assemble repeated structural collections into declared mounts.
  - Preserve runtime-facing IDs, classes, data attributes, ARIA
    relationships, and semantic controls.
  - Validate the content and mount contracts before runtime modules begin.
  - Publish a bounded build receipt.

  This file does not own:
  - Authored narrative or explanatory language.
  - The document shell.
  - Stylesheet declarations.
  - Runtime script dependency declarations.
  - Page-state control.
  - Pointer or gesture interpretation.
  - Orbit projection or crystal rendering.
  - Gauge interaction behavior.
  - Window behavior.
  - Diamond geometry, rendering, or interaction.
  - Navigation decisions.

  Required execution order:
  1. index.content.js
  2. index.build.js
  3. controller and all remaining runtime modules

  Required HTML contract:
  - The document shell and unique structural surfaces remain in index.html.
  - Repeated collections expose the mounts declared in MOUNTS.
  - Simple content slots use data-showroom-content.
  - Attribute-bound content slots use data-showroom-content-attr.
*/

(() => {
  "use strict";

  const ASSEMBLER_ID =
    "SHOWROOM_MIRRORLAND_STRUCTURAL_ASSEMBLER_TNT_v2";

  const ASSEMBLER_VERSION = "2.0.0";

  const CONTENT_CONTRACT =
    "SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1";

  const ROOT_SELECTOR = "[data-showroom-root]";

  const RECEIPT_SELECTOR = "[data-showroom-build-receipt]";

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

  const MOUNTS = Object.freeze({
    fallbackNavigation:
      '[data-showroom-build-mount="fallback-navigation"]',

    prefaceSections:
      '[data-showroom-build-mount="preface-sections"]',

    instructionSteps:
      '[data-showroom-build-mount="instruction-steps"]',

    quickGuideSteps:
      '[data-showroom-build-mount="quick-guide-steps"]',

    primaryStars:
      '[data-showroom-build-mount="primary-stars"]',

    gaugeStars:
      '[data-showroom-build-mount="gauge-stars"]',

    informationStars:
      '[data-showroom-build-mount="information-stars"]',

    objectGaugeSelectors:
      '[data-showroom-build-mount="object-gauge-selectors"]',

    objectGaugeDetails:
      '[data-showroom-build-mount="object-gauge-details"]',

    structureGaugeSelectors:
      '[data-showroom-build-mount="structure-gauge-selectors"]',

    structureGaugeDetails:
      '[data-showroom-build-mount="structure-gauge-details"]',

    compositionRegions:
      '[data-showroom-build-mount="composition-regions"]',

    interactionGaugeSelectors:
      '[data-showroom-build-mount="interaction-gauge-selectors"]',

    interactionGaugeDetails:
      '[data-showroom-build-mount="interaction-gauge-details"]',

    systemsGaugeSelectors:
      '[data-showroom-build-mount="systems-gauge-selectors"]',

    systemsGaugeDetails:
      '[data-showroom-build-mount="systems-gauge-details"]',

    platformDisclosures:
      '[data-showroom-build-mount="platform-disclosures"]',

    engineeringDisclosures:
      '[data-showroom-build-mount="engineering-disclosures"]',

    evidenceStatuses:
      '[data-showroom-build-mount="evidence-statuses"]',

    evidenceDisclosures:
      '[data-showroom-build-mount="evidence-disclosures"]',

    constructionRecords:
      '[data-showroom-build-mount="construction-records"]',

    constructionDisclosures:
      '[data-showroom-build-mount="construction-disclosures"]'
  });

  const GAUGE_STRUCTURE = Object.freeze({
    object: Object.freeze({
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
    }),

    structure: Object.freeze({
      radialSectors: Object.freeze({
        id: "radial-sectors",
        family: "metric",
        value: "16",
        state: "fixed"
      }),

      structuralBands: Object.freeze({
        id: "structural-bands",
        family: "metric",
        value: "16",
        state: "fixed"
      }),

      addressableSeats: Object.freeze({
        id: "addressable-seats",
        family: "metric",
        value: "256",
        state: "fixed"
      }),

      surfaceTriangles: Object.freeze({
        id: "surface-triangles",
        family: "metric",
        value: "512",
        state: "fixed"
      }),

      latticeConnections: Object.freeze({
        id: "lattice-connections",
        family: "metric",
        value: "800",
        state: "fixed"
      }),

      materialRegions: Object.freeze({
        id: "material-regions",
        family: "metric",
        value: "14",
        state: "fixed"
      })
    }),

    interaction: Object.freeze({
      pointer: Object.freeze({
        id: "pointer",
        family: "capability",
        state: "supported"
      }),

      touch: Object.freeze({
        id: "touch",
        family: "capability",
        state: "supported"
      }),

      pinchZoom: Object.freeze({
        id: "pinch-zoom",
        family: "capability",
        state: "supported"
      }),

      wheelZoom: Object.freeze({
        id: "wheel-zoom",
        family: "capability",
        state: "supported"
      }),

      keyboard: Object.freeze({
        id: "keyboard",
        family: "capability",
        state: "supported"
      }),

      inspection: Object.freeze({
        id: "inspection",
        family: "capability",
        state: "supported"
      }),

      reset: Object.freeze({
        id: "reset",
        family: "capability",
        state: "supported"
      }),

      reducedMotion: Object.freeze({
        id: "reduced-motion",
        family: "capability",
        state: "supported"
      }),

      responsive: Object.freeze({
        id: "responsive",
        family: "capability",
        state: "supported"
      }),

      fallback: Object.freeze({
        id: "fallback",
        family: "capability",
        state: "fallback"
      })
    }),

    systems: Object.freeze({
      narrativeEnvironment: Object.freeze({
        id: "narrative-environment",
        family: "state",
        state: "implemented"
      }),

      characterPaths: Object.freeze({
        id: "character-paths",
        family: "state",
        state: "available"
      }),

      frontierSciences: Object.freeze({
        id: "frontier-sciences",
        family: "state",
        state: "planned"
      }),

      simulationSystems: Object.freeze({
        id: "simulation-systems",
        family: "state",
        state: "planned"
      }),

      worldImpact: Object.freeze({
        id: "world-impact",
        family: "state",
        state: "research"
      })
    })
  });

  const REQUIRED_CONTENT_PATHS = Object.freeze([
    "identity.sourceId",
    "identity.sourceVersion",
    "identity.language",
    "document.title",
    "document.description",
    "header.guide.groups",
    "threshold.preface.sections",
    "instructions.steps",
    "orbit.quickGuide.steps",
    "constellation.routes",
    "constellation.clusters",
    "constellation.destinations",
    "fronts.object.gauges",
    "fronts.structure.gauges",
    "fronts.structure.composition.regions",
    "fronts.interaction.gauges",
    "fronts.systems.gauges",
    "fronts.information.platform.disclosures",
    "fronts.information.engineering.disclosures",
    "fronts.information.evidence.statuses",
    "fronts.information.evidence.disclosures",
    "dialogs.construction.records",
    "dialogs.construction.disclosures"
  ]);

  let state = Object.freeze({
    initialized: false,
    failed: false,
    contentBindings: 0,
    mountsBuilt: 0
  });

  function fail(message) {
    throw new Error(`[${ASSEMBLER_ID}] ${message}`);
  }

  function isObject(value) {
    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    );
  }

  function assertObject(value, label) {
    if (!isObject(value)) {
      fail(`${label} must be an object.`);
    }
  }

  function assertArray(value, label) {
    if (!Array.isArray(value)) {
      fail(`${label} must be an array.`);
    }
  }

  function assertString(value, label) {
    if (
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      fail(`${label} must be a non-empty string.`);
    }
  }

  function assertUniqueKeys(items, label) {
    assertArray(items, label);

    const seen = new Set();

    items.forEach((item, index) => {
      assertObject(item, `${label}[${index}]`);
      assertString(item.key, `${label}[${index}].key`);

      if (seen.has(item.key)) {
        fail(`${label} contains duplicate key "${item.key}".`);
      }

      seen.add(item.key);
    });
  }

  function getContentSource() {
    if (
      typeof SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1 !==
      "undefined"
    ) {
      return SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1;
    }

    if (
      typeof globalThis !== "undefined" &&
      globalThis
        .SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1
    ) {
      return globalThis
        .SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1;
    }

    fail(
      "The content source is unavailable. Load index.content.js before index.build.js."
    );
  }

  function readPath(source, path) {
    const segments = path.split(".");
    let cursor = source;

    for (const segment of segments) {
      if (
        cursor === null ||
        cursor === undefined ||
        !Object.prototype.hasOwnProperty.call(cursor, segment)
      ) {
        fail(`Missing content path "${path}".`);
      }

      cursor = cursor[segment];
    }

    return cursor;
  }

  function validateContent(content) {
    assertObject(content, "Content source");
    assertObject(content.identity, "content.identity");

    if (content.identity.sourceId !== CONTENT_CONTRACT) {
      fail(
        `Content contract mismatch. Expected "${CONTENT_CONTRACT}", received "${String(
          content.identity.sourceId
        )}".`
      );
    }

    REQUIRED_CONTENT_PATHS.forEach((path) => {
      readPath(content, path);
    });

    assertUniqueKeys(
      content.threshold.preface.sections,
      "content.threshold.preface.sections"
    );

    assertUniqueKeys(
      content.instructions.steps,
      "content.instructions.steps"
    );

    assertUniqueKeys(
      content.fronts.object.gauges,
      "content.fronts.object.gauges"
    );

    assertUniqueKeys(
      content.fronts.structure.gauges,
      "content.fronts.structure.gauges"
    );

    assertUniqueKeys(
      content.fronts.structure.composition.regions,
      "content.fronts.structure.composition.regions"
    );

    assertUniqueKeys(
      content.fronts.interaction.gauges,
      "content.fronts.interaction.gauges"
    );

    assertUniqueKeys(
      content.fronts.systems.gauges,
      "content.fronts.systems.gauges"
    );

    assertUniqueKeys(
      content.fronts.information.platform.disclosures,
      "content.fronts.information.platform.disclosures"
    );

    assertUniqueKeys(
      content.fronts.information.engineering.disclosures,
      "content.fronts.information.engineering.disclosures"
    );

    assertUniqueKeys(
      content.fronts.information.evidence.disclosures,
      "content.fronts.information.evidence.disclosures"
    );

    assertUniqueKeys(
      content.dialogs.construction.disclosures,
      "content.dialogs.construction.disclosures"
    );

    validateGaugeKeys(
      content.fronts.object.gauges,
      GAUGE_STRUCTURE.object,
      "object"
    );

    validateGaugeKeys(
      content.fronts.structure.gauges,
      GAUGE_STRUCTURE.structure,
      "structure"
    );

    validateGaugeKeys(
      content.fronts.interaction.gauges,
      GAUGE_STRUCTURE.interaction,
      "interaction"
    );

    validateGaugeKeys(
      content.fronts.systems.gauges,
      GAUGE_STRUCTURE.systems,
      "systems"
    );
  }

  function validateGaugeKeys(gauges, structure, label) {
    const expected = Object.keys(structure);
    const actual = gauges.map((gauge) => gauge.key);

    if (
      actual.length !== expected.length ||
      actual.some((key, index) => key !== expected[index])
    ) {
      fail(
        `${label} gauge order mismatch. Expected "${expected.join(
          ", "
        )}", received "${actual.join(", ")}".`
      );
    }
  }

  function getRequiredRoot() {
    const root = document.querySelector(ROOT_SELECTOR);

    if (!root) {
      fail(`Missing required root "${ROOT_SELECTOR}".`);
    }

    return root;
  }

  function getRequiredMount(root, selector) {
    const mount = root.querySelector(selector);

    if (!mount) {
      fail(`Missing required build mount "${selector}".`);
    }

    return mount;
  }

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function appendChildren(parent, children) {
    children.forEach((child) => {
      if (child !== null && child !== undefined) {
        parent.append(child);
      }
    });

    return parent;
  }

  function element(tagName, options = {}) {
    const node = document.createElement(tagName);

    if (options.className) {
      node.className = options.className;
    }

    if (options.id) {
      node.id = options.id;
    }

    if (options.text !== undefined) {
      node.textContent = String(options.text);
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(
        ([name, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            value !== false
          ) {
            node.setAttribute(
              name,
              value === true ? "" : String(value)
            );
          }
        }
      );
    }

    if (options.dataset) {
      Object.entries(options.dataset).forEach(
        ([name, value]) => {
          if (value !== null && value !== undefined) {
            node.dataset[name] = String(value);
          }
        }
      );
    }

    if (options.children) {
      appendChildren(node, options.children);
    }

    return node;
  }

  function fragment(children = []) {
    const output = document.createDocumentFragment();
    appendChildren(output, children);
    return output;
  }

  function textNode(value) {
    return document.createTextNode(String(value));
  }

  function bindContentSlots(root, content) {
    let count = 0;

    root
      .querySelectorAll("[data-showroom-content]")
      .forEach((node) => {
        const path = node.getAttribute(
          "data-showroom-content"
        );

        assertString(path, "data-showroom-content");

        const value = readPath(content, path);

        if (
          typeof value !== "string" &&
          typeof value !== "number"
        ) {
          fail(
            `Content slot "${path}" must resolve to a string or number.`
          );
        }

        node.textContent = String(value);
        count += 1;
      });

    root
      .querySelectorAll("[data-showroom-content-attr]")
      .forEach((node) => {
        const declaration = node.getAttribute(
          "data-showroom-content-attr"
        );

        assertString(
          declaration,
          "data-showroom-content-attr"
        );

        declaration
          .split(";")
          .map((entry) => entry.trim())
          .filter(Boolean)
          .forEach((entry) => {
            const separator = entry.indexOf(":");

            if (separator <= 0) {
              fail(
                `Invalid attribute content binding "${entry}". Expected "attribute:path".`
              );
            }

            const attributeName = entry
              .slice(0, separator)
              .trim();

            const path = entry
              .slice(separator + 1)
              .trim();

            assertString(
              attributeName,
              "Bound attribute name"
            );

            assertString(path, "Bound content path");

            const value = readPath(content, path);

            if (
              typeof value !== "string" &&
              typeof value !== "number"
            ) {
              fail(
                `Attribute content path "${path}" must resolve to a string or number.`
              );
            }

            node.setAttribute(attributeName, String(value));
          });

        count += 1;
      });

    return count;
  }

  function buildFallbackNavigation(content) {
    return fragment(
      content.header.guide.groups.map((group) => {
        const links = group.links.map((link) => {
          if (!Object.prototype.hasOwnProperty.call(ROUTES, link.key)) {
            fail(
              `Unknown fallback navigation route key "${link.key}".`
            );
          }

          return element("a", {
            text: link.label,
            attributes: {
              href: ROUTES[link.key]
            }
          });
        });

        return element("div", {
          className: "fallback-navigation__group",
          children: [
            element("strong", {
              text: group.title
            }),
            ...links
          ]
        });
      })
    );
  }

  function buildPrefaceSections(content) {
    return fragment(
      content.threshold.preface.sections.map((section) => {
        const headingId = `mirrorland-preface-${section.key}`;

        return element("section", {
          attributes: {
            "aria-labelledby": headingId
          },
          children: [
            element("span", {
              className: "mirrorland-preface__index",
              text: section.index
            }),

            element("h2", {
              id: headingId,
              text: section.title
            }),

            ...section.paragraphs.map((paragraph) =>
              element("p", {
                text: paragraph
              })
            )
          ]
        });
      })
    );
  }

  function buildInstructionSteps(content) {
    return fragment(
      content.instructions.steps.map((step) => {
        if (
          !Object.prototype.hasOwnProperty.call(
            INSTRUCTION_TARGETS,
            step.key
          )
        ) {
          fail(
            `Unknown instruction target key "${step.key}".`
          );
        }

        const summary = element("summary", {
          children: [
            element("span", {
              text: step.index
            }),

            element("strong", {
              text: step.title
            }),

            element("small", {
              text: step.summary
            })
          ]
        });

        const body = element("div", {
          children: [
            element("p", {
              text: step.description
            }),

            element("a", {
              text: step.actionLabel,
              attributes: {
                href: INSTRUCTION_TARGETS[step.key]
              }
            })
          ]
        });

        return element("details", {
          className: "showroom-instruction",
          attributes: {
            "data-showroom-instruction": true
          },
          children: [summary, body]
        });
      })
    );
  }

  function buildQuickGuideSteps(content) {
    return fragment(
      content.orbit.quickGuide.steps.map((step) =>
        element("li", {
          text: step
        })
      )
    );
  }

  function createRouteStar({
    objectId,
    routeId,
    route,
    content
  }) {
    return element("button", {
      className: "showroom-star showroom-star--large",
      attributes: {
        type: "button",
        "data-showroom-object": true,
        "data-showroom-semantic-star": true,
        "data-showroom-fallback-star": true,
        "data-showroom-object-id": objectId,
        "data-showroom-object-size": "large",
        "data-showroom-object-shape": "cardinal-star",
        "data-showroom-object-behavior": "route",
        "data-showroom-route-id": routeId,
        "data-showroom-route-label": content.label,
        "data-showroom-route": route,
        "data-showroom-route-description":
          content.description,
        "aria-label": content.activationLabel,
        "aria-haspopup": "dialog",
        "aria-controls": "showroom-route-dialog"
      },
      children: [
        element("span", {
          className: "sr-only",
          text: content.label
        })
      ]
    });
  }

  function createClusterStar({
    objectId,
    clusterId,
    controlsId,
    content
  }) {
    return element("button", {
      className: "showroom-star showroom-star--large",
      attributes: {
        type: "button",
        "data-showroom-object": true,
        "data-showroom-semantic-star": true,
        "data-showroom-fallback-star": true,
        "data-showroom-object-id": objectId,
        "data-showroom-object-size": "large",
        "data-showroom-object-shape": "cardinal-star",
        "data-showroom-object-behavior": "cluster",
        "data-showroom-cluster-id": clusterId,
        "aria-label": content.activationLabel,
        "aria-expanded": "false",
        "aria-controls": controlsId
      },
      children: [
        element("span", {
          className: "sr-only",
          text: content.label
        })
      ]
    });
  }

  function buildPrimaryStars(content) {
    const routes = content.constellation.routes;
    const clusters = content.constellation.clusters;

    return fragment([
      createRouteStar({
        objectId: "characters-route",
        routeId: "characters",
        route: "/characters/",
        content: routes.characters
      }),

      createRouteStar({
        objectId: "elara-route",
        routeId: "elara",
        route: "/elara/index.html",
        content: routes.elara
      }),

      createClusterStar({
        objectId: "gauge-cluster",
        clusterId: "gauges",
        controlsId: "showroom-cluster-gauges",
        content: clusters.gauges
      }),

      createClusterStar({
        objectId: "information-cluster",
        clusterId: "information",
        controlsId: "showroom-cluster-information",
        content: clusters.information
      })
    ]);
  }

  function createChildStar({
    className,
    objectId,
    behavior,
    frontId,
    informationTab,
    content
  }) {
    const attributes = {
      type: "button",
      "data-showroom-object": true,
      "data-showroom-semantic-star": true,
      "data-showroom-fallback-star": true,
      "data-showroom-object-id": objectId,
      "data-showroom-object-size": "small",
      "data-showroom-object-shape": "child-star",
      "data-showroom-object-behavior": behavior,
      "data-showroom-front-id": frontId,
      "aria-label": content.activationLabel,
      "aria-controls": frontId
    };

    if (informationTab) {
      attributes["data-showroom-information-tab"] =
        informationTab;
    }

    return element("button", {
      className:
        `showroom-star showroom-star--small ${className}`,
      attributes,
      children: [
        element("span", {
          className: "sr-only",
          text: content.label
        })
      ]
    });
  }

  function buildGaugeStars(content) {
    const destinations =
      content.constellation.destinations;

    return fragment([
      createChildStar({
        className: "showroom-star--gauge",
        objectId: "object-gauge-star",
        behavior: "gauge",
        frontId: "object-gauges",
        content: destinations.objectGauges
      }),

      createChildStar({
        className: "showroom-star--gauge",
        objectId: "structure-gauge-star",
        behavior: "gauge",
        frontId: "structure-gauges",
        content: destinations.structureGauges
      }),

      createChildStar({
        className: "showroom-star--gauge",
        objectId: "interaction-gauge-star",
        behavior: "gauge",
        frontId: "interaction-gauges",
        content: destinations.interactionGauges
      }),

      createChildStar({
        className: "showroom-star--gauge",
        objectId: "systems-gauge-star",
        behavior: "gauge",
        frontId: "systems-gauges",
        content: destinations.systemsGauges
      })
    ]);
  }

  function buildInformationStars(content) {
    const destinations =
      content.constellation.destinations;

    return fragment([
      createChildStar({
        className: "showroom-star--information",
        objectId: "platform-information-star",
        behavior: "information",
        frontId: "information-front",
        informationTab: "platform",
        content: destinations.platformInformation
      }),

      createChildStar({
        className: "showroom-star--information",
        objectId: "engineering-information-star",
        behavior: "information",
        frontId: "information-front",
        informationTab: "engineering",
        content: destinations.engineeringInformation
      }),

      createChildStar({
        className: "showroom-star--information",
        objectId: "evidence-information-star",
        behavior: "information",
        frontId: "information-front",
        informationTab: "evidence",
        content: destinations.evidenceInformation
      })
    ]);
  }

  function createGaugeSelector({
    gauge,
    structure,
    index,
    kind
  }) {
    const detailId = `gauge-detail-${structure.id}`;

    const attributes = {
      type: "button",
      "data-showroom-gauge": true,
      "data-gauge-id": structure.id,
      "data-gauge-family": structure.family,
      "data-gauge-state": structure.state,
      "aria-expanded": index === 0 ? "true" : "false",
      "aria-controls": detailId
    };

    if (structure.value !== undefined) {
      attributes["data-gauge-value"] = structure.value;
      attributes["data-gauge-display-value"] =
        structure.value;
    }

    if (kind === "systems") {
      return element("button", {
        className:
          "showroom-gauge showroom-gauge--status-row",
        attributes,
        children: [
          element("span", {
            text: gauge.label
          }),

          element("strong", {
            text: gauge.state
          })
        ]
      });
    }

    if (kind === "interaction") {
      return element("button", {
        className:
          "showroom-gauge showroom-gauge--capability-compact",
        attributes,
        children: [
          element("strong", {
            text: gauge.primary
          }),

          element("span", {
            text: gauge.label
          })
        ]
      });
    }

    return element("button", {
      className:
        "showroom-gauge showroom-gauge--compact",
      attributes,
      children: [
        element("strong", {
          text: gauge.primary
        }),

        element("span", {
          text: gauge.label
        }),

        element("small", {
          text: gauge.summary
        })
      ]
    });
  }

  function buildGaugeSelectors(content, kind) {
    const gauges = content.fronts[kind].gauges;
    const structure = GAUGE_STRUCTURE[kind];

    return fragment(
      gauges.map((gauge, index) =>
        createGaugeSelector({
          gauge,
          structure: structure[gauge.key],
          index,
          kind
        })
      )
    );
  }

  function buildGaugeDetails(content, kind) {
    const gauges = content.fronts[kind].gauges;
    const structure = GAUGE_STRUCTURE[kind];

    return fragment(
      gauges.map((gauge, index) => {
        const config = structure[gauge.key];

        return element("article", {
          id: `gauge-detail-${config.id}`,
          className: "showroom-gauge-detail",
          attributes: {
            "data-showroom-gauge-detail": true,
            "data-gauge-detail-id": config.id,
            hidden: index === 0 ? false : true
          },
          children: [
            element("h3", {
              text: gauge.detailTitle
            }),

            element("p", {
              text: gauge.detail
            })
          ]
        });
      })
    );
  }

  function buildCompositionRegions(content) {
    return fragment(
      content.fronts.structure.composition.regions.map(
        (region, index) =>
          element("button", {
            attributes: {
              type: "button",
              role: "listitem",
              "data-showroom-composition-region": true,
              "data-region-id": region.key,
              "aria-pressed":
                index === 0 ? "true" : "false"
            },
            children: [
              element("span", {
                text: region.index
              }),

              element("strong", {
                text: region.title
              }),

              element("small", {
                text: region.description
              })
            ]
          })
      )
    );
  }

  function createDisclosure(item) {
    return element("details", {
      className: "architectural-drop",
      children: [
        element("summary", {
          text: item.title
        }),

        element("div", {
          className: "drop-content",
          children: [
            element("p", {
              text: item.description
            })
          ]
        })
      ]
    });
  }

  function buildDisclosures(items) {
    return fragment(items.map(createDisclosure));
  }

  function buildEvidenceStatuses(content) {
    return fragment(
      content.fronts.information.evidence.statuses.map(
        (status) => {
          let evidenceState = "not-authorized";

          if (status.state === "Implemented") {
            evidenceState = "implemented";
          } else if (status.state === "Not Claimed") {
            evidenceState = "not-claimed";
          }

          return element("article", {
            attributes: {
              "data-evidence-state": evidenceState
            },
            children: [
              element("span", {
                text: status.label
              }),

              element("strong", {
                text: status.state
              })
            ]
          });
        }
      )
    );
  }

  function buildConstructionRecords(content) {
    return fragment(
      content.dialogs.construction.records.map((record) =>
        element("article", {
          className: "construction-record",
          children: [
            element("strong", {
              text: record.value
            }),

            element("span", {
              text: record.label
            })
          ]
        })
      )
    );
  }

  function replaceMount(root, selector, output) {
    const mount = getRequiredMount(root, selector);

    clearNode(mount);
    mount.append(output);
    mount.setAttribute("data-showroom-build-state", "ready");

    return 1;
  }

  function assembleRepeatedStructures(root, content) {
    let mountsBuilt = 0;

    mountsBuilt += replaceMount(
      root,
      MOUNTS.fallbackNavigation,
      buildFallbackNavigation(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.prefaceSections,
      buildPrefaceSections(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.instructionSteps,
      buildInstructionSteps(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.quickGuideSteps,
      buildQuickGuideSteps(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.primaryStars,
      buildPrimaryStars(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.gaugeStars,
      buildGaugeStars(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.informationStars,
      buildInformationStars(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.objectGaugeSelectors,
      buildGaugeSelectors(content, "object")
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.objectGaugeDetails,
      buildGaugeDetails(content, "object")
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.structureGaugeSelectors,
      buildGaugeSelectors(content, "structure")
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.structureGaugeDetails,
      buildGaugeDetails(content, "structure")
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.compositionRegions,
      buildCompositionRegions(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.interactionGaugeSelectors,
      buildGaugeSelectors(content, "interaction")
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.interactionGaugeDetails,
      buildGaugeDetails(content, "interaction")
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.systemsGaugeSelectors,
      buildGaugeSelectors(content, "systems")
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.systemsGaugeDetails,
      buildGaugeDetails(content, "systems")
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.platformDisclosures,
      buildDisclosures(
        content.fronts.information.platform.disclosures
      )
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.engineeringDisclosures,
      buildDisclosures(
        content.fronts.information.engineering.disclosures
      )
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.evidenceStatuses,
      buildEvidenceStatuses(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.evidenceDisclosures,
      buildDisclosures(
        content.fronts.information.evidence.disclosures
      )
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.constructionRecords,
      buildConstructionRecords(content)
    );

    mountsBuilt += replaceMount(
      root,
      MOUNTS.constructionDisclosures,
      buildDisclosures(
        content.dialogs.construction.disclosures
      )
    );

    return mountsBuilt;
  }

  function synchronizeInitialContentState(root, content) {
    const firstCompositionRegion =
      content.fronts.structure.composition.regions[0];

    const compositionIndex = root.querySelector(
      "[data-showroom-composition-detail-index]"
    );

    const compositionTitle = root.querySelector(
      "[data-showroom-composition-detail-title]"
    );

    const compositionDescription = root.querySelector(
      "[data-showroom-composition-detail-description]"
    );

    if (
      !compositionIndex ||
      !compositionTitle ||
      !compositionDescription
    ) {
      fail(
        "Missing one or more composition detail surfaces."
      );
    }

    compositionIndex.textContent =
      firstCompositionRegion.index;

    compositionTitle.textContent =
      firstCompositionRegion.title;

    compositionDescription.textContent =
      firstCompositionRegion.description;

    const routeDialogTitle = root.ownerDocument.querySelector(
      "[data-showroom-route-dialog-title]"
    );

    const routeDialogDescription =
      root.ownerDocument.querySelector(
        "[data-showroom-route-dialog-description]"
      );

    if (routeDialogTitle) {
      routeDialogTitle.textContent =
        content.dialogs.route.defaultTitle;
    }

    if (routeDialogDescription) {
      routeDialogDescription.textContent =
        content.dialogs.route.defaultDescription;
    }
  }

  function verifyRuntimeContract(root) {
    const requiredSelectors = [
      "[data-showroom-orbit-field]",
      "[data-showroom-compass-control]",
      "[data-upstream-compass-mount]",
      "[data-showroom-front-host]",
      "[data-showroom-diamond-stage]",
      "[data-showroom-diamond-canvas]",
      "[data-showroom-window-control]",
      "[data-showroom-window-mount]",
      "[data-showroom-route-dialog]",
      "[data-showroom-compass-dialog]",
      "[data-showroom-controller-receipt]",
      "[data-showroom-gauges-receipt]",
      "[data-showroom-interactions-receipt]",
      "[data-showroom-compositor-receipt]",
      "[data-showroom-crystals-receipt]",
      "[data-showroom-window-receipt]"
    ];

    requiredSelectors.forEach((selector) => {
      const scope =
        selector.includes("dialog")
          ? root.ownerDocument
          : root;

      if (!scope.querySelector(selector)) {
        fail(
          `Runtime contract surface "${selector}" is missing.`
        );
      }
    });

    const uniqueIds = [
      "showroom-instructions-disclosure",
      "showroom-orbit",
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

    uniqueIds.forEach((id) => {
      const matches =
        root.ownerDocument.querySelectorAll(
          `#${CSS.escape(id)}`
        );

      if (matches.length !== 1) {
        fail(
          `Expected exactly one element with id="${id}", found ${matches.length}.`
        );
      }
    });
  }

  function publishReceipt(root, result) {
    const receipt =
      root.querySelector(RECEIPT_SELECTOR) ||
      root.ownerDocument.querySelector(RECEIPT_SELECTOR);

    const payload = Object.freeze({
      assemblerId: ASSEMBLER_ID,
      assemblerVersion: ASSEMBLER_VERSION,
      contentContract: CONTENT_CONTRACT,
      contentSourceId: result.contentSourceId,
      contentSourceVersion: result.contentSourceVersion,
      initialized: true,
      failed: false,
      contentBindings: result.contentBindings,
      mountsBuilt: result.mountsBuilt,
      runtimeContractVerified: true,
      timestamp: new Date().toISOString()
    });

    root.dataset.showroomBuildState = "ready";
    root.dataset.showroomBuildAssembler = ASSEMBLER_ID;
    root.dataset.showroomBuildContent =
      result.contentSourceId;

    if (receipt) {
      receipt.value = JSON.stringify(payload);
      receipt.textContent = JSON.stringify(payload);
      receipt.dataset.showroomReceiptState = "ready";
    }

    globalThis.SHOWROOM_MIRRORLAND_BUILD_RECEIPT_TNT_v2 =
      payload;

    return payload;
  }

  function publishFailure(error) {
    const root = document.querySelector(ROOT_SELECTOR);
    const receipt = document.querySelector(RECEIPT_SELECTOR);

    const payload = Object.freeze({
      assemblerId: ASSEMBLER_ID,
      assemblerVersion: ASSEMBLER_VERSION,
      contentContract: CONTENT_CONTRACT,
      initialized: false,
      failed: true,
      error:
        error instanceof Error
          ? error.message
          : String(error),
      timestamp: new Date().toISOString()
    });

    if (root) {
      root.dataset.showroomBuildState = "failed";
      root.dataset.showroomBuildAssembler = ASSEMBLER_ID;
    }

    if (receipt) {
      receipt.value = JSON.stringify(payload);
      receipt.textContent = JSON.stringify(payload);
      receipt.dataset.showroomReceiptState = "failed";
    }

    globalThis.SHOWROOM_MIRRORLAND_BUILD_RECEIPT_TNT_v2 =
      payload;

    return payload;
  }

  function initialize() {
    if (state.initialized) {
      return globalThis
        .SHOWROOM_MIRRORLAND_BUILD_RECEIPT_TNT_v2;
    }

    const content = getContentSource();
    validateContent(content);

    const root = getRequiredRoot();

    root.dataset.showroomBuildState = "building";
    root.dataset.showroomBuildAssembler = ASSEMBLER_ID;

    const contentBindings = bindContentSlots(
      root.ownerDocument,
      content
    );

    const mountsBuilt = assembleRepeatedStructures(
      root,
      content
    );

    synchronizeInitialContentState(root, content);
    verifyRuntimeContract(root);

    state = Object.freeze({
      initialized: true,
      failed: false,
      contentBindings,
      mountsBuilt
    });

    return publishReceipt(root, {
      contentSourceId: content.identity.sourceId,
      contentSourceVersion:
        content.identity.sourceVersion,
      contentBindings,
      mountsBuilt
    });
  }

  function getState() {
    return state;
  }

  const API = Object.freeze({
    id: ASSEMBLER_ID,
    version: ASSEMBLER_VERSION,
    contentContract: CONTENT_CONTRACT,
    initialize,
    getState
  });

  globalThis.SHOWROOM_MIRRORLAND_STRUCTURAL_ASSEMBLER_TNT_v2 =
    API;

  try {
    initialize();
  } catch (error) {
    state = Object.freeze({
      initialized: false,
      failed: true,
      contentBindings: 0,
      mountsBuilt: 0
    });

    publishFailure(error);

    console.error(
      `[${ASSEMBLER_ID}] Structural assembly failed.`,
      error
    );
  }
})();
