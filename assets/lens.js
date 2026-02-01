/* Geodiametrics Lens Toggle (Human ↔ Scientific)
   Works on any page that includes:
   - buttons: [data-lens-btn="human"] and [data-lens-btn="scientific"]
   - panes:   [data-lens-pane="human"] and [data-lens-pane="scientific"]
*/

(function () {
  function setPressed(btn, pressed) {
    if (!btn) return;
    btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    if (pressed) btn.classList.add("is-active");
    else btn.classList.remove("is-active");
  }

  function showPane(root, lens) {
    const humanPane = root.querySelector('[data-lens-pane="human"]');
    const sciPane = root.querySelector('[data-lens-pane="scientific"]');

    if (humanPane) humanPane.style.display = lens === "human" ? "" : "none";
    if (sciPane) sciPane.style.display = lens === "scientific" ? "" : "none";

    const humanBtn = root.querySelector('[data-lens-btn="human"]');
    const sciBtn = root.querySelector('[data-lens-btn="scientific"]');

    setPressed(humanBtn, lens === "human");
    setPressed(sciBtn, lens === "scientific");

    // Persist per-page path
    try {
      const key = "geo_lens:" + (location.pathname || "/");
      localStorage.setItem(key, lens);
    } catch (_) {}
  }

  function getSavedLens() {
    try {
      const key = "geo_lens:" + (location.pathname || "/");
      const v = localStorage.getItem(key);
      if (v === "human" || v === "scientific") return v;
    } catch (_) {}
    return "human";
  }

  function bindOne(root) {
    // Default lens: saved, otherwise human
    let lens = getSavedLens();

    // If page is missing panes/buttons, do nothing
    const hasButtons =
      root.querySelector('[data-lens-btn="human"]') &&
      root.querySelector('[data-lens-btn="scientific"]');
    const hasPanes =
      root.querySelector('[data-lens-pane="human"]') &&
      root.querySelector('[data-lens-pane="scientific"]');

    if (!hasButtons || !hasPanes) return;

    // Initial render
    showPane(root, lens);

    // Click handlers
    const humanBtn = root.querySelector('[data-lens-btn="human"]');
    const sciBtn = root.querySelector('[data-lens-btn="scientific"]');

    humanBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showPane(root, "human");
    });

    sciBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showPane(root, "scientific");
    });

    // Keyboard support
    humanBtn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showPane(root, "human");
      }
    });
    sciBtn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showPane(root, "scientific");
      }
    });
  }

  function boot() {
    // Support multiple roots if needed
    const roots = document.querySelectorAll("[data-lens-scope]");
    if (!roots.length) return;
    roots.forEach(bindOne);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
