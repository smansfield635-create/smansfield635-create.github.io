(() => {
  "use strict";

  const CONTRACT = "METHODS_MODELS_SHOWROOM_DOCK_v2";
  const showroom = document.querySelector("[data-mm-showroom]");
  const dock = document.querySelector("[data-mm-dock]");
  if (!showroom || !dock) return;

  const elements = {
    topbar: document.querySelector("[data-mm-topbar]"),
    collapse: document.querySelector("[data-mm-collapse-showroom]"),
    open: document.querySelector("[data-mm-open-showroom]"),
    dockHandle: document.querySelector("[data-mm-dock-handle]"),
    dockPrevious: document.querySelector("[data-mm-dock-previous]"),
    dockNext: document.querySelector("[data-mm-dock-next]"),
    dockSymbol: document.querySelector("[data-mm-dock-symbol]"),
    dockFamily: document.querySelector("[data-mm-dock-family]"),
    dockTitle: document.querySelector("[data-mm-dock-title]"),
    dockProgress: document.querySelector("[data-mm-dock-progress]"),
    basePrevious: showroom.querySelector("[data-mm-previous]"),
    baseNext: showroom.querySelector("[data-mm-next]"),
    dialog: document.querySelector("[data-mm-dialog]"),
    dialogEquation: document.querySelector("[data-mm-dialog-equation]")
  };

  const backgroundSurfaces = Array.from(document.querySelectorAll("[data-mm-background-surface]"));
  const familySymbols = Object.freeze({
    structure: "451",
    pressure: "Π/K",
    closure: "ΣM",
    method: "A→D"
  });

  const modelTitles = Object.freeze({
    "envelope-451": "451 Structural Envelope",
    "gate-448": "448 Saturation Gate",
    "spine-minimum": "E / I / V Minimum Principle",
    "collapse-qualified": "Qualified Collapse Predicate",
    "membrane-61": "61 Admissibility Membrane",
    "anchors-9": "Nine Basin Anchors",
    "pressure-field": "Pressure Field",
    "capacity-field": "Usable Capacity",
    "pcr": "Pressure-to-Capacity Ratio",
    "stability": "Stability Complement",
    "hazard": "Hazard Complement",
    "complement": "Stability–Hazard Identity",
    "zero-aware": "Zero-Aware Multiplication",
    "mass-ledger": "Industrial Closure Equation",
    "residual-u": "Unaccounted Residual",
    "closure-threshold": "Closure Threshold",
    "energy-loop": "Energy Loop Law",
    "useful-output": "Useful Output Condition",
    "first": "F.I.R.S.T. Research Method",
    "integral-method": "Integral Scientific Method",
    "diagnostic-five": "Five-Diagnostic Classification Set",
    "abcd": "A–B–C–D Diagnostic Procedure",
    "falsification": "Formal Falsification Path",
    "no-match": "No-Match Discipline",
    "fixtures": "Synthetic Fixtures"
  });

  const semanticEquations = Object.freeze({
    "collapse-qualified": Object.freeze({
      layout: "predicate",
      html: '<span class="mm-eq-head">CollapseQualified<sub>d</sub> =</span><span class="mm-eq-clause">(B256<sub>d</sub> ≥ 256)</span><span class="mm-eq-clause">∧ (P192<sub>d</sub> ≥ 192)</span><span class="mm-eq-clause">∧ (min(E<sub>d</sub>, I<sub>d</sub>, V<sub>d</sub>) ≤ ε<sub>d</sub>)</span>'
    }),
    "mass-ledger": Object.freeze({
      layout: "ledger",
      html: '<span class="mm-eq-lhs">M<sub>in</sub></span><span class="mm-eq-op">=</span><span class="mm-eq-rhs"><span class="mm-eq-term">M<sub>out</sub></span><span class="mm-eq-term">+</span><span class="mm-eq-term">M<sub>dest</sub></span><span class="mm-eq-term">+</span><span class="mm-eq-term">ΔM<sub>inv</sub></span><span class="mm-eq-term">± ε</span></span>'
    }),
    "residual-u": Object.freeze({
      layout: "residual",
      html: '<span class="mm-eq-lhs">U</span><span class="mm-eq-op">=</span><span class="mm-eq-rhs"><span class="mm-eq-term">M<sub>in</sub></span><span class="mm-eq-term">−</span><span class="mm-eq-term">(M<sub>out</sub> + M<sub>dest</sub> + ΔM<sub>inv</sub>)</span></span>'
    }),
    "closure-threshold": Object.freeze({
      layout: "decision",
      html: '<span class="mm-eq-clause">Closed if |U| ≤ 3ε</span><span class="mm-eq-clause">Open if |U| &gt; 3ε</span>'
    }),
    "energy-loop": Object.freeze({
      layout: "sequence",
      html: '<span class="mm-eq-step">Storage</span><span aria-hidden="true">→</span><span class="mm-eq-step">Release</span><span aria-hidden="true">→</span><span class="mm-eq-step">Operate</span><span aria-hidden="true">→</span><span class="mm-eq-step">Recover</span><span aria-hidden="true">→</span><span class="mm-eq-step">Storage</span>'
    }),
    "useful-output": Object.freeze({
      layout: "inequality",
      html: '<span class="mm-eq-clause">Useful_Output</span><span class="mm-eq-op">≥</span><span class="mm-eq-rhs"><span class="mm-eq-term">Total_Input</span><span class="mm-eq-term">+</span><span class="mm-eq-term">Losses</span><span class="mm-eq-term">+</span><span class="mm-eq-term">Reset_Costs</span></span>'
    }),
    "first": Object.freeze({
      layout: "sequence",
      html: '<span class="mm-eq-step">Flow</span><span aria-hidden="true">→</span><span class="mm-eq-step">Integrity</span><span aria-hidden="true">→</span><span class="mm-eq-step">Reality</span><span aria-hidden="true">→</span><span class="mm-eq-step">Structure</span><span aria-hidden="true">→</span><span class="mm-eq-step">Test</span>'
    }),
    "integral-method": Object.freeze({
      layout: "sequence",
      html: '<span class="mm-eq-step">Observe</span><span aria-hidden="true">→</span><span class="mm-eq-step">Reduce</span><span aria-hidden="true">→</span><span class="mm-eq-step">Falsify</span><span aria-hidden="true">→</span><span class="mm-eq-step">Iterate</span><span aria-hidden="true">→</span><span class="mm-eq-step">Terminate</span><span aria-hidden="true">→</span><span class="mm-eq-step">Compress</span>'
    }),
    "diagnostic-five": Object.freeze({
      layout: "sequence",
      html: '<span class="mm-eq-step">C.A.D.</span><span aria-hidden="true">·</span><span class="mm-eq-step">C.T.D.</span><span aria-hidden="true">·</span><span class="mm-eq-step">C.F.D.</span><span aria-hidden="true">·</span><span class="mm-eq-step">I.M.D.</span><span aria-hidden="true">·</span><span class="mm-eq-step">T.D.</span>'
    }),
    "abcd": Object.freeze({
      layout: "sequence",
      html: '<span class="mm-eq-step">A</span><span aria-hidden="true">→</span><span class="mm-eq-step">B</span><span aria-hidden="true">→</span><span class="mm-eq-step">C</span><span aria-hidden="true">→</span><span class="mm-eq-step">D</span>'
    }),
    "falsification": Object.freeze({
      layout: "sequence",
      html: '<span class="mm-eq-step">Define</span><span aria-hidden="true">→</span><span class="mm-eq-step">Measure</span><span aria-hidden="true">→</span><span class="mm-eq-step">Freeze</span><span aria-hidden="true">→</span><span class="mm-eq-step">Score</span><span aria-hidden="true">→</span><span class="mm-eq-step">Compare</span>'
    })
  });

  const state = {
    expanded: true,
    scrollY: 0,
    dragging: false,
    dragPointerId: null,
    dragOffsetX: 0,
    dragOffsetY: 0
  };

  function setInert(element, value) {
    if (!element) return;
    if ("inert" in element) element.inert = value;
    if (value) element.setAttribute("aria-hidden", "true");
    else element.removeAttribute("aria-hidden");
  }

  function updateOverlayTop() {
    const bottom = elements.topbar?.getBoundingClientRect().bottom ?? 0;
    document.documentElement.style.setProperty("--mm-overlay-top", `${Math.max(0, Math.round(bottom))}px`);
  }

  function modelTitleFromCard(card) {
    return card?.querySelector(".mm-model-card__statement")?.textContent?.trim() || "Active model";
  }

  function updateDock() {
    const card = showroom.querySelector('.mm-model-card[data-position="active"]');
    const familyId = document.body.dataset.mmFamily || showroom.dataset.mmFamily || "structure";
    const familyTitle = showroom.querySelector("[data-mm-family-title]")?.textContent?.trim() || "Model family";
    const progress = showroom.querySelector("[data-mm-progress]")?.textContent?.trim() || "";
    const inspectId = card?.querySelector("[data-mm-inspect]")?.dataset.mmInspect || card?.dataset.modelId || "";
    const title = modelTitles[inspectId] || modelTitleFromCard(card);

    elements.dockSymbol.textContent = familySymbols[familyId] || "∑";
    elements.dockFamily.textContent = familyTitle;
    elements.dockTitle.textContent = title;
    elements.dockProgress.textContent = progress.replace(/^.*?·\s*/, "");
    dock.dataset.mmFamily = familyId;
    dock.dataset.mmModel = showroom.dataset.mmModel || inspectId;
  }

  function applySemanticEquation(equation, modelId) {
    if (!equation || !modelId || equation.dataset.mmEquationRefined === modelId) return;
    const semantic = semanticEquations[modelId];
    if (semantic) {
      equation.dataset.mmEquationLayout = semantic.layout;
      equation.innerHTML = semantic.html;
    } else {
      const compact = equation.textContent.replace(/\s+/g, " ").trim().length <= 28;
      equation.dataset.mmEquationLayout = compact ? "compact" : "auto";
    }
    equation.dataset.mmEquationRefined = modelId;
    equation.setAttribute("aria-label", equation.textContent.replace(/\s+/g, " ").trim());
  }

  function refineEquations() {
    showroom.querySelectorAll(".mm-model-card").forEach(card => {
      applySemanticEquation(card.querySelector(".mm-equation"), card.dataset.modelId);
    });
    const activeId = showroom.dataset.mmModel;
    if (elements.dialogEquation && activeId) {
      applySemanticEquation(elements.dialogEquation.querySelector(".mm-equation"), activeId);
    }
  }

  function dispatchDisplay(source) {
    globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_SHOWROOM_DISPLAY_CHANGED", {
      detail: Object.freeze({
        contract: CONTRACT,
        source,
        display: state.expanded ? "expanded" : "collapsed",
        familyId: document.body.dataset.mmFamily || "",
        modelId: showroom.dataset.mmModel || "",
        productAcceptanceGranted: false
      })
    }));
  }

  function lockPage() {
    state.scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `${-state.scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockPage() {
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("left");
    document.body.style.removeProperty("right");
    document.body.style.removeProperty("width");
    window.scrollTo(0, state.scrollY);
  }

  function openShowroom(source = "open", focus = true) {
    if (state.expanded && document.body.dataset.mmDisplay === "expanded") return;
    state.expanded = true;
    updateOverlayTop();
    lockPage();
    document.body.dataset.mmDisplay = "expanded";
    showroom.setAttribute("aria-hidden", "false");
    dock.hidden = true;
    elements.collapse.setAttribute("aria-expanded", "true");
    elements.open.setAttribute("aria-expanded", "true");
    backgroundSurfaces.forEach(surface => setInert(surface, true));
    refineEquations();
    if (focus) elements.collapse.focus({ preventScroll: true });
    dispatchDisplay(source);
  }

  function collapseShowroom(source = "collapse", focus = true) {
    if (!state.expanded) return;
    state.expanded = false;
    document.body.dataset.mmDisplay = "collapsed";
    showroom.setAttribute("aria-hidden", "true");
    elements.collapse.setAttribute("aria-expanded", "false");
    elements.open.setAttribute("aria-expanded", "false");
    backgroundSurfaces.forEach(surface => setInert(surface, false));
    dock.hidden = false;
    updateDock();
    unlockPage();
    clampDock();
    if (focus) elements.open.focus({ preventScroll: true });
    dispatchDisplay(source);
  }

  function storedDockPosition() {
    try {
      return JSON.parse(sessionStorage.getItem("METHODS_MODELS_DOCK_POSITION_V2") || "null");
    } catch {
      return null;
    }
  }

  function storeDockPosition(left, top) {
    try {
      sessionStorage.setItem("METHODS_MODELS_DOCK_POSITION_V2", JSON.stringify({ left, top }));
    } catch {
      // Session storage is optional; dock behavior remains functional without it.
    }
  }

  function setDockPosition(left, top, persist = true) {
    const rect = dock.getBoundingClientRect();
    const topMinimum = (elements.topbar?.getBoundingClientRect().bottom ?? 0) + 8;
    const maxLeft = Math.max(8, window.innerWidth - rect.width - 8);
    const maxTop = Math.max(topMinimum, window.innerHeight - rect.height - 8);
    const clampedLeft = Math.min(Math.max(8, left), maxLeft);
    const clampedTop = Math.min(Math.max(topMinimum, top), maxTop);
    document.documentElement.style.setProperty("--mm-dock-left", `${Math.round(clampedLeft)}px`);
    document.documentElement.style.setProperty("--mm-dock-top", `${Math.round(clampedTop)}px`);
    if (persist) storeDockPosition(clampedLeft, clampedTop);
  }

  function clampDock() {
    if (dock.hidden || window.matchMedia("(max-width: 720px)").matches) return;
    const stored = storedDockPosition();
    const rect = dock.getBoundingClientRect();
    const left = Number.isFinite(stored?.left) ? stored.left : window.innerWidth - rect.width - 16;
    const top = Number.isFinite(stored?.top) ? stored.top : window.innerHeight - rect.height - 16;
    setDockPosition(left, top, false);
  }

  function startDrag(event) {
    if (window.matchMedia("(max-width: 720px)").matches) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rect = dock.getBoundingClientRect();
    state.dragging = true;
    state.dragPointerId = event.pointerId;
    state.dragOffsetX = event.clientX - rect.left;
    state.dragOffsetY = event.clientY - rect.top;
    dock.dataset.dragging = "true";
    elements.dockHandle.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function drag(event) {
    if (!state.dragging || event.pointerId !== state.dragPointerId) return;
    setDockPosition(event.clientX - state.dragOffsetX, event.clientY - state.dragOffsetY, false);
    event.preventDefault();
  }

  function endDrag(event) {
    if (!state.dragging || event.pointerId !== state.dragPointerId) return;
    state.dragging = false;
    state.dragPointerId = null;
    delete dock.dataset.dragging;
    const rect = dock.getBoundingClientRect();
    storeDockPosition(rect.left, rect.top);
    elements.dockHandle.releasePointerCapture?.(event.pointerId);
  }

  elements.collapse.addEventListener("click", () => collapseShowroom("collapse-control"));
  elements.open.addEventListener("click", () => openShowroom("dock-open"));
  elements.dockPrevious.addEventListener("click", () => elements.basePrevious.click());
  elements.dockNext.addEventListener("click", () => elements.baseNext.click());
  elements.dockHandle.addEventListener("pointerdown", startDrag);
  elements.dockHandle.addEventListener("pointermove", drag);
  elements.dockHandle.addEventListener("pointerup", endDrag);
  elements.dockHandle.addEventListener("pointercancel", endDrag);

  globalThis.addEventListener("METHODS_MODELS_SHOWROOM_CHANGED", () => {
    queueMicrotask(() => {
      updateDock();
      refineEquations();
    });
  });

  const dialogObserver = new MutationObserver(() => refineEquations());
  if (elements.dialogEquation) dialogObserver.observe(elements.dialogEquation, { childList: true, subtree: true });

  globalThis.addEventListener("resize", () => {
    updateOverlayTop();
    if (!state.expanded) clampDock();
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !state.expanded || elements.dialog?.open) return;
    event.preventDefault();
    collapseShowroom("escape");
  });

  updateOverlayTop();
  updateDock();
  refineEquations();
  backgroundSurfaces.forEach(surface => setInert(surface, true));
  lockPage();
  dock.hidden = true;
  document.documentElement.dataset.methodsModelsDisplayContract = CONTRACT;
  document.documentElement.dataset.methodsModelsShowroom = "active";
  dispatchDisplay("initialization");
})();
