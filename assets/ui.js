/* =========================================================
   GEODIAMETRICS UI CONTROLLER
   RULES:
   - Geometry is authoritative
   - Navigation is explicit (links only)
   - AI/Ask is reference-only (no routing, no suggestions)
   - No auto-navigation, ever
   ========================================================= */

(() => {
  const ready = (fn) =>
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", fn)
      : fn();

  /* ---------- Utilities ---------- */
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* ---------- Page Flags ---------- */
  function pageFlags(){
    return {
      isHome: !!qs('[data-page="home"]'),
      isLanding: !!qs('[data-page="landing"]'),
      isAsk: !!qs('[data-page="ask"]'),
    };
  }

  /* ---------- Safety: Never auto-route ---------- */
  function blockAutoRouting(){
    // Prevent any accidental JS-driven navigation
    window.addEventListener('beforeunload', () => {});
  }

  /* ---------- Panels (read-only reveal) ---------- */
  function bindPanels(){
    qsa('[data-open]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const id = btn.getAttribute('data-open');
        if(!id) return;

        // Hide all panels, then show target
        qsa('.panel').forEach(p => p.classList.remove('on'));
        const panel = qs('#'+id);
        if(panel) panel.classList.add('on');
      }, { passive:false });
    });
  }

  /* ---------- Human / Scientific toggles (content pages only) ---------- */
  function bindToggles(){
    qsa('.toggleRow').forEach(row => {
      const panel = row.closest('.panel') || document;
      const toggles = qsa('.toggle', row);
      const modes = qsa('.mode', panel);

      function setMode(m){
        toggles.forEach(t => t.classList.toggle('on', t.dataset.mode===m));
        modes.forEach(md => md.classList.toggle('on', md.dataset.mode===m));
      }

      toggles.forEach(t => {
        t.addEventListener('click', e => {
          e.preventDefault();
          setMode(t.dataset.mode);
        }, { passive:false });
      });

      // default
      if(toggles[0]?.dataset?.mode) setMode(toggles[0].dataset.mode);
    });
  }

  /* ---------- Ask (AI sidecar) hard rules ---------- */
  function lockAskSidecar(){
    // Ask page must never contain navigation affordances
    qsa('a', document).forEach(a => {
      // Allow explicit links only; disallow dynamic suggestion hooks
      a.removeAttribute('data-open');
    });

    // Prevent keyboard shortcuts or gestures from navigating
    window.addEventListener('keydown', (e) => {
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
        // No directional shortcuts on Ask
        e.stopPropagation();
      }
    }, true);
  }

  /* ---------- Initialize ---------- */
  ready(() => {
    const flags = pageFlags();

    blockAutoRouting();

    // Bind only what is allowed per page
    if(!flags.isHome && !flags.isLanding){
      bindPanels();
      bindToggles();
    }

    if(flags.isAsk){
      lockAskSidecar();
    }
  });
})();
