/* engine.js — canonical client behavior (no build step)
   - Lens toggles: [data-lens-root]
   - Accordions:   [data-acc] + [data-acc-body]
*/

(function () {
  function qsa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  function setActiveButton(btns, active) {
    btns.forEach(b => {
      const isOn = b === active;
      b.classList.toggle("primary", isOn);
      b.setAttribute("aria-pressed", isOn ? "true" : "false");
    });
  }

  function setLens(root, lens) {
    const panels = qsa(root, "[data-lens-panel]");
    panels.forEach(p => {
      const isMatch = (p.getAttribute("data-lens-panel") === lens);
      p.style.display = isMatch ? "" : "none";
    });
    root.setAttribute("data-lens", lens);
  }

  function initLensRoot(root) {
    const btns = qsa(root, "[data-lens-btn]");
    if (!btns.length) return;

    // default lens
    const initial = root.getAttribute("data-lens-default") || "human";
    const initialBtn = btns.find(b => (b.getAttribute("data-lens-btn") === initial)) || btns[0];

    // wire clicks
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const lens = btn.getAttribute("data-lens-btn");
        setActiveButton(btns, btn);
        setLens(root, lens);
      });
    });

    // apply default
    setActiveButton(btns, initialBtn);
    setLens(root, initialBtn.getAttribute("data-lens-btn"));
  }

  function initAccordion(acc) {
    const body = acc.querySelector("[data-acc-body]");
    const head = acc.querySelector("[data-acc-head]");
    if (!body || !head) return;

    const defaultOpen = acc.getAttribute("data-acc-default") === "open";
    body.style.display = defaultOpen ? "" : "none";
    head.setAttribute("aria-expanded", defaultOpen ? "true" : "false");

    head.addEventListener("click", () => {
      const isOpen = body.style.display !== "none";
      body.style.display = isOpen ? "none" : "";
      head.setAttribute("aria-expanded", isOpen ? "false" : "true");
      acc.classList.toggle("open", !isOpen);
    });
  }

  function boot() {
    // Lens roots
    qsa(document, "[data-lens-root]").forEach(initLensRoot);

    // Accordions
    qsa(document, "[data-acc]").forEach(initAccordion);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
