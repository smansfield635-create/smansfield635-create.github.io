(() => {
  "use strict";

  const CONTRACT = "LAWS_FIVE_SCENE_CONTINUITY_CAROUSEL_v2";
  const REFERENCE = "LAWS_BACK_PAGE_CAROUSEL_PARITY_AND_BOTTOM_STORY_NAVIGATION";
  const ADOPTION_EXCLUSION_SELECTOR = "details.lr-audit,.lr-story-nav,[data-lrc-depth]";
  const COMMIT_PX = 24;
  const AXIS_RATIO = 1.12;
  const SCENES = Object.freeze([
    ["identity-meaning", "Identity / Meaning"],
    ["primary-relationship", "Primary Relationship"],
    ["reading-evidence", "Reading / Evidence"],
    ["custody-limits", "Custody / Limits"],
    ["continuation-handoff", "Continuation / Handoff"]
  ]);

  document.documentElement.classList.add("lr-js");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = value => ((value % SCENES.length) + SCENES.length) % SCENES.length;
  const textOf = node => node?.textContent?.replace(/\s+/g, " ").trim() || "";

  function sourceNodes(root) {
    return Array.from(root.children).filter(node => {
      if (!(node instanceof HTMLElement)) return false;
      if (!node.matches("section,article,aside,nav,div")) return false;
      if (node.matches(`${ADOPTION_EXCLUSION_SELECTOR},[data-lrc-static],[data-lrc-tabs],[data-lrc-viewport],[data-lrc-continuation]`)) return false;
      return !node.hasAttribute("data-lrc-runtime");
    });
  }

  function synopsisFor(nodes, label) {
    for (const node of nodes) {
      const candidate = node.querySelector?.(".lr-question,.lr-lede,.lr-section__head p:not(.lr-kicker),.lr-study-card > p,p:not(.lr-kicker):not(.kicker)");
      const value = textOf(candidate);
      if (value && value !== label) return value;
    }
    return "Open this scene to inspect its complete page-specific record.";
  }

  function makeCard(id, label, index) {
    const card = document.createElement("section");
    card.dataset.lrcCard = "";
    card.dataset.lrcScene = id;
    card.dataset.lrcRuntime = "true";
    card.dataset.lrcId = id;
    card.dataset.lrcLabel = label;
    card.id = `lrc-scene-${id}`;
    card.setAttribute("role", "tabpanel");
    card.setAttribute("aria-label", `${label}, ${index + 1} of ${SCENES.length}`);
    return card;
  }

  function bucketIndex(index, count) {
    if (index === 0) return 0;
    if (index === 1) return 1;
    if (index === 2) return 2;
    if (index === count - 1 && count >= 5) return 4;
    return 3;
  }

  function distribute(nodes, cards) {
    const buckets = cards.map(() => []);
    nodes.forEach((node, index) => buckets[bucketIndex(index, nodes.length)].push(node));

    cards.forEach((card, index) => {
      const [id, label] = SCENES[index];
      if (!buckets[index].length) {
        const bridge = document.createElement("div");
        bridge.dataset.lrcGeneratedBridge = "";
        bridge.innerHTML = `<p class="lr-depth-label">${label}</p><p>This scene is intentionally compact on this route. Continue through the same five-scene object for the complete record.</p>`;
        buckets[index].push(bridge);
      }

      const summary = document.createElement("div");
      summary.dataset.lrcSummary = "";
      summary.innerHTML = `
        <p data-lrc-summary-count>${String(index + 1).padStart(2, "0")} / 05</p>
        <p data-lrc-summary-kicker>Five-scene Laws continuity</p>
        <h2 data-lrc-summary-title></h2>
        <p data-lrc-summary-copy></p>
        <button type="button" data-lrc-inspect>Inspect this scene</button>`;
      summary.querySelector("[data-lrc-summary-title]").textContent = label;
      summary.querySelector("[data-lrc-summary-copy]").textContent = synopsisFor(buckets[index], label);
      summary.querySelector("[data-lrc-inspect]").setAttribute("aria-controls", card.id);

      const close = document.createElement("button");
      close.type = "button";
      close.dataset.lrcReturn = "";
      close.textContent = "↶ Return to Orbit";
      close.setAttribute("aria-label", `Return ${label} to the carousel orbit`);
      close.hidden = true;

      card.append(summary, close);
      buckets[index].forEach(node => {
        node.dataset.lrcSourceChild = "";
        node.dataset.lrcSourceScene = id;
        node.dataset.lrcOriginallyHidden = String(node.hidden);
        node.hidden = true;
        card.append(node);
      });
    });
  }

  function setSourceVisible(card, visible) {
    card.querySelectorAll(":scope > [data-lrc-source-child]").forEach(node => {
      node.hidden = !visible || node.dataset.lrcOriginallyHidden === "true";
    });
  }

  function createTabs(root, viewport, cards) {
    const tabs = document.createElement("nav");
    tabs.dataset.lrcTabs = "";
    tabs.dataset.lrcRuntime = "true";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Five Laws story scenes");
    tabs.style.setProperty("--lrc-count", String(cards.length));

    cards.forEach((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lrcTab = "";
      button.dataset.lrcTabIndex = String(index);
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", card.id);

      const ordinal = document.createElement("span");
      ordinal.dataset.lrcTabNumber = "";
      ordinal.textContent = String(index + 1).padStart(2, "0");
      const label = document.createElement("span");
      label.dataset.lrcTabLabel = "";
      label.textContent = SCENES[index][1];
      button.append(ordinal, label);
      tabs.append(button);
    });

    viewport.after(tabs);
    return { tabs, buttons: Array.from(tabs.querySelectorAll("[data-lrc-tab]")) };
  }

  function mount(root) {
    if (root.dataset.lrcMounted === "true") return;
    const nodes = sourceNodes(root);
    if (!nodes.length) return;

    const storyNav = root.querySelector(":scope > .lr-story-nav");
    const audit = root.querySelector(":scope > details.lr-audit");

    const viewport = document.createElement("section");
    viewport.dataset.lrcViewport = "";
    viewport.dataset.lrcRuntime = "true";
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", "Five-scene Laws story");

    const track = document.createElement("div");
    track.dataset.lrcTrack = "";
    const cards = SCENES.map(([id, label], index) => makeCard(id, label, index));
    distribute(nodes, cards);
    cards.forEach(card => track.append(card));

    const live = document.createElement("p");
    live.dataset.lrcLive = "";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    viewport.append(track, live);
    root.insertBefore(viewport, root.firstChild);

    const { tabs, buttons } = createTabs(root, viewport, cards);
    if (storyNav) tabs.after(storyNav);
    if (audit && audit.parentElement === root) root.append(audit);

    const state = {
      index: clamp(Number(root.dataset.lrcInitial || 0) || 0, 0, 4),
      inspecting: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      dragging: false,
      classification: "idle"
    };

    function publish(reason) {
      root.dataset.lrcIndex = String(state.index);
      root.dataset.lrcId = SCENES[state.index][0];
      root.dataset.lrcScene = SCENES[state.index][0];
      root.dataset.lrcMounted = "true";
      root.dataset.lrcSceneCount = "5";
      root.dataset.lrcTabCount = "5";
      root.dataset.lrcGestureState = state.dragging ? state.classification : "idle";
      if (storyNav) root.dataset.lrcStoryNavigation = "bottom";
      else delete root.dataset.lrcStoryNavigation;
      live.textContent = `${SCENES[state.index][1]} · ${state.index + 1} of 5`;
      globalThis.dispatchEvent(new CustomEvent("LAWS_ROOM_CAROUSEL_CHANGED", {
        detail: Object.freeze({
          contract: CONTRACT,
          referenceContract: REFERENCE,
          reason,
          sceneCount: 5,
          index: state.index,
          sceneId: SCENES[state.index][0],
          inspecting: state.inspecting,
          bottomTabs: true,
          detachedSixthState: false,
          storyRouteNavigationExternal: true,
          completeNumberedTabRail: true,
          directNonAdjacentSelection: true,
          stableOrbitStage: true,
          boundedInspectionScroll: true,
          directionOnlyGesture: true,
          oneGestureOneStep: true
        })
      }));
    }

    function render(reason = "render") {
      cards.forEach((card, index) => {
        const active = index === state.index;
        const inspecting = active && state.inspecting;
        card.dataset.active = String(active);
        card.dataset.inspecting = String(inspecting);
        card.setAttribute("aria-current", active ? "true" : "false");
        card.setAttribute("aria-hidden", active ? "false" : "true");
        if ("inert" in card) card.inert = !active;
        card.hidden = !active;
        const summary = card.querySelector(":scope > [data-lrc-summary]");
        const close = card.querySelector(":scope > [data-lrc-return]");
        summary.hidden = inspecting;
        close.hidden = !inspecting;
        setSourceVisible(card, inspecting);
      });

      buttons.forEach((button, index) => {
        const active = index === state.index;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      tabs.dataset.lrcActiveIndex = String(state.index);
      viewport.dataset.lrcInspecting = String(state.inspecting);
      publish(reason);
    }

    function closeInspection(reason = "inspection-close", focus = true) {
      if (!state.inspecting) return;
      const inspectButton = cards[state.index].querySelector("[data-lrc-inspect]");
      state.inspecting = false;
      delete root.dataset.lrcInspecting;
      delete document.documentElement.dataset.lrcInspectionOpen;
      render(reason);
      if (focus) inspectButton?.focus({ preventScroll: true });
    }

    function openInspection(reason = "inspection-open") {
      if (state.inspecting) return;
      state.inspecting = true;
      root.dataset.lrcInspecting = "true";
      document.documentElement.dataset.lrcInspectionOpen = "true";
      render(reason);
      requestAnimationFrame(() => cards[state.index].querySelector("[data-lrc-return]")?.focus({ preventScroll: true }));
    }

    function select(next, reason, focus = false) {
      if (state.inspecting) closeInspection("inspection-close-before-selection", false);
      state.index = wrap(next);
      render(reason);
      if (focus) buttons[state.index]?.focus({ preventScroll: true });
    }

    tabs.addEventListener("click", event => {
      const button = event.target.closest("[data-lrc-tab]");
      if (button) select(Number(button.dataset.lrcTabIndex), "tab-direct-select");
    });

    tabs.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") select(0, "tab-home", true);
      else if (event.key === "End") select(4, "tab-end", true);
      else select(state.index + (event.key === "ArrowRight" ? 1 : -1), "tab-arrow", true);
    });

    root.addEventListener("click", event => {
      if (event.target.closest("[data-lrc-inspect]")) openInspection();
      else if (event.target.closest("[data-lrc-return]")) closeInspection();
    });

    viewport.addEventListener("keydown", event => {
      if (event.key === "Escape" && state.inspecting) {
        event.preventDefault();
        closeInspection();
        return;
      }
      if (state.inspecting || event.target.closest("a,button,input,textarea,select,summary")) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); select(state.index - 1, "keyboard-left", true); }
      else if (event.key === "ArrowRight") { event.preventDefault(); select(state.index + 1, "keyboard-right", true); }
      else if (event.key === "Home") { event.preventDefault(); select(0, "keyboard-home", true); }
      else if (event.key === "End") { event.preventDefault(); select(4, "keyboard-end", true); }
    });

    viewport.addEventListener("pointerdown", event => {
      if (state.inspecting || event.target.closest("a,button,input,textarea,select,summary") || (event.pointerType === "mouse" && event.button !== 0)) return;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.dragging = true;
      state.classification = "pending";
      viewport.setPointerCapture?.(event.pointerId);
      publish("pointer-down");
    });

    viewport.addEventListener("pointermove", event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      state.classification = Math.abs(dx) > Math.abs(dy) * AXIS_RATIO ? "horizontal" : "vertical";
      publish("pointer-classify");
    });

    function finishPointer(event) {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      const horizontal = Math.abs(dx) >= COMMIT_PX && Math.abs(dx) > Math.abs(dy) * AXIS_RATIO;
      state.dragging = false;
      state.pointerId = null;
      state.classification = "idle";
      if (horizontal) select(state.index + (dx < 0 ? 1 : -1), "pointer-one-step");
      else render("pointer-settle");
    }

    viewport.addEventListener("pointerup", finishPointer);
    viewport.addEventListener("pointercancel", event => {
      if (event.pointerId !== state.pointerId) return;
      state.dragging = false;
      state.pointerId = null;
      state.classification = "idle";
      render("pointer-cancel");
    });

    render("mount");
  }

  const run = () => document.querySelectorAll("[data-laws-room-carousel]").forEach(mount);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();
})();
