/* =========================================================
   GEODIAMETRICS UI — TOGGLES + DROPDOWNS
   TNT FULL REPLACEMENT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* DROPDOWNS */
  document.querySelectorAll("[data-drop]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-drop");
      const panel = document.getElementById(id);
      if (!panel) return;
      panel.classList.toggle("open");
    });
  });

  /* TOGGLES (HUMAN / SCIENTIFIC) */
  document.querySelectorAll("[data-toggle-group]").forEach(group => {
    const gid = group.getAttribute("data-toggle-group");

    const buttons = document.querySelectorAll(`[data-toggle="${gid}"]`);
    const panes = document.querySelectorAll(`[data-pane="${gid}"]`);

    const setMode = (mode) => {
      buttons.forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-mode") === mode);
      });
      panes.forEach(p => {
        p.classList.toggle("show", p.getAttribute("data-mode") === mode);
      });
    };

    buttons.forEach(b => {
      b.addEventListener("click", () => setMode(b.getAttribute("data-mode")));
    });

    /* default */
    setMode("human");
  });

});
