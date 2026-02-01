/* engine.js — Geodiametrics site UI runtime (FULL REPLACE)
   Fix: Human/Scientific toggles were "dead" because bindings were brittle.
   This runtime:
   - Initializes any .lens-switch area
   - Infers lens from data-lens OR button text
   - Shows/hides .lens-panel blocks by data-lens-panel OR class names
   - Uses capture listeners to survive mobile/overlay quirks
*/

(function () {
  const LENS_KEY = "gd.lens"; // optional persistence

  function norm(s) {
    return (s || "").toString().trim().toLowerCase();
  }

  function inferLensFromEl(el) {
    if (!el) return null;
    const dl = norm(el.getAttribute && el.getAttribute("data-lens"));
    if (dl === "human" || dl === "scientific") return dl;

    // fallback: infer from text
    const t = norm(el.textContent);
    if (t.includes("human")) return "human";
    if (t.includes("scient")) return "scientific";
    if (t.includes("software")) return "scientific";
    return null;
  }

  function getStoredLens() {
    try {
      const v = norm(localStorage.getItem(LENS_KEY));
      return v === "human" || v === "scientific" ? v : null;
    } catch (_) {
      return null;
    }
  }

  function setStoredLens(lens) {
    try {
      localStorage.setItem(LENS_KEY, lens);
    } catch (_) {}
  }

  function findLensButtons(sw) {
    // Prefer explicit .lens-btn; otherwise any button/a/div inside the switch
    const explicit = sw.querySelectorAll(".lens-btn");
    if (explicit && explicit.length) return Array.from(explicit);

    const any = sw.querySelectorAll("button, a, div");
    return Array.from(any).filter((n) => {
      const l = inferLensFromEl(n);
      return l === "human" || l === "scientific";
    });
  }

  function findLensPanels(scopeRoot) {
    // Primary: data-lens-panel + .lens-panel
    let panels = scopeRoot.querySelectorAll(".lens-panel[data-lens-panel]");
    if (panels && panels.length) return Array.from(panels);

    // Secondary: any [data-lens-panel]
    panels = scopeRoot.querySelectorAll("[data-lens-panel]");
    if (panels && panels.length) return Array.from(panels);

    // Tertiary: heuristic class names
    const human = scopeRoot.querySelectorAll(".human-panel, .human-language, .lens-human");
    const scientific = scopeRoot.querySelectorAll(".scientific-panel, .scientific-language, .lens-scientific");
    const out = [];
    Array.from(human).forEach((n) => out.push(n));
    Array.from(scientific).forEach((n) => out.push(n));
    return out;
  }

  function panelLens(panel) {
    const dl = norm(panel.getAttribute && panel.getAttribute("data-lens-panel"));
    if (dl === "human" || dl === "scientific") return dl;

    const c = norm(panel.className);
    if (c.includes("human")) return "human";
    if (c.includes("scientific")) return "scientific";
    return null;
  }

  function setActiveLens(sw, lens) {
    const buttons = findLensButtons(sw);
    const scopeRoot = sw.closest(".page") || document;
    const panels = findLensPanels(scopeRoot);

    // Buttons
    buttons.forEach((btn) => {
      const bLens = inferLensFromEl(btn);
      const active = bLens === lens;
      if (btn.classList) btn.classList.toggle("active", active);
      if (btn.setAttribute) btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    // Panels
    panels.forEach((p) => {
      const pLens = panelLens(p);
      if (!pLens) return;

      const show = pLens === lens;
      // Use inline style to be robust against CSS
      p.style.display = show ? "" : "none";
      p.setAttribute("aria-hidden", show ? "false" : "true");
    });

    setStoredLens(lens);
  }

  function initLensSwitch(sw) {
    const stored = getStoredLens();
    const def = norm(sw.getAttribute("data-default")) || "human";
    const lens = stored || (def === "scientific" ? "scientific" : "human");

    // Only initialize if we can find any panels to toggle
    const scopeRoot = sw.closest(".page") || document;
    const panels = findLensPanels(scopeRoot).filter((p) => panelLens(p));
    if (!panels.length) return;

    setActiveLens(sw, lens);
  }

  function initAllLensSwitches() {
    document.querySelectorAll(".lens-switch").forEach(initLensSwitch);
  }

  // CAPTURE listeners so taps still register even when something overlays
  function handleLensEvent(e) {
    const target = e.target;
    if (!target) return;

    const btn = target.closest && target.closest(".lens-switch button, .lens-switch a, .lens-switch .lens-btn, .lens-switch div");
    if (!btn) return;

    const sw = btn.closest && btn.closest(".lens-switch");
    if (!sw) return;

    const lens = inferLensFromEl(btn);
    if (lens !== "human" && lens !== "scientific") return;

    e.preventDefault();
    e.stopPropagation();
    setActiveLens(sw, lens);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAllLensSwitches();
  });

  // Use both click + pointerup for maximum device coverage
  document.addEventListener("click", handleLensEvent, true);
  document.addEventListener("pointerup", handleLensEvent, true);
})();
