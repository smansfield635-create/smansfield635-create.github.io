document.querySelectorAll("[data-expand]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.expand);
    target.classList.toggle("open");
  });
});
