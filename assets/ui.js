document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("preload");
  document.querySelector("#app").classList.remove("hidden");

  const panel = document.getElementById("panel");

  document.querySelectorAll(".diamond.clickable").forEach(d => {
    d.addEventListener("click", () => {
      const key = d.dataset.open;
      panel.innerHTML = renderPanel(key);
      panel.classList.remove("hidden");
      panel.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
});

function renderPanel(key) {
  const map = {
    foundational: `
      <h2>Foundational</h2>
      <p>Core coherence anchors. No shortcuts.</p>
    `,
    philosophy: `
      <h2>Philosophy</h2>
      <p>Reasoning that collapses confusion.</p>
    `,
    breakthroughs: `
      <h2>Breakthroughs</h2>
      <p>History confirms coherence.</p>
    `,
    greatest: `
      <h2>Greatest</h2>
      <ul>
        <li>Arnold — Be the first</li>
        <li>Bannister — Boundary illusion</li>
        <li>Wright Brothers — Flight</li>
        <li>Edison — Light</li>
        <li>Tesla — Structure</li>
        <li>Einstein — Simplicity</li>
      </ul>
    `,
    laws: `
      <h2>Laws</h2>
      <p>Decompressed into inspectable diamonds.</p>
      <a href="/laws/">Open Laws</a>
    `
  };
  return map[key] || "";
}
