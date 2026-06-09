/*
  /showroom/globe/hearth/index.js
  HEARTH_FACILITY_ORBIT_CONTENT_CONTROLLER_RENEWAL_TNT_v2
  Full-file replacement.
  Scope: public route controller/content only.
  Purpose:
  - Make every orbit button visibly functional.
  - Render TED Talk-style presentation content into the reading chamber.
  - Scroll to the selected content panel on mobile.
  - Make Return to Orbit visibly reset the chamber.
  - Preserve Hearth = facility, Audralia = first planetary subject.
  - Preserve diagnostic bridge.
  Does not own:
  - canvas engine
  - controls engine
  - runtime loop
  - diagnostic internals
  - planet renderer
*/

(function hearthFacilityOrbitContentController() {
  "use strict";

  var root = window;
  var doc = document;

  var CONTRACT = "HEARTH_FACILITY_ORBIT_CONTENT_CONTROLLER_RENEWAL_TNT_v2";
  var RECEIPT = "HEARTH_FACILITY_ORBIT_CONTENT_CONTROLLER_RENEWAL_RECEIPT_v2";
  var VERSION = "2026-06-09.hearth-facility-orbit-content-controller-renewal-v2";

  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  var REQUIRED_MOUNT_ID = "hearthCanvasMount";
  var REQUIRED_CANVAS_ID = "hearthVisibleCanvas";

  var state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    initializedAt: "",
    updatedAt: "",
    activeLens: "platform",
    activeOrbit: "orbit",
    mountExists: false,
    mountRectNonZero: false,
    canvasExists: false,
    canvasRectNonZero: false,
    productionMutationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    routeRepairAuthorized: false,
    targetRouteRendererMutationAuthorized: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    webGL: false
  };

  var els = {};

  var slides = {
    orbit: {
      platform: {
        kicker: "Facility Orbit",
        title: "Hearth is the chamber. Audralia is the first subject.",
        thesis: "This page is a public facility presentation. It introduces the Unknown, the first planetary subject, the frontier sciences, the character builders, the gauges, and the under-the-hood diagnostic panel.",
        points: [
          "Hearth is not the planet. Hearth is the facility alias.",
          "Audralia is the first planetary production subject.",
          "The orbit lets visitors focus on one chamber lens at a time.",
          "Return to Orbit resets the experience and brings the full map back."
        ],
        quote: "The website is the window. Hearth is the chamber behind the window.",
        cta: [{ label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      },
      engineering: {
        kicker: "Route Controller",
        title: "Presentation shell, measurable stage, diagnostic bridge.",
        thesis: "This route owns public layout and narrative interaction. It does not repair canvas internals, controls, runtime, or diagnostic files.",
        points: [
          "The route preserves #hearthCanvasMount and #hearthVisibleCanvas.",
          "The controller measures whether those elements have nonzero layout.",
          "The diagnostic panel remains the proof source.",
          "No visual pass or production repair is claimed here."
        ],
        quote: "Public presentation and diagnostic proof stay separate.",
        cta: [{ label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      }
    },

    unknown: {
      platform: {
        kicker: "The Unknown",
        title: "Before the world appears, the visitor enters the facility.",
        thesis: "The Unknown is the narrative place where Hearth exists. It should feel like a doorway into something larger than a globe demo: a hidden production room where worlds are measured before they are fully visible.",
        points: [
          "The visitor is entering an observation chamber.",
          "The facility has instruments, gauges, and hidden machinery.",
          "The visible planet is not the whole system; it is the subject in production.",
          "The Unknown gives the page mystery without breaking the build logic."
        ],
        quote: "Hearth is the name on the door. The Unknown is where the door opens.",
        cta: [
          { label: "Return to Globe Window", href: "/showroom/globe/" },
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Location Logic",
        title: "Hearth facility context separates location from subject.",
        thesis: "This prevents the page from confusing facility identity with planet identity. The facility provides stage, gauges, route access, and diagnostic bridge. Audralia carries the world identity.",
        points: [
          "Facility identity: Hearth.",
          "Narrative location: the Unknown.",
          "First production subject: Audralia.",
          "Proof room: the diagnostic panel."
        ],
        quote: "The route shell explains the chamber; the diagnostic panel proves what is measurable.",
        cta: [{ label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      }
    },

    audralia: {
      platform: {
        kicker: "Audralia",
        title: "The first world in the chamber is a possibility planet.",
        thesis: "Audralia is the frontier playground: a living possibility world where science, systems, characters, experiments, terrain, civilization, and future interaction can develop together.",
        points: [
          "Audralia is the first planetary subject under Hearth production.",
          "It is not just a sphere to view; it is a world to build toward.",
          "It gives the project a clean-slate frontier field.",
          "It becomes the place where characters and sciences can eventually become interactive."
        ],
        quote: "Audralia is where possibility stops being abstract and starts becoming explorable.",
        cta: [
          { label: "Visit Audralia", href: "/showroom/globe/audralia/" },
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Planetary Subject",
        title: "Audralia is the output; Hearth is the production context.",
        thesis: "The page should keep the subject/facility split intact. Hearth prepares the stage and gathers proof. Audralia receives the frontier-science world identity.",
        points: [
          "Do not call Hearth the planet.",
          "Do call Audralia the first planetary subject.",
          "Use the stage to host the visible production viewport.",
          "Use diagnostic receipts to determine what the stage can currently prove."
        ],
        quote: "Facility and subject must not collapse into the same label.",
        cta: [{ label: "Visit Audralia", href: "/showroom/globe/audralia/" }]
      }
    },

    frontier: {
      platform: {
        kicker: "Frontier Sciences",
        title: "The science lanes become world-building thresholds.",
        thesis: "Frontier gives Audralia its applied-science backbone. The lanes are not decorative categories. They are future systems that can become experiments, missions, tools, and interaction paths.",
        points: [
          "Closed Loop turns waste, output, and reuse into playable system logic.",
          "Energy becomes infrastructure, power, storage, and frontier capability.",
          "Water, Waste, Urban, Vision, Lattice, and Infrastructure become world-shaping disciplines.",
          "The page should make these sciences readable before making them technical."
        ],
        quote: "Frontier is the map. Hearth is the chamber. Audralia is the field.",
        cta: [
          { label: "Open Frontier", href: "/explore/frontier/" },
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Applied Lanes",
        title: "Use Frontier as a category system, not a directory dump.",
        thesis: "Hearth should translate Frontier into chamber gauges and future production lenses. The visitor should understand the science lanes without leaving the facility story.",
        points: [
          "Keep the eleven-lane Frontier architecture as source logic.",
          "Condense it into readable production categories.",
          "Show how science lanes become thresholds on Audralia.",
          "Keep engineering detail available through diagnostics, not public overload."
        ],
        quote: "The public page explains the system without exhausting the visitor.",
        cta: [{ label: "Open Frontier", href: "/explore/frontier/" }]
      }
    },

    characters: {
      platform: {
        kicker: "Character Builders",
        title: "The characters are builders of the frontier thresholds.",
        thesis: "The characters are not art assets. They are the narrative interface for future interaction. They can become guides, builders, pressure points, scientists, operators, and witnesses inside Audralia’s frontier development.",
        points: [
          "Characters give the science a human doorway.",
          "They can carry missions, choices, conflict, and discovery.",
          "They turn frontier systems into stories the visitor can follow.",
          "Eventually, the visitor should interact with characters as the sciences mature."
        ],
        quote: "The characters do not stand beside the world. They build the thresholds into it.",
        cta: [
          { label: "Meet the Characters", href: "/characters/" },
          { label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }
        ]
      },
      engineering: {
        kicker: "Interaction Layer",
        title: "Character logic becomes future interface logic.",
        thesis: "Characters can eventually bridge narrative state, world state, and scientific systems. That future layer should remain distinct from current diagnostic proof.",
        points: [
          "Narrative roles should map to frontier functions.",
          "Interaction should grow after stable route, canvas, and controls evidence.",
          "Characters should not fake system readiness.",
          "The page can preview the future without claiming it is complete."
        ],
        quote: "Narrative promise must stay aligned with build evidence.",
        cta: [{ label: "Meet the Characters", href: "/characters/" }]
      }
    },

    gauges: {
      platform: {
        kicker: "Facility Gauges",
        title: "The gauges translate build state into human language.",
        thesis: "A visitor should not need to read raw diagnostic receipts to understand the facility. Gauges summarize the stage, motion, narrative, and proof layers in plain language.",
        points: [
          "Visual Surface tells whether the stage is ready to show the subject.",
          "Motion + Touch separates interaction from visual readiness.",
          "Narrative Layer tracks whether the page matches Mirrorland, Frontier, and Audralia.",
          "Under the Hood points to diagnostic proof."
        ],
        quote: "Good gauges do not hide complexity. They make it readable.",
        cta: [{ label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      },
      engineering: {
        kicker: "Receipt Translation",
        title: "Friendly gauges should summarize, not replace, receipts.",
        thesis: "The gauges are public-facing interpretations. The diagnostic panel remains the authority for direct execution, target surface measurement, and next lawful moves.",
        points: [
          "Do not claim final visual pass from public gauges.",
          "Do not claim canvas repair from layout readiness alone.",
          "Use diagnostic receipts to validate stage measurements.",
          "Keep people-friendly language tied to measurable state."
        ],
        quote: "A gauge is a translation layer, not a proof source.",
        cta: [{ label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      }
    },

    underhood: {
      platform: {
        kicker: "Under the Hood",
        title: "The instrument room is available without taking over the presentation.",
        thesis: "The public page should feel like a keynote: clear, visual, and readable. The under-the-hood panel should remain one click away for proof, inspection, direct checks, and next-move synthesis.",
        points: [
          "The showroom explains what the visitor is seeing.",
          "The diagnostic panel proves what the system can currently measure.",
          "The two experiences should support each other without merging.",
          "A visitor can stay in the story, while a builder can enter the receipts."
        ],
        quote: "The public room inspires. The instrument room verifies.",
        cta: [{ label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      },
      engineering: {
        kicker: "No-Touch Boundary",
        title: "This controller inspects layout and interaction only.",
        thesis: "This file may update presentation state, scroll behavior, panel content, and public gauge text. It must not mutate canvas engines, controls, runtime, or diagnostic participants.",
        points: [
          "Allowed: orbit UI, panel rendering, gauge text, layout measurement.",
          "Not allowed: canvas repair, controls repair, runtime restart, renderer mutation.",
          "Diagnostic route remains the proof chamber.",
          "Route shell work remains separate from engine authority."
        ],
        quote: "Do not confuse public interactivity with engine mutation.",
        cta: [{ label: "Open Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      }
    },

    diagnostic: {
      platform: {
        kicker: "Diagnostic Panel",
        title: "The diagnostic panel is the under-the-hood proof room.",
        thesis: "When the public presentation needs proof, the diagnostic panel provides direct receipts: source evidence, surface truth, no-touch boundaries, and next lawful move synthesis.",
        points: [
          "Open diagnostics to inspect what the target route can actually measure.",
          "Use direct checks to verify individual authorities.",
          "Use Next Move to avoid guessing the next owner.",
          "Keep public claims aligned with receipts."
        ],
        quote: "The page can tell the story. The panel tells the truth of the build.",
        cta: [{ label: "Enter Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      },
      engineering: {
        kicker: "Proof Room",
        title: "Diagnostics remain the formal authority for build state.",
        thesis: "The public route should never replace direct receipts. Use the panel to validate surface measurements, direct execution packets, and next-file ownership.",
        points: [
          "Run Surface Truth Direct to measure mount and canvas geometry.",
          "Run Next Move to confirm the next lawful owner.",
          "Do not repair engines from the showroom controller.",
          "Do not claim visual pass without receipt support."
        ],
        quote: "Receipt before repair. Measurement before claim.",
        cta: [{ label: "Enter Diagnostic Panel", href: DIAGNOSTIC_ROUTE }]
      }
    }
  };

  function now() {
    return new Date().toISOString();
  }

  function $(selector, scope) {
    return (scope || doc).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(selector));
  }

  function safeText(value) {
    return String(value == null ? "" : value);
  }

  function getSlide(key) {
    var activeKey = slides[key] ? key : "orbit";
    var group = slides[activeKey];
    return group[state.activeLens] || group.platform;
  }

  function rectState(node) {
    if (!node || typeof node.getBoundingClientRect !== "function") {
      return { exists: Boolean(node), width: 0, height: 0, nonzero: false };
    }

    var rect = node.getBoundingClientRect();
    var width = Math.round(rect.width || 0);
    var height = Math.round(rect.height || 0);

    return {
      exists: true,
      width: width,
      height: height,
      nonzero: width > 0 && height > 0
    };
  }

  function captureElements() {
    els.body = doc.body;
    els.orbitSection = $("[data-orbit-section]") || $(".orbit-section");
    els.orbit = $(".facility-orbit");
    els.orbitNodes = $all("[data-orbit-node]");
    els.returnOrbit = $("[data-return-orbit]");
    els.lensButtons = $all("[data-lens]");
    els.panel = $("[data-orbit-panel]");
    els.mount = doc.getElementById(REQUIRED_MOUNT_ID);
    els.canvas = doc.getElementById(REQUIRED_CANVAS_ID);
    els.stageStatus = $("[data-stage-status]");
    els.gaugeVisual = $('[data-gauge="visual"]');
    els.gaugeMotion = $('[data-gauge="motion"]');
    els.gaugeNarrative = $('[data-gauge="narrative"]');
    els.gaugeDiagnostic = $('[data-gauge="diagnostic"]');
  }

  function measureStage() {
    var mount = rectState(els.mount);
    var canvas = rectState(els.canvas);

    state.mountExists = mount.exists;
    state.mountRectNonZero = mount.nonzero;
    state.canvasExists = canvas.exists;
    state.canvasRectNonZero = canvas.nonzero;
    state.updatedAt = now();

    if (els.mount) {
      els.mount.dataset.mountRectNonZero = String(state.mountRectNonZero);
      els.mount.dataset.canvasRectNonZero = String(state.canvasRectNonZero);
      els.mount.dataset.measuredWidth = String(mount.width);
      els.mount.dataset.measuredHeight = String(mount.height);
    }

    if (els.canvas) {
      els.canvas.dataset.canvasRectNonZero = String(state.canvasRectNonZero);
      els.canvas.dataset.measuredWidth = String(canvas.width);
      els.canvas.dataset.measuredHeight = String(canvas.height);
    }

    if (els.stageStatus) {
      els.stageStatus.textContent =
        state.mountRectNonZero && state.canvasRectNonZero
          ? "Stage prepared · surface is measurable"
          : "Stage preparing · surface measurement pending";
    }

    updateGauges();
  }

  function updateGaugeCard(card, strongText, bodyText) {
    if (!card) return;

    var strong = $("strong", card);
    var body = $("p", card);

    if (strong) strong.textContent = strongText;
    if (body) body.textContent = bodyText;
  }

  function updateGauges() {
    updateGaugeCard(
      els.gaugeVisual,
      state.mountRectNonZero && state.canvasRectNonZero ? "Stage measurable" : "Stage being renewed",
      state.mountRectNonZero && state.canvasRectNonZero
        ? "The chamber now gives the production viewport physical space."
        : "The chamber shell exists, but the measurable stage has not fully proved nonzero layout yet."
    );

    updateGaugeCard(
      els.gaugeMotion,
      "Awaiting interaction proof",
      "Motion and touch should be proven separately from route-shell layout."
    );

    updateGaugeCard(
      els.gaugeNarrative,
      "Mirrorland aligned",
      "Hearth now reads as a facility in the Unknown with Audralia as the first planetary subject."
    );

    updateGaugeCard(
      els.gaugeDiagnostic,
      "Diagnostic panel active",
      "The instrument room remains the under-the-hood proof source."
    );
  }

  function actionHTML(actions) {
    return (actions || [])
      .map(function mapAction(action) {
        return (
          '<a class="panel-link" href="' +
          safeText(action.href) +
          '">' +
          safeText(action.label) +
          "</a>"
        );
      })
      .join("");
  }

  function renderPanel(key) {
    if (!els.panel) return;

    var slide = getSlide(key);
    var points = (slide.points || [])
      .map(function mapPoint(point) {
        return "<li>" + safeText(point) + "</li>";
      })
      .join("");

    els.panel.innerHTML =
      '<div class="panel-content">' +
        '<p class="panel-kicker">' + safeText(slide.kicker) + "</p>" +
        "<h3>" + safeText(slide.title) + "</h3>" +
        '<p class="panel-thesis">' + safeText(slide.thesis) + "</p>" +
        '<ul class="panel-points">' + points + "</ul>" +
        '<blockquote class="panel-quote">' + safeText(slide.quote) + "</blockquote>" +
        '<div class="panel-actions">' + actionHTML(slide.cta) + "</div>" +
      "</div>";

    els.panel.dataset.activeOrbit = key;
    els.panel.dataset.activeLens = state.activeLens;
  }

  function updateNodeState() {
    els.orbitNodes.forEach(function eachNode(node) {
      var key = node.getAttribute("data-orbit-node");
      var active = key === state.activeOrbit;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (els.orbit) {
      els.orbit.classList.toggle("has-active", state.activeOrbit !== "orbit");
    }

    els.lensButtons.forEach(function eachLens(button) {
      var active = button.getAttribute("data-lens") === state.activeLens;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (els.body) {
      els.body.dataset.hearthLens = state.activeLens;
      els.body.dataset.hearthOrbit = state.activeOrbit;
    }
  }

  function scrollToPanel() {
    if (!els.panel) return;

    setTimeout(function delayedScroll() {
      try {
        els.panel.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        els.panel.scrollIntoView(true);
      }
    }, 40);
  }

  function scrollToOrbit() {
    var target = els.orbitSection || els.orbit;
    if (!target) return;

    setTimeout(function delayedScroll() {
      try {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        target.scrollIntoView(true);
      }
    }, 40);
  }

  function setOrbit(key, options) {
    var opts = options || {};
    state.activeOrbit = slides[key] ? key : "orbit";
    state.updatedAt = now();

    updateNodeState();
    renderPanel(state.activeOrbit);

    if (state.activeOrbit !== "orbit" && opts.scroll !== false) {
      scrollToPanel();
    }
  }

  function returnToOrbit() {
    setOrbit("orbit", { scroll: false });
    scrollToOrbit();
  }

  function setLens(lens) {
    state.activeLens = lens === "engineering" ? "engineering" : "platform";
    state.updatedAt = now();

    updateNodeState();
    renderPanel(state.activeOrbit || "orbit");
  }

  function bindControls() {
    els.orbitNodes.forEach(function bindOrbitNode(node) {
      node.setAttribute("type", "button");
      node.setAttribute("aria-pressed", "false");

      node.addEventListener("click", function onClick(event) {
        event.preventDefault();
        setOrbit(node.getAttribute("data-orbit-node"));
      });
    });

    els.lensButtons.forEach(function bindLensButton(button) {
      button.setAttribute("type", "button");

      button.addEventListener("click", function onClick(event) {
        event.preventDefault();
        setLens(button.getAttribute("data-lens"));
      });
    });

    if (els.returnOrbit) {
      els.returnOrbit.setAttribute("type", "button");
      els.returnOrbit.addEventListener("click", function onReturn(event) {
        event.preventDefault();
        returnToOrbit();
      });
    }

    doc.addEventListener("click", function delegatedClick(event) {
      var orbitNode = event.target.closest && event.target.closest("[data-orbit-node]");
      var lensNode = event.target.closest && event.target.closest("[data-lens]");
      var returnNode = event.target.closest && event.target.closest("[data-return-orbit]");

      if (orbitNode) {
        event.preventDefault();
        setOrbit(orbitNode.getAttribute("data-orbit-node"));
      } else if (lensNode) {
        event.preventDefault();
        setLens(lensNode.getAttribute("data-lens"));
      } else if (returnNode) {
        event.preventDefault();
        returnToOrbit();
      }
    });

    doc.addEventListener("keydown", function onKeydown(event) {
      if (event.key === "Escape") {
        returnToOrbit();
      }
    });
  }

  function readHash() {
    var key = (root.location.hash || "").replace("#", "").trim();
    if (slides[key]) {
      setOrbit(key, { scroll: false });
    }
  }

  function publishAPI() {
    var api = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      setOrbit: setOrbit,
      returnToOrbit: returnToOrbit,
      setLens: setLens,
      measureStage: function publicMeasureStage() {
        measureStage();
        return api.getReceiptLight();
      },
      getState: function getState() {
        measureStage();
        return JSON.parse(JSON.stringify(state));
      },
      getReceiptLight: function getReceiptLight() {
        measureStage();
        return {
          CONTRACT: CONTRACT,
          RECEIPT: RECEIPT,
          VERSION: VERSION,
          TARGET_ROUTE: TARGET_ROUTE,
          DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
          ACTIVE_ORBIT: state.activeOrbit,
          ACTIVE_LENS: state.activeLens,
          MOUNT_EXISTS: state.mountExists,
          MOUNT_RECT_NONZERO: state.mountRectNonZero,
          CANVAS_EXISTS: state.canvasExists,
          CANVAS_RECT_NONZERO: state.canvasRectNonZero,
          PRODUCTION_MUTATION_AUTHORIZED: false,
          CANVAS_REPAIR_AUTHORIZED: false,
          CANVAS_BUILD_AUTHORIZED: false,
          CANVAS_RELEASE_AUTHORIZED: false,
          CONTROLS_REPAIR_AUTHORIZED: false,
          RUNTIME_RESTART_AUTHORIZED: false,
          VISUAL_PASS_CLAIMED: false,
          WEBGL: false
        };
      }
    };

    root.HEARTH_FACILITY_ORBIT_CONTENT_CONTROLLER = api;

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.facilityOrbitContentController = api;

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthFacilityOrbitContentController = api;
  }

  function init() {
    state.initializedAt = now();
    state.updatedAt = state.initializedAt;

    captureElements();
    bindControls();
    publishAPI();

    setLens("platform");
    setOrbit("orbit", { scroll: false });
    readHash();
    measureStage();

    root.addEventListener("resize", measureStage, { passive: true });

    if ("ResizeObserver" in root && els.mount) {
      var observer = new ResizeObserver(measureStage);
      observer.observe(els.mount);
      if (els.canvas) observer.observe(els.canvas);
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
