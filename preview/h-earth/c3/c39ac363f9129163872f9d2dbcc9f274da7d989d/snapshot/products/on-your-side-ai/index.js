// TNT — /products/on-your-side-ai/index.js
// ON YOUR SIDE AI — G1V1 NEW CONTRACT
// LEGACY/NEW MERGE
// SCOPE:
//   - page-local enhancement only
//   - no global runtime touches
//   - no ownership of product law or route truth
//   - buffet-style FAQ control: open one, many, or all; close any

(() => {
  "use strict";

  const backButton = document.getElementById("backButton");
  const faqToggles = Array.from(document.querySelectorAll(".faqToggle"));
  const primaryButtons = Array.from(document.querySelectorAll(".actionBtn--primary"));

  function handleBackNavigation() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "/products/";
  }

  function setFaqState(item, toggle, isOpen) {
    item.classList.toggle("isOpen", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function toggleFaq(toggle) {
    const item = toggle.closest(".faqItem");
    if (!item) return;

    const isOpen = item.classList.contains("isOpen");
    setFaqState(item, toggle, !isOpen);
  }

  function bindPrimaryButtons() {
    primaryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        button.style.transform = "scale(0.98)";
        window.setTimeout(() => {
          button.style.transform = "";
        }, 120);
      });
    });
  }

  function init() {
    if (backButton) {
      backButton.addEventListener("click", handleBackNavigation);
    }

    faqToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => toggleFaq(toggle));
    });

    bindPrimaryButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
