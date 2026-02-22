/* =====================================================
   TNT FILE: /assets/instrument.js
   CRP INSTRUMENT ENGINE v4 — STATE NORMALIZATION + HUB GATING ONLY
   Canonical keys:
     - gd_lang: "en" | "zh"
     - gd_depth: "explore" | "learn"
   Compatibility:
     - reads crp_lang/crp_depth if present and migrates once
   HUBS:
     - "/" (no requirements)
     - "/door/" requires gd_lang
     - "/home/" requires gd_lang + gd_depth
   Leaf pages: never gate
===================================================== */

(() => {
  const path = (location.pathname || "/").toLowerCase();
  const norm = path.endsWith("/") ? path : path + "/";

  const IS_INDEX = (norm === "/");
  const IS_DOOR  = (norm === "/door/");
  const IS_HOME  = (norm === "/home/");

  if (!IS_INDEX && !IS_DOOR && !IS_HOME) return;

  const K_LANG  = "gd_lang";
  const K_DEPTH = "gd_depth";

  const LEG_LANG  = "crp_lang";
  const LEG_DEPTH = "crp_depth";

  const VALID_LANG  = new Set(["en","zh"]);
  const VALID_DEPTH = new Set(["explore","learn"]);

  const qs = new URLSearchParams(location.search || "");

  const getLS = (k) => { try { return localStorage.getItem(k); } catch(e){ return null; } };
  const setLS = (k,v) => { try { localStorage.setItem(k, v); } catch(e){} };
  const delLS = (k) => { try { localStorage.removeItem(k); } catch(e){} };

  const normLang = (v) => {
    if (!v) return null;
    v = String(v).trim().toLowerCase();
    if (v === "en" || v === "english") return "en";
    if (v === "zh" || v === "cn" || v === "chinese") return "zh";
    return VALID_LANG.has(v) ? v : null;
  };
  const normDepth = (v) => {
    if (!v) return null;
    v = String(v).trim().toLowerCase();
    return VALID_DEPTH.has(v) ? v : null;
  };

  // 1) migrate legacy once (if gd_* missing)
  const existingLang = normLang(getLS(K_LANG));
  const existingDepth = normDepth(getLS(K_DEPTH));

  const legacyLang = normLang(getLS(LEG_LANG));
  const legacyDepth = normDepth(getLS(LEG_DEPTH));

  if (!existingLang && legacyLang) setLS(K_LANG, legacyLang);
  if (!existingDepth && legacyDepth) setLS(K_DEPTH, legacyDepth);

  // 2) query params override
  const qLang = normLang(qs.get("lang"));
  const qDepth = normDepth(qs.get("depth"));
  if (qLang) setLS(K_LANG, qLang);
  if (qDepth) setLS(K_DEPTH, qDepth);

  // 3) normalize stored
  let lang = normLang(getLS(K_LANG));
  let depth = normDepth(getLS(K_DEPTH));

  if (!lang) delLS(K_LANG);
  if (!depth) delLS(K_DEPTH);

  // 4) gating (hubs only)
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
