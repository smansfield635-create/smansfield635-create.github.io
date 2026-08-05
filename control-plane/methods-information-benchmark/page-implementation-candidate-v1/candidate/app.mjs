import { MODEL } from "./candidate-data.mjs";
import { sealSnapshot, verifySnapshot, snapshotPayload, sha256 } from "./state.mjs";

const root = document.querySelector("[data-mm-candidate]");
const dialog = document.querySelector("[data-inspection]");
const els = {
  search: root.querySelector("[data-search]"), intent: root.querySelector("[data-intent]"),
  lenses: root.querySelector("[data-lenses]"), families: root.querySelector("[data-families]"),
  records: root.querySelector("[data-records]"), count: root.querySelector("[data-count]"),
  noMatch: root.querySelector("[data-no-match]"), globalHolds: root.querySelector("[data-global-holds]"),
  developmental: root.querySelector("[data-developmental]"), custody: root.querySelector("[data-custody]"),
  live: document.querySelector("[data-live]"), inspectionTitle: dialog.querySelector("[data-inspection-title]"),
  inspectionKicker: dialog.querySelector("[data-inspection-kicker]"), inspectionContent: dialog.querySelector("[data-inspection-content]"),
  exactReturn: dialog.querySelector("[data-exact-return]"), returnStatus: dialog.querySelector("[data-return-status]")
};

const state = {
  activeFamily: "all", activeLens: "practical", search: "", activeIntent: "",
  selectionHistory: [], focusedRecordOrSet: [], dependencyNeighborhood: [],
  expandedContextPanels: [], originSnapshot: null, originFingerprint: null, restoreFocus: null, restoreFocusRecordId: null
};
const recordsById = new Map(MODEL.records.map(record => [record.id, record]));
const familyById = new Map(MODEL.families.map(family => [family.id, family]));
const routeByIntent = new Map(MODEL.questionIntentRoutes.map(route => [route.intent, route]));

function humanize(value) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, char => char.toUpperCase()); }
function deviceMode() { return matchMedia("(pointer: coarse)").matches ? "COARSE_POINTER" : "FINE_POINTER"; }
function related(recordId) {
  return MODEL.edges.filter(edge => edge.from === recordId || edge.to === recordId)
    .flatMap(edge => [edge.from, edge.to]).filter(id => id !== recordId);
}
function recordHolds(recordId) { return MODEL.holds.filter(hold => hold.recordIds.includes(recordId)); }
function recordNonedges(recordId) { return MODEL.explicitNonedges.filter(edge => edge.from === recordId || edge.to === recordId); }
function visibleRecords() {
  const query = state.search.trim().toLowerCase();
  const intentIds = state.activeIntent ? new Set(routeByIntent.get(state.activeIntent)?.recordIds ?? []) : null;
  return MODEL.records.filter(record => {
    const familyMatch = state.activeFamily === "all" || record.family === state.activeFamily;
    const intentMatch = !intentIds || intentIds.has(record.id);
    const haystack = `${record.title} ${record.equationOrProcedure} ${record.formalType}`.toLowerCase();
    return familyMatch && intentMatch && (!query || haystack.includes(query));
  });
}

function renderControls() {
  els.families.replaceChildren(...[
    { id: "all", label: "All records" }, ...MODEL.families
  ].map((family, index) => {
    const button = document.createElement("button");
    button.type = "button"; button.role = "tab"; button.dataset.family = family.id;
    button.setAttribute("aria-selected", String(state.activeFamily === family.id));
    button.tabIndex = state.activeFamily === family.id ? 0 : -1;
    button.textContent = family.label; button.dataset.index = String(index); return button;
  }));
  els.lenses.replaceChildren(...MODEL.lenses.map(lens => {
    const button = document.createElement("button");
    button.type = "button"; button.role = "radio"; button.dataset.lens = lens;
    button.setAttribute("aria-checked", String(state.activeLens === lens));
    button.tabIndex = state.activeLens === lens ? 0 : -1; button.textContent = humanize(lens); return button;
  }));
  if (els.intent.options.length === 1) {
    MODEL.questionIntentRoutes.forEach(route => els.intent.add(new Option(humanize(route.intent), route.intent)));
  }
  els.intent.value = state.activeIntent;
  els.search.value = state.search;
}

function renderRecords() {
  const visible = visibleRecords();
  els.records.replaceChildren(...visible.map((record, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button"; button.className = "record-button"; button.dataset.record = record.id;
    button.innerHTML = `<span class="record-index">${String(index + 1).padStart(2,"0")}</span><span><span class="record-title">${record.title}</span><span class="record-equation">${record.equationOrProcedure}</span></span><span class="badge" data-state="${record.sourceState}">${record.sourceState === "hold" ? "Source hold" : "Source confirmed"}</span>`;
    li.append(button); return li;
  }));
  els.count.value = `${visible.length} of ${MODEL.records.length}`;
  els.noMatch.hidden = visible.length !== 0;
  if (!visible.length) els.live.textContent = "No lawful match. No record was forced into the result.";
}

