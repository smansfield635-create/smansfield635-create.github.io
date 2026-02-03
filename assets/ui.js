/* FILE: /assets/ui.js (TNT FULL REPLACEMENT)
   PURPOSE:
   - Restore click-to-reveal everywhere (data-drop -> .drop.open)
   - Restore Human/Scientific toggles everywhere (data-toggle/data-pane)
   - Use event delegation (works even if DOM changes or loads late)
   - No dependence on helper text / subtitles
*/

(function () {
  // Prevent double-binding if injected twice
  if (window.__GEO_UI_V12__) return;
  window.__GEO_UI_V12__ = true;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  // ---------- DROPDOWNS ----------
  function toggleDrop(id) {
    if (!id) return;
    var panel = document.getElementById(id);
    if (!panel) return;

    // Ensure it's a drop panel
    if (!panel.classList.contains("drop")) panel.classList.add("drop");

    panel.classList.toggle("open");
  }

  // ---------- TOGGLES ----------
  function setToggleMode(groupId, mode) {
    if (!groupId || !mode) return;

    // buttons: data-toggle="groupId" data-mode="human|scientific"
    var buttons = $all('[data-toggle="' + groupId + '"]');
    // panes: data-pane="groupId" data-mode="human|scientific"
    var panes = $all('[data-pane="' + groupId + '"]');

    if (buttons.length === 0 && panes.length === 0) return;

    buttons.forEach(function (b) {
      b.classList.toggle("active", (b.getAttribute("data-mode") || "") === mode);
      // accessibility
      b.setAttribute("aria-pressed", ((b.getAttribute("data-mode") || "") === mode) ? "true" : "false");
    });

    panes.forEach(function (p) {
      p.classList.toggle("show", (p.getAttribute("data-mode") || "") === mode);
      p.style.display = p.classList.contains("show") ? "block" : "none";
    });

    // Persist per-page (optional)
    try { sessionStorage.setItem("GEO_TOGGLE_" + groupId, mode); } catch (e) {}
  }

  function ensureToggleDefaults() {
    // Find all toggle groups declared on the page
    $all("[data-toggle-group]").forEach(function (g) {
      var groupId = g.getAttribute("data-toggle-group");
      if (!groupId) return;

      var saved = null;
      try { saved = sessionStorage.getItem("GEO_TOGGLE_" + groupId); } catch (e) {}
      var mode = saved || "human";

      // If a matching button exists, apply; else ignore
      setToggleMode(groupId, mode);
    });
  }

  // ---------- EVENT DELEGATION (THE FIX) ----------
  function onDocClick(e) {
    // Find nearest element with data-drop
    var el = e.target;
    var dropBtn = el.closest ? el.closest("[data-drop]") : null;
    if (dropBtn) {
      var id = dropBtn.getAttribute("data-drop");
      toggleDrop(id);
      return; // do not block nested clicks, but stop double-handling
    }

    // Toggle buttons
    var tBtn = el.closest ? el.closest("[data-toggle]") : null;
    if (tBtn) {
      var groupId = tBtn.getAttribute("data-toggle");
      var mode = tBtn.getAttribute("data-mode") || "human";
      setToggleMode(groupId, mode);
      return;
    }
  }

  function boot() {
    // Bind once
    document.addEventListener("click", onDocClick, true);

    // Apply defaults on load
    ensureToggleDefaults();

    // Also re-apply after a short delay (covers slow rendering)
    setTimeout(ensureToggleDefaults, 50);
    setTimeout(ensureToggleDefaults, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
