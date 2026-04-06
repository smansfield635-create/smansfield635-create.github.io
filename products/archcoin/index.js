// TNT — /products/archcoin/index.js
// ARCHCOIN DESTINATION PAGE — JS AUTHORITY
// SCOPE:
//   - own page-local behavior only
//   - keep single-page responsibility
//   - no global runtime touches

(() => {
  "use strict";

  const backButton = document.getElementById("backButton");

  function handleBackNavigation() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "/products/";
  }

  if (backButton) {
    backButton.addEventListener("click", handleBackNavigation);
  }
})();
