/*
 * Laws root experiential presentation and Rolodex navigation.
 * Presentation only. Consumes controller-published Compass state and exposes
 * concise links to existing canonical destinations. It does not create routes,
 * mutate destination records, alter evidence, or govern the Compass runtime.
 */

(() => {
  "use strict";

  const CONTRACT = "LAWS_ROOT_ROLODEX_AND_CONTENT_SUBTRACTION_IMPLEMENTATION_v1";
  const STELLAR_STYLE = "/laws/index.stellar-continuity.css?v=LAWS_STELLAR_CONTINUITY_20260801A";
  const STELLAR_SCRIPT = "/laws/index.background-cosmos.js?v=LAWS_BACKGROUND_COSMOS_20260801A";
  const COMPASS_PRELOAD_MARGIN = "1200px 0px";
  const INLINE_DISCLOSURE_MEDIA = "(min-width: 781px) and (max-width: 1200px)";
  const MAX_IMMEDIATE_DISCLOSURE_GAP = 160;

  const COPY = Object.freeze({
    idle: Object.freeze({
      direction: "",
      eyebrow: "The question behind the direction",
      title: "Choose a direction",
      body: "The Compass turns each authority into one clear question. Select an object to hear what it asks before entering its record.",
      state: "Compass ready"
    }),
    flow: Object.freeze({
      direction: "flow",
      eyebrow: "Flow",
      title: "What changed?",
      body: "Follow what moved, developed, repeated, returned, or passed from one part of the system to another.",
      state: "Flow selected"
    }),
    integrity: Object.freeze({
      direction: "integrity",
      eyebrow: "Integrity",
      title: "What remained intact?",
      body: "Check whether identity, responsibility, consistency, and traceability survived time, pressure, and transfer.",
      state: "Integrity selected"
    }),
    reality: Object.freeze({
      direction: "reality",
      eyebrow: "Reality",
      title: "What does the evidence show?",
      body: "Separate what was observed or measured from what is assumed, inferred, unresolved, or not yet established.",
      state: "Reality selected"
    }),
    structure: Object.freeze({
      direction: "structure",
      eyebrow: "Structure",
      title: "What conditions shaped the result?",
      body: "Locate the constraints, interfaces, boundaries, and rules that made the outcome possible or prevented it.",
      state: "Structure selected"
    }),
    test: Object.freeze({
      direction: "test",
      eyebrow: "Test",
      title: "What was actually tested?",
      body: "Inspect the baseline, method, forward construction, reverse audit, result, and record without mistaking procedure for proof.",
      state: "Test selected"
    }),
    research: Object.freeze({
      direction: "research",
      eyebrow: "Research",
      title: "What should be preserved?",
      body: "Research keeps the answers, sources, methods, results, limitations, negative findings, and unresolved questions together.",
      state: "Research selected"
    })
  });

  const ROLODEXES = Object.freeze([
    Object.freeze({
      id: "foundation",
      eyebrow: "Learn the foundation",
      title: "Start with the governing ideas.",
      alignment: "left",
      items: Object.freeze([
        Object.freeze({
          id: "laws-governing-relationships",
          name: "Laws and Governing Relationships",
          question: "How do the governing ideas connect?",
          description: "See the law families and the relationships that organize the chamber.",
          route: "/laws/categories/"
        }),
        Object.freeze({
          id: "methods-models",
          name: "Methods and Models",
          question: "How are questions turned into inspectable methods?",
          description: "Review the models, notation, and procedures used to examine a claim.",
          route: "/laws/research/methods-and-models/"
        }),
        Object.freeze({
          id: "scientific-law",
          name: "Scientific Law",
          question: "What would make a proposed law scientifically testable?",
          description: "Enter the branch that separates a law statement from its evidence and tests.",
          route: "/laws/scientific-law/"
        })
      ])
    }),
    Object.freeze({
      id: "research",
      eyebrow: "Examine the research",
      title: "Follow the evidence and its limits.",
      alignment: "right",
      items: Object.freeze([
        Object.freeze({
          id: "evidence-sources",
          name: "Evidence and Sources",
          question: "What information supports the work?",
          description: "Inspect the sources, observations, datasets, and provenance behind the research.",
          route: "/laws/research/evidence-and-sources/"
        }),
        Object.freeze({
          id: "applied-investigations",
          name: "Applied Investigations",
          question: "How are the ideas examined in real systems?",
          description: "Browse bounded studies, including battery health, without treating one study as the foundation.",
          route: "/laws/research/applied-investigations/"
        }),
        Object.freeze({
          id: "findings-boundaries",
          name: "Findings and Boundaries",
          question: "What was found, and what remains unresolved?",
          description: "Review supported findings together with limitations, negative results, and claim boundaries.",
          route: "/laws/research/findings-and-boundaries/"
        })
      ])
    }),
    Object.freeze({
      id: "claim",
      eyebrow: "Test or inspect a claim",
      title: "Trace a claim from entry to record.",
      alignment: "left",
      items: Object.freeze([
        Object.freeze({
          id: "admission-baseline",
          name: "Admission and Baseline",
          question: "What must be established before a test begins?",
          description: "Check the subject, scope, source material, and starting condition admitted for examination.",
          route: "/laws/test/admission-and-baseline/"
        }),
        Object.freeze({
          id: "forward-construction",
          name: "Forward Construction",
          question: "How is the claim built into a testable sequence?",
          description: "Follow the declared steps, gates, and expected observations used in the forward test.",
          route: "/laws/test/forward-construction/"
        }),
        Object.freeze({
          id: "reverse-audit",
          name: "Reverse Audit",
          question: "Can the result be traced back through the method?",
          description: "Work backward through the evidence and decisions to locate breaks, substitutions, or unsupported steps.",
          route: "/laws/test/reverse-audit/"
        }),
        Object.freeze({
          id: "results-records",
          name: "Results and Records",
          question: "What result was recorded, and what does it permit us to say?",
          description: "Inspect the preserved outcome, supporting record, and the boundary of the resulting claim.",
          route: "/laws/test/result-and-record/"
        })
      ])
    })
  ]);

  const documentElement = document.documentElement;
  const root = document.querySelector("[data-laws-root]");
  const hero = document.querySelector("[data-laws-experience-stage='hero']");
  const compassPrimary = document.querySelector(".laws-compass-primary");
  const speaker = document.querySelector("[data-laws-experience-speaker]");
  const speakerEyebrow = document.querySelector("[data-laws-experience-speaker-eyebrow]");
  const speakerTitle = document.querySelector("[data-laws-experience-speaker-title]");
  const speakerBody = document.querySelector("[data-laws-experience-speaker-body]");
  const speakerState = document.querySelector("[data-laws-experience-speaker-state]");
  const questionNodes = Array.from(document.querySelectorAll("[data-laws-experience-question]"));
  const stageNodes = Array.from(document.querySelectorAll("[data-laws-experience-stage]"));
  const firstDisclosure = document.querySelector("details[data-laws-first-disclosure]");
  const firstDisclosureSummary = firstDisclosure?.querySelector(":scope > summary") || null;
  const firstDisclosureBody = firstDisclosure?.querySelector(":scope > .laws-first__disclosure-body") || null;

  let unsubscribeCompass = null;
  let activeDirection = "";
  let reducedMotion = false;
  let compassPreloadObserver = null;
  let compassPreloadRequested = false;
  let exhibitState = null;
  const rolodexState = new Map();

  function normalizeDirection(value) {
    const direction = String(value || "").trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(COPY, direction) ? direction : "";
  }

  function deriveDirection(compass) {
    const candidates = [
      compass && compass.selectedDirection,
      compass && compass.selectedDestinationId,
      root && root.dataset.lawsActiveDirection,
      root && root.dataset.orbitFocus
    ];

    for (const candidate of candidates) {
      const normalized = normalizeDirection(candidate);
      if (normalized) {
        return normalized;
      }
    }

    return "";
  }

  function applyCopy(direction, source = "presentation") {
    const normalized = normalizeDirection(direction);
    const record = COPY[normalized || "idle"];

    if (normalized === activeDirection && source !== "initialize") {
      return;
    }

    activeDirection = normalized;
    documentElement.dataset.lawsExperienceDirection = normalized || "idle";

    if (speaker) {
      speaker.dataset.lawsExperienceSpeakerDirection = normalized || "idle";
    }
    if (speakerEyebrow) {
      speakerEyebrow.textContent = record.eyebrow;
    }
    if (speakerTitle) {
      speakerTitle.textContent = record.title;
    }
    if (speakerBody) {
      speakerBody.textContent = record.body;
    }
    if (speakerState) {
      speakerState.textContent = record.state;
    }

    for (const node of questionNodes) {
      const nodeDirection = normalizeDirection(node.dataset.lawsExperienceQuestion);
      node.dataset.lawsExperienceActive = String(Boolean(normalized && nodeDirection === normalized));
    }


    globalThis.dispatchEvent(new CustomEvent("LAWS_EXPERIENCE_CORRESPONDENCE", {
      detail: Object.freeze({
        contract: CONTRACT,
        direction: normalized,
        source,
        navigationAuthority: false,
        contentAuthority: false
      })
    }));
  }

  function readControllerState() {
    const controller = globalThis.DGB_LAWS_CONTROLLER;
    if (!controller || typeof controller.getFrame !== "function") {
      return null;
    }

    try {
      const frame = controller.getFrame();
      return frame && frame.compass ? frame.compass : null;
    } catch (_) {
      return null;
    }
  }

  function connectController() {
    const controller = globalThis.DGB_LAWS_CONTROLLER;
    if (!controller) {
      return false;
    }

    if (typeof controller.subscribeCompassState === "function" && !unsubscribeCompass) {
      unsubscribeCompass = controller.subscribeCompassState(compass => {
        reducedMotion = Boolean(compass && compass.reducedMotion);
        applyCopy(deriveDirection(compass), "controller-subscription");
      });
    }

    const compass = readControllerState();
    if (compass) {
      reducedMotion = Boolean(compass.reducedMotion);
      applyCopy(deriveDirection(compass), "controller-frame");
    }

    return true;
  }

  function observeRootState() {
    if (!root || typeof MutationObserver !== "function") {
      return;
    }

    const observer = new MutationObserver(() => {
      applyCopy(deriveDirection(readControllerState()), "root-state");
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: [
        "data-laws-active-direction",
        "data-laws-selected-destination-id",
        "data-orbit-focus",
        "data-laws-state"
      ]
    });
  }

  function requestCompassRuntimePreload(reason) {
    if (compassPreloadRequested) {
      return true;
    }

    const loader = globalThis.DGBLawsStagedLoader;
    if (!loader) {
      return false;
    }

    const canLoadOrbit = typeof loader.loadOrbitSystems === "function";
    const canLoadInteractions = typeof loader.loadInteractionSystems === "function";
    if (!canLoadOrbit || !canLoadInteractions) {
      return false;
    }

    compassPreloadRequested = true;
    documentElement.dataset.lawsExperiencePreload = reason || "compass-zone-proximity";
    loader.loadOrbitSystems();
    loader.loadInteractionSystems();

    if (compassPreloadObserver) {
      compassPreloadObserver.disconnect();
      compassPreloadObserver = null;
    }

    return true;
  }

  function installCompassPreload() {
    if (!compassPrimary) {
      return;
    }

    const request = reason => {
      if (requestCompassRuntimePreload(reason)) {
        return;
      }

      globalThis.addEventListener(
        "DGB_LAWS_STAGED_LOADER_READY",
        () => requestCompassRuntimePreload(reason),
        { once: true }
      );
    };

    if (typeof IntersectionObserver !== "function") {
      request("no-intersection-observer");
      return;
    }

    compassPreloadObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        request("compass-zone-proximity");
      }
    }, {
      root: null,
      rootMargin: COMPASS_PRELOAD_MARGIN,
      threshold: 0.01
    });

    compassPreloadObserver.observe(compassPrimary);
  }

  function firstDisclosureSnapshot() {
    const summaryRect = firstDisclosureSummary?.getBoundingClientRect();
    const bodyRect = firstDisclosureBody?.getBoundingClientRect();
    const gap = summaryRect && bodyRect ? bodyRect.top - summaryRect.bottom : null;
    const bodyIntersectsViewport = Boolean(bodyRect && bodyRect.bottom > 0 && bodyRect.top < innerHeight);
    const inlineViewport = typeof matchMedia === "function"
      ? matchMedia(INLINE_DISCLOSURE_MEDIA).matches
      : false;

    return Object.freeze({
      open: Boolean(firstDisclosure?.open),
      inlineViewport,
      gap,
      bodyIntersectsViewport,
      immediateVisibleConsequence: Boolean(
        firstDisclosure?.open && bodyIntersectsViewport && gap !== null && gap <= MAX_IMMEDIATE_DISCLOSURE_GAP
      )
    });
  }

  function commitFirstDisclosureContinuity(source = "toggle") {
    if (!firstDisclosure || !firstDisclosureSummary || !firstDisclosureBody) {
      return;
    }

    const open = Boolean(firstDisclosure.open);
    firstDisclosureSummary.setAttribute("aria-expanded", String(open));
    documentElement.dataset.lawsFirstDisclosure = open ? "open" : "closed";

    requestAnimationFrame(() => {
      let snapshot = firstDisclosureSnapshot();
      if (open && snapshot.inlineViewport && !snapshot.immediateVisibleConsequence) {
        firstDisclosureBody.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: reducedMotion ? "auto" : "smooth"
        });
        snapshot = firstDisclosureSnapshot();
      }

      globalThis.dispatchEvent(new CustomEvent("LAWS_FIRST_DISCLOSURE_CONTINUITY", {
        detail: Object.freeze({
          contract: CONTRACT,
          source,
          ...snapshot,
          navigationAuthority: false,
          controllerAuthority: false,
          contentAuthority: false
        })
      }));
    });
  }

  function installFirstDisclosureContinuity() {
    if (!firstDisclosure) {
      return;
    }

    firstDisclosure.addEventListener("toggle", () => {
      commitFirstDisclosureContinuity("native-details-toggle");
    });
    commitFirstDisclosureContinuity("initialize");
  }

  function installStageObserver() {
    if (!stageNodes.length) {
      return;
    }

    if (typeof IntersectionObserver !== "function") {
      for (const node of stageNodes) {
        node.dataset.lawsExperienceVisible = "true";
      }
      return;
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        entry.target.dataset.lawsExperienceVisible = "true";
        observer.unobserve(entry.target);
      }
    }, {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12
    });

    for (const node of stageNodes) {
      observer.observe(node);
    }
  }

  function installParallax() {
    if (!hero || reducedMotion || typeof matchMedia !== "function") {
      return;
    }

    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      reducedMotion = true;
      return;
    }

    let frame = 0;

    function commit(event) {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 14;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 10;
      documentElement.style.setProperty("--laws-parallax-x", `${x.toFixed(2)}px`);
      documentElement.style.setProperty("--laws-parallax-y", `${y.toFixed(2)}px`);
    }

    hero.addEventListener("pointermove", event => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => commit(event));
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      documentElement.style.setProperty("--laws-parallax-x", "0px");
      documentElement.style.setProperty("--laws-parallax-y", "0px");
    }, { passive: true });
  }

  function installStellarContinuity() {
    if (!document.querySelector("link[data-laws-stellar-continuity-css]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = STELLAR_STYLE;
      link.dataset.lawsStellarContinuityCss = "true";
      document.head.append(link);
    }

    if (!document.querySelector("script[data-laws-background-cosmos]")) {
      const script = document.createElement("script");
      script.src = STELLAR_SCRIPT;
      script.defer = true;
      script.dataset.lawsBackgroundCosmos = "true";
      script.dataset.lawsPresentationOnly = "true";
      document.head.append(script);
    }
  }

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (typeof text === "string") {
      node.textContent = text;
    }
    return node;
  }

  function installRolodexStyles() {
    if (document.querySelector("style[data-laws-root-rolodex-css]")) {
      return;
    }

    const style = document.createElement("style");
    style.dataset.lawsRootRolodexCss = "true";
    style.textContent = `
html[data-laws-root-rolodex="active"] { --laws-rolodex-line: rgba(132, 218, 255, 0.24); --laws-rolodex-ink: var(--laws-experience-ink, #f2f7ff); --laws-rolodex-muted: var(--laws-experience-muted, #a9b9d3); }
html[data-laws-root-rolodex="active"] .laws-visitor-paths--rolodex { position: relative; display: grid; gap: clamp(4.5rem, 9vw, 9rem); width: 100%; max-width: 100%; padding: clamp(4rem, 8vw, 8rem) 0 clamp(5rem, 10vw, 10rem); overflow: clip; }
html[data-laws-root-rolodex="active"] .laws-rolodex-intro { width: min(100%, 48rem); margin: 0 auto; padding-inline: clamp(1rem, 3vw, 2.5rem); text-align: center; }
html[data-laws-root-rolodex="active"] .laws-rolodex-intro .laws-stage-number { margin-bottom: .9rem; }
html[data-laws-root-rolodex="active"] .laws-rolodex-intro h2 { margin: 0; font-size: clamp(2rem, 5vw, 4.8rem); line-height: .98; letter-spacing: -.045em; }
html[data-laws-root-rolodex="active"] .laws-rolodex-intro p:last-child { max-width: 42rem; margin: 1.1rem auto 0; color: var(--laws-rolodex-muted); font-size: clamp(1rem, 1.5vw, 1.16rem); line-height: 1.7; }
html[data-laws-root-rolodex="active"] .laws-rolodex-field { display: grid; grid-template-columns: minmax(13rem, .62fr) minmax(0, 1.38fr); align-items: center; gap: clamp(2rem, 7vw, 8rem); width: 100%; padding-inline: clamp(1rem, 4vw, 5rem); }
html[data-laws-root-rolodex="active"] .laws-rolodex-field[data-alignment="right"] .laws-rolodex-field__heading { grid-column: 2; grid-row: 1; }
html[data-laws-root-rolodex="active"] .laws-rolodex-field[data-alignment="right"] .laws-rolodex-field__browser { grid-column: 1; grid-row: 1; }
html[data-laws-root-rolodex="active"] .laws-rolodex-field__heading { align-self: center; max-width: 25rem; }
html[data-laws-root-rolodex="active"] .laws-rolodex-field__heading p { margin: 0 0 .8rem; color: rgba(128, 224, 255, .86); font-size: .74rem; font-weight: 760; letter-spacing: .16em; text-transform: uppercase; }
html[data-laws-root-rolodex="active"] .laws-rolodex-field__heading h3 { margin: 0; color: var(--laws-rolodex-ink); font-size: clamp(1.7rem, 3.5vw, 3.5rem); line-height: 1.02; letter-spacing: -.035em; }
html[data-laws-root-rolodex="active"] .laws-rolodex-field__browser { min-width: 0; }
html[data-laws-root-rolodex="active"] .laws-rolodex-controls { display: flex; justify-content: flex-end; align-items: center; gap: .65rem; margin: 0 0 .85rem; }
html[data-laws-root-rolodex="active"] .laws-rolodex-control { display: inline-grid; place-items: center; min-width: 2.75rem; min-height: 2.75rem; border: 1px solid var(--laws-rolodex-line); border-radius: 999px; background: rgba(8, 18, 36, .7); color: var(--laws-rolodex-ink); font: inherit; cursor: pointer; }
html[data-laws-root-rolodex="active"] .laws-rolodex-control:focus-visible, html[data-laws-root-rolodex="active"] .laws-rolodex-enter:focus-visible, html[data-laws-root-rolodex="active"] .laws-exhibit-return:focus-visible, html[data-laws-root-rolodex="active"] .laws-exhibit-route:focus-visible { outline: 2px solid rgba(128, 224, 255, .95); outline-offset: 4px; }
html[data-laws-root-rolodex="active"] .laws-rolodex-viewport { position: relative; overflow-x: auto; overflow-y: hidden; overscroll-behavior-inline: contain; scroll-snap-type: x mandatory; scrollbar-width: none; padding: clamp(.75rem, 1.5vw, 1.25rem) 12% clamp(1.4rem, 2.5vw, 2.2rem); }
html[data-laws-root-rolodex="active"] .laws-rolodex-viewport::-webkit-scrollbar { display: none; }
html[data-laws-root-rolodex="active"] .laws-rolodex-track { display: flex; gap: clamp(.9rem, 2vw, 1.6rem); min-width: max-content; }
html[data-laws-root-rolodex="active"] .laws-rolodex-card { box-sizing: border-box; flex: 0 0 min(74vw, 36rem); scroll-snap-align: center; display: grid; align-content: start; min-height: clamp(20rem, 32vw, 27rem); padding: clamp(1.5rem, 3vw, 2.6rem); border: 1px solid rgba(132, 218, 255, .16); border-radius: clamp(1.2rem, 2vw, 2rem); background: linear-gradient(145deg, rgba(8, 18, 36, .94), rgba(5, 11, 25, .78)); box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, .24); opacity: .42; transform: scale(.93); transition: opacity 220ms ease, transform 220ms ease, border-color 220ms ease; }
html[data-laws-root-rolodex="active"] .laws-rolodex-card[data-active="true"] { opacity: 1; transform: scale(1); border-color: rgba(132, 218, 255, .48); }
html[data-laws-root-rolodex="active"] .laws-rolodex-card__count { margin: 0 0 auto; color: rgba(128, 224, 255, .74); font-size: .72rem; letter-spacing: .13em; text-transform: uppercase; }
html[data-laws-root-rolodex="active"] .laws-rolodex-card h4 { margin: clamp(2rem, 6vw, 5rem) 0 0; color: var(--laws-rolodex-ink); font-size: clamp(1.55rem, 3vw, 2.55rem); line-height: 1.02; letter-spacing: -.035em; }
html[data-laws-root-rolodex="active"] .laws-rolodex-card__question { margin: 1rem 0 0; color: rgba(196, 240, 255, .95); font-size: clamp(1rem, 1.55vw, 1.18rem); font-weight: 650; line-height: 1.45; }
html[data-laws-root-rolodex="active"] .laws-rolodex-card__description { margin: .75rem 0 1.4rem; color: var(--laws-rolodex-muted); line-height: 1.65; }
html[data-laws-root-rolodex="active"] .laws-rolodex-enter { justify-self: start; margin-top: auto; padding: .78rem 1.1rem; border: 1px solid rgba(132, 218, 255, .42); border-radius: 999px; background: rgba(114, 226, 255, .08); color: var(--laws-rolodex-ink); font: inherit; font-weight: 740; cursor: pointer; }
html[data-laws-root-rolodex="active"] .laws-rolodex-position { min-width: 4.2rem; color: var(--laws-rolodex-muted); font-size: .78rem; letter-spacing: .08em; text-align: center; }
html[data-laws-root-rolodex="active"].laws-exhibit-open { overflow: hidden; }
html[data-laws-root-rolodex="active"].laws-exhibit-open .laws-shell { pointer-events: none; user-select: none; filter: saturate(.55) brightness(.48) blur(2px); }
.laws-exhibit-layer { position: fixed; z-index: 100000; inset: 0; display: grid; place-items: center; padding: clamp(.7rem, 2vw, 2rem); background: rgba(1, 4, 12, .72); backdrop-filter: blur(12px); }
.laws-exhibit { position: relative; display: grid; grid-template-rows: auto 1fr; width: min(100%, 72rem); max-height: calc(100svh - clamp(1.4rem, 4vw, 4rem)); overflow: hidden; border: 1px solid rgba(132, 218, 255, .34); border-radius: clamp(1rem, 2.5vw, 2.2rem); background: radial-gradient(circle at 80% 0%, rgba(60, 155, 210, .17), transparent 34%), linear-gradient(155deg, rgba(8, 18, 36, .99), rgba(3, 8, 20, .99)); box-shadow: 0 2rem 8rem rgba(0, 0, 0, .6); color: #f2f7ff; }
.laws-exhibit__bar { position: sticky; z-index: 2; top: 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem clamp(1rem, 3vw, 2rem); border-bottom: 1px solid rgba(132, 218, 255, .18); background: rgba(4, 10, 24, .94); }
.laws-exhibit__bar span { color: #a9b9d3; font-size: .72rem; letter-spacing: .13em; text-transform: uppercase; }
.laws-exhibit-return { padding: .7rem 1rem; border: 1px solid rgba(132, 218, 255, .38); border-radius: 999px; background: transparent; color: #f2f7ff; font: inherit; font-weight: 730; cursor: pointer; }
.laws-exhibit__scroll { overflow-y: auto; overscroll-behavior: contain; padding: clamp(2rem, 7vw, 6.5rem); }
.laws-exhibit__eyebrow { margin: 0 0 1rem; color: #80e0ff; font-size: .76rem; font-weight: 760; letter-spacing: .16em; text-transform: uppercase; }
.laws-exhibit h2 { max-width: 16ch; margin: 0; font-size: clamp(2.4rem, 7vw, 6.6rem); line-height: .91; letter-spacing: -.055em; }
.laws-exhibit__question { max-width: 44rem; margin: clamp(2rem, 5vw, 4rem) 0 0; color: #c4f0ff; font-size: clamp(1.25rem, 2.4vw, 2rem); font-weight: 680; line-height: 1.35; }
.laws-exhibit__description { max-width: 44rem; margin: 1rem 0 2.4rem; color: #a9b9d3; font-size: clamp(1rem, 1.5vw, 1.2rem); line-height: 1.75; }
.laws-exhibit-route { display: inline-flex; align-items: center; gap: .6rem; padding: .9rem 1.25rem; border: 1px solid rgba(132, 218, 255, .52); border-radius: 999px; background: rgba(114, 226, 255, .1); color: #f2f7ff; font-weight: 760; text-decoration: none; }
@media (min-width: 1201px) {
  html[data-laws-root-rolodex="active"] .laws-estate { width: min(100%, 118rem); max-width: none; padding-right: clamp(.75rem, 1.6vw, 1.75rem); padding-left: clamp(1rem, 2.5vw, 3rem); }
  html[data-laws-root-rolodex="active"] .laws-experience-hero { grid-template-columns: minmax(18rem, .66fr) minmax(0, 1.54fr) !important; gap: clamp(1rem, 2.2vw, 2.4rem) !important; }
  html[data-laws-root-rolodex="active"] .laws-compass-primary { width: calc(100% + clamp(.5rem, 1.6vw, 1.75rem)); margin-right: calc(clamp(.5rem, 1.6vw, 1.75rem) * -1); }
}
@media (min-width: 781px) and (max-width: 1200px) {
  html[data-laws-root-rolodex="active"] .laws-experience-hero { grid-template-columns: minmax(16rem, .72fr) minmax(0, 1.28fr) !important; gap: clamp(1rem, 2.2vw, 2rem) !important; }
  html[data-laws-root-rolodex="active"] .laws-rolodex-field { grid-template-columns: minmax(12rem, .52fr) minmax(0, 1.48fr); gap: clamp(1.5rem, 4vw, 3.5rem); padding-inline: clamp(1rem, 2.5vw, 2.5rem); }
  html[data-laws-root-rolodex="active"] .laws-rolodex-card { flex-basis: min(68vw, 32rem); }
}
@media (max-width: 780px) {
  html[data-laws-root-rolodex="active"] .laws-visitor-paths--rolodex { gap: 4.5rem; padding-top: 3.5rem; }
  html[data-laws-root-rolodex="active"] .laws-rolodex-field, html[data-laws-root-rolodex="active"] .laws-rolodex-field[data-alignment="right"] { display: block; padding-inline: 0; }
  html[data-laws-root-rolodex="active"] .laws-rolodex-field[data-alignment="right"] .laws-rolodex-field__heading, html[data-laws-root-rolodex="active"] .laws-rolodex-field[data-alignment="right"] .laws-rolodex-field__browser { grid-column: auto; grid-row: auto; }
  html[data-laws-root-rolodex="active"] .laws-rolodex-field__heading { padding-inline: 1rem; margin-bottom: 1.4rem; }
  html[data-laws-root-rolodex="active"] .laws-rolodex-controls { padding-inline: 1rem; }
  html[data-laws-root-rolodex="active"] .laws-rolodex-viewport { padding-inline: 9%; }
  html[data-laws-root-rolodex="active"] .laws-rolodex-card { flex-basis: 82vw; min-height: 23rem; }
  .laws-exhibit-layer { padding: 0; }
  .laws-exhibit { width: 100%; height: 100svh; max-height: none; border: 0; border-radius: 0; }
  .laws-exhibit__bar { padding-top: max(1rem, env(safe-area-inset-top)); }
  .laws-exhibit__scroll { padding: clamp(2rem, 9vw, 4rem) 1.25rem max(2rem, env(safe-area-inset-bottom)); }
}
@media (prefers-reduced-motion: reduce) {
  html[data-laws-root-rolodex="active"] .laws-rolodex-card { transition: none; }
  .laws-exhibit-layer { backdrop-filter: none; }
  html[data-laws-root-rolodex="active"].laws-exhibit-open .laws-shell { filter: brightness(.48); }
}
`;
    document.head.append(style);
  }

  function setActiveCard(groupId, index, focus = false) {
    const state = rolodexState.get(groupId);
    if (!state) {
      return;
    }

    const count = state.cards.length;
    const nextIndex = Math.max(0, Math.min(index, count - 1));
    state.index = nextIndex;

    state.cards.forEach((card, cardIndex) => {
      const active = cardIndex === nextIndex;
      card.dataset.active = String(active);
      card.setAttribute("aria-current", active ? "true" : "false");
    });

    state.position.textContent = `${nextIndex + 1} / ${count}`;
    state.cards[nextIndex].scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: reducedMotion ? "auto" : "smooth"
    });

    if (focus) {
      state.cards[nextIndex].querySelector(".laws-rolodex-enter")?.focus({ preventScroll: true });
    }
  }

  function moveRolodex(groupId, delta, focus = false) {
    const state = rolodexState.get(groupId);
    if (!state) {
      return;
    }

    const count = state.cards.length;
    const next = (state.index + delta + count) % count;
    setActiveCard(groupId, next, focus);
  }

  function updateActiveCardFromScroll(groupId) {
    const state = rolodexState.get(groupId);
    if (!state || state.scrollFrame) {
      return;
    }

    state.scrollFrame = requestAnimationFrame(() => {
      state.scrollFrame = 0;
      const viewportRect = state.viewport.getBoundingClientRect();
      const center = viewportRect.left + viewportRect.width / 2;
      let closestIndex = state.index;
      let closestDistance = Infinity;

      state.cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== state.index) {
        state.index = closestIndex;
        state.cards.forEach((card, index) => {
          const active = index === closestIndex;
          card.dataset.active = String(active);
          card.setAttribute("aria-current", active ? "true" : "false");
        });
        state.position.textContent = `${closestIndex + 1} / ${state.cards.length}`;
      }
    });
  }

  function getFocusable(container) {
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(node => !node.hidden && node.getAttribute("aria-hidden") !== "true");
  }

  function closeExhibit(reason = "return") {
    if (!exhibitState) {
      return;
    }

    const state = exhibitState;
    exhibitState = null;
    state.layer.removeEventListener("keydown", state.onKeydown);
    state.layer.remove();

    if (root) {
      root.inert = false;
      root.removeAttribute("inert");
      if (state.rootAriaHidden === null) {
        root.removeAttribute("aria-hidden");
      } else {
        root.setAttribute("aria-hidden", state.rootAriaHidden);
      }
    }

    documentElement.classList.remove("laws-exhibit-open");
    document.body.style.position = state.bodyStyles.position;
    document.body.style.top = state.bodyStyles.top;
    document.body.style.left = state.bodyStyles.left;
    document.body.style.right = state.bodyStyles.right;
    document.body.style.width = state.bodyStyles.width;
    document.body.style.overflowY = state.bodyStyles.overflowY;
    globalThis.scrollTo(state.scrollX, state.scrollY);

    const group = rolodexState.get(state.groupId);
    if (group) {
      setActiveCard(state.groupId, state.index, false);
    }

    requestAnimationFrame(() => {
      state.origin?.focus({ preventScroll: true });
    });

    globalThis.dispatchEvent(new CustomEvent("LAWS_ROLODEX_EXHIBIT_CLOSED", {
      detail: Object.freeze({ contract: CONTRACT, reason, destinationId: state.item.id })
    }));
  }

  function openExhibit(group, item, index, origin) {
    if (exhibitState) {
      closeExhibit("replace");
    }

    const scrollX = globalThis.scrollX;
    const scrollY = globalThis.scrollY;
    const layer = createElement("div", "laws-exhibit-layer");
    const dialog = createElement("section", "laws-exhibit");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", `laws-exhibit-title-${item.id}`);

    const bar = createElement("div", "laws-exhibit__bar");
    bar.append(createElement("span", "", group.eyebrow));
    const returnButton = createElement("button", "laws-exhibit-return", "Return to Rolodex");
    returnButton.type = "button";
    bar.append(returnButton);

    const scroll = createElement("div", "laws-exhibit__scroll");
    scroll.append(createElement("p", "laws-exhibit__eyebrow", group.eyebrow));
    const title = createElement("h2", "", item.name);
    title.id = `laws-exhibit-title-${item.id}`;
    scroll.append(title);
    scroll.append(createElement("p", "laws-exhibit__question", item.question));
    scroll.append(createElement("p", "laws-exhibit__description", item.description));
    const route = createElement("a", "laws-exhibit-route", "Enter destination");
    route.href = item.route;
    scroll.append(route);

    dialog.append(bar, scroll);
    layer.append(dialog);
    document.body.append(layer);

    const rootAriaHidden = root?.getAttribute("aria-hidden") ?? null;
    if (root) {
      root.inert = true;
      root.setAttribute("inert", "");
      root.setAttribute("aria-hidden", "true");
    }

    const bodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflowY: document.body.style.overflowY
    };

    documentElement.classList.add("laws-exhibit-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = `-${scrollX}px`;
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";

    const onKeydown = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeExhibit("escape");
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusable(dialog);
      if (!focusable.length) {
        event.preventDefault();
        returnButton.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    layer.addEventListener("keydown", onKeydown);
    returnButton.addEventListener("click", () => closeExhibit("return-control"));

    exhibitState = {
      layer,
      dialog,
      onKeydown,
      origin,
      groupId: group.id,
      index,
      item,
      scrollX,
      scrollY,
      bodyStyles,
      rootAriaHidden
    };

    requestAnimationFrame(() => returnButton.focus());

    globalThis.dispatchEvent(new CustomEvent("LAWS_ROLODEX_EXHIBIT_OPENED", {
      detail: Object.freeze({
        contract: CONTRACT,
        groupId: group.id,
        destinationId: item.id,
        route: item.route,
        navigationAuthority: false,
        contentAuthority: false
      })
    }));
  }

  function buildRolodexCard(group, item, index, count) {
    const card = createElement("article", "laws-rolodex-card");
    card.dataset.destinationId = item.id;
    card.dataset.active = String(index === 0);
    card.setAttribute("aria-current", index === 0 ? "true" : "false");

    card.append(createElement("p", "laws-rolodex-card__count", `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`));
    card.append(createElement("h4", "", item.name));
    card.append(createElement("p", "laws-rolodex-card__question", item.question));
    card.append(createElement("p", "laws-rolodex-card__description", item.description));

    const enter = createElement("button", "laws-rolodex-enter", "Enter");
    enter.type = "button";
    enter.setAttribute("aria-label", `Preview ${item.name}`);
    enter.addEventListener("click", () => openExhibit(group, item, index, enter));
    card.append(enter);
    return card;
  }

  function buildRolodexField(group) {
    const field = createElement("section", "laws-rolodex-field");
    field.dataset.rolodexId = group.id;
    field.dataset.alignment = group.alignment;
    field.setAttribute("aria-labelledby", `laws-rolodex-title-${group.id}`);

    const heading = createElement("header", "laws-rolodex-field__heading");
    heading.append(createElement("p", "", group.eyebrow));
    const headingTitle = createElement("h3", "", group.title);
    headingTitle.id = `laws-rolodex-title-${group.id}`;
    heading.append(headingTitle);

    const browser = createElement("div", "laws-rolodex-field__browser");
    const controls = createElement("div", "laws-rolodex-controls");
    const previous = createElement("button", "laws-rolodex-control", "←");
    previous.type = "button";
    previous.setAttribute("aria-label", `Previous item in ${group.eyebrow}`);
    const position = createElement("span", "laws-rolodex-position", `1 / ${group.items.length}`);
    position.setAttribute("aria-live", "polite");
    const next = createElement("button", "laws-rolodex-control", "→");
    next.type = "button";
    next.setAttribute("aria-label", `Next item in ${group.eyebrow}`);
    controls.append(previous, position, next);

    const viewport = createElement("div", "laws-rolodex-viewport");
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-label", `${group.eyebrow} destinations`);
    viewport.setAttribute("aria-roledescription", "Rolodex");
    const track = createElement("div", "laws-rolodex-track");
    const cards = group.items.map((item, index) => buildRolodexCard(group, item, index, group.items.length));
    track.append(...cards);
    viewport.append(track);
    browser.append(controls, viewport);
    field.append(heading, browser);

    rolodexState.set(group.id, {
      group,
      field,
      viewport,
      cards,
      position,
      index: 0,
      scrollFrame: 0
    });

    previous.addEventListener("click", () => moveRolodex(group.id, -1, false));
    next.addEventListener("click", () => moveRolodex(group.id, 1, false));
    viewport.addEventListener("scroll", () => updateActiveCardFromScroll(group.id), { passive: true });
    viewport.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveRolodex(group.id, -1, true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveRolodex(group.id, 1, true);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActiveCard(group.id, 0, true);
      } else if (event.key === "End") {
        event.preventDefault();
        setActiveCard(group.id, cards.length - 1, true);
      }
    });

    return field;
  }

  function installRolodex() {
    const legacy = document.querySelector(".laws-visitor-paths");
    if (!legacy || document.querySelector("[data-laws-root-rolodex-section]")) {
      return false;
    }

    installRolodexStyles();
    const section = createElement("section", "laws-visitor-paths--rolodex");
    section.dataset.lawsRootRolodexSection = "true";
    section.dataset.lawsExperienceStage = "paths";
    section.setAttribute("aria-labelledby", "laws-rolodex-root-title");

    const intro = createElement("header", "laws-rolodex-intro");
    intro.append(createElement("p", "laws-stage-number", "02 / CHOOSE A DESTINATION"));
    const title = createElement("h2", "", "Continue through the chamber.");
    title.id = "laws-rolodex-root-title";
    intro.append(title);
    intro.append(createElement(
      "p",
      "",
      "Choose what you want to understand, examine, or test. Each selection opens a concise preview before you enter its complete record."
    ));
    section.append(intro);

    for (const group of ROLODEXES) {
      section.append(buildRolodexField(group));
    }

    legacy.replaceWith(section);
    documentElement.dataset.lawsRootRolodex = "active";

    requestAnimationFrame(() => {
      for (const group of ROLODEXES) {
        setActiveCard(group.id, 0, false);
      }
    });

    globalThis.dispatchEvent(new CustomEvent("LAWS_ROOT_ROLODEX_READY", {
      detail: Object.freeze({
        contract: CONTRACT,
        groups: ROLODEXES.length,
        destinations: ROLODEXES.reduce((total, group) => total + group.items.length, 0),
        legacyRootRecordVisible: false,
        navigationAuthority: false,
        contentAuthority: false
      })
    }));

    return true;
  }

  function initialize() {
    installStellarContinuity();
    documentElement.dataset.lawsExperience = "active";
    applyCopy(deriveDirection(readControllerState()), "initialize");
    observeRootState();
    installCompassPreload();
    installFirstDisclosureContinuity();
    installStageObserver();
    connectController();
    installParallax();
    installRolodex();

    globalThis.addEventListener("LAWS_CONTROLLER_READY", connectController, { once: true });

    globalThis.DGB_LAWS_EXPERIENCE = Object.freeze({
      contract: CONTRACT,
      getDirection: () => activeDirection,
      refresh: () => applyCopy(deriveDirection(readControllerState()), "manual-refresh"),
      requestCompassRuntimePreload: () => requestCompassRuntimePreload("manual-presentation-request"),
      getFirstDisclosureSnapshot: firstDisclosureSnapshot,
      refreshFirstDisclosure: () => commitFirstDisclosureContinuity("manual-refresh"),
      getRolodexState: () => Object.freeze(Array.from(rolodexState.entries()).map(([id, state]) => Object.freeze({ id, index: state.index }))),
      closeExhibit: () => closeExhibit("public-api"),
      navigationAuthority: false,
      contentAuthority: false,
      controllerAuthority: false,
      evidenceAuthority: false
    });

    globalThis.dispatchEvent(new CustomEvent("LAWS_EXPERIENCE_READY", {
      detail: Object.freeze({
        contract: CONTRACT,
        route: "/laws/",
        navigationAuthority: false,
        controllerAuthority: false,
        evidenceAuthority: false,
        compassPreloadTarget: ".laws-compass-primary",
        compassPreloadMargin: COMPASS_PRELOAD_MARGIN,
        firstDisclosureMedia: INLINE_DISCLOSURE_MEDIA,
        maxImmediateDisclosureGap: MAX_IMMEDIATE_DISCLOSURE_GAP,
        rolodexActive: documentElement.dataset.lawsRootRolodex === "active",
        reducedMotion
      })
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