function renderContext() {
  const holds = document.createElement("ul"); holds.className = "context-list";
  MODEL.holds.forEach(hold => { const li = document.createElement("li"); li.innerHTML = `<strong>${humanize(hold.holdId)}</strong><br>${humanize(hold.reason)}`; holds.append(li); });
  els.globalHolds.replaceChildren(holds);
  const development = document.createElement("ol"); development.className = "context-list";
  MODEL.developmentalTrace.forEach(row => { const li = document.createElement("li"); li.innerHTML = `<strong>${humanize(row.elementId)}</strong><br>${humanize(row.observedOutcome)} · ${humanize(row.recommendedDisposition)}`; development.append(li); });
  els.developmental.replaceChildren(development);
  els.custody.textContent = JSON.stringify(MODEL.sourceBinding, null, 2);
}

function render() { renderControls(); renderRecords(); syncUrl(); }
function syncUrl() {
  const url = new URL(location.href); ["family","lens","q","intent","record"].forEach(key => url.searchParams.delete(key));
  if (state.activeFamily !== "all") url.searchParams.set("family", state.activeFamily);
  if (state.activeLens !== "practical") url.searchParams.set("lens", state.activeLens);
  if (state.search) url.searchParams.set("q", state.search);
  if (state.activeIntent) url.searchParams.set("intent", state.activeIntent);
  history.replaceState({ candidate: true }, "", url);
}

async function captureOrigin(entryRoute) {
  const unsealed = {
    contentVersionFingerprint: MODEL.contentVersionFingerprint,
    entryRoute, activeFamily: state.activeFamily, activeLens: state.activeLens,
    searchAndFilterState: { search: state.search, intent: state.activeIntent },
    orderedSelectionHistory: [...state.selectionHistory], focusedRecordOrSet: [...state.focusedRecordOrSet],
    dependencyNeighborhood: [...state.dependencyNeighborhood], expandedContextPanels: [...state.expandedContextPanels],
    scrollAnchor: { x: scrollX, y: scrollY }, viewportOrCameraStateIfSpatial: { mode: "NONSPATIAL_CANDIDATE", x: 0, y: 0, z: 0 },
    deviceInteractionMode: deviceMode(), returnToken: ""
  };
  state.originSnapshot = await sealSnapshot(unsealed);
  state.originFingerprint = await sha256(snapshotPayload(state.originSnapshot));
  sessionStorage.setItem(`mm-return:${state.originSnapshot.returnToken}`, JSON.stringify(state.originSnapshot));
}

function section(title, content, list = null) {
  const box = document.createElement("section"); box.className = "inspection-section";
  const heading = document.createElement("h3"); heading.textContent = title; box.append(heading);
  if (content) { const p = document.createElement("p"); p.textContent = content; box.append(p); }
  if (list?.length) { const ul = document.createElement("ul"); list.forEach(item => { const li = document.createElement("li"); li.textContent = item; ul.append(li); }); box.append(ul); }
  return box;
}

async function inspect(recordId, trigger) {
  const record = recordsById.get(recordId); if (!record) return;
  await captureOrigin(`RECORD:${recordId}`);
  state.restoreFocus = trigger; state.restoreFocusRecordId = recordId; state.selectionHistory.push(recordId); state.focusedRecordOrSet = [recordId]; state.dependencyNeighborhood = related(recordId);
  const dependencies = MODEL.edges.filter(edge => edge.from === recordId || edge.to === recordId).map(edge => `${edge.from} → ${edge.to}: ${edge.relation} (${edge.confidence})`);
  const nonedges = recordNonedges(recordId).map(edge => `${edge.from} ↛ ${edge.to}: ${edge.relation}`);
  const holds = recordHolds(recordId).map(hold => `${hold.holdId}: ${hold.reason}; release evidence: ${hold.releaseEvidence}`);
  const family = familyById.get(record.family);
  els.inspectionKicker.textContent = `${family.label} · ${record.sourceState === "hold" ? "source hold" : "source confirmed"}`;
  els.inspectionTitle.textContent = record.title;
  const lensText = state.activeLens === "practical" ? record.invocationCondition : state.activeLens === "engineering" ? `${record.formalType} · ${record.computationalBoundary.classification}` : `${record.sourceState.toUpperCase()} · ${record.computationalBoundary.executionReadiness} · causal status ${record.causalStatus}`;
  const grid = document.createElement("div"); grid.className = "inspection-grid";
  grid.append(
    section("Equation or procedure", record.equationOrProcedure), section(`${humanize(state.activeLens)} lens`, humanize(lensText)),
    section("Formal type", humanize(record.formalType)), section("Invocation condition", humanize(record.invocationCondition)),
    section("Computational boundary", `${humanize(record.computationalBoundary.classification)}. ${humanize(record.computationalBoundary.executionReadiness)}.`),
    section("Admitted dependencies", dependencies.length ? "Only declared or strongly supported edges are shown." : "No admitted dependency edge is declared for this record.", dependencies),
    section("Explicit nonedges", nonedges.length ? "These relations are expressly not dependencies." : "No record-specific explicit nonedge is listed.", nonedges),
    section("Holds and release evidence", "Silent resolution is prohibited.", holds),
    section("Causal status", `UNRESOLVED. The formal record is not promoted to an empirically validated or causal claim.`),
    section("Developmental translation", "The baseline created a real 25-record corpus, but prior browsing and inspection did not establish inquiry assembly, a dependency graph, or fully proven exact replay.")
  );
  els.inspectionContent.replaceChildren(grid); els.returnStatus.textContent = `Origin sealed: ${state.originSnapshot.returnToken.slice(0, 12)}…`;
  dialog.showModal(); dialog.querySelector(".close").focus();
  const url = new URL(location.href); url.searchParams.set("record", recordId); history.pushState({ recordId }, "", url);
}

