/*
 * Laws CP6 experiential presentation choreography.
 * Consumes controller-published state for presentation correspondence only.
 * Does not create routes, execute navigation, mutate evidence, or govern the Compass.
 */

(() => {
  "use strict";

  const CONTRACT = "LAWS_CP6_EXPERIENTIAL_PRESENTATION_v1";
  const STELLAR_STYLE = "/laws/index.stellar-continuity.css?v=LAWS_STELLAR_CONTINUITY_20260801A";
  const STELLAR_SCRIPT = "/laws/index.background-cosmos.js?v=LAWS_BACKGROUND_COSMOS_20260801A";

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

  const documentElement = document.documentElement;
  const root = document.querySelector("[data-laws-root]");
  const hero = document.querySelector("[data-laws-experience-stage='hero']");
  const speaker = document.querySelector("[data-laws-experience-speaker]");
  const speakerEyebrow = document.querySelector("[data-laws-experience-speaker-eyebrow]");
  const speakerTitle = document.querySelector("[data-laws-experience-speaker-title]");
  const speakerBody = document.querySelector("[data-laws-experience-speaker-body]");
  const speakerState = document.querySelector("[data-laws-experience-speaker-state]");
  const questionNodes = Array.from(document.querySelectorAll("[data-laws-experience-question]"));
  const stageNodes = Array.from(document.querySelectorAll("[data-laws-experience-stage]"));

  let unsubscribeCompass = null;
  let activeDirection = "";
  let reducedMotion = false;

  function normalizeDirection(value) {
    const direction = String(value || "").trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(COPY, direction)
      ? direction
      : "";
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

    globalThis.dispatchEvent(
      new CustomEvent("LAWS_EXPERIENCE_CORRESPONDENCE", {
        detail: Object.freeze({
          contract: CONTRACT,
          direction: normalized,
          source,
          navigationAuthority: false,
          contentAuthority: false
        })
      })
    );
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
    if (!document.querySelector('link[data-laws-stellar-continuity-css]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = STELLAR_STYLE;
      link.dataset.lawsStellarContinuityCss = "true";
      document.head.append(link);
    }

    if (!document.querySelector('script[data-laws-background-cosmos]')) {
      const script = document.createElement("script");
      script.src = STELLAR_SCRIPT;
      script.defer = true;
      script.dataset.lawsBackgroundCosmos = "true";
      script.dataset.lawsPresentationOnly = "true";
      document.head.append(script);
    }
  }

  function initialize() {
    installStellarContinuity();
    documentElement.dataset.lawsExperience = "active";
    applyCopy(deriveDirection(readControllerState()), "initialize");
    observeRootState();
    installStageObserver();
    connectController();
    installParallax();

    globalThis.addEventListener("LAWS_CONTROLLER_READY", connectController, { once: true });

    globalThis.DGB_LAWS_EXPERIENCE = Object.freeze({
      contract: CONTRACT,
      getDirection: () => activeDirection,
      refresh: () => applyCopy(deriveDirection(readControllerState()), "manual-refresh"),
      navigationAuthority: false,
      contentAuthority: false,
      controllerAuthority: false,
      evidenceAuthority: false
    });

    globalThis.dispatchEvent(
      new CustomEvent("LAWS_EXPERIENCE_READY", {
        detail: Object.freeze({
          contract: CONTRACT,
          route: "/laws/",
          navigationAuthority: false,
          controllerAuthority: false,
          evidenceAuthority: false,
          reducedMotion
        })
      })
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();