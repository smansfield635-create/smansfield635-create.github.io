(() => {
  "use strict";

  const CONTRACT = "LAWS_ROOM_CAROUSEL_L1_v1";
  document.documentElement.classList.add("lr-js");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = (value, count) => ((value % count) + count) % count;
  const slug = value => String(value || "room")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "room";

  function nativeLabel(card, index) {
    const heading = card.querySelector("h1,h2,h3");
    const kicker = card.querySelector(".lr-kicker");
    return (heading?.textContent || kicker?.textContent || card.getAttribute("aria-label") || `Room ${index + 1}`).trim();
  }

  function adoptNativeStoryboard(root) {
    const existingViewport = root.querySelector(":scope > [data-lrc-viewport]");
    const existingTrack = existingViewport?.querySelector(":scope > [data-lrc-track]");
    if (existingViewport && existingTrack) {
      return {
        viewport: existingViewport,
        track: existingTrack,
        cards: Array.from(existingTrack.querySelectorAll(":scope > [data-lrc-card]")),
        live: root.querySelector(":scope > [data-lrc-live], :scope > [data-lrc-viewport] [data-lrc-live]")
      };
    }

    const nativeChildren = Array.from(root.children).filter(node => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.matches("details.lr-audit,[data-lrc-depth],[data-lrc-static]")) return false;
      return node.matches("section,article,aside,nav,div");
    });
    if (nativeChildren.length < 2) return null;

    const viewport = document.createElement("section");
    viewport.dataset.lrcViewport = "";
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${document.title.split("·")[0].trim()} reading sequence`);

    const track = document.createElement("div");
    track.dataset.lrcTrack = "";

    nativeChildren.forEach((card, index) => {
      const label = nativeLabel(card, index);
      card.dataset.lrcCard = "";
      card.dataset.lrcLabel = label;
      card.dataset.lrcId = card.id || `${slug(label)}-${index + 1}`;
      track.appendChild(card);
    });

    const live = document.createElement("p");
    live.dataset.lrcLive = "";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");

    const controls = document.createElement("div");
    controls.dataset.lrcControls = "";
    const previous = document.createElement("button");
    previous.type = "button";
    previous.dataset.lrcPrev = "";
    previous.setAttribute("aria-label", "Previous reading room");
    previous.textContent = "←";
    const next = document.createElement("button");
    next.type = "button";
    next.dataset.lrcNext = "";
    next.setAttribute("aria-label", "Next reading room");
    next.textContent = "→";
    controls.append(previous, next);

    viewport.append(track, live, controls);
    root.insertBefore(viewport, root.firstChild);

    return { viewport, track, cards: nativeChildren, live };
  }

  function mount(root) {
    const adopted = adoptNativeStoryboard(root);
    if (!adopted) return;
    const { viewport, track, cards, live } = adopted;
    if (!viewport || !track || cards.length < 2) return;

    const state = {
      index: clamp(Number(root.dataset.lrcInitial || 0) || 0, 0, cards.length - 1),
      pointerId: null,
      startX: 0,
      lastX: 0,
      travel: 0,
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
      if (live) {
        const label = active.dataset.lrcLabel || active.getAttribute("aria-label") || `Room ${state.index + 1}`;
        live.textContent = `${label} · ${state.index + 1} of ${cards.length}`;
      }
      globalThis.dispatchEvent(new CustomEvent("LAWS_ROOM_CAROUSEL_CHANGED", {
        detail: Object.freeze({
          contract: CONTRACT,
          reason,
          index: state.index,
          roomId: root.dataset.lrcId,
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
        card.style.setProperty("--lrc-offset", String(delta));
        card.style.setProperty("--lrc-depth-factor", active ? "1" : adjacent ? ".2" : "0");
        card.style.setProperty("--lrc-scale", active ? "1" : adjacent ? ".91" : ".82");
        card.style.setProperty("--lrc-opacity", active ? "1" : adjacent ? ".52" : "0");
        card.dataset.active = String(active);
        card.dataset.adjacent = String(adjacent);
        card.dataset.distant = String(abs > 1);
        card.setAttribute("aria-current", active ? "true" : "false");
        if ("inert" in card) card.inert = !active;
        card.querySelectorAll("a,button,input,select,textarea,summary,[tabindex]").forEach(node => {
          if (!active) {
            if (!node.hasAttribute("data-lrc-tabindex")) node.setAttribute("data-lrc-tabindex", node.getAttribute("tabindex") ?? "");
            node.setAttribute("tabindex", "-1");
          } else if (node.hasAttribute("data-lrc-tabindex")) {
            const prior = node.getAttribute("data-lrc-tabindex");
            if (prior === "") node.removeAttribute("tabindex"); else node.setAttribute("tabindex", prior);
            node.removeAttribute("data-lrc-tabindex");
          }
        });
      });
      publish(reason);
    }

    function select(next, reason, focus = false) {
      state.index = wrap(next, cards.length);
      render(reason);
      if (focus) {
        const target = cards[state.index].querySelector("h1,h2,h3,[tabindex='0'],a,button") || cards[state.index];
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus?.({ preventScroll: true });
      }
    }

    root.querySelector("[data-lrc-prev]")?.addEventListener("click", () => select(state.index - 1, "previous-control", true));
    root.querySelector("[data-lrc-next]")?.addEventListener("click", () => select(state.index + 1, "next-control", true));

    viewport.addEventListener("keydown", event => {
      if (event.target.closest("input,textarea,select")) return;
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
      if (event.target.closest("a,button,input,textarea,select,summary") || (event.pointerType === "mouse" && event.button !== 0)) return;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.lastX = event.clientX;
      state.travel = 0;
      state.dragging = true;
      viewport.dataset.dragging = "true";
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointermove", event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const dx = event.clientX - state.lastX;
      state.travel += Math.abs(dx);
      state.lastX = event.clientX;
    });

    function release(event, cancelled = false) {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const total = event.clientX - state.startX;
      const threshold = Math.max(44, Math.min(96, viewport.clientWidth * .12));
      state.dragging = false;
      viewport.dataset.dragging = "false";
      try { viewport.releasePointerCapture?.(event.pointerId); } catch {}
      state.pointerId = null;
      if (cancelled || Math.abs(total) < threshold) {
        render(cancelled ? "pointer-cancel" : "pointer-return");
        return;
      }
      select(state.index + (total < 0 ? 1 : -1), "pointer-one-step");
    }

    viewport.addEventListener("pointerup", event => release(event, false));
    viewport.addEventListener("pointercancel", event => release(event, true));

    root.dataset.lrcMounted = "true";
    root.dataset.lrcContract = CONTRACT;
    render("init");
  }

  document.querySelectorAll("[data-laws-room-carousel]").forEach(mount);
})();
