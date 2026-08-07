import { DATA } from "./data.mjs";
import {
  createInitialState,
  pushReturnPoint,
  restoreReturnPoint,
  selectLens,
  selectRecord,
  selectSubtab,
  selectTerm
} from "./state.mjs";
import {
  announce,
  currentRecord,
  renderEquationStage,
  renderLensPanels,
  renderLensTabs,
  renderRecordHeader,
  renderRecordTabs
} from "./renderer.mjs";
import {
  bindRovingTablist,
  focusReadingSurface,
  installEscapeHandler,
  restoreFocusAndScroll
} from "./navigation.mjs";

const nodes = {
  shell: document.querySelector(".shell"),
  recordTabs: document.querySelector("#record-tabs"),
  recordHeader: document.querySelector("#record-header"),
  lensTabs: document.querySelector("#lens-tabs"),
  lensPanels: document.querySelector("#lens-panels"),
  equationStage: document.querySelector("#equation-stage"),
  returnControl: document.querySelector("#return-control"),
  returnStatus: document.querySelector("#return-status"),
  candidateIdentity: document.querySelector("#candidate-identity")
};

let state = createInitialState(DATA);

function render() {
  const record = currentRecord(DATA, state);
  nodes.shell.dataset.appState = state.phase;
  renderRecordTabs(nodes.recordTabs, DATA, state);
  renderRecordHeader(nodes.recordHeader, record);
  renderLensTabs(nodes.lensTabs, DATA, state);
  renderLensPanels(nodes.lensPanels, DATA, state, record);
  renderEquationStage(nodes.equationStage, record, state);
  nodes.returnControl.disabled = state.returnStack.length === 0;
  nodes.returnStatus.textContent = state.returnStack.length
    ? `${state.returnStack.length} exact return point${state.returnStack.length === 1 ? "" : "s"} available.`
    : "No nested context is open.";
}

async function chooseRecord(tab) {
  const recordId = tab.dataset.recordId;
  if (!recordId || recordId === state.activeRecord) return;
  state = await pushReturnPoint(state, document.activeElement);
  state = selectRecord(state, recordId);
  render();
  document.querySelector(`#record-tab-${CSS.escape(recordId)}`)?.focus();
  focusReadingSurface(state.reducedMotion);
  announce(`${currentRecord(DATA, state).title} selected. Practical lens opened.`);
}

async function chooseLens(tab) {
  const lensId = tab.dataset.lensId;
  if (!lensId || lensId === state.activeLens) return;
  state = await pushReturnPoint(state, document.activeElement);
  state = selectLens(state, lensId);
  render();
  document.querySelector(`#lens-tab-${CSS.escape(lensId)}`)?.focus();
  announce(`${lensId} lens selected.`);
}

async function chooseSubtab(tab) {
  const subtabId = tab.dataset.subtabId;
  if (!subtabId || subtabId === state.activeSubtab) return;
  state = await pushReturnPoint(state, document.activeElement);
  state = selectSubtab(state, subtabId);
  render();
  document.querySelector(`[data-subtab-id="${CSS.escape(subtabId)}"]`)?.focus();
  announce(`${tab.textContent.trim()} topic selected.`);
}

async function chooseTerm(tab) {
  const termId = tab.dataset.termId;
  if (!termId || termId === state.activeTerm) return;
  state = await pushReturnPoint(state, document.activeElement);
  state = selectTerm(state, termId);
  render();
  document.querySelector(`[data-term-id="${CSS.escape(termId)}"]`)?.focus();
  announce(`${termId} term advanced; peer terms receded.`);
}

async function returnToPriorContext() {
  if (state.returnStack.length === 0) return;
  state = await restoreReturnPoint(state);
  render();
  if (state.phase === "HELD") {
    nodes.returnStatus.textContent = "Return held: token or content version mismatch.";
    return;
  }
  restoreFocusAndScroll(state);
  announce("Prior record, lens, nested topic, scroll position, and focus restored.");
}

bindRovingTablist(nodes.recordTabs, chooseRecord);
bindRovingTablist(nodes.lensTabs, chooseLens);
nodes.lensPanels.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-subtab-id]");
  if (tab) chooseSubtab(tab);
});
nodes.lensPanels.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const list = event.target.closest('[role="tablist"]');
  if (!list || !list.classList.contains("subtabs")) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) return;
  event.preventDefault();
  let next = current;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = tabs.length - 1;
  if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
  if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
  tabs[next].focus();
  chooseSubtab(tabs[next]);
});
nodes.equationStage.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-term-id]");
  if (tab) chooseTerm(tab);
});
nodes.returnControl.addEventListener("click", returnToPriorContext);
installEscapeHandler(returnToPriorContext);

nodes.candidateIdentity.textContent =
  "Base e876e6107d3e · branch construction/methods-spatial-database-checkpoint4-text-first-v2-001 · no public route";
render();
