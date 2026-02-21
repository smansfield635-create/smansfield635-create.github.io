/* =====================================================
   CRP INSTRUMENT ENGINE v2 — FULL TNT
   Purpose: state validation only (no routing enforcement)
   Rules:
     - Language must exist before Door/Home
     - Depth must exist before Home
     - No blocking on leaf pages
===================================================== */

(() => {

  const path = (location.pathname || "/").toLowerCase();
  const norm = path.endsWith("/") ? path : path + "/";

  const K_LANG = "gd_lang";
  const K_DEPTH = "gd_depth";

  const VALID_LANG = ["en","zh"];
  const VALID_DEPTH = ["explore","learn"];

  function normalize() {
    let lang = localStorage.getItem(K_LANG);
    let depth = localStorage.getItem(K_DEPTH);

    if (!VALID_LANG.includes(lang)) {
      localStorage.removeItem(K_LANG);
      lang = null;
    }

    if (!VALID_DEPTH.includes(depth)) {
      localStorage.removeItem(K_DEPTH);
      depth = null;
    }

    return { lang, depth };
  }

  const { lang, depth } = normalize();

  /* -----------------------------------------------------
     INDEX: no requirements
  ----------------------------------------------------- */
  if (norm === "/") {
    return;
  }

  /* -----------------------------------------------------
     DOOR: requires language
  ----------------------------------------------------- */
  if (norm === "/door/") {
    if (!lang) {
      window.location.replace("/");
    }
    return;
  }

  /* -----------------------------------------------------
     HOME: requires language + depth
  ----------------------------------------------------- */
  if (norm === "/home/") {
    if (!lang) {
      window.location.replace("/");
      return;
    }

    if (!depth) {
      window.location.replace("/door/");
      return;
    }

    return;
  }

  /* -----------------------------------------------------
     LEAF PAGES: do nothing
  ----------------------------------------------------- */
  return;

})();
