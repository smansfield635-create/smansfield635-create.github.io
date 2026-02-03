/* FILE: /assets/ui.js  (TNT FULL REPLACEMENT)
   PURPOSE:
   - LOCK MEDIUM: unclickable baseline field, per-room cosmic feel
   - KEEP WIRING: data-drop + toggles (global, delegated)
*/

(function () {
  if (window.__GEO_UI_V16__) return;
  window.__GEO_UI_V16__ = true;

  function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }

  // ---------- MEDIUM (ROOM TAGGING; NEVER CLICKABLE) ----------
  function setRoom() {
    var p = (location.pathname || "/").toLowerCase();
    var room = "generic";
    if (p === "/" || p.startsWith("/index")) room = "sayings";
    else if (p.startsWith("/home")) room = "remote";
    else if (p.startsWith("/laws")) room = "laws";
    else if (p.startsWith("/products")) room = "products";
    else if (p.startsWith("/gauges")) room = "gauges";
    else if (p.startsWith("/links")) room = "links";
    else if (p.startsWith("/application")) room = "application";
    else if (p.startsWith("/views")) room = "views";
    else if (p.startsWith("/uca")) room = "uca";
    else if (p.startsWith("/m256")) room = "m256";
    else if (p.startsWith("/eai")) room = "eai";
    document.body.setAttribute("data-room", room);
  }

  // ---------- DROPDOWNS ----------
  function toggleDrop(id){
    if(!id) return;
    var panel = document.getElementById(id);
    if(!panel) return;
    if(!panel.classList.contains("drop")) panel.classList.add("drop");
    panel.classList.toggle("open");
  }

  // ---------- TOGGLES ----------
  function setToggleMode(groupId, mode){
    if(!groupId || !mode) return;

    var buttons = $all('[data-toggle="' + groupId + '"]');
    var panes = $all('[data-pane="' + groupId + '"]');

    if(buttons.length===0 && panes.length===0) return;

    buttons.forEach(function(b){
      var on = (b.getAttribute("data-mode")||"") === mode;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    panes.forEach(function(p){
      var on = (p.getAttribute("data-mode")||"") === mode;
      p.classList.toggle("show", on);
      p.style.display = on ? "block" : "none";
    });

    try{ sessionStorage.setItem("GEO_TOGGLE_" + groupId, mode); }catch(e){}
  }

  function ensureToggleDefaults(){
    $all("[data-toggle-group]").forEach(function(g){
      var gid = g.getAttribute("data-toggle-group");
      if(!gid) return;
      var saved = null;
      try{ saved = sessionStorage.getItem("GEO_TOGGLE_" + gid); }catch(e){}
      setToggleMode(gid, saved || "human");
    });
  }

  // ---------- EVENT DELEGATION (GLOBAL CLICKABILITY) ----------
  function onDocClick(e){
    var el = e.target;

    var dropBtn = el.closest && el.closest("[data-drop]");
    if(dropBtn){
      toggleDrop(dropBtn.getAttribute("data-drop"));
      return;
    }

    var tBtn = el.closest && el.closest("[data-toggle]");
    if(tBtn){
      setToggleMode(tBtn.getAttribute("data-toggle"), tBtn.getAttribute("data-mode") || "human");
      return;
    }
  }

  function boot(){
    setRoom();
    document.addEventListener("click", onDocClick, true);
    ensureToggleDefaults();
    setTimeout(ensureToggleDefaults, 50);
    setTimeout(ensureToggleDefaults, 250);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
