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

  const tabs = Array.from(orbit.querySelectorAll(".mm-family-tab"));
  if (tabs.length !== 4) {
    document.documentElement.dataset.mmRotationalTextStatus = "held-tab-count";
    return;
  }

  const labels = tabs.map(tab => tab.textContent.trim());
  if (JSON.stringify(labels) !== JSON.stringify(FAMILY_ORDER)) {
    document.documentElement.dataset.mmRotationalTextStatus = "held-family-identity";
    return;
  }

  orbit.dataset.mmRotationalTextOrbit = CONTRACT;
  orbit.dataset.mmCompassReference = SOURCE.referenceId;
  orbit.dataset.mmCompassAuthorityField = SOURCE.authorityFieldContract;
  orbit.dataset.mmCompassGeometryDisposition = SOURCE.geometryDisposition;
  orbit.dataset.mmCompassPhysicsDisposition = SOURCE.physicsDisposition;
  orbit.setAttribute("aria-roledescription", "rotational tab navigation");

  let activeIndex = Math.max(0, tabs.findIndex(tab => tab.getAttribute("aria-selected") === "true"));
  let pointerId = null;
  let startX = 0;
  let deltaX = 0;

  function slotFor(index) {
    return SLOT[(index - activeIndex + tabs.length) % tabs.length];
  }

  function applyPositions() {
    const styles = getComputedStyle(orbit);
    const rx = parseFloat(styles.getPropertyValue("--mm-orbit-rx")) || 280;
    const ry = parseFloat(styles.getPropertyValue("--mm-orbit-ry")) || 72;

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

  function select(index, {focus = true} = {}) {
    const next = (index + tabs.length) % tabs.length;
    if (next === activeIndex) {
      if (focus) tabs[next].focus({preventScroll:true});
      return;
    }
    activeIndex = next;
    tabs[next].click();
    applyPositions();
    if (focus) tabs[next].focus({preventScroll:true});
  }

  function step(direction) {
    select(activeIndex + direction);
  }

  tabs.forEach((tab, index) => {
    tab.dataset.mmRotationalTextTab = String(index + 1);
    tab.addEventListener("click", () => {
      activeIndex = index;
      requestAnimationFrame(applyPositions);
    });
    tab.addEventListener("keydown", event => {
      if (["ArrowRight","ArrowDown"].includes(event.key)) {
        event.preventDefault();
        step(1);
      } else if (["ArrowLeft","ArrowUp"].includes(event.key)) {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        select(0);
      } else if (event.key === "End") {
        event.preventDefault();
        select(tabs.length - 1);
      }
    });
  });

  orbit.addEventListener("pointerdown", event => {
    if (event.button !== undefined && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    deltaX = 0;
    orbit.dataset.mmDragging = "true";
    orbit.setPointerCapture?.(pointerId);
  });

  orbit.addEventListener("pointermove", event => {
    if (pointerId !== event.pointerId) return;
    deltaX = event.clientX - startX;
  });

  function finishPointer(event) {
    if (pointerId !== event.pointerId) return;
    const distance = deltaX;
    pointerId = null;
    deltaX = 0;
    orbit.dataset.mmDragging = "false";
    if (Math.abs(distance) >= 38) step(distance < 0 ? 1 : -1);
  }

  orbit.addEventListener("pointerup", finishPointer);
  orbit.addEventListener("pointercancel", finishPointer);

  const observer = new MutationObserver(() => {
    const selected = tabs.findIndex(tab => tab.getAttribute("aria-selected") === "true");
    if (selected >= 0 && selected !== activeIndex) {
      activeIndex = selected;
      applyPositions();
    }
  });

  tabs.forEach(tab => observer.observe(tab, {attributes:true, attributeFilter:["aria-selected"]}));
  addEventListener("resize", applyPositions, {passive:true});
  applyPositions();
})();
