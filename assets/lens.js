(function () {
  function setLens(root, lens) {
    root.setAttribute("data-lens", lens);

    const pills = root.querySelectorAll("[data-lens-pill]");
    pills.forEach((p) => {
      const t = p.getAttribute("data-lens-pill");
      const on = t === lens;
      p.classList.toggle("active", on);
      p.setAttribute("aria-pressed", on ? "true" : "false");
    });

    const panes = root.querySelectorAll("[data-lens-pane]");
    panes.forEach((pane) => {
      const t = pane.getAttribute("data-lens-pane");
      pane.style.display = (t === lens) ? "" : "none";
    });
  }

  function initLensRoot(root) {
    const def = root.getAttribute("data-default-lens") || "human";

    // Wire buttons
    root.querySelectorAll("[data-lens-pill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lens = btn.getAttribute("data-lens-pill");
        setLens(root, lens);
      }, { passive: true });
    });

    // Default
    setLens(root, def);
  }

  function boot() {
    document.querySelectorAll("[data-lens-root]").forEach(initLensRoot);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
