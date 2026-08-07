function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function currentRecord(data, state) {
  return data.lane.records.find((record) => record.id === state.activeRecord);
}

export function renderRecordTabs(container, data, state) {
  container.innerHTML = data.lane.records.map((record, index) => {
    const selected = record.id === state.activeRecord;
    return `
      <button
        id="record-tab-${escapeText(record.id)}"
        class="record-tab"
        role="tab"
        type="button"
        aria-selected="${selected}"
        aria-controls="record-reading-surface"
        tabindex="${selected ? "0" : "-1"}"
        data-record-id="${escapeText(record.id)}"
        data-peer-state="${selected ? "selected" : "receding"}">
        <span class="record-number">RECORD ${String(index + 1).padStart(2, "0")}</span>
        <span class="record-title">${escapeText(record.title)}</span>
        <span class="record-expression">${escapeText(record.expression)}</span>
      </button>`;
  }).join("");
}

export function renderRecordHeader(container, record) {
  container.innerHTML = `
    <p class="record-kicker">Selected information record</p>
    <div class="record-heading">
      <h2>${escapeText(record.title)}</h2>
      <div class="expression" aria-label="Governing expression">${escapeText(record.expression)}</div>
    </div>
    <p class="record-relationship">${escapeText(record.relationship)}</p>`;
}

export function renderLensTabs(container, data, state) {
  container.innerHTML = data.lenses.map((lens) => {
    const selected = lens.id === state.activeLens;
    return `
      <button
        id="lens-tab-${escapeText(lens.id)}"
        class="lens-tab"
        role="tab"
        type="button"
        aria-selected="${selected}"
        aria-controls="lens-panel-${escapeText(lens.id)}"
        tabindex="${selected ? "0" : "-1"}"
        data-lens-id="${escapeText(lens.id)}">
        ${escapeText(lens.title)}
      </button>`;
  }).join("");
}

function renderSubtabs(record, lensId, state) {
  const lens = record.lenses[lensId];
  const activeId = state.activeSubtab || lens.subtabs[0].id;
  const tabs = lens.subtabs.map((subtab) => {
    const selected = subtab.id === activeId;
    return `
      <button
        id="subtab-${escapeText(lensId)}-${escapeText(subtab.id)}"
        class="subtab"
        role="tab"
        type="button"
        aria-selected="${selected}"
        aria-controls="subpanel-${escapeText(lensId)}-${escapeText(subtab.id)}"
        tabindex="${selected ? "0" : "-1"}"
        data-subtab-id="${escapeText(subtab.id)}">
        ${escapeText(subtab.title)}
      </button>`;
  }).join("");

  const panels = lens.subtabs.map((subtab) => {
    const selected = subtab.id === activeId;
    const body = subtab.body.map((paragraph) => `<p>${escapeText(paragraph)}</p>`).join("");
    const hold = subtab.hold ? `<span class="hold">${escapeText(subtab.hold)}</span>` : "";
    return `
      <section
        id="subpanel-${escapeText(lensId)}-${escapeText(subtab.id)}"
        class="subpanel"
        role="tabpanel"
        aria-labelledby="subtab-${escapeText(lensId)}-${escapeText(subtab.id)}"
        ${selected ? "" : "hidden aria-hidden=\"true\""}>
        <h3>${escapeText(subtab.title)}</h3>
        ${body}
        ${hold}
      </section>`;
  }).join("");

  return `
    <p class="lens-introduction">${escapeText(lens.introduction)}</p>
    <div class="subtabs" role="tablist" aria-label="${escapeText(lensId)} topics">${tabs}</div>
    ${panels}`;
}

export function renderLensPanels(container, data, state, record) {
  container.innerHTML = data.lenses.map((lens) => {
    const selected = lens.id === state.activeLens;
    return `
      <section
        id="lens-panel-${escapeText(lens.id)}"
        class="lens-panel"
        role="tabpanel"
        aria-labelledby="lens-tab-${escapeText(lens.id)}"
        ${selected ? "" : "hidden aria-hidden=\"true\""}>
        ${renderSubtabs(record, lens.id, state)}
      </section>`;
  }).join("");
}

export function renderEquationStage(container, record, state) {
  const enabled = record.id === "capacity-field" && state.activeLens === "engineering";
  container.hidden = !enabled;
  if (!enabled) {
    container.innerHTML = "";
    return;
  }

  const selectedTerm = state.activeTerm;
  const termButtons = record.terms.map((term) => {
    const selected = selectedTerm === term.id;
    return `
      <button
        class="term-tab"
        type="button"
        role="tab"
        aria-selected="${selected}"
        tabindex="${selected ? "0" : "-1"}"
        data-term-id="${escapeText(term.id)}">
        ${escapeText(term.id)} · ${escapeText(term.title)}
      </button>`;
  }).join("");

  const equation = record.terms.map((term, index) => {
    const termState = selectedTerm ? (selectedTerm === term.id ? "selected" : "receding") : "available";
    return `${index ? '<span aria-hidden="true">×</span>' : ""}
      <span class="equation-term" data-term-state="${termState}" data-term-expression="${escapeText(term.id)}">${escapeText(term.id)}</span>`;
  }).join("");

  const selected = record.terms.find((term) => term.id === selectedTerm);
  container.innerHTML = `
    <p class="equation-label">Compass-derived equation choreography</p>
    <div class="equation" aria-label="K equals P times R times A times C">
      <span aria-hidden="true">K =</span>${equation}
    </div>
    <div class="term-tabs" role="tablist" aria-label="Capacity terms">${termButtons}</div>
    <p class="term-detail">${selected ? escapeText(selected.detail) : "Select a required term. It advances while peer terms recede; the complete expression remains anchored."}</p>`;
}

export function announce(message) {
  const surface = document.querySelector("#record-reading-surface");
  surface.dataset.announcement = message;
}
