/* TNT: /assets/instrument.js  (FULL REPLACEMENT — disables route blocking; preserves safe tap-to-enter) */
(() => {
  "use strict";

  // --- DO NOT BLOCK ROUTES ---
  // Old behavior likely replaced pages with a "Not Found / not canonical" screen.
  // This replacement never overwrites page content based on pathname.

  // --- OPTIONAL: tap-anywhere-to-enter helper (only when explicitly marked) ---
  // Add: <body data-tap-enter="/home/">  (or any path) to enable.
  document.addEventListener(
    "click",
    (e) => {
      const body = document.body;
      if (!body) return;

      const tapEnter = body.getAttribute("data-tap-enter");
      if (!tapEnter) return;

      // ignore clicks on links/buttons/inputs
      const interactive = e.target.closest("a,button,input,textarea,select,label");
      if (interactive) return;

      // perform navigation
      window.location.href = tapEnter;
    },
    { capture: true }
  );

  // --- OPTIONAL: force real navigation even if other scripts try to hijack links ---
  // (Only matters if some leftover router script exists elsewhere.)
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;

      const href = a.getAttribute("href") || "";
      if (!href) return;

      // allow normal external/hash/mail/tel
      if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // force hard navigation
      e.stopImmediatePropagation();
      window.location.href = href;
    },
    { capture: true }
  );
})();
```0
