(() => {
  "use strict";

  const host = document.getElementById("products-host");
  if (!host) return;

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) return;

  const coin = document.querySelector(".coinHero");
  const aai = document.querySelector(".aaiMark");

  let raf = 0;

  const tick = (time) => {
    const t = (time || 0) * 0.001;

    if (coin) {
      coin.style.transform = `rotate(${Math.sin(t * 0.92) * 5}deg)`;
    }

    if (aai) {
      aai.style.transform = `rotate(${45 + Math.sin(t * 0.74 + 0.8) * 7}deg)`;
    }

    raf = window.requestAnimationFrame(tick);
  };

  raf = window.requestAnimationFrame(tick);

  window.addEventListener(
    "pagehide",
    () => {
      window.cancelAnimationFrame(raf);
    },
    { once: true }
  );
})();
