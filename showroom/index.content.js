/* TARGET FILE: /showroom/index.content.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1 */

/*
  Build-time content source only.

  Ownership:
  - Editable narrative copy.
  - Page titles and descriptions.
  - Headings, labels, instructions, explanatory prose, dialog wording,
    accessibility wording, status wording, and footer wording.

  Prohibited:
  - DOM construction.
  - HTML templates.
  - CSS classes.
  - Runtime selectors.
  - Element IDs.
  - data-* attributes.
  - ARIA relationships.
  - Runtime state.
  - Event behavior.
  - Script dependency order.
  - Browser execution.
  - Client-side injection.
  - Build logic.

  Consumer:
  - /showroom/index.build.js

  Generated output:
  - /showroom/index.html
*/

"use strict";

const SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1 = (() => {
  const freezeArray = (values) =>
    Object.freeze(
      values.map((value) =>
        value && typeof value === "object"
          ? deepFreeze(value)
          : value
      )
    );

  const deepFreeze = (value) => {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) {
      return value;
    }

    if (Array.isArray(value)) {
      return freezeArray(value);
    }

    Object.keys(value).forEach((key) => {
      deepFreeze(value[key]);
    });

    return Object.freeze(value);
  };

  const CONTENT = {
    identity: {
      sourceId:
        "SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1",
      sourceVersion: "1.0.0",
      language: "en",
      roomName: "The Showroom",
      worldName: "Mirrorland",
      narrativeTitle: "The Door to Mirrorland"
    },

    document: {
      title: "Welcome to Mirrorland · The Showroom",
      description:
        "Enter Mirrorland through its official gate, follow its characters and timeline, explore its constellation, open the Window, inspect the Diamond, and enter its gauge and information systems.",
      skipLink: "Skip to the Showroom"
    },

    header: {
      brand: {
        mark: "DG",
        parentTitle: "Shadows Never Shatter",
        roomTitle: "The Showroom",
        returnLabel:
          "Return to the Diamond Gate Bridge Main Compass"
      },

      guide: {
        primaryCharacterLabel: "Talk to Elara",
        fallbackMenuLabel: "Explore without the constellation",

        fallbackNavigationLabel:
          "Showroom semantic fallback",

        groups: [
          {
            title: "Gauge dashboards",
            links: [
              {
                key: "object",
                label: "Object"
              },
              {
                key: "structure",
                label: "Structure"
              },
              {
                key: "interaction",
                label: "Interaction"
              },
              {
                key: "systems",
                label: "Systems"
              }
            ]
          },
          {
            title: "Information front",
            links: [
              {
                key: "platform",
                label: "Platform"
              },
              {
                key: "engineering",
                label: "Engineering"
              },
              {
                key: "evidence",
                label: "Evidence"
              }
            ]
          },
          {
            title: "Other destinations",
            links: [
              {
                key: "characters",
                label: "Meet the Characters"
              },
              {
                key: "mainCompass",
                label: "Main Compass"
              }
            ]
          }
        ]
      }
    },

    threshold: {
      badge: "Official Gate · Mirrorland",
      heading: "Welcome to Mirrorland.",
      subtitle: "Your journey begins in the Showroom.",

      lead:
        "Beyond this threshold is a living world of characters, discoveries, unfinished questions, and systems waiting to be explored.",

      support:
        "The Showroom is where Mirrorland first opens: its mission, its timeline, its inhabitants, and the paths that connect them.",

      thesis: [
        "Every path reveals part of the world.",
        "Every character reveals why it matters."
      ],

      thesisLabel: "Mirrorland threshold statement",

      preface: {
        summary: "Read the complete Mirrorland preface",

        sections: [
          {
            key: "mission",
            index: "01",
            title: "The mission",
            paragraphs: [
              "Mirrorland exists so consequential ideas can be examined before the real world is forced to absorb their consequences.",
              "It is a place where systems can be entered instead of merely described, where assumptions can be exposed, where outcomes can be compared, and where difficult questions can remain visible long enough to be understood."
            ]
          },
          {
            key: "timeline",
            index: "02",
            title: "The timeline",
            paragraphs: [
              "Mirrorland is not presented as a finished universe. It is a world under construction whose rooms, instruments, characters, simulations, and scientific objects become available as they are built.",
              "The Showroom stands at the beginning of that timeline. It introduces what already exists, identifies what is still emerging, and separates implemented systems from planned ones."
            ]
          },
          {
            key: "inhabitants",
            index: "03",
            title: "The inhabitants",
            paragraphs: [
              "Mirrorland is inhabited by characters who guide, interpret, question, remember, and challenge. They are not decorative mascots. Each character represents a different way of entering the world and understanding what its systems mean.",
              "Some paths lead directly to a character. Other paths lead to rooms, instruments, gauges, records, or simulations where those characters may later take part."
            ]
          },
          {
            key: "exploration",
            index: "04",
            title: "The exploration",
            paragraphs: [
              "The constellation is the first navigational field. The Window is a threshold. The Diamond is an inspectable object. The gauges expose structured evidence. The information fronts explain how the world is built and where its claims stop.",
              "No single path contains all of Mirrorland. The world is discovered by moving among its parts."
            ]
          },
          {
            key: "invitation",
            index: "05",
            title: "The invitation",
            paragraphs: [
              "Enter with curiosity. Follow the characters. Open the systems. Inspect what can be inspected. Question what remains unfinished.",
              "A mirror shows what is already there. Mirrorland asks what may happen next."
            ]
          }
        ]
      }
    },

    instructions: {
      badge: "Page Instructions",
      heading: "How to enter the Showroom",
      summary: "Five stages. Open only the guidance you need.",

      introduction:
        "The Showroom contains independent interactive stages. Each reveals a different part of Mirrorland.",

      steps: [
        {
          key: "constellation",
          index: "01",
          title: "Follow the constellation",
          summary: "Move among paths and destinations.",
          description:
            "Drag the star field to move among routes, character paths, gauge clusters, and information destinations.",
          actionLabel: "Go to the constellation"
        },
        {
          key: "window",
          index: "02",
          title: "Open the Window",
          summary: "Reveal the Diamond threshold.",
          description:
            "Use the Mirrorland Window control to open the stained-glass threshold and reveal the Diamond beneath it.",
          actionLabel: "Go to the Window"
        },
        {
          key: "diamond",
          index: "03",
          title: "Inspect the Diamond",
          summary: "Rotate, zoom, compare, and reset.",
          description:
            "Rotate and zoom the gem, switch between Object View and Lattice View, inspect its structure, and reset its presentation.",
          actionLabel: "Go to Diamond controls"
        },
        {
          key: "gaugesAndInformation",
          index: "04",
          title: "Open gauges and information",
          summary: "Use cyan and violet paths.",
          description:
            "Cyan paths open gauge dashboards. Violet paths open the Platform, Engineering, and Evidence information fronts.",
          actionLabel: "Go to the information front"
        },
        {
          key: "compass",
          index: "05",
          title: "Use the Compass",
          summary:
            "Return to the larger navigation system.",
          description:
            "The fixed Main Compass provides an explicit route back to the larger Diamond Gate Bridge navigation system.",
          actionLabel: "Go to the Main Compass"
        }
      ],

      enterLabel: "Enter the Constellation"
    },

    orbit: {
      kicker: "Mirrorland Constellation",
      heading: "Follow the stars.",

      guidance:
        "Drag the constellation to move the field. Large stars reveal routes or unfold clusters. Cyan stars open gauges. Violet stars open information.",

      sceneLabel:
        "Mirrorland constellation surrounding the fixed Main Compass",

      legend: {
        label: "Constellation color key",
        gauge: "Cyan opens gauges",
        information: "Violet opens information"
      },

      compass: {
        label: "Main Compass",
        instruction: "Tap to return",
        controlLabel:
          "Open the option to return to the Main Compass",
        directions: ["N", "E", "S", "W"]
      },

      quickGuide: {
        eyebrow: "Quick Guide",
        heading: "Move. Open. Inspect. Explore. Return.",
        steps: [
          "Move the stars",
          "Open the Window",
          "Inspect the Diamond",
          "Enter gauges or information",
          "Return by Compass"
        ],
        completeInstructionsLabel:
          "Open complete instructions"
      },

      fallback:
        "The constellation is an enhanced navigator. Every destination remains available through the semantic fallback menu."
    },

    constellation: {
      primaryPathsLabel:
        "Primary Mirrorland constellation paths",

      routes: {
        characters: {
          label: "Meet the Characters",
          description:
            "Meet the characters who inhabit and guide Audralia and Mirrorland.",
          activationLabel:
            "Meet the Characters. Opens a destination decision."
        },

        elara: {
          label: "Talk to Elara",
          description:
            "Continue into Elara’s dedicated room and conversation surface.",
          activationLabel:
            "Talk to Elara. Opens a destination decision."
        }
      },

      clusters: {
        gauges: {
          label: "Gauge constellation",
          activationLabel:
            "Open or close the gauge constellation",
          destinationsLabel: "Gauge destinations"
        },

        information: {
          label: "Information constellation",
          activationLabel:
            "Open or close the information constellation",
          destinationsLabel: "Information destinations"
        }
      },

      destinations: {
        objectGauges: {
          label: "Object gauges",
          activationLabel:
            "Open the Object gauge dashboard"
        },

        structureGauges: {
          label: "Structure gauges",
          activationLabel:
            "Open the Structure gauge dashboard"
        },

        interactionGauges: {
          label: "Interaction gauges",
          activationLabel:
            "Open the Interaction gauge dashboard"
        },

        systemsGauges: {
          label: "Mirrorland Systems gauges",
          activationLabel:
            "Open the Mirrorland Systems gauge dashboard"
        },

        platformInformation: {
          label: "Platform information",
          activationLabel:
            "Open the Platform information tab"
        },

        engineeringInformation: {
          label: "Engineering information",
          activationLabel:
            "Open the Engineering information tab"
        },

        evidenceInformation: {
          label: "Evidence information",
          activationLabel:
            "Open the Evidence information tab"
        }
      }
    },

    fronts: {
      sharedNavigation: {
        returnToCompass: "Return to Compass",
        returnToOrbit: "Return to Orbit"
      },

      object: {
        kicker: "Object Gauge Set",
        heading: "The Diamond at the Door",

        introduction:
          "One object, two accepted views, one geometry authority, and one independent interactive stage.",

        selectorLabel: "Object gauge selectors",

        gauges: [
          {
            key: "publicViews",
            primary: "2",
            label: "Public Views",
            summary: "Object · Lattice",
            detailTitle: "Two accepted public views",
            detail:
              "Object View presents the visible gem. Lattice View reveals its internal structural field."
          },
          {
            key: "geometryAuthority",
            primary: "1",
            label: "Geometry Authority",
            summary: "Deterministic source",
            detailTitle:
              "One deterministic geometry authority",
            detail:
              "Exterior facets, internal seats, connections, regions, and both public views originate from one retained source."
          },
          {
            key: "rendererState",
            primary: "Native",
            label: "Diamond Renderer",
            summary: "WebGL implemented",
            detailTitle: "Native renderer",
            detail:
              "The Diamond retains its own WebGL context, shaders, camera, projection, rotation, zoom, inspection, reset, and fallback."
          },
          {
            key: "windowState",
            primary: "Closed",
            label: "Mirrorland Window",
            summary: "Threshold foreground",
            detailTitle:
              "Independent threshold Window",
            detail:
              "The stained-glass Window occupies a separate foreground layer over the Diamond viewport."
          }
        ],

        diamond: {
          stageLabel:
            "Interactive G3 Diamond Gate Bridge computational gem. Drag or swipe to rotate. Pinch or use the mouse wheel to zoom.",

          fallback: {
            title: "G3 Diamond Lattice fallback",
            description:
              "The live renderer is unavailable. The Diamond remains represented as a gold crown, bridge girdle, sapphire pavilion, culet, and internal lattice."
          },

          window: {
            eyebrow: "Mirrorland Threshold",
            closedLabel: "Open the Window",
            openLabel: "Close the Window",
            closedControlLabel:
              "Open the Mirrorland Window and reveal the Diamond",
            openControlLabel:
              "Close the Mirrorland Window and cover the Diamond"
          },

          controls: {
            traySummary: "Diamond controls",
            viewGroupLabel:
              "Diamond Lattice two-view controls",
            objectView: "Object View",
            latticeView: "Lattice View",

            technicalViews: {
              worldMemory: "World Memory",
              latticeBehind: "Lattice Behind",
              latticeThrough: "Lattice Through",
              fullProof: "Full Proof"
            },

            loadingStatus:
              "Preparing the G3 Diamond Lattice…",

            inspectLabel: "Inspect",
            resetLabel: "Reset"
          }
        },

        navigationLabel:
          "Leave the Object gauge dashboard"
      },

      structure: {
        kicker: "Structure Gauge Set",
        heading: "The order beneath the surface",

        introduction:
          "Exact structural counts and the anatomy of one computational object.",

        selectorLabel: "Structure gauge selectors",

        gauges: [
          {
            key: "radialSectors",
            primary: "16",
            label: "Radial Sectors",
            summary: "Angular field",
            detailTitle: "Sixteen radial sectors",
            detail:
              "The radial field supplies the Diamond’s angular coordinate dimension."
          },
          {
            key: "structuralBands",
            primary: "16",
            label: "Structural Bands",
            summary: "Depth field",
            detailTitle: "Sixteen structural bands",
            detail:
              "The bands supply the second coordinate dimension and intersect the sectors to form the 256-seat field."
          },
          {
            key: "addressableSeats",
            primary: "256",
            label: "Addressable Seats",
            summary: "16 × 16 field",
            detailTitle: "256 addressable seats",
            detail:
              "Every seat occupies a declared position that can be identified, connected, inspected, and regenerated."
          },
          {
            key: "surfaceTriangles",
            primary: "512",
            label: "Exterior Triangles",
            summary: "Visible surface",
            detailTitle: "512 exterior triangles",
            detail:
              "The visible surface is assembled from retained structural geometry rather than an imported mesh."
          },
          {
            key: "latticeConnections",
            primary: "800",
            label: "Internal Connections",
            summary: "Lattice continuity",
            detailTitle: "800 internal connections",
            detail:
              "The internal field expresses continuity across the object and supports Lattice View."
          },
          {
            key: "materialRegions",
            primary: "14",
            label: "Material Regions",
            summary: "Visual composition",
            detailTitle: "Fourteen material regions",
            detail:
              "The regions govern the crown, girdle, pavilion, culet, lattice, lighting, and inspection expression."
          }
        ],

        composition: {
          eyebrow: "Composition Gauge",
          heading: "Diamond anatomy",
          railLabel: "Diamond structural regions",

          regions: [
            {
              key: "crown",
              index: "01",
              title: "Gold Crown",
              description: "Visible identity"
            },
            {
              key: "girdle",
              index: "02",
              title: "Bridge Girdle",
              description: "Joining boundary"
            },
            {
              key: "pavilion",
              index: "03",
              title: "Sapphire Pavilion",
              description: "Depth and support"
            },
            {
              key: "culet",
              index: "04",
              title: "Culet",
              description: "Lower termination"
            },
            {
              key: "lattice",
              index: "05",
              title: "Internal Lattice",
              description: "Structural continuity"
            }
          ]
        },

        navigationLabel:
          "Leave the Structure gauge dashboard"
      },

      interaction: {
        kicker: "Interaction Gauge Set",
        heading: "How the object responds",

        introduction:
          "Compact capability indicators for manipulation, accessibility, recovery, and responsive presentation.",

        selectorLabel:
          "Interaction capability selectors",

        gauges: [
          {
            key: "pointer",
            primary: "Pointer",
            label: "Rotation",
            detailTitle: "Pointer rotation",
            detail:
              "Direct pointer input rotates the Diamond on its independent stage."
          },
          {
            key: "touch",
            primary: "Touch",
            label: "Rotation",
            detailTitle: "Touch rotation",
            detail:
              "Finger and thumb movement remain confined to the Diamond viewport."
          },
          {
            key: "pinchZoom",
            primary: "Pinch",
            label: "Zoom",
            detailTitle: "Pinch zoom",
            detail:
              "The protected interaction contract retains touch-based scale control."
          },
          {
            key: "wheelZoom",
            primary: "Wheel",
            label: "Zoom",
            detailTitle: "Wheel zoom",
            detail:
              "Desktop wheel input remains owned by the Diamond while the pointer is over its stage."
          },
          {
            key: "keyboard",
            primary: "Keyboard",
            label: "Semantic",
            detailTitle: "Keyboard access",
            detail:
              "Star destinations, gauges, tabs, dialogs, and controls retain semantic keyboard activation."
          },
          {
            key: "inspection",
            primary: "Inspect",
            label: "Selection",
            detailTitle: "Inspection",
            detail:
              "The Inspect control exposes the Diamond renderer’s accepted facet-selection behavior."
          },
          {
            key: "reset",
            primary: "Reset",
            label: "Restore",
            detailTitle: "Reset",
            detail:
              "Reset restores the renderer-defined accepted view without changing the constellation."
          },
          {
            key: "reducedMotion",
            primary: "Motion",
            label: "Reduced",
            detailTitle: "Reduced motion",
            detail:
              "Nonessential animation is removed when reduced motion is requested."
          },
          {
            key: "responsive",
            primary: "Responsive",
            label: "Resize",
            detailTitle:
              "Responsive presentation",
            detail:
              "Orbit, dashboards, Window, information, and Diamond stages respond independently to viewport size."
          },
          {
            key: "fallback",
            primary: "Fallback",
            label: "Semantic",
            detailTitle: "Semantic fallback",
            detail:
              "The page remains navigable when enhanced rendering is unavailable."
          }
        ],

        navigationLabel:
          "Leave the Interaction gauge dashboard"
      },

      systems: {
        kicker: "Mirrorland Systems Gauge Set",
        heading: "The frontier environment taking shape",

        introduction:
          "A compact status view of systems already present and systems still being built.",

        selectorLabel:
          "Mirrorland system status selectors",

        gauges: [
          {
            key: "narrativeEnvironment",
            label: "Narrative Environment",
            state: "Active",
            detailTitle:
              "Mirrorland is the containing world",
            detail:
              "Characters, scientific objects, gauges, simulations, experiments, and exploration coexist inside one narrative environment."
          },
          {
            key: "characterPaths",
            label: "Character Paths",
            state: "Available",
            detailTitle: "Character paths",
            detail:
              "Route stars provide entry to character destinations without exposing their behavior before selection."
          },
          {
            key: "frontierSciences",
            label: "Frontier Sciences",
            state: "Planned",
            detailTitle: "Frontier sciences",
            detail:
              "Future areas may present unresolved scientific questions, experimental models, and exploratory systems."
          },
          {
            key: "simulationSystems",
            label: "Simulation Systems",
            state: "Planned",
            detailTitle: "Simulation systems",
            detail:
              "Planned environments may support user-directed scenarios, variables, character participation, and recorded outcomes."
          },
          {
            key: "worldImpact",
            label: "World-Impact Pathways",
            state: "Research",
            detailTitle: "World-impact pathways",
            detail:
              "Mirrorland may help examine whether experimental systems could inform real-world decisions. Validation remains separate from aspiration."
          }
        ],

        navigationLabel:
          "Leave the Mirrorland Systems gauge dashboard"
      },

      information: {
        kicker: "Information Front",
        heading: "Platform, Engineering, and Evidence",

        introduction:
          "Three perspectives on how the Showroom is built, governed, tested, and bounded.",

        tabListLabel:
          "Showroom information categories",

        tabs: {
          platform: "Platform",
          engineering: "Engineering",
          evidence: "Evidence"
        },

        platform: {
          summaryTitle:
            "The platform preserves access, state separation, and graceful failure.",

          summary:
            "The page remains usable before enhanced behavior initializes and when optional visual systems fail.",

          disclosures: [
            {
              key: "accessibility",
              title: "Accessibility contract",
              description:
                "Every visual star has a semantic control, accessible name, declared destination, focus state, and fallback path."
            },
            {
              key: "responsive",
              title: "Responsive behavior",
              description:
                "Orbit, gauges, information, Window, and Diamond stages respond independently to viewport size."
            },
            {
              key: "reducedMotion",
              title: "Reduced motion",
              description:
                "Continuous and nonessential movement is removed when reduced motion is requested."
            },
            {
              key: "semanticFallback",
              title: "Semantic fallback",
              description:
                "Dashboards, tabs, routes, controls, and explanatory content remain available without enhanced rendering."
            },
            {
              key: "failureIsolation",
              title: "Failure isolation",
              description:
                "A failure in stars, gauges, Window animation, or a renderer must not erase the narrative or unrelated systems."
            }
          ]
        },

        engineering: {
          summaryTitle:
            "Engineering authority remains separated by system.",

          summary:
            "The constellation and gauges surround the protected Diamond rather than replacing it.",

          disclosures: [
            {
              key: "diamondGeometry",
              title: "Diamond geometry pipeline",
              description:
                "One geometry authority generates exterior, lattice, coordinates, regions, and structural relationships."
            },
            {
              key: "diamondRendering",
              title: "Diamond rendering pipeline",
              description:
                "The Diamond renderer owns shaders, buffers, lighting, camera, projection, rotation, zoom, inspection, reset, and recovery."
            },
            {
              key: "orbitComposition",
              title: "Orbit composition pipeline",
              description:
                "The compositor owns the orbit camera, world-to-screen projection, Compass-plane depth classification, and rear/front layers."
            },
            {
              key: "gaugePresentation",
              title: "Gauge presentation pipeline",
              description:
                "HTML owns values and relationships. CSS owns visual density and layout. The gauge module owns local selection and accessible state."
            },
            {
              key: "window",
              title: "Window pipeline",
              description:
                "The Window retains an independent canvas, lifecycle, reduced-motion behavior, and foreground relationship to the Diamond."
            },
            {
              key: "ownership",
              title: "Ownership boundaries",
              description:
                "Controller owns page state. Interactions owns gesture interpretation. Compositor owns projection. Crystals owns orbital meshes. Gauges owns dashboard behavior. Diamond files retain Diamond authority."
            }
          ],

          constructionRecord: {
            title:
              "Open the complete Diamond construction record.",

            description:
              "Review geometry, materials, rendering, interaction, stage separation, and claim boundaries.",

            actionLabel: "Open Construction Record"
          }
        },

        evidence: {
          summaryTitle:
            "Implementation, runtime evidence, visual acceptance, and authorization remain separate.",

          summary:
            "Source declarations do not convert automatically into validation or release claims.",

          statusLabel:
            "Evidence and authorization status",

          statuses: [
            {
              key: "geometry",
              label: "Geometry",
              state: "Implemented"
            },
            {
              key: "renderer",
              label: "Renderer",
              state: "Implemented"
            },
            {
              key: "runtimePass",
              label: "Runtime Pass",
              state: "Not Claimed"
            },
            {
              key: "visualAcceptance",
              label: "Visual Acceptance",
              state: "Not Claimed"
            },
            {
              key: "production",
              label: "Production",
              state: "Not Authorized"
            },
            {
              key: "deployment",
              label: "Deployment",
              state: "Not Authorized"
            }
          ],

          disclosures: [
            {
              key: "constructionEvidence",
              title: "Construction evidence",
              description:
                "Retained files identify counts, renderer identity, materials, controls, ownership boundaries, and fallback surfaces."
            },
            {
              key: "runtimeEvidence",
              title: "Runtime evidence",
              description:
                "Source completeness is not the same as successful initialization and interaction in deployment."
            },
            {
              key: "visualAcceptance",
              title: "Visual acceptance",
              description:
                "Acceptance requires inspection of actual layout, motion, depth, responsiveness, and interaction."
            },
            {
              key: "receipts",
              title: "Receipts",
              description:
                "Runtime modules may publish bounded identity, readiness, state, failure, and ownership receipts."
            },
            {
              key: "claimBoundaries",
              title: "Claim boundaries",
              description:
                "No source declaration establishes empirical proof, production readiness, deployment authorization, or public-release authority."
            }
          ]
        },

        navigationLabel:
          "Leave the information front"
      }
    },

    dialogs: {
      route: {
        eyebrow: "Constellation Route",
        defaultTitle: "A new path is available.",

        defaultDescription:
          "This star offers a path beyond the current Showroom page.",

        closeLabel:
          "Close the route decision and stay in the Showroom",

        stayLabel: "Stay in the Showroom",
        continueLabel: "Continue to Destination"
      },

      compass: {
        eyebrow: "Main Compass",
        title: "Return to the Main Compass?",

        description:
          "Leave the Showroom and return to Audralia’s Main Compass, or remain here and continue exploring Mirrorland.",

        closeLabel:
          "Close the return option and remain in the Showroom",

        stayLabel: "Stay in the Showroom",
        returnLabel: "Return to Main Compass"
      },

      construction: {
        eyebrow: "Complete Showroom Exhibit Record",
        title: "What we built into the Diamond",
        closeLabel: "Close construction record",

        records: [
          {
            value: "16",
            label: "Radial Sectors"
          },
          {
            value: "16",
            label: "Structural Bands"
          },
          {
            value: "256",
            label: "Addressable Seats"
          },
          {
            value: "512",
            label: "Exterior Facets"
          },
          {
            value: "800",
            label: "Internal Connections"
          },
          {
            value: "14",
            label: "Material Regions"
          },
          {
            value: "2",
            label: "Public Views"
          },
          {
            value: "WebGL",
            label: "Native Renderer"
          },
          {
            value: "1",
            label: "Geometry Authority"
          }
        ],

        disclosures: [
          {
            key: "identity",
            title: "Construction identity",
            description:
              "The G3 Diamond Lattice is a purpose-built computational object, not an imported model, generated image, video, or static illustration."
          },
          {
            key: "stageSeparation",
            title: "Stage separation",
            description:
              "The constellation and Diamond exhibit remain independent stages. The Diamond retains its renderer, motion, zoom, camera, controls, and fallback."
          },
          {
            key: "gaugeSystem",
            title: "Gauge system",
            description:
              "Gauge markup contains values, states, detail relationships, and accessible labels. CSS owns presentation density. The gauge module owns local activation and correspondence."
          },
          {
            key: "navigationOwnership",
            title: "Navigation ownership",
            description:
              "The visual Compass does not navigate. The semantic Compass control requests a controller-owned return decision."
          },
          {
            key: "claimBoundary",
            title: "Claim boundary",
            description:
              "Implemented source structure does not establish runtime pass, visual acceptance, production authorization, deployment authorization, or empirical validity."
          }
        ],

        returnLabel: "Return to the Showroom"
      }
    },

    footer: {
      title: "The Showroom · The Door to Mirrorland",

      description:
        "Follow the stars. Open the Window. Inspect the Diamond.",

      links: {
        elara: "Talk to Elara",
        mainCompass: "Main Compass"
      },

      navigationLabel: "Showroom footer links"
    }
  };

  return deepFreeze(CONTENT);
})();

if (
  typeof module !== "undefined" &&
  module.exports
) {
  module.exports =
    SHOWROOM_MIRRORLAND_EDITABLE_CONTENT_SOURCE_TNT_v1;
}
