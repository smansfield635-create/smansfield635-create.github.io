/* =====================================================
   TNT FILE: /assets/instrument.js
   PURPOSE: FIX THE WEBSITE NOW
   RESULT:
     - Unifies state keys (gd_lang/gd_depth) everywhere
     - Migrates legacy keys (crp_lang/crp_depth) automatically
     - Normalizes casing (EN->en, EXPLORE->explore, etc.)
     - Optional minimal hub gating (/, /door/, /home/, /explore/)
   COPY/PASTE THIS ENTIRE FILE AS-IS
===================================================== */

(() => {
  // ===== Canonical keys (ONLY THESE) =====
  const K_LANG  = "gd_lang";    // "en" | "zh"
  const K_DEPTH = "gd_depth";   // "explore" | "learn"

  // ===== Legacy keys (auto-migrate, then ignore) =====
  const K_LANG_OLD  = "crp_lang";
  const K_DEPTH_OLD = "crp_depth";

  const VALID_LANG  = new Set(["en","zh"]);
  const VALID_DEPTH = new Set(["explore","learn"]);

  const safeGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const safeSet = (k,v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const safeDel = (k) => { try { localStorage.removeItem(k); } catch (e) {} };

  const norm = (v) => String(v ?? "").trim().toLowerCase();

  const normLang = (v) => {
    v = norm(v);
    if (v === "en" || v === "english") return "en";
    if (v === "zh" || v === "cn" || v === "chinese" || v === "中文") return "zh";
    if (v === "zh-cn" || v === "zh-hans") return "zh";
    // handle bad casing
    if (v === "en-us") return "en";
    return VALID_LANG.has(v) ? v : null;
  };

  const normDepth = (v) => {
    v = norm(v);
    if (v === "explore") return "explore";
    if (v === "learn") return "learn";
    // legacy synonyms
    if (v === "surface") return "explore";
    if (v === "deep") return "learn";
    if (v === "shop") return "explore";
    return VALID_DEPTH.has(v) ? v : null;
  };

  // ===== 1) Querystring override (wins if present) =====
  const qs = new URLSearchParams(location.search || "");
  const qLang  = normLang(qs.get("lang"));
  const qDepth = normDepth(qs.get("depth"));

  if (qLang)  safeSet(K_LANG, qLang);
  if (qDepth) safeSet(K_DEPTH, qDepth);

  // ===== 2) Migrate legacy -> canonical (if canonical missing) =====
  const curLang = normLang(safeGet(K_LANG));
  const curDepth = normDepth(safeGet(K_DEPTH));

  const oldLang = normLang(safeGet(K_LANG_OLD));
  const oldDepth = normDepth(safeGet(K_DEPTH_OLD));

  if (!curLang && oldLang) safeSet(K_LANG, oldLang);
  if (!curDepth && oldDepth) safeSet(K_DEPTH, oldDepth);

  // ===== 3) Normalize + delete legacy keys =====
  const finalLang = normLang(safeGet(K_LANG));
  const finalDepth = normDepth(safeGet(K_DEPTH));

  if (finalLang) safeSet(K_LANG, finalLang); else safeDel(K_LANG);
  if (finalDepth) safeSet(K_DEPTH, finalDepth); else safeDel(K_DEPTH);

  safeDel(K_LANG_OLD);
  safeDel(K_DEPTH_OLD);

  // ===== 4) Minimal hub gating (prevents broken states) =====
  const path = (location.pathname || "/").toLowerCase();
  const normPath = path.endsWith("/") ? path : (path + "/");

  const IS_INDEX   = (normPath === "/");
  const IS_DOOR    = (normPath === "/door/");
  const IS_HOME    = (normPath === "/home/");
  const IS_EXPLORE = (normPath === "/explore/");

  if (IS_INDEX) return;

  const L = normLang(safeGet(K_LANG));
  const D = normDepth(safeGet(K_DEPTH));

  if (IS_DOOR) {
    if (!L) location.replace("/");
    return;
  }

  if (IS_HOME || IS_EXPLORE) {
    if (!L) { location.replace("/"); return; }
    if (!D) { location.replace("/door/"); return; }
    return;
  }

  // Leaf pages: no enforcement
})();
```0
