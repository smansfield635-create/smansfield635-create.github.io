(() => {
  const stage = document.getElementById("products-stage");
  const stageMount = document.getElementById("products-stage-runtime");
  const bubblesMount = document.getElementById("products-bubbles-runtime");

  const planetFactory = window.ProductsPlanetRuntime;
  const bubblesFactory = window.ProductsBubblesRuntime;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  if (!stage || !stageMount || !bubblesMount || !planetFactory || !bubblesFactory) {
    return;
  }

  let planetRuntime = null;
  let bubblesRuntime = null;
  let rebuildTimer = 0;

  function destroyAll() {
    if (planetRuntime && typeof planetRuntime.destroy === "function") {
      planetRuntime.destroy();
    }
    if (bubblesRuntime && typeof bubblesRuntime.destroy === "function") {
      bubblesRuntime.destroy();
    }
    planetRuntime = null;
    bubblesRuntime = null;
  }

  function buildAll() {
    destroyAll();

    planetRuntime = planetFactory.create({
      stage,
      mount: stageMount,
      reducedMotion: reducedMotionQuery.matches
    });

    bubblesRuntime = bubblesFactory.create({
      mount: bubblesMount,
      reducedMotion: reducedMotionQuery.matches,
      mobileQuery
    });
  }

  function scheduleRebuild() {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = window.setTimeout(() => {
      buildAll();
    }, 80);
  }

  function onPreferenceChange() {
    scheduleRebuild();
  }

  buildAll();

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", onPreferenceChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(onPreferenceChange);
  }

  window.addEventListener("pagehide", destroyAll);
})();
