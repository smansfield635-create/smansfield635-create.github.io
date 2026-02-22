/* =====================================================
   TNT FILE: /assets/instrument.js
   CRP INSTRUMENT ENGINE v3 — STATE VALIDATION ONLY
   State: gd_lang ("en"|"zh"), gd_depth ("explore"|"learn")
===================================================== */

(() => {
  const path = (location.pathname || "/").toLowerCase();
  const norm = path.endsWith("/") ? path : path + "/";

  const IS_INDEX = (norm === "/");
  const IS_DOOR  = (norm === "/door/");
  const IS_HOME  = (norm === "/home/");

  // Leaf pages: no enforcement
  if (!IS_INDEX && !IS_DOOR && !IS_HOME) return;

  const K_LANG  = "gd_lang";
  const K_DEPTH = "gd_depth";

  const VALID_LANG  = new Set(["en","zh"]);
  const VALID_DEPTH = new Set(["explore","learn"]);

  const qs = new URLSearchParams(location.search || "");

  const getLS = (k) => { try { return localStorage.getItem(k); } catch(e){ return null; } };
  const setLS = (k,v) => { try { localStorage.setItem(k, v); } catch(e){} };
  const delLS = (k) => { try { localStorage.removeItem(k); } catch(e){} };

  const normalizeLang = (v) => {
    if (!v) return null;
    v = String(v).trim().toLowerCase();
    if (v === "en" || v === "english") return "en";
    if (v === "zh" || v === "cn" || v === "chinese") return "zh";
    return VALID_LANG.has(v) ? v : null;
  };

  const normalizeDepth = (v) => {
    if (!v) return null;
    v = String(v).trim().toLowerCase();
    return VALID_DEPTH.has(v) ? v : null;
  };

  // Query params have priority (if present)
  const qLang  = normalizeLang(qs.get("lang"));
  const qDepth = normalizeDepth(qs.get("depth"));
  if (qLang)  setLS(K_LANG, qLang);
  if (qDepth) setLS(K_DEPTH, qDepth);

  // Normalize stored
  let lang  = normalizeLang(getLS(K_LANG));
  let depth = normalizeDepth(getLS(K_DEPTH));
  if (!lang)  delLS(K_LANG);
  if (!depth) delLS(K_DEPTH);

  if (IS_INDEX) return;

  if (IS_DOOR) {
    if (!lang) location.replace("/");
    return;
  }

  if (IS_HOME) {
    if (!lang) { location.replace("/"); return; }
    if (!depth) { location.replace("/door/"); return; }
    return;
  }
})();
