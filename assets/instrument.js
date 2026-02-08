/* TNT: /assets/instrument.js
   Purpose: disable canonical routing logic on leaf pages.
   Rule: only run "route enforcement" on HUB pages. Everywhere else: NO-OP.
*/
(() => {
  const path = (location.pathname || "/").toLowerCase();

  // Normalize: treat /x as /x/
  const norm = path.endsWith("/") ? path : path + "/";

  // HUB allowlist (ONLY these pages may run route enforcement)
  const HUBS = new Set([
    "/",               // root landing
    "/home/",
    "/door/",
    "/laws/",
    "/laws/categories/",
    "/products/",
    "/links/",
    "/gauges/",
    "/diagnostic/"
  ]);

  // If not a hub, do NOTHING (prevents "Not Found / canonical structure" blocks on leaf pages)
  if (!HUBS.has(norm)) return;

  // =========================
  // HUB-ONLY ROUTE ENFORCEMENT
  // =========================
  // If you previously had canonical enforcement here, keep it HERE ONLY.
  // Minimal safe behavior: do not block anything by default.
  // (If you want strict enforcement later, we add a hub-only allowlist here.)
})();
