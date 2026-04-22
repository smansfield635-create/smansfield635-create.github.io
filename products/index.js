(() => {
  "use strict";

  const stage = document.getElementById("planetary-stage");
  const nodes = Array.from(document.querySelectorAll(".planet-node"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!stage || nodes.length === 0) {
    return;
  }

  const state = {
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    active: !reduceMotion.matches,
    rafId: 0,
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function readNode(node) {
    return {
      node,
      orbitX: Number(node.dataset.orbitX || 0),
      orbitY: Number(node.dataset.orbitY || 0),
      angle: Number(node.dataset.angle || 0),
      speed: Number(node.dataset.speed || 0),
      depthBias: Number(node.dataset.depthBias || 0),
    };
  }

  const orbiting = nodes.map(readNode);

  function syncStage() {
    const rect = stage.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
    state.centerX = rect.width * 0.5;
    state.centerY = rect.height * 0.5;
  }

  function getScaleFactor() {
    const widthFactor = clamp(state.width / 1220, 0.52, 1);
    const heightFactor = clamp(state.height / 900, 0.72, 1);
    return Math.min(widthFactor, heightFactor);
  }

  function getNodeBox(node) {
    const rect = node.getBoundingClientRect();
    return {
      width: rect.width || 168,
      height: rect.height || 172,
    };
  }

  function getResponsiveOrbit(item) {
    const factor = getScaleFactor();

    let orbitX = item.orbitX * factor;
    let orbitY = item.orbitY * factor;

    if (state.width <= 720) {
      orbitX *= 0.72;
      orbitY *= 0.78;
    } else if (state.width <= 980) {
      orbitX *= 0.86;
      orbitY *= 0.90;
    }

    return { orbitX, orbitY };
  }

  function placeNode(item, time) {
    const { orbitX, orbitY } = getResponsiveOrbit(item);
    const theta = item.angle + time * item.speed;

    const x = Math.cos(theta) * orbitX;
    const y = Math.sin(theta) * orbitY;

    const depth = (Math.sin(theta) + 1) * 0.5;
    const scale = 0.84 + depth * 0.16;
    const opacity = 0.78 + depth * 0.22;
    const zIndex = Math.round(20 + depth * 80 + item.depthBias);

    const box = getNodeBox(item.node);
    const left = state.centerX + x - box.width * 0.5;
    const top = state.centerY + y - box.height * 0.5;

    item.node.style.left = `${left}px`;
    item.node.style.top = `${top}px`;
    item.node.style.transform = `scale(${scale})`;
    item.node.style.opacity = String(opacity);
    item.node.style.zIndex = String(zIndex);
  }

  function render(time = 0) {
    orbiting.forEach((item) => placeNode(item, time));
  }

  function animate(time) {
    render(time);

    if (state.active) {
      state.rafId = window.requestAnimationFrame(animate);
    }
  }

  function stop() {
    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
  }

  function start() {
    stop();
    syncStage();

    if (reduceMotion.matches) {
      state.active = false;
      render(0);
      return;
    }

    state.active = true;
    state.rafId = window.requestAnimationFrame(animate);
  }

  function handleVisibility() {
    if (document.hidden) {
      stop();
      return;
    }

    start();
  }

  function handleResize() {
    syncStage();
    render(performance.now());
  }

  reduceMotion.addEventListener("change", start);
  window.addEventListener("resize", handleResize, { passive: true });
  window.addEventListener("orientationchange", handleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);

  start();
})();
