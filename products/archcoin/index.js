(function () {
  "use strict";

  const accordions = Array.from(document.querySelectorAll(".accordion"));
  if (!accordions.length) return;

  function setOpenState(item, shouldOpen) {
    item.classList.toggle("open", shouldOpen);
    const button = item.querySelector("button");
    if (button) {
      button.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    }
  }

  function openOnly(target) {
    accordions.forEach((item) => setOpenState(item, item === target));
  }

  accordions.forEach((item) => {
    const button = item.querySelector("button");
    if (!button) return;

    button.addEventListener("click", function () {
      const isOpen = item.classList.contains("open");
      if (isOpen) {
        setOpenState(item, false);
        return;
      }
      openOnly(item);
    });
  });
})();
