(() => {
  const KEY = "geo_lens";
  const DEFAULT_LENS = "human";

  function getLens() {
    try { return localStorage.getItem(KEY) || DEFAULT_LENS; }
    catch { return DEFAULT_LENS; }
  }
  function setLens(v) {
    try { localStorage.setItem(KEY, v); } catch {}
  }

  function applyLens(root, lens) {
    const panes = root.querySelectorAll("[data-lens-pane]");
    panes.forEach(p => {
      const pLens = p.getAttribute("data-lens-pane");
      p.style.display = (pLens === lens) ? "" : "none";
    });

    const btns = root.querySelectorAll("[data-lens-btn]");
    btns.forEach(b => {
      const bLens = b.getAttribute("data-lens-btn");
      b.classList.toggle("is-active", bLens === lens);
      b.setAttribute("aria-pressed", String(bLens === lens));
    });
  }

  function initScope(scope) {
    const root = scope;
    const btns = root.querySelectorAll("[data-lens-btn]");
    if (!btns.length) return;

    // click handlers
    btns.forEach(b => {
      b.addEventListener("click", () => {
        const lens = b.getAttribute("data-lens-btn");
        if (!lens) return;
        setLens(lens);
        applyLens(root, lens);
      });
    });

    // initial
    applyLens(root, getLens());
  }

  document.addEventListener("DOMContentLoaded", () => {
    // support multiple toggles per page (rare, but safe)
    document.querySelectorAll("[data-lens-scope]").forEach(initScope);
  });
})();
