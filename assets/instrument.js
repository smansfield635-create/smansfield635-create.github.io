/* =====================================================
   TNT FILE: /assets/instrument.js
   CRP STATE BRIDGE v3 — FULL TNT
   Purpose:
     - Single source of truth for lang/depth across pages
     - Bridge legacy keys (crp_*) and current keys (gd_*)
     - Accept querystring overrides (?lang=zh&depth=learn)
   No routing enforcement. No page blocking.
===================================================== */

(() => {
  const VALID_LANG = new Set(["en","zh"]);
  const VALID_DEPTH = new Set(["explore","learn"]);

  // Canonical keys going forward
  const K_LANG = "gd_lang";
  const K_DEPTH = "gd_depth";

  // Legacy keys that may still exist
  const K_LANG_OLD = "crp_lang";
  const K_DEPTH_OLD = "crp_depth";

  const qs = new URLSearchParams(location.search);

  const norm = (s) => String(s || "").trim().toLowerCase();

  const pickLang = (v) => {
    v = norm(v);
    if (v === "cn" || v === "zh-cn" || v === "zh-hans") v = "zh";
    if (v === "eng") v = "en";
    return VALID_LANG.has(v) ? v : null;
  };

  const pickDepth = (v) => {
    v = norm(v);
    if (v === "shop") v = "explore"; // legacy mapping
    return VALID_DEPTH.has(v) ? v : null;
  };

  function getAny(keyA, keyB){
    try {
      return localStorage.getItem(keyA) || localStorage.getItem(keyB);
    } catch (e) {
      return null;
    }
  }

  function setKey(key, val){
    try { localStorage.setItem(key, val); } catch(e){}
  }

  function delKey(key){
    try { localStorage.removeItem(key); } catch(e){}
  }

  // 1) Querystring wins (explicit user choice)
  const qLang = pickLang(qs.get("lang"));
  const qDepth = pickDepth(qs.get("depth"));

  // 2) Otherwise any existing stored value
  const sLang = pickLang(getAny(K_LANG, K_LANG_OLD));
  const sDepth = pickDepth(getAny(K_DEPTH, K_DEPTH_OLD));

  const finalLang = qLang || sLang;
  const finalDepth = qDepth || sDepth;

  // 3) Write BOTH keysets so every page agrees
  if (finalLang) {
    setKey(K_LANG, finalLang);
    setKey(K_LANG_OLD, finalLang);
  } else {
    delKey(K_LANG);
    delKey(K_LANG_OLD);
  }

  if (finalDepth) {
    setKey(K_DEPTH, finalDepth);
    setKey(K_DEPTH_OLD, finalDepth);
  } else {
    delKey(K_DEPTH);
    delKey(K_DEPTH_OLD);
  }

  // Optional: clean URL after applying query (prevents re-overrides)
  if (qLang || qDepth) {
    qs.delete("lang");
    qs.delete("depth");
    const next = location.pathname + (qs.toString() ? ("?" + qs.toString()) : "") + location.hash;
    history.replaceState({}, "", next);
  }
})();
