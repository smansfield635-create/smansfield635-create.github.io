(() => {
  "use strict";

  const source = globalThis.METHODS_MODELS_CAROUSEL_DATA;
  const root = document.querySelector("[data-mm-carousel]");
  if (!root || !source?.families?.length) return;

  const ring = root.querySelector("[data-mm-ring]");
  const viewport = root.querySelector("[data-mm-viewport]");
  const tabs = root.querySelector("[data-mm-family-tabs]");
  const live = root.querySelector("[data-mm-live]");
  const familyTitle = root.querySelector("[data-mm-family-title]");
  const familyQuestion = root.querySelector("[data-mm-family-question]");
  const families = source.families;
  const modelIndices = families.map(() => 0);
  const cards = [];

  const state = {
    index: 0,
    angle: 0,
    dragging: false,
    pointerId: null,
    pointerStartX: 0,
    pointerStartAngle: 0,
    pointerLastX: 0,
    pointerLastTime: 0,
    pointerTravel: 0,
    velocity: 0,
    inspecting: false,
    settling: false,
    settleTimer: null,
    suppressClick: false
  };

  const count = families.length;
  const step = 360 / count;
  const normalize = value => ((value % count) + count) % count;
  const angleForIndex = index => -normalize(index) * step;
  const selectedFamily = () => families[state.index];
  const reducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  function radius() {
    const width = Math.max(320, viewport.clientWidth || root.clientWidth || 960);
    if (width < 520) return Math.max(245, Math.min(330, width * .72));
    if (width < 820) return Math.max(320, Math.min(440, width * .58));
    return Math.max(430, Math.min(650, width * .49));
  }

  function modelMarkup(family, familyIndex) {
    const choices = family.models.map((model, index) => `
      <button class="mm-model-choice" type="button" role="tab" data-model-index="${index}" aria-selected="${index === modelIndices[familyIndex]}">${model.title}</button>`).join("");
    return `
      <div class="mm-card__inspection" data-inspection>
        <div class="mm-inspection__rail" role="tablist" aria-label="${family.label} models">
          <h3>${family.label}</h3>
          ${choices}
        </div>
        <div class="mm-inspection__detail" data-model-detail tabindex="0"></div>
      </div>`;
  }

  function createCard(family, index) {
    const article = document.createElement("article");
    article.className = "mm-card";
    article.dataset.familyIndex = String(index);
    article.dataset.familyId = family.id;
    article.dataset.active = String(index === state.index);
    article.dataset.inspecting = "false";
    article.setAttribute("aria-hidden", String(index !== state.index));
    article.innerHTML = `
      <div class="mm-card__surface">
        <button class="mm-inspection__close" type="button" data-close-inspection aria-label="Return to Orbit" hidden>
          <span aria-hidden="true">↶</span><span>Return to Orbit</span>
        </button>
        <div class="mm-card__top">
          <span class="mm-card__ordinal">${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}</span>
          <span class="mm-card__status">Research family</span>
        </div>
        <div class="mm-card__body">
          <p class="mm-eyebrow">Methods & Models</p>
          <h3>${family.title}</h3>
          <p class="mm-card__question">${family.question}</p>
          <div class="mm-card__equation">${family.models[0]?.equation || ""}</div>
          <button class="mm-card__action" type="button" data-open-inspection>Inspect this object</button>
          ${modelMarkup(family, index)}
        </div>
      </div>`;
    ring.append(article);
    cards.push(article);
    renderModelDetail(article, index, modelIndices[index]);
    article.querySelector("[data-open-inspection]")?.addEventListener("click", event => {
      event.stopPropagation();
      openInspection(article, "inspect-button");
    });
    const returnControl = article.querySelector("[data-close-inspection]");
    returnControl?.addEventListener("pointerdown", event => {
      event.preventDefault();
      event.stopPropagation();
      closeInspection("return-to-orbit-pointer");
    });
    returnControl?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      if (state.inspecting) closeInspection("return-to-orbit-button");
    });
  }

  function renderTabs() {
    tabs.replaceChildren(...families.map((family, index) => {
      const button = document.createElement("button");
      button.className = "mm-family-tab";
      button.type = "button";
      button.role = "tab";
      button.dataset.familyIndex = String(index);
      button.dataset.indexLabel = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
      button.id = `mm-family-tab-${family.id}`;
      button.setAttribute("aria-selected", String(index === state.index));
      button.tabIndex = index === state.index ? 0 : -1;
      button.textContent = family.label;
      return button;
    }));
  }

  function renderModelDetail(card, familyIndex, modelIndex) {
    const family = families[familyIndex];
    const model = family.models[modelIndex];
    const detail = card.querySelector("[data-model-detail]");
    if (!detail || !model) return;
    card.querySelectorAll("[data-model-index]").forEach((button, index) => {
      button.setAttribute("aria-selected", String(index === modelIndex));
      button.tabIndex = index === modelIndex ? 0 : -1;
    });
    detail.innerHTML = `
      <p class="mm-eyebrow">${model.status}</p>
      <h4>${model.title}</h4>
      <div class="mm-inspection__equation">${model.equation}</div>
      <p class="mm-inspection__statement">${model.statement}</p>
      <div class="mm-inspection__grid">
        <section class="mm-inspection__section"><strong>Practical reading</strong><p>${model.practical}</p></section>
        <section class="mm-inspection__section"><strong>Purpose</strong><p>${model.purpose}</p></section>
        <section class="mm-inspection__section"><strong>Failure behavior</strong><p>${model.failure}</p></section>
        <section class="mm-inspection__section"><strong>Limits</strong><p>${model.limits}</p></section>
      </div>`;
  }

  function publish(reason) {
    const family = selectedFamily();
    root.dataset.family = family.id;
    document.body.dataset.mmFamily = family.id;
    live.textContent = `${family.label} · ${state.index + 1} of ${count}`;
    familyTitle.textContent = family.title;
    familyQuestion.textContent = family.question;
    globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_CAROUSEL_CHANGED", {
      detail: Object.freeze({
        contract: "METHODS_MODELS_SINGLE_AXIS_EUCLIDEAN_CAROUSEL_v1",
        reason,
        familyId: family.id,
        familyIndex: state.index,
        orbitAngle: angleForIndex(state.index),
        inspecting: state.inspecting,
        sourceCompletenessClaimed: false,
        scientificValidationClaimed: false,
        productAcceptanceGranted: false
      })
    }));
  }

  function applyGeometry(reason = "geometry") {
    const r = radius();
    ring.style.setProperty("--ring-rotation", `${state.angle}deg`);
    cards.forEach((card, index) => {
      card.style.transform = `rotateY(${index * step}deg) translateZ(${r}px)`;
      const active = index === state.index;
      card.dataset.active = String(active);
      card.setAttribute("aria-hidden", String(!active));
      const action = card.querySelector("[data-open-inspection]");
      if (action) action.tabIndex = active && !state.inspecting ? 0 : -1;
    });
    tabs.querySelectorAll("[data-family-index]").forEach((button, index) => {
      const active = index === state.index;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    publish(reason);
  }

  function selectIndex(index, reason = "select", focusTab = false) {
    if (state.inspecting || state.settling) return;
    const targetIndex = normalize(index);
    if (targetIndex === state.index) {
      if (focusTab) tabs.querySelector(`[data-family-index="${state.index}"]`)?.focus({ preventScroll: true });
      return;
    }
    const targetAngle = angleForIndex(targetIndex);
    state.settling = true;
    root.dataset.settling = "true";
    ring.style.setProperty("--ring-rotation", `${targetAngle}deg`);
    clearTimeout(state.settleTimer);
    const commit = () => {
      state.index = targetIndex;
      state.angle = targetAngle;
      state.settling = false;
      root.dataset.settling = "false";
      applyGeometry(reason);
      if (focusTab) tabs.querySelector(`[data-family-index="${state.index}"]`)?.focus({ preventScroll: true });
    };
    if (reducedMotion()) commit();
    else state.settleTimer = setTimeout(commit, 640);
  }

  function openInspection(card, reason = "inspect") {
    if (state.inspecting || state.settling || Number(card.dataset.familyIndex) !== state.index) return;
    state.inspecting = true;
    state.angle = angleForIndex(state.index);
    root.dataset.inspecting = "true";
    card.dataset.inspecting = "true";
    card.querySelector("[data-close-inspection]").hidden = false;
    card.querySelector("[data-open-inspection]").tabIndex = -1;
    viewport.dataset.dragging = "false";
    publish(reason);
    requestAnimationFrame(() => card.querySelector("[data-close-inspection]")?.focus({ preventScroll: true }));
  }

  function closeInspection(reason = "return-to-orbit") {
    if (!state.inspecting) return;
    const card = cards[state.index];
    state.inspecting = false;
    root.dataset.inspecting = "false";
    card.dataset.inspecting = "false";
    card.querySelector("[data-close-inspection]").hidden = true;
    state.angle = angleForIndex(state.index);
    applyGeometry(reason);
    requestAnimationFrame(() => card.querySelector("[data-open-inspection]")?.focus({ preventScroll: true }));
  }

  function snapFromDrag() {
    const projected = state.angle + Math.max(-26, Math.min(26, state.velocity * 90));
    const next = normalize(Math.round(-projected / step));
    state.index = next;
    state.angle = angleForIndex(next);
    applyGeometry("drag-snap");
  }

  families.forEach(createCard);
  renderTabs();
  state.angle = angleForIndex(0);
  applyGeometry("init");

  tabs.addEventListener("click", event => {
    const button = event.target.closest("[data-family-index]");
    if (!button) return;
    selectIndex(Number(button.dataset.familyIndex), "family-tab");
  });

  tabs.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") selectIndex(0, "family-keyboard", true);
    else if (event.key === "End") selectIndex(count - 1, "family-keyboard", true);
    else selectIndex(state.index + (event.key === "ArrowRight" ? 1 : -1), "family-keyboard", true);
  });

  ring.addEventListener("click", event => {
    if (state.suppressClick) {
      state.suppressClick = false;
      event.preventDefault();
      return;
    }
    const card = event.target.closest(".mm-card");
    if (!card) return;
    const familyIndex = Number(card.dataset.familyIndex);
    if (familyIndex !== state.index && !state.inspecting && !state.settling) {
      selectIndex(familyIndex, "card-select");
      return;
    }
    const modelChoice = event.target.closest("[data-model-index]");
    if (modelChoice && state.inspecting) {
      const modelIndex = Number(modelChoice.dataset.modelIndex);
      modelIndices[state.index] = modelIndex;
      renderModelDetail(card, state.index, modelIndex);
      modelChoice.focus({ preventScroll: true });
      publish("model-select");
      return;
    }
    if (!state.inspecting && !state.settling && familyIndex === state.index) {
      openInspection(card, "active-object-tap");
    }
  });

  ring.addEventListener("keydown", event => {
    const modelChoice = event.target.closest("[data-model-index]");
    if (modelChoice && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const family = selectedFamily();
      const current = Number(modelChoice.dataset.modelIndex);
      const next = event.key === "Home" ? 0 : event.key === "End" ? family.models.length - 1 : normalizeModel(current + (event.key === "ArrowRight" ? 1 : -1), family.models.length);
      modelIndices[state.index] = next;
      renderModelDetail(cards[state.index], state.index, next);
      cards[state.index].querySelector(`[data-model-index="${next}"]`)?.focus({ preventScroll: true });
      publish("model-keyboard");
    }
  });

  function normalizeModel(value, length) {
    return ((value % length) + length) % length;
  }

  viewport.addEventListener("pointerdown", event => {
    if (state.inspecting || state.settling || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (event.target.closest("button, a")) return;
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.pointerStartX = event.clientX;
    state.pointerLastX = event.clientX;
    state.pointerLastTime = performance.now();
    state.pointerStartAngle = state.angle;
    state.pointerTravel = 0;
    state.velocity = 0;
    state.suppressClick = false;
    viewport.dataset.dragging = "true";
    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport.addEventListener("pointermove", event => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    const now = performance.now();
    const width = Math.max(320, viewport.clientWidth);
    const delta = event.clientX - state.pointerStartX;
    state.pointerTravel = Math.max(state.pointerTravel, Math.abs(delta));
    state.angle = state.pointerStartAngle + (delta / width) * 190;
    const elapsed = Math.max(8, now - state.pointerLastTime);
    state.velocity = (event.clientX - state.pointerLastX) / elapsed;
    state.pointerLastX = event.clientX;
    state.pointerLastTime = now;
    ring.style.setProperty("--ring-rotation", `${state.angle}deg`);
  });

  function finishPointer(event) {
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    const tap = state.pointerTravel < 7;
    state.dragging = false;
    viewport.dataset.dragging = "false";
    viewport.releasePointerCapture?.(event.pointerId);
    state.pointerId = null;
    if (tap) {
      state.angle = angleForIndex(state.index);
      applyGeometry("tap-release");
      const activeCard = cards[state.index];
      if (activeCard && !event.target.closest("button, a")) openInspection(activeCard, "active-object-pointer-tap");
      return;
    }
    state.suppressClick = true;
    snapFromDrag();
  }

  viewport.addEventListener("pointerup", finishPointer);
  viewport.addEventListener("pointercancel", finishPointer);

  root.addEventListener("keydown", event => {
    if (event.key === "Escape" && state.inspecting) {
      event.preventDefault();
      closeInspection("return-to-orbit-escape");
      return;
    }
    if (state.inspecting || state.settling || event.target.closest("[role=tablist]")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      selectIndex(state.index + (event.key === "ArrowRight" ? 1 : -1), "stage-keyboard");
    }
  });

  globalThis.addEventListener("resize", () => applyGeometry("resize"), { passive: true });
})();