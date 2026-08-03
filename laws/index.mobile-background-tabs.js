/*
 * Laws root Rolodex placement and tablet depth-axis continuity.
 * Presentation only. The visitor-intent navigation remains in the full-width
 * root flow beneath the accepted Compass. Phone delivery remains unchanged.
 */

(() => {
  "use strict";

  const CONTRACT = "LAWS_ROOT_ROLODEX_PLACEMENT_CONTINUITY_v2";
  const TABLET_DEPTH_MEDIA = "(min-width: 781px) and (max-width: 1200px)";
  let originSnapshot = null;
  let depthMedia = null;
  let depthStage = null;
  let depthSwitcher = null;
  let depthFields = [];
  let depthButtons = [];
  let activeDepthIndex = 0;

  function viewportSnapshots() {
    return Array.from(document.querySelectorAll(".laws-rolodex-viewport")).map(viewport => ({
      viewport,
      scrollLeft: viewport.scrollLeft
    }));
  }

  function captureOrigin() {
    originSnapshot = {
      scrollX: globalThis.scrollX,
      scrollY: globalThis.scrollY,
      viewports: viewportSnapshots()
    };
  }

  function restoreOrigin() {
    if (!originSnapshot) return;
    const snapshot = originSnapshot;
    originSnapshot = null;
    requestAnimationFrame(() => {
      for (const entry of snapshot.viewports) {
        entry.viewport.scrollLeft = entry.scrollLeft;
      }
      globalThis.scrollTo(snapshot.scrollX, snapshot.scrollY);
    });
  }

  function installPresentationStyles() {
    if (document.querySelector("style[data-laws-rolodex-viewport-containment]")) return;

    const style = document.createElement("style");
    style.dataset.lawsRolodexViewportContainment = "true";
    style.textContent = `
html[data-laws-root-rolodex="active"] .laws-visitor-paths--rolodex {
  box-sizing: border-box !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100vw !important;
  contain: inline-size;
  overflow-x: clip !important;
}
html[data-laws-root-rolodex="active"] .laws-rolodex-field,
html[data-laws-root-rolodex="active"] .laws-rolodex-field__browser,
html[data-laws-root-rolodex="active"] .laws-rolodex-viewport {
  box-sizing: border-box !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}
html[data-laws-root-rolodex="active"] .laws-rolodex-track {
  width: max-content !important;
  min-width: 0 !important;
  max-width: none !important;
}
html[data-laws-root-rolodex="active"] .laws-rolodex-depth-switcher {
  display: none;
}
html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage {
  display: contents;
}
@media (min-width: 781px) and (max-width: 1200px) {
  html[data-laws-root-rolodex="active"] .laws-visitor-paths--rolodex[data-laws-tablet-depth-axis="active"] {
    gap: clamp(2.5rem, 5vw, 4rem) !important;
    padding-bottom: clamp(5rem, 9vw, 8rem) !important;
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-switcher {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .55rem;
    width: min(calc(100% - 2rem), 52rem);
    margin: 0 auto;
    padding: .45rem;
    border: 1px solid rgba(128, 224, 255, .2);
    border-radius: 999px;
    background: rgba(5, 13, 29, .76);
    box-shadow: 0 1.1rem 3rem rgba(0, 0, 0, .24);
    backdrop-filter: blur(16px);
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-tab {
    min-width: 0;
    min-height: 3.2rem;
    padding: .7rem .8rem;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: rgba(229, 238, 255, .64);
    font: inherit;
    font-size: clamp(.68rem, 1.35vw, .82rem);
    font-weight: 760;
    letter-spacing: .08em;
    line-height: 1.2;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 180ms ease, background 180ms ease, border-color 180ms ease, transform 180ms ease;
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-tab[aria-selected="true"] {
    border-color: rgba(128, 224, 255, .5);
    background: linear-gradient(135deg, rgba(116, 219, 255, .2), rgba(165, 130, 255, .18));
    color: rgba(245, 250, 255, .98);
    transform: translateY(-1px);
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-tab:focus-visible {
    outline: 2px solid rgba(128, 224, 255, .95);
    outline-offset: 3px;
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-areas: "depth-stack";
    align-items: start;
    width: 100%;
    min-width: 0;
    padding: clamp(1rem, 2.5vw, 2rem) clamp(1rem, 3vw, 2.5rem) clamp(5.5rem, 9vw, 8rem);
    perspective: 1100px;
    perspective-origin: 50% 22%;
    transform-style: preserve-3d;
    overflow: clip;
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage > .laws-rolodex-field {
    grid-area: depth-stack;
    position: relative;
    width: min(100%, 68rem) !important;
    margin-inline: auto;
    padding-inline: clamp(1rem, 2.8vw, 2.5rem) !important;
    border: 1px solid rgba(128, 224, 255, .14);
    border-radius: clamp(1.25rem, 2.2vw, 2rem);
    background: linear-gradient(145deg, rgba(8, 18, 38, .82), rgba(5, 11, 26, .68));
    box-shadow: 0 2rem 5rem rgba(0, 0, 0, .3);
    backface-visibility: hidden;
    transform-origin: 50% 8%;
    transition: transform 360ms cubic-bezier(.2, .75, .2, 1), opacity 260ms ease, filter 260ms ease;
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage > .laws-rolodex-field[data-laws-depth-state="active"] {
    z-index: 4;
    opacity: 1;
    filter: none;
    pointer-events: auto;
    transform: translate3d(0, 0, 0) scale(1);
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage > .laws-rolodex-field[data-laws-depth-state="previous"] {
    z-index: 2;
    opacity: .2;
    filter: saturate(.58) brightness(.72);
    pointer-events: none;
    transform: translate3d(-7%, 4.4rem, -210px) scale(.88);
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage > .laws-rolodex-field[data-laws-depth-state="next"] {
    z-index: 3;
    opacity: .34;
    filter: saturate(.72) brightness(.82);
    pointer-events: none;
    transform: translate3d(7%, 2.5rem, -115px) scale(.94);
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage > .laws-rolodex-field:not([data-laws-depth-state="active"]) .laws-rolodex-field__browser {
    opacity: 0;
    visibility: hidden;
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage > .laws-rolodex-field:not([data-laws-depth-state="active"]) .laws-rolodex-field__heading {
    max-width: min(72%, 34rem);
  }
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage > .laws-rolodex-field:not([data-laws-depth-state="active"]) .laws-rolodex-field__heading h3 {
    font-size: clamp(1.4rem, 3.2vw, 2.55rem);
  }
}
@media (max-width: 780px) {
  html[data-laws-root-rolodex="active"],
  html[data-laws-root-rolodex="active"] body,
  html[data-laws-root-rolodex="active"] .laws-shell,
  html[data-laws-root-rolodex="active"] .laws-estate {
    box-sizing: border-box !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
  }
  html[data-laws-root-rolodex="active"],
  html[data-laws-root-rolodex="active"] body {
    overflow-x: clip !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-tab,
  html[data-laws-root-rolodex="active"] .laws-rolodex-depth-stage > .laws-rolodex-field {
    transition: none !important;
  }
}
`;
    document.head.append(style);
  }

  function tabletDepthActive() {
    return Boolean(depthMedia && depthMedia.matches);
  }

  function groupLabel(field, index) {
    return field.querySelector(".laws-rolodex-field__heading > p")?.textContent?.trim()
      || field.querySelector(".laws-rolodex-field__heading h3")?.textContent?.trim()
      || `Destination group ${index + 1}`;
  }

  function normalizeDepthIndex(index) {
    const count = depthFields.length;
    return count ? ((index % count) + count) % count : 0;
  }

  function setFieldInteractive(field, interactive) {
    if (interactive) {
      field.removeAttribute("aria-hidden");
      if ("inert" in field) field.inert = false;
      else field.removeAttribute("inert");
      return;
    }

    field.setAttribute("aria-hidden", "true");
    if ("inert" in field) field.inert = true;
    else field.setAttribute("inert", "");
  }

  function publishDepthState(source) {
    globalThis.dispatchEvent(new CustomEvent("LAWS_TABLET_ROLODEX_DEPTH_CHANGED", {
      detail: Object.freeze({
        contract: CONTRACT,
        source,
        tabletDepthActive: tabletDepthActive(),
        activeIndex: activeDepthIndex,
        activeRolodexId: depthFields[activeDepthIndex]?.dataset.rolodexId || "",
        groupCount: depthFields.length,
        navigationAuthority: false,
        contentAuthority: false
      })
    }));
  }

  function applyDepthState(source = "selection", focusTab = false) {
    const active = tabletDepthActive();
    const section = document.querySelector("[data-laws-root-rolodex-section]");
    if (!section || !depthFields.length) return;

    section.dataset.lawsTabletDepthAxis = active ? "active" : "inactive";
    document.documentElement.dataset.lawsTabletRolodexDepthAxis = active ? "active" : "inactive";

    depthFields.forEach((field, index) => {
      if (!active) {
        field.removeAttribute("data-laws-depth-state");
        setFieldInteractive(field, true);
        return;
      }

      const relative = (index - activeDepthIndex + depthFields.length) % depthFields.length;
      const state = relative === 0 ? "active" : relative === 1 ? "next" : "previous";
      field.dataset.lawsDepthState = state;
      setFieldInteractive(field, state === "active");
    });

    depthButtons.forEach((button, index) => {
      const selected = active && index === activeDepthIndex;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected || !active ? 0 : -1;
    });

    if (focusTab && active) {
      depthButtons[activeDepthIndex]?.focus({ preventScroll: true });
    }

    publishDepthState(source);
  }

  function activateDepthGroup(index, source = "control", focusTab = false) {
    if (!depthFields.length) return;
    activeDepthIndex = normalizeDepthIndex(index);
    applyDepthState(source, focusTab);
  }

  function buildDepthSwitcher(section) {
    if (depthSwitcher) return;

    depthSwitcher = document.createElement("div");
    depthSwitcher.className = "laws-rolodex-depth-switcher";
    depthSwitcher.setAttribute("role", "tablist");
    depthSwitcher.setAttribute("aria-label", "Choose a Laws destination group");

    depthButtons = depthFields.map((field, index) => {
      field.id ||= `laws-rolodex-group-${field.dataset.rolodexId || index + 1}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "laws-rolodex-depth-tab";
      button.id = `laws-rolodex-depth-tab-${index + 1}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", field.id);
      button.textContent = groupLabel(field, index);
      field.setAttribute("aria-labelledby", button.id);

      button.addEventListener("click", () => activateDepthGroup(index, "tab-click"));
      button.addEventListener("keydown", event => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          activateDepthGroup(activeDepthIndex + 1, "tab-arrow-next", true);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          activateDepthGroup(activeDepthIndex - 1, "tab-arrow-previous", true);
        } else if (event.key === "Home") {
          event.preventDefault();
          activateDepthGroup(0, "tab-home", true);
        } else if (event.key === "End") {
          event.preventDefault();
          activateDepthGroup(depthFields.length - 1, "tab-end", true);
        }
      });

      depthSwitcher.append(button);
      return button;
    });

    section.insertBefore(depthSwitcher, depthStage);
  }

  function mountTabletDepthAxis() {
    const section = document.querySelector("[data-laws-root-rolodex-section]");
    if (!section) return false;

    const existingStage = section.querySelector(":scope > .laws-rolodex-depth-stage");
    if (existingStage) {
      depthStage = existingStage;
      depthFields = Array.from(depthStage.querySelectorAll(":scope > .laws-rolodex-field"));
    } else {
      const fields = Array.from(section.querySelectorAll(":scope > .laws-rolodex-field"));
      if (fields.length !== 3) return false;

      depthStage = document.createElement("div");
      depthStage.className = "laws-rolodex-depth-stage";
      depthStage.dataset.lawsRolodexDepthStage = "true";
      section.insertBefore(depthStage, fields[0]);
      fields.forEach(field => depthStage.append(field));
      depthFields = fields;
    }

    buildDepthSwitcher(section);

    if (!depthMedia && typeof matchMedia === "function") {
      depthMedia = matchMedia(TABLET_DEPTH_MEDIA);
      const onChange = () => applyDepthState("viewport-change");
      if (typeof depthMedia.addEventListener === "function") depthMedia.addEventListener("change", onChange);
      else if (typeof depthMedia.addListener === "function") depthMedia.addListener(onChange);
    }

    applyDepthState("mount");
    return true;
  }

  function placeRolodex() {
    const section = document.querySelector("[data-laws-root-rolodex-section]");
    if (!section) return false;

    installPresentationStyles();

    const useStage = document.querySelector(".laws-use-stage[data-laws-experience-stage='use']");
    if (useStage) {
      useStage.replaceWith(section);
    } else {
      const hero = document.querySelector("[data-laws-experience-stage='hero']");
      if (hero?.parentElement && section.previousElementSibling !== hero) hero.after(section);
    }

    section.dataset.lawsExperienceVisible = "true";
    document.querySelector(".laws-accessibility-note")?.remove();

    const footerDescription = document.querySelector(".laws-footer > div > span");
    if (footerDescription) {
      footerDescription.textContent = "Choose a direction in the Compass or continue to a destination.";
    }

    mountTabletDepthAxis();

    document.documentElement.dataset.lawsRolodexPlacement = "full-width-root-flow";
    globalThis.dispatchEvent(new CustomEvent("LAWS_ROLODEX_PLACEMENT_READY", {
      detail: Object.freeze({
        contract: CONTRACT,
        fullWidthRootFlow: true,
        redundantUseStageVisible: false,
        runtimeCustodyNoteVisible: false,
        viewportContained: true,
        tabletDepthAxisAvailable: Boolean(depthStage && depthFields.length === 3),
        tabletDepthAxisActive: tabletDepthActive(),
        navigationAuthority: false,
        contentAuthority: false
      })
    }));
    return true;
  }

  function initialize() {
    placeRolodex();
    globalThis.addEventListener("LAWS_ROOT_ROLODEX_READY", placeRolodex);
    globalThis.addEventListener("LAWS_ROLODEX_EXHIBIT_OPENED", captureOrigin);
    globalThis.addEventListener("LAWS_ROLODEX_EXHIBIT_CLOSED", restoreOrigin);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
