/* /assets/compass/compass.cosmos.js
   Compass reconstruction v4 companion.

   Responsibilities:
   - render the repository-owned Fibonacci/golden-angle Starry Night as a
     decorative full-page background with sparse burst sparkle;
   - recompose the existing introduction without rewriting its argument;
   - remove redundant public-page sections identified in the locked plan;
   - make the existing lower Compass context respond to orbit/cardinal/room
     state without taking navigation or controller authority;
   - expose Mirrorland as a three-route discovery threshold;
   - preserve four-cardinal authority, existing cluster geometry, room routes,
     explicit Enter navigation, Return to Orbit, Back to Compass, keyboard,
     touch, and reduced-motion semantics.

   Mirrorland remains a threshold behind the map, never a fifth direction.
*/
(() => {
  "use strict";

  const GLOBAL_KEY = "DGB_COMPASS_RECONSTRUCTION_V4";
  if (globalThis[GLOBAL_KEY]?.initialized) return;

  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const FIELD_SEED = 0x44474243;
  const COLORS = Object.freeze([
    "255,248,224",
    "154,217,225",
    "234,208,131",
    "170,155,224"
  ]);

  const CARDINALS = Object.freeze({
    north: Object.freeze({
      eyebrow: "North · Orientation",
      title: "Find your bearings before you choose a destination.",
      purpose: "Orientation is the estate's context-facing direction: products, entry points, human origin, guidance, and philosophy. It helps you understand what kind of place you are entering before you commit to one room.",
      relationship: "Bring North forward when the question is still becoming clear. Open the star when you are ready to choose which kind of context would help most."
    }),
    east: Object.freeze({
      eyebrow: "East · Worlds",
      title: "Sometimes a system becomes clearer when you can stand inside it.",
      purpose: "Worlds turns comparison, environment, history, civilization, and consequence into places you can explore. The Atlas and planetary environments let different system choices remain visible without reducing them to one abstract explanation.",
      relationship: "Bring East forward when place, contrast, or an alternate world can reveal relationships that ordinary explanation leaves hidden."
    }),
    south: Object.freeze({
      eyebrow: "South · Instruments",
      title: "Measure, govern, and inspect without mistaking the instrument for the whole truth.",
      purpose: "Instruments gathers the Lab, Laws, Governance, and operational control surfaces. These rooms help turn patterns into measurements, rules, authority boundaries, and bounded next actions.",
      relationship: "Bring South forward when the next responsibility is to inspect what is happening, decide what can be said, or determine who is allowed to act."
    }),
    west: Object.freeze({
      eyebrow: "West · Frontier",
      title: "When understanding is no longer enough, build the next thing.",
      purpose: "Frontier is the estate's construction-facing direction: prototypes, energy, water, infrastructure, and long-range design. It is where unresolved problems become practical experiments and buildable systems.",
      relationship: "Bring West forward when the next question is not only what something means, but what should be made, tested, repaired, or carried forward."
    })
  });

  const ROOMS = Object.freeze({
    "north-1": Object.freeze({eyebrow:"Orientation · Products",title:"Choose the tool built for the job in front of you.",purpose:"Products is the shared entry point for Diamond Gate's dedicated operational systems. Each product has a narrower responsibility than the Compass and is designed to do work rather than explain the whole estate.",relationship:"Enter when you already know you need a focused instrument and want to compare the systems available."}),
    "north-2": Object.freeze({eyebrow:"Orientation · Guide Desk",title:"See how the estate fits together without turning it into one giant menu.",purpose:"Guide Desk explains the relationships among products, worlds, instruments, frontier systems, philosophical rooms, and entry paths in plain language.",relationship:"Enter when the map itself is the problem and you want a broad explanation before choosing a direction."}),
    "north-3": Object.freeze({eyebrow:"Orientation · Front Door",title:"Begin with the estate's formal introduction.",purpose:"Front Door is the intended threshold for visitors who want context before entering a specialized product, world, instrument, or construction path.",relationship:"Enter when you are new to Diamond Gate or prefer a guided arrival instead of choosing a specialized room first."}),
    "north-4": Object.freeze({eyebrow:"Orientation · Meet Sean",title:"Meet the person who built the estate and the path that shaped it.",purpose:"Meet Sean provides the human origin behind Diamond Gate Bridge: the experiences, questions, constraints, and ambitions that influenced the estate's architecture.",relationship:"Enter when knowing the builder's journey will help the rest of the estate make more sense."}),
    "north-5": Object.freeze({eyebrow:"Orientation · Philosophy Library",title:"Explore the values underneath the machinery.",purpose:"Philosophy Library carries the Nine Summits of Love and related work on responsibility, conviction, meaning, coherence, and the higher-self path.",relationship:"Enter when the question is not only what works, but what kind of relationship, responsibility, or future the work should support."}),

    "east-1": Object.freeze({eyebrow:"Worlds · Atlas Study",title:"Start with the planetary map before choosing a world.",purpose:"Atlas Study is the shared geographic orientation for the estate's worlds. It lets you compare environments and understand where each world sits in the larger planetary landscape.",relationship:"Enter when you want the map first and the destination second."}),
    "east-2": Object.freeze({eyebrow:"Worlds · ZIONTS",title:"Study a warning path built from recognizable choices.",purpose:"ZIONTS uses a familiar Earth trajectory to examine how social, environmental, and systemic decisions can accumulate into longer-term consequences.",relationship:"Enter when risk and consequence are easier to understand through a world that still feels close to home."}),
    "east-3": Object.freeze({eyebrow:"Worlds · Audralia",title:"Explore a civilization organized around diagnosis and institutional integrity.",purpose:"Audralia asks what changes when diagnostic reasoning, authority boundaries, governance, and coherence shape institutions and civilization at planetary scale.",relationship:"Enter when you want to see those principles expressed as a living world rather than a report."}),
    "east-4": Object.freeze({eyebrow:"Worlds · Hearth",title:"See systems through habitation, memory, survival, and place.",purpose:"Hearth is a living diagnostic world where land, settlement, inherited choices, survival, and environmental history are expressed through the environment itself.",relationship:"Enter when formal analysis needs the human weight of place and lived consequence."}),
    "east-5": Object.freeze({eyebrow:"Worlds · H-Earth",title:"Compare reality against a parallel Earth you can actually explore.",purpose:"H-Earth is the estate's interactive demonstration world. It uses an alternate Earth expression to make familiar assumptions, structures, and outcomes visible through direct exploration.",relationship:"Enter when contrast and interaction can reveal what familiarity conceals."}),

    "south-1": Object.freeze({eyebrow:"Instruments · The Lab",title:"Turn recurring pressure and pattern into something you can inspect.",purpose:"The Lab contains gauges and diagnostic surfaces for making conditions measurable without pretending that a measurement replaces context, judgment, or lived experience.",relationship:"Enter when comparison or measurement can clarify what repeated experience alone has not resolved."}),
    "south-2": Object.freeze({eyebrow:"Instruments · Law Library",title:"Ask what rule, boundary, or test should govern the claim.",purpose:"Law Library contains the estate's governing Laws chamber: Flow, Integrity, Reality, Structure, Test, Research, and the standards used to keep conclusions bounded.",relationship:"Enter when the next question is what changed, what remained intact, what the evidence shows, what shaped the result, or what was actually tested."}),
    "south-3": Object.freeze({eyebrow:"Instruments · Council Room",title:"Keep intent visible all the way to the decision.",purpose:"Council Room explains how Diamond Gate protects intent through authority, construction, verification, recovery, and delivery while keeping sophisticated engineering underneath one practical path.",relationship:"Enter when the question is who may decide, what is protected, how work stays controlled, or how a result earns the right to move forward."}),
    "south-4": Object.freeze({eyebrow:"Instruments · Control Cockpit",title:"Translate findings into a bounded next action.",purpose:"Control Cockpit is where observations, dispositions, constraints, and authority boundaries become operational direction without pretending uncertainty has disappeared.",relationship:"Enter when the evidence is sufficient to act but the action still needs explicit boundaries and control."}),

    "west-1": Object.freeze({eyebrow:"Frontier · Workshop Yard",title:"Move from unresolved problem to something buildable.",purpose:"Frontier Workshop Yard is the shared construction entry point for concepts, prototypes, technical pathways, and practical systems that do not yet have a finished form.",relationship:"Enter when the next responsibility is to make, test, or prototype rather than continue explaining."}),
    "west-2": Object.freeze({eyebrow:"Frontier · Energy Bench",title:"Treat energy as part of a system, not an isolated technology.",purpose:"Energy Bench examines generation, transfer, storage, efficiency, distribution, and loss in relationship with the infrastructure and environments that depend on them.",relationship:"Enter when power is one requirement inside a larger design problem."}),
    "west-3": Object.freeze({eyebrow:"Frontier · Water Bench",title:"Follow water from source to access, treatment, storage, and use.",purpose:"Water Bench examines how water moves through homes, communities, infrastructure, and larger environments while staying connected to energy, governance, habitation, and access.",relationship:"Enter when water is a system requirement whose consequences extend beyond the pipe."}),
    "west-4": Object.freeze({eyebrow:"Frontier · Infrastructure Bay",title:"Design for the systems people only notice when they stop working.",purpose:"Infrastructure Bay examines structural support, utilities, networks, maintenance, continuity, and the hidden dependencies required for ordinary operation.",relationship:"Enter when the design has to keep functioning after attention moves somewhere else."}),
    "west-5": Object.freeze({eyebrow:"Frontier · Vision Window",title:"Look far enough ahead to see what today's choices are building toward.",purpose:"Vision Window is the long-range planning space for possible futures, strategic direction, downstream effects, and the horizon created by present choices.",relationship:"Enter when immediate construction must remain accountable to the future it helps create."})
  });

  const GLOBAL_CONTEXT = Object.freeze({
    eyebrow: "The Compass · Signature interaction",
    title: "Rotate the estate. Bring a direction forward.",
    purpose: "This Compass is not a static menu. Drag with a mouse or swipe with a finger to rotate the constellation itself. As a cardinal star comes forward, the context below changes with it before you open anything.",
    relationship: "Explore without committing. Rotate first, open a cardinal when its direction fits, select a room, and use the explicit Enter action only when you are ready to leave the Compass."
  });

  const state = {
    initialized: false,
    root: null,
    scene: null,
    panel: null,
    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    enterButton: null,
    mirrorlandChoices: null,
    interacted: false,
    contextSignature: "",
    night: null,
    nightResizeTimer: 0,
    nightSparkleTimer: 0,
    reducedMotion: false
  };

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function randomFactory(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function installFibonacciNight() {
    const mount = document.createElement("div");
    mount.dataset.compassFibonacciNight = "";
    mount.setAttribute("aria-hidden", "true");
    const base = document.createElement("canvas");
    const sparkle = document.createElement("canvas");
    base.dataset.layer = "base";
    sparkle.dataset.layer = "sparkle";
    mount.append(base, sparkle);
    document.body.prepend(mount);

    const baseContext = base.getContext("2d", {alpha:true, desynchronized:true});
    const sparkleContext = sparkle.getContext("2d", {alpha:true, desynchronized:true});
    if (!baseContext || !sparkleContext) return;

    state.night = {mount, base, sparkle, baseContext, sparkleContext, width:0, height:0, dpr:1, stars:[], rogue:[]};
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      state.reducedMotion = Boolean(motion.matches || state.root?.dataset?.reducedMotion === "true");
      if (state.reducedMotion) sparkleContext.clearRect(0,0,state.night.width,state.night.height);
    };
    updateMotion();
    motion.addEventListener?.("change", updateMotion);

    const resize = () => {
      const width = Math.max(320, innerWidth || document.documentElement.clientWidth || 320);
      const height = Math.max(480, innerHeight || document.documentElement.clientHeight || 480);
      const dpr = Math.min(devicePixelRatio || 1, width <= 820 ? 1 : 1.25);
      Object.assign(state.night, {width, height, dpr});
      for (const canvas of [base, sparkle]) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      baseContext.setTransform(dpr,0,0,dpr,0,0);
      sparkleContext.setTransform(dpr,0,0,dpr,0,0);
      generateNight();
      drawNight();
    };

    const generateNight = () => {
      const {width, height} = state.night;
      const count = clamp(Math.round(width * height / 7200), 96, 210);
      const random = randomFactory(FIELD_SEED ^ width ^ (height << 7));
      const stars = [];
      for (let i = 0; i < count; i += 1) {
        const radius = Math.sqrt((i + .5) / count);
        const angle = i * GOLDEN_ANGLE + (random() - .5) * .12;
        const x = clamp(.5 + Math.cos(angle) * radius * .71 + (random() - .5) * .026, .012, .988);
        const y = clamp(.46 + Math.sin(angle) * radius * .60 + (random() - .5) * .026, .012, .988);
        const rogue = random() < .13;
        stars.push({
          x: x * width,
          y: y * height,
          radius: .45 + random() * 1.35,
          alpha: .23 + random() * .56,
          color: COLORS[Math.floor(random() * COLORS.length)],
          rogue
        });
      }
      state.night.stars = stars;
      state.night.rogue = stars.filter(star => star.rogue);
    };

    const drawStar = (ctx, star, alpha = star.alpha, scale = 1) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color},${alpha})`;
      ctx.shadowColor = `rgba(${star.color},${alpha * .65})`;
      ctx.shadowBlur = star.radius * scale * 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawNight = () => {
      baseContext.clearRect(0,0,state.night.width,state.night.height);
      for (const star of state.night.stars) drawStar(baseContext, star);
    };

    const sparkleBurst = () => {
      clearTimeout(state.nightSparkleTimer);
      if (state.reducedMotion || document.hidden || !state.night.rogue.length) return;
      sparkleContext.clearRect(0,0,state.night.width,state.night.height);
      const random = randomFactory(FIELD_SEED ^ Date.now());
      const pool = [...state.night.rogue].sort(() => random() - .5).slice(0, 3 + Math.floor(random() * 4));
      for (const star of pool) drawStar(sparkleContext, star, Math.min(.95, star.alpha + .25), 1.8 + random() * 1.4);
      setTimeout(() => sparkleContext.clearRect(0,0,state.night.width,state.night.height), 620);
      state.nightSparkleTimer = setTimeout(sparkleBurst, 2200 + random() * 2400);
    };

    window.addEventListener("resize", () => {
      clearTimeout(state.nightResizeTimer);
      state.nightResizeTimer = setTimeout(resize, 120);
    }, {passive:true});
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) sparkleBurst();
    });

    resize();
    state.nightSparkleTimer = setTimeout(sparkleBurst, 2800);
  }

  function recomposePage() {
    const introduction = document.querySelector(".compass-introduction");
    const introDetails = introduction?.querySelector(".compass-introduction__more");
    if (introDetails) {
      introDetails.open = true;
      introDetails.dataset.compassEditorialOpen = "true";
    }

    document.querySelector(".compass-practical-context")?.remove();
    document.querySelector(".compass-supporting-entry")?.remove();
    document.querySelector(".compass-discovery")?.remove();

    const orbitIntro = document.querySelector(".compass-orbit-intro");
    if (orbitIntro && !document.querySelector(".compass-action-bridge")) {
      const bridge = document.createElement("section");
      bridge.className = "compass-action-bridge";
      bridge.setAttribute("aria-label", "From premise to Compass");
      bridge.innerHTML = `
        <p class="compass-action-bridge__eyebrow">From premise to action</p>
        <h2>You do not have to begin with the right answer. Begin with the question you actually have.</h2>
        <p>The Compass lets you bring one kind of path into focus, see what it offers, and change direction without losing the larger landscape.</p>
      `;
      orbitIntro.before(bridge);
    }

    if (orbitIntro) {
      const kicker = orbitIntro.querySelector(".compass-estate__kicker");
      const title = orbitIntro.querySelector("h2");
      const paragraph = orbitIntro.querySelector("p:not(.compass-estate__kicker)");
      if (kicker) kicker.textContent = "Signature Compass Interaction";
      if (title) title.textContent = "Rotate the estate. Bring a direction forward.";
      if (paragraph) paragraph.textContent = "Drag with a mouse or swipe with a finger. The constellation rotates as one instrument, and the context beneath it changes as each cardinal direction comes forward.";

      if (!orbitIntro.querySelector(".compass-signature-controls")) {
        const controls = document.createElement("div");
        controls.className = "compass-signature-controls";
        controls.setAttribute("aria-label", "How to use the Compass");
        controls.innerHTML = "<span>1 · Drag or swipe to rotate</span><span>2 · Bring a direction forward</span><span>3 · Open the primary star</span>";
        orbitIntro.append(controls);
      }
      if (!orbitIntro.querySelector(".compass-mirrorland-hunt")) {
        const hunt = document.createElement("p");
        hunt.className = "compass-mirrorland-hunt";
        hunt.textContent = "There is a secret entrance to Mirrorland hidden inside the Compass. See if you can find it.";
        orbitIntro.append(hunt);
      }
    }

    const foundation = document.querySelector(".compass-supporting-foundation");
    if (foundation) {
      const kicker = foundation.querySelector(".compass-estate__kicker");
      const title = foundation.querySelector("h2");
      const lead = foundation.querySelector(".compass-supporting-foundation__header > p:last-child");
      if (kicker) kicker.textContent = "A Small Mathematical Foundation";
      if (title) title.textContent = "Keep the mathematics. Leave the encyclopedia to the rooms built for it.";
      if (lead) lead.textContent = "These relationships are enough to show the mathematical character beneath Diamond Gate. Deeper derivation, evidence, validation standing, and technical custody belong on the authoritative pages that own them.";
      if (!foundation.querySelector(".compass-math-editorial-line")) {
        const line = document.createElement("p");
        line.className = "compass-math-editorial-line";
        line.textContent = "A useful model should make a relationship easier to see without pretending the model is the whole reality.";
        foundation.querySelector(".compass-supporting-foundation__header")?.after(line);
      }
      for (const details of foundation.querySelectorAll("details")) details.open = false;
    }

    const guidance = document.querySelector("[data-compass-guidance]");
    if (guidance) guidance.textContent = "Swipe or drag to rotate. The context below follows the direction you bring forward.";
  }

  function installMirrorlandThreshold() {
    const actions = state.panel?.querySelector(".compass-panel__actions");
    if (!actions || state.mirrorlandChoices) return;
    const threshold = document.createElement("section");
    threshold.className = "compass-mirrorland-threshold";
    threshold.hidden = true;
    threshold.innerHTML = `
      <p class="compass-mirrorland-threshold__notice"><strong>Mirrorland is still under construction.</strong> You are welcome to explore what is already here.</p>
      <nav class="compass-mirrorland-threshold__routes" aria-label="Mirrorland destinations">
        <a href="/showroom/"><strong>Enter the Narrative</strong><span>Showroom · the narrative experience</span></a>
        <a href="/showroom/globe/h-earth/"><strong>Enter the Demo</strong><span>H-Earth · the interactive demo</span></a>
        <a href="/showroom/globe/audralia/"><strong>See the World Map</strong><span>Audralia Observatory · planetary map</span></a>
      </nav>
    `;
    actions.before(threshold);
    state.mirrorlandChoices = threshold;

    const mirrorlandObject = document.querySelector('[data-destination-type="mirrorland"]');
    mirrorlandObject?.addEventListener("click", event => {
      event.preventDefault();
      state.interacted = true;
      queueMicrotask(syncContext);
    }, true);

    state.enterButton?.addEventListener("click", event => {
      if (isMirrorlandActive()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  function isMirrorlandActive() {
    const mirror = String(state.root?.dataset?.mirrorlandWindowState || "");
    return mirror.includes("MIRRORLAND") || state.root?.dataset?.selectedDestinationType === "mirrorland";
  }

  function showMirrorland() {
    state.root.dataset.compassContextState = "mirrorland";
    state.root.dataset.compassContextCardinal = "";
    state.panelEyebrow.textContent = "Mirrorland · Secret threshold";
    state.panelTitle.textContent = "You found the entrance behind the map.";
    state.panelPurpose.textContent = "Mirrorland is not a fifth direction. It is a hidden threshold behind the Compass that opens three different ways of exploring the estate's constructed worlds.";
    state.panelRelationship.textContent = "Choose the narrative in Showroom, the interactive demo in H-Earth, or the planetary map in Audralia Observatory. All three are still under construction, and you are welcome to explore.";
    state.mirrorlandChoices.hidden = false;
    if (state.enterButton) state.enterButton.hidden = true;
  }

  function showContext(context, signature, cardinal = "", stateName = "context") {
    if (!context || !state.panelEyebrow || !state.panelTitle || !state.panelPurpose || !state.panelRelationship) return;
    state.root.dataset.compassContextState = stateName;
    state.root.dataset.compassContextCardinal = cardinal;
    state.panelEyebrow.textContent = context.eyebrow;
    state.panelTitle.textContent = context.title;
    state.panelPurpose.textContent = context.purpose;
    state.panelRelationship.textContent = context.relationship;
    if (state.mirrorlandChoices) state.mirrorlandChoices.hidden = true;
    if (state.enterButton) state.enterButton.hidden = stateName !== "room";
    state.contextSignature = signature;
  }

  function syncContext() {
    if (!state.root || !state.panel) return;
    if (isMirrorlandActive()) {
      showMirrorland();
      return;
    }

    const roomId = String(state.root.dataset.selectedRoom || "");
    const selectedCardinal = String(state.root.dataset.selectedCardinal || "");
    const orbitFocus = String(state.root.dataset.orbitFocus || "north");

    if (roomId && ROOMS[roomId]) {
      showContext(ROOMS[roomId], `room:${roomId}`, selectedCardinal || orbitFocus, "room");
      return;
    }

    if (selectedCardinal && CARDINALS[selectedCardinal]) {
      const c = CARDINALS[selectedCardinal];
      const clusterContext = Object.freeze({
        eyebrow: c.eyebrow.replace(" · ", " · Cluster · "),
        title: c.title,
        purpose: `${c.purpose} The cluster is open now; rotate it and bring one room forward to learn what that room means before entering.`,
        relationship: "Room selection changes this same context surface. Navigation does not occur until you use the explicit Enter action."
      });
      showContext(clusterContext, `cluster:${selectedCardinal}`, selectedCardinal, "cluster");
      return;
    }

    if (state.interacted && CARDINALS[orbitFocus]) {
      showContext(CARDINALS[orbitFocus], `cardinal:${orbitFocus}`, orbitFocus, "cardinal");
      return;
    }

    showContext(GLOBAL_CONTEXT, "global", "", "global");
  }

  function installStateObservation() {
    state.scene?.addEventListener("pointerdown", () => { state.interacted = true; }, {passive:true});
    state.scene?.addEventListener("touchstart", () => { state.interacted = true; }, {passive:true});
    state.scene?.addEventListener("click", () => { state.interacted = true; queueMicrotask(syncContext); }, {passive:true});

    const observer = new MutationObserver(() => queueMicrotask(syncContext));
    observer.observe(state.root, {
      attributes: true,
      attributeFilter: [
        "data-orbit-focus",
        "data-selected-cardinal",
        "data-selected-room",
        "data-selected-destination-type",
        "data-mirrorland-window-state",
        "data-compass-mode"
      ]
    });
  }

  function initialize() {
    state.root = document.querySelector("[data-compass-root]");
    state.scene = document.querySelector("[data-compass-scene]");
    state.panel = document.querySelector("[data-compass-panel]");
    if (!state.root || !state.scene || !state.panel) return;

    state.panelEyebrow = state.panel.querySelector("[data-compass-panel-eyebrow]");
    state.panelTitle = state.panel.querySelector("[data-compass-panel-title]");
    state.panelPurpose = state.panel.querySelector("[data-compass-panel-purpose]");
    state.panelRelationship = state.panel.querySelector("[data-compass-panel-relationship]");
    state.enterButton = state.panel.querySelector("[data-compass-enter]");

    state.root.dataset.compassReconstruction = "v4";
    state.root.dataset.compassContextState = "global";
    state.root.dataset.compassContextCardinal = "";

    recomposePage();
    installMirrorlandThreshold();
    installFibonacciNight();
    installStateObservation();
    syncContext();

    state.initialized = true;
    globalThis[GLOBAL_KEY] = Object.freeze({
      initialized: true,
      schema: "COMPASS_PAGE_RECONSTRUCTION_RUNTIME_v4",
      fibonacciSourceModel: "DGB_BUILD_GOVERNANCE_FIBONACCI_COSMOS_v7_GOLDEN_ANGLE_DERIVATION",
      stateLedContext: true,
      mirrorlandThreeRouteThreshold: true,
      ownsNavigation: false,
      ownsControllerState: false,
      ownsWorldGeometry: false
    });
    globalThis.dispatchEvent(new CustomEvent("DGB_COMPASS_RECONSTRUCTION_READY", {detail: globalThis[GLOBAL_KEY]}));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, {once:true});
  else initialize();
})();
