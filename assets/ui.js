/* ======================================
   GEODIAMETRICS UI — FREE WILL INTERACTION
====================================== */

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("[data-expand]").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const target = document.getElementById(trigger.dataset.expand);
      if (!target) return;
      target.classList.toggle("open");
    });
  });

});
