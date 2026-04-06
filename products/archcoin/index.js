// TNT — /products/archcoin/index.js
// ARCHCOIN — FIRST-CLASS FIRST-PASS PRODUCT PAGE
// SCOPE:
//   - page-local enhancement only
//   - no global runtime touches
//   - no route reinterpretation

(() => {
  "use strict";

  const backButton = document.getElementById("backButton");
  const faqToggles = Array.from(document.querySelectorAll(".faq-toggle"));
  const meterFill = document.getElementById("meterFill");
  const accents = Array.from(document.querySelectorAll(".js-accent"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function handleBackNavigation() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "/products/";
  }

  function closeFaq(item, toggle) {
    item.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openFaq(item, toggle) {
    item.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function toggleFaq(currentToggle) {
    const currentItem = currentToggle.closest(".faq-item");
    if (!currentItem) return;

    const isOpen = currentItem.classList.contains("is-open");

    faqToggles.forEach((toggle) => {
      const item = toggle.closest(".faq-item");
      if (!item) return;
      if (item !== currentItem) closeFaq(item, toggle);
    });

    if (isOpen) {
      closeFaq(currentItem, currentToggle);
    } else {
      openFaq(currentItem, currentToggle);
    }
  }

  function animateReadiness() {
    if (!meterFill) return;
    if (reduceMotion) {
      meterFill.style.width = "95%";
      return;
    }

    meterFill.style.width = "0%";
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        meterFill.style.transition = "width 900ms ease";
        meterFill.style.width = "95%";
      });
    });
  }

  function bindHeroAccentMotion() {
    if (reduceMotion || accents.length === 0) return;

    let ticking = false;

    function updateAccent(offsetX, offsetY) {
      accents.forEach((node, index) => {
        const factor = index === 0 ? 1 : 0.7;
        const moveX = offsetX * factor;
        const moveY = offsetY * factor;
        node.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
      ticking = false;
    }

    function onPointerMove(event) {
      if (ticking) return;
      const vw = Math.max(window.innerWidth, 1);
      const vh = Math.max(window.innerHeight, 1);
      const offsetX = ((event.clientX / vw) - 0.5) * 8;
      const offsetY = ((event.clientY / vh) - 0.5) * 8;
      ticking = true;
      window.requestAnimationFrame(() => updateAccent(offsetX, offsetY));
    }

    function resetAccent() {
      accents.forEach((node) => {
        node.style.transform = "translate3d(0,0,0)";
      });
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", resetAccent, { passive: true });
    window.addEventListener("blur", resetAccent, { passive: true });
  }

  function bindActions() {
    if (backButton) {
      backButton.addEventListener("click", handleBackNavigation);
    }

    faqToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => toggleFaq(toggle));
    });
  }

  function init() {
    bindActions();
    animateReadiness();
    bindHeroAccentMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
