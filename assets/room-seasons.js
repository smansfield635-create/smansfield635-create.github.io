(() => {
  "use strict";

  const root = document.documentElement;
  const season = root.getAttribute("data-season");
  if (!season) return;

  root.setAttribute("data-season-ready", "true");

  const body = document.body;
  if (!body) return;

  if (!body.querySelector(".season-particles")) {
    const particles = document.createElement("div");
    particles.className = "season-particles";
    particles.setAttribute("aria-hidden", "true");
    body.prepend(particles);
  }

  const decoClass =
    season === "spring" ? "season-bloom" :
    season === "summer" ? "season-sunflare" :
    season === "autumn" ? "season-leaf" :
    "season-frost";

  if (!body.querySelector(`.${decoClass}`)) {
    const positions = [
      { top: "14%", left: "10%" },
      { top: "24%", right: "8%" },
      { bottom: "12%", left: "14%" },
      { bottom: "16%", right: "10%" }
    ];

    positions.forEach((pos) => {
      const el = document.createElement("div");
      el.className = decoClass;
      Object.entries(pos).forEach(([k, v]) => {
        el.style[k] = v;
      });
      body.appendChild(el);
    });
  }
})();
