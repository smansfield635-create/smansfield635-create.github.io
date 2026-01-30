(() => {
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Tabs
  function initTabs() {
    qsa(".tabs").forEach((tabs) => {
      const buttons = qsa(".tab", tabs);
      const panelsWrap = tabs.closest("[data-tabs]") || tabs.parentElement;
      const panels = qsa(".tab-panel", panelsWrap);

      if (!buttons.length || !panels.length) return;

      const key = tabs.getAttribute("data-key") || location.pathname;
      const fromHash = (location.hash || "").replace("#tab=", "");
      const saved = localStorage.getItem("tab:" + key) || "";
      const want = fromHash || saved || buttons[0].dataset.tab;

      const setActive = (name) => {
        buttons.forEach((b) => {
          const on = b.dataset.tab === name;
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach((p) => {
          p.dataset.active = (p.dataset.panel === name) ? "true" : "false";
        });
        localStorage.setItem("tab:" + key, name);
      };

      buttons.forEach((b) => {
        b.addEventListener("click", () => setActive(b.dataset.tab));
      });

      setActive(want);
    });
  }

  // Bubble modal
  function initBubbles() {
    const modal = qs("#modal");
    const title = qs("#modalTitle");
    const body = qs("#modalBody");
    const action = qs("#modalAction");
    const close = qs("#modalClose");

    if (!modal || !title || !body || !close) return;

    const open = (t, b, href) => {
      title.textContent = t || "Details";
      body.textContent = b || "";
      if (action) {
        if (href) { action.style.display = "inline-block"; action.setAttribute("href", href); }
        else { action.style.display = "none"; action.removeAttribute("href"); }
      }
      modal.dataset.open = "true";
      document.body.style.overflow = "hidden";
    };

    const shut = () => {
      modal.dataset.open = "false";
      document.body.style.overflow = "";
    };

    close.addEventListener("click", shut);
    modal.addEventListener("click", (e) => { if (e.target === modal) shut(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") shut(); });

    qsa(".bubble").forEach((b) => {
      b.addEventListener("click", () => {
        open(
          b.getAttribute("data-title") || qs(".b-title", b)?.textContent,
          b.getAttribute("data-body") || qs(".b-sub", b)?.textContent,
          b.getAttribute("data-link") || ""
        );
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initBubbles();
  });
})();
