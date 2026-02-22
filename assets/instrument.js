/* =====================================================
   TNT: /assets/instrument.js
   CRP INSTRUMENT ENGINE v3 — STATE VALIDATION ONLY
   Purpose:
     - Normalize + persist state (lang/depth)
     - Gate only HUB pages (/, /door/, /home/)
     - NO enforcement on leaf pages
   State:
     - gd_lang: "en" | "zh"
     - gd_depth: "explore" | "learn"
   Compatibility:
     - Migrates legacy keys: crp_lang/crp_depth
     - Accepts query params: ?lang= & ?depth=
===================================================== */

(() => {
  const path = (location.pathname || "/").toLowerCase();
  const norm = path.endsWith("/") ? path : path + "/";

  // HUB pages only
  const IS_INDEX = (norm === "/");
  const IS_DOOR  = (norm === "/door/");
  const IS_HOME  = (norm === "/home/");

  // Leaf pages: do nothing, ever
  if (!IS_INDEX && !IS_DOOR && !IS_HOME) return;

  const K_LANG  = "gd_lang";
  const K_DEPTH = "gd_depth";

  const LEGACY_LANG  = "crp_lang";
  const LEGACY_DEPTH = "crp_depth";

  const VALID_LANG  = new Set(["en","zh"]);
  const VALID_DEPTH = new Set(["explore","learn"]);

  const qs = new URLSearchParams(location.search || "");

  // ---- helpers
  const getLS = (k) => { try { return localStorage.getItem(k); } catch(e){ return null; } };
  const setLS = (k,v) => { try { localStorage.setItem(k, v); } catch(e){} };
  const delLS = (k) => { try { localStorage.removeItem(k); } catch(e){} };

  const normalizeLang = (v) => {
    if (!v) return null;
    v = String(v).trim().toLowerCase();
    // allow EN/ZH UI tokens
    if (v === "en" || v === "english") return "en";
    if (v === "zh" || v === "中文" || v === "cn" || v === "chinese") return "zh";
    return VALID_LANG.has(v) ? v : null;
  };

  const normalizeDepth = (v) => {
    if (!v) return null;
    v = String(v).trim().toLowerCase();
    return VALID_DEPTH.has(v) ? v : null;
  };

  // ---- 1) migrate legacy -> gd_*
  const legacyLang  = normalizeLang(getLS(LEGACY_LANG));
  const legacyDepth = normalizeDepth(getLS(LEGACY_DEPTH));
  if (legacyLang && !normalizeLang(getLS(K_LANG))) setLS(K_LANG, legacyLang);
  if (legacyDepth && !normalizeDepth(getLS(K_DEPTH))) setLS(K_DEPTH, legacyDepth);

  // ---- 2) query param -> gd_* (highest priority)
  const qLang  = normalizeLang(qs.get("lang"));
  const qDepth = normalizeDepth(qs.get("depth"));
  if (qLang)  setLS(K_LANG, qLang);
  if (qDepth) setLS(K_DEPTH, qDepth);

  // ---- 3) normalize stored state
  let lang  = normalizeLang(getLS(K_LANG));
  let depth = normalizeDepth(getLS(K_DEPTH));

  if (!lang)  delLS(K_LANG);
  if (!depth) delLS(K_DEPTH);

  // ---- 4) HUB gating
  if (IS_INDEX) {
    // index requires nothing
    return;
  }

  if (IS_DOOR) {
    // door requires language
    if (!lang) {
      location.replace("/"); // back to index to pick language
      return;
    }
    return;
  }

  if (IS_HOME) {
    // home requires language + depth
    if (!lang) {
      location.replace("/");
      return;
    }
    if (!depth) {
      location.replace("/door/");
      return;
    }
    return;
  }
})();
