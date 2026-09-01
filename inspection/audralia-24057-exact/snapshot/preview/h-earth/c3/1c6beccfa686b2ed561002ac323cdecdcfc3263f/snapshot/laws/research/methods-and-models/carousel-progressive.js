(() => {
  "use strict";

  const root = document.querySelector("[data-mm-carousel]");
  const source = globalThis.METHODS_MODELS_CAROUSEL_DATA;
  if (!root || !source?.families?.length) return;

  const readerLabels = Object.freeze({
    "envelope-451": "What the system must carry",
    "gate-448": "When burden is fully saturated",
    "spine-minimum": "Find the weakest required function",
    "collapse-qualified": "When collapse is actually qualified",
    "membrane-61": "What is allowed into the model",
    "anchors-9": "What orients the field",
    "pressure-field": "How pressure is built",
    "capacity-field": "What usable capacity remains",
    "pcr": "Pressure compared with capacity",
    "stability": "How much stability remains",
    "hazard": "How hazard rises",
    "complement": "Why stability and hazard balance",
    "zero-aware": "Why zero cannot be hidden",
    "mass-ledger": "Where the material went",
    "residual-u": "What remains unaccounted for",
    "closure-threshold": "When the ledger can close",
    "energy-loop": "What makes a complete loop",
    "useful-output": "Whether the loop pays its reset cost",
    "first": "Five questions before a conclusion",
    "integral-method": "How a claim is challenged",
    "diagnostic-five": "Five fixed diagnostic views",
    "abcd": "Examine before labeling",
    "falsification": "What would prove the claim wrong",
    "no-match": "When evidence does not fit",
    "fixtures": "What synthetic tests can and cannot prove"
  });

  const labelFor = model => readerLabels[model.id] || model.practical || model.title;
  let returnLockUntil = 0;

  function modelForCard(card) {
    const familyIndex = Number(card.dataset.familyIndex);
    const selected = card.querySelector('[data-model-index][aria-selected="true"]');
    const modelIndex = selected ? Number(selected.dataset.modelIndex) : 0;
    const family = source.families[familyIndex];
    const model = family?.models?.[modelIndex];
    return { familyIndex, modelIndex, family, model };
  }

  function relabelChoices(card) {
    const familyIndex = Number(card.dataset.familyIndex);
    const family = source.families[familyIndex];
    if (!family) return;
    card.querySelectorAll("[data-model-index]").forEach(button => {
      const modelIndex = Number(button.dataset.modelIndex);
      const model = family.models[modelIndex];
      if (!model || button.dataset.progressiveLabel === "true") return;
      const reader = labelFor(model);
      button.replaceChildren();
      const readerSpan = document.createElement("span");
      readerSpan.className = "mm-model-choice__reader";
      readerSpan.textContent = reader;
      const formalSpan = document.createElement("span");
      formalSpan.className = "mm-model-choice__formal";
      formalSpan.textContent = model.title;
      button.append(readerSpan, formalSpan);
      button.dataset.progressiveLabel = "true";
      button.setAttribute("aria-label", `${reader}. Formal model: ${model.title}`);
    });
  }

  function progressiveMarkup(model) {
    const reader = labelFor(model);
    return `
      <div class="mm-progressive-detail" data-mm-progressive-detail data-model-key="${model.id}">
        <section class="mm-reader-first" aria-labelledby="mm-reader-${model.id}">
          <p class="mm-depth-label">Plain-language reading</p>
          <h4 id="mm-reader-${model.id}">${reader}</h4>
          <p class="mm-reader-first__lead">${model.practical}</p>
          <div class="mm-reader-first__why">
            <strong>Why it matters</strong>
            <p>${model.purpose}</p>
          </div>
        </section>
        <details class="mm-engineering-depth">
          <summary>
            <span>Engineering detail</span>
            <small>${model.title}</small>
          </summary>
          <div class="mm-engineering-depth__body">
            <div class="mm-engineering-identity">
              <p class="mm-depth-label">Formal model</p>
              <h5>${model.title}</h5>
              <div class="mm-inspection__equation">${model.equation}</div>
              <p class="mm-inspection__statement">${model.statement}</p>
            </div>
            <div class="mm-engineering-grid">
              <section><strong>Evidence standing</strong><p>${model.status}</p></section>
              <section><strong>Failure behavior</strong><p>${model.failure}</p></section>
              <section><strong>Limits</strong><p>${model.limits}</p></section>
            </div>
          </div>
        </details>
      </div>`;
  }

  function enhanceDetail(card) {
    relabelChoices(card);
    const { model } = modelForCard(card);
    const detail = card.querySelector("[data-model-detail]");
    if (!detail || !model) return;
    const current = detail.querySelector(":scope > [data-mm-progressive-detail]");
    if (current?.dataset.modelKey === model.id) return;
    detail.innerHTML = progressiveMarkup(model);
  }

  function enhanceCard(card) {
    const action = card.querySelector("[data-open-inspection]");
    if (action) {
      action.textContent = "Explore meaning & method";
      action.setAttribute("aria-label", "Explore plain-language meaning and deeper engineering detail for this research family");
    }
    relabelChoices(card);
    enhanceDetail(card);
    const detail = card.querySelector("[data-model-detail]");
    if (!detail) return;
    const observer = new MutationObserver(() => enhanceDetail(card));
    observer.observe(detail, { childList: true, subtree: false });
  }

  root.querySelectorAll(".mm-card").forEach(enhanceCard);

  root.addEventListener("pointerdown", event => {
    const close = event.target.closest?.("[data-close-inspection]");
    if (!close) return;
    event.stopImmediatePropagation();
    root.dataset.returnIntent = "true";
  }, true);

  root.addEventListener("click", event => {
    const close = event.target.closest?.("[data-close-inspection]");
    if (close) {
      returnLockUntil = performance.now() + 650;
      root.dataset.returnLock = "true";
      globalThis.setTimeout(() => {
        if (performance.now() >= returnLockUntil) {
          root.dataset.returnLock = "false";
          root.dataset.returnIntent = "false";
        }
      }, 700);
      return;
    }

    if (performance.now() < returnLockUntil && event.target.closest?.(".mm-card")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  root.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (root.dataset.inspecting !== "true") return;
    returnLockUntil = performance.now() + 350;
    root.dataset.returnLock = "true";
    globalThis.setTimeout(() => {
      if (performance.now() >= returnLockUntil) root.dataset.returnLock = "false";
    }, 400);
  }, true);
})();
