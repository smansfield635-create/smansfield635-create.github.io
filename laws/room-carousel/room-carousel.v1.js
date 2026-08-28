(() => {
  "use strict";

  const CONTRACT = "LAWS_LAYERED_INFORMATION_GRID_CAROUSEL_v3";
  const REFERENCE = "LAWS_METHODS_CONTEXTUAL_INSPECTION_WITH_RESTORED_OUTER_ORBIT_AND_INTERNAL_STORY_RAIL";
  const CLASSIFY_PX = 8;
  const COMMIT_PX = 24;
  const AXIS_RATIO = 1.12;
  const LAYERS = Object.freeze([["practical", "Practical"], ["engineering", "Engineering"], ["empirical", "Empirical"]]);
  const scriptSource = document.currentScript?.src || "/laws/room-carousel/room-carousel.v1.js";
  const mapUrl = new URL("./route-card-map.v2.json", scriptSource).href;

  document.documentElement.classList.add("lr-js");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = (value, count) => ((value % count) + count) % count;
  const slug = value => String(value || "subject").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "subject";
  const textOf = node => node?.textContent?.replace(/\s+/g, " ").trim() || "";
  const escapeHtml = value => String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  function routeOf(root) {
    const declared = root.dataset.lrcRoute || document.documentElement.dataset.route;
    if (declared) return declared;
    return location.pathname.endsWith(".html") || location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
  }

  function directSourceNodes(root) {
    return Array.from(root.children).filter(node => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.matches("details.lr-audit,.lr-story-nav,[data-lrc-tabs],[data-lrc-viewport],[data-lrc-runtime],[data-lrc-static]")) return false;
      return node.matches("section,article,aside,nav,div");
    });
  }

  function ensureGreaterNavigation(root, map, route) {
    const existing = root.querySelector(":scope > .lr-story-nav");
    if (existing) return existing;
    const routeOrder = Object.keys(map.routes || {});
    const index = routeOrder.indexOf(route);
    if (index < 0 || routeOrder.length < 2) return null;
    const previous = routeOrder[wrap(index - 1, routeOrder.length)];
    const next = routeOrder[wrap(index + 1, routeOrder.length)];
    const nav = document.createElement("nav");
    nav.className = "lr-story-nav";
    nav.dataset.lrcRuntime = "true";
    nav.dataset.lrcSynthesized = "greater-laws-navigation";
    nav.setAttribute("aria-label", "Laws story context");
    nav.innerHTML = `<a href="${escapeHtml(previous)}"><span>Previous</span><strong>${escapeHtml(previous)}</strong></a><a href="${escapeHtml(next)}"><span>Next</span><strong>${escapeHtml(next)}</strong></a>`;
    const audit = root.querySelector(":scope > details.lr-audit");
    root.insertBefore(nav, audit || null);
    return nav;
  }

  function routeContext(root) {
    const lens = kind => textOf(root.querySelector(`[id*="panel-${kind}"],.lr-panel[data-tab-kind="${kind}"],[data-tab-kind="${kind}"].section-tab-panel`));
    const relationship = root.querySelector("#relationship-title,#reverse-title");
    const relation = textOf(relationship?.closest("section")?.querySelector(".lr-section__head p:last-child"));
    const boundaryNode = root.querySelector(".lr-boundary,aside[aria-label*='boundary' i]");
    const noStudy = /no current admitted study/i.test(textOf(root))
      ? "No current admitted study. This subject remains conceptual or procedural until a separate source is admitted."
      : "";
    return {
      relation,
      practical: lens("practical"),
      engineering: lens("engineering"),
      empirical: lens("empirical"),
      boundary: textOf(boundaryNode?.querySelector("p:last-child")) || textOf(boundaryNode),
      noStudy
    };
  }

  function sourceMaterial(root, definition, context) {
    const source = definition.sourceSelector ? root.querySelector(definition.sourceSelector) : null;
    const sourceSummary = textOf(source?.querySelector("summary p"));
    const sourcePanel = kinds => {
      for (const kind of kinds) {
        const panel = source?.querySelector(`.section-tab-panel[data-tab-kind="${kind}"],[role="tabpanel"][data-tab-kind="${kind}"]`);
        if (panel) return panel.innerHTML;
      }
      return "";
    };
    const manualLayer = (kind, value) => {
      const parts = [];
      if (value) parts.push(`<p>${escapeHtml(value)}</p>`);
      if (kind === "practical" && context.relation) parts.push(`<p class="lrc-route-context"><strong>Structural context.</strong> ${escapeHtml(context.relation)}</p>`);
      if (context[kind] && context[kind] !== value) parts.push(`<p class="lrc-route-context"><strong>Route reading.</strong> ${escapeHtml(context[kind])}</p>`);
      if (kind === "empirical" && context.noStudy && !/no current admitted study/i.test(value || "")) parts.push(`<p class="lrc-study-boundary">${escapeHtml(context.noStudy)}</p>`);
      return parts.join("") || "<p>This layer is intentionally compact on this subject.</p>";
    };
    const stories = Array.isArray(definition.stories) ? definition.stories.filter(story => {
      if (!story || !story.id || !story.label || !story.readings) return false;
      return LAYERS.every(([kind]) => typeof story.readings[kind] === "string" && story.readings[kind].trim());
    }) : [];
    return {
      label: definition.label || definition.id,
      summary: definition.summary || sourceSummary || definition.practical || context.relation || "Open this subject for its complete contextual reading.",
      practical: sourcePanel(["platform", "practical"]) || manualLayer("practical", definition.practical),
      engineering: sourcePanel(["engineering"]) || manualLayer("engineering", definition.engineering),
      empirical: sourcePanel(["evidence", "empirical"]) || manualLayer("empirical", definition.empirical),
      boundary: definition.boundary || context.boundary,
      href: definition.href || "",
      stories
    };
  }

  function makeCard(root, route, family, definition, index, count, context) {
    const material = sourceMaterial(root, definition, context);
    const id = slug(definition.id || material.label);
    const card = document.createElement("section");
    card.dataset.lrcCard = "";
    card.dataset.lrcRuntime = "true";
    card.dataset.lrcId = id;
    card.dataset.lrcLabel = material.label;
    card.dataset.lrcFamily = family;
    card.id = `lrc-${slug(route)}-${id}`;
    card.setAttribute("role", "tabpanel");
    card.setAttribute("aria-label", `${material.label}, ${index + 1} of ${count}`);

    const summary = document.createElement("div");
    summary.dataset.lrcSummary = "";
    summary.innerHTML = `
      <p data-lrc-summary-count>${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}</p>
      <p data-lrc-summary-kicker>${escapeHtml(family)} subject</p>
      <h2 data-lrc-summary-title>${escapeHtml(material.label)}</h2>
      <p data-lrc-summary-copy>${escapeHtml(material.summary)}</p>
      <button type="button" data-lrc-inspect aria-controls="${escapeHtml(card.id)}">Open ${escapeHtml(material.label)}</button>`;

    const inspection = document.createElement("div");
    inspection.dataset.lrcInspection = "";
    inspection.hidden = true;
    const stories = material.stories;
    if (stories.length < 4 || stories.length > 5) {
      card.dataset.lrcGridFailure = "story-count";
    }
    inspection.innerHTML = `
      <button type="button" data-lrc-return>↶ Return to Orbit</button>
      <header class="lrc-inspection-head"><p>${escapeHtml(family)} · contextual inspection</p><h2>${escapeHtml(material.label)}</h2><span>${escapeHtml(material.summary)}</span></header>
      <div data-lrc-information-grid>
        <div data-lrc-inner-tabs role="tablist" aria-label="${escapeHtml(material.label)} reading lenses">
          ${LAYERS.map(([kind, label], layerIndex) => `<button type="button" role="tab" data-lrc-inner-tab="${kind}" data-lrc-layer-index="${layerIndex}">${label}</button>`).join("")}
        </div>
        <div data-lrc-story-rail role="tablist" aria-orientation="vertical" aria-label="${escapeHtml(material.label)} story layers">
          ${stories.map((story, storyIndex) => `<button type="button" role="tab" data-lrc-story-tab="${escapeHtml(story.id)}" data-lrc-story-index="${storyIndex}"><span>${String(storyIndex + 1).padStart(2, "0")}</span><strong>${escapeHtml(story.label)}</strong></button>`).join("")}
        </div>
        <div data-lrc-grid-cells>
          ${stories.map((story, storyIndex) => LAYERS.map(([kind, label], layerIndex) => `<article id="${escapeHtml(card.id)}-${escapeHtml(story.id)}-${kind}" role="tabpanel" data-lrc-grid-cell data-lrc-story-index="${storyIndex}" data-lrc-layer-index="${layerIndex}" data-lrc-story-id="${escapeHtml(story.id)}" data-lrc-lens="${kind}"><p class="lrc-layer-label">${escapeHtml(story.label)} · ${label}</p><p>${escapeHtml(story.readings[kind])}</p>${kind === "empirical" && story.boundary ? `<aside data-lrc-claim-boundary><strong>Claim boundary</strong><p>${escapeHtml(story.boundary)}</p></aside>` : ""}</article>`).join("")).join("")}
        </div>
      </div>
      ${material.href ? `<p class="lrc-deep-route"><a href="${escapeHtml(material.href)}">Continue to ${escapeHtml(material.label)}</a></p>` : ""}`;
    card.append(summary, inspection);
    return card;
  }

  function createOuterTabs(root, viewport, cards) {
    const tabs = document.createElement("div");
    tabs.dataset.lrcTabs = "";
    tabs.dataset.lrcRuntime = "true";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Choose a page-specific Laws subject");
    tabs.style.setProperty("--lrc-count", String(cards.length));
    const buttons = cards.map((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lrcTab = "";
      button.dataset.lrcTabIndex = String(index);
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", card.id);
      button.innerHTML = `<span data-lrc-tab-number>${String(index + 1).padStart(2, "0")}</span><span data-lrc-tab-label>${escapeHtml(card.dataset.lrcLabel)}</span>`;
      tabs.append(button);
      return button;
    });
    root.insertBefore(tabs, viewport);
    return { tabs, buttons };
  }

  function mount(root, map) {
    if (root.dataset.lrcMounted === "true") return;
    const route = routeOf(root);
    const routeMap = map.routes?.[route];
    if (!routeMap?.cards?.length) {
      root.dataset.lrcFailure = "route-map-missing";
      return;
    }
    const declaredIds = (root.dataset.lrcCards || "").split(/\s+/).filter(Boolean);
    const mappedIds = routeMap.cards.map(card => card.id);
    if (declaredIds.length && declaredIds.join("|") !== mappedIds.join("|")) {
      root.dataset.lrcFailure = "route-declaration-mismatch";
      return;
    }

    root.dataset.lrcRoute = route;
    root.dataset.lrcFamily = routeMap.family;
    root.dataset.lrcOuterCards = mappedIds.join(" ");
    root.dataset.lrcInternalTabs = "practical engineering empirical";
    root.dataset.lrcCustody = "collapsed-subordinate";

    const storyNav = ensureGreaterNavigation(root, map, route);
    root.dataset.lrcGreaterNavigation = storyNav ? "bottom" : "not-declared";
    const audit = root.querySelector(":scope > details.lr-audit");
    if (audit) {
      audit.open = false;
      audit.dataset.lrcRole = "custody";
    }
    if (storyNav) storyNav.dataset.lrcRole = "greater-laws-navigation";

    const context = routeContext(root);
    directSourceNodes(root).forEach(node => {
      node.dataset.lrcContextSource = "";
      node.dataset.lrcOriginallyHidden = String(node.hidden);
      node.hidden = true;
    });

    const viewport = document.createElement("section");
    viewport.dataset.lrcViewport = "";
    viewport.dataset.lrcRuntime = "true";
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${textOf(root.querySelector("h1")) || "Laws"} subjects`);
    const track = document.createElement("div");
    track.dataset.lrcTrack = "";
    const cards = routeMap.cards.map((definition, index) => makeCard(root, route, routeMap.family, definition, index, routeMap.cards.length, context));
    cards.forEach(card => track.append(card));
    const live = document.createElement("p");
    live.dataset.lrcLive = "";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    viewport.append(track, live);
    root.insertBefore(viewport, root.firstChild);
    const { tabs, buttons } = createOuterTabs(root, viewport, cards);

    const state = {
      index: clamp(Number(root.dataset.lrcInitial || 0) || 0, 0, cards.length - 1),
      inspecting: false,
      layers: cards.map(() => 0),
      stories: cards.map(() => 0),
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
      const layer = LAYERS[state.layers[state.index]]?.[0] || "practical";
      const story = routeMap.cards[state.index]?.stories?.[state.stories[state.index]] || null;
      root.dataset.lrcIndex = String(state.index);
      root.dataset.lrcId = active.dataset.lrcId;
      root.dataset.lrcLayer = state.inspecting ? layer : "orbit";
      root.dataset.lrcStory = state.inspecting && story ? story.id : "orbit";
      root.dataset.lrcGestureState = state.dragging ? state.classification : "idle";
      live.textContent = `${active.dataset.lrcLabel} · ${state.index + 1} of ${cards.length}`;
      globalThis.dispatchEvent(new CustomEvent("LAWS_ROOM_CAROUSEL_CHANGED", {
        detail: Object.freeze({
          contract: CONTRACT,
          referenceContract: REFERENCE,
          reason,
          route,
          family: routeMap.family,
          count: cards.length,
          index: state.index,
          subjectId: active.dataset.lrcId,
          inspecting: state.inspecting,
          internalLayer: state.inspecting ? layer : null,
          internalStoryId: state.inspecting && story ? story.id : null,
          layeredInformationGrid: true,
          explicitInventory: true,
          internalStateIndependent: true,
          bottomStoryNavigationPreserved: Boolean(storyNav),
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
        card.querySelector(":scope > [data-lrc-summary]").hidden = inspecting;
        card.querySelector(":scope > [data-lrc-inspection]").hidden = !inspecting;
        const activeLayer = state.layers[index];
        const activeStory = state.stories[index];
        card.querySelectorAll("[data-lrc-inner-tab]").forEach((button, layerIndex) => {
          const selected = layerIndex === activeLayer;
          button.setAttribute("aria-selected", String(selected));
          button.tabIndex = selected ? 0 : -1;
        });
        card.querySelectorAll("[data-lrc-story-tab]").forEach((button, storyIndex) => {
          const selected = storyIndex === activeStory;
          button.setAttribute("aria-selected", String(selected));
          button.tabIndex = selected ? 0 : -1;
        });
        card.querySelectorAll("[data-lrc-grid-cell]").forEach(panel => {
          panel.hidden = Number(panel.dataset.lrcStoryIndex) !== activeStory || Number(panel.dataset.lrcLayerIndex) !== activeLayer;
        });
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
      state.layers[state.index] = 0;
      state.stories[state.index] = 0;
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

    function selectLayer(cardIndex, next, reason = "inner-tab-select", focus = false) {
      if (!state.inspecting || cardIndex !== state.index) return;
      state.layers[cardIndex] = wrap(next, LAYERS.length);
      render(reason);
      if (focus) cards[cardIndex].querySelectorAll("[data-lrc-inner-tab]")[state.layers[cardIndex]]?.focus({ preventScroll: true });
    }

    function selectStory(cardIndex, next, reason = "story-tab-select", focus = false) {
      if (!state.inspecting || cardIndex !== state.index) return;
      const storyCount = routeMap.cards[cardIndex]?.stories?.length || 0;
      if (!storyCount) return;
      state.stories[cardIndex] = wrap(next, storyCount);
      render(reason);
      if (focus) cards[cardIndex].querySelectorAll("[data-lrc-story-tab]")[state.stories[cardIndex]]?.focus({ preventScroll: true });
    }

    tabs.addEventListener("click", event => {
      const button = event.target.closest("[data-lrc-tab]");
      if (button) select(Number(button.dataset.lrcTabIndex), "outer-tab-direct-select");
    });
    tabs.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") select(0, "outer-tab-home", true);
      else if (event.key === "End") select(cards.length - 1, "outer-tab-end", true);
      else select(state.index + (event.key === "ArrowRight" ? 1 : -1), "outer-tab-arrow", true);
    });

    root.addEventListener("click", event => {
      if (event.target.closest("[data-lrc-inspect]")) return openInspection();
      if (event.target.closest("[data-lrc-return]")) return closeInspection();
      const inner = event.target.closest("[data-lrc-inner-tab]");
      if (inner) {
        event.stopPropagation();
        selectLayer(state.index, Number(inner.dataset.lrcLayerIndex));
        return;
      }
      const story = event.target.closest("[data-lrc-story-tab]");
      if (story) {
        event.stopPropagation();
        selectStory(state.index, Number(story.dataset.lrcStoryIndex));
      }
    });
    root.addEventListener("keydown", event => {
      const inner = event.target.closest("[data-lrc-inner-tab]");
      if (inner && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        const current = Number(inner.dataset.lrcLayerIndex);
        const next = event.key === "Home" ? 0 : event.key === "End" ? LAYERS.length - 1 : current + (event.key === "ArrowRight" ? 1 : -1);
        selectLayer(state.index, next, "inner-tab-keyboard", true);
        return;
      }
      const story = event.target.closest("[data-lrc-story-tab]");
      if (!story || !["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      const storyCount = routeMap.cards[state.index]?.stories?.length || 0;
      const current = Number(story.dataset.lrcStoryIndex);
      const next = event.key === "Home" ? 0 : event.key === "End" ? storyCount - 1 : current + (event.key === "ArrowDown" ? 1 : -1);
      selectStory(state.index, next, "story-tab-keyboard", true);
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
      if (state.inspecting || event.target.closest("a,button,input,textarea,select,summary,[data-lrc-inner-tabs]") || (event.pointerType === "mouse" && event.button !== 0)) return;
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
      if (state.classification === "none" && Math.max(Math.abs(totalX), Math.abs(totalY)) >= CLASSIFY_PX) state.classification = Math.abs(totalX) >= Math.abs(totalY) * AXIS_RATIO ? "horizontal" : "vertical";
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
      if (direction) select(state.index + direction, "pointer-one-step");
      else render(cancelled ? "pointer-cancel-noop" : "pointer-unclassified-noop");
    }
    viewport.addEventListener("pointerup", event => release(event, false));
    viewport.addEventListener("pointercancel", event => release(event, true));

    root.querySelectorAll("[data-lrc-controls],[data-lrc-prev],[data-lrc-next]").forEach(node => node.remove());
    root.dataset.lrcMounted = "true";
    root.dataset.lrcContract = CONTRACT;
    root.dataset.lrcReferenceContract = REFERENCE;
    root.dataset.lrcTabCount = String(cards.length);
    render("init");
  }

  fetch(mapUrl, { credentials: "same-origin" })
    .then(response => {
      if (!response.ok) throw new Error(`route-card-map:${response.status}`);
      return response.json();
    })
    .then(map => document.querySelectorAll("[data-laws-room-carousel]").forEach(root => mount(root, map)))
    .catch(error => document.documentElement.dataset.lrcMapFailure = error?.message || "route-card-map-unavailable");
})();
