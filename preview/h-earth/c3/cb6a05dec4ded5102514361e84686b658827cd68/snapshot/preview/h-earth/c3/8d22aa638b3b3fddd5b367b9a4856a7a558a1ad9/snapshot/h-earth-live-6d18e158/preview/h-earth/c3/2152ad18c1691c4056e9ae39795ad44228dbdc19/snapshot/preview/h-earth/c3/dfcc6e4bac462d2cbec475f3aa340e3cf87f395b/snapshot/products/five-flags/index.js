// TNT — /products/five-flags/index.js
// FIVE FLAGS — G1V1 NEW CONTRACT
// SCOPE:
//   - page-local enhancement only
//   - no global runtime touches
//   - no ownership of product law or route truth

(() => {
  "use strict";

  const backButton = document.getElementById("backButton");
  const faqToggles = Array.from(document.querySelectorAll(".faqToggle"));
  const assetButtons = Array.from(document.querySelectorAll("[data-asset]"));
  const detailButtons = Array.from(document.querySelectorAll("[data-detail]"));

  function handleBackNavigation() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "/products/";
  }

  function closeFaq(item, toggle) {
    item.classList.remove("isOpen");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openFaq(item, toggle) {
    item.classList.add("isOpen");
    toggle.setAttribute("aria-expanded", "true");
  }

  function toggleFaq(toggle) {
    const item = toggle.closest(".faqItem");
    if (!item) return;

    const isOpen = item.classList.contains("isOpen");

    faqToggles.forEach((otherToggle) => {
      const otherItem = otherToggle.closest(".faqItem");
      if (!otherItem || otherItem === item) return;
      closeFaq(otherItem, otherToggle);
    });

    if (isOpen) {
      closeFaq(item, toggle);
    } else {
      openFaq(item, toggle);
    }
  }

  function normalizeLabel(value) {
    return String(value || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function showPendingLinkMessage(label) {
    window.alert(`${label} is a named asset surface, but its final destination link is not yet bound on this page.`);
  }

  function bindAssetButtons() {
    assetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const label = normalizeLabel(button.dataset.asset);
        showPendingLinkMessage(label);
      });
    });

    detailButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const label = normalizeLabel(button.dataset.detail);
        window.alert(`${label} details are held inside the current product contract, but no expanded detail surface is bound yet.`);
      });
    });
  }

  function bindFaq() {
    faqToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => toggleFaq(toggle));
    });
  }

  function init() {
    if (backButton) {
      backButton.addEventListener("click", handleBackNavigation);
    }
    bindFaq();
    bindAssetButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
