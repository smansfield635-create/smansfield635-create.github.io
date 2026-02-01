(() => {
  function setLens(root, lens) {
    root.setAttribute("data-lens", lens);

    root.querySelectorAll("[data-lens-pill]").forEach((b) => {
      const t = b.getAttribute("data-lens-pill");
      const on = t === lens;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    root.querySelectorAll("[data-lens-pane]").forEach((p) => {
      const t = p.getAttribute("data-lens-pane");
      p.style.display = (t === lens) ? "" : "none";
    });
  }

  function init(root) {
    const def = root.getAttribute("data-default-lens") || "human";

    root.querySelectorAll("[data-lens-pill]").forEach((b) => {
      b.addEventListener("click", () => {
        setLens(root, b.getAttribute("data-lens-pill"));
      }, { passive: true });
    });

    setLens(root, def);
  }

  function boot() {
    document.querySelectorAll("[data-lens-root]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
