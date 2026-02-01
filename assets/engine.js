/* engine.js — UI helpers for Geodiametrics
   - Lens switcher (Human / Scientific)
   Works with markup:
     <div class="lens-switch" data-default="human">
       <button class="lens-btn" data-lens="human">Human</button>
       <button class="lens-btn" data-lens="scientific">Scientific</button>
     </div>

     <section class="panel lens-panel" data-lens-panel="human">...</section>
     <section class="panel lens-panel" data-lens-panel="scientific">...</section>
*/

(function () {
  function setActiveLens(root, lens) {
    const buttons = root.querySelectorAll(".lens-btn[data-lens]");
    const panels = root.parentElement.querySelectorAll(".lens-panel[data-lens-panel]");

    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-lens") === lens;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    panels.forEach((p) => {
      const show = p.getAttribute("data-lens-panel") === lens;
      p.style.display = show ? "" : "none";
      p.setAttribute("aria-hidden", show ? "false" : "true");
    });
  }

  function initLensSwitchers() {
    const switches = document.querySelectorAll(".lens-switch");
    switches.forEach((sw) => {
      const defaultLens = (sw.getAttribute("data-default") || "human").toLowerCase();

      // Guard: if no panels exist, do nothing.
      const hasPanels =
        sw.parentElement &&
        sw.parentElement.querySelector(".lens-panel[data-lens-panel]");
      if (!hasPanels) return;

      // Initial state
      setActiveLens(sw, defaultLens);

      // Click binding
      sw.addEventListener("click", (e) => {
        const btn = e.target.closest(".lens-btn[data-lens]");
        if (!btn) return;
        e.preventDefault();
        const lens = (btn.getAttribute("data-lens") || defaultLens).toLowerCase();
        setActiveLens(sw, lens);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLensSwitchers();
  });
})();
