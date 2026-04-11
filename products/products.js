(() => {
  const stage = document.getElementById("products-stage");
  const runtimeMount = document.getElementById("products-stage-runtime");
  const runtimeFactory = window.ProductsPlanetRuntime;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!stage || !runtimeMount || !runtimeFactory || typeof runtimeFactory.create !== "function") {
    return;
  }

  let runtime = null;
  let rebuildTimer = 0;

  function destroyRuntime() {
    if (runtime && typeof runtime.destroy === "function") {
      runtime.destroy();
    }
    runtime = null;
  }

  function buildRuntime() {
    destroyRuntime();
    runtime = runtimeFactory.create({
      stage,
      mount: runtimeMount,
      reducedMotion: media.matches
    });
  }

  function scheduleRebuild() {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = window.setTimeout(() => {
      buildRuntime();
    }, 80);
  }

  function handleMotionPreferenceChange() {
    scheduleRebuild();
  }

  buildRuntime();

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof media.addListener === "function") {
    media.addListener(handleMotionPreferenceChange);
  }

  window.addEventListener("pagehide", destroyRuntime);
})();
