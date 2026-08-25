(() => {
  "use strict";

  const CONTRACT = "LAWS_ROOM_CAROUSEL_TABBED_ORBIT_INSPECTION_v2";
  const REFERENCE = "PUBLIC_LEGITIMACY_CAROUSEL_PARITY_AND_LAWS_DIRECTION_ONLY_ATOMIC";
  const CLASSIFY_PX = 8;
  const COMMIT_PX = 24;
  const AXIS_RATIO = 1.12;
  document.documentElement.classList.add("lr-js");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = (value, count) => ((value % count) + count) % count;
  const slug = value => String(value || "room").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "room";
  const textOf = node => node?.textContent?.replace(/\s+/g, " ").trim() || "";

  function nativeLabel(card, index) {
    return textOf(card.querySelector("h1,h2,h3")) || textOf(card.querySelector(".lr-kicker,.kicker")) || card.getAttribute("aria-label") || `Room ${index + 1}`;
  }

  function synopsisFor(card, label) {
    const candidates = [
      card.querySelector(".lr-question"),
      card.querySelector(".lr-lede"),
      card.querySelector(".lr-section__head p:not(.lr-kicker)"),
      card.querySelector(".lr-study-card > p"),
      card.querySelector("p:not(.lr-kicker):not(.kicker)")
    ];
    return candidates.map(textOf).find(value => value && value !== label) || "Open this stage to read its complete page-specific record.";
  }

  function sourceChildren(card) {
    return Array.from(card.querySelectorAll(":scope > [data-lrc-source-child]"));
  }

  function setSourceVisible(card, visible) {
    sourceChildren(card).forEach(node => {
      node.hidden = !visible || node.dataset.lrcOriginallyHidden === "true";
    });
  }

  function prepareCard(card, index, count) {
    const label = nativeLabel(card, index);
    card.dataset.lrcCard = "";
    card.dataset.lrcLabel = label;
    card.dataset.lrcId = card.id || `${slug(label)}-${index + 1}`;
    if (!card.id) card.id = `lrc-${card.dataset.lrcId}`;
    card.setAttribute("role", "tabpanel");
    card.setAttribute("aria-label", `${label}, ${index + 1} of ${count}`);

    if (!card.querySelector(":scope > [data-lrc-summary]")) {
      const originalChildren = Array.from(card.children);
      const kicker = textOf(card.querySelector(".lr-kicker,.kicker"));

      originalChildren.forEach(node => {
        node.dataset.lrcSourceChild = "";
        node.dataset.lrcOriginallyHidden = String(node.hidden);
        node.hidden = true;
      });

      const summary = document.createElement("div");
      summary.dataset.lrcSummary = "";
      summary.innerHTML = `
        <p data-lrc-summary-count>${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}</p>
        ${kicker && kicker !== label ? `<p data-lrc-summary-kicker></p>` : ""}
        <h2 data-lrc-summary-title></h2>
        <p data-lrc-summary-copy></p>
        <button type="button" data-lrc-inspect>Inspect this stage</button>`;
      const summaryKicker = summary.querySelector("[data-lrc-summary-kicker]");
      if (summaryKicker) summaryKicker.textContent = kicker;
      summary.querySelector("[data-lrc-summary-title]").textContent = label;
      summary.querySelector("[data-lrc-summary-copy]").textContent = synopsisFor(card, label);
      summary.querySelector("[data-lrc-inspect]").setAttribute("aria-controls", card.id);

      const close = document.createElement("button");
      close.type = "button";
      close.dataset.lrcReturn = "";
      close.textContent = "↶ Return to Orbit";
      close.setAttribute("aria-label", `Return ${label} to the carousel orbit`);
      close.hidden = true;
      card.prepend(close, summary);
    }
  }

  function createTabs(root, viewport, cards) {
    const existing = root.querySelector(":scope > [data-lrc-tabs]");
    if (existing) return { tabs: existing, buttons: Array.from(existing.querySelectorAll("[data-lrc-tab]")) };

    const tabs = document.createElement("div");
    tabs.dataset.lrcTabs = "";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Choose any part of this Laws reading sequence");
    tabs.style.setProperty("--lrc-count", String(cards.length));

    const buttons = cards.map((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lrcTab = "";
      button.dataset.lrcTabIndex = String(index);
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", card.id);
      const number = document.createElement("span");
      number.dataset.lrcTabNumber = "";
      number.textContent = String(index + 1).padStart(2, "0");
      const label = document.createElement("span");
      label.dataset.lrcTabLabel = "";
      label.textContent = card.dataset.lrcLabel || `Room ${index + 1}`;
      button.append(number, label);
      tabs.append(button);
      return button;
    });

    root.insertBefore(tabs, viewport);
    return { tabs, buttons };
  }

  function adoptNativeStoryboard(root) {
    const existingViewport = root.querySelector(":scope > [data-lrc-viewport]");
    const existingTrack = existingViewport?.querySelector(":scope > [data-lrc-track]");
    if (existingViewport && existingTrack) {
      existingViewport.querySelectorAll("[data-lrc-controls],[data-lrc-prev],[data-lrc-next]").forEach(node => node.remove());
      const cards = Array.from(existingTrack.querySelectorAll(":scope > [data-lrc-card]"));
      cards.forEach((card, index) => prepareCard(card, index, cards.length));
      let live = existingViewport.querySelector(":scope > [data-lrc-live]");
      if (!live) {
        live = document.createElement("p");
        live.dataset.lrcLive = "";
        live.setAttribute("aria-live", "polite");
        live.setAttribute("aria-atomic", "true");
        existingViewport.append(live);
      }
      return { viewport: existingViewport, track: existingTrack, cards, live };
    }

    const nativeChildren = Array.from(root.children).filter(node => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.matches("details.lr-audit,[data-lrc-depth],[data-lrc-static],[data-lrc-tabs],[data-lrc-viewport]")) return false;
      return node.matches("section,article,aside,nav,div");
    });
    if (nativeChildren.length < 1) return null;

    const viewport = document.createElement("section");
    viewport.dataset.lrcViewport = "";
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${document.title.split("·")[0].trim()} reading sequence`);

    const track = document.createElement("div");
    track.dataset.lrcTrack = "";

    nativeChildren.forEach((card, index) => {
      prepareCard(card, index, nativeChildren.length);
      track.appendChild(card);
    });

    const live = document.createElement("p");
    live.dataset.lrcLive = "";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");

    viewport.append(track, live);
    root.insertBefore(viewport, root.firstChild);
    return { viewport, track, cards: nativeChildren, live };
  }

  function mount(root) {
    const adopted = adoptNativeStoryboard(root);
    if (!adopted) return;
    const { viewport, cards, live } = adopted;
    if (!viewport || cards.length < 1) return;
    const { tabs, buttons } = createTabs(root, viewport, cards);

    const state = {
      index: clamp(Number(root.dataset.lrcInitial || 0) || 0, 0, cards.length - 1),
      inspecting: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      travel: 0,
      classification: "none",
      direction: 0,
      dragging: false
    };

    function deltaFor(index) {
      let delta = index - state.index;
      const half = cards.length / 2;
      if (delta > half) delta -= cards.length;
      if (delta < -half) delta += cards.length;
      return delta;
    }

    function publish(reason) {
      const active = cards[state.index];
      root.dataset.lrcIndex = String(state.index);
      root.dataset.lrcId = active.dataset.lrcId || String(state.index);
      root.dataset.lrcGestureState = state.dragging ? state.classification : "idle";
      if (live) live.textContent = `${active.dataset.lrcLabel || `Room ${state.index + 1}`} · ${state.index + 1} of ${cards.length}`;
      globalThis.dispatchEvent(new CustomEvent("LAWS_ROOM_CAROUSEL_CHANGED", {
        detail: Object.freeze({
          contract: CONTRACT,
          referenceContract: REFERENCE,
          reason,
          index: state.index,
          roomId: root.dataset.lrcId,
          inspecting: state.inspecting,
          completeNumberedTabRail: true,
          directNonAdjacentSelection: true,
          stableOrbitStage: true,
          boundedInspectionScroll: true,
          directionOnlyGesture: true,
          oneGestureOneStep: true,
          visibleDirectionalControls: false,
          sourceCompletenessClaimed: false,
          scientificValidationClaimed: false,
          productAcceptanceGranted: false
        })
      }));
    }

    function render(reason = "render") {
      cards.forEach((card, index) => {
        const delta = deltaFor(index);
        const abs = Math.abs(delta);
        const active = delta === 0;
        const adjacent = abs === 1;
        const inspecting = active && state.inspecting;
        card.style.setProperty("--lrc-offset", String(delta));
        card.style.setProperty("--lrc-depth-factor", active ? "1" : adjacent ? ".2" : "0");
        card.style.setProperty("--lrc-scale", active ? "1" : adjacent ? ".91" : ".82");
        card.style.setProperty("--lrc-opacity", active ? "1" : adjacent ? ".5" : "0");
        card.dataset.active = String(active);
        card.dataset.adjacent = String(adjacent);
        card.dataset.distant = String(abs > 1);
        card.dataset.inspecting = String(inspecting);
        card.setAttribute("aria-current", active ? "true" : "false");
        card.setAttribute("aria-hidden", active ? "false" : "true");
        if ("inert" in card) card.inert = !active;
        const summary = card.querySelector(":scope > [data-lrc-summary]");
        const close = card.querySelector(":scope > [data-lrc-return]");
        if (summary) summary.hidden = inspecting;
        if (close) close.hidden = !inspecting;
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
      const button = cards[state.index].querySelector("[data-lrc-inspect]");
      state.inspecting = false;
      delete root.dataset.lrcInspecting;
      delete document.documentElement.dataset.lrcInspectionOpen;
      render(reason);
      if (focus) button?.focus({ preventScroll: true });
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
      state.index = wrap(next, cards.length);
      render(reason);
      if (focus) buttons[state.index]?.focus({ preventScroll: true });
    }

    tabs.addEventListener("click", event => {
      const button = event.target.closest("[data-lrc-tab]");
      if (!button) return;
      select(Number(button.dataset.lrcTabIndex), "tab-direct-select");
    });

    tabs.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") select(0, "tab-home", true);
      else if (event.key === "End") select(cards.length - 1, "tab-end", true);
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
      if (state.inspecting || event.target.closest("input,textarea,select")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        select(state.index - 1, "keyboard-left", true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        select(state.index + 1, "keyboard-right", true);
      } else if (event.key === "Home") {
        event.preventDefault();
        select(0, "keyboard-home", true);
      } else if (event.key === "End") {
        event.preventDefault();
        select(cards.length - 1, "keyboard-end", true);
      }
    });

    viewport.addEventListener("pointerdown", event => {
      if (state.inspecting || event.target.closest("a,button,input,textarea,select,summary") || (event.pointerType === "mouse" && event.button !== 0)) return;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.travel = 0;
      state.classification = "none";
      state.direction = 0;
      state.dragging = true;
      viewport.dataset.dragging = "true";
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointermove", event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const totalX = event.clientX - state.startX;
      const totalY = event.clientY - state.startY;
      if (state.classification === "none" && Math.max(Math.abs(totalX), Math.abs(totalY)) >= CLASSIFY_PX) {
        state.classification = Math.abs(totalX) >= Math.abs(totalY) * AXIS_RATIO ? "horizontal" : "vertical";
      }
      if (state.classification === "horizontal") {
        state.travel = Math.abs(totalX);
        state.direction = totalX < 0 ? 1 : -1;
        event.preventDefault();
      }
      root.dataset.lrcGestureState = state.classification;
    }, { passive: false });

    function release(event, cancelled = false) {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const direction = !cancelled && state.classification === "horizontal" && state.travel >= COMMIT_PX ? state.direction : 0;
      state.dragging = false;
      viewport.dataset.dragging = "false";
      try { viewport.releasePointerCapture?.(event.pointerId); } catch {}
      state.pointerId = null;
      state.classification = "none";
      state.travel = 0;
      state.direction = 0;
      if (!direction) {
        render(cancelled ? "pointer-cancel-noop" : "pointer-unclassified-noop");
        return;
      }
      select(state.index + direction, "pointer-one-step");
    }

    viewport.addEventListener("pointerup", event => release(event, false));
    viewport.addEventListener("pointercancel", event => release(event, true));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && state.inspecting) closeInspection();
    });

    root.querySelectorAll("[data-lrc-controls],[data-lrc-prev],[data-lrc-next]").forEach(node => node.remove());
    root.dataset.lrcMounted = "true";
    root.dataset.lrcContract = CONTRACT;
    root.dataset.lrcReferenceContract = REFERENCE;
    root.dataset.lrcTabCount = String(cards.length);
    render("init");
  }

  document.querySelectorAll("[data-laws-room-carousel]").forEach(mount);
})();
