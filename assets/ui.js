(() => {
  const ready = (fn) =>
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", fn)
      : fn();

  function setPanel(id) {
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("on"));
    const el = document.getElementById(id);
    if (el) el.classList.add("on");
  }

  function setMode(root, mode) {
    root.querySelectorAll(".toggle").forEach(b => b.classList.remove("on"));
    root.querySelectorAll(".mode").forEach(m => m.classList.remove("on"));
    const btn = root.querySelector(`.toggle[data-mode="${mode}"]`);
    const pane = root.querySelector(`.mode[data-mode="${mode}"]`);
    if (btn) btn.classList.add("on");
    if (pane) pane.classList.add("on");
  }

  ready(() => {
    // Diamond open -> panel
    document.querySelectorAll("[data-open]").forEach((el) => {
      el.addEventListener("click", (e) => {
        // allow anchors to navigate if they have href AND no panel
        const target = el.getAttribute("data-open");
        if (target) {
          e.preventDefault();
          setPanel(target);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });

    // Human/Scientific toggles inside each panel
    document.querySelectorAll(".panel").forEach((panel) => {
      const toggles = panel.querySelectorAll(".toggle[data-mode]");
      if (!toggles.length) return;

      toggles.forEach((b) => {
        b.addEventListener("click", (e) => {
          e.preventDefault();
          setMode(panel, b.getAttribute("data-mode"));
        });
      });

      // default
      setMode(panel, "human");
    });
  });
})();
