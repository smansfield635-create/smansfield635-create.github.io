/* =========================================================
   Geodiametrics · Lens Controller (GLOBAL)
   Human ⇄ Scientific / Software-correct
   ========================================================= */

(function () {
  "use strict";

  function initLensControllers() {
    const switches = document.querySelectorAll(".lens-switch");

    switches.forEach((switchEl) => {
      const buttons = switchEl.querySelectorAll("[data-lens]");
      const panels = document.querySelectorAll("[data-lens-panel]");

      if (!buttons.length || !panels.length) return;

      // Determine default
      const defaultLens =
        switchEl.getAttribute("data-default") ||
        buttons[0].getAttribute("data-lens");

      setLens(defaultLens, buttons, panels);

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const lens = btn.getAttribute("data-lens");
          setLens(lens, buttons, panels);
        });
      });
    });
  }

  function setLens(lens, buttons, panels) {
    // Buttons
    buttons.forEach((btn) => {
      const active = btn.getAttribute("data-lens") === lens;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    // Panels
    panels.forEach((panel) => {
      const match = panel.getAttribute("data-lens-panel") === lens;
      panel.style.display = match ? "block" : "none";
      panel.setAttribute("aria-hidden", match ? "false" : "true");
    });
  }

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLensControllers);
  } else {
    initLensControllers();
  }
})();