async function exactReturn() {
  const snapshot = state.originSnapshot; if (!snapshot) { els.returnStatus.textContent = "No origin snapshot is available."; return; }
  const check = await verifySnapshot(snapshot, MODEL.contentVersionFingerprint);
  if (!check.ok) { els.returnStatus.textContent = `Return rejected: ${check.reason}. No approximate restoration was performed.`; return; }
  state.activeFamily = snapshot.activeFamily; state.activeLens = snapshot.activeLens;
  state.search = snapshot.searchAndFilterState.search; state.activeIntent = snapshot.searchAndFilterState.intent;
  state.selectionHistory = [...snapshot.orderedSelectionHistory]; state.focusedRecordOrSet = [...snapshot.focusedRecordOrSet];
  state.dependencyNeighborhood = [...snapshot.dependencyNeighborhood]; state.expandedContextPanels = [...snapshot.expandedContextPanels];
  dialog.close(); render(); scrollTo(snapshot.scrollAnchor.x, snapshot.scrollAnchor.y);
  els.records.querySelector(`[data-record="${state.restoreFocusRecordId}"]`)?.focus({ preventScroll: true });
  const restored = await sealSnapshot({ ...snapshot, returnToken: "" });
  const restoredFingerprint = await sha256(snapshotPayload(restored));
  const equal = restoredFingerprint === state.originFingerprint;
  els.live.textContent = equal ? "Exact corpus state restored and fingerprint verified." : "State restoration fingerprint mismatch.";
  if (!equal) console.error("METHODS_EXACT_RETURN_MISMATCH", { expected: state.originFingerprint, restored: restoredFingerprint });
}

els.search.addEventListener("input", event => { state.search = event.target.value; renderRecords(); syncUrl(); });
els.intent.addEventListener("change", event => { state.activeIntent = event.target.value; renderRecords(); syncUrl(); });
els.families.addEventListener("click", event => { const button = event.target.closest("[data-family]"); if (!button) return; state.activeFamily = button.dataset.family; render(); });
els.families.addEventListener("keydown", event => {
  if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return; event.preventDefault();
  const buttons = [...els.families.querySelectorAll("button")]; const current = buttons.findIndex(button => button.dataset.family === state.activeFamily);
  const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
  state.activeFamily = buttons[next].dataset.family; render(); els.families.querySelector(`[data-family="${state.activeFamily}"]`)?.focus();
});
els.lenses.addEventListener("click", event => { const button = event.target.closest("[data-lens]"); if (!button) return; state.activeLens = button.dataset.lens; renderControls(); syncUrl(); });
els.lenses.addEventListener("keydown", event => {
  if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return; event.preventDefault();
  const buttons = [...els.lenses.querySelectorAll("button")]; const current = buttons.findIndex(button => button.dataset.lens === state.activeLens);
  const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
  state.activeLens = buttons[next].dataset.lens; renderControls(); els.lenses.querySelector(`[data-lens="${state.activeLens}"]`)?.focus(); syncUrl();
});
els.records.addEventListener("click", event => { const button = event.target.closest("[data-record]"); if (button) inspect(button.dataset.record, button); });
els.exactReturn.addEventListener("click", exactReturn);
dialog.addEventListener("close", () => { const url = new URL(location.href); url.searchParams.delete("record"); history.replaceState({ candidate: true }, "", url); const target = state.restoreFocus?.isConnected ? state.restoreFocus : els.records.querySelector(`[data-record="${state.restoreFocusRecordId}"]`); target?.focus({ preventScroll: true }); state.restoreFocus = null; state.restoreFocusRecordId = null; });
window.addEventListener("popstate", () => { if (dialog.open) dialog.close(); });

function hydrate() {
  const params = new URL(location.href).searchParams;
  if (params.has("family") && (params.get("family") === "all" || familyById.has(params.get("family")))) state.activeFamily = params.get("family");
  if (MODEL.lenses.includes(params.get("lens"))) state.activeLens = params.get("lens");
  state.search = params.get("q") ?? "";
  if (routeByIntent.has(params.get("intent"))) state.activeIntent = params.get("intent");
}
hydrate(); renderControls(); renderRecords(); renderContext();
const deepRecord = new URL(location.href).searchParams.get("record");
if (deepRecord && recordsById.has(deepRecord)) queueMicrotask(() => inspect(deepRecord, els.records.querySelector(`[data-record="${deepRecord}"]`)));
document.documentElement.dataset.methodsModelsCandidate = "active";
