/* =====================================================
   TNT FILE: /assets/instrument.js
   CRP INSTRUMENT ENGINE v3 — FULL TNT
   Purpose: state validation + normalization (NO routing enforcement on leaf pages)
   Single Source of Truth keys:
     - gd_lang: "en" | "zh"
     - gd_depth: "explore" | "learn"
===================================================== */
(() => {
  const path = (location.pathname || "/").toLowerCase();
  const norm = path.endsWith("/") ? path : path + "/";

  const K_LANG = "gd_lang";
  const K_DEPTH = "gd_depth";

  const VALID_LANG = new Set(["en", "zh"]);
  const VALID_DEPTH = new Set(["explore", "learn"]);

  const qs = new URLSearchParams(location.search);
  const qLang = (qs.get("lang") || "").toLowerCase();
  const qDepth = (qs.get("depth") || "").toLowerCase();

  // Querystring can set state (used by Index -> Door handoff)
  if (VALID_LANG.has(qLang)) {
    try { localStorage.setItem(K_LANG, qLang); } catch(e){}
  }
  if (VALID_DEPTH.has(qDepth)) {
    try { localStorage.setItem(K_DEPTH, qDepth); } catch(e){}
  }

  // Normalize invalid values
  let lang = null, depth = null;
  try {
    lang = localStorage.getItem(K_LANG);
    depth = localStorage.getItem(K_DEPTH);
  } catch(e){}

  if (!VALID_LANG.has(lang)) {
    try { localStorage.removeItem(K_LANG); } catch(e){}
    lang = null;
  }
  if (!VALID_DEPTH.has(depth)) {
    try { localStorage.removeItem(K_DEPTH); } catch(e){}
    depth = null;
  }

  // Hubs only (requirements)
  if (norm === "/") return;

  if (norm === "/door/") {
    if (!lang) location.replace("/");
    return;
  }

  if (norm === "/home/") {
    if (!lang) { location.replace("/"); return; }
    if (!depth) { location.replace("/door/"); return; }
    return;
  }

  // Leaf pages: never block
})();
