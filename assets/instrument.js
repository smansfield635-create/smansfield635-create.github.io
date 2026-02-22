/* TNT FILE: /assets/instrument.js
   CRP INSTRUMENT ENGINE v3 — State + UI safety only
   Purpose:
     - Persist: language + depth + time + style
     - Normalize query params → localStorage
     - Minimal gating (only for /door/ and /home/ and /explore/)
     - NEVER blocks leaf pages
*/

(() => {
  const path = (location.pathname || "/").toLowerCase();
  const norm = path.endsWith("/") ? path : path + "/";

  const K_LANG  = "gd_lang";   // "en" | "zh"
  const K_DEPTH = "gd_depth";  // "explore" | "learn"
  const K_TIME  = "gd_time";   // "origin" | "now" | "trajectory"
  const K_STYLE = "gd_style";  // "formal" | "informal"

  const VALID_LANG  = new Set(["en","zh"]);
  const VALID_DEPTH = new Set(["explore","learn"]);
  const VALID_TIME  = new Set(["origin","now","trajectory"]);
  const VALID_STYLE = new Set(["formal","informal"]);

  const qp = new URLSearchParams(location.search);

  function setIfValid(key, val, validSet){
    if (!val) return;
    const v = String(val).toLowerCase();
    if (validSet.has(v)) {
      try { localStorage.setItem(key, v); } catch(e){}
    }
  }

  // Pull from querystring if present (index → door carries ?lang= / ?depth= etc)
  setIfValid(K_LANG,  qp.get("lang"),  VALID_LANG);
  setIfValid(K_DEPTH, qp.get("depth"), VALID_DEPTH);
  setIfValid(K_TIME,  qp.get("time"),  VALID_TIME);
  setIfValid(K_STYLE, qp.get("style"), VALID_STYLE);

  // Normalize invalid stored values
  function getValid(key, validSet){
    let v = null;
    try { v = localStorage.getItem(key); } catch(e){}
    if (!v) return null;
    v = String(v).toLowerCase();
    if (!validSet.has(v)) {
      try { localStorage.removeItem(key); } catch(e){}
      return null;
    }
    return v;
  }

  const lang  = getValid(K_LANG,  VALID_LANG);
  const depth = getValid(K_DEPTH, VALID_DEPTH);

  // INDEX: no requirements
  if (norm === "/") return;

  // DOOR: requires language
  if (norm === "/door/") {
    if (!lang) { location.replace("/"); }
    return;
  }

  // EXPLORE + HOME: require language + depth
  if (norm === "/explore/" || norm === "/home/") {
    if (!lang) { location.replace("/"); return; }
    if (!depth) { location.replace("/door/"); return; }
    return;
  }

  // Everything else: NO-OP
})();
