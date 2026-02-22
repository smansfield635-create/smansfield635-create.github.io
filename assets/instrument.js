/* TNT FILE: /assets/instrument.js
   CRP INSTRUMENT ENGINE v3 — FULL TNT
   Purpose: normalize state ONLY (no blocking, no redirects)
   Fixes: key drift (gd_* vs crp_*), value drift (EN/en), query carry.
*/
(() => {
  const VALID_LANG = ["en","zh"];
  const VALID_DEPTH = ["explore","learn"];

  const K1_LANG = "gd_lang";
  const K1_DEPTH = "gd_depth";
  const K2_LANG = "crp_lang";
  const K2_DEPTH = "crp_depth";

  const qs = new URLSearchParams(location.search || "");
  const qLang = (qs.get("lang") || "").toLowerCase();
  const qDepth = (qs.get("depth") || "").toLowerCase();

  function readAny(keyA, keyB){
    try {
      return (localStorage.getItem(keyA) || localStorage.getItem(keyB) || "");
    } catch(e){ return ""; }
  }

  function writeBoth(keyA, keyB, val){
    try {
      localStorage.setItem(keyA, val);
      localStorage.setItem(keyB, val);
    } catch(e){}
  }

  function normalizeLang(v){
    const s = String(v||"").toLowerCase();
    if (s === "en" || s === "english") return "en";
    if (s === "zh" || s === "cn" || s === "中文" || s === "chinese") return "zh";
    return "";
  }

  function normalizeDepth(v){
    const s = String(v||"").toLowerCase();
    if (s === "explore" || s === "surface") return "explore";
    if (s === "learn" || s === "deep") return "learn";
    return "";
  }

  // 1) query wins
  const langQ = normalizeLang(qLang);
  const depthQ = normalizeDepth(qDepth);
  if (langQ) writeBoth(K1_LANG, K2_LANG, langQ);
  if (depthQ) writeBoth(K1_DEPTH, K2_DEPTH, depthQ);

  // 2) otherwise normalize existing storage and re-write cleanly
  const langS = normalizeLang(readAny(K1_LANG, K2_LANG));
  const depthS = normalizeDepth(readAny(K1_DEPTH, K2_DEPTH));
  if (langS) writeBoth(K1_LANG, K2_LANG, langS);
  if (depthS) writeBoth(K1_DEPTH, K2_DEPTH, depthS);

  // 3) do not redirect or enforce routes (leaf safe)
})();
