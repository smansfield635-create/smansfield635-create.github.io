(() => {
  "use strict";

  const CONTRACT = "METHODS_MODELS_ROTATIONAL_TEXT_INSTRUMENT_v1";
  const SOURCE = Object.freeze({
    referenceId: "R_C_LAWS_COMPASS_SIX_AUTHORITY",
    controllerPath: "/laws/index.controller.js",
    authorityFieldContract: "LAWS_COMPASS_EXACT_TWO_OBJECT_FIELD_v2",
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    fixedCenterExcluded: true,
    geometryDisposition: "ADOPT_EXISTING_COMPASS_GEOMETRY_WITHOUT_REIMPLEMENTATION",
    physicsDisposition: "ADOPT_EXISTING_COMPASS_MOTION_LAWS_WITHOUT_REDERIVATION"
  });

  const FAMILY_ORDER = Object.freeze([
    "Structural Envelope",
    "Pressure / Capacity",
    "Closure / Flow",
    "Method / Falsification"
  ]);

  const SLOT = Object.freeze([
    Object.freeze({name:"front",x:0,y:1,z:0,scale:1,opacity:1,layer:4}),
    Object.freeze({name:"right",x:1,y:0,z:0,scale:.88,opacity:.82,layer:3}),
    Object.freeze({name:"rear",x:0,y:-1,z:0,scale:.74,opacity:.48,layer:1}),
    Object.freeze({name:"left",x:-1,y:0,z:0,scale:.88,opacity:.82,layer:3})
  ]);

  const orbit = document.querySelector("[data-mm-family-tabs]");
  if (!orbit) return;

  orbit.dataset.mmRotationalTextOrbit = CONTRACT;
  orbit.dataset.mmCompassReference = SOURCE.referenceId;
  orbit.dataset.mmCompassAuthorityField = SOURCE.authorityFieldContract;
  orbit.dataset.mmCompassGeometryDisposition = SOURCE.geometryDisposition;
  orbit.dataset.mmCompassPhysicsDisposition = SOURCE.physicsDisposition;
  orbit.setAttribute("aria-roledescription", "rotational tab navigation");

  let tabs = [];
  let activeIndex = 0;
  let pointerId = null;
  let startX = 0;
  let deltaX = 0;
  let applyQueued = false;

  function refreshTabs() {
    const next = Array.from(orbit.querySelectorAll(".mm-family-tab"));
    if (next.length !== FAMILY_ORDER.length) {
      document.documentElement.dataset.mmRotationalTextStatus = "held-tab-count";
      return false;
    }

    const labels = next.map(tab => tab.textContent.trim());
    if (JSON.stringify(labels) !== JSON.stringify(FAMILY_ORDER)) {
      document.documentElement.dataset.mmRotationalTextStatus = "held-family-identity";
      return false;
    }

    tabs = next;
    tabs.forEach((tab, index) => {
      tab.dataset.mmRotationalTextTab = String(index + 1);
    });

    const selected = tabs.findIndex(tab => tab.getAttribute("aria-selected") === "true");
    if (selected >= 0) activeIndex = selected;
    return true;
  }

  function slotFor(index) {
    return SLOT[(index - activeIndex + FAMILY_ORDER.length) % FAMILY_ORDER.length];
  }

  function resolveOrbitLength(styles, property, dimension, fallback) {
    const raw = styles.getPropertyValue(property).trim();
    if (!raw) return fallback;
    if (/^-?(?:\d+|\d*\.\d+)px$/i.test(raw)) {
      const px = Number.parseFloat(raw);
      return Number.isFinite(px) && px > 0 ? px : fallback;
    }

    const probe = document.createElement("i");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;left:-10000px;top:-10000px;visibility:hidden;pointer-events:none;margin:0;padding:0;border:0;";
    probe.style[dimension] = raw;
    document.body.append(probe);
    const rect = probe.getBoundingClientRect();
    probe.remove();
    const px = dimension === "width" ? rect.width : rect.height;
    return Number.isFinite(px) && px > 0 ? px : fallback;
  }

  function applyPositions() {
    applyQueued = false;
    if (!refreshTabs()) return;

    const styles = getComputedStyle(orbit);
    const rx = resolveOrbitLength(styles, "--mm-orbit-rx", "width", 280);
    const ry = resolveOrbitLength(styles, "--mm-orbit-ry", "height", 72);

    tabs.forEach((tab, index) => {
      const slot = slotFor(index);
      tab.dataset.mmOrbitDepth = slot.name;
      tab.dataset.mmOrbitVector = `${slot.x},${slot.y},${slot.z}`;
      tab.style.setProperty("--mm-x", `${slot.x * rx}px`);
      tab.style.setProperty("--mm-y", `${-slot.y * ry}px`);
      tab.style.setProperty("--mm-z", `${slot.name === "front" ? 72 : slot.name === "rear" ? -72 : 0}px`);
      tab.style.setProperty("--mm-scale", String(slot.scale));
      tab.style.setProperty("--mm-opacity", String(slot.opacity));
      tab.style.setProperty("--mm-layer", String(slot.layer));
      tab.tabIndex = index === activeIndex ? 0 : -1;
    });

    orbit.setAttribute("aria-label", `Model families. Active: ${FAMILY_ORDER[activeIndex]}`);
    document.documentElement.dataset.mmRotationalTextStatus = "ready";
    document.documentElement.dataset.mmRotationalTextActive = String(activeIndex);
  }

  function queueApply() {
    if (applyQueued) return;
    applyQueued = true;
    requestAnimationFrame(applyPositions);
  }

  function select(index, {focus = true} = {}) {
    if (!refreshTabs()) return;
    const next = (index + FAMILY_ORDER.length) % FAMILY_ORDER.length;
    if (next === activeIndex) {
      if (focus) tabs[next].focus({preventScroll:true});
      return;
    }

    const target = tabs[next];
    target.click();
    queueApply();
    if (focus) {
      requestAnimationFrame(() => {
        if (refreshTabs()) tabs[next]?.focus({preventScroll:true});
      });
    }
  }

  function step(direction) {
    select(activeIndex + direction);
  }

  orbit.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      step(-1);
    } else if (["ArrowRight","ArrowLeft","Home","End"].includes(event.key)) {
      queueApply();
    }
  });

  orbit.addEventListener("pointerdown", event => {
    if (event.button !== undefined && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    deltaX = 0;
    orbit.dataset.mmDragging = "false";
  });

  orbit.addEventListener("pointermove", event => {
    if (pointerId !== event.pointerId) return;
    deltaX = event.clientX - startX;
    if (Math.abs(deltaX) >= 8) {
      orbit.dataset.mmDragging = "true";
      if (orbit.setPointerCapture && !orbit.hasPointerCapture?.(pointerId)) orbit.setPointerCapture(pointerId);
    }
  });

  function finishPointer(event) {
    if (pointerId !== event.pointerId) return;
    const distance = deltaX;
    const completedPointerId = pointerId;
    pointerId = null;
    deltaX = 0;
    orbit.dataset.mmDragging = "false";
    if (orbit.releasePointerCapture && orbit.hasPointerCapture?.(completedPointerId)) {
      orbit.releasePointerCapture(completedPointerId);
    }
    if (Math.abs(distance) >= 38) step(distance < 0 ? 1 : -1);
  }

  orbit.addEventListener("pointerup", finishPointer);
  orbit.addEventListener("pointercancel", finishPointer);

  addEventListener("METHODS_MODELS_SHOWROOM_CHANGED", event => {
    const familyIndex = Number(event.detail?.familyIndex);
    if (Number.isInteger(familyIndex) && familyIndex >= 0 && familyIndex < FAMILY_ORDER.length) {
      activeIndex = familyIndex;
    }
    queueApply();
  });

  const observer = new MutationObserver(queueApply);
  observer.observe(orbit, {
    childList:true,
    subtree:true,
    attributes:true,
    attributeFilter:["aria-selected"]
  });

  addEventListener("resize", queueApply, {passive:true});
  applyPositions();
})();
