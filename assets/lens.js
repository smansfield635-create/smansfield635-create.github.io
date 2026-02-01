(function () {
  function setLens(root, lens) {
    root.dataset.lens = lens;

    const pills = root.querySelectorAll("[data-lens-pill]");
    pills.forEach(p => {
      const target = p.getAttribute("data-lens-pill");
      p.classList.toggle("active", target === lens);
      p.setAttribute("aria-pressed", String(target === lens));
    });

    const panes = root.querySelectorAll("[data-lens-pane]");
    panes.forEach(pane => {
      const target = pane.getAttribute("data-lens-pane");
      pane.style.display = (target === lens) ? "" : "none";
    });
  }

  function initLens(root) {
    const initial =
      root.getAttribute("data-default-lens") ||
      root.dataset.lens ||
      "human";

    // Ensure buttons work even if overlay/labels exist.
    root.querySelectorAll("[data-lens-pill]").forEach(btn => {
      btn.addEventListener("click", () => {
        const lens = btn.getAttribute("data-lens-pill");
        setLens(root, lens);
      }, { passive: true });
    });

    setLens(root, initial);
  }

  function boot() {
    document.querySelectorAll("[data-lens-root]").forEach(initLens);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
